Nest 实现了 IoC 容器，会从入口模块开始扫描，分析 Module 之间的引用关系，对象之间的依赖关系，自动把 provider 注入到目标对象。

而这个 provider 也有好几种，这节我们就来看一下。

我们创建个 nest 项目：

```
nest new custom-provider
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5387a7abd38847dd81d041295bc9752f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=848&h=686&s=275790&e=png&b=020202)

可以看到 AppService 是被 @Injectable 修饰的 class：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/503ed384731f4ec2b3ffcd7398884917~tplv-k3u1fbpfcp-watermark.image?)

在 Module 的 providers 里声明：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6d42361e0b547ec848f337f674c27ec~tplv-k3u1fbpfcp-watermark.image?)

这就是 provider。

其实这是一种简写，完整的写法是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d89fe1295f4898b8efb818cbcf022e~tplv-k3u1fbpfcp-watermark.image?)

```javascript
{
  provide: AppService,
  useClass: AppService
}
```

通过 provide 指定 token，通过 useClass 指定对象的类，Nest 会自动对它做实例化后用来注入。

在 AppController 的构造器里参数里声明了 AppService 的依赖，就会自动注入：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eecb757fc96c43d9ad3bb166eeec2393~tplv-k3u1fbpfcp-watermark.image?)

如果不想用构造器注入，也可以属性注入：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10fad8a2e44c466999a1615b6b561166~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@Inject(AppService)
private readonly appService: AppService;
```

通过 @Inject 指定注入的 provider 的 token 即可。

有的同学说，在构造器参数里指定 AppService 的依赖的时候也没指定 token 啊？

那是因为 AppService 这个 class 本身就是 token。

当然，这个 token 也可以是字符串：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0805d65c9d074b5c85288d73928f6e39~tplv-k3u1fbpfcp-watermark.image?)

```javascript
{
    provide: 'app_service',
    useClass: AppService
}
```

如果 token 是字符串的话，注入的时候就要用 @Inject 手动指定注入对象的 token 了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb6d3baa60634eb1845d6759e90c51c5~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@Inject('app_service') private readonly appService: AppService
```

我们调试下：

点击调试面板的 create launch.json file，创建调试配置文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/541ac1195d0643789f05b1751ad27d71~tplv-k3u1fbpfcp-watermark.image?)

添加这样一个调试配置：

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
在 getHello 方法打个断点，点击调试启动：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c4ead0a6f2f4090bfbdae01458094d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1446&h=1080&s=136411&e=png&b=1c1c1c)

浏览器访问 http://localhost:3000 ，代码会在断点处断住。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a56e26fbc724b3ebcc184eb7eb7dd5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1872&h=1310&s=328087&e=png&b=1c1c1c)

可以看到，这时候 appService 就有值了。

也就是说，用字符串或者 class 做 token 的 provider，都可以正确被注入到目标对象。

相比之下，用 class 做 token 可以省去 @Inject，比较简便。

除了指定 class 外，还可以直接指定一个值，让 IoC 容器来注入。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/572363326c364b05ac54a72b0c84b2b7~tplv-k3u1fbpfcp-watermark.image?)

```javascript
{
    provide: 'person',
    useValue: {
        name: 'aaa',
        age: 20
    }
}
```

使用 provide 指定 token，使用 useValue 指定值。

然后在对象里注入它：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/861e16c386de4bc783d0c617414afc1d~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@Inject('person') private readonly person: {name: string, age: number}
```

调试一下可以看到，确实是注入了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4111c661544e43e8b84cd55aa64a3891~tplv-k3u1fbpfcp-watermark.image?)

provider 的值可能是动态产生的，Nest 也同样支持：

```javascript
{
    provide: 'person2',
    useFactory() {
        return {
            name: 'bbb',
            desc: 'cccc'
        }
    }
}
```

我们可以使用 useFactory 来动态创建一个对象。

