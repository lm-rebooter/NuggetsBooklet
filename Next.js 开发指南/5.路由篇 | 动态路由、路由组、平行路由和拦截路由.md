## 前言

实际项目开发的时候，有的路由场景会比较复杂，比如数据库里的文章有很多，我们不可能一一去定义路由，此时该怎么办？组织代码的时候，有的路由是用于移动端，有的路由是用于 PC 端，该如何组织代码？如何有条件的渲染页面，比如未授权的时候显示登录页？如何让同一个路由根据不同的场景展示不同的内容？

本篇我们会一一解决这些问题，在此篇，你将会感受到 App Router 强大的路由功能。

## 1. 动态路由（Dynamic Routes）

有的时候，你并不能提前知道路由的地址，就比如根据 URL 中的 id 参数展示该 id 对应的文章内容，文章那么多，我们不可能一一定义路由，这个时候就需要用到动态路由。

### 1.1. \[folderName]

使用动态路由，你需要将文件夹的名字用方括号括住，比如 `[id]`、`[slug]`。这个路由的名字会作为 `params` prop 传给**布局**、 **页面**、 **[路由处理程序](https://juejin.cn/book/7307859898316881957/section/7308914343129645065#heading-4)** 以及 **[generateMetadata](https://juejin.cn/book/7307859898316881957/section/7309079119902277669#heading-3)** 函数。

举个例子，我们在 `app/blog` 目录下新建一个名为 `[slug]` 的文件夹，在该文件夹新建一个 `page.js` 文件，代码如下：

```javascript
// app/blog/[slug]/page.js
export default function Page({ params }) {
  return <div>My Post: {params.slug}</div>
}
```

效果如下：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88ee11229ac6473682f4f4344a34a285~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690\\&h=208\\&s=24236\\&e=png\\&b=000000" width="400" />

当你访问 `/blog/a`的时候，`params` 的值为 `{ slug: 'a' }`。

当你访问 `/blog/yayu`的时候，`params` 的值为 `{ slug: 'yayu' }`。

以此类推。

### 1.2. \[...folderName]

在命名文件夹的时候，如果你在方括号内添加省略号，比如 `[...folderName]`，这表示捕获所有后面所有的路由片段。

也就是说，`app/shop/[...slug]/page.js`会匹配 `/shop/clothes`，也会匹配 `/shop/clothes/tops`、`/shop/clothes/tops/t-shirts`等等。

举个例子，`app/shop/[...slug]/page.js`的代码如下：

```javascript
// app/shop/[...slug]/page.js
export default function Page({ params }) {
  return <div>My Shop: {JSON.stringify(params)}</div>
}
```

效果如下：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90e8b8aa9599485b99832890b9895ac4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=726\&h=206\&s=28238\&e=png\&b=000000" width="400" />

当你访问 `/shop/a`的时候，`params` 的值为 `{ slug: ['a'] }`。

当你访问 `/shop/a/b`的时候，`params` 的值为 `{ slug: ['a', 'b'] }`。

当你访问 `/shop/a/b/c`的时候，`params` 的值为 `{ slug: ['a', 'b', 'c'] }`。

以此类推。

### 1.3. \[\[...folderName]]

**在命名文件夹的时候，如果你在双方括号内添加省略号，比如 `[[...folderName]]`，这表示可选的捕获所有后面所有的路由片段。**

也就是说，`app/shop/[[...slug]]/page.js`会匹配 `/shop`，也会匹配 `/shop/clothes`、 `/shop/clothes/tops`、`/shop/clothes/tops/t-shirts`等等。

它与上一种的区别就在于，不带参数的路由也会被匹配（就比如 `/shop`）

举个例子，`app/shop/[[...slug]]/page.js`的代码如下：

```javascript
// app/shop/[[...slug]]/page.js
export default function Page({ params }) {
  return <div>My Shop: {JSON.stringify(params)}</div>
}
```

效果如下：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/788b14ff953e4ecaac29c87301406ec9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=702\&h=210\&s=22349\&e=png\&b=000000" width="400" />


当你访问 `/shop`的时候，params 的值为 `{}`。

当你访问 `/shop/a`的时候，params 的值为 `{ slug: ['a'] }`。

当你访问 `/shop/a/b`的时候，params 的值为 `{ slug: ['a', 'b'] }`。

当你访问 `/shop/a/b/c`的时候，params 的值为 `{ slug: ['a', 'b', 'c'] }`。

以此类推。

## 2. 路由组（Route groups）

在 `app`目录下，文件夹名称通常会被映射到 URL 中，但你可以将文件夹标记为路由组，阻止文件夹名称被映射到 URL 中。

使用路由组，你可以将路由和项目文件按照逻辑进行分组，但不会影响 URL 路径结构。路由组可用于比如：

1.  按站点、意图、团队等将路由分组
2.  在同一层级中创建多个布局，甚至是创建多个根布局

那么该如何标记呢？把文件夹用括号括住就可以了，就比如 `(dashboard)`。

举些例子：

### 2.1. 按逻辑分组

**将路由按逻辑分组，但不影响 URL 路径：**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01f171f5820742ba9a017c99b15a3fd7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=930\&s=471042\&e=png\&b=171717)

