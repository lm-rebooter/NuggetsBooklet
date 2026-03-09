上一节中，我们介绍了操作 List 的五大类命令，对每一个命令都做了详细的演示，并分析了每个命令的特性和应用场景。

这一节，我们就来看看 Redis List 数据结构在实战中的应用场景，这里主要介绍`消息队列`、`提醒功能`、`热点列表`三个实战场景，如下图所示：



![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91b7858e43dd4b2c95191ceed140255e~tplv-k3u1fbpfcp-watermark.image?)


## 消息队列

Redis List 最简单的一个应用场景就是**利用 List 先进先出的特性**，做一个消息队列。

我们先创建一个 ListTest 测试类，专门用来写 List 的单元测试，然后把之前连 Redis 的 before() 方法和 after() 方法拷贝过来，具体代码如下所示：

```java
public class ListTest {

    private static RedisClient redisClient;

    private static StatefulRedisConnection<String, String> connection;

    private static RedisAsyncCommands<String, String> asyncCommands;

    @Before
    public void before() {
        redisClient = RedisClient.create("redis://127.0.0.1:6379/0");
        connection = redisClient.connect();
        asyncCommands = connection.async();
        // RedisCommands<String, String> syncCommands = connection.sync();
    }

    @After
    public void after() {
        connection.close();
        redisClient.shutdown();
    }
}
```


下面我们写两个单元测试方法。一个是 MQProducerTest() 方法，它里面是用 `LPUSH 命令`从 List 的左侧写入元素，模拟生产者生产数据，具体代码如下：

```java
@Test
public void MQProducerTest() {
    while (true) {
        try {
            Thread.sleep(1000L);
            String element = "element" + System.currentTimeMillis();
            Long size = asyncCommands.lpush("mq-test", element)
                    .get(1, TimeUnit.SECONDS);
            System.out.println("Producer:写入" + element + "，当前MQ长度:" + size);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```


另一个单元测试方法是 MQConsumerTest() 方法，它里面是用 `BRPOP 命令`从 List 里面弹出元素，模拟的是消费者消费数据，具体如下：

```java
@Test
public void MQConsumerTest() {
    while (true) {
        try {
            KeyValue<String, String> keyValue = asyncCommands.brpop(1, "mq-test")
                    .get(2, TimeUnit.SECONDS);
            if (keyValue != null && keyValue.hasValue()) {
                System.out.println("Consumer:从【" + keyValue.getKey()
                        + "】队列中消费到【" + keyValue.getValue() + "】元素");
            } else {
                System.out.println("Consumer:没有监听到任何数据，继续监听");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```


注意一下，这里 asyncCommands.brpop() 方法的返回值，这个 KeyValue 里面的 Key 是 List 的名称，Value 才是弹出的元素值，要是 brpop() 没有监听到任何数据，返回的 KeyValue 会是 null。


上面两个单元测试组合起来，就是一个**生产者消费者模式的系统**，大概原理如下图所示：



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/224b6512a68e4f5a85aa60cdd1a4ef6a~tplv-k3u1fbpfcp-watermark.image?)


下面我们先启动 MQProducerTest 这个单测，输出如下所示，这个生产者线程在不断地向 mq-test 这个 List 里面写入数据。

```shell
Producer:写入element1651818430721，当前MQ长度:1
Producer:写入element1651818431727，当前MQ长度:2
Producer:写入element1651818432729，当前MQ长度:3
Producer:写入element1651818433731，当前MQ长度:4
Producer:写入element1651818434737，当前MQ长度:5
Producer:写入element1651818435743，当前MQ长度:6
Producer:写入element1651818436748，当前MQ长度:7
```


然后，我们启动 MQConsumerTest 这个单元测试方法，从下面的输出可以看出，它不停地从 mq-test 里面消费数据。

