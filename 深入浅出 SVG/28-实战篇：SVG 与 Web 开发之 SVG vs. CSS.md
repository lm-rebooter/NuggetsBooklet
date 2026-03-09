![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/956b5e755a074c00aaf718282a2e0a8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=600&s=2484564&e=gif&f=60&b=190c25)


在这个视觉体验至上的互联网时代，图形元素不仅是 Web 设计的核心组成部分，还承载着传达信息、塑造品牌个性、提升用户体验的重要任务。随着 HTML5 标准的普及，SVG 作为一种矢量图形格式逐渐成为 Web 开发者的利器，以其独特的魅力挑战着传统位图图像在 Web 设计领域的地位。当 SVG 遇上 CSS，一场关于图形表达与样式风格控制的精彩对话便悄然展开。这便是我们这节课的主题——《SVG 与 Web 开发之 SVG vs. CSS》!

当这两者相遇，技术与创意的碰撞是不可避免的。在这节课中，我们旨在深入探讨两者如何协同工作，既对比它们各自的优势，也揭示它们如何互补不足。我们将探索如何运用 CSS 的强大功能为 SVG 图形添加色彩、实现动画效果、控制图形变换，乃至利用 SVG 和 CSS 的先进特性，如滤镜、剪切和遮罩，进一步提升 Web 页面的视觉表现力，为用户提供更好的体验。

接下来的旅程并不仅是一次技术之旅，更是一次设计思维的拓展。我们不仅会讲解理论，还会通过实战案例，展示如何解决实际开发中的难题，如何高效地将 SVG 与 CSS 结合起来，创造出既美观又实用的 Web UI。无论你是 Web 前端开发者、UI 设计师，还是对 Web 图形技术充满好奇的学习者，这节课的内容都将为你打开一扇通往高质感 Web 设计的大门。


让我们一起踏上这段旅程，见证 SVG 与 CSS 如何携手，在 Web 开发的舞台上共舞，创作出既具艺术美感又充满技术智慧的 Web 作品。

准备好了吗？让我们开始吧！

  


## 为什么 SVG 和 CSS 是绝配？


SVG 和 CSS 在现代 Web 开发中扮演着关键角色，它们的结合被普遍视为理想的组合，为 Web 设计带来了广泛的创造性和灵活性。SVG 作为一种灵活、可扩展的图像格式，提供了高品质、可缩放且不失真的图形展示与绘制能力。而 CSS 则是 Web 设计的精髓，赋予 Web 页面丰富的样式和效果，让设计师得以实现各种视觉上的想象。

尽管 SVG 和 CSS 属于不同的技术体系，但它们并非对立关系，而是相辅相成。它们各自拥有独特的优势，同时在某些方面也相互补充，甚至互相依赖。两者共同推动了 Web 页面的视觉表现和功能性的提升，为用户提供了更加优质的浏览体验。

  


### SVG 和 CSS：你中有我，我中有你

熟悉 CSS 特性的发展历程，你会发现其中一些特性源自 SVG 的功能，例如绘图特性、渐变、滤镜、混合模式、动画、变换以及剪切和遮罩等。随着技术的不断革新，CSS 和 SVG 的特性可以相互结合，例如剪切、遮罩和滤镜等效果，SVG 可以直接提供给 CSS 使用。同时，CSS 也能够直接控制 SVG 元素的样式和动画效果，实现更丰富的视觉效果和交互体验。


可以说，两者相辅相成，彼此之间有着相似之处和不同之处。

相似之处包括：

-   **样式控制**：SVG 和 CSS 都涉及样式控制，只是范围和重点不同。SVG 内部可以通过属性直接定义图形元素的样式，类似于内联 CSS。CSS 则可以用来控制整个网页或 SVG 元素的外观。
-   **动画能力**：SVG 和 CSS 都支持动画效果。CSS 引入了关键帧动画（`animation`）和过渡效果（`transition`），而 SVG 自身也有一套动画机制，如 `<animate>` 和 `<animateTransform>` 标签。
-   **响应式设计**：两者都支持响应式设计理念。SVG 由于其矢量性质，适合各种屏幕尺寸，而 CSS 提供了媒体查询等工具来实现界面的自适应布局。
-   **可编程性**：SVG 和 CSS 都可以通过 JavaScript 进行动态操作，增加互动性。

  


两者的不同之处包括：

-   **本质与用途**：CSS 是一种样式表语言，专注于定义网页元素的布局和外观。而 SVG 是一种图像格式，用于定义可缩放的矢量图形。
-   **结构与语法**：CSS 使用选择器和属性-值对设置样式。SVG 通过 XML 标签和属性直接描述图形元素。
-   **图形处理能力**：SVG 在处理复杂图形、图标和数据可视化方面具有明显优势，而 CSS 更适合控制网页元素的布局和外观。
-   **性能考量**：SVG 在高分辨率显示上能显著减少加载时间和带宽消耗，但对于非常大的文件，解析和渲染可能会消耗更多资源。CSS 对性能的影响较小，但在优化不当时可能导致页面滚动或动画卡顿。
-   **动画实现方式**：CSS 动画通过修改元素样式属性实现，简单易用。SVG 动画则直接操作图形属性，适合更复杂的图形变换和交互。

  


除了上述的基本对比之外，我们还可以从更细致的角度探讨 SVG 和 CSS 在实际应用中的几个关键对比点：

