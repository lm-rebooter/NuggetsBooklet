## 前言

本章我们将介绍 Next.js 的缓存机制。

Next.js 的缓存功能非常强大，以至于让人又爱又恨。一方面，缓存的重要性不言而喻，可以优化应用性能和降低开销。另一方面，写 Next.js 项目的时候常会遇到数据没有更新的问题，多半都是缓存搞得鬼……

理论上，缓存不是使用 Next.js 的必要知识。因为 Next.js 会自动根据你使用的 API 做好缓存管理。但实际上，你还是要认真学习下缓存，至少要清楚知道 Next.js 的缓存机制有哪些，大致的工作原理，以及如何退出缓存，否则遇到缓存问题的时候你甚至不知道如何解决……

现在就让我们认真学习下缓存吧。

## 概览

Next.js 中有四种缓存机制：

| 机制                        | 缓存内容               | 存储地方 | 目的               | 期间        |
| ------------------------- | ------------------ | ---- | ---------------- | --------- |
| 请求记忆（Request Memoization） | 函数返回值              | 服务端  | 在 React 组件树中复用数据 | 每个请求的生命周期 |
| 数据缓存（Data Cache ）         | 数据                 | 服务端  | 跨用户请求和部署复用数据     | 持久（可重新验证） |
| 完整路由缓存（Full Route Cache）  | HTML 和 RSC payload | 服务端  | 降低渲染成本、提高性能      | 持久（可重新验证） |
| 路由缓存（Router Cache）        | RSC payload        | 客户端  | 减少导航时的服务端请求      | 用户会话或基于时间 |

默认情况下，Next.js 会尽可能多的使用缓存以提高性能和降低成本。像路由默认会采用静态渲染，数据请求的结果默认会被缓存。下图是构建时静态路由渲染以及首次访问静态路由的原理图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e176beb2d77848f88f7790d9eb7ab720~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=1179\&s=418691\&e=png\&b=0d0d0d)

在这张图中：

打包构建 `/a`时（BUILD TIME），因为路由中的请求是首次，所以都会 `MISS`，从数据源获取数据后，将数据在**请求记忆**和**数据缓存**中都保存了一份（`SET`），并将生成的 RSC Payload 和 HTML 也在服务端保存了一份（**完整路由缓存**）。

当客户端访问 `/a` 的时候，命中服务端缓存的 RSC Payload 和 HTML，并将 RSC Payload 在客户端保存一份（**路由缓存**）。

缓存行为是会发生变化的，具体取决的因素有很多，比如路由是动态渲染还是静态渲染，数据是缓存还是未缓存，请求是在初始化访问中还是后续导航中。

是不是有点懵？没有关系，随着内容的展开，我们会有更加深入的了解。

## 1. 请求记忆（Request Memoization）

### 1.1. 工作原理

React 拓展了 [fetch API](https://nextjs.org/docs/app/building-your-application/caching#fetch)，当有相同的 URL 和参数的时候，React 会自动将请求结果缓存。也就是说，即时你在组件树中的多个位置请求一份相同的数据，但数据获取只会执行一次。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcd22d593060474fa2a7437337469aa0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=857\&s=666460\&e=png\&b=141414)

这样当你跨路由（比如跨布局、页面、组件）时，你不需要在顶层请求数据，然后将返回结果通过 props 转发，直接在需要数据的组件中请求数据即可，不用担心对同一数据发出多次请求造成的性能影响。

```javascript
// app/page.js
async function getItem() {
  // 自动缓存结果
  const res = await fetch('https://.../item/1')
  return res.json()
}
 
// 函数调用两次，但只会执行一次请求
const item = await getItem() // cache MISS
 
const item = await getItem() // cache HIT
```

这是请求记忆的工作原理图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b9746cb977d49888c846ea230f99fa1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=800\&s=149814\&e=png\&b=0e0e0e)

在这种图中，当渲染 `/a` 路由的时候，由于是第一次请求，会触发缓存 `MISS`，函数被执行，请求结果会被存储到内存中（缓存`SET`），当下一次相同的调用发生时，会触发缓存 `HIT`，数据直接从内存中取出。

