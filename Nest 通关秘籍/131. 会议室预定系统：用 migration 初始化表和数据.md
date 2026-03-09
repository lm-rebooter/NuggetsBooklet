前几节我们把项目部署到了阿里云，能够在全球各地通过 ip 来访问了。

方式是在服务器上通过 git 下载代码，然后用 docker compose 来跑。

但我们并没有把 typeorm 的 synchronize 关掉，也就是现在还是根据 entity 自动创建表的方式。

这种方式并不安全，entity 一改表结构就自动跟着改，容易丢数据。

在生产环境应该把 synchronize 关掉，然后用 migration 来管理创建表、数据初始化、表结构修改等操作。

这节我们来做一下：

首先，我们在 mysql workbench 里把现有的数据导出。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e56a30913b5c4473a1b72ee5fef63baf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2380&h=1552&s=706376&e=png&b=efefef)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bf81835324b423382e9462b4442e35a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320&h=410&s=95087&e=png&b=fdfdfd)

这样每个表一个 sql 文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10b96991542d4f09b9fa840527e10741~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1634&h=1238&s=336861&e=png&b=1f1f1f)

我们选择第二个选项，重新导出下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12e9028bd0d7487f8d387f56d9d8bb6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2310&h=1306&s=569281&e=png&b=f4f4f4)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ee8a79bc857419486069ebcd07cec9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=524&h=230&s=33002&e=png&b=fbfbfb)

这样就都集中到一个 sql 文件里了。

打开这个生成的 sql 文件看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d058106e04433d82fe4e50b20bf882~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1504&h=1374&s=400388&e=png&b=1f1f1f)

包含了所有的表的 create table 和 insert into 语句。

然后我们在项目的 package.json 里加一下 migration 的 npm scripts：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3577825c002c405196fabcd352e36917~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1444&h=474&s=146892&e=png&b=1f1f1f)

```javascript
"typeorm": "ts-node ./node_modules/typeorm/cli",
"migration:create": "npm run typeorm -- migration:create",
"migration:generate": "npm run typeorm -- migration:generate -d ./src/data-source.ts",
"migration:run": "npm run typeorm -- migration:run -d ./src/data-source.ts",
"migration:revert": "npm run typeorm -- migration:revert -d ./src/data-source.ts"
```
migration 需要单独一个 data-source.ts 文件。

创建下 src/data-source.ts

```javascript
import { DataSource } from "typeorm";
import { config } from 'dotenv';

import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/user.entity';
import { MeetingRoom } from "./meeting-room/entities/meeting-room.entity";
import { Booking } from "./booking/entities/booking.entity";

config({ path: 'src/.env-migration' });

console.log(process.env);

export default new DataSource({
    type: "mysql",
    host: `${process.env.mysql_server_host}`,
    port: +`${process.env.mysql_server_port}`,
    username: `${process.env.mysql_server_username}`,
    password: `${process.env.mysql_server_password}`,
    database: `${process.env.mysql_server_database}`,
    synchronize: false,
    logging: true,
    entities: [
      User, Role, Permission, MeetingRoom, Booking
    ],
    poolSize: 10,
    migrations: ['src/migrations/**.ts'],
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
});
```
synchronize 指定为 false，顺便把 AppModule 里的 synchronize 也改为 false。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4e8190a321d4bb9ac795492fd8b9cea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1202&h=960&s=229619&e=png&b=1f1f1f)

我们创建个单独的 .env-migration 文件：

```javascript
mysql_server_host=localhost
mysql_server_port=3306
mysql_server_username=root
mysql_server_password=guang
mysql_server_database=meeting_room_booking_system
```
因为 .env 里配置的 host 是容器名，那个只对 docker compose 内部生效：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e47c570535684751886e34ec572eb9af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=586&s=110081&e=png&b=1f1f1f)

而 migration 的时候我们是需要真实的 host 的地址的，所以单独搞一个 .env 文件来配置。

跑下 migration:generate 试试：

```
npm run migration:generate src/migrations/init
```

