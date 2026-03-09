在前面“数据结构篇”模块中，我们详细介绍了 Redis 底层依赖的数据结构以及操作这些数据结构的核心函数。

从本节开始，我们将介绍 Redis Server 的核心结构体，主要有 5 个：redisObject 是对所有 Redis Value 的封装，redisServer 是对 Redis 服务器的抽象，redisDB 表示的是对单个 Redis DB，client 抽象的是一个 Redis 客户端，redisCommand 则是 Redis 的命令。

这 5 个核心结构体分别`表示 Redis 的数据、服务器、DB、客户端和命令，形成了一个有机的整体`。

## redisObject

在 Redis 中有一个非常重要的结构体 —— robj，全称 redisObject，它`用来表示一个 Redis 对象`。虽然很多资料都说 C 语言没法做到真正意义的面向对象编程，但是我认为这种争论和分类是没什么意义的，你看 Redis 的 C 代码，照样能通过结构体等 C 的语法，实现面向对象的思想。

我们回到 robj 继续介绍，Redis 中 Key 只能是字符串类型，Value 可以是 sds、list、set、zset 以及 dict 等数据结构，这些 Value 值并不会直接存储在 redisDb 里面，而是**包装成 robj 对象再进行存储**。下图大概展示了这种结构：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a963ea06464476080b372b53a29f14b~tplv-k3u1fbpfcp-watermark.image?)

下面来看 robj 的核心字段及其含义，弄清了它们的含义，也就了解了`为何要使用 robj 对 value 值进行一层额外的包装`。

-   **type 字段**：占用 4 个 bit 位，指定了 robj 包装数据的具体类型，具体可选值有 OBJ_STRING、OBJ_LIST、OBJ_SET、OBJ_ZSET、OBJ_HASH，对应的是前面介绍的 Redis 底层数据结构。

-   **encoding 字段**：占用 4 个 bit 位，指定了 robj 包装数据的编码方式。对于相应的数据类型（即 type 值相同），因为存储的具体数据有所差异，对应的 encoding 编码方式也有所不同。
-   **lru 字段**：占用 24 个 bit 位，用来记录 LRU 的相对时间，在后面使用的时候会展开说。
-   **refcount 字段**：int 类型，用来记录当前 orbj 实例被引用的次数。有的时候，我们需要创建一个共享的 robj 对象，每新增一个使用方引用这个公共 robj 对象的时候，refcount 值就会加 1；每当引用减少一个的时候，refcount 值就会减 1；当 refcount 减到 0 的时候，就表示没人再使用这个 robj 对象了，也就可以释放这个公共 robj 对象的空间了。在效果上，这与我们 Java 里面的 GC 有点类似。
-   **ptr 字段**：void* 指针类型，用来执行 robj 底层包装的真正数据。

下面我们重点展开介绍一下 encoding 这个字段，每一种 encoding 取值，就表示了一种数据组织形式，我们也叫“编码方式”，其实对应的就是底层数据的存储方式。

**当一个 robj 里面包装的是字符串数据的时候，robj 的 type 字段固定为 `OBJ_STRING`**，此时，相应的 encoding 值可能出现下面三种。

-   **OBJ_ENCODING_INT**：表示存的这个字符串值能够转换成整数。OBJ_ENCODING_INT 编码方式是直接将字符串转换成整数值，并存储到 ptr 字段中（void* 指针占 8 字节，整数最长也是 8 字节），从而少创建一个 sdshdr 字符串实例，降低内存开销，在读取数据的时候，也少了一跳指针解析。比如存 1000 这个字符串，结构就如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbfe43496a194bf79eb61ab2c869abe1~tplv-k3u1fbpfcp-watermark.image?)

-   **OBJ_ENCODING_EMBSTR**：在 CPU 从内存读取数据到高速缓存的时候，即使我们的目标值只有一个字节，也会一次更新整个 Cache Line（64 个字节），这也就是我们常说的“局部性原理”。通过前面对 robj 的介绍我们知道，robj 的 5 个字段占了 16 个字节，还剩 48 字节可用。48 长度的字符串需要 sdshdr8 进行存储，sdshdr8 需要额外的 4 字节空间存储其字段（len、alloc、flags、以及字符串的 '\0' 结尾） ，所以当存储的字符串长度小于等于 44 个字节的时候，会使用 OBJ_ENCODING_EMBSTR 编码方式，与 robj 实例一起占满一个 Cache Line（也就是 64 个字节）。如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e1acbb797ff4679926337abc1e6f56f~tplv-k3u1fbpfcp-watermark.image?)

