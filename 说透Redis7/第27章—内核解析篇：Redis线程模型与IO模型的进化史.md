在前面详细分析了 Redis 中的核心结构体以及底层数据结构，这些结构体类似于 Java 中的 domain 类，我们要想让这些结构体发挥作用，还`缺少两块拼图`：**一个 Redis 如何使用这些 domain 类，就类似 Java 中的 Service 层；另一个是 Redis 的线程模型**。

这一节，我们主要介绍一下 Redis 的线程模型。

## Redis 线程模型演进史

我们常说的“Redis 是一个单线程应用”指的是 Redis 在处理客户端的请求时，都是由唯一的主线程进行处理的，其中包括了请求的读取和解析、命令的执行以及响应的返回。这个描述在 Redis 4.0 版本之前，是比较准确的。

从 4.0 版本开始，Redis 就已经不是纯粹的单线程应用了。除了主线程外，Redis 开始使用后台线程处理一些比较耗时的操作，例如，清理脏数据、释放超时连接、删除大 key 等，但是网络读写、执行命令还是只使用单线程来处理。Redis 4.0 以及之前版本的核心线程模型如下图所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e9194c37c8c44d69830a70264a7457e~tplv-k3u1fbpfcp-watermark.image?)

Redis 之所以使用单线程是**因为 Redis 执行的是纯内存的操作，Redis 服务的瓶颈不在 CPU，而是在网络和内存**。单线程避免了不必要的上下文切换和竞争条件，也无需考虑锁的问题，整个线程模型比较简单。

多线程模型虽然在某些方面表现优异，但是它却引入了程序执行顺序的不确定性，带来了并发读写的一系列问题，增加了系统复杂度、同时可能存在线程切换、甚至加锁解锁、死锁造成的性能损耗。Redis 通过事件模型以及 IO 多路复用等技术，处理性能非常高，因此没有必要使用多线程来执行命令。

从 Redis 官方介绍中来看，单线程模型下网络 IO 占用了 Redis 大部分的 CPU 时间，网络 IO 的瓶颈随着请求量的增加也逐渐凸显出来。Redis 6.0 开始支持多线程 IO，进而充分利用服务器多 CPU 的优势，提高 Redis 在网络 IO 方面的性能。下图为 Redis 6.0 之后的线程模型：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63717ec919ad4f708d16b34767d44ceb~tplv-k3u1fbpfcp-watermark.image?)

简单解释一下这张图的结构：当 Redis Server 收到一个请求的时候，先会进入 IO 队列，多条 IO 线程会从 IO 队列里面读取请求并进行解析，解析之后的命令就会交给 Redis 主线程进行执行；执行后的结果会重新进入 IO 队列，等待 IO 线程将响应返回给客户端。

Redis 6.0 虽然开始支持多线程，但是执行命令的线程还是只有主线程一个，我们还是认为单条命令是原子执行的；同时，Redis 6.0 又有多线程进行 IO，进而突破了单线程 IO 的瓶颈，发挥了多核的优势。

感兴趣的小伙伴可以搜一下 Redis 多线程和单线程的压测结果比较，或者亲自压测一下。

## I/O 多路复用基础知识

既然说到了线程模型，就不得不说另一个非常重要的概念 —— **IO 多路复用**。我们知道传统阻塞 I/O 会阻塞线程执行，如下图所示，但是 Redis 的核心是单线程模型，如果发生阻塞，就会导致整个 Redis 实例不可用。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7977a35ff1cb4a24911438053ef24648~tplv-k3u1fbpfcp-watermark.image?)

Redis 采用 I/O 多路复用来解决这个问题。针对传统的阻塞 I/O 模型的缺点，I/O 复用的模型在性能方面有不小的提升。I/O 复用模型中的多个连接会共用一个 Selector 对象，由 Selector 感知连接的读写事件，而此时的线程数并不需要和连接数一致，只需要很少的线程定期从 Selector 上查询连接的读写状态即可，无须大量线程阻塞等待连接。当某个连接有新的数据可以处理时，操作系统会通知线程，线程从阻塞状态返回，开始进行读写操作以及后续的业务逻辑处理。

I/O 复用的模型如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93641a6864b443f48ea03dcd38e4056d~tplv-k3u1fbpfcp-watermark.image?)

由于多路复用器 Selector 的存在，可以同时并发处理成百上千个网络连接，大大增加了服务器的处理能力。另外，Selector 并不会阻塞线程，也就是说当一个连接不可读或不可写的时候，线程可以去处理其他可读或可写的连接，这就充分提升了 I/O 线程的运行效率，避免由于频繁 I/O 阻塞导致的线程切换。如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18f5efd099ea4766b37ea6b4e3ef1622~tplv-k3u1fbpfcp-watermark.image?)

在 I/O 多路复用模型中**最核心就是 selector**，但是 selector 在各个操作系统上的实现机制各不相同，例如，Linux 系统中的实现是 epoll，Solaris 10 系统中的实现是evport，OS X、FreeBSD 等系统中的实现是 kqueue。我们在实际生产中一般会将 Redis 部署到 Linux 系统中，所以我们重点关注 epoll 的使用。

