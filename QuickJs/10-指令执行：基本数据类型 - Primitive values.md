JS 语言标准中 [定义了](https://tc39.es/ecma262/#sec-ecmascript-language-types "https://tc39.es/ecma262/#sec-ecmascript-language-types") JS 的数据类型，主要分为 2 类：

*   Primitive values:
    *   Undefined
    *   Null
    *   Boolean
    *   Number
    *   BigInt
    *   String
    *   Symbol
*   Objects

Primitive value 在 [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Primitive "https://developer.mozilla.org/en-US/docs/Glossary/Primitive") 上的解释为：

> In JavaScript, a primitive (primitive value, primitive data type) is data that is not an object and has no methods or properties.

从内存结构上我们也可以简单地将 Primitives values 理解为原子型（业务通常不会访问其内部的内存结构），而 Objects 可以看成是由 Primitives values 和 Objects 组成的复合类型。

比较常见的例子是 String value 和 String object 在 JS 中的差别：

    console.log(typeof ""); // string
    console.log(typeof new String("")); // object
    

String value
------------

我们先看 String value，其在引擎中通过 `JSString` 表示：

    typedef struct JSString {
      JSRefCountHeader header; /* must come first, 32-bit */
      uint32_t len : 31;
      uint8_t is_wide_char : 1; /* 0 = 8 bits, 1 = 16 bits characters */
      /* for JS_ATOM_TYPE_SYMBOL: hash = 0, atom_type = 3,
         for JS_ATOM_TYPE_PRIVATE: hash = 1, atom_type = 3
         XXX: could change encoding to have one more bit in hash */
      uint32_t hash : 30;
      uint8_t atom_type : 2; /* != 0 if atom, JS_ATOM_TYPE_x */
      uint32_t hash_next;    /* atom_index for JS_ATOM_TYPE_SYMBOL */
    #ifdef DUMP_LEAKS
      struct list_head link; /* string list */
    #endif
      union {
        uint8_t str8[0]; /* 8 bit strings will get an extra null terminator */
        uint16_t str16[0];
      } u;
    } JSString;
    

接下来我们将通过了解这些字段的用途来理解 String value 在引擎层面的实现方式。

### Unicode 字符集和编码方式

String value 的字符串数据保存在字段 `u` 中，`len` 表示的是 `u` 中元素的长度：

*   如果 `is_wide_char` 为 `0`，那么 `len` 为 `str8` 元素的个数，存放的字符串数据的原始内容
    
    `len` 的长度会比实际的字符串数据所占的字节长度多 1，用于存放字符 `\0`，以此和 C 语言中字符串的内存格式保持一致
    
*   如果 `is_wide_char` 为 `1`，那么 `len` 为 `str16` 的元素个数，存放的字符串数据经过 UTF-16 编码
    

因为单字节长度的 ASCII 字符集能容纳的字符变化数太少了，JS 语言规范采用了 Unicode 字符集来表示字符串：

![unicode_plane.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/448beab146214a90aee55d7a38b17c73~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=374&h=437&s=11243&e=png)

Unicode 字符集采用「平面 Plane」的概念来对字符进行组织。为了方便描述，我们把编码到 Unicode 字符集中的字符称为「码点，code point」。

每个码点可以通过一个 16 进制数 U+**hh**hhhh 来表示，其中高位的 2 个十六进制数表示的是平面的编号，也就是说有 17 个平面（编号 0~16），每个平面可以存放 65536 个码点（`0x0000~0xFFFF`）。

编码为 0 的平面也称为「基础多语言平面 Basic Multilingual Plane，BMP」放置了高频使用的字符。

Unicode 虽然可以容纳更多的字符，但是也有一个显著的缺点，即总是需要 4 字节长度来，而那些处于 ASCII 字符集的码点原本存储仅需 1 字节，存储空间的增加不利于网络传输和存储。

为了解决这个问题，实际使用时一般会使用 Unicode 的转换格式：UTF-8，UTF-16。

UTF-8 的全称是「8 位的 unicode 转换格式 8-bit Unicode Transformation Format」，它采用一种变长的编码方式，对码点数值进行一些转换：

    Codepoint. number range  |        UTF-8 octet sequence
      (hexadecimal)          |              (binary)
    -------------------------+---------------------------------------------
    0000 0000-0000 007F      |    0xxxxxxx
    0000 0080-0000 07FF      |    110xxxxx 10xxxxxx
    0000 0800-0000 FFFF      |    1110xxxx 10xxxxxx 10xxxxxx
    0001 0000-0010 FFFF      |    11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
    

上面的表格左边表示 Unicode 字符集中码点数值的区间，右边表示区间内的码点用了 UTF-8 编码后的形式和存储所需字节数。我们暂时不通深究具体的编码转换方式，只需要关注到 UTF-8 的压缩效果还是不错的。我们在网络传输时大部分情况会也使用 UTF-8 编码，比如我们常常会看到 HTTP 请求头中带有编码格式的说明：

    Content-Type: text/html; charset=UTF-8
    

但是 UTF-8 也有它的局限性 - 当我们需要随机访问字符串中的字符时，只能通过线性查找的方式，因为我们通过下标定位到字节后，无法进一步判断它和起前后的哪几个字节一起构成一个码点。UTF-16 则是为了解决这个问题。

UTF-16 可以看成是一个定长的编码方式：

1.  位于 BMP 中的码点使用 16bits 表示，称为 code unit
    
2.  位于 BMP 之外的的平面，即「补充平面，supplementary planes」中的码点使用 2 个 code units 表示，前后的 code point 分别称为 leading surrogate 和 trailing surrogate，它们合起来称为 surrogate pair
    

BMP 中包含了 `0x10000`（65536）个码点，所以上面第 2 步中只需解决剩余 `0x10FFFF - 0x10000` 即 1048575 个码点的编码方式即可。

1048575 的二进制表示为 `11111111111111111111` 共 20 个 bits，于是 UTF-16 编码方案选择使用 2 个 code units 来存储这些 bits，并且为了方便将这个 20 个 bits 分为两份 - leading surrogate 和 trailing surrogate 各存放 10 个 bits，可以表示的码点数为 `0b1111111111` 即 `0x3FF`。

然后 UTF-16 选择 leading surrogate 的初始值为 `0xD800`，那么对于 leading surrogate 来说其范围就是 `[0xD800, 0xDBFF = 0xD800 + 0x3FF]`

为了让 surrogate pair 的数值范围能够连续变化，trailing surrogate 的起始数值选择 `0xDC00`，那么其数值范围即 `[0xDC00, 0xDFFF = 0xDC00 + 0x3FF]`

经过上面的处理后，我们可以发现这几个特点：

*   leading surrogate 和 trailing surrogate 的取值范围是没有重叠的
    
*   surrogate pair 的取值范围是连续的 `[0xD800, 0xDFFF]`
    

结合 Unicode 标准在 BMP 中预留了 `[0xD800, 0xDFFF]` 专门用于 UTF-16 编码，这样就使得 UTF-16 成了一个定长的编码方案，当我们随机访问到一个 code unit 时：

*   如果它不处于区间 `[0xD800, 0xDFFF]`，那么它就是 BMP 中的码点
    
*   如果它位于 `[0xD800, 0xDBFF]`，那么它是 leading surrogate，需要和后一个 code point 即 trailing surrogate 一起构成一个码点
    
*   如果它位于 `[0xDC00, 0xDFFF]`，那么它是 trailing surrogate，需要和前一个 code point 即 leading surrogate 一起构成一个码点
    

从 UTF-16 编码方案的实现来看，`0xD800` 作为起始值并不是必须的，估计是因为这个值在 BMP 中也比较靠后，具体原因我们这里就不继续深究了。

### Atom

还剩下三个字段没有了解：`hash`，`atom_type`，`hash_next`，这三个字段是为了实现 Atom 的功能。

考虑下面的代码：

    let a = "a str";
    let b = "a str";
    

上面的代码中我们让变量 `a` 和 `b` 保存了具有相同数据的字符 `a str`，如果 `a str` 在引擎运行阶段存在两份相同的内存拷贝，那势必会造成内存的浪费。

JS 中的 String value 是 Immutable 的，语言规范中没有明确地表示 String value 是 Immutable 的，但可以从语言规范中的其他内容到隐式的证明：

*   从数学定义的角度来看，value 都为 immutable 的
    
*   语言规范中也没有提及可以修改 String value 的方式
    

> 更多细节可以参考 [What part of ECMAScript spec mandates that String type is immutable](https://stackoverflow.com/questions/71849173/what-part-of-ecmascript-spec-mandates-that-string-type-is-immutable "https://stackoverflow.com/questions/71849173/what-part-of-ecmascript-spec-mandates-that-string-type-is-immutable")

基于 String value 是 Immutable 的这个特点，引擎在实现层面通过 Atom 来避免相同字符串数据出现多份拷贝，也一定程度上提高了比较字符串数据是否相等时的计算性能。

引擎内提供了一个 Hash table `HashTable<StringData, Atom>`，可以将相同内容的字符串数据内容映射到同一个 Atom，而 Atom 则是 一个 32-bit 整型数

我们来看一下引擎实现这样一个 Hash table 的方式：

    struct JSRuntime {
      // ...
      int atom_hash_size; /* power of two */
      int atom_count;
      int atom_size;
      int atom_count_resize; /* resize hash table at this count */
      uint32_t *atom_hash;
      JSAtomStruct **atom_array;
      // ...
    }
    

在 `JSRuntime` 中通过上面的字段实现了 Hash table，并使用了 [Separate chaining](https://en.wikipedia.org/wiki/Hash_table#Separate_chaining "https://en.wikipedia.org/wiki/Hash_table#Separate_chaining") 来避免元素冲突：

![hash_table](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2f070428c8441ba95a13531c6fa6049~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2880&h=1984&s=220415&e=png&a=1&b=9bfd9b)

通过上图我们可以发现 Separate chaining 是先将 Key 映像到 Buckets，然后再对 Bucket 中的内容（Entries）做线性访问

字段 `atom_array` 为数组，用于存放 Entries。数组元素类型为 `JSAtomStruct *`。`JSAtomStruct` 实际是 `JSString` 的别名：

    typedef struct JSString JSAtomStruct;
    

字段 `atom_hash` 和其之前的字段用于表示 Buckets。

我们通过下图来演示 `HashTable<StringData, Atom>` 的实现方式：

![atom_array](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/337a8e726d3141cf8dd2299fa3922477~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1388&h=1110&s=109982&e=png&b=ffffff)

假设我们的字符串数据为 StringDataStringDataStringData，上图演示的过程表示如何在 `HashTable<StringData, Atom>` 中查找是否已经存在对应的 Atom：

1.  首先通过函数 hash(StringData)hash(StringData)hash(StringData) 将字符串的值映射为 atom\_hashatom\\\_hashatom\_hash 数组的元素索引 idxatom\_hashidx\_{atom\\\_hash}idxatom\_hash​
    
2.  atom\_hashatom\\\_hashatom\_hash 表示的是 Buckets，因此上一步也表示选择 Bucket，选择了 Bucket 后，则需要遍历其中的元素
    
3.  atom\_hashatom\\\_hashatom\_hash 数组中的元素表示 atom\_arrayatom\\\_arrayatom\_array 数组元素的索引，因此通过 atom\_hash\[idxatom\_hash\]atom\\\_hash\[idx\_{atom\\\_hash}\]atom\_hash\[idxatom\_hash​\] 访问到的是 idxatom\_arrayidx\_{atom\\\_array}idxatom\_array​，继续通过 atom\_array\[idxatom\_array\]atom\\\_array\[idx\_{atom\\\_array}\]atom\_array\[idxatom\_array​\] 可以访问到 atom\_arrayatom\\\_arrayatom\_array 中的元素
    
4.  atom\_arrayatom\\\_arrayatom\_array 中的元素为 JSString∗JSString\*JSString∗，解引用后可以访问到 JSStringJSStringJSString
    
5.  到这一步访问到的 JSStringJSStringJSString 是 Bucket 中的首个元素，可以通过 `JSString::hash_next` 访问到下 Bucket 中的 一个元素，以此类推直到 `hash_next` 的值为 0，表示已经遍历完 Bucket 中的所有元素
    

我们继续看一看 hash(StringData)hash(StringData)hash(StringData) 是如何将 StringDataStringDataStringData 映射到 idxatom\_hashidx\_{atom\\\_hash}idxatom\_hash​ 的：

    h = hash_string(str, atom_type); // 1
    h &= JS_ATOM_HASH_MASK;          // 2
    
    h1 = h & (rt->atom_hash_size - 1); // 3
    i = rt->atom_hash[h1];
    

*   首先 `str` 即为待映射的 StringDataStringDataStringData，先通过一个哈希函数计算出 hashstrhash\_{str}hashstr​，hashstrhash\_{str}hashstr​ 为 `uint32_t`
    
*   为了避免重复计算字符串数据的哈希值，上文 `JSString` 的定义中有一个字段 `hash`，用于保存字符串数据的哈希值。我们注意到 `hash` 字段只有 30bits，因此上面位置 `2` 的代码会取 hashstrhash\_{str}hashstr​ 低位的 30 个 bits
    
*   此时 `h` 还不能作为 `atom_hash` 的元素索引，因为其取值范围为 30 个 bits 能表示的最大数值，远超 `atom_hash` 的数组长度，因此位置 `3` 会再次缩小 `h` 的取值范围，使其落在 \[0,lengthatom\_array)\[0, length\_{atom\\\_array})\[0,lengthatom\_array​) 区间内
    

位置 `3` 缩小 `h` 的范围是通过求模运算 `h % atom_hash_size`。不过并没有直接使用求模运算符 `%`，而是通过位操作进行了优化，优化成立的条件是引擎中会确保 `atom_hash_size` 的值**总是**是 `power of 2`。

`power of 2` 的数其二进制表示有个特点 - 最高位 bit 为 `1` 其余 bit 都为 `0`：

*   4 的二进制格式为 `100` 最低 2 位为 0
    
*   8 的二进制格式为 `1000` 最低 3 位为 0
    

比如当 `h` 和 `4` 进行求模运算时，结果的取值范围是 `[0, 4)`，这样的数值范围刚好就是通过低 2 位的 bits 可以表示，类似的对 `8` 进行求模运算时，结果的取值范围是 `[0, 8)`，这样的数值方位也刚好可以通过低 3 位的 bits 来表示。

`power of 2` 的数减 1 后刚好就可以让第 n 为的数值变为 1：

*   `4 - 1` 为 3，二进制表示是 `11`
    
*   `8 - 1` 为 7，二进制表示是 `111`
    

所以 `h` 通过 `&` `power of 2` 的数减 1 的结果可以快速取得第 n 为的 bits。

我们可以在函数 `__JS_FindAtom` 中找到上面的步骤对应的代码：

    JSAtom __JS_FindAtom(JSRuntime *rt, const char *str, size_t len,
                         int atom_type) {
      uint32_t h, h1, i;
      JSAtomStruct *p;
    
      // 计算字符串数据的哈希
      h = hash_string8((const uint8_t *)str, len, JS_ATOM_TYPE_STRING);
      h &= JS_ATOM_HASH_MASK;
      // 通过字符串哈希选取 bucket
      h1 = h & (rt->atom_hash_size - 1);
      i = rt->atom_hash[h1];
      // 遍历 bucket 中的元素
      while (i != 0) {
        p = rt->atom_array[i];
        if (p->hash == h && p->atom_type == JS_ATOM_TYPE_STRING && p->len == len &&
            p->is_wide_char == 0 && memcmp(p->u.str8, str, len) == 0) {
          if (!__JS_AtomIsConst(i))
            p->header.ref_count++;
          return i;
        }
        // 处理 bucket 中下一个元素
        i = p->hash_next;
      }
      return JS_ATOM_NULL;
    }
    

### Symbol

`JSString` 在引擎层面还可以表示 Symbol value，通过 `atom_type` 字段来标识：

    enum {
      JS_ATOM_TYPE_STRING = 1,      // 1
      JS_ATOM_TYPE_GLOBAL_SYMBOL,   // 2
      JS_ATOM_TYPE_SYMBOL,          // 3
      JS_ATOM_TYPE_PRIVATE,         // 4
    };
    

当 `JSString` 实例的 `atom_type` 字段值为 `JS_ATOM_TYPE_STRING` 时，表示该实例表示的是 String value，当 `atom_type` 大于等于 `JS_ATOM_TYPE_SYMBOL` 时，则表示存放的是 Symbol value：

*   当需要表示一般的 Symbol value 时：`atom_type` 值为 3，`hash` 为 0
    
*   当需要表示私有属性名的场景时：`atom_type` 值为 3，`hash` 为 1
    

当 `JSString` 表示的是 Symbol value 时，字段 `hash_next` 表示的是该实例的首地址在 `atom_array` 中的索引（因为 `atom_array` 中存放的是 `JSString*`），也就是 Symbol value 中的字符串数据对应的 Atom 数值。

当 `JSString` 表示的是 String value 时，则不能快速的知道其对应的 Atom，需要经过上面提到的 Hash table 查找：

    JSAtom js_get_atom_index(JSRuntime *rt, JSAtomStruct *p) {
      // 如果是 Symbol，则 hash_next 直接表示实例在 `atom_array` 中的索引
      uint32_t i = p->hash_next; /* atom_index */
      if (p->atom_type != JS_ATOM_TYPE_SYMBOL) {
        JSAtomStruct *p1;
    
        // 找到 bucket
        i = rt->atom_hash[p->hash & (rt->atom_hash_size - 1)];
        p1 = rt->atom_array[i];
        // 遍历 bucket 中的元素
        while (p1 != p) { // 比较实例的首地址即可
          assert(i != 0);
          i = p1->hash_next;
          p1 = rt->atom_array[i];
        }
      }
      return i;
    }
    

### 内存管理

当 `JSString` 实例的引用计数变为 0 时，需要将其所占的内存释放。释放操作包含两部分：

1.  第一部分是释放实例本身占用的堆内存，这个通过 `js_free_rt` 函数来完成
    
2.  第二部分是，因为 `atom_array` 中存放的是实例的首地址，所以当实例释放时，该索引位置也应该被标记为已释放，这样该位置可用于下次存放其他实例的首地址
    

释放字符串数据所占的堆内存比较简单，因此我们主要关注的是 `atom_array` 中的内容如何释放。相关操作封装在了函数 [JS\_FreeAtomStruct](https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/str.c#L1012 "https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/str.c#L1012") 中，我们简单分析一下其实现方式。

首先要找到待释放的实例 `JSString *` 在 `atom_array` 中的索引（`JSAtomStruct` 即为 `JSString`），查找的方式为：

*   如果实例的作用是 Symbol，那么其 `hash_next` 字段直接就是 `atom_array` 中的索引
    
*   否则的话需要根据实例上的 `hash` 字段进入之前章节介绍过的 hash table 的键值对的查找逻辑
    

找到该实例（首地址）在 `atom_array` 中的索引后，就需要释放该位置的内存，但是我们知道 `atom_array` 是一个数组，为了避免进行内存拷贝操作而损失性能，引擎进行了下面的操作：

    /* insert in free atom list */
    rt->atom_array[i] = atom_set_free(rt->atom_free_index);
    rt->atom_free_index = i;
    

源码注释中提到 `free atom list` 就是这里的核心操作了，它将不再使用的数组位置连接了起来：

![atom_free_index](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9416d794cf5641498e6b3aa058e97107~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1202&h=702&s=55425&e=png&b=fffefe)

结合上图来看：

*   所有废弃位置会被连接，形成一个由废弃位置组成的链表，即「废弃索引链表」：`prev_atom_free_index -> prev_prev_atom_free_index`
    
*   当要释放某个位置时，就是将该位置添加到「废弃索引链表」即可
    

假设当前要释放的索引是 `atom_free_index`，「废弃索引链表」中第一个元素的位置为 `prev_atom_free_index`，则将 `atom_free_index` 添加到「废弃索引链表」中的操作为：

1.  将 `prev_atom_free_index` 的数值存放到 `atom_free_index` 的元素位置上
    
2.  将 `rt->atom_free_index` 设置为 `atom_free_index`
    

上面的代码还有一个细节，就是并没有直接将 `prev_atom_free_index` 的数值存放到 `atom_free_index` 的元素位置上，而是对 `prev_atom_free_index` 的数值使用函数 `atom_set_free` 进行了一个小变换：

    static inline JSAtomStruct *atom_set_free(uint32_t v)
    {
      return (JSAtomStruct *)(((uintptr_t)v << 1) | 1);
    }
    

这么操作的原因是为了方便在遍历 `atom_array` 时能知道该位置的元素是否已经释放。这里利用了两个条件：

*   `atom_array` 元素类型为 `JSAtomStruct *`，由于内存地址为偶数，所以最低位的 bit 一定为 0，通过将最低位设置为 1 来生成一个 deformed 的内存地址来表示已释放
    
    大部分 CPU 访问内存时，要求地址必须为偶数，否则会报错或者访问速度比较慢，因此操作系统以及编译器为了迎合这样的设定，确保了程序在访问内存地址的时候，地址一定是偶数
    
*   引擎规定了 `atom_array` 的元素数量最大为 `1U << 30`，因此最多只会使用 uint32\_t 的低 30 个 bits，左移 1 位并不会丢失原本的精度
    

因为 `atom_array` 的元素数量最大为 `1U << 30`，Atom 的最高位（第 32 位）的 bit 是使用不到的，引擎将其作为了一个标志位，用于标记该 Atom 直接表示一个整数。

比如为字符串数据 `123` 生成 Atom 时，返回的 Atom 并不是 `atom_array` 中的索引，而是字符串 `123` 表示的整型数值，这是因为 Numeric 字符串通常来说会作为数组下标，将字符串对应的数值直接编码在 Atom 中可以加速引擎内的数组访问操作。

### 回顾

让我们回顾下上面的内容：

*   引擎内使用 `JSString` 表示 String value 和 Symbol value
    
*   为了避免保存多份内容相同字符串数据造成内存的浪费，引擎内使用了 Atom 来标识 `JSString` 实例
    
*   为了支持更多的字符，引擎使用了 Unicode 字符集，默认情况下会使用 UTF-8 编码来保存字符串数据，当需要操作字符串内容时，会将其编码方式调整为 UTF-16 编码
    
*   UTF-16 可以快速访问到字符串中的码点，因为可以快速判断一个字节直接表示一个码点或者 leading surrogate 或者 trailing surrogate。原理是通过 Surrogate pair 的设计区分 BMP 和补充平面，并搭配 BMP 中预留的标记位值
    
*   Symbol value 的 `hash_next` 直接表示其对应的 Atom，因此不必像 String value 在需要知道对应的 Atom 时得查找 Hash table
    
*   `JSString` 释放时，并不会导致保存实例地址的 `atom_array` 数组发生拷贝，废弃的索引位置会被链接到一起方便复用
    
*   通过将 `atom_array` 数组中废弃位置的数值最低位设置为 1 来快速区分该位置的元素是否已释放
    
*   Atom 因为 `atom_array` 数组的元素个数上限为 `1U << 30`，因此最多只会使用 uint32\_t 的低 30 个 bits，最高位 bit 可以用于标记该 Atom 是否直接表示数值
    

Number value
------------

JS 语言规范中 [描述](https://tc39.es/ecma262/#sec-terms-and-definitions-number-value "https://tc39.es/ecma262/#sec-terms-and-definitions-number-value") Number value 采用的是 [IEEE 754-2019](https://tc39.es/ecma262/#sec-bibliography "https://tc39.es/ecma262/#sec-bibliography") 编码的 64-bit 浮点类型。换句话说 JS 中的 `number` 都是浮点类型，在需要使用整型数值的地方（比如作为数组索引时），再对浮点类型做转换。

下面我们先了解一下 IEEE 754 编码的内容。由于 IEEE 754 其实是使用科学计数法的方式来表示二进制数，仅此我们先回顾下科学计数法。

### 科学计数法

在 [科学计数法](https://en.wikipedia.org/wiki/Scientific_notation "https://en.wikipedia.org/wiki/Scientific_notation") 中，一个非 0 的数可以表示为：

m×10n {\\displaystyle m\\times 10^{n}\\,}m×10n

比如 123 使用科学计数法表示为：

1.23×102 {\\displaystyle 1.23\\times 10^{2}\\,}1.23×102

再比如 0.123 使用科学计数法表示为：

1.23×10−1 {\\displaystyle 1.23\\times 10^{-1}\\,}1.23×10−1

所谓浮点，即通过小数点的偏移配合 nnn 的变化即可表示一个数，比如 350 可以表示为：

3.5×102 {\\displaystyle 3.5\\times 10^{2}\\,}3.5×102

35×101 {\\displaystyle 35\\times 10^{1}\\,}35×101

350×100 {\\displaystyle 350\\times 10^{0}\\,}350×100

在使用科学计数法时，一般会使用 [Normalized notation](https://en.wikipedia.org/wiki/Scientific_notation#Normalized_notation "https://en.wikipedia.org/wiki/Scientific_notation#Normalized_notation") 来固定小数点的位置，即要求：

1≤∣m∣<101 ≤ |m| < 101≤∣m∣<10

到了二进制系统中对 mmm 的要求变为：

1≤∣m∣<21 ≤ |m| < 21≤∣m∣<2

### 内存布局

接下来我们看看 IEEE 754-2019 编码方式的内存布局形式。

IEEE 754 规定了两种字长的浮点数：

*   32-bit 的「单精度浮点数，Single-precision floating-point」
    
*   64-bit 的「双精度浮点数，Double-precision floating-point」
    

单双精度除了可表示数值的精度不同外，其余部分大致相同，加上 JS 中使用的 64-bits 的双精度浮点数，我们接下来将仅讨论双精度。

64-bit 的双精度浮点数的内存布局为：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8eb3bf27206498593d655a9b7c8fba1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1236&h=250&s=9373&e=png&a=1&b=ffb2b5)

上面的内存布局分为 3 部分：

*   sign，占 1 bit，表示数值的正负情况
    
*   exponent，占 11 bits，表示指数部分的数值。需要注意的是对应的底数这里是 `2`，因为换到了二进制系统中
    
*   fraction，占 52 bits，因为有一个隐含的 1 bit，所以用于表示有效数位的 bit 共 53 个
    

关于隐含的 1 bit 是因为前文提到的，在二进制下 mmm 的取值范围是：

1≤∣m∣<21 ≤ |m| < 21≤∣m∣<2

因为 mmm 的整数部分恒为 1，在存储时就省略掉了，运算时还是会将隐含的 1 包含在内：

(−1)sign(1.fraction)×2e−1023(-1)^{\\text{sign}}(1.fraction)\\times 2^{e-1023}(−1)sign(1.fraction)×2e−1023

在上面的式子中，指数在使用的时候减去了 `1023`，这是因为：

*   指数需要能够表示正数和负数
    
*   11 bits 可以表示的数有 2047 个
    

因此选择 `1023` 作为基准，使用 e−1023e - 1023e−1023 可以表示正负指数各 `1023` 个。

### MAX\_SAFE\_INTEGER

在 JS 中通过 [Number.MAX\_SAFE\_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER") 可以拿到 JS 中数值类型可以表示的最大整数 `9007199254740991`。这也是 IEEE 754 编码可以表示的最大精确整数，超过这个数值的整数将采用它们的近似值。

可以通过下面的代码打印 `Number.MAX_SAFE_INTEGER` 的二进制表示：

    import { Buffer } from "buffer";
    
    function printBinary(n) {
      const buf = Buffer.alloc(8);
      buf.writeDoubleBE(n, 0);
      const out = [];
      for (let i = 0; i < 8; i++) {
        const bits = buf.readUInt8(i).toString(2);
        out.push(bits.padStart(8, "0"));
      }
      console.log(out.join(" "));
    }
    
    printBinary(Number.MAX_SAFE_INTEGER);
    

控制台输出结果为：

    01000011 00111111 11111111 11111111 11111111 11111111 11111111 11111111
    

sign

exponent

fraction

0

1000011 0011

1111 11111111 11111111 11111111 11111111 11111111 11111111

用于表示指数部分的 eee 为 `0b10000110011`，即十进制 `1075`，指数为 e−1023e - 1023e−1023 的值 `52`。

指数部分的作用是偏移小数点，所以上面指数为 `52` 也可以看成 fraction 部分的 52 bits 都表示数值的整数部分，再加上隐含的最高位的 1 bit，对应的数值即 53 bits 且都为 1：

9007199254740991\=253−1 {\\displaystyle 9007199254740991 = 2^{53} - 1\\,}9007199254740991\=253−1

我们也可以利用指数部分表示的是小数点的偏移这一特点，编写下面的函数来测试一个数值是否是整数：

*   首先我们计算出指数部分的值 `exp`
    
*   然后跳过用于表示符号和指数的 bits
    
*   然后再跳过 `exp` 个用于表示整数的 bits，看剩余的 bits 是否都为 0
    

对应的函数可以写成：

    function isInteger(n) {
      const buf = Buffer.alloc(8);
      buf.writeDoubleBE(n, 0);
      const exp =
        (((buf.readUInt8(0) & 0x7f) << 4) | (buf.readUInt8(1) >>> 4)) - 1023;
    
      const bitIdx = 1 + 11 + exp; // sign bit + exp bits + exp offset
      for (let i = bitIdx; i < 52; i++) {
        const byteIdx = Math.ceil((i + 1) / 8) - 1;
        const bitInByte = i & 7;
        if (buf.readUInt8(byteIdx) & (128 >>> bitInByte)) return false;
      }
      return true;
    }
    
    console.assert(isInteger(1));
    console.assert(isInteger(1.0));
    console.assert(!isInteger(1.1));
    console.assert(!isInteger(1.2));
    
    console.assert(isInteger(2));
    console.assert(isInteger(2.0));
    console.assert(!isInteger(2.1));
    console.assert(!isInteger(2.2));
    

### 近似值

前面提到超过 `Number.MAX_SAFE_INTEGER` 的整数会使用它们的近似值，我们来看一个有趣结果：

    const a = 9007199254740991 + 1;
    const b = 9007199254740991 + 2;
    console.log(a === b);
    

我们使用下面的代码打印下上面数值的二进制表示：

    function printBigintBinary(n) {
      const buf = Buffer.alloc(8);
      buf.writeBigInt64BE(n, 0);
      const out = [];
      for (let i = 0; i < 8; i++) {
        const bits = buf.readUInt8(i).toString(2);
        out.push(bits.padStart(8, "0"));
      }
      console.log(out.join(" "));
    }
    
    // M
    printBigintBinary(9007199254740991n);
    
    // M + 1
    printBigintBinary(9007199254740991n + 1n);
    

为了方便描述，我们称 `9007199254740991n` 为 `M`，`M` 的二进制表示为：

    00000000 00011111 11111111 11111111 11111111 11111111 11111111 11111111
    

有效位（从最高位的第一个非 0 bit 开始计算）的数量为 53 个，刚好使用了双精度浮点的全部有效位。

`M + 1` 的二进制表示为：

    00000000 00100000 00000000 00000000 00000000 00000000 00000000 00000000
    

有效位的数量为 54 个，超过了双精度浮点的最多有效位数量，只能保存成「近似值」 - 将低位的 bits 丢弃，并将丢弃的位数通过指数表示。

由于 `M + 1` 丢掉的低位都为 0，所以没有影响其精度，我们再看下 `M + 2` 的二进制表示：

    00000000 00100000 00000000 00000000 00000000 00000000 00000000 00000001
    

由于最低位的 1 被丢弃了，所以 `MAX + 2` 丢失了精度，但由于保留下来的有效位和 `M + 1` 一样，所以有了 `MAX + 1 === MAX + 2`。

如果上面的分析还是不好理解，我们可以换成十进制来类比：

假设我们的编码方式要求整数部分只能有 1 位且必须为 0，小数部分也只能有 1 位，那么 9 可以表示为：

0.9×101 {\\displaystyle 0.9\\times 10^{1}\\,}0.9×101

于是 `10 = 9 + 1` 就可以表示为：

0.1×102 {\\displaystyle 0.1\\times 10^{2}\\,}0.1×102

而 `11 = 9 + 1` 原本可以表示为：

0.11×102 {\\displaystyle 0.11\\times 10^{2}\\,}0.11×102

但由于我们限制了小数部分只能有 1 为，故需要将低位的 1 进行丢弃，最终表现为近似值：

11≈0.1×102 {\\displaystyle 11≈0.1\\times 10^{2}\\,}11≈0.1×102

### EPSILON

了解近似值之后，我们继续看下面一个常见的例子：

    console.log(0.1 + 0.2 === 0.3); // false
    

通过上文介绍的 `printBinary` 函数打印 `0.1` 的二进制表示为：

sign

exponent

fraction

0

0111111 1011

1001 10011001 10011001 10011001 10011001 10011001 10011010

根据 IEEE 754 的编码方式：

(−1)sign(1.fraction)×2e−1023(-1)^{\\text{sign}}(1.fraction)\\times 2^{e-1023}(−1)sign(1.fraction)×2e−1023

得出其实际的数值为：

1.10011001100110011001100110011001100110011001100110102×2−4\=1019−10231.1001100110011001100110011001100110011001100110011010\_{2} \\times 2^{-4 = 1019 - 1023}1.10011001100110011001100110011001100110011001100110102​×2−4\=1019−1023

将指数部分的偏移应用到小数点上：

0.0001100110011001100110011001100110011001100110011001101020.00011001100110011001100110011001100110011001100110011010\_{2}0.000110011001100110011001100110011001100110011001100110102​

转成十进制为：

000110011001100110011001100110011001100110011001100110102÷(256) \=720575940379279410÷7205759403792793610 \=0.1000000000000000055510\\begin{aligned} &00011001100110011001100110011001100110011001100110011010\_{2} ÷ (2^{56})\\\\\\ &= 7205759403792794\_{10} ÷ 72057594037927936\_{10}\\\\\\ &= 0.10000000000000000555\_{10} \\end{aligned}  ​000110011001100110011001100110011001100110011001100110102​÷(256)\=720575940379279410​÷7205759403792793610​\=0.1000000000000000055510​​

> `7205759403792794 ÷ 72057594037927936` 可以使用在线计算器 [Scientific Calculator](https://www.mathsisfun.com/scientific-calculator.html "https://www.mathsisfun.com/scientific-calculator.html")

显然从结果 0.10000000000000000555100.10000000000000000555\_{10}0.1000000000000000055510​ 可以看出十进制的 `0.1` 其 IEEE 754 双精度表示的是一个近似值。

使用同样的方式查看 `0.2` 实际值为：

00110011001100110011001100110011001100110011001100110102÷(255) \=720575940379279410÷3602879701896396810 \=0.200000000000000011110\\begin{aligned} &0011001100110011001100110011001100110011001100110011010\_{2} ÷ (2^{55})\\\\\\ &= 7205759403792794\_{10} ÷ 36028797018963968\_{10}\\\\\\ &= 0.2000000000000000111\_{10} \\end{aligned}  ​00110011001100110011001100110011001100110011001100110102​÷(255)\=720575940379279410​÷3602879701896396810​\=0.200000000000000011110​​

> 可以通过 [Base Convert: IEEE 754 Floating Point](https://baseconvert.com/ieee-754-floating-point "https://baseconvert.com/ieee-754-floating-point") 查看 IEEE 754 浮点数保存的实际值

既然 `0.1` 和 `0.2` 都是近似值，那么它们的加法和也是一个近似值就不难理解。

为什么 `0.1` 使用了近似值来表示呢？

为了回答这个问题，我们通过两个例子回顾下十进制数转二进制数的计算方式，首先以十进制整数 `11` 为例：

11÷2\=5q+1r 5÷2\=2q+1r 2÷2\=1q+0r 1÷2\=0q+1r \\begin{aligned} 11 ÷ 2 &= 5\_{q} + 1\_{r}\\\\\\ 5 ÷ 2 &= 2\_{q} + 1\_{r}\\\\\\ 2 ÷ 2 &= 1\_{q} + 0\_{r}\\\\\\ 1 ÷ 2 &= 0\_{q} + 1\_{r}\\\\\\ \\end{aligned}11÷2 5÷2 2÷2 1÷2 ​\=5q​+1r​\=2q​+1r​\=1q​+0r​\=0q​+1r​​

对应二进制的表示即从下往上的余数的排序：101121011\_{2}10112​

再以十进制小数 `0.25` 为例：

0.25÷1/2\=0q+0.5r 0.5÷1/2\=1q+0\\begin{aligned} 0.25 ÷ 1/2 &= 0\_{q} + 0.5\_{r}\\\\\\ 0.5 ÷ 1/2 &= 1\_{q} +0 \\end{aligned}0.25÷1/2 0.5÷1/2​\=0q​+0.5r​\=1q​+0​

对应的二进制表示即从上往下的商的排列：0.0120.01\_{2}0.012​

> 整数转换时我们先算目标计数系统的低位，好比先算个位，再算十位，进而百位，小数转换时则刚好相反，先算小数点后第一位，再第二位，进而第三位
> 
> 更多细节可以参考 [The simple math behind decimal-binary conversion algorithms](https://indepth.dev/posts/1019/the-simple-math-behind-decimal-binary-conversion-algorithms "https://indepth.dev/posts/1019/the-simple-math-behind-decimal-binary-conversion-algorithms")

接来下我们继续看十进制小数 `0.1` 转二进制的计算过程：

0.1÷1/2\=0q+0.2r 0.2÷1/2\=0q+0.4r 0.4÷1/2\=0q+0.8r 0.8÷1/2\=1q+0.6r 0.6÷1/2\=1q+0.2r 0.2÷1/2\=0q+0.4r ...\\begin{aligned} 0.1 ÷ 1/2 &= 0\_{q} + 0.2\_{r}\\\\\\ 0.2 ÷ 1/2 &= 0\_{q} + 0.4\_{r}\\\\\\ 0.4 ÷ 1/2 &= 0\_{q} + 0.8\_{r}\\\\\\ 0.8 ÷ 1/2 &= 1\_{q} + 0.6\_{r}\\\\\\ 0.6 ÷ 1/2 &= 1\_{q} + 0.2\_{r}\\\\\\ 0.2 ÷ 1/2 &= 0\_{q} + 0.4\_{r}\\\\\\ &... \\end{aligned}0.1÷1/2 0.2÷1/2 0.4÷1/2 0.8÷1/2 0.6÷1/2 0.2÷1/2 ​\=0q​+0.2r​\=0q​+0.4r​\=0q​+0.8r​\=1q​+0.6r​\=1q​+0.2r​\=0q​+0.4r​...​

上面的最后一步又回到了头部的 0.2÷1/20.2 ÷ 1/20.2÷1/2，因此继续计算会产生无限循环，进而 0.1100.1\_{10}0.110​ 对应的二进制数为：

0.00011001100110011001100110011...0.00011 0011 0011 0011 0011 0011 0011...0.00011001100110011001100110011...

> 可以使用 [Decimal to Binary converter](https://www.rapidtables.com/convert/number/decimal-to-binary.html "https://www.rapidtables.com/convert/number/decimal-to-binary.html") 验证更多数值转换

因为 0.1100.1\_{10}0.110​ 对应的二进制数的小数位是无限的，而 IEEE 754 的精度是有限的，超出可表示最大范围后只能保存近似值。

近似值的取值方式就不深究了，不过既然知道使用了近似值，那就不难理解近似值和实际值之间存在「误差」。

在一个包含近似值的计数系统中，需要一个最小误差来完成「相等」的定义。比如，我们买东西的时候，一毛两毛钱老板可能就不要了，我们也可能不需要老板找零了，这样的最小误差就能在双方都接受的程度上完成「相等」的价值定义。

在 JS 中这样的最小误差值通过 `Number.EPSILON` 表示，于是 JS 中判断浮点数是否相等可以通过下面的函数 `equal` 来完成：

    function equal(x, y) {
      return Math.abs(x - y) < Number.EPSILON;
    }
    
    console.assert(equal(0.1 + 0.2, 0.3));
    

### NaN，Infinity

`NaN` 即 「Not a number」 是我们再使用 JS 中经常遇到的，比如：

    console.log(1 / "a"); // NaN
    

IEEE 754 中对数值的编码方式为：

(−1)sign(1.fraction)×2e−1023(-1)^{\\text{sign}}(1.fraction)\\times 2^{e-1023}(−1)sign(1.fraction)×2e−1023

当表示 NaN 时：

*   eee 恒为 11111111111211111111111\_{2}111111111112​
    
*   fractionfractionfraction 部分为任意值
    

因为 fractionfractionfraction 部分为任意值，所以 `NaN` 表示的是一个集合而不是某个确定值，那么 `NaN !== NaN` 就变得很好理解。

我们可以使用下面的代码自己构造一个 NaN：

    function nan() {
      const buf = Buffer.alloc(8);
      buf.writeUInt8(0b01111111, 0);
      buf.writeUInt8(0b11110000, 1);
      buf.writeUInt8(1, 2);
      buf.writeUInt8(0, 3);
      buf.writeUInt8(0, 4);
      buf.writeUInt8(0, 5);
      buf.writeUInt8(0, 6);
      buf.writeUInt8(0, 7);
      return buf.readDoubleBE();
    }
    console.assert(isNaN(nan()));
    

还可以通过下的函数来测试一个数值是否为 NaN：

    function my_isNaN(n) {
      const buf = Buffer.alloc(8);
      buf.writeDoubleBE(n, 0);
      const exp =
        (((buf.readUInt8(0) & 0x7f) << 4) | (buf.readUInt8(1) >>> 4)) - 1023;
      return !!(exp & 0b11111111111);
    }
    
    console.assert(my_isNaN(1) === false);
    console.assert(my_isNaN(NaN));
    console.assert(my_isNaN(nan()));
    

当表示 Infinity 时：

*   eee 恒为 11111111111211111111111\_{2}111111111112​
    
*   fractionfractionfraction 部分为 0
    

因此我们可以通过下面的代码自己构造一个 Infinity：

    function inf() {
      const buf = Buffer.alloc(8);
      buf.writeUInt8(0b01111111, 0);
      buf.writeUInt8(0b11110000, 1);
      buf.writeUInt8(0, 2);
      buf.writeUInt8(0, 3);
      buf.writeUInt8(0, 4);
      buf.writeUInt8(0, 5);
      buf.writeUInt8(0, 6);
      buf.writeUInt8(0, 7);
      return buf.readDoubleBE();
    }
    console.assert(Infinity === inf());
    

正因为表示 Infinity 时 fractionfractionfraction 部分是确定的、均为 0，所以其为固定值，可以使用 `===` 比较。

### JSValue

在引擎内部实现时，Number value 是直接保存在 `JSValue` 上的，并且会区分 `int32` 和 `float64`：

    typedef union JSValueUnion {
      int32_t int32;
      double float64;
      void *ptr;
    } JSValueUnion;
    
    typedef struct JSValue {
      JSValueUnion u;
      int64_t tag;
    } JSValue;
    

直接存放在 `JSValue` 上是因为 `int32` 和 `float64` 在调用时采用传值的方式即可。

区分 `int32` 和 `float64` 是因为当可以确定一个数值为 `int32` 时（比如使用整型字面量时），直接保存其 `int32` 的数值，避免后续需要使用其整数值时再进行浮点到整型的转换。

表示 `int32` 时，`tag` 字段值为 `JS_TAG_INT`，表示 `float64` 时， `tag` 字段的值为 `JS_TAG_FLOAT64`。

### 算数运算

为了加速算数运算的效率，引擎内部会根据操作数的不同类型，采取不同的计算方式，并且像编译器标记了一些运行阶段可能命中率较高的分支：

    CASE(OP_add):
      {
        JSValue op1, op2;
        op1 = sp[-2];
        op2 = sp[-1];
        if (likely(JS_VALUE_IS_BOTH_INT(op1, op2))) {
          int64_t r;
          r = (int64_t)JS_VALUE_GET_INT(op1) + JS_VALUE_GET_INT(op2);
          if (unlikely((int)r != r))
            goto add_slow;
          sp[-2] = JS_NewInt32(ctx, r);
          sp--;
        } else if (JS_VALUE_IS_BOTH_FLOAT(op1, op2)) {
          sp[-2] = __JS_NewFloat64(ctx, JS_VALUE_GET_FLOAT64(op1) +
                        JS_VALUE_GET_FLOAT64(op2));
          sp--;
        } else {
        add_slow:
          if (js_add_slow(ctx, sp))
            goto exception;
          sp--;
        }
      }
      BREAK;
    

比如，执行加法指令时，就先判断两个操作数是否为 `JS_TAG_INT`、即 int32，如果满足条件就执行整数的加减法：

    likely(JS_VALUE_IS_BOTH_INT(op1, op2))
    

通过 `likely` 编译器指令提示编译器，这个分支是在运行阶段很有可能命中的，方便编译器在优化时做决策，保证该分支的执行效率。另外 `unlikely` 也是用于提示编译器的内建指令，用于告知编译器这段分支在运行阶段的命中率不高。

`likely` 和 `unlikely` 都是宏定义：

    #define likely(x)       __builtin_expect(!!(x), 1) // `__builtin_expect` 编译器内建指令
    #define unlikely(x)     __builtin_expect(!!(x), 0)
    

我们知道 int32 的数值范围并不是很大，那么计算结果很可能发生溢出，溢出的处理逻辑如下：

    int64_t r;
    r = (int64_t)JS_VALUE_GET_INT(op1) + JS_VALUE_GET_INT(op2);
    if (unlikely((int)r != r))
        goto add_slow;
    

*   用更大的类型（`int64` 之于 `int32`）来保存结果，并通过对比结果的 Downcast 前后 `r` 的值是否相同来判断是否发生溢出
    
*   若发生溢出，就跳转到 `add_slow` 的处理方式，这部分的主要工作依赖函数 [js\_add\_slow](https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/ops.c#L1067 "https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/ops.c#L1067")，会使用 float64 来存放计算的结果
    

### 回顾

Number value 一节中的内容可以小结为：

*   JS 中的数值均为 IEEE 754 编码的 64-bit 双精度类型
    
*   IEEE 754 编码的利用了科学计数法
    
*   由于 IEEE 754 的最大精度是固定的，当数值超过最大精度时（十进制小数或者整数超过 `MAX_SAFE_INTEGER` 时）会采用近似值
    
*   由于近似值的缘故，数值计算产生的误差不可避免，但是我们可以选择一个数值作为标量、表示业务中最大可接收的误差，将计算产生的误差和该标量进行比较，以此达到相对的精确。通常可以选择 EPSILON 作为误差标量
    
*   引擎内部实现时，为了提高执行效率，Number value 直接存放在 `JSValue` 上，并区分 `int32` 和 `float64`
    
*   在进行算数运算时，运算数均为 `int32` 或 `float64` 时会命中快速计算的条件分支，当运算数类型不同，或者发生计算结果发生溢出时，会进入 `slow` 分支先进行数值类型的转换
    

Boolean value
-------------

我们可以通过打印字节码来找到 Boolean value 在引擎层面实现的线索：

    let s = true;
    

对应的字节码为：

      opcodes:
        0  3F 3E 02 00 00 80          check_define_var s,128
        6  3E 3E 02 00 00 82          define_var s,130
       12  0A                         push_true
       13  3A 3E 02 00 00             put_var_init s
       18  C5                         get_loc0 0: "<ret>"
       19  28                         return
    

可以发现指令 `OP_push_true`，我们继续看看指令进行了哪些操作：

    CASE(OP_push_true):
      *sp++ = JS_TRUE;
      BREAK;
    

指令执行的操作仅有一个，即往操作数栈中压入了 `JS_TRUE`，进一步查看 `JS_TRUE` 其实是一个宏定义：

    #define JS_TRUE      JS_MKVAL(JS_TAG_BOOL, 1)
    

而 `JS_MKVAL` 也是一个宏定义：

    #define JS_MKVAL(tag, val) (JSValue){ (JSValueUnion){ .int32 = val }, tag }
    

`JS_MKVAL` 宏展开的内容使用了 [C99](https://en.wikipedia.org/wiki/C99 "https://en.wikipedia.org/wiki/C99") 引入的一个方便实例化结构体的便捷语法，称为 [Compound literals](https://en.cppreference.com/w/c/language/compound_literal "https://en.cppreference.com/w/c/language/compound_literal")。

在函数内使用 Compound literals 会将实例分配在栈上，因此函数内使用 `JS_MKVAL` 创建的 `JSValue` 实例不必通过 `free` 进行释放。

我们回顾下 `JSValue` 的定义：

    typedef union JSValueUnion {
        int32_t int32;
        double float64;
        void *ptr;
    } JSValueUnion;
    
    typedef struct JSValue {
        JSValueUnion u;
        int64_t tag;
    } JSValue;
    

可以看到 `JS_MKVAL` 宏其实是将 `u` 和 `tag` 一起初始化了。所以字面量 `true` 其实就是一个 `JSValue` 实例，它的 `tag` 为 `JS_TAG_BOOL`，`u.int32` 的值为 1，类似的字面量 `false` 的 `u.int32` 为 0

null
----

由于 null 和 Boolean value 在引擎内的表示形式相似，所以我们就一起了解一下：

*   `null` 使用 `JS_NULL` 宏来表示，该宏会创建一个位于栈上的 `JSValue` 实例
    
*   它的 `tag` 为 `JS_TAG_NULL`
    
*   `u` 为 `JSValueUnion` 实例、且字段 `int32` 的值为 0
    

undefined
---------

undefined 和 Boolean value 在引擎内的表示形式也很相似：

*   `undefined` 使用 `JS_UNDEFINED` 宏来表示，该宏会创建一个位于栈上的 `JSValue` 实例
    
*   它的 `tag` 为 `JS_TAG_UNDEFINED`
    
*   `u` 为 `JSValueUnion` 实例、且字段 `int32` 的值为 0
    

typeof
------

引擎内在执行指令时，操作数栈以及 C 函数之间的调用，都通过 `JSValue` 来传值。

对于 Primitives values 来说直接保存在 `JSValue` 上，而 JS 对象则需要通过 `JSValue::u::ptr` 进行间接寻址（可能有的同学会误以为 `JSObject` 负责表示 JS 中的对象，`JSValue` 负责表示 Primitives values）

通过查看 `typeof` 操作符的实现可以加深对上面描述的理解。

`typeof` 操作符对应的指令为 `OP_typeof`：

    CASE(OP_typeof):
      {
        JSValue op1;
        JSAtom atom;
    
        op1 = sp[-1];
        atom = js_operator_typeof(ctx, op1);
        JS_FreeValue(ctx, op1);
        sp[-1] = JS_AtomToString(ctx, atom);
      }
      BREAK;
    

可以看到指令对应的操作为函数 `js_operator_typeof`：

    __exception int js_operator_typeof(JSContext *ctx, JSValueConst op1) {
      JSAtom atom;
      uint32_t tag;
    
      tag = JS_VALUE_GET_NORM_TAG(op1);
      switch (tag) {
    #ifdef CONFIG_BIGNUM
      case JS_TAG_BIG_INT:
        atom = JS_ATOM_bigint;
        break;
      case JS_TAG_BIG_FLOAT:
        atom = JS_ATOM_bigfloat;
        break;
      case JS_TAG_BIG_DECIMAL:
        atom = JS_ATOM_bigdecimal;
        break;
    #endif
      case JS_TAG_INT:
      case JS_TAG_FLOAT64:
        atom = JS_ATOM_number;
        break;
      case JS_TAG_UNDEFINED:
        atom = JS_ATOM_undefined;
        break;
      case JS_TAG_BOOL:
        atom = JS_ATOM_boolean;
        break;
      case JS_TAG_STRING:
        atom = JS_ATOM_string;
        break;
      case JS_TAG_OBJECT: {
        JSObject *p;
        p = JS_VALUE_GET_OBJ(op1);
        if (unlikely(p->is_HTMLDDA))
          atom = JS_ATOM_undefined;
        else if (JS_IsFunction(ctx, op1))
          atom = JS_ATOM_function;
        else
          goto obj_type;
      } break;
      case JS_TAG_NULL:
      obj_type:
        atom = JS_ATOM_object;
        break;
      case JS_TAG_SYMBOL:
        atom = JS_ATOM_symbol;
        break;
      default:
        atom = JS_ATOM_unknown;
        break;
      }
      return atom;
    }
    

通过函数的签名和实现我们可以发现：

*   参数的传递通过 `JSValue`
    
        #define JSValueConst JSValue
        
    
*   通过 `JSValue::tag` 的类型标记可以得到基本类型
    
    比如，判断 `tag` 为 `JS_TAG_NULL` 返回了 `JS_ATOM_object`，应证了：
    
        typeof null // object
        
    
*   如果是 `tag` 为 `JS_TAG_OBJECT`：
    
    *   则需要通过 `JSValue::u::ptr` 访问到 JS 对象
        
    *   再通过 `JSObject::class_id` 进一步判断类型
        
    
    比如其中对 `JS_IsFunction` 函数的调用，其函数定义为：
    
        BOOL JS_IsFunction(JSContext *ctx, JSValueConst val) {
          JSObject *p;
          if (JS_VALUE_GET_TAG(val) != JS_TAG_OBJECT)
            return FALSE;
          p = JS_VALUE_GET_OBJ(val);
          switch (p->class_id) {
          case JS_CLASS_BYTECODE_FUNCTION:
            return TRUE;
          case JS_CLASS_PROXY:
            return p->u.proxy_data->is_func;
          default:
            return (ctx->rt->class_array[p->class_id].call != NULL);
          }
        }
        
    

小结
--

本节我们对 Primitive values 在引擎层面的实现进行了逐一地介绍。在介绍字符串以及数值类型时也对一些基本知识进行了展开介绍。

到目前为止我们已经对 JS 中的主要的数据类型：Objects 和 Primitive values 进行了介绍。

当然了，数组作为大家日常打交道的老友，怎么能被落下呢？引擎在实现数组时也是精心设计，考虑到篇幅，将在下一节对数组的底层实现及操作方式进行介绍。