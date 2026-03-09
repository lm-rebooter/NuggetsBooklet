通过上一节的介绍，我们已经了解了 Redis 在收到客户端建连请求时的核心处理逻辑。在建连成功之后，会封装相应的 connection 以及 client 对象，还会在 IO 多路复用器上注册可读事件的监听，为读取客户端发来的请求做好准备。

这一节，我们就重点来看 Redis 是如何`读取`和`解析`客户端发来的请求。


## connSocketEventHandler() 与 readQueryFromClient()

在 Redis 客户端发来请求的时候，相应的底层连接会触发可读事件，通过上一节对建连过程的分析我们知道，客户端连接上可读事件的处理函数是 CT_Sokcet->ae_handler，它实际指向了 `connSocketEventHandler() 函数`。这也是我们本节第一个要介绍的函数。

connSocketEventHandler() 函数里可以同时处理可读事件和可写事件，默认会先处理可读事件，然后再处理可写事件。调用方可以在 connection->flags 字段中设置 `CONN_FLAG_WRITE_BARRIER` 标志位，来翻转可读可写事件的处理顺序，这与[第 28 讲《内核解析篇：Redis 事件驱动核心框架解析》](https://juejin.cn/book/7144917657089736743/section/7147529834703847465)中介绍的 aeProcessEvents() 函数以及 AE_BARRIER 标志位有点类似。下面是相关核心代码：

```c
static void connSocketEventHandler(struct aeEventLoop *el, int fd, void *clientData, int mask)
{
    connection *conn = clientData;
    ... // 省略对connection状态的检查
    // 检查CONN_FLAG_WRITE_BARRIER标志位
    int invert = conn->flags & CONN_FLAG_WRITE_BARRIER;
    int call_write = (mask & AE_WRITABLE) && conn->write_handler;
    int call_read = (mask & AE_READABLE) && conn->read_handler;
    if (!invert && call_read) { // 正常顺序是先处理可读事件
        if (!callHandler(conn, conn->read_handler)) return;
    }
    if (call_write) { // 处理可写事件
        if (!callHandler(conn, conn->write_handler)) return;
    }
    if (invert && call_read) { 
        // 存在CONN_FLAG_WRITE_BARRIER标志的时候，先处理可写事件，再处理可读事件
        if (!callHandler(conn, conn->read_handler)) return;
    }
}
```


我们先来看可读事件的处理，从前面介绍的建连流程里面我们知道，connection->read_handler 指向的实际就是 `readQueryFromClient() 函数`。

readQueryFromClient() 中的**第一步就是调用 postponeClientRead() 函数**，从函数名里面的 postpone 单词，大概可以推测出它会进行**延迟读取**，那怎么延迟读取数据呢？其实，只有在 Redis 开启**多线程模式**之后，这个延迟读取才生效，postponeClientRead() 会将发生可读事件的 client 添加到 redisServer.clients_pending_read 队列里面，然后由 IO 线程消费该队列，完成请求的读取和解析。这相较于单线程模式直接在主线程完成请求的读取和解析，多线程模式下这种，主线程通过队列可读事件分配给 IO 线程进行处理的行为，就是前面说的“延迟读取”了。


下面来看 `postponeClientRead() 函数`的核心逻辑和分析：

```c
int postponeClientRead(client *c) {
    if (server.io_threads_active && // 是否开启了多线程模式
        server.io_threads_do_reads && // 是否使用IO线程读取和解析请求
         !ProcessingEventsWhileBlocked && // 默认为0
        !(c->flags & (CLIENT_MASTER|CLIENT_SLAVE|CLIENT_BLOCKED)) &&
        // 检查io_threads_op这个全局变量，此时IO线程全部空闲，执行到这里的一定是主线程
        io_threads_op == IO_THREADS_OP_IDLE) 
    {
        // 将client追加到server.clients_pending_read列表中，
        // 等待I/O线程去处理
        listAddNodeHead(server.clients_pending_read,c);
        // 记录当前client在clients_pending_read列表中关联的节点，要是client的空间被释放，
        // 也需要把这个节点的空间释放掉
        c->pending_read_list_node = listFirst(server.clients_pending_read);
        return 1;
        
    } else {
        return 0;
    }
}
```


## 启动 IO 多线程

Redis 6 版本已经推出一段时间了，很多线上 Redis 服务也已经升级到了 Redis 6 并开启了 IO 多线程的能力，从我自己的使用角度来看，的确性能提升非常大。既然这样，我们就按照 IO 多线程的模式，继续分析客户端请求的读取逻辑。

前面说到了，Redis 主线程会将可读事件延迟分配给 IO 线程进行处理。在继续分析 IO 线程是如何读取和解析客户端请求之前，我们先要了解一下 Redis IO 多线程的基础内容。


首先来看一下 redisServer 结构体中与 I/O 线程相关的字段：

```c
struct redisServer {
    // 创建多少个IO线程，由io-threads配置指定，默认值为1，即表示不开启
    // 多线程模式，只使用一个主线程来处理所有IO，取值范围在1到128之间
    int io_threads_num;      
    int io_threads_do_reads; // 是否使用IO线程处理可读事件
    int io_threads_active; // 是否有IO线程可用
}
```

除了 redisServer 的这三个字段之外，还有几个比较重要的全局变量：

```c
// io_threads数组中的元素是IO线程
pthread_t io_threads[IO_THREADS_MAX_NUM];

// io_threads_mutex数组中记录了io_threads数组中对应IO线程的锁
pthread_mutex_t io_threads_mutex[IO_THREADS_MAX_NUM];

// io_threads_list中每个元素都是一个列表，列表中存储的都是处理的client实例，
// io_threads中的IO线程会处理io_threads_list中对应下标的client列表
list *io_threads_list[IO_THREADS_MAX_NUM];

// io_threads_pending数组中记录了每个线程等待处理的clients个数，
// 即io_threads_list数组中对应待处理的clients列表长度
// 注意，后续分析中会看到主线程和IO线程都会读写该数组中的值，所以其中每个元素的
// 读写都使用atomicSetWithSync、atomicGetWithSync两个宏进行操作，保证每
// 次读写都是原子操作
redisAtomic unsigned long io_threads_pending[IO_THREADS_MAX_NUM];

// 用来标识当前队列中待处理的事件是可读事件还是可写事件，也可以把IO线程以及主线程划分为三个状态
// 可选值为IO_THREADS_OP_READ、IO_THREADS_OP_WRITE、IO_THREADS_OP_IDLE
// IO_THREADS_OP_READ表示所有IO线程以及主线程在处理可读事件，当前队列中待处理的事件都是可读事件
// IO_THREADS_OP_WRITE表示所有IO线程以及主线程在处理可写事件，当前队列中待处理的事件都是可写事件
// IO_THREADS_OP_IDLE表示所有IO线程空闲，此时主线程在执行命令
int io_threads_op;
```


介绍完基础的数据结构之后，我们再来看 IO 多线程相关的初始化逻辑。在 Redis Server 启动的最后，会**调用 `initThreadedIO() 函数`创建 IO 线程**，调用关系链如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dfaaa9100cf4e888538a9f6923c6ff5~tplv-k3u1fbpfcp-zoom-1.image)

  


