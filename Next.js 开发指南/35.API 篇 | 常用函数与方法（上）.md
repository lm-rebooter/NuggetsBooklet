## 前言

本篇我们讲解请求相关的常用方法，有：

1.  [fetch](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-1)
2.  [cookies](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-7)
3.  [headers](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-20)
4.  [NextRequest](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-23)
5.  [NextResponse](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-33)
6.  [redirect](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-44)
7.  [permanentRedirect](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-46)
8.  [notFound](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-48)
9.  [useParams](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-50)
10. [usePathname](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-54)
11. [useRouter](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-58)
12. [useSearchParams](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-68)

用到的时候到此篇查看具体的语法即可。

## 1. fetch

### 1.1. 介绍

Next.js 扩展了原生的 Web [fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)，可以为每个请求设置自己的缓存模式，你可以在服务端组件中搭配 `async` 和 `await` 直接调用：

```javascript
// app/page.js
export default async function Page() {
  // 请求会被缓存
  // 类似于 Pages Router 下的 `getStaticProps`.
  // `force-cache` 是默认选项，不写也行
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })
 
  // 每次请求的时候都会重新获取
  // 类似于 Pages Router 下的 `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })
 
  // 请求会被缓存，最多缓存 10s
  // 类似于 Pages Router 下的 `getStaticProps` 使用 `revalidate` 选项.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })
 
  return <div>...</div>
}
```

这里要注意的是，浏览器中的 fetch 其实也是有 cache 选项的：

```javascript
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    body: JSON.stringify(data), 
  });
  return response.json();
}
```

浏览器中的 fetch cache 选项控制的是与浏览器交互的 HTTP 缓存，而我们在服务端中用的 fetch cache 选项控制的其实是 Next.js 自己的缓存逻辑，它会将这些请求缓存起来，方便以后重复请求的时候用到。它们具体的 cache 选项内容也会有所不同，接下来会讲到。

### 1.2. fetch(url, options)

#### options.cache

用于配置 Next.js 数据缓存（[Data Cache](https://nextjs.org/docs/app/building-your-application/caching#data-cache)）

```javascript
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

*   `force-cache`是默认值，表示优先从缓存中查找匹配请求，当没有匹配项或者匹配项过时时，才从服务器上获取资源并更新缓存。
*   `no-store`表示每次请求都从服务器上获取资源，不从缓存中查，也不更新缓存。

如果没有提供 cache 选项，默认为 `force-cache`，但如果你使用了动态函数（如 cookies()），它的默认值就会是 `no-store`。

#### options.next.revalidate

```javascript
fetch(`https://...`, { next: { revalidate: false | 0 | number } })
```

设置资源的缓存时间：

*   `false`（默认）：语义上相当于 `revalidate: Infinity`，资源无限期缓存
*   `0`：防止资源被缓存
*   `number` ：指定资源的缓存时间，最多 `n`秒

如果一个单独的 `fetch()` 请求的 `revalidate` 值比路由段配置中的 `revalidate` 还低，整个路由的 revalidate 时间都会减少。如果同一路由下有两个使用相同 URL 的请求，但设置了不同的 `revalidate`值，用较低的那个值。

为了方便，如果 `revalidate` 设置了数字，无须再设置 `cache` 选项，设置为`0` 会应用 `cache: 'no-store'`，设置为正值会应用 `cache: 'force-cache'`。冲突的配置如 `{ revalidate: 0, cache: 'force-cache' }`和 `{ revalidate: 10, cache: 'no-store' }`会导致报错。

#### options.next.tags

```javascript
fetch(`https://...`, { next: { tags: ['collection'] } })
```

设置资源的缓存标签，数据可以使用 `revalidateTag` 按需重新验证。自定义标签的最大长度是 256 个字符。

## 2. cookies

### 2.1. 介绍

`cookies` 函数用于：

1.  在服务端组件读取传入请求的 cookie
2.  在 Server Action 或路由处理程序中写入返回请求的 cookie

注意：之前的文章里也多次提到，`cookies()` 是一个动态函数，因为其返回值无法提前知道。所以在页面或者布局中使用该函数会导致路由转变为动态渲染。

### 2.2. cookies

#### cookies().get(name)

该方法传入一个 cookie 名，返回一个具有 `name` 和 `value` 属性的对象。如果没有找到，返回 `undefined`，如果匹配到多个 cookie，则返回第一个匹配到的。

```javascript
// app/page.js
import { cookies } from 'next/headers'
 
