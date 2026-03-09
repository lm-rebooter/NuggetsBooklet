在上一节中，我们详细介绍了 dict 和 dictType 这两个与 Redis 哈希表紧密相关的结构体实现。

在这一节中，我们将紧接上一节的内容，展开介绍 **Redis 操作 dict 的核心方法**，主要包括创建 dict、向 dict 中添加数据、从 dict 中查找数据、修改 dict 中的数据以及删除数据，其中还会展开介绍 dict 的扩容和渐进式 rehash 的内容。

## 创建 dict

要使用 dict，第一步，就是创建一个 dict 实例，来看 `dictCreate() 函数`，它里面会调一下 malloc 函数，申请一个 dict 实例的空间，创建 dict 的事情就完成了。在 _dictInit() 这个函数中，会初始化 dict 实例里面各个字段的值，例如，dict->ht_table 中的两个 dictEntry 指针都会被初始化为 NULL，感兴趣的小伙伴可以展开看看这些字段的初始值到底是什么。

```c
dict *dictCreate(dictType *type)
{
    dict *d = zmalloc(sizeof(*d)); // 申请空间
    _dictInit(d,type);  // 初始化dict字段
    return d; 
}
```


## 添加数据

创建完 dict 实例之后，我们就要往其中添加数据了。往 dict 里面写键值对的方法是 dictAdd() 。和 Java 里面的 put 方法有个不一样的地方是，`dictAdd() 函数只负责添加键值对，遇到 key 相同的时候，不会进行覆盖`。


我们先看一眼 dictAdd() 函数的调用链，会发现其底层是依赖 dictAddRaw() 方法实现的。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f58fcaf4d5494844bc737f33303e4383~tplv-k3u1fbpfcp-watermark.image?)

dictAddRaw() 函数在不断向 dict 里面加数据的同时，会检查 dict 是否要触发扩容，这里我们先忽略 dictAddRaw() 函数里面的扩容逻辑，只关注写入数据的逻辑。dictAddRaw() 函数的核心代码如下：

```c
dictEntry *dictAddRaw(dict *d, void *key, dictEntry **existing) {
    long index;
    dictEntry *entry;
    int htidx;

    if (dictIsRehashing(d)) _dictRehashStep(d); // 扩容相关的操作，跳过

    // 计算写入的Key位于哪个槽位中
    if ((index = _dictKeyIndex(d, key, dictHashKey(d,key), existing)) == -1)
        return NULL;

    htidx = dictIsRehashing(d) ? 1 : 0;
    size_t metasize = dictMetadataSize(d);
    entry = zmalloc(sizeof(*entry) + metasize); // 创建新dictEntry
    if (metasize > 0) {
        memset(dictMetadata(entry), 0, metasize);
    }
    entry->next = d->ht_table[htidx][index];
    d->ht_table[htidx][index] = entry;
    d->ht_used[htidx]++;

    dictSetKey(d, entry, key);
    return entry;
}
```

dictAddRaw() 函数中第一个 if 分支，是扩容相关的操作，我们先暂时跳过。往下看，第二个 if 分支的判断条件中，dictHashKey 是个宏，它就用哈希函数算一下 Key 的哈希值。然后，这个 _dictKeyIndex 方法会找 key 要写入到哪个槽位。

我们可以点进去看一眼，具体实现如下，其中的 _dictExpandIfNeeded() 这个函数是扩容用的，跳过。然后就是在这两个 ht_table 里面搜索这个 Key。正常情况下，我们只用一个 ht_table，扩容的时候，才会用到两个 ht_table，所以在搜完第一个 ht_table 的时候，会检查当前是否处于扩容状态，如果不是扩容状态的话，就直接 break 了，不搜索第二个 ht_table 了。

```c
static long _dictKeyIndex(dict *d, const void *key, uint64_t hash, dictEntry **existing)
{
    unsigned long idx, table;
    dictEntry *he;
    if (existing) *existing = NULL;

    if (_dictExpandIfNeeded(d) == DICT_ERR) // 扩容相关，跳过
        return -1;
    for (table = 0; table <= 1; table++) { // 在ht_table中查找新写入的Key
        idx = hash & DICTHT_SIZE_MASK(d->ht_size_exp[table]);
        he = d->ht_table[table][idx];
        while(he) {
            if (key==he->key || dictCompareKeys(d, key, he->key)) {
                if (existing) *existing = he;
                return -1;
            }
            he = he->next;
        }
        if (!dictIsRehashing(d)) break; // 检查是否处于扩容状态，不是的话，直接结束搜索
    }
    return idx;
}
```


