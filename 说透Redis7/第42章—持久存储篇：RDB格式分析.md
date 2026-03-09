在上一节中，我们介绍了 RDB 文件持久化的关键流程，其中涉及到触发 RDB 持久化的条件、RIO 层的抽象以及写入 RDB 文件的流程框架以及相关优化点。


这一节，我们就开始深入 rdbSaveRio() 函数，详细分析一下 RDB 文件写入的具体流程，在分析具体代码实现的同时，我们还会介绍一下 RDB 文件的组成结构。


## OpCode

在 RDB 文件中，有一个 OpCode 的概念，说白了就是一些特殊字节，这些字节用来表示紧跟其后一段字节存储的是什么内容。

下面是我们需要重点关注的几个 OpCode：

| **OpCode** | **Desc**                                                       |
| ---------- | -------------------------------------------------------------- |
| 0xFA       | 在 0xFA 后面紧跟的是一个 AUX 键值对，用来在 RDB 文件头中记录一些元数据信息                  |
| 0xFE       | 在 0xFE 后面紧跟的是数据库的编号，用来标记后续数据归属的 redisDb                        |
| 0xFB       | 在 0xFB 后面紧跟的是数据库中 Key 的个数以及设置了过期时间的 Key 的个数                    |
| 0xFD、0xFC  | 这两个 OpCode 后面紧跟的是 Key 的过期时间，0xFD 后面紧跟的是秒级时间戳，0xFC 后面紧跟的是毫秒级时间戳 |
| 0xF8、0xF9  | 0xF8 后面紧跟的是 LRU 内存淘汰策略下的秒级空闲时间，0xF9 后面紧跟的是 LFU 内存淘汰策略下的访问频率    |
| 0xFF       | RDB 文件的结束符                                                     |
| 0xF5       | 在 0xF5 后面紧跟的是一个 Function 的内容                                   |

  


在后面的分析中我们会看到，**RDB 文件中最基本的格式就是：一个 OpCode 字节，然后紧跟一段负载数据**。如下图所示:


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f96a7405f7459ca35fe38632cf725c~tplv-k3u1fbpfcp-watermark.image?)


下面来简单看一下 rdbSaveRio() 函数写入 RDB 的核心逻辑以及整个 RDB 文件的格式。RDB 文件的格式大致可以分为文件头部分、数据部分、文件结尾部分。


## RDB 文件头

RDB 的文件头部分可以大致分为**魔数**、**AUX 元数据**两部分。

魔数默认是 “REDIS” 字符串，紧跟其后的是 RDB 的版本号，是一个四位的字符串，Redis 7 中使用的RDB 版本是 “0010”。写入到 RDB 文件中的格式如下：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a330fefe5c5e485a92d511c889091278~tplv-k3u1fbpfcp-watermark.image?)

写入 RDB 魔数以及版本号的代码如下，其中，rdbWriteRaw() 函数是直接通过前文介绍的 rioWrite() 函数完成写入的：

```c
snprintf(magic,sizeof(magic),"REDIS%04d",RDB_VERSION);
if (rdbWriteRaw(rdb,magic,9) == -1) goto werr;
```

> 小伙伴如果对 RDB 各个版本迭代感兴趣，可以参考[这篇文档](https://github.com/sripathikrishnan/redis-rdb-tools/blob/master/docs/RDB_Version_History.textile)，其中介绍了每次 RDB 版本升级时的改进。


RDB 文件头的第二部分是 AUX 键值对部分，写入逻辑位于 rdbSaveInfoAuxFields() 函数中。AUX 键值对其实就是一些辅助字段，主要包含如下。

-   redis-ver：Redis 的准确版本号，例如我们分析的 7.0.0 版本。
-   redis-bits：当前生成的 RDB 文件的机器是 64 位还是 32 位机器。
-   ctime：RDB 文件的创建时间。
-   used-mem：当前 Redis 实例使用内存大小。
-   aof-base：当前这个 RDB 文件是不是混合持久化的一部分。
-   还有一些主从复制相关的内容，这里就不展开一一介绍了。


写入单个 AUX 键值对的逻辑位于 rdbSaveAuxField() 函数中，其中会先写入 0xFA 这个 OpCode，然后再写入 AUX Key 和 AUX Value 值，写入之后的效果如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aaf7dca545de4435b5153ead62cdcade~tplv-k3u1fbpfcp-watermark.image?)



