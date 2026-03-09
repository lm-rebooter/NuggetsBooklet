在上一模块中，我们重点介绍了一个单机 Redis 是如何运行的，着重分析了单机 Redis 的线程模型、事件模型、整个请求-响应的处理流程等内容。但是，没有涉及到请求中命令的具体情况。这一模块我们就来重点介绍一下 Redis 是如何在底层数据结构之上，实现我们常用的命令的。

这一模块中，我们根据 Redis 命令底层实现的相关性，分成了下面几篇进行介绍：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ec0604435bc4e19840d580ae9a9e788~tplv-k3u1fbpfcp-zoom-1.image)

## 通用命令

在 Redis 命令分类里面， **Generic 分类中的命令并不与任意一种数据结构对应，而是可以操作所有类型的结构**。下图对 Generice 分类中的命令，做了进一步的分类：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb5cdc1f4e40457ba6c263f6261de7fc~tplv-k3u1fbpfcp-zoom-1.image)

这里我们就展开介绍实践中比较常用的 Generic 分类中的命令。

### 查看 Key 信息

**`OBJECT 命令`是 Redis 中用来查看一个 Key 元信息的命令**，它有几个子命令。

-   最常用的就是 OBJECT ENCODING 命令，它会返回指定 Key 的编码方式，获取的是对应 redisObject 对象的 encoding 字段值。

-   OBJECT REFCOUNT 命令会返回指定 Key 被引用的次数，其实就是对应 redisObject 对象的 refcount 字段值。
-   OBJECT IDLETIME 命令和 OBJECT FREQ 命令分别对应上一讲介绍的 `*-lru 淘汰策略`和 `*-lfu 淘汰策略`，它们都是获取对应 redisObject 对象中的 lru 字段，然后解析得到 Key 的空闲时间或者最近访问频次。

通过前面[第 26 讲《内核解析篇：Redis 核心结构体精讲》](https://juejin.cn/book/7144917657089736743/section/7147529654142763023)对 redisCommand 的介绍，我们可以轻松定位到 OBJECT 命令对应的处理函数是 objectCommand() 函数。

在 objectCommand() 函数中，首先根据 c->argv[1] 参数，确定 OBJECT 子命令，然后进入 lookupKeyReadWithFlags() 函数查找目标 Key，其中使用的 flags 值 LOOKUP_NOTOUCH|LOOKUP_NONOTIFY，也就是不会更新 lru 字段，也不会触发 KeySpace 通知，毕竟这只是查询元数据，并不是查询里面键值对的具体值。查找结束之后，根据 OBJECT 子命令读取 Value 值的不同字段，返回即可。整个流程用下面一张图即可完整囊括：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7547a977587f4596b548374e8842f833~tplv-k3u1fbpfcp-watermark.image?)

第二条要介绍的 Generic 类型的命令是 `TYPE 命令`，它获取的是 redisObject 中的 type 字段值，具体实现与 OBJECT 命令的实现基本一致，也是依赖 lookupKeyReadWithFlags() 查询目标 Key 值。type 字段指定了 redisObject 包装数据的具体类型，结合 OBJECT ENCODING 返回的编码信息，就可以确定一个 Key 的存储结构。

接下来，看 `TTL、PTTL 两条命令`，它们的**返回值表示目标 Key 还有多长时间过期**，TTL 命令返回值的单位是秒，PTTL 返回值的单位是毫秒级，两者实现逻辑相同，都是先查找 redisDb->dict 确认目标 Key 存在，然后查找 redisDb->expires 获取过期时间。这里需要特别说明这两个命令的返回值：

-   -1 表示 Key 没有设置过期时间；
-   -2 表示 Key 已经失效了，可能是到期了，也可能是 Key 本身就不存在。

最后，来看 `EXISTS 命令`，它用于检查一个或多个 Key 是否存在。它底层也是通过 lookupKeyReadWithFlags() 函数去 redisDb->dict 中查找目标 Key，其中 flags 参数为 LOOKUP_NOTOUCH，也就是不会更新 lru 字段。

