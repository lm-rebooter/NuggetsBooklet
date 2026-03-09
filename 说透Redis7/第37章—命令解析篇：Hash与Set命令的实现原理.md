在上一节中，我们详细分析了 Redis 里面**通用命令**和 **String 命令**在实现方面的一些注意点。这一节，我们接着来介绍一下 Hash 和 Set 两个`集合结构`相关命令的实现。

## 哈希表相关命令

`从实现的角度看`，我们这里把哈希表命令的关键点分成了**底层存储转换**、**添加键值对**、**读取键值对**和**删除键值对**`四个部分`。

### 底层存储转换

前面[第 26 讲《内核解析篇：Redis 核心结构体精讲》](https://juejin.cn/book/7144917657089736743/section/7147529654142763023)我们介绍 redisObject 结构体的时候提到，Redis 中的哈希表结构（type 为 OBJ_HASH）的底层存储结构有两种：一个是 dict（encoding 为 OBJ_ENCODING_HT），一个是 listpack（encoding 为 OBJ_ENCODING_LISTPACK）。

当同时满足“键值对数量小于 hash-max-ziplist-entries 配置值，且每个键值对中的 Field 和 Value 长度都小于 hash-max-ziplist-value 配置值”这两个条件的时候，使用 `listpack` 这个连续空间作为底层存储。随着键值对的插入和修改，在不满足上述两个条件的时候，Redis 会将哈希表底层存储结构换成 `dict` 结构。但是注意，在重新满足上述两个条件的时候，哈希表的底层存储结构不会退化成 listpack。

针对上述两个条件的检查以及底层结构转换的逻辑，在每次往哈希表写入数据的时候，都需要被执行一次，这一公共逻辑封装在 **hashTypeConvertListpack() 函数**中，其核心逻辑如下：

```c
void hashTypeConvertListpack(robj *o, int enc) {

    if (enc == OBJ_ENCODING_LISTPACK) {

        /* 空分支 */

    } else if (enc == OBJ_ENCODING_HT) { // 1、编码方式检查

        hashTypeIterator *hi;

        dict *dict;

        int ret;

        // 2、创建转换之后用来存储数据的 dict 实例，以及一个 hashTypeIterator 迭代器

        hi = hashTypeInitIterator(o);

        dict = dictCreate(&hashDictType);

        dictExpand(dict,hashTypeLength(o)); // 扩容dict，防止无意义的rehash



        // 3、使用 hashTypeIterator 迭代器迭代当前哈希表中的全部键值对，并添加到新创建的 dict 实例中

        while (hashTypeNext(hi) != C_ERR) {

            sds key, value;



            key = hashTypeCurrentObjectNewSds(hi,OBJ_HASH_KEY);

            value = hashTypeCurrentObjectNewSds(hi,OBJ_HASH_VALUE);

            ret = dictAdd(dict, key, value);

            if (ret != DICT_OK) {

                sdsfree(key); sdsfree(value); /* Needed for gcc ASAN */

                hashTypeReleaseIterator(hi);  /* Needed for gcc ASAN */

                serverLogHexDump(LL_WARNING,"listpack with dup elements dump",

                    o->ptr,lpBytes(o->ptr));

                serverPanic("Listpack corruption detected");

            }

        }

        hashTypeReleaseIterator(hi);

        // 4、将 listpack 释放掉，然后将 robj->ptr 指向新 dict 实例

        zfree(o->ptr);

        o->encoding = OBJ_ENCODING_HT;

        o->ptr = dict;

    } else {

        /* 空分支 */

    }

}
```

1.  首先，hashTypeConvertListpack() 函数进行编码方式检查。确保当前哈希表的编码方式为 OBJ_ENCODING_LISTPACK，转换的目标编码方式为 OBJ_ENCODING_HT。

2.  接下来，创建转换之后用来存储数据的 dict 实例，以及一个 hashTypeIterator 迭代器（这个迭代器的实现我们下面紧接着会展开讲解）。
3.  使用 hashTypeIterator 迭代器迭代当前哈希表中的全部键值对，并添加到新创建的 dict 实例中。
4.  robj->ptr 本来是指向 listpack 实例的，现在数据已经拷贝完了，我们可以安全地将 listpack 释放掉，然后将 robj->ptr 指向新 dict 实例。同时，还要将 robj 的编码方式，也就是 robj->encoding 字段，修改为 OBJ_ENCODING_HT。

**Redis 为了对上层屏蔽哈希表底层这里两种不同的存储结构，抽象出了一个统一的迭代器来迭代哈希表，也就是上面编码方式转换时使用到的 hashTypeIterator 迭代器**。hashTypeIterator 结构体的定义如下：

```c
typedef struct {

    robj *subject;  // 指向迭代的目标哈希表

    int encoding;   // 目标哈希表的编码方式

    unsigned char *fptr, *vptr;  // 在迭代listpack时，使用到的辅助指针

    dictIterator *di;  // 迭代dict时，使用到的dict迭代器

    dictEntry *de;     // 迭代dict时，迭代到的dictEntry实例

} hashTypeIterator;
```

我们看到 hashTypeIterator 迭代器的实现思路其实比较简单，listpack 和 dict 两种底层存储不能同时存在，那 hashTypeIterator 可以冗余两套字段，分别用来迭代 ziplist 和 dict。

下面来结合 hashTypeConvertListpack() 函数的实现，看一下 `hashTypeIterator 迭代器是如何工作的`。

要使用 hashTypeIterator 迭代器，首先要通过 hashTypeInitIterator() 函数创建一个 hashTypeIterator 迭代器的实例，它里面会根据目标哈希表的编码类型，决定初始化 fptr、vptr 字段来迭代 listpack，还是 di、de 字段来迭代 dict。

```c
hashTypeIterator *hashTypeInitIterator(robj *subject) {

    hashTypeIterator *hi = zmalloc(sizeof(hashTypeIterator)); // 创建hashTypeIterator实例

    hi->subject = subject;

    hi->encoding = subject->encoding;



    if (hi->encoding == OBJ_ENCODING_LISTPACK) { // 根据编码类型，初始化不同字段

        hi->fptr = NULL;

        hi->vptr = NULL;

    } else if (hi->encoding == OBJ_ENCODING_HT) {

        hi->di = dictGetIterator(subject->ptr);

    } else {

        serverPanic("Unknown hash encoding");

    }

    return hi;

}
```

创建好 hashTypeIterator 迭代器之后，我们就可以用 hashTypeNext() 函数负责推进 hashTypeIterator 迭代器进行迭代了。如果底层是 listpack 结构，每次 hashTypeNext() 调用，会执行两次 lpNext()，分别后移 fptr、vptr 指针，指向 listpack 中的两个元素，这两个元素分别就是哈希表中的 Key 和 Value。如果底层是 dict 结构，hashTypeNext() 函数就会调用 dictNext() 函数，推进 di 这个 dict 迭代器，并且会将迭代到的 dictEntry 记录到 hashTypeIterator 的 de 字段里面。

```c
int hashTypeNext(hashTypeIterator *hi) {

    if (hi->encoding == OBJ_ENCODING_LISTPACK) { // 底层是listpack结构

        unsigned char *zl;

        unsigned char *fptr, *vptr;



        zl = hi->subject->ptr;

        fptr = hi->fptr;

        vptr = hi->vptr;



        if (fptr == NULL) {

            fptr = lpFirst(zl); // 第一次迭代，初始化fptr指针

        } else {

            fptr = lpNext(zl, vptr); // 后移fptr指针，得到Key

        }

        if (fptr == NULL) return C_ERR;



        vptr = lpNext(zl, fptr); // 第二次后移fptr指针，得到value

        hi->fptr = fptr;

        hi->vptr = vptr;

    } else if (hi->encoding == OBJ_ENCODING_HT) { // 底层是 dict 结构

        if ((hi->de = dictNext(hi->di)) == NULL) return C_ERR;

    } else {

        serverPanic("Unknown hash encoding");

    }

    return C_OK;

}
```

每次 hashTypeNext() 函数推进之后，我们都可以使用 hashTypeCurrentFromListpack() 或者hashTypeCurrentFromHashTable() 函数，读取迭代到的键值对，这里就需要使用 hashTypeIterator 迭代器的上层根据 hashTypeIterator 迭代器的 encoding 字段判断一下。

最后用完 hashTypeIterator 迭代器之后，我们需要调用 hashTypeReleaseIterator() 函数释放 hashTypeIterator 迭代器所占的内存空间。

Redis 除了通过 hashTypeIterator 在迭代层面屏蔽了底层不同的存储结构，在读写键值对的时候，也有类似的操作来屏蔽底层不同的存储结构，这点我们在下面分析命令实现的过程中，也会进行说明。

### 添加键值对

我们可以使用 HSET、HMSET 以及 HSETNX 命令向哈希表中添加键值对，它们的核心逻辑基本相同，我们这里就以 HSET 命令为例，分析一下 hsetCommand() 函数的实现：

```c
void hsetCommand(client *c) {

    int i, created = 0;

    robj *o;

    ... // 省略参数检查逻辑



    // 1、从 DB 中查找目标哈希表，如果目标哈希表不存在，就会立刻创建一个表示哈希表的 redisObject 对象，然后添加到 DB 里面去

    if ((o = hashTypeLookupWriteOrCreate(c,c->argv[1])) == NULL) return;

    // 2、检查命令写入的键值对长度是否超过了 hash-max-ziplist-value 配置项指定的字节数，如果超过了，就需要执行上面说的存储转换逻辑，将底层存储结构从 listpack 转换成 dict

    hashTypeTryConversion(o,c->argv,2,c->argc-1);



    // 3、真正写入键值对数据

    for (i = 2; i < c->argc; i += 2)

        created += !hashTypeSet(o,c->argv[i]->ptr,c->argv[i+1]->ptr,HASH_SET_COPY);



    // 构造返回值

    char *cmdname = c->argv[0]->ptr;

    if (cmdname[1] == 's' || cmdname[1] == 'S') {

        /* HSET */

        addReplyLongLong(c, created);

    } else {

        /* HMSET */

        addReply(c, shared.ok);

    }

    signalModifiedKey(c,c->db,c->argv[1]);

    notifyKeyspaceEvent(NOTIFY_HASH,"hset",c->argv[1],c->db->id);

    server.dirty += (c->argc - 2)/2;

}
```

hsetCommand() 首先会执行 hashTypeLookupWriteOrCreate() 函数从 DB 中查找目标哈希表，如果目标哈希表不存在，就会立刻创建一个表示哈希表的 redisObject 对象，然后添加到 DB 里面去。

查找到哈希表之后，走 hashTypeTryConversion() 函数，检查命令写入的键值对长度是否超过了 hash-max-ziplist-value 配置项指定的字节数，如果超过了，就需要执行上面说的存储转换逻辑，将底层存储结构从 listpack 转换成 dict。

完成底层存储的检查和转换之后，就可以**执行 hashTypeSet() 函数真正写入键值对数据了**，这里还是根据底层存储结构不同，进入不同的处理分支。

-   如果底层是 listpack 结构，hashTypeSet() 会先通过 lpFind() 函数查询目标 Key，查询成功，那下一个元素就是这个 Key 相应的 Value 值，直接调用 lpReplace() 函数，用新 Value 值覆盖原来的 Value 值即可。如果查找失败，则调用两次 lpAppend() 函数，将 Key 和 Value 写入到 listpack 的队头即可。在写入完成之后，还会再检查一下 listpack 中元素的总个数是否超过了 hash-max-ziplist-entries 配置项，如果超过了，则将底层存储结构从 listpack 转换成 dict。


-   如果底层是 dict 结构，hashTypeSet() 会先通过 dictFind() 函数查找目标 Key，查找成功，则直接替换 dictEntry 中存储的 Value 值，查找失败则调用 dictAdd() 函数写入新键值对。

### 读取键值对

说完了写入键值对的实现之后，我们再来看从哈希表读取数据的命令。这里不止会涉及到 HGET、 HMGET 这类查询哈希表中的键值对数据的命令，还会说明 HEXISTS 以及 HSTRLEN 这类检查数据存在性质的命令。

这些命令的核心实现类似，**都是先从 redisDb 中查找目标哈希表，然后从哈希表中查找目标 Key**，只不过`返回的结果不太一样`，HEXISTS 命令是将有无这个 Key 的 true/false 值返回给客户端，HGET 和 HMGET 命令将查找到的 Value 返回给客户端，HSTRLEN 命令返回的则是 Value 的长度。

上述查找目标 Key 的逻辑，也是先判断底层存储结构，然后根据底层结构的不同，分别进入hashTypeGetFromListpack() 函数以及 hashTypeGetFromHashTable() 函数中，调用栈如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f62b6b5d8cca4df5886fdc15c339422d~tplv-k3u1fbpfcp-zoom-1.image)

