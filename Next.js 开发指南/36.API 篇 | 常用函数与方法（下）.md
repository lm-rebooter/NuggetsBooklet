## 前言

本篇我们讲解请求相关的常用方法，有：

1.  [generateStaticParams](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-1)
2.  [generateViewport](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-5)
3.  [revalidatePath](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-12)
4.  [revalidateTag](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-23)
5.  [unstable\_cache](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-30)
6.  [unstable\_noStore](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-34)
7.  [useSelectedLayoutSegment](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-37)
8.  [useSelectedLayoutSegments](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-41)

用到的时候到此篇查看具体的语法即可。

## 1. generateStaticParams

### 1.1. 介绍

`generateStaticParams`和动态路由一起使用，用于在构建时静态生成路由：

```javascript
// app/product/[id]/page.js
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}
 
// 对应会生成 3 个静态路由：
// - /product/1
// - /product/2
// - /product/3
export default function Page({ params }) {
  const { id } = params
  // ...
}
```

可以在 `generateStaticParams` 使用 fetch 请求，这个例子更贴近实际的开发场景：

```javascript
// app/blog/[slug]/page.js
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
 
export default function Page({ params }) {
  const { slug } = params
  // ...
}
```

关于 `generateStaticParams`：

*   你可以使用 `dynamicParams` 路由段配置控制当访问不是由 `generateStaticParams` 生成的动态段时发生的情况
*   在 `next dev`的时候，当你导航到路由时，`generateStaticParams`才会被调用
*   在 `next build`的时候，`generateStaticParams` 会在对应的布局或页面生成之前运行
*   在 重新验证（ISR）的时候，`generateStaticParams` 不会再次被调用
*   `generateStaticParams` 替代了 Pages Router 下的 `getStaticPaths` 函数的功能

上面这个例子是处理单个动态段，`generateStaticParams` 也可以处理多个动态段：

```javascript
// app/products/[category]/[product]/page.js
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}
 
// 对应会生成 3 个静态路由：
// - /products/a/1
// - /products/b/2
// - /products/c/3
export default function Page({ params }) {
  const { category, product } = params
  // ...
}
```

也可以处理 Catch-all 动态段：

```javascript
// app/product/[...slug]/page.js
export function generateStaticParams() {
  return [{ slug: ['a', '1'] }, { slug: ['b', '2'] }, { slug: ['c', '3'] }]
}
 
// 对应会生成 3 个静态路由：
// - /product/a/1
// - /product/b/2
// - /product/c/3
export default function Page({ params }) {
  const { slug } = params
  // ...
}
```

### 1.2. 参数

`generateStaticParams` 支持传入一个可选 `options.params` 参数。如果一个路由中的多个动态段都使用了 `generateStaticParams`，子 `generateStaticParams` 函数会为每一个父 `generateStaticParams`生成的 `params` 执行一次。

这句话是什么意思呢？举个例子，现在我们有这样一个 `/products/[category]/[product]`路由地址，这个路由里有两个动态段 `[category]`和 `[product]`，`[product]` 依赖于 `[category]`，毕竟要先知道类目才能该类目下知道有哪些产品。为了解决这个问题：

首先生成父段：

```javascript
// app/products/[category]/layout.js
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())
 
  return products.map((product) => ({
    category: product.category.slug,
  }))
}
 
export default function Layout({ params }) {
  // ...
}
```

然后子 `generateStaticParams`函数就可以使用父 `generateStaticParams`函数返回的 `params` 参数动态生成自己的段：

```javascript
// app/products/[category]/[product]/page.js
export async function generateStaticParams({ params: { category } }) {
  const products = await fetch(
    `https://.../products?category=${category}`
  ).then((res) => res.json())
 
  return products.map((product) => ({
    product: product.id,
  }))
}
 
export default function Page({ params }) {
  // ...
}
```

在这个例子中，`params` 对象就包含了从父 `generateStaticParams`生成的 `params`，可以用此生成子段的 `params`。

这种填充动态段的方式被称为“**自上而下生成参数**”，子段依赖于父段的数据。但如果不依赖，就比如提供一个接口，直接返回所有的产品和对应的目录信息，完全可以直接生成，示例代码如下：

```javascript
// app/products/[category]/[product]/page.js
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())
 
  return products.map((product) => ({
    category: product.category.slug,
    product: product.id,
  }))
}
 
