在上一节中，我们详细分析了 Redis 引入 ziplist 结构的目的以及 ziplist 的核心结构，但是 ziplist 本身是个静态结构，**Redis 需要通过增删改查的相关逻辑，才能真正发挥 ziplist 这个结构的作用**。

所以，从本节开始，我们就来深入分析 ziplist 的相关函数，其中最复杂、也是最重要的就是 `ziplist 的写入逻辑`，这里会用一节的篇幅来展开分析。

打开 ziplist.h 这个头文件，这里可以看到操作 ziplist 的全部函数：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/811d9ec4e82448678301ef07e13f2b06~tplv-k3u1fbpfcp-watermark.image?)

要用 ziplist，第一步肯定是要创建一个 ziplist 实例，对应的就是这里的 **ziplistNew() 函数**，它里面会创建一个空 ziplist 实例，返回的这个 char* 指针呢，指向的就是这个空 ziplist 实例的首地址。

新建的 ziplist 不包含任何 entry，只有队首和队尾这两个部分，就是下图的状态：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce201c2814e549e2b67e55d91ac1e505~tplv-k3u1fbpfcp-watermark.image?)

创建好 ziplist 之后，我们就要开始往里添加元素了。下面这两个函数都涉及到了往 ziplist 里添加元素的功能，我们一个个来说。


-   **ziplistPush**() 函数，其完整的函数签名如下。该函数会往 ziplist 写入一条新数据，具体是从队头还是队尾写入，是根据 where 参数的值决定的，where 是 0 的话，就是往队头里面写入；1 的话，就是往队尾写入。s 这个参数指向了具体要写入的字符串，slen 参数就是这个字符串的长度。

```c
unsigned char *ziplistPush(unsigned char *zl, unsigned char *s, 
    unsigned int slen, int where);
```


-   **ziplistInsert**() 函数，其完整的函数签名如下。该函数是把 s 指针指向的这个新元素，插入到 p 这个 entry 之后的位置。

```c
unsigned char *ziplistInsert(unsigned char *zl, 
        unsigned char *p, unsigned char *s, unsigned int slen);
```


上面这两个方法返回的 char* 指针，指向的就是写入数据之后的 ziplist 首地址。


我们再深入一下，看看这两个方法是怎么给 ziplist 添加元素的，会发现它们底层都是调用这个带下划线的 `__ziplistInsert() 函数`实现的，如下图所示。Redis 的代码里面带这种下划线的函数，就和我们 Java 里面写个公共的 private 方法一样，然后，其他 public 方法调它实现对外的接口。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2c8da2627e94b75bfe0f07cde1d9267~tplv-k3u1fbpfcp-watermark.image?)


既然核心实现都是一个函数，那我们只以 ziplistPush() 或是 ziplistInsert() 中的一条实现路线来分析，就可以弄懂 ziplist 写入的核心逻辑了。本节会按照 `ziplistPush() 函数`这条实现路线来展开分析，总共分为下面 `9 个关键步骤`。


## 计算插入位置

ziplistPush() 函数第一步就是根据 where 参数，确定新元素的插入位置，其关键代码如下：

```c
unsigned char *ziplistPush(unsigned char *zl, unsigned char *s, unsigned int slen, int where) {
    unsigned char *p;
    p = (where == ZIPLIST_HEAD) ? ZIPLIST_ENTRY_HEAD(zl) : ZIPLIST_ENTRY_END(zl);
    return __ziplistInsert(zl,p,s,slen);
}
```

ZIPLIST_HEAD 这个宏其实就是 0 这个值， ZIPLIST_ENTRY_HEAD 这个宏就是 zl 指针后移两个 int32 和一个 int16 的长度，恰好是后移了 ziplist 的头，就如下图：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57b44d5ef5f54dde9afc4ce435034596~tplv-k3u1fbpfcp-watermark.image?)

要是往 ziplist 的队尾插入，就执行 ZIPLIST_ENTRY_END 这个宏，其定义如下：