HGETALL、HKEYS、HVALS 这三条命令，虽然也是获取键值对数据，但是和 HGET 命令不太一样，它们是获取哈希表中`全部的键值对`，底层依赖的是 genericHgetallCommand() 函数实现的，调用栈如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b94c7caa5e64b2db84d516468ddf501~tplv-k3u1fbpfcp-zoom-1.image)

genericHgetallCommand() 函数在从 redisDb 里面查到目标哈希表之后，会使用 hashTypeIterator 迭代器，迭代哈希表中的全部键值对数据，然后根据命令的要求返回。

最后，还剩一个 HSCAN 命令，在上一讲介绍 SCAN 命令的时候，已经详细分析了它们底层依赖的 scanGenericCommand() 函数，这里就不再重复了。

### 删除键值对

哈希表相关命令里面最后一个要介绍的是 HDEL 命令，它是从哈希表中删除指定的 Key，具体实现在 hashTypeDelete() 函数中，它的核心也是根据底层存储结构进行分类处理。

-   当底层存储为 listpack 时，先用 lpFind() 函数在 listpack 中查找键值对的位置，然后调用 lpDeleteRangeWithEntry() 函数删除两个 listpack 元素，也就是 Key 和 Value 的内容；

-   当底层存储为 dict 时，先调用 dictDelete() 函数从 dict 中删除键值对，然后检查 dict 是否需要缩容，如果需要，就执行 dictResize() 函数进行缩容。

