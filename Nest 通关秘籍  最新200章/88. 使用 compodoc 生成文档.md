Nest 项目会有很多模块，模块之间相互依赖，模块内有 controller、service 等。

当项目复杂之后，模块之间的关系错综复杂。

这时候我们可以用 compodoc 生成一份文档，把依赖关系可视化。

compodoc 本来是给 angular 项目生成项目文档的，但是因为 angular 和 nest 项目结构类似，所以也支持了 nest。

我们创建个项目：

```
nest new compodoc-test
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/142fb1bcc11e492281c1d9a2a6b7e334~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=696&s=162264&e=png&b=010101)

安装 compodoc：

```
npm install --save-dev @compodoc/compodoc
```
然后生成一份文档：

```
npx @compodoc/compodoc -p tsconfig.json -s -o
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47df7a17e54349809f98ad9cae4eabdb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=670&s=56502&e=png&b=181818)

这个 README 就是项目下的 README.md:

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ff2612a4d6148ac9e34136364748ef6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2136&h=1438&s=299871&e=png&b=fdfdfd)

改一下 READMD.md，然后重新执行命令生成：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/883e1471264d4254b17272f7179adb6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1328&h=944&s=158651&e=png&b=1c1c1c)

可以看到页面上的也变了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/050755c00629402aacd7b6f27cc09aeb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1490&h=1040&s=115146&e=png&b=fdfdfd)

overview 部分上面是依赖图，下面是项目有几个模块、controller，可注入的 provider

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbd969ac7ee34156884f7c834475139c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2532&h=1336&s=207004&e=png&b=fdfdfd)

我们在项目下加几个模块：

```
nest g resource aaa

nest g resource bbb
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eee91ece02a44b5a1f1311460ec052a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=776&h=412&s=100199&e=png&b=191919)


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a39fed6d77454a6fbcb68012fe9739de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=360&s=88181&e=png&b=191919)

在 AaaModule 里把 AaaService 导出：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d965e009870c4d5b931c50f394a22b16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=854&h=472&s=85655&e=png&b=1f1f1f)

然后 BbbModule 引入 AaaModule：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35c843c5461a47ce9b4bb3ac6640dacc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=560&s=98790&e=png&b=1f1f1f)

在 BbbService 里注入 AaaService：
 
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45322f42acd743e4bb7bf3b4ce34b7c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=726&s=160144&e=png&b=1f1f1f)

先跑起来看一下：

```
npm run start:dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f42bca5192534333a1ba14beea6418b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534&h=614&s=275578&e=png&b=181818)

没啥问题：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19bb581382514a4db7fcb7830c89794a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=248&s=24966&e=png&b=ffffff)

类似这种依赖关系，compodoc 可视化之后是什么样的呢？

重新跑一下 compodoc：
```
npx @compodoc/compodoc -p tsconfig.json -s -o
```
依赖可视化是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e2f65a59f4e4a9a86b34c8748fdfe92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1548&h=1284&s=140377&e=png&b=ffffff)

用不同的颜色表示 Module、Provider、Exports 等。

可以看到 AppModule 引入了 AaaModule、BbbModule。

AaaModule 导出了 AaaService。

以及每个模块的 provider。

都可以可视化的看到。

点击左侧的 Modules，可以看到每个模块的可视化分析：

AaaModule：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee7548ad946641d68d96ab273d9ec054~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2334&h=1004&s=171232&e=png&b=fdfdfd)

BbbModule：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5167be109f8245faa4d533cd6ac35a7d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2160&h=1098&s=162601&e=png&b=fdfdfd)

AppModule：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4141dce1360f4286b660ec150a552529~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2378&h=1086&s=181131&e=png&b=fdfdfd)

当然，我们这个例子还是比较简单，当项目依赖复杂之后，这个可视化还是比较有用的。

此外，可以看到每个 Controller、Service 或者其他的 class 的属性、方法，点进去可以看到方法的参数、返回值等：


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b50a3f4efb44fed8f058b495c584d68~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2206&h=1260&s=173584&e=png&b=fdfdfd)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a58345f247864d2ab8af833aba937b64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1322&s=195763&e=png&b=fdfdfd)

当新人接手这个项目的时候，可以通过这份文档快速了解项目的结构。

回过头来，我们看下 compodoc 的一些 cli 选项：

```
npx @compodoc/compodoc -p tsconfig.json -s -o
```

-p 是指定 tsconfig 文件

-s 是启动静态服务器

-o 是打开浏览器

更多选项在 [compodoc 文档](https://compodoc.app/guides/options.html)里可以看到:


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7300bd910d944b82a73338fd9089c1e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2138&h=1432&s=344861&e=png&b=fdfdfd)

比如 --theme 可以指定主题，一共有 gitbook,aravel, original, material, postmark, readthedocs, stripe, vagrant 这 8 个主题：

跑一下：
```
npx @compodoc/compodoc -p tsconfig.json -s -o --theme postmark
```

可以看到文档主题换了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/799ce8ea459d449a80b007a1c72fa83f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2266&h=1250&s=211864&e=png&b=fdfdfd)

选项还是挺多的，如果都写在命令行也不现实，compodoc 同样支持配置文件。

我们在项目下添加一个 .compodoc.json 的文件：

```json
{
    "port": 8888,
    "theme": "postmark"
}
```

然后再跑下 compodoc：

```
npx @compodoc/compodoc -p tsconfig.json -s -o -c .compodoc.json
```

可以看到，配置生效了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaefa079eef24d669f77f20db59edb4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1558&h=1170&s=120468&e=png&b=fcfcfc)

文档里写的这些 cli options，基本都可以写在配置文件里。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1fdd5f87d4c49fa857494017753eeec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1998&h=1426&s=347859&e=png&b=fcfcfc)

不过一般也不咋用配置。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/compodoc-test)。

## 总结

我们学习了用 compodoc 生成 nest 项目的文档，它会列出项目的模块，可视化展示模块之间的依赖关系，展示每个模块下的 provider、exports 等。

对于新人接手项目来说，还是比较有用的。

而且可视化分析依赖和模块结构，对于复杂项目来说，是比较有帮助的。

compodoc 算是一个不错的 nest 相关的工具。
