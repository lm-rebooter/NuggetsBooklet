通过前面几节的介绍我们知道，Redis 中的事件驱动中，除了网络事件之外，还有时间事件，但是在前文的介绍中，我们完全没有提及到这部分内容。因此，在这一节中，我们就来补齐 Redis 时间事件的相关内容。

不过，在这之前，我们先一起来回顾一下 Redis 是如何处理时间事件的。你可以把 Redis 中的时间事件，理解成`定时任务`，正如[第 28 讲《内核解析篇：Redis 事件驱动核心框架解析》](https://juejin.cn/book/7144917657089736743/section/7147529834703847465)所说，这些时间事件与维护在 aeEventLoop->timeEventHead 链表中的 aeTimeEvent 实例一一对应。

在[第 28 讲《内核解析篇：Redis 事件驱动核心框架解析》](https://juejin.cn/book/7144917657089736743/section/7147529834703847465)介绍 aeProcessEvents() 函数的时候我们看到，在它最后，会调用 processTimeEvents() 函数去处理时间事件，其`核心逻辑就是遍历 aeEventLoop->timeEventHead 链表`。在遍历过程中，先会检查每个 aeTimeEvent 元素的 id 值是否为 AE_DELETED_EVENT_ID(-1)，以及 refcount 是否为 0。如果满足这两个条件，表示这个时间事件之后不会再被触发，也没有被其他逻辑使用到，这个时候就可以把这个 aeTimeEvent 节点从链表中删除并释放掉。

要是一个 aeTimeEvent 不满足上述两个条件，就表示可能还会被触发，此时就会去检查它是否到期了，其实就是比较它的 when 字段与当前时间戳。如果已到期，就触发它的 timeProc 回调函数。timeProc() 函数返回了一个 int 值，表示该时间事件下次的触发时间。如果返回 -1，我们就认为该时间事件不会再触发，此时就要将其 id 设置为 -1，等待下次遍历的时候删除这个节点。否则，就更新其 when 字段，等待下次到期触发。

## serverCron() 函数

了解了 Redis 如何处理时间事件之后，我们再来看 Redis 中有哪些时间事件。下图展示了 aeCreateTimeEvent() 函数的调用位置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6aa9f0a09fbf47d3bcf72c971d766f59~tplv-k3u1fbpfcp-zoom-1.image)

从上图中我们看出，Redis 里面创建时间事件的地方只有两个：startEvictionTimeProc() 函数与 Redis 的数据淘汰机制相关，我们会在后面拿一节的篇幅详细介绍；**本节将重点介绍 initServer() 里面创建的这个时间事件**。

从上图中我们看到，在 initServer() 进行初始化的时候，会初始化一个时间事件，其 timeProc 字段指向 serverCron() 函数，下一次触发的时间是 1 毫秒之后，可以认为是立刻触发；然后是 serverCron() 函数的返回值，是 1000/server.hz，hz 是一个大于 0 的整数，也就是说 serverCron() 函数会`周期性`地被调用，而且间隔不会超过 1 秒。

确定了 serverCron() 函数触发时机，以及触发的频率之后，我们就可以深入看看 serverCron() 函数中到底有哪些操作。

### 重置 watchdog 定时器

watchdog 是 Redis 在 2.6 版本的一个新特性，**用于诊断 Redis 的延迟问题**，其核心原理使用 Unix 系统里面的 setitimer() 函数，设置一个定时器，周期性触发 SIGALRM 信号，触发频率由 server.watchdog_period 字段指定。

在正常情况下，Redis 会按时执行 serverCron() 函数，其中会调用 watchdogScheduleSignal() 函数重置 watchdog 定时器，也就不会触发 SIGALRM 信号。但是，Redis 主线程被某些操作阻塞，Redis 主线程就无法按时重置定时器，系统就会触发 SIGALRM 信号，Redis 通过捕获这个信号，就能知道自己慢了。

在实际使用 watchdog 功能的时候，我们可以通过下面的 CONFIG SET 命令，将定时器触发的周期设置为 500 ms，也就是把 server.watchdog_period 字段设置成 500 ms。

```c
CONFIG SET watchdog-period 500
```

另外，CONFIG SET 命令的处理函数还会设置 watchdogSignalHandler() 函数来处理 SIGALRM 信号，这部分逻辑位于 enableWatchdog() 函数之中，感兴趣的小伙伴可以看一下。

在 watchdogSignalHandler() 函数中，会抓取触发 SIGALRM 信号时 Redis 主线程的堆栈信息，并输出到日志文件中，如果频繁发现在一个位置超时，就可以合理怀疑这部分逻辑或者相关操作导致了 Redis 阻塞，`这就和我们 Java 中用 jstack 定位阻塞点的逻辑有点相似`。

### 更新时钟缓存

在 Redis 中有很多地方会使用到当前时间戳，比如说，前面分析的命令读取过程，readQueryFromClient() 函数就需要当前时间戳来更新 client->lastinteraction 字段，记录 client 客户端最后一次与 Redis Server 交互的时间，后续方便做统计之类的操作。

一般情况下，要获取当前时间戳，需要调用一次系统的 `gettimeofday() 函数`才能查到当前时间戳，本身这个调用是非常快的，但是在高并发、高 QPS 的场景下，每处理一条命令都要拿多次系统时间的话，这个拿时间戳的耗时就会被放大很多。

所以，在 redisServer 中使用 ustime、mstime、unixtime 三个字段缓存当前时间戳，这三个字段的单位分别是微秒、毫秒、秒，更新这三个时间缓存字段的逻辑位于 updateCachedTime() 函数中：

```c
void updateCachedTime(int update_daylight_info) {

    // 底层调用gettimeofday()函数，获取微秒级别的时间戳

    const long long us = ustime();

    // 底层会更新redisServer中的ustime、mstime、unixtime三个字段

    updateCachedTimeWithUs(update_daylight_info, us);

}
```

由于 serverCron() 函数是周期性调用，还可能会出现延迟，所以这三个值并不是绝对准确，它们只会用在日志打印、LRU 时钟更新、决定是否进行持久化、进行某些不精确的统计操作等精度要求不高的地方。对于时间精度要求很高，或者是两次更新函数调用之间的计时，Redis 还是会进行 `ustime() 获取精确的时间戳`进行计算。比如说，call() 函数里面用来统计一条命令的执行时间，call() 函数的调用是在两次 serverCron() 函数之间完成的，如果用缓存的时间戳，统计出来的命令执行时长始终是 0。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adc658c760964d26921e386564c23e1f~tplv-k3u1fbpfcp-zoom-1.image)

