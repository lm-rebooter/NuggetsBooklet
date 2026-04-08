# 实战篇 4：小程序列表获取 —— 使用 Sequelize

上一节，我们的店铺 shops 表与商品 goods 表都已经通过 migrate 与 seed，完成了表结构的创建与数据的填充。本小节我们把知识点聚焦在 Sequelize 插件库本身的数据模型 model 的查询能力，来实现小程序店铺的列表查询与商品列表查询。

## Sequelize 连接 MySQL 数据库

Sequelize 连接数据库的核心代码主要就是通过 new Sequelize（database, username, password, options） 来实现，其中 options 中的配置选项，除了最基础的 host 与 port、数据库类型外，还可以设置连接池的连接参数 pool，数据模型命名规范 underscored 等等。具体可以查阅官方手册 [基础使用](http://docs.sequelizejs.com/manual/installation/usage.html)。

由于前一小节通过 sequelize-cli init 初始化了 models 的目录，sequelize-cli 已经特别友好地为我们准备了一个动态加载 models 目录中具体数据库表模型的入口模块 index.js。由于我们希望遵循 MySQL 数据库表字段的下划线命名规范，所以，需要全局开启一个 `underscore: true` 的定义，来使系统中默认的 createdAt 与 updatedAt 能以下划线的方式，与表结构保持一致。

微调 models/index.js 中的代码：

```js
// models/index.js

// 将 const config = configs[env] 调整为如下结构

const config = {
  ...configs[env],
  define: {
    underscored: true,
  },
};
```

## 定义数据库业务相关的 model

结合业务所需，我们在 models 目录下继续创建一系列的 model 来与数据库表结构做对应：

``` bash
├── models                       # 数据库 model
│   ├── index.js                 # model 入口与连接
│   ├── goods.js                 # 商品表
│   ├── shops.js                 # 店铺表
```

### 1. 定义店铺的数据模型 shops

```js
// models/shops.js

module.exports = (sequelize, DataTypes) => sequelize.define(
  'shops',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumb_url: DataTypes.STRING,
  },
  {
    tableName: 'shops',
  },
);

```

### 2.定义商品的数据模型 goods

```js
module.exports = (sequelize, DataTypes) => sequelize.define(
  'goods',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumb_url: DataTypes.STRING,
  },
  {
    tableName: 'goods',
  },
);

```

## 实现店铺列表页接口

### 1. 实现简单的店铺列表接口

```js
// routes/shops.js

// 引入 models
const models = require("../models");
module.exports = [
  {
    method: 'GET',
    path: '/shops',
    handler: async (request, reply) => {
      // 通过 await 来异步查取数据
      const result = await models.shops.findAll();
      reply(result)
    }
  }
]
```

### 2. 隐藏返回列表中不需要的字段

很多时候，我们并不希望 findAll 来将数据表中的所有数据全都暴露出来，比如在查询用户列表时，用户的密码的值，便是特别敏感的数据。
我们可以在 findAll 中加入一个 `attributes` 的约束，可以是一个要查询的属性（字段）列表，或者是一个 key 为 `include` 或 `exclude` 对象的键，比如对于用户表，`findAll({ attributes: { exclude: ['password'] } })`，就可以排除密码字段的查询露出。

在我们的店铺表中，我们希望有如下的字段露出：

```js

const result = await models.shops.findAll({
  attributes: [
    'id', 'name'
  ]
});
```

### 3. 列表分页

当列表的数据开始增多，每次的列表展示数据，并不需要拉取全部，这时，我们需要为系统框架引入分页插件，hapi-pagination。

```bash

# 安装适配 hapi v16 的 hapi-pagination
$ npm i hapi-pagination@1
```

在 plugins 目录下新增一个 hapi-pagination 的插件。options 的具体配置参数细节说明，参见 [hapi-pagination](https://github.com/fknop/hapi-pagination/tree/v1.6.5)。

考虑到，并非所有的接口都需要支持分页，所以，笔者建议对需要分页的相关接口，在 routes.include 配置中，逐条添加：

```js
// plugins/hapi-pagination.js
const hapiPagination = require('hapi-pagination');

const options = {
  query: {
    // ... 此处篇幅考虑省略 query 入参配置代码，参看章节  github 案例
  },
  meta: {
    name: 'meta',
    // ... 此处篇幅考虑省略 meta 的相关配置代码，参看章节  github 案例
  },
  results: {
    name: 'results'
  },
  reply: {
    paginate: 'paginate'
  },
  routes: {
    include: [
      '/shops'  // 店铺列表支持分页特性
    ],
    exclude: []
  }
}

module.exports = {
  register: hapiPagination,
  options: options,
}
```

在 app.js 中注册使用 hapi-pagination:

```js
// app.js
const pluginHapiPagination = require('./plugins/hapi-pagination');
await server.register([
  pluginHapiPagination,
])

```

为 GET /shops 的接口添加分页的入参校验，同时更新 Swagger 文档的入参契约。考虑到系统中未来会有不少接口需要做分页处理，我们在 utils/router-helper.js 中，增加一个公共的分页入参校验配置：

```js
// utils/router-helper.js
const paginationDefine = {
  limit: Joi.number().integer().min(1).default(10)
    .description('每页的条目数'),
  page: Joi.number().integer().min(1).default(1)
    .description('页码数'),
  pagination: Joi.boolean().description('是否开启分页，默认为true'),
}

module.exports = { paginationDefine }
```

最终，回到 router/shops.js，实现最后的分页配置逻辑。考虑到分页的查询功能除了拉取列表外，还要获取总条目数，Sequelize 为我们提供了 `findAndCountAll` 的 API，来为分页查询提供更高效的封装实现，返回的列表与总条数会分别存放在 `rows` 与 `count` 字段的对象中。

```js
const { paginationDefine } = require('../utils/router-helper');
// ...省略上下文
{
  method: 'GET',
  path: `/${GROUP_NAME}`,
  handler: async (request, reply) => {
    const { rows: results, count: totalCount } = await models.shops.findAndCountAll({
      attributes: [
        'id',
        'name',
      ],
      limit: request.query.limit,
      offset: (request.query.page - 1) * request.query.limit,
    });
    // 开启分页的插件，返回的数据结构里，需要带上 result 与 totalCount 两个字段
    reply({ results, totalCount });
  },
  config: {
    tags: ['api', GROUP_NAME],
    auth: false,
    description: '获取店铺列表',
    validate: {
      query: {
        ...paginationDefine
      }
    }
  }
}
// ...省略上下文

```

通过 Swagger 文档工具 [http://localhost:3000/documentation](http://localhost:3000/documentation) 查看店铺列表的接口调用返回数据，结果应该和下图相仿：

![](https://user-gold-cdn.xitu.io/2018/8/19/165528f7aa0b42c3?w=1482&h=1774&f=jpeg&s=317342)


## 实现获取单个店铺的商品列表接口

根据传入的店铺 ID，查询特定店铺 ID 下的商品列表，此处使用到了 sequelize 的 where 条件查询。同时，我们为店铺商品列表也加入分页的特性。

```js

// router/shops.js

const models = require("../models");
module.exports = [
  // ...省略上下文
  {
    method: 'GET',
    path: `/${GROUP_NAME}/{shopId}/goods`,
    handler: async (request, reply) => {
      // 增加带有 where 的条件查询
      const { rows: results, count: totalCount } = await models.goods.findAndCountAll({
        // 基于 shop_id 的条件查询
        where: {
          shop_id: request.params.shopId,
        },
        attributes: [
          'id',
          'name',
        ],
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      });
    },
  }
  // ...省略上下文
]
```

记得在 plugins/hapi-pagination.js 的 include 中加入 /shops/{shopId}/goods 的分页路由白名单。

```js
// plugins/hapi-pagination.js
const options = {
  // ...
  routes: {
    include: [
      '/shops/goods',
      '/shops/{shopId}/goods',
    ],
    exclude: []
  }
  // ...
}

```

更多关于 models 的操作请查看官方手册 [Model 使用][4]

GitHub 参考代码 [chapter8/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter8/hapi-tutorial-1)

[4]: http://docs.sequelizejs.com/manual/tutorial/models-usage.html


## 小结

关键词：Sequelize，Model定义，列表查询，分页

本小节，我们学习了如何使用 Sequelize 提供的数据库查询的方法，来获取列表数据。我们在大多数的使用场景下，都可以利用 Sequelize 简洁的函数式方法调用，避开直接拼写晦涩冗长的数据库查询语句，最终获取我们想要的业务数据查询结果。掌握 Sequelize 插件库，是 Node.js 下使用 MySQL 数据库的必修课。相关的使用手册文档，希望能经常温故而知新，掌握更多高级的使用技巧。

思考：我们发现实际的业务中，店铺的数量会很多，我们希望通过一些关键词的输入，来模糊查询匹配的店铺列表，路由该如何设计？Sequelize 该如何查询？

**本小节参考代码汇总**

Sequelize 连接 MySQL 数据库 - Sequelize 具体细节： [基础使用](http://docs.sequelizejs.com/manual/installation/usage.html)

实现店铺列表页接口 - 列表分页 - hapi-pagination 的 options 配置细节: [hapi-pagination](https://github.com/fknop/hapi-pagination/tree/v1.6.5)

实现获取单个店铺的商品列表接口：[chapter8/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter8/hapi-tutorial-1)

models 更多操作：[Model 使用](http://docs.sequelizejs.com/manual/tutorial/models-usage.html)







