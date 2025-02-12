大家都用过组件库，react 流行的组件库有阿里的 ant-design、字节的 semi-design、arco-design 等。

那这些组件库都是怎么打包的呢？

我们自己写个组件库的话，怎么写打包逻辑呢？

这篇文章我们就来探究下。

新建一个项目：

```
mkdir component-lib-test

cd component-lib-test

npm init -y
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a80fb343ac5d41218392583cc99f115c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=894&h=658&s=134748&e=png&b=000000)

分别安装 ant-design、arco-design、semi-design

```
pnpm install antd

pnpm install @douyinfe/semi-ui

pnpm install @arco-design/web-react
```
npm、yarn 会把所有依赖铺平，看着比较乱。而 pnpm 不会，node_modules 下很清晰：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2518899cadff43fdb64faceedec43ee0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=392&h=284&s=23336&e=png&b=181818)

首先看下 antd，分为了 lib、es、dist 3 个目录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9d31fa31d0148ff8d2598bb3c14d5a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=414&h=360&s=25952&e=png&b=191919)

分别看下这三个目录的组件代码：

lib 下的组件是 commonjs 的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f56b42587074655afebf0a555b33981~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1764&h=910&s=415186&e=png&b=1d1d1d)

es 下的组件是 es module 的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9131c1971860413a8780a8f4f125a348~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1612&h=834&s=313225&e=png&b=1d1d1d)

dist 下的组件是 umd 的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d1c9f6af12d4d0fb72ea940c1a2fca3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1780&h=578&s=252241&e=png&b=1e1e1e)

然后在 package.json 里分别声明了 commonjs、esm、umd 还有类型的入口：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd5451ec3cec426abe12b886d54f2072~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=728&h=250&s=45287&e=png&b=1f1f1f)

这样，当你用 require 引入的就是 lib 下的组件，用 import 引入的就是 es 下的组件。

而直接 script 标签引入的就是 unpkg 下的组件。

再来看看 semi-design 的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/157ebd3a769d4f72a33047fbd695ae1a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=494&h=638&s=50362&e=png&b=1b1b1b)

也是一样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7715e7c48a944cf4a845ad77010ba470~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=882&h=472&s=84118&e=png&b=1f1f1f)

只不过多了个 css 目录。

antd 没有这个目录是因为它已经换成 css in js 的方案了，不需要单独引入 css 文件。

然后是 arco-design 的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5a97361868947e4b35e34d9be8522bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=516&h=550&s=46664&e=png&b=191919)

也是一样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b6d6297540244909e19c92e61a1a30e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=686&h=348&s=67527&e=png&b=202020)

同样是 lib、es、dist 3 个目录，同样是分别声明了 esm、commonjs、umd 的入口。

也就是说，组件库都是这样的，分别打包出 3 份代码（esm、commonjs、umd），然后在 package.json 里声明不同模块规范的入口。

那问题来了，如果我有一个 esm 的模块，怎么分别构建出 esm、commonjs、umd 的 3 份代码呢？

这个问题很容易回答。

umd 的代码用 webpack 打包就行。

esm 和 commonjs 的不用打包，只需要用 tsc 或者 babel 编译下就好了。

我们分别看下这三个组件库都是怎么做的：

先是 arco-design 的：

它的构建逻辑在 arco-cli 的 arco-scripts 下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f40fa37835947739ce6310737dee358~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=592&h=654&s=65474&e=png&b=1a1a1a)

看下这个 index.ts

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/464b9ddf94e54cad8e8572f1aa04a83b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150&h=1018&s=177210&e=png&b=1f1f1f)

分别有 build 3 种代码加上 build css 的方法。

我们分别看下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/599c297c759c44d5bbfc7f1bdd82ec3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=316&s=50919&e=png&b=202020)

esm 和 cjs 的编译它封装了一个 compileTS 的方法，然后传入不同的 type。

compileTS 里可以用 tsc 或者 babel 编译：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c882faab79824713b543cac586a9a692~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1352&h=350&s=88518&e=png&b=1f1f1f)

tsc 编译就是读取项目下的 tsconfig.json，然后 compile：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/544d9ed3a99e48449c3f3618ba086a60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=994&s=173674&e=png&b=1f1f1f)

babel 编译是基于内置配置，修改了下产物 modules 规范，然后编译：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9ff5c33f81b42938306db453d565c25~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=1194&s=240360&e=png&b=1f1f1f)

babelConfig 里配置了 typescript 和 jsx 的编译：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe52600ebb9844798f95095e947be7b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1332&h=798&s=170601&e=png&b=1f1f1f)

再就是 umd：

和我们分析的一样，确实是用 webpack 来打包：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deabc8d5960241e38238001735c996de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=324&s=60006&e=png&b=1f1f1f)

webpack 配置里可以看到，确实是为了 unpkg 准备的，用了 ts-loader 和 babel-loader：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4c31bb57f8d46b8882385014d999469~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1164&h=1132&s=204949&e=png&b=1f1f1f)

而 css 部分则是用了 less 编译：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc6883ed9ca540a193755ad088cd9e02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=338&s=73747&e=png&b=1f1f1f)

gulp 是用来组织编译任务的，可以让任务串行、并行的执行。

这里的 gulp.series 就是串行执行任务，而 gulp.parallel 则是并行。

所以说，那 3 种代码加上 css 文件是怎么打包的就很清晰了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2d58b5ec46c4a7198300816482e9296~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=838&s=58750&e=png&b=ffffff)

其中用到 gulp 只是用来组织编译任务的，可用可不用。

再来看下 semi-design 的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46d142b5319b424986b46903113028ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298&h=634&s=153578&e=png&b=1d1d1d)

它就没有单独分一个 xx-scripts 包了，直接在 semi-ui 的 scripts 目录下。

它也是用到了 gulp 来组织任务。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a98951609214496db0164e8b6e8ab50d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=580&s=108982&e=png&b=202020)

看下这个 compileLib 的 gulp task：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eed4837772aa4796ac8022d1ffa3d2c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=360&s=50444&e=png&b=1f1f1f)

这里的 compileTSXForESM 和 ForCJS 很明显就是编译组件到 esm 和 cjs 两种代码的。

先用了 tsc 编译再用了 babel 编译：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a362b4f31d464986b473b03216320f0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1290&h=730&s=242074&e=png&b=202020)

然后是 umd，也是用了 webpack：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cd9ced7af554c68aca8a33a189207f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=1066&s=182468&e=png&b=1f1f1f)

用了 babel-loader 和 ts-loader：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87ee46bf694e4e6c9b4036b981e70ab1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1272&h=1284&s=246860&e=png&b=1f1f1f)

最后是 scss 的编译：

semi-design 把所有组件的 scss 都放在了 semi-foundation 这个目录下来维护：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11215467f35a4e388189dde9d9689bbf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=528&h=908&s=78795&e=png&b=181818)

所以编译的时候就是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ad183672faf44a9b1963097df6e1482~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=878&s=188823&e=png&b=202020)

就是把 semi-foundation 这个目录下的所有 scss 编译后合并成了一个文件

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca98599a49f64196a76d3d7303a0cf86~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=528&s=94828&e=png&b=1f1f1f)

而 arco-design 的样式是在组件目录下维护的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64a91aeca77a40799523ecbff92e618e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=480&h=810&s=64623&e=png&b=1a1a1a)

这个倒是没啥大的区别，只是编译的时候改下源码目录就好了。

这就是 semi-design 的 esm、cjs、umd、scss 是如何编译打包的。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c382fd5d7ac42e48512926719eca0f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1222&h=762&s=60227&e=png&b=ffffff)

和 arco-design 的 scripts 区别大么？

不大，只不过没有单独做一个 xxx-scripts 的包，编译出 esm 和 cjs 代码用的是 tsc + babel，而且用的是 scss 不是 less 而已。

再来看看 ant-design 的：

它也是单独分了一个包来维护编译打包的 scripts，叫做 @ant-design/tools。

它也有个 gulpfile 定义了很多 task

比如 compile 的 task 是编译出 es 和 cjs 代码的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db8648376c0448199706830821956e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1564&h=670&s=186991&e=png&b=1e1e1e)

是不是很熟悉的感觉？

大家都是这么搞的。

它也是先用了 tsc 再用 babel 编译，最后输出到 es 或者 lib 目录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c363942819694561bacd19aad8defa25~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=618&s=108027&e=png&b=1f1f1f)

打包 umd 代码的时候也是用了 webpack：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32f22bd04278441abae85cdf9cfd3cb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=522&s=105861&e=png&b=202020)

只不过它这个 webpack 配置文件是读取的组件库项目目录下的，而不像 arco-design 那样是内置的。

这就是这三个组件库的编译打包的逻辑。

区别大么？

不大，甚至可以说几乎一模一样。

## 总结

我们分析了 ant-design、semi-design、arco-design 组件库的产物和编译打包逻辑。

它们都有 lib、es、dist 目录，分别放着 commonjs、es module、umd 规范的组件代码。

并且在 package.json 里用 main、module、unpkg 来声明了 3 种规范的入口。

从产物上来看，三个组件库都是差不多的。

然后我们分析了下编译打包的逻辑。

ant-design 和 acro-design 都是单独抽了一个放 scripts 的包，而 semi-design 没有。

它们编译 esm 和 cjs 代码都用了 babel 和 tsc 来编译，只不过 arco-design 是用 tsc 或者 babel 二选一，而 ant-design 和 semi-design 是先用 tsc 编译再用 babel 编译。

打包出 umd 的代码，三个组件库都是用的 webpack，只不过有的是把 webpack 配置内置了，有的是放在组件库项目目录下。

而样式部分，ant-design 是用 css-in-js 的运行时方案了，不需要编译，而 arco-design 用的 less，样式放组件目录下维护，semi-design 用的 scss，单独一个目录来放所有组件样式。

并且编译任务都是用的 gulp 来组织的，它可以串行、并行的执行一些任务。

虽然有一些细小的差别，但从整体上来看，这三大组件库的编译打包逻辑可以说是一模一样的。

写这样的 scripts 麻烦么？

并不麻烦，umd 部分的 webpack 打包大家都会，而 esm 和 cjs 用 babel 或者 tsc 编译也不难，至于 scss、less 部分，那个就更简单了。

所以编译打包并不是组件库的难点。

如果你要写一个组件库，也可以这样来写 scripts。