```c
#define ZIPLIST_ENTRY_END(zl) ((zl)+intrev32ifbe(ZIPLIST_BYTES(zl))-ZIPLIST_END_SIZE)
```

它的功能是把 zl 指针后移了 ziplist 的长度 -1 个字节数，这个减一，就是因为 zlend 部分固定为一个字节，如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1171bddadd2540a297e7fbf3f2a62856~tplv-k3u1fbpfcp-watermark.image?)


这是我们第一次看这种嵌套的宏，这里会展开一步步进行分析。

先来看 ZIPLIST_BYTES 这个宏，其定义如下，它是先把 zl 指针从 char* 指针强制类型转换成 int32 指针类型，然后用 * 号解引用，它拿到的就是 zlbytes 这个 32 位的 int 值，也就是整个 ziplist 占的字节数。

```c
#define ZIPLIST_BYTES(zl)  (*((uint32_t*)(zl)))
```


然后再来看 ZIPLIST_ENTRY_END 这个宏，其定义如下，ZIPLIST_ENTRY_END 中减去 ZIPLIST_END_SIZE 的操作就是把 zl 指针后移了 ziplist 的长度 -1 个字节，那就是指向了 ziplist 队尾， 也就是上图中 p 指针的位置。

```c
#define ZIPLIST_END_SIZE (sizeof(uint8_t))
```


## 计算 prevlen 长度

确定了插入位置之后，接下来，我们紧跟 Redis 的代码实现，进入 `__ziplistInsert() 函数`内部继续分析。


__ziplistInsert() 函数要做的第一件事就是计算新插入 entry 部分的 prevlen 值，关键代码如下所示。看这个分支，主要是区分是不是在队尾插入。

```c
if (p[0] != ZIP_END) { // 非队尾插入（在队头位置插入或是队中位置插入）
    ZIP_DECODE_PREVLEN(p, prevlensize, prevlen);
} else { // 队尾插入
    unsigned char *ptail = ZIPLIST_ENTRY_TAIL(zl);
    if (ptail[0] != ZIP_END) {
        // 计算新entry的prev值
        prevlen = zipRawEntryLengthSafe(zl, curlen, ptail);
    }
}
```


先来看在`非队尾插入`（在队头位置插入或是队中位置插入）的分支（毕竟 __ziplistInsert() 是个公共的函数，还是会有队中插入的情况）这个场景的话，看下面这个图会比较清晰，entry2 里面的 prevlen 其实存的是 entry1 的长度。新插入的这个 prevlen 也是要存 entry1 的 prevlen 长度，所以新 prevlen 直接复制 entry2 的 prevlen 值就完事了。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/834d0eec5d324575a6cf330ff76737cb~tplv-k3u1fbpfcp-watermark.image?)

ZIP_DECODE_PREVLEN 这个宏，里面的逻辑大概就这样，具体实现我就不展开说了。

再来看 else 这个分支，这个分支是要`在 ziplist 尾部插入新元素`的场景，如下图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d299ab0f4445ce9fecc8c8aaabf427~tplv-k3u1fbpfcp-watermark.image?)

ZIPLIST_ENTRY_TAIL 这个宏里面，会根据 zltail 值，得到最后一个 entry 的首地址，也就是图里面的 ptail 指针。然后，zipRawEntryLengthSafe() 函数就会按照前面说的编码规则，解析 ptail 指向的这个 entry，其中就会拿到 prevlen、len 这些值，这样的话，我们就能算出新 entry 的 prevlen 值了。

解析 entry 的代码我就不展开细说了，你可以对照上一讲中介绍的 entry 规则慢慢慢分析。


## 新元素编码方式

继续往下看 __ziplistInsert() 函数中对新元素编码的逻辑，关键代码如下：

```c
if (zipTryEncoding(s,slen,&value,&encoding)) { // 新元素是否为整数
    reqlen = zipIntSize(encoding); // 按照整数进行编码
} else {
    reqlen = slen;
}
reqlen += zipStorePrevEntryLength(NULL,prevlen);
reqlen += zipStoreEntryEncoding(NULL,encoding,slen);
```


