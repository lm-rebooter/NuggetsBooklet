
在前面的文章中，我们已经完整介绍了 Redis Cluster 启动流程，以及完整的 failover 流程，对应的核心实现和关键函数也进行了说明和介绍。这一节，我们再来讨论一下 Redis Cluster 在 Slave 漂移以及数据迁移方面的功能。

## Slave 节点漂移

在 clusterCron() 这个周期性任务中，除了前面介绍的定时发送 PING 消息、触发 failover 操作之外，还会检查 Master 的单点问题。所谓“单点 Master 问题”意思就是：一个 Master 节点下没有任何可用的 Slave 节点存在，如果此时 Master 节点发生了故障，整个 Redis Cluster 将进入不可用的状态。

为了解决这个问题，Redis Cluster 提供了 Slave 节点漂移的功能，redis.conf 配置文件中的 cluster-allow-replica-migration 配置项为该功能的开关。Slave 节点漂移的核心原理是：当 Redis Cluster 发现单点 Master 的时候，会从其他拥有多个可用 Slave 的 Master 节点那里，借用一个 Slave 节点，从而解决单点 Master 的问题。

如下图左侧所示，Master1 节点处于单点状态，通过将 Slave2 节点漂移成 Master1 节点的 Slave，解除了其单点状态。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80bba45a89564c9f8eb0a7da6f52215d~tplv-k3u1fbpfcp-watermark.image?)

每个 Slave 节点在定期执行 clusterCron() 函数的时候，都会对每个 Master 节点的 clusterNode->slaves 列表进行检查，计算其可用的 Slave 节点数量。如果发现 Master 节点下没有可用的 Slave 节点，且当前 Master 负责管理多个 slot，则会将其判定为单点 Master。在计算单点 Master 的同时，还会计算 max_slaves、this_slaves 两个辅助变量，max_slaves 记录了当前可用 Slave 节点数的最大值，this_slaves 记录了当前这个主从复制组中的可用 Slave 节点数。

如果当前 Slave 在上述检查中发现了单点 Master，且当前 Slave 节点所在的主从复制组中可用的 Slave 节点数最多，则当前节点可以调用 clusterHandleSlaveMigration() 函数发起 Slave 节点漂移。首先检查整个 Redis Cluster 的状态，在 Redis Cluster 状态正常的情况下，才会进行后续的漂移操作。在 redis.conf 配置文件中，有个 cluster-migration-barrier 配置项，它指定了每个 Master 至少要有多少个可用的 Slave 节点才算安全。这里会检查当前主从复制组中可用的 Slave 节点数量是否超过了cluster-migration-barrier 配置项指定的阈值（默认值为 1），如果没有超过该阈值，则无法继续外迁 Slave 节点。

下面简单描述一下 Slave 漂移的核心流程。

1.  首先，确定要进行漂移的候选者。这里会迭代 clusterState->nodes 列表来查找有单点问题的 Master，然后从有最多 Slave 节点的主从复制组中，查找 name 最小的 Slave 节点作为漂移的候选者。

2.  假设当前 Slave 节点就是 Slave 漂移的候选节点，此时，如果存在单点 Master 节点，并且其单点状态持续了 5 秒以上，就可以调用 clusterSetMaster() 函数，将当前 Slave 节点切换成单点 Master 的 Slave 节点，从而解除该 Master 的单点问题。clusterSetMaster() 函数会将当前 Slave 节点从原 Master 节点的 slaves 列表迁移到新 Master 的 slaves 列表中，然后执行 replicationSetMaster() 函数与新 Master 节点建立连接，开始一次全量的主从复制。

## slot 迁移

在 Redis Cluster 上线运行一段时间之后，可能无法继续支持业务的流程增长，这个时候，就需要对 Redis Cluster 进行`扩容`，向 Redis Cluster 中新增一批节点，使整个 Redis Cluster 集群能够存储更大的数据量，支持更高的 QPS。在添加完新节点之后，我们需要将原有 Master 节点中负责管理的一部分 slot ，迁移到新增加的 Master 节点。

