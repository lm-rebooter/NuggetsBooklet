# 实战篇 6：身份验证实现 —— 使用 hapi-auth-jwt2

前一节，我们基本了解了 JWT 的技术特点、内容构成与安全校验等理论。这一节，我们先抛开小程序的场景使用特殊性，学习一种更为基础通用的 JWT 用户身份验证实现。小程序登录、微信微博第三方授权登录、短信验证码登录等，都是在该基础之上的二次开发。

## 基于 JWT 的通用身份验证流程

在实际的项目应用场景中，JWT 的身份验证流程大致如下：

1. 用户使用用户名密码、或第三方授权登录后，请求应用服务器；
2. 服务器验证用户信息是否合法；
3. 对通过验证的用户，签发一个包涵用户 ID、其他少量用户信息（比如用户角色）以及失效时间的 JWT token；
4. 客户端存储 JWT token，并在调用需要身份验证的接口服务时，带上这个 JWT token 值；
5. 服务器验证 JWT token 的签发合法性，时效性，验证通过后，返回业务数据。

## 使用 jsonwebtoken 签发 JWT

jsonwebtoken 是 Node.js 生态里用于签发与校验 JWT 的流行插件，本章节我们借助该插件来完成 JWT 字符串的生成签发。

```bash
npm i jsonwebtoken
```

### jwt.sign 签发

JWT 的签发语法是 `jwt.sign(payload, secretOrPrivateKey, [options, callback])`。默认的签发算法基于 HS256 (HMAC SHA256)，可以在 options 参数的 `algorithm` 另行修改。JWT 签发规范中的一些标准保留字段比如 `exp`，`nbf`，`aud`，`sub`，`iss` 等都没有默认值，可以一并在 payload 参数中按需声明使用，亦可以在第三个参数 options 中，通过 `expiresIn`，`notBefore`，`audience`，`subject`，`issuer` 来分别赋值，但是不允许在两处同时声明。

下面是一个最简单的默认签发，1 小时后失效。

```js
const jwt = require('jsonwebtoken');
// 签发一条 1 小时后失效的 JWT
const token = jwt.sign(
  {
    foo: 'bar',
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  },
  'your-secret'
);
```

### 实现接口 POST /users/createJWT

继续完善我们的项目案例，实际应用中的 JWT 签发，我们会把便于识别用户的 userId 的信息，签发在 payload 中，并同时给予一个失效时间。

在 routes 目录下，新增一个 users.js 的路由，并增加一个 JWT 测试性质的签发接口定义 POST /users/createJWT。app.js 中记得将 users 路由模块注册引入。

注意: _jwt.sign 的第二个参数 secret 是一个重要的敏感信息，可以通过 .env  的配置 JWT_SECRET 来分离。_

```js
// routes/users.js

const JWT = require('jsonwebtoken');

const GROUP_NAME = 'users';

module.exports = [{
  method: 'POST',
  path: `/${GROUP_NAME}/createJWT`,
  handler: async (request, reply) => {
    const generateJWT = (jwtInfo) => {
      const payload = {
        userId: jwtInfo.userId,
        exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
      };
      return JWT.sign(payload, process.env.JWT_SECRET);
    };
    reply(generateJWT({
      userId: 1,
    }));
  },
  config: {
    tags: ['api', GROUP_NAME],
    description: '用于测试的用户 JWT 签发',
    auth: false, // 约定此接口不参与 JWT 的用户验证，会结合下面的 hapi-auth-jwt 来使用
  },
}];

```

访问 swagger-ui 测试 JWT 签发，可以得到 JWT 的测试签发结果。

> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTUzNTMyMjc0NSwiaWF0IjoxNTM0NzE3OTQ1fQ.6tOdn2R82bxJbXjAnwU5g4g9EKqGNe-qo4qCo6UZnQ4

