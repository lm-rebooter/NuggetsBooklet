## 前言

Next.js 内置了 `<Link>` 和 `<Script>` 组件，`<Link> `组件实现了后台预获取资源，从而让页面转换更快更平滑，`<Script>` 组件使得你可以控制加载和执行第三方脚本等等。本篇会详细介绍这两个组件的用法和相关参数。

## `<Link>`

### 1. 介绍

Link 组件是一个拓展了 HTML `<a>` 元素的 React 组件，提供了预加载和客户端路由之间的导航功能。它是 Next.js 路由导航的主要方式。使用示例如下：

```javascript
// app/page.js
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

### 2. Props

| **Prop**                                                                        | **示例**            | **类型**           | **是否必须** |
| ------------------------------------------------------------------------------- | ----------------- | ---------------- | -------- |
| [href](https://nextjs.org/docs/app/api-reference/components/link#href-required) | href="/dashboard" | String or Object | 是      |
| [replace](https://nextjs.org/docs/app/api-reference/components/link#replace)    | replace={false}   | Boolean          | -        |
| [scroll](https://nextjs.org/docs/app/api-reference/components/link#scroll)      | scroll={false}    | Boolean          | -        |
| [prefetch](https://nextjs.org/docs/app/api-reference/components/link#prefetch)  | prefetch={false}  | Boolean          | -        |

### 3. href（必须）

导航跳转的路径或者 URL：

```jsx
<Link href="/dashboard">Dashboard</Link>
```

`href`也支持传入一个对象：

```jsx
// 导航至 /about?name=test
<Link
  href={{
    pathname: '/about',
    query: { name: 'test' },
  }}
  >
  About
</Link>
```

那你可能就好奇了，除了 `pathname` 和 `query`，还支持传入哪些对象参数？我们翻下 [`<Link>` 组件的源码](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/link.tsx)就知道了：

```javascript
// next.js/packages/next/src/client /link.tsx
import type { UrlObject } from 'url'
type Url = string | UrlObject
type InternalLinkProps = {
  href: Url
}
```

可以看出，对象来自于 [url NPM 包](https://www.npmjs.com/package/url)，查阅 url 这个包，该对象的属性有（以 `'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'`为例）：

*   **href**：`'<http://user:pass@host.com:8080/p/a/t/h?query=string#hash>'`
*   **protocol**：`'http:'`
*   **host**: `'host.com:8080'`
*   **auth**: `'user:pass'`
*   **hostname**: `'host.com'`
*   **port**: `'8080'`
*   **pathname**: `'/p/a/t/h'`
*   **search**: `'?query=string'`
*   **path**: `'/p/a/t/h?query=string'`
*   **query**: `'query=string' or {'query':'string'}`
*   **hash**: `'#hash'`

### 4. replace

默认值为 `false`，当值为 `true` 的时候，`next/link`会替换浏览器当前的历史记录，而非在浏览器的历史项里新增一个 URL（[history.replaceState 方法](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API#replacestate_%E6%96%B9%E6%B3%95)）。

```javascript
// app/page.js
import Link from 'next/link'
 
export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

### 5. scroll

默认值为 `true`。`<Link>`组件的默认行为是滚动到一个新导航的顶部或者在前进后退导航中维持之前的滚动位置。当值为 `false`，`next/link`不会在导航后滚动到新的页面顶部（继续维持上一个路由的位置）。

```javascript
// app/page.js
import Link from 'next/link'
 
export default function Page() {
  return (
    <Link href="/dashboard" scroll={false}>
      Dashboard
    </Link>
  )
}
```

### 6. prefetch

默认值为 `true`。当值为 `true` 的时候，`next/link`会在后台预获取页面。这可以有效改善客户端导航性能。任何视口中的 `<Link />` （无论是初始加载的时候还是通过滚动）都会预加载。但是要注意：预获取仅在生产环境中开启。

你可以通过传递 `prefetch={false}`来禁用这个功能。

```javascript
// app/page.js
import Link from 'next/link'
 
export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
```

### 7. 其他 props

其他 props 会自动转发给底层的 `<a>` 元素，比如 `target="_blank"`、`className`。

### 8. 示例

#### 8.1. 链接至动态路由

```javascript
// app/blog/page.js
import Link from 'next/link'
 
function Page({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

#### 8.2 中间件

我们通常会用中间件实现鉴权等功能，然后让用户重定向到其他的页面。为了让  <Link /> 组件能够在有中间件的时候获取到重定向后的链接，你需要告诉 Next.js 用于展示的 URL 和用于预获取的 URL。

举个例子，当你访问 `/dashboard` 这个路由的时候，需要进行身份验证，如果身份验证通过，跳转到 `/auth/dashboard` 路由，如果没有通过，则跳转到公共访问的 `/public/dashboard` 路由，实现代码如下：

```javascript
// middleware.js
export function middleware(req) {
  const nextUrl = req.nextUrl
  if (nextUrl.pathname === '/dashboard') {
    if (req.cookies.authToken) {
      return NextResponse.rewrite(new URL('/auth/dashboard', req.url))
    } else {
      return NextResponse.rewrite(new URL('/public/dashboard', req.url))
    }
  }
}
```

这个时候，为了让 `<Link />` 组件预获取正确的地址，你可以这样写：

```javascript
import Link from 'next/link'
import useIsAuthed from './hooks/useIsAuthed'
 
