上节我们知道了什么是调试、调试的原理，这节我们开始学习调试工具的使用。

首先从网页的 JS 调试开始。

我们以 React 项目为例，用 create-react-app 创建一个 react 项目：

```
yarn create react-app test-react-debug
```

进入项目目录，执行 `npm run start`。

它会启动一个开发服务，然后浏览器访问 localhost:3000：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f382cdf8229942f78d7fc6df8a177ac0~tplv-k3u1fbpfcp-watermark.image?)

打开 Chrome DevTools，在 Sources 面板找到 src/index.js，打上个断点：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45646ebb9946450c89ab642cd1859b0f~tplv-k3u1fbpfcp-watermark.image?)

然后刷新就可以开始调试了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98282c6e246344d3b391df2b30bb8970~tplv-k3u1fbpfcp-watermark.image?)

代码会在断点处断住，右边会显示当前 local 作用域的变量，global 作用域的变量，还有调用栈 call stack。


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c621e583a59f49d2b03676fafeff802f~tplv-k3u1fbpfcp-watermark.image?)

上面有几个控制执行的按钮，分别是：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ab439b27b914d44bf76570a586f124a~tplv-k3u1fbpfcp-watermark.image?) 恢复执行

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c1f19fb471b421bb5fa7fa4eef41f06~tplv-k3u1fbpfcp-watermark.image?) 单步执行

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59d6e0c72f154e7da1573e3f7d2e8ddc~tplv-k3u1fbpfcp-watermark.image?) 进入函数调用

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a0b3f9e006f47ce9b718af53346eeb3~tplv-k3u1fbpfcp-watermark.image?) 跳出函数调用


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3347871bccf14e8c969497123d6c19a8~tplv-k3u1fbpfcp-watermark.image?) 让断点失效

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25142f8e065648c6a69a723c554942f9~tplv-k3u1fbpfcp-watermark.image?) 在异常处断住

**可以控制代码的执行，可以看到每一步的调用栈和作用域的变量，那理清代码的逻辑，或者排查代码中的问题不就很容易了么？**

其实调试网页的 JS，除了 Chrome DevTools 外，还有一种更好用的调试方式： VSCode Debugger。

用 VSCode 打开项目目录，创建 .vscode/launch.json 文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e15a51f283d4ab999877fe8a111e0ef~tplv-k3u1fbpfcp-watermark.image?)

点击右下角的 Add Configuration... 按钮，选择 Chrome: Launch

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e42aeb0f8d44e17964bc1ae03697bbc~tplv-k3u1fbpfcp-watermark.image?)

把访问的 url 改为开发服务器启动的地址：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d04afc87154d49a194f0d7e210c53ca4~tplv-k3u1fbpfcp-watermark.image?)

然后进入 Debug 窗口，点击启动：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be97e02241c44f03a6e585d3053c3515~tplv-k3u1fbpfcp-watermark.image?)

你会发现它启动了浏览器，并打开了这个 url：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c9a18b192b447b99494918017c50e95~tplv-k3u1fbpfcp-watermark.image?)

VSCode 里还会有一排控制执行的按钮：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17525adcff2640d4b646afe99ad0fb61~tplv-k3u1fbpfcp-watermark.image?)

在代码打个断点，然后点击 ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/437daa8d0a9d44fca3e3041ca0581725~tplv-k3u1fbpfcp-watermark.image?)
 刷新：
 
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/988fb24839fe41f48a85b504373594da~tplv-k3u1fbpfcp-watermark.image?)

代码会执行到断点处断住，本地和全局作用域的变量，调用栈等都会展示在左边：


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4a1b14004614cd9915571bae0eeb17b~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6985b9d252af4aff97fc92cb9ba289de~tplv-k3u1fbpfcp-watermark.image?)

上面的控制按钮分别对应恢复执行、单步执行、进入函数调用、跳出函数调用，这个和 Chrome DevTools 一样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95f8908e4f3c404c9b1ec8877db636f1~tplv-k3u1fbpfcp-watermark.image?)

还多了刷新和停止的按钮。

那异常断点的按钮呢？

被移到了这里：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/967c7706bf144cefbf3e854d17aa6513~tplv-k3u1fbpfcp-watermark.image?)

可以在被 catch 的异常处断住，也可以在没有被 catch 的异常处断住。

看起来和 Chrome DevTools 里调试差不多呀，在 VSCode Debugger 里调试有啥好处么？

好处是不用切换工具呀，之前是调试在 Chrome DevTools，写代码在 VSCode，而现在写代码和调试都可以在 VSCode 里，可以边调试边写代码。

比如我想访问 this 的某个属性，可以在 Debug Console 里输入 this 看下它的值，然后再来写代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/622cf32201f04a4e83d1f814812482f5~tplv-k3u1fbpfcp-watermark.image?)

如果你用了 TypeScript 可能会有属性名的提示、属性值类型的提示，但并不知道属性的值是啥。

而边调试边写代码，能直接知道属性值是什么，有哪些函数可以调用。

**边调试边写代码是我推荐的写代码方式。**

知道了怎么用，我们再来思考下：为什么 Chrome DevTools 和 VSCode Debugger 都可以调试网页呢？

这是因为调试协议是一样的，都是 CDP。Chrome DevTools 可以对接 CDP 来调试网页，VSCode Debugger 也可以。只不过 VSCode Debugger 会多一层 Debug Adapter Protocol 的转换。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbbc48aafc4c48958a9bc952e6645329~tplv-k3u1fbpfcp-watermark.image?)

这也是为什么两个调试工具的功能大同小异。

## 总结

Chrome DevTools 和 VSCode Debugger 都能调试网页的 JS，可以打断点，单步执行，可以看到本地和全局作用域的变量，还有函数调用栈。

但我更推荐使用 VSCode Debugger 来调试，这样写代码和调试都用同一个工具，不用切换，而且还可以边调试边写代码。

这俩原理都是对接了 Chrome DevTools Protocol，用自己的 UI 来做展示和交互。

如果你还没用过 VSCode Debugger，不妨就从今天开始用起来吧。
