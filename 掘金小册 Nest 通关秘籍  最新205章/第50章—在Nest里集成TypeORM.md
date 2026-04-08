### 本资源由 itjc8.com 收集整理
﻿TypeORM 怎么用我们已经学会了，在 Nest 里用那不就是再封装一层的事情么？

那怎么封装呢？

先回忆下 TypeORM 的流程：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-1.png)

DataSource 里存放着数据库连接的配置，比如用户名、密码、驱动包、连接池配置等等。

而 Entity 里通过 @Entity、@PrimaryGeneratedColumn、@Column 等装饰器来建立数据库表的映射关系。

同时还有 Entity 之间的 @OneToOne、@OneToMany、@ManyToMany 的关系，这些会映射成数据库表通过外键、中间表来建立的关系。

DataSource.initialize 的时候，会和数据库服务建立连接，如果配置了 synchronize，还会生成建表 sql 语句来创建表。

DataSource 初始化之后就可以拿到 EntityManager 了，由它负责对各种 Entity 进行增删改查，比如 find、delete、save 等方法，还可以通过 query builder 来创建复杂的查询。

如果你只是想做对单个 Entity 的 CRUD，那可以拿到这个 Entity 的 Repository 类，它同样有上面的那些方法，只是只能用来操作单个 Entity。

这就是 TypeORM 的流程。

那如果让你把 TypeORM 的 api 封装一层，做成一个 TypeOrmModule，你会怎么封装呢？

很明显，这里的 datasource 的配置是需要手动传入的，也就是说需要做成动态模块，支持根据传入的配置来动态产生模块内容。

而动态模块的规范里就 3 种方法名： register、forRoot、forFeature。

这里很明显要用 forRoot，也就是只需要注册一次，然后这个模块会在各处被使用。

类似这样：

```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'xxx';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

然后内部就根据传入的配置来创建 DataSource，调用 intialize 方法，之后就拿到 EntityManager，可以做 CRUD 了。

但是 Entity 肯定会分散在各个业务模块，每个模块都通过 forRoot 引入那个模块太麻烦，我们干脆把它用 @Global 声明成全局的。

这样每个模块里就都可以注入 EntityManager 来用了，不需要 imports。

那如果我想用 Repository 的方式来 CRUD 呢？

那可以先注入 EntityManager，然后再通过 EntityManager.getRepository(XxxEntity) 来拿呀。

或者可以再做一个动态模块，传入 Entity，返回它的 Repository。

这种局部的动态模块，一般都是用 forFeature 的名字：

```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'xxxx';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [],
})
export class UsersModule {}
```

比如传入 User，内部通过 EntityManager.getRepository(User) 来拿到 UserEntity。

这样 UserService 里就可以通过 UserRepository 来实现增删改查了。

这个封装思路貌似挺完美。

那我们来看看 @nestjs/typeorm 是怎么封装的吧。

创建个 Nest 项目：

    nest new nest-typeorm -p npm

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-2.png)

然后创建一个 crud 的模块：

    nest g resource user

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-3.png)

生成的 service 里的 crud 并没有真正实现：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-4.png)

我们引入 typeorm 来实现下：

    npm install --save @nestjs/typeorm typeorm mysql2

typeorm、mysql2 的包我们很熟悉了，而 @nestjs/typeorm 就是把 typeorm api 封装了一层的包。

它提供了一个模块，我们在入口引入下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-5.png)

连接配置和前几节一样，引入 User 的 Entity。

```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "typeorm_test",
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

