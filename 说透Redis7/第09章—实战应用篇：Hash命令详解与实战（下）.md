在上一节课中，我们介绍完了 Redis Hash 表中比较重要的命令。这一节紧接着上一节的内容，我们来介绍一下 Hash 结构在实战中的应用场景，并结合 Lettuce 客户端模拟这些应用场景的核心代码。

本节课程中，我们将使用 Redis 的哈希结构实现`用户资料缓存`以及`购物车缓存`两个实战应用场景。其中，用户资料缓存示例会结合哈希表的读写命令以及批量命令，演示用户资料如何在 Redis 中进行存储；购物车示例中，除了哈希表读写命令之外，还会使用到递增命令，以实现一个相对完整的、基于 Redis 的购物车功能。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f6bc69a15bc429cb9a76d1a5c6a8392~tplv-k3u1fbpfcp-watermark.image?)


## 用户资料缓存

有开发经验的小伙伴可能知道，在开发系统的时候，用户模块是最基本、最基础的模块之一。用户模块设计简单点，可能存几列信息，例如存储用户名、手机号、密码之类的基本信息；设计复杂点，可能有四五十列，例如存储用户的头像、昵称、签名等信息。

一个 C 端产品的用户量一般都会比较大，每个用户每次登录的时候，都要校验密码，登录成功之后，返回头像、昵称这些基础信息，这个时候就比较适合用 Redis Hash 结构来存用户的这些信息，`活跃用户的信息进 Redis 进行缓存，非活跃用户留在 MySQL 里面`。


下图是用户资料缓存的存储格式，我们用注册手机号作为 Redis Hash 的 Key，对应的 Hash 结构中存储了 userId、密码这些 field-value 值。一般情况下，用户手机号是需要混淆加密之后再进行存储的，不会直接明文存储的，这里为了简单，省略了混淆和加密的处理。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84923044aaea4ebda0948a21d7ddfdb1~tplv-k3u1fbpfcp-watermark.image?)


下面通过一个单元测试的示例来模拟一下用户登录注册时，使用这个用户资料缓存的核心逻辑。这里先写一个 User 类，里面有 userId、用户名、密码、注册的手机号这些基本的信息，然后创建一个单元测试类，其中定义一个 Map userDB，模拟存储在 DB 里面的用户信息，在 before() 方法中会填充这个 Map。

```java
private static Map<String, User> userDB = new HashMap<>();

@Before
public void before() {
    ... // 省略初始化RedisClient的逻辑
    userDB.put("+8613912345678", new User(1L, "zhangsan", 25, "+8613912345678", "123456", "http://xxxx"));
    userDB.put("+8613512345678", new User(2L, "lisi", 25, "+8613512345678", "abcde", "http://xxxx"));
    userDB.put("+8618812345678", new User(3L, "wangwu", 25, "+8618812345678", "654321", "http://xxxx"));
    userDB.put("+8618912345678", new User(4L, "zhaoliu", 25, "+8618912345678", "98765", "http://xxxx"));
}
```


接下来，开发一个模拟手机号、密码登录的方法 mockLogin() 。它在模拟登录的时候，会先去查一下缓存，用户资料的 Key 是手机号加一个固定前缀，和我们前面的设计保持一致。这里用的是 `HGETALL` 命令，User 总共就 4、5 个字段，一次全部读取出来没有什么性能问题；如果用户缓存的资料非常多，也就是 field 比较多的时候，就建议只读取密码这一个 field 进行登录校验，之后展示其他用户资料的时候，再进行单独读取。


mockLogin() 通过 HGETALL 命令查询的时候，如果命中了缓存，就会执行这个 else 分支的逻辑，其中会用 BeanUtils 把缓存的数据转成 User 对象，然后执行检查密码的逻辑；如果缓存没命中，就去 userDB 里面查询一下 User 对象，这是用来模拟查询 MySQL 数据库的逻辑，然后使用 BeanUtils 把查到的 User 对象转成 Map，并执行 `HSET` 命令写到 Redis 里面。等到这个用户下次登录的时候，就命中缓存了；如果从 userDB 里面查不到，就是这个手机号没注册过，也是返回登录失败了。


正常情况下，这种未注册的手机号，需要写一个特殊的 Hash 结构到 Redis 里面，这个特殊的 Hash 里面有未注册的标识，防止一直击穿 Redis 缓存。这样就可以在查询 Redis 的时候，区分未注册和缓存未命中的情况。这里主要是模拟注册登录的核心逻辑，就不搞那么复杂了。

