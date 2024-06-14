后端主要做的事情就是把数据从数据库中查出来返回给前端渲染，或者把前端提交的数据存入数据库。

学习后端技术，数据库是很重要的一步。

这节我们就来学下最流行的数据库 MySQL 的使用。

就和我们用 Docker 时一样，mysql 也是分为后台守护进程和客户端两方面。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb24542069c642528df69f7781b63d26~tplv-k3u1fbpfcp-watermark.image?)

我们会在命令行客户端或者 GUI 客户端里连接 MySQL，发送 SQL 语句来操作它。

通过 Docker Desktop 查询下 MySQL 的镜像：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e845a52a08646088c4caf6e62a752bc~tplv-k3u1fbpfcp-watermark.image?)

点击 run，传入参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33961dc3a8cd4d9c805c2ff096a1caf9~tplv-k3u1fbpfcp-watermark.image?)

这里端口 3306 就是 client 连接 mysql 的端口。

（另一个 33060 端口是 mysql8 新加的管理 mysql server 的端口，这里用不到）

指定 volume，用本地目录作为数据卷挂载到容器的 /var/lib/mysql 目录，这个是 mysql 保存数据的目录。

（这里的 /Users/guang/mysql 是我本地的一个目录，任意目录都行。在 windows 下就是 D://xxx/xx 的形式）

之前我们也在 mysql 镜像的 dockerfile 里看到过这个 volume 声明：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d21fb69df4814ca6b09d860a76169aca~tplv-k3u1fbpfcp-watermark.image?)

这里还要指定密码 MYSQL\_ROOT\_PASSWORD，也就是 client 连接 mysql server 的密码。

如果不填，容器跑起来会有这样的提示：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d048bdc4e9a346e5a954a24e4a8aebef~tplv-k3u1fbpfcp-watermark.image?)

让你必须指定这三个环境变量中的一个。

现在 mysql 容器就成功跑起来了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d54eef315d2a454bab9b1980f1c7db72~tplv-k3u1fbpfcp-watermark.image?)

mysql 镜像里带了 mysql 命令行工具，我们先用它连上 mysql server 操作下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12cfb210ec46413fa8c1f4d283162bf3~tplv-k3u1fbpfcp-watermark.image?)

输入 mysql -u root -p 然后会让你输入密码，之后就进入 mysql 操作界面了。

现在可以通过 sql 操作数据库了。

但我们不着急学 sql，还是从 GUI 客户端开始学。

GUI 客户端有很多，这里我们用 mysql 官方的 GUI 客户端： [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

选择你的操作系统版本和 cpu 架构对应的安装包，点击 download：

（m1 芯片要选择 arm 的包）

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f771e67913f4440a69cbe3cc3778cdf~tplv-k3u1fbpfcp-watermark.image?)

它会让你登录，你可以点下面的 no thanks，直接开始下载：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/592ec2f05895495da340ff9ca7294659~tplv-k3u1fbpfcp-watermark.image?)

安装包下载后，点击安装。

安装好后，打开 mysql workbench，点击这个 + 号：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6b8755152034d25bffb272c4a642c81~tplv-k3u1fbpfcp-watermark.image?)

输入连接名，点击 store in keychain 输入密码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b076aa8b54e42d1acf080f15f878d4c~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe94aaf1a22944348e9b473fae832474~tplv-k3u1fbpfcp-watermark.image?)

之后你可以点击下 Test Connection 测试连接是否成功：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02a6fa76b8b54c4aaadf647086fb8754~tplv-k3u1fbpfcp-watermark.image?)

然后点击 ok。

之后点击这个连接，进入操作 mysql server 的界面：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/778b991cc2f14d99aaf946d057281649~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/474c3d7987c642c5a25c0af8e1b2dc00~tplv-k3u1fbpfcp-watermark.image?)

点击 schemas 就可以看到 mysql 现在已有的数据库和它下面的表、视图、存储过程、函数等：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bef064519e443b7a58abbb04b6d34fc~tplv-k3u1fbpfcp-watermark.image?)

什么是视图、存储过程、函数之后再讲。

我们先点击这个图标看一下 sys\_config 表中的数据：