另外，一个与 EXISTS 命令类似的是 `TOUCH 命令`，它与 EXISTS 命令不同之处只有 flags 参数为 NULL，也就是会更新对应 Value 的 lru 值。

### 操作 Key 信息

在 Key 的元信息里面，只有超时时间是我们能够手动修改的，这里就涉及到 EXPIRE（或 EXPIREAT）、PERSIST 两条命令了。`EXPIRE` 是设置一个 Key 还有多少秒过期，`EXPIREAT` 命令是设置一个 Key 到某个具体的时间点过期，而 `PERSIST` 命令是将 Key 上的过期时间清除，让它变成一个永不过期的持久 Key。

先来看 EXPIRE、EXPIREAT 以及 PEXPIRE、PEXPIREAT 底层的实现，如下图所示，它们都是依赖 **expireGenericCommand() 函数**设置 Key 的过期时间。expireGenericCommand() 函数正常执行时候的核心实现，我们在前面[第 34 讲《内核解析篇：Redis Key 的过期与删除》](https://juejin.cn/book/7144917657089736743/section/7147529943709122600)介绍 Key 过期的章节中已经详细介绍过了，这里不再重复。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c30ec5cb34645bc893a7244c46dbd8e~tplv-k3u1fbpfcp-zoom-1.image)

这里关注一个异常情况，就是 EXPIRE 等命令指定的过期时间戳已经过期的场景，下面是 expireGenericCommand() 函数处理这种情况的分支：如果 when 时间戳已经过期了，这里会直接删除 key。

```c
void expireGenericCommand(client *c, long long basetime, int unit) {

    ...// 省略前面对命令的检查，以及对过期时间when的归一化，when经过归一化之后，都会

       // 变成毫秒级的时间戳

    if (checkAlreadyExpired(when)) { // when时间戳已经过期的分支

    ... // 省略其他非核心逻辑

    // 如果when时间戳已经过期了，这里会直接删除key

    int deleted = server.lazyfree_lazy_expire ? dbAsyncDelete(c->db,key) :

                                                dbSyncDelete(c->db,key);

    server.dirty++;

    // rewriteClientCommandVector()函数会把当前执行的EXPIRE命令，改写成DEL或者UNLINK

    // 命令

    rewriteClientCommandVector(c,2,aux,key);

    return;

} else { // when时间戳还未过期的处理分支

    setExpire(c,c->db,key,when); // 正常执行setExpire()函数

    ... // 省略其他非核心逻辑

    // 这里的rewriteClientCommandVector()函数，会把当前执行的EXPIRE命令，改写成

    // PEXPIREAT命令，同时，把超时时间改写成前面归一化好的when毫秒级时间戳

    // 这里的命令改写，其实就是修改client->argv中记录的命令和参数，感兴趣的小伙伴可以

    // 展开看看其中的实现

    rewriteClientCommandVector(c, 3, shared.pexpireat, key, when_obj);

    server.dirty++;

    return;

}
```

接下来看 PERSIST 命令，它的实现比较简单，它是先查找 redisDb->dict 确定目标 Key 是否存在，然后清理目标 Key 在 redisDb->expires 集合中的过期时间，这样 Key 就变成持久 Key 了。

说明白了过期时间的相关命令之后，我们再来看 Key 重命名的相关命令 RENAME、RENAMENX。在 Key 重命名的时候，如果新 Key 名称已经存在，`RENAME` 会直接进行覆盖，而 `RENAMENX` 命令会返回一个错误。

Key 重命名的逻辑位于 **renameGenericCommand() 函数**中，其中先会做一些前置检查，例如，新老两个 Key 是否相同、老 Key 是否存在、检查新 Key 是否存在等。如果新 Key 存在，RENAME 会先删除新 Key。之后，调用 dbAdd() 函数将新 Key 与原 Value 写入 db->dict 中，同时还会调用 setExpire() 将老 Key 的过期时间设置到新 Key 中。最后，删除掉老 Key。无论删除已存在的新 Key 还是老 Key，这里都会根据 lazy free 配置决定是否异步删除。

最后来看如何删除 Key，在前面介绍 Key 过期策略的时候，也提到了 **delCommand() 函数**，它是 `DEL 命令`和 `UNLINK 命令`的底层实现，其核心逻辑就是根据 lazy free 配置决定是异步删除还是同步删除，这里不再重复了。

### 扫描 Key

我们常见的扫库命令是 KEYS 命令和 SCAN 命令。

`KEYS 命令`可以指定一个 pattern 正则表达式来扫描符合条件的 Key，但是 KEYS 命令会一次性扫描整个 DB 中的全部 Key，如果 Key 的数量过大，就会阻塞主线程，导致整个 Redis 服务不可用。所以，**在实际生产环境中，禁止使用 KEYS 命令**。

KEYS 的底层实现原理大致如下：首先创建一个 dict 安全迭代器（safe Iterator），然后逐个迭代整个 redisDb->dict 中的 Key，如果碰到能够与指定正则表达式匹配的 Key，就通过 addReplyBulk() 添加到响应缓冲区中，最后由 IO 线程写回给客户端。

接下来，看 `SCAN 命令`。SCAN 命令采用增量式的扫描，每次执行 SCAN 命令时，Redis 只会返回少量符合条件的 Key，所以 SCAN 命令不会长时间阻塞 Redis 服务。除了 SCAN 命令之外，还有 SSCAN、HSCAN、ZSCAN 等类似的命令用来迭代，这些命令是用来扫描 Set、Hash、Zset 等集合中的元素，当遇到大集合时，也不会造成卡顿。

SCAN 命令以及 SSCAN、HSCAN、ZSCAN 命令对应的入口都是 **scanGenericCommand() 函数**，如下图所示，scanGenericCommand() 函数底层依赖前文介绍的 dictScan() 函数完成 Key 扫描的功能，调用栈如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa23fb474ffe4c00bfedf61f0146b489~tplv-k3u1fbpfcp-zoom-1.image)

