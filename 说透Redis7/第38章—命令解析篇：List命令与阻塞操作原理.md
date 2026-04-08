通过前面[第 6 讲《实战应用篇：List 命令详解与实战（上）》](https://juejin.cn/book/7144917657089736743/section/7147527279311224832)的介绍我们知道，Redis 中的 List 抽象了一个双端 List 的数据结构，Redis 提供了丰富的 List 命令来从队列两端读写命令。另外，Redis 中没有 Stack 这种数据结构，我们可以通过只操作 List 的一端来模拟 Stack 结构的特性。

从实现角度来看，我们把 List 相关的实现逻辑分成了`写入数据`、`弹出数据`以及`阻塞操作`三大部分。这也是我们本节要介绍的三个核心内容。

## 写入数据

在前面我们已经详细介绍过 `LPUSH`、`RPUSH` 这类写入数据的命令，下面来这些 PUSH 命令的底层实现，如下图调用栈所示，它们底层都依赖于 **pushGenericCommand()** 这个公共函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d87cda7cdd954185bbb4f82063d93353~tplv-k3u1fbpfcp-zoom-1.image)

pushGenericCommand() 函数中有三个参数，含义如下：

```c
void pushGenericCommand(client *c, // 发送命令的客户端

 int where,  // 对List的左端还是右端进行操作，例如，LPUSH命令中该值为0

 int xx // 在List不存在的时候，是否自动创建，例如LPUSH命令中该值为0，LPUSHX命令则为1

)
```

下面来看 pushGenericCommand() 函数的核心逻辑：

```c
void pushGenericCommand(client *c, int where, int xx) {

    int j;

    // 1、调用 lookupKeyWrite() 函数去 redisDb 中查找目标 List 是否存在

    robj *lobj = lookupKeyWrite(c->db, c->argv[1]);

    if (checkType(c,lobj,OBJ_LIST)) return;

    if (!lobj) {

        if (xx) {

            addReply(c, shared.czero);

            return;

        }

        // 2、如果不存在，且 xx 参数为 0，则自动创建一个新的 quicklist 实例，并记录到 redisDb 中

        lobj = createQuicklistObject();

        quicklistSetOptions(lobj->ptr, server.list_max_listpack_size,

                            server.list_compress_depth);

        dbAdd(c->db,c->argv[1],lobj);

    }



    for (j = 2; j < c->argc; j++) {

        // 3、向 quicklist 中写入数据

        listTypePush(lobj,c->argv[j],where);

        server.dirty++;

    }



    addReplyLongLong(c, listTypeLength(lobj));



    char *event = (where == LIST_HEAD) ? "lpush" : "rpush";

    signalModifiedKey(c,c->db,c->argv[1]);

    notifyKeyspaceEvent(NOTIFY_LIST,event,c->argv[1],c->db->id);

}
```

1.  首先调用 lookupKeyWrite() 函数去 redisDb 中查找目标 List 是否存在。

2.  如果不存在，且 xx 参数为 0，则自动创建一个新的 quicklist 实例，并记录到 redisDb 中。这里新建 quicklist 实例的时候，会根据 list-max-listpack-size 和 list-compress-depth 的配置，设置每个 quicklistNode 中元素个数的上限，以及从首尾两端的第几个 quicklistNode 节点开始压缩。
3.  然后，就是调用 listTypePush() 函数，向 quicklist 中写入数据，其底层会根据插入位置，决定是通过前面[第 19 讲《数据结构篇：深入 quicklist 核心方法》](https://juejin.cn/book/7144917657089736743/section/7147528898765717519)介绍的 quicklistPushHead() 或 quicklistPushTail() 函数完成插入，再底层就是通过 listpack 的 API 完成写入。

## 弹出数据

介绍完写入数据的核心逻辑，我们来看 `LPOP`、`RPOP` 这些弹出命令底层的实现。如下图所示，它们底层都调用了 **popGenericCommand()** 这个函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1a9279e6d274e03b0c6a63847a5b10d~tplv-k3u1fbpfcp-zoom-1.image)

下面是 popGenericCommand() 函数的核心代码实现：

