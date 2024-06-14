上节我们实现了注册和登录，有的接口只有登录可以访问，会在 Guard 里做身份验证（Authentication）。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a196d25e18c8443cbc22a3ddb07bca43~tplv-k3u1fbpfcp-watermark.image?)

但有的接口，不只需要登录，可能还需要一定的权限，这时就需要鉴权（Authorization）。

比如管理员登录后，可以调用用户管理的接口，但普通用户登录后就不可以。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a363d08394dc4a5ab4a0d7d17aafc0c2~tplv-k3u1fbpfcp-watermark.image?)

也就是说，身份验证通过之后还需要再做一步权限的校验，也就是鉴权。

这俩单词也比较相似：身份验证（Authentication）、鉴权（Authorization）。

那怎么给不同用户分配权限呢？

最简单的方式自然是直接给用户分配权限：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/064d13d33b0442cdb9bedba7bc78dbc6~tplv-k3u1fbpfcp-watermark.image?)

比如用户 1 有权限 A、B、C，用户 2 有权限 A，用户 3 有权限 A、B。

这种记录每个用户有什么权限的方式，叫做访问控制表（Access Control List）

用户和权限是多对多关系，存储这种关系需要用户表、角色表、用户-角色的中间表。

这节我们就来实现下 ACL 的权限控制。

在数据库中创建 acl_test 的 database。

```sql
CREATE DATABASE acl_test DEFAULT CHARACTER SET utf8mb4;
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d344cc84b364bc4b0f941a4ccddeed9~tplv-k3u1fbpfcp-watermark.image?)

刷新可以看到这个 database：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d70317e2c057429c9440eb6d795d257d~tplv-k3u1fbpfcp-watermark.image?)

创建个 nest 项目：

```
nest new acl-test -p npm
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5b56ce0fbd74d6fa76fbc43d69e4861~tplv-k3u1fbpfcp-watermark.image?)

安装 typeorm 的依赖：

```
npm install --save @nestjs/typeorm typeorm mysql2
```

在 AppModule 引入 TypeOrmModule：

```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "acl_test",
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

然后添加创建 user 模块：

```
nest g resource user
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d6d66d7feca42a79ff2eabe6fa08e83~tplv-k3u1fbpfcp-watermark.image?)

添加 User 和 Permission 的 Entity：

```javascript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    username: string;

    @Column({
        length: 50
    })
    password: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}
```
User 有 id、username、password、createTime、updateTime 5 个字段。

```javascript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: string;
    
    @Column({
        length: 100,
        nullable: true
    })
    desc: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}

```
permission 有 id、name、desc、createTime、updateTime 5 个字段，desc 字段可以为空。

然后在 User 里加入和 Permission 的关系，也就是多对多：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe05ed5e3798496dad4e49c0a607b50b~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@ManyToMany(() => Permission)
@JoinTable({
    name: 'user_permission_relation'
})
permissions: Permission[] 
```

通过 @ManyToMany 声明和 Permisssion 的多对多关系。

多对多是需要中间表的，通过 @JoinTable 声明，指定中间表的名字。

然后在 TypeOrm.forRoot 的 entities 数组加入这俩 entity：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44becf70f95a4f1f9357cc722b5f8ffe~tplv-k3u1fbpfcp-watermark.image?)

把 Nest 服务跑起来试试：

```
npm run start:dev
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d91b0520440c45fabd88492fe30edd15~tplv-k3u1fbpfcp-watermark.image?)

可以看到生成了 user、permission、user_permission_relation 这 3 个表。

并且中间表 user_permission_relation 还有 userId、permissionId 两个外键。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/658d01e1a2af4e5aa7367d8d3a01ed98~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1231ccfeb4b24c9b8c2b180d4c061598~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea177aef34254a12bce1b3d650280549~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9093458e13484a90b891d94328ef7b47~tplv-k3u1fbpfcp-watermark.image?)

可以看到，3个表生成的都是对的，并且中间表的两个外键也都是主表删除或者更新时，从表级联删除或者更新。

然后我们插入一些数据，不用 sql 插入，而是用 TypeORM 的 api 来插入：

修改下 UserService，添加这部分代码：


