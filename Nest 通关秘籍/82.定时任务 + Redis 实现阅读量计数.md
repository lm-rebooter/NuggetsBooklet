文章都会有个阅读量，那这个阅读量是怎么计数的呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26b7aa9c69b14847ad90c389f236593b~tplv-k3u1fbpfcp-watermark.image?)

有同学说，很简单啊，这不就是文章表里加个 views 的字段，然后每次刷新页面都加一么？

这样是可以，但有两个问题：

- 每次刷新阅读量都加一，其实还是同一个人看的这篇文章，这样统计出来的阅读量是不准的，我们想要的阅读量是有多少人看过这篇文章

- 阅读是个很高频的操作，直接存到数据库，数据库压力会太大

这两个问题分别都怎么解决呢？

其实我们学完 Redis 就应该能想到解决方案了：

- 在 redis 中存储 user 和 article 的关系，比如 user_111_article_222 为 key，10 分钟后删除，如果存在这个 key，就说明该用户看过这篇文章，就不更新阅读量，否则才更新

    10 分钟后，这个人再看这篇文章，就可以算是新的一次阅读量了。

- 访问文章时把阅读量加载到 redis，之后的阅读量计数只更新 redis，不更新数据库，等业务低峰期再把最新的阅读量写入数据库

    这里在业务低峰期，比如凌晨 4 点的时候写入数据库，可以用定时任务来做。


思路理清了，我们来实现一下：

```
nest new article-views -p npm
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcfd1c5e7f004bb798b8a7ba9697e0de~tplv-k3u1fbpfcp-watermark.image?)

创建个 nest 项目。

安装 typeorm 相关的包：

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
      database: "article_views",
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
在 mysql workbench 里创建这个 database

```
CREATE DATABASE article-views DEFAULT CHARACTER SET utf8mb4;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/525cdf775e4347468986e5f7e214078a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=162&e=png&b=f5f4f4)

刷新可以看到这个 database

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/191672a15d064ac180dc2699a3650a94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=500&h=456&e=png&b=e9e6e3)

然后建个文章和用户的模块：

```javascript
nest g resource user --no-spec
nest g resource article --no-spec
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2067e9ddbd804c0b8f31b13f691eff20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884&h=602&e=png&b=191919)

添加 user 和 article 的 entity

```javascript
import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '用户名'
    })
    username: string;

    @Column({
        comment: '密码'
    })
    password: string;
}
```
```javascript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '文章名字',
        length: 50
    })
    title: string;

    @Column({
        comment: '内容',
        type: 'text'
    })
    content: string;

    @Column({
        comment: '阅读量',
        default: 0
    })
    viewCount: number;

    @Column({
        comment: '点赞量',
        default: 0
    })
    likeCount: number;

    @Column({
        comment: '收藏量',
        default: 0
    })
    collectCount: number;
}

```
在 entities 引入：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa3df96660be4d22b6366d7d2d2a29b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=894&h=1050&e=png&b=1f1f1f)

可以看到 typeorm 自动创建了这两个表：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64dde61b048940b3b75bd83739afee0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1634&h=670&e=png&b=191919)

然后插入一些数据：

在 AppController 创建 init-data 的路由，然后注入 EntityManager：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0446c10bb0f94671bdd1a4b99b8ee92f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1108&h=862&e=png&b=1f1f1f)

```javascript
@InjectEntityManager()
  private entityManager: EntityManager;

  @Get('init-data')
  async initData() {
    await this.entityManager.save(User, {
      username: 'dong',
      password: '111111'
    });
    await this.entityManager.save(User, {
      username: 'guang',
      password: '222222'
    });

    await this.entityManager.save(Article, {
      title: '基于 Axios 封装一个完美的双 token 无感刷新',
      content: `用户登录之后，会返回一个用户的标识，之后带上这个标识请求别的接口，就能识别出该用户。

      标识登录状态的方案有两种： session 和 jwt。
      `
    });

    await this.entityManager.save(Article, {
      title: 'Three.js 手写跳一跳小游戏',
      content: `前几年，跳一跳小游戏火过一段时间。

      玩家从一个方块跳到下一个方块，如果没跳过去就算失败，跳过去了就会再出现下一个方块。`
    });
    return 'done';
  }
