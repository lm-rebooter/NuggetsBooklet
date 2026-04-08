在上一节中，我们阐述了常见的 Redis 分布式存储方案，了解了 Redis Cluster 的基本概念以及核心结构体的定义。在上一节最后，我们还分析了一个 Redis Cluster 节点启动时的关键流程，其中展开介绍了 nodes.conf 配置文件的加载和格式。

这一节，我们继续分析 Redis Cluster 初始化的另一个核心逻辑 —— **握手流程**。

## CLUSTER MEET 命令

使用过 Redis Cluster 的小伙伴都知道，我们可以通过 CLUSTER NODES 命令查询节点能感知到的整个Cluster 的信息，该命令的返回与前文介绍的 nodes.conf 文件中的格式类似。

在 Redis Cluster 节点第一次启动的时候，它只能感知到自身的存在，我们可以手动执行 CLUSTER MEET 命令让当前节点感知到指定目标节点：

```
 CLUSTER MEET <ip> <port> [<cport>]
```

当 Redis 收到 CLUSTER MEET 命令之后，会调用 clusterStartHandshake() 函数创建目标节点对应的 clusterNode 实例并添加到 clusterState->nodes 字典中。这里注意新建 clusterNode 的两个字段。

-   一个是 name 字段，因为此时还不知道对端节点的真实名称，所以这里会随机生成一个长度为 40 的字符串暂时作为其 name，也是其在 clusterState->nodes 字典中的 Key。
-   另一个是 flags 字段，初始值为 HANDSHAKE|MEET（省略 CLUSTER_NODE_ 前缀），HANDSHAKE 表示当前节点后续会向目标节点发送 PING 请求完成握手，MEET 表示后续会向目标节点发送 MEET 请求加入集群。另外，加入 cluster->nodes 之前还会先遍历该字典，保证没有节点出现地址重复。

下面我们来看 A、B 两个 Redis Cluster 节点握手的示例，下图展示了节点 A 处理完 CLUSTER MEET 命令之后的状态：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b7ee272f6d2433a9e0900fbe97cdf63~tplv-k3u1fbpfcp-watermark.image?)

## 建立连接

在 clusterStartHandshake() 中，我们并没有看到当前 Cluster 节点与 CLUSTER MEET 命令指定节点的建连操作，那它们之间的网络连接是什么时机建立的呢？

与前文介绍的 Sentinel 类似，Redis Cluster 会在 serverCron() 函数中调用 clusterCron() 函数完成一些 Cluster 相关的定时任务，例如，这里建连操作以及后续的握手操作。通过下面调用 **clusterCron() 函数**的代码片段我们能看出，clusterCron() 要 100 毫秒才能执行一次，默认配置下，一秒执行 10 次。

```c
int serverCron(struct aeEventLoop *eventLoop, long long id, void *clientData) {

    ... // 省略其他逻辑

    run_with_period(100) {

        if (server.cluster_enabled) clusterCron();

    }

    ... 

}
```

在 clusterCron() 函数中会遍历 redisServer.cluster->nodes 这个字典，检查当前节点与其他 Cluster 节点的连接状态。针对单个 clusterNode 的处理逻辑，位于 clusterNodeCronHandleReconnect() 函数之中，其中先会根据各个 clusterNode 实例的 flags 标记信息，过滤掉下面的几类不需要建连的节点。

-   **当前节点自身**，也就是 flags 包含 MYSELF 标记。
-   **未知地址的节点**，也就是 flags 包含 NOADDR 标记。
-   **握手超时的节点**，也就是 flags 包含 HANDSHAKE 标记，但长时间未握手成功的节点，这里判定“长时间未握手成功”的标准是 clusterNode 实例创建时间（也就是它的 ctime 字段值）距当前时间已超过 1 秒。

针对通过上述过滤的 clusterNode 实例，clusterNodeCronHandleReconnect() 会为其初始化 link 字段，也就是创建一个 clusterLink 实例以及底层的 connection 实例，然后调用 connConnect() 函数建立与目标 Cluster 节点的网络连接（连接的是对端节点的 cport 端口）。

