Redis 最常见的应用场景就是缓存，我们在使用缓存的时候，一般不会存储 DB 里面全量的数据，而只用于缓存一部分 DB 热点数据，对于非热点数据，需要进行定期删除，防止 Redis 内存被撑爆，也就是我们常说“**内存淘汰**”机制。

在前面[第 33 讲《内核解析篇：Redis 时间事件的二三事》](https://juejin.cn/book/7144917657089736743/section/7147529927196147727)介绍 serverCron() 函数的时候提到，其中会更新 LRU 时钟，使用 LRU 时钟的地方有两个：

-   一个是在客户端访问一个 Key 时，会使用 Value 值中的 lru 字段记录当前的 LRU 时钟；
-   另一个是在 estimateObjectIdleTime() 函数中，会通过前面记录的 LRU 值，推算该 Key 空闲了多久，Redis 会按照一定的淘汰算法将最久没被访问的 Key 删除掉，防止 Redis 内存超过 maxmemory 指定上限。

## 内存淘汰策略

这里我们先来看 redisServer 中的 `maxmemory 字段`（对应 redis.conf 中的 maxmemory 配置项），它**指定了 Redis 的最大内存**，单位是 byte，当 Redis 内存占用达到这个值的时候，Redis 就会开始`按照指定的策略`淘汰 Key，从而达到释放内存的效果。

下面是 Redis 支持的内存淘汰策略。

-   **no-enviction 策略**：该策略不会触发内存淘汰，但是当客户端再次发送新建 Key 的请求或是修改已有 Key 的请求（例如，SET、LPUSH 等）时，Redis 会直接返回错误。对 DEL 命令以及 GET 等查询命令是可以正常响应的。

-   **volatile-lru 策略**：Redis 会按照近似 LRU 的算法，从设置了过期时间的 Key 中，选取 Key 进行淘汰。注意，Redis 使用的 LRU 算法只是`近似 LRU`，其底层原理是：采样一部分 Key，然后从被采样的 Key 集合中淘汰最久没有被访问的 Key，这样可以避免遍历全部有过期时间的 Key 集合。

    在 Redis 3.0 中，近似 LRU 算法进行了一次升级，引入了一个维护淘汰 Key 的候选池，这样可以提高筛选 Key 的精准度，使得近似 LRU 算法的效果更加接近于真正的 LRU 算法。

    另外，我们可以通过参数来调整近似 LRU 算法每次采样的 Key 的个数，从而调整近似 LRU 算法的精准度。

-   **allkeys-lru 策略**：筛选 Key 的算法依旧是近似 LRU 算法，但是筛选 Key 的范围不再限于设置了过期时间的 Key，而是扩展到 Redis 内全部的 Key。
-   **volatile-random 策略**：从设置了过期时间的 Key 中随机选择 Key 进行淘汰。
-   **allkeys-random 策略**：从全部 Key 中随机选择 Key 进行淘汰。
-   **volatile-ttl 策略**：从设置了过期时间的 Key 中筛选将要过期的 Key 进行淘汰。注意，这也是一个通过抽样实现的近似算法。
-   **volatile-lfu 策略**：使用近似 LFU 算法从设置了过期时间的 Key 中，筛选出最近访问频率最低的 Key 进行淘汰。
-   **allkeys-lfu 策略**：使用近似 LFU 算法从全部 Key 中，筛选出最近访问频率最低的 Key 进行淘汰。

上面介绍的这些淘汰策略，`都是可以通过 redis.conf 文件中的 maxmemory-policy 配置项进行指定的`。

这里简单区分一下 LRU 和 LFU 两种算法。

-   `LRU` 的全称是 Least Recently Used，含义是`最近最少使用`，核心思想是如果一个 Key 在最近一段时间内没有被用到，那么将来被使用到的可能性也很小，所以应该被优先从内存中淘汰。

-   `LFU` 的全称是 Least Frequently Used，含义是`最近访问频率最低`，核心思想是如果一个 Key 在最近一段时间内的访问频率都很低，那么这个 Key 应该被优先从内存中淘汰。

举个简单的例子，有两个 Key 一段时间内被访问分布如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e106269f256464eb8f918d9679149cb~tplv-k3u1fbpfcp-watermark.image?)

