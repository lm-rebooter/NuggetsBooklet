在使用 Redis 做缓存之类的非持久化存储时，我们一般会给 Key 设置一个过期时间，在 Key 到期之后，Redis 就会把这个 Key 自动删除掉，我们之后就再也拿不到这个 KV 数据了。

那 Redis 是如何将过期 Key 清理掉的呢？常见的过期 Key 清理方式（也被称为“过期策略”）有三种：`定时过期`、`惰性过期`以及`定期过期`，我们简单介绍一下三者的核心区别以及 Redis 采用的策略。

-   **定时过期策略**：该策略需要为每个 Key 关联一个定时器（或是一个全局定时器）记录 Key 的过期时间，当 Key 到期时由定时器触发过期事件，触发执行 Key 的清理逻辑。定时过期策略可以立刻清理过期 Key，释放内存，但是需要额外维护定时器这种复杂的结构。

-   **惰性过期策略**：该策略是在客户端访问一个 Key 的时候，判断目标 Key 是否已经到期，如果到期了，就会将其删除，并且返回给客户端 Key 不存在。除此之外的其他时间不会主动去清理 Key。惰性过期策略实现比较简单，不会占用单独的 CPU 时间去执行 Key 过期的操作，而是平摊到了每次 Key 的访问中，但是，如果客户端长时间不访问已经过期的 Key，这些 Key 就会一直存在于内存中，无法被删除，浪费内存空间。
-   **定期过期策略**：该策略是前面两种策略的`折中方案`，定期过期策略会周期性地执行过期 Key 扫描逻辑，并将扫描到的过期 Key 清理掉。使用该策略时，我们可以调整每次扫码的耗时上限、每次扫描 Key 的总量以及两次扫描的时间间隔，保证扫描逻辑不会影响正常的业务逻辑，也可以保证内存不被过期 Key 填满。

在 Redis 中并没有采用定时过期策略，而是**选择了**`惰性过期策略`**和**`定期过期策略`**的组合**，本节我们就来介绍 Redis 中这两种策略的实现。

## 设置过期时间

在开始介绍过期策略之前，我们需要先了解一下 Redis 中每个 Key 的过期时间是保存在哪里的，并且还会额外介绍一下 EXPIRE、PEXPIRE 等命令的核心逻辑。

