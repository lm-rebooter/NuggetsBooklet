在前面三讲中，我们已经详细介绍了 ziplist 的核心结构以及核心操作，你会发现 ziplist 是一种比较复杂的结构，所以在 Redis 5.0 就引入了 listpack 这个更简单的结构来对标 ziplist。在前面介绍 Redis 7.0 Release Note 说过，**从 Redis 7.0 开始，完全使用 listpack 替换 ziplist 了**。

这一节我们就来说说 listpack。


## listpack 核心结构

listpack 说白了，跟 ziplist 差不多，也是**一块连续的内存空间**，但是呢，listpack 没有 ziplist 那么复杂的内部结构。

listpack 之所以会出现，是因为用户上报的一个 Redis 崩溃问题，但是 Redis 的代码维护者并没有找到崩溃的明确原因，猜测可能是 ziplist 复杂的连锁更新操作导致的，希望设计一种简单点的、能够替换 ziplist 的紧凑型数据结构。

下面这张图是 listpack 结构，它和 ziplist 的结构很类似，也是分为头、中、尾三部分。先来看头、尾两部分：头部里面的 tot-bytes 占了 4 个字节，存了 listpack 占用的总字节数，num-elements 占用 2 个字节，存了这个 listpack 里面的元素个数；尾部是一个字节的 end-byte，它的值始终是 255。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73b4a04f02764c54bacb57fff7ff12c2~tplv-k3u1fbpfcp-watermark.image?)


> ziplist 内心 OS：这不是一样的吗？这样也能赚到钱！报警吧！


接下来我们就一起看下 listpack 里面 `element` 的结构，里面分了 encoding-type、data、backlen 三部分。

**encoding-type 存的是 element-data 部分的编码类型和长度**。和 ziplist entry 的类似，encoding-type 也是个变长的结构。

-   0xxx xxxx：encoding-type 第一位是 0 的话，data 就是一个 7 位的无符号整数，encoding-type 和 data 会合并成一个字节，这个字节的后 7 位存的就是 data 部分。

<!---->

-   10xx xxxx：encoding-type 前 2 位是 10 的话，表示 data 是一个字符串，encoding-type 的低 6 位表示字符串的字节数，也就是说，data 字符串最长为 63 个字节。紧跟在 encoding-type 字节之后的，就是 data 字符串。

<!---->

-   110x xxxx：encoding-type 前 3 位是 110 的话，表示 data 是一个整数，encoding-type 的低 5 位以及下一个字节的 8 位，总共 13 位，共同来表示 data 这个整数值。

<!---->

-   1110 xxxx：encoding-type 前 4 位是 1110 的话，表示 data 是一个字符串，encoding-type 的低 4 位以及下一个字节的 8 位共同表示字符串的长度，也就是说，data 字符串最长就是 4095 个字节了。

<!---->

-   1111 0000：encoding-type 的值是 0xF0 的话，表示后面跟的 4 个字节表示字符串的长度，data 字符串最长 2^32 -1 个字节。紧跟字符串长度之后的部分，就是 data 字符串了。

<!---->

-   1111 0001：encoding-type 是 0xF1 话，表示 data 是一个 16 位的整型，encoding-type 后面紧跟的 2 个字节用来存 data 的具体值。

<!---->

-   1111 0010：encoding-type 是 0xF2 话，表示 data 是一个 24 位的整型，encoding-type 后面紧跟的 3 个字节用来存 data 的具体值。

<!---->

-   1111 0011：encoding-type 是 0xF3 话，表示 data 是一个 32 位的整型，encoding-type 后面紧跟的 4 个字节用来存 data 的具体值。

<!---->

-   1111 0100：encoding-type 是 0xF4 话，表示 data 是一个 64 位的整型，encoding-type 后面紧跟的 8 个字节用来存 data 的具体值。

<!---->

-   1111 0101 到 1111 1110 的 encoding-type 值目前还未使用。

