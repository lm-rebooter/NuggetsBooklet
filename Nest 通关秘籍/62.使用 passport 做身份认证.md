我们实现过登录和身份认证，登录的时候基于用户名密码，后续基于 jwt。

像这种身份认证逻辑其实很通用，每个项目都会有，自然可以抽取成一个库。

先不看第三方库是怎么做的，思考下，如果让你做一个身份认证的库，你会怎么设计呢？

首先，身份认证有多种方式，比如用户名密码、jwt、google 登录、github 登录等。

这多种方式都可以实现身份认证，那我们就可以用策略模式把它们封装成一个个策略类（Strategy）。

简单看下策略模式的介绍：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a61d415919c94c6287c2a2f92a215859~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1484&h=1814&s=352175&e=png&b=fefefe)

其实它就是实现了一个接口的多个类，这些类可以相互替换。

这里我们就可以用策略模式来做。

然后每个策略类里封装什么呢？

其实不同的认证方式虽然逻辑不同，但做的事情很类似：

- 用户名密码登录就是从 request 的 body 里取出 username、password 来认证。
- jwt 是从 request 的 Authorization 的 header 取出 token 来认证。

**不同策略都会从 request 中取出一些东西来认证，如果认证就在 request.user 上存放认证后的 user 信息**，这就是它们的共同点。

比如身份认证库 passport 的两种策略：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5bb06800a4f4d3f8b082dcc6e88e230~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=546&s=105492&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98742b56090242089178eda25ab90cf4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=560&s=100048&e=png&b=1f1f1f)

可以看到，不管是用户名密码的身份认证，还是 jwt 的身份认证，都会从 request 的 body 或者 header 中取出一些信息来，然后认证通过之后返回 user 的信息，passport 会设置到 request.user 上。

这个封装思路你理解了，那 passport 这个库也就差不多掌握了。

然后我们在 nest 里用一下 passport 这个库：

```
nest new nest-passport
```

![2.3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/895567963a604e14a2e77ab6810e8539~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=934&h=586&s=365351&e=png&b=fefefe)
进入项目，安装 passport：

```
npm install --save @nestjs/passport passport
```
然后我们首先实现用户名密码的认证。

这用到 passport-local 的策略，安装下：

```
npm install --save passport-local
npm install --save-dev @types/passport-local
```
然后创建一个认证模块：

```
nest g module auth
nest g service auth --no-spec
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dff2212906444ef8453cff548f080c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=186&s=54890&e=png&b=191919)
添加用户名密码认证的策略：

```javascript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    return user;
  }
}
```

在 AuthModule 引入下：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09d8b29792d84e329598aeec6149b2af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892&h=374&s=74826&e=png&b=202020)

这个 LocalStrategy 的逻辑就像前面分析的：


从 reqeust 的 body 中取出 username 和 password 交给你去认证，认证过了之后返回 user，它会把 user 放到 request.user 上，如果认证不通过，就抛异常，由 exception filter 处理。

我们在 AuthService 里实现这个 validateUser 方法：

```javascript
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    @Inject()
    private userService: UserService;

    async validateUser(username: string, pass: string) {
        const user = await this.userService.findOne(username);

        if(!user) {
            throw new UnauthorizedException('用户不存在');
        }
        if(user.password !== pass) {
            throw new UnauthorizedException('密码错误');
        }

        const { password, ...result } = user;
        return result;
    }
}
```

AuthService 里根据用户名密码去校验，但是查询用户的逻辑应该在 UserModule 里，我们写一下：

```
nest g module user
nest g service user --no-spec
```

UserService：

```javascript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    private readonly users = [
        {
            userId: 1,
            username: '神说要有光',
            password: 'guang',
        },
        {
            userId: 2,
            username: '东东东',
            password: 'dong',
        },
    ];

    async findOne(username: string) {
        return this.users.find(user => user.username === username);
    }
}
```
在 UserModule 里导出 UserService：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95ae3305ca0b4d03b7201d9a3c87513b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=830&h=368&s=65366&e=png&b=1f1f1f)

然后在 AuthModule 里引入下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f4e72bd571545be84096b2e5a961fdc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=436&s=93319&e=png&b=1f1f1f)

这样，passport 的流程就完成了，它会从 request 中取出 body 的 username 和 password 交给我们的 validate 方法去认证，认证完会返回 user 信息，放到 request.user 上。

那怎么应用这个策略呢？

很明显，这里适合用 Guard。

@nestjs/passport 已经做了封装了。

我们在 AppController 里加个 login 方法：

```javascript
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
把服务跑起来：