```c
void popGenericCommand(client *c, int where) {

    int hascount = (c->argc == 3);

    long count = 0;

    robj *value;



    ... // 省略参数检查

    // 从 redisDb 中查找目标 List 

    robj *o = lookupKeyWriteOrReply(c, c->argv[1], hascount ? shared.nullarray[c->resp]: shared.null[c->resp]);

    if (o == NULL || checkType(c, o, OBJ_LIST))

        return;

    ... // 省略非关键代码



    // 根据命令中的 count 参数是否存在，决定是走 quicklistPopCustom() 函数，从 List 中弹出单个元素，还是走 quicklistDelRange() 函数，从 List 中弹出多个元素

    if (!count) {

        value = listTypePop(o,where);

        serverAssert(value != NULL);

        addReplyBulk(c,value);

        decrRefCount(value);

        listElementsRemoved(c,c->argv[1],where,o,1,NULL);

    } else {

        long llen = listTypeLength(o);

        long rangelen = (count > llen) ? llen : count;

        long rangestart = (where == LIST_HEAD) ? 0 : -rangelen;

        long rangeend = (where == LIST_HEAD) ? rangelen - 1 : -1;

        int reverse = (where == LIST_HEAD) ? 0 : 1;



        addListRangeReply(c,o,rangestart,rangeend,reverse);

        listTypeDelRange(o,rangestart,rangelen);

        listElementsRemoved(c,c->argv[1],where,o,rangelen,NULL);

    }

}
```

在 popGenericCommand() 函数中，首先会从 redisDb 中查找目标 List ，然后根据命令中的 count 参数是否存在，决定是走 quicklistPopCustom() 函数，从 List 中弹出单个元素，还是走 quicklistDelRange() 函数，从 List 中弹出多个元素。这里使用到的两个 quicklist 的函数，在介绍 [quicklist 数据结构核心方法](https://juejin.cn/book/7144917657089736743/section/7147529514791698472)的时候，都详细介绍过了，这里不再重复分析了，忘记的小伙伴可以回头看看前面的章节。

另外，当 List 中最后一个元素被弹出之后，LPOP 和 RPOP 命令会将 List 从 redisDb 中删除，这和 Hash、Set 两个集合的表现一样，底层也都是依赖 dbDelete() 函数实现的，不再多说了。

除了 LPOP 和 RPOP，List 还有两个阻塞版本的弹出命令，也就是我们下面要说的 `BLPOP` 和 `BRPOP` 命令。它们底层都调用了 **blockingPopGenericCommand()** 函数，如下图的调用栈所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e5c4c3890c0463eb6644c47e6280d5a~tplv-k3u1fbpfcp-zoom-1.image)

下面是 blockingPopGenericCommand() 函数的核心代码：

```c
void blockingPopGenericCommand(client *c, robj **keys, int numkeys, int where, int timeout_idx, long count) {

    robj *o;

    robj *key;

    mstime_t timeout;

    int j;

    // 读取超时时间

    if (getTimeoutFromObjectOrReply(c,c->argv[timeout_idx],&timeout,UNIT_SECONDS)

        != C_OK) return;



    for (j = 0; j < numkeys; j++) { // 从头开始检查每个 List 的长度

        key = keys[j];

        o = lookupKeyWrite(c->db, key);

        ... // 省略非关键性代码

        long llen = listTypeLength(o);

        ... // 省略非关键性代码

        // 第一个分支：遇到一个 List 不为空，就会从这个不为空的 List 里面弹出一个元素并返回给客户端

        if (count != -1) {

            listPopRangeAndReplyWithKey(c, o, key, where, count, NULL);

            robj *count_obj = createStringObjectFromLongLong((count > llen) ? llen : count);

            rewriteClientCommandVector(c, 3,

                                       (where == LIST_HEAD) ? shared.lpop : shared.rpop,

                                       key, count_obj);

            decrRefCount(count_obj);

            return;

        }

        robj *value = listTypePop(o,where);

        addReplyArrayLen(c,2);

        addReplyBulk(c,key);

        addReplyBulk(c,value);

        decrRefCount(value);

        listElementsRemoved(c,key,where,o,1,NULL);



        // 命令改写

        rewriteClientCommandVector(c,2,

            (where == LIST_HEAD) ? shared.lpop : shared.rpop,

            key);

        return;

    }

    if (c->flags & CLIENT_DENY_BLOCKING) {

        addReplyNullArray(c);

        return;

    }



    // 第二个分支：BLPOP 或者 BRPOP 命令中指定的全部 List 都是空的，那就会执行 blockForKeys() 函数，

    // 阻塞这个客户端等待这些 List 中写入新元素

    struct blockPos pos = {where};

    blockForKeys(c,BLOCKED_LIST,keys,numkeys,count,timeout,NULL,&pos,NULL);

}
```

