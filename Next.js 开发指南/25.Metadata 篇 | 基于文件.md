## 前言

上篇我们讲到添加元数据的方法分为两类：

1.  基于配置的元数据：在 `layout.js`或 `page.js`中导出一个静态 `metadata` 对象或者一个动态的 `generateMetadata` 函数。
2.  基于文件的元数据：添加一个静态或者动态生成的特殊文件

其中基于文件的元数据可以用来添加网站的应用图标、OG 图片、robots.txt、sitemap.xml、manifest.json。本篇我们详细讲解具体的用法和配置内容。

## 1. favicon、icon 和 apple-icon

### 1.1. 介绍

Next.js 约定 `favicon`、`icon`、`apple-icon`文件都可以用来设置应用的图标。它们可以设置浏览器标签页中的图标、收藏夹（书签）中的图标、手机屏幕图标、搜索引擎结果中的图标等等。

有两种方式可以设置图标：

1.  使用静态文件
2.  使用代码生成

让我们一一开始介绍。

### 1.2. 使用静态文件

#### 1.2.1. 文件约定

在 `/app`目录下放置一个名为 `favicon`、`icon` 或者 `apple-icon`图片文件即可设置图标。

它们之间的区别在于 `favicon` 图片只能位于 `app/` 根目录（当然这样说不太严谨，考虑到路由组的存在，准确的说应该是顶层）。`icon` 可以放在更深层的目录里，更精细的设置图标。`apple-icon` 则顾名思义，设置在苹果设备中显示的图标。这三种文件对应的图片格式、生效目录、和 `rel` 属性如下：

