通过前面两节的介绍，Redis 对网络事件、时间事件这两种事件的抽象和核心处理框架，我们已经都有所了解了。但是，我们现在还有几个细节部分是缺失的，例如：

-   Redis 通过 initServer() 之后，已经在 6379 端口号上进行监听了，那 Redis 客户端发来建连请求的时候，Redis Server 是如何处理的呢？

-   Redis 客户端与 Redis Server 创建连接成功之后，这些新建连接又是如何再注册到 I/O 多路复用模块上的呢？上面这两个问题呢，都可以在之前注册的 acceptTcpHandler() 回调函数中找到对应的答案。
-   客户端与 Redis Server 建连之后，必然是要执行命令的，前面介绍 Redis 线程模型的时候也说过，这些命令是由 IO 线程读取并解析的，具体的解析逻辑是什么样的？解析的命令是怎么交给主线程执行的呢？主线程执行完命令之后，是怎么把返回值交给 IO 线程的？IO 线程又是怎么返回到 Redis 客户端的呢？

上面这些问题我们将用接下来四节的篇幅，全部说清楚，并且在说明这些问题的时候，也会将之前留的坑填好，比如说：

-   aeFileEvent 中的 rfileProc 和 wfileProc 字段都指向了哪些处理函数？
-   在 aeProcessEvents() 函数中回调的 beforesleep、aftersleep 函数具体做了什么事情呢？

## 建连请求处理入口

通过上一节的介绍我们知道，Redis 初始化完成之后，默认就会在 6379 端口号上进行监听可读事件，也就是客户端发来的建连请求。在初始化中，createSocketAcceptHandler() 函数在注册监听的时候，只监听了可读事件，还会将 acceptTcpHandler() 函数作为处理可读事件的回调函数，记录到对应 aeFileEvent 事件的 rfileProc 字段中，wfileProc 字段没有初始化。这样的话，`处理客户端建连请求的逻辑我们就到找了，就是  acceptTcpHandler() 函数`。

下面我们就展开看一下 acceptTcpHandler() 函数，其核心是一个 while 循环，里面会处理连接建立请求，具体代码如下：

```c
void acceptTcpHandler(aeEventLoop *el, int fd, void *privdata, int mask) {

    // cport用于存储端口，cfd用于存储新建连接对应的文件描述符

    int cport, cfd, max = 1000; 

    char cip[NET_IP_STR_LEN]; // 存储ip地址的缓冲器

    while(max--) { // 可能存在多个客户端的建连请求，所以需要一直循环

        // anetTcpAccept()底层先通过accept()创建连接，然后通过inet_ntop()

        // 以及ntohs()等函数将ip和端口信息写入到cip和cport返回，

        // 同时anetTcpAccept()函数的返回值就是新建连接对应的文件描述符

        cfd = anetTcpAccept(server.neterr, fd, cip, sizeof(cip), 

                  &cport);

        if (cfd == -1) { return; } // 全部建连请求处理完毕，返回

        anetCloexec(cfd); // 设置FD_CLOEXEC标识

        // 先通过connCreateAcceptedSocket()创建connection实例表示新建的网络

        // 连接，然后使用acceptCommonHandler()进行初始化

        acceptCommonHandler(connCreateAcceptedSocket(cfd),0,cip);

    }

}
```

anetTcpAccept() 函数是在 anet.c 文件中的工具类，里面主要是依赖 accept()、inet_ntop()、ntohs() 等系统调用，上面的注释也解释清楚了其核心功能，这里不再展开分析。

## connection 与 connectionType 详解

接下来是 connCreateAcceptedSocket() 函数，它里面会创建一个 connection 实例，这个 connection 的 fd 字段指向我们新建连接对应的文件描述符。**connection 结构体是 Redis 对一个网络连接的抽象**，其核心字段含义如下：

```c
struct connection {

    // 当前网络连接的类型，其中记录了非常多的回调函数，下面会展开介绍

    ConnectionType *type; 

    // 当前连接所处的状态，例如，在acceptTcpHandler()函数中刚刚创建的连接

    // 初始化为CONN_STATE_ACCEPTING状态，后续建连完成之后就切换为

    // CONN_STATE_CONNECTED状态。

    ConnectionState state; 

    short int flags; // 标识符

    short int refs; // 当前连接被引用的次数

    int last_errno; // 最后一次发生的错误码

    // 当前连接关联的信息，该字段指向客户端对应的client实例

    void *private_data; 

    // 下面是该连接在connect、read、write截断的回调函数，其实，aeFileEvent中的

    // rfileProc、wfileProc两个字段指向的就是read_handler、write_handler这两个函数

    ConnectionCallbackFunc conn_handler;

    ConnectionCallbackFunc write_handler;

    ConnectionCallbackFunc read_handler;

    int fd; // 该连接对应的文件描述符

};
```