如果使用 LRU 算法进行淘汰，在 robj->lru 字段中记录的是最近一次访问时间，也就是前面说的 LRU 时钟，Redis 通过这个 LRU 时钟的值，就可以判断出 Key1 是最近使用的 Key，所以 Key2 将会被淘汰。

如果使用 LFU 算法进行淘汰，在 robj->lru 字段中记录的就是这个 Key 近期被访问的次数，Redis 通过该值就可以判断出 Key2 是最近使用频率更高的 Key，所以 Key1 将会被淘汰。

## 内存淘汰实现

介绍完 Redis 的内存淘汰策略之后，我们最关注的可能就是带有 LRU 和 LFU 算法的那四种策略，而这四种策略`与 robj->lru 字段息息相关`。下面我们就从如何更新 lru 字段，以及如何使用 lru 字段实现淘汰逻辑两个方面，来分析 Redis 内存淘汰的实现。

### 更新 lru 字段

在客户端发送命令访问一个 Key 时，Redis 都会调用 lookupKey(）函数，如下图所示，lookupKeyReadWithFlags() 函数是在读取时使用的，lookupKeyWriteWithFlags() 函数是在写入时使用的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbd34a430c2545ab9afca81518e42921~tplv-k3u1fbpfcp-zoom-1.image)

lookupKey() 函数会先去 redisDb->dict 集合中，查找目标 Key，查找成功之后，就会更新 Value 值中的 lru 字段，核心代码如下：

```c
robj *lookupKey(redisDb *db, robj *key, int flags) {

    dictEntry *de = dictFind(db->dict,key->ptr); // 查找目标Key

    robj *val = NULL;

    if (de) { 

        val = dictGetVal(de); 

        // 下面这两行代码是针对主从模式下，只读从库的特殊处理。因为主从模式里面，过期Key

        // 是由主库控制的，从库只能被动接受。主库发现一个Key过期之后，会发一条DEL语句给

        // 从库，而从库在发现过期Key的时候，不用主动删除Key，而是等主库发来的DEL再删，

        // 这样可以保持主从一致。

        // 但是对于从库还是会检查Key是不是已经过期了，如果Key过期了，我们也是无法拿到

        // 对应的Value值的。

        int is_ro_replica = server.masterhost && server.repl_slave_ro;

        int force_delete_expired = flags & LOOKUP_WRITE && !is_ro_replica;

        if (expireIfNeeded(db, key, force_delete_expired)) { // 惰性过期

            val = NULL;

        }

    }



    if (val) {

        // 根据flags标识决定是否更新lru字段

        if (!hasActiveChildProcess() && !(flags & LOOKUP_NOTOUCH)){

            // 根据内存淘汰策略确认lru存储的数据以及更新类型

            if (server.maxmemory_policy & MAXMEMORY_FLAG_LFU) {

                updateLFU(val);

            } else {

                val->lru = LRU_CLOCK();

            }

        }

        ... // 省略一些统计操作以及KeySpace事件的触发逻辑

    }

    return val;

}
```

我们看到 lookupKey() 函数的第三个参数是 flags 标识符，其中可以设置 LOOKUP_NOTOUCH 和 LOOKUP_NONOTIFY、LOOKUP_NOSTATS、LOOKUP_WRITE 四种标志位，对我们比较有用的是下面这两个标志位。

-   **LOOKUP_NOTOUCH**：正常的读写命令都需要更新 Key 对应的 robj->lru，但是有些命令不需要进行更新，例如，EXISTS、OBJECT、TTL 等查看元数据的命令，这些命令会设置 LOOKUP_NOTOUCH 标识，表示不更新 robj->lru 字段。

-   **LOOKUP_NONOTIFY**：在正常读写命令查找不到 Key 时，会触发一个 keymiss 的 KeySpace 通知，但是像 OBJECT 这种查看元数据的命令，就会通过设置 LOOKUP_NONOTIFY 标识，避免触发该事件。

接下来，我们要来分析一下在 LRU、LFU 两个算法里面，`robj->lru 字段是如何更新的`。

在使用 LRU 策略的时候，更新 robj->lru 字段的逻辑非常简单，就是**将其更新成当前的 LRU 时钟值**。

在使用 LFU 策略的时候，Redis 会通过 **updateLFU() 函数**完成 lru 字段的更新，其中会将 lru 字段分为两部分。