-   **OBJ_ENCODING_RAW**：字符串无法转换成整数类型且长度超过 44 字节的时候，Redis 会使用 OBJ_ENCODING_RAW 编码方式进行存储，这种存储方式就是老老实实创建 sdshdr 存储字符串数据，并使用 ptr 指针存储 sdshdr 的地址，没有任何优化。如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73ff6f9feb1549d6a7c0232d1d2497c6~tplv-k3u1fbpfcp-watermark.image?)

**当一个 robj 里面的存储数据为列表（即 type 为 `OBJ_LIST`）时**，底层存储数据结构是 quicklist，对应的编码方式也只有 OBJ_ENCODING_QUICKLIST 一种。quicklist 这个数据结构自身是基于 listpack 实现的，quicklist 自身涉及到压缩、优化等方面的内容在前面已经详细分析过了。你可能还会看到有的资料说：列表会使用 OBJ_ENCODING_LINKEDLIST 编码方式，这是 Redis 老版本的编码方式了，quicklist 底层使用 ziplist 实现，这是 Redis 7 之前的实现方式，从 Redis 7.0 开始，quicklist 底层已经用 listpack 替换了 ziplist，我们在前面的章节中也反复提到这件事情了。

**当一个 robj 里面的存储数据为哈希表（即 type 为 `OBJ_HASH`）时**，底层存储数据结构可以是 listpack 或是 dict，对应的编码方式分别是 OBJ_ENCODING_LISTPACK 或是 OBJ_ENCODING_HT。

-   **OBJ_ENCODING_LISTPACK**：当哈希表中的总键值对数量小于 hash-max-listpack-entries 配置值（默认 512），且每个键值对中的 Key 和 Value 长度都小于 hash-max-listpack-value 配置值（默认 64），Redis 使用 listpack 来存储哈希表的结构。具体结构如下图所示，Redis 将一个键值对拆分成两个 listpack 元素进行存储：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e3bae2e427f442186d133e83cf27da5~tplv-k3u1fbpfcp-watermark.image?)

-   **OBJ_ENCODING_HT**：当哈希表不满足上面两个条件中的任意一个时，就会使用 dict 作为底层的存储结构，此时对应的编码方式就是 OBJ_ENCODING_HT。

**当一个 robj 里面的存储数据为集合（即 type 为 `OBJ_SET`）时**，底层存储结构可以是 intset 或是 dict，对应的编码方式分别是 OBJ_ENCODING_INTSET 或 OBJ_ENCODING_HT。

-   **OBJ_ENCODING_INTSET**：当集合中存储的元素都能转换成整数，且元素个数不超过 set-max-intset-entries 配置值（默认 512）时，Redis 使用 intset 结构来存储集合中的元素。
-   **OBJ_ENCODING_HT**：当集合不满足上述两个条件中的任意一个时，Redis 会使用 dict 结构来存储集合元素，集合的元素以 Key 的形式存储在 dict 中，dict 中的 value 全部为 NULL。

**当一个 robj 里面的存储数据为有序集合（type 为 `OBJ_ZSET`）时**，底层存储结构可以是 listpack 或 skiplist +dict，对应的编码方式是 OBJ_ENCODING_LISTPACK 或 OBJ_ENCODING_SKIPLIST。

-   **OBJ_ENCODING_LISTPACK**：当有序集合中存储的元素个数小于 zset-max-listpack-entries 配置值（默认为 128），且每个键值对中的 Key 和 Value 长度都小于 zset-max-listpack-value 配置值（默认 64）时，Redis 使用 listpack 存储有序列表。如下图所示，其中元素值及其对应的 score 值都会作为 listpack 的一个元素进行存储。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/550693bb08ff4d23a1f1ed01f35f1fb4~tplv-k3u1fbpfcp-watermark.image?)

-   **OBJ_ENCODING_SKIPLIST**：当有序集合不符合上述两个条件中的任意一个时，Redis 使用 dict + skiplist 的结构存储有序集合。在后面我们会详细展开介绍 Redis 是如何使用 dict 和 skiplist 存储有序集合的原理。

**当一个 robj 里面的存储数据为 Stream（type 为 `OBJ_ENCODING_STREAM`）时**，底层结构只能是 stream，对应的编码方式是 OBJ_ENCODING_STREAM，stream 涉及到的 listpack 以及 radix 树的实现在前面已经详细分析过了，这里不再重复。

