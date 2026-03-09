在前面第 8 讲[《 实战应用篇：Hash 命令详解与实战（上）》](https://juejin.cn/book/7144917657089736743/section/7147528669831905315)中我们已经讲解了哈希表的结构，就如下图所示，这个 HashMap 有 8 个槽位，每个槽位下面挂一个链表。我们这一节就来看看 Redis 里面哈希表是怎么实现的。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df20f98bba79481fb521c5b4715b8ff8~tplv-k3u1fbpfcp-watermark.image?)

在 Redis 里面，Hash 表底层依赖的数据结构其实有`两种`：第一种是前面介绍的 ziplist，Redis 7.0 之后呢，就是 listpack，总之就是一块连续的内存空间；另一种是我们今天这一节要介绍的 dict 结构，它就是哈希表的结构。


在后面介绍 redisObject 对象的时候，我们还会展开说明哈希表底层什么时候用 listpack、什么时候用 dict，现在你只需要知道：**哈希表底层数据少、键值对都比较短的时候用 listpack 存，数据量大了之后就用 dict 存**。


## dict & dictEntry

在 Redis 里面，哈希表对应的是 dict 这个结构体，你看其他 Redis 文章的时候，说到的字典结构，其实就是这个结构体。

我们打开 dict.h 这个头文件，找到字典这个结构体的定义，如下所示：

```c
struct dict {
    ... ... 
    // 真正存储数据的地方，里面有两个哈希表
    dictEntry **ht_table[2];
    ... ...
};
```

这里面最关键的就是 `ht_table` 这个数组，这个数组里面放了两个 dictEntry 的二级指针，二级指针在前面第 3 讲[《先导基础篇：10 分钟 C 语言入门》](https://juejin.cn/book/7144917657089736743/section/7147527076092837888)也说过，是指向指针的指针。

如下图，这两个二级指针，分别指向了一个哈希表或者说是哈希 table。再展开看每个哈希 table 的结构，这个二级指针实际上指向的是一个 dictEntry 指针的数组，就是图中绿底的数组，里面每个元素都是 dictEntry 指针；然后这些 dictEntry 指针，指向了一个 dictEntry 列表，就是图中紫色底的列表。我用虚线框出来的这个部分，与上文介绍的哈希表结构非常类似了。（至于为什么 ht_table 里面要放两个 dicEntry** 二级指针，然后指向两个不同的哈希 table，我们后面会展开说。）


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d258c1c83ca4834a8f8efc96cacf9c4~tplv-k3u1fbpfcp-watermark.image?)


我们先来看看 ` dictEntry  `这个结构体，如下所示，它表示的是字典中的一个节点。

```c
typedef struct dictEntry {
    void *key; // 键值对中的Key，实际上指向一个sds实例
    union { // 用来存储键值对中的value值，因为是一个union，所以下面四个字段
            // 同时只会有一个有值
        void *val;     // 当value是一个非数字类型的值时，使用该指针
        uint64_t u64; // 当value值是一个无符号整数时，使用u64字段进行存储
        int64_t s64;  // 当value值是一个有符号整数时，使用s64字段进行存储
        double d;     // 当value值是一个浮点数时，使用d字段进行存储
    } v;
    struct dictEntry *next; // 指向下一个节点的指针
    void *metadata[];  // 额外的空间，这个跟Redis Cluster相关，后面再说
} dictEntry;
```

  


我们解释下这其中的各个字段的含义。

-   key 指针存储的是键值对中的 Key，其实就是指向了一个 sds 实例。

<!---->

-   v 字段表示的是键值对的 Value 值，它有点特殊，是一个 union，也就是联合体。联合体里面有 4 个字段，但是只有一个字段能有值。如果 Value 值是一个非数字的类型，就用 val 这个指针来存；如果 Value 是一个数字，还要分成无符号、有符号和浮点数三种情况，对应地就是用 u64、s64、d 三个字段存。

<!---->

-   next 字段是指向下一个节点的指针。每个哈希槽里面存储的都是一个链表，每个链表节点都是通过这个 next 指针连接下一个节点的。

<!---->

-   至于 metadata 字段，是和 Redis Cluster 相关的一个优化，这里先不展开说，柔性数组，也不占空间。



分析完 dictEntry 结构体的事情之后，我们再继续回来看 `dict 结构体`：

```c
struct dict {
    // 当前dict实例使用的一些特殊函数集合，通过这些函数可以改变当前dict的行为
    dictType *type;
    // 真正存储数据的hashtable，其中一个是在rehash的时候使用，实现渐进式的rehash
    dictEntry **ht_table[2];
    // 每个哈希table里面存了多少个元素
    unsigned long ht_used[2];
    // 渐进式rehash现在处理的哈希槽索引值
    long rehashidx; 
    // 用来暂停渐进式rehash的开关
    int16_t pauserehash;
    // 记录两个哈希table的长度，实际是是记录2的n次方中的 n 这个值
    signed char ht_size_exp[2]; 
};
```

ht_table 这个数组里面记录了两个哈希 table 里面存了多少个元素，然后 ht_size_exp 里面存了两个哈希 table 中数组的长度，也就是哈希槽的个数，读过 HashMap 的小伙伴应该知道，这个数组每次扩容都是两倍两倍地扩，这里也是一样，所以 ht_size_exp 里面记的实际上就是 2 的 n 次方里面的这个 n。

rehashidx 字段是一个指向哈希槽的下标值，这个在后面讲解`渐进式 rehash` 的时候，会看到这个字段的用处。pauserehash 字段是类似锁的功能，锁重入一次，pauserehash 就会加一次 1；锁退出一次，就减一次 1。那这个字段用来锁什么的呢？是用来锁渐进式 rehash，锁上了，渐进式 rehash 就停了，这个后面说哈，大概知道是干啥的就行了。


好了，dict 结构体的核心部分我们就说完了，你应该都懂了吧，不懂的地方，评论区说一下哈。


## dictType

dict 结构体里面还有一个 type 指针，它指向了一个 dictType 对象。看名字就知道，它表示的就是 dict 的类型。看到这里，估计你会很纳闷：哈希表还有类型？

所以，我们就一起来看下 dictType 到底是个什么东西。

### 1. dictType 定义解析

首先，来看 dictType 这个结构体，这里面就是**一批函数指针的集合，这些指针指向的函数决定了 dict 实例的一些关键行为**。dictType 结构体的定义如下：

```c
typedef struct dictType {
    // hashFunction函数用来计算key的hash值
    uint64_t (*hashFunction)(const void *key);
    // keyDup和valDup分别负责对key和value进行复制
    void *(*keyDup)(dict *d, const void *key);
    void *(*valDup)(dict *d, const void *obj);
    // 用来比较两个key是否相同
    int (*keyCompare)(dict *d, const void *key1, const void *key2);
    // keyDestructor和valDestructor分别负责销毁key和value 
    void (*keyDestructor)(dict *d, void *key);
    void (*valDestructor)(dict *d, void *obj);
    // 用来检查当前dict是否需要扩容 
    int (*expandAllowed)(size_t moreMem, double usedRatio);
    // 用来计算metadata那个柔性数组的长度，用来检查
    size_t (*dictEntryMetadataBytes)(dict *d);
} dictType;
```


可以看到：hashFunction 指向的这个函数是用来计算 key 的 hash 值；然后下面这两个函数，结尾都是 Dup（其实就是 Duplicate 的缩写）。有的时候，往一个 dict 里面存一个 Value 的时候，是希望这个 Value 值被独占的，也就是别的地方修改了 Value 值，但是不会影响已经写入到 dict 里的 Value，这个时候怎么办呢？是不是就需要在存 Value 的时候，**深拷贝**一份就行了？这样两个 Value 就是不同的对象了。这个时候就要用 valDup 这个函数来进行深拷贝了，keyDup 也是一样的功能。


写入的时候深拷贝了，那再释放的时候，就需要把这些拷贝出来的内存释放掉。这就需要用后面的 keyDestructor 和 valDestructor 两个函数，一个用来释放 Key，一个用来释放 Value 值。

至于 keyCompare 函数，就和我们 Java 里面 Comparator 接口类似，用来比较两个 Key 是否相等；expandAllowed 函数则是用来检查这个哈希表能不能扩容。


### 2. dictType 核心实现分析

dictType 这种定义一堆函数指针的方式，有点像 Java 里面的接口，这些函数指针类似于接口中的方法签名。我们来看 server.c 这个文件，里面搜 dictType，可以看非常多的 dictType 实现，如下图：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88c39bf82bfb4c5098a6f9fb1d0c2be7~tplv-k3u1fbpfcp-watermark.image?)

