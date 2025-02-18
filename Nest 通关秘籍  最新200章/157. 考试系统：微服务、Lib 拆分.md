这节我们来做下微服务的拆分，并把一些公共 Module 放到 Lib 里。

创建项目：

```
nest new exam-system
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f14cc73883a74e6a873b75accb206365~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=700&s=155719&e=png&b=020202)

然后添加 4 个 app：

```
nest g app user
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/409f12961d7142869dbf451b07960866~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=636&s=163391&e=png&b=191919)

```
nest g app exam
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6e39cd379fb4d1f9b9c2c041b667215~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832&h=372&s=95037&e=png&b=191919)

```
nest g app answer
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8e996bf323f458aa2068d5b6e7f0075~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884&h=362&s=93095&e=png&b=191919)

```
nest g app analyse
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3092715c082a462880ee377066b2614b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=916&h=340&s=93174&e=png&b=191919)

看下现在的目录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e4cdf9ce24742fdbb789c411830575d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=548&h=814&s=87754&e=png&b=191919)

还有 nest-cli.json

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6035e9e15ba742e39c5bece8cc25b8a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=1162&s=189818&e=png&b=1f1f1f)

我们改下 user、exam、answer、analyse 的服务的启动端口，分别改为 3001、3002、3003、3004

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/359ff8f744ba4283b09578171f21732f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1350&h=588&s=133216&e=png&b=1d1d1d)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ca7535f9572470888b46bc74158c345~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1374&h=580&s=131863&e=png&b=1d1d1d)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6e5615896444d02b5f9b8d6084065c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1362&h=562&s=134568&e=png&b=1d1d1d)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c342385f24b14644878377949f3acf64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1408&h=504&s=128289&e=png&b=1d1d1d)

跑起来：

```
npm run start:dev user
npm run start:dev exam
npm run start:dev answer
npm run start:dev analyse
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0445704a55f4f16813c437308cb4bd5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2282&h=714&s=580723&e=gif&f=28&b=161616)

浏览器访问这 4 个服务的接口：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38ef245e829e4f388f6fc9c3beefe1f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=654&h=188&s=18918&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c6f339060aa43778fe09e584c55d837~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=662&h=160&s=18443&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34d119f6726443b0aed636ecd8287493~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=634&h=184&s=19258&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c55eb3ebe40949e2bdcf2c19ec46ee11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=622&h=168&s=18572&e=png&b=ffffff)

没啥问题。

多个微服务之间是可以相互调用的。

在根目录安装微服务的包：

```
npm install @nestjs/microservices --save
```
然后改下 exam 微服务，添加一个消息处理函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23ca93fa159b486c97e48a1a95c4d80a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540&h=708&s=219460&e=png&b=1d1d1d)

```javascript
@MessagePattern('sum')
sum(numArr: Array<number>): number {
    return numArr.reduce((total, item) => total + item, 0);
}
```
在 main.ts 里注册下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0106398ffd24de8bfb383f8acbe9123~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1368&h=698&s=191694&e=png&b=1e1e1e)

```javascript
app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
});
app.startAllMicroservices();
```
exam 服务暴露了 3002 的 HTTP 服务，现在用 connectMicroservice 就是再暴露 8888 的 TCP 服务。

在 answer 的服务里面调用下这个微服务：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17bb31040c704f649679dff0bc111def~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1536&h=826&s=230634&e=png&b=1d1d1d)
```javascript
ClientsModule.register([
  {
    name: 'EXAM_SERVICE',
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
  },
])
```
用客户端模块连接上 888 端口的微服务，然后在 Controller 里调用下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/261a1601cbb54439b37ce517efae6b94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1736&h=696&s=239814&e=png&b=1d1d1d)

```javascript
import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy

  @Get()
  async getHello() {
    const value = await firstValueFrom(this.examClient.send('sum', [1, 3, 5]));
    return this.answerService.getHello() + ' ' + value
  }
}
```
在之前的 hello world 接口里调用下微服务的 sum 方法。

用 firstValueFrom 取返回的值。

重新跑一下这两个服务：

```
npm run start:dev exam
npm run start:dev answer
```
试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b651b93e3ca5485ba8a7bc80427fe64d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=652&h=182&s=19781&e=png&b=ffffff)

微服务调用成功了。

虽然是隔着网络的两个服务，但是用起来和本地的 service 体验一样，这就是 RPC（远程过程调用）

user、exam、answer、analyse 微服务，各自提供 HTTP 接口，之间还可以通过 TCP 做相互调用。

那多个微服务的公共代码呢？

放在 lib 里。

比如 RedisModule：

```
nest g lib redis
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/208e53e953ff41149f19522a5e376292~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=194&s=72024&e=png&b=191919)

会让你指定一个前缀，这里用默认的 @app。

然后可以看到在 libs 目录下多了这个公共模块：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54c1805ad2074da3bd0c14bcfde594e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1232&h=754&s=104221&e=png&b=1d1d1d)

并且在 tsconfig.json 里生成了别名配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/434136e338724d0792be80e6bb2cc3c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298&h=800&s=161450&e=png&b=1c1c1c)

改下 RedisModule

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
还有 RedisService

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType

    async keys(pattern: string) {
        return await this.redisClient.keys(pattern);
    }

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}
```
然后分别在 user 和 exam 的 service 里用一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c6b4d4c0dfb4d9c9d357b372c067126~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1460&h=614&s=173304&e=png&b=1c1c1c)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/941cae43e560492199270873369ad3cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1544&h=668&s=208217&e=png&b=1d1d1d)

```javascript
import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  redisService: RedisService;

  @Get()
  async getHello() {
    const keys = await this.redisService.keys('*');
    return this.userService.getHello() +  keys;
  }
}
```
把 redis 的容器跑起来，去 RedisInsight 里看下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1e9d5326279447299bb6ea6975190d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=570&s=66771&e=png&b=151515)

有两个 key。

把用户微服务跑起来：

```
npm run start:dev user
```
访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/500a8b6fc3c043f6a88bb49c0f331d64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=656&h=178&s=20428&e=png&b=ffffff)

可以看到，lib 里的 RedisService 正确引入并生效了。

在 exam 微服务里也引入下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ec14504669e4900aa236d612a140f44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1520&h=556&s=164118&e=png&b=1d1d1d)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ce72f79918e442297ee5c9f041faaab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1642&h=844&s=290909&e=png&b=1d1d1d)

```javascript
@Inject(RedisService)
redisService: RedisService;

@Get()
async getHello() {
    const keys = await this.redisService.keys('*');
    return this.examService.getHello() +  keys;
}
```
把服务跑起来：

```
npm run start:dev exam
```
试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c0c40daa16e42719c4ab75fcd8cadd7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=664&h=186&s=20867&e=png&b=ffffff)

这样，同一个模块就可以在两个微服务里使用了。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exam-system)

## 总结

这节我们微服务架构的项目结构。

创建了 user、exam、answer、analyse 这 4 个 app，还有 redis 这个公共 lib。

4 个微服务都单独暴露 http 接口在不同端口，之间还可以通过 TCP 来做通信。

微服务之间的 RPC 通信用起来就和用本地的 service 一样。

libs 下的模块可以在每个 app 里引入，可以放一些公共代码。

这样，微服务架构的 monorepo 的项目就够就搭建完成了。

