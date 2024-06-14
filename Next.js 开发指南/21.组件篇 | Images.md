## 前言
本篇开始我们进入组件篇，为大家详细介绍 Next.js 内置的四个组件，分别是：`<Image>`、`Font`、`<Link>`、`<Script>`，它们都是 Next.js 基于原生 HTML 标签做了诸多优化而专门抽象的组件，在开发的时候尽可能的使用这些组件。

其中 `<Image>` 组件实现了懒加载和根据设备尺寸自动调整图片大小，`<Link> `组件实现了后台预获取资源，从而让页面转换更快更平滑，`<Script>` 组件使得你可以控制加载和执行第三方脚本等等……具体的功能和 API 我们会在组件篇中详细介绍。

本篇将介绍 `<Image>` 组件，因为图片往往占据了网页大小很大一部分，图片的优化可谓是重中之重。`Image` 组件也提供了非常多的 prop 和配置项，了解这些 prop 以及背后的原理有助于我们更加深入的使用 `Image` 组件，带来更好的用户体验。
## 图片与 LCP
### 1. 图片占比
根据 [Web Almanac](https://almanac.httparchive.org/en/2022/media) 中的介绍，图片大小占典型网站页面大小的很大一部分。根据统计，2021 年 6 月网站的总大小中位数是 2019 KB（移动端），其中 881 KB 是图像。这比 HTML（30 KB），CSS（72 KB），JavaScript（461 KB）和字体（97 KB）的总和还要多。

在绝大多数页面上（70% 移动设备，80% 桌面），最有影响的就是图片。Largest Contentful Paint（最大内容绘制，简写：[LCP](https://web.dev/articles/lcp?hl=zh-cn)） 是一种 Web 性能指标，可以标识首屏中最大的内容元素。大部分时候，该元素都有图片。
### 2. LCP 背景
考虑到 LCP 并不算是一个常为大家熟知的概念，所以我们单独介绍下 LCP。

对于 Web 开发者而言，衡量网页主要内容的加载速度一直是一个挑战。

传统我们会使用 load、DOMContentLoaded 等方法，但它们并不表示用户在屏幕上看到的内容的时间。

而像首次内容渲染（FCP），如果页面有 loading 效果，那获取的时间也是不准确的。

当然也有首次有效绘制（FMP）等指标，但是这些指标非常复杂，往往是错误的。所以也不能用来确定主要内容的加载时间。

根据 W3C Web 性能工作组中的讨论和 Google 的研究，要衡量网页主要内容的加载时间，更为准确的方法是查看最大元素的呈现时间。这就是 LCP。
### 3. LCP 概念与标准
Largest Contentful Paint (LCP) 指标会报告视口内可见的最大图片或文本块的呈现时间（相对于网页首次开始加载的时间）。

为了提供良好的用户体验，网站应尽力将 Largest Contentful Paint 设置为 **2.5 秒**或更短。

让我们看一些  LCP 的例子：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdad5f872000436386d02af3b2b22ab6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=621&s=344333&e=png&b=faf4f4)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d45d5ac94a014e66a4b791e61e2a41dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=621&s=397379&e=png&b=fbfbfb)

那么问题来了，页面往往是分阶段加载的，网页中最大元素可能是在不断变化的，LCP 是怎么计算出来的呢？

首先，浏览器会将 LCP 的元素限定在一些特定的元素类型内，比如`<img>` 元素、包含文本节点或其他内嵌级别文本元素的子项的块级元素、为自动播放 `<video>` 元素而绘制的第一帧、动画图片格式（例如 GIF 动画）的第一帧等等（这是为了简化这个问题，如果什么元素都计算一遍大小，就太复杂了而且没必要）。

然后浏览器在绘制完第一帧后，就会立即分派 largest-contentful-paint 类型的 PerformanceEntry，用于标识最大的内容元素。在渲染后续帧后，只要最大内容元素发生变化，该 API 就会再分派另一个 PerformanceEntry。简单的来说，每一帧绘制的时候，浏览器都会标示出最大内容元素。

当用户与页面发生交互（通过点按、滚动或按键），浏览器就会停止报告新条目。（因为用户交互通常会改变向用户显示的内容，就比如滚动操作）。一般来说，发出的最后一个条目的 startTime 值是 LCP 值。
## `<Image>`
### 1. 功能特性
讲解 LCP，只是为了帮助大家认识到图片优化的重要性（毕竟最大内容元素往往是图片）。回到 `<Image>` 组件上，Next.js 基于原生的 HTML `<img>` 元素，实现了这些优化功能：