在前面[第 26 讲《内核解析篇：Redis 核心结构体精讲》](https://juejin.cn/book/7144917657089736743/section/7147529654142763023)介绍 redisDb 结构体的时候，提到过其中两个 dict 集合的作用：一个是 dict 字段，它用来存储真正的 KV 数据；**另一个是 expires 字段，它用来存储每个 Key 的过期时间，其中的 Value 是对应 Key 的过期时间戳**。

Redis Server 在接收并解析完 EXPIRE、PEXPIRE 等命令之后，会通过从 server.commands 中查找到对应的 redisCommand 实例，执行其对应的处理函数，这些逻辑在前面[第 31 讲《内核解析篇：命令解析与执行》](https://juejin.cn/book/7144917657089736743/section/7147529868001935360)中已经详细分析过了，这里就不再重复。这些命令对应的处理函数底层，调用的都是 `expireGenericCommand() 函数`，调用栈如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22b963ca775c45a5b6f58db190d332ed~tplv-k3u1fbpfcp-zoom-1.image)

expireGenericCommand() 函数的核心原理分析如下：

```c
void expireGenericCommand(client *c, long long basetime, int unit) {

    robj *key = c->argv[1], *param = c->argv[2];

    long long when; /* unix time in milliseconds when the key will expire. */

    long long current_expire = -1;

    int flag = 0;

    // 省略参数检查逻辑

    // 1、它会从解析好的命令参数中获取指定的 Key 的过期时长，并以当前时间戳为基准，计算出目标 Key 过期的秒级时间戳 when

    if (unit == UNIT_SECONDS) { 

        if (when > LLONG_MAX / 1000 || when < LLONG_MIN / 1000) {

            addReplyErrorExpireTime(c);

            return;

        }

        when *= 1000;

    }

    if (when > LLONG_MAX - basetime) {

        addReplyErrorExpireTime(c);

        return;

    }

    when += basetime;



    // 2、检查目标 Key 是否存在，其实就是去redisDb->dict中查找目标 Key。

    // 如果目标 Key 不存在，直接通过 addReply() 向客户端返回 0。

    if (lookupKeyWrite(c->db,key) == NULL) {

        addReply(c,shared.czero);

        return;

    }



    // 3、检查 EXPIRE 命令后续带的参数，比如 NX、XX、GT、LT 等参数，

    // 如果此次操作不满足这些参数指定的条件，expireGenericCommand() 函数会返回 0。

    // 这里省略这部分冗长的检查逻辑



    // 4、检查步骤 1 得到的 when 时间戳是否已经到期了，如果到期了，就说明 Key 值也过期了，直接删除 redisDb->dict 集合中的目标 Key 即可。

    if (checkAlreadyExpired(when)) {

        robj *aux;



        int deleted = server.lazyfree_lazy_expire ? dbAsyncDelete(c->db,key) :

                                                    dbSyncDelete(c->db,key);

        serverAssertWithInfo(c,key,deleted);

        server.dirty++;



        /* Replicate/AOF this as an explicit DEL or UNLINK. */

        aux = server.lazyfree_lazy_expire ? shared.unlink : shared.del;

        rewriteClientCommandVector(c,2,aux,key);

        signalModifiedKey(c,c->db,key);

        notifyKeyspaceEvent(NOTIFY_GENERIC,"del",key,c->db->id);

        addReply(c, shared.cone);

        return;

    } else {

        // 5、如果 when 还有一段时间才会到期，它就会调用 setExpire() 函数

        setExpire(c,c->db,key,when);

        addReply(c,shared.cone);

        /* Propagate as PEXPIREAT millisecond-timestamp */

        robj *when_obj = createStringObjectFromLongLong(when);

        rewriteClientCommandVector(c, 3, shared.pexpireat, key, when_obj);

        decrRefCount(when_obj);

        signalModifiedKey(c,c->db,key);

        notifyKeyspaceEvent(NOTIFY_GENERIC,"expire",key,c->db->id);

        server.dirty++;

        return;

    }

}
```

1.  首先，它会从解析好的命令参数中获取指定的 Key 的过期时长，并以当前时间戳为基准，计算出目标 Key 过期的秒级时间戳 when。

3.  接下来，它会检查目标 Key 是否存在，其实就是去 redisDb->dict 中查找目标 Key。如果目标 Key 不存在，直接通过 addReply() 向客户端返回 0。
4.  检查 EXPIRE 命令后续带的参数，比如 NX、XX、GT、LT 等参数，如果此次操作不满足这些参数指定的条件，expireGenericCommand() 函数会返回 0。
5.  检查步骤 1 得到的 when 时间戳是否已经到期了，如果到期了，就说明 Key 值也过期了，直接删除 redisDb->dict 集合中的目标 Key 即可。
6.  如果 when 还有一段时间才会到期，它就会调用 setExpire() 函数，其中会先查询 redisDb->dict 得到目标 Key 对应的 dictEntry，然后使用 when 时间戳更新目标 Key 在 redisDb->expires 集合中的 Value 值，再具体点，就是更新对应 dictEntry->v.s64 字段。
7.  最后返回给客户端相应的响应信息，并触发一些关联的事件通知。

这里可能会有小伙伴觉得 setExpire() 函数里面再次查询 redisDb->dict 是一个没用的操作，前面不是已经检查过 Key 是不是存在了吗？直接设置 expires 这个 dict 不就可以了吗？

要回答这个问题，我们需要前面几个章节介绍的的一些知识点。

首先，通过前面[第 20 讲《数据结构篇：深入 Hash 实现》](https://juejin.cn/book/7144917657089736743/section/7147529551927590947)对 dict 的介绍我们知道，每个 dict 里面都要设置一个 dictType，dictType 里面有一个 keyDup 函数指针负责复制写入的 Key，但是注意，dbDictType 和 dbExpiresDictType 两个 dictType 里面的 keyDup 都是 NULL，也就是`不会复制 Key`。

第二个知识点是，我们解析的命令都是放到 client->argv 数组里面的，在我们执行 EXPIRE 命令的时候，Key 这个字符串，其实就是来自 argv 数组。

```c
void expireGenericCommand(client *c, long long basetime, int unit) {

    robj *key = c->argv[1], *param = c->argv[2];
```

在命令执行完成之后，就会走 freeClientArgv() 函数把 argv 数组都释放掉，调用栈如下图所示。如果EXPIRE 命令直接用这个 Key 写入到 redisDb->expires 里面，在 argv 数组释放的时候，就会出现空指针。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ec993c360c749e9b80b5cbfa99566c6~tplv-k3u1fbpfcp-zoom-1.image)

回到 setExpire() 函数，它之所以还需要再执行一次 redisDb->dict 的查询，就是为了拿到 redisDb->dict 中的 Key 字符串，然后在 redisDb->expires 中进行复用，让两个不同 dictEntry 的 key 指针，指向同一个 Key 字符串实例，如下图所示：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ec9742772174d88bb4208c10e184878~tplv-k3u1fbpfcp-watermark.image?)

有的小伙伴可能还会问：既然 dbDictType 的 keyDup 是 NULL，那我们执行 SET 命令的时候，Key 也是被解析到 argv 数组里面的，命令执行完了也会被释放，那 SET 命令的 Key 是怎么保留下来的呢？

这个问题的答案在 `dbAdd() 函数`中，它其中有拷贝 Key 字符串的操作，相关代码片段如下：

```c
void dbAdd(redisDb *db, robj *key, robj *val) {

    sds copy = sdsdup(key->ptr); // 将argv数组中的Key字符串拷贝一份

    dictEntry *de = dictAddRaw(db->dict, copy, NULL); // 将拷贝出来的字符串作为

    ... // 省略后续其他操作

}
```

## 惰性过期策略

明确了过期时间的存放位置和设置过程之后，我们来看 Redis 中惰性过期策略，其相关实现位于 `expireIfNeeded() 函数`中。Redis 在执行所有需要访问 Key 的命令时，都会调用该函数，如下图所示的调用栈，几乎所有的 Redis 命令都会调用到 expireIfNeeded() 函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e61a502bff44c58b9bff577f337cb41~tplv-k3u1fbpfcp-zoom-1.image)

下面我们展开 expireIfNeeded() 函数的核心逻辑：

