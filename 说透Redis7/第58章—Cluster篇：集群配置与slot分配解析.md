在上一节中，我们详细分析了 Redis Cluster 中两个节点之间握手的核心流程，这也是搭建 Redis Cluster 的`第一步`：**让各个 Cluster 节点之间感知到彼此的存在**。

前面提到，Redis Cluster 中每个 Master 节点都会有至少一个 Slave 节点，所以**设置 Redis Cluster 中每个节点的主从角色就是启动 Redis Cluster `第二步`要做的事情**。

另外，Redis Cluster 会将它所有的键值对分散到 16384 个 slot 槽位中，而这 16384 个槽位会分配到不同 Master 节点进行管理 ，**如何分配 slot** 就是启动 Redis Cluster `第三步`要做的事情。

这一节，我们就先来看看配置 Cluster 主从关系以及 slot 的分配是如何实现的。

## 集群配置

在 Redis Cluster 中，各个节点之间相互握手之后，我们还需要进行一些配置操作才能得到一个真正可用的 Redis Cluster 集群：一是设置各个节点之间的主从关系，另一个是为 Master 节点分配 slot。

### 配置主从关系

在 Redis Cluster 中各个节点之间相互握手之后，我们可以通过 CLUSTER NODES 命令查看它们的状态。下面就是 CLUSTER NODES 在一个 6 节点组成的 Redis Cluster 上的返回：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ec8bcaf0a7145feb630c0eddd555fac~tplv-k3u1fbpfcp-watermark.image?)

从这张图中每个 Cluster 节点的 flags 状态信息我们可以看到，这些节点之间没有主从关系，全部都是 Master 类型节点，此时，我们可以通过 `CLUSTER REPLICATE <node-id>` 命令将一个节点变为另一个节点的 Slave 节点。

当节点收到 CLUSTER REPLICATE 命令的时候，会先检查一些当前节点以及目标 Master 节点的状态，例如：

-   检查 ` <node-id>  `参数指定的 Cluster 节点是否为 Slave 类型节点，如果是的话，Redis Cluster 不支持级联 Slave 模式，直接报错；
-   检查当前 Cluster 节点是否已经负责管理一部分 slot 或是已经 Key 写入到了 DB 中，如果是的话，无法降级为 Slave 节点，直接报错。

通过上述检查之后，就可以开始对当前 Cluster 节点进行降级了，相关操作在 clusterSetMaster() 函数中，其核心逻辑如下：

```c
void clusterSetMaster(clusterNode *n) {

    if (nodeIsMaster(myself)) { // 1.清理当前节点 flags 中的 MASTER 和 MIGRATE_TO 标记位，并设置 SLAVE 标记位

        myself->flags &= ~(CLUSTER_NODE_MASTER|CLUSTER_NODE_MIGRATE_TO);

        myself->flags |= CLUSTER_NODE_SLAVE;

        clusterCloseAllSlots();

    } else {

        if (myself->slaveof)

            clusterNodeRemoveSlave(myself->slaveof,myself);

    }

    myself->slaveof = n;

    clusterNodeAddSlave(n,myself); // 2.绑定两个节点的主从关系

    replicationSetMaster(n->ip, n->port); // 3.其中会调用 connectWithMaster() 函数，开始与主库建立主从复制连接

    resetManualFailover();

}
```

1.  首先，清理当前节点 flags 中的 MASTER 和 MIGRATE_TO 标记位，并设置 SLAVE 标记位。
1.  然后，绑定两个节点的主从关系。一是更新当前节点的 slaveof 字段，指向 `<node-id>` 指定的这个 Master 节点对应的 clusterNode 实例；二是将当前 Cluster 节点对应的 clusterNode 实例，添加到其 Master 节点的 slaves 数组中，并增加其 numslaves 字段值。
1.  接下来，调用 connectWithMaster() 函数，开始与主库建立主从复制连接。后续执行的都是主从复制部分的逻辑了，这部分逻辑在前面的章节中已经详细分析过了，这里不再重复。

