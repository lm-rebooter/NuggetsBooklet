小伙伴们，大家好，通过本小册的学习，相信小伙伴们已经对 Redis 的底层原理有非常全面、非常深刻的理解。这些知识非常重要，活学活用、与实战结合、最终服务业务，才是我们花费大力气来学习这些知识的最终目的，这才算真正点亮了 Redis 技能树。


在小册的最后，我就带领小伙伴们一起，来看一个我在实际工作中遇到的问题 —— **Redis 热 Key 问题**，以及解决这个问题的多种方案。当然，这个案例本身的价值有限，但是解决问题的思路，非常值得总结：

```
分析问题本质 -> 如何感知/发现问题 -> 应用基础知识设计多套方案 -> 思考方案优劣势 -> 选择合适的方案
```


## 分析问题本质：热 Key 的场景介绍

有的小伙伴可能会很疑惑，为什么 Redis 已经是纯内存的存储了，出现了热 Key 还扛不住吗？在解释这个问题之前，我们通过几个例子来说明热 Key 问题的本质。


假设我们有一个电商项目，用 Redis 缓存了商品的信息，然后在双十一大促的时候，会有很多商家各种限时抢购，开启抢购的一瞬间，就会有非常大的流量来查看某件促销产品的信息，流量会大到 Redis 扛不住，也就是我们说的热 Key 问题。


再比如说像微博这种社交新闻类的服务，出现了类似明星官宣这种热点新闻，就可能会有海量的转发和阅读，这个时候，这个新闻在 Redis 中对应的 Key，就是` 热 Key  `了。


说明白热 Key 是什么之后，需要再来关注一下热 Key 带来的问题。

-   最直接的问题就是 Redis 扛不住这么大的流量，我们线上的 Redis 一般都是 Proxy + Redis 分片集群或者是 Redis Cluster（Redis Cluster 的原理可以回顾小册前面 56 ~ 60 节的内容），但是热 Key 只存在于单机里面，性能有上限，面对大流量，单机是扛不住的。

-   再就是网络拥塞，即使单机 Redis 抗住了，也会出现网络流量的倾斜，就像下面这张图，Redis Cluster 里面有一个节点存在热 Key，访问 Master1 这个节点的流量，会比其他节点高很多，也就出现了倾斜。如果有多个热 Key 聚集到了一个 Redis 节点，情况会更加恶劣。

    
<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aa6180ddb654111b611d246afe2fb9b~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

-   无论是网络打满，还是 Redis 节点被打挂了，都会导致 Redis 缓存失效，击穿到底层的数据库，然后把数据库拖垮，整个服务就跪了。



**通过上面一系列的分析，我们得到了问题的本质：热 Key 访问流量大，大到单机 Redis 扛不住。**




## 如何感知/发现问题：热点 Key 探测方案

如果能在设计阶段预估 Key 的流量，那我们自然是会做一些预案来处理这些热点 Key，但是商家的活动可能是不定期的，突发的热点新闻也是无法控制的，也就无法提前预估。**那就进入了我们的第二个议题，如何感知/发现问题，在这个案例中，就是如何及时发现热 Key 。**



### 收集 Key 访问频次

要知道一个 Key 是不是热 Key，无非就是看访问这个 Key 的次数，在整个访问 Redis 的链路上，我们都可以来做这个统计，比如：

-   可以对现有的 Redis 的客户端，比如，Jedis、Lettuce，进行二次开发或者包一层，统计单机上的 Key 访问情况。然后，上报到一个独立的热 Key 探测服务进行汇总分析。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30fe3a348410497babbd6f01976e4bed~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

-   如果公司里面已经存在 Redis Proxy，也可以考虑在 Proxy 上做热 Key 的统计。和客户端改造的方案一样，Redis Proxy 也都是部署多个无状态的实例，只能统计自身的 Key 访问情况。最终，还是要上报到热 Key 探测服务。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3e0940bbfc044a0ad807508a4c9c70a~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

-   我们还可以考虑使用抓包的方式来收集热 Key 的访问情况，这种方式不是很推荐。比如说使用 tcpdump 抓包，抓出来的包我们需要自己按照 RESP 协议进行解析，而且抓包会降低服务的性能，一般都是在排查问题的时候，临时抓一下。

-   最后，还可以考虑在 Redis 这一层做一些改造，比如改造 Redis 代码，做一些热 Key 的统计，这个成本和要求就有亿点点高了。
-   再或者利用现有的工具，比如 redis 命令行里面的 --hotkeys 参数，它会扫描 Redis 里面全部的 Key，时效性比较差，而且还要求 Redis 必须使用 LFU 淘汰策略，怎么说呢，这个工具有点用，但不多。


