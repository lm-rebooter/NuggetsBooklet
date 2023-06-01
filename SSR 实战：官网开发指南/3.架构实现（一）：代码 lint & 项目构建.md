> 仓库地址：https://github.com/czm1290433700/ssr-server
>
> 备注：之后的课程，如果涉及到实际代码，文章顶部都会有对应的 demo 仓库来保证大家的学习可实操。同学们可以拷贝到本地运行，编辑试试，便于加深印象和学习理解。

从这节课开始，我们会用三节的篇幅来从零开始搭建一个 mvp 的服务器端渲染项目，带大家去深入了解现代 SSR 是如何实现的。

lint 和构建是前端工程化中经常会遇到的问题，针对开发者的不同，代码风格也是有差异的，对于多人开发项目，风格不同的代码往往使项目的可维护性变得糟糕。并且我们知道 JS 是一门弱类型语言，没有类型的 lint ，在大型项目中经常会遇到编译虽然不会报错，但是因类型隐性强转导致的代码效果与预期不符的问题。lint 会帮助我们来排查出这些问题，提高代码质量。**一个好的工程会有更完善的 lint机制和** **IDE** **提示来规范项目的代码规范，降低多人维护对项目易迭代性的折损** **。**

而构建是每个项目生产环境必不可少的步骤，因为我们项目中可能会用到 ES6 及以上或是 Typescript 等来提升代码的可维护性和开发效率，但是针对不同的浏览器，能支持的 ECMAScript 版本不同且 Typescript 也不可直接运行在浏览器环境，所以，我们需要通过构建来保证生产环境的项目可以顺利在不同浏览器下运行。

不同的项目代码 lint 和项目构建都会存在一些差异，在这个小节，我们将就这两个方面来从零带大家搭建一个具备相对完善 lint 的可构建服务器端项目。

# 代码 lint

Lint 从狭义角度上看是代码语法规则，风格上的限制。但从广义上看，项目中涉及到的代码样式、缩进及 commit 规则的限制都属于 lint 的范畴，我们就针对这三个方向学习下，如何建立工程的统一规范。

1.  ## 代码语法类型

针对项目的代码语法类型的规范，我们通常会使用 eslint 来进行代码层面的约束，它是一个插件化的 JavaScript 代码检测工具，可以开箱即用，其中制定的规范也相对完善，可以作为团队统一的一个标准。

首先我们在空项目（可以`npm init`初始化一个）执行下面的命令来安装对应的依赖。

```
npm install eslint eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser  --save-dev
```

然后我们用执行`npx eslint --init`来初始化一下 eslint 的配置，因为我们是一个 SSR 的项目，所以在配置的选择上，需要考虑以下几点。

-   技术栈：React，相对于大项目，React 具备更高的上限和可定制化能力，对函数式编程的思想也更容易领悟，所以针对大型项目，我更推荐大家用 React。

<!---->

-   是否使用 TypeScript：是，可以有效解决 JS 弱类型导致的相关隐性 Bug。

<!---->

-   运行环境：SSR 项目同时包括客户端和服务端，所以我们选用浏览器 + node 的环境。

<!---->

-   模块导入类型：因为包含客户端和服务端，node 层很难避免使用 require,，所以建议选用 ES Modules + Commonjs，没必要对这部分进行 lint 了。

具体的选择可以参考下面。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccf187e721034454a1b4cb6408aaddaf~tplv-k3u1fbpfcp-watermark.image?)

执行完成后会得到一个 .eslintrc.js 的文件，这时候 eslint 的初始化就已经完成了，我们在它的基础上加一些调整。

```
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    commonjs: true, // ADD, 支持对commonjs全局变量的识别
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-var-requires": "off", 
  },
};
```

在原来的基础上，我们在 env 的配置中加上了`commonjs: true`，这个是为了支持对 commonjs 全局变量的识别，然后移除了 lint 中的三个规则：

-   react/jsx-uses-react：必须增加对`import React from 'react';`的引入，在 React 17 之后，jsx 的页面已经不再需要引入 React了，所以我们去掉这条 lint 规则。

<!---->

-   react/react-in-jsx-scope：同上。

<!---->

-   @typescript-eslint/no-var-requires：禁用使用 require 来定义，node 很多相关的依赖没有对 es module 的定义，所以我们也去掉这条 lint 规则。

做到这里，eslint 相关的配置就可以了，可以简单试验一下。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9c1c1ca0d0f4a63b863e7b05b2865f7~tplv-k3u1fbpfcp-watermark.image?)

2.  ## commit lint

对于 commit 的 lint ，我们可以使用 commitlint 来实现，在项目终端中执行下面的脚本。