完成主从关系连接的创建之后，当前 Cluster 节点在 cluster->todo_before_sleep 字段中设置 `UPDATE_STATE` 和 `SAVE_CONFIG` 两个标志位，todo_before_sleep 字段中的标志位是用来控制 clusterBeforeSleep() 函数行为的，clusterBeforeSleep() 函数在前文介绍的 beforeSleep() 函数中被调动。这里的 UPDATE_STATE 标志位会触发集群状态（clusterState->state 字段）的更新；SAVE_CONFIG 标志位会触发 nodes.conf 文件的持久化，后面我们会展开详细介绍 clusterBeforeSleep() 函数对两个标志位的处理逻辑。

我们在上述 6 个 Redis 实例的 6380 实例上，执行 `CLUSTER REPLICATE d8b8f1cd26f1ceaa91914c7604dd7e691aa1d1a2` 命令之后，再次执行 `CLUSTER NODES` 命令查看集群状态，就会看到下图主从状态的变化，其中红色部分为发生变更的地方：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f271d942cef45d3aa32f7a9451043f5~tplv-k3u1fbpfcp-watermark.image?)

有个小细节，虽然是一组主从节点中使用同一个 configEpoch，我们通过 CLUSTER NODES 命令看到 Slave 节点的 configEpoch 值也确实和 Master 节点一致了，也就是上图中标红的 4 这个值。但是实际上是 Slave 获取 configEpoch 值时变为了 clusterNode->slaveof->configEpoch，其 clusterNode->configEpoch 值并没有发生变化，我们可以在 clusterGenNodeDescription() 函数中，看到这个判断逻辑：

```c
sds clusterGenNodeDescription(clusterNode *node, int use_pport) {

    ... // 省略其他逻辑

    unsigned long long nodeEpoch = node->configEpoch;

    if (nodeIsSlave(node) && node->slaveof) { // 针对从库的configEpoch处理

        nodeEpoch = node->slaveof->configEpoch;

    }

    ...

}
```

配置完主从关系之后，只是主从两个节点知道了彼此的身份，但是其他 Redis Cluster 节点并不知道这一信息。在上一讲分析 clusterMsg 结构体时候提到，其中会携带发送该消息的 Cluster 节点的一些信息，其中就包含 slaveof 字段，那么当一个 Cluster 节点收到对端节点发来的 PING 等消息时，就可以根据消息中携带的 slaveof 信息，感知到对端节点的主从信息，相关的处理逻辑大致可以分为三个分支。

1.  如果对端 Cluster 节点是从 Slave 切换到 Master，则将对端节点的 clusterNode 实例，从其原 Master 节点的 slaves 数组中移除，然后清理对端 Cluster 节点 flags 字段中的 SLAVE 标记位，并设置 MASTER 标记位。
1.  如果是对端节点从 Master 切换到 Slave，则将对端节点管理的全部 slot 从其 slots 字段中删除，然后将其 flags 字段中的 Master 标记位切换成 Slave 标记位。
1.  还有一种可能是对端节点始终是 Slave 节点，但是其 Master 发生了变更，此时会将对端节点从其原 Master 节点的 slaves 数组中移除，然后添加到其新 Master 节点的 slave 数组中，最后修改对端节点的 slaveof 字段执行新 Master 节点。

这部分处理逻辑位于 **clusterProcessPacket() 函数**中，具体位置如下图所示，感兴趣的同学可以参考源码进行学习。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe059e8f7b784a0291e05e4d1df9576a~tplv-k3u1fbpfcp-zoom-1.image)

### slot 的分配与同步

完成主从关系的配置之后，要正常使用 Redis Cluster 读写数据，还需要进行 slot 的分配。Redis Cluster 会将整个集群存储的全部 Key 映射到 16384 个 slot 中，每个 Key 映射到的 slot 是固定不变的。Redis Cluster 中每个 Master 节点只会负责管理一部分 slot，其 Slave 节点与 Master 负责的 slot 相同，只作为主库备份以及读写分离使用。

