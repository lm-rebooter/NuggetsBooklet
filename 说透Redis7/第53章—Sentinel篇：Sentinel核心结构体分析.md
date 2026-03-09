在前面的章节中，我们已经详细分析了 Redis 主从复制的核心原理，分别用主库视角和从库视角分析了各自在主从复制方面的核心实现。在这个过程中，我们提到 Redis 主从复制的核心目的之一就是`提高 Redis 服务的高可用性`，主要是在主库出现故障时，我们可以将从库提升为主库，继续对外提供服务。

在绝大多数实际应用中，运维小伙伴希望系统能够在发生故障时，自动完成上述切换主库的操作，这个能力也就是我们常说的“**故障转移**”（failover）。要实现自动故障转移的能力，除了需要主从复制之外，需要一些额外监控和故障发现机制，其中一种实现方式，就是我们这一章要介绍的 **Sentinel（哨兵机制）** 。

## Sentinel 概述

Sentinel 是 Redis 提供的高可用解决方案之一。一个 Sentinel 服务进程其实本身就是 Redis 实例，只不过这个 Redis 服务实例是以 Sentinel 模式运行的，它不对外提供读写键值对的服务，而是监控其他 Redis 服务实例是否运行正常，有点类似现实生活中`监工`的感觉。

为了防止 Sentinel 本身出现单点问题，一般会将多个 Sentinel 实例组成一个 Sentinel 集群。Sentinel 核心功能是监控线上 Redis 实例的状态，当发现某个主库故障的时候，Sentinel 会自动将故障的主库下线，然后从剩余的从库中选出一个合适的从库，提升为新一任主库，继续对外提供服务。

引入 Sentinel 之后，整个 Redis 主从集群的架构就变成了下图的结构：


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6383cbeb6a724ed49bb57bf0e50fd725~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

上图中 Sentinel 集群对 Redis 主从集群进行监控的同时，各个 Sentinel 实例之间也会相互监控，从而保证 Sentinel 集群自身的高可用。后面介绍 Sentinel 集群的时候会看到，Sentinel 有选举的操作，所以**一般推荐 Sentinel 集群的实例个数为奇数**，如上图中的 Sentinel 个数就是 3。

另外，一个 Sentinel 集群是可以监控多个 Redis 主从集群的，例如下图展示了一个 Sentinel 集群监控两个线上 Redis 主从集群的架构。


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2217d38ce2b45669f7eef80105a2083~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

## Sentinel 核心原理

介绍完 Sentinel 这个概念以及它的定位之后，我们总结出 Sentinel 的一些核心功能，主要有三点。

-   **监控**：这是 Sentinel 最基础的功能，Sentinel 会定期检查 Redis 主从库的状态，以及其他的运行情况。

-   **自动故障转移**：在 Sentinel 检测到主库故障的时候，Sentinel 会触发自动故障转移。Sentinel 会在剩余的在线从库中选举出新一任主库。
-   **通知**：完成新一任主库的选举之后，Sentinel 会通知其他从库切换成新主库的从库。Sentinel 还可以通过 API 方式给运维人员发送一些集群的状态信息。另一方面，在主库变更的时候，或者客户端第一次访问 Redis 的时候，Sentinel 会将主库的地址下发给客户端。

那 Sentinel 是如何实现上述三个核心功能的呢？首先我们来看 Sentinel 与 Redis 服务实例之间的交互，如下图：


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b4350068a5642f8ae5d567a9d7ca924~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

首先来看 Sentinel 集群与主库交互的关键操作。

-   Sentinel 集群会定时向所有 Redis 实例发送 `PING 命令`，正常在线的 Redis 实例在收到 PING 命令之后，会返回 PONG 响应。这样，Sentinel 就可以检查整个线上 Redis 集群实例的在线情况。

-   Sentinel 集群还会向主库定时发送 `INFO 命令`，主库收到 INFO 命令之后，会将自身运行情况，以及关联从库的信息以及主从复制信息返回。这样，Sentinel 就可以获取主从复制方面的信息。
-   在 Sentinel 明确了各个 Redis 之间的主从关系之后，会通过 `PULISH 命令`向所有 Redis 实例发送自己的信息及主库相关的配置信息，频道名称为 `__sentinel__:hello`（后面简称 hello 频道）。
-   Sentinel 会订阅所有 Redis 实例的 hello 频道，这样，就可以获取正在监控相同 Redis 主从集群的其他 Sentinel 节点的信息，也就感知到了其他 Sentinel 实例的存在。

Sentinel 实例在感知彼此之后，Sentinel 节点之间会进行下面的交互。