**blockingPopGenericCommand()** **函数做的第一件事就是读取此次阻塞命令的超时时间**，这个超时时间怎么用，后面会展开详细介绍。我们知道 BLPOP 和 BRPOP 后面可以跟多个 List，blockingPopGenericCommand() 函数之后就会从头开始检查每个 List 的长度，然后根据这个结果进入两个不同的分支场景。

-   第一个分支是：遇到一个 List 不为空，就会从这个不为空的 List 里面弹出一个元素并返回给客户端，相应的 BLPOP 或 BRPOP 命令也会返回。要是这次弹出的元素是这个 List 里面的最后一个元素，blockingPopGenericCommand() 函数也会将这个 List 从 redisDb 中删除。

    在执行完成上述逻辑之后，blockingPopGenericCommand() 函数会将 BLPOP 或 BRPOP 命令进行改写，改成 LPOP 或 RPOP，然后写入到 AOF 文件、发给 Slave 节点中，毕竟阻塞的行为被记录到 AOF 日志文件或者发给 Slave 节点是没有意义的。（AOF 以及主从复制的内容，我们在后面有单独的章节进行介绍。）

-   第二个分支是：BLPOP 或者 BRPOP 命令中指定的全部 List 都是空的，那就会执行 blockForKeys() 函数，阻塞这个客户端等待这些 List 中写入新元素。`注意`，是阻塞客户端，而不是阻塞 Redis 主线程，主线程还是可以继续处理其他命令的。

下面我们就展开看看 Redis 是如何实现阻塞客户端这一功能的。

## 阻塞命令

这里我们展开介绍一下 Redis 中阻塞命令的核心逻辑，Redis 中的阻塞命令不仅有上面介绍的 BLPOP、BRPOP 命令，在 Sorted Sets、Stream 中也都有类似的阻塞读取命令，例如，BZPOPMAX、XREAD 命令等等，`它们底层阻塞客户端的逻辑都是一样的`。

### 核心结构体

要介绍 Redis 阻塞客户端的逻辑，首先要了解几个关键的结构体以及其中的关键字段。

这里先来看 `client 结构体`中，与阻塞客户端相关的字段：

```c
typedef struct client {

    uint64_t flags;     // 当对应客户端陷入阻塞的时候，我们需要在其flags字段中

                        // 设置CLIENT_BLOCKED标记位

    int btype;          // 记录阻塞原因

    blockingState bpop; // 记录阻塞状态 

    ... // 省略其他字段

}
```

首先是 **flags 字段**，当一个客户端进入阻塞状态的时候，就会在其 flags 字段中设置一个 CLIENT_BLOCKED 标记位。

然后是 **btype 字段**，它用来记录当前客户端阻塞的原因。Redis 将阻塞原因划分成了不同的 Block Type 值，可选值分为三大类。

-   第一类是 BLOCKED_LIST、BLOCKED_STREAM、BLOCKED_ZSET，这三个值表示在三种不同数据结构上阻塞。

-   第二类是 BLOCKED_WAIT，表示客户端执行了 WAIT 命令，WAIT 命令主要是在主从复制场景下使用，它的功能是阻塞当前客户端，然后等待一定数量的从库追上主库。
-   第三类是 BLOCKED_PAUSE，在发生故障转移的时候，Redis 会自动暂停所有客户端的写入，或者是某个客户端发送 CLIENT PAUSE 命令暂停全部客户端的写入。

