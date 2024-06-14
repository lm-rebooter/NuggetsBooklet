Nest 内置了很多装饰器，大多数功能都是通过装饰器来使用的。

但当这些装饰器都不满足需求的时候，能不能自己开发呢？

装饰器比较多的时候，能不能把多个装饰器合并成一个呢？

自然是可以的。

很多内置装饰器我们都可以自己实现。

我们来试试看：

    nest new custom-decorator -p npm

创建个 nest 项目。

执行

    nest g decorator aaa --flat

创建个 decorator。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34a2f8ed60a3463dbfacdae8bc18db87~tplv-k3u1fbpfcp-watermark.image?)

这个装饰器就是自定义的装饰器。

之前我们是这样用的 @SetMetadata

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a85dbbd4a45b4c5a8bcf7993164a8d2a~tplv-k3u1fbpfcp-watermark.image?)

然后加个 Guard 取出来做一些判断：

    nest g guard aaa --flat --no-spec

guard 里使用 reflector 来取 metadata：

```javascript
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AaaGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log(this.reflector.get('aaa', context.getHandler()));

    return true;
  }
}
```
加到路由上：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70f5dbc7b8aa46669f37d0663c2f4219~tplv-k3u1fbpfcp-watermark.image?)

把服务跑起来：

```
npm run start:dev
```
然后访问 http://localhost:3000 可以看到打印的 metadata

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b0dafaa775240379f7cdd3547f8c8bf~tplv-k3u1fbpfcp-watermark.image?)

但是不同 metadata 有不同的业务场景，有的是用于权限的，有的是用于其他场景的。

但现在都用 @SetMetadata 来设置太原始了。

这时候就可以这样封装一层：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7af839f85a644f0d9b534f316cdc8305~tplv-k3u1fbpfcp-watermark.image?)

装饰器就可以简化成这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5596734fbcbc442f92d5b91c7ae98984~tplv-k3u1fbpfcp-watermark.image?)

还有，有没有觉得现在装饰器太多了，能不能合并成一个呢？

当然也是可以的。

这样写：

```javascript
import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { Aaa } from './aaa.decorator';
import { AaaGuard } from './aaa.guard';

export function Bbb(path, role) {
  return applyDecorators(
    Get(path),
    Aaa(role),
    UseGuards(AaaGuard)
  )
}
```

在自定义装饰器里通过 applyDecorators 调用其他装饰器。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f6aba8b0b4d46ceb3e8ce4ca699d136~tplv-k3u1fbpfcp-watermark.image?)

这三个 handler 的装饰器都是一样的效果。

这就是自定义方法装饰器。

此外，也可以自定义参数装饰器：

```javascript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Ccc = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    return 'ccc';
  },
);
```

先用用看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/049a351152e84649ac59ac1794270c09~tplv-k3u1fbpfcp-watermark.image?)

大家猜这个 c 参数的值是啥？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eca5013dd2a4353aa056f8cf6738b34~tplv-k3u1fbpfcp-watermark.image?)

没错，就是 ccc，也就是说参数装饰器的返回值就是参数的值。

回过头来看看这个装饰器：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1e24d56299b4fcc8016633dbaeb5f84~tplv-k3u1fbpfcp-watermark.image?)

data 很明显就是传入的参数，而 ExecutionContext 前面用过，可以取出 request、response 对象。

这样那些内置的 @Param、@Query、@Ip、@Headers 等装饰器，我们是不是能自己实现了呢？

我们来试试看：

```javascript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const MyHeaders = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return key ? request.headers[key.toLowerCase()] : request.headers;
  },
);
```

通过 ExecutionContext 取出 request 对象，然后调用 getHeader 方法取到 key 对应的请求头返回。

效果如下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06295629b23d4ce5a0f6b6266053e607~tplv-k3u1fbpfcp-watermark.image?)

分别通过内置的 @Headers 装饰器和我们自己实现的 @MyHeaders 装饰器来取请求头，结果是一样的。

再来实现下 @Query 装饰器：

```javascript
export const MyQuery = createParamDecorator(
    (key: string, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request.query[key];
    },
);
```

用一下试试看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/170ee0fa7c6e4b93925fe4ae529c0920~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eefd9211413d47ba88eb35460e5a97bb~tplv-k3u1fbpfcp-watermark.image?)

和内置的 Query 用起来一毛一样！

同理，其他内置参数装饰器我们也能自己实现。

而且这些装饰器和内置装饰器一样，可以使用 Pipe 做参数验证和转换：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff3a66af71ed46de86c271f18fe05b4f~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01487cf59b00422f94731a9324394e59~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8deb7674a4324d15b62043305dbca6c5~tplv-k3u1fbpfcp-watermark.image?)

知道了如何自定义方法和参数的装饰器，那 class 的装饰器呢？

其实这个和方法装饰器的定义方式一样：

比如单个装饰器：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9262db3b20574da3a40c8d30b88401e6~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fc1008f19e747ab8d1be64a1b504276~tplv-k3u1fbpfcp-watermark.image?)

可以看到自定义装饰器生效了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee94a6fa7bca460cb6a646bab2a5302e~tplv-k3u1fbpfcp-watermark.image?)

也可以通过 applyDecorators 组合多个装饰器：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae3041a6f8d74fa3aa193dee0f928818~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acbc270d31214cf0b70a159e2ee34426~tplv-k3u1fbpfcp-watermark.image?)

在 guard 里加一条打印：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e84006ac2134962b02300ed11c18430~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6a472090a5a442aa4d999c99051bff9~tplv-k3u1fbpfcp-watermark.image?)

可以看到 metadata 也设置成功了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73a3a453c06c4510853ca290d76c5c08~tplv-k3u1fbpfcp-watermark.image?)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/custom-decorator)

## 总结

内置装饰器不够用的时候，或者想把多个装饰器合并成一个的时候，都可以自定义装饰器。

方法的装饰器就是传入参数，调用下别的装饰器就好了，比如对 @SetMetadata 的封装。

如果组合多个方法装饰器，可以使用 applyDecorators api。

class 装饰器和方法装饰器一样。

还可以通过 createParamDecorator 来创建参数装饰器，它能拿到 ExecutionContext，进而拿到 reqeust、response，可以实现很多内置装饰器的功能，比如 @Query、@Headers 等装饰器。

通过自定义方法和参数的装饰器，可以让 Nest 代码更加的灵活。
