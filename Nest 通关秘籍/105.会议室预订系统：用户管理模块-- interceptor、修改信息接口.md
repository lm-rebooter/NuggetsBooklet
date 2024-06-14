用户管理模块我们实现了登录、注册、认证鉴权，还剩下一些列表、更新等接口：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a58b258db9d4449913d0194cbbc1006~tplv-k3u1fbpfcp-watermark.image?)

这节把修改密码、修改信息的接口写完。

在那之前，我们先加一个修改响应内容的拦截器。把响应的格式改成 {code、message、data} 这种。

```
nest g interceptor format-response --flat
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a8b8759fb744a7e8ee24bf6ec478b15~tplv-k3u1fbpfcp-watermark.image?)

使用 map 操作符来修改响应：

```javascript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(map((data) => {
      return {
        code: response.statusCode,
        message: 'success',
        data
      }
    }));
  }
}

```
全局启用它：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01b6e7aaca854229826e588d46a0914c~tplv-k3u1fbpfcp-watermark.image?)

这时候访问 http://localhost:3000 ，可以看到响应格式变了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/574ea5d4ef8642aabe863b9769b86fd2~tplv-k3u1fbpfcp-watermark.image?)

这里我用了一个 [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?utm_source=ext_sidebar&hl=zh-CN) 的 chrome 插件来格式化。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6370ba96078440649a1f49a43890c2b6~tplv-k3u1fbpfcp-watermark.image?)

然后再试下其它接口：

响应格式确实变了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4ff7c8076a493395775ae6fbb8d224~tplv-k3u1fbpfcp-watermark.image?)

抛出的异常还是由内置的 Exception Filter 来处理，返回响应：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d017ea629bf4d47b512070949b1313f~tplv-k3u1fbpfcp-watermark.image?)

然后再加一个接口访问记录的 interceptor：

```
nest g interceptor invoke-record --flat
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a2ccc8cfa2945c1b32171ffc48acb69~tplv-k3u1fbpfcp-watermark.image?)

记录下访问的 ip、user agent、请求的 controller、method，接口耗时、响应内容，当前登录用户等信息。

```javascript
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;

    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${
        context.getClass().name
      } ${
        context.getHandler().name
      } invoked...`,
    );
  
    this.logger.debug(`user: ${request.user?.userId}, ${request.user?.username}`);

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}

```
全局启用这个 interceptor：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9d34854adda4076979d96f9e26c3a87~tplv-k3u1fbpfcp-watermark.image?)

试一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b01861d339ca4ae2a7069f61569d5192~tplv-k3u1fbpfcp-watermark.image?)

访问管理员的登录的接口。

可以看到控制台打印了请求的路径、请求方法、controller、handler 等信息：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/399a1cf537cc4a929c99df71f26b6592~tplv-k3u1fbpfcp-watermark.image?)

这里因为是本地访问，所以是 ::1 的 ip，相当于 localhost。

user 因为当前还没有，所以是 undefined

响应之后打印了接口耗时以及接口返回的数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb637af933ec421dbd69f2c6b5f0084c~tplv-k3u1fbpfcp-watermark.image?)

我们拿着个 access_token 放在 header 来访问 /aaa 接口试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4930687fa5841a284335de8a03b4cf1~tplv-k3u1fbpfcp-watermark.image?)

可以看到，请求之前打印了访问的 controller、handler、user等信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ab9cb388bb84a6aa6b351489aa9c2ba~tplv-k3u1fbpfcp-watermark.image?)

响应之后打印了接口耗时和响应内容等信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d41fc558b07845c39485d3ad8851422e~tplv-k3u1fbpfcp-watermark.image?)

为什么 interceptor 里能拿到 user 信息呢？

因为这是在 LoginGuard 里从 jwt 取出来放到  request.user 的，而 Guard 在 interceptor 之前调用：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24060e0f32204907887ede38c1aa018c~tplv-k3u1fbpfcp-watermark.image?)

然后实现普通用户和管理员修改密码、修改信息的接口。

涉及到这 4 个页面：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c114411bf1274e2a9f202d5188ebf55a~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba086b9a407b469fbc79517adeb22ce1~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed7c126be9bb4a8ba9283af6d2974331~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e41292a1b954faaa343a2bf166500d5~tplv-k3u1fbpfcp-watermark.image?)

分别是 /user/update_password 和 /user/admin/update_password、/user/update、/user/admin/update

不过在修改信息之前，需要先实现查询用户信息的接口，用来回显数据。

在 UserController 添加一个 /user/info 接口：

```javascript
@Get('info')
@RequireLogin()
async info(@UserInfo('userId') userId: number) {
  return await this.userService.findUserDetailById(userId);
}
```
用前面封装的自定义装饰器 @UserInfo 从 reqeust.user 取 userId 注入 handler。

加上 @RequireLogin 装饰，这样 LoginGuard 就会对 /user/info 的请求做登录检查。

在 UserService  实现 findUserDetailById 方法：

```javascript
async findUserDetailById(userId: number) {
    const user =  await this.userRepository.findOne({
        where: {
            id: userId
        }
    });

    return user;
}
```
我们测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/966a6657688d4a6fa6791451b66cf3ea~tplv-k3u1fbpfcp-watermark.image?)

登录用户端，拿到 access_token。

然后加到 header 里访问 /user/info

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cdd9f904865481d9c38f29e15d90c45~tplv-k3u1fbpfcp-watermark.image?)

成功拿到了 user 的信息。

但这些信息并不是全都需要，比如密码就不需要返回。

我们创建个 vo 来封装返回的结果：

创建 /user/vo/user-info.vo.ts

```javascript
export class UserDetailVo {
    id: number;