export default function Page({ params }) {
  // ...
}
```

不需要再写父 `generateStaticParams` 函数，直接一步到位，这种填充动态段的方式被称为“**自下而上生成参数**”。

### 1.3. 返回值

`generateStaticParams` 应该返回一个对象数组，其中每个对象表示单个路由的填充动态段：

*   对象的每个属性都是路由要填充的动态段
*   属性名就是段名，属性值就是该段应该填写的内容

直接描述反而有些复杂，其实很简单，比如：

`/product/[id]`这种动态路由，`generateStaticParams` 应该返回一个类似于 `[{id: xxx}, {id: xxx}, ...]` 的对象。

对于 `/products/[category]/[product]`这种动态路由，`generateStaticParams` 应该返回一个类似于 `[{category: xxx, product: xxx}, {category: xxx, product: xxx}, ...]` 的对象。

对于 `/products/[...slug]`这种动态路由，`generateStaticParams` 应该返回一个类似于`[{slug: [xxx, xxx, ...]}, {slug: [xxx, xxx, ...]}, ...]` 的对象。

返回类型描述如下：

| **示例路由**                    | **generateStaticParams 返回类型**        |
| -------------------------------- | ----------------------------------------- |
| `/product/[id]`                  | `{ id: string }[]`                        |
| `/products/[category]/[product]` | `{ category: string, product: string }[]` |
| `/products/[...slug]`            | `{ slug: string[] }[]`                    |

## 2. generateViewport

你可以自定义页面的初始 viewport，有两种方法：

1.  使用静态的 `viewport` 对象
2.  使用动态的 `generateViewport` 函数

使用的时候要注意：

1.  `viewport` 对象和 `generateViewport` 函数**仅支持在服务端组件中导出**
2.  不能在同一路由段中同时导出  `viewport` 对象和 `generateViewport` 函数
3.  如果视口不依赖运行时的一些信息，尽可能使用 `viewport` 对象的方式进行定义

### 2.1. viewport 对象

从 `layout.js` 或者 `page.js` 中导出一个名为 `viewport` 的对象：

```javascript
// layout.js | page.js 
export const viewport = {
  themeColor: 'black',
}
 
export default function Page() {}
```

### 2.2. generateViewport

从 `layout.js` 或者 `page.js` 中导出一个名为 `generateViewport` 的函数，该函数返回包含一个或者多个viewport 字段的 Viewport 对象：

```javascript
export function generateViewport({ params }) {
  return {
    themeColor: '...',
  }
}
```

### 2.3. Viewport 字段

#### themeColor

[theme-color](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta/name/theme-color)，用户的浏览器将根据所设定的建议颜色来改变用户界面，比如在 Android 上的 Chrome 设定颜色后：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1883c72300c54e49acc88652d7edaa04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=894\&h=686\&s=103058\&e=png\&a=1\&b=0385f7)
支持简单的主题颜色设置：

```javascript
// layout.js | page.js
export const viewport = {
  themeColor: 'black',
}
```

对应输出为：

```html
<meta name="theme-color" content="black" />
```

也支持带 media 属性的主题颜色设置：

```javascript
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

对应输出为：

```javascript
<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

#### `width`, `initialScale`, 和 `maximumScale`

这其实是 `viewport`元标签的默认设置值，通常不需要手动设置：

```javascript
// layout.js | page.js
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // 也支持
  // interactiveWidget: 'resizes-visual',
}
```

对应输出为：

```javascript
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1"
/>
```

#### colorScheme

[colorScheme](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta/name)，指定与当前文档兼容的一种或多种配色方案。 浏览器将优先采用此元数据的值，然后再使用用户的浏览器或设备设置，来确定页面上的各种默认颜色和元素外观，例如背景色、前景色、窗体控件和滚动条。<meta name="color-scheme"> 的主要用途是指示当前页面与浅色模式和深色模式的兼容性，以及选用这两种模式时的优先顺序。它的值有 `normal`、`light`、`dark`、`only light`。

```javascript
// layout.js | page.js
export const viewport = {
  colorScheme: 'dark',
}
```

```javascript
<meta name="color-scheme" content="dark" />
```

## 3. revalidatePath

### 3.1. 介绍

`revalidatePath` 用于按需清除特定路径上的缓存数据，可用于 Node.js 和 Edge Runtimes。

使用 `revalidatePath` 的时候要知道，在 Next.js 中，清除数据缓存并重新获取最新数据的过程就叫做重新验证（Revalidation），即便在动态路由段中调用了多次 `revalidatePath`，也不会立即触发多次重新验证，只有当下次访问的时候才会重新获取数据并更新缓存。

### 3.2. 参数

```javascript
revalidatePath(path: string, type?: 'page' | 'layout'): void;
```

*   `path` 可以是路由字符串（如 `/product/123`），也可以是文件系统地址字符串（如 `/product/[slug]/page`），必须少于 1024 个字符
*   `type`可选参数，要重新验证的地址类型，值为 `page`或 `layout`

### 3.3. 返回值

`revalidatePath` 不返回任何值

### 3.4. 示例

#### 重新验证特定 URL

```javascript
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/post-1')
```

#### 重新验证页面路径

```javascript
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'page')
// 带路由组也可以
revalidatePath('/(main)/post/[slug]', 'page')
```

注意在这个例子中，仅重新验证与所提供的 page 文件对应的 URL，也就是说，不会重新验证在这之下的页面，比如 /`blog/[slug]` 不会让 `/blog/[slug]/[author]` 也失效

#### 重新验证布局路径

```javascript
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'layout')
// 带路由组也可以
revalidatePath('/(main)/post/[slug]', 'layout')
```

在这个例子中，这会何重新验证任何使用这个布局的页面，也就是说， /`blog/[slug]`也会让 `/blog/[slug]/[author]` 失效

#### 重新验证所有数据

```javascript
import { revalidatePath } from 'next/cache'
 