这里的 zipTryEncoding() 方法实际上就是尝试把新元素转成整数。这里有几个细节需要注意一下，一个是 zipTryEncoding() 方法的返回值，返回 1 表示新元素能转成整数，0 表示转换不了；再一个就是可以转换的时候，需要注意一下 zipTryEncoding() 方法的后两个参数，传的是 value 和 encoding 的指针。

来看 zipTryEncoding() 函数，核心代码如下，它会把转换后的整数存到 value 里面，encoding 里面呢，存的就是这个整数的编码方式，这段 if else 逻辑还是根据 entry 里面 len 的编码规则来写的，不多说了。

```c
int zipTryEncoding(unsigned char *entry, unsigned int entrylen, long long *v, unsigned char *encoding) {
    long long value;
    if (entrylen >= 32 || entrylen == 0) return 0;
    if (string2ll((char*)entry,entrylen,&value)) {
      ... // 省略entry的编码逻辑
        return 1;
    }
    return 0;
}
```

确定了新元素能不能转整型之后，我们也就可以确定新元素占多少个字节了。要么就是整数的那 6 种的情况，要么就是算字符串的长度。

明确了 prevlen、len 以及 data 这三部分的值之后，我们直接将这三部分所占字节数累加，也就拿到了新 entry 所占字节数，也就是这里的 reqlen 值。

## 调整 ziplist 长度

我们接着往下看插入逻辑。因为有新元素的插入，我们要扩容一下 ziplist 这块连续的空间，扩容之前我们除了要知道新 entry 占多少字节，还要知道新元素之后的这个 entry 里面，prevlen 是不是需要扩容。

举个简单例子，看下面这张图，正常情况下，ziplist 只需要增加 500 字节，来存新 entry 就行了。但是 prevlen2 要存的值超过了 254，也是需要扩容的，这个时候呢，扩容的字节数就变成了 504 。



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d772149304b04df1ba94f456908eb567~tplv-k3u1fbpfcp-watermark.image?)

那 entry2 的扩容，是不是还有可能导致后面的 entry3 的扩容？entry3 的扩容可能再导致 entry4 的扩容……就像是多米诺骨牌一样，不停扩容下去，一直到 ziplist 的最后一个 entry，这也就是 ziplist 里面常说的`  “连锁更新” `。最差的情况就是，在 ziplist 头部插入一个新元素，然后一路触发连锁更新，到最后一个 entry，这样的话， ziplist 插入效率就会很差。


但是，需要注意，要真正触发多次连锁更新，需要 ziplist 中有多个连续的 entry 节点的长度恰好位于 250 字节~ 253 字节之间，要满足这个条件还是比较苛刻的。绝大多数插入场景里面，都不会触发连锁更新，即使触发了，也会很快碰到到长度不变的 entry，连锁更新也就停了。

这里提到的连锁更新，我们将在本节最后展开详细分析，这里就不再过多介绍其实现细节了。


我们回到 __ziplistInsert() 函数继续分析 ziplist 插入新元素的逻辑，下面是计算 nextdiff 值的关键代码片段：

```c
int forcelarge = 0;
nextdiff = (p[0] != ZIP_END) ? zipPrevLenByteDiff(p,reqlen) : 0;
if (nextdiff == -4 && reqlen < 4) { // 注意：需要同时满足这两个条件
    nextdiff = 0;
    forcelarge = 1;
}
```

结合前面说的，这个 nextdiff 就是用来存 prevlen2 需要扩容多少个字节。要是在 ziplist 尾部插入，没有下一个 entry2，nextdiff 就是 0。要是像上图那种，在中间插入或者是头部插入的话，就要用 zipPrevLenByteDiff() 函数计算了。我们用一个简单的示例来说明一下 zipPrevLenByteDiff() 的功能，A 是当前 prevlen 的长度，B 是更新之后 prevlen 的长度，zipPrevLenByteDiff() 函数返回的就是 B - A，也即扩容了几个字节。