在删除哈希表的最后一个键值对之后，HDEL 命令会将整个哈希表从 redisDb 中删除。

到此为止，哈希表相关命令的实现就介绍完了。下面我们就要开始来看 Set 相关命令的实现。

## Set 相关命令

`从实现的角度看`，我们这里把 Set 命令的关键点分成`两个部分`，一部分是 SADD、SREM、SPOP 这类**元素读写**操作，另一部分是 SDIFF、SUNION 这类**集合运算类型**的操作。

### 元素读写命令

`SADD 命令`是我们最常用的命令之一，它用来向 Set 集合中添加一个或多个元素，对应的处理函数是 **saddCommand()** 。

```c
void saddCommand(client *c) {

    robj *set;

    int j, added = 0;

    // 1、从 redisDb 里面查找目标 Set

    set = lookupKeyWrite(c->db,c->argv[1]);

    if (checkType(c,set,OBJ_SET)) return;

    

    if (set == NULL) {

        // 2、如果目标 Set 不存在，就要进行创建相应的 redisObject 对象，这里会根据写入 Set 的第一个值，决定 Set 的初始底层结构

        set = setTypeCreate(c->argv[2]->ptr);

        dbAdd(c->db,c->argv[1],set);

    }



    for (j = 2; j < c->argc; j++) { // 3、写入数据

        if (setTypeAdd(set,c->argv[j]->ptr)) added++;

    }

    if (added) {

        signalModifiedKey(c,c->db,c->argv[1]);

        notifyKeyspaceEvent(NOTIFY_SET,"sadd",c->argv[1],c->db->id);

    }

    server.dirty += added;

    addReplyLongLong(c,added);

}
```

