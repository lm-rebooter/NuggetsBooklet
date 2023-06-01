传统 Web 开发强调样式、结构、逻辑分离，以此降低技术复杂度。但 React 认为渲染逻辑本质上与其它 UI 逻辑存在内在耦合关系，所以提倡将结构、逻辑与样式共同存放在同一文件中，以“组件”这种松散耦合结构实现关注点分离，并为此设计实现了一套 [JavaScript-XML](https://zh-hans.reactjs.org/docs/introducing-jsx.html)\(JSX\) 技术，以支持在 JavaScript 中编写 Template 代码，如：

```JavaScript
import React from 'react';

const Component = () => {
  return <div className="hello">hello world</div>
}
```

为支持这一特性，我们需要搭建一套使用的工程化环境，将 JSX 及 React 组件转换为能够在浏览器上运行的 JavaScript 代码。本文将递进介绍使用 Webpack 搭建 React 应用开发环境的主要方法，包括：

- 如何使用 `Babel` 处理JSX文件？
- 如何使用 `html-webpack-plugin`、`webpack-dev-server` 运行 React 应用？
- 如何在 React 中复用 TypeScript、Less 等编译工具？
- 如何搭建 React SSR 环境？
- 如何使用 Create React App？


## 使用 Babel 加载 JSX 文件

绝大多数情况下，我们都会使用 JSX 方式编写 React 组件，但问题在于浏览器并不支持这种代码，为此我们首先需要借助构建工具将 JSX 等价转化为标准 JavaScript 代码。

在 Webpack 中可以借助 `babel-loader`，并使用 React 预设规则集 `@babel/preset-react` ，完成 JSX 到 JavaScript 的转换，具体步骤：

1. 安装依赖：

```Bash
yarn add -D webpack webpack-cli babel-loader @babel/core @babel/preset-react
```

2. 修改 Webpack 配置，加入 `babel-loader` 相关声明：

```JavaScript
module.exports = {
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        }
      },
    ],
  },
};
```

3.  执行构建命令，如 `npx webpack` 。

经过 `babel-loader` 处理后，JSX 将被编译为 JavaScript 格式的 `React.createElement` 函数调用，如：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11c6cca0522148af9ebb80368613802f~tplv-k3u1fbpfcp-watermark.image?)


此外，JSX 支持新旧两种转换模式，一是上图这种 `React.createElement` 函数，这种模式要求我们在代码中引入 React，如上图的 `import React from "react"`；二是自动帮我们注入运行时代码，此时需要设置 `runtime:automatic`，如：

```JavaScript
{
  test: /\.jsx$/,
  loader: 'babel-loader',
  options: {
    "presets": [
      ["@babel/preset-react", {
        "runtime": "automatic"
      }]
    ]
  }
}
```


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8949ce39cad48529a72e827e189e53d~tplv-k3u1fbpfcp-watermark.image?)

这种模式会自动导入 `react/jsx-runtime`，不必开发者手动管理 React 依赖。
  

> 加载 CSS 文件

注意，上例 Webpack 配置还无法处理 CSS 代码：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b7f0da0a54a468c850603553e8108a7~tplv-k3u1fbpfcp-watermark.image?)


为此需要添加 CSS 加载器，如 `css-loader/style-loader`，如：

```JavaScript
module.exports = {
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        options: {
          'presets': [["@babel/preset-react", {
            "runtime": "automatic"
          }]]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
};
```

相关用法已在其它章节有详细介绍，此处不再赘述。

## 运行页面

上例接入的 `babel-loader` 使得 Webpack 能够正确理解、翻译 JSX 文件的内容，接下来我们还需要用 `html-webpack-plugin` 和 `webpack-dev-server` 让页面真正运行起来，配置如下：

