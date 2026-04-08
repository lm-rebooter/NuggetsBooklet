### 本资源由 itjc8.com 收集整理
# 提升 webpack 的构建速度

我们的前端项目随着时间推移和业务发展，页面可能会越来越多，或者功能和业务代码会越来越多，又或者依赖的外部类库会越来越多，这个时候原本不足为道的 webpack 构建时间消耗就会慢慢地进入我们的视野。

构建消耗的时间变长了，如果是使用 CI 服务来做构建，大部分情况下我们无须等待，其实影响不大。但是本地的 webpack 开发环境服务启动时的速度和我们日常开发工作息息相关，在一些性能不是特别突出的设备上（例如便携式笔记本等等），启动时的长时间等待可能会让你越来越受不了。

笔者亲身经历的一个项目，使用 webpack 构建的时长可以达到 6 分钟左右，这种场景下，就算用 CI 服务，在遇见需要紧急发布修复问题时，也会让人很抓狂。所以这一小节我们来聊聊如何提升 webpack 的构建速度，也许某一天你负责的项目也会到了需要优化 webpack 构建性能的时候。

## 让 webpack 少干点活

提升 webpack 构建速度本质上就是想办法让 webpack 少干点活，活少了速度自然快了，尽量避免 webpack 去做一些不必要的事情。

### 减少 `resolve` 的解析

在前边第三小节我们详细介绍了 webpack 的 `resolve` 配置，如果我们可以精简 `resolve` 配置，让 webpack 在查询模块路径时尽可能快速地定位到需要的模块，不做额外的查询工作，那么 webpack 的构建速度也会快一些，下面举个例子，介绍如何在 `resolve` 这一块做优化：

```js
resolve: {
  modules: [
    path.resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
  ],

  // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
  // 其他文件可以在编码时指定后缀，如 import('./index.scss')
  extensions: [".js"], 

  // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度
  mainFiles: ['index'],
},
```

上述是可以从配置 `resolve` 下手提升 webpack 构建速度的配置例子。

我们在编码时，如果是使用我们自己本地的代码模块，尽可能编写完整的路径，避免使用目录名，如：`import './lib/slider/index.js'`，这样的代码既清晰易懂，webpack 也不用去多次查询来确定使用哪个文件，一步到位。

### 把 loader 应用的文件范围缩小

我们在使用 loader 的时候，尽可能把 loader 应用的文件范围缩小，只在最少数必须的代码模块中去使用必要的 loader，例如 node_modules 目录下的其他依赖类库文件，基本就是直接编译好可用的代码，无须再经过 loader 处理了：

```js
rules: [ 
  {
    test: /\.jsx?/,
    include: [ 
      path.resolve(__dirname, 'src'), 
      // 限定只在 src 目录下的 js/jsx 文件需要经 babel-loader 处理
      // 通常我们需要 loader 处理的文件都是存放在 src 目录
    ],
    use: 'babel-loader',
  },
  // ...
],
```

如上边这个例子，如果没有配置 `include`，所有的外部依赖模块都经过 Babel 处理的话，构建速度也是会收很大影响的。

### 减少 plugin 的消耗

webpack 的 plugin 会在构建的过程中加入其它的工作步骤，如果可以的话，适当地移除掉一些没有必要的 plugin。

这里再提一下 webpack 4.x 的 mode，区分 mode 会让 webpack 的构建更加有针对性，更加高效。例如当 mode 为 development 时，webpack 会避免使用一些提高应用代码加载性能的配置项，如 UglifyJsPlugin，ExtractTextPlugin 等，这样可以更快地启动开发环境的服务，而当 mode 为 production 时，webpack 会避免使用一些便于 debug 的配置，来提升构建时的速度，例如极其消耗性能的 Source Maps 支持。

### 换种方式处理图片

我们在前边的小节提到图片可以使用 webpack 的 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) 来压缩图片，在对 webpack 构建性能要求不高的时候，这样是一种很简便的处理方式，但是要考虑提高 webpack 构建速度时，这一块的处理就得重新考虑一下了，思考一下是否有必要在 webpack 每次构建时都处理一次图片压缩。

