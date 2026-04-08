### 本资源由 itjc8.com 收集整理
﻿Nest 的功能都是大多通过装饰器来使用的，这节我们就把所有的装饰器过一遍。

我们创建个新的 nest 项目：

    nest new all-decorator -p npm

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-1.png)

Nest 提供了一套模块系统，通过 @Module声明模块：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-2.png)

通过 @Controller、@Injectable 分别声明其中的 controller 和 provider：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-3.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-4.png)

这个 provider 可以是任何的 class：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-5.png)

注入的方式可以是构造器注入：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-6.png)

或者属性注入：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-7.png)

属性注入要指定注入的 token，可能是 class 也可能是 string。

你可以通过 useFactory、useValue 等方式声明 provider：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-8.png)

这时候也需要通过 @Inject 指定注入的 token：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-9.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-10.png)

这些注入的依赖如果没有的话，创建对象时会报错。但如果它是可选的，你可以用 @Optional 声明一下，这样没有对应的 provider 也能正常创建这个对象。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-11.png)

如果模块被很多地方都引用，为了方便，可以用 @Global 把它声明为全局的，这样它 exports 的 provider 就可以直接注入了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-12.png)

filter 是处理抛出的未捕获异常的，通过 @Catch 来指定处理的异常：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-13.png)

然后通过 @UseFilters 应用到 handler 上：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-14.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-15.png)

除了 filter 之外，interceptor、guard、pipe 也是这样用：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-16.png)

当然，pipe 更多还是单独在某个参数的位置应用：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-17.png)

这里的 @Query 是取 url 后的 ?bbb=true，而 @Param 是取路径中的参数，比如 /xxx/111 种的 111

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-18.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-19.png)

此外，如果是 @Post 请求，可以通过 @Body 取到 body 部分：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-20.png)

我们一般用 dto 的 class 来接受请求体里的参数：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-21.png)

nest 会实例化一个 dto 对象：

用 postman 发个 post 请求：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-22.png)

可以看到 nest 接受到了 body 里的参数：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-23.png)

除了 @Get、@Post 外，还可以用 @Put、@Delete、@Patch、@Options、@Head 装饰器分别接受 put、delete、patch、options、head 请求：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-24.png)

handler 和 class 可以通过 @SetMetadata 指定 metadata：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-25.png)

然后在 guard 或者 interceptor 里取出来：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-26.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-27.png)

你可以通过 @Headers 装饰器取某个请求头 或者全部请求头：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-28.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-29.png)

通过 @Ip 拿到请求的 ip：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-30.png)

通过 @Session 拿到 session 对象：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-31.png)

但要使用 session 需要安装一个 express 中间件：

    npm install express-session

在 main.ts 里引入并启用：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-32.png)

指定加密的密钥和 cookie 的存活时间。

然后刷新页面：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-33.png)

会返回 set-cookie 的响应头，设置了 cookie，包含 sid 也就是 sesssionid。

之后每次请求都会自动带上这个 cookie：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-34.png)

这样就可以在 session 对象里存储信息了。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-35.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-36.png)

@HostParam 用于取域名部分的参数：

我们再创建个 controller：

    nest g controller aaa --no-spec --flat

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-37.png)

这样指定 controller 的生效路径：

```javascript
import { Controller, Get, HostParam } from '@nestjs/common';

@Controller({ host: ':host.0.0.1', path: 'aaa' })
export class AaaController {
    @Get('bbb')
    hello() {
        return 'hello';
    }
}
```

controller 除了可以指定某些 path 生效外，还可以指定 host：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-38.png)

然后再访问下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-39.png)

这时候你会发现只有 host 满足 xx.0.0.1 的时候才会路由到这个 controller。

host 里的参数就可以通过 @HostParam 取出来：

