### 本资源由 itjc8.com 收集整理
# 创建自己的 plugin

前面一些小节中，有一些相对复杂一点的构建功能，例如分离 CSS 代码文件等，都是通过 webpack 的插件来实现的，webpack 强大扩展性的基础就是它的插件机制。当我们需要一个构建功能是 webpack 本身暂未支持的，我们便可以通过寻找合适的 webpack 插件来帮助实现需要的功能，或者我们也可以尝试自己开发一个 webpack 插件来满足项目的构建需求，这一小节会介绍如何开发一个 webpack 插件。

## 一个简单的 plugin

plugin 的实现可以是一个类，使用时传入相关配置来创建一个实例，然后放到配置的 `plugins` 字段中，而 plugin 实例中最重要的方法是 `apply`，该方法在 webpack compiler 安装插件时会被调用一次，`apply` 接收 webpack compiler 对象实例的引用，你可以在 compiler 对象实例上注册各种事件钩子函数，来影响 webpack 的所有构建流程，以便完成更多其他的构建任务。

下边的这个例子，是一个可以创建 webpack 构建文件列表 markdown 的 plugin，实现上相对简单，但呈现了一个 webpack plugin 的基本形态。

```js
class FileListPlugin {
  constructor(options) {}

  apply(compiler) {
    // 在 compiler 的 emit hook 中注册一个方法，当 webpack 执行到该阶段时会调用这个方法
    compiler.hooks.emit.tap('FileListPlugin', (compilation) => {
      // 给生成的 markdown 文件创建一个简单标题
      var filelist = 'In this build:\n\n'

      // 遍历所有编译后的资源，每一个文件添加一行说明
      for (var filename in compilation.assets) {
        filelist += ('- '+ filename +'\n')
      }

      // 将列表作为一个新的文件资源插入到 webpack 构建结果中
      compilation.assets['filelist.md'] = {
        source: function() {
          return filelist
        },
        size: function() {
          return filelist.length
        },
      }
    })
  }
}

module.exports = FileListPlugin
```

