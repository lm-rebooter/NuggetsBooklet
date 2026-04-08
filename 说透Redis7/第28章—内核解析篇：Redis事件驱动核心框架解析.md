介绍完 IO 多路复用的好处以及 Linux 系统中 epoll 的基本使用之后，我们接下来就展开分析一下 Redis 对 I/O 多路复用模块的封装。


正如前面在 epoll 示例中看到的，我们的程序代码其实是围绕 epoll 监听到的各种事件展开的，也就是我们常说的**事件驱动**。为了统一多种 IO 多路复用器的实现，Redis 构建了一个 **ae 库**，全称叫 `a simple event-driven programming library`，如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/158e7ace52064ca7afda1e7c287ff7eb~tplv-k3u1fbpfcp-watermark.image?)

  


## aeApiState 解析

在 ae 这个库里面，Redis 通过 `aeApiState 结构体`对 epoll、select、kqueue、evport 四种 IO 多路复用的实现进行了适配，**让上层调用方感知不到不同系统在 I/O 多路复用实现上的差异性**。对上述四种 I/O 多路复用的适配分别对应 ae_epoll.c、ae_select.c、ae_kqueue.c、ae_evport.c 四个文件，后面我们依旧以最常用的 epoll 为例来介绍。

首先来看 aeApiState 结构体，其中维护了 epoll 内核注册表的文件描述符，以及指向 epoll_event 缓冲区的指针，如下所示：

```c
typedef struct aeApiState {
 int epfd; // epoll监听的内核注册表的文件描述符
 struct epoll_event *events; // 指向epoll_event缓冲区
} aeApiState;
```

接下来看 Redis 为 I/O 多路复用抽象出来的函数，**这些函数在每个对应的适配实现中都存在，类似于面向对象编程中的接口方法**。

首先是 aeApiCreate() 函数，其核心功能是进行初始化。在 epoll 对应的实现中，会先创建 aeApiStat 实例并记录到 eventLoop->apidata 字段中，`eventLoop 是 Redis 事件驱动的核心结构体`，我们后面马上就会介绍。接下来初始化 aeApiStat->events 指向的 epoll_event 缓冲区（长度为 eventLoop->setsize 字段指定的长度），最后通过 epoll_create() 函数创建 epoll 专用文件描述符。


第二个方法是 aeApiAddEvent(aeEventLoop *eventLoop, int fd, int mask) 。在 epoll 对应的实现中，aeApiAddEvent() 函数是对 epoll_ctl() 函数的封装，添加（或修改）对 fd 的监听事件。

  


第三个方法是 aeApiDelEvent(aeEventLoop *eventLoop, int fd, int delmask) 。在 epoll 对应的实现中，aeApiDelEvent() 函数底层也是调用了 epoll_ctl() 函数，实现对 fd 监听事件的删除。

  


最后看 aeApiPoll(aeEventLoop *eventLoop, struct timeval *tvp) 方法。在 epoll 对应的实现中，aeApiPoll() 函数会调用 epoll_wait() 函数等待监听的事件发生，当 epoll_wait() 函数返回的时候，已触发的事件会被存储到 aeApiState->events 缓冲区，紧接着会再次遍历 aeApiState->events 缓冲区将所有已触发事件转移到 eventLoop->fired 数组中（该数组中的元素是 aeFiredEvent 类型，其核心字段如下），后续在 aeEventLoop 事件循环中会处理 fired 数组。

```c
typedef struct aeFiredEvent {
 int fd; // 该事件关联的文件描述符
 int mask; // 触发的事件
} aeFiredEvent;
```

另外，不同的 I/O 多路复用实现中使用的 mask 值也不同，例如，epoll 使用 EPOLLIN、EPOLLOUT 分别表示可读、可写事件，kqueue 中则使用 EVFILT_READ、EVFILT_WRITE。在 Redis 中`统一使用` AE_READABLE、AE_WRITABLE 两个宏来表示可读、可写事件，所以在调用上述接口函数时传入的 mask 参数都是 `AE_READABLE`、`AE_WRITABLE`。


## aeEventLoop 结构体



Redis 中的事件可以分为两大类：一类就是上面介绍的**网络读写事件**（也被称为文件事件，毕竟 Linux 中的网络连接都是使用文件描述符表示的）；另一类事件是**时间事件**，也就是 Redis 中定时触发的事件，比如说 Redis 定时去检查 Key 是不是已经过期了。


**Redis 是通过事件循环 `aeEventLoop` 来统一处理网络事件和时间事件的。**