-   **交互性**：SVG 提供了极高的交互性潜力。作为 DOM 的一部分，每个 SVG 元素都可以通过 JavaScript 进行访问和操控。这意味着可以为每一个图形元素添加事件监听器（如点击、鼠标悬停等），从而实现丰富的用户交互体验。这种能力使得 SVG 在创建动态图表、地图以及游戏等应用场景中非常有用。CSS 虽然也能通过伪类（如 `:hover`, `:active`）实现一些基本的交互反馈，但它更多地集中在视觉样式的变化上，而非直接的逻辑交互处理。复杂的用户交互逻辑通常由 JavaScript 来完成。
-   **可维护性和可扩展性**：SVG 图像具有良好的可维护性和可扩展性。由于 SVG 是基于文本的 XML 格式，设计师和开发者可以轻松编辑图形的源代码，增删改图形元素，甚至使用版本控制系统管理图形的变化。此外，SVG 元素可以重复利用，一个复杂的图形可以拆分成多个组件，在不同地方重用。CSS 在页面布局和样式一致性维护方面表现出色。通过 CSS 预处理器、模块化和继承等技术，开发者可以轻松地维护和扩展样式规则，确保网站风格统一且易于调整。然而，对于复杂的矢量图形细节控制，CSS 的直接控制能力较弱。
-   **兼容性**：现代浏览器普遍良好支持 SVG 和 CSS。不过，对于一些复杂的 SVG 特性和 CSS 新特性（如滤镜效果、动画等），老版本浏览器可能支持不完全。开发者需要考虑目标用户的浏览器环境，以决定使用的技术深度。

  


尽管 SVG 和 CSS 有许多相交之处，但它们的核心价值和应用场景存在本质区别。理解它们各自的强项并合理搭配使用，是提升 Web 开发效率和用户体验的关键。例如，在设计复杂的用户界面时，可以利用 SVG 创造清晰细腻的图形元素，再通过 CSS 控制布局和样式，结合 JavaScript 实现交互逻辑，三者协同工作，共同构建高质量的 Web 产品。接下来的内容将进一步印证这一观点。



### 增强视觉吸引力和设计的灵活性

SVG 与 CSS 的协同作用不仅在技术层面上显得优势突出，更极大地增强了 Web 项目的视觉吸引力和设计灵活性。这一强大的组合为 Web 设计师开启了无限的创意可能，让他们能够实现复杂的设计和动画效果，这些效果在使用传统位图格式时是难以甚至无法达成的。

SVG 的矢量特性确保了图形在任何尺寸下都能保持清晰和像素完美的状态，从最小的图标到全屏背景图像皆如此。这种清晰度对于创建能够吸引用户注意力并传达专业性的视觉震撼网站至关重要。

当 CSS 应用于 SVG 时，它解锁了美学定制的新维度，包括：

-   **动态样式**：根据用户交互或站点主题改变颜色、边框、填充等。
-   **复杂动画**：创建响应用户输入的吸引人动画，增强网站的交互性。
-   **自适应设计**：调整 SVG 的视觉元素以匹配不同的屏幕尺寸、方向或分辨率。

这两者的结合不仅提高了设计和开发的效率，还为用户提供了更丰富的视觉和交互体验。

比如下面这个按钮效果，就是 SVG 和 CSS 相互结合的典型案例：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0e75ffd36464395bd0edc708dd13958~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1294&h=560&s=369671&e=gif&f=117&b=040404)


> Demo 地址：https://codepen.io/airen/full/KKLVzbL


正如你所看到的，按钮在三个状态具有不同的形状：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c94a06fef204f6888998bf8ad63b775~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1031&s=193513&e=jpg&b=1e8f93)

仅使用 CSS 自身能力要绘制矩形，很容易。因为在 CSS 中，任何元素默认就是一个矩形框，但要在悬停状态（`:hover`）和激活状态（`:active`）将矩形分别变成凸出和凹进的形状，就显得非常的吃力。在绘制图形方面，SVG 具有绝对强的优势，使用 SVG 的 `<path>` 元素，非常容易绘制出按钮所需的三种形状：


```XML
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <!-- default -->
    <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0 z" />
  
    <!-- hover -->
    <path d="M0,0 C0,-5 100,-5 100,0 C105,0 105,100 100,100 C100,105 0,105 0,100 C-5,100 -5,0 0,0 z" />
  
    <!-- active -->
    <path d="M0,0 C30,10 70,10 100,0 C95,30 95,70 100,100 C70,90 30,90 0,100 C5,70 5,30 0,0 z" />
</svg>
```

  


也就是说，我们将两者结合起来，各自发挥其自身的优势，制作该按钮效果就变得轻而易举。


```HTML
<button class="button">
    <svg class="button__shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="button__path" d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0 z"/>
    </svg>
    <span class="button__content">CSS & SVG</span>
</button>
```



我们直接将 SVG 嵌套在 `<button>` 元素中，将其作为按钮的背景，然后通过 CSS 的 `:hover` 和 `:active` 选择器改变 `<path>` 元素的 `d` 属性的值：

```CSS
.button {
    background: transparent;
    
    .button__shape {
        overflow: visible;
    }
    
    &:hover {
        .button__path {
            d: path(
              "M0,0 C0,-5 100,-5 100,0 C105,0 105,100 100,100 C100,105 0,105 0,100 C-5,100 -5,0 0,0 z"
            );
        }
    }
    
    &:active {
        .button__path {
            d: path(
              "M0,0 C30,10 70,10 100,0 C95,30 95,70 100,100 C70,90 30,90 0,100 C5,70 5,30 0,0 z"
            );
        }
    }
}
```


这里有一个小细节需要知道，默认情况下，`<svg>` 元素（`.button__shape`）的 `overflow` 属性的值为 `hidden` ，所有溢出 `viewBox` 的图形都会被剪裁掉。为了避免在 `:hover` 和 `:active` 状态下，SVG 图形不被裁剪掉，需要将 `overflow` 重置为 `visible` 。

另外，按钮的颜色可能会随着不同的主题发生变化，为了便于随时调整按钮的背景颜色（即图形颜色），我们可以在 CSS 中将 `<path>` 元素的 `fill` 属性设置所需的颜色即可。在这里我利用了 CSS 自定义属性特性，将其定义为 `--background-color` 。这样做的好处是，除了易于维护之外，我们可以随时调整图形颜色：

