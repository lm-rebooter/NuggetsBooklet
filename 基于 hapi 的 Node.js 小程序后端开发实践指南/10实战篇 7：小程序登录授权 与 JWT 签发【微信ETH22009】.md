# 实战篇 7：小程序登录授权与 JWT 签发

借助于微信小程序自身的第三方登录能力，能够让用户获得更好的应用使用体验，避开了繁琐的注册信息的提交，带来更好的用户交互体验。本小节将介绍微信小程序授权登录的开发流程，最终将小程序的有效登录，创建获取对应的相关用户，签发 JWT。

在小节的核心话题之外，我们还可以学习体会随着项目工程的需求增加，数据库增量迁移 migrate 的过程。  

下面是微信小程序登录的官方流程示意图：

![](https://user-gold-cdn.xitu.io/2018/8/27/1657752198db3025?w=710&h=720&f=jpeg&s=61617)

我们以现有的 hapi 后端服务应用为例：

1） 小程序提供自封装的 `wx.login()` 方法，帮助前端开发者获取 临时登录凭证 code 值。

2） hapi 后端服务提供一个类似 wxLogin 的接口，接收小程序传来的 code 值，结合小程序申请时的 appid 与 appsecret，一并向微信接口服务器交换回 session_key 与 openid 等。临时登录凭证 code 只能使用一次。会话密钥 session_key 是对用户数据进行加密签名的密钥。为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。

3） hapi 后端服务通过 openid 向数据库查询是否已有该 openid 的用户，如果没有，则作为新用户，创建一条该 openid 的 新用户记录。最终获取该 openid 所对应的 user_id，并向小程序签发包涵 user_id 的 JWT。

4） 小程序获取到 JWT 信息后，保存在本地，并在后续的请求中通过 header Authorization=(jwt 值) 的方式与 hapi 后端服务器通信，访问需要身份验证的服务接口。

## 小程序端主要实现细节

### 1. getUserInfo 获取用户信息

小程序为 button 按钮提供 open-type="getUserInfo" 的获取用户信息的开放能力，并通过 `bindgetuserinfo="onGotUserInfo"` 的回调函数定义，来响应返回的用户信息。
按钮被点击后，小程序会自动从微信服务器获取包含 encryptedData，iv，rawData, signature, userInfo 等用户信息的数据存放在 `detail` 的字段中，并返回到 `onGotUserInfo` 的回调函数。具体参考代码如下：

```html
<view class="page">
  <button open-type="getUserInfo" bindgetuserinfo="onGotUserInfo">微信登录</button>
</view>
```

```js
Page({
  onGotUserInfo (e) {
    // e.detail 跟 wx.getUserInfo()获取的用户信息是一样的
    const { encryptedData, iv, rawData, signature, userInfo } = e.detail;
  }
})
```

其中的字段说明:

- `encryptedData`: 加密的用户信息，包含 openid 和 unionid。
- `iv`: 对 encryptedData 加密算法的初始向量，解密 encrytedData 时要用到。
- `rawData`: userInfo 的 json 字符串，不包含 openid 和 unionid。
- `signature`: 使用 sha1 对 rawData + session_key 签名得到的字符串。
- `userInfo`: 用户信息的对象，不包含 openid 和 unionid，供前端使用。

由于小程序应用的服务端无法获取到微信用户的信息，当服务端需要用户的信息时，只能前端把用户信息传给服务端，为了确保用户信息数据的完整、不被篡改，微信对用户信息数据做了签名和加密处理。encryptedData 是加密的用户信息，signature 是签名的字符串，根据自己后台的需求选择使用 encryptedData 还是 signature。 本文中使用 encryptedData，因为校验 signature 比较简单，在服务端用 sha1 对 rawData + session_key 签名，然后判断跟 signature 是不是相等就可以了，所以本文中不作讲解。

数据签名的官方流程图如下：


![](https://user-gold-cdn.xitu.io/2018/8/27/1657752595e923a4?w=830&h=304&f=jpeg&s=26053)


### 2. 获取临时登录的 code

后端需要能够校验 encryptedData, 依赖于 session_key。session_key 的获取，又依赖于 appid + secret + code。临时登录凭证 code 来自于小程序的 `wx.login()` 方法。

```js
Page({
  onGotUserInfo (e) {
    const { encryptedData, iv } = e.detail;
    const data = { encryptedData, iv };

    wx.login({
      timeout: 3000, // timeout 是超时时间，单位是 ms
      success: res => { // wx.login 接口调成功后会执行 success 回调
        // res.code 就是登录的凭证, 需要发送给服务端
        const code = res.code;
      }
    })
  }
})
```

### 3. 换取登录 JWT

把 code、encryptedData、iv 发送给服务端，换取 JWT，代码如下：

```js

Page({
  onGotUserInfo (e) {
    const { encryptedData, iv } = e.detail;

    wx.login({
      timeout: 3000,
      success: res => {
        const code = res.code;

        wx.request({
          url: `http://your-api-server/users/wxLogin`, // 我们的服务端地址
          method: 'POST',
          data: {
            code, encryptedData, iv
          },
          success: res => {
            // res.data 为服务端正确登录后签发的 JWT
            wx.setStorageSync('auth', res.data);
          }
        })
      }
    })
  }
})
```

前端的登录代码实现细节基本就这些。接下来开始实现服务端的接口和逻辑。

## hapi 服务端实现细节

关键步骤：

1. 使用 migrate 增加一张用户表，并且在 model 中对应创建 users 表结构定义。
2. 增加一个用户登录签发 JWT 的 API 接口路由 POST /users/wxLogin
3. 通过 https://api.weixin.qq.com/sns/jscode2session 换取 openid 和 session_key。
4. 通过 openid 决定是否创建新用户，并获取数据库表中对应的 uesrId。
5. 签发包含 uesrId 的 JWT。

### 1. users 表结构定义与迁移

users 表结构定义

字段    |字段类型     |字段说明
-------|----------|--------
id    | integer  | 用户的 ID，自增
nick_name | varchar(255) | 用户的昵称
avatar_url | varchar(255) | 用户头像
gender | integer | 用户的性别
open_id | varchar(255) | 用户 open_id
session_key | varchar(255) | 用户 session_key
created_at | datetime | 记录的创建时间
updated_at | datetime | 记录的更新时间

创建 users 表的迁移文件 create-users-table：

```bash
$ node_modules/.bin/sequelize migration:create --name create-users-table
```

```js
// migrations/create-users-table.js
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'users',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nick_name: Sequelize.STRING,
      avatar_url: Sequelize.STRING,
      gender: Sequelize.INTEGER,
      open_id: Sequelize.STRING,
      session_key: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    },
  ),

  down: queryInterface => queryInterface.dropTable('users'),
};