```
两个 entity 分别插入 2 条数据。

浏览器访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b41c9f560eb44c87bd7f2ef913f59c86~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=216&e=png&b=ffffff)


可以看到 4 条 insert 语句：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d1726aa77334d79b5430b2df16e7e19~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1672&h=672&e=png&b=191919)

在 mysql workbench 里也可以看到两个表都插入了数据：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4ea593b965a4509941e46f57d2251c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1758&h=394&e=png&b=f0eeed)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c0d4d171eb14fdebfe891e53e1ce7b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=420&e=png&b=edeae8)

然后先实现登录：

这次用 session 的方案：

安装相关的包：
```
npm install express-session @types/express-session
```
在 main.ts 里启用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/689b475a6a8f4c6b9f3e8790dbc8a600~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=648&e=png&b=1f1f1f)

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

然后实现下登录：

在 UserController 添加 login 的路由：

```javascript
@Post('login')
async login(@Body() loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
    return 'success';
}
```
新建 src/user/dto/login-user.dto.ts

```javascript
export class LoginUserDto {
    username: string;

    password: string;
}
```
测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c02152dcbd440fe86ee86120ae7fd3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=716&h=628&e=png&b=fbfbfb)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13514ad5de634e18876e9dfe0512625d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=772&h=396&e=png&b=191919)

然后在 UserService 实现登录逻辑：

```javascript
@InjectEntityManager()
private entityManager: EntityManager;

async login(loginUser: LoginUserDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: loginUser.username
      }
    });

    if(!user) {
      throw new BadRequestException('用户不存在');
    }

    if(user.password !== loginUser.password) {
      throw new BadRequestException('密码错误');
    }

    return user;
}
```
在 UserController 调用下：

```javascript
@Post('login')
async login(@Body() loginUserDto: LoginUserDto, @Session() session) {
    const user = await this.userService.login(loginUserDto);

    session.user = {
        id: user.id,
        username: user.username
    }

    return 'success';
}
```
调用 userService 的 login 方法，实现登录验证，然后把用户信息存入 session。

当用户不存在时：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3afa73c85f8545339664bc4708c2f494~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=764&e=png&b=fbfbfb)

当密码错误时：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d86d6b88e5a942049fe74e07cdf705f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=748&e=png&b=fcfcfc)

登录成功时：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66a65a32faca464fb889cfbd7b3da07d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=754&h=670&e=png&b=fcfcfc)

然后在 ArticleController 添加一个查询文章的接口：

```javascript
@Get(':id')
async findOne(@Param('id') id: string) {
    return await this.articleService.findOne(+id);
}
```
实现 articleService.findOne 方法：

```javascript
@InjectEntityManager()
private entityManager: EntityManager;

async findOne(id: number) {
    return await this.entityManager.findOneBy(Article, {
      id
    });
}
```
测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1537ebd9b484709aa8933ccb5e02095~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=896&e=png&b=fdfdfd)

然后我们在 ArticleController 加一个阅读的接口：

```javascript
@Get(':id/view')
async view(@Param('id') id: string) {
    return await this.articleService.view(+id);
}
```
然后在 ArticleService 里实现具体的逻辑：

```javascript
async view(id: number) {
    const article = await this.findOne(id);

    article.viewCount ++;

    await this.entityManager.save(article);

    return article.viewCount;
}
```
测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31879fdb321a4f5994a1fe2ba3dc09be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1262&h=768&e=gif&f=24&b=fcfcfc)

数据库里阅读量确实更新了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0909a6305c95493997cd6f34f2fbccba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=304&e=png&b=f6f6f6)

再次查询出来的就是新的阅读量：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bb624bd733840e98795ceb1ceb09446~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=806&e=png&b=fdfdfd)

这样是能实现功能，但有前面我们讲到的两个问题：

- 每次刷新阅读量都加一，其实还是同一个人看的这篇文章，这样统计出来的阅读量是不准的，我们想要的阅读量是有多少人看过这篇文章

- 阅读是个很高频的操作，直接存到数据库，数据库压力会太大

所以，我们要引入 redis。

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

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }

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
我们封装了 get、set、hashGet、hashSet 方法，分别是对 redis 的 string、hash 数据结构的读取。

然后在 view 方法里引入 redis：

```javascript
@Inject(RedisService)
private redisService: RedisService;

