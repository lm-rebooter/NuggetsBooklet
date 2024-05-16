### 本资源由 itjc8.com 收集整理
﻿和 mysql server 建立连接之后，可以看到它下面所有的 database。

每个 database 包含表、视图、存储过程、函数：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-1.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-2.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-3.png)

刷新就可以看到这个刚创建的存储过程：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-4.png)

点击第二个图标就可以传参数调用：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-5.png)

当然你可以在 sql 里调用：

```sql
CALL get_customer_orders(5);
```

调用使用 CALL 存储过程(参数) 的形式：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-6.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-7.png)

之后之后再创建 function：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-8.png)

创建成功之后就可以在 sql 里用它了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-9.png)

比如查询刚才的视图：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-10.png)

就可以用上这个函数：

```sql
select product_name, square(price) from order_items_view
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-11.png)

你也可以可视化的调用这个 function：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-12.png)

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
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-13.png)

我们自己来算算对不对：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-14.png)

id 为 3 的订单的总额是对的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第42章-15.png)

这就是自定义函数。

## 总结

这节我们了解了下视图、存储过程、函数。

视图就是把查询结果保存下来，可以对这个视图做查询，简化了查询语句并且也能隐藏一些字段。

它增删改的限制比较多，一般只是来做查询。

存储过程就是把一段 sql 封装起来，传参数调用。

函数也是把一段 sql 或者其他逻辑封装起来，传参数调用，但是它还有返回值。

这些概念了解即可，实际上用的并不多。