所以，我个人还是倾向使用`客户端改造方案`或者是 `Proxy 的方案`。

  


### 热 Key 探测服务

接下来，我们把目光放到热 Key 探测服务上。我们这里选用的是 Redis 客户端改造方案，热 Key 探测服务的整个架构图是这样的：


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8fe82ddc707499687716a8a915d2fb5~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>



首先，我们定义一个**通用的 Key 上报的协议**，要包含采集和上报时间、上报的这些数据来自哪个业务服务、还有就是 Key 访问的次数。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e92e3d6c95fa4424860b5707e1c699b8~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>


比如，可以设计成这种按行分隔的协议，第一行是一个头信息，有 4 个字段，分别是采集时间戳、上报时间戳，还有上报数据的 serviceId 和 hostId，用来表示哪个服务的哪个机器，在什么时间采集了数据，什么时间报上来的；第二行开始，就是具体的上报内容了，先用 redisClusterId 说明 Key 归属于哪个 redis 集群，然后就是每个 Key 的访问次数。一个服务可能访问多个 Redis 集群，所以第二部分可以重复出现。小伙伴们可以根据实际需求，扩展或者修改这个协议。

```
# collectTs,sendTs,serviceId1，hostId1
# redisClusterId1
key1:4455,key2:467,key3:4895
key4:423,key8:1500,key93:1400
# redisClusterId2
key2:23,key873:10,key923:1730
```



上报方式可以是长连接、RPC 、Kafka 或者 Http 请求，上报的频次的话，一般做到分钟级别就可以了。


有了协议之后，我们再看这个收集模块：


<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7eb1a8902f94cc7abfa21cc91a2d2a4~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>


这个模块里面，我们要做下面几件事情：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0493756347964780bd57dd705b4c545a~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>



首先会按照协议解析上报请求，那些解析失败的、或者过期的上报请求，统统拦截掉。解析好的数据会暂存到一个集中存储里面，这里我们以 Redis 为例。在暂存的时候，需要对上报数据进行格式上的转换，比如，我们把 redisClusterId + Key 作为键值，Value 设计成一个 Hash 结构，里面的 field 设计成 serviceId + hostId ，value 存访问的次数。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d4a5a7b8aba482e8f268403dd1909bc~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>



收集器还要给每个 Key 设置一个**定时器**，可以考虑用`时间轮 + Redis ZSet` 的方式实现。在一个 Key 第一次上报的时候，就可以设置一分钟左右的定时器，为了防止大量定时器同时到期，我们可以加个 random（10 秒）的时间窗口。这一分钟的时间，足够其他访问这个 Key 的机器，把自身统计数据报上来了。


等定时器触发的时候，会触发统计服务，到集中存储里面拉取这个 Key 的访问次数，进行汇总统计。汇总统计之后的 Key 访问数量，会结合热 Key 处置策略，进行下发到 Redis 客户端。


<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf3bfea545904026a41a068583b8556f~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>



最后，热 Key 探测服务还需要一个**控制台**，用来做一些配置的维护。比如，发现热 Key 应该采取什么策略，根据 Key 热度的不同，也可以采用不同的策略。控制台还可以展示一些热 Key 报表之类的信息等等，这就看小伙伴们的需求了。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60c13607a200498cb52ef7f24868e4e0~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>



## 应用基础知识与优劣势思考：热 Key 处理方案

**能够在线上自动感知/发现问题之后，我们就要应用基础知识来解决具体问题了**。结合这个案例，通过热 Key 探测服务发现热 Key 之后，会给 Redis 客户端发送一个热 Key 的处理策略。主要分为本地缓存方案和热 Key 冗余方案，每个策略会有很多可以调整的规则：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab4923d78e2a4fb2a9796a225631c55c~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>



### 本地缓存方案

首先来看本地缓存这个处理策略。在探测服务发现热 Key 之后，会根据 serviceId 以及 hostId，向对应服务的机器下发一个策略。当然，在上报 Key 访问数据到下发策略之间，可能会有机器的上下线，这个时候，我们就需要依赖应用树这些基础服务，来获取服务的最新机器列表，然后进行下发了。


下发策略的方式有很多，比如，公司已经有了现成的配置中心，我们只需要将下发策略更新到配置里面，就可以动态下发到服务的机器上了；再或者用开源的组件，比如 zookeeper，让服务监听一个约定的 zk 节点，热 Key 探测服务把策略写到这个 zk 节点里面就行了。


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc6ccd9e942a4ac48fcb917427f624c5~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>



本地缓存处理策略我们可以定义成一个 json，里面会告诉 Redis 客户端，把这些热 Key 加载到本地缓存里面，同时也会修正一些本地缓存的配置，比如，本地缓存的大小、淘汰策略。