这里我们选取 dbDictType、hashDictType 和 setDictType 这三个`比较典型、比较重点`的实现进行分析。

**dictType 的第一个典型实现是：dbDictType**。Redis 本身是一个 KV 数据库，其实 Redis DB 也就是一个大的哈希表，只不过 Value 可能是 String、List、哈希表这种复杂结构而已。没错，dbDictType 就是 Redis 存全部键值对的哈希表使用的 dictType 实现：

```c
dictType dbDictType = { 
    dictSdsHash,   // dictSdsHash函数底层就是使用siphash算法 
    NULL,   // keyDup和valDup两个指针为NULL，表示不会对键值对进行复制 
    NULL,  
    dictSdsKeyCompare, // key按照字符串方式进行比较 
    dictSdsDestructor, // key按照字符串方式进行销毁 
    // Redis中每个value值都是robj类型，所以value按照robj类型进行销毁 
    dictObjectDestructor,  
    dictExpandAllowed // 通过dictExpandAllowed函数决定是否扩容 
}; 
```

先看 dictSdsHash 这个哈希函数，名字就告诉我们了，它是给 sds 算 hash 值的。我们看一下调用链，如下图能看到它底层使用的是 siphash 这个哈希算法。哈希算法一般是朝着两个方向发展，一个是提高哈希速度，一个是减少碰撞次数。siphash 这个算法比较有意思，它主要是来解决哈希洪水攻击这种安全问题的，计算 hash 值的速度以及 hash 碰撞次数也都比较优秀，现在也被很多语言内置。