```shell
Consumer:从【mq-test】队列中消费到【element1651818430721】元素
Consumer:从【mq-test】队列中消费到【element1651818431727】元素
Consumer:从【mq-test】队列中消费到【element1651818432729】元素
Consumer:从【mq-test】队列中消费到【element1651818433731】元素
Consumer:从【mq-test】队列中消费到【element1651818434737】元素
Consumer:从【mq-test】队列中消费到【element1651818435743】元素
Consumer:从【mq-test】队列中消费到【element1651818436748】元素
```


我们也可以扩展一下这个模型，将 “单生产者-单消费者” 扩展成 “多生产者-多消费者”的模式。例如，启动多个 Producer 线程和多个 Consumer 线程，有的小伙伴可能会直接启动多个线程来执行 MQConsumerTest() 方法里面的消费代码，逻辑上是没问题的。


但是，使用 Lettuce 这个客户端的时候，需要注意一个坑：正常情况下，像执行 LPUSH、SET、GET 这些非阻塞的命令，Lettuce 的 Connection 是可以在不同线程之间共享的，但是如果执行 BRPOP 这种阻塞命令，就不能共享 Connection 了。


例如下面这个单元测试中，启动了两个 Consumer 线程，每个线程里面都会执行 BRPOP 命令，监听 mq-test 这个 List。理想状态是，BRPOP 阻塞超时之后，会输出 “Consumer:没有监听到任何数据，继续监听”。

```java
@Test
public void MQTest2Consumer() throws Exception {
    Runnable consumerRunnable = () -> {
        while (true) {
            try {
                KeyValue<String, String> keyValue = asyncCommands
                        .brpop(1, "mq-test")
                        .get(2, TimeUnit.SECONDS);
                if (keyValue != null && keyValue.hasValue()) {
                    System.out.println(Thread.currentThread().getName()
                            + ":从【" + keyValue.getKey() + "】队列中消费到【"
                            + keyValue.getValue() + "】元素");
                } else {
                    System.out.println(Thread.currentThread().getName()
                            + "Consumer:没有监听到任何数据，继续监听");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };
    Thread consumer1 = new Thread(consumerRunnable);
    Thread consumer2 = new Thread(consumerRunnable);
    consumer1.start();
    consumer2.start();
    Thread.sleep(Long.MAX_VALUE);
}
```



启动这个单元测试之后，我们会发现它会不停地抛 TimeoutException 异常，而且是 get() 方法处抛的。这就是因为两个线程共用了一个 Connection 去执行 BRPOP 这种阻塞命令，BRPOP 命令是在 Redis 服务端阻塞的，会和 Connection 本地的 get() 超时时间相互影响。

```shell
Thread-1Consumer:没有监听到任何数据，继续监听
java.util.concurrent.TimeoutException
    at java.util.concurrent.CompletableFuture.timedGet(CompletableFuture.java:1771)
    at java.util.concurrent.CompletableFuture.get(CompletableFuture.java:1915)
    at kouzhao.xuejie.test.ch03.ListTest.lambda$MQTest2Consumer$0(ListTest.java:80)
    at java.lang.Thread.run(Thread.java:748)
    java.util.concurrent.TimeoutException
    at java.util.concurrent.CompletableFuture.timedGet(CompletableFuture.java:1771)
    at java.util.concurrent.CompletableFuture.get(CompletableFuture.java:1915)
    at kouzhao.xuejie.test.ch03.ListTest.lambda$MQTest2Consumer$0(ListTest.java:80)
    at java.lang.Thread.run(Thread.java:748)
    java.util.concurrent.TimeoutException
    at java.util.concurrent.CompletableFuture.timedGet(CompletableFuture.java:1771)
    at java.util.concurrent.CompletableFuture.get(CompletableFuture.java:1915)
```



所以，要启动多个 Consumer 线程，比较简单的方式，**启动多个进程来执行 MQConsumerTest() 这个单元测试方法**就行了。如果要使用多线程的方式执行 MQTest2Consumer() 的逻辑，就需要为每个线程创建专属的 Connection 对象。