    username: string;

    nickName: string;

    email: string;

    headPic: string;

    phoneNumber: string;

    isFrozen: boolean;

    createTime: Date;
}
```
然后把 controller 里的返回值封装成 vo：

```javascript
@Get('info')
@RequireLogin()
async info(@UserInfo('userId') userId: number) {
  const user = await this.userService.findUserDetailById(userId);

  const vo = new UserDetailVo();
  vo.id = user.id;
  vo.email = user.email;
  vo.username = user.username;
  vo.headPic = user.headPic;
  vo.phoneNumber = user.phoneNumber;
  vo.nickName = user.nickName;
  vo.createTime = user.createTime;
  vo.isFrozen = user.isFrozen;

  return vo;
}
```
测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c49feb281701423baa0616962971bd20~tplv-k3u1fbpfcp-watermark.image?)

现在返回的内容就是合理的了。

然后实现修改密码的接口：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a65f846d206a403087fad09b01e1d934~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19a290b2c22f4fe680469d6487f9c462~tplv-k3u1fbpfcp-watermark.image?)

管理员和用户修改密码的页面是一样的，我们就用一个接口就好了。

```javascript
@Post(['update_password', 'admin/update_password'])
@RequireLogin()
async updatePassword(@UserInfo('userId') userId: number, @Body() passwordDto: UpdateUserPasswordDto) {
    console.log(passwordDto);
    return 'success';
}
```

@Post 写个数组，就代表数组里的这两个路由是同一个 handler 处理。

这个接口同样是需要登录的，所以加上 @RequireLogin 的装饰器。

用 @UserInfo 从 request.user 取 userId，其余的通过 dto 传。

创建 src/user/dto/update-user-password.dto.ts

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
        message: '验证码不能为空'
    })
    captcha: string;
}
```
需要传的是邮箱、密码、验证码。

确认密码在前端和密码对比就行，不需要传到后端。

测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2d55bf2cbdb4f67b9e25f3f4249aac3~tplv-k3u1fbpfcp-watermark.image?)

登录用户端，拿到 access_token，然后访问 /user/update_password 和 /user/admin/update_password 接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cafdf225f1384f118de02dafb7f06ec6~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e52666915b4ad482a685a8e7b41a42~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3292d88ef3a648a8bf4285ce6e0c9234~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b67e1b0442614ec68ef0e765a4b7ecfa~tplv-k3u1fbpfcp-watermark.image?)

都能正常接收到数据。

然后实现下具体的更新密码的逻辑：

先查询 redis 中有没有邮箱对应的验证码，没有的话就返回验证码不存在或者不正确。

查到的话再调用 Repository 去更新数据库中的用户密码。

也就是这样的：

在 UserController 里调用 UserService 的方法：

```javascript
@Post(['update_password', 'admin/update_password'])
@RequireLogin()
async updatePassword(@UserInfo('userId') userId: number, @Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(userId, passwordDto);
}
```
UserService 实现具体的逻辑：
```javascript
async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);

    if(!captcha) {
        throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if(passwordDto.captcha !== captcha) {
        throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId
    });

    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch(e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
}
```
先查询 redis 中有相对应的验证码，检查通过之后根据 id 查询用户信息，修改密码之后 save。

测试下：

登录 lisi 账号，拿到 access_token

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e319f1f1a75649e7a0bd17ffc6127bb2~tplv-k3u1fbpfcp-watermark.image?)

数据库中可以查到 lisi 的邮箱：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25c7bb113f8547b8883790c9ed3b2a3d~tplv-k3u1fbpfcp-watermark.image?)