下面先来看 aeEventLoop 结构体的核心字段以及具体含义，如下所示，这里重点关注 fired 指针和 timeEventHead 指针，分别维护了网络事件队列的头节点和时间事件队列的头节点，之后处理网络事件和时间事件的时候，就会按照这两个链表的顺序进行处理。

```c
typedef struct aeEventLoop {
    int maxfd; // 当前注册的文件描述符的最大值
    int setsize; // 能够注册的文件描述符个数上限
    // 用于计算时间事件的唯一标识
    long long timeEventNextId; 
    // events指向了一个网络事件数组，记录了已经注册的网络事件，数组长度为setsize
    aeFileEvent *events; 
    // fired数组记录了被触发的网络事件
    aeFiredEvent *fired; 
    // timeEventHead指向了时间事件链表的头节点
    aeTimeEvent *timeEventHead;
    // 停止的标识符，设置为1表示aeEventLoop事件循环已停止
    int stop;
    // Redis在不同平台会使用4种不同的I/O多路复用模型（evport、epoll、kueue、select），
    // apidata字段是对这四种模型的进一步封装，指向aeApiState一个实例
    void *apidata;
    // Redis主线程阻塞等待网络事件时，会在阻塞之前调用beforesleep函数，
    // 在被唤醒之后调用aftersleep函数
    aeBeforeSleepProc *beforesleep;
    aeBeforeSleepProc *aftersleep;
    int flags;
} aeEventLoop;
```

接下来，我们展开 aeEventLoop 中的几个关键结构体进行详细分析。



首先是 `aeFileEvent 结构体`，它抽象了一个网络事件，其中维护了监听的事件以及处理相应事件的函数指针，其中四个字段都非常重要，具体含义如下所示：

```c
typedef struct aeFileEvent {
 // 事件掩码，用来记录发生的事件，
 // 可选标志位为AE_READABLE(1)、AE_WRITABLE(2)、AE_BARRIER(4)
 int mask;
 // 如果发生可读事件，会调用rfileProc指向的函数进行处理
 aeFileProc *rfileProc;
 // 如果发生可写事件，会调用wfileProc指向的函数进行处理
 aeFileProc *wfileProc;
 // 指向对应的客户端对象
 void *clientData;
} aeFileEvent;
```

再来看 `aeTimeEvent 结构体`，它抽象了一个时间事件，其核心字段含义如下：

```c
typedef struct aeTimeEvent {
    long long id; // 唯一标识，通过eventLoop->timeEventNextId字段计算得来
    monotime when; // 时间事件触发的时间戳（微秒级别）
    aeTimeProc *timeProc; // 处理该时间事件的函数
    aeEventFinalizerProc *finalizerProc; // 删除时间事件之前会调用该函数
    void *clientData; // 该时间事件关联的客户端实例
    struct aeTimeEvent *prev; // 前后指针
    struct aeTimeEvent *next;
    // 当前时间事件被引用的次数，要释放该aeTimeEvent实例，需要refcount为0
    int refcount; 
} aeTimeEvent;
```

  


## 初始化 aeEventLoop

了解了上述核心结构体之后，我们再来看 Redis 是如何使用 aeEventLoop 这个结构体的。

在 Redis 服务器启动时，会走 initServer() 函数，里面会调用 aeCreateEventLoop() 函数：

```c
server.el = aeCreateEventLoop(server.maxclients+CONFIG_FDSET_INCR);
```



在 aeCreateEventLoop() 函数中会初始化 aeEventLoop 实例的各个参数，其中的 setsize 参数设置为 maxclients + 128（预留），也就是说 aeEventLoop 中的 events 和 fired 字段指向的数组都是这个大小。同时，还会将 events 数组中所有 aeFileEvent 的 mask 字段初始化为 AE_NONE，表示不监听任何事件。