用下图简单总结一下，robj 中不同 type 取值与 encoding 编码方式之间的映射关系：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff75cb43513144f597e2fa32acfe455e~tplv-k3u1fbpfcp-watermark.image?)

## redisServer

介绍完 Redis 存储最核心的 robj 对象之后，我们再来看 Redis 服务本身的抽象 —— redisServer。

我们启动的每个 Redis 实例都是一个 redisServer 实例，其中包含了存储键值对的数据库实例、配置文件地址、命令列表、Redis 实例的监听地址、与当前 Redis 连接的客户端列表等一系列 Redis 实例运行的必要信息。redisServer 结构体核心字段的含义如下：

```c
struct redisServer {

    char *configfile; // redis.conf配置文件的绝对路径

    redisDb *db; // 存储键值对数据的redisDb实例

    int dbnum; // db个数,可通过databases参数进行配置，默认为16，我们一般只使用0号DB

    

    // 当前redis实例能处理的命令列表，其中key是命令名，vaue是执行命令的入口

    dict *commands; 

    aeEventLoop *el; // 事件处理循环



    int port; // 当前redis实例监听的端口

    // 当前redis实例可以绑定的ip地址，默认会绑定当前机器的全部ip，最多16个ip

    char *bindaddr[CONFIG_BINDADDR_MAX]; 

    int bindaddr_count;



    list *clients;  // 连接到当前redis实例的客户端列表

    // 客户端最大的空闲时长，单位是秒。当客户端超过该时长未与服务器进行交互，

    // redis实例与该客户端的连接会自动超时断开。

    int maxidletime; 

}
```

redisServer 结构体中还有非常非常多的字段，这些字段在后面用到的时候会详细介绍，小伙伴们只需要好先对这几个核心字段混个脸熟就行。

## redisDb

在 redisServer 实例的核心字段中，有一个 redisDb* 类型指针，它指向了一个长度为 dbnum（默认为 16）的 redisDb 数组，**redisDb 实例其实就是 Redis 这种用来存储键值对的数据库**。redisDb 核心字段的含义如下：

```c
typedef struct redisDb {

    // 用来存储键值对的dict实例

    dict *dict;

    // 用来存储每个key的过期时间

    dict *expires;

    // blocking_keys用来存储客户端阻塞等待的key，例如，客户端使用BLPOP命令阻

    // 塞等待弹出列表中的元素时，就会将key写入到blocking_keys中，value则是被阻

    // 塞的客户端。当下次PUSH命令发出时，Redis会检查blocking_keys中是否存在阻塞

    // 等待的key，如果存在，则将key添加到ready_keys链表当中，在下次Redis事件处

    // 理流程中，会遍历ready_keys链表，并从blocking_keys中拿到阻塞的客户端进行

    // 响应

    dict *blocking_keys;        

    dict *ready_keys;

    // 与WATCH命令相关的一个dict

    dict *watched_keys; 

    // 当前redisDb实例的唯一标识

    int id;             

    long long avg_ttl;  // 用来统计平均过期时间

    unsigned long expires_cursor; // 用来统计过期事件循环执行的次数

    list *defrag_later;         // 一个key的列表，这些key会参与碎片整理

} redisDb;
```

Redis 中的键值对信息全部存储到了 redisDb->dict 这个字典中，有过期时间的 key 会存储到 expires 这个字典中。阻塞命令涉及到的 key 会存储到 blocking_keys、ready_keys 两个字典中，WATCH 命令相关的 key 会存储到 watched_keys 这个字典中，至于阻塞命令和 WATCH 命令具体是怎么使用这些 dict 集合的，我们将在后面的专题中，详细展开介绍。我们这里只需要先关注 redisDb 中的 dict 和 expires 两个 dict 集合即可，`前者存真正的键值对数据，后者存 Key 以及对应的过期时间`。

在`  initServer() ` 这个初始化函数中，有如下代码片段来初始化 redisServer 的 db 数组以及数组中的每个 redisDb 实例：

