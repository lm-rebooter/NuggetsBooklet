Exception Filter 是在 Nest 应用抛异常的时候，捕获它并返回一个对应的响应。

比如路由找不到时返回 404：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b9d75dc99fc4121a6679f7530555925~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=598&h=300&s=33718&e=png&b=fdfdfd)

服务端报错时返回 500：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27012d32c72f472186b05bbfa3f6bfe4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=540&h=296&s=29295&e=png&b=fdfdfd)

参数的错误返回 400：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96886fcf1ee7463889c6ec18ae45a099~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=494&h=304&s=32943&e=png&b=fdfdfd)

这些都是 Exception Filter 做的事情。

那么，如果我们想自定义异常时返回的响应格式呢？

这种就要自定义 Exception Filter 了。

创建个 nest 项目：

```
nest new exception-filter-test
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f859b57160eb4facbedd424e1beeb017~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=684&s=168165&e=png&b=010101)

把它跑起来：

```
npm run start:dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c48febb788f4c94b8fedb1ff01e0630~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1526&h=334&s=115093&e=png&b=181818)

浏览器访问 http://localhost:3000 可以看到 hello world，代表服务跑起来了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d5bd0d07fcb4477814ca97b8fe287ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=550&h=170&s=15840&e=png&b=ffffff)

然后在 controller 里抛个异常： 

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6513d46aec8c406ba44a1e6593c9288e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=486&s=112600&e=png&b=202020)

```javascript
throw new HttpException('xxxx', HttpStatus.BAD_REQUEST)
```
这个 HttpStatus 就是一些状态码的常量：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f1c9abeb20640b988eed80ab6f7fb9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=524&s=171231&e=gif&f=34&b=222222)

这时候刷新页面，返回的就是 400 对应的响应：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f04c970babc949df9c342131f610a21e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=280&s=25680&e=png&b=fdfdfd)

这个响应的格式是内置的 Exception Filter 生成的。

当然，你也可以直接抛具体的异常：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/813ffdfd373d4d4fbb00ee8408f35c35~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=248&s=48310&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00fd127d5c70464290bfcd27a40a9628~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=582&h=314&s=31111&e=png&b=fdfdfd)

然后我们自己定义个 exception filter：

```
nest g filter hello --flat --no-spec
```

--flat 是不生成 hello 目录，--no-spec 是不生成测试文件。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b1e3e7ac8284574b058710e89d9e751~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=670&h=70&s=17647&e=png&b=191919)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13da92ec51ae4f6596fed68444879d00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1172&h=284&s=62603&e=png&b=1f1f1f)

@Catch 指定要捕获的异常，这里指定 BadRequestException。


```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(BadRequestException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    debugger;
  }
}
```
先打个断点。

在 AppModule 里引入：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d675e362c14d4b5898ba56ac4fc23f6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=846&h=484&s=93395&e=png&b=1f1f1f)

```javascript
app.useGlobalFilters(new HelloFilter());
```
如果你想局部启用，可以加在 handler 或者 controller 上：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/991278f81105477baf1fc9426ca38db7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=504&h=182&s=30353&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a18e5b669d3845f2b092982b644bea2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=490&h=150&s=25435&e=png&b=1f1f1f)

然后新建个调试配置文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d286f2ac98dd4e5e99f57a2ac803eb0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=640&h=390&s=45127&e=png&b=181818)

输入调试配置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de2342ca2649488f86a3085daf20e45a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=840&s=116234&e=png&b=1f1f1f)

```json
{
    "type": "node",
    "request": "launch",
    "name": "debug nest",
    "runtimeExecutable": "npm",
    "args": [
        "run",
        "start:dev",
    ],
    "skipFiles": [
        "<node_internals>/**"
    ],
    "console": "integratedTerminal",
}
```
把之前的服务关掉，点击调试启动：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3c4753f4795472881a96add2a298858~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1324&h=852&s=176647&e=png&b=1c1c1c)

