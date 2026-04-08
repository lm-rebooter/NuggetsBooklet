
在前面的文章中，我们了解了 Redis 的基本功能，通过源码方式安装了 Redis，并搭建了 Redis 的源码运行环境。接下来将进入 “**Redis 的实战应用篇**”，在这部分我们将重点介绍 Redis 核心命令的使用，主要包括 Redis 中 `String`、`List`、`Set`、`Hash` 以及 `Sorted Set` 五大核心数据结构的命令，同时还会分析这五大数据结构的使用场景。


本节作为 Redis 实战应用篇的第一篇，我们重点介绍 Redis 中 String 相关的命令以及应用场景。


## redis-cli 基础使用

在开始正式介绍 String 的相关命令之前，我们需要先了解一下本篇执行 Redis 命令的工具 —— redis-cli。它是 Redis 自带的命令行客户端，可以将命令发送到 Redis 服务端执行并接收命令执行结果。


在上一讲编译好的 Redis 的 src 目录下面，就可以看到 `redis-cli` 这个命令行客户端，如下图所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d6dee2d699848ae9d807a3ff06147d8~tplv-k3u1fbpfcp-watermark.image?)



直接执行这个 `redis-cli` 命令，它就会**默认连到前面启动的 Redis 服务上**。要是连其他远程的 Redis 服务，我们可以用 `-h` 指定 Redis 服务的 IP 地址，然后 `-p` 指定 Redis 的端口就行了。

```shell
./redis-cli -h 127.0.0.1 -p 6379
```


## String 命令

连接上 Redis 之后，我们再来看 Redis 里面关于字符串的命令。我们后续的介绍会尽可能覆盖官网的[文档](https://redis.io/commands/?group=string)给的这些命令，如下图所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/023f08b552694d0cb3cbf10d1ecafd01~tplv-k3u1fbpfcp-watermark.image?)


这里对字符串命令做一个简单的分类，主要分成**五大类**，如下图，有：`基础读写命令`、`批量操作`、`递增操作`、`部分字符串操作`以及`复合操作`的命令。这一节主要就是按照这个分类方式来介绍。



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4238053105541d99c1d784333427c88~tplv-k3u1fbpfcp-watermark.image?)

### 1. 读写命令

字符串儿最简单的命令就是 **`SET`** 和 **`GET`** 命令。SET 命令的话，就是**设置一个键值对**。如下截图，执行一下这个 SET 命令，这个 name 就是 Key，kouzhao 就是 Value 值。然后，GET 命令的话，就可以通过刚才设置的这个 Key 值，获取对应的 Value 值。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebd5fef0d28e48a38e22d871fda02b30~tplv-k3u1fbpfcp-watermark.image?)


这个 SET 命令除了设置 Value 值之外，SET 还可以带其他参数。比如说：

-   `EX 参数`的话，就是给这个 Key 设置一个过期时间，单位是秒。
-   `PX 参数`的话，和 EX 参数类似，唯一的区别就是时间单位变成了毫秒。


来试一下下面这几条命令。下面把 name 设置成 kouzhaoxuejie，把它的过期时间设置成 20 秒，然后我们就可以通过 GET 命令拿到这个 name 的值，还可以通过 TTL 这个命令来看一下这个 name 的过期时间，可以看到这里，它还有几秒钟就过期了。在这几秒钟之内都可以用 GET 命令来拿到这个 name 的值。等一会儿，等这个值过期了，这个时候就会发现啊，TTL 命令返回了 -2 ，这就说明这个 Key 已经过期了；然后再用 GET 命令去拿的时候，就发现拿不到这个 name 的值，因为它已经过期，Redis 就会把它清理掉。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f9657dc97074d34a3fc91c0b2f2d0b1~tplv-k3u1fbpfcp-watermark.image?)


除了 EX 和 PX 两个之外，SET 命令还可以有下面几个参数。

-   `EXAT` 和 `PXAT` 是指定 Key 在某个时间点过期，后面跟的是一个明确的时间戳，意思是到了这个点 Key 就没了。

-   `NX` 是在目标 Key 不存在时候，才写入这个 Key；要是 Key 已存在的话，这个 Key 就写不进去。

-   `XX` 参数的功能正好是和 NX 反着的，XX 参数表示的是 Key 不存在的时候，写不进去。


