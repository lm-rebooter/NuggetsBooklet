### 本资源由 itjc8.com 收集整理
# 用 HMR 提高开发效率

HMR 全称是 Hot Module Replacement，即模块热替换。在这个概念出来之前，我们使用过 Hot Reloading，当代码变更时通知浏览器刷新页面，以避免频繁手动刷新浏览器页面。HMR 可以理解为增强版的 Hot Reloading，但不用整个页面刷新，而是局部替换掉部分模块代码并且使其生效，可以看到代码变更后的效果。所以，HMR 既避免了频繁手动刷新页面，也减少了页面刷新时的等待，可以极大地提高前端页面开发效率。

## 配置使用 HMR

HMR 是 webpack 提供的非常有用的一个功能，跟我们之前提到的一样，安装好 webpack-dev-server，
添加一些简单的配置，即在 webpack 的配置文件中添加启用 HMR 需要的两个插件：

```js
const webpack = require('webpack')

module.exports = {
  // ...
  devServer: {
    hot: true // dev server 的配置要启动 hot，或者在命令行中带参数开启
  },
  plugins: [
    // ...
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
  ],
}
```

> 笔者觉得 HMR 应该是 development mode 默认启动的功能，这个希望 webpack 后续能有优化。

## HMR 运行原理

HMR 的实现和运行相对复杂，需要多个部分协同配合，这里稍微介绍一下 HRM 的运行原理。

首先我们要知道一个概念：webpack 内部运行时，会维护一份用于管理构建代码时各个模块之间交互的表数据，webpack 官方称之为 **Manifest**，其中包括入口代码文件和构建出来的 bundle 文件的对应关系。可以使用 [WebpackManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin) 插件来输出这样的一份数据。

了解这个概念后，我们来看一下 HMR 的大致运行流程图。

