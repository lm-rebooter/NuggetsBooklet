## 前言

Next.js 内置了 `next/font` 组件，相比于传统使用字体的方式，使用 font 组件会更加灵活便捷。font 组件的使用主要分为两块，一块是 Google 字体，一块是本地字体，都是通过 font 组件实现，但具体配置上会略有不同。

本篇我们会先从传统使用字体的方式开始讲起，然后讲解 font 组件带来的便利和优化，最后深入细节，讲解 font 函数的具体参数，这些细节在学习的时候只用大致了解即可，在实际项目开发的时候可再具体了解。

## 1. 传统使用字体

我们先讲讲传统使用字体的方式。

最基本的方法是通过 `@font-face`指定一个自定义字体，字体文件可以来自远程文件，也可以来自本地文件。然后在 `font-family` 中使用该字体。

```css
// global.css
@font-face {
  font-family: "Bitstream Vera Serif Bold";
  src: url("https://mdn.github.io/css-examples/web-fonts/VeraSeBd.ttf");
}

body {
  font-family: "Bitstream Vera Serif Bold", serif;
}
```

借助 [Google Fonts](https://fonts.google.com/) 这样的字体网站，我们可以快速生成样式文件，再通过 `link` 标签或者 `@import` 的方式直接使用。

使用 `link` 标签：

```javascript
// layout.js
export default function Layout({ children }) {
  return (
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

```css
// globals.css
body {
  font-family: "Ma Shan Zheng", serif;
}
```

使用 `@import`：

```css
// globals.css
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');

body {
  font-family: "Ma Shan Zheng", serif;
}
```

字体效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c75a6d322de417c80e027ce0b10b7ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=474\&h=128\&s=13330\&e=png\&b=000000)

## 2. next/font 与布局偏移

Next.js 内置了 `next/font` 组件，帮助你更好的管理和使用字体。`next/font`会自动优化字体（包括自定义字体），就比如借助 CSS 的 `size-adjust` 属性实现零布局偏移。

布局偏移我们在 Image 组件篇讲过，除了图片不设置宽高导致布局偏移，网页字体加载的时候也容易出现布局偏移，就比如：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72115f0d28574811bd7a2ecbc4f9f0b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1818\&h=626\&s=867578\&e=png\&b=d7dffb)

三行文字的 `font-size`都是 64px，唯一区别就是字体不同，但观察图片左侧三行文字的高度，你会发现虽然 font-size 设置的都是 64px，但实际对应的高度并不一定是 64px。这种时候，就可以借助 CSS 的 [size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust) 调整大小，保证最终都是 64px 大小。Next.js 自动做了这个优化。

除了防止布局偏移，`next/font` 还可以帮助你快捷使用 Google 字体，而且 CSS 和字体文件会在构建的时候下载，和其他静态资源一样被保存，浏览器也不会向 Google 发送任何请求，保证了性能和隐私性。更多功能我们会在本篇详细讲解。

`next/font` 具体又分为 `next/font/google` 和 `next/font/local`，分别对应使用 Google 字体和使用本地字体。我们逐一讲解。

## 3. next/font/google

### 3.1. 使用示例

借助 `next/font/google`，我们不需要像以前一样到 Google Fonts 复制样式文件的链接，并通过 link 或者 import 导入，而是可以直接导入想要使用的字体。使用示例如下：

```javascript
// app/layout.js
// 1. 导入想要使用的字体
import { Inter } from 'next/font/google'

// 2. 实例化字体对象，设置使用子集等
const inter = Inter({
  subsets: ['latin']
})

//  3. 应用，inter.className 会返回一个只读的 CSS 类名用于加载字体
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

最终实现的代码为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a21325f8edb24dd5b891f2fcd5207b00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1624\&h=474\&s=211319\&e=png\&b=2a2a2a)

