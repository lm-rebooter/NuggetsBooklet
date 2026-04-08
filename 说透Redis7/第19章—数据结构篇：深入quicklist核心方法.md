在上一讲中，我们重点介绍了 quicklist 的核心结构，一起分析了 quicklist 里面关键的结构体定义以及关键的配置含义。本节我们将继续重点介绍 quicklist 的核心函数，主要包括：`插入数据`、`弹出数据`以及`查询数据`这三方面的函数实现。


## 创建 quicklist

首先来看创建 quicklist 实例的 `quicklistNew() 函数`，可以用 CLoin 调用链的视图看一下它都调了哪些函数。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13f74fdfca8441f1be8cc5756b55e10c~tplv-k3u1fbpfcp-watermark.image?)

可以看到，quicklistNew() 函数先会调用 quicklistCreate() 创建一个空 quicklist 实例，里面就是走 malloc 分配内存，然后通过 quicklistSetCompressDeth() 和 quicklistSetFill() 函数来初始化 compress 和 fill 两个字段。


## 插入数据

向 quicklist 插入一个元素的入口函数是 `quicklistPush() 函数`，其核心代码片段如下：

```c
void quicklistPush(quicklist *quicklist, void *value, const size_t sz,
                   int where) {
    ... 
    if (where == QUICKLIST_HEAD) { // 在头部插入数据
        quicklistPushHead(quicklist, value, sz);
    } else if (where == QUICKLIST_TAIL) { // 在尾部插入数据
        quicklistPushTail(quicklist, value, sz);
    }
}
```

我们看到其中有一个 if 条件判断，这个 where 参数决定了是从 quicklist 的头部添加数据，还是从 quicklist 的尾部添加数据，也就进入了 pushHead 和 pushTail 两个分支。


从下面的调用关系链截图，也能看到，quicklistPush 调用了 quicklistPushHead 和 quicklistPushTail 两个分支。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/088a90192d59431882df4b7bc4af3330~tplv-k3u1fbpfcp-watermark.image?)


下面我们就拿 quicklistPushHead 这个分支为例进行分析（quicklistPushTail 这个分支，在代码实现上和 quicklistPushHead 的差异不大，这里就不再赘述），相关实现代码如下：

```c
int quicklistPushHead(quicklist *quicklist, void *value, size_t sz) {
    quicklistNode *orig_head = quicklist->head;

    if (unlikely(isLargeElement(sz))) { // 不太可能执行到的分支，碰到超过1G元素
        __quicklistInsertPlainNode(quicklist, quicklist->head, value, sz, 0);
        return 1;
    }

    if (likely( // 可能执行到的分支，正常元素
            _quicklistNodeAllowInsert(quicklist->head, quicklist->fill, sz))) {
        quicklist->head->entry = lpPrepend(quicklist->head->entry, value, sz);
        quicklistNodeUpdateSz(quicklist->head);
    } else { // 初始化一个新quicklistNode
        quicklistNode *node = quicklistCreateNode();
        node->entry = lpPrepend(lpNew(0), value, sz);

        quicklistNodeUpdateSz(node);
        _quicklistInsertNodeBefore(quicklist, quicklist->head, node);
    }
    quicklist->count++;
    quicklist->head->count++;
    return (orig_head != quicklist->head);
}
```

可以看到，在 quicklistPushHead() 里面有**三个核心分支**：

-   第一个分支是专门处理超过 1G 的大元素；

-   第二个分支是正常插入元素，在这个分支中，直接调用了 listpack 的 lpPrepend 函数向头节点的 listpack 里面写入新元素；

-   最后一个是 else 分支用来处理 quicklistNode 分裂的场景，大概意思是头节点里面 listpack 的长度达到了 list-max-listpack-size 指定的上限，需要重新初始化一个 quicklistNode。



### 1. likely 与 unlikely

在开始展开分析 quicklistPushHead 中每个分支的具体实现之前，我们需要先介绍一下在这些分支判断条件中使用的 `unlikely 和 likely 这两个宏`，分别对应的是这两个 bulltin 函数：

