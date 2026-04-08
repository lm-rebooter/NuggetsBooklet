上一节最后，我们介绍了 Sentinel 中相关的定时任务，其中最核心的逻辑就是检查线上 Redis 实例的状态，这里**检查单个 Redis 实例的状态逻辑位于 sentinelHandleRedisInstance() 函数中**，其流程如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07c94ac018614c88bb339f0a15931307~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，sentinelRedisInstance() 函数的核心逻辑分为监控、状态检查、故障转移三部分：

-   在监控部分的逻辑中，Sentinel 会通过发送各种命令来了解 Redis 集群的拓扑以及每个 Redis 实例的状态；
-   状态检查部分是 Sentinel 根据监控部分的结果，判断 Redis 实例是否进入主观下线或是客观下线状态；
-   最后的故障转移部分，是在发现有主库客观下线的时候，自动选出新的主库，继续对外提供服务的过程。

这一节，我们重点来关注`监控部分`的核心逻辑。

## 连接状态检查

根据上面展示的 sentinelHandleRedisInstance() 函数流程图，首先会检查当前 Sentinel 与其他 Redis 实例之间的连接是否正常，如果连接不正常，则需要重新建连。

前面介绍 sentinelRedisInstance 时提到，一个 sentinelRedisInstance 实例就代表一个 Redis 实例，其 link 字段（instanceLink 指针类型）就抽象了当前 Sentinel 与这个 Redis 实例之间的连接。同学们可能会问：`为什么不使用前文介绍的 connection 表示网络连接，而使用 instanceLink 结构体呢？`

首先，**instanceLink 表示的不仅仅是一个网络连接而是两个**。instanceLink 结构体中的 cc 字段指向了用来发送普通命令的 redisAsyncContext 上下文，pc 字段则指向了用来发送 Pub/Sub 命令的 redisAsyncContext 上下文。redisAsyncContext 是 hiredis 客户端中的异步 API，这里我们先简单认为 redisAsyncContext 与 client 类似即可。

**instanceLink 表示的是一个可复用的网络连接**。为了说明这个复用逻辑，我们举个例子：假设当前 Sentinel 实例是下图中的 Sentinel A，它会在 sentinelState.masters 字典为主库 A 和主库 B 两个主库，维护两个对应的 sentinelRedisInstance 实例；在这两个 sentinelRedisInstance 实例的 sentinels 字段中，又会分别维护一个 sentinelRedisInstance 实例指向 Sentinel B；此时这两个表示 Sentinel B 的 sentinelRedisInstance 中的 link 字段指向了同一个实例，表示的就是 Sentinel A 到 Sentinel B 的连接，该 instanceLink 实例中的 refcount 为 2（即被引用了两次）。


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a0e2173a5e6406f92b1b0aed0903f3d~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

同学们可以回顾一下前文解析 sentinel known-sentinel 配置项的逻辑，在为 Sentinel 创建完对应 sentinelRedisInstance 实例之后，会调用 sentinelTryConnectionSharing() 函数尝试共享 instanceLink。

最后，**instanceLink 不仅有读写数据的能力，还包含了很多状态信息**，例如，disconnected 字段记录了当前连接是否需要重新建连；last_reconn_time 字段记录了上次建连时间戳。这些信息可以帮助我们判断当前 Sentinel 与其他 Redis 实例连接是否正常以及对端 Redis 实例是否正常，在后面判断 Redis 实例主观下线和客观下线时起到重要作用。

我们回到 sentinelHandleRedisInstance() 函数检查重新建连的逻辑，也就是 sentinelReconnectInstance() 函数。该函数先会根据 instanceLink 状态决定是否重新建连，建连之后会指定读写事件的回调并给连接注册读写事件的监听，然后修改 instanceLink 相关的状态字段并发送建连后的相关命令，例如，cc 重新建连之后会立刻发送 CLIENT SETNAME 、AUTH 及 PING 命令，pc 重新建连之后会立刻发送 CLIENT SETNAME 、AUTH 命令并订阅 hello 频道，核心代码片段如下所示：

