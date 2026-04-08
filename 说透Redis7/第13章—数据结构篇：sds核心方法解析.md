在上一节课程中，我们详细介绍了 Redis sds 的设计和优化，我们可以将这些 sds 结构体理解为存储的字符串数据的静态结构，`Redis 如何使用这些 sds 结构体，完成字符串的基本功能`，是我们接下来要关注的重点，也是本节课重点要介绍的内容。


本节我们将 Redis 字符串相关的函数分成了四大类，分别是：`初始化函数`、`扩容函数`、`缩容函数`以及`其他字符串相关的函数`。


在 sds.h 文件里面，可以看到非常多的函数定义：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c39fb0185714e30a7c2eb538efafa15~tplv-k3u1fbpfcp-watermark.image?)

具体的实现在 sds.c 这个文件里面，我们点这个红绿箭头就可以跳转过去。


## 初始化字符串

首先，我们来看**创建 sds 实例的方法实现**，这几个（sdstrynewlen()、sdsnew()、sdsempty()、sdsnewlen() ）方法都是常用的创建 sds 的方法，它们底层都是依赖 ` _sdsnewlen()  `方法实现的。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea7049bc349a452ca51fff1fb6698b73~tplv-k3u1fbpfcp-watermark.image?)



### 1. 分配内存空间的位置

前面在[第 3 讲《先导基础篇：10 分钟 C 语言入门》](https://juejin.cn/book/7144917657089736743/section/7147527076092837888)中我们提到， C 语言里面，创建一个结构体实例的时候，是这么写的：

```c
struct student {
    char name[13];
    int age;
};

int main() {
    struct student s;  // 创建一个s实例
}
```


实际上在 C 语言里面，这个 student 实例是分配在了栈上，就和我们在 Java 里面定义一个 int 值一样。是不是很神奇？C 语言居然能在栈上创建对象！


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c04c8d35056a476aa53f2d7bce60b68d~tplv-k3u1fbpfcp-watermark.image?)


但是只在栈上创建对象是不够的，栈的空间就那么点，所以还是要在堆上创建对象的，那怎么做呢？Java 里面直接 new 就行了，这个 new 帮我们屏蔽了很多底层的操作。在 C 语言里面呢，我们就要自己完成 new 的操作，我们先要计算一下一个 sdemo 实例要占多少内存，然后通过 malloc() 方法从堆上申请空间，最后拿个 sdemo 指针指向这个空间。具体示例代码如下：

```c
typedef struct __attribute__ ((__packed__)) {
    char *c1; // 8字节
    short s; // 2字节
    char c2; // 1字节
    int i;   // 4字节
} sdemo;

void testMalloc() {
    sdemo *s; // semd指针
    int size = sizeof(sdemo); // 计算一个sdemo实例占用的字节数
    s = (sdemo *) (malloc(size)); // 从堆上申请空间
    // 使用sdemo指针来操纵这个堆内存上的sdemo实例
    s->s = 100;
    s->c1 = 'A';
    s->c2 = 'B';
    s->i = 123456;
    printf("%d %c %c %d %d", s->s, s->c1, s->c2, s->i, size);
}

void main() {
    testMalloc();
}
// 输出：
// 100 A B 123456 15
```


这里我们用 sizeof 来计算一个 sdemo 实例占多少个字节，sdemo 里面 c1、s、c2、i 四个字段加起来，总共 15 个字节。有的小伙伴可能会问，c1 是一个 char 指针类型，为什么会占 8 位呢？这里需要说一下的就是指针的大小，在 C 语言里面，指针都是占 8 字节，跟指针具体指向的类型无关。我们看 sizeof 输出的也是 15 字节，注意一下哈，要是进行内存对齐的话，sizeof 会比 15 大，毕竟需要填充空白字符进行对齐。


### 2. 柔性数组

现在我修改一下 sdemo 这个结构体，我`在后面加个 char 数组`：


```c
typedef struct __attribute__ ((__packed__)) {
    char *c1; // 8字节
    short s; // 2字节
    char c2; // 1字节
    int i;   // 4字节
    char buf[]; // 柔性数组
} sdemo;
```


然后执行一下 sizeof 的话，应该输出什么呢？还是输出 15，之前不是说指针和数组是一样的吗？不应该也是占 8 个字节吗？为什么现在感觉这个 buf 数组没占空间啊？放在结构体最后的这个数组，比较特殊，被叫作**柔性数组**。它是不占内存空间的，只有真正使用的时候，才会开辟内存空间。我们在 sdshdr 的结构体里面看到的 buf 字段，也是柔性数组，这个稍微注意一下就好。