先来看一下 NX 这个参数。先添加一个 name，Value 值设置成 kouzhao。然后，执行一下 ` SET name kouzhaoxuejie NX  `命令，这个命令的意思就是，如果 name 这个 Key 不存在的话，我们就把它的值写成 kouzhaoxuejie。前面已经设置了 name 这个 Key，所以现在是写不进去的，再执行 GET 命令，看到 name 还是 kouzhao。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75378b76a8404a9aac74549c3a77df8a~tplv-k3u1fbpfcp-watermark.image?)


再来试一下 XX 参数。先查一下 age 这个 Key，发现没有 age 这个 Key。然后我们执行 `SET age 25 XX` 这条命令，意思就是`如果 age 这个 Key 存在的话，才能把它改成 25`，那么这个时候也是写不进去了，因为之前没有设置过 age 这个 Key。看到这个返回是 nil，也就是说那个命令没有执行成功，然后执行 GET age 也返回 nil。接下来我们把 age 的值设置为 0， 然后再执行这条 SET age 25 XX 命令，就能看到修改成功了。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b180a98203c148abae42ec4278529cfe~tplv-k3u1fbpfcp-watermark.image?)


至于 SETNX 命令，如果你感兴趣的话可以自己动手操作一下，这里就不再赘述了。


### 2. 批量操作

除了读写单个字符串，Redis 里面还提供了 **`MSET`** 和 **`MGET`** 两个命令，这两个命令是 **SET、GET 命令的批量版本**，可以一次操作多个 Key 值。


来看一个具体的例子。现在有很多个人的名字要存，name1、name2、name3，里边存的值分别是张三、李四、王五，我们`用 MSET 一条命令全部存进去`。然后用 GET 拿，如下图所示，都成功获取到了，这就说明 MSET 命令写三个 Key 都成功了。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740765bbd2094285ba62eea0129ffa20~tplv-k3u1fbpfcp-watermark.image?)

但一次次 GET 是不是很麻烦呢？这里可以`用 MGET 命令一次把三个 name 全部拿出来`，看这个输出，输出的就是存进去的张三、李四、王五。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30c0157f41b941ed9b522eb241441f38~tplv-k3u1fbpfcp-watermark.image?)


最后一个要说的字符串批量命令是 **`MSETNX`**，它是 **SETNX 的批量版本**，就是**多个 Key 都不存在的时候，可以一把写入多个 Key**。


来看例子，name1 现在是存在的，然后执行 `MSETNX name1 zhaoliu name4 sunqi`，name1 和 name4 这两个 Key 是更新不了的。从下图中可以看出，name1 还是张三，name4 还是不存在。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/969b481c6001469896bf3f6181d54419~tplv-k3u1fbpfcp-watermark.image?)


再来尝试一下 ` MSETNX name4 zhaoliu name5 sunqi  `这条命令，name4 和 name5 这两个 Key 是不存在的，所以能正常写进去。执行一下 MGET 命令，查询一下 name4和 name5 两个 Key，如下图所示，拿到 zhaoliu、sunqi，证明这两个 Key 写入成功了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4bd748e47064f508f66ec7b1d5cecfb~tplv-k3u1fbpfcp-watermark.image?)


### 3. 递增操作

Redis 字符串里面除了放文本，还可以放个数字进去，这个和 Java 里面的字符串一样。比如说，在 Java 里面定一个 name 字符串，存“口罩学姐”：

```java
String name = "kouzhaoxuejie";
```

也可以写一个 age 字符串，存 “25 ”这个字符串：

```java
String age = "25";
```

这两行代码都能编译过的。

在 Redis 里面也是一样，我们可以用 `SET age 25` 把 age 这个 Key 的值设置成 25，这也是没问题的，Redis 高级的地方就在于它能自己感知到这个 age 是个数字，然后允许我们对这个 age 进行加减操作。比如说，可以用 **`INCR 命令`**和 **`DECR 命令`** 对这个 age 进行**加一**和**减一**操作。

> 这里多说一句，INCR 是 increment 的缩写，就是“加”的意思；DECR 是 decrement 的缩写，是“减”的意思。


如下图，执行 INCR age 命令后，用 GET 命令再次查询 age 的时候它的值会加了 1；然后，DECR age 命令执行之后，age 值是会减了 1。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9b5e0b8fd1943bf962b1d7e656c920f~tplv-k3u1fbpfcp-watermark.image?)


