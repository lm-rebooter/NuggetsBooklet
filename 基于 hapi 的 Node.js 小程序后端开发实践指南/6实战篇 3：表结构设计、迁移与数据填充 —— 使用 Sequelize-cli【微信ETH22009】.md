# 实战篇 3：表结构设计、迁移与数据填充 —— 使用 Sequelize-cli

要实现小程序的店铺与商品列表信息展示的业务功能，离不开数据库的支持。数据库的连接创建、表结构的初始化、起始数据的填充都是需要解决的基础技术问题。

## 业务数据表结构设计

### 表结构设计的话题背景约定

考虑到本小册的篇幅所限，并且话题的重心在 Node.js 案例的整体技术架构的设计，数据库层面的表结构设计、细节字段数据类型的优化，不作为本小册的重点，读者朋友可以通过其他的教程资料，来更好地系统学习数据库表结构设计与优化的相关知识。

### 设计店铺表和商品表

**店铺表**：展示店铺名称、图标 URL。

字段    |字段类型     |字段说明
-------|----------|--------
id    | integer  | 店铺的 ID，自增
name | varchar(255) | 店铺的名称
thumb_url | varchar(255) | 店铺的图片
created_at | datetime | 记录的创建时间
updated_at | datetime | 记录的更新时间

**商品表**：展示商品名称、图标 URL、商品单价。

字段    |字段类型     |字段说明
-------|----------|--------
id    | integer  | 商品的 ID，自增
name | varchar(255) | 商品的名称
thumb_url | varchar(255) | 商品的图片
shop_id    | integer  | 店铺的 ID
created_at | datetime | 记录的创建时间
updated_at | datetime | 记录的更新时间

## MySQL 与 Sequelize

本小册的案例所使用的数据库为 MySQL 5.6。Sequelize 则是 Node.js 生态中一款知名的基于 promise 数据库 ORM 插件，提供了大量常用数据库增删改查的函数式 API，以帮助我们在实际开发中，大量减少书写冗长的基础数据库查询语句。

Sequelize 支持的数据库有：PostgreSQL，MySQL，MariaDB，SQLite 和 MSSQL。在使用不同的数据库时候，需要我们开发者额外安装不同的对应数据库连接驱动，比如我们小册中使用的 MySQL，则依赖于插件 MySQL2 。

## Sequelize-cli

Sequelize 插件的主要应用场景是实际应用开发过程中的代码逻辑层。与其相伴的还有一套 cli 工具，Sequelize-cli，提供了一系列好用的终端指令，来帮助我们完成一些常用的琐碎任务。

### 1.安装依赖

考虑到我们的系统案例使用 MySQL 作为基础数据库，安装如下依赖：

```bash
npm i sequelize-cli -D
npm i sequelize
npm i mysql2
```

### 2.sequelize init

通过 sequelize-cli 初始化 sequelize，我们将得到一个好用的初始化结构：

```bash
node_modules/.bin/sequelize init
```

``` bash
├── config                       # 项目配置目录
|   ├── config.json              # 数据库连接的配置
├── models                       # 数据库 model
|   ├── index.js                 # 数据库连接的样板代码
├── migrations                   # 数据迁移的目录
├── seeders                      # 数据填充的目录
```

**config/config.json**

默认生成文件为一个 config.json 文件，文件里配置了开发、测试、生产三个默认的样板环境，我们可以按需再增加更多的环境配置。但考虑到前面的章节，我们所讨论的环境变量配置，用来更灵活地管理数据库的连接端口、用户名、密码等，sequelize-cli 也兼容脚本模式的 config.js 的形式，JavaScript 脚本可以方便我们在配置中加入更多的动态内容。

修改后的 config/config.js 如下，仅预留了 development（开发） 与 production（生产） 两个环境，开发环境与生产环境的配置参数可以分离在 .env 和 .env.prod 两个不同的文件里，通过环境变量参数 `process.env.NODE_ENV` 来动态区分。

```js
// config/config.js
if (process.env.NODE_ENV === 'production') {
  require('env2')('./.env.prod');
} else {
  require('env2')('./.env');
}


const { env } = process;

module.exports = {
  "development": {
    "username": env.MYSQL_USERNAME,
    "password": env.MYSQL_PASSWORD,
    "database": env.MYSQL_DB_NAME,
    "host": env.MYSQL_HOST,
    "port": env.MYSQL_PORT,
    "dialect": "mysql",
    "operatorsAliases": false,  // 此参数为自行追加，解决高版本 sequelize 连接警告
  },  
  "production": {
    "username": env.MYSQL_USERNAME,
    "password": env.MYSQL_PASSWORD,
    "database": env.MYSQL_DB_NAME,
    "host": env.MYSQL_HOST,
    "port": env.MYSQL_PORT,
    "dialect": "mysql",
    "operatorsAliases": false, // 此参数为自行追加，解决高版本 sequelize 连接警告
  }
}
```