除了扩容的场景，Redis Cluster `缩容`的场景也是可能出现的，比如下线一部分 Master 节点，此时我们就需要将下线 Master 节点负责的 slot 迁移到其他 Master 节点中。

无论是上述哪种场景，都会涉及到 slot 以及其中数据的迁移，此时就需要使用到 `CLUSTER SETSLOT` 命令。这里我们举个例子，假设需要将编号为 100 的 slot 从节点 A 迁移到节点 B，需要依次执行下面的步骤：

1.  在节点 B 中执行 `CLUSTER SETSLOT 100 IMPORTING A-name` 命令。
1.  在节点 A 中执行 `CLUSTER SETSLOT 100 MIGRATING B-name` 命令。
1.  之后，在节点 A 上执行 `CLUSTER GETKEYSINSLOT 100 {count}` 命令，从 slot 100 中获取 count 个 Key，并执行 ` MIGRATE B-host B-port "" 0 1000 KEYS key [key ...]  `将上述获取到的 Key 从节点 A 迁移到节点 B（DB 的编号由参数 0 指定，1000 则是超时时长，单位为毫秒），循环该过程，直至 slot 100 中的全部 Key 都迁移到节点 A 中。
1.  slot 100 中全部的 Key 都迁移完成之后，需要依次在节点 B 和节点 A 上都执行 `CLUSTER SETSLOT 100 NODE B-name` 命令，明确 slot 100 已经不再由 A 节点负责管理，而是由 B 节点负责管理。之后，slot 100 的变更将会随着 PING 等消息传播到整个 Redis Cluster。


### IMPORTING、MIGRATING 状态

了解了 slot 迁移的基本操作之后，下面我们展开介绍一下这些命令底层分别执行了哪些逻辑。

首先是 `CLUSTER SETSLOT 100 IMPORTING A-name` 命令，这条命令会修改节点 B 的视图，将 slot 100 设置为 IMPORT 状态，其实就是将节点 B 的 `clusterState->importing_slots_from[100]` 指向节点 A。

然后，是 `CLUSTER SETSLOT 100 MIGRATING B-name` 命令，它是在节点 A 上执行的，它会修改节点 A 的视图，将 slot 100 设置为 MIGRATING 状态，其实就是将 `clusterState->migrating_slots_to[100]` 指向节点 B。

之所以执行设置这两个状态，是为了处理后续 slot 迁移过程中收到的客户端请求。如果我们迁移过程中，一个客户端来请求 slot 100 中的 Key1，当 GET Key1 命令发给节点 A 时，如下图调用栈所示，节点 A 在命令执行之前，会调用 getNodeByQuery() 节点检查 slot 100 的状态：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d213785a6da42369dd2d8b69237e8e0~tplv-k3u1fbpfcp-zoom-1.image)

该函数会发现 slot 100 处于 MIGRATING 状态，如果访问的目标 Key 1 还在节点 A 中，则继续后续的访问操作。如果访问的目标 Key 1 已经被迁移到了节点 B 中，则返回 ASK 错误以及节点 B 对应的 clusterNode 实例，最终返回给客户端的是 ASK 错误以及节点 B 的 ip 和端口，客户端在收到 ASK 错误之后，会去节点 B 访问目标 Key1。

接下来，客户端会先向节点 B 发送 ASKING 命令，该命令会在对应的 client 上添加 CLIENT_ASKING 标记。然后，客户端才会发送原来访问 Key1 的命令。节点 B 在执行 getNodeByQuery() 函数时会发现 slot 100 处于 IMPORTING 状态，正常执行后续访问逻辑。

有的同学可能会问，为什么客户端在访问节点 B 的时候，需要先发送 ASKING 命令呢？直接发送原始的访问命令不可以吗？我们可以从 getNodeByQuery() 函数的下面这段代码找到答案：