```c
void sentinelReconnectInstance(sentinelRedisInstance *ri) {

    // 在连接断开时会设置disconnected=1，所以我们检查disconnected字段就知道

    // 当前instanceLink是否需要重新建连

    if (ri->link->disconnected == 0) return; 

    if (ri->addr->port == 0) return;  // 检查对端网络地址是否合法

    instanceLink *link = ri->link;

    mstime_t now = mstime();

    // last_reconn_time记录了上次建连时间，两次间隔需要超过1秒

    if (now - ri->link->last_reconn_time < SENTINEL_PING_PERIOD) return;

    ri->link->last_reconn_time = now; // 更新last_reconn_time



    if (link->cc == NULL) { // cc连接需要重新建连

        // 重新建连

        link->cc = redisAsyncConnectBind(ri->addr->ip,ri->addr->port,

                NET_FIRST_BIND_ADDR);

        // 省略异常情况的处理，下面就是建连成功的逻辑

        // 更新instanceLink中的状态字段

        link->pending_commands = 0;

        // cc_conn_time、pc_conn_time字段记录了cc和pc两个连接最后一次建连时间

        link->cc_conn_time = mstime(); 

        link->cc->data = link;

        // 建连成功之后，会在连接上注册读写回调函数，并在aeEventLoop上注册该连接的

        // 可读可写事件监听，重点在redisAeAttach()、redisAsyncSetConnectCallback()

        // 两个函数中

        redisAeAttach(server.el,link->cc);

        redisAsyncSetConnectCallback(link->cc,

                sentinelLinkEstablishedCallback);

        redisAsyncSetDisconnectCallback(link->cc,

                sentinelDisconnectCallback);

        // 发送AUTH命令进行鉴权

        sentinelSendAuthIfNeeded(ri,link->cc);

        // 发送CLIENT SETNAME命令为当前连接创建名称，连接名称格式如下：

        // sentinel-<Sentinel runid的前8个字符>-<connection_type>

        sentinelSetClientName(ri,link->cc,"cmd");

        // 发送PING命令，其中还会更新instanceLink的last_ping_time、act_ping_time

        // 等时间戳，还会递增pending_commands值，多了一个未响应的请求

        // act_ping_time记录了最后一条未收到 PONG 响应的 PING命令的发送时间戳

        // last_ping_time记录最后一次发送 PING 命令的时间戳

        // pending_commands记录了当前还有多少未得到响应的请求

        sentinelSendPing(ri);

    }

    

    // Sentinel与主库或从库之间才需要建连pc连接，Sentinel之间不需要

    if ((ri->flags & (SRI_MASTER|SRI_SLAVE)) && link->pc == NULL) {

        link->pc = redisAsyncConnectBind(ri->addr->ip,ri->addr->port,

                NET_FIRST_BIND_ADDR);

        ... // 与cc的处理逻辑类似：更新instanceLink状态字段，指定读写事件的回调函数，

            // 注册读写事件的监听，发送AUTH命令鉴权，发送CLIENT SETNAME命令设置连接命令

        // 订阅hello频道

        retval = redisAsyncCommand(link->pc,

            sentinelReceiveHelloMessages, ri, "%s %s",

            sentinelInstanceMapCommand(ri,"SUBSCRIBE"),

            SENTINEL_HELLO_CHANNEL);

    }

    if (link->cc && (ri->flags & SRI_SENTINEL || link->pc))

        link->disconnected = 0; // 重置disconnected状态

}
```

## 发送命令

Sentinel 与集群中其他 Redis 实例（包括 Sentinel、主库、从库）建立连接之后，会定时发送下面三种命令。

1.  定时向主库、从库以及 Sentinel 发送 PING 命令。
1.  定时向主库和从库发送 INFO 指令。
1.  定时向 hello 频道发送 hello 消息。

定时发送这三种命令的逻辑位于 **sentinelSendPeriodicCommands() 函数**中。在发送命令之前，Sentinel 会先检查当前 Sentinel 与目标 Redis 实例连接是否正常，其实就是检查对应的 intanceLink.disconnected 状态。还会检查 instanceLink.pending_commands 中缓存的未响应请求数，确认当前未响应请求数量未达到上限，如果达到了上限，PING、INFO 等探活类的命令，可以延迟发送。

### PING 命令

完成上述检查成功之后，Sentinel 会计算 PING 命令的发送周期，默认是 down_after_period 值，down-after-milliseconds 的含义是认为多长时间没有心跳，就认为这个 Redis 实例客观下线的时间值。我们可以通过下面的配置指定一个主库的 down-after-milliseconds 值。

```shell
sentinel down-after-milliseconds mymaster 30000
```

如果 down_after_period 值大于 1 秒，则按照 1 秒的周期进行发送。下面的判断决定当前时刻是否需要发送 PING 命令：

```c
// 向主库、从库、Sentinel三种Redis实例发送PING命令

//距离上次接收PONG响应的时间超过1秒

if ((now - ri->link->last_pong_time) > ping_period 

        // 距离上次发送PING命令的时间超过0.5秒

        &&(now - ri->link->last_ping_time) > ping_period/2) { 

    sentinelSendPing(ri);

}
```