这里要介绍一下 RDB 文件对长度值和字符串的编码方式。


**RDB 采用变长的方式来编码`长度值`**，具体实现位于 rdbSaveLen() 函数中，它使用第一个 byte 作为标识，具体规则如下：

-   如果一个长度值在 [0, 63] 这个范围，RDB 会用一个字节来存储，其中高 2 位作为标识位，填充 00。

-   如果一个长度值在 [64, 16383] 这个范围，RDB 会用两个字节来进行存储，其中第一个字节的高两位填充 01 作为标识，第一个字节的剩余 6 位以及第二个字节，一起表示一个整数。
-   如果长度值在 [16384, 2^32-1] 这个范围，RDB 会用 5 个字节来进行存储，其中第一个字节填充 0x80 作为标识，使用接下来的 4 个字节表示一个 32 位的整数。
-   如果长度值在 [2^32, 2^64-1] 这个范围，RDB 会用 9 个字节来进行存储，其中第一个字节填充 0x81 作为标识，使用接下来的 8 个字节表示一个 64 位的整数。


RDB 中的长度编码方式主要是用来表示字符串长度、元素个数等等，而这些值大概率不会特别大，所以通过上述变长的编码方式，可以有效减小整数所占字节数。按照长度编码方式写入长度信息的逻辑位于 rdbSaveLen() 函数，感兴趣的同学可以看一下代码。


接下来看 **RDB 对`字符串`的编码方式**，目前有三种编码方式，分别是：长度前缀编码方式、整型编码方式、LZF 压缩编码方式。这三种编码方式有个相同点，就是都先以整数来表示字符串长度，然后紧跟具体存储的字符串。

-   **长度前缀编码方式**的特点是第一个字节最高 2 位为 00、01、10（0x80 和 0x81 的高两位就是 10），也就是上面介绍长度编码方式，然后根据长度编码方式确定字符串长度之后，后面才是字符串的真正内容。例如上面 AUX 中 redis-ver 这个 Key，在 0xFA 这个 OpCode 之后，紧跟的是 0x09，最高 2 位为 00，也就是当前剩余 6 位表示整数，那么后面紧跟的 9 个字节就是字符串的真正内容。

-   **整型编码方式**的特点是用来存储一个整型的字符串，它第一个字节的最高 2 位为 11 ，这样就和长度值区分开了。整型编码中第一字节剩余 6 位的可选值有 0、1、2，分别表示它之后紧跟一个 8、16、32 位的整数，分别使用一字节、两字节、四字节进行存储。例如，上面 AUX 中 redis-bits 对应的 Value 值 64，64 这个值本身用一个字节存储就可以了，所以这个 Value 在 RDB 中总共占 2 个字节，第一个字节是 0xC0（1100 0000）标识字节，第二个字节是 64 这个值本身。
-   **LZF 压缩编码方式**的特点是第一个字节中高 2 位是 11 ，剩余 6 位构成的数字为 3，然后使用长度编码方式存储两个整数，一个是压缩后的字符串长度（compress_len），一个是压缩前的字符长度（original_len），最后紧跟 compress_len 个字节来存储压缩后的字符串。在读取的时候，就可以通过压缩前后的长度以及压缩后的字符串内容，还原压缩前的字符串。

写入字符串的逻辑位于 rdbSaveRawString() 函数中，如下图调用栈所示，如果是按照长度前缀方式写入字符串，会先调用 rdbSaveLen() 函数写入长度信息，然后通过 rdbWriteRaw() 函数写入真正的字符串；如果按照整型编码方式写入，则通过 rdbTryIntegerEncoding() 进行整数编码，并通过 rdbWriteRaw() 函数完成写入；如果是按照 LZF 压缩编码方式写入，则通过 rdbSaveLzfStringObject() 函数进行压缩。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68caef671a1d4f19a18f72e6d93e76a8~tplv-k3u1fbpfcp-zoom-1.image)

另外，要使用 LZF 对字符串进行压缩，需要满足两个条件，一个是开启 rdbcompression 配置项（默认开启），另一个是字符串长度要超过 20。相关的代码片段如下：

```c
// 检查rdbcompression配置项是否开启，以及字符串本身是否超过了20个字符
if (server.rdb_compression && len > 20) { 
    n = rdbSaveLzfStringObject(rdb,s,len);
    if (n == -1) return -1;
    if (n > 0) return n;
    // rdbSaveLzfStringObject()返回0，表示无法进行压缩，后面会使用长度前缀编码方式进行存储
}
```



