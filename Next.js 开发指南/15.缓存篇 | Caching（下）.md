## 前言

本篇我们继续讲 Next.js 的缓存机制。今天介绍的是完整路由缓存和路由缓存。

## 1. 完整路由缓存（Full Route Cache）

### 1.1. 工作原理

Next.js 在**构建的时候**会自动渲染和缓存路由，这样当访问路由的时候，可以直接使用缓存中的路由而不用从零开始在服务端渲染，从而加快页面加载速度。

那你可能要问，缓存路由是个什么鬼？我听过缓存数据，但是路由怎么缓存呢？让我们复习下 Next.js 的渲染原理：

Next.js 使用 React 的 API 来编排渲染。当渲染的时候，渲染工作会根据路由和 Suspense 拆分成多个 chunk，每个 chunk 分为两步进行渲染：

1.  React 会将服务端组件渲染成一种特殊的数据格式，我们称之为 React Server Component Payload，简写为 RSC payload。比如一个服务端组件的代码为：

```javascript
<div>
  Don’t give up and don’t give in.
  <ClientComponent />
</div>
```

React 会将其转换为如下的 Payload：

```javascript
["$","div",null,{"children":["Don’t give up and don’t give in.", ["$","$L1",null,{}]]}]
1:I{"id":123,"chunks":["chunk/[hash].js"],"name":"ClientComponent","async":false}
```

这个格式针对流做了优化，它们可以以流的形式逐行从服务端发送给客户端，客户端可以逐行解析 RSC Payload，渐进式渲染页面。

当然这个 RSC payload 代码肯定是不能直接执行的，它包含的更多是信息：

1.  服务端组件的渲染结果
2.  客户端组件的占位和引用文件
3.  从服务端组件传给客户端组件的数据

比如这个 RSC Payload 中的 `$L1` 表示的就是 ClientComponent，客户端会在收到 RSC Payload 后，解析下载 ClientComponent 对应的 bundle 地址，然后将执行的结果渲染到 `$L1` 占位的位置上。

2.  Next.js 会用 RSC payload 和客户端组件代码在服务端渲染 HTML

这张图生动的描述了这个过程：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb119007336543c288845f29c425e014~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=888\&s=171366\&e=png\&b=0d0d0d)

简单来说，路由渲染的产物有两个，一个是 RSC Payload，一个是 HTML。完整路由缓存，缓存的就是这两个产物。

不过路由在构建的时候是否会被缓存取决于它是静态渲染还是动态渲染。静态路由默认都是会被缓存的，动态路由因为只能在请求的时候被渲染，所以不会被缓存。这张图展示了静态渲染和动态渲染的差异：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27d1e45c1c5849d2892dfad986832acc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=1314\&s=351817\&e=png\&b=0c0c0c)

在这种图中，静态路由 `/a` 因为有完整路由缓存，所以不会重新渲染一遍。动态路由 `/b` 没有完整路由缓存，所以会重新执行一遍渲染。但这并不影响客户端的路由缓存，所以在后续的请求中都命中了路由缓存。

### 1.2. 持续时间

完整路由缓存默认是持久的，这意味着可以跨用户请求复用。

### 1.3. 失效方式

有两种方式可以使完整路由缓存失效：

*   重新验证数据：重新验证数据缓存会使完整路由缓存失效，毕竟渲染输出依赖于数据
*   重新部署：数据缓存是可以跨部署的，但完整路由缓存会在重新部署中被清除

### 1.4. 退出方式

退出完整路由缓存的方式就是将其改为动态渲染：

*   使用动态函数：使用动态函数后会改为动态渲染，此时数据缓存依然可以用
*   使用路由段配置项：`dynamic = 'force-dynamic'`或 `revalidate = 0` 这会跳过完整路由缓存和数据缓存，也就是说，每次请求时都会重新获取数据并渲染组件。此时路由缓存依然可以用，毕竟它是客户端缓存
*   退出数据缓存：如果路由中有一个 fetch 请求退出了缓存，则会退出完整路由缓存。这个特定的 fetch 请求会在每次请求时重新获取，其他 fetch 请求依然会使用数据缓存。Next.js 允许这种缓存和未缓存数据的混合

简单来说，完整路由缓存只适用于静态渲染，在服务端保留静态渲染的产物 RSC Payload 和 HTML。

