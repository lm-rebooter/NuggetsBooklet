在数据库里，表和表之间是存在关系的。

比如用户和身份证是一对一的关系，部门和员工是一对多的关系，文章和标签是多对多的关系。

我们是通过外键来存储这种关系的，多对多的话还要建立中间表。

TypeORM 是把表、字段、表和表的关系映射成 Entity 的 class、属性、Entity 之间的关系，那如何映射这种一对一、一对多、多对多的关系呢？

我们来试一下。

这次创建个新的 database 来用：

```sql
create database typeorm_test;
```

执行它：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/289f4e8f06344612b44eb5b1ea5da799~tplv-k3u1fbpfcp-watermark.image?)

点击刷新，就可以看到这个新的 database 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ba26fccc9e643349e556f183d453afb~tplv-k3u1fbpfcp-watermark.image?)

我们用 typeorm 连上它来自动创建表。

```sql
npx typeorm@latest init --name typeorm-relation-mapping --database mysql
```

创建个 typeorm 项目。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ecb2a5465d843c3bcec9e37734cf934~tplv-k3u1fbpfcp-watermark.image?)

修改 DataSource 的配置：

```javascript
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "guang",
    database: "typeorm_test",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
    poolSize: 10,
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
})
```

安装驱动包  mysql2

    npm install --save mysql2

然后跑起来：

    npm run start

可以看到，它生成了建表 sql 和插入数据的 sql：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95575452cd945fe8b974a537c64d17d~tplv-k3u1fbpfcp-watermark.image?)

点击刷新，在 workbench 里也可以看到这个新建的表：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c83fa31ec754a6a87e3707d997db45c~tplv-k3u1fbpfcp-watermark.image?)

点击新建 sql，执行 select，也是可以看到插入的数据的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab5c65d2ae78484a9a5fbd52daa35aa9~tplv-k3u1fbpfcp-watermark.image?)

然后我们再创建个身份证表。

通过 typeorm entity:create 命令创建：

```sql
npx typeorm entity:create src/entity/IdCard
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8087008a6a334c78aedbb020ee3c0116~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8cd0fb941df47be9ae85cc56d3be346~tplv-k3u1fbpfcp-watermark.image?)

填入属性和映射信息：

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({
    name: 'id_card'
})
export class IdCard {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        comment: '身份证号'
    })
    cardName: string
}
```

在 DataSource 的 entities 里引入下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c8d991bff3e4d18a75f474088347a20~tplv-k3u1fbpfcp-watermark.image?)

重新 npm run start：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e98e1b98ee364976b612ca7f52330e30~tplv-k3u1fbpfcp-watermark.image?)

可以看到生成了这条建表 sql。

workbench 里也可以看到这个表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b89af9f78e1405fb0da310cd259a945~tplv-k3u1fbpfcp-watermark.image?)

现在 user 和 id\_card 表都有了，怎么让它们建立一对一的关联呢？

先把这两个表删除：

```sql
drop table id_card,user;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df6cdd7a6e124c4c8295e55a9e478cb0~tplv-k3u1fbpfcp-watermark.image?)

在 IdCard 的 Entity 添加一个 user 列，指定它和 User 是 @OneToTone 一对一的关系。

还要指定 @JoinColum 也就是外键列在 IdCard 对应的表里维护：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df3d8610e46b44d7a12a55e807e8c401~tplv-k3u1fbpfcp-watermark.image?)

重新 npm run start：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c16cb9f63228424098ab34a79b005013~tplv-k3u1fbpfcp-watermark.image?)

仔细看生成的这 3 条 sql 语句。

前两个是建表 sql，创建 id\_card 和 user 表。

最后一个是给修改 id\_card 表，给 user\_id 列添加一个外建约束，引用 user 表的 id 列。

在 workbench 里看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9a0b1aa42349b79453e6acd2346a2a~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01efc274a10a4f77b61578216bf24684~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a309c8bd67d64413bb732db91b3c6df0~tplv-k3u1fbpfcp-watermark.image?)

生成的表都是对的。

但是这个级联关系还是默认的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7986bb37929948c189d8ec285737830a~tplv-k3u1fbpfcp-watermark.image?)

如果我们想设置 CASCADE 应该怎么做呢？

在第二个参数指定：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d17a8c308384251a41858794235969a~tplv-k3u1fbpfcp-watermark.image?)

删除这两个表：

```sql
drop table id_card,user;
```

重新 npm run start：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52dbcec0657e4637912b2273bacd8b10~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7abe9bd2e0e0435291f3e779fea2fdd7~tplv-k3u1fbpfcp-watermark.image?)

这样就设置了级联删除和级联更新。

我们再来试下增删改查：

```javascript
import { AppDataSource } from "./data-source"
import { IdCard } from "./entity/IdCard"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    const user = new User();
    user.firstName = 'guang';
    user.lastName = 'guang';
    user.age = 20;
    
    const idCard = new IdCard();
    idCard.cardName = '1111111';
    idCard.user = user;
    
    await AppDataSource.manager.save(user);
    await AppDataSource.manager.save(idCard);

}).catch(error => console.log(error))
```

创建 user 和 idCard 对象，设置 idCard.user 为 user，也就是建立关联。

然后先保存 user，再保存 idCard。

跑 npm run start，生成的 sql 如下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff2f5d922cc3438b97dda180e1624ea9~tplv-k3u1fbpfcp-watermark.image?)

可以看到后面插入 id\_card 的时候，已经有 userId 可以填入了。

数据都插入成功了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/725cfd2318a4447db556c989f0c1c09c~tplv-k3u1fbpfcp-watermark.image?)

但是我还要分别保存 user 和 idCard，能不能自动按照关联关系来保存呢？

可以的，在 @OneToOne 那里指定 cascade 为 true：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3c41fc3ef2d443497900c72f3945cb4~tplv-k3u1fbpfcp-watermark.image?)

这个 cascade 不是数据库的那个级联，而是告诉 typeorm 当你增删改一个 Entity 的时候，是否级联增删改它关联的 Entity。

这样我们就不用自己保存 user 了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d301618a68b4220a9e9eb92ecabecb0~tplv-k3u1fbpfcp-watermark.image?)

重新 npm run start：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfbac4e51cd342dea93316582285343f~tplv-k3u1fbpfcp-watermark.image?)

可以看到它同样是先插入了 user，再插入了 id\_card，并且设置了正确的 userId。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b6980a7a59b418e994e56a43df71b0b~tplv-k3u1fbpfcp-watermark.image?)

保存了之后，怎么查出来呢？

我们用 find 来试下：

```javascript
const ics = await AppDataSource.manager.find(IdCard);
console.log(ics);
```

跑下 npm run start：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99bf23a8acb14c6eab552b7266b4d906~tplv-k3u1fbpfcp-watermark.image?)

可以看到 idCard 查出来了，但是关联的 user 没查出来。

只需要声明下 relations 关联查询就好了：

```javascript
const ics = await AppDataSource.manager.find(IdCard, {
    relations: {
        user: true
    }
});
console.log(ics);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c652abacfca8496287338231701eb07a~tplv-k3u1fbpfcp-watermark.image?)

