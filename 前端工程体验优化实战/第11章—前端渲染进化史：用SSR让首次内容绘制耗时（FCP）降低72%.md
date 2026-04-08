如何渲染页面决定了前端应用的用户体验，要想从根本上优化前端页面的加载表现，尤其是首次内容绘制（FCP）指标，改变前端应用的渲染方式是最强的杀手锏。

## 1. 前端应用渲染简史

让我们先回顾一下，前端应用渲染方式发展的历程，每个阶段的痛点及其解决方案。

### **早期服务端渲染：**

在2000年前后，HTTP协议和HTML诞生之初，还没有前端的概念，网页内容朴素，交互极为简单，HTML代码大都是用PHP等脚本语言在服务端以字符串形式拼接产生，并返回给用户客户端浏览器，直接渲染出完整页面。

### **客户端渲染：**

在2005年前后，随着JS语言`DOM`API的逐渐完善和前端`AJAX`异步数据交换的广泛应用，早期服务端渲染已无法满足网页交互日益复杂的需求，网页的开发复杂度越来越高、维护所需的专业性也越来越强，逐渐形成了独立的前端应用。

渲染方式也过渡到了**客户端渲染（Client Side Render，CSR）**  ，即主要由JS控制在浏览器中生成HTML标签和CSS样式，供用户浏览，并添加事件监听等逻辑，与用户交互。

这一阶段真正区分了前端与后端，社区中也陆续诞生了`jQuery`, `Angular.js`, `React.js`, `Vue.js`等一大批客户端渲染框架。

### **Node.js服务端渲染：**

但是客户端渲染的前端应用也有天然的痛点：

-   **用户体验有明显短板**：因为浏览器对JS的加载和解析执行需要一定时间，导致客户端渲染的前端应用都有初始化时页面白屏的问题。
-   **搜索引擎优化（SEO）不佳**：因为搜索引擎爬虫一般不支持执行JS，但CSR又必须执行JS后才能渲染出内容，所以无法适应爬虫的索引内容需求，导致CSR的前端应用在搜索引擎中排名靠后，流量减少。
-   **开发体验不佳**：前后端分离也带来了一些不便之处，例如：`index.html`模板维护在后端项目中，不便于前端工程师修改调试，造成了前端能力的缺陷。

所以，在2009年前后随着Node.js的诞生，伴随其独特的事件驱动非阻塞的特性，也产生了一批基于字符串拼接的**服务端渲染（Server Side Render，SSR）**  前端应用，致力于解决上述CSR的痛点。

2015年前后，`React.js`和`Vue.js`框架对服务端渲染增加了专门API支持，Node.js服务端渲染进而成为了近年来前端应用的主流架构之一，并且诞生了`Next.js`, `Nuxt.js`，`Gatsby`等一批专门的服务端渲染框架。

## 2. 服务端渲染 SSR 原理及同构架构简介

目前流行的SSR架构核心原理大都基于前端框架的2项能力实现，分别是：

### 1. Node.js服务端`renderToString(element: ReactElement)`：

这一能力能支持将基于前端框架编写的组件源代码渲染为HTML字符串，以便在Node.js端作为HTTP响应内容返回给用户，这个过程一般称之为渲染富文本字符串（`renderToString`）

例如`React.js`框架生态中`react-dom/server`库的`renderToString()`API：

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);  // 返回 HTML 富文本字符串
```

`Vue.js`框架生态中`vue/server-renderer`库的`renderToString()`API：

```js
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({  
  data: () => ({ count: 1 }),  
  template: `<button @click="count++">{{ count }}</button>`,
})
 
renderToString(app)
    .then((html) => {  
      console.log(html) // HTML 富文本字符串
    })
