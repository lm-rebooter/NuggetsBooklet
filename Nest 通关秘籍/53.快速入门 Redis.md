前面我们学了 mysql，它是通过表和字段来存储信息的，表和表之间通过 id 关联，叫做关系型数据库。

它提供了 sql 语言，可以通过这种语言来描述对数据的增删改查。

mysql 是通过硬盘来存储信息的，并且还要解析并执行 sql 语句，这些决定了它会成为性能瓶颈。

也就是说服务端执行计算会很快，但是等待数据库查询结果就很慢了。

那怎么办呢？

计算机领域最经常考虑到的性能优化手段就是缓存了。

能不能把结果缓存在内存中，下次只查内存就好了呢？

内存和硬盘的速度差距还是很大的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc9adf9ac5ec440db7f975e70f39df65~tplv-k3u1fbpfcp-watermark.image?)

所以做后端服务的时候，我们不会只用 mysql，一般会结合内存数据库来做缓存，最常用的是 redis。

因为需求就是缓存不同类型的数据，所以 redis 的设计是 key、value 的键值对的形式。

并且值的类型有很多：字符串（string）、列表（list）、集合（set）、有序集合（sorted set)、哈希表（hash）、地理信息（geospatial）、位图（bitmap）等。

我们分别来试一下。

redis 是分为服务端和客户端的，它提供了一个 redis-cli 的命令行客户端。

首先我们把 redis 服务跑起来。

在 docker desktop 搜索框搜索 redis，点击 run，把 redis 官方镜像下载并跑起来。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bed90e72ce364a439e4f45d5e865c5db~tplv-k3u1fbpfcp-watermark.image?)

它会让你填一些容器的信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b257277421a7436a8017fe0dbe7521fd~tplv-k3u1fbpfcp-watermark.image?)

端口映射就是把主机的 6379 端口映射到容器内的 6379 端口，这样就能直接通过本机端口访问容器内的服务了。

指定数据卷，用本机的任意一个目录挂载到容器内的 /data 目录，这样数据就会保存在本机。

跑起来之后是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/582d0b65347146c1acbebe5a7d62b049~tplv-k3u1fbpfcp-watermark.image?)

容器内打印的日志说明 redis 服务跑起来了。

files 里可以看到所有的容器内的文件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71fab8f1376c4d4ebbb3a3e58e99cfce~tplv-k3u1fbpfcp-watermark.image?)

看到这个 mounted 的标志了没？

就代表这个目录是挂载的本地的一个目录。

我们在本地目录添加一个文件。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab7489be4ecf443c9605727b6e778ca9~tplv-k3u1fbpfcp-watermark.image?)

在容器内的 data 目录就能访问到这个文件了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4da5d4a3869b47a89bc14b70854a802c~tplv-k3u1fbpfcp-watermark.image?)

同样，在容器内修改了 data 目录，那本机目录下也会修改。

redis 服务跑起来之后，我们用 redis-cli 操作下。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5511d77862c4df0be4c870610d3013a~tplv-k3u1fbpfcp-watermark.image?)

在 terminal 输入 redis-cli，进入交互模式：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f535910a85940d6aa855cbb89809699~tplv-k3u1fbpfcp-watermark.image?)

我们在这里做下 string 相关的操作：

[文档](https://redis.io/docs/data-types/strings/)里的命令有这么几个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee25f15454884d529d5c1354716ae125~tplv-k3u1fbpfcp-watermark.image?)

set、get 都挺简单：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6666f2c01194f00ad7f45d33a7dfd47~tplv-k3u1fbpfcp-watermark.image?)

incr 是用于递增的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa3391bda1ff4967abecbd2a0da7e8c5~tplv-k3u1fbpfcp-watermark.image?)

平时我们用的阅读量、点赞量等都是通过这个来计数的。

当我存了几个 key 后，可以通过 keys 来查询有哪些 key:

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc2a4df46a7743fcaf63217b4e0f8cc1~tplv-k3u1fbpfcp-watermark.image?)

keys 后加一个模式串来过滤，常用的是 '\*' 来查询所有 key。

然后再来看看 list。

这里我们切换成 GUI 工具吧，那个更直观一些。

这个就像 git 有人喜欢用命令行，有人喜欢用 GUI 工具一样。只是习惯问题，都可以。

我用的是官方的 [RedisInsight](https://redis.com/redis-enterprise/redis-insight/#insight-form)，它号称是最好的 Redis GUI 工具：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb76c702a6274f8f9767e2d7edf595e6~tplv-k3u1fbpfcp-watermark.image?)

输入操作系统信息，还有邮箱、姓名、职业、手机号等信息，就可以下载安装包了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/819a084a320b4c53b48f6ce23917db31~tplv-k3u1fbpfcp-watermark.image?)

