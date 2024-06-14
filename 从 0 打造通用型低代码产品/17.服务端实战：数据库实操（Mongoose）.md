在上一章我们一起学习了基于 **TypeORM** 的 **MySQL** 数据库实操，**MySQL** 作为关系型数据库，配标 **TypeORM** 是非常简单上手，但对于 **MongoDB** 的兼容就没有那么友好但也是可以用起来，本章我们将一起来简单上手看下如果使用 **TypeORM** 来操作 **MongoDB**。

## 配置

首先，我们需要再次确定你们的工作目录结构是否如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/173fe7200473443291a116703228a54d~tplv-k3u1fbpfcp-watermark.image?)

如果是从第一张开始到现在，目前手上应该是有 **3** 个工程，其中 **User** 工程使用的 **MySQL** 作为 **Demo**，低代码 **low-code-test** 则使用 **MongoDB** 作为底层数据库。

之所以低代码的项目会选择 **MongoDB**，基于下述一些个人的见解：
1.  **灵活性**：**MongoDB** 是一种文档数据库，与传统的关系型数据库不同。文档数据库的数据模型更加灵活，可以轻松地存储各种类型的数据，而不需要预定义模式或表结构。**而我们的服务端要对所有搭建产品做通用性的支持，需要要面对各种未知的数据结构，所以采取此方案是比较合适的选择**；
2.  **可扩展性**：**MongoDB** 是一种分布式数据库，可以轻松地扩展到多个节点，以支持高度并发的应用程序。
3.  **性能**：**MongoDB** 使用内存映射文件来提高读取和写入性能。这使得它在处理大量数据时表现出色，因为它可以利用系统的 **RAM** 来提高查询速度。

> 但这并非是一定正确的选择，具体的技术选型还是要依据团队的实际情况来指定，比如团队运维并没有实际维护 **MongoDB** 的情况下，使用 **MySQL** 也是没问题，如果能在模型结构确定好的情况下来设计表结构就更棒了。

现在回到正文，我们按照之前的模式来创建几张低代码相关的表了，分别是 `Site`、`Page`、`PageConfig`:

```shell
nest g resource site --project low-code-test
nest g resource page --project low-code-test
nest g resource pageConfig --project low-code-test
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b66fb5feac424a448968b3060b1f9e64~tplv-k3u1fbpfcp-watermark.image?)

再将之前测试的 **user** 模块删除（注意是 **low-code-test** 下的 **user** 模块，之前我们做测试使用到的。），然后再次调整一下模块，使得结构更加清晰。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/730a8b28285c477e8ec0c93808a5a60c~tplv-k3u1fbpfcp-watermark.image?)

> 将 **PageConfig** 收拢到 **Page** 模块，此外合并两者的 **Controller**，因为 **Config** 一定会依赖于 Page，这个结构看个人的喜好，我个人喜欢这样去设计。

在上一章中，我们使用了新建 **Provide** 文件来注册用户数据库连接，这次我们可以选择直接在 **module.ts** 中引入的方式：

`site.module.ts`：
``` ts
import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { Site } from './site.entity';

@Module({
  controllers: [SiteController],
  providers: [SiteService,
    {
      provide: 'SITE_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Site),
      inject: ['MONGODB_DATA_SOURCE'],
    },
  ]
})
export class SiteModule { }
```

`page.module.ts`：
```ts
import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PageConfigService } from './page-config/page-config.service';
import { Page } from './page.entity';
import { PageConfig } from './page-config/page-config.entity';

@Module({
  controllers: [PageController],
  providers: [PageService, PageConfigService,
    {
      provide: 'PAGE_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(Page),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    {
      provide: 'PAGE_CONFIG_REPOSITORY',
      useFactory: async (AppDataSource) =>
        await AppDataSource.getRepository(PageConfig),
      inject: ['MONGODB_DATA_SOURCE'],
    },]
})
export class PageModule { }
```

这里有一个细节，如果大家注意到的话，这里的 `site.module.ts` 与 `page.module.ts` 并没有将 `DateBase` 模块引入。

```ts

import { Global, Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers';

@Global()
@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})

export class DatabaseModule { }
```

思路回到当初抽离数据库工具类的时候，我们在 `DatabaseModule` 上添加了 `Global` 装饰器，这意味着我们只需要在 `app.module.ts` 中引入一次即可全局使用而不需要在一个个模块中的单独在进行注册，同理其他所有一切需要频繁在其他子模块中注册的工具类都可以使用 `Global` 装饰器进行全局提升，减少重复工作量。

```ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './utils';
import { SiteModule } from './site/site.module';
import { PageModule } from './page/page.module';
import { DatabaseModule } from '@app/comm/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfig],
    }),
    SiteModule,
    PageModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
```

此时解决完常规的模块引入错误之后，就可以使用 `pnpm start:lowcode` 正常启动项目了：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42f667b2639a45a1b2c0360a85b5787d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17880f71a1e341b8ac5792d98b70b9a7~tplv-k3u1fbpfcp-watermark.image?)

如果启动报错的话，则需要替换 `package.json` 中的启动路径（之前应该是默认路径，可以换成指定运行子服务）：

```diff
- "start:lowcode": "cross-env RUNNING_ENV=dev nest start --watch",
+ "start:lowcode": "cross-env RUNNING_ENV=dev nest start low-code-test --watch",
```

## 基础操作

#### 增

接下来，创建对应的实体类:

`site.mongo.entity.ts`:
```
import {
  Entity,
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  UpdateDateColumn,
  ObjectId
} from 'typeorm';