这里创建 clusterLink 实例的时候，其 node 字段会指向代表对端 Cluster 节点的 clusterNode 实例，因为当前节点是清晰地知道这个连接与哪个 Cluster 节点进行连接的，属于`主动发起`连接时创建的 clusterLink 实例。

小伙伴们可以回顾一下上一讲中提到的 clusterAcceptHandler() 函数，它监听其他节点发来的建连请求时，也会创建 clusterLink 实例，这个场景属于被动接收，它是不清楚对端节点信息的，所以其 node 字段为 NULL。通过后面分析我们也可以确认，**Redis Cluster 节点之间通信，实际上使用了两个连接，一个主动连接（outing conneciton），一个被动连接（incoming conneciton）** 。

下图展示了节点 A 向节点 B 发起建连成功之后的状态：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b66dab0b24e74d9bb36fbeeb764cdd75~tplv-k3u1fbpfcp-watermark.image?)

## 发送 MEET 消息

建连成功的回调是 clusterLinkConnectHandler() 函数，在这个回调函数中，会完成下面几件事情。

-   首先是给新建的连接注册可读事件的监听，相应的回调函数是 clusterReadHandler() 函数。
-   然后，调用 clusterSendPing() 函数，向对端 Cluster 节点发送 MEET 消息。
-   最后，将 MEET 标记位从对端 Cluster 节点相应的 clusterNode->flags 字段中清理掉。

这里我们需要展开介绍一下 clusterSendPing() 函数，该函数也是向指定的对端节点发送 MEET、PING 或者 PONG 三种消息的核心逻辑所在，下面简单介绍一下这三种消息的含义。

-   **MEET 消息**：当 Cluster 节点接收到客户端发送的 CLUSTER MEET 命令时，会在下一个 serverCron() 周期中向目标节点发送 MEET 消息，邀请目标节点加入集群。
-   **PING 消息**：用来检测对端节点是否在线的探活消息。
-   **PONG 消息**：当 Cluster 节点收到对端节点发来的 MEET 消息或者 PING 消息时，会返回一条 PONG 消息作为响应。

在发送这三种消息的时候，Redis Cluster 节点都会在其中携带当前节点能感知到的节点信息，这也是 Cluster 实现 Gossip 协议的关键所在，后面也会将这些消息统称为 **`Cluster Message`**。

在发送 Cluster Message之前，首先需要确认需要携带哪些节点的信息，主要分为两大部分。

**第一部分**是当前节点能感知到的 1/10 个节点的信息（至少 3 个节点）。也就是从当前节点的 clusterState->nodes 集合中，随机选择 1/10 的节点信息，打包到 Cluster Message 中。在随机选择的过程中，会过滤掉下列 clusterNode 实例。

-   当前节点对应的 clusterNode 实例。在消息的头部已经携带了当前节点的信息，无需重复添加。
-   flags 字段中包含 PFAIL 标记的 clusterNode 实例。在当前节点长时间没有收到一个节点的任何消息时，就会认为其可能出现了故障（只是可能发生故障，并不是一定发生了故障），会在其对应的 clusterNode->flags 字段中设置 PFAIL 标记位。后面我们会单独处理包含 PFAIL 标记的节点。
-   flags 字段包含 HANDSHAKE、NOADDR 或是没有与当前节点建连的 clusterNode，因为当前节点并无法正常感知它们的状态，所以也要过滤掉。
-   numslots 为 0 的 clusterNode 实例，这种 clusterNode 实例对应的 Cluster 节点不负责管理任何 slot，它们的信息没有任何传播的价值。

**第二部分**是 clusterState->nodes 集合中处于 PFAIL 状态的节点。这里会将所有处于 PFAIL 状态的、疑似故障的节点信息，全部添加到此次要发送的 Cluster Message 中。

所以，在 clusterSendPing() 函数中，会看到有两次对 clusterState->nodes 集合的迭代，一次是为了随机选择 1/10 的节点，一次是为了过滤出 PFAIL 状态的节点。