Next.js 推荐使用[可变字体](https://fonts.google.com/variablefonts)来获得最佳的性能和灵活性。如果不能使用可变字体，你需要声明 weight（字重，是指字体的粗细程度）:

```javascript
// app/layout.js
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin']
})
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 3.2. 可变字体

那什么是可变字体呢？所谓可变字体，引用维基百科的介绍：

> OpenType 可变字体（英语：OpenType variable fonts）是字体格式 OpenType 在 1.8 版规范中引入的扩展规范，由苹果、微软、谷歌和 Adobe 联合开发，于 2016 年 9 月 14日 正式发布。支持这一规范的计算机字体可以储存轮廓变化数据，在初始字形轮廓的基础上自动生成丰富的变化造型，使用户可以自由调整文字的外观。

简单的来说，可变字体可以自由调整字宽、字重、倾斜等，从而实现一款字体展示出多款字体的效果。Next.js 推荐使用可变字体。

你也可以使用数组指定多个 weight、样式：

```javascript
// app/layout.js
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
```

如果字体是多单词，使用下划线（`_`）连接，比如 Roboto Mono，导入的时候写成 `Roboto_Mono`：

```javascript
// app/layout.js
import { Ma_Shan_Zheng } from 'next/font/google'

const font = Ma_Shan_Zheng({
  subsets: ['latin'],
  weight: '400'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={font.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 3.3. 指定子集

谷歌的字体是可以指定子集（[subset](https://fonts.google.com/knowledge/glossary/subsetting)）的，就比如 [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono?hl=zh-cn) 支持拉丁文、西里尔文和希腊文等，我们没有必要都用到，就可以使用 `subsets` 属性指定某个子集，还可以减少字体文件的大小并改善性能。

这些子集默认会被预加载（通过 `preload` 属性控制，本篇后续会讲到），如果 `preload` 为 `true`，但不指定子集会有警告。有些字体只有一个默认子集，比如 `latin`，也需要手动制定。

> 拉丁字母，又称罗马字母，指的是一套以古罗马字母为基础改造而来的成熟字母体系，最初在意大利半岛和西欧流通，在 19 世纪时扩散为全世界最通行的字母，亦是世界使用人数最多的字母，是现代绝大多数欧美国家的唯一标准字体。拉丁字母就是我们写的 26 个字母。所以很多字体的子集都有 latin。

```javascript
// app/layout.js
const inter = Inter({ subsets: ['latin'] })
```

那怎么知道一个字体有哪些子集呢？你随便指定一个子集，如果不是有效的，Next.js 会提示你有哪些可用子集：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dca481be0e7249d48580d61367886e12~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884\&h=716\&s=87290\&e=png\&b=202022)

## 4. next/font/local

使用本地字体，通过 `next/font/local`并使用 `src`声明本地文件的地址。Next.js 依然推荐使用可变字体。使用示例如下：

```javascript
// app/layout.js
import localFont from 'next/font/local'
 
const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

`src` 也可以是数组形式，比如一个字体使用多个本地文件：

```javascript
onst roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```

## 5. Font 函数参数

了解了 `next/font` 的两种主要用法后，我们来详细的介绍下 Font 函数参数：

```javascript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  // 到底还有哪些参数呢？
})
```

`next/font/google` 和 `next/font/local`略有不同，这是比较表：

| **Key**                                                                                            | **font/google** | **font/local** | **类型**                     | **必传** |
| -------------------------------------------------------------------------------------------------- | --------------- | -------------- | -------------------------- | ------ |
| [src](https://nextjs.org/docs/app/api-reference/components/font#src)                               | ❌               | ✅              | String or Array of Objects | 是      |
| [weight](https://nextjs.org/docs/app/api-reference/components/font#weight)                         | ✅               | ✅              | String or Array            | 看情况    |
| [style](https://nextjs.org/docs/app/api-reference/components/font#style)                           | ✅               | ✅              | String or Array            | -      |
| [subsets](https://nextjs.org/docs/app/api-reference/components/font#subsets)                       | ✅               | ❌              | Array of Strings           | -      |
| [axes](https://nextjs.org/docs/app/api-reference/components/font#axes)                             | ✅               | ❌              | Array of Strings           | -      |
| [display](https://nextjs.org/docs/app/api-reference/components/font#display)                       | ✅               | ✅              | String                     | -      |
| [preload](https://nextjs.org/docs/app/api-reference/components/font#preload)                       | ✅               | ✅              | Boolean                    | -      |
| [fallback](https://nextjs.org/docs/app/api-reference/components/font#fallback)                     | ✅               | ✅              | Array of Strings           | -      |
| [adjustFontFallback](https://nextjs.org/docs/app/api-reference/components/font#adjustfontfallback) | ✅               | ✅              | Boolean or String          | -      |
| [variable](https://nextjs.org/docs/app/api-reference/components/font#variable)                     | ✅               | ✅              | String                     | -      |
| [declarations](https://nextjs.org/docs/app/api-reference/components/font#declarations)             | ❌               | ✅              | Array of Objects           | -      |

### 5.1. src 参数

在 `next/font/local`中必传，可以是字符串，也可以是对象数组（类型为：`Array<{path: string, weight?: string, style?: string}>`），路径地址相当于字体加载函数调用的位置。

比如 `app/page.js`中使用 `src:'./fonts/my-font.woff2'`调用字体加载函数，`my-font.woff2`就放置在 `app/fonts/`下。

### 5.2. weight

字重，概念参考 [font-weight](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-weight)。如果是可变字体，则非必传，如果不是可变字体，则必传。

值可以是字符串，如 `weight: '400'`、`weight: '100 900'`（可变字体，从 100 到 900 之间的范围），也可以是字符串数组，如 `weight: ['100','400','900']`(不可变字体的 3 个可能值)。

### 5.3. style

概念参考 [font-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style)，默认值为 `normal`，其他值还有 `italic`、`oblique`等，参考 [font-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style#values)。如果使用 `next/font/google` 的非可变字体，也可以传入一组样式值，如 `style: ['italic','normal']`。

### 5.4. subsets

子集的概念上节已经介绍过，就不多说了。

### 5.5. axes

axes（axis 的复数形式，中文翻译：轴），与 `subsets`一样，只用于 `next/font/google`中。前面我们讲到可变字体可以自由调整字宽、字重、倾斜等，从而实现一款字体展示出多款字体的效果。字宽、字重、倾斜等就是一种“变形轴"，我们以 [Inter 字体](https://fonts.google.com/variablefonts?vfquery=inter#font-families)为例，可以看到到 Inter 字体里不止一个变型轴：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d57e292b7e784a3898372187e65c6344~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1850\&h=348\&s=41509\&e=png\&b=202124)

Axes 一共有两个，`slnt` 和 `wght` 。`slnt` 是 `slant` 的意思，`wght` 是 `weight` 的意思。如果我们将这个字体下载下来然后上传到 <https://wakamaifondue.com/>  这个网站解析，我们就可以在线看到不同轴数值的调整带来的不同效果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4adf669757034318acea7478d005a5c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2548\&h=486\&s=115801\&e=png\&b=f7f7f7)

“`wght` 我懂了，是字重，对应的 CSS 属性是 `font-weight`，那 `slnt` 呢？”

我们通常写 [font-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style#values) CSS 属性的时候，它的值默认是 `normal`，除了 `normal`，常用的就是 `italic` 和 `oblique`了，`italic` 表示斜体，`oblique` 表示倾斜体。查看 [CSS3 font-style 规范](https://www.w3.org/TR/css-fonts-3/#font-style-prop)，可以得知 italic 和 oblique 都是字体的不同样式，italic 的设计初衷是斜体样式，oblique 是保持原本直立结构的斜体，我们看个例子：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84fbde7bc324571a91931c9c6622a3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920\&h=770\&s=95963\&e=png\&b=202124)

我们以字体 `f` 为例的话，italic 的斜体更为“花哨”一点，这不是计算机能够模拟出来的，是需要作者单独设计的，而 `oblique` 则是在原本直立结构上让其倾斜，这个计算机可以模拟出来。

而在具体 font-style 使用的时候，如果选择 italic，没有对应的可用斜体版本，会选用倾斜体（oblique）替代。如果选择 `oblique`，如果没有对应的可用倾斜体版本，会选用斜体（italic）替代。如果都没有，计算机会模拟出一个倾斜体，你可以称之为仿 oblique。

回到 `oblique`，`slnt` 就是在 `oblique` 样式中控制倾斜程度的轴，所以你拖动 `slnt` 这个轴，字体会在不断的倾斜程度中变化。以后可能还会遇到其他轴，这是一个对应表：

| **轴**      | **名称**        | **对应 CSS**                                                                             |
| ---------- | ------------- | ------------------------------------------------------------------------------------------- |
| wght       | Weight        | [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)                 |
| wdth       | Width         | [font-stretch](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-stretch)               |
| ital, slnt | Italic, Slant | [font-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style)                   |
| opsz       | Optical Size  | [font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing) |

axes 是一个字符串数组形式，比如 `axes: ['slnt']`，你可以在[Google 可变字体页面](https://fonts.google.com/variablefonts#font-families)查询字体的 Axes 有哪些。之所以需要声明，是因为默认情况下，只有 weight 轴会被留下以减少字体文件大小，如果需要其他的轴就需要单独声明。

### 5.6 display

概念参考 [font-display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face/font-display)。默认我们加载字体的时候，使用该字体的地方会先显示空白，然后直到字体下载完成之后才会显示。CSS font-display 控制的就是这个过程。CSS font-display 的值有 `'auto'`、`'block'`, `'swap'`、`'fallback'`、 `'optional'`，与 `next/font` 组件的 display 的值一样。介绍下这些值加载效果的不同：

1.  **auto**：使用浏览器的预设值，一般是 block
2.  **block**：先显示空白（3s），然后切换为备用字体，等字体加载完毕后切换
3.  **swap**：先显示备用字体，等字体加载完成后切换
4.  **fallback**：先显示空白（大约 100ms），然后切换为备用字体，时间大概是 3s，3s 内能加载完字体，就使用字体，3s 内加载不完，后续接着使用备用字体
5.  **optional**：先显示空白（大约 100ms），100ms 内能加载完就用，加载不完就直接使用备用字体

CSS `font-display` 的默认值为 `auto`，`next/font` 组件的默认值为 `swap`。

### 5.7. preload

布尔值，制定字体是否应该被预加载，默认值为 `true`。

### 5.8. fallback

字体无法被加载时的备用字体，没有默认值，字符串数组形式，如 `fallback: ['system-ui', 'arial']`。

### 5.9. adjustFontFallback

对于 `next/font/google`，`adjustFontFallback` 是一个布尔值，设置是否应该使用自动备用字体以减少累积布局偏移。默认值为 `true`。

对于 `next/font/local`，`adjustFontFallback` 可以是字符串，也可以是 `false`。可能的值有 `Arial`、`Times New Roman`、`false`。默认值是 `Arial`。

`Arail`是经典的无衬线字体，`Times New Roman`是经典的衬线字体，其实就是让你选用衬线还是无衬线字体作为备用字体进行调整，当然你也可以选择不调整，那就是 `false`。谷歌字体之所以不用选，是因为 Next.js 自动帮你判断了。

### 5.10. variable

这个属性与 CSS 变量有关，我们先简单复习一下 CSS 变量的概念。

CSS 变量由开发者自己定义，先通过自定义属性标记设定值（比如： `--main-color: black;`），然后由 `var()` 函数来获取值（比如： `color: var(--main-color);`）。

好处有两个，一是方便重复使用，比如一个色值可能在多个地方用到，如果发生变化，就需要全局搜索替换，使用 CSS 变量，只用更改变量的值即可。二是语义化，比如，`--main-text-color` 会比 `#00ff00` 更易理解。自定义属性受级联的约束，并从其父级继承其值。

比如你在 html 元素上声明一个 CSS 变量：

```javascript
html {
  --main-bg-color: brown;
}
```

需要用到该色值的元素可以直接使用：

```javascript
p {
  background-color: var(--main-bg-color);
}
```

使用 `next/font` 如何声明一个 CSS 变量呢？便是借助 `variable` 属性：

```javascript
// app/page.js
import { Inter } from 'next/font/google'
import styles from '../styles/component.module.css'
 
const inter = Inter({
  variable: '--font-inter',
})
```

此时我们就建立了一个 CSS 变量 `--font-inter`，它的具体值在添加到 HTML 上后可以查看到：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97ad41fc5eda4f6790bdf5859ea24cb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=588\&h=130\&s=22160\&e=png\&b=292929)

其中 `__Inter_a64ecd` 和  `__Inter_Fallback_a64ecd` 对应的是 Next.js 自动生成的自定义字体名字：

```javascript
/* latin */
@font-face {
  font-family: '__Inter_a64ecd';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2) format('woff2');
  //...
}

@font-face {
  font-family: '__Inter_Fallback_a64ecd';
  src: local("Arial");
  ascent-override: 90.20%;
  descent-override: 22.48%;
  line-gap-override: 0.00%;
  size-adjust: 107.40%
}
```

所以 `--font-inter: '__Inter_a64ecd', '__Inter_Fallback_a64ecd';` 的意思就是声明了两个自定义字体。

PS：如果你不想要有 `__Inter_Fallback_a64ecd`，只有 `__Inter_a64ecd`，设置 `adjustFontFallback`为 false。

现在只是声明，我们还需要通过 `var()` 函数使用，将两个字体放到 `font-family` 属性中：

```css
// styles/component.module.css
.text {
  font-family: var(--font-inter);
  font-weight: 200;
  font-style: italic;
}
```

最后一步，将声明添加到父元素，将自定义的 text 样式添加到子元素，这样子元素才可以获取到父元素中声明的变量：

```javascript
// app/page.js
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

有的时候，为了方便，会直接将声明添加到 HTML 元素上，这样所有的元素都可以使用该声明：

```javascript
// layout.js
import './globals.css' 
import { Inter } from 'next/font/google'


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### 5.11. declarations

上一节我们看到 Next.js 自动生成的 `@font-face` 的内容：

```javascript
@font-face {
  font-family: '__Inter_a64ecd';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2) format('woff2');
  //...
}
```

但其实`@font-face`下的属性还有很多，有很多我们并不熟悉的如 `ascent-override`、`descent-override`、`font-feature-settings`、`font-variation-settings`、`line-gap-override`、`unicode-range`等，具体查看 [MDN @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)。`declarations` 就是为了让你进一步自定义 `@font-face` 的生成，使用示例如下：

```javascript
declarations: [{ prop: 'ascent-override', value: '90%' }]
```

注意该属性只用于 `next/font/local`。

## 6. 应用样式的三种方法

### 6.1. className

目前，我们讲到的添加样式的方法都是通过 `className`属性：

```javascript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin']
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>{children}</body>
    </html>
  )
}
```

当你读取字体对象的 className 属性时，会返回一个只读的 CSS `className`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09054be7fdda4f238cb662eaf620bd69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1620\&h=292\&s=129207\&e=png\&b=292929)