epoll 是 Linux 内核为处理大量网络连接而提出的解决方案，它能够同时监听多个网络连接（文件描述符）的读写情况，当其中的某些文件描述符，有可读事件或者可写事件时，epoll 会立刻返回这些可读可写的文件描述符个数。

### epoll 基础

说完 IO 多路复用给我们带来的好处，我们就要再深入一步，看看 IO 多路复用是怎么使用的。

IO 多路复用器在不同操作系统上的实现各不相同，我们常见的服务器都是 Linux 操作系统，Linux 提供了 select、poll、epoll 三种多路复用的实现方式，其中 `epoll 是性能最好，也是我们最常用的一种`。

下面我就简单说明一下 epoll 的使用，总共涉及到 3 个核心函数。

-   epoll_create(int size) 函数，它会创建一个 epoll 专用的文件描述符（表示的是内核事件表）。
-   epoll_ctl(int epfd, int op, int fd, struct epoll_event *event) 函数，它操作上面拿到的内核事件表，我们可以通过该函数注册、修改或删除需要监听的事件。这里展开介绍一下 epoll_ctl() 的参数。

    -   epfd：要操作的内核事件表对应的文件描述符，也就是 epoll_create() 的返回值。
    -   op：指定了此次操作的类型，主要分三种，EPOLL_CTL_ADD 表示向内核事件表中注册指定fd 相关的事件；EPOLL_CTL_MOD 表示修改指定 fd 上的注册事件；EPOLL_CTL_DEL 表示删除指定 fd 的注册事件。
    -   fd：此次要操作的文件描述符，也就是要内核事件表中监听的 fd。
    -   event：是一个 epoll_event 结构指针类型，指定所要监听的 fd 上的事件类型。



-   epoll_wait(int epfd, struct epoll_event* events, int maxevents, int timeout) 函数，它会阻塞等待监听到有事件发生。如果检测到事件发生，会将所有就绪的事件从内核事件表（epdf 参数）复制到第二个参数 events 指向的缓冲数组中返回。maxevents 参数指定了每次能处理的最大事件数目，timeout 参数指定了一次阻塞的超时时长。

在上述核心函数中，涉及到 epoll_event 和 epoll_data 这两个比较重要的结构体，其具体结构如下：

```c
struct epoll_event {

    uint32_t     events;   // 记录了发生事件，按位区分不同事件

    epoll_data_t data;     // 记录了发生事件的相关信息

};



typedef union epoll_data {

    void    *ptr;

    int      fd; // 记录了发生事件的文件描述符

    uint32_t u32;

    uint64_t u64;

} epoll_data_t;
```

与 epoll_event.events 字段相关的几个宏定义以及含义如下。

-   EPOLLIN：对应的文件描述符发生可读事件（包括对端 SOCKET 正常关闭）。
-   EPOLLOUT：对应的文件描述符发生可写事件。
-   EPOLLPRI：对应的文件描述符有紧急的数据可读。
-   EPOLLERR：对应的文件描述符发生错误。
-   EPOLLHUP：对应的文件描述符被挂断。
-   EPOLLET： 将 EPOLL 设为边缘触发模式，默认是水平触发模式。
-   EPOLLONESHOT：只监听一次事件，当监听完这次事件之后，如果还需要继续监听对应描述符，需要再次注册这个文件描述符。

除了这三个函数，还有一个需要了解的概念是 epoll 的触发模式，主要有两种。

-   LT 模式：水平触发模式，这也是默认的触发模式。当 epoll_wait() 检测到事件发生并将通知给应用时，应用可以不立即处理这些事件，因为下次调用 epoll_wait() 函数时，会再次通知应用这些事件。
-   ET模式：边缘触发模式。当 epoll_wait() 检测到事件发生并将通知给应用时，应用需要立即处理这些事件。如果不处理，下次调用 epoll_wait() 函数时，将不会再次进行通知。

好了，了解了 epoll 的关键方法和结构体之后，我们再来看使用 epoll 的完整示例，从示例中体会 epoll 相关的函数如何使用。下面是这个例子的核心代码，模拟了一个简单的 Server，它能够接收客户端的连接，并读取客户端发来的数据。