webpack 4.0 版本之前使用的是旧版本的 [tapable](https://github.com/webpack/tapable/tree/tapable-0.2)，API 和新版本的差别很大，但是事件钩子基本还是那一些，只是注册的方式有了变化，现在官方关于 plugin 新版本的文档还没有出来，对于各个钩子返回什么数据，调整后的影响，我们可以在 3.x 版本的官方文档基础上合理猜测，然后编码测试结果。

## 开发和调试 plugin

你要在本地开发和调试 webpack plugin 是很容易的一件事情，你只需要创建一个 js 代码文件，如同上述的例子一样，该文件对外暴露一个类，然后在 webpack 配置文件中引用这个文件的代码，照样运行 webpack 构建查看结果即可。大概的配置方式如下：

```js
// 假设我们上述那个例子的代码是 ./plugins/FileListPlugin 这个文件
const FileListPlugin = require('./plugins/FileListPlugin.js')

module.exports = {
  // ... 其他配置
  plugins: [
    new FileListPlugin(), // 实例化这个插件，有的时候需要传入对应的配置
  ],
}
```

webpack 是基于 Node.js 开发的，plugin 也不例外，所以 plugin 的调试和调试 Node.js 代码并无两样，简单的使用 `console` 来打印相关信息，复杂一点的使用断点，或者利用编辑器提供的功能，例如 [VSCode](https://code.visualstudio.com/) 的 DEBUG，对于这一部分内容，有兴趣的同学可以去查找相关资料，不再展开。

## webpack 中的事件钩子

当开发 plugin 需要时，我们可以查阅官方文档中提供的事件钩子列表：[compiler 的事件钩子](https://doc.webpack-china.org/api/compiler/#%E4%BA%8B%E4%BB%B6%E9%92%A9%E5%AD%90) 和 [compilation 的事件钩子](https://doc.webpack-china.org/api/compilation/)。

或者查看源码：[compiler hooks](https://github.com/webpack/webpack/blob/master/lib/Compiler.js#L29) 和 [compilation hooks](https://github.com/webpack/webpack/blob/master/lib/Compilation.js#L91) 来寻找更加详细的信息。

我们可以看到在事件钩子列表中看到，webpack 中会有相当多的事件钩子，基本覆盖了 webpack 构建流程中的每一个步骤，你可以在这些步骤都注册自己的处理函数，来添加额外的功能，这就是 webpack 提供的 plugin 扩展。

如果你查看了前面 compiler hooks 或者 compilation hooks 的源码链接，你会看到事件钩子是这样声明的：

```js
this.hooks = {
  shouldEmit: new SyncBailHook(["compilation"]), // 这里的声明的事件钩子函数接收的参数是 compilation，
  done: new AsyncSeriesHook(["stats"]), // 这里接收的参数是 stats，以此类推
	additionalPass: new AsyncSeriesHook([]),
	beforeRun: new AsyncSeriesHook(["compilation"]),
  run: new AsyncSeriesHook(["compilation"]),
  emit: new AsyncSeriesHook(["compilation"]),
	afterEmit: new AsyncSeriesHook(["compilation"]),
	thisCompilation: new SyncHook(["compilation", "params"]),
  // ...
};
```

从这里你可以看到各个事件钩子函数接收的参数是什么，你还会发现事件钩子会有不同的类型，例如 `SyncBailHook`，`AsyncSeriesHook`，`SyncHook`，接下来我们再介绍一下事件钩子的类型以及我们可以如何更好地利用各种事件钩子的类型来开发我们需要的 plugin。

## 了解事件钩子类型

上述提到的 webpack compiler 中使用了多种类型的事件钩子，根据其名称就可以区分出是同步还是异步的，对于同步的事件钩子来说，注册事件的方法只有 `tap` 可用，例如上述的 `shouldEmit` 应该这样来注册事件函数的：

```js
apply(compiler) {
  compiler.hooks.shouldEmit.tap('PluginName', (compilation) => { /* ... */ })
}
```

但如果是异步的事件钩子，那么可以使用 `tapPromise` 或者 `tapAsync` 来注册事件函数，`tapPromise` 要求方法返回 `Promise` 以便处理异步，而 `tapAsync` 则是需要用 `callback` 来返回结果，例如：

```js
compiler.hooks.done.tapPromise('PluginName', (stats) => {
  // 返回 promise
  return new Promise((resolve, reject) => {
    // 这个例子是写一个记录 stats 的文件
    fs.writeFile('path/to/file', stats.toJson(), (err) => err ? reject(err) : resolve())
  })
})

// 或者
compiler.hooks.done.tapAsync('PluginName', (stats, callback) => {
  // 使用 callback 来返回结果
  fs.writeFile('path/to/file', stats.toJson(), (err) => callback(err))
})

// 如果插件处理中没有异步操作要求的话，也可以用同步的方式
compiler.hooks.done.tap('PluginName', (stats, callback) => {
  callback(fs.writeFileSync('path/to/file', stats.toJson())
})
```

然而 [tapable](https://github.com/webpack/tapable) 这个工具库提供的钩子类型远不止这几种，多样化的钩子类型，主要是为了能够覆盖多种使用场景：

- 连续地执行注册的事件函数
- 并行地执行注册的事件函数
- 一个接一个地执行注册的事件函数，从前边的事件函数获取输入，即瀑布流的方式
- 异步地执行注册的事件函数
- 在允许时停止执行注册的事件函数，一旦一个方法返回了一个非 `undefined` 的值，就跳出执行流

除了同步和异步的区别，我们再参考上述这一些使用场景，以及官方文档的 [Plugin API](https://doc.webpack-china.org/api/plugins/#tapable-%E5%92%8C-tapable-%E5%AE%9E%E4%BE%8B)，进一步将事件钩子类型做一个区分。

名称带有 `parallel` 的，注册的事件函数会并行调用，如：

- AsyncParallelHook
- AsyncParallelBailHook

名称带有 `bail` 的，注册的事件函数会被顺序调用，直至一个处理方法有返回值（ParallelBail 的事件函数则会并行调用，第一个返回值会被使用）：

- SyncBailHook
- AsyncParallelBailHook
- AsyncSeriesBailHook

名称带有 `waterfall` 的，每个注册的事件函数，会将上一个方法的返回结果作为输入参数，如：

- SyncWaterfallHook
- AsyncSeriesWaterfallHook

通过上面的名称可以看出，有一些类型是可以结合到一起的，如 `AsyncParallelBailHook`，这样它就具备了更加多样化的特性。

了解了 webpack 中使用的各个事件钩子的类型，才能在开发 plugin 更好地去把握注册事件的输入和输出，同步和异步，来更好地完成我们想要的构建需求。

> 关于 webpack 3.x 的 plugin API，现在还可以参考官方文档，趁着还没更新到 4.x 版本：[plugin API](https://doc.webpack-china.org/api/plugins/)。

## 小结

本小节我们介绍了一个简单的 webpack plugin 是怎么样的，以及如何去开发和调试 plugin。

webpack plugin 的实现本质上就是基于 webpack 的构建流程注册各种各样的钩子事件函数来添加额外的构建功能，所以我们也介绍了 webpack 流程中的事件钩子以及事件钩子的类型和区别，以便我们更好地在开发 plugin 时把握输入输出。

## 例子

本小节提及的一些简单的 Demo 可以在 [webpack-examples](https://github.com/teabyii/webpack-examples) 找到。