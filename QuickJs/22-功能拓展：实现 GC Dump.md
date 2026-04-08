一直停留在对源码的学习，难免产生倦意，接下来我们将进入两篇实践，一起为引擎添加两个新的功能。

本节将为引擎添加的新功能名为 GC Dump，它可以将引擎运行期间受到 GC 管理的对象统统导出，对于导出的结果，我们可以借助一些可视化分析工具查看和分析应用程序的内存占用情况。

功能简介
----

GC Dump 具体要做哪些功能是我们在动手之前需要明确的，按一般软件开发的思路，此时我们会先进入一个需求分析的过程，得出需要实现的功能点，然后规划我们的编码节奏。

索性是这个功能并不是我们的首创，v8 引擎中已有类似的功能。那么我们就选择轻松一些，通过一起使用 v8 引擎的堆分析工具作为例子，来替代详细的 GC Dump 需求分析。

首先准备下面的测试代码，拷贝到文件 `test.js` 中：

    // test.js
    const { writeHeapSnapshot } = require("v8");
    
    class HugeObj {
      constructor() {
        this.hugeData = Buffer.alloc((1 << 20) * 50, 0);
      }
    }
    
    // 注意下面的用法在实际应用中通常是 anti-pattern，
    // 这里只是为了方便演示，才将对象挂到 module 上以防止被 GC 释放
    module.exports.data = new HugeObj();
    
    writeHeapSnapshot();
    

运行 `node test.js` 后，会生成一个文件名类似下面的文件：

    Heap.20231010.091930.22339.0.001.heapsnapshot
    