接下来，Redis 会调用 listenToPort(server.port, &server.ipfd) 函数监听指定的地址，底层依赖 socket()、bind(）、listen() 等网络编程库实现，并通过 fcntl() 函数将所有 Socket 设置为非阻塞。

```c
int listenToPort(int port, socketFds *sfd) {
    int j;
    char **bindaddr = server.bindaddr;
    if (server.bindaddr_count == 0) return C_OK; // 边界检查
    for (j = 0; j < server.bindaddr_count; j++) {
        char* addr = bindaddr[j];
        int optional = *addr == '-'; 
        if (optional) addr++;
        if (strchr(addr,':')) { // 对IPv6地址的处理
            sfd->fd[sfd->count] = anetTcp6Server(server.neterr,port,addr,server.tcp_backlog);
        } else {  // 对IPv4地址的处理
            sfd->fd[sfd->count] = anetTcpServer(server.neterr,port,addr,server.tcp_backlog);
        }
        if (sfd->fd[sfd->count] == ANET_ERR) {
            ... // 省略异常处理逻辑
        }
        if (server.socket_mark_id > 0) anetSetSockMarkId(NULL, sfd->fd[sfd->count], server.socket_mark_id);
        // 设置成非阻塞
        anetNonBlock(NULL,sfd->fd[sfd->count]);
        anetCloexec(sfd->fd[sfd->count]);
        sfd->count++;
    }
    return C_OK;
}
```

Redis 里面把 TCP Socket 编程的一些工具方法写到了 anet.c 文件里面，对这一部分感兴趣的小伙伴们可以去看看该文件的具体内容，这里就不再展示了。


注意这个 listenToPort() 函数的两个参数：第一个 server.port 就是我们在 redis.conf 配置文件中 port 配置项指定的端口号，默认是 6379；第二个 server.ipdf 是一个 socketFds 实例，其中记录了当前这个 Redis Server 每个监听地址对应的文件描述符，也就是我们在 redis.conf 配置文件中，bind 字段指定监听的 IP 地址。

```c
typedef struct socketFds {
    int fd[CONFIG_BINDADDR_MAX]; // 记录了每个监听地址对应的文件描述符
    int count;  // fd数组的个数
} socketFds;
```



## 注册监听

在 initServer() 初始化中，完成 aeCreateEventLoop() 调用之后 ，Redis 还会调用 createSocketAcceptHandler(&server.ipfd, acceptTcpHandler) 函数为 ipdf 中所有地址注册监听，最底层依赖 aeApiAddEvent() 函数实现，调用关系如下图所示：

  

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12cec2834422454d91be60512ae28aaf~tplv-k3u1fbpfcp-watermark.image?)

aeApiAddEvent() 函数我们在前面介绍 ae 库的时候已经说过了，就是用来添加监听事件。


这里还要注意的是，图中的 aeCreateFileEvent() 函数会将 acceptTcpHandler() 函数作为可读事件的处理函数记录到 ipfd 中所有文件描述符对应的 aeFileEvent 中，相关代码片段如下：

```c

int createSocketAcceptHandler(socketFds *sfd, aeFileProc *accept_handler){
    int j;
    for (j = 0; j < sfd->count; j++) {
        // 监听每个文件描述符上的可读事件
        if (aeCreateFileEvent(server.el, sfd->fd[j], AE_READABLE, 
              accept_handler, NULL) == AE_ERR) { // ...省略错误处理
        }
    }
    return C_OK;
}

int aeCreateFileEvent(aeEventLoop *eventLoop, int fd, int mask,
        aeFileProc *proc, void *clientData) {
    // 检查fd是否超过了aeEventLoop->setsize这个上限值
    aeFileEvent *fe = &eventLoop->events[fd];
    // 底层通过具体的I/O多路复用注册要监听的事件，例如，epoll_ctl()函数
    if (aeApiAddEvent(eventLoop, fd, mask) == -1)
        return AE_ERR;
    fe->mask |= mask;
    // 根据监听的事件，记录对应的处理函数
    if (mask & AE_READABLE) fe->rfileProc = proc;
    if (mask & AE_WRITABLE) fe->wfileProc = proc;
    fe->clientData = clientData;
    // 省略其他检查逻辑
    return AE_OK;
} 
```

  


## aeProcessEvents() 函数

随着 initServer() 函数的调用完成，上述操作也会一并完成，ae 库里面最基础的东西都已经初始化好了。这个时候，Redis 已经可以做好了在 bind 地址上的监听，可以接收客户端的建连请求了。接下来，Redis 在 main() 函数会调用 aeMain() 函数，其中会循环调用 aeProcessEvents() 函数来处理网络事件和时间事件，**它也是 Redis 处理事件驱动的框架逻辑所在**。


这里首先关注 aeProcessEvents() 函数的第二个参数 flags，我们可以通过指定 flags 的值，控制 aeProcessEvents() 需要处理的事件类型，相关的取值如下：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c145224d19b45c2b78e95b3dc3745e7~tplv-k3u1fbpfcp-watermark.image?)

  

下面是 flags 参数中标志位的具体含义。