```javascript
@InjectEntityManager()
entityManager: EntityManager;

async initData() {
    const permission1 = new Permission();
    permission1.name = 'create_aaa';
    permission1.desc = '新增 aaa';

    const permission2 = new Permission();
    permission2.name = 'update_aaa';
    permission2.desc = '修改 aaa';

    const permission3 = new Permission();
    permission3.name = 'remove_aaa';
    permission3.desc = '删除 aaa';

    const permission4 = new Permission();
    permission4.name = 'query_aaa';
    permission4.desc = '查询 aaa';

    const permission5 = new Permission();
    permission5.name = 'create_bbb';
    permission5.desc = '新增 bbb';

    const permission6 = new Permission();
    permission6.name = 'update_bbb';
    permission6.desc = '修改 bbb';

    const permission7 = new Permission();
    permission7.name = 'remove_bbb';
    permission7.desc = '删除 bbb';

    const permission8 = new Permission();
    permission8.name = 'query_bbb';
    permission8.desc = '查询 bbb';

    const user1 = new User();
    user1.username = '东东';
    user1.password = 'aaaaaa';
    user1.permissions  = [
      permission1, permission2, permission3, permission4
    ]

    const user2 = new User();
    user2.username = '光光';
    user2.password = 'bbbbbb';
    user2.permissions  = [
      permission5, permission6, permission7, permission8
    ]

    await this.entityManager.save([
      permission1, 
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8
    ])
    await this.entityManager.save([
      user1, 
      user2
    ]);
}

```
注入 EntityManager，实现权限和用户的保存。

aaa 增删改查、bbb增删改查，一个 8 个权限。

user1 有 aaa 的 4 个权限，user2 有 bbbb 的 4 个权限。

调用 entityManager.save 来保存。

然后改下 UserController：

```javascript
@Get('init')
async initData() {
    await this.userService.initData();
    return 'done'
}
```
添加 init 的路由。

浏览器访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e7ba556235844e997cadab8dcb57345~tplv-k3u1fbpfcp-watermark.image?)

服务端打印了一堆 sql，包了一层事务：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89fe670fa90f41ae8912e2f6403d5ac6~tplv-k3u1fbpfcp-watermark.image?)

分别向 user、permission、user_permission_relation 中插入了数据。

我们在 mysql workbench 里刷新下：

permission 表插入了 8 条权限记录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e3c16d3526a47619b6d004ea9437296~tplv-k3u1fbpfcp-watermark.image?)

user 表插入了 2 条用户记录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c81915c173346448ba2ccf224332861~tplv-k3u1fbpfcp-watermark.image?)

中间表插入了 8 条记录，两个用户各拥有 4 个权限：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d8480ea103449cab6f6d9c9970d6940~tplv-k3u1fbpfcp-watermark.image?)

然后我们再实现登录的接口，这次通过 session + cookie 的方式。

安装 session 相关的包：

```
npm install express-session @types/express-session
```

在 main.ts 里使用这个中间件：

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'guang',
    resave: false,
    saveUninitialized: false
  }));
  await app.listen(3000);
}
bootstrap();
```
secret 是加密 cookie 的密钥。

resave 是 session 没变的时候要不要重新生成 cookie。

saveUninitialized 是没登录要不要也创建一个 session。

然后在 UserController 添加一个 /user/login 的路由：

```javascript
@Post('login')
login(@Body() loginUser: LoginUserDto, @Session() session){
    console.log(loginUser)
    return 'success'
}
```
然后先去创建 dto 对象：

```javascript
export class LoginUserDto {
    username: string;