```c
server.db = zmalloc(sizeof(redisDb) * server.dbnum);

... ... // 省略中间其他的逻辑

for (j = 0; j < server.dbnum; j++){ // 初始化dbnum个redisDb实例

    server.db[j].dict = dictCreate(&dbDictType, NULL);

    server.db[j].expires = dictCreate(&dbExpiresDictType, NULL);

    server.db[j].expires_cursor = 0;

    server.db[j].blocking_keys = dictCreate(&keylistDictType, NULL);

    server.db[j].ready_keys = dictCreate(&objectKeyPointerValueDictType, NULL);

    server.db[j].watched_keys = dictCreate(&keylistDictType, NULL);

    server.db[j].id = j;

    server.db[j].avg_ttl = 0;

    server.db[j].defrag_later = listCreate();

    listSetFreeMethod(server.db[j].defrag_later, (void (*)(void *))sdsfree);

} 
```

注意，这里创建 redisDb 中的每个 dict 实例时，指定的 dictType 各不相同。在[第 20 讲《数据结构篇：深入 Hash 实现》](https://juejin.cn/book/7144917657089736743/section/7147529551927590947)介绍 dict 的实现时我们提到，dictType 中指定了 hash 函数、key/value 的复制函数、key 比较函数以及判断当前 dict 是否可以扩容的 dictExpandAllowed 函数，这里就不再展开介绍了，你可以自行查看感兴趣的 dictType 实现。

## client

在微服务的架构中，Redis 作为一个集中式的底层存储，不可能只有一个服务使用，Redis 需要支持多客户端的连接和并发请求。**Redis Server 端使用 client 结构体来抽象一个 Redis 客户端，其中封装了与客户端的底层连接、读取客户端请求的缓冲区、返回给响应的缓冲区等**。

下面来看 client 结构体中核心字段的含义，client 核心字段总结起来有 5 大类。

-   第一类是客户端的基础信息。例如：id 字段记录了 client 的唯一 id；conn 字段抽象了该 client 的客户端与 Server 端的网络连接；resp 字段是该 client 支持的协议；db 指针指向了该 client 当前操作的数据库编号，等等。

-   第二类是 Redis 读取该客户端请求的相关字段。例如：Redis 服务读取该客户端发来请求时用的缓冲区，也就是这个 querybuf 字段；后面的 argc、argv 请求解析之后得到的结果；reqtype 字段则是请求的协议版本。
-   第三类是 Redis 服务向该客户端返回响应相关的字段。例如：响应的缓冲区、等待发送的字节数、已发送的字节数，分别对应了下面的 buf、bufpos、sentlen 等字段。
-   第四类是对这个 client 状态信息记录。例如， flags 字段，其中每一位都表示一个状态，具体每个状态位的含义，在后面用到的时候详细说明。
-   第五类就是针对这个客户端的一些统计信息。例如：lastinteraction 字段即这个客户端与当前 Redis Server 最后一次交互时间戳；ctime 字段记录了该 client 实例的创建时间，也就是这个客户端连到当前 Redis Server 的时间。

```c++


typedef struct client {

    // client实例的自增id，默认是通过server.next_client_id自增得到的，

    // 也可自定义。server.next_client_id是一个原子类型的整数，其自增是原子操作

    uint64_t id;

    // connection抽象了当前Redis实例与该客户端之间的网络连接

    connection *conn; 

    // resp记录当前客户端支持的RESP协议版本，可选值为2和3，分别代表RESP2协议

    // 和RESP3协议，这两个版本协议的差别我们后面展开

    int resp; 

    // 当前客户端操作的DB，默认是编号0的DB，实际生产中，我们一般只使用编号为0的DB

    redisDb *db;



    // 下面是与请求读取相关的字段，客户端通过connection连接发送请求时，请求会写入

    // querybuf缓冲区缓存，qb_pos记录了querybuf缓冲区中有效的字节数，

    // querybuf_peak记录了最近一段时间内querybuf的最大值

    sds querybuf;

    size_t qb_pos;  



    // querybuf缓冲区中累计了足够多的数据之后，会按照RESP协议解析成Redis命令，

    // 这里的argc字段记录了解析后Redis命令的参数个数(包括命令名称本身)，argv

    // 字段指向的robj*数组用来存储解析后的命令参数(以字符串类型存储)

    int argc;            

    robj **argv; 

    int argv_len;

    // 在Redis客户端与Server端交互的RESP协议中，请求有PROTO_REQ_INLINE、

    // PROTO_REQ_MULTIBULK两种格式，reqtype字段就是用来记录当前请求的格式

    // 下面的multibulklen、bulklen都是在解析PROTO_REQ_MULTIBULK格式请求时，

    // 使用到的辅助字段

    int reqtype; 

    int multibulklen;

    long bulklen;



    // Redis会根据解析得到的命令名称找到要执行的redisCommand，并用cmd、lastcmd

    // 两个字段进行记录

    struct redisCommand *cmd, *lastcmd; 



    // 下面是Redis Server端返回响应相关的字段，buf字段是返回响应时使用的缓冲区，

    // 默认是16K，bufpos字段记录buf数组的实际使用长度, buf_usable_size字段记录

    // 了buf缓冲区剩余的可用空间大小。当buf缓冲区写满之后，

    // 后续的数据将会追加到reply列表中，其中每个元素都是clientReplyBlock实例

    // (也是16K的缓冲区），写满其中一个clientReplyBlock实例之后才会再追加新

    // 的clientReplyBlock实例

    int bufpos;

    size_t buf_usable_size;

    char *buf;

    list *reply;

    unsigned long long reply_bytes; // 记录reply中的总字节数

    // sentlen发送一个缓冲区数据时，记录此次发送长度，从而帮助判断该缓冲区是

    // 否完全发送完毕

    size_t sentlen; 



    // 下面是一些统计信息，ctime记录了client实例的创建时间；duration用于

    // 记录一次命令的执行时长；lastinteraction用于记录该client实例表示

    // 的Redis客户端与当前Redis Server最近一次发生交互的时间戳，用于判断

    // 客户端是否超时

    time_t ctime;

    long duration;

    time_t lastinteraction; 



    // flags字段中记录了当前client的状态信息，其中每一位表示一个状态，例如，

    // CLIENT_PENDING_READ (1<<29)表示当前connection连接有请求需要读取和解析

    // CLIENT_PENDING_COMMAND (1<<30)表示有解析好的、待执行的命令

    // CLIENT_PENDING_WRITE (1<<21)表示有响应需要范围该client对应的客户端

    // CLIENT_MULTI (1<<3)表示当前处于一个事务上下文中

    // flags中还有非常非常多的状态位，这里不再一一展开介绍了，后面用到再说

    uint64_t flags;

} client;
```

client 除了用来抽象我们业务层连接 Redis Server 的客户端，在 Redis 内部进行交互的时候，也会使用到，比如说，Redis 主从复制的时候，主库就会把从库作为一个客户端。client 结构体为了支持这些场景，另外添加了一些特殊字段来进行支持，例如，如果当前 Redis Server 实例是个主库，reploff 字段记录了对应的从库在该主库的复制偏移量。

> 这里并没有展开详细列举 client 结构体中每个字段的含义和功能，即使现在介绍了，也会因为没有结合使用场景，让你觉得不知所云。不过你可以放心，在后面使用到 client 中的某个具体字段时，我还会详细进行说明的。

## redisCommand

在 redisServer 结构体中，维护了一个 commands 字段（dict* 指针类型），其中**维护了当前 Redis 实例能够执行的 Redis 命令**，其中的 key 是可执行的命令名称，value 是对应的 redisCommand 对象。

### 1. 初始化 redisCommand

下面展示了 Redis 支持的一部分命令，这些命令定义在 redisCommandTable 这个全局的数组中：

```c
struct redisCommand redisCommandTable[] = {

    ... ... // 省略其他

    {"get", "Get the value of a key", "O(1)", "1.0.0", CMD_DOC_NONE, 

      NULL, NULL, COMMAND_GROUP_STRING, GET_History, GET_tips, getCommand, 2,

      CMD_READONLY | CMD_FAST, ACL_CATEGORY_STRING, 

      {{NULL, CMD_KEY_RO | CMD_KEY_ACCESS, KSPEC_BS_INDEX, .bs.index={

        1}, KSPEC_FK_RANGE, .fk.range={0, 1, 0}}}, .args=GET_Args},

        

    {"set","Set the string value of a key","O(1)","1.0.0",CMD_DOC_NONE,NULL,

      NULL,COMMAND_GROUP_STRING,SET_History,SET_tips,setCommand,-3,

      CMD_WRITE|CMD_DENYOOM,ACL_CATEGORY_STRING,

      {{"RW and ACCESS due to the optional `GET` argument",

      CMD_KEY_RW|CMD_KEY_ACCESS|CMD_KEY_UPDATE|CMD_KEY_VARIABLE_FLAGS,

      KSPEC_BS_INDEX,.bs.index={1},KSPEC_FK_RANGE,.fk.range={0,1,0}}},

      setGetKeys,.args=SET_Args},



    {"rpush","Append one or multiple elements to a list",

     "O(1) for each element added, so O(N) to add N elements when the 

     command is called with multiple arguments.","1.0.0",CMD_DOC_NONE,NULL,

     NULL,COMMAND_GROUP_LIST,RPUSH_History,RPUSH_tips,rpushCommand,-3,

     CMD_WRITE|CMD_DENYOOM|CMD_FAST,ACL_CATEGORY_LIST,

     {{NULL,CMD_KEY_RW|CMD_KEY_INSERT,KSPEC_BS_INDEX,.bs.index={1},

     KSPEC_FK_RANGE,.fk.range={0,1,0}}},.args=RPUSH_Args},



    {"zadd","Add one or more members to a sorted set, 

      or update its score if it already exists",

      "O(log(N)) for each item added, where N is the number of elements in 

      the sorted set.","1.2.0",CMD_DOC_NONE,NULL,NULL,

      COMMAND_GROUP_SORTED_SET,ZADD_History,ZADD_tips,zaddCommand,-4,

      CMD_WRITE|CMD_DENYOOM|CMD_FAST,ACL_CATEGORY_SORTEDSET,

      {{NULL,CMD_KEY_RW|CMD_KEY_UPDATE,KSPEC_BS_INDEX,

      .bs.index={1},KSPEC_FK_RANGE,.fk.range={0,1,0}}},.args=ZADD_Args},

      

     ... ... // 省略其他

};
```

在 initServerConfig() 这个初始化函数中，会先初始化 redisServer.commands 这个 dict 实例，然后将 redisCommandTable 数组中的 redisCommand 实例填充到 commands 这个 dict 实例中，很明显，`这个转换实际是将命令集合从数组转换成字典，后续命令的查找效率从 O(n) 提升到 O(1)`。

```c
// 下面是initServerConfig()函数中的代码片段：

server.commands = dictCreate(&commandTableDictType, NULL);

populateCommandTable(); // 将redisCommandTable填充到commands中
```


### 2. redisCommand 核心字段

下面我们再深入一步，展开介绍一下 redisCommand 这个结构体，看看一条 Redis 命令是如何组织的，redisCommand 结构体的核心字段如下：

```c++
struct redisCommand {

    // declared_name记录了命令名称，也是redisServer.commands中的key

    const char *declared_name; 

    ... // 省略一些介绍性的字段，比如summary、complexity、since等等字段，分别说明

        // 了这条命令的大概功能、详细说明以及从Redis的哪个什么版本开始支持这条信息等等，

        // 这些字段中记录的只是命令介绍性的信息，与命令本身执行没什么关系。 

    const char **tips; // 给客户端使用的提示信息

    // proc指向了命令处理函数，也就是处理该命令的入口

    redisCommandProc *proc; 

    int arity;  // arity指定了命令参数的个数

    uint64_t flags; // 命令标识

    ...

    keySpec key_specs_static[STATIC_KEY_SPECS_NUM];

    // 一条命令可能操作多个Key，这个函数用来提取命令中所有Key的位置

    redisGetKeysProc *getkeys_proc;

    

    // 统计信息，microseconds是从Redis实例启动到现在该命令的总执行时间，

    // calls是该命令的总调用次数，rejected_calls、failed_calls分别是

    // 该命令的拒绝次数和失败次数

    long long microseconds, calls, rejected_calls, failed_calls;

    int id; // 命令的唯一ID，从0开始分配

    

    // 这里的key_specs、args、subcommand字段以及前面的key_specs_static都是用来

    // 描述命令的，这个我们下面简单说一下

    keySpec *key_specs;

    keySpec legacy_range_key_spec; 

    // 一条Redis命令下面可能还有子命令，这些子命令就记录在subcommands数组，

    // 相应的哈希结构存储在subcommands_dict这个字典中

    struct redisCommand *subcommands;

    dict *subcommands_dict; 

    struct redisCommandArg *args;

    struct redisCommand *parent; // 父命令指针

    

    

};
```

### 3. redisCommand 常见实例解析

下面我们结合 redisCommand 实例来介绍其中字段的使用，例如，redisCommandTable 中的 setnx 命令和 zunion 命令：

```c
{"setnx", ..., setnxCommand,3,CMD_WRITE|CMD_DENYOOM|CMD_FAST, ..., {{NULL,CMD_KEY_OW|CMD_KEY_INSERT,KSPEC_BS_INDEX,.bs.index={1},KSPEC_FK_RANGE,.fk.range={0,1,0}}},.args=SETNX_Args},



{"zunion",...,zunionCommand,-3,CMD_READONLY,ACL_CATEGORY_SORTEDSET,{{NULL,CMD_KEY_RO|CMD_KEY_ACCESS,KSPEC_BS_INDEX,.bs.index={1},KSPEC_FK_KEYNUM,.fk.keynum={0,1,1}}},zunionInterDiffGetKeys,.args=ZUNION_Args},
```

-   这里的 “setnx” 和 “zunion” 即为 redisCommand 的 declared_name 字段，也就是命令名称。
-   setnxCommand() 函数和 zunionCommand() 函数分别是执行 setnx 命令和 zunion 命令的入口，具体的逻辑我们后续会详细分析。
-   接下来是 arity 字段。当 arity 取值为正时，表示命令有固定的参数；当 arity 取值为负时，表示参数个数的最小值，可能包含更多参数。例如，这里的 SETNX 命令的格式如下，其 arity 为 3 对应了命令名称 SETNX 本身、key、value 三部分：

```c
SETNX key value
```


而上述示例中的 ZUNION 命令的 arity 为 -3，其格式如下，也就是说 ZUNION 至少包含 3 个参数，分别是命令名称 ZUNION、numkeys、key 三个参数，也可以有更多 key 以及 WEIGHTS、AGGREGATE、WITHSCORES 等辅助参数。


```c
ZUNION numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]
```

-   然后是 flags 字段，每一位就是一个标识符，每个标识符说明了这条命令的一个特性。

    -   CMD_WRITE：当前命令是写入命令，会导致数据修改。
    -   CMD_READONLY：当前命令是只读命令，不会导致数据修改。
    -   CMD_FAST：该类命令执行时间复杂度为 O(1) 或是 O(n)。
    -   CMD_DENYOOM：Redis 服务出现 OOM 的时候，拒绝当前命令。
    -   CMD_ADMIN：当前命令属于 Redis 管理命令。
    -   CMD_PUBSUB：当前命令属于 PUBSUB 相关的命令。
    -   CMD_NOSCRIPT：当前命令不能在脚本中使用。
    -   CMD_BLOCKING：可能导致客户端阻塞的命令。
    -   CMD_LOADING：在数据库载入的时候，只能执行此类命令。

    flag 的标志位还有非常多，这里只是简单列举了几个我们在后续阅读代码中可能会碰到的标志位含义，感兴趣的小伙伴可以看一下 redisCommand 结构体的注释，里面有对每个 flags 标志位含义的完整介绍。

-   再来看 id 字段，该字段是在 Redis 实例启动的时候动态分配的，Redis 会将命令名称插入到一个 Rax 树中，每插入一个命令对应的 id 递增 1，命令对应 raxNode 节点中存储的 value 值就是其 id 值。这部分逻辑位于 ACLGetCommandID() 函数中，调用栈如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6968f81692f8411e991fedcf079338fe~tplv-k3u1fbpfcp-watermark.image?)