我们可以使用 ` CLUSTER ADDSlOTS <slot> [<slot> ...]  `命令批量分配 slot，当节点收到该命令时，会调用 clusterAddSlot() 函数处理参数中指定的每个 slot 。clusterAddSlot() 函数会将传入的 slot 添加到当前 Cluster 节点对应 clusterNode 实例的 slots 字段中，同时会更新 clusterState->slots 数组中对应的指针，将其指向当前 Cluster 节点自身，最后还会在 cluster->todo_before_sleep 字段中设置 UPDATE_STATE 和 SAVE_CONFIG 两个标志位。

`CLUSTER ADDSlOTS` 命令执行完成之后，会出现与 `CLUSTER REPLICATE` 命令类似的情况，那就是只有当前节点自己能够感知到一个 slot 分配给了自己，而其他节点并感知不到这一信息。我们还是要再来审视一下 clusterMsg 结构体，其中包含了一个 myslots 字段，也就是消息发送节点负责管理的 slot 集合，那么当前 Cluster 节点就可以通过 PING 等消息，让其他节点感知到其 slot 集合的变化，这部分逻辑的核心步骤如下。

1.  当一个节点收到 PING 等消息的时候，会先查找到对端节点（sender 节点）所在主从关系中的 Master 节点（sender_master 节点）。如果对端为 Slave 节点，则根据其 slaveof 字段查找其 Master 节点，如果对端节点本身就是 Master，则查找的就是对端节点本身。

2.  接下来，比较消息携带的 slot 集合与步骤 1 中 sender_master 节点所管理的 slot 集合，如果两者不同，则表示其 slot 发生了变更。

3.  如果 sender 节点是 Master 且其管理的 slot 发生了变更，会调用 clusterUpdateSlotsConfigWith() 函数进行处理，该函数首先查找当前节点所在主从关系中的 Master 节点，这里使用 curmaster 记录该节点。然后遍历全部 16384 个 slot，并结合消息携带的 slot 信息，针对每个 slot 进行下面的判断。

    - a. 如果该 slot 已经被 sender 节点管理，则无需处理，直接跳过该 slot。
    - b. 如果该 slot 正在从另一个节点迁移到当前节点，也无需处理，直接跳过该 slot。（slot 迁移的逻辑后面会单独介绍。）
    - c. 在当前节点视角中，没有任何一个节点声称负责管理该 slot，这就是前文介绍的 Redis Cluster 初始化分配 slot 的场景，此时可以直接将该 slot 分配给 sender 节点进行管理。
    - d. 在当前节点视角中，负责管理该 slot 的是当前节点本身，且当前节点还有该 slot 的 Key 存在，这就与 sender 节点告诉我们的信息冲突了，因为 sender 节点告诉我们：该 slot 应该由 sender 节点负责管理。此时，如果 sender 节点拥有了更大的 configEpoch 值，说明当前节点是下线后又重新上线的旧 Master 节点，新一任 Master 为 sender 节点。
    - e. 在当前节点视角中，负责管理该 slot 的是当前节点的 Master 节点（curmaster，即当前节点所在主从关系中的 Master），但是 sender 节点告诉我们说它已经负责管理该 slot 了，且 sender 节点拥有了更大的 configEpoch 值。 说明当前节点是下线 Master 的其他从节点（sender 节点已经提升为新一任 Master 了）。
    - f. 在当前节点视角中，该 slot 不是由当前节点所在主从复制组管理，当前节点只需要更新该 slot 的分配关系即可。

    在场景 c、f 中，直接修改当前节点自身的 slot 视图，将该 slot 分配给 sender 节点管理即可。而在 d、e 场景中，除了修改 slot 归属节点之外，还要将当前节点变更为 sender 节点的 Slave 节点，如果当前节点本身是个 Slave 节点直接切换就好了，但如果当前节点是一个下线又上线的旧 Master 节点，我们需要先清理掉其管理的全部 slot 以及其中全部 Key，才能将其降级为 sender 节点的 Slave。

4.  在步骤 3 中处理的主要是 sender 节点拥有更大 configEpoch 的场景，还有一种场景是：对某个变更的 slot 来说，在当前节点 slot 分配视图中记录的该 slot 管理节点的 configEpoch 值，比 sender 节点的 configEpcoh 更大。这种场景下，需要调用 clusterSendUpdate() 函数向对端的 sender 节点发送 UPDATE 消息。