    password: string;
}
```

安装 ValidationPipe 用到的包：

```
npm install --save class-validator class-transformer
```

然后给 dto 对象添加 class-validator 的装饰器：

```javascript
import { IsNotEmpty, Length } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @Length(1, 50)
    username: string;

    @IsNotEmpty()
    @Length(1, 50)
    password: string;
}
```

全局启用 ValidationPipe：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d5385c95d0e42bbafe1258482411da1~tplv-k3u1fbpfcp-watermark.image?)

然后在 postman 里测试下：

ValidationPipe 不通过的时候，会返回错误信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26a2488fd1f248de9b2f6eabf5d38135~tplv-k3u1fbpfcp-watermark.image?)

ValidationPipe 通过之后，就会执行 handler 里的方法：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6dae7b1cad345f7bd9b2cf1d0d033dc~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13f0636ae79f4398ac6e21b80d79d3bc~tplv-k3u1fbpfcp-watermark.image?)

接下来实现查询数据库的逻辑，在 UserService 添加 login 方法：

```javascript
async login(loginUserDto: LoginUserDto) {
    const user = await this.entityManager.findOneBy(User, {
      username: loginUserDto.username
    });

    if(!user) {
      throw new HttpException('用户不存在', HttpStatus.ACCEPTED);
    }

    if(user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);
    }

    return user;
}
```
然后改下 UserController 的 login 方法：

```javascript
@Post('login')
async login(@Body() loginUser: LoginUserDto, @Session() session){
    const user = await this.userService.login(loginUser);

    session.user = {
      username: user.username
    }

    return 'success';
}
```

调用 userService，并且把 user 信息放入 session。

再用 postman 登录下：

用户不存在：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ba3a8e3cf1a4c2b9f9b670ea0610607~tplv-k3u1fbpfcp-watermark.image?)

密码错误：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/181c6e66611e49849c443ce2b20f6b74~tplv-k3u1fbpfcp-watermark.image?)

登录成功：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ecc33112b7644378bc3e22133b39ba1~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c325f5a8f92457cb491f7629354c24c~tplv-k3u1fbpfcp-watermark.image?)

登录成功之后会返回 cookie，之后只要带上这个 cookie 就可以查询到服务端的对应的 session，从而取出 user 信息。

然后添加 aaa、bbb 两个模块，分别生成 CRUD 方法：
```
nest g resource aaa 
nest g resource bbb 
```
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f355fb75d254ce8ba1f284a182bb806~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c91016bc4be4ee0b6a4445d0d357ab5~tplv-k3u1fbpfcp-watermark.image?)

现在这些接口可以直接访问：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a9724b76fae4a16965bf58f27295d38~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e96a5281a094eeeaaba535bc2ead0cc~tplv-k3u1fbpfcp-watermark.image?)

而实际上这些接口是要控制权限的。

用户东东有 aaa 的增删改查权限，而用户光光拥有 bbb 的增删改查权限。

所以要对接口的调用做限制。

先添加一个 LoginGuard，限制只有登录状态才可以访问这些接口： 

```
nest g guard login --no-spec --flat
```

然后增加登录状态的检查：

```javascript
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

declare module 'express-session' {
  interface Session {
    user: {
      username: string
    }
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    
    if(!request.session?.user){
      throw new UnauthorizedException('用户未登录');
    }

    return true;
  }
}
```

因为默认的 session 里没有 user 的类型，所以需要扩展下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e85bbb6f837441f6bbe8d146fb519e54~tplv-k3u1fbpfcp-watermark.image?)

利用同名 interface 会自动合并的特点来扩展 Session。

然后给接口都加上这个 Guard：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/486fb3ea083b440dbbfa5985389787c1~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d1d8aec3553440581807ddd9ce1492e~tplv-k3u1fbpfcp-watermark.image?)

再访问下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/472ce143701547a4b9ac10343b78a204~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/678b5caa977a47ef90fe102fdb38f30b~tplv-k3u1fbpfcp-watermark.image?)

在 postman 里带上 cookie 访问：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f911b77516a447048fc4c7392f515f71~tplv-k3u1fbpfcp-watermark.image?)

你访问登录接口之后，服务端返回 set-cookie 的 header，postman 会自动带上 cookie，不需要手动带：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5db9879eeeb043af89e303ab03ec14a1~tplv-k3u1fbpfcp-watermark.image?)

行为和浏览器里一致。

这时候再访问 aaa、bbb 的接口，就可以访问了：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c7e856dd0a44d77a4a949d0bd011d4d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a73efa81077d4afa844905f304582f97~tplv-k3u1fbpfcp-watermark.image?)

但是这样还不够，我们还需要再做登录用户的权限控制，所以再写个 PermissionGuard:

```
nest g guard permission --no-spec --flat
```

因为 PermissionGuard 里需要用到 UserService 来查询数据库，所以把它移动到 UserModule 里：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b72c7d8ea224dce8500044d209af933~tplv-k3u1fbpfcp-watermark.image?)

注入 UserService：

```javascript
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log(this.userService);

    return true;
  }
}
```

在 UserModule 的 providers、exports 里添加 UserService 和 PermissionGuard

```javascript
import { Module, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PermissionGuard } from './permission.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PermissionGuard],
  exports: [UserService, PermissionGuard]
})
export class UserModule {}
```

这样就可以在 PermissionGuard 里注入 UserService 了。

我们在 AaaModule 里引入这个 UserModule：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d7899f5435e40a5b5b64aa7f5bd3dcd~tplv-k3u1fbpfcp-watermark.image?)

然后在 /aaa 的 handler 里添加 PermissionGuard：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44212b21eace4f758cabf73d2ef5a408~tplv-k3u1fbpfcp-watermark.image?)

postman 访问下：

首先重新登录，post 方式请求 /user/login：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85f16a5e304f43f5bb54d6011c3865ed~tplv-k3u1fbpfcp-watermark.image?)

然后 get 访问 /aaa，postman 会自动带上 cookie。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f18514508c0c46e9a2834ffe03f70511~tplv-k3u1fbpfcp-watermark.image?)

服务端打印了 UserService：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3245408c702d4290a20c1da3f7ccc755~tplv-k3u1fbpfcp-watermark.image?)

说明在 PermissionGuard 里成功注入了 UserService。

然后来实现权限检查的逻辑。

在 UserService 里添加一个方法：

```javascript
async findByUsername(username: string) {
  const user = await this.entityManager.findOne(User, {
    where: {
      username,
    },
    relations: {
      permissions: true
    }
  });
  return user;
}
```
根据用户名查找用户，并且查询出关联的权限来。

在 PermissionGuard 里调用下：

```javascript
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;
    if(!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const foundUser = await this.userService.findByUsername(user.username);

    console.log(foundUser);

    return true;
  }
}