既然说到 call() 函数中对时间戳的依赖，这里就说一下其中的知识点，下面先来看 call() 函数中统计命令耗时的时间戳：

```c
void call(client *c, int flags) {

    ... //省略前面的逻辑

    

    const long long call_timer = ustime(); // 获取当前系统时间

    if (server.fixed_time_expire++ == 0) { // 在开始执行命令之前，先更新缓存的时间戳

        updateCachedTimeWithUs(0,call_timer); 

    }



    monotime monotonic_start = 0; // 如果支持MONOTONIC_CLOCK优化，就用

    if (monotonicGetType() == MONOTONIC_CLOCK_HW) 

        monotonic_start = getMonotonicUs();



    c->cmd->proc(c); // 执行命令



    ustime_t duration;

    if (monotonicGetType() == MONOTONIC_CLOCK_HW) // 使用MONOTONIC_CLOCK优化

        duration = getMonotonicUs() - monotonic_start;

    else

        duration = ustime() - call_timer;
```

首先是在命令执行之前，会更新一下缓存的时间，也就是这里看到的 updateCachedTimeWithUs() 调用。其次是一个优化点，像统计命令执行时间这种计算时间差的操作，其实并不需要去拿系统时间戳进行计算，我们也可以拿命令执行前后，相对于程序启动时间点的时间差进行计算，这也是 call() 函数中 MONOTONIC_CLOCK 优化的思路。

### 更新执行频率

在 Redis 2.6 版本中，serverCron() 函数是以固定 100ms 的间隔来执行。但是从 2.8 版本开始，我们可以`通过修改 redis.conf 中的 hz 配置项来调整 serverCron() 的执行频率`，hz 配置项的默认值是 10，前面说过，serverCron() 函数的返回值是 1000/server.hz，那 hz = 10 的含义是每秒执行 10 次，每隔 100ms 执行一次。

另外，我们还可以开启 dynamic_hz 配置项让 Redis 动态调整 server.hz 的值，这里主要是看当前有多少客户端连接到了 Redis Server，也就是 server.clients 列表的长度，客户端越多，server.hz 值越大，也就是执行频率越高。动态调整的 hz 上限值为 500，也就是每秒最多执行 500 次。

### 周期性更新监控

