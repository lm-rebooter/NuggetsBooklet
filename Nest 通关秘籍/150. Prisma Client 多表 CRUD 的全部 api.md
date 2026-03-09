上节我们过了一遍 Prisma Client 做 CRUD 的 api，但那只是针对单表的，这节我们把涉及到多表的 CRUD 的 api 过一遍。

创建个新项目：

```bash
mkdir prisma-client-api2 
cd prisma-client-api2 
npm init -y
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2d719a533be44b8968b41c74b03946d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=890&h=702&s=91178&e=png&b=000000)

进入项目，执行 init 命令：

```csharp
npx prisma init
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29216dde7e8e40be94a8a27f85f0c4af~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1010&h=624&s=105602&e=png&b=191919)

生成了 .env 和 schema 文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51cd28df37d6483abc67cffc76b7cc3e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=512&h=192&s=18392&e=png&b=1e1e1e)

然后改下 .env 文件的数据库连接信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9260844466e7496fa11bdf18a5da4e14~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1026&h=348&s=134798&e=png&b=202020)

```ini
DATABASE_URL="mysql://root:guang@localhost:3306/prisma_test"
```

改一下 datasource 的 provider 为 mysql，并且添加 model

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f083c8dc5c741679379620c15723342~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1358&h=956&s=184756&e=png&b=1f1f1f)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Department {
  id        Int    @id @default(autoincrement())
  name      String  @db.VarChar(20)
  createTime DateTime @default(now())
  updateTime DateTime @updatedAt
  employees     Employee[]
}

model Employee {
  id         Int       @id @default(autoincrement())
  name      String     @db.VarChar(20)
  phone     String     @db.VarChar(30)  

  deaprtmentId Int
  department     Department      @relation(fields: [deaprtmentId], references: [id])
}
```

之后执行 migrate reset 重置下：

```perl
npx prisma migrate reset
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e525d0d9692940caac47a3a05eac11f7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1072&h=622&s=88219&e=png&b=191919)

然后用 migrate dev 创建新的迁移：

```css
npx prisma migrate dev --name aaa
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9a0b116589243d2af8cf1c55ea02d1b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1188&h=560&s=87234&e=png&b=191919)

生成了 client 代码，还有 sql 文件。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a129c832d88b4cd1ae85015353b95a20~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2034&h=1060&s=291405&e=png&b=1e1e1e)

数据库中也多了这 2 个表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55197603cc2d40a089abacdd197abea1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1070&h=484&s=156945&e=png&b=f0eded)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f087fe832374ad8b88c5f9e684e350c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1012&h=406&s=114606&e=png&b=f0eded)

然后来写下 client 的 crud 代码。

首先安装 ts、ts-node 包：

```sql
npm install typescript ts-node @types/node --save-dev
```

创建 tsconfig.json

```csharp
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

然后分别做下 CRUD。

首先是插入数据：

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
   await prisma.department.create({
        data: {
            name: '技术部',
            employees: {
                create: [
                    {
                        name: '小张',
                        phone: '13333333333'
                    },
                    {
                        name: '小李',
                        phone: '13222222222'
                    }
                ]
            }
        }
   })
}

test1();
```

插入关联 model 的数据的时候，也是用 create 指定：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/634ccb2291f44010a91f42fad5191a15~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=922&h=880&s=93789&e=png&b=1f1f1f)

测试下：

```bash
npx ts-node ./src/index.ts
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99422760137c4c939fd32afd811a17b8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1374&h=242&s=81019&e=png&b=191919)

在 mysql workbench 里看下结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e20e8a26e5254d6aadcaea6853bcd75e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1306&h=452&s=146375&e=png&b=f0eded)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/393d9cb0043f4d2eb89d4e90687e6887~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1074&h=454&s=144846&e=png&b=efeceb)

确实，数据都被正确插入了。

当然，你也可以用这种写法：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6fde3edfc2b49e3b2194a0d2ece5e6a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=904&h=868&s=93803&e=png&b=1f1f1f)

```javascript
async function test2() {
    await prisma.department.create({
         data: {
             name: '技术部',
             employees: {
                 createMany: {
                    data: [
                        {
                            name: '小王',
                            phone: '13333333333'
                        },
                        {
                            name: '小周',
                            phone: '13222222222'
                        }
                    ],

                 }
             }
         }
    })
}

test2();
```

跑一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86cba5416ddc402c9d29b8f0d01ceb4a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=912&h=210&s=55131&e=png&b=191919)

效果一样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/394a883a6ee04d4499305daa12653dac~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=796&h=204&s=75130&e=png&b=fbfbfb)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a4e6050a5af47b3aaafd7820f7959ca~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=580&h=306&s=71258&e=png&b=f8f8f8)

那如何关联查询呢？

可以这样写：

```javascript
async function test3() {
    const res1 = await prisma.department.findUnique({
        where: {
            id: 1
        },
        include: {
            employees: true
        }
    });
    console.log(res1);

    const res2 = await prisma.department.findUnique({
        where: {
            id: 1
        },
        include: {
            employees: {
                where: {
                    name: '小张'
                },
                select: {
                    name: true
                }
            }
        }
    });
    console.log(res2);

    const res3 = await prisma.department.findUnique({
        where: {
            id: 1
        }
    }).employees();
    console.log(res3);
}

test3();
```

