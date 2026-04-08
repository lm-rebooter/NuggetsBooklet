![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f428b80c2f5b4c2e8c62304a5b204c62~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=420&s=80330&e=png&b=fefefe)

  


在科技不断更新的今天，每个像素都肩负着创造出色用户体验的使命。SVG 矢量图以其可无损缩放的神奇特性，成为现代 Web 开发中不可或缺的一部分。而 **[Next.js](https://nextjs.org/)** 是 React 领域备受瞩目的框架，依靠其优秀的性能优化和无缝的服务器端渲染（SSR）功能，引领 Web 开发者向着效率与优雅迈进。

  


在基于Next.js 构建的应用中，使用 SVG 变得愈发重要。SVG 具有可伸缩性、清晰度以及与 DOM 元素的完美融合，是打造动态、响应式图形的绝佳选择。因此，学会在 Next.js 应用中高效使用 SVG 至关重要。这节课将带领你探索在 Next.js 应用中导入和使用SVG的多种不同方法，并利用 CSS 和 JavaScript 为 SVG 图形增添动态效果和交互功能。我们还将深入探讨在导入 SVG 到 Next.js 应用中可能遇到的常见错误以及如何解决。

  


无论你是想为个人项目增添一抹色彩，还是为商业网站提升用户体验，都将提供实用的技能和灵感。让我们一起深入探索 SVG 在 Next.js 中的无限可能，点燃你的创意火花，开启一段充满惊喜的学习之旅吧！

  


## Next.js 简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66102bad95354d06892d1b0b36032366~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=720&s=200843&e=png&b=1d1d1d)

  


**[Next.js](https://nextjs.org/)** 是一个由 Vercel 公司创建的开源 Web 开发框架，专为提供基于 React 的 Web 应用程序的服务器端渲染（SSR）和静态网站生成（SSG）功能而设计。通过 Next.js，你可以创建高质量的 Web 应用程序，充分利用 React 组件的强大功能，同时享受服务器端渲染带来的性能和 SEO 优势。

  


Next.js 提供了一系列强大功能和优化，这些功能和特点对于在 Next.js 中使用 SVG 图像具有显著优势。以下是 Next.js 的具体特点如何为 SVG 的使用带来益处：

  


-   **内置优化**：Next.js 的自动优化功能不仅包括对图片的优化，还能处理 SVG 图像。自动优化功能确保 SVG 图像在 Web 应用中加载更快，提升用户体验（UX）和核心 Web 指标（Core Web Vitals）。
-   **动态 HTML 流式传输：** 使用 Next.js 的动态 HTML 流式传输功能，SVG 图像可以更快地从服务器传输到客户端。这对于需要快速呈现复杂图形的应用特别有用，确保 SVG 图像在初始加载时迅速可见，提高用户满意度。
-   **高级路由与嵌套布局**：Next.js 的高级路由和嵌套布局支持，使得开发者能够在不同的页面和组件中轻松地复用 SVG 图像。文件系统路由的使用，使得管理和组织 SVG 图像变得更加简单。
-   **CSS 支持**：Next.js 支持使用 CSS Modules、Tailwind CSS 等工具，这使得对 SVG 图像进行样式设置和定制变得更加灵活。开发者可以轻松地使用 CSS 来调整 SVG 的外观和动画效果，从而创建更具吸引力的用户界面。
-   **服务器操作和中间件**：通过 Next.js 的服务器操作和中间件功能，开发者可以动态生成或修改 SVG 图像。例如，可以根据用户请求生成个性化的 SVG 图像，或者在服务器端进行 SVG 图像的优化和压缩，确保传输到客户端的 SVG 图像体积最小，加载最快。
-   **数据获取**：Next.js 的数据获取功能允许开发者在服务器端或客户端获取和处理 SVG 图像的数据。例如，可以从远程服务器获取 SVG 图像，并在渲染页面之前进行处理和优化。这对于需要动态加载和显示 SVG 图像的应用非常有用。
-   **客户端和服务器渲染**：Next.js 提供的灵活渲染和缓存选项，包括增量静态再生（ISR），确保 SVG 图像在客户端和服务器端都能高效渲染。无论是静态 SVG 图像还是动态生成的 SVG 图像，Next.js 都能提供最佳的性能。

  


简而言之，通过结合 Next.js 的功能和特点，Web 开发者可以在 Next.js 应用中更高效地使用 SVG 图像，提升图像的加载速度和渲染性能，同时提供更好的用户体验。无论是静态展示还是动态生成，Next.js 都能为 SVG 图像的使用提供强大的支持和优化。

  


## 快速开始

  


要在 Next.js 中使用 SVG，首先需要创建一个 Next.js 应用。这与在 React 和 Vue 应用中使用 SVG 的过程类似。[创建一个新的 Next.js 应用](https://nextjs.org/docs/app/api-reference/create-next-app)非常简单，只需运行以下命令：

  


```
pnpm create next-app
```

  


根据命令行中的提示进行相应选择，即可快速构建一个全新的 Next.js 应用。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c19ee3096664ea1a8684768b26a4e9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2214&h=1232&s=336704&e=jpg&b=1e1e1e)

接下来，进入项目目录，并在命令行中执行 `pnpm run dev`，这将启动你新创建的 Next.js 应用。然后，在浏览器地址栏中输入 `http://localhost:3000`，你将会在浏览器中看到类似下面这样的页面：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a9bf2f05c2a49fa851a1ce1f6ee9c17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3338&h=1864&s=283494&e=jpg&b=000000)

  


恭喜你，专属于你的 Next.js 应用创建成功。

  


在开始聊 SVG 之前，我们还有一点准备工作需要做。首先，调整一下 Next.js 项目的结构。[官方推荐方式](https://nextjs.org/docs/getting-started/project-structure)如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8373195ab1d54ee993afb05395b6aa5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=525&s=10903&e=avif&b=1a1a1a)

  


你也可以按照下面这样的模式来设置 Next.js 项目的结构：

  


```
svg-nextjs/
  ├── .next/                   # Next.js 自动生成的构建输出目录
  ├── node_modules/            # 依赖的第三方模块
  ├── pages/                   # 页面组件目录
  │   ├── index.js            # 根路径的页面组件
  │   ├── about.js            # 关于页面组件
  │   └── ...                 # 其他页面组件
  ├── public/                  # 静态文件目录
  │   ├── favicon.ico         # 网站图标
  │   └── ...                 # 其他静态资源
  ├── components/              # 可重用组件目录
  │   ├── Header.js           # 页面头部组件
  │   ├── Footer.js           # 页面底部组件
  │   └── ...                 # 其他组件
  ├── styles/                  # 全局样式目录
  │   ├── globals.css         # 全局 CSS 样式文件
  │   ├── Home.module.css     # Home 页面的 CSS 模块文件
  │   └── ...                 # 其他样式文件或模块
  ├── api/                     # 可选的 API 路由目录
  │   ├── users.js            # 示例 API 路由文件
  │   └── ...
  ├── public/
  │   ├── assets/            # 静态资源文件目录
  │   │   ├── images/        # 图像文件目录
  │   │   ├── fonts/         # 字体文件目录
  │   │   ├── videos/        # 视频文件目录
  │   │   ├── icons/         # 图标文件目录  
  │   │   └── ...            # 其他静态资源文件目录
  │   ├── favicon.ico        # 网站图标
  │   └── ...                 # 其他根目录静态资源文件  
  ├── package.json             # 项目的依赖和脚本配置文件
  ├── package-lock.json        # 锁定依赖版本的文件
  ├── README.md                # 项目的说明文档
  └── ...
```

  


我选择了一种比较熟悉自己习惯的方式，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57fe608af23049c0af1b05e73cca986f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3338&h=1744&s=309564&e=jpg&b=23252c)

  


与此同时，我在 `src/assets` 添加了一些 `.svg` 文件，毕竟我们接下来更多的时间是与 SVG 打交道。另外，我将 `page.js` 中的内容尽可能的简单化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de3e656a9af44e76b3c967660d410a54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3328&h=1728&s=335738&e=jpg&b=23262c)

  