继续往下看 serverCron() 的实现，我们看到 run_with_period(100) 这个宏，按理来说，一段代码写在 serverCron() 函数里面的话，应该和 serverCron() 的执行频率一样。但是，**被 run_with_period 这个宏包裹的代码是个例外，它可以指定自己的触发频率**。

run_with_period 这个宏的定义如下，其实就是一个`  if 判断语句 `：

```c


#define run_with_period(_ms_)  

    if ((_ms_ <= 1000/server.hz) || ---(1)

         !(server.cronloops%((_ms_)/(1000/server.hz)))) ---(2)
```

其中，条件（1）是为了处理 serverCron() 执行间隔比 _ms_ 参数还要大的情况。举个例子，server.hz = 2，_ms_ = 100 时，serverCron() 函数执行间隔为 500ms，所以每次执行 serverCron() 函数的时候，都要执行我们的 run_with_period 代码块。

条件（2）是为了处理 serverCron() 执行间隔比 _ms_ 参数还要小的情况。其中， server.cronloops 用于记录 serverCron() 函数执行的总次数，举个例子，hz 为 200，_ms_ 为 100 时，serverCron() 函数每 5 ms 执行一次，此时条件（1）不再满足，需要通过条件（2）保证每执行 20 次 serverCron() 函数，才执行一次 run_with_period 代码块。

serverCron() 在这里会按照至少 100 ms 的时间间隔去更新 `STATS_METRIC_COMMAND`、`STATS_METRIC_NET_INPUT`、` STATS_METRIC_NET_OUTPUT  `三个监控值，从名字大概可以看出，它们的含义分别是 Redis 每秒执行的命令数、从网络读取的字节数、向网络发送的字节数。

在 trackInstantaneousMetric() 函数中可以看到具体的更新逻辑，这里涉及到 redisServer 中用于保存监控的 inst_metric 字段，该字段是个数组，里面有三个元素，分别对应上面三个监控指标。inst_metric 结构体的定义如下：

```c
struct {

    long long last_sample_time; // 上次采样的时间戳

    long long last_sample_count;// 上次采样结果

    // 数组长度为16，总共可以存储16次的采样结果

    long long samples[STATS_METRIC_SAMPLES]; 

    int idx; // 用于记录当前使用的samples下标，每次采样完都会加1

} inst_metric[STATS_METRIC_COUNT]; // 数组长度为3
```

明白了 inst_metric 的结构，再看 trackInstantaneousMetric() 采样算法就会感觉非常简单，这里不再展开分析，感兴趣的小伙伴可以参考代码进行分析。

### 更新 LRU 时钟

Redis 最常见的应用场景就是缓存，我们在使用缓存的时候，一般不会存储 DB 里面全量的数据，而只用于缓存一部分 DB 热点数据；对于非热点数据，需要进行定期删除，防止 Redis 内存被撑爆，也就是我们常说的“内存淘汰”机制。**Redis 提供了多种内存淘汰机制**，比如最常用的 LRU 算法，LRU 算法简单来说，就是淘汰最近最少使用的 Key。

既然提到了内存淘汰机制，就不得不提 redisObject 结构体里面的 lru 字段（占 24 个 bit 位），Redis 就是通过 lru 字段记录最后一次访问该 Key 的时间戳，这个时间戳是秒级时间戳，194 天溢出一次。在 Redis 每次启动 LRU 算法淘汰 Key 时，会从整个 DB 里面，选出最长时间未被访问的 Key，然后删掉，也就完成内存淘汰的操作了。

前面说过，在 Redis 这种大流量的场景下，每次访问 Key 的时候，获取系统当前时间戳是个比较耗时的操作，所以，**在 Redis 用 redisServer.lruclock 字段缓存了一个 24 位的时间戳作为 LRU 时钟**，相关代码片段如下：

```c
// 计算24位的LRU时钟，单位是秒，低24位有效，高8位全为0

unsigned int lruclock = getLRUClock();

// 更新server.lruclock字段，进行缓存

atomicSet(server.lruclock, lruclock);
```

接下来，简单看一下 Redis 在执行 LRU 算法进行数据淘汰的时候，是如何使用 lruclock 这个字段的。在 evict.c 中实现了 Redis 数据淘汰的核心逻辑，其中有一个 LRU_CLOCK() 函数用来计算当前的 LRU 时钟：