> 想深挖哈希洪水攻击和 siphash 算法的小伙伴，可以看[这篇文章](<https://www.zhihu.com/question/286529973>)入个门，这篇文章里面还说从攻击角度来看，Java 里面哈希桶超过 8 个元素就转成平衡树的一些思考，挺有意思的。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/291a9dad1d714d6ca1afa1aacb965496~tplv-k3u1fbpfcp-watermark.image?)

我们回到 dbDictType 这个实现继续看，它里面的 keyDup 和 valDup 两个指针都是 NULL 值，那就是说，不对 key 和 value 进行深拷贝，传进什么实例就用什么实例了。

再往下看，Key 的比较就是比较两个 sds 的值，来看代码，如下所示，其实就是先比较 sds 长度，然后用 memcmp 比较 sds 里面的每个字节，这个没什么难理解的。

```c
int dictSdsKeyCompare(dict *d, const void *key1,
        const void *key2){
    int l1,l2;
    UNUSED(d);

    l1 = sdslen((sds)key1);
    l2 = sdslen((sds)key2);
    if (l1 != l2) return 0;
    return memcmp(key1, key2, l1) == 0;
}
```

下面这个 key 的销毁函数 dictSdsDestructor()，猜也猜的到，就是释放 sds，代码如下所示，果然就是直接调用 sdsfree 函数。

```c
void dictSdsDestructor(dict *d, void *val){
    sdsfree(val); // 释放sds
}
```

但销毁 value 的 dictObjectDestructor 函数就有点不一样，Redis 里面的 Value 可能是字符串，也可能是 List 或者哈希表，那我们调用哪种对象的销毁函数呢？Redis 在这些数据类型外面，又包了一层叫 robj 的结构体（全称就是 redis Object），它里面有个指针，指向了真正的字符串、List 之类的数据类型；另外，redis Object 里面还有个引用计数器，要是引用数掉到 1 了，就释放这个对象，是不是有点熟悉的味道呢？引用计数版本的垃圾回收器即将脱口而出。

我们回到 dbDictType，来看其中 dictObjectDestructor() 函数的实现，它释放 value 的逻辑就是减 redis Object 的引用计数器，我们点进去看，现在是 1 了，只有一个引用了，还要再减，就是 0 了，没人引用了，就根据里面存的具体类型，调释放函数回收内存，字符串调 sdsfree，List 调用 quicklistRelease，一个个节点释放掉。

```c
void dictObjectDestructor(dict *d, void *val){
    if (val == NULL) return; 
    decrRefCount(val); // 引用次数减1，减到0就会释放
}

void decrRefCount(robj *o) {
    if (o->refcount == 1) { // 无无人引用的时候，会调用value对应的free函数进行释放
        switch(o->type) {
        case OBJ_STRING: freeStringObject(o); break;
        case OBJ_LIST: freeListObject(o); break;
        case OBJ_SET: freeSetObject(o); break;
        case OBJ_ZSET: freeZsetObject(o); break;
        case OBJ_HASH: freeHashObject(o); break;
        case OBJ_MODULE: freeModuleObject(o); break;
        case OBJ_STREAM: freeStreamObject(o); break;
        default: serverPanic("Unknown object type"); break;
        }
        zfree(o);
    } else {
        if (o->refcount <= 0) serverPanic("decrRefCount against refcount <= 0");
        if (o->refcount != OBJ_SHARED_REFCOUNT) o->refcount--;
    }
}
```


最后，就是扩容函数 dictExpandAllowed() ，它的扩容逻辑就是看使用率是不是超过了 1.618，然后看看要是再扩容的话，是不是到了内存上限值，到了上限，肯定是不能扩容了。检查都通过 ，就会返回 1，允许扩容。

```c
int dictExpandAllowed(size_t moreMem, double usedRatio) {
    if (usedRatio <= 1.618) {
        return !overMaxmemoryAfterAlloc(moreMem); // 扩容
    } else {
        return 1;
    }
}
```

dbDictType 说完之后，你是不是感觉对 Redis DB 的一些关键行为，又多了些了解呢？

**dictType 的第二个典型实现是 hashDictType**。 hashDictType 是 Redis 里面 Hash 这种数据类型使用的 dictType 实现，具体定义如下所示。它里面的 hash 函数也是用的 siphash 算法，在写入键值对的时候不会进行复制，它使用的 Key 比较函数，也是 sds 字符串的比较。Redis Hash 结构中，键值对都只能是字符串，所以销毁 Key 和 Value 的函数，都是销毁 sds 字符串。

```c
dictType hashDictType = {
    dictSdsHash,                // dictSdsHash函数底层就是使用siphash算法 
    NULL,                       // keyDup和valDup两个指针为NULL，表示不会对键值对进行复制
    NULL,                       
    dictSdsKeyCompare,          // 按照sds来比较Key
    dictSdsDestructor,          // 按照sds来销毁Key
    dictSdsDestructor,          // 按照sds来销毁Key
    NULL                        // 默认允许扩容
};
```


**dictType 的第三个典型实现是 setDictType 实现**。它是 Set 这个数据类型对应的 dictType 实现。这里你可以先回忆一下 Java 里面 HashSet 的实现，底层其实是一个 HashMap，Key 用来存储 Set 的元素，Value 里面存一个固定的对象。Redis 里面也是类似的实现，Set 也是依赖 dict 实现的，Set 底层的 dict 中，Value 部分为空，也就无需进行比较、销毁等操作。


我们来看 setDictType 的实现，这里面需要我们关注的是 Value 销毁的函数，是个 NULL，也就是无需销毁 Value，与我们预想的一样。

```c
dictType setDictType = {
    dictSdsHash,   // dictSdsHash函数底层就是使用siphash算法 
    NULL,          // keyDup和valDup两个指针为NULL，表示不会对键值对进行复制
    NULL,
    // set集合中只能存放字符串的key，所以比较函数和销毁函数按照字符串方式进行处理
    dictSdsKeyCompare, 
    dictSdsDestructor, 
    NULL            // set集合是没有使用到value的，所以不需要对应的销毁函数
                    // 未指定expandAllowed函数，默认支持扩容
};
```


最后，看一下 setDictType 和 hashDictType 里面的扩容函数，都是 NULL，NULL 的意思就是允许扩容，不做任何限制。


## 总结

在这一节中，我们重点介绍了 **Redis 里面哈希表的核心结构体，它与我们 Java 里面 HashMap 的实现非常相似**。在 dict 结构体中，最关键的就是 `ht_table` 这个数组，这个数组里面放了两个 dictEntry 的二级指针，我们这里还详细分析了 dictEntry 的结构。

  


接下来讲解了 dictType 这个类似接口的结构体，它定义了 dict 中的几个关键行为，例如，如何复制写入的键值对、如何比较键值对、如何销毁键值对、以及扩容的判断条件。最后，介绍了 dictType 最重要、最典型的三个实现。

  


另外，本节还挖了很多“坑”，比如：rehashidx 字段是干啥的？渐进式 rehash 是什么操作呢？这些“坑”我们在下一节就填哦。