```JavaScript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  module: {/*...*/},
  devServer: {
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  </head>
  <body>
    <div id="app" />
  </body>
</html>
    `
    })
  ]
};
```

之后，运行 `npx webpack serve` 命令，即可自动打开带热更功能的页面：


![c100d66f-156d-4600-96c2-2838e70ac59b.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f41ba0c2c6ed4c57b5576ab8f8067b9a~tplv-k3u1fbpfcp-watermark.image?)

  

## 复用其它编译工具

与 Vue 类似，在 React 开发环境中我们也可以搭配其它工程化工具提升开发效率、质量，包括：

- 使用 `babel-loader`、`ts-loader` 加载 TSX 代码；
- 使用 `less-loader`、`sass-loader` 预处理样式代码。
  

> 使用 TSX

社区有两种主流的 TSX 加载方案，一是使用 Babel 的 `@babel/preset-typescript` 规则集；二是直接使用 `ts-loader`。先从 Babel 规则集方案说起：

1. 安装依赖，核心有：

```JavaScript
yarn add -D typescript @babel/preset-typescript
```

2. 修改 Webpack 配置，添加用于处理 TypeScript 代码的规则：

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx$/,
        loader: 'babel-loader',
        options: {
          'presets': [["@babel/preset-react", {
            "runtime": "automatic"
          }],
          '@babel/preset-typescript']
        }
      },
    ],
  },
}
```

之后，将组件文件后缀修改 `.tsx`，Babel 就会帮我们完成 TypeScript 代码编译。`ts-loader` 用法也很相似：

1. 安装依赖：

```Bash
yarn add -D typescript ts-loader
```

2. 修改 Webpack 配置，添加 `ts-loader` 规则：

```JavaScript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: 'ts-loader',
      },
    ],
  }
};
```

3. 修改 `tsconfig.json` 文件，添加 `jsx` 配置属性：

```JavaScript
{
  "compilerOptions": {
    //...
    "jsx": "react-jsx"
  }
}
```

完毕。两种方式功能效果相似，相对而言我个人更倾向于 `babel-loader`，因为 Babel 是一种通用的代码编译工具，配置适当 Preset 后能做的事情更多，相关经验更容易复用到其它场景。


> 使用 CSS 预处理器

类似的，我们还可以使用 Less/Sass/Stylus 等语言开发 CSS 代码，接入过程与上述 TypeScript 相似，以 Less 为例，首先安装依赖：

```Bash
yarn add -D less less-loader css-loader style-loader
```

其次，修改 Webpack 配置，添加 Less 文件相关处理规则：

```JavaScript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: 'ts-loader',
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};
```

之后，引入相关样式文件`.less`，然后，Webpack 就会使用 `less-loader` 加载这一模块内容。

> 提示：其它 CSS 相关工具，如 Sass、Stylus、PostCSS 均遵循同样规则。

## 实现 Server Side Render

