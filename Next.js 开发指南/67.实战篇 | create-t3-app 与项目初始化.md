## 前言

[create-t3-app](https://github.com/t3-oss/create-t3-app)，一个交互式 CLI，用于创建类型安全的全栈 Next.js 应用。

目前 GitHub 24k Stars，2023 年 React 生态增长 Star 数排名[第 7](https://risingstars.js.org/2023/zh#section-react)（前面有 shadcn/ui、Next.js、Zustand 等，各个库功能不同，论脚手架 t3 排名第一）。

> 之所以叫 t3，起初我以为是 Tailwind CSS + TypeScript + tRPC 的技术栈简写，后来发现是作者 Theo 名字的简写

T3 技术栈包括：Next.js、tRPC、Tailwind CSS、TypeScript、Prisma、Drizzle、NextAuth.js

不过与 [Next-js-Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) 模板不同，create-t3-app CLI 会先让开发者选择使用的技术栈，再生成脚手架代码。

## 1. 项目初始化

那就让我们直接开始使用吧！运行：

```bash
npm create t3-app@latest
```

进入技术栈选择环节：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8398c6e218ec4e6485bfd3ae1376a1fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1338\&h=1830\&s=236961\&e=png\&b=1e1e1e)

关于如何选择：

1.  必选的是：TypeScript + Tailwind CSS + App Router
2.  tRPC 初学者不建议使用，参考[《实战篇 | tRPC 与类型安全》](https://juejin.cn/book/7307859898316881957/section/7386648113714298890#heading-7)中给出的原因
3.  鉴权：看项目是否有需要用 NextAuth
4.  数据库 ORM：Prisma 和 Drizzle 都很不错，Prisma 发展成熟，Drizzle 冉冉新星
5.  数据库：选择熟悉的
6.  alias：看个人习惯，该配置项会写入到 `tsconfig.json`

如上图所示，我们就完成了一个 Next.js + TypeScript + Tailwind CSS + Prisma + MySQL 的项目创建工作。

CLi 会提示我们下一步要做的工作：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86c4c31c681c4ba58711481ea40d44aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330\&h=264\&s=43101\&e=png\&b=1e1e1e)

简单来说，就是进行数据库和 ORM 的设置。

## 2. 数据库设置

### 2.1. 使用 Docker

如果选择了 MySQL 或 PostgreSQL 作为数据库，项目根目录会有一个 `start-database.sh`脚本文件，该文件可以帮助开发者创建一个数据库 Docker 容器用于本地开发。

如果已安装了 Docker，运行 `./start-database.sh`，Docker 会拉取对应的数据库镜像然后开启一个容器用于本地开发。

### 2.2. 使用现有数据库

如果不用 Docker，想要使用现有的数据库，那可以直接删除此文件。

数据库的地址配置在 `.env`文件，正常配置数据库地址即可，比如：

```bash
DATABASE_URL="mysql://root:admin@localhost:3306/next-t3"
```

## 3. Prisma 设置

如果选择了 `Prisma`，t3 会创建一个初始的 `schema.prisma`文件，为了保持 Prisma schema 和数据库一致，需要运行 `npx prisma db push`。

因为这个命令同时为 Prisma Client 生成 TypeScript 类型，所以执行此操作后需要重启 TS Server。`Cmd + Shift + P`，输入 `restart`，选择 `Restart TS Server`。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d89c06343d7c445785ba4e35afe850c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2526\&h=264\&s=79583\&e=png\&b=333333)

> 如果没有看到 Restart TS Server 命令，点进一个 ts 文件，并保证没有分屏，或者分屏里也是 ts 文件，然后再试一次

如果你用的是 Drizzle，也差不多，`.env`文件有具体说明，配置 `.env`文件后，运行 `npm run db:push`

## 正式开始开发

此时项目就算配置完毕了，可以正式开始开发了。

接下来我们结合之前的知识，以 t3-app 为项目脚手架，使用 **Typescript + Tailwind + Prisma + MySQL + Zod + Shadcn UI + React Hook Form + Clerk** 共同开发一个项目，服务端逻辑将使用 **Server Actions** 来实现。

> 注：这也是我个人推荐的一套技术选型

那开发一个什么样的项目呢？

其实绝大部分的应用本质就是增删改查，所以写 TodoList 是最好的熟悉这套技术选型的例子。项目效果如下：

![t32.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/150472b462c74d3aaf8065a460cf4357~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106\&h=1006\&s=1465739\&e=gif\&f=310\&b=fdfdfd)

这是一个简单的清单应用。当用户进入首页，由于路由保护，页面重定向到登录页面。用户登录后，才可以查看自己创建的清单和任务。

用户可以创建多个清单，每个清单又可添加多个任务。清单可以删除，任务可以点击完成。

同时页面支持暗黑模式（其实也支持响应式）。

整体看起来很简单，对吧？

如果对这套技术选型比较熟悉，其实就比较简单，但如果是初次接触这些技术选型，很可能会因为各种细节问题而感到“寸步难行”，但没关系，写一写就习惯了……大家都是这样踩坑过来的……

那就让我们开始吧！