```c
#define likely(x) __builtin_expect(!!(x), 1)
#define unlikely(x) __builtin_expect(!!(x), 0)
```

要理解这两个函数，得需要一些 `CPU 流水线`的基础知识，这里我简单介绍一下，如果小伙伴了解这部分基础知识，可以直接跳过。


CPU 执行命令之前需要读指令、解析指令，然后才能真正执行指令，其中读指令的时间比较久，串行的话，CPU 就要等待执行从各级缓存或内存加载到寄存器里面，比如说下面这张图，白色块占的时间，都是 CPU 空闲等待的时间。


![19 CPU流水线1.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ad45fb6f34349769cd94015027ff28f~tplv-k3u1fbpfcp-watermark.image?)


为了打满 CPU 呢，就可以用`预取指令`的方式，提前给 CPU 准备好下一条指令。如下图所示，CPU 就一直在执行指令了。


![19 CPU 流水线2.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bb10831f7ae4001be8d93e77d46ebd5~tplv-k3u1fbpfcp-watermark.image?)


需要注意一个问题，**预取指令的数量是有限的**。比如说，CPU 只能预取后面 10 条、20 条指令，不可能把整个程序的指令都预取进来，CPU 高速缓存之类的地方是存不下的。

那我们要预取哪些指令呢？正常情况下，就按照我们代码书写的顺序进行预取，是不是就行了？

但是，我们的代码里面会有非常多的 if...else 这种跳转语句，顺序预取的方式就会失败，因为计算机不知道要预取 if 的分支，还是 else 的分支。这个时候，**我们就可以用 builtin 函数告诉计算机：走这个分支的概率很大，让 CPU 优先考虑来预取这个分支的代码**。一旦落到这个分支里面的话，就命中了预取的代码，实现效率的提升。


### 2. 插入大元素

我们回到 quicklistPushHead 的代码，继续分析。

第一个分支，这个里面的判断条件就是元素是否超过了 1G，1G 以上的这种超大元素不太可能经常出现，所以用了 unlikely 这个判断条件。

虽然不太经常出现，但我们还是要去看看它的处理逻辑，这里面走的 CreatePlainNode 函数，实际上就是新建了一个 quicklistNode 节点，里面的 entry 指针指向了这个超大的元素，这里的 container 字段也设置成了 PLAIN（你可以回顾一下上一讲中，对 container 两个可选值 PLAIN 和 PACKED 的介绍）。

然后，这个 __quicklistInsertNode() 函数会将新建的 quicklistNode 节点插入到 quicklist 里面，这个添加过程就是链表加节点的指针操作，就不多说了。最后，还有一个压缩函数节点的操作，你可以暂时先把这个地方当作黑盒，在本节后续会有专门的部分详细展开介绍。


### 3. 插入正常元素

再来看 quicklistPushHead() 核心逻辑中插入正常元素的分支，这个分支的判断条件会检查头部节点的 listpack 能不能继续写入新 element。

下面来简单分析一下检查逻辑，具体位于 `_quicklistNodeAllowInsert() 函数`中：

```c
REDIS_STATIC int _quicklistNodeAllowInsert(const quicklistNode *node,
                                           const int fill, const size_t sz) {
    ... // 省略非关键代码
    // 第一个if分支，检查该节点是否为PLAIN类型节点
    if (unlikely(QL_NODE_IS_PLAIN(node) || isLargeElement(sz)))
        return 0; 

   
    size_t new_sz = node->sz + sz + SIZE_ESTIMATE_OVERHEAD;
    if (likely(_quicklistNodeSizeMeetsOptimizationRequirement(new_sz, fill))) // fill为负数时的检查分支
        return 1;     
    else if (!sizeMeetsSafetyLimit(new_sz)) // fill为正数的检查分支
        return 0;     
    else if ((int)node->count < fill)
        return 1;
    else
        return 0;
}
```