额外说一下，`为啥有了 name 这个唯一标识之后，还需要将其转换成 id 呢？`id 字段主要是为了 ACL 使用的，Redis 为每个用户创建了一个 bitmap，其中每一位都标识这个用户是否有权限访问对应的命令，这里将命令转换成 id 这个整数，就是为了构建 bitmap。

-   下面再来看 getkeys_proc 以及 key_specs_static、key_specs 这些字段。在一条 Redis 命令里面，可能会操纵一个或者多个 Key，Redis 6 以及以前的版本里面，使用 firstKey、lastKey 以及 keystep 三个字段来描述这些 Key 的位置，比如，SETNX 命令要操作的 key 的个数和位置是明确的，直接通过 firstKey、lastKey 以及 keystep 字段明确指定 key 的范围，并不需要通过 getkeys_proc 函数来获取命令。反观 ZUNION 命令，它要涉及到的 key 的个数和位置不确定，需要通过解析 getkeys_proc 函数来解析客户端参数，从而获取 key 的个数和范围，这里的 firstKey、lastKey 以及 keystep 字段全部设置为 0。

    在 Redis 7 中，引入了 **Key Spec** 的规则，用来描述命令行的规则，我们可以用 `COMMAND INFO` 命令来看一下 Key Spec 对 SET 命令的描述，如下图所示，Redis 7 比 Redis 6 多返回的这一部分就是 Key Spec 对 SET 命令的描述：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f46a270afb954ab0810db9b4667169a7~tplv-k3u1fbpfcp-watermark.image?)

