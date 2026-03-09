# 实战篇 8：订单创建 —— 使用事务

前面三节，我们用了较多的篇幅来交代用户身份管理与验证的技术实现，解决完用户身份验证的问题之后，我们终于可以开始实现与用户身份相关的订单创建的功能。

## 用户下单的订单表结构设计

对于一笔订单记录，往往涉及订单的订单编号，创建时间，订单的用户，支付状态，支付流水号，以及订单的商品详情。由于订单的收件地址涉及地址管理的相关业务逻辑，实际逻辑与订单商品的逻辑相仿，故而在小册中作精简设计。

### 1. orders 表结构定义与迁移

订单 orders 的表结构定义：

字段    |字段类型     |字段说明
-------|----------|--------
id    | integer  | 订单的 ID，自增
user_id    |integer   | 用户的 ID
payment_status    | enum   |付款状态

创建 orders 表的迁移文件 create-orders-table:

```bash
$ node_modules/.bin/sequelize migration:create --name create-orders-table
```

```js
// migrations/create-orders-table.js
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'orders',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('0', '1'),  // 0 未支付， 1 已支付
        defaultValue: '0',
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
  ),

  down: queryInterface => queryInterface.dropTable('orders'),
};

```

在 models 中定义 orders 表结构:

```js
// models/orders.js

module.exports = (sequelize, DataTypes) => sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM('0', '1'),  // 0 未支付， 1 已支付
      defaultValue: '0',
    },
  },
  {
    tableName: 'orders',
  },
);

```

### 2. order_goods 表结构定义与迁移

订单商品表 order_goods 的表结构定义：

字段    |字段类型     |字段说明
-------|----------|--------
id    | integer  | 订单商品的 ID，自增
order_id    |integer   | 订单的 ID
goods_id    |integer   | 商品的 ID
single_price | float | 商品的价格
count | integer | 商品的数量

创建 order-goods 表的迁移文件 create-order-goods-table：

```bash
$ node_modules/.bin/sequelize migration:create --name create-order-goods-table
```

```js
// migrations/create-order-goods-table.js
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'order_goods',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      goods_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      single_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
  ),

  down: queryInterface => queryInterface.dropTable('order_goods'),
};

```

在 models 中定义表结构：

```js
// models/order-goods.js

module.exports = (sequelize, DataTypes) => sequelize.define(
  'order_goods',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    single_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'order_goods',
  },
);

```

向数据库迁移 orders 与 order-goods 表：

```bash
$ node_modules/.bin/sequelize db:migrate
```

## 为通过身份验证的用户创建订单

我们在《实战篇 2：接口契约与入参校验——使用 Swagger & Joi》一节，在 routes/orders.js 中为订单创建，预留过如下的入参校验的 API 接口配置：

```js

// 参数校验
{
  method: 'POST',
  path: `/${GROUP_NAME}`,
  handler: async (request, reply) => {
    reply();
  },
  config: {
    tags: ['api', GROUP_NAME],
    description: '创建订单',
    validate: {
      payload: {
        goodsList: Joi.array().items(
          Joi.object().keys({
            goods_id: Joi.number().integer(),
            count: Joi.number().integer(),
          }),
        ),
      },
      ...jwtHeaderDefine,
    },
  },
},
```

传入的订单商品信息以数组的方式描述，例如：

```js
// 参数示例
[
  { goods_id: 123, count: 1 },  // 1件 id 为123 的商品
  { goods_id: 124, count: 2 },  // 2件 id 为124 的商品
]
```

后续的订单创建，将在 handler 的处理方法中继续展开。

## 理解事务的使用场景

从表结构的设计关系来看，创建一次订单，依赖于先创建产生一条 orders 表的记录，获得一个 order_id, 然后在 order_goods 表中通过 order_id 插入订单中的每一条商品记录，以最终完成一次完整的订单创建行为。中途若商品记录的插入遇到了失败，则一个订单记录的创建行为便是不完整的，orders 表中却产生了一条数据不完整的垃圾数据。在这样的场景下，我们可以尝试引入事务操作。

数据库中的事务是指单个逻辑所包含的一系列数据操作，要么全部执行，要么全部不执行。在一个事务中，可能会包含开始（start）、提交（commit）、回滚（rollback）等操作，Sequelize 通过 Transaction 类来实现事务相关功能。以满足一些对操作过程的完整性比较高的使用场景。

Sequelize 支持两种使用事务的方法：

- 托管事务
- 非托管事务

托管事务基于 Promise 结果链进行自动提交或回滚。非托管事务则交由用户自行控制提交或回滚。

## 使用托管事务创建订单

```js
async handler(request, reply) => {
  await models.sequelize.transaction((t) => {
    const result = models.orders.create(
      { user_id: request.auth.credentials.userId },
      { transaction: t },
    ).then((order) => {
      const goodsList = [];
      request.payload.goodsList.forEach((item) => {
        goodsList.push(models.order_goods.create({
          order_id: order.dataValues.id,
          goods_id: item.goods_id,
          // 此处单价的数值应该从商品表中反查出写入，出于教程的精简性而省略该步骤
          single_price: 4.9,
          count: item.count,
        }));
      });
      return Promise.all(goodsList);
    });
    return result;
  }).then(() => {
    // 事务已被提交
    reply('success');
  }).catch(() => {
    // 事务已被回滚
    reply('error');
  });
}
```

无论是托管事务还是非托管事务，只要 sequelize.transaction 中抛出异常，sequelize.transaction 中所有关于数据库的操作都将被回滚。

更多功能请查看官方手册 [Transactions
][1]。

[1]: http://docs.sequelizejs.com/manual/tutorial/transactions.html

> **GitHub 参考代码** [chapter12/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter12/hapi-tutorial-1)


## 小结

关键词：request.auth.credentials，sequelize.transaction

本小节我们通过订单创建的案例，给同学们介绍了利用 request.auth.credentials 来解析 JWT，获取当前用户的身份标识，再利用 sequelize.transaction 完成数据库事务的使用，确保跨表的订单数据创建完整性。以帮助同学们在日后实现其他重要而涉及连续操作的业务时，很好地举一反三，有的放矢。

**本小节参考代码汇总**

GitHub 参考代码：[chapter12/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter12/hapi-tutorial-1)

sequelize.transaction 更多操作参考官方手册：[Transactions
](http://docs.sequelizejs.com/manual/tutorial/transactions.html)