上述 _quicklistNodeAllowInsert() 中第一个 if 分支，是看 quicklistNode 是不是 PLAIN 类型，如果是的话，这个 quicklistNode 是被独占的，不能往里加别的元素。


再往下，_quicklistNodeAllowInsert() 函数就要开始预估一下插入新元素之后，这个 listpack 状态了。下面的 _quicklistNodeSizeMeetsOptimizationRequirement() 分支是在 listpack-size 取 -1、-2 之类的这种负数的时候有效，你可以进入该方法看一下，会看到 fill 大于 0 的时候，直接就 return 0 了；如果 fill 是负数的时候，才会根据 fill 值确定对应的 listpack 长度上限值。

```c
REDIS_STATIC int
_quicklistNodeSizeMeetsOptimizationRequirement(const size_t sz,
                                               const int fill) {
    if (fill >= 0) //  listpack-size位置为正，直接返回
        return 0;

    size_t offset = (-fill) - 1; //  listpack-size为负，才会确定listpack的长度上限值
    if (offset < (sizeof(optimization_level) / sizeof(*optimization_level))) {
        if (sz <= optimization_level[offset]) {
            return 1;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}
```


要是 listpack-size 配置是正数，表示的是元素个数上限。这里会先通过 sizeMeetsSafetyLimit() 检查一下 listpack 字节长度，最长不能超过 8k，然后再去检查元素个数，保证元素个数不能超过 listpack-size 配置。8k 和元素个数任何一个不满足条件，都不能继续插入新元素了。

### 4. 节点分裂场景处理

quicklistPushHead() 里面最后一个分支，用于处理节点分裂的情况，也就是一个 quicklistNode 节点达到存储上限之后，需要新建 quicklistNode 头节点来存储新插入的元素。

看该分支的代码，就可以清晰地了解其逻辑就是创建一个 PACKED 类型的 quicklistNode 节点，作为 quicklist 的头节点，然后新元素再写到它的 listpack 里面。这个分支里面的逻辑比较简单，但是可能会触发原节点的压缩，下面会单独进行分析。

新元素插入完成之后，quicklistPushHead() 函数会更新一下 quicklistNode 和 quicklist 的统计信息，就完成整个插入操作了。


## 节点压缩逻辑

我们前面埋了一个坑，在有新 quicklistNode 插入到 quicklist 的时候，是可能会触发压缩的，这件事我们没展开说，现在解释一下。

先举个例子，假设我们的 compress-depth 配置成了 1，那就是下图的状态，只有首尾的两个节点的 listpack 没有被压缩。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bff29f0efa0412b99292a7232ffb50d~tplv-k3u1fbpfcp-watermark.image?)


现在在头部插入一个新 quicklistNode 节点，此时我们就需要把原来的头部节点进行压缩，就是这个图里面标红的 quicklistNode 节点。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30eee0fac19b41c8bf5dc077ef1cef8a~tplv-k3u1fbpfcp-watermark.image?)


触发压缩的例子说明了之后，我们再来看 quicklistCompress 这个宏，它分了两个分支。

```c

#define quicklistCompress(_ql, _node)                                          
    do {                                                                       
        if ((_node)->recompress) // 重新压缩   
            quicklistCompressNode((_node));    
        else  // 第一次压缩
            __quicklistCompress((_ql), (_node));                               
    } while (0)
```

先说第一个分支的用处，在用迭代器迭代 quicklist 的时候，需要把各个节点先解压，然后才能迭代里面的元素，在这个解压的时候，就会设置 recompress 标志。迭代完了，就会执行这里的第一个分支，把节点再压缩起来。


插入新 quicklistNode 的场景显然是走第二个分支，我们看下这个 `__quicklistCompress() 函数`。在该函数的开头都是在检查这个 quicklist 是不是需要压缩，比如 compress-depth 配置成了 0 或者是 quicklistNode 节点数非常少，都不用压缩了。

