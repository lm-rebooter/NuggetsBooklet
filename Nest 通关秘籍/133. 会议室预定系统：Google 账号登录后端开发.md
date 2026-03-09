我们的网站实现了用户名密码登录，用户忘记了密码也可以通过邮箱验证码来修改密码，之后再登录。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6f63c17eb0c4783b77ef0813935f035~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150&h=864&s=59138&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e45db567c64b9bb1b4ad59555906ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=1054&s=79268&e=png&b=ffffff)

这样功能上没问题，但是不方便。

用户会访问很多个网站，如果每个网站都需要注册一个账号，那对于不常用的网站，很容易忘记账号密码。

解决方式就是支持三方账号登录。

比如 [dockerhub 的登录](https://login.docker.com/u/login)：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40d953edc6894e81ad2d610aff1810b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=1376&s=105844&e=png&b=fffefe)

你可以登录 google、github 账号，然后授权，这样 dockerhub 网站就可以自动登录了。

根本不需要单独的账号密码。

原理就是他用你 github、google 的信息来给你创建了一个账号，之后只要是同样的 github、google 信息就可以自动登录了。

当你第一次授权的时候：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29610e4ad720418ebe4f8ea18037071c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3010&h=1760&s=681898&e=gif&f=50&b=f6f8fa)

会跳到这个页面：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/913e3d5ed69a4d0596bdca2cfb0a44db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=1254&s=113865&e=png&b=ffffff)

因为缺少了 username 的信息，你填上之后就可以注册了。

并且它还自动给你登录了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdb698d7438d47a6a5b2a64b207eee7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=940&s=466540&e=png&b=ffffff)

然后退出登录用 google 账号登录一次：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/405f2dc31d904f4da403adac6de1cad1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2302&h=1640&s=323303&e=gif&f=41&b=f7f7f9)

因为你授权过，短时间内不需要再次授权，于是就直接登录了。

感受下现在的登录体验。

需要记住用户名密码么？

不需要。

你只需要点下 google 登录，然后授权，就自动登录了。

我们也在会议室预定系统里集成下 google 登录。

会用到 passport-google 的策略来做三方登录，所以要集成 passport。

进入 backend 项目，安装 passport 的包：

```
npm install --save @nestjs/passport passport
```
安装用户名密码认证的 passport-local 策略包：

```
npm install --save passport-local
npm install --save-dev @types/passport-local
```
然后创建一个认证模块：

```
nest g module auth
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1ea9198bd34913a6361f3434c70b67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=124&s=36435&e=png&b=181818)

添加用户名密码认证的策略 auth/local.strategy.ts

```javascript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  async validate(username: string, password: string) {
    
  }
}
```

这里需要用到 UserService，在 UserModule 导出一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaacfe532cf2458698d8af3e3599c443~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=754&s=169512&e=png&b=1f1f1f)

然后 AuthModule 引入 UserModule：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62633dd7a02e48a5a1be2448b5f3228e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=394&s=81178&e=png&b=1f1f1f)

并把 LocalStrategy 声明为 provider。

LocalStrategy 里直接复用 userService.login 来做登录认证：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efd13f8b2569461fb01608001d4d1c40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1266&h=814&s=204869&e=png&b=1f1f1f)

passport 会把返回的 user 信息放在 request.user 上。

然后 user/login 里就不需要手动调用 userService 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd27476102ee4fd19dd99cf36ea3607b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1422&h=1440&s=319258&e=png&b=1f1f1f)

改成这样，用 AuthGuard('local') 来做处理即可，处理完从 reqeust.user 里拿 user 信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4546768a249040e784e706766d701f7c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1324&h=1470&s=310875&e=png&b=1f1f1f)

把服务跑起来：

```
npm run start:dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f99eefdca68f43b889ef8c27ac72dde4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1852&h=676&s=419904&e=png&b=181818)

然后进入 frontend_user 也把开发服务跑起来：

```
npm run start
```

当用户不存在：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/707fecc46cbc40458ca92a0245d1b014~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2506&h=956&s=142235&e=png&b=fefefe)

当密码错误：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9b8788ec67a4bf3a60a2de7586a3b33~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2508&h=924&s=145521&e=png&b=fefefe)