在 sentinelSendPing() 函数中我们可以看到（如下代码片段所示），Sentinel 处理 PING 响应返回值的回调为 sentinelPingReplyCallback() 函数，它在收到对端 Redis 实例返回 PONG 等正常响应时，会递减 pending_commands 字段、将 last_avail_time、last_pong_time 更新为当前时间戳、将 act_ping_time 重置为 0。

```c
int sentinelSendPing(sentinelRedisInstance *ri) {

    int retval = redisAsyncCommand(ri->link->cc,

        sentinelPingReplyCallback, ri, "%s", // 使用sentinelPingReplyCallback回调

        sentinelInstanceMapCommand(ri,"PING")); 

    ... // 省略对返回值的处理

}
```

当收到 BUSY 响应时，表示对端 Redis 实例正在忙于执行脚本，此时 Sentinel 会发送 KILL SCRIPT 命令停止对端的脚本执行，恢复对端的正常状态。

另外，我们还看到（如下代码片段所示），这里 Sentinel 订阅 hello 频道的回调为 sentinelReceiveHelloMessages() 函数，该函数具体处理 hello 消息的逻辑这里先按下不表，待后面介绍 hello 消息发送时一起分析。

```c
void sentinelReconnectInstance(sentinelRedisInstance *ri) {

    ... // 省略其他处理逻辑

    retval = redisAsyncCommand(link->pc,

                sentinelReceiveHelloMessages, ri, "%s %s", // 设置sentinelReceiveHelloMessages为回调函数

                sentinelInstanceMapCommand(ri,"SUBSCRIBE"), 

                "__sentinel__:hello");

}
```

### INFO 命令

接下来，看 INFO 命令的发送，默认情况下，Sentinel 会 `10 秒`发送一次 INFO 命令，但是有两个例外情况。

-   一个是对端 Redis 实例是从库，且它的主库处于 ODOWN 状态（客观下线）时，需要将 INFO 命令的发送频率提高到 1 秒一次，来及时获取主库的状态。
-   另一个是对端 Redis 实例是从库，且它与主库的主从复制连接断开时，需要将 INFO 命令的发送频率提高到 1 秒一次，来获取准确的重连时间。

计算 INFO 命令发送周期以及发送 INFO 命令的核心代码片段，如下所示：

```c
if ((ri->flags & SRI_SLAVE) && // ri表示的是Slave实例

    // 该Slave对应的Master处于ODOWN状态或是正在Failover的状态

    ((ri->master->flags & (SRI_O_DOWN|SRI_FAILOVER_IN_PROGRESS))  

     // 或者是该Slave与Master之间的主从复制连接断开了

     || (ri->master_link_down_time != 0))) {

    info_period = 1000;

} else {

    info_period = SENTINEL_INFO_PERIOD; // 默认10秒

}



if ((ri->flags & SRI_SENTINEL) == 0 &&

    (ri->info_refresh == 0 ||

    (now - ri->info_refresh) > info_period)) {

    // 发送INFO命令

    retval = redisAsyncCommand(ri->link->cc, sentinelInfoReplyCallback, ri, 

                "%s", sentinelInstanceMapCommand(ri,"INFO"));

    if (retval == C_OK) ri->link->pending_commands++; // 增加pending_commands

}
```

我们看到在 Sentinel 为 INFO 响应注册的回调函数是 sentinelInfoReplyCallback() 函数，该函数会调用 sentinelRefreshInstanceInfo() 函数对主库和从库的运行状态进行判断。首先，要说明一下：INFO 命令的返回值按行组织的 field、value 结构，其中包含了 Redis 实例的很多状态信息，分为 Server、Clients、Memory、Persistence、Replication、CPU 等 11 个大类 100 多项信息。

下面我们来看 sentinelRefreshInstanceInfo() 函数中具体如何处理 INFO 返回值，核心代码片段如下：