export default function Page() {
  const isAuthed = useIsAuthed()
  const path = isAuthed ? '/auth/dashboard' : '/dashboard'
  return (
    <Link as="/dashboard" href={path}>
      Dashboard
    </Link>
  )
}
```

这里我们用到了 `as` 这个 prop，`as` 是一个遗留的 prop，早期为了搭配动态路由而实现。这是因为在早期实现跳转动态路由功能的时候，代码并不像上节例子展示的那样理所当然：

```javascript
const pids = ['id1', 'id2', 'id3']
{
  pids.map((pid) => (
    <Link href="/post/[pid]" as={`/post/${pid}`}>
      <a>Post {pid}</a>
    </Link>
  ))
}
```

这是因为早期设计中， `href` 基于文件系统路径，并不能在运行时被改变，跳转地址只能是 `"/post/[pid]"`这种形式，但为了让浏览器显示正确的地址，于是增加了 `as` prop，它是浏览器 URL 地址栏中展示的地址。

回到刚才这个例子：

```javascript
  <Link as="/dashboard" href={path}>
    Dashboard
  </Link>
```

因为 prefetch 基于的是 `href` 地址，为了 prefetch 到正确的地址，所以 `path` 做了 isAuthed 判断。但最终跳转的地址应该是 `/dashboard`，然后在中间件里做具体的判断，所以使用了 `as` prop。

## `<Script>`

### 1. 介绍

Next.js 内置的脚本组件，用于控制加载和执行三方脚本文件。使用基本示例如下：

```javascript
// app/dashboard/page.js
import Script from 'next/script'
 
export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

这是用在 page.js 之中，也可以用在 layout.js 之中使用，实现为多个路由加载一个脚本：

```javascript
// app/dashboard/layout.js
import Script from 'next/script'
 
export default function DashboardLayout({ children }) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

这样当访问如 `dashboard/page.js` 或是子路由 `dashboard/settings/page.js`的时候，脚本都会获取。Next.js 会保证脚本只加载一次，即使用户在同一布局的多个路由之间导航。

如果你希望所有路由都加载一个脚本，那可以直接卸载根布局中：

```javascript
// app/layout.js 
import Script from 'next/script'
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

当然考虑到性能问题，尽可能在特定页面或布局中加载三方脚本。

### 2. Props