export default function Page() {
  const cookieStore = cookies()
  // 如果匹配到，theme 的值为 { name: 'theme', value: 'xxxx' }
  // 如果没有匹配到，theme 的值为 undefined
  const theme = cookieStore.get('theme')
  return '...'
}
```

#### cookies().getAll(name)

该方法类似于 `get`，但会以数组形式返回所有匹配到的 `cookies` ，匹配不到则返回空数组。如果没有指定 `name`，则返回所有可用的 cookie。

```javascript
// app/page.js
import { cookies } from 'next/headers'
 
export default function Page() {
  const cookieStore = cookies()
  // 如果匹配到，theme 的值为 [{ name: 'theme', value: 'xxxx' }]
  // 如果没有匹配到，theme 的值为 []
  const theme = cookieStore.get('theme')
  return '...'
}
```

另一个示例如下：

```javascript
// app/page.js
import { cookies } from 'next/headers'
 
export default function Page() {
  const cookieStore = cookies()
  return cookieStore.getAll().map((cookie) => (
    <div key={cookie.name}>
      <p>Name: {cookie.name}</p>
      <p>Value: {cookie.value}</p>
    </div>
  ))
}
```

#### cookies().has(name)

该方法传入一个 cookie 名，返回一个判断该 cookie 是否存在的布尔值。

```javascript
// app/page.js
import { cookies } from 'next/headers'
 
export default function Page() {
  const cookiesList = cookies()
  // true | false
  const hasCookie = cookiesList.has('theme')
  return '...'
}
```

#### cookies().set(name, value, options)

该方法用于设置 cookie。

```javascript
'use server'
// app/actions.js
import { cookies } from 'next/headers'
 
