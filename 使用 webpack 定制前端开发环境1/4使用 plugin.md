### 本资源由 itjc8.com 收集整理
# 使用 plugin

webpack 中的 plugin 大多都提供额外的能力，它们在 webpack 中的配置都只是把插件实例添加到 `plugins` 字段的数组中。不过由于需要提供不同的功能，不同的插件本身的配置比较多样化。

社区中有很多 webpack 插件可供使用，而优秀的插件基本上都提供了详细的使用说明文档。更多的插件可以在这里查找：[plugins in awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins)。

下面通过介绍几个常用的插件来了解插件的使用方法。

## DefinePlugin

DefinePlugin 是 webpack 内置的插件，可以使用 `webpack.DefinePlugin` 直接获取。

这个插件用于创建一些在编译时可以配置的全局常量，这些常量的值我们可以在 webpack 的配置中去指定，例如：

```js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
      VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'
      BROWSER_SUPPORTS_HTML5: true, // const BROWSER_SUPPORTS_HTML5 = 'true'
      TWO: '1+1', // const TWO = 1 + 1,
      CONSTANTS: {
        APP_VERSION: JSON.stringify('1.1.2') // const CONSTANTS = { APP_VERSION: '1.1.2' }
      }
    }),
  ],
}
```

有了上面的配置，就可以在应用代码文件中，访问配置好的变量了，如：

```js
console.log("Running App version " + VERSION);

if(!BROWSER_SUPPORTS_HTML5) require("html5shiv");
```

上面配置的注释已经简单说明了这些配置的效果，这里再简述一下整个配置规则。

- 如果配置的值是字符串，那么整个字符串会被当成代码片段来执行，其结果作为最终变量的值，如上面的 `"1+1"`，最后的结果是 `2`
- 如果配置的值不是字符串，也不是一个对象字面量，那么该值会被转为一个字符串，如 `true`，最后的结果是 `'true'`
- 如果配置的是一个对象字面量，那么该对象的所有 key 会以同样的方式去定义

这样我们就可以理解为什么要使用 `JSON.stringify()` 了，因为 `JSON.stringify(true)` 的结果是 `'true'`，`JSON.stringify("5fa3b9")` 的结果是 `"5fa3b9"`。

社区中关于 DefinePlugin 使用得最多的方式是定义环境变量，例如 `PRODUCTION = true` 或者 `__DEV__ = true` 等。部分类库在开发环境时依赖这样的环境变量来给予开发者更多的开发调试反馈，例如 `react` 等。

```! 
建议使用 process.env.NODE_ENV: ... 的方式来定义 process.env.NODE_ENV，而不是使用 process: { env: { NODE_ENV: ... } } 的方式，因为这样会覆盖掉 process 这个对象，可能会对其他代码造成影响。
```

## copy-webpack-plugin

这个插件看名字就知道它有什么作用，没错，就是用来复制文件的。

我们一般会把开发的所有源码和资源文件放在 src/ 目录下，构建的时候产出一个 build/ 目录，通常会直接拿 build 中的所有文件来发布。有些文件没经过 webpack 处理，但是我们希望它们也能出现在 build 目录下，这时就可以使用 CopyWebpackPlugin 来处理了。

我们来看下如何配置这个插件：

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
      { from: 'src/*.ico', to: 'build/*.ico' }, // 配置项可以使用 glob
      // 可以配置很多项复制规则
    ]),
  ],
}
```

> glob 用法可以参考 [glob-primer](https://github.com/isaacs/node-glob#glob-primer)。

上述的配置日常应用已经足够，更多的配置内容可以参考 [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin)。

## extract-text-webpack-plugin

extract-text-webpack-plugin 之前的章节有简单介绍过，我们用它来把依赖的 CSS 分离出来成为单独的文件。这里再看一下使用 extract-text-webpack-plugin 的配置：

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: 'css-loader',
        }), 
      },
    ],
  },
  plugins: [
    // 引入插件，配置文件名，这里同样可以使用 [hash]
    new ExtractTextPlugin('index.css'),
  ],
}
```

在上述的配置中，我们使用了 index.css 作为单独分离出来的文件名，但有的时候构建入口不止一个，extract-text-webpack-plugin 会为每一个入口创建单独分离的文件，因此最好这样配置：

```js
plugins: [
  new ExtractTextPlugin('[name].css'),
],
```

这样确保在使用多个构建入口时，生成不同名称的文件。

这里再次提及 extract-text-webpack-plugin，一个原因是它是一个蛮常用的插件，另一个原因是它的使用方式比较特别，除了在 `plugins` 字段添加插件实例之外，还需要调整 loader 对应的配置。

在这里要强调的是，在 webpack 中，loader 和 plugin 的区分是很清楚的，针对文件模块转换要做的使用 loader，而其他干涉构建内容的可以使用 plugin。 ExtractTextWebpackPlugin 既提供了 plugin，也提供了 extract 方法来获取对应需要的 loader。

## ProvidePlugin

ProvidePlugin 也是一个 webpack 内置的插件，我们可以直接使用 `webpack.ProvidePlugin` 来获取。

该组件用于引用某些模块作为应用运行时的变量，从而不必每次都用 `require` 或者 `import`，其用法相对简单：

```js
new webpack.ProvidePlugin({
  identifier: 'module',
  // ...
})

// 或者
new webpack.ProvidePlugin({
  identifier: ['module', 'property'], // 即引用 module 下的 property，类似 import { property } from 'module'
  // ...
})
```

在你的代码中，当 `identifier` 被当作未赋值的变量时，module 就会被自动加载了，而 `identifier` 这个变量即 module 对外暴露的内容。

注意，如果是 ES 的 `default export`，那么你需要指定模块的 `default` 属性：`identifier: ['module', 'default'],`。

更多使用例子可以查看官方文档 [ProvidePlugin](https://doc.webpack-china.org/plugins/provide-plugin/)。

## IgnorePlugin

IgnorePlugin 和 ProvidePlugin 一样，也是一个 webpack 内置的插件，可以直接使用 `webpack.IgnorePlugin` 来获取。

这个插件用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去。例如我们使用 [moment.js](http://momentjs.com/)，直接引用后，里边有大量的 i18n 的代码，导致最后打包出来的文件比较大，而实际场景并不需要这些 i18n 的代码，这时我们可以使用 IgnorePlugin 来忽略掉这些代码文件，配置如下：

```js
module.exports = {
  // ...
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}
```

IgnorePlugin 配置的参数有两个，第一个是匹配引入模块路径的正则表达式，第二个是匹配模块的对应上下文，即所在目录名。

## 小结

本小节介绍了几个相对常见的 webpack plugin 的使用：

- DefinePlugin
- copy-webpack-plugin
- extract-text-webpack-plugin
- ProvidePlugin
- IgnorePlugin

更多其他组件的使用就请有兴趣的同学自行摸索了：[plugins in awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins)。

## 例子

本小节提及的一些简单的 Demo 可以在 [webpack-examples](https://github.com/teabyii/webpack-examples) 找到。