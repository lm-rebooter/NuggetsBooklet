上节我们学了 TypeORM 的 migration。

在开发环境下，我们会开启 syncronize，自动同步 entities 到数据库表。

包括 create table 和后续的 alter table。

但是在生产环境下，我们会把它关闭，用 migration 把表结构的变动、数据初始化管理起来。

通过 migration:run、migration:revert 命令来执行和撤销。

在 Nest 项目里使用 migration 和上节的内容还有点不太一样。

这节我们来试一下：

```
nest new nest-typeorm-migration
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe3098bfae9541d38b90caa884a8d5ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=570&s=397551&e=png&b=fefefe)

创建个 nest 项目。

安装 typeorm 相关的包：

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```
在 AppModule 引入下下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e6f146e99f475787aa7238d29e0571~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=1070&s=190551&e=png&b=1f1f1f)

```javascript
TypeOrmModule.forRoot({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "guang",
  database: "nest-migration-test",
  synchronize: true,
  logging: true,
  entities: [],
  poolSize: 10,
  connectorPackage: 'mysql2',
  extra: {
      authPlugin: 'sha256_password',
  }
}),
```
然后创建个 article 模块：

```
nest g resource article
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6657a8b436b34f0b9e6d836e6cb65131~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=470&s=125251&e=png&b=191919)

改下 article.entity.ts

```javascript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 30
    })
    title: string;

    @Column({
        type: 'text'
    })
    content: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}
```
引入下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18e4d49db9cb4ef0978364cbaf7cf302~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1216&h=1182&s=238361&e=png&b=1f1f1f)

然后在 mysql workbench 创建这个 database：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8b4f92220cf4bad828736c5d074ce34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1980&h=1342&s=414230&e=png&b=e7e7e7)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a6dc4661a86497dba1d1ef412cf7881~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=448&h=456&s=79983&e=png&b=e2e2e1)

把服务跑起来：

```
npm run dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9150c2b4f16f4a81b666df743b11f182~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1878&h=926&s=402558&e=png&b=181818)

可以看到，自动创建了 ariticle 的表。

这就是 syncronize 设为 true 的效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2395d65c0d6a4d4cbcf7760fa47c2862~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=606&h=594&s=82613&e=png&b=1f1f1f)

然后我们添加一些数据：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b324f2e661e464abaa0a469c14d67d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=1128&s=292239&e=png&b=1f1f1f)

```javascript
@InjectEntityManager()
entityManager: EntityManager;

async initData() {
    const a1 = new Article();
    a1.title = "夏日经济“热力”十足 “点燃”文旅消费新活力";
    a1.content = "人民网北京6月17日电 （高清扬）高考结束、暑期将至，各地文旅市场持续火热，暑期出游迎来热潮。热气腾腾的“夏日经济”成为消费活力升级的缩影，展示出我国文旅产业的持续发展势头。";

    const a2 = new Article();
    a2.title = "科学把握全面深化改革的方法要求";
    a2.content = "科学的方法是做好一切工作的重要保证。全面深化改革是一场复杂而深刻的社会变革，必须运用科学方法才能取得成功。";

    await this.entityManager.save(Article, a1);
    await this.entityManager.save(Article, a2);
}
```
在 ArticleService 添加 initData 方法，然后在 ArticleController 里调用下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f8129f04a8f42d7a485e8a23ec298d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=566&s=127943&e=png&b=1f1f1f)

```javascript
@Get('init-data')
async initData() {
    await this.articleService.initData();
    return 'done';
}
```
然后浏览器访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7461ae5335724873b33c6c95366fc06b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832&h=262&s=23513&e=png&b=ffffff)

可以看到，数据插入成功了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dd876ef94fc4ace8baf28cdd9b49e37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1486&h=720&s=305428&e=png&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bf4ac934e4f4dac9c1bd5fad777c255~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=554&s=228418&e=png&b=ebeaea)

然后在查询接口里查一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96c1f2ee996e4015b931dd7f5d0c3550~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=338&s=62772&e=png&b=1f1f1f)

```javascript
async findAll() {
    return  this.entityManager.find(Article);
}
```
访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09a40f58cacc4c888ef76f167afe76f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1822&h=710&s=161831&e=png&b=fefefe)

没啥问题。

如果这个 article 的数据是要在生产环境里用的。

而生产环境会关掉 syncronize，那怎么创建表和插入初始化数据呢？

前面讲过，用 migration。