下面我们来看 **scanGenericCommand() 函数**的核心步骤：

```c
void scanGenericCommand(client *c, robj *o, unsigned long cursor) {

    ... // 省略变量定义

    while (i < c->argc) {     // 1、解析命令参数

        j = c->argc - i;

        if (!strcasecmp(c->argv[i]->ptr, "count") && j >= 2) {

            if (getLongFromObjectOrReply(c, c->argv[i+1], &count, NULL)

                != C_OK) {

                goto cleanup;

            }



            if (count < 1) {

                addReplyErrorObject(c,shared.syntaxerr);

                goto cleanup;

            }



            i += 2;

        } else if (!strcasecmp(c->argv[i]->ptr, "match") && j >= 2) {

            pat = c->argv[i+1]->ptr;

            patlen = sdslen(pat);

            use_pattern = !(patlen == 1 && pat[0] == '*');



            i += 2;

        } else if (!strcasecmp(c->argv[i]->ptr, "type") && o == NULL && j >= 2) {

            typename = c->argv[i+1]->ptr;

            i+= 2;

        } else {

            addReplyErrorObject(c,shared.syntaxerr);

            goto cleanup;

        }

    }



    // 2、开始进入集合迭代的逻辑，scanGenericCommand()会根据迭代

    // 目标 redisObject 的 type 和 encoding 值，

    // 确定其底层使用的数据结构，然后针对不同的数据结构进行扫描

    ht = NULL;

    if (o == NULL) {

        ht = c->db->dict;

    } else if (o->type == OBJ_SET && o->encoding == OBJ_ENCODING_HT) {

        ht = o->ptr;

    } else if (o->type == OBJ_HASH && o->encoding == OBJ_ENCODING_HT) {

        ht = o->ptr;

        count *= 2; /* We return key / value for this type. */

    } else if (o->type == OBJ_ZSET && o->encoding == OBJ_ENCODING_SKIPLIST) {

        zset *zs = o->ptr;

        ht = zs->dict;

        count *= 2; /* We return key / value for this type. */

    }



    if (ht) { // 下面针对不同的集合，进入不同的分支进行迭代

        void *privdata[2];

        long maxiterations = count*10;

        privdata[0] = keys;

        privdata[1] = o;

        do {

            cursor = dictScan(ht, cursor, scanCallback, NULL, privdata);

        } while (cursor &&

              maxiterations-- &&

              listLength(keys) < (unsigned long)count);

    } else if (o->type == OBJ_SET) {

        int pos = 0;

        int64_t ll;

        while(intsetGet(o->ptr,pos++,&ll))

            listAddNodeTail(keys,createStringObjectFromLongLong(ll));

        cursor = 0;

    } else if (o->type == OBJ_HASH || o->type == OBJ_ZSET) {

        unsigned char *p = lpFirst(o->ptr);

        unsigned char *vstr;

        int64_t vlen;

        unsigned char intbuf[LP_INTBUF_SIZE];



        while(p) {

            vstr = lpGet(p,&vlen,intbuf);

            listAddNodeTail(keys, createStringObject((char*)vstr,vlen));

            p = lpNext(o->ptr,p);

        }

        cursor = 0;

    } else {

        serverPanic("Not handled encoding in SCAN.");

    }



    // 3、执行下面的过滤逻辑，过滤出符合条件的 Key，这些 Key 才是真正的返回值。

    node = listFirst(keys);

    while (node) {

        robj *kobj = listNodeValue(node);

        nextnode = listNextNode(node);

        int filter = 0;



        /* Filter element if it does not match the pattern. */

        if (use_pattern) {

            if (sdsEncodedObject(kobj)) {

                if (!stringmatchlen(pat, patlen, kobj->ptr, sdslen(kobj->ptr), 0))

                    filter = 1;

            } else {

                char buf[LONG_STR_SIZE];

                int len;



                serverAssert(kobj->encoding == OBJ_ENCODING_INT);

                len = ll2string(buf,sizeof(buf),(long)kobj->ptr);

                if (!stringmatchlen(pat, patlen, buf, len, 0)) filter = 1;

            }

        }



        /* Filter an element if it isn't the type we want. */

        if (!filter && o == NULL && typename){

            robj* typecheck = lookupKeyReadWithFlags(c->db, kobj, LOOKUP_NOTOUCH);

            char* type = getObjectTypeName(typecheck);

            if (strcasecmp((char*) typename, type)) filter = 1;

        }



        /* Filter element if it is an expired key. */

        if (!filter && o == NULL && expireIfNeeded(c->db, kobj, 0)) filter = 1;



        /* Remove the element and its associated value if needed. */

        if (filter) {

            decrRefCount(kobj);

            listDelNode(keys, node);

        }



        /* If this is a hash or a sorted set, we have a flat list of

         * key-value elements, so if this element was filtered, remove the

         * value, or skip it if it was not filtered: we only match keys. */

        if (o && (o->type == OBJ_ZSET || o->type == OBJ_HASH)) {

            node = nextnode;

            serverAssert(node); /* assertion for valgrind (avoid NPD) */

            nextnode = listNextNode(node);

            if (filter) {

                kobj = listNodeValue(node);

                decrRefCount(kobj);

                listDelNode(keys, node);

            }

        }

        node = nextnode;

    }



    // 4、构造返回值

    addReplyArrayLen(c, 2);

    addReplyBulkLongLong(c,cursor);



    addReplyArrayLen(c, listLength(keys));

    while ((node = listFirst(keys)) != NULL) {

        robj *kobj = listNodeValue(node);

        addReplyBulk(c, kobj);

        decrRefCount(kobj);

        listDelNode(keys, node);

    }



cleanup:

    listSetFreeMethod(keys,decrRefCountVoid);

    listRelease(keys);

}
```

