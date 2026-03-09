在前面[第 11 讲《实战应用篇：Sorted Set 命令详解与实战》](https://juejin.cn/book/7144917657089736743/section/7147528919669800960)和[第 26 讲《内核解析篇：Redis 核心结构体精讲》](https://juejin.cn/book/7144917657089736743/section/7147529654142763023)中，我们已经详细分析了 Sorted Set 数据类型的底层实现、命令使用以及应用场景，这一节，我们就来详细介绍一下 Sorted Set 相关的命令实现。

从实现角度，我们可以把 Sorted Set 相关的命令分为`单元素操作`和`范围查询`。

## 单元素操作

在 Sorted Set 中，我们最常用命令就是 `ZADD 命令`了，它对应的处理函数是 **zaddGenericCommand() 函数**，下面就来看看它的核心逻辑。

### 插入元素

首先，zaddGenericCommand() 解析并检查 ZADD 命令中各项参数，这里会将 NX、XX、GT 等参数转换成对应的临时变量，代码片段如下，后续会根据这些临时变量值调整 zaddGenericCommand() 函数的行为。

```c
int incr = (flags & ZADD_IN_INCR) != 0; // 新score会增加到原score中，而非覆盖

int nx = (flags & ZADD_IN_NX) != 0; // 只增加新元素，不更新已有元素

int xx = (flags & ZADD_IN_XX) != 0; // 只在元素存在时才会进行更新score

int gt = (flags & ZADD_IN_GT) != 0; // 新score大于原score才会更新，支持新增元素

int lt = (flags & ZADD_IN_LT) != 0; // 新score大小于原score才会更新，支持新增元素
```

接下来，zaddGenericCommand() 通过 lookupKeyWrite() 函数从 redisDb 中查找要写入的 Sorted Set 实例。如果查找失败，并且 ZADD 中携带了 XX 参数，也就是只有目标元素存在的时候，才能更新 score 值，现在这个 Sorted Set 集合都不存在，自然目标元素也就不存在了，这种情况下整个命令的执行就到此结束了。除了这种情况之外，这里都会创建新一个新的 Sorted Set 实例并记录到 redisDb 中。

在[第 26 讲《内核解析篇：Redis 核心结构体精讲》](https://juejin.cn/book/7144917657089736743/section/7147529654142763023)的介绍中提到，当 Sorted Set 中存储的元素个数小于 zset-max-listpack-entries 配置值（默认为 128），且每个键值对中的 Key 和 Value 长度都小于 zset-max-listpack-value 配置值（默认 64）的时候，Redis 使用 listpack 作为 Sorted Set 的底层存储的数据结构（编码方式为 OBJ_ENCODING_LISTPACK），否则 Sorted Set 底层数据结构使用 skiplist +dict（编码方式为 OBJ_ENCODING_SKIPLIST）。

所以，这里在创建 Sorted Set 实例的时候，**对第一个元素进行检查，决定 Sorted Set 的底层数据结构**，相关的代码片段如下：

```c
// zset-max-listpack-entries配置为0表示关闭了listpack优化

if (server.zset_max_listpack_entries == 0 ||

    // 只检查ZADD命令的第一个参数长度，不会检查全部参数

    server.zset_max_listpack_value < sdslen(c->argv[scoreidx+1]->ptr)) {

    zobj = createZsetObject(); // OBJ_ENCODING_SKIPLIST编码方式

} else {

    zobj = createZsetListpackObject(); // OBJ_ENCODING_LISTPACK编码方式

}

dbAdd(c->db,key,zobj); // 将新建的Sorted Set实例记录到DB中
```

**拿到 Sorted Sort 对象之后，zaddGenericCommand() 会循环调用 zsetAdd() 函数，将 ZADD 命令中指定的 score 和元素写入到 Sorted Set 中。**

zsetAdd() 函数根据 Sorted Set 的编码方式进入不同的处理分支。

`如果底层存储是 listpack 的话`，zsetAdd() 函数的关键逻辑如下图所示，其中免不了对 listpack 的迭代、查找、元素比较、插入和删除等操作，这些功能都封装在了 zzlFind()、zzlDelete() 、zzlInsert() 这些函数中，这些函数底层都是通过组合 listpack API 函数实现的。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c6a24f9faf640439a4b0a39ecf9d98d~tplv-k3u1fbpfcp-watermark.image?)

例如，zzlFind() 函数就是在迭代 listpack 的时候，不断比较元素值的方式查找元素位置以及关联 score 的位置；zzlInsert() 函数也是在迭代 listpack 的过程中，比较 score 值来确认插入位置的，找到插入位置之后，通过 zzlInsertAt() 函数完成新元素和 score 的插入。这些 listpack 的函数，小伙伴们可以回顾[前面的 listpack 小节](https://juejin.cn/book/7144917657089736743/section/7147529450140205056)，这里不再重复介绍了。

在这里有两个点需要说明一下。`一个是修改 score 值时`，并没有走 lpReplace() 的方式直接更新，而是先走 zzlDelete() 函数删除元素值和 score，然后再走 zzlInsert() 函数插入元素值和新 score 的方式，完成的 score 更新。

`另一个是在插入新元素之后`，如果要触发 OBJ_ENCODING_LISTPACK 到 OBJ_ENCODING_SKIPLIST 编码的转换，需要调用 zsetConvert() 函数来完成这一转换。zsetConvert() 函数的代码框架如下图所示:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f91bb9cfa3774c10b15e065b4c554196~tplv-k3u1fbpfcp-zoom-1.image)

具体转换逻辑其实并不复杂，以 OBJ_ENCODING_LISTPACK 转换为 OBJ_ENCODING_SKIPLIST 编码方式为例，其中核心的功能就是迭代原有 listpack 实例中的元素和 score 写入到新创建的 zset 实例中。zset 结构体中包含了 dict 和 zskiplist 两种数据结构，如下所示：

```c
typedef struct zset {

  dict *dict; // dict用来记录与元素到score之间的映射，可以快速获取指定元素的score值

  skiplist *zsl; // zskiplist按照score的顺序组织元素值，可以按照score进行各种范围操作

} zset;
```

所以，在 OBJ_ENCODING_LISTPACK 转换为 OBJ_ENCODING_SKIPLIST 编码方式的时候，我们可以看到写入 zset->dict 和 zset->zsl 的两个操作，代码片段如下：

```c
node = zslInsert(zs->zsl,score,ele); // 写入zset->zsl

serverAssert(dictAdd(zs->dict,ele,&node->score) == DICT_OK); // 写入zset->dict
```

在 OBJ_ENCODING_SKIPLIST 转换为 OBJ_ENCODING_LISTPACK 编码方式的时候，会直接将 zset->dict 释放，然后顺序迭代 zset->zsl 这个跳表，并将元素依次写入到新建的 listpack 实例中。

我们回到 zsetAdd() 函数，看底层是 OBJ_ENCODING_SKIPLIST 编码的分支，核心代码片段如下：

```c
if (zobj->encoding == OBJ_ENCODING_SKIPLIST) {

    zset *zs = zobj->ptr;

    zskiplistNode *znode;

    dictEntry *de;

    // 先会从 zset->dict 里面快速查找元素

    de = dictFind(zs->dict,ele);

    if (de != NULL) { // 从 dict 中能够查找到要插入的新元素，就会比较 score 值，

                        // 如果 score 发生变化，zsetAdd() 会更新 dict 中对应的 score ，

                        // 同时还会更新这个元素在 skiplist 中的位置

        if (nx) {

            *out_flags |= ZADD_OUT_NOP;

            return 1;

        }



        curscore = *(double*)dictGetVal(de);

        if (incr) {

            score += curscore;

            if (isnan(score)) {

                *out_flags |= ZADD_OUT_NAN;

                return 0;

            }

        }

        // 不需要

        if ((lt && score >= curscore) || (gt && score <= curscore)) {

            *out_flags |= ZADD_OUT_NOP;

            return 1;

        }



        if (newscore) *newscore = score;



        if (score != curscore) {

            znode = zslUpdateScore(zs->zsl,curscore,ele,score); // 更新节点位置

            dictGetVal(de) = &znode->score; /* Update score ptr. */

            *out_flags |= ZADD_OUT_UPDATED;

        }

        return 1;

    } else if (!xx) { // 如果查找失败，就向 zset 中的 dict 和 skiplist 插入新元素以及关联的 score 值

        ele = sdsdup(ele);

        znode = zslInsert(zs->zsl,score,ele);

        serverAssert(dictAdd(zs->dict,ele,&znode->score) == DICT_OK);

        *out_flags |= ZADD_OUT_ADDED;

        if (newscore) *newscore = score;

        return 1;

    } else {

        *out_flags |= ZADD_OUT_NOP;

        return 1;

    }

}
```

这里先会从 zset->dict 里面快速查找元素，如果查找失败，就向 zset 中的 dict 和 skiplist 插入新元素以及关联的 score 值，注意，在 zset 里面，元素值和 score 值是在 dict 和 skiplist 中共享的，而不是存了两份；如果 zsetAdd() 函数从 dict 中能够查找到要插入的新元素，就会比较 score 值，如果 score 发生变化，zsetAdd() 会更新 dict 中对应的 score ，同时还会更新这个元素在 skiplist 中的位置。在我们理解了 dict 和 skiplist 两个基础数据结构之后，这部分逻辑看起来就会非常简单了。

### 删除元素

接下来看删除元素的 `ZREM 命令`，其核心实现是 **zsetDel() 函数**，它会根据 Sorted Set 底层存储结构调用不同的方法进行删除，在 Sorted Set 被删成空集合时，会同时将其中 redisDb 中删除。

-   在 SortedSet 底层是 listpack 结构的时候，会走 lpDeleteRangeWithEntry() 函数删除两个 listpack 元素：一个是要删除的 Sorted Set 元素本身，另一个是其关联的 score 值。

-   在 Sorted Set 底层是 zset 结构的时候，zsetDel() 会使用 zsetRemoveFromSkiplist() 函数进行删除，这个函数会先将元素从 zset->dict 中删除，然后从 zset->zsl 跳表中删除元素，在从 skiplist 中删除的时候，才是真正释放元素空间的时候。

### 其他命令实现

再来看 ZCARD 和 ZCOUNT 这两条命令。

`ZCARD 命令`用于统计整个 Sorted Set 集合中的元素个数，核心位于 **zsetLength() 函数**：如果 Sorted Set 底层数据结构为 listpack，则 Sorted Set 长度为 listpack 的长度除以 2；如果 Sorted Set 底层数据结构为 zset，则 Sorted Set 长度为 zset->zsl 跳表的长度。

`ZCOUNT 命令`用于计算指定 score 范围内的元素个数，对应的处理函数是 **zcountCommand()**，它会先将命令中的 MIN 和 MAX 参数解析成 zrangespec 实例：

```c
typedef struct {

    double min, max; // 范围的最大值和最小值

    int minex, maxex; // min和max值是否包含在内

} zrangespec;
```

然后，根据底层数据结构进入不同处理分支。

-   如果 Sorted Set 底层为 listpack，那么元素在 listpack 中是按照其关联 score 进行排序的，这里会从头开始遍历 listpack 找到第一个位于 zrangespec 范围内的元素，然后从该元素继续迭代，迭代结束的条件是碰到第一个超出 zrangespec 范围的元素，这样我们就可以统计出 zrangespec 范围内的元素个数了。

-   如果 Sorted Set 底层为 zset，则是依靠 zset->zsl 跳表进行查找。ZCOUNT 命令首先调用 zslFirstInRange() 函数查找跳表中第一个符合 zrangespec 范围的元素，然后通过 zslLastInRange() 函数查找跳表中最后一个符合 zrangespec 范围的元素，最后将两个元素在跳表中的位置（也就是 rank 字段）相减，就得到了两者之间的元素个数。

最后，我们再来看 ZRANK、ZSCORE 这两条命令。

`ZRANK 命令`用于获取指定元素在 zset 的排名（也就是 rank 字段的值），Sorted Set 底层无论使用 listpack 还是 skiplist，都是一个按照 score 排列的有序集合，所以我们只需要遍历 listpack 或 skiplist 即可得到指定元素的 rank 值。

`ZSCORE 命令`用于获取指定元素的 score 值。如果 Sorted Set 底层结构为 zset，则可以直接通过 zset->dict 字典获取指定元素的 score 值；如果 Sorted Set 底层结构为 listpack，则需要从头遍历 ziplist 才能行。

## 范围查询

除了上述基础命令，Sorted Set 作为一个有序队列，使用频率较高的命令是范围查询命令，例如 ZRANGE、ZRANGESTORE、ZREVRANGE 等。**在 6.2.0 版本之后，ZRANGE 命令变的非常强大**，通过 ZRANGE 及其子命令的组合可以实现 ZREVRANGE、ZRANGEBYSCORE、ZREVRANGEBYSCORE、ZRANGEBYLEX、ZREVRANGEBYLEX 等一系列命令的功能。所以我们这里将会重点介绍 ZRANGE 命令的实现。

在开始正式分析 ZRANGE 命令的实现之前，我们需要先来了解一个**辅助结构体 zrange_result_handler**，其定义如下，其中**记录了范围查询使用到的字段和函数指针，与面向对象编程中的接口有点类似**。

下面是 zrange_result_handler 结构体的定义：

```c
struct zrange_result_handler {

    // type字段记录了当前范围查询的类型，有CLIENT和INTERNAL两种类型，

    // 其中CLIENT表示查询的结果直接返回给客户端，INTERNAL表示查询结果集会存储

    // 到dstkey指定的集合中

    zrange_consumer_type type; 

    // client字段指向了发起请求的客户端

    client *client;

    // 如果type字段为INTERNAL类型，则dstkey和dstobj分别用来记录存储查询

    // 结果的Key和集合

    robj *dstkey;

    robj *dstobj;

    void *userdata;

    // withscores字段标识了查询结果是否需要返回元素对应的score

    int withscores;

    int should_emit_array_length;

    // beginResultEmission指向了范围查询开启前需要调用的准备函数

    zrangeResultBeginFunction beginResultEmission;

    // finalizeResultEmission指向了范围查询结束时需要调用的首尾函数

    zrangeResultFinalizeFunction finalizeResultEmission;

    // emitResultFromCBuffer和emitResultFromLongLong也是两个函数指针，

    // 定义了如何处理查询到的元素值，emitResultFromLongLong是元素值为整数时的处理逻辑，

    // emitResultFromCBuffer是处理元素值无法转成整数时的处理逻辑

    // 例如，type为CLIENT时，emitResultFromCBuffer会将查询的元素值和score返回给客户

    // 端，type为INTERNAL时，emitResultFromCBuffer则是将查询到的元素和score存储到

    // dstkey指定的集合中

    zrangeResultEmitCBufferFunction emitResultFromCBuffer;

    zrangeResultEmitLongLongFunction emitResultFromLongLong;

};
```

明确了辅助类的功能之后，我们下面正式开始介绍 ZRANGE 命令底层的 **zrangeGenericCommand() 函数**，其核心逻辑如下。

首先是要解析 ZRANGE 命令中的各个参数。

-   通过 BYSCORE、BYLEX 参数确定后续 MIN 和 MAX 参数的具体含义，BYSCORE 表示的是查询 score 在 min ~ max 之间的元素；BYLEX 表示的是查询元素值在 min ~ max 之间的元素，使用 BYLEX 需要所有元素的 score 值相同；如果没有指定 BYSCORE、BYLEX 子命令，则默认查询 RANK 排名在 min ~ max 之间的元素。下面是一个具体示例：

```c
ZRANGE key 98 100 BYSCORE  // 查询score在98到100之间的元素

ZRANGE key a d BYLEX  // 按照字典序查询元素值在a到d之间的的元素

ZRANGE key 1 10  // 查询排名（rank）在1到10之间的元素
```

这部分参数的解析结果会记录到 rangetype 临时变量中，可选值有 ZRANGE_SCORE、ZRANGE_LEX、ZRANGE_RANK，分别对应上述三种不同的范围确定方式。

-   REV 参数逆序查询，其解析结果记录到 direction 临时变量中，可选值有 ZRANGE_DIRECTION_FORWARD、ZRANGE_DIRECTION_REVERSE 两种，分别表示正序和逆序。

-   LIMIT 参数指定了偏移量和查询结果集中元素个数的上限，解析结果记录到 opt_limit 和 opt_offset 临时变量中。
-   WITHSCORES 参数表示除了返回元素本身，还会同时返回对应的 score 值。解析结果记录到 opt_withscores 临时变量中。

这些参数可以相互组合，但是也会有一些冲突，例如，LIMIT 参数只能和 BYSCORE 或 BYLEX 子命令一起使用，WITHSCORES 参数不能和 BYLEX 一起使用，这些冲突检查也会在这个解析过程中一并检查。

**参数解析完成之后，接下来就根据解析得到的 rangetype 以及 direction 信息，确定查询范围**。

首先，如果是逆序查询，则参数中的 MIN 值和 MAX 值需要先进行互换。然后，根据不同的 rangetype 类型，将 MIN 和 MAX 值解析成对应的查询范围。例如，如果 rangetype 为 ZRANGE_SCORE（也就是按照 score 值进行范围查找），表示 min 和 max 的含义为 score 值， 就会通过 zslParseRange() 函数这两个 score 值封装成 zrangespec 实例。这个解析过程是为了识别命令中的开区间、闭区间配置，例如下面这种包含开闭区间的命令：

```c
ZRANGE key (98 100 BYSCORE  // 查询score在98到100之间的元素，不包含score的值98
```

参数含义和查询范围确定之后，就可以**从 redisDb 中获取此次查询的目标 Sorted Set 实例**。如果 Sorted Set 不存在，则此次 ZRANGE 命令立刻结束。查找到目标 Sorted Set 之后，就可以根据 rangetype 类型执行不同的范围查询逻辑，相关代码片段如下：

```c
switch (rangetype) {

case ZRANGE_AUTO:

case ZRANGE_RANK: // 按照rank进行范围查询

    genericZrangebyrankCommand(handler, zobj, opt_start, opt_end,

        opt_withscores || store, direction == ZRANGE_DIRECTION_REVERSE);

    break;



case ZRANGE_SCORE: // 按照score进行范围查询

    genericZrangebyscoreCommand(handler, &range, zobj, opt_offset,

        opt_limit, direction == ZRANGE_DIRECTION_REVERSE);

    break;



case ZRANGE_LEX: // 按照字典熟悉怒进行范围查询

    genericZrangebylexCommand(handler, &lexrange, zobj, 

        opt_withscores || store, opt_offset, opt_limit, 

            direction == ZRANGE_DIRECTION_REVERSE);

    break;

}
```

这里以 genericZrangebyscoreCommand() 函数为例进行分析，它首先会调用 zrange_result_handler->beginResultEmission() 函数，如果当前执行的是 ZRANGESTORE 这种需要存储结果集的命令，实际调用的是 zrangeResultBeginStore() 函数，其中会创建存储结果集的 Sorted Set 实例，并把结果集记录到 zrange_result_handler->dstobj 字段中。这部分代码片段如下：

```c
void genericZrangebyscoreCommand(zrange_result_handler *handler,

    zrangespec *range, robj *zobj, long offset, long limit, 

    int reverse) {

    unsigned long rangelen = 0;



    // 如果当前执行的是 ZRANGESTORE 这种需要存储结果集的命令，

    // 实际调用的是 zrangeResultBeginStore() 函数，

    // 其中会创建存储结果集的 Sorted Set 实例，

    // 并把结果集记录到 zrange_result_handler->dstobj 字段中

    handler->beginResultEmission(handler, -1); 



    if (offset > 0 && offset >= (long)zsetLength(zobj)) {

        handler->finalizeResultEmission(handler, 0);

        return;

    }

    if (zobj->encoding == OBJ_ENCODING_LISTPACK) {

        ...

    } else if (zobj->encoding == OBJ_ENCODING_SKIPLIST) {

        ...

    }

}
```

接下来， genericZrangebyscoreCommand() 函数会根据 Sorted Set 底层存储结构进入不同的处理分支，但无论 Sorted Set 底层是 listpack 还是 skiplist，都是一个按照 score 排列的有序集合，所以大致逻辑类似，都是先定位到第一个查询范围内的元素，然后按照迭代方向继续迭代有序集合，直至找到最后一个符合条件的元素即可。

这里需要说明的是，在迭代到符合条件的元素时，会调用 zrange_result_handler 中的 emitResultFromCBuffer() 函数或 emitResultFromLongLong() 函数进行处理。如果当前执行的是 ZRANGESTORE 等`需要存储结果集`的命令，则实际调用的是 zrangeResultEmitCBufferForStore() 和 zrangeResultEmitLongLongForStore() 函数，其中会通过 zsetAdd() 将符合条件的元素写入到 zrange_result_handler->dstobj 字段记录的 Sorted Set 实例中。

如果`不需要存储结果`，就调用 zrangeResultEmitCBufferToClient() 和 zrangeResultEmitLongLongToClient() 函数，直接把结果返回给客户端。

在完成范围查询之后，最后需要调用 zrange_result_handler ->finalizeResultEmission() 函数进行善后处理，ZRANGESTORE 命令对应的是 zrangeResultFinalizeStore() 函数，其中会将 dstobj 字段记录的 结果集写入到 redisDb 中，其中的 Key 值由 dstkey 字段指定。如果执行的是 ZRANGE 等不需要存储查询结果集的命令，则走 zrangeResultFinalizeClient() 函数，把前面返回的元素个数（以及 score 元素个数）返回给客户端。

下面用一张流程图简单总结一下 genericZrangebyscoreCommand() 函数执行的核心流程，genericZrangebyscoreCommand() 函数规定了范围查询的流程框架，zrange_result_handler 通过函数指针的方式填充了具体命令的差异，有种`模板方法模式`的感觉。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03702ad20662466388c73b4f4840c4db~tplv-k3u1fbpfcp-watermark.image?)

分析到这里，ZRANGE 命令的核心逻辑就介绍完了。Sorted Set 中其他范围查询命令的实现逻辑与 ZRANGE 命令的实现大同小异，这里就不再一一展开分析了。

## 总结

在这一节中，我们重点介绍了 Sorted Set 中的核心命令实现，主要分成了单元素的插入和删除实现，以及范围查询的实现。这里我们尤其`重点关注 Sorted Set 底层，使用不同存储时，会进入不同的分支进行处理`。

下一节，我们将来介绍一下 Redis 中事务的实现。