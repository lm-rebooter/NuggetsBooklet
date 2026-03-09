上节我们学了 mysql 的数据库、表的创建删除，单表的增删改查。

其实增删改查的 sql 语法还有很多，这节我们就来一起过一遍。

用 docker 跑个 mysql 镜像：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7a27cb986a44bb4a01c1a940734f499~tplv-k3u1fbpfcp-watermark.image?)

上节我们跑 mysql 镜像的时候，把数据保存在了一个目录下，这次把那个目录挂载到新容器的 /var/lib/mysql

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cd85aa185494cddb17f717ff19f67c4~tplv-k3u1fbpfcp-watermark.image?)

指定容器名、端口映射，点击 run。

这次不用再指定 MYSQL\_ROOT\_PASSWORD 的环境变量了，因为这个配置同样保存在挂载目录下。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd05582e6d6142e099b452ef7adb198e~tplv-k3u1fbpfcp-watermark.image?)

还是用之前的密码连接 mysql，然后 show databases 查看所有数据库。

可以看到上节我们创建的 hello-mysql 数据库还在。

这就是数据卷挂载的用处，就算你跑了个新容器，那只要把数据卷挂上去，数据就能保存下来。

然后还是用 mysql workbench 来连接：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ce7857b289c40a78e42cbc7eaa74d3a~tplv-k3u1fbpfcp-watermark.image?)

点击之前建的 connection 就行。

我们先建个表：

```sql
CREATE TABLE student(
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Id',
    name VARCHAR(50) NOT NULL COMMENT '学生名',
    gender VARCHAR(10) NOT NULL COMMENT '性别',
    age INT NOT NULL COMMENT '年龄',
    class VARCHAR(50) NOT NULL COMMENT '班级名',
    score INT NOT NULL COMMENT '分数'
) CHARSET=utf8mb4
```

这时学生表。

id 为主键，设置自动增长。

name 为名字，非空。

gender 为性别，非空。

age 为年龄，非空。

class 为班级名，非空。

score 为成绩，非空。

这和你可视化的建表是一样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4809612d6e6b4eb7b4cc4aa2a2928e6d~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5b1c30d3fb64934859df1444e2318f5~tplv-k3u1fbpfcp-watermark.image?)

这次我们就通过 sql 建表了。

之前我们建了个 student 表，先把它删掉。

```sql
drop table student;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5ae99594bce4e1c85d84b02081e540a~tplv-k3u1fbpfcp-watermark.image?)

然后执行建表 sql：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a24353ed2b449a69c47241e4cd77a03~tplv-k3u1fbpfcp-watermark.image?)

然后查询下这个表：

```sql
SELECT * FROM student;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/755b3fbf8c844f089877f1c5d8e7d569~tplv-k3u1fbpfcp-watermark.image?)

没什么数据。

我们插入一些：

```sql
INSERT INTO student (name, gender, age, class, score)
    VALUES 
        ('张三', '男',18, '一班',90),
        ('李四', '女',19, '二班',85),
        ('王五', '男',20, '三班',70),
        ('赵六', '女',18, '一班',95),
        ('钱七', '男',19, '二班',80),
        ('孙八', '女',20, '三班',75),
        ('周九', '男',18, '一班',85),
        ('吴十', '女',19, '二班',90),
        ('郑十一', '男',20, '三班',60),
        ('王十二', '女',18, '一班',95),
        ('赵十三', '男',19, '二班',75),
        ('钱十四', '女',20, '三班',80),
        ('孙十五', '男',18, '一班',90),
        ('周十六', '女',19, '二班',85),
        ('吴十七', '男',20, '三班',70),
        ('郑十八', '女',18, '一班',95),
        ('王十九', '男',19, '二班',80),
        ('赵二十', '女',20, '三班',75);
```

id 是自动递增的，不需要指定。

先选中执行 insert，再选中执行 select：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/985ad56ee0214a31992538552a1c9652~tplv-k3u1fbpfcp-watermark.image?)