1.  scanGenericCommand() 函数的第一步就是解析命令参数，主要是解析 count、match、type 三个参数。其中，count 参数指定了每次命令调用返回 Key 的数量上限，有点 SQL 语句中 limit 的感觉，但是这个 count 参数只是提示 Redis 应该返回多少条数据，不是严格控制；match 参数指定了 Key 的筛选条件，类似于 SQL 语句中的 where 条件；type 参数是在 Redis 6.0 引入的新参数，只能在 SCAN 命令中使用，用来过滤 Value 的类型，只有 Value 为指定 type 类型的 Key 才能返回，比如说`SCAN 0 TYPE zset` 这条命令，就只会返回 zset 类型键值对。

2.  初始化完参数之后，开始进入集合迭代的逻辑，scanGenericCommand() 会根据迭代目标 redisObject 的 type 和 encoding 值，确定其底层使用的数据结构，然后针对不同的数据结构进行扫描。主要分为两种情况：

    -   `扫描的目标集合底层数据结构为 listpack 或者 intset`，则一次性将整个集合的元素添加到一个变量名为 keys 列表中，等待第 3 步的过滤处理。正常情况下，Redis 只会在集合元素较少的情况下使用 listpack 或者 intset 这些数据结构，所以这里的一次性读取操作不会造成主线程长时间阻塞。

    -   `扫描的目标集合底层使用 dict 数据结构时`，我们会调用 dictScan() 函数扫描底层的 dict 集合。例如，我们使用 SSCAN 命令扫描一个 SET 集合中的元素，该 SET 编码方式为 OBJ_ENCODING_HT 时，底层存储数据的结构为 dict，就会通过 dictScan() 函数进行扫描，HSCAN 扫描哈希表、ZSCAN 扫描 ZSET 以及 SCAN 命令扫描整个 redisScan 也是类似的逻辑。


