## 前言

本章将会记录微信群或者私人与我沟通所有学习篇相关的问题。

## 飞书应用相关问题

鉴于很多同学反馈对于飞书应用配置比较繁琐，为了方便协助大家完成飞书的流程，现在可以扫下面的二维码统一加入我创建的飞书组织：

![飞书20221011-223636.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/654f6d0dca464a7c9ae2b1356b636af1~tplv-k3u1fbpfcp-watermark.image?)

**飞书应用的秘钥如下，大家可以直接使用，加入飞书组织后需要的话可以联系我配置邮箱或者其他的数据，如果自己创建应用也可以联系我帮忙调整权限之类的**：

```
FEISHU_CONFIG:
  FEISHU_URL: https://open.feishu.cn/open-apis
  FEISHU_API_HOST: https://open.feishu.cn
  FEISHU_APP_ID: cli_a2ed5e7be4f9500d
  FEISHU_APP_SECRET: HtMNYItwGbdp6yJv4o2j1fLrplwl6Mem
```
  
  

## v9 版本升级方案

`NestJS` 于 **7** 月 **8** 号推送了 **v9** 版本，所以有不少同学在跟着教程安装的过程中出现了依赖问题。

本着买新不买旧的原则，小册也立马出更新升级 **v9** 的方案，如果你的项目配置出现问题可以参考如下的升级方案。

1. 升级所有相关的基础包到 **v9** 版本

如果直接使用最新的 **CLI** 工具应该不需要升级基础包，如果不是的话，至少需要更新如下两个基础包的版本

```shell
yarn add @nestjs/core@9.0.1
yarn add @nestjs/platform-fastify@9.0.1
```

2. 替换 `fastify` 相关依赖，之前所有 `fastify-` 规则的依赖都替换为 `@fastify/` 类型，例如 `fastify-cookie` 替换成 `@fastify/cookie`

3. 新版将只需要安装 `@nestjs/swagger` 即可，不在需要额外安装 `fastify-swagger`

4. 需要额外安装 `@fastify/static`

5. `redis` 模块采用 [ioredis](https://github.com/luin/ioredis) 替换之前的，配置方式略有改变如下所示：

```ts
// Before
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379',
    },
  },
);

// Now
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  },
);
```

整体来说，**v9** 版本的升级除了一些依赖版本有所改变以及加了一些新的特性之外，没有很大的改动，升级过程也非常平滑，所以就不针对之前的文章内容做出更改，而是单独出了一份升级 **v9** 的加餐章节。

当然你可以继续使用 **v8** 版本开发项目，只要锁定版本就行了，**但我们后续的工程将使用 **v9** 版本开发，保持框架的所有依赖都是最新的**，所以如果你的项目还没有正式投入使用，建议最好跟随一起升级到最新的版本。

如果你有什么疑问，欢迎在评论区提出或者加群沟通。 👏