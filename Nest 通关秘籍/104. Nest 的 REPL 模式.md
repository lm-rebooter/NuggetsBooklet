我们写过很多 Module、Service、Controller，但这些都要服务跑起来之后在浏览器里访问对应的 url，通过 get 或者 post 的方式传参来测试。

这个还是挺麻烦的，能不能像 node 的 repl 那样，直接在控制台测试呢？

repl 是 read-eval-paint-loop，也就是这个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/777cf2c0ab8b4f648dc795a37f320162~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=566&h=482&s=51437&e=png&b=000000)

Nest 能不能这样来测试呢？

可以的，Nest 支持 repl 模式。

我们创建个 Nest 项目：

```
nest new repl-test
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/137a3efc322e4e26ba648fb4a617f2f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=642&s=141942&e=png&b=010101)

然后创建两个模块：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6754d51a50bb4e16866d1c4483ba3c2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=926&h=1016&s=239764&e=png&b=191919)

把服务跑起来：

```
npm run start:dev
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/086be719b6654c86a246a2858423b588~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1704&h=994&s=451390&e=png&b=181818)

浏览器访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c09659fd4f4649f59ad5f9ba34369c4c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=182&s=19289&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0d3997c6ede4de5a952612758bd4505~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=604&h=204&s=19983&e=png&b=ffffff)

我们前面都是这么测试接口的。

其实还可以用 repl 模式。

在 src 下创建个 repl.ts，写入如下内容：

```javascript
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}
bootstrap();
```
然后把服务停掉，通过这种方式跑：

```
npm run start:dev -- --entryFile repl
```

这里的 --entryFile 是指定入口文件是 repl.ts

前面带了个 -- 是指后面的参数不是传给 npm run start:dev 的，要原封不动保留。

也就是会传给 nest start

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b21e78e1a14452c80196ae20c545812~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690&h=114&s=25838&e=png&b=202020)

当然，你直接执行 nest start 也可以：

```
nest start --watch --entryFile repl
```

跑起来后，执行 debug()，会打印所有的 module 和 module 下的 controllers 和 providers。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b15e5eb0e5b474db29720e3211d9a9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=588&h=794&s=87297&e=png&b=181818)

而且，你可以 get() 来取对应的 providers 或者 controllers 调用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebfcd94265ab490a8d31e3ebf6b542f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=698&s=116051&e=png&b=1c1c1c)

get、post 方法都可以调用。

有的同学说，你这个 post 方法没有参数啊。

那我们加一些：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdf7f5845e854489b829e8186aac5695~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690&h=286&s=36309&e=png&b=1f1f1f)

然后添加 ValidationPipe：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01be04999b794519b5e3fdf793c37b82~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=612&s=127403&e=png&b=1f1f1f)

安装校验相关的包：

```
npm install class-validator class-transformer
```

在 dto 添加约束：

```javascript
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAaaDto {
    @IsNotEmpty()
    aaa: string;

    @IsEmail()
    bbb: string;
}
```

我们先正常跑下服务：

```
npm run start:dev
```
然后 postman 里测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c14f46a195014e37b9c954d504fbfb5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=788&h=838&s=83951&e=png&b=fcfcfc)

可以看到，ValidationPipe 生效了。

那 repl 里是不是一样呢？

我们再跑下 repl 模式：

```
npm run start:dev -- --entryFile repl
```

可以看到，并没有触发 pipe：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfd8ec0cd0ff4570b7a77d1794988bcd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=804&s=167939&e=png&b=1b1b1b)

也就是说，它只是单纯的传参调用这个函数，不会解析装饰器。

所以测试 controller 的话，repl 的方式是有一些限制的。

但是测试 service 很不错：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/637e0aaca9bd4ffca0ea475da193c2bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=644&h=214&s=26237&e=png&b=181818)

比如测试某个项目的 UserService 的 login 方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c56f9d0f87ac40a5978c5f47ecd902fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534&h=1422&s=336812&e=png&b=191919)

就很方便。

大概知道 repl 模式是做啥的之后，我们过一下常用的 api：

debug() 可以查看全部的 module 或者某个 module 下的 cotrollers、providers：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47567c24da6341bb93687460679247a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=466&h=644&s=62438&e=png&b=181818)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8bf9ec2ffbd40a8a1b9b97fc276aa44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=426&h=296&s=28159&e=png&b=181818)

methods() 可以查看某个 controller 或者 provider 的方法：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/843e3284b7444bff885c5a825cf853a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=530&h=338&s=27089&e=png&b=181818)

get() 或者 $() 可以拿到某个 controller 或者 provider 调用它的方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e4482f8468f4657aa76e08100e363d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=288&s=40856&e=png&b=181818)

常用的 api 就这些。

此外，按住上下键可以在历史命令中导航：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/981e59361f9e45b0b425cdedcf8e0bd3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234&h=718&s=96689&e=gif&f=26&b=191919)

但有个问题。

当你重新跑之后，这些命令历史就消失了，再按上下键也没有历史。

可以改一下 repl.ts：

```javascript
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const replServer = await repl(AppModule);
    replServer.setupHistory(".nestjs_repl_history", (err) => {
        if (err) {
            console.error(err);
        }
    });
}
bootstrap();

```
再跑的时候也是有历史的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d9ffa40680b4004a7f84bba633b0524~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1572&h=764&s=319655&e=gif&f=42&b=191919)

其实就是 nest 会把历史命令写入文件里，下一次跑就可以用它恢复历史了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7adf2d8d4d024957b788c25fd46cf2af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=482&h=272&s=27250&e=png&b=1f1f1f)

你还可以把这个命令配到 npm scripts 里：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8da4ff55b144c98b61c6a4ab7af0873~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=114&s=25935&e=png&b=202020)

然后直接 npm run repl:dev 来跑。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/repl-login)。

## 总结

这节我们学了 nest 的 repl 模式。

repl 模式下可以直接调用 controller 或者 provider 的方法，但是它们并不会触发 pipe、interceptor 等，只是传参测试函数。

可以使用 debug() 拿到 module、controller、provider 的信息，methods() 拿到方法，然后 get() 或者 $() 拿到 controller、provider 然后调用。

repl 模式对于测试 service 或者 contoller 的功能还是很有用的。
