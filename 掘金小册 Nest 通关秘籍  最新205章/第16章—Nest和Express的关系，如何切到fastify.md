### 本资源由 itjc8.com 收集整理
﻿前面我们用的 Nest 的 request、response 对象都是 Express 的，而且 Nest 也支持 Express 的中间件机制。

那 Nest 和 Express 是什么关系呢？

Express 是一个处理请求、响应的库，它是这样用的：

```javascript
const express = require('express')
const cookieParser = require('cookie-parser')
const cookieValidator = require('./cookieValidator')

const app = express()

async function validateCookies (req, res, next) {
  await cookieValidator(req.cookies)
  next()
}

app.use(cookieParser())

app.use(validateCookies)

app.use((err, req, res, next) => {
  res.status(400).send(err.message)
})

app.listen(3000)
```

通过 use 一个个中间件来处理请求、返回响应。

这种调用链叫做洋葱模型：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-1.png)

基于中间件能完成各种功能。

但是 Express 只是一个处理请求的库，并没有提供组织代码的架构能力，代码可能写成各种样子。

所以企业级开发，我们会用对它封装了一层的库，比如 Nest。

Nest 提供了 IOC、AOP 等架构特性，规定了代码组织的形式，而且对 websocket、graphql、orm 等各种方案都提供了开箱即用的支持。

也就是说，用 Node 写一个 http 服务有三个层次：

*   直接使用 http、https 的模块
*   使用 express、koa 这种库
*   使用 Nest 这种企业级框架

就像写 java 你还会直接处理 http 请求并手动集成各种方案么？

不会，会直接用 Spring 这种一站式企业级开发框架。

同样的道理， Nest 就是 node 生态里的 Spring。

但是 Nest 也没有和 Express 强耦合，它做了一层抽象：

定义了 [HttpServer 的 interface](https://github.com/nestjs/nest/blob/d352e6f138bc70ff33cccf830053946d17272b82/packages/common/interfaces/http/http-server.interface.ts#L21C1-L85)：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-2.png)

然后封装了 [AbstractHttpAdapter 的 abstract class](https://github.com/nestjs/nest/blob/d352e6f138bc70ff33cccf830053946d17272b82/packages/core/adapters/http-adapter.ts#L12C1-L131)：

之后分别提供了 express 和 fastify 的实现：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-3.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-4.png)

Adapter 是适配器的意思，也就是说 Nest 内部并没有直接依赖任何一个 http 处理的库，只是依赖了抽象的接口，想用什么库需要实现这些接口的适配器。

你可以用 express，也可以灵活的切换成 fastify，对 Nest 没有任何影响。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-5.png)

这俩适配器分别在 @nestjs/platform-express 和 @nestjs/platform-fastify 的包里：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-6.png)

默认用的是 platform-express 的包：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-7.png)

下面我们切换到 fastify 试试看：

    nest new fastify-test -p npm

同样，先用 @nestjs/cli 创建个 nest 项目

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-8.png)

然后把它跑起来：

    nest start --watch

浏览器访问 <http://localhost:3000> 看到 hello world 就是服务跑成功了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-9.png)

现在用的是默认的 express，我们切换到 fastify 试试看：

安装 fastify 和 @nestjs/platform-fastify：

    npm install fastify @nestjs/platform-fastify

然后修改下 Nest 创建的方式：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-10.png)

改成这样：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-11.png)

这个 FastifyAdapter 前面讲过，传入这个 adapter 之后，就切换到了 fastify 平台。

这里你还可以再传一个类型参数：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-12.png)

这样返回的 app 就会提示 fastify 平台特有的方法了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-13.png)

这也是为什么之前我们要传入 NestExpressApplication 才有 useStaticAssets 方法：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-14.png)

然后在 controller 里可以注入 fastify 的 reqeust 和 reply 对象：

```javascript
import { Controller, Get, Request, Response } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Request() request: FastifyRequest, @Response() reply: FastifyReply) {
    reply.header('url', request.url)
    reply.send('hello')
  }
}
```

我们注入了 fastify 的 request 和 reply 对象，然后用它来设置 header 发送响应：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-15.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-16.png)

这里要注意的是一旦用 @Response 注入了响应对象，就不能通过 return 的方式来返回响应内容了，需要手动调用 res.send。

这点用 express 时也是一样。

很容易理解，因为你可能在方法里用 resposne 对象发送数据了，那如果 Nest 再把返回值作为响应内容，不就冲突了么？

当然，你也可以这样做：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-17.png)

传个 passthrough 参数，代表不会在方法里自己发送响应内容。

这样返回值就生效了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第16章-18.png)

最后，我们来思考下为什么 Nest 要做能够轻松切换 http 处理库呢？

因为 Nest 的核心还是在于 IOC、AOP 这些架构特性，像 express、fastify 只不过是请求、响应的方法不同而已，区别并不大。

如果强依赖于 express，万一有更好的 http 处理库怎么办？

这种加一层抽象和适配器的方式，能让 Nest 更加通用、灵活，有更强的扩展性。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/fastify-test)。

## 总结

express 是基于中间件的洋葱模型处理请求、响应的库，它并没有提供组织代码的架构特性，代码可以写的很随意。

而为了更好的可维护性，我们都会用 Nest 这种一站式企业级开发框架。就像 java 里会用 Spring 框架一样。

Nest 底层是 express 但也不完全是，它内部实现是基于 interface 的，而且提供了 @nestjs/platform-express、@nestjs/platform-fastify 这两个 adapter 包。

这样就可以轻松的切换 express、fastify 或者其他的 http 请求处理的库。

这就是适配器模式的魅力。