-   第一部分是高 16 位，**用于记录最近一次访问时间**（分钟级别，每 45 天溢出一次），这部分时间戳也被称为 LDT（last decrement time），它是通过 LFUGetTimeInMinutes() 函数计算得到的，其中会通过 redisServer.unixtime 缓存的时钟值，计算分钟级别的时间，然后取低 16 位。

-   第二部分是低 8 位，这部分**作为计数器使用**（最大值为 255），该部分值也被称为 counter，它是通过 LFUDecrAndReturn() 函数和 LFULogIncr() 函数共同计算得到。LFULogIncr() 函数并不是每次都触发 counter 值加 1，只是有一定几率触发加 1 操作。这里对 counter 加 1 操作的几率与 lfu-log-factor 配置项的值成反比，lfu-log-factor 配置项的默认值为 10。

```c
uint8_t LFULogIncr(uint8_t counter) {

    if (counter == 255) return 255; // counter已经达到255，不再增加

    double r = (double)rand()/RAND_MAX; // 计算随机数

    double baseval = counter - LFU_INIT_VAL;

    if (baseval < 0) baseval = 0;

    // lfu_log_factor作为分母的一部分

    double p = 1.0/(baseval*server.lfu_log_factor+1); 

    if (r < p) counter++; // 只有p>r的时候，才能对counter进行递增

    return counter;

}
```

下表展示 lfu-log-factor 配置项各个取值下，counter 增长速率，其中第一列是 lfu-log-factor 配置项的取值，表头是调用 LFULogIncr() 函数的次数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/247bb8086e134b52802ea420cd429a9d~tplv-k3u1fbpfcp-zoom-1.image)

如果 counter 只是单向递增的，那在当前 LDT 周期内，一旦 counter 到达 255，就不会被淘汰了，反映到实际场景中，就是一些过期的热点 Key 不会被及时删除。为了避免这种情况，`Redis 使用 LFUDecrAndReturn() 函数对 counter 做衰减`，在 LFUDecrAndReturn() 函数中会根据 LDT 时间戳的流逝情况以及 lfu-decay-time 配置项（默认值为 1）决定此次调用是否进行 counter 衰减，其中 lfu-decay-time 配置项的含义是 LDT 流逝多久衰减 1。LFUDecrAndReturn() 函数具体实现如下：

```c
unsigned long LFUDecrAndReturn(robj *o) {

    unsigned long ldt = o->lru >> 8; // 获取LDT时间戳

    unsigned long counter = o->lru & 255; // 获取counter部分值

    // 根据lfu-decay-time配置项的值，决定counter的衰减值.

    unsigned long num_periods = server.lfu_decay_time ? LFUTimeElapsed(ldt) / server.lfu_decay_time : 0;

    if (num_periods)

        counter = (num_periods > counter) ? 0 : counter - num_periods;

    return counter;

}
```

### 执行淘汰逻辑

通过前面[第 31 讲《内核解析篇：命令解析与执行》](https://juejin.cn/book/7144917657089736743/section/7147529868001935360)分析我们知道，Redis 在解析完客户端的请求之后，会在 processCommand() 函数中查找命令对应 redisCommand 实例，然后通过 call() 函数调用 redisCommand->proc 函数执行命令逻辑。

这里我们关注 processCommand() 函数在查找命令成功之后，调用 call() 函数之前的一段逻辑：

```c
if (server.maxmemory && !server.lua_timedout){

    // performEvictions()函数是内存淘汰的入口，当它无法淘汰任何Key的时候，

    // 会返回EVICT_FAIL，此时就表示Redis内存已满

    int out_of_memory = (performEvictions() == EVICT_FAIL);

    // is_denyoom_command是命令的flags字段中是否包含CMD_DENYOOM标志位，

    // 我们前面介绍redisCommand时知道其中有个flag字段，记录了该命令的一些特性，

    // 其中CMD_DENYOOM表示命令可能会导致Redis内存使用率增加，在内存满了之后，

    // 就无法再执行这条命令了。这类命令多是写命令，例如SET命令

    int reject_cmd_on_oom = is_denyoom_command;

    ... // 另外，client通过事务执行多条命令时（CLIENT_MULTI标志位）也必须保证内存充裕

    

    // 如果当前Redis内存已经达到，且无法淘汰数据，就无法执行CMD_DENYOOM类型的命令了

    if (out_of_memory && reject_cmd_on_oom) {

        rejectCommand(c, shared.oomerr);

        return C_OK;

    }

}
```

**performEvictions() 函数**可能有 EVICT_FAIL、EVICT_OK、EVICT_RUNNING 三种返回值。

-   EVICT_FAIL 表示此次 performEvictions() 函数调用没有淘汰掉任何 Key，而且 Redis 内存还满了。

-   EVICT_OK 表示经过淘汰之后，Redis 内存已经降到了 maxmemory 以下，并且该淘汰的 Key 都已经淘汰完了。
-   EVICT_RUNNING 表示经过此次 performEvictions() 函数调用之后，Redis 内存还没有降到 maxmemory 以下，但是到了执行淘汰操作的时间上线，不能继续阻塞在这里了，主线程要去执行命令了。但是，我们放了一个定时事件，等触发之后，还会继续淘汰 Key。

明确了内存淘汰的入口和返回值，以及内存淘汰失败时的后续处理逻辑之后，我们下面专注看一下内存淘汰的具体实现，也就是 performEvictions() 函数的实现，下图展示了 performEvictions() 函数的核心流程：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5df32dca3a014509a60fb870aa05d68c~tplv-k3u1fbpfcp-watermark.image?)

