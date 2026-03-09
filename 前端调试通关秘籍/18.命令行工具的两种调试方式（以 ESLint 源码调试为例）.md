前端的命令行工具太多了，比如 webpack、vite、babel、tsc、eslint 等等，每天我们都会用各种命令行工具。

这些命令行工具都提供了两种入口：命令行和 api。

平时用我们会通过命令行的方式，比如 eslint xxx --fix，但是别的工具集成这些工具的时候就会使用 api 了，它更灵活。

所以，调试这些工具的时候也就有两种方式，通过命令行调试和通过 api 调试。

这节我们以 eslint 为例子来试下两种调试方式，大家可以跟着调试一下。

## 命令行的方式调试 ESLint 源码

我们创建一个 index.js 文件

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c58b822e87b544479b5c33ead9988737~tplv-k3u1fbpfcp-watermark.image?)

配置下 .eslintrc

```javascript
module.exports = {
  extends: 'standard'
}
```
安装 eslint，然后执行 npx eslint ./index.js 会看到这样的报错：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c10696d17d514234ab0fd12949f59c01~tplv-k3u1fbpfcp-watermark.image?)

后面三个错误都是格式错误，eslint 可以修复。

执行 npx eslint ./index.js --fix 就会自动修复错误。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47a1df45a67a4410bce7d7cc9bef7f8a~tplv-k3u1fbpfcp-watermark.image?)

我们想探究下 fix 的原理，就要调试下源码了。

用命令行的方式调试的话，就要添加一个这样的调试配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be0be3c04f0149ca807899e54d151504~tplv-k3u1fbpfcp-watermark.image?)

```json
{
    "name": "eslint 调试",
    "program": "${workspaceFolder}/node_modules/.bin/eslint",
    "args": [
        "./index.js",
        "--fix"
    ],
    "skipFiles": [
        "<node_internals>/**"
    ],
    "console": "integratedTerminal",
    "cwd": "${workspaceFolder}",
    "request": "launch",
    "type": "node"
}
```
在 .bin 下找到 eslint 的文件打个断点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e54005a7e3b54ae8aa59d81783d34221~tplv-k3u1fbpfcp-watermark.image?)

然后调试启动：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f790ab09aecf458c8fdfc404943526ad~tplv-k3u1fbpfcp-watermark.image?)

代码执行到这里断住了。

你发现它引入了 lib/cli 的模块，然后再去那个模块里看一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4de3951537f74691854ec0575da835eb~tplv-k3u1fbpfcp-watermark.image?)

你会发现它创建了 ESLint 实例，然后调用了它的 lintFiles 方法。

点进去就会发现它调用了 executeOnFiles 方法：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e38ec491c9f46feba6f3b1cdb9ae467~tplv-k3u1fbpfcp-watermark.image?)

点击 step into 进入函数内部：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dd4200ef1724d5e8a936f20d1e79546~tplv-k3u1fbpfcp-watermark.image?)

然后点击 stop over 单步执行：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/868a515517bd42a591ebec20ec41dd73~tplv-k3u1fbpfcp-watermark.image?)

之后代码会走到 verifyText 的函数调用：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90ce3736642d475287df45d9e6fe65f9~tplv-k3u1fbpfcp-watermark.image?)

这就是实现 lint 的部分，因为它的返回值就是 lint 结果。

step into 进入这个函数，会执行到 verifyAndFix 的函数调用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2afb0f62883848dbb28cd00c69cfdee8~tplv-k3u1fbpfcp-watermark.image?)

继续 step into，然后单步执行。

这时候你发现了一个循环：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ec94dc414b04f00bdcccf431f1b4420~tplv-k3u1fbpfcp-watermark.image?)

每次都调用 verify 对传入的文本进行 lint：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da8cd46057d244989922ec4c07c40a52~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61704bcdf26247ce8efb40c3cd2dc19d~tplv-k3u1fbpfcp-watermark.image?)

返回的结果里包含了错误的信息和如何修复，就是把 range 范围的字符串替换成 text。

然后再调用 applyFixes 执行 fix 的修复。

我们分别看下如何 lint 的，以及如何 fix 的：

verify 部分调用了 _verifyWithoutProcessors：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4add14c991024b6c8fd5087d00079861~tplv-k3u1fbpfcp-watermark.image?)

单步执行你会发现会对文本做 parse，产生 AST：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95eb907c7ac848bba5a7a07b74ec21b9~tplv-k3u1fbpfcp-watermark.image?)

然后传入 AST，调用各种 rule 来实现检查，返回的结果就是 problem 的数组：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dcfd6a86ef24743ad35b2a7b3a30bdf~tplv-k3u1fbpfcp-watermark.image?)