在对象里注入：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1533e1b359f48268f04a15849242849~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@Inject('person2') private readonly person2: {name: string, desc: string}
```

类型是 {name: string, age: number} 。

调试下，也是可以拿到创建出的对象的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3700565f2434399a4debd44cd7890fe~tplv-k3u1fbpfcp-watermark.image?)

这个 useFactory 支持通过参数注入别的 provider：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6f2d3acc1144107bd8c20e8f0c6a1dc~tplv-k3u1fbpfcp-watermark.image?)

```javascript
{
  provide: 'person3',
  useFactory(person: { name: string }, appService: AppService) {
    return {
      name: person.name,
      desc: appService.getHello()
    }
  },
  inject: ['person', AppService]
}
```

通过 inject 声明了两个 token，一个是字符串 token 的 person，一个是 class token 的 AppService。

也就是注入这两个 provider：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b16f838981da41838058d98c46ed28b2~tplv-k3u1fbpfcp-watermark.image?)

在 return 那里打个断点。

可以看到，在调用 useFactory 方法的时候，Nest 就会注入这两个对象：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98d5adad4b3243c0938373a8ec7fc614~tplv-k3u1fbpfcp-watermark.image?)

useFactory 支持异步：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/395855d591fa4170a3b6cf22c5b6e16e~tplv-k3u1fbpfcp-watermark.image?)

```javascript
{
  provide: 'person5',
  async useFactory() {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    return {
      name: 'bbb',
      desc: 'cccc'
    }
  },
},
```
Nest 会等拿到异步方法的结果之后再注入：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/feec815403a24b4a876edebc9d766786~tplv-k3u1fbpfcp-watermark.image?)

这样就可以更灵活的创建注入对象。

此外，provider 还可以通过 useExisting 来指定别名：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b7c4ae6ba8a49fdbea47270b7745c01~tplv-k3u1fbpfcp-watermark.image?)

```javascript
{
  provide: 'person4',
  useExisting: 'person2'
}
```

这里就是给 person2 的 token 的 provider 起个新的 token 叫做 person4。

然后就可以用新 token 来注入了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84b3884c85434ee78f9ec36c4584798d~tplv-k3u1fbpfcp-watermark.image?)

这些自定义 provider 的方式里，最常用的是 useClass，不过我们一般会用简写，也就是直接指定 class。

useClass 的方式由 IoC 容器负责实例化，我们也可以用 useValue、useFactory 直接指定对象。

useExisting 只是用来起别名的，有的场景下会用到。

比如 @nestjs/typeorm 里就用到了 useValue、useFactory、useExisting：

它用 useValue 来[注入一段字符串](https://github.com/nestjs/typeorm/blob/153da09a384fdbf797b66e4500b69a72a7a47b78/lib/typeorm-core.module.ts#L113-L116)：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15215da691aa4fb5b52e38c20b7cdaa7~tplv-k3u1fbpfcp-watermark.image?)

用 useFactory 根据传入的 options [动态创建数据库连接对象](https://github.com/nestjs/typeorm/blob/153da09a384fdbf797b66e4500b69a72a7a47b78/lib/typeorm-core.module.ts#L83-L101)：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cbc4ddcecee4f8e89f089af85fa77a1~tplv-k3u1fbpfcp-watermark.image?)

用 useExisting 给 DataSource 起了一个 Connection 的[别名](https://github.com/nestjs/typeorm/blob/153da09a384fdbf797b66e4500b69a72a7a47b78/lib/typeorm-core.module.ts#L68-L71)：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f45fa90bb49943e18db58300fc5cf8ad~tplv-k3u1fbpfcp-watermark.image?)

这里是一个版本用了 Connection，一个版本用了 DataSource，通过 useExisting 起别名就可以兼容两者。

此外，如果觉得构造器注入写起来不方便，可以使用属性注入，效果一样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a058deb301c0444fa650bd68cde366fb~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1754ddc10e9144efbd79921cfb62ea05~tplv-k3u1fbpfcp-watermark.image?)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/custom-provider)。

## 总结

一般情况下，provider 是通过 @Injectable 声明，然后在 @Module 的 providers 数组里注册的 class。

默认的 token 就是 class，这样不用使用 @Inject 来指定注入的 token。

但也可以用字符串类型的 token，不过注入的时候要用 @Inject 单独指定。

除了可以用 useClass 指定注入的 class，还可以用 useValue 直接指定注入的对象。

如果想动态生成对象，可以使用 useFactory，它的参数也注入 IOC 容器中的对象，然后动态返回 provider 的对象。

如果想起别名，可以用 useExisting 给已有的 token，指定一个新 token。

灵活运用这些 provider 类型，就可以利用 Nest 的 IOC 容器中注入任何对象。