在这个例子中，`inter.className` 返回的值为 `__className_a64ecd`，Next.js 对应在自动生成的 `layout.css` 中设置的样式为：

```css
.__className_a64ecd {
    font-family: '__Inter_a64ecd', '__Inter_Fallback_a64ecd';
    font-style: normal;
}

@font-face {
  font-family: '__Inter_a64ecd';
  //...
}

@font-face {
  font-family: '__Inter_Fallback_a64ecd';
  //...
}
```

### 6.2. style

除了 `className`，还可以使用 `style`，它会返回一个只读的 `style` 对象，示例代码如下：

```javascript
// layout.js
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin']
})

export default function RootLayout({ children }) {
  return (
    <html style={inter.style}>
      <body>{children}</body>
    </html>
  )
}
```

生成的 HTML 代码为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aea458236fe6459cbbb6d4cc33b12f6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1430\&h=256\&s=100571\&e=png\&b=2b2b2b)

### 6.3. CSS 变量

CSS 变量已经介绍过，就不多说了。

## 7. 常见问题

### 7.1. 使用多种字体

你可以导入并使用多种字体，有两种方法：

第一种方法是创建一个工具函数用于导出字体，然后在需要的时候导入字体，应用 `className`。这可以保证只有在使用它时候才预加载字体。

