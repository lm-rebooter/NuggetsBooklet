前面我们学过如何调试 Nest 项目，那如何调试 Nest 源码呢？

有的同学说，调试 Nest 项目的时候，调用栈里不就有源码部分么？

其实不是的，这部分是编译后的代码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc2bacca10b44fabb6a48e83ae6636fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200&h=650&s=130898&e=png&b=29292a)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bf49198bf7242a09fd50641f901ec2a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2316&h=1060&s=447155&e=png&b=1f1f1f)

我们新建个 Nest 项目：

```
nest new debug-nest-source
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d41d5bfd38849aab63b4924548e298d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=636&s=269487&e=png&b=010101)

点击 debug 面板的 create a launch.json file按钮：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29487c1eaef442cabe547842ee396993~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=618&s=70481&e=png&b=191919)

输入 npm，选择 launch via npm，创建一个调试 npm scripts 的配置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a58c3a71d99f4627b5d046366dffad52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=774&s=411894&e=gif&f=27&b=222222)

改为这样：

```json
{
    "name": "Launch via NPM",
    "request": "launch",
    "runtimeArgs": [
        "run-script",
        "start:dev"
    ],
    "runtimeExecutable": "npm",
    "console": "integratedTerminal",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "type": "node"
}
```

这个就是跑 npm run start:dev 的调试配置。

指定 console 为 integratedTerminal，这样日志会输出在 terminal。

不然，日志会输出在 debug console。颜色等都不一样：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ca1d191d02a4a038e1f0f8a0ac7ace1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=306&s=45124&e=png&b=181818)

在 AppController 的 getHello 打个断点：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/174028b51d744df5b0b7ddd2a54486b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=582&s=102402&e=png&b=1f1f1f)

点击 debug 启动：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/766932185fd94fa5ba6c15afd69ece47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2088&h=1334&s=585171&e=gif&f=34&b=1b1b1b)

然后浏览器重新访问 http://localhost:3000

这时候代码就会在断点处断住：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f967d940585c4b14a9a2831babc1e1bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1936&h=1120&s=350562&e=png&b=1b1b1b)

这样就可以断点调试 Nest 项目了。

但如果想调试源码，还需要再做一步：

因为现在调用栈里的 Nest 源码部分都是编译后的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc2bacca10b44fabb6a48e83ae6636fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200&h=650&s=130898&e=png&b=29292a)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bf49198bf7242a09fd50641f901ec2a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2316&h=1060&s=447155&e=png&b=1f1f1f)

我们想调试 Nest 的 ts 源码，这就需要用到 sourcemap 了。

用 npm install 下载的包没有 sourcemap 的代码，想要 sourcemap，需要自己 build 源码。

把 Nest 项目下载下来，并安装依赖（加个 --depth=1 是下载单 commit，--single-branch 是下载单个分支，这样速度会快很多）：

```
git clone --depth=1 --single-branch https://github.com/nestjs/nest
```
build 下：
```
npm install
npm run build
```
会在 node_modules/@nestjs 下生成编译后的代码。

看下 npm scripts：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d489d0306b648aba18e3cb3a5bb4d84~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74e417c52bd849bc86bed2bcf9277dde~tplv-k3u1fbpfcp-watermark.image?)

可以看到它做的事情就是 tsc 编译代码，然后把编译后的文件移动到 node_modules/@nestjs 目录下。

move 的具体实现可以看 tools/gulp/tasks/move.ts 的代码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfedccfc74e3406fae4b16bed4e6c2c4~tplv-k3u1fbpfcp-watermark.image?)

所以，执行 npm run build，你就会在 node_modules/@nestjs 下看到这样的代码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4d8cee11f2c43bfa2c1ef43309d1f26~tplv-k3u1fbpfcp-watermark.image?)

只包含了 js 和 ts，没有 sourcemap：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79e9d0095df14da5a87825a47863a9d6~tplv-k3u1fbpfcp-watermark.image?)

生成 sourcemap 需要改下 tsc 编译配置，也就是 packages/tsconfig.build.json 文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be584d47dc08439989bcb5a168ebeefe~tplv-k3u1fbpfcp-watermark.image?)

设置 sourceMap 为 true 也就是生成 sourcemap，但默认的 sourcemap 里不包含内联的源码，也就是 sourcesContent 部分，需要设置 inlineSources 来包含。

再次执行 npm run build，就会生成带有 sourcemap 的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d988797ac7ea4b028eab5101fe79da36~tplv-k3u1fbpfcp-watermark.image?)

并且 sourcemap 是内联了源码的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea66020f83e34f03ae1325b6a94d05a1~tplv-k3u1fbpfcp-watermark.image?)

然后我们跑一下 Nest 的项目，直接跑 samples 目录下的项目即可，这是 Nest 内置的一些案例项目：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/903e5b83481846d883771b742d7d6160~tplv-k3u1fbpfcp-watermark.image?)

进入 01-cats-app 目录，安装依赖

```
npm install
```
然后把根目录 node_modules 下生成的代码覆盖下 cats 项目的 node_modules 下的代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a247da392ce04a8bb5337cdc163faff6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1408&h=816&s=366457&e=png&b=fcfbfb)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48106b06653a4e39985d6a087bbbf586~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=722&s=355032&e=png&b=f5f3f2)

创建一个调试配置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29487c1eaef442cabe547842ee396993~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=618&s=70481&e=png&b=191919)

改成这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0afe8030d89546d9866d5c4d9cebf7ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=816&s=113822&e=png&b=1f1f1f)

```json
{
    "name": "调试 nest 源码",
    "request": "launch",
    "runtimeArgs": [
        "run-script",
        "start:dev"
    ],
    "runtimeExecutable": "npm",
    "console": "integratedTerminal",
    "cwd": "${workspaceFolder}/sample/01-cats-app/",
    "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        // "!**/node_modules/**"
    ],
    "skipFiles": [
        "<node_internals>/**"
    ],
    "type": "node"
}
```
指定 cwd 为那个项目的目录，也就是在那个目录下执行 npm run start:dev。

resolveSourceMapLocations 是从哪里找 sourcemap，默认排除掉了 node_modules，我们把它去掉。

在 sample/01-cats-app 的 src/cats/cats.controller.ts 打个断点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b5811867a9348a4b4ebc7215467ec53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1476&h=748&s=193932&e=png&b=1d1d1d)

然后点击 debug 调试：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8948726d03ee4de49cfe09848a069ca4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1888&h=1476&s=474869&e=png&b=1a1a1a)

如果提示端口被占用，你需要先 kill 掉之前的进程再跑：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/999f5d949a5346e7bcd09aeca3f934e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334&h=184&s=57323&e=png&b=181818)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba62f9b397944abab96f8d539a7d1a5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=646&h=466&s=79681&e=png&b=191919)

浏览器访问 http://localhost:3000/cats

断住之后你看下调用栈：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/215301ff39224b57a11c4f7956292b1c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2104&h=1198&s=558249&e=png&b=1a1a1a)

这时候 sourcemap 就生效了，可以看到调用栈中的就是 Nest 的 ts 源码。

这样就可以调试 Nest 源码了。

比如我们看下 Nest 的 AOP 部分的源码：

点击这个调用栈：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16875e97dd234dad83f4e704b5889638~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2318&h=844&s=432529&e=png&b=1d1d1d)

可以看到它先创建了所有的 pipes、interceptors、guards 的实例，然后封装了调用 pipe 和 guard 的函数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d0ee28fc8bc44d7a79c782afa0feba7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=1062&s=143708&e=png&b=1f1f1f)

下面调用 hander 的时候，先调用 guard、再调用 interceptor，然后调用 handler，并且 handler 里会先用 pipe 处理参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa5b7dd0493342e19b16c114b74e91f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=828&s=163438&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/448b1b43372f4c9890b845d0a8c56305~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=400&s=74698&e=png&b=202020)

这就是 AOP 机制的源码。

而如果你想在你的项目里调试 Nest 源码，只要把 node_modules/@nestjs 覆盖你项目下那个就好了。

## 总结

这节我们学习了如何调试 Nest 源码。

vscode 里创建 npm scripts 的调试配置，就可以调试 npm run start:dev 的服务。

但如果想调试源码，需要把 Nest  源码下载下来，build 出一份带有 sourcemap 版本的代码。

同时还要设置 resolveSourcemapLocations 去掉排除 node_modules 的配置。

然后再调试，就可以直接调试 Nest 的 ts 源码了。

我们调试了下 AOP 部分的源码，以后你对哪部分的实现原理感兴趣，也可以自己调试源码了。
