同时，上一节最开始安装的环境应该差不多了，那我们就来接着了解一下 Heroku 的打开方式。

> 本节代码见：[Blog API](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2Ftiny-book-blog-api)

## Heroku 初体验

前端社区有非常多的免费云服务，它们的作用各不相同，但基本上能找到所有你需要的。比如 Surge 提供了快捷的静态页面部署，Vercel 提供了与 git 服务集成支持的静态页面部署、页面指标统计以及免费的 Serverless 函数（Vercel Functions），Netlify 类似于 Vercel ，但 Serverless 函数是收费的。此外，一些知名框架也提供了自己的云服务（Gatsby Cloud、Nx Cloud 等）来进一步绑定用户。最重要的是，这些服务基本对个人开发者免费，只有需要进行团队协作或者高级功能时才会收费。

而 Heroku 就是一个提供免费服务的云平台，它主要以提供 API 服务部署为主，支持 Node、Java、Go、Python 等几乎所有主流语言。选择它的主要原因有两方面：一是我认为在类似的平台中它使用起来相对方便；二是它面向个人开发者提供了一定免费额度的数据库（PostgreSQL）。唯一存在遗憾的地方是，它需要科学上网才能正常访问。

好了，基本信息介绍完了，接下来我们正式开始体验吧！

最开始当然是注册环节，访问 [Heroku 主页](https://link.juejin.cn/?target=https%3A%2F%2Fwww.heroku.com%2F)，按照要求填写信息：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3472b1da0ad4e83b172de9459ce8f89~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

在登录时，如果提示需要 Multi-Factor Auth，可以选择先跳过。完成登录后，它会将你重定向到应用管理页面：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d110619004e4206970b09f5ccc58352~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

点击右上角的新建，选择创建一个新应用，应用名需要是独一无二的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bf682717ec8459d80cdd4d6b30dc8ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

创建成功后，我们会来到应用界面，以我们已经创建完毕的页面为例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71d6ff9e4d094f039b8b02ffbfd6e19a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

点击 Deploy，我们需要把应用和 github 仓库关联起来，这样就能在每次提交时自动重新部署了：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a417cbbef4d42d79a8ba9ed7bed5db5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

首先选择 Connect to GitHub，授权完毕后选择你对应的仓库，配置完毕后你会看到这样的界面：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bafba9bd4745406f81ad9816ad252b32~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

点击 Enable Automatic Deploys 后，我们的应用就会随着每次 Git 提交而重新部署。

另外，我们此前的环境配置其实就是安装了 Heroku 的 CLI ，现在我们需要通过 CLI 在终端也登录上：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09019473d3624134ac5b364846e27855~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这里我们不能直接运行 heroku login，因为你现在大概率是通过代理访问的，会出现 IP 地址不匹配的错误，我们需要使用 auth token 进行登录。来到 [全局设置](https://link.juejin.cn/?target=https%3A%2F%2Fdashboard.heroku.com%2Faccount%2Fapplications) 页面，找到授权：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfed83b21e3343fe8b018d00d118102f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

点击创建一个新的 token，复制它，回到终端运行 `heroku login -i`，账号名输入你的邮箱，密码输入 token，确认登录：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c40b8f03ce8412fb6afbeed2238ef09~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

同时我们仍然可以将 Heroku 的仓库添加为一个单独的远程仓库，这么做的原因是我们可以先 push 到 Heroku 的远程仓库来进行构建与部署的测试，等测试验证完毕了再推送到 GitHub，运行：

```bash
heroku git:remote -a <你的应用名>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/218f581028b44df8b3708a5093c64ec1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

接下来我们需要申请一个可用的数据库，数据库、监控、负载均衡、Redis 等功能在 Heroku 上被称为 add-on ，你可以访问 [add-on 市场](https://link.juejin.cn/?target=https%3A%2F%2Felements.heroku.com%2Faddons) 查看更多。在这里我们直奔 [heroku-postgresql](https://link.juejin.cn/?target=https%3A%2F%2Felements.heroku.com%2Faddons%2Fheroku-postgresql)：

[![image380be9c6e463109c.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ccf72af7f4f408580d4c977f48d7fa3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)](https://link.juejin.cn/?target=https%3A%2F%2Fwww.imagehub.cc%2Fimage%2FGfiN6y)

点击安装，将安装到我们的应用中：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b87bc3e13a0450d9c9c0785a97e83dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be4728eb4e8d4501aa0d753c675e715d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

数据库的链接会被以环境变量 `process.env.DATABASE_URL `注入进来，来到应用配置页面，点击显示环境变量：

![imagee38ce6a381dc9b3b.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b32f3cf2e9154e68a3aa71a3f16f6e7f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

有了数据库地址，接下来我们就可以在本地应用里去连接到数据库了。

## 连接到 Heroku 数据库

首先，在你本地的 `.env` 文件中修改 `DATABASE_URL`：

```ini
DATABASE_URL="postgres://..."
```

执行命令：

```bash
prisma db push
```

这一命令会将我们此前定义的 Prisma Schema 推送到数据库，创建对应的数据表。同时这一命令也会再次执行 `prisma generate` 命令来生成 Prisma Client：

![imagedb88d65589f9bb99.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2d399ff45334686980f119b2e9c6f3b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

> 通常来说，数据库也会按照环境分为日常、预发、生产、测试等多个版本，但谁让我们只是在写 demo 呢？

上一节我们已经介绍了如何在 NestJs 中使用 Prisma ，也完成了相关配置，现在我们可以真正连接到数据库试用一下了。

创建 `seed.controller.ts` 文件，在其中添加对 service 的实际调用：

```typescript
import { Controller, Get } from '@nestjs/common';
import { ArticleService } from '../services/article.service';

@Controller('/seed')
export class SeedController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/create')
  async seed() {
    await this.articleService.create({
      title: 'Article 1',
      content: 'Content 1',
    });

    await this.articleService.create({
      title: 'Article 2',
      content: 'Content 2',
    });

    await this.articleService.create({
      title: 'Article 3',
      content: 'Content 3',
    });

    return await this.articleService.query();
  }
}
```

别忘了把 SeedController 添加到 AppModule 中：

```typescript
import { Module } from '@nestjs/common';
import PrismaModule from './data/prisma.module';
import { SeedController } from './controllers/seed.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SeedController],
  providers: [ArticleService, CategoryService, TagService],
})
export class AppModule {}
```

现在访问 [http://localhost:3000/seed/create](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fseed%2Fcreate) ，会发现已经有响应了：

![imagee102f1b42e36a82b.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da58905298d5482984b597c991bf3dda~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 初次部署

万事俱备，我们现在可以把应用部署到 Heroku 上了。但也别太急，我们的应用还需要进行一些额外的配置才能在 Heroku 上正常的工作。

首先是更改应用的端口号，Heroku 在部署这个应用时，会随机分配一个端口号，我们的应用需要使用这个端口号来启动，而这个端口号会通过环境变量的方式提供。

修改 `src/main.ts`：

```typescript
async function bootstrap() {
	// ...
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
}
```

Heroku 在启动这个项目时，默认使用的是 `npm start` 命令，而在我们的项目中这一命令其实是开发环境下的启动，`npm run start:prod` 才是基于构建后代码的启动。因此，我们需要告诉 Heroku 使用这一 script 启动，通常云平台们都支持了项目内的配置文件，如 `vercel.json`、`netlify.toml` ，而 Heroku 的配置文件则要特殊一些，它的名字叫 `Procfile`，注意，没有文件扩展名。

写入内容到 `Procile` 中：

```ini
web: npm run start:prod
```

还有最后一步，由于 Prisma 需要有一步 generate 命令，代码内才能访问到 Prisma Client，而在默认的构建过程中自然是不会有这一步的。因此，我们需要通过 `postinstall` 这个会在安装过程后执行的 npm script ，在其中调用 generate：

```json
{
   "scripts": {
    "postinstall": "npm run prisma:gen"
  },
}
```

你也可以在 `postbuild` 或别的步骤进行，只要确保在启动应用前执行了 prisma generate 即可。

现在才是真正的万事具备，我们可以启动项目了。这一过程我们通常会用到两个命令。

```bash
git push heroku main
```

如果你已经连接到了 GitHub，其实直接推送 GitHub 仓库即可。但这一命令的主要作用是会展示 Heroku 接收到推送以后，拉取代码、安装依赖、构建以及启动过程：

![imagef0c3c4a1ded5150f.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6025bda33b8a4709a9b4dba1b129d064~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![imagea22f61b473e93e2c.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c756e5dd4e134fca9cfd32935f70cd1a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

你会发现，似乎缺少了应用程序启动的日志？这时候就需要使用另一个命令了：

```bash
heroku logs --tail
```

logs 命令用于展示这个应用运行过程中的日志，包括 Heroku 的系统日志与我们的应用程序日志。而 `--tail` 参数意为仅展示最新的一部分日志：

![image752c0cd8664a87c4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f3ea4d8ac65437a9c80090698003514~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这一命令会占据当前的端口，实时展示最新的日志，因此在开发阶段可以通过它来进行调试应用。

至此，我们的应用就已经部署完毕了，接下来基本上就不需要再在 Heroku 上进行什么配置了。最后需要注意的是，如果你的应用一段时间都没有任何流量，Heroku 会暂时停止掉这个服务，并在下一次有流量访问时再启动，这一过程一般耗时不会太久。而如果你在本地访问数据库出现了连接失败，原因也是因为其关联的应用被暂停，资源被暂时回收了。

## API 开发

终于到了 API 开发环节，但这一部分的内容反倒最简短。我们并不会把每一个实体（文章、标签、分类）的方法都实现完，因为如果你已经有过类似的开发经验，那这些内容对你来说意义不大，而如果你此前并无相关开发经验，更需要自己动手来试一试。

这里就以 Article 相关的操作为例，我们会实现全量查找、基于 ID 的查找、创建、更新这四个接口。在这个过程中，你会了解到 NestJs 最基本的使用，即路由处理与请求参数。

首先你需要确保已经完成了 Prisma Client 的生成与数据库同步，我们最终的 Prisma Schema 如下：

```text
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 文章的标签，如 TS / Node / React / SSR 等
model Tag {
  id          String    @id @default(cuid())
  name        String
  description String?
  Article     Article[]
}

