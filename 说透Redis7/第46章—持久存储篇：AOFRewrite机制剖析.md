通过前文的介绍我们知道，Redis 在开启 AOF 持久化功能之后，会将修改命令写入到磁盘上的 AOF 文件。随着 Redis 运行时间越久，就会有越来越多的命令追加 AOF 文件中，AOF 文件的大小也会不断膨胀，如果之后在某个时间点，要使用 AOF 文件进行恢复，就会读取很多无用的命令，导致耗时较长。


下图举了个例子，Redis 依次收到了 `SET Key1 Value1` 、`SET Key1 Value2` 、`SET Key1 Value3` 、`SET Key1 Value4` 这四条命令，相应地，在 AOF 文件中就会记录这 4 条命令，如下图最左边这一栏所示。在这 4 条命令的执行过程中，Redis 中 Key1 对应的 Value 值也在不断发生变化，如果下图红色那一栏所示。如果我们在 `SET Key1 Value4` 这条命令执行完之后，使用这个 AOF 文件进行数据恢复，这里的前三条 SET 命令其实都是无效的，因为执行或不执行这些语句，都不会影响最终的恢复结果。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec08f8670550429b827954cb55b236ea~tplv-k3u1fbpfcp-watermark.image?)


为了解决这一问题，Redis 会定期对 AOF 进行压缩，这一操作被称为 **`AOF Rewrite`，其核心原理是将 AOF 文件中无效的命令删除，只保留有效的命令**。如上图右侧两栏所示，在 AOF Rewrite 之后，AOF 日志中只保留 `SET Key1 Value4` 这一条命令，对应地就是当前 Redis 中 Key1 的最新值。


AOF Rewrite 的核心实现原理就是扫描 Redis 中的全部键值对，将写入这个键值对的操作用一条命令表示出来，然后将这个条命令保存到 AOF 文件中就可以。**Redis 实现 AOF Rewrite 机制通过子进程的方式实现的**，如下图所示，fork() 出来的子进程拥有此时 Redis 的内存快照，然后子进程就可以开始扫描 Redis 中的全部键值对，然后生成 Rewrite 的临时文件。与此同时，主进程开始将 AOF 日志同时写入到 AOF 缓冲区和 Rewrite 缓冲区两个缓冲区中，其中 AOF 缓冲区会正常刷盘，这样即使出现宕机，AOF 日志也不会丢失。在子进程完成 Rewrite 操作之后，主进程会将 Rewrite 缓冲区的数据，写入到临时文件，然后将临时文件进行重命名，替换原来的 AOF 文件，后续新的 AOF 日志就会写入到这个 Rewrite 之后的 AOF 文件中。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/972f66969b404947b28bba18660bbce1~tplv-k3u1fbpfcp-watermark.image?)


上述 AOF Rewrite 操作是 Redis 7.0 之前的逻辑，我们会发现在这个版本的 AOF Rewrite 会带来一些性能问题，如下。

-   需要新开辟一个 AOF Rewrite 缓冲区，用于存放 Rewrite 期间的全部 AOF 日志。在写入密集的场景下，Rewrite 缓冲区会消耗大量的内存。

-   正如前文所示，在 AOF Rewrite 过程中，主进程除了会将修改写命令写入到 AOF 缓冲区之外，还会将同一份日志写入到 Rewrite 缓冲区中。在 Rewrite 过程中，AOF 缓冲区中的日志正常刷盘，在 Rewrite 结束的时候，Rewrite 缓冲区的数据会写入到新 AOF 文件中，这样的话，就是一份日志数据，产生了两次磁盘 IO，很明显，是对磁盘 IO 的浪费。
-   由于 Rewrite 操作结束的时候，把 Rewrite 缓冲区刷到磁盘的这个操作，是在主进程中完成的，如果 Rewrite 缓冲区比较大，就会阻塞命令执行，造成 Redis 耗时上的尖刺，甚至出现客户端请求超时。
-   还有一个代码实现上的问题，那就是 AOF Rewrite 需要主子进程进行复杂的通信，这里使用 6 个管道进行实现，逻辑较难理解。



