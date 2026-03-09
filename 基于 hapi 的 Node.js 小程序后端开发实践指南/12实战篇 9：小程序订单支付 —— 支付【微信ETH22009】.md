# 实战篇 9：小程序订单支付 —— 小程序支付

创建完订单，这一节，我们来实现小程序的支付功能，以完成一个商业应用的业务经营能力闭环。

微信小程序的主要交互图如下：

![](https://user-gold-cdn.xitu.io/2018/8/30/16586e676781031e?w=686&h=572&f=jpeg&s=51527)

要想实现支付的系统逻辑，最主要的是完成接下来的 4 个步骤：

### 1.小程序内调用登录接口

小程序内调用登录接口，获取到用户的 openid，API 参见 [小程序登录 API ](https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html?t=20161122)。

在面向小程序的 JWT 登录用户验证章节中，我们已经掌握了如何获取用户 openid 的调用流程与方法。

### 2. 商户 server 调用支付统一下单

获取了用户的 openid 后，需要在商户的 server 调用微信的支付统一下单，以创建一条待支付的记录返回给小程序，以完成小程序客户端的支付能力唤起，进入到后续步骤。商户 server 调用支付统一下单，API 参见 [统一下单 API ](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1&index=1)。

看过接口文档，我们发现微信接收的数据与返回的格式都是以 text/xml 的格式，而非 application/json ，所以，我们需要引入 xml2js 的插件帮助我们在 JavaScript 的 Ojbect 与 XML 的 Object 数据关系之间快速转换。

```bash
$ npm i xml2js
```


```js
// routers/order.js

{
  method: 'POST',
  path: `/${GROUP_NAME}/{orderId}/pay`,
  handler: async (request, reply) => {
    // 从用户表中获取 openid
    const user = await models.users.findOne({ where: { id: request.auth.credentials.userId } });
      const { openid } = user;
    // 构造 unifiedorder 所需入参
    const unifiedorderObj = {
      appid: config.wxAppid, // 小程序 id
      body: '小程序支付', // 商品简单描述
      mch_id: config.wxMchid, // 商户号
      nonce_str: Math.random().toString(36).substr(2, 15), // 随机字符串
      notify_url: 'https://yourhost.com/orders/pay/notify', // 支付成功的回调地址
      openid, // 用户 openid
      out_trade_no: request.params.orderId, // 商户订单号
      spbill_create_ip: request.info.remoteAddress, // 调用支付接口的用户 ip
      total_fee: 1, // 总金额，单位为分
      trade_type: 'JSAPI', // 交易类型，默认
    };
    // 签名的数据
    const getSignData = (rawData, apiKey) => {
      let keys = Object.keys(rawData);
      keys = keys.sort();
      let string = '';
      keys.forEach((key) => {
        string += `&${key}=${rawData[key]}`;
      });
      string = string.substr(1);
      return crypto.createHash('md5').update(`${string}&key=${apiKey}`).digest('hex').toUpperCase();
    };
    // 将基础数据信息 sign 签名
    const sign = getSignData(unifiedorderObj, config.wxPayApiKey);
    // 需要被 post 的数据源
    const unifiedorderWithSign = {
      ...unifiedorderObj,
      sign,
    };
    // 将需要 post 出去的订单参数，转换位 xml 格式
    const builder = new xml2js.Builder({ rootName: 'xml', headless: true });
    const unifiedorderXML = builder.buildObject(unifiedorderWithSign);
    const result = await axios({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      method: 'POST',
      data: unifiedorderXML,
      headers: { 'content-type': 'text/xml' },
    });
    // result 是一个 xml 结构的 response，转换为 jsonObject，并返回前端
    xml2js.parseString(result.data, (err, parsedResult) => {
      if (parsedResult.xml) {
        if (parsedResult.xml.return_code[0] === 'SUCCESS'
        && parsedResult.xml.result_code[0] === 'SUCCESS') {
          // 待签名的原始支付数据
          const replyData = {
            appId: parsedResult.xml.appid[0],
            timeStamp: (Date.now() / 1000).toString(),
            nonceStr: parsedResult.xml.nonce_str[0],
            package: `prepay_id=${parsedResult.xml.prepay_id[0]}`,
            signType: 'MD5',
          };
          replyData.paySign = getSignData(replyData, config.wxPayApiKey);
          reply(replyData);
        }
      }
    });
  },
  config: {
    tags: ['api', GROUP_NAME],
    description: '支付某条订单',
    validate: {
      params: {
        orderId: Joi.string().required(),
      },
      ...jwtHeaderDefine,
    },
  },
},


```

### 3. 商户 server 调用再次签名

商户 server 调用再次签名，公共 API 参见 [再次签名 API](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3)。

此步骤由微信小程序前端客户端实现，将步骤 2 中，/orders/{orderId}/pay
接口返回的支付统一下单签名数据，依次填入 wx.requestPayment，即可在小程序的客户端唤起支付界面，并完成后续的支付操作流程。用户支付成功后，微信平台会自动触发步骤 4 中的支付成功推送。

``` js
wx.requestPayment(
{
  'timeStamp': '',
  'nonceStr': '',
  'package': '',
  'signType': 'MD5',
  'paySign': '',
  'success':function(res){},
  'fail':function(res){},
  'complete':function(res){}
})
```

### 4. 商户 server 接收支付通知

用户完成支付行为后，商户 server 接收支付通知，API 参见 [支付结果通知 API ](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_7)  。

微信对商户后台通知交互时，如果微信收到商户的应答不是成功或超时，微信认为通知失败，微信会通过一定的策略定期重新发起通知，尽可能提高通知的成功率，但不保证通知最终能成功。（通知频率为 15/15/30/180/1800/1800/1800/1800/3600，单位：秒。）

商户应答成功的返回数据结构是：

```xml
<xml>
  <return_code><![CDATA[SUCCESS]]></return_code>
  <return_msg><![CDATA[OK]]></return_msg>
</xml>
```

实现接口 POST /orders/pay/notify，在核对订单信息校验成功后，需要返回微信上述的 XML 字符串信息，否则返回 return_code 为 `FAIL`，并在 return_msg 中附带参数校验错误说明。/orders/pay/notify 在 hapi 的 API 接口中 config.auth 应该设置为 `false`，不进入 JWT 的用户认证流程。

```js

{
  method: 'POST',
  path: `/${GROUP_NAME}/pay/notify`,
  handler: async (request, reply) => {
    xml2js.parseString(request.payload, async (err, parsedResult) => {
      if (parsedResult.xml.return_code[0] === 'SUCCESS') {
        // 微信统一支付状态成功，需要检验本地数据的逻辑一致性
        // 省略...细节逻辑校验
        // 更新该订单编号下的支付状态未已支付
        const orderId = parsedResult.xml.out_trade_no[0];
        const orderResult = await models.orders.findOne({ where: { id: orderId } });
        orderResult.payment_status = '1';
        await orderResult.save();
        // 返回微信，校验成功
        const retVal = {
          return_code: 'SUCCESS',
          return_msg: 'OK',
        };
        const builder = new xml2js.Builder({
          rootName: 'xml',
          headless: true,
        });
        reply(builder.buildObject(retVal));
      }
    });
  },
  config: {
    tags: ['api', GROUP_NAME],
    description: '微信支付成功的消息推送',
    auth: false,
  },
},


```

> **GitHub 参考代码** [chapter13/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter13/hapi-tutorial-1)


## 小结

关键词：微信支付，支付统一下单，支付通知，XML 数据通信

本小节围绕微信支付接入的四步骤，做了接入流程上的讲解。开发过程中尤其注意支付接入以 XML 格式数据进行数据交换，签名数据的算法一致性。剩下的对照着文档，小心翼翼地处理好字段的对应，便能顺利把流程走完。

**本小节参考代码汇总**

小程序内调用登录接口：[小程序登录 API ](https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html?t=20161122)

商户 server 调用支付统一下单：[统一下单 API ](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1&index=1)

商户 server 调用再次签名：[再次签名 API](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3)

商户 server 接收支付通知：[支付结果通知 API ](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_7) 

GitHub参考代码：[chapter13/hapi-tutorial-1](https://github.com/yeshengfei/hapi-tutorial/tree/master/chapter13/hapi-tutorial-1)