具体调用插件的过程，大家可以调试下 runRules 这个方法，这里就不展开了。

然后拿到了 problems 和怎么 fix 的信息就可以执行自动修复了：

进入 applyFixes 方法，你会发现它会有个标记变量，默认为 false：

然后尝试修复，修复完设置为 true：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3966a02bea74e19bedb3d006c0e24a0~tplv-k3u1fbpfcp-watermark.image?)

具体修复的实现就是个字符串替换：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d981c6306f814daca4ed2c46b9e74502~tplv-k3u1fbpfcp-watermark.image?)

那为什么会有 remainingMessages，也就是剩下的错误，然后还要循环多次来修复呢？

有两个原因，一个是有的 problem 本身不支持 fix，没有 fix，那自然要把问题留下来：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f63011769d54a3caf9abf2f533f5b5d~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d0be01126754f0ebe0daf1e5e14951e~tplv-k3u1fbpfcp-watermark.image?)

还有一个原因是两个 fix 冲突了：

比如上一个 fix 修复完之后，最新的位置是 10，而下一个 fix 要求从 9 开始替换文本，那自然就不行了。所以这条 fix 就被留了下来：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72d7f500a61748329db02a01691e2e4c~tplv-k3u1fbpfcp-watermark.image?)

这也是为什么我们会看到这样一个循环：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db9b8e08a4d24b50b0fa842ce2feeb2b~tplv-k3u1fbpfcp-watermark.image?)

如果有 fix 冲突的话，也就是上次修复完的文本还有问题，那会重新 lint，然后再 fix。

当然，自动 fix 的次数也是有上限的，默认修复 10 次还没修复完就终止。

这就是 eslint 的实现原理：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17069ca8eb8a4ba093d6611a83e889e7~tplv-k3u1fbpfcp-watermark.image?)

lint 的实现是基于 AST，调用 rule 来做的检查。

fix 的实现就是字符串的替换，多个 fix 有冲突的话会循环多次修复。

我们通过命令行的方式实现了 ESLint 源码的调试，但其实这样有很多没必要的部分，比如我们知道前面的命令行参数的解析的流程。

如果我们知道它最终调用的是 lintText 的 api，那完全可以从 api 入口开始调试：

## api 的方式调试 ESLint 源码：

通过命令行的方式调试 ESLint 源码的时候，我们知道了 ESLint 会创建 ESLint 实例，然后调用 lintText 方法来对代码 lint。

那我们可以自己调用这些 api 来 lint。

.eslintrc 文件还是这样：

```javascript
module.exports = {
  extends: 'standard'
}
```
通过 api 的方式对这段代码进行 lint：

```javascript

const { ESLint } = require("eslint");

const engine = new ESLint({
    fix: false
});

(async function main() {
    const results = await engine.lintText(`
    function add (a, b) 
{
  return a + b
}
  `);
  
    console.log(results[0].output);
  
    const formatter = await engine.loadFormatter("stylish");
    const resultText = formatter.format(results);
    console.log(resultText);
  })();
```
返回的结果用 formatter 打印下。

首先直接 node 执行，可以看到打印出的错误和我们用命令行的方式是一样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb2448ebea3149db932f3ab415b09c99~tplv-k3u1fbpfcp-watermark.image?)

然后创建个 debug 配置来跑：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a05f416ef6ef47d9a3a3e62d7f4a3832~tplv-k3u1fbpfcp-watermark.image?)
```json
{
    "name": "调试 eslint api",
    "program": "${workspaceFolder}/api-test.js",
    "request": "launch",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "console": "integratedTerminal",
    "type": "pwa-node"
}
```
你可以直接从实现 lint 的部分开始调试，跳过了前面命令行参数解析的部分，这样更有针对性：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/543e551dd7a340daabd325d3d8019436~tplv-k3u1fbpfcp-watermark.image?)

之后的调试流程倒是和命令行的方式一样，就不展开了。

## 总结

命令行工具都有命令行和 api 两种入口，我们以 ESLint 源码的调试为例试了下两种调试方式。

api 的方式更精准一些，可以跳过命令行参数解析的部分，直接调试感兴趣的 api。

通过调试，我们知道了 ESLint 是通过 AST 实现的检查，具体检查是 rule 里做的，fix 的实现就是字符串替换，但因为多个 rule 的 fix 可能冲突，所以会循环来做，但最多循环 10 次

ESLint 源码的调试还是相对简单，因为没有经过编译，如果做了编译的话，那就需要 sourcemap 了。

