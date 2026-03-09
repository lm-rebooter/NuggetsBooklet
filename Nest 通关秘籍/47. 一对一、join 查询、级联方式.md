数据库中会有很多的表，分别存储不同的信息，比如学生表存学生的信息、老师表存老师的信息，班级表存班级的信息。

这些表之间不是孤立的，有着一定的关系。

比如班级和学生之间是一对多的关系，也就是一个班级可以有多个学生。

班级和老师之间是多对多的关系，也就是一个班级可以有多个老师，一个老师也可以教多个班级。

如果存储一对一、一对多、多对多这些关系呢？

这就涉及到外键了。

比如一对一的关系，一个用户只能有一个身份证。

这样两个表，分别存储用户信息，还有身份证信息：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7ac9f4ac6fa4e93b2c51b66d9757b9c~tplv-k3u1fbpfcp-watermark.image?)

它们之间是一对一的关系，这时就可以用外键来表示。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/520ee3961ce045fd8dae99388f04821d~tplv-k3u1fbpfcp-watermark.image?)

user 表的主键是 id、可以通过 id 来唯一标识一个 user。

那 id\_card 想查找 user，自然也是通过 id 来查找，多一个列来存储 user id 就可以实现这种一对一的关联。

这个 user\_id 的列就是外键。

user 表叫主表，使用外键引用它的 id\_card 表是从表。

我们建个表来试试看：

选中 hello-mysql 数据库，点击建表按钮：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7057a83d1824e18af6e798da0120281~tplv-k3u1fbpfcp-watermark.image?)

分别添加 id、name 列：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72b3b3f6baa447d185a4c4df8ea2a8b0~tplv-k3u1fbpfcp-watermark.image?)

点击 apply，建表 sql 如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65a3a93170424521a193b2c303b6bfc2~tplv-k3u1fbpfcp-watermark.image?)

你也可以直接用这个 sql 来建表：

```sql
CREATE TABLE `hello-mysql`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` VARCHAR(45) NOT NULL COMMENT '名字',
  PRIMARY KEY (`id`)
);
```

然后再建个 id\_card 表：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65592844feda4d7f808aa44e9e610791~tplv-k3u1fbpfcp-watermark.image?)

id 为 INT 类型，设置 primary key、not null 的约束，然后设置 auto increment。

card\_name 为 VARCHAR(45) 类型，设置 not null 的约束

user\_id 为 INT 类型。

然后添加外键：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb36a6531bff4f9eb99d1bd6d7194e0c~tplv-k3u1fbpfcp-watermark.image?)

指定外键 user\_id 关联 user 表的 id。

这里还要选择主表数据 update 或者 delete 的时候，从表怎么办：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56073e48339c461a8dac495f096f71f3~tplv-k3u1fbpfcp-watermark.image?)

我们先用默认的。

点击 apply，生成的建表 sql 是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2579cd003f0a4b58aef966455cee8961~tplv-k3u1fbpfcp-watermark.image?)

```sql
CREATE TABLE `id_card` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `card_name` varchar(45) NOT NULL COMMENT '身份证号',
  `user_id` int DEFAULT NULL COMMENT '用户 id',
  PRIMARY KEY (`id`),
  INDEX `card_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
)  CHARSET=utf8mb4
```

**这些建表 sql 的语法了解即可，一般不会自己写。**

前面的三行都比较好理解，就是指定每一列的类型、约束、注释。

PRIMARY KEY 是指定 id 为主键。

INDEX 是建立索引，索引名是 card\_id\_idex，这个是用于加速 user\_id 的访问的。

CONSTRINT user\_id FOREIGN KEY 是给 user\_id 添加一个外键约束，然后 user\_id REFERENCES user id 则是指定 user\_id 引用这 user 表的 id 列。

然后就可以看到 user 和 id\_card 表了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4f50e3b75404fbdb9ecbe1796f9ca61~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36c8133bcdc0463f956c39d24a38521c~tplv-k3u1fbpfcp-watermark.image?)

我们插入几条数据：

```sql
INSERT INTO `user` (`name`)
	VALUES
		('张三'),
		('李四'),
		('王五'),
		('赵六'),
		('孙七'),
		('周八'),
		('吴九'),
		('郑十'),
		('钱十一'),
		('陈十二'); 
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd7df24a9d3541e189f20fe390689ecc~tplv-k3u1fbpfcp-watermark.image?)

查询一下：

```sql
SELECT * FROM user;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72b370030a3f4fb38443d1cc21e7f357~tplv-k3u1fbpfcp-watermark.image?)

用户表数据成功插入了。

再插入 id\_card 表的数据：

