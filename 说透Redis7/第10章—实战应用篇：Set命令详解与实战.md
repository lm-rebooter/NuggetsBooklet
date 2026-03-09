在前面的文章中，我们已经介绍完了 Redis 中的 String、List、Hash 三种核心数据结构的命令以及应用场景。这一节，我们将继续介绍 Redis 中另一个数据结构相关的命令 —— **Set 集合**。下图对 Set 相关的命令进行了一个简单的分类，本节也将按照这分类进行介绍。



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f77679eb7824d9ca6c11dc553be72df~tplv-k3u1fbpfcp-watermark.image?)


## Set 命令详解

如上图所示，按照命令执行的效果，可以将 Set 相关的命令划分为`基本操作`和`集合操作`两大类，下面我们先来介绍基础命令这一个分类。

### 1. 基础命令

Set 里面最基础的命令就是 `SADD` 命令，它会**往 Set 集合里面添加新元素**，SADD 命令后面可以跟多个元素。

在下面的示例中，就是用 SADD 命令往 myset 这个集合里面添加 kouzhao、xujie 两个字符串，第一次执行的时候，返回 2，意思就是成功添加了 2 个元素进去；第二次再执行这条命令的时候，返回 0 ，表示这两个元素添加失败了，这是因为 Set 集合的特性就是`相同的元素只能有一个`。

```shell
127.0.0.1:6379> SADD myset "kouzhao" "xuejie"
(integer) 2
127.0.0.1:6379> SADD myset "kouzhao" "xuejie"
(integer) 0
```


添加到 Set 中的元素，我们可以通过 `SMEMBERS` 命令**查看**。下面示例就是用 SMEMBERS 命令查看 myset 这个集合里面的全部元素，返回值为刚刚添加的 kouzhao、xuejie 两个字符串。

```shell
127.0.0.1:6379> SMEMBERS myset
1) "xuejie"
2) "kouzhao"
```


除了一次返回整个 Set 的全部元素，我们还可以用 `SCARD` 命令**查看 myset 集合里面元素的个数**，示例如下，SCARD 命令的返回值为 2。

```shell
127.0.0.1:6379> SCARD myset
(integer) 2
```

接下来是 `SISMEMBER` 命令，它用于**检查一个元素是否存在于 Set 之中**。例如，下面的示例就是用 SISMEMBER 命令检查 “kouzhao” 和 “test” 这两个字符串，返回值为 1，说明 myset 集合中已经包含了该字符串，返回值为 0，则表示不存在。

```shell
127.0.0.1:6379> SISMEMBER myset "kouzhao"
(integer) 1
127.0.0.1:6379> SISMEMBER myset "test"
(integer) 0
```

`SMISMEMBER` 命令是 SISMEMBER 命令的批量版本，可以**一次性检查元素**。在下面的示例中，我们就一次检查 kouzhao、xuejie 两个字符串是否存在于 myset 这个 Set 集合中，返回值的数量与检查的元素数量一致，分别用于表示各个元素是否存在。

```shell
127.0.0.1:6379> SMISMEMBER myset kouzhao xuejie
1) (integer) 1
2) (integer) 1
```

再来看 SPOP 和 SMOVE 命令。`SPOP` 命令是**随机从 Set 里面弹出一个元素**，也可以弹出多个元素。在下面的示例中，我们就通过 SPOP 命令一次从 myset 里面弹出两个元素，在这两个元素都弹出之后，myset 就变成了空集合。

```shell
127.0.0.1:6379> SPOP myset 2
1) "kouzhao"
2) "xuejie"
127.0.0.1:6379> SMEMBERS myset
(empty array)
```

`SMOVE` 命令有点像 LMOVE 命令，它是**把一个元素从一个 Set 集合移动到另一个 Set 集合中**。下面的示例中，我们把 “kouzhao” 这个字符串，从 myset 集合移动到 testset 集合。移动完成之后，我们查看 myset 集合，发现它已经空了，然后再查看一下 testset 集合，发现它里面已经包含了 “kouzhao” 字符串。

```shell
127.0.0.1:6379> SADD myset kouzhao
(integer) 1
127.0.0.1:6379> SMEMBERS myset
1) "kouzhao"
127.0.0.1:6379> SMOVE myset testset kouzhao
(integer) 1
127.0.0.1:6379> SMEMBERS myset
(empty array)
127.0.0.1:6379> SMEMBERS testset
1) "kouzhao"
```

