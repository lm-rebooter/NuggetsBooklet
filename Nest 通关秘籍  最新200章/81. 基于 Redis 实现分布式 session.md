前面我们学习了登录鉴权的两种方式 session 和 jwt。

session 是在服务端保存用户数据，然后通过 cookie 返回 sessionId。cookie 在每次请求的时候会自动带上，服务端就能根据 sessionId 找到对应的 session，拿到用户的数据

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5298508d5b74d4585c58b0034a96125~tplv-k3u1fbpfcp-watermark.image?)

而 jwt 是把所有的用户数据保存在加密后的 token 里返回，客户端只要在 authorization 的 header 里带上 token，服务端就能从中解析出用户数据。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95fd322ae4ec4b2bba3973405a659de4~tplv-k3u1fbpfcp-watermark.image?)

jwt 天然是支持分布式的，比如有两个服务器的时候，任何一个服务器都能从 token 出拿到用户数据：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2d4af048e3e4c1f965b23f6184f7a70~tplv-k3u1fbpfcp-watermark.image?)

但是 session 的方式不行，它的数据是存在单台服务器的内存的，如果再请求另一台服务器就找不到对应的 session 了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76f00b76e0d944d584927aa6e913ba0d~tplv-k3u1fbpfcp-watermark.image?)

那如何让 session 支持分布式环境呢？

一种方式就是做 session 的同步，在多台服务器之间复制 session。

另一种方式就是自己基于 redis 实现一个分布式 session 了。

这节我们就来实现一下。

首先我们来分析下思路：

分布式 session 就是在多台服务器都可以访问到同一个 session。

我们可以在 redis 里存储它：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c92708cac3374e99a3e4a813bcfe7fe3~tplv-k3u1fbpfcp-watermark.image?)

用户第一次请求的时候，生成一个随机 id，以它作为 key，存储的对象作为 value 放到 redis 里。

之后携带 cookie 的时候，根据其中的 sid 来取 redis 中的值，注入 handler。

修改 session 之后再设置到 redis 里。

这样就完成了 session 的创建、保存、修改。

我们具体实现下：

```
nest new redis-session-test -p npm
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/875d542bb4a1407f90c43798f4fe6098~tplv-k3u1fbpfcp-watermark.image?)

创建 nest 项目。

安装 redis 的包：

```
npm install --save redis
```

然后创建个 redis 模块：

```
nest g module redis
nest g service redis
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaf36dbe385544309bc35de23c2a45a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=196&e=webp&b=1f1f1f)

在 RedisModule 创建连接 redis 的 provider，导出 RedisService，并把这个模块标记为 @Global 模块

```javascript
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
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

然后在 RedisService 里注入 REDIS_CLIENT，并封装一些方法：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async hashGet(key: string) {
        return await this.redisClient.hGetAll(key);
    }

    async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
        for(let name in obj) {
            await this.redisClient.hSet(key, name, obj[name]);
        }

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}
```

因为我们要操作的是对象结构，比较适合使用 hash。

redis 的 hash 有这些方法：

- `HSET key field value`： 设置指定哈希表 key 中字段 field 的值为 value。
- `HGET key field`：获取指定哈希表 key 中字段 field 的值。
- `HMSET key field1 value1 field2 value2 ...`：同时设置多个字段的值到哈希表 key 中。
- `HMGET key field1 field2 ...`：同时获取多个字段的值从哈希表 key 中。
- `HGETALL key`：获取哈希表 key 中所有字段和值。
- `HDEL key field1 field2 ...`：删除哈希表 key 中一个或多个字段。
- `HEXISTS key field`：检查哈希表 key 中是否存在字段 field。
- `HKEYS key`：获取哈希表 key 中的所有字段。
- `HVALUES key`：获取哈希表 key 中所有的值。
-`HLEN key`：获取哈希表 key 中字段的数量。
- `HINCRBY key field increment`：将哈希表 key 中字段 field 的值增加 increment。
- `HSETNX key field value`：只在字段 field 不存在时，设置其值为 value。

这里我们就用到 hGetAll 和 hSet 方法，再就是用 expire 设置 key 的过期时间。

这里的 Record<string, any> 是对象类型的意思。

然后再封装个 SessionModule：

```
nest g module session
nest g service session --no-spec
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c8d0a8556f24180825e213dd36958b2~tplv-k3u1fbpfcp-watermark.image?)

导出 SessionService，并且设置 SessionModule 为 Global：
```javascript
import { Global, Module } from '@nestjs/common';
import { SessionService } from './session.service';

@Global()
@Module({
  providers: [SessionService],
  exports: [SessionService]
})
export class SessionModule {}