然后在 User 的 Entity 里加一些映射的信息：

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'aaa_user'
})
export class User {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        name: 'aaa_name',
        length: 50
    })
    name: string;
}
```

给映射的表给个名字叫 aaa\_user，然后有两个字段，分别是 id 和 name。

我们跑一下试试：

    nest start --watch

看到建表 sql 了没：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-6.png)

这部分和我们单独跑 typeorm 没啥区别：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-7.png)

然后是增删改查，我们可以注入 EntityManager：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-8.png)

用它来做增删改查：

```javascript
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  
  @InjectEntityManager()
  private manager: EntityManager;

  create(createUserDto: CreateUserDto) {
    this.manager.save(User, createUserDto);
  }

  findAll() {
    return this.manager.find(User)
  }

  findOne(id: number) {
    return this.manager.findOne(User, {
      where: { id }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.manager.save(User, {
      id: id,
      ...updateUserDto
    })
  }

  remove(id: number) {
    this.manager.delete(User, id);
  }
}
```

这里的 save、findOne、delete 方法我们都用过。

然后我们用 postman 来试一下：

发个 post 请求，带上要添加的数据：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-9.png)

服务端打印了 insert 的 sql 语句：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-10.png)

表里也可以看到这条数据了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-11.png)

对应的是这个 handler：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-12.png)

然后再试下查询：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-13.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-14.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-15.png)

单个查询和全部查询都是可以的。

再就是修改：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-16.png)

在 controller 里是接受 patch 的请求。


在 postman 里发一下：
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-17.png)



可以看到生成了 update 的 sql 语句：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-18.png)

数据库中的数据也被修改了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-19.png)

再试试删除：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-20.png)

在 postman 里发送 delete 的请求：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-21.png)

可以看到生成了 delete 的 sql 语句：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-22.png)

数据库里的数据确实被删除了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-23.png)

至此，我们就正式打通了从请求到数据库的整个流程！

这里的 CRUD 部分用到的 api 我们都用过好多遍了。

只不过现在是通过 TypeOrm.forRoot 来传入的数据源的配置，通过 @InjectEntityManager 来注入的 entityManager 对象。

直接用 EntityManager 的缺点是每个 api 都要带上对应的 Entity：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-24.png)

简便方法就是先 getRepository(User) 拿到 user 对应的 Repository 对象，再调用这些方法。

比如这样：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-25.png)

那还不如直接注入 User 对应的 Respository 就好了。

Nest 对这个做了封装，在 user 模块引入 TypeOrmModule.forFeature 对应的动态模块，传入 User 的 Entity：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-26.png)

就可以在模块里注入 Repository 了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-27.png)

它有的方法和 EntityManager 一样，只是只能用来操作当前 Entity。

此外，你还可以注入 DataSource：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-28.png)

不过这个不常用。

这就是 Nest 里集成 TypeOrm 的方式。

有了 TypeOrm 的使用基础之后，学起来还是非常简单的。

那它是怎么实现的呢？

我们来看下源码：

首先，我们通过引入 TypeOrmModule.forRoot 的动态模块的时候：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-29.png)

它会引入 TypeOrmCoreModule.forRoot 的动态模块：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-30.png)

这里面根据 options 创建 DataSource 和 EntityManager 放到模块的 provider 里，并放到了 exports 里。

而且，更重要的是这个模块是 @Global 的全局模块。

因此，dataSource 和 entityManager 就可以在任意的地方注入了。

上面那两个方法里，创建 DataSource 的过程就是传入参数，调用 intialize 方法：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-31.png)

而创建 entityManager，则是注入 dataSource 取 manager 属性就好了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-32.png)

然后 TypeOrmModule.forFeature 则是通过全局的 dataSource.getRepository 拿到参数对应的 Repository 对象，作为模块内的 provider。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-33.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第50章-34.png)

这样引入这个动态模块的模块内就可以注入这些 Entity 对应的 Repository 了。

这就是 @nestjs/typeorm 的 TypeOrmModule.forRoot 和 TypeOrmModule.forFeature 的实现原理。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-typeorm)。

## 总结

我们会了用 TypeOrm 来连接和增删改查数据库表，在 Nest 里集成只是对 TyprOrm 的 api 封装了一层。

使用方式是在根模块 TypeOrmModule.forRoot 传入数据源配置。

然后就可以在各处注入 DataSource、EntityManager 来做增删改查了。

如果想用 Repository 来简化操作，还可以在用到的模块引入 TypeOrmModule.forFeature 的动态模块，传入 Entity，会返回对应的 Repository。

这样就可以在模块内注入该 Repository 来用了。

它的原理是 TypeOrmModule.forRoot 对应的动态模块是全局的，导出了 dataSource、entityManager，所以才可以到处注入。

而 TypeOrmModule.forFeature 则会根据吧传入 Entity 对应的 Repository 导出，这样就可以在模块内注入了。

这就是 Nest 里集成 TypeOrm 的方式和实现原理。

至此，我们就可以打通从请求到数据库的流程了。