最后一个要介绍的是 `SREM` 命令，它是**从集合里面删除一个指定的元素**。比如，我们从 testset 里面删除 kouzhao 和 xuejie 两个元素，返回 2 ，说明成功删除了这两个元素；用 SMEMBERS 查一下，testset 已经空了。

```shell
127.0.0.1:6379> SADD testset kouzhao xuejie
(integer) 1
127.0.0.1:6379> SREM testset kouzhao xuejie
(integer) 2
127.0.0.1:6379> SMEMBERS testset
(empty array)
```

### 2. 集合命令

Set 结构除了能支持元素的`增、删、改、查`以及`移动`之外，还提供了一些`数学上的集合操作`，例如，求两个 Set 的并集、差集或者交集等。

首先来看 SDIFF 命令和 SDIFFSTORE 命令。


`SDIFF` 命令是**计算多个 Set 的`差集`**。下面看个例子，我们先创建三个 Set 集合，set1 里面有 a、b、c、d 、g 五个元素，set2 里面有 a、c 两个元素，set3 里面有 a、 d、e、f 四个元素。然后，我们用 `SDIFF set1 set2 set3` 这条命令计算 set1 - set2 - set3 的差集，也就是计算在 set1 中但不在 set2 和 set3 中的元素，得到的输出为 b、g 这两个元素。

```shell
127.0.0.1:6379> SADD set1 a b c d g
(integer) 5
127.0.0.1:6379> SADD set2 a c
(integer) 2
127.0.0.1:6379> SADD set3 a d e f
(integer) 3
127.0.0.1:6379> SDIFF set1 set2 set3
1) "g"
2) "b"
```


`SDIFFSTORE` 命令除了 SDIFF 命令求差集的功能之外，还会**把求出来的差集存储到一个新的 Set 里面**。下面的示例中，我们就把`  set1 - set2 - set3 ` 得到的结果集，放到了 result 这个集合里面。通过 SMEMBERS 查询 result 这个集合，就可以看到其中存储了 g、b 两个字符串。

```shell
127.0.0.1:6379> SDIFFSTORE result set1 set2 set3
(integer) 2
127.0.0.1:6379> SMEMBERS result
1) "g"
2) "b"
```


接下来看 `SINTER` 命令，它是**用于计算多个 Set 的`交集`**。下面的示例中，我们计算的是 set1、set2、set3 这三个 Set 的交集，也就是同时存在于 set1、set2、set3 三个 Set 集合中的元素。

```shell
127.0.0.1:6379> SINTER set1 set2 set3
1) "a"
```

`SINTERSTORE` 命令就是把交集的结果放到指定的 Set 里面，这里就不演示了。注意一下，如果执行SINTERSTORE、SDIFFSTORE 命令以及下面要介绍的 SUNIONSTORE 命令的时候，用于存储结果的 Set 集合已经存在了，那存储结果的 Set 会被覆盖掉，这个 Set 中原来的数据都会丢失。

最后来 `SUNION` 命令，它**用来计算多个 Set 的`并集`**；`SUNIONSTORE` 则是计算并集的同时，将并集结果存到指定的 Set 中。下面的示例中，我们使用 SUNION 命令计算了 set1、set2、set3 这三个 Set 的并集，返回值为 a 到 g 七个字符串。

```shell
127.0.0.1:6379> SUNION set1 set2 set3
1) "a"
2) "c"
3) "b"
4) "d"
5) "g"
6) "e"
7) "f"
```


## Set 实战应用

介绍完 Set 相关的命令之后，接下来这一部分，我们就来介绍一下 Set 在实践中的应用，下图汇总了即将要介绍的标签系统、自适应黑白名单两类 Set 应用场景。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51be65a402a5435fb2c5fbcc4d16ffca~tplv-k3u1fbpfcp-watermark.image?)

### 1. **标签系统**

在很多推荐服务中，需要有给各种对象打标签的功能。例如，某某云音乐，会根据用户常听的音乐，给用户打标签，比如有的小伙伴常听《饿狼传说》《情书》 这些歌，可能就会被打上 “张学友歌迷” 的标签；有的小伙伴常听《东风破》《清明雨上》这些歌，可能就会被打上 “中国风” 的标签。

再举个常见的标签系统，我们写的博客或者 B 站这种视频网站，都需要给文章、视频打标签，之后，就可以给具有相似标签的用户进行推荐了。在电商的推荐系统里面，会给用户以及商品打上标签，然后给有类似标签的用户推荐相同的商品。这只是一个非常非常简单的标签推荐模型，真正的标签系统会比这个例子复杂得多。