```c
unsigned int LRU_CLOCK(void) {

    unsigned int lruclock;

    if (1000/server.hz <= 1000) {

        // 如果serverCron()函数一秒至少执行一次，那么server中缓存的

        // lruclock也是秒级的，可以直接使用

        atomicGet(server.lruclock,lruclock);

    } else {

        // 如果server中缓存的lruclock做不到秒级，就需要进行系统调用获取

        // 当前时间戳，并重新计算24位的秒级LRU时钟

        lruclock = getLRUClock();

    }

    return lruclock;

}
```

LRU_CLOCK() 函数的调用方如下图所示，一个是 lookupKey() 函数，Redis 在查找任意 Key 的时候，都会使用到 lookupKey() 函数，查找成功时就会更新 value 值中的 lru 字段为当前的 LRU 时钟；另一个是 estimateObjectIdleTime() 函数，该函数是在 Redis 进行内存淘汰的过程中计算 value 值空闲了多久，如下图右侧方框内代码所示，这样 Redis 就可以找到最久没被访问的 Key，并淘汰掉。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51cd690d81ab4fc1860c542e712e02ab~tplv-k3u1fbpfcp-zoom-1.image)

### 更新内存使用统计信息

接下来， serverCron() 函数中会调用 `cronUpdateMemoryStats() 函数`更新内存使用的相关统计信息，涉及到 redisServer 结构体中的一些字段，我们简单看一下。

-   stat_peak_memory：记录当前 Redis Server 的内存使用的峰值。

-   cron_malloc_stats：该字段是 malloc_stats 类型，其中记录了常驻内存（process_rss）、已使用内存（zmalloc_used）等统计信息，更新这些信息的逻辑被 run_with_period(100) 包裹，也就是至少 100 ms 才会更新一次。

如果你想查看这些内存统计信息，可以通过 INFO memory 命令进行查看，下面展示了几个返回值的含义：

```shell
# Memory

# used_memory_human是Redis自身能感知到的内存总量

used_memory_human:1.01M 

# used_memory_rss_human是从操作系统的角度，Redis已分配的内存总量，即常驻内存

used_memory_rss_human:2.70M 

# used_memory_peak_huma是Redis的内存消耗峰值

used_memory_peak_human:1.07M 

... ...
```

INFO memory 命令还有非常多有用的返回值信息，这里不再一一展开分析，感兴趣的小伙伴可以参考[官方的介绍文档](https://redis.io/commands/info/)进行学习。

### 处理进程终止信号

在 initServer() 这个初始化函数中，Redis 会调用 `setupSignalHandlers() 函数`设置处理 SIGTERM、SIGINT 两个终止信号的函数，核心逻辑如下：

```c
void setupSignalHandlers(void) {

    struct sigaction act;

    ... ... // 省略act其他字段的设置逻辑

    act.sa_handler = sigShutdownHandler;

    // 设置SIGTERM、SIGINT两个进程终止信号由sigShutdownHandler()函数处理

    sigaction(SIGTERM, &act, NULL);

    sigaction(SIGINT, &act, NULL);

    ... ... // 省略其他信号的处理逻辑

    return;

}
```

在我们收到 SIGTERM 或 SIGINT 信号的时候，sigShutdownHandler() 函数并不会立刻调用 exit() 函数终止进程，而是将 redisServer.shutdown_asap 字段设置为 1；如果连续两次收到两次终止信号（即 shutdown_asap 为 1 时，再次收到 SIGINT 信号），表示用户急切终止 Redis 进程，sigShutdownHandler() 函数才会直接调用 exit() 函数。相关代码片段如下：

```c
static void sigShutdownHandler(int sig) {

   ... // 省略日志信息

    if (server.shutdown_asap && sig == SIGINT) { // 连续收到两次终止信号

        rdbRemoveTempFile(getpid(), 1);

        exit(1); 

    }

    ... // 省略其他非核心逻辑

    server.shutdown_asap = 1;

}
```

我们回到 serverCron() 函数，当检测到 shutdown_asap 字段被设置为 1 时，serverCron() 函数就会开始进入进程终止的清理逻辑，核心片段如下：

```c
if (server.shutdown_asap && !isShutdownInitiated()) {

    ... //省略其他逻辑

    // prepareForShutdown()函数包含了关闭网络监听、不再接收新的

    // 客户端连接、清空缓冲区等一系列操作，这里不一一展开     

    if (prepareForShutdown(shutdownFlags) == C_OK) exit(0);

} else if (isShutdownInitiated()) {

    if (server.mstime >= server.shutdown_mstime || isReadyToShutdown()) {

        if (finishShutdown() == C_OK) exit(0); // 针对主从复制以及持久化状态的保存

    }

}
```

### 管理 clients 集合

serverCron() 接下来会调用 `clientsCron() 函数`对 server.clients 集合中存储的 client 进行一系列处理，每次 clientsCron() 调用并不会处理整个 clients 集合，而是根据 server.hz 指定的频率，对 clients 集合进行**分片处理**，每次至少处理 5 个 client，这样可以尽可能保证一秒内处理完 clients 集合。

处理每个 client 的时候，clientsCron() 函数会依次从 5 个方面对 client 进行周期性管理，分别对应下图展示的 5 个方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/752b164f79e0422c9b19b09e7ff6858f~tplv-k3u1fbpfcp-zoom-1.image)