## 提醒功能


虽然说 Redis 的 List 可以实现消息队列的效果，但是用 Redis List 来实现消息队列，会有一些问题。例如，一个 Consumer 在消费消息的时候，是直接通过 BRPOP 命令把消息从 List 中弹出来了，在消息弹出之后但未被 Consumer 处理之前，Consumer 可能会宕机，那么这条消息就丢失了。所以说，在线上是很少有人单纯使用 Redis List 去实现消息队列，除非说这个消息是可以接受丢失的。


在有的场景里面，Redis List 可以用来存放提醒类的消息，这类消息不像订单之类的消息，提醒类的消息是`可以接受丢失`的。


例如，我发了一篇博客，有一些小伙伴会来点赞，这个时候，我就会收到点赞提醒。这个点赞的功能就可以使用下图的架构来实现：



![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5a844e552664587bf5ce9597059c110~tplv-k3u1fbpfcp-watermark.image?)

可以看到，在小伙伴点赞的时候，可以把小伙伴的 userId 发到 Redis 的一个 List 里面，然后在我刷新 app 或者是登录 Web 端网站的时候，触发服务端 push 或者是客户端 pull 的模式，批量获取这个点赞 List 的数据，这样就可以在 app 或者 Web 端上，拿到点赞小伙伴的 userId，之后就可以根据 userId 展示点赞小伙伴的用户信息。

下面就通过 testLikeList() 单元测试来模拟这个功能，其中，我们用 createLike 线程来模拟小伙伴们点赞的操作，用 kz 线程来模拟我查看点赞的操作。createLike 线程会隔一段时间生成一个 userId，然后通过 `RPUSH` 把 userId 放到 like-list 这个 List 里面；kz 线程会定时通过 `LRANGE` 命令分批获取点赞的 userId，这里一次只获取前 1000 个点赞信息并进行展示；之后 kz 线程会执行 `LTRIM` 命令，将已展示的 1000 条点赞 userId 截掉，表示已读，下次获取的时候，就能拿到后续的 1000 条点赞提醒了。


testLikeList() 单元测试的具体实现如下：

```java
@Test
public void testLikeList() throws Exception {
    long videoId = 1089;
    final String listName = "like-list-" + videoId;
    Thread createLike = new Thread(() -> {
        for (int i = 0; i < 1000000; i++) {
            try {
                // 不断有小伙伴点赞
                asyncCommands
                        .rpush(listName, String.valueOf(i))
                        .get(1, TimeUnit.SECONDS);
                Thread.sleep(ThreadLocalRandom.current().nextInt(1, 2) * 1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    });
    createLike.start();

    Thread kz = new Thread(() -> {
        while (true) {
            try {
                // 拉取前1000个点赞
                List<String> userIds = asyncCommands
                        .lrange(listName, 0, 1000)
                        .get(1, TimeUnit.SECONDS);
                Thread.sleep(2000);// 2秒钟拉取最新的点赞信息
                System.out.println("小伙伴:[" + userIds + "]点赞了视频" + videoId);
                // 删除已经拉取到的点赞信息
                String s = asyncCommands.ltrim(listName, userIds.size(), -1)
                        .get(1, TimeUnit.SECONDS);
                if("OK".equals(s)){
                    System.out.println("删除成功");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    });
    kz.start();
    Thread.sleep(Long.MAX_VALUE);
}
```


## 热点列表

上面说的两个应用场景其实本质上都是生产者消费者的模式，List 还有一个比较常用的场景就是热点列表。例如，门户网站首页的热点新闻列表，或者是微博上的热门话题列表之类的功能。

下面我们写一个名为 testHotList() 的单元测试，其中会用一个名为 hot-list 的 List 来存储热点话题列表。初始化的时候，先写进去 10 条热点新闻，然后启动一个 changeHotList 的后台线程，随机选择一条热点新闻，用 `LSET` 命令进行修改。最后主线程会模拟客户端，每次取热点列表的时候，会直接用 `LRANGE` 命令把整个 hot-list 里面的热点新闻列表全部取出来进行展示。