用户名密码都正确时：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb32630f8da14e5a94dfdf4eaad91e0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2144&h=1498&s=411294&e=gif&f=32&b=fefefe)

没啥问题。

这样，我们的 passport 就集成成功了。

当然，passport-local、passport-jwt 都不集成也可以，直接用 passport-google 和 passport-github 就行。

各个策略都是独立的，可以单独使用。

下面我们来实现 google 和 github 登录：

上节我们实现了 Github 登录，这节继续来实现下 Google 登录。

在 [passport 的网站](https://www.passportjs.org/packages/)搜索：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2912fbdf8bf645579f2b51fdfab70107~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2376&h=1446&s=283080&e=png&b=131313)

找下载量最多的那个。

然后安装下：

```
npm install --save passport-google-oauth20
npm install --save-dev @types/passport-google-oauth20
```

获取 client id 和 client secret 的步骤[前面章节](https://juejin.cn/book/7226988578700525605/section/7376480527337193482)讲过。

授权的域名、callback url 要和应用中的对应才行，否则就重新搞一个。

我这里重新注册了一个应用，拿到了 client id：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0916d2b458854875acd2a3d60d841eb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1598&h=1690&s=240244&e=png&b=fefefe)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83a55ea3d20449f3ab019af22bec2c1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1374&h=1244&s=195942&e=png&b=f1f1f1)

创建 auth/google.strategy.ts

```javascript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '535538293892-fso0juek6ag5eupus679gnrgt3g5gknq.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3005/user/callback/google',
      scope: ['email', 'profile'],
    });
  }

  validate (accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }
    return user;
  }
}
```
这里填入刚刚的 clientID、clientSecret、callbackURL。

在 AuthModule 引入：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1216c1b4fc3e4b0b8876b4ae00b7357b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=490&s=108602&e=png&b=1f1f1f)

之后在 UserController 添加两个路由：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/261a5babe1eb4299af8b528afc9edf52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=912&s=183344&e=png&b=1f1f1f)

```javascript
@Get('google')
@UseGuards(AuthGuard('google'))
async googleAuth() {}

@Get('callback/google')
@UseGuards(AuthGuard('google'))
googleAuthRedirect(@Req() req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
}
```
一个是触发登录的，一个是回调的。

测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33d522db33fa4f3fbd363b7178672508~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2572&h=1514&s=632461&e=gif&f=42&b=fdfdfd)

可以看到，google 的用户信息拿到了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f22bac24b328413cacf08d69b4bad65b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2126&h=756&s=180895&e=png&b=fdfdfd)

那我们只要在拿到用户信息的时候自动注册下就好了。

在 user.entity.ts 添加 loginType 字段：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2b6517401574b99b9a909b90ed8d41e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=786&s=126182&e=png&b=1f1f1f)

```javascript
@Column({
    type: 'int',
    comment: '登录类型, 0 用户名密码登录, 1 Google 登录, 2 Github 登录',
    default: 0
})
loginType: LoginType;
```

```javascript
export enum LoginType {
    USERNAME_PASSWORD = 0,
    GOOGLE = 1,
    GITHUB = 2
}
```
默认是用户名密码登录，值是 0，当 google 或者 github 登录时，loginType 是 1 和 2。

因为前几节我们把 synchronize 关掉了，所以现在并不会自动创建这一列：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e95f9ac425c646e5aeab35817ea923b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1514&h=748&s=360338&e=png&b=ededed)

我们通过 migration:generate 生成个迁移：

```
npm run migration:generate src/migrations/add-user-loginType-column
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24b0520de6c9435fb7c73c8bf6f712db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1768&h=632&s=197174&e=png&b=191919)

生成的迁移类没问题：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3b29abe58ad4f90afc236d7d21cf310~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2850&h=618&s=238651&e=png&b=1e1e1e)

跑一下：

```
npm run migration:run
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f2ee3a157b24e27b663ed2247ae83f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=668&s=183189&e=png&b=191919)

