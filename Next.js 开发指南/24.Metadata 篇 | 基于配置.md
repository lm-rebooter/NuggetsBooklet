## 前言

Metadata，中文译为“元数据”，简单的来说就是描述数据的数据。

例如，一个 HTML 文件是一种数据，但 HTML 文件也能在 `<head>` 元素中包含描述该文档的数据，比如该文件的标题和字符编码。这些数据就被称为“元数据”。

```html
<head>
  <meta charset="utf-8" />
  <title>我的测试页面</title>
</head>
```

不止标题和字符编码，元数据是一个非常丰富的概念，`<head>` 中的各种 meta 标签都是元数据，比如这是描述文档作者和文档信息的元数据：

```html
<meta name="author" content="Chris Mills" />
<meta name="description" content="the description content" />
```

这是根据 [Open Graph 协议](https://ogp.me/)编写的元数据，当分享到诸如 Facebook 这样的社交平台的时候，会展示特殊的格式和信息：

```javascript
<meta property="og:image" content="..." />
<meta property="og:description" content="..." />
<meta property="og:title" content="..." />
```

网站的自定义图标、`robots.txt`、`sitemap.xml` 等也是元数据：

```html
<link rel="icon" href="favicon.ico" type="image/x-icon" />
```

元数据的丰富会改善 SEO 和 web 可共享性（比如定义一些特殊的字段用于内容分享到一些社交平台），为了方便定义和管理这些元数据，Next.js 提供了 Metadata API。在 Next.js 中，添加元数据的方法分为两类：

1.  基于配置的元数据：在 `layout.js`或 `page.js`中导出一个静态 `metadata` 对象或者一个动态的 `generateMetadata` 函数。
2.  基于文件的元数据：添加一个静态或者动态生成的特殊文件

通过这些选项，Next.js 会自动为页面生成相关的 `<head>` 元素。

## 1. 基于配置（Config-based）

### 1.1. 静态元数据

要定义一个静态元数据，需要从 `layout.js` 或者 `page.js` 文件中导出一个 `Metadata` 对象：

```javascript
// layout.js | page.js
export const metadata = {
  title: '...',
  description: '...',
}
 
export default function Page() {}
```

具体 Metadata 对象有哪些字段呢？我数了数[源码中的字段](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/metadata/default-metadata.tsx)，有 31 个，因为内容很多，所以放在本篇后面具体讲解。我们先了解下主要的定义元数据的方式。

### 1.2. 动态元数据

动态元数据是指依赖动态信息如当前路由参数、外部数据、父级路由段`metadata`等信息的元数据。要定义动态元数据，需要导出一个名为 `generateMetadata`的函数，该函数返回一个 Metadata 对象。使用示例如下：

```javascript
// app/products/[id]/page.js
export async function generateMetadata({ params, searchParams }, parent) {
  // 读取路由参数
  const id = params.id
 
  // 获取数据
  const product = await fetch(`https://.../${id}`).then((res) => res.json())
 
  // 获取和拓展父路由段 metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}
 
export default function Page({ params, searchParams }) {}
```

让我们详细讲解下 generateMetadata 函数。该函数接收两个参数，`props` 和 `parent`。

`props` 指的是包含当前路由参数的对象，该对象又有两个字段，一个是 `params`，一个是 `searchParams`。

*   params 包含当前动态路由参数的对象，让我们举些例子你就知道了:

| **Route**                       | **URL**   | **params**              |
| ------------------------------- | --------- | ----------------------- |
| app/shop/\[slug]/page.js        | /shop/1   | { slug: '1' }           |
| app/shop/\[tag]/\[item]/page.js | /shop/1/2 | { tag: '1', item: '2' } |
| app/shop/\[...slug]/page.js     | /shop/1/2 | { slug: \['1', '2'] }   |

那如果访问的不是动态路由呢？那 params 就是一个空对象 `{}`。

*   `searchParams` 是一个包含当前 URL 搜索参数的对象，举个例子：

| **URL 网址** | **searchParams**   |
| --------------- | ------------------ |
| /shop?a=1       | { a: '1' }         |
| /shop?a=1\&b=2  | { a: '1', b: '2' } |
| /shop?a=1\&a=2  | { a: \['1', '2'] } |

`searchParams` 只在 `page.js` 中会有。

而 `parent` 是一个包含父路由段 metadata 对象的 promise 对象，所以示例代码中用的是 `(await parent).openGraph`获取。

注意：无论是静态元数据还是动态元数据**都只在服务端组件中支持**。如果不依赖运行时的信息，则应该尽可能使用静态元数据方式。

缓存篇里也会讲，在 `generateMetadata`、`generateStaticParams`、布局、页面和服务端组件中的 fetch 请求会自动记忆化，所以不用担心多次请求有性能损失。

Next.js 会在等待 `generateMetadata`中数据请求完毕再开始 UI 流式传输给客户端，这可以保证流式响应的第一部分包含 `<head>` 标签。

## 2. 基于文件（File-based）

这些特殊的文件都可用于元数据：

*   favicon.ico、apple-icon.jpg 和 icon.jpg
*   opengraph-image.jpg 和 twitter-image.jpg
*   robots.txt
*   sitemap.xml

基于文件是什么意思呢？我们以 icon 为例，icon 被用于设置浏览器网页标签的图标，虽然也可以使用静态元数据的方式设置（具体讲 metadata 对象的时候会讲到），但是 Next.js 提供了更便捷的方式，那就是约定一个文件名为 `icon` 的图片，格式支持 `.ico`、`.jpg`, `.jpeg`, `.png`, `.svg`。也就是添加一个名为 `icon.(ico|jpg|jpeg|png|svg)`的图片，Next.js 就会为该路由生成对应的元数据标签：

```html
<link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

甚至如果你想动态生成该图片也可以实现，约定一个名为 `icon.(js|.ts|.tsx)`的文件，返回一张图片即可。

其他文件也是同理，使用这种方式快捷直观。不过具体这些文件该怎么设置，因为涉及的 API 太多，统一放在后面讲解。

要注意：基于文件的元数据具有更高的优先级，并会覆盖任何基于配置的元数据。

## 3. 行为

### 3.1. 默认字段

有两个默认的 `meta` 标签，即使路由未定义元数据也会添加，一个是设置网站字符编码的 `charset`，一个是设置网站视口宽度和比例的 `viewport`：

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

当然这两个元数据标签也都是可以覆盖的。

### 3.2. 顺序

一个页面和它的布局以及它的父布局，都设置了一些元数据字段，有的字段重复，有的字段不同，那么 Next.js 该怎么处理呢？

这个逻辑其实我们也很容易想到，具体页面的设置应该优先级更高。Next.js 就是按照从根路由到 `page.js`的顺序处理，比如当你访问 `/blog/1`，处理顺序为：

1.  `app/layout.tsx`（根布局）
2.  `app/blog/layout.tsx`（嵌套布局布局）
3.  `app/blog/[slug]/page.tsx`（具体页面）

### 3.3. 字段覆盖

Next.js 会按照这个顺序，将各层元数据对象**浅合并**，计算得到最终的元数据。重复的将会根据顺序进行替换。让我们举个例子，加入根布局的 `metadata` 设置为：

```javascript
// app/layout.js
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

`page.js` 的设置为：

```javascript
// app/blog/page.js
export const metadata = {
  title: 'Blog',
  openGraph: {
    title: 'Blog',
  },
}
 
// 输出:
// <title>Blog</title>
// <meta property="og:title" content="Blog" />
```

在这个例子中：

1.  `app/layout.js` 中的 `title` 被 `app/blog/page.js` 中的 `title` 替换
2.  `app/layout.js` 中的 `openGraph` 字段被 `app/blog/page.js` 中的 `openGraph` 替换，注意因为是浅合并，所以 `description` 字段丢失了。

如果你想在多个路由之间共享一些字段，那你可以将他们提取到一个单独的变量中，比如在 `app`下建立一个 `shared-metadata.js`文件共享的字段：

```javascript
// app/shared-metadata.js
export const openGraphImage = { images: ['http://...'] }
```

当需要使用时：

```javascript
// app/page.js 
import { openGraphImage } from './shared-metadata'
 
export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'Home',
  },
}
```

```javascript
// app/about/page.js
import { openGraphImage } from '../shared-metadata'
 