```
npm install --save-dev @commitlint/config-conventional @commitlint/cli

echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

如果是 Windows 系统的同学就不要执行`echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js`命令了，可能会导致生成 UTF-16 LE 编码的文件运行报错，可以直接在 VsCode 中生成文件，如下：

```
// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "revert"]],
    "subject-max-length": [1, "always", 30],
  },
};
```

其中 type-enum 是指 commit 正文的前缀，通常我们会用到这三种：

-   Feat：一个新的功能；

<!---->

-   Fix： 一次修复，之前已有问题的修复；

<!---->

-   Revert：一次回滚，书写异常代码后的撤销。

subject-max-length 则对应实际的 commit 长度（不包括前缀），这里我们设置为30

到这里，commitlint 的配置就可以了，我们可以简单实验一下。

```
echo 'add commitlint config' | npx commitlint
```


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c2fc4cf0ecf455780cdd61821396fcb~tplv-k3u1fbpfcp-watermark.image?)

```
echo 'feat: add commitlint config' | npx commitlint
```


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/842a0f6d219547e691e3795372ee08ea~tplv-k3u1fbpfcp-watermark.image?)

可以看到已经可以进行 commit 的限制了，不过这个和我们的预期还有一些出入，在 commit 前每次手动执行 commitlint 是很麻烦的，作为统一的规范也不现实，这里我们可以把 commitlint 加到 git 提供的 hook 中，作为 commit 前自然会做的事情，有一个依赖 husky可以帮助我们生成脚本文件，通过配置来自动做这个事情就不再需要去改动本地的 hook了。

执行下面的脚本来对 husky 初始化一下，**要注意** **，** **用这个脚本的前提是** **，** **这是一个** **git 仓库，因为我们也是对 git hook 进行脚本绑定** **。**

```
npm install husky --save-dev
npx husky install 
npx husky add .husky/pre-commit
```

执行完以后会生成一个钩子，目录结构是这样的：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41f44f33656c4f008da9245e7f4b0370~tplv-k3u1fbpfcp-watermark.image?)

其中 pre-commit 就是我们生成的钩子了，然后我们将 eslint 和 commitlint 的脚本替换undefined。

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx eslint src/**
npx --no-install commitlint --edit $1
```

然后我们再提交一下 commit 试试。

```
git commit -m "test"
```


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/069b0cfd4ade41d186d2408d930408d3~tplv-k3u1fbpfcp-watermark.image?)

可以看到如果其中有不符合预期的地方，将自动中断 commit 的进程，如果需要跳过这个检测，可以在脚本后面加上`--no-verify`，不过这样就失去 lint 的意义了，最好还是解决完相关的 error 阻塞问题再进行提交。

3.  ## 代码样式

一个多人合作的项目中，如果缺乏对代码样式的自动美化，那很可能出现下面的情况。

```
const a = () => {
    return 1;
}

const b = () => {
  return 2;
}
```

不同开发者的间隔或者是换行的习惯都不同，就导致项目代码百花齐放，对于维护同学来说，简直就是噩梦般的体验。解决这个问题，VsCode 给我们提供了很多代码美化插件，我们只需要在 IDE 上进行对应的配置就行，下面我们以 Prettier - Code formatter 来举例具体怎么操作。

首先我们到 VsCode 的应用商城里下载一下对应的插件。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b665c3563ddf409aa1ea07e8d744f446~tplv-k3u1fbpfcp-watermark.image?)

然后我们进入 IDE 顶部栏的 File -> Preferences -> Settings，并勾选 format on save，让我们在保存的时候默认格式化即可。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e235a35145da476da9106925b0f82f04~tplv-k3u1fbpfcp-watermark.image?)

最后一步我们随便打开一个文件，右键选择 Format Document With...，选择我们刚才下载的插件即可。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24089f566c8444729f4fb4ee36e9f280~tplv-k3u1fbpfcp-watermark.image?)

到这里，lint 相关的部分我们就配置完了，我们已经有了相对舒适的开发环境，爱捣鼓的同学也可以到 eslint、commitlint 等官网上阅读提供的更多字段，定制最符合自己习惯的 IDE。

# 项目构建

配置完 lint，我们就该想办法让我们的项目跑起来了。我们先创建一个 index.js 作为入口文件，然后简单写一点服务端代码。

```
npm install express --save
```

```
// ./src/index.js
const express = require("express");
const childProcess = require("child_process");

const app = express();

app.get("*", (req, res) => {
  res.send(`
    <html
      <body>
        <div>hello-ssr</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

我们用`node src/index.js`启动一下就可以看到：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f2a737278784e81862dd4dd8b9532a4~tplv-k3u1fbpfcp-watermark.image?)

但是因为我们要用 TS，Node 是不支持直接执行 TS 文件的，对于这个我们有两个方案去解决：

-   用 ts-node 去执行 TS 文件；

<!---->

-   用 Webpack 打包后，然后执行打包后的 bundle.js 文件。

