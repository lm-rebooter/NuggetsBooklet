## 前言

本篇开始，我们使用 Next.js 官方脚手架从零实现一个博客项目。那就让我们直接开始吧！

## 初始化项目

运行 `npx create-next-app@latest`新建项目，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a5d98371d704edf93ca9fb41caa6e4d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1642\&h=560\&s=161378\&e=png\&b=1e1e1e)

运行以下命令安装依赖项并开启开发模式：

```bash
cd next-blog && npm i && npm run dev
```

打开 <http://localhost:3000/>，检查页面是否正常运行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19663be53ebc47af94606b37909a823d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2586\&h=1028\&s=321812\&e=png\&b=070707)

## 如何处理 MDX

博客的一大组成部分是文章，技术同学写文章大多使用 Markdown。哪怕像我写在语雀，也会导出成 Markdown 格式，然后发在掘金……

### 本地 mdx

我们在 [《配置篇 | MDX》](https://juejin.cn/book/7307859898316881957/section/7309078575934930994)讲了如何借助 `@next/mdx` 处理 Markdown 的超集 MDX。当配置完毕后，将原本的 page.js 替换为 page.mdx：

```javascript
  your-project
  ├── app
  │   └── my-mdx-page
  │       └── page.mdx
  └── package.json
```

这样当你访问 `/my-mdx-page`路由的时候，就会打开渲染后的 mdx 内容。

但是这样做的问题在于：如果我要上传一篇文章，我还需要手动新建一个文件夹用于它的路由地址，这属实有点麻烦。

### 远程 mdx

为了简化这个步骤，我们通常会新建一个存放所有文章的文件夹，然后使用动态路由，动态读取对应的文章。

我们试着写一下。先安装一个处理 MDX 的库：

```javascript
npm i next-mdx-remote
```

涉及的文件和目录如下：

```javascript
next-blog              
├─ app                 
│  ├─ posts            
│  │  └─ [id]          
│  │     └─ page.js         
└─ posts               
   └─ first.mdx        
```

新建 `app/posts/[id]/page.js`，代码如下：

```javascript
import { compileMDX } from 'next-mdx-remote/rsc'
import { readFile } from 'node:fs/promises';
import path from 'path';

async function getMDXContent(name) {
  try {
    const filePath = path.join(process.cwd(), '/posts/', `${name}.mdx`)
    const contents = await readFile(filePath, { encoding: 'utf8' });
    return await compileMDX({ source: contents, options: { parseFrontmatter: true }})
  } catch (err) {
    return null
  }
}

export async function generateMetadata({ params, searchParams }, parent) {
  const res = await getMDXContent(params.id);
  if (!res) return { title: ''}
  const { frontmatter } = res;
  return { title: frontmatter.title }
}

export default async function Home({ params }) {
  const res = await getMDXContent(params.id);
  if (!res) return <h1>Page not Found!</h1>
  const {content, frontmatter} = res;

  return (
    <>
      {content}
    </>
  )
}
```

新建 `/posts/first.mdx`，代码如下：

```javascript
---
title: Hello World Article
---

# Hello World!

this is content
```

此时打开 <http://localhost:3000/posts/first>，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9475f274e7a040d6a9026facb1acbed1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2578\&h=726\&s=277984\&e=png\&b=ffffff)

可以看到：MDX 内容成功渲染，且使用 Frontmatter 实现了页面的元数据设置。

但是这样做还是有些问题：

1.  没有构建优化。页面请求的时候才读取对应的 MDX 内容进行渲染，过程并没有做优化，比如提前进行编译
2.  没有类型定义。比如 Frontmatter，代码中用的是 title，但在 MDX 中写作了 tilte，但并不会出现构建错误或提示（相信这种拼写错误大家一般不会犯，更多出现的是 tags 和 tag 这种）
3.  没有实时刷新。比如修改 `first.mdx`，页面内容并不会自动刷新
4.  内容没有被缓存。每次都是重新读取页面内容并渲染。

### Contentlayer

这就是为什么我们需要 Contentlayer。

Contentlayer，顾名思义，内容层。它会将内容转为数据，这样我们就可以在任意组件导入内容，就像我们导入其他库一样。

“将内容转为数据”听起来有些抽象，其实很简单，其本质是监听文件改变，将原本的 md、mdx 等文档内容转为 js、json 等格式，其中包含文档的各种信息，就比如将这样一个名为 `first.mdx` 的文档：

```markdown
---
title: Hello World Article
date: 2014-05-01
---

# Hello, World!
```

转为这样一个 js 文件：

```javascript
{
    title: 'Hello World Article',
    date: '2014-05-01T00:00:00.000Z',
    body: {
      raw: "...",
      code: "var Component=(()=>{var m=Object.create ..."
    },
    _id: 'first.mdx',
    _raw: {
      sourceFilePath: 'first.mdx',
      sourceFileName: 'first.mdx',
      sourceFileDir: '.',
      contentType: 'mdx',
      flattenedPath: 'first'
    }
  }
```

当在组件中使用的时候，不需要再读取原本的 mdx 文件内容，而是导入这个编译后的 js 文件即可。

可能听起来还是有些抽象，还是让我们在实战中体会它的作用吧。

#### 安装设置

尝试安装 next-contentlayer：

```javascript
npm i next-contentlayer
```

如果出现版本不兼容错误：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96375486c4594b0e86c9e414e1d3732e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1808\&h=880\&s=242734\&e=png\&b=1d1d1d)