```c
int expireIfNeeded(redisDb *db, robj *key, int flags) {

    // 1、从 redisDb->expires 这个集合里面，获取目标 Key 的过期时间，并与当前时间戳进行比较，从而判断目标 Key 是否过期了。如果没有过期，就不需要执行后续过期操作

    if (!keyIsExpired(db,key)) return 0;



    // 2、如果当前的 Redis Server 是运行在主从模式下的一个从库，也不会执行后续过期操作，因为主从模式里面，过期 Key 是由主库控制的，从库只能被动接受

    if (server.masterhost != NULL) {

        if (server.current_client == server.master) return 0;

        if (!(flags & EXPIRE_FORCE_DELETE_EXPIRED)) return 1;

    }



    /* In some cases we're explicitly instructed to return an indication of a

     * missing key without actually deleting it, even on masters. */

    if (flags & EXPIRE_AVOID_DELETE_EXPIRED)

        return 1;



    /* If clients are paused, we keep the current dataset constant,

     * but return to the client what we believe is the right state. Typically,

     * at the end of the pause we will properly expire the key OR we will

     * have failed over and the new primary will send us the expire. */

    if (checkClientPauseTimeoutAndReturnIfPaused()) return 1;



    // 3、根据 redis.conf 中的 lazyfree-lazy-expire 配置项（对应 redisServer.lazyfree_lazy_expire 字段），决定延时删除过期 Key 还是立刻删除 Key

    deleteExpiredKeyAndPropagate(db,key);

    return 1;

}
```

1.  首先从 redisDb->expires 这个集合里面，获取目标 Key 的过期时间，并与当前时间戳进行比较，从而判断目标 Key 是否过期了。如果没有过期，就不需要执行后续过期操作。这部分检查过期时间的逻辑封装在 keyIsExpired() 函数中，感兴趣的小伙伴可以去看一下具体的代码实现，这里不再展示代码了。

3.  如果当前的 Redis Server 是运行在主从模式下的一个从库，也不会执行后续过期操作，因为主从模式里面，过期 Key 是由主库控制的，从库只能被动接受。Redis 主从复制的内容，我们后续会有单独一章来介绍，这里就不再细说了。
4.  我们继续 expireIfNeeded() 函数的后续逻辑，它接下来进入 deleteExpiredKeyAndPropagate() 函数。这个函数首先会根据 redis.conf 中的 lazyfree-lazy-expire 配置项（对应 redisServer.lazyfree_lazy_expire 字段），决定延时删除过期 Key 还是立刻删除 Key。如果是延迟删除，就会走 dbAsyncDelete() 函数，把过期 Key 交给后台线程异步删除；如果是立刻删除，就会走 dbSyncDelete() 函数，由主线程同步进行删除。在 deleteExpiredKeyAndPropagate() 函数的最后，它将过期 Key 被删除的事件传播给从节点，还会将删除操作记录到 AOF 文件。

另外，过期 Key 还触发一些额外的操作，比如，`触发 KeySpace notifications`、`触发 Watched Key 通知`、`发送 Invalidate Key 消息`。这里我们简单说一下这三个通知的功能，如下。

-   Redis 6.0 中引入了客户端缓存的功能，Redis Server 会通过 Invalidate Key 消息通知客户端，指定的 Key 已经失效了。Redis 客户端在收到 Invalidate Key 消息之后，就会从本地缓存里面，删掉指定 Key，实现与 Redis Server 的同步。