首先需要创建 src/data-source.ts

```javascript
import { DataSource } from "typeorm";
import { Article } from "./article/entities/article.entity";

export default new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "guang",
    database: "nest-migration-test",
    synchronize: false,
    logging: true,
    entities: [Article],
    poolSize: 10,
    migrations: ['src/migrations/**.ts'],
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
});
```
注意，这里 synchronize 是 false，顺便也把 AppModule 里的那个 synchronize 也改为 false。

然后添加几个 npm scripts：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86f2c78adf474002ae645bea3ac95021~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1464&h=342&s=106376&e=png&b=1f1f1f)

```javascript
"typeorm": "ts-node ./node_modules/typeorm/cli",
"migration:create": "npm run typeorm -- migration:create",
"migration:generate": "npm run typeorm -- migration:generate -d ./src/data-source.ts",
"migration:run": "npm run typeorm -- migration:run -d ./src/data-source.ts",
"migration:revert": "npm run typeorm -- migration:revert -d ./src/data-source.ts"
```
我们先在数据库里导出现有数据：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4c90e3958ff4960a7958767f7ecea3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2360&h=1452&s=646265&e=png&b=f1f1f1)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dfcd19e62a0446dbfa0f14cc2010885~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=352&s=72573&e=png&b=f3f2f2)

第一个选项是每个表一个 sql 文件，你也可以选择第二个选项，全部导出一个 sql 文件里：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58ffa827843d4dd8baecd306b44b64e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1290&h=354&s=87805&e=png&b=f2f2f2)

打开看下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/226b04db427341589d25875916047715~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2390&h=1118&s=313161&e=png&b=1f1f1f)

包含了 create table 和 insert 语句。

生产环境关掉 synchronize 后，只要执行这个 sql 就行。

但我们要通过 migration 的方式来执行 sql。

在 mysql workbench 里删掉这两张表：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccddd46105d741a486d52ab7f005de6a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=752&h=700&s=251469&e=png&b=e5e5e4)

然后执行 migration:generate 命令：

```
npm run migration:generate src/migrations/init
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fefd1397fb394d05b529e4e8e6547462~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1808&h=490&s=144061&e=png&b=181818)

它会对比 entity 和数据表的差异，生成迁移 sql：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a937d5f5f8e42999237f6b4186dc356~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2034&h=746&s=229016&e=png&b=1e1e1e)

可以看到，生成的 migration 类里包含了 create table 的 sql。

跑下试试：

```
npm run migration:run
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/411940df2637468e9de3f607b620456b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2006&h=730&s=228776&e=png&b=191919)

可以看到，执行了两条 create table 语句。

在数据库里看下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d15e188cc220412e95e4d284d364fe16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1452&h=744&s=320986&e=png&b=f1f0f0)

migrations 表里记录了执行过的 migration，已经执行过的不会再执行。

article 表就是我们需要在生产环境创建的表：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d32339f2c7674599844b77bc56edcc75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1336&h=718&s=272807&e=png&b=f2f1f1)

然后我们再创建个 migration 来初始化数据：