它首先通过 lookupKeyWrite() 函数从 redisDb 里面查找目标 Set，如果目标 Set 不存在，就要进行创建相应的 redisObject 对象，这里会根据写入 Set 的第一个值，决定 Set 的初始底层结构。如果第一个参数能转换为整数，那么底层结构就用 intset。否则，底层存储结构为 dict。创建完之后，saddCommand() 会调用 dbAdd() 函数将新建的 Set 对象记录到 redisDb->dict 中。

接下来，遍历 SADD 命令的全部参数，对每个参数调用 **setTypeAdd() 函数**，将它们写入到 Set 集合中。下图展示了 setTypeAdd() 函数的关键分支：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9eeedc037a314ff9952f1d84c7614598~tplv-k3u1fbpfcp-watermark.image?)

这里展开说明一下上图中每个分支的逻辑。

-   如果 Set 集合底层结构是 dict，就直接调用 dictAddRaw() 函数将 Key 写入到底层的数据结构中。注意，这个时候，Set 底层使用的 dictType 是 setDictType 类型，其中的 keyDup 字段为 NULL，没有自动拷贝 Key 的功能，所以这里需要对新元素额外拷贝一份，而不是使用 argv 数组里面的命令参数。所以这个分支才会有下面这段代码：

```c
dictEntry *de = dictAddRaw(ht,value,NULL); // 查找value对应的dictEntry

if (de) {

    dictSetKey(ht,de,sdsdup(value)); // 将新元素值拷贝出一份新的sds实例，写入dict

    dictSetVal(ht,de,NULL);

    return 1;

}
```

