在上一节中，我们已经详细介绍了 Redis Cluster 中集群配置的两个方面，一个是 Cluster 节点之间的主从关系配置，另一个是 slot 槽位分配的问题。之后，分析了 clusterCron() 周期性发送 PING 消息以及PING 消息接收方解析 PING 消息的逻辑，其中重点介绍了对 clusterMsgDataGossip 部分的解析和处理。

在 Redis Cluster 完成前面两节介绍的启动流程之后，就可以正常对外提供服务了。在提供服务的期间，Redis Cluster 中可能会因为网络、磁盘、内存等各种方面的问题，导致其中某些 Master 节点出现不可用的情况。这个时候，就需要 Redis Cluster 进行自动故障转移，将 Slave 节点提升为 Master 节点继续对外提供服务，保证整个 Redis Cluster 集群的高可用。

Redis Cluster 中的 failover 分为`自动 failover` 和`手动 failover`，**自动 failover 是由 Redis Cluster 通过自身的探活机制发现宕机而触发的，手动 failover 则是由客户端发送 CLUSTER FAILOVER 命令触发的**。

## 自动 failover

通过前文对消息中 clusterMsgDataGossip 数组的分析我们知道，有 `PFAIL` 和 `FAIL` 两种表示节点故障的状态位。在 Redis Cluster 会周期性地检查每个节点的 ping_sent、data_received 字段，确认多长时间没有收到其发来的数据，如果超过 cluster_node_timeout 配置的时长（默认 15 秒），会认为该节点已经不可达，会在该节点对应的 clusterNode->flags 标记中设置 PFAIL 标志位。在后续发送 PING、PONG 等消息的时候，当前节点会将有 PFAIL 标志位的全部节点添加到 clusterMsgDataGossip 数组中，通知到其他节点。

在当前节点感知到半数以上的节点都认为一个节点处于 PFAIL 的时候，就会广播 FAIL 消息，让所有节点快速感知到该节点可能宕机的情况。广播 FAIL 消息的逻辑位于 markNodeAsFailingIfNeeded() 函数中，感兴趣的小伙伴可以参考源码进行学习。

当前 PFAIL 状态并不是不可逆的，当前节点如果收到了对端节点的 PONG 消息时，就会立刻清理掉对端节点 clusterNode->flags 字段中的 PFAIL 状态。

### 预处理

当一个 Slave 节点发现其 Master 节点被标记为 FAIL 状态之后，会在 clusterCron() 定时任务中调用 clusterHandleSlaveFailover() 函数，尝试主动发起一次 failover 操作，执行 failover 有三方面的前置条件。

**第一方面要检查当前节点视角下 Master 节点的状态**。

-   当前 Cluster 节点本身是一个 Slave 节点。
-   在当前节点视角中，Master 节点有 FAIL 标记位，或者当前正在进行手动 failover。
-   当前 Cluster 节点的 Master 节点至少负责管理一个 slot。如果 Master 节点不管理任何 slot，也就不会对外提供服务，没必要进行 failover。

**第二方面要检查当前 Slave 节点的主从复制情况**，如果 Slave 节点能够提升为新一任 Master，需要 Slave 节点中的数据尽可能和 Master 一致。我们可以从当前 Slave 节点是否长时间未与 Master 交互来进行判断，这个时间使用 data_age 进行记录。

-   首先，根据当前节点的主从连接情况计算 data_age：如果当前节点与其 Master 的复制连接正常，则 data_age 初始值为最后一次与 Master 交互距今的时长；如果当前节点与其 Master 的复制连接已经断开，则 data_age 初始值为断开连接距今的时长。

-   因为 Master 节点宕机之后，最长经过 cluster-node-timeout 之后才会被打上成为 FAIL 标记 ，所以这里 data_age 超过了 cluster-node-timeout 值，会将 cluster-node-timeout 这段时间从中减掉，实现对 data_age 值的修正。
-   最后，判断 data_age 的值是否大于 (cluster-node-timeout * cluster-slave-validity-factor) + repl-ping-replica-period 这个公式计算得到的阈值，如果大于，说明当前 Slave 节点就会因为数据太旧不能参与 failover。我们可以通过 cluster-slave-validity-factor 配置值，控制哪些 Slave 节点能够参与 failover，从而控制这个主从复制组的可用性。比如，我们可以增大 cluster-slave-validity-factor 的值，让更多的 Slave 节点能够参与 failover 操作，当我们将 cluster-slave-validity-factor 设置为 0 时，会让全部 Slave 节点都能参与 failover。

