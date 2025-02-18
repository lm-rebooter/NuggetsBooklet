我们经常用 restful 的接口来开发业务。

比如 GET 请求 /students 查询所有学生，/students/1 查询 id 为 1 的学生

发送 POST、PUT、DETETE 请求分别代表增删改。

其实也可以用 GraphQL 的方式来写接口：

查询：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2588954ae0a410f9874f5f7704b9abd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=998&s=105312&e=png&b=ffffff)

新增：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e86ac6868ec481dbbd0ddb2d018fad1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1492&h=916&s=116440&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1dace67d38542c897f4eda0fe1c1248~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1466&h=1126&s=130142&e=png&b=ffffff)

增删改查都在一个接口里搞定，并且想要什么数据由前端自己取。

今天我们就用 Nest + GrahQL 做一个 TodoList 的增删改查。

数据存在 mysql 里，用 Prisma 作为 ORM 框架。

```bash
npm install -g @nestjs/cli

nest new graphql-todolist
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ddefb3f395445ae82a2e4a97e69df00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=696&s=165174&e=png&b=010101)

创建个项目，然后我们首先来实现 restful 接口的增删改查。

用 docker 把 mysql 跑起来：

从 docker 官网下载 docker desktop，这个是 docker 的桌面端：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d7da48155df448698ae5fc57072fe0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2380\&h=1336\&s=459767\&e=png\&b=ffffff)

跑起来后，搜索 mysql 镜像（这步需要科学上网），点击 run：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/659eaef5c4b8445a8c7224981515c1fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2368\&h=1460\&s=326395\&e=png\&b=7a7a7b)

输入容器名、端口映射、以及挂载的数据卷，还要指定一个环境变量：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33961dc3a8cd4d9c805c2ff096a1caf9~tplv-k3u1fbpfcp-watermark.image#?w=1332\&h=1428\&s=187941\&e=png\&b=ffffff)

端口映射就是把宿主机的 3306 端口映射到容器里的 3306 端口，这样就可以在宿主机访问了。

数据卷挂载就是把宿主机的某个目录映射到容器里的 /var/lib/mysql 目录，这样数据是保存在本地的，不会丢失。

而 MYSQL\_ROOT\_PASSWORD 的密码则是 mysql 连接时候的密码。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7db618f4e4b4ca3b0b44752450d4322~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2232\&h=1326\&s=496885\&e=png\&b=ffffff)

跑起来后，我们用 GUI 客户端连上，这里我们用的是 mysql workbench，这是 mysql 官方提供的免费客户端：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1311f9991e248de8a9cdd92c9b72a15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=270\&h=270\&s=40789\&e=png\&b=9b5801)

连接上之后，点击创建 database：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef0a84137c6249d191c5c798fdfd0cb1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1626&h=1126&s=271190&e=png&b=e8e7e7)

指定名字、字符集为 utf8mb4，然后点击右下角的 apply。

创建成功之后在左侧就可以看到这个 database 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35b4be97f4e54bb89e6c035125c02f26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=402&h=256&s=34981&e=png&b=e9e4e0)

现在还没有表。

我们在 Nest 里用 Prisma 连接 mysql。

进入项目，安装 prisma

```bash
npm install prisma --save-dev
```
执行 prisma init 创建 schema 文件：

```bash
npx prisma init
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea10e80f6fd04d7892d98c540a50c1ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=504&s=98914&e=png&b=181818)

生成了 schema 文件（用来定义 model 的），和 .env 文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e79653f4b614e369ada66ad4de9834c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1312&h=650&s=152818&e=png&b=1c1c1c)

改下 .env 的配置：

```env
DATABASE_URL="mysql://root:你的密码@localhost:3306/todolist"
```

并且修改下 schema 里的 datasource 部分：

```javascript
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

然后创建 model：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19da9ee8915e4c61b00679fdec070dfa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=900&h=812&s=140024&e=png&b=1f1f1f)

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model TodoItem {
  id        Int    @id @default(autoincrement())
  content    String  @db.VarChar(50)
  createTime DateTime @default(now())
  updateTime DateTime @updatedAt
}
```
id 自增，content 是长度为 50 的字符串，还有创建时间 createTime、更新时间 updateTime。

执行 prisma migrate dev，它会根据定义的 model 去创建表：

