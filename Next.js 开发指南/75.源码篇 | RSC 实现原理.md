## 前言

在[《源码篇 | 手写 RSC（下）》](https://juejin.cn/book/7307859898316881957/section/7309116033020018697)中，我们实现了 React RSC，最终的效果如下：

![react-rsc-7.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58ec60ed75da4278a424c4ba06b64ea4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1519\&h=784\&s=232270\&e=gif\&f=51\&b=272727)

本篇并不会拓展新的功能，而是会在此基础上进行优化，并讲解 RSC 与 Next.js 实现的基本原理。

如果没有实现之前的代码，可以运行：

```javascript
# 下载指定分支的代码
git clone -b react-rsc-8 git@github.com:mqyqingfeng/next-app-demo.git
# 进入目录并安装依赖项
cd next-app-demo && npm i
# 启动
npm start
```

## 优化一：解决重复调用

查看我们的 `generator.tsx`中的 htmlGenerator 函数代码：

```javascript
export async function htmlGenerator(url) {
  let jsx = <Router url={url} />
  let html = await renderJSXToHTML(jsx);
  const clientJSX = await renderJSXToClientJSX(jsx);
  // ...
}
```

运行 renderJSXToHTML 时我们递归调用了 Router 和子组件，运行 renderJSXToClientJSX 时，我们又递归调用了 Router 和子组件，这就造成了两次重复调用，如果数据变化（比如 feeds）就会产生问题，所以最好的解决方法是使用 clientJSX 渲染最终的 HTML。修改代码如下：

```javascript
export async function htmlGenerator(url) {
  let jsx = <Router url={url} />
  const clientJSX = await renderJSXToClientJSX(jsx);
  let html = await renderJSXToHTML(clientJSX);
  // ...
}
```

## 优化二：React renderToString

我们自定义的 renderJSXToHTML 其实对应的就是 React 的 renderToString 函数，我们直接修改为使用 renderToString。修改 `generator.tsx`中的 htmlGenerator 函数代码：

```javascript
import { renderToString } from 'react-dom/server';

export async function htmlGenerator(url) {
  let jsx = <Router url={url} />
  const clientJSX = await renderJSXToClientJSX(jsx);
  let html = await renderToString(clientJSX);
  // ...
}
```

## 优化三：服务拆分

在优化一中，我们已经将组件运行和生成 HTML 解耦：

首先，renderJSXToClientJSX 生成客户端 JSX 对象，再调用 renderToString 将客户端 JSX 转换为 HTML。

因为步骤相互独立，所以我们完全可以拆分为两个服务：

*   server/rsc.js： 负责生成客户端 JSX 对象
*   server/ssr.js： 负责渲染 HTML

现在让我们开始修改代码吧。

新建 `server/rsc.ts` 和 `server.ssr.ts`，为了能够同时运行，我们安装 [concurrently](https://www.npmjs.com/package/concurrently)：

```bash
npm i concurrently
```

修改 `package.json`，代码如下：

```javascript
{
  "scripts": {
    "start": "concurrently \"npm run start:ssr\" \"npm run start:rsc\"",
    "start:rsc": "tsx watch ./server/rsc.ts",
    "start:ssr": "tsx watch ./server/ssr.ts"
  }
}

```

其中`server/rsc.ts`代码如下：

```javascript
import express from "express";
import { jsxGenerator } from "../generator";

const app = express();

app.get("/:route(*)", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const clientJSXString = await jsxGenerator(url);
  res.setHeader("Content-Type", "application/json");
  res.end(clientJSXString);
});

app.listen(3001, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on 3001`);
});

```

`server/ssr.ts`代码如下：

```javascript
import express from "express";
import { readFile } from "fs/promises";
import { renderToString } from "react-dom/server";
import { parseJSX } from "../utils";

const app = express();

app.get("/:route(*)", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // client.js
  if (url.pathname === "/client.js") {
    const content = await readFile("./client.js", "utf8");
    res.setHeader("Content-Type", "text/javascript");
    res.end(content);
    return;
  }

  // 获取客户端 JSX 对象
  const response = await fetch("http://127.0.0.1:3001" + url.pathname);

  if (!response.ok) {
    res.statusCode = response.status;
    res.end();
    return;
  }

  const clientJSXString = await response.text();

  // 获取客户端 JSX 对象
  if (url.searchParams.has("jsx")) {
    res.setHeader("Content-Type", "application/json");
    res.end(clientJSXString);
  }
  // 获取 HTML
  else {
    const clientJSX = JSON.parse(clientJSXString, parseJSX);
    let html = renderToString(clientJSX);

    html += `<script>window.__INITIAL_CLIENT_JSX_STRING__ = `;
    html += JSON.stringify(clientJSXString).replace(/</g, "\\u003c");
    html += `</script>`;
    html += `
      <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev"
          }
        }
      </script>
      <script type="module" src="/client.js"></script>
    `;

    res.setHeader("Content-Type", "text/html");
    res.end(html);
  }
});

app.listen(3000, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on 3000`);
});
```

`utils.js`新增 parseJSX 函数：

```javascript
export function parseJSX(key, value) {
  if (value === "$RE") {
    return Symbol.for("react.element");
  } else if (typeof value === "string" && value.startsWith("$$")) {
    return value.slice(1);
  } else {
    return value;
  }
}
```

运行 `npm start`，此时效果应该是不变的：

![react-rsc-7.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6de7d1522f8646dc8644b260cfcb57be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1519\&h=784\&s=232270\&e=gif\&f=51\&b=272727)

## 原理解析

### 1. 原理图

现在让我们重新看下实现的原理。当页面初始加载时：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5a4c78d352a4173ab3af365cb4726e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1346\&h=990\&s=196101\&e=png\&b=ffffff)