```sql
INSERT INTO id_card (card_name, user_id) 
    VALUES
        ('110101199001011234',1),
	('310101199002022345',2),
	('440101199003033456',3),
	('440301199004044567',4),
	('510101199005055678',5),
	('330101199006066789',6),
	('320101199007077890',7),
	('500101199008088901',8),
	('420101199009099012',9),
	('610101199010101023',10);
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38421eabe50d418585e0ecce78195352~tplv-k3u1fbpfcp-watermark.image?)

查询一下：

```sql
SELECT * FROM id_card;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2eedd5e4bb341288dfac40eb154fb28~tplv-k3u1fbpfcp-watermark.image?)

这样，一对一关系的数据就插入成功了。

那怎么关联查出来呢？

这样：

```sql
SELECT * FROM user JOIN id_card ON user.id = id_card.user_id;
```

这里用到了 JOIN ON，也就是连接 user 和 id\_card 表，关联方式是 user.id = id\_card.user\_id，也就是 id\_card 表中的外键关联 user 表的主键。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/520ee3961ce045fd8dae99388f04821d~tplv-k3u1fbpfcp-watermark.image?)

点击左上角按钮，新建一条 sql：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09826ae8450342d39f1649a1e4b7648b~tplv-k3u1fbpfcp-watermark.image?)

查询的结果是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ec86f4db396478b8561852175421b43~tplv-k3u1fbpfcp-watermark.image?)

这里的两个 id 分别是 user 和 card 的 id，而且后面的 user\_id 也没必要展示。

我们改下 sql：

```sql
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    JOIN id_card ON user.id = id_card.user_id;
```

指定显示的列，并给 id\_card 表的 id 起个 card\_id 的别名。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c680ece661bf4157b02913f5479f43a0~tplv-k3u1fbpfcp-watermark.image?)

这就是多表关联查询，语法是 JOIN ON。

有同学可能问了，那如果 id\_card 表里有的没有关联 user 呢？

比如这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c75226700d694130a11039f6ca2e718e~tplv-k3u1fbpfcp-watermark.image?)

选中单元格，点击 delete 就可以把它置为 null。

我们把 id\_card 表的最后两条记录的 user\_id 删掉，点击 apply。

这时候再执行上面那条 sql 来查询，就可以看到少了两条记录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9960fb6c72374da09f8b5977aab243e1~tplv-k3u1fbpfcp-watermark.image?)

因为 JOIN ON 其实默认是 INNER JOIN ON，相当于这么写：

```sql
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    INNER JOIN id_card ON user.id = id_card.user_id;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cc40772e66742e19e0ab1a97961173a~tplv-k3u1fbpfcp-watermark.image?)

INNER JOIN 是只返回两个表中能关联上的数据。

你还可以指定其余 2 种 join 类型：

LEFT JOIN 是额外返回左表中没有关联上的数据。

RIGHT JOIN 是额外返回右表中没有关联上的数据。

**在 FROM 后的是左表，JOIN 后的表是右表。**

我们来试一下：

```sql
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    RIGHT JOIN id_card ON user.id = id_card.user_id;
```

当使用 RIGHT JOIN 时，会额外返回右表中没有关联的数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de446edf08e04ef0af975b87d5bdd0fc~tplv-k3u1fbpfcp-watermark.image?)

可以看到返回了所有 id\_card 的数据，没有关联 user 的记录 user 信息为 null。

当时用 LEFT JOIN 时，正好相反：

```sql
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    LEFT JOIN id_card ON user.id = id_card.user_id;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cf88544235e462d8c3ea2d34e9a5077~tplv-k3u1fbpfcp-watermark.image?)

一般情况，还是用默认的 JOIN ON 比较多，也就是 INNER JOIN。

前面还讲到了删除和更新时的级联操作。

也就是当 user 删除的时候，关联的 id\_card 要不要删除？

当 user 的 id 修改的时候，关联的 id\_card 要不要改 user\_id？

我们之前设置的是默认的 RESTICT：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2134c6a4b35a43fc86935a968942810a~tplv-k3u1fbpfcp-watermark.image?)

其实可选的值有 4 种：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f5ab0aabb994bf99731137c9475d804~tplv-k3u1fbpfcp-watermark.image?)

*   CASCADE： 主表主键更新，从表关联记录的外键跟着更新，主表记录删除，从表关联记录删除

*   SET NULL：主表主键更新或者主表记录删除，从表关联记录的外键设置为 null

*   RESTRICT：只有没有从表的关联记录时，才允许删除主表记录或者更新主表记录的主键 id

*   NO ACTION： 同 RESTRICT，只是 sql 标准里分了 4 种，但 mysql 里 NO ACTION 等同于 RESTRICT。

这里不理解不要紧，我们试一下：

