SVG 在现代 Web 开发中扮演着不可或缺的角色。其矢量特性使得图像在不同的分辨率下保持清晰，而其可编辑性也使得 Web 开发者能够轻松对其进行修改和定制。然而，随着 Web 应用程序的日益复杂，管理和优化大量的 SVG 图像变得越来越具有挑战性。

在应对这一挑战的背景下，SVG 构建工具应运而生，为 Web 开发者们提供了自动化处理 SVG 图像的解决方案，从而提高了项目的效率和性能。


本课程将带领你深入探索 SVG 构建工具的世界。我们将一一探讨 SVGR、SVGO、Spritemap 等一系列优秀的 SVG 构建工具，并指导你如何在 Vite 构建的应用程序中巧妙应用它们。无论你是希望将 SVG 图像转换为 React 组件、优化 SVG 文件体积，还是将多个 SVG 合并为一个 SVG 精灵图，本课程都将为你提供详实的操作指南和实用技巧。


通过本课程的学习，你将掌握如何在实际项目中灵活运用这些工具，提升项目的开发效率和性能。让我们一起踏上 SVG 构建工具的探索之旅，开启 SVG 图像处理的新篇章！



## SVG 构建工具是什么？

我们应该从 SVG 构建和工具两个方面来解释 SVG 构建工具是什么。

通常情况之下，SVG 构建是指使用各种工具和技术来处理、优化和管理 SVG 图像的过程。在现代 Web 开发中，SVG 图像被广泛应用于网站设计、图标制作、数据可视化等方面。由于 SVG 具有矢量特性、可编辑性和可扩展性，因此它成为 Web 开发者们的首选之一。然而，随着 Web 应用程序的复杂性不断增加，管理和优化大量的 SVG 图像变得愈发重要，而 SVG 构建则成为了解决这一挑战的关键。

SVG 构建涵盖了一系列的工作，包括转换、优化、合并、模块化等。在 Web 开发过程中，我们可以通过一些工具来帮助我们完成 SVG 构建中的一系列任务。这两者结合起来，就是我们所说的 SVG 构建工具。

以下是一些常见的构建任务以及相应的工具。



### 转换

SVG 构建工具可以将 SVG 图像转换为其他格式，如 React 组件、Vue 组件等。这使得开发者可以更方便地在项目中引用和使用 SVG 图像，而无需手动处理转换过程。例如，SVGR 工具可以将 SVG 图像转换为可在 React 应用程序中直接使用的 React 组件。



### 优化

SVG 构建工具可以对 SVG 图像进行优化，以减小文件大小并提高加载性能。优化的过程包括删除不必要的元数据、压缩路径数据、移除不需要的空格等，从而实现更高效的图像传输和加载。例如，SVGO 工具可以对 SVG 文件进行优化，减小文件体积，提升页面加载速度。


### 合并

有些工具允许开发者将多个 SVG 图像合并成一个单一的 SVG Sprites（SVG 精灵），从而减少 HTTP 请求次数、提高页面加载速度。这对于大型项目中包含大量 SVG 图标的情况特别有用。例如，vite-plugin-svg-spritemap 插件可以将多个 SVG 图像合并为一个 SVG Sprites。


### 模块化与按需加载

一些 SVG 构建工具支持将 SVG 图像按需加载，以提高页面加载速度并减少不必要的资源请求。通过动态引入 SVG 图像，可以根据实际需要加载所需的图像，而不是一次性加载所有图像。例如，vite-plugin-svgr 插件可以按需将 SVG 图像转换为 React 组件，并在需要时动态加载。


通过上述功能，SVG 构建工具帮助开发者更方便地处理 SVG 图像，并提供了一套完整的解决方案，从而提高 Web 应用程序的质量和性能。在现代 Web 开发中，SVG 构建已经成为了不可或缺的一部分，它为开发者们提供了强大的工具和技术，使他们能够更好地应对日益复杂的 SVG 图像处理需求。





## SVG 构建工具的功能特点

SVG 构建工具的功能特点主要包括自动化处理、细粒度控制、可扩展性和跨平台支持。

