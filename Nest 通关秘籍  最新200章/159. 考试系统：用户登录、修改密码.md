这节我们实现下登录、修改密码。

在 UserController 添加一个 login 的路由：

```javascript
@Post('login')
async userLogin(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return 'success';
}
```
创建 src/dto/login-user.dto.ts：

```javascript
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {

    @IsNotEmpty({
        message: "用户名不能为空"
    })
    username: string;
    
    @IsNotEmpty({
        message: '密码不能为空'
    })
    password: string;    
}
```

测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b24211f1dc84b8b80699d05abb5013f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=606&s=60614&e=png&b=fcfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fee7ed2f80814623b78a45b973ecb9f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1568&h=264&s=113148&e=png&b=181818)

服务端打印了接收的参数。

ValidationPipe 开启 transform: true

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b27d79513164b6497e484e28b85292d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=494&s=106626&e=png&b=1f1f1f)

再次访问：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74e036e705b74823bdef96e1c74f88e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=516&s=240977&e=png&b=181818)

这样会把参数转为 dto 的实例。

然后在 UserService 实现 login 方法：

```javascript
async login(loginUserDto: LoginUserDto) {
  const foundUser = await this.prismaService.user.findUnique({
    where: {
      username: loginUserDto.username
    }
  });

  if(!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
  }

  if(foundUser.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
  }

  delete foundUser.password;
  return foundUser;
}
```

为了开发方便，我们注册的时候没有对密码做加密，登录的时候也就不用加密了。

在 UserController 里调用下：

```javascript
@Post('login')
async userLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    return user;
}
```
测试下：

当用户名不存在时：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e75b99c5841450db90a50e17790a3bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=680&s=73156&e=png&b=fbfbfb)

当密码错误时：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccaf4fc395b645428bea4b927f8ddbb7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=688&s=73551&e=png&b=fcfcfc)

登录成功：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6db4fdbf70ba4da19748fa2157b1fc1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=766&h=786&s=102085&e=png&b=fbfbfb)

登录成功之后我们要返回 jwt。

引入下 jwt 的包：

```
npm install --save @nestjs/jwt
```

在 UserModule 里引入：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd87ab22a7d542b192e83ebcce89441e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=952&h=920&s=171410&e=png&b=1f1f1f)
```javascript
JwtModule.registerAsync({
  global: true,
  useFactory() {
    return {
      secret: 'guang',
      signOptions: {
        expiresIn: '30m' // 默认 30 分钟
      }
    }
  }
}),
```

然后登录成功之后返回 token：

```javascript
@Inject(JwtService)
private jwtService: JwtService;

@Post('login')
async userLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    return {
      user,
      token: this.jwtService.sign({
        userId: user.id,
        username: user.username
      }, {
        expiresIn: '7d'
      })
    };
}
```

token 过期时间是 7 天。

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f507664201884898a2586f6dcb8622a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1158&h=1044&s=163823&e=png&b=fdfdfd)

我们这里就不用双 token 的方式来刷新了，而是用单 token 无限续期来做。

也就是当访问接口的时候，就返回一个新的 token。

这样只要它在 token 过期之前，也就是 7 天内访问了一次系统，那就会刷新换成新 token。

超过 7 天没访问，那就需要重新登录了。

然后我们加上 AuthGuard 来做登录鉴权：

创建一个 common 的 lib：

```
nest g lib common
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a78b7092a3d4c7fad561dc79d32292c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1662&h=296&s=90195&e=png&b=181818)

进入 common 目录，生成 Guard：
```
nest g guard auth --flat --no-spec
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7066e503b224403bb7a33c95ec62e909~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690&h=100&s=18813&e=png&b=181818)

AuthGuard 的实现代码如下：

```javascript
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ]);

    if(!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if(!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try{
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        username: data.username,
      }
      return true;
    } catch(e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
```
用 reflector 从目标 controller 和 handler 上拿到 require-login 的 metadata。

