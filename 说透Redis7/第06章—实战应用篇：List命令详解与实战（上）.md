这一节我们开始看 Redis 里面的 List 命令。看到 List 这个词的时候，小伙伴们肯定非常亲切，因为我们在 Java 里面最常用的、最基础的数据结构就是 List。**Redis 里面的 List 与 Java 里面的 LinkedList 差不多，都是用来表示一组有序元素的集合**。


按照我们之前介绍字符串（String）的思路，我们依旧是打开 Redis 官网，找到 Command 页面，选择 List，然后就能看到 [List 相关的全部命令](https://redis.io/commands/?group=list)：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ba77b19b55641f184d6e916b1555bbe~tplv-k3u1fbpfcp-watermark.image?)


List 的命令也不少，这里对 List 命令做一个简单的分类，这节就按照这个思维导图去介绍这些 List 的命令。这里主要分了`四个大类`，**基本的 List 操作**、**阻塞版本的 List 命令**，还有一些**复合操作**，最后是一些**随机访问的命令**。



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21f2e572e3f54b869b20be1d38fccef2~tplv-k3u1fbpfcp-watermark.image?)


## 基础操作

你可以想一下，Java 里面 LinkedList 是不是能够在队尾写元素、队头取元素，实现一个先进先出（FIFO）的队列，那我们怎么用 Redis 的 List 实现 FIFO 的效果？会涉及到**四个命令**，分别是 LPUSH、RPOP、RPUSH、LPOP，我们一个个来说。


上一节介绍字符串的时候，在 Redis 里面写入了很多 Key ，这里先来执行一下 `FLUSHALL` 命令，把当前 Redis 里面的全部数据都清掉。然后，我们可以执行一下 `KEYS *` 命令来检查一下， `KEYS *` 命令的含义是返回 Redis 里面所有的 Key。

```shell
127.0.0.1:6379> flushall
OK
127.0.0.1:6379> keys *
(empty array)
```


接下来我们用 **`LPUSH 命令`** 向 testlist 这个列表里面写入一个 AAA 字符串，LPUSH 命令的意思是，**从队列的左侧，往里写入一个元素**。现在 Redis 里面没有 testlist 这个列表，Redis 就会自动创建；然后，我们再执行三次 LPUSH 命令，往 testlist 里面写入 BBB、CCC、DDD 三个字符串，执行完这些命令之后，Redis 中 testlist 的结构如下图所示：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04b41ecc3b024f7daeeff74af8240257~tplv-k3u1fbpfcp-watermark.image?)


其相应的命令如下：

```shell
127.0.0.1:6379> LPUSH testlist AAA
(integer) 1
127.0.0.1:6379> LPUSH testlist BBB
(integer) 2
127.0.0.1:6379> LPUSH testlist CCC
(integer) 3
127.0.0.1:6379> LPUSH testlist DDD
(integer) 4
```

LPUSH 后面可以跟多个元素，如下所示，我们用一条 LPUSH 命令写入 EEE、FFF 两个元素，这个返回值其实就是写入之后 List 里面元素的总数。

```shell
127.0.0.1:6379> LPUSH testlist EEE FFF
(integer) 6
```


`知道怎么向 List 写入元素了，那怎么获取 List 里面的元素呢？`我们可以用 `LRANGE 命令`，这个命令后面要指定 List 的 Key 名称，还要指定两个下标值作为查询范围，例如这里使用的是 0 和 5 两个下标，返回的就是 testlist 里面第一个元素到第六个元素，这个下标含义和我们在 Java 里面用数组的时候，是一样的。

```shell
127.0.0.1:6379> LRANGE testlist 0 5
1) "FFF"
2) "EEE"
3) "DDD"
4) "CCC"
5) "BBB"
6) "AAA"
```

> 注意一下，LRANAGE 里面的 L 和 LPUSH 命令的 L 一样，表示的是 Left，就是从 List 左侧开始操作，所以我们看到第一个输出的是 FFF 字符串，然后是 EEE 字符串，最后才是 AAA 字符串。


在很多时候，我们是不知道 List 里面有多少个元素的，那该如何查看 List 中的元素呢？


一种方式，就是`用 LLEN 命令查一下 testlist 里面的元素个数`，返回的这个 6，就是 testlist 里面的元素个数。