修改 package.json，添加以下代码再进行安装：

```javascript
{
  // ...
  "overrides": {
    "next-contentlayer": {
      "next": "$next"
    }
  }
}

```

顺便再安装一些后续会用到的库：

```javascript
npm i dayjs rehype-prism-plus remark-gfm@3.0.1
```

其中：

1.  [dayjs](https://day.js.org/zh-CN/) 用于处理时间展示
2.  [rehype-prism-plus](https://www.npmjs.com/package/rehype-prism-plus) 用于处理语法高亮
3.  [remark-gfm](https://github.com/remarkjs/remark-gfm) 用于扩展 Markdown 语法

修改 `next.config.mjs`，完整代码如下：

```javascript
import { withContentlayer } from 'next-contentlayer'
export default withContentlayer({})
```

修改 `jsconfig.json`，完整代码如下：

```javascript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "contentlayer/generated": ["./.contentlayer/generated"],
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.js",
    "**/*.js",
    "**/*.jsx",
    ".next/types/**/*.js",
    ".contentlayer/generated"
  ]
}
```

修改 `.gitignore` 文件，添加如下代码：

```bash
# contentlayer
.contentlayer
```

.contentlayer 存放的正是 md、mdx 编译后的文件，这些并不需要提交到远程仓库。

#### 定义内容 Schema

根目录新建 `contentlayer.config.ts`，代码如下：

```javascript
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypePrismPlus from 'rehype-prism-plus'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}))

export default makeSource({ 
  contentDirPath: 'posts', 
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],],
  }
})
```

在这段代码中，makeSource 定义了 markdown 文档所在的位置和用到的插件，defineDocumentType 定义了 Frontmatter 的字段类型，比如我们的文档需要定义 title 和 date 两个字段，两个字段都是必须的，如果缺失某些字段，会有错误提示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42b4e0c6557641e482eb5a50c872a947~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1794\&h=446\&s=73684\&e=png\&b=1e1e1e)

如果使用了未定义的字段，也会出现错误提示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b1c7cb4cb2f4b06a1980a01705b0161~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1798\&h=378\&s=63805\&e=png\&b=1e1e1e)

#### 添加站点代码

修改 `/posts/first.mdx`，代码如下：

````javascript
---
title: Hello World Article
date: 2014-05-01
---

# Hello, World!

**这是一段加粗文字**

~~这是一段删除文字~~

```js {1,3-4} showLineNumbers
function fancyAlert(arg) {
  if (arg) {
    $.facebox({ div: '#foo' })
  }
}
````

````

新建 `/app/posts/page.js`，代码如下：

```jsx
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import dayjs from "dayjs";

function PostCard(post) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link href={post.url} className="text-blue-700 hover:text-blue-900 dark:text-blue-400">
          {post.title}
        </Link>
      </h2>
      <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
        {dayjs(post.date).format('DD/MM/YYYY')}
      </time>
    </div>
  )
}

