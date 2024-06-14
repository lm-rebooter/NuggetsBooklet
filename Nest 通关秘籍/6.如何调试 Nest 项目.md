不少同学都是用 console.log 调试的，哪怕工作很多年依然是这样，这样有个致命的缺点：

你只能看到某个点的变量值，而看不到代码的整个执行路线。

对于复杂的项目来说，会用断点调试是必须的，因为这样可以看到作用域、调用栈，也就是代码的执行路线，然后单步运行来看变量的变化。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e376b1cd01d4a43b34c05c177952903~tplv-k3u1fbpfcp-watermark.image?)

所以这一节我们来学下如何调试 nest 项目。

首先，先看下 node 调试：

创建个项目：

```
mkdir debug-test
cd debug-test
npm init -y
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8555770f2fa74c529023f4920b43a04f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892&h=672&s=124406&e=png&b=000000)

添加 index.js

```javascript
const os = require('os');

const homedir = os.homedir();

console.log(homedir);
```

通过 os 模块拿到了 home 目录的路径。

直接 node 执行会输出结果：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2e2faa32e1f46489ccfe6ee6d5db6d3~tplv-k3u1fbpfcp-watermark.image?)

我们以调试模式跑起来：
```
node --inspect-brk index.js
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef8dd30711ae45719f3d46cfefa4b3c3~tplv-k3u1fbpfcp-watermark.image?)

\--inspect 是调试模式运行，而 --inspect-brk 还会在首行断住。

可以看到，它起了一个 ws 服务。

然后我们用调试客户端连上它，比如用 Chrome DevTools。

打开 <chrome://inspect/>，可以看到可以调试的目标：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a0ff69dc97e47ef9d6eccd1ae9d8501~tplv-k3u1fbpfcp-watermark.image?)

如果没有，就配置下 network target，加上 localhost:9229

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9ae4e138a374a62b5dd67b4e7592210~tplv-k3u1fbpfcp-watermark.image?)

点击 inspect 就可以看到调试界面了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5e10075d4804aa4bf7cab08f4bf22cc~tplv-k3u1fbpfcp-watermark.image?)

代码在首行断住了，右侧也可以看到作用域和调用栈。

可以单步调试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da8603e1e18e43f988bba07e93cd7aee~tplv-k3u1fbpfcp-watermark.image?)

nest 也是 node 项目，自然也是这样来调试的。

nest start 有个 --debug 的选项，

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fe1572f2de6423abb4a27e77043b45c~tplv-k3u1fbpfcp-watermark.image?)

原理就是 node --inspect。

这时候 inspect 发现啥也没：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/814e6b094e654fa8aed52cac73fb9d31~tplv-k3u1fbpfcp-watermark.image?)

因为 --inspect 并不会和 --inspect-brk 一样在首行断住。

我们在 controller 里加个 debugger：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d7bc6bb0ccc4e379d93da1a21567742~tplv-k3u1fbpfcp-watermark.image?)

然后访问下 <http://localhost:3000>

这时候你会发现代码在断点处断住了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e245746530145f298811a224c59756c~tplv-k3u1fbpfcp-watermark.image?)

可以看到代码的整个执行路线：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b498721bcd354d258c08135f1022aea6~tplv-k3u1fbpfcp-watermark.image?)

这样，就可以调试 nest 项目了。

但是这样调试还是太麻烦，我们一般在 VSCode 里写代码，能不能直接在 VSCode 里边写代码边调试呢？

当然是可以的。

VSCode 也实现了 Debugger 的客户端。

点击调试面板的 create launch.json file，它会创建 .vscode/launch.json 的调试配置文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/541ac1195d0643789f05b1751ad27d71~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78bc8144014b43a2a048f12e27b4e8d4~tplv-k3u1fbpfcp-watermark.image?)

然后输入 node，快速创建一个 node 调试配置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da1e7bb4b6424696befb7383ff9ae035~tplv-k3u1fbpfcp-watermark.image?)

我们先调试下前面那个 index.js 文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0700c7834864508b37671f89b352ddb~tplv-k3u1fbpfcp-watermark.image?)

stopOnEntry 是在首行断住，和 --inspect-brk 一样的效果。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/022601d2f94b4bb6a971ad223a76dd16~tplv-k3u1fbpfcp-watermark.image?)

