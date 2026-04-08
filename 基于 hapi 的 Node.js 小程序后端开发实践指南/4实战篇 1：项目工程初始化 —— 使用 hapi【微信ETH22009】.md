# 实战篇 1 ：项目工程初始化 —— 使用 hapi

终于来到了项目实战的章节，写代码是我们程序爱好者最有幸福感的一刻。本小节将带同学们掌握 hapi 作为应用框架的基础使用方法，以及项目工程化结构布局的设计原则。带你体验程序项目工程搭建中的静与动。


## 基础项目工程搭建

**1. 初始化 Node.js 项目**

使用 npm init 来生成项目工程的初始化 package.json 文件，里面可以补全一些开发者信息、项目描述、代码仓库地址等基础描述，最最重要的是，后续的前端项目所依赖的外部模块，都将持续更新出现在 package.json 中：

```bash
npm init
```

**2. 安装 hapi 模块**

这里，我们使用 hapi 的 v16 版本，由于 hapi 最新的版本是 v17 ，所以通过补一个 @16 来帮助我们明确所需安装的模块版本号：

```bash
npm i hapi@16
```

**3. 最基础的 hapi 服务代码**

在项目工程目录中，创建一个 app.js 文件作为服务的启动入口：

```js
// app.js
const Hapi = require('hapi');

const server = new Hapi.Server();
// 配置服务器启动 host 与端口
server.connection({
  port: 3000,
  host: '127.0.0.1',
});

const init = async () => {
  server.route([
    // 创建一个简单的 hello hapi 接口
    {
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply('hello hapi');
      },
    },
  ]);
  // 启动服务
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();

```

> **GitHub 参考代码**
[chapter5/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter5/hapi-tutorial-1)

**4. 启动 hapi 服务**

在 terminal 终端：

```bash
node app.js
# 或者希望在编辑完源代码后，服务自动重启，使用 supervisor
supervisor app.js
```

**5. 验证 hapi 服务**

