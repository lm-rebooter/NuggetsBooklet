我们学了 Prisma 的命令、schema 的语法，这节来过一遍 Prisma Client 的 api。

这节只涉及单个表的 CRUD 的 api。

创建个新项目：

```
mkdir prisma-client-api
cd prisma-client-api
npm init -y
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8927d892bc04c8f95ac37a8fa63ab68~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=870&h=700&s=88483&e=png&b=000000)

进入项目，执行 init 命令：

```
npx prisma init
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29216dde7e8e40be94a8a27f85f0c4af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=624&s=105602&e=png&b=191919)

生成了 .env 和 schema 文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e97117aa3ef49aabf9227ec19601c79~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=484&h=276&s=27131&e=png&b=181818)

然后改下 .env 文件的数据库连接信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9260844466e7496fa11bdf18a5da4e14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=348&s=134798&e=png&b=202020)

```
DATABASE_URL="mysql://root:guang@localhost:3306/prisma_test"
```

改一下 datasource 的 provider 为 mysql，并且添加一个 model

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3627436dc9b44b1980c166c9aab0b952~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=554&s=75992&e=png&b=1f1f1f)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Aaa {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

然后再添加一个 generator，生成 docs，并且修改下生成代码的位置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aea5f82f5ced4488bd21ef081c19d1c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=926&h=744&s=108104&e=png&b=1f1f1f)

```
generator docs {
  provider = "node node_modules/prisma-docs-generator"
  output   = "../generated/docs"
}
```

安装用到的 generator 包：
```
npm install --save-dev prisma-docs-generator
```
之后执行 migrate reset 重置下：

```
npx prisma migrate reset
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e525d0d9692940caac47a3a05eac11f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072&h=622&s=88219&e=png&b=191919)

之后用 migrate dev 创建新的迁移：

```
npx prisma migrate dev --name aaa
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d18cf9ff25e54fe6817d96222111560b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=524&s=82026&e=png&b=191919)

可以看到，生成了 client 代码、docs 文档，还有 sql 文件。

数据库中也多了这个表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2258e881e16492fa0fdf673288e9ce4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=576&s=178048&e=png&b=eeebea)

然后我们写下初始化数据的代码：

首先安装 ts、ts-node 包：

```
npm install typescript ts-node @types/node --save-dev
```
创建 tsconfig.json

```
npx tsc --init
```
把注释删掉，保留这些配置就行：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "types": ["node"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}

```
在 package.json 配置下 seed 命令：

```json
"prisma": {
    "seed": "npx ts-node prisma/seed.ts"
},
```
然后写下 prisma/seed.ts

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
    await prisma.aaa.createMany({
        data: [
            {
                name: 'aaa',
                email: 'aaa@xx.com'
            },
            {
                name: 'bbb',
                email: 'bbb@xx.com'
            },
            {
                name: 'ccc',
                email: 'ccc@xx.com'
            },
            {
                name: 'ddd',
                email: 'ddd@xx.com'
            },
            {
                name: 'eee',
                email: 'eee@xx.com'
            },
        ]
    });
    console.log('done');
}

main();
```
很容易看懂，就是插入了 5 条记录。

执行 seed：

```
npx prisma db seed
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/686017ea7d974af1a6099bd45090b1f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=276&s=58495&e=png&b=181818)

打印了插入数据的 sql。

去 mysql workbench 里看下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69e797612cdd4212a1870bfcecaca825~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=510&s=160843&e=png&b=eeeae8)

插入成功了。

然后来写下 client 的 crud 代码。

创建 src/index.ts

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
    
}

main();
```

client 都有哪些方法呢？

我们不是还用 docs generator 生成了文档么？看下那个就知道了。

```
npx http-server ./generated/docs
```
跑一个静态服务：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/155c61bbec674cb7b3b517a2c94d6263~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=760&h=494&s=84095&e=png&b=181818)

