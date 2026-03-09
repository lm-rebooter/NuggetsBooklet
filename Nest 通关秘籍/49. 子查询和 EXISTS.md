我们学习了 select 的各种语法，包括 where、limit、order by、group by、having 等，再就是 avg、count、length 等函数。

还学了多个表的 join on 关联查询。

基于这些就已经可以写出复杂的查询了，但 sql 还支持更复杂的组合，sql 可以嵌套 sql，也就是子查询。

先看下现在 student 表的数据：

点击左上角新建 sql 按钮，输入查询的 sql，点击执行：

```sql
select * from student;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3a2561bbac74d50b3c8bf6fe1cd384f~tplv-k3u1fbpfcp-watermark.image?)

然后我们想查询学生表中成绩最高的学生的姓名和班级名称。

这是不是就要分成两个 sql 语句：

先查询最高分：

```sql
SELECT MAX(score) FROM student;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/892a57f8561d41d3979cbf053e3f6ceb~tplv-k3u1fbpfcp-watermark.image?)

再查询这个分数为这个最高分的学生：

```sql
SELECT name, class FROM student WHERE score = 95;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b08754f4293948dab8f9a1795bda1e56~tplv-k3u1fbpfcp-watermark.image?)

能不能把这两个 sql 合并呢？

可以的，这就是子查询：

```sql
SELECT name, class FROM student WHERE score = (SELECT MAX(score) FROM student);
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fa251b225374006bc01a9a802cf5de8~tplv-k3u1fbpfcp-watermark.image?)

比如查询成绩高于全校平均成绩的学生记录：

```sql
SELECT * FROM student WHERE score > (SELECT AVG(score) FROM student);
```

先一个 select 语句查询学生的平均分，然后查询分数大于这个平均分的学生。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99f8792cc47648dbb81e3b2d7a9113dd~tplv-k3u1fbpfcp-watermark.image?)

此外，子查询还有个特有的语法 EXISTS、NOT EXISTS。

我们用部门表和员工表来试一下：

先查询下部门表和员工表的数据：

```sql
select * from department;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a8aedde390a49cf8ee855762bc4cf16~tplv-k3u1fbpfcp-watermark.image?)

```sql
select * from employee;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1462cd1a2ba145478e008e51a6fcb86e~tplv-k3u1fbpfcp-watermark.image?)

改一下员工的部门，点击 apply：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb130a226e6c423f9eb758de59d68a29~tplv-k3u1fbpfcp-watermark.image?)

这样就有的部门 2 个员工，有的部门 3 个员工，有的部门没有员工了。

然后实现这样一个查询：

查询有员工的部门。

sql 可以这么写：

```sql
SELECT name FROM department
    WHERE EXISTS (
        SELECT * FROM employee WHERE department.id = employee.department_id
    );
```

对每个 department，在子查询里查询它所有的 employee。

如果存在员工，那么条件成立，就返回这个部门的 name。

这就是 EXISTS 的作用：子查询返回结果，条件成立，反之不成立。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/000c1407bc3c40a29aecc919abe21a88~tplv-k3u1fbpfcp-watermark.image?)

这就是所有有员工的部门。

还可以用 NOT EXISTS 来查询所有没有员工的部门：

```sql
SELECT name FROM department
    WHERE NOT EXISTS (
            SELECT * FROM employee WHERE department.id = employee.department_id
    );
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/042fadeba911425384a84db9f6de4918~tplv-k3u1fbpfcp-watermark.image?)

子查询不止 select 里可以用，insert、update、delete 语句同样可以。

我们建个产品表：

```sql
CREATE TABLE product (
     id INT PRIMARY KEY,
     name VARCHAR(50),
     price DECIMAL(10,2),
     category VARCHAR(50),
     stock INT
);
```

直接用这个 sql 建就好了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/537162644bc64ac39385e7d3ef11ffa9~tplv-k3u1fbpfcp-watermark.image?)

然后插入几条数据：

```sql
INSERT INTO product (id, name, price, category, stock)
	VALUES 
		(1, 'iPhone12',6999.00, '手机',100),
		(2, 'iPad Pro',7999.00, '平板电脑',50),
		(3, 'MacBook Pro',12999.00, '笔记本电脑',30),
		(4, 'AirPods Pro',1999.00, '耳机',200),
		(5, 'Apple Watch',3299.00, '智能手表',80);