```c
int main(int argc, char *argv[]) {

    struct epoll_event event;

    struct epoll_event *events;

    // 创建并绑定TCP套接字

    int sfd = create_and_bind(argv[1]);

    // ... 将TCP套接字设置成非阻塞的(略)

    s = listen(sfd, SOMAXCONN); // 等待连接建立

    // 调用epoll_create()函数创建epoll用到的文件描述符

    int efd = epoll_create(0);

    event.data.fd = sfd;

    // 监听可读事件，使用边缘触发模式

    event.events = EPOLLIN | EPOLLET;

    // 添加对sfd的监听

    s = epoll_ctl(efd, EPOLL_CTL_ADD, sfd, &event);

    // 创建一个事件缓存缓冲队列

    events = calloc(MAXEVENTS, sizeof event);

    while (1) {

        int n, i;

        // 阻塞等待有事件发生，当有事件发生时，epoll_wait()函数会

        // 通过events参数返回事件

        n = epoll_wait(efd, events, MAXEVENTS, -1);

        for (i = 0; i < n; i++) { // 循环处理事件

            // 对于EPOLLERR、EPOLLHUP事件以及文件描述符关闭的场景进行处理(略)

            // 发生可读事件来自sfd这个连接，表示有连接创建请求

            if (sfd == events[i].data.fd){

                while (1) { // 可能有多个创建连接的请求，所以是while(1)

                    struct sockaddr in_addr;

                    socklen_t in_len;

                    int infd;

                    in_len = sizeof in_addr;

                    // 创建新连接，infd为新建连接对应的文件描述符

                    infd = accept(sfd, &in_addr, &in_len);

                    if (infd == -1) {

                        if ((errno == EAGAIN) ||

                            (errno == EWOULDBLOCK)) {

                            break; // 已经处理完全部新建连接请求

                        }

                    }

                    // 将infd连接设置为非阻塞

                    s = make_socket_non_blocking(infd);

                    // 监听infd连接的可读事件

                    event.data.fd = infd;

                    event.events = EPOLLIN | EPOLLET;

                    s = epoll_ctl(efd, EPOLL_CTL_ADD, infd, &event);

                }

                continue;

            } else {

                int done = 0;

                while (1) {  // 不确定有多少可读数据，需要循环读取

                    ssize_t count;

                    char buf[1024];

                    count = read(events[i].data.fd, buf, sizeof buf);

                    if (count == -1) {

                        // EAGAIN表示已经读取完可读数据，等待下次可读事件

                        if (errno != EAGAIN) {

                            done = 1;  

                        }

                        break;

                    }

                    else if (count == 0)  { 

                        done = 1; // 读取完成，对端关闭连接

                        break;

                    }

                    // ... 处理读取到buf中的数据(略)

                }

                if (done) { // 对端关闭连接或是发生异常，释放对应文件描述符

                    close(events[i].data.fd);

                }

            }

        }

    }

    free(events); // 释放events缓冲区

    close(sfd); // 释放sfd文件描述符

    return 1;

}
```

简单说一下这段示例代码的核心逻辑，首先是通过 create_and_bind() 来新建一个 Socket，并把它设置成非阻塞的模式。接下来就是 epoll 的使用了，这里会新建一个 epoll 实例，并开始监听 sfd 这个 Socket 上的事件。然后就是一个 while 循环，它里面会调用 epoll_wait() 方法阻塞线程，直到监听到事件发生。在监听到事件之后，epoll_wait() 方法会通过 event 参数返回相应的事件。

这里我们先来关注与客户端新建连接的场景，新建连接的时候，发生事件的 Socket 就是 sfd，此时就会进入下面的 if 分支，其中会通过 accept() 完成客户端连接的创建，并把新建的这个连接添加到 epoll 上进行监听，这里主要是监听读事件。

下面再来看 else 这个分支，这是在客户端连接触发可读事件的执行逻辑。在这个分支的 while 循环里面，会尝试从这个 Socket 里面读取数据，在 buf 缓冲区读取满了之后，我们 Server 端就会处理其中的数据。处理完成之后，就会继续读取，然后处理，循环往复，直到全部数据都读取完毕，最后我们 Server 端会关闭这个 Socket 连接。

### Reactor 模型

在深入介绍 epoll 之后，我们需要先了解一下多路复用这项技术在实践中是如何使用的。**一般 I/O 多路复用会和 Reactor 设计模式一起出现，Redis 也是使用 Reactor 模式来处理网络请求的。**

Redis 通过 Selector 这个多路复用模块同时监听多个网络连接，当监听到 accept、read、write 等事件时，I/O 多路复用模块会将事件通过 Dispatcher 转发给事件处理器进行处理，如下图所示。在整个运行过程中，网络连接也可能会出现连接不可读或不可写等情况，此时主线程会去执行其他 Handler 的逻辑处理其他网络连接的事件或是时间事件，而不是阻塞等待。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1be535a44f914ff398bb21280a2f8d29~tplv-k3u1fbpfcp-watermark.image?)

单 Reactor 单线程的优点就是线程模型简单，没有引入多线程，自然也就没有多线程并发和竞争的问题。但其缺点也非常明显，那就是性能瓶颈问题，一个线程只能跑在一个 CPU 上，能处理的连接数是有限的，无法完全发挥多核 CPU 的优势，这也是 Redis 从 单个线程转变成`单个主线程 + IO 多线程`的原因。

## 总结

在这一节中，我们首先介绍了 Redis 线程模型的演进历史，重点讲解了 Redis 4.0 之前的单线程模式以及 Redis 6.0 之后的 I/O 多线程模式。然后，我们详细说明了 I/O 多路复用的基础知识，主要介绍了 I/O 多路复用的原理、epoll 的基础知识以及 Reactor 模型。

下一节，我们将正式开始介绍 Redis 对 Reactor 模型的实现，也就是对 Redis 事件驱动框架的解析。