导出两个字体对象：

```javascript
// app/fonts.js
import { Inter, Roboto_Mono } from 'next/font/google'
 
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
 
export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
```

在需要的时候导入并使用：

```javascript
// app/layout.js
import { inter } from './fonts'
 
export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```javascript
// app/page.js
import { roboto_mono } from './fonts'
 
export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>My page</h1>
    </>
  )
}
```

第二种方法是，创建一个 CSS 变量，可以跟你喜欢的 CSS 方案一起使用，举个例子：

```javascript
// app/layout.js
import { Inter, Roboto_Mono } from 'next/font/google'
 
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
 
const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

最终实现的代码为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/092348c4217e4cfc911c6c84076a41d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1632\&h=736\&s=355012\&e=png\&b=2b2b2b)

你可以看到，声明了两个 CSS 变量，`--font-roboto-mono` 和 `--font-inter`，当你需要为字体添加样式的时候，直接使用该变量即可：

```css
// app/global.css
html {
  font-family: var(--font-inter);
}
 
h1 {
  font-family: var(--font-roboto-mono);
}
```

### 7.2. 搭配 Tailwind CSS

`next/font` 可以通过 CSS 变量的形式与 Tailwind CSS 搭配使用。

首先通过 `variable`声明 CSS 变量：

```javascript
// app/layout.js 
import './globals.css' 
import { Ma_Shan_Zheng, Roboto_Mono } from 'next/font/google'


const ma_shan_zheng = Ma_Shan_Zheng({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-ma-shan-zheng',
})
 
const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ma_shan_zheng.variable} ${roboto_mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

```css
// globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