安装后就是这个东西：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0f60959a963417ea77766d14a441e43~tplv-k3u1fbpfcp-watermark.image?)

点击 add database：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a4f9bedead8425f9806486e48e92036~tplv-k3u1fbpfcp-watermark.image?)

连接信息用默认的就行：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fccc01b22378427583f85ed9e8ca7a41~tplv-k3u1fbpfcp-watermark.image?)

然后就可以看到新建的这个链接：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e2102f71b1d4995a2b9180c57fdb131~tplv-k3u1fbpfcp-watermark.image?)

点击它就可以可视化看到所有的 key 和值：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c61e73c06a614455a1354a46c0a8f9c9~tplv-k3u1fbpfcp-watermark.image?)

同样也可以执行命令：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98feb670ed9f4014b3954009990e7be7~tplv-k3u1fbpfcp-watermark.image?)

然后我们继续看 list 类型的数据结构：

文档中有这么几个命令：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1619e89d2f334e2da2d7e8e1ed1ef76b~tplv-k3u1fbpfcp-watermark.image?)

我们试一下：

    lpush list1 111
    lpush list1 222
    lpush list1 333

输入上面的命令，点击执行：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c73596768cf74c7a9107ac963de3bd0a~tplv-k3u1fbpfcp-watermark.image?)

然后回到浏览页面，点击刷新，就可以看到新的 key 和它的值：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88f04cf5f768461cbd142679f4c19d7e~tplv-k3u1fbpfcp-watermark.image?)

这就是一个列表的结构。

lpush 是 left push 的意思，执行后会从左到右添加到列表中。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f2032f702e44bb49b1b12075cc7db43~tplv-k3u1fbpfcp-watermark.image?)

rpush 是 right push 的意思，执行后会从右往左添加到列表中：

    rpush list1 444
    rpush list1 555

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c54cb760ee8148b2a45ab8482acf1e45~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0f11e4877dd43d3943767ed063e269e~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5374c51a12474341b9a045ba58d91e87~tplv-k3u1fbpfcp-watermark.image?)

lpop 和 rpop 自然是从左边和从右边删除数据。

    lpop list1

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e971457747f0414690a0dd19d2d63d6b~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/793c9c1ded3247d98f978de84eb03ab7~tplv-k3u1fbpfcp-watermark.image?)

    rpop list1

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5daa6dd06fc45489e270efde4f9f6b1~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/664ec4d6e2914c2bb17908f90190fc68~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/207a39a598cb4cf3bd2497abcbd38a03~tplv-k3u1fbpfcp-watermark.image?)

如果想查看 list 数据呢？

在 GUI 里直接点开看就行，但在命令行里呢？

有同学说，不就是 get 么？

是不行的，get 只适用于 string 类型的数据，list 类型的数据要用 lrange。

    lrange list1 0 -1

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba71621755334dffa10bed76254db23c~tplv-k3u1fbpfcp-watermark.image?)

输入一段 range，结尾下标为 -1 代表到最后。lrange list1 0 -1 就是查询 list1 的全部数据。

接下来我们再来看看 set：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c733928d5b33434b89c3ba7a09cce86a~tplv-k3u1fbpfcp-watermark.image?)

set 的特点是无序并且元素不重复。

当我添加重复数据的时候：

    sadd set1 111
    sadd set1 111
    sadd set1 111
    sadd set1 222
    sadd set1 222
    sadd set1 333

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a9acf78d68543b090cc42ccbb6dde07~tplv-k3u1fbpfcp-watermark.image?)

刷新之后可以看到它只保留去重后的数据：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b4429201a94414ab1fd75ae0b399622~tplv-k3u1fbpfcp-watermark.image?)

可以通过 sismember 判断是否是集合中的元素：

    sismember set1 111

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b659743242241488c2cd288d28080b6~tplv-k3u1fbpfcp-watermark.image?)

    sismember set1 444

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30cfd618e1d04e48850256231ea10aae~tplv-k3u1fbpfcp-watermark.image?)

set 只能去重、判断包含，不能对元素排序。

如果排序、去重的需求，比如排行榜，可以用 sorted set，也就是 zset，：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce19772e642b4919b7ff886d93e652cb~tplv-k3u1fbpfcp-watermark.image?)

它每个元素是有一个分数的：

    zadd zset1 5 guang
    zadd zset1 4 dong
    zadd zset1 3 xxx
    zadd zset1 6 yyyy

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2176bf6d7fe74830ab7d5c2bf7438c10~tplv-k3u1fbpfcp-watermark.image?)

会按照分数来排序：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/421cd8e02b4e4afe94aa0940308f7cc4~tplv-k3u1fbpfcp-watermark.image?)

