在 Java 里面，HashSet 底层是用 HashMap 实现的。在 Redis 里面也是类似的，Redis 里面的 Hash 底层结构是 dict，Set 底层的结构也是 dict。但是，在元素都是整数值的时候，Set 可以用一种`更省空间`的方式来存数据，这种省空间的方式就是这一节要说的 intset。

一个 Set 要用 intset 作为底层存储的话，需要满足两个条件：

-   一个就是前面说的，元素都是整数类型；

-   另一个条件是这个 Set 里面的元素个数，要少于 set-max-intset-entries 配置指定的这个值，这个值默认是 512。

一旦这个 Set 集合不满足这两个条件，就会切换成 dict 作为底层存储。**Redis 之所以使用 intset 结构来进行优化，主要是为了减少内存碎片，提高查询效率，这也体现了 Redis 在空间占用和耗时等方面的折中和思考**。


## intset 结构体

从名字就可以看出，**intset 结构体是用来存储整数类型的集合**，不仅如此，intset 中存储的整数还是有序的，这样我们就可以非常方便地使用二分查找来查找一个元素。下面来看 intset 结构体的定义：

```c
typedef struct intset {
    uint32_t encoding; // 编码类型
    uint32_t length; // contents数组的长度
    int8_t contents[]; // 柔性数组，不使用时不占用空间
} intset;
```

下面展开说说 intset 中每个字段的含义。

-   encoding 字段：编码格式，表示 intset 中存储的每个元素需要用几个字节来存储。其可选值有如下三个：

    -   INTSET_ENC_INT16：值为 2，表示所有元素值都处于 [INT16_MIN, INT16_MAX] 范围内，那么在 contents 数组中每 2 个字节表示一个整数元素。
    -   INTSET_ENC_INT32：值为 4，表示有元素的值处于 (INT16_MAX, INT32_MAX] 或是 [INT32_MIN, INT16_MIN) 范围内，那么在 contents 数组中每 4 个字节表示一个元素。
    -   INTSET_ENC_INT64：值为 8，表示有元素的值处于 (INT32_MAX, INT64_MAX] 或是 [INT64_MIN, INT32_MIN) 范围内，那么在 contents 数组中每 8 个字节表示一个元素。



-   length 字段：表示 intset 中的元素个数。



-   contents 字段：用来存储 intset 中元素的数组，这是个柔性数组，不使用时不会占用空间。



从 intset 结构体的定义可以看出，它与前文介绍的 ziplist 类似，也是通过一块连续的内存空间实现的，如下图所示，其中 encoding 和 length 两部分构成了 intset 的头，总共占 8 字节。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2af68e437d0b4e9687cbb8e03b014861~tplv-k3u1fbpfcp-watermark.image?)

  


## intset 核心函数


了解了 intset 的核心定义之后，我们来看 intset 的核心函数。


首先是用于创建 intset 实例的 `intsetNew() 函数`，其中会通过 malloc() 调用来申请内存空间，然后将 encoding 字段初始化为 INTSET_ENC_INT16， length 字段初始化为 0。

```c
intset *intsetNew(void) {
    intset *is = zmalloc(sizeof(intset)); // 申请内存空间
    is->encoding = intrev32ifbe(INTSET_ENC_INT16); // 初始化encoding和length字段
    is->length = 0;
    return is;
}
```


### 查找数据


我们可以使用 `intsetFind() 函数`从 intset 中查找一个元素，返回 0 表示 intset 中没有目标元素，返回 1 表示 intset 中存在目标元素。下面我们来看 intsetFind() 函数的核心逻辑。

1.  在查找开始之前会先通过前文介绍的 encoding 取值范围，计算目标值的编码值，如果超出了 intset 的编码值，查找直接失败。

```c
uint8_t intsetFind(intset *is, int64_t value) {
    uint8_t valenc = _intsetValueEncoding(value); // 检查目标值的范围
    return valenc <= intrev32ifbe(is->encoding) && intsetSearch(is,value,NULL);
}
```

2.  完成编码值校验之后，会通过 intsetSearch() 函数开始二分查找。intsetSearch() 里面先会进行三个边界检查：intset 是不是空、intset 中的最大值小于目标值、intset 中的最小值大于目标值，满足任意一个条件，就表示查找失败，并返回 0。



3.  接下来开始`二分查找`，具体实现如下：

```c
static uint8_t intsetSearch(intset *is, int64_t value, uint32_t *pos) {
    ... // 省略前面的边界检查
    while (max >= min) { // 检查查找是否已完成
        // 计算中间的索引值
        mid = ((unsigned int)min + (unsigned int)max) >> 1;
        // 获取mid指向的元素值
        cur = _intsetGet(is, mid);
        // 比较目标值与cur值
        if (value > cur) {   
            min = mid + 1; // 继续查找mid到max的区域
        } else if (value < cur) {
            max = mid - 1; // 继续查找min到mid的区域
        } else { // 查找成功，最后会返回1
            break;
        }
    }
    // 修改pos指针
    if (value == cur) {
        if (pos) *pos = mid;
        return 1;
    } else {
        if (pos) *pos = min;
        return 0;
    }
}
```

  


注意，intsetSearch() 函数除了返回值可以表示查找是否成功之外，还会修改 pos 指针（第三个参数）的值：

-   如果查找成功，pos 记录的是目标值所在的位置；

<!---->

-   如果查找失败，也就是目标值不在 inset 里面，那如果要把目标值插入到 inset 里面，pos 记录的就是这个插入位置。

  