如果没有 metadata，就是不需要登录，返回 true 放行。

否则从 authorization 的 header 取出 jwt 来，把用户信息设置到 request，然后放行。

如果 jwt 无效，返回 401 响应，提示 token 失效，请重新登录。

导出下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b0db2c67cce4b48b44c0e6a851351b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=474&s=86839&e=png&b=1d1d1d)

然后全局启用这个 Guard，在 UserModule 里添加这个 provider：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c97cadc593f343f6afb964d4475fa6c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1422&h=860&s=229292&e=png&b=1d1d1d)

```javascript
{
  provide: APP_GUARD,
  useClass: AuthGuard
}
```

在 UserController 添加 aaa、bbb 两个接口：

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
访问下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e434a5971bd4b36a079db4a8d4f73de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=760&h=170&s=18785&e=png&b=ffffff)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b8be00279c84d47b3c66147ad0f896c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=778&h=218&s=21665&e=png&b=ffffff)

然后在 aaa 加上 require-login 的 matadata

```javascript
@Get('aaa')
@SetMetadata('require-login', true)
aaa() {
    return 'aaa';
}
```
会提示用户未登录：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d23496c6093416e96db0a17eb9bb155~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=760&h=292&s=37153&e=png&b=ffffff)

而 bbb 还是可以直接访问的：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c98354322acb4ce5816f7aa16572bf46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=828&h=216&s=21855&e=png&b=ffffff)

登录下，拿到 token：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94e0ade86d4f4fda8563aed6e07f3923~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1208&h=1084&s=168609&e=png&b=fdfdfd)

添加到 authorization 的 header 里，就可以访问了：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9eddc4e8030849978bc2a743c6fff6dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=634&s=74531&e=png&b=fbfbfb)

我们把这个 @SetMetadata 封装成自定义装饰器

放在 libs/common 下

新建 src/custom.decorator.ts

```javascript
import { SetMetadata } from "@nestjs/common";

export const  RequireLogin = () => SetMetadata('require-login', true);
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e83c3719f7f4c3a89ffee8d31af0fc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=466&s=95191&e=png&b=1d1d1d)
然后就可以通过在 controller 或者 handler 上的 @RequiredLogin 来声明接口需要登录了：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e9f606919a24b049738620dc671c518~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=692&h=248&s=30416&e=png&b=1f1f1f)

再实现个自定义参数装饰器来取 request.user

```javascript
import { SetMetadata } from "@nestjs/common";
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from "express";

export const  RequireLogin = () => SetMetadata('require-login', true);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if(!request.user) {
        return null;
    }
    return data ? request.user[data] : request.user;
  },
)
```
在 aaa 方法里测试下：

```javascript
@Get('aaa')
@RequireLogin()
// @SetMetadata('require-login', true)
aaa(@UserInfo() userInfo, @UserInfo('username') username) {
    console.log(userInfo, username);
    return 'aaa';
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbb90090025c4aa6a83b3390895200af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=656&s=226322&e=png&b=191919)

这样，就完成了登录和鉴权。

还有 token 自动续期没有做，这个就是访问接口之后，在 header 或者 body 里额外返回新 token。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfbc7fb0caa443b2aea19965983f55ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1296&h=1082&s=220201&e=png&b=1f1f1f)

```javascript
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ]);

    if(!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if(!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try{
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        username: data.username,
      }

      response.header('token', this.jwtService.sign({
        userId: data.userId,
        username: data.username
      }, {
        expiresIn: '7d'
      }))

      return true;
    } catch(e) {
      console.log(e);
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
```

再访问下 aaa 接口：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb5134d9546a454d8ee1dabc0ff16ccc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=932&s=130227&e=png&b=fdfdfd)

可以看到返回了新 token。

这样只要访问需要登录的接口，就会刷新 token。

比双token 的方案简单多了，很多公司就是这样做的。

然后实现修改密码的接口：