为了解决上述 AOF Rewrite 带来的问题，`在 Redis 7.0 版本中，引入了 Multi-Part AOF 机制`。Multi-Part AOF 机制是将原来的单个 AOF 文件拆分成多个 AOF 文件，每个 AOF 文件都有不同的类型，不同类型的 AOF 文件有不同的职责。

-   **Base AOF 文件**：它是通过子进程的 Rewrite 操作产生的，这类 AOF 文件最多只有一个。

-   **Incr AOF 文件**：它会在 AOF Rewrite 操作开始的时候创建，用来支持 AOF 文件的增量写入，这类 AOF 文件可能会同时存在多个。
-   **History AOF 文件**：它表示历史版本的 Base AOF 文件和 Incr AOF 文件，在每次 AOF Rewrite 操作完成的时候，之前的 Base AOF 文件和 Incr AOF 文件都将变为 History 类型。之后，Redis 会自动删除 History 类型的 AOF 文件。



为了方便管理这些 Multi-Part AOF 文件，Redis 使用一个独立的 manifest 文件，来单独维护这些 AOF 文件的信息。这个 manifest 文件以及所有的 AOF 文件，都会放到 redis.conf 中 appenddirname 配置项指定的这个统一的目录下。


接下来，我们结合下面这张图，简单介绍一下 Multi-Part AOF 机制的原理。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/370211869e374212b67d8cb61d8e5a58~tplv-k3u1fbpfcp-watermark.image?)


在触发 AOF Rewrite 的时候，Redis 首先会创建一个新的 Incr AOF 文件，在整个 Rewrite 期间，主进程会将所有的 AOF 日志写入到这个新建的 Incr AOF 文件中，老的 Incr AOF 文件不再写入。新建好 Incr AOF 文件之后，主进程会 fork 出一个子进程，由这个子主进程执行 Rewrite 操作。

在子进程进行 Rewrite 的过程中，不会与主进程进行任何的数据交互或者控制交互，`两者完全独立`。子进程 Rewrite 完成之后，会生成一个 Base AOF 文件，这个 Base AOF 文件与新建的 Incr AOF 文件一起，就包含了当前 Redis 中全部的数据。在 AOF Rewrite 操作结束的时候，主进程还需要负责更新一下 manifest 文件，将新生成的 Base AOF 和 Incr AOF 文件的信息记录下来，同时，将之前的 Base AOF 文件以及 Incr AOF 文件，标记为 History，之后，Redis 会异步删除这些 History AOF 文件。


到此为止，整个 AOF Rewrite 操作就完成了。

通过上面的介绍我们知道，整个 Multi-Part AOF 在 Rewrite 的过程中，没有重复写入 AOF 日志，没有使用 AOF Rewrite 缓冲区暂存日志，主子进程之间也没有复杂的交互，比较好地解决了前面提到的 AOF Rewrite 带来的问题。

Multi-Part AOF 功能涉及到 https://github.com/redis/redis/pull/9539 和 https://github.com/redis/redis/pull/9788 两个 PR，感兴趣的小伙伴可以去阅读一下这两个 PR 的内容，可以更清楚 Multi-Part AOF 机制的来龙去脉。


## Rewrite 触发时机

了解了 AOF Rewrite 以及 Multi-Part AOF 优化的核心思想之后，下面我们就可以深入分析一下 AOF Rewrite 的具体实现。

首先，来看`触发 AOF Rewrite 的三个时机`，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a5d7f1b6c664198b0c059c61b0f6cef~tplv-k3u1fbpfcp-zoom-1.image)

1.  手动调用 BGREWRITEAOF 命令，对应上图中 bgrewriteaofCommand() 函数处的调用。
1.  触发了 Redis 配置指定的定时 Rewrite 条件，对应上图中 serverCron() 函数处的调用。
1.  通过 CONFIG SET appendonly yes 命令开启，对应上图中 startAppendOnly() 函数处的调用。

  