```CSS
.button {
    --background-color: #ff5722;
    
    .button__shape {
        fill: var(--background-color);
        transition:fill .2s ease-in-out,
    }
    
    &:hover {
        --background-color: #be390f;
    }
    
    &:active {
        --background-color: #8d2706;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4a65788d9b24ff882a1cee7ccf84697~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=600&s=315197&e=gif&f=85&b=030303)


为了避免按钮在样式发生变化时，效果显得比较生硬，还可以使用 CSS 的 `transition` 特性，为按钮添加过渡动画效果：

```CSS
.button {
    --background-color: #ff5722;
    --button-motion-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
    --button-motion-duration: 0s;
    --button-scale-up: 1.05;
    --button-scale-down: 0.95;
    
    background: transparent;
    transition: filter var(--button-motion-duration) var(--button-motion-ease);
    
    .button__content {
        transition: scale var(--button-motion-duration) var(--button-motion-ease);
    }
    
    .button__shape { 
        fill: var(--background-color);
        overflow: visible;
        transition:fill .2s ease-in-out, scale var(--button-motion-duration) var(--button-motion-ease);
    }
    
    .button__path {
        transition: d var(--button-motion-duration) var(--button-motion-ease);
    }
    
    &:hover {
        --background-color: #be390f;
        filter: brightness(1.1);
      
        :is(.button__content, .button__shape) {
            scale:var(--button-scale-up);
        }

        .button__path {
            d: path("M0,0 C0,-5 100,-5 100,0 C105,0 105,100 100,100 C100,105 0,105 0,100 C-5,100 -5,0 0,0 z");
        }
    }
    
    &:active {
        --background-color: #8d2706;
        filter: brightness(0.9);
      
        :is(.button__content, .button__shape) {
            scale:var(--button-scale-down);
        }

        .button__path {
            d: path("M0,0 C30,10 70,10 100,0 C95,30 95,70 100,100 C70,90 30,90 0,100 C5,70 5,30 0,0 z");
        }
    }
}
```



上面所展示的只是案例所需的关键代码，[详细源码请点击这里阅读](https://codepen.io/airen/full/KKLVzbL)。

如果某一天，Web 设计师不需要这种图形效果的按钮了，需要其他的效果，只需调整 SVG 的 `<path>` 元素的 `d` 属性即可。要是你精通 `<path>` 元素的命令，你可能徒手通过命令硬编码实现所需图形；即使你在这方面的知识比较欠缺，也可以通过诸如 Figma 设计软件辅助你获得所需图形。从这一点而言，SVG 的注入，给设计带来无限的可能！

其次，你可以尝试着调整按钮的文本内容，你会发现，它的可适配性已超出你的想象：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740c8bc784704de5b39554c3a3fcfa1a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1194&h=596&s=2447590&e=gif&f=372&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/PovZzwy

  


再来看一个图形填充文本相关的示例。

在 CSS 中，通常是使用 `background-clip: text` 来创建图形填充文本的效果。例如，像下面这个渐变颜色填充文本的效果：

```HTML
<h1>CSS & SVG Awesome!</h1>
```

  


```CSS
h1 {
    font-size: 20vh;
    background: linear-gradient(to right, #09acef,#cef90a);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d3aeaf195d246549b55c9d3cebaa895~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=859&s=236628&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/YzbwpJx


在 SVG 中，我们可以通过 `<linearGradient>` 和 `<text>` 实现一个类似的渐变填充文本的效果：

```XML
<svg viewBox="0 0 800 200" width="100%" height="100%">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0" stop-color="#09acef" />
            <stop offset="1" stop-color="#cef90a" />
        </linearGradient>
    </defs>
    <text x="50%" y="50%" text-anchor="middle" fill="url(#gradient)" font-size="95">SVG Gradient Text</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/666f31a647834f6bbebaaf146af246e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=859&s=346150&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/gOJPLQe

除此之外，我们可以结合 CSS 和 SVG 的滤镜，将 SVG 滤镜效果应用到文本上。创建类似文本被撕裂的效果：

```HTML
<h1>CSS & SVG Awesome!</h1>
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <feTurbulence type="turbulence" baseFrequency="0.002 0.008" numOctaves="2" seed="2" stitchTiles="stitch" result="turbulence" />
            <feColorMatrix type="saturate" values="30" in="turbulence" result="colormatrix" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
                                                 0 1 0 0 0
                                                 0 0 1 0 0
                                                 0 0 0 150 -15" in="colormatrix" result="colormatrix1" />
            <feComposite in="SourceGraphic" in2="colormatrix1" operator="in" result="composite" />
            <feDisplacementMap in="SourceGraphic" in2="colormatrix1" scale="15" xChannelSelector="R" yChannelSelector="A" result="displacementMap" />
        </filter>
    </defs>
</svg>
```

  


```
h1 {
    background: linear-gradient(to right, #09acef,#cef90a);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    filter: url(#filter);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78efe5f75b4a40f790c25e1117053d92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=643&s=348006&e=jpg&b=7b15b6)


> Demo 地址：https://codepen.io/airen/full/VwOemRz

直到目前，仅使用 CSS 要实现类似的文本效果是不太现实的，一旦将 SVG 的能力注入进来，一切皆有可能：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/235a3064cffd447189ca5c8fc4e4aeb5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1196&s=1306433&e=jpg&b=d6c3be)


> Demo 地址：https://codepen.io/collection/ArxmyO

  


### 创造沉浸式的用户体验

SVG 与 CSS 的结合不仅使 Web 界面更加美观，还能营造出更加沉浸式的用户体验。通过在 SVG 元素上应用 CSS 动画和过渡效果，Web 开发者能够创建丰富的互动功能，吸引用户并鼓励他们进一步探索内容。这些互动效果可以从简单的悬停变化到复杂的动画，不一而足。

例如，下面这两个由[ @Jhey](https://twitter.com/intent/follow) 提供的悬停效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7586679152d64273aad8516d3c6583d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=456&s=179727&e=gif&f=114&b=f3f3f3)

  


> Demo 地址：https://codepen.io/jh3y/full/wvNpQJe

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51cd6146d42b40fa99aa169df7b65300~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=468&s=149697&e=gif&f=78&b=ebcaf9)


> Demo 地址：https://codepen.io/jh3y/full/LYaWoRB


我们这里简单地分析一下上面这个按钮的悬停动效是如何实现的。

实现原理非常简单，按钮默认状态下，`</>` 图形是由 SVG 的三个 `<path>` 绘制而成：


```XML
<svg viewBox="0 0 24 24" fill="none">
    <path d="M6.75 17.25L1.5 12L6.75 6.75" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 4 L12 20" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17.25 6.75L22.5 12L17.25 17.25" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa2d571312a4c828280a2457fec5199~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1196&s=108346&e=jpg&b=ffffff)

当用户鼠标悬停在按钮上时，第一个 `<path>` （即 `<`）和第三个 `<path>` （即 `>`）会移出按钮可视区域，而第二个 `<path>` （即 `|`）由竖线变成横线。这些变换效果，我们可以通过 CSS 的变换来实现。


```HTML
<main>
    <button class="button">
        <span class="text">Get Code</span>
        <span class="container">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M6.75 17.25L1.5 12L6.75 6.75"  />
                <path d="M12 4 L12 20"  />
                <path d="M17.25 6.75L22.5 12L17.25 17.25"  />
            </svg>
        </span>
    </button>
</main>
```


注意，为了使 SVG 代码变得更干净些，我将设置 `<path>` 元素样式的相关属性移入到 CSS 中：

```CSS
.button {
    path {
        stroke: black;
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-linejoin: round
    }
}
```


接下来，使用 CSS 来给按钮添加样式，基本样式相关的代码就不在这里展示了。这里仅展示与 SVG 和交互动相关的 CSS 代码：


```CSS
.button {
    /* 基本样式省略 */
    position: relative;
    
    svg {
        overflow: visible;
        width: 24px;
    }
}
```


为了使溢出 SVG 视图的图形不被剪切掉，需要确保它的 `overflow` 属性为 `visible`。接着就是该示例最为关键的 CSS 代码，主要设置 `<path>` 元素的样式：

```CSS
:root {
    --accent: 280;
    --speed: 0.25;
    --transition: calc(var(--speed) * 1s);
    --timing: ease-out;
}

.button {
    path {
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: currentColor;
        stroke-width: 4;
        transform-box: fill-box;
        transform-origin: 50% 50%;
        transition: translate var(--transition), scale var(--transition);
        transition-timing-function: var(--timing);
    }
}
```

上面代码中，使用 `stroke` 和 `stroke-width` 属性设置了 `<path>` 元素描边的样式。其中 `transform-box` 属性非常重要，它将 SVG 元素变换框指定为 `fill-box` ，如此一来，`transform-origin` 的百分比计算将会相对于 SVG 的元素的边界框来计算，不再相对 SVG 视图尺寸来计算。

在此基础上，使用 CSS 变换属性来改变每个 `<path>` 的位置：

-   第一个 `<path>` （即 `<`）向左移出按钮可视区域，使用 `translate` 沿 `x` 方向向左移出，并使用 `scale` 缩小到不可见。
-   第二个 `<path>` （即 `|`）由竖线变成横线，并调整描边颜色，使用 `rotate` 旋转 `90deg` ，由竖线变成横线，并使用 `scale` 沿 `y` 进行压缩，使其线条在视觉上变线，同时使用 `stroke-width` 和 `opacity` 调整线条的粗细与颜色。
-   第三个 `<path>` （即 `>` ）向右移出按钮可视区域，使用 `translate` 沿 `x` 方向向左移出，并使用 `scale` 缩小到不见。

  


```CSS
.button {
    path {
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: currentColor;
        stroke-width: 4;
        transform-box: fill-box;
        transform-origin: 50% 50%;
        transition: translate var(--transition), scale var(--transition);
        transition-timing-function: var(--timing);
       
        <!-- 第一个 path 和第三个 path 通过 translate 和 scale 移出按钮可视区域 -->
        &:not(:nth-child(2)) {
            --offset: 30%;
            --distance: 50cqi;
            translate: calc((var(--offset) * var(--coefficient)) +(var(--intent, 0) * (var(--distance) * var(--coefficient)))) 0;
            scale: calc(1 + var(--intent));
        }
        
        <!-- 第二个 path 通过 rotate 旋转变成横线，同时 sacle 沿 y 轴压缩 -->
        &:nth-child(2) {
            rotate: calc(15deg + (var(--intent, 0) * 75deg));
            scale: 1 calc(1 + var(--intent, 0));
            translate: 0 calc(var(--intent, 0) * 30cqh);
            stroke-width: calc(4 - (var(--intent, 0) * 2));
            opacity: calc(1 - (var(--intent, 0) * 0.8));
            transition: stroke-width var(--transition), rotate var(--transition),translate var(--transition), scale var(--transition), opacity var(--transition);
            transition-timing-function: var(--timing);
        }

        &:nth-child(1) {
            --coefficient: -1;
        }

        &:nth-child(3) {
            --coefficient: 1;
        }
    }
}
```

  


注意，上面代码中第一个 `<path>` 和第三个 `<path>` 移动方向是由 `--coefficient` 来判断的，当值为 `-1` 向左移动，当值为 `1` 时向右移动。

最后，在按钮的悬停状态（`:hover`）和聚焦状态（`:focus-visible`）改变 `--intent` 属性的值，由初始值 `0` 变成 `1` 。该自定义属性值除了决定 `<path>` 元素的变换值之外，还控制了按钮文本的是否可见：



```CSS
.button {

    /* 省略其他 CSS 代码*/
    .text {
        scale: var(--intent, 0);
        opacity: var(--intent, 0);
        transform-origin: 50% 100%;
        display: inline-block;
        transition: scale var(--transition), opacity var(--transition);
        transition-timing-function: var(--timing);
    }
    
    &:is(:hover, :focus-visible) {
        --intent: 1;
    }
}
```

  


最终效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ea621a3f8494c41a8d8ac9944050813~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=418&s=370692&e=gif&f=114&b=ebcaf9)


> Demo 地址：https://codepen.io/airen/full/MWdKJEy


注意，示例中应用了多个[现代 CSS 特性以及语法规则](https://s.juejin.cn/ds/i2pf7RmG/)，如果你阅读示例源码略感吃力，建议你移步阅读《[现代 CSS](https://s.juejin.cn/ds/i2pf7RmG/)》，进一步加深对 CSS 新特性的了解！

此外，使用 SVG 制作图表和信息图等图形元素，并结合 CSS 进行样式设置和动画处理，可以使数据可视化更加动态和易于访问。这种方式不仅提升了图形的视觉效果，还增强了用户与数据的互动性。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d02e8f11fdb419b814869383474fbb0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=508&s=635959&e=gif&f=101&b=2f3847)


> Demo 地址：https://codepen.io/christiannaths/full/yNBjBq （来源于 [@Christian Naths](https://codepen.io/christiannaths)）


在创建图表和数据可视方面，SVG 相较于其他技术（包括 CSS）更具优势。SVG 图表和数据可视化既可访问又完全可互动。市面上一些数据可视化方面的库，都提供了 SVG 版本，例如 [Echarts](https://echarts.apache.org/zh/index.html) 和 [D3](https://d3js.org/) 等：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd06b2c1ca1841ceb74211a17d2f1aba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3354&h=1696&s=799407&e=jpg&b=fefdfd)

> Echarts 官网：https://echarts.apache.org/zh/index.html



![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8b0e61096ca4a14892e69680caa00f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3348&h=1632&s=1190111&e=jpg&b=f7f4f4)

> D3 官网：https://d3js.org/

  


用户更倾向于参与并理解以互动、视觉吸引人的格式呈现的信息，从而提高了内容的价值和有效性。


在 Web 设计中融入 SVG 与 CSS，不仅能提升网站的审美质量，还在创造吸引人、令人难忘的用户体验方面发挥着关键作用。



### 可缩放性与响应式设计

SVG 的可缩放特性使其成为响应式 Web 设计的理想选择。图形和图标能够根据显示区域的大小自由缩放而不失去质量，确保在任何设备上都能呈现清晰、鲜明的视觉效果。

这种适应性通过 CSS 得到了进一步增强。CSS 可用于控制 SVG 元素的大小、颜色及其他属性，使图形能够灵活响应网站的布局和设计需求。


例如 Web 上带有水波纹的 UI 效果：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab9ba66a890b45009153fb748eeaf738~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=561&s=528175&e=png&a=1&b=fdfcfc)


使用 SVG 创建水波纹要比使用 CSS 简单得多。因为 SVG 最大的特性就是可以无限缩放，而且还不会失真。另外就是，可以使用 `<path>` 绘制出任何你想要的水波纹效果。即使你不懂 SVG，你也可以借且诸如 Figma 这样的图形设计软件或在线工具（例如 [getwaves.io](https://getwaves.io/) 、[ShapeDriver](https://www.shapedivider.app/) 和 [Haikei app](https://haikei.app/) 等）获得绘制水波纹的 SVG 代码。


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b61686020b42a98d5bddcef5a490f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1674&h=696&s=3130105&e=gif&f=549&b=eff1f3)


> URL：https://getwaves.io/


```XML
<svg style="display:none;">
    <symbol id="one" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" d="M0,96L1440,320L1440,320L0,320Z" />
    </symbol>
    <symbol id="two" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" d="M0,32L48,37.3C96,43,192,53,288,90.7C384,128,480,192,576,197.3C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
    </symbol>
  
    <symbol id="three" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" d="M0,128L30,144C60,160,120,192,180,197.3C240,203,300,181,360,192C420,203,480,245,540,245.3C600,245,660,203,720,192C780,181,840,203,900,181.3C960,160,1020,96,1080,80C1140,64,1200,96,1260,122.7C1320,149,1380,171,1410,181.3L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z" />
    </symbol>
  
    <symbol id="four" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" d="M0,192L120,192C240,192,480,192,720,165.3C960,139,1200,85,1320,58.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
    </symbol>
  
    <symbol id="five" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" d="M0,32L120,69.3C240,107,480,181,720,192C960,203,1200,149,1320,122.7L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
    </symbol>
  
    <symbol id="six" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="rgba(255, 255, 255, .8)" d="M0,32L120,64C240,96,480,160,720,160C960,160,1200,96,1320,64L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
    </symbol>
</svg>
```

  


上面的 SVG 代码创建了多种不同的形状：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b6f54084570436285b7713303cb6cab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3252&h=1493&s=262028&e=jpg&b=000000)

  


我们以 Web 中的卡片为例，你可能需要像下面这样的一个 HTML：


```HTML
<div class="cards">
    <div class="card">
        <figure>
            <img src="https://picsum.photos/id/188/800/600" alt="">
            <svg>
                <use href="#two"></use>
            </svg>
        </figure>
        <figcaption>
            <p>现代 Web 布局</p>
        </figcaption>
    </div>
    <!-- 其他 Card -->
</div>
```

  


`<figure>` 中的 `<use>` 就是引用 `<symbol>` 已实例化的水波纹。接下来，你需要使用一点 CSS 来样式化卡片：


```CSS
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100% - 18px, 300px), 1fr));
    gap: 2rem;
  
    .card {
        display: grid;
        gap: 2rem;
        position: relative;
        box-shadow: 0 5px 20px 2px rgb(0 0 0 / 0.15);
        min-width: 0;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, .125);
        border-radius: .25rem;
        overflow: hidden;
        
        figure {
            position: relative;
        }
        
        img {
            display: block;
            max-width: 100%;
            aspect-ratio: 4 / 3;
            border-radius: .25rem .25rem 0 0;
            object-fit: cover;
            object-position: center;
        }
        
        svg {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 55px;
            width: 100%;
        }
        
        figcaption {
            padding: 0 20px 20px;
            font-weight: bold;
        }
    }
}
```


整个布局，使用了 CSS Grid 中的 RAM 布局技术，另外还应用了些新的 CSS 特性，例如 `aspect-ratio` 设置图片的宽高比，`object-fit` 和 `object-position` 防止图片拉伸和挤压等。其他的 CSS 对于大家来说，很普通，就不在这里重复阐述！

你最终看到的效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c065f8376b1f49e79ac307cf2112d3c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5366&h=4096&s=11384969&e=png&b=f5f4f3)


> Demo 地址：https://codepen.io/airen/full/oNRbZGR


尤其要强调的一点是，在创建不规则 UI 形状和动画方面，CSS 无法与 SVG 媲美。尤其是弹性动画，CSS 根本无法实现的，即便能实现，成本也非常高，灵活性和可维护性都会相当困难。

以下是 [@Nikolay Talanov 创建的一个侧边栏动画案例](https://codepen.io/suez/full/emjwvP)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f13aa4aaa5c4a9981e084f9449e7171~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=632&s=1376734&e=gif&f=144&b=595d81)


> Demo 地址：https://codepen.io/suez/full/emjwvP （来源于 [@Nikolay Talanov](https://codepen.io/suez/full/emjwvP)）


想象一下，仅依赖 CSS ，你能实现这个效果。然而，注入 SVG 之后，就不再是难事。这可能也是 SVG 最强大功能之一。

此外，SVG 与 CSS 的结合促进了流畅布局的创建，使这些布局能够无缝适应视口变化，提升了在不同屏幕尺寸和分辨率下的用户体验。这种响应性不仅涉及缩放，还在于打造既具交互性又无障碍的内容，吸引用户并满足他们在快节奏数字世界中的期望。



### 使用 SVG 和 CSS 创建交互动画


将 SVG 与 CSS 结合的一大亮点是能够创建增强用户参与度的交互动画。

SVG 本质上具有交互性，允许用户输入触发视觉变化或动画。例如下面这个简单的示例：

```XML
<svg width="400" height="70" viewBox="0 0 400 70" class="element">
    <rect id="PinkRect" x="10" y="20" width="30" height="30" fill="pink" id="PinkRect">
         <animate begin="2s; click" end="widthAnim.end; mouseover" 
         id="widthAnim" attributeName="width" from="30" to="380" dur="5s"  fill="freeze" />
    </rect>