initThreadedIO() 函数的逻辑也不是很复杂，它的核心逻辑是根据 redis.config 文件中 io-threads 配置的 IO 线程数，初始化对应数量的 IO 线程数。注意`两个特殊值`，一个是 io-threads 配置成 1 的时候，表示不开启 IO 多线程，退化成了 Redis 6 之前的状态，也就是只通过主线程读取和解析请求；另一个是 io-threads 配置项上限值是 128，一旦超过 128，会直接报错。

  


在 initThreadedIO() 函数里面，除了创建 IO 的线程之外，还会初始化每个 IO 线程对应的锁、client 列表以及待处理 client 个数等一系列相关的配套结构。下面是 initThreadedIO() 函数的核心逻辑以及关键部分的注释：

```c
void initThreadedIO(void) {
    server.io_threads_active = 0; // IO线程当前不可用
    // 如果io_threads_num为1时，表示不开启多线程模式，只使用主线程处理所有IO
    if (server.io_threads_num == 1) return;
    // 检查io_threads_num配置是否超过128这个上限值(略)

    // 循环创建IO线程，并初始化io_threads_list数组中对应的client列表
    for (int i = 0; i < server.io_threads_num; i++) {
        // 初始化该线程对应的client列表
        io_threads_list[i] = listCreate();
        // 创建IO线程以及IO线程对应的锁
        pthread_t tid;
        pthread_mutex_init(&io_threads_mutex[i],NULL);
        // 将线程在io_threads_pending数组中的对应值初始化为0
        setIOPendingCount(i, 0);
        // 主线程获取所有IO线程关联的锁，IO线程执行的逻辑里面，也会去抢自己的锁，
        // 这就会导致所有IO线程阻塞住
        pthread_mutex_lock(&io_threads_mutex[i]); 
        // 初始化IO线程，IO线程执行的逻辑封装在IOThreadMain()函数中，
        // 并将IO线程编号i作为参数传入
        if (pthread_create(&tid,NULL,IOThreadMain,
              (void*)(long)i) != 0) { ... // 发生异常结束}
        io_threads[i] = tid; // 将新建IO线程记录到io_threads数组中
    }
}
```