```c
REDIS_STATIC void __quicklistCompress(const quicklist *quicklist,
                                      quicklistNode *node) {
    if (quicklist->len == 0) return;
    assert(quicklist->head->recompress == 0 && quicklist->tail->recompress == 0);
    // 判断quicklist是不是需要进行压缩
    if (!quicklistAllowsCompression(quicklist) ||
        quicklist->len < (unsigned int)(quicklist->compress * 2))
        return;


    quicklistNode *forward = quicklist->head;
    quicklistNode *reverse = quicklist->tail;
    int depth = 0;
    int in_depth = 0;
    while (depth++ < quicklist->compress) { // 该循环同时从quicklist两端开始，向中间节点开始检查
        quicklistDecompressNode(forward);
        quicklistDecompressNode(reverse);

        if (forward == node || reverse == node)
            in_depth = 1;

        if (forward == reverse || forward->next == reverse)
            return;

        forward = forward->next;
        reverse = reverse->prev;
    }

    if (!in_depth) // 要压缩的目标节点位于压缩区域，才能执行压缩
        quicklistCompressNode(node);

    // 压缩forward和reverse两个节点
    quicklistCompressNode(forward);
    quicklistCompressNode(reverse);
}
```

__quicklistCompress() 函数中最核心的就是上述代码片段中的 while 循环，它会同时从 quicklist 的两端开始往中间节点检查。比如说，现在 compress-depth 是 3，那首尾三个节点都要是不压缩的状态，这个 while 循环就会循环 3 次，forward、reverse 两个指针的移动方向，就是下面这张图，循环到的这 6 个节点都会被解压，解压的逻辑是 Decompress 这个宏里面。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8172933488a495f90de91d67ed7a15a~tplv-k3u1fbpfcp-watermark.image?)


处理完 quicklist 两端的压缩的事情之后呢，我们来关注 __quicklistCompress() 函数的最后一个 node 参数，这个参数传入的是此次要压缩的目标节点。如果这个节点在上述非压缩范围内，就无需压缩了；如果在压缩范围内，则需要执行 quicklistCompressNode() 函数进行压缩处理。


继续往下看，在上面 while 循环结束的时候，forward、reverse 两个指针已经离开了非压缩区域，这里会顺带将 forward、reverse 两个节点压缩掉。

举个例子，来看下面这张图，compress-depth 还是 3，节点从 6 个增长到 7 个节点的时候，forward、reverse 指针在 while 循环结束的时候，都会指向中间这个节点，已经离开了非压缩区域，需要把它压缩掉；然后继续往 quicklist 头部插入节点，节点增长到 8 个的时候，forward、reverse 指向中间两个节点，reverse 已经压缩过了，forward 需要压缩；节点继续增长到 9 个的时候，forward 需要压缩，最中间的节点、还有 reverse 节点在节点是 8 的时候，已经压缩过了，就不用管了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ec7fbba8084a70896db1a87456e639~tplv-k3u1fbpfcp-watermark.image?)

到此为止，从 quicklist 头部插入新元素的事情，已经说完了。从尾部插入的逻辑就不再重复了，相信小伙伴们看这部分的代码应该会非常轻松。


## 指定位置插入数据

除了从头尾插入数据之外，quicklist 还可以**在指定的位置插入数据**，具体就是 `InsertAfter()` 和 `InsertBefore()` 这两个函数。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a1cdbc45e2147609eb739f67a95fd08~tplv-k3u1fbpfcp-watermark.image?)


从名字上就能看出来，After 是在指定位置之后插入数据，Before 是在前面插入。这两个函数，底层都依赖了`  _quicklistInsert()  `，来看一眼调用关系：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b1726f45fc84eafa97aac84ca86122c~tplv-k3u1fbpfcp-watermark.image?)

这里我们就拿 InsertAfter() 的场景为例来讲解 __quicklistInsert() 函数的实现。

  