export default function Home() {
  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">My Blog List</h1>
      {allPosts.map((post, idx) => (
      <PostCard key={idx} {...post} />
    ))}
    </div>
  )
}
````

在这段代码中，我们从 `'contentlayer/generated'`中导出了 allPosts 变量，这有点让人奇怪，allPosts 到底是哪里定义的呢？

前面我们说过 contentlayer 的本质是实时编译，将 md 文档编译成普通的 js 文件，编译后的内容存放在项目根目录下的 `.contentlayer`文件夹中。

我们在 `contentlayer.config.ts` 中定义了一个名为 Post 的文档类型，对应的所有数据就是 all + 它的复数形式，也就是 allPosts。

再举个例子，如果定义的文档类型名称为 Page，对应的所有文档数据则为 allPages，它本质上一个包含所有导入 JSON 文档的数组。让我们打印下 allPosts 看一下具体的结构：

```javascript
[
  {
    title: 'Hello World Article',
    date: '2014-05-01T00:00:00.000Z',
    body: {
      raw: "...",
      code: "var Component=(()=>{var m=Object.create ..."
    },
    _id: 'first.mdx',
    _raw: {
      sourceFilePath: 'first.mdx',
      sourceFileName: 'first.mdx',
      sourceFileDir: '.',
      contentType: 'mdx',
      flattenedPath: 'first'
    },
    type: 'Post',
    url: '/posts/first'
  },
  {
    title: 'Hello Earth Article',
    date: '2014-05-02T00:00:00.000Z',
    body: {
      raw: "...",
      code: "..."
    },
    _id: 'second.mdx',
    _raw: {
      sourceFilePath: 'second.mdx',
      sourceFileName: 'second.mdx',
      sourceFileDir: '.',
      contentType: 'mdx',
      flattenedPath: 'second'
    },
    type: 'Post',
    url: '/posts/second'
  }
]
```

allPosts 是一个数组，每一个元素包含了该文档的所有 FontMatter 字段以及文档的原内容（body.raw）和编译后的内容（body.code）。

此时浏览器效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aacd2066dcb941de8b8ebf5c19db8bbf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2072\&h=970\&s=111563\&e=png\&b=ffffff)

修改 `app/posts/[id]/page.js`，代码如下：

```jsx
import { allPosts } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import dayjs from "dayjs";

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post._raw.flattenedPath,
  }))
}
export const generateMetadata = ({ params }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.id)
  if (!post) throw new Error(`Post not found for id: ${params.id}`)
  return { title: post.title }
}

const Page = ({ params }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.id)
  if (!post) notFound()
  const MDXContent = useMDXComponent(post.body.code)

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {dayjs(post.date).format('DD/MM/YYYY')}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <MDXContent />
    </article>
  )
}

export default Page
```

因为我们使用了 rehypePrismPlus 作为代码的样式插件，它会将代码编译成带类名的 html：

![截屏2024-05-06 17.42.36.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b2f467c4c24cea8396055290d9837c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2778\&h=1448\&s=528800\&e=png\&b=ffffff)

但因为我们的代码并没有定义这些类名的样式，所以我们还需要添加下样式。

修改 `app/global.css`，添加代码如下：