带上 access_token 访问更新密码接口：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c65750439d5a40058510dafcd5b6f494~tplv-k3u1fbpfcp-watermark.image?)

先手动去 redis 里添加 update_password_captcha_yy@yy.com 的 key，值为 123123（注意，我们现在用的是 redis 的 db1）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/933ce5b5ab3b4bf782583aa2cf362334~tplv-k3u1fbpfcp-watermark.image?)

半小时过期。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ef5d9c41ccd4de189dd47bf002f26b3~tplv-k3u1fbpfcp-watermark.image?)

然后再试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c06ef3cd4ae4293bc9e76dfb2036261~tplv-k3u1fbpfcp-watermark.image?)

修改成功。

数据库里看不到具体的密码，但也能看出确实变了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0712607079b34a3997aee3ee4a484ea0~tplv-k3u1fbpfcp-watermark.image?)

之前是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25c7bb113f8547b8883790c9ed3b2a3d~tplv-k3u1fbpfcp-watermark.image?)

然后我们登录下试试就知道了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a67c4ee5c824ecaa059abc98bcbbb2d~tplv-k3u1fbpfcp-watermark.image?)

用之前的密码登录，会提示密码错误。

换成新密码就好了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f38faa8921947adb024ad8384d146db~tplv-k3u1fbpfcp-watermark.image?)

然后再加上这个发送邮箱验证码的接口：
```javascript
@Get('update_password/captcha')
async updatePasswordCaptcha(@Query('address') address: string) {
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
和之前注册验证码的逻辑一样。

然后还有修改个人信息的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed7c126be9bb4a8ba9283af6d2974331~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e41292a1b954faaa343a2bf166500d5~tplv-k3u1fbpfcp-watermark.image?)

对应 /user/udpate 和 /user/admin/update 接口。

回显数据的接口就用 /user/info 这个。

实现流程和修改密码的差不多：

```javascript
@Post(['update', 'admin/update'])
@RequireLogin()
async update(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(userId, updateUserDto); 
}
```
在 UserController 定义两个 post 接口。

创建 src/user/dto/udpate-user.dto.ts

```javascript
import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserDto {

    headPic: string;

    nickName: string;
    
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
这里 headPic 和 nickName 就不做非空约束了，也就是说可以不改。

对应的 UserService 里的逻辑和修改密码的差不多：

```javascript
async update(userId: number, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(`update_user_captcha_${updateUserDto.email}`);

    if(!captcha) {
        throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if(updateUserDto.captcha !== captcha) {
        throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId
    });

    if(updateUserDto.nickName) {
        foundUser.nickName = updateUserDto.nickName;
    }
    if(updateUserDto.headPic) {
        foundUser.headPic = updateUserDto.headPic;
    }

    try {
      await this.userRepository.save(foundUser);
      return '用户信息修改成功';
    } catch(e) {
      this.logger.error(e, UserService);
      return '用户信息修改成功';
    }
}
```
只不过现在是传了的属性才会修改，没传的不修改。

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e71ec42689634a16babd5168267d07e9~tplv-k3u1fbpfcp-watermark.image?)

登录 lisi 账号拿到 token

带上 token 访问 /user/update 接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/541a3999e234491e934cca29000332c4~tplv-k3u1fbpfcp-watermark.image?)

提示验证码失效，在 redis 里添加 update_user_captcha_yy@yy.com 的 key，值为 123456

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c8cff2e7c6149dfb6222f7cea7661f4~tplv-k3u1fbpfcp-watermark.image?)

然后再试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43ca8c083d7b4b168d954870f0f647c6~tplv-k3u1fbpfcp-watermark.image?)

用户信息修改成功了，在数据库里也可以看到确实修改了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57a1d28fd08d44abaea93fa7ee562e9e~tplv-k3u1fbpfcp-watermark.image?)

这样，修改接口就完成了。

然后还要加一个发验证码的接口，这个和别的发验证码的逻辑一样：

```javascript
@Get('update/captcha')
async updateCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2,8);

    await this.redisService.set(`update_user_captcha_${address}`, code, 10 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的验证码是 ${code}</p>`
    });
    return '发送成功';
}
```
代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/meeting_room_booking_system_backend)。
## 总结

这节我们添加了 interceptor 用来对响应格式做转换，改成 {code、message、data} 的格式，用到了 map 操作符。

并且还用 interceptor 实现了接口访问的日志记录，用到 tap 操作符。

然后实现了修改信息、修改密码的接口。

这些流程都差不多，首先实现一个查询的接口用来回显数据，通过 vo 封装返回的数据。

然后提交数据进行更新，用到的 userId 通过之前封装的 @UserInfo 装饰从 request.user 来取。

还剩个列表接口，我们下节再写。