使用动态渲染则会退出完整路由缓存。如何让路由从静态渲染转为动态渲染，也可以参考 [《渲染篇 | 服务端渲染策略》](https://juejin.cn/book/7307859898316881957/section/7342031804771565619#heading-2)。

## 2. 路由缓存（Router Cache）

### 2.1. 工作原理

Next.js 有一个存放在内存中的客户端缓存，它会在用户会话期间按路由段存储 RSC Payload。这就是路由缓存。

工作原理图如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8964c9aa0318409db0dd74ed86d18dd6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=1375\&s=312833\&e=png\&b=0b0b0b)

原理图很好理解，当访问 `/a`的时候，因为是首次访问（`MISS`），将 `/（layout）`和 `/a(page)`放在路由缓存中（`SET`），当访问与 `/a`共享布局的 `/b`的时候，使用路由缓存中的 `/（layout）`，然后将 `/b(page)`放在路由缓存中（`SET`）。再次访问 `/a`的时候，直接使用路由缓存中（`HIT`）的 `/(layout)`和 `/b(page)`。

不止如此，当用户在路由之间导航，Next.js 会缓存访问过的路由段并预获取用户可能导航的路由（基于视口内的 `<Link>` 组件）。这会为用户带来更好的导航体验：

1.  即时前进和后退导航，因为访问过的路由已经被缓存，并且预获取了新路由
2.  导航不会导致页面重载，并且会保留 React 的状态和浏览器状态

让我们根据原理图写个 demo 验证一下：

```javascript
// app/layout.js
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>
          <Link href="/a">Link to /a</Link>
          <br />
          <Link href="/b">Link to /b</Link>
        </div>
        {children}
      </body>
    </html>
  )
}
```

两个路由的代码类似：

```javascript
// app/a/page.js | app/b/page.js
export default function Page() {
  return (
    <h1>Component X</h1>
  )
}
```

当首次访问 `/a`的时候，因为 Link 组件的 `/a` 和 `/b` 都在视口内，所以会预加载 `/a` 和  `/b` 的 RSC Payload：

![截屏2023-11-28 上午11.13.19.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73175e3be51847c7bfb65e00c32da591~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298\&h=1028\&s=150651\&e=png\&b=ffffff)

得益于预加载和缓存，无论是导航还是前进后退都非常顺滑：

![1114.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a18d51d4ff7448d81b2e883b223b73f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=927\&h=570\&s=131584\&e=gif\&f=32\&b=fefefe)

### 2.2. 持续时间

路由缓存存放在浏览器的临时缓存中，有两个因素决定了路由缓存的持续时间：

*   Session，缓存在导航时持续存在，当页面刷新的时候会被清除
*   自动失效期：单个路由段会在特定时长后自动失效
    * **如果路由是静态渲染，持续 5 分钟**
    * **如果路由是动态渲染，持续 30s**

比如上面的 demo 中如果等 5 分钟后再去点击，就会重新获取新的 RSC Payload

通过添加 `prefetch={true}`（Link 组件的 prefetch 默认就为 true）或者在动态渲染路由中调用 `router.prefetch`，可以进入缓存 5 分钟。

### 2.3. 失效方式

**有两种方法可以让路由缓存失效：**

*   在 Server Action 中
    *   通过 `revalidatePath` 或 `revalidateTag` 重新验证数据 
    *   使用  `cookies.set` 或者 `cookies.delete` 会使路由缓存失效，这是为了防止使用 cookie 的路由过时（如身份验证）
*   调用 `router.refresh` 会使路由缓存失效并发起一个重新获取当前路由的请求

### 2.4. 退出方式

**无法退出路由缓存**。你可以通过给 `<Link>` 组件的 `prefetch` 传递 `false` 来退出预获取，但依然会临时存储路由段 30s，这是为了实现嵌套路由段之间的即时导航。此外访问过的路由也会被缓存。

### 2.5. 实战体会

这个时候你可能觉得路由缓存还蛮不错，但是让我们写个项目，在实战中感受下路由缓存有的时候让人多头疼吧！

目录结构如下：

```
app                  
├─ (cache)       
│  ├─ about          
│  │  └─ page.js     
│  ├─ settings       
│  │  └─ page.js     
│  ├─ layout.js      
│  └─ loading.js         
```

其中 `app/(cache)/layout.js`，代码如下：

```js
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function CacheLayout({
  children,
}) {
  return (
    <section className="p-5">
        <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
          <Link href="/about">About</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      {children}
    </section>
  )
}
```

`app/(cache)/loading.js`，代码如下：

```js
export default function DashboardLoading() {
  return  <div className="h-60 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">Loading</div>
}
```