## RDB 数据部分

紧跟在 RDB 文件头之后的部分是 RDB 数据区域的部分。

在 rdbSaveRio() 函数中，如下所示，我们看到写入 Module AUX 的 rdbSaveModulesAux() 函数以及写入 Function 代码的 rdbSaveFunctions() 函数，Redis Funtion 相关的内容我们在后面单独用一节进行介绍。

```c
int rdbSaveRio(int req, rio *rdb, int *error, int rdbflags, rdbSaveInfo *rsi) {
    ... // 省略非关键代码
    if (server.rdb_checksum)
        rdb->update_cksum = rioGenericUpdateChecksum;
    snprintf(magic,sizeof(magic),"REDIS%04d",RDB_VERSION);
    // 1、写入魔数
    if (rdbWriteRaw(rdb,magic,9) == -1) goto werr;
    // 2、写入AUX元数据
    if (rdbSaveInfoAuxFields(rdb,rdbflags,rsi) == -1) goto werr;
    // 3、写入Module AUX元数据和Function信息
    if (!(req & SLAVE_REQ_RDB_EXCLUDE_DATA) && rdbSaveModulesAux(rdb, REDISMODULE_AUX_BEFORE_RDB) == -1) goto werr;
    if (!(req & SLAVE_REQ_RDB_EXCLUDE_FUNCTIONS) && rdbSaveFunctions(rdb) == -1) goto werr;

    // 4、核心for循环，这个 for 循环会遍历 Redis 中的全部数据库，
    // 通过 rdbSaveDb() 函数将每个数据库中的键值对数据，全部写入到 RDB 文件的数据部分
    if (!(req & SLAVE_REQ_RDB_EXCLUDE_DATA)) {
        for (j = 0; j < server.dbnum; j++) {
            if (rdbSaveDb(rdb, j, rdbflags, &key_counter) == -1) goto werr;
        }
    }
    if (!(req & SLAVE_REQ_RDB_EXCLUDE_DATA) && rdbSaveModulesAux(rdb, REDISMODULE_AUX_AFTER_RDB) == -1) goto werr;
    // 5、写入EOF标识
    if (rdbSaveType(rdb,RDB_OPCODE_EOF) == -1) goto werr;
    cksum = rdb->cksum;
    memrev64ifbe(&cksum);
    // 6、写入校验码
    if (rioWrite(rdb,&cksum,8) == 0) goto werr;
    return C_OK;
}
```

接下来，在 rdbSaveRio() 函数中可以看到一个 for 循环，这个 for 循环会遍历 Redis 中的全部数据库，通过 rdbSaveDb() 函数将每个数据库中的键值对数据，全部写入到 RDB 文件的数据部分。在每次 for 循环中，rdbSaveDb() 会先写入 Redis 中第一个数据库的编号，以我们最常用的 0 号 redisDb 为例，在这里就会先写入 0xFE 这个 OpCode ，然后按照长度编码方式，写入数字 0。



写完 0 这个 redisDb 的编号之后，就可以开始写入第一个数据库的容量信息，rdbSaveDb() 会先写入 0xFB ，然后按照长度编码方式写入该 redisDb 中 Key 的个数以及设置了过期时间的 Key 的个数。下图展示了编号为 0 的 redisDb 中，总共有 10 Key，其中有 5 个 Key 设置了过期时间的场景下，持久化到 RDB 文件时的格式：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf717c303c7a4b3b9f5d554aa3c51b18~tplv-k3u1fbpfcp-watermark.image?)


完成的数据库编号和容量的写入之后，rdbSaveDb() 会调用 rdbSaveKeyValuePair() 函数，把 redisDb->dict 集合中的全部键值对数据，写入到 RDB 文件中。在 RDB 文件中，一个键值对由 5 部分组成，按照写入顺序依次如下。


**第一部分，Key 过期时间**。如果 Key 设置了过期时间，则需要在 RDB 中存储其过期时间戳。在 Redis 7 版本中，写入过期时间都是以毫秒为单位，所以这里是以 0xFC 开头，之后的 8 个字节用来存储 Key 的毫秒级过期时间。