它会自动执行查询这个表全部数据的 sql：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bf4bf35997b44e5ad5174d3e80b5a52~tplv-k3u1fbpfcp-watermark.image?)

这就是这个表的数据：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fa9748f06c747739188e32c743b2044~tplv-k3u1fbpfcp-watermark.image?)

点击第一个图标，会展示表的信息，比如多少列、多少行、占据了多大的空间等：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/537270f09a3b4f42afcfed0ab12f2e05~tplv-k3u1fbpfcp-watermark.image?)

点击第二个图标是修改表的列的定义的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a46b949944341b8afebb294fd9362ac~tplv-k3u1fbpfcp-watermark.image?)

不要改这个数据库，我们新建一个来测试。

连接之后，我们可以看到 mysql server 的所有的 database 或者叫 schema。

（从 MySQL5.0 开始，官方文档中开始使用 schema 来代替 database 来描述 MySQL 中的数据库。但是，实际上 MySQL 中的数据库仍然可以使用 database 来称呼，两者是等价的）

每个数据库下存储着很多表、视图、存储过程和函数。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1551e10ee464e4aa12c041aa7d37bc2~tplv-k3u1fbpfcp-watermark.image?)

当然，我们最常用的还是表。

上面这 5 个按钮分别是创建 schema、table、view、stored procedure、function 的。

点击第一个，创建个 database（或者叫 schema）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71d2cee7bb0a48369e3348b3218298d1~tplv-k3u1fbpfcp-watermark.image?)

输入名字，指定字符集，点击右下角的 apply。

创建成功之后，就可以看到我们刚建的数据库了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1afa8bd8e7d3421ebd418d98166bd347~tplv-k3u1fbpfcp-watermark.image?)

选中 hello-mysql 数据库，点击创建 table 的按钮，我们来建个表：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3b76c4ccbee4e3ea0454b2241ad3349~tplv-k3u1fbpfcp-watermark.image?)

输入表名 student。

先建立 id 列：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c692ce2b473346a9ab68d803d6ed32e0~tplv-k3u1fbpfcp-watermark.image?)

输入描述，选中 primary key、 auto increment 的约束。

primary key 是主键，也就是区分每一行数据的那一列，这一列一般命名为 id。

primary key 自带了唯一（unique）和非空（not null）的约束。

再就是要勾选 auto increment 这样插入数据的时候，会自动设置 1、2、3、4、 的递增的 id。

然后依次创建 name、age、sex、email、create\_time、status 列：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75b57c88448241759286441ce074e339~tplv-k3u1fbpfcp-watermark.image?)

分别是名字、年龄、性别、邮箱、创建时间、是否删除的意思。

可以填入注释和默认值。

比如 status 用 0 表示未删除，1 表示已删除，这叫做逻辑删除。也就是删除的时候就是从 0 改成 1，但不会真正删除数据。

name 和 create\_time 添加非空约束。

mysql 的数据类型有很多：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/453930c61b6a4a729743f49c858acf98~tplv-k3u1fbpfcp-watermark.image?)

整数类的有：TINYINT、SMALLINT、MEDIUMINT、INT 和 BIGINT

看名字就可以看出来，就是存储空间的大小不同

浮点型数字的有 FLOAT、DOUBLE

定点型数字的有 DECIMAL、MUMARIC

字符串型的有 CHAR、VARCHAR、TEXT和 BLOB

日期型的有 DATE、TIME、DATETIME、TIMESTAMP

不过我们常用的也就这么几个：

**INT**：存储整数

**VARCHAR(100)**: 存储变长字符串，可以指定长度

**CHAR**：定长字符串，不够的自动在末尾填充空格

**DOUBLE**：存储浮点数

**DATE**：存储日期 2023-05-27

**TIME**：存储时间 10:13

**DATETIME**：存储日期和时间 2023-05-27 10:13

其余的类型用到再查也行。

这里还有个 TIMESTAMP 类型，它也是存储日期时间的，但是范围小一点，而且会转为中央时区 UTC 的时间来存储。

可以看到，mysql 设计了这么多的数据类型，一个目的自然是存储更丰富的信息，另一个目的就是尽可能的节省存储空间，比如 tiny、small、medinum、big 等各种 int。。。

