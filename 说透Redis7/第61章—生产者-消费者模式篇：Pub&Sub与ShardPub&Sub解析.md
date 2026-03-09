
Redis 作为一个基于内存的 NoSQL 数据库，在实践中最常作为**缓存**或是**存储**使用。除此之外，我们还可以将 Redis 作为一个**消息通道**，实现生产者发送数据、消息者消费数据的效果，这就有点类似于 Kafka、RabbitMQ 等消息中间件的功能。前面介绍的 `List 结构`，就可以用来实现简易版本的生产者消费者模式，优缺点在前面[第 7 篇《实战应用篇：List 命令详解与实战（下）》](https://juejin.cn/book/7144917657089736743/section/7147527327713329186)中也有描述，小伙伴有遗忘的话，可以进行简单的回顾。

本节要介绍的 **Pub/Sub，是一种发布订阅机制，也可以用来实现生产者消费者模式**。当然 Redis 的 Pub/Sub 功能比较弱，远远没有那些成熟的消息中间件的功能完善，但是在实际应用中还是有很多应用场景的。

首先，我们先从整体上了解一下 Pub/Sub 的功能，如下图所示，Redis 中可以创建多个 Channel，一个 Channel 可以有多个 Client 订阅，当其他 Client 向 Channel 中发送消息的时候，订阅了该 Channel 的 Client 就能收到消息。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e38e8c98ac404d10854dd40eb1af4b57~tplv-k3u1fbpfcp-watermark.image?)

## Pub/Sub命令核心实现

了解了 Pub/Sub 的基本功能之后，我们来看 Pub/Sub 的核心实现。

Redis 在 redisServer 结构体中维护了一个 `pubsub_channels 字典`，其中的 Key 是一个字符串，表示的是 Channel 的名称，Value 是一个 adlist 实例，是订阅了该 Channel 的 Client 列表，整体结构如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daf4debf088b4e07a8e079ba60a5f6b7~tplv-k3u1fbpfcp-watermark.image?)

除此之外，Client 中也维护了一个 pubsub_channels 字典，用来记录当前 Client 实例订阅了哪些 Channel，其中 Key 也是 Channel 的名称，Value 则是 NULL。

当 Redis 收到客户端 SUBSCRIBE 命令的时候（可以一次性指定多个 Channel 名称），会循环调用 pubsubSubscribeChannel() 函数处理命令参数中携带的每个 Channel，pubsubSubscribeChannel() 函数的核心逻辑如下。

1.  首先，记录发送 SUBSCRIBE 命令的 client 到 Channel 的映射关系。也就是将 Channel 名称作为 Key，添加到该 client 实例的 pubsub_channels 字典中，Value 为 NULL。
1.  然后，记录 Channel 到 client 映射关系。这里先从 redisServer->pubsub_channels 字典中查找订阅了该 Channel 的 client 列表，然后将当前 client 添加到该 client 列表的尾部。
1.  最后，在当前 client->flags 字段中添加 CLIENT_PUBSUB 标记，并返回当前 client 订阅的 Channel 和模式（pattern）的总数。

**CLIENT_PUBSUB 标记表示该客户端进入了 Pub/Sub 模式，那么该客户端不能再发送其他命令了，只能被动接收 Redis 服务 push 过来的数据了**。我们在 processCommand() 函数中可以看到检查 CLIENT_PUBSUB 标记的代码逻辑：

```c
int processCommand(client *c) {

    ... // 省略其他逻辑

    // 检查CLIENT_PUBSUB状态，以及客户端与Redis服务交互的RESP协议版本

    if ((c->flags & CLIENT_PUBSUB && c->resp == 2) &&  

        // 如果是CLIENT_PUBSUB状态客户端且使用RESP2协议，只能执行下面几种命令

        c->cmd->proc != pingCommand && 

        c->cmd->proc != subscribeCommand &&

        c->cmd->proc != unsubscribeCommand &&

        c->cmd->proc != psubscribeCommand &&

        c->cmd->proc != punsubscribeCommand &&

        c->cmd->proc != resetCommand) {

        rejectCommandFormat(c, "...", c->cmd->name); // 拒绝其他命令的执行

        return C_OK;

    }

    ... // 省略其他逻辑

}
```