export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'About',
  },
}
```

在这个例子中，OG 图片在 `app/layout.js` 和 `app/about/page.js` 中共享，然而 `title` 却是不同的。

### 3.4. 字段继承

比如根布局的设置为：

```javascript
// app/layout.js
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

页面的设置为：

```javascript
// app/about/page.js
export const metadata = {
  title: 'About',
}
 
// 输出:
// <title>About</title>
// <meta property="og:title" content="Acme" />
// <meta property="og:description" content="Acme is a..." />
```

在这个例子中：

*   `app/layout.js` 中的 `title` 被 `app/about/page.js` 中的 `title` 替代
*   `app/layout.js` 中的所有 `openGraph` 字段被 `app/about/page.js` 继承，因为 `app/about/page.js` 没有设置 `openGraph` 字段

## 4. JSON-LD

### 4.1 介绍

JSON-LD，英文全称：`JavaScript Object Notation for Linked Data`，当然这个太“全”了，稍微简写一点就是 `JSON for Linking Data`，官方文档地址：[json-ld.org/](https://link.juejin.cn?target=https%3A%2F%2Fjson-ld.org%2F)，是一种基于 JSON 的数据格式，用于向 Google 和其他搜索引擎描述网站上的内容。

比如如果我们在 Google 搜索 「Chocolate in a mug」，我们会看到这样的搜索结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b52b7f8ab794983b616499bd121855c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512\&h=551\&s=37338\&e=webp\&b=212327)