通过 zrange 命令取数据，比如取排名前三的数据：

    zrange zset1 0 2

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c395196654484daf8acc91efc2a767e4~tplv-k3u1fbpfcp-watermark.image?)

接下来是 hash：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a2fd64df4f841b1a4f4df07ff06fb1c~tplv-k3u1fbpfcp-watermark.image?)

和我们用的 map 一样，比较容易理解：

    hset hash1 key1 1
    hset hash1 key2 2
    hset hash1 key3 3
    hset hash1 key4 4
    hset hash1 key5 5

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec227c5bcc1843e9a98a230c79655618~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad826127a444973ad8afdfb0d702163~tplv-k3u1fbpfcp-watermark.image?)

    hget hash1 key3

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb46984a777b4570882afb133f404a14~tplv-k3u1fbpfcp-watermark.image?)

再就是 geo 的数据结构，就是经纬度信息，根据距离计算周围的人用的。

我们试一下：

    geoadd loc 13.361389 38.115556 "guangguang" 15.087269 37.502669 "dongdong" 

用 loc 作为 key，分别添加 guangguang 和 dongdong 的经纬度

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb961a2e40804fb0ae70ed649a2b8d39~tplv-k3u1fbpfcp-watermark.image?)

你会发现 redis 实际使用 zset 存储的，把经纬度转化为了二维平面的坐标：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc97092460c24503970b0a5fbb19b871~tplv-k3u1fbpfcp-watermark.image?)

你可以用 geodist 计算两个坐标点的距离：

    geodist loc guangguang dogndong

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee479af37ee3401e8fc71ba8b24c5e3a~tplv-k3u1fbpfcp-watermark.image?)

用 georadius 搜索某个半径内的其他点，传入经纬度、半径和单位：

    georadius loc 15 37 100 km
    georadius loc 15 37 200 km

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d971789fad64b4c8ae0cdb7ff188d9c~tplv-k3u1fbpfcp-watermark.image?)

平时我们查找周围的人、周围的 xxx 都可以通过 redis 的 geo 数据结构实现。

一般 redis 的 key 我们会设置过期时间，通过 expire 命令。

比如我设置 dong1 的 key 为 30 秒过期：

    expire dogn1 30

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e93eacff53464d4996aa59dc7f1f806c~tplv-k3u1fbpfcp-watermark.image?)

等到了过期时间就会自动删除：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16598c625f604d8589ae55630509d220~tplv-k3u1fbpfcp-watermark.image?)

想查剩余过期时间使用 ttl：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c7f89da9ea8483eb0f23673fca5718f~tplv-k3u1fbpfcp-watermark.image?)

一些有时效的数据可以设置个过期时间。

redis 的数据结构就先介绍到这里。

所有的命令都可以在官方文档查： <https://redis.io/commands/>

是不是感觉还挺简单的。

确实，redis 学习成本挺低的，过一遍就会了。

回到最开始的问题，我们完全可以查出数据来之后放到 redis 中缓存，下次如果 redis 有数据就直接用，没有的话就查数据库然后更新 redis 缓存。

这是 redis 的第一种用途，作为数据库的缓存，也是主要的用途。

第二种用途就是直接作为存储数据的地方了，因为 redis 本身是会做持久化的，也可以把数据直接保存在 redis 里，不存到 mysql。

当然，因为 redis 在内存存储数据，这样成本还是比较高的，需要经常扩容。

最后，还记得我们跑 redis 的 docker 镜像时指定了数据卷么：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08b2f3a64ea04b228be37ab058ade0d9~tplv-k3u1fbpfcp-watermark.image?)

可以看到它确实把数据保存到了宿主机，这样就不怕再跑一个容器数据会丢了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb00a12ef7d04eee9797bea00a5c070c~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/430f1805625440308a37f8e2db9cce51~tplv-k3u1fbpfcp-watermark.image?)

## 总结

这节我们学习了 redis。

因为 mysql 存在硬盘，并且会执行 sql 的解析，会成为系统的性能瓶颈，所以我们要做一些优化。

常见的就是在内存中缓存数据，使用 redis 这种内存数据库。

它是 key、value 的格式存储的，value 有很多种类型，比如 string、list、set、sorted set(zset)、hash、geo 等。

灵活运用这些数据结构，可以完成各种需求，比如排行榜用 zset、阅读数点赞数用 string、附近的人用 geo 等。

而且这些 key 都可以设置过期时间，可以完成一些时效性相关的业务。

用官方 GUI 工具 RedisInsight 可以可视化的操作它，很方便。

redis 几乎和 mysql 一样是后端系统的必用中间件了，它除了用来做数据库的缓存外，还可以直接作为数据存储的地方。

学会灵活使用 redis，是后端开发很重要的一步。