| 文件名称                                                                                                   | 支持的图片格式                             | 生效目录       | 对应 `<link>` 标签 `rel` 属性         |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------- | ---------- | ------------------------------- |
| [favicon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#favicon)       | `.ico`                              | `app/`     | `<link rel="icon" />`             |
| [icon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#icon)             | `.ico`、`.jpg`、`.jpeg`、`.png`、`.svg` | `app/**/*` | `<link rel="icon" />`             |
| [apple-icon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#apple-icon) | `.jpg`、`.jpeg`、`.png`               | `app/**/*` | `<link rel="apple-touch-icon" />` |

#### 1.2.2. favicon

favicon 是 favorites icon 的缩写，用于设置网站或网页相关的图标。最早定义 favicon 的方式是将一个名为 `favicon.ico`的文件放在服务器根目录下，浏览器会在加载网页的时候，请求 `/favicon.ico`文件作为图标。后来才出现了使用 `<link>` 标签这种更为灵活的方法：

```html
<link rel="icon" href="/favicon.ico" />
```

目前大多数浏览器都支持这两种方法，在 Next.js 中分别对应着使用 favicon 和使用 icon 文件。

在 `/app`下添加一个名为 `favicon.ico`的图片文件，对应 HTML 输出为：

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
```

注意其中 `sizes="any"`，这是为了避免一个[浏览器 bug](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs) 而特意这样写的。添加文件后，你可以通过访问 `/favicon.ico`（对应到本地开发的时候，地址是 `http://localhost:3000/favicon.ico` ）查看该图标文件。该图标默认会应用于网站所有路由，如果想更细粒度的控制某个网页的图标，那就用 icon。

#### 1.2.3. icon

添加一个 `icon.(ico|jpg|jpeg|png|svg)`图片文件，对应 HTML 输出为：

```html
<link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

#### 1.2.4. apple-icon

apple-icon，顾名思义，针对苹果设备使用的图标，用于将网页添加到 iPhone 或 iPad 屏幕快捷方式时使用的图标。添加一个 `apple-icon.(jpg|jpeg|png)`图片文件，对应 HTML 输出为：

```html
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

#### 1.2.5. 行为

你可以通过在文件名中添加数字后缀设置多个图标，比如 `icon1.png`、`icon2.png`、`apple-icon1.png`、`apple-icon2.png`。

为什么会需要多个图标呢？我们在查看页面源码的时候，经常会看到这样的代码：

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
```

根据设备、应用、场景的不同，会使用不同尺寸大小的图片，比如不同的浏览器、不同的场景（标签、Google 搜索结果、书签、移动端图标）、不同的系统如 IOS 和 Windows 使用的图片大小都可能不同。

而生成的 `<link>` 标签的属性如 `rel`、`href`、`type`、`sizes`是根据图标类型和文件内容生成的，比如一个 32x32 大小的 `.png`图标生成的属性有 `type="image/png"`和 `sizes="32x32"`。

你可以使用这两个网站帮助生成 icon：

1.  <https://realfavicongenerator.net/>
2.  <https://www.favicon.cc/>

### 1.3. 使用代码生成

#### 1.3.1. 介绍

除了直接使用图片文件，你也可以用代码生成图标。依然是新建一个名为 `icon` 或 `apple-icon`的文件，不过这次的后缀是 `.js`、`.ts`、`.tsx`。

最简单的生成一个图标的方式是通过 `next/og`的 `ImageResponse` API，使用示例如下：

```javascript
// app/icon.js
import { ImageResponse } from 'next/og'
 
// 路由段配置
export const runtime = 'edge'
 
// 图片 metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// 图片生成
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX 元素
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponse options
    {
      // 方便复用 size
      ...size,
    }
  )
}
```

对应输出的 HTML 为：

```html
<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
```

效果为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3935cd7bad5744f6a7202ee3effec055~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=500\&h=86\&s=8014\&e=png\&b=3a3a3a)

第一次看这个例子的时候，可能会有很多疑问，`ImageResponse`是什么？怎么用？其中的写法怎么这么奇怪？配置项有哪些等等。不用着急，我们会一一讲解。

先说几点注意事项：

1.  从 v14.0.0 起，`ImageResponse` 从 `next/server`转移到 `next/og`，如果出现导入错误，那就升级版本或者使用 `next/server`
2.  默认情况下，生成的图标是静态优化的，也就是说会在构建的时候生成并缓存，除非使用了动态函数（比如 cookies()、headers() 这些）或者未缓存数据。
3.  你不能生成 `favicon` 图标。使用 icon 或者 favicon.ico 静态文件代替。
4.  你可以使用 `generateImageMetadata` API 在一个文件中生成多个 Icon。（好家伙，又多了一个要介绍的 API）

接下来我们详细介绍下涉及到的 API。

#### 1.3.2. 默认导出函数

默认导出函数接收一个可选参数 `params`，这是一个包含动态路由参数的对象，与上一篇介绍 `generateMetadata` 中的 `params` 参数一样：

```jsx
// app/shop/[slug]/icon.js
export default function Image({ params }) {
  // ...
}
```

| **Route**                       | **URL**     | **params**               |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/icon.js`              | `/shop`     | `{}`                      |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `app/shop/[...slug]/icon.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

函数应该返回一个  [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) | [ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [DataView](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) | [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 类型的值。

#### 1.3.3. 图片元数据配置

除了导出图片文件本身，你也可以选择性的导出`size`、`contentType` 变量来设置该图片的元数据：

| **Option**                                                                                                     | **Type**                                                                                                                |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [size](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#size)               | { width: number; height: number }                                                                                       |
| [contentType](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#contenttype) | string (具体有哪些值，参考 [image MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types)） |

设置 `size`：

```javascript
// icon.js | apple-icon.js
export const size = { width: 32, height: 32 }
 
export default function Icon() {}
```

对应 HTML 输出为：

```html
<link rel="icon" sizes="32x32" />
```

设置 `contentType`：

```javascript
// icon.js | apple-icon.js
export const contentType = 'image/png'
 
export default function Icon() {}
```

对应 HTML 输出为：

```html
<link rel="icon" type="image/png" />
```

#### 1.3.4. 路由段配置

`icon` 和 `apple-icon` 其实是特殊的路由处理程序，所以它们也可以像其他页面和布局一样，使用路由段配置：

| **Option**                                                                                                         | **Type**                                                             | 默认值        |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ---------- |
| [dynamic](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)                 | `'auto' &#124; 'force-dynamic' &#124; 'error' &#124; 'force-static'` | `'auto'`   |
| [revalidate](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate)           | `false &#124; 'force-cache' &#124; 0 &#124; number`                  | `false`    |
| [runtime](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#runtime)                 | `'nodejs' &#124; 'edge'`                                             | `'nodejs'` |
| [preferredRegion](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#preferredregion) | `'auto' &#124; 'global' &#124; 'home' &#124; string &#124; string[]` | `'auto'`   |

使用示例如下：

```javascript
// app/icon.js
export const runtime = 'edge'
 
export default function Icon() {}
```

### 1.4. ImageResponse

关于 `ImageResponse` 构造函数，它可以帮助你使用 JSX 和 CSS 生成动态图片，这对于生成社交媒体图片（Open Graph 图像、Twitter 卡片等）非常有用，因为这些图片往往依赖于动态的内容。

`ImageResponse` 的 Type 为：

```typescript
import { ImageResponse } from 'next/og'
 
new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false
 
    // Options that will be passed to the HTTP response
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

在具体的实现上，其实用的是 Vercel 自家产品 [satori](https://github.com/vercel/satori)，这是一个支持 JSX，将 HTML 和 CSS 转为 SVG 的库，所以关于 ImageResponse 具体如何写，支持哪些 HTML 和 CSS，参考 [satori 的文档](https://github.com/vercel/satori#html-elements)即可。

还有一个 `generateImageMetadata` API ，搭配默认导出函数，可以生成多张图片，下节结束后会讲到。

## 2. opengraph-image 和 twitter-image

### 2.1. 介绍

关于 opengraph 的具体作用可以参考我写的《[VuePress 博客之 SEO 优化（四） Open Graph protocol](https://juejin.cn/post/7073416301720371213)》。

简单的来说，按照 Open Graph Protocol 这个协议描述页面信息，社交网站（如 Facebook）就会按照页面上 og 标签的内容呈现给用户。twitter-image 作用类似，只不过是用于 twitter。

使用方式有两种，一种是静态图片文件，一种是使用代码生成。

### 2.2. 静态文件

与添加图标文件一样，直接在路由文件夹下添加对应的图片即可，只不过约定的文件名和支持的格式不同：

| 文件名称                                                                                                                             | 支持的图片格式                        |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#opengraph-image)           | `.jpg`、`.jpeg`、 `.png`、 `.gif` |
| [twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-image)               | `.jpg`、`.jpeg`、`.png`、`.gif`   |
| [opengraph-image.alt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#opengraph-imagealttxt) | `.txt`                         |
| [twitter-image.alt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-imagealttxt)     | `.txt`                         |

#### 2.2.1. opengraph-image

添加一个 `opengraph-image.(jpg|jpeg|png|gif)`图片文件，对应 HTML 输出为：

```html
<meta property="og:image" content="<generated>" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
```

#### 2.2.2 twitter-image

添加一个 `twitter-image.(jpg|jpeg|png|gif)`图片文件，对应 HTML 输出为：

```html
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:type" content="<generated>" />
<meta name="twitter:image:width" content="<generated>" />
<meta name="twitter:image:height" content="<generated>" />
```

#### 2.2.3. opengraph-image.alt.txt

当使用 `opengraph-image.(jpg|jpeg|png|gif)`图片的时候，再添加一个 `opengraph-image.alt.txt`作为该图片的 alt 文字：

```html
About Acme
```

对应输出的 HTML 为：

```html
<meta property="og:image:alt" content="About Acme" />
```

#### 2.2.4. twitter-image.alt.txt

当使用 `twitter-image.(jpg|jpeg|png|gif)`图片的时候，再添加一个 `twitter-image.alt.txt`作为该图片的 alt 文字：

```html
About Acme
```

对应输出的 HTML 为：

```html
<meta property="twitter:image:alt" content="About Acme" />
```

### 2.3. 代码生成

#### 2.3.1 介绍

想必你已经知道该怎么做了：

| 文件名             | 支持的文件格式            |
| --------------- | ------------------ |
| opengraph-image | `.js`、`.ts`、`.tsx` |
| twitter-image   | `.js`、`.ts`、`.tsx` |

代码与上节的图标图片生成类似，默认导出函数、路由段配置都相同，图片元数据配置上略有差别。示例代码如下：

```javascript
// app/about/opengraph-image.js
import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  // Font
  const interSemiBold = fetch(
    new URL('./Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())
 
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

这个例子顺便演示了如何使用字体文件生成图片，对应输出的 HTML 为：

```html
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="About Acme" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

#### 2.3.2. 图片元数据配置

除了导出图片文件本身，你也可以选择性的导出 `alt`、`size`、`contentType` 变量来设置该图片的元数据：

| **Option**                                                                                                     | **Type**                                                                                                                |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [alt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#alt)                 | string                                                                                                                  |
| [size](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#size)               | { width: number; height: number }                                                                                       |
| [contentType](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#contenttype) | string (具体有哪些值，参考 [image MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types)） |

相比图标，多了一个 `alt` 变量。设置 `alt`：

```javascript
// opengraph-image.js | twitter-image.js
export const alt = 'My images alt text'
 
export default function Image() {}
```

对应 HTML 输出为：

```html
<meta property="og:image:alt" content="My images alt text" />
```

设置 `size`：

```javascript
// opengraph-image.js | twitter-image.js
export const size = { width: 1200, height: 630 }
 
export default function Image() {}
```

对应 HTML 输出为：

```html
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

设置 `contentType`：

```javascript
export const contentType = 'image/png'
 
export default function Image() {}
```

对应 HTML 输出为：

```html
<meta property="og:image:type" content="image/png" />
```

#### 2.3.3. 使用外部数据

图标的生成往往不需要使用外部数据，但是 opengraph-image 和 twitter-image 可能需要，比如当我们访问 `/posts/1`的时候，可以获取该文章的信息，然后使用文章的标题生成一张图片：

```javascript
// app/posts/[slug]/opengraph-image.js
import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image({ params }) {
  const post = await fetch(`https://.../posts/${params.slug}`).then((res) =>
    res.json()
  )
 
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

## 3. generateImageMetadata 生成多张图片

使用 `generateImageMetadata` 可以生成一张图片的不同版本或者返回多张图片。使用语法如下：

```javascript
// icon.js
export function generateImageMetadata({ params }) {
  // ...
}
```

`params` 跟本篇“默认导出函数”这节中的 `params` 用法相同，用于获取动态路由参数，就不多说了。

`generateImageMetadata` 函数应该返回一个包含图片元数据的对象数组。每一个对象必须包含一个 `id` 值:

| **Image Metadata Object** | **Type**                            |
| ------------------------- | ----------------------------------- |
| `id`                      | `string`（必传）                        |
| `alt`                     | `string`                            |
| `size`                    | `{ width: number; height: number }` |
| `contentType`             | `string`                            |

使用示例如下：

```javascript
// icon.js
import { ImageResponse } from 'next/og'
 
export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}
 
export default function Icon({ id }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {id}
      </div>
    )
  )
}
```

在这个例子中，我们生成了不同尺寸的图标图片。使用 `generateImageMetadata` 时，默认导出函数的 props 又会多一个 id 参数，可以根据 id 生成不同的图标内容。`generateImageMetadata`以数组形式定义了生成的图片数量和元数据，然后遍历该数组，将 id 参数传入默认导出函数，生成多张图片。

我们再举一个贴近实际开发的例子，假设一个产品有多张说明图，根据网址参数获取产品说明图数据，生成多张 Open Graph 图片：

```javascript
// app/products/[id]/opengraph-image.js
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app/utils/images'
 
export async function generateImageMetadata({ params }) {
  const images = await getOGImages(params.id)
 
  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}
 
export default async function Image({ params, id }) {
  const productId = params.id
  const imageId = id
  // 获取图片说明
  const text = await getCaptionForImage(productId, imageId)
 
  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```

## 4. robots.txt

### 4.1. 介绍

robots.txt 用于告诉搜索引擎可以爬取网站中的哪些 URL。使用 robots.txt 也有两种方式，一种是使用静态文件，一种是使用代码生成。

### 4.2. 静态文件

`app/` 目录下直接添加一个 `robots.txt` 即可：

```javascript
User-Agent: *
Allow: /
Disallow: /private/
Sitemap: https://acme.com/sitemap.xml
```

### 4.3. 代码生成

添加一个 `robots.js` 或 `robots.ts`文件，该文件导出一个 Robots对象。使用示例如下：

```javascript
// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

输出内容为：

```javascript
User-Agent: *
Allow: /
Disallow: /private/
Sitemap: https://acme.com/sitemap.xml
```

如果使用 TypeScript，Robots 对象的 type 为：

```typescript
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }>
  sitemap?: string | string[]
  host?: string
}
```

## 5. sitemap.xml

### 5.1. 介绍

`sitemap.xml`，顾名思义，站点地图，用于帮助搜索引擎更高效的爬取网站。使用方式依然是两种，一种使用静态文件，一种使用代码生成。

### 5.2. 静态文件
`app/sitemap.xml`：
```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### 5.3. 代码生成

添加一个 `sitemap.js`或 `sitemap.ts`文件，该文件导出一个 Sitemap 对象。使用示例如下：

```javascript
// app/sitemap.js
export default function sitemap() {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

对应的输出为：

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

如果使用 TypeScript，Sitemap 对象的 type 为：

```typescript
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}>
```

## 6. manifest.json

### 6.1. 介绍

开发 PWA 时会要求网站提供一个`manifest.json`文件设置网站的相关信息。使用方法依然是两种，一种静态文件，一种代码生成，直接看例子吧！

### 6.2. 静态文件

`app/manifest.json` | `app/manifest.webmanifest`：

```json
{
  "name": "My Next.js Application",
  "short_name": "Next.js App",
  "description": "An application built with Next.js",
  "start_url": "/"
  // ...
}
```

### 6.3. 代码生成

添加一个 `manifest.js`或 `manifest.ts`文件，该文件返回一个 Manifest 对象。使用示例如下：

```javascript
// app/manifest.js
export default function manifest() {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

Manifest 对象具体有哪些字段参考[ MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)。

## 参考链接

1.  [Optimizing: Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
2.  [Metadata Files: favicon, icon, and apple-icon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
3.  [Metadata Files: manifest.json](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
4.  [Metadata Files: opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
5.  [Metadata Files: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
6.  [Metadata Files: sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
7.  [Functions: ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response)
8.  [Functions: generateImageMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata)
