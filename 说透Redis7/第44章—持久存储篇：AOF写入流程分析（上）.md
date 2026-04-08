前文我们已经详细介绍了 Redis 中 RDB 持久化的相关内容，本节我们开始介绍一下 Redis 中另一种持久化方式 —— `AOF 持久化`。

通过前面章节的介绍我们知道，RDB 是一个类似于快照的持久化方式，它会一次性将 Redis 内存中的全部数据写入到 RDB 文件中。AOF（Append Only File）持久化则是类似于增量的持久化，其核心思路是**将 Redis 执行过的每条修改命令都保存到 AOF 文件中，从而实现持久化效果**。当故障恢复的时候，Redis 可以根据 AOF 文件回放曾经执行过的每一条命令，这样的话，Redis 中的数据也就恢复到故障前的状态了。

在实际生产环境中，一般会使用 `AOF + RDB` 的混合持久化方案来达到最高效的持久化效果，这个方案是 RDB 定时全量持久化，这样在故障恢复时就可以将 Redis 恢复到 RDB 创建时的状态，然后回放 RDB 创建时间点到故障时间点之间的 AOF 日志，将 Redis 从 RDB 文件快照下的状态恢复到故障时间点的状态。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8938070ac1a341c9bcd1c64cbb4cf380~tplv-k3u1fbpfcp-watermark.image?)

这样做主要从两个方面考虑。

第一方面是：RDB 持久化这种全量持久化方式，是个比较耗时的操作，不可能每次修改都触发一次，只适合定时触发，例如，前文介绍的 redisServer.saveparams 中记录的触发条件满足的时候，才会触发。如果单纯使用 RDB 文件进行故障恢复，这就可能会导致 RDB 文件生成时间点，到故障点之间的数据丢失，所以需要 AOF 这种增量持久化方式进行辅助。AOF 是每条命令都会持久化到文件中，在发生故障时可以做到不丢命令或者只丢几条数据，具体会丢失多少数据，就需要通过 Redis 的配置参数，控制刷盘的频率，做到数据持久化和性能的平衡，这个我们后面详细介绍。

第二方面的考虑是：如果只使用 AOF 日志进行回放，故障恢复的效率比较低，尤其是在修改操作比较密集的场景中，恢复等量数据的时候，通过回放 AOF 来恢复数据可能需要几条或者十几条命令，使用 RDB 文件恢复，只需要一条命令即可，可见加载 AOF 文件的效率远远低于直接加载 RDB 文件。所以只依赖 AOF 进行故障恢复是不合适的。

因此，我们实际应用的时候，会**结合 RDB 和 AOF 两者的优势，使用 RDB 这种加载快的优势恢复 Redis 中的大量数据，然后回放一小段时间范围内的 AOF 日志，恢复 RDB 文件创建到故障点之间的数据**。这样，也就恢复了 Redis 中的全量数据。

## AOF 写入缓冲区

理解了 AOF 的基本概念和应用场景之后，我们开始介绍 AOF 实现基本原理。

首先 Redis 是否开启 AOF 功能由 redis.conf 配置文件中的 appendonly 配置项控制的，对应到 Redis 源码中，就是 redisServer.aof_enabled 字段，默认是关闭的。

当开启 AOF 写入功能之后，执行的每一条修改命令都会同时写入到 AOF 缓冲区中，这个 AOF 缓冲区就是 redisServer.aof_buf 字段（sds 类型）。在 serverCron() 函数中，会定时将 AOF 缓冲区中的数据写入到 AOF 文件中，AOF 文件对应的文件描述符记录在 redisServer.aof_fd 字段中。这就是 AOF 持久化的`几个最关键的点`。

下面我们就展开看看这`两个关键的步骤`：一个是命令是如何写入到 AOF 缓冲区的，一个是命令如何从 AOF 缓冲区写入到 AOF 文件中的。

### dirty 标记

这里我们先来看修改数据的命令在执行之后，是如何写入到 AOF 缓冲区的。通过前面的介绍我们知道，所有的 Redis 命令都是在 **call() 函数**中执行的，在 call() 函数中有下面这么一段代码，它会通过命令对 redisServer.dirty 字段影响，判断一条命令是否修改了数据，因为每条修改命令，都会增加 dirty 的值。