```
npm run migration:create src/migrations/data
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a81e862a05a04aada377109a5548e610~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1776&h=294&s=71108&e=png&b=181818)

**migration:generate 只会根据表结构变动生成迁移 sql，而数据的插入的 sql 需要我们自己添加。**

严格来说数据初始化不能叫 migration，而应该叫 seed，也就是种子数据。

不过我们都是通过 migration 来管理。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66868fba13144e93bd90152d490410f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686&h=656&s=177722&e=png&b=1d1d1d)

在生成的迁移 class 里填入 insert into 的 sql 即可。

把刚才导出的那个 sql 里的 insert into 语句复制过来。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/538f21c528e7428fb5bb6db99124cf72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2130&h=774&s=237033&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd2a102085354654a59743091758c91b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1900&h=590&s=191106&e=png&b=1d1d1d)

```javascript
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("INSERT INTO `article` VALUES (1,'夏日经济“热力”十足 “点燃”文旅消费新活力','人民网北京6月17日电 （高清扬）高考结束、暑期将至，各地文旅市场持续火热，暑期出游迎来热潮。热气腾腾的“夏日经济”成为消费活力升级的缩影，展示出我国文旅产业的持续发展势头。','2024-06-18 08:56:21.306445','2024-06-18 08:56:21.306445'),(2,'科学把握全面深化改革的方法要求','科学的方法是做好一切工作的重要保证。全面深化改革是一场复杂而深刻的社会变革，必须运用科学方法才能取得成功。','2024-06-18 08:56:21.325168','2024-06-18 08:56:21.325168');")
}
```
如果你要支持 revert，那 down 方法里应该补上 delete 语句，这里我们就不写了。

然后跑一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1d3c691db2405793625408a70111b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2010&h=756&s=261860&e=png&b=191919)

可以看到，在 article 表插入了两条记录。

然后在 migrations 表里插入了一条记录。

为啥上次的 migration 就没执行了呢？

因为 migrations 表里记录过了呀，记录过的就不会再执行。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45a4dc171158445c89b2db48ad391506~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1756&h=486&s=249297&e=png&b=f3f3f3)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c1dae8743c84a308249542219096864~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=440&s=153994&e=png&b=efeeee)

这样怎么在生产环境 create table、insert into 数据我们就都知道了。

然后再来试下后续表结构的修改。

因为生产环境关掉了 syncronize，那 entity 变了之后如何修改表结构呢？

自然也是 migration。

Article 实体加一个 tags字段：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c23c98c7e0b84cab9a9c86f8cd838a0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942&h=876&s=113528&e=png&b=1f1f1f)

```javascript
@Column({
    length: 30
})
tags: string;
```
执行 migration:generate 命令：
```
npm run migration:generate src/migrations/add-tag-column
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d30595abc454c2fa95ef07b5c65ff1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1546&h=522&s=105119&e=png&b=181818)

生成了 alter table 的 sql：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a6c8806bb6a456abba167f68717f2ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2078&h=660&s=243274&e=png&b=1e1e1e)

然后执行下这个 migration：

```
npm run migraion:run
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/533826ed53244db795a1e2c5a69b1b53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1750&h=710&s=195175&e=png&b=181818)

一条 alter table 的 sql，一条 insert 的 sql。

可以看到，article 表多了 tags 列，migrations 表也插入了一条执行记录：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4be8f95af2ee44ee892b6606d0aeea1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1832&h=326&s=161379&e=png&b=f5f5f5)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d482df48fa4e4e06a2180ef8b8d3cc02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=404&s=148370&e=png&b=edecec)

这样，如何在生产环境通过 migration 创建表、修改表、初始化数据我们就都清楚了。

此外，有同学可能会说，我们的数据库连接配置都是放在 config 文件里的，现在两个地方都要用，那如何两个地方都读取配置文件呢？

我们在 src 下创建 .env

```javascript
# mysql 相关配置
mysql_server_host=localhost
mysql_server_port=3306
mysql_server_username=root
mysql_server_password=guang
mysql_server_database=nest-migration-test
```
首先，AppModule 里的这些数据库配置都可以从 .env 里读取：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccad731e18204de6ab48b84952681933~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=1156&s=234531&e=png&b=1f1f1f)

用到 ConfigModule，这个是下节的内容，这里就不展开了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f357c1f6d19a478d8e42dc807424e5a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=1002&s=200211&e=png&b=202020)

我们来看下在 data-source.ts 里怎么读取 .env 文件：

我们需要安装 dotenv 这个包：

```
npm install --save-dev dotenv
```

用 dotenv 来读取 .env 配置文件：

```javascript
import { DataSource } from "typeorm";
import { Article } from "./article/entities/article.entity";
import { config } from 'dotenv';

config({ path: 'src/.env' });

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
    entities: [Article],
    poolSize: 10,
    migrations: ['src/migrations/**.ts'],
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
});
```
跑一下：

```
npm run migration:run
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84a64efc7ff4abd81383c43df74085a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1490&h=782&s=226727&e=png&b=191919)

可以看到，.env 的配置读取成功了。

这样，AppModule 和迁移用的 data-source.ts 里就都可以读取同一份配置。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-typeorm-migration)。

## 总结

生产环境是通过 migration 来创建表、更新表结构、初始化数据的。

这节我们在 nest 项目里实现了下迁移。

大概有这几步：

- 创建 data-source.ts 供 migration 用
- 把 synchronize 关掉
- 用 migration:generate 生成创建表的 migration
- 用 migration:run 执行
- 用 migration:create 创建 migration，然后填入数据库导出的 sql 里的 insert into 语句
- 用 migration:run 执行
- 用 migration:generate 生成修改表的 migration
- 用 migration:run 执行

在生产环境下，我们就是这样创建表、更新表、初始化数据的。