![](https://user-gold-cdn.xitu.io/2018/8/20/1655452f9bba8239?w=1476&h=840&f=jpeg&s=155119)

我们可以通过 https://jwt.io 来 decode JWT 中的 payload 信息，看能否拿到 userId。

![](https://user-gold-cdn.xitu.io/2018/8/20/1655454c39e1d022?w=1720&h=878&f=jpeg&s=142959)

## hapi-auth-jwt2 接口用户验证

接下来我们通过 hapi-auth-jwt2 插件，来赋予系统中的部分接口，需要用户登录授权后才能访问的能力。

### 1. 安装 hapi-auth-jwt2 插件

``` bash
npm i hapi-auth-jwt2@7
```

### 2. 引入 hapi-auth-jwt2 配置

``` bash
├── plugins                       # hapi 插件配置
│ ├── hapi-auth-jwt2.js           # jwt 配置插件
```

```js
const config = require('../config');

const validate = (decoded, request, callback) => {
  let error;
  /*
    接口 POST /users/createJWT 中的 jwt 签发规则

    const payload = {
      userId: jwtInfo.userId,
      exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
    };
    return JWT.sign(payload, process.env.JWT_SECRET);
  */

  // decoded 为 JWT payload 被解码后的数据
  const { userId } = decoded;

  if (!userId) {
    return callback(error, false, userId);
  }
  const credentials = {
    userId,
  };
  // 在路由接口的 handler 通过 request.auth.credentials 获取 jwt decoded 的值
  return callback(error, true, credentials);
};

module.exports = (server) => {
  server.auth.strategy('jwt', 'jwt', {
    // 需要自行在 config/index.js 中添加 jwtSecret 的配置，并且通过 process.env.JWT_SECRET 来进行 .git 版本库外的管理。
    key: config.jwtSecret,
    validateFunc: validate,
  });
  server.auth.default('jwt');
};

```

在 app.js 中注册 hapi-auth-jwt2 插件。

hapi-auth-jwt2 的注册使用方式与其他插件略有不同，是在插件完成 register 注册之后，通过获取 server 实例后才完成最终的配置，所以，在代码书写上，存在一个先后顺序问题。

```js
  const hapiAuthJWT2 = require('hapi-auth-jwt2');
  const pluginHapiAuthJWT2 = require('./plugins/hapi-auth-jwt2');

  const init = async () => {
    // ... 省略上下文
    await server.register([
      hapiAuthJWT2
    ])
    pluginHapiAuthJWT2(server);
    // ... 省略上下文
  }
```

一旦在 app.js 中，引入 hapi-auth-jwt 插件后，所有的接口都默认开启 JWT 认证，需要我们在接口调用的过程中，在 header 中添加带有 JWT 的 authorization 的字段。此时通过 Swagger 文档访问我们先前的 shops 任意接口，由于没有传输 JWT ，接口都会返回 `401` 的错误。

```js
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Missing authentication"
}
```

如果希望一些特定接口不通过 JWT 验证，比如店铺和商品列表并不希望用户登录后才能访问。可以在 router 中的 config 定义 auth=false 的配置，再通过 Swagger 文档试试对应配置的接口

```js
  config: {
    auth: false,
  }
```

同步更新 validate 中针对 authorization 的 header 入参校验，在 Swagger 文档中也会同步自动更新。

```js
config: {
  validate: {
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }
}
```

### 3. 迅速重构整理公共的 header 定义

``` bash
├── utils                       # hapi 插件配置
│ ├── router-helper.js          # 一个 helper 的工具类来实现公共代码
```

utils/router-helper.js

```js
const Joi = require('joi')

const jwtHeaderDefine = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}

module.exports = { jwtHeaderDefine }
```

在需要使用到 authorization 的 header 配置处只需要使用如下语法即可：

```js
config: {
  validate: {
    ...jwtHeaderDefine
  }
}
```

### 4. handler 中使用 JWT 的获取 userId

上文 3.2 中所提到的 plugins/hapi-auth-jwt2.js， 会通过 callback(error, true, credentials) 的第三个参数，将 JWT 解码过所需要露出的数据字段与值追加到 `request.auth` 中，然后在路由 handler 的生命周期中，通过 `request.auth.credentials` 来获取对应的信息。

我们使用 POST /users/createJWT 来生成一段 JWT。 再通过 tests/hello-hapi.js 的接口 tests/ 做一个实验性验证。

```js
const { jwtHeaderDefine } = require('../utils/router-helper');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      /*
      plugins/hapi-auth-jwt2.js 中的 credentials 定义

      const credentials = {
        userId,
      };
      */
      console.log(request.auth.credentials); // 控制台输出 { userId: 1}
      reply('hello hapi');
    },
    config: {
      tags: ['api', 'tests'],
      description: '测试hello-hapi',
      validate: {
        ...jwtHeaderDefine, // 增加需要 jwt auth 认证的接口 header 校验
      },
    },
  },
];
```

获取到其中的 userId 数据，后续就可以继续完成我们的业务逻辑流程了。

> **GitHub 参考代码** [chapter10/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter10/hapi-tutorial-1)


## 小结

关键词：hapi-auth-jwt2，JWT 签发，JWT handler 解码

本小节，我们通过实现 POST /users/createJWT 的方法，来掌握 JWT 的签发实现。并且利用 hapi-auth-jwt2 插件，在不对路由配置做任何修改的前提下，来对系统中的所有接口统一赋能 JWT 用户验证。不需要验证的接口则通过 config.auth = false 的方式来标记放行。利用插件统一的用户验证机制，能够帮助我们更好地聚焦业务实现的本身。

思考：我们利用 swagger-ui 的调试功能，以几秒的时间间隔，从 /users/createJWT，先后获取两个不同的 JWT。最早获取的第一个 JWT，在当下的系统实现中，会否因为第二个 JWT 的签发而失效？背后的原因本质又是什么？

**本小节参考代码汇总**

hapi-auth-jwt2 实现 JWT 用户身份验证： [chapter10/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter10/hapi-tutorial-1)
