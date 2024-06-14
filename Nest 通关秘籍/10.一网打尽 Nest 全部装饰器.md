Nest 的功能都是大多通过装饰器来使用的，这节我们就把所有的装饰器过一遍。

我们创建个新的 nest 项目：

    nest new all-decorator -p npm

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1824b5769a7c4cd4a1862918af0dffe8~tplv-k3u1fbpfcp-watermark.image?)

Nest 提供了一套模块系统，通过 @Module声明模块：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/350bf6ae1f1d425aba1e30a2112c75f4~tplv-k3u1fbpfcp-watermark.image?)

通过 @Controller、@Injectable 分别声明其中的 controller 和 provider：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/835bb7e52eb24497bec4a6c97a682307~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63c2e0a4e2e04d638fd510e658429265~tplv-k3u1fbpfcp-watermark.image?)

这个 provider 可以是任何的 class：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a32aed0be559462d8734925deebc8e1f~tplv-k3u1fbpfcp-watermark.image?)

注入的方式可以是构造器注入：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97763942ca1843eab617d82a2b6ee164~tplv-k3u1fbpfcp-watermark.image?)

或者属性注入：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b66d2ff31184e689a22bef888eb4b77~tplv-k3u1fbpfcp-watermark.image?)

属性注入要指定注入的 token，可能是 class 也可能是 string。

你可以通过 useFactory、useValue 等方式声明 provider：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/035c9f0ee8e540aaa5e1ceadb1ce9aa2~tplv-k3u1fbpfcp-watermark.image?)

这时候也需要通过 @Inject 指定注入的 token：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16e14a5849b64701b3f74162046c6f38~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97c08058adb944cabe6367d070c01546~tplv-k3u1fbpfcp-watermark.image?)

这些注入的依赖如果没有的话，创建对象时会报错。但如果它是可选的，你可以用 @Optional 声明一下，这样没有对应的 provider 也能正常创建这个对象。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9742d2a930b47018c07a627b57cfdb3~tplv-k3u1fbpfcp-watermark.image?)

如果模块被很多地方都引用，为了方便，可以用 @Global 把它声明为全局的，这样它 exports 的 provider 就可以直接注入了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16ce92233e484b4e974c9af63f24a8bc~tplv-k3u1fbpfcp-watermark.image?)

filter 是处理抛出的未捕获异常的，通过 @Catch 来指定处理的异常：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cd95a5fb6b44d17869c3ae45fda9467~tplv-k3u1fbpfcp-watermark.image?)

然后通过 @UseFilters 应用到 handler 上：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f824522eee2d4c9f96b38b1784879280~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73b48391b96245438e60872b913d5108~tplv-k3u1fbpfcp-watermark.image?)

除了 filter 之外，interceptor、guard、pipe 也是这样用：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54b937a0d54a40a19b81624eb8e82a1b~tplv-k3u1fbpfcp-watermark.image?)

当然，pipe 更多还是单独在某个参数的位置应用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fced92c2344495b86524871d8ed9cfa~tplv-k3u1fbpfcp-watermark.image?)

这里的 @Query 是取 url 后的 ?bbb=true，而 @Param 是取路径中的参数，比如 /xxx/111 种的 111

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f61a443880944b1bb1aff47d2e77e769~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493ea39f11f1488ba3bd53dc6f4ee405~tplv-k3u1fbpfcp-watermark.image?)

此外，如果是 @Post 请求，可以通过 @Body 取到 body 部分：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a10d3521580a486ca1348b3f9b7bdde8~tplv-k3u1fbpfcp-watermark.image?)

我们一般用 dto 的 class 来接受请求体里的参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58338c7cc0634a388c58bde39f5bc8b6~tplv-k3u1fbpfcp-watermark.image?)

nest 会实例化一个 dto 对象：

用 postman 发个 post 请求：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a959786094d4690832d0af884921c12~tplv-k3u1fbpfcp-watermark.image?)

可以看到 nest 接受到了 body 里的参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bfb3d526abb4b478ccd3bc9988d486f~tplv-k3u1fbpfcp-watermark.image?)

除了 @Get、@Post 外，还可以用 @Put、@Delete、@Patch、@Options、@Head 装饰器分别接受 put、delete、patch、options、head 请求：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf5a32293fde40beb8e9f19d91e81329~tplv-k3u1fbpfcp-watermark.image?)

handler 和 class 可以通过 @SetMetadata 指定 metadata：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/937ac8e44f2d4fedb9818a0b6c8e70c5~tplv-k3u1fbpfcp-watermark.image?)

然后在 guard 或者 interceptor 里取出来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27163078cd944d68b10c13068dc08145~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5971233494fb4a1bb6968501878dd66a~tplv-k3u1fbpfcp-watermark.image?)

你可以通过 @Headers 装饰器取某个请求头 或者全部请求头：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59578d6bc6a64764a276c3fb8abbb1e8~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/583883749dc14df0b5d1ed7efbffee1c~tplv-k3u1fbpfcp-watermark.image?)

通过 @Ip 拿到请求的 ip：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dadc94181774a94aa3913d8d793909f~tplv-k3u1fbpfcp-watermark.image?)