**第三方面是计算 failover 操作启动的时间点**，也就是 clusterState->failover_auth_time 字段。只有到了该时间点时，当前 Slave 节点才能开始执行后续 failover 操作。 failover_auth_time 延迟时间的计算公式如下：

```
failover_auth_time = 当前时间戳 + 500ms + 0-500ms 之间的随机值 + 

                     当前slave的failover_auth_rank*1000ms
```

这里的 clusterState->failover_auth_rank 字段是参与 failover 的 Slave 全部节点，按照 Replication Offset 进行的排名，Replication Offset 越大，说明 Slave 的同步延迟越小，failover_auth_rank 值也就越小，对应的 Slave 节点就会越快发起 failover，这样就可以避免多个 Slave 节点同时发起 failover 操作。每个 Slave 节点只会在自己的 failover_auth_time 时间点进行后续的 failover 操作。

failover_auth_rank 排名的计算逻辑位于 clusterGetSlaveRank() 函数中，感兴趣的小伙伴可以参考源码进行分析。另外，如果是我们手动启动的 failover 操作，就不需要延迟到 failover_auth_time 时间点执行，而是立刻执行。

完成 failover_auth_time 时间点的计算之后，当前节点会立刻向其 Master 的其他 Slave 节点发送 PONG 消息，同步自身的 Replication Offset 值，同一个 Master 的其他 Slave 节点也会有类似的操作，从而让这些 Slave 感知到最新的 Replication Offset 变化。

在后续等待 failover_auth_time 时间点到来的期间，当前节点每次执行 clusterCron() 时，当前 Slave 节点会根据最新的 Replication Offset 排名调整自身的 failover_auth_time 时间点，从而让最新的 Slave 节点最先发起 failover 操作。


### failover 操作

这里我们假设 failover_auth_time 时间点最先到期的 Slave 节点就是当前 Slave 节点，那么当前 Slave 节点会真正执行 failover 操作，这部分逻辑依旧位于 clusterHandleSlaveFailover() 函数中，其核心逻辑如下：

```c
void clusterHandleSlaveFailover(void) {

     ... // 省略其他逻辑

     if (server.cluster->failover_auth_sent == 0) {

        server.cluster->currentEpoch++;

        server.cluster->failover_auth_epoch = server.cluster->currentEpoch;

        clusterRequestFailoverAuth();

        server.cluster->failover_auth_sent = 1;

        clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG|

                             CLUSTER_TODO_UPDATE_STATE|

                             CLUSTER_TODO_FSYNC_CONFIG);

        return; 

    }

}
```

1.  递增 currentEpoch 加一，让整个 Redis Cluster 进入新纪元，并将其赋值给 failover_auth_epoch 字段。

2.  调用 clusterRequestFailoverAuth() 函数向其他节点发送 FAILOVER_AUTH_REQUEST 消息。如果是手动发起的 failover 操作，会设置一个 FLAG0_FORCEACK 标记，让收到消息的节点必须回复。
3.  FAILOVER_AUTH_REQUEST 消息发送完成之后，当前节点会将 failover_auth_sent 设置为 1，防止重复发送，在此次 failover 操作超时之后，会将 failover_auth_sent 重置为 0。因为递增了 currentEpoch 值，这里还会在 todo_before_sleep 中添加 SAVE_CONFIG、FSYNC_CONFIG 持久化 nodes.conf 配置文件。

下面我们转换视角到接收 FAILOVER_AUTH_REQUEST 消息的节点，在节点收到 FAILOVER_AUTH_REQUEST 消息之后，会进入 clusterProcessPacket() 函数进行处理，其中先会更新 currentEpoch 等信息，这些公共操作就不再重复了。然后，进入专门处理 FAILOVER_AUTH_REQUEST 消息的函数 clusterSendFailoverAuthIfNeeded() 。该函数中先会检查下面这些条件是否成立：