这个时候，你在浏览器中看到的页面非常的干净：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0f7840ac6844d01883c31b19a777431~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3332&h=1940&s=179907&e=jpg&b=ffffff)

现在，准备就绪，我们开始进入今天真正的主题吧！

  


## 了解 Next.js 应用中的 SVG 导入

  


将 SVG 图像整合到你的 Next.js 项目中可以增强其视觉吸引力，并通过提供可缩放的图形来改善用户体验，保持在任何尺寸下的质量不变。下面是有效导入和使用 SVG 文件的方法，帮助你在 Next.js 应用程序中充分利用这一功能。

  


### 将 SVG 作为图像导入

  


在 HTML 中，我们可以直接使用 `<img>` 的 `src` 属性来引用一个 `.svg` 文件，将引用的 SVG 图像在 Web 上呈现：

  


```HTML
<img src="path/example.svg" alt="example" />
```

  


而 [Vue](https://juejin.cn/book/7341630791099383835/section/7368317661245079561) 和 [React](https://juejin.cn/book/7341630791099383835/section/7368317806100054043) 应用程序也有类似的方式，只是代码编写上略有差异：

  


```JavaScript
// Vue 应用：App.vue
<template>
    <img src="./assets/vue.log" alt="Vue Logo" />
</template>
```

  


```JavaScript
// React 应用：App.jsx
const reactLogo from "@/assets/react.svg";

const App = () => {
    return (
        <img src={reactLogo} alt="React Logo" />
    )
}

export default App;
```

  


不幸运的是，在 Next.js 项目中，要是直接通过 `<img>` 的 `src` 引用 SVG 文件，并不能像你所期望的那样，将 SVG 图形在浏览器中呈现：

  


```JavaScript
// page.js
import NextJS from '@/assets/nextjs.svg';

export default function Home() {
    return (
        <div className="app">
            <img src={NextJS} alt="NextJS" />
        </div>
    );
}

/* 或者 */
export default function Home() {
    return (
        <div className="app">
            <img src="../assets/nextjs.svg" alt="NextJS" />
        </div>
    );
}
```

  


浏览器控制台抛出错误信息：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d51ae57ee334e8abe04cb7cc5afd39f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3324&h=1426&s=499960&e=jpg&b=060606)

  


你发现，智能的 VSCode 编辑器提示我们，[需要使用 `<image>` 元素(即 next/image）](https://nextjs.org/docs/messages/no-img-element) :

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e761b165d9ad4c968f01962d9b01533d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3340&h=2080&s=742597&e=png&b=23262c)

  


根据上面提示，使用 `Image` 引入 SVG：

  


```JavaScript
import Image from "next/image";
import NextJS from '@/assets/nextjs.svg';

export default function Home() {
    return (
        <div className="app">
            <Image src={NextJS} alt="NextJS" priority={true}/>
            <h1>从这里开始...</h1>
        </div>
    );
}
```

  


正如你想的，浏览器正常的将你引入的 SVG 图像渲染出来了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/361cfa860a82415b9e187568f4772938~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3328&h=1700&s=282647&e=jpg&b=000000)

  


这与我们所熟悉的 Vue 和 React 应用是不一样的。具体原委，稍后会阐述！

  


### 将 SVG 作为 CSS 背景

  


虽然在 Next.js 中无法直接通过 `<img>` 引入 SVG ，但在 CSS 中将 SVG 用作背景图像，和我们以往所了解的应用是相同的：

  


```CSS
/* page.css */
.app {
    background: url("../assets/bg.svg") no-repeat left top /  cover;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5075ab49c44d464f80b00aa141af5788~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1616&h=792&s=3125353&e=gif&f=48&b=000000)

  


你看到的类似流星的效果，就是 `bg.svg` 的效果。这种方法比较适用于不需要通过 JavaScript 或 CSS 进行操作的装饰背景。注意，CSS 中可接受 `<image>` 值类型的属性都可以像 `background-image` 应用 SVG。例如 `mask-image` 、`border-image` 等。

  


### 将 SVG 内联到 Next.js 应用中

  


另一种方法是直接将 SVG 代码内联你到的 Next.js 组件中。这种方法简单直接，不需要任何额外的配置。只需要复制你的 SVG 代码，直接粘贴到 Next.js 组件文件中即可。

  


```JavaScript
// page.js