除了加 1 和减 1 外，Redis 还提供了 **`INCRBY`** 和 **`DECRBY`** 两个命令，这两条命令后面可以指定加多少、减多少。


举个例子，今天有 1000 个粉丝，然后又有 100 个小伙伴来关注了我，对应的命令就是 `INCRBY fans 100`；然后，有 2 个小伙伴取关了，对应的命令就是 `DECRBY fans 2`，最后还剩 1098。相应的命令如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b747a933438647db86320fdfc242f338~tplv-k3u1fbpfcp-watermark.image?)


### 4. 操作部分字符串

Redis 还提供了一些操作部分字符串的命令，`但在实际场景中用得不是特别多，了解一下就可以了`。


首先是 **`APPEND 命令`**，它是**往一个 Key 里面追加一个字符串**，和 Java 字符串的 append() 方法一个意思。在下图中，name 这个 Key 是 kouzhao，然后我们用 APPEND 命令把 xuejie 追加到 name 里面，name 就变成了 kouzhaoxuejie 了。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47aa22f7c2474456a25f64e123f3f734~tplv-k3u1fbpfcp-watermark.image?)


**`GETRANGE 命令`是取字符串的一部分值返回**，和 Java 里面 substring() 方法的功能一样。我们来看下图这个例子，需求是要获取 kouzhaoxuejie 中 xuejie 这部分的字符串，也就是需要获取 name 字符串里面下标在 7 到 12 的部分。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/155da43c1ec24acda49fccb8ecd817e1~tplv-k3u1fbpfcp-watermark.image?)

**`SETRANGE 命令`**，功能是**指定一个下标，然后用传进去的字符串，替换这个下标后的内容**。下图就是我们用 kz 来替换 kouzhaoxuejie 中的前两个字符，这个 SETRANGE 命令是从 name 里面的 0 这个位置开始替换，可以看到开头的 ko 两个字符被替换成了 kz，剩下的字符完全没有变。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71e8075501744614b8654551fc69e1d1~tplv-k3u1fbpfcp-watermark.image?)


### 5. 复合操作

复合操作其实就是上面几个命令的**组合**，常用的有`三个命令`：GETDEL、GETEX 和 GETSET。其实通过命令的名称，你估计就把命令的功能猜个差不多了。

**`GETSET` 是 GET 和 SET 两个命令的组合**。下图是一个使用 GETSET 命令的示例，GETSET 命令的意思是，返回当前这个 name 的值，也就是返回 kouzhaoxuejie，然后同时用 zhangsan 来覆盖 name 的值，这个时候再查 name 这个 Key，拿到的就是 zhangsan 了。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3bd25bd7b0c478ab0ff983595474d3e~tplv-k3u1fbpfcp-watermark.image?)


**`GETEX 命令`的意思是，获取 Key 的值，同时给 Key 设置一个过期时间**。来看下图的例子，我们这里获取 name 的同时，把 name 这个 Key 的过期时间设置成 10 秒。我们用 TTL 命令可以看到 name 剩余的过期时间不断在减少，最后返回一个 -2，就表示 name 过期了。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b8e8338a48148159ef8b1d327c614b4~tplv-k3u1fbpfcp-watermark.image?)


**`DEL 命令`是删除一个 Key，`GETDEL 命令` 就是先获取一个 Key 的值，同时删除这个 Key 的值**。如下图所示，这里我们用 GETDEL 命令读取 name 值的时候，就把它一并删除了，再用 GET 命令查，就查询不到了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad4bd7a57fa4844848991dd9bc46c60~tplv-k3u1fbpfcp-watermark.image?)


## 使用场景

介绍完了 Redis 字符串命令之后，我们接下来要介绍一下`在什么场景下可以考虑使用 Redis 字符串`，同时结合 Lettuce 客户端，看看`如何在 Java 里面执行 Redis 字符串命令`。


我们会通过三个示例来介绍一下 Redis String 命令在实际场景中的应用，下图列举了这三个示例，分别是：用 Redis 的 String 结构缓存一个 Java 对象、实现分布式的效果以及实现限流的效果。



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48d3e1b81b894756aede315279ce9bae~tplv-k3u1fbpfcp-watermark.image?)


我们这里先创建一个 Maven 项目 lettuce-demo，然后 pom 文件里面加上 lettuce 的依赖，现在最新的版本已经到 6.1.8 了。后面还要用 JSON 序列化，还有 Junit 写单测，这里也加一下这两个依赖。