当用户访问 `/` 的时候，请求首先会到 SSR server 上，然后 SSR server 请求 RSC server，RSC server 返回 `/`的 React 树，SSR server 获取到 React 树后，会根据 React 树渲染 HTML，最后将 HMTL 返回给用户。

当后续发生导航时：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72b6f1e0b01b4666b3a5f44581994c3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1454\&h=992\&s=221823\&e=png\&b=ffffff)

当用户发生导航行为时，客户端会拦截浏览器的默认跳转，改为客户端请求目标路径的数据。请求首先会到 SSR server，SSR server 根据其中的 ?jsx 参数判断出是获取客户端 JSX 对象，然后请求 RSC server，SC server 返回 `/`的 React 树，SSR server 获取到 React 树后，将 React 树返回给客户端，客户端根据 React 树修改 DOM。

### 2. 理解 Next.js 组件渲染原理

理解这个过程，有助于我们学习 Next.js。比如我们在 [《渲染篇 | 服务端组件和客户端组件》](https://juejin.cn/book/7307859898316881957/section/7309076661532622885#heading-12)讲到组件的渲染原理时：

在服务端：

Next.js 使用 React API 编排渲染，渲染工作会根据路由和 Suspense 拆分成多个块（chunks），每个块分两步进行渲染：

1.  React 将服务端组件渲染成一个特殊的数据格式称为 **React Server Component Payload (RSC Payload)**
2.  Next.js 使用 RSC Payload 和客户端组件代码在服务端渲染 HTML

> RSC payload 中包含如下这些信息：
>
> 1.  服务端组件的渲染结果
> 2.  客户端组件占位符和引用文件
> 3.  从服务端组件传给客户端组件的数据

在客户端：

1.  加载渲染的 HTML 快速展示一个非交互界面（Non-interactive UI）
2.  RSC Payload 会被用于协调（reconcile）客户端和服务端组件树，并更新 DOM
3.  JavaScript 代码被用于水合客户端组件，使应用程序具有交互性（Interactive UI）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8e343dc5c2c455596a8c3bd00e569cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1570\&h=854\&s=820753\&e=png\&b=111415#id=qIm8c\&originalType=binary\&ratio=1\&rotation=0\&showTitle=false\&status=done\&style=none\&title=)

你会发现，这个架构设计其实十分类似。不过目前客户端组件的实现还没有讲到，但单看服务端组件的部分，是不是对 Next.js 的实现有了更多的理解了？

### 3. 理解 Next.js 缓存机制

此外，我们在[《缓存篇 | Caching（上）》](https://juejin.cn/editor/book/7307859898316881957/section/7309077169735958565)时讲到 Next.js 中的四种缓存机制：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/123d757f5a07412185ba6bc69d5bc395~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=1179\&s=374811\&e=png\&b=0d0d0d)

现在再看其中的 RenderToPayload 和 RenderToHTML 是不是似曾相识？

按照我们目前的实现方式，所谓“全路由缓存”，就是在服务端缓存目标路由的客户端 JSX 对象和 HTML。

在后续导航的时候，目标路由的客户端 JSX 对象会发送给客户端，客户端根据这个客户端 JSX 对象进行更新，所谓“路由缓存”，其实就是将返回的客户端 JSX 对象缓存在浏览器中。

现在让我们顺手实现一下“路由缓存”。修改 `client.js`，代码如下：

```javascript
import { hydrateRoot } from 'react-dom/client';

let currentPathname = window.location.pathname;
const root = hydrateRoot(document, getInitialClientJSX());

// 客户端路由缓存
let clientJSXCache = {}
clientJSXCache[currentPathname] = getInitialClientJSX()

function getInitialClientJSX() {
  const clientJSX = JSON.parse(window.__INITIAL_CLIENT_JSX_STRING__, parseJSX);
  return clientJSX;
}

async function navigate(pathname) {
  currentPathname = pathname;

  if (clientJSXCache[pathname]) {
    root.render(clientJSXCache[pathname])
    return
  } else {
    const clientJSX = await fetchClientJSX(pathname);
    clientJSXCache[pathname] = clientJSX
    if (pathname === currentPathname) {
      root.render(clientJSX);
    }
  }
}

// 其他保持不变
```

实现并不复杂。页面初始加载的时候，将页面的客户端 JSX 对象保存在缓存中。导航的时候，如果没有命中缓存，则触发请求，然后将返回的结果保存在缓存中，如果命中缓存，则直接缓存中的数据。

效果如下：

![react-rsc-12.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b71937998054443bc68aadbd00ebb86~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1606\&h=1015\&s=325073\&e=gif\&f=77\&b=fafafa)

因为有了客户端路由缓存，所以只会触发一次 `earth?jsx`和 `hello?jsx`请求，后续点击的时候，使用的都是缓存中的数据。

现在是不是对 Next.js 的缓存有了更加深入的理解了？

> 1. 功能实现：优化了 RSC 实现和实现客户端路由缓存
> 2.  源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-9>
> 3.  下载代码：`git clone -b react-rsc-9 git@github.com:mqyqingfeng/next-app-demo.git`