-   flags 参数为 0 时，aeProcessEvents() 函数不会执行任何逻辑，直接返回。



-   包含了 AE_FILE_EVENTS、AE_TIME_EVENTS、AE_ALL_EVENTS 标志位的时候，aeProcessEvents() 函数会分别处理网络事件、时间事件或者“网络事件+时间事件”。



-   包含 AE_DONT_WAIT 标志位的时候，aeProcessEvents() 函数在处理完能处理的事件之后，会立即返回，不会进行等待。



-   包含 AE_CALL_AFTER_SLEEP、AE_CALL_BEFORE_SLEEP 标志位时，aeProcessEvents() 函数在调用 aeApiPoll() 阻塞等待网络事件之前、之后，会分别执行 aeEventLoop 的 beforesleep/aftersleep 回调函数。

  


在 aeMain() 中使用的 flags 参数设置了AE_ALL_EVENTS、AE_CALL_BEFORE_SLEEP、 AE_CALL_AFTER_SLEEP 三个标记位，我们以此为例来看 aeProcessEvents() 函数的核心逻辑。

  


1.  因为要包含 AE_ALL_EVENTS 标记，这里的 aeProcessEvents() 调用是需要处理时间事件的，它会通过 usUntilEarliestTimer() 函数遍历时间事件链表，也就是前面介绍的 aeEventLoop->timeEventHead 指针，它指向时间事件列表的头节点，这个列表里的时间事件是无序的，所以 usUntilEarliestTimer() 会遍历整个列表，才能找到距离当前最近的、即将要触发的时间事件。



2.  接下来，因为包含 AE_CALL_BEFORE_SLEEP 标记位，aeProcessEvents() 会调用 aeEventLoop->beforesleep 函数，其中具体做了什么事情，后面我们会详细展开分析，这里小伙伴们可以先不必深入研究。



3.  然后，就是 aeProcessEvents() 函数**最核心一个操作 —— 调用 aeApiPoll() 函数**，阻塞监听文件事件。这里阻塞的超时时长，就是第一步中计算出来的、距离最近时间事件的时间差。



4.  在 aeApiPoll() 函数返回之后， aeProcessEvents() 还会调用 aftersleep() 函数，它一般与前面说的 beforesleep() 函数成对出现，做一些后置处理。aftersleep() 函数的内容我们放到后面的小节详细介绍。