```json
[
    {
        "strategy":"LocalCache",     // 本地缓存热Key处理策略 
        "cacheSize":1024, 
        "expireTime":3600,
        "expireStrategy":"LRU",
        "consistent":true,
        "keys":[
            "hotKey01", "hotKey02", "hotKey03"
        ]
    }
]
```



Redis 客户端在查一个 Key 的时候，先走本地缓存，本地缓存命中，直接返回；本地缓存 miss 之后，才会走 Redis。这样的话，热 Key 的绝大多数流量，都会被本地缓存拦截掉。


本地缓存因为少了网络请求、序列化、反序列化等一系列开销，能支撑非常大的请求量，可以横向扩展，不像 Redis 那样，热 Key 会倾斜到一台机器上。


缺点的话，也比较明显，本地缓存的空间比较有限，如果热 Key 比较多或者比较大，会出现加载到本地缓存没多久，就被淘汰的情况，也就是常说的抖动问题。当然，这也是有相应解决方案的，我们可以改造本地缓存的实现，使用“内存 + 磁盘”的方式实现，内存满了写到磁盘存储上，RocksDB 就是个不错的 KV 磁盘存储，这样就实现一个本地内存 + 本地 SSD 磁盘高性能的缓存，也就突破了内存空间的瓶颈，但是这个方案复杂性就会高一点。**这里，我们也完成了方案优劣势的思考。**



### 一致性问题

多引入本地缓存，也会出现一致性问题，这其实和我们常说的 DB 和缓存的一致性问题差不太多，解决的思路也差不多，我们只要保证最终一致性就可以了。


我们可以监听 MySQL 的 binlog，在监听到热 Key 变更的时候，把 Redis 里面对应的 Key 更新掉，之后呢，也给客户端发送 Key 更新消息。客户端会把本地缓存里面对应的 Key 删掉，然后重新从 Redis 里面加载这个 Key，这样的话，就可以保证一致性了。如果中间任意一步出现失败，都打点报警，也可以根据场景，决定能不能重试。


这里千万注意，不能用删 Key 的方式去重新加载热 Key，因为热 Key 的击穿，无论是对下游的 Redis，还是下游的 MySQL，都是不太友好的，可能拖垮下游存储。


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d6aef962aec42b9ab4155f1860e2bff~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>


如果我们架构里面，是拿 Redis 做存储的，没有 MySQL 这种存储，那我们就去监听 Redis 的 aof 日志就行了，原理也是一样的。


### 冗余 Key 方案

在 Redis 客户端引入本地缓存，可能对有的小伙伴来说，开发成本有点高。那我们可以考虑使用冗余 Key 方案，这个策略的核心思想是**在发现热 Key 的时候，把热 Key 的数据复制多份，然后打散到多个 Redis 实例**。比如，我们的冗余规则是加后缀，在发现 product_100 是一个热 Key ，探测服务会拷贝这个热 Key，拷贝出来的两个新 Key 分别叫 product_100_1、product_100_2，这两个新 Key 按照 Redis Cluster 对 Key 的哈希规则，会散落到不同的 Redis 实例上。


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23e284881b6e40d2b170ed585f6461f1~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>



完成拷贝之后，探测服务会给读取热 Key 的客户端，下发一个冗余 Key 的关系表，格式类似于下面这个 Json ：

```json
product_100:[product_100_1,product_100_2]
```



客户端之后要读取 product_100 这个热 Key 的时候，会先 random()%3 一下，决定 Key 的后缀，然后再访问对应的 Redis 实例。这样，每个实例只承载热 Key 一部分的读取流量。


在一致性方面呢，冗余 Key 的策略也可以采用监听 binlog 的方案，我就不多说了。冗余 Key 策略的优点就在于简单，不引入本地缓存，缺点就在于重复存储了热 Key 的数据。**这里是我们对冗余 Key 方案优劣势的思考。**



## 总结

这一节，通过分享 Redis 热点 Key 的解决方案，让小伙伴们理解 Redis 知识与业务结合的重要性，也帮小伙伴们梳理了处理问题的思路：**分析问题本质 -> 如何感知/发现问题 -> 应用基础知识设计多套方案 -> 思考方案优劣势 -> 选择合适的方案**。


我们先分析问题本质，理解热点 Key 是如何产生的；然后考虑如何在线上自动感知/发现问题，也就是这里介绍了的 探测 Redis 热点 Key 以及相关的服务架构，小伙伴可以根据这个架构进行扩展；最后讲解了热 Key 的两个处理方案，一个是本地缓存策略，另一个是冗余 Key 的策略，这就是应用基础知识的步骤。同时，还介绍了这两种策略在数据一致性方面的处理，这就是思考方案优劣势的步骤。最后选择哪种方案，就看小伙伴们面对的具体场景了。