```java
@Test
public void testHotList() throws Exception {
    DateTimeFormatter dateTimeFormatter = 
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    asyncCommands.del("hot-list").get(1, TimeUnit.SECONDS);
    // 初始化热点列表
    for (int i = 0; i < 10; i++) {
        asyncCommands.rpush("hot-list",
                "第" + i + "条热点新闻，更新时间:" + dateTimeFormatter.format(LocalDateTime.now()));
    }

    // 启动更新hotList的线程，模拟热点新闻的更新操作
    Thread changeHotList = new Thread(() -> {
        while (true) {
            try {
                int index = ThreadLocalRandom.current().nextInt(0, 10);
                asyncCommands.lset("hot-list", index,
                        "第" + index + "条热点新闻，更新时间:" + dateTimeFormatter.format(LocalDateTime.now()));
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    });
    changeHotList.start();

    // 模拟客户端更新热点新闻的拉取操作
    while (true) {
        List<String> hotList = asyncCommands.lrange("hot-list", 0, -1)
                .get(1, TimeUnit.SECONDS);
        Thread.sleep(5000);// 2秒钟拉取最新的点赞信息
        System.out.println("热点新闻:");
        for (String hot : hotList) {
            System.out.println(hot);
        }
        System.out.println("=========");
    }
}
```


执行这个单元测试方法，就可以看到这种热点新闻列表不断变更的效果：

```shell
热点新闻:
第0条热点新闻，更新时间:2022-05-07 17:25:12
第1条热点新闻，更新时间:2022-05-07 17:25:12
第2条热点新闻，更新时间:2022-05-07 17:25:12
第3条热点新闻，更新时间:2022-05-07 17:25:15
第4条热点新闻，更新时间:2022-05-07 17:25:12
第5条热点新闻，更新时间:2022-05-07 17:25:12
第6条热点新闻，更新时间:2022-05-07 17:25:12
第7条热点新闻，更新时间:2022-05-07 17:25:16
第8条热点新闻，更新时间:2022-05-07 17:25:13
第9条热点新闻，更新时间:2022-05-07 17:25:14
=========
热点新闻:
第0条热点新闻，更新时间:2022-05-07 17:25:12
第1条热点新闻，更新时间:2022-05-07 17:25:12
第2条热点新闻，更新时间:2022-05-07 17:25:18
第3条热点新闻，更新时间:2022-05-07 17:25:15
第4条热点新闻，更新时间:2022-05-07 17:25:12
第5条热点新闻，更新时间:2022-05-07 17:25:21
第6条热点新闻，更新时间:2022-05-07 17:25:12
第7条热点新闻，更新时间:2022-05-07 17:25:16
第8条热点新闻，更新时间:2022-05-07 17:25:19
第9条热点新闻，更新时间:2022-05-07 17:25:20
```


## 总结

这一节，我们以 Java 中的 Lettuce 客户端为例，演示了操作 Redis List 的核心命令，同时给小伙伴们介绍了三个应用 Redis List 比较典型的场景。

-   首先是简易消息队列的场景。虽然我们用 Redis List 的特性，可以实现消息队列的效果，但是在可靠性、一致性等方面会有一些问题，所以在实践中需要做一些额外的工作来进行补齐，或者直接选择成熟的消息队列组件，例如 Kafka、RocketMQ。

-   然后是提醒功能的场景。这种场景依赖 Redis List 缓存提醒信息，结合 Pull/Push 机制，提供了实时接收提醒的功能演示。

-   最后的热点列表场景，重点是在于演示 Redis List 缓存热点集合的能力，并结合演示了 LSET 这种随机命令的使用方式。当然，使用后面介绍的 Sorted Set 集合也能实现热点列表的功能，后面在介绍 Sorted Set 的时候，还会再次提到。