</svg>
```

  


粉红色的矩形会在 `2s` 之后播放或用户点击来立刻触发动画播放；而用户鼠标悬停到矩形上时，正在播放的动画会立即停止：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dd805f3c5ae40808bbe154dce4f1b91~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1052&h=442&s=239169&e=gif&f=272&b=340631)


> Demo 地址：https://codepen.io/airen/full/gOJPmVg

  


虽然上面展示的只是一个简单的交互动画效果，但这种交互性可以显著提升用户体验，使网站更加动态和吸引人。

在我的小册《[Web 动画之旅](https://s.juejin.cn/ds/i2pbySf1/)》中，我多次强调了[动画在现代 Web 设计中的关键角色](https://juejin.cn/book/7288940354408022074/section/7288940354571599909)。动画不仅能引导用户的注意力，还能提供交互反馈，使整体体验更加愉悦。


正如上面示例所示，虽然 SVG 自身具备一定的交互动画能力，但相较于 CSS，其功能还是显得略为逊色。首先，从兼容性角度来看，SVG 动画不及 CSS 动画广泛支持。其次，CSS 提供了强大的动画功能，包括[关键帧动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)、[过渡动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)、[路径动画](https://juejin.cn/book/7288940354408022074/section/7308623339038670860)、[视图过渡动画](https://juejin.cn/book/7288940354408022074/section/7308623298618163212)和[滚动驱动动画](https://juejin.cn/book/7288940354408022074/section/7307223031717724172)等。此外，[CSS 还提供了丰富的时间函数](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)，用于精确控制动画效果。



这些 CSS 特性使 Web 开发者能够为 SVG 注入更多的生命力，创造从细微的悬停效果到复杂的动画序列，讲述一个故事或阐述一个概念。

-   **悬停效果**：在鼠标悬停时改变 SVG 元素的外观，例如改变颜色或显示隐藏的细节。
-   **过渡效果**：在 SVG 状态或样式之间平滑过渡，增强用户交互的体验。
-   **关键帧动画**：在 SVG 内创建详细的动画，例如沿路径移动元素或改变形状。



以 Web 中常见的 `Avatar` 组件（用户头像）为例。首先来看一个悬停效果的案例：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a9484c6131c47d4a13d2ccef794ff2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=516&s=821065&e=gif&f=65&b=040404)

> Demo 地址：https://codepen.io/airen/full/ZENQKNE


在这个示例中，用户头像是 SVG 的 `<image>` 元素创建的：

```HTML
<figure class="avatar">
    <svg viewBox="0 0 1024 1024">
        <defs>
            <clipPath id="mask" clipPathUnits="objectBoundingBox">
                <path d="M1,0.57 C1,0.846,0.699,1,0.349,1 S0.161,0.856,0.161,0.579 S0,0,0.349,0 S1,0.294,1,0.57" class="anim" />
            </clipPath>
        </defs>

        <image x="0" y="0" width="100%" height="100%" clip-path="url(#mask)" xlink:href="http://i.pravatar.cc/1024?img=7" />
    </svg>