```java
private static final String USER_CACHE_PREFIX = "uc_";

private static void mockLogin(String mobile, String password) throws Exception {
    // 根据手机号，查询缓存
    String key = USER_CACHE_PREFIX + mobile;
    Map<String, String> userCache = asyncCommands.hgetall(key).get(1, TimeUnit.SECONDS);
    User user = null;
    if (MapUtils.isEmpty(userCache)) {
        System.out.println("缓存miss，加载DB");
        user = userDB.get(mobile);
        if (user == null) {
            System.out.println("登录失败");
            return;
        }
        // User转成Map
        Map<String, String> userMap = BeanUtils.describe(user);
        // 写入缓存
        Long result = asyncCommands.hset(key, userMap).get(1, TimeUnit.SECONDS);
        if (result == 1) {
            System.out.println("UserId:" + user.getUserId() + "，已进入缓存");
        }
    } else {
        System.out.println("缓存hit");
        user = new User();
        BeanUtils.populate(user, userCache);
    }
    if (password.equals(user.getPassword())) {
        System.out.println(user.getName() + ", 登录成功!");
    } else {
        System.out.println("登录失败");
    }

    System.out.println("================================");
}
```


下面的 testUserCache() 单元测试方法用来模拟两次用户登录，其中会调用两次 mockLogin() 方法，第一次先拿张三的手机号登录，密码先输错，然后再输入正确的。从输出来看，第一次登录的时候，缓存没有命中，登录也失败了；第二次登录的时候，缓存命中，登录也成功了。

```java
@Test
public void testUserCache() throws Throwable {
    mockLogin("+8613912345678", "654321");
    mockLogin("+8613912345678", "123456");
}

输出：
缓存miss，加载DB
登录失败
================================
缓存hit
zhangsan, 登录成功!
================================
```


## 购物车

下面我们再来看 Hash 表的另一个应用场景。在购物类网站里面，都会有购物车的功能，用户可以把商品加入购物车，可以增加商品的个数。购物车的数据可以存储在前端，也可以存到服务端，两个方案各有优缺点。

如果将购物车存储到前端的话，例如，Web 端购物商城，就要用 Cookie 之类的机制进行存储，这就需要处理浏览器的兼容性问题、跨域问题，以及用户意外关掉浏览器 Cookie 功能等一系列问题，而且只是存储在前端的话，在做限购、库存检查之类操作的时候，就只能在订单提交的时候检查了，用户体验有一定损失。


如果是将购物车的数据存储在后端的话，就需要更多的网络交互，更多的带宽和后端资源来支撑这个功能。所以购物车功能的具体方案，需要小伙伴们根据实际场景权衡一下。


这里要实现的就是后端存储版本的购物车，我们会将购物车里面的数据，存到 Redis 里面。来看下面这张图，每个用户只有一个购物车，每个购物车在 Redis 里面对应一个 Key，Key 的格式是 “cart” 前缀加用户的 userId，然后 Value 就是一个 Hash 表，在这个 Hash 表里面的 field 是商品的 id，value 是商品的个数。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22c1eedf2e9c4d0abff08c007106a1df~tplv-k3u1fbpfcp-watermark.image?)

介绍完购物车的存储设计之后，我们开始正式写代码，首先要写一个 CartDao 类，表示抽象购物车的能力，里面有 add() 和 remove() 两个方法，表示可以添加商品和删除商品。


在 add() 方法里面，与 Redis 交互使用的是 `HSET` 命令，Hash 表的 Key 是 “cart” 前缀和用户 userId 拼出来的字符串，field 是商品 id。当商品第一次被添加进购物车，对应的 value 值，也就是商品的数量，会被设置成 1。 remove() 方法底层是通过 `HDEL`命令，从这个用户的购物车 Hash 表中里面删掉一个商品，删除完成之后，会有一行提示信息打印出来。最后，在 CartDao 中再加一个 submitOrder() 方法，在结算的时候，会通过这个方法展示购物车里面的商品信息和数量，它底层就是通过 `HGETALL` 命令查询购物车 Hash 表中的全部 field-value 数据。