先说一下这个 __quicklistInsert() 函数的参数，第一个是一个 quicklist 迭代器，第二个 entry 参数是用来定位插入位置的。比如，我们执行一条 LINSERT AFTER 命令，就是先用一个 quicklist 迭代器，从头到尾迭代 List 查找锚点元素，找到之后就在这个锚点元素后面，插入新元素，这个迭代器就是第一个参数，锚点元素的位置就记到了第二个参数里面。后面两个参数，就是插入的新元素值。


说明白参数的含义之后，就要开始分析定点插入的实现了，先来看第一部分代码片段：

```c
REDIS_STATIC void _quicklistInsert(quicklistIter *iter, quicklistEntry *entry,
                                   void *value, const size_t sz, int after)
{
    quicklist *quicklist = iter->quicklist;
    // 定义一些控制变量
    int full = 0, at_tail = 0, at_head = 0, avail_next = 0, avail_prev = 0;
    int fill = quicklist->fill;
    quicklistNode *node = entry->node;
    quicklistNode *new_node = NULL;
    
    if (!_quicklistNodeAllowInsert(node, fill, sz)) {
        full = 1;
    }

    if (after && (entry->offset == node->count - 1 || entry->offset == -1)) {
        at_tail = 1;
        if (_quicklistNodeAllowInsert(node->next, fill, sz)) {
            avail_next = 1;
        }
    }
    ... // 省略其他逻辑
}
```

需要解释一下 full、at_tail、avail_next 这几个变量的意思：full =1 是说锚点元素所在的 quicklistNode 节点不能插入新元素了；at_tail =1，是说要在锚节点尾部插入新元素；avail_next = 1 是说锚节点的下一个节点，还有空间插入新元素，这种情况呢，一般是在 full、after、at_tail 三个值都是 1 的时候，才会考虑把新元素插入到下一个节点的头部。

  


上述这两个 if 代码块，就是在确定这三个值，先是检查锚节点的空间，然后是看锚点元素在 listpack 的位置，再就是下一个节点的空间。

  


接下来这个 if 分支是检查大元素的，不多说了。

```c
REDIS_STATIC void _quicklistInsert(quicklistIter *iter, quicklistEntry *entry,
                                   void *value, const size_t sz, int after)
{
    ... // 省略其他逻辑
    if (unlikely(isLargeElement(sz))) {
        ... // 处理大元素插入的逻辑
        return;
    }
    ... // 省略其他逻辑
}
```


下面进入一个非常长的 if else 代码块，我们还是紧抓 after 插入场景进行分析，我这里标了 1 到 4，四个分支，这四个是和 after 插入场景相关的分支。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa5b16c3470d4b83b3dd89bb809786a7~tplv-k3u1fbpfcp-watermark.image?)


我们一个个场景来说，来看这张图：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a03d97c1f1cd4bccacaf93050e15d506~tplv-k3u1fbpfcp-watermark.image?)


-   第一个场景，是锚节点没满，直接走 listpack 的定点插入逻辑就行。

-   第二个场景，是锚点满了，但是下一个节点还有空间，而且我们的锚点元素恰好在锚节点的结尾，那我在下一个 quicklistNode 节点的开头插入新元素，这也算是紧跟在锚点元素之后。

-   第三个场景是这样，锚点和下一个节点都满了，那没办法了，就只能创建一个新节点，然后插入到锚节点之后，然后把新元素存到这个新节点里面。

-   第四个场景里面呢，是锚节点满了，但是锚点元素不再节点尾部，这个时候就要把锚节点分裂成两个节点，然后再插入新元素。


我们回到代码里面，看看这些分支里面注意的地方。

-   第一个注意的地方是，**解压节点和压缩节点这两个操作是成对出现的**，比如说第一个场景里面，就是先解压，设置 recompress 值，然后插入新元素，最后再压缩节点。

-   第二个是场景 3 里面，插入新节点之后，新节点里面就只存了一个新元素，觉得多多少少有点浪费，但是也没有办法。