这个搜索结果有评分（4.5）、评价（581条）等内容，我们打开页面，就可以看到搜索展示的这个内容其实对应了 `application/ld+json` 中的内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5305016c5a9a4739b34f1338fd5ea6bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512\&h=391\&s=112846\&e=webp\&b=f5f2f1)

### 4.2 正常添加

如果我们也要实现这样的效果，方便搜索引擎展现，该怎么做呢？

在页面加入这种结构化数据的方法很简单，只用在页面添加这样一段脚本就可以了：

```html
<script type="application/ld+json">
  // ...
</script>
```

具体里面的内容需要参考比如 Google 搜索中心提供的[《结构化数据常规指南》](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fadvanced%2Fstructured-data%2Fsd-policies)，如果你写的是文章，参考 [Article 章节](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fsearch%2Fdocs%2Fadvanced%2Fstructured-data%2Farticle)后，可以写入以下这些属性：

```html
<script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "这里填写标题",
  "image": [
  "https://ts.yayujs.com/icon-144x144.png"
  ],
  "datePublished": "2021-11-10T22:06:06.000Z",
  "dateModified": "2022-03-04T16:00:00.000Z",
  "author": [{
  "@type": "Person",
  "name": "冴羽",
  "url": "https://github.com/mqyqingfeng/Blog"
  }]
  }
</script>
```

### 4.3 Next.js 添加

如何在 Next.js 中添加 JOSN-LD 呢？Next.js 推荐在 `layout.js`或 `page.js`组件中使用 `<script>` 标签，使用示例如下：

```javascript
// app/products/[id]/page.js
export default async function Page({ params }) {
  const product = await getProduct(params.id)
 
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }
 
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... */}
    </section>
  )
}
```