然后，将 CSS 变量添加到 Tailwind CSS 配置中：

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        "ma": ['var(--font-ma-shan-zheng)'],
        "mono": ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
}
```

最后，以 `font-` 作为前缀如（`font-ma`、`font-mono`）为元素添加样式：

```jsx
// page.js
export default function Page() {
  return <h1 className="font-ma underline">你好，世界！Hello World!</h1>
}
```

### 7.3. 使用字体定义文件

每次调用字体函数的时候，该字体都会作为一个实例被托管，所以如果多个地方使用同一个字体，还是应该在一个地方加载，然后按需导入。这就是字体定义文件的作用。

举个例子，在根目录下的 `styles` 文件夹下创建一个 `fonts.ts`文件，然后声明字体定义：

```javascript
// styles/fonts.js
import { Inter, Lora, Source_Sans_3 } from 'next/font/google'
import localFont from 'next/font/local'
 

const inter = Inter()
const lora = Lora()

const sourceCodePro400 = Source_Sans_3({ weight: '400' })
const sourceCodePro700 = Source_Sans_3({ weight: '700' })

const greatVibes = localFont({ src: './GreatVibes-Regular.ttf' })
 
export { inter, lora, sourceCodePro400, sourceCodePro700, greatVibes }
```

现在你可以在代码中使用这些定义：

```javascript
// app/page.js
import { inter, lora, sourceCodePro700, greatVibes } from '../styles/fonts'
 
export default function Page() {
  return (
    <div>
      <p className={inter.className}>Hello world using Inter font</p>
      <p style={lora.style}>Hello world using Lora font</p>
      <p className={sourceCodePro700.className}>
        Hello world using Source_Sans_3 font with weight 700
      </p>
      <p className={greatVibes.className}>My title in Great Vibes font</p>
    </div>
  )
}
```

为了更轻松的访问字体定义文件，你可以在 `tsconfig.json` 或 `jsconfig.json` 中定义路径别名：

```javascript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/fonts": ["./styles/fonts"]
    }
  }
}
```

现在你可以这样使用：

```javascript
// app/about/page.js
import { greatVibes, sourceCodePro400 } from '@/fonts'
```

## 参考链接

1.  [Components: Font](https://nextjs.org/docs/app/api-reference/components/font)
2.  [Optimizing: Fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
3.  <https://web.dev/articles/css-size-adjust?hl=zh-cn>
4.  <https://developers.google.com/fonts/docs/getting_started?hl=zh-cn#specifying_script_subsets>
5.  <https://learn.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg>
6.  [可变字体（Variable Fonts）尝鲜](https://io-oi.me/tech/get-started-with-variable-fonts/)
7.  <https://fonts.google.com/knowledge/glossary/oblique>