点击右下角的 apply，就会生成建表 sql：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7726bc5092b640a48609067038b2c61d~tplv-k3u1fbpfcp-watermark.image?)

这就是建表语句的语法。

这里简单说一下 sql 的分类，sql 是分为好几种的，这种创建数据库、创建表等修改结构的 sql 叫做 DDL（Data Definition Language），而增删改那种叫做 DML（Data Manipulate Language），查询数据的叫做 DQL（Data Query Language）。

知道这个概念就好了。

然后我们继续：

创建成功之后点击第三个图标，就可以查询这个表的所有数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eacc77c17a24a84a39f9b7f2dfc3480~tplv-k3u1fbpfcp-watermark.image?)

你可以新增几行数据，每一行数据叫做一个记录（Record）。

可以在下面直接编辑，然后点击 apply：

（这里不用设置 id，因为我们指定了它自增了，会自动设置）

（status 也不用设置，因为我们指定了默认值了）

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec7914c1266c467abc04a19c69b8c7fe~tplv-k3u1fbpfcp-watermark.image?)

他会生成 insert 语句，这是向表中插入数据的语法：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1dac17b831e49a483273c1a86c2be3f~tplv-k3u1fbpfcp-watermark.image?)

把它复制一下，之后我们用 insert 语句来插入数据吧，mysql workbench 这个可视化编辑功能不好用。

点击 apply 之后，mysql 会执行 sql，这时候就可以看到这条记录被插入了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/331d4828ca70470bb2e20f7c0de2520b~tplv-k3u1fbpfcp-watermark.image?)

因为我之前测试的时候插入过几条，所以 id 自增到了 5，status 默认设置了 0。

接下来我们用 sql 的方式插入：

```sql
INSERT INTO `hello-mysql`.`student` (`name`, `age`, `sex`, `email`, `create_time`) VALUES ('bbb', '23', '1', 'bbb@qq.com', '2023-05-27 10:50:00');

INSERT INTO `hello-mysql`.`student` (`name`, `age`, `sex`, `email`, `create_time`) VALUES ('ccc', '21', '0', 'ccc@qq.com', '2023-05-26 10:50:00');

INSERT INTO `hello-mysql`.`student` (`name`, `age`, `sex`, `email`, `create_time`) VALUES ('ddd', '22', '1', 'ddd@qq.com', '2023-05-28 10:50:00');
```

在上面的输入框输入这几条 sql，选中它们，然后点击执行 sql 的按钮：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb9cf395d2604199905d4c8d43b46192~tplv-k3u1fbpfcp-watermark.image?)

下面是执行结果，可以看到都插入成功了，一共 3 行。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61222401e88b4d8795d0c6f75217b693~tplv-k3u1fbpfcp-watermark.image?)

然后再选中上面的查询 sql 来执行：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcbc26509dcd41609e38a0140aa35fd1~tplv-k3u1fbpfcp-watermark.image?)

下面也同样会展示查询 sql 的执行情况，一共返回了 4 行数据：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43cb23dab16442ca9680cf3e8bf95dab~tplv-k3u1fbpfcp-watermark.image?)

新增学会了，修改和删除呢？

我们同样可视化操作一下，然后看看 sql：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8de7ca71957e49f995d73464ae77b836~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/780a530ec409476986507fdb8a23c7dc~tplv-k3u1fbpfcp-watermark.image?)

修改和删除的 sql 分别是这样的：

```sql
UPDATE `hello-mysql`.`student` SET `email` = 'xxx@qq.com' WHERE (`id` = '10');
```

```sql
DELETE FROM `hello-mysql`.`student` WHERE (`id` = '10');
```

更新 hello-mysql 数据库的 student 表，设置 email 列为 <xxx@qq.com>，条件是 id 为 10。

是不是很容易理解？

毕竟 sql 就是设计出来给人用的嘛。

删除数据也同样很容易理解：

删除 hello-mysql 数据的 student 的 id 为 10 的列。

至此，我们已经学会 mysql 的数据库表的创建和增删改查了。

