## 前言

### 1. ORM

我们先从 ORM（Object Relational Mapping） 开始说起，中文译为“**对象关系映射**”。简单的来说，就是用操作对象的方式操作数据库。

比如我们用 SQL 查询数据：

```javascript
SELECT * FROM users WHERE name = 'yayu';
```

如果使用 ORM 库（ORM 是一种技术，有很多实现 ORM 的库，Prisma 是其中一个），查询语句可以改为：

```javascript
var orm = require('orm-library');
var user = orm("users").where({ name: 'yayu' });
```

这里我们虚构了一个 `orm-library`库，语言用的是 JavaScript。所以 ORM 的好处就在于你可以用自己喜欢的语言来操作数据库，只要有对应的 ORM 库支持。

除此之外，ORM 对数据库进行了抽象，你可以以很低的成本更换数据库比如从 PostgreSQL 切换为 MySQL。通常 ORM 库还会支持一些高级的功能，方便开发者使用。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5509d68433344089315e112f94ea333~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300\&h=616\&s=54627\&e=png\&a=1\&b=a0afc1)

### 2. 技术选型

在 Node.js 下，常用的 ORM 库有 [Prisma](https://www.prisma.io/docs/orm)、[Sequelize](https://sequelize.org/docs/v6/)、[TypeORM](https://typeorm.io/)、[Drizzle](https://orm.drizzle.team/)。[Mongoose](https://mongoosejs.com/) 也是一种 ORM，但它是基于 Node.js 和 MongoDB 的 ORM 库，而像前面提到的这些 ORM 库都是支持多种数据库的。

让我们看看它们的 [npm trends](https://npmtrends.com/drizzle-orm-vs-mongoose-vs-prisma-vs-sequelize-vs-typeorm)：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48daaffba91245369e3788064a0ca1bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2644\&h=1864\&s=483553\&e=png\&b=fefefe)

其中 Sequelize 是老牌的 ORM 库，但是对 TypeScript 支持不佳，后来有了 TypeORM，对 TypeScript 支持更好，但是 TypeORM 更新维护比较慢，后被对 TypeScript 支持更佳、开发体验更好的 Prisma 超越。

Mongoose 也是老牌的 ORM 库，专注于 MongoDB 数据库。Drizzle 是这一两年才发布的小鲜肉，正在茁壮成长，目前版本还在 0.x.x。

此外，多数 ORM 库只支持关系型数据库。所以如果你用 MongoDB 这种非关系型数据库，那在这里面能选的也就只有 Prisma 和 Mongoose 了。

有一个[关于 ORM 库的调查](https://stateofdb.com/orms)：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf4255494a794bcaa56b3adc483a3bc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540\&h=1870\&s=247853\&e=png\&b=fcfcfc)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3f5417fb79f463daee774b9d4675664~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1570\&h=1808\&s=352400\&e=png\&b=faf5f4)

此项调查包含了多个语言的 ORM，比如 Django 是 Python 的，Eloquent 是 PHP 的。所以在 Node.js 中，目前使用度和满意度最高的就是 Prisma、Drizzle、Mongoose 了。

在实际的项目开发中，理论上应该选择使用度更高、版本相对稳定的库。简而言之，初学者推荐用 Prisma。如果你用 MongoDB，可以选择 Mongoose。

数据库我们继续选择 MySQL，常用的数据库也就是 Postgres、MongoDB、MySQL、Redis 了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5cf8651c19a459ca174bdbf5a258bdf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1544\&h=1318\&s=197405\&e=png\&b=fbfbfb)

## MySQL

MySQL 的安装我们已经在上篇[《实战篇 | React Notes | Strapi》](https://juejin.cn/book/7307859898316881957/section/7321635703136206874#heading-4)中讲过，就不重复赘述了。

MySQL GUI 工具可以使用 Navicat，方便查看和操作数据：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f188a67ac7c42028f51f43713d6889b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2480\&h=1760\&s=786549\&e=png\&b=ebeded)

当然就本篇的内容而言，不使用 GUI 工具也没有任何关系。

## Prisma 介绍

现在让我们正式的介绍下 Prisma 吧。按照官方的介绍，它是下一代的 Node.js 和 TypeScript ORM：

> Next-generation Node.js and TypeScript ORM

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3d0f42939e446379f421cd2060bf816~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2056\&h=580\&s=251981\&e=png\&b=ffffff)

它的优势在于：

> Prisma unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion.

简单的来说，就是开发体验更好：直观的数据模型、自动化迁移、类型安全、自动补全。

比如你可以在 `schema.prisma`这个文件（Prisma 自定义的一种文件格式）中定义数据模型，就像这样：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52ff3d18e19e411792c3b999a58d1fa1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1620\&h=796\&s=483085\&e=png\&b=26292f)