```c
do {

    cursor = dictScan(ht, cursor, scanCallback, NULL, privdata);

} while (cursor && // 迭代器是否迭代完了整个集合

      maxiterations-- && // 最大迭代次数是counter*10

      listLength(keys) < (unsigned long)count); // 是否查找到了足够的key
```

这里的 scanCallback 回调函数会将迭代到的 Key 添加到一个变量名为 keys 的列表中，等待第 3 步的过滤处理。dictScan() 具体实现在前面[第 22 讲《数据结构篇：Hash 迭代器实现思想》](https://juejin.cn/book/7144917657089736743/section/7147529570768551936)已经详细介绍过了，这里就不再重复了。

另外，这里还能看出 `count 为什么无法做到严格控制返回条数的原因`：因为 dictScan() 函数本身是按哈希桶进行扫描的，每个哈希桶中的键值对数据不确定，很难做到扫描几个桶恰好得到 count 个键值对，而且后续还有过滤条件进行过滤，进一步影响返回数量的偏差。

3.  把一定量的 Key 放到 keys 列表中之后，scanGenericCommand() 函数就要开始执执行下面的过滤逻辑，**过滤出符合条件的 Key，这些 Key 才是真正的返回值**。

    -   一个是根据 match 指定的规则过滤 Key 的值，不符合条件的 Key 会从 keys 列表中删除。
    -   如果是 SCAN 命令的话，会根据指定的 type 类型，对每个 Key 关联的 Value 进行过滤，这里会专门通过 lookupKeyReadWithFlags() 函数查询 Key 对应的 Value 值。只有 Value 是指定的 type，Key 才能通过过滤，继续保留在 keys 列表中，否则就会被删除。
    -   通过 expireIfNeeded() 检查 Key 是否已过期，如果已过期，也会从 keys 集合中删除。

4.  scanGenericCommand() 函数的最后一步，就是构造返回值，这里除了 keys 列表中的 Key 值返回，还会将 dictScan() 返回的 cursor 游标值返回给客户端，为下次扫描做准备。

除了上述介绍的常用命令之外，Key 相关的命令还有 COPY、DUMP、RANDOMKEY、SORT、WAIT 等等命令，这些命令在实践过程中并不是很常用，这里就不再展开一一分析了，感兴趣的同学可以[参考官方文档学习这些命令的具体使用方式](https://redis.io/commands/?group=generic)。

## 字符串命令

在前面的章节中，我们已经展开介绍了 Redis 字符串命令的使用，以及底层的 sds 结构和核心方法。这里我们来看一下 Redis 中这些字符串命令对应的处理逻辑是什么样的。

### 写入字符串

Redis 字符串常用的写入命令有三个：SET、SETNX、SETEX、PSETEX 四条命令，它们底层的实现都是 **setGenericCommand() 函数**，调用关系如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18c85e50f8e94c218bf5e8494ea6aeb3~tplv-k3u1fbpfcp-zoom-1.image)

setGenericCommand() 函数的核心逻辑如下。先来看它的第二个参数 flags，该参数用来记录 SET 参数的解析结果，其中可以设置以下标志位：OBJ_SET_NX、OBJ_SET_XX、OBJ_EX、OBJ_PX、OBJ_KEEPTTL、OBJ_SET_GET、OBJ_EXAT、OBJ_PXAT、OBJ_PERSIST。通过名称我们可以大致了解这些标志位的含义，比如 OBJ_SET_NX 标志位就表示在 Key 不存在的时候才能写入，也就是 SET...NX 命令或者 SETNX 命令，其他的标志位含义这里不再一一展开。

```c
void setGenericCommand(client *c, int flags, robj *key, robj *val, robj *expire, int unit, robj *ok_reply, robj *abort_reply) {

    long long milliseconds = 0; 

    int found = 0;

    int setkey_flags = 0;



    // 1、针对带了过期时间 SET 命令的处理

    if (expire && getExpireMillisecondsOrReply(c, expire, flags, unit, &milliseconds) != C_OK) {

        return;

    }



    if (flags & OBJ_SET_GET) { // 2、如果设置了 OBJ_SET_GET 标记位，也就是执行 SET_GET 命令，这里还会调用 getGenericCommand() 查找 Key 并将 value 返回给客户端。

        if (getGenericCommand(c) == C_ERR) return;

    }

    // 3、针对带有 NX 和 XX 的 SET 命令的处理，这里会调用 lookupKeyWrite() 来确定目标 Key 是否存在，再根据 NX 还是 XX 进行相应的处理

    found = (lookupKeyWrite(c->db,key) != NULL);



    ...//省略非关键代码

    // 4、处理完前面的这些标记之后，开始执行 setKey() 函数，完成键值对的写入。

    setKey(c,c->db,key,val,setkey_flags);

    ...//省略非关键代码

    if (expire) { // 5、写入 Key 的过期时间

        setExpire(c,c->db,key,milliseconds);

        // 6、命令改写

        robj *milliseconds_obj = createStringObjectFromLongLong(milliseconds);

        rewriteClientCommandVector(c, 5, shared.set, key, val, shared.pxat, milliseconds_obj);

        ...

    }

    ... // 6、省略对GET参数的改写

}
```

1.  首先是针对带了过期时间 SET 命令的处理，因为 EX、PX、EXAT、PXAT 这些参数指定的过期时间单位各不相同，这里会将它们归一化为毫秒时间戳。


2.  如果设置了 OBJ_SET_GET 标记位，也就是执行 SET_GET 命令，这里还会调用 getGenericCommand() 查找 Key 并将 value 返回给客户端。

3.  然后就是针对带有 NX 和 XX 的 SET 命令的处理，这里会调用 lookupKeyWrite() 来确定目标 Key 是否存在，再根据 NX 还是 XX 进行相应的处理。

4.  处理完前面的这些标记之后，开始执行 setKey() 函数，完成键值对的写入。

    -   如果 Key 不存在，调用 dbAdd() 函数将键值对写入到 db->dict 中。
    -   如果 Key 已存在，调用 dbOverwrite() 函数。其中在覆盖原 Value 值的同时，还会将原 Value 的 lru 值拷贝到新 Value 中。这个被覆盖的原 Value 值所占的内存，也需要被释放掉，具体使用异步方式还是同步方式进行回收，就要看 lazyfree-lazy-server-del 配置了。

     setKey() 函数完成键值对的写入之后，还会检查 flags 中是否设置了 OBJ_KEEPTTL 标志位，从而决定是否删除 Key 原来的过期时间。

5.  接下来就是写入 Key 的过期时间，这里会调用 setExpire() 函数，将步骤 1 中计算得到的过期时间写入到 redisDb->expires 中。
6.  在完成命令执行之后，这里会执行一次命令改写：一个是将 SETEX、PSETEX 命令改写成 SET...EX|PX 格式，另一个是将 SET 命令的 GET 参数删除掉。这主要是为了后续 AOF 日志和从库使用，后面还会详细介绍 AOF 日志的写入，小伙伴现在先知道有这个东西即可。

使用 SET 命令我们可以写入单个键值对，如果想一次写入多个键值对的话，我们可以使用 MSET 命令或 MSETNX 命令（有任意一个 Key 存在即失败），它们的实现位于 msetGenericCommand() 函数中，底层也是依赖 setKey() 完成键值对的写入，这里就不再重复了。

### 读取字符串

读取字符串的命令相对来说比较简单，都是**调用 lookupKeyReadOrReply() 函数从 DB 里面查数据**，然后根据命令带的参数进行相应的操作，最后再返回查询到的结果。下面的调用栈也说明了这一点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5453d691437a484e86526ff54da2b2db~tplv-k3u1fbpfcp-zoom-1.image)

