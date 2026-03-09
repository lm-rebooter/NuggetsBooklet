### 本资源由 itjc8.com 收集整理
# 创建自己的 loader

在这一小节我们会来介绍如何创建一个 webpack 可用的 loader。

## loader 是一个函数

先来看一个简单的例子：

```js
"use strict";

const marked = require("marked");
const loaderUtils = require("loader-utils");

module.exports = function (markdown) {
    // 使用 loaderUtils 来获取 loader 的配置项
    // this 是构建运行时的一些上下文信息
    const options = loaderUtils.getOptions(this);

    this.cacheable();

    // 把配置项直接传递给 marked
    marked.setOptions(options);

    // 使用 marked 处理 markdown 字符串，然后返回
    return marked(markdown);
};
```

这是 [markdown-loader](https://github.com/peerigon/markdown-loader) 的实现代码，笔者添加了一些代码说明，看上去很简单。

markdown-loader 本身仅仅只是一个函数，接收模块代码的内容，然后返回代码内容转化后的结果。webpack loader 的本质就是这样的一个函数。

上述代码中用到的 [loader-utils](https://github.com/webpack/loader-utils) 是 webpack 官方提供的一个工具库，提供 loader 处理时需要用到的一些工具方法，例如用来解析上下文 loader 配置项的 `getOptions`。关于这个工具库的内容和功能不是特别复杂，就不展开了，直接参考这个库的官方文档即可。

代码中还用到了 [marked](https://github.com/markedjs/marked)，marked 是一个用于解析 Markdown 的类库，可以把 Markdown 转为 HTML，markdown-loader 的核心功能就是用它来实现的。基本上，webpack loader 都是基于一个实现核心功能的类库来开发的，例如 [sass-loader](https://github.com/webpack-contrib/sass-loader) 是基于 [node-sass](https://github.com/sass/node-sass) 实现的，等等。

## 开始一个 loader 的开发

我们可以在 webpack 配置中直接使用路径来指定使用本地的 loader，或者在 loader 路径解析中加入本地开发 loader 的目录。看看配置例子：

```js
// ... 
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: path.resolve('./loader/index.js'), // 使用本地的 ./loader/index.js 作为 loader
    },
  ],
},

// 在 resolveLoader 中添加本地开发的 loaders 存放路径
// 如果你同时需要开发多个 loader，那么这个方式会更加适合你
resolveLoader: {
  modules: [
    'node_modules',
    path.resolver(__dirname, 'loaders')
  ],
},
```

如果你熟悉 Node 的话，也可以使用 `npm link` 的方式来开发和调试，关于这个方式，可以参考 npm 的官方文档 [npm-link](https://docs.npmjs.com/cli/link)。

## 复杂一点的情况

当我们选择上述任意一种方法，并且做好相应的准备后，我们就可以开始写 loader 的代码了，然后通过执行 webpack 构建来查看 loader 是否正常工作。

上面已经提到，loader 是一个函数，接收代码内容，然后返回处理结果，有一些 loader 的实现基本上就是这么简单，但是有时候会遇见相对复杂一点的情况。

首先 loader 函数接受的参数是有三个的：`content, map, meta`。`content` 是模块内容，但不仅限于字符串，也可以是 buffer，例如一些图片或者字体等文件。`map` 则是 sourcemap 对象，`meta` 是其他的一些元数据。loader 函数单纯返回一个值，这个值是当成 content 去处理，但如果你需要返回 sourcemap 对象或者 meta 数据，甚至是抛出一个 loader 异常给 webpack 时，你需要使用 `this.callback(err, content, map, meta)` 来传递这些数据。

我们日常使用 webpack，有时候会把多个 loader 串起来一起使用，最常见的莫过于 css-loader 和 style-loader 了。当我们配置 `use: ['bar-loader', 'foo-loader']` 时，loader 是以相反的顺序执行的，即先跑 foo-loader，再跑 bar-loader。这一部分内容在配置 loader 的小节中有提及，这里再以开发 loader 的角度稍稍强调下，搬运官网的一段说明：

- 最后的 loader 最早调用，传入原始的资源内容（可能是代码，也可能是二进制文件，用 buffer 处理）
- 第一个 loader 最后调用，期望返回是 JS 代码和 sourcemap 对象（可选）
- 中间的 loader 执行时，传入的是上一个 loader 执行的结果

虽然有多个 loader 时遵循这样的执行顺序，但对于大多数单个 loader 来说无须感知这一点，只负责好处理接受的内容就好。

还有一个场景是 loader 中的异步处理。有一些 loader 在执行过程中可能依赖于外部 I/O 的结果，导致它必须使用异步的方式来处理，这个使用需要在 loader 执行时使用 `this.async()` 来标识该 loader 是异步处理的，然后使用 `this.callback` 来返回 loader 处理结果。例子可以参考官方文档：[异步 loader](https://doc.webpack-china.org/api/loaders/#%E5%BC%82%E6%AD%A5-loader)。

## Pitching loader

我们可以使用 `pitch` 来跳过 loader 的处理，`pitch` 方法是 loader 额外实现的一个函数，看下官方文档中的一个例子：

```js
module.exports = function(content) {
  return someSyncOperation(content, this.data.value); // pitch 的缘故，这里的 data.value 为 42
}

// 挂在 loader 函数上的 pitch 函数
module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.value = 42;
}
```

我们可以简单把 `pitch` 理解为 loader 的前置钩子，它可以使用 `this.data` 来传递数据，然后具备跳过剩余 loader 的能力。

在一个 `use` 配置中所有 loader 执行前会先执行它们对应的 `pitch`，并且与 loader 执行顺序是相反的，如：

```js
use: [
  'bar-loader',
  'foo-loader',
],
// 执行 bar-loader 的 pitch
// 执行 foo-loader 的 pitch
// bar-loader
// foo-loader
```

其中，当 pitch 中返回了结果，那么执行顺序会回过头来，跳掉剩余的 loader，如 `bar-loader` 的 pitch 返回结果了，那么执行只剩下

```js
// 执行 bar-loader 的 pitch
```

可能只有比较少的 loader 会用到 pitch 这个功能，但有的时候考虑实现 loader 功能需求时把 pitch 纳入范围会有不一样的灵感，它可以让你更加灵活地去定义 loader 的执行。

这里的简单介绍仅做抛砖引玉之用，详细的学习和了解可以参考官方文档 [Pitching loader](https://doc.webpack-china.org/api/loaders/#%E8%B6%8A%E8%BF%87-loader-pitching-loader-) 或者 bundler-loader 源码 [bundler-loader](https://github.com/webpack-contrib/bundle-loader/blob/master/index.js)。

## loader 上下文

上述提及的一些代码会使用到 `this`，即 loader 函数的上下文，包括 `this.callback` 和 `this.data` 等，可以这样简单地理解： `this` 是作为 loader 运行时数据和调用方法的补充载体。

loader 上下文有很多运行时的信息，如 `this.context` 和 `this.request` 等等，而最重要的方法莫过于 `this.callback` 和 `this.async`，关于上下文这里不做展开，官方文档有比较详细的说明：[loader API](https://doc.webpack-china.org/api/loaders/#this-version)。当你在开发 loader 过程中发现需要某些运行时数据时，就可以查阅 loader API，基本上该有的数据都有了。

## 一个好 loader 是怎么样的

loader 作为 webpack 解析资源的一种扩展方式，最重要的是足够简单易用，专注于处理自己那一块的内容，便于维护，可以和其他多个 loader 协同来处理更加复杂的情况。

官方对于 loader 的使用和开发有一些准则，一个好的 loader 应该符合官方的这些定义：[Loader 准则](https://doc.webpack-china.org/contribute/writing-a-loader/#%E7%94%A8%E6%B3%95%E5%87%86%E5%88%99-guidelines-)。

社区中有相当多的优秀 loader 可以作为参考，例如刚开始提及的 markdown-loader，相当地简单易用。由于 loader 的这种准则和特性，大部分的 loader 源码都相对容易解读，便于我们学习参考。

作为一个 loader 开发者，你应该尽可能遵循这些准则（有些特殊情况需要特殊处理），这样会让你开发出质量更高、更易维护和使用的 webpack loader。

## 小结

本小节我们从下面几个方面介绍了如何开发一个 webpack loader：

- loader 本质上的实现是一个函数
- 如何开始着手开发一个 loader 
- loader 的输入和输出
- pitch 函数的作用
- loader 函数的上下文
- 一个好的 loader 是怎么样的

loader 的实现相对简单，webpack 社区现成可用的 loader 很多，当你在开发 loader 时遇见了问题，不妨去查阅一下现有 loader 的源码，或许会有不一样的灵感。

## 例子

本小节提及的一些简单的 Demo 可以在 [webpack-examples](https://github.com/teabyii/webpack-examples) 找到。