如果遇到找不到 entity 的错误，把绝对路径改为相对路径就好了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a1ad17e16f04aa7a56881ad462a36fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1350&h=506&s=109416&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9ed05e0d988413ca37f94ea380277bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1386&h=550&s=101392&e=png&b=1f1f1f)

这时候没什么更改：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7d8ba70248c4caaa1d42da7115c3667~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1752&h=674&s=128513&e=png&b=181818)

因为 entity 和数据库表是同步的。

我们把数据表给删掉：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51acba9a9bb9488da606f1524c12e20e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=750&s=359624&e=png&b=e1e0df)

再跑下：

```
npm run migration:generate src/migrations/init
```
这时候就成功生成了迁移代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe3a118a7c334433ba32af2306d1d7e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2238&h=720&s=269870&e=png&b=191919)

里面包含的自然就是所有表的 create table 语句：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a87129b74bdb40ab87cab01d95ea014b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2580&h=1634&s=1060650&e=png&b=1e1e1e)

跑下这个迁移：

```
npm run migration:run
```
可以看到，所有 create table 语句都执行了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c708ad23b3e54308914bf724d76b62d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1532&h=1020&s=438514&e=png&b=191919)

数据库里也有了这些表：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5007a6116d4948a1aeb798dd37713597~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1594&h=758&s=330779&e=png&b=efeeee)

并且在 migrations 表里记录了这个 migration 的执行记录：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2ffb52198cd4d77b3a5cf668fee06d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=612&s=186441&e=png&b=ececeb)

表创建好了，还要做初始化数据。

我们同样通过 migration 来做，但是这个是没法 generate 的，generate 只会对比表结构，然后生成迁移 sql。

执行 create 生成 migration 类：

```
npm run migration:create src/migrations/data
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbfdaa0cbb6442e2a8757e9e42578bfb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2208&h=334&s=90545&e=png&b=181818)

这次我们自己来填 sql：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd3768a92d7f4a4696f7ff4f4707aa87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1630&h=554&s=156401&e=png&b=1d1d1d)

之前导出的 sql 文件现在就有用了。

把里面的 insert into 语句复制出来：

```javascript
import { MigrationInterface, QueryRunner } from "typeorm";