UPDATE 消息与 PING 消息不同之处主要在于 data 字段的取值，UPDATE 消息的 data 字段指向了一个 clusterMsgDataUpdate 实例，其中记录了指定节点的名称、configEpoch 以及负责的 slot 集合。在上述步骤 4 中，当前节点就会将其 slot 分配视图中，与 sender 节点冲突的节点信息，填充到 clusterMsgDataUpdate 实例中，然后发送给 sender 节点。

我们转换到 UPDATE 消息接收节点的视角，当它在接收到 UPDATE 消息之后，会进入 clusterProcessPacket() 函数中，处理 UPDATE 消息的分支，具体位置如下图所示。其中会解析消息中的 clusterMsgDataUpdate，确认其中携带的 configEpoch 值大于当前节点的 configEpoch 值之后，会更新其 configEpoch 值，并调用上面介绍的 clusterUpdateSlotsConfigWith() 函数更新 slot 变化，具体流程不再重复了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c40084db18c64854a7a2acabaf599e22~tplv-k3u1fbpfcp-zoom-1.image)

## 定时 PING 消息

clusterCron() 函数中除了完成前文介绍的握手操作之外，还会定时向其他节点发送 PING 消息进行探活了。发送方式主要分为随机探活以及超时探活。

`随机探活`是指一个节点会每隔一秒从自己的 clusterState->nodes 节点列表中，随机选取 5 个节点，然后从其中选出一个符合下列条件的节点发送 PING 消息。

-   该节点与当前节点已建连，也就是这个节点对应的 clusterNode->link 字段不为 NULL。
-   该节点已经响应了当前节点的全部 PING 消息，也就是其 ping_sent 字段值为 0。
-   该节点是这 5 个节点中最长时间没有收到 PONG 回复的节点，即 pong_received 最小。

`超时探活`是指每次 clusterCron() 函数都会检查所有节点的 PONG 回复时间距今是否超过了 cluster_node_timeout 配置值的 1/2，如果超过了，会立刻发送 PING 消息进行探活。

下面我们来看 clusterProcessPacket() 函数是如何处理已知节点发来的 PING 消息，核心步骤如下。