-   KeySpace notifications 是 Redis 提供的一种监听 Key 变更的方式，客户端可以通过订阅 Redis 中的 `__keyevent@<db>__`、`__keyspace@<db>__`两个 Channel，监听到 Redis Server 发生的变更事件和发生变更的 Key。如果有小伙伴不了解 Redis 中 Pub/Sub 的功能，也不用着急，后面我们还会有单独的章节来介绍 Pub/Sub；如果有小伙伴对 KeySpace notifications 的使用感兴趣，可以[参考这篇文档](https://redis.io/docs/manual/keyspace-notifications/)。
-   在 Redis 里面有一个 Watch 命令，当我们的客户端 Watch 了一个 Key 之后，如果其他客户端修改了这个 Key，我们的客户端就会收到相应的通知。如果我们的客户端在一个事务里面，在执行EXEC 命令的时候，就会失败。这里触发的 Watched Key 通知，就是通知我们的客户端，我们 Watch 的 Key 被修改了。Watch 命令以及 Redis 事务的相关原理，在后面也会有专门一节来进行分析，小伙伴们这里只需要知道有这个通知即可。

这三个事件的触发逻辑都位于 deleteExpiredKeyAndPropagate() 函数中，感兴趣的小伙伴可以去参考其具体实现。

expireIfNeeded() 中需要特别展开介绍的就是 Key 的删除，也就是如何把过期的 Key 从 Redis 中清除掉。这个删除逻辑其实与我们自己手动调用 DEL 命令删除 Key 的逻辑基本一致，但是有些细节的思考需要注意：正如前文介绍的那样，在 Redis 6.0 中出现了多 IO 线程的模型，但是 Redis 始终使用单线程执行所有命令和时间事件，当 Redis 执行一个高耗时的命令时，会导致所有客户端的所有请求阻塞，出现性能问题，而删除一个大 Key 就是高耗时的操作。

下面展示了删除一个 100000 个元素的哈希表所用的耗时：

```c
127.0.0.1:6379>HLEN Test

(integer) 100000

127.0.0.1:6379>DEL Test

(integer) 1

(1.51s) // 耗时1.5s
```

习惯 Java 开发的小伙伴们可能疑惑，删除是从 redisDb->dict 这个哈希结构里面删 Key，应该是 O(1) 的操作啊，跟 Value 大小有什么关系呢？这跟语言特性有关，C 语言里面没有 GC，需要我们手动释放内存，也就是我们在 Redis 代码里面常见的 `zfree() 调用`，无论是申请大内存还是回收大内存，都是比较耗时的操作。

在 Redis 4.0 版本之后，Redis 引入了很多 `lazy free` 的特性，这些特性的目的是**解决删除大 Key 阻塞主线程带来的性能问题**。所谓 lazy free 特性，就是在需要删除大 Key 的时候，Redis 不会立刻由主线程去释放大 Key 的内存空间，而是将释放大 Key 的操作放到子线程中处理，从而实现减少主线程浪费在删除大 Key 上的时间，让主线程能够及时响应其他客户端请求。

## lazy free 特性

在 Redis 中使用 lazy free 特性的场景大致可以分为两大类：`一类是客户端主动执行删除命令，另一类是 Redis Server 因为 Key 过期、内存淘汰等机制触发的 Key 删除`。

下面我们就展开说说这两类场景的具体实现原理。

### 主动删除场景分析

在我们执行 DEL 命令的时候，底层执行的是 `delGenericCommand() 函数`，其中有如下一行逻辑：

```c
void delGenericCommand(client *c, int lazy) {

    int numdel = 0, j;



    for (j = 1; j < c->argc; j++) { // 循环删除DEL命令后面全部的Key

        expireIfNeeded(c->db,c->argv[j],0); // 惰性过期策略，检查Key是否已经过期了

        // 根据lazy参数，决定是交给后台线程异步删除，还是主线程同步删除

        int deleted  = lazy ? dbAsyncDelete(c->db,c->argv[j]) :

                              dbSyncDelete(c->db,c->argv[j]);

        if (deleted) { 

            // 删除成功之后，会触发Invalidate Key消息、Watched Key通知

            // 以及KeySpace notifications，这和Key过期的时候一样

            signalModifiedKey(c,c->db,c->argv[j]);

            notifyKeyspaceEvent(NOTIFY_GENERIC,

                "del",c->argv[j],c->db->id);

            server.dirty++;

            numdel++;

        }

    }

    addReplyLongLong(c,numdel); // 通过addReply*()给客户端返回成功删除了几个Key

}
```

delGenericCommand() 函数中最核心的就是**根据 lazy 值决定删除方式**这行代码：

```c
// 根据lazy参数，决定是交给后台线程异步删除，还是主线程同步删除

int deleted  = lazy ? dbAsyncDelete(c->db,c->argv[j]) :

    dbSyncDelete(c->db,c->argv[j]);
```

DEL 命令使用的这个 lazy 参数值，其实就是 redis.conf 文件中的 lazyfree-lazy-user-del 配置项，默认值为 no，也就是走 dbSyncDelete() 函数，由主线程同步删除 Key。

除了 DEL 命令之外，我们还可以使用 UNLINK 命令来删除 Key，其底层也是调用的 delGenericCommand() 函数，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/237ea9c68cb44ddaab030873ecd6ef4a~tplv-k3u1fbpfcp-zoom-1.image)

在 UNLINK 命令执中使用的 lazy 参数值始终为 1，也就是走 dbAsyncDelete() 函数，由后台线程异步删除 Key。如果将 lazyfree-lazy-user-del 配置项修改为 no，那么 DEL 和 UNLINK 命令的效果就完全一样了。

### 被动删除场景分析

除了客户端调用 DEL 或 UNLINK 命令明确删除一个 Key 之外，下面 `4 个场景`也会涉及到 Key 的删除。

**第一个场景是当 Redis 作为缓存使用时，一般会指定最大内存空间（对应 redis.conf 中的 maxmemory 配置项），以及内存淘汰策略（对应 maxmemory-policy 配置项）** 。在 Redis 内存达到 maxmemory 指定的最大值时，Redis 就会按照 maxmemory-policy 指定的策略，对老数据进行淘汰，为新的缓存数据腾出内存空间。

此时，我们可以通过 lazyfree-lazy-eviction 配置项（默认值为 no），决定是否进行异步删除。这部分实现位于 evict.c 文件中的 performEvictions() 函数中，片段如下：

```c
if (server.lazyfree_lazy_eviction)

    dbAsyncDelete(db,keyobj); // 异步删除

else

    dbSyncDelete(db,keyobj); // 同步删除
```

**第二个场景就是上面介绍的 Key 过期的场景，当 Key 过期时，会根据 lazyfree-lazy-expire 配置项（默认值为 no）决定是否进行异步删除**。这段逻辑位于 deleteExpiredKeyAndPropagate() 函数中，如下所示：

```c
if (server.lazyfree_lazy_expire)

    dbAsyncDelete(db,keyobj); // 使用异步方式删除

else

    dbSyncDelete(db,keyobj); // 使用同步方式删除
```

**第三个场景是在某些命令中，会影响原有已经存在的 Key**。例如，RENAME 命令会将原来的 Key 删除掉并更新成新 Key；再例如，SREM 命令在从集合删除 Key 的时候，一旦集合被删成空的了，就会将整个集合删除掉。

下图是 dbDelete() 函数的调用栈，可见有很多命令在一些特殊条件下，都会有删 Key 的逻辑：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75841546d082448c93aa1f37066f7e30~tplv-k3u1fbpfcp-zoom-1.image)

这种场景中，Redis 会根据 lazyfree-lazy-server-del 配置值决定是否进行异步删除，这部分逻辑封装在 db.c 文件中的 dbDelete() 函数中，核心代码片段如下（它底层依赖的 dbGenericDelete() 函数我们会在下面的实现部分进行详细说明）：

```c
int dbDelete(redisDb *db, robj *key) {

    return dbGenericDelete(db, key, server.lazyfree_lazy_server_del);

}
```

**第四个场景是在清空数据库时**。这个场景下面又分为两个子场景。

