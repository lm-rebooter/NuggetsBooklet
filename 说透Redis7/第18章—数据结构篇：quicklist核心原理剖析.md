在前面几讲中，我们重点讲解了 ziplist 和 listpack 这两个结构，它们都是连续的内存空间，也是构成 Redis List 的关键结构之一。

Redis List 底层的另一个关键结构是 quicklist，本节我们就来重点分析 quicklist 的`核心结构`以及控制 quicklist 特性的`关键配置`，另外，还会介绍 quicklist `迭代器的设计思想和具体实现`。

> 注意哦，本节介绍的 Redis 7.0 版本的 quicklist 实现，与 Redis 6 以及之前的主要差别就是底层把 ziplist 换成了 listpack。

  


## quicklist 核心概述

quicklist 是一个类似于 Java 里面 LinkedList 的双向链表，大概结构如下图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b46ec38ccd84b2ea76db3c6bdb0cb35~tplv-k3u1fbpfcp-watermark.image?)

quicklist 里面的节点是 quicklistNode 类型，quicklistNode 里面维护了 next、prev 指针，指向前后两个 quicklistNode 节点；然后还有一个 entry 指针，指向了一个 listpack 实例。真正的元素是存储在这个 listpack 里面的，那就是说，多个元素存储在一个 quicklistNode 里面。

现在看 quicklist 的结构，是不是有种`两层`的感觉？比如说，我们执行 RPUSH 命令，往 quicklist 的队尾插入一个元素，实际上是先走 quicklist，找到最后一个 quicklistNode 节点，这是第一层。然后，用这个 quicklistNode 节点的 entry 指针，找到里面的 listpack，最后通过前文介绍的 lpInsert() 函数将数据写入到该 listpack 头部。查找数据也是类似的操作，先找 quicklistNode 节点，然后查找 listpack 得到真正的数据。

正如上文描述的这样，**quicklist 同时使用双向链表结构和 listpack 连续内存空间，主要是为了达到空间和时间上的折中**。

-   双向链表在首尾操作的场景里面，是 O(1) 的时间复杂度。但是，每个 quicklistNode 都保存了 prev、next 指针，要是每一个元素都比较短的话，内存的有效负载就会降；再加上 quicklistNode 节点所占的内存空间不连续，很容易产生内存碎片。而 listpack 是一块连续内存，既没有内存碎片，也没有指针这种无效负载，并且 entry 会使用变长编码，有效负载比双向链表高很多。


-   修改、新增、删除元素的时候，listpack 就会比双端链表的性能差。主要是因为 listpack 在这些场景里面，会有内存拷贝之类的事情发生，特别是在 listpack 这块连续空间比较大的时候，一次内存拷贝可能会涉及到大量的数据。


Redis 为了同时使用双向链表和 listpack 的优点、规避两者的缺点，就出现了 quicklist 这种数据结构。比如说，每个 quicklistNode 里面的 listpack 都是比较小 listpack，当 listpack 超过阈值，就会分裂，防止大 listpack 出现；也正是 listpack 里面存了多个元素，可以减少内存碎片。

## list-max-listpack-size 参数

Redis 中 quicklistNode 中的 listpack 长度阈值并不是固定不变的，在 Redis 里面有一个 `list-max-listpack-size` 参数，它**用于指定每个 quicklistNode 节点里面 listpack 的长度阈值**。来看一下 redis.conf 的配置文件：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de83c2026c8b471099e31eb914e2bcde~tplv-k3u1fbpfcp-watermark.image?)

可以看到 list-max-listpack-size 参数的注释：要是它取正数时，表示的就是 listpack 里面包含的 element 节点个数；它取负数的时候，只能取 -1 到 -5 这 5 个特殊值。


这 5 个特殊值表示 listpack 的 5 个上限值，具体含义如下表：