```javascript
pre {
  overflow-x: auto;
}

/**
 * Inspired by gatsby remark prism - https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/
 * 1. Make the element just wide enough to fit its content.
 * 2. Always fill the visible space in .code-highlight.
 */
.code-highlight {
  float: left; /* 1 */
  min-width: 100%; /* 2 */
}

.code-line {
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: -16px;
  margin-right: -16px;
  border-left: 4px solid rgba(0, 0, 0, 0); /* Set placeholder for highlight accent border color to transparent */
}

.code-line.inserted {
  background-color: rgba(16, 185, 129, 0.2); /* Set inserted line (+) color */
}

.code-line.deleted {
  background-color: rgba(239, 68, 68, 0.2); /* Set deleted line (-) color */
}

.highlight-line {
  margin-left: -16px;
  margin-right: -16px;
  background-color: rgba(55, 65, 81, 0.5); /* Set highlight bg color */
  border-left: 4px solid rgb(59, 130, 246); /* Set highlight accent border color */
}

.line-number::before {
  display: inline-block;
  width: 1rem;
  text-align: right;
  margin-right: 16px;
  margin-left: -8px;
  color: rgb(156, 163, 175); /* Line number color */
  content: attr(line);
}
```

这些样式是为了代码块显示行号等信息。

至于代码的样式，到 [Prism themes](https://github.com/PrismJS/prism-themes) 选择一个你喜欢的样式，然后拷贝其 CSS 文件。比如我选择的是普通的 VSCode Dark 样式，地址为：<https://github.com/PrismJS/prism-themes/blob/master/themes/prism-vsc-dark-plus.css>

将这段代码也拷贝到 `app/global.css`中，最后的效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adc0d6fc6dcc4798b037a301379c336c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2784\&h=1332\&s=528833\&e=png\&b=fefefe)

## Tailwind CSS

让我们真的写一篇文章试试，实际渲染后的效果为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/357772bb33f9410a9ca6426ba6e0292d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3764\&h=1276\&s=655597\&e=png\&b=272727)

虽然对应的 HTML 标签渲染都是正确的，但因为 Tailwind CSS 默认会将所有元素的样式重置，所以最后的效果并不算“好看”。

不过 Tailwind.css 官方提供了 [Tailwind CSS Typography](https://github.com/tailwindlabs/tailwindcss-typography) 插件用于设置样式的默认值。安装：

```javascript
npm install -D @tailwindcss/typography @tailwindcss/forms
```

修改 `tailwind.config.js`，完整代码如下：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

```

修改 `app/posts/[id]/page.js`，代码如下：

```javascript
// ...

const Page = ({ params }) => {
  // ...

  return (
    <article className="mx-auto max-w-xl py-8 prose prose-slate">
      // ...
    </article>
  )
}

export default Page
```

Tailwind CSS Typography 通过在外层添加一个 prose 和 prose-xxx 类来控制其中元素的样式，有五种预定义的颜色和比例选项可用（这里我们用的是 prose-slate），此外还支持深色模式，具体参考其[官方说明](https://github.com/tailwindlabs/tailwindcss-typography)。

最后的效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9983c9a457640f9925761a4c823fbc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3770\&h=1958\&s=1054704\&e=png\&b=292929)

是不是看起来就正常多了？

> 1.  功能实现：博客 Contentlayer
> 2.  源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/next-blog-1>
> 3.  下载代码：`git clone -b next-blog-1 git@github.com:mqyqingfeng/next-app-demo.git`

## 总结

本篇我们介绍了 Contentlayer 的出现背景和使用方法，它是处理 MD 和 MDX 等内容的利器，但是 Contentlayer 这一两年近乎没有更新，使用的时候可能会遇到一些版本问题，不过目前尚未看到更好的替代方案。

## 参考链接

1.  <https://www.youtube.com/watch?v=58Pj4a4Us7A&ab_channel=Contentlayer>
2.  <https://contentlayer.dev/docs/getting-started-cddd76b7>
3.  <https://github.com/tailwindlabs/tailwindcss-typography>