export class Data1718869390167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query("INSERT INTO `booking` VALUES (1,'2023-09-29 10:54:01','2023-09-29 11:54:01','审批通过','',1,3,'2023-09-29 03:06:54.088220','2023-11-17 01:58:53.000000'),(2,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批驳回','',2,6,'2023-09-29 03:06:54.088220','2023-10-21 03:42:53.000000'),(3,'2023-09-29 11:54:02','2023-09-29 12:54:02','已解除','',2,3,'2023-09-29 03:06:54.088220','2023-11-19 01:10:49.741279'),(4,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',1,6,'2023-09-29 03:06:54.088220','2023-11-19 02:30:58.000000'),(5,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',8,11,'2023-09-29 03:06:54.088220','2023-11-19 02:30:58.000000'),(6,'2023-09-29 10:54:02','2023-09-29 11:54:02','已解除','',9,11,'2023-09-29 03:06:54.088220','2024-01-01 01:23:53.000000'),(7,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',9,3,'2023-09-29 03:06:54.088220','2024-01-01 01:10:14.279639'),(8,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',9,6,'2023-09-29 03:06:54.088220','2024-01-01 01:19:23.388907'),(13,'2023-12-31 09:40:59','2023-12-31 09:57:39','申请中','',1,11,'2023-12-31 04:34:38.917720','2024-01-01 01:08:53.884596'),(14,'2023-12-31 09:42:39','2023-12-31 10:14:19','申请中','',1,6,'2023-12-31 04:35:06.508185','2024-01-01 01:08:04.023433'),(15,'2024-01-01 11:00:00','2024-01-01 12:00:00','申请中','',1,3,'2024-01-01 02:43:26.920016','2024-01-01 02:43:26.920016'),(16,'2024-01-01 13:00:00','2024-01-01 14:00:00','申请中','',1,3,'2024-01-01 02:45:47.758012','2024-01-01 02:45:47.758012'),(17,'2024-01-01 15:00:00','2024-01-01 16:00:00','申请中','',1,3,'2024-01-01 02:46:39.654219','2024-01-01 02:46:39.654219');")
       await queryRunner.query("INSERT INTO `meeting_room` VALUES (3,'天王星33',30,'三层东','白板，电视','',0,'2023-09-16 08:10:25.319000','2023-09-16 08:10:25.319000'),(6,'aa',10,'bb','','',0,'2023-09-16 16:11:31.532151','2023-09-16 16:11:31.532151'),(11,'xxx',0,'xxx','xxx','xxx',0,'2023-09-28 00:27:28.529606','2023-09-28 00:27:28.529606'),(12,'aaa',0,'xxx','xxx','xxx',0,'2023-09-28 00:28:09.291785','2023-09-28 00:28:09.291785');")
       await queryRunner.query("INSERT INTO `permissions` VALUES (7,'ccc','访问 ccc 接口'),(8,'ddd','访问 ddd 接口');")
       await queryRunner.query("INSERT INTO `role_permissions` VALUES (7,7),(7,8),(8,7);")
       await queryRunner.query("INSERT INTO `roles` VALUES (7,'管理员'),(8,'普通用户');")
       await queryRunner.query("INSERT INTO `user_roles` VALUES (8,7),(9,8);")
       await queryRunner.query("INSERT INTO `users` VALUES (1,'guang','e10adc3949ba59abbe56e057f20f883e','神说要有光','xxxx@xx.com',NULL,NULL,1,0,'2023-07-25 02:25:03.379725','2023-09-12 03:40:40.000000'),(2,'guang2','e10adc3949ba59abbe56e057f20f883e','神说要有光2','1024195375@qq.com',NULL,NULL,1,0,'2023-07-26 01:39:33.456072','2023-09-12 03:57:06.000000'),(8,'zhangsan','e3ceb5881a0a1fdaad01296d7554868d','张三','1024195375@qq.com','uploads/1694845395657-974488092-headpic1.png','13233323333',1,1,'2023-07-26 03:19:06.523236','2023-09-16 06:59:32.000000'),(9,'lisi','1a100d2c0dab19c4430e7d73762b3423','里斯','yy@yy.com','xxx.png',NULL,1,0,'2023-07-26 03:19:06.553169','2023-08-02 13:05:53.000000'),(10,'dongdong','1a100d2c0dab19c4430e7d73762b3423','东东555','1024195375@qq.com','uploads/1692775078275-227950493-headpic2.png',NULL,1,0,'2023-08-12 15:41:10.537642','2023-09-12 04:01:41.000000'),(11,'gang','96e79218965eb72c92a549dd5a330112','小刚','1024195375@qq.com',NULL,NULL,1,0,'2023-08-12 23:54:38.856096','2023-09-12 03:50:45.000000'),(12,'xiaohong','96e79218965eb72c92a549dd5a330112','小红','1024195375@qq.com',NULL,NULL,0,0,'2023-08-13 00:00:53.802850','2023-09-12 03:54:32.846920'),(13,'xiaodong','96e79218965eb72c92a549dd5a330112','东东','1024195375@qq.com',NULL,NULL,1,0,'2023-08-13 00:01:52.641836','2023-09-12 03:53:09.000000');")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("TRUNCATE TABLE booking");
    }

}
```
这里要用你自己的 sql。

然后 down 部分如果你想 revert 的话也可以写一下，就是 insert into 的反义词 delete from，或者直接 truncate table 清空数据。

跑一下：

```
npm run migration:run
```
这一步有可能报错：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d443c1881cd544c48c1d6c14bd6c85a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1282&h=626&s=186127&e=png&b=191919)

也就是列的顺序对不上。

因为 sql 文件里的顺序是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/856dcdf2a0854606a0085541f494dd5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1202&s=403211&e=png&b=1f1f1f)

第 6、7 列是 userId、roomId，和 insert into 语句对应。

而现在第 6 列是 createTime：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3feabbe5c434e8db6d5dd05db567d6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1504&h=576&s=245604&e=png&b=eae9e9)

所以就报了上面的错误。

这个问题的解决也简单，insert into 的时候指定列名就好了。

右键表，选择复制 insert into 语句：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12a4d698ab4a4014a72d02ac539e1988~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=478&s=208797&e=png&b=e6e5e4)

在输入框粘贴下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/921b308a5114434f9a46108b631b833e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=638&s=236786&e=png&b=fdfcfc)

把列名这部分复制出来，调整成正确的顺序然后放到 insert into 的 sql 里：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c221be9eb8fe41a98090fe9447eb3a52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2238&h=420&s=210560&e=png&b=1f1f1f)

只有这一个有问题的 insert 语句指定下列名就行，别的 insert 语句不用改。

然后你还可能遇到外键约束的问题：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad3cf19beb8143e98b232ed62f013b47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2634&h=474&s=221236&e=png&b=191919)

就是你插入了一条 booking 记录，里面的 userId 在 user 表里没关联的 user。

这种调整下插入顺序就好了，先插入 user 表，再插入 booking 表。

```javascript
import { MigrationInterface, QueryRunner } from "typeorm";