你会发现，最终的 URL 中省略了带括号的文件夹（上图中的`(marketing)`和`(shop)`）。

### 2.2. 创建不同布局

**借助路由组，即便在同一层级，也可以创建不同的布局：**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4039b04e7b244f13aeaa4eca7482fd48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=930\&s=466548\&e=png\&b=171717)

在这个例子中，`/account` 、`/cart`、`/checkout` 都在同一层级。但是 `/account`和 `/cart`使用的是 `/app/(shop)/layout.js`布局和`app/layout.js`布局，`/checkout`使用的是 `app/layout.js`

### 2.3. 创建多个根布局

**创建多个根布局：**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab457a10df414024bfcc33dad6d7641d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=687\&s=335556\&e=png\&b=151515)

创建多个根布局，你需要删除掉 `app/layout.js` 文件，然后在每组都创建一个 `layout.js`文件。创建的时候要注意，因为是根布局，所以要有 `<html>` 和 `<body>` 标签。

这个功能很实用，比如你将前台购买页面和后台管理页面都放在一个项目里，一个 C 端，一个 B 端，两个项目的布局肯定不一样，借助路由组，就可以轻松实现区分。

再多说几点：

1.  路由组的命名除了用于组织之外并无特殊意义。它们不会影响 URL 路径。
2.  注意不要解析为相同的 URL 路径。举个例子，因为路由组不影响 URL 路径，所以  `(marketing)/about/page.js`和 `(shop)/about/page.js`都会解析为 `/about`，这会导致报错。
3.  创建多个根布局的时候，因为删除了顶层的 `app/layout.js`文件，访问 `/`会报错，所以`app/page.js`需要定义在其中一个路由组中。
4.  跨根布局导航会导致页面完全重新加载，就比如使用 `app/(shop)/layout.js`根布局的 `/cart` 跳转到使用 `app/(marketing)/layout.js`根布局的 `/blog` 会导致页面重新加载（full page load）。

注：当定义多个根布局的时候，使用 `app/not-found.js`会出现问题。具体参考 [《Next.js v14 如何为多个根布局自定义不同的 404 页面？竟然还有些麻烦！欢迎探讨》](https://juejin.cn/post/7351321244125265930)

## 3. 平行路由（Parallel Routes）

平行路由可以使你在同一个布局中同时或者有条件的渲染一个或者多个页面（类似于 Vue 的插槽功能）。

### 3.1. 用途 1：条件渲染

举个例子，在后台管理页面，需要同时展示团队（team）和数据分析（analytics）页面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23506139d1874086bc21c20fcd1cd644~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=952\&s=465044\&e=png\&b=1a1a1a)

平行路由的使用方式是将文件夹以 `@`作为开头进行命名，比如在上图中就定义了两个插槽 `@team` 和 `@analytics`。

插槽会作为 props 传给共享的父布局。在上图中，`app/layout.js` 从 props 中获取了 `@team` 和 `@analytics` 两个插槽的内容，并将其与 children 并行渲染：