下面我们一个个展开看一下这些 AOF Rewrite 调用点的具体逻辑，首先是 bgrewriteaofCommand() 函数，它会检查当前是否有子进程在运行，以及这个子进程的类型是什么，也就是检查 redisServer.child_type 字段的值，具体的核心流程如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85c6ebeb644f4fe698b814002fe3f2d3~tplv-k3u1fbpfcp-watermark.image?)


在 serverCron() 这个周期执行的函数中，有两个条件会触发 AOF Rewrite：一个是它会检查 redisServer. aof_rewrite_scheduled 是否被标记为 1，如果是的话，证明有 AOF Rewrite 的任务在等待执行，当前要是没有子进程在执行，那就可以执行 rewriteAppendOnlyFileBackground() 函数，开始 AOF Rewrite 的操作；另一个触发条件是检查 AOF 文件的大小以及增长率是否超出了限制，如果超出了限制，才会触发 AOF Rewrite 操作。相关代码片段如下所示：

```c
int serverCron(struct aeEventLoop *eventLoop, long long id, void *clientData){
    ... // 省略其他逻辑
    // hasActiveChildProcess()是检查是否有子进程在执行，
     if (!hasActiveChildProcess() && server.aof_rewrite_scheduled) {
        rewriteAppendOnlyFileBackground(); // 触发Rewrite操作
    }
    ... // 省略其他逻辑
    
    // aof_rewrite_perc字段对应auto-aof-rewrite-percentage配置，
    // 用于记录AOF增长比例上限，默认值是100%
    // aof_rewrite_min_size字段对应auto-aof-rewrite-min-size配置，
    // 用于记录当前Base AOF文件和Incr AOF两个文件之和的上限值，默认值是64M
    // 当AOF文件超过了这两个上限值，就会触发Rewrite操作
    if (server.aof_state == AOF_ON && !hasActiveChildProcess() && 
        server.aof_rewrite_perc &&
        server.aof_current_size > server.aof_rewrite_min_size) {
        long long base = server.aof_rewrite_base_size ? 
                server.aof_rewrite_base_size : 1;
        long long growth = (server.aof_current_size * 100 / base) - 100;
        if (growth >= server.aof_rewrite_perc && !aofRewriteLimited()) {
            rewriteAppendOnlyFileBackground(); // 触发Rewrite操作
        }
    }
    ...// 省略其他逻辑
}
```


从上面的代码实现可以看出，在 serverCron() 函数针对 AOF 文件的大小，会周期性地检查两个方面，这两方面条件都成立了，才能触发 AOF Rewrite。

-   **一方面是 AOF 文件增长了多少**。在每次 Rewrite 结束之后，我们都会得到一个 Base AOF 文件和一个 Incr AOF 文件，Redis 会将这两个文件的大小之和，记录到 redisServer.aof_rewrite_base_size 字段中。在 serverCron() 函数中周期性地检查当前 AOF 文件（Base AOF + Incr AOF）的大小，也就是 redisServer. aof_current_size 字段，与 aof_rewrite_base_size 字段之间的增长比例，如果增长超过指定值 auto-aof-rewrite-percentage 配置的百分比（默认值是 100，也就是文件大小翻倍），就有资格触发 AOF Rewrite 操作。

-   **另一方面是 AOF 文件的大小**。auto-aof-rewrite-min-size 配置项（默认值为 64MB）指定了 AOF 文件（Base AOF + Incr AOF）能触发 Rewrite 的最小文件大小。


在 AOF Rewrite 正常完成的时候，我们只会得到一个 Incr AOF，但是如果 AOF Rewrite 失败，我们就会额外得到一个 Incr AOF 文件。为了防止连续的 AOF Rewrite 失败，导致 Incr AOF 文件过多，这里由 aofRewriteLimited() 函数来控制 AOF Rewrite 失败之后的退避时间。在 AOF Rewrite 连续失败三次以内，不会进行退避，但是超过三次之后，就会按照 1、4、8、16、32、60 （单位分钟）这个时间间隔进行延迟，最长延迟上限就是 60 分钟。

