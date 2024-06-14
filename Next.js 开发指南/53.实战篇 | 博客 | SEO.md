## 前言

对于一个技术博客而言，SEO 非常重要，好的 SEO 会为你带来更多的流量。

可是问题在于，SEO 要做的事情非常多，一时间竟不知道如何开始优化。

所以本篇我们就梳理下 SEO 要做的事情。

## 1. 开发时注意

### 1.1. 尽可能使用服务端组件

尽管搜索引擎也开始支持 JS 生成的内容，但还是尽可能使用服务端组件，将主体内容渲染成 HTML 返回给爬虫

### 1.2. 尽可能使用 Streaming

使用 Streaming 并不会对 SEO 造成负面影响，相反，因为显著改善了首次页面呈现时间等性能指标，对 SEO 更好。

### 1.3. 尽可能使用 Image 组件

Image 组件本身有尺寸优化、懒加载等功能，而且为了维持视觉稳定，它会在图片加载的时候自动阻止布局偏移，此外使用 Image 组件需要设置 alt 属性，这都有利于 SEO。

### 1.4. 尽可能使用 Font 组件

Font 组件会在构建时获取外部字体文件，并自动使用 CSS size-adjust 属性对字体进行调整，以防止发生布局偏移。像谷歌公开表示过，CLS （Cumulative Layout Shift，累计布局偏移，网页整个生命周期内发生的所有意外布局偏移的得分总和）是一个重要指标。

简单来说，就是谷歌要求网页元素在加载期间不要“乱动”，比如点赞按钮本应该在下方，但因为文章还没有加载完毕，于是呈现在上方，文章加载完毕后，就被“挤”到下方，这就很不好。

Image 组件和 Font 组件默认都做了阻止布局偏移处理。

简而言之，优化 Next.js 应用程序的性能将直接影响 SEO。

## 2. 添加 robots.txt 和 sitemap.xml