插入了这样 18 条数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c8a82e2ef1d4845b3ef13afe9f51257~tplv-k3u1fbpfcp-watermark.image?)

接下来就用这些数据来练习 sql：

首先，查询是可以指定查询的列的：

```sql
SELECT name, score FROM student;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9ec2a9908674897805c1a04325853be~tplv-k3u1fbpfcp-watermark.image?)

之前 select \* 是查询所有列的意思。

可以通过 as 修改返回的列名：

```sql
SELECT name as 名字, score as 分数 FROM student;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaa114f531394a228cddaa53e753d7f8~tplv-k3u1fbpfcp-watermark.image?)

查询自然是可以带条件的，通过 where：

```sql
select name as 名字,class as 班级 from student where age >= 19;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/137981fb9af04b53b13a2769d5acfd8e~tplv-k3u1fbpfcp-watermark.image?)

并且条件可以是 and 连接的多个：

```sql
select name as 名字,class as 班级 from student where gender='男' and score >= 90;
```

这里单双引号都可以。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/069640f216a84d25bef29d77331dd6ed~tplv-k3u1fbpfcp-watermark.image?)

可以看到，有两个成绩在 90 以上的男生。

你还可以用 LIKE 做模糊查询。

比如查询名字以“王”开头的学生：

```sql
select * from student where name like '王%';
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a037f08b25094d219d7d407bb3cb495c~tplv-k3u1fbpfcp-watermark.image?)

还可以通过 in 来指定一个集合：

```sql
select * from student where class in ('一班', '二班');
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a902ee4120a496fb6232f0be0b2ef89~tplv-k3u1fbpfcp-watermark.image?)

也可以 not in：

```sql
select * from student where class not in ('一班', '二班');
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9debf31e7bbf480ba0f7a84a717d765e~tplv-k3u1fbpfcp-watermark.image?)

in 指定的是一个集合，还可以通过 between and 来指定一个区间：

```sql
select * from student where age between 18 and 20;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8346de8e35041cb97ddc7cdb2d06bf2~tplv-k3u1fbpfcp-watermark.image?)

如果觉得返回的数量太多，可以分页返回，这个是通过 limit 实现的：

```sql
select * from student limit 0,5;
```

比如从 0 开始的 5 个：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4906c635918b43479c93a774a6442ddf~tplv-k3u1fbpfcp-watermark.image?)

这种也可以简化为：

```sql
select * from student limit 5;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d139a1cbc134100b9d85a7f466d7123~tplv-k3u1fbpfcp-watermark.image?)

第二页的数据：

```sql
select * from student limit 5,5;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03894f4fe17c4d0da3b22dc5befd4a2c~tplv-k3u1fbpfcp-watermark.image?)

此外，你可以通过 order by 来指定排序的列：

```sql
select name,score,age from student order by score asc,age desc;
```

order by 指定根据 score 升序排列，如果 score 相同再根据 age 降序排列。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5d571bfd71d44f6bd9fd324c0e2d471~tplv-k3u1fbpfcp-watermark.image?)

此外，还可以分组统计。

比如统计每个班级的平均成绩：

```sql
SELECT class as 班级, AVG(score) AS 平均成绩
    FROM student
    GROUP BY class
    ORDER BY 平均成绩 DESC;
```

这里用到不少新语法：

根据班级来分组是 GROUP BY class。

求平均成绩使用 sql 内置的函数 AVG()。

之后根据平均成绩来降序排列。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c25d09bfb214c769988b0c90e431a9c~tplv-k3u1fbpfcp-watermark.image?)

这种内置函数还有不少，比如 count：

```sql
select class, count(*) as count from student group by class;
```

这里的 \* 就代表当前行。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/403176d8fe2744508ac82ef4e6a31621~tplv-k3u1fbpfcp-watermark.image?)

分组统计之后还可以做进一步的过滤，但这时候不是用 where 了，而是用 having：

```sql
SELECT class,AVG(score) AS avg_score
    FROM student
    GROUP BY class
    HAVING avg_score > 90;