我们这里介绍的 BLPOP 命令对应的 btype 字段值，自然就是 BLOCKED_LIST，表示在 List 这种数据结构上阻塞。

接下来看 **bpop 字段**，它是一个 blockingState 结构体的实例，其中存储了当前客户端阻塞的状态信息，里面的核心字段有四个。

-   timeout：记录了此次操作的阻塞超时时间。

-   keys（dict 指针类型）：当前客户端如果是阻塞在某几个数据结构上，那么使用 keys 字典记录这些数据结构对应的 Key。例如，BLPOP 命令阻塞时，就会将命令中的 List Key 记录到 keys 字典中，对应的 Value 值为一个 bkinfo 指针，其中的 listnode 字段指向了当前 client 在阻塞队列中对应的节点。
-   target（robj 指针类型）：记录了客户端从阻塞状态恢复过来之后，要将得到的数据写入到哪里。例如，`BLMOVE A B RIGHT LEFT` 命令的功能是从 List A 中弹出数据然后写入到 List B 中，发生阻塞的时候，target 就指向 B 这个用来接收数据的 List 。
-   listpos（listPos 结构体类型）：其中有 wherefrom 和 whereto 两个字段，分别记录了读取数据的位置以及写入数据的位置。依旧以 `BLMOVE A B RIGHT LEFT` 命令为例，从 List A 的右端弹出一个元素，然后将该元素从 List B 的左端写入，发生阻塞的时候，wherefrom 为 LIST_TAIL，whereto 为 LIST_HEAD。

blockingState 结构体中还有几个与 XREAD 阻塞命令、WAIT 阻塞命令相关的字段，这里就不再介绍了，在后面介绍 Stream 的时候，还会再提到这些字段。

了解了 client 结构体中与阻塞命令相关的关键字段之后，我们发现上述字段都是用来记录某个 client 的阻塞信息。下面要介绍的 redisDb 和 redisServer 中的字段，是`与阻塞命令相关的、全局性质的字段`。

-   blocking_keys 字段（dict 指针类型）：其中的 Key 是导致阻塞的 Key 值，Value 就是阻塞在这个 Key 上的 client 队列，这个队列中的每个节点也被对应 client->bpop.keys 中的 bkinfo->listnode 引用。

-   ready_keys 字段（dict 指针类型）：用来记录当前 redisDb 中此时已经就绪的 Key，主线程会根据 ready_keys 和 blocking_keys 两个集合，确定唤醒哪些 client。

最后，来看 redisServer 中与阻塞命令相关的字段。

-   blocked_clients_by_type（int 数组）：其中按照 Block Type 对阻塞 client 的数量进行统计，例如，blocked_clients_by_type[BLOCKED_LIST] 就是阻塞在 List 数据结构上的 client 个数。

-   clients_timeout_table（rax 指针类型）：按序记录 client 的阻塞超时时间，在超时时间到了之后，Redis 主线程会按序将 client 唤醒。clients_timeout_table 中的 Key 是 timeout 时间戳与 client 指针的组合，这样就可以按照 timeout 时间戳对 client 进行排序了，Value 为 NULL。
-   unblocked_clients 字段（list 指针类型）：用于保存当前处于 CLIENT_UNBLOCKED 状态下的 client 列表。这里的 CLIENT_UNBLOCKED 标志位是 client 阻塞超时或是被唤醒之后的一个`中间状态`，并不是非阻塞状态，client 在阻塞这段时间内可能会累积一些缓存数据没有被处理，这些数据需要在 client 解除阻塞状态之后立刻被处理，所以才会使用 CLIENT_UNBLOCKED 标志位进行特殊标识。（后面我们会详细介绍 Redis 对 unblocked_clients 列表的处理。）
-   ready_keys 字段（list 指针类型）：其中元素为 readyList 结构体类型，每个 readyList 包含了一个 redisDb 指针以及一个 redisObject 指针，指向了就绪的 Key 值以及该 Value 值所在的 redisDb。

### 进入阻塞状态

