RxJS 是一个组织异步逻辑的库，它有很多 operator，可以极大的简化异步逻辑的编写。

它是由数据源产生数据，经过一系列 operator 的处理，最后传给接收者。

这个数据源叫做 observable。

比如这样：

```javascript
import { of, filter, map } from 'rxjs';

of(1, 2, 3)
.pipe(map((x) => x * x))
.pipe(filter((x) => x % 2 !== 0))
.subscribe((v) => console.log(`value: ${v}`));
```

用 node 跑一下，结果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c0d7a255bb84cee9c3cd29cc2dfd009~tplv-k3u1fbpfcp-watermark.image?)

这里 node 能直接解析 esm 需要在 package.json 里设置 type 为 module：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/454464cf6765412198523a9c33ff6faf~tplv-k3u1fbpfcp-watermark.image?)

这就是 map、filter 的 operator 的作用。

还是很容易理解的。

有同学说，这样的逻辑自己写也行呀。

那这种呢：

```javascript
import { of, scan, map } from 'rxjs';

const numbers$ = of(1, 2, 3);

numbers$
  .pipe(
    scan((total, n) => total + n),
    map((sum, index) => sum / (index + 1))
  )
  .subscribe(console.log);
```

scan 是计数，map 是转换，结果如下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f53b914317474cb88ead3a21ac30d19c~tplv-k3u1fbpfcp-watermark.image?)

或者是节流、防抖：

```javascript
import { fromEvent, throttleTime } from 'rxjs';

const clicks = fromEvent(document, 'click');
const result = clicks.pipe(throttleTime(1000));

result.subscribe(x => console.log(x));
```

```javascript
import { fromEvent, debounceTime } from 'rxjs';

const clicks = fromEvent(document, 'click');
const result = clicks.pipe(debounceTime(1000));
result.subscribe(x => console.log(x));
```

有同学说，这些逻辑都很简单呀，完全可以自己写。

没错，一般异步逻辑自己写也行。

但是架不住 RxJS 的 operator 多呀，组合起来可以实现非常复杂的异步逻辑处理。

