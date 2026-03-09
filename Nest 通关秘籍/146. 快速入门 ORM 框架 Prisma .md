我们学习了 TypeORM，它是一个传统的 ORM 框架，也就是把表映射到 entity 类，把表的关联映射成 entity 类的属性关联。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a698288293c74bc09e0610f0b40f3ee7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1662&h=632&s=56056&e=png&b=ffffff)

完成 entity 和表的映射之后，你只要调用 userRepository 和 postRepository 的 find、delete、save 等 api，typeorm 会自动生成对应的 sql 语句并执行。

这就是 Object Relational Mapping，也就是对象和关系型数据库的映射的含义。

而 Prisma 不是这样的，它没有 entity 类的存在。

那映射什么呢？

Prisma 创造了一种 DSL（Domain Specific Language，领域特定语言）。

类似这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b8bafec64a54cc6bb13548d5e74c060~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1108&h=596&s=108843&e=png&b=1f1f1f)

它是把表映射成了 DSL 里的 model，然后编译这个 DSL 会生成 prismaClient 的代码，之后就可以调用它的 find、delete、create 等 api 来做 CRUD 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63dbcba51cca4de4b37da140ea4a5dd7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=632&s=58044&e=png&b=ffffff)

虽然多了一种 DSL 的语法，但整个流程其实和 typeorm 差不多的。

我们来写下试试：

```
mkdir prisma-test
cd prisma-test
npm init -y
```
首先生成项目：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6dec5117a0f49ecb2bb7266b6fe478d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=638&s=127128&e=png&b=010101)

安装 typescript 相关的包：

```
npm install typescript ts-node @types/node --save-dev
```

typescript 是 tsc 编译器的包，ts-node 可以直接跑 ts 代码，而 @types/node 是 node api 的类型声明。

然后创建 tsconfig.json

```
npx tsc --init
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45cf724166f1491698f7f9b88d069421~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=670&h=374&s=42563&e=png&b=181818)

安装 prisma：

```
npm install prisma --save-dev
```

之后就可以来写代码了。

首先，我们要写 schema 层的代码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63dbcba51cca4de4b37da140ea4a5dd7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=632&s=58044&e=png&b=ffffff)

这个也是用命令生成：

```
npx prisma init --datasource-provider mysql
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/badf219d44184c7dac738193e223bb53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1118&h=432&s=81961&e=png&b=181818)

这时你会发现项目目录下多了 schema 文件和 env 文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7b66e678ffd4016ab2ed84da51c2067~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=502&s=101501&e=png&b=1d1d1d)

schema 文件里就是定义 model 的地方。

这个文件可以安装 prisma 插件来添加语法高亮等支持：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6adddf3e1d8c4f21b84be5ff7129e5ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=786&h=306&s=39728&e=png&b=1d1d1d)

而 .env 文件里存储着连接信息：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c38225c9c6d441ea88399f644035b4e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=378&s=74936&e=png&b=1f1f1f)

我们先去 mysql workbench 里创建个数据库：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cbe9be9ee4e4631be3d99f45f1de85b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1264&h=752&s=186420&e=png&b=e7e5e5)

指定字符集为 utf8mb4，这个支持的字符集是最全的。

或者执行这个 sql：

```sql
CREATE SCHEMA `prisma_test` DEFAULT CHARACTER SET utf8mb4;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7b7d55d601d4658a4da7ed0ed1cb896~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=476&h=254&s=37328&e=png&b=e5e0df)

创建完 database 后，我们改下连接信息：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e397db8aa7e4920a562d29008ab01ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=348&s=69452&e=png&b=1f1f1f)

```env
DATABASE_URL="mysql://root:guang@localhost:3306/prisma_test"
```
改下用户名、密码、连接的数据库。

然后来定义 model：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6c6e0ba468b4379b55aaa55caf89bba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=852&s=140113&e=png&b=1f1f1f)

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
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6e5db92339141d4ba89c278855ae6f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1166&h=484&s=77481&e=png&b=191919)

执行 prisma migrate dev，会生成并执行建表 sql 文件，而且在 node_modules 下生成了 client 代码。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c683432eda74c1ea50f1fdcc568e1c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1576&h=1062&s=273442&e=png&b=1d1d1d)

在 mysql workbench 里可以看到生成了 2 个表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24662a1290aa4e478a927adf9f300706~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=442&s=129826&e=png&b=eeebeb)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5acc0cad3ba54e7a92e7755cc3ee8cad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=580&s=184182&e=png&b=eeebeb)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14fbed8200d64b1c903efcc088464e5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=482&s=99384&e=png&b=f7f6f6)

在 node_modules/.prisma/client 下生成的代码也包含了 user 和 post 的信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce58f0bdb4854f4286e2095facc77745~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=636&s=142091&e=png&b=1c1c1c)

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
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/308e5f46852a424f898e27a70d865a47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=758&h=160&s=29609&e=png&b=181818)

可以看到，user 表确实插入了 2 条记录：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0127e313b7e5480abe0dbfab7445a61a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=408&s=125597&e=png&b=ece9e8)

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
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/984b490b399044068950a07cdae94cd2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1314&h=330&s=92682&e=png&b=181818)

可以看到被事务包裹的三条 insert 语句。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79527c6e92f0409eaaab44a99187dee5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=400&s=132137&e=png&b=ece9e8)
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a702cb205ff45eab22c4da71fb4e192~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=332&s=108189&e=png&b=ebe8e7)

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

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97c275fee3dd45adbb90f208517a62c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1316&h=286&s=80407&e=png&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74df2e460a6e4b77957d8197bcdcd4a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=592&h=252&s=56477&e=png&b=fafafa)

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
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58f9c0b6df584b00ac8dde3569c687f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1258&h=266&s=61733&e=png&b=191919)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34337e18216745aeacbe507b644d43a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=622&h=208&s=47905&e=png&b=fafafa)

这样，基于 prisma 的 model 定义还有 CRUD 我们就都完成了。

回顾下整个流程：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63dbcba51cca4de4b37da140ea4a5dd7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=632&s=58044&e=png&b=ffffff)

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