-   接收到消息的当前节点是一个 Master 节点，而发送 FAILOVER_AUTH_REQUEST 消息的节点（即发起 failover 操作的节点）是一个 Slave 节点。如果是 Slave 节点接收到了 FAILOVER_AUTH_REQUEST 消息，会直接忽略调用这条消息。

-   检查 epoch 信息。一个是保证 FAILOVER_AUTH_REQUEST 消息携带的 currentEpoch 必须比所有已知节点的 currentEpoch 值大，另一个是保证 FAILOVER_AUTH_REQUEST 消息携带的 configEpoch 是该主从复制组中最大的。
-   检查当前节点最后一次投票的纪元值（也就是 lastVoteEpoch 字段）是否与当前 currentEpoch 相等。在同一个 Epoch 中，每个 Master 节点内只投票一次，投票完成之后会将 lastVoteEpoch 设置为 currentEpoch。如果当前接收消息的 Master 节点已经在这个 epoch 中投过票了，就不会再次投票。
-   在一段时间（cluster_node_timeout * 2）内，每个 Master 节点只能为一个 Master 节点的 failover 投票一次。也就是说，一个 Master 频繁地 failover，当前 Master 也会拒绝投票。clusterNode 中的 voted_time 字段就是用来记录上次投票时间戳的，每次投票结束之后，Cluster 节点都会将当前时间更新到该字段，然后在下次投票时进行检查。

只有通过上述全部检查，当前 Master 节点才会调用 clusterSendFailoverAuth() 函数，向发起 failover 操作的 Slave 节点返回 FAILOVER_AUTH_ACK 消息完成投票。同时，还会更新 lastVoteEpoch、voted_time 字段，防止重复投票。

下面我们再将视角转回到发起 failover 操作的 Slave 节点，该节点会同样是调用 clusterProcessPacket() 函数，处理收到其他 Master 节点返回的 FAILOVER_AUTH_ACK 投票消息。它会先进行前置条件检查，确保投票节点为 Master、投票节点至少负责管理一个 slot 槽位、投票节点的 currentEpoch 值合理。然后才会将 failover_auth_count 值加一，表示自己收到一张投票；最后在 todo_before_sleep 字段中设置 HANDLE_FAILOVER 标识。

当前节点在 clusterBeforeSleep() 和 clusterCron() 函数中都会再次调用 clusterHandleSlaveFailover() 函数，在这个函数的末尾，会统计当前 Slave 获取到的票数，如果超过半数，就调用 clusterFailoverReplaceYourMaster() 函数将当前 Slave 节点提升为 Master。

clusterFailoverReplaceYourMaster() 函数的步骤如下：

```c
void clusterFailoverReplaceYourMaster(void) {

    int j;

    clusterNode *oldmaster = myself->slaveof;

    if (nodeIsMaster(myself) || oldmaster == NULL) return;



    // 1.将当前节点从上一任 Master 节点的 clusterNode->slaves 列表中删除.

    // 更新当前节点中的 flags 标记位，删除 SLAVE 标记位，添加 MASTER 标记位。

    clusterSetNodeAsMaster(myself); 

    // 2. 断开之前的主从复制连接，并完成释放 client 相关资源、

    // 设置 replid2 等一系列善后操作。

    replicationUnsetMaster();



    // 3. 修改当前节点的 slot 分配视图。将原本由上一任 Master 管理的 slot 全部分配给当前节点。

    for (j = 0; j < CLUSTER_SLOTS; j++) {

        if (clusterNodeGetSlotBit(oldmaster,j)) {

            clusterDelSlot(j);

            clusterAddSlot(myself,j);

        }

    }



    // 4.更新集群状态以及 nodes.conf 配置文件。

    clusterUpdateState();

    clusterSaveConfigOrDie(1);

    

    // 5.广播 PONG 消息，通知其他节点此次 failover 操作的结果

    clusterBroadcastPong(CLUSTER_BROADCAST_ALL);



    // 6. 如果是手动触发的 failover 操作，这里会调用 resetManualFailover() 函数清理相关字段。

    resetManualFailover();

}
```