`app/(cache)/about/page.js`，代码如下：

```js
const sleep = ms => new Promise(r => setTimeout(r, ms));

export default async function About() {
  await sleep(2000)
  return (
    <div className="h-60 flex-1 rounded-xl bg-teal-400 text-white flex items-center justify-center">Hello, About! {new Date().toLocaleString()}</div>
  )
}
```

`app/(cache)/settings/page.js`，代码如下：

```js
const sleep = ms => new Promise(r => setTimeout(r, ms));

export default async function Settings() {
  await sleep(2000)
  return (
    <div className="h-60 flex-1 rounded-xl bg-teal-400 text-white flex items-center justify-center">Hello, Settings! {new Date().toLocaleString()}</div>
  )
}
```

运行生产版本，交互效果如下：


![cache-13.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ca548ee77b444eb96e34b8d868d3738~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1235&h=800&s=1605366&e=gif&f=66&b=262829)

交互效果看起来很正常是不是？但是注意：

当我们刷新页面的时候，`/about` 出现了 loading 加载，当我们首次点击 Settings 导航至 `/settings` 的时候，也出现了 loading 加载。然而当我们再点击 About、Settings 的时候就没有 loading 加载效果了，不仅如此，查看网络请求，甚至都没有发送网络请求。

这就是客户端路由缓存的功效。尤其是搭配 `<Link>` 标签导航的时候，会直接从路由缓存中获取 RSC，所以当导航的时候，连时间都没有改变。

如果我希望每次点击的时候都重新加载页面呢？

你可能会想，那就给 About、Settings 这两个页面加上 `dynamic`、`revalidate` 等路由段配置项，让静态渲染转为动态渲染。但其实我们已经在布局中配置了 `const dynamic = 'force-dynamic'`，现在就是动态渲染，动态渲染只能让页面刷新或者初次请求的时候时间是准确的，但是导航的时候，因为客户端缓存的缘故，依然不会更新。

那么我们该怎么办呢？

第一种方式是等。客户端缓存是有自动失效期的，动态渲染 30s，静态渲染 5 分钟。现在是动态渲染，等待 30s 后再点击 About、Settings 就会重新发送请求，显示正确的时间。

第二种方式是不用 Link 标签，改用原生的 `<a>` 标签。不过这种方式会导致页面刷新。

修改 `app/(cache)/layout.js`，代码如下：

```js
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function CacheLayout({
  children,
}) {
  return (
    <section className="p-5">
        <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
          <a href="/about">About</a>
          <a href="/settings">Settings</a>
        </nav>
      {children}
    </section>
  )
}
```

运行生产版本，交互效果如下：

![cache-14.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caeac218e1314bdf86c464f6534eecfb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1235&h=800&s=650141&e=gif&f=46&b=292929)

第三种方式是参照让路由缓存失效的方式：一种是使用 Server Actions，不过这里我们用不到 Server Actions。一种是调用 router.refresh，但是使用 router 需要声明为客户端组件，这就需要将布局改为客户端组件，虽然有点糟糕，但是也能用。

修改 `app/(cache)/layout.js`，代码如下：

```js
'use client'

import { useRouter } from 'next/navigation'

export default function CacheLayout({
  children,
}) {
  const router = useRouter()
  return (
    <section className="p-5">
        <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
          <button onClick={() => {
            router.push('/about')
            router.refresh()
          }}>About</button>
          <button onClick={() => {
            router.push('/settings')
            router.refresh()
          }}>Settings</button>
        </nav>
      {children}
    </section>
  )
}
```

然后给 `app/(cache)/about/page.js` 和 `app/(cache)/about/page.js` 添加代码：

```js
export const dynamic = 'force-dynamic'
```

目的将其转为动态渲染。运行生产版本，效果如下：

![cache-16.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/282410b6f48443218699d266c1328161~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1235&h=800&s=751814&e=gif&f=53&b=2a2a2a)

第四种方式跟第三种方式都是用 router.refresh，不过实现方式不同。示例代码如下：

新建 `app/(cache)/navigation-events.js`，代码如下：

```js
'use client'
 
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    router.refresh()
  }, [pathname, searchParams])
 
  return null
}
```

修改 `app/(cache)/layout.js`，代码如下：