-   Sentinel 实例会向其他 Sentinel 实例定时发送 PING 命令，检查它们的在线状态。

-   在当前 Sentinel 发现某个 Redis 实例宕机，且持续一段时间（down-after-milliseconds 配置指定）没有响应 PING 命令检测，会认为这个 Redis 实例是“主观下线（SDOWN）”。当发生故障的是主库时，Sentinel 会通过 is-master-down-by-addr 命令向其他 Sentinel 节点查询主库是否在线，如果超过半数的 Sentinel 实例都认为这个主库“主观下线”，那 Sentinel 则会认为主库是“客观下线（ODOWN）”状态。Sentinel 接下来触发新一任主库的选举。

## Sentinel 启动流程与解析

首先，Sentinel 与我们之前分析的 Redis 源码是同一份代码，编译之后在 src 目录中我们可以看到 redis-sentinel 这个可执行文件，我们可以通过下面两种方式启动：

```shell
# 使用redis-sentinel这个可执行文件启动

./redis-sentinel ../sentinel.conf



# 使用redis-server加sentinel参数启动

./redis-server ../sentinel.conf --sentinel
```

sentinel.conf 是 Redis 在 Sentinel 模型运行的配置文件，sentinel.conf 配置文件中的具体配置项这里先按下不表，在后面分析 Sentinel 核心功能实现时，会进行详细的介绍。

下面我们来看 Sentinel 实例启动的核心步骤，如下图所示：


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6b4359df2a54c919a9326c544f546f0~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

这些逻辑比较分散，散落在 main.c 这个入口文件中，这里我们结合上面这张流程图进行整体的梳理，并展开说明 Sentinel 初始化中每一步核心操作。

1.  首先，执行 checkForSentinelMode() 函数来检查 Redis 的启动模式，它会检查启动命令是否为 redis-sentinel 或者包含 --sentinel 启动参数，从而判断当前 Redis 实例是否以 Sentinel 模式启动。

2.  如果是以 Sentinel 模式启动，Redis 会通过 initSentinelConfig() 函数和 initSentinel() 函数初始化 Sentinel 一些关键字段，例如：

    - Sentinel port 默认设置为 26379。
    - Sentinel 只能执行 Sentinel 相关的命令，例如，ping、sentinel、(un)subscribe、p(un)subscribe、publish、info、hello 等命令，不再支持读写数据等命令。在 populateCommandTable() 填充 redisServer.commands 命令集合的时候，只会把包含 CMD_SENTINEL 或者 CMD_ONLY_SENTINEL 的标识，添加到 commands 集合中，其他的命令全部过滤掉。
    - 在每个 Sentinel 实例中，都会维护一个 sentinelState 实例用来记录一些状态信息，这里会对 sentinelState 实例中的各个字段进行初始化，具体 sentinelState 的内容，我们马上就会介绍到。

3.  接下来，Sentinel 会加载 sentinel.conf 配置文件。这里特别注意 sentinel 开头的配置项，这些配置是 Sentinel 专属的配置，在 loadServerConfig() 函数并不会立刻解析这些配置，而是将它们分类添加到 pre_monitor_cfg、monitor_cfg 以及 post_monitor_cfg 三个配置队列中。之所以区分这三个配置队列，是因为这些配置存在先后依赖，需要按序加载。例如，myid 配置记录需要优先于 monitor 配置加载，monitor 配置要优先于其他 sentinel 配置加载，这些配置的具体含义我们在下面马上会介绍到。

4.  完成配置文件的读取之后，Sentinel 会在 loadSentinelConfigFromQueue() 函数中按照 pre_monitor_cfg、monitor_cfg、post_monitor_cfg 的顺序依次解析并处理其中的配置，具体的解析逻辑位于 sentinelHandleConfiguration() 函数中，这里不过多赘述，后面会对 monitor 等关键配置的解析逻辑进行单独分析。
5.  完成配置加载之后，Redis 会执行 sentinelIsRunning() 函数启动 Sentinel。这里首先会检查当前 Sentinel 是否已经配置了唯一标识（myid），如果没配置，会随机生成一个长度为 40 的字符串作为 myid，并写入到 sentinel.conf 配置文件中。

好了，了解了 Sentinel 的启动流程之后，我们来展开每一步，进行详细的分析。

### sentinelState 结构体

在上面分析 Sentinel 初始化的过程中，我们提到了 **sentinelState 结构体，它是 Sentinel 中最核心的结构体，记录了 Sentinel 实例核心状态信息**。