-   **自动化处理**：SVG 构建工具能够自动化处理 SVG 图像，包括转换、优化、合并等操作，减少了 Web 开发者手动处理 SVG 的工作量。它将提高 Web 开发者的研发效率、降低出错的可能性，并使得整个工作流程更加流畅和高效。
-   **细粒度控制**：SVG 构建工具提供了丰富的配置选项，使 Web 开发者可以对 SVG 图像进行精细化控制。例如，Web 开发者可以根据项目需求调整优化参数、合并策略、模块化方式等，以满足不同的需求和场景。
-   **可扩展性**：SVG 构建工具支持插件化扩展，允许 Web 开发者根据项目需求灵活地添加新的功能和特性。Web 开发者还可以编写自定义插件，扩展工具的功能，满足特定的项目需求，提高工具的适用性和灵活性。
-   **跨平台支持**：SVG 构建工具通常支持在不同的开发环境和平台上使用，包括 Web 应用、桌面应用等。跨平台支持使得 Web 开发者可以在不同的开发环境中使用相同的工具和技术，提高了工作的灵活性和便捷性。

  


总的来说，SVG 构建工具的功能特点使得开发者能够更轻松地处理、优化和管理 SVG 图像，提高了项目的开发效率和性能，同时也为 Web 应用程序的视觉呈现和用户体验带来了更多的可能性。


## 如何在项目中使用 SVG 构建工具

接下来，我们以 Vite 构建的应用程序为例，向大家介绍一些常见的 SVG 构建工具如何在 Vite 应用程序中使用。

-   **[vite-awesome-svg-loader](https://github.com/matafokka/vite-awesome-svg-loader)** 和 **[vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader)**：这两个加载器可以帮助你在 Vite 应用程序中导入 SVG 文件，并将它们转换为 React 组件或 Vue 组件。你可以根据项目需求选择其中一个加载器使用。
-   **[vite-plugin-svgo](https://github.com/r3dDoX/vite-plugin-svgo)**：这个插件可以优化 SVG 文件，减小文件体积，提高加载速度。
-   **[vite-plugin-svg-spritemap](https://github.com/g-makarov/vite-plugin-svg-spritemap)** **或** **[vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons)**：这两个插件可以将多个 SVG 文件合并成一个 SVG Sprites（SVG 精灵），并自动生成相应的 CSS 样式。使用它可以减少 HTTP 请求，提高页面加载性能。
-   **[vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr)**：这个插件可以将 SVG 文件转换为 React 组件。

  


### 创建一个项目

首先，根据 Vite 官方文档创建一个适合你自己的项目。在这里我通过下面命令创建了一个 React 应用程序：


```
pnpm create vite
```


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a5236f1818b49cb9a68b73581f79b6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1910&h=460&s=111547&e=jpg&b=1e1e1e)

根据终端命令提示的操作，最终可以在你本地运行这个 React 应用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a49aa0fbc22940d597e437003b747ed4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3348&h=1756&s=219092&e=jpg&b=242424)



看到上面这样的界面，表示你的工程已创建成功。

为了能更好地向大家展示 SVG 构建工具的使用，需要为该项目准备一些 SVG 文件。在这里，我在项目的 `/src/assets/` 目录下新创建了一个 `icons` 目录，用于放置测试的 SVG 文件：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/487ccc626ccd46459f8ea43498c92e03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2872&h=1028&s=249868&e=jpg&b=302521)



注意，放置在 `icons` 目录下的测试文件不都是 SVG 图标，还有两个其他图形的 SVG 文件。





### 如何在 React 应用程序中导入 SVG

React 应用运行起来了，SVG 文件也准备好了！接下来，让我们看看有哪些方法可以将 SVG 导入到 React 应用程序！

回顾一下，我们在《[初级篇：如何使用 SVG](https://juejin.cn/book/7341630791099383835/section/7344089098363076620)》中介绍了将 SVG 应用到 Web 上的多种姿势。其中，使用 `<img>` 标签导入 SVG 是使用 SVG 的最简单的方法之一。如果你使用 Vite 初始化你的 React 应用程序，你可以在 `<img>` 的 `src` 属性中导入 SVG 文件，因为它原生支持它。


```JSX
// App.jsx
import woman from "./assets/icons/woman.svg?recat";

function App() {
    return (
        <>
            <img src={woman} alt="Woman" />
        </>
    );
}

export default App;
```


此时，`woman.svg` 正常地在浏览器中呈现：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b17e33798314a48b85ca7723ead1271~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3352&h=1962&s=389006&e=jpg&b=242424)