// 文章的分类，如 技术 / 感想 / 总结 等
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

  // 文章是否可见
  visible Boolean @default(true)

  tag      Tag[]
  category Category[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}
```

首先是 Service 层，我们在这里会从数据库取回数据然后进行返回，但一般我们不会直接丢个数据回去，而是会附带上状态码等信息一起返回。这里我们实现一个简单的版本：

```typescript
import { MaybeNull } from '../types';

export enum StatusCode {
  RESOLVED = 10000,
  REJECTED = 10001,
}

export class ResponseWrapper<TData = any> {
  constructor(
    public statusCode: StatusCode,
    public data: TData,
    public message?: string,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message =
      message ?? statusCode === StatusCode.RESOLVED ? 'Success' : 'Failed';
  }
}
```

从简起见，我们不想每次使用这个类时都标记状态。因为我们总共就两种状态，所以可以提前准备好成功与失败的响应修饰：

```typescript
export class ResolvedResponse<TData = any> extends ResponseWrapper {
  constructor(public data: TData, public message?: string) {
    super(StatusCode.RESOLVED, data, message);
  }
}

export class RejectedResponse<TData = any> extends ResponseWrapper {
  constructor(public data: TData, public message?: string) {
    super(StatusCode.REJECTED, data, message);
  }
}
```

成功时使用 ResolvedResponse，数据为空或出现异常时使用 RejectedResponse，你也可以进行更进一步的拆分，如让参数校验失败、数据为空、鉴权失败等等都有专用的 RejectedResponse。

从创建开始，我们直接调用注入好的 Prisma Client 即可：

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../data/prisma.service';
import {
  ResolvedResponse,
  RejectedResponse,
  ResponseUnion,
} from '../utils/response-wrapper.provider';
import { Article, ArticleCreateInput, ArticleUpdateInput } from '../types';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createInput: ArticleCreateInput){
    try {
      const res = await this.prisma.article.create({
        data: createInput,
        include: {
          category: true,
          tag: true,
        },
      });

      return new ResolvedResponse(res);
    } catch (error) {
      return new RejectedResponse(null);
    }
  }
}
```