-   **myid**：长度为 40 的字符串，用于唯一标识 Sentinel 实例。我们可以在 sentinel.conf 配置文件中通过 `sentinel myid <myid>` 配置进行手动指定。如果不手动指定的话，在 Sentinel 启动时会随机生成 myid 标识，随机生成的 myid 将会在 sentinelIsRunning() 中写回到 sentinel.conf 配置文件中。
    
-   **current_epoch**：纪元是很多分布式协议中都有的一个概念，在分布式系统中，主节点发生故障之后，集群会通过分布式协议重新选出新一任主节点，此时就会将纪元值加一，它用于标识旧时代的结束和新时代的开始，这就防止处于两个时代的节点通信，导致集群内的信息错乱。Sentinel 集群中也有类似的选主操作，current_epoch 字段就是用来记录当前 Sentinel 实例所处的纪元。
-   **masters**：它是一个字典集合，其中记录了当前 Sentinel 集合监控的 Redis 主库集合。其中，Key 是 Redis 实例的名称，Value 是表示 Redis 主库的 sentinelRedisInstance 实例指针，sentinelRedisInstance 结构体在后面详细分析。
-   **tilt、tilt_start_time、previous_time**：tilt 字段标识当前 Sentinel 实例是否开启了TILT 模式。在后面介绍 Sentinel 工作原理的时候，我们会看到 Sentinel 需要系统时间比较准确，但如果系统时间不够准确，或是 Sentinel 被某个耗时操作阻塞，Sentinel 就可能执行一些错误操作，例如，认为某个主库主观下线了。这种情况下，Sentinel 就会进入 TILT 模式，此时的 Sentinel 只会收集集群的信息，不会进行任何其他操作。在 Sentinel 实例的时间恢复正常之后，它就会退出 TILT 模式。tilt_start_time 字段记录了当前 Sentinel 进入 TILT 模式的时间戳。previous_time 字段则记录了上次进行对时的时间戳，如果两次对时间隔超过 2 s，当前 Sentinel 就会进入 TILT 模式。
-   **announce_ip、announce_port、announce_hostnames、resolve-hostnames**：正常情况下，Sentinel 实例是可以通过 inet_ntop() 函数获取自身的 ip 并发送给其他 Redis 实例，但是在某些特殊网络环境中，拿到的 ip 值是不正确的。此时我们就可以在配置文件指定 `sentinel announce-ip <announce_ip>` 配置项来指定自身的 ip。announce_port、announce_hostnames 两个字段的含义类似。

### sentinelRedisInstance 结构体与配置加载分析

在 sentinelState 结构体中，masters 是比较关键的集合，其中存储的是 sentinelRedisInstance 指针。从名字就可以看出，sentinelRedisInstance 是 Sentinel 用来抽象 Redis 实例的结构体，它可以表示一个 Redis 主库、从库或是 Sentinel 实例。在它抽象不同类型 Redis 实例时，其中用于记录信息的字段也不同。

这里我们将结合下面三条命令的解析过程来介绍 sentinelRedisInstance 实例的构造过程以及字段含义：

```c
sentinel monitor tesMaster 127.0.0.1 6397 2  

sentinel known-replica tesMaster 127.0.0.1 6380

sentinel known-sentinel tesMaster 127.0.0.1 26379 acechdeaed...
```

前文提到 Sentinel 解析配置文件的核心逻辑位于 sentinelHandleConfiguration() 函数中，解析上述三个 sentinel 配置项的时候，它都会调用 createSentinelRedisInstance() 函数创建对应 sentinelRedisInstance 实例，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e83e457a607c4756a1aecba0ceea1190~tplv-k3u1fbpfcp-zoom-1.image)

在 `sentinel monitor` 配置项中指定的是 Sentinel 需要监听的 Redis 主库信息，对应到 sentinelRedisInstance 结构体中的字段分别如下。

-   name：主库的名称，也就是上述配置示例中的 testMaster。

-   addr：它指向一个 sentinelAddr 实例，sentinelAddr 则包含了主库的 ip 和 port，也就是示例中的 127.0.0.1 这个 ip 和 6379 这个端口值。
-   quorum：对应上面配置示例中的 2，它表示至少需要两个 Sentinel 同时认为主库宕机才会允许进行故障转移。
-   flags ：它是一个状态集合，其中每一位都表示一个状态，其中低三位分别对应 SRI_MASTER、SRI_SLAVE、SRI_SENTINEL，三者互斥，分别表示当前 sentinelRedisInstance 代表的是主库、从库、Sentinel 三种类型的 Redis 实例。
-   runid：Redis 实例的唯一编号。

代表主库的 sentinelRedisInstance 实例创建完成之后，会将 name 与 sentinelRedisInstance 的映射关系写入到前面介绍的 sentinelState.masters 集合中存储。