export class Data1718869390167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO `booking`(`id`,`startTime`,`endTime`,`status`,`note`,`userId`,`roomId`,`createTime`,`updateTime`) VALUES (1,'2023-09-29 10:54:01','2023-09-29 11:54:01','审批通过','',1,3,'2023-09-29 03:06:54.088220','2023-11-17 01:58:53.000000'),(2,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批驳回','',2,6,'2023-09-29 03:06:54.088220','2023-10-21 03:42:53.000000'),(3,'2023-09-29 11:54:02','2023-09-29 12:54:02','已解除','',2,3,'2023-09-29 03:06:54.088220','2023-11-19 01:10:49.741279'),(4,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',1,6,'2023-09-29 03:06:54.088220','2023-11-19 02:30:58.000000'),(5,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',8,11,'2023-09-29 03:06:54.088220','2023-11-19 02:30:58.000000'),(6,'2023-09-29 10:54:02','2023-09-29 11:54:02','已解除','',9,11,'2023-09-29 03:06:54.088220','2024-01-01 01:23:53.000000'),(7,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',9,3,'2023-09-29 03:06:54.088220','2024-01-01 01:10:14.279639'),(8,'2023-09-29 10:54:02','2023-09-29 11:54:02','审批通过','',9,6,'2023-09-29 03:06:54.088220','2024-01-01 01:19:23.388907'),(13,'2023-12-31 09:40:59','2023-12-31 09:57:39','申请中','',1,11,'2023-12-31 04:34:38.917720','2024-01-01 01:08:53.884596'),(14,'2023-12-31 09:42:39','2023-12-31 10:14:19','申请中','',1,6,'2023-12-31 04:35:06.508185','2024-01-01 01:08:04.023433'),(15,'2024-01-01 11:00:00','2024-01-01 12:00:00','申请中','',1,3,'2024-01-01 02:43:26.920016','2024-01-01 02:43:26.920016'),(16,'2024-01-01 13:00:00','2024-01-01 14:00:00','申请中','',1,3,'2024-01-01 02:45:47.758012','2024-01-01 02:45:47.758012'),(17,'2024-01-01 15:00:00','2024-01-01 16:00:00','申请中','',1,3,'2024-01-01 02:46:39.654219','2024-01-01 02:46:39.654219');")
        await queryRunner.query("INSERT INTO `users` VALUES (1,'guang','e10adc3949ba59abbe56e057f20f883e','神说要有光','xxxx@xx.com',NULL,NULL,1,0,'2023-07-25 02:25:03.379725','2023-09-12 03:40:40.000000'),(2,'guang2','e10adc3949ba59abbe56e057f20f883e','神说要有光2','1024195375@qq.com',NULL,NULL,1,0,'2023-07-26 01:39:33.456072','2023-09-12 03:57:06.000000'),(8,'zhangsan','e3ceb5881a0a1fdaad01296d7554868d','张三','1024195375@qq.com','uploads/1694845395657-974488092-headpic1.png','13233323333',1,1,'2023-07-26 03:19:06.523236','2023-09-16 06:59:32.000000'),(9,'lisi','1a100d2c0dab19c4430e7d73762b3423','里斯','yy@yy.com','xxx.png',NULL,1,0,'2023-07-26 03:19:06.553169','2023-08-02 13:05:53.000000'),(10,'dongdong','1a100d2c0dab19c4430e7d73762b3423','东东555','1024195375@qq.com','uploads/1692775078275-227950493-headpic2.png',NULL,1,0,'2023-08-12 15:41:10.537642','2023-09-12 04:01:41.000000'),(11,'gang','96e79218965eb72c92a549dd5a330112','小刚','1024195375@qq.com',NULL,NULL,1,0,'2023-08-12 23:54:38.856096','2023-09-12 03:50:45.000000'),(12,'xiaohong','96e79218965eb72c92a549dd5a330112','小红','1024195375@qq.com',NULL,NULL,0,0,'2023-08-13 00:00:53.802850','2023-09-12 03:54:32.846920'),(13,'xiaodong','96e79218965eb72c92a549dd5a330112','东东','1024195375@qq.com',NULL,NULL,1,0,'2023-08-13 00:01:52.641836','2023-09-12 03:53:09.000000');")
        await queryRunner.query("INSERT INTO `meeting_room` VALUES (3,'天王星33',30,'三层东','白板，电视','',0,'2023-09-16 08:10:25.319000','2023-09-16 08:10:25.319000'),(6,'aa',10,'bb','','',0,'2023-09-16 16:11:31.532151','2023-09-16 16:11:31.532151'),(11,'xxx',0,'xxx','xxx','xxx',0,'2023-09-28 00:27:28.529606','2023-09-28 00:27:28.529606'),(12,'aaa',0,'xxx','xxx','xxx',0,'2023-09-28 00:28:09.291785','2023-09-28 00:28:09.291785');")
        await queryRunner.query("INSERT INTO `permissions` VALUES (7,'ccc','访问 ccc 接口'),(8,'ddd','访问 ddd 接口');")
        await queryRunner.query("INSERT INTO `roles` VALUES (7,'管理员'),(8,'普通用户');")
        await queryRunner.query("INSERT INTO `role_permissions` VALUES (7,7),(7,8),(8,7);")
        await queryRunner.query("INSERT INTO `user_roles` VALUES (8,7),(9,8);")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("TRUNCATE TABLE booking");
    }

}
```

调整完再跑：

```
npm run migration:run
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e759af437e8a448ab78c21e9a9e525b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1936&h=1100&s=451765&e=png&b=191919)

执行成功了！

在数据库看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccd4932ed3c64b06a8d2a3f0e2861d29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2154&h=944&s=728533&e=png&b=f2f1f1)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bbafbcf642f4cd6abcdf85237ffaf3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1888&h=730&s=477354&e=png&b=f2f1f1)

数据都插入成功了，并且 migrations 表也记录了这次的执行记录：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/480cbef86ac544639540d185a99e87b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1268&h=656&s=217009&e=png&b=efeeee)

这样之后，生产环境就有表、也有数据了，之后就可以正常跑 Nest 应用了。

代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/meeting_room_booking_system_backend)。

## 总结

这节我们实现了 migration 数据迁移，也就是创建表、初始化数据。

在生产环境会把 synchronize 关掉，然后跑 migration。

我们用 migration:generate 生成了 create table 的 migration。

然后用 migration:create 生成了空的 migration，填入了导出的 inert 语句。

执行完这两个 migration 之后，表和数据就都有了，就可以跑 Nest 项目了。

线上项目，都是这样用手动跑 migration 的方式来修改表的。
