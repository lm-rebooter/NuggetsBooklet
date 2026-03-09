### 本资源由 itjc8.com 收集整理
﻿上节我们入门了 prisma，定义了 model 和表的映射，并且做了 CRUD。

这节来过一遍 Prisma 的全部命令。

```
npx prisma -h
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-1.png)

有这些：

- init：创建 schema 文件

- generate： 根据 shcema 文件生成 client 代码

- db：同步数据库和 schema

- migrate：生成数据表结构更新的 sql 文件

- studio：用于 CRUD 的图形化界面

- validate：检查 schema 文件的语法错误

- format：格式化 schema 文件

- version：版本信息


我们一个个来过一遍。

先创建个新项目：

```
mkdir prisma-all-command
cd prisma-all-command
npm init -y
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-2.png)

全局安装 prisma，这个是命令行工具的包：

```
npm install -g prisma
```
## prisma init
首先来试一下 init 命令：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-3.png)

这个就是创建 schema 文件的，可以指定连接的 database，或者指定 url。

我们试一下：

```
prisma init
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-4.png)

执行 init 命令后生成了 prisma/shcema.prisma 和 .env 文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-5.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-6.png)

包含了 db provider，也就是连接的数据库，以及连接的 url：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-7.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-8.png)

删掉这俩文件，重新生成。

```
prisma init --datasource-provider mysql
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-9.png)

这样生成的就是连接 mysql 的 provider 和 url 了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-10.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-11.png)

其实就是改这两处的字符串，prisma init 之后自己改也行。

再删掉这俩文件，我们重新生成。

```
prisma init --url mysql://root:guang@localhost:3306/prisma_test
```
这次指定连接字符串。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-12.png)

可以看到，provider 会根据你指定的 url 来识别，并且 .env 里的 url 就是我们传入的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-13.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-14.png)

## prisma db

创建完 schema 文件，如何定义 model 呢？

其实 init 命令的打印提示了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-15.png)

你可以执行 prisma db pull 把数据库里的表同步到 schema 文件。

我们试一下：

```
prisma db pull
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-16.png)

提示发现了 2 个 model 并写入了 schema 文件。

现在连接的 prisma_test 数据库里是有这两个表的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-17.png)

生成的 model 定义是这样的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-18.png)

其中，@@index 是定义索引，这里定义了 authorId 的外键索引。

此外，db 命令还有别的功能：

```
prisma db -h
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-19.png)

试下 prisma db push 命令：

首先在 mysql workbench 里把这两个表删掉：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-20.png)

然后执行 db push：

```
prisma db push
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-21.png)

提示同步到了 database，并且生成了 client 代码。

在 mysql workbench 里可以看到新的表：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-22.png)

seed 命令是执行脚本插入初始数据到数据库。

我们用 ts 来写，先安装相关依赖：

```
npm install typescript ts-node @types/node --save-dev
```
创建 tsconfig.json

```
npx tsc --init
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-23.png)

然后写下初始化脚本 prisma/seed.ts

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

async function main() {
    const user = await prisma.user.create({
        data: {
            name: '东东东',
            email: 'dongdong@dong.com',
            Post: {
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

main();
```
在 package.json 添加 seed 命令的配置：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-24.png)

```json
"prisma": {
    "seed": "npx ts-node prisma/seed.ts"
},
```
然后执行 seed：

```
prisma db seed
```

![image.png](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-25.png)

在 mysql workbench 里可以看到数据被正确插入了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-26.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-27.png)

其实 seed 命令就是把跑脚本的过程封装了一下，和直接用 ts-node 跑没啥区别。

然后是 prisma db execute，这个是用来执行 sql 的。

比如我写一个 prisma/test.sql 的文件：

```sql
delete from Post WHERE id = 2;
```
然后执行 execute：

```
prisma db execute --file prisma/test.sql --schema prisma/schema.prisma
```

这里 --file 就是指定 sql 文件的。

而 --schema 指定 schema 文件，主要是从中拿到数据库连接信息。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-28.png)

然后去 mysql workbench 里看一下，确实 id 为 2 的 Post 数据没有了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-29.png)

这就是 db 的 4 个命令。

## prisma migrate

mirgrate 是迁移的意思，在这里是指表的结构变化。

prisma migrate 有这些子命令：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-30.png)

我们分别来看一下。

首先是 prisma migrate dev。

这个我们前面用过，它会根据 schema 的变化生成 sql 文件，并执行这个 sql，还会生成 client 代码。

```
prisma migrate dev --name init
```

因为之前创建过表，并且有数据。

它会提示是否要 reset：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-31.png)

选择是，会应用这次 mirgration，生成 sql 文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-32.png)

并且会生成 client 代码，而且会自动执行 prisma db seed，插入初始化数据。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-33.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-34.png)

这样就既创建了表，又插入了初始数据，还生成了 client。

我们开发的时候经常用这个命令。

在 prisma/migrations 下会保存这次 migration 的 sql 文件。

目录名是 “年月日时分秒_名字” 的格式：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-35.png)

那如果我们改一下 schema 文件，再次执行 migrate dev 呢？

在 Post 的 model 定义里添加 tag 字段：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-36.png)

```
tag       String  @default("")
```
然后 migrate dev：

```
prisma migrate dev --name age-field
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-37.png)

这次生成的 sql 只包含了修改表结构的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-38.png)

在数据库中有个 _prisma_migrations 表，记录着数据库 migration 的历史：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-39.png)

如果把这个表删掉，再次 mirgate dev 就会有前面的是否 reset 的提示了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-40.png)

如果你想手动触发reset，可以用 reset 命令：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-41.png)

它会清空数据然后执行所有 migration

```
prisma migrate reset
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-42.png)

会提示会丢失数据，确认后就会重置表，然后执行所有 migration：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-43.png)

还会生成 client 代码，并且执行 prisma db seed 来初始化数据。

## prisma generate

generate 命令只是用来生成 client 代码的，他并不会同步数据库：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-44.png)

只是根据 schema 定义，在 node_modules/@prisma/client 下生成代码，用于 CRUD。

## prisma studio

这个是可以方便 CRUD 数据的图形界面：

```
prisma studio
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-45.png)

选择一个 model：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-46.png)

会展示它的所有数据：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-47.png)

可以编辑记录：
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-48.png)

删除记录：
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-49.png)

新增记录：
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-50.png)

不过一般我们都用 mysql workbench 来做。

## prisma validate

这个是用来检查 schema 文件是否有语法错误的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-51.png)

比如我写错一个类型，然后执行 validate：

```
prisma validate
```
会提示这里有错误：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-52.png)

当然，我们安装了 prisma 的插件之后，可以直接在编辑器里看到这个错误：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-53.png)

就和 eslint 差不多。

## prisma format

这个是用来格式化 prisma 文件的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-54.png)

当然，你安装了 prisma 的 vscode 插件之后，也可以直接用编辑器的 format：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-55.png)

## prisma version

这个就是展示一些版本信息的，比较简单：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第115章-56.png)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/prisma-all-command)

## 总结

这节我们学习了 prisma 的全部命令：

- init：创建 schema 文件

- generate： 根据 shcema 文件生成 client 代码

- db：同步数据库和 schema

- migrate：生成数据表结构更新的 sql 文件

- studio：用于 CRUD 的图形化界面

- validate：检查 schema 文件的语法错误

- format：格式化 schema 文件

- version：版本信息

其中，prisma init、prisma migrate dev 是最常用的。

prisma db pull、prisma db push 也可以方便的用来做 schema 和数据库的同步。

常用的命令也没有几个，多拥几遍就熟了。