```
npx prisma migrate dev --name init
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8b384eade2143f0b2c4007f102fd5d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=758&s=112355&e=png&b=181818)

它会生成 sql 文件，里面是这次执行的 sql。

然后还会生成 client 代码，用来连接数据库操作这个表。

可以看到，这次执行的 sql 就是 create table 建表语句：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fbc8c88d3cf4062b6d35f95505394ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1640&h=546&s=159515&e=png&b=1d1d1d)

这时候数据库就就有这个表了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58a4409e705848c4bea095f147873ee2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=578&s=197490&e=png&b=efeceb)

接下来我们就可以在代码里做 CRUD 了。

生成一个 service：

```
nest g service prisma --flat --no-spec
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e7a681aae61456e8218f380407c9256~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=688&h=116&s=27036&e=png&b=191919)

改下生成的 PrismaService，继承 PrismaClient，这样它就有 crud 的 api 了：

```javascript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor() {
        super({
            log: [
                {
                    emit: 'stdout',
                    level: 'query'
                }
            ]
        })
    }

    async onModuleInit() {
        await this.$connect();
    }
}
```
在 constructor 里设置 PrismaClient 的 log 参数，也就是打印 sql 到控制台。

在 onModuleInit 的生命周期方法里调用 $connect 来连接数据库。

然后在 AppService 里注入 PrismaService，实现 CRUD：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTodoList } from './todolist-create.dto';
import { UpdateTodoList } from './todolist-update.dto';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async query() {
    return this.prismaService.todoItem.findMany({
      select: {
        id: true,
        content: true,
        createTime: true
      }
    });
  }

  async create(todoItem: CreateTodoList) {
    return this.prismaService.todoItem.create({
      data: todoItem,
      select: {
        id: true,
        content: true,
        createTime: true
      }
    });
  }

  async update(todoItem: UpdateTodoList) {
    return this.prismaService.todoItem.update({
      where: {
        id: todoItem.id
      },
      data: todoItem,
      select: {
        id: true,
        content: true,
        createTime: true
      }
    });
  }

  async remove(id: number) {
    return this.prismaService.todoItem.delete({
      where: {
        id
      }
    })
  }
}
```
@Inject 注入 PrismaService，用它来做 CRUD，where 是条件、data 是数据，select 是回显的字段：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c05586639ac4733aee363e473f78130~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=822&s=101449&e=png&b=202020)

然后创建用到的两个 dto 的 class

todolist-create.dto.ts

```javascript
export class CreateTodoList {
    content: string;
}
```

todolist-update.dto.ts

```
export class UpdateTodoList {
    id: number;
    content: string;
}
```
在 AppController 里引入下，添加几个路由：

```javascript
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTodoList } from './todolist-create.dto';
import { UpdateTodoList } from './todolist-update.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  async create(@Body() todoItem: CreateTodoList) {
    return this.appService.create(todoItem);
  }

  @Post('update')
  async update(@Body() todoItem: UpdateTodoList) {
    return this.appService.update(todoItem);
  }

  @Get('delete')
  async delete(@Query('id') id: number) {
    return this.appService.remove(+id);
  }

  @Get('list')
  async list() {
    return this.appService.query();
  }

}
```
添加增删改查 4 个路由，post 请求用 @Body() 注入请求体，@Query 拿路径中的参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a7a9e08018742beba2229a63b2c00d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=864&h=892&s=145372&e=png&b=1f1f1f)

把服务跑起来试一下：

```
npm run start:dev
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b670df1756294db6b0d1baf09e5c1e78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1570&h=442&s=185512&e=png&b=181818)

首先是 list，现在没有数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9680c6b5b43b4d279310f0ee88c0dfec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=736&h=554&s=48051&e=png&b=fbfbfb)

然后添加一个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe31162b5c2d4ccea681ec599aa7e2fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=794&h=694&s=80224&e=png&b=fcfcfc)

服务端打印了 insert into 的 sql：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e4d97ae7af64aab8f56cf011fbd2db1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=682&s=253503&e=png&b=181818)

数据库也有了这条记录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/febf6f78e21845bcb2bac919484a2bf6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=280&s=91778&e=png&b=eeebea)

再加一个：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a7130f3261c496b8a67dcb6b42cba76~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=782&h=686&s=80284&e=png&b=fbfbfb)