Cluster Message 之所以要携带 1/10 的已知节点信息，是为了能够在节点下线检查时间内（cluster_node_timeout * 2，cluster_node_timeout 对应 cluster-node-timeout 配置，默认 15 秒），收到大部分 Cluster 节点发来的信息。在 Redis Cluster 中，一个节点在 cluster_node_timeout / 2 的时间内，需要向其他 N-1 个节点发送一次 PING 请求，所以在 cluster_node_timeout * 2 时间内，该节点最少会和剩余的每个节点交互了 8 次（收到对端发来的 4 个 PING 请求以及对端返回的 4 个 PONG 响应），每次交互的数据包中，包含下线节点信息的概率为 1/10 的话，那么在 cluster_node_timeout * 2 时间段内感知到某个节点下线的期望值就是 80%，可以大概率收到节点下线的信息。

Cluster Message 之所以要携带 PFAIL 状态的节点信息，是为了将疑似故障的节点快速通知给其他节点，从而进行更快的发起 failover 操作，减少不可用的时间。

一条 Cluster Message 消息分为：**消息基本信息、发送节点信息、集群信息、具体消息以及扩展内容**五部分。在 clusterSendPing() 函数中，先会调用 clusterBuildMessageHdr() 函数创建 clusterMsg 实例并填充其中的消息基本信息、发送节点信息以及集群信息三部分。接下来，clusterSendPing() 函数在两次迭代 clusterState->nodes 字典的时候，会调用 clusterSetGossipEntry() 函数，将筛选出来的节点信息填充成具体消息内容。最后是 Redis 7.0 新增的扩展部分，clusterSendPing() 将当前 Cluster 节点的 hostname 作为扩展内容填充到 clusterMsg 实例中，[这是对应的 PR 链接](https://github.com/redis/redis/pull/9530)。

填充好一个完整的 Cluster Message 消息之后，clusterSendPing() 会根据其实际长度，修正消息基本信息中的消息总长度、节点个数以及扩展内容的条数等信息。Cluster Message 消息的具体格式我们在下一小节展开分析，现在只需要了解 Cluster Message 中有下图展示的五个逻辑部分即可：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ae5ed857132447a926c6680300c0b0a~tplv-k3u1fbpfcp-watermark.image?)

完成 clusterMsg 实例的创建和填充之后，当前节点会调用 clusterSendMessage() 函数将 clusterMsg 添加到发送缓冲区中，也就是对应 clusterLink 连接的 sndbuf 缓冲区中，同时还会开始监听该连接上的可写事件，可写事件的回调为 clusterWriteHandler() 函数。

clusterWriteHandler() 函数的实现比较简单，其中就是调用 clusterLink 底层 connection 的 connWrite() 函数向对端节点发送数据，同时将已成功发送的数据从 sndbuf 缓冲区截掉。

下图展示了节点 A 向节点 B 发送完 MEET 消息之后的状态：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1cb9a6b16e6441ea523f427e771bf93~tplv-k3u1fbpfcp-watermark.image?)

## Cluster Message 消息

了解了筛选节点信息的规则以及 Cluster Message 消息的发送流程之后，我们展开介绍一下 Cluster Message 消息的结构体定义。

首先是 clusterMsg 结构体，其中包含了我们前面说的五个逻辑部分：消息基本信息、发送节点信息、集群信息、具体消息以及扩展部分，我们一个个来介绍。

-   首先来看消息自身的一些基本信息，包括：**消息签名**（sig 字段）、**消息版本**（ver 字段）**、消息长度**（totlen 字段）、**消息类型**（type 字段）、**携带的节点信息条数**（count 字段）。

-   然后来看消息发送节点的相关信息，包括：**发送节点的名称**（sender 字段）、**当前节点的 configEpoch 信息**（configEpoch 字段）、**主从复制的 Replication Offset**（offset 字段）、**节点的 ip、port 以及 cport**、**当前节点的 flags 状态信息**、**当前节点负责的 slot 集合**（myslots 字段）、**当前节点的主节点名称**（slaveof 字段）。
-   接下来看集群相关的信息：**当前的 currentEpoch 值**（currentEpoch 字段）。
-   之后来看具体消息内容：data 字段是一个 clusterMsgData 实例，注意 clusterMsgData 是一个 union，其中可以嵌套 ping、fail、publish、update 等结构体中的一个。这里我们先重点来看 ping 结构体，其中包含了一个 clusterMsgDataGossip 数组，具体定义如下：

