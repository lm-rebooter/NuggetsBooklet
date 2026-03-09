在上一讲中，我们详细介绍了 Sentinel 监控 Redis 主从集群的核心思想，也详细分析了 Sentinel 判定 Redis 服务主观下线和客观下线状态的逻辑。`那在 Sentinel 感知到 Master 节点发生客观下线之后，会做什么呢？`

我可以先告诉你答案，Sentinel 会选择一个 Slave 节点提升为新 Master 节点，并对外继续提供服务，之后，其他 Slave 节点会与新提升的 Master 节点进行主从复制，这个过程就是我们所说的 **“故障转移（failover）”** 。

Redis 之所以引入 Sentinel，其最主要的目的就是实现“自动故障转移”，也就是说，无需人为干预，Sentinel 自动完成整个“故障转移（failover）”的流程，这就可以减少运维成本，提升了整个 Redis 服务的可用性。

## failover 状态机

在开始介绍 failover 操作之前，我们先来关注一下 Master 节点对应的 `sentinelRedisInstance.failover_state 字段`，它是**用来控制 failover 执行流程的核心状态字段**，整个 Sentinel 的 failover 操作是以状态机的方式进行驱动的。

也就是说，**failover_state 这个状态字段控制着整个 failover 的进程，只有 failover_state 的状态值不断向前推进，failover 操作才能继续向下执行**。

failover_state 字段的状态机如下图所示：


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/535a595d16144b1cab431f007689b815~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

为了书写简单，后续 failover_state 状态的枚举值都省略“SENTINEL_FAILOVER_STATE_”前缀。下面是 failover_state 在不同状态值所表示的含义，小伙伴可以先做简单了解，后面我们再逐个介绍它们之间的流转过程。

-   **NONE 状态**：Master 节点一切正常，没有 failover 发生。

-   **WAIT_START 状态**：Master 节点客观下线，且符合 failover 的各项条件，等待其 Leader Sentinel 进行 failover。
-   **SELECT_SLAVE 状态**：Leader Sentinel 会选择一个 Slave 晋级为 Master。
-   **SEND_SLAVEOF_NOONE 状态**：Leader Sentinel 会向选出的 Slave 发送 `SLAVEOF NO ONE` 命令，使其变更为 Master。
-   **WAIT_PROMOTION 状态**：等待 Slave 晋升为 Master。
-   **RECONF_SLAVES 状态**：向其他 Slave 发送 `SLAVEOF` 命令，使它们成为新一任 Master 的 Slave。
-   **UPDATE_CONFIG 状态**：Sentinel 开始监听新的 Master。

了解完 failover_state 各个状态的含义之后，下面我们就结合上面的流程图来详细分析每次状态转换的具体实现。

## NONE→WAIT_START

在上一讲中，我们已经详细分析了 Sentinel 对 Master 节点的状态检查原理，在完成该检查之后，Sentinel 会调用 `sentinelStartFailoverIfNeeded() 函数`检查是否需要对该 Master 节点进行 failover 操作，其中主要检查下面三点：

-   确认该 Master 处于客观下线状态；
-   确认该 Master 处于未进入 failover 的状态，也就是没有 SRI_FAILOVER_IN_PROGRESS 标记；
-   确认该 Master 上次 failover 操作距今已经超过了两个 failover 超时的窗口，默认一个 failover 超时窗口为 3 分钟。

同时满足上面三个条件时，Sentinel 会调用 `sentinelStartFailover() 函数`开启该 Master 的 failover 流程，该函数主要是设置下面的状态字段。

-   首先，将 Master 的 failover_state 字段设置为 WAIT_START 状态，等待 failover 操作开始。

-   然后，在 Master 的 flags 字段中设置 SRI_FAILOVER_IN_PROGRESS 标记，表示该 Master 进入 failover 的状态中。
-   接下来，递增 master->failover_epoch 字段，进入下一个 epoch。
-   之后，更新 master->failover_start_time 字段记录当前时间，作为 failover 的启动时间戳。
-   最后，向 +new-epoch 频道发送消息（包含新的 epoch 值），向 +try-failove 频道发送消息（包含 Master 节点的信息）。