访问 http://localhost:8080 可以看到 Aaa 的字段和方法，一共 9 个方法：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/448cbf3c64ea4bbba5af4c24124e4df4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518&h=1112&s=169522&e=png&b=ffffff)

我们依次试一下：

## findUnique

findUnique 是用来查找唯一的记录的，可以根据主键或者有唯一索引的列来查：

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

async function test1() {
    const aaa = await prisma.aaa.findUnique({
        where: {
            id: 1
        }
    });
    console.log(aaa);

    const bbb = await prisma.aaa.findUnique({
        where: {
            email: 'bbb@xx.com'
        }
    });
    console.log(bbb);
}

test1();
```
所以，这里的 id、email 都可以：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af97ee8cd6824c95a5d0499111c25b4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=726&h=220&s=31608&e=png&b=1f1f1f)

跑一下试试：

```
npx ts-node ./src/index.ts
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c17ddadffce045acb1d4f36d59812191~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=222&s=62804&e=png&b=191919)

但是如果指定 name 就不行了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecd8795097a44959ad84f2ffab871bb0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=562&h=242&s=27950&e=png&b=202020)

因为通过 name 来查并不能保证记录唯一。

你还可以通过 select 指定返回的列：

```javascript
async function test1() {
    const aaa = await prisma.aaa.findUnique({
        where: {
            id: 1
        }
    });
    console.log(aaa);

    const bbb = await prisma.aaa.findUnique({
        where: {
            email: 'bbb@xx.com'
        },
        select: {
            id: true,
            email: true
        }
    });
    console.log(bbb);
}
```

比如我通过 select 指定返回 id、email：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c1252b339db4a27a55025ddae309849~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=218&s=56218&e=png&b=191919)

那结果里就只包含这两个字段。

## findUniqueOrThrow

findUniqueOrThrow 和 findUnique 的区别是它如果没找到对应的记录会抛异常，而 findUnique 会返回 null。

先试下 findUnique：

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
    const aaa = await prisma.aaa.findUnique({
        where: {
            id: 10
        }
    });
    console.log(aaa);
}

test2();
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87f289e0f283403e992e1c3feb48f517~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=686&s=105718&e=png&b=1d1d1d)

再换成 findUniqueOrThrow 试试：

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
    const aaa = await prisma.aaa.findUniqueOrThrow({
        where: {
            id: 10
        }
    });
    console.log(aaa);
}

test2();
```

如果没找到会抛异常：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9eec40cb4e445bebf8b878abc741d66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=748&s=128181&e=png&b=1d1d1d)

## findMany

findMany 很明显是查找多条记录的。

比如查找 email 包含 xx 的记录，按照 name 降序排列：

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

async function test3() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        }
    });
    console.log(res);
}

test3();

```

跑一下：
```
npx ts-node ./src/index.ts
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f77efa5cabd4110ac425ce293950368~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=310&s=60018&e=png&b=181818)

然后再加个分页，取从第 2 条开始的 3 条。

```javascript
async function test3() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
```
下标是从 0 开始的，所以是这三条：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7f029c71fc64398a24adcd2cfc3937c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=824&h=272&s=49555&e=png&b=181818)

当然，你可以再加上 select 指定返回的字段：

```javascript
async function test3() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        select: {
            id: true,
            email: true,
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/619979abd71149e9a279a21ce941ccdd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=246&s=47141&e=png&b=181818)

你会发现熟练 sql 之后，这些 api 用起来都很自然，过一遍就会了。

## findFirst

findFirst 和 findMany 的唯一区别是，这个返回第一条记录。