```c
union clusterMsgData {

    // PING、MEET、PONG三种消息都是使用ping这个结构体

    struct {

        //clusterMsgDataGossip数组，每个clusterMsgDataGossip就包含一个节点的信息

        clusterMsgDataGossip gossip[1];

    } ping;

    ... // 省略其他结构体的定义

}
```

在 ping.gossip 数组中的每个 clusterMsgDataGossip 元素，都对应了一个节点信息，其中包含了节点的名称、当前节点最后一次向其发送 PING 消息以及收到 PONG 响应的时间戳、节点的 IP、port、cport 信息以及节点的 flags 标识。

-   在 Redis 7.0 的实现中，最后的 hostname 扩展部分实际上是一个 clusterMsgPingExt 实例，但是它也会被写入到 ping.gossip 数组末尾，占一个数组元素的位置。

## 处理 MEET 消息

握手流程发送 MEET 消息的核心内容已经介绍完了，下面继续分析对端节点在接收到 MEET 消息时的操作。

这里需要我们回忆一下本节前面“发送 MEET 消息”部分的内容，当两个 Redis Cluster 节点建连之后，会开始监听连接上的可读事件，对应的回调为 clusterReadHandler() 函数。clusterReadHandler() 函数中没有像 readQueryFromClient() 函数（处理客户端连接可读事件的回调函数）那样向 IO 线程转发的逻辑，所以 clusterReadHandler() 函数的全部逻辑是在主线程中执行的。

clusterReadHandler() 函数最核心的逻辑就是一个 while 循环，它不断读取连接中的数据并暂存到 clusterLink->rcvbuf 缓冲区中。读取过程中会先检查 sig 签名，然后通过检查消息中的 totlen 长度判断是否读取到了一个完整的 clusterMsg 消息，如果能读取到一个完整的 clusterMsg 消息，会将读取到的 clusterMsg 消息交给 clusterProcessPacket() 函数处理，处理完成之后继续下一条消息的读取和处理，直至连接中无数据可读。

下面我们展开分析 **clusterProcessPacket() 函数处理 MEET 消息**的核心流程。

```c
int clusterProcessPacket(clusterLink *link) {

    ... // 省略其他类型消息的处理

    

    if (type == CLUSTERMSG_TYPE_PING || type == CLUSTERMSG_TYPE_PONG ||

        type == CLUSTERMSG_TYPE_MEET) {

        uint16_t count = ntohs(hdr->count); // 计算这种消息类型的预计长度

        explen = sizeof(clusterMsg)-sizeof(union clusterMsgData);

        explen += (sizeof(clusterMsgDataGossip)*count); 

        // 1.根据消息类型（type 字段）检查消息的长度是否合法

        if (hdr->mflags[0] & CLUSTERMSG_FLAG0_EXT_DATA) {

            clusterMsgPingExt *ext = getInitialPingExt(hdr, count);

            while (extensions--) {

                uint16_t extlen = getPingExtLength(ext);

                if (extlen % 8 != 0) {

                    return 1;

                }

                if ((totlen - explen) < extlen) { 

                    return 1;

                }

                explen += extlen;

                ext = getNextPingExt(ext);

            }

        }

    }

    

    if (type == CLUSTERMSG_TYPE_PING || type == CLUSTERMSG_TYPE_MEET) {

        if ((type == CLUSTERMSG_TYPE_MEET || myself->ip[0] == '\0') &&

            server.cluster_announce_ip == NULL) { // 2.更新当前 Cluster 节点自身的 IP 地址

            char ip[NET_IP_STR_LEN];



            if (connSockName(link->conn,ip,sizeof(ip),NULL) != -1 &&

                strcmp(ip,myself->ip))

            {

                memcpy(myself->ip,ip,NET_IP_STR_LEN);

                serverLog(LL_WARNING,"IP address for this node updated to %s",

                    myself->ip);

                clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG);

            }

        }



        // 3.在两个节点第一次握手的时候，当前 Cluster 节点肯定是查找不到

        // 对端 Cluster 节点对应的 clusterNode 实例的

        if (!sender && type == CLUSTERMSG_TYPE_MEET) {

            clusterNode *node;



            node = createClusterNode(NULL,CLUSTER_NODE_HANDSHAKE);

            serverAssert(nodeIp2String(node->ip,link,hdr->myip) == C_OK);

            node->port = ntohs(hdr->port);

            node->pport = ntohs(hdr->pport);

            node->cport = ntohs(hdr->cport);

            clusterAddNode(node);

            clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG);

        }



        // 4.当前节点会调用 clusterProcessGossipSection() 函数解析消息中携带的 clusterMsgDataGossip 数组

        if (!sender && type == CLUSTERMSG_TYPE_MEET)

            clusterProcessGossipSection(hdr,link);



        // 5.调用 clusterSendPing() 函数返回一个 PONG 消息给对端节点

        clusterSendPing(link,CLUSTERMSG_TYPE_PONG);

    }

}
```