查询 department 的时候，通过 include 指定关联查询出 employees。

include 还可以指定 where 等查询的参数，进一步过滤。

此外，你也可以在查出 department 后调用 empolyees() 方法来查询。

可以看到，都能正确查出关联数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/483173bf0da443ada07efb5a0dc36b61~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1164&h=934&s=202146&e=png&b=191919)

再就是关联更新：

```javascript
async function test4() {
    const res1 = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                create: [
                    {
                        name: '小刘',
                        phone: '13266666666'
                    }
                ]
            }
        }
    });
    console.log(res1);
}

test4();
```

比如我在更新 department 的时候关联插入了一条 employee 的记录。

跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef0fdb1edee04269a19ffe5d9bab87ce~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1078&h=442&s=97332&e=png&b=181818)

在 mysql workbench 里可以看到，id 为 1 的 department 更新了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f714834fc2ee442b8daee35721af79bd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=824&h=224&s=69443&e=png&b=f7f7f7)

关联插入了一条 employee 的记录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b95da0f1b5624d1a84b72e659dbd33d4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=566&h=334&s=79102&e=png&b=f7f7f7)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8fe049ad64a4c53ae8ad7e66705aee9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=582&h=312&s=86589&e=png&b=f9f9f9)

更新 department 的时候，除了可以插入 empolyee 的数据，也可以和别的 empolyee 建立关联。

比如 id 为 4 的 empolyee：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cbfe2b5b54b4bd48b4aae7306894b6c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=566&h=348&s=87349&e=png&b=f9f9f9)

现在他关联的是 id 为 2 的 department。

我们 update 的时候使用 connect 和它关联：

```javascript
async function test5() {
    const res1 = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                connect: [
                    {
                        id: 4
                    }
                ]
            }
        }
    });
    console.log(res1);
}
test5();
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45b36288047e45b185047c5913776413~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=848&h=770&s=89854&e=png&b=1f1f1f)

跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/502561f1da854860b6baf9a8159191d7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=828&h=442&s=88252&e=png&b=181818)

刷新可以看到，id 为 4 的 employee 关联的 department 就变了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d001d81bf504470792dd59b534139231~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=570&h=314&s=85581&e=png&b=fafafa)

如果是某个 id 的数据存在就 connect，不存在就 create 呢？

可以这样写：

```javascript
async function test6() {
    const res1 = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                connectOrCreate: {
                    where: {
                        id: 6
                    },
                    create: {
                        id: 6,
                        name: '小张',
                        phone: '13256665555'
                    }
                }
            }
        }
    });
    console.log(res1);
}
test6();
```

第一次跑，执行的是 insert：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d7ca69a88d64e40bb52bf841560fd2c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=890&h=484&s=99574&e=png&b=181818)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/624fbc54470b4f1fb349cdfc8c13aee0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=552&h=342&s=95419&e=png&b=fafafa)

第二次跑，就是 update 了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d52d7347cdc4d0280cb3a54f30561ba~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1222&h=496&s=112662&e=png&b=181818)

也就是说，update 的时候可以通过 create、connect、connectOrCreate 来插入新的关联 model 的记录或者关联已有的记录。

当然，create 的时候也可以这样：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c53b43c1124444939e8ed8bcf99ef7b7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=658&h=386&s=54689&e=png&b=202020)

效果一样，就不一个个测试了。

再就是删除：

如果我们想删除 id 为 1 的 department 的所有 empolyee，可以这样写：

```javascript
async function test7() {
    await prisma.employee.deleteMany({
        where: {
            department: {
                id: 1
            }
        },
    });
}
test7();
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/767766da6f174af2a443da2fdb9a75c7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=892&h=148&s=37877&e=png&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f916a94bfa2745648c0b6c3ba2f94e7d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=706&h=378&s=100166&e=gif&f=18&b=f7f7f7)

这就是多个 model 关联时的 CRUD。

此外，Prisma 还可以直接执行 sql：

```javascript
async function test8() {
    await prisma.$executeRaw`TRUNCATE TABLE Employee`;

    const res = await prisma.$queryRaw`select * from Department`;
    console.log(res);
}
test8();
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c7d176c1f8444d0975bc83e700e67a3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=708&h=502&s=68097&e=png&b=181818)

这样，当上面的 api 都不能满足需求的时候，你就可以直接执行 sql。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/prisma-client-api2)

## 总结

这节我们过了一遍多 model 关联的时候涉及到多个表的 CRUD 方法。

还是 findXxx、updateXxx、deleteXxx、createXxx 那些方法，只不过查询的时候可以通过 include 包含关联记录，新增修改的时候可以通过 create、connect、connectOrCreate 来关联或者插入记录。

此外，你还可以直接执行 sql。

通过这些 api，我们就能完成各种 CRUD 需求了。