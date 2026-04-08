前面我们实现了基于 JWT 的登录，流程是这样的：

登录认证通过之后，把用户信息放到 jwt 里返回：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43cb79b2d63046e6856417489832c81f~tplv-k3u1fbpfcp-watermark.image?)

访问接口的时候带上 jwt，在 Guard 里取出来判断是否有效，有效的话才能继续访问：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b4ef812d409492d90ab8c9ac72ccefd~tplv-k3u1fbpfcp-watermark.image?)

但是这样有个问题：

jwt 是有有效期的，我们设置的是 7 天，实际上为了安全考虑会设置的很短，比如 30 分钟。

这时候用户可能还在访问系统的某个页面，结果访问某个接口返回 token 失效了，让重新登录。

体验是不是就很差？

为了解决这个问题，服务端一般会返回两个 token：access_token 和 refresh_token

access_token 就是用来认证用户身份的，之前我们返回的就是这个 token。

而 refresh_token 是用来刷新 token 的，服务端会返回新的 access_token 和 refresh_token

也就是这样的流程：

登录成功之后，返回两个 token：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88f3b502a99545b7ac05e74ea2283089~tplv-k3u1fbpfcp-watermark.image?)

access_token 用来做登录鉴权：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dae93c8a46d04169bc1c85fd387cd550~tplv-k3u1fbpfcp-watermark.image?)

而 refresh_token 用来刷新，拿到新 token：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de50c9a6f381499182f4ffb49a0cad0c~tplv-k3u1fbpfcp-watermark.image?)

access_token 设置 30 分钟过期，而 refresh_token 设置 7 天过期。

这样 7 天内，如果 access_token 过期了，那就可以用 refresh_token 刷新下，拿到新 token。、

只要不超过 7 天未访问系统，就可以一直是登录状态，可以无限续签，不需要登录。

如果超过 7 天未访问系统，那 refresh_token 也就过期了，这时候就需要重新登录了。

想想你常用的 app，登录过几次？

是不是常用的 app 基本不用重新登录？

如果你超过一段时间没使用这个 app，是不是又会让你重新登录了？

一般 app 里用的就是这种双 token 来做登录鉴权。

下面我们也来实现下这种机制。

创建个 nest 项目：

```
nest new access_token_and_refresh_token -p npm
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/657be2eda39b4a429165c5fac2db2d9e~tplv-k3u1fbpfcp-watermark.image?)

添加 user 模块：

```
nest g resource user --no-spec
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7db563e3020443e8c779e181d0b8ada~tplv-k3u1fbpfcp-watermark.image?)

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
      database: "refresh_token_test",
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
在 mysql workbench 里创建用到的 database：

```sql
CREATE DATABASE refresh_token_test DEFAULT CHARACTER SET utf8mb4;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc5755fb1c9a4fa3b5750ad63784aa13~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a6e7ff89f304ed9a0264359167d19f1~tplv-k3u1fbpfcp-watermark.image?)

然后新建 User 的 entity：

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
```
在 entities 里添加 User：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c56b1e4736f6423f9c589d18e6ea2446~tplv-k3u1fbpfcp-watermark.image?)

然后把服务跑起来：

```
npm run start:dev
```
会生成建表 sql：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02a37f11e95242ac8619cf213f923ca3~tplv-k3u1fbpfcp-watermark.image?)

在 mysql workbench 里可以看到 user 表：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bd36dfe0fef4e11b860a5c972bc0aa5~tplv-k3u1fbpfcp-watermark.image?)

然后在 UserController 添加 login 的 post 接口：

```javascript
@Post('login')
login(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    return 'success';
}
```
创建 src/user/dto/login-user.dto.ts

```javascript
export class LoginUserDto {
    username: string;
    password: string;
}
```
测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b29e977b52641b5883c945deb124cfb~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0afdbe417fba42efa44f66b9239d845c~tplv-k3u1fbpfcp-watermark.image?)

然后实现下登录逻辑。

在 UserService 里添加 login 方法：