1.  首先，根据消息类型（type 字段）检查消息的长度是否合法。该步骤也是后续所有消息处理的第一步，后续将不再重复该步骤。

2.  更新当前 Cluster 节点自身的 IP 地址。在当前 Cluster 节点自己的地址发生变更的时候，我们可以通过新建连接获取本机的最近地址，这个地址就是当前 Cluster 变更后的 IP 地址。
3.  接下来，根据请求中携带的对端节点名称，从 clusterState->nodes 字典中查找对应的 clusterNode 实例（即代码中的 sender 变量）。在两个节点第一次握手的时候，当前 Cluster 节点肯定是查找不到对端 Cluster 节点对应的 clusterNode 实例的。此时，当前节点会为发送 MEET 消息的对端节点创建一个 clusterNode 实例（其 name 字段值是随机生成的，flags 字段中设置了 HANDSHAKE 标志位），并记录到 clusterState->nodes 字典中，如下图所示。
4.  接下来，当前节点会调用 clusterProcessGossipSection() 函数解析消息中携带的 clusterMsgDataGossip 数组。但是，在第一次接收到未知节点（也就是不在 clusterState->nodes 字典中节点）发来的 MEET 消息时，并不会直接信任它的 Gossip 信息，所以此次调用没有进行什么有效操作，clusterProcessGossipSection() 函数的其他逻辑先按下不表。
5.  最后，调用 clusterSendPing() 函数返回一个 PONG 消息给对端节点。PONG 消息的组装和发送逻辑与前文分析 MEET 消息的完全一致，这里不再重复。

下图展示了 B 节点处理完 MEET 消息之后两个节点的状态：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e736b8317324faba1875d5b1ac37ba7~tplv-k3u1fbpfcp-watermark.image?)

## 处理 PONG 消息

我们再回到发送 MEET 消息的这一侧，当前它接收到 PONG 响应的时候，也是通过 clusterProcessPacket() 函数进行处理的，但 PONG 和 MEET 消息类型不同，会进入不同的处理分支。在开始介绍 PONG 消息处理分支之前，先需要明确一点：因为接收 PONG 消息的 clusterLink 连接中的 node 字段指向了表示对端节点的 clusterNode 实例，所以当前节点能够清晰知道发送 PONG 消息的节点身份。

下面来看 clusterProcessPacket() 函数处理 PONG 消息的核心逻辑。根据 PONG 消息中携带的节点名称从 clusterState->nodes 集合中查找节点，依旧是查找不到，如上图所示，PONG 消息携带的是 Name B，而 A 节点记录的是 Random Name B。下图代码所示，接下来会进入 PONG 消息的处理分支。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61e1a513b9d84827b4fbddbfa888f24b~tplv-k3u1fbpfcp-zoom-1.image)

在 PONG 处理分支中，会使用 PONG 携带的节点名称替换随机生成的对端节点名称，同时还会修改对端节点的 flags：一个是删除 HANDSHAKE 标志位，表示握手结束；一个是设置 MASTER 和 SLAVE 标志位，后续流程会判断对端节点是 Master 还是 Slave。相关代码片段如下：