```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af5a3f5a84854fa9aa7f9af167eb7575~tplv-k3u1fbpfcp-watermark.image?)

然后实现 SessionService：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SessionService {

    @Inject(RedisService)
    private redisService: RedisService;

    async setSession(sid: string, value: Record<string, any>, ttl: number = 30 * 60) {
        if(!sid) {
            sid = this.generateSid();
        }
        await this.redisService.hashSet(`sid_${sid}`, value, ttl);
        return sid;
    }

    async getSession(sid: string) {
        return await this.redisService.hashGet(`sid_${sid}`);
    }

    generateSid() {
        return Math.random().toString().slice(2,12);
    }
}
```

setSession 就是用 sid_xx 的 key 在 redis 里创建 string 的数据结构。

getSession 是用 sid_xx 从 redis 取值。

generateSid 是生成随机的 session id

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29816011bc1741f49df6715d3513503a~tplv-k3u1fbpfcp-watermark.image?)

setSession 的时候如果没有传入 sid，则随机生成一个，并返回 sid。

我们在 AppController 添加个方法测试下：

```javascript
@Inject(SessionService)
private sessionService: SessionService;

@Get('count')
async count(@Req() req: Request, @Res() res: Response) {
    const sid = req.cookies?.sid;

    const session = await this.sessionService.getSession(sid);

}

```
这里用到 cookie，需要安装 cookie-parser 的包：

```
npm install --save cookie-parser
```
在 main.ts 里启用：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a881300cf443467e8540debaa894ec23~tplv-k3u1fbpfcp-watermark.image?)

现在 getSession 返回的是 Record<string, any> 也就是对象类型，但并不知道有啥具体的属性。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c14008ddf454a5ea7f0b823b1aed9ac~tplv-k3u1fbpfcp-watermark.image?)

所以我们改造下 getSession 的类型声明加个重载：

```typescript
async getSession<SessionType extends Record<string,any>>(sid: string): Promise<SessionType>;
async getSession(sid: string) {
    return await this.redisService.hashGet(`sid_${sid}`);
}
```
这样再用的时候，当不传类型参数，返回的是默认类型 Record<string, any>：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1be5e6fc8e0142cb8212d9089b2ecde4~tplv-k3u1fbpfcp-watermark.image?)

传入类型参数之后，返回的就是该类型了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13e8b607cf6244ffb9fcb78770892ec1~tplv-k3u1fbpfcp-watermark.image?)

为什么这里是 string 呢？

因为 redis 虽然可以存整数、浮点数，但是它会转为 string 来存，所以取到的是 string，需要自己转换一下。

我们实现下计数逻辑：

```javascript
@Inject(SessionService)
private sessionService: SessionService;

@Get('count')
async count(@Req() req: Request, @Res({ passthrough: true}) res: Response) {
    const sid = req.cookies?.sid;

    const session = await this.sessionService.getSession<{count: string}>(sid);

    const curCount = session.count ? parseInt(session.count) + 1 : 1;
    const curSid = await this.sessionService.setSession(sid, {
      count: curCount
    });

    res.cookie('sid', curSid, { maxAge: 1800000 });
    return curCount;
}
```
先根据 cookie 的 sid 调用 getSession 取 session。

拿到的如果有 count，就 + 1 之后放回去，没有就设置 1

然后 setSession 更新 session。

在 cookie 中返回 sid。

默认用了 @Res 传入 response 之后就需要手动返回响应了，比如 res.end('xxx')，如果还是想让 nest 把返回值作为响应，就加个 passthrough: true。

我们测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09b4d078662e4fc2908d1e284d4866d1~tplv-k3u1fbpfcp-watermark.image?)

我们自己实现的 session 就生效了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faaa9f20ae824c8294941553cd3f39e5~tplv-k3u1fbpfcp-watermark.image?)

在 Redis Insight 里可以看到 session 的值

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ee658369fbd4a0cb212cf4f2aefd361~tplv-k3u1fbpfcp-watermark.image?)

而且这个 session 是支持分布式的。


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/991dd7dd3a6440d1bb63999a63bb2881~tplv-k3u1fbpfcp-watermark.image?)

我们用 nginx 做网关层，使用轮询的负载均衡策略，那请求可能到任何一台服务器上。

如果是之前的 session，当前机器没有对应的 session 对象，就拿不到登录状态。

而现在基于 redis 存储的 session，不管请求到了哪台服务器，都能从 redis 中取出对应的 session 从而拿到登录状态、用户数据。

这就是分布式 session。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/redis-session-test)。

## 总结

session 是在服务端内存存储会话数据，通过 cookie 中的 session id 关联。

但它不支持分布式，换台机器就不行了。

jwt 是在客户端存储会话数据，所以天然支持分布式。

我们通过 redis 自己实现了分布式的 session。

我们使用的是 hash 的数据结构，封装了 RedisModule 来操作 Redis。

又封装了 SessionModule 来读写 redis 中的 session，以 sid_xxx 为 key。

之后在 ctronller 里就可以读取和设置 session 了，用起来和内置的传统 session 差不多。但是它是支持分布式的。

如果你想在分布式场景下用 session，就自己基于 redis 实现一个吧。