通过这些 get*Command() 函数的名称，相信小伙伴也能够对标到对应的 Redis 命令，比如 getexCommand() 函数就是 GETEX 命令的处理逻辑，里面除了调用 lookupKeyReadOrReply() 函数查询键值对之外，还会调用 setExpires() 给 Key 设置过期时间。

其他的 get*Command() 函数也都是组合了前面我们已知的一些函数功能，这里就不再一一展开细说了。

### 修改字符串

修改字符串的命令我们重点介绍 APPEND、SETRANGE 以及 INCR 和 DECR 这些比较常用的命令。

**`APPEND 命令`可以向指定字符串的尾部追加新字符串**，其中首先通过 lookupKeyWriteWithFlags() 函数查找目标 Key，如果目标 Key 不存在，会直接通过 dbAdd() 函数写入新键值对；如果 Key 存在且 Value 是一个共享对象，或是使用了 OBJ_ENCODING_INT、OBJ_ENCODING_EMBSTR 等优化编码方式，这里会对其进行解码并创建一个全新的 redisObject 对象，这有一种 Copy-On-Write 的感觉，这部分逻辑位于 dbUnshareStringValue() 函数中：

```c
robj *dbUnshareStringValue(redisDb *db, robj *key, robj *o) {

    serverAssert(o->type == OBJ_STRING); // 检查value的类型

    if (o->refcount != 1 || o->encoding != OBJ_ENCODING_RAW) {

        // 对value进行解码，其中主要是将OBJ_ENCODING_INT编码格式的字符串

        // 转换成OBJ_ENCODING_RAW或OBJ_ENCODING_EMBSTR

        robj *decoded = getDecodedObject(o);

        // 将OBJ_ENCODING_EMBSTR编码方式转换成OBJ_ENCODING_RAW编码类型

        o = createRawStringObject(decoded->ptr, sdslen(decoded->ptr));

        decrRefCount(decoded);

        // 覆盖原value，这样即使原value处于共享模式，后续的修改操作也不会影响其他使用方

        dbOverwrite(db,key,o);

    }

    // 如果value未被共享，且编码方式为OBJ_ENCODING_RAW，则直接返回原value即可

    return o;

}
```

