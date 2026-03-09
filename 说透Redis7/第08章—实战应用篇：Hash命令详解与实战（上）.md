Redis 五大基础数据结构里面，我们已经介绍完了 String、List 两个，这一节，我们就开始介绍一下哈希表部分的内容。

这里我们先简单介绍一下 Hash 的底层结构：Hash 由**数组**和**链表**两种数据结构组成，数组里面每个元素就是一个槽位，一个槽位下面挂了一个链表。写入 field-value 数据的时候，会计算 field 的 hash 值，然后对数据长度进行取模，找到对应的槽位，把 field-value 插入到这个链表里面。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f248dd0b76b449ba8c3b41d01c18cc5~tplv-k3u1fbpfcp-watermark.image?)


了解了 Redis 里面哈希表的大概结构之后，我们再来看看 Hash 表的命令，大概分成三类，如下图所示（本节我们也将按照该图的思路去进行介绍）：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aed9af96c59948599ddd775ba16e49fb~tplv-k3u1fbpfcp-watermark.image?)


## 读写操作

**哈希表里面最简单、最常用的操作，就是读写 field-value 数据，对应的就是 `HGET`、`HSET`命令。**

下面先来演示一下 HSET 命令，HSET 命令的第一个参数是哈希表 Key 的名称，后面跟的才是 field-value 数据，示例中的 field 名称是 name，value 值是 kouzhaoxuejie。HSET 执行后的返回值为 1，表示成功写入了一个键值对。

```shell
127.0.0.1:6379> HSET testHash name kouzhaoxuejie
(integer) 1
```

然后再来演示一下 HGET 命令，这里 HGET 命令告诉 Redis 要从 testHash 这个 Hash 里面查询数据，查的是 name 这个 field，返回的就是对应的 value 值。

```shell
127.0.0.1:6379> HGET testHash name
"kouzhaoxuejie"
```

HSET 命令后面其实是可以跟多个 field-value 值，例如，下面把身高、年龄都作为 field-value 数据加到 testHash 这个哈希表里面去。然后，用 `HMGET` 这个命令去`批量拿`一下哈希表里面的 field，HMGET 命令后面可以跟多个 field，例如下面示例中的 name、age、height，返回值顺序就是 HMGET 命令取到的 value 值，顺序也和 field 一致。

```shell
127.0.0.1:6379> HSET testHash age 25 height 170
(integer) 2
127.0.0.1:6379> HMGET testHash name age height
1) "kouzhaoxuejie"
2) "25"
3) "170"
```


我们前面介绍字符串时候，介绍了一个 SET... NX 命令，哈希表里面也有一个类似的命令 —— ` HSETNX  `命令。下面我们尝试用 HSETNX 命令，把 name 这个 field 的值改成 kouzhao，但是由于这个 Key 已经存在了，写入失败了。然后，尝试用 HSETNX 写入存 weight 这个 field，由于 weight 这个 field 不存在，所以能写入成功了。

```shell
127.0.0.1:6379> HSETNX testHash name kouzhao
(integer) 0
127.0.0.1:6379> HGET testHash name
"kouzhaoxuejie"
127.0.0.1:6379> HSETNX testHash weight 100
(integer) 1
127.0.0.1:6379> HGET testHash weight
"100"
```

在有的场景中，我们不知道一个哈希表里面是不是已经有了指定的 field，此时，就可以用 `HEXISTS` 命令来检查一下。下面的示例中，这里我先检查了一下 name 这个 field，返回值为 1，表示这个 field 存在；然后，检查了 weight 这个 field，返回 0，则说明这个 field 在 testHash 里面没有。

```shell
127.0.0.1:6379> HEXISTS testHash name
(integer) 1
127.0.0.1:6379> HEXISTS testHash weight
(integer) 0
```


最后一个读写命令是 `HDEL`，就是**从哈希表里面删除一个 field**，我们把 weight 这个 field 删掉，然后再用 HGET 命令查询，就查不到了。

```shell
127.0.0.1:6379> HDEL testHash weight
(integer) 1
127.0.0.1:6379> HGET testHash weight
(nil)
```


## 递增操作

在介绍字符串的时候，我们介绍了一个 INCRBY 命令，在 Hash 表里面也有个类似的命令，可以来**递增 Hash 表中的一个 value 值**，这个命令就是 `HINCRBY`。

下面的示例就是用 HINCRBY 命令将 testHash 中 fans 的值增加了 2，HINCRBY 命令的返回值就是递增之后的结果值。如果我们增加一个负值，就实现了减法的操作，这里就不再演示了。