```

有了`renderToString`这项能力，我们就能把源代码转化为用户可以浏览的HTML内容，在服务端实现渲染页面的能力。

### 2. 浏览器客户端`hydrate(element: ReactElement, container: HTMLElement)`：

将Node.js端响应返回的HTML富文本在浏览器端，用JS遍历检查后，赋予事件监听等交互逻辑,这个过程一般称之为活化（`hydrate`）

例如`React.js`框架的`hydrate()`API：

```js
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
// 调用后，即可将 <App /> 组件的交互逻辑赋予 #root DOM 元素，让它“活”起来
```

> 注：React@18 版本后，活化使用的API变成了`hydrateRoot()`

有了活化`hydrate`能力，我们就能为`renderToString`返回的**无交互逻辑**HTML富文本，加上点击、输入、滚动等各类交互。

这种运行同一套源码，在客户端和服务端分别渲染出HTML的架构，业界称之为**同构**架构（Isomorphic）。

将CSR前端项目改为同构架构SSR架构，并没有想象中那么复杂，只需要200行左右的代码改造，就可以实现。

下面我们将继续使用[fe-optimization-demo](https://github.com/JuniorTour/fe-optimization-demo)示例项目，演示这一改造的流程。

## 3. 示例：200行代码将CSR前端项目重构为SSR

### 1. 新建Node.js服务器应用

首先，我们需要搭建一个Node.js Server用于：

-   接收用户请求，获取用户访问的URL等上下文数据，这次我们使用Express框架的`.get('*', handler)`API，接收所有路由的请求；
-   调用`renderToString()`，获取源码渲染后的HTML字符串；
-   把渲染后的HTML作为HTTP响应返回给用户；

> 完整代码示例请参考MR《CSR to SSR》：[https://github.com/JuniorTour/fe-optimization-demo/pull/4](https://github.com/JuniorTour/fe-optimization-demo/pull/4)

核心代码逻辑请看如下：

```js
// server\index.tsx
import { renderToString } from 'react-dom/server';
import express from 'express';

const app = express();
const PORT = 3000;

app.get('*', (req, res) => {
  const reqURL = req.url;
  const markup = renderToString(
    <div class="hello-ssr">Hello SSR! 你请求的URL是{reqURL}</div>,
  );
  // eslint-disable-next-line no-console
  console.log(`markup=${markup.substring(0, 100)}`);
  res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title>SSR Example</title>
  </head>
  <body>
    <div id="root">${markup}</div>
    <script src="/bundle.js"></script>
  </body>
</html>
  `);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR Server is listening on http://localhost:${PORT}`);
});
```

这段代码中，我们尚未把项目的组件源码（`<APP />`）作为参数传给`renderToString`，而是用了极其简单的组件`<div>Hello SSR...<div/>`，从而简化逻辑，便于理解。

但是这段代码用的是TSX语法，保存成了`.tsx`文件，Node.js无法直接运行，所以我们需要用Webpack，把这个文件编译成JS语法代码。

### 2. 配置服务器端Webpack打包编译

这一步的目标是：

-   将TSX语法的`.tsx`源文件编译为`.js`文件；
-   用 Node.js 运行时直接启动服务器应用；

我们的示例项目中已经有配置好了`babel-loader`等打包编译前端应用的基础配置文件：`common.config.js`，所以为服务器端新增Webpack的配置很简单，只需要基于这份基础配置，写13行代码：

```js
// webpack\server.config.js
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common.config');

module.exports = merge(common, {
  mode: 'development', // 便于开发调试，排查报错堆栈
  entry: path.resolve(__dirname, '../server/index.tsx'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist'),
  },
  target: 'node', // 目标环境为 Node.js
});
```

新建的这份配置，主要改动在于指定入口文件`entry`和产物文件`output`，并将打包构建目标环境为设置为Node.js（`target: 'node'`），专门用于打包编译Node.js服务器应用源码，生成Node.js运行时支持的JS语法代码。

下面，我们只需要在`package.json`中配置如下3个脚本命令，就可以通过执行`npm run build-server`打包编译，再用`npm run start-server`运行Node.js服务器应用：

```json
  "scripts": {
     // ...
    "build-server": "cross-env NODE_ENV=production webpack --config ./webpack/server.config.js",
    "start-debug-server": "node --inspect-brk ./dist/server.js",
    "start-server": "node ./dist/server.js",
  }
