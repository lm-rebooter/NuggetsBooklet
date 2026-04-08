我们学 Prisma，最终还是要和 Nest 结合用的，就像我们学 TypeORM 时那样。

其实也很简单，还是基于 schema 生成 client 的 api，然后调用这些 api 来 CRUD。

只不过 Nest 里的调用方式不大一样。

我们新建个 nest 项目：

```
nest new nest-prisma-test
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/089216ef997c41be989759f60a74b76e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=846&h=666&s=266810&e=png&b=020202)

进入项目，安装 prisma

```
npm install prisma --save-dev
```
然后执行 init 创建 schema 文件：

```
npx prisma init
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea10e80f6fd04d7892d98c540a50c1ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=504&s=98914&e=png&b=181818)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3209bcf5edca44bb8d55d080464cfb3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=536&s=111764&e=png&b=1d1d1d)

改下 .env 的配置：

```
DATABASE_URL="mysql://root:guang@localhost:3306/prisma_test"
```
并且修改下 schema 里的 datasource 部分：

```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

```

然后创建 model：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c549d1d792aa4eb8b177c67ae9a7faee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1406&h=920&s=183023&e=png&b=1f1f1f)

```
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

这里就是 Department、Employee 两个 model，之间是一对多的关系。

然后先 migrate reset，重置下数据库：

```
npx prisma migrate reset 
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb18945e33674215bf629c4c44146940~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=584&s=89806&e=png&b=191919)

然后创建新的 migration:

```
npx prisma migrate dev --name init
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dee7c45a681f432596ed1a5e94d49477~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=498&s=77658&e=png&b=191919)

这时候数据库就就有这两个表了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9dce99f9e864813855eecba63ed88a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1088&h=428&s=135687&e=png&b=eceae9)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c81ec506a8b4421bb748af4c2077f83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=396&s=122940&e=png&b=eeebeb)

外键约束也创建好了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff8151898fa241e3acc44f4964299c6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1822&h=358&s=112063&e=png&b=f2f0f0)

并且 migrate dev 还会生成 client 代码，接下来我们就可以直接来做 CRUD 了。

问题来了：之前我们都是直接 ts-node 跑的一个脚本，里面调用 client 的 api 来做 CRUD，现在和 Nest 集成后怎么做呢？

很简单，创建个 Service 就好了。

```
nest g service prisma --flat --no-spec
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e373e6c5051744d6b466a0cc0af56f12~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=692&h=94&s=27645&e=png&b=191919)

改下 PrismaService，继承 PrismaClient，这样它就有 crud 的 api 了：

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

然后再创建两个 service：

```
nest g service department --flat --no-spec
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76f386beb84444cdb5a33d6d2905e232~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=736&h=94&s=25816&e=png&b=191919)

```
nest g service employee --flat --no-spec
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ae95fadb1c540c192b28663542c0152~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=686&h=106&s=30956&e=png&b=191919)

这俩 service 里注入 PrismaService，不就可以 CRUD 了么？

改下 DepartmentService：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {

    @Inject(PrismaService)
    private prisma: PrismaService;

    async create(data: Prisma.DepartmentCreateInput) {
        return await this.prisma.department.create({
            data,
            select: {
                id: true
            }
        });
    }
}
```
插入数据之后，再把 id 查询出来返回。

这里的 data 的 ts 类型不用自己定义，生成的 client 代码里有。

输入 Prisma.Deparment 就会提示出来

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed0d441e0e0648e49f8f22a26e29c1ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=408&s=104579&e=png&b=202020)

还有 EmployeeService：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {

    @Inject(PrismaService)
    private prisma: PrismaService;

    async create(data: Prisma.EmployeeCreateInput) {
        return await this.prisma.employee.create({
            data,
            select: {
                id: true
            }
        });
    }
}

```
也定义了 create 方法。

然后在 AppController 里注入这俩 service：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64bbe39372e04d8884c7a31b839ae9c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=1060&s=180016&e=png&b=1f1f1f)

声明一个 create 的路由，里面创建一个 department，再创建一个 employee。

empolyee 通过 id 关联这个 department。

```javascript
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { DepartmentService } from './department.service';
import { EmployeeService } from './employee.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Inject(DepartmentService)
  private departmentService: DepartmentService;

  @Inject(EmployeeService)
  private employeeService: EmployeeService;

  @Get('create')
  async create() {
    const department = await this.departmentService.create({
      name: '技术部'
    });

    await this.employeeService.create({
      name: '张三',
      phone: '13222222222',
      department: {
        connect: {
          id: department.id
        }
      }
    });

    return 'done';
  }
}
```
把 nest 项目跑起来：

```
npm run start:dev
```
浏览器访问下 http://localhost:3000/create

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97accd6e7c8844c4a2a108dfe1ed31b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=636&h=212&s=17925&e=png&b=ffffff)

生成了 2 条 insert 语句：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82fe7c328ea74a11919c048fd0c18ebe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1362&h=616&s=209330&e=png&b=181818)

在 mysql workbench 里也可以看到插入的 2 条记录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a32a07bb02346e4ab1746333f0c3f0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=196&s=58378&e=png&b=f8f8f8)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e75179a690674f8ca1cb536ec795c181~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=572&h=226&s=39386&e=png&b=f6f6f6)

这样，prisma 和 nest 的集成就完成了。

当然，我们只是测试了 create 方法，其余的 api 也是一样的，就不展开了。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-prisma-test)

## 总结

这节我们做了 Prisma 和 Nest 的集成。

其实还是先用 prisma init 创建 schema 文件，然后修改 model 后用 prisma migrate dev 同步到数据库和生成 client 代码。

只不过之后使用 client 代码的方式不同。

我们创建了个 Service 继承 PrismaClient，在 constructor 里设置初始化参数。

之后把这个 service 的实例注入到别的 service 里，就可以做 CRUD 了。

这样，Prisma 怎么和 Nest 集成，我们就学会了。
