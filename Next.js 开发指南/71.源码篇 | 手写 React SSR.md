## 前言

讲了那么多遍 SSR，是不是对 SSR 感到很神奇？SSR 到底是怎么实现的呢？

本篇我们手写一个 Mini React SSR，借此来了解 SSR 的基本原理。千万不要觉得很难，其实很简单，让我们直接开始吧。

## Mini React CSR

我们先从 CSR 开始说起。如果对 CSR、SSR 这两个概念不太清楚，可以参考 [小册《渲染篇 | 从 CSR、SSR、SSG、ISR 开始说起》](https://juejin.cn/book/7307859898316881957/section/7309077054263066662)。

涉及的目录结构和文件如下：

```javascript
react-csr             
├─ app.js             
├─ client.js          
├─ index.html            
├─ package.json       
└─ webpack.client.js  
```

运行：

```bash
# 新建文件夹
mkdir react-csr && cd react-csr

# 自动生成 package.json
npm init
```

然后安装用到的依赖项：

```bash
npm install webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react react react-dom
```

其中：
1. webpack、webpack-cli 用于 webpack 打包
2. babel-loader、@babel/core、@babel/preset-env、 @babel/preset-react 用于编译 React
3. react、react-dom 用于书写 React 代码

新建 `index.html`，代码如下：

```html
<html>

<head>
  <title>Tiny React SSR</title>
</head>

<body>
  <div id='root'>
  </div>
  <script src="./index.js"></script>
</body>

</html>
```

我们的目标是用 webpack 打包 React 代码，生成 index.js。浏览器打开 `index.html`，直接查看效果。

我们开始写 React 代码，新建 `client.js`，代码如下：

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from'./app'

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

新建 `app.js`，代码如下：

```javascript
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counters { count } times</h1>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

代码逻辑很简单，就是我们初学 React 时，在 React 官网常看到的点击按钮更新次数的计数器例子。

因为 JavaScript 不能直接识别 React 的 JSX 格式，所以需要 webpack 和 babel 将 JSX 代码编译成普通的 JavaScript 代码。新建 `webpack.client.js`，代码如下：

```javascript
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './client.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', ["@babel/preset-react", { "runtime": "automatic" }]]
          }
        }
      }
    ]
  }
}
```

注：`webpack.client.js`是为了我们区分用于客户端还是服务端而起的名字，它不会像 `webpack.config.js`一样被自动读取。所以我们还需要在运行 webpack 命令的时候，指定该配置文件。

修改 `package.json`，添加新的脚本命令：

```javascript
{
  "scripts": {
    "start": "webpack --config webpack.client.js"
  }
}

```

此时运行 `npm start`，交互效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c3e0147d7ef4ac8ab936a311b6876e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1454\&h=752\&s=1182562\&e=png\&b=150722)

项目根目录会生成 `index.js`，浏览器打开 `index.html`，效果如下：

![csr.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c258223e5d5644cd980c2afa11a12fc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1185\&h=547\&s=76713\&e=gif\&f=23\&b=fdfdfd)

这就是一个典型的 CSR 例子。我们查看其 HTML 文件，也只有一个 root 节点，渲染都在客户端发生。

> 1. 功能实现：React CSR
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-csr-1>
> 3. 下载代码：`git clone -b react-csr-1 git@github.com:mqyqingfeng/next-app-demo.git`

## Mini React SSR

### 1. Step1：Express 起个服务

现在让我们实现 SSR。实现 SSR 需要起一个服务，我们借助 Express 来实现。

注：关于为什么使用 Express 而不是 koa2？主要考虑到以下几个因素：

1. Express 的使用远比 koa 更加广泛，根据 2022 年（虽然 2024 年了，但 2023 年还没有出来）的[后端框架统计](https://2022.stateofjs.com/en-US/other-tools/#backend_frameworks)：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43a89fcaca1046bb90c96aec6f3086f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3470\&h=1360\&s=445600\&e=png\&b=252325)

2. Express 内置的功能更加强大，生态更加丰富。语法上的差异随着 Node 的发展问题不大。更新频率上，两个框架都不算频繁，不过其本身设计就比较简单，更上层的应用还是应该用 Next.js 这类框架。

废话不多说，让我们开始吧！涉及的目录结构和文件如下：

```javascript
react-ssr                           
├─ pages                            
│  └─ index.js                                   
├─ package.json                     
├─ server.js                        
└─ webpack.server.js                
```

运行：

```bash
# 新建文件夹
mkdir react-ssr && cd react-ssr