最后一个触发 Rewrite 操作的地方，是我们通过 `CONFIG SET appendonly yes` 命令手动将 AOF 功能开启的时候，会触发一次 AOF Rewrite 操作。在 startAppendOnly() 函数中会将 redisServer.aof_state 这个状态字段设置为 AOF_WAIT_REWRITE，之后会和 bgrewriteaofCommand() 函数类似，检查子进程的运行状态和类型，如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dd41d8d93a84758a84ec1baa979dac4~tplv-k3u1fbpfcp-watermark.image?)


## Rewrite 核心实现
说完了 AOF Rewrite 的三个触发时机之后，接下来关注一下 AOF Rewrite 的核心实现。

这里先要看几个关键字段和结构体，第一个是 aofManifest 结构体，它里面记录了当前的 Base AOF 和 Incr AOF 文件，以及 History AOF 文件列表。每个 AOF 文件都被抽象成了 aofInfo 结构体，其中记录了文件的名称、文件序号以及文件类型。

```c
typedef struct {
    sds           file_name; // 文件名称
    long long     file_seq;  // 文件序号
    aof_file_type file_type; // 文件类型，分别用b(Base)、h(History)、i(Incr)三个字符表示
} aofInfo;

typedef struct {
    aofInfo     *base_aof_info; // 当前Base文件
    list        *incr_aof_list; // 当前Incr文件，由于Rewrite操作可能会失败，就会产生多个Incr文件
    list        *history_aof_list;  // History AOF文件列表
    long long   curr_base_file_seq;   // 用于给Base AOF文件生成编号的自增字段
    long long   curr_incr_file_seq;   // 用于给Incr AOF文件生成编号的自增字段
    int         dirty;           // 当前aofManifest实例与磁盘上的manifest文件是否一致
} aofManifest;
```


在 redisServer 结构体中，维护了一个 aof_manifest 字段，它就是 aofManifest 类型，其内容对应磁盘中 manifest 文件的内容，每次更新 manifest 文件内容之前，先要更新这个字段。


### 准备操作

下面我们正式开始分析 AOF Rewrite 的实现，下图展示了 rewriteAppendOnlyFileBackground() 这个入口函数的核心逻辑：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4f0db2705274f72895491d30702681a~tplv-k3u1fbpfcp-watermark.image?)


rewriteAppendOnlyFileBackground() 函数首先会检查一下启动 AOF Rewrite 的条件，比如，AOF 目录是不是正常、是不是已经子进程在跑了。检查通过之后，就可以对当前使用的 Incr AOF 文件进行刷盘了，之后就不会再向这个 Incr AOF 文件中写入数据了。接下来，Redis 会执行 openNewIncrAofForAppend() 函数创建新的 Incr AOF 文件，在这个函数里面还会更新 manifest 文件，它的具体逻辑我们后面单独说。


接下来，rewriteAppendOnlyFileBackground() 会 fork 出一个 AOF 子进程，在子进程中执行 rewriteAppendOnlyFile() 函数，执行真正的 AOF Rewrite 操作，主进程只是更新一下 AOF Rewrite 的启动时间之后，就可以退出 rewriteAppendOnlyFileBackground() 函数，继续去处理客户端的命令了。


这里我们展开说一下 openNewIncrAofForAppend() 函数创建新 Incr AOF 文件的过程，这个函数主要处理两个场景，一个是我们在启动的时候，就已经开启了 AOF 功能，这个场景下，在 Redis 启动的时候，就已经通过 aofOpenIfNeededOnServerStart() 创建了 Base AOF、Incr AOF 以及 manifest 三个文件，它的调用栈如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3350ca9d58cb452e83d6724f58087eec~tplv-k3u1fbpfcp-zoom-1.image)

