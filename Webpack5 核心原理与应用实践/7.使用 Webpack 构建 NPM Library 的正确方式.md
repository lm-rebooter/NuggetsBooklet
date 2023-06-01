虽然 Webpack 多数情况下被用于构建 Web 应用，但与 Rollup、Snowpack 等工具类似，Webpack 同样具有完备的构建 NPM 库的能力。与一般场景相比，构建 NPM 库时需要注意：

- 正确导出模块内容；
- 不要将第三方包打包进产物中，以免与业务方环境发生冲突；
- 将 CSS 抽离为独立文件，以方便用户自行决定实际用法；
- 始终生成 Sourcemap 文件，方便用户调试。

本文将从最基础的 NPM 库构建需求开始，逐步叠加上述特性，最终搭建出一套能满足多数应用场景、功能完备的 NPM 库构建环境。

## 开发一个 NPM 库

为方便讲解，假定我们正在开发一个全新的 NPM 库，暂且叫它 `test-lib` 吧，首先需要创建并初始化项目：

```bash
mkdir test-lib && cd test-lib
npm init -y
```

虽然有很多构建工具能够满足 NPM 库的开发需求，但现在暂且选择 Webpack，所以需要先装好基础依赖：

```bash
yarn add -D webpack webpack-cli
```

接下来，可以开始写一些代码了，首先创建代码文件：

```bash
mkdir src
touch src/index.js
```

之后，在 `test-lib/src/index.js` 文件中随便实现一些功能，比如：

```js
// test-lib/src/index.js
export const add = (a, b) => a + b
```

至此，项目搭建完毕，目录如下：

```bash
├─ test-lib
│  ├─ package.json
│  ├─ src
│  │  ├─ index.js
```