请注意：虽然这种方法很简单，但它有一个明显的的缺点，你无法对导入的 SVG 进行样式化处理。因此，它适用于不需要自定义样式的 SVG，比如网站的 Logo。

有的时候，我们可能会将 SVG 作为元素的背景图片呈现在 Web 上。通常通过 CSS 的 `background-image` 来引用作为背景的 SVG 文件：

```CSS
/* App.css */
.app {
    background: url('./assets/icons//bg.svg') no-repeat left top / cover;
}
```


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cfaf4b6f1da46efa2dd91a6dd0b35d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1676&h=896&s=2421201&e=gif&f=56&b=1f1f1f)


正如你所看到的，`bg.svg` 已经应用到了 `.app` 元素上，并且在能在浏览器中查看到效果（上图中流动的线条）。这种方式与 `<img>` 一样，我们是无法直接对 `bg.svg` 做任何调整的，比如调整其动画效果。

如果我们希望在 React 应用程序中可以对导入的 SVG 进行操作，例如样式化处理 SVG，那么可以考虑内联的方式将 SVG 导入 React 应用程序。这种方法之所以可行，是因为 SVG 是 XML 格式，就像 HTML 一样。不过，与直接将 SVG 内联到 HTML 文档有所不同，在这里我们需要以 JSX 的语法格式将 SVG 导入 React 应用程序。这意味着，你需要先通过相关的工具，将 SVG 的 XML 格式转换为 JSX 语法格式，例如 [svg2jsx](https://svg2jsx.com/)：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61af4bda22764abdb6bac1209c40c9b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3358&h=1784&s=299019&e=jpg&b=0e0e0e)



> URL：https://svg2jsx.com/


将编译好的代码放到你想放置的位置，例如：

```JSX
// App.jsx
function App() {
    return (
        <>
            <div className="app">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4h87c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3l42.4-84.9 1.7 3.4c9.5 19 28.9 31 50.1 31h104.5c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240h-132c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8-51-113.9c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9H16c-2.6 0-5 .4-7.3 1.1-5.7-16-8.7-33-8.7-50.3v-5.8c0-69.9 50.5-129.5 119.4-141 45.6-7.6 92 7.3 124.6 39.9l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9 68.9 11.5 119.4 71.1 119.4 141v5.8c0 16.9-2.8 33.5-8.3 49.1z"></path>
                </svg>
            </div>
        </>
    );
}

export default App;
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c91baa3f3402459788b17a2232e294a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3356&h=1958&s=285378&e=jpg&b=0f0f0f)


内联 SVG 的优势在于我们可以直接在其元素上使用属性或在 CSS 中对其进行样式化处理：


```CSS
/* App.css */
.app {
    background: url('./assets/icons//bg.svg') no-repeat left top / cover;

    svg {
        display: block;
        width: 10vw;
        aspect-ratio: 1;
        fill: red;
        transition: all .2s linear;
    
        &:hover {
            fill: lime;
        }
    }
}
```


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5b46911c5a04e9782eb3a298d7d6f13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=668&s=2867632&e=gif&f=63&b=1f1f1f)

正如你所看到的，这种方式我们需要将 SVG 转换为 JSX。如果不通过诸如 svg2jsx 工具，除了工作量大之外，还很可能出错。庆幸的是，我们可以使用 [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) 构建工具帮助我们做这些苦力活。



### 使用 svgr 将 SVG 转换为 React 组件

既然如此，我们来看看如何在 Vite 构建的 React 应用程序中使用 [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) 构建工具。

首先，它在底层使用 [svgr](https://react-svgr.com/) 会将 SVG 转换为 React 组件。在使用该插件，需要先在项目中安装它：


```
pnpm install --save-dev  vite-plugin-svgr 
```


接下来，在应用的 `vite.config.js` 中添加插件：

```JavaScript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 

export default defineConfig({
    plugins: [
        svgr(),
        react()
    ],
})
```


现在，你可以将 SVG 文件作为 React 组件导入：

```JSX
// App.jsx

import  Eye from "./assets/icons/eye.svg?react"
import './App.css'

function App() {
    return (
        <>
            <div className="app">
                <Eye />
            </div>
        </>
    );
}

export default App;
```


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/807fbf2e0e5f4d1695c1cb2b77eb1b13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3344&h=1962&s=347445&e=jpg&b=fffefe)


眼睛这个图标将会在浏览器中呈现。

我们把上面示例中的 `eye.svg` 替换成更为复杂的一个 SVG 文件，比如 `woman.svg`：


```JSX
import Woman from "./assets/icons/woman.svg?react"
import './App.css'

function App() {
    return (
        <>
            <div className="app">
                <Woman />
            </div>
        </>
    );
}

export default App;
```


该图标同样会在浏览器中正常呈现，但是你使用浏览器开发者工具审查该 SVG 时，你会发现该 SVG 有很多冗余数据并没有删除：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c16db10142443eb96f803d224ee3a94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3354&h=1962&s=1017493&e=jpg&b=fefcfc)


这是因为，项目中的 `woman.svg` 文件并没有做过任何优化。当然，[我们可以根据上节课的内容来对 SVG 进行优化](https://juejin.cn/book/7341630791099383835/section/7368114202180845605)，但我们这里既然探讨 SVG 构建工具，还是希望将优化的事情也交给相应的 SVG 构建工具来完成。



### 优化 SVG 代码

在这里，我使用的是 vite-plugin-svgr 自带的 `"@svgr/plugin-svgo"` 插件。同样的，先安装该插件：


```
pnpm install --save-dev @svgr/plugin-svgo
```


并在 `vite.config.js` 配置 `@svgr/plugin-svgo`，你可以在项目中启用 SVGO 插件，自动优化 SVG 文件的大小和性能，从而提高 Web 应用程序的加载速度和用户体验。根据项目需求，[灵活配置 SVGO 插件](https://github.com/svg/svgo)，可以进一步提升 SVG 文件的优化效果。


```JavaScript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions:{
        plugins: ["@svgr/plugin-svgo","@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            {
              name: "removeViewBox",
              active: false,
            },
            {
              name: "addAttributesToSVGElement", 
              params: {
                attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
              },
            },
            {
              name: "removeDimensions", // 移除宽度和高度属性
              active: true,
            },
            {
              name: "convertColors", // 转换颜色为短格式
              params: {
                currentColor: true,
              },
            },
            {
              name: "removeDoctype",
              active: true,
            },
            {
              name: "removeMetadata",
              active: true,
            },
            {
              name: "removeDimensions",
              active: true,
            },
            {
              name: "removeComments",
              active: true,
            },
            {
              name: "removeEditorsNSData",
              active: true,
            },
    
            {
              name: "removeRasterImages",
              active: true,
            },
            {
              name: "removeUselessDefs",
              active: true,
            },
            {
              name: "removeUnknownsAndDefaults",
              active: true,
            },
            {
              name: "removeUselessStrokeAndFill",
              active: true,
            },
            {
              name: "removeHiddenElems",
              active: true,
            },
            {
              name: "removeEmptyText",
              active: true,
            },
            {
              name: "removeEmptyAttrs",
              active: true,
            },
            {
              name: "removeEmptyContainers",
              active: true,
            },
            {
              name: "removeUnusedNS",
              active: true,
            },
            {
              name: "removeDesc",
              active: true,
            },
            {
              name: "prefixIds",
              active: true,
            },
            {
              name: "removeXlink",
              active: true,
            },
            {
              name: "removeXMLNS",
              active: true,
            },
            {
              name: "removeXMLProcInst",
              active: true,
            },
            {
              name: "minifyStyles",
              active: true,
            },
            {
              name: "sortAttrs",
              active: true,
            },
            {
              name: "sortDefsChildren",
              active: true,
            },
    
            {
              name: "preset-default",
              active: true,
            },
            {
              name: "removeUselessStrokeAndFill",
              active: true,
            },
            {
              name: "convertPathData",
              active: true,
            },
            {
              name: "convertStyleToAttrs",
              active: true,
            },
            {
              name: "cleanupAttrs",
              active: true,
            },
            {
              name: "cleanupEnableBackground",
              active: true,
            },
            {
              name: "collapseGroups",
              active: true,
            },
            {
              name: "convertShapeToPath",
              active: true,
            },
            {
              name: "convertStyleToAttrs",
              active: true,
            },
            {
              name: "mergePaths",
              active: true,
            },
            {
              name: "moveElemsAttrsToGroup",
              active: true,
            },
  
          ]
        },
      }
    }),
    react(),
  ],
});
```


注意，在这里同时开启了 svgr 的 `@svgr/plugin-jsx` 插件。它可以将 SVG 文件解析为 JSX 语法，使得 SVG 文件可以直接在 React 项目中以组件的形式使用。这个插件为 Web 开发者提供了一种便捷的方式，将矢量图嵌入到 React 应用中，并且可以利用 React 的属性系统对 SVG 进行灵活的控制和操作。如此一来，我们无需手动或借助 svg2jsx 这样的工具将 SVG 转换为 JSX 语法格式，然后再用于 React 应用中。正如前面所述，我们将这些苦力活交给 SVG 构建工具来做，高效且不易于出错。

这个时候，你使用浏览器开发者工具再次审查 `Woman` 时，你会发现，SVG 代码已经变得非常干净：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/025de594c2784b14bc3a84bd47700a0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3350&h=1958&s=1543966&e=jpg&b=eff7f9)


除了使用 svgr 的 `@svgr/plugin-svgo` 插件之外，你还可以使用 [vite-plugin-svgo](https://github.com/r3dDoX/vite-plugin-svgo) 插件来减小 SVG 文件大小，提高性能。该插件的使用方式与 `@svgr/plugin-svgo` 相似，这里就不再做重复性的阐述，[感兴趣的小伙伴可以根据它的官方文档进行配置](https://github.com/r3dDoX/vite-plugin-svgo)。



### 创建 SVG 雪碧图（SVG 精灵）

大家是否还记得，小册有一篇关于 SVG 雪碧图的实战课程，即《[实战篇：使用 SVG 创建自己的图标系统](https://juejin.cn/book/7341630791099383835/section/7351368000697532427)》。在这节课中，我们一起探讨了如何使用 Glup 构建工具来创建属于自己的图标系统，即创建 SVG 雪碧图，高效重复使用 SVG 图标。

在 Vite 构建的 React 项目中，我们可以使用诸如 [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons) 插件来制作 SVG 雪碧图。这是一个非常有用的 Vite 插件，可以将多个 SVG 文件合并成一个 SVG 雪碧图（SVG 精灵，俗称 SVG Sprite），从而减少 HTTP 请求，并提高页面加载速度。

与使用其他插件相似，首先需要在工程中安装 `vite-plugin-svg-icons`：


```
pnpm install -D vite-plugin-svg-icons
```


接着，在 Vite 配置文件（`vite.config.js`）中，引入并配置 `vite-plugin-svg-icons` 插件：

```JavaScript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: 'icon-[dir]-[name]',
    }),
  ],
});
```


然后在 `src/main.jsx` 中引入下面这行代码，这个很重要：

```JSX
import ids from 'virtual:svg-icons-names'
```


接着可以创建一个 `SvgIcon` 组件：

```JSX
// src/components/SvgIcon/index.jsx
export default function SvgIcon({
    name,
    prefix = "icon",
    color = "#333",
    ...props
}) {
    const symbolId = `#${prefix}-${name}`;

    return (
        <svg {...props} aria-hidden="true">
            <use href={symbolId} fill={color} />
        </svg>
    );
}
```


这样，你就可以在需要运用图标的地方使用 `SvgIcon` 组件：

```
//App.jsx
import Woman from "./assets/icons/woman.svg?react";
import SvgIcon from "./components/SvgIcon";
import "./App.css";