```

打印了下查找到的登录用户的信息。

我们试试看：

先登录，拿到 cookie：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2bae0bf498947d99eae592ab32497d6~tplv-k3u1fbpfcp-watermark.image?)

然后请求 /aaa 接口：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc3318344252469595fd4b23d5a26e11~tplv-k3u1fbpfcp-watermark.image?)

服务端打印了当前用户的权限信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f88fc1ffeeb04ce583db10c34feabc50~tplv-k3u1fbpfcp-watermark.image?)

然后我们就根据当前 handler 需要的权限来判断是否返回 true 就可以了。

那怎么给当前 handler 标记需要什么权限呢？

很明显是通过 metadata。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a37d0fc82cc948bf800d7afd9a38fe0e~tplv-k3u1fbpfcp-watermark.image?)

给 /aaa 接口声明需要 query_aaa 的 permission。

然后在 PermissionGuard 里通过 reflector 取出来：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c091aed2ebdc4cde9dbc3f31bef12dee~tplv-k3u1fbpfcp-watermark.image?)

取出 handler 声明的 metadata，如果用户权限里包含需要的权限，就返回 true，否则抛出没有权限的异常。

```javascript
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;
    if(!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const foundUser = await this.userService.findByUsername(user.username);

    const permission = this.reflector.get('permission', context.getHandler());

    if(foundUser.permissions.some(item => item.name === permission)) {
       return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
```

我们试一下：

这次用光光的账号登录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c43adc7704de405da2a4c88a53d3cce4~tplv-k3u1fbpfcp-watermark.image?)
访问 /aaa，会提示没有权限：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/574c1dfaa54c4ec985dd4c8b871f26ac~tplv-k3u1fbpfcp-watermark.image?)

然后登录东东的账号：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/508eb4822ade476e819407c554178e06~tplv-k3u1fbpfcp-watermark.image?)

然后访问 /aaa：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc68336205224687b806e3e1ffc64333~tplv-k3u1fbpfcp-watermark.image?)

东东是有 query_aaa 的权限的，就可以正常访问了。

这样我们就通过 ACL 的方式完成了接口权限的控制。

但是不知道同学们有没有发现一个问题：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57f610b77fd84ec7b35e0a3f66c2db46~tplv-k3u1fbpfcp-watermark.image?)

每次访问接口，都会触发这样 3 个表的关联查询。

效率太低了。

怎么优化一下呢？

有的同学说，登录的时候把权限也查出来放到 session 里不就行了么？

确实，可以在登录的时候做这件事情，把权限放到 session 里，之后就直接从 session 取就好了。

那还是延续现在的访问时查询权限的方案，怎么优化呢？

这时就需要 redis 了，redis 的缓存就是用来做这种优化的。

我们引入下 redis：

```
npm install redis 
```

然后新建一个模块来封装 redis 操作：
```
nest g module redis
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/727764f2b6ba4b91a4af6e9ef3793fe2~tplv-k3u1fbpfcp-watermark.image?)

然后新建一个 service：

```
nest g service redis --no-spec
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51ddb549dfdf4eeda08e540c9a9ce33a~tplv-k3u1fbpfcp-watermark.image?)

然后在 RedisModule 里添加 redis 的 provider：

```javascript
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, 
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
```

并使用 @Global 把这个模块声明为全局的。

这样，各个模块就都可以注入这个 RedisService 了。

然后在 RedisService 里添加一些 redis 操作方法：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType

    async listGet(key: string) {
        return await this.redisClient.lRange(key, 0, -1);
    }

    async listSet(key: string, list: Array<string>, ttl?: number) {
        for(let i = 0; i < list.length;i++) {
            await this.redisClient.lPush(key, list[i]);
        }
        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}

```
注入 redisClient，封装 listGet 和 listSet 方法，listSet 方法支持传入过期时间。

底层用的命令是 lrange 和 lpush、exprire。

然后在 PermissionGuard 里注入来用下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06d2f828cda34659a5d9d94b5b0086aa~tplv-k3u1fbpfcp-watermark.image?)

