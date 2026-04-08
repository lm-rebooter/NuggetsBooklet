在前面两节中，我们详细介绍了 ziplist 结构以及 ziplist 写入新元素的核心逻辑。除了`插入`新元素的操作之外，我们还需要学习一下 ziplist `查询`、`删除`以及`更新`元素的操作，这样整个 ziplist 结构才算掌握完整。


## 查询操作

首先来看 ziplist 提供的查询函数，如下图所示，我们可以在 ziplist.h 文件中看到红色方框圈出来的这些查询函数：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dc969f00454482d9566bee4fc86deee~tplv-k3u1fbpfcp-watermark.image?)

这里先简单列一下这些函数的功能，其实通过函数的名字，也猜个差不多。

-   ziplistIndex() 函数的功能就是查找 ziplist 中指定 index 索引值上的 entry。要是传入的 index 值是个负数，会从 ziplist 的尾部向前查找。相信你也能猜到，[《实战应用篇：List 命令详解与实战（上）》](https://juejin.cn/book/7144917657089736743/section/7147527279311224832)一文中介绍的 LINDEX 命令，就是依赖 ziplistIndex() 函数实现的。

<!---->

-   ziplistNext() 和 ziplistPrev() 函数，就是返回 ziplist 中指定 entry 节点的前一个和后一个 entry。



其他的这些方法就不再一个个说了，你可以直接参考下面这个表：

| **函数**                      | **功能**                                                               |
| --------------------------- | -------------------------------------------------------------------- |
| ziplistIndex()              | 找 ziplist 中指定 index 索引值上的 entry。要是传入的 index 值是个负数，会从 ziplist 的尾部向前查找 |
| ziplistNext()/ziplistPrev() | 返回 ziplist 中指定 entry 节点的前一个/后一个 entry                                |
| ziplistFind()               | 在 ziplist 中查找并返回包含了指定 data 值的 entry                                  |
| ziplistGet()                | 获取指定 entry 节点中保存的 data 值                                             |
| ziplistCompare()            | 比较指定 entry 节点中的 data 值是否等于指定值                                        |
| ziplistBlobLen()            | 获取 ziplist 占用的总字节数                                                   |
| ziplistLen()                | 获取 ziplist 中的 entry 节点个数                                             |



这些`查询操作的核心逻辑`，就是**按照 ziplist 的结构，逐个遍历 entry**。在遍历的时候，就需要解析 entry 里面的 prevlen、len 以及 data 信息，这样才能知道下一个 entry 的起始位置。其实，在前面介绍插入数据的时候，也需要解析 entry 的函数，但是一直没有展开详细说。这就是看源码很容易迷失的地方，七拐八拐的，慢慢就偏离了我们的主线剧情。


这里我们就展开说说解析 entry 的函数。在 ziplist.c 里面，能看到 `zipEntrySafe()` 和 `zipEntry()` 两个函数，如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9ce56220069458ba3a30f5c334fef27~tplv-k3u1fbpfcp-watermark.image?)

这两个函数都是用来解析 entry 的，区别在于 Safe 的这个版本，会做很多额外的检查，保证解析 entry 的时候不会跑到 ziplist 内存区域之外；而 zipEntry() 这个版本，就直接按照 entry 格式硬解。


在开始说这两个函数的实现之前，我们先要来看一下**存放解析结果的容器，就是这个 zlentry 结构体**，里面存的是 prevlen 的长度和具体值、len 的长度和具体值，这个 headersize 就是 prevlen 和 len 两部分占的字节数，最后的这个 p 指针指向的是 entry 节点的首地址。

```c

typedef struct zlentry {
    unsigned int prevrawlensize; // entry中prevlen部分所占的字节数
    unsigned int prevrawlen;     // prevlen的值
    unsigned int lensize;        // entry中len部分所占用的字节数
    unsigned int len;            // len的值
    // 记录当前entry中prevrawlen、len两部分的长度，
    // 实际就是lensize + prevrawlensize
    unsigned int headersize;
    // entry的编码格式，该值是根据len部分计算出来的，可选值有：
    // ZIP_STR_MASK和ZIP_INT_MASK两个，分别表示data部分是字符串和整数 
    unsigned char encoding;
    unsigned char *p;            // 指向entry的首地址 
} zlentry;
```


好了，接下来我们就来看一下 **zipEntry() 的逻辑**，如下代码所示：