下图说明了 NONE 状态切换到 WAIT_START 状态的关键变化：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/504ccc98bb8c45a2a4e9e65c23fd28b9~tplv-k3u1fbpfcp-watermark.image?)

## WAIT_START→SELECT_SLAVE

根据前面 failover_state 状态的转换图我们知道，Master 进入 WAIT_START 之后会在下一次定时任务中由 `sentinelFailoverWaitStart() 函数`将 failover_state 转移到 SELECT_SLAVE 状态。

**sentinelFailoverWaitStart() 函数的核心功能是确认自身是否为 Leader Sentinel**，这里会迭代 master->sentinels 字典（也就是监听宕机 Master 节点的 Sentinel 对应的 sentinelRedisInstance 实例），统计所有 Sentinel 节点的投票结果（即统计其 leader、leader_epoch 字段值）。如果当前 Sentinel 得到了半数以上的投票，则当前 Sentinel 节点为 Leader 节点，否则表示其他 Sentinel 节点得到过半数的投票，成为 Leader 节点，或者没有任何 Sentinel 节点拿到半数以上投票，此时会等待下次投票才能产生 Leader Sentinel。

当前 Sentinel 节点成为 Leader 之后，会将 failover_state 状态推进为 SELECT_SLAVE，同时向 +elected-leader、+failover-state-select-slave 频道发送消息广播 Leader Sentinel 的选举结果以及 failover_state 状态的迁移信息。下图展示了前文示例中 Sentinel1 成为 Leader Sentinel 的场景：


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a941190d80e2451fa0deaf14f139af5f~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

如果当前 Sentinel 节点未成为 Leader，那就会去定期检查正在执行的选举操作是否超时（默认超时时间为 10 秒），如果发现其超时，会将 Master 节点的 failover_state 状态以及 flags 中的相关标记位清空掉，之后重新检查 Master 节点的状态。

## SELECT_SLAVE→SEND_SLAVEOF_NOONE

在当前 Sentinel 节点成为 Leader 之后，会开始从 Slave 节点中选择一个成为新的 Master 节点，这部分选择逻辑位于 `sentinelSelectSlave()  函数 `中。该函数核心原理分为两部分，一个是根据 master->slaves 中记录的 Slave 状态对 Slave 进行**过滤**，二是对符合条件的 Slave 进行**排序**，最终**选取**最优的 Slave 成为新一任 Master 节点，我们称之为“Promoted Slave”。

下面是 sentinelSelectSlave() 函数过滤 Slave 节点时的关键步骤。

1.  首先，检查 Slave 节点是否处于下线，即检查 slave->flags 中是否包含 SRI_S_DOWN 或 SRI_O_DOWN 标记位。

2.  然后，检查 Slave 节点与当前 Sentinel 节点是否连通，即检查表示 Slave 与当前 Sentinel 之间 intanceLink 连接的 disconnected 字段值。
3.  之后，检查最近一次收到 Slave 节点 PING 响应的时间距今是否超过 5 秒。
4.  接下来，检查最近一次请求 Slave 节点的 INFO 命令是否超时，具体超时时间有 3 秒、5 秒两个选项，具体选择哪个值，是根据 Master 节点处于主观下线，还是客观下线状态决定的。
5.  最后，检查 Slave 主从复制连接的断开时长是否过长，默认是 10 倍的主观下线时间窗口，也就是 5 分钟。Master 下线的话，主从复制的网络连接必然是断开的。但是 Slave 要与 Master 的数据尽可能保持一致的话，主从复制连接最好是在 Master 下线的时候才断开，所以这里会检查 Slave 主从复制连接断开的时长。