| **list-max-listpack-size** | **listpack 上限值**                                      |
| -------------------------- | ----------------------------------------------------- |
| -5                        | 每个 quicklistNode 节点中的 listpack 不能超过 64 Kb             |
| -4                        | 每个 quicklistNode 节点中的 listpack 不能超过 32 Kb             |
| -3                        | 每个 quicklistNode 节点中的 listpack 不能超过 16 Kb             |
| -2                        | 每个 quicklistNode 节点中的 listpack 不能超过 8 Kb（Redis 的默认配置） |
| -1                        | 每个 quicklistNode 节点中的 listpack 不能超过 4 Kb              |


比如，list-max-listpack-size 取值是 -1 的时候，每个 quicklistNode 节点中的 listpack 占用的字节数不能超过 4Kb，一旦到了这个值，这个 quicklistNode 就需要分裂成两个 quicklistNode。

从 Redis 官方给出的测试结果来看，-1 和 -2 是 list-max-listpack-size 参数的推荐值，-3~-5 取值只适合一些特殊的场景，需要使用者针对这些特殊场景进行压测之后，才建议调整。


## list-compress-depth 参数

除了空间和时间上的折中之外，Redis 还会对 quicklist 里面的 listpack 进行压缩。但是，quicklist 这种双端链表的使用场景是频繁在链表两端进行读写，所以 Redis 不会把 quicklist 中全部节点的 listpack 都进行压缩，而是说，**只压缩中间部分的 quicklistNode 节点里面的 listpack**。

如下面 redis.conf 里面的 `list-compress-depth 参数`，它就是用来控制 quicklist 两端有多少个 quicklistNode 节点`不被压缩`的。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f48e2452ed1b4cfcb561b0eab8baeaf4~tplv-k3u1fbpfcp-watermark.image?)

我们来看一下 list-compress-depth 参数的注释，这里主要说明了它取值的问题。

-   0 是一个特殊值，也是默认值，它表示的是不对任何 quicklistNode 节点的 listpack 进行压缩。
-   大于 0 的取值，就表示 quicklist 两端各有多少个节点的 listpack 不被压缩，除了两端的这些节点之外，位于中间部分的 quicklistNode 节点的 listpack 都要进行压缩。

举个例子，list-compress-depth 参数取值是 1 的时候，quicklist 只有首尾两个 quicklistNode 节点的 listpack 不进行压缩，从首尾的第二个 quicklistNode 节点开始，里面的 listpack 都会被压缩，压缩之后数据用 quicklistLZF 实例保存。如下图所示：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f405511b93e49eb97d8955fff63c9cd~tplv-k3u1fbpfcp-watermark.image?)

Redis 压缩 listpack 的时候，使用的算法是 LZF 算法，这个算法的话，这里就不展开说了，你可以自己搜一下相关资料哈。



## 核心结构体

下面我们就开始看 quicklist 的具体实现。

quicklist 实现中第一个要分析就是 `quicklistNode 结构体`，打开 quicklist.h 文件，我们能找到 quicklistNode 这个结构体的定义：

```c
typedef struct quicklistNode {
    struct quicklistNode *prev; // 指向前后quicklistNode节点的指针
    struct quicklistNode *next;
    unsigned char *entry; // 指向listpack或是quicklistLZF
    unsigned int sz;   // listpack占了多少字节
    unsigned int count : 16;    // listpack中的元素个数
    // encoding表示listpack是否压缩了（以及用了哪个压缩算法）。
    // 目前只有两种取值：2表示被压缩了（而且用的是LZF压缩算法），1表示没有压缩。
    unsigned int encoding : 2;
    unsigned int container : 2;  // container有PLAIN和PACKED两个可选值
    // 当我们使用类似lindex这样的命令查看了某一个已经被压缩的数据时，
    // 需要把数据暂时解压，这时就设置recompress=1做一个标记，
    // 等有机会再把数据重新压缩。
    unsigned int recompress : 1;
    unsigned int attempted_compress : 1;  //只在测试用例中使用，在实际生产环境没用
    unsigned int extra : 10; // 预留扩展字段，暂时无用 
} quicklistNode;
```