### 3. 创建空 sds 实例

来，我们跳到`  _sdsnewlen()  `函数里面看一下它的具体实现，其核心代码和相关注释如下：

```c
sds _sdsnewlen(const void *init, size_t initlen, int trymalloc) {
    void *sh;
    sds s;
    // 根据initlen这个长度决定使用哪个sdshdr结构体
    // 我们跳进去看看，里面就是找一个能装下initlen的最小sdshdr类型
    char type = sdsReqType(initlen);
    // 如果是sdshdr5，这里直接专转成sdshdr8类型，因为sdshdr5的alloc太小了，
    // 很容易就要扩容，还不如直接使用sdshdr8
    // 那为什么还需要定义sdshdr5呢？这个后面再说
    if (type == SDS_TYPE_5 && initlen == 0) type = SDS_TYPE_8;
    // 这里选定sdshdr类型之后，就要开始创建sdshdr的实例了。
    // 先用sizeof算一下sdshdr在内存里面占多少个字节，
    int hdrlen = sdsHdrSize(type);
    unsigned char *fp;
    size_t usable;
    assert(initlen + hdrlen + 1 > initlen);
    // 根据前面计算的sdshdr分配内存，此时sh指针指向了sdshdr实例的第一个字节
    // usable是分配出来的实际空间大小
    sh = trymalloc?
        s_trymalloc_usable(hdrlen+initlen+1, &usable) :
        s_malloc_usable(hdrlen+initlen+1, &usable);
    if (sh == NULL) return NULL;
    if (init==SDS_NOINIT)
        init = NULL;
    else if (!init)
        memset(sh, 0, hdrlen+initlen+1);
    // s指向的是buf的第一个字节
    s = (char*)sh+hdrlen;
    // fp是s向前移动一个字节，也就是指向了sds里面的flags字段
    fp = ((unsigned char*)s)-1;
    usable = usable-hdrlen-1;
    // 如果一次分配的空间太多了，超过了当前用的sdshdr的上限值，就修改一下
    if (usable > sdsTypeMaxSize(type))
        usable = sdsTypeMaxSize(type);
    switch(type) {
        case SDS_TYPE_5: {
            ... 
            break;
        }
        // 如果是用了sdshdr8结构体，就走这个分支
        case SDS_TYPE_8: {
            // s向前移动，指向sdshdr8的首字节
            SDS_HDR_VAR(8,s);
            sh->len = initlen; // 把len设置成initlen
            sh->alloc = usable; // alloc设置成usable
            *fp = type; // 设置flags字段值
            break;
        }
        case SDS_TYPE_16: {
            ... //省略
            break;
        }
        case SDS_TYPE_32: {
            ... //省略
            break;
        }
        case SDS_TYPE_64: {
            ... //省略
            break;
        }
    }
    if (initlen && init) 
        // memcpy()函数是init字符串的内容，拷贝到s往后
        memcpy(s, init, initlen);
    s[initlen] = '\0'; // 字符串的最后添加'\0'
    return s;
}
```

`_sdsnewlen()`函数先用 sdsReqType() 方法（第 6 行）确定一下使用哪种 sdshdr 结构体，我们跳进去看看，里面就是找一个能装下初始字符串的最小 sdshdr 类型，比如我们初始化的字符串长度在 2^5 ~ 2^8-1 这个范围之内，就要选 sdshdr8。


> 如果是 sdshdr5，而且还没指定初始长度的话，这里直接转成 sdshdr8 类型，因为 sdshdr5 太小了，很容易就要扩容，还不如直接使用sdshdr8。


选完 sdshdr 类型之后呢，就要开始创建 sds 的实例了。和之前在堆上创建对象一样，先用 sizeof 算一下 sds 在内存里面占多少个字节，注意一下 sds 里面的柔性数组是不占空间的（第 13 行）。


然后，开始调用 malloc 分配内存（第 19~21 行），这里的 `s_trymalloc_usable` 和 `s_malloc_usable` 都是封装了 C 语言的 malloc，返回的这个 sh 指针指向了 sds 实例的第一个字节，usable 是分配出来的实际空间大小。