async view(id: number) {
    const res = await this.redisService.hashGet(`article_${id}`);

    if(res.viewCount === undefined) {
      const article = await this.findOne(id);

      article.viewCount ++;

      await this.entityManager.save(article);

      await this.redisService.hashSet(`article_${id}`, {
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        collectCount: article.collectCount
      });

      return article.viewCount;

    } else {
      await this.redisService.hashSet(`article_${id}`, {
        ...res,
        viewCount: +res.viewCount + 1
      });
      return +res.viewCount + 1;
    }
}
```
先查询 redis，如果没查到就从数据库里查出来返回，并存到 redis 里。

查到了就更新 redis 的 viewCount，直接返回 viewCount + 1

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9546b6f44a01456eb5c7a1dfd755d2d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=772&h=640&e=png&b=fcfcfc)

服务端打印了 3 条 sql：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3626eedca554a6587282af70d1c8ac8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1596&h=314&e=png&b=191919)

redis 里也有了这个 hash 的结构：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e530ee6adad439ab08a6808947b4377~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2246&h=838&e=png&b=1a1a1a)

为什么是 3 条呢？

因为 findOne 发一条 select，save 会先发一条 select，再发一条 update。

我们可以优化一下，把 save 换成 update：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/948b542076df453ebf7c84532609b353~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=652&e=png&b=1f1f1f)

```javascript
await this.entityManager.update(Article, {  id }, {
    viewCount: article.viewCount
});
```
然后把 redis 那条数据删掉：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9788237156734af0a24fa841d5c4b68c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1412&h=824&e=png&b=1d1d1d)

重新跑一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3737234048e341439251f70d71fa5c2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1618&h=216&e=png&b=191919)

现在就只有一条 select、一条 update 了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faf52919e478446bbfd90c65ca20931a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1944&h=706&e=png&b=1c1c1c)

然后多刷新几次：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/026c9f9fe0ab42b696cf2717c38a9a5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=670&e=gif&f=19&b=fbfbfb)

没发送 sql，还是之前那两条：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed1d914a14f34ec193c2624d045e6ba8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=228&e=png&b=191919)

因为这时候查的是 redis。

redis 里数据更新了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acb2f7c7a439424b81a837c26e163db9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1924&h=738&e=png&b=1c1c1c)

但是数据库里的 viewCount 还是 8

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0e47c613c6f475881a4f8a93aa3afe2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=240&e=png&b=fafafa)

这样一重启 redis 数据就没了。

所以还要同步到数据库。

同步倒是不用很频繁，可以放在凌晨 4 点，访问量少的时候通过定时任务同步数据库。

我们需要引入定时任务包 @nestjs/schedule

```
npm install --save @nestjs/schedule
```

在 AppModule 引入下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da9dd554de1b4601ad796006221742af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=602&e=png&b=1f1f1f)

然后创建一个 service：
```
nest g module task
nest g service task
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54cfef67d208453eab9317728cdcfec3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=732&h=248&e=png&b=191919)

定义个方法，通过 @Cron 声明每 10s 执行一次：

```javascript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('task execute')
  }
}
```
然后就可以看到控制台会每 10s 打印一次

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebee4294bf994a3e8f057dfe909b3d14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=738&e=png&b=181818)

我们在 TaskModule 引入 ArticleModule：

```javascript
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [
    ArticleModule
  ],
  providers: [TaskService]
})
export class TaskModule {}
```
并且在 ArticleModule 导出 ArticleService

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdb0e59201a84700b742a3673502a5f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=882&h=488&e=png&b=1f1f1f)

然后在 TaskService 里注入 articleService 
```javascript
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class TaskService {

  @Inject(ArticleService)
  private articleService: ArticleService;

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.articleService.flushRedisToDB();
  }
}
```

每分钟执行一次，调用 articleService 的 flushRedisToDB 方法。

然后我们实现这个方法：

先在 RedisService 添加一个 keys 方法，用来查询 key：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0783f06b09b845ebbb813e6caf2e1cfb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=512&e=png&b=1f1f1f)

