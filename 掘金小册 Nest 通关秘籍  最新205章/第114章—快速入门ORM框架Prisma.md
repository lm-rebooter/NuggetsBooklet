### 本资源由 itjc8.com 收集整理
﻿我们学习了 TypeORM，它是一个传统的 ORM 框架，也就是把表映射到 entity 类，把表的关联映射成 entity 类的属性关联。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-1.png)

完成 entity 和表的映射之后，你只要调用 userRepository 和 postRepository 的 find、delete、save 等 api，typeorm 会自动生成对应的 sql 语句并执行。

这就是 Object Relational Mapping，也就是对象和关系型数据库的映射的含义。

而 Prisma 不是这样的，它没有 entity 类的存在。

那映射什么呢？

Prisma 创造了一种 DSL（Domain Specific Language，领域特定语言）。

类似这样：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-2.png)

它是把表映射成了 DSL 里的 model，然后编译这个 DSL 会生成 prismaClient 的代码，之后就可以调用它的 find、delete、create 等 api 来做 CRUD 了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-3.png)

虽然多了一种 DSL 的语法，但整个流程其实和 typeorm 差不多的。

我们来写下试试：

```
mkdir prisma-test
cd prisma-test
npm init -y
```
首先生成项目：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-4.png)

安装 typescript 相关的包：

```
npm install typescript ts-node @types/node --save-dev
```

typescript 是 tsc 编译器的包，ts-node 可以直接跑 ts 代码，而 @types/node 是 node api 的类型声明。

然后创建 tsconfig.json

```
npx tsc --init
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-5.png)

安装 prisma：

```
npm install prisma --save-dev
```

之后就可以来写代码了。

首先，我们要写 schema 层的代码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-6.png)

这个也是用命令生成：

```
npx prisma init --datasource-provider mysql
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-7.png)

这时你会发现项目目录下多了 schema 文件和 env 文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-8.png)

schema 文件里就是定义 model 的地方。

这个文件可以安装 prisma 插件来添加语法高亮等支持：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-9.png)

而 .env 文件里存储着连接信息：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-10.png)

我们先去 mysql workbench 里创建个数据库：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-11.png)

指定字符集为 utf8mb4，这个支持的字符集是最全的。

或者执行这个 sql：

```sql
CREATE SCHEMA `prisma_test` DEFAULT CHARACTER SET utf8mb4;
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-12.png)

创建完 database 后，我们改下连接信息：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-13.png)

```env
DATABASE_URL="mysql://root:guang@localhost:3306/prisma_test"
```
改下用户名、密码、连接的数据库。

然后来定义 model：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-14.png)

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```
有了 mysql 和 typeorm 的基础后，这些很容易能看懂。

@id 是主键

@default(autoincrement()) 是指定默认值是自增的数字

@unique 是添加唯一约束

@relation 是指定多对一的关联关系，通过 authorId 关联 User 的 id

然后只要基于它生成 client 的代码，就可以来 crud 了：

```
npx prisma migrate dev --name aaa
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-15.png)

执行 prisma migrate dev，会生成并执行建表 sql 文件，而且在 node_modules 下生成了 client 代码。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-16.png)

在 mysql workbench 里可以看到生成了 2 个表：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-17.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-18.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-19.png)

在 node_modules/.prisma/client 下生成的代码也包含了 user 和 post 的信息：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-20.png)

然后就可以用 @prisma/client 来做 CRUD 了。

创建 src/index.ts

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function test1() {
    await prisma.user.create({
        data: {
            name: 'guang',
            email: '111@gaung.com'
        }
    });

    await prisma.user.create({
        data: {
            name: 'dong',
            email: '222@dong.com'
        }
    });

    const users = await prisma.user.findMany();
    console.log(users);
}

test1();
```
创建 PrismaClient，用 create 方法创建了 2 个 user，然后查询出来。

跑一下：

```
npx ts-node ./src/index.ts
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-21.png)

可以看到，user 表确实插入了 2 条记录：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-22.png)

然后我们再来插入一个新的 user 和它的两个 post：

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});

async function test2() {
    const user = await prisma.user.create({
        data: {
            name: '东东东',
            email: 'dongdong@dong.com',
            posts: {
                create: [
                    {
                        title: 'aaa',
                        content: 'aaaa'
                    },
                    {
                        title: 'bbb',
                        content: 'bbbb'
                    }
                ]
            },
        },
    })
    console.log(user)
}

test2();
```
这里开启了 prisma 的 log，会打印 sql。

然后用 create 方法创建了 user，并且 create 了两个关联的 post。

执行下：

```
npx ts-node ./src/index.ts
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-23.png)

可以看到被事务包裹的三条 insert 语句。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-24.png)
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-25.png)

数据也都插入成功了。

然后是再来试下更新和删除：
```javascript
async function test3() {
    await prisma.post.update({
        where: {
            id: 2
        },
        data: {
            content: 'xxx'
        }
    })
}
test3();
```
更新 id 为 2 的 post 的内容为 xxx：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-26.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-27.png)

然后把它删掉：

```javascript
async function test4() {
    await prisma.post.delete({
        where: {
            id: 2
        }
    });
}
test4();
```
执行下：
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-28.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-29.png)

这样，基于 prisma 的 model 定义还有 CRUD 我们就都完成了。

回顾下整个流程：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第114章-30.png)

只是把 entity 类变成了 DSL 语法里的 model，然后通过编译的方式生成 client 的代码，之后进行 CRUD。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/prisma-test)

## 总结

我们学习了 ORM 框架 prisma，它和 typeorm 大同小异。

typeorm 是把表映射成 entity 类，然后调用 repository 的 api 来做 CRUD。

prisma 是把条映射成 schema 的 model，然后编译生成 client 代码，之后进行 crud。

用到这两个命令：

primsa init 创建 schema 文件

prisma migrate dev 根据 schema 文件生成 sql 并执行，还会生成 client 代码。

之后就是 CRUD 了，涉及到 findMany、create、delete、update 等 api。

这节只是入了个门，下节来更全面的掌握 prisma。