```js
// app/layout.js
// 这里我们用了 ES6 的解构，写法更简洁一点
export default function Layout({ children, team, analytics }) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

注：从这张图也可以看出，`children` prop 其实就是一个隐式的插槽，`/app/page.js`相当于 `app/@children/page.js`。

除了让它们同时展示，你也可以根据条件判断展示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660a626f4ce242c7bcedfdff35f1e97b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=898\&s=459919\&e=png\&b=1b1b1b)

在这个例子中，先在布局中获取用户的登录状态，如果登录，显示 dashboard 页面，没有登录，显示 login 页面。这样做的一大好处就在于代码完全分离。

### 3.2. 用途 2：独立路由处理

**平行路由可以让你为每个路由定义独立的错误处理和加载界面：**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/822568ec41e9487d9eb1cd2606eb7fce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=1218\&s=559780\&e=png\&b=1d1d1d)

### 3.3. 用途 3：子导航

注意我们描述 team 和 analytics 时依然用的是“页面”这个说法，因为它们就像书写正常的页面一样使用 page.js。除此之外，它们也能像正常的页面一样，添加子页面，比如我们在 `@analytics` 下添加两个子页面：`/page-views` and `/visitors`：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/807415e0a664410d889e6b89eb71f3bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=768&s=380486&e=png&b=161616)

平行路由跟路由组一样，不会影响 URL，所以 `/@analytics/page-views/page.js` 对应的地址是 `/page-views`，`/@analytics/visitors/page.js` 对应的地址是 `/visitors`，你可以导航至这些路由：

```js
// app/layout.js
import Link from "next/link";

export default function RootLayout({ children, analytics }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <br />
          <Link href="/page-views">Page Views</Link>
          <br />
          <Link href="/visitors">Visitors</Link>
        </nav>
        <h1>root layout</h1>
        {analytics}
        {children}
      </body>
    </html>
  );
}