```c
clusterNode *getNodeByQuery(...) {

    clusterNode *n = NULL;

    ... // 省略其他代码

    for (i = 0; i < ms->count; i++) {

        ... // 省略其他代码

        for (j = 0; j < numkeys; j++) { // 解析一条命令中的Key

            robj *thiskey = margv[keyindex[j]];

            // 计算第一个Key所在的槽位，我们假设就是Key1

            int thisslot = keyHashSlot((char*)thiskey->ptr, 

                    sdslen(thiskey->ptr));

            if (firstkey == NULL) {

                slot = thisslot;

                n = server.cluster->slots[slot]; // 当前负责slot 100的是节点A

                if (n == myself &&

                    server.cluster->migrating_slots_to[slot] != NULL)

                {

                    migrating_slot = 1;

                }else if (server.cluster->importing_slots_from[slot]!= NULL) {

                    // slot 100在节点B的视角中，处于IMPORTING状态

                    importing_slot = 1; 

                }

            } 

            ... // 省略其他逻辑

        }

    }

    ... // 省略其他逻辑

    // 只有设置了ASKING标识才能走进下面的分支

    if (importing_slot && 

            (c->flags & CLIENT_ASKING || cmd->flags & CMD_ASKING)) {

        if (multiple_keys && missing_keys) { 

            if (error_code) *error_code = CLUSTER_REDIR_UNSTABLE;

            return NULL;

        } else { 

            // 节点B发现slot 100正在迁入，且client带了ASKING标识，

            // 这里返回一个有效的clusterNode实例，继续执行后续访问目标Key1的逻辑

            return myself;

        }

    }

    // 如果没有设置ASKING标识，会走到下面这行代码，返回给客户端MOVED错误。

    if (n != myself && error_code) *error_code = CLUSTER_REDIR_MOVED;

}
```


很明显，**如果客户端不提前发送一条 ASKING 命令来设置 ASKING 状态，那么无论 Key 1 是否已经迁移到了节点 B，节点 B 都将返回给客户端一个 MOVED 错误**。

这里简单区分一下 MOVED 和 ASKING 两个错误。

-   MOVED 表示的是 slot 已经从一个节点转移到了另一个节点。在 Jedis、redis-cli 等客户端中，都会缓存一份 slot 与 Redis Cluster 节点的映射关系，当收到 MOVED 错误时，会修改该缓存，之后访问该 slot 的请求会直接发送到 MOVED 错误所指定的目标节点。

    以 redis-cli 为例，如果我们要让它实现自动处理 ASK 和 MOVED 的功能，需要在启动 redis-cli 客户端的时候，添加 -c 参数如下所示：

```c
./redis-cli -h 127.0.0.1 -p 6381

127.0.0.1:6381> GET key1

# 自动处理MOVED和ASK命令

-> Redirected to slot [9189] located at 127.0.0.1:6382 

"value"
```

-   ASKING 表示的是 slot 迁移过程中产生的中间态。在客户端收到 ASKING 错误时，不会修改缓存，所以只是影响 ASKING 响应的这条请求，不会后续影响其他的请求。如果客户端之后还需要访问该 slot，则仍然会按照缓存将请求发送到目前负责该 slot 的节点，可能还会触发 ASKING 错误。

    这从另一个角度说明，client 的 ASKING 状态是一个一次性标状态，当节点执行完一条非 ASKING 命令之后，ASKING 状态就会被清除，我们可以在 resetClient() 函数中看到下面这段清理 ASKING 状态的逻辑：

```c
if (!(c->flags & CLIENT_MULTI) && prevcmd != askingCommand)

    c->flags &= ~CLIENT_ASKING;
```

通过下图展示的调用栈可以看出，resetClient() 函数是在命令执行完成之后被立即调用的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf693d32c17349deb9a846aba0c029f3~tplv-k3u1fbpfcp-zoom-1.image)


