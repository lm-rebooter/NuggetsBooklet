## 前言

Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML 文档。它通常用于在网站和博客上编写内容。比如当你这样书写：

```markdown
**love** using [Next.js](https://nextjs.org/)
```

对应输出为：

```html
<p>I <strong>love</strong> using <a href="https://nextjs.org/">Next.js</a></p>
```

而 [MDX](https://mdxjs.com/) 是 Markdown 的超集，不仅支持 Markdown 本身，还支持在 Markdown 文档中插入 JSX 代码，还可以导入（import）组件，添加交互内容。

实际上，MDX 可以看作是一种融合了 markdown 和 JSX 的格式，就像下面这个示例：

```markdown
# Hello, world!

<div className="note">
  > Some notable things in a block quote!
</div>
```

在这个例子中，标题是 markdown 格式，而那些类似 HTML 的标签则是 JSX 格式。markdown 侧重于编写内容，JSX 侧重于组件添加交互性，看起来是不是很棒？

而 Next.js 既可以支持本地的 MDX 内容，也可以支持服务端动态获取 MDX 文件。Next.js 插件会将 markdown 和 React 组件转换为 HTML。

那就让我们赶紧看看该如何使用 MDX 吧！

## 1. 本地 MDX

本地使用  MDX 需要借助 `@next/mdx`这个包，它从本地文件中获取数据，能够处理 markdown 和 MDX。你需要在 `/pages` 或者`/app` 目录下创建一个以 `.mdx`为扩展名的页面文件。具体的配置和用法如下：

### 1.1. 开始配置

安装渲染 MDX 相关的包：

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

在应用根目录（`app/` 和 `src/` 的父级）创建一个名为 `mdx-components.js` 的文件，这个文件是在 App Router 中使用 MDX 必须要用到的，没有这个文件会无法正常工作。文件的代码为：

```javascript
// mdx-components.js
export function useMDXComponents(components) {
  return {
    ...components,
  }
}
```

然后更新 `next.config.js`文件：

```javascript
// next.config.js
const withMDX = require('@next/mdx')()
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx']
}
 
module.exports = withMDX(nextConfig)
```

基本配置就完毕了。

### 1.2. 基本用法

现在在 `/app` 目录下创建一个 MDX 页面：

```javascript
  your-project
  ├── app
  │   └── my-mdx-page
  │       └── page.mdx
  └── package.json
```

现在你可以在 MDX 页面使用 markdown 和导入 React 组件：

```javascript
import ComponentA from '../components/a'
 
# Welcome to my MDX page!
 
This is some **bold** and _italics_ text.
 
This is a list in markdown:
 
- One
- Two
- Three
 
Checkout my React component:
 
<ComponentA />
```

打开 `/my-mdx-page` 查看渲染的结果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dca9e4b9a2cc4250ac9fbe1a06e0c4ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1368\&h=962\&s=106754\&e=png\&b=ffffff)

## 2. 远程 MDX

如果你的 markdown 或者 MDX 文件位于其他位置，你可以在服务端动态获取它，有两个常用的社区包用于获取 MDX 内容：