在 connection 结构体中，需要展开介绍的是 ConnectionType 结构体，其中维护了多个的函数指针，类似于接口的设计，具体实现主要有两个，一个是 `CT_Socket`，另一个是 `CT_TLS`，分别对应了普通的 Socket 连接以及安全 Socket 连接。不同类型的连接虽然都有建连、读写数据等这些基本操作，但是到了细节实现处，还是会有所不同，比如说，建连的时候，安全 Socket 除了完成普通 Socket 的握手操作，还需要进行交换秘钥等额外的操作。**正是由于这种流程上的相同，具体实现上细节的不同，所以 Redis 才做出了 `ConnectionType` 这种类似于模板方法模式的设计**。

下面我们就来看看 ConnectionType 结构体中核心函数的含义：

```c
typedef struct ConnectionType {

    // 前面说createSocketAcceptHandler()的时候，aeFileEvent里面有rfileProc

    // 指向了acceptHandler这个函数，wfileProc指向null。而与客户端建连的connection

    // 里面，无论是监听可读事件还是可写事件，都是用这个ae_handler函数作为处理函数，也就是

    // 注册的aeFileEvent的rfileProc、wfileProc指针都指向这个ae_handler函数

    void (*ae_handler)(struct aeEventLoop *el, int fd, void *clientData, 

            int mask);

            

    // 封装了处理发起连接的逻辑，主要是作为客户端的时候用，比如说从库主动连接主库

    int (*connect)(struct connection *conn, const char *addr, int port,

            const char *source_addr, ConnectionCallbackFunc connect_handler);

            

    // 封装了从连接读取数据，以及向连接中写入数据的函数。这里的writev函数底层调用了Linux的

    // writev()，可以一次向Socket写入多块连续不同的buffer空间，可以减少系统调用的次数

    int (*write)(struct connection *conn, const void *data, size_t data_len);

    int (*writev)(struct connection *conn, const struct iovec *iov, 

            int iovcnt);

    int (*read)(struct connection *conn, void *buf, size_t buf_len);

    

    // 封装了Server处理建连请求的逻辑

    int (*accept)(struct connection *conn, 

            ConnectionCallbackFunc accept_handler);

    void (*close)(struct connection *conn);

    // 用于设置connection中的读写回调函数，也就是write_handler、read_handler函数

    int (*set_write_handler)(struct connection *conn, 

            ConnectionCallbackFunc handler, int barrier);

    int (*set_read_handler)(struct connection *conn, 

            ConnectionCallbackFunc handler);

    const char *(*get_last_error)(struct connection *conn);

    ... // 下面是阻塞版本的读写函数以及connect函数(略)

    

} ConnectionType;
```

CT_Socket 作为我们最常用的实现，在后面介绍的时候，我们就以 CT_Socket 这个 ConnectionType 实现为例进行深入的介绍。

这里先帮小伙伴们梳理一下 ConnectionType->ae_handler、connection. write_handler 和 read_handler 以及 aeFileEvent->rfileProc 和 wfileProc 之间的关系，读写请求关键调用链如下图所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e8fa7bd8ac34f478da569190722dc03~tplv-k3u1fbpfcp-watermark.image?)

可以看到，在读取客户端请求的时候，触发的是 rfileProc 函数，它实际指向的 ConnectionType->ae_handler 函数，其中会调用 connection.read_hander 指针指向的函数，也就是 readQueryFromClient() 函数。Redis Server 向连接写回数据的时候，也是类似的调用链，这里就不再多说了。

## 连接初始化

说完 connection 以及 ConnectionType 这两个核心结构体之后，我们继续回到建连流程分析。在为新建连接创建完对应的 connection 实例之后，再来看 `acceptCommonHandler() 函数`，其核心操作以及详细的说明如下：

```c
static void acceptCommonHandler(connection *conn, int flags, char *ip) {

    client *c;

    char conninfo[100];

    UNUSED(ip);

    ... // 检查connection状态是否处于CONN_STATE_ACCEPTING(略)



    ... // 检查当前连接数是否已经达到server.maxclients指定的连接上限，这里的

    // maxclients是当前Redis实例与客户端以及集群其他实例之间的总连接数。(略)



    // 调用createClient()创建一个client实例，并注册监听新建连接的可读事件，

    // 对应的处理函数为ae_handler。同时将readQueryFromClient注册为

    // ConnectionType实例的set_read_handler回调函数，从名字可以看出，

    // readQueryFromClient函数可以读取客户端发来的请求数据。client实例创建

    // 完成之后，会被添加到当前Redis实例的客户端链表中，等待后续使用。

    if ((c = createClient(conn)) == NULL) {

        connClose(conn);

        return;

    }

    c->flags |= flags;



    // 这里有点绕，connAccept()函数会调用conn->type->accept()函数，

    // CT_Socket.accept字段指向的是connSocketAccept函数，该函数会将连接状态切

    // 换为CONN_STATE_CONNECTED状态，并直接调用传入的clientAcceptHandler

    // clientAcceptHandler()函数中并没有什么有用的功能，这里不展开

    if (connAccept(conn, clientAcceptHandler) == C_ERR) {

        ... // 省略错误处理逻辑

        return;

    }

}
```