### 迁移 Key

分析完 `CLUSTER SETSLOT 100 IMPORTING A-name`、 ` CLUSTER SETSLOT 100 MIGRATING B-name  `两条命令的底层原理以及对数据访问带来的影响之后，我们再来分析 `CLUSTER GETKEYSINSLOT 100 {count}` 命令和 `MIGRATE B-host B-port "" 0 1000 KEYS key [key ...]` 迁移 Key 的实现逻辑。

首先，当节点接收到 `CLUSTER GETKEYSINSLOT` 命令时，会先去 redisDb->slots_to_keys 中查找指定 slot 中 Key 的个数，然后从相应的 by_slot 列表中获取指定数量的 Key，最后将这些 Key 返回给客户端。[《Cluster 篇：Redis Cluster 节点启动内幕》](https://juejin.cn/book/7144917657089736743/section/7147530637849657384)在介绍 Redis Cluster 关键结构体的时候，已经详细介绍过 clusterSlotToKeyMapping 以及 slotToKeys 的结构，这里不再重复了。

客户端拿到 CLUSTER GETKEYSINSLOT 返回的一批 Key 之后，就可以通过 MIGRATE 命令进行迁移了。MIGRATE 命令本身有非常多参数，当节点 A 接收到 MIGRATE 命令的时候，会先对其参数进行校验，例如，会检查命令中指定的 Key 是否还存在于当前 DB 中，至少存在一个 Key 才会执行后续的迁移操作。完成 MIGRATE 命令参数的校验之后，当前节点会根据命令参数中指定的 ip、port，与迁移的节点 B 建立连接，建连的关键逻辑就是调用 migrateGetSocket() 函数创建了一个 migrateCachedSocket 实例，migrateCachedSocket 底层封装了一个 conneciton 实例来抽象两个 Redis 节点之间的连接， 创建好的 migrateCachedSocket 实例会缓存到 redisServer.migrate_cached_sockets 字典中，Key 是目标节点的 ip 和 port，也就是示例中的节点 B 的地址，之后可以按照 ip 和 port 复用 migrateCachedSocket 实例，从而避免重复建连。

建连完成之后，节点 A 就可以开始组装迁移 Key 的相关命令。

1.  首先创建一个基于 Buffer 的 rio 实例，后续需要发送到节点 B 的命令会先组装到该 Buffer 中。

2.  向 Buffer 中写入 SELECT 命令，将迁移 Key 写入到节点 B 的指定 DB 中。
3.  接下来循环待迁移的 Key，为每个 Key 生成一条 RESTORE-ASKING 命令（集群模式下使用 RESTORE-ASKING 命令，单机模式下使用 RESTORE 命令）。这里先会检查 Key 的过期时间，如果已经过期，直接跳过该 Key。然后才会真正向 Buffer 中写入的是 RESTORE-ASKING 命令，该命令的具体格式是 RESTORE-ASKING key ttl serialized-value，其中的序列化的 Value 值是通过 createDumpPayload() 函数按照 RDB 文件的格式，将 Value 值写入到 Buffer 中的。

迁移相关的命令全部写入到 Buffer 之后，节点 A 就可以调用 connSyncWrite() 函数将 Buffer 中的命令发送到节点 B ，注意，这里使用的同步方式进行发送，超时时间是 MIGRATE 命令中指定的，默认是 1000 毫秒。

在节点 B 收到 RESTORE-ASKING 命令之后，会反序列化 Key、Value 值以及过期时间，然后将 KV 数据写入到指定 DB 中，并设置相应过期时间。如果节点 B 有冲突的 Key，则根据 RESTORE-ASKING 命令的相关参数确定是覆盖原有 Key 还是报错。RESTORE-ASKING 命令相应的处理函数为 restoreCommand() 函数，感兴趣的小伙伴可以参考源码进行分析。

回到节点 A 这边，在发送完 Buffer 中的命令之后，它就会调用 connSyncReadLine() 函数阻塞等待节点 B 对每条 RESTORE-ASKING 命令的响应，对于迁移成功的 Key，节点 A 会将该 Key 从自身的 DB 中删除；对于迁移失败的 Key，节点 A 会将节点 B 返回的错误信息透传给客户端。


### 更新 slot 归属

完成 Key 迁移之后，我们就可以依次在节点 B 和节点 A 上执行 ` CLUSTER SETSLOT 100 NODE B-name  `命令，变更 slot 100 的归属权了。

节点 B 接到 `CLUSTER SETSLOT 100 NODE B-name`命令的时候，会执行下面的 slot 迁移逻辑。

1.  修改自身维护的 slot 视图，将 slot 100 与节点 A 解绑，并将 slot 100 修改为节点 B 负责管理。
1.  将 slot 100 的 IMPORTING 状态清理掉，也就是将 clusterState->importing_slots_from[100] 设置为 NULL。
1.  因为有 slot 的变更，所以 currentEpoch 和 configEpoch 值都需要增加。这里会将 currentEpoch 的值增加 1，并将其作为自身的最新 configEpoch 值。
1.  然后向其他节点广播 PONG 消息，其他节点也就可以更新到最新的 currentEpoch 和 configEpoch 值，同时也会变更 slot 100 的归属关系。

之后节点 B 收到访问 slot 100 的请求时，就可以直接进行响应了。

在节点 A 接到 `CLUSTER SETSLOT 100 NODE B-name` 命令的时候，会执行下面的操作。

1.  如果节点 A 还没有收到来自 PONG 消息时，会发现当前 slot 100 是由节点 A 自己负责管理的，而命令指定的却是节点 B，此时就需要检查在节点 A 中是否还持有 slot 100 中的 Key，如果没有，才能正常执行下面的 slot 迁移操作。
1.  将 slot 100 的 MIGRATING 状态清除掉，也就是将 clusterState->migrating_slots_to[100] 设置为 NULL。
1.  修改节点 A 中维护的 slot 视图，将 slot 100 与节点 A 解绑，将 slot 100 修改为由节点 B 负责管理。

节点 A 之后收到访问 slot 100 的请求时，就会立刻返回 MOVED 响应，让客户端去访问节点 B，这也是在节点 A 上执行 CLUSTER SETSLOT 命令的主要作用。

## 使用 Redis Cluster 的注意事项

`数据倾斜问题`可能是我们在使用 Redis Cluster 时遇到最头疼的问题了。在 Redis Cluster 环境搭建以及 Key 设计的过程中，我们应该尽可能地保证键值对数量以及 Key 的访问量，均匀地散落在不同的 slot 中，同时尽可能保证 slot 均匀地散落在 Redis Cluster 的多个 Master 上，这样就可以避免出现数据量或是访问量的倾斜。

出现数据量倾斜的问题可能是**出现了某些大 Key**，例如，我们的业务中出现了一部分特别大的 Hash 表，而且这些 Hash 表对应的 Key 都落到了一个 slot 中，这就会导致某个 Redis Cluster 节点内存使用率很高，其他节点的内存使用率很低。而且对大 Key 访问一般耗时会比正常 Key 要长，这也会造成 Redis Cluster 中的某些节点耗时长，影响整个 Redis Cluster 的性能表现。

我们可以通过 redis-cli 命令行工具的 --bigkeys 参数来查询 Redis 中的大 Key，但是要根本解决大 Key 的问题，还是需要在进行 Key 设计的时候对可能的数据模型和数据量进行评估，对可能遇到的大 Key 进行拆分。

另一个导致数据量倾斜的问题就是 **Key 或是 HashTag 的设计不当造成的**，这里我们先来展开介绍一下计算一个 Key 所属 slot 的 keyHashSlot() 函数，其中使用的核心算法是 crc16 算法，默认整个 Key 都会参与到 slot 的计算中，如下图所示第一组 Key 值所示，它们会散落在不同的 slot 中。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/456d8a60a5264bf7b4c6ff8ae5ff2f51~tplv-k3u1fbpfcp-watermark.image?)