刷新页面，代码会在断点处断住：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ba99ed6372c413bbfd4050248dccac2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1598&h=858&s=238183&e=png&b=1d1d1d)

我们只要根据异常信息返回对应的响应就可以了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d01b846ffbe8485fad5d1d838eca3525~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=540&s=129790&e=png&b=202020)

```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode = exception.getStatus();

    response.status(statusCode).json({
       code: statusCode,
       message: exception.message,
       error: 'Bad Request',
       xxx: 111
    })
  }
}

```
这样，抛异常时返回的响应就是自定义的了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf1ce8c1a18945a98ee2e4babae2994a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=550&h=356&s=32092&e=png&b=fdfdfd)

但我们只是 @Catch 了 BadRequestException

如果抛的是其他异常，依然是原来的格式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ae44ad88cb34a4c809a3aa9e35265f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=226&s=47330&e=png&b=1f1f1f)

比如我抛一个 BadGatewayException。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa4500ea58224c8a990fde02ecfcaf2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=570&h=304&s=30168&e=png&b=fdfdfd)

依然是默认格式。

那我们只要 @Catch 指定 HttpException 不就行了？

因为 BadRequestExeption、BadGateWayException 等都是它的子类。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3e384391b13481ea29e678c14602f21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=740&s=150347&e=png&b=1f1f1f)

试一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/947030e2ced443cd9ed1f4d8555e2f87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=574&h=344&s=31776&e=png&b=fdfdfd)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2df461a79adc4d61b0bcc172dad6bbcd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=538&h=344&s=31635&e=png&b=fdfdfd)

确实，现在所有的 HttpException 都会被处理了。

但其实这也有个问题。

就是当我们用了 ValidationPipe 的时候。

比如我们加一个路由：

```javascript
@Post('aaa') 
aaa(@Body() aaaDto: AaaDto ){
    return 'success';
}
```
然后创建 src/aaa.dto.ts

```javascript
export class AaaDto {
    aaa: string;
    
    bbb: number;
}
```
安装用到的包：

```
npm install --save class-validator class-transformer
```
然后给 AaaDto 添加几个校验规则：

```javascript
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class AaaDto {
    @IsNotEmpty({message: 'aaa 不能为空'})
    @IsEmail({}, {message: 'aaa 不是邮箱格式'})
    aaa: string;
    
    @IsNumber({}, {message: 'bbb 不是数字'})
    @IsNotEmpty({message: 'bbb 不能为空'})
    bbb: number;
}
```
在 main.ts 启用 ValidationPipe：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/649786f904ea41b1b2cdd4d43492bae6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=866&h=608&s=122015&e=png&b=1f1f1f)

```javascript
app.useGlobalPipes(new ValidationPipe());
```

在 postman 里测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/298928b550af4817bb070d12c37f8b70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=818&s=82850&e=png&b=fcfcfc)

可以看到，提示的错误也不对了。

因为我们自定义的 exception filter 会拦截所有 HttpException，但是没有对这种情况做支持。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5df5b55aa61b4499a6cf23718bd13d4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=620&s=123385&e=png&b=1f1f1f)

先不加这个 filter。

这时候响应是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eec351b99ec4674846958c92693fe47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=894&s=90951&e=png&b=fcfcfc)

我们对这种情况做下支持：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c26c24ed49b64c908fdbb398519592b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=886&h=590&s=121580&e=png&b=1f1f1f)

启用自定义的 filter，然后打个断点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/052703cecab44c65835f5d0ffb6d3f4a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=594&s=122550&e=png&b=1f1f1f)

再次访问会在断点处断住：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95c13555449345f2b59b1dd88bbea4e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=598&s=151151&e=png&b=202020)

可以看到 ValidationPipe 的 response 格式是这样的。

所以我们可以这样改：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48446a774ec84fa58563fea546afe6a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1310&h=738&s=172236&e=png&b=1f1f1f)