再跑一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22f1825077d54f46997f85207716e64d~tplv-k3u1fbpfcp-watermark.image?)

现在 idCard 关联的 user 就被查出来了。

当然，你也可以用 query builder 的方式来查询：

```javascript
const ics = await AppDataSource.manager.getRepository(IdCard)
    .createQueryBuilder("ic")
    .leftJoinAndSelect("ic.user", "u")
    .getMany();

console.log(ics);
```

先 getRepository 拿到操作 IdCard 的 Repository 对象。

再创建 queryBuilder 来连接查询，给 idCard 起个别名 ic，然后连接的是 ic.user，起个别名为 u：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8b2ead32b974f269b92fc0e8ce4f2ef~tplv-k3u1fbpfcp-watermark.image?)

或者也可以直接用 EntityManager 创建 queryBuilder 来连接查询：

```javascript
const ics = await AppDataSource.manager.createQueryBuilder(IdCard, "ic")
    .leftJoinAndSelect("ic.user", "u")
    .getMany();
console.log(ics);
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1713e7f2b184b92bbf0bdb62922efa6~tplv-k3u1fbpfcp-watermark.image?)

再来试下修改：

现在数据是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/038aaeed8c4740b0ae45628dda09601e~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d33b24bcad5a470187dbb7a3a7f3991d~tplv-k3u1fbpfcp-watermark.image?)

我们给它加上 id 再 save：

```javascript
const user = new User();
user.id = 1;
user.firstName = 'guang1111';
user.lastName = 'guang1111';
user.age = 20;

const idCard = new IdCard();
idCard.id = 1;
idCard.cardName = '22222';
idCard.user = user;

await AppDataSource.manager.save(idCard);
```

这样数据就被修改了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bb5e3d383854283b27f41eb2bade7a8~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73602e594f1c4cdd90ac32b06dd46706~tplv-k3u1fbpfcp-watermark.image?)

看下生成的 sql：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d415ee641574a188c713d7423312d96~tplv-k3u1fbpfcp-watermark.image?)

在一个事务内，执行了两条 update 的 sql。

最后再试试删除。

因为设置了外键的 onDelete 是 cascade，所以只要删除了 user，那关联的 idCard 就会跟着被删除。

```javascript
await AppDataSource.manager.delete(User, 1)
```

如果不是没有这种级联删除，就需要手动删了：

```javascript
const idCard = await AppDataSource.manager.findOne(IdCard, {
    where: {
        id: 1
    },
    relations: {
        user: true
    }
})
await AppDataSource.manager.delete(User, idCard.user.id)
await AppDataSource.manager.delete(IdCard, idCard.id)
```

不过现在我们只是在 idCard 里访问 user，如果想在 user 里访问 idCard 呢？

同样需要加一个 @OneToOne 的装饰器：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/130e467d600046bda18ad71a9134db12~tplv-k3u1fbpfcp-watermark.image?)

不过需要有第二个参数。

因为如果是维持外键的那个表，也就是有 @JoinColumn 的那个 Entity，它是可以根据外键关联查到另一方的。

但是没有外键的表怎么查到另一方呢？

所以这里通过第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。

我们查一下试试：

```javascript
const user = await AppDataSource.manager.find(User, {
    relations: {
        idCard: true
    }
});
console.log(user);
```

可以看到，同样关联查询成功了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92b000c9b2404bccb478a2d373770178~tplv-k3u1fbpfcp-watermark.image?)

这就是一对一关系的映射和增删改查。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/typeorm-relation-mapping)。

## 总结

TypeORM 里一对一关系的映射通过 @OneToOne 装饰器来声明，维持外键列的 Entity 添加 @JoinColumn 装饰器。

如果是非外键列的 Entity，想要关联查询另一个 Entity，则需要通过第二个参数指定外键列是另一个 Entity 的哪个属性。

可以通过 @OneToOne 装饰器的 onDelete、onUpdate 参数设置级联删除和更新的方式，比如 CASCADE、SET NULL 等。

还可以设置 cascade，也就是 save 的时候会自动级联相关 Entity 的 save。

增删改分别通过 save 和 delete 方法，查询可以通过 find 也可以通过 queryBuilder，不过要 find 的时候要指定 relations 才会关联查询。

这就是 TypeORM 里一对一的映射和增删改查，下节我们继续学习一对多的映射。