```!
由于 sequelize-cli 自动生成的配置 config/config.js 中为了兼容老版本模式，并未显式将 operatorsAliases 的映射关系给关闭，所以，会收到一条运行警告 sequelize deprecated String based operators are now deprecated ...。官方明确指出 ne, not, in, notIn, gte, gt, lte, lt, like, ilike, $ilike, nlike, $notlike, notilike, .., between, !.., notbetween, nbetween, overlap, &&, @>, <@ 这些映射操作符，将在未来的版本被移除。  。如果希望遵循官方未来更倾向的操作符使用方式，则可以将之设为 false 。
```

**models 目录与 models/index.js**

用于定义数据库表结构对应关系的模块目录，sequelize-cli 会在 models 目录中自动生成一个 index.js，该模块会自动读取 config/config.js 中的数据库连接配置，并且动态加载未来在 models 目录中所增加的数据库表结构定义的模块，最终可以方便我们通过 models.tableName.operations 的形式来展开一系列的数据库表操作行为，具体的使用，我们放在下一章节细讲。

**migrations 目录**

用于通过管理数据库表结构迁移的配置目录。初始化完成后目录中暂无内容。

**seeders 目录**

用于在数据库完成 migrations 初始化后，填补一些打底数据的配置目录。初始化完成后目录中暂无内容。

### 3.sequelize db:create

根据前文，我们配置了 config/config.js 中的数据库连接信息，分别有开发环境与生产环境两个。执行下面的命令，可以默认使用 development 下的配置，来创建项目数据库。增加例如 `--env production`，则使用 config/config.js 中的 production 项配置，来完成数据库的创建。

```bash
node_modules/.bin/sequelize db:create

# 通过 --env 参数，指定为生产环境创建项目数据库
# node_modules/.bin/sequelize db:create --env production
```

## migrate 数据迁移

### 1. sequelize migration:create

数据库被创建完成后，数据表的创建，初学者的时候，我们或许会借助于诸如 navicat 之类的 GUI 工具，通过图形化界面的引导，来完成一张一张的数据库表结构定义。这样的编辑手法能达成目的，但是对于一个持续迭代，长期维护的数据库而言，表结构的调整，字段的新增，回退，缺乏一种可追溯的程序化迁移管理，则会陷入各种潜在人为操作过程中的风险。

Migration 迁移的功能的出现，正是为了解决上述人为操作所不可追溯的管理痛点。Migration 就像我们使用 Git / SVN 来管理源代码的更改一样，来跟踪数据库表结构的更改。 通过 migration，我们可以将现有的数据库表结构迁移到另一个表结构定义，反之亦然。这些表结构的转换，将保存在数据库的迁移文件定义中，它们描述了如何进入新状态以及如何还原更改以恢复旧状态。

以**店铺表 shops**的定义设计为例。我们需要为数据库创建一张 shops 新表，表结构如描述。

使用 `sequelize migration:create` 来创建一个迁移文件 create-shops-table。

```bash
node_modules/.bin/sequelize migration:create --name create-shops-table
```

在 migrations 的目录中，会新增出一个 xxxxxxxxx-create-shops-table.js 的迁移文件，xxxxxxxxx 为迁移表文件创建的时间戳，用来备注标记表结构改变的时间顺序。自动生成的文件里，包涵有 `up` 与 `down` 两个空函数， `up` 用于定义表结构正向改变的细节，`down` 则用于定义表结构的回退逻辑。比如 `up` 中有 `createTable` 的建表行为，则 `down` 中配套有一个对应的 `dropTable` 删除表行为。

create-shops-table 表定义如下（由于笔者的项目用例代码中开启了 Airbnb 的 eslint 语法规范检查，所以，实际的用例代码，会与 sequelize-cli 生成的默认结构略有不同）：

```js
// xxxxxxxxx-create-shops-table.js
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'shops',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumb_url: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
  ),

  down: queryInterface => queryInterface.dropTable('shops'),
};

```

同理创建商品 goods 的迁移文件:

```bash
node_modules/.bin/sequelize migration:create --name create-goods-table
```

```js
// migrations/xxxxxxxxx-create-goods-table.js

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'goods',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumb_url: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
  ),

  down: queryInterface => queryInterface.dropTable('goods'),
};

```

### 2. sequelize db:migrate

`sequelize db:migrate` 的命令，可以最终帮助我们将 migrations 目录下的迁移行为定义，按时间戳的顺序，逐个地执行迁移描述，最终完成数据库表结构的自动化创建。并且，在数据库中会默认创建一个名为 SequelizeMeta 的表，用于记录在当前数据库上所运行的迁移历史版本。

