### 本资源由 itjc8.com 收集整理
# webpack 如何解析代码模块路径

在 webpack 支持的前端代码模块化中，我们可以使用类似 `import * as m from './index.js'` 来引用代码模块 `index.js`。

引用第三方类库则是像这样：`import React from 'react'`。webpack 构建的时候，会解析依赖后，然后再去加载依赖的模块文件，那么 webpack 如何将上述编写的 `./index.js` 或 `react` 解析成对应的模块文件路径呢？

```!
在 JavaScript 中尽量使用 ECMAScript 2015 Modules 语法来引用依赖。
```

webpack 中有一个很关键的模块 [enhanced-resolve](https://github.com/webpack/enhanced-resolve/) 就是处理依赖模块路径的解析的，这个模块可以说是 Node.js 那一套模块路径解析的增强版本，有很多可以自定义的解析配置。

> 不熟悉 Node.js 模块路径解析机制的同学可以参考这篇文章：[深入 Node.js 的模块机制](http://www.infoq.com/cn/articles/nodejs-module-mechanism)。

## 模块解析规则

我们简单整理一下基本的模块解析规则，以便更好地理解后续 webpack 的一些配置会产生的影响。

- 解析相对路径
  1. 查找相对当前模块的路径下是否有对应文件或文件夹
  2. 是文件则直接加载
  3. 是文件夹则继续查找文件夹下的 package.json 文件
  4. 有 package.json 文件则按照文件中 `main` 字段的文件名来查找文件
  5. 无 package.json 或者无 `main` 字段则查找 `index.js` 文件
- 解析模块名  
  查找当前文件目录下，父级目录及以上目录下的 `node_modules` 文件夹，看是否有对应名称的模块
- 解析绝对路径（不建议使用）  
  直接查找对应路径的文件

在 webpack 配置中，和模块路径解析相关的配置都在 `resolve` 字段下：

```js
module.exports = {
  resolve: {
    // ...
  }
}
```

接下来的内容会省略上述代码，直接描述 `resolve` 字段中的内容。

## 常用的一些配置

我们先从一些简单的需求来阐述 webpack 可以支持哪些解析路径规则的自定义配置。

### `resolve.alias`

假设我们有个 `utils` 模块极其常用，经常编写相对路径很麻烦，希望可以直接 `import 'utils'` 来引用，那么我们可以配置某个模块的别名，如：

```js
alias: {
  utils: path.resolve(__dirname, 'src/utils') // 这里使用 path.resolve 和 __dirname 来获取绝对路径
}
```

上述的配置是模糊匹配，意味着只要模块路径中携带了 `utils` 就可以被替换掉，如：

```js
import 'utils/query.js' // 等同于 import '[项目绝对路径]/src/utils/query.js'
```

如果需要进行精确匹配可以使用：

```js
alias: {
  utils$: path.resolve(__dirname, 'src/utils') // 只会匹配 import 'utils'
}
```

更多匹配相关的写法可以参考官方文档 [Resolve Alias](https://doc.webpack-china.org/configuration/resolve/#resolve-alias)，这里不一一举例说明。

### `resolve.extensions`

在看第 1 小节中的 webpack 配置时，你可能留意到了这么一行：

```js
extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
// 这里的顺序代表匹配后缀的优先级，例如对于 index.js 和 index.jsx，会优先选择 index.js
```

看到数组中配置的字符串大概就可以猜到，这个配置的作用是和文件后缀名有关的。是的，这个配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找，例如有了上述的配置，当你在 src/utils/ 目录下有一个 common.js 文件时，就可以这样来引用：

```js
import * as common from './src/utils/common'
```

webpack 会尝试给你依赖的路径添加上 `extensions` 字段所配置的后缀，然后进行依赖路径查找，所以可以命中 src/utils/common.js 文件。

但如果你是引用 src/styles 目录下的 common.css 文件时，如 `import './src/styles/common'`，webpack 构建时则会报无法解析模块的错误。

你可以在引用时添加后缀，`import './src/styles/common.css'` 来解决，或者在 `extensions` 添加一个 `.css` 的配置：

```js
extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.css'],
```

### `resolve.modules`

前面的内容有提到，对于直接声明依赖名的模块（如 `react` ），webpack 会类似 Node.js 一样进行路径搜索，搜索 node_modules 目录，这个目录就是使用 `resolve.modules` 字段进行配置的，默认就是：

```js
resolve: {
  modules: ['node_modules'],
},
```

通常情况下，我们不会调整这个配置，但是如果可以确定项目内所有的第三方依赖模块都是在项目根目录下的 node\_modules 中的话，那么可以在 node\_modules 之前配置一个确定的绝对路径：

```js
resolve: {
  modules: [
    path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
    'node_modules', // 如果有一些类库是放在一些奇怪的地方的，你可以添加自定义的路径或者目录
  ],
},
```

这样配置在某种程度上可以简化模块的查找，提升构建速度。

### `resolve.mainFields`

> 4. 有 package.json 文件则按照文件中 `main` 字段的文件名来查找文件

我们之前有提到这么一句话，其实确切的情况并不是这样的，webpack 的 `resolve.mainFields` 配置可以进行调整。当引用的是一个模块或者一个目录时，会使用 package.json 文件的哪一个字段下指定的文件，默认的配置是这样的：

```js
resolve: {
  // 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
  mainFields: ['browser', 'module', 'main'],

  // target 的值为其他时，mainFields 默认值为：
  mainFields: ["module", "main"],
},
```

因为通常情况下，模块的 package 都不会声明 `browser` 或 `module` 字段，所以便是使用 `main` 了。

在 NPM packages 中，会有些 package 提供了两个实现，分别给浏览器和 Node.js 两个不同的运行时使用，这个时候就需要区分不同的实现入口在哪里。如果你有留意一些社区开源模块的 package.json 的话，你也许会发现 `browser` 或者 `module` 等字段的声明。

### `resolve.mainFiles`

当目录下没有 package.json 文件时，我们说会默认使用目录下的 index.js 这个文件，其实这个也是可以配置的，是的，使用 `resolve.mainFiles` 字段，默认配置是：

```js
resolve: {
  mainFiles: ['index'], // 你可以添加其他默认使用的文件名
},
```

通常情况下我们也无须修改这个配置，index.js 基本就是约定俗成的了。

### `resolve.resolveLoader`

这个字段 `resolve.resolveLoader` 用于配置解析 loader 时的 resolve 配置，原本 resolve 的配置项在这个字段下基本都有。我们看下默认的配置：

```js
resolve: {
  resolveLoader: {
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main'],
  },
},
```

这里提供的配置相对少用，我们一般遵从标准的使用方式，使用默认配置，然后把 loader 安装在项目根路径下的 node_modules 下就可以了。

## 小结

webpack 依赖 [enhanced-resolve](https://github.com/webpack/enhanced-resolve/) 来解析代码模块的路径，webpack 配置文件中和 `resolve` 相关的选项都会传递给 enhanced-resolve 使用，我们介绍了这些选项的作用：

- `resolve.alias`
- `resolve.extensions`
- `resolve.modules`
- `resolve.mainFiles`
- `resolve.resolveLoader`

webpack 提供的这些选项可以帮助你更加灵活地去控制项目中代码模块的解析，除了上述的选项外，其他的选项在日常项目中相对比较少用到，如若需要，可以参考官方文档 [Resolve](https://doc.webpack-china.org/configuration/resolve/)。

## 例子

本小节提及的一些简单的 Demo 可以在 [webpack-examples](https://github.com/teabyii/webpack-examples) 找到。