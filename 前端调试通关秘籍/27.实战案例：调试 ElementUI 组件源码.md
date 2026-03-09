上节写了怎么调试 antd 的源码，但很多小伙伴是写 Vue 的，可能平时用的是 Element UI 的组件库，所以这节就来讲下怎么调试 Element UI 的源码。

首先，我们用 Vue CLI（用 vue cli5） 创建一个 vue2 的项目：

```
yarn global add @vue/cli

vue create element-vue-test
```

创建成功后，进入到项目目录

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d67cdbcdd6cc4512a14d6ed204de26cd~tplv-k3u1fbpfcp-watermark.image?)

安装 element ui 的库，并在入口引入：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32f21e02b9044ccfaa6debfe96f38779~tplv-k3u1fbpfcp-watermark.image?)

然后在 App.vue 里用一下 button 组件

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd5a2477221f4f55888e1d1460c386ce~tplv-k3u1fbpfcp-watermark.image?)

之后 yarn run serve 把开发服务跑起来，就可以看到这样的页面：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a178d9519fa4400186a9c8474156fdd9~tplv-k3u1fbpfcp-watermark.image?)

Element UI 的组件正确的显示了。

接下来调试 button 组件的源码，那问题来了，我怎么知道在哪里打断点呢？

我们可以知道的是，这个 button 会处理点击事件，但是却不知道事件处理函数的代码在什么地方。

这种情况可以加一个事件断点：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c16527387c14f5f89f74082ee2dee90~tplv-k3u1fbpfcp-watermark.image?)

在 sources 面板的 Event Listener Breakponts 里勾选 Mouse 的 click 事件，也就是在所有 click 事件的处理函数处断住。

然后你再点下那个按钮试试看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d9259281a654640905b589957f6f9e4~tplv-k3u1fbpfcp-watermark.image?)

你会发现它在事件处理函数处断住了。

当你知道这个组件处理了什么事件，但却不知道事件处理函数在哪的时候就可以用事件断点。

当然，这个事件处理函数并不是组件里的，因为 Vue 内部会先做一些处理，然后再交给组件处理。

所以，我们要先走到组件的事件处理函数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87fc57a2e2304f0eb3719b6f5bda832b~tplv-k3u1fbpfcp-watermark.image?)

单步执行、再进入函数内部，再单步执行、再进入函数内部，代码就会走到组件的事件处理函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e93b3bb4e3ea44199155923ff916623c~tplv-k3u1fbpfcp-watermark.image?)

methods、computed、props，这明显是源码里的了。但你再往上走两步，会发现又不是最初的源码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f100a5b72a6e49cabd4d6c03c71c90e6~tplv-k3u1fbpfcp-watermark.image?)

template 变成了 render 函数，而且还有其他组件的代码，这明显是被编译打包之后的代码。

从文件名也可以看出来：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e5ce7f055294cf09035b22b7b1f6bcc~tplv-k3u1fbpfcp-watermark.image?)

这是一个把所有组件代码编译后打包到一起的文件。

这样虽然也能调试，但肯定是不爽的，能不能直接调试组件最初的源码呢？就是带 template 的单文件组件那种？

是可以的，这就要用到 sourcemap 了。

sourcemap 是在编译过程中产生的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0723a3baff44e9aa41673f3b228f8d5~tplv-k3u1fbpfcp-watermark.image?)

里面记录了目标代码和源代码的映射关系，调试的时候可以通过它映射回源码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07f64c05cba545428d4b4a0cb1fd7a7c~tplv-k3u1fbpfcp-watermark.image?)

但是你去 node_modules 下看看，会发现没有这个文件的 sourcemap：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28fa642fe63342fba5d3d47b1d5d2d7c~tplv-k3u1fbpfcp-watermark.image?)

那怎么生成它的 sourcemap 呢？

这就要从源码重新编译了。

我们从 github 把它的源码下载下来：

```
git clone --depth=1 --single-branch git@github.com:ElemeFE/element.git
```

--depth=1 是只下载单个 commit，--single-branch 是下载单个 branch，这样下载速度能快几十倍，是一个加速小技巧。

进入 element 目录，安装依赖，你会遇到一个前端经常头疼的问题，node-sass 安装报错了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1196e4e8f8d4e02bf2b83d03e871c05~tplv-k3u1fbpfcp-watermark.image?)

这个问题的解决方案就是把 node 版本切换到 node-sass 版本对应的那个。

package.json 中可以看到 node-sass 是 4.11.0

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf4276f32f424f528c28eca5a2caec55~tplv-k3u1fbpfcp-watermark.image?)

打开 node-sass 的 github 首页：

你会看到这样一个版本对应关系表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc73f359adce40eaa8b48ed353d9ef9e~tplv-k3u1fbpfcp-watermark.image?)

4.11 对应 node11，那就把 node 切换到 11 就可以了。

然后再次 yarn 安装依赖就能成功了。

之后开始编译，在 npm scripts 中可以找到 dist 命令，这就是构建源码用的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71c358e9e00845449dfcc41753ab0491~tplv-k3u1fbpfcp-watermark.image?)