```

在 models 中定义 users 表结构:

```js
// models/users.js

module.exports = (sequelize, DataTypes) => sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nick_name: DataTypes.STRING,
    avatar_url: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    open_id: DataTypes.STRING,
    session_key: DataTypes.STRING,
  },
  {
    tableName: 'users',
  },
);

```

向数据库迁移 users 表:

```bash
$ node_modules/.bin/sequelize db:migrate
```

### 2. 创建 users 的路由，支持 wxLogin

- 创建接口 POST /users/wxLogin

- 接收 payload 参数 code, encryptedData, iv

- 设置此接口不需要通过用户验证 config.auth = false

```js
// routes/users

const GROUP_NAME = 'users';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/wxLogin`,
    handler: async (req, reply) => {
      reply();
    },
    config: {
      auth: false, // 不需要用户验证
      tags: ['api', GROUP_NAME], // 注册 swagger 文档
      validate: {
        payload: {
          code: Joi.string().required().description('微信用户登录的临时code'),
          encryptedData: Joi.string().required().description('微信用户信息encryptedData'),
          iv: Joi.string().required().description('微信用户信息iv'),
        },
      },
    },
  },
]

```

### 3. 换取 openid 和 session_key

利用微信开放接口 https://api.weixin.qq.com/sns/jscode2session 获取 openid 与 session_key。在 Node.js 服务端使用 axios 插件发送 HTTP 请求。并需要自行申请小程序的 AppID 与 AppSecret。可以用小程序账号登录微信公众平台，在设置 -> 开发设置 -> 开发者 ID 中可以找到 AppID 和 AppSecret。

注意: _AppID 与 AppSecret 的配置敏感信息，依旧通过 .evn 来配置管理，config/index.js 来中间勾取为宜。_

```bash
$ npm i axios
```