我们一步步来看 performEvictions() 函数的核心逻辑。

```c
int performEvictions(void) {

    ... // 省略变量

    // 第1步、待释放的内存空间是在getMaxmemoryState()函数中计算的，它的返回值表示是否需要进行内存淘汰

    if (getMaxmemoryState(&mem_reported,NULL,&mem_tofree,NULL) == C_OK) {

        result = EVICT_OK;

        goto update_metrics; 

    }

    // 第2步、evictionTimeLimitUs() 函数用来计算此次内存淘汰的超时时长

    unsigned long eviction_time_limit_us = evictionTimeLimitUs();    

    ... // 省略非关键性代码

    while (mem_freed < (long long)mem_tofree) {

        int j, k, i;

        static unsigned int next_db = 0;

        sds bestkey = NULL;

        int bestdbid;

        redisDb *db;

        dict *dict;

        dictEntry *de;



        // 第3步、优先删除 Key（也就是 bestKey）的选择

        if (server.maxmemory_policy & (MAXMEMORY_FLAG_LRU|MAXMEMORY_FLAG_LFU) ||

            server.maxmemory_policy == MAXMEMORY_VOLATILE_TTL)

        {   // LFU和LRU策略下的选择方式，使用到了EvictionPoolLRU缓存池

            struct evictionPoolEntry *pool = EvictionPoolLRU;



            while (bestkey == NULL) { 

                unsigned long total_keys = 0, keys;

                for (i = 0; i < server.dbnum; i++) {

                    db = server.db+i;

                    dict = (server.maxmemory_policy & MAXMEMORY_FLAG_ALLKEYS) ?

                            db->dict : db->expires;

                    if ((keys = dictSize(dict)) != 0) {

                        // 采样填充EvictionPoolLRU缓存池的核心逻辑位于evictionPoolPopulate()函数

                        evictionPoolPopulate(i, dict, db->dict, pool);

                        total_keys += keys;

                    }

                }

                if (!total_keys) break; /* No keys to evict. */

                

                for (k = EVPOOL_SIZE-1; k >= 0; k--) { // 查找bestKey

                    if (pool[k].key == NULL) continue;

                    bestdbid = pool[k].dbid;



                    if (server.maxmemory_policy & MAXMEMORY_FLAG_ALLKEYS) {

                        de = dictFind(server.db[bestdbid].dict,

                            pool[k].key);

                    } else {

                        de = dictFind(server.db[bestdbid].expires,

                            pool[k].key);

                    }

                    /* Remove the entry from the pool. */

                    if (pool[k].key != pool[k].cached)

                        sdsfree(pool[k].key);

                    pool[k].key = NULL;

                    pool[k].idle = 0;



                    if (de) {

                        bestkey = dictGetKey(de);

                        break;

                    } else {

                        /* Ghost... Iterate again. */

                    }

                }

            }

        } else if (server.maxmemory_policy == MAXMEMORY_ALLKEYS_RANDOM ||

                 server.maxmemory_policy == MAXMEMORY_VOLATILE_RANDOM)

        {

            ... // 第3.2步、随机淘汰策略里面选择 bestKey 的逻辑比较简单，就是随机选择一个Key进行淘汰

        }



        /* Finally remove the selected key. */

        if (bestkey) {

            ...//省略非关键性代码

            // 第4步、Redis 会从 EvictionPoolLRU 这个数组尾部选取 bestKey 进行淘汰

            if (server.lazyfree_lazy_eviction)

                dbAsyncDelete(db,keyobj);

            else

                dbSyncDelete(db,keyobj);

            // 第5步、每淘汰 16 个Key，就会检查一下淘汰操作是否超时，如果发生超时，则通过 startEvictionTimeProc() 函数启动一个时间事件。

            if (keys_freed % 16 == 0) {

                if (server.lazyfree_lazy_eviction) { // 内存是否满足条件

                    if (getMaxmemoryState(NULL,NULL,NULL,NULL) == C_OK) {

                        break;

                    }

                }

                if (elapsedUs(evictionTimer) > eviction_time_limit_us) { // 发生超时

                    startEvictionTimeProc();

                    break;

                }

            }

        } else {

            goto cant_free; /* nothing to free... */

        }

    }

    result = (isEvictionProcRunning) ? EVICT_RUNNING : EVICT_OK;



cant_free:

    if (result == EVICT_FAIL) {

        // 第6步、如果经历了上述淘汰逻辑之后，淘汰了所有能淘汰的 Key，但是 Redis 内存占用量依旧超过 maxmemory 这个阈值，那么 Redis 就做最后一次努力

        while (bioPendingJobsOfType(BIO_LAZY_FREE) &&

              elapsedUs(evictionTimer) < eviction_time_limit_us) {

            if (getMaxmemoryState(NULL,NULL,NULL,NULL) == C_OK) {

                result = EVICT_OK;

                break;

            }

            usleep(eviction_time_limit_us < 1000 ? eviction_time_limit_us : 1000);

        }

    }

   ... // 省略非关键性代码

    return result;

}
```

