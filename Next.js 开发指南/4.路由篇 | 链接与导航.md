## 前言

上篇我们介绍了如何定义路由，本篇我们讲讲如何在 Next.js 中实现链接和导航。

所谓“导航”，指的是使用 JavaScript 进行页面切换，通常会比浏览器默认的重新加载更快，因为在导航的时候，只会更新必要的组件，而不会重新加载整个页面。

在 Next.js 中，有 4 种方式可以实现路由导航：

1.  使用 `<Link>` 组件
2.  使用 `useRouter` Hook（客户端组件）
3.  使用 `redirect` 函数（服务端组件）
4.  使用浏览器原生 History API

## `<Link>`组件

Next.js 的`<Link>`组件是一个拓展了原生 HTML `<a>` 标签的内置组件，用来实现预获取（prefetching） 和客户端路由导航。这是 Next.js 中路由导航的主要和推荐方式。

#### 基础使用

基本的使用方式如下：

```javascript
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

#### 支持动态渲染

支持路由链接动态渲染：

```javascript
import Link from 'next/link'
 
export default function PostList({ posts }) {
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

#### 获取当前路径名

如果需要对当前链接进行判断，你可以使用 [usePathname()](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-54) ，它会读取当前 URL 的路径名（pathname）。示例代码如下：

```javascript
'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Navigation({ navLinks }) {
  const pathname = usePathname()
 
  return (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.href
 
        return (
          <Link
            className={isActive ? 'text-blue' : 'text-black'}
            href={link.href}
            key={link.name}
          >
            {link.name}
          </Link>
        )
      })}
    </>
  )
}
```

#### 跳转行为设置

App Router 的默认行为是滚动到新路由的顶部，或者在前进后退导航时维持之前的滚动距离。

如果你想要禁用这个行为，你可以给 `<Link>` 组件传递一个 `scroll={false}`属性，或者在使用 `router.push`和 `router.replace`的时候，设置 `scroll: false`：

```javascript
// next/link
<Link href="/dashboard" scroll={false}>
  Dashboard
</Link>
```

```javascript
// useRouter
import { useRouter } from 'next/navigation'
 
const router = useRouter()
 
router.push('/dashboard', { scroll: false })
```

注：关于 `<Link>` 组件的具体用法，我们还会在[《组件篇 | Link 和 Script》](https://juejin.cn/book/7307859898316881957/section/7309077238333308937)中详细介绍。

## useRouter() hook

第二种方式是使用 useRouter，这是 Next.js 提供的用于更改路由的 hook。使用示例代码如下：

```javascript
'use client'
 
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

注意使用该 hook 需要在客户端组件中。（顶层的 `'use client'` 就是声明这是客户端组件）

注：关于 useRouter() hook 的具体用法，我们会在[《API 篇 | 常用函数与方法（上）》](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-58) 中详细介绍。

## redirect 函数

客户端组件使用 useRouter hook，服务端组件则可以直接使用 redirect 函数，这也是 Next.js 提供的 API，使用示例代码如下：

```javascript
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

注：关于 redirect() 函数的具体用法，我们会在[《API 篇 | 常用函数与方法（上）》](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-44) 中详细介绍。

## History API

也可以使用浏览器原生的 [window.history.pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) 和 [window.history.replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) 方法更新浏览器的历史记录堆栈。通常与 usePathname（获取路径名的 hook） 和 useSearchParams（获取页面参数的 hook） 一起使用。

比如用 pushState 对列表进行排序：

```javascript
'use client'
 
import { useSearchParams } from 'next/navigation'
 
export default function SortProducts() {
  const searchParams = useSearchParams()
 
  function updateSorting(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }
 
  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

交互效果如下：

![history.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a3c63778eb945e4a5c3d95416b82f78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=801\&h=395\&s=51251\&e=gif\&f=29\&b=fdfdfd)

replaceState 会替换浏览器历史堆栈的当前条目，替换后用户无法后退，比如切换应用的地域设置（国际化）：

```javascript
'use client'
 
import { usePathname } from 'next/navigation'
 
export default function LocaleSwitcher() {
  const pathname = usePathname()
 
  function switchLocale(locale) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }
 
  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

## 总结

恭喜你，完成了本节内容的学习！

本篇我们介绍了 4 种实现导航的方式，但所涉及的具体概念如服务端组件、客户端组件、各种 hooks、函数方法等都未展开讲解，我们会在后续的文章中讲述。本篇可以作为概览，主要是为了方便大家写 Demo 的时候用到导航相关的内容。

## 参考链接

1.  <https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating>