```shell
127.0.0.1:6379> LLEN testlist
(integer) 6
```

通过 LLEN 命令明确了 testlist 里面的元素个数之后，就可以按照上述方式，使用 ` LRANGE testlist 0 5  `命令得到 testlist 中的全部元素了。


还有另一种方式，是我们把结尾的这个下标值改成 -1，-1 也表示 List 的最后一个元素，-2 表示的就是 List 里面倒数第二个元素，大概是下面这张图的意思，这种负数的下标，在其他语言里面没有，稍微注意一下就可以。



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29a6cb63fbca4b08a323b66790cf8c77~tplv-k3u1fbpfcp-watermark.image?)


那执行 LRANGE testlist 0 -1 命令也可以拿到 testlist 中的全部元素，执行这条 LRANGE testlist 0 -2 拿到的就是 FFF 到 BBB 这个范围的元素，具体输出如下所示：

```shell
127.0.0.1:6379> LRANGE testlist 0 -1
1) "FFF"
2) "EEE"
3) "DDD"
4) "CCC"
5) "BBB"
127.0.0.1:6379> LRANGE testlist 0 -2
1) "FFF"
2) "EEE"
3) "DDD"
4) "CCC"
5) "BBB"
```


讲清楚了从 List 左边写入元素的事情之后，如果要实现一个先进先出的队列，就要考虑从 List 右边读取数据的事情了。这里使用的命令是 **`RPOP`，这个 R ，表示的就是 Right，POP 就是弹出数据**。


下面来演示一下 RPOP 这个命令，从 testlist 的右边弹出第一个元素，弹出的是 AAA。然后再用 LRANGE 查一下 testlist 里面的全部元素，发现 AAA 已经没有了，是符合预期的。

```shell
127.0.0.1:6379> RPOP testlist
"AAA"
127.0.0.1:6379> LRANGE testlist 0 -1
1) "FFF"
2) "EEE"
3) "DDD"
4) "CCC"
5) "BBB"
```


RPOP 命令默认是一次只弹出一个元素，我们也可以在后面指定一次弹出的元素个数，例如下面指定一次弹出 2 个元素，BBB、CCC 两个字符串就会都弹出来了。再执行 LRANGE 查询 testlist 的话，BBB、CCC 也已经没有了。

```shell
127.0.0.1:6379> RPOP testlist 2
1) "BBB"
2) "CCC"
127.0.0.1:6379> LRANGE testlist 0 -1
1) "FFF"
2) "EEE"
3) "DDD"
```


到这里，我们就**用 LPUSH 和 RPOP 实现了先进先出的效果**。其实，除了左进右出，我们还可以用 RPUSH 和 LPOP 来实现右进左出的效果，本质上和 LPUSH、RPPOP 的原理没区别，这两个命令就不再演示了，你可以自己尝试一下。


**除了先进先出的队列效果，我们还可以使用 LPUSH 和 LPOP 组合，或者是 RPUSH 和 RPOP 组合，实现先进后出的效果，也就是栈的特性。**


下面简单演示一下 LPUSH 和 LPOP 实现栈的效果。先用 LPUSH 把 AAA、BBB、CCC 三个字符串从左边写入到 teststack 这个 List 里面去，然后用 LPOP 从 teststack 的左边弹出第一个元素，拿到的是 CCC，然后继续往外弹出，拿到的就是 BBB，最后拿到的是 AAA。

```shell
127.0.0.1:6379> LPUSH teststack AAA
(integer) 1
127.0.0.1:6379> LPUSH teststack BBB
(integer) 2
127.0.0.1:6379> LPUSH teststack CCC
(integer) 3
127.0.0.1:6379> LRANGE teststack 0 -1
1) "CCC"
2) "BBB"
3) "AAA"
127.0.0.1:6379> LPOP teststack
"CCC"
127.0.0.1:6379> LRANGE teststack 0 -1
1) "BBB"
2) "AAA"
127.0.0.1:6379> LPOP teststack
"BBB"
127.0.0.1:6379> LRANGE teststack 0 -1
1) "AAA"
127.0.0.1:6379> LPOP teststack
"AAA"
127.0.0.1:6379> LPOP teststack
(nil)
```


## 阻塞操作