```
npm run start:dev
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/758a0a51f4b84e218e6693203cbdbb25~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1592&h=436&s=184646&e=png&b=181818)

postman 里测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94aec9bdd6147169b1b25c25248ae98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=836&s=101583&e=png&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b859cdc48f9f4481a9abec213df2b561~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=796&s=100824&e=png&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80858ddf870c44488d35e5997c13b540~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=798&s=93187&e=png&b=fdfdfd)

这样，基于 passport 的登录就完成了。

不用我们自己从 request 取 body 中的 username 和 password，也不用我们把查询结果放到 request.user 上，更不用自己实现 Guard。

确实减少了不少代码。

接下来继续做 JWT 的认证：

登录的时候通过用户名、密码认证，这时候登录认证成功会返回 jwt，然后再次访问会在 Authorization 的 header 携带 jwt，然后通过 header 的 jwt 来认证。

这是一种新的认证方式，需要用新的策略。

我们首先在登录成功之后返回 jwt。

安装用到的包：

```
npm install --save @nestjs/jwt
```

在 AppModule 里引入下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22e2c21fd8854c4abe2a592aff039ee9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=772&s=145432&e=png&b=1f1f1f)

```javascript
JwtModule.register({
    secret: "guang"
}),
```
然后在 AppController 里 login 接口返回 jwt 的 token：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66040af35eed436db182e2b720312a0f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=1440&s=253523&e=png&b=1f1f1f)

这里需要扩展下 express 的 request.user 的类型。

```javascript
import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  jwtService: JwtService;

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    console.log(req.user);
    const token = this.jwtService.sign({
      userId: req.user.userId,
      username: req.user.username
    }, {
      expiresIn: '0.5h'
    });

    return {
      token
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```
试一下：


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c62988bb8eef4f37a7a76f8c2f47f715~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534&h=824&s=154588&e=png&b=fefefe)

这样，登录之后返回 jwt 就完成了。

然后添加 jwt.strategy.ts

```javascript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'guang',
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, username: payload.username };
  }
}
```
指定从 request 的 header 里提取 token，然后取出 payload 之后会传入 validate 方法做验证，返回的值同样会设置到 request.user。

安装用到的包：

```
npm install --save passport-jwt
npm install --save-dev @types/passport-jwt
```
在 AuthModule 引入下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c6f592bd6cd41dfb9e64a7738d659f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=934&h=462&s=107470&e=png&b=1f1f1f)

在 AppController 里添加一个新的需要登录认证的接口：

```javascript
@UseGuards(AuthGuard('jwt'))
@Get("list")
list(@Req() req: Request) {
    console.log(req.user);
    return ['111', '222', '333', '444', '555']
}
```
首先不带 token 访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d5a9d8c7b2b4078adc2153ecbbb9382~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=824&s=82528&e=png&b=fdfdfd)

然后通过 Authorization 的 header 带上 Bearer xxx 的 token 访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/582a3a55c09c42dc95e1ea7ab11daa90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=866&s=101767&e=png&b=fdfdfd)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db21c92d5d29476e810d21e2892b81e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=538&s=173360&e=png&b=191919)

可以看到，jwt 的认证生效了。

对比下用 passport 和不用有啥区别呢？

不用我们自己从 request 的 header 里取 token 了，也不用自己从 token 提取的信息放到 request.user 里了，也不用自己写 Guard 了。

确实方便了很多。

这样，我们就用了两个 local 和 jwt 两个策略了。

其他策略也是类似的流程，从 request 取一些信息，交给 validate 方法去验证，返回 user 放到 request.user 里。

那如果我想对 Guard 的流程做一些扩展呢？

比如 jwt 的 Guard，现在需要在每个 controller 上手动应用，我想通过一个 @IsPublic 的装饰器来标识，如果有 @IsPublic 的装饰器就不需要身份认证，否则就需要。

这就需要继承 AuthGuard('jwt') 做一些扩展了：

首先，生成一个自定义装饰器：

```
nest g decorator is-public --flat --no-spec
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85ed3cabe56c48edb0672ab350cfd32c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=148&s=38054&e=png&b=181818)
它的实现就是给被装饰对象添加一个 metadata：

```javascript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
```
然后在 AppController 里加几个路由：

```javascript
@IsPublic()
@Get('aaa')
aaa() {
    return 'aaa';
}

@Get('bbb')
bbb() {
    return 'bbb';
}
```
aaa 是 public 的，不需要身份认证，而 bbb 需要。

这时就需要对 AuthGuard('jwt') 做下扩展。

新建 auth/JwtAuthGuard.ts

```javascript
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "src/is-public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```
实现就是从目标 controller、handler 上取 public 的 meatadata，如果有就直接放行，否则才做认证。

然后在 AppModule 里注册为全局 Guard：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/010386453de4464ea7ffe2d332201881~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=958&h=1050&s=191342&e=png&b=202020)

```javascript
{
    provide: APP_GUARD,
    useClass: JwtAuthGuard
}
```
测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6614fe16949347d6a06f26408f61f7f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=694&s=73035&e=png&b=fdfdfd)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9852fff2ee944128485716bc6faa5c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=754&s=87469&e=png&b=fdfdfd)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98e582bbbe2546bda930701ebed27719~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=686&s=73037&e=png&b=fdfdfd)

没啥问题，这样，对 AuthGuard('jwt') 的扩展就完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-passport)

## 总结

之前我们都是自己实现身份认证，比如基于用户名密码的认证，基于 jwt 的认证，今天我们基于 passport 库来实现了一遍。

passport 把不同的认证逻辑封装成了不同 Strategy，每个 Stategy 都有 validate 方法来验证。

**每个 Strategy 都是从 request 取出一些东西，交给 validate 方法验证，validate 方法返回 user 信息，自动放到 request.user 上。**

并且 @nestjs/passport 提供了 Guard 可以直接用，如果你想扩展，继承 AuthGuard('xxx')  然后重写下 canActivate 方法就好了。

细想一下，你做各种认证的时候，是不是也在做同样的事情呢？

那既然每次都是做这些事情，那为啥不用 passport 库来简化呢？