客户端通过执行 SUBSCRIBE 命令，能够订阅明确指定的一个或多个 Channel。客户端还可以通过 PSUBSCRIBE 命令订阅一个或多个模式（pattern），这里的模式（pattern）可以认为是一个包含通配符，可以匹配多个 Channel。例如，`PSUBSCRIBE test.*` 这条命令就会订阅全部以 “test.” 开头的 Channel。注意，Redis 使用的模式（pattern）匹配并不是正则表达式，而是 Glob-Style 模式，感兴趣的同学可以了解一下 Glob-Style 模式的相关内容，其中的通配符使用比较简单，这里不展开说明了。

PSUBSCRIBE 命令的核心实现与 SUBSCRIBE 命令有些类似，在 client 和 redisServer 两个结构体中各自维护了一个 pubsub_patterns 的字段，分别用于记录 client 到其订阅的模式（pattern）之间的映射关系以及反向关系。PSUBSCRIBE 命令的核心执行逻辑与 SUBSCRIBE 命令也比较类似，如下所示：

1.  首先，记录 client 到模式（pattern）的映射关系。也就是在模式（pattern）字符串不存在的时候，将其记录到 client-> pubsub_patterns 这个 adlist 列表的尾部。
1.  然后，记录模式（pattern）到 client 的映射关系。这里先从 redisServer->pubsub_patterns 字典中查找订阅了指定模式（pattern）的 client 列表，然后将当前 client 添加到该 client 列表尾部。
1.  最后，在当前 client->flags 字段中添加 CLIENT_PUBSUB 标记，并返回当前 client 订阅的 Channel 和模式（pattern）的总数。

## PUBLISH 命令核心实现

介绍完订阅端的核心实现之后，我们再来看 PUBLISH 命令是如何发送一条消息的，处理 PUBLISH 命令的核心实现位于 pubsubPublishMessageInternal() 函数中。这里注意它的第三个参数 type，它是一个 pubsubtype 类型的实例，之所以会有这个参数，是因为`在 Redis 7.0 中， 新添加了 Shard Pub/Sub 特性来更好``地``实现 Redis Cluster 下的 Pub/Sub 功能`。这里我们先来关注普通的 Pub/Sub 实现，Shard Pub/Sub 特性我们后面单独介绍。

下面正式来看 pubsubPublishMessageInternal() 函数的核心逻辑，如下所示。

1.  首先，Redis 根据 PUBLISH 命令指定的 Channel 名称，从 redisServer->pubsub_channels 字典中查找订阅了该 Channel 的 client 列表。然后遍历该 client 列表，针对每个 client 调用 addReplyPubsubMessage() 函数，将 PUBLISH 命令指定的消息内容 push 到相应客户端。addReplyPubsubMessage() 函数中会根据当前客户端使用的 RESP 协议版本，生成对应格式的 push 消息内容。

2.  之后，处理 Channel 与某些 pattern 匹配的情况。这里会迭代整个 redisServer->pubsub_patterns 字典，用其中的每个 Key（也就是前面添加的 pattern）去匹配 PUBLISH 命令指定的 Channel 名称。如果匹配成功，则遍历该 pattern 对应的 client 列表，将 PUBLISH 命令指定的消息内容 push 给这些 client。

上面这段逻辑是在 Redis 单机模式下执行 PUBLISH 命令的核心，接下来我们来看一下 publishCommand() 函数，其中还能看到针对 Sentinel、主从复制的特殊处理逻辑，如下所示：

```c
   void publishCommand(client *c) {

    if (server.sentinel_mode) { // 当前Redis实例是Sentinel，这里用于模拟收到一条Hello消息，而不是发送消息

        sentinelPublishCommand(c);

        return;

    }

    

    // 向普通Redis实例或者是Redis Cluster发送罅消息，都走pubsubPublishMessageAndPropagateToCluster()函数

    int receivers = pubsubPublishMessageAndPropagateToCluster(c->argv[1],c->argv[2],0);

    if (!server.cluster_enabled) // 未开启Redis Cluster模式

        forceCommandPropagation(c,PROPAGATE_REPL);

    addReplyLongLong(c,receivers);

}    

    
```