```c
int clusterProcessPacket(clusterLink *link) {

    clusterNode *sender;

    ... // 省略其他处理逻辑

    // 1.根据 PING 消息中携带的对端 Cluster 节点名称，

    // 从当前节点的 clusterState->nodes 节点列表中查找对应的 clusterNode 实例

    sender = getNodeFromLinkAndMsg(link, hdr);

    // 2.将 sender 节点中的 data_received 字段更新为当前时间，

    // 记录最后一次收到对端 Cluster 节点消息的时间

    if (sender) sender->data_received = now;

    

    if (sender && !nodeInHandshake(sender)) {

        // 3.解析 PING 消息中携带的 currentEpoch 、configEpoch、repl_offset 三个值，并更新到相应字段    

        senderCurrentEpoch = ntohu64(hdr->currentEpoch);

        senderConfigEpoch = ntohu64(hdr->configEpoch);

        if (senderCurrentEpoch > server.cluster->currentEpoch)

            server.cluster->currentEpoch = senderCurrentEpoch;

        if (senderConfigEpoch > sender->configEpoch) {

            sender->configEpoch = senderConfigEpoch;

            clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG|

                                 CLUSTER_TODO_FSYNC_CONFIG);

        }

        sender->repl_offset = ntohu64(hdr->offset);

        sender->repl_offset_time = now;

        ... // 省略其他字段的更新

    }

    

    if (type == CLUSTERMSG_TYPE_PING || type == CLUSTERMSG_TYPE_MEET) {

        ... // 省略其他类型消息的处理

        // 4.调用 clusterSendPing() 函数向 sender 节点返回 PONG 消息

        clusterSendPing(link,CLUSTERMSG_TYPE_PONG);

    }

    

    // 5.更新 sender 节点的 flags 标记。这里是保留 sender->flags 字段中标记位的同时，

    // 新增 PING 消息携带的 flags 标记位

    if (type == CLUSTERMSG_TYPE_PING || type == CLUSTERMSG_TYPE_PONG ||

        type == CLUSTERMSG_TYPE_MEET) {

        if (!link->inbound) {

            if (nodeInHandshake(link->node)) {

                if (sender) {

                    if (nodeUpdateAddressIfNeeded(sender,link,hdr)) {

                        clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG|

                                             CLUSTER_TODO_UPDATE_STATE);

                    }

                    clusterDelNode(link->node);

                    return 0;

                }



                clusterRenameNode(link->node, hdr->sender);

                link->node->flags &= ~CLUSTER_NODE_HANDSHAKE;

                link->node->flags |= flags&(CLUSTER_NODE_MASTER|CLUSTER_NODE_SLAVE);

                clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG);

            } else if (memcmp(link->node->name,hdr->sender,

                        CLUSTER_NAMELEN) != 0) {

                link->node->flags |= CLUSTER_NODE_NOADDR;

                link->node->ip[0] = '\0';

                link->node->port = 0;

                link->node->pport = 0;

                link->node->cport = 0;

                freeClusterLink(link);

                clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG);

                return 0;

            }

        }

        

        if (sender) {

            int nofailover = flags & CLUSTER_NODE_NOFAILOVER;

            sender->flags &= ~CLUSTER_NODE_NOFAILOVER;

            sender->flags |= nofailover;

        }



        // 6.检查 sender 节点的 ip、port 是否发生变更。如果发生了变更，会调用 nodeUpdateAddressIfNeeded() 函数

        if (sender && type == CLUSTERMSG_TYPE_PING &&

            !nodeInHandshake(sender) &&

            nodeUpdateAddressIfNeeded(sender,link,hdr)) {

            clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG|

                                 CLUSTER_TODO_UPDATE_STATE);

        }



        // 7.检查 sender 节点的主从关系是否发生变化，这部分逻辑在前文“配置主从关系”中已经详细分析过了，这里不再重复

        if (sender) {

            if (!memcmp(hdr->slaveof,CLUSTER_NODE_NULL_NAME,

                sizeof(hdr->slaveof))) {

                clusterSetNodeAsMaster(sender);

            } else {

                /* Node is a slave. */

                clusterNode *master = clusterLookupNode(hdr->slaveof, CLUSTER_NAMELEN);

                if (nodeIsMaster(sender)) {

                    /* Master turned into a slave! Reconfigure the node. */

                    clusterDelNodeSlots(sender);

                    sender->flags &= ~(CLUSTER_NODE_MASTER|

                                       CLUSTER_NODE_MIGRATE_TO);

                    sender->flags |= CLUSTER_NODE_SLAVE;



                    /* Update config and state. */

                    clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG|

                                         CLUSTER_TODO_UPDATE_STATE);

                }



                /* Master node changed for this slave? */

                if (master && sender->slaveof != master) {

                    if (sender->slaveof)

                        clusterNodeRemoveSlave(sender->slaveof,sender);

                    clusterNodeAddSlave(master,sender);

                    sender->slaveof = master;



                    /* Update config. */

                    clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG);

                }

            }

        }



        clusterNode *sender_master = NULL; /* Sender or its master if slave. */

        int dirty_slots = 0; /* Sender claimed slots don't match my view? */



        if (sender) {

            sender_master = nodeIsMaster(sender) ? sender : sender->slaveof;

            if (sender_master) {

                dirty_slots = memcmp(sender_master->slots,

                        hdr->myslots,sizeof(hdr->myslots)) != 0;

            }

        }



        // 8.检查 sender 管理的 slot 集合是否发生变化。这部分逻辑在前文“slot 的分配与同步”中已经详细分析过了，这里不再重复。

        if (sender && nodeIsMaster(sender) && dirty_slots)

            clusterUpdateSlotsConfigWith(sender,senderConfigEpoch,hdr->myslots);



        if (sender && dirty_slots) {

            int j;

            for (j = 0; j < CLUSTER_SLOTS; j++) {

                if (bitmapTestBit(hdr->myslots,j)) {

                    if (server.cluster->slots[j] == sender ||

                        server.cluster->slots[j] == NULL) continue;

                    if (server.cluster->slots[j]->configEpoch >

                        senderConfigEpoch)

                    {

                        serverLog(LL_VERBOSE,

                            "Node %.40s has old slots configuration, sending "

                            "an UPDATE message about %.40s",

                                sender->name, server.cluster->slots[j]->name);

                        clusterSendUpdate(sender->link,

                            server.cluster->slots[j]);



                        /* TODO: instead of exiting the loop send every other

                         * UPDATE packet for other nodes that are the new owner

                         * of sender's slots. */

                        break;

                    }

                }

            }

        }

        // 9.处理 configEpoch 冲突。

        if (sender &&

            nodeIsMaster(myself) && nodeIsMaster(sender) &&

            senderConfigEpoch == myself->configEpoch)

        {

            clusterHandleConfigEpochCollision(sender);

        }

        // 10.调用 clusterProcessGossipSection() 函数解析 PING 消息中携带的 clusterMsgDataGossip 数组

        if (sender) {

            clusterProcessGossipSection(hdr,link);

            clusterProcessPingExtensions(hdr,link);

        }

    }
```

