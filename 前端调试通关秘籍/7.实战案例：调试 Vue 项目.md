我们学了如何用 VSCode Debugger 调试网页，也过了一遍各种配置，并且学习了 sourcemap，这节我们实战一下。

前面调试了 React 项目，这节来调试下 Vue 项目。

Vue 项目的创建有两种方式：

- 用 @vue/cli 创建的 webpack 作为构建工具的项目
- 用 create-vue 创建的 vite 作为构建工具的项目

我们分别来看一下：

## 调试 @vue/cli 创建的 webpack 项目

首先安装 @vue/cli：
```
yarn global add @vue/cli
```
然后执行 vue create vue-demo1 创建 vue 项目：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b62a31fc5f64a569264aba7d78815b0~tplv-k3u1fbpfcp-watermark.image?)

选择 vue3 的模版。

安装完之后进入到 vue-demo1 目录，执行 npm run serve 把开发服务跑起来。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db3c620078943afb6f0a8b7b6ed4891~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问，会看到渲染出的页面：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d54a9a51e7ad47a597544ad9ebd1527d~tplv-k3u1fbpfcp-watermark.image?)

然后我们进行调试：

点击调试窗口的 create a launch.json file 来创建调试配置文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/189a01024a7141e28edf126ffecc8959~tplv-k3u1fbpfcp-watermark.image?)

把 Chrome 调试配置的 url 改成目标 url 就可以进行调试了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86970e480e954d54b9944163d4014052~tplv-k3u1fbpfcp-watermark.image?)

点击 debug 启动，在 vue 组件里打个断点，你会发现断点没生效：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1a1b8ce835a4c32a9a50b6d03e09adf~tplv-k3u1fbpfcp-watermark.image?)

这是为什么呢？

我们先加个 debugger 来跑一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da1cf34d3ce740bda8083f9ecf4d9aaf~tplv-k3u1fbpfcp-watermark.image?)

然后在 Chrome DevTools 里看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0211b898a12418381fd263dbbbea788~tplv-k3u1fbpfcp-watermark.image?)

你会发现他从一个乱七八糟的路径，映射到了 webpack://vue-demo1/src/App.vue?11c4 的路径下。

然后在 VSCode Debugger 里看看这个路径：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88203c4ccad341df90fabbaf05d71039~tplv-k3u1fbpfcp-watermark.image?)

发现是 /Users/guang/code/vue-demo1/src/App.vue?91a0

本地明显没这个文件，所以就只读了。

其实这个路径已经做过了映射，就是完成了从 webpack:///vue-demo1/src/App.vue?11c4  到 /Users/guang/code/vue-demo1/src/App.vue?91a0 的映射。

看一下 sourceMapPathOverrides 默认这三条配置，很容易看出是最后一条做的映射：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e829bf7e73843448a98a3c79c03d2cb~tplv-k3u1fbpfcp-watermark.image?)

但问题就出现在后面多了一个 ?hash 的字符串，导致路径不对了。

那为什么会多这样一个 hash 呢？

这是因为 vue cli 默认的 devtool 设置是 eval-cheap-module-source-map，前面讲过，eval 是每个模块用 eval 包裹，并且通过 sourceURL 指定文件路径，通过 sourceMappingURL 指定 sourcemap。

在 Chrome DevTools 里点击下面的 source map from 的 url：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/626b7f1dce6848309cf28107ba7f7440~tplv-k3u1fbpfcp-watermark.image?)

你会发现先映射到了一个中间文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3a82a47aa8b4e44815d64b4e363fd62~tplv-k3u1fbpfcp-watermark.image?)

这个是被 eval 包裹并指定了 sourceURL 的模块代码，会被 Chrome DevTools 当作文件加到 sources 里。

这里有两个 sourceURL，第一个 sourceURL 在 sourceMappingURL 之前，这样 sourcemap 映射到的就是这个 url，也就是被 Chrome DevTools 当作文件的路径。而第二个 sourceURL 在之后，它可以修改当前文件的 url，也就是在调试工具里展示的路径。

然后再点击，会跳转回 bundle 的代码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a591047fe29493e9eb6768eb0a5ffd6~tplv-k3u1fbpfcp-watermark.image?)

这些被 eval 包裹的就是一个个的模块代码。

这些是上节讲过的内容，这样有啥问题么？

第一个 sourceURL 的路径是通过 [module] 指定的，而模块名后默认会带 ?hash：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fec04a23fec740d68528a558a5a39681~tplv-k3u1fbpfcp-watermark.image?)

所以想要去掉 hash 就不能用 eval 的方式。

所以我们修改下 webpack 的 devtool 配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a086ecd16ce247119ba04b6b5c160709~tplv-k3u1fbpfcp-watermark.image?)

从 eval-cheap-module-source-map 变为 source-map。

去掉 eval 是为了避免生成 ?hash 的路径，去掉 cheap 是为了保留列的映射，去掉 module 是因为这里不需要合并 loader 做的转换。

然后重启跑一下 dev server，再次调试：

这时你会发现之前不生效的断点现在能生效了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d9d97f68a9445348bfe8614b59d4f9e~tplv-k3u1fbpfcp-watermark.image?)

