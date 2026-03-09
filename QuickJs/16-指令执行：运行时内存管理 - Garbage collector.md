在了解引擎是如何实现 GC 之前，我们先对 GC 的基本概念进行简单的介绍。

编程语言的规范中（比如 [ECMAScript Spec](https://tc39.es/ecma262/ "https://tc39.es/ecma262/")）对语法和语义做了比较详细的规定，在一些不影响语法语义的方面则留给实现方足够的空间，比如 GC。

GC 既可以表示垃圾回收器（Garbage collector），也可以表示「垃圾回收」的动作（Garbage collection）。可以将 GC 理解成运行在应用程序内部的负责内存管理的子程序。

为什么需要 GC
--------

由于内存是有限的，那么当一块内存不再使用时，势必需要对其进行释放。

通常来说应用程须经过操作系统来操作内存，操作系统提供的内存位置有 2 种：

*   栈内存
    
*   堆内存
    

栈内存会由操作系统进行自动管理。当调用结束后，占据的栈内存也会被自动释放（可被继续重复使用）。

栈内存的可用大小是有限的，根据不同的操作系统（Windows，Linux 或者嵌入式系统），不同的设定（编译参数，或者 `ulimit`）等会有所不同。

有时应用程序并不能准确的知道输入的大小（比如接收用户的任意键盘输入），这时就需要使用到堆内存。堆内存的大小一般来说不受限制，但内存的释放需由应用程序主动完成。

手动管理堆内存增加了应用程序开发者的心智负担，因为：

*   如果忘记释放内存，会导致无用的数据持续占据内存，进而降低内存的利用率，间接地降低程序执行的效率
    
*   如果一块内存不小心被多次释放，那么可能会导致程序运行异常：
    
    *   第一次释放使得该内存可被其他逻辑复用
        
    *   第二次释放时该内存时，由于其可能已经被其他逻辑复用，会导致正在使用中的数据被意外释放
        

GC 的主要指标
--------

因为手动管理内存的复杂度，自然就需要一些方式来简化内存管理，GC 则是其中一种方式。

GC 的运行是有一定的额外开销的，因为 GC 算法的执行需要消耗一定程度的 CPU 和内存。

衡量 GC 性能的主要指标是：

*   吞吐量，指的是单位时间内 GC 可以处理的内存大小
    
*   最大暂停时间，指的是 GC 在执行期间需将应用程序的执行暂停的最长时间
    
*   内存利用率，GC 内部使用的算法通常需要一些额外的内存来辅助计算，这样的内存消耗越少自然留给应用程序的内存空间就越大
    

虽然 GC 有一定的开销，但也不能轻易地将 GC 和低效画上等号，效率是一个相对概念，比如 [Zing](https://www.zhihu.com/question/24938498/answer/36055851 "https://www.zhihu.com/question/24938498/answer/36055851") 就支持 2TB 的堆，最大暂停时间可以控制在 10ms 内。

关于 GC 的更多细节大家可以参考:

*   [垃圾回收的基本知识](https://learn.microsoft.com/zh-cn/dotnet/standard/garbage-collection/fundamentals "https://learn.microsoft.com/zh-cn/dotnet/standard/garbage-collection/fundamentals")
    
*   [垃圾回收的算法与实现](https://item.jd.com/12010270.html "https://item.jd.com/12010270.html")
    
    这本书对 GC 进行了循序渐进地介绍，包含了常见的 GC 算法，并剖析了一些热门语言的常见运行时实的 GC 实现细节。
    

引用计数
----

引擎中使用的 GC 算法为「引用计数 Reference counting」。引用计数作为 GC 算法中的基础算法，具有简单实用的特点，它的缺点是在对象的头部需要占据一部分空间来存放 GC 信息，也就是前文提到的 [JSGCObjectHeader](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L227 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L227")。

引用计数算法的原理很简单：

*   每个对象都有一个「引入计数」的属性，表示该对象被其外部引用的次数
    
*   每当对象新增一个外部引用，那么其引用计数就加 1
    
*   反之，每当对象减少一个外部引用，那么其引用计数就减 1
    
*   当一个对象的引用计数为 0 时，表示该对象不再被其外部引用，则该对象称为非活动对象（垃圾），其所占内存需要被 GC 回收
    

比如下面的例子：

    function f() {
      let a = {}; // 1
      a = null; // 2
    }
    

在上面的代码中：

*   位置 `1` 的部分执行时，首先是先创建一个新的对象 objobjobj，然后将变量 `a` 绑定到该对象，此时对象 objobjobj 的引用计数为 1
    
*   到了位置 `2` 处，通过将 `a` 赋值为 `null` 解除了 `a` 对 aaa 的绑定，因此 objobjobj 的引用计数变为 0
    

于是 objobjobj 成了非活动对象，会在未来的某个时刻被 GC 回收，上面的过程可以通过下图来演示：

![ref_count_basic](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2569f1faa0643fd935ef4b374386cd6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1082&h=462&e=png&b=ffffff)

### 计数操作

引擎中使用的是基于栈的虚拟机，因此操作数都会先压入操作数栈，将操作数压入操作数栈时已经增加了其引用计数，所以在完成绑定的指令中将不会继续增加引用计数。

比如下面的代码：

    let a = {}; // 1
    let b = a;  // 2
    

*   在位置 `1` 等号右侧，新创建的对象 objobjobj，并将其加入操作数栈，此时其引用计数为 1
    
*   在位置 `1` 等号左侧，完成变量的绑定，该操作是通过指令 `OP_put_loc` 完成，不会增加引用计数
    
*   到了位置 `2` 等号右侧，通过指令 `OP_get_loc` 获取变量的绑定内容，将其引用计数加 1 后压入操作数栈，此时 objobjobj 的引用计数变为了 2
    
*   到了位置 `2` 等号左侧，完成变量的绑定，不继续增加引用计数
    

上面的操作结果可以表示为下图：

![ref_count_inc](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5b80bab11344537818ffa2253c682d6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=442&h=462&e=png&b=ffffff)

另外，在完成变量的绑定时，还需要将变量的原本绑定的内容引用计数减 1。比如下面的代码：

    let a = {}; // obj1
    let b = {}; // obj2
    b = a;
    

执行的过程可以表示为下图：

![ref_count_dec](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/547e7187c72d42eabfed48a8544cf478~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1922&h=462&e=png&b=ffffff)

为了正确地完成绑定，需要先对新绑定的内容进行引用计数加 1，然后再将变量原本绑定的内容的引用计数减 1。比如下面的代码：

    let a = {}; // obj
    a = a;      // 1
    

在位置 `1` 处，变量 `a` 原本绑定的内容和新绑定的内容都是 objobjobj，如果先将原本绑定内容的引用计数减 1，会使得 objobjobj 的引用计数变为 0，进而成为非活动对象被 GC 释放，也就无法继续进行赋值操作。

### 循环引用

引用计数算法的另一个缺点在于，无法避免「循环引用 Reference cycle」。考虑下面的代码：

    function f() {
      let a = {};
      a.a = a;
    }
    

在上面的代码中，由于 `a` 的属性又引用了自身，导致形成了循环引用，当 `a` 不再被外部引用时，其引用计数不会降为 0，因而无法被 GC 回收：

![ref_cycle_direct](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28dfdc1f22cf490faaf4e0020361ebe3~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1368&h=558&e=png&b=ffffff)

上面的循环引用形式也称为直接循环引用，我们再看一个间接循环引用的例子：

    function f() {
      let a = {}; // obj1
      let b = {}; // obj2
      let c = {}; // obj3
    
      a.b = b;
      b.c = c;
      c.a = a;
    }
    

上面的循环引用关系可以表示为：

![ref_cycle_indirect](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c4bd1c561c9439dae60acc4bac4e11c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1732&h=598&e=png&b=ffffff)

当这些对象不再被外部引用时，会因为循环引用导致引用计数无法清零：

![ref_cycle_indirect_break](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/913919e51de94aa29996fed2ce92ce6a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1732&h=598&e=png&b=ffffff)

### 标记清除

为了解决引用计数的循环引用问题，引擎搭配了标记清除算法。

标记清除算法的核心就是利用了「活动对象」的概念，既然 GC 负责回收的对象为非活动对象，那么将活动对象进行标记，剩下的即为非活动对象。

活动对象简单地说，即正在被应用程序使用的对象，应用程序本质上是执行一系列计算，那么正在运行的计算所涉及的对象，即为活动对象。

为了方便描述，将正在运行的计算直接引用的对象称为 Roots。我们从 Roots 开始进行标记，接着是它们的属性的引用，然后是属性的引用的引用，以此类推，未被标记的对象即为非活动对象。

比如将调用栈中的内容作为 Roots：

![gc_roots](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/494425e3812b4320b6252761fa4ef450~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1242&h=432&e=png&b=fefefe)

调用栈中的内容为正在进行中的计算所涉及的对象，我们将其作为 Roots 标记可以触达的对象，标记完成后，无法触达的对象（比如 `a` 和 `e`）即为非活动对象

GC 实现
-----

接下来我们开始探究 GC 在引擎层面的实现方式，首先看基本的引用计数增减方式。

在引用计数算法中，对象引用计数值的增减，表示对该对象的引用关系的增减。

在前面的章节中我们知道，引擎内部的方法通常会使用 `JSValue` 来传递对象：

    typedef union JSValueUnion {
      int32_t int32;
      double float64;
      void *ptr;
    } JSValueUnion;
    
    typedef struct JSValue {
      JSValueUnion u;
      int64_t tag;
    } JSValue;
    

这样的好处是对于 JS 的数值类型，采用传值的方式（通过 `JSValueUnion::int32` 和 `JSValueUnion::float64`）避免间接寻址。

所以在进行引用计数的增减时，也是先操作的 `JSValue`，因此有了这几个方法：

*   [JS\_DupValue](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L720 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L720")
    
*   [JS\_DupValueRT](https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L728 "https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L728")
    
*   [JS\_FreeValue](https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#LL702C26-L702C26 "https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#LL702C26-L702C26")
    
*   [JS\_FreeValueRT](https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L711 "https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L711")
    

函数和它有 `RT` 的版本在功能上没有差别，不带 `RT` 的形参是 `JSContext*`，而带 `RT` 版本使用 `JSRuntime*`。

`JS_DupValue` 和 `JS_DupValueRT` 函数的第一个参数在内部都没有使用到，因为它们只是将 `JSValue` 进行了传值拷贝，并且如果 `JSValue` 存在对象指针的话，将对应的对象引用计数加 1。

引用计数的减少则可能会需要释放内存，因此 `JS_FreeValue` 和 `JS_FreeValueRT` 函数的第一个参数是会被内部使用到的，这两个函数负责将对象的引用计数减一，如果计数降为了 0，则调用函数 [\_\_JS\_FreeValueRT](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L795 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L795") 释放对象。

以函数 `JS_FreeValue` 为例：

    void __JS_FreeValue(JSContext *ctx, JSValue v) {
      __JS_FreeValueRT(ctx->rt, v);
    }
    
    static inline void JS_FreeValue(JSContext *ctx, JSValue v) {
      if (JS_VALUE_HAS_REF_COUNT(v)) {
        JSRefCountHeader *p = (JSRefCountHeader *)JS_VALUE_GET_PTR(v);
        if (--p->ref_count <= 0) {
          __JS_FreeValue(ctx, v);
        }
      }
    }
    

### 内存释放

当对象的引用计数降为 0 时，会调用函数 `__JS_FreeValueRT`：

    void __JS_FreeValueRT(JSRuntime *rt, JSValue v) {
      uint32_t tag = JS_VALUE_GET_TAG(v);
      // ...
      switch (tag) {
      case JS_TAG_STRING: {   // 1
        JSString *p = JS_VALUE_GET_STRING(v);
        if (p->atom_type) {
          JS_FreeAtomStruct(rt, p);
        } else {
          // ...
          js_free_rt(rt, p);
        }
      } break;
      case JS_TAG_OBJECT:     // 2
      case JS_TAG_FUNCTION_BYTECODE: {
        JSGCObjectHeader *p = JS_VALUE_GET_PTR(v);
        if (rt->gc_phase != JS_GC_PHASE_REMOVE_CYCLES) {
          list_del(&p->link);
          list_add(&p->link, &rt->gc_zero_ref_count_list);
          if (rt->gc_phase == JS_GC_PHASE_NONE) {
            free_zero_refcount(rt);
          }
        }
      } break;
      // ...
      }
    }
    

可以发现：

*   如果不存在对其他对象的引用，比如位置 `1` 处的 String value，那么直接通过函数 `js_free_rt` 释放其占用的内存
    
*   反之，如果存在对其他对象的引用，则需要执行位置 `2` 处的操作，在 GC 阶段为非标记清除时，将对象添加到 `gc_zero_ref_count_list` 列表后调用函数 `free_zero_refcount`
    
    在目前的引擎实现中，对其他对象的引用源头皆为 `JS_TAG_OBJECT` 或 `JS_TAG_FUNCTION_BYTECODE`
    
*   另外还需要注意的是，元素是添加到了 `gc_zero_ref_count_list` 列表的开头
    

### gc\_zero\_ref\_count\_list

添加到 `gc_zero_ref_count_list` 中的目的是为了避免标记过程中的 C 函数调用嵌套过深：

![refcount_dec](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/873cb52a1bbf427dbaa91bbc2825b59e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=656&h=162&e=png&b=ffffff)

比如上图中的情况：

*   因为 `a` 的引用计数归 0，所以需要处理 `a` 的属性 `b`
    
*   而属性 `b` 对应的对象引用计数也归 0，因而需要继续处理其属性，以此类推
    

假设引擎中使用 C 函数 FFF 来递归地处理对象的属性，那么 JS 对象的嵌套层数和函数 FFF 递归调用的层数就会耦合到一起，如果 JS 对象的嵌套层数过多，会产生相同数量的 FFF 嵌套调用，可能会导致调用栈溢出。

为了解决上述问题，引擎通过 3 个主要函数：

*   `__JS_FreeValueRT`
    
*   `free_zero_refcount`
    
*   `free_object`
    

以及 1 个数据结构 - `gc_zero_ref_count_list` 列表的配合，来处理上述 FFF 可能出现嵌套层数过深的问题。

具体的算法是：

1.  入口对象 aaa 的引用计数为 0，因此调用函数 `__JS_FreeValueRT` 对其进行释放
    
2.  `__JS_FreeValueRT` 并不会立即释放对象，而是将其加到 `gc_zero_ref_count_list` 列表的头部
    
3.  因为当前 GC 的状态为 `JS_GC_PHASE_NONE`，所以 `__JS_FreeValueRT` 会继续调用函数 `free_zero_refcount` 开启一个循环 LLL，循环 LLL 的操作为不断地弹出 `gc_zero_ref_count_list` 列表的头部元素，然后调用函数 `free_gc_object`
    
4.  `free_zero_refcount` 开启循环前，会将 GC 的状态设置为 `JS_GC_PHASE_DECREF`，也就是说在循环 LLL 未结束时，循环内如果调用到 `__JS_FreeValueRT` 则不会继续调用 `free_zero_refcount` 而开启多个循环
    
5.  进入循环 LLL，此时头部元素为 aaa，将其弹出后调用函数 `free_object` 对其进行处理
    
6.  `free_object` 中首先会处理 aaa 的属性：
    
    1.  将 aaa 的属性引用的对象引用计数减 1，也就是解引用
        
    2.  如果 aaa 的属性引用的对象 bbb 引用计数为 0，那么继续对 bbb 调用函数 `__JS_FreeValueRT`
        
    3.  进入 `__JS_FreeValueRT` 后会将对象 bbb 也加入到列表 `gc_zero_ref_count_list` 的头部
        
    4.  因为此时 GC 状态为 `JS_GC_PHASE_DECREF`，所以不会继续调用 `free_zero_refcount`
        
7.  如果 aaa 中有多个属性，顺序为 {b,c,d}\\{b, c, d\\}{b,c,d}，那么属性处理完毕后，`gc_zero_ref_count_list` 中的内容为 {d,c,b}\\{d, c, b\\}{d,c,b}
    
8.  `free_object` 中处理完属性后，会调用 aaa 的 `finalizer` 方法（如果有的话），来释放对象上绑定的自定义内容
    
9.  `free_object` 中最后一步是释放对象本身，也就是 aaa
    
10.  接着会回到处理 aaa 的函数 `free_zero_refcount` 中的 循环 LLL 继续执行
    
11.  如果 `gc_zero_ref_count_list` 中还有元素，那么会弹出头部元素并继续第 6 步的处理，否则进入下一步
    
12.  跳出循环 LLL，最初处理 aaa 的 `__JS_FreeValueRT` 调用得以返回
    

为了方便大家对照理解，假设我们有下面的引用关系：

![refcount_dec_loop](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6b4dfdad35a4956b5eff7e09c5de95b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=816&h=322&e=png&b=ffffff)

运用上面的处理方式时，`gc_zero_ref_count_list` 中的内容变化过程为：

![refcount_loop_stack](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e41161353d5646d3ad15000c2f6e54dd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1414&h=478&e=png&b=ffffff)

上图需要解释的内容为：

*   纵向的箭头表示 `gc_zero_ref_count_list` 的增长方向
    
*   横销的箭头表示由首次 `__JS_FreeValueRT` 调用 `free_zero_refcount` 开启的循环 LLL 对 `gc_zero_ref_count_list` 的操作随着时间的变化
    
*   `gc_zero_ref_count_list` 中的元素加入顺序是按对象的引用关系采取深度优先的方式，由函数 `free_object` 对属性解引用时、经 `__JS_FreeValueRT` 进行的操作
    
*   循环 LLL 对 `gc_zero_ref_count_list` 中的元素采取后进先出的方式进行处理
    
*   弹出的元素会先向 `gc_zero_ref_count_list` 中压入其属性（即直接引用），然后释放自身所占的内存
    

JS\_RunGC
---------

引擎中 GC 执行的时机可以分为 2 种情况：

*   当对象的引用计数为 0 时，会对该对象所占的内存进行回收
    
    这也是引用计数算法的一个优势，因为引用计数为 0 的对象被即刻回收了，减少了 GC 需要扫描的对象数量，从而缩短 GC 最大暂停时间
    
*   因为循环引用的存在，需要一个时机来执行标记清除算法：
    
    *   被动执行，当为新对象分配内存时，如果当前 GC 向操作系统申请的内存总量达到预定的上限1，则触发函数 [JS\_RunGC](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L573 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L573") 运行标记清除算法
        
        引擎支持通过设置 [malloc\_size](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L321 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/include/quickjs.h#L321") 来调整上述预定的上限1
        
    *   主动执行，显式地调用函数 `JS_RunGC` 来运行标记清除算法
        

函数 `JS_RunGC` 负责执行标记清除算法：

    void JS_RunGC(JSRuntime *rt) {
      /* decrement the reference of the children of each object. mark =
         1 after this pass. */
      gc_decref(rt);
    
      /* keep the GC objects with a non zero refcount and their childs */
      gc_scan(rt);
    
      /* free the GC objects in a cycle */
      gc_free_cycles(rt);
    }
    

可以发现其中又细分为 3 个函数调用：

*   `gc_decref` 函数负责从所有被 GC 管理的对象中找到出 Roots
    
*   `gc_scan` 函数负责根据找出的 Roots 标记活动的对象
    
*   `gc_free_cycles` 函数则负责对非活动对象进行清除
    

在目前的实现中，引擎执行 `JS_RunGC` 的期间无法执行应用的业务逻辑，因此 `JS_RunGC` 执行所消耗的时间就是 GC 的暂停时间，时长和需要扫描的对象数成正比。

GC 执行期间需要暂停执行应用的业务逻辑的原因可以这么理解：

*   GC 需要扫描所有被 GC 管理的对象，可以将这些对象的集合称为 `gc_obj_list`
    
*   应用程序的执行会产生和消除受 GC 管理的对象，也需要操作 `gc_obj_list`
    

因为 GC 和应用程序都需要操作 `gc_obj_list`，所以 GC 执行期间将应用程序暂停可以让 GC 的实现更简单。

### gc\_decref

引擎并没有直接选定一组目标作为 Roots（比如前文的例子选择了调用栈），而是直接从 `gc_obj_list` 中筛选出 Roots：

![find_roots.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35ab39a98d5943cc95687d144a15a0f9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1922&h=656&e=png&b=ffffff)

上图即筛选出 Roots 的过程，对应的解释为：

*   将 `gc_obj_list` 看成是一个集合，其中的元素之间存在了相互引用关系
    
*   元素间的相互引用关系分 2 种情况：
    
    *   `gc_obj_list` 集合内的相互引用
        
    *   来自集合 `gc_obj_list` 外部的引用（比如调用栈）
        

所以如果扫描 `gc_obj_list` 中的元素，将集合内的相互引用都消除，那么还存在引用的对象即为 Roots，即右图中的 `a`。

了解了这个思路后，继续查看 `gc_decref` 的代码：

    static void gc_decref_child(JSRuntime *rt, JSGCObjectHeader *p) {
      assert(p->ref_count > 0);
      p->ref_count--;
      if (p->ref_count == 0 && p->mark == 1) {
        list_del(&p->link);
        list_add_tail(&p->link, &rt->tmp_obj_list);
      }
    }
    
    void gc_decref(JSRuntime *rt) {
      struct list_head *el, *el1;
      JSGCObjectHeader *p;
    
      init_list_head(&rt->tmp_obj_list);
    
      /* decrement the refcount of all the children of all the GC
         objects and move the GC objects with zero refcount to
         tmp_obj_list */
      list_for_each_safe(el, el1, &rt->gc_obj_list) { // 1
        p = list_entry(el, JSGCObjectHeader, link);
        assert(p->mark == 0);
        mark_children(rt, p, gc_decref_child);        // 2
        p->mark = 1;                                  // 3
        if (p->ref_count == 0) {                      // 4
          list_del(&p->link);
          list_add_tail(&p->link, &rt->tmp_obj_list);
        }
      }
    }
    

上面代码对应的解释为：

*   位置 `1` 处表示遍历 `gc_obj_list` 中的元素
    
*   位置 `2` 处表示通过函数 [mark\_children](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L377 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L377") 遍历对象的属性，对每个属性引用的对象调用函数 `gc_decref_child`
    
*   位置 `3` 处通过设置属性 `mark` 为 `1` 表示对象已经被标记过
    
*   位置 `4` 处表示如果消除引用关系后对象的 `ref_count` 为 0，则将其从 `gc_obj_list` 中移除，并添加到 `tmp_obj_list` 中
    

函数 `gc_decref_child` 的操作与上述位置 `4` 类似，会将入参对象的引用计数减 1，如果 `ref_count` 为 0，则将其从 `gc_obj_list` 中移除，并添加到 `tmp_obj_list` 中。

所以经过 `gc_decref` 处理后，`gc_obj_list` 中尚存的对象即为 Roots、即上图中的 `a`，而 `tmp_obj_list` 中则为非 Roots 对象，即上图中除 `a` 之外的对象。

### gc\_scan

函数 `gc_scan` 则是遍历 `gc_obj_list` 中的 Roots，标记活动对象，并将活动对象从 `tmp_obj_list` 移动到 `gc_obj_list` 中：

    static void gc_scan_incref_child(JSRuntime *rt, JSGCObjectHeader *p) {
      p->ref_count++;
      if (p->ref_count == 1) {                        // 3
        /* ref_count was 0: remove from tmp_obj_list and add at the
           end of gc_obj_list */
        list_del(&p->link);
        list_add_tail(&p->link, &rt-> );
        p->mark = 0; /* reset the mark for the next GC call */
      }
    }
    
    static void gc_scan_incref_child2(JSRuntime *rt, JSGCObjectHeader *p) {
      p->ref_count++;
    }
    
    static void gc_scan(JSRuntime *rt) {
      struct list_head *el;
      JSGCObjectHeader *p;
    
      /* keep the objects with a refcount > 0 and their children. */
      list_for_each(el, &rt->gc_obj_list) {           // 1
        p = list_entry(el, JSGCObjectHeader, link);
        assert(p->ref_count > 0);
        p->mark = 0; /* reset the mark for the next GC call */
        mark_children(rt, p, gc_scan_incref_child);   // 2
      }
    
      /* restore the refcount of the objects to be deleted. */
      list_for_each(el, &rt->tmp_obj_list) {          // 4
        p = list_entry(el, JSGCObjectHeader, link);
        mark_children(rt, p, gc_scan_incref_child2);
      }
    }
    

上面代码对应的解释为：

*   位置 `1` 处开始遍历 `gc_obj_list` 中的 Roots
    
*   位置 `2` 处通过函数 [mark\_children](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L377 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.c#L377") 遍历对象的属性，对每个属性引用的对象调用函数 `gc_scan_incref_child`
    
*   位置 `3` 处判断自增后的引用计数为 `1`、即自增之前为 0，是存在于 `tmp_obj_list` 中的，将其中 `tmp_obj_list` 移动至 `gc_obj_list` 列表的末尾，比如上图中的 `b`
    

经过上面的操作后，`tmp_obj_list` 中只剩下循环引用的对象，即上图中的 `c` 和 `d`，然后通过位置 `4` 处的操作还原它们之间的引用关系。

### gc\_free\_cycles

函数 `gc_free_cycles` 负责对 `tmp_obj_list` 中的循环引用对象进行释放。

释放一个对象简单来说分 2 步：

*   释放对象的属性
    
*   释放对象本身
    

但由于循环引用的存在，上面的操作可能会产生重复释放：

![double_free](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6267ec6ce854e3c92aadc6d2719c5a0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=482&h=238&e=png&b=ffffff)

比如上图的间接循环引用，如果按照上面的步骤：

*   处理 `a` 的时候，先释放其属性，再释放 `a` 本身
    
*   然后顺着引用关系到达 `c` 的时候，因为 `a` 又是 `c` 的属性，导致 `a` 被重复释放
    

为了解决上面的问题，引擎中采取的方案是：

*   先仅遍历对象的属性，但不释放属性所引用的对象，而是解除对其的引用（将其引用计数减 1）
    
*   遍历完属性后，如果对象的引用计数为 0，则将其释放，否则添加到 `gc_zero_ref_count_list` 中延后释放
    

比如上面的例子：

*   处理 `a` 的时候，解除对 `b` 的引用，因为 `a` 的引用计数不为 0，所以加入 `gc_zero_ref_count_list` 中延后释放
    
*   接着处理 `b`，解除对 `c` 的引用，因为 `b` 的引用计数为 0，所以将其释放
    
*   接着处理 `c`，解除对 `a` 的引用，因为 `c` 的引用计数为 0，所以将其释放
    
*   最后再释放 `gc_zero_ref_count_list` 中的对象，从而避免重复释放
    

了解这样的操作后，继续看函数 `gc_free_cycles` 的实现：

    static void gc_free_cycles(JSRuntime *rt) {
      struct list_head *el, *el1;
      JSGCObjectHeader *p;
    #ifdef DUMP_GC_FREE
      BOOL header_done = FALSE;
    #endif
    
      rt->gc_phase = JS_GC_PHASE_REMOVE_CYCLES; // 1
    
      for (;;) {                                // 2
        el = rt->tmp_obj_list.next;
        if (el == &rt->tmp_obj_list)
          break;
        p = list_entry(el, JSGCObjectHeader, link);
        /* Only need to free the GC object associated with JS
           values. The rest will be automatically removed because they
           must be referenced by them. */
        switch (p->gc_obj_type) {
        case JS_GC_OBJ_TYPE_JS_OBJECT:
        case JS_GC_OBJ_TYPE_FUNCTION_BYTECODE:  // 3
    #ifdef DUMP_GC_FREE
          if (!header_done) {
            printf("Freeing cycles:\n");
            JS_DumpObjectHeader(rt);
            header_done = TRUE;
          }
          JS_DumpGCObject(rt, p);
    #endif
          free_gc_object(rt, p);
          break;
        default:
          list_del(&p->link);
          list_add_tail(&p->link, &rt->gc_zero_ref_count_list);
          break;
        }
      }
      rt->gc_phase = JS_GC_PHASE_NONE;
    
      list_for_each_safe(el, el1, &rt->gc_zero_ref_count_list) {
        p = list_entry(el, JSGCObjectHeader, link);
        assert(p->gc_obj_type == JS_GC_OBJ_TYPE_JS_OBJECT ||
               p->gc_obj_type == JS_GC_OBJ_TYPE_FUNCTION_BYTECODE);
        js_free_rt(rt, p);
      }
    
      init_list_head(&rt->gc_zero_ref_count_list);
    }
    

上面代码对应的解释为：

*   位置 `1` 处设置了 GC 执行状态为 `JS_GC_PHASE_REMOVE_CYCLES`
    
*   位置 `2` 遍历 `tmp_obj_list` 中的非活动对象
    
*   位置 `3` 处表示仅处理类型为 `JS_GC_OBJ_TYPE_JS_OBJECT` 和 `JS_GC_OBJ_TYPE_FUNCTION_BYTECODE` 的 GC 对象，因为 [其他类型](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L215 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L215") 都是被它们引用的
    

GC 的执行状态 `JS_GC_PHASE_REMOVE_CYCLES` 有 2 处配合：

*   首先是和 `free_object` 配合，用于将对象加入到延后释放列表 `gc_zero_ref_count_list` 中：
    
        static void free_object(JSRuntime *rt, JSObject *p) {
          // ...
          remove_gc_object(&p->header);
          if (rt->gc_phase == JS_GC_PHASE_REMOVE_CYCLES && p->header.ref_count != 0) { // 1
            list_add_tail(&p->header.link, &rt->gc_zero_ref_count_list);
          } else {
            js_free_rt(rt, p);
          }
        }
        
    
    注意位置 `1` 处的条件是 `&&`，也就是说在非 `JS_GC_PHASE_REMOVE_CYCLES` 状态下调用该函数，执行的操作就是：
    
    *   解除对属性对其他对象的引用
        
    *   释放对象自身
        
*   其次是 `__JS_FreeValueRT` 中：
    
        void __JS_FreeValueRT(JSRuntime *rt, JSValue v) {
          // ...
          switch (tag) {
          // ...
          case JS_TAG_OBJECT:
          case JS_TAG_FUNCTION_BYTECODE: {
            JSGCObjectHeader *p = JS_VALUE_GET_PTR(v);
            if (rt->gc_phase != JS_GC_PHASE_REMOVE_CYCLES) { // 1
              list_del(&p->link);
              list_add(&p->link, &rt->gc_zero_ref_count_list);
              if (rt->gc_phase == JS_GC_PHASE_NONE) {
                free_zero_refcount(rt);
              }
            }
          } break;
          // ...
          }
        }
        
    
    因为循环引用的对象都在 `tmp_obj_list` 中了，都会在函数 `gc_free_cycles` 中得到处理，所以跳过位置 `1` 处的操作避免重复处理。
    

### js\_trigger\_gc

前文提到在为新对象申请内存时，会检查当前内存占用是否超过一个预定的数值，如果超过的话则执行标记清除算法处理循环引用，这部分的逻辑是通过函数 `js_trigger_gc` 实现的：

    void js_trigger_gc(JSRuntime *rt, size_t size) {
      BOOL force_gc;
    #ifdef FORCE_GC_AT_MALLOC
      force_gc = TRUE;
    #else
      force_gc = ((rt->malloc_state.malloc_size + size) > rt->malloc_gc_threshold);
    #endif
      if (force_gc) {
    #ifdef DUMP_GC
        printf("GC: size=%" PRIu64 "\n", (uint64_t)rt->malloc_state.malloc_size);
    #endif
        JS_RunGC(rt);
        rt->malloc_gc_threshold =
            rt->malloc_state.malloc_size + (rt->malloc_state.malloc_size >> 1);
      }
    }
    

可以看到在当前的内存使用量 `malloc_state.malloc_size` 超过了阈值 `malloc_gc_threshold` 后，会执行 GC，并在 GC 值后，将阈值上调 1.5 倍。

`malloc_gc_threshold` 的 [默认值](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L348 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L348") 是 256KB。

小结
--

本节的内容可以总结为：

*   首先我们解释了为什么需要 GC - 简化内存管理，并介绍了衡量 GC 的几个性能指标
    
*   接着我们介绍了引擎中使用的 GC 算法 - 引用计数，并向大家解释了引用计数算法的主要缺点 - 无法避免循环引用，以及该问题在引擎内的解决方案 - 配合标记清除算法
    
*   了解了引用计数算法与标记清除算法后，我们一起分析了它们在引擎中的实现方式，并介绍了 GC 触发的时机
    

本节是指令执行部分的最后一节，接下来的章节我们将进入指令的生成部分。