创建表是这样的（这个不用记，一般不会手动写 sql 创建表）：

```sql
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(45) NOT NULL COMMENT '名字',
  `age` int DEFAULT NULL COMMENT '年龄',
  `sex` int DEFAULT NULL COMMENT '性别',
  `email` varchar(60) DEFAULT NULL COMMENT '邮箱',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `status` int DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) CHARSET=utf8mb4
```

也就是指定创建的表的名字，然后括号内 , 分隔的每一列分别指定名字、类型、约束、注释、默认值等。

插入记录是这样的：

```sql
INSERT INTO `student` (`name`, `age`, `sex`, `email`, `create_time`) VALUES ('bbb', '23', '1', 'bbb@qq.com', '2023-05-27 10:50:00');
```

更新记录是这样的：

```sql
UPDATE `hello-mysql`.`student` SET `email` = 'xxx@qq.com' WHERE (`id` = '2');
```

删除记录是这样的：

```sql
DELETE FROM `hello-mysql`.`student` WHERE (`id` = '2');
```

查询记录是这样的：

```sql
SELECT * FROM `hello-mysql`.student;
```

增删改的 sql 都很简单，查询的 sql 可以写的很复杂，这个我们下节再讲。

最后再来学下删除和清空表的 sql：

清空是 truncate：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f161834b59dc4e9287b2929e4e3de308~tplv-k3u1fbpfcp-watermark.image?)

点击 review sql
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/568e4fcd2e7e49f4bd275f1496c01175~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c70f0a8cffdc4f14912b2da2c106cc23~tplv-k3u1fbpfcp-watermark.image?)

删除是 drop：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb7bb88d0ae14962b316d45b62071423~tplv-k3u1fbpfcp-watermark.image?)

都很好理解。

按照 sql 分类，我们学的 table 的创建、删除、清空的 sql 都属于 DDL。table 数据的增删改属于 DML，而数据的查询属于 DQL。

这些 sql 在 mysql 命令行里执行也是一样的。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5989606aabe4cfc94e371fdd9065cb3~tplv-k3u1fbpfcp-watermark.image?)

一般我们还是用 GUI 工具更多一些。

最后还有一个小技巧，这里每次都要指定数据库名比较麻烦：

可以先 use 数据库名 切换下数据库：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a647b8141594493a9a29a3c4b3ef4b4~tplv-k3u1fbpfcp-watermark.image?)

这就像我们切到某个目录执行命令一样。

在 mysql workbench 里也是这样，先选中 use xx 那行执行，然后再选中其他 sql 执行。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a8e3a2dda0f472dae8980076b370ab3~tplv-k3u1fbpfcp-watermark.image?)

有同学可能会问，之前 sql 不一直都大写么？咋这里用小写了？

sql 语句不区分大小写，用大写只是关键词更容易区分一些。

最后，还记得我们跑 mysql 镜像指定了个 volume 数据卷么？

之前是没数据的，现在就有数据了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0acab77ce294379a36f39334b6353c1~tplv-k3u1fbpfcp-watermark.image?)

本地对应的目录也修改了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c7694e1422543548957e6377c06aa81~tplv-k3u1fbpfcp-watermark.image?)

这样还会丢数据么？

不会，哪怕这个容器不行了，下次换个镜像挂载上这个目录一样跑。

## 总结

mysql 分为 server 和 client，我们通过 docker 跑了一个 mysql server，指定了端口、数据卷，并通过 MYSQL\_ROOT\_PASSWORD 环境变量指定了 root 的密码。

然后下载了 mysql workbench 这个官方的 GUI 客户端。

可视化创建了一个 database 或者叫 schema。

之后创建了一个表，指定了主键和其他列的约束、默认值等。

之后学习了增删改查数据的可视化操作和对应的 INSERT、DELETE、UPDATE、SELECT 的 sql 语句。

还有 CREATE TABLE、TRUNCATE TABLE、DROP TABLE 等语句，这些修改结构的 sql 叫做 DDL。

增删改数据的 sql 叫做 DML，而查询数据的 sql 叫做 DQL。

当然，这只是单表的操作，下一节我们来学习多表的关联以及复杂 sql 查询语句的编写。