```c
void sentinelRefreshInstanceInfo(sentinelRedisInstance *ri, const char *info) {

    sds *lines;

    int numlines, j;

    int role = 0;

    sdsfree(ri->info);

    ri->info = sdsnew(info);

    ri->master_link_down_time = 0;



    /* Process line by line. */

    lines = sdssplitlen(info,strlen(info),"\r\n",2,&numlines);

    for (j = 0; j < numlines; j++) {

        sentinelRedisInstance *slave;

        sds l = lines[j];

        /* run_id:<40 hex chars>*/

        if (sdslen(l) >= 47 && !memcmp(l,"run_id:",7)) { // 1.解析 run_id 这一行，获取 Redis 实例的 runId

            if (ri->runid == NULL) { // 全新的runid

                ri->runid = sdsnewlen(l+7,40);

            } else {

                if (strncmp(ri->runid,l+7,40) != 0) { // 比较当前runid和接收到的runid

                    sentinelEvent(LL_NOTICE,"+reboot",ri,"%@");



                    if (ri->flags & SRI_MASTER && ri->master_reboot_down_after_period != 0) {

                        ri->flags |= SRI_MASTER_REBOOT;

                        ri->master_reboot_since_time = mstime();

                    }

                    sdsfree(ri->runid);

                    ri->runid = sdsnewlen(l+7,40); // 更新runid

                }

            }

        }



        /* old versions: slave0:<ip>,<port>,<state>

         * new versions: slave0:ip=127.0.0.1,port=9999,... */

        if ((ri->flags & SRI_MASTER) &&

            sdslen(l) >= 7 &&

            !memcmp(l,"slave",5) && isdigit(l[5])) // 2.如果对端是主库，则解析 INFO 响应中前缀为 “slave” 的行，得到该主库下的所有从库的 ip 和 port。

        {

            ... // 省略解析ip和port的逻辑

            // 根据 ip 和 port 从其sentinelRedisInstance 的 slaves 字典中查询对应 Slave，如果查找失败，则创建对应的 sentinelRedisInstance 实例并记录到 slaves 字典中

            if (sentinelRedisInstanceLookupSlave(ri,ip,atoi(port)) == NULL) {

                if ((slave = createSentinelRedisInstance(NULL,SRI_SLAVE,ip,

                            atoi(port), ri->quorum, ri)) != NULL)

                {

                    sentinelEvent(LL_NOTICE,"+slave",slave,"%@");

                    sentinelFlushConfig();

                }

            }

        }



        // 3. 如果对端是从库，会解析 master_link_down_since_seconds 这一行，得到主从复制连接断开的时长，并记录到 master_link_down_time 字段中。

        if (sdslen(l) >= 32 &&

            !memcmp(l,"master_link_down_since_seconds",30))

        {

            ri->master_link_down_time = strtoll(l+31,NULL,10)*1000;

        }



        // 4.根据 INFO 响应中包含 role:master 还是 role:slave 决定该 Redis 实例的角色是否发生变化，

        // 比如这个 Redis 实例从从库提升为了主库；再比如这个 Redis 实例本身是主库，由于各种原因，切换成从库了。

        // 如果角色信息发生变化，会更新到其 sentinelRedisInstance 的 role_reported 字段中。

        if (sdslen(l) >= 11 && !memcmp(l,"role:master",11)) role = SRI_MASTER;

        else if (sdslen(l) >= 10 && !memcmp(l,"role:slave",10)) role = SRI_SLAVE;



        if (role == SRI_SLAVE) {

            /* master_host:<host> */

            if (sdslen(l) >= 12 && !memcmp(l,"master_host:",12)) {

                if (ri->slave_master_host == NULL ||

                    strcasecmp(l+12,ri->slave_master_host))

                {

                    sdsfree(ri->slave_master_host);

                    ri->slave_master_host = sdsnew(l+12);

                    ri->slave_conf_change_time = mstime();

                }

            }



            /* master_port:<port> */

            if (sdslen(l) >= 12 && !memcmp(l,"master_port:",12)) {

                int slave_master_port = atoi(l+12);



                if (ri->slave_master_port != slave_master_port) {

                    ri->slave_master_port = slave_master_port;

                    ri->slave_conf_change_time = mstime();

                }

            }



            /* master_link_status:<status> */

            if (sdslen(l) >= 19 && !memcmp(l,"master_link_status:",19)) {

                ri->slave_master_link_status =

                    (strcasecmp(l+19,"up") == 0) ?

                    SENTINEL_MASTER_LINK_STATUS_UP :

                    SENTINEL_MASTER_LINK_STATUS_DOWN;

            }



            /* slave_priority:<priority> */

            if (sdslen(l) >= 15 && !memcmp(l,"slave_priority:",15))

                ri->slave_priority = atoi(l+15);



            /* slave_repl_offset:<offset> */

            if (sdslen(l) >= 18 && !memcmp(l,"slave_repl_offset:",18))

                ri->slave_repl_offset = strtoull(l+18,NULL,10);



            /* replica_announced:<announcement> */

            if (sdslen(l) >= 18 && !memcmp(l,"replica_announced:",18))

                ri->replica_announced = atoi(l+18);

        }

    }

    // 5.最后更新该 Redis 实例相关的 info_refresh 字段，记录最后一次 INFO 响应的时间戳，这也是上面是否判断再次发送 INFO 命令的条件之一

    ri->info_refresh = mstime();

    sdsfreesplitres(lines,numlines);

    ... // 省略其他处理逻辑

}
```