注意哈，下面是一个`指针移动`的操作，就和这张图一样：sh 是一个 char 指针，加一就往后移动一个 char 的长度，也就是一个字节；要是 int 指针的话，每次加一，就会向后移动一个 int 的长度，也就是 4 个字节。



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/102f87264fc3472db01320254ceb0e79~tplv-k3u1fbpfcp-watermark.image?)


现在这里（第 28 行）是往后移动 hdrlen 个字符，那指向的就是 sds 长度，那 s 指向的就是 buf 的第一个字节，fp 是 s 向前移动一个字节（第 30 行），也就是指向了 sds 里面的 flags 字段。


再来看下一行（第 33 ~ 34 行），如果一次分配的空间太多了，超过了当前用的 sds 的上限值，就修正一下，要不 alloc 存不下。


下面的这个 `switch 块`（第 35 ~ 61 行），就是填充前面创建好的 sds 实例，我们就只看 sdshdr8 这个分支就行，其他的分支逻辑都一样。首先，（SDS_HDR_VAR）这行是一个宏，你可以把它理解成一个别名。我们先来看个简单的宏 SDS_TYPE_BITS，其定义如下，在代码中使用 SDS_TYPE_BITS 这个宏，其实和使用 3 这个数字常量是一样的。

```c
#define SDS_TYPE_BITS 3
```

弄懂了简单的宏，我们再来看 (SDS_HDR_VAR(T,s)) 这个复杂那么一丢丢的宏，其定义如下：

```c
#define SDS_HDR_VAR(T,s) struct sdshdr##T *sh = (void*)((s)-(sizeof(struct sdshdr##T)));
```

这个宏看起来有点像函数，这个 T 呢，就类似于一个参数，T 传入 8，就会替换里面的 ##T，那这个宏（SDS_HDR_VAR(8,s)），把 ##T 替换成 8 就等价于这行代码（ struct sdshdr8 *sh = (void*)((s)-(sizeof(struct sdshdr8)));），那这个替换后的这行代码其实就是 s 向前移动，指向 sdshdr8 实例的首字节，懂了吧。

我们回到 ` _sdsnewlen()  `函数继续分析。接下来的 43 ~47 行代码就是用 sdshdr8 指针设置 len、alloc，用 fp 指针设置 flags 值。最后，memcpy() 函数是个字符串拷贝函数（第 62 ~ 64 行），它是把字符串的初始值，拷贝到 s 指针往后的位置，也就是 sdshdr8 的 buf 里面。最后，加个 '\0' 完事 （第 65 行）。


我们简单总结一下创建字符串里面的几个关键指针位置，sh 指向 sds 实例的首地址，fp 指向 flags 字段，s 指向的是 buf 字段的首地址。



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94c831176b254098b1ff31865d35a640~tplv-k3u1fbpfcp-watermark.image?)



## 字符串扩容


创建完 sds 实例之后呢，我们就可以各种操作字符串了，比如拼接两个字符串，在 Java 里面直接用加号把两个字符串加起来就行，但 C 语言里面的话，就需要一些特定的函数来实现。这个表里面就是 Redis 提供的字符串相加方法，比如说 sdscat() 方法，就是把一个 C 语言字符串，就是这个参数 t，追加到 s 这个 sds 字符串后面。其他方法就不再一个个说了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/803716a035864c27ab6f7fb7ba310fc9~tplv-k3u1fbpfcp-watermark.image?)



**这些 sds 拼接函数大概的逻辑就是给 sds 扩容足够大的 buf 空间，然后再把追加的字符串拷贝进去就行了**。所以，重点就变成了 Redis 如何给 sds 扩容咯，这个扩容逻辑是在 ` sdsMakeRoomFor()  `函数里面，你看看，这些拼接函数是不是都调用了这个 makeRoomFor 函数。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e0a518cd8cd4a37b03e35253722d4dd~tplv-k3u1fbpfcp-watermark.image?)

来，我们一起看一下，这个 sds 扩容的逻辑，sdsMakeRoomFor() 函数的具体实现和注释如下：