# 自动生成 package.json
npm init
```

然后安装用到的依赖项：

```bash
npm install webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react react react-dom express
```

相比 CSR 的实现，多装了一个 express，毕竟我们需要 express 起个 Node 服务。

新建 `server.js`，代码如下：

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send(`
<html>
   <head>
       <title>Tiny React SSR</title>
   </head>
   <body>
    <div id='root'>
      Counters 0 times
    </div>
   </body>
</html>
`))

app.listen(3000, () => console.log('listening on port 3000!'))
```

运行 `node server.js`，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37d3af7c7fc04b30a95fdf1ffb59dbb0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1222\&h=374\&s=31291\&e=png\&b=ffffff)

说明 Express 启动成功。让我们继续写 SSR。

### 2. Step2：实现 SSR

修改 `server.js`，代码如下：

```javascript
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './pages/index'

const app = express()
const content = renderToString(<App />)

app.get('/', (req, res) => res.send(`
<html>
   <head>
       <title>Tiny React SSR</title>
   </head>
   <body>
    <div id='root'>${content}</div>
   </body>
</html>
`))

app.listen(3000, () => console.log('listening on port 3000!'))
```

新建 `pages/index.js`，代码如下：

```javascript
import React, { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counters { count } times</h1>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

运行 `node server.js`，此时肯定会报错，有两个原因：

1.  我们使用了 import 语法，这是 ES 规范，而非 Node.js 的 CommonJS 规范
2.  我们使用了 React 的 JSX 语法，JavaScript 并不认识，需要进行编译

为此我们需要使用 webpack、babel 进行打包，新建 `webpack.server.js`，代码如下：

```javascript
const path = require('path') 

module.exports = {
  mode:'development',
  target: 'node',
  entry: './server.js',       
  output: {                     
    filename: 'server.bundle.js',    
    path: path.resolve(__dirname, 'build')    
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  }
}
```

借助 webpack，我们将 server.js 代码和依赖项都打包到 build 下的 server.bundle.js，然后我们 node 命令启动server.bundle.js 即可。修改 `package.json`，添加脚本命令：

```javascript
{
  "scripts": {
    "start": "webpack --config webpack.server.js && node ./build/server.bundle.js"
  }
}

```

运行 `npm start`，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0c5a39c819f479483c0c75cb9777ffc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1584\&h=1162\&s=1634586\&e=png\&b=0a0418)

此时打开 `localhost:3000`，你会发现页面成功渲染：

![ssr.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/933a56251f624b4d91005cd387ae3c4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=776\&h=335\&s=24120\&e=gif\&f=27\&b=fefefe)

但是点击按钮毫无反应……

这是因为我们只是调用了 [renderToString](https://react.dev/reference/react-dom/server/renderToString) 将 React 组件树转为 HTML 字符串，并没有进行任何水合（事件绑定）相关的操作，自然只是输出静态的 HTML。查看返回的 HTML：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4a24132b8504240b2fdb850fa6e0909~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2966\&h=1174\&s=336584\&e=png\&b=fefefe)

借助 React 提供的 Server API —— renderToString，虽然没有绑定事件，但至少我们成功的实现了服务端渲染。

### 3. Step3：绑定事件

怎么绑定事件呢？

既然服务端渲染只能渲染 HTML，客户端渲染能绑定事件，那就结合一下。

我们再实现一遍 CSR， 让页面插入一个打包后的 bundle，挂载到 id 为 root 的 DOM 节点上。

也就是说，先在服务端调用 renderToString 将组件代码渲染到 HTML 中，再调用一遍客户端打包后的 bundle 代码，挂载到相同的节点，让客户端将一模一样的内容重新渲染一遍，并绑定上事件。

虽然同样的内容被渲染了 2 遍，但至少事件是绑定上去了。让我们先干起来：

涉及的目录和文件如下：

```javascript
react-ssr                           
├─ pages                            
│  └─ index.js                            
├─ client.js                                      
├─ package.json                     
├─ server.js                        
├─ webpack.client.js                
└─ webpack.server.js                
```

修改 `server.js`，代码如下：

```javascript
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './pages/index'