-   如果 Set 集合底层数据结构为 intset，但新元素不能转换成整数，就需要调用 setTypeConvert() 函数，将 Set 底层的数据结构转换为 dict，在这个函数里面，会先创建一个大小与当前 intset 大小一致的 dict，之所以要大小一致，主要是为了避免在转换的过程中发生扩容。然后，遍历一下 intset，把里面全部元素转成字符串，写入到新建 dict 中。最后，将 Set 的 encoding 切换成 OBJ_ENCODING_HT，也就完成了 Set 底层结构的转换。

-   如果 Set 集合底层数据结构为 intset，而且新元素也能够转换整数，那就直接调用 intsetAdd() 函数，把新元素写入到底层的 intset。写入完成之后，setTypeAdd() 需要检查当前 Set 中的元素个数，是不是超过了 set-max-intset-entries 配置值，如果超过了，就需要触发 setTypeConvert() 函数，将底层结构切换成 dict。

介绍完 SADD 命令向 Set 集合添加新元素的底层逻辑之后，我们再来看一下`从 Set 集合中删除元素的 SREM 命令`。SREM 命令的核心逻辑位于 **sremCommand() 函数**中，它里面会根据 Set 集合底层结构，分别调用 dictDelete() 函数或 intsetRemove() 函数，从 dict 或 intset 中删除元素。注意，如果是从 dict 中删除元素，即使剩余的元素都是整数，也不会触发从 dict 到 intset 的切换。另外，当 Set 集合的最后一个元素被删掉的时候，还会额外触发 dbDelete() 函数，将 Set 集合从 redisDb 中删除。

接下来是读取 Set 的命令。首先是 `SPOP 命令`，该命令先会通过 setTypeRandomElement() 函数从 Set 集合中随机弹出一个元素。需要注意一点，如果 Set 的底层结构是 dict 的话，会有两处随机，第一次是先随机到槽位，第二次是从这个槽位里面随机选择一个元素。通过随机方式找到弹出的元素之后，就会将该元素从 Set 集合中删除，删除的逻辑基本与 SREM 命令类似，这里不再重复。