### 添加数据


再来看往 intset 里面添加元素的逻辑，入口函数是 `intsetAdd() 函数`，核心逻辑如下。

1.  通过前面介绍的 encoding 取值范围，计算待插入整型数据的编码值。如果插入元素的 encoding 值大于 intset 的 encoding 编码值时，就会通过 intsetUpgradeAndAdd(）函数对 intset 进行升级并同时完成新元素的插入，这个后面我们单独说。



2.  接下来，通过 intsetSearch() 函数查找待插入的值。如果查找成功，说明这个值已经在 intset 里面了，无需后续的插入逻辑；如果未查找成功，intsetSearch() 函数会修改 pos 指针的值，将其指向插入位置。



3.  确定了插入位置之后，会通过 intsetResize() 函数对 intset 进行扩容。



4.  如果 pos 指向的插入位置不在 intset 这块连续空间的两端，就需要调用 intsetMoveTail() 函数将 pos 之后的全部元素后移。



5.  最后调用 _intsetSet() 函数，将 intset 的第 pos 个元素赋值为目标值，同时还会递增 intset 的 length 字段。

  


整个插入过程如下图所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0599ea04e2c9436ea0198a21bfcf344a~tplv-k3u1fbpfcp-watermark.image?)
  


在整个添加元素的过程中，需要展开介绍的是 `intsetUpgradeAndAdd() 函数`，其具体实现和详细的注释如下：

```c
static intset *intsetUpgradeAndAdd(intset *is, int64_t value) {
  // 计算新旧两个encoding值
  uint8_t curenc = intrev32ifbe(is->encoding);
  uint8_t newenc = _intsetValueEncoding(value);
  // 获取当前intset中的元素个数
  int length = intrev32ifbe(is->length);
  // 根据插入值的正负，即可判断插入在intset的头部还是尾部
  int prepend = value < 0 ? 1 : 0;
  // 更新intset的encoding值
  is->encoding = intrev32ifbe(newenc);
  // 扩容intset，申请更大的连续内存空间
  is = intsetResize(is, intrev32ifbe(is->length) + 1);
  // 从后向前拷贝元素值，这样不会出现覆盖的问题
  while (length--)
        _intsetSet(is, length + prepend, _intsetGetEncoded(is, length, curenc));

  if (prepend) // 将插入值设置到intset的头部
        _intsetSet(is, 0, value);
  else // 将插入值设置到intset的尾部
        _intsetSet(is, intrev32ifbe(is->length), value);
  // 更新intset的length字段
  is->length = intrev32ifbe(intrev32ifbe(is->length) + 1);
  return is;
}
```

这里解释一下 prepend 变量的作用：既然是要对 intset 的编码格式进行升级，那插入的新值必然超出了当前的编码格式所表示的范围，也就是说，新插入的这个值，要么大于 intset 现有元素，要么小于 intset 现有元素。如果是大于现有元素而触发升级，新元素必然是正数；如果是小于的场景触发升级，新元素必然是负数。再推导一步，如果新元素是负数，就需要插入 intset 头部；如果是正数，就需要插入到 intset 尾部。


这里有个注意的地方，在升级过程中，要从后向前后移 intset 元素，就如下图所示，其中的编号表示了拷贝操作执行的顺序，如果我们先执行 element 1 的拷贝（也就是图中的操作 3），就可能覆盖原 intset 中 element 2 元素的值。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b660b4eb51a493f9ddbca2bba28921a~tplv-k3u1fbpfcp-watermark.image?)

  


### 删除数据

在了解了从 intset 查找数据以及向 intset 添加数据的逻辑之后，最后再来看 intset 删除数据的实现，其入口是 `intsetRemove() 函数`，核心步骤如下。

1.  第一步依旧是计算目标值的编码类型，并和当前 intset 的编码类型进行比较，如果超出了 intset 的编码范围，则表示 intset 中不存在该值，此次删除操作直接结束。



2.  通过编码范围检查之后，调用 intsetSearch() 函数查找目标值所在的位置。如果查找失败，也说明目标值不在 inset 中，此次删除操作结束。



3.  最后一种情况是，查找成功，得到目标所在的位置 pos 之后，直接调用 intsetMoveTail() 函数进行内存拷贝，将 pos + 1 到 intset 末尾的全部元素前移，前移一个元素所占的字节数，覆盖掉目标元素，达到删除的效果。

```c
intset *intsetRemove(intset *is, int64_t value, int *success) {
    uint8_t valenc = _intsetValueEncoding(value); // 计算目标值的编码类型
    uint32_t pos;
    if (success) *success = 0;
    // 使用insetSearch()查询目标值所在位置
    if (valenc <= intrev32ifbe(is->encoding) && intsetSearch(is,value,&pos)) {
        uint32_t len = intrev32ifbe(is->length);
        if (success) *success = 1;
        if (pos < (len-1)) intsetMoveTail(is,pos+1,pos); // 删除目标值
        is = intsetResize(is,len-1);
        is->length = intrev32ifbe(len-1);
    }
    return is;
}
```

  


## 总结

本节我们重点介绍了 Redis 中 intset 的相关内容，intset 是除 dict 之外，set 数据类型底层依赖的另一个重要的存储结构。


我们先介绍了 intset 涉及到的核心概念以及核心结构体的定义。然后，详细剖析了 intset 相关的函数，具体讲解了创建 intset 实例、向 intset 插入新元素、删除元素以及查询元素的核心函数。