通过 @Session 拿到 session 对象：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f8c71364e3849e3b6fd1b9b9dacaeea~tplv-k3u1fbpfcp-watermark.image?)

但要使用 session 需要安装一个 express 中间件：

    npm install express-session

在 main.ts 里引入并启用：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5971294374b641c7b099f95471b4f6e6~tplv-k3u1fbpfcp-watermark.image?)

指定加密的密钥和 cookie 的存活时间。

然后刷新页面：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d3b62447a4041e6b9f666da1d8e2705~tplv-k3u1fbpfcp-watermark.image?)

会返回 set-cookie 的响应头，设置了 cookie，包含 sid 也就是 sesssionid。

之后每次请求都会自动带上这个 cookie：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/466415bd1d9941a38053e08a61d53d89~tplv-k3u1fbpfcp-watermark.image?)

这样就可以在 session 对象里存储信息了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f5bb63a915e4218aa6e1a997e8e4db0~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83805b26ffed403fb45106412479d766~tplv-k3u1fbpfcp-watermark.image?)

@HostParam 用于取域名部分的参数：

我们再创建个 controller：

    nest g controller aaa --no-spec --flat

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a30b153d260842c4b0a21aa9ab37bd46~tplv-k3u1fbpfcp-watermark.image?)

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

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0acf98f2b82041df81cb8a7e92f639b2~tplv-k3u1fbpfcp-watermark.image?)

然后再访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e44328d1d6d74a01914d0ac5187a8bc4~tplv-k3u1fbpfcp-watermark.image?)

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

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a059c8c10ae74b80862238fdf7935043~tplv-k3u1fbpfcp-watermark.image?)

前面取的这些都是 request 里的属性，当然也可以直接注入 request 对象：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f2bd6c37caf46b6b1e4b96f29e78291~tplv-k3u1fbpfcp-watermark.image?)

通过 @Req 或者 @Request 装饰器，这俩是同一个东西：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4041e1d300b14403bc05d1bc296829f4~tplv-k3u1fbpfcp-watermark.image?)

注入 request 对象后，可以手动取任何参数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bfdaeb455a34a6a8d1bf655fdc979c4~tplv-k3u1fbpfcp-watermark.image?)

当然，也可以 @Res 或者 @Response 注入 response 对象，只不过 response 对象有点特殊：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0069b293e87e44a8af1df6a6150ff511~tplv-k3u1fbpfcp-watermark.image?)

当你注入 response 对象之后，服务器会一直没有响应：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a328cef97c9242fb8c2b93e50feb9b9c~tplv-k3u1fbpfcp-watermark.image?)

因为这时候 Nest 就不会再把 handler 返回值作为响应内容了。

你可以自己返回响应：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b22ecf0abbab49eca095d05d8a03644e~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b940ec0f01b4a268b32ac10f7d15842~tplv-k3u1fbpfcp-watermark.image?)

Nest 这么设计是为了避免你自己返回的响应和 Nest 返回的响应的冲突。

如果你不会自己返回响应，可以通过 passthrough 参数告诉 Nest：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/404c6fe6d28947de89e1b94d3b535e5c~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b940ec0f01b4a268b32ac10f7d15842~tplv-k3u1fbpfcp-watermark.image?)

除了注入 @Res 不会返回响应外，注入 @Next 也不会：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b696471d11644cc8dc4a07efd697546~tplv-k3u1fbpfcp-watermark.image?)

当你有两个 handler 来处理同一个路由的时候，可以在第一个 handler 里注入 next，调用它来把请求转发到第二个 handler：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f74e4f19b09e434496a5dfe35caedc66~tplv-k3u1fbpfcp-watermark.image?)

Nest 不会处理注入 @Next 的 handler 的返回值。

handler 默认返回的是 200 的状态码，你可以通过 @HttpCode 修改它：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7148d5f586494f9891b1d4a43cebc103~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2e4d8c9ee3b4598b6bfdd53f6d1c61d~tplv-k3u1fbpfcp-watermark.image?)

当然，你也可以修改 response header，通过 @Header 装饰器：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ce211852e9e4d5c9d9f954355f5c60b~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00ef498cad0d4670821b46eb64a12731~tplv-k3u1fbpfcp-watermark.image?)

此外，你还可以通过 @Redirect 装饰器来指定路由重定向的 url：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ee4edf4a78b4fb683fb4f48d91270a5~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d563d9e5836f49038f9ad7db40702f85~tplv-k3u1fbpfcp-watermark.image?)

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

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dc3a9722af1467eb26f7b21f028abfe~tplv-k3u1fbpfcp-watermark.image?)

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

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eab9c35c1534e2b9a173302480cda32~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5afa60e3c49c4ac7af3fe65f1f52a96c~tplv-k3u1fbpfcp-watermark.image?)

在 handler 里指定模版和数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcd6047993244f07a6ac050aaf654573~tplv-k3u1fbpfcp-watermark.image?)

就可以看到渲染出的 html 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b59a367d570e4a5f84332ee02b8ac0d8~tplv-k3u1fbpfcp-watermark.image?)

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