其中`model Post` 映射了数据库中的 Post 表，id、title、content、published 映射了表中的字段，字段后面的 Int、String 等表示字段类型，再后面的 @id、@default，这些是属性，我们稍后再讲。

当你需要操作数据库时，Prisma 提供了 Prisma Client：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6827d49c0736496486bbefdd558b63cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1592\&h=788\&s=537495\&e=png\&b=26292f)

Prisma 同时提供了 Prisma Migrate，这是 Prisma 的迁移系统。比如当你在 `schema.prisma`更改了数据模型，命令行运行 `npx prisma migrate dev`，prisma 就会根据你定义的数据模型，修改数据库。

Prisma 还提供了 Prisma Studio，这是 Prisma 提供的查看和编辑数据库数据的 GUI 工具。不同于 Navicat 这样的软件，Prisma Studio 的开启方式是在命令行运行 `npx prisma studio`，它会打开一个网页，展示数据库中的数据：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c4591f1fb4f41ff976498d04eff1641~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2008\&h=696\&s=437919\&e=png\&b=fef9f8)
Prisma 目前支持的语言和数据库有：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2533ccdb81c47e5a8ba6f212191e42a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2542\&h=384\&s=70800\&e=png\&b=ffffff)

好了，Prisma 的大致介绍就这些。**Prisma Client**、**Prisma Migrate**、**Prisma Studio** 就是 Prisma 的主要组成部分了。接下来让我们在实战中具体体会吧！

## Prisma 使用

### 1. 创建文件

项目根目录安装 `prisma`作为开发依赖：

```javascript
npm install prisma --save-dev
```

安装后运行：

```javascript
npx prisma init
```

这一步会：

1.  创建一个 `prisma`文件夹，其中包含一个 `schema.prisma`文件，这就是定义数据模型的地方
2.  创建一个`.env`文件，用于定义环境变量（如数据库地址）

### 2. 连接 MySQL 数据库

修改 `prisma/schema.prisma`：

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

修改 `.env` 中的 `DATABASE_URL`，此 URL 规则如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0adc8da75fcc4bbfbbb87ce941f05840~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300\&h=208\&s=68342\&e=png\&a=1\&b=fee8c8)

按照此规则，我们的地址应该修改为：

```bash
DATABASE_URL="mysql://root:admin@localhost:3306/notes"
```

其中 `notes` 为我们的数据库名称。目前这个数据库我们在 MySQL 中还没有建立，所以我们来建一个。

一种方法是使用 MySQL GUI 工具，右键直接建立一个名为 `notes` 的数据库。

一种方法是使用命令行：

```javascript
# 访问数据库
mysql -u root -p
# 创建数据库
CREATE DATABASE notes;
```

![1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/384a10db8ad548cda44f8071918de948~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1408\&h=738\&s=129347\&e=png\&b=1f1f1f)

执行 `npx prisma db pull`，如果出现以下提示即表示连接成功：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea302d794a5048ea9eb408cf5762d79f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1874\&h=656\&s=151411\&e=png\&b=1e1e1e)

注：虽然是报错信息，显示数据库为空，但说明至少连接上了数据库。如果数据库不存在，就是另外一个报错了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f076886ec2ba4ea3b48d50dc6e6655e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1866\&h=672\&s=147633\&e=png\&b=1e1e1e)

### 3. 定义数据模型

现在我们来定义数据模型，数据模型需要与数据库保持一致。我们有两种方式使其保持一致：

1.  手动修改数据模型，然后运行 `npx prisma migrate dev`修改数据库，使其保持一致
2.  手动修改数据库，然后运行 `npx prisma db pull`修改数据模型，使其保持一致

现在我们修改下 `prisma/schema.prisma`：

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(uuid())
  username String
  password String
  notes    Note[]
}

