### 本资源由 itjc8.com 收集整理
﻿前面我们把 select、update、insert、delete 的语法、函数、关联查询、子查询都过了一遍，sql 学的就差不多了。

这节我们来实战下，写一些复杂的 sql。

先创建个单独的数据库：

```sql
create database practice
```

执行它：
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-1.png)

点击刷新，就可以看到这个 database（也叫 schema）了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-2.png)

执行 use practice 切换数据库：

```sql
use practice;
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-3.png)

然后创建 3 个表：

```sql
-- 创建 customers 表，用于存储客户信息
CREATE TABLE IF NOT EXISTS `customers` (
 `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户ID，自增长',
 `name` varchar(255) NOT NULL COMMENT '客户姓名，非空',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户信息表';

-- 创建 orders 表，用于存储订单信息
CREATE TABLE IF NOT EXISTS `orders` (
 `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单ID，自增长',
 `customer_id` int(11) NOT NULL COMMENT '客户ID，非空',
 `order_date` date NOT NULL COMMENT '订单日期，非空',
 `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额，非空',
 PRIMARY KEY (`id`),
 FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单信息表';

-- 创建 order_items 表，用于存储订单商品信息
CREATE TABLE IF NOT EXISTS `order_items` (
 `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品ID，自增长',
 `order_id` int(11) NOT NULL COMMENT '订单ID，非空',
 `product_name` varchar(255) NOT NULL COMMENT '商品名称，非空',
 `quantity` int(11) NOT NULL COMMENT '商品数量，非空',
 `price` decimal(10,2) NOT NULL COMMENT '商品单价，非空',
 PRIMARY KEY (`id`),
 FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品信息表';
```

分别是顾客、订单、订单项。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-4.png)

一个顾客有多个订单，一个订单有多个订单项，通过外键存储这种关联关系。

级联方式为 CASCADE。

上面还涉及到注释的语法，sql 里的注释用 -- 开头：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-5.png)

执行建表 sql:

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-6.png)

点击刷新，就可以看到这三个表了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-7.png)

然后插入一些数据：

```sql
-- 向 customers 表插入数据
INSERT INTO `customers` (`name`) 
    VALUES 
        ('张丽娜'),('李明'),('王磊'),('赵静'),('钱伟'),
        ('孙芳'),('周涛'),('吴洋'),('郑红'),('刘华'),
        ('陈明'),('杨丽'),('王磊'),('张伟'),('李娜'),
        ('刘洋'),('陈静'),('杨阳'),('王丽'),('张强');

-- 向 orders 表插入数据
INSERT INTO `orders` (`customer_id`, `order_date`, `total_amount`)
    VALUES
        (1, '2022-01-01',100.00),(1, '2022-01-02',200.00),
        (2, '2022-01-03',300.00),(2, '2022-01-04',400.00),
        (3, '2022-01-05',500.00),(3, '2022-01-06',600.00),
        (4, '2022-01-07',700.00),(4, '2022-01-08',800.00),
        (5, '2022-01-09',900.00),(5, '2022-01-10',1000.00);

-- 向 order_items 表插入数据
INSERT INTO `order_items` (`order_id`, `product_name`, `quantity`, `price`)
    VALUES
        (1, '耐克篮球鞋',1,100.00),
        (1, '阿迪达斯跑步鞋',2,50.00),
        (2, '匡威帆布鞋',3,100.00),
        (2, '万斯板鞋',4,50.00),
        (3, '新百伦运动鞋',5,100.00),
        (3, '彪马休闲鞋',6,50.00),
        (4, '锐步经典鞋',7,100.00),
        (5, '亚瑟士运动鞋',10,50.00),
        (5, '帆布鞋',1,100.00),
        (1, '苹果手写笔',2,50.00),
        (2, '电脑包',3,100.00),
        (3, '苹果手机',4,50.00),
        (4, '苹果耳机',5,100.00),
        (5, '苹果平板',7,100.00);
```

执行这些 sql：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-8.png)

然后查询下看看：

```sql
select * from customers
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-9.png)

```sql
select * from orders
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-10.png)

```sql
select * from order_items
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-11.png)

顾客、订单、订单项三个表都成功插入了数据。

然后我们来实现下这些需求：

### 需求 1: 查询每个客户的订单总金额

客户的订单存在订单表里，可能有多个，这里需要 JOIN ON 关联两个表，然后用 GROUP BY 根据客户 id 分组，再通过 SUM 函数计算价格总和。

```sql
SELECT customers.name, SUM(orders.total_amount) AS total_amount 
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id 
    GROUP BY customers.id;
```

这里的 INNER JOIN ON 也可以简化为 JOIN ON。

执行查询：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-12.png)

成功查出了每个客户的订单总金额。

我们还可以再加上排序：

```sql
SELECT customers.name, SUM(orders.total_amount) AS total_amount 
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id 
    GROUP BY customers.id
    ORDER BY total_amount DESC;
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-13.png)

如果想取前 3 的，可以用 LIMIT：

```sql
SELECT customers.name, SUM(orders.total_amount) AS total_amount 
    FROM customers
    JOIN orders ON customers.id = orders.customer_id
    GROUP BY customers.id
    ORDER BY total_amount DESC 
    LIMIT 0,3;