```

`start-debug-server`用于调试服务器应用。执行后，从浏览器的Devtool中就可以方便地调试Node.js应用，入口位置如下图： 

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0fdc3d414ca429997e266adb237ee09~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=542&h=658&s=37896&e=webp&b=1f1f1f)

服务器应用运行后，访问[http://localhost:3000/home/](http://localhost:3000/home/) ，就可以从Devtool的Network中看到，SSR服务器直接响应了我们指定的`div.hello-ssr`元素。

而CSR应用，响应的HTML中只会有最外层的`<div id="root"></div>`这一点代码。

如下图所示，在文档响应中就包含渲染后的完整HTML DOM，这也是SSR和CSR应用的核心区别。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54e246fcbe1b42c5983f50e4cdc404c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=934&s=57892&e=webp&b=2c2c2c)

但是目前并没有渲染我们写的前端组件源代码`<APP />`，所以还需要把`renderToString(element: ReactElement)`的参数，改成我们前端组件。

### 3. 增加服务端渲染中间件`serverRenderer(req, res)`

我们新建一个`server\renderer.tsx`文件，用来保存服务端渲染前端组件源代码的逻辑，并封装成一个`express`框架的中间件：

```js
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { App } from '../src/app/ui/app/app';
import { DIST } from '../webpack/constants';

function getIndexHTMLTemplate() {
  return readFileSync(resolve(DIST, 'index.html'), {
    encoding: 'utf-8',
  });
}