我们来看`这个 for 循环是怎么搜索 Key 的`。这里先拿 hash 值模一下数组长度，就知道槽位编号了，然后遍历这个槽位下面挂的链表，用这个 Key 的比较函数检查一遍，看看 Key 是不是已经存在了。要是已经存在了，就把 existing 指针指向这个已经存在的 dictEntry，外层调用方会检查 existing 这个输出函数，就知道这个 Key 对应的 dictEntry。还要注意一下，在 Key 存在场景下，_dictKeyIndex() 函数的返回值是 -1，没有返回槽位索引。


知道了 Key 在哪个槽位之后，我们回到 dictAddRaw() 函数继续看。dictAddRaw() 之后的逻辑，就是创建一个新的 dictEntry 对象，然后`头插法`插入到这个槽位里面，然后存储一下 Key 。这个 dictSetKey 宏其实是一个 if 判断，具体代码如下，如果存在 keyDup 函数，这里就会用 keyDup 函数拷贝 Key；没有这个函数的话，就存储原始 Key 。

```c
#define dictSetKey(d, entry, _key_) do { \ 
    if ((d)->type->keyDup) \  // 是否存在keyDup函数
        (entry)->key = (d)->type->keyDup((d), _key_); \
    else \
        (entry)->key = (_key_); \
} while(0)
```


新 dictEntry 实例插入完成之后，Key 也设置好了，是不是该设置 value 值了？

来，我们从调用栈向外一层，看一下 dictAddRaw() 函数的调用方，也就是 dictAdd() 方法。在 dictAddRaw() 返回新插入的 dictEntry 之后，dictAdd() 函数会通过 dictSetVal 宏来设置 dictEntry 的 v 字段。dictSetVal 这个宏和设置 Key 的 dictSetKey 宏逻辑类似，就是有 valDup 函数就存储拷贝的 value，没有就存储原始的 value。

```c
void dbAdd(redisDb *db, robj *key, robj *val) {
    sds copy = sdsdup(key->ptr); // 拷贝Key
    dictEntry *de = dictAddRaw(db->dict, copy, NULL); // 创建并插入新dictEntry
    dictSetVal(db->dict, de, val); // 
    signalKeyAsReady(db, key, val->type);
    if (server.cluster_enabled) slotToKeyAddEntry(de, db);
    notifyKeyspaceEvent(NOTIFY_NEW,"new",key,db->id);
}
```

## 扩容和渐进式 Rehash

说明白了插入的事情之后，我们就要来看扩容的事情了。这里先来解释一下上一小节留的一个坑：**ht_table 里面为什么要有两个哈希表？就是在扩容的时候用**。


举个例子，最开始的时候，我们只用 ht_table[0] 这个哈希表，读写只在这一个哈希表上面，数据写着写着，这个哈希表容量不够了，触发扩容了，这个时候就需要创建一个更大的哈希表，这个更大的哈希表就会存到 ht_table[1] 里面，然后把 ht_table[0] 里面的数据都迁移到这个 ht_table[1] 里面，扩容就完完成了。最后，再改一下指针，ht_table[0] 指向这个扩容后的哈希表，原来小的哈希表回收掉，ht_table[1] 重新改成 NULL，为下次扩容做准备。


下面我们就来分析一下 dict 的扩容实现，逻辑入口是 `dictExpand() 函数`。第一步是算一下扩容之后的数组长度，这里的 new_ht_size_exp 就是用于计算一个大于当前 size、且是最小的 2^n 的值。然后，开始申请内存，申请好了之后，用 ht_table[1] 这个指针指向这块内存。最后初始化里面的字段，这里需要注意，`rehashidx 的值设置成了 0`，后面我们会讲这个值有多么重要。