</figure>
```

  


与此同时，在 `<clipPath>` 内嵌入一个 `<path>` 元素，创建了一个不规则的剪切形状。并将该剪切路径应用于 `<image>` 元素上。这样，呈现给你的结果就是一个不规则形状的用户头像：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f98e2b6ac78d4e01bac5a19356220745~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=952&s=288823&e=jpg&b=050505)


接下来，只需要在鼠标悬浮的时候，改变 `<path>` 的 `d` 属性值，并且使用 CSS 的 `transition` 给 `d` 属性设置一个过渡效果。[这样就完成了一个带有交互效果的用户头像](https://codepen.io/airen/full/ZENQKNE)：

```CSS
.anim {
    d: path("M1,0.57 C1,0.846,0.699,1,0.349,1 S0.161,0.856,0.161,0.579 S0,0,0.349,0 S1,0.294,1,0.57");
    transition: d 300ms linear;

    .avatar:hover & {
        d: path("M0.992,0.557 C0.964,0.854,0.695,1,0.409,1 S0,0.884,0,0.6 S0.418,0,0.705,0 S1,0.274,0.992,0.557");
    }
}
```


我们还可以只使用 SVG 来定义剪切路径，然后应用在用户头像上：


```HTML
<figure class="avatar">
  <img src="http://i.pravatar.cc/1024?img=32" />