import "./page.css";
export default function Home() {
    return (
        <div className="app">
            <svg viewBox="0 0 512 512">
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
            </svg>
        </div>
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/936fb8b9b9774a27b36519d23977fc86~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1948&s=378945&e=jpg&b=e5e8e9)

  


这种方式的最大优势是，你可以直接通过 CSS 或 JavaScript 来控制 SVG 图形：

  


```CSS
/* page.css */

path {
    fill: gray;
    transition: fill .2s linear;
}

svg:hover path {
    fill: #f36;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e66a3b64dd58498d9a1f66463db6bc04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=722&s=2097366&e=gif&f=69&b=e4e9e9)

  


但是，请注意，对于大型 SVG 或使用多个 SVG 实例时，这可能不是最有效的方法。

  


### 如何通过 Image 组件导入 SVG

  


每个标准的 Next.js 项目都包含一个内置的 `Image 组件`（即 `next/image`），用于处理各种图像格式。你可以使用这个 `Image` 组件来处理位图和矢量图。因此，在 Next.js 应用程序中使用 SVG 或其他图像格式时，内置的 `Image` 组件几乎总是你的首选。

  


`Image` 组件是 Next.js 中加载和渲染图像（包括 SVG）的标准组件。该组件能够高效地加载和渲染图像，并优化图像以实现更快的页面加载速度、更好的性能和稳定性。它是 HTML 的 `<img>` 元素的增强版，提供了更多功能和更好的性能。

  


对于本地 SVG 图像，你可以像下面的示例一样导入和使用 `Image` 组件：

  


```JavaScript
import Image from "next/image";
import NextJS from '@/assets/nextjs.svg';

export default function Home() {
    return (
        <div className="app">
            <Image src={NextJS} priority={true} alt="NextJS" />
            <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


通过这种方式，你可以确保在 Next.js 项目中高效地使用 SVG 图像，并提升页面的加载性能。 `priority` 属性确保重要的图像优先加载，从而改善用户体验。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1be733899ed345a899c58ff71a160cca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1934&s=481804&e=jpg&b=e4e7e8)

  


你不需要显式指定 `width` 和 `height` 属性，因为 Next.js 会自动确定它们的值。另一方面，对于远程图像， `src` 属性值应该是绝对或相对 URL 字符串。你应该像下面的示例中那样设置 `width` 和 `height` 属性：

  


```JavaScript
import "./page.css";
import Image from "next/image";

export default function Home() {
    return (
        <div className="app">
          <Image src="../assets/icons/facebook.svg" priority={true} width={88} height={88} alt="facebook" />
          <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


在使用 `Image` 组件时，请注意 Next.js 会从项目的根目录中的 `public` 目录中提供静态资源，例如图像。因此，在上面的示例中，`facebook.svg` 文件必须位于 `public` 目录中的 `assets/icons` 目录中。否则，浏览器在渲染的时候会找不到 `facebook.svg` 文件：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2aa4f55851f40e4bc363a6494984145~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3342&h=1938&s=437512&e=jpg&b=ecf0f1)

  


根据相关要求，将 `assets` 整个目录移入到 `public` 目录中：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b3bd5420d9a4cd98e38224ba9a18fc6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3352&h=1876&s=429442&e=jpg&b=23272d)

  


此时，Next.js 的 `Image` 组件导入的 `facebook.svg` 图标能在浏览器中得到正常的渲染：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2c214dd2b854673b89160817af6e3b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3320&h=1876&s=395001&e=jpg&b=e4e7e8)

  


你可以向 `Image` 组件传递多个 `props`。[查看 Image 组件文档以获取所需和可选 props 的完整列表](https://nextjs.org/docs/pages/api-reference/components/image)。在本节中，我们重点介绍了使用 `Image` 组件在 Next.js 应用程序中导入和渲染 SVG 的方法。

  


### 以组件的方式导入 SVG

  


在 Next.js 项目中，有多种方式可以以组件的形式导入 SVG。常见的一种方法是在组件中直接内联 SVG 代码。这样做与直接将代码内联到 Next.js 项目中没有太大差异，不同之处在于，内联的 SVG 代码被封装成一个独立的组件，可以在任意次数和任意地方引用使用。

  


例如，我们在 `components` 目录中创建了一个名为 `FacebookIcon` 的组件，然后将 SVG 代码直接内联到该组件中：

  


```JavaScript
// components/FacebookIcon.js
const FacebookIcon = () => {
    return (
        <svg className="icon icon--facebook" viewBox="0 0 448 512">
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
        </svg>
    );
};

export default FacebookIcon;
```

  


接着你可以在 Next.js 项目中的任何地方引用 `FacebookIcon` 组件：

  


```JavaScript
import "./page.css";
import FacebookIcon from '@/components/FacebookIcon';
export default function Home() {
    return (
        <div className="app">
            <FacebookIcon />
            <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


此时，浏览器就会将 `facebook.svg` 对应的代码直接嵌入到 DOM 中，并渲染出 Facebook 图标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a6e9bd8ea7c4705b40be7294315b2a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3336&h=1896&s=801049&e=jpg&b=e8edef)

  


  


另一种方式是通过调整 Next.js 的配置来处理 SVG 文件，例如，使用 `@svgr/webpack` 加载器将 SVG 转换为 Next.js 组件。这意味着，你无需直接在代码中处理繁琐的 SVG 语法，只需将 SVG 文件导入为 Next.js 组件，然后像使用任何其他 Next.js 组件一样使用它们。这需要在项目的 `next.config.js` 文件中设置[自定义的 Webpack 配置](https://nextjs.org/docs/pages/api-reference/next-config-js/webpack)。

  


```JavaScript
/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
        // 查找现有的用于处理 SVG 导入的规则
        const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));
    
        config.module.rules.push(
            // 重新应用现有规则，但仅适用于以 ?url 结尾的 SVG 导入
            {
                ...fileLoaderRule,
                test: /.svg$/i, // 匹配所有 .svg 文件（不区分大小写）
                resourceQuery: /url/ // 仅适用于文件名包含 '?url' 的 SVG 文件
            },
            // 将所有其他 .svg 导入转换为 React 组件
            {
                test: /.svg$/i, // 匹配所有 .svg 文件（不区分大小写）
                issuer: fileLoaderRule.issuer, // 应用规则的来源模块
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // 排除包含 '?url' 的文件
                use: ['@svgr/webpack'] // 使用 @svgr/webpack 加载器将 SVG 转换为 React 组件
            }
        );
    
        // 修改文件加载规则以忽略 .svg 文件，因为我们已经处理它们了
        fileLoaderRule.exclude = /.svg$/i;
    
        return config; // 返回修改后的 Webpack 配置
    },
};

export default nextConfig;
```

  


现在，SVGR 已经设置好了，这使你可以直接将 SVG 文件作为 Next.js 组件导入到你的项目中。

  


```JavaScript
// page.js

import "./page.css";
import TwitterIcon from '../../public/assets/icons/x-twitter.svg';
export default function Home() {
    return (
        <div className="app">
            <TwitterIcon width={88} height={88}/>
            <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2abb6f96de3c4b0b8098fdd11375840f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3324&h=1930&s=648891&e=jpg&b=f9f8f7)

  


这种方法简化了使用 SVG 的过程，使其与任何其他 Next.js 组件一样易于使用。

  


在 Next.js 项目中，除了可以使用像 `@svgr/webpack` 这样的工具导入 SVG 外，还有许多类似的工具包可供选择。这些工具都可以帮助你将 SVG 导入到 Next.js 项目中，例如 `next-images` 和 `babel-plugin-inline-react-svg`。我们不会在这里详细探讨它们的使用，但如果你感兴趣，可以查看它们各自的使用文档。相比之下，我更喜欢使用 `@svgr/webpack`，因为 [SVGR](https://react-svgr.com/) 的功能已经非常强大了，几乎可以满足所有使用 SVG 的需求。

  


## 比较在 Next.js 中导入 SVG 的选项

  


正如前面所述，在 Next.js 项目中，有多种导入和使用 SVG 的方法，每种方法都有其独特的用途。

  


首先，Next.js 内置了 `Image` 组件，可以高效地加载和渲染各种图像格式，包括 SVG。这个组件是 HTML 图像元素 `<img>` 的增强版，能够提供内置的性能优化，使页面加载更快，性能更佳。

  


其次，你可以选择手动导入 SVG 或使用 `@svgr/webpack` 工具将 SVG 内联到 Next.js 组件中。这种方法允许你在 CSS、JavaScript 和 React 中更灵活地操控 SVG，例如添加样式、控制交互等。但是，内联 SVG 会使 React 组件变得难以阅读和维护，并可能增加组件的大小，而且无法享受 Image 组件的内置优势。

  


另外，你还可以使用第三方包将 SVG 引入到 Next.js 项目中，比如前文提到的 `next-images` 包。这种方法可以通过 Base64 编码来减少 HTTP 请求，但它不像内置的 `Image` 组件那样执行内置图像优化和压缩。需要注意的是，使用第三方包会给应用程序带来额外的捆绑包，并需要考虑长期维护、安全性和许可要求等方面的问题。

  


这些方式都各有利弊，选择合适的导入方式取决于项目的需求和优先级。

  


## 在 Next.js 中使用内联 SVG 和外部 SVG

  


尽管在将 SVG 集成到 Next.js 项目中有多种方法，但对于 Web 开发者而言，实际上主要分为两种：**内联 SVG** 和**外部 SVG**。这两种方式各有优劣，对于项目的性能、可维护性、可访问性和 SEO 都有影响。

  


内联 SVG 直接将代码嵌入到你的 Next.js 组件中。这种方法允许你使用 CSS 或 JavaScript 轻松地操作 SVG 属性，如颜色或大小。内联 SVG 可以通过减少所需的 HTTP 请求数量来提高应用的性能。然而，这可能会增加 HTML 文档的大小，对于大型 SVG 文件可能会影响页面初始加载时间。

  


```JavaScript
const InlineSVGExample = () => (
    <svg width="100" height="100">
        <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
    </svg>
);
```

  


另一方面，外部 SVG 是通过 `img` 标签中的 URL 引用或通过 Next.js 的 `Image` 组件加载的，以进行优化。这种方法使你的 HTML 文档保持精简，但对于每个 SVG 需要额外的 HTTP 请求。这对于缓存用于多个页面的 SVG 文件很有益。

  


```JavaScript
import Image from 'next/image';
import externalSVG from '../public/your-svg-file.svg';

const ExternalSVGExample = () => (
    <Image src={externalSVG} alt="Description of SVG" />
);
```

  


在 Next.js 项目中选择内联 SVG 和外部 SVG 取决于你的应用程序的具体需求。内联 SVG 提供更多的控制和即时渲染，这对于交互式或动态样式的图形非常理想。外部 SVG 更适用于静态图像和图标，这些图像和图标受益于缓存机制。

  


## SVG 在 Next.js 应用中的实践

  


在前面的讨论中，我们详细探讨了在 Next.js 应用中导入 SVG 的各种方式以及它们的优缺点。接下来，通过一些实际用例，我希望能够更好地帮助大家理解在 Next.js 应用中如何使用 SVG。

  


### 案例一：动态化 SVG 图标

  


Next.js 提供了一个图像组件，即 `Image`，它支持传统的位图图像和 SVG 文件。它使用了 HTML 的 `<img>` 元素，并且可以从 `public` 目录加载图像，这对于静态图像（如插图）来说非常有效。但是，如果你想要对 SVG 图像进行更多的动态操作，那么 `Image` 组件的功能就显得有些受限了。不过，在 Next.js 应用中，你有几个选项可以考虑。

  


第一个选项是，使用 JSX 创建 SVG 组件。它的好处是，由于它变成了一个 React 组件，你可以更灵活地定制 SVG。然而，缺点是它不再是一个独立的 SVG 图像。另一个选项是，使用 `@svgr/webpack` 加载器，直接将 SVG 以组件的方式导入到 Next.js 应用中。

  


需要注意的是，当使用这种解决方案时，SVG 图像将直接导入到你的 JavaScript 包中。因此，与原生 Next.js 版本的异步加载图像相比，页面总大小会增加。出于这个原因，我不建议将此解决方案用于大型插图，除非它们需要动态功能。然而，对于图标来说，这是一个很好的解决方案，因为它们成为页面的一部分，消除了图像加载时的闪烁。

  


接下来，我们使用 `@svgr/webpack` 加载器，直接将“点赞”图标（`heart.svg`）导入 Next.js 项目中。

  


首先，`heart.svg` 文件存放在 `public/assets/icons` 目录下，相应的 SVG 代码如下：

  


```XML
<svg viewBox="0 0 512 512">
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
</svg>
```

  


非常干净的一段 SVG 源码。

  


接下来，在 `page.js` 中来显示 SVG 文件：

  


```JavaScript
import "./page.css";
import Heart from '../../public/assets/icons/heart.svg';

export default function Home() {
    return (
        <div className="app">
            <Heart />
            <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


现在，如果我们启动 Next.js 应用并加载页面，我们应该会在中心看到一个黑色的“心形”图形。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69db3f51630040f9ae651406cc211454~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3322&h=1912&s=442717&e=jpg&b=e5e8e9)

  


  


假设，我们需要的一个具有点赞功能的“心形”图标，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/951f1364af3f4a5aab6951209b24d838~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=816&s=469877&e=jpg&b=fbf9f9)

  


-   点赞前，“心形”图标具有一个灰色描边效果
-   点赞后，“心形”图标具有一个红色填充效果

  


基于上面的代码，我们给 `<Heart>` 组件传入几个关键属性，例如 `stroke` （描边颜色）、`strokeWidth` （描边粗细）和 `fill` （填充颜色）。

  


```JavaScript
// page.js
import "./page.css";
import Heart from '../../public/assets/icons/heart.svg';

export default function Home() {
    return (
        <div className="app">
            <Heart 
                fill="none"
                stroke="#556672"
                strokeWidth="10"
            />
            <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a3bc44a34ad4ccca7355077bd420cce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3320&h=1848&s=418885&e=jpg&b=e4e7e8)

  


正如你所看到的，在浏览器中默认呈现的就是“点赞”前的心形图标。这主要得益于 `@svgr/webpack` ，一旦使用它将 SVG 文件以组件的方式集成到 Next.js 应用中时，你就可以像使用 React 组件那样，使用该组件。如上面代码所示，我们将 `fill` 、`stroke` 和 `strokeWidth` 当作组件的 `props` 传入。一旦构建完成，你会发现，渲染出来的 SVG 代码中，`<Heart>` 组件传入的 `proprs` 自动透传到 SVG 的 `<svg>` 元素上，从而影响到它的子元素 `<path>` ，相应的就改变了 SVG 图形的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8e7e9d488ea40d0aa8dc84757e2727c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3322&h=1892&s=785815&e=jpg&b=ebf0f1)

  


  


你可能已经注意到了，上面的效果中，“心形”描边效果有部分被裁剪了，这是因为图标在设计的时候，并没有考虑到描边粗细的扩展问题。上面的示例中，`strokeWidth="10"` 致使 SVG 图形比其视图框（`viewBox`）更大，因此超出的部分被裁剪掉了（`svg` 的 `overflow` 属性默认为 `hidden`）。

  


最快速的修复办法是在 CSS 中将 `svg` 元素的 `overflow` 属性设置为 `visible` 。但这种修复方案，并没有解决核心问题，SVG 图形依旧比它的视图框更大。

  


另外一种修复方案是通过调整视图框（`viewBox`）的大小，并将 `viewBox` 的 `<min-x>` 和 `<min-y>` 的值设置为负值，使图形保持在视图框的中间。例如：

  


```JavaScript
import "./page.css";
import Heart from '../../public/assets/icons/heart.svg';

export default function Home() {
    return (
        <div className="app">
            <Heart 
                fill="none"
                stroke="#556672"
                strokeWidth="10"
                viewBox="-20 -20 552 552"
            />
            <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be57efe96ac54d01a6c8536098a02bec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3336&h=1920&s=759956&e=jpg&b=ebf0f1)

  


  


现在“心形”在视图框（上图中虚线）的中间，整个形状也是完整的。

  


虽然这种人工修改 `viewBox` 属性的值，可以解决问题，但其灵活性不够，一旦调整 `strokeWidth` 的值，很有可能还是会致使图形被视图框裁剪掉。庆幸的是，我们在 Next.js 应用中，我们有更好的方式来解决这个问题。我们可以创建一个组件来处理这个问题。你可以在 `components` 目录下创建一个名为 `SVGMargin` 组件：

  


```JavaScript
import React from "react";

/**
 * 类型保护函数，用于检查一个 React 节点是否是函数组件。
 * @param node - 要检查的 React 节点。
 * @returns  如果是函数组件则返回 true，否则返回 false。
 */
const isFunctionalComponent = (node) => {
  return (
    node !== null && // 节点不为空
    typeof node === "object" && // 节点是一个对象
    "type" in node && // 节点包含 "type" 属性
    typeof node.type === "function" // 节点的 "type" 是一个函数
  );
};

/**
 * 获取组件的名称。
 * @param component - 一个组件。
 * @returns 组件的名称。
 */
const getComponentName = (component) =>
  typeof component.type === "string" // 如果组件类型是字符串（例如原生 HTML 元素）
    ? component.type // 返回该字符串
    : component?.type?.displayName || // 否则，尝试获取组件的 displayName
      component?.type?.name || // 或者获取组件的 name
      "Unknown"; // 如果都没有，则返回 "Unknown"

/**
 * 用于在 SVG 图像周围添加边距的组件。
 */
export const SVGMargin = ({ children, size: marginRatio }) => {
  // 如果子节点不是函数组件，直接返回子节点
  if (!isFunctionalComponent(children)) {
    return children;
  }

  // 创建一个新的 SVG 组件实例
  const SvgComponent = children.type({});

  // 如果创建的新组件不是有效的 React 元素，直接返回子节点
  if (!React.isValidElement(SvgComponent)) {
    return children;
  }

  // 获取 viewBox 属性
  const viewBox =
    children?.props?.viewBox ?? SvgComponent?.props?.viewBox ?? "";

  // 将 viewBox 属性值拆分为 x, y, width, height
  const [x, y, width, height] = viewBox
    .split(" ")
    .map((value) => parseFloat(value));

  // 如果任意一个值为 null 或不是数字，输出错误信息并返回子节点
  if ([x, y, width, height].some((val) => val == null || isNaN(val))) {
    console.error(
      `missing viewBox property for svg ${getComponentName(SvgComponent)}`
    );
    return children;
  }

  // 计算边距比例
  const margin = marginRatio / 100;

  // 计算新的 x 和 width 值
  const widthMargin = width * margin;
  const newX = x - widthMargin;
  const newWidth = width + 2 * widthMargin;

  // 计算新的 y 和 height 值
  const heightMargin = height * margin;
  const newY = y - heightMargin;
  const newHeight = height + 2 * heightMargin;

  // 克隆 SVG 组件，并应用新的 viewBox 属性
  return React.cloneElement(
    SvgComponent,
    {
      ...children.props, // 保留原有的属性
      viewBox: `${newX} ${newY} ${newWidth} ${newHeight}`, // 应用新的 viewBox 属性
    },
    SvgComponent.props.children // 保留原有的子元素
  );
};
```

  


我们可以像这样使用它：

  


```JavaScript
// page.js
import "./page.css";
import Heart from '../../public/assets/icons/heart.svg';
import {SVGMargin} from '@/components/SVGMargin';

export default function Home() {
    return (
        <div className="app">
            <SVGMargin size="20">
                <Heart 
                    fill="none"
                    stroke="#556672"
                    strokeWidth="10"
                />
          </SVGMargin>
          <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/985cb301f96148a8bb497e2d5eb92c83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3314&h=1938&s=430182&e=jpg&b=e4e7e8)

  


  


这里最大的挑战是由于 `@svgr/webpack` 加载器返回的是一个功能性组件，它不具备与原始组件相同的扩展功能。这意味着，为了添加这个功能，我们必须使用像 `React.cloneElement` 这样的 API，而 React 并不推荐使用它。甚至是为了实现某些功能，不得不进一步使用 `.type()` 这样的内部 React API，这在官方 React 资源中没有记录。

  


这意味着，你不得不为 `@svgr/webpack` 加载器写个包装器来实现一些常见的功能。因此，如果你定制一个高可用的组件，我更推荐的是将 SVG 代码内联到组件中。例如，我们不再依赖 `@svgr/webpack` 加载器直接将 SVG 文件转换为一个组件，而且单独在 `components` 中创建一个名为 `Heart` 的组件，然后从 `heart.svg` 文件中，复制所有 SVG 代码到 `Heart` 组件中：

  


```JavaScript
"use client";

import React, { useEffect, useRef, useState } from "react";

// 创建 Heart 组件
const Heart = ({ fill, stroke, strokeWidth, size,originViewBox }) => {
  // 使用 useRef 创建一个引用，用于访问 SVG 元素
  const svgRef = useRef(null);
  // 使用 useState 创建一个状态，用于存储 SVG 元素的 viewBox 属性值，默认值为 originViewBox
  const [viewBox, setViewBox] = useState(originViewBox);

  // 使用 useEffect 进行副作用处理
  useEffect(() => {
    // 获取 SVG 元素的引用
    const svgElement = svgRef.current;
    // 如果 SVG 元素存在
    if (svgElement) {
      // 获取 SVG 元素的 viewBox 属性值
      const svgViewBox = svgElement.getAttribute("viewBox");
      // 如果 viewBox 属性值存在
      if (svgViewBox) {
        // 将 viewBox 属性值以空格分割成数组，并使用 map 方法将每个值转换为浮点数
        const [x, y, width, height] = svgViewBox.split(" ").map(parseFloat);
        // 计算边距比例
        const margin = size / 100;
        // 计算新的 x 和 width 值
        const widthMargin = width * margin;
        const newX = x - widthMargin;
        const newWidth = width + 2 * widthMargin;
        // 计算新的 y 和 height 值
        const heightMargin = height * margin;
        const newY = y - heightMargin;
        const newHeight = height + 2 * heightMargin;
        // 组合新的 viewBox 属性值
        const newViewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
        // 更新状态中的 viewBox 属性值
        setViewBox(newViewBox);
      }
    }
  }, [size, strokeWidth]); // 定义依赖项为 size 和 strokeWidth

  // 返回 SVG 元素
  return (
    <svg
      ref={svgRef} // 将引用赋给 SVG 元素
      className="icon icon--heart"
      viewBox={viewBox} // 使用状态中的 viewBox 属性值
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
    </svg>
  );
};

// 设置 Heart 组件的显示名称
Heart.displayName = "Heart";

export default Heart;
```

  


现在，你可以像下面这样使用 `Heart` 组件：

  


```JavaScript
// page.js
import "./page.css";
import Heart from '@/components/Heart';

export default function Home() {
    return (
        <div className="app">
            <Heart 
                fill="none"
                stroke="#556672"
                strokeWidth="10"
                originViewBox="0 0 512 512"
                size={10} 
            />
          
            <h1>欢迎来到 SVG + Next.js 的世界</h1>
        </div>
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67045fb74cdb45888c8dc2087a355b0f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3322&h=1828&s=350735&e=jpg&b=000000)

  


解决 `viewBox` 的问题之后，就可以给 `Heart` 透传一个点击事件，用来实现用户交互效果：

  


```JavaScript
import React, { useEffect, useRef, useState } from "react";

// 创建 Heart 组件
const Heart = ({ fill, stroke, strokeWidth, size, originViewBox, onClick }) => {
  // 创建一个 ref 用于访问 SVG 元素
  const svgRef = useRef(null);
  // 创建状态用于存储 SVG 元素的 viewBox 属性值，默认值为 originViewBox
  const [viewBox, setViewBox] = useState(originViewBox);

  // 使用 useEffect 处理副作用
  useEffect(() => {
    // 获取 SVG 元素的引用
    const svgElement = svgRef.current;
    // 如果 SVG 元素存在
    if (svgElement) {
      // 获取 SVG 元素的 viewBox 属性值
      const svgViewBox = svgElement.getAttribute("viewBox");
      // 如果 viewBox 属性值存在
      if (svgViewBox) {
        // 将 viewBox 属性值以空格分割成数组，并使用 map 方法将每个值转换为浮点数
        const [x, y, width, height] = svgViewBox.split(" ").map(parseFloat);
        // 计算边距比例
        const margin = size / 100;
        // 计算新的 x 和 width 值
        const widthMargin = width * margin;
        const newX = x - widthMargin;
        const newWidth = width + 2 * widthMargin;
        // 计算新的 y 和 height 值
        const heightMargin = height * margin;
        const newY = y - heightMargin;
        const newHeight = height + 2 * heightMargin;
        // 组合新的 viewBox 属性值
        const newViewBox = `${newX} ${newY} ${newWidth} ${newHeight}`;
        // 更新状态中的 viewBox 属性值
        setViewBox(newViewBox);
      }
    }
  }, [size, strokeWidth]); // 定义依赖项为 size 和 strokeWidth

  // 返回 SVG 元素
  return (
    <svg
      ref={svgRef} // 将引用赋给 SVG 元素
      className="icon icon--heart"
      viewBox={viewBox} // 使用状态中的 viewBox 属性值
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      onClick={onClick} // 将点击事件传递给 Heart 组件
    >
      {/* SVG 路径 */}
      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
    </svg>
  );
};

// 设置 Heart 组件的显示名称
Heart.displayName = "Heart";

export default Heart;
```

  


在引用 `Heart` 组件的地方定义点击事件函数，主要处理图形 `fill` 和 `stroke` 的颜色变换。从而实现点赞前和点赞后的两种视觉效果：

  


```JavaScript
"use client";

import "./page.css";
import React, { useState } from "react";
import Heart from '@/components/Heart';

export default function Home() {
  const [isLiked, setIsLiked] = useState(false);
  const [fill, setFill] = useState("none"); // 添加 fill 状态
  const [stroke, setStroke] = useState("#556672"); // 添加 stroke 状态

  // 点击事件处理函数
  const handleClick = () => {
    setIsLiked(!isLiked); // 切换点赞状态

    // 根据点赞状态设置 fill 和 stroke 的颜色
    const newFill = isLiked ? "none" : "#e63c80";
    const newStroke = isLiked ? "#556672" : "none";

    // 更新 fill 和 stroke 的值
    setFill(newFill);
    setStroke(newStroke);
  };
  return (
    <div className="app">
      <Heart 
      fill={fill} 
      stroke={stroke}
      strokeWidth="10"
      originViewBox="0 0 512 512"
      size={10} 
      onClick={handleClick}
    />
      
      <h1>欢迎来到 SVG + Next.js 的世界</h1>
    </div>
  );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08aabec961ed455bb8df351a7e6c24f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1374&h=690&s=5020059&e=gif&f=161&b=000000)

  


上面的示例只是改变了 SVG 元素的样式属性。其实，还可以动态渲染 SVG 图形元素。这个与在 [Vue](https://juejin.cn/book/7341630791099383835/section/7368317661245079561) 和 [React](https://juejin.cn/book/7341630791099383835/section/7368317806100054043) 应用是相似的。我直接把上节课中（[SVG 在 React 中的应用](https://juejin.cn/book/7341630791099383835/section/7368317806100054043)）条件渲染 SVG 的 `Bars` 组件移入到 Next.js 中。

  


```JavaScript
// components/Bars/index.js

import "./bars.css";

const Bars = ({ isActive }) => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`bars ${isActive ? "active" : ""}`}
            fill="none"
        >
            <rect className="bars__line bars__line--up" y="6.25" />
            {!isActive && (
                <rect className="bars__line bars__line--middle" y="11.25" />
            )}
            <rect className="bars__line bars__line--down" y="16.25" />
        </svg>
    );
};

export default Bars;
```

  


```CSS
.bars {
    width: 85%;
}

.bars rect {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    fill: hsl(324, 71%, 4%);
    transition: rotate 0.2s 0s, translate 0.2s 0.2s;
    width: 18px;
    height: 1.5px;
    ry: 0.75;
    x: 3;
}

.bars.active rect {
    transition: translate 0.2s, rotate 0.2s 0.3s;
}

.active .bars__line--up {
    translate: 0 333%;
    rotate: -45deg;
}

.active .bars__line--middle {
    rotate: 45deg;
}

.active .bars__line--down {
    translate: 0 -333%;
    rotate: 45deg;
}

.bars.active {
    rotate: 90deg;
    transition: rotate linear(0,
            0.2178 2.1%,
            1.1144 8.49%,
            1.2959 10.7%,
            1.3463 11.81%,
            1.3705 12.94%,
            1.3726,
            1.3643 14.48%,
            1.3151 16.2%,
            1.0317 21.81%,
            0.941 24.01%,
            0.8912 25.91%,
            0.8694 27.84%,
            0.8698 29.21%,
            0.8824 30.71%,
            1.0122 38.33%,
            1.0357,
            1.046 42.71%,
            1.0416 45.7%,
            0.9961 53.26%,
            0.9839 57.54%,
            0.9853 60.71%,
            1.0012 68.14%,
            1.0056 72.24%,
            0.9981 86.66%,
            1) 1s 0.4s;
}
```

  


然后在 `page.js` 中引入 `Bars` 组件：

  


```JavaScript
"use client";

import "./page.css";
import React, { useState } from "react";
import Bars from '@/components/Bars';

export default function Home() {
  const [isActive, setIsActive] = useState(false);

    const toggleActiveState = () => {
        setIsActive(!isActive);
    };
  return (
    <div className="app">
      <button onClick={toggleActiveState} className="button trigger">
                <Bars isActive={isActive}/>
            </button>
      
      <h1>欢迎来到 SVG + Next.js 的世界</h1>
    </div>
  );
}
```

  


```CSS
/* page.css*/
.trigger {
  width: 120px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 0;
  scale: 1;
  border: 2px solid #000;
  border-radius: 10px;
  cursor: pointer;
  place-self: center;
}

.trigger:is(:focus-visible) {
  outline-color: hsl(320 80% 50% / 0.5);
  outline-offset: 1rem;
  outline-width: 4px;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40f0ee2437d24864b5fe20acc6fa6f90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=600&s=3056691&e=gif&f=122&b=000000)

  


### 案例二：SVG 变形动效（Morph Shapes）

  


SVG 变形动效是非常常见的一种效果，我们来看看如何在 Next.js 项目中使用 [Framer Motion ](https://www.framer.com/motion/)混合器与 [Flubber.js](https://github.com/veltman/flubber) 创建 SVG 变形动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d96ce443e03450d861c77432de2f744~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1316&h=622&s=554411&e=gif&f=77&b=fdfcff)

  


上图所展示的就是变形动画。你是不是也很想自己实现一个类似的动画效果。如果是的话，请继续往下阅读。

  


需要知道的是，不管是在 CSS 中还是在 SVG 中，如果要从一个具有相同点数的 SVG （包括 CSS 的 `clip-path` 绘制的形状）变形为另一个 SVG，那么这是非常容易做到的。你不需要依赖任何库就能实现：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2aa3b4685b245088349446c84495dd3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1370&h=696&s=3201576&e=gif&f=65&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/MWdpaBX

  


然而，如果希望能够将任何形状变形为你选择的另一个形状，这就比较棘手了。一旦你开始将两个完全不同的形状进行变形，你就会遇到跳跃、错误和反向变形等问题。为了解决这个问题，社区有很多人创建了一种算法，试图猜没两个形状之间的插值。例如 [GSAP 的 MorphSVGPlugin](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin) 和 [Flubber.js](https://github.com/veltman/flubber) 等。

  


接下来，要向你展示的是使用 [Framer Motion ](https://www.framer.com/motion/)混合器与 [Flubber.js](https://github.com/veltman/flubber) 创建 SVG 变形动画。我们首先得在项目中安装这两个库的依赖包：

  


```
pnpm install -D framer-motion flubber
```

  


安装完相关的依赖之后，我们就可以使用 Flubber.js 库的 `Interpolate` 函数将一个形状变形为另一个形状，而且不断的循环这样的变形过程。然后借助 Framer Motion 给变形添加缓动效果。我们通过一个 `SVGMorph` 组件来实现这些功能：

  


```JavaScript
// components/SVGMorph/index.js

'use client'; // 表示这个代码将在客户端运行

// 导入 flubber 库的 interpolate 方法
import { interpolate } from 'flubber';

// 导入 React 库及其钩子
import React, { useState, useEffect } from 'react';

// 从 framer-motion 库中导入所需的方法
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

// 定义一个名为 SVGMorph 的组件，接收一个包含路径的数组作为 props
const SVGMorph = ({ paths }) => {

    // 使用 useState 创建一个状态，用于存储当前路径的索引
    const [pathIndex, setPathIndex] = useState(0);

    // 使用 useMotionValue 创建一个可以进行动画处理的值，用于存储动画进度
    const progress = useMotionValue(pathIndex);

    // 创建一个包含路径索引的数组
    const arrayOfIndex = paths.map((_, i) => i);

    // 使用 useTransform 方法将进度值转换为路径数据
    const path = useTransform(progress, arrayOfIndex, paths, {
      mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 1 }) // 使用 flubber 的 interpolate 方法进行路径插值
    });

    // 使用 useEffect 钩子在组件挂载后执行动画
    useEffect(() => {
      // 使用 framer-motion 的 animate 方法创建动画
      const animation = animate(progress, pathIndex, {
        duration: 0.14, // 动画持续时间
        ease: "easeInOut", // 动画缓动效果
        delay: 0.15, // 动画延迟时间
        onComplete: () => { // 动画完成后的回调函数
          if (pathIndex === paths.length - 1) { // 如果当前路径索引是最后一个
            progress.set(0); // 将进度重置为 0
            setPathIndex(1); // 设置路径索引为 1
          } else {
            setPathIndex(pathIndex + 1); // 否则，将路径索引加 1
          }
        }
      });

      // 返回一个清理函数，在组件卸载或路径索引变化时停止动画
      return () => { animation.stop() };
    }, [pathIndex]); // 依赖项为路径索引，当路径索引变化时重新运行这个副作用

    // 返回一个 motion.path 元素，用于渲染动态路径
    return (
      <motion.path fill="currentColor" d={path} />
    );
}

export default SVGMorph;
```

  


`SVGMorph` 组件使用 `flubber` 和 `framer-motion` 库实现了 SVG 路径的平滑形变动画。其中，通过 `useState` 管理当前路径索引，`useMotionValue` 和 `useTransform` 实现路径插值，`useEffect` 钩子管理动画的生命周期。

  


接下来，我们使用 `SVGMorph` 组件来创建一个笑脸的图形变形动效。我把这个组件命名为 `Smile` 组件，在这个组件中，通过一个 `paths.js` 文件来管理变形图形用到的路径数据。通常为 SVG 图形的 `<path>` 元素的 `d` 属性对应的值。假设这个笑脸由以下这些数据组成：

  


```JavaScript
// components/Smile/paths.js
export const head = "m96,0C42.98,0,0,42.98,0,96s42.98,96,96,96,96-42.98,96-96S149.02,0,96,0Zm0,181.71c-47.34,0-85.71-38.38-85.71-85.71S48.66,10.29,96,10.29s85.71,38.38,85.71,85.71-38.38,85.71-85.71,85.71Z";
export const happy_smile = "m96,152.43c-24.61,0-38.09-10.47-45.06-19.25-7.12-8.97-11.37-21.26-11.37-32.89h10c0,15.65,9.78,42.14,46.43,42.14,17.24,0,46.43-8.88,46.43-42.14h10c0,11.63-4.25,23.93-11.37,32.89-6.97,8.78-20.45,19.25-45.06,19.25Z";
export const happy_eye_l = "m80.43,72h-10c0-2.91-2.37-5.29-5.29-5.29s-5.29,2.37-5.29,5.29h-10c0-8.43,6.86-15.29,15.29-15.29s15.29,6.86,15.29,15.29Z";
export const happy_eye_r = "m142.14,72h-10c0-2.91-2.37-5.29-5.29-5.29s-5.29,2.37-5.29,5.29h-10c0-8.43,6.86-15.29,15.29-15.29s15.29,6.86,15.29,15.29Z";
export const smile = "m96,151.43c-31.08,0-55.43-14.93-55.43-34h8c0,14.09,21.72,26,47.43,26s47.43-11.91,47.43-26h8c0,19.07-24.35,34-55.43,34Z";
export const eye_l = "m75.43,85.71c0,5.68-4.61,10.29-10.29,10.29s-10.29-4.61-10.29-10.29,4.61-10.29,10.29-10.29,10.29,4.61,10.29,10.29Z";
export const eye_r = "m137.14,85.71c0,5.68-4.61,10.29-10.29,10.29s-10.29-4.61-10.29-10.29,4.61-10.29,10.29-10.29,10.29,4.61,10.29,10.29Z"
```

  


这些数据最终会传给 `SVGMorph` 组件，通过这些不同的路径数据，它就可以实现一个带有表情变化的笑脸图形：

  


```JavaScript
// 导入各个 SVG 路径数据
import {
  head, // 头部路径
  smile, // 微笑路径
  happy_smile, // 开心微笑路径
  happy_eye_l, // 开心的左眼路径
  eye_l, // 左眼路径
  eye_r, // 右眼路径
  happy_eye_r, // 开心的右眼路径
} from "./paths"; // 从 "./paths" 文件中导入路径数据

// 导入 SVGMorph 组件
import SVGMorph from "@/components/svgMorph";

// 定义一个名为 Smile 的组件，接收一个包含颜色的 props
const Smile = ({ color }) => {
  return (
    <div className="container"> 
      <svg className="icon" viewBox="0 0 192 192" color={color}> 
        <path d={head} fill="currentColor" /> {/* 绘制头部路径，填充颜色为当前颜色 */}
        {/* 使用 SVGMorph 组件进行微笑路径的动画 */}
        <SVGMorph paths={[smile, happy_smile, smile]} />
        {/* 使用 SVGMorph 组件进行左眼路径的动画 */}
        <SVGMorph paths={[eye_l, happy_eye_l, eye_l]} />
        {/* 使用 SVGMorph 组件进行右眼路径的动画 */}
        <SVGMorph paths={[eye_r, happy_eye_r, eye_r]} />
      </svg>
    </div>
  );
};

export default Smile;
```

  


这样就可以在页面中使用这个 `Smile` 组件：

  


```JavaScript
import "./page.css";
import Smile from '@/components/Smile'

export default function Home() {
  return (
    <div className="app">
      <Smile color="lime"/>
      <h1>欢迎来到 SVG + Next.js 的世界</h1>
    </div>
  );
}
```

  


最终你将在浏览器中看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d62682e249a4386a99c59087267661c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=654&s=672006&e=gif&f=40&b=000000)

  


刚才提到了，实现这种变形动效，还可以使用 [GSAP 的 MorphSVGPlugin](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin) 实现。例如，[@tiffany choong 在 Codepen 提供了一个在 Vue 应用环境中使用 MorphSVGPlugin 实现的变形交互动画](https://codepen.io/tiffachoo/full/BaQpVeR)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ba37d1b27f44a5881f3992fee7bddff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=518&s=1641824&e=gif&f=512&b=fbeef3)

  


> Demo 地址：https://codepen.io/tiffachoo/full/BaQpVeR

在 Codepen 上，类似这样的变形动效还有很多，如果你感兴趣的话，可以尝试着将它们转换为 Next.js 组件（也可以是 Vue）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553797842dc94fc89d4cb78cf97546fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2062&h=1504&s=175011&e=jpg&b=e7caf5)

  


> Demo 集合：https://codepen.io/collection/naMaNQ

  


### 案例三：粘稠的数字变形

  


在 SVG 中，我们使用 [SVG 的滤镜功能](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)可以轻易制作出各式各样的粘稠效果。例如下面这个带有粘稠的按钮效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13f5a69e85544f17bd9906b2d9df1ba6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=500&s=96388&e=gif&f=41&b=0b0e14)

  


> Demo地址：https://codepen.io/Unleashed-Design/full/gOrEvMV （来源于 [@Unleashed Design](https://codepen.io/Unleashed-Design)）

  


实现上面的效果，最为关键是使用了下面这段代码，使用 SVG 制作了一个粘稠的滤镜（`#gooey`）效果：

  


```XML
<svg>
    <defs>
        <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="highContrastGraphic" />
            <feComposite in="SourceGraphic" in2="highContrastGraphic" operator="atop" />
        </filter>
    </defs>
</svg>
```

  


然后通过 CSS 的 `filter` 属性，将该滤镜应用于元素上。

  


我们可以在 Next.js 应用中快速复制该效果。例如使用 [SVG 滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)和 [Framer Motion ](https://www.framer.com/motion/)（或 [GSAP 的 MorphSVGPlugin](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin)）制作一个数字倒计时的效果，而且数字具有粘稠的变形动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3235645e5f194abca9ef83ef646cc079~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=688&s=3095928&e=gif&f=92&b=e5e9e9)

  


上面是一个 `5~1` 数字倒计时的效果。接下来，简单的向大家介绍一下，在 Next.js 应用中是如何使用 SVG 实现这个效果。

  


首先，我们需要每个数字对应的路径数据。这个很容易获得，你可以在一些图标库中获得，只不过它的路径数据比较复杂，会对性能有直接影响。在这里，我自己在 Figma 软件中使用钢笔工具描绘了这几个数字：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b79be1f341d4b3c9a03e3206716e760~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=848&s=76656&e=jpg&b=ffffff)

  


然后将它导出为 SVG ，我们就获得了相应数字的路径数据：

  


```XML
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- 5 -->
    <path d="M331.5 111H190C184.477 111 180 115.477 180 121V253.5C180 259.023 184.477 263.5 190 263.5H321.5C327.023 263.5 331.5 267.977 331.5 273.5V403.5C331.5 409.023 327.023 413.5 321.5 413.5H180" stroke="black"/>
    <!-- 4 -->
    <path d="M360.5 259H175.842C166.836 259 162.419 248.028 168.914 241.789L304 112V413" stroke="black"/>
    <!-- 3 -->
    <path d="M178 112H333.5V263M333.5 263H178M333.5 263V401.5C333.5 407.023 329.023 411.5 323.5 411.5H178" stroke="black"/>
    <!-- 2 -->
    <path d="M180 110H332.5V247C332.5 252.523 328.023 257 322.5 257H190C184.477 257 180 261.477 180 267V414H332.5" stroke="black"/>
    <!-- 1 -->
    <path d="M256 112V413" stroke="black"/>
</svg>
```

  


在使用之前，最好是通过 [SVGOMG 工具](https://jakearchibald.github.io/svgomg/)对其进行优化。我们将优化之后每个 `<path>` 元素的 `d` 属性的值提取出来，保存在 `GooeyMorph` 组件中的 `paths.js` 文件中：

  


```JavaScript
// components/GooeyMorph/paths.js
export const number_5="M331.5 111H190C184.477 111 180 115.477 180 121V253.5C180 259.023 184.477 263.5 190 263.5H321.5C327.023 263.5 331.5 267.977 331.5 273.5V403.5C331.5 409.023 327.023 413.5 321.5 413.5H180";
export const number_4="M360.5 259H175.842C166.836 259 162.419 248.028 168.914 241.789L304 112V413";
export const number_3="M178 112H333.5V263M333.5 263H178M333.5 263V401.5C333.5 407.023 329.023 411.5 323.5 411.5H178";
export const number_2="M180 110H332.5V247C332.5 252.523 328.023 257 322.5 257H190C184.477 257 180 261.477 180 267V414H332.5";
export const number_1="M256 112V413";
```

  


接着就是在 Next.js 中完善 `GooeyMorph` 组件的功能：

  


```JavaScript
// components/GooeyMorph/index.js
"use client";
import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

// 导入数字路径
import { number_1, number_2, number_3, number_4, number_5 } from "./paths";

// 将数字路径存储在数组中
const numbers = [number_5, number_4, number_3, number_2, number_1];

const GooeyMorph = () => {
  // 状态：当前数字路径的索引
  const [index, setIndex] = useState(0);

  // 引用：圆圈元素和路径元素
  const circles = useRef([]);
  const paths = useRef([]);

  // 圆圈数量和半径
  const nbOfCircles = 40;
  const radius = 30;

  // 动画引用，用于清除定时器
  const animationRef = useRef(null);

  useEffect(() => {
    // 更新动画
    const update = () => {
      // 获取当前路径的总长度
      const length = paths.current[index].getTotalLength();
      // 计算每个圆圈移动的步长
      const step = length / nbOfCircles;

      // 遍历每个圆圈，并在路径上移动
      circles.current.forEach((circle, i) => {
        const { x, y } = paths.current[index].getPointAtLength(i * step);
        animate(
          circle,
          { cx: x, cy: y },
          { delay: i * 0.025, ease: "easeOut" }
        );
      });

      // 设置定时器，用于每2秒切换路径
      animationRef.current = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % numbers.length);
      }, 2000);
    };

    // 调用更新函数
    update();

    // 清除定时器
    return () => clearTimeout(animationRef.current);
  }, [index]);

  return (
    <main className="gooey">
      {/* SVG 元素，用于显示路径和圆圈 */}
      <svg viewBox="0 0 512 512" filter="url(#filter)" width="600">
        <defs>
          {/* SVG 滤镜 */}
          <filter id="filter">
            <feGaussianBlur in="SourceAlpha" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              // 修改矩阵值为转换为 #f36 的颜色
              values="1 0 0 0 0  0 0.214 0 0 0  0 0 0.214 0 0  0 0 0 25 -15"
              result="filter"
            />
            <feComposite in="SourceGraphic" in2="filter" operator="atop" />
          </filter>
        </defs>
        <g>
          {/* 渲染数字路径 */}
          {numbers.map((path, i) => (
            <path
              key={`p_${i}`}
              ref={(ref) => (paths.current[i] = ref)}
              d={path}
              style={{ display: i === index ? "block" : "none" }} // 仅显示当前路径
            />
          ))}
        </g>
        <g>
          {/* 渲染圆圈 */}
          {[...Array(nbOfCircles)].map((_, i) => (
            <circle
              key={`c_${i}`}
              ref={(ref) => (circles.current[i] = ref)}
              cx="256"
              cy="256"
              r={radius}
            />
          ))}
        </g>
      </svg>
    </main>
  );
};

export default GooeyMorph;
```

  


上面代码通过显示不同的数字路径，实现了路径的动态变换。与此同时，根据当前显示的数字路径，计算圆圈在路径上的位置，并通过动画让圆圈沿路径移动。并且通过 SVG 路径对图形进行处理，增加了视觉效果——粘稠的数字变换动效。


![fig-36.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9422ddee37e54be7967c5a6c69b3a9e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=688&s=3095928&e=gif&f=92&b=e5e9e9)
  


这个效果不仅仅可以用于数字变换上，你可以用于任意你想要的图形变换上，例如下面这个使用 MorphSVGPlugin 制作的粘稠字母变形的动效：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f63aa13a38e9408d8fb52b7fa1b433b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=540&s=469106&e=gif&f=35&b=c9fafc)

  


> Demo 地址：https://codepen.io/AlikinVV/full/Bxoyww （来源于：[@Valery Alikin](https://codepen.io/AlikinVV)）

  


## 小结

  


在 Next.js 应用中，SVG 可以以多种方式使用。一种常见的方式是将 SVG 文件作为静态资源导入，然后使用 Next.js 的 `Image` 组件引用。另一种方式是将 SVG 文件作为 React 组件导入，并像使用普通 React 组件一样使用。这种方法可以让 SVG 图像与应用的其他部分分离，使代码更具可读性和可维护性。导入 SVG 作为 React 组件时，可以直接在 JSX 中使用该组件，传递 props 控制 SVG 的样式和行为。这种方式适用于需要在 SVG 图像中添加交互或动态行为的情况。选择合适的方式取决于具体需求，但通常建议使用将 SVG 文件作为 React 组件导入的方式，以提高代码的可维护性和可读性。