1.  将当前节点从上一任 Master 节点的 clusterNode->slaves 列表中删除。更新当前节点中的 flags 标记位，删除 SLAVE 标记位，添加 MASTER 标记位。

2.  断开之前的主从复制连接，并完成释放 client 相关资源、设置 replid2 等一系列善后操作。
3.  修改当前节点的 slot 分配视图。将原本由上一任 Master 管理的 slot 全部分配给当前节点。
4.  更新集群状态以及 nodes.conf 配置文件。每次有节点发生 failover 的时候，都需要调用重新检测集群状态，保证每个 slot 都有节点负责。检查集群状态的逻辑位于 clusterUpdateState() 函数中，感兴趣的小伙伴可以去看一下源码。
5.  广播 PONG 消息，通知其他节点此次 failover 操作的结果。
6.  如果是手动触发的 failover 操作，这里会调用 resetManualFailover() 函数清理相关字段。

### 集群状态检查

到此为止，自动 failover 的核心流程就结束了。

最后，我们展开介绍一下 clusterUpdateState() 函数是如何判断当前整个 Redis Cluster 是否可用的，该函数判断的结果会记录到 clusterState->state 字段中。在每次执行命令之前，都需要检查 clusterState->state 字段，也就是如果当前 Redis Cluster 是否可用，如果不可用，那么当前节点不会对外提供任何读写能力，这部分检查 clusterState->state 字段的逻辑位于 getNodeByQuery() 函数中，其如下调用关系图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e56d5932d7aa41a0afaf8988d5813880~tplv-k3u1fbpfcp-zoom-1.image)

下面是 getNodeByQuery() 函数检查 clusterState->state 字段的代码片段：

```c
clusterNode *getNodeByQuery(...) {

     ... // 省略集群PUB/SUB的逻辑

     if (server.cluster->state != CLUSTER_OK) { // 集群不可用

        if (!server.cluster_allow_reads_when_down) { 

            // cluster_allow_reads_when_down配置指定了集群不可用的场

            // 景下，是否能支持读数据请求

            if (error_code) *error_code = CLUSTER_REDIR_DOWN_STATE;

            return NULL;

        } else if (cmd->flags & CMD_WRITE) { // 写请求一定不会被执行

            if (error_code) *error_code = CLUSTER_REDIR_DOWN_RO_STATE;

            return NULL;

        } else {

            // cluster_allow_reads_when_down配置为true，支持读数据操作

        }

    }

    ... // 省略后续的其他检查

 }
```

下面回到 clusterUpdateState() 函数继续分析，该函数在很多场景中都会被调用，例如，感知到某个节点进入 PFAIL 或是 FAIL 时、感知到节点的 ip 地址发生变更时或者感知到某个 Master 节点降级为 Slave 时以及切换自身 Master 等，总之，只要是感知到 Redis Cluster 节点发生变化，就会进行集群状态检查。

下面是 clusterUpdateState() 函数的核心流程。

1.  如果当前是一个重启后的 Master 节点，不会立刻对集群状态检查，而是等待一段时间（默认 2 秒钟），接收一下其他节点的消息，更新一下自己的集群视图信息，才能执行下面对集群状态的判断。

2.  如果 cluster-require-full-coverage 配置设置为 1，则表示 Redis Cluster 需要保证全部 slot 都是可用的状态。如果有任意一个 slot 不可用（也就是其所在的 Master 节点不可用），整个集群都会进入不可用状态。
3.  接下来，检查当前可达的 Master 节点个数，如果未超过半数（即 clusterState->size/2+1），则表示当前节点可能是因为网络分区等原因，与 Redis Cluster 中的大多数节点断网了，此时也会认为整个 Redis Cluster 不可用。
4.  在当前节点认为 Redis Cluster 状态从不可用变为可用的时候，也不会立刻让当前节点对外提供服务，而是延迟一段时间（默认时长为 cluster_node_timeout，最短 500 毫秒，最长 5 秒），同样也是为了接收其他节点的信息，更新自身视图。