`SRANDMEMBER 命令`与 SPOP 命令的逻辑基本一致，唯一的区别是它不会将随机得到的元素从 Set 集合中删除。

`SISMEMBER` 和 `SMISMEMBER` 命令可以用来检查 Set 集合是否包含指定的元素，其中也是根据 Set 底层数据结构，调用 dictFind() 函数或 intsetFind() 函数从底层的 dict 或是 intset 中查找指定元素，然后返回给客户端。

最后，一个要说的命令是 `SCARD 命令`，它用于获取 Set 集合中的元素个数，其逻辑是根据数据结构的不同，分别统计 dict 或 intset 中存储的元素个数。

通过对 Set 中元素读写命令的介绍我们可以看出，**这些基础命令底层的核心就是根据底层结构，调用 dict 或者 intset 现成的 API 来完成指定的功能**。

### 集合运算命令

Redis 除了为 Set 结构提供了上述元素读写命令之外，还提供了一些集合运算命令，主要涉及到集合的并集、差集、交集三种运算。这些命令的具体使用，我们已经在模块一详细介绍过了，这里就不再重复了。

下面我们重点来看它们的实现逻辑。

先来看 SDIFF、SDIFFSTORE、SUNION、SUNIONSTORE 四条命令，如下图的调用栈所示，它们底层都是依赖 **sunionDiffGenericCommand() 函数**实现的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dcb1fcb31fd4699b420638fdb61b717~tplv-k3u1fbpfcp-zoom-1.image)

sunionDiffGenericCommand() 函数的参数含义如下：

```c
void sunionDiffGenericCommand(client *c,  // 发送命令的client

    robj **setkeys, // 参与运算的Set集合的Key

    int setnum,     // 参与运算的集合个数

    robj *dstkey,   // 存储运算结果的集合Key，SDIFF、SUNION命令中该参数为NULL

    int op          // 可选值为SET_OP_DIFF、SET_OP_UNION，分别对应差集运算和并集运算

)
```

sunionDiffGenericCommand() 函数处理并集运算的方式比较简单：它先创建一个临时 Set 集合用来存储 union 的最终结果，然后迭代参与运算的全部 Set 集合（也就是 setkeys 参数指定这些集合），把这些 Set 里面的全部元素添加到临时集合中。迭代一个 Set 集合的时候，使用到了 setTypeIterator 迭代器，它的设计思路、使用方式与前文介绍的 hashTypeIterator 迭代器几乎一模一样，这里就不再赘述了，感兴趣的小伙伴可以参考 hashTypeIterator 迭代器的讲解来分析一下相关源码。这里写入临时集合时，使用的是 setTypeAdd() 函数，其底层实现前面刚刚介绍过了，不再重复。

填充好 union 的结果集之后，sunionDiffGenericCommand() 会来看 distkey 参数，如果它是 NULL，就会把整个 union 的结果集直接返回给客户端。如果它不是 NULL，那调用的就是 SUNIONSTORE 命令，这里会把 union 结果集作为 Value、dstset 参数值作为 Key，存储到 redisDb 之中。

sunionDiffGenericCommand() 函数处理差集运算时给出了两种算法，下面我们通过一个例子来简单说明一下这两种算法的核心逻辑，现在假设有 A1 这个 Set 要与 A2...An 这 N 个 Set 做差集。

-   算法 1 是把 A1 集合中所有元素逐个在 A2...An 集合进行查找，将查找不到的元素记录到结果集中。该算法的时间复杂度为 O(N*M)，N 是 A1 集合中的元素个数，M 是参与运算的集合个数。

-   算法 2 是先将 A1 集合中的全部元素加入结果集中，然后再将 A2…An 集合中的所有元素在结果集中进行查找，将查找到的元素从结果集中删除。该算法的时间复杂度为 O(n)，n 为参与运算集合中的元素总数。