| **Prop**                                                                         | **示例**                            | **类型**   | 是否必传        |
| -------------------------------------------------------------------------------- | --------------------------------- | -------- | ----------- |
| [src](https://nextjs.org/docs/app/api-reference/components/script#src)           | `src="http://example.com/script"` | String   | 必传，除非使用内联脚本 |
| [strategy](https://nextjs.org/docs/app/api-reference/components/script#strategy) | `strategy="lazyOnload"`           | String   | -           |
| [onLoad](https://nextjs.org/docs/app/api-reference/components/script#onload)     | `onLoad={onLoadFunc}`             | Function | -           |
| [onReady](https://nextjs.org/docs/app/api-reference/components/script#onready)   | `onReady={onReadyFunc}`           | Function | -           |
| [onError](https://nextjs.org/docs/app/api-reference/components/script#onerror)   | `onError={onErrorFunc}`           | Function | -           |

### 3. src

外部脚本地址，字符串形式，外部绝对地址或者内部地址都可，除非使用内联脚本，否则该属性必传。

所谓内联脚本，就像我们正常使用 script 标签一样，`<Script />` 也支持直接在组件内书写 JavaScript 代码：

```javascript
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

注意必须为内联脚本分配一个 id，以保证 Next.js 追踪和优化脚本。

或者使用 `dangerouslySetInnerHTML`属性：

```javascript
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

### 4. strategy

脚本加载策略，一共有四种：

1.  **beforeInteractive**： 在可交互前加载，适用于如机器人检测、Cookie 管理等
2.  **afterInteractive**：默认值，在可交互后加载，适用于如数据统计等
3.  **lazyOnload**：在浏览器空闲时间加载
4.  **worker**：（实验性质）通过 web worker 加载

`beforeInteractive`，顾名思义，在可交互之前加载。`beforeInteractive`脚本必须放在根布局（`app/layout.tsx`）之中，用于加载整站都需要的脚本，适用于一些在页面具有可交互前需要获取的关键脚本。它会被注入到 HTML 文档的 `head` 中，不管你写在组件的哪里：

```javascript
// app/layout.js
import Script from 'next/script'
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        src="https://example.com/script.js"
        strategy="beforeInteractive"
      />
    </html>
  )
}
```

虽然我们将 Script 组件写在 body 标签之后，但依然被注入到 head 中：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87a4d28110fe4b25b94fcbd7a8a17a0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114\&h=392\&s=156886\&e=png\&b=282828)

`afterInteractive`，顾名思义，在页面可交互后（不一定是完全可交互）后加载，这是 Script 组件默认的加载策略，适用于需要尽快加载的脚本。`afterInteractive`脚本可以写在任何页面或者布局中，并且只有当浏览器中打开该页面的时候才会加载和执行。

```javascript
// app/page.js
import Script from 'next/script'
 
export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

`lazyOnload`，在浏览器空闲的时候注入到 HTML 客户端，并在页面所有资源都获取后开始加载。此策略是用于不需要提前加载的后台或者低优先级脚本。lazyOnload 脚本可以写在任何页面或者布局中，并且只有当浏览器中打开该页面的时候才会加载和执行。

```javascript
// app/page.js
import Script from 'next/script'
 
export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
    </>
  )
}
```

`worker`，实验性质的加载策略，目前并不稳定，并且不能在 `app` 目录下使用，所以请谨慎使用。使用该策略的脚本将开一个 web worker 线程执行，从确保主线程处理关键的代码。它的背后是使用 [Partytown](https://partytown.builder.io/) 处理。尽管这个策略可以用于任何脚本，但作为一种高级用法，并不保证支持所有第三方脚本。

使用 worker 策略，需要通过 `next.config.js` 的 `nextScriptWorkers` 配置项开启：

```javascript
// next.config.js
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

此时当你运行 `npm run dev`的时候，Next.js 会提示你安装 Partytown：

```javascript
npm install @builder.io/partytown
```

当完成设置后，定义 `strategy="worker"`将会在应用中实例化 Partytown，并将脚本放在 web worker 中。不过 `worker` 脚本目前只能在 `pages/` 目录下使用：

```javascript
// pages/home.js
import Script from 'next/script'
 
export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

### 5. onLoad

一些三方脚本需要在脚本加载完毕后执行 JavaScript 代码以完成实例化或者调用函数。如果使用 `afterInteractive` 或者 `lazyOnload` 作为加载策略，则可以在加载完后使用 `onLoad` 属性执行代码：

```javascript
'use client'
// app/page.js
import Script from 'next/script'
 
export default function Page() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
        onLoad={() => {
          console.log(_.sample([1, 2, 3, 4]))
        }}
      />
    </>
  )
}
```

注意：`onLoad` 不能在服务端组件中使用，只能在客户端中使用。而且 `onLoad` 不能和 `beforeInteractive` 一起使用，使用 `onReady` 代替。

### 6. onReady

某些三方脚本要求用户在脚本完成加载后以及每次组件挂载的时候执行 JavaScript 代码，就比如地图导航。你可以使用 onLoad 属性处理首次加载，使用 onReady 属性处理组件每次重新挂载的时候执行代码：

```javascript
'use client'
// app/page.js 
import { useRef } from 'react'
import Script from 'next/script'
 
export default function Page() {
  const mapRef = useRef()
 
  return (
    <>
      <div ref={mapRef}></div>
      <Script
        id="google-maps"
        src="https://maps.googleapis.com/maps/api/js"
        onReady={() => {
          new google.maps.Map(mapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          })
        }}
      />
    </>
  )
}
```

这个例子演示了每次组件挂载时如何重新实例化 Google Maps JS。注意：与 `onLoad` 相同，`onReady` 也不能在服务端组件中使用，只能在客户端中使用。

### 7. onError

当脚本加载失败的时候用于捕获错误，此时可以使用 onError 属性处理：

```javascript
'use client'
// app/page.js
import Script from 'next/script'
 
export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onError={(e: Error) => {
          console.error('Script failed to load', e)
        }}
      />
    </>
  )
}
```

注意：`onError` 不能在服务端组件中使用，只能在客户端中使用。而且 `onError` 也不能和 `beforeInteractive` 一起使用。

### 8. 其他 prop

原生的 `<script>` 元素有很多 DOM 属性，其他添加在 Script 组件的 prop 都会自动转发给底层的 `<script>` 元素。

```javascript
// app/page.js
import Script from 'next/script'
 
export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

## 参考链接

1.  [https://github.com/vercel/next.js/blob/v9.5.2/docs/api-reference/next/link.md#dynamic-routes](https://github.com/vercel/next.js/blob/v9.5.2/docs/api-reference/next/link.md#dynamic-routes)
2.  [Optimizing: Scripts](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)
3.  [Components: <Link>](https://nextjs.org/docs/app/api-reference/components/link)
4.  [Components: <Script>](https://nextjs.org/docs/app/api-reference/components/script)