```javascript
async  function test4() {
    const res = await prisma.aaa.findFirst({
        where: {
            email: {
                contains: 'xx'
            }
        },
        select: {
            id: true,
            email: true,
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
test4();
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a3d3aa449a440dfbc5946c0aafd6af2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=714&h=146&s=34628&e=png&b=191919)

此外，where 条件这里可以指定的更细致：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/239d3681eed74917b35e7d0cf38f3926~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=726&h=650&s=59985&e=png&b=1f1f1f)

contains 是包含，endsWith 是以什么结尾

gt 是 greater than 大于，lte 是 less than or equal 大于等于

这些过滤条件都很容易理解，就不展开了。

此外，还有 findFirstOrThrow 方法，那个也是如果没找到，抛异常，参数和 FindFirst 一样。

## create

这个我们用过多次了，用来创建记录：

```javascript
async  function test5() {
    const res = await prisma.aaa.create({
        data: {
            name: 'kk',
            email: 'kk@xx.com'
        },
        select: {
            email: true
        }
    });
    console.log(res);
}
test5();
```
它同样也可以通过 select 指定插入之后再查询出来的字段。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c63f821b7a9845e385f3bb4b74c8ccb7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=706&h=224&s=53669&e=png&b=191919)

createMany 我们用过，这里就不测了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94f7b2748f9498787cd63dd828c6025~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=688&h=980&s=92858&e=png&b=1f1f1f)

## update

update 明显是用来更新的。

它可以指定 where 条件，指定 data，还可以指定 select 出的字段：

```javascript
async function test6() {
    const res = await prisma.aaa.update({
        where: { id: 3 },
        data: { email: '3333@xx.com' },
        select: {
            id: true,
            email: true
        }
    });
    console.log(res);
}

test6();
```
跑一下：
```
npx ts-node ./src/index.ts
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b559edb67e0247a78566066a68a39d19~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=302&s=66957&e=png&b=191919)

可以看到，打印了 3 条 sql：

首先根据 where 条件查询出这条记录，然后 update，之后再 select 查询出更新后的记录。

updateMany 自然是更新多条记录。

比如你想更新所有邮箱包含 xx.com 的记录为 666@xx.com

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d5f1d297acf42f28f220bff549b3442~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=680&h=490&s=51454&e=png&b=1f1f1f)

用 update 会报错，它只是用来更新单条记录的，需要指定 id 或者有唯一索引的列。

这时候改成 udpateMany 就可以了。

```javascript
async function test7() {
    const res = await prisma.aaa.updateMany({
        where: { 
            email: {
                contains: 'xx.com'
            } 
        },
        data: { name: '666' },
    });
    console.log(res);
}

test7();
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ae34da887644228b96e35065eed5b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=766&h=182&s=35654&e=png&b=181818)

在 mysql workbench 里可以看到，确实改了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b450063af6f443cbbe3148db3cab91c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=558&h=362&s=91564&e=png&b=fafafa)

## upsert

upsert 是 update 和 insert 的意思。

当传入的 id 有对应记录的时候，会更新，否则，会创建记录。

```javascript
async function test8() {
    const res = await prisma.aaa.upsert({
        where: { id: 11 },
        update: { email: 'yy@xx.com' },
        create: { 
            id:  11,
            name: 'xxx',
            email: 'xxx@xx.com'
        },
    });
    console.log(res);
}

test8();
```
第一次跑执行的是 insert：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f322a5842c748c6a325970c04f0163e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884&h=298&s=67052&e=png&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a1c34df17d94668988ed26cdf77c744~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=606&h=376&s=101801&e=png&b=f9f9f9)

第二次跑就是 update 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/570a0212a0284695b4941bb4a4d298be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832&h=306&s=67081&e=png&b=191919)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b69089861bf14b349c213a15fa6e3bca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=542&h=300&s=76891&e=png&b=fcfcfc)

## delete

delete 就比较简单了，我们和 deleteMany 一起测试下：

```javascript
async function test9() {
    await prisma.aaa.delete({
        where: { id: 1 },
    });

    await prisma.aaa.deleteMany({
        where: {
            id: {
                in: [11, 2]
            }
        }
    });
}

test9();
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f00108df717445488fe1cdc11245e0f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1310&h=242&s=72029&e=png&b=191919)

