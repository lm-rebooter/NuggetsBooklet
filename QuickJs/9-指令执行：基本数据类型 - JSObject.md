程序的执行离不开有效的数据类型，引擎作为程序的一种当然也不能例外。接下来我们将一起接触几个引擎中使用的基本数据类型。

首先介绍的是 JSObject，引擎中的高阶功能（比如 Generator，Promise 等）都有使用它，并且当引擎内部需要存储一些结构较为复杂的数据时，也会使用 JSObject 作为容器。

我们在高级语言中常用的数据结构（比如数组，Hashmap，字符串）在 C 语言中的默认支持度有限，通常来说开发者需要在程序中自己实现这些数据结构。对于 JS 引擎来说，其为了支持 JS 的数据类型（对象，数组等）会实现一些数据结构，当引擎内需要存储一些复杂的数据时，就可以直接使用这些数据结构，相对的内存管理也会变得简单 - 交给为 JS 实现的 GC 来负责。

JSObject
--------

JS 中的对象都基于 [JSObject](https://github.com/hsiaosiyuan0/slowjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/obj.h#L50 "https://github.com/hsiaosiyuan0/slowjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/obj.h#L50")，下面是其在引擎中的内存结构：

    struct JSObject {
      union {
        JSGCObjectHeader header;
        struct {
          int ref_count; /* must come first, 32-bit */
          JSGCObjectTypeEnum gc_obj_type : 4;
                // ...
          };
        };
      /* byte offsets: 16/24 */
      JSShape *shape; /* prototype and property names + flag */
      JSProperty *prop; /* array of properties */
      /* byte offsets: 24/40 */
      struct JSMapRecord *first_weak_ref; /* XXX: use a bit and an external hash table? */
      /* byte offsets: 28/48 */
      union {
        // ...
    
        struct { /* JS_CLASS_BYTECODE_FUNCTION: 12/24 bytes */
          // ...
        } func;
    
        struct { /* JS_CLASS_C_FUNCTION: 12/20 bytes */
          // ...
        } cfunc;
    
        /* array part for fast arrays and typed arrays */
        struct { /* JS_CLASS_ARRAY, JS_CLASS_ARGUMENTS, JS_CLASS_UINT8C_ARRAY..JS_CLASS_FLOAT64_ARRAY */
          // ...
        } array;    /* 12/20 bytes */
    
        JSRegExp regexp;    /* JS_CLASS_REGEXP: 8/16 bytes */
        JSValue object_data;    /* for JS_SetObjectData(): 8/16/16 bytes */
      } u;
      /* byte sizes: 40/48/72 */
    };
    

上面是精简过的 JSObject 结构信息，可以发现以下内容：

*   内存的起始地址存放的是 `JSGCObjectHeader`，看起来存储了一些 GC 相关的信息
    
*   `shape` 和 `prop` 存储了一些 JS 对象的属性相关的信息
    
*   `u` 字段的类型是 `union`，目的是为不同种类的 JS 对象（`func`，`array`，`regexp` 等）提供存储空间
    

根据上面的信息，JSObject 内存储的数据分 3 块：

1.  保存 JS 对象 GC 相关信息的 `JSGCObjectHeader`
    
2.  保存 JS 对象属性信息的 `shape` 和 `prop`
    
3.  以及保存 JS 对象派生类型的信息的字段 `u`
    

### Data structure alignment

JSObject 定义中使用了不太常用的 Bit-field（下面代码中的 `: 4`）：

    JSGCObjectTypeEnum gc_obj_type : 4
    

在了解 Bit-field 之前，我们需要先了解「内存对齐 Data structure alignment」。

由于底层硬件（CPU）的设计限制，待访问的地址必须是按特定字长对齐的，如果地址没有对齐，那么会进入到 CPU 的错误中断、或者访问效率低于对齐的地址。

默认情况下，编译器对不同字节长度的 Primitive type 会采用不同字长来对齐，我们可以通过编译器内建的函数来打印不同字节长度的 Primitive type 的对齐方式：

    #include <stdio.h>
    #include <stdint.h>
    
    int main() {
      // `_Alignof` 为 clang 的内建指令，如果是 gcc 可以使用 `__alignof__`
      printf("%ld\n", _Alignof(uint8_t));   // 1
      printf("%ld\n", _Alignof(int));       // 4
      printf("%ld\n", _Alignof(uint64_t));  // 8
      return 0;
    }
    

不同的硬件平台以及不同字节长度的 Primitive type 可能会采用不同的对齐字长，文中没有特殊说明的话，硬件环境都是 64bits Intel。

上面的代码中使用编译器内建的指令 `_Alignof` 打印了几个类型的默认对齐字长。比如内存上的某块内容存放的是 `int` 类型的数值，我们需要根据该内存的首地址去访问内存上的内容，而「对齐」就是要求这个首地址必须是特定字长的整数倍。在我们的测试环境中， `int` 类型的内存首地址必须为 `4` 的整数倍。

我们来看一段演示代码：

    #include <stdio.h>
    #include <stdint.h>
    
    struct test {
      uint8_t a;
      int b;
    };
    
    int main() {
      printf("%ld\n", sizeof(struct test));  // 8
      printf("%ld\n", _Alignof(test.b));     // 4
      return 0;
    }
    

我们打印了 `struct test` 所占的字长，结果为 8。计算过程如下：

*   结构体的首地址会在实例化时被对齐，为了描述简单，我们下面讨论字段的首地址时，可以将其视为相对结构体首地址的偏移量
    
*   `a` 的长度为 1 字节，相对结构体首地址的偏移量为 0
    
*   字段 `b` 是 `int` 类型，它的访问地址必须按 4 字节对齐（4 的整数倍），因此在 `a` 和 `b` 之间需要插入 3 个字节的 padding，这样 `b` 的首地址偏移量就变成了 4
    

因此 `struct test` 所占的字节长度为：

8struct test\=1a+3padding+4b8\_{struct\\ test} = 1\_{a} + 3\_{padding} + 4\_{b}8struct test​\=1a​+3padding​+4b​

我们再看一个结构体的整体字长不是偶数倍的例子：

    #include <stdio.h>
    #include <stdint.h>
    
    struct test {
      uint8_t a;
      uint8_t b;
      uint8_t c;
    };
    
    int main() {
      printf("%ld\n", sizeof(struct test));    // 3
      printf("%ld\n", _Alignof(uint8_t));      // 1
      printf("%ld\n", _Alignof(struct test));  // 1
      return 0;
    }
    

*   `_Alignof(uint8_t)` 的值为 1，说明访问单个字节长度时地址是单字节「对齐」的
    
*   `_Alignof(struct test)` 的值为 1，因为其中的字段都是单字节对齐的，所以它也按单字节对齐就可以
    
*   `sizeof(struct test)` 的值为 3，因为按单字节对齐省去了 padding，结构体的整体字长就是字段字长之和
    

我们把上面的例子进行简单的调整，使结构体的字长按偶数倍对齐：

    #include <stdio.h>
    #include <stdint.h>
    
    struct test {
      uint16_t a;
      uint8_t b;
      uint8_t c;
    };
    
    int main() {
      printf("%ld\n", sizeof(struct test));    // 4
      printf("%ld\n", _Alignof(uint8_t));      // 1
      printf("%ld\n", _Alignof(uint16_t));     // 2
      printf("%ld\n", _Alignof(struct test));  // 2
      return 0;
    }
    

可以看到这次结构体的整体字长是按 2 字节对齐的，这是为了让结构体数组元素的首字段可以按其所需的对齐字长进行对齐。否则，如果 `struct test` 没有按 2 字节对齐，那么访问 `struct test t[n]` 数组中的元素时，其首字段 `a` 就会未按 2 字节对齐。

我们再来看一个包含多个字段的结构体对齐的例子：

    #include <stdio.h>
    #include <stdint.h>
    
    struct test {
      uint8_t a;
      // padding 1 byte
      uint16_t b;
      uint8_t c;
      // padding 3 byte
      uint32_t d;
    };
    
    int main() {
      printf("%ld\n", sizeof(struct test));    // 12
      printf("%ld\n", _Alignof(uint8_t));      // 1
      printf("%ld\n", _Alignof(uint16_t));     // 2
      printf("%ld\n", _Alignof(uint32_t));     // 4
      printf("%ld\n", _Alignof(struct test));  // 4
      return 0;
    }
    

`_Alignof(uint32_t)` 表示 `uint32_t` 类型的地址需要按 4 字节对齐

在上面的例子的基础上，我们可以通过调整字段的顺序达到消除 padding 的目的：

    #include <stdio.h>
    #include <stdint.h>
    
    struct test {
      uint8_t a;
      uint8_t c;
      uint16_t b;
      uint32_t d;
    };
    
    int main() {
      printf("%ld\n", sizeof(struct test));    // 8
      printf("%ld\n", _Alignof(uint8_t));      // 1
      printf("%ld\n", _Alignof(uint16_t));     // 2
      printf("%ld\n", _Alignof(uint32_t));     // 4
      printf("%ld\n", _Alignof(struct test));  // 4
      return 0;
    }
    

关于内存对齐可以小结为：

*   内存对齐是受底层硬件设计所致
    
*   不同的硬件平台以及 Primitive type 可能会采用不同字长来对齐
    
*   调整结构体中字段的顺序可能会影响结构体整体所占字长
    

### Bit field

了解内存对齐之后，我们继续看下 Bit field 的作用。首先我们看看未使用 Bit field 的情况下 `JSGCObjectHeader` 的字长：

    #include <stdio.h>
    #include <stdint.h>
    
    struct list_head {
      struct list_head *prev;
      struct list_head *next;
    };
    
    struct JSGCObjectHeader {
      int ref_count; /* must come first, 32-bit */
      int gc_obj_type;
      uint8_t mark; /* used by the GC */
      uint8_t dummy1; /* not used by the GC */
      uint16_t dummy2; /* not used by the GC */
      struct list_head link;
    } JSGCObjectHeader;
    
    int main() {
      printf("%ld\n", sizeof(struct JSGCObjectHeader));  // 32
      printf("%ld\n", _Alignof(JSGCObjectHeader.link));  // 8
      return 0;
    }
    

计算的方式为：

16struct list\_head\=8prev+8next16\_{struct\\ list\\\_head} = 8\_{prev} + 8\_{next}16struct list\_head​\=8prev​+8next​

32JSGCObjectHeader\=4ref\_count+4gc\_obj\_type+1mark+1dummy1+2dummy2+4padding+16link32\_{JSGCObjectHeader} = 4\_{ref\\\_count} + 4\_{gc\\\_obj\\\_type} + 1\_{mark} + 1\_{dummy1} + 2\_{dummy2} + 4\_{padding} + 16\_{link}32JSGCObjectHeader​\=4ref\_count​+4gc\_obj\_type​+1mark​+1dummy1​+2dummy2​+4padding​+16link​

其中的 4padding4\_{padding}4padding​ 是因为字段 linklinklink 需要按 8 字节对齐

我们再看一下使用了 Bit field 后结构体字长发生的变化：

    #include <stdio.h>
    #include <stdint.h>
    
    struct list_head {
      struct list_head *prev;
      struct list_head *next;
    };
    
    struct JSGCObjectHeader {
      int ref_count; /* must come first, 32-bit */
      int gc_obj_type: 4;
      uint8_t mark: 4; /* used by the GC */
      uint8_t dummy1; /* not used by the GC */
      uint16_t dummy2; /* not used by the GC */
      struct list_head link;
    } JSGCObjectHeader;
    
    int main() {
      printf("%ld\n", sizeof(struct JSGCObjectHeader));  // 24
      printf("%ld\n", _Alignof(JSGCObjectHeader.link));  // 8
      return 0;
    }
    

可以看到变成了 24 个字节。

为什么这里需要扣 4 个字节呢？因为 `JSGCObjectHeader` 是存在于每个 JS 对象头部的结构，缩减它的体积可以有效的减少运行时的内存占用。

下面我们来看一下 Bit field 是如何完成字长压缩的。

我们将 CPU 一次可以载入的字长称为 chunkchunkchunk，结合下面的例子：

    #include <stdio.h>
    #include <stdint.h>
    
    typedef struct test {
      uint8_t a;
      int b;
    } test;
    
    
    int main() {
      test t =  {1, 2};
      printf("%d\n", t.a); // 1
      return 0;
    }
    

当访问 `t.a` 时，CPU 并不是只加载了 `t.a` 处的一个字节，而是一次载入了标定的字长，也就是 chunkchunkchunk，假设是 8 个字节。看似多载入的 7 个字节会停留在 CPU 内的高速缓存中，如果我们接着访问 `b` 字段的内容，那么会直接从高速缓存中读取。

现在我们可以简单解释一下 `JSGCObjectHeader` 的字长的计算方式：

    struct JSGCObjectHeader {
      int ref_count; /* must come first, 32-bit */
      int gc_obj_type: 4;
      uint8_t mark: 4; /* used by the GC */
      uint8_t dummy1; /* not used by the GC */
      uint16_t dummy2; /* not used by the GC */
      struct list_head link;
    } JSGCObjectHeader;
    

1.  我们的 64bit 的机器通常一次会载入 8 字节，也就是一个 chunkchunkchunk 的大小为 8 字节
    
2.  那么 chunk0chunk\_{0}chunk0​ 可以包含 ref\_countref\\\_countref\_count，因为后者只有 4 字节，少于 chunk0chunk\_{0}chunk0​ 的 8 字节
    
3.  gc\_obj\_typegc\\\_obj\\\_typegc\_obj\_type 也可以放在 chunk0chunk\_{0}chunk0​ 中，因为其只有 4 bits
    
4.  markmarkmark 也可以放在 chunk0chunk\_{0}chunk0​ 中，因为其只有 4 bits，后者的剩余空间足够存放
    
5.  dummy1dummy1dummy1 只需按 1 字节对齐，chunk0chunk\_{0}chunk0​ 还剩余 3 个字节，因此同样可以存在 chunk0chunk\_{0}chunk0​ 中
    
6.  dummy2dummy2dummy2 也可以存放在 chunk0chunk\_{0}chunk0​ 中：
    
    *   chunk0chunk\_{0}chunk0​ 还剩余 2 字节，足够存放 dummy2dummy2dummy2
        
    *   dummy2dummy2dummy2 之前有 6 个字节，若 dummy2dummy2dummy2 存入 chunk0chunk\_{0}chunk0​，其首地址满足 2 字节对齐
        
7.  到 linklinklink 字段时，由于前面的字段刚好填满了 chunk0chunk\_{0}chunk0​，所以它将被放置到 chunk1chunk\_{1}chunk1​ 中。不过由于其字长为 16 字节，所以还需要一个 chunk2chunk\_{2}chunk2​，假设其后还有字段，那些字段就需要从 chunk3chunk\_3chunk3​ 开始了
    

因此，使用了 Bit field 的 `JSGCObjectHeader` 的字长计算方式为：

24JSGCObjectHeader\=8fields\_before\_link+16link24\_{JSGCObjectHeader} = 8\_{fields\\\_before\\\_link} + 16\_{link}24JSGCObjectHeader​\=8fields\_before\_link​+16link​

现在我们可以将 Bit field 的工作方式简单概括为：

*   通过一个个 chunkchunkchunk 来模拟 CPU 按字长载入内容的情况
    
*   将字段合并到其之前或之后的 chunkchunkchunk 中
    

虽然 Bit field 可以达到压缩字长的目的，但也不是完全没有成本：

*   当访问 `gc_obj_type` 时，因为它只有 4bits，编译器会为我们生成相应的 bit mask 操作以取得对应的 bit 位上的值，相比直接访问一个 `int` 型的字段，多出的 bit mask 指令会多消耗一些 CPU 时间
    
    假设访问数值所在的内存因为 Bit field 使得耗时减少了 A ，但是拿到实际值的耗时因为 bit mask 增加了 B，当 A 大于 B 时就是有收益的。
    
*   使用 bit field 修饰过的字段，它在结构体中的排布、归属于哪个 chunkchunkchunk，是受到多个因素影响的：
    
    *   字段的 bits 数，以及其前后的字段字长、对齐字长
        
    *   不同硬件平台以及不同的编译器实现
        
        因此会降低一部分代码的可移植性，更多的细节可以参考 [C Bit Fields](https://docs.microsoft.com/en-us/cpp/c-language/c-bit-fields?view=msvc-170 "https://docs.microsoft.com/en-us/cpp/c-language/c-bit-fields?view=msvc-170") 和 [Alignment of bit fields](https://www.ibm.com/docs/en/xl-c-aix/12.1.0?topic=modes-alignment-bit-fields "https://www.ibm.com/docs/en/xl-c-aix/12.1.0?topic=modes-alignment-bit-fields")
        

### header

`JSObject` 内的 `header` 为 `JSGCObjectHeader` 类型，它与一个 anonymous struct 一起包裹在了同一个 anonymous union 中：

    struct JSGCObjectHeader {
      int ref_count; /* must come first, 32-bit */
      JSGCObjectTypeEnum gc_obj_type : 4;
      uint8_t mark : 4; /* used by the GC */
      uint8_t dummy1; /* not used by the GC */
      uint16_t dummy2; /* not used by the GC */
      struct list_head link;
    };
    
    struct JSObject {
      // ...
      union {  // Anonymous union
        JSGCObjectHeader header;
        struct {  // Anonymous struct
          int __gc_ref_count; /* corresponds to header.ref_count */
          uint8_t __gc_mark; /* corresponds to header.mark/gc_obj_type */
    
          uint8_t extensible : 1;
          // ...
        };
      };
    }
    

通过使用 anonymous union 让其中的 anonymous struct 不开辟额外的空间，而是共用 `header` 的内存空间。

通过嵌套的 anonymous struct 使得可以通过 JSObject 上访问到其中的字段，也就是说通过 `extensible` 可以访问到位于 `dummy1` 之上的内容。

对于 GC 来说是无需关心诸如 `extensible` 这样的应用层字段的，所以 GC 工作时将通过 `header` 来访问 JSObject 头部保存的 GC 相关的信息（`ref_count` 和 `gc_obj_type`）。而在 GC 之外的应用层使用 JSObject 时，则可以通过其头 anonymous union/struct 中定义的字段访问相关内容。

Shape
-----

上文在介绍 JSObject 的结构时提到，`shape` 和 `prop` 字段存储了一些 JS 对象的属性相关的信息，我们可以称这些信息为「属性元信息」。

接下来我们将一起看看引擎如何使用 Shape 保存对象属性的元信息。

### 属性元信息

首先我们需要简单了解「属性元信息」指的是什么。下面一段代码定义了两个对象 `o1` 和 `o2`：

    let o1 = { a: 1, b: 2 };
    let o2 = { a: 1, b: "str" };
    

引擎层面需要为属性保存下面这些元信息：

*   键到值的映射关系
    
*   属性描述符，比如 [accessor descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description")
    

如果需要我们简单地设计一个结构来保存这些信息，Hashmap 是一个比较简单的方案，不过它有 2 个缺点：

*   结构相似的不同的对象，由于对应不同的 Hashmap 实例，所以相同的键也会存在于不同的 Hashmap 中，造成了内存浪费
    
    > 结构相似可以简单理解为这些对象的键顺序一样
    > 
    > 描述中「键」与「属性」、「字段」表示相似的概念，即为对象内某个值的标识
    
*   常见的 Hashmap 实现，键值在内存上的分布是离散的，无法很好的利用 CPU 高速缓存
    

为了解决上面的问题，引擎中使用了 `shape` 和 `prop`：

![shape_init.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b5e2d49d4e54b76a4d6a31d3feab627~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=916&h=842&s=61393&e=png&b=fffdfd)

*   `shape` 保存了键值的映射关系
    
*   键名相同的不同对象共用同一个 `shape`
    
*   值通过 `props` 保存在连续的内存地址上
    

### Shape 特征量

相同结构的不同对象共用同一个 shape，这就引申出 2 个问题：

*   如何快速确定对象的结构是相同的，因为这样才能确定是否有可复用的 `shape`
    
*   多个 `shape` 是如何进行内存管理的
    

引擎解决上面 2 个问题的方式是，在 JSRuntime 上手动构造的一个 Hashmap，下面是相关的几个字段：

    struct JSRuntime {
      // ...
      int shape_hash_bits;
      int shape_hash_size;
      int shape_hash_count; /* number of hashed shapes */
      JSShape **shape_hash;
      // ...
    }
    

上面这样手动构造的 Hashmap 其中的值为 `shape`，那么对应的键是如何构造的呢？

这就需要一个「Shape 特征量」的概念 - 在创建对象或者添加属性时，先算出对象结构的特征量，然后以其为键，在上面的 Hashmap 中查看是否已经存在 `shape`。

计算 shape 特征量时的输入包含下面的内容：

*   对象的原型
    
*   所有属性的名称
    
*   所有属性的先后顺序
    
*   所有属性的描述符
    

首先是创建对象时，先以对象的原型为基础计算出一个 hash 值：

    /* create a new empty shape with prototype 'proto' */
    static no_inline JSShape *js_new_shape2(JSContext *ctx, JSObject *proto,
                                            int hash_size, int prop_size)
    {
    // ...
      /* insert in the hash table */
      sh->hash = shape_initial_hash(proto);
    // ...
    }
    

后续添加属性时，再把属性和其描述符追加到之前的 hash 上算出新的 hash 值：

    static int add_shape_property(JSContext *ctx, JSShape **psh,
                                  JSObject *p, JSAtom atom, int prop_flags)
    {
      // ...
    
      /* update the shape hash */
      if (sh->is_hashed) {
        js_shape_hash_unlink(rt, sh);
        new_shape_hash = shape_hash(shape_hash(sh->hash, atom), prop_flags);
      }
    
      // ...
    }
    

上面的 `atom` 和 `prop_flags` 就分别表示对象的属性名和属性描述符，而属性的先后顺序信息是隐式的：

*   属性定义的顺序对应了 `add_shape_property` 的调用顺序
    
*   而 `add_shape_property` 总是会在代表上一个元信息特征的 hash 的基础上计算出新的 hash（有点区块链的感觉了）
    

可以看到上面的函数中使用 hash 来计算特征量，而不是简单的内容拼接，其目的是希望特征量的分布相对均匀的，因为后续需要将其作为 Hashmap 的键。

### Shape hashmap

上文提到引擎在 JSRuntime 上手动构造了一个 Hashmap，我们可以称之为 Shape hashmap，下面我们看看其构造方式。

init\_shape\_hash 函数包含了 shape hashmap 的初始化过程：

    static int init_shape_hash(JSRuntime *rt)
    {
      rt->shape_hash_bits = 4;   /* 16 shapes */
      rt->shape_hash_size = 1 << rt->shape_hash_bits;
      rt->shape_hash_count = 0;
      rt->shape_hash = js_mallocz_rt(rt, sizeof(rt->shape_hash[0]) *
                                       rt->shape_hash_size);
      if (!rt->shape_hash)
        return -1;
      return 0;
    }
    

上面代码的包含了这些信息：

*   `rt->shape_hash` 指向的一块连续的内存，也就是数组，数组元素的类型是 `JSShape*`
    
*   `rt->shape_hash_size` 表示 `rt->shape_hash` 数组的长度
    
*   `rt->shape_hash_count` 表示 `rt->shape_hash` 数组中的已经使用的位置数
    
*   `rt->shape_hash_bits` 作用是 bit mask，值为 `rt->shape_hash` 数组中最大索引的有效 bit 位，它的作用是将结构特征量的值空间缩小到 `rt->shape_hash` 数组长度中：
    
        uint32_t get_shape_hash(uint32_t h, int hash_bits) {
          return h >> (32 - hash_bits);
        }
        
    
    上面方法的入参分别是结构特征量 `h` 和 `hash_bits`，其中 `h` 的取值范围是 `uint32_t`，该方法会取 `h` 的高 `hash_bits` 个数的 bits
    
    比如，初始情况下 `rt->shape_hash` 有 16 个元素，最大索引为 15（`0b1111`） 的有效 bit 位个数为 4，那么该方法将保留 `h` 的高位的 4 个 bits
    

接着我们以对象创建为例，看看引擎是如何判断是否有可复用的 `shape`：

![rt_shape_hash.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf59edba59dc43a78f58bd7a4f51662d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1068&h=1402&s=107556&e=png&b=fffdfd)

图中包含的步骤为：

*   首先根据对象的原型计算出一个初始的 hashhashhash
    
*   通过 mask 方法计算 hashhashhash 得到 hash′hash'hash′，后者的取值会落在 `rt->shape_hash` 数组长度内
    
*   经过上一步的 hash′hash'hash′ 可以作为数组索引，访问到 `rt->shape_hash` 上的元素，视为 Bucket 首地址
    
*   然后线性查找 Bucket 中的元素，看是否有相同的 hashhashhash，若存在的话则为可以复用的 `shape`
    

### 属性元信息的存储

上文介绍了 shape hashmap 是如何构造的，解决了 shape 是如何存放的问题，我们继续看看 shape 内的结构是怎样的，即属性元信息是如何存储的。

shape 中也使用了手动构造的 hashmap 来存储属性元信息，相关字段如下：

    struct JSShape {
      // ...
      uint32_t prop_hash_mask;
      int prop_size;  /* allocated properties */
      int prop_count; /* include deleted properties */
      // ...
      JSShapeProperty prop[0]; /* prop_size elements */
    };
    

上面的字段作用为：

*   `prop`，存储属性元信息的数组。因为对象属性的访问是高频的操作，所以使用连续内存来利用 CPU 缓存加速访问
    
*   `prop_size` 表示 `prop` 数组的长度。为了减少内存分配次数，`prop` 每次会多申请一些内存
    
*   `prop_count` 表示 `prop` 数组已存放的属性元信息数目
    
*   `prop_hash_mask` 用于将键先定位到 Buckets 数组中的某个 Bucket 上
    
    Buckets 数组的长度是 [2 的幂](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L208 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L208") 因为初始值为 4。`prop_hash_mask` 的大小为 Buckets 数组的长度减 1。
    

`JSShapeProperty` 结构用于存放属性的元信息：

    typedef struct JSShapeProperty {
      uint32_t hash_next : 26; /* 0 if last in list */
      uint32_t flags : 6;      /* JS_PROP_XXX */
      JSAtom atom;             /* JS_ATOM_NULL = free property entry */
    } JSShapeProperty;
    

其中的字段分别表示：

*   `hash_next` 与当前元信息存在于同一个 Bucket 中的下一个元信息
    
*   `flags` 属性的元信息，诸如描述符之类
    
*   `atom` 属性名对应的 `JSAtom`，为了减少运行阶段的内存占用，以及加速属性名的对比操作，引擎内部在使用属性名的时候，会将其映射到一个整数:
    
        typedef uint32_t JSAtom;
        
    

`JSShape` 的内存分配比较有意思，我们到现在还没有看到 Buckets 数组，为了一探究竟，我们可以从 `JSShape` 在引擎内的初始化方式为入口：

    static no_inline JSShape *js_new_shape2(JSContext *ctx, JSObject *proto,
                                            int hash_size, int prop_size)
    {
      // ...
      JSShape *sh;
      // ...
      sh_alloc = js_malloc(ctx, get_shape_size(hash_size, prop_size));
      if (!sh_alloc)
        return NULL;
      sh = get_shape_from_alloc(sh_alloc, hash_size);
      // ...
    }
    

上面初始化 shape 的方法 `js_new_shape2` 中的特别操作在于：

    sh_alloc = js_malloc(ctx, get_shape_size(hash_size, prop_size))
    

可以看到分配给 shape 的大小并不是 `sizeof(JSShape)`，我们继续看一下 `get_shape_size` 的操作：

    static inline size_t get_shape_size(size_t hash_size, size_t prop_size)
    {
      return hash_size * sizeof(uint32_t) + sizeof(JSShape) +
        prop_size * sizeof(JSShapeProperty);
    }
    

其中数值的计算含义可以分 3 部分来看：

*   `sizeof(JSShape)` 即 `JSShape` 结构体所占的字节长度
    
*   `prop_size * sizeof(JSShapeProperty)` 比较好理解，对象有多少属性时不确定的，自然需要动态得分配内存
    
*   `hash_size * sizeof(uint32_t)` 其实就是 Buckets 数组了
    

有趣的是我们在 `JSShape` 中并没有看到相应的字段表示 Buckets 数组，不过通过 `js_new_shape2` 中的 `get_shape_from_alloc` 调用可以发现一些线索：

    static inline JSShape *get_shape_from_alloc(void *sh_alloc, size_t hash_size)
    {
      return (JSShape *)(void *)((uint32_t *)sh_alloc + hash_size);
    }
    

可以看到并没有使用分配的内存首地址，而是偏移了 `hash_size`，也就是说 Buckets 数组是紧挨着 `JSShape` 之前一块内存：

![shape_prop.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e51b6219ff5d4ae486b9b64e5b11e370~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2622&h=1138&s=515246&e=png&b=fffefe)

上图的一些补充说明是：

*   `prop_hash` 即 Buckets 数组
    
*   为了方便解释映射方式，图中引用了函数 `find_own_property1` 的实现
    
*   `prop_hash_end(sh)[-h - 1]` 的解释为：
    
    *   `prop_hash_end(sh)` 其实就是 `JSShape` 的起始地址
        
    *   `[-h - 1]` 中的 `h` 表示元素索引，`-h` 表示从后往前使用 Buckets 数组，加上 `-1` 是因为硬件访问内存时是读取的内存地址的高位内容（例子中为从左往右），因此需多偏移一个位置
        

图中没有解释到的内容可以结合 `find_own_property1` 的实现一起看：

    static force_inline JSShapeProperty *find_own_property1(JSObject *p,
                                                            JSAtom atom)
    {
      JSShape *sh;
      JSShapeProperty *pr, *prop;
      intptr_t h;
      sh = p->shape;
      h = (uintptr_t)atom & sh->prop_hash_mask; // [0, hash_size)
      h = prop_hash_end(sh)[-h - 1];
      prop = get_shape_prop(sh);
      while (h) {
        pr = &prop[h - 1];
        if (likely(pr->atom == atom)) {
          return pr;
        }
        h = pr->hash_next;
      }
      return NULL;
    }
    

上面的代码其实就是 Hashmap 的元素查找过程：

1.  首先通过 `(uintptr_t)atom & sh->prop_hash_mask` 计算出 Bucket，这一步基于下面的条件：
    
    *   `prop_hash` 的长度为 2 的幂
        
    *   `prop_hash_mask` 的取值为 Buckets 数组长度减 1
        
2.  定位到 Bucket 之后，将通过 `while` 和 `pr->hash_next` 对 Bucket 内的元素进行线性查找
    
3.  当 Bucket 内元素的 `pr->atom` 等于传入的属性名的 atom 时，则为该属性名对应的元信息，反之则属性不存在
    

`find_own_property1` 返回的是属性的元信息，而返回属性的方法是 `find_own_property1`：

    static force_inline JSShapeProperty *find_own_property(JSProperty **ppr,
                                                           JSObject *p,
                                                           JSAtom atom)
    {
      // ...
      while (h) {
        pr = &prop[h - 1];
        if (likely(pr->atom == atom)) {
          *ppr = &p->prop[h - 1];        // 1
          /* the compiler should be able to assume that pr != NULL here */
          return pr;
        }
        h = pr->hash_next;
      }
      // ...
    }
    

两个方法的实现基本相同，差别在于 `find_own_property1` 的 `1` 处，使用 `ppr` 返回了找到的属性，因为 C 语言不支持多返回值。

另一个值得注意的信息是，存在于 `JSShape::prop` 中的属性元信息和存在于 `JSObject::prop` 中的的属性、两者的元素索引是对应的，比如上面位置 1 处的代码，直接使用了相同的索引取回属性。

对象操作
----

了解对象在引擎内的表现形式后，我们继续看看当我们操作对象时，引擎内部进行了哪些操作。

创建对象时的引擎操作可以分为 2 步：

1.  分配对象自身所需的内存，用于存放 self-contained 信息（比如 owned properties）
    
2.  设置对象的原型 [\[\[Prototype\]\]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto")
    

先看看引擎如何分配对象自身所需的内存。

### 使用 Shape 创建对象

上文已经介绍，对象属性的元信息（包括对象的原型、属性描述符等）存在了 shape 中，引擎会利用这些信息来创建对象。

引擎的 C-API 中提供了函数 [JS\_NewObject](https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L2926 "https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L2926") 来创建对象，该函数内部会通过下面的调用链：

    JS_NewObject
      JS_NewObjectProtoClass
        JS_NewObjectFromShape
    

主要的操作都在函数 [JS\_NewObjectFromShape](https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L2690 "https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L2690") 中完成：

    static JSValue JS_NewObjectFromShape(JSContext *ctx, JSShape *sh,
                                         JSClassID class_id) {
      JSObject *p;
    
      js_trigger_gc(ctx->rt, sizeof(JSObject)); // 1
      p = js_malloc(ctx, sizeof(JSObject));     // 2
      if (unlikely(!p))
        goto fail;
      p->class_id = class_id;                   // 3
      // ...
      p->shape = sh;                            // 4
      p->prop = js_malloc(ctx, sizeof(JSProperty) * sh->prop_size); // 5
      // ...
    
      switch (class_id) { // 6
      case JS_CLASS_OBJECT:
        break;
      case JS_CLASS_ARRAY: {
        // ...
      case JS_CLASS_C_FUNCTION:
        p->prop[0].u.value = JS_UNDEFINED;
        break;
      // ...
      }
      }
      p->header.ref_count = 1; // 7
      add_gc_object(ctx->rt, &p->header, JS_GC_OBJ_TYPE_JS_OBJECT); // 8
      return JS_MKPTR(JS_TAG_OBJECT, p); // 9
    }
    

上面的函数体经过了一些省略，主要的操作为：

1.  先通过 `js_trigger_gc` 触发一次 GC，该函数内部有阈值判断，所以并不是每次调用都会实际的 GC 动作
    
2.  接着通过 `js_malloc` 分配 `JSObject` 的内存，并对其中的字段进行初始化
    
3.  `class_id` 的作用在上下文中尚不可知
    
4.  将 shape 记录到 `JSObject` 结构上
    
5.  创建存放属性值的内存空间，前面的章节我们已经知道存放属性元信息的数组 `JSShape::prop` 与存放属性值的数组 `JSObject::prop` 的长度是一致的
    
6.  通过 `switch` 语句中的内容，可以大致知道 `class_id` 用于施加不同类型的对象初始化操作
    
7.  初始引用计数设置为 1
    
8.  将创建的对象纳入到 GC 管理中
    
9.  通过值类型的方式返回 `JSValue`，其中包含了新创建对象的指针
    

### 新增属性

我们知道属性值存放在 `JSObject::prop` 数组之上，但并不能直接操作该数组，需先通过 shape 将属性名映射为 `JSObject::prop` 数组的索引才行。

由于两者的关联性，在添加新的属性时需要：

1.  添加属性的元信息，也就是修改 shape
    
2.  然后才是修改属性的值
    

修改属性的值比较简单，就是更新字段 [JSProperty::u](https://github.com/hsiaosiyuan0/slowjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/obj.h#L24 "https://github.com/hsiaosiyuan0/slowjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/obj.h#L24") 内容即可，我们主要看下 shape 是如何被修改的。

新增属性通过函数 [add\_property](https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1219 "https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1219") 触发：

    JSProperty *add_property(JSContext *ctx, JSObject *p, JSAtom prop,
                             int prop_flags) {
      JSShape *sh, *new_sh;
    
      sh = p->shape;
      if (sh->is_hashed) {                                         
        /* try to find an existing shape */
        new_sh = find_hashed_shape_prop(ctx->rt, sh, prop, prop_flags);   // 1
        if (new_sh) {                                                     // 2
          /* matching shape found: use it */
          /*  the property array may need to be resized */
          // prop_size here works like the buffer size, not the prop_count
          if (new_sh->prop_size != sh->prop_size) { 
            // ...
          }
          p->shape = js_dup_shape(new_sh);
          js_free_shape(ctx->rt, sh);
          return &p->prop[new_sh->prop_count - 1];                       // 3
        } else if (sh->header.ref_count != 1) {                          // 4
          /* if the shape is shared, clone it */
          new_sh = js_clone_shape(ctx, sh);                              // 5
          if (!new_sh)
            return NULL;
          /* hash the cloned shape */
          new_sh->is_hashed = TRUE;
          js_shape_hash_link(ctx->rt, new_sh);
          js_free_shape(ctx->rt, p->shape);
          p->shape = new_sh;
        }
      }
      assert(p->shape->header.ref_count == 1);
      if (add_shape_property(ctx, &p->shape, p, prop, prop_flags))       // 6
        return NULL;
      return &p->prop[p->shape->prop_count - 1];
    }
    

*   首先在位置 `1` 处调用 [find\_hashed\_shape\_prop](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L1226 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L1226") 查看是否存在 `shape1 = hash(shape, prop)` 也就是说已经存了一个 shape1，它是在 shape 基础上追加了属性 prop
    
*   如果已存在 shape1，即位置 `2` 处，自然不必创建新的 shape，因为这样才能让多个对象共用同一个 shape
    
    考虑下面的代码：
    
        var o1 = {a: 1, b: 2, c: 3};
        var o2 = {a: 1, b: 2};
        var o3 = {a: 1, b: 2};
        
    
    对应就有两个 shape：
    
    *   shape1：`a, b, c` 被 `o1` 使用
        
    *   shape2：`a, b` 被 `o2` 和 `o3` 共用
        
    
    后续如果我们修改 `o3`：
    
        o3.c = 3
        
    
    此时不必新增 shape，复用 shape1 即可，也就是位置 `3` 处直接返回 `JSObject::prop` 中对应的元素
    
*   位置 `4` 处的判断，如果 shape 的 `ref_count` 为 1，那么表示这个 shape 只被当前对应使用，直接在其基础上修改就可以了。反之则命中该条件，进入其中的逻辑 - 位置 `5` 处复制一个 shape' 进行修改
    
*   位置 `6` 则通过调用函数 `add_shape_property` 来修改 shape'
    

我们继续查看函数 [add\_shape\_property](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L319 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L319")：

    int add_shape_property(JSContext *ctx, JSShape **psh, JSObject *p, JSAtom atom,
                           int prop_flags) {
      JSRuntime *rt = ctx->rt;
      JSShape *sh = *psh;
      JSShapeProperty *pr, *prop;
      uint32_t hash_mask, new_shape_hash = 0;
      intptr_t h;
    
      // ...
      if (unlikely(sh->prop_count >= sh->prop_size)) {
        if (resize_properties(ctx, psh, p, sh->prop_count + 1)) {
          // ...
        }
        sh = *psh;
      }
    
      /* Initialize the new shape property.
         The object property at p->prop[sh->prop_count] is uninitialized */
      prop = get_shape_prop(sh);
      pr = &prop[sh->prop_count++];               // 1                
      pr->atom = JS_DupAtom(ctx, atom);
      pr->flags = prop_flags;
      sh->has_small_array_index |= __JS_AtomIsTaggedInt(atom);
      /* add in hash table */           
      hash_mask = sh->prop_hash_mask;             // 2
      h = atom & hash_mask;
      pr->hash_next = prop_hash_end(sh)[-h - 1];  // 3
      prop_hash_end(sh)[-h - 1] = sh->prop_count; // 4
      return 0;
    }
    

上面代码相应的解释为：

*   首先是位置 `1` 处，将新的元素追加到 `JSShape::prop` 数组中。此处为了性能考虑，并没有开辟新的内存，而是使用的预分配的内存位置：
    
    `JSShape::prop_size` 是整个元信息数组（含预分配）元素在内的大小，`JSShape::prop_count` 是实际已经使用的元素个数，因此 `&prop[sh->prop_count++]` 中先使用 `sh->prop_count` 再将其自增 1 的操作表示使用了预分配的位置
    
*   到了位置 `2` 处，开始将新的属性元信息追加到其属性名（atom）对应的 Bucket 中：
    
    *   前面我们提到，为了建立属性名到属性元信息的关系，需要一个 Hashmap
        
    *   `prop_hash_end(sh)[-h - 1]` 表示的是 Bucket 中的首个元素，Bucket 中的元素类型为 `JSShapeProperty`，它们通过 `JSShapeProperty::hash_next` 链接
        
*   `3` 和 `4` 的位置将新追加的元素作为 Bucket 的首个元素
    
    需要注意的是位置 `4` 使用的是 `sh->prop_count` 而不是 `sh->prop_count - 1`，前者已经表示属性元信息数组的下一个可用位置了，后者才是当前新添加的属性元信息的索引
    
    正因为这样，在未来使用 `JSShapeProperty::hash_next` 的时候都需要减去 1
    
        static force_inline JSShapeProperty *find_own_property1(JSObject *p,
                                                                JSAtom atom)
        {
          // ...
          while (h) {
            // h 存放的是下一个索引位置，因此减去 1 才是元素的索引位置
            pr = &prop[h - 1]; 
            if (likely(pr->atom == atom)) {
              return pr;
            }
            h = pr->hash_next;
          }
          return NULL;
        }
        
    
    因为 Bucket 中首个元素存放的是「下一个索引位置」的关系，其值的范围会以 `1` 起始，加上 Bucket 初始化时首个元素赋值了 `0`，则可以通过判断首个元素值是否为 0 快速地分辨 Bucket 是否为空。
    

`JSShape::prop` 采用了预分配的内存，在新增属性时，如果预分配的内存不够用了，就需要重新分配，该操作是通过 [resize\_properties](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L187 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L187") 函数完成的：

    no_inline int resize_properties(JSContext *ctx, JSShape **psh, JSObject *p,
                                    uint32_t count) {
      // ...
      new_size = max_int(count, sh->prop_size * 3 / 2);                      // 1
      /* Reallocate prop array first to avoid crash or size inconsistency
         in case of memory allocation failure */
      if (p) {                                                               // 2
        JSProperty *new_prop;
        new_prop = js_realloc(ctx, p->prop, sizeof(new_prop[0]) * new_size);
        if (unlikely(!new_prop))
          return -1;
        p->prop = new_prop;
      }
      new_hash_size = sh->prop_hash_mask + 1;
      while (new_hash_size < new_size)                                       // 3
        new_hash_size = 2 * new_hash_size;
      if (new_hash_size != (sh->prop_hash_mask + 1)) {                       // 4
      } else {                                                               // 5
        /* only resize the properties */
      }
      *psh = sh;
      sh->prop_size = new_size;
      return 0;
    }
    

*   首先在位置 `1` 计算需要扩容到的 `prop_size`，通过表达式可知会呈 1.5 倍增长
    
*   位置 `2` 处根据新的 `prop_size` 来对 `JSObject::prop` 数组扩容
    
*   位置 `3` 处的循环用于确保 `prop_hash_size` 也就是 Buckets 数组的长度始终大于 `prop_size` 且为 2 的幂。比如 `prop_size` 为 3，那么 `new_hash_size` 为 `4`，`prop_size` 为 5 那么 `new_hash_size` 为 `6`
    
*   位置 `4` 处表示，如果 `prop_hash_size`（`sh->prop_hash_mask + 1`）变了，那么 Buckets 数组和 `JSShape::prop` 都得扩容
    
*   位置 `5` 表示，如果仅 `prop_size` 变了，那么只将 `JSShape::prop` 扩容即可，毕竟 `JSShape::prop` 的长度需要和其代表的对象的 `JSObject::prop` 长度一致
    

### 更新属性

我们简单看一下属性的更新，因为其中一些步骤与属性新增相同。

属性的更新通过函数 [JS\_SetPropertyInternal](https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1646 "https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1646") 完成，该方法内部主要是 2 步操作：

1.  通过函数 `find_own_property` 在对象和对象的原型上查找属性名 atom 对应的属性元信息 `JSShapeProperty` 和属性值 `JSProperty`
    
2.  通过 [set\_value](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.h#L28 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/gc.h#L28") 方法将新的值设置到 `JSProperty::u::value` 上，并将之前的值释放，该方法内部并没有增加新值的引用计数
    

### 删除属性

删除属性通过函数 [delete\_property](https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1295 "https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1295") 来完成。

函数中也是通过 atom 找到属性元信息 Bucket，然后在 Bucket 中线性查找与之相配的元素（对比 `JSShapeProperty::atom`）：

    while (h != 0) {
        pr = &prop[h - 1];
        if (likely(pr->atom == atom)) {
    
        }
    }
    

删除时分 2 步：

1.  将元信息的 `JSShapeProperty::atom` 清除（[设置](https://github.com/hsiaosiyuan0/slowjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1334 "https://github.com/hsiaosiyuan0/slowjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1334")为 `JS_ATOM_NULL`）
    
2.  将待删除元信息的前后元素进行 [连接](https://github.com/hsiaosiyuan0/slowjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1322 "https://github.com/hsiaosiyuan0/slowjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L1322")：
    
    *   通过 `lpr` 记录待删除元素的前一个元素
        
    *   通过设置 `lpr->hash_next = pr->hash_next;` 完成删除
        

找到属性元信息后，由于其索引同时也是属性值在 `JSObject::prop` 中的索引，所以可以很快访问到表示属性值的元素：

1.  通过 [free\_property](https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L287 "https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L287") 对索引位置的属性值上的 `JSProperty::u::value` 进行释放
    
2.  将属性值的 `JSProperty::u::value` 设置为 `JS_UNDEFINED`
    

细心的读者会发现，删除操作并没有将元素从 `JSShape::prop` 和 `JSObject::prop` 中移除。这是因为二者都是数组，移除元素后需要拷贝整个数组，会有性能问题。但一直不移除元素，又会压迫内存，于是引擎内部设置了阈值：

    if (sh->deleted_prop_count >= 8 &&
      sh->deleted_prop_count >= ((unsigned)sh->prop_count / 2)) {
      compact_properties(ctx, p);
    }
    

当已删除的元素数目达到 `8` 时，通过函数 [compact\_properties](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L253 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/shape.c#L253") 进行一次属性相关的数组的压实操作：

*   对于元信息数组 `JSShape::prop` 的压实，只需要将 `JSShapeProperty::atom` 不为 `JS_ATOM_NULL` 的元素拷贝到新的元信息数组中即可
    
        for (i = 0; i < sh->prop_count; i++) {
          if (old_pr->atom != JS_ATOM_NULL) {
            // ...
          }
        }
        
    
    拷贝操作是因为 shape 被多个对象共用，而属性删除操作只作用到某个对象，换句话说是为删除属性的对象新建一个 shape
    
*   因为元信息数组的长度发生变化，在其之上构建的 atom 到元信息的 Hashmap 也需要做调整：
    
    *   将 Bucket 数组的长度缩小：
        
            new_hash_size = sh->prop_hash_mask + 1;
            while ((new_hash_size / 2) >= new_size)
              new_hash_size = new_hash_size / 2;
            new_hash_mask = new_hash_size - 1;
            
        
    *   根据 `JSShapeProperty::atom` 和新的 Buckets 数组长度构建 Hashmap：
        
            for (i = 0; i < sh->prop_count; i++) {
              // ...
              h = ((uintptr_t)old_pr->atom & new_hash_mask);
              pr->hash_next = prop_hash_end(sh)[-h - 1];
              prop_hash_end(sh)[-h - 1] = j + 1;
              // ...
            }
            
        

重新调整 Buckets 数组长度的同时，也将 `JSObject::prop` 一并压缩了：

    j = 0;
    old_pr = old_sh->prop;
    pr = sh->prop;
    prop = p->prop;
    for (i = 0; i < sh->prop_count; i++) {
      if (old_pr->atom != JS_ATOM_NULL) { // 1
        // ...
        prop[j] = prop[i];
        j++;
        pr++;
      }
      old_pr++;
    }
    

上面的代码中：

*   `j` 表示新数组的长度
    
*   遍历 `JSShape::prop`，如果其 `atom` 为 `JS_ATOM_NULL` 表示该索引位置对应的 `JSObject::prop` 中的元素也被删除了
    
*   于是位置 `1` 就表示遇到未删除的元素时，通过 `prop[j] = prop[i]` 将其往数组的开头移动，这样 `i` 位置就可以被视为废弃位置了
    

上面的操作是在 `JSShape::prop` 原数组上进行的压缩操作，为了真正释放内存，后续会再 [js\_realloc](https://github.com/hsiaosiyuan0/slowjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/shape.c#L313 "https://github.com/hsiaosiyuan0/slowjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/shape.c#L313") 一下。

### class\_id 与对象的原型

在 `JS_NewObject` 的调用链中，函数 [JS\_NewObjectProtoClass](https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L2801 "https://github.com/hsiaosiyuan0/quickjs/blob/efcacf4f8c76523bad7925d264130ea1f3143b97/src/vm/obj.c#L2801") 的作用就是使用原型创建对象：

    JSValue JS_NewObjectProtoClass(JSContext *ctx, JSValueConst proto_val,
                                   JSClassID class_id) {
      JSShape *sh;
      JSObject *proto;
    
      proto = get_proto_obj(proto_val);
      sh = find_hashed_shape_proto(ctx->rt, proto);     // 1
      // ...
      return JS_NewObjectFromShape(ctx, sh, class_id);
    }
    

在前面的章节中我们构造结构特征量时，使用了 hash 链的方式，hash 链的第一环就是对象的原型，所在 `1` 的位置，通过 `find_hashed_shape_proto` 会使用查找与当前原型对应的 shape

现在我们可以再回到 `JS_NewObject1` 函数中，看看其调用 `JS_NewObjectProtoClass` 是如何传递原型对象的：

    JSValue JS_NewObject(JSContext *ctx) {
      /* inline JS_NewObjectClass(ctx, JS_CLASS_OBJECT); */
      return JS_NewObjectProtoClass(ctx, ctx->class_proto[JS_CLASS_OBJECT],
                                    JS_CLASS_OBJECT);
    }
    

可以看创建对象所需的原型对象是通过 `JS_CLASS_OBJECT` 从 `JSContext::class_proto` 上取得的。

`JSContext::class_proto` 是一个数组，上面包含了创建内置对象所需的原型对象，比如当需要创建 `Object` 时，通过 `JS_CLASS_OBJECT` 就可以索引到 `Object.prototype`。

`JSContext::class_proto` 中的内容是其实例化函数 [JS\_NewContext](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L52 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L52") 中调用函数 [JS\_AddIntrinsicBasicObjects](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/intrins.c#L124 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/intrins.c#L124") 设置的：

    JSContext *JS_NewContext(JSRuntime *rt)
    {
      JSContext *ctx;
    
      ctx = JS_NewContextRaw(rt);
      if (!ctx)
        return NULL;
    
      JS_AddIntrinsicBaseObjects(ctx);
      // ...
    }
    

### 访问对象的原型

对象创建后如何访问起原型对象呢？

在 JS 对象上有一个已经废弃的属性 [**proto**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto") 可以访问到对象的原型：

    ({}).__proto__ === Object.prototype; // true
    

我们来看看引擎内部是如何实现 `__proto__` 的。

首先我们发现，对象自身是没有属性 `__proto__` 的 - 上面的代码创建的是一个没有任何属性的对象。

由于 JS 原型链的关系，很容易联想到是不是在对象的原型中存在属性 `__proto__` 的定义。于是我们通过 `JS_CLASS_OBJECT` 可以找到原型对象的定义：

    void JS_AddIntrinsicBaseObjects(JSContext *ctx)
    {
      // ...
      /* Object */
    
      // 设置原型对象上的方法
      JS_SetPropertyFunctionList(ctx, ctx->class_proto[JS_CLASS_OBJECT],
                                  js_object_proto_funcs, countof(js_object_proto_funcs));
      // ...
    }
    

其中 `js_object_proto_funcs` 上定义了 `__proto__`：

    static const JSCFunctionListEntry js_object_proto_funcs[] = {
      // ...
      JS_CGETSET_DEF("__proto__", js_object_get___proto__, js_object_set___proto__ ),
      // ...
    };
    

大致可以看出来 `__proto__` 是一个 getter-setter 属性，当访问属性时，调用的函数是 `js_object_get___proto__`：

    static JSValue js_object_get___proto__(JSContext *ctx, JSValueConst this_val) {
      JSValue val, ret;
    
      // ..
      ret = JS_GetPrototype(ctx, val);
      JS_FreeValue(ctx, val);
      return ret;
    }
    

继续看一下函数 `JS_GetPrototype`：

    JSValue JS_GetPrototype(JSContext *ctx, JSValueConst obj) {
      JSValue val;
      if (JS_VALUE_GET_TAG(obj) == JS_TAG_OBJECT) { // 1
        JSObject *p;
        p = JS_VALUE_GET_OBJ(obj);
        if (unlikely(p->class_id == JS_CLASS_PROXY)) {  // 2
          val = js_proxy_getPrototypeOf(ctx, obj);
        } else {
          p = p->shape->proto;  // 3
          if (!p)
            val = JS_NULL;
          else
            val = JS_DupValue(ctx, JS_MKPTR(JS_TAG_OBJECT, p));
        }
      } else {
        val = JS_DupValue(ctx, JS_GetPrototypePrimitive(ctx, obj)); // 4
      }
      return val;
    }
    

上面代码的操作为：

1.  如果传入的 `obj` 是对象，那么就进行第 2 步，否则进入第 4 步
    
2.  如果对象是 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy") 那么就按 Proxy 方式访问对象的原型，否则进行第 3 步
    
3.  返回对象的 shape 上的 `proto`
    
4.  返回 Primitive 类型的原型对象
    

### 原型链

下面我们通过分析几个原型链中的关系来了解引擎内部是如何支持原型链的。

下图是 JS 对象的原型链关系概览：

![javascript_object_layout](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/155b168a3b6a4f069e70d010630ffc2e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=611&h=760&s=83278&e=png&b=fefefe)

> 图中各部分的关系的定义由 JS 语言标准给定，引擎的工作则是实现标准中的定义。

图中显示 `Object.prototype.__proto__` 为 `null`，我们看看引擎中是怎么设置 `Object.prototype` 的：

    static void JS_AddIntrinsicBasicObjects(JSContext *ctx)
    {
      // ...
      ctx->class_proto[JS_CLASS_OBJECT] = JS_NewObjectProto(ctx, JS_NULL /* 注意这里 */);
      // ...
    }
    

上面代码中函数 `JS_NewObjectProto` 的调用结果即为 `Object.prototype`，可以看到其返回的对象的 shape 上的 `proto` 字段设置为了 `JS_NULL`，结合上面 `__proto__` 的 getter 方法，就可以完成标准中规定的 `Object.prototype.__proto__` 为 `null` 的语义。

我们再看图中的另一个表示：

    Object.__proto__ === Function.prototype // true
    

需要再次明确的是，图中的关系是语言标准规定的，引擎只是按照标准来实现。回到引擎实现中，`Object` 是在 `JS_AddIntrinsicBaseObjects` 函数中设置的：

    void JS_AddIntrinsicBaseObjects(JSContext *ctx)
    {
      // ...
      obj = JS_NewGlobalCConstructor(ctx, "Object", js_object_constructor, 1,
                                       ctx->class_proto[JS_CLASS_OBJECT]);
      // ...
    }
    

也就是说在引擎初始化阶段，需要初始化一个全局的构造函数 `Object`，并且这个函数的 `prototype` 为 `JSContext::class_proto` 数组的 `JS_CLASS_OBJECT` 位置上的对象。

我们继续看看 `JS_NewGlobalCConstructor` 函数的实现：

    static JSValueConst JS_NewGlobalCConstructor(JSContext *ctx, const char *name,
                                                 JSCFunction *func, int length,
                                                 JSValueConst proto)
    {
      JSValue func_obj;
      func_obj = JS_NewCFunction2(ctx, func, name, length, JS_CFUNC_constructor_or_func, 0);
      JS_NewGlobalCConstructor2(ctx, func_obj, name, proto);
      return func_obj;
    }
    

可以看到该函数返回的是一个使用 `JS_NewCFunction2` 函数创建的对象，而该函数的实现为：

    JSValue JS_NewCFunction2(JSContext *ctx, JSCFunction *func,
                             const char *name,
                             int length, JSCFunctionEnum cproto, int magic)
    {
      return JS_NewCFunction3(ctx, func, name, length, cproto, magic,
                              ctx->function_proto);
    }
    
    static JSValue JS_NewCFunction3(JSContext *ctx, JSCFunction *func,
                                    const char *name,
                                    int length, JSCFunctionEnum cproto, int magic,
                                    JSValueConst proto_val)
    {
      JSValue func_obj;
      JSObject *p;
      JSAtom name_atom;
    
      func_obj = JS_NewObjectProtoClass(ctx, proto_val, JS_CLASS_C_FUNCTION);
      // ...
      return func_obj;
    }
    

根据传参，我们可以将调用简化为：

    func_obj = JS_NewObjectProtoClass(ctx, ctx->function_proto, JS_CLASS_C_FUNCTION)
    

其中 `ctx->function_proto` 即 `Function.prototype` 了。

### instanceof

引擎中实现 instanceof 操作是通过调用函数 `JS_IsInstanceOf` 完成的：

    int JS_IsInstanceOf(JSContext *ctx, JSValueConst val, JSValueConst obj) {
      JSValue method;
    
      if (!JS_IsObject(obj))
        goto fail;
      method = JS_GetProperty(ctx, obj, JS_ATOM_Symbol_hasInstance); // 1
      if (JS_IsException(method))
        return -1;
      if (!JS_IsNull(method) && !JS_IsUndefined(method)) {
        JSValue ret;
        ret = JS_CallFree(ctx, method, obj, 1, &val);
        return JS_ToBoolFree(ctx, ret);
      }
    
      /* legacy case */
      if (!JS_IsFunction(ctx, obj)) { // 2
      fail:
        JS_ThrowTypeError(ctx, "invalid 'instanceof' right operand");
        return -1;
      }
      return JS_OrdinaryIsInstanceOf(ctx, val, obj);
    }
    

函数内容主要分两部分，如果 `obj` 实现了 [Symbol.hasInstance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance") 的话，那么就调用 `obj` 上对应的方法

否则就使用 `JS_OrdinaryIsInstanceOf` 函数判断 `obj` 的 `prototype` 是否在 `val` 的原型链上：

    int JS_OrdinaryIsInstanceOf(JSContext *ctx, JSValueConst val,
                                JSValueConst obj) {
      // ...
      obj_proto = JS_GetProperty(ctx, obj, JS_ATOM_prototype); // 1
      // ...
      proto = JS_VALUE_GET_OBJ(obj_proto); // 2
      p = JS_VALUE_GET_OBJ(val);
      for (;;) {                           // 3
        proto1 = p->shape->proto;          // 4
        if (!proto1) {
          /* slow case if proxy in the prototype chain */
          if (unlikely(p->class_id == JS_CLASS_PROXY)) { // 5
            // ...
          } else {
            ret = FALSE;
          }
          break;
        }
        p = proto1;
        if (proto == p) { // 6
          ret = TRUE;
          break;
        }
      }
    done:
      JS_FreeValue(ctx, obj_proto);
      return ret;
    }
    

1.  首先 `1` 和 `2` 的配合，取得 `obj` 的 `prototype` 属性，保存在 `obj_proto` 中
    
2.  然后进入循环 `3`，在循环内通过 `3`，`4`，`6` 的操作，遍历原型链，看链上是否存在对象 `obj_proto`
    
3.  循环间如果对象是 Proxy，那么需要通过 Proxy 的方式取得对象的原型
    

### 常用函数

下面是几个创建对象时引擎内部常用的函数，了解它们的功能梗概可以方便我们阅读源码：

    // - 以 `sh` 为 shape 创建一个对象 O，新创建的对象将包含 `sh` 上定义的属性
    //   并且新创建对象 O 的 `__proto__` 属性为 `sh` 上的 `proto` 字段
    //
    // - `class_id` 用于对创建的对象 O 做一些差异化的调整
    static JSValue JS_NewObjectFromShape(JSContext *ctx, JSShape *sh, JSClassID class_id);
    
    // - 使用 `proto_val` 找到（或者创建）一个 shape 记为 S（`proto_val` 为 S 的 `Shape::proto` 字段），S 上的属性数为 0
    //   然后用 S 为 shape 创建对象 O 也就是说 `proto_val` 为新创建对象的 `__proto__` 属性
    //
    // - `class_id` 用于对创建的对象 O 做一些差异化的调整
    JSValue JS_NewObjectProtoClass(JSContext *ctx, JSValueConst proto_val,
                                   JSClassID class_id);
                                   
    // 使用内置的原型对象创建一个对象 O，对象 O 的属性 `__proto__` 为根据 class_id 在 `JSContext::class_proto` 上索引到原型对象
    JSValue JS_NewObjectClass(JSContext *ctx, int class_id);
    
    // 即 `JS_NewObjectProtoClass(ctx, proto, JS_CLASS_OBJECT)`
    JSValue JS_NewObjectProto(JSContext *ctx, JSValueConst proto);
    

小结
--

下面我们对本节一些值得留意的内容进行梳理，首先是关于 Shape 的：

*   引擎内部通过 shape 使得对象属性的元信息可以在多个对象间共享
    
*   引擎内部的 shape 都挂在 `JSRuntime` 上，通过一个手动构造的 Hashmap 管理
    
*   存储 shape 的 Hashmap 键为对象属性元信息的特征量，特征量使用的是 hash 链，包含了下面的信息：
    
    *   对象的原型（原型对象的指针）
        
    *   所有属性的名称
        
    *   所有属性的先后顺序（通过构造 hash 的链的顺序保证）
        
    *   所有属性的描述符
        
*   shape 内也构造了一个 Hashmap，用于将表示属性名的 atom 关联到对应的属性元信息，该 Hashmap 有几个特点：
    
    *   属性元信息存在连续的内存地址上（与一般的离散地存在于堆上不同）
        
    *   Bucket 中的元素通过数组索引进行关联
        
    *   Buckets 数组并不在 shape 结构内（高地址内存中），而是在紧挨着 shape 结构起始地址之前的一块内存
        

对象操作的主要内容为：

*   引擎内部通过 shape 来创建对象，对应的函数是 `JS_NewObjectFromShape`
    
*   引擎在初始化阶段会为内置的类型创建它们的原型对象，放在 `JSContext::class_proto` 中
    
*   通过 `JSObject::shape` 上的 `JSShape::proto` 可以访问到对象的原型，不过要区分 Proxy 和 Primitive 类型
    
*   函数对象的 `prototype` 属性可以通过 `JS_ATOM_prototype` 操作函数 `JS_GetProperty` 访问到，在函数作为构造函数使用时，会将其 `prototype` 设置为新创建对象的 `__proto__` 属性
    
*   两个例子 `Object.prototype.__proto__ === null` 和 `Object.__proto__ === Function.prototype` 演示了原型链在引擎层面的实现方式
    
*   简单分析了 instanceof 操作符在引擎层面的实现，并且梳理了几个创建对象时涉及到的函数
    

对象作为 JS 中数据类型中的绝对明星，了解其在引擎内部的实现后，再理解其余的数据类型实现也会变得简单。下一节我们将介绍引擎是如何处理 Primitive values 的。