如果你使用 TypeScript，可以配合使用 [schema-dts](https://www.npmjs.com/package/schema-dts) 这个包：

```javascript
import { Product, WithContext } from 'schema-dts'
 
const jsonLd: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Next.js Sticker',
  image: 'https://nextjs.org/imgs/sticker.png',
  description: 'Dynamic at the speed of static.',
}
```

添加 JSON-LD 并部署后，你可以使用 <https://search.google.com/test/rich-results> 来测试网页是否支持富媒体搜索结果，使用 <https://validator.schema.org/> 测试页面的结构化数据，输入 `https://yayujs.com`试试。

## 5. Metadata 字段

接下来我们来介绍下 Metadata 对象的字段有哪些，由于字段很多，你可以先了解一下有哪些，需要使用的时候再查找使用。每个字段都配有使用的例子。

### 5.1. title

设置文档的标题，该值可以是一个简单的字符串，也可以是一个可选的模板对象。

#### 5.1.1. 字符串

先说字符串：

```javascript
// layout.js | page.js
export const metadata = {
  title: 'Next.js',
}
```

注意在 `layout.js` 和 `page.js` 中都可以定义，输出结果为：

```javascript
<title>Next.js</title>
```

#### 5.1.2. 模板对象

再说模板对象：

```javascript
// app/layout.js 
export const metadata = {
  title: {
    default: '...',
    template: '...',
    absolute: '...',
  },
}
```

其中 `default`为没有定义 `title` 的子路由提供一个备用 title：

```javascript
// app/layout.tsx
export const metadata = {
  title: {
    default: 'Acme',
  },
}
```

```javascript
// app/about/page.tsx
export const metadata = {}
 
// Output: <title>Acme</title>
```

`template` 可用于为子路由的 `title` 添加一个前缀或者后缀，比如：

```javascript
// app/layout.js
export const metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // 设置 template 的时候，default 必传
  },
}
```

```javascript
// app/about/page.js
export const metadata = {
  title: 'About',
}
 
// Output: <title>About | Acme</title>
```

使用 `template` 的时候要注意：

1.  使用 `title.template` 的时候，`title.default` 是必要的
2.  定义在 `layout.js` 中的 `title.template` 不会应用于同级的 `page.js` 中的 `title`
3.  定义在 `page.js` 中的 `title.template` 不会有效果，因为页面没有子路由段。
4.  如果路由没有定义 `title` 或者 `title.default`，`title.template` 是不生效的

`absolute`用于设置标题，但会忽略父路由段中设置的 `title.template`：

```javascript
// app/layout.js
export const metadata = {
  title: {
    template: '%s | Acme',
  },
}
```

```javascript
// app/about/page.js
export const metadata = {
  title: {
    absolute: 'About',
  },
}
 
// Output: <title>About</title>
```

这三个值在 `layout.js` 和 `page.js` 中的表现会有不同，让我们细致梳理一下：

在 `layout.js` 中：

1.  `title`（字符串）和 `title.default` 定义的是未设置标题的子路由段的默认标题。它会根据最近的父路由段中的 `title.template` 进行拓展。举个例子：

```javascript
// app/layout.js
export const metadata = {
  title: {
    default: 'home',
    template: '%s | Home'
  }
}
```

```javascript
// app/about/layout.js
export const metadata = {
  title: {
    default: 'about'
  }
}
```

如果 `/about/company`没有定义自己标题，那它的标题为：`about | Home`。而如果最近的父路由段没有定义 `title.template`，那就不进行拓展。

PS：不过根据 demo 测试，如果 `app/layout.js` 如上相同设置，`app/about/layout.js` 不设置，`app/about/company/layout.js` 设置 `default: 'company'`，访问 `/about/company/members`时，标题为 `company | Home`，也就是说实际的测试结果是如果完全不设置 metadata，默认标题会根据最近的存在的 `title.template` 进行扩展，并不一定是最近的父路由段中的 `title.template`。

2.  `title.absolute` 定义子路由段的默认标题，它会忽略来自父路由段的 `title.template`，也就是说即使最近的父路由段有 `title.template`，也不进行拓展（所以才叫 "absoulte" 绝对标题）
3.  `title.template` 为子路由段定义一个新标题模板，也就是说即使每层 layout 都设置了 `title.template`，也不会出现 `xxx | Company | About | Home` 这种标题，设置标题的子路由段只会根据父路由段的 `title.template` 进行设置。

在 `page.js` 中：

1.  如果一个页面没有定义自己的标题，它会使用最近的父级解析标题，注意是“最近的‘父级解析标题’”，而非“‘最近的父级’解析标题”。

PS：根据 demo 测试，如果 `page.js` 未设置 `title`，会优先使用同级 `layout.js` 中设置的 `title`，包括字符串、`title.default` 和` title.abslolute` 的方式。

如果祖先 `layout.js` 中只有一层设置了标题，而其他都未设置，页面的标题会使用该标题，比如 `app/layout.js`中设置 `title: 'home'`，`app/about/company/members`中的各层 `layout.js`都未设置，`/about/company/members` 的 `title` 为 `home`。欢迎写 demo 验证。

2.  如果 `page.js` 定义了路由 title（字符串），它会根据最近的父路由段中的 title.template 进行拓展。

PS：不过根据 demo 测试，如同 `layout.js`，如果父级完全不设置 metadata，标题会根据最近的存在的 `title.template` 进行扩展，并不一定是最近的父路由段中的 `title.template`。

换句话说，如果不设置 `layout.js` 的 `metadata`，在标题的处理上，相当于这层不存在。

3.  使用 `title.absolute` 定义路由标题，它会忽略父路由段中的 `title.template`.
4.  `page.js` 中设置 `title.template`没有效果。

总之，在使用的时候，尽可能保证每个页面都有设置 title，就不会遇到奇怪的逻辑了。

### 5.2. description

设置页面的描述：

```javascript
// layout.js | page.js
export const metadata = {
  description: 'The React Framework for the Web',
}
```

输出的 HTML 为：

```javascript
<meta name="description" content="The React Framework for the Web" />
```

### 5.3. 基础字段

```javascript
// layout.js | page.js
export const metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  creator: 'Jiachi Liu',
  publisher: 'Sebastian Markbåge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}
```

输出的 HTML 为：

```html
<meta name="application-name" content="Next.js" />
<meta name="author" content="Seb" />
<link rel="author" href="https://nextjs.org" />
<meta name="author" content="Josh" />
<meta name="generator" content="Next.js" />
<meta name="keywords" content="Next.js,React,JavaScript" />
<meta name="referrer" content="origin-when-cross-origin" />
<meta name="color-scheme" content="dark" />
<meta name="creator" content="Jiachi Liu" />
<meta name="publisher" content="Sebastian Markbåge" />
<meta name="format-detection" content="telephone=no, address=no, email=no" />
```

### 5.4. metadataBase

设置 metadata 字段中地址的 URL 前缀，看个例子就明白了：

```javascript
// layout.js | page.js
export const metadata = {
  metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
```

输出的 HTML 为：

```html
<link rel="canonical" href="https://acme.com" />
<link rel="alternate" hreflang="en-US" href="https://acme.com/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://acme.com/de-DE" />
<meta property="og:image" content="https://acme.com/og-image.png" />
```

关于 `metadataBase` 和 `metadata`，Next.js 会自动处理，并不是简单的字符串拼接，比如当你设置 `metadataBase`为：

```javascript
// app/layout.js
export const metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

如果你传入 `metadata` 的值为：

| **metadata 字段**                  | **解析 URL**                       |
| -------------------------------- | -------------------------------- |
| /                                | <https://acme.com>               |
| ./                               | <https://acme.com>               |
| payments                         | <https://acme.com/payments>      |
| /payments                        | <https://acme.com/payments>      |
| ./payments                       | <https://acme.com/payments>      |
| ../payments                      | <https://acme.com/payments>      |
| <https://beta.acme.com/payments> | <https://beta.acme.com/payments> |

其他关于 metadataBase：

1.  `metadataBase` 通常设置在`app/layout.js`，应用于所有路由
2.  `metadataBase` 可以设置的更具体，比如 `https://app.acme.com`、`https://acme.com/start/from/here`等
3.  如果 `metadata` 提供了绝对地址，`metadataBase` 就会被忽略
4.  在没有配置 `metadataBase` 的时候，`metadata` 使用相对地址会报错
5.  Next.js 会在 `metadataBase` 和相对地址间处理多余的斜线，比如 `metadataBase` 为 `https://acme.com/`，`metadata` 为 `/path`，Next.js 也能正确处理为 `https://acme.com/path`。

### 5.5. openGraph

```javascript
// layout.js | page.js
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png',
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png',
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

输出的 HTML 为：

```javascript
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:url" content="https://nextjs.org/" />
<meta property="og:site_name" content="Next.js" />
<meta property="og:locale" content="en_US" />
<meta property="og:image:url" content="https://nextjs.org/og.png" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="600" />
<meta property="og:image:url" content="https://nextjs.org/og-alt.png" />
<meta property="og:image:width" content="1800" />
<meta property="og:image:height" content="1600" />
<meta property="og:image:alt" content="My custom alt" />
<meta property="og:type" content="website" />
```

```javascript
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    type: 'article',
    publishedTime: '2023-01-01T00:00:00.000Z',
    authors: ['Seb', 'Josh'],
  },
}
```

输出的 HTML 为：

```html
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2023-01-01T00:00:00.000Z" />
<meta property="article:author" content="Seb" />
<meta property="article:author" content="Josh" />
```

### 5.6. robots

```javascript
// layout.js | page.js
export const metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