**第二部分，LRU/LFU 信息**。如果当前开启了内存淘汰策略，则需要将 Value 中 lru 字段记录的信息持久化到 RDB 中。如果当前使用的是 LRU 淘汰策略，则先写入 0xF8 这个 OpCode 作为开头，紧跟在其后的就是长度编码方式得到的秒级空闲时间戳；如果当前使用的是 LFU 淘汰算法，则先写入 0xF9 这个 OpCode 作为开头，紧跟在其后的就是 lru 字段中存储的访问频率。如果未开启内存淘汰，则没有这部分信息。


**第三部分，Value 类型**。这里写入一个 1 字节来作为 Value 类型的标识符，下表展示了所有 Redis Value 类型对应的标识符：

| **value 类型标识** | **宏**                                                         | **对应的 value 类型**                              |
| -------------- | ------------------------------------------------------------- | --------------------------------------------- |
| 0              | RDB_TYPE_STRING                                               | String 类型                                     |
| 18（旧版本用 14）    | RDB_TYPE_LIST_QUICKLIST_2（旧版本对应 RDB_TYPE_LIST_QUICKLIST）     | Quicklist 类型                                  |
| 2              | RDB_TYPE_SET                                                  | Set 类型                                        |
| 11             | RDB_TYPE_SET_INTSET                                           | Intset 类型                                     |
| 5（旧版本用 3）      | RDB_TYPE_ZSET_2（旧版本对应 RDB_TYPE_ZSET）                         | ZSet 类型                                       |
| 17（旧版本用 12）    | RDB_TYPE_ZSET_LISTPACK（旧版本对应 RDB_TYPE_ZSET_ZIPLIST）           | ZSet in listpack 类型（旧版本对应 ZSet in Ziplist 类型） |
| 4              | RDB_TYPE_HASH                                                 | Hash 类型                                       |
| 16（旧版本用 13）    | RDB_TYPE_HASH_LISTPACK（旧版本对应 RDB_TYPE_HASH_ZIPLIST）           | Hash in listpack 类型（旧版本对应 Hash in Ziplist 类型） |
| 19（旧版本用 15）    | RDB_TYPE_STREAM_LISTPACKS_2（旧版本对应 RDB_TYPE_STREAM_LISTPACKS） | Stream 类型                                     |
| 7（旧版本用 6）      | RDB_TYPE_MODULE_2（旧版本对应 RDB_TYPE_MODULE）                     | Module 类型                                     |

  


**第四部分，Key 值**。使用字符串编码方式存储 Key 值。

**第五部分，Value 值**。依据上面的 Value 类型，使用不同的编码方式存储 Value 类型。


在键值对的这 5 部分中，字符串的编码方式已经详细介绍过了，下面我们一起来分析一下其他类型的编码方式。


首先来看 listpack 的编码。listpack 是多个 Redis 类型的底层结构，所以这里先来看 `listpack` 数据结构的编码方式。在 rdbSaveObject() 函数中我们可以看到，Redis 会按照字符串的方式编码写入一个 listpack。上表中的ZSet in listpack 类型、Hash in listpack 类型以及 Quicklist 类型的底层都可能使用 listpack 作为底层存储结构。


下面以 quicklist 为例简单分析一下。通过下面 rdbSaveObject() 函数的代码可以看出，Redis 会先按照长度编码方式写入 quicklist 中的节点个数，然后写入每个节点的 listpack，这里会写入两部分，第一部分是当前节点是否为压缩节点，第二部分才是按照字符串编码方式写入节点中的 listpack。需要注意的是，如果遇到压缩节点，RDB 不会解压，而是直接按照 LZF 压缩字符串的编码方式将整个压缩节点写入到 RDB 文件中；如果是普通节点，则按照正常的字符串编码方式处理整个 quicklistNode 节点中的数据并写入到 RDB 文件中，如果普通节点中的 listpack 超过了 20 个字节，且当前开启了 rdbcompression 配置项，写入的时候就需要进行 LZF 压缩。