```
当导航至这些子页面的时候，子页面的内容会取代 `/@analytics/page.js` 以 props 的形式注入到布局中，效果如下：

![parallel-routers.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/934de8f668044072ae2436527ce3aeee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=517&s=75895&e=gif&f=28&b=191919)

线上查看代码和效果：[CodeSandbox Parallel Routes](https://codesandbox.io/p/devbox/parallel-routes-vg2lw3?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clt4etrxk00073b6hve8nzgfn%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clt4etrxj00023b6hbh7tjkti%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clt4etrxj00043b6h3xt2fybf%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clt4etrxj00063b6hk3nfgk8s%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clt4etrxj00023b6hbh7tjkti%2522%253A%257B%2522id%2522%253A%2522clt4etrxj00023b6hbh7tjkti%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clt4etrxj00063b6hk3nfgk8s%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clt4etrxj00053b6hvo4o5bbu%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_PORT%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A3000%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522id%2522%253A%2522clt4etrxj00063b6hk3nfgk8s%2522%252C%2522activeTabId%2522%253A%2522clt4etrxj00053b6hvo4o5bbu%2522%257D%252C%2522clt4etrxj00043b6h3xt2fybf%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clt4etrxj00033b6hkff9eafm%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522dev%2522%257D%255D%252C%2522id%2522%253A%2522clt4etrxj00043b6h3xt2fybf%2522%252C%2522activeTabId%2522%253A%2522clt4etrxj00033b6hkff9eafm%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

这也就是说，每个插槽都可以有自己独立的导航和状态管理，就像一个小型应用一样。这种特性适合于构建复杂的应用如 dashboard。

最后，让我们总结一下使用平行路由的优势：

1. 使用平行路由可以将单个布局拆分为多个插槽，使代码更易于管理，尤其适用于团队协作的时候
2. 每个插槽都可以定义自己的加载界面和错误状态，比如某个插槽加载速度比较慢，那就可以加一个加载效果，加载期间，也不会影响其他插槽的渲染和交互。当出现错误的时候，也只会在具体的插槽上出现错误提示，而不会影响页面其他部分，有效改善用户体验
3. 每个插槽都可以有自己独立的导航和状态管理，这使得插槽的功能更加丰富，比如在上面的例子中，我们在 `@analytics` 插槽下又建了查看页面 PV 的 `/page-views`、查看访客的 `/visitors`，使得同一个插槽区域可以根据路由显示不同的内容

那你可能要问了，我就不使用平行路由，我就完全使用拆分组件的形式，加载状态和错误状态全都自己处理，子路由也统统自己处理，可不可以？

当然是可以的，只要不嫌麻烦的话……

**注意：使用平行路由的时候，热加载有可能会出现错误。如果出现了让你匪夷所思的情况，重新运行 npm run dev 或者构建生产版本查看效果**

### 3.4. default.js

为了让大家更好的理解平行路由，我们写一个示例代码。项目结构如下：

```javascript
app
├─ @analytics
│   └─ page-views
│   │    └─ page.js
│   └─ visitors
│   │     └─ page.js
│   └─ page.js
├─ @team
│  └─ page.js
├─ layout.js
└─ page.js
```

其中 `app/layout.js`代码如下：

```jsx
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children, team, analytics }) {
  return (
    <html>
      <body className="p-6">
        <div className="p-10 mb-6 bg-sky-600 text-white rounded-xl">
          Parallel Routes Examples
        </div>
        <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
          <Link href="/">Home</Link>
          <Link href="/page-views">Page Views</Link>
          <Link href="/visitors">Visitors</Link>
        </nav>
        <div className="flex gap-6">
          {team}
          {analytics}
        </div>
        {children}
      </body>
    </html>
  );
}
```
注意：这里我们为了样式好看，使用了 Tailwind CSS，使用方式参考 《[样式篇 | Tailwind CSS、CSS-in-JS 与 Sass](https://juejin.cn/book/7307859898316881957/section/7309076792760303654#heading-5)》。对于不熟悉的同学，照样拷贝代码即可，顶多样式不生效，但并不影响这里的逻辑。

`app/page.js`代码如下：

```jsx
export default function Page() {
  return (
    <div className="p-10 mt-6 bg-sky-600 text-white rounded-xl">
      Hello, App!
    </div>
  );
}
```

`app/@analytics/page.js`代码如下：

```javascript
export default function Page() {
    return <div className="h-60 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">Hello, Analytics!</div>
}
```

`app/@analytics/page-views/page.js`代码如下：

```javascript
export default function Page() {
    return <div className="h-60 flex-1 rounded-xl bg-indigo-600 text-white flex items-center justify-center">Hello, Analytics Page Views!</div>
}
```

`app/@analytics/visitors/page.js`代码如下：

```javascript
export default function Page() {
    return <div className="h-60 flex-1 rounded-xl bg-indigo-700 text-white flex items-center justify-center">Hello, Analytics Visitors!</div>
}
```

`app/@team/page.js`代码如下：

```jsx
export default function Page() {
    return <div className="h-60 flex-1 rounded-xl bg-sky-500 text-white flex items-center justify-center">Hello, Team!</div>
}
```

其实各个 `page.js` 代码差异不大，主要是做了一点样式和文字区分。

此时访问 `/`，效果如下：


![parallel-routers-1.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03bf7c7e81bc444283375b880e052a39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518&h=932&s=81994&e=gif&f=21&b=191919)

到这里其实还只是上节例子的样式美化版。现在，点击 `Visitors` 链接导航至 `/visitors` 路由，然后刷新页面，此时你会发现，页面出现了 404 错误：


![parallel-routers-2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73952768f78c47eea8a04ead5db4d09d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518&h=932&s=127439&e=gif&f=67&b=191919)

这是为什么呢？为什么我们从首页导航至 `/visitors` 的时候可以正常显示？而直接进入 `/visitors` 就会出现 404 错误呢？

先说说为什么从首页导航至 `/visitors` 的时候可以正常显示？这是因为 Next.js 默认会追踪每个插槽的状态，具体插槽中显示的内容其实跟导航的类型有关：

* 如果是软导航（Soft Navigation，比如通过 `<Link />` 标签），在导航时，Next.js 将执行部分渲染，更改插槽的内容，如果它们与当前 URL 不匹配，维持之前的状态
* 如果是硬导航（Hard Navigation，比如浏览器刷新页面），因为 Next.js 无法确定与当前 URL 不匹配的插槽的状态，所以会渲染 404 错误

简单的来说，访问 `/visitors` 本身就会造成插槽内容与当前 URL 不匹配，按理说要渲染 404 错误，但是在软导航的时候，为了更好的用户体验，如果 URL 不匹配，Next.js 会继续保持该插槽之前的状态，而不渲染 404 错误。

那么问题又来了？不是写了 `app/@analytics/visitors/page.js` 吗？怎么会不匹配呢？对于 `@analytics` 而言，确实是匹配的，但是对于 `@team` 和 `children` 就不匹配了！

也就是说，当你访问 `/visitors` 的时候，读取的不仅仅是 `app/@analytics/visitors/page.js`，还有 `app/@team/visitors/page.js` 和 `app/visitors/page.js`。不信我们新建这两个文件测试一下。

新建 `app/@team/visitors/page.js`，代码如下：

```js
export default function Page() {
    return <div className="h-60 flex-1 rounded-xl bg-indigo-700 text-white flex items-center justify-center">Hello, Team Visitors!</div>
}
```

新建 `app/visitors/page.js`，代码如下：

```javascript
export default function Page() {
  return (
    <div className="p-10 mt-6 bg-sky-600 text-white rounded-xl">
      Hello, App Visitors!
    </div>
  );
}
```

此时再访问 `/visitors`，刷新一下页面试试，效果如下：


![parallel-routers-3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b50998f8e8d64f6c8d1ca6ca106c5f64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518&h=932&s=134590&e=gif&f=62&b=191919)

> 1. 线上效果：[CodeSandbox Parallel Routes Slot](https://codesandbox.io/p/devbox/parallel-routes-slot-gjyc7y?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clt5a2jx700073b6h8sdhy13i%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clt5a2jx600023b6h0guni4v9%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clt5a2jx700043b6h261hqftc%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clt5a2jx700063b6hujk33tpm%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B40%252C60%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clt5a2jx600023b6h0guni4v9%2522%253A%257B%2522id%2522%253A%2522clt5a2jx600023b6h0guni4v9%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clt5a2jx700063b6hujk33tpm%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clt5a2jx700053b6h614uvyna%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_PORT%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A3000%252C%2522path%2522%253A%2522%252Fvisitors%2522%257D%255D%252C%2522id%2522%253A%2522clt5a2jx700063b6hujk33tpm%2522%252C%2522activeTabId%2522%253A%2522clt5a2jx700053b6h614uvyna%2522%257D%252C%2522clt5a2jx700043b6h261hqftc%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clt5a2jx700033b6hk6jghx9f%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522dev%2522%257D%255D%252C%2522id%2522%253A%2522clt5a2jx700043b6h261hqftc%2522%252C%2522activeTabId%2522%253A%2522clt5a2jx700033b6hk6jghx9f%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/next-parallel-2>
> 3. 下载代码：`git clone -b next-parallel-2 git@github.com:mqyqingfeng/next-app-demo.git`

那么问题又来了，如果我在某一个插槽里新建了一个路由，我难道还要在其他插槽里也新建这个路由吗？这岂不是很麻烦？

为了解决这个问题，Next.js 提供了 default.js。当发生硬导航的时候，Next.js 会为不匹配的插槽呈现 default.js 中定义的内容，如果 default.js 没有定义，再渲染 404 错误。

现在删除 `app/@team/visitors/page.js` 和 `app/visitors/page.js`，改用 default.js：

新建 `app/@team/default.js`，代码如下：

```js
export default function Page() {
    return <div className="h-60 flex-1 rounded-xl bg-indigo-700 text-white flex items-center justify-center">Hello, Team Default!</div>
}
```

新建 `app/default.js`，代码如下：

```js
export default function Page() {
  return (
    <div className="p-10 mt-6 bg-sky-600 text-white rounded-xl">
      Hello, App Default!
    </div>
  );
}
```

此时效果如下：

![parallel-routers-4.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04a4460dc66b4ecabbd5117198fe5039~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1786&h=861&s=242849&e=gif&f=48&b=101010)

> 1. 线上效果：[CodeSandbox Parallel Routes Default](https://codesandbox.io/p/devbox/parallel-routes-slot-default-6xf2fl?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clt5ik79y00073b6hf3l3fzbg%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clt5ik79y00023b6hn97lfg2a%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clt5ik79y00043b6h22zpnrac%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clt5ik79y00063b6h4xgmbxtp%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clt5ik79y00023b6hn97lfg2a%2522%253A%257B%2522id%2522%253A%2522clt5ik79y00023b6hn97lfg2a%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clt5ik79y00063b6h4xgmbxtp%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clt5ik79y00053b6hh4drcmyn%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_PORT%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A3000%252C%2522path%2522%253A%2522%252Fvisitors%2522%257D%255D%252C%2522id%2522%253A%2522clt5ik79y00063b6h4xgmbxtp%2522%252C%2522activeTabId%2522%253A%2522clt5ik79y00053b6hh4drcmyn%2522%257D%252C%2522clt5ik79y00043b6h22zpnrac%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clt5ik79y00033b6h3hj0kx19%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522dev%2522%257D%255D%252C%2522id%2522%253A%2522clt5ik79y00043b6h22zpnrac%2522%252C%2522activeTabId%2522%253A%2522clt5ik79y00033b6h3hj0kx19%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/next-parallel-3>
> 3. 下载代码：`git clone -b next-parallel-3 git@github.com:mqyqingfeng/next-app-demo.git`

## 4. 拦截路由（Intercepting Routes）

拦截路由允许你在当前路由拦截其他路由地址并在当前路由中展示内容。

### 4.1 效果展示

让我们直接看个案例，打开 [dribbble.com](https://dribbble.com/) 这个网站，你可以看到很多美图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dec9df9082c74c2eb82df134572f764f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2738\&h=1504\&s=3417194\&e=png\&b=fcfafa)

现在点击任意一张图片：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8991033e34074f4d83c9e48403193d6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2746\&h=2126\&s=3229103\&e=png\&b=f9f0ee)

此时页面弹出了一层 Modal，Modal 中展示了该图片的具体内容。如果你想要查看其他图片，点击右上角的关闭按钮，关掉 Modal 即可继续浏览。值得注意的是，此时路由地址也发生了变化，它变成了这张图片的具体地址。如果你喜欢这张图片，直接复制当前的地址分享给朋友即可。

而当你的朋友打开时，其实不需要再以 Modal 的形式展现，直接展示这张图片的具体内容即可。现在刷新下该页面，你会发现页面的样式不同了：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cc41d1bffa44ea59fb4372729d376ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2774\&h=2256\&s=3254329\&e=png\&b=f9f1f0)

在这个样式里没有 Modal，就是展示这张图片的内容。

同样一个路由地址，却展示了不同的内容。这就是拦截路由的效果。如果你在 `dribbble.com` 想要访问 `dribbble.com/shots/xxxxx`，此时会拦截 `dribbble.com/shots/xxxxx` 这个路由地址，以 Modal 的形式展现。而当直接访问 `dribbble.com/shots/xxxxx` 时，则是原本的样式。

示意图如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc1bf827eb0549eebc4e9232e9f5b40f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=617\&s=243096\&e=png\&b=1e1e1e)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5a196f02498491aa4eb342238e77955~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=604\&s=280419\&e=png\&b=191919)

这是另一个拦截路由的 Demo 演示：<https://nextjs-app-route-interception.vercel.app/>

了解了拦截路由的效果，让我们再思考下使用拦截路由的意义是什么。

简单的来说，就是希望用户继续停留在重要的页面上。比如上述例子中的图片流页面，开发者肯定是希望用户能够持续在图片流页面浏览，如果点击一张图片就跳转出去，会打断用户的浏览体验，如果点击只展示一个 Modal，分享操作又会变得麻烦一点。拦截路由正好可以实现这样一种平衡。又比如任务列表页面，点击其中一项任务，弹出 Modal 让你能够编辑此任务，同时又可以方便的分享任务内容。

### 4.2 实现方式

那么这个效果该如何实现呢？在 Next.js 中，实现拦截路由需要你在命名文件夹的时候以 `(..)` 开头，其中：

*   `(.)` 表示匹配同一层级
*   `(..)` 表示匹配上一层级
*   `(..)(..)` 表示匹配上上层级。
*   `(...)` 表示匹配根目录

但是要注意的是，这个匹配的是路由的层级而不是文件夹路径的层级，就比如路由组、平行路由这些不会影响 URL 的文件夹就不会被计算层级。

看个例子：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/731ab39e379e40ffadd2119cdc843e1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=930\&s=465834\&e=png\&b=161616)

`/feed/(..)photo`对应的路由是 `/feed/photo`，要拦截的路由是 `/photo`，两者只差了一个层级，所以使用 `(..)`。

### 4.3 示例代码

我们写个 demo 来实现这个效果，目录结构如下：

```javascript
app
├─ layout.js
├─ page.js
├─ data.js
├─ default.js
├─ @modal
│  ├─ default.js
│  └─ (.)photo
│     └─ [id]
│        └─ page.js
└─ photo
   └─ [id]
      └─ page.js