*   [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote#react-server-components-rsc--nextjs-app-directory-support)
*   [contentlayer](https://www.contentlayer.dev/)

使用外部内容的时候要注意，因为 MDX 会编译成 JavaScript，并且在服务端执行。所以你应该从信任的地方获取 MDX 内容，否则可能导致“远程代码执行”（remote code execution，简写：RCE，让攻击者直接向后台服务器远程注入操作系统命令或者代码，从而控制后台系统）

下面的例子中使用了 `next-mdx-remote`：

```javascript
// app/my-mdx-page-remote/page.js
import { MDXRemote } from 'next-mdx-remote/rsc'

// app/page.js
export default function Home() {
  return (
    <MDXRemote
      source={`# Hello World

      This is from Server Components!
      `}
    />
  )
}
```

当然这个例子中，没有远程获取，而是直接使用了 mdx 文本，打开 `/my-mdx-page-remote` 查看渲染的 MDX：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c53ce4d2e5c34328a318ac011ad449c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106\&h=418\&s=44123\&e=png\&b=fefefe)
结合远程获取的示例代码为：

```javascript
// app/my-mdx-page-remote/page.js
import { MDXRemote } from 'next-mdx-remote/rsc'
 
export default async function RemoteMdxPage() {
  // MDX 文本
  const res = await fetch('https://...')
  const markdown = await res.text()
  return <MDXRemote source={markdown} />
}
```

那你可能要问，组件呢？组件怎么传进去？一个示例代码如下：

```javascript
// app/my-mdx-page-remote/page.js
import { MDXRemote } from 'next-mdx-remote/rsc'

import ComponentA from '../components/a'

const components = { ComponentA }

export default function Home(props) {
  return (
    <MDXRemote
      source={`Some **mdx** text, with a component <ComponentA />`}
      components={components}
    />
  )
}

```

ComponentA 的组件代码很简单：

```javascript
// app/components/a.js
export default function Page() {
  return <span>Hello World!</span>
}
```

打开 `/my-mdx-page-remote` 查看渲染的 MDX：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bafac3ec8dd4b618fd6ee05242decad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128\&h=244\&s=33669\&e=png\&b=fefefe)

## 3. 共享布局

要在 MDX 页面之间共享布局，你可以使用 App Router 内置的布局功能：

```javascript
// app/my-mdx-page/layout.js
export default function MdxLayout({ children }) {
  return <div style={{ color: 'blue' }}>{children}</div>
}
```

## 4. 使用插件拓展功能

如果 MDX 样式和功能并不能满足你的要求，那你可能就需要自定义使用和开发插件了。为了帮助你了解如何使用和开发插件，你需要先了解下 MDX 的原理。

简单的来说，MDX 的编译分为两步，一步处理 Markdown，一步处理 HTML。处理的伪代码如下：

```javascript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
 
main()
 
async function main() {
  const file = await unified()
    .use(remarkParse) // 将 markdown 转换为 markdown AST
    .use(remarkRehype) // 转换为 HTML AST
    .use(rehypeSanitize) // HTML 消毒，处理不安全的内容，防止 XSS 攻击
    .use(rehypeStringify) // 将 AST 转换为 HTML
    .process('Hello, Next.js!')
 
  console.log(String(file)) // <p>Hello, Next.js!</p>
}
```

