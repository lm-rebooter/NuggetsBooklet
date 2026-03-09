我们经常会见到一些多级分类的场景：

比如京东的商品分类：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec05bb2792fb4de7a3f9033ccdcb2a69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1450&h=618&s=172213&e=png&b=fcfcfc)

新闻网站的新闻分类：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/880d4154f083438d95a4aacca95ac235~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1684&h=504&s=165044&e=png&b=fcfcfc)

这种多层级的数据怎么存储呢？

有同学会说，很简单啊，这不就是一对多么，二级分类就用两个表，三级分类就用三个表。

这样是可以，但是都是分类，表结构是一样的，分到多个表里是不是有点冗余。

更重要的是，如果层级关系经常调整呢？

比如有的时候会变成二级分类，有的时候会更多级分类呢？

这时候用普通的多表之间的一对多就不行了。

一般这种多级分类的业务，我们都会在一个表里存储，然后通过 parentId 进行子关联来实现。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09005167be4b44c4919a1505a1c48a8a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=166&s=64518&e=png&b=fcfcfc)

在 TypeORM 里也对这种场景做了支持。

我们新建个项目：

```
nest new typeorm-tree-entity-test
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2192b95684e2424fa3e8fc7c7508ab54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=684&s=172605&e=png&b=010101)

进入项目目录，创建一个 CRUD 模块：

```
nest g resource city --no-spec
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a78595f650ff47af952c458a4797814f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=362&s=92907&e=png&b=181818)

然后安装 TypeORM 的包：
```bash
npm install --save @nestjs/typeorm typeorm mysql2
```
在 app.module.ts 引入下 TypeOrmModule：

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CityModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "tree_test",
      synchronize: true,
      logging: true,
      entities: [City],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
在 mysql workbench 里创建这个 database：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ff3e4978327485f8fbd4d71c937b87e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1576&h=1108&s=227443&e=png&b=e8e8e8)

指定字符集为 utf8mb4，点击 apply。

然后改下 city.entity.ts

```javascript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";

@Entity()
@Tree('closure-table')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    status: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;
    
    @Column()
    name: string;

    @TreeChildren()
    children: City[];

    @TreeParent()
    parent: City;
}
```
把服务跑起来：

```
npm run start:dev
```
可以看到，自动创建了 2 个表：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01d1a8bd802749b29d5cce1f96937dc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1496&h=810&s=365517&e=png&b=191919)

我们在 mysql workbench 里看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c97d6b09c6b4a539fd347041e0ce915~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1494&h=738&s=283914&e=png&b=eeeceb)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5f3a9e2fe0c47b6a2fc61659598d5d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518&h=660&s=184583&e=png&b=f2f0ef)

可以看到 parentId 引用了自身的 id。

并且还有个 city_closure 表：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa891eb34ad14823ab89e2bf97d19779~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=502&s=134674&e=png&b=eeebea)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6e18421386140bdaabd25e7918141c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=978&h=928&s=116043&e=png&b=f7f7f7)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3b23f5f994b49f2b81cd42490944b5a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=884&s=138591&e=png&b=f8f8f8)

两个外键都引用了 city 表的 id。

先不着急解释为什么是这样的，我们插入一些数据试试：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bd72cd660104d2db6dba0b1dfdf16e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150&h=974&s=179655&e=png&b=1f1f1f)

在 CityService 的 findAll 方法里插入数据，然后再查出来。

```javascript
@InjectEntityManager()
entityManager: EntityManager;

async findAll() {
    const city = new City();
    city.name = '华北';
    await this.entityManager.save(city);

    const cityChild = new City()
    cityChild.name = '山东'
    const parent = await this.entityManager.findOne(City, {
      where: {
        name: '华北'
      }
    });
    if(parent){
      cityChild.parent = parent
    }
    await this.entityManager.save(City, cityChild)

    return this.entityManager.getTreeRepository(City).findTrees();
}
```
这里创建了两个 city 的 entity，第二个的 parent 指定为第一个。

用 save 保存。

然后再 getTreeRepository 调用 findTrees 把数据查出来。

浏览器访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db93902b4414325a22ddb8ff390a898~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=848&s=101783&e=png&b=ffffff)

可以看到数据插入成功了，并且返回了树形结构的结果。

在 mysql workbench 里看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8aebbf1b5ac40f98a0e59f5fcb9da34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1566&h=304&s=135656&e=png&b=f0eeed)

在 city 表里保存着 city 记录之间的父子关系，通过 parentId 关联。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b8848e1726f4c9798b2881bd214eade~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=346&s=94811&e=png&b=ebe7e6)

在 city_closure 表里记录了也记录了父子关系。

把插入数据的代码注释掉：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/309af302c46246bab265e2866dc5daa3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=840&s=138982&e=png&b=1f1f1f)

重新插入数据：

```javascript
async findAll() {
    const city = new City();
    city.name = '华南';
    await this.entityManager.save(city);

    const cityChild1 = new City()
    cityChild1.name = '云南'
    const parent = await this.entityManager.findOne(City, {
      where: {
        name: '华南'
      }
    });
    if(parent){
      cityChild1.parent = parent
    }
    await this.entityManager.save(City, cityChild1)

    const cityChild2 = new City()
    cityChild2.name = '昆明'

    const parent2 = await this.entityManager.findOne(City, {
      where: {
        name: '云南'
      }
    });
    if(parent){
      cityChild2.parent = parent2
    }
    await this.entityManager.save(City, cityChild2)

return this.entityManager.getTreeRepository(City).findTrees();
}
```

跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/969dedc554804eb4afb6270732b566ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=1530&s=225036&e=png&b=ffffff)

可以看到，二层和三层的关系都可以正常的存储和查询。

把插入数据的代码注释掉，我们测试下其他方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85e1af4043864252b935ec5b20d44bad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=566&s=84302&e=png&b=1f1f1f)

findRoots 查询的是所有根节点：

```javascript
async findAll() {
    return this.entityManager.getTreeRepository(City).findRoots()
}
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eec4a40bb8f94373a7e10b26b2d9b37e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=766&s=89965&e=png&b=ffffff)

```javascript
async findAll() {
    const parent = await this.entityManager.findOne(City, {
      where: {
        name: '云南'
      }
    });
    return this.entityManager.getTreeRepository(City).findDescendantsTree(parent)
}
```

findDescendantsTree 是查询某个节点的所有后代节点。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/405114be08374b68a7243b4ac25df582~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=774&s=96677&e=png&b=ffffff)

```javascript
async findAll() {
    const parent = await this.entityManager.findOne(City, {
      where: {
        name: '云南'
      }
    });
    return this.entityManager.getTreeRepository(City).findAncestorsTree(parent)
}
```

findAncestorsTree 是查询某个节点的所有祖先节点。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6280a2b801f94413b438b03f3d842b29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=862&h=668&s=88188&e=png&b=ffffff)

这里换成 findAncestors、findDescendants 就是用扁平结构返回：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71e0e019184c4ebfaa1003a59d7796d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=938&h=790&s=92170&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ada83b0f7374f27aa81567b144bd6ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=748&s=90133&e=png&b=ffffff)

把 findTrees 换成 find 也是会返回扁平的结构：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1c36560d40b424ca478fe243137e0a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=1506&s=205030&e=png&b=ffffff)

还可以调用 countAncestors 和 countDescendants 来计数：

```javascript
async findAll() {
    const parent = await this.entityManager.findOne(City, {
      where: {
        name: '云南'
      }
    });
    return this.entityManager.getTreeRepository(City).countAncestors(parent)
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/121deae269254913b4688aa22d288af7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=724&h=192&s=18501&e=png&b=ffffff)

这些 api 都是很实用的。

回过头来，再看下 @Tree 的 entity：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5411b6d46ed8449fab93a04324cc4f69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=710&h=1008&s=130946&e=png&b=1f1f1f)

通过 @TreeChildren 声明的属性里存储着它的 children 节点，通过 @TreeParent 声明的属性里存储着它的 parent 节点。

并且这个 entity 要用 @Tree 声明。

参数可以指定 4 中存储模式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7169db370cfb447087144e5230fd3a14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=522&h=224&s=33445&e=png&b=202020)

我们一般都是用 closure-table，或者 materialized-path。

其余两种有点问题：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ee820886cd542789afe9f1237d2eac4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2282&h=588&s=180913&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bef3d51a5364b1ea95ac6ce80a3bad7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2298&h=704&s=177666&e=png&b=ffffff)

把两个表删掉：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e80203993df42bb930aee3a81997769~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=734&h=682&s=205244&e=png&b=e7e3e2)

改成 materialized-path 重新跑：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e681d533cba4e37bf3f32a996d86e99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=424&s=66894&e=png&b=202020)

可以看到，现在只生成了一个表：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1e1ad9fef9d40ee9ec10d8a68698b6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1394&h=294&s=100451&e=png&b=e7e4e3)

只是这个表多了一个 mpath 字段。

我们添加点数据：

```javascript
async findAll() {
    const city = new City();
    city.name = '华北';
    await this.entityManager.save(city);

    const cityChild = new City()
    cityChild.name = '山东'
    const parent = await this.entityManager.findOne(City, {
      where: {
        name: '华北'
      }
    });
    if(parent){
      cityChild.parent = parent
    }
    await this.entityManager.save(City, cityChild)

    return this.entityManager.getTreeRepository(City).findTrees();
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0325a3bcde3b4bbfb0f18506f51337ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=834&s=99746&e=png&b=ffffff)

可以看到，它通过 mpath 路径存储了当前节点的访问路径，从而实现了父子关系的记录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70fb53967f1c49e789b13e618c5e257a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=260&s=72682&e=png&b=f7f7f7)

其实这些存储细节我们不用关心，不管是 closure-table 用两个表存储也好，或者 materialized-path 用一个表多加一个 mpath 字段存储也好，都能完成同样的功能。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/typeorm-tree-entity-test)。

## 总结

这节我们基于 TyepORM 实现了任意层级的关系的存储。

在 entity 上使用 @Tree 标识，然后通过 @TreeParent 和 @TreeChildren 标识存储父子节点的属性。

之后可以用 getTreeRepository 的 find、findTrees、findRoots、findAncestorsTree、findAncestors、findDescendantsTree、findDescendants、countDescendants、countAncestors 等 api 来实现各种关系的查询。

存储方式可以指定 closure-table 或者 materialized-path，这两种方式一个用单表存储，一个用两个表，但实现的效果是一样的。

以后遇到任意层级的数据的存储，就是用 Tree Entity 吧。
