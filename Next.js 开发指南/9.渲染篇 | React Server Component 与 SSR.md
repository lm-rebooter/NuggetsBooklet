## 前言

Next.js v13 推出了基于 React Server Component 的 App Router 路由解决方案。对于 Next.js 而言堪称是一个颠覆式的更新，更是将 React 一直宣传的 React Server Component 这个概念真正推进并落实到项目中。

因为 React Server Component 的引入，Next.js 中的组件开始区分客户端组件还是服务端组件，但考虑到部分同学对 React Server Component 并不熟悉，本篇我们会先从 React Server Components 的出现背景开始讲起，并将其与常混淆的 SSR 概念做区分，为大家理解和使用服务端组件和客户端组件打下基础。

## React Server Components

2020 年 12 月 21 日，React 官方发布了 React Server Components 的[介绍文章](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)，并配上了由 Dan Abramov 和 Lauren Tan 两位 React 团队的工程师分享的长约 1h 的[分享](https://www.youtube.com/watch?time_continue=15\&v=TQQPAU21ZUw\&embeds_referring_euri=https%3A%2F%2Flegacy.reactjs.org%2F\&source_ve_path=MzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMjg2NjY\&feature=emb_logo)和 [Demo](https://github.com/reactjs/server-components-demo)，详细的介绍了 React Server Components 的出现背景和使用方式。

了解 React Server Components 对理解 Next.js 的渲染方式至关重要。所以我们稍微花些篇幅来回顾下这场演讲的主要内容。

其中 Dan 介绍了应用开发的三个注意要点：

![Data Fetching with React Server Components - YouTube - 1\_41.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7680e211aaf54b7e803401b6ecd07a3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=838797\&e=png\&b=1b1d26)

这三点分别是**好的用户体验**、**易于维护**和**高性能**。但是这三点却很难兼顾，我们以 [Spotify](https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2) 这个网站的页面为例：

![Data Fetching with React Server Components - YouTube - 1\_57.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08de63dfe38a4a00bed2aac7ee7e5a2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=924428\&e=png\&b=161616)

这是一个音乐家介绍页面，内容主要包含两块区域，一块是热门单曲区域（TopTracks），一块是唱片目录（Discography），如果我们要模拟实现这样一个页面，使用 React，我们可能会这样写：

![Data Fetching with React Server Components - YouTube - 2\_32.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe8ed72599f943f6bc1f0941e66f67d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=879724\&e=png\&b=1b1d26)

看起来很简洁的样子，但当我们加上数据请求后，代码就会变成这个样子：

![Data Fetching with React Server Components - YouTube - 4\_10.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a76bc145a8414b7688f4a6375a1e6f74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=1141608\&e=png\&b=1b1d26)

我们从顶层获取数据，然后传给需要的子组件，虽然一次请求就可以解决，但这样的代码并不易于维护。

比如在以后的迭代中删除了某个 UI 组件，但是对应数据没有从接口中删除，这就造成了冗余的数据。又比如你在接口里添加了一个字段，然后在某个组件里使用，但你忘记在另一个引用该组件的组件中传入这个字段，这可能就导致了错误。

为了易于维护，我们就会想回归到刚才简单的结构中，然后每个组件负责各自的数据请求：

![Data Fetching with React Server Components - YouTube - 5\_16.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c9c9bfbc7294b4bb3d7e2cf1d71d572~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=935649\&e=png\&b=1b1d26)

但是这样就慢了，本来一个请求就能解决，现在拆分为了三个请求。难道就不能全兼顾吗？

我们分析下原因，将数据请求拆分到各个组件中为什么会慢呢？本质上还是客户端发起了多次 HTTP 请求，如果这些请求是串行的（比如 TopTracks 和 Discography 组件需要在 ArtistDetails 组件的数据返回后再拿其中的 id 数据发送请求），那就更慢了。为了解决这个问题，便有了 React Server Component。

![Data Fetching with React Server Components - YouTube - 11\_08.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83e451cb15214ca08d5049555136eaa7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=604748\&e=png\&b=1b1d26)

React Server Component 把数据请求的部分放在服务端，由服务端直接给客户端返回带数据的组件。

最终的目标是：在原始只有 Client Components 的情况下，一个 React 树的结构如下：

![Data Fetching with React Server Components - YouTube - 48\_03.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a404d317b3604eb4bb238b4efb8c3785~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=557630\&e=png\&b=1b1d26)

在使用 React Server Component 后，React 树会变成：

![Data Fetching with React Server Components - YouTube - 46\_49.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a06dcb1d2ea64333b0299a3752f66b3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=555556\&e=png\&b=1b1d26)

其中黄色节点表示 React Server Component。在服务端，React 会将其渲染会一个包含基础 HTML 标签和**客户端组件占位**的树。它的结构类似于：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08ced5fb4bd945f3aa9d48e520126ccc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=953\&h=809\&s=314046\&e=png\&b=fefdfd)