介绍完与阻塞命令相关的核心字段之后，我们`回到 blockForKeys() 函数来分析一下一个 client 是如何进入阻塞状态的`，先简单浏览一下 blockForKeys() 函数的关键实现，下面会结合一个示例，来分析这段代码：

```c
void blockForKeys(client *c, int btype, robj **keys, int numkeys, long count, mstime_t timeout, robj *target, struct blockPos *blockpos, streamID *ids) {

    dictEntry *de;

    list *l;

    int j;



    c->bpop.count = count;

    c->bpop.timeout = timeout; // 首先设置 client->bpop.timeout 记录阻塞时长

    c->bpop.target = target; //  然后设置 client->bpop.target 记录命令操作的目标 Key



    // 最后设置 client->bpop.listpos 记录阻塞位置

    if (blockpos != NULL) c->bpop.blockpos = *blockpos;



    if (target != NULL) incrRefCount(target);



    // 遍历阻塞命令中指定的 Key，将这些 Key 记录到 client->bpop.keys 中，

    // 也就是当前客户端将要阻塞在哪些 Key 上

    for (j = 0; j < numkeys; j++) {

        bkinfo *bki = zmalloc(sizeof(*bki));

        if (btype == BLOCKED_STREAM)

            bki->stream_id = ids[j];



        if (dictAdd(c->bpop.keys,keys[j],bki) != DICT_OK) {

            zfree(bki);

            continue;

        }

        incrRefCount(keys[j]);

        // 将这些 Key 以及当前 client 实例的映射关系，记录到 redisDb->blocking_keys 这个 dict 集合中

        de = dictFind(c->db->blocking_keys,keys[j]);

        if (de == NULL) {

            int retval;



            l = listCreate();

            retval = dictAdd(c->db->blocking_keys,keys[j],l);

            incrRefCount(keys[j]);

            serverAssertWithInfo(c,keys[j],retval == DICT_OK);

        } else {

            l = dictGetVal(de);

        }

        listAddNodeTail(l,c);

        bki->listnode = listLast(l);

    }

    // 通过 blockClient() 函数在当前 client 的 flags 字段中设置 CLIENT_BLOCKED 标志位

    // 同时将当前 client 添加到 redisServer->clients_timeout_table 中，等待阻塞超时

    blockClient(c,btype);

}
```

这里结合 `BLPOP A B 1000` 这条命令进行分析。

1.  blockForKeys() 函数首先设置 client->bpop.timeout 记录阻塞时长（示例中该值为 1000）， 然后设置 client->bpop.target 记录命令操作的目标 Key（示例中该值为 NULL，BLPOP 只弹出数据，不会将数据再写入到其他 List 中），最后设置 client->bpop.listpos 记录阻塞位置（示例中该值为 {LIST_HEAD}）。

2.  接下来，blockForKeys() 函数会遍历命令中指定的 Key，将这些 Key 记录到 client->bpop.keys 中，也就是当前客户端将要阻塞在哪些 Key 上（示例中该值为 A 和 B）。同时还会将这些 Key 以及当前 client 实例的映射关系，记录到 redisDb->blocking_keys 这个 dict 集合中。
3.  最后，通过 blockClient() 函数在当前 client 的 flags 字段中设置 CLIENT_BLOCKED 标志位，在当前 client 的 btype 字段中设置对应的 Block Type（示例中该值为 BLOCKED_LIST）。还会将当前 client 添加到 redisServer->clients_timeout_table 中，等待阻塞超时。

下图展示了 blockForKeys() 函数完成之后，client 和 redisDb 等结构体中关键字段的状态：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f385093cd68646179097854d7a95fac2~tplv-k3u1fbpfcp-watermark.image?)

一旦进入阻塞状态之后，该 client 就无法继续执行后续命令了，这主要是在 processInputBuffer() 函数中可以看到相关的检查逻辑：