**第 1 步**，待释放的内存空间是在 getMaxmemoryState() 函数中计算的，它的返回值表示是否需要进行内存淘汰。getMaxmemoryState() 函数中我们关注两个参数：第一个参数 mem_reported 是一个返回参数，用于返回当前 Redis 已分配的总内存；第三个参数 mem_tofree 也是一个返回参数，它是 mem_reported - maxmemory 得到的、待释放的内存空间。

**第 2 步**，再来看 evictionTimeLimitUs() 函数，它用来计算此次内存淘汰的超时时长。该超时时长的计算与 maxmemory-eviction-tenacity 配置项正相关，下面是 evictionTimeLimitUs() 函数的核心逻辑：

```c
if (server.maxmemory_eviction_tenacity <= 10) {

    // maxmemory-eviction-tenacity配置项在10以内，耗时在0~500微妙之间

    return 50uL * server.maxmemory_eviction_tenacity;

}



if (server.maxmemory_eviction_tenacity < 100) {

    // maxmemory-eviction-tenacity配置项在10以上时，耗时时间按照

    // maxmemory-eviction-tenacity配置项的15%的比例增长，不再是完全正相关，

    // 最大值大约为2分钟

    return (unsigned long)(500.0 * pow(1.15, 

            server.maxmemory_eviction_tenacity - 10.0));

}
```

**第 3 步**，我们关注优先删除 Key（也就是 bestKey）的选择问题。随机淘汰策略里面选择 bestKey 的逻辑比较简单，就是随机选择一个 Key 进行淘汰。这里重点介绍 `volatile-*` 策略中抽样的逻辑，先来看一个基础结构 **EvictionPoolLRU 缓存池**，它用来存候选的 bestKey；在 EvictionPoolLRU 中的每个元素，都是 evictionPoolEntry 类型，每个 evictionPoolEntry 元素对应一个候选的淘汰的Key。evictionPoolEntry 结构体的定义如下所示：

```c
struct evictionPoolEntry {

    // lru相关策略中的空闲时间，lfu相关策略中的频次，ttl策略中的过期时间

    unsigned long long idle; 

    sds key;                 // 对应一个候选的Key

    sds cached;              // 用于缓存Key值

    int dbid;                // 该Key所在的db编号

};
```