```javascript
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {

    @InjectEntityManager()
    private entityManager: EntityManager;

    async login(loginUserDto: LoginUserDto) {
        const user = await this.entityManager.findOne(User, {
            where: {
                username: loginUserDto.username
            }
        });

        if(!user) {
            throw new HttpException('用户不存在', HttpStatus.OK);
        }

        if(user.password !== loginUserDto.password) {
            throw new HttpException('密码错误', HttpStatus.OK);
        }

        return user;
    }
}
```
然后登录成功之后要返回两个 token

我们引入下 jwt 的包：

```
npm install --save @nestjs/jwt
```
在 AppModule 引入 JwtModule，设置为全局模块，指定默认过期时间和密钥：

```javascript
JwtModule.register({
  global: true,
  signOptions: {
    expiresIn: '30m'
  },
  secret: 'guang'
})
```

然后在 UserController 生成两个 token 返回：

```javascript
@Inject(JwtService)
private jwtService: JwtService;

@Post('login')
async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    const access_token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
    }, {
      expiresIn: '30m'
    });

    const refresh_token = this.jwtService.sign({
      userId: user.id
    }, {
      expiresIn: '7d'
    });

    return {
      access_token,
      refresh_token
    }
}
```

access_token 里存放 userId、username，refresh_token 里只存放 userId 就好了。

过期时间一个 30 分钟，一个 7 天。

访问下试试：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1f0c032086496796c03726f6269583~tplv-k3u1fbpfcp-watermark.image?)

接下来再实现 LoginGuard 来做登录鉴权：

```
nest g guard login --flat --no-spec
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc482472355e463aa009336770218333~tplv-k3u1fbpfcp-watermark.image?)

登录鉴权逻辑和之前一样：

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

    const authorization = request.headers.authorization;

    if(!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try{
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);

      return true;
    } catch(e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
```

取出 authorization header 中的 jwt token，这个就是 access_token，对它做校验。

jwt 有效就可以继续访问，否则返回 token 失效，请重新登录。

然后在 AppController 添加个接口加上登录鉴权：

```javascript
@Get('aaa')
aaa() {
    return 'aaa';
}

@Get('bbb')
@UseGuards(LoginGuard)
bbb() {
    return 'bbb';
}
```

aaa 接口可以直接访问，bbb 接口需要登录后才能访问。

在 user 表添加条记录：

```sql
INSERT INTO `refresh_token_test`.`user` (`id`, `username`, `password`)
  VALUES ('1', 'guang', '123456');
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/152d619a0f4a475299ab92b3a3af6184~tplv-k3u1fbpfcp-watermark.image?)

我们测试一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34d1f3b5594e42d28c4111553f2e79b6~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b121aa10e5e4ba882b8f0c7f6d90424~tplv-k3u1fbpfcp-watermark.image?)

鉴权逻辑生效了。

然后我们登录下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3770ea8e3e474424ac8c458b405d6a36~tplv-k3u1fbpfcp-watermark.image?)

把 access_token 复制下来，加到 header 里再访问：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a5889d842654a5d811b4ce7054e76cc~tplv-k3u1fbpfcp-watermark.image?)

这样就能访问了。

现在的 access_token 是 30 分钟过期，30分钟之后就需要重新登录了。

这样显然体验不好，接下来实现用 refresh_token 来刷新的逻辑：

```javascript
  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId);

      const access_token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
      }, {
        expiresIn: '30m'
      });

      const refresh_token = this.jwtService.sign({
        userId: user.id
      }, {
        expiresIn: '7d'
      });

      return {
        access_token,
        refresh_token
      }
    } catch(e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
```
取出 refresh_token 里的 userId，从数据库中把 user 信息查出来，然后生成新的 access_token 和 refresh_token 返回。

如果 jwt 校验失败，就返回 token 已失效，请重新登录。

在 UserService 实现下这个 findUserById 的方法：

```javascript
async findUserById(userId: number) {
    return await this.entityManager.findOne(User, {
        where: {
            id: userId
        }
    });
}
```
测试下：

带上有效的 refresh_token，能够拿到新的 access_token 和 refresh_token：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c724094705c4ed784e2e83271c70ef4~tplv-k3u1fbpfcp-watermark.image?)

refresh_token 失效或者错误时，会返回 401 的响应码，提示需要重新登录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72bffc1901d649eeb94a85103504c4e3~tplv-k3u1fbpfcp-watermark.image?)

这样，我们就实现了双 token 的登录鉴权机制。

只要 7 天内带上 refresh_token 来拿到新的 token，就可以一直保持登录状态。

那前端代码里访问接口的时候怎么用这俩 token 呢？

我们新建个 react 项目试一下：

```
npx create-react-app --template=typescript refresh_token_test
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02680261eced4af7bea581ead9d8a7c5~tplv-k3u1fbpfcp-watermark.image?)