前面介绍的 LPOP 和 RPOP 命令，在 List 为空的时候会返回 nil，但是有的场景中，需要在 List 没有数据的时候，阻塞等待新元素。 **`BLPOP` 和 `BRPOP` 这两条命令，就提供了这种阻塞监听的效果**。这两条命令里面的字母 B，就是 Block 阻塞的意思。


下面来演示一下 BLPOP 命令，我们先执行一个 LPUSH 命令，向 blist1 里面写入 AAA 字符串，然后执行 BLPOP 命令，从 blist1 左侧弹出一个元素。这个时候，blist1 里面有元素，BLPOP 命令会直接弹出这个元素，不会有任何阻塞。如果再执行 BLPOP 命令的话，因为 blist1 此时里面已经没有可供弹出的元素了，客户端会开始阻塞，阻塞的超时时间就是这里指定的 10 秒。我们从此次 BLPOP 的返回值中，也可以看到阻塞的时长为 10.06 秒。

```shell
127.0.0.1:6379> LPUSH blist1 AAA
(integer) 1
127.0.0.1:6379> BLPOP blist1 10
1) "blist1"
2) "AAA"
127.0.0.1:6379> BLPOP blist1 10
(nil)
(10.06s)
```



要是在阻塞的过程中，有其他客户端向 blist1 里面添加了一个元素，会发生什么呢？下面新开一个命令行客户端，新客户端执行 BLPOP 命令，最多阻塞 10 秒钟；老客户端在 10 秒之内，执行一下 LPUSH 命令，向 blist1 添加 BBB 这个字符串。这个时候，BLPOP 命令会立刻监听到有新元素写入，就会立刻返回，并且把这个新写入的 BBB 字符串弹出来，看到新客户端阻塞的时长只有 2 秒多一点。

```shell
127.0.0.1:6379> BLPOP blist1 10  # 新客户端
1) "blist1"
2) "BBB"
(2.50s)

127.0.0.1:6379> LPUSH blist1 BBB # 老客户端
(integer) 1
```



**BLPOP 命令，其实可以同时监听多个 List，任意一个 List 里面有数据，都会立刻返回**。下面我们用新客户端执行 BLPOP 命令，同时监听 blist1、blist2、blist3 三个 List，然后在老客户端里面向 blist3 写入 BBB 字符串。此时，新客户端的 BLPOP 命令会立即返回，返回内容里面会告诉我们，弹出的 BBB 字符串是从 blist3 里面弹出来的。

```shell
127.0.0.1:6379> BLPOP blist1 blist2 blist3 10 # 新客户端
1) "blist3"
2) "BBB"
(8.00s)
127.0.0.1:6379> LPUSH blist3 BBB # 老客户端
(integer) 1
```


BRPOP 的功能和 BLPOP 类似，唯一的区别是 BRPOP 是在 List 的右边监听，这里就不再重复演示了。


## 复合操作

我们前面介绍的这些 List 命令，基本都是在 List 上做单一的操作，要么写入元素，要么弹出元素。Redis 里面还提供了 **`LMOVE 命令`，来实现从一个 List 里面弹出元素，同时把这个弹出元素重新写入到另一个 List 的效果**。

> 多解释一句，LMOVE 命令里面的这个 L，不是 LEFT 的意思，是 List 的意思。LMOVE 命令从哪端弹出元素，从哪端写入元素，是在后面的参数里面指定的，下面会详细演示这些参数。


下面就来演示一下 LMOVE 命令执行的效果。这里先往 movelist1 这个 List 里面写入几个字符串，然后，执行一下 LMOVE 命令：

```shell
127.0.0.1:6379> LPUSH movelist1 AAA BBB CCC DDD
(integer) 4
127.0.0.1:6379> LMOVE movelist1 movelist2 LEFT LEFT
"DDD"
127.0.0.1:6379> LRANGE movelist2 0 -1
1) "DDD"
```


上面这条 LMOVE 命令的功能可以用下面这张图进行说明：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bafff5074bd4b6c9914a15bd65bc16d~tplv-k3u1fbpfcp-watermark.image?)

上面的这条 LMOVE 命令会从 movelist1 的左边弹出一个元素，弹出的是 DDD 这个字符串，这就是第一个 LEFT 参数的含义。然后，LMOVE 命令还会把弹出的这个元素从左边写入到 movelist2 这个 List 里面，这就是第二个 LEFT 的含义。