1.  解析 run_id 这一行，获取 Redis 实例的 runId，并更新到相应 sentinelRedisInstance 的 runId 字段中。在主库和从库启动时，也是会随机生成一个 runId 作为自身的唯一标识，这与 Sentinel 的 myid 类似。

2.  如果对端是主库，则解析 INFO 响应中前缀为 “slave” 的行，得到该主库下的所有从库的 ip 和 port。然后，根据 ip 和 port 从其sentinelRedisInstance 的 slaves 字典中查询对应 Slave，如果查找失败，则创建对应的 sentinelRedisInstance 实例并记录到 slaves 字典中。
3.  如果对端是从库，会解析 master_link_down_since_seconds 这一行，得到主从复制连接断开的时长，并记录到 master_link_down_time 字段中。
4.  根据 INFO 响应中包含 role:master 还是 role:slave 决定该 Redis 实例的角色是否发生变化，比如这个 Redis 实例从从库提升为了主库；再比如这个 Redis 实例本身是主库，由于各种原因，切换成从库了。如果角色信息发生变化，会更新到其 sentinelRedisInstance 的 role_reported 字段中。如果这个 Redis 实例本身是从库或者切换之后成为从库的话，需要解析并记录 master_host、master_port、master_link_status 等信息，这些信息是该从库对应主库的一些信息，同时更新 slave_conf_change_time 字段，记录最后更新其主库信息的时间，还会解析 slave_priority、slave_repl_offset、replica_announced 得到从库的优先级、Replication Offset 等主从复制的状态并记录到相应字段中。
5.  最后更新该 Redis 实例相关的 info_refresh 字段，记录最后一次 INFO 响应的时间戳，这也是上面是否判断再次发送 INFO 命令的条件之一。

处理完 INFO 命令返回值之后，sentinelInfoReplyCallback() 函数还会根据上述解出的信息，尤其是 Redis 实例角色的变更，做一些额外的处理操作，这些操作与故障转移相关，后面在介绍故障转移的时候详细分析。

### HELLO 消息

最后，我们来看 hello 消息的发送，Sentinel 默认情况下会每 2 秒向其监控的主库、从库发送 hello 消息。hello 消息的格式如下图所示，分为 8 个部分，每一部分之间通过逗号分隔：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3359e5340c242c6bce8769fb9756e1a~tplv-k3u1fbpfcp-watermark.image?)

该 hello 消息是 Sentinel 在前文介绍的 instanceLink->cc 连接（订阅 hello 频道是通过 pc 连接，不要搞混了）上，发送 PUBLISH 命令到 `__sentinel__:hello` 频道中的。

这里注册的 PUBLISH 响应回调函数为 sentinelPublishReplyCallback() 函数，其中会更新 last_pub_time 字段来记录最近一次发送 hello 消息的时间戳，用于计算下次发送消息的时间。

前面在分析建连逻辑的时候提到，Sentinel 在订阅 hello 频道时会将 sentinelReceiveHelloMessages() 函数注册为回调函数用于解析 hello 命令。sentinelProcessHelloMessage() 函数按照上述格式解析完 hello 命令之后，主要完成了下面三件事情。

1.  更新 pc_last_activity 时间戳，记录最后一次收到 hello 消息的时间戳，在后面判断对端 Redis 实例是否下线时会用到该时间戳。
1.  当前 Sentinel 可以明确其他 Sentinel 与各个主库之间的对应关系，从而更新自身维护的 Sentinel 与主库的网络拓扑。
1.  同步自身 epoch 与各个主库的 epoch。

下面来看一下 sentinelProcessHelloMessage() 函数的一些逻辑细节。

首先，sentinelProcessHelloMessage() 会根据 hello 消息中的 master_name，在 sentinelState.masters 字典中查找主库。然后，根据 hello 消息中的 sentinel_ip、sentinel_port、sentinel_runid 查找主库关联的 Sentinel，这里是查找 master->sentinels 字典。如果没有找到 ip、port、runnId 同时匹配的 Sentinel，就有下面这几种情况。

-   第一种可能是发现了一个新的 Sentinel 实例，此时需要创建一个新的 sentinelRedisInstance 实例来表示这个 Sentinel 实例。
-   也可能是网络拓扑发生变化导致 Sentinel 的 ip、port 发生变化，此时我们需要更新其 ip、port。注意，这里会更新该 Sentinel 在所有主库、从库中记录的 sentinelRedisInstance 实例。
-   还有可能是 Sentinel 发生了重启，导致 runid 发生了变化，此时我们会将同 runid 的 Sentinel 从 master->sentinels 字典中删除，并重新创建对应的 sentinelRedisInstance 实例添加回去。