-   最后是场景 4 里面，锚节点分裂的位置，是新元素插入的位置。节点分裂的时候，可能会出现一种合并的情况。举个例子，就像下面这张图，锚节点分裂成两个节点之后，分裂出来的前面这个节点，可能会和前一个节点合并，当然，前提是这两个节点的数据合并之后，依旧没有达到分裂的阈值。具体的合并实现，在 _quicklistMergeNodes() 这个函数里面，里面会涉及到节点解压、listpack 合并这些事情，就留给小伙伴们自己分析了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc8ddf9a3b4c4c79ba110db6ef0c3eed~tplv-k3u1fbpfcp-watermark.image?)



## 弹出数据

从 quicklist 里面读取数据的时候，我们一般是从 quicklist 两端弹出数据，也就是 LPOP、RPOP 这种命令。这些 POP 命令底层依赖是 `PopCustom 这个函数`，我们用调用链视图看一眼，不仅是 LPOP、RPOP 命令，像阻塞版本里的 POP、LMOVE 这些命令也都是通过 quicklistPopCustom() 弹出元素的。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d11b4a150b204cd29fd36215f52d234c~tplv-k3u1fbpfcp-watermark.image?)


**quicklistPopCustom() 函数基本就是前面说的 quicklistPushTail()、quicklistPushHead() 函数的反逻辑**，先来看它的函数签名：

```c
int quicklistPopCustom(quicklist *quicklist, int where, unsigned char **data,
                       size_t *sz, long long *sval,
                       void *(*saver)(unsigned char *data, size_t sz)) 
```

这里的 where 参数是决定从队头还是队尾弹出数据，后面的两组输出参数，用来存弹出的元素值。要是这个值是字符串的时候，就用 data 和 sz，要是数字的话，就用 sval 存。最后的 saver 是一个函数指针，函数指针是个什么东西呢？如果小伙伴了解 Java，其实可以对标到 Java 里面的 Funtion 对象。


我简单再展开说一下这个`函数指针`怎么看哈。先看括号里面，saver 前面有个 * 号，说明它是一个指针类型；然后再看括号前面，void * 是说 saver 指向的这个函数返回一个 void 指针，void 指针呢，可以接任何类型的指针，是不是和 Java 里面的 Object 变量的感觉有点类似，可以接任何类型的对象；再看括号后面，这就是 saver 这个函数的参数列表。这么看完之后，是不是感觉 save 和 Java 里面的 BiFunction 很像了呢？

```c
void *(*saver)(unsigned char *data, size_t sz)

BiFunction<String, Integer, R> bf = ...
```

看完 quicklistPopCustom() 函数的参数列表之后，我们再来看它的具体实现脉络。

这里先是根据 where 参数确定从头还是尾弹出元素，然后是针对一个节点存一个大元素的特殊处理分支，最后是从 listpack 里面找正常元素返回的处理分支，该分支找到元素之后，就根据元素类型，把元素值存到 data 或是 sval 里面。

```c
int quicklistPopCustom(quicklist *quicklist, int where, unsigned char **data,
                       size_t *sz, long long *sval,
                       void *(*saver)(unsigned char *data, size_t sz)) {
    unsigned char *p;
    unsigned char *vstr;
    unsigned int vlen;
    long long vlong;
    int pos = (where == QUICKLIST_HEAD) ? 0 : -1;

    if (quicklist->count == 0)
        return 0;

    if (data)
        *data = NULL;
    if (sz)
        *sz = 0;
    if (sval)
        *sval = -123456789;

    quicklistNode *node;

    // 确定从头还是从尾弹出元素
    if (where == QUICKLIST_HEAD && quicklist->head) {
        node = quicklist->head;
    } else if (where == QUICKLIST_TAIL && quicklist->tail) {
        node = quicklist->tail;
    } else {
        return 0;
    }

    if (unlikely(QL_NODE_IS_PLAIN(node))) { // 针对大元素的特殊处理分支
        if (data)
            *data = saver(node->entry, node->sz);
        if (sz)
            *sz = node->sz;
        quicklistDelIndex(quicklist, node, NULL);
        return 1;
    }

    // 返回正常元素返回的分支：从listpack里面找元素，pos决定了是从头还是尾
    p = lpSeek(node->entry, pos);
    vstr = lpGetValue(p, &vlen, &vlong);
    if (vstr) {
        if (data)
            *data = saver(vstr, vlen);
        if (sz)
            *sz = vlen;
    } else {
        if (data)
            *data = NULL;
        if (sval)
            *sval = vlong;
    }
    quicklistDelIndex(quicklist, node, &p); // 删除元素
    return 1;
}
```