关于 robots.txt 和 sitemap.xml，我们已经在 [《Metadata 篇 | 基于文件》](https://juejin.cn/book/7307859898316881957/section/7309078702511128626#heading-27)介绍过。这里我们就直接开始讲如何做。

新建 `data/siteMetadata.js`，用于存储网站常用 SEO 字段，代码如下：

```javascript
const siteMetadata = {
  siteUrl: 'https://yayujs.com'
}

export default siteMetadata
```

为了方便引入，修改 `jsconfig.json`，代码如下：

```javascript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/data/*": ["data/*"],
      "contentlayer/generated": ["./.contentlayer/generated"]
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

新建 `app/sitemap.js`，代码如下：

```javascript
import { allPosts } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap() {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allPosts
    .map((post) => ({
      url: `${siteUrl}${post.url}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'posts'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
```

这里我们动态生成了所有页面地址，当你访问 <http://localhost:3000/sitemap.xml> 时，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d196bc9374ad43af9ee502a2c3474ec0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2908\&h=808\&s=223025\&e=png\&b=ffffff)

新建 `app/robots.js`，代码如下：

```javascript
import siteMetadata from '@/data/siteMetadata'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
```

当你访问 <http://localhost:3000/robots.txt> 时，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/601ca14f8cd14f62838c30644fa9c26f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326\&h=430\&s=59537\&e=png\&b=fefefe)

## 3. 设置每个页面的 Metadata

### 3.1. 基础字段

为了方便爬取，每个页面都需要设置 title、description 等属性，除了这两个属性还有哪些属性要设置呢？

关键看搜索引擎会用到哪些字段，这个可以参考 Google 的官方文档[《Google 支持的 meta 标记和属性》](https://developers.google.com/search/docs/crawling-indexing/special-tags?hl=zh-cn)。简而言之，最常用的有：

```html
<meta name="description" content="A description of the page">
<meta name="robots" content="..., ...">
<meta name="googlebot" content="..., ...">
```

注：keywords 这种属性，Google 已经废弃不用了，参考[《Google 不会将关键字元标记用于网页排名》](https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag?hl=zh-cn)。

### 3.2. 网站规范化字段

除此之外，还应该有：

```html
<link rel="canonical" href="https://example.com/dresses/green-dresses" />
<link rel="alternate" type="application/rss+xml" href="http://example.com/rss.xml" />
```

前者用于网站规范化，参考[《如何使用 rel="canonical" 及其他方法指定规范网址》](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=zh-cn)。后者用于网站的 RSS 订阅（如果有的话）。

### 3.3. Open Graph protocol 字段

再然后要支持  Open Graph protocol，介绍参考[《VuePress 博客之 SEO 优化（四） Open Graph protocol》](https://juejin.cn/post/7073416301720371213)。

就是我们常见的 og: 开头的字段：

```javascript
<meta property="og:url" content="http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html" />
<meta property="og:type" content="article" />
<meta property="og:title" content="When Great Minds Don’t Think Alike" />
<meta property="og:description" content="How much does culture influence creative thinking?" />
<meta property="og:image" content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg" />
```

因为我们是博客，自然是选择 og 的 article 类型：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/391ba7787fb3409c8b2b0e34bbbcc067~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334\&h=462\&s=285999\&e=png\&b=fefdfd)

最终生成的字段示例如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d6213012a3e411c9dae5dc0048d4d99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1536\&h=410\&s=209089\&e=png\&b=ffffff)

### 3.4. 其他字段

最后还有一些其他字段，比如 [Twitter Card](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)，用于在 Twitter 进行分享展示，视情况添加。

至于在 Next.js 中如何添加，我们会和下一节一起实现。

## 4. 添加 JSON-LD 数据

英文全程：JavaScript Object Notation for Linked Data，官方地址：[json-ld.org/](https://link.juejin.cn?target=https%3A%2F%2Fjson-ld.org%2F)，简单的来说，就是用来描述网页的类型和内容，方便搜索引擎做展现。

比如如果我们在 Google 搜索 「Chocolate in a mug」，我们会看到这样的搜索结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e1a42cf37eb4af88c3ce1373607e849~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512\&h=551\&s=37344\&e=webp\&b=212327)

我们打开页面，就可以看到搜索展示的内容对应了 application/ld+json 中的内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53c2598fd3dd40bf9d76a1b492ea2389~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512\&h=391\&s=112668\&e=webp\&b=f4f1f0)

注：关于 JSON-LD，参考[《VuePress 博客之 SEO 优化（五）添加 JSON-LD 数据》](https://juejin.cn/post/7073749684656799780)

修改 `data/siteMetadata.js`，代码如下：

```javascript
const siteMetadata = {
  siteUrl: 'https://yayujs.com',
  title: '冴羽的技术博客',
  description: '冴羽的技术博客，分享技术、个人成长等内容',
  author: '冴羽',
  locale: 'zh-CN',
  socialBanner: 'https://cdna.artstation.com/p/assets/images/images/028/138/058/large/z-w-gu-bandageb5f.jpg?1593594749'
}

export default siteMetadata
```

这里我们添加了 SEO 常用的字段，方便复用以及作为默认值。其中 socialBanner 用于 og 或者 twitter 分享时的 image 默认图片。

修改 `app/layout.js`，代码如下：

```javascript
import siteMetadata from '@/data/siteMetadata'
import "./globals.css";

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang={siteMetadata.locale}>
      <body>{children}</body>
    </html>
  );
}

```

此时访问 <http://localhost:3000/>，效果如下：

![截屏2024-05-13 17.30.15.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3940f681e224be7a2d5a3420985e525~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3392\&h=1528\&s=832960\&e=png\&b=fefefe)

因为写在了根布局中，这些元数据相当于默认值。

如果你要修改某个页面的元数据，比如修改 `app/posts/page.js`，添加代码如下：

```javascript
export const generateMetadata = ({ params }) => {
  return { 
    title: "博客列表",
    description: "这是博客列表页面",
    openGraph: {
      title: '博客列表',
      description: '这是博客列表页面'
    }
  }
}
```

此时访问 <http://localhost:3000/posts>，效果如下：

![截屏2024-05-13 17.33.49.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/881800d7b68546daa53d6302d728bd09~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3382\&h=1380\&s=665844\&e=png\&b=ffffff)

最为复杂的应该是具体的文章页面，因为我们需要通过 FrontMatter 设置页面的元数据，并且我们使用了 Contentlayer 校验 FrontMatter 的值。

修改 `contentlayer.config.js`，代码如下：

```javascript
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypePrismPlus from 'rehype-prism-plus'
import siteMetadata from './data/siteMetadata'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string' },
    lastmod: { type: 'date' },
    images: { type: 'json' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.description,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/posts/${doc._raw.flattenedPath}`,
      }),
    },
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

我们定义了一些 FrontMatter 的字段，并基于此和 siteMetadata 的字段计算当前文章的 JSON-LD 数据。

修改 `app/posts/[id]/page.js`，代码如下：

```javascript
import { allPosts } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import dayjs from "dayjs";
import siteMetadata from '@/data/siteMetadata'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post._raw.flattenedPath,
  }))
}
export const generateMetadata = ({ params }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.id)
  if (!post) throw new Error(`Post not found for id: ${params.id}`)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()

  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  const authors = post?.authors || [siteMetadata.author]
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      siteName: siteMetadata.title,
      locale: 'zh_CN',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: imageList,
    },
  }
}

const Page = ({ params }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.id)
  if (!post) notFound()
  const MDXContent = useMDXComponent(post.body.code)
  const jsonLd = post.structuredData
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-xl py-8 prose prose-slate">
        <div className="mb-8 text-center">
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
            {dayjs(post.date).format('DD/MM/YYYY')}
          </time>
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        <MDXContent />
      </article>
    </>
  )
}

export default Page
```

我们根据文章页面的设置的 FrontMatter 数据动态生成页面元数据。

修改 `posts/first.mdx`，添加 FrontMatter 代码如下：

```javascript
---
title: 使用 Next.js App Router 常犯的 10 个错误
date: 2024-05-01
lastmod: 2024-05-02
description: 本篇介绍了使用 Next.js App Router 常犯的 10 个错误
images: [https://cdnb.artstation.com/p/assets/images/images/007/367/401/large/z-w-gu-dsassd2.jpg?1505659743]
---

```

此时访问 <http://localhost:3000/posts/first>，效果如下：

![截屏2024-05-13 17.48.13.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec1323139450457ea03b7704e58151d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3392\&h=1650\&s=1075928\&e=png\&b=ffffff)

## 5. 直接添加站点

不用等待 Google 慢慢收录，你可以直接将站点提交给 Google、百度等搜索引擎，参考 [《VuePress 博客之 SEO 优化（一） sitemap 与搜索引擎收录》](https://juejin.cn/post/7072291456462880782#heading-7)

## 6. 项目源码

> 1.  功能实现：博客添加 SEO
> 2.  源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/next-blog-2>
> 3.  下载代码：`git clone -b next-blog-2 git@github.com:mqyqingfeng/next-app-demo.git`