```shell
127.0.0.1:6379> HSET testHash fans 100
(integer) 1
127.0.0.1:6379> HINCRBY testHash fans 2
(integer) 102
```


除了增减整数之外，我们还可以用 `HINCRBYFLOAT` 命令来**增减小数**。例如下面的示例中，账户中本来有 100 块钱，然后花掉了 50 块零 5 毛，那就用 HINCRBYFLOAT 命令在 account 这个 field 上加 -50.5，得到返回值为 49.5。

```shell
127.0.0.1:6379> HSET testHash account 100
(integer) 1
127.0.0.1:6379> HGET testHash account
"100"
127.0.0.1:6379> HINCRBYFLOAT testHash account -50.5
"49.5"
127.0.0.1:6379> HGET testHash account
"49.5"
```


## 批量读取

有的场景中，我们需要迭代哈希表里面全部的 field-value 值。对于元素比较少、数据小的哈希表，可以考虑用 `HGETALL` 命令，**拿到全部的 field-value 值**。

下面来看个例子，用 HGETALL 命令查 testHash 里面的全部 field-value 值，从下面的输出可以看到，返回值是 field-value 交替返回的。如果**只想获取哈希表里面的 field 值**，可以使用 `HKEYS` 命令；如果**只想获取哈希表里面的 value 值**，可以使用 `HVALS` 命令。

```shell
127.0.0.1:6379> HGETALL testHash
 1) "name"
 2) "kouzhaoxuejie"
 3) "age"
 4) "26"
 5) "height"
 6) "170"
 7) "fans"
 8) "102"
 9) "account"
10) "49.5"
127.0.0.1:6379> HKEYS testHash
1) "name"
2) "age"
3) "height"
4) "fans"
5) "account"
127.0.0.1:6379> HVALS testHash
1) "kouzhaoxuejie"
2) "26"
3) "170"
4) "102"
5) "49.5"
```


重点强调一下，这三个全量获取哈希表数据的命令，只适合查询小数据量的哈希表。对于数据量很大的哈希表，这三个命令就会把整个 Redis 阻塞掉，所以`在生产环境中一般是禁用这三个命令的`。


那如果在生产环境中要获取整个哈希表的内容，应该怎么办呢？可以使用 `HSCAN 命令`。这里先介绍一下 HSCAN 命令的原理：**HSCAN 是把一次获取哈希表全量数据的这个操作，拆成了多次迭代，一次迭代只返回一部分数据，这样的话，每次访问的数据量就小了很多，也就不会阻塞 Redis 了**。


HSCAN 命令的完整格式是这样：

```shell
HSCAN key cursor [MATCH pattern] [COUNT count]
```


HSCAN 命令后面的 key 是我们要扫描的哈希表的名称。cursor 是游标的意思，其实就是个数字，你可以把 cursor 理解为一次迭代的结束位置，也是下次迭代的开始位置，它用来告诉 Redis 从哪里开始下一次迭代。MATCH 部分，就像是 SQL 语句里面的 where 条件一样，按照一定的格式来过滤 field。COUNT 部分就像是 SQL语句里面的 limit，但是这个 COUNT 只是提示 Redis 应该返回多少条数据，不是严格控制，具体返回多少条数据，可以先简单认为是看 Redis 心情，后面分析哈希表底层实现的时候，我们会看到为什么 COUNT 无法做到严格限制。


下面我们还是通过一个示例来说明 HSCAN 命令的具体使用方式。在下面的 testClass 这个哈希表里面，有 1000 个学生的指纹信息，这里随机抽几个学生的指纹信息看一眼，student1、student2 这两个学生的指纹信息是加密的编码；之后，用 HLEN 命令来看一下 testClass 里面有多少条指纹信息，总共 1000 个。

```shell
127.0.0.1:6379> HMGET testClass student1 student2
1) "wIBWRf4hDR8S1ZoHjR7FfdCDugOXPuZOujiVaUMUZPUs9iTgqI3B42Dq3YIUD3VaVExK4cSXYKhS4BxDMrvmlXIhg67vTMdSuJ0P"
2) "dNYQiDUtSgq0TaNV1I1ikKliROxeejZx12tFkOka5YAfD2M28c1Oh5ZNTKImkd8lEn3xjmz1qzDgTt19sOLWoD6KSH2fs3GayTA0"
127.0.0.1:6379> HLEN testClass
(integer) 1000
```