打开浏览器，访问 [http://127.0.0.1:3000](http://127.0.0.1:3000) 我们将看到浏览器中看到 hello hapi 的字样：

![](https://user-gold-cdn.xitu.io/2018/8/14/165379de186adeac?w=780&h=310&f=jpeg&s=30574)

或者通过 terminal 中构造一个 cURL 请求，查看数据返回：

```bash
curl 'http://127.0.0.1:3000'
# 输出 hello hapi
```

此时，一个最基础的 API 接口服务已经得到了。

## 结构化项目工程重构

基础 API 服务的搭建，将所有的代码信息都集中在了一个文件之中，这样很难满足日后项目规模扩大所要求的代码可维护性。
为项目工程代码的书写，约定形成一套良好的模块化文件结构与规范，以预留足够的可扩展空间，这是一门架构设计的艺术，宛若一场大气的棋局，棋手早早地预知了未来而有所布设。一大波赶来的后续业务需求，都可以在这套规则体系下各得其所，从容不迫，游刃有余。

### 项目工程化设计原则

- 单业务模块化

  大多数的内务需求，都最终可以被归纳进单个模块，模块与模块间具有物理文件独立性，能更好地便于多人的项目团队人员同时维护代码。

- 模块二百行原则

  二百行是个虚数泛指，但也在大量的项目实践后发现，大多数单文件的模块代码，在良好的设计规划下，往往很难突破两百行的数目，而两百行内的代码的阅读与维护，也都是一个心理压力较小的量级。
  
  正所谓合久必分，单个模块的代码量大量增长，可以考虑分离部分代码到外部文件来管理，通过模块 require 的方式形成关联，以保持各模块代码的相对精简与可维护性。

- 同类模块分组化

  分组在本文中一般指形成一个文件目录，来对一些功能相似的业务模块形成管理，比如常见的路由模块，会有大量不同的基于 resource 的资源路由，被分离在单个模块文件中，最终汇总在 router 的目录。再比如定义数据库表结构映射关系的 model 模型类模块，最终也往往会习惯汇总到一个 model 的目录中，形成统一管理。

- 配置文件分离

  系统中往往会存在一些诸如服务启动的端口号、服务名称、数据库连接配置、服务启动的性能参数域值配置等等，这些参数的业务逻辑往往离散在系统中的各个独立模块中，将其抽取在一个统一的类似 config.js 的配置文件中进行整体管理，可以避免日后打地鼠式的在模块中四处找寻，以及修改编辑疏漏。

基于上述原则，我们就基础项目工程进行拆分重构。

### 重构步骤

**1. 重新梳理项目工程目录**

``` bash
├── config                       # 项目配置目录
|   ├── index.js                 # 配置项目中的配置信息
├── models                       # 数据库 model
├── node_modules                 # node.js 的依赖目录
├── plugins                      # 插件目录
├── routes                       # 路由目录
│   ├── hello-world.js           # 测试接口 hello-world
├── utils                        # 工具类相关目录
├── app.js                       # 项目入口文件
├── package.json                 # JS 项目工程依赖库
├── readme.md                    # 项目工程如何被使用的说明手册

```

**2. 分离路由配置**
  
在 routes 目录添加一个 hello-hapi.js 文件:

```js
// routes/hello-hapi.js
module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hapi');
    }
  }
]
```

**3. 分离 config 基础参数配置**

在 config 目录添加一个 index.js 文件，将服务启动的相关配置，移动到 config 中：

``` js
// config/index.js
module.exports = {
  host: '127.0.0.1',
  port: 3000,
}
```

**4. 关联 config 与 route 路由模块**

```js
// APP 入口的 JS
const Hapi = require('hapi');
const config = require('./config');
const routesHelloHapi = require('./routes/hello-hapi');

const server = new Hapi.Server();
// 配置服务器启动 host 与端口
server.connection({
  port: config.port,
  host: config.host,
});

const init = async () => {
  server.route([
    // 创建一个简单的 hello hapi 接口
    ...routesHelloHapi,
  ]);
  // 启动服务
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();

```

> **GitHub 参考代码**
[chapter5/hapi-tutorial-2](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter5/hapi-tutorial-2)

### 环境配置

**环境配置的重要性**

理论上，基础项目代码分离至上述情况，已经初步具备了支撑不断增长的业务需求的设计弹性。但是对于应用程序运行的环境来说，不同的环境往往有不同的配置。

例如，我们的本地数据库连接用户名密码与服务器环境的用户名密码并不一样。又例如，我们本地启动服务的 IP 与端口与服务器环境有所不同。缺乏环境配置文件的硬编码开发，虽然书写代码省事，但会给我们后续长期维护项目代码带来极大的麻烦与编辑修改配置的风险隐患。

我们在项目的实践过程中，往往也会和一些敏感的数据信息打交道，比如数据库的连接用户名、密码，第三方 SDK 的 secret 等。这些参数的配置信息，原则上是禁止进入到 git 版本仓库的。一来在开发环境中，不同的开发人员本地的开发配置各有不同，不依赖于 git 版本库配置。二来敏感数据的入库，增加了人为泄漏配置数据的风险，任何可以访问 git 仓库的开发人员，都可以从中获取到生产环境的 secret key。一旦被恶意利用，后果不堪设想。

于是我们考虑引入一个被 .gitignore 的 .env 的文件，以 key-value 的方式，记录系统中所需要的可配置环境参数。并同时配套一个.env.example 的示例配置文件用来放置占位，.env.example 可以放心地进入 git 版本仓库。

**以当前的项目为例**

我们在本地创建一个 .env.example 文件作为配置模板，内容如下：

```bash
# .env.expamle

# 服务的启动名字和端口，但也可以缺省不填值，默认值的填写只是一定程度减少起始数据配置工作
HOST = 127.0.0.1
PORT = 3000
```

然后复制出一份真实的 .env 文件，来供系统最终使用，填入真实可用的配置信息。

```bash
# .env

# 服务的启动名字和端口
HOST = 127.0.0.1
PORT = 3000
```

**如何读取 .env 中的配置值**

Node.js 可以通过 env2 的插件，来读取 .env 配置文件，加载后的环境配置参数，可以通过例如  process.env.PORT 来读取端口信息。

```bash
# 系统全局安装
supervisor
npm i env2
```

```js
// app.js

require('env2')('./.env')
```

config/index.js中的配置参数最终变为如下：

```js
// config/index.js

const { env } = process;

module.exports = {
  host: env.HOST,
  port: env.PORT,  
}
```

最后，记得在 .gitignore 文件中增加一行 .env，用来避免该文件的 git 版本入库。同时在未来交付生产环境的时候，环境参数的配置交由生产环境的运维人员处理，项目的敏感配置数据的安全性可以得到一定程度的保证。

> **GitHub 参考代码** [chapter5/hapi-tutorial-3](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter5/hapi-tutorial-3)

## 小结

关键词：hapi 接口服务，项目工程化设计，环境配置

通过本小节的学习，我们一定会为实现了第一个基于 hapi 的 API 接口而兴奋。但笔者更希望能通过本节的话题内容设计，带给同学们一种项目工程化的格局意识。大多数的软件工程项目，随着业务的深入，都会依赖于更多的工程师加入，能否具备良好的业务与人员的可扩展性，直接体现了项目工程化设计的优劣高低。

思考：案例中项目工程目录的预留，外卖系统中所涉及的业务功能的实现，在你的脑海中，能否找到一些对号入座的从容填坑感？  

我们在后面的内容里，来持续作出验证。


**本小节参考代码汇总**

基础项目工程搭建 - hapi 服务代码： [chapter5/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter5/hapi-tutorial-1)

结构化项目工程重构 - 重构步骤： [chapter5/hapi-tutorial-2](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter5/hapi-tutorial-2)

结构化项目工程重构 - 环境配置： [chapter5/hapi-tutorial-3](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter5/hapi-tutorial-3)