</figure>

<svg viewBox="0 0 1024 1024" class="sr-only">
  <defs>
    <clipPath id="mask" clipPathUnits="objectBoundingBox">
      <path d="M1,0.57 C1,0.846,0.699,1,0.349,1 S0.161,0.856,0.161,0.579 S0,0,0.349,0 S1,0.294,1,0.57" class="anim" />
    </clipPath>
  </defs>
</svg>
```



上面所示的 HTML 结构，你需要调整 CSS 选择器的使用，才能触发 `.anim` 值过渡：


```CSS
img {
    clip-path: url(#mask);
}

.anim {
    d: path("M1,0.57 C1,0.846,0.699,1,0.349,1 S0.161,0.856,0.161,0.579 S0,0,0.349,0 S1,0.294,1,0.57");
    transition: d 300ms linear;
}

.avatar:hover ~ svg .anim {
    d: path("M0.992,0.557 C0.964,0.854,0.695,1,0.409,1 S0,0.884,0,0.6 S0.418,0,0.705,0 S1,0.274,0.992,0.557");
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d1d44dddac74f9aaa557f337b7334dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=964&h=528&s=996301&e=gif&f=122&b=040404)

> Demo 地址：https://codepen.io/airen/full/qBGbjaX



我们还可以在 CSS 的 `@keyframes` 中改变 `<path>` 元素的 `d` 属性值，然后通过 `animation` 属性将定义的关键帧动画应用在 `.anim` 元素上：


```CSS
@keyframes morph {
    0%, 100%{ 
        d: path("M1,0.57 C1,0.846,0.699,1,0.349,1 S0.161,0.856,0.161,0.579 S0,0,0.349,0 S1,0.294,1,0.57");
    }
    50% {
        d: path("M0.992,0.557 C0.964,0.854,0.695,1,0.409,1 S0,0.884,0,0.6 S0.418,0,0.705,0 S1,0.274,0.992,0.557");
    }
}

.avatar img {
    clip-path: url(#mask);
}


.anim {
    animation: morph 5s linear infinite alternate;
}
```

  


此时，用户头像不断在这两个图形之间变换：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6646fd063a9946628eb5dca62b92e34b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=632&s=822682&e=gif&f=60&b=040404)