这样，就可以在 vscode 里调试 node 代码了。

在 vscode 里调试代码，最爽的是可以边改代码边调试。

比如你调试的过程中修改了代码，然后点击重新调试，就可以马上看到改动之后的效果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be09f4fc43d34bc495017b1772f754fb~tplv-k3u1fbpfcp-watermark.image?)

调试体验就很棒！

nest 自然也可以这样调试：

还是 nest start --debug 来启动 nest 服务：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e42a6dcf256d4afdbab003c0cdf36533~tplv-k3u1fbpfcp-watermark.image?)

添加一个 attach 类型的调试配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11ac920d5e2b404f9c208515bc754952~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/276a82c43f8749d587d12df02c9281c1~tplv-k3u1fbpfcp-watermark.image?)

然后在 controller 里打个断点，访问 <http://localhost:3000>

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d7ddd8570424d9595bced0c9de12124~tplv-k3u1fbpfcp-watermark.image?)

代码同样会在断点处断住。

这样就可以直接在 vscode 里打断点了。

不过如果是用 VSCode 调试，可以不用 nest start --debug，有更简便的方式：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/665a71a9a9c34dfa94a01a750c614152~tplv-k3u1fbpfcp-watermark.image?)

创建 npm scripts 的调试配置：

（如果创建出的调试配置 type 是 pwa-node 也可以，和 node 类型差不多，据说 pwa-node 功能多一点）

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

和我们命令行执行 npm run start:dev 一样。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7deaeb270bd4b86b91d4678079dbfba~tplv-k3u1fbpfcp-watermark.image?)

这里的 runtimeExecutable 代表执行什么命令，args 传参数。

要指定 console 为 integratedTerminal，也就是用 vscode 的内置终端来打印日志，不然默认会用 debug console 跑，那个没有颜色：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/472522d9bd1c4ca1b29aaa37653fff5c~tplv-k3u1fbpfcp-watermark.image?)

点击调试模式启动：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a5fab63d75b4cf6beafeddaf7afc597~tplv-k3u1fbpfcp-watermark.image?)

然后浏览器访问 <http://localhost:3000>

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b152079795134165bd9c0acc235eb38f~tplv-k3u1fbpfcp-watermark.image?)

代码同样会在断点处断住。

这是最方便的调试 nest 项目的方式。

最后，介绍几种断点的类型，也是挺常用的：

有的时候只想打印日志，不想断住，又不想加 console.log 污染代码，这时候可以用 logpoint：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/344268ffabc14dd49d3c7aa0c2cc1fce~tplv-k3u1fbpfcp-watermark.image?)

右键选择 logpoint：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f583cc4130264d31a6712b2c1e04106d~tplv-k3u1fbpfcp-watermark.image?)

输入打印的信息，变量用 {} 包裹。

代码执行到这里就会打印：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4aea40c7ad2944fea65bc19c6470d1da~tplv-k3u1fbpfcp-watermark.image?)

这样适合不需要断住，但想打印日志的情况。不用在代码里加 console.log。

再就是条件断点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae6ba8c9fefa4224a0885080fb8e67b7~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26d3656eae6843968d9b92e174f77467~tplv-k3u1fbpfcp-watermark.image?)

表达式成立才会断住。

再就是异常断点，可以在没有处理的异常处自动断住：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dca459750454907969d3c9ec2343b07~tplv-k3u1fbpfcp-watermark.image?)

这些断点类型只要有个印象，用到的时候能想起来就行。

## 总结

复杂的代码需要用断点调试查看调用栈和作用域，也就是代码的执行路线，然后单步执行。

node 代码可以加上 --inspect 或者 --inspect-brk 启动调试 ws 服务，然后用 Chrome DevTools 或者 vscode debugger 连上来调试。

nest 项目的调试也是 node 调试，可以使用 nest start --debug 启动 ws 服务，然后在 vscode 里 attach 上来调试，也可以添加个调试配置来运行 npm run start:dev。

nest 项目最方便的调试方式还是在 VSCode 里添加 npm run start:dev 的调试配置。

此外，我们还理解了 logpoint、条件断点、异常断点等断点类型。

学会了 nest 项目的调试，就可以直接在代码里打断点了。