通过上述检查的 Slave 节点会被记录到一个数组中，然后**通过 qsort() 函数对数组进行排序**，排序后数组中的第一个 Slave 节点，就是要升级为 Master 的 Slave 节点，我们也称之为 “Promoted Slave 节点”。这里比较 Slave 节点的**排序方式位于 compareSlavesForPromotion() 函数**中，它会依次按照 **Slave 的优先级**、**Replication Offset** 以及 **runId** 对 Slave 节点进行排序。

选出 Promoted Slave 节点之后，Leader Sentinel 会为 Promoted Slave 节点添加 SRI_PROMOTED 标识，然后将 Master 的 failover_state 状态切换为 SEND_SLAVEOF_NOONE 状态，如下图所示。最后向 +selected-slave、+failover-state-send-slaveof-noone 频道发送通知并执行相应脚本。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f80b6bce9e0493782f134df2b7afc20~tplv-k3u1fbpfcp-watermark.image?)

## SEND_SLAVEOF_NOONE→WAIT_PROMOTION

完成上述 Promoted Slave 节点的筛选之后，Leader Sentinel 会在 `sentinelFailoverSendSlaveOfNoOne() 函数`中向 Promoted Slave 节点发送 `SLAVEOF NO ONE` 命令，使其提升成为 Master 节点。**这里实际上是启动了一个 Redis 事务**，依次发送下面的命令：

```c
MULTI                       // 启动事务

SLAVEOF NO ONE              // 让Promoted Slave节点提升为Master

CONFIG REWRITE              // 重写Promoted Slave节点的配置文件

CLIENT  KILL TYPE normal    // 关闭连接Promoted Slave节点的所有客户端

CLIENT  KILL TYPE pubsub    // 关闭Promoted Slave节点上所有PUBSUB

EXEC                        // 执行事务
```

发送完上述命令之后，Leader Sentinel 并不关心其返回值，而是通过后续 INFO 命令的响应，判断 SLAVEOF NO ONE 命令是否执行成功。最后，sentinelFailoverSendSlaveOfNoOne() 函数会将 Master 节点的 failover_state 状态推进为 WAIT_PROMOTION，并在 +failover-state-wait-promotion 频道发送通知。核心操作如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/884bdb2bce3d475aafa8b7ee656be819~tplv-k3u1fbpfcp-watermark.image?)

Leader Sentinel 节点在执行后续定时任务时，发现处于 WAIT_PROMOTION 状态的 Master 节点时，会检查其 failover 操作是否超时，如果超时，会将 failover_state 状态以及相关标记位重置。后续 failover_state 的推进将在 INFO 响应处理函数中完成。

## WAIT_PROMOTION→RECONF_SLAVES

前面我们介绍 INFO 响应对应的回调函数时，已经详细分析了 **sentinelRefreshInstanceInfo() 函数**对 INFO 响应的解析逻辑，这里我们再来看看该函数后半部分与 failover 相关的内容。

如果发现对端节点的 INFO 响应中 role 信息发生变化（也就是从 Master 变成了 Slave 或是从 Slave 变成了 Master），Sentinel 会使用对应的 role_reported 字段记录最新的 role，使用 role_reported_time 字段记录 role 变更的时间戳。

接下来，Sentinel 会根据对端节点的具体状态，进入不同的分支，主要分为三大类：对端节点从 Master 切换为 Slave、从 Slave 切换到 Master 或是始终为 Slave。

如果对端节点**从 Master 切换为 Slave**，一般是因为当前 Sentinel 访问不到该节点，这里不用做任何处理。

如果对端节点是**从 Slave 切换到 Master**，则需要分两种情况来看了。

**第一种情况，检查此次切换是否由 failover 操作触发**。如果当前处理 INFO 响应的是 Leader Sentinel 节点的话，那么 Leader Sentinel 就能够检查出对端节点是否为 failover 操作中选出的 Promoted Slave 节点，以及当前 Master 的 failover_state 和 flags 是否处于 failover 的状态。