最后要说的是 **backlen** 部分，它存了当前这个 element 的总长度，这个总长度包含了的是 encoding-type 长度加上 data 部分的长度，不包含 backlen 自身的长度哈。

之所以有这个 backlen 存在，就和 ziplist 里面的 prevlen 一样，主要是`为了支持从后向前遍历 listpack `。backlen 是一个变长的部分，最多占用 5 个字节。backlen 里面每个字节的第一位都是标识符，如果是 0 的话，就表示这个字节是 backlen 部分的最后一个字节；如果是 1 的话，就不是。也就是说，每个字节的剩余 7 位才携带有效信息。


举个例子，我要在 backlen 里面存 500 这个值 ，其对应的二进制是这个值 0000 0001 1111 0100，将每 7 位切分一次，得到这个值 x0000011 x1110100，然后最高位加个 x，表示的是该字节第一位的标识符。因为 backlen 是`从右向左`读取的，所以高位字节应该在右边，我们给它翻转一下，就是这个值了 x1110100 x0000011，最后，补全各个字节中的标识符，得到完整的 backlen 值 11110100 00000011。



其实呢，**`backlen 就是 listpack 和 ziplist 不一样的地方`，虽然都是为了逆序遍历，但是 backlen 记录的是 element 自身的长度，prevlen 记录的是前一个 element 的长度**。很明显，backlen 这种设计把变化封装到了 element 里面，一个 element 无论怎么变，也不会影响邻居，也就不会出现连锁更新。再看 prevlen，就会发现 entry 内部没有兜住自身的变化。这里你应该也会联系到设计模式里面的一些规则，把变化的部分和不变的部分拆分开，对吧？


## listpack 核心方法


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ea734dd8ddd4f75b0b1836d80e5ad16~tplv-k3u1fbpfcp-watermark.image?)

要使用 listpack，先需要**用 lpNew() 函数初始化一个 listpack 实例**，返回的 char 指针，指向的是 listpack 的首地址。 lpNew() 函数可以接收一个参数来指定初始化的内存空间大小，比如说，我明确知道我的 listpack 会占用 1024 个字节，就可以直接传个 1024 的参数，就可以申请出 1024 字节大小的内存了。要是传 0 的话，就是创建一个空的 listpack 实例，里面只有头尾两部分，其中的 element 部分都没有，就是下图的状态：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/062f24e2abbd4442940dd5b6dcbe3186~tplv-k3u1fbpfcp-watermark.image?)

至于 lpFree() 函数的话，就是释放 listpack 实例占的空间，这里不再多说了。

### 1. 插入、修改、删除

创建完 listpack 实例之后呢，我们就可以开始看 listpack 的增删改查了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/506e4632117841899a85b1ba6826b3a5~tplv-k3u1fbpfcp-watermark.image?)


lpAppend 是往 listpack 的尾部插入字符串，lpPrepend 是往 listpack 的头部插入字符串，lpInsertString() 是往指定的位置插入字符串，它们**底层都依赖 lpInsert () 函数**。


我们可以用 Cloin 的调用链视图看一下，无论是插入字符串元素，还是插入整数元素，都是走的 lpInsert() 函数：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c2d089fe1414d2a8ea7849cce365035~tplv-k3u1fbpfcp-watermark.image?)

**lpInsert() 函数除了有`插入`数据的功能，还能够实现`删除`和`替换`的功能**，从这个调用链里面，我们也能看到 lpDelete()、lpReplace() 这些删除、替换操作也调用了 lpInsert()。


说明白 lpInsert() 函数的重要性，下面我们就来正式开始分析 lpInsert() 函数。

先来看 lpInsert() 的`参数`，几乎它所有的参数都有多个含义，所以我们还得一个个分情况来说明白。如下表所示，除了第一个参数 lp 指向了要被操作的 listpack 实例外，剩下的参数就开始各种“表演”了。

  