```javascript
@Post('update_password')
async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
  console.log(passwordDto);
  return 'success';
}
```
创建 src/dto/update-user-password.dto.ts

```javascript
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UpdateUserPasswordDto {    
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
        message: '用户名不能为空'
    })
    username: string;
    
    @IsNotEmpty({
        message: '验证码不能为空'
    })
    captcha: string;
}
```
需要传的是用户名、邮箱、密码、验证码。

确认密码在前端和密码对比就行，不需要传到后端。

测试下：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad25964a3e544c918cba2c660ec1a3ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=690&s=82411&e=png&b=fcfcfc)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a0be72f68004dd1978bdb252094c316~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360&h=318&s=104805&e=png&b=181818)
然后实现下具体的更新密码的逻辑：

在 UserController 里调用 UserService 的方法：

```javascript
@Post('update_password')
async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(passwordDto);
}
```
UserService 实现具体的逻辑：
```javascript
async updatePassword(passwordDto: UpdateUserPasswordDto) {
  const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);

  if(!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
  }

  if(passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
  }

  const foundUser = await this.prismaService.user.findUnique({
    where: {
        username: passwordDto.username
    }
  });

  foundUser.password = passwordDto.password;

  try {
    await this.prismaService.user.update({
      where: {
        id: foundUser.id
      },
      data: foundUser
    });
    return '密码修改成功';
  } catch(e) {
    this.logger.error(e, UserService);
    return '密码修改失败';
  }
}
```
先查询 redis 中相对应的验证码，检查通过之后根据 email 查询用户信息，修改密码之后 save。

测试下：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80e36ab4fce6477aa07473e805195033~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=816&s=102820&e=png&b=fcfcfc)

在 redis 里手动添加 update_password_captcha_邮箱 的 key，值为 111111


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efcf4ab25e0b482eb24cf39d9a443ecf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1196&h=1220&s=73514&e=png&b=202020)

半小时过期。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/261104e9de7c432799aed090980e2030~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1696&h=412&s=70945&e=png&b=1d1d1d)

然后再试下：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb71a741b3e44584860d7f11839cfb2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=702&s=88795&e=png&b=fcfcfc)

修改成功。

我们为了开发方便没对密码做加密，可以直观看出来密码修改成功了：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdde944336bf4c7793089171cdf806ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=296&s=103522&e=png&b=f3f3f3)

然后再加上发送邮箱验证码的接口：
```javascript
@Get('update_password/captcha')
async updatePasswordCaptcha(@Query('address') address: string) {
    if(!address) {
      throw new BadRequestException('邮箱地址不能为空');
    }
    const code = Math.random().toString().slice(2,8);

    await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是 ${code}</p>`
    });
    return '发送成功';
}
```

测试下：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a8ace59b8e84dfba7bf99c492fc98b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1476&h=190&s=37110&e=png&b=ffffff)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a34bb66e2e5a493189c93f822f010a5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=512&h=254&s=37613&e=png&b=f4f4f4)

用这个验证码修改下密码：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d12f947f9ee4c158ee81c8753453505~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=688&s=82959&e=png&b=fbfbfb)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca64465c5a464166ba88035642da4b8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=226&s=87824&e=png&b=f9f9f9)

修改成功。

代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exam-system)。

## 总结

这节我们实现了登录、鉴权、修改密码。

添加了 /user/login 接口来实现登录，登录后返回 jwt token。

实现了 /user/update_password 用于修改密码，/user/update_password/captcha 用于发送验证码。

访问的时候在 Authorization 的 header 带上 jwt 的 token 就能通过 AuthGuard 的鉴权。

我们做了 token 的自动续期，也就是访问接口后在 header 返回新 token，这样比双 token 的方案简单。

然后封装了 @RequireLogin 和 @UserInfo 两个自定义装饰器。

登录之后，就可以访问一些需要 user 信息的接口了。

至此，用户微服务的三个接口就开发完了。