```c
void call(client *c, int flags) {

    long long dirty;

    monotime call_timer;

    int client_old_flags = c->flags;

    // 清空三个标志位，这三个标志位可能在命令执行过程中被设置

    c->flags &= ~(CLIENT_FORCE_AOF | CLIENT_FORCE_REPL | CLIENT_PREVENT_PROP);

    dirty = server.dirty; // 暂存当前dirty字段的值，如果是修改命令，会对这值进行加一

    c->cmd->proc(c); // 执行命令

    dirty = server.dirty - dirty;



    if (flags & CMD_CALL_PROPAGATE && // 是否需要命令写入AOF文件或是传播到从节点中

        (c->flags & CLIENT_PREVENT_PROP) != CLIENT_PREVENT_PROP

        c->cmd->proc != execCommand &&

        !(c->cmd->flags & CMD_MODULE)) {

        // 初始化propagate_flags，它用来记录当前这条命令，是不是要写入AOF文件或者发到从节点

        int propagate_flags = PROPAGATE_NONE; 

        if (dirty) // 检查当前执行的命令是否为修改命令

            // 如果是修改命令，propagate_flags里面就要加下面两个标志

            propagate_flags |= (PROPAGATE_AOF | PROPAGATE_REPL);



        ... // 根据client->flags设置propagate_flags中的标志位

        

        if (propagate_flags != PROPAGATE_NONE)

            // alsoPropagate()函数是将命令写入到临时缓冲区中

            alsoPropagate(c->db->id,c->argv,c->argc,propagate_flags);

    }

    ... // 省略其他逻辑

    afterCommand(c);   // 真正触发命令传播的地方

}
```

从上面的代码中我们看到，**在执行命令的具体逻辑（也就是 c->cmd->proc() 这个调用）之前，会先记录当前的 server.dirty 值，并清空 client->flags 中与 AOF 写入相关的标志位**。

在命令的执行过程中，不同的命令会根据自身的性质，修改 dirty 字段的值，例如，我们常见的 SET、MSET、LPUSH 等，会修改 Redis 键值对的命令，都会增加 dirty 字段的值。下图的调用栈，就展示了 List 和 Hash 两个结构中，修改 dirty 字段的命令，其他数据结构的命令，这里就不再一一展示了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ace2c1c15c349be85a4101a39631b8b~tplv-k3u1fbpfcp-zoom-1.image)

### 命令重写

另外，还有少量修改命令会设置 client->flags 中的标志位，例如，SPOP 这个命令除了增加 server.dirty 值，还可能会设置 CLIENT_PREVENT_PROP 标志位来停止 call() 函数中调用 propagate() 触发 AOF 的写入。

稍微展开一下，为什么 SPOP 命令要这么做呢？这里牵扯到**命令重写**的概念，在使用 AOF 文件进行数据恢复的时候，如果碰到一条 SPOP 命令，我们是不知道它弹出的元素要返回给谁的，所以 Redis 会将这种有返回值的修改命令，重写成作用相同的、无返回值的命令，比如，SPOP 命令可以重写成 SREM 命令。你可以看看 SPOP 命令的一个实现分支 spopWithCountCommand() 函数，其中会将调用 alsoPropagate() 函数自行完成 AOF 的写入，其中写入的命令是 SREM，而非 SPOP 命令，这就是实现了更新 AOF 写入命令的特性。

### 写入缓冲区核心流程

了解了 client->flags 中与 AOF 相关的标志位之后，我们再来关注一下 call() 函数的第二个参数 `call_flags`，其中可以设置如下标志位，**这些标志位可以控制 call() 函数的执行流程**。

-   CMD_CALL_SLOWLOG：call() 函数会对命令执行时长进行采样，同时检测执行时长是否超过 slowlog-log-slower-than 配置值，如果超过就会被当作慢日志记入到 redisServer.slowlog 队列中，后续我们可以通过 SLOWLOG GET 命令获取其中的慢日志。
-   CMD_CALL_STATS：call() 函数会更新命令的调用次数和总耗时两个统计信息，对应 redisCommand 中的 calls 和 microseconds 字段。
-   CMD_CALL_PROPAGATE_AOF：call() 函数会将修改数据的命令写入到 AOF 文件中。
-   CMD_CALL_PROPAGATE_REPL：call() 函数会将修改数据的命令发送给从节点。
-   CMD_CALL_PROPAGATE：PROPAGATE_AOF 和 PROPAGATE_REPL 的组合。
-   CMD_CALL_FULL：上述所有标志位的组合。在前文介绍的主线程执行命令的 call() 调用时，传递的就是该值。