```c
ssize_t rdbSaveObject(rio *rdb, robj *o, robj *key, int dbid) {
    ssize_t n = 0, nwritten = 0;
    if (o->type == OBJ_STRING) { // 写入一个字符串类型的Value
        if ((n = rdbSaveStringObject(rdb,o)) == -1) return -1;
        nwritten += n;
    } else if (o->type == OBJ_LIST) { // 写入一个quicklist类型的Value
        if (o->encoding == OBJ_ENCODING_QUICKLIST) {
            quicklist *ql = o->ptr;
            quicklistNode *node = ql->head;
            // 先写入quicklist中的节点个数
            if ((n = rdbSaveLen(rdb,ql->len)) == -1) return -1;
            nwritten += n;

            while(node) { // 循环写入每个节点
                // 写入当前节点的压缩状态
                if ((n = rdbSaveLen(rdb,node->container)) == -1) return -1;
                nwritten += n;
                if (quicklistNodeIsCompressed(node)) { // 压缩节点
                    void *data;
                    size_t compress_len = quicklistGetLzf(node, &data);
                    // 不解压，直接把压缩好的listpack按照LZF格式，写入到RDB
                    if ((n = rdbSaveLzfBlob(rdb,data,compress_len,node->sz)) == -1) return -1;
                    nwritten += n;
                } else { // 没有压缩的普通节点
                    // 按照字符串编码格式写入listpack，其中可能触发压缩
                    if ((n = rdbSaveRawString(rdb,node->entry,node->sz)) == -1) return -1;
                    nwritten += n;
                }
                node = node->next;
            }
        }        
    } else if (o->type == OBJ_SET) { // 省略其他数据类型写入逻辑
    } else if (o->type == OBJ_ZSET) { 
    } else if (o->type == OBJ_HASH) {
    } else if (o->type == OBJ_STREAM) {
    } else if (o->type == OBJ_MODULE) {
    } else {
        serverPanic("Unknown object type");
    }
    return nwritten;
}
```



Set 类型（RDB_TYPE_SET）的编码方式与 Quicklist 类型的编码方式基本类似，也是先写入 dict 中键值对的个数，然后迭代 dict 将 Key 按照字符串编码方式写入到 RDB 文件中。如果 Set 底层结构是 intset，对应的是 Intset 类型（OBJ_ENCODING_INTSET）的编码方式，它会直接将 intset 按照字符串的编码方式进行写入。


ZSet 底层使用 listpack 进行存储时（RDB_TYPE_ZSET_LISTPACK），会直接按照上述 listpack 的方式进行编码并存储。ZSet 底层使用 skiplist 结构的时候（RDB_TYPE_ZSET_2），会先按照长度编码方式写入 skiplist 中的元素个数，然后写入 skiplist 中的每个元素，其中会按照字符串编码方式写入元素值，后面紧跟其对应的 score 值（double 值）。注意，这里写入 skiplist 的时候是从后向前写入的，这样在读取的时候，每次读取到的值都比之前的大，使用头插法完成插入，就可以得到一个有序的 skiplist 了。



Hash 底层使用 listpack 结构时（RDB_TYPE_HASH_ZIPLIST），会直接按照 listpack 方式进行编码并存储。Hash 底层使用 dict 存储的时候（RDB_TYPE_HASH），会先按照长度编码方式写入 dict 中的键值对个数，然后按照字符串编码方式写入 dict 中的 Key 和 Value。


Stream 的编码方式是先写入到 rax 树的节点树，然后使用字符串编码方式，写入每个节点的 Key 和对应的 listpack。除此之外，还需要将 Consumer Group 的信息一并持久化，因为 Stream 的使用和结构还没有深入介绍过，所以这部分内容暂时不展开介绍，感兴趣的同学可以参考 rdbSaveObject() 函数中的代码进行学习。



## RDB 文件结尾部分

在将全部数据库都写入完成之后，rdbSaveRio() 函数会开始写入 RDB 文件的结尾部分，其中包含了 RDB 文件结束符，也就是前文介绍的 `0xFF OpCode，以及一个 8 字节的校验和`。

到此为止，RDB 文件的核心结构我们就分析完了，最后，我们通过一张图来看一下 RDB 文件的完整格式：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/868e3393ce9d4bcdba9c2217479f306c~tplv-k3u1fbpfcp-watermark.image?)

## 总结

这一节中，我们重点分析了 RDB 文件的格式。

-   首先，我们介绍了 RDB 文件中最基本的格式，就是：一个 OpCode 字节，然后紧跟一段负载数据。
-   接下来，我们将 RDB 文件拆分成了文件头、数据内容以及文件尾三部分进行介绍，文件头中记录了一些元数据；数据部分记录了 Redis 中存储的真正数据，这里我们还详细介绍了每种数据类型的编码方式；结尾部分包含了文件结束符和校验码。
-   最后，我们给出了一个相对完整的 RDB 文件结构图，来帮助小伙伴们回顾整节的内容。


下一节，我们将一起来分析一下 RDB 持久化是如何在后台执行的。