但是如果 Key 中有被大括号包裹起来的部分，如上所示的第二组的 Key 值所示，则只有大括号之内的部分会参与 slot 的计算，这就是所谓的 HashTag，上图第二组 Key 会落到同一个 slot 中。

大量 Key 中的 HashTag 计算出相同的 slot 值，也会导致数据倾斜。一个比较好的方式就是在上线之前预估 Key 分布，然后模拟计算一下 slot 的分布情况。

如果已经出现 slot 数据不均匀的情况，例如，出现了多个非常大 slot ，我们可以手动调整 slot 的分布，将这几个大 slot 归属到不同的 Redis Cluster 节点上，避免大 slot 集中到一起，压垮单个节点。当然，这仅仅是一种补救措施，我们还是应该尽可能让 Key 分布到 slot 中，让 slot 均匀分布到各个节点上。

再来看`访问量倾斜`的问题，其实就是热点 Key 的问题，本质上也是 Key 设计的问题，最根本的解决方案就是**重新设计一套合理的 Key**。

当然，我们还有一些改动较小的方案，例如，默认情况下 Redis Cluster 的 Slave 节点只作为冷备，不处理读请求，在一些读请求量倾斜或是读压力较大的场景中，我们可以开启读写分离的功能，具体方式是：客户端连接到 Slave 节点之后先发送一条 READONLY 命令，该命令会在对应的 client->flags 中添加一个 READONLY 标记，在 Slave 节点该 client 后续收到命令时，就不会再返回 MOVED 命令让客户端去请求 Master 节点了。前面介绍的 getNodeByQuery() 函数中会检查 READONLY 标记，相关代码片段如下：

