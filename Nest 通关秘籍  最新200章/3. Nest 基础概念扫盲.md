Nest 是对标 Java 的 Spring 框架的后端框架，它有很多概念。

对于新手来说，上来就接触这些概念可能会有点懵。

这节我们集中来过一下（这节不用实践，理解概念就好）：

我们通过不同的 url 来访问后端接口：

/user/create

/user/list

/book/create

/book/list

不同的 url 是不同的路由。

这些路由在 Controller 里声明：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f017e924c90f46228618d0e20a0effca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=996&s=234625&e=png&b=1f1f1f)

比如这里就是声明了一个 /user/create 的 post 接口，声明了一个 /user/list 的 get 接口。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a19d46cc04f8400da242cdf3256b87c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1908&h=1002&s=260008&e=png&b=1f1f1f)

在 class 上和它方法的方法上加上 @Controller、@Get、@Post 的装饰器就可以了。

controller 的方法叫做 handler，是处理路由的。

post 的请求体，get 的请求参数，都可以通过装饰来取：

通过 @Param 取 url 中的参数，比如 /user/111 里的 111

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b135637ad744d50bf22f33dd50d30cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=328&s=61251&e=png&b=1f1f1f)

通过 @Query 来取 url 中的 query 参数，比如 /user/xx?id=222 里的 222

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa74c86359d94222ab8c248c971fc288~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=332&s=44167&e=png&b=1f1f1f)

通过 @Body 取 /book/create 的请求体内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/447dc9f84f8a4db997faa3868ecef453~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1432&h=448&s=110992&e=png&b=1f1f1f)

请求体一般会传递 json，比如 { username: 'xxx', password: 'xxx' }

我们会通过 dto （data transfer object）来接收。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c5a32fca1704b23b62698a3028b73ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=788&h=334&s=18760&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85979884288645f9898308426386fe76~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360&h=444&s=108443&e=png&b=1f1f1f)

传递到 handler 的就已经是 dto 对象了。

也就是说 **controller 是处理路由和解析请求参数的**。

请求参数解析出来了，下一步就是做业务逻辑的处理了，这些东西不写在 controller 里，而是放在 service 里。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b35a78cd866b4c35b7b79f0fca94df6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1440&h=1044&s=210941&e=png&b=1f1f1f)

**service 里做业务逻辑的具体实现，比如操作数据库等**

同理，/book/list、/book/create 接口是在另一个 BookController 里：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db862e0f317c4a70a89bda549098b8f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=998&s=234827&e=png&b=1f1f1f)

它的业务逻辑实现也是在 BookService 里。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12935352b0994182a3a9fca24313d5ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1332&h=716&s=144935&e=png&b=1f1f1f)

很明显，UserController 和 UserService 是一块的，BookController 和 BookService 是一块的。

所以，Nest 有了模块的划分，每个模块里都包含 controller 和 service：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15c61e2baffb4d90a4b7c59f860fd8d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=550&s=114898&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee1cbe645f824e58b2fda383655c1ed3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234&h=524&s=115565&e=png&b=1f1f1f)

通过 @Module 声明模块，它包含 controllers 和 providers。

为啥不是 services 而是 providers 呢？

因为 Nest 实现了一套依赖注入机制，叫做 IoC（Inverse of Control 反转控制）。

简单说就是你只需要声明依赖了啥就行，不需要手动去 new 依赖，Nest 的 IoC 容器会自动给你创建并注入依赖。

比如这个 UserController 依赖了 JwtService，那只需要通过 @Inject 声明依赖，然后就可以在方法里用了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a1bb8c36f574fbeb7fcbf3982269b8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1296&h=940&s=222494&e=png&b=1f1f1f)

运行的时候会自动查找这个 JwtServcie 的实例来注入。

在 @Module 里的 providers 数组里，就是声明要往 IoC 容器里提供的对象，所以这里叫做 providers。

provider 有很多种写法：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96ecdb95bb2c4c49a2c4ee6085370bd9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234&h=578&s=118565&e=png&b=1f1f1f)

默认的 XxxService 只是一种简化的写法。