model Note {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

```

运行 `npx prisma migrate dev`，然后给这次 migrate 起一个名字（这个名字无所谓，一个标识而已）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6700867aa0f4ee9a62e109a1b763ada~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1532\&h=620\&s=117541\&e=png\&b=1e1e1e)

再次查看数据库，User 表、Note 表和其中的字段都已建立：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c37065a8ede4d21918a6a2239be0e49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2208\&h=1242\&s=372326\&e=png\&b=232323)

这个 Prisma schema 同步数据库的过程，就被称之为 **migration**。每次迁移，都会生成一个迁移文件，存放在 `prisma/migrations`下。

现在我们直接修改数据库，比如在 Note 表添加一个 `content` 字段：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2705bed438b484b959bc4ecf98e8762~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2208\&h=1242\&s=400391\&e=png\&b=282a2c)

然后运行 `npx prisma db pull`，Prisma 会自动在 `prisma/schema.prisma` 中同步该字段：

```javascript
model Note {
	// ...
  content   String?  @db.VarChar(255)
	// ...
}
```

这个从数据库推导出 Prisma schema 的过程就叫做 **Introspection**，中文译为“内省”，指通过检查数据库的结构和元数据来了解数据库本身的特性和信息。

> Introspection is the process of getting the metadata of the database, such as object names, types of columns, and source code

不过注意使用 `npx prisma db pull`的时候，还要再搭配使用 `prisma generate`更新 Prisma Client 后，你才能正确的通过 Prisma Client 操作数据库：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66d1f1bf27164639935a13ee77c9bba5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300\&h=579\&s=143193\&e=png\&a=1\&b=e0f6f9)

### 4. 语法高亮与自动格式化

多说一句：schema.prisma 因为是 Prisma 自定义的文件格式，所以文件默认无语法高亮，使用 VSCode 的同学可以下载 Prisma 这个插件以支持该文件语法高亮：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07708e260b2f4aed83198f04149dc5e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2076\&h=420\&s=104237\&e=png\&b=1e1e1e)

安装该插件后，还可以打开 `settings.json`，添加 prisma 文件的自动格式化：

![截屏2024-01-18 下午8.08.04.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7e1519a747845bb95e475196e2059f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1622\&h=912\&s=180151\&e=png\&b=1f1f1f)

效果如下：

![ReactNotes-prisma2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2797be54e4a64636bbfef9b0eac06250~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=666\&h=518\&s=47338\&e=gif\&f=8\&b=1f1f1f)

当然如果你不设置，也可以在根目录运行 `npx prisma format`格式化该文件。

### 5. Prisma Client

安装 `@prisma/client`：

```bash
npm install @prisma/client
```

现在让我们回到我们的项目需求上，因为目前并没有做权限控制，所以创建的笔记谁都可以查看、创建或编辑。如果我们希望用户登录后才能查看、新增、编辑自己的笔记呢？效果图如下：

![ReactNotes-prisma3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/217973beae98461994ea896abca2b1bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050\&h=672\&s=382538\&e=gif\&f=110\&b=f8fafb)

让我们开始实现吧！

`schema.prisma`的代码为：

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(uuid())
  username String
  password String
  notes    Note[]
}

model Note {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

```

注意：如果修改了 schema，运行 `npx prisma migrate dev`，将修改同步数据库，migrate 会自动更新 Prisma Client，所以无须再运行 `prisma generate`。

因为要实现鉴权，所以要结合 `next-auth`，修改 `auth.js`：

```javascript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { addUser, getUser } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers:[CredentialsProvider({
    // 显示按钮文案 (e.g. "Sign in with...")
    name: "密码登录",
    // `credentials` 用于渲染登录页面表单
    credentials: {
      username: { label: "账号", type: "text", placeholder: "输入您的账号" },
      password: { label: "密码", type: "password", placeholder: "输入您的密码" }
    },
    // 处理从用户收到的认证信息
    async authorize(credentials, req) {
      // 默认情况下不对用户输入进行验证，确保使用 Zod 这样的库进行验证
      let user = null

      // 登陆信息验证
      user = await getUser(credentials.username, credentials.password)

      // 密码错误
      if (user === 1) return null

      // 用户注册
      if (user === 0) {
        user = await addUser(credentials.username, credentials.password)
      }

      if (!user) {
        throw new Error("User was not found and could not be created.")
      }

      return user
    }
  }), GitHub],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname.startsWith("/note/edit")) return !!auth
      return true
    },
    async jwt({ token, user, account }) {
      if (account && account.type === "credentials" && user) {
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.userId = token.userId;
      return session;
    }
  }
})
```

新建 `middleware.js`，代码如下：

```javascript
export { auth as middleware } from "auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

使用 `middleware.js` 是为了实现新建和编辑时跳转到登录页面。

新建 `lib/prisma.js`，代码如下：

```javascript
import { PrismaClient } from '@prisma/client'
import { auth } from "auth"

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getAllNotes() {
  const session = await auth()
  if (session == null) return [];
  // 查找登录用户的笔记
  const notes = await prisma.note.findMany({
    where: {
      authorId: session?.user?.userId
    }
  })
  // 构造返回数据
  const res = {};
  notes.forEach(({title, content, id, updatedAt}) => {
    res[id] = JSON.stringify({
      title,
      content,
      updateTime: updatedAt
    })
  })
  return res
}

export async function addNote(data) {
  const session = await auth()
  const result = await prisma.note.create({
    data: {
      title: JSON.parse(data).title,
      content: JSON.parse(data).content,
      author: { connect: { id: session?.user?.userId } },
    }
  })

  return result.id
}

export async function updateNote(uuid, data) {
  const parsedData = JSON.parse(data);
  await prisma.note.update({
    where: {
      id: uuid
    },
    data: {
      title: parsedData.title,
      content: parsedData.content
    }
  })
}

export async function getNote(uuid) {
  const session = await auth()
  if (session == null) return;
  const {title, content, updateTime, id} = await prisma.note.findFirst({
    where: {
      id: uuid
    }
  })

  return {
    title,
    content,
    updateTime,
    id
  }
}

export async function delNote(uuid) {
  await prisma.note.delete({
    where: {
      id: uuid
    }
  })
}

export async function addUser(username, password) {
  const user = await prisma.user.create({
    data: {
      username,
      password,
      notes: {
        create: []
      }
    }
  })

  return {
    name: username,
    username,
    userId: user.id
  }
}

export async function getUser(username, password) {
  const user = await prisma.user.findFirst({
    where: {
      username
    },
    include: {
      notes: true
    }
  })
  if (!user) return 0;
  if (user.password !== password) return 1
  return {
    name: username,
    username,
    userId: user.id
  } 
}

export default prisma
```

在这段代码中，我们使用了 `const prisma = globalForPrisma.prisma || new PrismaClient()`这种方式，这是为了避免开发环境下建立多个 Prisma Client 实例导致问题，详细参考[此篇说明](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)。

在这段代码中，我们演示了如何增删改查数据库。注意我们获取 Note 表的时候，要使用小写的 `prisma.note` 获取。Prisma Client 具体 API 的用法可以参考 [Prisma Client API reference](https://www.prisma.io/docs/orm/reference/prisma-client-reference)，当然下节我会带大家过一遍 API。

然后我们将上篇的 `@/lib/strapi`或者之前的 `@/lib/redis` 统一替换为 `@/lib/prisma`。此时效果已经实现：

![ReactNotes-prisma3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d695b173cf948c8b85225227706bdad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050\&h=672\&s=382538\&e=gif\&f=110\&b=f8fafb)

### 6. Prisma Studio

在根目录运行 `npx prisma studio`，它会打开一个网页：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c64a4fdf1264eae91ed12c7f6e42ce3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2502\&h=528\&s=109475\&e=png\&b=ffffff)

你可以在这个页面查看和编辑数据库中的数据。

## Prisma 深入了解

Prisma 的基本使用就这些内容，Prisma 的官方文档写得很好，再深入的部分其实看文档即可，所以我们这里讲讲作为初学者，接下来要学习的一些内容。

### 1. Prisma schema

首先是数据模型的书写，举个例子：

```javascript
model Post {
  id  Int @id @default(autoincrement())
}
```

模型的每个字段，包含：

1.  [字段名称](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#model-fields)
2.  [字段类型](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#model-fields)
3.  （可选）[类型修饰符](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#type-modifiers)（type modifiers）
4.  （可选）[属性](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-attributes)（attributes）

#### 1.1. 字段类型

其中，字段类型有 `String`、`Boolean`、`Int`、`BigInt`、`Float`、`Decimal`（存储精确小数值）、`DateTime`、`Json`、`Bytes`（存储文件）、`Unsupported`。字段类型还可以是数据库底层数据类型，通过 `@db.` 描述，比如 `@db.VarChar(255)`, varchar 正是 MySQL 支持的底层数据类型。

#### 1.2. 类型修饰符

类型修饰符有两个：

1.  `[]` 表示字段是数组
2.  `?` 表示字段可选

```javascript
model User {
  name String?
  favoriteColors String[]
}
```

目前 Prisma 不支持可选数组，也就是这两个类型修饰符不能同时用。如果你有需要，那就创建数据的时候创建一个空数组。

#### 1.3. 属性

再后面的 `@id @default(autoincrement())` 这些就都是属性了。属性的作用是修改字段或块（model）的行为，影响字段的属性用 `@` 作为前缀，影响块的属性用 `@@`作为前缀，举个例子：

```javascript
model User {
  id        Int    @id @default(autoincrement())
  firstName String @map("first_name")
  @@map("users")
}
```

在这个例子中，`map`的作用是映射：

*   `@map("first_name")` 表示`firstName` 字段映射数据库中的 `first_name` 字段
*   `@@map("users")`表示 `User` 映射数据库的中的 `users` 表

具体影响字段的属性有：

1.  [@id](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#id)（设置主键 `PRIMARY KEY`）
2.  [@default](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#default)（设置字段默认值）
3.  [@unique](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#unique)（唯一约束，表示该字段值唯一，设置后可以用 `findUnique` 来查找）
4.  [@relation](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#relation)（设置外键 `FOREIGN KEY`/ `REFERENCES`，用于建立表与表之间的关联，很重要的概念，下节会具体讲）
5.  [@map](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#map)（映射数据库中的字段）
6.  [@updatedAt](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#updatedat)（自动存储记录更新的时间）
7.  [@ignore](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#ignore)（该字段会被忽略，不会生成到 Prisma Client 中）

影响块的属性有：

1.  [@@id](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#id-1)：相当于关系型数据库中复合主键

```javascript
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
}
```

firstName 和 lastName 共同组成主键，允许 firstName 或 lastName 单独重复，但不能一起重复。

当创建的时候，字段需要都创建：

```javascript
const user = await prisma.user.create({
  data: {
    firstName: 'Alice',
    lastName: 'Smith',
  },
})
```

查询的时候，使用生成的复合 id （firstName\_lastName）进行查询：

```javascript
const user = await prisma.user.findUnique({
  where: {
    firstName_lastName: {
      firstName: 'Alice',
      lastName: 'Smith',
    },
  },
})
```

2.  [@@unique](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#unique-1)：复合唯一约束

定义：

```javascript
model User {
  id        Int     @default(autoincrement())
  firstName String
  lastName  String
  isAdmin   Boolean @default(false)

  @@unique([firstName, lastName])
}
```

查询：

```javascript
const user = await prisma.user.findUnique({
  where: {
    firstName_lastName: {
      firstName: 'Alice',
      lastName: 'Smith'
    },
  },
})
```

3.  [@@index](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#index)：创建数据库索引

可以创建多列索引：

```javascript
model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?

  @@index([title, content])
}
```

4.  [@@map](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#map-1)：映射数据库表名
5.  [@@ignore](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#ignore-1)：忽略此模型
6.  [@@schema](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#schema)：在支持 multiSchema 的时候使用，比如搭配 supabase，为 model 添加授权相关的字段`@@schema("auth")`

#### 1.4. 属性函数

让我们再看下这个例子：

```javascript
model User {
  id        Int    @id @default(autoincrement())
}
```

`@default` 中的 `autoincrement()` 被称为属性函数。属性函数有：

1.  [auto()](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#auto)：由数据库自动生成，只用于 Mongodb 数据库（因为 Mongodb 的 \_id 是自动生成的）：

```javascript
model User {
  id   String  @id @default(auto()) @map("_id") @db.ObjectId
}
```

2.  [autoincrement()](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#autoincrement)：自动增长，只用于关系型数据库：

```javascript
model User {
  id   Int    @id @default(autoincrement())
  name String
}
```

3.  [cuid()](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#cuid)：基于 [cuid ](https://github.com/paralleldrive/cuid)规范生成唯一标识符，适用于浏览器环境中（示例：tz4a98xxat96iws9zmbrgj3a）
4.  [uuid()](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#uuid)：基于 [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier) 规范生成唯一标识符（示例：9c5b94b1-35ad-49bb-b118-8e8fc24abf80）
5.  [now()](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#now)：创建记录的时间戳
6.  [dbgenerated()](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#dbgenerated)：无法在 Prisma schema 中表示的默认值（如 random()）

除此之外，还有一个 [enum](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#enum) 类型，很好理解，使用示例如下：

```javascript
enum Role {
  USER
  ADMIN
}