在上一章节介绍如何搭建 Vue 开发环境时，已经就 SSR 的基本概念与各项优缺点做了详细阐述，这里我们就直接进入主题吧。React 有许多实现 SSR 的方案，例如：[Next.js](https://github.com/vercel/next.js)、[egg-react-ssr](https://github.com/zhangyuang/egg-react-ssr)、[ssr（基于egg-react-ssr）](https://github.com/zhangyuang/ssr) 等，接下来我们尝试使用 Webpack、React、Express 搭建一套 React SSR 应用环境，一步步剖析关键技术点。示例代码目录结构(示例代码已上传到小册[仓库](https://github.com/Tecvan-fe/webpack-book-samples/blob/main/react-ssr/package.json))：

```Bash
├─ react-ssr-example
│  ├─ package.json
│  ├─ server.js
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ entry-client.jsx
│  │  ├─ entry-server.jsx
│  ├─ webpack.base.js
│  ├─ webpack.client.js
│  └─ webpack.server.js
```

1. 首先，需要为客户端环境准备项目入口文件 —— `entry-client.js`，内容：

```JavaScript
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
```

2. 为服务端环境准备入口文件 —— `server-client.js`，内容：

```JavaScript
import React from 'react'
import express from 'express';
import App from './App'
import { renderToString } from 'react-dom/server';

// 通过 manifest 文件，找到正确的产物路径
const clientManifest = require("../dist/manifest-client.json");

const server = express();

server.get("/", (req, res) => {

  const html = renderToString(<App/>);

  const clientCss = clientManifest["client.css"];
  const clientBundle = clientManifest["client.js"];

  res.send(`
<!DOCTYPE html>
<html>
    <head>
      <title>React SSR Example</title>
      <link rel="stylesheet" href="${clientCss}"></link>
    </head>
    <body>
      <!-- 注入组件运行结果 -->
      <div id="app">${html}</div>
      <!-- 注入客户端代码产物路径 -->
      <!-- 实现 Hydrate 效果 -->
      <script src="${clientBundle}"></script>
    </body>
</html>
    `);
});

server.use(express.static("./dist"));

server.listen(3000, () => {
  console.log("ready");
});
```

上例代码核心逻辑：

- 引入客户端 React 根组件，调用 `renderToString` 将其渲染为 HTML 字符串；
- 获取客户端打包产物映射文件 `manifest` 文件，然后将组件 HTML 字符串与 `entry-client.js` 产物路径注入到 HTML 中，并返回给客户端。

3.  分别为客户端、服务端版本编写 Webpack 配置文件，即上述目录中的三个 `webpack.*.js` 文件。其中：

    1.  `base` 用于设定基本规则；
    2.  `webpack.client.js` 用于定义构建客户端资源的配置：

```JavaScript
const Merge = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const base = require("./webpack.base");

// 继承自 `webpack.base.js`
module.exports = Merge.merge(base, {
  entry: {
    // 入口指向 `entry-client.js` 文件
    client: path.join(__dirname, "./src/entry-client.jsx"),
  },
  output: {
    filename: 'index.js',
    publicPath: "/",
  },
  module: {
    rules: [{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }],
  },
  plugins: [
    // 这里使用 webpack-manifest-plugin 记录产物分布情况
    // 方面后续在 `server.js` 中使用
    new WebpackManifestPlugin({ fileName: "manifest-client.json" }),
    // 生成CSS文件
    new MiniCssExtractPlugin({
      filename: 'index.[contenthash].css'
    }),
    // 自动生成 HTML 文件内容
    new HtmlWebpackPlugin({
      templateContent: `
    <!DOCTYPE html>
    <html>
    <head>
  <meta charset="utf-8">
  <title>Webpack App</title>
    </head>
    <body>
  <div id="app" />
    </body>
    </html>
  `,
    }),
  ],
});
```

> 注意：
> 
> - 这里我们需要使用 `webpack-manifest-plugin` 插件记录产物构建路径，之后才能在 `server.js` 中动态注入 HTML 代码中；
> - 示例代码还用到 `mini-css-extract-plugin` ，将 CSS 从 JS 文件中抽离出来，成为一个单独的文件。

5. 在 `webpack.server.js` 定义构建服务端资源的配置：

```JavaScript
const Merge = require("webpack-merge");
const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const base = require("./webpack.base");

module.exports = Merge.merge(base, {
  entry: {
    server: path.join(__dirname, "./src/entry-server.jsx"),
  },
  target: "node",
  output: {
    // 打包后的结果会在 node 环境使用
    // 因此此处将模块化语句转译为 commonjs 形式
    libraryTarget: "commonjs2",
    filename: 'server.js'
  },
  module: {
    rules: [{
      test: /.css$/,
      loader: './loader/removeCssLoader'
    }]
  },
});
```

大部分配置与普通 Node 应用相似，唯一需要注意的是：在 SSR 中，通常由客户端代码提前做好 CSS 资源编译，对服务端而言只需要支持输出构建后的 CSS 文件路径即可，不需要关注 CSS 具体内容，因此通常会用一个简单的自定义 Loader 跳过 CSS 资源，如：

```JavaScript
module.exports = () => {
  return 'module.exports = null';
};
```

接下来，我们只需要调用适当命令即可分别生成客户端、服务端版本代码：

```Bash
# 客户端版本：
npx webpack --config ./webpack.client.js
# 服务端版本：
npx webpack --config ./webpack.server.js 
```

3. 至此，SSR 的工程化框架搭建完毕，接下来可以开始编写任何 React 代码，例如：

```JavaScript
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [isActivity, setIsActivity] = useState(false);

  const handleClick = () => {
    setIsActivity(!isActivity);
  };

  return (
    <div>
      <h3 className={`main ${isActivity ? 'activate' : 'deactivate'}`}>Hello World</h3>
      <button onClick={handleClick}>Toggle</button>
    </div>
  );
};

export default App;
```

之后，编译并执行 `node ./dist/server.js` 启动 Node 应用，访问页面时服务端将首先返回如下 HTML 内容：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2898268b18f4d85ad36eff2b64b79c0~tplv-k3u1fbpfcp-watermark.image?)