可以看到有两条 delete 语句。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a15026f6da7d4dabb5f9127292d03cee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=736&h=418&s=103698&e=gif&f=17&b=f8f8f8)

可以看到 3 条记录都被删除了。

## count

count 其实和 findMany 参数一样，只不过这里不返回具体记录，而是返回记录的条数。

比如 findMany 是这样的：

```javascript
async function test10() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
test10();
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57fb1afa9463410eb26ed5daa5b05406~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=730&h=254&s=42719&e=png&b=181818)

把 findMany 改为 count 就是这样了：

```javascript
async function test10() {
    const res = await prisma.aaa.count({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
test10();
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa3e688b042c4f6ea6c5ef3bd8e12e5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=720&h=144&s=27187&e=png&b=181818)

## aggregate 

aggregate 是统计相关的。

它除了 where、orderBy、skip、take 这些参数外，还可以指定 _count、_avg、_sum、_min、_max
这些。

不过我们现在的表里没有数字相关的列。

改一下 model：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2661d3c4f5444433972546f4f499e7f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=814&h=510&s=70599&e=png&b=1f1f1f)

```
model Aaa {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  age Int       @default(0)
}
```

然后创建一个新的 migration：

```
npx prisma migrate dev --name bbb
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc6ee6e6538f43b8b850f06d452b21c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=524&s=87138&e=png&b=181818)

对应的 sql 如下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d282df2c9837454d825e4d8f6d6fc642~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1598&h=372&s=85466&e=png&b=1e1e1e)

然后我们用代码改一下：

```javascript
async function test11() {
    await prisma.aaa.update({
        where: {
            id: 3
        },
        data: {
            age: 3
        }
    });

    await prisma.aaa.update({
        where: {
            id: 5
        },
        data: {
            age: 5
        }
    });
}
test11();
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96087511c92d41aa86ef7457be55fb44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=522&s=124326&e=png&b=191919)

在 mysql workbench 里刷新下，可以看到确实改了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4ff325c8e714542a3e24cac64bde57e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=668&h=302&s=78342&e=png&b=f9f9f9)

接下来就可以测试 aggregate 方法了：

```javascript
async function test12() {
    const res = await prisma.aaa.aggregate({
        where: {
            email: {
                contains: 'xx.com'
            }
        },
        _count: {
            _all: true,
        },
        _max: {
            age: true
        },
        _min: {
            age: true
        },
        _avg: {
            age: true
        }
    });
    console.log(res);
}
test12();
```

跑一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba51d2dc388d4765b132bdc9baacc2d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=272&s=42847&e=png&b=181818)

可以看到返回的最大值、最小值、计数、平均值，都是对的。

## groupBy

最后还有个 groupBy 方法，大家有 sql 基础也很容易搞懂，这个就是分组的。

```javascript
async function test13() {
    const res = await prisma.aaa.groupBy({
        by: ['email'],
        _count: {
          _all: true
        },
        _sum: {
          age: true,
        },
        having: {
          age: {
            _avg: {
              gt: 2,
            }
          },
        },
    })
    console.log(res);
}

test13();

```
就是按照 email 分组，过滤出平均年龄大于 2 的分组，计算年龄总和返回。

结果如下：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9859da852ff044d1bca8e1b2d44b7b12~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=216&s=48182&e=png&b=181818)

因为 age 大于 2 的就 2 条，然后算平均值、计数，就是上面的结果了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cf5f033140f44cd8132804fa0044d04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=702&h=254&s=61142&e=png&b=fcfcfc)

这样，我们就把所有 Prisma Client 的 api 过了一遍。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/prisma-client-api)

## 总结

这节我们过了一遍 Prisma Client 的单个表 CRUD 的 api。

分别包括 create、crateMany、update、updateMany、delete、deleteMany、findMany、findFirst、findFirstOrThrow、findUnique、findUniqueOrThrow。

以及 count、aggregate、groupBy 这些统计相关的。

其实有 sql 的基础的话，学习这些 api 很容易，过一遍就会了。