紧接着的这个 if 判断为什么要检查 nextdiff 是否等于 -4 呢？它主要是处理下图展示的 prevlen2 缩容这种场景：



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5877bdf741624cff92bcefa4fe2fbcb3~tplv-k3u1fbpfcp-watermark.image?)

正如这个 if 代码块的逻辑所示，它就把 nextdiff 重置成了 0，其实是个优化，就是为了减少 ziplist 的数据拷贝，为了节省 4 个字节，把后面的数据全部往前挪一遍，也不是特别高效。所以这个地方，用 forcelarge 标记一下，强行使用 5 字节来存储 prevlen2 。


> 另外，这还跟一个 bug 有关系，这里我就不展开说这个 bug 的历史背景了，感兴趣的小伙伴，可以去参考这几个帖子：
>
> <https://segmentfault.com/a/1190000018878466?utm_source=tag-newest>
>
> <https://www.cnblogs.com/cquccy/p/14309040.html>


明确了新 entry 的长度以及它后面的 prevlen 变化之后，我们可以真正开始计算 ziplist 的新长度了，然后执行 ziplistResize() 对 ziplist 这块连续空间扩容，它底层是依赖 realloc() 函数来实现的，__ziplistInsert() 中相关的关键片段如下：

```c
offset = p-zl;
newlen = curlen+reqlen+nextdiff;
zl = ziplistResize(zl,newlen);
p = zl+offset;
```


简单说明一下 realloc() 这个函数扩容的逻辑，它优先会直接在 ziplist 后面拼接一块空闲区域，来满足 newlen 的空间需求，就和下图一样，这个场景里面，realloc() 前后，ziplist 的起始内存地址是不变的。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c260650746d44548b3785c8b055c66a1~tplv-k3u1fbpfcp-watermark.image?)

但是呢，并不是每次都这么凑巧 ziplist 后面有空闲空间，那就会有第二种场景，就下面这个图的场景，C 语言的编译器会申请一块 newlen 字节的新空间，然后把原来 ziplist 里面的数据拷贝过来。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d9c932d54aa4e5bbe578a9c10a691b5~tplv-k3u1fbpfcp-watermark.image?)

**realloc() 不仅能用于扩容，还能用于缩容**。就比如我们这里 newlen 小于原来 ziplist 的长度，但是缩容就可能导致我们的 ziplist 结尾的一部分数据丢失，如下图所示，这也是前面 nextdiff 在 reqlen 小于 4 的时候，需要重置为 0 的原因之一。



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5b3ae5b35724949aa245fe9ab3f6701~tplv-k3u1fbpfcp-watermark.image?)


也正是由于 realloc() 扩容之后，ziplist 的首地址可能发生变化，所以这里就需要 offset 记录 p 指针相对于 zl 指针的字节偏移量，在 realloc 返回新的 ziplist 首地址之后，重新计算 p 的位置。稍微注意一下就行。


## 移动数据

给 ziplist 分配了新数据之后，接下来就要开始把插入点，也就是下图中的 p 指针之后的数据，往后移动，给新 entry 留出足够的空间。这个过程是通过 **memmove() 函数**实现的，nextdiff 就两种取值可能，0 或者 4，关键代码了如下所示：

```c
if (p[0] != ZIP_END) { // 非队尾插入
    // 后移操作
    memmove(p+reqlen,p-nextdiff,curlen-offset-1+nextdiff);
    ... // 省略其他代码逻辑
} else { // 队尾插入
    ZIPLIST_TAIL_OFFSET(zl) = intrev32ifbe(p-zl);
}
```


这里以 nextdiff 为 0 举例，就是这个图的移动方式，就是从插入点 p 往后的全部数据都拷贝一份，然后放到 p+reqlen 这个地方。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa88ea9c7343493b89da7d39c26cadcd~tplv-k3u1fbpfcp-watermark.image?)