export enum PAGE_TYPE {
  'pc' = 0,
  'mobile' = 1,
  'weapp' = 2,
}

export enum STATUS_TYPE {
  'activated' = 0, // 未激活
  'inactive' = 1, // 激活
  'deleted' = 2, // 删除
}

export enum API_TYPE {
  'swagger' = 0,
}

@Entity()
export class Site {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  url: string;

  @Column({ default: null })
  currentVersion: string;

  // 设备类型
  @Column()
  type: PAGE_TYPE;

  // site 状态
  @Column({ default: STATUS_TYPE.inactive })
  status: STATUS_TYPE;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;

  @UpdateDateColumn({ default: null })
  appointmentUp: string;

  @UpdateDateColumn({ default: null })
  appointmentDown: string;
}
```

可以看到绝大大部分的数据类型其实都已经兼容了，只有主键的装饰器被 `ObjectIdColumn` 替换，类型也变成了 **MongoDB** 专有的 `ObjectId`。

`src/site/dto/create-site.dto.ts`:
```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { API_TYPE, PAGE_TYPE } from '../site.mongo.entity';

export class CreateSiteDto {
  @ApiProperty({ example: '', description: '站点id' })
  id?: string;

  @ApiProperty({
    example: 'http://localhost:3000/api/doc-json',
    description: '解析URL',
  })
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: API_TYPE.swagger,
    enum: API_TYPE,
    description: '解析接口来源',
  })
  @IsNotEmpty()
  apiType: string;

  @ApiProperty({ example: '搭建服务', description: '站点名称' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '搭建服务描述', description: '站点描述' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: PAGE_TYPE.pc,
    enum: PAGE_TYPE,
    description: '站点类型',
  })
  @IsNotEmpty()
  type: PAGE_TYPE;
}
```

添加新增 `site` 的 `service` 的逻辑：

```ts
import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './site.mongo.entity';

@Injectable()
export class SiteService {
  constructor(
    @Inject('SITE_REPOSITORY')
    private siteRepository: MongoRepository<Site>,
  ) { }

  create(createSiteDto: CreateSiteDto) {
    return this.siteRepository.save(createSiteDto);
  }

  findAll() {
    return `This action returns all site`;
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}
```

> 如果此时，在项目直接运行后就之前去查看数据库的话，会发现与 **MySQL** 不同的是，**MongoDB** 并没有直接初始化表结构，这是两个数据库之前的底层实现有关系，感兴趣的可以去瞅瞅。

完成上述步骤之后，使用 **swagger** 可以直接塞入一条站点数据。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0111a925bcf449409638cc276dd3efd1~tplv-k3u1fbpfcp-watermark.image?)

对比可以看到 **MongoDB** 新增之后的返回值与 **MySQL** 略有不同，主键 `id` 有变化，同时 **MongoDB** 数据库中也对应插入一条数据：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/823696e13d804ef0a510526724555ec9~tplv-k3u1fbpfcp-watermark.image?)

#### 查

修改 `site.controller.ts` 的 `findOne` 方法，修改入参为字符串：

```diff
  @Get(':id')
  findOne(@Param('id') id: string) {
-    return this.siteService.findOne(+id);
+    return this.siteService.findOne(id);
  }
```

修改查询 `site.service.ts`，新增查询单个方法：

```
  findOne(id) {
    return this.siteRepository.findOne(id);
  }
```

注意，请不要使用 `number` 来定义 `id` 类型，否则将出现下述错误，因为 **MonngoDB** 的主键是 **ObjectId** 而并不是单纯的 `number` 类型，只能依靠默认推导来绕过 **TS** 的监测。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73f3a2e34f164821bade54711f0b2694~tplv-k3u1fbpfcp-watermark.image?)

当然如果使用下述方法是最正确的：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12131d2e0c9a448991272d9d0737c1e7~tplv-k3u1fbpfcp-watermark.image?)

```
  findOne(id: string) {
    return this.siteRepository.findOne({
      where: {
        "_id": new ObjectId(id)
      }
    });
  }
```

这里需要注意一点的是，虽然在实体类里面我们使用 `id` 来标识主键，但实际存储在 **MongoDB** 中的主键 key 为 `_id` 而并非是 `id`，所以在后续操作查询相关的数据时要注意转换。

> 总体来说 **MonngoDB** 的大部分方法与 **MySQL** 并无非常大的不同，此外基于 **MongoDB TypeORM** 提供 `MongoEntityManager`和`MongoRepository` 两种工具类，在后期我们在项目中使用到的时候也会逐一讲解。

## 写在最后

本章除了介绍 **MongoDB** 的基础用法之外，也顺带介绍了项目开发规范以及关于 **NestJS** 开发的其他细节，所以看起来内容较散，但是每一步都是必不可少的串联。

在下一章节中，我们将主要以 **Mysql** 作为进阶训练的例子，**MongoDB** 的实际操作用法会掺和在业务中进行讲解。

**服务端实战的每一章请不要跳过，因为是从 0 到 1 讲解每一个细节，需要从上至下看完每一步的细节才不会出现不可预期的额外错误**。

> **本章依然没有 **Demo** 工程也不会放在 **Github** 上，因此这章的的代码不需要加群询问仓库地址，但我会针对每一个细节做一定的介绍与全流程的代码展示，所以如果遇到问题，加群或者留言直接质疑步骤或者模块，我会在文章中补充完整，务必做到基础实战的所有内容不借助于工程就能实现**。

如果你有什么疑问，欢迎在评论区提出或者加群沟通。 👏