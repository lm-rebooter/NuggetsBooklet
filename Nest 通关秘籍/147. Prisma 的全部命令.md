上节我们入门了 prisma，定义了 model 和表的映射，并且做了 CRUD。

这节来过一遍 Prisma 的全部命令。

```
npx prisma -h
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d4303e562914ed4b5a96c870236f787~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=678&s=89326&e=png&b=181818)

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

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/141cc568db0b4429983749d95b566e7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=652&s=134319&e=png&b=000000)

全局安装 prisma，这个是命令行工具的包：

```
npm install -g prisma
```
## prisma init
首先来试一下 init 命令：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cda9096e9424c8ba9b052b1a8cd6deb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=784&s=98010&e=png&b=181818)

这个就是创建 schema 文件的，可以指定连接的 database，或者指定 url。

我们试一下：

```
prisma init
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/803a110c492a4c5bbd5320fa958a7a2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=578&s=115206&e=png&b=181818)

执行 init 命令后生成了 prisma/shcema.prisma 和 .env 文件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1ea30a82f614f0788dcc0f4feb1ef93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=480&s=100047&e=png&b=1d1d1d)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab0670632c5d4b9e9dde8b31980f57e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1880&h=474&s=131957&e=png&b=1e1e1e)

包含了 db provider，也就是连接的数据库，以及连接的 url：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ff37b1eb71845b4954ac732351274fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=662&h=460&s=62932&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca9dccf4f98b4482bd99091a38cb9694~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1314&h=348&s=86946&e=png&b=1f1f1f)

删掉这俩文件，重新生成。

```
prisma init --datasource-provider mysql
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27c14f5b72f94224b6a097f04db4514d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=432&s=84377&e=png&b=181818)

这样生成的就是连接 mysql 的 provider 和 url 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9e42e14e6e24405b187215b17f7ffa8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=718&h=448&s=61405&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ca1667c732a49beb7e5b6ef45f3e623~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=332&s=72335&e=png&b=1f1f1f)

其实就是改这两处的字符串，prisma init 之后自己改也行。

再删掉这俩文件，我们重新生成。

```
prisma init --url mysql://root:guang@localhost:3306/prisma_test
```
这次指定连接字符串。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0958cfc6e85e408f972af7234fe6d06b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=402&s=71532&e=png&b=181818)

可以看到，provider 会根据你指定的 url 来识别，并且 .env 里的 url 就是我们传入的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58d4c30da19f465a859912b080bea712~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=646&h=448&s=59576&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4a2fc484bcc4410807e8df4f9fdba68~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=360&s=69200&e=png&b=1f1f1f)

## prisma db

创建完 schema 文件，如何定义 model 呢？

其实 init 命令的打印提示了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0686752fafa743b6a8f676d266c09f30~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=338&s=113647&e=png&b=191919)

你可以执行 prisma db pull 把数据库里的表同步到 schema 文件。

我们试一下：

```
prisma db pull
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51bf4749e5014463bec0b72e62d4a31d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=254&s=44743&e=png&b=191919)

提示发现了 2 个 model 并写入了 schema 文件。

现在连接的 prisma_test 数据库里是有这两个表的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ed443a246eb42cab0d33ffbc8d0260c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=346&s=115481&e=png&b=edeae8)

生成的 model 定义是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b66238684b3442a09d700a27016361c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1158&h=988&s=165063&e=png&b=1f1f1f)

其中，@@index 是定义索引，这里定义了 authorId 的外键索引。

此外，db 命令还有别的功能：

```
prisma db -h
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a32adf5922464877b0adf1307e880ddd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1222&h=532&s=73319&e=png&b=181818)

试下 prisma db push 命令：

首先在 mysql workbench 里把这两个表删掉：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71913e8985064aa99ea3b2ef1bc43c67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=576&h=640&s=190018&e=png&b=ddd8d4)

然后执行 db push：

```
prisma db push
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/677514acfbd848b99bdd602398c6d539~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=420&s=69492&e=png&b=191919)

提示同步到了 database，并且生成了 client 代码。

在 mysql workbench 里可以看到新的表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98b31be7183d4f06a77085b7d6ecc220~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=396&s=119733&e=png&b=efecea)

seed 命令是执行脚本插入初始数据到数据库。

我们用 ts 来写，先安装相关依赖：

```
npm install typescript ts-node @types/node --save-dev
```
创建 tsconfig.json

```
npx tsc --init
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d143ca746d04f349b0cf5e51c25138b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=668&h=388&s=42942&e=png&b=181818)

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

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87217c1c49bf4913893345662f6f6be5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=760&h=266&s=39724&e=png&b=1f1f1f)

```json
"prisma": {
    "seed": "npx ts-node prisma/seed.ts"
},
```
然后执行 seed：

```
prisma db seed
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b961266c00740a9919edc4808f23f78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=462&s=111968&e=png&b=191919)

在 mysql workbench 里可以看到数据被正确插入了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b16e1310a2934ddab9d9484737eea28d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=270&s=74168&e=png&b=ebe8e7)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ce6c95394ab4be2bdd14ec036c50771~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=278&s=87217&e=png&b=ebe8e7)

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

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740213f0e2fb44ad872f142604d8153d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=72&s=17399&e=png&b=181818)

然后去 mysql workbench 里看一下，确实 id 为 2 的 Post 数据没有了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd48653b11a34700b6c1004d30133445~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=594&h=196&s=46389&e=png&b=f9f9f9)

这就是 db 的 4 个命令。