要是 nextdiff 是 4 的话，就是下图的移动方式，这里可能引起误会的地方是：拷贝 entry1 最后的 4 个字节，这 4 个字节里面的数据是什么，其实不重要，重要的是，这 4 个字节后面，会与entry2 原有的 1 字节 prevlen，组合起来，组成新的 5 字节 prevlen。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f4b2e17d4ae4223a845d0f45a37e959~tplv-k3u1fbpfcp-watermark.image?)

要是在 ziplist 的队尾插入，就会进入上述关键代码的 else 分支，不会有内存数据的移动了，直接修改一下 zlend 这个结束字符的位置就可以了。


## 更新 prevlen

移动完插入点之后的数据以后，我们接下来要做的就是把 entry2 的 prevlen 值写进去，关键代码如下：

```c
/* Apply memory move when necessary and update tail offset. */
    if (p[0] != ZIP_END) {
        ... // 省略其他代码
        if (forcelarge) // 使用5字节存储一个较小prevlen值的逻辑
            zipStorePrevEntryLengthLarge(p+reqlen,reqlen);
        else // 正常编码逻辑
            zipStorePrevEntryLength(p+reqlen,reqlen);
        ... // 省略其他代码
    } else { //省略队尾插入的逻辑    }
```

其中，else 分支中的 zipStorePrevEntryLength 方法，就是小 prevlen 值用 1 字节，大值用 5 字节；if 分支会根据前面的 forcelarge 标记，决定是不是要强行使用 5 字节的编码方式存一个较小的 prevlen 值，具体编码实现就位于 zipStorePrevEntryLengthLarge() 函数中，这里细节就不展开细说了。

## 更新 zltail

完成了新插入 entry 之后的数据移动之后，就要更新 ziplist 中的 zltail 值，也就是 ziplist 中的最后一个字节。要是队尾插入新数据，zltail 的位置就是插入点 p 到 ziplist 队头的 zl 指针的距离。要是在非队尾的位置插入新数据，zltail 的位置就是原来的 zltail 值加上新 entry 还有 nextdiff 的长度。

相关的代码片段如下：

```c
if (p[0] != ZIP_END) { // 非队尾插入
    ZIPLIST_TAIL_OFFSET(zl) =
            intrev32ifbe(intrev32ifbe(ZIPLIST_TAIL_OFFSET(zl))+reqlen);
}else { // 队尾插入
    ZIPLIST_TAIL_OFFSET(zl) = intrev32ifbe(p-zl);
}
```


这个地方要说的是 ZIPLIST_TAIL_OFFSET 这个宏，其定义如下，它的功能就是找到 zltail 的首地址，然后用 * 号解引用，拿到里面的值。

```c
#define ZIPLIST_TAIL_OFFSET(zl) (*((uint32_t*)((zl)+sizeof(uint32_t))))
```

ZIPLIST_TAIL_OFFSET 这个宏在等号左边的时候，除了上述解析逻辑之外，还能给这块解析出的内存区域赋值。下面通过一个示例说明一下这种情况：下面定义了一个 p 指针指向了 i 这个值，我们通过 *p 是可以拿到 3 这个值的，通过 *p 也是可以修改 i 里面存的值的。

```c
void testUpdateByPoint() {
    int i = 3;
    int *p = &i;
    printf("%d\n", *p);
    *p = 4;
    printf("%d\n", i);
}
```


所以，你再看到等号左边的这个 ZIPLIST_TAIL_OFFSET 宏，实际上就是给 zltail 部分赋值。

## 写入新 entry

在 __ziplistInsert() 函数的最后，是几个 zipStore*() 方法，相关代码如下：

```c
p += zipStorePrevEntryLength(p,prevlen); // 写入prevlen
p += zipStoreEntryEncoding(p,encoding,slen); // 写入len
if (ZIP_IS_STR(encoding)) { // 写入data
    memcpy(p,s,slen);
} else {
    zipSaveInteger(p,value,encoding);
}
ZIPLIST_INCR_LENGTH(zl,1); // 更新zllen值
```