```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };
    
    response.status(statusCode).json({
       code: statusCode,
       message: res?.message?.join ? res?.message?.join(',') : exception.message,
       error: 'Bad Request',
       xxx: 111
    })
  }
}
```

如果 response.message 是个数组，就返回 join 的结果，否则还是返回 exception.message

再试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d4b65e69c6f4ec38777e76d70c36ccc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=806&s=87413&e=png&b=fcfcfc)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcbb65dfb38d4a3bae2a06d2abca9fc2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=554&h=326&s=31640&e=png&b=fdfdfd)

现在，ValidationPipe 的错误和其他的错误就都返回了正确的格式。

那如果我想在 Filter 里注入 AppService 呢？

这就需要改一下注册方式：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/579bb3c079f94392a19e817f937b88b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=600&s=123262&e=png&b=1f1f1f)

不用 useGlobalFilters 注册了，而是在 AppModule 里注册一个 token 为 APP_FILTER 的 provider：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d674aeefea6d444298bba83448e6f414~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=718&s=125118&e=png&b=1f1f1f)

```javascript
{
  provide: APP_FILTER,
  useClass: HelloFilter
}
```
Nest 会把所有 token 为 APP_FILTER 的 provider 注册为全局 Exception Filter。

注册多个 Filter 也是这么写。

其余的全局 Guard、Interceptor、Pipe 也是这样注册：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53bc0c71ad5e4dd5ac6896f933cf57b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=578&h=222&s=28288&e=png&b=222222)

这样注册的好处就是可以注入其他 provider 了：

比如我注入了 AppService，然后调用它的 getHello 方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0febd36852749139bd753a31ccfa169~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=984&s=218038&e=png&b=1f1f1f)

```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Catch(HttpException)
export class HelloFilter implements ExceptionFilter {

  @Inject(AppService)
  private service: AppService;

  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };
    
    response.status(statusCode).json({
       code: statusCode,
       message: res?.message?.join ? res?.message?.join(',') : exception.message,
       error: 'Bad Request',
       xxx: 111,
       yyy: this.service.getHello()
    })
  }
}
```
可以看到，service 方法调用成功了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fc8070b467e469abaec739549f12104~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=888&h=872&s=91087&e=png&b=fcfcfc)

此外，如果你想自定义 Exception 也是可以的。

比如添加一个 src/unlogin.filter.ts 

```javascript
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class UnLoginException{
  message: string;

  constructor(message?){
    this.message = message;
  }
}

@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      message: 'fail',
      data: exception.message || '用户未登录'
    }).end();
  }
}
```
我们创建了一个 UnloginException 的异常。

然后在 ExceptionFilter 里 @Catch 了它。

在 AppModule 里注册这个全局 Filter：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b219d2fc7303447486687e1496569c8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=866&h=892&s=153175&e=png&b=1f1f1f)

```javascript
{
  provide: APP_FILTER,
  useClass: UnloginFilter
}
```
之后在 AppController 里抛出这个异常：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/417033967a124ab1966d8f2e2f167caa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=634&h=268&s=48195&e=png&b=202020)

浏览器里访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a0b0dd568ba4b55a5c7a8474f20f262~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=592&h=298&s=29084&e=png&b=fdfdfd)

可以看到，返回的是我们自定义的格式。

也就是说，可以用自定义 Exception Filter 捕获内置的或者自定义的 Exception。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exception-filter-test)。
## 总结

这节我们学习了自定义 Exception Filter。

通过 @Catch 指定要捕获的异常，然后在 catch 方法里拿到异常信息，返回对应的响应。

如果捕获的是 HttpException，要注意兼容下 ValidationPipe 的错误格式的处理。

filter 可以通过 @UseFilters 加在 handler 或者 controller 上，也可以在 main.ts 用 app.useGlobalFilters 全局启用。

如果 filter 要注入其他 provider，就要通过 AppModule 里注册一个 token 为 APP_FILTER 的 provider 的方式。

此外，捕获的 Exception 也是可以自定义的。

这样，我们就可以自定义异常和异常返回的响应格式了。