model User {
  id   Int  @id @default(autoincrement())
  role Role @default(USER)
}
```

### 2. Relations

关系（relation）是指 Prisma schema 中的两个 model 建立连接。建立连接的方式是通过主键（PRIMARY KEY，简写 PK）和外键（FOREIGN KEY，简写 FK）。

所谓主键，指的是数据库表中对储存数据对象予以唯一和完整标识的数据列或属性的键，换句话说，主键是关系表中记录的唯一标识，也就是我们添加 `@id`属性的字段。

所谓外键，指的是指向其他表的主键的键，用于建立两张表的关联性。Prisma 用 `@relation`属性来建立关系。

#### 2.1. 建立关联

以我们的项目为例，一张 User 表、一张 Note 表。因为一个作者可以写多篇笔记，所以 User 和 Note 的关系为一对多：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c41c69f6a426433bb0c40df39b068b63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042\&h=434\&s=66071\&e=png\&a=1\&b=ffffff)
如果我们要建立两个表之间的关系，写法如下：

    model User {
      id       String @id @default(uuid())
      notes    Note[]
    }

    model Note {
      id        String   @id @default(cuid())
      author    User     @relation(fields: [authorId], references: [id])
      authorId  String
    }

Note 的 author 字段指向 User，其中 `@relation(fields: [authorId], references: [id])`表示 Note 的 authorId 字段与 User 的 id 字段建立关系，**也就是这两个字段的值应该是一致的**。

像我们的项目的 schema 为：

```javascript
model User {
  id       String @id @default(uuid())
  username String
  password String
  notes    Note[]
}

