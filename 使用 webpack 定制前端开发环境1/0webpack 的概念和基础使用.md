### 本资源由 itjc8.com 收集整理
# webpack 的概念和基础使用

我们在小册介绍中提到，webpack 是一个 JS 代码模块化的打包工具，藉由它强大的扩展能力，随着社区的发展，逐渐成为一个功能完善的构建工具。相信开始学习这个小册的同学们多多少少都能够理解为什么前端开发中会使用到 webpack，我们不再详细介绍 webpack 的使用背景，直奔本小节的主题。

## 安装和使用

我们使用 npm 或者 yarn 来安装 webpack，可以作为一个全局的命令来使用：

```shell
npm install webpack webpack-cli -g 

# 或者
yarn global add webpack webpack-cli

# 然后就可以全局执行命令了
webpack --help
```

[webpack-cli](https://github.com/webpack/webpack-cli) 是使用 webpack 的命令行工具，在 4.x 版本之后不再作为 webpack 的依赖了，我们使用时需要单独安装这个工具。

在项目中，我们更多地会把 webpack 作为项目的开发依赖来安装使用，这样可以指定项目中使用的 webpack 版本，更加方便多人协同开发：

> 确保你的项目中有 package.json 文件，如果没有可以使用 `npm init` 来创建。

```shell
npm install webpack -D 

# 或者
yarn add webpack -D
```

这样 webpack 会出现在 package.json 中，我们再添加一个 npm scripts：

```json
  "scripts": {
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "webpack": "^4.1.1",
    "webpack-cli": "^2.0.12",
  }
```

然后我们创建一个 `./src/index.js` 文件，可以写任意的 JS 代码。创建好了之后执行 `npm run build` 或者 `yarn build` 命令，你就会发现新增了一个 `dist` 目录，里边存放的是 webpack 构建好的 `main.js` 文件。

因为是作为项目依赖进行安装，所以不会有全局的命令，npm/yarn 会帮助我们在当前项目依赖中寻找对应的命令执行，如果是全局安装的 webpack，直接执行 `webpack --mode production` 就可以。

webpack 4.x 的版本可以零配置就开始进行构建，但是笔者觉得这个功能还不全面，缺少很多实际项目需要的功能，所以基本你还是需要一个配置文件，后边会详细讲解。

我们先来了解 webpack 中的一些基本概念。

## webpack 的基本概念

webpack 本质上是一个打包工具，它会根据代码的内容解析模块依赖，帮助我们把多个模块的代码打包。借用 webpack 官网的图片：

![webpack as a bundler](https://user-gold-cdn.xitu.io/2018/3/19/1623bfac4a1e0945?w=2152&h=850&f=png&s=133657)

如上图，webpack 会把我们项目中使用到的多个代码模块（可以是不同文件类型），打包构建成项目运行仅需要的几个静态文件。webpack 有着十分丰富的配置项，提供了十分强大的扩展能力，可以在打包构建的过程中做很多事情。我们先来看一下 webpack 中的几个基本概念。

### 入口

如上图所示，在多个代码模块中会有一个起始的 `.js` 文件，这个便是 webpack 构建的入口。webpack 会读取这个文件，并从它开始解析依赖，然后进行打包。如图，一开始我们使用 webpack 构建时，默认的入口文件就是 `./src/index.js`。

我们常见的项目中，如果是单页面应用，那么可能入口只有一个；如果是多个页面的项目，那么经常是一个页面会对应一个构建入口。

入口可以使用 `entry` 字段来进行配置，webpack 支持配置多个入口来进行构建：

```js
module.exports = {
  entry: './src/index.js' 
}

// 上述配置等同于
module.exports = {
  entry: {
    main: './src/index.js'
  }
}

// 或者配置多个入口
module.exports = {
  entry: {
    foo: './src/page-foo.js',
    bar: './src/page-bar.js', 
    // ...
  }
}

// 使用数组来对多个文件进行打包
module.exports = {
  entry: {
    main: [
      './src/foo.js',
      './src/bar.js'
    ]
  }
}
```

最后的例子，可以理解为多个文件作为一个入口，webpack 会解析两个文件的依赖后进行打包。

### loader

webpack 中提供一种处理多种文件格式的机制，便是使用 loader。我们可以把 loader 理解为是一个转换器，负责把某种文件格式的内容转换成 webpack 可以支持打包的模块。

举个例子，在没有添加额外插件的情况下，webpack 会默认把所有依赖打包成 js 文件，如果入口文件依赖一个 .hbs 的模板文件以及一个 .css 的样式文件，那么我们需要 handlebars-loader 来处理 .hbs 文件，需要 css-loader 来处理 .css 文件（这里其实还需要 style-loader，后续详解），最终把不同格式的文件都解析成 js 代码，以便打包后在浏览器中运行。

当我们需要使用不同的 loader 来解析处理不同类型的文件时，我们可以在 `module.rules` 字段下来配置相关的规则，例如使用 Babel 来处理 .js 文件：

```js
module: {
  // ...
  rules: [
    {
      test: /\.jsx?/, // 匹配文件路径的正则表达式，通常我们都是匹配文件类型后缀
      include: [
        path.resolve(__dirname, 'src') // 指定哪些路径下的文件需要经过 loader 处理
      ],
      use: 'babel-loader', // 指定使用的 loader
    },
  ],
}
```

loader 是 webpack 中比较复杂的一块内容，它支撑着 webpack 来处理文件的多样性。后续我们还会介绍如何更好地使用 loader 以及如何开发 loader。

### plugin

在 webpack 的构建流程中，plugin 用于处理更多其他的一些构建任务。可以这么理解，模块代码转换的工作由 loader 来处理，除此之外的其他任何工作都可以交由 plugin 来完成。通过添加我们需要的 plugin，可以满足更多构建中特殊的需求。例如，要使用压缩 JS 代码的 uglifyjs-webpack-plugin 插件，只需在配置中通过 `plugins` 字段添加新的 plugin 即可：

```js
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyPlugin()
  ],
}
```

除了压缩 JS 代码的 [uglifyjs-webpack-plugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/)，常用的还有定义环境变量的 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)，生成 CSS 文件的 [ExtractTextWebpackPlugin](https://webpack.js.org/plugins/extract-text-webpack-plugin/) 等。在这里提到这些 plugin，只是希望读者们能够对 plugin 的作用有个大概的印象，后续的小节会详细介绍如何使用这些 plugin。

plugin 理论上可以干涉 webpack 整个构建流程，可以在流程的每一个步骤中定制自己的构建需求。第 15 小节我们会介绍如何开发 plugin，让读者们在必要时，也可以在 webpack 的基础上开发 plugin 来应对一些项目的特殊构建需求。

### 输出

webpack 的输出即指 webpack 最终构建出来的静态文件，可以看看上面 webpack 官方图片右侧的那些文件。当然，构建结果的文件名、路径等都是可以配置的，使用 `output` 字段：

```js
module.exports = {
  // ...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
}

// 或者多个入口生成不同文件
module.exports = {
  entry: {
    foo: './src/foo.js',
    bar: './src/bar.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
}

// 路径中使用 hash，每次构建时会有一个不同 hash 值，避免发布新版本时线上使用浏览器缓存
module.exports = {
  // ...
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/[hash]',
  },
}
```

我们一开始直接使用 webpack 构建时，默认创建的输出内容就是 `./dist/main.js`。

## 一个简单的 webpack 配置

我们把上述涉及的几部分配置内容合到一起，就可以创建一个简单的 webpack 配置了，webpack 运行时默认读取项目下的 `webpack.config.js` 文件作为配置。

所以我们在项目中创建一个 `webpack.config.js` 文件：

```js
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader',
      },
    ],
  },

  // 代码模块路径解析的配置
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src')
    ],

    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
  },

  plugins: [
    new UglifyPlugin(), 
    // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    // 如果你留意了我们一开始直接使用 webpack 构建的结果，你会发现默认已经使用了 JS 代码压缩的插件
    // 这其实也是我们命令中的 --mode production 的效果，后续的小节会介绍 webpack 的 mode 参数
  ],
}
```

webpack 的配置其实是一个 Node.js 的脚本，这个脚本对外暴露一个配置对象，webpack 通过这个对象来读取相关的一些配置。因为是 Node.js 脚本，所以可玩性非常高，你可以使用任何的 Node.js 模块，如上述用到的 `path` 模块，当然第三方的模块也可以。

创建了 webpack.config.js 后再执行 webpack 命令，webpack 就会使用这个配置文件的配置了。

有的时候我们开始一个新的前端项目，并不需要从零开始配置 webpack，而可以使用一些工具来帮助快速生成 webpack 配置。

## 脚手架中的 webpack 配置

现今，大多数前端框架都提供了简单的工具来协助快速生成项目基础文件，一般都会包含项目使用的 webpack 的配置，如：

- [create-react-app](https://github.com/facebookincubator/create-react-app)

  create-react-app 的 webpack 配置在这个项目下：[react-scripts](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/README.md)。

- [angular/devkit/build-webpack](https://github.com/angular/devkit/blob/master/packages/angular_devkit/build_webpack/README.md)

  通常 angular 的项目开发和生产的构建任务都是使用 angular-cli 来运行的，但 angular-cli 只是命令的使用接口，基础功能是由 [angular/devkit](https://github.com/angular/devkit) 来实现的，webpack 的构建相关只是其中一部分，详细的配置可以参考 [webpack-configs](https://github.com/angular/devkit/tree/master/packages/angular_devkit/build_webpack/src/angular-cli-files/models/webpack-configs) 。

- [vue-cli](https://github.com/vuejs/vue-cli/)

  vue-cli 使用 webpack 模板生成的项目文件中，webpack 相关配置存放在 build 目录下。

这些工具都提供了极其完整的配置来帮助开发者快捷开始一个项目，我们可以学习了解它们所提供的 webpack 配置，有些情况下，还会尝试修改这些配置以满足特殊的需求。

所以你也会发现，这些极其流行的前端类库或者框架都提供了基于 webpack 的工具，webpack 基本成为前端项目构建工具的标配。

```!
这三个工具中，只有 angular-cli 使用了 4.x 版本的 webpack，其他的都还是用的 3.x 版本，学习的时候要留意一下版本区别。
```

## 小结

webpack 的安装和使用和大多数使用 Node.js 开发的命令行工具一样，使用 npm 安装后执行命令即可，webpack 4.x 版本的零配置特性也让上手变得更加简单。

前面我们已经介绍了 webpack 的几个重要的概念：入口，loader，plugin，输出，并且展示了一个简单的 webpack 配置例子，最后提供了前端社区三大框架基于 webpack 的脚手架工具的链接，也许这些工具提供的配置会比较难懂，后续的小节会帮助你逐渐去深入，慢慢地，你会对 webpack 配置越来越得心应手。

## 例子

本小节提及的一些简单的 Demo 可以在 [webpack-examples](https://github.com/teabyii/webpack-examples) 找到。