```bash
node_modules/.bin/sequelize db:migrate
```

### 3. sequelize db:migrate:undo

`sequelize db:migrate:undo` 则可以帮助我们按照 
`down` 方法中所定义的规则，回退一个数据库表结构迁移的状态，读者朋友可以自行尝试。

```bash
node_modules/.bin/sequelize db:migrate:undo
```

通过使用 `sequelize db:migrate:undo:all` 命令撤消所有迁移，可以恢复到初始状态。 我们还可以通过将其名称传递到 `--to` 选项中来恢复到特定的迁移。

```bash
node_modules/.bin/sequelize db:migrate:undo:all --to xxxxxxxxx-create-shops-table.js
```

### 4. 向表中追加字段（扩展阅读）

并非所有的迁移场景都是创建新表，随着业务的不断深入展开，表结构的字段新增，也是常见的需求。比如店铺 shops 表中增加一列 `address` 地址信息。

创建一个名叫 add-columns-to-shops-table 的迁移迁移文件：

```bash
node_modules/.bin/sequelize migration:create --name add-columns-to-shops-table
```

然后我们向该文件中添加如下代码：

```js
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('shops', 'address', { type: Sequelize.STRING }),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('shops', 'address'),
  ]),
};
```

> **GitHub 参考代码** [chapter7/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter7/hapi-tutorial-1)

> 更多功能请查看 [QueryInterface API](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html)

## seeders 种子数据填充

数据库表结构初始化完，如果我们想要向表中初始化一些基础数据，我们可以使用 seeders 来完成，使用方式与数据库表结构迁移相似。

### 1. sequelize seed:create

下面让我们 shops 表为例，为表中添加些基础数据：

```bash
node_modules/.bin/sequelize seed:create --name init-shops
```

这个命令将会在 `seeders` 文件夹中创建一个种子文件。文件名看起来像是  `xxxxxxxxx-init-shops.js`，它遵循相同的 `up/down` 语义，如迁移文件。

向该文件中添加如下内容：

```js
// seeders/xxxxxxxxx-init-shops.js

const timestamps = {
  created_at: new Date(),
  updated_at: new Date(),
};

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'shops',
    [
      { id: 1, name: '店铺1', thumb_url: '1.png', ...timestamps },
      { id: 2, name: '店铺2', thumb_url: '2.png', ...timestamps },
      { id: 3, name: '店铺3', thumb_url: '3.png', ...timestamps },
      { id: 4, name: '店铺4', thumb_url: '4.png', ...timestamps },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    // 删除 shop 表 id 为 1，2，3，4 的记录
    return queryInterface.bulkDelete('shops', { id: { [Op.in]: [1, 2, 3, 4] } }, {});
  },
};

```

### 2. sequelize db:seed:all

与 `db:migrate` 相似，执行 `sequelize db:seed:all` ，将向数据库填充 seeders 目录中所有 `up` 方法所定义的数据。

```bash
node_modules/.bin/sequelize db:seed:all
```

注意: _seeders 的执行，不会将状态存储在 SequelizeMeta 表中。_

当然，我们也可以通过 `--seed` 来制定特定的 seed 配置来做填充：

```bash
node_modules/.bin/sequelize db:seed --seed xxxxxxxxx-init-shopsjs
```

### 3. sequelize db:seed:undo

Seeders 所填充的数据，也与迁移的 `db:migrate:undo` 相仿，只是不会进入 SequelizeMeta 记录。两个可用的命令如下，很简单，不再赘述：

```bash

# 撤销所有的种子
node_modules/.bin/sequelize db:seed:undo:all

# 撤销指定的种子
node_modules/.bin/sequelize db:seed:undo --seed XXXXXXXXXXXXXX-demo-user.js
```

GitHub 参考代码 [chapter7/hapi-tutorial-2](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter7/hapi-tutorial-2)


以上，我们利用 sequelize-cli 完成了数据库的创建、迁移、填充。


## 小结

关键词：sequelize-cli，migrate，seed

本小节我们学习了如何利用 sequelize-cli 通过程序脚本 migrate 自动创建既定数据结构的数据库，以及利用 seed 填充起始数据。这些方法有效地帮助我们保证了不同系统环境下，通过 migrate 与 seed 得到的数据库环境的一致性，并且最大化地降低了人为手动操作的意外风险。


**本小节参考代码汇总**

migrate 数据迁移：GitHub 参考代码  [chapter7/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter7/hapi-tutorial-1)

更多功能 [QueryInterface API](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html)

seeders 种子数据填充：GitHub 参考代码 [chapter7/hapi-tutorial-2](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter7/hapi-tutorial-2)