```XML
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>lettuce-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>
    <dependencies>
        <!-- lettuce依赖-->
        <dependency>
            <groupId>io.lettuce</groupId>
            <artifactId>lettuce-core</artifactId>
            <version>6.1.8.RELEASE</version>
        </dependency>
        <!-- json依赖-->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.13.1</version>
        </dependency>
        <!-- junit依赖-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.1</version>
        </dependency>
    </dependencies>
</project>
```



### 1. 缓存对象


Redis 最常被用作缓存，那如果我要用 Redis 缓存一个 Java 对象，应该怎么做呢？我们常用的方式是把 Java 对象序列化，然后作为字符串存储到 Redis 里面。


我们就简单模拟一个商品信息缓存的场景，创建一个商品类 Product，里面定义商品的名称、价格以及商品的描述信息，然后生成一个`  toString() ` 方法：

```java
public class Product {
    private String name;
    
    private double price;
    
    private String desc;
    
    // 省略getter/setter方法
    
    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Product{");
        sb.append("name='").append(name).append('\'');
        sb.append(", price=").append(price);
        sb.append(", desc='").append(desc).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
```



我们写个单元测试，该单元测试的名字叫 testCacheProduct()，具体代码如下：

```java
public class RedisTest {

    @Test
    public void testCacheProduct() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        Product product = new Product(); // 创建Product对象
        product.setName("杯子");
        product.setPrice(100d);
        product.setDesc("这是一个杯子");
        String json = objectMapper.writeValueAsString(product);

        RedisClient redisClient = RedisClient.create("redis://127.0.0.1:6379/0");
        StatefulRedisConnection<String, String> connection = redisClient.connect();
        RedisAsyncCommands<String, String> asyncCommands = connection.async();
        asyncCommands.set("product", json).get(1, TimeUnit.SECONDS);
        
        // RedisCommands<String, String> syncCommands = connection.sync();
        // syncCommands.set("product", json);

        connection.close();
        redisClient.shutdown();
    }
}
```



其中会先创建一个 Product 对象，然后设置一下它的字段，再拿 ObjectMapper 把这个 Product 对象序列化成 Json 字符串。这里使用 Lettuce 这个 Redis 客户端连接前面启动 Redis 实例，连单个 Redis 实例的时候，我们需要用 create() 方法生成一个 RedisClient 对象，create() 方法里面填的是 Redis 的 URL，这个和我们用 JDBC 连数据库的时候类似，URL 里面指定了 Redis 的地址、端口，这样的话，RedisClient 就知道去哪里连 Redis 了。然后执行 connect() 方法，请求 Redis 实例创建连接。


连接完之后，就可以通过 async() 方法创建一个异步的 Command 对象，这个对象就是用来执行 Redis 命令的关键对象。我们能看到它有一个 set() 方法，这就对应我们前面说的 SET 命令，set() 方法返回的是一个 Future 对象，我们可以用 get() 方法设置一个等待的超时时间，等待 SET 命令执行完成。我们这里设置 1 秒，TimeUnit 用来指定时间的单位。


除了异步 Command 对象，Lettuce 还提供了一个同步的 Command 对象。在用这个同步的对象执行命令的时候，就不用再调 get() 方法，设置超时时间了，它会一直阻塞等待命令执行结束。一般在工作场景里面，都是用异步的客户端，然后设置一个合理的超时时间，就可以防止 Redis 长时间不返回把上游服务拖垮了。


当业务与 Redis 的交互结束之后，我们就把连接和 RedisClient 都关闭掉，这和 JDBC 连数据库一样，用来释放比较珍贵的网络资源。


执行完这个单测之后我们从命令行里面看一下 product 这个 Key，发现已经存进来了，名字、价格都有了哈：

``` shell
127.0.0.1:6379> GET product
"{"name":"\xe6\x9d\xaf\xe5\xad\x90","price":100.0,"desc":"\xe8\xbf\x99\xe6\x98\xaf\xe4\xb8\x80\xe4\xb8\xaa\xe6\x9d\xaf\xe5\xad\x90"}"
```


我们再加一个 `GET 命令`的单测，同时把单测类的结构调整一下。我们把建连和创建 Command 对象的逻辑放到 before() 方法里面，把释放连接的逻辑放到 after() 方法里面，然后加上 @Before 和 @After 注解，这样的话，每次跑单测的时候，就会先执行 before() 进行建连，再执行单测逻辑，最后执行 after() 关闭连接。