handler 中的微信 session 接口调用细节:

```js
// routes/users

// ... 省略上文
const axios = require('axios');

handler: async (req, reply) => {
  const appid = config.wxAppid; // 你的小程序 appid
  const secret = config.wxSecret; // 你的小程序 appsecret
  const { code, encryptedData, iv } = req.payload;

  const response = await axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    method: 'GET',
    params: {
      appid,
      secret,
      js_code: code,
      grant_type: 'authorization_code',
    }
  });
  // response 中返回 openid 与 session_key
  const { openid, session_key } = response.data;
  reply();
}
// ... 省略下文

```

### 4. 通过 openid 换取本地数据库的 user_id，签发 JWT

1） 通过 openid 查找 users 表中是否已有用户，没有则创建一个用户。

2） 封装一个 decryptData 方法，将 encryptedData 的信息，利用 iv，session_key，appid 进行校验与解码，最终获得合法的用户信息。

decryptData 的加解密数据算法官方文档，提供多语言示例下载，[点击此处链接](https://developers.weixin.qq.com/miniprogram/dev/api/signature.html#wxchecksessionobject)。

3） 将 decryptData 后的用户信息，更新回 users 表。

4） 签发包含 userId 的 JWT。

```js
// utils/decrypted-data.js

// 封装的 decryptData，用于解码小程序的 encryptData
const crypto = require('crypto');

const decryptData = (encryptedData, iv, sessionKey, appid) => {
  // base64 decode
  const encryptedDataNew = Buffer.from(encryptedData, 'base64');
  const sessionKeyNew = Buffer.from(sessionKey, 'base64');
  const ivNew = Buffer.from(iv, 'base64');

  let decoded = '';
  try {
    // 解密，使用的算法是 aes-128-cbc
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyNew, ivNew);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedDataNew, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);
    // decoded 是解密后的用户信息
  } catch (err) {
    throw new Error('Illegal Buffer');
  }

  // 解密后的用户数据中会有一个 watermark 属性，这个属性中包含这个小程序的 appid 和时间戳，下面是校验 appid
  if (decoded.watermark.appid !== appid) {
    throw new Error('Illegal Buffer');
  }

  // 返回解密后的用户数据
  return decoded;
};

module.exports = decryptData;

```

```js
// routes/users

// ... 忽略上文
const models = require("../models");
const GROUP_NAME = 'user';
const JWT = require('jsonwebtoken');
const decryptData = require('../utils/decrypt-data');

handler: async (req, reply) => {
  // ... 忽略通过微信接口获取 openid 与 session_key 的上文
  const { openid, session_key: sessionKey } = response.data;

  // 基于 openid 查找或创建一个用户
  const user = await models.users.findOrCreate({
    where: { open_id: openid },
  });

  // decrypt 解码用户信息
  const userInfo = decryptData(encryptedData, iv, sessionKey, appid);
  // 更新 user 表中的用户的资料信息
  await models.users.update({
    nick_name: userInfo.nickName,
    gender: userInfo.gender,
    avatar_url: userInfo.avatarUrl,
    open_id: openid,
    session_key: sessionKey,
  }, {
    where: { open_id: openid },
  });

  // 签发 jwt
  const generateJWT = (jwtInfo) => {
    const payload = {
      userId: jwtInfo.userId,
      exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
    };
    return JWT.sign(payload, config.jwtSecret);
  };
  reply(generateJWT({
    userId: user[0].id,
  }));
}
// ... 忽略下文
```

至此，用于小程序的用户登录验证的 JWT 签发逻辑已完成。

> **GitHub 参考代码** [chapter11/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter11/hapi-tutorial-1)


## 小结

关键词：小程序登录，数据库增量迁移

通过本小节的实战学习，相信同学们对微信小程序的用户授权登录与用户表如何无缝创建新用户有了一个具体的认识。

而与第三方的系统做接入整合，也常常伴随着大量的对接规范要小心翼翼地遵循，比如小程序的登录接入。这方面的首次接触没有捷径，可以考虑自行抽象封装一个小程序授权登录的组件，来降低日后新系统接入时的复杂度。

思考：如果系统试图加入 QQ 第三方授权登录，要怎样来实现？与小程序授权登录是否相似？

**本小节参考代码汇总**

[chapter11/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter11/hapi-tutorial-1)