该文件可以导入到 [Chrome DevTools](https://developer.chrome.com/docs/devtools/ "https://developer.chrome.com/docs/devtools/") 进行查看：

![heap_dump_demo.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e34923384fb749aabeb76f09c81e81c1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=1777&h=1025&s=2115842&e=gif&f=119&b=070707) 导入后的界面内容如下：

![heap_dump.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab0be557b24b4747a7236bf6e0021b0e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2328&h=1338&s=407005&e=png&b=ffffff)

上图右半边的表格中即为所有受 GC 管理的对象，表格中各列的含义为：

*   Constructor，表示对象使用的构造函数，类名后面斜体的 `x3` 表示该类对象的数量
    
*   Distance，表示从根节点（Roots）到达该对象经过的最短路径
    
*   Shallow size，对象自身大小（单位是 Byte），表示对象内部为了维护属性和值的对应关系所占用的内存，并不包含持有子对象的大小
    
    比如 `hugeData` 属性引用的 `Buffer` 对象的大小，就不会计算在 `HugeObj` 实例的 Shallow size 中
    
*   Retained size，对象自身大小加上它依赖链路上的所有对象的自身大小（Shallow size）之和
    

现在可以使用一句话概括下我们的目标：使得 QuickJS 引擎也可以将 GC 管理的对象导出为一份 `.heapsnapshot` 文件，并且可通过 Chrome DevTools 查看该文件的内容。

Heapsnapshot 文件格式
-----------------

我们选择先分析 `.heapsnapshot` 文件的内容。打开该文件，首先可以发现的内容为：

*   `snapshot` 开头的一行是不包含空格的
    
*   `nodes` 和 `edges` 起头的内容都是有换行分隔的，且行数还不少
    

我们可以将字段的内容进行折叠以便观察，不难发现文件中的数据采用了 JSON 格式：

![heap_ss.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e786ff0c92e44e39b0d512a818ada3e1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=554&h=394&s=35445&e=png&b=292d35)

上图中的字段，似乎没有现成的文档可以参考，但好在 v8 和 Chrome DevTools 都是开源的，我们可以通过分析它们的源码得到这些字段的解释，相应的线索为：

*   `v8.getHeapSnapshot` 在 v8 引擎中的实现是方法 [HeapSnapshotGenerator::GenerateSnapshot](https://github.com/nodejs/node/blob/v14.x/deps/v8/src/profiler/heap-snapshot-generator.cc#L2027 "https://github.com/nodejs/node/blob/v14.x/deps/v8/src/profiler/heap-snapshot-generator.cc#L2027")，我们可以通过分析该函数的调用方式来得到上述字段的含义
    
*   Chrome DevTools 中对 Heapsnapshot 进行呈现的前端代码在文件 [heap\_snapshot\_worker/HeapSnapshot.ts](https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/entrypoints/heap_snapshot_worker/HeapSnapshot.ts "https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/entrypoints/heap_snapshot_worker/HeapSnapshot.ts") 中
    

后续如果有机会的话，可以展开介绍如何分析出 `.heapsnapshot` 文件中字段的含义。接下来将直接介绍这些字段的含义。

### Nodes

我们知道对象之间是有相互依赖关系的，所以选择 [Graph](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/ "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/") 作为数据结构可以保存它们依赖关系：

    let a = {};
    let b = {};
    let c = {};
    
    a.b = b;
    b.c = c;
    c.a = a;
    

上面代码中的对象关系表示为下图：

![obj_graph.drawio.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62b8159fd197446c81cccd4b36e3c69f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=284&h=442&s=20994&e=png&b=ffffff)

上图中：

*   圆圈即每个对象对应的 Node
    
*   箭头表示对象间的依赖关系，即 Edge
    

快照文件中的 `nodes` 和 `edges` 字段即存储了上图示意的 Nodes 和 Edges 信息。但有趣的是，文件中这两个数组都存储的是一连串数字，难以一眼看出它们之间的联系。

先看 nodes 数组中的内容，下面是其节选：

    {
      "nodes": [9,1,1,0,10,0 // 第一行
    ,9,2,3,0,23,0 // 第二行
      ]
    }
    

上面的内容，每一行都表示一个 node，行中的元素都是对象的属性值 `propVal`，与行中的属性值对应的对象的属性名 `propKey` 依次为：

    0. type
    1. name
    2. id
    3. self_size
    4. edge_count
    5. trace_node_id
    

以上面的第一个 node 为例，通过 `propKey(propVal)` 的形式可以将其中的属性表示为：

    0. type(9)
    1. name(1)
    2. id(1)
    3. self_size(0)
    4. edge_count(10)
    5. trace_node_id(0)
    

不过 `propVal` 并不是立即值，所谓立即值指的是这些数值可直接作为属性的值。换句话说 `propVal` 数字所指代的实际属性值存在另外的地方。那么为何这样设计呢？

以属性 `name` 为例，它表示的对象的构造函数的名称，假设这里保存的是字符串立即值，如果引擎中有 1000 个某构造函数实例，那么文件中就需要保存该函数名字符串的 1000 份拷贝。

因此，为了缩小快照文件的尺寸，同时也是保持对象之间在内存中的实际关联形式，快照文件格式在设计时，将字符串都保存到了 `strings` 数组中。比如上面例子中 `name` 位置的 1，实则用来表示 `strings` 中的元素索引。

为了达到上述的压缩效果，快照文件中设计了这 2 个字段：

*   `snapshot.meta.node_fields` 即上面提到的 propKey 列表
    
*   `snapshot.meta.node_types` 表示 propVal 实际值对应的类型
    

node 中的 `propVal` 和上面两个字段之间的关系可以表示成下图：

![heaps_nodes.drawio.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/865abafebaee4b0d9b95fd77954ab70f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1184&h=722&s=69087&e=png&b=ffffff)

比如我们要查看索引为 1000 的对象的 `name` 属性值，需要经过下面的步骤：

*   取 `name` 属性在数组 `snapshot.meta.node_fields` 中的索引，为 1
    
*   取 `snapshot.meta.node_fields` 数组的长度为 `6`
    
*   索引为 1000 的对象的第一个 `propVal` 在 nodes 数组中的索引为 `6000 = 1000 * 6`（因为 Node 的属性数量是固定的）
    
*   加上 `name` 属性在 Node 内的偏移量 1，对应的 `propVal` 索引为 `6001 = 1000 * 6 + 1`
    
*   取 `name` 属性在 `snapshot.meta.node_types` 中的类型，即 `snapshot.meta.node_types[1]` 的 `string`
    
*   于是 `string[nodes[6001]]` 即为目标 Node 的 `name` 属性的值
    

除了 `name` 之外，其余几个需要关注的字段为：

*   id，对象的 id，v8 会确保该对象在本次应用生命周期中的多次的 dump 下中保持相同的 id
    
*   self\_size，也就是上文提到的 shallow size
    
*   edge\_count，就是从该对象出去的边的条数，也就是子对象的数量
    

### Edges

edge 在快照文件中的处理方式与 node 类似，需将 edges 数组中的元素与下面的内容相结合：

*   `snapshot.meta.edge_fields` 表示 edge 的属性名
    
*   `snapshot.meta.edge_types` 表示 edge 的属性值类型
    

edge 的属性为：

    0. type
    1. edge_name_or_index(idx or stringId)
    2. to
    

有趣的是第 3 个属性 `to`，edge 作为边有两头，这里单单记录了 `to`，`from` 从何而来呢？

其实 `from` 来源于 nodes 和 edges 中的元素对应关系：

![heap_s_edge.drawio.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f4e0514838144be943c2ba7f9b2db6e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1604&h=600&s=72379&e=png&b=fffafa)

如上图所示，edges 中的元素顺序是与 nodes 中对应的，也就是先放 `node0` 的 edges，接着是 `node1` 的 edges 以此类推。

比如上图 `edge0` 的 `From` 就是 `nodes[0 + 2]`，其中：

*   `nodes` 表示 nodes 数组
    
*   `0` 的位置表示该 node 在 `nodes` 数组中的索引，为 0 也就是第一个元素
    
*   `2` 表示 `id` 属性在 `snapshot.meta.node_fields` 数组中的偏移量
    

`node0` 的 `edge_count` 对应的取值则为 `nodes[0 + 4]`：

*   `0` 的位置表示该 node 在 `nodes` 数组中的索引，为 0 也就是第一个元素
    
*   `4` 表示 `edge_count` 属性在 `snapshot.meta.node_fields` 数组中的偏移量
    

所以 `edges` 数组中，从 `0` 开始的 `node0.edge_count` 个 edge 的 `From` 都是 `node0.id`。

遍历前的准备
------

接下来我们只需将所有受 GC 管理的对象都找出来，按 `.heapsnapshot` 文件的格式输出即可。

在前面的章节中我们已经知道，引擎将所有受 GC 管理的对象都串联在了列表 `JSRuntime::gc_obj_list` 之上，所以我们需要遍历该列表。

我们在进行遍历时，势必需要一些容器型的数据结构来保存中间结果，比如 Hashmap。前面关于 JSObject 的章节中我们提到，由于 C 语言并不提供复杂的数据结构，当引擎实现中遇到这样的需求时（比如需要 Hashmap 时）有 2 中方式可选：

1.  复用为 JS 提供的数据结构（比如 JSObject）
    
2.  通过 C 语言重新实现一份
    

那么我们这里是否可以使用方式 1 呢？

答案是不行的。因为如果直接使用为 JS 提供的数据结构，会导致遍历 GC 对象时出现死循环。

比如，我们使用 JSObject 来存放 Node 的信息，假设当前 `gc_obj_list` 上的内容为：

    a
    

当处理 a 时，为了表示其 Node，我们创建了一个 GC 对象 `a_node`，于是 `gc_obj_list` 上的内容为：

    a_node
    

当处理到 `a_node` 时，为了表示其 Node，我们又需要创建新的 GC 对象 `a_node_node`：

    a_node_node
    

如此以来就造成 `gc_obj_list` 上始终有新的元素等待我们去遍历。

当然，我们可以对 JSObject 进行改造，通过一些标记区分，使其在表示 Node 时不追加到列表 `gc_obj_list` 之上。

但是，改造工作并不会很简单，因为要考虑到是否会影响引擎中其他部分的工作，比如引擎自带了统计内存 Summary 的功能，不加修改地使用 JSObject 势必也会影响其统计结果。

所以总的来说因为：

1.  直接使用 JS 数据结构会导致死循环
    
2.  使用修改的 JS 数据结构会引入脉络并不清晰的工作量
    

使得我们计划变为使用 C 语言实现我们所需的几个数据结构：

*   Allocator
    
*   String
    
*   Array
    
*   List
    
*   Hashmap
    

它们的定义和实现分别在文件 [kid.h](https://github.com/hsiaosiyuan0/slowjs/blob/main/src/utils/kid.h "https://github.com/hsiaosiyuan0/slowjs/blob/main/src/utils/kid.h") 和 [kid.c](https://github.com/hsiaosiyuan0/slowjs/blob/main/src/utils/kid.c "https://github.com/hsiaosiyuan0/slowjs/blob/main/src/utils/kid.c") 中。这些数据结构在工程中起到 kit 的作用，考虑到我们初期的实现非常 naive，所以文件取名为 kid。

下面我们简单地介绍一下它们的实现方式。

### Allocator

Allocator 的作用是使得我们 kid 中的数据结构支持自定义的内存分配器。

C 语言中我们一般会使用 [malloc](https://en.cppreference.com/w/c/memory/malloc "https://en.cppreference.com/w/c/memory/malloc") 和 [free](https://en.cppreference.com/w/c/memory/free "https://en.cppreference.com/w/c/memory/free") 等函数来向操作系统申请和释放内存。不过这类函数的实现并不是由操作系统直接提供的，它们是在操作系统提供的内存申请释放功能上做了封装。

这么做的目的简单来说，是因为操作系统直接提供的内存申请和释放操作具有一定的耗时，频繁地调用势必会有性能方面的影响，因此 malloc 之类的函数在系统调用之上做了一些封装，其内部实现了类似批量地对内存申请和释放的功能。

比如，应用程序想申请 3bytes 的内存时，malloc 可能会向操作系统一次申请 512bytes 的内存，后续应用申请内存时，只要之前申请的大小尚有余量，就不会发起系统调用。

这么来看，应用程序可以实现自己的 malloc 功能，增加一些自定义的逻辑，又或者实现更高效的对内存批处理的策略。我们的 kid 仿照引擎的实现方式，通过 Allocator 结构来支持自定义的内存分配器：

    typedef struct KidAllocator KidAllocator;
    typedef void *KidMallocFunc(void *opaque, size_t size);
    typedef void KidFreeFunc(void *opaque, void *ptr);
    typedef void *KidReallocFunc(void *opaque, void *ptr, size_t size);
    
    typedef struct KidAllocator {
      void *opaque;
      KidMallocFunc *malloc;
      KidFreeFunc *free;
      KidReallocFunc *realloc;
    } KidAllocator;
    

上面的代码包含了这些信息：

*   为了避免类型名发生冲突，我们给 kid 中的类型都加上了 `Kid` 前缀
    
*   字段 `opaque` 的作用是存放自定义分配器执行时所需的上下文。
    
*   自定义分配器需要实现 `malloc`、`free` 和 `realloc` 三个内存操作函数
    
    这些函数的定义位于结构体 `KidAllocator` 源码位置的上方，第一个形参均为 `void *opaque`，这是因为 C 语言不支持 OOP，需将上下文作为函数的第一个参数进行传递。
    
    换句话说，对于支持 OOP 的语言来说，可以简单地认为类方法的形参均有一个隐式传递的上下文对象
    

使用方式是，kid 的调用方先通过函数 `kid_set_allocator` 设置其所需的自定义分配器：

    static KidAllocator *allocator = NULL;
    
    void kid_set_allocator(KidAllocator *alloc) { allocator = alloc; }
    

然后 kid 中的结构需要申请内存时，使用下面的函数来简化参数的传递：

    void *kid_malloc(size_t size);
    void kid_free(void *ptr);
    void *kid_malloc(size_t size);
    

比如 `kid_malloc` 的实现为：

    void *kid_malloc(size_t size) {
      return allocator->malloc(allocator->opaque, size);
    }
    

### String

C 语言中一般可以使用 `char *` 表示字符串，但这要求字符串需以 `\0` 结尾，以便诸如统计字符串长度的函数 `strlen` 可以正常工作。

我们可以称这样的字符串为 CString，其有 2 个主要的缺点：

*   首先是字符串中间不能包含字符 `\0`，否则将被操作函数误认为是终止符而提前结束工作
    
*   其次是诸如函数 `strlen` 的复杂度是 O(n)，它必须线性扫描字符串内容，以找到表示结尾的字符 `\0`
    

为了解决上面的问题，我们将 String 实现为：

    typedef struct KidString {
      char *data;
      size_t len;
    } KidString;
    
    KidString kid_string_new(const char *data, size_t len) {
      char *d = NULL;
      if (len)
        d = kid_malloc(len);
    
      memcpy(d, data, len);
      return (KidString){d, len};
    }
    
    void kid_string_free(KidString str) { kid_free(str.data); }
    

*   我们通过值类型 `KidString` 来传递字符串内容 `data` 和其长度 `len`
    
*   函数 `kid_string_new` 则支持从 CString 创建 `KidString`，对于传入的 CString 我们会对其进行拷贝
    

### List

List 的实现我们参考了引擎中的 [list\_head](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/libs/list.h#L31 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/libs/list.h#L31") 系列方法，其定义为：

    struct KidListHead {
      KidListHead *prev;
      KidListHead *next;
    };
    
    static inline void kid_list_init_head(KidListHead *head) {
      head->prev = head;
      head->next = head;
    }
    

这里的 `KidListHead` 并不会被实例化，可以看成是一个接口（Interface），它要求 List 中的元素需要有字段 `prev` 和 `next`：

![list_item.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5edca717fc8c41d48b53276efa3afe31~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1912&h=392&s=40825&e=png&b=fefefe)

如上图所示，List 相关方法会操作元素的 `prev` 和 `next` 属性以构成一个双向链表。

List 并不需要显式地创建，而是作为其持有者的字段，比如前文提到的 `JSRuntime::gc_obj_list`，其形式为：

    struct JSRuntime {
      // ...
      struct list_head gc_obj_list;
      // ...
    }
    

List 和其持有者一并被创建后，需要通过函数 `kid_list_init_head` 进行初始化：

    static inline void kid_list_init_head(KidListHead *head) {
      head->prev = head;
      head->next = head;
    }
    

也就是将头尾都设置成自身，表示空状态：

![list_empty.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a90bec819f949b7be88dd54c4a3e1f6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=848&h=312&s=23491&e=png&b=fefefe)

往链表中添加元素则需要通过函数 `__kid_list_add` 完成：

    static inline void __kid_list_add(KidListHead *el, struct KidListHead *prev,
                                      KidListHead *next) {
      prev->next = el;
      el->prev = prev;
      el->next = next;
      next->prev = el;
    }
    

表示将 `el` 添加到 `prev` 与 `next` 之间，所以如果是往链表末尾追加元素，那么调用的方式为 `__kid_list_add(el, head->prev, head)`，其中参数：

*   `el` 表示要追加的元素
    
*   `head` 表示 List 自身，因此：
    
    *   `head->prev` 表示其尾部
        
    *   `head` 则表示其头部
        

对应的操作类似下图：

![list_add_tail.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3e1e678aaea43df9cd2acc2c171240c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1728&h=472&s=46070&e=png&b=fefefe)

在脑中转换 `prev` 和 `next` 确实比较累，所以上面的调用被封装到了函数 `kid_list_add_tail` 中：

    /* add 'el' at the end of the list 'head' (= before element head) */
    static inline void kid_list_add_tail(KidListHead *el, KidListHead *head) {
      __kid_list_add(el, head->prev, head);
    }
    

类似的还有函数 `kid_list_add`，表示将元素添加到链表的头部：

    /* add 'el' at the head of the list 'head' (= after element head) */
    static inline void kid_list_add(KidListHead *el, KidListHead *head) {
      __kid_list_add(el, head, head->next);
    }
    

为了访问链表中的元素，自然是需要对链表进行遍历，如果是正向遍历，则可以通过宏 `kid_list_for_each` 完成：

    #define kid_list_for_each(el, head)                                            \
      for (el = (head)->next; el != (__typeof__(el))(head); el = el->next)
    

比如上图中蓝色的箭头构成的环就表示正向遍历，很明显如果元素的 `next` 为表头，则表示遍历结束。

类似的，绿色的箭头构成的环表示反向遍历，反向遍历使用宏 `kid_list_for_each_prev`：

    #define kid_list_for_each_prev(el, head)                                       \
      for (el = (head)->prev; el != (__typeof__(el))(head); el = el->prev)
    

元素的删除也比较好理解，将待删除元素的前后的两个元素进行连接，并重置待删除的元素的 `prev` 和 `next` 字段：

    static inline void kid_list_del(KidListHead *el) {
      KidListHead *prev, *next;
      prev = el->prev;
      next = el->next;
      prev->next = next;
      next->prev = prev;
      el->prev = NULL; /* fail safe */
      el->next = NULL; /* fail safe */
    }
    

注意这里对待删除元素的字段重置操作，如果在遍历的过程中使用该函数，将无法完成遍历。以正向遍历为例：

1.  如果在迭代中调用了该函数，则 `el->next` 被设置为了 `NULL`
    
2.  而正向遍历的宏中下一个待遍历的元素是 `el = el->next`，会导致访问错误的内存位置
    

解决方式是使用上述宏带 `_safe` 后缀的版本，比如正向遍历的 `kid_list_for_each_safe`：

    #define kid_list_for_each_safe(el, el1, head)                                  \
      for (el = (head)->next, el1 = el->next; el != (__typeof__(el))(head);        \
           el = el1, el1 = el->next)
    

可见宏内采用的方式是进入迭代前先通过 `el1` 将下一个待遍历的元素保存起来，以免迭代内删除元素导致访问到错误的内存地址。

关于 List 最后一点需要介绍的是，其不要求 `prev` 和 `next` 字段在具体实现中使用固定的位置（比如不要求定义为首个字段）。这点是通过宏 `kid_list_entry` 完成的：

    /* return the pointer of type 'type *' containing 'el' as field 'member' */
    #define kid_list_entry(el, type, member)                                       \
      ((type *)((uint8_t *)(el)-offsetof(type, member)))
    

使用方式为：

    KidListHead *el;
    KidHashmapEntry *e;
    kid_list_for_each(el, bucket) {
      e = kid_list_entry(el, KidHashmapEntry, link);
    }
    

可以发现 `el` 的类型为 `KidListHead *`，换句话说，实际我们想操作的元素字段编译器并不能感知到，其看到的内容类似：

![list_offset.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3f128bf337c4d4ab90432919d050b37~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1722&h=122&s=21987&e=png&b=fcfcfc)

那么如果我们在迭代中要访问 `prop_x` 时需要怎么办？上述宏中使用的编译器提供的宏 `offsetof` 就是答案，该宏可以计算出 `member` 作为 `type` 的字段时，相对 type 首地址的偏移量。

我们通过下图来解释 `offsetof` 是如何起作用的：

![list_item_offset.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc6b64d3efa849019ac323f9d67e9330~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=842&h=420&s=28060&e=png&b=fefefe)

*   首先我们在迭代中已知 `el` 指向的内存地址
    
*   `offsetof` 可以计算出 `prev` 字段相对 `Item` 类型首地址的偏移量。换句话说也就是其之前的字段加上 Padding bytes 的字节数之和
    
    本例中假设 `prop_a` 字段占 1 字节，且与 `prev` 之间无需 Padding bytes，那么 offset 即为 1。这是在静态编译阶段可以算出来的
    
*   接着编译器就可以生成对应的指令，将 `el` 指向的地址、往低地址方向偏移 offset 个字节即可拿到 item 的首地址
    
*   得到 `item` 的首地址之后，当然就可以通过 `item->prop_x` 的形式访问到目标字段
    

### Array

Array 的实现用于使用连续的内存地址来存放元素，其定义为：

    typedef struct KidArray {
      void *slots;
      size_t slot_size;
      size_t len;
      size_t cap;
    } KidArray;
    

可以通过下图示意上面的结构：

![array.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fef036aaacd427799a7edc9348db8cc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=882&h=440&s=31699&e=png&b=fefefe)

*   `slots` 表示数组内用于存放元素的内存
    
*   `slot_size` 表示数组中每个元素所占的内存大小
    
*   `cap` 表示 `slots` 指向的内存可容纳的元素数量
    
*   `len` 则表示数组中的元素数量
    

创建数组时需要用户指定初始 `cap` 的大小，默认是 8 个元素：

    int kid_array_init(KidArray *arr, size_t slot_size, size_t cap) {
      if (!cap)
        cap = 8;
      arr->slot_size = slot_size;
      arr->cap = cap;
      arr->len = 0;
      arr->slots = NULL;
      return kid_array_grow(arr);
    }
    

后续往数组中添加元素之前，会通过函数 `kid_array_grow` 先检查 `cap` 是否有余量，如果没有则对其进行扩容：

    static int kid_array_grow(KidArray *arr) {
      if (arr->slots == NULL) {
        arr->slots = kid_mallocz(arr->slot_size * arr->cap);
      } else if (arr->len >= arr->cap) {
        if (arr->cap < 1024) {
          arr->cap += arr->cap;
        } else {
          arr->cap += arr->cap / 4;
        }
        arr->slots = kid_realloc(arr->slots, arr->slot_size * arr->cap);
      }
      return !arr->slots;
    }
    

上面的扩容策略比较简单：

*   如果 `cap` 小于 `1024`，那么就成倍地扩容
    
*   如果 `cap` 大于 `1024`，为了避免申请过多的内存，就按每次 1/4 的 cap 进行扩容
    

实际添加元素时，会将其内容拷贝到数组之上：

    int kid_array_push(KidArray *arr, void *item) {
      if (kid_array_grow(arr))
        return -1;
      int i = arr->len++;
      memcpy(arr->slots + (i * arr->slot_size), item, arr->slot_size);
      return i;
    }
    

### Hashmap

在 Hashmap 的实现中，为了解决 hash 的冲突文件，我们采用了 [Separate Chaining](https://en.wikipedia.org/wiki/Hash_table#Separate_chaining "https://en.wikipedia.org/wiki/Hash_table#Separate_chaining") 的策略，其数据结构为：

    struct KidHashmap {
      KidListHead keys;     // List<KidHashkey*>
      KidListHead *buckets; // Array<List<KidListHead>>
    
      KidHashmapKeyCopyFunc *key_copy;
      KidHashmapKeyFreeFunc *key_free;
      KidHashmapValueFreeFunc *value_free;
    }
    

可以通过下图演示上述结构中的 `buckets`：

![hashmap.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d850fef38544036a77567c484d57ce9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=882&h=582&s=46542&e=png&b=fefefe)

`buckets` 可以看成是一个垂直方向的数组，数组中的每个元素表示水平方向的 bucket，其类型为 List，所以简单来说 `buckets` 数组中的元素均为 List 结构的 head。

发生 hash 冲突时的工作方式如下：

*   比如某个 key 的 hash 为 19
    
*   经过 `19 % 6` 得到其应该放置在下标为 1 的 bucket 中，其中 6 为 buckets 数组的长度
    
*   接着添加另一个 key，其 hash 为 343
    
*   经过 `343 % 6` 得到其同样应该放置在下标为 1 的 bucket 中，于是追加到相应的列表中
    

查找元素时的操作如下：

*   比如要查找的元素 key 的 hash 为 343
    
*   经过 `343 % 6` 得到其存在于下标为 1 的 bucket 中
    
*   因为 bucket 的结构为 List，所以会继续迭代 List 中的元素，进行线性地查找
    

这里有个可以改进的地方，在目前的实现中，bucket 使用的结构 List 中的元素的内存地址是离散的，无法充分利用 CPU 缓存。不过既然我们是一个 naive 实现，能用就可以了。

hashmap 中另一个会影响性能的点是 hash 函数的选取。结合上图，我们希望 hash 函数的结果可以均匀地落在所有的 bucket 上，否则如果集中在某几个 bucket 上会导致其中的元素数量堆积过多，对该 bucket 进行线性查找时性能变差。

我们的 hashmap 采用了在 Unix 系统中广泛使用的 hash 函数 [elf\_hash](https://github.com/hsiaosiyuan0/slowjs/blob/main/src/utils/kid.c#L85 "https://github.com/hsiaosiyuan0/slowjs/blob/main/src/utils/kid.c#L85")，它实现简单且结果分布相对均匀，至于为何有这样的表现我们就不展开讨论了，只需知道该函数的返回值不会大于 `0x0FFFFFFF`，利用这点我们可以不用重复计算某个 key 的 hash 值：

    unsigned int kid_hashmap_hash(KidHashkey *key) {
      if (key->hash & 0x80000000) {
        key->hash = elf_Hash(key->opaque, key->size) & KID_HASHMAP_BUCKETS_MASK;
      }
      return key->hash;
    }
    

不大于 `0x0FFFFFFF` 即高 4 位 bits 均为 0，所以我们可将 `key->hash` 的默认值设置为 `0xFFFFFFFF`，然后通过查看其最高位是否为 1 来判断是否已经计算过 hash。

KidHashmap 中另外几个字段的作用是：

*   `keys` 使用 List 存放了 hashmap 中所有的 key，因为我们需要对 keys 进行遍历
    
*   `key_copy` 和 `key_free` 为用户自定义的函数，用于指定往 hashmap 中增加 key 时的所需的内存操作
    
    kid 中提供了两个默认实现，即函数 [kid\_hashmap\_key\_shallow\_copy](https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/utils/kid.c#L147 "https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/utils/kid.c#L147") 和 [kid\_hashmap\_key\_shallow\_free](https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/utils/kid.c#L160 "https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/utils/kid.c#L160") 可对 key 做浅拷贝
    
*   `value_free` 为用户指定的自定义函数，用于指定 hashmap 释放 value 所占的内存之前执行自定义的资源释放逻辑
    

遍历 GC 对象
--------

介绍完遍历所需的数据结构之后，我们来看看如何对 GC 对象进行遍历。

首先看看用于保存 nodes 和 edges 的结构：

    typedef struct JSGCDumpEdge {
      uint8_t type;
      uint32_t name_or_idx;
      size_t to;
    } JSGCDumpEdge;
    
    #define NODE_FIELD_COUNT 5
    
    typedef struct JSGCDumpNode {
      size_t id;
      JSAtom name;
      uint16_t type;
      size_t self_size;
      KidArray edges; // Array<JSGCDumpEdge>
    } JSGCDumpNode;
    

这两个结构比较简单，基本就是上文 `.heapsnapshot` 文件中的 node 和 edge 所需的信息。

继续看看遍历时存放上下文信息的结构：

    typedef struct JSGCDumpContext {
      JSContext *jc;
      KidAllocator kid_allocator;
      KidArray nodes;
      size_t edges_len;
    
      KidArray strs;     // Array<KidString>
      KidHashmap str2id; // Hashmap<JSString*, int>
    
      KidHashmap obj2node; // Hashmap<obj_ptr, JSGCDumpNode*>
    } JSGCDumpContext;
    

上述结构中的字段作用为：

*   `jc` 为 `JSContext`，引擎中的一些函数需要用到该参数
    
*   `kid_allocator` 为上文介绍的用户自定义的内存分配器
    
*   `nodes` 数组即 `.heapsnapshot` 中所需的 nodes
    
*   `edges_len` 表示全部 `nodes` 之间的 edge 数量
    
    我们在遍历的时候，先将对象的关系都存放在 `JSGCDumpNode::edges` 中，等输出到 `.heapsnapshot` 文件时需要将 node 中的 edges 都拎出来放到单独的数组，这里 edges\_len 记录数组长度后，方便创建 edges 数组时的内存分配
    
*   `strs`，输出到 `.heapsnapshot` 中的字符串数组
    
    上文提到 `.heapsnapshot` 中会将字符串都存放到一个数组中，`propVal` 则存放的是字符串数组的元素索引
    
*   `str2id` 用于和 `strs` 配合，存放字符串与其在 `strs` 数组中的索引的映射关系，以便将索引作为 `propVal` 的值
    
*   `obj2node` 字段存放的是 GC 对象与其对应的 node 之间的映射关系
    

### 主要遍历过程

主要的遍历通过函数 [\_\_js\_gcdump\_objects](https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/vm/gc.c#L2142 "https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/vm/gc.c#L2142") 完成：

    void __js_gcdump_objects(JSContext *ctx) {
      // 1
      JSRuntime *rt = ctx->rt;
      struct list_head *el;
      JSGCDumpContext *dc = js_gcdump_new_ctx(ctx);
    
      // 2
      // make sure ctx is root node with index 0
      js_gcdump_node_from_gp(dc, ctx);
    
      // 3
      list_for_each(el, &rt->gc_obj_list) {
        JSGCObjectHeader *gp = list_entry(el, JSGCObjectHeader, link);
        int node_i = js_gcdump_node_from_gp(dc, gp);
        assert(node_i >= 0);
    
        JS_GCDumpFuncContext dctx = {0};
        dctx.dc = dc;
        dctx.parent = -1;
    
        js_gcdump_process_obj(rt, gp, dctx);
        dctx.parent = node_i;
        gcdump_children(rt, gp, js_gcdump_process_obj, dctx);
      }
    
      // 4
      js_gcdump_write2file(dc);
    
      // 5
      for (int i = 0, len = dc->nodes.len; i < len; i++) {
        JSGCDumpNode *node = kid_array_el(&dc->nodes, JSGCDumpNode, i);
        kid_array_free(&node->edges);
      }
      kid_array_free(&dc->nodes);
    
      for (int i = 0, len = dc->strs.len; i < len; i++) {
        KidString str = *kid_array_el(&dc->strs, KidString, i);
        kid_string_free(str);
      }
      kid_array_free(&dc->strs);
    
      kid_hashmap_free(&dc->str2id);
      kid_hashmap_free(&dc->obj2node);
    
      kid_set_allocator(NULL);
      js_free_rt(rt, dc);
    }
    

上面的函数体对应的解释为：

*   首先是位置 `1`，初始化遍历所需的上下文对象
    
*   接着进入位置 `2`，先需要先处理 `ctx`，使其对应的 node 索引为 0，作为其他 GC 对象的 root
    
*   然后进入位置 `3` 开始遍历所有 GC 对象
    
*   完成所有 GC 对象的遍历即进入位置 `4`，此时待输出的 nodes 和 edges 等信息已经都存放在了上下文对象 `dc` 中。调用 `js_gcdump_write2file` 传入 `dc` 输出最终的 `.heapsnapshot` 文件
    
*   GC Dump 的主任务到这里已经完成，位置 `5` 之后的内容均为对所占资源的释放
    

### 先处理 JSContext

在上面主要遍历过程的位置 `2` 处提到，需先处理 JSContext。这是为了 DevTools 中的 Distance 可以正确地展示：

![dev_tools_distance.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d381a119c81f4fc598929e65e9d502fd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1834&h=556&s=161462&e=png&b=ffffff)

我们输出的 `.heapsnapshot` 文件并未包含 Distance 信息，它是由 DevTools 的前端代码 [计算](https://chromium.googlesource.com/devtools/devtools-frontend/+/09314f8963459f9c0d9db960b10090beb38ef4bc/front_end/entrypoints/heap_snapshot_worker/HeapSnapshot.ts#1062 "https://chromium.googlesource.com/devtools/devtools-frontend/+/09314f8963459f9c0d9db960b10090beb38ef4bc/front_end/entrypoints/heap_snapshot_worker/HeapSnapshot.ts#1062") 出来的。我们只需包含对象间的关系是正确的即可，那为何使用 JSContext 作为 root 呢？基于下面 2 点：

1.  JSContext 本身也是存在于 `JSRuntime::gc_obj_list` 之上的 GC 对象
    
2.  诸如 `gloabl` 之类的对象都挂在它下面，即 [JSContext::global\_obj](https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L296 "https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L296")
    

函数 [js\_gcdump\_node\_from\_gp](https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/vm/gc.c#L2142 "https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/vm/gc.c#L2142") 的签名为：

    int js_gcdump_node_from_gp(JSGCDumpContext *dc, void *gp);
    

参数 `gp` 表示的是待处理的 GC 对象的内存地址，函数会使用该地址作为键去 `JSGCDumpContext::obj2node` 中查找元素：

*   如果找到相应的 node，则返回 node 在 nodes 数组中对应的索引
    
*   反之找不到，则新增一个 node 到 nodes 数组中，将映射关系存放到 `JSGCDumpContext::obj2node` 后将 node 的索引返回
    

在位置 `2` 处先对 JSContext 调用函数 `js_gcdump_node_from_gp` 即可将 nodes 中索引为 0 的元素与 JSContext 进行关联。

简单地说，`js_gcdump_node_from_gp` 的作用是为 GC 对象创建关联的 node，相对于现在 nodes 数组中中占个位置，尚未涉及到实际对 GC 对象的处理。

因为 JSContext 对象也存在于 `JSRuntime::gc_obj_list` 之上，所以实际对其的处理会在位置 `3` 处的遍历中完成。

### 处理 GC 对象

接下来会进入遍历 `JSRuntime::gc_obj_list` 列表的过程，其中包含了实际的 GC 对象处理操作：

    list_for_each(el, &rt->gc_obj_list) {
      JSGCObjectHeader *gp = list_entry(el, JSGCObjectHeader, link);
      // 1
      int node_i = js_gcdump_node_from_gp(dc, gp);
      assert(node_i >= 0);
    
      // 2
      JS_GCDumpFuncContext dctx = {0};
      dctx.dc = dc;
      dctx.parent = -1;
    
      // 3
      js_gcdump_process_obj(rt, gp, dctx);
    
      // 4
      dctx.parent = node_i;
      gcdump_children(rt, gp, js_gcdump_process_obj, dctx);
    }
    

对应的解释如下：

*   首先在位置 `1` 处，先为 GC 对象创建对应的 node
    
*   在位置 `2` 处创建处理对象所需的上下文，因为需要调用另外的函数来进行处理
    
*   位置 `3` 处的函数 `js_gcdump_process_obj` 内会根据 GC 对象所属的不同类型，完成差异化的处理。
    
*   位置 `4` 则用于处理对象持有的子对象，会先在上下文中记录 parent 信息，`gcdump_children` 函数将以深度优先的方式，完成子对象的遍历
    

举个例子，假设 `gc_obj_list` 有 a~g 共 7 个对象，它们的关系如下：

    ├── a
    │   ├── c
    │   │   └── e
    │   │       └── g
    │   └── f
    ├── b
    └── d
    

它们被遍历时的顺序如下图中蓝色的数字所示，

![gc_bfs.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98bf5c8edda143f6aa06664bd902e682~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1362&h=382&s=40805&e=png&b=fefefe)

继续看一下处理 GC 对象的函数 [js\_gcdump\_process\_obj](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L1778 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L1778")，其中主要的逻辑如下：

    void js_gcdump_process_obj(JSRuntime *rt, void *cell,
                               JS_GCDumpFuncContext dctx) {
      // ...
      // 1
      if (tag == JS_TAG_STRING) {
        node->type = JSGCDumpNode_TYPE_STRING;
        node->name = js_gcdump_add_str(dc, (JSString *)cell);
        node->self_size = ((JSString *)cell)->len;
      } else {
        JSGCObjectHeader *gp = cell;
    
        switch (gp->gc_obj_type) {
          case JS_GC_OBJ_TYPE_JS_OBJECT: {
            // ...
            // 2
            node->type = JSGCDumpNode_TYPE_OBJECT;
            JSValue obj = JS_MKPTR(JS_TAG_OBJECT, objp);
            if (JS_IsArray(dc->jc, obj) &&
                objp != JS_VALUE_GET_PTR(dc->jc->class_proto[JS_CLASS_ARRAY])) {
              node->type = JSGCDumpNode_TYPE_ARRAY;
            } else if (JS_IsFunction(dc->jc, obj)) {
              node->type = JSGCDumpNode_TYPE_CLOSURE;
            }
            // ...
          }
          case JS_GC_OBJ_TYPE_VAR_REF: // ...
          case JS_GC_OBJ_TYPE_FUNCTION_BYTECODE: // ...
          // ...
        }
      }
    }
    

上述代码简化版，通过 `if` 和其中的 `switch-case` 不难看出，函数的作用是根据 GC 对象的不同类型，进行差异化处理。典型的差异如：

*   位置 `1` 处，若满足条件 `tag == JS_TAG_STRING` 则为 JS 字符串，需将其添加到 `.heapsnapshot` 文件的 strings 数组中，
    
*   node 上的 type 属性值会影响 node 在 DevTools 上的展示效果，所以需在位置 `2` 处根据 GC 对象的不同类型，设置不同的 type
    

### 处理 GC 对象的子对象

深度遍历子对象通过函数 [gcdump\_children](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L1546 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L1546") 完成：

    static void gcdump_children(JSRuntime *rt, JSGCObjectHeader *gp,
                                JS_GCDumpFunc *walk_func,
                                JS_GCDumpFuncContext dctx) {
      switch (gp->gc_obj_type) {
      case JS_GC_OBJ_TYPE_JS_OBJECT: {
        // ...
        /* mark all the fields */
        prs = get_shape_prop(sh);
        for (i = 0; i < sh->prop_count; i++) {
          // ...
        }
        // ..
      } break;
      case JS_GC_OBJ_TYPE_FUNCTION_BYTECODE:
        /* the template objects can be part of a cycle */
        {
          JSFunctionBytecode *b = (JSFunctionBytecode *)gp;
          int i;
          for (i = 0; i < b->cpool_count; i++) {
            JS_GCDumpValue(rt, b->cpool[i], walk_func, dctx);
          }
          // ...
        }
        break;
      case JS_GC_OBJ_TYPE_VAR_REF: // ...
      // ...
      }
    }
    

不同类型的对象持有子元素的形式不同，因此上面的函数会根据不同的对象类型进行差异化处理。典型的差异比如：

*   如果 GC 对象的类型为 `JS_GC_OBJ_TYPE_JS_OBJECT`，则为一般的 JS 对象，那么可以通过其 shape 中记录的信息访问到其属性，进而触达子对象
    
*   如果 GC 对象的类型为 `JS_GC_OBJ_TYPE_FUNCTION_BYTECODE`，则表示引擎内用于存放函数元信息的对象，对应的 C 类型为 `JSFunctionBytecode`，其中的字段 `cpool` 则持有了子对象
    

函数中处理子对象时使用的函数为 `JS_GCDumpValue`：

    void JS_GCDumpValue(JSRuntime *rt, JSValueConst val, JS_GCDumpFunc *walk_func,
                        JS_GCDumpFuncContext dctx) {
      if (JS_VALUE_HAS_REF_COUNT(val)) {
        switch (JS_VALUE_GET_TAG(val)) {
        case JS_TAG_OBJECT:
        case JS_TAG_FUNCTION_BYTECODE:
        case JS_TAG_STRING:
          walk_func(rt, JS_VALUE_GET_PTR(val), dctx);
          break;
        default:
          break;
        }
      }
    }
    

`walk_func` 在运行阶段为函数 `js_gcdump_process_obj`，以此完成对子对象的深度优先遍历。以上面的 a~g 对象为例：

*   首先进入调用 `js_gcdump_process_obj(a)` 处理对象 a，内部处理完 a 之后，调用函数 `gcdump_children` 处理 a 的子对象，_调用尚未返回_
    
    *   `gcdump_children(a)` 会遍历 a 的子对象，首先是处理对象 c，使用的函数也为 `js_gcdump_process_obj`，_调用尚未返回_
        
        *   在 `js_gcdump_process_obj(c)` 内部处理完 c 之后，又继续调用函数 `gcdump_children` 处理 c 的子对象，_调用尚未返回_
            
            *   `gcdump_children(c)`，_调用尚未返回_
                
                *   `js_gcdump_process_obj(e)`，_调用尚未返回_
                    
                    *   ...

了解上面的调用关系后，不难发现一个缺陷 - 将 JS 对象的嵌套层数和 C 函数的递归调用栈耦合了。

站在引擎的角度，并不能够限制业务代码中的 JS 对象的嵌套层数，一旦层数过多，可能就会引发 C 函数调用栈的溢出。我们的 GC Dump 作为实践的目的，这样的改进就留给有兴趣的读者自行来完成了。

注册函数
----

我们的 GC Dump 功能是一个 C 函数，将其注册到 JS 环境中即可达到通过 JS 函数完成导出的效果：

    void js_std_add_helpers(JSContext *ctx, int argc, char **argv) {
      // ...
      JS_SetPropertyStr(
          ctx, global_obj, "__js_gcdump_objects",
          JS_NewCFunction(ctx, js_gcdump_objects, "__js_gcdump_objects", 0));
      // ...
    }
    

上面的代码比较简单：

*   通过 `JS_NewCFunction` 调用，使用 CFunction 对函数 `js_gcdump_objects` 进行封装
    
*   将封装后的 CFunction 注册到全局对象 `global_obj` 即可
    

编译运行
----

可以通过下面的指令编译引擎源码：

    cmake -S . --preset=default
    cmake --build --preset=qjs
    

编译后的结果将存放在 `./build/qjs/qjs`。

接着我们准备一个测试脚本 `test.js`：

    var o = {
      a: { a1: { a2: 1 } },
      b: { b1: { b2: 1 } },
      c: function () {
        return 1;
      },
      d: new ArrayBuffer((1 << 20) * 50, 0),
      e: new Uint16Array((1 << 20) * 50, 0),
    };
    
    __js_gcdump_objects();
    print(o); // retain the obj to prevent it from being freed
    

然后使用编译后的引擎执行上述脚本：

    ./build/qjs/qjs tmp_test.js
    

接着将导出的快照文件导入到 DevTools 中即可：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ba79051147f4ccc99280f1328591a6f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2320&h=2030&s=241112&e=png&b=fefefe)

载入后会看到类似下面的效果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fd723d0ae17440bb41547c6484f6c3a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2304&h=2030&s=615197&e=png&b=ffffff)

小结
--

本节我们介绍了 GC Dump 的实现过程，回头来看其实并不复杂，不夸张地说只有 2 步：

1.  了解 `.heapsnapshot` 文件的格式
    
2.  遍历 GC 对象将它们的信息按格式输出即可
    

在上面的框架上增加了一些细节之后，情况才变得有点复杂。比如我们需要使用 C 语言来实现一些数据结构，并且还需要梳理 GC 对象有哪些类型，每种类型的又是以何种形式持有子对象等等。

既然是实践，遇到暂时不好理解的细节点时，大家可以打开 [gc.c](https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/vm/gc.c#L1378 "https://github.com/hsiaosiyuan0/slowjs/blob/b4b38611b4fa981febce46c7ab44757c63f2c7e5/src/vm/gc.c#L1378") 的代码，辅以断点调试，动起手来操作加深理解。