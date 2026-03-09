# 实战篇 2：接口契约与入参校验 —— 使用 Swagger & Joi


上一节我们完成了项目工程的基础搭建。作为一个服务于小程序的 API 系统，系统提供了哪些 API 服务？每一个 API 需要提供什么样的参数来进行调用？开发人员之间口口相传、不成体系的零散交代必然是不靠谱的。接口使用说明的文档化输出，并形成一种后端与小程序前端之间的接口契约，是现代前后端团队化协作的最佳实践。  

那么如何输出接口契约的文档呢？大多数时候的直觉行为，是打开一个文档编辑器开始根据接口内容列大纲，然后焦头烂额地在文档与项目工程之间频繁切换以确认需要表达的内容。大量地复制黏贴代码中的参数定义，费尽千辛，才终于纯手工打造出一款格式粗糙、阅读体验差的接口文档。

然而，大多数时候，接口文档的输出并非是一次性的编辑行为。接口实现过程中的参数调整变化，业务新增，都会使接口文档的内容需要同步更新来保持与系统代码一致性。离散于两处的内容维护，是一件让人身心疲惫的工作。有没有更好的接口文档化解决方案呢？使用 hapi-swagger & Joi。

## 使用 Swagger

Swagger 是一种与语言无关的接口描述，目标是为 REST APIs 定义一个标准的，帮助我们在看不到具体源码的情况下能发现和理解各种服务的功能。并通过 swagger-ui 的网页输出，来形成一套美观简洁的可视化文档，如下图：


![](https://user-gold-cdn.xitu.io/2018/9/11/165c5ad5a6131ee8?w=1990&h=998&f=png&s=191691)

Joi 是一种验证模块，与 hapi 一样出自沃尔玛实验室团队。Joi 的 API 因其丰富的功能，使得验证数据结构与数值的合规，变得格外容易。它有很多灵活酷炫的用法，但碍于篇幅，我们在本小节中特别聚焦于请求入参的校验。

在以 hapi 作为 API 服务器框架，hapi-swagger 插件用于生成接口文档，Joi 用于校验数据结构，是一对相当好用的搭档组合，并且良好地解决我们需要在项目工程与文档之间两处维护的痛点。代码即文档的整合能力，是每一个程序开发人员都喜欢的开发方式。



将 hapi-swagger 作为插件注册为服务后，我们可以将任意的路由配置标记为 API 文档的一部分。而且，hapi-swagger 会智能地解析 Joi 的数据结构校验配置，在接口文档中对应为相应的输入表单。

当然，他们两者都可以保持独立地良好运作，只是当我们将他们整合到一起时，会得到 1 + 1 > 2 的惊喜。

### 使用 Swagger 插件配置接口文档

**安装基础依赖与基础插件配置**

```bash
# 安装适配 hapi v16 的 swagger 插件
npm i hapi-swagger@7
npm i inert@4
npm i vision@4
npm i package
```

``` bash
├── plugins                       # hapi 插件配置
|   ├── hapi-swagger.js           # swagger 插件
```

```js
// plugins/hapi-swagger.js
const inert = require('inert');
const vision = require('vision');
const package = require('package');
const hapiSwagger = require('hapi-swagger');

module.exports = [
  inert,
  vision,
  {
    register: hapiSwagger,
    options: {
      info: {
        title: '接口文档',
        version: package.version,
      },
      // 定义接口以 tags 属性定义为分组
      grouping: 'tags',
      tags: [
        { name: 'tests', description: '测试相关' },
      ]
    }
  }
]
```

在 app.js 中，我们通过 `server.register` 挂载 swagger 插件配置

```js
// app.js

const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');
const routesHelloHapi = require('./routes/hello-hapi');
// 引入自定义的 hapi-swagger 插件配置
const pluginHapiSwagger = require('./plugins/hapi-swagger');

const server = new Hapi.Server();
// 配置服务器启动host与端口
server.connection({
  port: config.PORT,
  host: config.HOST,
});

const init = async () => {
  await server.register([
    // 为系统使用 hapi-swagger
    ...pluginHapiSwagger,
  ]);
  server.route([
    // 创建一个简单的hello hapi接口
    ...routesHelloHapi,
  ]);
  // 启动服务
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
```

为 REST 接口添加 Swagger 标记，在路由配置中的 config 字段增加 `tags:['api']` 即可将路由暴露为 Swagger 文档，第二个参数选填，可以将接口进行一定的 group 分组管理，接口将被折叠如对应的 group 分类。config 中的 description 字段则用于 Swagger 描述接口的内容，亦可作为一部分代码的功能注释来用，一举多得。

```js
// routes/hello-hapi.js
module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello hapi');
    },
    config: {
      tags: ['api', 'tests'],
      description: '测试hello-hapi',
    },
  },
];

```

访问 [http://127.0.0.1:3000/documentation](http://127.0.0.1:3000/documentation) ，查看暴露接口的 Swagger 文档：


![](https://user-gold-cdn.xitu.io/2018/8/15/1653bfaa0a34f975?w=1198&h=1492&f=jpeg&s=198628)

> **GitHub 参考代码** [chapter6/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter6/hapi-tutorial-1)


**结合业务实现业务接口雏形**

结合我们在第三章文末处所整理关键业务接口，有店铺相关与订单相关，路由的具体配置如下：

```js
// routes/shops.js
const GROUP_NAME = 'shops';

module.exports = [
  {
    method: 'GET',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      reply();
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '获取店铺列表',
    },
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/{shopId}/goods`,
    handler: async (request, reply) => {
      reply();
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '获取店铺的商品列表',
    },
  },
];

```

```js
const GROUP_NAME = 'orders';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}`,
    handler: async (request, reply) => {
      reply();
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '创建订单',
    },
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/{orderId}/pay`,
    handler: async (request, reply) => {
      reply();
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '支付某条订单',
    },
  },
];