完成初始化之后，我们看到了主线程拿到了每个 IO 线程关联的锁，后面我们会看到的 IO 线程执行的逻辑里面，也会去抢自己关联的锁，这就会导致 IO 线程全部阻塞住，那 `Redis 在何时释放这些锁，让 IO 线程跑起来呢？`

  


我们在[第 28 讲《内核解析篇：Redis 事件驱动核心框架解析》](https://juejin.cn/book/7144917657089736743/section/7147529834703847465)中介绍 aeEventLoop 结构体的时候提到，每次处理网络事件之前，都会调用 aeEventLoop->beforesleep 指向的函数，也就是 beforeSleep() 函数。如下图调用链所示，**beforeSleep() 底层调用的 startThreadedIO() 函数就是释放 IO 线程锁，让 IO 线程跑起来的地方**，同时，它里面还会将 io_threads_active 字段设置成 1，表示当前 I/O 线程已经可用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/099e74aeca464a06b18f9da12b168c53~tplv-k3u1fbpfcp-zoom-1.image)

  


下面是 startThreadIO() 函数以及调用的关键代码片段：

```c
int handleClientsWithPendingWritesUsingThreads(void) {
    ... // 省略其他逻辑
    // 通过io_threads配置决定当前是IO多线程模式，还是单线程模式
    if (server.io_threads_num == 1 || stopThreadedIOIfNeeded()) {
        return handleClientsWithPendingWrites();
    }
    // 通过io_threads_active字段方式多次调用startThreadedIO()函数
    if (!server.io_threads_active) startThreadedIO();
    ... // 省略其他逻辑
}

void startThreadedIO(void) {
    serverAssert(server.io_threads_active == 0);
    for (int j = 1; j < server.io_threads_num; j++) 
        pthread_mutex_unlock(&io_threads_mutex[j]); // 释放所有IO线程的锁
    server.io_threads_active = 1; // 设置io_threads_active为1，表示IO线程已经可用
}
```

  


到此为止，Redis 中的 IO 线程都已经跑起来了。下面我们就要来看 IO 线程里面具体在执行哪些逻辑。

  


在初始化 IO 线程的时候，其实我们就已经指定了每个 IO 线程都是执行 IOThreadMain() 函数，它里面是一个 while 循环，等待关联的 client 列表中会有出现可处理的事件，具体是处理可读事件，还是处理可写事件，是由 io_threads_op 这个全局变量控制的。下面是 `IOThreadMain() 函数`的核心代码：

```c
void *IOThreadMain(void *myid) {
    // 在pthread_create()函数传入的第四个参数，也就是IO线程编号
    long id = (unsigned long)myid;
    while(1) { // 死循环，持续处理事件
        for (int j = 0; j < 1000000; j++) { // 自旋等待可处理的client出现
            if (getIOPendingCount(id) != 0) break;
        }
        if (getIOPendingCount(id) == 0) {
            // 这里会尝试获取io_threads_mutex中对应的锁，如果主线程要暂停IO线程，
            // 主线程可以获取IO线程对应的锁，从而让IO线程阻塞等待锁
            pthread_mutex_lock(&io_threads_mutex[id]);
            pthread_mutex_unlock(&io_threads_mutex[id]);
            continue;
        }
        listIter li;
        listNode *ln;
        listRewind(io_threads_list[id],&li);
        // 迭代当前IO线程在io_threads_list数组中对应的client列表，
        // 并根据其io_threads_op这个全局变量调用相应的函数处理可读或可写事件
        while((ln = listNext(&li))) {
            client *c = listNodeValue(ln);
            if (io_threads_op == IO_THREADS_OP_WRITE) {
                writeToClient(c,0); // 处理可写事件
            } else if (io_threads_op == IO_THREADS_OP_READ) {
                readQueryFromClient(c->conn); // 处理可读事件
            } else { ... // 不支持其他事件，这里会输出错误日志 }
        }
        listEmpty(io_threads_list[id]);
        setIOPendingCount(id, 0); // 将当前IO线程负责的待处理连接数清零
    }
}
```


小伙伴们可能会发现一个断片的地方，我们在前面 postponeClientRead() 转发可读事件的时候，明明是把 client 实例写进了 redisServer.clients_pending_read 队列的啊，IO 线程则是从各自关联的 io_threads_list 列表里面取 client 实例，这能行吗？


这当然不行！下面我们就来看看这些 client 实例是如何从 clients_pending_read 队列分配给各个 IO 线程的（也就是进入 IO 线程关联的 io_threads_list 列表里面的）。


## 可读事件的分配

根据前文介绍，每个 IO 线程处理可读事件时都是从 io_threads_list 数组中获取其对应的待处理 client 列表，那 io_threads_list 数组中的待处理列表是何时填充的呢？


这个过程是在 handleClientsWithPendingReadsUsingThreads() 函数中完成的，而这个函数是在 aeEventLoop->beforeSleep 函数中被调用的，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdcee809576d4f689dfbe3279e03ee5a~tplv-k3u1fbpfcp-zoom-1.image)

  