介绍完了标签系统的概念之后，我们就用 Redis Set 来模拟一个简单的标签系统。

下面我们编写一个 testProductTag() 单元测试方法，具体代码如下，其中会准备几款裙子作为商品库，然后给每个商品打上标签，例如，商品 ID 是 1 的连衣裙， 是夏天穿的短款。给商品打好标签之后，我们开始给用户打标签，线上用户的标签一般是需要结合用户历史浏览数据、用户订单等一系列信息推算出来的。例如，一个用户自身的标签是“女性”“20~30 岁之间”“爱网购”，然后会最近经常搜“裙子”“优惠券”这些关键字，而现在也是夏天，那系统可能就认为小伙伴有极大可能会要买裙子。这里仅仅作为演示，我们就不做复杂的推算模型了，直接给用户 1 打上“夏款”“折扣”的标签，然后算一下用户 1 和各个商品的标签交集，有交集的话，就给这个用户推荐这个商品了。

```java
@Test
public void testProductTag() throws Exception {
    Map<Long, String> productDB = ImmutableMap.of(
            1L, "XX连衣裙",
            2L, "XX长裙",
            3L, "XX半身裙"
    );
    // tag_p前缀加商品ID作为key
    asyncCommands.sadd("tag_p_1", "短款", "A字裙", "夏款")
            .get(1, TimeUnit.SECONDS);
    asyncCommands.sadd("tag_p_2", "春款", "长袖").get(1, TimeUnit.SECONDS);
    asyncCommands.sadd("tag_p_3", "过膝款", "纯棉", "折扣")
            .get(1, TimeUnit.SECONDS);

    long userId = 1;
    // tag_u前缀加用户ID作为Key
    asyncCommands.sadd("tag_u_" + userId, "夏款", "折扣")
            .get(1, TimeUnit.SECONDS);

    for (Long productId : productDB.keySet()) {
        Set<String> result =
                asyncCommands.sinter("tag_u_" + userId,
                        "tag_p_" + productId).get(1, TimeUnit.SECONDS);
        if (CollectionUtils.isNotEmpty(result)) {
            System.out.println("精选页推荐:" + productDB.get(productId)
                    + ",推荐原因:" + String.join(",", result));
        }
    }
}
```


我们执行一下 testProductTag() 这个单元测试方法，看到在用户 1 的精选页里面推荐了两个商品：

```shell
精选页推荐:XX连衣裙,推荐原因:夏款
精选页推荐:XX半身裙,推荐原因:折扣
```

除了商品、视频、文章这种推荐类型的系统需要标签系统外，像微博、朋友圈这类社交类的系统，也需要类似的系统来推算共同关注、二度好友。举个例子，在微博里面张三和我一样，关注了周杰伦、许嵩、张韶涵三位歌手，微博就会认为我们喜欢一样的大 V，也就是共同的意见领袖；这位小伙伴今天又关注了刘德华，微博就会觉得我也可能会喜欢刘德华，会尝试给我推送一些刘德华的微博。


共同关注和二度好友的示例这里就不写了，大概的逻辑是：使用 Redis Set 来存一个人的好友 id，然后通过交集运算，计算两个人是不是关注了相同的好友，然后根据共同好友的数量、特征，决定两人是不是真正的二度好友。


### 2. 自适应黑白名单

Redis Set 在黑白名单方面的应用主要侧重于黑名单这方面。


举个例子，我们之前说使用 Redis Hash 结构实现购物车的功能，其后端架构是下图的样子：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/911d41de3ee84950987efbdc788e8c3f~tplv-k3u1fbpfcp-watermark.image?)

这里用 Hash 表来存储用户的购物车数据。在 Server 收到“添加到购物车”的请求时，会先找到用户对应的购物车 Hash 表，然后从 Hash 表中找到这次要添加的商品，也就是执行一条 HGET 命令，然后看看是在购物车里面新增这个商品条目，还是增加这个商品的个数，最后执行一下 HSET 命令，完成添加商品的操作。


如果有恶意用户不停地往购物车里面添加商品，就会出现一个非常大 Hash 表，这就变成一个典型的`大 Key 问题`了，这种大 Key 多了，会导致 Redis 性能下降。在我们通过风控或者各种其他监控手段发现了这个恶意用户之后，就可以把恶意用户的 userId 写到一个 Redis Set 黑名单里面，在用户每次请求的时候，都会检查一下 userId 是不是在这个黑名单里面，如果在的话，请求直接返回失败，不再读写 Redis。