> 这里的 include 配置意为我们希望**在查询时连带返回所有文章的标签与分类信息**。

我们直接使用 Prisma 生成的 ArticleCreateInput 作为类型，但这里你会发现出现了一个类型报错：***如果没有引用 "node_modules/.prisma/client"，则无法命名 "create" 的推断类型。这很可能不可移植。需要类型注释。***

这是因为我们消费的 ArticleCreateInput 类型来自于 Prisma Client，TS 无法直接使用这个类型为 create 方法完成类型推导，同时我们又多了 ResolvedResponse 这一层。

为了解决这一问题，我们声明一个通用的响应类型：

```typescript
export type ResponseUnion<TData> = Promise<
  ResolvedResponse<MaybeNull<TData>> | RejectedResponse<MaybeNull<TData>>
>;
```

然后作为返回值类型使用：

```typescript
@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createInput: ArticleCreateInput): ResponseUnion<Article> {}
}
```

而在更新方法中，我们需要先基于 ID 检查这一条记录是否存在，且仅在存在时才进行更新：

```typescript
@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async update(updateInput: ArticleUpdateInput): ResponseUnion<Article> {
    const { id } = updateInput;
    try {
      const record = await this.prisma.article.findUnique({
        where: { id },
        include: {
          category: true,
          tag: true,
        },
      });

      if (!record) {
        return new RejectedResponse(null);
      }

      const res = await this.prisma.article.update({
        where: { id },
        data: updateInput,
        include: {
          category: true,
          tag: true,
        },
      });

      return new ResolvedResponse(res);
    } catch (error) {
      return new RejectedResponse(null);
    }
  }
}
```