openNewIncrAofForAppend() 在这种场景下需要做的就是下图展示的 `AOF_ON 分支`，它会新建一个 Incr AOF 文件出来，然后把后续的 AOF 日志写入切换到这个新 Inrc AOF 文件中。另外，它还会把这个新 Incr AOF 文件的名称、编号等信息，更新到内存中的 redisServer.aof_manifest 中，然后写入到磁盘中对应的 manifest 文件中。这里同时会更新 redisServer 结构体中的多个字段，例如，aof_fd 字段指向了当前最新 Incr AOF 的文件描述符；aof_last_incr_size 字段记录的是当前最新 Incr AOF 文件的大小。


注意一下 Incr AOF 文件的名称格式是 `{appendfilename}.{seq}.incr.aof`，其中的 {appendfilename} 部分由 redis.conf 文件中的 appendfilename 配置项指定，默认值就是 apendonly.aof；接下来的 {seq} 部分是编号，由前面介绍的 aofManifest.curr_incr_file_seq 自增得到；最后的 incr.aof 部分是固定的后缀。



openNewIncrAofForAppend() 函数处理的第二个场景是在 Redis Server 启动的时候，没有开启 AOF 功能，之后通过 CONFIG SET appendonly yes 命令开启 AOF 日志的场景，对应的就是 aof_state 为 `AOF_WAIT_REWRITE 的分支`。在这个分支中，Redis 只是生成一个临时 Incr AOF 文件，它命名规则比较固定，分成了 temp 前缀、appendfilename 配置项指定的文件命令以及 .incr 后缀。在 Rewrite 期间的 AOF 日志都会写入到这个临时 AOF 文件中，这里不会将临时 Incr AOF 文件的信息添加到 manifest 文件中，而是等到 Rewrite 结束之后，将临时文件转换成正式的 Incr AOF 文件，才会加到 manifest 文件中。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95eec061f4764485bd007fb6e63a0731~tplv-k3u1fbpfcp-watermark.image?)


### 写入数据

准备好 Incr AOF 文件之后，Redis 就可以**正式调用 rewriteAppendOnlyFile() 函数开始写 Base 文件**，下面是 rewriteAppendOnlyFile() 函数的核心流程：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0eb00dfffed94cf9883ee57421e32e33~tplv-k3u1fbpfcp-watermark.image?)


首先，rewriteAppendOnlyFile() 函数会创建一个临时文件，它是 Base 文件的前身，此次 Rewrite 的结果就会写入到这个文件中。为了写入数据，这里会同时创建一个 rio 实例来负责向这个文件写入数据，注意这里也有一个增量刷盘配置，对应 redis.conf 配置文件中的 aof-rewrite-incremental-fsync 配置项，它和前面介绍 RDB 持久化的时候，说的 rdb-save-incremental-fsync 配置项原理是一样的，这里就不再重复了。


接下来，检查 aof-use-rdb-preamble 这个配置项是否开启，它的意思是在 Rewrite 过程中，是按照 RDB 编码格式写 Base 文件还是按照 AOF 日志的格式写 Base 文件，它的默认值是 yes，也就是使用 RDB 编码方式。使用 RDB 编码格式的好处是 RDB 格式紧凑、文件更小、恢复速度更快。


如果使用 RDB 格式进行 Rewrite 的话，这里会执行前文介绍的 rdbSaveRio() 函数，这个过程我们就不再重复了。如果使用 AOF 格式进行 Rewrite 的话，这里会执行 rewriteAppendOnlyFileRio() 函数，按照 AOF 格式对 Redis 进行快照，并写入到临时文件中。



在 rewriteAppendOnlyFileRio() 函数中，会遍历 Redis 中的所有 Key，并根据 Value 的不同类型生成对写命令，然后按照 AOF 日志格式进行编码后写入到临时文件中。下表展示了核心类型对应生成的 AOF 日志：