1.  根据 PING 消息中携带的对端 Cluster 节点名称，从当前节点的 clusterState->nodes 节点列表中查找对应的 clusterNode 实例，也就是这里调用 getNodeFromLinkAndMsg() 函数返回的 sender 节点。如果对端节点是一个未知节点，则 PING 消息没有什么过多的处理逻辑，内容基本就被忽略了。

2.  接下来，将 sender 节点中的 data_received 字段更新为当前时间，记录最后一次收到对端 Cluster 节点消息的时间。

3.  然后，解析 PING 消息中携带的 currentEpoch 、configEpoch、repl_offset 三个值，并更新到相应字段。以 currentEpoch 值的更新为例，如果 PING 消息携带的 currentEpoch 值比当前节点的 currentEpoch 值大，则更新当前节点 clusterState->currentEpoch 字段。configEpoch、repl_offset 值的更新逻辑类似，这里就不再展开详述。

4.  调用 clusterSendPing() 函数向 sender 节点返回 PONG 消息。

5.  更新 sender 节点的 flags 标记。这里是保留 sender->flags 字段中标记位的同时，新增 PING 消息携带的 flags 标记位。另外，还会设置 NOFAILOVER 标记位，毕竟我们收到了 sender 节点的心跳，也就认为它没有发生故障。

6.  检查 sender 节点的 ip、port 是否发生变更。如果发生了变更，会调用 nodeUpdateAddressIfNeeded() 函数，进行下面的操作：

    - 更新到对应 clusterNode 实例的 ip、port 字段，记录 sender 节点的新网络地址。
    - 释放 clusterLink 连接，等待下次 clusterCron() 时使用新 ip、port 建连。
    - 如果 sender 节点是当前 Cluster 节点的 Master，则更新 redisServer.masterhost 和 masterport 字段记录新地址，然后断开主从复制连接，并调用 connectWithMaster() 函数重新建连。
    - 最后会在 clusterState->todo_before_sleep 字段中设置 SAVE_CONFIG、UPDATE_STATE 标志位，尽快更新集群状态并持久化 nodes.conf 文件。

7.  检查 sender 节点的主从关系是否发生变化，这部分逻辑在前文“配置主从关系”中已经详细分析过了，这里不再重复。

8.  检查 sender 管理的 slot 集合是否发生变化。这部分逻辑在前文“slot 的分配与同步”中已经详细分析过了，这里不再重复。

9.  处理 configEpoch 冲突。检查 configEpoch 值是否发生冲突有下面两个先决条件。

    -   sender 节点以及当前节点都是 Master 类型节点，因为 Slave 节点不进行任何 configEpoch 冲突检查，Slave 节点的 configEpoch 值只需要与其 Master 保持一致即可。
    -   当前节点的 name 比 sender 节点的 name 小，这是为了防止循环比较，导致 configEpoch 一直增长。

    如果出现了 configEpoch 冲突，当前节点会自增其 currentEpoch 值进入下一个纪元，并使用该 currentEpoch 值作为其自身的 configEpoch 值。