sunionDiffGenericCommand() 函数在执行差集运算时，会在上述两种算法中进行选择，选择标准就是根据当前参与运算的 Set 集合大小，计算一下两种算法的时间复杂度，然后**选择时间复杂度较小的算法**。这部分逻辑的相关代码片段如下：

```c
if (op == SET_OP_DIFF && sets[0]) {

    long long algo_one_work = 0, algo_two_work = 0; // 记录两种算法的时间复杂度

    for (j = 0; j < setnum; j++) {

        if (sets[j] == NULL) continue;

        algo_one_work += setTypeSize(sets[0]); // A1元素个数*集合个数

        algo_two_work += setTypeSize(sets[j]); // 所有集合大小累加

    }



    algo_one_work /= 2; // 一般情况下，算法1的效果会更好，这里会倾向选择算法1

    diff_algo = (algo_one_work <= algo_two_work) ? 1 : 2;



    if (diff_algo == 1 && setnum > 1) {

        // 如果选择算法1，这里会按照集合大小对A2...An的集合进行降序排序

        qsort(sets+1,setnum-1,sizeof(robj*), 

            qsortCompareSetsByRevCardinality);

    }

}
```

选完算法之后，我们可以在 sunionDiffGenericCommand() 函数中，看到针对差集运算的两个不同算法的分支，代码片段如下所示，算法 1 和算法 2 的具体代码实现都比较简单，这里就不再展示出来了。

```c
if (op == SET_OP_DIFF && sets[0] && diff_algo == 1) {...}

else if (op == SET_OP_DIFF && sets[0] && diff_algo == 2) {...}
```

最后，我们来看`  Set 交集运算 `，也就是 SINTER、SINTERSTORE 两条命令的实现。它们底层依赖**sinterGenericCommand() 函数**实现，这个函数会先将参与运算的 Set 集合，按照集合大小进行升序排列，然后迭代最小 Set 集合中的所有元素，依次判断这些元素是否存在于剩余集合中。如果该元素存在于剩余的全部集合中，就把这个元素存储到结果集合中；如果有任意一个集合没有包含这个元素，那么这个元素就不属于交集的一部分，也就不会被放入到结果集合中。

分析到这里，sinterGenericCommand() 函数的具体代码相信大家能够独立分析清楚，这里就不再展开细说了，但是其中涉及到的`几个优化点`需要说明。

-   第一个是 sinterGenericCommand() 函数会先校验全部参与运算的 Set 集合是否存在或是否有空集合，因为任何集合与空集合的交集都是空集合，可以提前结束交集运算。

-   第二个是之所以遍历最小 Set 集合中的元素，是因为交集运算的结果集不会大于任何参与运算的 Set 集合，所以遍历最小 Set 集合中的元素，然后用这些元素进行比较是效率最高的。
-   第三是在迭代各个集合的时候，会先判断集合底层数据结构与元素是否匹配。例如，某个 Set 集合底层数据结构为 intset，说明其中元素都是整数，如果需要检查一个字符串值是不是在这个 Set 集合中，我们就直接判定它不存在。

最后一个要介绍的是 SMEMBERS 命令，该命令底层也是依赖 sinterGenericCommand() 函数实现的，实际上也是进行了一个交集运算，只是参与运算的只有一个 Set 集合，那结果集就是这个 Set 集合本身，也就可以直接将这个 Set 集合返回给客户端了。

## 总结

在这一节中，我们重点介绍了 Redis 中的 Hash 命令和 Set 命令这两大类命令的具体实现。

-   在 Hash 命令中，我们重点分析了 Hash 底层存储结构的转换逻辑以及增、删、查键值对的核心逻辑。
-   在 Set 命令中，我们重点讲解了元素读写的实现，以及集合运算的实现。

下一节，我们将继续介绍 List 以及相关阻塞命令的实现。