```c
void processInputBuffer(client *c) {

    while(c->qb_pos < sdslen(c->querybuf)) {

        // 如果client处于CLIENT_BLOCKED状态，不会执行下面的命令解析和命令执行逻辑

        if (c->flags & CLIENT_BLOCKED) break;

        ... // 省略其他逻辑，例如，RESP协议版本的判断

        // 下面根据客户端使用的RESP协议版本，解析读取到的请求和参数

        if (c->reqtype == PROTO_REQ_INLINE) { 

            if (processInlineBuffer(c) != C_OK) break;

        } else if (c->reqtype == PROTO_REQ_MULTIBULK) {

            if (processMultibulkBuffer(c) != C_OK) break;

        }

        // 执行上面解析到的命令

        if (processCommandAndResetClient(c) == C_ERR) {

            return;

        }

    }

}
```

### 超时处理

随着时间推移，如果一直没有客户端向我们阻塞等待的 Key 写入数据（在 `BLPOP A B 1000` 这个示例中，就是没有数据写入到 A、B 两个 List 中），那么这个阻塞的 client 就会因为阻塞超时退出阻塞状态。检查阻塞是否超时的逻辑位于 **handleBlockedClientsTimeout()** 函数之中，该函数会在主线程每次调用 beforeSleep() 时执行，调用栈如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d42af86cc7a7443ea4c852b7c5b51dd7~tplv-k3u1fbpfcp-zoom-1.image)