```

选中 sql，点击执行：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a62fa0d63314f6d90f18d00de1590d2~tplv-k3u1fbpfcp-watermark.image?)

然后查询下：

```sql
select * from product
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3941b22866c149c898b201469d427ce3~tplv-k3u1fbpfcp-watermark.image?)

查询的时候，可以用子查询，这个我们前面试过。

比如查询价格最高的产品的信息：

```sql
SELECT name, price FROM product WHERE price = (SELECT MAX(price) FROM product);
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2267eb1cb2ec463085ba9c7b3460198c~tplv-k3u1fbpfcp-watermark.image?)

通过一个子查询查最高的价格，然后外层查询查价格为最高价格的产品。

除了 select 之外，增删改也是可以用子查询的。

比如我们把每个产品分类的分类名、平均价格查出来放入另一个 avg\_price\_by\_category 表。

先创建这个表：

```sql
CREATE TABLE avg_price_by_category (
 id INT AUTO_INCREMENT,
 category VARCHAR(50) NOT NULL,
 avg_price DECIMAL(10,2) NOT NULL,
 PRIMARY KEY (id)
);
```

id 为主键，自增。

category 为 VARCHAR(50)，非空。

avg\_price 为 DECIMAL(10,2) 也就是一共 10 位，小数点后占 2 位的数字。

点击执行：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a9635a5db3a41a6a5a41d2dbcc5566d~tplv-k3u1fbpfcp-watermark.image?)

然后把 product 产品表里的分类和平均价格查出来插入这个表：

```sql
INSERT INTO avg_price_by_category (category, avg_price) 
    SELECT category, AVG(price) FROM product GROUP BY category;
```

点击执行：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb5349a4e6fd46f18c885160446edb19~tplv-k3u1fbpfcp-watermark.image?)

然后再查询现在的 avg\_price\_by\_category 表：

```sql
select * from avg_price_by_category
```

可以看到，确实插入了数据：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96d7f8d00d8a4acea2c61184d682288e~tplv-k3u1fbpfcp-watermark.image?)

这就是 insert + select 结合使用的场景。

update 同样也可以使用 select 子查询。

比如之前的 department 和 employee 表，我们想把技术部所有人的 name 前加上 “技术-”，就可以这么写：

```sql
UPDATE employee SET name = CONCAT('技术-', name) 
    WHERE department_id = (
        SELECT id FROM department WHERE name = '技术部'
    );
```

查询名字等于技术部的 department 的 id，然后更新 department_id 为这个 id 的所有 employee 的名字为 CONCAT("技术-", name)。


执行这个 sql:

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2be7f89f39f46d8b447e81d9d8eebe7~tplv-k3u1fbpfcp-watermark.image?)

可以看到技术部的员工的名字都改了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64eb5edc79e3478c9a523fe3cdea964e~tplv-k3u1fbpfcp-watermark.image?)

接下来再试试 delete：

删除技术部所有的员工。

可以这么写：

```sql
DELETE FROM employee WHERE department_id = (
    SELECT id FROM department WHERE name = '技术部'
);
```
执行一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c51c7038190547d0a4e03e5e3d84e409~tplv-k3u1fbpfcp-watermark.image?)

然后再次查询：
```sql
select * from employee;
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2daa97264c5496db3175063da429a00~tplv-k3u1fbpfcp-watermark.image?)

可以看到技术部员工确实都没有了。

所以说，子查询在 select、insert、update、delete 里都可以用。

## 总结

sql 和 sql 可以组合来完成更复杂的功能，这种语法叫做子查询。

它还有个特有的关键字 EXISTS（和 NOT EXISTS），当子查询有返回结果的时候成立，没有返回结果的时候不成立。

子查询不止 select 可用，在 update、insert、delete 里也可以用。

灵活运用子查询，能写出功能更强大的 sql。