说完了 client->flags 以及 call_flags 参数中与 AOF 相关的标志位，我们回顾一下上面介绍的这段 call() 函数代码，会发现它会根据这两个标志位字段，共同来决定当前命令是否需要写入 AOF 文件或者发送到从节点。如果需要，就会调用 alsoPropagate() 函数。


**alsoPropagate() 函数**会将命令本身以及相关参数拷贝一份出来，然后把拷贝出来的命令，写入到 redisServer.also_propagate 字段维护的一个 redisOp 数组中。下面是 redisOp 结构体的详细说明：

```c
typedef struct redisOp {

    robj **argv; // 记录了命令以及命令参数

    // argc是命令+参数的个数；dbid是这条命令应用到了哪个redisDb上；

    // target就是上文中传入alsoPropagate()函数的propagate_flags参数，

    // 用于说明这条命令需要写入AOF还是需要发送到从库，或者两个操作都要做

    int argc, dbid, target;

} redisOp;
```

另外， redisServer.also_propagate 字段实际是 redisOpArray 类型，如下所示，其中除了维护一个 redisOp 数组（初始长度是 16，之后按照 *2 的方式进行扩容），还维护了 redisOp 数组中元素个数和当前最大容量。

```c
typedef struct redisOpArray {

    redisOp *ops;

    int numops;

    int capacity;

} redisOpArray;
```

接下来看 **afterCommand() 函数**，它的核心逻辑是将 redisOp 数组中的命令，写入到 AOF 缓冲区或者是写入到主从复制的缓冲区，或者是同时写入这里两个缓冲区，写入两个缓冲区的操作并不互斥。这两个写入逻辑位于其底层依赖的 propagateNow() 函数中，如下图调用栈所示，propagateNow() 里面有两个分支，一个分支是 feedAppendOnlyFile() 函数，用来写入 AOF 日志缓冲区；另一个分支是 replicationFeedSlaves() 函数，用来写入主从复制缓冲区。这两个函数的实现我们后面展开说，我们先来看看 afterCommand() 函数和 propagatePendingCommands() 函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce78b00aec6d44c8a68b434afb665c16~tplv-k3u1fbpfcp-zoom-1.image)

这两个函数主要是对 Redis 事务进行了一些特殊处理。在开始看 afterCommand() 函数的实现之前，需要先带你一起回顾一下 Redis 事务的 AOF 日志，是怎么写入到 redisOp 数组中的：在 EXEC 命令执行之前，所有的命令是缓存到 client->mstate.commands 数组中的，只有在 EXEC 命令执行的时候，才会真正依次调用 call() 函数执行这些命令，这里也就是嵌套 call() 的调用。下图中展示了一个有两个 SET 命令的事务，其中粉色区域就是 execCommand() 执行两个 SET 命令的地方，也就是嵌套调用 call() 函数的地方。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dd3fc7e61864db1a97a7689c9db20de~tplv-k3u1fbpfcp-watermark.image?)

afterCommand() 函数会对嵌套 call() 函数的调用进行过滤，也就是说，在上图红色区域内调用的两次 afterCommand()，都不会触发 AOF 缓冲区的写入。afterCommand() 函数的具体实现如下：

```c
void afterCommand(client *c) {

    if (!server.in_nested_call) { // 不是嵌套调用

        if (server.core_propagates) // 由主线程触发，而不是其他Module触发

            propagatePendingCommands();

        trackingHandlePendingKeyInvalidations();

    }

}
```

紧接上面的示例，在事务中的两个 SET 命令写入的 redisOp，会在 `EXEC 命令`触发的 afterCommand() 函数中统一处理，在其中的 propagatePendingCommands() 函数，如果发现当前 redisOp 数组中有多条命令，就知道当前这些命令要在一个事务中执行，需要会先向 AOF 缓冲区写入一个 `MULTI 命令`（MUTLI 和 EXEC 命令没有修改任何数据，不会影响 dirty 字段，所以客户端发送的 MULTI 命令就不会进入 redisOp 数组），然后再把 redisOp 数组中的命令写入到 AOF 缓冲区，最后写入一条 EXEC 命令。