然后用 HSCAN 命令扫描 testClass，第一次扫描的时候，游标是 0。返回值的第一行是 192，也就是下次迭代要用的游标值，具体为什么是 192，你现在可以先暂时不用关心，我们也会在解析哈希表底层实现的时候，说这个游标值的具体含义。后面就是返回的 10 条学生指纹。

```shell
127.0.0.1:6379> HSCAN testClass 0
1) "192"
2)  1) "student849"
    2) "fNCL8APpOaV4lGBhRAQ5guzZId1oidlevkolQ3g1efxP28DLj7wY5AFwvScDjiffXrFw14hBIA1sddVnzcGsRxQqjWkAOJckUjfp"
    3)... // 省略后面的输出
```


在继续下一次迭代的时候，我们需要把游标值指定成 192，此次迭代的返回值中，游标值是 160；再往后迭代就要用 160 这个游标值了。

```shell
127.0.0.1:6379> HSCAN testClass 192
1) "160"
2)  1) "student871"
    2) "5V3GprLjtYXDKWe4f7A6pQ7hNKaXxKxb2dXQZwA5wS2qIeoRLqdLIiUIou1QmXG2f4eOSUHyQ65F6kcYTEvgkDVxjmJeuVratqGp"
    3)... // 省略后面的输出

127.0.0.1:6379> HSCAN testClass 160
1) "480"
2)  1) "student893"
    2) "JPrkMjIMxtYEcfr6aZJsBk055K2FNJ3i9y1e0zWPlBiWhm7xRDhn2mJlhbufbWuHu8tDN91Wx9Ts4t1HLSeBj8caV8ZBkG11NJZu"
    3)... // 省略后面的输出
```


下面这张图大概就是 HSCAN 迭代的原理：第一次迭代，从 0 开始，迭代到 192 这个位置，返回的是 0 ~ 192 两个游标之间的内容；然后第二次是从 192 开始迭代，迭代到 160 这个位置，返回的是 192 ~ 160 两个游标之间的内容；第三次是从 160 迭代到 480 这个位置，返回的是 160 ~ 480 两个游标之间的内容。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00251201c23741d5ac7231a2eb51cccb~tplv-k3u1fbpfcp-watermark.image?)


## 其他命令

Hash 命令的最后一个分类中，有 HLEN、HSTRLEN、HRANDFIELD 三条命令。`HLEN` 命令在前面使用过了，它的功能是**查看哈希表里面有多少条 field-value 数据**，这个不再重复介绍了。


**`HSTRLEN` 命令是查看一个 value 的长度**。下面的示例中，就是使用 HSTRLEN 命令查看一下 name 和 age 两个 field 对应 value 值的长度，一个是 13，一个是 2。注意，age 对应的 value 值虽然是个整数，HSTRLEN 还是当成字符串来算长度。

```shell
127.0.0.1:6379> HMGET testHash name age
1) "kouzhaoxuejie"
2) "26"
127.0.0.1:6379> HSTRLEN testHash name
(integer) 13
127.0.0.1:6379> HSTRLEN testHash age
(integer) 2
```

**`HRANDFIELD` 命令的功能是从哈希表中随机返回 field-value 数据**。下面的示例中，从 testClass 里面随机返回三个学生指纹信息，HRANDFIELD 命令中的 3 这个参数，就是随机返回 field-value 数据的条数，WITHVALUES 参数的含义是同时返回 field 和 value 的值 ，如果不指定 WITHVALUES 的话，就只会返回 3 个 field。

```shell
127.0.0.1:6379> HRANDFIELD testClass 3 WITHVALUES
1) "student848"
2) "VcBYTGptdmdBOPv..."
3) "student565"
4) "QLgIsHXLGrefPS..."
5) "student559"
6) "GkRWcJOZJtuidJz0HQ..."
    
127.0.0.1:6379> HRANDFIELD testClass 3
1) "student47"
2) "student185"
3) "student391"
```


## 总结

这一小节，我们重点介绍了 Redis 哈希表的核心命令，主要分为读写命令、递增命令、批量命令以及其他命令四大类。

其中，读写命令中比较重要的是 HSET 和 HGET 命令，递增命令可以帮我们实现哈希表中单个 Value 的原子递增操作，批量读取命令一般用于线上的离线任务，批量处理哈希表中的数据，为了防止一次读取大量数据导致性能问题，一般使用 HSCAN 命令实现批量读取，尤其对元素较多的哈希表。最后还简单讲解了哈希表的辅助命令，其中比较常用的是 HLEN 命令。

这一节我带着你对上述每个命令都做了详细的实验，你一定要亲自上手操作一下哦。