## prisma migrate

mirgrate 是迁移的意思，在这里是指表的结构变化。

prisma migrate 有这些子命令：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec74ce5adfa74ac8938f8e25d9785c2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1364&h=780&s=113533&e=png&b=181818)

我们分别来看一下。

首先是 prisma migrate dev。

这个我们前面用过，它会根据 schema 的变化生成 sql 文件，并执行这个 sql，还会生成 client 代码。

```
prisma migrate dev --name init
```

因为之前创建过表，并且有数据。

它会提示是否要 reset：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac08e229620d4630b561324018f442e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=104&s=22468&e=png&b=191919)

选择是，会应用这次 mirgration，生成 sql 文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7fa4cf793f34ea4aa932145689ac945~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1520&h=768&s=162100&e=png&b=181818)

并且会生成 client 代码，而且会自动执行 prisma db seed，插入初始化数据。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/504d374d37e04c2f81527b7f7220af53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=184&s=57122&e=png&b=e0dcdc)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6da5ff447888459dbb5f9aa2635a5dcd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=228&s=82594&e=png&b=e1dddd)

这样就既创建了表，又插入了初始数据，还生成了 client。

我们开发的时候经常用这个命令。

在 prisma/migrations 下会保存这次 migration 的 sql 文件。

目录名是 “年月日时分秒_名字” 的格式：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d2e09eb5e92415190ab5d9543cf752c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1350&h=708&s=184394&e=png&b=1d1d1d)

那如果我们改一下 schema 文件，再次执行 migrate dev 呢？

在 Post 的 model 定义里添加 tag 字段：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/966dd7e9f05844f59ec7a21d5a48d0d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=718&h=362&s=66261&e=png&b=202020)

```
tag       String  @default("")
```
然后 migrate dev：

```
prisma migrate dev --name age-field
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60aeda069c8d49e1b6bc4ca96bc34e4a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=482&s=79639&e=png&b=181818)

这次生成的 sql 只包含了修改表结构的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/263be9c0f79642c7bf1ccae880a7e885~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1684&h=482&s=106419&e=png&b=1e1e1e)

在数据库中有个 _prisma_migrations 表，记录着数据库 migration 的历史：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/966c50e637734075885ac7c1d1aa22a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540&h=374&s=168626&e=png&b=efecec)

如果把这个表删掉，再次 mirgate dev 就会有前面的是否 reset 的提示了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac08e229620d4630b561324018f442e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=104&s=22468&e=png&b=191919)

如果你想手动触发reset，可以用 reset 命令：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25f8c02994ec4444a07c9b6473fa66b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=248&s=27802&e=png&b=181818)

它会清空数据然后执行所有 migration

```
prisma migrate reset
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d073ff389c6e4fe1ab01db0e92ee96ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1178&h=250&s=40671&e=png&b=191919)

会提示会丢失数据，确认后就会重置表，然后执行所有 migration：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f8338316afb484a99daf135a8a867d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1396&h=1024&s=199694&e=png&b=181818)

还会生成 client 代码，并且执行 prisma db seed 来初始化数据。

## prisma generate

generate 命令只是用来生成 client 代码的，他并不会同步数据库：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/389524ff126640cc94dba4aa11266dc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=528&s=98490&e=png&b=191919)

只是根据 schema 定义，在 node_modules/@prisma/client 下生成代码，用于 CRUD。

## prisma studio

这个是可以方便 CRUD 数据的图形界面：

```
prisma studio
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71f520804d274b1885d893700770255a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=698&h=136&s=23271&e=png&b=191919)

选择一个 model：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48c5d2f35a2342c280bb3a89a2316f17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=588&s=33259&e=png&b=ffffff)

会展示它的所有数据：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c465185b0cb470c868e6ed6c39c1e6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2196&h=432&s=65652&e=png&b=fefefe)

可以编辑记录：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14fbcdeb5cab47ab86947c781fceef91~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2276&h=466&s=66399&e=png&b=ffffff)

删除记录：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f54d499d21d4c90a4088ee4168568f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1290&h=372&s=47902&e=png&b=ffffff)

新增记录：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c390aa8733ac4bc099a1499962396671~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2490&h=390&s=85642&e=png&b=fef5f3)

不过一般我们都用 mysql workbench 来做。

## prisma validate

这个是用来检查 schema 文件是否有语法错误的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b7ea663f0eb48f4ae030e46d0669fbe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1198&h=152&s=38453&e=png&b=191919)

比如我写错一个类型，然后执行 validate：

```
prisma validate
```
会提示这里有错误：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63ed6335516b4af299f59101ed1f2b38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1428&h=1064&s=191466&e=png&b=1c1c1c)

当然，我们安装了 prisma 的插件之后，可以直接在编辑器里看到这个错误：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/807848e678334c21b1cf05cd38ad9292~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540&h=192&s=42469&e=png&b=222222)

就和 eslint 差不多。

## prisma format

这个是用来格式化 prisma 文件的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d4efddbf59a4296aa70b850d535e503~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298&h=756&s=163530&e=gif&f=27&b=1f1f1e)

当然，你安装了 prisma 的 vscode 插件之后，也可以直接用编辑器的 format：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4cedcab3cbc410cb54daf87cbf884bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1536&h=904&s=346763&e=gif&f=22&b=222222)

## prisma version

这个就是展示一些版本信息的，比较简单：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b7848d2360d44a49fa8f513bee2062e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1322&h=340&s=89218&e=png&b=191919)

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