function App() {
    return (
        <>
            <div className="app">
                <SvgIcon name="eye" />
                <SvgIcon name="folder" color="red" />
                <SvgIcon name="heart" color="lime" />
                <Woman />
            </div>
        </>
    );
}

export default App;
```



你在浏览器中看到的效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e2353047f2442e394594269a86bd963~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3358&h=1966&s=764374&e=jpg&b=fffefe)




### React 应用程序中使用 SVG 的不同方式

正如《[初级篇：如何使用 SVG](https://juejin.cn/book/7341630791099383835/section/7344089098363076620)》课程中所述，SVG 不仅仅可以以 `.svg` 被 `<img>` 的 `src` 或 `background-image` 、`mask-image` 等属性引用以及局限于内联使用。它还可以以其他格式用于 Web ，比如 Data URI、Base64 等。

其中，[vite-awesome-svg-loader](https://github.com/matafokka/vite-awesome-svg-loader) 和 [vite-svg-loader ](https://github.com/jpkleemans/vite-svg-loader)等构建工具可以允许我们以不同的方式将 SVG 应用于 React 应用中，例如，SVG 源码方式、静态资源的 URL、Data URI 和 Base64 等。甚至，它们也具备 SVGO 和创建 SVG 雪碧图的能力。

以 vite-awesome-svg-loader 为例，通过配置和使用 vite-awesome-svg-loader 插件，你可以在 Vite React 项目中更方便地管理和优化 SVG 文件。这个插件提供了多种导入选项和配置项，使你能够根据项目需求灵活地处理 SVG 图像，提高开发效率和项目性能。

同样地，要在 Vite React 项目中使用 vite-awesome-svg-loader 插件，你得先安装它：


```
pnpm i -D  vite-awesome-svg-loader
```


接着在 Vite 配置文件（`vite.config.js`）中对它进行配置：

```JavaScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {viteAwesomeSvgLoader} from 'vite-awesome-svg-loader';