我们展开说一下这 5 个方法的功能。

**第一个，** **clientsCronHandleTimeout() 函数** **。** 它会检查 client.lastinteraction 中记录的最后一次交互时间，如果长时间无交互，Redis Server 会认为客户端超时宕机了，会断开与该客户端的连接，并且会释放对应 client 实例。具体超时时长由 redis.conf 配置文件中的 timeout 配置项指定，对应 redisServer 中的 maxidletime 字段，默认值是 0，也就是没有超时时间的限制。注意，如果这个 client 是用于主从复制、执行阻塞命令或是使用在 PUB/SUB 场景下的话，则不会受这个超时时间的影响。

**第二个，** **clientsCronResizeQueryBuffer() 函数** **。** 这个函数的核心目的是减小 client.querybuf 缓冲区的大小，这样可以释放一部分没用的空间。

有两个场景可以触发 querybuf 缓冲区的缩容：

-   一个场景是 querybuf 缓冲区大小超过了 4 K 且客户端空闲 2 秒没有发来任何请求；
-   另一个场景是 querybuf 缓冲区大小超过了 32 K 且 querybuf 超出了缓冲区峰值大小的两倍。这里的缓冲区峰值大小由 client.querybuf_peak 字段记录，在每次读取请求的时候，也就是 readQueryFromClient() 函数中更新。

满足任意一个场景，clientsCronResizeQueryBuffer() 就会释放 querybuf 缓冲区中未使用的空间。

**第三个，** **clientsCronTrackExpansiveClients() 函数** **。** 它的核心逻辑是统计当前 client 中读写缓冲区的最大值，统计结果暂存到 ClientsPeakMemInput、ClientsPeakMemOutput 这个两个全局数组中，这两个数组的长度都固定为 8。在 INFO clients 命令的返回值中看到的 client_recent_max_input_buffer 和 client_recent_max_output_buffer 信息，就是通过这两个全局数组计算得到的。

**第四个，** **updateClientMemUsage() 函数** **。** 其核心逻辑是累计全部 client 占用的内存量，一个 client 占用的内存包括 client 实例本身、querybuf 缓冲区、存储请求解析结果的 argv 数组、用于暂存响应数据的 buf 缓冲区以及 reply 队列等一系列空间的总和。这里会按照 client 的类型分开累计内存占用总量，Redis client 分为 CLIENT_MASTER、CLIENT_TYPE_SLAVE、CLIENT_TYPE_PUBSUB、CLIENT_TYPE_NORMAL 四类，所以存储 client 内存使用总量的 server.stat_clients_type_memory 数组长度也为 4。通过 INFO memory 命令获取的 mem_clients_slaves、mem_clients_normal 值就是通过 server.stat_clients_type_memory 数组的值计算得到的。

另外，`在 Redis 7.0 中新增了一个 Client Evict 的功能`。它是一种**保护机制**，当 Redis Server 发现所有 client 消耗的内存超过了某个阈值的时候，就会开始逐出 client，Redis Server 会选择一部分 client，然后断开连接，并且释放掉相应 client 所占的空间，这样的话，就可以保护 Redis Server，防止被异常的 client 打爆。这个具体阈值是通过 redis.conf 中的 maxmemory-clients 项配置的，这个配置项可以有两种配置方式，可以是指定占用空间的空间大小，比如说 1G；也可以指定占用空间的百分比，比如 5%。

通过前面的介绍我们知道，Redis 会在 redisServer.clients 列表中维护当前连接的全部 client 实例，如果在逐出逻辑中，逐个扫描每个 client 占用的空间，然后再进行筛选和逐出，是非常耗时的。