先来看这里的 forceCommandPropagation() 函数调用，这里会在当前 client->flags 中设置 CLIENT_FORCE_REPL 标识符。在前文介绍的 Redis 主从复制的时候提到，call() 函数在执行完成一条命令之后，会根据 propagate_flags 决定是否将命令写入到 AOF 以及 Slave 节点中，其中就会检查 client->flags 中的 CLIENT_FORCE_REPL 标识位来决定是否将命令传播到 Slave 节点，相应的代码片段如下：

```c
void call(client *c, int flags)

    ... // 省略清理c->flags的代码

    // 执行命令。这里会调用publishCommand()函数，会在c->flags中设置CLIENT_FORCE_REPL

    c->cmd->proc(c); 

    

    if (flags & CMD_CALL_PROPAGATE && // 是否需要尝试将命令写入AOF或是传播到Slave中

        (c->flags & CLIENT_PREVENT_PROP) != CLIENT_PREVENT_PROP &&

        c->cmd->proc != execCommand &&

        !(c->cmd->flags & CMD_MODULE))

    {

        int propagate_flags = PROPAGATE_NONE; // 初始化

        // 下面检查当前执行的命令是否为修改命令，显然PUBLISH没有修改任何数据

        if (dirty) propagate_flags |= (PROPAGATE_AOF|PROPAGATE_REPL);



        // 检查c->flags字段中的CLIENT_FORCE_REPL标识，这正好是PUBLISH命令中设置的

        if (c->flags & CLIENT_FORCE_REPL) propagate_flags |= PROPAGATE_REPL;

        if (c->flags & CLIENT_FORCE_AOF) propagate_flags |= PROPAGATE_AOF;

        ... // 省略propagate_flags变量中其他标识位的设置逻辑

        

        // 调用alsoPropagate()函数将命令传播写入到redisOp数组中，等待后续写入AOF或者发送到从库

        if (propagate_flags != PROPAGATE_NONE)

            alsoPropagate(c->db->id,c->argv,c->argc,propagate_flags);

    }

    ... // 省略重置c->flags的逻辑

}
```

通过上面这段代码我们知道，在 Master 节点上执行的 PUBLISH 命令会通过主从复制的方式传播到 Slave 节点中，那我们在 Slave 节点上监听相应的 channel 或是 pattern 也可以收到消息。

## Shard Pub/Sub 解析

### Pub/Sub 在 Redis Cluster 中的问题

在 Redis 7 之前，Redis Cluster 对 Pub/Sub 的支持不是很好，它的模型是这样的：客户端在订阅一个 Channel 的时候，可以在任意一个 Cluster 节点上进行订阅，但是客户端在向一个 Channel 发送消息的时候，看似是只发送到了一个 Cluster 节点，但是 Redis Cluster 会把这条消息传播到每个节点上去，最终送达到订阅的客户端中。这部分功能在 Redis 7 中依旧保留，主要用于处理非 Shard 的 PUBLISH 命令，具体实现在 clusterSendPublish() 函数中。

下面展开说一下 clusterSendPublish() 函数的实现。

在我们执行 PUBLISH 命令向一个 Redis Cluster 发送一条消息的时候，clusterSendPublish() 函数将消息内容封装成一条 PUBLISH 类型的 Cluster Message，并把这个消息广播给全部 Cluster 节点。PUBLISH 类型 Cluster Message 中的 data 部分为 clusterMsgDataPublish 实例，其中记录了 channel 名称的字节数、message 字节数以及一个 bulk_data 字节数组，该字节数组就是用来存储真正的 channel 名称以及 message 数据。

在 Redis Cluster 中其他节点收到 PUBLISH 类型的 Cluster Message 时，会根据上述规则解析出其中的 channel 以及 message 数据，然后直接调用上面介绍的 pubsubPublishMessage() 函数，将 message 数据 push 到在当前节点上订阅对应 channel 的客户端。

