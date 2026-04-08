这节正式进入开发，我们先来开发注册功能。

在 docker desktop 里把 mysql 的容器跑起来：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f88a32bf05364377b78fa25ca8a5f49d~tplv-k3u1fbpfcp-watermark.image?)

安装 prisma

```
npm install prisma --save-dev
```
然后执行 prisma init 创建 schema 文件：

```
npx prisma init
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea10e80f6fd04d7892d98c540a50c1ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=504&s=98914&e=png&b=181818)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92cd7c967458498ba039c9080c3b66ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=562&s=127603&e=png&b=1d1d1d)

改下 .env 的配置：

```
DATABASE_URL="mysql://root:你的密码@localhost:3306/exam-system"
```
并且修改下 schema 里的 datasource 部分：

```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

然后创建 model。

前面分析过用户表的结构：

| 字段名 | 数据类型 | 描述 |
| --- | --- | --- |
| id | INT | 用户ID |
| username | VARCHAR(50) |用户名 |
| password | VARCHAR(50) |密码 |
| email | VARCHAR(50) | 邮箱 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

创建对应的 modal：

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id  Int @id @default(autoincrement())
  username String @db.VarChar(50) @unique
  password String @db.VarChar(50)
  email String @db.VarChar(50)
  createTime DateTime @default(now())
  updateTime DateTime @updatedAt
}
```
这里 username 要添加唯一约束。

在 mysql workbench 里创建 exam-system 的数据库：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a55f4d1641404128a610b9ac2d6b0b55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1380&h=830&s=206439&e=png&b=e7e6e6)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5e1443f29f54943a3d6d620d001d3bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=482&h=490&s=80862&e=png&b=e6e1e1)

先 migrate reset，重置下数据库：

```
npx prisma migrate reset 
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb18945e33674215bf629c4c44146940~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=584&s=89806&e=png&b=191919)

然后创建新的 migration:

```
npx prisma migrate dev --name user
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29dc35c3dae7474489ad14a0a24a6ffe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=568&s=89459&e=png&b=191919)

这时就生成了迁移文件，包含创建 user 表的 sql 语句：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a34b9a04eda42098311e652d8dddbbb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1744&h=656&s=195447&e=png&b=1d1d1d)

在 mysql workbench 里可以看到创建好的 user 表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb6a48b8048b44f58797eb74503b6461~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1502&h=670&s=295894&e=png&b=f0eded)

并且 migrate dev 还会生成 client 代码，接下来我们就可以直接来做 CRUD 了。

创建个公共 lib

```
nest g lib prisma
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b0c53a033d44393acfc48d8b04197ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=304&s=78226&e=png&b=191919)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf10dd6217304b8a9bb7699c7f141296~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=696&h=668&s=99966&e=png&b=1f1f1f)

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

这样各处就都可以注入 PrismaService 用了。

在 user 微服务引入 PrismaModule：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/385ec6f87cdf472fb5f1d2bead6256ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1498&h=634&s=183164&e=png&b=1d1d1d)

然后在 UserService 里注入 PrismaService 来做 crud：

```javascript
import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private prisma: PrismaService;

  async create(data: Prisma.UserCreateInput) {
      return await this.prisma.user.create({
          data,
          select: {
              id: true
          }
      });
  }
}
```
写代码的时候你会发现，参数的类型 prisma 都给你生成好了，直接用就行：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1834efcc33ae466f81465725f602300b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=504&s=115981&e=png&b=202020)

我们这节实现注册：

在 UserController 增加一个 post 接口：

```javascript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
      return await this.userService.create(registerUser);
  }
}
```

创建 dto/register-user.dto.ts

```javascript
export class RegisterUserDto{
    username: string;

    password: string;

    email: string;

    captcha: string;
}
```

把服务跑起来：

```
npm run start:dev user
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01e91a3b37bd40bbbdd41b3c1f86624f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1572&h=468&s=187058&e=png&b=181818)

在 postman 里调用下试试：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7082670390ce4dd48515dc4581f2c71c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=814&s=94455&e=png&b=fcfcfc)

```javascript
{
    "username": "guang",
    "password": "123456",
    "email": "xxxx@xx.com",
    "captcha": "abc123"
}
```
报错了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1e3531117fb4478b3bfcb2d0d24dae3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=576&s=78752&e=png&b=181818)

数据库中没有 captcha 的字段。

我们要在调用 service 之前删掉它：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52596b589ef24acc819c044ae2fdbc7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=552&s=138866&e=png&b=1f1f1f)

再试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac7faa8c7958422482b76347df320391~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=788&s=81873&e=png&b=fcfcfc)

服务端打印了 insert 的 sql 语句：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f8009d7d5a4a4e9d626c21081569fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1640&h=758&s=333089&e=png&b=181818)

数据库里也可以看到这条记录：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94237e480c1d40f38b36e09bb1c5abaa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1558&h=330&s=134736&e=png&b=f0eded)

然后加一下 ValidationPipe，来对请求体做校验。

安装用到的包：

```
npm install --save class-validator class-transformer
```

全局启用 ValidationPipe：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daa1214949784800ab70e38a1e8fa6bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1454&h=808&s=223745&e=png&b=1d1d1d)

```javascript
app.useGlobalPipes(new ValidationPipe());
```

然后加一下校验规则：

```javascript
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto {

    @IsNotEmpty({
        message: "用户名不能为空"
    })
    username: string;
    
    @IsNotEmpty({
        message: '密码不能为空'
    })
    @MinLength(6, {
        message: '密码不能少于 6 位'
    })
    password: string;
    
    @IsNotEmpty({
        message: '邮箱不能为空'
    })
    @IsEmail({}, {
        message: '不是合法的邮箱格式'
    })
    email: string;
    
    @IsNotEmpty({
        message: '验证码不能为空'
    })
    captcha: string;
}
```
测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0110fb4139d4e2081902fd612e9cb13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=852&h=906&s=107222&e=png&b=fdfdfd)

没啥问题。

然后实现注册的逻辑。

注册的逻辑是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90fca11ff8154b31bf76cc2cea3d908a~tplv-k3u1fbpfcp-watermark.image?)

继续实现 UserService 的 register 方法：

```javascript
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {

  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  private logger = new Logger();

  async register(user: RegisterUserDto) {
      const captcha = await this.redisService.get(`captcha_${user.email}`);

      if(!captcha) {
          throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
      }

      if(user.captcha !== captcha) {
          throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
      }

      const foundUser = await this.prismaService.user.findUnique({
        where: {
          username: user.username
        }
      });

      if(foundUser) {
        throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
      }

      try {
        return await this.prismaService.user.create({
          data: {
            username: user.username,
            password: user.password,
            email: user.email
          },
          select: {
            id: true,
            username: true,
            email: true,
            createTime: true
          }
        });
      } catch(e) {
        this.logger.error(e, UserService);
        return null;
      }
  }
}
```
先检查验证码是否正确，如果正确的话，检查用户是否存在，然后用 prismaService.create 插入数据。

失败的话用 Logger 记录错误日志。

这里的 md5 方法放在 src/utils.ts 里，用 node 内置的 crypto 包实现。
```javascript
import * as crypto from 'crypto';