这里我们最后选用的是第二种方案，原因在于项目出于生产的考虑，Webpack（或是其他构建工具类似 Vite) 是一定要有的，因为有使用 Webpack 别名的需求，如果使用 ts-node 没办法编译别名的模块，后期也没办法执行。

对第一种方案感兴趣的同学也可以结合我们本节课的 github 仓库的 commit history 来调试了解，对应记录是 **“** **[feat: ts-node对tsx的相关配置 & 使用 renderToString 在服务器渲染 JSX 页面](https://github.com/czm1290433700/ssr-server/commit/d33d6c41a226440dc9b6ccbd937a2173e5cb8186)** **”** **。**

在选好方案后，我们来对对应的文件进行打包，我们需要创建两个配置文件， webpack.base.js 和 webpack.server.js，其中 webpack.base.js 是通用的 Webpack 配置，因为后期还会新增对客户端的打包，其中有部分配置是相似的，所以这里我们抽出通用配置，用 merge 来进行合并。

```
// webpack.base.js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /.(ts|tsx)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
};
```

```
// webpack.server.js
const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
  mode: "development",
  entry: "./src/server/index.tsx",
  target: "node",
  output: {
    filename: "bundle.js",
    path: path.resolve(process.cwd(), "server_build"),
  },
});
```

编译的 loader 我们使用 babel-loader 和 ts-loader，分别用于构建 JS 和 TS 的代码。**这里需要把我们上面配置的文件目录改到 entry入口写的** **src** **/server/index.tsx**，并且安装一下相关的依赖。

```
npm install @babel/preset-env babel-loader ts-loader webpack webpack-merge webpack-cli --save-dev
```

换成 TS 后，我们需要调整一下 express 导入方式，使得可以读到. d.ts 中对应的依赖。

```
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";

const app = express();

app.get("*", (req, res) => {
  res.send(`
    <html
      <body>
        <div>hello-ssr</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

做完这些，Webpack 的部分就已经完工了，我们只需要再配置一下 tsconfig.json 用于 TS 代码的编译即可。

```
// tsconfig.json
{
  "compilerOptions": {
    "module": "CommonJS",
    "types": ["node"], // 声明类型，使得ts-node支持对tsx的编译
    "jsx": "react-jsx", // 全局导入, 不再需要每个文件定义react
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

这时候同学们可以在控制台中执行`npx webpack build --config ./webpack.server.js --watch`来进行编译， --watch 代表会监听入口文件的变化，有 diff 就会更新 build 内容进行热更新，这时候大家可能会遇到下面的报错：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0b7d9e98cda49a488a86ddc5aaa6370~tplv-k3u1fbpfcp-watermark.image?)

是因为我们使用了 express，但是 express 是没有内置 .d.ts 的类型定义的，我们需要额外安装对应的类型定义依赖。

```
npm install @types/express --save-dev
```

这时候我们再试试上面的构建命令：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa49ddbb71af4b6bbaf8f01c255f7aa8~tplv-k3u1fbpfcp-watermark.image?)

成功了，可以看到目录下也会生成一个 server_build/bundle.js 的构建文件，我们尝试执行它。

```
node server_build/bundle.js
```

发现可以打开和上面一样的页面，就说明我们已经配置构建成功了！


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8977f20408f4c6598056c1e716ac245~tplv-k3u1fbpfcp-watermark.image?)

不过现在还有一个问题，后面我们开发每次编辑以后都需要重新运行 node，来执行最新的代码，这样开发的效率无疑是很低效的，我们可以使用 nodemon 来替代 node 来运行这个脚本，它提供了对运行文件监听的能力，当我们的文件修改的时候，它也会同步进行热更新，不需要我们重新去启动了。

```
npm install nodemon --save-dev
```

为了后面运行方便，每次不写这么长的脚本，我们可以在 package.json 中加入构建和启动的常用的命令。

```
// package.json
"scripts": {
    "start": "npx nodemon --watch src server_build/bundle.js",
    "build:server": "npx webpack build --config ./webpack.server.js --watch",
 }
```

后面我们启动项目，只需要执行下面的命令就可以了，很方便快捷。

```
npm run build:server
npm run start
```

# 小结

本节是架构实现篇的第一节，主要是架构实现前的准备工作。在这节课中，我们介绍了 lint 重要意义，以及我们应该怎么进行规范的代码开发，同时我们对项目进行打包构建的等工作，使得我们的项目可以用于生产，并且提供了必要的构建和启动脚本。相信大家在学习完以后，对工程的规范和我们的项目是怎么启动起来的都有了比较深刻的认识。

下一节开始，我们将围绕服务器端的核心原理 - 同构来手写一个 SSR 项目，工作量和学习量都不小，大家可以对照这节的案例先完成初始工作，仔细思考沉淀下来~