model Note {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(255)
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

#### 2.2. 创建记录

当你通过 `@relation` 建立了 User 表和 Note 表的关联后，你可以更便捷的进行一些操作，比如创建嵌套的记录：

```javascript
  const user = await prisma.user.create({
    data: {
      username,
      password,
      notes: {
        create: [
          {title: '1', content: '1'},
          {title: '2', content: '2'}
        ]
      }
    }
  })
```

此时 Note 表中也会有两条记录，并且两条记录的 authorId 会自动设置为刚创建的 user 记录的 id。

#### 2.3. 查询记录

当你查询 User 表的信息，可以返回 Note 表中的信息。当你通过以下代码查询时：

```javascript
const user = await prisma.user.findFirst({
  where: {
    username: '1'
  },
  include: {
    notes: true
  }
})
console.log(user)
```

打印的信息为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9c8febd4a2340e89dfb4aceb754d867~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032\&h=788\&s=123620\&e=png\&b=1e1e1e)

#### 2.4. connect

不过使用关系的时候，要注意及时关联。比如当你创建了一条 note 时，要关联到对应的 user 中，为此你需要使用 [connect](https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect) 嵌套查询语法：

```javascript
  const result = await prisma.note.create({
    data: {
      title: '1',
      content: '2',
      author: { 
        connect: { 
          id: '1895c437'
      	} 
      },
    }
  })
```