```

不过滤的时候是这样：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fff7977a66f4726950fa00673f19c6b~tplv-k3u1fbpfcp-watermark.image?)

过滤之后是这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ba1a2ad339242208c13877346e2cdbc~tplv-k3u1fbpfcp-watermark.image?)

如果你想查看有哪些班级，可能会这样写：

```sql
SELECT class FROM student;
```

但这样会有很多重复的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf8b29e8f66640d0a79a127d3ce074a4~tplv-k3u1fbpfcp-watermark.image?)

这时候可以用 distinct 去重：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e2c454d3b9d4a499c1d876de0b7e047~tplv-k3u1fbpfcp-watermark.image?)

最后再来过一遍所有的内置函数，函数分为这么几类：

**聚合函数**：用于对数据的统计，比如 AVG、COUNT、SUM、MIN、MAX。

```sql
select avg(score) as 平均成绩,count(*) as 人数,sum(score) as 总成绩,min(score) as 最低分, max(score) as 最高分 from student 
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/593187d4e7894eea8f67e46706734172~tplv-k3u1fbpfcp-watermark.image?)

**字符串函数**：用于对字符串的处理，比如 CONCAT、SUBSTR、LENGTH、UPPER、LOWER。

```sql
SELECT CONCAT('xx', name, 'yy'), SUBSTR(name,2,3), LENGTH(name), UPPER('aa'), LOWER('TT') FROM student;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81123b35617c4000a00f16c38b896a8f~tplv-k3u1fbpfcp-watermark.image?)

其中，substr 第二个参数表示开始的下标（**mysql 下标从 1 开始**），所以 substr('一二三',2,3) 的结果是 '二三'。

当然，也可以不写结束下标 substr('一二三',2)

**数值函数**：用于对数值的处理，比如 ROUND、CEIL、FLOOR、ABS、MOD。

```sql
SELECT ROUND(1.234567, 2), CEIL(1.234567), FLOOR(1.234567), ABS(-1.234567), MOD(5, 2);
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72d16d627b6d4736a9a4bfc538d15664~tplv-k3u1fbpfcp-watermark.image?)

分别是 ROUND 四舍五入、CEIL 向上取整、FLOOR 向下取整、ABS 绝对值、MOD 取模。

**日期函数**：对日期、时间进行处理，比如 DATE、TIME、YEAR、MONTH、DAY
```sql
SELECT YEAR('2023-06-01 22:06:03'), MONTH('2023-06-01 22:06:03'),DAY('2023-06-01 22:06:03'),DATE('2023-06-01 22:06:03'), TIME('2023-06-01 22:06:03');
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adf55e56ad4040bfa39242f456fb9c5a~tplv-k3u1fbpfcp-watermark.image?)

**条件函数**：根据条件是否成立返回不同的值，比如 IF、CASE

```sql
select name, if(score >=60, '及格', '不及格') from student;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed0b5702340d4cc49e0237551d8af74b~tplv-k3u1fbpfcp-watermark.image?)

```sql
SELECT name, score, CASE WHEN score >=90 THEN '优秀' WHEN score >=60 THEN '良好'ELSE '差' END AS '档次' FROM student;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d37ab0b2e14476a93c7302a8bd66665~tplv-k3u1fbpfcp-watermark.image?)

if 和 case 函数和 js 里的 if、swtch 语句很像，很容易理解。

if 函数适合单个条件，case 适合多个条件。

**系统函数**：用于获取系统信息，比如 VERSION、DATABASE、USER。

    select VERSION(), DATABASE(), USER()

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd5ee8f1ecfd45c49bcf2a58586663b6~tplv-k3u1fbpfcp-watermark.image?)

**其他函数**：NULLIF、COALESCE、GREATEST、LEAST。

NULLIF：如果相等返回 null，不相等返回第一个值。

```sql
select NULLIF(1,1), NULLIF(1,2);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f39ce16e5ef43b48911319d6119a954~tplv-k3u1fbpfcp-watermark.image?)