每次执行 handleBlockedClientsTimeout() 函数的时候，都会从头开始扫描 clients_timeout_table 这棵 rax 树，前面[第 25 讲《数据结构篇：深入 Rax 树实现》](https://juejin.cn/book/7144917657089736743/section/7147529638384762895)说过，clients_timeout_table 中 client 指针是按照超时时间排序的，所以从头开始扫描，能找到已经过期的 client 或者是超时时间距离当前最近的 client 。在扫描过程中，handleBlockedClientsTimeout() 会将每个节点中记录的 timeout 时间戳与当前时间进行比较：

-   如果 timeout 时间戳大于当前时间，则说明当前以及之后的 client 都未超时，后续的 client 自然也不会过期，停止此次扫描即可；

-   反之，说明当前 rax 节点中的 client 已超时，会先调用 unblockClient() 函数处理超时 client，然后将该 raxNode 删除并继续迭代后续节点。

unblockClient() 函数会根据 Block Type 进入不同的分支处理阻塞 client 实例，在`  BLPOP A B 1000 ` 这条命令超时的时候，会执行下面的逻辑。

1.  首先，迭代超时 client 的 bpop.keys 集合，得到的该 client 阻塞在 A、B 两个 Key 上，同时拿到对应的 client 节点，也就是 bkinfo 指针的值。

2.  根据 bkinfo 指针以及 A、B 两个 Key，从 redisDb->blocking_keys 中删除当前 client 在 A、B 两个 List 中对应的节点。
3.  清空超时 client 的 bpop.keys 字段以及 target 字段。
4.  将超时 client 中的 CLIENT_BLOCKED 标记位删除掉，并设置 CLIENT_UNBLOCKED 标记位。
5.  将超时 client 从 redisServer.clients_timeout_table 树中删除。
6.  将超时 client 添加到 redisServer.unblocked_clients 队列中等待处理，这部分逻辑位于 queueClientForReprocessing() 函数中。

在 Redis 主线程下次执行 beforeSleep() 函数时，在进入读写事件监听之前，有下面这段逻辑：先通过 processUnblockedClients() 函数处理 unblocked_clients 队列中刚刚解除阻塞状态的 client。

```c
void beforeSleep(struct aeEventLoop *eventLoop)

    ... // 省略其他逻辑

    if (listLength(server.unblocked_clients))

        processUnblockedClients();

    ... // 省略其他逻辑

}



void processUnblockedClients(void) {

    listNode *ln;

    client *c;

    // 遍历 unblocked_clients 队列

    while (listLength(server.unblocked_clients)) { 

        ln = listFirst(server.unblocked_clients);

        c = ln->value;

        listDelNode(server.unblocked_clients,ln);

        c->flags &= ~CLIENT_UNBLOCKED;



        if (!(c->flags & CLIENT_BLOCKED)) {

             // 对于每个client调用processPendingCommandAndInputBuffer()函数，

             // processPendingCommandAndInputBuffer()函数会先调用

             // processPendingCommandsAndResetClient()函数执行其已经解析好的命令,

             // 然后再调用processInputBuffer()函数处理在client->querybuf中缓冲

             // 的数据

            if (processPendingCommandAndInputBuffer(c) == C_ERR) {

                c = NULL;

            }

        }

        beforeNextClient(c);

    }

}
```

processUnblockedClients() 函数会遍历 unblocked_clients 队列，对于其中每个 client 先调用 processPendingCommandsAndResetClient() 函数执行其已经解析好的命令，然后调用 processInputBuffer() 函数处理在 client->querybuf 中缓冲的数据。为什么是先执行命令，再处理缓冲区中的数据呢？如果这两个函数的调用反过来，就会造成 client->argv 中已解析好的命令丢失。

最后，processUnblockedClients() 函数会清空 unblocked_clients 队列，并将这些 client 的 CLIENT_UNBLOCKED 标记位清理掉。

### 唤醒处理

在当前客户端执行 `BLPOP A B 1000` 命令阻塞在 A、B 两个 Key 上的这段时间，如果有其他客户端向 A 或 B 这两个 List 中写入数据，就会将当前客户端唤醒。

下面我们就来看一下唤醒阻塞客户端的流程。

首先让我们回到执行 PUSH 命令的 pushGenericCommand() 函数中，当我们向一个空 List 中写入数据的时候，实际是先通过 dbAdd() 函数向 redisDb 中写入 List 的 Key 以及一个空 quicklist，然后才是向 quicklist 中写入元素。在 dbAdd() 函数中除了向 db->dict 这个字典结构写入键值对之外，还会调用 signalKeyAsReady() 函数记录能够唤醒阻塞客户端的 Key，该函数的核心逻辑如下。

1.  根据当前写入的数据类型以及 redisServer.blocked_clients_by_type 数组，判断此次操作是否可能唤醒阻塞的 client。

2.  如果可能唤醒某些 client，则从 redisDb->blocking_keys 字典中查找阻塞在当前 Key 上的 client 队列。
3.  如果得到一个非空 client 队列，也就找到了写入当前 Key 能唤醒的 client 集合了。然后将当前写入的这个 Key 记录到 redisDb->ready_keys 字典中，同时还会将当前写入 Key 以及当前 redisDb 指针封装成一个 readyList 实例，并添加到 redisServer.ready_keys 列表中。

待 PUSH 命令执行完毕之后，会立刻调用 handleClientsBlockedOnKeys() 函数处理 redisServer.ready_keys 列表，调用代码片段如下：

```c
int processCommand(client *c)

    ... // 其他逻辑

    call(c, CMD_CALL_FULL); // 执行PUSH命令

    ... // 其他逻辑

    if (listLength(server.ready_keys)) // 是否存在能够唤醒client的Key

        handleClientsBlockedOnKeys(); // 唤醒阻塞client

    ... // 其他逻辑

}
```

handleClientsBlockedOnKeys() 函数会迭代 redisServer.ready_keys 列表中，针对每个 Key 去 db->dict 中拿到写入的 Value 值，然后根据 Value 值的类型进入不同的处理分支：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5897e3fe34e4ec0a06b35491ab169d1~tplv-k3u1fbpfcp-watermark.image?)

这里我们依旧以 `BLPOP A B 1000` 命令为例，执行该命令的 client 会阻塞在 A、B 这两个 List 上，如果有另一个 client 执行了 ` LPUSH A  ``a` 命令，向 A 这个列表中添加一个元素，就会触发上述唤醒流程，并走到 serveClientsBlockedOnListKey() 函数。

serveClientsBlockedOnListKey() 的核心逻辑如下：