![hmr flow chart](https://user-gold-cdn.xitu.io/2018/3/19/1623bffb086c3918?w=1272&h=890&f=png&s=218413)

当你使用前面的配置启动了支持 HMR 的 webpack-dev-server，然后在浏览器打开页面时，你也可以从控制台看到大概的 HMR 执行流程：

![hmr log in console](https://user-gold-cdn.xitu.io/2018/3/19/1623c0004b223528?w=396&h=122&f=png&s=18243)

开启了 hot 功能的 webpack 会往我们应用的主要代码中添加 WS 相关的代码，用于和服务器保持连接，等待更新动作。

当你配置了 HMR 的插件时，会往应用代码中添加 HMR 运行时的代码，主要用于定义代码模块应用更新时的 API，后面会详细介绍。

> 有兴趣可以查看源码：[HotModuleReplacement.runtime.js](https://github.com/webpack/webpack/blob/master/lib/HotModuleReplacement.runtime.js)。

有了这两个部分就可以支持整个 HMR 的功能了。我们先忽略流程图的右上角部分，左下角的流程相对容易理解：当有更新时，webpack-dev-server 发送更新信号给 HMR 运行时，然后 HMR 再请求所需要的更新数据，请求的更新数据没有问题的话就应用更新。

如果 HMR 只是简单替换了代码模块的内容，如替换掉所谓的 `installedModules` 中需要更新的部分，那么这样并没有办法把更新后的结果实时地在浏览器上显示出来，所以才会需要流程图的右上角部分。

> 如果无法理解 `installedModules`，可以参考第 13 小节中的「bundler 的基础流程」这一部分的内容

前面提到的 HMR 运行时代码会提供定义代码模块应用更新时执行的 API，这些 API 可以让我们在模块中定义接收到 HMR 更新应用信号时，需要额外做什么工作。例如， [style-loader](https://github.com/webpack-contrib/style-loader) 就需要实现 HMR 接口，当收到更新时，使用新的样式替换掉旧的样式，大概是这样：

```js
if (module.hot) {
  module.hot.accept('/some/path', function() {
    // ... 用新样式替换旧样式
  })
}
```

详情可以参考 [style-loader](https://github.com/webpack-contrib/style-loader) 中的代码实现：[HMR interface implemention in style-loader](https://github.com/webpack-contrib/style-loader/blob/master/index.js#L36)。

HMR 应用更新时是使用 `webpackHotUpdate` 来处理的：

```js
webpackHotUpdate(id, { 
  'modulePath': 
  function() {
    // 模块更新后的代码
  }
})
```

执行 `webpackHotUpdate` 时如发现模块代码实现了 HMR 接口，就会执行相应的回调或者方法，从而达到应用更新时，模块可以自行管理自己所需要额外做的工作。不过，并不是所有的模块都需要做相关的处理，当遇见没有实现 HMR 接口的模块时，就会往上层冒泡，如本节开头部分的流程图所示。

这里还有一个问题是，webpack 如何保证 HMR 接口中的引用是最新的模块代码？我们看一个简单的例子：

```js
import './index.css'
import hello from './bar'

hello()

if (module.hot) {
  module.hot.accept('./bar', () => {
    // console.log('Accepting the updated bar module!')
    hello()
  })
}
```

从代码上看，hello 都是同一个，这样的话并没有办法引用最新的模块代码，但是我们看一下上述代码在 webpack 构建后的结果：

```js
if (true) {
  module.hot.accept("./src/bar.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { 
    /* harmony import */ 
    __WEBPACK_IMPORTED_MODULE_1__bar__ = __webpack_require__("./src/bar.js"); 
    (() => {
      // console.log('Accepting the updated bar module!')
      Object(__WEBPACK_IMPORTED_MODULE_1__bar__["default"])()
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); 
  })
}
```

其他代码比较杂，我们集中看 `module.hot` 的处理部分。这里可以发现，我们的 hello 已经重新使用 `__webpack_require__` 来引用了，所以可以确保它是最新的模块代码。

基本上 HMR 的执行原理就是这样，更具体的实现部分就不展开讲解了。在日常开发中，我们需要更多的工具来帮助我们实现 HMR 的接口，避免编写过多 HMR 需要的代码。例如，React 在组件代码更新时可能需要触发重新 render 来实现实时的组件展示效果，官方提供了一些现有的工具，需要的可以参考一下：[hot module replacement tools](https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks)。

## module.hot 常见的 API

前面 HMR 实现部分已经讲解了实现 HMR 接口的重要性，下面来看看常见的 `module.hot` API 有哪些，以及如何使用。

之前已经简单介绍过，`module.hot.accept` 方法指定在应用特定代码模块更新时执行相应的 callback，第一个参数可以是字符串或者数组，如：

```js
if (module.hot) {
  module.hot.accept(['./bar.js', './index.css'], () => {
    // ... 这样当 bar.js 或者 index.css 更新时都会执行该函数
  })
}
```

`module.hot.decline` 对于指定的代码模块，拒绝进行模块代码的更新，进入更新失败状态，如 `module.hot.decline('./bar.js')`。这个方法比较少用到。

`module.hot.dispose` 用于添加一个处理函数，在当前模块代码被替换时运行该函数，例如：

```js
if (module.hot) {
  module.hot.dispose((data) => {
    // data 用于传递数据，如果有需要传递的数据可以挂在 data 对象上，然后在模块代码更新后可以通过 module.hot.data 来获取
  })
}
```

`module.hot.accept` 通常用于指定当前依赖的某个模块更新时需要做的处理，如果是当前模块更新时需要处理的动作，使用 `module.hot.dispose` 会更加容易方便。

`module.hot.removeDisposeHandler` 用于移除 `dispose` 方法添加的 callback。

关于 `module.hot` 的更多 API 详情可以参考官方文档：[Hot Module Replacement APIs](https://doc.webpack-china.org/api/hot-module-replacement)。

## 小结

Hot Module Replacement 是 webpack 具备的一个相当重要的特性，用于提升开发效率和体验。在这一小节中，我们介绍了：

- 在 webpack 中配置使用 HMR
- HMR 的运行原理
- 模块中的 HMR 接口 API

## 例子

本小节提及的一些简单的 Demo 可以在 [webpack-examples](https://github.com/teabyii/webpack-examples) 找到。