```c
static inline void zipEntry(unsigned char *p, zlentry *e) {
    // 从 p 指针的位置开始，解析 prevlen 值，解析好的 prevlen 长度和 prevlen 值，
    // 直接放到 e 这个 zlentry 实例里面
    ZIP_DECODE_PREVLEN(p, e->prevrawlensize, e->prevrawlen);
    // 解析data的类型，字符串 or 整型
    ZIP_ENTRY_ENCODING(p + e->prevrawlensize, e->encoding);
    // 解析len占的字节数以及len值
    ZIP_DECODE_LENGTH(p + e->prevrawlensize, e->encoding, e->lensize, e->len);
    assert(e->lensize != 0); 
    // 计算headersize
    e->headersize = e->prevrawlensize + e->lensize;
    // 指向entry首地址
    e->p = p;
}
```


整体逻辑可以梳理为如下四步。

-   ZIP_DECODE_PREVLEN 这个宏，就是从 p 指针的位置开始解析 prevlen 值，解析好的 prevlen 长度和 prevlen 值，直接放到 e 这个 zlentry 实例里面。

-   ZIP_ENTRY_ENCODING 这个宏，是从 len 里面解析出 data 编码类型。前面介绍 len 编码的时候也说过，通过 len 的前两位，我们就可以区分出 data 是字符串还是整型了，你看这个宏，也是这么实现的。

-   ZIP_DECODE_LENGTH 这个宏，就是解析 len 占用的字节数以及 len 的值，解析的结果也是填充到这个 zlentry 实例的对应字段里面。

-   最后，算一下 headersize，记一下 entry 的指针，这个 zlentry 实例就填充完了。


就这样，调用 zipEntry() 函数的地方，就拿到了一个填充好的 zlentry 实例了。这就和“我们 Java 里面传一个空对象进来，然后不断调用 setter 方法填充空对象的字段，调用结束了，也就拿到了一个填充好的对象”是一个道理。

zipEntrySafe() 这个函数就不再展开说了，基本原理是一样的，就是`多了很多额外检查`而已。


## 删除操作

关于 ziplist 的删除操作，有两个函数需要讲一下（如下截图）：一个是 `ziplistDelete() 函数`，它是删除 p 指针指定的 entry；另一个是 `ziplistDeleteRange() 函数`，它是个范围删除，从指定的 index 开始往后删除，总共删除 num 个 entry。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a47d2114f9984b03865d54f8275ab33a~tplv-k3u1fbpfcp-watermark.image?)

无论是单个 entry 节点的删除还是批量删除，**底层都依赖于 `__ziplistDelete() 函数`**。我们用 CLoin 这个调用关系视图就能看到这个函数的调用关系，如下：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/260714d9f00c4adca48c711d0421300c~tplv-k3u1fbpfcp-watermark.image?)

我们接下来就看看这个 __ziplistDelete() 函数的实现。如下所示，我们看到 __ziplistDelete() 函数会从 p 这个位置开始解析 entry，解析的结果会通过 zipEntry() 函数填充到 first 这个 zlentry 实例里面。

```c
unsigned char *__ziplistDelete(unsigned char *zl, unsigned char *p, unsigned int num) {
    ... // 省略变量定义的相关的代码
    zipEntry(p, &first); // 解析p指向的entry
    for (i = 0; p[0] != ZIP_END && i < num; i++) { // 向后循环num个entry
       p += zipRawEntryLengthSafe(zl, zlbytes, p);
       deleted++;
    }
    ...// 省略后面的逻辑
}
```

下面这个 for 循环就是往后解析 num 个 entry，这些 entry 都是要删除的。比如说，从 entry3 开始，往后删 8 个 entry，大概就是下图的结构，p 指针会不断后移，first 里面的 p 指针一直指向第一个要删除的 entry。这里的 totlen 就是这些要删除的 entry 占的字节数。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/444d77f4b695413eb456541304654ba7~tplv-k3u1fbpfcp-watermark.image?)

确认了删除的起止地址之后，下一步就是要把 p 之后的 entry 前移，覆盖掉这些要删除的 entry，关键代码片段如下：