> Demo 地址：https://codepen.io/airen/full/BaejZZE

  


除此之外，CSS 还可以结合 SVG 的其他特性，比如遮罩和滤镜，创建出更复杂的效果，从而制作出非常吸引人的 UI 效果。例如下面这几个示例，都有 SVG 滤镜的身影：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6b2f61aa32a4bb1af35dfeadd2ba378~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=644&s=337691&e=gif&f=150&b=313e42)

  


> Demo 地址：https://codepen.io/v_Bauer/full/WNroMOq （来源于 [@Vadim Bauer](https://codepen.io/v_Bauer)）



![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a87c7554fc8041a9968a5cb4c7e3dae7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1194&h=610&s=1692023&e=gif&f=109&b=d5ccdf)



> Demo 地址：https://codepen.io/cobra_winfrey/full/dKMpzO （来源于 [@Adam Kuhn](https://codepen.io/cobra_winfrey)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd63cefe274a4d0d83291253775cbcc2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=572&s=477325&e=gif&f=145&b=1c4c7d)

  


> Demo 地址：https://codepen.io/FloTelemaque/full/JEMMVP （来源于 [@florent](https://codepen.io/FloTelemaque)）



这些效果只是 CSS 结合 SVG 所能实现的一部分，它们可以使我们的 UI 交互更加有趣。通过这些实际案例的展示，我想你与我有同样的感受。SVG 与 CSS 结合实现的交互动画，不仅能提升网站的视觉吸引力，还能使其更具吸引力和交互性，从而带来更丰富的用户体验。

  


### 性能与效率

使用 SVG 搭配 CSS 的另一大优势在于性能。

由于 SVG 是基于数学定义的图形，与光栅图相比，其文件体积通常更小，尤其在处理复杂形状或图标时。这意味着页面加载速度更快，对于提升用户参与度和 SEO 排名至关重要。

同时，CSS 也发挥着重要作用。它可以直接对 SVG 元素进行样式设置，使单个图形能够通过多种方式重新样式化，而无需为每个变体创建并下载独立的图形。这不仅减少了网络传输的数据量，还简化了 Web 资源的维护和更新，使得 Web 开发过程更加高效。

以 Web 上的 Icon 图标为例，通常同一个图标在不同位置会有大小、颜色等样式的变化。在这种情况下，CSS 与 SVG 的结合让 Web 开发者能够轻松应对这些变化，同时在性能上也具有显著优势。通过使用 CSS，我们可以对 SVG 图标进行多样化的样式设置，而无需为每个变体创建和下载独立的图形文件。这不仅提高了开发效率，还减少了网络传输的数据量，优化了页面加载速度。

  


```HTML
<div class="icons">
    <a href="#">
        <svg class="icon">
            <use href="#twitter" />
        </svg>
    </a>
    <a href="#">
        <svg class="icon">
            <use href="#facebook" />
        </svg>
    </a>
    <a href="#">
        <svg class="icon">
            <use href="#linkedin" />
        </svg>
    </a>
</div>


<svg class="sr-only">
    <symbol id="twitter" viewBox="0 0 512 512">
        <path  d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
    </symbol>
    <symbol id="facebook" viewBox="0 0 512 512">
        <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
    </symbol>
    <symbol id="linkedin" viewBox="0 0 448 512">
        <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
    </symbol>
</svg>
```

  