无论是上述哪一种变更，都会导致当前 Sentinel 实例与目标 Sentinel 实例的连接断开，在下次 sentinelReconnectInstance() 进行连接状态检查时，会重新建连。

接下来，sentinelProcessHelloMessage() 会检查 hello 消息中的 epoch 信息，一个是检查当前 Sentinel 的 epoch 是否落后，如果落后，则进行更新；另一个是检查主库的 epoch 更新，如果落后，除了更新 epoch 之外，还会检查主库的地址是否发生变更，如果发生变更，则表示发生了 failover 操作，这里会调用 sentinelResetMasterAndChangeAddress() 函数完成重置主库的全部状态信息、修改主库地址、更新从库集合，同时向 +switch-master 频道发送新旧两任主库的地址信息，我们可以通过监听这个频道，感知到发生的 failover 操作。

这里的 sentinelResetMasterAndChangeAddress() 函数的核心逻辑，在后面分析 failover 时会详细展开分析。

## 监控总结

到此为止，sentinelHandleRedisInstance() 函数中的核心内容就介绍完了。下面我们就通过一个相对完整的示例梳理一下该过程的内容。

首先我们假设现在有三个主从集群，如下图所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e24731656e4644af80353b43565a4e51~tplv-k3u1fbpfcp-watermark.image?)

接下来我们假设启动了 Sentinel 1~3 三个 Sentinel 服务，每个 Sentinel 的配置文件中都指定了三个主库的地址，如下所示：

```c
sentinel monitor Master1 127.0.0.1 6379 2

sentinel monitor Master2 127.0.0.1 7379 2

sentinel monitor Master3 127.0.0.1 8379 2
```

在这三个 Sentinel1 启动过程中，会解析各自的配置文件，创建各个主库对应的 sentinelRedisInstance 实例，同时建立相应的 InstanceLink 连接。下图展示了 Sentinel1 启动完成的状态，其中 s1-M1 就是 Sentinel1 为主库1 创建的 sentinelRedisInstance 实例，其他同理：


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e089beee81ea42c89183fe85e8bf21ac~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

正如前文所说，Sentinel1 与主库1 建立的连接是两条异步连接，在建连完成之后，会立刻分别发送 PING 命令和 SUBSCRIBE 命令，同时，分别注册 PING 响应的回调函数以及订阅 hello 频道的回调函数。

接下来，Sentinel1 会在 sentinelTimer() 定时任务中周期性地通过 cc 连接向主库1 发送 INFO 和 PING 命令。在 INFO 命令的返回值中，“slave” 开头的行里面记录了主库下面挂的从库信息，在上述示例中，主库1 的 INFO 返回值中会有 slave0、slave1 两行数据，分别记录了从库1 和从库2 两个从库的地址，Sentinel 会为这两个从库创建对应的 sentinelRedisInstance 实例，并在下一个 SentinelTimer() 周期中创建与从库1 、从库2 的网络连接，如下图所示：


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4267f733504c49cb87b661b57f2662ef~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

在后续 sentinelTimer() 定时任务中，Sentinel1 会周期性地发送 PING 命令、INFO 命令、Hello 消息来监控主库1 以及从库1 、 从库2 构成的这个主从复制集群。同理，Sentinel 1 也会为主库2（从库3、从库4）、主库3（从库5、从库6）这 6 个 Redis 实例创建对应的 sentinelRedisInstance 实例，维护它们之间的主从关系，并建立相应的连接进行监控，这里就不再重复了。

前面我们提到，Sentinel1 与主库1 、从库1 、从库2 之间不仅是通过 cc 连接发送命令，还会通过 pc 连接订阅 hello 频道。我们回到示例中，当 Sentinel2 与主库1 （从库1 、从库2）建立完连接之后，会周期性地向这三个 Redis 实例的 hello 频道 PUBLISH 一条 hello 消息。此时，订阅了主库1 hello 频道的 Sentinel1 ，就能感知到 Sentinel2；同样的，Sentinel2 也订阅了主库1 的 hello 频道，也能收到 Sentinel1 发来的 hello 消息，感知到其存在。