| **参数** | **插入场景**                                               | **更新场景**                        | **删除逻辑**                    |
| ------ | ------------------------------------------------------ | ------------------------------- | --------------------------- |
| lp     | 目标 listpack 实例                                         | 目标 listpack 实例                  | 目标 listpack 实例              |
| elestr | 插入的新字符串                                                | 更新后的新字符串                        | 必须是 NULL                    |
| eleint | 插入的新整型值                                                | 更新后的整型值                         | 必须是 NULL                    |
| size   | elestr 字符串的长度或者是 eleint 占了多少个字节                        | elestr 字符串的长度或者是 eleint 占了多少个字节 | 0                           |
| p      | 插入位置，结合 where，可以确定新元素插入到 p 这个 element 的前面还是后面          | 指向要更新的 element                  | 指向要删除的 element              |
| where  | LP_BEFORE、LP_AFTER 两个可选值，决定新元素插入到 p 这个 element 的前面或者后面 | LP_REPLACE                      | LP_REPLACE                  |
| newp   | 指向新插入的 element                                         | 指向更新的 element                   | 指向此次删除 element 的下一个 element |

  


介绍完方法的具体参数之后，我们再来看 lpInsert() 的`具体实现`。

```c
unsigned char *lpInsert(unsigned char *lp, unsigned char *elestr, unsigned char *eleint,
                        uint32_t size, unsigned char *p, int where, unsigned char **newp)
{
    
    int delete = (elestr == NULL && eleint == NULL); // 1.a 判断是否为删除操作
    if (delete) where = LP_REPLACE;
    
    if (where == LP_AFTER) { // 1.b 针对插入场景的归一化处理
        p = lpSkip(p);
        where = LP_BEFORE;
        ASSERT_INTEGRITY(lp, p);
    }
    unsigned long poff = p-lp;
    int enctype;
    if (elestr) { // 2.判断新元素是字符串还是整数值
        enctype = lpEncodeGetType(elestr,size,intenc,&enclen);
        if (enctype == LP_ENCODING_INT) eleint = intenc;
    } else if (eleint) {
        enctype = LP_ENCODING_INT;
        enclen = size; /* 'size' is the length of the encoded integer element. */
    } else {
        enctype = -1;
        enclen = 0;
    }
    ...
}
```

1.  首先是对参数进行检查，**通过参数值确定这次调用要执行什么操作**。

    a. 如果 elestr 和 eleint 都是 NULL，那此次操作就是一次删除操作，需要把 where 设置为 LP_REPLACE，同时要将 delete 变量设置为 1。这个时候，p 指向的就是要删除的 element。
    
    b.  否则就是更新或者插入场景。针对插入场景来说，如果 where 是 LP_AFTER 的话，需要把指针 p 后移一个 element，然后把 where 改成 LP_BEFORE，这样后续操作都是在 p 指针的前面插入新元素了，算是一种归一化的操作了。这里后移一个 element 用的是 lpSkip() 函数，里面的逻辑就是解析 element 的 encoding-type 和 backlen 两部分，确定这个 element 占了多少字节，然后再后移 p 指针。


2.  接下来，这个 if...else 代码块就是确定新元素是字符串，还是整数值，以及对应 encoding-type 值。这里我们要来说一下 lpEncodeGetType() 这个函数，它里面会尝试把 elestr 字符串转成整数值，要是能转成功呢，encoding-type 和转换后的 int 值就会填充到 intenc 这个数组里面。无论是不是能转 int，这个 enclen 指针都会记录相应的 backlen 值。


到这里，就已经确定了操作的类型、操作的位置以及参与元素的值，我们接着往下看：

