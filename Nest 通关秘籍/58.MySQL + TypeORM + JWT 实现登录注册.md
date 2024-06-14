学完了 mysql、typeorm、jwt/session 之后，我们来做个综合案例：登录注册。

首先，创建个新的 database：

```sql
CREATE SCHEMA login_test DEFAULT CHARACTER SET utf8mb4;
```

create schema 或者 create database 都可以，一个意思。

指定默认字符集 ，这样创建表的时候就不用指定字符集了。

utf8 最多存 3 个字节的字符，而 utf8mb4 最多 4 个字符，可以存储一些 emoji 等特殊字符。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22a3ca51398d46cb8b30356ecd92d45e~tplv-k3u1fbpfcp-watermark.image?)

刷新后就可以看到这个数据库了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b90e820fb3f94f52b7e24cd3b56e4f0f~tplv-k3u1fbpfcp-watermark.image?)

然后我们创建个 nest 项目：

    nest new login-and-register -p npm

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9dd4f0be61742b28d442924882d2a92~tplv-k3u1fbpfcp-watermark.image?)

安装 typeorm 相关的包：

    npm install --save @nestjs/typeorm typeorm mysql2

然后在 AppModule 里引入 TypeOrmModule，传入 option：

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
      database: "login_test",
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

之后创建个 user 的 CRUD 模块：

    nest g resource user

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f25a7036e4c49cbbaba230d3d359cf3~tplv-k3u1fbpfcp-watermark.image?)

引入 User 的 entity：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1124e12a05242dfaaf91c77b7718779~tplv-k3u1fbpfcp-watermark.image?)

然后给 User 添加一些属性：

```javascript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        comment: '用户名'
    })
    username: string;

    @Column({
        length:50,
        comment: '密码'
    })
    password: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;

}
```

id 列是主键、自动递增。

username 和 password 是用户名和密码，类型是 VARCHAR(50)。

createTime 是创建时间，updateTime 是更新时间。

这里的 @CreateDateColumn 和 @UpdateDateColumn 都是 datetime 类型。

@CreateDateColumn 会在第一次保存的时候设置一个时间戳，之后一直不变。

而 @UpdateDateColumn 则是每次更新都会修改这个时间戳。

用来保存创建时间和更新时间很方便。

然后我们跑一下：

    npm run start:dev

npm run start:dev 就是 nest start --watch：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fbae5dbf8d44233a691330c917f8770~tplv-k3u1fbpfcp-watermark.image?)

可以看到打印了 create table 的建表 sql：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e401ac99761848019e1d2b481fd8031c~tplv-k3u1fbpfcp-watermark.image?)

用 mysql workbench 可以看到生成的表是对的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd79d09772cc4750a01bafea98fe7352~tplv-k3u1fbpfcp-watermark.image?)

然后我们在 UserModule 引入 TypeOrm.forFeature 动态模块，传入 User 的 entity。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d5bb9e2d5144c3c87ce7954a253b0cd~tplv-k3u1fbpfcp-watermark.image?)

这样模块内就可以注入 User 对应的 Repository 了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fddd883cc1f9460197b25f9b053949f6~tplv-k3u1fbpfcp-watermark.image?)

然后就可以实现 User 的增删改查。

我们在 UserController 里添加两个 handler：

```javascript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login() {

  }

  @Post('register')
  register() {

  }
}
```

其余的 handler 用不到，都可以去掉。

然后添加两个 dto：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2d3e8414d784352a51fb74825ae10c8~tplv-k3u1fbpfcp-watermark.image?)

```javascript
export class LoginDto {
    username: string;
    password: string;
}
```

```javascript
export class RegisterDto {
    username: string;
    password: string;
}
```

在 handler 里使用这两个 dto 来接收参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a466ad45b744b26b04e5a2f6f40dc98~tplv-k3u1fbpfcp-watermark.image?)

我们先在 postman 里测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f0a6a04db664af59868cff08184bebd~tplv-k3u1fbpfcp-watermark.image?)

post 请求 /user/login 接口，body 传入用户信息。

服务端打印了收到的 user：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd8f7273f275459bb38d598d6d2f6171~tplv-k3u1fbpfcp-watermark.image?)