```CSS
.icons {
    --text-color: #09f;
    display: flex;
    align-items: center;
    gap: 2rem;

    a {
        color: var(--text-color);
        transition: color 0.2s ease-in-out;

        &:is(:hover, :focus-visible) {
            --text-color: #127abe;
    
            .icon {
                scale: 1.35;
            }
        }

        &:active {
            --text-color: #0f97f0;
    
            .icon {
                scale: 0.85;
            }
        }
    }

    svg {
        dispaly: block;
        width: 88px;
        aspect-ratio: 1;
        fill: currentColor;
        transform-box: fill-box;
        transform-origin: center;
        transition: all 0.2s ease-in-out;
    }
}
```

  


首先使用 SVG 的 `<symbol>` 创建了一个 SVG 雪碧图，这种方法可以将多个 SVG 图标合并到一个文件中，它可以减少 HTTP 的请求数量，从而提高页面加载速度和性能。然后使用 CSS，在 `:hover` 和 `:active` 状态改变图标的颜色和大小：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b7c85e70e314fa7939bf4562e82cf0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=512&s=832880&e=gif&f=137&b=030303)



> Demo 地址：https://codepen.io/airen/full/KKLVvPN

  


这种技术不仅优化了性能，还增强了网页图形的灵活性和可扩展性，使其成为现代 Web 开发中的热门选择。




### 提升 Web 可访问性


可访问性是 Web 开发中的关键因素，确保所有用户都能使用内容，包括残障人士。正确实施 SVG 可以显著增强 Web 内容的可访问性。

通过在 SVG 元素中包含标题（`<title>`）和描述（`<desc>`），图形内容变得对屏幕阅读器更加友好，为视觉障碍用户提供必要的上下文和含义。此外，CSS 提供的样式灵活性能够帮助创建高对比度模式和其他可访问性功能，使 SVG 内容更加易读和人性化。

在集成 SVG 和 CSS 时优先考虑可访问性，开发者可以打造更具包容性的 Web 体验，满足更广泛受众的需求，并符合 Web 可访问性的最佳实践和法律要求。

  


### 兼容性和跨浏览器支持

确保 Web 内容在多样化的环境中正确显示一直是 Web 开发者面临的持久挑战。SVG 与 CSS 的结合提供了强大的兼容性和跨浏览器支持，极大地缓解了 Web 设计碎片化带来的困扰。

SVG 的大多数特性都得到了所有现代网络浏览器（包括 Chrome、Firefox、Safari 和 Edge）的支持。这种广泛的兼容性意味着基于 SVG 的图形和图标在不同平台上将保持一致的外观，无需采用特定于浏览器的技巧或解决方法。作为 Web 样式语言的 CSS 也得到了普遍支持，使得 SVG 能够无缝融入网页设计工作流程。

尽管 SVG 具有广泛的兼容性，但为了确保最佳的用户体验，对其进行跨浏览器兼容性优化仍然是必要的。对于不支持 SVG 的老式浏览器，可以通过 CSS 实施回退机制，确保不遗漏任何用户。这意味着，开发者可以利用 CSS 增强 SVG 的功能，例如增加悬停状态或在支持有限的浏览器中实现优雅降级的动画。这样一来，现代浏览器的用户能够享受到完整的交互特性，而使用较旧浏览器的用户仍能访问核心内容和功能。

总的来说，SVG 与 CSS 的结合为解决跨浏览器兼容性这一挑战提供了可靠的解决方案，使得 Web 开发者能够创建既现代又兼容的 Web 内容，满足各种用户的需求。

  


### SVG 和 CSS 的未来趋势


Web 设计与开发领域不断发展，新趋势和技术正塑造着我们创建数字内容的方式。SVG 和 CSS 在现代 Web 设计和开发中已处于核心地位，未来它们将扮演更加重要的角色。

随着 Web 标准的发展和浏览器功能的扩展，SVG 和 CSS 在创建沉浸式、交互性及视觉震撼的 Web 产品方面展现出无限潜力。例如：

-   **高级动画**：预期会看到更多由 CSS 控制的复杂 SVG 动画，提供更丰富的交互体验。
-   **增强的交互性**：随着浏览器对 SVG 和 CSS 的支持越来越好，Web 设计会变得更加互动。无论是做数据可视化还是开发游戏，使用 SVG 都会更加方便。
-   **可访问性和性能**：未来的趋势将更加重视可访问性和性能，SVG 和 CSS 在提供既快速又对所有用户可访问的内容方面将发挥关键作用。



总的来说，SVG 和 CSS 的不断进步将继续推动 Web 设计与开发的创新，为用户提供更优质的体验。

  


## 拥抱 SVG 与 CSS 的未来


SVG 与 CSS 的集成标志着 Web 设计与开发的一大进步。这种强大的组合为创建响应迅速、高效、视觉效果惊艳且对广大用户友好的 Web 网站和应用铺平了道路。

正如前面所述，SVG 搭配 CSS 的优势不仅仅在于美学，更在 Web 性能、可访问性、跨浏览器兼容性以及 SEO 等方面提供了实质性的益处。

随着 Web 变得越来越互动和注重视觉效果，对可缩放和响应式图形的需求也不断增加。SVG 和 CSS 正好满足了这种需求，为我们提供了创建美观实用的动态 Web 体验的工具。

随着技术的发展，SVG 和 CSS 的能力也将随之增强，为 Web 设计和开发提供更多创新的可能。最为关键的是，SVG 与 CSS 提供了无与伦比的可缩放性和响应性，确保 Web 内容在所有设备和屏幕尺寸上都能保持清晰。其次，优化 SVG 和 CSS 对于提升 Web 性能和用户体验至关重要。未来的 Web 设计和开发将会看到 SVG 与新技术的更深度融合，进一步拓展在线应用的可能性。


总之，SVG 与 CSS 的优势显著，为 Web 设计和开发的未来奠定了坚实基础。随着我们不断拓展数字创意的极限，SVG 和 CSS 无疑将在塑造 Web 体验中发挥关键作用。对于 Web 设计师和开发者来说，接纳这些技术不仅仅是跟随当前趋势，更是在为下一代 Web 设计奠定舞台，可能性如同我们的想象力一样无穷无尽。