async function create(data) {
  cookies().set('name', 'lee')
  // or
  cookies().set('name', 'lee', { secure: true })
  // or
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```

具体 options 除了 name、value 通过[查看源码](https://github.com/vercel/next.js/blob/7874ad265962dd1659497cbd8f5c71ddceee207b/packages/next/src/compiled/%40edge-runtime/cookies/index.js#L74)可以得知，还有 domain、expires、httponly、maxage、path、samesite、secure、priority。

#### 删除 cookie

删除 cookie 的方式有多种：

##### cookies().delete(name)

删除指定名称的 cookie

```javascript
'use server'
// app/actions.js
import { cookies } from 'next/headers'
 
export async function create(data) {
  cookies().delete('name')
}
```

##### cookies().set(name, '')

将指定名称的 cookie 设置为空值

```javascript
'use server'
// app/actions.js
import { cookies } from 'next/headers'
 
export async function create(data) {
  cookies().set('name', '')
}
```

##### cookies().set(name, value, { maxAge: 0 })

设置 maxAge 为 0，立即使 cookie 过期

```javascript
'use server'
// app/actions.js
import { cookies } from 'next/headers'
 
export async function create(data) {
  cookies().set('name', 'value', { maxAge: 0 })
}
```

##### cookies().set(name, value, { expires: timestamp })

设置 expires 为过去的值都会使 cookie 过期

```javascript
'use server'
// app/actions.js
import { cookies } from 'next/headers'
 
export async function create(data) {
  const oneDay = 24 * 60 * 60 * 1000
  cookies().set('name', 'value', { expires: Date.now() - oneDay })
}
```

#### 测试删除效果

如果你想要测试这些删除效果：

```javascript
'use client'
// app/page.js
import { create } from './action'

export default function Page({ params }) {
 
  return (
    <form action={create}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

效果如下：

![1113.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fa74c93649545959ec04e3ea0cb5a46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=864\&h=199\&s=26031\&e=gif\&f=8\&b=2e2e2e)

## 3. headers

### 3.1. 介绍

`headers()` 函数用于从服务端组件中读取传入的 HTTP 请求头。它拓展了 [Web Headers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers)。它是只读的，这意味着你不能 `set`/`delete` 返回的请求头。headers() 和 cookies() 一样都是动态函数，其返回值无法提前知道，一旦使用会导致路由切换到动态渲染。

```javascript
// app/page.js
import { headers } from 'next/headers'
 
export default function Page() {
  const headersList = headers()
  const referer = headersList.get('referer')
 
  return <div>Referer: {referer}</div>
}
```

### 3.2. API

```javascript
const headersList = headers()
```

headers() 不接收任何参数，返回一个只读的 [Web Headers](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers) 对象，所以没有 set、append、delete 这些方法：

*   [Headers.entries()](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/entries)：以 [迭代器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols) 的形式返回 Headers 对象中所有的键值对
*   [Headers.get()](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/get)：以 [String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 的形式从 Headers 对象中返回指定 header 的全部值
*   [Headers.has()](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/has)：以布尔值的形式从 Headers 对象中返回是否存在指定的 header
*   [Headers.keys()](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/keys)：以[迭代器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)的形式返回 Headers 对象中所有存在的 header 名
*   [Headers.values()](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/values)：以[迭代器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)的形式返回 Headers 对象中所有存在的 header 的值
*   [Headers.forEach()](https://developer.mozilla.org/en-US/docs/Web/API/Headers/forEach)：对对象中的每个键/值对执行一次回调函数

举个例子：

```javascript
// app/page.js
import { headers } from 'next/headers'
 
async function getUser() {
  const headersInstance = headers()
  const authorization = headersInstance.get('authorization')
  // 转发 authorization header
  const res = await fetch('...', {
    headers: { authorization },
  })
  return res.json()
}
 
export default async function UserPage() {
  const user = await getUser()
  return <h1>{user.name}</h1>
}
```

## 4. NextRequest

### 4.1. 介绍

NextRequest 拓展了 [Web Resquest API](https://developer.mozilla.org/docs/Web/API/Request)，提供了一些便捷的方法。

### 4.2. cookies

用于读取和更改请求的 [Set-Cookie](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)标头。

#### set(name, value)

设置 cookie：

```javascript
// 请求会有一个 `Set-Cookie:show-banner=false;path=/home` 标头
request.cookies.set('show-banner', 'false')
```

#### get(name)

返回指定名称的 cookie 值，找不到就返回 undefined，多个就返回第一个：

```javascript
// { name: 'show-banner', value: 'false', Path: '/home' }
request.cookies.get('show-banner')
```

#### getAll()

返回指定名称的 cookie 值，未指定则返回所有，数组形式：

```javascript
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
request.cookies.getAll('experiments')
// 返回所有 cookie 值
request.cookies.getAll()
```

#### delete(name)

用于删除 cookie：

```javascript
// 返回 true 表示删除成功, false 表示没有删掉任何东西
request.cookies.delete('experiments')
```

#### has(name)

判断是否有该 cookie 值，有则返回 true，无则返回 false

```javascript
request.cookies.has('experiments')
```

#### clear()

删除请求的 `Set-Cookie` 标头

```javascript
request.cookies.clear()
```

### 4.3. nextUrl

拓展了原生的 [URL API](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)，提供了一些便捷的方法：

```javascript
// 假设请求是 /home, pathname 是 /home
request.nextUrl.pathname
// 请求是 /home?name=lee, searchParams 是 { 'name': 'lee' }
request.nextUrl.searchParams
```

## 5. NextResponse

### 5.1. 介绍

NextResponse 拓展了 [Web Response API](https://developer.mozilla.org/docs/Web/API/Response)，提供了一些便捷的方法。

### 5.2. cookies

用于读取和更改响应的 Set-Cookie 标头。

#### set(name, value)

```javascript
// 请求未 /home
let response = NextResponse.next()
// 设置 cookie
response.cookies.set('show-banner', 'false')
// Response 的 Set-Cookie 标头为 `Set-Cookie:show-banner=false;path=/home`
return response
```

#### get(name)

```javascript
// 假设请求为 /home
let response = NextResponse.next()
// { name: 'show-banner', value: 'false', Path: '/home' }
response.cookies.get('show-banner')
```

#### getAll()

```javascript
// 假设请求为 /home
let response = NextResponse.next()
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
response.cookies.getAll('experiments')
// 返回所有 cookie 值
response.cookies.getAll()
```

#### delete(name)

```javascript
// 假设请求为 /home
let response = NextResponse.next()
// 返回 true 表示删除成功, false 表示没有删掉任何东西
response.cookies.delete('experiments')
```

### 5.3. json

使用给定的 JSON 正文生成响应：

```javascript
// app/api/route.js
import { NextResponse } from 'next/server'
 
export async function GET(request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

### 5.4. redirect()

生成重定向到新 URL 的响应：

```javascript
import { NextResponse } from 'next/server'
 
return NextResponse.redirect(new URL('/new', request.url))
```

在 `NextResponse.redirect()`方法使用前可以创建和更改 [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)，举个例子，你可以使用  `request.nextUrl` 获取当前的 URL，然后据此更改成重定向的 URL：

```javascript
import { NextResponse } from 'next/server'
 
const loginUrl = new URL('/login', request.url)
// 添加 ?from=/incoming-url 参数到 /login URL
loginUrl.searchParams.set('from', request.nextUrl.pathname)
// 重定向到新 URL
return NextResponse.redirect(loginUrl)
```

### 5.5. rewrite()

保留原始 URL 的同时生成一个重写到指定 URL 的响应：

```javascript
import { NextResponse } from 'next/server'
 
// 传入请求: /about, 浏览器显示 /about
// 重写请求: /proxy, 浏览器显示 /about
return NextResponse.rewrite(new URL('/proxy', request.url))
```

### 5.6. next()

常用在中间件，用于提前返回并继续路由：

```javascript
import { NextResponse } from 'next/server'
 
return NextResponse.next()
```

也可以在生成响应的时候转发 `headers`。

```javascript
import { NextResponse } from 'next/server'
 
const newHeaders = new Headers(request.headers)
// 添加新 header
newHeaders.set('x-version', '123')
// 返回新的 headers
return NextResponse.next({
  request: {
    headers: newHeaders,
  },
})
```

## 6. redirect

### 6.1. 介绍

`redirect`函数，顾名思义，重定向地址，可用于服务端组件、路由处理程序、Server Actions。在 Streaming 中，使用重定向将插入一个 meta 标签以在客户端发起重定向，其他情况，它会返回一个 307 HTTP 重定向响应。如果资源不存在，可以直接使用 notFound 函数，并不一定需要 redirect 来处理。

`redirect` 函数接受两个参数：

```javascript
redirect(path, type)
```

其中：

*   `path` 字符串类型，表示重定向的 URL，可以是相对路径，也可以是绝对路径
*   `type` 值为 `replace` （默认）或者 `push`（Server Actions 中默认），表示重定向的类型

默认情况下，`redirect` 在 Sever Actions 中会用 `push`（添加到浏览器历史栈），在其他地方用 `replace`（在浏览器历史栈中替换当前的 URL）。你可以通过指定 `type`参数覆盖此行为。

注意：在服务端组件中使用 `type`参数没有效果。

`redirect` 函数不返回任何值

举个例子：

```javascript
// app/team/[id]/page.js
import { redirect } from 'next/navigation'
 
async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}
 
export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }
 
  // ...
}
```

## 7. permanentRedirect

### 7.1. 介绍

`permanentRedirect`，作用也是重定向，可用于服务端组件、客户端组件、路由处理程序、Server Actions。在 Streaming 中，使用重定向将插入一个 meta 标签以在客户端发起重定向，其他情况，它会返回一个 308 HTTP 重定向响应。。如果资源不存在，可以直接使用 notFound 函数。

permanentRedirect 函数接受两个参数：

```javascript
permanentRedirect(path, type)
```

其中：

*   `path` 字符串类型，表示重定向的 URL，可以是相对路径，也可以是绝对路径
*   `type` 值为 `replace` （默认）或者 `push`（Server Actions 中默认），表示重定向的类型

默认情况下，permanentRedirect 在 Sever Actions 中会用 `push`（添加到浏览器历史栈），在其他地方用 `replace`（在浏览器历史栈中替换当前的 URL）。你可以通过指定 `type`参数覆盖此行为。

注意：在服务端组件中使用 `type`参数没有效果。

permanentRedirect 函数不返回任何值

举个例子：

```javascript
// app/team/[id]/page.js
import { permanentRedirect } from 'next/navigation'
 
async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}
 
export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    permanentRedirect('/login')
  }
 
  // ...
}
```

## 8. notFound

### 8.1. 介绍

调用 `notFound()`函数会抛出一个 `NEXT_NOT_FOUND`错误，并且中止该路由段的渲染。通过声明一个 `not-found.js`文件可以为此路由段渲染一个 Not Found UI 来优雅的处理这个错误。

```javascript
// app/user/[id]/page.js 
import { notFound } from 'next/navigation'
 
async function fetchUser(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}
 
export default async function Profile({ params }) {
  const user = await fetchUser(params.id)
 
  if (!user) {
    notFound()
  }
 
  // ...
}
```

## 9. useParams

### 9.1. 介绍

`useParams`是一个客户端组件 hook，用于读取当前 URL 的动态参数：

```javascript
'use client'
// app/example-client-component.js
import { useParams } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const params = useParams()
 
  // 路由 -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)
 
  return <></>
}
```

### 9.2. 参数

`useParams`不接收任何参数。

```javascript
const params = useParams()
```

### 9.3. 返回值

`useParams` 返回一个包含当前路由动态参数的对象，让我们直接看个例子就明白了：

| **Route 路线**               | **URL 网址** | **useParams()**         |
| ------------------------------- | --------------- | ----------------------- |
| app/shop/page.js                | /shop           | null                    |
| app/shop/\[slug]/page.js        | /shop/1         | { slug: '1' }           |
| app/shop/\[tag]/\[item]/page.js | /shop/1/2       | { tag: '1', item: '2' } |
| app/shop/\[...slug]/page.js     | /shop/1/2       | { slug: \['1', '2'] }   |

## 10. usePathname

### 10.1. 介绍

`usePathname` 是一个客户端组件 hook，用于读取当前 URL 的 pathname。

```javascript
'use client'
// app/example-client-component.js
import { usePathname } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const pathname = usePathname()
  return <p>Current pathname: {pathname}</p>
}
```

`usePathname` 需要用在客户端组件中。

### 10.2. 参数

`usePathname`不接收任何参数。

```javascript
const pathname = usePathname()
```

### 10.3. 返回值

usePathname 返回当前 URL pathname 的字符串，让我们直接看个例子就明白了：

| **URL**             | 返回值                   |
| ------------------- | --------------------- |
| `/`                 | `'/'`                 |
| `/dashboard`        | `'/dashboard'`        |
| `/dashboard?v=2`    | `'/dashboard'`        |
| `/blog/hello-world` | `'/blog/hello-world'` |

举个例子：

```javascript
'use client'
// app/example-client-component.js
import { usePathname, useSearchParams } from 'next/navigation'
 
function ExampleClientComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    // 监听路由变化
  }, [pathname, searchParams])
}
```

## 11. useRouter

### 11.1. 介绍

`useRouter` hook 用于在客户端组件中更改路由：

```javascript
'use client'
// app/example-client-component.js
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

在 Next.js 中，优先推荐使用 `<Link>` 组件来导航，其次再针对一些特殊的需求使用 `useRouter`。

### 11.2. useRouter()

#### push

`router.push(href: string, { scroll: boolean })`执行一个客户端导航，会将新地址添加到浏览器历史栈中

#### replace

`router.replace(href: string, { scroll: boolean })`执行一个客户端导航，但不会在浏览器历史栈中添加新的条目。

#### refresh

`router.refresh()` 刷新当前路由

#### prefetch

`router.prefetch(href: string)`预获取提供的路由，加快客户端导航速度

#### back

`router.back()` 向后导航到浏览器历史栈中的上一页

#### forward()

`router.forward()`向前导航到浏览器历史栈中的下一页

### 11.3. 示例

让我们看个例子：

```javascript
'use client'
// app/components/navigation-events.js
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
 
export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(url)
    // ...
  }, [pathname, searchParams])
 
  return null
}
```

注意：当使用 App Router 的时候，从`next/navigation`中导入 `useRouter` ，而非 `next/router`。Pages Router 下的 pathname 改为使用 `usePathname()`，Pages Router 下的 query 改为使用 `useSearchParams()`。