先查询 redis、没有再查数据库并存到 redis，有的话就直接用 redis 的缓存结果。

key 为 user_${username}_permissions，这里的 username 是唯一的。

缓存过期时间为 30 分钟。

```javascript
import { RedisService } from './../redis/redis.service';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;
    if(!user) {
      throw new UnauthorizedException('用户未登录');
    }

    let permissions = await this.redisService.listGet(`user_${user.username}_permissions`); 

    if(permissions.length === 0) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser.permissions.map(item => item.name);

      this.redisService.listSet(`user_${user.username}_permissions`, permissions, 60 * 30)
    }

    const permission = this.reflector.get('permission', context.getHandler());

    if(permissions.some(item => item === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
```

我们试一下：

这里如果你没跑 redis server，需要先通过 docker 把它跑起来。具体怎么跑可以翻一下 redis 入门那节

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcb8305988cb4d02b9202d78b9e7fd8e~tplv-k3u1fbpfcp-watermark.image?)

然后先登录：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bccee4b04b640ddb585925193c971a1~tplv-k3u1fbpfcp-watermark.image?)

服务端打印了查询用户数据的 sql：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7407bb32b8cf48cca8db7fb66b3d08b7~tplv-k3u1fbpfcp-watermark.image?)

然后再访问 /aaa

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d83f0d5ad6a84fda9e7540aba30d8981~tplv-k3u1fbpfcp-watermark.image?)

又打印了 2 条关联查询的 sql：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b97963211994c5b93e02a4ab674b9cc~tplv-k3u1fbpfcp-watermark.image?)

我们去 RedisInsight 里看下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d34a91cc4d44cfc8600f787b01ad42a~tplv-k3u1fbpfcp-watermark.image?)

可以看到这条缓存。

这时候你刷新多少次，都不会再产生 sql 了：

![2023-06-22 17.16.43.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b13658f11cf5457a843a66e3bf5c7635~tplv-k3u1fbpfcp-watermark.image?)

这时候查的就是 redis 缓存。

redis 是基于内存的，访问速度会比 mysql 快很多。这就是为什么要用 redis。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/acl-test)。

## 总结

有的接口除了需要登录外，还需要权限。

只有登录用户有调用该接口的权限才能正常访问。

这节我们通过 ACL （Access Control List）的方式实现了权限控制，它的特点是用户直接和权限关联。

用户和权限是多对多关系，在数据库中会存在用户表、权限表、用户权限中间表。

登录的时候，把用户信息查出来，放到 session 或者 jwt 返回。

然后访问接口的时候，在 Guard 里判断是否登录，是否有权限，没有就返回 401，有的话才会继续处理请求。

我们采用的是访问接口的时候查询权限的方案，通过 handler 上用 SetMetadata 声明的所需权限的信息，和从数据库中查出来的当前用户的权限做对比，有相应权限才会放行。

但是这种方案查询数据库太频繁，需要用 redis 来做缓存。

当然，你选择登录的时候把权限一并查出来放到 session 或者 jwt 里也是可以的。

这就是通过 ACL 实现的权限控制。
