
在前面的文章中，我们已经介绍完了 Redis 中的 String、List、Hash、Set 这四种核心数据结构的命令以及应用场景。本讲作为本模块的最后一节，我们将介绍 `Redis 中独有的一种数据结构` —— **Sorted Set（也被称为 ZSet）** 的核心命令以及实战应用。


下图对 Sorted Set 相关的命令进行了一个简单的分类，本节也将按照这个分类进行介绍。




![未标题-1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0377b2047c44cfbac9744629b1db23b~tplv-k3u1fbpfcp-watermark.image?)


## Sorted Set 命令详解

如上图所示，按照命令执行效果，我们可以将 Sorted Set 的相关命令划分为`基础命令`、`弹出命令`、`范围查询`、`集合操作`四大类。


下面我们先来介绍基础命令这一个分类。


### 1. 基础命令

Sorted Set 中最基础的命令就是 `ZADD` 命令，它会向 **Sorted Set 集合里面添加新元素**，ZADD 命令后面可以跟多个元素。


在下面的示例中，就是用 ZADD 命令往 myzset 这个集合里面添加 zhangsan、lisi 两个字符串，同时 zhangsan 这个元素对应的 score 值为 100， lisi 对应的 score 值为 90 ，score 值也被称为“评分”，Sorted Set 中会按照 score 值对元素进行排序。


第一次执行的时候，返回 2，意思就是成功添加了 2 个元素进去；第二次再执行这条命令的时候，返回 0 ，表示这两个元素添加失败了，这是因为 Set 集合的特性就是`相同的元素只能有一个`。

```shell
127.0.0.1:6379> ZADD myzset 100 zhangsan 90 lisi
(integer) 2
127.0.0.1:6379> ZADD myzset 100 zhangsan 90 lisi
(integer) 0
```


添加完成之后，我们可以通过 ` ZCARD  `命令**查看 Sorted Set 中有多少个元素**。下面示例就是用 ZCARD 命令查看 myzset 中的元素个数，返回值为 2，也就是刚才添加的 zhangsan、lisi 两个元素。

```shell
127.0.0.1:6379> ZCARD myzset
(integer) 2
```


除了查看整个 Sorted Set 中，我们还可以通过 `ZCOUNT` 命令，**查看指定 score 范围内的元素个数**。示例如下，我们继续向 myzset 中添加 wangwu、zhaoliu 两个元素，然后使用 ZCOUNT 命令查询 [70, 90] 区间内的元素个数，得到的返回值就是 3。

```shell
127.0.0.1:6379> ZADD myzset 80 wangwu 70 zhaoliu
(integer) 2
127.0.0.1:6379> ZCOUNT myzset 70 90
(integer) 3
```


在 Sorted Set 中，元素是按照其关联的 score 值，由小到大进行存储，如果我们关心**某个指定元素在 Sorted Set 的位置**，我们可以使用 `ZRANK` 命令进行查看。如下所示，score 值越小，返回的下标志值越小，位置越靠前：

```shell
127.0.0.1:6379> ZRANK myzset lisi
(integer) 2
127.0.0.1:6379> ZRANK myzset wangwu
(integer) 1
127.0.0.1:6379> ZRANK myzset zhaoliu
(integer) 0
```


如果要**删除指定的元素**，可以使用 `ZREM` 命令。示例如下，这里在 ZREM 命令之后紧跟的是要删除的 Sorted Set 名称，之后就是要删除的元素名称，ZREM 命令可以一次删除多个元素：

```shell
127.0.0.1:6379> ZREM myzset wangwu zhaoliu
(integer) 2
```


最后，还要介绍两个与 score 操作相关的命令。第一个是 `ZSCORE` 命令，它的功能是**查询目标元素的 score 值**，其对应的**批量版本**命令是 `ZMSCORE` 命令，具体示例如下所示：

```shell
127.0.0.1:6379> ZSCORE myzset zhangsan
"100"
127.0.0.1:6379> ZMSCORE myzset zhangsan zhaoliu
1) "100"
2) "70"
```