```c
unsigned char *lpInsert(...){
    ...
    // 3.如果不是删除操作，会执行lpEncodeBacklen()函数进行编码
    unsigned long backlen_size = (!delete) ? lpEncodeBacklen(backlen,enclen) : 0;
    uint64_t old_listpack_bytes = lpGetTotalBytes(lp);
    uint32_t replaced_len  = 0;
    if (where == LP_REPLACE) { // 4.针对更新和删除，计算目标element的长度
        replaced_len = lpCurrentEncodedSizeUnsafe(p);
        replaced_len += lpEncodeBacklen(NULL,replaced_len);
        ASSERT_INTEGRITY_LEN(lp, p, replaced_len);
    }
    // 5.重新计算listpack长度
    uint64_t new_listpack_bytes = old_listpack_bytes + enclen + backlen_size
                                  - replaced_len;
    if (new_listpack_bytes > UINT32_MAX) return NULL;

    unsigned char *dst = lp + poff; /* May be updated after reallocation. */

    // 6.插入或更新操作时，触发的扩容场景
    if (new_listpack_bytes > old_listpack_bytes &&
        new_listpack_bytes > lp_malloc_size(lp)) {
        if ((lp = lp_realloc(lp,new_listpack_bytes)) == NULL) return NULL;
        dst = lp + poff;
    }
    
    if (where == LP_BEFORE) { // 插入或更新时，触发的内存后移操作
        memmove(dst+enclen+backlen_size,dst,old_listpack_bytes-poff);
    } else { // 删除或更新时，触发的内存前移操作
        long lendiff = (enclen+backlen_size)-replaced_len;
        memmove(dst+replaced_len+lendiff,
                dst+replaced_len,
                old_listpack_bytes-poff-replaced_len);
    }
    // 删除或更新时，触发的缩容场景
    if (new_listpack_bytes < old_listpack_bytes) {
        if ((lp = lp_realloc(lp,new_listpack_bytes)) == NULL) return NULL;
        dst = lp + poff;
    }
    ...
}
```

3.  这里的 lpEncodeBacklen() 函数会把 enclen 这个值编码好，存储到 backlen 数组里面 ，还会计算 backlen 部分的长度（backlen_size），backlen 的编码方式这里不再重复了。

4.  下面这个 if 是针对更新和删除操作的处理，这里会算一下当前 element 的长度。

5.  接下来，重新计算 listpack 长度，这个时候，就会用到操作前后的 element 长度的变化。

6.  算好 listpack 的新长度之后，也就知道了这个 listpack 是需要扩容还是要缩容了。如果是缩容的话，比如说删除操作，我们应该先前移数据，然后再 realloc 缩小内存空间，要不这样的话，listpack 结尾地方的数据就可能丢失。如果是需要扩容的话，比如插入操作，需要先走 realloc 扩容，然后后移已有的数据，再插入新 element。下图展示了插入和删除场景的逻辑，更新元素的话，也是类似的。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66ecd9b16dd145a7bf348c2ee99a5f11~tplv-k3u1fbpfcp-watermark.image?)


7.  最后，就是把新 element 写到指定的位置，更新一下 listpack 头部的 tot-bytes 和 num-elements 值。

```c
unsigned char *lpInsert(...){
    ...
    if (newp) { 
        *newp = dst;
        if (delete && dst[0] == LP_EOF) *newp = NULL;
    }
    if (!delete) { // 7.写入新元素
        if (enctype == LP_ENCODING_INT) {
            memcpy(dst,eleint,enclen);
        } else {
            lpEncodeString(dst,elestr,size);
        }
        dst += enclen;
        memcpy(dst,backlen,backlen_size);
        dst += backlen_size;
    }
    
    if (where != LP_REPLACE || delete) { // 7.更新listpack头的信息
        uint32_t num_elements = lpGetNumElements(lp);
        if (num_elements != LP_HDR_NUMELE_UNKNOWN) {
            if (!delete)
                lpSetNumElements(lp,num_elements+1);
            else
                lpSetNumElements(lp,num_elements-1);
        }
    }
    lpSetTotalBytes(lp,new_listpack_bytes);
    ...
}
```

  


这里需要关注一下 `newp` 这个参数，它是个二级指针，比如下面这段代码，newp 指向了 p 指针，我们在 lpInsert 里面修改 *newp 就是修改了 p 指针的指向，这时就实现了输出参数的效果。

```c
char* p = ...; 
char **newp = &p;
lpInsert(..., newp);
... // 使用p指针
```