```c
clusterNode *getNodeByQuery(...) {

    ...//省略前面逻辑，其中会查找读取目标Key所在的slot，以及目标slot由哪个Master节点负责

    int is_write_command = ...; // 判断当前请求是否是写操作

    if (((c->flags & CLIENT_READONLY) || is_pubsubshard) && // client包含READONLY标识，is_pubsubshard后面会单独说

        !is_write_command && // 不是写命令

        nodeIsSlave(myself) && // 当前节点是一个Slave节点

        myself->slaveof == n)  // 当前Slave节点的Master节点负责管理读取的slot

    {

        return myself; // 满足上述全部条件，才能读取当前Slave节点的数据

    }

    // 否则，返回MOVED错误，让客户端去请求相应的节点

    if (n != myself && error_code) *error_code = CLUSTER_REDIR_MOVED;

    return n;

}
```

很明显，如果发生了目标 slot 已经迁走或是目标 slot 不归该主从复制组管理，Slave 节点依旧会给客户端返回一个 MOVED 错误。

另外，Redis Cluster 对 Key 批量操作以及事务等都有一定限制，例如，MSET、MGET 等命令操作的多个 Key 必须要归属于同一个 slot 值的。如下面这个示例，key1 和 key2 归属于不同的 slot ，就会返回异常：

```c
127.0.0.1:6379> MSET key1 v1 key2 v2

(error) CROSSSLOT Keys in request don't hash to the same slot
```

## 总结

本节重点介绍了 Redis Cluster 中，Slave 节点漂移和 slot 迁移这两个话题。`Slave 节点漂移`主要是为防止 Redis Cluster 出现单点 Master 节点，`slot 迁移`主要是为了均衡数据在 Redis Cluster 各个节点的分布。最后，我们还分享了几个 Redis Cluster 实战中的常见问题以及解决思路。

Redis Cluster 的核心内容，到这里就全部介绍完了。在下一模块中，我们将深入讲解`如何利用 Redis 支持生产者消费者`的需求场景。