这里介绍一种解决思路，我们可以直接使用 [imagemin](https://github.com/imagemin/imagemin-cli) 来做图片压缩，编写简单的命令即可。然后使用 [pre-commit](https://github.com/observing/pre-commit) 这个类库来配置对应的命令，使其在 `git commit` 的时候触发，并且将要提交的文件替换为压缩后的文件。

这样提交到代码仓库的图片就已经是压缩好的了，以后在项目中再次使用到的这些图片就无需再进行压缩处理了，image-webpack-loader 也就没有必要了。

## 使用 DLLPlugin

[DLLPlugin](https://doc.webpack-china.org/plugins/dll-plugin) 是 webpack 官方提供的一个插件，也是用来分离代码的，和 `optimization.splitChunks`（3.x 版本的是 CommonsChunkPlugin）有异曲同工之妙，之所以把 DLLPlugin 放到 webpack 构建性能优化这一部分，是因为它的配置相对繁琐，如果项目不涉及性能优化这一块，基本上使用 `optimization.splitChunks` 即可。

我们来看一下 DLLPlugin 如何使用，使用这个插件时需要额外的一个构建配置，用来打包公共的那一部分代码，举个例子，假设这个额外配置是 `webpack.dll.config.js`：

```js
module.exports = {
  name: 'vendor',
  entry: ['lodash'], // 这个例子我们打包 lodash 作为公共类库

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "vendor.js",
    library: "vendor_[hash]" // 打包后对外暴露的类库名称
  },

  plugins: [
    new webpack.DllPlugin({
      name: 'vendor_[hash]',
      path: path.resolve(__dirname, "dist/manifest.json"), // 使用 DLLPlugin 在打包的时候生成一个 manifest 文件
    })
  ],
}
```

然后就是我们正常的应用构建配置，在那个的基础上添加两个一个新的 `webpack.DllReferencePlugin` 配置：

```js
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist/manifest.json'), 
      // 指定需要用到的 manifest 文件，
      // webpack 会根据这个 manifest 文件的信息，分析出哪些模块无需打包，直接从另外的文件暴露出来的内容中获取
    }),
  ],
}
```

在构建的时候，我们需要优先使用 `webpack.dll.config.js` 来打包，如 `webpack -c webpack.dll.config.js --mode production`，构建后生成公共代码模块的文件 `vendor.js` 和 `manifest.json`，然后再进行应用代码的构建。

你会发现构建结果的应用代码中不包含 lodash 的代码内容，这一部分代码内容会放在 `vendor.js` 这个文件中，而你的应用要正常使用的话，需要在 HTML 文件中按顺序引用这两个代码文件，如：

```html
<script src="vendor.js"></script>
<script src="main.js"></script>
```

作用是不是和 `optimization.splitChunks` 很相似，但是有个区别，DLLPlugin 构建出来的内容无需每次都重新构建，后续应用代码部分变更时，你不用再执行配置为 `webpack.dll.config.js` 这一部分的构建，沿用原本的构建结果即可，所以相比 `optimization.splitChunks`，使用 DLLPlugin 时，构建速度是会有显著提高的。

但是很显然，DLLPlugin 的配置要麻烦得多，并且需要关心你公共部分代码的变化，当你升级 lodash（即你的公共部分代码的内容变更）时，要重新去执行 `webpack.dll.config.js` 这一部分的构建，不然沿用的依旧是旧的构建结果，使用上并不如 `optimization.splitChunks` 来得方便。这是一种取舍，根据项目的实际情况采用合适的做法。

还有一点需要注意的是，[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 并不会自动处理 DLLPlugin 分离出来的那个公共代码文件，我们需要自己处理这一部分的内容，可以考虑使用 [add-asset-html-webpack-plugin](https://github.com/SimenB/add-asset-html-webpack-plugin)，关于这一个的使用就不讲解了，详细参考官方的说明文档：[使用 add-asset-html-webpack-plugin](https://github.com/SimenB/add-asset-html-webpack-plugin#basic-usage)。

## webpack 4.x 的构建性能

从官方发布的 webpack 4.0 更新日志来看，webpack 4.0 版本做了很多关于提升构建性能的工作，我觉得比较重要的改进有这么几个：

- [AST](https://zh.wikipedia.org/zh-hans/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9) 可以直接从 loader 直接传递给 webpack，避免额外的解析，对这一个优化细节有兴趣的可以查看这个 [PR](https://github.com/webpack/webpack/pull/5925)。
- 使用速度更快的 md4 作为默认的 hash 方法，对于大型项目来说，文件一多，需要 hash 处理的内容就多，webpack 的 hash 处理优化对整体的构建速度提升应该还是有一定的效果的。
- Node 语言层面的优化，如用 `for of` 替换 `forEach`，用 `Map` 和 `Set` 替换普通的对象字面量等等，这一部分就不展开讲了，有兴趣的同学可以去 webpack 的 [PRs](https://github.com/webpack/webpack/pulls?q=is%3Apr+is%3Aclosed) 寻找更多的内容。
- 默认开启 [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 的 `cache` 和 `parallel`，即缓存和并行处理，这样能大大提高 production mode 下压缩代码的速度。

除此之外，还有比较琐碎的一些内容，可以查阅：[webpack release 4.0](https://github.com/webpack/webpack/releases/tag/v4.0.0)，留意 **performance** 关键词。

很显然，webpack 的开发者们越来越关心 webpack 构建性能的问题，有一个关于 webpack 4.x 和 3.x 构建性能的简单对比：

> 6 entries, dev mode, source maps off, using a bunch of loaders and plugins. dat speed ⚡️

![speed webpack of 4.x](https://user-gold-cdn.xitu.io/2018/3/26/1625e0823c392a55?w=498&h=164&f=jpeg&s=26258)

![speed webpack of 3.x](https://user-gold-cdn.xitu.io/2018/3/26/1625e086a5d544ac?w=440&h=154&f=jpeg&s=18411)

从这个对比的例子上看，4.x 的构建性能对比 3.x 是有很显著的提高，而 webpack 官方后续计划加入多核运算，持久化缓存等特性来进一步提升性能（可能要等到 5.x 版本了），所以，及时更新 webpack 版本，也是提升构建性能的一个有效方式。

## 换个角度

webpack 的构建性能优化是比较琐碎的工作，当我们需要去考虑 webpack 的构建性能问题时，往往面对的是项目过大，涉及的代码模块过多的情况。在这种场景下你单独做某一个点的优化其实很难看出效果，你可能需要从我们上述提到的多个方面入手，逐一处理，验证，有些时候你甚至会觉得吃力不讨好，投入产出比太低了，这个时候我们可以考虑换一个角度来思考我们遇到的问题。

例如，拆分项目的代码，根据一定的粒度，把不同的业务代码拆分到不同的代码库去维护和管理，这样子单一业务下的代码变更就无须整个项目跟着去做构建，这样也是解决因项目过大导致的构建速度慢的一种思路，并且如果处理妥当，从工程角度上可能会给你带来其他的一些好处，例如发布异常时的局部代码回滚相对方便等等。

这可能有点跑题，但是不得不说，webpack 的确是一个好工具，但总归多多少少会有一些局限性，再怎么优化，不可能总能达到理想的效果，因为它确确实实完成那些构建任务就是需要这么一些时间。作为开发者，面对项目中各种各样的情况要随机应变，灵活处理，不能被好工具捆绑了思维模式，很多问题你不要过于依赖于 webpack，换个角度，可能可以找到更好的处理方式。

## 小结

本小节中我们介绍了提高 webpack 构建速度的一些方法：

- 减少 `resolve` 的解析
- 减少 plugin 的消耗
- 换种方式处理图片
- 使用 DLLPlugin
- 积极更新 webpack 版本

当我们面对因项目过大而导致的构建性能问题时，我们也可以换个角度，思考在 webpack 之上的另外一些解决方案，不要过分依赖于 webpack。

## 例子

本小节提及的一些简单的 Demo 可以在 [webpack-examples](https://github.com/teabyii/webpack-examples) 找到。