```c
void propagatePendingCommands() {

    if (server.also_propagate.numops == 0)

        return;

    int j;

    redisOp *rop;

    int multi_emitted = 0;



    // 发现redisOP数组中不止一条命令，就会用事务进行包裹，这里写入一条MULTI命令

    if (server.also_propagate.numops > 1 && !server.propagate_no_multi) {

        int multi_dbid = server.also_propagate.ops[0].dbid;

        propagateNow(multi_dbid,&shared.multi,1,PROPAGATE_AOF|PROPAGATE_REPL);

        multi_emitted = 1;

    }

    // 循环写入redisOp数组中的命令

    for (j = 0; j < server.also_propagate.numops; j++) {

        rop = &server.also_propagate.ops[j];

        serverAssert(rop->target);

        propagateNow(rop->dbid,rop->argv,rop->argc,rop->target);

    }

    if (multi_emitted) { // 最后补充一条EXEC命令，提交事务

        int exec_dbid = server.also_propagate.ops[server.also_propagate.numops-1].dbid;

        propagateNow(exec_dbid,&shared.exec,1,PROPAGATE_AOF|PROPAGATE_REPL);

    }

    redisOpArrayFree(&server.also_propagate); // 释放redisOp数组

}
```

最后，我们来看 propagateNow() 函数中写入 AOF 日志缓冲区的分支 —— feedAppendOnlyFile() 函数。另一个分支是调用 replicationFeedSlaves() 函数，把命令发送到从节点，会在后面的主从复制的章节展开介绍。下面这张流程图，展示了 feedAppendOnlyFile() 函数的核心逻辑：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27c6d972d98044f988d30d972da4bc85~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，feedAppendOnlyFile() 函数首先会检查 aof-timestamp-enabled 这个配置，如果开启了这个配置，在命令写入到 AOF 日志之前，需要添加一个时间戳。注意，这里不是每条命令都加时间戳，而是每秒加一次时间戳，在 redisServer 的 aof_cur_timestamp 字段中维护了一个 AOF 的时钟（秒级时钟），只有 AOF 时钟与当前 Redis 的秒级时钟，也就是 redisServer.unixtime 不一致了，才会生成一次时间戳。`这个 AOF 添加时间戳的功能是在 Redis 7 添加的`，小伙伴们可以[参考这个 PR](https://github.com/redis/redis/pull/9326)，利用这个时间戳，我们可以做很多事情，比如按照时间截断 AOF 日志，或者回放指定时间点之后的 AOF 日志。

我们回到 feedAppendOnlyFile() 函数继续分析，接下来它会检查当前命令应用的 redisDb 是否发生了切换，其实就是检查 redisServer.aof_selected_db 字段，如果发生 redisDb 的切换，需要先生成一条相应的 SELECT 命令。

在最后，feedAppendOnlyFile() 会执行 catAppendOnlyGenericCommand() 函数，将命令进行编码，然后写入到 redisServer.aof_buf 这个 AOF 缓冲区中。这里看一下 catAppendOnlyGenericCommand() 函数是如何进行 AOF 编码的，下面是在 Redis 中第一次执行 `SET key value` 这条命令的时候，产生的 AOF 日志：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ddbb3d0ac314f0583a0846f610a6be8~tplv-k3u1fbpfcp-watermark.image?)

第一行是`时间戳`，“#TS:” 四个字符开头，后面跟的是一个秒级时间戳，最后是 “\r\n” 换行符。

接下来是一条 `SELECT 0 命令`，第一个字符固定为 “*” 字符，后面跟的是命令参数个数（包括命令名称本身），示例中包括 SELECT、0 两部分，所以这里是 2，最后是 “\r\n” 换行符。

再下面四行，记录了 SELECT 这条命令本身：首先是 “$” 这个特殊，后面跟的是 “SELECT” 字符串的长度，也就是示例中的 6，最后是 “\r\n” 换行符；下一行记录了 “SELECT” 字符串本身；后面两行用来表示 “SELECT 0” 命令中 “0” 这个参数。

接下来，看 `SET Key Value 这条命令`，其实它的格式与前面的 “SELECT 0” 命令类似：第一行的“*3\r\n” 表示这条命令里面有三个参数（包含命令名称本身），然后`“$3\r\nSET\r\n”` 这两行，分别表示了 SET 字符串的长度以及 SET 字符串本身。`“$3\r\nKey\r\n”` 两行表示的是 Key 这个参数，`“$5\r\nValue\r\n”`两行表示的是 Value 这个参数，这几行的编码方式与前面的一样，这里就不再展开重复了。

## 总结

在这一节中，我们首先介绍了 AOF 持久化的基本概念以及适用场景，然后分析了修改数据的 Redis 命令，是如何一步步编码成 AOF 日志，写入到 AOF 缓存区中的。这里讲解了 dirty 标记、命令重写等内容，也详细介绍了写入 AOF 缓冲区的核心实现。

下一节中，我们将继续介绍 AOF 持久化中，AOF 日志从缓冲区写入磁盘的核心实现。