来看 GET 命令的单测，这里先执行一个 GET 方法，也就是发一条 GET 命令，去拿到 product 这个 Key 对应的 Value 值，也就是前面存进去的这个 json 字符串。然后，把它反序列化成一个 Product 对象，并打印到控制台。

``` java
public class RedisTest {

    private static RedisClient redisClient;

    private static StatefulRedisConnection<String, String> connection;

    private static RedisAsyncCommands<String, String> asyncCommands;

    @Before
    public void before(){
        redisClient = RedisClient.create("redis://127.0.0.1:6379/0");
        connection = redisClient.connect();
        asyncCommands = connection.async();
        // RedisCommands<String, String> syncCommands = connection.sync();
    }

    @After
    public void after(){
        connection.close();
        redisClient.shutdown();
    }

    @Test
    public void testCacheProduct() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        Product product = new Product();
        product.setName("杯子");
        product.setPrice(100d);
        product.setDesc("这是一个杯子");
        String json = objectMapper.writeValueAsString(product);

        asyncCommands.set("product", json).get(1, TimeUnit.SECONDS);
    }

    @Test
    public void testGetProduct() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        String json = asyncCommands.get("product").get(1, TimeUnit.SECONDS);
        Product product = objectMapper.readValue(json, new TypeReference<Product>() {
        });
        System.out.println(product);
    }
}
```


### 2. 分布式锁

Redis 字符串还有一个非常常用的场景就是分布式锁，大概的`实现思路`就是**利用 Redis 命令的原子性和 `SET...NX 命令`（或者是 SETNX 命令）实现锁的效果，Redis 字符串的 Key 是锁的名称，Value 存的是当前锁的拥有者**。


下面就来简单模拟一下多个服务来争抢资源的场景，然后用 SET...NX 实现分布式锁，控制服务之间的并发。

``` java
@Test
public void testLock() throws Exception {
    int threadNum = 1;
    CountDownLatch countDownLatch = new CountDownLatch(threadNum);
    Runnable runnable = () -> {
        try {
            countDownLatch.await();
            while (true) {
                // 获取锁
                SetArgs setArgs = SetArgs.Builder.ex(5).nx();
                String succ = asyncCommands.set("update-product",
                        Thread.currentThread().getName(), setArgs).get(1, TimeUnit.SECONDS);
                // 加锁失败
                if (!"OK".equals(succ)) {
                    System.out.println(Thread.currentThread().getName() + "加锁失败，自选等待锁");
                    Thread.sleep(100);
                } else {
                    System.out.println(Thread.currentThread().getName() + "加锁成功");
                    break;
                }
            }
            // 加锁成功
            System.out.println(Thread.currentThread().getName() + "开始执行业务逻辑");
            Thread.sleep(1000);
            System.out.println(Thread.currentThread().getName() + "完成业务逻辑");
            // 释放锁
            asyncCommands.del("update-product").get(1, TimeUnit.SECONDS);
            System.out.println(Thread.currentThread().getName() + "释放锁");
        } catch (Exception e) {
            e.printStackTrace();
        }
    };

    Thread thread1 = new Thread(runnable);
    Thread thread2 = new Thread(runnable);
    Thread thread3 = new Thread(runnable);
    thread1.start();
    thread2.start();
    thread3.start();
    countDownLatch.countDown();

    Thread.sleep(TimeUnit.DAYS.toMillis(1));
}
```

这里先来写一个 Runnable 任务，它里面有一个 CountDownLatch，CountDownLatch 的值是 1，后面我们会启动三个线程来执行这个 Runnable 任务。前面两个线程启动的时候，都会阻塞在这个 CountDownLatch.await() 这里，然后第三个线程启动的时候，也走到 CountDownLatch.await() 的位置，然后三个线程会一起开始执行下面的业务逻辑。


业务逻辑的第一步就抢锁，这里会创建一个 SetArgs 参数，SET 命令后面的那些参数都可以在这里找到对应的方法，比如，SetArgs.Builder.ex() 方法，对标的就是 SET 命令的 EX 参数，SetArgs.Builder.nx() 方法就是 SET 命令的 NX 参数。这里我们用 ex(5) 方法告诉 Redis 需要这个 Key 五秒自动过期，用 nx() 方法告诉 Redis 这个 Key 不存在的时候，才能创建。