一个子场景是在主从复制中，从节点重新全量同步主库数据之前，会清空整个 DB，此时，会根据 replica-lazy-flush 配置项（默认值为 no）决定是否异步清空 DB 中数据。该逻辑封装在 emptyDbAsync() 函数中，下图展示了该场景中 emptyDbAsync() 的调用栈：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f899a564102745a6bfd2e0d751801b31~tplv-k3u1fbpfcp-zoom-1.image)

另一个子场景是在 Redis Server 收到 FLUSHALL 等清空数据命令的时候，Redis 会根据 lazyfree-lazy-user-flush 配置项（默认为 no），决定是否异步清空数据库中的全部数据。在 db.c 中的 getFlushCommandFlags() 函数中，Redis 从库会根据 lazyfree-lazy-user-flush 配置项设置一个标志位，代码片段如下：

```c
int getFlushCommandFlags(client *c, int *flags) {

   ... // 省略其他逻辑

   // 根据lazyfree_lazy_user_flush配置项决定是否异步清空

   *flags = server.lazyfree_lazy_user_flush ?  

        EMPTYDB_ASYNC : EMPTYDB_NO_FLAGS;

}
```

然后，Redis 从库会根据这个 flags 值决定是不是要触发 emptyDbAsync() 函数进行异步删除。在上面的 emptyDbAsync() 函数的调用栈中，我们也能看到 FLUSHDB 命令以及 FLUSHALL 命令的身影。

### 同步删除实现

了解了 lazy free 特性的使用场景和大致原理之后，我们接下来看 dbSyncDelete() 函数同步删除的具体实现，它底层依赖了 dbGenericDelete() 这个公共函数，它不仅支持同步删除，还支持异步删除，唯一的区别就是 async 参数的值不同，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3853632f7fee49f194a8dde05af71311~tplv-k3u1fbpfcp-zoom-1.image)

下面是 dbGenericDelete() 这个函数的具体实现以及详细的注释说明：

```c
int dbSyncDelete(redisDb *db, robj *key) {

    return dbGenericDelete(db, key, 0); // 底层调用dbGenericDelete()

}



static int dbGenericDelete(redisDb *db, robj *key, int async) {

    // 首先从redisDb->expires中删除键值对，也就是删除了Key的过期时间。

    // 注意，先后只是调用了dict的删除逻辑，其中会回收掉相应的dictEntry实例，

    // 而其中的Key字符串不会被回收，这主要是因为它的refcount字段没有降为0，毕竟

    // 这个Key在redisDb->expires和redisDb->dict中是共享的

    if (dictSize(db->expires) > 0) dictDelete(db->expires,key->ptr);

    

    // 在redisDb->dict中查找要删除的dictEntry，并且把目标dictEntry从dict中删掉

    dictEntry *de = dictUnlink(db->dict,key->ptr);

    if (de) { // 下面开始释放空间

        robj *val = dictGetVal(de);

        moduleNotifyKeyUnlink(key,val,db->id);

        if (val->type == OBJ_STREAM)    // 针对Stream的处理，

            signalKeyAsReady(db,key,val->type);

        if (async) {  // 根据async参数觉得是不是要走freeObjAsync()进行异步删除逻辑，

                      // 注意，异步回收的只有value对象，Key以及dictEntry不会回收

            freeObjAsync(key, val, db->id);

            dictSetVal(db->dict, de, NULL); // 将dictEntry中的value指针设置为NULL

        }

        // 集群模式下的处理

        if (server.cluster_enabled) slotToKeyDelEntry(de, db);

        // 如果前面走了异步，这里就回收dictEntry以及Key，value指针已经设置成NULL了

        // 如果是走同步，value指针此时还不为NULL，这里也还会对value值进行回收

        // 这里的Key、Value都是redisObject对象，只要它们的refcount减到0，

        // 就会触发zfree()回收内存空间，dictEntry的话，可以直接调用zfree回收

        dictFreeUnlinkedEntry(db->dict,de);

        return 1;

    } else {

        return 0;

    }

}
```

### 异步删除实现

通过上述代码分析，我们知道了两个异步删除数据的入口，一个是 freeObjAsync() 函数，一个是 emptyDbAsync() 函数。**异步删除的核心，其实是创建一个异步任务，然后提交给后台线程进行处理，这个逻辑封装在 `bioCreateLazyFreeJob() 函数`里面**。

如下图调用栈所示，除了 freeObjAsync() 函数异步删除键值对、emptyDbAsync() 函数异步清空整个 redisDb 之外，还有很多异步回收空间的操作，比如 freeReplicationBacklogRefMemAsync() 函数，它就是在提交一个异步回收 backlog 缓冲区的任务 ，backlog 缓冲区是在主从复制中使用的一个缓冲区。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36f43158ec69483db98b0d0d739f8649~tplv-k3u1fbpfcp-zoom-1.image)

前面我们已经明确了dbAsyncDelete() 这个异步删除的函数，与 dbSyncDelete() 同步删除逻辑的底层，都是依赖于 dbGenericDelete() 函数，`区别集中在 freeObjAsync() 函数里面`。

下面我们来看 freeObjAsync() 函数的核心实现分析：

```c
void freeObjAsync(robj *key, robj *obj, int dbid) {

    // 计算删除成本 

    size_t free_effort = lazyfreeGetFreeEffort(key,obj,dbid);

    if (free_effort > LAZYFREE_THRESHOLD && obj->refcount == 1) {

        atomicIncr(lazyfree_objects,1);

        bioCreateLazyFreeJob(lazyfreeFreeObject,1,obj); // 异步删除

    } else {

        decrRefCount(obj); // 直接删除

    }

}
```