```

从第 0 个开始取 3 个：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-14.png)

### 需求 2: 查询每个客户的订单总金额，并计算其占比

每个客户的总金额的需求上面实现了，这里需要算占比，就需要通过一个子查询来计算全部订单的总金额，然后相除：

```sql
SELECT customers.name, SUM(orders.total_amount) AS total_amount, 
	SUM(orders.total_amount) / (SELECT SUM(total_amount) FROM orders) AS percentage 
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id
    GROUP BY customers.id;
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-15.png)

当然，这里每次都算一遍总金额性能不好，可以先算出总金额，然后把数值传入。

这里只是练习子查询。

### 需求 3：查询每个客户的订单总金额，并列出每个订单的商品清单

这里在总金额的基础上，多了订单项的查询，需要多关联一个表：

```sql
SELECT customers.name, orders.order_date, orders.total_amount, 
	order_items.product_name, order_items.quantity, order_items.price
    FROM customers
    JOIN orders ON customers.id = orders.customer_id
    JOIN order_items ON orders.id = order_items.order_id
    ORDER BY customers.name, orders.order_date;
```

内连接关联 3 个表，按照名字和下单日期排序。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-16.png)

### 需求 4：查询每个客户的订单总金额，并列出每个订单的商品清单，同时只显示客户名字姓“张”的客户的记录：

总金额和商品清单的需求前面实现了，这里只需要加一个 WHERE 来过滤客户名就行：

```sql
SELECT customers.name, orders.order_date, orders.total_amount, 
	order_items.product_name, order_items.quantity, order_items.price
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id
    INNER JOIN order_items ON orders.id = order_items.order_id
    WHERE customers.name LIKE '张%'
    ORDER BY customers.name, orders.order_date;
```

执行下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-17.png)

### 需求 5:查询每个客户的订单总金额，并列出每个订单的商品清单，同时只显示订单日期在2022年1月1日到2022年1月3日之间的记录

这里比上面的需求只是多了日期的过滤，范围是一个区间，用 BETWEEN AND：

```sql
SELECT customers.name, orders.order_date,
	orders.total_amount, order_items.product_name,
    order_items.quantity, order_items.price
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id
    INNER JOIN order_items ON orders.id = order_items.order_id
    WHERE orders.order_date BETWEEN '2022-01-01' AND '2022-01-03'
    ORDER BY customers.name, orders.order_date;
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-18.png)

因为这里的 order\_date 是 date 类型，所以指定范围也只是用 2022-01-01 这种格式的。如果是 datetime，那就要用 2022-01-01 10:10:00 这种格式了。

### 需求 6：查询每个客户的订单总金额，并计算商品数量，只包含商品名称包含“鞋”的商品，商品名用-连接，显示前 3 条记录：

查询订单总金额和商品数量都需要用 group by 根据 customer.id 分组，过滤出只包含鞋的商品。

把分组的多条商品名连接起来需要用 GROUP\_CONCAT 函数。

然后 LIMIT 3

```sql
SELECT 
        c.name AS customer_name,
        SUM(o.total_amount) AS total_amount,
        COUNT(oi.id) AS total_quantity,
        GROUP_CONCAT(oi.product_name SEPARATOR '-') AS product_names
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_name LIKE '%鞋%'
    GROUP BY c.name
    ORDER BY total_amount DESC
    LIMIT 3;

```

GROUP\_CONCAT 函数是用于 group by 分组后，把多个值连接成一个字符串的。

LIMIT 3 就相当于 LIMIT 0,3 也就是从 0 开始 3 条记录：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-19.png)

## 需求 7: 查询存在订单的客户

这里使用子查询 + EXISTS 来实现：

```sql
SELECT * FROM customers c
    WHERE EXISTS (
            SELECT 1 FROM orders o WHERE o.customer_id = c.id
    );
```

如果从 orders 表中查出了当前 customer 的订单记录，EXISTS 就成立。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-20.png)

当然，你也可以用 NO EXISTS 来查询没有下单过的客户：

```sql
SELECT * FROM customers c
    WHERE NOT EXISTS (
            SELECT 1 FROM orders o WHERE o.customer_id = c.id
    );
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-21.png)

## 需求 8: 将王磊的订单总金额打九折

现在王磊的订单总金额是这些：

```sql
SELECT * FROM orders 
 JOIN customers ON orders.customer_id = customers.id
 WHERE customers.name = '王磊';
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-22.png)

更新它们为 90%：

```sql
UPDATE orders o SET o.total_amount = o.total_amount * 0.9
    WHERE o.customer_id IN (
        SELECT id FROM customers WHERE name = '王磊'
    );
```

这里订单不止一条，所以用 IN 来指定一个集合。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-23.png)

再查询下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第40章-24.png)

确实减少了。

## 总结

这节我们创建了一个新的 database 并且新增了 customers、orders、order_items 表来练习 sql。

customers 和 orders、orders 和 order_items 都是一对多的关系。

我们练习了 JOIN ON、WHERE、ORDER BY、GROUP BY、LIMIT 等语法，也练习了 SUM、COUNT、GROUP_CONCAT 等函数。

还有子查询和 EXISTS。

sql 常用的语法也就这些，把这些掌握了就能完成各种需求了。

