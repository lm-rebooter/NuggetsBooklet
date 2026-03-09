我们学习了增删改查的 sql 语句，并进行了大量的练习。

但有个问题：

如果是两个 update 的语句，一个把订单详情表数量修改了，一个把订单表的总金额修改了。但是改订单总金额的那个 sql 执行失败了。

这时候怎么办？

数量已经改了，但是总金额没改成功，就对不上了。

这种就需要事务（transaction）了。

它是这样用的：

比如 3 号订单的这三个商品，我们把它数量都改为 1。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e5885c3c6204ad7be3074d56959a396~tplv-k3u1fbpfcp-watermark.image?)

那总金额就是 200，需要改 order 表的 total\_amount 为 200。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3f96bada39043db80e6403244fb8517~tplv-k3u1fbpfcp-watermark.image?)

我们先开启事务：

```sql
START TRANSACTION
```

然后执行两条 sql 语句：

```sql
UPDATE order_items SET quantity=1 WHERE order_id=3;

UPDATE orders SET total_amount=200 WHERE id=3;
```

分别修改了 order\_items 的商品数量和 orders 的订单总金额。

然后再查询下现在 orders 表和 order\_items 表的数据。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8af0e19c621496e8716415091d7bc03~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/696b943b02ee4dd4bb06844f520e2f86~tplv-k3u1fbpfcp-watermark.image?)

确实改了。

如果这时候你发现改错了，想再改回去，可你不记得之前的数据是啥了，怎么办呢？

别担心，这时候只要执行下 ROLLBACK 就好了。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a3b0375015d4c3e9953b3e22007b5e9~tplv-k3u1fbpfcp-watermark.image?)

你会发现它们的数据恢复了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdfc9cdd127d49a6a08c5c96fc7a105d~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e118f1008cea47a6a16e5e126442ae88~tplv-k3u1fbpfcp-watermark.image?)

如果你确实想提交，那可以执行 COMMIT：

```sql
START TRANSACTION;

UPDATE order_items SET quantity=1 WHERE order_id=3;

UPDATE orders SET total_amount=200 WHERE id=3;

COMMIT;
```

这时候数据就真正被修改，不能回滚了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dcbd8db05d841558b94878df722d250~tplv-k3u1fbpfcp-watermark.image?)

那如果我不是想回滚所有的 sql 语句，只是回滚一部分呢？

这需要手动告诉 mysql 一些保存的点：

```sql
START TRANSACTION;

SAVEPOINT aaa;

UPDATE order_items SET quantity=1 WHERE order_id=3;

SAVEPOINT bbb;

UPDATE orders SET total_amount=200 WHERE id=3;

SAVEPOINT ccc;

```

比如我设置了 3 个保存点。

执行这段 sql，数据确实修改了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daa1f65396244e10b9c42d8bd0d9d956~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98f1bc6bfe7c4fdd94711a65cb5f853e~tplv-k3u1fbpfcp-watermark.image?)

这时候我们回滚到 bbb 的位置：

```sql
ROLLBACK TO SAVEPOINT bbb;
```

然后再查询下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/409590407c3a4531a554cccb8c90b17a~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cd3d76b94e74effae007b0affb8a25c~tplv-k3u1fbpfcp-watermark.image?)

这时候 order\_items 表修改成功了，但是 orders 表修改没成功。

这确实是这个点的状态：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3624c6256ba64b88a3a6c28cb0d5ff3d~tplv-k3u1fbpfcp-watermark.image?)

再回滚到 ccc：

```sql
ROLLBACK TO SAVEPOINT ccc;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b513594165d74aaaa8265482781c3acb~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04b52bfed97540308b3fac02ce561afa~tplv-k3u1fbpfcp-watermark.image?)

这时候就都修改成功了。

这就是事务：

**START TRANSACTION 开启事务后所有的 sql 语句都可以 ROLLBACK，除非执行了 COMMIT 完成这段事务。**

**还可以设置几个 SAVEPOINT，这样可以 ROLLBACK TO 任何一个 SAVEPOINT 的位置。**

当你修改多个表的时候，并且这些表的数据是有关联的时候，事务是必须的。要不全部成功，要不全部不成功。

那如果事务还没有 COMMIT，但是它修改了一些表，这时候我们能查到它修改后的数据么？

这就涉及到事务的隔离级别的概念了。

MYSQL 有 4 种事务隔离级别：

*   **READ UNCOMMITTED**：可以读到别的事务尚未提交的数据。

这就有个问题，你这个事务内第一次读的数据是 aaa，下次读可能就是 bbb 了，这个问题叫做**不可重复读**。

而且，万一你读到的数据人家又回滚了，那你读到的就是临时数据，这个问题叫做**脏读**。

*   **READ COMMITTED**：只读取别的事务已提交的数据。

这样是没有脏读问题了，读到的不会是临时数据。

但是还是有可能你这个事务内第一次读的数据是 aaa，下次读可能是 bbb ，也就是不可重复读的问题依然存在。

不只是数据不一样，可能你两次读取到的记录行数也不一样，这叫做**幻读**。

*   **REPEATABLE READ**：在同一事务内，多次读取数据将保证结果相同。

这个级别保证了读取到的数据一样，但是不保证行数一样，也就是说解决了不可重复读的问题，但仍然存在幻读的问题。

*   **SERIALIZABLE**：在同一时间只允许一个事务修改数据。

事务一个个执行，各种问题都没有了。

但是负面影响就是性能很差，只能一个个的事务执行。

这 4 种级别主要是数据一致性和性能的差别，一致性越好，并发性能就越差。

需要根据实际情况来权衡。

可以这样查询当前的事务隔离级别：

```sql
select @@transaction_isolation
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7baa2d25c6a4ddc963c9f54390bdfad~tplv-k3u1fbpfcp-watermark.image?)

这个了解就好，一般用默认的。

## 总结

事务内的几条 sql 要么全部成功，要么全部不成功，这样能保证数据的一致性。

它的使用方式是 START TRANSACTION; COMMIT; 或者 ROLLBACK;

还可以设置 SAVEPOINT，然后 ROLLBACK TO SAVEPOINT;

事务还没提交的数据，别的事务能不能读取到，这就涉及到隔离级别的概念了。

一般就用默认的隔离级别就行，也就是 REPEATABLE READ。

基本上，只要写增删改的 sql，那都是要开事务的。