然后查一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13458e32cc534f0b9d5c4f45e36fdaf2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=862&h=926&s=98197&e=png&b=fdfdfd)

接下来试下修改、删除：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f7d77eeec2c4518a45440f7f2fbe3b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=796&h=716&s=83610&e=png&b=fcfcfc)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfbb627e042b4a9e8412161e3692bf1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=854&h=744&s=84022&e=png&b=fcfcfc)

再查一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/362069aec65347ac8e0ca8de6feab628~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=668&s=72279&e=png&b=fcfcfc)

没啥问题。

这样，todolist 的 restful 版接口就完成了。

接下来实现 graphql 版本：

安装用到的包：

```bash
npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

然后在 AppModule 里引入下：

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
```
typePaths 就是 schema 文件的路径：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c02915bbc3348c385f86ce55f6fd77d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=700&s=149084&e=png&b=1f1f1f)

添加一个 todolist.graphql

```graphql
type TodoItem {
    id: Int
    content: String
}

input CreateTodoItemInput {
  content: String
}

input UpdateTodoItemInput {
  id: Int!
  content: String
}

type Query {
  todolist: [TodoItem]!
  queryById(id: Int!): TodoItem
}


type Mutation {
  createTodoItem(todoItem: CreateTodoItemInput!): TodoItem!
  updateTodoItem(todoItem: UpdateTodoItemInput!): TodoItem!
  removeTodoItem(id: Int!): Int
}
```
语法比较容易看懂，就是定义数据的结构。

在 Query 下定义查询的接口，在 Mutation 下定义增删改的接口。

然后实现 resolver，也就是这些接口的实现：

```bash
nest g resolver todolist --no-spec --flat
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89294a98b4074c79839466b8803601ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=758&h=108&s=28623&e=png&b=191919)

```javascript
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';
import { Inject } from '@nestjs/common';
import { CreateTodoList } from './todolist-create.dto';
import { UpdateTodoList } from './todolist-update.dto';

@Resolver()
export class TodolistResolver {

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Query("todolist")
    async todolist() {
        return this.prismaService.todoItem.findMany();
    }

    @Query("queryById")
    async queryById(@Args('id') id) {
        return this.prismaService.todoItem.findUnique({
            where: {
                id
            }
        })
    }

    @Mutation("createTodoItem")
    async createTodoItem(@Args("todoItem") todoItem: CreateTodoList) {
        return this.prismaService.todoItem.create({
            data: todoItem,
            select: {
              id: true,
              content: true,
              createTime: true
            }
          });
    }


    @Mutation("updateTodoItem")
    async updateTodoItem(@Args('todoItem') todoItem: UpdateTodoList) {
        return this.prismaService.todoItem.update({
            where: {
              id: todoItem.id
            },
            data: todoItem,
            select: {
              id: true,
              content: true,
              createTime: true
            }
          });
    }

    @Mutation("removeTodoItem")
    async removeTodoItem(@Args('id') id: number) {
        await this.prismaService.todoItem.delete({
            where: {
              id
            }
        })
        return id;
    }
}
```

用 @Resolver 声明 resolver，用 @Query 声明查询接口，@Mutation 声明增删改接口，@Args 取传入的参数。

具体增删改查的实现和之前一样。

浏览器访问 http://localhost:3000/graphql 就是 playground，可以在这里查询：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b26f480948140e19e792158026fff87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1778&h=760&s=96872&e=png&b=111d28)

左边输入查询语法，右边是执行后返回的结果。

当然，对新手来说这个 playground 不够友好，没有提示。

我们换一个：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71ad14aa08db4ae49e099373c7dac15c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1248&h=854&s=216674&e=png&b=1f1f1f)

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { TodolistResolver } from './todolist.resolver';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, TodolistResolver],
})
export class AppModule {}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09909742073143be930078ca2202d60a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2192&h=1306&s=306316&e=gif&f=54&b=f0f4f7)

试一下新增：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ddb7225a23e49a088bafe220ad0c86d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1462&h=964&s=118088&e=png&b=ffffff)

查询：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2b5401d77d04640a2103212419645bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1680&h=654&s=76243&e=png&b=ffffff)

修改：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77814374325d4b42bb047a567a71aef2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1510&h=832&s=115324&e=png&b=ffffff)

单个查询：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5064d3764964429ba9ab78f2fa860869~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1508&h=726&s=98504&e=png&b=ffffff)

删除：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0827524acd884a10af8470290c8a78d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1462&h=718&s=92889&e=png&b=ffffff)

查询：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e44f460079c4dfdb238828f1c137a0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1554&h=574&s=60793&e=png&b=ffffff)

基于 GraphQL 的增删改查都成功了！

然后在 react 项目里调用下。

```bash
npx create-vite
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01c8020be18747eb96547d34446fdae6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=406&s=53515&e=png&b=000000)