处理 Markdown 的这部分工具体系统称为 [Remark](https://github.com/remarkjs/remark)，处理 HTML 的这部分工具体系统称为 [Rehype](https://github.com/rehypejs/rehype)。Remark 和 Rehype 目前已经有不少的生态插件，比如[语法高亮（rehype-pretty-code）](https://github.com/atomiks/rehype-pretty-code)、[标题自动链接（rehype-autolink-headings）](https://github.com/rehypejs/rehype-autolink-headings)、[生成目录（remark-toc）](https://github.com/remarkjs/remark-toc)等。

如果你想直接使用这些插件，就比如支持 [GFM](https://github.github.com/gfm/)（GitHub Flavored Markdown，目前最流行的 Markdown 扩展语法，它提供了包括表格、任务列表、删除线、围栏代码、Emoji 等在内的标记语法），对应插件是 [remark-gfm](https://github.com/remarkjs/remark-gfm)，可以通过修改 `next.config.js` 来加载插件。

不过因为 remark 和 rehype 都是 ESM（ECMAScript modules），你需要使用 `next.config.mjs` 作为配置文件：

```javascript
// next.config.mjs
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}
 
const withMDX = createMDX({
  // 添加 markdown 插件
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

GFM 新增了删除线语法：

```markdown
~~这是一段删除文字~~
```

如果不使用 GFM 插件，无法渲染成删除线：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd5ee310b81346ee808066823faa9c6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832\&h=218\&s=26014\&e=png\&b=fdfdfd)

使用后则会正常渲染：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11103ae1c03e463ba3468982988402c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826\&h=230\&s=25346\&e=png\&b=fefefe)

## 5. 自定义元素

正常我们书写 markdown，比如写个标题：

```markdown
# header
```

对应 HTML 输出为：

```html
<h1>header</h1>
```

如果我们希望自定义这个输出的结果以及样式，该怎么实现呢？

为了实现这个功能，打开应用根目录定义的 `mdx-components.js`文件，然后添加自定义元素：

```javascript
// mdx-components.js
import Image from 'next/image'
 
export function useMDXComponents(components) {
  return {
    h1: ({ children }) => <h1 style={{ fontSize: '30px' }}>{children}</h1>,
    ...components,
  }
}
```

此时的效果为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73f22f6b3e0d4399af5bb55cc3419b6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1796\&h=404\&s=115661\&e=png\&b=fefefe)

那么问题来了，我怎么知道 markdown 语法都对应的什么标签呢？又可以修改哪些标签呢？这个可以查看 MDX 的文档：<https://mdxjs.com/table-of-components/>

这里要注意的是当使用 img 的时候，如果直接使用 `![]()`语法，加载本地图片，并不会成功：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea5b9ea4d77c43a89f2515a5be151f00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1802\&h=344\&s=83338\&e=png\&b=fefefe)

为了加载成功，需要使用 [remark-mdx-images](https://www.npmjs.com/package/remark-mdx-images) 这个插件，安装插件后，修改 `next.config.mjs`：

```javascript
// next.config.mjs
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'
import remarkMdxImages from "remark-mdx-images";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}
 
const withMDX = createMDX({
  // 添加 markdown 插件
  options: {
    remarkPlugins: [remarkGfm, remarkMdxImages],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

再修改 `mdx-components.js`：

```javascript
// mdx-components.js
import Image from 'next/image'
 
export function useMDXComponents(components) {
  return {
    h1: ({ children }) => <h1 style={{ fontSize: '30px' }}>{children}</h1>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...props}
      />
    ),
    ...components,
  }
}
```

此时图片即可正常加载：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08e534297a3045fc8991463e6e302add~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2132\&h=912\&s=1167143\&e=png\&b=2c2c2c)

## 6. Frontmatter

Frontmatter 是一个类似于 YAML 的键值对结构，用于储存页面相关的数据。

```markdown
---
title: 你好世界
created: 2023-11-18
---
Hello World!
```

默认情况下，`@next/mdx`并不支持 frontmatter，但社区有很多解决方案，比如：

*   [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter)
*   [gray-matter](https://github.com/jonschlinkert/gray-matter)

我们以 [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter) 为例进行讲解，当搭配 MDX 的时候，还需要使用 [remark-mdx-frontmatter](https://github.com/remcohaszing/remark-mdx-frontmatter)。

首先安装依赖：

```bash
npm install remark-frontmatter remark-mdx-frontmatter
```

然后修改 `next.config.mjs`：

```javascript
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'
import remarkMdxImages from "remark-mdx-images";
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}
 
const withMDX = createMDX({
  // 添加 markdown 插件
  options: {
    remarkPlugins: [
      remarkGfm, 
      remarkMdxImages,
      [remarkFrontmatter],
      [remarkMdxFrontmatter]
    ],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

基本配置就完成了，但是要注意，这两个插件的效果并不是像我们写 VuePress 中的 md 文档一样，可以用 frontmatter 中的数据定义页面的标题等数据，我们现在建立一个 mdx 文档：

```markdown
---
title: 这是文章标题
author: 冴羽
---

# header1
```

页面不会有什么变化，页面的标题不会变成 frontmatter 中设置的这个标题，也不会输出 `<meta name="author" content="冴羽">`这种 HTML 标签，这两个插件的作用就是储存元数据，用转换后的 JS 描述就是：

```javascript
export const frontmatter = {
  title: '这是文章标题'，
  author: '冴羽'
}

export default function MDXContent() {
  return <h1>header1</h1>
}
```

也就是说，使用这两个插件后，如果导入这个 MDX 文档，会有一个 frontmatter 导出对象，让你能够获取到在 MDX 文档中通过 frontmatter 格式设置的值，仅此而已。我们新建一个 `page.js`验证一下：

```javascript
import {frontmatter} from '../my-mdx-page/page.mdx'

export default function Page() {
  console.log(frontmatter)
  return  <h1>Hello World!</h1>
}
```

可以看命令行中看到输出：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da51d562f2404aeeba1a7dc571c10298~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=620\&h=56\&s=53556\&e=png\&b=020509)

那你可能想，这有什么用呢？

这可以为我们的开发提供很多便利。试想我们开发一个博客功能，在 `contents` 文件夹下建立多个 MDX 文档，作为我们的博客内容。当我们访问比如 `article/1`的时候，导入对应 id 的 MDX 文档，然后获取其中的元数据，渲染通用的一些展示内容，比如标题、作者、更新时间、标签等，这不就是一个很实用的功能嘛\~

当然这样说有些抽象，我们简单写个 demo，文件目录结构如下：

```javascript
  your-project
  ├── app
  │   └── content
  │       └── 1.mdx
  │   └── article
  │       └── [id]
	│       		└── page.js
  └── package.json
```

`app/content/1.mdx`的内容如下：

```markdown
---
title: Next.js 小册
author: 冴羽
---

# 一级标题

这是正文内容
```

这是我们要获取的文章具体内容。`article/[id]/page.js`的代码如下：

```javascript
// article/[id]/page.js
export default async function Page({ params: {id} }) {
  const articleModule = await import(`../../content/${id}.mdx`);
  const { default: Component, frontmatter: {title, author} } = articleModule;

  return (
    <main>
       <div>文章标题：{title}</div>
       <div>文章作者：{author}</div>
       <Component /> 
    </main>
  )
}
```

在这个例子中，我们通过 import() 获取到了模块内容，然后解构出了 frontmatter 对象和页面内容组件。打开 `http://localhost:3000/article/1`，渲染的结果为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b091f71112014377ae32069c175069c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076\&h=480\&s=53560\&e=png\&b=fefefe)

当然了，如果你对 frontmatter 没有那么热爱，其实你也可以直接在`.mdx` 文件导出一个 meta 对象，示例代码如下：

```javascript
export const meta = {
  title: 'Next.js 小册',
  author: '冴羽'
}

# 一级标题

这是正文内容
```

修改下 `article/[id]/page.js`的代码（将 frontmatter 替换为 meta）：

```javascript
export default async function Page({ params: {id} }) {
  const articleModule = await import(`../../content/${id}.mdx`);
  const { default: Component, meta: {title, author} } = articleModule;

  return (
    <main>
       <div>文章标题：{title}</div>
       <div>文章作者：{author}</div>
       <Component /> 
    </main>
  )
}
```

也可以正常渲染：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14cf9aeadd14487f9153eb50bfd804d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=906\&h=460\&s=50538\&e=png\&b=fefefe)

所以就看你是否想要使用 Frontmatter 这种格式。

## 7. 使用基于 Rust 的 MDX 编译器

Next.js 支持一个用 Rust 编写的 MDX 编译器。目前这个编译器还在实验中，不建议生产环境中使用。但如果你想要尝试这个新编译器，在`next.config.js`中开启配置：

```javascript
// next.config.js
module.exports = withMDX({
  experimental: {
    mdxRs: true,
  },
})
```

## 参考链接

1.  <https://github.com/altano/alan.norbauer.com/blob/main/next.config.mjs>
2.  [Configuring: MDX | Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/mdx)
3.  <https://github.com/remarkjs/remark-frontmatter>
4.  <https://mdxjs.com/>
5.  <https://www.npmjs.com/package/@next/mdx>
6.  <https://github.com/remarkjs/remark>
7.  <https://github.com/rehypejs/rehype>