```c
if (type == CLUSTERMSG_TYPE_PING || type == CLUSTERMSG_TYPE_PONG ||

        type == CLUSTERMSG_TYPE_MEET) { // PONG消息的处理分支

    if (!link->inbound) {

        if (link->node) {

            if (nodeInHandshake(link->node)) { //包含HANDSHAKE标志位，处于握手状态

                if (sender) {...} // 此时sender为NULL，不会走该分支

                // 握手状态下，会用PONG携带的name替换当前节点为对端节点随机生成的name

                clusterRenameNode(link->node, hdr->sender);

                // 删除HANDSHAKE，表示握手结束

                link->node->flags &= ~CLUSTER_NODE_HANDSHAKE;

                // 设置MASTER和SLAVE标志位

                link->node->flags |= 

                        flags&(CLUSTER_NODE_MASTER|CLUSTER_NODE_SLAVE);

                // 设置CLUSTER_TODO_SAVE_CONFIG标志位

                clusterDoBeforeSleep(CLUSTER_TODO_SAVE_CONFIG);

            }

        }

    }

    ... // 省略其他逻辑

}
```

完成 Cluster 节点名称更新以及相关状态更新之后，PONG 消息的处理分支会将对端 Cluster 节点对应的 pong_received 字段更新为当前时间戳，同时还会将 ping_sent 字段更新为 0 ，为下次发送 PING 请求做准备。

下图展示了节点 A 处理完节点 B 返回的 PONG 消息之后的状态：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/362a31b6e5664ecda2ef0085ac716223~tplv-k3u1fbpfcp-watermark.image?)

## 发送 PING 消息

继续上面的示例，在节点 A 处理完节点 B 返回的 PONG 消息之后，就已经可以正确感知到节点 B 了，并且明确知晓自己与节点 B 之间网络连接。接下来，A 节点就可以通过该连接定时向节点 B 发送 PING 命令进行探活了。但是，此时的节点 B 缺失了节点 A 的很多信息，例如：

-   不知道节点 A 的 name 值是什么。因为处理 MEET 消息时创建的 clusterNode 实例中，name 是随机生成的，并不是节点 A 真正的 name。
-   不知道自身与节点 A 的连接是哪个。因为被动创建的 clusterLink 实例中的 node 为 NULL。

节点 A、B 之间的连接状态如下图所示，只存在 A 到 B 的主动连接，不存在 B 到 A 的主动连接：


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5182d7aa05854809adaa54e85c418bcf~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

在节点 B 的下一次执行 clusterCron() 函数迭代自身 clusterState->nodes 字典的时候，就会发现节点 A 对应的 clusterNode 实例（其 name 此时还是 Random Node A）中，link 字段为 NULL。此时，会触发前文介绍的建连操作，创建节点 B 到节点 A 的主动连接。

通过前文的分析可知，节点 A 的 flags 中只设置了 HANDSHAKE 标志位，未设置 MEET 标记位，所以这里建连完成之后，只会调用 clusterSendPing() 函数发送的一条 PING 消息。节点 A 收到 PING 消息之后会返回一条 PONG 消息，节点 B 在收到 PONG 消息之后，会更新节点 A 的 name，清除 HANDSHAKE 标志位，并更新 ping_sent 和 pong_received 时间戳。

下图展示了节点 B 主动与节点 A 建连的全流程：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7a957fde6994a2ca55d38e1b89f7770~tplv-k3u1fbpfcp-watermark.image?)

到此为止，A、B 两个 Redis Cluster 节点之间的握手流程才算完整结束了。

## 总结

在本节中，我们重点介绍了 Redis Cluster 节点在启动之后，与集群中其他 Redis Cluster 节点握手的核心流程。

首先，我们介绍了 CLUSTER MEET 命令的使用，它可以让一个 Redis Cluster 节点主动感知到其他节点。接下来，我们深入到 Redis 的实现中，以 CLUSTER MEET 命令执行流程为切入点，按照节点之间的建连过程、发送以及处理 MEET 消息、发送 PONG 响应以及发送 PING 消息的流程分析了两个 Redis Cluster 握手的全过程。