当确认是 Promoted Slave 切换成 Master 之后，会紧接前文介绍的 failover 处理流程将 Master 的 failover_state 状态推进为 RECONF_SLAVES 状态，递增其 config_epoch 值，然后将持久化 sentinel.conf 配置文件，最后重置所有节点的 last_pub_time 时间戳，尽快发送 hello 消息，将修改后的配置传递出去。

另外，Leader Sentinel 在得知 Promoted Slave 成功切换成 Master 之后，还会自动调用 client_reconfig_script 脚本，该脚本的参数格式如下：

```c
<master-name> <role> <state> <from-ip> <from-port> <to-ip> <to-port>
```

我们可以通过该脚本进行一些自动运维的操作，例如，在使用 Sentinel + VIP 的场景中，我们可以编写一个 VIP 切换脚本，并通过 `sentinel client-reconfig-script <master-name> <script-path>` 命令进行配置。当 Master 发生 failover 的时候，就可以**通过该 VIP 切换脚本将 VIP 漂移到新一任 Master 上**，继续对外提供服务了。

下图展示了 Leader Sentinel 节点得知 Promoted Slave 提升为 Master 的核心操作：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb22bc2c0eb549c4a1bb2ae87acac936~tplv-k3u1fbpfcp-watermark.image?)

**第二种情况，检测此次切换是否为异常切换**。Sentinel 会检查对端节点以及其 Master 的状态，如果 Master 一切正常，但是其下一个 Slave 节点突然切换为 Master，即为异常切换。这里检查的条件如下：

-   对端节点的 Master 节点正常在线，即对端节点的 Master 能够正常响应 INFO 命令，且 INFO 响应中依旧上报自己为 Master；
-   对端节点最近（8 秒内）没有发生下线；
-   对端 Slave 节点长时间上报自己为 Master，防止误报。

上述三项检查都通过之后，Sentinel 会认为这是一次异常切换，此时，Sentinel 会向对端节点发送 `SLAVEOF` 命令，将其重新变为 Slave 节点。

如果对端**始终为 Slave 节点**，但是其复制的 Master 节点发生了变更，可能是异常切换，也可能是 failover 操作导致的。此时 Sentinel 会进行异常切换的检查，检查条件前文已述，这里不再重复。如果判定为异常切换，则 Sentinel 会发送 `SLAVEOF` 命令，让其重新复制原来的 Master 节点。如果不是异常切换，则当前 Sentinel 不进行任何处理，而是后续由 Leader Sentinel 节点进行处理，让其成为新一任 Master 节点的 Slave。

sentinelRefreshInstanceInfo() 函数最后还有一个分支，与 failover 后续的流程强相关，这里暂时按下不表，后面会展开分析。

## RECONF_SLAVES→UPDATE_CONFIG

在 Promoted Slave 节点提升为 Master 之后，Leader Sentinel 节点会像剩余的 Slave 节点变成Promoted Slave 的 Slave 节点，为了实现该效果，会向这些节点发送 SLAVEOF 命令，这部分逻辑位于 **sentinelFailoverReconfNextSlave() 函数**。默认 Leader Sentinel 会`串行`处理剩余 Slave 节点，即待一个 Slave 节点处理完 SLAVEOF 命令之后，才会向下一个 Slave 节点发送 SLAVEOF 命令，我们也可以通过 sentinel parallel-syncs 配置修改发送 SLAVEOF 命令的并发值。当 Leader Sentinel 节点向 Slave 节点成功发送 SLAVEOF 命令之后，会在其 flags 字段中设置 SRI_RECONF_SENT 位进行标记。

下图简单总结了一下这部分的核心操作：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ef0fa741f9244cc8759e950bbc9883d~tplv-k3u1fbpfcp-watermark.image?)

完成 SLAVEOF 命令的发送之后，我们再跳转到 sentinelRefreshInstanceInfo() 函数（即 INFO 命令处理逻辑）的最后一个分支，这个分支的核心逻辑就是 **Leader Sentinel 用来监控收到 SLAVEOF 命令的 Slave 有没有切换 Master**。