```c

int _dictExpand(dict *d, unsigned long size, int* malloc_failed){
    ... // 省略一些检查逻辑
    dictEntry **new_ht_table;
    unsigned long new_ht_used;
    // 用于计算扩容之后的数组长度
    signed char new_ht_size_exp = _dictNextExp(size);

    ... // 省略溢出、异常检查逻辑

    // 下面开始申请扩容之后的ht_table的内存空间
    if (malloc_failed) {
        new_ht_table = ztrycalloc(newsize*sizeof(dictEntry*));
        *malloc_failed = new_ht_table == NULL;
        if (*malloc_failed)
            return DICT_ERR;
    } else
        new_ht_table = zcalloc(newsize*sizeof(dictEntry*));

    new_ht_used = 0;

    // 初始化字段，其中rehashidx设置成0
    if (d->ht_table[0] == NULL) {
        d->ht_size_exp[0] = new_ht_size_exp;
        d->ht_used[0] = new_ht_used;
        d->ht_table[0] = new_ht_table;
        return DICT_OK;
    }

    d->ht_size_exp[1] = new_ht_size_exp;
    d->ht_used[1] = new_ht_used;
    d->ht_table[1] = new_ht_table;
    d->rehashidx = 0;
    return DICT_OK;
}
```


看到这里，_dictExpand() 方法就结束了，估计你很纳闷：还没迁移 ht_table 里面的数据呢，咋扩容就结束了呢？

下面我们就来说一下这个迁移过程和渐进式 rehash 的事情。

我们把一个 Key 从小 ht_table 迁移到大 ht_table 的时候，需要重新计算 hash 值，然后再找槽位、再插入，这个过程也叫 Rehash 操作。rehash 过程对一个 Key 来说还好，但要是 Key 非常多了，耗时就起来了，这就会阻塞 Redis 主线程。

为了防止把整个线程阻塞住，Redis 就没有一把完成全部 Key 的 rehash，而是在每次访问这个 dict 的时候，rehash 一部分 Key，这样的话，就把 rehash 的耗时摊到了多次请求里面，不会出现长时间的阻塞，只是每次请求的耗时都分摊一点点可控的耗时。这个方案也就是我们说的**渐进式 rehash**。

说明白了渐进式 rehash 出现的原因之后，我们再来看渐进式 rehash 的实现。不过需要先说明一点，增删改查 dict 中的数据，都会检查当前的 dict 是否处于 rehash 的状态，如果 dict 实例处于 rehash 状态，那就会进行一次渐进式 rehash 操作，迁移一部分 Key。看下面这个调用链就知道，渐进式 rehash 在增删改查的时候，都会被触发。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12974e0cb1cf40988d319902094617fa~tplv-k3u1fbpfcp-watermark.image?)


比如说，前面添加键值对的 dictAddRaw() 函数，里面第一个 if 判断条件就是 dictIsRehashing 来检查 dict 是否处于 rehash 状态。dictIsRehashing 这个宏就是检查 rehashidx 字段，前面扩完容之后，是不是把这个 rehashidx 值改成了 0 ，就是说要从 0 开始渐进式 rehash。要是 rehashidx 是 -1 ，就是 rehash 操作全部结束了。

我们接下来就详细看看渐进式 rehash 的具体实现，其具体实现是 **dictRehash() 函数**：

```c
int dictRehash(dict *d, int n) { // 
    int empty_visits = n*10; /* Max number of empty buckets to visit. */
    if (!dictIsRehashing(d)) return 0;

    while(n-- && d->ht_used[0] != 0) { // 步骤1.控制最多rehash多少槽位
        dictEntry *de, *nextde;
        // 步骤2.遇到多个空槽位就跳过
        while(d->ht_table[0][d->rehashidx] == NULL) {
            d->rehashidx++;
            if (--empty_visits == 0) return 1;
        }
        // 步骤3.碰到一个非空的槽位，遍历这个槽位下面的链表，进行rehash操作
        de = d->ht_table[0][d->rehashidx];
        while(de) {
            uint64_t h;
            nextde = de->next;
            h = dictHashKey(d, de->key) & DICTHT_SIZE_MASK(d->ht_size_exp[1]);
            de->next = d->ht_table[1][h];
            d->ht_table[1][h] = de;
            d->ht_used[0]--;
            d->ht_used[1]++;
            de = nextde;
        }
        d->ht_table[0][d->rehashidx] = NULL;
        d->rehashidx++;
    }

    // 步骤4.检查ht_table[0]里面的全部键值对是不是都迁移完了
    if (d->ht_used[0] == 0) {
        zfree(d->ht_table[0]);
        /* Copy the new ht onto the old one */
        d->ht_table[0] = d->ht_table[1];
        d->ht_used[0] = d->ht_used[1];
        d->ht_size_exp[0] = d->ht_size_exp[1];
        _dictReset(d, 1);
        d->rehashidx = -1;
        return 0;
    }
    return 1;
}
```