该流程可以总结为如下图所示的 1~4 步：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70d60f95219d486089fc49b9101e5e2e~tplv-k3u1fbpfcp-watermark.image?)

这部分解析 PUBLISH 类型的 Cluster Message 的逻辑位于 clusterProcessPacket() 函数中，感兴趣的同学可以参考源码进行分析。

Redis 7 之前的模型存在的最明显问题就是`效率低`，如果我们只有一个客户端订阅指定的 Channel，那发往其他节点的全部 PUBLISH Cluster Message 都是无用的。这种低效的消息传播方式，进一步演化，就会导致整个 Redis Cluster 的吞吐量下降，扩展性降低。这些缺点在 Redis PR 里面也有相关的讨论，感兴趣的小伙伴可以[参考一下这个 PR](https://github.com/redis/redis/issues/2672)，进一步了解讨论的内容。

### Shard Pub/Sub 解决方案

**为了提高 Redis Cluster 模式下 Pub/Sub 的效率，Redis 7 引入 Shard Pub/Sub 的特性**。

Shard Pub/Sub 的核心思想是：**把 Channel 名称看作是一个 Key，归属于一个 slot，而 slot 都会明确归属于一个 Master 节点**。客户端订阅 Shard Channel 的时候，只能在这个 Master 节点（以及它的 Slave 节点）上进行订阅，PUBLISH 消息的时候，只能向这个 Master 节点进行 PUBLISH，这样就可以避免消息的广播，提高了整个 Redis Cluster 可扩展性。在 slot 迁移的时候，Shard Channel 也会随之迁移，这样也就保证了高可用。

为了支持 Shard Pub/Sub 特性，Redis 在 redisServer 中添加了 pubsubshard_channels 字段（dict 指针），其中记录了 Shard Channel 与订阅该 Shard Channel 的 Client 列表的映射关系，对标前面介绍的 redisServer.pubsub_channels 字段；另外，还在 client 中添加了 pubsubshard_channels 字段（ dict 指针），其中记录了当前 Client 订阅了哪些 Shard Channel，对标前面介绍的 pubsub_channels 字段。

为了让普通 Channel 和 Shard Channel 共用一套逻辑，Redis 7 引入了 pubsubType 结构体，其定义如下：

```c
typedef struct pubsubtype {

    int shard;  // shard为1，表示走shard pub/sub逻辑；shard为0，表示走普通pub/sub逻辑

    dict *(*clientPubSubChannels)(client*); // 获取client订阅了哪些Channel，返回的是client中的pubsub_channels或者pubsubshard_channels

    int (*subscriptionCount)(client*); // 获取client订阅Channel的个数

    dict **serverPubSubChannels; // 获取Channel与Client列表的一个关系，返回的是redisServer.pubsub_channels或者pubsubshard_channels

    robj **subscribeMsg; // 订阅命令

    robj **unsubscribeMsg; // 退订命令

}pubsubtype;
```

pubsubType 有两个实现，一个是 pubSubType，对应普通 Pub/Sub 的处理逻辑；一个是 pubSubShardType，对应 Shard Pub/Sub 的处理逻辑。

Shard Pub/Sub 最后一个引入的新结构是 ClusterState 中的 slots_to_channels 字段（Rax 指针），其中存储的 Key 是 slot 和 Channel 名称拼接起来的字符串，Value 是 NULL。slots_to_channels 这个 Rax 树主要是为了按序维护 slot 到 Channel 的映射关系。

说完 Shard Pub/Sub 底层依赖的底层结构之后，我们来看 Shard Pub/Sub 特性的核心逻辑。首先说明一点，Redis 并没有复用 SUBSCRIBE 和 PUBLISH 命令，而是使用 SSUBSCRIBE、SPUBLISH 两条新命令来实现 Shard Pub/Sub 特性。如果我们在 Redis Cluster 模式下执行 SUBSCRIBE 和 PUBLISH 命令，还是走 Redis 7 之前的广播模型来实现 Pub/Sub，而不是 Shard Pub/Sub 的逻辑。

在我们执行 SSUBSCRIBE 命令订阅一个 Shard Channel 的时候，Redis Cluster 节点首先会在前文介绍的 getNodeByQuery() 函数中，检查目标 Shard Channel 所归属的 slot，是否由当前节点负责管理，如果不是的话，就和处理普通 Key 一样，返回 MOVED 响应。

通过 getNodeByQuery() 函数检查之后，我们再来看真正处理 SSUBSCRIBE 命令的 ssubscribeCommand() 函数，它会先调用 slotToChannelAdd() 函数，将 Shard Channel 归属的 slot 与 Shard Channel 名称的映射关系，记录到前面介绍的 ClusterState->slots_to_channels 中。然后再调用前面介绍的 pubsubSubscribeChannel() 函数，记录 Shard Channel 与 Client 之间正反两个方向的关系。注意，这里传入的就是 pubSubShardType 实现，里面记录 Shard Channel 与 Client 正反关系的字段在上面已经详细分析过了，不再重复。

通过 SSUBSCRIBE 完成订阅之后，我们就可以通过 SPUBLISH 命令向 Shard Channel 发送消息了。Redis 在处理 SPUBLISH 命令的时候，首先也是要经过 getNodeByQuery() 函数检查，确定目标 Shard Channel 由当前 Cluster 节点管理。之后，才会执行 spublishCommand() 函数处理 SPUBLISH 命令。spublishCommand() 的实现与 publishCommand() 类似，其调用栈如下所示，它会先调用 pubsubPublishMessageInternal() 函数，向在当前 Cluster 节点上监听目标 Shard Channel 的客户端 push 消息；然后执行的 clusterPropagatePublish() 函数向当前主从复制组的全部节点 push 这条消息，注意，这里不再是广播消息了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d37b2bb3a0034bbcae014d5944af9449~tplv-k3u1fbpfcp-zoom-1.image)