```c
void serveClientsBlockedOnListKey(robj *o, readyList *rl) {

    ... 

    // 1、根据 A 这个 Key 从 redisDb->blocking_keys 字典中拿到阻塞在 A 上的 client 队列

    dictEntry *de = dictFind(rl->db->blocking_keys,rl->key);

    if (de) {

        list *clients = dictGetVal(de);

        listNode *ln;

        listIter li;

        listRewind(clients,&li);



        while((ln = listNext(&li))) { // 从头开始迭代阻塞在A上的client

            client *receiver = listNodeValue(ln);

            if (receiver->btype != BLOCKED_LIST) continue;



            int deleted = 0;

            robj *dstkey = receiver->bpop.target;

            int wherefrom = receiver->bpop.blockpos.wherefrom;

            int whereto = receiver->bpop.blockpos.whereto;



            if (dstkey) incrRefCount(dstkey);



            long long prev_error_replies = server.stat_total_error_replies;

            client *old_client = server.current_client;

            server.current_client = receiver;

            monotime replyTimer;

            elapsedStart(&replyTimer);

            // 在serveClientBlockedOnList()中会做下面几件事情：

            // 首先，根据当前迭代到的 client->bpop.wherefrom 信息，从 A 这个 List 中弹出元素

            // 然后，结合bpop.target把弹出的数据写入到队列或者返回给客户端

            // 最后， A 这个 List 变成空 List的话，会把它删除掉

            serveClientBlockedOnList(receiver, o,

                                     rl->key, dstkey, rl->db,

                                     wherefrom, whereto,

                                     &deleted);

            updateStatsOnUnblock(receiver, 0, elapsedUs(replyTimer), server.stat_total_error_replies != prev_error_replies);

            unblockClient(receiver);

            afterCommand(receiver);

            server.current_client = old_client;



            if (dstkey) decrRefCount(dstkey);



            /* The list is empty and has been deleted. */

            if (deleted) break;

        }

    }

}
```

1.  首先，serveClientsBlockedOnListKey() 函数会根据 A 这个 Key 从 redisDb->blocking_keys 字典中拿到阻塞在 A 上的 client 队列，然后从头开始迭代该队列。

2.  然后，根据当前迭代到的 client->bpop.wherefrom 信息，从 A 这个 List 中弹出元素（即执行 listTypePop(o, wherefrom) 调用）。
3.  如果弹出成功且 bpop.target `为 NULL`，那就将弹出的元素写到缓冲区中，在相应底层连接触发可写事件时，数据才会真正返回给客户端。同时向 AOF 和 Slave 节点传播一条非阻塞命令，例如，BLPOP 命令会修改成 LPOP 命令之后进行传播。
4.  如果弹出成功且 bpop.target `不为 NULL`，那就会结合 client->bpop.listpos.whereto 的值，将弹出数据重新写入到 bpop.target 指定 List 中（whereto 指定了写入队首还是队尾）。同时，也会向 AOF 文件和 Slave 节点传播一条对应的非阻塞命令。

    步骤 3、4 对应的具体实现位于 serveClientBlockedOnList() 函数中，核心逻辑已经说清楚了，代码就不再展示了。

5.  如果弹出的元素值为 NULL，则表示列表为空，也就没法继续唤醒后续阻塞的 client，此时，就会停止对阻塞 client 队列的迭代，队列中后续的 client 将继续处于阻塞状态。
6.  最后，检查 A 这个 List 是否变成空 List，如果是的话，会通过 dbDelete() 函数将 A 从 redisDb->dict 字典中删除。

执行完 serveClientsBlockedOnListKey() 的处理之后，handleClientsBlockedOnKeys() 会通过前文介绍的 unblockClient() 函数，把唤醒的 client 添加到 redisServer->unblocked_clients 中，后续和超时的 client 一起，由 processUnblockedClients() 函数进行处理。（processUnblockedClients() 函数的实现前文已经分析过了，这里不再重复。）

到此为止，client 从进入阻塞状态到退出阻塞状态的全流程，就介绍完了。

## 总结

这一节我们重点介绍了 Redis 中 List 的命令实现，重点介绍了向 List 写入数据以及从 List 中弹出数据的核心原理。另外，还重点介绍了 Redis 阻塞命令的实现原理，其中涉及如何让客户端进入阻塞状态、如何处理阻塞超时以及如何正常唤醒客户端的实现。

下一节，我们将继续讲解 Sorted Set 中核心命令的实现。