先说一下 dictRehash() 函数的第二个参数，也就是 n 这个参数，n 的意思是`一次渐进式 rehash 操作，最多能 rehash 多少个槽位`。每次访问 dict 时触发的渐进式 rehash 最多 rehash 一个槽位的数据。再就是 Redis 会定时触发 Redis DB 这个 dict 对象的 rehash，这个时候是一次 100 个槽位。


下面来看 **dictRehash() 函数的具体实现**。

1.  最外层的这个 while 循环，是来控制最多 rehash 多少槽位，每次循环 n 都减一。

<!---->

2.  再来看里面的这个 while 循环， rehashidx 指向的槽位是 NULL，就后移。这是为了跳过空的槽位，如果连续碰到 10 个空槽位，这次渐进式 rehash 操作就结束了。

<!---->

3.  但凡碰到一个非空的槽位，就要开始遍历这个槽位下面的链表，就是下面这个 whlie 循环。遍历的时候，对每一个 Key 进行 rehash，看 rehash 的具体操作：先重新计算 key 的 hash 值，然后确定它在 ht_table[1] 里面的槽位，然后头插法插入，同时还会把这个 Key 从 ht_table[0] 里面删掉。这样的话，这个 Key 就迁移好了。

<!---->

4.  完成上面这些 rehash 的 while 之后，就进最后的 if 分支，其中会检查 ht_table[0] 里面的全部键值对是不是都迁移完了。要是都迁移完了，我们就是把 ht_table[0] 指向这个迁移好的哈希表，ht_table[1] 的使命就结束了，会将其设置成 NULL。最后，最关键的一步，就是 rehashidx 设置成 `-1`，标志着整个 rehash 过程结束了，后面再增删改查的时候，就不用再渐进式 rehash 了。


说明白渐进式 rehash 之后，我们也就知道为啥 ht_table 数组的长度是 2 了。

简单总结一下：在没有发生扩容的时候，只有 ht_table[0] 正常使用，ht_table[1] 则指向 NULL；当发生扩容的时候，ht_table[1] 指向扩容后的大哈希表，每个请求都会尝试 rehash 一个槽中的 Key，或者 10 个空槽位。在 rehash 过程中，rehashidx 字段用于记录当前 rehash 的进度。


## 查找数据

说完渐进式 rehash 的逻辑之后，你可能会想，在 rehash 的过程中要是查找某个 Key，是从哪个 ht_table 里面查呢？不会是从两个 ht_table 都查一遍吧？没错，确实是这样！

我们来看查询逻辑的实现，`dictFind() 函数`的实现跟我们前面说的 dictAddRaw() 函数里面的查找方式类似：先走渐进式 rehash，然后计算 hash 值，在 ht_table[0] 里面找槽位，然后遍历槽位下面挂的链表，要是处于 rehash 的状态，就去 ht_table[1] 里面再找一遍。

```c
dictEntry *dictFind(dict *d, const void *key) {
    dictEntry *he;
    uint64_t h, idx, table;

    if (dictSize(d) == 0) return NULL; // 空dict直接返回
    if (dictIsRehashing(d)) _dictRehashStep(d); // 渐进式rehash
    h = dictHashKey(d, key);
    for (table = 0; table <= 1; table++) { // 分开从两个ht_table中查找
        idx = h & DICTHT_SIZE_MASK(d->ht_size_exp[table]);
        he = d->ht_table[table][idx];
        while(he) {
            if (key==he->key || dictCompareKeys(d, key, he->key))
                return he;
            he = he->next;
        }
        if (!dictIsRehashing(d)) return NULL; // 如果是rehash状态，会继续从ht_table[1]中查找
    }
    return NULL;
}
```