查完元素之后呢，就要开始处理 “弹出” 操作里面删除元素的操作了。执行 ` quicklistDelIndex()  `这个函数，你可以进入该函数看一下，它先是大元素的处理分支，逻辑是直接删节点；然后是小元素的处理分支，逻辑就是从 listpack 里面删，listpack 删干净之后，就开始删整个 quicklistNode 节点。在删节点的时候，需要注意一下，里面会调用 __quicklistCompress() 函数，让整个 quicklist 重新满足 list-compress-depth 参数的压缩深度。

最后，` quicklistDelRange()  `这个函数，也有删除数据的效果，而且是删除一个范围内的元素，它是 LTRIM 命令的底层实现，具体实现就留给小伙伴自己分析了，相信问题不大。



## 查询数据

说完插入和弹出数据的逻辑之后，我们最后来看如何遍历整个 quicklist，也就是 quicklist 迭代器内容。

我们 Java 里面是怎么使用迭代器的呢？模板代码就是先创建一个迭代器，然后循环迭代，循环到合适的目标元素就进行处理，比如下面的打印、删除：

```c
List<String> list = Lists.newArrayList();
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String s = iterator.next();
    if ("target".equals(s)) {
        System.out.println(s);
        iterator.remove();
    }
}
```

使用 quicklist 迭代器的话，也是类似的模板代码，流程大致如下：先创建 quicklist 迭代器，然后通过 quicklistNext() 推进迭代器，迭代到的元素会记录到 entry 里面，在这个 whlie 循环里面，就是去读 entry 里面的数据。

```c

quicklistIter *iter = quicklistGetIterator(quicklist,<direction>);
quicklistEntry entry;
while (quicklistNext(iter, &entry)) {
  if (entry.value)
      [[ use entry.value with entry.sz ]]
  else
      [[ use entry.longval ]]
}
```


创建 quicklistIter 的话，有两个函数：一个是 quicklistGetIterator() 函数，它返回的迭代器是从 quicklist 的头或尾开始迭代的；另一个是 quicklistGetIteratorAtIdx() 函数，它返回的迭代器是从一个指定位置开始迭代。


**这两个函数主要是初始化了 quicklist 迭代器的 current 和 offset 字段**。以 quicklistGetIteratorAtIdx() 函数为例，如下图，我们需要从第 9 个元素开始正向迭代的话，就需要把迭代器的 current 指针移动到第 3 个节点，offset 移动到 current 节点里面的第二个元素。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1b94eeea104f998ee5750d56bf92de~tplv-k3u1fbpfcp-watermark.image?)

具体的实现就不展开分析了，小伙伴们可以自行思考一下。


创建完 quicklist 迭代器，再来看 quicklistNext() 函数是怎么推进迭代器的，核心代码和注释如下所示：