export default defineConfig({
  plugins: [
    react(),
    viteAwesomeSvgLoader({
      // 设置默认导入类型，默认值为 "source"
      // 可选值：
      // source - 加载 SVG 源代码
      // url - 加载指向 SVG 文件的 URL，加载器会为你生成该文件
      // source-data-uri - 将源代码放入数据 URI
      // base64 - 将 SVG 源代码编码为 base64
      // base64-data-uri - 将 base64 源代码放入数据 URI
      defaultImport: "source",

      // 保留线宽的文件或目录列表
      preserveLineWidthList: [/config-demo/preserve-line-width//, /config-demo/all//],

      // 保留颜色的文件或目录列表
      setCurrentColorList: [/config-demo/set-current-color//, /config-demo/all//],

      // 跳过转换的文件列表，每个目录中都有 skip-transforms.svg 文件
      skipTransformsList: [/skip-transforms.svg/],

      // 跳过加载的文件列表，每个目录中都有 skip-loading.svg 文件
      skipFilesList: [/skip-loading.svg/],
    }),
  ],
});
```

  


配置完成后，你可以在 React 组件中轻松地使用 SVG。例如：

```JSX
import {SvgImage, SvgIcon} from "vite-awesome-svg-loader/react-integration";

import imageSrc from "@/path/to/image.svg";

export function MyComponent() {
    return (
        <div class="main">
            <SvgImage src={imageSrc} />
    
            <SvgIcon
                src={imageSrc}
                size="24px"
                color="red"
                colorTransition="0.3s ease-out"
            />
        </div>
    )
}
```


有关于 vite-awesome-svg-loader 更详细的介绍，[请参阅官方文档](https://github.com/matafokka/vite-awesome-svg-loader)。

这里所展示的仅仅是 SVG 构建工具中比较常用到的几个功能，与上面提到的插件功能相似的还有很多，这里就不一一展开。其实，不管你基于任何框架开发 Web 应用程序，都有相似的版本，你可以根据自己项目需求来适当调整，而且很多插件，它都同时具备多个功能，例如 svgr，它具备将 SVG 转换 React 组件、SVGO 优化，SVG 转换为 JSX 等。vite-plugin-svg-icons 插件，它除了能将多个 SVG 文件合并成一个 SVG 精灵之外，也具备 SVGO 相关的能力。因此，大家要使用的时候，需要注意不同插件相同功能之间的冲突。

  


## 小结

这节课我们主要探讨了 SVG 构建工具是什么以及为什么需要构建工具，并且通过一个 Vite 构建 React 应用为例，一步一步往应用程序中添加不同的 SVG 构建工具，进一步了解 SVG 工具是如何帮助自动化处理一些事情。

当然，除了使用开源的 SVG 构建工具之外，你也可以根据自己需要创建属于自己的 SVG 构建工具。这里就不深入展开了，感兴趣的可以看看相关插件编写的文档。