我们再执行一条 LMOVE 命令，如下所示，这条命令的倒数第二个参数是 LEFT，意思是从 movelist1 的左侧弹出一个元素，弹出的是 CCC 字符串；LMOVE 命令的最后一个参数 RIGHT，意思是把这个弹出的 CCC 字符串，从 movelist2 的右端写入。我们执行一下 LRANGE 命令看一下 movelist2 的元素，从左到右，是 DDD、CCC 两个字符串。

```shell
127.0.0.1:6379> LMOVE movelist1 movelist2 LEFT RIGHT
"CCC"
127.0.0.1:6379> LRANGE movelist2 0 -1
1) "DDD"
2) "CCC"
```


这条命令的执行原理如下图所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c46a5200bd1440b28528ce4153872a48~tplv-k3u1fbpfcp-watermark.image?)



**LMOVE 命令还有一种特殊用法，就是把后面跟的两个 List 指定成同一个 List**。例如，下面演示的 `LMOVE movelist1 movelist1 LEFT RIGHT` 这条命令，就是两个 List 都指定成 movelist1。

```shell
127.0.0.1:6379> LMOVE movelist1 movelist1 LEFT RIGHT
"BBB"
127.0.0.1:6379> LRANGE movelist1 0 -1
1) "AAA"
2) "BBB"
```


这条命令会把 BBB 这个字符串，从 movelist1 的左边弹出来，然后再从右边写到 movelist1 里面去，具体原理如下图所示：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8497df70a4054064bab22d7fd7d29112~tplv-k3u1fbpfcp-watermark.image?)



**`BLMOVE 命令`，是 LMOVE 命令的阻塞版本，要是 movelist1 里面没有元素的话，就会阻塞。阻塞超时时间也是在命令最后指定，超时时间的单位是秒，其他参数和 LMOVE 一样**。


下面就演示了一条带阻塞时间的 BLMOVE 命令，movelist3 里面没有任何数据，从返回值可以看出，这条 BLMOVE 命令会超时返回。

```shell
127.0.0.1:6379> BLMOVE movelist3 movelist3 LEFT LEFT 10
(nil)
(10.09s)
```


在 Redis 的早期版本里面，还有一个 RPOPLPUSH 命令，从名字就能大概猜出来它是干啥的。它是从一个 List 里面弹出数据，然后从另一个 List 的左边写入数据。在 Redis 6.2 之后，这条命令就被废弃了，我们完全可以用 LMOVE...RIGHT LEFT 来替代。


## 随机访问

前面介绍的 LPUSH、LMOVE 这些命令，基本都是在 List 的两端进行读写操作。除了这些操作之外，Redis List 还提供了一些随机访问的能力，就是像数组一样，根据下标索引，读写指定位置上的元素值。

这种随机访问虽然很方便，但**不是特别建议使用，尤其是在数据量大的时候**，因为 Redis List 底层其实是个链表，而不是像 ArrayList 那样的数组结构，后面介绍 List 底层数据结构的时候，小伙伴们就清楚这个问题的关键所在了。


先来看 **`LINDEX 命令`，它可以根据下标查询 List 里面的一个元素值**。


下面是 LINDEX 命令的示例，这里先从 indexlist 左边写进去 AAA、BBB、CCC 三个字符串，然后执行 LINDEX 1，就可以访问到 indexlist 的第二个元素，也就是 BBB 这个字符串；用 LINDEX 0，就可以读到第一个元素，也就是 CCC 字符串。这是不是和我们访问数组一样？

```shell
127.0.0.1:6379> LPUSH indexlist AAA BBB CCC
(integer) 3
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "CCC"
2) "BBB"
3) "AAA"
127.0.0.1:6379> LINDEX indexlist 1
"BBB"
127.0.0.1:6379> LINDEX indexlist 0
"CCC"
```


LINDEX 命令是根据下标索引查询元素，**`LPOS 命令`则是根据元素值查找对应的下标，查找是从 List 的左边开始向右边查询**。比如下面这个示例，我们在 indexlist 里面添加 AAA、BBB、CCC、AAA、CCC、CCC、CCC 这 7 个字符串，然后使用 LPOS 命令查询 BBB 这个元素出现的位置，返回值是 1，也就是 BBB 字符串的下标索引。