然后 post 请求 /user/register：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17a4c7ea658a45aea6094c14b1e3d65a~tplv-k3u1fbpfcp-watermark.image?)

也是一样的。

虽然都是 user，但是 login 和 register 的处理不同：

*   register 是把用户信息存到数据库里
*   login 是根据 username 和 password 取匹配是否有这个 user

先实现注册：

```javascript
@Post('register')
async register(@Body() user: RegisterDto) {
    return await this.userService.register(user);
}
```

在 UserSerice 里实现 register 方法：

```javascript
import { RegisterDto } from './dto/register.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {

  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;


  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username
    });

    if(foundUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch(e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
}
```
先根据 username 查找下，如果找到了，说明用户已存在，抛一个 HttpException 让 exception filter 处理。

否则，创建 User 对象，调用 userRepository 的 save 方法保存。

password 需要加密，这里使用 node 内置的 crypto 包来实现。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb9f79abb69a4741a91b305a76cf8417~tplv-k3u1fbpfcp-watermark.image?)

我们测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf8806fa194d477c9631bba3c797c568~tplv-k3u1fbpfcp-watermark.image?)

服务返回了注册成功，并且打印了 insert 的 sql：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be54c8b944334883a7b23e9a1051192d~tplv-k3u1fbpfcp-watermark.image?)

可以看到，数据库 user 表插入了这个用户的信息，并且指定了 createTime 和 udpateTime。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bc7ecdccb7741fa82025ae9428c4e4d~tplv-k3u1fbpfcp-watermark.image?)

然后我们再次调用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b770d0c28b9647ea8c9bf68f1efa0787~tplv-k3u1fbpfcp-watermark.image?)

会提示用户已经存在。

这就是注册。

然后再实现下登录：

添加一个 handler：
```javascript
@Post('login')
async login(@Body() user: LoginDto) {
    const foundUser = await this.userService.login(user);

    if(foundUser) {
      return 'login success';
    } else {
      return 'login fail';
    }
}
```
然后再添加对应的 service：

```javascript
async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if(!foundUser) {
      throw new HttpException('用户名不存在', 200);
    }
    if(foundUser.password !== md5(user.password)) {
      throw new HttpException('密码错误', 200);
    }
    return foundUser;
}
```
根据用户名查找用户，没找到就抛出用户不存在的 HttpException、找到但是密码不对就抛出密码错误的 HttpException。

否则，返回找到的用户。

我们试一下：

用户名、密码正确：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8e459bcd190434cad2561abe2d58110~tplv-k3u1fbpfcp-watermark.image?)

用户名不存在：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d99407ad2754704988883072602a360~tplv-k3u1fbpfcp-watermark.image?)

用户名存在但密码错误：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6076835d50bb4820b452ae3aeef5aabf~tplv-k3u1fbpfcp-watermark.image?)

可以看到，服务端打印了 3 条 select 的 sql：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff6de1d221044b0dadeb92d95c9b1a20~tplv-k3u1fbpfcp-watermark.image?)

登录成功之后我们要把用户信息放在 jwt 或者 session 中一份，这样后面再请求就知道已经登录了。

安装 @nestjs/jwt 的包：

```
npm install @nestjs/jwt
```

在 AppModule 里引入 JwtModule：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d256e8eb46a1489eaba895961d9a8fed~tplv-k3u1fbpfcp-watermark.image?)

global:true 声明为全局模块，这样就不用每个模块都引入它了，指定加密密钥，token 过期时间。

在 UserController 里注入 JwtService：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adf4d0525c1e420bb13af65f35ea06e0~tplv-k3u1fbpfcp-watermark.image?)

然后在登录成功后，把 user 信息放到 jwt 通过 header 里返回。

```javascript
@Post('login')
async login(@Body() user: LoginDto,  @Res({passthrough: true}) res: Response) {
    const foundUser = await this.userService.login(user);

    if(foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username
        }
      })
      res.setHeader('token', token);
      return 'login success';
    } else {
      return 'login fail';
    }
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1373793c3a844089a4f9ac57e1ab50fb~tplv-k3u1fbpfcp-watermark.image?)

再次访问：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b0dc8c99c154c07861cf809b8229456~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8348a1774d043b584413e0b7a2a185b~tplv-k3u1fbpfcp-watermark.image?)

登录成功之后返回了 jwt 的 token。

我们有一些接口是只有登录才能访问的。

我们在 AppController 里添加两个路由：

```javascript
@Get('aaa')
aaa() {
    return 'aaa';
}