安装 axios：

```
npm install --save axios
```

在 App.tsx 里访问下 /aaa、/bbb 接口：

```javascript
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [aaa, setAaa] = useState();
  const [bbb, setBbb] = useState();

  async function query() {
    const { data: aaaData } = await axios.get('http://localhost:3000/aaa');
    const { data: bbbData } = await axios.get('http://localhost:3000/bbb');

    setAaa(aaaData);
    setBbb(bbbData);
  }
  useEffect(() => {
    query();
  }, [])
  

  return (
    <div>
      <p>{aaa}</p>
      <p>{bbb}</p>
    </div>
  );
}

export default App;
```
在服务端开启跨域支持：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bfe81dd830f42d4b8c81c8278e0212c~tplv-k3u1fbpfcp-watermark.image?)

把开发服务跑起来：

```
npm run start
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e96bf4d718b49f5854522fd0d2f0294~tplv-k3u1fbpfcp-watermark.image?)

可以看到 /aaa 访问成功，返回了数据，/bbb 返回了 401

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2101b928c63e402ba50b7abfe105122f~tplv-k3u1fbpfcp-watermark.image?)

这里请求两次是因为 index.tsx 里面有个 React.StrictMode，把它去掉就好了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea0cf38f69ed45ae93839d0854bfd73f~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e7da697f3544200951a4ba83608027b~tplv-k3u1fbpfcp-watermark.image?)

我们先登录一下，拿到 access_token，然后在请求的时候带上：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71609c4adff2484081cfa301dbc952ba~tplv-k3u1fbpfcp-watermark.image?)

```javascript
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [aaa, setAaa] = useState();
  const [bbb, setBbb] = useState();

  async function login() {
    const res = await axios.post('http://localhost:3000/user/login', {
        username: 'guang',
        password: '123456'
    });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
  }

  async function query() {
    await login();

    const { data: aaaData } = await axios.get('http://localhost:3000/aaa');
    const { data: bbbData } = await axios.get('http://localhost:3000/bbb', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token') 
      }
    });

    setAaa(aaaData);
    setBbb(bbbData);
  }
  useEffect(() => {
    query();
  }, [])
  

  return (
    <div>
      <p>{aaa}</p>
      <p>{bbb}</p>
    </div>
  );
}

export default App;
```

刷新下，可以看到现在请求了 3 个接口，bbb 也正确拿到了数据：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdd8e596ac5e49a4a039f71b62553506~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/311dd7a87c604aa48d4754cf6cad7853~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6d8c93ed61e420bafaeefda287d8f03~tplv-k3u1fbpfcp-watermark.image?)

如果很多接口都要添加这个 header，可以把它放在 interceptors 里做：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/338068bb91c14b859f58a80394aac14a~tplv-k3u1fbpfcp-watermark.image?)

```javascript
axios.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  if(accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
})
```
测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cd270d2f6c74078a4cc9dddfa96dfed~tplv-k3u1fbpfcp-watermark.image?)

效果是一样的。

再就是当 token 失效的时候，要自动刷新，这个也可以在 interceptors 里做：

```javascript