这里又要涉及到[第 28 讲《内核解析篇：Redis 事件驱动核心框架解析》](https://juejin.cn/book/7144917657089736743/section/7147529834703847465)中提到的 aeEventLoop->beforeSleep 字段了，它指向的是 beforeSleep() 函数。在主线程每次进入 aeApiPoll() 函数阻塞等待可读可写事件之前，都会调用这个 beforeSleep() 函数。

  


下面我们来看 `handleClientsWithPendingReadsUsingThreads() 函数`的核心逻辑。

1.  handleClientsWithPendingReadsUsingThreads() 函数首先会检查 IO 线程是否已激活，检查 redisServer.clients_pending_read 列表中是否存在等待读取的 client，这些 client 都是由主线程上次调用 readQueryFromClient() 函数时填充的。如果满足这两个条件，才会继续执行下面的逻辑，把这些 client 分配到各个 IO 线程关联的 io_threads_list 队列中。



2.  接下来，迭代 clients_pending_read 列表，使用 Round-Robin 算法将 clients_pending_read 列表中的可读连接分配给每个 IO 线程，也就是分配到 io_threads_list 数组的对应列表中，核心代码片段如下：

```c
listIter li;
listNode *ln;
// 初始化li迭代器，用来迭代redisServer.clients_pending_read这个adlist列表
listRewind(server.clients_pending_read,&li); 
int item_id = 0;
while((ln = listNext(&li))) {
    client *c = listNodeValue(ln);
    int target_id = item_id % server.io_threads_num; // 计算目标IO线程的编号
    // 将client添加到各个IO线程关联的io_threads_list队列中
    listAddNodeTail(io_threads_list[target_id],c); 
    item_id++;
}
```

3.  接下来，设置 io_threads_op 全局标识为 IO_THREADS_OP_READ，用来告诉 IO 线程此次处理的全部都是可读事件。同时，还会设置每个 IO 线程要处理的连接数，也就是为每个 IO 线程设置 io_threads_pending 数组中对应元素值，用来告诉每个 IO 线程此次的工作量，这也会让 IO 线程跳出自旋等待逻辑的关键。

     到此为止，redisServer.clients_pending_read 队列中的 client 就被分配到了各个 IO 线程的 io_threads_list 之中。



4.  随后，各个 IO 线程就会开始读取自己负责的 io_threads_list，也就是前文介绍的 IOThreadMain() 的逻辑，这里不再重复。与此同时，主线程也不会闲着，它会处理 io_threads_list[0] 这个列表中的可读连接，主线程也就是通过 readQueryFrom() 函数读取并解析请求的。

```c
listRewind(io_threads_list[0],&li); // 初始化io_threads_list[0]这个列表的迭代器
while((ln = listNext(&li))) {
    client *c = listNodeValue(ln);
    // 主线程也是调用readQueryFromClient()处理io_threads_list[0]中的每个client来的请求
    readQueryFromClient(c->conn); 
}
listEmpty(io_threads_list[0]);
```

5.  主线程在完成 io_threads_list[0] 列表的处理之后，会阻塞等待全部 IO 线程完成自己负责的读取任务。



6.  待主线程阻塞结束，也就是说明所有 IO 线程的读取操作都完成了。主线程下面就会开始清理 redisServer.clients_pending_read 队列中的数据，表示这个 client 没有请求要处理了。

     在这个清理过程中，同时会调用 processPendingCommandAndInputBuffer() 函数执行解析好的命令。

  


下面这张图很好地总结了 `handleClientsWithPendingReadsUsingThreads() 函数`协调主线程和 IO 线程处理可读事件的过程：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b5c8ec9aa4049209dbd29edb27a7190~tplv-k3u1fbpfcp-watermark.image?)

  