Prisma 会自动设置该 note 的 authorId 为 `'1895c437'`，并且关联到 id 为 `'1895c437'` 的 user 上，这样当你通过 prisma.user 查询的时候，也会出现该 note 信息。

也可以从 prisma.user 更新关联：

```javascript
const updateAuthor = await prisma.user.update({
  where: {
    id: '1895c437',
  },
  data: {
    notes: {
      connect: {
        id: 'clrkpshqd0004aa0occr5a2qq',
      },
    },
  },
})
```

Prisma 会查询 id 为 `'1895c437'` 的用户，然后将 id 为 `clrkpshqd0004aa0occr5a2qq` 的 note 的 authorId 改为 `'1895c437'`，并建立两者的关联。

除了像这样一对多的关系，还有[一对一](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-one-relations)，[多对多](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations)的关系，详细请查阅文档。

### 3. Prisma Client

学习 Prisma Client，也就是学习具体如何操作数据库。完整的 API 参考 [Prisma Client API reference](https://www.prisma.io/docs/orm/reference/prisma-client-reference)。

#### 3.1. 查询函数

查询函数有：

1.  增：`create()`、`createMany()`
2.  删：`delete()`、`deleteMany()`
3.  改：`update()`、`upsert()`（找不到就创建）、`updateMany()`
4.  查：`findUnique()`(需要有 @unique 属性)、`findUniqueOrThrow()`（找不到就报错）、`findFirst()`（找第一个）、`findFirstOrThrow()`（找不到就报错）、`findMany()`
5.  其他：`count()`、`aggregate()`（聚合）、`groupBy()`

#### 3.2. 查询参数

其查询参数除了 `where` 用于条件查找之外，还有：

1.  `include` 用于定义返回的结果中包含的关系
2.  `select` 用于选择返回的字段
3.  `orderBy` 用于排序
4.  `distinct` 用于去重

```javascript
const usersWithPosts = await prisma.user.findMany({
  orderBy: {
    email: 'asc',
  },
  include: {
    posts: {
      select: {
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    },
  },
})
```

在这个例子中：

1.  返回所有的 User 记录，记录按 email 升序排列
2.  对于每条记录，返回嵌套的 posts 信息，按 title 升序排列后，只返回 title 字段

简单的来说，就是返回所有用户的基本信息和文章标题数据。一个示例结果如下：

```json
[
  {
    "id": 2,
    "email": "alice@prisma.io",
    "name": "Alice",
    "posts": [
      {
        "title": "Watch the talks from Prisma Day 2019"
      }
    ]
  },
  {
    "id": 3,
    "email": "ariadne@prisma.io",
    "name": "Ariadne",
    "posts": [
      {
        "title": "How to connect to a SQLite database"
      },
      {
        "title": "My first day at Prisma"
      }
    ]
  },
  {
    "id": 1,
    "email": "bob@prisma.io",
    "name": "Bob",
    "posts": [
      {
        "title": "Follow Prisma on Twitter"
      },
      {
        "title": "Subscribe to GraphQL Weekly for community news "
      }
    ]
  }
]
```

#### 3.3. 嵌套查询

在嵌套查询里，有：[create](https://www.prisma.io/docs/orm/reference/prisma-client-reference#create-1)、[createMany](https://www.prisma.io/docs/orm/reference/prisma-client-reference#createmany-1)、[set](set)、[connect](https://www.prisma.io/docs/orm/reference/prisma-client-reference#connect)、[connectOrCreate](https://www.prisma.io/docs/orm/reference/prisma-client-reference#connectorcreate)、[disconnect](https://www.prisma.io/docs/orm/reference/prisma-client-reference#disconnect)、[update](https://www.prisma.io/docs/orm/reference/prisma-client-reference#update-1)、[upsert](https://www.prisma.io/docs/orm/reference/prisma-client-reference#upsert-1)、[delete](https://www.prisma.io/docs/orm/reference/prisma-client-reference#delete-1)、[updateMany](updateMany)、[deleteMany](https://www.prisma.io/docs/orm/reference/prisma-client-reference#deletemany-1)，也就是如何处理关系表中的数据，示例代码如下：

```javascript
  const user = await prisma.user.create({
    data: {
      username,
      password,
      notes: {
        create: [
          {title: '1', content: '1'},
          {title: '2', content: '2'}
        ]
      }
    }
  })
```

在这段代码中，创建一条 user 记录的同时，也创建了两条 note 记录并进行了关联。其他方法的作用也是类似。

#### 3.4. 筛选条件

筛选条件支持 [equals](https://www.prisma.io/docs/orm/reference/prisma-client-reference#equals)、[not](https://www.prisma.io/docs/orm/reference/prisma-client-reference#not)、[in](https://www.prisma.io/docs/orm/reference/prisma-client-reference#in)、[notIn](https://www.prisma.io/docs/orm/reference/prisma-client-reference#notin)、[lt](https://www.prisma.io/docs/orm/reference/prisma-client-reference#lt)、[lte](https://www.prisma.io/docs/orm/reference/prisma-client-reference#lte)、[gt](https://www.prisma.io/docs/orm/reference/prisma-client-reference#gt)、[gte](https://www.prisma.io/docs/orm/reference/prisma-client-reference#gte)、[contains](https://www.prisma.io/docs/orm/reference/prisma-client-reference#contains)、[search](https://www.prisma.io/docs/orm/reference/prisma-client-reference#search)、[mode](https://www.prisma.io/docs/orm/reference/prisma-client-reference#mode)、[startsWith](https://www.prisma.io/docs/orm/reference/prisma-client-reference#startswith)、[endsWith](https://www.prisma.io/docs/orm/reference/prisma-client-reference#endswith)、[AND](https://www.prisma.io/docs/orm/reference/prisma-client-reference#and)、[OR](https://www.prisma.io/docs/orm/reference/prisma-client-reference#or)、[NOT](https://www.prisma.io/docs/orm/reference/prisma-client-reference#not-1)。举个简单的例子：

```javascript
const result = await prisma.user.findMany({
  where: {
    name: {
      equals: 'Eleanor',
    },
  },
})
```

这段代码的含义是查询 `name` 等于 `'Eleanor'` 的记录。

举个复杂一点的例子：

```javascript
const result = await prisma.post.findMany({
  where: {
    OR: [
      {
        title: {
          contains: 'Prisma',
        },
      },
      {
        title: {
          contains: 'databases',
        },
      },
    ],
    AND: {
      published: false,
    },
  },
})
```

`OR` 实现“或”语句，`AND` 实现 “并”语句，这段代码的意思是找出 `title` 包含 `Prisma` 或者 `database` 并且 `published` 为 `false` 的记录。

#### 3.5. Relation filters

最后还有 Relation filters，有 [some](https://www.prisma.io/docs/orm/reference/prisma-client-reference#some)、[every](https://www.prisma.io/docs/orm/reference/prisma-client-reference#every)、[none](https://www.prisma.io/docs/orm/reference/prisma-client-reference#none)、[is](https://www.prisma.io/docs/orm/reference/prisma-client-reference#is)、[isNot](https://www.prisma.io/docs/orm/reference/prisma-client-reference#isnot)，举个例子：

```javascript
const result = await prisma.user.findMany({
  where: {
    post: {
      some: {
        content: {
          contains: "Prisma"
        }
      }
    }
  }
}
```

这段代码的含义是获取文章中包含 Prisma 文字的 user 记录。

```javascript
const result = await prisma.post.findMany({
  where: {
    user: {
        is: {
          name: "yayu"
        },
    }
  }
}
```

这段代码的含义是获取用户名为 "yayu" 的 post 记录。

### 4. Prisma Cli

最后再学习下 Prsima 的命令，运行：

```bash
npx prisma --help
```

可以查看到有哪些命令：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1624d47ff0d842f880c4398f73b7621f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1718\&h=686\&s=125478\&e=png\&b=1e1e1e)

其中：

| `npx prisma init`     | 初始化 Prisma           | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#init)       |
| --------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| `npx prisma generate` | 生成 Prisma Client     | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#generate)   |
| `npx prisma studio`   | 开启 Prisma Studio     | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#studio)     |
| `npx prisma validate` | 检验 Prisma schema 文件  | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#validate)   |
| `npx prisma format`   | 格式化 Prisma Scheam 文件 | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#format)     |
| `npx prisma version`  | 展示 Prisma 版本信息       | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#version--v) |
| `npx prisma debug`    | 展示 Prisma debug 信息   | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#debug)      |

稍微有点复杂的是 `db` 和 `migrate` 命令：

| `npx prisma db pull`    | 连接数据库，同步到数据模型    | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-pull)    |
| ----------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `npx prisma db push`    | 数据模型同步到数据库       | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-push)    |
| `npx prisma db seed`    | 给数据库填充点数据        | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-seed)    |
| `npx prisma db execute` | 与数据库交互，执行 SQL 语句 | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-execute) |