COALESCE：返回第一个非 null 的值：

```sql
select COALESCE(null, 1), COALESCE(null, null, 2)
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04525430993a41ceab4242f17a2a5ea3~tplv-k3u1fbpfcp-watermark.image?)

GREATEST、LEAST：返回几个值中最大最小的。

```sql
select GREATEST(1,2,3),LEAST(1,2,3,4);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aec06f8dfa2b4f5f8227180b80e8ff67~tplv-k3u1fbpfcp-watermark.image?)

**类型转换函数**：转换类型为另一种，比如 CAST、CONVERT、DATE\_FORMAT、STR\_TO\_DATE。

比如下面的函数：

```sql
select greatest(1, '123',3);
```

3 最大，因为它并没有把 '123' 当成数字

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b10911293dd647c69a7ca49d1f21be62~tplv-k3u1fbpfcp-watermark.image?)

这时候就可以用 convert 或者 cast 做类型转换了：

```sql
select greatest(1, convert('123', signed),3);
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fe56c5a529b4e1fb3450470eef98dfb~tplv-k3u1fbpfcp-watermark.image?)

```sql
select greatest(1, cast('123' as signed),3);
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31c97f14a3fd40078f924b408451271c~tplv-k3u1fbpfcp-watermark.image?)

这里可以转换的类型有这些：

*   signed：整型；
*   unsigned：无符号整型
*   decimal：浮点型；
*   char：字符类型；
*   date：日期类型；
*   time：时间类型；
*   datetime：日期时间类型；
*   binary：二进制类型

剩下的 STR\_TO\_DATE 和 DATE\_FORMAT 还是很容易理解的：

```sql
SELECT DATE_FORMAT('2022-01-01', '%Y年%m月%d日');
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d0588a0456440fab1aef39e7ecba8ad~tplv-k3u1fbpfcp-watermark.image?)

```sql
SELECT STR_TO_DATE('2023-06-01', '%Y-%m-%d');
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50015449656042839010b8ed11e2575b~tplv-k3u1fbpfcp-watermark.image?)

至此，我们就把 sql 查询的语法和函数都过了一遍。

此外，你可能注意到，写 sql 的时候，我们有的时候用单双引号，有的时候用反引号，有的时候不加引号：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38934bb3a4d24b82808d79604d7f6de8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=672&h=364&s=66529&e=png&b=f7f7f7)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2ad567af50c4b5b93bf7588ee0274c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=564&h=184&s=23243&e=png&b=f7f7f7)

这里要注意下，当作字符串值用的时候，需要加单引号或者双引号。当作表名、列名用的时候，用反引号或者不加引号。

## 总结

我们连接 mysql 数据库，建了张 student 表，插入了一些数据，然后用这些数据来练习了各种查询语法和函数。

*   **where**：查询条件，比如 where id=1
*   **as**：别名，比如 select xxx as 'yyy'
*   **and**: 连接多个条件
*   **in/not in**：集合查找，比如 where a in (1,2)
*   **between and**：区间查找，比如 where a between 1 and 10
*   **limit**：分页，比如 limit 0,5
*   **order by**：排序，可以指定先根据什么升序、如果相等再根据什么降序，比如 order by a desc,b asc
*   **group by**：分组，比如 group by aaa
*   **having**：分组之后再过滤，比如 group by aaa having xxx > 5
*   **distinct**：去重

sql 还可以用很多内置函数：

*   聚合函数：avg、count、sum、min、max
*   字符串函数：concat、substr、length、upper、lower
*   数值函数：round、ceil、floor、abs、mod
*   日期函数：year、month、day、date、time
*   条件函数：if、case
*   系统函数：version、datebase、user
*   类型转换函数：convert、cast、date\_format、str\_to\_date
*   其他函数：nullif、coalesce、greatest、least

灵活掌握这些语法，就能写出各种复杂的查询语句。