在该分支中，Leader Sentinel 会先确认 Slave 节点设置了 SRI_RECONF_SENT 标记（即 Leader Sentinel 向其发送过 SLAVEOF 命令），然后检查 INFO 响应中返回的 Master 地址与 Promoted Slave 节点的地址是否一致，如果一致的话，会将该 Slave 节点的SRI_RECONF_SENT 标记更新为 SRI_RECONF_INPROG 标记，表示该 Slave 节点正在切换 Master 节点。

接下来，Leader Sentinel 会通过 INFO 响应中的 master_link_status 行，检查该 Slave 节点与新的 Master 的主从复制连接是否已建立成功，如果已建连，则将该 Slave 节点的 SRI_RECONF_INPROG 标记更新为 SRI_RECONF_DONE，表示 Slave 节点切换 Master 节点完成。

下图简单总结了这部分的核心操作：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/100c33ccd85e4db6a73f8458db615753~tplv-k3u1fbpfcp-watermark.image?)

到此为止，整个 INFO 响应处理逻辑我们分三部分全部介绍完了。

接下来我们回到 sentinelFailoverReconfNextSlave() 函数继续分析。在发送完 SLAVEOF 命令之后，Leader Sentinel 节点后续定时任务中会周期性调用 sentinelFailoverDetectEnd() 函数，检查这些收到 SLAVEOF 的 Slave 节点是否已经到达 SRI_RECONF_DONE 状态（即检查 Slave 是否都开始复制新 Master），如果全部到达，则表示 failover 操作已经正常结束。如果没有全部到达 SRI_RECONF_DONE 状态，则检查 failover 操作是否超时，如果超时，会重新向超时的 Slave 再次发送 SLAVEOF 命令，然后结束 failover 操作。

但无论 failover 正常完成还是超时完成，此时都会将上一任 Master 的 failover_state 状态推进为 UPDATE_CONFIG，表示即将开始通知 Sentinel 节点监听新一任 Master。

## UPDATE_CONFIG→NONE

当上一任 Master 进入 UPDATE_CONFIG 状态之后，Leader Sentinel 节点在下次定时任务执行时，会进入 **sentinelResetMasterAndChangeAddress() 函数**，完成下面三个核心步骤。

-   更新 Master 节点地址，即将 Master sentinelRedisInstance 中记录的地址切换成新一任 Master 节点的地址。
-   按照地址从 slaves 字典中删除新一任 Master 对应的 sentinelRedisInstance 实例，毕竟它之前也是一个 Slave 节点。
-   将 Master sentinelRedisInstance 的 failover_state 状态切换为 NONE，表示 Sentinel 已经开始监控新一任 Master 节点。

完成这些操作之后，Leader Sentinel 会持久化自己的 sentinel.conf 配置文件，保存新一任 Master 的信息，还会向 +switch-master 频道发送新旧两任的 Master 地址。

在该 Leader Sentinel 后续发送 hello 消息的时候，就会携带新一任 Master 的地址，其他 Sentinel 收到该消息之后，也会执行 sentinelResetMasterAndChangeAddress() 函数完成 Master 的切换以及状态重置逻辑。下图展示了 UPDATE_CONFIG 状态下 Leader Sentinel 的核心操作：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76a84c3d9d8e49f1ba0b01cd66be3649~tplv-k3u1fbpfcp-watermark.image?)

到此为止，Sentinel 的 failover 逻辑就彻底执行完毕了。

## Sentinel 客户端核心原理

通过前文的介绍，我们了解了 Sentinel Failover 的核心原理，不过你可能会产生一个疑问：如果发生了 Failover，Redis Client 是如何知道新一任 Master 主库的地址呢？

**一种方式是使用 VIP + client_reconfig_script 脚本的方式**，这样客户端看到的始终是 VIP，Sentinel 在 failover 完成时漂移 VIP 到新一任 Master，客户端重新建连即可。这种方式会引入 VIP 这一额外组件，还要额外编写 client_reconfig_script 脚本，增加了运维成本。