```js
import Link from 'next/link'
import { Suspense } from 'react'
import { NavigationEvents } from './navigation-events'

export const dynamic = 'force-dynamic'

export default function CacheLayout({
  children,
}) {
  return (
    <section className="p-5">
        <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
          <Link href={`/about`}>About</Link>
          <Link href={`/settings`}>Settings</Link>
        </nav>
      {children}
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
    </section>
  )
}
```

运行生产版本，交互效果如下：

![cache-15.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52a49095ee07425ba2eeb47f66ab2349~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1235&h=800&s=1232048&e=gif&f=47&b=2a2a2a)

## 总结

路由缓存和完整路由缓存的区别：

1.  路由缓存发生在用户访问期间，将 RSC Payload 暂时存储在浏览器，导航期间都会持续存在，页面刷新的时候会被清除。而完整路由缓存则会持久的将 RSC Payload 和 HTML 缓存在服务器上
2.  完整路由缓存仅缓存静态渲染的路由，路由缓存可以应用于静态和动态渲染的路由

在实际项目开发中，路由缓存可能是一个让人头疼的问题。因为它经常使用，但又无法退出，为此有的时候需要特殊处理，所以关于路由缓存可以多关注一下。我们在实战篇的第一个项目[《实战篇 | React Notes | 笔记预览界面》](https://juejin.cn/book/7307859898316881957/section/7309112043122196490#heading-4)还会遇到路由缓存。

之前说过 Next.js 会自动根据你使用的 API 做好缓存管理，具体 API 跟四种缓存的关系表为：

API                                                                                                                                  | 路由缓存               | 完整路由缓存      | 数据缓存            | 请求记忆 |
| ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | --------------------- | --------------------- | ----------- |
| [`<Link prefetch>`](https://nextjs.org/docs/app/building-your-application/caching#link)                                              | Cache                      |                       |                       |             |
| [`router.prefetch`](https://nextjs.org/docs/app/building-your-application/caching#routerprefetch)                                    | Cache                      |                       |                       |             |
| [`router.refresh`](https://nextjs.org/docs/app/building-your-application/caching#routerrefresh)                                      | Revalidate                 |                       |                       |             |
| [`fetch`](https://nextjs.org/docs/app/building-your-application/caching#fetch)                                                       |                            |                       | Cache                 | Cache       |
| [`fetch` `options.cache`](https://nextjs.org/docs/app/building-your-application/caching#fetch-optionscache)                          |                            |                       | Cache or Opt out      |             |
| [`fetch` `options.next.revalidate`](https://nextjs.org/docs/app/building-your-application/caching#fetch-optionsnextrevalidate)       |                            | Revalidate            | Revalidate            |             |
| [`fetch` `options.next.tags`](https://nextjs.org/docs/app/building-your-application/caching#fetch-optionsnexttags-and-revalidatetag) |                            | Cache                 | Cache                 |             |
| [`revalidateTag`](https://nextjs.org/docs/app/building-your-application/caching#fetch-optionsnexttags-and-revalidatetag)             | Revalidate (Server Action) | Revalidate            | Revalidate            |             |
| [`revalidatePath`](https://nextjs.org/docs/app/building-your-application/caching#revalidatepath)                                     | Revalidate (Server Action) | Revalidate            | Revalidate            |             |
| [`const revalidate`](https://nextjs.org/docs/app/building-your-application/caching#segment-config-options)                           |                            | Revalidate or Opt out | Revalidate or Opt out |             |
| [`const dynamic`](https://nextjs.org/docs/app/building-your-application/caching#segment-config-options)                              |                            | Cache or Opt out      | Cache or Opt out      |             |
| [`cookies`](https://nextjs.org/docs/app/building-your-application/caching#cookies)                                                   | Revalidate (Server Action) | Opt out               |                       |             |
| [`headers`, `searchParams`](https://nextjs.org/docs/app/building-your-application/caching#dynamic-functions)                         |                            | Opt out               |                       |             |
| [`generateStaticParams`](https://nextjs.org/docs/app/building-your-application/caching#generatestaticparams)                         |                            | Cache                 |                       |             |
| [`React.cache`](https://nextjs.org/docs/app/building-your-application/caching#react-cache-function)                                  |                            |                       |                       | Cache       |

注：Cache 表示触发缓存，Revalidate 表示触发重新验证，Opt out 表示触发退出缓存

在开发项目中遇到缓存问题的时候，可以先根据使用的 API 判断涉及的缓存类型，然后再选择合适的方式重新验证或者退出缓存。

## 参考链接

1.  [Building Your Application: Caching | Next.js](https://nextjs.org/docs/app/building-your-application/caching)