从名字就能看出来，它们是写新 entry 的 prevlen、len 还有 data 这三部分，整个写新 entry 的过程都是按照前面计算好的写，没什么太复杂的地方。这里唯一要简单说明的就是 **memcpy()** 这个函数，它的功能就是拷贝数据，例如`  memcpy(p,s,slen) ` 这个调用，它就是从 s 这个地址开始，往后拷贝 len 个字节，然后复制到 p 这个地址。


最后一步，就是要更新 ziplist 里面的 zllen 值，也就是这个 ZIPLIST_INCR_LENGTH 宏，相信小伙伴们看了前面那么多宏定义，自己分析一下这个，应该问题不大了，我就不多说了。


## 连锁更新

最后，我们回来看一下 **__ziplistCascadeUpdate()** 这个函数，__ziplistInsert() 函数中相关的代码片段如下：

```c
if (nextdiff != 0) {
    offset = p-zl;
    zl = __ziplistCascadeUpdate(zl,p+reqlen); // 连锁更新
    p = zl+offset;
}
```


先说一下这个函数的作用：在前面计算 ziplist 新长度（就是 newlen）的时候，我们是不是只考虑了插入点之后那个 entry，就是下图中 entry2 中的 prevlen2 发生扩容的情况。




![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27c657f6e1684539a10ab777ee044ded~tplv-k3u1fbpfcp-watermark.image?)


前面也说过，entry2 长度的变化，可能也会引起后面 entry3 的长度变化，例如，entry2 长度本来是 251 字节，现在扩容之后，成了 255 字节。这个时候，entry3 的 prevlen 就要扩容，同样地， entry4 的 prevlen 也要扩容，这就导致了连锁扩容。虽然这种连锁扩容发生的概率不大，但是还是有可能发生，一旦发生，不进行解决，就会导致数据混乱。



__ziplistCascadeUpdate() 函数，就是来解决处理连锁更新场景的。先看一下它的参数，传的是 p + reqlen，那就是从 entry2 开始处理，再来看它处理连锁更新的思路，我们结合下图来说：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a46cc4656b346a7805b1f769caa6d62~tplv-k3u1fbpfcp-watermark.image?)

首先，__ziplistCascadeUpdate() 函数要找到的就是 entry2 的起始位置，然后，解析 entry2，得到 entry2 的长度，也就是 firstentrylen 和 prevlen 这两个值。这样的话，我们就能拿到 entry3 的起始地址了。

```c

unsigned char *__ziplistCascadeUpdate(unsigned char *zl, unsigned char *p) {
    ... // 省略变量定义的相关代码
    if (p[0] == ZIP_END) return zl;
    zipEntry(p, &cur); // 解析entry2
    // 计算entry2长度
    firstentrylen = prevlen = cur.headersize + cur.len;
    // 计算entr3的prevlen长度
    prevlensize = zipStorePrevEntryLength(NULL, prevlen);
    prevoffset = p - zl;
    p += prevlen;
    ...
}
```


然后，__ziplistCascadeUpdate() 函数就开始进下面这个 while 循环。其中，第一个 if 分支，是碰到第一个不需要扩缩容的处理逻辑，不需要扩缩容就说明连锁更新到此为止了，直接 break 退出循环即可。

```c
while (p[0] != ZIP_END) {
    assert(zipEntrySafe(zl, curlen, p, &cur, 0));
    // 碰到第一个不需要扩容的entry，就会从这个break处退出
    if (cur.prevrawlen == prevlen) break; 

    if (cur.prevrawlensize >= prevlensize) { //  prevlen长度减小的处理逻辑
        if (cur.prevrawlensize == prevlensize) { // 存储的字节数不变
            zipStorePrevEntryLength(p, prevlen);
        } else { // 需要缩容的处理逻辑
            zipStorePrevEntryLengthLarge(p, prevlen);
        }
        break;
    }
    // 断言检查
     assert(cur.prevrawlen == 0 || cur.prevrawlen + delta == prevlen);

    // 后移指针
    rawlen = cur.headersize + cur.len;
    prevlen = rawlen + delta; 
    prevlensize = zipStorePrevEntryLength(NULL, prevlen);
    prevoffset = p - zl;
    p += rawlen;
    extra += delta;
    cnt++;
}
```