在 Sentinel1 收到 Sentinel2 通过主库1 中 hello 频道发来的 hello 消息之后，会为 Sentinel2 创建一个 sentinelRedisInstance 实例，并记录到 s1-M1->sentinels 字典中，如下图所示，Sentinel1 只会与 Sentinel2 创建一个 cc 连接，用来发送 PING、INFO 以及 PUBLISH 命令。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d08ef5445efd4ebcbd326b73aa09dbda~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

Sentinel1 除了通过主库1 的 hello 频道感知到 Sentinel2 之外，还会通过主库2、主库3 感知到 Sentinel2，此时 Sentinel1 会在 s1-M1、s1-M2、s1-M3 的 sentinels 字典中，为 Sentinel2 创建三个不同的 sentinelRedisInstance 实例。但是需要注意，Sentinel1 通过这些不同的 sentinelRedisInstance 连接同一个 Sentinel2 服务时，会复用同一个 InstanceLink 实例，底层的 cc 连接也是同一个。

## 状态检查

介绍完监控部分的核心逻辑之后，我们再来看 sentinelHandleRedisInstance() 函数中与状态检查相关的逻辑。

首先，Sentinel 在开始各个 Redis 实例状态检查之前，第一个要检查的状态，就是自身是否处于 TILT 状态，如果处于 TILT 状态或是从 TILT 状态恢复到正常状态不足 30 秒（这是默认值，默认是 30 个 PING 周期，一个 PING 周期默认一秒），则只执行前文介绍的监控逻辑，收集各个 Redis 实例的状态以及拓扑信息，不再执行后续的任何状态检查操作。

### 主观下线检查

下面正式开始状态检查的逻辑，首先执行 sentinelCheckSubjectivelyDown() 函数判断线上各个 Redis 实例是否出现了主观下线（SDOWN），其核心步骤如下。

1.  首先，检查 cc 连接是否正常。这里主要是检查 PING 命令未及时响应，具体检查条件如下：

    -   该 cc 连接创建的时间距今是否超过 15 秒，创建时间过短，可能 PING 命令还未来得及发送或者响应。
    -   最近一次发送的 PING 命令后没有收到正常回复，且未回复持续时长为 down_after_period / 2。
    -   最近一次 PING 命令响应时间距今已超过了 down_after_period / 2。

    如果满足上述所有条件，则表示这个 Redis 实例可能发生网络故障，这里会断开 cc 连接，将 InstanceLink->disconnected 标记为 1，这样在后续 sentinelReconnectInstance() 函数中就会重新建连。

2.  然后，检查 pc 连接是否正常。这里会检查 pc 最近一次建连时间是否超过 15 秒，以及最近一次收到 hello 消息距今是否超过了 6 秒，如果符合这两个条件，也会断开 pc 连接，等待后续重连。
2.  最后，判断对端 Redis 实例是否进入主观下线状态。这里有下面两个判断条件：

    -   对端 Redis 实例长时间没有 PING 响应。
    -   对端 Redis 实例本身是主库，但是最近 INFO 命令返回值中标记该实例为从库，且持续了一段时间（down_after_period + 20 秒）。

    满足上述任意一个条件，Sentinel 都会将对端 Redis 实例标记为主观下线状态，并向 +sdown 频道发送该实例的信息，还会触发相应的脚本。

    不满足上述条件，且如果对端 Redis 实例已经被标记了主观下线，则将主观下线标记清除，也就是该实例退出了主观下线状态，同时向 -sdown 频道发送该实例的信息，并执行相应脚本。

### 客观下线检查

完成主观下线的检查之后，Sentinel 会调用 sentinelCheckObjectivelyDown() 函数对主库进行客观下线的检查，其核心逻辑是迭代这个主库 sentinelRedisInstance 中的 sentinels 字典，检查其中每个 Sentinel 是否设置了 SRI_MASTER_DOWN 标记。

如果设置了，则表示对应 Sentinel 认为这个主库处于主观下线状态。一旦有超过 master->quorum （具体值参考前面的配置解析逻辑）个 Sentinel 实例，认为该主库主观下线，则当前 Sentinel 就会将其标记为客观下线（ODOWN），同时向 +odown 频道广播该主库的信息并执行相应脚本。否则取消这个主库的客观下线的标记，向 -odown 频道广播这个主库的信息并执行相应脚本。

通过对 sentinelCheckObjectivelyDown() 函数的分析我们看到，它的检查都是在`  Sentinel 本地 `完成的，那各个 Sentinel 对这个主库的主观下线信息，也就是 SRI_MASTER_DOWN 标记，是在什么时机更新到本地的呢？这部分逻辑在 sentinelAskMasterStateToOtherSentinels() 函数中，它会定期向监听该从库的全部 Sentinel 实例发送 `sentinel is-master-down-by-addr`命令，核心代码片段如下所示：