去 Chrome DevTools 里看一下，路径后也没有 ?hash 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2a27b4e35a04c20a9d5b974257fd9d3~tplv-k3u1fbpfcp-watermark.image?)

这样就能愉快的调试 vue3 的代码了。

如果你创建的是 vue2 项目，可能还要在 launch.json 的调试配置加这样一段映射（只保留这一条）：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe6b301421474232968872e968db0a49~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ca894b04331443ab33f6b4238d465e3~tplv-k3u1fbpfcp-watermark.image?)

```json
"sourceMapPathOverrides": {
    "webpack://你的项目名/src/*": "${workspaceFolder}/src/*"
}
```



这个项目名就是 project 的名字，你也可以在代码里打个断点，在 Chrome DevTools 里看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6016c4a110134a16b2c2c07119d5f101~tplv-k3u1fbpfcp-watermark.image?)

我们映射的目的就是把这个路径映射到本地目录。

如果你在 chrome devtools 里看到的路径没有项目名：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9793a25ccf7147aaa01f53f8f56211f4~tplv-k3u1fbpfcp-watermark.image?)

那就直接这样映射：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b3d584e32064cf2b43354b5e0c1e59b~tplv-k3u1fbpfcp-watermark.image?)

绝大多数情况下，这样样配就行了。

但有的项目可能 VSCode 还是没映射对，这时候你可以自己映射一下，打个断点看看在 Chrome DevTools 里是什么路径，然后看看本地是什么路径，配置对应的映射就好了。

知道了 vue cli 创建的 webpack 项目怎么调试，我们再来看下 create vue 创建的 vite 项目：

## 调试 create vue 创建的 vite 项目

[create vue](https://github.com/vuejs/create-vue) 是创建 vite 作为构建工具的 vue 项目的工具。

直接执行 npm init vue@3  即可：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90ab83f40a53423eb9886894b72b5cfa~tplv-k3u1fbpfcp-watermark.image?)

进入 vue-demo2 目录，执行安装，启动开发服务器：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/635d00fbe3274c6da105437f1a9409a2~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问，可以看到渲染出的页面：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b4ad45fb9a34048b84d73eb68ba109d~tplv-k3u1fbpfcp-watermark.image?)

我们添加一个调试配置如下：

```json
{
    "type": "chrome",
    "request": "launch",
    "name": "调试 vite 项目",
    "runtimeExecutable": "canary",
    "runtimeArgs": [
        "--auto-open-devtools-for-tabs"
    ],
    "userDataDir": false,
    "url": "http://localhost:5174",
    "webRoot": "${workspaceFolder}/aaa"
}
```

这里设置 userDataDir 为 false，是使用默认用户数据目录，不然 Vue DevTools 之类的插件就要再次安装了。

打个断点，然后 Debug 启动：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dab12e45eb904687a290cf56d8bc873e~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a41e90c22c674fdeb326b9355b2c2777~tplv-k3u1fbpfcp-watermark.image?)

我们找个 vue 文件打个断点：

修改下 HelloWorld.vue 的代码，然后打两个断点：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9af916ffb1664f64b878efa62d139dd2~tplv-k3u1fbpfcp-watermark.image?)

重新启动调试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c172d32febc4563beb062746f2fd862~tplv-k3u1fbpfcp-watermark.image?)


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7086665ed330493e8dfe0153ec0e07a8~tplv-k3u1fbpfcp-watermark.image?)

两个断点都能生效，代码也能直接修改。

还有，调试 @vue/cli 创建的项目时，我们还映射了下 sourcemap 的 path，为啥 create vue 的项目就不需要了呢？

看下 sourcemap 到的文件路径就知道了：

运行的代码文件的路径是：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c53edd7c17504af1b2014d4eb2beb31e~tplv-k3u1fbpfcp-watermark.image?)

sourcemap 到的文件路径是：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da1ef8ef71e94acd84e2b59964985f5c~tplv-k3u1fbpfcp-watermark.image?)

从 http://localhost:5174 后开始，把 /src/components/HelloWorld.vue 文件 sourcemap 到了 /Users/guang/code/vue-demo2/src/components/HelloWorld.vue

这已经能够对应到本地的文件了，自然也就不需要 sourceMapPathOverrides 的配置。

至此，create vue 创建的 vue 项目我们也知道怎么调试了。

有同学可能会问，为什么 webRoot 要配置成 ${workspaceFolder}/aaa 呢？

这个问题解释起来比较复杂，可以看下一节。

## 总结

这节我们调试了下 vue 项目。

vue 项目有两种创建方式，@vue/cli 和 create vue，分别是创建 webpack 和 vite 作为构建工具的项目。

vue cli 创建的项目，默认情况下打断点不生效，这是因为文件路径后带了 ?hash，这是默认的 eval-cheap-module-source-map 的 devtool 配置导致的，去掉 eval，改为 source-map 即可。

create vue 创建的 vite 做为构建工具的项目 sourcemap 到的路径直接就是本地的路径了，更简单一些。但是会有一些文件被错误映射到源码的问题，需要设置下 webRoot。

学会了 vue 项目的调试，接下来就可以愉快的边调试边写代码了。