## 修改数据

我们前面说的 HSET 这些命令除了写入新 Key 之外，还有覆盖已有 Key 的功能。前面的 dictAdd()、dictAddRaw() 这些函数，都没有覆盖的功能，可能小伙伴们就把视线落到了 dictReplace() 函数上了，但是 HSET 命令底层不是走的 dictReplace() 函数，而是走的 dictFind 函数，它是**用 dictFind() 先把 dictEntry 拿到，然后直接修改里面的 v 字段就可以了**。


`dictReplace 这个函数其实没啥用`，感兴趣的小伙伴自己翻一下实现。


## 删除节点

最后到删除逻辑了，我们来看一下 `dictGenericDelete() 函数`，看一下它的调用链，是被 dictDelete() 和 dictUnlink() 函数调用了，这俩的区别在于：delete() 函数会直接释放 dictEntry 节点的内存空间，unlink() 函数会把 dictEntry 节点从 dict 中摘掉，然后返回。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/997ef15ee69c4ff997068003abd71f55~tplv-k3u1fbpfcp-watermark.image?)


来看 dictGenericDelete() 函数的实现：

```c
static dictEntry *dictGenericDelete(dict *d, const void *key, int nofree) {
    uint64_t h, idx;
    dictEntry *he, *prevHe;
    int table;

    if (dictSize(d) == 0) return NULL; // 空dict处理
    // 步骤1.检查dict是不是要渐进式rehash
    if (dictIsRehashing(d)) _dictRehashStep(d);
    // 步骤2.计算目标key的hash值 
    h = dictHashKey(d, key); 

    for (table = 0; table <= 1; table++) {
        // 步骤3.把hash值跟sizemask进行与运算，找到目标key所在的槽位
        idx = h & DICTHT_SIZE_MASK(d->ht_size_exp[table]);
        he = d->ht_table[table][idx];
        prevHe = NULL;
        while(he) { // 遍历槽位下的列表
            // 步骤4.把这个目标节点从链表中移除
            if (key==he->key || dictCompareKeys(d, key, he->key)) {
                if (prevHe)
                    prevHe->next = he->next;
                else
                    d->ht_table[table][idx] = he->next;
                if (!nofree) {
                    // 步骤5.根据 nofree 参数，决定是不是要释放 dictEntry 节点
                    dictFreeUnlinkedEntry(d, he);
                }
                d->ht_used[table]--;
                return he;
            }
            prevHe = he;
            he = he->next;
        }
        if (!dictIsRehashing(d)) break;
    }
    return NULL; /* not found */
}
```

这里我们简单梳理下其实现过程。

1.  上来先检查 dict 是不是要渐进式 rehash 一下，需要的话，就处理一个槽。

<!---->

2.  接下来进入删除的正题，先计算目标 key 的 hash 值。

<!---->

3.  然后把 hash 值跟 sizemask 进行与运算，找到目标 key 所在的槽位。遍历槽位中的链表，逐个比较 key，直到查找到目标节点。要是正处在渐进式 rehash 状态的话，两个 ht_table 都要扫。

<!---->

4.  找到之后，就把这个目标节点从链表中移除。

<!---->

5.  最后，根据 nofree 参数，决定是不是要释放 dictEntry 节点。

  


最后一个要说的地方是：在删除数据的时候，可能会造成哈希表的缩容，`缩容的逻辑和扩容的逻辑一模一样`，除了 ht_table[1] 分配的哈希表比原来的小，我就不多说了哈。

## 总结

在这一节中，我们重点分析了一下 dict 的核心函数实现。涉及到 dict 的增删改查四个操作，这些操作本身没啥难度，但是有很多细节需要注意，例如，对渐进式 rehash 的理解，更新 value 时的操作，以及删除时是否需要释放节点空间，等等。其中，**渐进式 rehash 的思想是 Redis 中非常重要的一个优化思想，是一个非常重要的知识点，希望小伙伴们着重分析体会**。


下一节，我们将重点来介绍一下 dict 迭代器的内容。