5.  接下来我们要聚焦于网络事件的处理逻辑。首先要明确，在 aeApiPoll() 函数返回的时候，只可能是两个原因中的一个：要么是注册的 Socket 发生了我们监听的事件，要么是超时时间到了。如果是第一个原因的话，aeApiPoll() 函数返回就会返回监听到的事件个数，下面我们就可以开始处理 aeEventLoop->fired 数组中记录的事件了。

  
    默认情况下，这里会先处理一个 Socket 上的可读事件，也就是调用对应 aeFileEvent 的 rfileProc 函数，然后处理连接上的可写事件，也就是调用对应 aeFileEvent 的 wfileProc 函数。
    
    这里有个逻辑需要单独说明一下，前文介绍 aeFileEvent 中 mask 字段时提到，其中可以设置我们关注的事件，还可以设置一个 AE_BARRIER 标志位，它的功能就是`让可读、可写事件的处理顺序翻转，也就是先处理可写事件，再处理可读事件`。至于读写顺序为什么翻转，我们会在后面举例介绍，下面是这段处理网络事件的逻辑：
    
    ```c
        for (j = 0; j < numevents; j++) {
            int fd = eventLoop->fired[j].fd;
            aeFileEvent *fe = &eventLoop->events[fd];
            int mask = eventLoop->fired[j].mask;
            int fired = 0; 
            // 检查AE_BARRIER标志
            int invert = fe->mask & AE_BARRIER;

            if (!invert && fe->mask & mask & AE_READABLE) { 
                // 正常情况先会调用rfileProc函数处理可读事件
                fe->rfileProc(eventLoop,fd,fe->clientData,mask);
                fired++;
                fe = &eventLoop->events[fd];
            }
            
            if (fe->mask & mask & AE_WRITABLE) { 
                if (!fired || fe->wfileProc != fe->rfileProc) {
                    // 调用wfileProc函数处理可写事件
                    fe->wfileProc(eventLoop,fd,fe->clientData,mask);
                    fired++;
                }
            }

            if (invert) { // 如果设置了AE_BARRIER标志，就会先处理可写时间，再处理可读事件
                fe = &eventLoop->events[fd]; 
                if ((fe->mask & mask & AE_READABLE) &&
                    (!fired || fe->wfileProc != fe->rfileProc))
                {
                    fe->rfileProc(eventLoop,fd,fe->clientData,mask);
                    fired++;
                }
            }
            processed++;
        }
        

6.  完成网络事件的处理之后，aeProcessEvents() 紧接着会调用 processTimeEvents() 函数处理到期的时间事件。后面我们将单独拿出一节来介绍 Redis 中有哪些时间事件、各个时间事件触发的时机等相关细节，这里重点还是关注 processTimeEvents() 函数的实现框架。

    **processTimeEvents() 函数的核心逻辑就是从 aeEventLoop->timeEventHead 链表里面，找到已经到期的时间事件，并进行处理**。在遍历 timeEventHead 链表的 while 循环里，我们看到了两个分支。
    
      ```c
        static int processTimeEvents(aeEventLoop *eventLoop) {
            int processed = 0;
            aeTimeEvent *te;
            long long maxId;
            te = eventLoop->timeEventHead;
            maxId = eventLoop->timeEventNextId-1;
            monotime now = getMonotonicUs();
            while(te) {
                long long id;
                // 时间事件已经被删除
                if (te->id == AE_DELETED_EVENT_ID) {
                    aeTimeEvent *next = te->next;
                    if (te->refcount) { // 是否还被引用，如果还被引用，则会被暂时忽略
                        te = next;
                        continue;
                    }
                    // 下面是链表删除的逻辑
                    if (te->prev) 
                        te->prev->next = te->next;
                    else
                        eventLoop->timeEventHead = te->next;
                    if (te->next)
                        te->next->prev = te->prev;
                    // 如果有finalizerProc函数，需要调一下，进行一些释放前的处理
                    if (te->finalizerProc) { 
                        te->finalizerProc(eventLoop, te->clientData);
                        now = getMonotonicUs();
                    }
                    zfree(te);
                    te = next;
                    continue;
                }

                if (te->id > maxId) {
                    te = te->next;
                    continue;
                }

                if (te->when <= now) { // 与当前时间戳比较，决定是否触发该时间事件
                    int retval;
                    id = te->id;
                    te->refcount++;
                    // 触发事件
                    retval = te->timeProc(eventLoop, id, te->clientData);
                    te->refcount--;
                    processed++;
                    now = getMonotonicUs();
                    if (retval != AE_NOMORE) { // 更新下次触发的时间戳
                        te->when = now + retval * 1000;
                    } else { // 之后不再触发该事件
                        te->id = AE_DELETED_EVENT_ID;
                    }
                }
                te = te->next;
            }
            return processed;
        }
        

在第一个 if 分支里面，Redis 会去检查每个 aeTimeEvent 元素的 id 值是否为 AE_DELETED_EVENT_ID（具体值是 -1 ），且 refcount 为 0，如果满足这两个条件，表示该时间事件之后不会再触发，且没有被其他逻辑使用，此时就可以将该 aeTimeEvent 元素从链表中删除并释放掉，删除的时候，还会调用 finalizerProc() 回调函数进行一些释放前的处理。


第二个分支里面，检查每个 aeTimeEvent 元素是否已到期，如果已到期，则触发其 timeProc 回调函数。timeProc() 函数返回的是一个 int 值，表示该时间事件下次的触发时间：如果返回 -1，我们就认为该时间事件是一次性的，之后不会再触发，此时就要将其 id 设置为 -1，等待之后再次遍历 timeEventHead 链表的时候删除；否则，更新其 when 字段，等待下次触发。

  


## 总结

在这一节中，我们重点介绍了 Redis 事件驱动框架（ae 库）的核心实现。


-   首先，我们深入分析了 ae 库的设计理念；

<!---->

-   然后以 Linux 平台为例，分析了 aeApiState 结构体的实现；

<!---->

-   接下来分析了 Redis 中对网络事件（`aeFileEvent`）以及时间事件（`aeTimeEvent`）的抽象，以及处理事件的抽象 —— aeEventLoop 结构体；

<!---->

-   最后，我们深入剖析了 aeEventLoop 初始化、注册监听以及处理事件的核心逻辑。


在接下来的几节中，我将带领小伙伴们深入分析 Redis 的建连、读写请求处理以及响应返回的核心实现，在这个过程中，小伙伴们也会对 Redis 的事件驱动逻辑有更深的理解。