```

通过 http://localhost:3000/documentation （你自己的服务地址 + /documentation）来查看 Swagger 文档，刚才定义的路由配置，已经有配套接口文档了，后面的章节来开始堆业务。

> **GitHub 参考代码** [chapter6/hapi-tutorial-2](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter6/hapi-tutorial-2)

## 使用 Joi 校验数据结构

安装 Joi 依赖库：

```bash
# 安装适配 hapi v16 的 joi 插件
npm i joi@13
```

**1. 适用于动态路由的 params 验证**

正如上述代码所配置的，动态路由所依赖的变量 orderId 以 `params` 属性的字段来传递，`orderId: Joi.string().required()` 的描述，定义了 orderId 必须是字符串，且此参数必填。一旦用户端调用该接口，orderId 并没有传入，则会返回如下的错误信息：

```js
  {
    method: 'POST',
    path: `/${GROUP_NAME}/{orderId}/pay`,
    config: {
      validate: {
        params: {
          orderId: Joi.string().required(),
        }
      }
    }
  },
```

```js
{
    "error": "Bad Request",
    "message": "此处会有明确的字段验证错误描述",
    "statusCode": 400
}
```

**2. 适用于 POST 接口的 payload（request body）验证**

比如订单的创建接口，POST 型，可能依赖多件商品，且各商品数量不同的复杂入参。此类的参数校验可以通过 validate.payload 来约束：

```js
// 入参的数据
[
  { goods_id: 123, count: 1 },  // 1件 id 为 123 的商品
  { goods_id: 124, count: 2 },  // 2件 id 为 124 的商品
]

// 对应的嵌套入参校验
validate: {
  payload: {
    goodsList: Joi.array().items(
      Joi.object().keys({
        goods_id: Joi.number().integer(),
        count: Joi.number().integer(),
      })
    )
  }
}
```

**3. 适用于 GET 接口的 query（URL 路径参数）**

比如我们常见的带有分页特性的拉取店铺列表数据，往往涉及页码 page 和每个分页的条目数 limit。接口的体现形式通常是 http://localhost/shops?page=1&limit=10
。此类的参数校验可以通过 validate.query 来约束：

```js
validate: {
  query: {
    limit: Joi.number().integer().min(1).default(10)
      .description('每页的条目数'),
    page: Joi.number().integer().min(1).default(1)
      .description('页码数'),
  }
}
```

**4. 适用于 header 额外字段约束的 headers 验证**

比如我们后文会讲到的基于 JWT 的用户身份验证，会依赖 header 中的 `authorization` 字段的配置，但由于 header 中本身还涵盖了其他的字段属性，所以需要用 `unknown` 来做一个冗余处理：

```js
validate: {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}
```

> **GitHub 参考代码** [chapter6/hapi-tutorial-3](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter6/hapi-tutorial-3)


## 小结

关键词：Swagger，Joi，入参校验

本小节，我们学习了使用 hapi-swagger 插件自动生成接口文档。并且利用 Joi，针对接口入参 params， payload，query，headers 这四种形态进行声明与校验，能够覆盖大多数日常开发使用场景。网页版的 swagger 文档也可以成为我们开发过程中快速测试接口返回数据的敏捷工具。

**本小节参考代码汇总**

使用 Swagger 插件配置接口文档 - 安装基础依赖与基础插件配置：[chapter6/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter6/hapi-tutorial-1)

使用 Swagger 插件配置接口文档  - 结合业务实现业务接口雏形：[chapter6/hapi-tutorial-2](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter6/hapi-tutorial-2) 

使用 Joi 校验数据结构：[chapter6/hapi-tutorial-3](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter6/hapi-tutorial-3)