| **Value 类型**  | **Rewrite 生成的对应 AOF 日志**  |
| ------------- | ------------------------- |
| 字符串           | SET                       |
| 列表（Quicklist） | RPUSH                     |
| 集合（Set）       | SADD                      |
| 有序集合（ZSet）    | ZADD                      |
| 哈希表（Hash）     | HMSET                     |
| Stream        | XADD、XSETID、XGROUP CREATE |
| 过期时间          | PEXPIREAT                 |

  

我们看到在生成列表、集合以及哈希表等类型对应的 AOF 日志时，使用的都是批量写入的命令，但是批量写入命令也不能无限追加 Value 值，这里的每条批量写入命令最多可以添加 64 个 Value 值（ 该值由 AOF_REWRITE_ITEMS_PER_CMD 宏定义），一旦 Value 个数超过 64，就会拆分成多条批量命令。


除了上述数据结构之外，按照 AOF 格式 Rewrite 的时候，也是可以追加时间戳的，这和前面介绍的写 AOF 日志的逻辑相同，也是为了实现按时间点进行恢复。

完成 Rewrite 数据的写入之后，rewriteAppendOnlyFile() 函数会对临时文件进行刷盘，然后将其进行重命名。



### 收尾工作

在引入 Multi-Part AOF 之前，主进程会通过管道把 Rewrite 期间的 AOF 日志传给子进程，然后子进程会在 Rewrite 结束之后，把这些 AOF 日志追加到文件末尾。这个交互流程非常复杂，也不利于维护。在 Redis 7 引入 Multi-Part AOF 之后，子进程只进行 Rewrite 操作，`收尾工作完全由主进程完成`，无需进程间复杂的交互了。


前面说过，在子进程结束的时候，主进程会通过 checkChildrenDone() 函数感知到子进程结束，如果结束的是 AOF Rewrite 子进程，那么主进程会通过 backgroundRewriteDoneHandler() 函数完成 Rewrite 的收尾工作。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93518c032b1942689342c1d6f9ab4578~tplv-k3u1fbpfcp-zoom-1.image)

  


在子进程完成 Rewrite 操作的时候，还并未真正生成一个有效的 Base 文件，主要有两点体现：一是文件名称不对，子进程生成的是一个名为 temp-rewriteaof-bg-{子进程 ID}.aof 的临时文件，不符合 Base 文件的命名规则；二是这个临时文件并没有加入到 manifest 文件中，Redis 恢复数据是根据 manifest 文件查找 Base 文件的，如果此时 Redis 宕机重启的时候，是完全感知不到这个文件的存在。所以，在 backgroundRewriteDoneHandler() 函数中，需要将 Rewrite 出来的临时 AOF 文件 rename 成 Base 文件，然后记录到 manifest 文件中。



下面我们来看 **backgroundRewriteDoneHandler() 函数**中的核心流程，如图所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a02253afe0c54e3cbae751a88ca1d7b5~tplv-k3u1fbpfcp-watermark.image?)

首先，backgroundRewriteDoneHandler() 在修改 redisServer.aof_manifest 字段之前，先深拷贝一份临时的 aofManifest 实例出来，接下来的修改都是针对这个临时的 aofManifest 实例进行的，修改完成之后，直接替换到 aof_manifest 字段上。这样做的好处就是方便回滚，我们只要不更新 redisServer.aof_manifest 字段，在临时 aofManifest 实例上的修改，对 Redis 来说，都是不可见的。



拷贝完 aofManifest 之后，Redis 会生成一个新的 Base AOF 文件名， Base AOF 文件名的格式是 `{appendfilename}.{seq}.base.{rdb/aof}`。其中 `{appendfilename}` 部分是 appendfilename 配置项指定的文件名，`{seq}`部分是通过 aofManifest.curr_base_file_seq 自增得到的 Base AOF 文件编号，`base`是 Base AOF 文件的固定标识，`{rdb/aof}`文件后缀是根据生成 Base AOF 时使用的编码方式决定的，有 rdb 和 aof 两个可选值。在生成的 Base AOF 文件名的同时，Redis 还会将历史的 Base AOF 文件标记为 History 状态，具体操作是将对应的 aofInfo 实例，放到 aofManifest.history_aof_list 列表中，相应实现位于 getNewBaseFileNameAndMarkPreAsHistory() 函数中。



