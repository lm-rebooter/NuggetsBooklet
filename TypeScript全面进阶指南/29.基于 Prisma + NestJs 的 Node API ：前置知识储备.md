在这一节，我们会使用 TypeScript 来开发一个 Node API，并将它部署在服务器上。技术选型方面，我们使用 [NestJs](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.nestjs.com%2F) 作为框架，[Prisma](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2F) 作为 ORM，[Heroku](https://link.juejin.cn/?target=https%3A%2F%2Fdashboard.heroku.com%2Fapps) 作为部署平台与数据库提供商。

需要说明的是，我们要开发的 API 并不会十分完善。一方面，过多的 CRUD 代码并没有教学意义。另一方面，如果要完整开发一个生产可用的 API ，可能还需要再写一本小册才行。

那你可能会问，上面说的工具我都不了解怎么办呀？比较友好的一点是，你不需要对这几个工具非常了解，因为我们会分别介绍相应的前置知识。更加友好的是，你也不需要有自己的服务器与数据库，Heroku 已经帮我们准备好了。

但你仍然需要有基本的 NodeJs 使用经验，至少使用 Express / Koa 进行过基本的 API 开发，以及了解数据库、ORM 的基本知识。

> 本节代码见：[Blog API](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2Ftiny-book-blog-api)

## Heroku 环境配置

在正式开始前，我们不妨提前配置好 Heroku 的环境，因为这一步耗时比较久，我们可以让它在一边安装，先开始下面的学习。

在终端运行以下命令：

```bash
# 适用于 Mac，需要安装 HomeBrew
brew tap heroku/brew && brew install heroku
# 或者使用这个命令
curl https://cli-assets.heroku.com/install.sh | sh
```

> 关于其他安装方式，参考 [Heroku CLI](https://link.juejin.cn/?target=https%3A%2F%2Fdevcenter.heroku.com%2Farticles%2Fheroku-cli) 。

## NestJS 基础

接下来，我们来了解 NestJs 的基础概念。

NestJs 是一个 NodeJs 框架，它和 Express、Koa、Egg 的主要区别其实就两点，**应用风格**与**框架能力**。

我们先来说应用风格。NestJs 中大量地使用了装饰器以及依赖注入（IoC & DI）相关的理念，这一点官方团队自谦是受到了 Angular 的启发。而这也就意味着，在开发规模较大的项目时，Nest 也能够很好地保持项目间各个模块的引用关系清晰解耦，而 Express、Koa 其实随着项目规模的不断扩大，会需要开发者更有意识去进行依赖关系的维护。

而框架能力其实也是许多团队与企业在技术选型时的重要参考因素。在这一点上，就像 Angular 内置了路由、请求、表单、校验、SSR 等能力，是一个真正意义上的“全家桶”。Nest 也是如此，官方团队基本上已经把 95% 以上的能力都提供完毕，包括 ORM 的集成（`@nestjs/mongoose`, `@nestjs/typeorm`）、消息队列（`@nestjs/bull`）、Open API（`@nestjs/swagger`）、鉴权（`@nestjs/passport`）、GraphQL （`@nestjs/graphql`, `@nestjs/apollo` ）等等。在大部分情况下，这些能力以及附带的详细文档就能很好地满足你的需求。

当然，没有事物是十全十美的。我个人认为 Nest 不友好的地方在于，新手可能需要一些时间才能理解其模块作用域与依赖各种关系，imports、provides、providers、exports 等概念确实不是很好理解。

既然说基础了，那我们还是要介绍一下基本使用代码，这段代码我们在装饰器一节中已经很熟悉了：

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

本质上 Nest 也就是一个 Node API 框架，因此完全没必要在初次接触时就做深入了解，等我们用到的时候再学，才不会被劝退。

我们先新建好项目：

```bash
npm i @nest/cli -g
nest new <application>
```

初始的目录结构是这样的：

```text
project
├── src
├──── app.controller.ts
├──── app.module.ts
├──── app.service.ts
├──── main.ts
├── package.json
├── nest-cli.json
└── tsconfig.json
```

我们来简单介绍一下重要文件的功能，更好地了解 NestJs 的开发风格。

- `app.controller.ts`，即 API 路由的定义文件，我们在这里去定义 `GET /user/list` `POST /user/add` 这样的请求处理逻辑。需要注意的是，在 Nest 应用中我们一般不会在 Controller 中去处理业务逻辑，Controller 通常只会处理请求入参的校验、请求响应的包装，具体的业务逻辑来自于 `app.service.ts`。

  ```typescript
  import { Controller, Get } from '@nestjs/common';
  import { AppService } from './app.service';
  
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}
  
    @Get()
    getHello(): string {
      return this.appService.getHello();
    }
  }
  ```

- `app.service.ts`，我们在 Service 层去处理数据库交互、BFF、日志等等的逻辑，然后供 Controller 层来调用。这并不意味着 Controller 中有一个 UpdateUser 处理方法，那么 Service 层中也要有专门的 UpdateUser 方法。更好的方式是将 Service 拆得更细一些，如 UpdateUser 需要依次调用 QueryUser （检查当前用户是否存在）、CheckUserMutationAvaliable （当前用户是否被允许进行信息更新）、UpdateUser （更新用户）、NoticeUserFollowerUpdate （提醒用户的粉丝发生了资料更新）等等数个细粒度的 Service 。这样一来，在未来新增 Controller 时，你只需要重新按照逻辑组装 Service 即可，而不需要再完全重写一个功能大半相似的。

  ```typescript
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export class AppService {
    getHello(): string {
      return 'Hello World!';
    }
  }
  ```

- `app.module.ts`，这一文件是应用的核心文件，我们需要这一模块才能在 `main.ts` 中去启动应用。在实际开发中，可能会有多个 `.module.ts` 文件来实现对业务逻辑的模块拆分，如 `user.module.ts`、`upload.module.ts` 等。同时，在这个文件内我们会定义属于这一模块的 Controller 与 Service ，别的模块可以通过导入这个模块来使用内部的 Service ，而不是直接导入 Service 造成模块间的混乱引用。

  ```typescript
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```

- `main.ts`，最终启动的入口文件，在这里我们定义全局级别的应用配置。

  ```typescript
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import chalk from 'chalk';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }
  bootstrap();
  ```

项目中文件的基本功能就介绍到这里，在扩展阅读部分，我们还会介绍 NestJs 应用中两种不同的目录结构组织方式，如果你感兴趣可以去读一下。接下来，我们来了解本节应用中的另一个重要部分：Prisma ORM。

## Prisma 基础

[Prisma](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2F) 是一个“比较特殊”的 ORM，为什么这么说呢？我们知道，ORM 库（Object-Relational Mapping），其实就是编程语言到 SQL 的映射，也就是说，我们无需学习 SQL 的使用，直接用最熟悉的代码调用方法，即可与数据库进行交互。

而 NodeJs 中的 ORM 目前基本都是通过 js / ts 文件进行定义的，比如 [Sequelize](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsequelize%2Fsequelize)、[TypeORM](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftypeorm%2Ftypeorm) 等，均是通过面向对象的方式进行数据库实体的定义：

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}
```

这就是 Prisma 最特殊的一点，它使用自己的 SDL（Schema Define Language，也可以说是 DSL ，Domain-Specified Language）来声明一个实体：

```text
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  // output   = "./client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Article {
  id          Int     @id @default(autoincrement())
  title       String?
  description String  @default("这篇文章还没有介绍...")
  content     String
}
```

如在上面的例子中，我们在 `schema.prisma` 中使用 Prisma 自己定义的语法来进行描述，可以在 VS Code 中安装扩展来获得语法高亮：

![imaged37616c085b20456.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b56cff57141f44c49b0143a7dee88043~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

而不论是用编程语言还是 SDL 来描述数据库实体，都需要有转换到 SQL 的这一步。在传统 ORM 中这一步实时进行，在你调用 `user.find()` 时动态地进行转换。而在 Prisma 中，这一步则要特殊一些。

我们在实践中熟悉，首先在项目内初始化 prisma：

```bash
npx prisma init
```

它会为你创建 `prisma/schema.prisma`、`.env` 文件，我们还需要安装对应的依赖：

```bash
npm i prisma -g
npm i @prisma/client --save-dev
```

在这里，prisma 是 Prisma CLI，而 `@prisma/client` 则是其运行时所需的依赖。

在 `.env` 文件中定义了我们的数据库地址，Prisma 支持基本上所有的主流数据库。后面我们会使用免费的 Heroku 数据库，现在保持不动即可。

我们先将最终的 Schema 部分填入，然后来解释其中的语法：

```text
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tag {
  id          String    @id @default(cuid())
  name        String
  description String?
  Article     Article[]
}