可以在官网文档看到[所有的 operator](https://rxjs.dev/guide/operators#creation-operators-1)。

所以说，如果异步逻辑复杂度高了，那上 RxJS 收益还是很高的，异步逻辑的编写就变成了 operator 的组合，少写很多代码。

感受到为啥要用 RxJS 了么？

也是因为这个原因，Nest 的 interceptor 集成了 RxJS，可以用它来处理响应。

当然，也有人觉得这里没必要用 RxJS。

但既然 Nest 支持了，我们就用用看，基于那一堆 operator 确实是能简化异步逻辑的。

创建一个测试项目：

    nest new interceptor-test -p npm

进入目录执行 nest g interceptor：

    nest g interceptor aaa --flat --no-spec

我们可以这样实现接口耗时统计：

```javascript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AaaInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

tap operator 不会改变数据，只是额外执行一段逻辑。

在 handler 上启用 interceptor：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d9bd2a014e840de8bbd782c4caee1cc~tplv-k3u1fbpfcp-watermark.image?)

然后浏览器访问 <http://localhost:3000>

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c65983ca7714b7d9e13effcedc5f474~tplv-k3u1fbpfcp-watermark.image?)

就会看到打印的耗时数据：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20b6ebab0a034cc4beeddc4e2d846557~tplv-k3u1fbpfcp-watermark.image?)

或者全局启用这个 interceptor：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13609d5a22d346f08ac3844c3dbe1395~tplv-k3u1fbpfcp-watermark.image?)

路由级别和全局级别的 interceptor 还是有区别的，路由级别的可以注入依赖，而全局的不行：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a509b7937904912b0617d540ed6b544~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5eb833551804c0aa7ab24f4fc2d148d~tplv-k3u1fbpfcp-watermark.image?)

我们再来使用下别的 RxJS operator：

其实适合在 Nest 的 interceptor 里用的 operator 还真不多，也就这么几个：

## map

再生成一个 interceptor：

    nest g interceptor map-test --flat --no-spec

使用 map operator 来对 controller 返回的数据做一些修改：

```javascript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MapTestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => {
      return {
        code: 200,
        message: 'success',
        data
      }
    }))
  }
}
```

在 controller 里引入下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc01fd3012b9483ca01bee46570cd8e0~tplv-k3u1fbpfcp-watermark.image?)

跑下试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47a71b3069394bf49aecc524731ba47f~tplv-k3u1fbpfcp-watermark.image?)

现在返回的数据就变成了这样。

map 算是在 nest interceptor 里必用的 rxjs operator 了

## tap

再生成个 interceptor

    nest g interceptor tap-test --flat --no-spec

使用 tap operator 来添加一些日志、缓存等逻辑：

```javascript
import { AppService } from './app.service';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TapTestInterceptor implements NestInterceptor {
  constructor(private appService: AppService) {}

  private readonly logger = new Logger(TapTestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(tap((data) => {
      
      // 这里是更新缓存的操作，这里模拟下
      this.appService.getHello();

      this.logger.log(`log something`, data);
    }))
  }
}
```

因为还没讲到缓存那块，这里就调用 service 方法模拟了下。

日志记录我们用的 nest 内置的 Logger，在 controller 返回响应的时候记录一些东西。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed609e29fa88415ea2bed46de8884f4e~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问这个接口，会打印日志：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b82fffddcb744bbd932b63ad47f8b72d~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fda80ddff2f4c989f1b866102a577b6~tplv-k3u1fbpfcp-watermark.image?)

这里我们用的是 Nest 内置的 Logger，所以打印格式是这样的。

## catchError

controller 里很可能会抛出错误，这些错误会被 exception filter 处理，返回不同的响应，但在那之前，我们可以在 interceptor 里先处理下。

生成 interceptor：

    nest g interceptor catch-error-test --flat --no-spec

使用 catchError 处理抛出的异常：

```javascript
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class CatchErrorTestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CatchErrorTestInterceptor.name)

  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(err => {
      this.logger.error(err.message, err.stack)
      return throwError(() => err)
    }))
  }
}
```

这里我们就是日志记录了一下，当然你也可以改成另一种错误，重新 throwError。

在 controller 里用一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb5fbe5adee840e8b58211dd6c849b55~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问下，可以看到返回 500 的错误：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e74998be76c3424b9fa81b6a546a50b8~tplv-k3u1fbpfcp-watermark.image?)

打印了两次错误：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74d1cc1f61c84b6786bcbc117ea1284b~tplv-k3u1fbpfcp-watermark.image?)

一次是我们在 interceptor 里打印的，一次是 exception filter 打印的。

其实我们能看到这个 500 错误，就是内置的 exception filter 处理的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e74998be76c3424b9fa81b6a546a50b8~tplv-k3u1fbpfcp-watermark.image?)

对应的 Nest 源码如下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2198e6aae4344a2c9b64bc0fa5734b60~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9eccf5302f942c2b8ac6c9075e92987~tplv-k3u1fbpfcp-watermark.image?)

## timeout

接口如果长时间没返回，要给用户一个接口超时的响应，这时候就可以用 timeout operator。

我们再创建个 nest interceptor

    nest g interceptor timeout --flat --no-spec

添加如下逻辑：

```javascript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(3000),
      catchError(err => {
        if(err instanceof TimeoutError) {
          console.log(err);
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      })
    )
  }
}
```

timeout 操作符会在 3s 没收到消息的时候抛一个 TimeoutError。

然后用 catchError 操作符处理下，如果是 TimeoutError，就返回 RequestTimeoutException，这个有内置的 exception filter 会处理成对应的响应格式。

其余错误就直接 throwError 抛出去。

在 controller 里用一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f5989c408b14c5ca0a40ad97f433647~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问，3s 后返回 408 响应：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32efac20c280471898effb85d91fe169~tplv-k3u1fbpfcp-watermark.image?)

就是在这里处理的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e3eb04201dc43008ad0349168319ced~tplv-k3u1fbpfcp-watermark.image?)

不信可以抛一个其他的 exception 试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9973417e6f414bf88992f58161624c8d~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ca1c77286ba4951ba0b5693c5b54e5f~tplv-k3u1fbpfcp-watermark.image?)

最后，再来看下全局的 interceptor：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cea9df36fe24df9bd2f372cfe7453bc~tplv-k3u1fbpfcp-watermark.image?)

因为这种是手动 new 的，没法注入依赖。

但很多情况下我们是需要全局 interceptor 的，而且还用到一些 provider，怎么办呢？

nest 提供了一个 token，用这个 token 在 AppModule 里声明的 interceptor，Nest 会把它作为全局 interceptor：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e126e39cc9e435aac798e07947c4cfb~tplv-k3u1fbpfcp-watermark.image?)

在这个 interceptor 里我们注入了 appService：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b212d7a10d874341afdf2395e5e517ba~tplv-k3u1fbpfcp-watermark.image?)

添加一个路由：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecedb90ff1c8481b94dae6e796879e83~tplv-k3u1fbpfcp-watermark.image?)

访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a99e53b4ee544ba69d55b081e8a4288d~tplv-k3u1fbpfcp-watermark.image?)

可以看到全局 interceptor 生效了，而且这个 hello world 就是注入的 appService 返回的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b91330c950347a3ab4dbb435ca1df43~tplv-k3u1fbpfcp-watermark.image?)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/interceptor-test)。

## 总结

rxjs 是一个处理异步逻辑的库，它的特点就是 operator 多，你可以通过组合 operator 来完成逻辑，不需要自己写。

nest 的 interceptor 就用了 rxjs 来处理响应，但常用的 operator 也就这么几个：

*   tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等
*   map：对响应数据做修改，一般都是改成 {code, data, message} 的格式
*   catchError：在 exception filter 之前处理抛出的异常，可以记录或者抛出别的异常
*   timeout：处理响应超时的情况，抛出一个 TimeoutError，配合 catchErrror 可以返回超时的响应

总之，rxjs 的 operator 多，但是适合在 nest interceptor 里用的也不多。

此外，interceptor 也是可以注入依赖的，你可以通过注入模块内的各种 provider。

全局 interceptor 可以通过 APP\_INTERCEPTOR 的 token 声明，这种能注入依赖，比 app.useGlobalInterceptors 更好。

interceptor 是 nest 必用功能，还是要好好掌握的。