完成了 dbUnshareStringValue() 的处理之后，接下来就会在 Value 值的 robj->ptr 中追加命令提供的新字符串：

```c
o->ptr = sdscatlen(o->ptr,append->ptr,sdslen(append->ptr));
```

**`SETRANGE 命令`可以修改字符串中指定的子串**。如果 Key 不存在，则创建新字符串；如果 Key 存在，也是需要先经过 dbUnshareStringValue() 函数进行预处理，然后再修改指定的子串：

```c
// sdsgrowzero()函数会在offset++sdslen(value)超过原字符串长度的时候，对原字符

// 串进行扩容，扩容部分填充0

o->ptr = sdsgrowzero(o->ptr,offset+sdslen(value));

// 将指定子串修改后的value值拷贝到offset之后的位置

memcpy((char*)o->ptr+offset,value,sdslen(value));
```

`DECR、DECRBY、INCR、INCRBY 等是用于计算数字类型 Value 的命令`，它们底层实现都是 **incrDecrCommand() 函数**，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3b5e2f3c40f43b6a022a95b35e5659e~tplv-k3u1fbpfcp-zoom-1.image)

incrDecrCommand() 函数的核心逻辑如下：

```c
void incrDecrCommand(client *c, long long incr) {

    long long value, oldvalue;

    robj *o, *new;

    // 1、通过lookupKeyWrite()函数查找目标键值对

    o = lookupKeyWrite(c->db,c->argv[1]);

    ... // 省略非核心代码

    oldvalue = value;

    // 2、对此次增减的值进行边界检查，防止出现溢出的情况

    if ((incr < 0 && oldvalue < 0 && incr < (LLONG_MIN-oldvalue)) ||

        (incr > 0 && oldvalue > 0 && incr > (LLONG_MAX-oldvalue))) {

        addReplyError(c,"increment or decrement would overflow");

        return;

    }

    value += incr;

    // 3、检查表示 Value 的 redisObject 对象的编码类型，以及是否为共享对象

    if (o && o->refcount == 1 && o->encoding == OBJ_ENCODING_INT &&

        (value < 0 || value >= OBJ_SHARED_INTEGERS) &&

        value >= LONG_MIN && value <= LONG_MAX)

    {

        new = o;

        o->ptr = (void*)((long)value);

    } else {

        // 如果是共享状态，就需要创建新的 redisObject 对象来封装上面计算得到的新值，然后调用 dbOverwrite() 函数覆盖原 Value 值

        new = createStringObjectFromLongLongForValue(value);

        if (o) {

            dbOverwrite(c->db,c->argv[1],new);

        } else {

            dbAdd(c->db,c->argv[1],new);

        }

    }

    signalModifiedKey(c,c->db,c->argv[1]);

    notifyKeyspaceEvent(NOTIFY_STRING,"incrby",c->argv[1],c->db->id);

    server.dirty++;

    addReplyLongLong(c, value);

}
```

