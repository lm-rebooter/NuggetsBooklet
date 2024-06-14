我们通过 redis-cli 命令行和 RedisInsight 的 GUI 工具入门了 redis。

那在 Node 里怎么操作 redis 呢？

这就需要用 redis 的 node 的客户端了。

redis 有很多的 [node 客户端的包](https://redis.io/resources/clients/#nodejs)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ee372edb494479a868020cda99a4a0b~tplv-k3u1fbpfcp-watermark.image?)

最流行的就是 redis 和 ioredis 这两个。

我们创建个项目来试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b60006cd719b4652abf5b8c75f13d52a~tplv-k3u1fbpfcp-watermark.image?)

我们先试一下 redis，它是官方提供的 npm 包：

    npm install redis

然后在代码里连接 redis 服务，并执行命令：

```javascript
import { createClient } from 'redis';

const client = createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

const value = await client.keys('*');

console.log(value);

await client.disconnect();
```

这里执行 keys 命令，获取所有的 key。

因为用到了 es module、顶层 await，这些的启用需要在 package.json 里添加 type: module

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbf7b44d9a5d417aa6b35f67e0fdcca8~tplv-k3u1fbpfcp-watermark.image?)

然后 node 执行下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82bc3c74c1214f708d29eb861cdb881a~tplv-k3u1fbpfcp-watermark.image?)

用 RedisInsight 看下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/097ecb127c7a46d6afa2bc8b67850921~tplv-k3u1fbpfcp-watermark.image?)

确实现在是有这些 key。

我们再执行其他命令试试，比如 hset 创建一个 hash 表：

```javascript
await client.hSet('guangguang1', '111', 'value111');
await client.hSet('guangguang1', '222', 'value222');
await client.hSet('guangguang1', '333', 'value333');
```

执行以后是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08e56096e39749e8be32c52a3e5ba1e7~tplv-k3u1fbpfcp-watermark.image?)

所有的 redis 命令都有对应的方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7078ce4313954be0824981edd72b8e01~tplv-k3u1fbpfcp-watermark.image?)

和我们在命令行客户端里操作一样。

这样我们就完成了 node 里操作 redis 的功能。

再来试下 ioredis：

    npm install ioredis

然后连接 redis server 并执行 keys 命令：

```javascript
import Redis from "ioredis";

const redis = new Redis();

const res = await redis.keys('*');

console.log(res);
```

结果如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ecadf44c9e3494a9980d62a03151649~tplv-k3u1fbpfcp-watermark.image?)

其他命令也是这样执行：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c5f633c97a8483bbd947e639c71a81d~tplv-k3u1fbpfcp-watermark.image?)

这些 node 包用起来还是很简单的，没啥学习成本。

那 nest 里怎么操作 redis 呢？

其实也是一样的：

执行 nest new nest-redis 创建一个 nest 项目：

    nest new nest-redis -p npm

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52d74f217d9a40da8aa0537345234e52~tplv-k3u1fbpfcp-watermark.image?)

当然，要先安装用到的 redis 的包。

    npm install redis 

然后在 AppModule 添加一个自定义的 provider：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/204f0b6bb67a46eaa74cc27c0a30e64c~tplv-k3u1fbpfcp-watermark.image?)

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createClient } from 'redis';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
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
})
export class AppModule {}
```

通过 useFactory 的方式动态创建 provider，token 为 REDIS\_CLIENT。

然后注入到 service 里用就好了：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class AppService {

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async getHello() {
    const value = await this.redisClient.keys('*');
    console.log(value);

    return 'Hello World!';
  }
}
```

因为 service 里加了 async、await，那 controller 里也得加一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1a51c317eca405d82defe4d626aece4~tplv-k3u1fbpfcp-watermark.image?)

这样就能在 nest 里操作 redis 了。

我们把它跑起来，浏览器访问下：

    nest start --watch

可以看到控制台打印了 redis 命令的执行结果：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d51073000fef4d49a3b47f332d4a4676~tplv-k3u1fbpfcp-watermark.image?)

这就是在 Nest 里操作 redis 的方式。

案例代码在小册仓库：

[node 操作 redis](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/redis-node-test)

[nest 操作 redis](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-redis)

## 总结

通过 redis 的 npm 包（redis、ioredis 等）可以连接 redis server 并执行命令。

如果在 nest 里，可以通过 useFactory 动态创建一个 provider，在里面使用 redis 的 npm 包创建连接。

redis 是必备的中间件，后面的项目实战会大量用到。