```

虽然涉及的文件很多，但每个文件的代码都很简单。

先 Mock 一下图片的数据，`app/data.js`代码如下：

```javascript
export const photos = [
  { id: "1", src: "http://placekitten.com/210/210" },
  { id: "2", src: "http://placekitten.com/330/330" },
  { id: "3", src: "http://placekitten.com/220/220" },
  { id: "4", src: "http://placekitten.com/240/240" },
  { id: "5", src: "http://placekitten.com/250/250" },
  { id: "6", src: "http://placekitten.com/300/300" },
  { id: "7", src: "http://placekitten.com/500/500" },
];
```

`app/page.js`代码如下：

```javascript
import Link from "next/link";
import { photos } from "./data";

export default function Home() {
  return (
    <main className="flex flex-row flex-wrap">
      {photos.map(({ id, src }) => (
        <Link key={id} href={`/photo/${id}`}>
          <img width="200" src={src} className="m-1" />
        </Link>
      ))}
    </main>
  );
}
```

`app/layout.js` 代码如下：

```javascript
import "./globals.css";

export default function Layout({ children, modal }) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

此时访问 `/`，效果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7656b3c2eef549f5b5ac13e15649edfc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2174&h=1020&s=1634063&e=png&b=f9f6f6)

现在我们再来实现下单独访问图片地址时的效果，新建 `app/photo/[id]/page.js`，代码如下：