还可以直接 useValue 创建，通过 useFactory 创建等。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e617a1d5c062479f806f1b8489fa3a74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=1116&s=133669&e=png&b=1f1f1f)

刚才提到了 IoC 会自动从容器中查找实例来注入，注入的方式有两种：

属性注入和构造器注入。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4f2f3a24e07430787a4478ccca89704~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1264&h=890&s=214682&e=png&b=1f1f1f)

这种写在构造器里的依赖，就是构造器注入。

@Inject 写在属性上的依赖，就是属性注入。

效果是一样的，只是注入的时机不同。

每个模块都会包含 controller、service、module、dto、entities 这些东西：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23e5423fbe7a4aa0a97f0313d9427c53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=692&h=1078&s=104465&e=png&b=181818)

controller 是处理路由，解析请求参数的。

service 是处理业务逻辑的，比如操作数据库。

dto 是封装请求参数的。

entities 是封装对应数据库表的实体的。

nest 应用跑起来后，会从 AppModule 开始解析，初始化 IoC 容器，加载所有的 service 到容器里，然后解析 controller 里的路由，接下来就可以接收请求了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/580375b654ac445cb2cd07784824104c~tplv-k3u1fbpfcp-watermark.image?)

其实这种架构叫做 MVC 模式，也就是 model、view、controller。

controller 接收请求参数，交给 model 处理（model 就是处理 service 业务逻辑，处理 repository 数据库访问），然后返回 view，也就是响应。

应用中会有很多 controller、service，那如果是跨多个 controller 的逻辑呢？

这种在 Nest 提供了 AOP （Aspect Oriented Programming 面向切面编程）的机制

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f99087120e847eab901738bf8504d21~tplv-k3u1fbpfcp-watermark.image?)

具体来说，有 Middleware、Guard、Interceptor、Pipe、Exception Filter 这五种。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4d0291cafa9449ca4702617464c5979~tplv-k3u1fbpfcp-watermark.image?)

它们都是在目标 controller 的 handler 前后，额外加一段逻辑的。

比如你可以通过 interceptor 实现请求到响应的时间的记录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/350ebe2f02564227b512515d58f07afc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1642&h=846&s=169284&e=png&b=1f1f1f)

这种逻辑适合放在 controller 里么？

不适合，这种通用逻辑应该通过 interceptor 等方式抽离出来，然后需要用的时候在 controller 上声明一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aad3cc76e57246f9811b06d9865314d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=736&h=314&s=46709&e=png&b=1f1f1f)

这些就是 Nest 的核心概念了。

此外，创建 Nest 项目自然也是有 cli 工具的。

比如创建新项目：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/677ccb932ce7414da894304ea6721c9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=714&s=376925&e=png&b=fefefe)

创建项目里的某个新模块：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d6ae8d4bbed48209d50467c5eb0afea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=508&s=138743&e=png&b=191919)

都可以通过 @nestjs/cli 来做。

所以我们后面的学习顺序是先学会 cli 的使用，然后学习 Nest 的核心概念，之后学下涉及到的数据库、orm 框架等，最后来做项目实战。

## 总结

这节我们讲了很多 Nest 里的概念。

比如 controller、handler、service、dto、module、entity、ioc、aop、nest cli 等。

**controller**：控制器，用于处理路由，解析请求参数

**handler**：控制器里处理路由的方法

**service**：实现业务逻辑的地方，比如操作数据库等

**dto**：data transfer object，数据传输对象，用于封装请求体里数据的对象

**module**：模块，包含 controller、service 等，比如用户模块、书籍模块

**entity**：对应数据库表的实体

**ioc**：Inverse of Controller，反转控制或者叫依赖注入，只要声明依赖，运行时 Nest 会自动注入依赖的实例

**aop**：Aspect Oriented Programming 面向切面编程，在多个请求响应流程中可以复用的逻辑，比如日志记录等，具体包含 middleware、interceotor、guard、exception filter、pipe

**nest cli**：创建项目、创建模块、创建 controller、创建 service 等都可以用这个 cli 工具来做

现在只要能大概理解概念就行，后面我们会深入学习这些。