> Key Spec 的具体规则，小伙伴们可以参考[这篇文档](https://redis.io/docs/reference/key-specs/)，为了防止本篇文章变得冗长，不再逐一展开介绍 Key Spec 规则的内容。要是对 Key Spec 出现的原因感兴趣，可以参考下面这两个 PR 的讨论：
>
> - https://github.com/redis/redis/pull/8324
> - https://github.com/redis/redis/issues/7297

<!---->

-   最后要看的 tips 这个字段，其中记录了一些给客户端（或者 Proxy，尤其是 Cluster Client）的提示信息，客户端会根据这个提示信息，决定如何执行这条命令。举个例子，假设我们有一个 Redis Proxy，底层是维护了三个 Redis 实例，如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd655c92300f41deb5d6cf2d1fb60339~tplv-k3u1fbpfcp-watermark.image?)

这个时候，Proxy 收到业务层发来的一条 DBSIZE 命令，正常情况下，是要统计整个 Redis 集群，也就是底层的三个 Redis Shard 总大小，所以 Proxy 需要把 DBSIZE 命令发到三个 Redis Shard，然后将三个 Redis Shard 的返回值汇总累加，最后返回给客户端。

在 DBSIZE 命令中的 tips 字段，就是告诉 Proxy 如何处理 DBSIZE 命令，我们可以用 COMMAND INFO 看一下 DBSIZE 命令的 tips 值，如下图所示，这里的 “request_policy:all_shards” 就是告诉 Proxy 把 DBSIZE 命令发到所有 Redis Shard， “response_policy:agg_sum” 则是告诉 Proxy 要累加各个 Redis Shard 的返回值。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08bd2e5f82d74e4d92959bf9543d3264~tplv-k3u1fbpfcp-watermark.image?)