export function serverRenderer(req, res) {
  const context: StaticRouterContext = {};

  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>,
  );

  // eslint-disable-next-line no-console
  console.log(`markup=${markup.substring(0, 100)}`);

  if (context.url) {
    // eslint-disable-next-line no-console
    console.log(`context?.url=${context?.url}`);
    // 某处渲染了 `<Redirect />` 组件
    res.redirect(301, context.url);
  } else {
    res.send(
      getIndexHTMLTemplate().replace(
        '<div id="root"></div>',
        `<div id="root">${markup}</div>`,
      ),
    );
  }
}
```

这段代码中，我们把根组件`<App />`作为`renderToString(element: ReactElement)`的参数，从而让服务端得到用户渲染后的HTML富文本字符串，响应给用户。

并且，为了避免`react-router`的部分API依赖浏览器环境的问题，我们在服务端使用了不依赖浏览器的`<StaticRouter>`组件。

另外，对于前端路由触发重定向的情况，我们也通过检测`context.url`和`res.redirect(301, context.url)`进行了兼容处理。

最后，如果没有重定向，那么就可以直接调用`res.send()`，给用户响应服务端渲染出的HTML字符串了。

对于响应的HTML字符串，我们声明了`getIndexHTMLTemplate()`来提取客户端打包编译时`HtmlWebpackPlugin`生成的`index.html`作为模板文件，只替换`<div id="root">`中的内容即可。

| `react-router` API | 功能描述                 | 特点 | 用法示例 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [BrowserRouter](https://link.juejin.cn/?target=https%3A%2F%2Fv5.reactrouter.com%2Fweb%2Fapi%2FBrowserRouter "https://v5.reactrouter.com/web/api/BrowserRouter") | 在**浏览器**平台创建前端路由上下文。 | **依赖** HTML5 history API运行，只能在浏览器平台运行。 | `ReactDOM.hydrate( <BrowserRouter> <App /> </BrowserRouter>, document.getElementById('root'), );`                            |
| [StaticRouter](https://link.juejin.cn/?target=https%3A%2F%2Fv5.reactrouter.com%2Fweb%2Fapi%2FStaticRouter "https://v5.reactrouter.com/web/api/StaticRouter")    | 在**任意**平台创建前端路由上下文。  | **不依赖**任何浏览器平台API，可以在Node.js平台运行。      | `const html = ReactDOMServer.renderToString( <StaticRouter location={req.url} context={context}> <App /> </StaticRouter> );` |

最后，别忘了把`serverRenderer`函数设置为服务端路由的处理函数：`app.get('*', serverRenderer);`。

再次执行`npm run build-server`打包编译，我们会遇到重构的难点之一：解决各类打包运行问题。

### 4. 解决打包编译、运行时问题

首先，我们会在打包编译时遇到CSS编译报错：

```js
ERROR in ./shared/ui/spinner/index.module.css 1:0
Module parse failed: Unexpected character '@' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> @keyframes spinner-border {
|   to {
|     transform: rotate(360deg);
```

这是因为，我们的Webpack配置`server.config.js`没有处理CSS module的`loader`，将`webpack\production.config.js`中相关的`plugins.MiniCssExtractPlugin`、`module.rules.test: /.css$/`提取出来供`server.config.js`复用即可解决。

再次执行`npm run build-server`打包编译，就能成功了。

但是执行`npm run start-server`，还会再遇到一个报错：

```js
webpack:///../node_modules/tiny-invariant/dist/tiny-invariant.esm.js?:16
    throw new Error(value);
    ^

Error: Invariant failed: Browser history needs a DOM
    at invariant (webpack:///../node_modules/tiny-invariant/dist/tiny-invariant.esm.js?:16:11)
    at createBrowserHistory (webpack:///../node_modules/history/esm/history.js?:265:82)
    at eval (webpack:///./shared/router/model/store.ts?:14:76)
```

这个报错的原因，文案描述的很清楚，是因为源码中使用了`history`开源库的`createBrowserHistory` API，其需要基于浏览器环境的History API才能运行，但是Node.js环境没有这个API，所以运行时就报错了。

针对这种问题，各大开源库都有专门的Node.js 平台 API 可以替换，我们可以通过替换为不依赖浏览器环境的`createMemoryHistory`API来解决。

> 注：对比路由库的2类API：

| `history` API            | 功能描述                                         | URL 变化                       |
| ------------------------ | -------------------------------------------- | ---------------------------- |
| `createBrowserHistory()` | 基于**原生**HTML5 history API，创建保存前端应用路由记录数据的对象。 | 创建的历史记录对象状态变化时URL**会**随之变化。  |
| `createMemoryHistory()`  | 在**内存**中创建保存前端应用路由记录数据的对象。                   | 创建的历史记录对象状态变化时URL**不会**随之变化。 |

但是`createMemoryHistory` API，在浏览器中执行时，无法让浏览器地址栏的URL同步变化，这一点又不符合我们的用户需求，所以我们需要基于不同环境，使用不同的API。

具体来说，就是通过判断当前环境是浏览器客户端还是Node.js服务端，分别使用`createBrowserHistory`或`createMemoryHistory`：

```js
import { createMemoryHistory, createBrowserHistory, Location } from 'history';

const isBrowser = typeof window !== 'undefined';

export const history = isBrowser
  ? createBrowserHistory()
  : createMemoryHistory();
```

修改源码后，再次执行打包编译、运行服务器应用，就没有报错了。

访问本地环境的URL：[http://localhost:3000/home/](http://localhost:3000/home/) ，也能在Network中看到服务器直接在`div#root`中响应了组件源码渲染后的HTML：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37fa07773437456c8e9b3ec267b99de6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=934&s=85310&e=webp&b=2f2f2f)

所以总结起来，CSR架构的项目改为SSR架构，主要会遇到的问题和解决方案是：

| 问题 | 解决方案 |
| -------------------- | ------------------------------------------------------------------------------------- |
| 服务端打包编译配置与客户端不同步     | 按照报错提示，补充缺少loader、plugin等配置。                                                          |
| 服务端不支持浏览器API导致的运行时报错 | 区分环境，用`const isBrowser = typeof window !== 'undefined';`变量判断，分别使用Node.js环境和浏览器环境的API。 |

以上步骤完成，细看一下渲染出的页面，我们会发现页面中没有任何点击交互，甚至前端路由跳转都不生效。

这是因为我们还没有**活化**客户端。

### 5. `hydrate`活化客户端

所谓活化，具体来说就是把原来调用`react-dom`的`render(ReactComponent, containerElement)`方法进行的应用初始化，改为调用`hydrate(ReactComponent, containerElement)`方法。

这两者的区别主要是渲染结果：

|      | `render(ReactComponent, containerElement)`                                                     | `hydrate(ReactComponent, containerElement)`        |
| ---- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 渲染结果 | - 在`containerElement`容器元素内渲染出对应组件源码的HTML元素。<br/>- **同时**对`containerElement`容器元素内的各个元素添加源码对应的事件处理函数。 | - **只**对`containerElement`容器元素内的各个元素添加源码对应的事件处理函数。 |

对应的代码逻辑请看示例：

```js
import { StrictMode } from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';

// 把 <BrowserRouter /> 声明在 <APP /> 外层，
// 避免 serverRenderer 端执行渲染，因为没有浏览器API，导致报错
hydrate(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
```

另外还有一些细节要处理。

-   我们的JS、CSS等静态资源还没有加载，在本地环境我们用`express.static(DIST)`API来模拟一个CDN，把静态资源都部署到`/static`路径。
-   因为`<APP />`内部之前遗留的` <Router />`组件和`<BrowserRouter />`功能重复、逻辑冲突，我们要将其删除。
-   还有`common.config.js`中的`HtmlWebpackPlugin`，为了避免在`client`和`server`端构建时运行2次，生成2个`index.html`模板，我们加一个`process.env.BUILD_SERVER`环境变量来控制插件动态添加到配置中。
-   最后，为了便于我们同步打包编译client和server两套代码，我们对`package.json`中的`scripts`脚本命令也要做一些整理，实现用1行命令，构建2套代码：

```json
"scripts": {
    "build-server": "cross-env NODE_ENV=production BUILD_SERVER=true webpack --config ./webpack/server.config.js",
    "build-client": "cross-env NODE_ENV=production webpack",
    "build": "npm run build-client && npm run build-server",
}
```

再次运行`npm run build`，就能看到先后进行了client和server两套代码的打包编译。

运行`npm run start-server`，访问[http://localhost:3000/registration](http://localhost:3000/registration) 、[http://localhost:3000/login](http://localhost:3000/login) 等前端路由，点击、输入各类交互生效，页面也正常渲染：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ab20adc14444cfdaa29f03b5b1ab7ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=934&s=67524&e=webp&b=2e2e2e)

至此，我们将客户端渲染的CSR前端应用改为服务端渲染SSR架构的改造就完成了。

> 注：以上示例较为简略，完整的SSR应用，还需要处理开发环境、用户身份校验、服务端客户端状态同步（Redux相关）等问题，做更多验证。

但经过多年实践，开发者也逐渐地感受到了Node.js SSR服务端渲染也有许多显著痛点，主要有：

-   **服务器成本高昂**：相较于CSR应用，SSR应用需要更多的服务器硬件资源，更大的金钱开销。
-   **维护难度高：**  SSR应用需要开发者兼顾前端开发，后端开发和网络运维，对维护团队能力要求较高。

以笔者的经验而言，日活跃用户千万量级的前端应用项目，SSR应用的服务器硬件开销就会达到每月上百万元，维护团队也要有处理前端、后端和服务器运维等各类问题的复合能力。

与此同时，Node.js服务端渲染的发展变化日新月异，社区针对这些痛点也涌现了一批优化方案，致力于改善SSR的痛点，下面我们就来进一步学习SSR的进阶优化方案。