-   freeObjAsync() 函数首先会通过 lazyfreeGetFreeEffort() 函数计算回收目标键值对的成本。lazyfreeGetFreeEffort() 核心逻辑就是根据不同的 Value 类型计算近似的回收成本，计算的大概方式如下：如果是连续的内存空间，可以通过一次 zfree() 函数回收的，成本就是 1。例如，Value 是 OBJ_LIST 类型，回收成本就是 quicklist 列表中 quicklistNode 节点的个数；Value 是 OBJ_HASH 类型且是 OBJ_ENCODING_HT 编码方式，回收成本就是 dict 中元素的个数，也就是两个 ht_table 中的元素之和，如果是 OBJ_ENCODING_LISTPACK 编码的哈希表，回收的就是一个连续的 listpack 空间，回收成本为 1。

-   接下来评估回收成本是否达到了触发 lazy free 的阈值（默认为 64）。如果未达到该阈值，则freeObjAsync() 就不会提交异步任务，而是留给之后的同步逻辑处理。如果达到阈值，则会调用 bioCreateLazyFreeJob() 函数提交一个异步删除的任务，由后台线程完成对 Value 的回收；而 Key 确定是一个连续空间且不会很大的字符串，回收成本可控，依旧通过同步方式回收。

接下来要看的就是 `bioCreateLazyFreeJob() 函数如何与后台线程交互，以及后台线程如何处理异步任务了`。

```c
void bioCreateLazyFreeJob(lazy_free_fn free_fn, int arg_count, ...) {

    va_list valist;

    // 创建任务

    bio_job *job = zmalloc(sizeof(*job) + sizeof(void *) * (arg_count));

    job->free_args.free_fn = free_fn;



    va_start(valist, arg_count);

    for (int i = 0; i < arg_count; i++) {  // 记录任务参数

        job->free_args.free_args[i] = va_arg(valist, void *);

    }

    va_end(valist);

    bioSubmitJob(BIO_LAZY_FREE, job); // 提交任务

}
```

**bioCreateLazyFreeJob() 第一个参数是个函数指针**，指向了用于回收函数，熟悉 Java 的小伙伴可以把它理解成 Runnable 中 run() 方法的实现，这里回收单个 Value 值使用的是 lazyfreeFreeObject() 函数，这个函数里面会调用 decrRefCount() 函数减少待释放 robj 实例的引用次数，也就是 refcount 字段值，当其降为 0 时，就会根据对应的类型和编码方式调用对应的 *Release() 函数。

例如，Value 值是一个哈希表（即 type 为 OBJ_HASH 类型）且编码为 OBJ_ENCODING_HT 时，底层使用的存储结构是 dict，就需要调用 dictRelease() 函数先将 dict 中存储的所有键值对一个个进行回收掉，最后再调用 zfree() 函数回收掉 dict 实例本身的内存空间；如果编码是 OBJ_ENCODING_LISTPACK，那么底层的存储结构是 listpack，是一块连续的内存空间，直接调用 zfree() 函数回收掉整个 listpack 实例所占的内存空间即可。

**bioCreateLazyFreeJob() 函数第二个参数是需要回收的实例个数，第三个参数是个变长参数**，也就是说，bioCreateLazyFreeJob() 函数可以传递多个 redisObject 对象，这些对象会在一个后台任务中被回收掉。

接下来，我们进入 bioCreateLazyFreeJob() 函数的实现，发现它的核心逻辑就是用 `bio_job 结构体`来抽象一个提交到后台线程的任务，其中封装了上述 bioCreateLazyFreeJob() 函数接收的三个参数：

```c
struct bio_job {

    int fd; // 在任务中使用的文件描述符

    lazy_free_fn *free_fn; // 回收参数的函数指针

    void *free_args[]; // 需要回收的实例

};
```

在 bioCreateLazyFreeJob() 最后，会调用 bioSubmitJob() 函数将上面创建的 bio_job 任务，添加到 bio_jobs 队列中，同时，还会唤醒相应的后台 bio 线程来处理该队列中的任务。

下面我们来看看后台线程的相关内容，在 Redis 启动的时候，会调用 bioInit() 函数启动 bio 后台线程，调用栈如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdda1a81d6c14423870be1040a01977c~tplv-k3u1fbpfcp-zoom-1.image)

在 bioInit() 函数中会启动三个后台线程，分别处理 BIO_CLOSE_FILE、BIO_AOF_FSYNC、BIO_LAZY_FREE 三种类型的任务。三个 bio 线程执行的都是 bioProcessBackgroundJobs() 函数，同时还会创建下面 4 个数组（长度都是 3）。

-   bio_mutex 数组：存储每个 bio 后台线程关联的 pthread_mutex_t 锁，可以让主线程暂停对应的 bio 后台线程。

-   bio_jobs 数组：存储每个 bio 后台线程关联的 bio_job 任务队列，主线程向其中提交任务，对应的 bio 后台线程从其中获取任务处理。
-   bio_pending 数组：存储了每个 bio 后台线程待处理的任务个数，也就是对应 bio_job 任务队列的长度。
-   bio_newjob_cond 数组：存储了每个 bio 后台线程关联的 pthread_cond_t 条件变量，用于通知对应 bio 后台线程有新任务要处理。熟悉 Java 的小伙伴，可以把它理解成 wait/notify 机制。