```javascript
import { photos } from "../../data";

export default function PhotoPage({ params: { id } }) {
  const photo = photos.find((p) => p.id === id);
  return <img className="block w-1/4 mx-auto mt-10" src={photo.src} />;
}
```

访问 `/photo/6`，效果如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d75c00958d4b4fc989a5c3c669dfbcac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1890&h=810&s=392046&e=png&b=fdfdfd)


现在我们开始实现拦截路由，为了和单独访问图片地址时的样式区分，我们声明另一种样式效果。`app/@modal/(.)photo/[id]/page.js` 代码如下：

```javascript
import { photos } from "../../../data";

export default function PhotoModal({ params: { id } }) {
  const photo = photos.find((p) => p.id === id)
  return (
    <div className="flex h-60 justify-center items-center fixed bottom-0 bg-slate-300 w-full">
      <img className="w-52" src={photo.src} />
    </div>
  )
}
```

因为用到了平行路由，所以我们需要设置 default.js。`app/default.js` 和 `app/@modal/default.js`的代码都是：

```javascript
export default function Default() {
  return null
}
```

最终的效果如下：

![intercepting-routers-5.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a60151ea58a24313aca456e9aa90814a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1787&h=951&s=1190960&e=gif&f=80&b=171717)

你可以看到，在 `/`路由下，访问 `/photo/5`，路由会被拦截，并使用 `@modal/(.)photo/[id]/page.js` 的样式。

> 1. 线上查看代码和效果：[CodeSandbox Intercepting Routes](https://codesandbox.io/p/devbox/intercepting-routes-6ngfhx)
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/Intercepting-Routes>
> 3. 下载代码：`git clone -b Intercepting-Routes git@github.com:mqyqingfeng/next-app-demo.git`

## 小结

恭喜你，完成了本节内容的学习！

这一节我们介绍了动态路由、路由组、平行路由、拦截路由，它们的共同特点就需要对文件名进行修饰。其中动态路由用来处理动态的链接，路由组用来组织代码，平行路由和拦截路由则是处理实际开发中会遇到的场景问题。平行路由和拦截路由初次理解的时候可能会有些难度，但只要你跟着文章中的 demo 手敲一遍，相信你一定能够快速理解和掌握！

## 参考链接

1.  [Routing: Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
2.  [Routing: Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
3.  [Routing: Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
4.  [Routing: Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