export function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
```
在 UserController 里调用下：

```javascript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
}
```
然后在 postman 里测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4ffe1c8dcb54248b9439d24626b7eca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=812&s=90720&e=png&b=fcfcfc)

因为还没实现发送邮箱验证码的逻辑，这里我们手动在 redis 添加一个 key：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0007b7077dc457188413ef94ed3f590~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2392&h=1504&s=175443&e=png&b=1c1c1c)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40c6cc4292084cd3998d57fe63281327~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1728&h=486&s=80193&e=png&b=1c1c1c)


测试下：

带上错误的验证码，返回验证码不正确；

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d494394726c44cf2a8747d75e76bae6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=786&s=90728&e=png&b=fcfcfc)

带上正确的验证码，注册成功：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03f7aa05ceed4fff83a62036cb8f2915~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=852&h=788&s=90184&e=png&b=fcfcfc)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fce66957b834456ac7602cd90029d09~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=864&h=846&s=103418&e=png&b=fcfcfc)
这时可以在数据库里看到这条记录：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f7a58f1db0f4f0b91ee923e4b15c168~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1508&h=324&s=159020&e=png&b=efecec)

然后我们来实现发送邮箱验证码的功能。

封装个 email 的 lib：

```
nest g lib email

```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/355392f745ae4e36b880adef2a419123~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1650&h=308&s=91285&e=png&b=181818)

安装发送邮件用的包：

```
npm install nodemailer --save
```
在 EmailService 里实现 sendMail 方法

```javascript
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    
    constructor() {
      this.transporter = createTransport({
          host: "smtp.qq.com",
          port: 587,
          secure: false,
          auth: {
              user: '你的邮箱地址',
              pass: '你的授权码'
          },
      });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: '考试系统',
          address: '你的邮箱地址'
        },
        to,
        subject,
        html
      });
    }
}
```
把邮箱地址和授权码改成你自己的。

具体怎么生成授权码，看前面的 [node 发送邮件](https://juejin.cn/book/7226988578700525605/section/7247327089496424505)那节。

引入 EmailModule：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbd7567cb64e457c9111c25594a0e3ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=652&s=135460&e=png&b=1f1f1f)

然后在 UserController 里添加一个 get 接口：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd86dec74e80421ba0a423662a6a6b8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1274&h=1166&s=288760&e=png&b=1f1f1f)

```javascript
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '@app/email';
import { RedisService } from '@app/redis';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
      const code = Math.random().toString().slice(2,8);

      await this.redisService.set(`captcha_${address}`, code, 5 * 60);

      await this.emailService.sendMail({
        to: address,
        subject: '注册验证码',
        html: `<p>你的注册验证码是 ${code}</p>`
      });
      return '发送成功';
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
}
```

测试下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ecb3198031b467d85e4f3d875506aff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1432&h=196&s=36719&e=png&b=ffffff)

邮件发送成功：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba1da0a1624a4a01bf6d79afe3df52de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=510&h=254&s=35807&e=png&b=f7f7f7)

redis 里也保存了邮箱地址对应的验证码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2532ad46d5f846ba8540f455485e04e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1446&h=452&s=70148&e=png&b=1a1a1a)

通过邮件发送验证码之后，保存到 redis，注册的时候取出邮箱地址对应的验证码来校验。

这样，整个注册的流程就完成了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d91b2715c99c4e699f00087a3fa9ca89~tplv-k3u1fbpfcp-watermark.image?)

代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exam-system)。

## 总结

这节我们引入了 prisma，封装了 prisma、email 这两个 lib。

通过 prisma 的 migrate 功能，生成迁移 sql 并同步到数据库。

此外，prisma 会生成 client 的代码，我们封装了 PrismaService 来做 CRUD。

我们实现了 /user/register 和 /user/register-captcha 两个接口。

/user/register-captcha 会向邮箱地址发送一个包含验证码的邮件，并在 redis 里存一份。

/user/register 会根据邮箱地址查询 redis 中的验证码，验证通过会把用户信息保存到表中。

这样，注册功能就完成了。
