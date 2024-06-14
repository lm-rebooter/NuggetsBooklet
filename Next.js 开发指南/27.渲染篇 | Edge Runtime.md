## 1. Edge Runtime

### 1.1 介绍

学习 Next.js 的时候，我们可能会接触到 Edge Runtime 和 Node.js Runtime 这两个概念。在 Next.js 中，你可以把运行时（runtime）理解为执行期间一组可用的库、API、和常规功能的集合。在服务端，有两个可以用于渲染应用的运行时：

*   Nodejs Runtime，这是默认的运行时，可以使用 Node.js API 和其生态的包
*   Edge Runtime，基于 [Web API](https://nextjs.org/docs/app/api-reference/edge)

在 Next.js 中，Edge Runtime 是 Nodejs API 的子集，功能上虽有限制，但对应也更轻量，速度也更快，适用于开发小而简单的功能，以低延迟实现动态、个性化的内容。

仅仅是这样的了解是不是还很懵逼？为了讲解 Edge Runtime 这个概念，我们先从 CDN 开始说起。

CDN，全称 Content Delivery Network，中文译为“内容分发网络”，它是由分布于不同地理位置的服务器及数据中心组成的虚拟网络，目的在于以最小的延迟将内容分发给用户。简单的来说，你在杭州请求在美国的网站，因为物理距离太远，响应会有延迟，但如果将网站的内容同步到杭州的服务器上，转而请求杭州服务器上的内容，响应时间就会加快。这组在杭州的用于缓存和传送网络内容的服务器就被称为 “Edge”。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2a3950cc3954c3481d299f66fd5a810~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1536\&h=1409\&s=231537\&e=png\&a=1\&b=f3f3f3)
以前的 Edge 只能存储一些静态的资源，但这不够强大，当你已经是个成熟的 Edge 时，你得学着能够执行代码，当能够执行代码时，CDN 网络就变成了更为强大的边缘网络（Edge Network），在 Edge 发生的计算，也被称为边缘计算，它可以为主要服务器分担一部分处理内容。理解这些概念，也有助于理解 Edge Runtime 这个概念，其术语 Edge 指的正是这种面向即时无服务器计算的环境。

你可能会想到 Serverless。Serverless 很好，但每次请求的时候都会开启不同的实例，并重新初始化环境，尽管底层架构会做很多优化，但依然不能最大限度的复用资源。而对于 Edge Runtime，你可以通过 Vercel Edge functions 或者 Cloudflare workers 或者其他一些工具来部署 Edge Runtime 环境，Edge Runtime 并不运行 Nodejs，而使用 V8 引擎和 Web APIs，这样更加轻量，启动速度更快。多个请求可以使用一个实例，更好的复用资源。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c30eb01fb754f45b86d336f4468fd5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1760\&h=1352\&s=844342\&e=png\&b=fcf9f9)
有了 Edge Runtime 的优化再加上 Streaming，这就更快了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/380bb3c168b845a28c08088e4437317e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1938\&h=1304\&s=384225\&e=png\&b=fdfafa)
总结一下，你可以把 Edge Runtime 理解成一个特殊的运行环境，在这个环境里，只能使用标准的 Web APIs，但对应也会带来更好的性能。至于具体支持哪些，查看 Next.js 提供的 [Edge Runtime Supports](https://nextjs.org/docs/app/api-reference/edge) 文档。

### 1.2 开启

你可以在 Next.js 中为单个路由指定运行时。为此，你需要声明一个名为 `runtime` 的变量并导出它。变量必须是字符串，值为 `'nodejs'` 或者 `'edge'`。举个例子：

```javascript
// app/page.js
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
```

也可以在布局上定义 `runtime`，这会将 Edge Runtime 应用于该布局下的所有路由：

```javascript
// app/layout.js
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
```

如果你没有声明，默认是 Node.js Runtime，所以如果不打算修改，也无须使用该选项。

## 参考链接

1.  <https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming>
2.  <https://edge-runtime.vercel.app/>
3.  <https://www.cdnetworks.com/cn/what-is-a-cdn/>
4.  <https://zhuanlan.zhihu.com/p/510366735>