我们先展开介绍一下 `createClient() 函数`，它创建 client 实例的步骤如下。

首先，创建一个 client 实例，并对 client 和 connection 进行一系列设置。比如，给 client 初始化一个 id，这个 id 是通过 server.next_client_id 字段的原子操作递增得到的，小伙伴们可以将它理解成 Java 里面的 AtomicLong；将新建连接设置为非阻塞的；将 client 的 conn 字段指向 connection 实例，将 connection.private_data 指向 client 实例，**两者就绑定起来了**。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36158c1ce17c45d98fe74dbf97951dbb~tplv-k3u1fbpfcp-watermark.image?)

之后，就是调用 CT_Socket->set_read_handler，也就是 connSocketSetReadHandler() 函数。它里面主要做了以下两件事。

-   一件事是将连接注册到 I/O 多路复用模块上，并监听可读事件，可读事件的处理函数注册为 CT_Socket->ae_handler 这个函数指针，当前这个流程里面指向的实际就是 connSocketEventHandler() 函数。

-   另一件事是将 readQueryFromClient() 函数注册为 connection 实例的 read_handler 回调函数，从名字可以看出，readQueryFromClient 函数可以读取客户端发来的请求数据。这样设置完之后，就符合我们前面给出的“读写请求关键调用链图”了。

完成上述初始化操作之后，Redis 就会将这个初始化好的 client 实例添加到客户端链表里面。注意，这里有`两个列表`：一个是 redisServer.clients 这个 adlist 链表，新建的 client 实例会加到链表末尾；另一个是 redisServer.clients_index，它是一个 rax 树，其中的 key 是 client 的 id 值，对应的 value 值是 client 实例的指针，通过这棵 rax 树，我们就可以按照 id 值迅速查找对应的 client 实例了。

下面是 createClient() 函数的核心代码片段：

```c
client *createClient(connection *conn) {

    client *c = zmalloc(sizeof(client)); // 创建client实例



    if (conn) { // 对新建连接进行一些列配置

        connNonBlock(conn); // 将连接设置为非阻塞

        connEnableTcpNoDelay(conn); // 设置TCP_NODELAY

        if (server.tcpkeepalive)

            connKeepAlive(conn,server.tcpkeepalive); // 设置keeplive

        // 调用CT_Socket->set_read_handler回调函数

        connSetReadHandler(conn, readQueryFromClient); 

        // 设置connection->private_data，与client绑定

        connSetPrivateData(conn, c); 

    }



    selectDb(c,0); // 默认使用0号DB

    uint64_t client_id; 

    atomicGetIncr(server.next_client_id, client_id, 1); // 自增生成client.id

    c->id = client_id;

    ... // 初始化client实例的各个字段(略)

    if (conn) linkClient(c); // 将client记录到server.clients列表中

    return c;

}
```

小伙伴们可能没看到新连接注册到 I/O 多路复用模块上的操作，其实这部分操作在 CT_Socket->set_read_handler 指向的 connSocketSetReadHandler() 函数中，入口位置是上面的 connSetReadHandler() 函数。下面是 `connSocketSetReadHandler() 函数`的核心代码片段和关键注释：

```c
static int connSocketSetReadHandler(connection *conn, 

      ConnectionCallbackFunc func) {

    ... // 省略检查

    // 设置read_handler这个函数指针，这里会指向readQueryFromClient()函数

    conn->read_handler = func; 

    if (!conn->read_handler) // 未设置read_handler就不再监听可读事件

        aeDeleteFileEvent(server.el,conn->fd,AE_READABLE);

    else 

        // 下面创建相应的aeFileEvent实例，并开始监听可读事件，

        // 监听到可读事件的回调是ae_handler这个函数，这里其实指向的就是

        // connSocketEventHandler()函数

        if (aeCreateFileEvent(server.el,conn->fd, AE_READABLE,

            conn->type->ae_handler,conn) == AE_ERR) return C_ERR;

    return C_OK;

}
```

建连过程的最后一步，也是 acceptTcpHandler() 函数的最后一步，是调用 conn->type->accept() 这个函数指针，实际就是调用 connSocketAccept() 函数。它里面会切换 connection 的状态，从初始化时候的 ACCEPTING 切换成 CONNECTED 状态。另外，这里还会回调 clientAcceptHandler()函数，其中没有什么特别关键的逻辑，这里就不展开分析了。

## 总结

这一节中，我们重点介绍了 Redis Server 网络层建连的流程。首先，我和小伙伴们一起找到了建连请求的处理入口；然后分析了建连过程中，使用到的 connection 以及 connectionType 结构体，介绍了其中涉及到的设计模式；最后，讲解了连接初始化过程中 connection 以及 client 的初始化。

下一节，我们将介绍建连之后，Redis Server 读取请求的逻辑。