下面这张图就说明了 *newp 这个指针的指向：如果此次是插入操作，会把它指向新 element；如果是更新操作，它会指向这个更新的 element；如果是删除操作，它会指向下一个 element。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ff15d792f1411286c853338b474bf9~tplv-k3u1fbpfcp-watermark.image?)  


之所以要这么修改 *newp 指针，主要是`为了方便实现迭代器的删除操作`。在后面介绍 quicklist 迭代器的时候会看到，它就是使用 lpInsert() 方法删除元素的，它需要感知到删除之后下一个 element 的位置，这样才能继续往下迭代。

对标到 Java 里面，如果是要在 LinkedList 的迭代过程中，插入或是删除元素的话，需要用迭代器，要是不用迭代器的话，就会抛并发修改的异常（ConcurrentModificationException），在 LinkedList 迭代器的 remove() 里面，也会有类似的指针变更操作，熟悉 Java 的小伙伴们应该都不陌生。

### 2. 迭代与读取

其实看完 lpInsert() 的实现，就已经看完了 listpack 的增、删、改三种操作，我们只需要再简单看一下 listpack 的`查询`操作，listpack 的事情就齐活了。

与 listpack 读取或者迭代相关的函数，就是下面这些，从函数名上基本就可以猜出具体实现。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01ffc1165aac4d12af6fb334a5ec8685~tplv-k3u1fbpfcp-watermark.image?)


我这里简单整理一下这些函数的功能：

| **函数**    | **功能**                                                                                                                                                                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lpFirst() | 获取指向 listpack 中第一个 element 的指针                                                                                                                                                                       |
| lpLast()  | 获取指向 listpack 中最后一个 element 的指针                                                                                                                                                                      |
| lpNext()  | 这个函数的第二个参数 p，指向了 listpack 中的一个 element，lpNext() 函数返回的是 p 之后的一个 element 的指针                                                                                                                           |
| lpPrev()  | 返回指向 p 之前的一个 element 的指针                                                                                                                                                                             |
| lpSeek()  | lpSeek() 函数第二个参数 index 指定了要获取 listpack 的第几个 element。lpSeek() 函数会通过上面四个迭代函数，从 listpack 头部/尾部开始迭代，直到迭代到 index 指定的目标 element 并返回其指针。注意，当 index 为正，则从 listpack 头部开始正向搜索；当 index 为负，则从 listpack 尾部向前反向搜索。 |
| lpGet()   | 读取 element 中存储的元素值                                                                                                                                                                                   |

  


这个表里面的前五个函数，只需要解析 element 的 encoding-type 和 backlen 两部分，就可以实现指针移动了，没必要解析 data 部分。


但是，lpGet() 函数，就需要专门解析 data 部分。看下面这个调用关系链，我们发现解析 data 值的函数，底层走的是 **lpGetWithSize() 函数**。至于 lpGetWithSize() 函数的具体实现，就是根据 encoding-type 编码格式解析 data，该函数的实现就留给你自己分析吧，相信你在读完本讲内容之后，可以轻松读懂该函数，当然也欢迎你在评论区分享看源码时遇到的问题哦。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ba92afb7b544c9a0b8c96f8b2186f5~tplv-k3u1fbpfcp-watermark.image?)


## 总结

在这一节中，我们重点介绍了 Redis 5 引入的 listpack 结构，在 Redis 7 中，listpack 已经完全替换了复杂的 ziplist 结构。

-   首先，讲解了 listpack 结构的细节以及其中 element 的编码方式。

<!---->

-   然后，重点分析了 ziplist 和 listpack 之间的区别，这也是 Redis 放弃 ziplist 的主要原因之一。

<!---->

-   最后，详细阐述了 listpack 的核心方法，我们可以清晰地感受到，操纵 listpack 的逻辑比操纵 ziplist 的逻辑要简单很多，尤其是没有连锁更新这种复杂的操作存在。


下一节，我们会来一起分析一下 quicklist，它是 Redis List 底层依赖的另一个重要的结构。