| `npx prisma migrate dev`     | 仅在开发环境下使用，迁移数据库                                                                                                                             | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-dev)     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `npx prisma migrate reset`   | 仅在开发环境下使用，重置数据库                                                                                                                             | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-reset)   |
| `npx prisma migrate deploy`  | 常用于正式环境，将迁移文件更新到生产环境后，执行该命令，会应用所有尚未迁移过的文件                                                                                                   | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-deploy)  |
| `npx prisma migrate resolve` | 当 migrate 失败时用于回滚，详细参考  [Failed migration](https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing#failed-migration) | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-resolve) |
| `npx prisma migrate status`  | 当前的迁移状态，哪些迁移已应用，哪些迁移尚未应用                                                                                                                    | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-status)  |
| `npx prisma migrate diff`    | 比较两个数据库 schema source 的差异                                                                                                                   | [API 链接](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff)    |

## 总结

Prisma 最主要的就是这些内容了。本篇主要是为大家介绍 ORM 和 Prisma。Prisma 是非常常见的搭配 Next.js 项目的技术选型，我们后面的实战项目还会继续用到 Prisma，就让我们在不断的实践中加深理解吧！

本篇的代码我已经上传到[代码仓库](https://github.com/mqyqingfeng/next-react-notes-demo/tree/main)的 [Day 10](https://github.com/mqyqingfeng/next-react-notes-demo/tree/day10) 分支，使用的时候不要忘记在本地开启 MySQL。

## 参考链接

1.  [What is Prisma? (Overview)](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma)
2.  <https://blog.bitsrc.io/what-is-an-orm-and-why-you-should-use-it-b2b6f75f5e2a>
3.  <https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-node-mysql>