在上面的示例中， `sentinel know-replica` 和 `sentinel known-sentinel` 配置项指定的是需要已知从库的信息以及已知 Sentinel 的信息，其中配置的 ip 和 port 是从库和 Sentinel 的地址，tesMaster 则是从库对应主库的名称。在创建从库和 Sentinel 对应的 sentinelRedisInstance 实例之前，需要确保主库在 sentinelState.masters 集合中已存在。

在从库和 Sentinel 对应的 sentinelRedisInstance 实例创建完成之后，会写入到主库对应sentinelRedisInstance 中的 slaves 和 sentinels 字段中，这两个字段都是 dict 类型，slaves 集合中的 Key 是从库 ip + port 构成的网络地址，sentinels 集合中的 Key 是 `sentinel known-sentinel` 配置项最后指定的 myid 值，该 myid 值也会记录到 Sentinel 对应 sentinelRedisInstance.runid 字段中，供后续使用。

在 sentinelHandleConfiguration() 函数中我们看到，除了上述主库、从库、Sentinel 的配置解析之外，还会解析很多其他以 sentinel 开头的配置，这些配置中都会指定一个主库的名称，相应的这些配置解析之后都会写入到主库 sentinelRedisInstance 的相应字段中，其作用范围也是在对应主库的主从集群中。例如下面这段配置：

```c
#testMaster1的相关配置

#主库命令、ip、port以及判定客观下线的Sentinel个数

sentinel monitor testMaster1 127.0.0.1 6397 2            

#主库3秒未响应Sentinel的PING请求，则会被判定为主观下线

sentinel down-after-milliseconds testMaster1 30000      

#在故障转移时，需要至少启动多少个从库进行同步

sentinel parallel-syncs testMaster1 1

#故障转移的超时时间

sentinel failover-timeout testMaster1 180000            

sentinel known-replica testMaster1 127.0.0.1 6380

sentinel known-sentinel testMaster1 127.0.0.1 26379 acechdeaed...



#testMaster2的相关配置，配置含义同上

sentinel monitor testMaster2 127.0.0.1 7397 4

sentinel down-after-milliseconds testMaster2 30000

sentinel parallel-syncs testMaster2 2

sentinel failover-timeout testMaster2 180000
```

解析之后的结果如下图所示，表示主库的 sentinelRedisInstance 实例被存放到 sentinelState.masters 集合中，每个主库关联的从库和 Sentinel 对应的 sentinelRedisInstance 实例被存储到主库 sentinelRedisInstance.slaves 和 sentinels 集合中。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c23436e688e4444586033920092310ee~tplv-k3u1fbpfcp-watermark.image?)

sentinelRedisInstance 中还有非常多的字段，这里先按下不表，待后续用到时详细分析。

### 向 +monitor 频道发送消息

完成了 sentinelState 的初始化以及配置加载之后，Sentinel 会调用 initServer()、InitServerLast() 等函数初始化 Redis 的基本结构以及相关线程，例如，创建 redisServer 实例、创建 aeEventLoop 实例、注册网络 IO 事件监听以及回调函数、注册时间事件（serverCron）、启动后台线程和 IO 线程。这些操作涉及到的核心原理在前文已经详细分析过了，这里不再重复。

在 Sentinel 启动的最后阶段，会执行 sentinelIsRunning() 函数，其中随机生成 40 个字节的 myid 并持久化到 sentinel.conf 配置文件中，这部分逻辑比较简单，这里就不展开赘述了。这里需要重点展开介绍的是其中调用的 sentinelEvent() 函数，Sentinel 在需要发送通知的时候，就会调用该函数，这同样包括启动过程中发送的 +monitor 通知。

`sentinelEvent() 函数`主要实现了三个功能，这三个功能与 sentinelEvent() 函数的三个参数也有所对应。

-   **第一个功能是记录日志**。sentinelEvent() 函数的第一参数 level 指定了日志级别，第四个参数 fmt 指定了日志的格式，如果 fmt 参数以“%@”两个字节开头，日志中将会输出第三个参数传入的 sentinelRedisInstance 实例信息；如果第三个参数传入的 sentinelRedisInstance 实例表示从库，则打印日志时还会通过其 master 字段找到主库信息，一并打印出来。相对完整的日志格式如下：


<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be77a865300d49109089c410fb074746~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

-   **第二个功能是向指定 Channel 发送消息**。sentinelEvent() 函数的第二个参数 type 指定了 Channel 的名称，具体发送的消息就是上面生成的日志内容。只有日志级别（level 参数）在 LL_DEBUG 以上的时候，才会发送消息。回到代码中，在 sentinelIsRunning() 函数就会向 +monitor 频道发送消息。