EvictionPoolLRU 是一个全局的、有序的、长度固定为 16 的数组，其中的元素会按照 idle 字段值，从小到大排序。EvictionPoolLRU 缓存池用来暂存采样获取的 Key，采样逻辑位于 evictionPoolPopulate() 函数中，其核心流程如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdaf3a986a2344329962afbf289e642c~tplv-k3u1fbpfcp-watermark.image?)

evictionPoolPopulate() 函数首先会通过 dictGetSomeKeys() 随机获取几个 dictEntry（具体个数由 maxmemory-samples 配置项指定）。然后，根据不同策略计算一个 idle 值：

-   在 volatile-ttl 策略中，idle 就是 Key 剩余的过期时间；
-   在 *-lru 策略中，idle 就是 Key 空闲的时长，也就是 Value 值中的 lru 字段值，这部分逻辑在 estimateObjectIdleTime() 函数中；
-   在 *-lfu 策略中，idle 就是 255 - Key 最近的访问频率，也就是 255 （counter最大值）减去 lru 字段中的 counter 部分。

经过上面的计算，**无论是哪种淘汰策略，idle 越大，对应的 Key 值越应该被淘汰**。

最后，按照 idle 值从小到大的顺序，将 Key 封装成 evictionPoolEntry 实例并插入到 EvictionPoolLRU 缓存池中。因为 EvictionPoolLRU 是一个长度有限的数组，排名超过 16 的 Key 将会被清除出 EvictionPoolLRU 缓存池。后续在 performEvictions() 函数中淘汰数据的时候，会从 EvictionPoolLRU 缓存池的队尾开始选择 bestKey 进行淘汰。当然，在我们选择 bestKey 的时候，后台负责处理过期 Key 的线程可能已经将该 Key 删除了，所以在 performEvictions() 函数中会有一个检查 dictEntry->value 的行为，可以避免没有意义的删除操作。

**第 4 步**，Redis 会从 EvictionPoolLRU 这个数组尾部选取 bestKey 进行淘汰，具体淘汰操作就是调用前文介绍的 dbAsyncDelete() 进行异步删除，或是调用 dbSyncDelete() 进行同步删除，这里不再重复。

**第 5 步**， performEvictions() 函数每淘汰 16 个 Key，就会检查一下内存大小是否已经满足条件，以及淘汰操作是否超时。如果满足条件，就可以停止淘汰了；如果发生超时，则通过 startEvictionTimeProc() 函数启动一个时间事件。待下次主线程处理时间事件时，会再次进入 performEvictions() 函数进行内存淘汰。另外，如果开启了 lazyfree-lazy-eviction 配置项，淘汰的 Key 是被提交到后台线程进行释放的，可能存在一定的延迟，所以这里还要再调用 getMaxmemoryState() 函数，检查一下 Redis 内存使用情况，如果内存充足，就会立刻结束淘汰逻辑。

**第 6 步**，如果经历了上述淘汰逻辑之后，淘汰了所有能淘汰的 Key，但是 Redis 内存占用量依旧超过 maxmemory 这个阈值，那么 Redis 就做`最后一次努力`：performEvictions() 函数会看看 BIO_LAZY_FREE 类型队列中，是否有等待后台线程删除，如果有的话，可以阻塞一小段时间等待后台线程删除一些 Key，释放一些空间，然后再次检查内存使用情况，要是内存占用量能够恢复正常，performEvictions() 函数还是会返回 EVICT_OK。

## 总结

这一节中，我们重点介绍了 Redis 内存淘汰机制的相关内容。首先介绍了 Redis 目前支持的 8 种内存淘汰策略，以及这些内存淘汰策略的原理，然后讲解了 Redis 内存淘汰策略的核心原理，其中重点分析了 lru 字段在不同淘汰策略下的含义，以及 LRU、LFU 两种淘汰策略的核心实现。

对 Redis 7 内核部分的讲解，到这里就暂时告一段落，本模块的重点在于一个单机 Redis 是如何运行的，分析了单机 Redis 的线程模型、事件模型、整个请求-响应的处理流程，以及 Key 过期和 8 种淘汰策略。在后面还会有单独的章节，对 Redis 的主从、Sentinel、Cluster 进行介绍。

下一模块，我们相对轻松一点，会重点介绍 Redis 中几类核心命令的具体实现。