```javascript
async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
}
```
然后在 ArticleService 里实现同步数据库的逻辑：

```javascript
async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);
    console.log(keys);
}
```

我们先打印下 keys。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cadcfe5c40ad490dbf0d2a0243eff546~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=358&h=214&e=png&b=181818)

现在只有一个 key，我们再访问下另一篇文章


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b861eb19d5c4488a4cd691ff25941ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=742&h=576&e=png&b=fbfbfb)

现在就有 2 个 key 了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a2623fea2564d47a42118e61bea4e99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=496&h=174&e=png&b=191919)

我们把所有的 key 对应的值存入数据库：

```javascript
async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const res = await this.redisService.hashGet(key);

      const [, id] = key.split('_');

      await this.entityManager.update(Article, {
        id: +id
      }, {
        viewCount: +res.viewCount,        
      });
    }
}
```

查询出 key 对应的值，更新到数据库。

测试下：
  
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6ef2153ce824061a42daaa7f96303a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320&h=864&e=gif&f=29&b=fcfcfc)

刷新几次 view 接口，redis 里阅读量增加了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30c2b390069a404f922d08146b51dcb6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1916&h=678&e=png&b=1d1d1d)

但是数据库里没变：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5e3bc2f86f24a409e6e16f1dca68490~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1108&h=238&e=png&b=fafafa)

过了一会，控制台打印了 2 条 update 语句：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b2ded51d38646a0b1a6fc54b16a0fb9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=180&e=png&b=191919)

数据库里的数据就更新了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64857cb5a78745028c80ea6d1da94b74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=236&e=png&b=f9f9f9)

接下来只要把定时任务的执行时间改为 4 点就好了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bbbbb54c49e444fa3bcb3c7eeaba66d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=598&e=png&b=1f1f1f)

```javascript
@Cron(CronExpression.EVERY_DAY_AT_4AM)
```
这样，基于 redis 的阅读量缓存，以及定时任务更新数据库就完成了。

还有剩下的一个问题：

- 每次刷新阅读量都加一，其实还是同一个人看的这篇文章，这样统计出来的阅读量是不准的，我们想要的阅读量是有多少人看过这篇文章

我们可以在用户访问文章的时候在 redis 存一个 10 分钟过期的标记，有这个标记的时候阅读量不增加。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5efa6c2989b8452090c4d747cfdd8c64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=1238&e=png&b=1f1f1f)

```javascript
await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);
```
为了测试方便，我们先设置 3s 过期。

```javascript
const flag = this.redisService.get(`user_${userId}_article_${id}`);

if(flag) {
    return res.viewCount;
}
```
这里需要传入 userId。

我们在 ArticleController 的 view 方法里传入下：

```javascript
@Get(':id/view')
async view(@Param('id') id: string, @Session() session, @Req() req) {
    return await this.articleService.view(+id, session?.user?.id || req.ip);
}
```

试试看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44075eeee18742dd8071c58547e67370~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1266&h=684&e=gif&f=38&b=fcfcfc)

可以看到，现在就不是每次刷新都增加阅读量了，而是 3s 之后再刷新才增加。

在 redis 里可以看到这个 key：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ee2fa1fe43b41a186ae89520ad89ab3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=600&e=png&b=1c1c1c)

只不过现在没登录，用的是 ip，而本地访问的时候获取的 ip 就是 ::1 这样的，线上就能拿到具体的 ip 了。

然后我们登录下再访问：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63184b6d205448918f25939aeefb1459~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=696&h=586&e=png&b=fbfbfb)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94fba69d15f5465c8a72e66e074222c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=750&h=584&e=png&b=fbfbfb)

这时用的就是用户 id 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dca4a9e9f38343d9a38f3eece0a87d49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=626&e=png&b=1b1b1b)

这样就实现了真实的阅读量计数。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/article-views)。

## 总结

我们通过 redis + 定时任务实现了阅读量计数的功能。

因为阅读是个高频操作，所以我们查出数据后存在 redis里，之后一直访问 redis 的数据，然后通过定时任务在凌晨 4 点把最新数据写入数据库。

并且为了统计真实的用户阅读量，我们在 redis 存储了用户看了哪篇文章的标识，10 分钟后过期。

这就是我们常见的阅读量功能的实现原理。