10. 调用 clusterProcessGossipSection() 函数解析 PING 消息中携带的 clusterMsgDataGossip 数组。

## 解析 clusterMsgDataGossip

通过前文介绍我们知道，无论是 MEET、PING 还是 PONG 消息，它们的 data 字段部分携带的都是一个 clusterMsgDataGossip 数组，其中包含的数据是发送该消息 Cluster 节点从自身 clusterState->nodes 列表中，筛选出的 1/10 已知节点的信息，以及它视角下的全部疑似故障节点的信息。

在 Redis Cluster 节点处理这三类消息的时候，都会**调用 clusterProcessGossipSection() 函数遍历消息中携带的 clusterMsgDataGossip 数组，尝试从 clusterState->nodes 节点列表中查找每个 clusterMsgDataGossip 元素对应的 clusterNode 实例**，然后进行下面的处理。

-   如果查找不到 clusterMsgDataGossip 对应的 clusterNode 实例，表示感知到一个全新的未知节点。当前 Cluster 节点会创建一个新的 clusterNode 实例，并添加到 clusterState->nodes 列表中，表示感知到了这个 Cluster 节点。在后续定时执行 clusterCron() 函数的时候，会尝试与该新节点进行建连、握手等操作。


-   如果找到了 clusterNaode 实例，表示该节点是一个已知节点，会根据 clusterMsgDataGossip 更新该 clusterNode 的相关信息。

    -   首先是检查该节点是否发生故障，这是根据 clusterMsgDataGossip 携带的 flags 字段是否包含 FAIL、PFAIL 状态进行判断的。如果发生故障，会将发送消息的 sender 节点添加到该故障节点对应的 clusterNode->fail_reports 列表中，具体含义是，当前节点感知到 sender 节点认为该节点故障了。在当前 Cluster 节点感知到半数以上节点认为该节点宕机时，就会将该节点从 PFAIL 状态切换成 FAIL，并立刻向所有节点广播 FAIL 消息，快速让其他节点感知到该节点的宕机。
    
        如果 clusterMsgDataGossip 消息携带的 flags 字段告诉我们这个节点没有发生故障，会将发送消息的 sender 节点，从该节点的 clusterNode->fail_reports 列表中删除。

    -   接下来，是尝试延后该节点对应的 pong_received 值。如果没有其他节点认为该节点出现宕机（即其对应的 fail_reports 列表为空），且该节点已经及时响应了当前节点的全部 PING 消息，说明这是一个正常的节点，不同频繁地发送探活消息了，这里会尝试延后该节点的 pong_received 字段值，进而延迟下次向该节点发送 PING 消息的时间。
    -   最后是更新节点的 ip、port 信息。如果当前 Cluster 节点认为该节点发生了故障，而 sender 节点认为其未发生故障，并且该节点在 sender 节点和当前节点的感知中 ip、port  不同，那可能是当前节点感知到的 ip、port 已经过期了，当前节点会更新 ip、port，并在之后的定时任务中重新连接该节点。

这里简单说一下 FAIL 消息，它也是由 clusterMsg 结构体表示，其中 data 字段中包含了一个 clusterMsgDataFail 实例，其中只记录了发生故障节点的名称。在 Cluster 节点收到 FAIL 消息之后，在故障节点的 flags 字段中设置 FAIL 标记位。

## 总结

本节重点介绍了 Redis Cluster 启动之后，节点之间主从分配以及 slot 分配的流程。

首先，我们重点讲解在 Redis Cluster 各个节点握手建连成功之后，设置主从关系的 `CLUSTER REPLICATE` 命令以及分配 slot 的`CLUSTER ADDSlOTS` 命令的基本使用和核心原理。然后，深入介绍了定期 PING 命令消息的处理和使用。最后，分析了消息中 clusterMsgDataGossip 数组内容的解析逻辑。