输出的 HTML 为：

```javascript
<meta name="robots" content="noindex, follow, nocache" />
<meta
  name="googlebot"
  content="index, nofollow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
/>
```

### 5.7. icons

```javascript
// layout.js | page.js
export const metadata = {
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
}
```

输出的 HTML 为：

```javascript
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
```

```javascript
export const metadata = {
  icons: {
    icon: [{ url: '/icon.png' }, new URL('/icon.png', 'https://example.com')],
    shortcut: ['/shortcut-icon.png'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
}
```

输出的 HTML 为：

```javascript
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
<link rel="icon" href="https://example.com/icon.png" />
<link
  rel="apple-touch-icon"
  href="/apple-icon-x3.png"
  sizes="180x180"
  type="image/png"
/>
```

### 5.8. themeColor

metadata 中的 themeColor 已废弃，使用 [viewport 配置项](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-5)

### 5.9. manifest

```javascript
// layout.js | page.js
export const metadata = {
  manifest: 'https://nextjs.org/manifest.json',
}
```

输出的 HTML 为：

```javascript
<link rel="manifest" href="https://nextjs.org/manifest.json" />
```

### 5.10. twitter

```javascript
// layout.js | page.js
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'],
  },
}
```

输出的 HTML 为：

```javascript
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
```