revalidatePath('/', 'layout')
```

这会清除客户端路由缓存，并在下次访问时重新验证数据缓存。

#### Server Action

```javascript
'use server'
// app/actions.js
import { revalidatePath } from 'next/cache'
 
export default async function submit() {
  await submitForm()
  revalidatePath('/')
}
```

#### 路由处理程序

```javascript
// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache'
 
export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path')
 
  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }
 
  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}
```

## 4. revalidateTag

### 4.1. 介绍

`revalidateTag` 用于按需清除特定标签的缓存数据，可用于 Node.js 和 Edge Runtimes。

使用 `revalidateTag` 的时候要知道，在 Next.js 中，清除数据缓存并重新获取最新数据的过程就叫做重新验证（Revalidation），即便在动态路由段中调用了多次 `revalidateTag`，也不会立即触发多次重新验证，只有当下次访问的时候才会重新获取数据并更新缓存。

### 4.2. 参数

```javascript
revalidateTag(tag: string): void;
```

*   tag 表示要重新验证的标签，必须小于或等于 256 个字符。

添加标签的方式：

```javascript
fetch(url, { next: { tags: [...] } });
```

### 4.3. 返回值

`revalidateTag` 不返回任何值

### 4.4. 示例

#### Server Action

```javascript
// app/actions.js
import { revalidateTag } from 'next/cache'
 
export async function GET(request) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```

#### 路由处理程序

```javascript
// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache'
 
export async function GET(request) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```

## 5. unstable\_cache

### 5.1. 介绍

`unstable_cache` 用于缓存昂贵操作的结果（如数据库查询）并在之后的请求中复用结果，使用示例如下：

```javascript
import { getUser } from './data';
import { unstable_cache } from 'next/cache';
 
const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
);
 
export default async function Component({ userID }) {
  const user = await getCachedUser(userID);
  ...
}
```

### 5.2. 参数

```javascript
const data = unstable_cache(fetchData, keyParts, options)()
```

*   `fetchData`：获取要缓存数据的异步函数，该函数返回一个 Promise
*   `keyParts`：用于标识缓存键名的数组，必须包含全局唯一的值
*   `options`：用于控制缓存行为，具体包含：
    *   `tags`: 用于控制缓存失效的标签数组
    *   `revalidate`：缓存需要重新验证的秒数

### 5.3. 返回值

`unstable_cache` 返回一个函数，该函数调用时会返回一个解析为缓存数据的 Promise。如果数据不在缓存中，则会调用提供的函数，将结果缓存并返回。

## 6. unstable\_noStore

### 6.1. 介绍

`unstable_noStore`用于声明退出静态渲染和表明该组件不应缓存，使用示例如下：

```javascript
import { unstable_noStore as noStore } from 'next/cache';
 
export default async function Component() {
  noStore();
  const result = await db.query(...);
  ...
}
```

`unstable_noStore`相当于在 `fetch` 上添加了 `cache: 'no-store'`。`unstable_noStore` 比 `export const dynamic = 'force-dynamic'`更好的一点是它更细粒度，可以在每个组件的基础上使用。

### 6.2. 示例

如果你不想向 `fetch` 传递额外的选项如 `cache: 'no-store'` 或 `next: { revalidate: 0 }`，你可以使用 `noStore()`作为替代。

```javascript
import { unstable_noStore as noStore } from 'next/cache';
 
export default async function Component() {
  noStore();
  const result = await db.query(...);
  ...
}
```

## 7. useSelectedLayoutSegment

### 7.1. 介绍

`useSelectedLayoutSegment`是一个客户端组件 hook，用于读取比调用该方法所在的布局低一级的激活路由段。这个功能对于导航 UI 非常有用，比如父布局中的选项卡，需要根据当前所处的路由段来更改样式，基础使用示例代码如下：

```javascript
'use client'
// app/example-client-component.js
import { useSelectedLayoutSegment } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const segment = useSelectedLayoutSegment()
 
  return <p>Active segment: {segment}</p>
}
```

为了解释这个 hook 的作用和用法，我们来写一个 demo，demo 效果如下：

![1115.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a02042ee7ef4d379e4540e093f0bad7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=458\&h=209\&s=52469\&e=gif\&f=30\&b=fefefe)

这个 demo 模拟的是侧边栏点击切换当前文章，你可以看到，随着路由的切换，对应链接的样式也发生了变化。代码如下：

```javascript
// app/blog/layout.js
import BlogNavLink from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'
 
