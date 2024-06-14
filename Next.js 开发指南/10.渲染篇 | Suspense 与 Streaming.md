## 前言

Suspense 是 Next.js 项目中常用的一个组件，了解其原理和背景有助于我们正确使用 Suspense 组件。

## 传统 SSR

在最近的两篇文章里，我们已经介绍了 SSR 的原理和缺陷。简单来说，使用 SSR，需要经过一系列的步骤，用户才能查看页面、与之交互。具体这些步骤是：

1.  服务端获取所有数据
2.  服务端渲染 HTML
3.  将页面的 HTML、CSS、JavaScript 发送到客户端
4.  使用 HTML 和 CSS 生成不可交互的用户界面（non-interactive UI）
5.  React 对用户界面进行水合（hydrate），使其可交互（interactive UI）

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14ca67632f94426e92512ed318259736~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=612\&s=307750\&e=png\&b=161616)

这些步骤是连续的、阻塞的。这意味着服务端只能在获取所有数据后渲染 HTML，React 只能在下载了所有组件代码后才能进行水合：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fec73cefc3924b47bf4a112919bb72d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=748\&s=373884\&e=png\&b=141414)

还记得上篇总结的 SSR 的几个缺点吗？

1.  SSR 的数据获取必须在组件渲染之前
2.  组件的 JavaScript 必须先加载到客户端，才能开始水合
3.  所有组件必须先水合，然后才能跟其中任意一个组件交互

## Suspense