因为客户端组件的数据和结构在客户端渲染的时候才知道，所以客户端组件此时在树中使用特殊的占位进行替代。

当然这个树不可能直接就发给客户端，React 会做序列化处理，客户端收到后会在客户端根据这个数据重构 React 树，然后用真正的客户端组件填充占位，渲染最终的结果。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/146a170c4626428db92e5624f5be0212~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=919\&h=796\&s=246213\&e=png\&b=fefefe)

使用 React Server Component，因为服务端组件的代码不会打包到客户端代码中，它可以减小包（bundle）的大小。且在 React Server Component 中，可以直接访问后端资源。当然因为在服务端运行，对应也有一些限制，比如不能使用 useEffect 和客户端事件等。

在这场分享里，Dan 也提到了 Next.js，表示会和 Next.js 团队的合作伙伴们一起开发，让每个人都能使用这个功能。

![Data Fetching with React Server Components - YouTube - 42\_56.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d17f67bc4ac4b399918343d0db3055b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560\&h=1440\&s=332996\&e=png\&b=1b1d26)

终于 Next.js 在 v13 版本中实现了 React Server Component，此时已过去了两年之久。

## **Server-side Rendering**

**Server-side Rendering**，中文译为“服务端渲染”，在上篇[《渲染篇 | 从 CSR、SSR、SSG、ISR 开始说起》](https://juejin.cn/book/7307859898316881957/section/7309077054263066662)已经介绍过，并提供了一个基于 Pages Router 的 demo：

```javascript
// pages/ssr.js
export default function Page({ data }) {
  return <p>{JSON.stringify(data)}</p>
}
 
export async function getServerSideProps() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos`)
  const data = await res.json()
 
  return { props: { data } }
}
```

从这个例子中可以看出，Next.js v12 之前的 SSR 都是通过 `getServerSideProps`这样的方法，在页面层级获取数据，然后通过 props 传给每个组件，然后将整个组件树在服务端渲染为 HTML。

但是 HTML 是没有交互性的（non-interactive UI），客户端渲染出 HTML 后，还要等待 JavaScript 完全下载并执行。JavaScript 会赋予 HTML 交互性，这个阶段被称为水合（Hydration）。此时内容变为可交互的（interactive UI）。

从这个过程中，我们可以看出 SSR 的几个缺点：

1.  SSR 的数据获取必须在组件渲染之前
2.  组件的 JavaScript 必须先加载到客户端，才能开始水合
3.  所有组件必须先水合，然后才能跟其中任意一个组件交互

可以看出 SSR 这种技术“大开大合”，加载整个页面的数据，加载整个页面的 JavaScript，水合整个页面，还必须按此顺序串行执行。如果有某些部分慢了，都会导致整体效率降低。

此外，SSR 只用于页面的初始化加载，对于后续的交互、页面更新、数据更改，SSR 并无作用。

## RSC 与 SSR

了解了这两个基本概念，现在让我们来回顾下 React Server Components 和 Server-side Rendering，表面上看，RSC 和 SSR 非常相似，都发生在服务端，都涉及到渲染，目的都是更快的呈现内容。但实际上，这两个技术概念是相互独立的。RSC 和 SSR 既可以各自单独使用，又可以搭配在一起使用（搭配在一起使用的时候是互补的）。

正如它们的名字所表明的那样，Server-side Rendering 的重点在于 **Rendering**，React Server Components 的重点在于 **Components**。

简单来说，RSC 提供了更细粒度的组件渲染方式，可以在组件中直接获取数据，而非像 Next.js v12 中的 SSR 顶层获取数据。RSC 在服务端进行渲染，组件依赖的代码不会打包到 bundle 中，而 SSR 需要将组件的所有依赖都打包到 bundle 中。

当然两者最大的区别是：

SSR 是在服务端将组件渲染成 HTML 发送给客户端，而 RSC 是将组件渲染成一种特殊的格式，我们称之为 RSC Payload。这个 RSC Payload 的渲染是在服务端，但不会一开始就返回给客户端，而是在客户端请求相关组件的时候才返回给客户端，RSC Payload 会包含组件渲染后的数据和样式，客户端收到 RSC Payload 后会重建 React 树，修改页面 DOM。

这样的描述好像很抽象，其实很简单。让我们本地开启一下当时 React 提供的 [Server Components Demo](https://github.com/reactjs/server-components-demo)：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d84b3b6a207437ca22dd3548005166c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3536\&h=1914\&s=832890\&e=png\&b=fefefe)

你会发现 `localhost` 这个 HTML 页面的内容就跟 CSR 一样，都只有一个用于挂载的 DOM 节点。当点击左侧 Notes 列表的时候，会发送请求，这个请求的地址是：

> http://localhost:4000/react?location={"selectedId":3,"isEditing":false,"searchText":""}

返回的结果是：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e914003081be4027a89b67e0c0e51678~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3536\&h=1914\&s=690003\&e=png\&b=ffffff)

除此之外没有其他的请求了。其实这条请求返回的数据就是 RSC Payload。

让我们看下这条请求，我们请求的这条笔记的标题是 Make a thing，具体内容是 It's very easy to make some……，我们把返回的数据具体查看一下，你会发现，返回的请求里包含了这些数据：

![截屏2024-03-04 16.51.55.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60fd931e61bc42c2a6a7c78268d243d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3472\&h=1736\&s=1312711\&e=png\&b=1f1f1f)

不仅包含数据，完整渲染后的 DOM 结构也都包含了。客户端收到 RSC Payload 后就会根据这其中的内容修改 DOM。而且在这个过程，页面不会刷新，页面实现了 partial rendering（部分更新）。

这也就带来了我们常说的 SSR 和 RSC 的最大区别，那就是**状态的保持**（渲染成不同的格式是“因”，状态的保持是“果”）。每次 SSR 都是一个新的 HTML 页面，所以状态不会保持（传统的做法是 SSR 初次渲染，然后 CSR 更新，这种情况，状态可以保持，不过现在讨论的是 SSR，对于两次 SSR，状态是无法维持的）。

但是 RSC 不同，RSC 会被渲染成一种特殊的格式（RSC Payload），可以多次重新获取，然后客户端根据这个特殊格式更新 UI，而不会丢失客户端状态。

所谓不丢失状态，让我们看个例子：

![1116.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10f53b9439e6417cab8bffb150affb69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982\&h=321\&s=819592\&e=gif\&f=78\&b=fefefe)

在上图中，我们新建了一条 note，重点在左侧的搜索结果列表，新建后，原本的那条 note 依然保持了展开状态。（注：这个状态在技术上是通过 useState 来实现的。实战篇的时候会用 Next.js 重写这个 Demo）

注意：这里我们比较的是 React Demo 展示的 RSC 特性和 Next.js v12 所代表的传统 SSR。跟我们接下来要讲的 Next.js 服务端组件、客户端组件并不一样。

Next.js 的服务端组件、客户端组件虽然是基于 RSC 提出的用于区分组件类型的概念，但在具体实现上，为了追求高性能，技术上其实是融合了 RSC 和 SSR（前面也说过，RSC 和 SSR 互补）。这里比较是纯粹的 RSC 和 SSR，以防大家在概念理解上产生混淆。

## 总结

本篇我们介绍并比较了 RSC 和 SSR，虽然并不涉及 Next.js 具体的写法和使用，但对于大家理解 Next.js 中的服务端组件、客户端组件概念有所帮助。