async function refreshToken() {
  const res = await axios.get('http://localhost:3000/user/refresh', {
      params: {
        refresh_token: localStorage.getItem('refresh_token')
      }
  });
  localStorage.setItem('access_token', res.data.access_token || '');
  localStorage.setItem('refresh_token', res.data.refresh_token || '');
  return res;
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        
      const res = await refreshToken();

      if(res.status === 200) {
        return axios(config);
      } else {
        alert('登录过期，请重新登录');
        return Promise.reject(res.data)
      }
        
    } else {
      return error.response;
    }
  }
)
```
如果返回的错误是 401 就刷新 token，这里要排除掉刷新的 url，刷新失败不继续刷新。

如果刷新接口返回的是 200，就用新 token 调用之前的接口

如果返回的是 401，那就返回这个错误。

判断下如果没有 access_token 才登录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9641ed559ce47989158165b286f0af1~tplv-k3u1fbpfcp-watermark.image?)
```javascript
if(!localStorage.getItem('access_token')) {
  await login();
}
```
然后手动改下 access_token 的值，让它失效：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21d410307aa44e029a3d394ea2b3787b~tplv-k3u1fbpfcp-watermark.image?)

刷新下页面：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc5526d926334de794c7582fa6943626~tplv-k3u1fbpfcp-watermark.image?)

访问了 aaa、bbb 接口，bbb 接口 401 了，于是 refresh token，之后再次访问 bbb。

这样，我们就实现了 access_token 的无感刷新。

但这样还不完美，比如当并发多个请求的时候，如果都失效了，是不是要刷新多次?

我们加个并发请求试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b94dc9b07fb494eb82701e5d7b5876c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=512&e=png&b=1f1f1f)

```javascript
await [
  axios.get('http://localhost:3000/bbb'),
  axios.get('http://localhost:3000/bbb'),
  axios.get('http://localhost:3000/bbb')
];
```
手动让 access_token 失效，然后刷新页面：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24de1e46d7c3485f85182b2567c52827~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1526&h=508&e=png&b=fefefe)

确实刷新了多次，并发的 3 次，还有后面又访问了一次：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4c9027ab51541a4be0eaff34d7fd718~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=716&h=558&e=png&b=fafafa)

其实这样不处理也行，多刷几次也不影响功能。

但做的完美点还是要处理下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d14993808b8847448745dcaf022c3eeb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=862&h=834&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45c681fff3ab42d8abac906e87272459~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=826&e=png&b=1f1f1f)

加一个 refreshing 的标记，如果在刷新，那就返回一个 promise，并且把它的 resolve 方法还有 config 加到队列里。

当 refresh 成功之后，修改 refreshing 的值，重新发送队列中的请求，并且把结果通过 resolve 返回。

```javascript
interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}
let refreshing = false;
const queue: PendingTask[] = [];

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if(refreshing) {
      return new Promise((resolve) => {
          queue.push({
              config,
              resolve
          });
      });
    }

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        refreshing = true;

        const res = await refreshToken();

        refreshing = false;

        if(res.status === 200) {

          queue.forEach(({config, resolve}) => {
              resolve(axios(config))
          })
  
          return axios(config);
        } else {
          alert('登录过期，请重新登录');
          return Promise.reject(res.data);
        }
        
    } else {
      return error.response;
    }
  }
)
```
测试下：

手动让 access_token 失效然后刷新：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/454182ffa7324b21aba649cf5677065b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1376&h=424&e=png&b=fefefe)

现在就只刷新一次 token 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27ee2f8d316f46d9994e0cfd0d687233~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=788&h=422&e=png&b=fafafa)

最后，为什么说双 token 会更安全呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4ca1505657c4907aca4d75751d57388~tplv-k3u1fbpfcp-watermark.image?)

案例代码在小册仓库：

[后端代码](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/access_token_and_refresh_token)

[前端代码](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/refresh_token_test)

## 总结

这节我们实现了基于 access_token 和 refresh_token 的无感刷新登录状态，也就是无感续签。

access_token 用于身份认证，refresh_token 用于刷新 token，也就是续签。

在登录接口里同时返回 access_token 和 refresh_token，access_token 设置较短的过期时间，比如 30 分钟，refresh_token 设置较长的过期时间，比如 7 天。

当 access_token 失效的时候，可以用 refresh_token 去刷新，服务端会根据其中的 userId 查询用户数据，返回新 token。

在前端代码里，可以在登录之后，把 token 放在 localstorage 里。

然后用 axios 的 interceptors.request 给请求时自动带上 authorization 的 header。

用 intercetpors.response 在响应是 401 的时候，自动访问 refreshToken 接口拿到新 token，然后再次访问失败的接口。

我们还支持了并发请求时，如果 token 过期，会把请求放到队列里，只刷新一次，刷新完批量重发请求。

这就是 token 无感刷新的前后端实现，是用的特别多的一种方案。