```c
void sentinelAskMasterStateToOtherSentinels(sentinelRedisInstance *master, int flags) {

    dictEntry *de;

    dictIterator *di = dictGetIterator(master->sentinels);

    while((de = dictNext(di)) != NULL) {

        // 发起sentinel is-master-down-by-addr命令的条件有下面三个：

        // 1、当前Sentinel认为该Master主观下线

        if ((master->flags & SRI_S_DOWN) == 0) continue;

        // 2、对端Sentinel服务与当前Sentinel连接正常

        if (ri->link->disconnected) continue;

        // 3、长时间（1秒）未与对端Sentinel确认该Master实例状态，

        // 这里也会根据flags参数决定是否立刻进行检查

        if (!(flags & SENTINEL_ASK_FORCED) &&

            mstime() - ri->last_master_down_reply_time < SENTINEL_ASK_PERIOD)

            continue;



        ll2string(port,sizeof(port),master->addr->port);

        // 发送sentinel is-master-down-by-addr命令，参数包含了Master的ip、port以及

        // 当前Sentinel的epoch、runid

        retval = redisAsyncCommand(ri->link->cc,

                    sentinelReceiveIsMasterDownReply, ri,

                    "%s is-master-down-by-addr %s %s %llu %s",

                    sentinelInstanceMapCommand(ri,"SENTINEL"),

                    announceSentinelAddr(master->addr), port,

                    sentinel.current_epoch,

                    // 根据当前failover状态，决定是否需要对端Sentinel投票

                    (master->failover_state > SENTINEL_FAILOVER_STATE_NONE) ?

                    sentinel.myid : "*");

        if (retval == C_OK) ri->link->pending_commands++;

    }

    dictReleaseIterator(di);

}
```

下面我们切换一下视角，来到接收到 `sentinel is-master-down-by-addr` 命令的 Sentinel 实例，它处理该命令的逻辑位于 sentinelCommand() 函数中，其中会检查命令中指定的主库在自身视角中是否已经主观下线了。

**有足够多的 Sentinel 认为一个主库主观下线时，我们还需要为该主库选出一个 Leader Sentinel 来发起并控制故障转移流程。**

选举 Leader Sentinel 的逻辑也位于 sentinelCommand() 函数，它会关注 `sentinel is-master-down-by-addr` 命令中携带的 Sentinel runId，如果该值不为 “*” 的话，则表示需要当前 Sentinel 为 Leader Sentinel 投票，其中主要完成下面两件事。

-   如果请求携带的对端 Sentinel epoch 值大于当前 Sentinel 的 current_epoch 值，则需要更新 current_epoch 值，并向 +new-epoch 频道发送消息。

-   如果请求携带的对端 Sentinel epoch 值大于该主库的 leader_epoch 值，则更新该 leader_epoch 值，并将 master->leader 设置为对端 Sentinel 的 runId，这就表示为对端 Sentinel 投票了。如果当前 Sentinel 已经为其他 Sentinel 投过票，则返回其投票 Sentinel 实例的 runId。在投票完成之后，会立刻更新 master->failover_start_time 时间戳，表示该主库的故障转移操作已经开始，后续判断故障转移操作是否超过、防止频繁触发故障转移时都会使用到该时间戳。

最后，sentinelCommand() 函数会将 Master 是否主观下线、Leader Sentinel 投票结果以及最新的 leader_epoch 等信息汇总返回给对端 Sentinel。

回到 sentinelAskMasterStateToOtherSentinels () 函数我们可以看到，它为 sentinel is-master-down-by-addr 响应注册的回调函数是 sentinelReceiveIsMasterDownReply()，在该函数中会将响应中的投票结果、leader_epoch 以及是否主观下线等信息更新到对端 Sentinel 对应的 sentinelRedisInstance 中。

最后，我们通过一张图来简单总结一下 `sentinel is-master-down-by-addr` 请求处理流程：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/118eb4e46f06456cbf879a896718ebe0~tplv-k3u1fbpfcp-watermark.image?)

## 总结

在这一节中，我们重点介绍了 Sentinel 监控的实现原理。我们首先分析了 Sentinel 与 Redis 实例以及其他 Sentinel 实例之间，连接状态的检查逻辑；然后介绍了 Sentinel 中 PING 命令、INFO 命令以及 HELLO 命令的发送逻辑与处理逻辑；最后讲解了 Sentinel 对 Redis 实例的状态判定，主要包括主观下线和客观下线两种状态的判定逻辑。

在下一节中，我们将深入解析 Sentinel 故障转移的核心实现。