进入项目，安装 @apollo/client

```bash
npm install

npm install @apollo/client
```
改下 main.tsx

```javascript
import * as ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);

```
创建 ApolloClient 并设置到 ApolloProvider。

然后在 App.tsx 里用 useQuery 发请求：

```javascript
import { gql, useQuery } from '@apollo/client';

const getTodoList = gql`
  query Query {
    todolist {
      content
      id
    }
  }
`;

type TodoItem = {
  id: number;
  content: string;
}

type TodoList = {
  todolist: Array<TodoItem>;
}

export default function App() {
  const { loading, error, data } = useQuery<TodoList>(getTodoList);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <ul>
      {
        data?.todolist?.map(item => {
          return <li key={item.id}>{item.content}</li>
        })
      }
    </ul>
  );
}
```
把服务跑起来：

```
npm run dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d61f8579b9f94b629ba9697073e90f2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=702&h=268&s=35508&e=png&b=181818)

这里涉及到的跨域，现在后端服务里开启下跨域支持：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94650717fdcf4663b6d167acffebf8de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884&h=416&s=78079&e=png&b=1f1f1f)

可以看到，返回了查询结果：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d289ca239df4f5e8070e926797dcb32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2150&h=1482&s=270322&e=png&b=fefefe)

然后加一下新增：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e2c3bb5c2b04f678ef4d61b3be6db37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=1148&s=180817&e=png&b=1f1f1f)

用 useMutation 的 hook，指定 refetchQueries 也就是修改完之后重新获取数据。

调用的时候传入 content 数据。

```javascript
import { gql, useMutation, useQuery } from '@apollo/client';

const getTodoList = gql`
  query Query {
    todolist {
      content
      id
    }
  }
`;

const createTodoItem = gql`
  mutation Mutation($todoItem: CreateTodoItemInput!) {
    createTodoItem(todoItem: $todoItem) {
      id
      content
    }
  }
`;

type TodoItem = {
  id: number;
  content: string;
}

type TodoList = {
  todolist: Array<TodoItem>;
}

export default function App() {
  const { loading, error, data } = useQuery<TodoList>(getTodoList);

  const [createTodo] = useMutation(createTodoItem, {
    refetchQueries: [getTodoList]
  });

  async function onClick() {
    await createTodo({
      variables: {
        todoItem: {
          content: Math.random().toString().slice(2, 10)
        }
      }
    })
  }

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <button onClick={onClick}>新增</button>
      <ul>
        {
          data?.todolist?.map(item => {
            return <li key={item.id}>{item.content}</li>
          })
        }
      </ul>
    </div>
  );
}
```
测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dc96154f7e048998abb6c92fd4dd7ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1108&h=634&s=71495&e=gif&f=32&b=fefefe)

数据库里也可能看到新增的数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a16ac5169606455b87273b4f88e1080d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1432&h=386&s=213553&e=png&b=efeceb)

这样，我们就能在 react 项目里用 graphql 做 CRUD 了。

案例代码上传了 github。

后端代码： https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/graphql-todolist

前端代码：https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/graphql-todolist-client

## 总结

我们实现了 Restful 和 GraphQL 版的 CRUD。

前端用 React + @apollo/client。

后端用 Nest + GraphQL + Prisma + MySQL。

GraphQL 主要是定义 schema 和 resolver 两部分，schema 是 Query、Mutation 的结构，resolver 是它的实现。

可以在 playground 里调用接口，也可以在 react 里用 @appolo/client 调用。

相比 restful 的版本，graphql 只需要一个接口，然后用查询语言来查，需要什么数据取什么数据，更加灵活。

业务开发中，你会选择用 GraphQL 开发接口么？