> 你如果对 tips 完整的规范感兴趣，可以参考 https://redis.io/docs/reference/command-tips/#response_policy 文档，以及 https://github.com/redis/redis/issues/9876 这个 Issue。

整体来看，Key Spec 和 tips 两个新规范的加入，让整个 Redis 命令的自解释能力更强大，Cluster Client 和 Proxy 这些客户端只要按照 COMMAND INFO 命令的返回信息，就可以明确知道某一条命令的具体使用方式、要操作哪些 Key 等关键信息。这也就**避免了大量硬编码 Redis 命令，提高了客户端的灵活性和可扩展性**，比如，Redis Server 端通过 Module 扩展方式新加了一条命令，客户端的实现可以完全不变，客户端只需要请求一下 COMMAND INFO，就可以知道这条新命令的自解释信息，然后就可以按照这些自解释的信息把命令发到合理的 Redis Shard 实例进行处理。

另外，Redis 7.0 之前，全部的 Redis 命令都是维护在 server.c 文件里面的 redisCommandTable 数组里面。在 7.0 之后，Redis 使用 json 文件的方式统一维护 Redis 命令的元数据（这些 json 文件位于 src 下的 commands 目录中），然后用 python 脚本（该脚本是 utils 目录下 generate-command-code.py）统一生成 commands.c 文件。这个思路也是值得我们借鉴的，使用` json 文件+自动化脚本 `的方式，比直接在 C 文件里面手写 commands.c 里面的这种代码，要易于维护得多。

> 在这个 PR 里面 https://github.com/redis/redis/pull/9656 ，详细地说明了这个这项优化的目标以及带来的好处，感兴趣的小伙伴可以阅读一下。

到这里，我们可以看到 RedisCommand 结构体里面虽然包含了非常多的信息，但是小伙伴们暂时只需要记得 name、id、proc 这几个关键字段的含义，了解 Key Spec、command tips 的思想即可，其他复杂的字段在后续使用到的时候，回来查就可以了。

## 总结

这一节我们重点介绍了 Redis 的核心结构体。

-   首先是 redisObject 结构体，redisObject 是对所有 Redis Value 的封装，我们也深入介绍了 redisObject 中的编码规则。
-   接下来分析了 redisServer 和 redisDb，它们分别是对 Redis 服务器和 Redis DB 的抽象。
-   然后解析了 client 结构体，它抽象的是一个 Redis 客户端，我们重点分析了 client 中的 5 大类核心字段的作用。
-   最后，我们介绍了 redisCommand 结构体，它抽象的是一条 Redis 的命令，我们结合 Redis 的常用命令，解析了 redisCommand 结构体的应用。