现在 user 表是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25ebae1ab06b4097a745c443fda34359~tplv-k3u1fbpfcp-watermark.image?)

右键选择 delete row：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6a77afd4f704c56849a1cd8150197c3~tplv-k3u1fbpfcp-watermark.image?)

这时候会提示你更新失败，因为有外键的约束。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f91da3522b949c684beab76fe7b6ecf~tplv-k3u1fbpfcp-watermark.image?)

点击 revert，回到之前的状态：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4f8b0cfd8244a67a29a3d616fdcaac6~tplv-k3u1fbpfcp-watermark.image?)

然后更新 id 为 11，点击 apply：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d889df506c704bc0904933f2cf5857d0~tplv-k3u1fbpfcp-watermark.image?)

同样会提示你更新失败，因为有外键的约束：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6186789b3a447c6b8ab327a1e5b1d67~tplv-k3u1fbpfcp-watermark.image?)

这就是 **RESTIRCT 和 NO ACTION 的处理逻辑：只要从表有关联记录，就不能更新 id 或者删除记录。**

我们手动把从表记录的关联去掉，也就是删除第一条记录的外键（按 delete 键）：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb9535d02ee544368a49d8d69a5b3377~tplv-k3u1fbpfcp-watermark.image?)

点击 apply 应用这次改动。

然后再试下主表的更新：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32d11bccbbe14d9e996415f0573feb1c~tplv-k3u1fbpfcp-watermark.image?)

这次就更新成功了！

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9536fecbfb6b4b1a8efd34aa23a462f0~tplv-k3u1fbpfcp-watermark.image?)

再来试下删除：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e5128b7cfd46d7a8a553c46afa0a44~tplv-k3u1fbpfcp-watermark.image?)

同样也成功了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6a81c40fb7a486cab97c966b59f4f32~tplv-k3u1fbpfcp-watermark.image?)

这就是 RESTRICT 或者 NO ACTION，只有当从表没有关联的记录的时候，才能更新主表记录的 id 或者删除它。

我们再来试试 CASCADE：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7357d1bb3a1466c987c58905178e481~tplv-k3u1fbpfcp-watermark.image?)

修改外键级联方式为 CASCADE，点击 apply。

先看一下现在 id\_card 表的数据：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a85c3956e9a44336b58a4c13861d9c0c~tplv-k3u1fbpfcp-watermark.image?)

把 id 为 2 的 user 的 id 改为 22，点击 apply：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42c706c63fa04056a8374adbe6d30bc3~tplv-k3u1fbpfcp-watermark.image?)

再看下 id\_card 表的数据，你会发现 user\_id 跟着改了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dedfb9e04484069970d2efa76bdc6fb~tplv-k3u1fbpfcp-watermark.image?)

然后把 id 为 22 的 user 删除掉，点击 apply：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb22b69d3f774ab1846093ff1d97a924~tplv-k3u1fbpfcp-watermark.image?)

再看下 id\_card 表会发现那条 user\_id 为 22 的记录也没了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26d293ab656f406db2a4204f673764d2~tplv-k3u1fbpfcp-watermark.image?)

这就是级联方式为 **CASCADE 的处理逻辑：主表删除，从表关联记录也级联删除，主表 id 更新，从表关联记录也跟着更新。**

然后再试下 set null：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66cda20b31a34821a2f3778fc0ccf47d~tplv-k3u1fbpfcp-watermark.image?)

修改之后点击 apply。

查询下现在的 id\_card 表的数据：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ec6ad89254d42a79a0326f506266493~tplv-k3u1fbpfcp-watermark.image?)

把 user 表中 id 为 5 的记录 id 改为 55，点击 apply：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6477a549c9024a42b5b6e90b2d779660~tplv-k3u1fbpfcp-watermark.image?)

这时候 id\_card 中那条记录的外键被置为 null 了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfbe2579e22c4d749de268738df1a8f5~tplv-k3u1fbpfcp-watermark.image?)

这就是 **set null 的处理逻辑：主表记录删除或者修改 id，从表关联记录外键置为 null。**

## 总结

这节我们学习了一对一的数据表设计，在从表里通过外键来关联主表的主键。

查询的时候需要使用 join on，默认是 inner join 也就是只返回有关联的记录，也可以用 left join、right join 来额外返回没有关联记录的左表或右表的记录。

from 后的是左表，join 后的是右表。

此外，外键还可以设置级联方式，也就是主表修改 id 或者删除的时候，从表怎么做。

有 3 种级联方式：CASCADE（关联删除或更新），SET NULL（关联外键设置为 null），RESTRICT 或者 NO ACTION（没有从表的关联记录才可以删除或更新）

多表的连接是非常常用的操作，下节我们继续学习一对多和多对多的数据表设计。