上述第二个 if 分支，是 prevlen 长度减小的处理逻辑。在这种的情况下，如果是 prevlen 从 5 字节变成 1 字节，就会执行 Large 这个函数，强制使用 5 字节的大空间来存 1 字节的 prevlen 值，也就无需进行缩容，连锁更新到这里也就停了。


如果没有进入前两个 if 分支，说明 prevlen 发生变化了，但不是缩容，那只能是扩容了。那一定是扩容 4 个字节。这种一定发生的事情，可以用一个断言检查一下。


while 循环最后，就是移动遍历的各个指针，比如，prevoffset、p 指针都会后移一个 entry。cnt 是记录这次连锁更新的涉及到了多少个 entry，extra 是存了这次连锁更新需要增加多少个字节。这个 while 循环一路往下检查 entry4、entry5，直到触发前面的两个 if 分支退出。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24fa935c965941a89b5ae97164f1109b~tplv-k3u1fbpfcp-watermark.image?)


再往下来，就是 __ziplistCascadeUpdate() 连锁更新后的收尾工作，关键代码如下：

```c
offset = p - zl;
zl = ziplistResize(zl, curlen + extra); // 扩容extra
p = zl + offset;
memmove(p + extra, p, curlen - offset - 1); // 后移没有被连锁更新波及的entry
p += extra;
```


这里会更新 zltail 的值，要是有扩容的话，把 extra 算进去，然后是 ziplistResize() 给整个 ziplist 扩容，并且把没有被连锁更新波及到的 entry 后移，比如下面这张图，连锁更新只影响了 entry3、entry4，从 entry5 之后的所有 entry都会后移。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b62a49b95abc40f7a4a5f3f412f2accd~tplv-k3u1fbpfcp-watermark.image?)


最后，__ziplistDelete() 函数会执行下面这个 while 循环，就是从 prevoffset 的位置往前遍历，一个个 entry 后移，并调整 prevlen 值。每次 while 循环 prevoffset 会前移，同时 cnt 减一，直到连锁更新波及的全部 entry 处理完。

```c
while (cnt) {
    zipEntry(zl + prevoffset, &cur); 
    rawlen = cur.headersize + cur.len;
    // 后移entry
    memmove(p - (rawlen - cur.prevrawlensize), 
            zl + prevoffset + cur.prevrawlensize, 
            rawlen - cur.prevrawlensize);
    p -= (rawlen + delta); // 
    if (cur.prevrawlen == 0) { // 调整prevlen值
        zipStorePrevEntryLength(p, firstentrylen);
    } else {
        zipStorePrevEntryLength(p, cur.prevrawlen+delta);
    }
    prevoffset -= cur.prevrawlen; // offset指针前移
    cnt--;
}
```


## 总结

本节课程中，我们重点讲解了 Redis 向 ziplist 结构中插入新元素的关键逻辑，主要分了 9 个核心步骤，其中涉及到了新 entry 长度的计算、插入点之后 entry 的 prevlen 的更新、整个 ziplist 的扩缩容以及连锁更新等操作。


通过对这些步骤的分析你也能看出，**向 ziplist 中插入数据的逻辑非常复杂**，尤其是连锁更新这个操作，在极端条件下，会非常低效，这是由于 ziplist 结构本身所导致的，`也是 ziplist 在 Redis 7 中被 listpack 结构完全替换的重要原因之一`。


目前 Redis 7 还没有被大面积线上部署，所以我们还是有必要继续学习一下 ziplist 的结构和相关操作，以应对 Redis 6 以及之前版本的问题。下一节我们将继续介绍 ziplist 相关的剩余操作。