第二个命令是 `ZINCRBY`，它的功能是**增加指定元素的 score 值**。下面我们就通过 ZINCRBY 命令，给 zhaoliu 的 score 值增加 20 分：

```shell
127.0.0.1:6379> ZINCRBY myzset 20 zhaoliu
"90"
```



### 2. 弹出命令

在有的场景中，我们需要利用 Sorted Set 集合中**元素按照 score 排序的特性**按序逐个处理元素，此时就可以考虑使用 `ZPOPMAX` 命令（或者 `ZPOPMIN` 命令）按照 score 值从高到低（或者从低到高）的顺序弹出元素。



ZPOPMAX 命令的示例如下，默认弹出 myzset 集合中 score 值最大的元素，也就是 zhangsan 这个元素以及其关联的 score 值 100。

```shell
127.0.0.1:6379> ZPOPMAX myzset
1) "zhangsan"
2) "100"
127.0.0.1:6379> ZPOPMAX myzset  2
1) "zhaoliu"
2) "90"
3) "lisi"
4) "90"
```



**BZPOPMAX 命令（和 BZPOPMIN 命令）是 ZPOPMAX 命令（和 ZPOPMIN 命令）的阻塞版本**，如下示例所示，第一次使用 BZPOPMAX 命令从 myzset 集合中弹出两个元素时，会直接将 myzset 集合中剩余的最后一个 wangwu 元素以及其 score 值弹出。第二次执行 BZPOPMAX 命令的时候，myzset 集合中没有任何元素，就会发生阻塞，阻塞时长由第三个参数指定，单位是秒，示例中阻塞时长为 1 秒。

```shell
127.0.0.1:6379> BZPOPMAX myzset  2 1
1) "myzset"
2) "wangwu"
3) "80"
127.0.0.1:6379> BZPOPMAX myzset  2 1
(nil)
(1.05s)
```



最后，**`ZMPOP 是 Redis 7.0 提供的新命令`**，其完整的命令格式如下，ZMPOP 命令可以从多个 Sorted Set 弹出元素，同时可以通过 MAX 以及 MIN 指定按照 score 顺序进行弹出，还可以通过 COUNT 指定一次弹出的元素个数。

```shell
ZMPOP numkeys key [key ...] <MIN | MAX> [COUNT count]
```


下面是一个简单的示例，我们先恢复 myzset 集合中的数据，然后创建一个 myzset2 集合，最后使用 ZMPOP 命令从两个集合中弹出数据。通过输出可以看出，ZMPOP 命令会按照给定的 Sorted Set 顺序进行查询，在第一个 Sorted Set 集合为空时，才会弹出第二个 Sorted Set 集合中的元素。

```shell
127.0.0.1:6379> ZADD myzset 100 zhangsan 90 lisi 80 wangwu 70 zhaoliu
(integer) 4
127.0.0.1:6379> ZADD myzset2 100 tom 90 lily 80 lucy 70 bob
(integer) 4
127.0.0.1:6379> ZMPOP 2 myzset myzset2 MAX COUNT 3
1) "myzset"
2) 1) 1) "zhangsan"
      2) "100"
   2) 1) "lisi"
      2) "90"
   3) 1) "wangwu"
      2) "80"
127.0.0.1:6379> ZMPOP 2 myzset myzset2 MAX COUNT 3
1) "myzset"
2) 1) 1) "zhaoliu"
      2) "70"
127.0.0.1:6379> ZMPOP 2 myzset myzset2 MAX COUNT 3
1) "myzset2"
2) 1) 1) "tom"
      2) "100"
   2) 1) "lily"
      2) "90"
   3) 1) "lucy"
      2) "80"
```

  


### 3. 范围查询

Redis 为 Sorted Set 提供了三大类范围查询的命令，分别由 ZRANGE、ZRANK、ZSCAN 三个命令以及它们各自的衍生命令构成。