然后，执行 asyncCommands.set() 方法发送 SET 命令，其中第一个参数是 SET 命令的 Key，第二个是 Value，第三个的话就是 SetArgs 这些扩展参数，然后在这里阻塞一秒钟，等 SET 命令执行完。如果返回值不是 “OK”，那就是当前线程加锁失败了，当前线程会休眠一会，再继续这个 while 循环去抢锁。如果返回是 “OK” 的话，那证明这个 Key 写入成功了，也就加锁成功了，我们直接跳出 while 循环，就可以开始执行业务逻辑了。我们用这个 sleep 1 秒来表示执行业务逻辑的耗时。


执行完业务逻辑之后，就可以执行 DEL 命令，把这个 Key 删掉，表示释放锁，其他线程就可以抢锁成功了。


执行一下这个单测，看一下输出。先是线程 1 成功加锁，线程 2、3 会自旋等待，然后线程 1 执行完业务逻辑，释放锁，线程 3 加锁，最后是线程 2 加锁。

```shell
Thread-1加锁成功
Thread-3加锁失败，自旋等待锁
Thread-2加锁失败，自旋等待锁
Thread-1开始执行业务逻辑
Thread-3加锁失败，自旋等待锁
Thread-2加锁失败，自旋等待锁
...
Thread-1完成业务逻辑
Thread-1释放锁
Thread-3加锁成功
Thread-3开始执行业务逻辑
Thread-2加锁失败，自旋等待锁
Thread-2加锁失败，自旋等待锁
...
Thread-3完成业务逻辑
Thread-3释放锁
Thread-2加锁成功
Thread-2开始执行业务逻辑
Thread-2完成业务逻辑
Thread-2释放锁
```


### 3. 限流

有些高并发的场景，例如抢购、秒杀，流量峰值会比较高，后端业务资源是有限的，需要对业务进行限流才可以支持业务的正常运转。比如说，我们要求整个服务的 QPS 不能超过 1000，这个时候就可以用 Redis 的 INCR 命令，来实现限流的效果。

先介绍一下这个限流 Key 的结构：前缀是单个服务的名称，也可以是某个接口的名称。我们这里演示订单服务的限流，前缀定义为 order-service，后缀是秒级时间戳。


然后每次访问订单服务的时候，就会根据当前时间戳去算一下需要操作的限流 Key。然后，调用 incr() 方法对限流 Key 进行加一操作。要是加一之后超过了 10，就是下面指定的 maxQps 值，就表示 QPS 超过限流阈值了，会打印出“请求被限流”。

``` java
@Test
public void testLimit() throws Exception {
    String prefix = "order-service";
    long maxQps = 10;
    long nowSeconds = System.currentTimeMillis() / 1000;
    for (int i = 0; i < 15; i++) {
        Long result = asyncCommands.incr(prefix + nowSeconds).get(1, TimeUnit.SECONDS);
        if (result > maxQps) {
            System.out.println("请求被限流");
        }else{
            System.out.println("请求正常被处理");
        }
    }
}
```


执行一下上面这个单测，输出了 10 个“请求正常被处理”，然后就到达了 maxQps 阈值，开始输出“请求被限流”。等到下一秒的时候，会重新开始输出 10 个“请求被限流”，之后会再次被限流。

```shell
请求正常被处理
请求正常被处理
请求正常被处理
请求正常被处理
请求正常被处理
请求正常被处理
请求正常被处理
请求正常被处理
请求正常被处理
请求正常被处理
请求被限流
请求被限流
请求被限流
请求被限流
请求被限流
```

## 总结


这一节主要介绍了 Redis 字符串的核心命令，主要就是读写命令、批量操作、递增操作，还有一些复合操作，这里就不再一一展开重复了，关键还是小伙伴们根据本节的命令演示自己动手练习，才能真正熟悉这些命令的含义。


然后，本节分析了 Redis 字符串的应用场景。这里首先介绍了在 Java 中使用 Lettuce 客户端连接访问 Redis 的基本代码模板，后续其他命令的实践示例都会使用这套模板，小伙伴们一定要亲自搭建一下这个 demo 项目。然后通过缓存对象、分布式锁或者服务限流三个实践示例，讲解了 Redis String 如何与实际项目需求相结合。