```c
sds sdsMakeRoomFor(sds s, size_t addlen) {
    void *sh, *newsh;
    // 计算剩余空间，点进去看看，就是alloc-len
    size_t avail = sdsavail(s);
    size_t len, newlen, reqlen;
    char type, oldtype = s[-1] & SDS_TYPE_MASK;
    int hdrlen;
    size_t usable;

    // 分支一：检查sds剩余可用空间要是足够的话，就不用扩容了
    if (avail >= addlen) return s;

    // 要是剩余空间不够，就要开始走下面的扩容逻辑了。
    // 扩容之后，sds里面还是要预留一些空闲buf的，我们先根据要追加的字节数，
    // 确认如何扩容：要是扩容之后小于1M，就两倍的扩容，要是超过1M，就每次扩容1M
    len = sdslen(s);
    sh = (char*)s-sdsHdrSize(oldtype);
    reqlen = newlen = (len+addlen);
    assert(newlen > len);   /* Catch size_t overflow */
    if (newlen < SDS_MAX_PREALLOC)
        newlen *= 2;
    else
        newlen += SDS_MAX_PREALLOC;

    // 下面的逻辑其实和初始化字符串的逻辑类似了
    type = sdsReqType(newlen);     // 根据扩容之后的长度，确认sds类型
    if (type == SDS_TYPE_5) type = SDS_TYPE_8;

    hdrlen = sdsHdrSize(type);
    assert(hdrlen + newlen + 1 > reqlen);
    if (oldtype==type) {
        // sds类型没变的话，sds里面原有的字符串是不用进行拷贝的，这里直接走realloc，扩大buf的长度就行了
        // 这个newsh返回的还是sds的首地址，其实和sh是一样的
        newsh = s_realloc_usable(sh, hdrlen+newlen+1, &usable);
        if (newsh == NULL) return NULL;
        // s指向buf的首地址
        s = (char*)newsh+hdrlen;
    } else {
        // 要是sds的类型发生了变化，那len、alloc的长度就变了，这个时候buf里面的字符就前后移动，
        // 这里就要走malloc分配一个新的sds实例，然后把原来buf里面的数据拷贝过去
        newsh = s_malloc_usable(hdrlen+newlen+1, &usable);
        if (newsh == NULL) return NULL;
        // 拷贝数据buf里面原有的数据
        memcpy((char*)newsh+hdrlen, s, len+1);
        // 释放原sds实例
        s_free(sh);
        // s指向了新sds实例的buf
        s = (char*)newsh+hdrlen;
        s[-1] = type; // 设置新sds实例的flags字段
        sdssetlen(s, len); // 设置新sds实例的len字段
    }
    // 设置新sds实例的alloc或者是扩大原sds的alloc字段
    usable = usable-hdrlen-1;
    if (usable > sdsTypeMaxSize(type))
        usable = sdsTypeMaxSize(type);
    sdssetalloc(s, usable);
    return s;
}
```

sdsMakeRoomFor() 函数的核心逻辑大致分成三个分支。

-   这里先去计算一下 sds 的剩余空间，点进去看看，就是 alloc 减去 len，要是剩余空间够用了，就不用扩容了。这是`第一个分支`（代码第 11 行）。

<!---->

-   要是剩余空间不够，就要开始走下面的扩容的分支逻辑了。我们扩容之后的长度至少要是 newlen，才能存下追加的字符串，但是 sds 一般会多留一些空闲空间，防止频繁扩容，那预留多少呢？这个判断就是来做这件事的，要是 newlen 小于 1M，就直接扩两倍；要是 newlen 已经超过 1M 了，就 1M、1M 地扩。

    -   确定扩容的大小之后呢，下面的逻辑其实和初始化字符串的逻辑差不多了，比如说确定 sds 类型、分配空间、设置 len 和 alloc 字段等。
    -   这里有个特殊的处理，要是扩容前后，`sds 的类型没变`，比如说始终都是 sdshdr8 的话，就没必要拷贝 sds 里面原有的字符串，直接走 realloc，扩 buf 的长度就行了，比如下面这张图。这是`第二个分支`（代码第 31 ~ 38 行）。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d9c7b32fe3f409db96898d2c2e10ff7~tplv-k3u1fbpfcp-watermark.image?)


- - 要是 `sds 的类型发生了变化`，比如从 sdshdr8 变成了 sdshdr16，就如下图一样，那 len、alloc 的长度就变了，buf 里面的字符就向后移动。这时候呢，就要走 malloc 新分配一个 sds 实例，然后把原来 sds 里面的数据拷贝过去，然后再追加新字符串。这是`第三个分支`（代码第 39 ~ 51 行）。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6c994b81ce54256b31cd9e9c20a9d87~tplv-k3u1fbpfcp-watermark.image?)




## 字符串缩容


我们上一篇文章中介绍 Redis 自定义字符串原因时简单提了一下，Redis sds 在缩容的时候，是直接修改 len 值，比如说，sdsclear() 函数，它就是直接把 sds 的 len 字段设置成 0。那你可能会问：这种字符串多了，buf 的空间不回收，岂不是内存泄露了吗？