我们看到在 quicklistNode 结构体里面，包含指向前后 quicklistNode 节点的指针——next 和 prev，还有一个指向 listpack 的指针 entry，还包含了一些额外的状态信息，具体如下。

-   count 里面存的是 listpack 的长度，这个冒号后的 16，指的是 count 字段只占 16 位。

-   encoding 字段的话，就是压缩 listpack 使用的算法，目前只有两个值，1 表示没有压缩，2 表示使用 LZF 算法压缩了。

-   container 有 PLAIN 和 PACKED 两个可选值。PACKED 的意思是说 entry 那个指针指向一个 listpack 实例，多个元素打包到了一起，所以叫 PACKED；PLAIN 的意思是说 entry 那个指针，指向的是单个的元素，一般是给单个大元素分配一个 quicklistNode，所以说，entry 指针其实是不一定会指向 listpack 。

-   recompress 字段就比较有意思，有的时候，我们从 quicklist 读取数据的时候，会访问到一些已经被压缩的 quicklistNode。例如，执行 LSET 这种随机访问的命令，恰好替换到一个压缩 quicklistNode 中的元素，这个时候，我们就要先解压 listpack，然后执行前面说的 lpReplace() 函数，替换元素值。替换之后，Redis 并不会立刻把这个 quicklistNode 节点再压缩起来，而是后面找个合适的机会再说，这个时候就需要把 recompress 字段设置成 1，做个标记，让 Redis 知道这个 quicklistNode 需要被重新压缩。

说完 quicklistNode 的结构，我们再来看 `quicklist 结构体`：

```c
typedef struct quicklist {
    quicklistNode *head; // 链表的头指针 
    quicklistNode *tail; // 链表的尾指针 
    // 整个quicklist中全部的元素个数，这是所有listpack中存储的元素个数之和 
    unsigned long count;
    unsigned long len;   // 整个quicklist中quicklistNode节点的个数 
    // fill（占用16bit）用来记录listpack大小设置，存放list-max-listpack-size 
    // 参数值，该参数各个取值的参数在前面已经介绍了，这里不再重复。 
    int fill : QL_FILL_BITS;
    // compress（占用16bit）用来存放list-compress-depth参数值， 
    // 该参数各个取值的参数在前面已经介绍了，这里不再重复。 
    unsigned int compress : QL_COMP_BITS;
    // bookmark_count（占用4bit）用来存放bookmarks数组的长度 
    unsigned int bookmark_count: QL_BM_BITS;
    quicklistBookmark bookmarks[]; // 柔性数组 
} quicklist;
```

quicklist 中最开始是 head、tail 这两个头尾指针，然后是 count 字段，它存的是元素个数，len 存的是 quicklistNode 的个数，下面的这个 fill 字段存的是 list-max-listpack-size 参数值， compress 对应的是 list-compress-depth 参数值。

在 quicklist 结构体的最后，我们看到了一个 `quicklistBookmark 的柔性数组`，从名字我们可以看出，Bookmark 是“书签”的意思，它其实就是为某个 quicklistNode 添加自定义名称，后续我们可以通过这个名称直接定位到这个 quicklistNode 节点，这样的话，就可以**实现随机访问 quicklist 的效果**，这也类似于现实生活中的“书签”功能。

我们最后一个要说的结构体是 `quicklistLZF 结构体`。前文提到，listpack 被压缩之后，会用 quicklistLZF 来存储 listpack 压缩之后的数据，这里的 sz 字段存储了 listpack 压缩后的字节数，compressed 数组里面存的是压缩后的具体数据。

```c
typedef struct quicklistLZF {
    unsigned int sz; // 压缩后的字节数
    char compressed[]; // 压缩后的具体数据
} quicklistLZF;
```


## quicklist 迭代器