当然，只是个例子，更常见的场景是用户帐号被盗。比如说在异地登录，或者突然大量下单他平时不感兴趣的商品，被风控检测到，也会可以把 userId 加到一个 Set 黑名单里面，进了这个黑名单 Set 之后，用户做不了任何敏感操作，例如，下单、支付等操作。如果用户需要正常使用，就需要用户进行人脸识别或者短信验证之类的安全认证，安全认证成功之后，userId 才会从黑名单里面移除。


介绍完黑名单的使用场景之后，我们来编写一个 testBlackSet() 单元测试方法来模拟黑名单的使用。在 testBlackSet() 这个单测方法中，使用主线模拟一个用户的购物操作，这个用户每隔一秒调用一下 addProduct 方法。addProduct() 里面做两件事：一件事是检查用户的 userId 是否在 blackUserIds 这个黑名单中，如果存在的话，就会拦截用户的购物操作；另一件事是在黑名单检查通过之后，把商品 id 添加到当前用户的购物车中。

在黑名单检查没通过的时候，这里做了一个简化处理，就是抛出异常，在之后的 catch 里面会调用 faceCheck() 方法，模拟用户做人脸验证的操作。在人脸识别成功之后，就会把当前的userId 从 blackUserIds 黑名单里面删掉，这个用户就可以继续正常购物了。

另外，在 testBlackSet() 方法中，还会启动一个后台线程，来模拟风控服务，它在扫描到当前用户的帐号存在风险时，就会执行 SADD 命令，把用户的 userId 添加到 blackUserIds 黑名单中，从而让主线程跳到人脸识别的流程里面去。

```java
@Test
public void testBlackSet() throws Exception {
    long userId = 1;
    new Thread(() -> {
        try {
            Thread.sleep((1 + ThreadLocalRandom.current().nextInt(10)) * 1000);
            asyncCommands.sadd("blackUserIds", String.valueOf(userId))
                 .get(1, TimeUnit.SECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }).start();
    for (int productId = 0; productId < 10; productId++) {
        // 检查userId是不是在黑名单里面
        try {
            boolean result = addProduct(userId, productId);
        } catch (Exception exception) {
            faceCheck(userId);
        }
        // 购物中
        Thread.sleep(1000);
    }
}

public boolean addProduct(long userId, long productId) throws Exception {
    Boolean isBlack = asyncCommands
            .sismember("blackUserIds", String.valueOf(userId))
                    .get(1, TimeUnit.SECONDS);
    if (isBlack) {
        System.out.println("帐号存在风险，请先去完成人脸验证...");
        throw new RuntimeException("risk user");
    }
    Boolean result = asyncCommands.hset("cart_" + userId,
            String.valueOf(productId), "1").get(1, TimeUnit.SECONDS);
    if (result) {
        System.out.println("添加购物车成功,productId:" + productId);
        return true;
    }
    return false;
}

public void faceCheck(long userId) throws Exception {
    System.out.println("人脸验证中...");
    Thread.sleep(10000);
    System.out.println("人脸验证完成...");
    asyncCommands
            .srem("blackUserIds", String.valueOf(userId)).get(1, TimeUnit.SECONDS);
}
```


下面执行一下 testBlackSet() 方法可以看到，主线程会先是把几个商品加到了购物车里面，后面风控线程会把 userId 加到 blackUserIds 黑名单里面了，导致主线程购物逻辑就会被打断，强制做人脸验证。等待用户人脸验证成功之后，就可以正常购物了。

```shell
添加购物车成功,productId:0
添加购物车成功,productId:1
添加购物车成功,productId:2
添加购物车成功,productId:3
添加购物车成功,productId:4
帐号存在风险，请先去完成人脸验证...
人脸验证中...
人脸验证完成...
添加购物车成功,productId:6
添加购物车成功,productId:7
添加购物车成功,productId:8
添加购物车成功,productId:9
```

## 总结

本节课程的第一部分，我们重点介绍了 Set 这种结构涉及到的重点命令，主要有`基础命令`和`集合命令`两大类。其中，**基础命令主要是操纵 Set 集合中的单个元素，集合命令主要是多个 Set 之间的集合运算**。


本节课程的第二部分，我们详细讲解了两个 Redis Set 结构在实践中的应用，分别是`标签系统`和`自适应黑白名单`。其中，标签系统是一个简易的 Demo，可以帮助你更好地理解 Set 集合命令的使用，自适应黑白名单则是可以直接应用到生产中的功能。希望小伙伴们参考本节提供的这些代码，亲自动手实践一下。