```shell
127.0.0.1:6379> DEL indexlist
(integer) 1
127.0.0.1:6379> RPUSH indexlist AAA BBB CCC AAA CCC CCC CCC
(integer) 5
127.0.0.1:6379> LPOS indexlist BBB
(integer) 1
```


有小伙伴可能要问，indexlist 里面有两个 CCC，要是查 CCC 的下标索引，会返回哪个下标索引？我们用 LPOS 查一下试试。

```shell
127.0.0.1:6379> LPOS indexlist CCC
(integer) 2
```


通过上面这条命令的返回值可以看出，LPOS 默认返回的是第一个 CCC 的下标索引。如果想查询第二个 CCC 的下标，怎么办？LPOS 命令中可以添加 `RANK 参数`，指定要查第几个 CCC 的下标。下面的 LPOS 示例指定了 RANK 参数为 2，返回的就是 4；去查第三个 AAA 的位置，indexlist 里面没有，那就返回 nil 了。

```shell
127.0.0.1:6379> LPOS indexlist CCC RANK 2
(integer) 4
127.0.0.1:6379> LPOS indexlist AAA RANK 3
(nil)
```


在有的场景中，需要获取 List 里面全部 CCC 字符串的下标索引，此时我们可以在 LPOS 命令后面加 `COUNT 参数`，意思是返回多少个下标索引值。下面这个示例就演示了 COUNT 参数的使用，其中第一条命令的 COUNT 指定为 1，就只返回第一个 CCC 的下标索引；COUNT 2 就会返回前两个 CCC 的下标索引；`COUNT 0 比较特殊，会返回全部 CCC 的下标索引`。

```shell
127.0.0.1:6379> LPOS indexlist CCC COUNT 1
1) (integer) 2
127.0.0.1:6379> LPOS indexlist CCC COUNT 2
1) (integer) 2
2) (integer) 4
127.0.0.1:6379> LPOS indexlist CCC COUNT 0
1) (integer) 2
2) (integer) 4
3) (integer) 5
4) (integer) 6
```


LPOS 的 RANK 和 COUNT 参数可以放到一起用。下面示例的第一条命令中 RANK 为 2，COUNT 为 0，其含义就是从第二个 CCC 的下标索引开始返回；第二条 LPOS 命令的含义是从第三个 CCC 的下标索引开始返回，前两个 CCC 的下标索引就不返回了。

```shell
127.0.0.1:6379> LPOS indexlist CCC RANK 2 COUNT 0
1) (integer) 4
2) (integer) 5
3) (integer) 6
127.0.0.1:6379> LPOS indexlist CCC RANK 3 COUNT 0
1) (integer) 5
2) (integer) 6
```


如果让你实现 LPOS 这个命令，你会怎么实现？最简单的实现方式，就是一个 **for 循环**，从头开始一个个元素比较，要是 List 太长了，对 List 全部元素进行比较，就会阻塞 Redis 主线程。所以，LPOS 命令提供了一个 **MAXLEN 参数，指定一次 LPOS 命令最多比较多少次**。

在下面的示例中，我们指定 MAXLEN 参数值为 3，那就只能匹配到第一个 CCC 了，因为前面 AAA、BBB 消耗了两次比较，第三次比较到了 CCC。MAXLEN 为 4 的话，就是比较了 AAA、BBB、CCC、AAA 四个元素，还是只找到了一个 CCC。

```shell
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "AAA"
2) "BBB"
3) "CCC"
4) "AAA"
5) "CCC"
6) "CCC"
7) "CCC"
127.0.0.1:6379> LPOS indexlist CCC RANK 1 COUNT 0 MAXLEN 3
1) (integer) 2
127.0.0.1:6379> LPOS indexlist CCC RANK 1 COUNT 0 MAXLEN 4
1) (integer) 2
```


下一个要介绍的命令是 **`LINSERT 命令`**。假设现在需要在 BBB 字符串后面插入一个 DDD 字符串，就可以用 LINSERT 命令来实现，如下面的示例所示，AFTER 的意思就是要在 BBB 后面插入的意思，我们也可以将 BBB 这个字符串称为 **“锚点”元素**，帮助我们确定位置，这就类似于现实生活中的船锚，船锚丢在哪里，船就停在附近。LINSERT 命令会先去搜索 BBB 这个字符串，搜索到 BBB 之后再进行插入。