1. 尺寸优化：自动为每个设备提供正确尺寸的图片，也会使用现代图片格式如 WebP 和 AVIF。
2. 视觉稳定性：防止图片加载时发生布局偏移（Layout Shift）
3. 更快的页面加载：图片只有在进入视口的时候才会加载，使用懒加载功能，并可选使用模糊占位符
4. 灵活配置：按需进行图片调整，远程服务器上的图片也可以

这些功能我们会在讲解组件 API 的时候一一涉及。
### 2. 基础使用
这是 `<Image>` 组件的使用示例，看起来如同使用正常的 img 元素一样：

```javascript
// app/page.js
import Image from 'next/image'
 
export default function Page() {
  return (
    <Image
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
    />
  )
}
```
### 3. 支持的 props
 `<Image>` 组件支持传入这些 props：

| **Prop** | **示例** | **类型** | **是否必须** |
| --- | --- | --- | --- |
| [src](https://nextjs.org/docs/app/api-reference/components/image#src) | `src="/profile.png"` | String | 是 |
| [width](https://nextjs.org/docs/app/api-reference/components/image#width) | `width={500}` | Integer (px) | 是 |
| [height](https://nextjs.org/docs/app/api-reference/components/image#height) | `height={500}` | Integer (px) | 是 |
| [alt](https://nextjs.org/docs/app/api-reference/components/image#alt) | `alt="Picture of the author"` | String | 是 |
| [loader](https://nextjs.org/docs/app/api-reference/components/image#loader) | `loader={imageLoader}` | Function | - |
| [fill](https://nextjs.org/docs/app/api-reference/components/image#fill) | `fill={true}` | Boolean | - |
| [sizes](https://nextjs.org/docs/app/api-reference/components/image#sizes) | `sizes="(max-width: 768px) 100vw"` | String | - |
| [quality](https://nextjs.org/docs/app/api-reference/components/image#quality) | `quality={80}` | Integer (1-100) | - |
| [priority](https://nextjs.org/docs/app/api-reference/components/image#priority) | `priority={true}` | Boolean | - |
| [placeholder](https://nextjs.org/docs/app/api-reference/components/image#placeholder) | `placeholder="blur"` | String | - |
| [style](https://nextjs.org/docs/app/api-reference/components/image#style) | `style={{objectFit: "contain"}}` | Object | - |
| [onLoadingComplete](https://nextjs.org/docs/app/api-reference/components/image#onloadingcomplete) | `onLoadingComplete={img => done())}` | Function | - |
| [onLoad](https://nextjs.org/docs/app/api-reference/components/image#onload) | `onLoad={event => done())}` | Function | - |
| [onError](https://nextjs.org/docs/app/api-reference/components/image#onerror) | `onError(event => fail()}` | Function | - |
| [loading](https://nextjs.org/docs/app/api-reference/components/image#loading) | `loading="lazy"` | String | - |
| [blurDataURL](https://nextjs.org/docs/app/api-reference/components/image#blurdataurl) | `blurDataURL="data:image/jpeg..."` | String | - |

其中，`src`、`width` 、`height`  和 `alt` 是必须的，其他是可选的。让我们逐一讲解。
### 4. src-必须
src 支持传入一个静态导入图片文件，也支持传入一个路径字符串。

使用本地图片的时候，就可以采用静态导入图片文件的方式。通过 `import` 导入 `.jpg`、`.png` 或者 `.webp` 格式的文件。使用示例如下：

```javascript
// app/page.js
import Image from 'next/image'
import profilePic from './me.png'
 
export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="Picture of the author"
      // width={500} automatically provided
      // height={500} automatically provided
      // blurDataURL="data:..." automatically provided
      // placeholder="blur" // Optional blur-up while loading
    />
  )
}
```
使用静态文件导入的方式，`width` 和 `height` 不需要传入，Next.js 会自动提供。

注意：动态的 `await import()` 或者 `require() `是不支持的。`import` 必须是静态的，才可以在构建的时候进行分析。

使用远程图片的时候，src 可以传入一个 URL 字符串。

由于 Next.js 在构建的时候无法获取远程文件，你需要手动提供 `width`、`height` 和可选的 `blurDataURL` props。

`width` 和 `heigth` 属性用于推断图像正确的宽高比（Aspect ratio，也称为纵横比）以及避免图片加载的时候发生布局偏移。但 `width` 和`height`并不决定图片最终的渲染尺寸，这也很好理解，因为你也可能设置拉伸模式等。

```javascript
// app/page.js
import Image from 'next/image'
 
export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

注意使用远程地址的时候，Next.js 要求在 `next.config.js`文件中定义支持的远程图片地址，这是为了防止一些恶意使用。配置方法如下：

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
}
```

关于配置文件中的 `remotePatterns`，本篇后面我们会详细讲解。
### 5. width-必须
`width` 属性表示图片渲染的宽度，它以像素为单位，影响图片的显示大小。

该属性必须，除非是静态导入图片或者图片有 `fill` 属性。
### 6. height-必须
`height` 属性表示图片渲染的高度，它以像素为单位，影响图片的显示大小。

属性必须，除非是静态导入图片或者图片有 `fill` 属性。
### 7. alt
`alt` 属性用于描述图片，提供给屏幕阅读器和搜索引擎使用。如果图片被禁用或者加载图片时出现错误，它会作为降级的文本提示。

`alt` 属性应该使用在不改变页面含义的情况下替代图片的文本描述，不应该重复图片上方或下方标题中提供的信息。

如果图片纯粹是装饰或者不是给用户使用，那 `alt` 属性应该用一个空字符串表示（`alt=""`）。
### 8. loader
 `loader` 表示解析图片地址的自定义函数。让我们看段示例代码：

```javascript
'use client'
 
import Image from 'next/image'
 
const imageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
 
export default function Page() {
  return (
    <Image
      loader={imageLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

函数接受 `src`、`width`、`quality`作为参数，返回图片的 URL 字符串。

注意：由于 `loader` prop 传入的是一个函数，所以需要使用客户端组件，在这个例子中，顶部也是用的 `'use client'`。

每一个图片都添加一个 loader 非常麻烦，你也可以使用 `next.config.js` 中的 `loaderFile` 配置项来配置应用里的每个 `next/image` 实例，而无需传递 `loader` prop。这个配置项本篇后面会讲解。
### 9. fill
```javascript
fill={true} // {true} | {false}
```

`fill`表示是否将图片填充父元素。默认值为 `false`。当图片的 `width` 和 `height` 未知的时候很有用。

但是要注意：使用 `fill`，父元素必须指定为 `position: "relative"`或`position: "fixed"`或`position: "absolute"`。而 img 元素会默认自动指定为 `position: "absolute"`。

如果图片没有应用其他样式，图片会被拉伸以填充容器。

当然填充容器有很多方式，CSS 属性里的 `object-fit: "container"` 和 `object-fit: "cover"` 也都可以用来填充图像。

让我们简单看下区别：

```javascript
// app/page.js
import Image from 'next/image'
import profilePic from './image.png'
 
export default function Page() {
  return (
    <div style={{
      width: '200px',
      height: '200px',
      backgroundColor: "#ccc",
      position: 'relative'
    }}>
     <Image
        src={profilePic}
        alt="Picture of the author"
      />
    </div>
  )
}
```

正常显示如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea029d04ff6748d297390b2d5a4fbcc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=856&h=642&s=500317&e=png&b=2d2a27)
     
如果添加 fill 属性后：

```javascript
<Image
  src={profilePic}
  alt="Picture of the author"
  fill={true}
/>
```

效果如下，图片会被拉伸以适应容器：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23133468308c414d8b153bd6689a8495~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=578&h=538&s=265329&e=png&b=302d2b)

如果使用 `object-fit: "contain"`：

```javascript
<Image
  src={profilePic}
  alt="Picture of the author"
  fill={true}
  style={{objectFit: "contain"}}
/>
```

效果如下，图片在保持其宽高比的同时填充元素的整个内容框：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b375639f2e14d59923b2cd89440bd6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=562&h=518&s=174623&e=png&b=ebebeb)
如果使用 `object-fit: "cover"`：

```javascript
<Image
  src={profilePic}
  alt="Picture of the author"
  fill={true}
  style={{objectFit: "cover"}}
/>
```

效果如下，图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e02b46bc02941b6b9cf78e584e0578e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=624&h=532&s=232733&e=png&b=282523)
     
### 10. sizes
HTML 5.1 新增加了 img 元素的 `srcset`、`sizes` 属性，用于设置响应式图像。

当我们需要不同的设备展示不同的图片的时候，就需要用到 `srcset`。这里具体又分为两种情况，一种是图片是相同的尺寸，但是不同的分辨率对应不同的图片，即高分辨率下对应高倍图。一种是相同的图片内容，但依据设备显示的更大或者更小。这分别对应着 srcset 的两种语法。

先说第一种，根据分辨率不同展示不同的图片，使用示例如下：

```javascript
<img
  srcset="elva-fairy-320w.jpg, elva-fairy-480w.jpg 1.5x, elva-fairy-640w.jpg 2x"
  src="elva-fairy-640w.jpg"
  alt="Elva dressed as a fairy" />
```
效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a316177c7f664b9ab520736e62d054d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=480&h=425&s=130728&e=png&a=1&b=f4f1f0)

srcset 是由逗号分隔的一个或多个字符串组成，每段字符串由以下组成：

1. 指向图像的 URL
2. 一个空格（可选）
3. 一个像素密度描述符（一个正浮点数，后面紧跟 x 符号）

如果我们给图片应用一个 CSS 样式：

```css
img {
  width: 320px;
}
```

它的宽度在屏幕上就是 320 像素（CSS 像素）。浏览器会计算出正在显示的显示器的分辨率，然后显示 srcset 引用的最适合的图片。如果是普通的分辨率，一个设备像素表示一个 CSS 像素，那就会加载 `elva-fairy-320w.jpg`，它的大小是 39KB，如果设备是高像素，用两个或者更多的设备像素表示一个 CSS 像素，那就会加载 `elva-fairy-640w.jpg`，它的大小是 93KB。

再说第二种情况，相同的图片内容，但依据设备显示的更大或者更小。使用示例代码如下：

```javascript
<img
  srcset="elva-fairy-small.jpg 480w, elva-fairy-large.jpg 800w"
  src="elva-fairy-large.jpg"
  alt="Elva dressed as a fairy" />
```

srcset 的语法与刚才略有不同，它定义了浏览器可选择的图片设置以及每个图片的大小。分析它的语法，依然是由逗号分隔的一个或多个字符串组成，每段字符串由以下部分组成：

1. 指向图像的 URL
2. 一个空格
3. 图片的固有宽度（以像素为单位）。注意，这里使用宽度描述符 w，而非 px。但一个 w 对应 1 个像素。图片的固有宽度是指它的真实大小。

此时我们就告诉了浏览器，这张图片有两种备选图片可以显示，一张是 `elva-fairy-small.jpg`，这张图片的宽度是 480px，一张是 `elva-fairy-large.jpg`，它的宽度是 800px。

那浏览器怎么知道用哪张图片呢？比如当前设备视口宽度是 640px，是选择 480px 的图片还是选择 800px 的图片呢？

为了帮助浏览器判断，你就需要写 sizes 属性。sizes 属性就是一组媒体查询条件，告诉浏览器，什么样的条件使用什么样的图片。一个使用示例如下：

```javascript
<img
  srcset="elva-fairy-small.jpg 480w, elva-fairy-large.jpg 800w"
  sizes="(max-width: 600px) 480px,
         800px"
  src="elva-fairy-large.jpg"
  alt="Elva dressed as a fairy" />
```

sizes 也是由逗号分隔的一个或多个字符串组成，每段字符串由以下组成：

1. 一个媒体条件，例子中为 `(max-width:600px)`，它表示当视口的宽度小于等于 600px 时
2. 一个空格
3. 当媒体条件为真时，图片将填充的宽度，这个宽度可以是固定值，比如这个例子中的 480px，也可以是一个相对于视口的宽度（如 50vw），但不能是百分比。如果没有媒体条件，表示是默认生效。当浏览器成功匹配第一个媒体条件的时候，剩下所有的条件都会被忽略。所以顺序很重要。

有了这些属性后，浏览器会：

1. 检查设备宽度
2. 检查 sizes 列表中哪个媒体条件是第一个为真
3. 查看给予该媒体查询的槽大小
4. 加载 srcset 列表中引用的最接近所选的槽大小的图像

比如在这个例子中，如果浏览器的视口是 480px，那么 sizes 中的第一个条件 (max-width: 600px) 就为真，所以选择 480px 大小，因为 480px 与固有宽度 480w 最接近，所以加载 elva-fairy-small.jpg。通过这种方式就可以实现移动端加载小图片，从而加快移动端的加载速度。

讲完 img 元素的 `srcset` 和 `sizes` 属性，回到 `<Image>` 组件上，使用 Next.js，你并不需要设置 `srcset`，Next.js 会自动为你生成。设置 sizes 属性会影响生成的 `srcset` 的值。

如果你不设置组件的 sizes 属性，Next.js 会用 1x、2x 这种像素密度描述符，而如果你设置了 sizes 属性，Next.js 会用 640w、750w 这种固有宽度描述符。

设置前：
     
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ca8290c0b4849e6a4c936c1398140c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=124&s=69379&e=png&b=282828)
     
设置后：
     
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/031333cd47564ad399e819642ae912f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1178&h=436&s=253485&e=png&b=282828)
### 11. quality
表示优化图片的质量，值为 1 到 100 之间的整数，100 表示最好的品质，也是最大的文件大小。默认是 75。

```javascript
quality={75} // {number 1-100}
```
### 12. priority
表示图片加载优先级，布尔类型，默认值为 false。当值为 true 时表示高优先级并预加载。使用 `priority` 的图片会自动禁用懒加载。

```javascript
priority={false} // {false} | {true}
```

使用该属性有两个建议：

1. 在首屏可见的图片上使用
2. 在 LCP 图片元素上使用，考虑到不同的视口宽度可能有不同的 LCP 图片，可以设置多个

运行 `next dev` 的时候，如果 LCP 元素是一个图片，但没有设置 priority 属性，控制台里会有警告：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5a914226438476ca76d26e481b6a6c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1398&h=104&s=54212&e=png&b=3f3a2e)

使用示例代码：

```javascript
// app/page.js
import Image from 'next/image'
import profilePic from '../public/me.png'
 
export default function Page() {
  return <Image src={profilePic} alt="Picture of the author" priority />
}
```
### 13. placeholder
表示加载图片时的占位符。可选值为 `blur`、`empty`、 `data:image/... `，默认值是 `empty`。

```javascript
placeholder = 'empty' // "empty" | "blur" | "data:image/..."
```

当值为 `empty` 的时候，加载不会有占位符，只有空白区域。

当值为 `data:image/...`的时候，使用 [Data URL](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) 作为图片加载时的占位图片。Data URL，即前缀为 `data:` 协议的 URL，允许内容创建者向文档中嵌入小文件。比如  base64 图片就是 Data URL。

当值为`blur`的时候，`blurDataURL`属性的值会被用于作为占位符图片。如果图片是静态导入的，并且导入的图片为 `.jpg`、`.png`、`.webp`或 `.avif` ，blurDataURL 会自动生成，但动态图片除外。如果是动态图片，必须提供 `blurDataURL`属性。

这是一个默认的 [blur 效果演示](https://image-component.nextjs.gallery/placeholder)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74b6fe2095ec48e8ba8748518f50ee4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=803&h=575&s=123548&e=gif&f=6&b=66868d)
### 14. blurDataURL
只有当你设置了 `placeholder="blur"`，该属性值才会生效。

必须是 base64 编码的图片。图片会被放大并模糊，建议使用一个非常小的图片（10px 或者更小）。

可以借助 blurDataURI 实现这种[色彩效果](https://image-component.nextjs.gallery/placeholder)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aa039c8c7034d3b9a38a67de8c28126~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=750&h=1020&s=326943&e=gif&f=8&b=e4b23f)

可以借助 [https://png-pixel.com/](https://png-pixel.com/) 快速获得一个纯色图片的 Data URL。
### 15. style
设置图片的样式

```javascript
// components/ProfileImage.js
const imageStyle = {
  borderRadius: '50%',
  border: '1px solid #fff',
}
 
export default function ProfileImage() {
  return <Image src="..." style={imageStyle} />
}
```

当你使用 style 修改了图片宽度的时候，注意设置 `height` 为 `auto` 以保持宽高比，否则图片会被扭曲。这是因为 Next.js 会自动为图片添加 `width` 和 `height` 属性，通过 style 样式只修改宽度，加上原本添加的 `height` 属性，就会导致图片变形。
### 16. onLoadingComplete
```javascript
'use client'
 
<Image onLoadingComplete={(img) => console.log(img.naturalWidth)} />
```

当图片加载完毕的时候，会执行该回调函数，同时占位符图片会被删除。回调函数调用的时候会传入一个参数，该参数是对底层 <img> 元素的引用。

注意：因为组件接收一个函数作为参数，需要使用客户端组件。
### 17. onLoad
```javascript
'use client'
  
<Image onLoad={(e) => console.log(e.target.naturalWidth)} />
```

同样是图片加载完的时候执行，该回调函数可能会在占位符被删除以及图片被完全解码前执行。所以如果你想等到图片完全加载完毕，使用 onLoadingComplete。

注意：因为组件接收一个函数作为参数，需要使用客户端组件。
### 18. onError
```javascript
'use client'
  
<Image onError={(e) => console.error(e.target.id)} />
```

图片加载失败时执行的回调函数。

注意：因为组件接收一个函数作为参数，需要使用客户端组件。
### 19. loading
```javascript
loading = 'lazy' // {lazy} | {eager}
```

设置图片的加载行为，默认值为 `lazy`。

当值为 `lazy` 的时候，图片会延迟加载，直到图片接近视口。

当值为 `eager` 的时候，图片会被立即加载。

使用 `eager` 通常会损害性能。Next.js 推荐使用 `priority` 属性代替。
### 20. unoptimized

取消优化。当值为 `true` 的时候，使用源图片，不会更改质量、大小、格式。默认值是 `false`。示例如下：

```javascript
import Image from 'next/image'
 
const UnoptimizedImage = (props) => {
  return <Image {...props} unoptimized />
}
```

从 Next.js 12.3.0 起，可以通过 `next.config.js` 设置所有的图片取消优化：

```javascript
// next.config.js
module.exports = {
  images: {
    unoptimized: true,
  },
}
```
### 21. 其他 props
其他传给 `<Image />` 组件的属性都会传给底层的 img 元素。但以下属性除外：

1. `srcSet`，Next.js 会自动生成，如果你想更改，使用配置项里的 deviceSizes，下一节会讲到。
2. `decoding`，它的值总是 `"async"`
## 配置选项
除了通过 props，你也可以在 `next.config.js` 中配置图片组件。
### 1. remotePatterns

为保护应用远离恶意用户，当使用外部图片的时候需要配置 `remotePatterns`：

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
  },
}
```

这个示例的意思是，`next/image` 的 `src` 属性的值必须是以 `https://example.com/account123/` 为开头。其他的协议、主机名、端口或者不匹配的路径都会返回 400 错误。

这是另外一个例子，在此例子中使用了通配符：

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
}
```

这个示例的意思是，`next/image` 的 `src` 属性的值必须是以 `https://xxx.example.com`、`https://xxx.xxx.example.com`、`https://xxx.xxx.xxx.example.com`……开头。

`pathname` 和 `hostname` 都可以使用通配符，其中：

1. `*` 表示匹配单个路由段或者子域
2. `**` 表示匹配任意数量的路由段或者子域。

注意 `**` 语法在模式的中间是不起作用的。
### 2. domains

自 Next.js 14 起因为使用了更为严格的 `remotePatterns` 而废弃。仅当所有的内容都来自你所能控制的域的时候你再使用。

与 `remotePatterns` 类似，`domains` 配置项提供了一个用于外部图片的 hostname 列表：

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['assets.acme.com'],
  },
}
```

但是注意 `domains` 不支持通配符，并且无法限制协议、端口或者路径名。所以更建议使用 `remotePatterns`。
### 3. loaderFile
如果你不希望使用 Next.js 内置的图片优化 API，那你可以自己配置，使用 `next.config.js` 的 `loaderFile` 配置项：

```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

`loaderFile` 必须指向相对于 Next.js 应用根目录的文件。该文件必须导出一个默认函数，该函数返回一个字符串。举个例子：

```javascript
'use client'
 
export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

这会应用到所有的 `next/image` 的实例，如果你要修改个别图片，使用 `loader` prop。
### 4. deviceSizes
如果你知道用户的设备宽度，那你可以使用 `next.config.js`的 `deviceSizes`来声明一系列的设备宽度断点。当 `next/image` 组件使用 `sizes` prop 的时候，这些宽度会被用来推断正确加载的图片。

如果没有配置，默认值是：

```javascript
// next.config.js
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```
### 5. imageSizes
你可以使用 `next.config.js` 的 `imageSize` 属性声明一系列的图片宽度。

如果没有配置，默认值是：

```javascript
// next.config.js
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

`imageSize` 和 `deviceSizes` 会影响图片生成最终的 `srcset` 尺寸：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/186de6c29889461b9d4e2a0b6697481b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1178&h=436&s=253485&e=png&b=282828)

那么问题来了，都是用来生成最终的 `srcset`，直接用一个数组不就好了吗？为什么非要用两个数组？

你可以这样理解，`deviceSizes` 用来处理大图片，`imageSizes` 用来处理小图片，而且 `imageSizes` 只会在图片使用了 `sizes` prop 的时候生效，比如当你这样写：

```javascript
import Image from 'next/image'
import profilePic from './image.png'
 
export default function Page() {
  return (
    <Image
      src={profilePic}
      sizes="(max-width: 600px) 160px,
      320px"
      alt="Picture of the author"
    />
  )
}
```

对应生成的 `srcset` 就包含了deviceSizes 和 imageSizes 的所有尺寸：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e64c0676e9f4c7ab906f3cdf31fab8f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=606&s=333340&e=png&b=282828)

当你使用了 `sizes` prop 的时候，说明图片的宽度是小于全屏宽度的。`imagesSizes` 的中的所有值应该都小于 `deviceSizes` 中的最小值。
### 6. formats
Next.js 默认的图片优化 API 会自动通过请求中的 Accept 请求头检测浏览器支持的图片格式。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1a458a9d4fb4ae6a2bb54db2ecd4766~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=146&s=29237&e=png&b=292929)

如果 `Accept` 匹配多个配置的格式，数组中的第一个会被首先使用。因此，数组的顺序很重要，如果没有匹配到，或者源图片为动图，图片优化 API 会自动回退到原本的图片格式。

如果没有配置，默认值是：

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp'],
  },
}
```

你可以使用下面的配置开启 AVIF 格式支持：

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```
### 7. minimumCacheTTL
图片会根据请求动态优化并存储在 `<distDir>/cache/images`目录。优化后的图像文件会被用于后续请求，直到缓存过期。当匹配到过期的文件时，过期图片会立刻失效，同时图片会在后台重新优化并使用新的失效日期储存在缓存中。

通过读取响应头中的 `x-nextjs-cache`标头确定图片的缓存状态：

- `MISS`：路径不在缓存中
- `STALE` ：路径缓存了但是超出了重新验证时间，它会在后台被更新
- `HIT` ：路径在缓存中，且未超过重新验证时间

过期时间可以通过两种方式定义：

一种是通过 `minimumCacheTTL`配置项，一种通过 `Cache-Control`标头，具体而言，使用`Cache-Control`标头的 `max-age` 字段。如果 `s-maxage`和 `max-age`都有，`s-maxage`优先。

两种方法如果同时设置，以较大者为准。

`minimumCacheTTL` 配置项用来设置缓存优化图片的过期时间，它以秒为单位。使用示例如下：

```javascript
// next.config.js
module.exports = {
  images: {
    minimumCacheTTL: 60,
  },
}
```

如果你需要更改每张图片的缓存行为，你可以通过 [headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers) 配置图片资源的 `Cache-Control`标头。

大部分时候，建议使用静态图片导入，它会自动对文件内容进行哈希处理，并使用 `immutable` 的 `Cache-Control` 标头。

目前还没有重新验证缓存的机制，所以最好将 `minimumCacheTTL` 的值设低一点、否则你可能需要手动修改 `src` prop 或者删除 `<distDir>/cache/images`以更新缓存。
### 8. disableStaticImages
如果图片静态导入功能跟其他插件发生冲突，你希望禁用此功能：

```javascript
// next.config.js 
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```
### 9. dangerouslyAllowSVG
默认 loader 不会优化 SVG 图片。首先，SVG 是一种矢量格式，这意味着它可以无损地调整大小。其次，SVG 具有许多与 HTML/CSS 相同的功能，如果没有适当的内容安全策略，这些功能可能会导致漏洞。

如果你需要使用默认的图像优化 API 来提供 SVG 图像，设置 `next.config.js`的 `dangerouslyAllowSVG`值：

```javascript
// next.config.js
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

Next.js 强烈推荐设置 `contentDispositionType` 强制浏览器下载图片，以及 `contentSecurityPolicy`阻止执行图片中嵌入的脚本。
## 动画图像
默认 loader 将自动跳过动态图片的优化并按原样展示。

Next.js 会自动检测动态图片，支持 GIF、APNG 和 WebP 格式。对于特定的动态图片，如果你想显式声明跳过，使用 `unoptimized` 属性（这样就省得 Next.js 检测判断了）。
## 响应式图片
图片默认生成的 `srcset` 包括 `1x`、`2x` 图片，这是为了支持不同的设备像素比。不过有的时候，你希望渲染响应式图片，自动适配视口，这个时候，你就需要设置 `sizes` 以及 `style`（或者 `className`）。下面这些方式都可以用来渲染响应式图片：
### 1. 使用静态导入的响应式图片
如果源图片不是动态的，你可以通过静态导入创建一个响应式图片：
```javascript
// components/author.js
import Image from 'next/image'
import me from '../photos/me.jpg'
 
export default function Author() {
  return (
    <Image
      src={me}
      alt="Picture of the author"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  )
}
```
### 2. 保持宽高比的响应式图片
如果源图片是动态或者远程 URL，你需要提供 `width` 和 `height` 来设置正确的响应式图片宽高比。

```javascript
// components/page.js
import Image from 'next/image'
 
export default function Page({ photoUrl }) {
  return (
    <Image
      src={photoUrl}
      alt="Picture of the author"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
      width={500}
      height={300}
    />
  )
}
```
### 3. 使用 fill 属性的响应式图片
如果你不知道图片宽高比，那可以考虑使用 `fill` 属性，注意设置父元素为 `postion:relative` 当然不用这种方式。也可以使用 `object-fit` ，具体看你想要什么样的效果：

```javascript
// app/page.js
import Image from 'next/image'
 
export default function Page({ photoUrl }) {
  return (
    <div style={{ position: 'relative', width: '500px', height: '300px' }}>
      <Image
        src={photoUrl}
        alt="Picture of the author"
        sizes="500px"
        fill
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
```
### 4. 搭配 grid 实现
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6e595921c0a46468e0ad8f18decc19f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=592&s=256302&e=png&b=1a1a1a)
```javascript
import Image from 'next/image'
import mountains from '../public/mountains.jpg'
 
export default function Fill() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, auto))',
      }}
    >
      <div style={{ position: 'relative', height: '400px' }}>
        <Image
          alt="Mountains"
          src={mountains}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: 'cover', // cover, contain, none
          }}
        />
      </div>
      {/* And more images in the grid... */}
    </div>
  )
}
```
## 主题判断
如果你希望实现浅色和深色模式下显示不同的图片，你可以创建一个新组件包含两个 `<Image>` 组件，然后通过 CSS 媒体查询显示正确的那一个：

```css
// omponents/theme-image.module.css
.imgDark {
  display: none;
}
 
@media (prefers-color-scheme: dark) {
  .imgLight {
    display: none;
  }
  .imgDark {
    display: unset;
  }
}
```

```javascript
// components/theme-image.tsx
import styles from './theme-image.module.css'
import Image from 'next/image'
 
const ThemeImage = (props) => {
  const { srcLight, srcDark, ...rest } = props
 
  return (
    <>
      <Image {...rest} src={srcLight} className={styles.imgLight} />
      <Image {...rest} src={srcDark} className={styles.imgDark} />
    </>
  )
}
```
## 累计布局偏移
在使用 Next.js 图片组件的时候，你会发现，Next.js 要求必须有 width 和 height 属性，哪怕使用静态导入图片的方式，也只是不用自己手写这两个属性而已，Next.js 依然会为你自动添加 width 和 height，之所以这样做，就是为了防止发生布局偏移。所谓布局偏移，顾名思义，原本内容的位置突然发生偏移，多出现在加载的时候。导致布局偏移的原因有很多，图片没有尺寸是常见的一个原因，让我们看个演示视频：


![10TEOBGBqZm1SEXE7KiC.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84c33fdc9221466284dc5507a3573638~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1080&s=578501&e=gif&f=238&b=fdfcff)
    
这就是没有设置图片尺寸导致的布局偏移，如果设置尺寸呢：


![38UiHViz44OWqlKFe1VC.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37363353c8254f8c8f85010e5d9e9211~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1080&s=782430&e=gif&f=187&b=fdfcff)

你会发现图片在加载的时候，浏览器为图片预留了位置。

不要小瞧布局偏移，为此专门有累计布局偏移（Cumulative Layout Shift，简称 CLS）这个 Web 性能衡量指标。这可是 Google 三大[核心网页指标](https://web.dev/articles/vitals?hl=zh-cn#core_web_vitals)之一。累计布局偏移会统计视口中可见内容的移动量以及移动的距离，综合算出一个得分。

`next/image` 的设计就是为了防止发生布局偏移，所以如果要调整图片大小，应该使用下面三种方式之一：

1. 自动静态导入
2. 显示声明 `width` 和 `height` 属性
3. 隐式声明，通过使用 fill 让图片填充父元素
## 参考链接

1. [https://www.youtube.com/watch?v=IU_qq_c_lKA&feature=youtu.be](https://www.youtube.com/watch?v=IU_qq_c_lKA&feature=youtu.be)
2. [https://web.dev/articles/lcp?hl=zh-cn](https://web.dev/articles/lcp?hl=zh-cn)
3. [Media | 2022 | The Web Almanac by HTTP Archive](https://almanac.httparchive.org/en/2022/media)
4. [How to use the Next.js Image Component Effectively](https://www.zachgollwitzer.com/posts/nextjs-image-component-tutorial#option-3-probe-your-remote-images-for-their-size)
5. [https://web.dev/articles/optimize-cls#images-without-dimensions](https://web.dev/articles/optimize-cls#images-without-dimensions)
6. [Optimizing: Images](https://nextjs.org/docs/app/building-your-application/optimizing/images#image-sizing)
7. [Components: <Image>](https://nextjs.org/docs/app/api-reference/components/image#minimumcachettl)