**另一种方式是将查找新一任 Master 的能力封装到 Redis 客户端**，在 Redis 官网中提供了[一个 Sentinel Client 的实现指南](https://redis.io/docs/reference/sentinel-clients/)，其中写明了实现 Sentinel Client 的核心原理，这里我们展开说明一下。

Sentinel Client 需要从其已知的 Sentinel 节点集合中，筛选出一个可用的 Sentinel 节点，如下所示：


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e50ceee56d1245738d8ebe69a0fbe48b~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

通过前文的介绍我们知道，Sentinel 之间会 hello 频道交互信息，从而得知多个 Redis 主从复制集群的全部网络拓扑结构，所以 Sentinel Client 只需要找到一个可用的 Sentinel 节点即可。

接下来，Sentinel Client 会将向 Sentinel 发送 sentinel get-master-addr-by-name master-name 命令。通过前面的介绍我们知道一个 master-name 可以唯一定位一个 Master 节点（其 Slave 节点也自然可以查询到了），Sentinel 在收到 sentinel sentinel get-master-addr-by-name 命令之后，会根据 master-name 查询 sentinel.master 字典，获取对应 Master 节点的地址，如果该 Master 处于 Failover 的状态，则返回 Promoted Slave 节点的地址。

最后，Sentinel Client 会向 Master 节点发送数据 ROLE 命令或 INFO 命令，并根据返回值确认 Sentinel 返回的节点确实是 Master 节点。确认之后，Client 就可以与 Master 节点建立连接，执行后续正常的读写命令了。另外，Sentinel Client 会订阅各个 Sentinel 节点的 +switch-master 频道，在当出现 failover 操作的时候，Sentinel Client 能够第一时间得到新一任 Master 的地址并尝试进行连接，从而连接新的 Master 节点。

即使 Sentinel Client 未及时收到 +switch-master 频道的消息通知，在 Master 节点下线的时候，Sentinel Client 与 Master 之间的连接会自然断开，Sentinel Client 也会自动重新执行上述逻辑，查找最新的 Master 节点。如果 Sentinel Client 查找到的 Sentinel 节点持有的 Redis 节点拓扑并不是最新的，导致其返回的 Master 节点地址错误，Sentinel Client 也可以通过 ROLE 命令或是 INFO 命令确认该节点并非真正的 Master 节点，从而重试上述逻辑查找新的 Sentinel 节点询问 Master 节点。

在读写分离的场景中，客户端可能希望连接 Slave 节点，此时 Sentinel Client 会向 Sentinel 发送 sentinel replicas master-name 命令得到 Slave 节点列表，然后 Sentinel Client 选择合适的 Slave 节点进行连接。当出现 failover 的时候，Leader Sentinel 会向所有 Slave 节点发送 CLIENT KILL type normal 命令断开全部客户端连接，客户端之后会重新执行上面的流程，选择新的 Slave 节点进行连接。

在 Java 中常用的 Redis 客户端是 Jedis，它基本上就是按照上述方案进行实现的，相关的实现位于 JedisSentinelPool 中，这里就不再展开介绍了。其他 Redis 不同客户端的具体实现可能与上面描述的方案大同小异，这里就不再一一展开赘述了，感兴趣的同学可以查找相关资料进行学习。

## 总结

本节承接上一节完成了对 Redis Sentinel 的介绍，本节重点介绍了 Sentinel 自动故障转移相关的内容。

-   首先，我们说明了引入 Sentinel 的核心目的之一就是实现 Redis 主从集群自动故障转移。
-   然后，我们介绍了 Sentinel 模式中故障转移的状态机，以及各个状态的具体含义。
-   接下来，我们详细梳理了 Sentinel 故障转移的流程，分析了每一次状态转换的底层实现。
-   最后，还说明了客户端侧如何支持 Sentinel 模式的自动故障转移。

如果你在学习过程中有什么不懂的地方，或者有什么问题，欢迎你在留言区与我分享，我们一起交流、一起进步。