```javascript
// layout.js | page.js
export const metadata = {
  twitter: {
    card: 'app',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: {
      url: 'https://nextjs.org/og.png',
      alt: 'Next.js Logo',
    },
    app: {
      name: 'twitter_app',
      id: {
        iphone: 'twitter_app://iphone',
        ipad: 'twitter_app://ipad',
        googleplay: 'twitter_app://googleplay',
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url',
      },
    },
  },
}
```

输出的 HTML 为：

```javascript
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:card" content="app" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
<meta name="twitter:image:alt" content="Next.js Logo" />
<meta name="twitter:app:name:iphone" content="twitter_app" />
<meta name="twitter:app:id:iphone" content="twitter_app://iphone" />
<meta name="twitter:app:id:ipad" content="twitter_app://ipad" />
<meta name="twitter:app:id:googleplay" content="twitter_app://googleplay" />
<meta name="twitter:app:url:iphone" content="https://iphone_url" />
<meta name="twitter:app:url:ipad" content="https://ipad_url" />
<meta name="twitter:app:name:ipad" content="twitter_app" />
<meta name="twitter:app:name:googleplay" content="twitter_app" />
```

### 5.11. viewport

Next.js 14 起已废弃，使用 [viewport 配置项](https://juejin.cn/book/7307859898316881957/section/7309079586296791050#heading-5)

### 5.12. verification

```javascript
// layout.js | page.js
export const metadata = {
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: ['my-email', 'my-link'],
    },
  },
}
```

输出的 HTML 为：

```javascript
<meta name="google-site-verification" content="google" />
<meta name="y_key" content="yahoo" />
<meta name="yandex-verification" content="yandex" />
<meta name="me" content="my-email" />
<meta name="me" content="my-link" />
```

### 5.13. appleWebApp

```javascript
// layout.js | page.js
export const metadata = {
  itunes: {
    appId: 'myAppStoreID',
    appArgument: 'myAppArgument',
  },
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
}
```

输出的 HTML 为：

```html
<meta
  name="apple-itunes-app"
  content="app-id=myAppStoreID, app-argument=myAppArgument"
/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Apple Web App" />
<link
  href="/assets/startup/apple-touch-startup-image-768x1004.png"
  rel="apple-touch-startup-image"
/>
<link
  href="/assets/startup/apple-touch-startup-image-1536x2008.png"
  media="(device-width: 768px) and (device-height: 1024px)"
  rel="apple-touch-startup-image"
/>
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
```

### 5.14. alternates

```javascript
// layout.js | page.js
export const metadata = {
  alternates: {
    canonical: 'https://nextjs.org',
    languages: {
      'en-US': 'https://nextjs.org/en-US',
      'de-DE': 'https://nextjs.org/de-DE',
    },
    media: {
      'only screen and (max-width: 600px)': 'https://nextjs.org/mobile',
    },
    types: {
      'application/rss+xml': 'https://nextjs.org/rss',
    },
  },
}
```

输出的 HTML 为：

```javascript
<link rel="canonical" href="https://nextjs.org" />
<link rel="alternate" hreflang="en-US" href="https://nextjs.org/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://nextjs.org/de-DE" />
<link
  rel="alternate"
  media="only screen and (max-width: 600px)"
  href="https://nextjs.org/mobile"
/>
<link
  rel="alternate"
  type="application/rss+xml"
  href="https://nextjs.org/rss"
/>
```

### 5.15. appLinks

```javascript
// layout.js | page.js
export const metadata = {
  appLinks: {
    ios: {
      url: 'https://nextjs.org/ios',
      app_store_id: 'app_store_id',
    },
    android: {
      package: 'com.example.android/package',
      app_name: 'app_name_android',
    },
    web: {
      url: 'https://nextjs.org/web',
      should_fallback: true,
    },
  },
}
```

输出的 HTML 为：

```html
<meta property="al:ios:url" content="https://nextjs.org/ios" />
<meta property="al:ios:app_store_id" content="app_store_id" />
<meta property="al:android:package" content="com.example.android/package" />
<meta property="al:android:app_name" content="app_name_android" />
<meta property="al:web:url" content="https://nextjs.org/web" />
<meta property="al:web:should_fallback" content="true" />
```

### 5.16. archives

```javascript
// layout.js | page.js
export const metadata = {
  archives: ['https://nextjs.org/13'],
}
```

输出的 HTML 为：

```html
<link rel="archives" href="https://nextjs.org/13" />
```

### 5.17. assets

```javascript
// layout.js | page.js
export const metadata = {
  assets: ['https://nextjs.org/assets'],
}
```

输出的 HTML 为：

```html
<link rel="assets" href="https://nextjs.org/assets" />
```

### 5.18. bookmarks

```javascript
// layout.js | page.js
export const metadata = {
  bookmarks: ['https://nextjs.org/13'],
}
```

输出的 HTML 为：

```javascript
<link rel="bookmarks" href="https://nextjs.org/13" />
```

### 5.19. category

```javascript
// layout.js | page.js
export const metadata = {
  category: 'technology',
}
```

输出的 HTML 为：

```html
<meta name="category" content="technology" />
```

### 其他

所有的 metadata 选项都可以通过像本节介绍的这种方式直接覆盖，Next.js 内部已经定义了这些字段。然而你也可能会想自定义一些 metadata 标签，此时就可以使用 other 选项：

```javascript
export const metadata = {
  other: {
    custom: 'meta',
  },
}
```

输出的 HTML 为：

```html
<meta name="custom" content="meta" />
```

## 参考链接

1.  [Optimizing: Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
2.  [Metadata - MDN Web 文档术语表：Web 相关术语的定义 | MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Metadata)
3.  [“头”里有什么——HTML 元信息 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML)
4.  [https://nextjs.org/docs/app/api-reference/functions/generate-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