> 如果你希望在更新记录不存在时创建一条记录，可以使用 prisma 的 upsert 方法。

查询接口中，我们希望实现全量查询和基于 ID 查询两个版本：

```typescript
@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async queryRecords(
    includeInvisible: boolean = false,
  ): ResponseUnion<Article[]> {
    try {
      const res = await this.prisma.article.findMany({
        where: includeInvisible
          ? {}
          : {
              visible: true,
            },
        include: {
          category: true,
          tag: true,
        },
      });

      return new ResolvedResponse(res);
    } catch (error) {
      return new RejectedResponse(null);
    }
  }

  async querySingleRecord(id: number): ResponseUnion<Article> {
    try {
      const res = await this.prisma.article.findUnique({
        where: { id },
        include: {
          category: true,
          tag: true,
        },
      });
      return new ResolvedResponse(res);
    } catch (error) {
      return new RejectedResponse(null);
    }
  }
}
```

在全量查询中，我们支持了通过 includeVisible 选项进行过滤，而在单条查询中则不会进行过滤。

完成了 Service 后，Controller 其实就简单多了，我们通常会在这里进行鉴权、校验参数、限流拦截等操作，但现在我们只需要简单地调用 Service 即可。

创建与更新比较类似，我们放在一起看：

```typescript
export type MaybeArray<T> = T | T[];

@Controller('/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('/create')
  async create(
    @Body() createInput: ArticleCreateInput,
  ): ResponseUnion<Article> {
    return await this.articleService.create(createInput);
  }

  @Post('/update')
  async update(
    @Body() updateInput: ArticleUpdateInput,
  ): ResponseUnion<Article> {
    return await this.articleService.update(updateInput);
  }
}
```

使用 `@Post` 声明了此接口需要通过 POST 方法访问，而通过 `@Body` 装饰器我们将请求携带的 Body 数据注入（`req.body`），然后直接传给对应的 Service 即可。

对于查询接口，我们通常使用 GET 方法访问，以及使用 URL 来传参，如 `/user/599` `/user?id=599` 两种常见方式。

```typescript
@Controller('/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  async query(): ResponseUnion<Article[]> {
    return await this.articleService.queryRecords();
  }

  @Get('/:id')
  async queryById(
    @Param('id', ParseIntPipe) id: number,
  ): ResponseUnion<MaybeArray<Article>> {
    return await this.articleService.querySingleRecord(id);
  }
}
```

我们通过 `@Param` 注入 `@Get('/:id')` 中的 id 参数，由于这一解构出来的值会是字符串，而我们的结构定义中 id 为数字，因此需要使用 ParseIntPipe 来将其转化为数字类型。

最后，我们使用 [Apifox](https://link.juejin.cn/?target=https%3A%2F%2Fwww.apifox.cn%2F) 来进行接口的调试，你也可以使用任意习惯的工具：

`POST /article/create`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7314b443ae7b47c3872633790b054945~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`GET /article`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37eb9b4838754c41b4b197a87ceec6eb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`GET /article?id=20`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5a7fc13bdce46f49738b00c7f7f2c8d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`POST /article/update`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31fc1d35f6cd4dd9a524dbf2d90f16ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

完成了 Article 部分的开发仅仅只是开始，毕竟分类和标签也必不可少。但授人以鱼不如授人以渔，有了这一节的基础，再配合 NestJs 与 Prisma 事无巨细的官方文档，你完全可以独立完成剩下的部分。

好了，完成了以上代码后，你可以直接运行 `git push`，Heroku 会自动使用最新的代码进行部署。

除了业务逻辑开发以外，其实你也可以关注更多的功能部分，在 NestJs 中你可以找到校验、中间件、文件上传、日志、定时任务、缓存、限流等等功能，不妨试着把这些功能都加到这个 API 里！

## 总结与预告

通过这两节的学习，我们从 0 开发并部署了一个 Node API 到 Heroku 平台上。如果你此前未接触过 Nest 和 Prisma ，那最大的收获其实是学习了目前功能最全面的 NodeJs 框架 Nest ，以及下一代 ORM 工具 Prisma 的基本使用。同时，我们也学习了如何使用 Heroku 作为云端应用平台，它其实非常适合个人小项目开发，毕竟它提供了包括 CI 集成、数据库、监控、热更新、负载均衡以及域名服务等等基础设施。

小册到这里已经接近了尾声，下一节也就是最后一节，我们会来了解 TypeScript 中的 Compiler API 使用，我们将换一个方式来“用” TypeScript，其他的就不剧透啦。