首先来看 `ZRANGE` 命令，其完整的命令格式如下，在 Redis 6.2 版本中，ZRANGE 命令进行了一次升级，可以完全替代 ZRANGEBYLEX 等命令（这也是本小节开头思维导图中 ZRANGEBYLEX 命令被划横线标注为过时的原因）。

```shell
ZRANGE key start stop [BYSCORE | BYLEX] [REV] [LIMIT offset count]
  [WITHSCORES]
```


下面通过几个示例展示一下 ZRANGE 命令的使用。


下面的这条示例命令是按照 score 值从 myzset 中查询 70 到 90 范围的元素，默认按照从低到高顺序输出，同时因为指定了 WITHSCORES 参数，会同时返回元素对应的 score 值。

```shell
127.0.0.1:6379> ZADD myzset 100 zhangsan 90 lisi 80 wangwu 70 zhaoliu
(integer) 4
127.0.0.1:6379> ZRANGE myzset 70 90 BYSCORE  WITHSCORES
1) "zhaoliu"
2) "70"
3) "wangwu"
4) "80"
5) "lisi"
6) "90"
```



下面的这条示例命令使用了 BYLEX 参数，该参数一般是在所有元素的 score 相同的时候，按照元素的字典序进行范围查询，其中的 “[” 表示闭区间，“(” 表示开区间，所以指定范围应该包括 a、b、c、d、e 五个元素，但是后面指定了 LIMIT 1 2，表示从第二个（第一个元素下标是 0）元素开始返回，最多返回 2 个元素，所以返回的只有 b、c 两个元素。

```shell
127.0.0.1:6379> ZADD myzset2 0 a 0 b 0 c 0 d 0 e 0 f 0 g 
(integer) 8
127.0.0.1:6379> ZRANGE myzset2 [a (f  BYLEX LIMIT 1 2
1) "b"
2) "c"
```


在 ZRANGE 命令的下一条示例命令中，我们演示一下 REV 参数的效果，它的含义是`逆序`返回查询结果。其中，第一个注意点是，start 值要大于 end 值，与第一条 ZRANGE 命令示例相比，下面的示例中，70、90 两个参数位置发生了对换；第二个注意点是输出结果逆序了，与第一条 ZRANGE 命令示例的输出相比，下面是按照 score 由高到低输出的。

```shell
127.0.0.1:6379> ZRANGE myzset 90 70 BYSCORE  REV WITHSCORES
]1) "lisi"
2) "90"
3) "wangwu"
4) "80"
5) "zhaoliu"
6) "70"
```

有的时候，我们没法明确知道 Sorted Set 中最大（或最小）的 score 值，我们可以使用 “+inf” 表示最大值，“-inf” 表示最小值；如果是按照元素的字典序排序，可以用 “+” 表示最大值，“-” 表示最小值。例如下面这个示例：

```shell
127.0.0.1:6379> ZRANGE myzset +inf -inf BYSCORE  REV WITHSCORES
1) "zhangsan"
2) "100"
3) "lisi"
4) "90"
5) "wangwu"
6) "80"
7) "zhaoliu"
8) "70"

127.0.0.1:6379> ZRANGE myzset2 + - BYLEX REV
1) "g"
2) "f"
3) "e"
4) "d"
5) "c"
6) "b"
7) "a"
```



最后要说的是，如果 ZRANGE 命令没有指定 BYSCORE 和 BYLEX 参数的话，默认是按照元素下标进行范围查询的，示例如下，从输出也可以看出，Sorted Set 中的元素是按照 score 值从小到大进行存储的。

```shell
127.0.0.1:6379> ZRANGE myzset  0 -1 WITHSCORES
1) "zhaoliu"
2) "70"
3) "wangwu"
4) "80"
5) "lisi"
6) "90"
7) "zhangsan"
8) "100"
```



从思维导图中我们可以看到，ZRANGE 命令还衍生出来很多复合操作，例如，ZRANGESTORE 命令，它会进行范围查询，并将查询结果存储到另一个 Sorted Set 中，这里由于篇幅限制，就不再展开举例介绍了。


### 4. 集合操作

Sorted Set 相关的集合操作与上一讲中 Set 结构相关的集合操作十分类似，主要也是用来计算集合的并集、交集、差集，分别对应了 Sorted Set 中的 ZUNION、ZINTER、ZDIFF 三条命令；这三条分别有一条衍生的复合命令，分别是 ZUNIONSTORE、ZINTERSTORE、ZDIFFSTORE 命令，它们不仅会进行集合计算，还会将得到的结果集存储到指定的 Sorted Set 中。


这三种命令比较简单，也易于理解，就留给小伙伴们自己动手实验一下吧。


## Sorted Set 实战

介绍完 Sorted Set 的基础命令之后，我们接下来一起看一下 Sorted Set 在实战中的应用场景。下图汇总了即将要介绍的`积分排名功能`和`权重排序功能`两个 Sorted Set 常见的功能。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb845ebc3e2c4b569de652f7979afea6~tplv-k3u1fbpfcp-watermark.image?)
  


### 1. 积分排名

积分排名是非常常见的一种功能，比如，直播中的榜单，打赏多的用户就会排到直播间的榜一，打赏第二多的用户是榜二，再比如网游里面的氪金排名、国服战力排行，它们都是给用户添加了一个分数值，然后按照分数值进行排序，所以说，这些场景都非常适合使用 Sorted Set 来存储。


说完了积分排名的需求背景之后，我们编写一个 testSortedSetRank() 单元测试方法，其中使用 players 维护了全部玩家的名称，然后启动一个 updateThread 线程，来模拟玩家完成一局游戏之后是加分还是减分的更新操作，这里使用随机的方式进行模拟比赛结果，当比赛结果大于 1 的时候，表示游戏胜利，游戏胜利加一分，游戏失败不减分。每局游戏结束之后，updateThread 会更新玩家在 NationalRank 这个 Sorted Set 中的 score 值。主程来模拟其他玩家查看国服战力排名，这里只获取前三名的玩家进行展示。

```java
@Test
public void testSortedSetRank() throws Exception {
    List<String> players = Lists.newArrayList(
            "zhangsan", "lisi", "wangwu", "zhaliu", "sunqi");

    Thread updateThread = new Thread(() -> {
        while (true) {
            try {
                int randIndex = ThreadLocalRandom.current().nextInt(100);
                int result = ThreadLocalRandom.current().nextInt(5);
                int i = randIndex % players.size();
                String player = players.get(i);
                int point = (result - 1) > 0 ? 1 : 0;
                System.out.println("对战结果:" + player + "," + point);
                asyncCommands.zaddincr("NationalRank",
                        point, player).get(1, TimeUnit.SECONDS);
                Thread.sleep(2000);
            } catch (Exception e) {
            }
        }
    });
    updateThread.start();

    while (true) {
        try {
            List<ScoredValue<String>> nationalRank = asyncCommands.zrevrangebyscoreWithScores("NationalRank",
                    Range.create(NEGATIVE_INFINITY, POSITIVE_INFINITY),
                    Limit.create(0, 3)
            ).get(1, TimeUnit.SECONDS);
            System.out.println("国服排名:");
            for (int i = 0; i < nationalRank.size(); i++) {
                ScoredValue scoredValue = nationalRank.get(i);
                System.out.println("第" + (i + 1) + "名：" + scoredValue.getValue() + ":" + scoredValue.getScore());
            }
            System.out.println("=========");
            Thread.sleep(5000);
        } catch (InterruptedException e) {
        }
    }
}
```

下面是 testSortedSetRank() 单元测试的输出结果：

```shell

对战结果:wangwu,1
国服排名:
第1名：wangwu:1.0
=========
对战结果:sunqi,1
对战结果:wangwu,1
国服排名:
第1名：wangwu:2.0
第2名：sunqi:1.0
=========
对战结果:zhangsan,1
对战结果:lisi,1
国服排名:
第1名：wangwu:2.0
第2名：zhangsan:1.0
第3名：sunqi:1.0
=========
对战结果:zhangsan,0
对战结果:zhangsan,1
对战结果:zhangsan,1
国服排名:
第1名：zhangsan:3.0
第2名：wangwu:2.0
第3名：sunqi:1.0
=========
```

  


### 2. 延迟消息

在有的场景中，需要我们延迟触发发送一些消息，比如在 OA 场景中，在明天上午十点整的时候，发送一封全员信。还有一些分布式任务的系统中，任务是有优先级的，系统需要先触发优先级较高的任务，然后再触发低优先级的任务。上述这两种场景，都是可以使用 Sorted Set 的方式进行实现的。


下面我们就编写一个 testDelayMessage() 单元测试类，用 Sorted Set 来实现一个秒级的延迟消息队列。下面启动一个 messageCreator 线程，用来产生不同触发时间的延迟消息，并写入到 messageCenter 这个 Sorted Set 集合中。主线程用来模拟延迟消息系统，每秒定时从 Sorted Set 中弹出消息，并发送出去。

```java
@Test
public void testDelayMessage() {
    Thread messageCreator = new Thread(() -> {
        while (true) {
            try {
                // 最长延迟10秒
                int randDelayTime = ThreadLocalRandom.current().nextInt(10);
                long current = System.currentTimeMillis() / 1000;
                long startTime = current + randDelayTime;
                asyncCommands.zadd("messageCenter",
                        startTime, "task_" + startTime).get(1, TimeUnit.SECONDS);
                Thread.sleep(1000);
            } catch (Exception e) {
            }
        }
    });
    messageCreator.start();

    while (true) {
        try {
            Thread.sleep(5000);
            long current = System.currentTimeMillis() / 1000;
            Long zcount = asyncCommands.zcount("messageCenter", Range.create(0, current)).get();
            if (zcount <= 0) {
               System.out.println("没有到期消息");
               continue;
            }
            List<ScoredValue<String>> tasks =
                   asyncCommands.zpopmin("messageCenter", zcount).get(1, TimeUnit.SECONDS);
            for (int i = 0; i < tasks.size(); i++) {
                ScoredValue<String> task = tasks.get(i);
                System.out.println("发送消息:" + task.getValue() + ", " + Double.valueOf(task.getScore()).longValue());
            }
            System.out.println("=====");
        } catch (Exception e) {
        }
    }
}
```

下面是 testDelayMessage() 单元测试执行之后的输出结果，可以看到，消息是按照时间顺序一次触发的：

```shell
发送消息:task_1664686891, 1664686891
发送消息:task_1664686894, 1664686894
发送消息:task_1664686895, 1664686895
=====
发送消息:task_1664686896, 1664686896
发送消息:task_1664686898, 1664686898
发送消息:task_1664686899, 1664686899
=====
发送消息:task_1664686901, 1664686901
发送消息:task_1664686903, 1664686903
发送消息:task_1664686904, 1664686904
=====
```

  


## 总结

本节课程的第一部分，我们重点介绍了 Sorted Set 这种结构涉及到的重点命令，主要有`基础命令`、`弹出命令` 、`范围查询` 以及`集合命令`四大类。其中，**基础命令主要是读写 Sorted Set 集合中的单个元素以及 score 值；弹出命令可以按照 score 值弹出最大或最小的元素；范围查询是 Sorted Set 的重点命令，它支持正序、逆序的范围查询，还可以支持类似于分页的效果；集合操作比较简单，支持了常见的并集、交集以及差集的运算**。


本节课程的第二部分，我们详细讲解了 Sorted Set 结构在实践中的应用，分别介绍了积分排名功能和延迟消息功能。其中，积分排名在直播打赏、游戏积分等很多场景都会使用，用 Sorted Set 实现这两个功能是个不错的选择。延迟消息除了可以处理消息，还可以作为一个优先级使用，无非是把消息换成任务，消息发送时间换成任务优先级而已。

到此为止，Redis 中五大数据结构的核心命令以及相应的实战场景就介绍完了，希望小伙伴们参考本篇提供的这些代码，亲自动手实践一下，做到 “熟练使用” Redis 的层次。