```c
totlen = p-first.p; // 计算要删除的字节数
if (totlen > 0) {
    uint32_t set_tail;
    if (p[0] != ZIP_END) {
        // 计算prevlen是否需要扩容，扩容多少字节通过zipPrevLenByteDiff计算出来
        nextdiff = zipPrevLenByteDiff(p,first.prevrawlen);
        p -= nextdiff; // 如果需要扩容，前移p指针
        assert(p >= first.p && p<zl+zlbytes-1);
        zipStorePrevEntryLength(p,first.prevrawlen);
        ... // 省略zltail变更涉及到的逻辑
        size_t bytes_to_move = zlbytes-(p-zl)-1;
        memmove(first.p,p,bytes_to_move); // 前移内存，删除数据
    }
```

我们继续沿着上面示例的思路分析这段代码：在移动之前，我们先要看看 entry 11 的 prevlen 是不是要扩容，看这里，熟悉的 nextdiff。如果需要扩容的话，nextdiff 的值得是 4 ，这里的 p 就会前移 4 个字节，反正前面的这块粉红色区域都是要删除的，p 可以放心大胆地前移，如下图灰色部分所示。

接下来就是真正的 memove 前移 entry 11 之后的数据了，如下图所示：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5566eb41ab524c9ab6661bb8c8e5efce~tplv-k3u1fbpfcp-watermark.image?)

完成前移的操作之后，就要走 realloc 缩小 ziplist 这块连续空间，然后还要根据删除的字节数、prevlen 扩容的情况，重新计算 ziplist 头里面的值了，这里就不再一个个展开说了。

正如前文所示，因为 entry 11 的 prevlen 可能扩容，所以此时是可能出现连锁更新的，所以这里会触发 `__ziplistCascadeUpdate()` 函数处理 entry 11 之后的连锁更新问题。


## 更新操作

ziplist 里面的插入、查询以及删除操作都说介绍完之后，最后再来看看 ziplist 的更新操作。


这个 `ziplistReplace() 函数`的功能，就是把 p 指向的 entry 的值，改成 s 这个字符串。你回想一下，前面[《实战应用篇：List 命令详解与实战（上）》](https://juejin.cn/book/7144917657089736743/section/7147527279311224832)一文中介绍过一个 LSET 命令，它就是依赖这个 replace 方法实现的。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d7f08a33f124cb69193c2343ad290f6~tplv-k3u1fbpfcp-watermark.image?)


我们接着来看 ziplistReplace() 函数的关键代码：

```c
 zipEntry(p, &entry); // 解析p执行的entry，也就是更新前使用的字节数
if (zipTryEncoding(s,slen,&value,&encoding)) { // 下面计算更新后需要的字节数
    reqlen = zipIntSize(encoding); 
} else {
    reqlen = slen; 
}
reqlen += zipStoreEntryEncoding(NULL,encoding,slen);

if (reqlen == entry.lensize + entry.len) { // 更新前后所占字节数一样
    p += entry.prevrawlensize;
    p += zipStoreEntryEncoding(p,encoding,slen);
    if (ZIP_IS_STR(encoding)) {
        memcpy(p,s,slen);
    } else {
        zipSaveInteger(p,value,encoding);
    }
} else { // 更新前后所占字节数不一样。
    zl = ziplistDelete(zl,&p);
    zl = ziplistInsert(zl,p,s,slen);
}
```


这里先通过 zipEntry() 函数解析了一下 p 指向的这个 entry，这样我们就知道更新前这个 entry 占了多少个字节。然后，我们算一下，更新之后 entry 需要占多少字节。要是更新前后占的字节数一样的话，直接替换就行了，就是这个 if 分支；要是占的字节数不一样，那就先把这个 entry 删掉，然后再用 insert 加回来，是不是直觉上，走到这个分支的时候，性能就会变差了呢？所以我们在用 LSET 这类命令的时候，尽可能保证原值和更新值的长度不变。


## 总结

ziplist 作为在 Redis 7 版本之前重要的底层数据结构之一，不仅是 Redis List 底层实现依赖了它，后面要介绍的哈希结构、有序列表，也都会用到它。

通过这三节课程的介绍，我们就将 ziplist 这个结构讲解完了。这三节我们重点介绍了 ziplist 结构本身、分析了 entry 的变长编码方式、ziplist 的插入、查询、删除以及更新操作，还展开说了一些关联的 C 语言知识点。

在下一节，我们将介绍 Redis 7 中用来替代 ziplist 结构的 `listpack`，**listpack 相较于 ziplist 来说说，结构以及操作都简单很多**，小伙伴们可以在阅读下一节的时候，将两者对比一下，就可以体会到 listpack 的优势所在。