最后，我们用一张图，总结一下 `Shard Pub/Sub 的模型`，如下：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3905add9d452449e93221a50c2df81ed~tplv-k3u1fbpfcp-watermark.image?)

到此为止，Shard Pub/Sub 的核心原理就介绍完了，Shard Pub/Sub 方案的 PR 是 https://github.com/redis/redis/issues/8029#issuecomment-793160824 ，修改的 PR 是 https://github.com/redis/redis/pull/8621 ，感兴趣的小伙伴可以阅读一下这两个 PR 的内容。

## Pub/Sub 的优缺点

使用 Pub/Sub 方式实现生产者消费者模式的优点就是`简单`，绝大多 Redis 客户端都是支持 Pub/Sub 功能的。

相应地，Pub/Sub 也会一些缺点，例如：

-   使用 Pub/Sub 的话，不能对消息进行持久化保存，一旦 Redis 服务重启，发送中的消息全部丢失。
-   强依赖订阅客户端在线，如果订阅客户端下线或是断线重连，在断开连接期间的全部消息都无法收到。从另一个角度看，就是无法读取历史消息，由于没有对消息进行任何存储，对新上线或是断线重连的客户端，是无法消费历史消息的。
-   没有消息确认机制，发布消息侧的客户端只知道 push 给了多少个客户端，具体订阅端有没有消费成功，Redis 本身以及发布消息的客户端都是不清楚的。
-   在 Redis Cluster 场景中，消息会广播给全部的 Cluster 节点，在 Redis Cluster 中流转的消息量与 Redis Cluster 节点个数成正比，如果发布大量的消息，就需要关注整个 Redis Cluster 的性能是否有所下降。Shard Pub/Sub 在一定程度上缓解了这个问题，但是还是存在以上其他缺点。

## 总结

在本节中，我们重点介绍了 Redis 中 Pub/Sub 相关的实现。

-   首先，介绍了 Pub/Sub 核心命令，以及这些命令的核心实现。
-   然后，深入讲解了 Redis 7 引入的 Shard Pub/Sub 新特性及其底层原理。
-   最后，说明了 Pub/Sub 以及 Shard Pub/Sub 的优缺点。