**Redis 专门提供了一个 freeSpace 函数来释放空闲的 buf 空间**，下面我们一起看一下这个 `sdsRemoveFreeSpace()` 函数是怎么释放空间的。

```c
sds sdsRemoveFreeSpace(sds s) {
    void *sh, *newsh;
    // 看这里，s本来是个指针吧，C语言里面指针和数组其实是一样的，这里可以用s[-1]来表示指针向前移动
    // 然后，算一下当前sdshdr的类型
    char type, oldtype = s[-1] & SDS_TYPE_MASK;
    int hdrlen, oldhdrlen = sdsHdrSize(oldtype);
    // 再算一下当前的len和空闲字节数
    size_t len = sdslen(s);
    size_t avail = sdsavail(s);
    sh = (char*)s-oldhdrlen; // 前移指针，拿到当前sdshdr首地址

    if (avail == 0) return s; // 要是没有剩余空间，就不用缩容buf了

    // 算算要是存储当前len长度的字符串，需要用什么类型的sdshdr
    type = sdsReqType(len);
    hdrlen = sdsHdrSize(type);

    // 要是sdshdr类型没发生变化，或者是大sdshdr之间变来变去，就没必要更新sdshdr，
    // 毕竟有效负载全在buf那里，更新sdshdr节省的那几个字节带来收益微乎其微，
    // 但是付出的代价是要拷贝一边巨大的buf，所以这里使用realloc，缩容buf就行了
    if (oldtype==type || type > SDS_TYPE_8) {
        newsh = s_realloc(sh, oldhdrlen+len+1);
        if (newsh == NULL) return NULL;
        s = (char*)newsh+oldhdrlen;
    } else {
        // 如果是sdshdr缩到的比较厉害，比如缩到了sdshdr8，这个时候就需要通过malloc
        // 新申请一块内存区域，然后拷贝buf，这个时候buf比较小，拷贝的代价不大，
        // 而且sdshdr缩小的那几个字节，可以提高整个sdshdr的有效负载
        newsh = s_malloc(hdrlen+len+1);
        if (newsh == NULL) return NULL;
        memcpy((char*)newsh+hdrlen, s, len+1);
        s_free(sh);
        s = (char*)newsh+hdrlen;
        s[-1] = type;
        sdssetlen(s, len);
    }
    sdssetalloc(s, len); // 最后更新一下alloc字段
    return s;
}
```

首先来看 sdsRemoveFreeSpace() 函数参数（代码第 1 行），sds 本来是个 char 指针，C 语言里面指针和数组其实是一样的。这里就通过这个特性，用 -1 的下标来表示指针前移一位的效果（代码第 5行）。然后，算一下当前 sds 的情况，比如 sds 的类型、len 和空闲字符数。要是没有剩余空间，就不用缩容 buf 了，直接 return（代码第 6 ~ 12 行）。


要是有空闲的空间呢，我们就要开始缩容了，下面就是 Redis 权衡的地方了。这里先是算了一下要是存储当前 len 长度的字符串需要用什么类型的 sds，要是 sds 类型没发生变化，或者是从一个大 sds 缩容到另一个大 sds （长度大于 sdshdr8 的都属于大 sds），就没必要更新 sds 类型，就直接用 ` realloc()  `这个方法，缩一下 buf 的长度就行了（代码第 21 ~ 24 行）。


那为什么能用更小的 sdshdr 却不用呢？


这主要是因为 sdshdr8 以上的字符串，有效负载几乎全在 buf 上。比如说，从 sdshdr64 更新成 sdshdr16，len、alloc 各自节省了 6 个字节，总共节省了 12 字节，但是呢，重新申请空间要拷贝的数据量是多少？至少是 2^8 吧，256 个字节，这是 sdshdr16 的存储下限，字节数再少，就要用 sdshdr8 存储了。而且一般 sdshdr16 的字符串长度不会恰好卡在下限，都要比 256 字节多。这样的话，节省空间带来的收益微乎其微，但是付出的代价是要拷贝一遍大 buf，所以这里**对于 sdshdr8 以上的缩容，不做 sds 类型上面的变更**。


如果是字符串长度缩得比较厉害，比如缩到了 sdshdr8，这个时候就要通过 malloc 新申请一块内存区域，然后拷贝 buf 里面的数据，这个时候 buf 比较小，拷贝的代价不大，而且 sdshdr 类型的变化，会缩小几个字节，可以提高整个 sdshdr 的有效负载（代码第 26 ~ 35 行）。