在上一讲介绍 listpack 的时候，我们提到过 lpInsert() 函数中，会有一个名为 newp 的二级指针参数，当时说它是为了 quicklist 迭代器可以感知到变更之后的元素位置。

那为什么 quicklist 需要迭代器的设计呢？你可以想一下迭代器模式的目的是什么？

相信你已经想到了，其实就是帮我们**屏蔽掉集合底层复杂的实现**。再看 quicklist，它这种明显有多层结构的集合，就很适合用迭代器模式来屏蔽一下，我们在用迭代器的时候，就只会感觉到 quicklist 是一个链表，感受不到 listpack、解压缩之类的东西。

说清楚迭代器出现的意义之后，我们可以再结合 Java Collection 里面的迭代器，思考一下 quicklist 的迭代器该怎么定义。最基本的实现是需要有一个指针指向迭代的 quicklist 实例，还要有两个指针来帮助我们进行迭代，一个指向当前迭代的 quicklistNode 节点，另一个指向当前 quicklistNode 中 listpack 的位置。

相信小伙伴们已经找到 `quicklistIter 结构体`的具体定义，和我们预想的基本一样，其具体定义如下：

```c
typedef struct quicklistIter {
    const quicklist *quicklist; // 指向当前quicklistIter所迭代的quicklist实例 
    quicklistNode *current; // 指向当前迭代到的quicklistNode节点 
    unsigned char *zi; // 指向当前迭代到的listpack节点 
    long offset; // 当前迭代到的entry在listpack中的偏移量，也就是第几个元素
    int direction; // 当前quicklistIter的迭代方向，AL_START_HEAD为正向遍历，AL_START_TAIL为反向遍历 
} quicklistIter;
```

其中，current 指针可以确定当前迭代到的节点；zi 指针，指向了 listpack 迭代的位置，也就是当前迭代到的 element 的首地址；offset，记录了当前迭代到的元素是这个 listpack 中的第几个元素，也就是偏移量。最后一个 direction 字段，是迭代方向，毕竟 quicklist 和 listpack 都是同时支持正序和逆序迭代的。

在我们用 quicklistIter 迭代 quicklist 的时候，还会用到一个 quicklistEntry 结构体。它跟 listpack 里面 zlentry 的作用有些类似，quicklistEntry 不会真实存在于 quicklist 中，只是用来存 quicklist 中元素的值以及这个元素的位置信息。

`quicklistEntry 结构体`的具体定义如下：

```c
typedef struct quicklistEntry {
    const quicklist *quicklist; // 所属的quicklist实例 
    quicklistNode *node; // 所属的quicklistNode节点 
    unsigned char *zi; // 指向对应的element（listpack中的elememt节点） 
    int offset; // 对应entry在listpack中的偏移量，也就是第几个元素
    
    unsigned char *value; // 如果对应值为字符串，则由value指针记录 
    unsigned int sz; // 如果对应值为字符串，则sz会记录该字符串的长度 
    
    long long longval; // 如果对应值为整数，则由longval进行记录 
} quicklistEntry;
```

前四个字段和 quicklist 迭代器里面的同名字段一样，分别是用来确定这个元素位置、所属的 quicklistNode 节点、所属的 listpack 以及元素在 listpack 里面的偏移量。

存元素值的话，就看后面三个字段。如果这个元素是字符串的话，就用 value 指针存，sz 存字符串长度；如果是整型的话，就用 longval 这个字段存。


## 总结

这一讲我们主要讲解了 quicklist 的核心结构以及具体实现，其中重点介绍了 quicklist 在设计上面的思考和折中，同时，展开说明了控制 quicklistNode 中 listpack 长度的 list-max-listpack-size 配置以及控制 quicklist 节点压缩行为的 list-compress-depth 配置。最后，还分析了 quicklist 迭代器的设计思想以及 具体的实现。


下一讲，我们会继续介绍 quicklist 的内容，侧重来分析 Redis 操纵 quicklist 结构的核心函数。