```java
public class CartDao {

    private static final String CART_PREFIX = "cart_";

    public void add(long userId, String productId) throws Exception {
        Boolean result = asyncCommands.hset(CART_PREFIX + userId,
                productId, "1").get(1, TimeUnit.SECONDS);
        if (result) {
            System.out.println("添加购物车成功,productId:" + productId);
        }
    }

    public void remove(long userId, String productId) throws Exception {
        Long result = asyncCommands.hdel(CART_PREFIX + userId,
                productId).get(1, TimeUnit.SECONDS);
        if (result == 1) {
            System.out.println("商品删除成功，productId:" + productId);
        }
    }
    
    public void submitOrder(long userId) throws Exception {
        Map<String, String> cartInfo = asyncCommands.hgetall(CART_PREFIX + userId).get(1, TimeUnit.SECONDS);
        System.out.println("用户:"+userId+", 提交订单:");
        for (Map.Entry<String, String> entry : cartInfo.entrySet()) {
            System.out.println(entry.getKey() + ":" + entry.getValue());
        }
    }
}
```



下面我们写一个单元测试方法来演示一下 CartDao 这个类的使用方式。如下所示，这里会先创建一个 CartDao 对象，然后调三次 add 方法，添加三个不同的商品到购物车中，接着执行 submitOrder() 方法展示购物车中的商品情况。然后，再调用 remove 方法，删掉一个商品，再打印一下购物车的内容。

```java
@Test
public void testCartDao() throws Throwable {
    CartDao cartDao = new CartDao();
    cartDao.add(1024, "83694");
    cartDao.add(1024, "1273979");
    cartDao.add(1024, "123323");
    cartDao.submitOrder(1024);
    cartDao.remove(1024, "123323");
}

// 输出：
添加购物车成功,productId:83694
添加购物车成功,productId:1273979
添加购物车成功,productId:123323
用户:1024, 提交订单信息
商品信息
83694:1
1273979:1
123323:1
商品删除成功，productId:123323
用户:1024, 提交订单信息
商品信息
836941
12739791
```


下面我们再给 CartDao 添加两个方法：一个是 incr() 方法，用来增加商品个数；另一个是 decr() 方法，用来减少商品数量。


具体的代码实现如下。incr 方法中会使用 `HINCRBY` 命令将指定商品数量加 1。decr() 方法中则会先检查一下商品的数量，如果商品数量减到 0 了，会将该商品从购物车里面移除；如果没有没减到 0 ，就通过 HINCRBY 命令加 -1，实现减 1 的效果。

```java
public void incr(long userId, String productId) throws Exception {
    Long result = asyncCommands.hincrby(CART_PREFIX + userId,
            productId, 1).get(1, TimeUnit.SECONDS);
    System.out.println("商品数量加1成功，剩余数量为:" + result);
}

public void decr(long userId, String productId) throws Exception {
    String count = asyncCommands.hget(CART_PREFIX + userId,
            productId).get(1, TimeUnit.SECONDS);
    if (Long.valueOf(count) - 1 <= 0) { // 删除商品
        remove(userId, productId);
        return;
    }
    Long result = asyncCommands.hincrby(CART_PREFIX + userId,
            productId, -1).get(1, TimeUnit.SECONDS);
    System.out.println("商品数量减1成功，剩余数量为:" + result);
}
```


下面我们在 testCartDao() 这个单元测试方法中，补充 incr() 和 decr() 方法的测试逻辑。这里会把第一个商品的数量加 1，把第二个数量减 1，然后展示一下购物车内的商品情况，具体代码如下以及测试输出如下：

```java
@Test
public void testCartDao() throws Throwable {
    CartDao cartDao = new CartDao();
    cartDao.add(1024, "83694");
    cartDao.add(1024, "1273979");
    cartDao.add(1024, "123323");
    cartDao.submitOrder(1024);
    cartDao.remove(1024, "123323");
    cartDao.submitOrder(1024);

    cartDao.incr(1024, "83694");
    cartDao.decr(1024, "1273979");
}
// 输出
商品数量加1成功，剩余数量为:2
商品删除成功，productId:1273979
用户:1024, 提交订单信息
商品数量
83694:2
```


## 总结

这一节课程中，我们重点介绍了 Redis 哈希表的两个应用场景：

-   一个是用户资料缓存的场景，该示例模拟了用户登录注册过程中使用缓存的场景，其中使用到了 Redis 哈希表的 `HGET`、`HSET` 以及 `HGETALL` 三条基础命令；


-   另一个是购物车的场景，该示例使用 Redis 的哈希表来存储一个用户的购物车数据，除了提供了增删商品的基本功能之外，还使用 `HINCRBY` 命令实现了增减商品数量的功能。