export default async function Layout({ children }) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

```javascript
'use client'
// app/blog/blog-nav-link.js
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
 
export default function BlogNavLink({ slug, children }) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment
 
  return (
    <Link
      href={`/blog/${slug}`}
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```javascript
// app/blog/get-featured-posts.js
export default async function getFeaturedPosts() {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return [
    { id: '1', slug: 'article1', title: '文章 1'},
    { id: '2', slug: 'article2', title: '文章 2'},
    { id: '3', slug: 'article3', title: '文章 3'}
  ]
}
```

```javascript
// app/blog/[slug]/page.js
export default function Page({ params }) {
  return <div>当前 slug: {params.slug}</div>
}
```

在这个例子中，`useSelectedLayoutSegment` 是在 `app/blog/layout.js`这个布局中调用的，所以访问 `/blog/article1` 的时候，返回的是比这个布局低一级的路由段，也就是会返回 `article1`，然后我们在 `blog-nav-link.js` 中根据该返回值和当前 slug 进行判断，从而实现了当前所处链接加粗功能。

`useSelectedLayoutSegment`返回比调用该方法所在的布局低一级的激活路由段，也就是说，即使你访问 `blog/article1/about`，因为调用该方法的布局依然是 `app/blog/layout.js`，所以返回的值依然是 `article1`。

### 7.2 参数

```javascript
const segment = useSelectedLayoutSegment(parallelRoutesKey?: string)
```

`useSelectedLayoutSegment` 接收一个可选的 parallelRoutesKey 参数，用于读取平行路由中的激活路由段。

### 7.3 返回值

如果不存在，会返回 `null`，让我们再看几个例子：

| **Layout**                | **访问 URL**                     | **返回值**       |
| ------------------------- | ------------------------------ | ------------- |
| `app/layout.js`           | `/`                            | `null`        |
| `app/layout.js`           | `/dashboard`                   | `'dashboard'` |
| `app/dashboard/layout.js` | `/dashboard`                   | `null`        |
| `app/dashboard/layout.js` | `/dashboard/settings`          | `'settings'`  |
| `app/dashboard/layout.js` | `/dashboard/analytics`         | `'analytics'` |
| `app/dashboard/layout.js` | `/dashboard/analytics/monthly` | `'analytics'` |

## 8. useSelectedLayoutSegments

### 8.1. 介绍

`useSelectedLayoutSegments` 是一个客户端组件 hook，用于读取调用该方法所在的布局以下所有的激活路由段。

`useSelectedLayoutSegments` 与 `useSelectedLayoutSegment` 的区别是：

*   `useSelectedLayoutSegment` 返回的是布局下一级的激活路由段
*   `useSelectedLayoutSegments` 返回的是布局下所有的激活路由段

以上节的 demo 为例，当在 `app/blog/layout.js`布局中调用这两个方法：

访问 `/blog/article1`，`useSelectedLayoutSegment` 返回`'article1'`，`useSelectedLayoutSegments`返回` `\['article1']\`\`。

访问 `/blog/article1/about`，`useSelectedLayoutSegment`返回 `'article1'`，`useSelectedLayoutSegments`返回 `['article1', 'about']`。

`useSelectedLayoutSegments`可以用于实现如面包屑功能，基础使用示例代码如下：

```javascript
'use client'
// app/example-client-component.js
import { useSelectedLayoutSegments } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const segments = useSelectedLayoutSegments()
 
  return (
    <ul>
      {segments.map((segment, index) => (
        <li key={index}>{segment}</li>
      ))}
    </ul>
  )
}
```

### 8.2. 参数

```javascript
const segments = useSelectedLayoutSegments(parallelRoutesKey?: string)
```

### 8.3. 返回值

以数组形式返回，如果没有，返回空数组。注意如果使用了路由组，也会返回，所以可以再用一个 `filter()` 排除掉以括号为开头的条目。让我们再看几个例子：

| **Layout**                | **访问 URL**            | **返回值**                     |
| ------------------------- | --------------------- | --------------------------- |
| `app/layout.js`           | `/`                   | `[]`                        |
| `app/layout.js`           | `/dashboard`          | `['dashboard']`             |
| `app/layout.js`           | `/dashboard/settings` | `['dashboard', 'settings']` |
| `app/dashboard/layout.js` | `/dashboard`          | `[]`                        |
| `app/dashboard/layout.js` | `/dashboard/settings` | `['settings']`              |

## 参考链接

1. [https://nextjs.org/docs/app/api-reference/functions](https://nextjs.org/docs/app/api-reference/functions)