@Get('bbb')
bbb() {
    return 'bbb';
}
```

现在不需要登录就可以访问：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46bbf461981f44549152546a5f586b39~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d57dab4f66a644e3a35d40f6f623aa06~tplv-k3u1fbpfcp-watermark.image?)

我们可以加个 Guard 来限制访问：

```
nest g guard login --no-spec --flat
```

然后实现 jwt 校验的逻辑：

```javascript
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization') || '';

    const bearer = authorization.split(' ');
    
    if(!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }

    const token = bearer[1];

    try {
      const info = this.jwtService.verify(token);
      (request as any).user = info.user;
      return true;
    } catch(e) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
```
取出 authorization 的 header，验证 token 是否有效，token 有效返回 true，无效的话就返回 UnauthorizedException。

把这个 Guard 应用到 handler：

```javascript
@Get('aaa')
@UseGuards(LoginGuard)
aaa() {
    return 'aaa';
}

@Get('bbb')
@UseGuards(LoginGuard)
bbb() {
    return 'bbb';
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46e3831b35064794bc019e939cb6dfc8~tplv-k3u1fbpfcp-watermark.image?)

我们先登录一下，拿到 token：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f169358e6aca45c08493399af0a437dd~tplv-k3u1fbpfcp-watermark.image?)

然后请求 /aaa 的时候通过 authorization 的 header 带上 token：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d82ed2502b4ddbb77c7a5930e3098d~tplv-k3u1fbpfcp-watermark.image?)

访问成功。

如果不带 token，就失败了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9af28df874ef4c038d51c259b4113c82~tplv-k3u1fbpfcp-watermark.image?)


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28b919ac0a224a248d0ed3ef20018306~tplv-k3u1fbpfcp-watermark.image?)

这样我们就实现了登录注册的流程。

但是，现在我们并没有对参数做校验，这个用 ValidationPipe + class-validator 来做。

安装 class-validator 和 class-transformer 的包：

```
npm install class-validator class-transformer
```

然后给 /user/login 和 /user/register 接口添加 ValidationPipe：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba3cff47a0364352b1ff071dac011492~tplv-k3u1fbpfcp-watermark.image?)

在 dto 里声明参数的约束：

```javascript
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Length(6, 30)
    @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
        message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符'
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 30)
    password: string;
}
```
注册的时候，用户名密码不能为空，长度为 6-30，并且限定了不能是特殊字符。

登录就不用限制了，只要不为空就行：
```javascript
import { IsNotEmpty } from "class-validator";

export class LoginDto{
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}
```

我们测试下：


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd83d85eac984b9e94008c320ed1f632~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bea937994404abe84ef86f0ee774973~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16242a279c924280afc1c45ca01d390b~tplv-k3u1fbpfcp-watermark.image?)

ValidationPipe 生效了。

这样，我们就实现了登录、注册和鉴权的完整功能。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f65a172a4cce440aa9b5cad5fa9979d2~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43cb79b2d63046e6856417489832c81f~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b4ef812d409492d90ab8c9ac72ccefd~tplv-k3u1fbpfcp-watermark.image?)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/login-and-register)。

## 总结

这节我们通过 mysql + typeorm + jwt + ValidationPipe 实现了登录注册的功能。

typeorm 通过 @PrimaryGeneratedKey、@Column、@CreateDateColumn、@UpdateDateColumn 声明和数据库表的映射。

通过 TypeOrmModule.forRoot、TypeOrmModule.forFeature 的动态模块添加数据源，拿到 User 的 Repository。

然后用 Repository 来做增删改查，实现注册和登录的功能。

登录之后，把用户信息通过 jwt 的方式放在 authorization 的 header 里返回。

然后 LoginGuard 里面取出 header 来做验证，token 正确的话才放行。

此外，参数的校验使用 ValidationPipe + class-validator 来实现。

这样，就实现了注册和基于 JWT 的登录功能。