为了解决这些问题，React 18 引入了 [\<Suspense\>](https://react.dev/reference/react/Suspense) 组件。我们来介绍下这个组件：

`<Suspense>` 允许你推迟渲染某些内容，直到满足某些条件（例如数据加载完毕）。

你可以将动态组件包装在 Suspense 中，然后向其传递一个 fallback UI，以便在动态组件加载时显示。如果数据请求缓慢，使用 Suspense 流式渲染该组件，不会影响页面其他部分的渲染，更不会阻塞整个页面。

让我们来写一个例子，新建 `app/dashboard/page.js`，代码如下：

```jsx
import { Suspense } from 'react'

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function PostFeed() {
  await sleep(2000)
  return <h1>Hello PostFeed</h1>
}

async function Weather() {
  await sleep(8000)
  return <h1>Hello Weather</h1>
}

async function Recommend() {
  await sleep(5000)
  return <h1>Hello Recommend</h1>
}

export default function Dashboard() {
  return (
    <section style={{padding: '20px'}}>
      <Suspense fallback={<p>Loading PostFeed Component</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading Weather Component</p>}>
        <Weather />
      </Suspense>
      <Suspense fallback={<p>Loading Recommend Component</p>}>
        <Recommend />
      </Suspense>
    </section>
  )
}
```

在这个例子中，我们用 Suspense 包装了三个组件，并通过 sleep 函数模拟了数据请求耗费的时长。加载效果如下：

![suspense.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60be4c9076614e16934f26215a242841~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1449\&h=507\&s=269182\&e=gif\&f=26\&b=1a1a1a)

可是 Next.js 是怎么实现的呢？

让我们观察下 dashboard 这个 HTML 文件的加载情况，你会发现它一开始是 2.03s，然后变成了 5.03s，最后变成了 8.04s，这不就正是我们设置的 sleep 时间吗？

查看 dashboard 请求的响应头：

![截屏2024-03-04 22.47.51.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0d2d120619c4c74a494805105f1c717~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1866\&h=956\&s=245353\&e=png\&b=292929)

`Transfer-Encoding` 标头的值为 `chunked`，表示数据将以一系列分块的形式进行发送。

> 分块传输编码（Chunked transfer encoding）是超文本传输协议（HTTP）中的一种数据传输机制，允许 HTTP由网页服务器发送给客户端应用（ 通常是网页浏览器）的数据可以分成多个部分。分块传输编码只在 HTTP 协议1.1版本（HTTP/1.1）中提供。

再查看 dashboard 返回的数据（这里我们做了简化）：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        // ...
    </head>
    <body class="__className_aaf875">
        <section style="padding:20px">
            <!--$?-->
            <template id="B:0"></template>
            <p>Loading PostFeed Component</p>
            <!--/$-->
            <!--$?-->
            <template id="B:1"></template>
            <p>Loading Weather Component</p>
            <!--/$-->
            <!--$?-->
            <template id="B:2"></template>
            <p>Loading Recommend Component</p>
            <!--/$-->
        </section>
        // ...
        <div hidden id="S:0">
            <h1>Hello PostFeed</h1>
        </div>
        <script>
            // 交换位置
            $RC = function(b, c, e) {
                // ...
            };
            $RC("B:0", "S:0")
        </script>
        <div hidden id="S:2">
            <h1>Hello Recommend</h1>
        </div>
        <script>
            $RC("B:2", "S:2")
        </script>
        <div hidden id="S:1">
            <h1>Hello Weather</h1>
        </div>
        <script>
            $RC("B:1", "S:1")
        </script>
    </body>
</html>

```

可以看到使用 Suspense 组件的 fallback UI 和渲染后的内容都会出现在该 HTML 文件中，说明该请求持续与服务端保持连接，服务端在组件渲染完后会将渲染后的内容追加传给客户端，客户端收到新的内容后进行解析，执行类似于 `$RC("B:2", "S:2")`这样的函数交换 DOM 内容，使 fallback UI 替换为渲染后的内容。

这个过程被称之为 Streaming Server Rendering（流式渲染），它解决了上节说的传统 SSR 的第一个问题，那就是数据获取必须在组件渲染之前。使用 Suspense，先渲染 Fallback UI，等数据返回再渲染具体的组件内容。

使用 Suspense 还有一个好处就是 Selective Hydration（选择性水合）。简单的来说，当多个组件等待水合的时候，React 可以根据用户交互决定组件水合的优先级。比如 Sidebar 和 MainContent 组件都在等待水合，快要到 Sidebar 了，但此时用户点击了 MainContent 组件，React 会在单击事件的捕获阶段同步水合 MainContent 组件以保证立即响应，Sidebar 稍后水合。

总结一下，使用 Suspense，可以解锁两个主要的好处，使得 SSR 的功能更加强大：

1.  Streaming Server Rendering（流式渲染）：从服务器到客户端渐进式渲染 HTML
2.  Selective Hydration（选择性水合）：React 根据用户交互决定水合的优先级

### Suspense 会影响 SEO 吗？

首先，Next.js 会等待 [generateMetadata](https://juejin.cn/book/7307859898316881957/section/7309079119902277669#heading-3) 内的数据请求完毕后，再将 UI 流式传输到客户端，这保证了响应的第一部分就会包含 `<head>` 标签。

其次，因为 Streaming 是流式渲染，HTML 中会包含最终渲染的内容，所以它不会影响 SEO。

### Suspense 如何控制渲染顺序？

在刚才的例子中，我们是将三个组件同时进行渲染，哪个组件的数据先返回，就先渲染哪个组件。

但有的时候，希望按照某种顺序展示组件，比如先展示 `PostFeed`，再展示`Weather`，最后展示`Recommend`，此时你可以将 Suspense 组件进行嵌套：

```javascript
import { Suspense } from 'react'

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function PostFeed() {
  await sleep(2000)
  return <h1>Hello PostFeed</h1>
}

async function Weather() {
  await sleep(8000)
  return <h1>Hello Weather</h1>
}

async function Recommend() {
  await sleep(5000)
  return <h1>Hello Recommend</h1>
}

export default function Dashboard() {
  return (
    <section style={{padding: '20px'}}>
      <Suspense fallback={<p>Loading PostFeed Component</p>}>
        <PostFeed />
        <Suspense fallback={<p>Loading Weather Component</p>}>
          <Weather />
          <Suspense fallback={<p>Loading Recommend Component</p>}>
            <Recommend />
          </Suspense>
        </Suspense>
      </Suspense>
    </section>
  )
}
```

那么问题来了，此时页面的最终加载时间是多少秒？是请求花费时间最长的 8s 还是 2 + 8 + 5 = 15s 呢？让我们看下效果：

![suspense1.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00bcbba3b76e48728dc4958076e82257~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1462\&h=509\&s=222364\&e=gif\&f=13\&b=fcfcfc)

答案是 8s，这些数据请求是同时发送的，所以当 Weather 组件返回的时候，Recommend 组件立刻就展示了出来。

注意：这也是因为这里的数据请求并没有前后依赖关系，如果有那就另讲了。

## Streaming

### 介绍

Suspense 背后的这种技术称之为 Streaming。将页面的 HTML 拆分成多个 chunks，然后逐步将这些块从服务端发送到客户端。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbd0db15ec434ce7bd32db7f7a0adcc0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3200\&h=1236\&s=842460\&e=png\&b=141414)

这样就可以更快的展现出页面的某些内容，而无需在渲染 UI 之前等待加载所有数据。提前发送的组件可以提前开始水合，这样当其他部分还在加载的时候，用户可以和已完成水合的组件进行交互，有效改善用户体验。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c889efc33d504902adfcc0c43e64502b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3200\&h=900\&s=604411\&e=png\&b=161616)

Streaming 可以有效的阻止耗时长的数据请求阻塞整个页面加载的情况。它还可以减少加载[第一个字节所需时间（TTFB）](https://web.dev/articles/ttfb?hl=zh-cn)和[首次内容绘制（FCP）](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/)，有助于缩短[可交互时间（TTI）](https://developer.chrome.com/en/docs/lighthouse/performance/interactive/)，尤其在速度慢的设备上。

传统 SSR：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c85db6b77c54d56b1b104cb96edc17b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=612\&s=307750\&e=png\&b=161616)

使用 Streaming 后：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e3a28d086c44749a89daf69e7d34374~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=730\&s=373563\&e=png\&b=171717)

### 使用

在 Next.js 中有两种实现 Streaming 的方法：

1.  页面级别，使用 `loading.jsx`
2.  特定组件，使用 `<Suspense>`

`<Suspense>` 上节已经介绍过，`loading.jsx` 在 [《路由篇 | App Router》](https://juejin.cn/book/7307859898316881957/section/7308681814742417434#heading-11)也介绍过。这里分享一个使用 `loading.jsx` 的小技巧，那就是当多个页面复用一个 loading.jsx 效果的时候可以借助路由组来实现。

目录结构如下：

```javascript
app                  
├─ (dashboard)       
│  ├─ about          
│  │  └─ page.js     
│  ├─ settings       
│  │  └─ page.js     
│  ├─ team           
│  │  └─ page.js     
│  ├─ layout.js      
│  └─ loading.js         

```

其中 `app/(dashboard)/layout.js`代码如下：

```javascript
import Link from 'next/link'

export default function DashboardLayout({
  children,
}) {
  return (
    <section>
        <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
          <Link href="/about">About</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/team">Team</Link>
        </nav>
      {children}
    </section>
  )
}
```

`app/(dashboard)/loading.js`代码如下：

```javascript
export default function DashboardLoading() {
  return  <div className="h-60 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">Loading</div>
}
```

`app/(dashboard)/about/page.js`代码如下：

```javascript
const sleep = ms => new Promise(r => setTimeout(r, ms));

export default async function About() {
  await sleep(2000)
  return (
    <div className="h-60 flex-1 rounded-xl bg-teal-400 text-white flex items-center justify-center">Hello, About!</div>
  )
}
```

剩余两个组件代码与 About 组件类似。最终的效果如下：

![suspense2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2871317841224854bb18e2b0f1a4fe96~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=874\&h=538\&s=105637\&e=gif\&f=60\&b=6ad1bc)

在线查看效果和代码：[CodeSandbox Loading](https://codesandbox.io/p/devbox/loading-jsx-zx4mfy?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522cltdu2u3z00073b6i08865iv9%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522cltdu2u3z00023b6ijugbhpax%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522cltdu2u3z00043b6i2wg1p3h8%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522cltdu2u3z00063b6ig9e8y777%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522cltdu2u3z00023b6ijugbhpax%2522%253A%257B%2522id%2522%253A%2522cltdu2u3z00023b6ijugbhpax%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522cltdu2u3z00063b6ig9e8y777%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cltdu2u3z00053b6i3v1assnv%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_PORT%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A3000%252C%2522path%2522%253A%2522%252Fabout%2522%257D%255D%252C%2522id%2522%253A%2522cltdu2u3z00063b6ig9e8y777%2522%252C%2522activeTabId%2522%253A%2522cltdu2u3z00053b6i3v1assnv%2522%257D%252C%2522cltdu2u3z00043b6i2wg1p3h8%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cltdu2u3z00033b6i19ll8rh0%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522dev%2522%257D%255D%252C%2522id%2522%253A%2522cltdu2u3z00043b6i2wg1p3h8%2522%252C%2522activeTabId%2522%253A%2522cltdu2u3z00033b6i19ll8rh0%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

### 缺点

Suspense 和 Streaming 确实很好，将原本只能先获取数据、再渲染水合的传统 SSR 改为渐进式渲染水合，但还有一些问题没有解决。就比如用户下载的 JavaScript 代码，该下载的代码还是没有少，可是用户真的需要下载那么多的 Javascript 代码吗？又比如所有的组件都必须在客户端进行水合，对于不需要交互性的组件其实没有必要进行水合。

为了解决这些问题，目前的最终方案就是上一篇介绍的 RSC：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e78230237ee74eb4bf31fba92be6ebf6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920\&h=1080\&s=619076\&e=png\&b=020a0b)

当然这并不是说 RSC 可以替代 Suspense，实际上两者可以组合使用，带来更好的性能体验。我们会在实战篇的项目中慢慢体会。

## 参考链接

1.  <https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming>
2.  <https://vercel.com/blog/how-streaming-helps-build-faster-web-applications>
3.  <https://www.builder.io/blog/why-react-server-components#suspense-for-server-side-rendering>