model Category {
  id          String    @id @default(cuid())
  name        String
  description String?
  Article     Article[]
}

model Article {
  id          Int     @id @default(autoincrement())
  title       String?
  description String  @default("这篇文章还没有介绍...")
  content     String

  visible     Boolean @default(true)

  tag      Tag[]
  category Category[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}
```

首先，`generator client` 这个部分定义了我们的项目类型与一些 Prisma 配置，既然 Prisma 专门搞了新的 SDL 作为实体声明，那它肯定不会只支持 JavaScript。这里我们将 `provider` 配置为 `prisma-client-js`，在后面转换一步时，它就会生成 JS 代码，你才能调用它。`datasource db` 则定义了数据库的类型与地址，这里我们使用 `env()` 函数从环境变量中注入定义。

下面的 model 部分就是数据库的实体定义了，我们定义了 Article、Tag、Category 三个实体，在 Prisma Schema 中内置了一些特殊语法与函数，如 `@id` 将这一列标记为主键，`@default(autoincrement())` 意为使用自增主键作为默认值，`@default(now())` 意为使用创建/修改时的日期作为默认值。

在 Prisma Schema 中我们可以用非常自然的方式声明关联：

```text
model Tag {
  Article     Article[]
}

model Category {
  Article     Article[]
}

model Article {
  tag      Tag[]
  category Category[]
}
```

实际上我们就是声明了 Article-Tag、Article-Category 这两对**多对多**的级联关系。接着，我们来体验下转换，执行以下命令：

```bash
prisma generate
```

![imagea1dd0f09cd0c6303.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fde89e7ee8541abbc8695851de1d471~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这里的 Prisma Client 会被生成到 `node_modules/@prisma/client` 下：

![image013d3fbf7ddad47c.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce733ab100514fb8ac4bce6f17c3601d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

而在实际使用时，我们就需要导入它并实例化：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

接下来，你将体验到 Prisma 最大的特色之一：类型安全。我们尝试访问以下 prisma 的属性：

![image749525dface6a1d2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5158276dadf04997bc8553d2405702af~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

每一个实体上的每一种方法都有全面覆盖的类型提示，而这背后当然是 prisma generate 命令中由 Prisma Schema 所生成的 TS 类型定义。

你可能会问，TypeORM 的 TS 支持也很好，为什么我单单说 Prisma 是类型安全的？这是因为在这些基于编程的语言中，类型实际上是我们自己书写的，ORM 由这些定义映射到数据库的过程中并不能保证是安全的。如在 TypeORM 中，一个字段是否可能为空是通过额外的选项 `@Column({ nullable: true })` 的方式来声明的。

而在 Prisma 中，我们通过 Prisma Schema 来描述数据库实体，相比 JavaScript / TypeScript，它无疑更加自然也更贴近 SQL。同时数据库的表结构与 TS 类型定义的生成均基于 Prisma Schema ，这也就保证了表结构与我们实际类型定义的同步。而如果你担心 Prisma 生成的类型不够严谨，可以翻翻看生成的 Prisma Client 代码。如这个例子中我们只有三个实体，共计 16 个字段，Prisma 生成了将近 5000 行的类型定义。

如果你对 Prisma 产生了兴趣，我此前写过系列文章来详细地介绍 Prisma 的使用，参考 [Prisma：下一代 ORM，不仅仅是 ORM 上篇](https://juejin.cn/post/6973277530996342798)、[下篇](https://juejin.cn/post/6973950142445518884)。

关于 Prisma 的工作流程，你可以参考这张图片：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b92e9f7bc66c4dea82b8b911bba8a96e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

接下来，我们要来了解如何在 Nest 中去集成 Prisma，这一步我们不需要任何的集成包，只有非常自然地导入与调用。

### 在 NestJs 中集成 Prisma

在 NestJs 中集成 Prisma 其实也非常简单，秉持着模块化的理念，我们将 Prisma 相关的逻辑单独放到一个模块中。

新建 `prisma.service.ts`：

```typescript
import {
  Injectable,
  OnApplicationShutdown,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor() {
    super();
  }

  async onApplicationBootstrap() {
    await this.$connect();
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
```

`onApplicationBootstrap` 和 `onApplicationShutdown` 是 NestJs 提供的应用级生命周期，我们继承 PrismaClient，通过 implements 来实现这两个方法，然后分别在启动与停止阶段与数据库连接、断开连接。

在前面我们已经提到，Prisma Client 需要被实例化后才能使用。我们这里的 PrismaService 也是，但是如果某一处代码需要使用它，IoC 容器在交给它这个类时就会进行实例化过程。

然后新建 `prisma.module.ts`：

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class PrismaModule {}
```

通过这种方式，Prisma 相关的所有能力都被归纳在这个模块中，后续你还可以继续添加如 [Prisma Middleware](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Fconcepts%2Fcomponents%2Fprisma-client%2Fmiddleware) 的功能。

接着别忘了将 Prisma Module 也添加到 AppModule 中：

```typescript
import PrismaModule from './data/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
```

这样，其他地方的 Service 就可以使用 Prisma Service 了！

```typescript
import { PrismaService } from '../data/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async query(): Promise<Article[]> {
    const res = await this.prisma.article.findMany();
    return res;
  }
}
```

还记得我们在前面说到，Prisma 的核心优势之一就是它的类型安全，它会基于 Prisma Schema 生成对应的 TypeScript 类型定义，而我们实际上可以直接复用这些类型。

新建 `src/types/index.ts` ，这里会存放项目中的类型定义，在这个项目中我们只需要使用从 Prisma Client 中导出的：

```typescript
import type { Prisma } from '@prisma/client';

export type ArticleCreateInput = Prisma.ArticleCreateInput;
export type ArticleUpdateInput = Prisma.ArticleUpdateInput &
  Prisma.ArticleWhereUniqueInput;

export type { Article, Tag, Category } from '@prisma/client';

// ...类似的
```

直接在代码中使用这些类型：

```typescript
import { PrismaService } from '../data/prisma.service';
import { Article, ArticleCreateInput, ArticleUpdateInput } from '../types';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createInput: ArticleCreateInput): Promise<Article> {
    const res = await this.prisma.article.create({
      data: createInput,
    });

    return res;
  }

  async update(updateInput: ArticleUpdateInput): Promise<Article> {
    const res = await this.prisma.article.update({
      data: updateInput,
      where: {
        id: updateInput.id,
      },
    });

    return res;
  }
}
```

## 总结与预告

这一节我们学习了 NestJs 框架与 Prisma ORM 的基础概念与使用方式，以及在 NestJs 中集成 Prisma 的方法。相比于其它同类型框架，它们都有着决定性的优势，如 NestJs 的全家桶套餐、Prisma 的类型安全与性能。

完成了这些前置地知识储备后，下一节我们就将进入正式的开发与部署阶段了。但我们并不会走完整个开发阶段，我更相信授人以渔的教学方式，因此实际开发时我们只会完成一部分开发，走通整个流程。如果这两个框架让你感到有点意思，你就会自驱地完成整个流程开发的，毕竟兴趣才是我们最好的老师。相比于开发部分，我们对部署部分的介绍要更加详细，因为我们将使用 Heroku 平台提供的部署与数据库服务，这对于大部分同学来说都是首次接触。

## 扩展阅读

### NestJs 应用目录结构的不同组织方式

前面我们介绍了 Controller、Service 等文件的基本功能，除此以外，NestJs 应用中其实存在着两种不同的文件组织风格：按功能与按逻辑进行拆分。

按功能进行拆分，即我们本节的应用使用的方式，这一方式下的目录结构是这样的：

```text
project
├── src
├──── controllers
├──── services
├──── providers
├──── app.module.ts
├──── main.ts
├── package.json
├── nest-cli.json
└── tsconfig.json
```

也就是说，所有的 Controller 文件都在 `/controllers` 文件夹下，所有的 Service 文件都在 `/services` 文件夹下。这一方式适用于项目规模较小的情况，此时无需进行精细的模块化拆分，我们只会有一个 AppModule 。

而按逻辑进行拆分的目录结构可能是这样的：

```text
project
├── src
├──── user
├─────── user.controller.ts
├─────── user.service.ts
├─────── user.module.ts
├──── manager
├─────── manager.controller.ts
├─────── manager.service.ts
├─────── manager.module.ts
├──── app.module.ts
├──── main.ts
├── package.json
├── nest-cli.json
└── tsconfig.json
```

此时我们的 Controller、Service 都会被归类到对应业务逻辑的文件夹下，每个业务逻辑拥有自己的 Module ，然后再在 AppModule 中汇总。

这一方式适合存在一定规模的项目，以及内部业务模块分类较多的情况，此时使用基于逻辑的目录结构划分可以帮助你更好地进行模块拆分，同时获得更直观的模块依赖关系。

### Data Mapper 与 Active Record

即使你此前已经有过 ORM 的实践经验，还有两个概念可能是你未了解过的，即 **Data Mapper** 与 **Active Record** 。TypeORM的简介中提到，***TypeORM supports both Active Record and Data Mapper patterns***，即它同时支持了这两种模式。那么这两种模式对代码有什么影响，它们的差别又是什么？

先来看 Active Record 模式下的 TypeORM 代码：

```typescript
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isActive: boolean;
}

const user = new User();
user.name = "不渡";
user.isActive = true;

await user.save();

const newUsers = await User.find({ isActive: true });
```

TypeORM中，Active Record 模式下需要让实体类继承 `BaseEntity`类，然后实体类上就具有了各种操作方法，如 `save` `remove` `find `方法等。Active Record 模式最早由 Martin Fowle在 ***企业级应用架构模式*** 一书中命名，即直接在对象上支持相关的 CRUD 方法。

而 Data Mapper 下的代码则是这样的：

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isActive: boolean;
}

const userRepository = connection.getRepository(User);

const user = new User();
user.name = "不渡";
user.isActive = true;

await userRepository.save(user);

await userRepository.remove(user);

const newUsers = await userRepository.find({ isActive: true });
```

在 Data Mapper 模式下，实体类不能够自己进行数据库操作，而是需要先获取到一个对应到表的“仓库”，然后再调用这个“仓库”上的方法。

这一模式同样由 Martin Fowler 前辈最初命名，Data Mapper 就像是一层拦在操作者与实际数据之间的访问层，就如上面例子中，需要先获取具有访问权限（即相应方法）的对象，再进行数据的操作。

对这两个模式进行比较，很容易发现 Active Record 模式要更加简单，适用于较简单的应用。可以减少很多代码。而 Data Mapper 模式则更加严谨，适用于开发规模较大的应用，一个例子是在 Nest 的 TypeORM 集成包中，也是注入Repository实例然后再进行操作的，即也属于 Data Mapper 模式。

最后，实际上 Prisma 使用的也是 Data Mapper 模式，我们需要 Prisma Client 来作为访问层。

### ORM 与 QueryBuilder

ORM 并不是唯一一种让我们可以不用写 SQL 就能操作数据库的方式，同时它也不是最贴近 SQL 的方式。

Query Builder 就是这另外一种使用方式，它和 ORM 一样，通过编程语言书写，但不同的是它并不包括实体类映射到数据库表的部分，而只是负责 Query 。

以 TypeORM 的 Query Builder 模式为例：

```typescript
import { getConnection } from "typeorm";

const user = await getConnection()
  .createQueryBuilder()
  .select("user")
  .from(User, "user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

这么一连串的链式调用，其实就等价于 `userRepo.find({ id: 1 })` 的作用，看起来更麻烦了，但你是否感觉到了灵活性的成倍增长？在 Query Builder 中，，每一次链式调用都会对最终生成的 SQL 产生一些调整，因此我们可以通过非常细粒度的调整来更加的贴近原生 SQL 。

除了 TypeORM 以外，Node 中使用较多的 Query Builder 还包括 [knex](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fknex%2Fknex)、[kysely](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fkoskimas%2Fkysely) 等。

关于 Prisma、Query Builder 与 ORM 的比较，可以参考下面这张图片：

![comparison](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/456cfd8784284b5b91c0d19b90f1103b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)