bio 后台线程与 IO 线程的设计基本类似，如下图所示，唯一的区别是，IO 线程用自旋的方式来等待新的读写任务，而 bio 后台线程使用 condition 阻塞的方式来等待新的后台任务，这其实也和任务提交频率有关系，IO 任务显然是要比后台任务更加频繁，用自旋等待，可以减少线程切换的成本。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f577a8ab281f44ce86cccf1a195d1014~tplv-k3u1fbpfcp-watermark.image?)

明确了 bio 后台线程的模型之后，我们再来看每个 bio 后台线程执行了什么逻辑，也就是 bioProcessBackgroundJobs() 函数。其中最核心的逻辑就是从相应的 bio_jobs 队列中，取出相应的 bio_job 任务，然后执行其中的 free_fn 函数，核心代码片段如下：

```c
void *bioProcessBackgroundJobs(void *arg) {

    struct bio_job *job;

    ... // 省略其他逻辑

    while(1) {

        listNode *ln;

        if (listLength(bio_jobs[type]) == 0) {

            // 阻塞等待对应bio_jobs任务队列出现待处理的任务。在前文介绍的

            // bioCreateLazyFreeJob()函数在提交任务的时候，会发送该信号，

            // 唤醒这里阻塞的bio后台线程。

            pthread_cond_wait(&bio_newjob_cond[type],

                &bio_mutex[type]);

            continue;

        }

        // 从任务队列中获取任务

        ln = listFirst(bio_jobs[type]);

        job = ln->value;

        pthread_mutex_unlock(&bio_mutex[type]); // 释放锁



        if (type == BIO_CLOSE_FILE) { // 省略其他类型后台任务的处理逻辑

            ... 

        } else if (type == BIO_AOF_FSYNC) {

            ... 

        } else if (type == BIO_LAZY_FREE) {

            // 调用lazyfreeFreeObject()函数回收内存

            job->free_fn(job->free_args);

        }

        zfree(job); // 回收任务实例本身

        // 获取对应的锁，准备调用下一轮的pthread_cond_wait

        pthread_mutex_lock(&bio_mutex[type]); 

        listDelNode(bio_jobs[type],ln); // 删除处理完的任务

        bio_pending[type]--; // 递减待处理的任务个数

    }

}
```

到此为止，freeObjAsync() 的全部内容以及 lazy free 后台线程的相关内容就介绍完了。

最后，我们再来看一下 emptyDbAsync() 函数的实现，它里面也是通过 bioCreateLazyFreeJob() 函数提交一个任务，这个任务执行的逻辑是 lazyfreeFreeDatabase() 函数，其中会将 redisDb->dict 和 expires 两个 dict 对象回收掉，具体实现比较简单，感兴趣的小伙伴可以参考源码进行分析。

## 定期过期策略

本节最开始提到，Redis 采用了惰性过期和定期过期两种策略，因此，本节的最后一部分，我们就一起来看一下 Redis 里面定期删除策略的相关实现。

**定期删除策略的大概原理就是 Redis 每隔一段时间扫码一下 DB 中的 Key，并将扫描到的过期 Key 删除掉**。这就非常适合使用`时间事件`的方式进行触发，比如放到上一讲介绍的 serverCron() 函数中。既然定期过期的扫描流程是在 serverCron() 中触发的，那就是由主线程执行的，所以我们不希望定期删除的逻辑长时间阻塞主线程，而且还希望尽可能地释放内存空间，这就需要进行`折中设计`。

为了满足上述需求，Redis 把定期过期的操作分成了“慢速”和“快速”两种模式，分别从 `serverCron() 函数`和 `beforeSleep() 函数`两处进行触发，**定期过期的具体实现则统一封装到了 `activeExpireCycle() 函数`里面，通过参数区分此次执行的是快速模式还是慢速模式**。

下图展示了 activeExpireCycle() 函数的调用栈：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cee150078e57438d8fd0ff2a5aa96bee~tplv-k3u1fbpfcp-zoom-1.image)

-   慢速模式的特点是：执行频率低，每次执行的时间长，能够扫描到的 Key 也多。在慢速模式中，activeExpireCycle() 函数会控制自身的执行时长，保证每次执行时长不超过 25ms，默认 serverCron() 执行频率为 10 的时候，也就是默认情况下，每秒 activeExpireCycle() 函数占用主线程的时长不超过 250 ms。

-   快速模式的特点是：执行频率高，每次执行的时间短，能够扫描到的 Key 也就少。在快速模式中，activeExpireCycle() 函数的调用时长默认是 1000 微秒，由于是在 beforeSleep() 函数中触发，所以频率无法保证。一般情况下 beforeSleep() 函数的执行频率远高于 serverCron() 函数，所以这里也对 快速模式进行了频率限制，默认两次快速模式之间的时间间隔，至少有 2000 微秒。

下面来看 activeExpireCycle() 函数的核心逻辑，如下图所示：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f88a892a543e492f8a02bd161bb780c9~tplv-k3u1fbpfcp-watermark.image?)

这里我们展开一步步介绍，首先来看初始化变量的部分，这里会初始化很多控制 activeExpireCycle() 函数执行流程的变量。

-   config_keys_per_loop：默认值为 20，在后续扫描中，如果一次扫描的 Key 总数超过了该值，就应该结束此次扫描了。这里我们可以通过 active-expire-effort 配置项（默认值为 1，可选值 1~10）调整 config_keys_per_loop 的取值，该配置项增加 1，则相应的 config_keys_per_loop 增加 25%，也就是增加 5，值变为 25。

