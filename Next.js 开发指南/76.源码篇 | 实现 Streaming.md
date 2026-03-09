## 前言

在[《 源码篇 | RSC 实现原理》](https://juejin.cn/book/7307859898316881957/section/7309115864737611827)中，我们优化了 React RSC 的实现，最终的效果如下：

![react-rsc-12.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d98817c58b744efa83bd9da9dc28d2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1606\&h=1015\&s=325073\&e=gif\&f=77\&b=fafafa)

导航的时候，其实获取的是目标页面的 JSX 对象，但在 Next.js 中，返回的其实是针对流进行过优化的特殊格式，我们称之为 RSC Payload，效果如下：

![截屏2024-04-16 15.49.37.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da1954ff6701460d97d007212800bb2a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4366\&h=1432\&s=619356\&e=png\&b=fcfbfb)

此外 Next.js 也支持 `<Suspense>` 组件：

```jsx
import { Suspense } from 'react'

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function PostFeed() {
  await sleep(2000)
  return <h1>Hello PostFeed</h1>
}

export default function Dashboard() {
  return (
    <section>
      <Suspense fallback={<p>Loading PostFeed Component</p>}>
        <PostFeed />
      </Suspense>
    </section>
  )
}
```

但目前我们的实现并不支持 Suspense 组件，因为我们使用自定义的 renderJSXToClientJSX 获取页面 JSX 对象时，并不支持识别 Suspense 组件。

本篇我们会在[《 源码篇 | RSC 实现原理》](https://juejin.cn/book/7307859898316881957/section/7309115864737611827)的实现基础上，实现 Streaming 并且支持 `<Suspense>` 组件。如果没有实现之前的代码，可以运行：

```javascript
# 下载指定分支的代码
git clone -b react-rsc-9 git@github.com:mqyqingfeng/next-app-demo.git
# 进入目录并安装依赖项
cd next-app-demo && npm i
# 启动
npm start
```

## 实现思路

该如何实现 Streaming 效果呢？

其实 React 提供了 [react-server-dom-webpack](https://www.npmjs.com/package/react-server-dom-webpack?activeTab=readme) 用于处理 RSC，尽管它现在都没有正式的介绍，查看 [GitHub 仓库](https://github.com/facebook/react/tree/main/packages/react-server-dom-webpack)，也只有简短的说明：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4b4d50859ee445f86834a027f397ce1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1866\&h=376\&s=63394\&e=png\&b=ffffff)

其中 Flight 是 RSC 的代号，简单来说，就是该功能还在实验中，使用 Webpack 用于 RSC DOM 绑定，可以自己玩着玩，但不能用于生产……

虽然介绍很少，但在 [React Flight](https://github.com/facebook/react/blob/734956ace6450bc0c95d8d749dee74f4a140597b/fixtures/flight/src/index.js#L4) 以及 [server-components-demo](https://github.com/reactjs/server-components-demo/blob/main/server/api.server.js) 都可以看到它的身影。而我们今天的实现也要用到 react-server-dom-webpack，所以我们先介绍一下它的基本用法（以下都是我摸索出来的，最终用法还尚未确定）。

当在服务端使用的时候：

```javascript
import { renderToPipeableStream } from "react-server-dom-webpack/server.node"

app.get("/", async (req, res) => {
  const { pipe } = renderToPipeableStream(<App />);
  pipe(res);
});
```

它会将组件渲染成下图这种流格式：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c15cb01077e4403ab166d6ffec04a86~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3858\&h=868\&s=426399\&e=png\&b=fefefe)

而在客户端使用的时候，如果是在浏览器环境：

```javascript
import { createFromFetch } from "react-server-dom-webpack/client"

let data = createFromFetch(
  fetch(currentPathname + '?jsx')
)
```

data 是一个包含页面 JSX 对象的 Promise，你可以这样读取其中的值：

```javascript
data.then((jsx) => {
  hydrateRoot(document, jsx)
})
```

但为了优雅一点，可以结合 React 的 [use hook](https://react.dev/reference/react/use#) 来使用：

```javascript
function Shell({ data }) {
  const [root, setRoot] = useState(use(data))
  return root
}

hydrateRoot(document, React.createElement(Shell, { data }))
```

这里我们构建了一个空壳 Shell 组件，并将 JSX 对象设置为状态，这样当调用 setRoot 的时候，页面内容就会更新。

如果是在 Node 环境（就比如 SSR Server）：

```javascript
import { createFromNodeStream } from "react-server-dom-webpack/client"

const root = await createFromNodeStream(stream, {})
```

root 最终是页面的 JSX 对象。因为是流，可以结合 react-dom/server 的 [renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream) 来使用：

```javascript
app.get("/", async (req, res) => {
  const { pipe } = renderToPipeableStream(root)
  pipe(res)
});
```

让我们再回顾下之前的实现方案：

页面首次加载时，RSC Server 负责生成页面的 JSX 对象，SSR Server 负责生成 HTML，页面 client.js 调用 `hydrateRoot(document, getInitialClientJSX())`水合页面。在后续导航时，获取目标页面的 JSX 对象，调用 `root.render(clientJSX)` 进行更新。

但是鉴于 react-server-dom-webpack 的特殊使用方式，新的实现方案为：

页面首次加载时，RSC Server 负责生成页面的 RSC Payload，SSR Server 负责生成 HTML，页面 client.js 调用`createFromFetch()`获取页面 JSX 对象，调用 `hydrateRoot(document, jsx)`水合页面。在后续导航时，依然用 createFromFetch 获取目标页面 JSX 对象，借助空壳 Shell 组件的更新状态函数，实现页面更新。

其核心代码实现是：

```javascript
// fetch 返回的是页面的 RSC Payload，createFromFetch 返回的是包含页面 JSX 对象的 Promise
let data = createFromFetch(fetch(currentPathname + '?jsx'))

let updateRoot

function Shell({ data }) {
  // 使用 use(data) 读取页面 JSX 对象
  const [root, setRoot] = useState(use(data))
  updateRoot = setRoot
  return root
}

// 首次加载的时候使用页面的 JSX 对象水合页面
hydrateRoot(document, React.createElement(Shell, { data }))

// 后续导航时更新状态
async function navigate(pathname) {
  const root = await createFromFetch(fetch(pathname + '?jsx'))
  updateRoot(root)
}
```

如果你还不理解，没有关系，我们边写边理解吧！

## Step1：实现 RSC Payload

首先安装依赖，为了保持与 React、React DOM 与 react-server-dom-webpack 版本一致，我们统一使用 `18.3.0-canary-c3048aab4-20240326` 这个版本：

```javascript
npm i react@18.3.0-canary-c3048aab4-20240326 react-dom@18.3.0-canary-c3048aab4-20240326 react-server-dom-webpack@18.3.0-canary-c3048aab4-20240326
```

注：为什么使用这个版本呢？翻看 react-server-dom-webpack npm 的[版本记录](https://www.npmjs.com/package/react-server-dom-webpack?activeTab=versions)，这是 18.3.0 版本最新的一版。下一版本就是 19.0.0 了，鉴于 React 的最新版本才 18.2.0，我们继续使用 v18。

修改 `generator.tsx`，代码如下：

```javascript
import { renderToPipeableStream } from "react-server-dom-webpack/server.node"

// 注意是普通函数，而非 async 函数
export function jsxGenerator(url) {
  return renderToPipeableStream(<Router url={url} />)
}
```

修改 `server/rsc.ts`，代码如下：

```javascript
app.get("/:route(*)", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pipe } = jsxGenerator(url);
  pipe(res)
});
```

此时我们就完成了 RSC 组件的流式渲染。但命令行会出现报错：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a483f88806a44bccbf4605ad64e7a13c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2382\&h=250\&s=109585\&e=png\&b=1f1f1f)

这是因为 React Server Components 需要 `react-server` condition（关于 condition，参考 [Node 官方文档](https://nodejs.org/api/cli.html#-c-condition---conditionscondition)）。

我们修改 `package.json`，代码如下：

```javascript
{
  "scripts": {
    "start": "concurrently \"npm run start:ssr\" \"npm run start:rsc\"",
    "start:rsc": "tsx watch --conditions=react-server ./server/rsc.ts",
    "start:ssr": "tsx watch ./server/ssr.ts"
  }
}

```

运行 `npm start`，你会发现此时还是有报错，页面也是空白。但是没有关系，我们慢慢解决，访问 <http://localhost:3001/hello>，也就是直接访问 RSC 服务，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5eba44e5a1d417d9e65825058a455d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3858\&h=868\&s=426399\&e=png\&b=fefefe)

借助 react-server-dom-webpack，我们已经将 React Server Component 渲染成流的格式，但是 SSR Server 和客户端还不能做正确的解析，所以出现了错误。

## Step2：服务端解析 RSC Payload

SSR Server 该如何解析返回的 RSC Payload 呢？

其实在实现思路一节已经讲过了，借助 createFromNodeStream 和 renderToPipeableStream。首先安装 [node-fetch](https://www.npmjs.com/package/node-fetch) 这个包：

```javascript
npm i node-fetch
```

这是因为我们使用的毕竟是 react-server-dom-webpack 的 createFromNodeStream，既然是 NodeStream，自然是要用 Node 的 Stream。

修改 `server/ssr.js`，代码如下：

```javascript
import express from "express";
import { readFile } from "fs/promises";
import fetch from 'node-fetch';
import { renderToPipeableStream } from "react-dom/server"
import { createFromNodeStream } from "react-server-dom-webpack/client"

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

  const response = await fetch("http://127.0.0.1:3001" + url.pathname);

  if (!response.ok) {
    res.statusCode = response.status;
    res.end();
    return;
  }
  const stream = response.body;

  // 获取客户端 JSX 对象
  if (url.searchParams.has("jsx")) {
    res.set("Content-type", "text/x-component")
    stream.on("data", (data) => {
      res.write(data)
    })
    stream.on("end", (data) => {
      res.end()
    })
  }
  // 获取 HTML
  else {
    const root = await createFromNodeStream(stream, {})
    res.set("Content-type", "text/html")
    const { pipe } = renderToPipeableStream(root)
    pipe(res)
  }
});

app.listen(3000, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on 3000`);
});

```

fetch 的 response.body 会返回一个 Stream，createFromNodeStream 传入的便是这个 Steam，最终返回的 root 是页面的 JSX 对象，我们有调用了 renderToPipeableStream 将其渲染为流式 HTML。

此时访问 <http://localhost:3000/>，页面已经可以正常渲染：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08029f02a31b44c9b8f2c2772f4655a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3922\&h=2038\&s=447600\&e=png\&b=fbfaf9)

尽管页面正常渲染，但注意这里，页面的请求数量只有 3 个，没有 `client.js`，也没有 react 相关的 JS。

这是因为以前我们是在将 clientJSX 渲染成 HTML 后再拼接的 HTML，但是这里我们直接返回了渲染结果，所以没有机会写入 client.js。

此外，访问 <http://localhost:3000/?jsx>，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2e0ff40742843b7abb1ec5d335d2391~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3668\&h=960\&s=555683\&e=png\&b=fbfafa)

你可以发现，无论是 `/`的 Transfer-Encoding 响应头还是 `/?jsx` 的 Transfer-Encoding 响应头都是 chunked。这说明 HTML 和 RSC Payload 都已经实现了 Streaming。

## Step3：客户端解析 RSC Payload

回到刚才的问题，如何引入 client.js 呢？

我们可以改为在 components.tsx 的 `<Layout>`中引入，修改 `components.tsx`，代码如下：

```javascript
const importMap = `{
  "imports": {
    "react": "https://esm.sh/react@18.3.0-canary-c3048aab4-20240326?dev",
        "react-dom/client": "https://esm.sh/react-dom@18.3.0-canary-c3048aab4-20240326/client?dev",
        "react-server-dom-webpack": "https://esm.sh/react-server-dom-webpack@18.3.0-canary-c3048aab4-20240326/client?dev"
  }
}`

export function Layout({ children }) {
  const author = "YaYu";
  return (
    <html>
    <head>
      <title>My blog</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{ __html: `window.__webpack_require__ = async (id) => {
          return import(id)
        }` }}>
      </script>
      <script
          type="importmap"
          dangerouslySetInnerHTML={{ __html: importMap }}
      ></script>
      <script type="module" src="/client.js"></script>
    </head>
    <body className="p-5">
      <nav className="flex items-center justify-center gap-10 text-blue-600">
        <a href="/">Home</a>
      </nav>
      <input required className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
      <main>{children}</main>
      <Footer author={author} />
    </body>
  </html>
  );
}
```

修改 `client.js`，完整代码如下：

```javascript
import * as React from "react"
import { use, useState, startTransition } from "react"
import { createFromFetch } from "react-server-dom-webpack"
import { hydrateRoot } from 'react-dom/client';

// 客户端路由缓存
let clientJSXCache = {}
let currentPathname = window.location.pathname
let updateRoot

function Shell({ data }) {
  console.log("Shell", data)
  const [root, setRoot] = useState(use(data))
  clientJSXCache[currentPathname] = root
  updateRoot = setRoot
  return root
}

let data = createFromFetch(
  fetch(currentPathname + '?jsx')
)

hydrateRoot(document, React.createElement(Shell, { data }))

async function navigate(pathname) {
  currentPathname = pathname;
  if (clientJSXCache[pathname]) {
    updateRoot(clientJSXCache[pathname])
    return
  } else {
    const response = fetch(pathname + '?jsx')
    const root = await createFromFetch(response)
    clientJSXCache[pathname] = root
    startTransition(() => {
      updateRoot(root)
    })
  }
}

window.addEventListener("click", (e) => {
  // 忽略非 <a> 标签点击事件
  if (e.target.tagName !== "A") {
    return;
  }
  // 忽略 "open in a new tab".
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return;
  }
  // 忽略外部链接
  const href = e.target.getAttribute("href");
  if (!href.startsWith("/")) {
    return;
  }
  // 组件浏览器重新加载页面
  e.preventDefault();
  // 但是 URL 还是要更新
  window.history.pushState(null, null, href);
  // 调用我们自己的导航逻辑
  navigate(href);
}, true);

window.addEventListener("popstate", () => {
  // 处理浏览器前进后退事件
  navigate(window.location.pathname);
});
```

此时页面已经可以正常运行：

![react-rsc-13.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9a70d464c774e5dbc48ae990a688da2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1606\&h=1015\&s=333179\&e=gif\&f=59\&b=fafafa)

现在 Suspense 组件也能正常使用了，修改 `components.tsx`，代码如下：

```javascript
import React, { Suspense } from 'react';
const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function IndexPage() {
  const files = await readdir("./posts");
  const slugs = files.map((file) =>
    file.slice(0, file.lastIndexOf("."))
  );

  return (
    <section>
      <h1>Blog List:</h1>
      <div>
        {slugs.map((slug, index) => (
          <Suspense key={index} fallback={<p>Loading Post...</p>}>
            <Post slug={slug} />
          </Suspense>
        ))}
      </div>
    </section>
  );
}

export function PostPage({ slug }) {
  return (
    <Suspense fallback={<p>Loading Post...</p>}>
      <Post slug={slug} />
    </Suspense>
  );
}

async function Post({ slug }) {
  let content = await readFile("./posts/" + slug + ".txt", "utf8");
  await sleep(2000)
  return (
    <section>
      <a className="text-blue-600" href={"/" + slug}>{slug}</a>
      <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">{content}</article>
    </section>
  )
}
```

为了让效果明显，我们为 Post 组件添加了 2s 的延时，并在 IndexPage 和 PostPage 中使用了 Suspense。

最终的交互效果如下：

![react-rsc-14.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf7b532018104bda82b61ff7908e23d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1606\&h=1015\&s=501487\&e=gif\&f=91\&b=fafafa)

> 1.  功能实现：Streaming 与 Suspense
> 2.  源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-10>
> 3.  下载代码：`git clone -b react-rsc-10 git@github.com:mqyqingfeng/next-app-demo.git`

## 参考链接

1.  <https://github.com/facebook/react/tree/main/packages/react-server-dom-webpack>
2.  <https://timtech.blog/posts/react-server-components-rsc-no-framework/>
3.  <https://react.dev/reference/react-dom/server/renderToPipeableStream>