但是我们只需要 element-ui.common.js 这个文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b427dd52a9a543528e5fccb8792a83ac~tplv-k3u1fbpfcp-watermark.image?)

其实只需要执行其中的一部分脚本，也就是这个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e86d312ef9f49d8ab38841b4916b26f~tplv-k3u1fbpfcp-watermark.image?)

所以在项目下执行 npx webpack --config build/webpack.common.js 即可：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/538d1089cab140f182940ab0a4f73b2d~tplv-k3u1fbpfcp-watermark.image?)

然后在 lib 下就可以看到构建产物：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/788f99ce7fcc4c5d8eaa7736eceb2e51~tplv-k3u1fbpfcp-watermark.image?)

但我们的目标是生成带有 source-map 的代码，所以要改下配置：

修改 build/webpack.common.js，配置 devtool 为 cheap-module-source-map：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6c167e20a6f4b0aa11c36e87d1433e4~tplv-k3u1fbpfcp-watermark.image?)

source-map 是生成 sourcemap 并关联，也就是这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1002b8dfdd9043eca35808af08b91845~tplv-k3u1fbpfcp-watermark.image?)

module 是把中间 loader 产生的 sourcemap 也给合并到最终的 sourcemap 里，这样才能直接映射到源码。

cheap 是加快编译速度用的，只保留行的映射信息。

改完配置后再次 npx webpack --config build/webpack.common.js，就可以看到带有 sourcemap 的产物了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a294a2d2c05e45f0a6d4eb1d31a07f01~tplv-k3u1fbpfcp-watermark.image?)

把这俩文件复制到测试项目的 node_modules/element-ui 下覆盖下之前的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a418b72cd8ad4574b7bb3f1527e57b0f~tplv-k3u1fbpfcp-watermark.image?)

devtool 设置为 source-map:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b272455838cf436ab95a30b4076d31f0~tplv-k3u1fbpfcp-watermark.image?)

之后清掉 node_modules/.cache 下的缓存，重新跑 dev server：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07cdb707c8c342ffb5009b79bb530582~tplv-k3u1fbpfcp-watermark.image?)

这时会报错提示你 node 版本太低了，你需要再把 node 版本换回来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33d569e6e5114458814c6211b36f0cdc~tplv-k3u1fbpfcp-watermark.image?)

跑起开发服务之后，再次用之前的方式调试 button 组件的源码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/016ec8292bf44c6bb1e08fe8263910d0~tplv-k3u1fbpfcp-watermark.image?)

你会发现现在的组件代码是带 template 语法的单文件组件的代码了！

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86839b26517b4f9ea63ac4f7180a7c8e~tplv-k3u1fbpfcp-watermark.image?)

这就是 sourcemap 的作用。

之后你会可以在这个组件里打断点然后调试。

有的同学可能会问，通过事件断点进入组件内部，这样有点麻烦，有没有更简单的方式？而且 button 组件有点击事件，但有的组件没有呀，这些组件该怎么调试呢？

确实，有了 sourcemap 之后就有更简单的调试方式了。

你可以在 sources 左边看到 ELEMENT 目录下有很多 vue 文件，这其实就是 Chrome DevTools 解析 sourcemap 之后列在这里的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db97f6a46c0d44cf8951cae15fe832d3~tplv-k3u1fbpfcp-watermark.image?)

你可以直接在里面打断点调试。

比如我们加一个 tabs 组件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/488992edd28647a59601caf8501c75f9~tplv-k3u1fbpfcp-watermark.image?)

把前面添加的那个事件断点去掉，在代码里手动打一个断点：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db63f9e63c804dfeb9ec1d2507bc08c7~tplv-k3u1fbpfcp-watermark.image?)

然后你就会发现，这样就可以调试 Element UI 组件源码了！

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d002e966ffc640849b940f4cae20827c~tplv-k3u1fbpfcp-watermark.image?)

当然，有的组件找不到的时候，还是可以通过事件断点的方式来进入组件内部。

我们是通过 Chrome DevTools 调试的，其实用 VSCode Debugger 来调试它也是一样的，在 Chrome DevTools 里打的断点，在 VSCode Debugger 里同样会断住。

## 总结

这节我们调试了 Element UI 的源码。

定位到组件的代码，是通过事件断点的方式，因为我们知道它触发了什么事件，但却不知道事件处理函数在哪。

但是组件的代码是被编译打包过的，不是最初的源码。

为了调试最初的源码，我们下载了 Element UI 的代码，build 出了一份带有 sourcemap 的代码。

覆盖项目 node_modules 下的代码，重新跑 dev server，这时候就可以直接调试组件源码了。

有了 sourcemap 之后，Chrome DevTools 会直接把 vue 文件列在 sources 里，我们可以找到对应的 vue 文件来打断点，就不用通过事件断点来找了。

能够调试 Element UI 源码之后，想知道组件内部都有哪些逻辑的话，就可以直接在源码断点调试了，就很香。