确定 Base AOF 文件名之后，主进程将子进程 Rewrite 产生的 `temp-rewriteaof-bg-{子进程 ID}.aof` 临时文件重命名为刚刚生成的 Base AOF 文件名，这样，就真正拿到了最新的 Base AOF 文件。



接下来，会根据 aof_state 的状态值，进入不同的分支进行处理。如果是 AOF_WAIT_REWRITE 状态，就是使用 CONFIG SET appendonly yes 命令的方式，开启 AOF 的场景，此时要生成一个新的 Incr AOF 文件名称，并对前面生成的 ` temp-{appendfilename}.incr  `临时文件进行 rename 操作，得到真正的 Incr AOF 文件，同时，还会将该 Incr AOF 文件对应的 aofInfo 实例添加到 incr_aof_list 列表维护。



然后，将历史的 Incr AOF 文件标记的为 History 状态，具体操作是将 aofManifest.incr_aof_list 列表中，除了最后一个 aofInfo 实例之外的其他 aofInfo 实例，添加到 aofManifest.history_aof_list 列表中。相应实现位于 markRewrittenIncrAofAsHistory() 函数中。



到这里，拷贝出来的临时 aofManifest 实例中，已经记录了最新的 Base AOF 文件以及 Incr AOF 文件的信息，下面执行 persistAofManifest() 函数进行 manifest 文件的写入。persistAofManifest() 函数写入思路和 Rewrite 的思路意义一样：它会先把临时 aofManifest 实例中的各条文件记录拼接成一个字符串，写入到一个 `temp-{appendfilename}.manifest` 临时文件，然后执行 redis_fsync() 函数把数据落盘，最后执行 rename 操作，将这个临时文件改成正式的 manifest 文件，文件名为`{appendfilename}.manifest` 。之所以使用这种临时文件+rename 的写入方式，是为了让整个写入看起来是原子性的，只有写入和 rename 都成功了，manifest 文件才是有效的，但凡其中一步出现失败，就只会生成一个临时 manifest 文件，对 Redis 来说是不可见的。


完成各个 AOF 文件更新和 rename 操作之后，backgroundRewriteDoneHandler() 函数会更新 redisServer 实例中，与 AOF Rewrite 相关的几个字段，例如，aof_current_size、aof_rewrite_base_size 等字段记录新 Base AOF + 新 Incr AOF 的大小，aof_last_fsync 字段记录当前秒级时间戳，也就是此次 Rewrite 结束的时间戳，这些都是下次触发 Rewrite 操作时要检查的字段。


最后，Redis 会执行 aofDelHistoryFiles() 函数，清理前面 History 类型的 AOF 文件，其中会迭代并删除 aofManifest.history_aof_list 列表中的每个文件，删除文件调用的是 unlink() 函数，删除完所有文件之后，会再执行一次 persistAofManifest() 函数，将 manifest 文件中 History AOF 文件的记录也清理掉。aofDelHistoryFiles() 函数是个清理历史文件的幂等操作，即使执行失败了也不会影响整个 AOF Rewrite 的收尾工作，会在下次 Rewrite 结束的时候，继续进行删除。



## 总结

在这一节中，我们重点对 AOF Rewrite 机制进行了详细的剖析。

-   首先，我们对 AOF Rewrite 机制进行了概述，让小伙伴们对 AOF Rewrite 机制的大致工作流程有一个印象；
-   然后，介绍了 AOF Rewrite 触发的时机；
-   最后，我们详细分析了 AOF Rewrite 机制的核心流程，其中包括准备操作、写入数据的具体实现以及 AOF Rewrite 的收尾操作。


到此为止，Redis 持久化的内容就全部介绍完了。在下一模块中，我们将从 Redis 主从同步入手，介绍 Redis 集群方面的内容。