为了解决这个问题，Redis 会在 updateClientMemUsage() 里面，按照占用空间的大小，把 client 分为 19 个桶，分别是 (0, 32K]、(32K, 64K]、[64K, 128K]、...、(2G, 4G]，也就是说，一个 client 实例占用了 48K 的内存空间，就会放到 (32K, 64K] 这个桶里面。在后续需要逐出的时候，Redis 就可以直接按照规则从相应的桶里面获取相应大小的 client 进行逐出。这里的每个桶都是一个 clientMemUsageBucket 对象，它里面维护了两个字段，一个是落在这个桶里面的 client 列表，另一个是这个桶内全部 client 所占空间的总和。

> 具体的逐出逻辑和方案小伙伴们可以参考[这个 PR](https://github.com/redis/redis/pull/8687) 以及[这个文档](https://redis.io/docs/reference/clients/#client-eviction)。

**第五个，** **closeClientOnOutputBufferLimitReached() 函数** **。** 核心逻辑是检查当前 client 的写回缓冲区是否超过 soft 限制和 hard 限制。

如果超过了 hard 上限值，client 直接就会被关闭；如果第一次超过 soft 上限值，Redis 会先对 client 打上标记，其实就是在 client.obuf_soft_limit_reached_time 字段中记录这次超过 soft 限制的时间戳，而不是立刻关闭 client；如果发现 client 长时间超过 soft 上限值，才会关闭 client。

小伙伴们如果对这段检查逻辑感兴趣，可以直接去查看 checkClientOutputBufferLimits() 函数的代码。

### 管理 DB

完成 client 的管理之后，serverCron() 会调用 `databasesCron() 函数`完成对数据库的管理，其中主要做两件事。

-   第一件事是通过 activeExpireCycle() 函数进行清理过期的 Key。这个逻辑比较重要，我们在后面会单独用一节的内容来介绍 Key 到期清理的逻辑。



-   第二件事是通过 tryResizeHashTables() 函数尝试调整 DB 的大小，然后再通过 incrementallyRehash() 函数进行渐进式 rehash。这里无论是调整 DB 大小还是渐进式 rehash，都是调整底层的两个 dict 实例：一个是真正存储的 dict 实例，也就是 redisDb.dict；另一个是存储 Key 过期时间的 dict 实例，也就是 redisDb.expires。（Dict 实例的扩缩容以及渐进式 rehash 的逻辑，我们在[第 21 讲《数据结构篇：Hash 核心方法剖析》](https://juejin.cn/book/7144917657089736743/section/7147529534613487631)中已经详细分析过了，这里就不再重复了。）

### 其他操作

除了上述操作之外，serverCron() 函数还会执行下面的操作。

-   一些持久化的相关操作，例如，启动子进程完成 AOF、RDB 的写入。

-   当 Redis 处于主从模式时，会通过 replicationCron() 函数执行一些主从复制相关的逻辑。
-   当 Redis 处于集群模式中，会通过 clusterCron() 函数执行一些 Redis 集群相关的逻辑。
-   当 Redis 处于哨兵模式时，会通过 sentinelTimer() 函数执行哨兵相关的逻辑。
-   调用 stopThreadedIOIfNeeded() 函数检查是否要暂停 IO 线程。这里会检查 server.clients_pending_write 字段长度，如果该列表长度很短，表示没有足够多的 client 等待返回数据，serverCron() 会通过 stopThreadedIO() 函数将 io_threads_active 设置为 0，暂停 IO 线程，IO 线程就自旋等待了。后续如果需要 IO 线程来工作的时候，Redis 主线程会在 handleClientsWithPendingWritesUsingThreads() 重新将 io_threads_active 设置为 1，启动 IO 线程，以 IO 多线程的模式读写数据。
-   递增 server.cronloops 字段，统计 serverCron() 函数的总次数。

上述这些处理逻辑我们将在后续的专题中逐个展开详述，这里不再完全展开详述了，你先了解个大概，有个总体的轮廓就行。

## 总结

在这一节中，我们重点介绍了 Redis 中最重要的时间事件，它会定期调用 serverCron() 函数。在 serverCron() 函数中，会完成一系列关键操作，例如：

-   更新时钟缓存，这样可以减少进行系统调用的次数；
-   更新监控信息和统计信息，用于监控 Redis 的运行状态和一些统计指标；
-   更新 LRU 时钟，在后续介绍的 LRU 内存淘汰机制中，将依赖这个 LRU 时钟对 Key 进行淘汰；
-   管理 client 集合，其中会断开无效的 client 连接、释放无用的缓冲区。

下一节，我们将介绍 Redis Key 过期的实现机制。