```c
int quicklistNext(quicklistIter *iter, quicklistEntry *entry) {
    ... // 省略初始化entry以及检查iter迭代器的逻辑

    unsigned char *(*nextFn)(unsigned char *, unsigned char *) = NULL;
    int offset_update = 0;

    int plain = QL_NODE_IS_PLAIN(iter->current);
    // 下面初始化iter->zi字段
    if (!iter->zi) { // 当前zi为空，说明上一个节点的内容已经迭代完毕了，需要解压current节点开始迭代了
        quicklistDecompressNodeForUse(iter->current); // 解压节点内容
        if (unlikely(plain)) // 大元素处理分支
            iter->zi = iter->current->entry;
        else // 正常元素处理分支
            iter->zi = lpSeek(iter->current->entry, iter->offset);
    } else if (unlikely(plain)) { 
        // 对大元素的处理，zi在下次quicklistNext()的时候，指向下个节点的listpack了，这里还是保持NULL就行了
        iter->zi = NULL;
    } else {
        // 当前迭代器在PACKED类型的节点中迭代，现在要推进到下一个元素
        // 注意，这里有个特殊情况，那就是当前已经迭代到了该节点listpack的结尾，再继续推进的话，zi指针就是NULL了，
        // 下面会有专门的逻辑来处理这种特殊情况
        if (iter->direction == AL_START_HEAD) {
            nextFn = lpNext;
            offset_update = 1;
        } else if (iter->direction == AL_START_TAIL) {
            nextFn = lpPrev;
            offset_update = -1;
        }
        iter->zi = nextFn(iter->current->entry, iter->zi);
        iter->offset += offset_update;
    }

    // 确定了zi指向的元素之后，就开始把元素值填到entry里面了。
    entry->zi = iter->zi;
    entry->offset = iter->offset;
    if (iter->zi) {
        if (unlikely(plain)) {
            entry->value = entry->node->entry;
            entry->sz = entry->node->sz;
            return 1;
        }
        unsigned int sz = 0;
        entry->value = lpGetValue(entry->zi, &sz, &entry->longval);
        entry->sz = sz;
        return 1;
    } else {
        // 这是处理zi指针为NULL的特殊情况，此时说明当前这个节点里面的元素都迭代完了，
        // 所以需要迭代下一个节点，所以current需要后移，offset设置成0。
        // 同时将刚迭代完的这个节点压缩重新压缩起来，然后再调一次quicklistNext()，
        // 就可以迭代出下一个节点的第一个元素了。
        quicklistCompress(iter->quicklist, iter->current);
        if (iter->direction == AL_START_HEAD) {
            iter->current = iter->current->next;
            iter->offset = 0;
        } else if (iter->direction == AL_START_TAIL) {
            iter->current = iter->current->prev;
            iter->offset = -1;
        }
        iter->zi = NULL;
        return quicklistNext(iter, entry);
    }
}
```


这里，还有两个地方要说一下：

-   一个是在 quicklistNext() 函数里面，刚开始迭代一个节点的时候，如果该节点之前是压缩节点的话，会先解压这个节点，迭代完这个节点之后，会立刻把它再压缩起来；

-   第二个地方是，插入元素和更新元素的时候，会把迭代器关掉，就是 resetIterator 这个宏，里面就是把 current 设置成 NULL，这个迭代器就没法用了。但是要注意，删除的时候，不会销毁迭代器，你可以看到 quicklistDelEntry() 函数里面是没有调 reset 销毁迭代器。

最后，还有 quicklist 的删除逻辑，其实就是前面说的 quicklistDelIndex() 函数，它也是 LREM 命令的核心实现，这里就不重复了哈。

  


## 总结

在本节中，我们重点介绍了 quicklist 的核心函数。

首先我们介绍了初始化 quicklist 实例的函数，然后详细分析了向 quicklist 头部（或尾部）插入元素的逻辑，其中针对插入大元素、插入正常元素以及节点分裂三个分支进行了详细地分析。在节点分裂之后，可能会触发 quicklist 节点的压缩，所以接下来又对 quicklist 节点压缩的逻辑进行深入剖析。

分析完 quicklist 头部（或尾部）插入元素之后，我们展开介绍了在 quicklist 指定位置插入元素的 _quicklistInsert() 函数，根据插入位置的不同，分成了四种不同的插入场景。

最后，我们讲解了从 quicklist 中弹出元素以及使用迭代器迭代 quicklist 的原理和关键实现。


至此，整个 quicklist 的全部内容，也就介绍完了。下一节，我们接着开始介绍 Redis 里面的哈希结构。