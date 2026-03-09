和 mysql server 建立连接之后，可以看到它下面所有的 database。

每个 database 包含表、视图、存储过程、函数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97557d444a2446769c21b93976c58121~tplv-k3u1fbpfcp-watermark.image?)

表的增删改查我们已经学会了。

那视图、存储过程、函数都是什么呢？

我们分别来看下：

用之前的 customers、orders 表来建立视图：

```sql
CREATE VIEW customer_orders AS 
    SELECT 
        c.name AS customer_name, 
        o.id AS order_id, 
        o.order_date, 
        o.total_amount
    FROM customers c
    JOIN orders o ON c.id = o.customer_id;
```

下面的 select 语句我们很熟悉，就是关联 customers、orders 表，查出一些字段。

然后加上 CREATE VIEW ... AS 就是把这个查询的结果建立一个视图。

我们查询下刚创建的视图：

```sql
select * from customer_orders
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a744c384856142cb9849d82839295fa8~tplv-k3u1fbpfcp-watermark.image?)

视图有什么好处呢？

明显感受到的就是能简化查询，之前要写一堆 sql，现在只要查这个视图就好了。

再就是还可以控制权限，让开发者只能看到需要的字段，其余的给隐藏掉。

视图一般只用来做查询，因为它增删改的限制比较多，比如只有单表的视图可以增删改，并且要求不在视图里的字段都有默认值等。

了解即可。

再就是存储过程。

这段 sql 就是创建了一个存储过程，传入 custom\_id 查询出所有关联的订单：

```sql
DELIMITER $$
CREATE PROCEDURE get_customer_orders(IN customer_id INT)
BEGIN
        SELECT o.id AS order_id, o.order_date, o.total_amount
        FROM orders o
		WHERE o.customer_id = customer_id;
END $$
DELIMITER ;
```

首先 DELIMITER \$\$ 定义分隔符为 \$\$，因为默认是 ;

这样中间就可以写 ; 了，不会中止存储过程的 sql。

最后再恢复为之前的分隔符：DELIMITER ;

存储过程内部执行了一个查询，用到的 customer\_id 是参数传入的。

创建这个存储过程：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/968a0bd7d21d44d9b50a3351e3b6e305~tplv-k3u1fbpfcp-watermark.image?)

刷新就可以看到这个刚创建的存储过程：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b357a81cae34c32bf0957e2d6c9c958~tplv-k3u1fbpfcp-watermark.image?)

点击第二个图标就可以传参数调用：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7f800792e654f999b5c7e6183328b5c~tplv-k3u1fbpfcp-watermark.image?)

当然你可以在 sql 里调用：

```sql
CALL get_customer_orders(5);
```

调用使用 CALL 存储过程(参数) 的形式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1958a5c84d74e6690bc651e2908a70d~tplv-k3u1fbpfcp-watermark.image?)

可以看到，存储过程可以封装一些 sql，用的时候传入参数 CALL 一下就行。

此外，如果你想调用的时候返回值，可以使用函数：

比如一个求平方的函数：

```sql
DELIMITER $$
CREATE FUNCTION square(x INT)
RETURNS INT
BEGIN
    DECLARE result INT;
    SET result = x * x;
    RETURN result;
END $$
DELIMITER ;
```

还是先通过 DELIMITER 指定分隔符为 \$\$。

CREATE FUNCTION 声明函数的名字和参数 x，并且通过 RETURNS 声明返回值类型。

BEGIN、END 中间的是函数体。

先 DECLARE 一个 INT 类型的变量，然后 SET 它的值为 x \* x，之后通过 RETURN 返回这个结果。

但默认 mysql 是不允许创建函数的。

需要先设置下这个变量：

```sql
SET GLOBAL log_bin_trust_function_creators = 1;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72f3b5d2b695469b81c8cb742b3abc1b~tplv-k3u1fbpfcp-watermark.image?)

之后之后再创建 function：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553524ecde574780bdf7250c5d1753b9~tplv-k3u1fbpfcp-watermark.image?)

创建成功之后就可以在 sql 里用它了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c5a5d773fd441848c84450b78b92dd3~tplv-k3u1fbpfcp-watermark.image?)

比如创建这个视图的 price 的平方：
```sql
CREATE VIEW order_items_view AS 
    SELECT product_name, price FROM practice.order_items;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86a4e4b5291345db82a24af6645a8529~tplv-k3u1fbpfcp-watermark.image?)

就可以用上这个函数：

```sql
select product_name, square(price) from order_items_view
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d017e9a9dfb49c3aafa8a46df7cf3d8~tplv-k3u1fbpfcp-watermark.image?)

你也可以可视化的调用这个 function：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cdc27e41ff440d2b66529c3c817198a~tplv-k3u1fbpfcp-watermark.image?)

当然，这个函数没啥意义，我们再创建个有意义一点的：

```sql
DELIMITER $$
CREATE FUNCTION get_order_total(order_id INT)
RETURNS DECIMAL(10,2)
BEGIN
	DECLARE total DECIMAL(10,2);
	SELECT SUM(quantity * price) INTO total
		FROM order_items
		WHERE order_id = order_items.order_id;
	RETURN total;
END $$
DELIMITER ;
```

创建一个函数  get\_order\_total，参数为 INT 类型的 order\_id，返回值为 DECIMAL(10, 2) 类型。

声明 total 变量，执行查询订单详情表综合的 select 语句，把结果放到 total 变量里，也就是 SELECT INTO。

最后 RETURN 这个 total 变量。

然后我们调用下：
```sql
select id, get_order_total(id) from orders;
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f444958cfd846c48324e1d30e6ace83~tplv-k3u1fbpfcp-watermark.image?)

我们自己来算算对不对：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e7c71045af044508600b0d4f4c91f83~tplv-k3u1fbpfcp-watermark.image?)

id 为 3 的订单的总额是对的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d142d163654b4ab0b9147738a702e05e~tplv-k3u1fbpfcp-watermark.image?)

这就是自定义函数。

## 总结

这节我们了解了下视图、存储过程、函数。

视图就是把查询结果保存下来，可以对这个视图做查询，简化了查询语句并且也能隐藏一些字段。

它增删改的限制比较多，一般只是来做查询。

存储过程就是把一段 sql 封装起来，传参数调用。

函数也是把一段 sql 或者其他逻辑封装起来，传参数调用，但是它还有返回值。

这些概念了解即可，实际上用的并不多。