> 提示：本文代码均已上传到 [小册仓库](https://github.com/Tecvan-fe/webpack-book-samples/tree/main/6-1\_test-lib)。

## 使用 Webpack 构建 NPM 库

接下来，我们需要将上例 `test-lib` 构建为适合分发的产物形态。虽然 NPM 库与普通 Web 应用在形态上有些区别，但大体的编译需求趋同，因此可以复用前面章节介绍过的大多数知识点。例如 `test-lib` 所需要的基础编译配置如下：

```js
// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  }
};
```

> 提示：我们还可以在上例基础上叠加任意 Loader、Plugin，例如： `babel-loader`、`eslint-loader`、`ts-loader` 等。

上述配置会将代码编译成一个 IIFE 函数，但这并不适用于 NPM 库，我们需要修改 `output.library` 配置，以适当方式导出模块内容：

```js
module.exports = {
  // ...
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
+   library: {
+     name: "_",
+     type: "umd",
+   },
  },
  // ...
};
```

这里用到了两个新配置项：

- [output.library.name](https://webpack.js.org/configuration/output/#outputlibraryname)：用于定义模块名称，在浏览器环境下使用 `script` 加载该库时，可直接使用这个名字调用模块，例如：

```html
<!DOCTYPE html>
<html lang="en">
...
<body>
    <script src="https://examples.com/dist/main.js"></script>
    <script>
        // Webpack 会将模块直接挂载到全局对象上
        window._.add(1, 2)
    </script>
</body>

</html>
```

- [output.library.type](https://webpack.js.org/configuration/output/#outputlibrarytype)：用于编译产物的模块化方案，可选值有：`commonjs`、`umd`、`module`、`jsonp` 等，通常选用兼容性更强的 `umd` 方案即可。

> 提示：JavaScript 最开始并没有模块化方案，这就导致早期 Web 开发需要将许多代码写进同一文件，极度影响开发效率。后来，随着 Web 应用复杂度逐步增高，社区陆陆续续推出了许多适用于不同场景的模块化规范，包括：CommonJS、UMD、CMD、AMD，以及 ES6 推出的 ES Module 方案，不同方案各有侧重点与适用场景，NPM 库作者需要根据预期的使用场景选择适当方案。

修改前后对应的产物内容如下：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9676ffea7de5445d809662f3355760b2~tplv-k3u1fbpfcp-watermark.image?)

可以看到，修改前\(对应上图左半部分\)代码会被包装成一个 IIFE ；而使用 `output.library` 后，代码被包装成 UMD\(Universal Module Definition\) 模式：

```js
(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["_"] = factory();
    else
        root["_"] = factory();
})(self, function() {
 // ...
});
```

这种形态会在 NPM 库启动时判断运行环境，自动选择当前适用的模块化方案，此后我们就能在各种场景下使用 `test-lib` 库，例如：

```js
// ES Module
import {add} from 'test-lib';

// CommonJS
const {add} = require('test-lib');

// HTML
<script src="https://examples.com/dist/main.js"></script>
<script>
    // Webpack 会将模块直接挂载到全局对象上
    window._.add(1, 2)
</script>
```

## 正确使用第三方包

接下来，假设我们需要在 `test-lib` 中使用其它 NPM 包，例如 `lodash`：

```js
// src/index.js
import _ from "lodash";

export const add = (a, b) => a + b;

export const max = _.max;
```

此时执行编译命令 `npx webpack`，我们会发现产物文件的体积非常大：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af64ed8d6e4a45a1b0a9909ca487a739~tplv-k3u1fbpfcp-watermark.image?)

这是因为 Webpack 默认会将所有第三方依赖都打包进产物中，这种逻辑能满足 Web 应用资源合并需求，但在开发 NPM 库时则很可能导致代码冗余。以 `test-lib` 为例，若使用者在业务项目中已经安装并使用了 `lodash`，那么最终产物必然会包含两份 `lodash` 代码！

为解决这一问题，我们需要使用 [externals](https://webpack.js.org/configuration/externals/) 配置项，将第三方依赖排除在打包系统之外：

```js
// webpack.config.js
module.exports = {
  // ...
+  externals: {
+   lodash: {
+     commonjs: "lodash",
+     commonjs2: "lodash",
+     amd: "lodash",
+     root: "_",
+   },
+ },
  // ...
};
```

> 提示：
> Webpack 编译过程会跳过 [externals](https://webpack.js.org/configuration/externals/) 所声明的库，并假定消费场景已经安装了相关依赖，常用于 NPM 库开发场景；在 Web 应用场景下则常被用于优化性能。
>
> 例如，我们可以将 React 声明为外部依赖，并在页面中通过 `<script>` 标签方式引入 React 库，之后 Webpack 就可以跳过 React 代码，提升编译性能。

改造后，再次执行 `npx webpack`，编译结果如下：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d59a2a8dcc5c40f489b3c39dbafcc27c~tplv-k3u1fbpfcp-watermark.image?)

改造后，主要发生了两个变化：

1.  产物仅包含 `test-lib` 库代码，体积相比修改前大幅降低；
2.  UMD 模板通过 `require`、`define` 函数中引入 `lodash` 依赖并传递到 `factory`。

至此，Webpack 不再打包 `lodash` 代码，我们可以顺手将 `lodash` 声明为 `peerDependencies`：

```json
{
  "name": "6-1_test-lib",
  // ...
+ "peerDependencies": {
+   "lodash": "^4.17.21"
+ }
}
```

实践中，多数第三方框架都可以沿用上例方式处理，包括 React、Vue、Angular、Axios、Lodash 等，方便起见，可以直接使用 [webpack-node-externals](https://www.npmjs.com/package/webpack-node-externals) 排除所有 `node_modules` 模块，使用方法：

```js
// webpack.config.js
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // ...
+  externals: [nodeExternals()]
  // ...
};
```

## 抽离 CSS 代码

假设我们开发的 NPM 库中包含了 CSS 代码 —— 这在组件库中特别常见，我们通常需要使用 `mini-css-extract-plugin` 插件将样式抽离成单独文件，由用户自行引入。

这是因为 Webpack 处理 CSS 的方式有很多，例如使用 `style-loader` 将样式注入页面的 `<head>` 标签；使用 `mini-css-extract-plugin` 抽离样式文件。作为 NPM 库开发者，如果我们粗暴地将 CSS 代码打包进产物中，有可能与用户设定的方式冲突。

为此，需要在前文基础上添加如下配置：

```js
module.exports = {  
  // ...
+ module: {
+   rules: [
+     {
+       test: /\.css$/,
+       use: [MiniCssExtractPlugin.loader, "css-loader"],
+     },
+   ],
+ },
+ plugins: [new MiniCssExtractPlugin()],
};
```

> 提示：关于 CSS 构建的更多规则，可参考《[如何借助预处理器、PostCSS 等构建现代 CSS 工程环境？](https://juejin.cn/book/7115598540721618944/section/7116186197730263054)》章节。

## 生成 Sourcemap

Sourcemap 是一种代码映射协议，它能够将经过压缩、混淆、合并的代码还原回未打包状态，帮助开发者在生产环境中精确定位问题发生的行列位置，所以一个成熟的 NPM 库除了提供兼容性足够好的编译包外，通常还需要提供 Sourcemap 文件。

接入方法很简单，只需要添加适当的 `devtool` 配置：

```js
// webpack.config.js
module.exports = {  
  // ...
+ devtool: 'source-map'
};
```

再次执行 `npx webpack` 就可以看到 `.map` 后缀的映射文件：

```markdown
├─ test-lib
│  ├─ package.json
│  ├─ webpack.config.js
│  ├─ src
│  │  ├─ index.css
│  │  ├─ index.js
│  ├─ dist
│  │  ├─ main.js
│  │  ├─ main.js.map
│  │  ├─ main.css
│  │  ├─ main.css.map
```

此后，业务方只需使用 `source-map-loader` 就可以将这段 Sourcemap 信息加载到自己的业务系统中，实现框架级别的源码调试能力。关于 Sourcemap 的更多信息，可查阅：

> 提示：示例代码已上传到 [小册仓库](https://github.com/Tecvan-fe/webpack-book-samples/tree/main/6-2\_use-test-lib)。


## 其它 NPM 配置

至此，开发 NPM 库所需的 Webpack 配置就算是介绍完毕了，接下来我们还可以用一些小技巧优化 `test-lib` 的项目配置，提升开发效率，包括：

- 使用 `.npmignore` 文件忽略不需要发布到 NPM 的文件；
- 在 `package.json` 文件中，使用 `prepublishOnly` 指令，在发布前自动执行编译命令，例如：

```json
// package.json
{
  "name": "test-lib",
  // ...
  "scripts": {
    "prepublishOnly": "webpack --mode=production"
  },
  // ...
}
```

- 在 `package.json` 文件中，使用 `main` 指定项目入口，同时使用 `module` 指定 ES Module 模式下的入口，以允许用户直接使用源码版本，例如：

```json
{
  "name": "6-1_test-lib",
  // ...
  "main": "dist/main.js",
  "module": "src/index.js",
  "scripts": {
    "prepublishOnly": "webpack --mode=production"
  },
  // ...
}
```

这部分内容与小册主题无关，这里只做简单介绍，感兴趣的同学可自行搜索相关资料。

## 总结

站在 Webpack 角度，构建 Web 应用于构建 NPM 库的差异并不大，开发时注意：

- 使用 `output.library` 配置项，正确导出模块内容；
- 使用 `externals` 配置项，忽略第三方库；
- 使用 `mini-css-extract-plugin` 单独打包 CSS 样式代码；
- 使用 `devtool` 配置项生成 Sourcemap 文件，这里推荐使用 `devtool = 'source-map'`。

遵循上述规则，基本上就能满足开发一个 NPM 库所需的大部分需求。另外，文章代码均已上传到 [小册仓库](https://github.com/Tecvan-fe/webpack-book-samples/tree/main/6-1\_test-lib)，建议大家 Clone 阅读。

## 思考题

有许多工具能被构建 NPM 库，例如 Webpack、Snowpack、Vite、Rollup 等，这些工具各有什么特点？你更倾向于使用哪种工具？