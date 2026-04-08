你可能经常听到 Nest，会觉得它和我的工作也没啥关系呀，为什么要学习 Nest 呢？

这里给出 5 个学习 Nest 的理由：

## 最流行的 Node 企业级框架

开发 node 应用有 3 个层次：

*   直接用 http、https 包的 createServer api
*   使用 express、koa 这种处理请求响应的库
*   使用 nest、egg、midway 这类企业级框架

直接用 createServer api 创建服务适合特别简单的场景，比如工具提供的开发服务。

express、koa 这种处理请求响应的库并不能约束代码的写法，代码可以写的很随意，所以不适合开发大型项目。

大型项目会用企业级开发框架，也就是规定了代码的写法，对很多功能都有开箱即用的解决方案的框架。

比如 Nest 代码一般都是分了很多模块：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/549bc636a9a84b56bfde197d088f7ded~tplv-k3u1fbpfcp-watermark.image?)

每个模块下都是 controller、service、guard、filter、interceptor、dto 等这些代码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a6e576d76aa4a0583ad40a183b6229c~tplv-k3u1fbpfcp-watermark.image?)

什么代码放在哪里都是有规范的。

上面这个目录是一个 8.7k 的已经盈利的项目的服务端代码，感兴趣可以看一下：

<https://github.com/apitable/apitable/tree/35b05eb421d31a4e4b68ca0bacb1fb484186f4ea/packages/room-server>

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c03ce098c634b8781fc03d5c68c6949~tplv-k3u1fbpfcp-watermark.image?)

那 egg 和 midway 呢？

egg 的 ts 支持不行，在当下 ts 这么主流的情况下，已经不合适了。更何况它是阿里的项目，而阿里 egg 团队也被打包裁了。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45ed098f827f4b348d434305d04e9f7d~tplv-k3u1fbpfcp-watermark.image?)

midway 呢？

star 数差太多了，和 nest 不在一个量级。

而且你能保证它不是下一个 egg 么？

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9f81b4885744c6f98ba9bc03e851583~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38212a2f2e0445b090868b6794c29522~tplv-k3u1fbpfcp-watermark.image?)

Nest 是在全世界都很火，在国内也越来越流行，找不到啥对手。

如果你想学习 Node 框架，那 Nest 基本是唯一的选择了。

## 学习各种后端中间件

后端有很多中间件，比如 mysql、redis、rabbitmq、nacos、elasticsearch 等等，学习 Nest 的过程会用到这些中间件。

比如类似这种的后端架构：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38a8aa18ae1a40e1ab83767b2558d84f~tplv-k3u1fbpfcp-watermark.image?)

所以我们学的并不只是 Nest，而是整个后端生态。

这些东西就算换了 go 或者 java，也是一样要学的。

## 可以找国外的全栈工作，或者接远程外包

国外远程工作这块，电鸭社区是最有发言权的。

你逛一逛就会发现，很多创业公司都会用 Nest 做服务端：

比如这个：

<https://eleduck.com/posts/oQfOD7>


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/003b04cad510485e8c9728e0d65b89c2~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88e83771b51d49da901e9ba4856f846a~tplv-k3u1fbpfcp-watermark.image?)

这个：

<https://eleduck.com/tposts/Baf0Dy>

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/776effcee7ba4ccab9ad4d9fb9f019b0~tplv-k3u1fbpfcp-watermark.image?)

或者这个：

<https://eleduck.com/posts/njfbzD>

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8af15eea44a345138f436fe5c9302be9~tplv-k3u1fbpfcp-watermark.image?)

还有这个：

<https://eleduck.com/posts/XNfBXN>

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fbdb09abe634dbfabf069040efbca6b~tplv-k3u1fbpfcp-watermark.image?)

如果你会 React + Nest 技术栈，找个远程全栈工作不也很香么。

## 可以独立做自己的产品

如果你想做一个自己的产品，不管是网站、app、小程序还是游戏等应用，都得配上后端吧，如果你熟悉 js/ts，那 Nest 是最适合的选择了。

比如刚才我们看到这个国外的这个盈利的产品，它就是用 Nest 做的后端：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dad2ada4c884466b5604f4d5cdc8560~tplv-k3u1fbpfcp-watermark.image?)

或者你是大学生，想做一个写在简历里的前端项目，那只写前端就可以了么？

肯定不行呀，你得前后端都搞定，在简历上写一个完整的项目，这时候 Nest 就很合适了。因为如果你是想做前端工作，那用 java 并不咋加分。

## 学习优秀的架构设计

Nest 的架构很优雅，因为它用了不少设计模式。

比如 Nest 并不和 Express 耦合，你可以轻松切换到 Fastify。

就是因为它用了适配器的设计模式：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20b41feed8d54e8bb264e508cd55c9c3~tplv-k3u1fbpfcp-watermark.image?)

Nest 本身只依赖 HttpServer 接口，并不和具体的库耦合。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/237d45ff113a4fe1b7386d3dc7847355~tplv-k3u1fbpfcp-watermark.image?)

你想换别的 http 处理的库，只要写一个新的适配器就好了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baeb2549d43c4ab79b65d8f3d717abd1~tplv-k3u1fbpfcp-watermark.image?)

再比如 Nest 内构建复杂对象很多地方都用到了 builder 的设计模式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f6ccae877dc4078b115317f3c8d8c13~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/738ce1e89cdc438cbe6092b3d3aabe40~tplv-k3u1fbpfcp-watermark.image?)

类似这样的设计有很多。

当你把 Nest用熟之后，潜移默化中，你就知道了什么地方用什么模式是最好的，应该怎么设计。无形中就提升了架构设计能力。

## 总结

不管是你想学 Node 框架，学习各种后端中间件，找国外的远程工作或远程外包，独立开发自己的产品，还是想学习优秀的设计，提升架构能力。Nest 都是一个非常好的选择。

心动了么？赶紧上车。