-   config_cycle_fast_duration：用于计算一次快速模式 activeExpireCycle() 调用的耗时上限，快速模式的耗时上限默认值为 1000 微秒。active-expire-effort 配置项每增加 1，则相应的 config_cycle_fast_duration 增加 25%，也就是增加 250 微秒。
-   config_cycle_slow_time_perc：用于计算一次慢速模式 activeExpireCycle() 调用的耗时上限，慢速模式的耗时上限与 serverCron() 的调用周期相关，默认值为 25 毫秒。active-expire-effort 配置项每增加 1，相应的 config_cycle_slow_time_perc 增加 2 毫秒。
-   config_cycle_acceptable_stale：根据 Redis 统计值发现其中含有大量的已过期 Key 时（占比超过 config_cycle_acceptable_stale，默认值 10%），Redis 会持续扫描该 DB 回收其中已过期 Key。active-expire-effort 配置项每增加 1，相应的 config_cycle_acceptable_stale 减少 1%。
-   timelimit：此次 activeExpireCycle() 调用的耗时上限值，快速和慢速模式下，这个取值也不同。

接下来看三个 static 局部变量。

-   一个是 current_db ，它用于记录上次 activeExpireCycle() 调用最后一次扫描的 DB 编号。一般情况下，我们只会使用一个 DB，也就是编号为 0 的 Redis DB。

-   第二个是 timelimit_exit，它用于记录上次调用 activeExpireCycle() 函数的时候，是不是因为运行时间达到上限而退出的。
-   第三个是 last_fast_cycle，它用于记录上次快速模式执行的时间点。

这里针对快速模式的调用，有两个前置判断，只有通过了这两个前置判断，快速模式才能继续后续的逻辑：一个是当前 Redis 里面有超过 10% （config_cycle_acceptable_stale）的过期 Key，另一个是距离上次快速模式的调用时间超过 2000 微秒（config_cycle_fast_duration *2）。

完成上述初始化以及检查之后，下面正式`开始逐个扫描 DB`。

首先要检查 redisDb->expires 的负载程度，也就是用“键值对数量”`除以`“槽位数量”，负载小于 1%，表示这个 redisDb 中绝大多数 Key 没有被设置过期时间，或者是 Key 很少，所以扫描这个 DB 的收益不高，Redis 就会放弃扫描这个 DB。

如果 expires 负载超过 1 %，Redis 会从 db->expires_cursor 这个槽位开始迭代，expires_cursor 字段记录的是上次 activeExpireCycle() 调用扫描该 DB 时候，最后一次扫描到的槽位下标，所以这次依旧从该槽位开始抽样扫描。

一旦决定对一个槽位进行扫描，就会将其中的全部 Key 都扫描完，遇到过期的 Key 就会调用 activeExpireCycleTryExpire() 函数释放键值对的内存空间，其中会根据 lazyfree-lazy-expire 配置值决定同步释放还是异步释放。（同步和异步释放内存的逻辑前面已经详细分析过了，这里不再重复。）

每完成一个槽位的处理，Redis 都会检查扫描 Key 的个数以及处理的槽位个数，是否达到了上限值（分别是 config_keys_per_loop 和 20*config_keys_per_loop），两项都未达到上限，就会继续扫描后续槽位。

在扫描的过程中，Redis 还会`定期检查下面两个条件`。

-   一个是检查超时时间，每隔 16 次抽样扫描检查一次，这里检查超时时间是获取系统时间戳，而不是缓存的时间，毕竟缓存的时间在整个 activeExpireCycle() 函数中是不变的。如果发生超时，此次 activeExpireCycle() 调用会马上结束，并将 timelimit_exit 这个 static 局部变量设置为 1，表示此次扫描是因为超时结束的，Redis 中还有未扫描的过期 Key，为下次快速模式的触发做准备。

-   二是检查当前 redisDb 扫码的效果，其实是检查`扫到过期 Key / 扫到 Key 的总数`这个值是否大于 config_cycle_acceptable_stale（默认值 10%），如果大于，Redis 会认为当前这个 redisDb 里面有大量的过期 Key，会继续扫描这个 redisDb 的其他槽位。

这里提到了 timelimit_exit 这个静态局部变量，它有两个作用：一个是扫描开始之前，表示上次 activeExpireCycle() 调用是否超时；二是扫描开始之后，表示此次 activeExpireCycle() 调用是否已经超时。

在每次 activeExpireCycle() 调用结束之前，Redis 都会统计 server.stat_expired_stale_perc 值，表示 Redis 过期 Key 的占比，其中此次扫描结果占 5% 的权重 ，之前的扫描结果占 95% 权重：

```c
server.stat_expired_stale_perc = (current_perc*0.05) 

                                  + (server.stat_expired_stale_perc*0.95);
```

前面提到的针对快速模式的检查，就会使用到 timelimit_exit 和 server.stat_expired_stale_perc 两个值，这里就不再重复了。

到此为止，定期过期策略的核心内容就介绍完了。

## 总结

这一节，我们重点分析了 Redis 中 Key 的过期与删除核心实现。

-   首先，我们一起分析了 Redis 中，EXPIRE、PEXPIRE 两个设置过期时间命令的核心实现。
-   然后，还说明了 Redis 惰性删除策略原理；为了防止删除大 Key 的时候，造成性能下降，Redis 引入了 lazy free 的特性，可以异步释放内存，我们这里也深入分析了 lazy free 涉及到的多种场景。
-   最后，定期过期策略作为惰性过期策略的补充，可以尽可能保证过期 Key 被及时删除。

下一节，我们将会介绍 Redis 在内存被打满的这种特殊场景下，该如何进行 Key 的淘汰。