它背后的原理想必大家也想到了，就是[函数记忆](https://juejin.cn/post/6844903494256705543)，《JavaScript 权威指南》中就有类似的函数：

```javascript
function memoize(f) {
    var cache = {};
    return function(){
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) {
            return cache[key]
        }
        else return cache[key] = f.apply(this, arguments)
    }
}
```

关于请求记忆，要注意：

*   请求记忆是 React 的特性，并非 Next.js 的特性。 React 和 Next.js 都做了请求缓存，React 的方案叫做“请求记忆”，Next.js 的方案叫做“数据缓存”，两者有很多不同
*   请求记忆只适合用于用 `GET` 方法的 `fetch` 请求
*   请求记忆只应用于 React 组件树，也就是说你在 `generateMetadata`、`generateStaticParams`、布局、页面和其他服务端组件中使用 fetch 会触发请求记忆，但是在路由处理程序中使用则不会触发，因为这就不在 React 组件树中了

### 1.2. 持续时间

缓存会持续在服务端请求的生命周期中，直到 React 组件树渲染完毕。它的存在是为了避免组件树渲染的时候多次请求同一数据造成的性能影响。

### 1.3. 重新验证

由于请求记忆只会在渲染期间使用，因此也无须重新验证。

### 1.4. 退出方式

这个行为是 React 的默认优化。不建议退出。

如果你不希望 fetch 请求被记忆，可以借助 [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 这个 Web API，具体使用方式如下（虽然这个 API 本来的作用是用来中止请求）：

```javascript
const { signal } = new AbortController()
fetch(url, { signal })
```

### 1.5. React Cache

如果你不能使用 fetch 请求，但是又想实现记忆，可以借助 React 的 cache 函数：

```javascript
// utils/get-item.ts
import { cache } from 'react'
import db from '@/lib/db'
 
export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id })
  return item
})
```

注：为了让大家更好的理解**请求记忆**和**数据缓存**，实战例子我们会放到本篇最后。

## 2. 数据缓存（Data Cache）

### 2.1. 工作原理

Next.js 有自己的数据缓存方案，可以跨服务端请求和构建部署存储数据。之所以能够实现，是因为 Next.js 拓展了 fetch API，在 Next.js 中，每个请求都可以设置自己的缓存方式。

不过与 React 的请求记忆不同的是，请求记忆因为只用于组件树渲染的时候，所以不用考虑数据缓存更新的情况，但 Next.js 的数据缓存方案更为持久，则需要考虑这个问题。

默认情况下，使用 `fetch` 的数据请求都会被缓存，这个缓存是持久的，它不会自动被重置。你可以使用 `fetch` 的 `cache` 和 `next.revalidate` 选项来配置缓存行为：

```javascript
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

```javascript
fetch(`https://...`, { next: { revalidate: 3600 } })
```

这是 Next.js 数据缓存的工作原理图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1fe452584b349bd94efe4cf658c729f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=661\&s=138430\&e=png\&b=101010)

让我们解释一下：当渲染的时候首次调用，请求记忆和数据缓存都会 MISS，从而执行请求，返回的结果在请求记忆和数据缓存中都会存储一份。

当再次调用的时候，因为添加了 `{cache: 'no-store'}`参数，请求参数不同，请求记忆会  MISS，而这个参数会导致数据缓存跳过，所以依然是执行请求，因为配置了 no-store，所以数据缓存也不会缓存返回的结果，请求记忆则会正常做缓存处理。

### 2.2. 持续时间

数据缓存在传入请求和部署中都保持不变，除非重新验证或者选择退出。

### 2.3. 重新验证

Next.js 提供了两种方式更新缓存：

一种是**基于时间的重新验证（Time-based revalidation）**，即经过一定时间并有新请求产生后重新验证数据，适用于不经常更改且新鲜度不那么重要的数据。

一种是**按需重新验证（On-demand revalidation）**，根据事件手动重新验证数据。按需重新验证又可以使用基于标签（tag-based）和基于路径（path-based）两种方法重新验证数据。适用于需要尽快展示最新数据的场景。

#### 基于时间

基于时间的重新验证，需要使用 `fetch` 的 `next.revalidate` 选项设置缓存的时间（注意它是以秒为单位）。

```javascript
// 每小时重新验证
fetch('https://...', { next: { revalidate: 3600 } })
```

可以借助路由段配置项来配置该路由所有的 fetch 请求：

```javascript
// layout.jsx / page.jsx / route.js
export const revalidate = 3600
```

这是基于时间的重新验证原理图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c2a97c76ad24bfe98708d452cd27211~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=1252\&s=260753\&e=png\&b=0e0e0e)

通过这种图，你可以发现：并不是 60s 后该请求会自动更新，而是 60s 后再有请求的时候，会进行重新验证，60s 后的第一次请求依然会返回之前的缓存值，但 Next.js 将使用新数据更新缓存。60s 后的第二次请求会使用新的数据。

#### 按需更新

使用按需重新验证，数据可以根据路径（`revalidatePath`）和 缓存标签（`revalidateTag`） 按需更新。

`revalidatePath` 用在路由处理程序或 Server Actions 中，用于手动清除特定路径中的缓存数据：

```javascript
revalidatePath('/')
```

`revalidateTag` 依赖的是 Next.js 的缓存标签系统，当使用 fetch 请求的时候，声明一个标签，然后在路由处理程序或是 Server Actions 中重新验证具有某一标签的请求：

```javascript
// 使用标签
fetch(`https://...`, { next: { tags: ['a', 'b', 'c'] } })
```

```javascript
// 重新验证具有某一标签的请求
revalidateTag('a')
```

这是按需更新的原理图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac0e8d8c8854c9586c72dbd7981169a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=1082\&s=189982\&e=png\&b=0e0e0e)

你会发现，这跟基于时间的重新验证有所不同。第一次调用请求的时候，正常缓存数据。当触发按需重新验证的时候，将会从缓存中删除相应的缓存条目。下次请求的时候，又相当于第一次调用请求，正常缓存数据。

### 2.4. 退出方式

如果你想要退出数据缓存，有两种方式：

一种是将 `fetch` 的 `cache` 选项设置为 `no-store`，示例如下，每次调用的时候都会重新获取数据：

```javascript
fetch(`https://...`, { cache: 'no-store' })
```

一种是使用[路由段配置项](https://juejin.cn/book/7307859898316881957/section/7309079033223446554)，它会影响该路由段中的所有数据请求：

```javascript
export const dynamic = 'force-dynamic'
```

## 3. 实战体会

修改 `app/page.js`，代码如下：

```js
async function getData() {
  // 接口每次调用都会返回一个随机的猫猫图片数据
  const res = await fetch('https://api.thecatapi.com/v1/images/search') 
  return res.json()
}

export async function generateMetadata() {
  const data = await getData()
  return {
    title: data[0].id
  }
}

export default async function Page() {
  const data = await getData()
  return (
    <>
      <h1>图片 ID：{data[0].id}</h1>
      <img src={data[0].url} width="300" />
      <CatDetail />
    </>
  )
}

async function CatDetail() {
  const data = await getData()
  return (
    <>
      <h1>图片 ID：{data[0].id}</h1>
      <img src={data[0].url} width="300" />
    </>
  )
}
```

代码的逻辑很简单，访问 `/` 会在 generateMetadata 函数、页面、子组件中调用 3 次接口，接口每次调用都会返回一张随机的猫猫图片数据，请问此时运行**生产版本**，3 次返回的数据是一致的吗？

让我们实际运行一下，效果如下：


![cache-10.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95cede0ec354239b1b26da95a46a070~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1187&h=680&s=400357&e=gif&f=31&b=f8f4f4)

无论是普通刷新还是硬刷新，图片都会保持不遍，且 3 次接口调用数据返回一致。

原因也很简单，首先是静态渲染，页面在构建的时候进行渲染，其次虽然调用了 3 次接口，但因为有请求记忆、数据缓存，3 次调用接口数据返回一致。

现在我们关掉数据缓存，在 `app/page.js` 中添加代码：

```js
// 强制 fetch 不缓存
export const fetchCache = 'force-no-store'
```

运行生产版本，此时交互效果如下：


![cache-11.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95da27f365964fdcb2e1dbf9810c1a53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=705&s=412571&e=gif&f=42&b=f9f6f6)

因为设置了 fetch 不缓存，页面自动从静态渲染转为动态渲染，所以每次刷新，接口都会返回新的图片。但因为有请求记忆，3 次接口调用都是返回一样的图片。

此时我们再关闭请求记忆，修改 `app/page.js`：

```js
async function getData() {
  const { signal } = new AbortController()
  const res = await fetch('https://api.thecatapi.com/v1/images/search', { signal }) 
  return res.json()
}
```

运行生产版本，此时交互效果如下：


![cache-12.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9342b86709649be94e47a67752ebeb3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=705&s=564105&e=gif&f=56&b=fdfdfd)

此时页面动态渲染，数据缓存和请求记忆都已关闭，所以每次请求都会返回不同的图片数据。

## 总结

最后让我们比较一下请求记忆和数据缓存：

请求记忆是 React 的数据缓存方案，它只持续在组件树渲染期间，目的是为了避免组件树渲染的时候多次请求同一数据造成的性能影响。

数据缓存是 Next.js 的数据缓存方案，它可以跨部署和请求缓存，缓存数据不会失效，除非重新验证或者主动退出。目的在于优化应用性能。

实际项目开发的时候，请求记忆和数据缓存往往同时存在，共同作用。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b148832e89c44f77a00c9d4edaa67b42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=661&s=124915&e=png&b=101010)

## 参考链接

1.  [Building Your Application: Caching | Next.js](https://nextjs.org/docs/app/building-your-application/caching)