页面也能正常运行 `App.jsx` 交互效果：


![840a136d-fe81-42fc-93e0-3d7063c43949.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae1b5a2d37db4d86ba5a7282a049a0ef~tplv-k3u1fbpfcp-watermark.image?)


> 提示：
> - 实际项目中建议使用更成熟、完备的技术方案，如 Next.js；
> - 建议大家拉取[示例代码](https://github.com/Tecvan-fe/webpack-book-samples/blob/main/react-ssr/package.json)，阅读学习。

总的来说，React 的 SSR 实现逻辑与 Vue 极为相似，都需要搭建对应的 Client、Server 端构建环境，之后在 Server 端引入组件代码并将其渲染为 HTML 字符串，配合 `manifest` 记录的产物信息组装出完整的 Web 页面代码，从而实现服务端渲染能力。

  
## 使用 Create React App

综上，手动配置 React 开发环境的过程复杂且繁琐的，如果每次构建项目都需要从零开始使用 Webpack、Babel、TypeScript、Less、Mocha 等工具搭建项目环境，那对新手、老手来说都是极高的门槛和心智负担。

好在社区已经将大量重复、被验证有效的模式封装成开箱即用的脚手架工具，包括：

- [Create React App](https://create-react-app.dev/)：是官方支持的创建 React 应用程序的方式，提供免配置的现代构建开发环境；
- [Modern JS](https://modernjs.dev/)：字节跳动开源的现代 Web 工程体系。

这些工具能够快速生成一套健壮的 React 开发环境，以 [Create React App](https://create-react-app.dev/) 为例，只需执行一条简单命令：

```Bash
npx create-react-app my-app
```

之后，[Create React App](https://create-react-app.dev/) 会自动安装项目依赖，项目环境就算是搭建完毕了。

[Create React App](https://create-react-app.dev/) 提供的默认配置已经能够满足许多场景下的开发需求，必要时开发者还可以通过[customize-cra](https://github.com/arackaf/customize-cra) 和 [react-app-rewired](https://github.com/timarney/react-app-rewired) 修改工程化配置，例如：

```JavaScript
const { override, addLessLoader } = require("customize-cra");

module.exports = override(
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    cssLoaderOptions: {}, 
    cssModules: {
      localIdentName: "[path][name]__[local]--[hash:base64:5]", 
    },
  }) 
));
```

然后修改 Script 运行脚本：

```JSON
"scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}
```

> 提示：更多信息可参考 Create React App 官网 **[Working with Webpack](https://cli.vuejs.org/guide/webpack.html#simple-configuration)** 一节。


## 总结

本文介绍如何使用 Webpack 开发 React 应用，从最基础的 JSX 代码编译；到如何使用 TypeScript、Less 等基础编译工具；再到如何搭建 React SSR 应用；最后介绍如何使用 [Create React App](https://create-react-app.dev/) 迅速搭建开发环境。

就我个人而言，多数情况下我都会选择使用 Create React App 或其它脚手架工具快速搭建开发框架，但多数时候又必须 [`eject`](https://create-react-app.dev/docs/available-scripts/#npm-run-eject) 出具体配置信息之后手动修改，实现一些定制化需求，此时就需要用上上面介绍的这些知识点。

  

## 思考题

React JSX 经过 Webpack 转换后的结果与 Vue SFC 转换结果极为相似，为何 Vue 不能复用 Babel 而选择开发一个独立的 `vue-loader` 插件？