-   **第三个功能是执行用户指定的通知脚本（notification-script）** 。在 Sentinel 中有 notification-script、reconfig-script 两类脚本，这里介绍的 notification-script 实现的功能类似于`告警通知`，目的是将 Sentinel 的关键事件通过脚本的方式发送给运维人员。只有日志级别（level 参数）为 LL_WARNING 级别时，sentinelEvent() 才能触发 notification-script 脚本发送通知。

    notification-script 脚本的配置示例如下，该配置被解析之后，/redis/notify.sh 这个脚本的完整路径就会被记录到主库 sentinelRedisInstance 实例的 notification_script 字段中：

```c
 sentinel notification-script testMaster1 /redis/notify.sh
```

回到 sentinelEvent() 函数的代码实现中，这里并没有直接执行 notification_script 脚本，而是将其写入到了 sentinelState 维护的 scripts_queue 队列中，后面介绍的 Sentinel 定时器会读取该队列的脚本并执行。

```c
void sentinelEvent(int level, char *type, sentinelRedisInstance *ri,

                   const char *fmt, ...) {

    ...//省略前面的处理逻辑

    if (level == LL_WARNING && ri != NULL) { // 

        sentinelRedisInstance *master = (ri->flags & SRI_MASTER) ?

                                         ri : ri->master;

        if (master && master->notification_script) {

            // sentinelScheduleScriptExecution()函数中，

            // 会将notification_script脚本添加到scripts_queue队列中

            sentinelScheduleScriptExecution(master->notification_script,

                type,msg,NULL);

        }

    }

}
```

## 定时任务核心

介绍完 Sentinel 启动的核心流程之后，我们再来看 Sentinel 的另一大部分的核心内容 —— Sentinel 定时任务，这部分的内容**以 sentinelTimer() 函数为入口，定期由前文介绍的 serverCron() 函数调用**：

```c
int serverCron(struct aeEventLoop *eventLoop, long long id, void *clientData){

    ... // 省略其他代码

    if (server.sentinel_mode) // 检查当前是否以Sentinel模式启动

        sentinelTimer();

}
```

sentinelTimer() 函数会在 sentinelCheckTiltCondition() 函数中定时更新 sentinelState.previous_time 时间戳，如果长时间（超过 2 秒）未更新该字段，则表示主线程被某些耗时操作阻塞，此时就需要进入 TILT 模式。

接下来，sentinelTimer() 定时任务会循环全部 sentinelRedisInstance 实例，并通过sentinelHandleRedisInstance() 函数检查每个对应 Redis 实例的状态，具体怎么检查，我们后面会在下一节介绍 Sentinel 监控的时候展开详细分析。

然后，就是处理脚本任务的相关逻辑了。这里我们先来看一下脚本任务 sentinelScriptJob 的核心字段。

-   flags：记录了当前脚本任务的信息，例如，其最低位标识了任务是否正在执行（对应 SENTINEL_SCRIPT_RUNNING）。

-   retry_num：记录脚本任务的重试次数，一个脚本任务最多重试 10 次。
-   argv：该数组中记录了执行对应脚本时的参数，argv[0] 是脚本的名称。
-   start_time：记录了该脚本任务最近一次重试的启动时间，主要是用于计算脚本此次执行是否超时。
-   pid：记录了当前执行此脚本任务的子进程 id。

sentinelTimer() 函数在处理脚本任务的时候，会依次读取 sentinelState.scripts_queue 队列中的脚本任务，然后为每个脚本任务创建一个子进程来执行对应脚本代码。如果碰到已经执行完毕的脚本子进程，这里会将对应的脚本从 scripts_queue 队列中删除。如果碰到执行超时的脚本，这里会将超时脚本对应的子进程 kill 掉，然后将脚本名称和子进程 id 打印到日志中并发送到 -script-timeout 频道中。

最后，随机更新 serverCron() 定时任务的执行频率（随机范围默认是 10~20 之间）。之所以随机更新其执行频率，是为了防止在选主的时候，多个 Sentinel 同时投票导致无法选出合理的主库，后面我们介绍 Sentinel 故障转移的时候，会结合示例介绍该操作的意义。

## 总结

在本节中，我们重点对 Sentinel 的核心原理和启动流程进行了介绍和梳理。首先，我给小伙伴们介绍了什么是 Redis Sentinel ；然后又讲解了 Sentinel 实现 Redis 集群监控以及故障转移的核心原理；最后，分析了 Sentinel 的启动流程以及 Sentinel 启动之后的定时任务。

在下一节，我们将深入介绍 Sentinel 监控 Redis 集群的核心实现。