在数据库看一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5631130caee947088bd740febbbe2014~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1822&h=1078&s=505234&e=png&b=f1f1f1)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d403b997b92740e79764275c4e9c9f6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2814&h=508&s=485839&e=png&b=f1f1f1)

loginType 列添加成功了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1950453c0b42f9bfb05cedabc0a096~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1336&h=616&s=229239&e=png&b=f0f0f0)

migrations 表也记录了这条执行记录。

然后补充下 google 授权后自动注册的逻辑：

在 UserService 里添加 registerByGoogleInfo 方法：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb62274cb8f0427b9d477e9faaa8e66a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1352&h=898&s=217593&e=png&b=1f1f1f)

```javascript
async registerByGoogleInfo(email: string, nickName: string, headPic: string) {
    const newUser = new User();
    newUser.email = email;
    newUser.nickName = nickName;
    newUser.headPic = headPic;
    newUser.password = '';
    newUser.username = email + Math.random().toString().slice(2, 10);
    newUser.loginType = LoginType.GOOGLE;
    newUser.isAdmin = false;

    return this.userRepository.save(newUser);
}
```

email、nickName、headPic 都是基于 google 返回的信息。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61da221fa4834f7791e81085642ab6ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1872&h=704&s=169770&e=png&b=fdfdfd)

username 我们就用 email + 随机数的方式生成，反正也不需要用用户名密码登录，保证唯一就行。

passport 也是一样。

在 UserController 调用下：

```javascript
@Get('callback/google')
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Req() req) {
  if (!req.user) {
    throw new BadRequestException('google 登录失败');
  }
  const user = await this.userService.registerByGoogleInfo(
    req.user.email, 
    req.user.firstName + ' ' + req.user.lastName,
    req.user.picture
  );

  const vo = new LoginUserVo();
  vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: [],
      permissions: []
  }

  vo.accessToken = this.jwtService.sign({
    userId: vo.userInfo.id,
    username: vo.userInfo.username,
    email: vo.userInfo.email,
    roles: vo.userInfo.roles,
    permissions: vo.userInfo.permissions
  }, {
    expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
  });

  vo.refreshToken = this.jwtService.sign({
    userId: vo.userInfo.id
  }, {
    expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
  });

  return vo;
}
```
就是用 google 返回的信息来自动注册，并且自动登录，返回 accessToken 和 refreshToken。

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca9b62b8579e4bf8a3e29744c920a321~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2952&h=1500&s=1258296&e=gif&f=48&b=f7f7fd)

可以看到，google 授权之后，自动注册并返回了 token 信息，这样带上这个访问就是登录状态了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9c532da37c0464ab3643e4ccf860ae7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1764&h=938&s=241584&e=png&b=fdfdfd)

数据库里 user 表也插入了该用户的记录：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2245fe61eb7448289ac1449a2252924~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2892&h=446&s=516791&e=png&b=f6f6f6)

nickName、headPic、username、loginType 都是对的。

后续 refreshToken 的流程不受影响，因为它只是取出 jwt 里的 userId 来查询用户信息并重新生成 token 返回：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d92b99beba154c82b5cb1619c6bc3e94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=1206&s=250410&e=png&b=1f1f1f)

然后继续处理 google 登录：

google 第一次账号授权会自动注册并登录，但是后续就不需要注册了。

所以我们要加个判断：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75b363bd947a439eb134c232865c29c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1344&h=1764&s=414561&e=png&b=202020)

如果 email 能查到用户，那就直接登录：