小伙伴们觉得Redis 这个权衡是不是很精妙呢!!?


好了，缩容最后呢，就是更新 alloc 字段值，这个没啥可说的。


## 其他 sds 函数

扩容、缩容是 SDS 最最核心的逻辑了，已经说明白了。Redis 里面还提供了很多其他字符串的操作流程，这些操作你自己去翻翻代码就可以了，我这里简单列了一下，要是有不能“望名生义”的，可以来这个表里查一下。



**字符串的拷贝**

| **函数**                                       | **作用**                                                                                    |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| sdsdup(const sds s)                          | 深拷贝 sds 实例                                                                                |
| sdscpylen(sds s, const char *t, size_t len) | 将 C 字符串的前 len 个字符拷贝到 sds 中，这会覆盖 sds 中原有的数据。如果 len 超过了 sds 的容量，会通过 sdsMakeRoomFor() 方法进行扩容 |
| sdscpy(sds s, const char *t)                | 将 t 指向的 C 字符串拷贝到 sds 中，这会覆盖 sds 中原有的数据                                                    |

**字符串截断**

| **函数**                                      | **功能**                                                 |
| ------------------------------------------- | ------------------------------------------------------ |
| sdstrim(sds s, const char *cset)           | 接受一个 sds 和一个 C 字符串作为参数， 从 sds 左右两端分别移除所有在 C 字符串中出现过的字符 |
| sdssubstr(sds s, size_t start, size_t len)  | 从 start 位置开始截取 len 个字符                                 |
| sdsrange(sds s, ssize_t start, ssize_t end) | 截取 sds 中 start 到 end 的字符                               |

**其他**

| **函数**                                                                              | **功能**                                                                                     |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| sdsavail(const sds s)                                                               | 计算 sds 实例的可用空间                                                                             |
| sdsalloc(const sds s)                                                               | 获取 sds 实例的 alloc 值                                                                         |
| sdslen(const sds s)                                                                 | 获取 sds 实例的 len 值                                                                           |
| sdssetlen(sds s, size_t newlen)                                                     | 设置 sds 实例的 len 值                                                                           |
| sdscmp(const sds s1, const sds s2)                                                  | 比较 s1、s2 两个字符串：两字符串相同时返回0；s1 > s2 时返回正数；s1 < s2 时返回负数；                                     |
| sdssplitlen(const char *s, ssize_t len, const char *sep, int seplen, int *count) | 将 C 字符串按照 sep 进行分割，返回 sds 数组，*count 将会被设置成 sds 数组的长度。len 和 seplen 分别是 s 和 sep 两个 C 字符串的长度 |
| sdssplitargs(const char *line, int *argc);                                        | 将 C 字符串按照空格、\n、\r、\t、\0 等空白字符串进行分隔，返回分隔后的 sds 数组                                           |
| sdstolower(sds s)                                                                   | 将 sds 中的字符全部转换成小写                                                                          |
| sdstoupper(sds s)                                                                   | 将 sds 中的字符全部转换成大写                                                                          |
| sdsfree(sds s)                                                                      | 释放 sds 实例。在释放整个 sds 所占的内存空间时，会先计算得到 sds 的首字节地址，然后调用 free() 函数进行释放                          |
| sdsfreesplitres(sds *tokens, int count)                                            | 释放 sds 数组，count 是待释放的 sds 数组长度                                                             |




## 总结

这一节我们重点介绍了 sds 的核心方法，主要集中在字符串的初始化以及字符串的扩缩容相关的函数实现上。

在讲解字符串初始化的部分中，我们首先介绍了 C 语言如何在堆上分配内存空间，以及 C 语言柔性数组的基础知识，然后分析了 Redis 初始化字符串的具体实现，就使用到了上述两方面的知识以及指针移动的知识。

接着又介绍了 Redis 字符串扩缩容的实现，其中有非常多 Redis 的巧妙设计和权衡思想。例如，扩容的时候会优先检查 sds 类型是否需要发生变化，然后进入不同的分支进行处理；缩容的时候会优先检查 sds 是否要缩容掉足够多的空间，如果缩容前后都是大 sds 的类型，就没有必要进行 sds 的类型变更。

Redis 字符串的核心知识点到这里就差不多分享完了，下一节我们继续分享 Redis 里面 List 的相关内容。