1.  先通过 lookupKeyWrite() 函数查找目标键值对，这里需要检查 Value 值是否为整数类型，只有整数类型才能执行 DECR、DECRBY、INCR、INCRBY 这些计算命令。

2.  然后，对此次增减的值进行边界检查，防止出现溢出的情况。检查完成之后，就可以计算增减后的新值了。
3.  最后，检查表示 Value 的 redisObject 对象的编码类型，以及是不是共享对象。如果是非共享的，而且新值也还能用一个指针的空间进行表示，那我们直接修改 robj 的 ptr 字段，来存储这个新值就可以了。
4.  如果是共享状态，就需要创建新的 redisObject 对象来封装上面计算得到的新值，然后调用 dbOverwrite() 函数覆盖原 Value 值。这样的话，就不会影响其他共享原 Value 的 Key。

这里需要说一下`整数缓存的一个优化点`。Redis 对 0 到 9999 的整数进行了缓存，小伙伴们可以在 server.h 文件里面，找到一个 sharedObjectsStruct 结构体，在它里面有一个叫 integers 的字段，是一个长度为 10000 的 redisObject 数组，用来缓存 0 到 9999 的数字，整个 Redis 里面，只要 Value 里面存了 0 ~ 9999 这个范围的整数，就会共享这里面的 redisObject 对象。这是不是和 Java 里面 Integer 里面的缓存有点类似呢？

我们回到 incrDecrCommand() 函数，如果新值能走整数缓存，也就是说还在 0 ~ 9999 这个范围内，就从整数缓存里面取相应的值，来替换旧值，无需单独创建新的 redisObject 对象来存这个整数。

## 总结

在这一节中，我们重点介绍了 Redis 中通用命令和字符串命令这两大类命令的具体实现。

-   在通用命令中，我们介绍了查看 Key 信息、操作 Key 的一些通用命令实现，比如 EXPIRE 命令过期一个 Key、DEL 命令和 UNLINK 命令删除一个 Key 等等，还介绍了 SCAN 命令的实现。
-   在字符串命令中，我们介绍了 SET 命令、GET 命令以及 APPEND、INCR 这些命令的核心实现。

下一节，我们将介绍 Hash 和 Set 两个结构的关键命令实现。