## 再探 readQueryFromClient


通过前文分析我们可以知道，无论是单线程模型主线程处理可读事件，还是多线程模型下 IO 线程处理可读事件，都是通过 readQueryFromClient() 函数实现的。前面还说过，在 IO 多线程模式下，主线程首次调用 readQueryFromClient() 函数时，会通过 postponeClientRead() 把可读事件延迟到 IO 线程进行处理，也就是发生可读事件的 client 添加到 server.clients_pending_read 中，在 I/O 线程再次调用 readQueryFromClient() 函数时，就不会再执行 postponeClientRead() 中的延迟逻辑，而是 readQueryFromClient() 后续的、真正的读取数据。

  


好，我们下面来看 `readQueryFromClient() 函数`里面读取客户端请求的核心逻辑。

1.  准备缓冲区。每个 client 都关联了一个 querybuf 缓冲区（sds 类型）用来读取数据，同时还维护了一个 querybuf_peak 字段用来记录 querybuf 缓冲区的峰值大小，相关代码片段如下：

       ```c
        qblen = sdslen(c->querybuf); // qblen记录了querybuf的长度
        // 更新querybuf缓冲区的峰值大小
        if (c->querybuf_peak < qblen) c->querybuf_peak = qblen;
        // 准备client->querybuf缓冲区，用来接收读取到的数据
        c->querybuf = sdsMakeRoomFor(c->querybuf, readlen);
        // readlen默认16k，也就是说每次读取时，querybuf缓冲区至少有16k的空闲空间可使用

<!---->

2.  执行 read() 系统调用，将网络连接中的数据读取到 querybuf 缓冲区中。

       ```c
        // 调用connection->read指向的connSocketRead()函数，从该连接
        // 中读取数据到querybuf中。底层执行的就是read()系统调用
        int nread = connRead(c->conn, c->querybuf+qblen, readlen);

<!---->

3.  读取完成后，更新 querybuf 缓冲区大小，以及一些统计信息。

       ```c
        sdsIncrLen(c->querybuf,nread); // 更新querybuf已用长度
        c->lastinteraction = server.unixtime; // 更新client最后一次交互时间
        if (c->flags & CLIENT_MASTER) c->read_reploff += nread; // 主从统计信息
        // 更新Redis实例读取数据量的统计
        atomicIncr(server.stat_net_input_bytes, nread);
        if (sdslen(c->querybuf) > server.client_max_querybuf_len) {
          ... // querybuf缓冲区超过上限，打印警告日志，释放缓冲区以及client，结束调用
        }

<!---->

4.  最后执行 processInputBuffer() 函数。在 processInputBuffer() 函数中封装了解析 Redis 命令的入口以及 Redis 命令执行的入口。但是注意，在 I/O 线程中只会完成命令解析，不会真正执行命令。



## 总结

在这一节中，我们重点介绍了 Redis 读取请求的核心逻辑。首先，我们紧接上一节，介绍了建连完成之后的 connSocketEventHandler() 函数，然后介绍了 Redis 6 之后的 IO 多线程的启动流程，最后深入分析了读取请求的 readQueryFromClient() 函数实现。


下一节我们将紧接这一节的内容，继续讲解 Redis 在读取请求之后，解析命令以及执行命令的相关内容。