在这个例子中，我们通过组合 `usePathname` 和 `useSearchParams` 来监听页面更改。我们可以将这个函数导入到布局中：

```javascript
// app/layout.js
import { Suspense } from 'react'
import { NavigationEvents } from './components/navigation-events'
 
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
 
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  )
}
```

在这个例子中，之所以能够生效，是因为在静态渲染的时候， `useSearchParams()`会导致客户端渲染到最近的 Suspense 边界。

再换一个例子，当导航到新路由时，Next.js 会默认滚动到页面的顶部。你可以在 `router.push()` 或 `router.replace()`中传递 `scroll: false`来禁用该行为。

```javascript
'use client'
// app/example-client-component.jsx
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard
    </button>
  )
}
```

## 12. useSearchParams

### 12.1. 介绍

`useSearchParams`是一个客户端组件 hook，用于读取当前 URL 的查询字符串。`useSearchParams` 返回一个只读版本的 [URLSearchParams](https://developer.mozilla.org/docs/Web/API/URLSearchParams)，举个例子：

```javascript
'use client'
// app/dashboard/search-bar.js
import { useSearchParams } from 'next/navigation'
 
export default function SearchBar() {
  const searchParams = useSearchParams()
 
  const search = searchParams.get('search')
 
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {search}</>
}
```

### 12.2. 参数

`useSearchParams` 不接收任何参数。

```javascript
const searchParams = useSearchParams()
```

### 12.3. 返回值

`useSearchParams` 返回一个只读版本的 [URLSearchParams](https://developer.mozilla.org/docs/Web/API/URLSearchParams)，它包含一些读取 URL 查询参数的工具方法，比如：

*   [URLSearchParams.get()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get) 返回查询参数的第一个找到的值，举个例子：

| **URL**             | **searchParams.get("a")**     |
| ------------------- | ----------------------------- |
| /dashboard?a=1      | '1'                           |
| /dashboard?a=       | ''                            |
| /dashboard?b=3      | null                          |
| /dashboard?a=1\&a=2 | '1' （返回第一个，要获取所有，使用 getAll()） |

*   [URLSearchParams.has()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has) 返回指定的查询参数是否存在，举个例子：

| **URL**        | **searchParams.has("a")** |
| -------------- | ------------------------- |
| /dashboard?a=1 | true                      |
| /dashboard?b=3 | false                     |

其他方法还有 [getAll()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll)、 [keys()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/keys)、 [values()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/values)、 [entries()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/entries)、 [forEach()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/forEach) 和 [toString()](https://developer.mozilla.org/docs/Web/API/URLSearchParams/toString)，都是基于 [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams/getAll)。

### 12.4. 行为

#### 静态渲染

如果路由是静态渲染，调用 `useSearchParams()` 会导致树到最近的 `Suspense`边界发生客户端渲染。应该尽可能将使用 `useSearchParams` 的组件放在 `Suspense` 边界中以减少客户端渲染的内容，举个例子：

```javascript
'use client'
// app/dashboard/search-bar.js
import { useSearchParams } from 'next/navigation'
 
export default function SearchBar() {
  const searchParams = useSearchParams()
 
  const search = searchParams.get('search')

  // 当使用静态渲染的时候，不会在服务端打印
  console.log(search)
 
  return <>Search: {search}</>
}
```

```javascript
// app/dashboard/page.js
import { Suspense } from 'react'
import SearchBar from './search-bar'
 
function SearchBarFallback() {
  return <>placeholder</>
}
 
export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```

#### 动态渲染

如果路由是动态渲染的，在客户端组件的初始服务端渲染的时候，`useSearchParams` 在服务端是可用的。

```javascript
'use client'
// app/dashboard/search-bar.js
import { useSearchParams } from 'next/navigation'
 
export default function SearchBar() {
  const searchParams = useSearchParams()
 
  const search = searchParams.get('search')

  // 初始渲染的时候会在服务端打印，后续导航中客户端也会打印
  console.log(search)
 
  return <>Search: {search}</>
}
```

```javascript
// app/dashboard/page.js
import SearchBar from './search-bar'
 
export const dynamic = 'force-dynamic'
 
export default function Page() {
  return (
    <>
      <nav>
        <SearchBar />
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}
```

#### 服务端组件

在 Page（服务端组件）中获取参数，使用 [searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) prop。
Layout 中（服务端组件）并不会有  [searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) prop，这是因为在共享一个布局的多个页面之间导航的时候并不会重新渲染，这也就导致  searchParams 不会发生变化。所以要想获得准确的查询参数，使用 Page 的  [searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) prop 或是在客户端组件中使用  [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params) hook 它们会在客户端重新渲染的时候带上最新的 searchParams。

### 12.5. 示例

你可以使用 useRouter 或者 Link 设置新的 `searchParams`。当路由变化后，当前的 page.js 会收到一个更新的 `searchParams` prop：

```javascript
// app/example-client-component.js
export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )
 
  return (
    <>
      <p>Sort By</p>
 
      {/* 使用 useRouter */}
      <button
        onClick={() => {
          // <pathname>?sort=asc
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>
 
      {/* 使用 <Link> */}
      <Link
        href={
          // <pathname>?sort=desc
          pathname + '?' + createQueryString('sort', 'desc')
        }
      >
        DESC
      </Link>
    </>
  )
}
```
## 参考链接

1. [https://nextjs.org/docs/app/api-reference/functions](https://nextjs.org/docs/app/api-reference/functions)