const app = express()
app.use(express.static('public'));
const content = renderToString(<App />)

app.get('/', (req, res) => res.send(`
<html>
   <head>
       <title>Tiny React SSR</title>
   </head>
   <body>
    <div id='root'>${content}</div>
    <script src="/client.bundle.js"></script>
   </body>
</html>
`))

app.listen(3000, () => console.log('listening on port 3000!'))
```

在这段代码中，我们声明了 public 为静态文件目录。

引用的 JS 文件地址为 `/client.bundle.js`，所以还需要新建 `public` 目录，我们会将客户端代码打包到 `client.bundle.js`，并放到 public 目录下。

新建 `client.js`，代码如下：

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from'./pages/index'

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

新建 `webpack.client.js`，代码如下：

```javascript
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './client.js',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', ["@babel/preset-react", { "runtime": "automatic" }]]
          }
        }
      }
    ]
  }
}
```

梳理下现在的流程：

我们先打包客户端 JS，将引用 `pages/index.js`核心 React 代码的 client.js 打包到 `public`下的 client.bundle.js 中。

然后将同样引用 `pages/index.js`核心 React 代码的 server.js 打包到 `build` 下的 server.bundle.js 中，然后 node 开启 server.bundle.js。

这样当访问 `localhost:3000`的时候，服务端会先渲染一遍组件代码，然后输出到 HTML 中，然后引用 client.bundle.js，然后用 JS 重新渲染一遍，并同时绑定上事件。

修改 `package.json`，代码如下：

```javascript
{
  "scripts": {
    "start": "webpack --config webpack.client.js && webpack --config webpack.server.js && node ./build/server.bundle.js"
  }
}

```

运行 `npm start`，打开 `localhost:3000`，交互效果如下：

\`![ssr-1.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48afcb5f165f4126bd02592140c8956a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1476\&h=525\&s=158768\&e=gif\&f=27\&b=fdfdfd)

此时既实现了服务端渲染，客户端也绑定上了事件，能够进行正常的点击操作。

### 4. Step4：hydrateRoot

目前最大的问题就是同样的内容渲染了两遍，为了解决这个问题，React 提供了 [hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)  API。

> hydrateRoot 函数允许你在先前由 react-dom/server 生成的浏览器 HTML DOM 节点中展示 React 组件。

简单的来说，我们常用的 createRoot 会重新渲染，hydrateRoot 会复用已有的 DOM 节点（当然前提是服务端和客户端渲染一致，这样才能够复用）。

hydrateRoot 通常就是搭配 React 的服务端 API react-dom/server 而使用的：react-dom/server 负责服务端渲染，hydrateRoot 负责复用 DOM 进行水合。

我们修改下 `client.js`，代码如下：

```javascript
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from'./pages/index'

hydrateRoot(document.getElementById('root'), <App />);
```

运行 `npm start`，打开 `localhost:3000`，交互效果如下：

\`![ssr-1.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d85ffa712d50484588fed502219a2aef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1476\&h=525\&s=158768\&e=gif\&f=27\&b=fdfdfd)

此时既实现了服务端渲染，客户端也绑定上了事件，也不会渲染 2 遍。

> 1. 功能实现：React SSR
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-ssr-1>
> 3. 下载代码：`git clone -b react-ssr-1 git@github.com:mqyqingfeng/next-app-demo.git`

## 总结

想想 Next.js 的 Pages Router，如果我们在 `pages/index.js` 中写入如下代码：

```javascript
import React, { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counters { count } times</h1>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

当访问 `/`的时候，会渲染该组件的内容。是不是跟我们现在的 Mini React SSR 很像？

不过这才刚刚开始，下篇让我们继续完善这个 Mini React SSR，并在此基础上实现 React SSG 与 React ISR。