5.  完成上述检查之后，会将 Redis Cluster 是否可用的判断结果更新到 clusterState->state 字段中，供其他函数使用。


## 手动 failover

在有的场景中，我们是有目的地、明确地要求某个 Master 下线，比如，我们要给某个服务器添加磁盘或者硬盘，需要这个服务器上运行的 Master 节点下线。这个时候，我们就可以手动执行 `CLUSTER FAILOVER` 命令，指定其他机器上的某个 Slave 节点成为新 Master，继续对外提供服务。

CLUSTER FAILOVER 命令支持 DEFAULT、FORCE、TAKEOVER 三种模式，下面我们以 DEFAULT 模式作为主线进行分析，最后说明 FORCE、TAKEOVER 两种模式的核心区别。

下面是手动 failover 执行的核心逻辑如下。

1.  在一个 Slave 节点收到 CLUSTER FAILOVER 命令时，会立刻计算此次手动 failover 的超时时间（默认 5 秒超时）并记录到 mf_end 字段中。在后续 clusterCron() 函数中，会检查是否到达 mf_end 时间点，一旦到达，就会停止手动 failover 流程，并清空所有相关字段。

2.  当前 Slave 节点下次调用 clusterSendMFStart() 函数的时候，会向其 Master 节点发送 MFSTART 消息。
3.  Master 节点在收到 MFSTART 消息之后，会暂停所有与 Master 交互的 client（暂停时长为 10 秒），然后向发起手动 failover 的 Slave 节点返回 PING 消息。这次 PING 消息的主要目的是向 Slave 节点返回 Master 当前的 Replication Offset 值。这里处理 MFSTART 消息的逻辑也是位于 clusterProcessPacket() 函数中，具体位置如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd6c711322ae4675b8674404813b2608~tplv-k3u1fbpfcp-zoom-1.image)

4.  Slave 节点收到 PING 消息之后，会将其中携带的 Master Replication Offset 记录到 mf_master_offset 字段中。

5.  在下次 clusterBeforeSleep() 函数或是 clusterCron() 函数中，会调用 clusterHandleManualFailover() 函数检查当前 Slave 节点的 Replication Offset 是否已经追上了 Master 节点，如果追上了，会将当前节点的 clusterState->mf_can_start 设置为 1，表示可以进行主从切换。

之后，当前 Slave 节点就会进入前文介绍的自动 failover 流程，注意，因为上面介绍的手动 failover 流程已经完成了 Replication Offset 的对齐，所以就无需 Slave 节点排序、延迟到 failover_auth_time 时间点执行等一系列操作，而是当前 Slave 节点会直接发起 failover。

如果 CLUSTER FAILOVER 命令中携带了 FORCE 参数，Slave 节点不会再执行上述 2~5 步操作，来追平主从同步的 Replication Offset，而是直接将 mf_can_start 字段设置为 1，然后发起 failover。

如果 CLUSTER FAILOVER 命令中携带了 TAKEOVER 参数，Slave 节点不会进行上述所有 failover 操作，即没有对齐 Replication Offset 或选择最佳 Slave 节点的过程，也不会让其他 Master 节点进行投票，而是直接生成新的 currentEpoch 和 configEpoch 值，然后调用 clusterFailoverReplaceYourMaster() 将自己提升为 Master 节点，并广播 PONG 消息来通知其他节点此次 failover 操作的结果。

TAKEOVER 和 FORCE 这两种模式因为没有对齐 Replication Offset，可能会导致数据丢失。例如，我们指定的 Slave 节点并不是最优的从库，而是一个 Replication Offset 落后很多的从库，在它提升为 Master 节点之后，就会导致其他从库进行全量同步，导致部分数据丢失。

## 总结

本节主要介绍了 Redis Cluster 的故障转移实现原理，其中分为` 自动 failover  `和`手动 failover` 两种故障转移，我们重点讲解了自动 failover 的流程。在自动 failover 中，Redis Cluster 会先进行故障转移之前的预处理操作，然后执行真正的 failover 操作，完成 Redis Cluster 节点的主从切换。

下一节中，我们将关注 Redis Cluster 中的另一个重要的话题——节点迁移和数据迁移。