```shell
127.0.0.1:6379> LINSERT indexlist AFTER BBB DDD
(integer) 4
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "CCC"
2) "BBB"
3) "DDD"
4) "AAA"
```

要是搜索失败了，例如下面要在 MMM 字符串后面插入 DDD 字符串，就会**返回 -1**，当然，也不会再插入这个 DDD 字符串。

```shell
127.0.0.1:6379> LINSERT indexlist AFTER MMM DDD
(integer) -1
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "CCC"
2) "BBB"
3) "DDD"
4) "AAA"
```



插入和查询命令说完之后，再来看修改命令 —— LSET。**`LSET 命令`就是把指定索引的元素替换掉**。


下面的示例中，我们会把 indexlist 里面下标为 2 的元素替换成 DDD。执行完 LSET 命令之后，用 LRANGE 查一下，会看到原本下标 2 处的 CCC 已经被替换成了 DDD 字符串。

```shell
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "AAA"
2) "BBB"
3) "CCC"
4) "AAA"
127.0.0.1:6379> LSET indexlist 2 DDD
OK
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "AAA"
2) "BBB"
3) "DDD"
4) "AAA"
```


**增删改查**里面最后一个要说的就是 **`LREM 命令`，它用来删除指定元素**。在下面的示例中，第一条 LREM 命令会删除 indexlist 里面的第一个 AAA 字符串。

```shell
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "AAA"
2) "BBB"
3) "DDD"
4) "AAA"
5) "CCC"
6) "CCC"
7) "CCC"
127.0.0.1:6379> LREM indexlist 1 AAA
(integer) 1
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "BBB"
2) "DDD"
3) "AAA"
4) "CCC"
5) "CCC"
6) "CCC"
```


示例中 indexlist 后面指定的 count 值，如果是**正数，就是从左到右开始删**，具体删多少个匹配的元素，也是由 count 值确定的。例如下面的示例，我们将 count 值调成 2，就一次删了两个 CCC 字符串。

```shell
127.0.0.1:6379> LREM indexlist 2 CCC
(integer) 2
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "BBB"
2) "DDD"
3) "AAA"
4) "CCC"
```


如果将 count 值设置成 0，含义就是把 List 里面全部匹配的元素都删掉；如果是负数的话，就是从 List 的右边开始删匹配的元素，删多少个匹配的元素，看 count 参数的绝对值。下面的示例演示了 count 值为 0 的情况，将 indexlist 中四个 CCC 字符串，全部删除了。

```shell
127.0.0.1:6379> DEL indexlist
(integer) 1
127.0.0.1:6379> RPUSH indexlist AAA BBB CCC AAA CCC CCC CCC
(integer) 7
127.0.0.1:6379> LREM indexlist 0 CCC
(integer) 4
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "AAA"
2) "BBB"
3) "AAA"
```

count 参数为负数的示例这里就不展示了，就留给你自己上手执行啦。


List 里面最后一条命令是 **`LTRIM 命令`，它是用来截断 List 的**。LTRIM 命令后面跟两个下标值，LTRIM命令只保留这两个下标之间的元素。下面的示例中，LTRIM 命令会把 indexlist 的前两个元素截掉，保留的部分就是从下标 2 开始到 List 结尾的元素，也就是 AAA、BBB 两个字符串就被截掉了。

```shell
127.0.0.1:6379> DEL indexlist
(integer) 1
127.0.0.1:6379> RPUSH indexlist AAA BBB CCC AAA CCC CCC CCC
(integer) 7
127.0.0.1:6379> LTRIM indexlist 2 -1
OK
127.0.0.1:6379> LRANGE indexlist 0 -1
1) "CCC"
2) "AAA"
3) "CCC"
4) "CCC"
5) "CCC"
```


## 总结

这一节，我们一起学习了 Redis List 的核心命令，主要将 List 命令分为基础操作、阻塞操作、复合操作、随机操作四大类进行讲解，也带着大家做了非常多的演示，小伙伴们一定要自己动手实践一下哦。


下一节，我们就来介绍一下 List 可以用在哪些实际场景中，然后结合 Lettuce 客户端，用 Java 代码调一下 List 相关的命令。