```javascript
@Get('callback/google')
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Req() req) {
  if (!req.user) {
    throw new BadRequestException('google 登录失败');
  }

  const foundUser = await this.userService.findUserByEmail(req.user.email);

  if(foundUser) {
    const vo = new LoginUserVo();
    vo.userInfo = {
        id: foundUser.id,
        username: foundUser.username,
        nickName: foundUser.nickName,
        email: foundUser.email,
        phoneNumber: foundUser.phoneNumber,
        headPic: foundUser.headPic,
        createTime: foundUser.createTime.getTime(),
        isFrozen: foundUser.isFrozen,
        isAdmin: foundUser.isAdmin,
        roles: foundUser.roles.map(item => item.name),
        permissions: foundUser.roles.reduce((arr, item) => {
            item.permissions.forEach(permission => {
                if(arr.indexOf(permission) === -1) {
                    arr.push(permission);
                }
            })
            return arr;
        }, [])
    }
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      email: vo.userInfo.email,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });
  
    return vo;
  } else {
    const user = await this.userService.registerByGoogleInfo(
      req.user.email, 
      req.user.firstName + ' ' + req.user.lastName,
      req.user.picture
    );

    const vo = new LoginUserVo();
    vo.userInfo = {
        id: user.id,
        username: user.username,
        nickName: user.nickName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        headPic: user.headPic,
        createTime: user.createTime.getTime(),
        isFrozen: user.isFrozen,
        isAdmin: user.isAdmin,
        roles: [],
        permissions: []
    }

    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      email: vo.userInfo.email,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });
  
    return vo;
  }
}
```
在 UserService 实现 findUserByEmail 方法：

```javascript
async findUserByEmail(email: string) {
    const user =  await this.userRepository.findOne({
        where: {
            email: email,
            isAdmin: false,
        },
        relations: [ 'roles', 'roles.permissions']
    });

    return user;
}
```

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/741b03d9e51e4dc7a2de29420d9ba12c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3272&h=1706&s=1369655&e=gif&f=50&b=f8f7fd)

数据库已经注册了这个 google 账号对应的 user，再次授权，会查询注册的用户信息返回。

可以看到，只执行了 select 语句：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a378e39592714109a8edafb0d5c9356f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2090&h=896&s=405111&e=png&b=191919)

但网站登录后一般都会重定向到首页：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bbff9cd49fd437f8a53da4e9878d990~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2470&h=1668&s=346352&e=gif&f=37&b=fafafa)

这时候一般都是用 cookie 返回 token 的，比如 https://hub.docker.com 就是这么做的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6366bb960bc415898b20c07c252dd87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2034&h=1034&s=328113&e=png&b=faf8fd)

可以看到，它并不是直接返回 jwt 的 token，而是重定向回首页，在 cookie 里携带 token。

前端只要判断下如果 cookie 里有这些 token 就自动登录就好了。

我们也处理下：

操作 cookie 需要用到 cookie-parser 中间件：

```
npm install --save cookie-parser

npm install --save-dev @types/cookie-parser
```
在 main.ts 启用下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f1f2e7640944dd8b8bb6e2705bec5ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=816&s=218361&e=png&b=1f1f1f)

在 callback/google 里注入 Response，设置 cookie：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b31c3675a37408fbb8421a82eabe154~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=958&s=236055&e=png&b=1f1f1f)

然后重定向：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89740bb2afda4e82a424df5a588d0078~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=1050&s=239038&e=png&b=1f1f1f)

试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5aece83909a4c4188c3b5777cf1d583~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2320&h=1496&s=428112&e=gif&f=29&b=f7f6fc)

重定向没问题。

cookie 也没问题：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d692058b9a04e49bcfe61981a227980~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3094&h=1044&s=521317&e=png&b=faf8fd)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/008a6c63c8bc43a5b69f520719b4eecb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2236&h=1050&s=392944&e=png&b=fbf9fd)

此外，我们还要处理下普通的登录，用户名密码登录的时候要过滤下 loginType：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fdd12e697a3400a88240ed97fe988f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=712&s=144657&e=png&b=1f1f1f)

google 登录的账号是不能通过用户名密码登录的。

这样，google 登录的后端部分就完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/meeting_room_booking_system_backend)

## 总结

我们的应用之前只支持用户名密码登录，今天实现了 google 登录的后端部分。

首先我们把用户名密码的身份认证改成了用 passport。

当然，这不是必须的，每个策略都是可以独立用的。

然后我们创建了新的 google 应用，拿到 client id 和 client secret。

用 passport-google-oauth20 的策略来实现了 google 登录。

在 callback 的路由里，基于 google 返回的信息做了自动注册，如果用户已经注册过，就直接返回登录信息。

google 登录的 callback 里重定向到网站首页，然后通过 cookie 携带 userInfo、accessToken、refreshToken 等信息。

前端代码再处理下 cookie，同步登录状态就好了。