```javascript
import { Controller, Get, HostParam } from '@nestjs/common';

@Controller({ host: ':host.0.0.1', path: 'aaa' })
export class AaaController {
    @Get('bbb')
    hello(@HostParam('host') host) {
        return host;
    }
}
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-40.png)

前面取的这些都是 request 里的属性，当然也可以直接注入 request 对象：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-41.png)

通过 @Req 或者 @Request 装饰器，这俩是同一个东西：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-42.png)

注入 request 对象后，可以手动取任何参数：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-43.png)

当然，也可以 @Res 或者 @Response 注入 response 对象，只不过 response 对象有点特殊：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-44.png)

当你注入 response 对象之后，服务器会一直没有响应：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-45.png)

因为这时候 Nest 就不会再把 handler 返回值作为响应内容了。

你可以自己返回响应：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-46.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-47.png)

Nest 这么设计是为了避免你自己返回的响应和 Nest 返回的响应的冲突。

如果你不会自己返回响应，可以通过 passthrough 参数告诉 Nest：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-48.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-49.png)

除了注入 @Res 不会返回响应外，注入 @Next 也不会：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-50.png)

当你有两个 handler 来处理同一个路由的时候，可以在第一个 handler 里注入 next，调用它来把请求转发到第二个 handler：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-51.png)

Nest 不会处理注入 @Next 的 handler 的返回值。

handler 默认返回的是 200 的状态码，你可以通过 @HttpCode 修改它：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-52.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-53.png)

当然，你也可以修改 response header，通过 @Header 装饰器：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-54.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-55.png)

此外，你还可以通过 @Redirect 装饰器来指定路由重定向的 url：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-56.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-57.png)

或者在返回值的地方设置 url：

```javascript
@Get('xxx')
@Redirect()
async jump() {
    return {
      url: 'https://www.baidu.com',
      statusCode: 302
    }  
}
```

你还可以给返回的响应内容指定渲染引擎，不过这需要先这样设置：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-58.png)

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();

```

分别指定静态资源的路径和模版的路径，并指定模版引擎为 handlerbars。

当然，还需要安装模版引擎的包 hbs：

    npm install --save hbs

然后准备图片和模版文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-59.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-60.png)

在 handler 里指定模版和数据：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-61.png)

就可以看到渲染出的 html 了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第10章-62.png)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/all-decorator)。

## 总结

这节我们梳理了下 Nest 全部的装饰器

*   @Module： 声明 Nest 模块
*   @Controller：声明模块里的 controller
*   @Injectable：声明模块里可以注入的 provider
*   @Inject：通过 token 手动指定注入的 provider，token 可以是 class 或者 string
*   @Optional：声明注入的 provider 是可选的，可以为空
*   @Global：声明全局模块
*   @Catch：声明 exception filter 处理的 exception 类型
*   @UseFilters：路由级别使用 exception filter
*   @UsePipes：路由级别使用 pipe
*   @UseInterceptors：路由级别使用 interceptor
*   @SetMetadata：在 class 或者 handler 上添加 metadata
*   @Get、@Post、@Put、@Delete、@Patch、@Options、@Head：声明 get、post、put、delete、patch、options、head 的请求方式
*   @Param：取出 url 中的参数，比如 /aaa/:id 中的 id
*   @Query: 取出 query 部分的参数，比如 /aaa?name=xx 中的 name
*   @Body：取出请求 body，通过 dto class 来接收
*   @Headers：取出某个或全部请求头
*   @Session：取出 session 对象，需要启用 express-session 中间件
*   @HostParm： 取出 host 里的参数
*   @Req、@Request：注入 request 对象
*   @Res、@Response：注入 response 对象，一旦注入了这个 Nest 就不会把返回值作为响应了，除非指定 passthrough 为true
*   @Next：注入调用下一个 handler 的 next 方法
*   @HttpCode： 修改响应的状态码
*   @Header：修改响应头
*   @Redirect：指定重定向的 url
*   @Render：指定渲染用的模版引擎

把这些装饰器用熟，就掌握了 nest 大部分功能了。
