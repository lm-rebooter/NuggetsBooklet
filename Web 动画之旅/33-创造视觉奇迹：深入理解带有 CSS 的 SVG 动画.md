[在上一节课结尾时](https://juejin.cn/book/7288940354408022074/section/7308623556815159307)，我曾抛出了 SMIL 动画虽然很强大，但它却逐渐的没落了，甚至有可能会像 Flash 一样，成为历史。但庆幸的是，SMIL 动画或者说 SVG 原生动画能很容易找到替代方案，比如我们这节课要聊的“带有 CSS 的 SVG 动画”，就是其中替代方案之一。

  


“带有 CSS 的 SVG 动画”指的是使用 CSS 给 SVG 元素添加动画，有点类似于 CSS 给 HTML 元素添加动画。简而言之就是使用 CSS 技术为 SVG 元素添加动画。能这样做的主要原因之一是，SVG 和 CSS 的结合为 Web 开发者提供了强大的工具，它们的结合可以使 Web 开发者创建出引人入胜的动画效果。而且这种组合是轻量级的，带有 CSS 的 SVG 动画，可以获得最佳速度，这有助于创建加载更快、确保更流畅用户体验和更快页面加载的更好动画。

  


在这节课中，我们将探讨使用 SVG 和 CSS 创建简单且可扩展动画的过程。整个课程包含从基础到高级的内容，覆盖了线条动画、路径动画、关键帧动画、过渡效果等方面的技术。通过这节课的学习，你将能够优化 SVG 动画的性能，实现响应式设计，并应用这一技术创造出令人印象深刻的用户体验。我也将带领大家走进一个充满创意和创新的动画世界。

  


让我们一同探索，如何通过CSS的力量，将静态的SVG图形变成生动而引人入胜的用户体验。唯一的要求是你需要对 CSS 有基本的了解以及对 SVG 有一些了解。

  


## 使用 CSS 对 SVG 进行动画的常见用例

  


SVG 可以顺利地适应不同的情况，当进行缩放时可以保持图形质量。使用 CSS 对 SVG 进行动画可以创造出各种引人注目的效果。在进行代码之前，让我们看一些常见的用例。

  


### 图标动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6e638692df5408597b14abdc4f9ea1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=650&s=3415592&e=gif&f=71&b=fdfcfc)

  


在 Web 应用或网站中使用 SVG 图标，并通过 CSS 动画为其添加生动的交互效果。动画 SVG 图标对于引导屏幕、加载旋转器、菜单切换、视频播放控件等方面的微交互和视觉反馈特别有益。

  


### 路径动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bb01c82b66f46179ae7e77e949f8403~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1364&h=688&s=4486321&e=gif&f=109&b=ffffff)

  


利用 CSS 的关键帧动画，创建路径动画以呈现线条、形状或图标的平滑过渡。这可以用于制作复杂的形状转变或线条的动态绘制效果。

  


### 按钮效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44e9f64c683a4556a7be6cd2975ef582~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1368&h=692&s=1902495&e=gif&f=111&b=fefefe)

  


通过 CSS 动画为按钮添加吸引人的动画效果，例如悬停时的颜色变化、阴影效果或按钮大小的微妙变化，以提高用户交互体验。

  


### 数据可视化

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ae654b3e70a4fd18fa1bdedd46d7cd1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1374&h=714&s=7826025&e=gif&f=161&b=fcfbfb)

数据可视化可以使用 SVG 创建干净、可伸缩、动态且高度可定制的图表、图形和图表。利用 CSS 动画为 SVG 创建动态的数据可视化效果，例如图表、图形或地图。这可以通过动态改变数据点的位置、颜色或大小来实现。

  


### 形状转变

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a67e56699d648e0bf1a483c4c939f10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=732&s=5432023&e=gif&f=137&b=fffefe)

  


利用 CSS 的形状转变功能，为 SVG 元素创建平滑的形状转变动画。这可以包括大小、旋转、倾斜等转换。

  


### 文字动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f612712eea8e46c78cad14c9aee589be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=488&s=1603339&e=gif&f=113&b=fefefe)

  


将文字嵌入到 SVG 中，并使用 CSS 动画为文字添加各种效果，如逐字显示、颜色变化或文字路径动画。

  


### 加载动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8269ababff8444bbbe15919807451c20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=482&s=2200720&e=gif&f=94&b=ffffff)

  


在页面加载或异步操作期间使用 SVG 图标，并通过 CSS 实现旋转、脉冲或其他加载动画，向用户传达操作正在进行中的信息。

  


这些只是使用 CSS 对 SVG 进行动画的一些常见用例。通过巧妙地结合 SVG 和 CSS，Web 开发者可以创造出丰富多彩、生动有趣的用户界面效果。

  


## 如何为动画准备 SVG

  


在这节课中，我们的重点是从头开始创建 SVG，并且使用 CSS 为 SVG 添加动画。在使用 CSS 为 SVG 添加动画效果之前，Web 开发人员需要了解 SVG 在内部是如何工作的。幸运的是，SVG 和 HTML 非常相似：**我们使用 XML 语法定义 SVG 元素，并使用 CSS 为其设置样式，就像它们是 HTML 一样**。

  


SVG 元素是专门用于绘制图形的。我们可以使用 `<rect>` 绘制矩形、`<circle>` 创建圆形等。它还定义了 `<ellipse>` 、`<line>` 、`<polyline>` 、`<polygon>` 和 `<path>` 等：

  


```SVG
<svg>
    <!-- rect 用于创建矩形 -->
    <rect width="100" height="50" fill="blue" />
    
    <!-- circle 用于创建圆形 -->
    <circle cx="50" cy="50" r="30" fill="red" />
    
    <!-- ellipse 用于创建椭圆 -->
    <ellipse cx="50" cy="50" rx="40" ry="20" fill="green" />
    
    <!-- line 用于创建直线 -->
    <line x1="0" y1="0" x2="100" y2="100" stroke="black" stroke-width="2" />
    
    <!-- polyline 用于创建折线 -->
    <polyline points="0,0 50,50 100,0" stroke="blue" fill="none" />

    <!-- polygon 用于创建多边形 -->
    <polygon points="0,0 50,50 100,0" fill="yellow" />

    <!-- path 用于创建多路径，可以描述直线、曲线、圆弧等 -->    
    <path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent" />

    <!-- text 用于在 SVG中添加文本 -->    
    <text x="10" y="40" font-family="Arial" font-size="20" fill="black">Hello SVG!</text>
</svg>    
```

  


在 SVG 中除了使用图形元素绘制静态形状之外，它还允许你使用 SMIL 创建动画。例如，你可以使用 `<animate>` 、`<animateMtion>` 、`<aniamteTransform>` 和 `<set>` 等元素给静态 SVG 元素添加动画效果。

  


> 注意，这里所提到的 SVG 元素仅仅是 SVG 中的一小部分，[你可以在 MDN 上查看到每个 SVG 元素](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)。

  


虽然说，SVG 和 HTML 非常相似，但也有一些不同。比如，HTML 中大多数元素都可以有子元素，但在 SVG 中，其大多数元素是没有子元素的。这也意味着，SVG 中很多元素是不能相互嵌套的。不过，在 SVG 中，我们通常使用 `<g>` 元素来组合多个 SVG 元素，进行组织结构化以及集体变换或动画。这个分组可以通过分配 `id` 或类名来样式化。然而，对于单个 SVG 元素或单个组，组标签是不必要的：

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" class="icon--hamburger" width="200" height="200" viewBox="0 0 1024 1024">
    <g class="hamburger hamburger__top">...</g>
    <g class="hamburger hamburger__middle">...</g>
    <g class="hamburger hamburger__bottom">...</g>
</svg>
```

  


HTML 和 SVG 之间的另一个重要区别是 **SVG 元素不像 HTML 元素那样受 CSS 盒模型的约束**。这使得定位和转换这些元素变得更加棘手，并且乍看之下可能会显得不太直观。然而，一旦你理解了 SVG 坐标系统和变换的工作原理，操作 SVG 就会变得更加容易，也更加合乎逻辑。这里简单地介绍一下控制 SVG 坐标系统的三个最重要的 SVG 属性：`viewport`、`viewBox` 和 `preserveAspectRatio`。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9da7fde11667460b84063096a2c2d375~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2898&h=1552&s=973856&e=jpg&b=fefefe)

  


在 SVG 中，`<svg>` 元素的 `preserveAspectRatio`、`viewBox`、`width` 和 `height` 属性之间有密切的关系，它们共同决定了 SVG 图形在渲染时的表现和显示方式。

  


-   **`preserveAspectRatio`** 属性：用于控制 SVG 图形在视口中的放置方式和缩放行为。其语法格式是 `preserveAspectRatio="align meet/slice defer"`；`align` 可选值：`none`、`xMinYMin`、`xMidYMin`、`xMaxYMin`、`xMinYMid`、`xMidYMid`、`xMaxYMid`、`xMinYMax`、`xMidYMax`、`xMaxYMax`。`meet` 表示保持纵横比的前提下尽量占满视口；`slice` 表示保持纵横比的前提下尽量不超出视口。`defer` 表示是否推迟对 `preserveAspectRatio` 的处理。
-   **`viewBox`** 属性：定义 SVG 用户坐标系统的位置和大小。其语法格式是 `viewBox="min-x min-y width height"`；其中 `min-x` 和 `min-y` 定义了视口坐标系中的左上角位置；`width` 和 `height` 定义了视口坐标系的宽度和高度。
-   **`width`** 和 **`height`** 属性：分别定义 SVG 元素在文档中的宽度和高度。通常，如果没有指定 `width` 和 `height`，SVG 将会根据视口的大小自动调整。

  


这些属性之间的关系可以通过以下方式理解：

  


-   如果没有指定 `width` 和 `height`，SVG 将会根据视口的大小自动调整，同时 `viewBox` 属性定义了用户坐标系统的大小和位置。
-   `preserveAspectRatio` 属性则决定了在调整大小时，是否保持 SVG 图形的纵横比，以及如何在视口中对齐。
-   如果指定了 `width` 和 `height`，SVG 将会被强制缩放到指定的大小，但 `preserveAspectRatio` 仍然可以影响如何在这个指定大小内显示。

  


例如：

  


```SVG
<svg viewBox="0 0 100 50" width="200" height="100" preserveAspectRatio="xMidYMid meet">
  <!-- SVG 内容 -->
</svg>
```

  


在这个例子中，`viewBox` 定义了用户坐标系统的大小为 `100x50`，而 `width` 和 `height` 定义了 SVG 元素在文档中的大小为 `200x100`。`preserveAspectRatio` 则指示在这个大小范围内如何对齐和缩放 SVG 图形。

  


尽管在具备一定 SVG 的基础上，你可以在文档中手工编写 SVG 代码来绘制所需图形，但对于复杂的图形而言，你可能还是需要依赖矢量图形软件，例如 Sketch 和 Figma 等。我通常会基于 Figma 软件来辅助我绘制一些复杂的矢量图形。当然，你也可以从一些矢量图库上来获取所需图形，例如 [Undraw](https://undraw.co/) 提供了很多优秀的 SVG 插图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0695f018e09d4022904ac4aecbc9e4a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=643&s=16470&e=avif&b=fefefe)

  


不过，需要注意的是，当你通过图形编辑软件或其他生成 SVG 图形工具获得的 SVG 代码或 `.svg` 文件，可能会包含一些不必要的代码。因此，建议使用像 [SVGOMG](https://jakearchibald.github.io/svgomg/) 或 [SVG Cleaner ](https://iconly.io/tools/svg-cleaner)等工具对 SVG 代码进行优化是非常有必要的，这些工具可以帮助你最小化 SVG 文件大小和删除冗余标签和元数据。如此一来，你将获得一份整洁干净的 SVG 代码：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55c64c1df190440184125eec20f593b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1216&s=71337&e=avif&b=eeeeee)

  


> SVGOMG：https://jakearchibald.github.io/svgomg/

  


## 应用 CSS 到 SVG

  


假设你已经知道如何获得 SVG 代码，不管是硬编码还是通过工具获得。有了这个基础之后，我们就可以进入下一步，应用 CSS 到 SVG 。

  


众所周知，有多种不同的方式可以将 CSS 应用到 HTML 中。同样的，也有多种不同的方式可以将 CSS 应用于 SVG 中。

  


由于 SVG 与 HTML 无缝集成，它支持内联 CSS 样式。你可以使用 `style` 属性将 CSS 样式添加到 SVG 元素上，像就在 HTML 中一样。例如：

  


```SVG
<svg width="64" height="64" viewBox="0 0 48 48">
    <rect width="100%" height="8" style="fill: navy; stroke: red;" />
    <rect width="100%" height="8" style="fill: blue; stroke: orange;" />
</svg>
```

  


上面代码演示了使用 CSS 给 `<rect>` 元素设置填充色（`fill`）和描边色（`stroke`）。

  


第二种将 CSS 样式应用于 SVG 的方法涉及使用 CSS 的 `@import` 规则。此规则放置在 SVG 内的 `<style>` 元素中，用于引用和导入外部 CSS 样式表。例如：

  


```SVG
<svg width="64" height="64" viewBox="0 0 48 48">
    <style>
        @import url(style.css);
    </style>
    <!-- SVG 内容 -->  
</svg>
```

  


第三种方式是直接在 SVG 内部编写样式，但最好将其包含在 `CDATA` 部分中，以防止与 XML 解析可能发生冲突：

  


```SVG
<svg width="64" height="64" viewBox="0 0 48 48">
    <!-- 请注意，<style> 标签包含在SVG元素内部，包裹在CDATA中。-->
    <style type="text/css">
        <![CDATA[
            .rect {
                fill: green;
                stroke: orange;
            }
        ]]>
    </style>
    
    <g>
        <rect class="rect" width="100%" height="8" />
        <rect class="rect" width="100%" height="8" />
    </g>
</svg>
```

  


最后一种方式是将 CSS 和 SVG 分离，即把 CSS 和 SVG 代码放置在单独的文件中，然后在包含这些 SVG 文件的文档中使用它们。因此，根据使用它们的文档，SVG 将自动获得样式。我个人是比较喜欢这种方式，可以保持 SVG 代码整洁干净，也便于对 SVG 样式调整。这一点与 CSS 和 HTML 分离是一样的。

  


## 给 SVG 添加 CSS 动画

  


通常情况，给 SVG 添加动画的方式有 SMIL、CSS 和 WAAPI 等，但在这里我们主要围绕着“CSS 给 SVG 元素应动画”来展开。

  


在 CSS 中，我们主要分为过渡动画和关键帧动画两大类型，即使用 `transition` 和 `animation` 给元素添加动画。也就是说，我们也可以通过给 SVG 元素应用 `transition` 和 `animation` ，实现不同类型的动画效果。

  


### 给 SVG 添加过渡动画

  


CSS 过渡（`transition`）允许我们定义属性更改的速率和持续时间，与立即从起始值跳到结束值不同，值会平滑过渡。就像下面这个示例，当你用鼠标悬停在卡片时，图标的颜色会发生变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c32cd1d93f9645e1bb5035e3681c4f70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=392&s=420519&e=gif&f=180&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/GReaQMb

  


我们可以使用 `transition` 定义 SVG 图标的 `fill` 属性过渡效果：

  


```CSS
@layer transition {
    .card {
        color: #079ad9;
        transition: background-color 300ms ease-in, color 300ms ease-in, scale 300ms ease-in;
    
        svg {
            fill: #079ad9;
            transition: fill 300ms ease-in;
        }
        
        &:hover {
            background-color: #079ad9;
            color: white;
            scale: 1.1;
    
            svg {
                fill: #fff;
            }
        }
    }
}
```

  


其实给 SVG 颜色（例如 `fill` 、`stroke` 等）添加过渡动画效果，有一个小技巧，那就是利用 CSS 的 `currentColor` 属性，然后对 `color` 属性进行过渡动画处理。使用这个技巧有一个前提条件，那就是需要将 SVG 对应的元素的 `fill` 的值设置为 `currentColor` ，你也可以在 CSS 中设置 `fill` 的值为 `currentColor` 。

  


```HTML
<div class="card">
    <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
    </svg>
    Walk
</div>
```

  


```CSS
@layer transition {
    .card {
        color: #079ad9;
        transition: background-color 300ms ease-in, color 300ms ease-in, scale 300ms ease-in;
    
        svg {
            transition: color 300ms ease-in;
        }
        
        &:hover {
            background-color: #079ad9;
            color: white;
            scale: 1.1;
    
            svg {
                color: #fff;
            }
        }
    }
}
```

  


最终得到的效果是相同的，但相比而言，这种方式的灵活性要更强，它能自动匹配组件的文本颜色（`color`）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cadf991952a49258e3afb9436ac1565~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=388&s=395194&e=gif&f=141&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/QWoRQYd

  


除了可以动画化 SVG 颜色之外，还可以使用 `transition` 给 SVG 添加微动效，使交互变得更具吸引力。例如下面这个下载按钮，当用户鼠标悬浮在按钮上时，下载图标具有微妙的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d0c66e1e7ea4e5a9c8812a37681b409~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=434&s=270112&e=gif&f=149&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/abMrGgw

  


按钮上的 SVG 图标是由三个 `<path>` 元素构建的，并且将需要动画化的部分（箭头部分）用一个 `<g>` 元素包裹起来，同时将类名命名为 `arrow` 。这样做是为了在 CSS 能更好的选中这部分，然后为其添加微妙的动画效果：

  


```HTML
<div class="button">
    Download
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
        <defs>
            <clipPath id="a">
                <path d="M0 0h500v500H0z" />
            </clipPath>
            <clipPath id="c">
                <path fill="#fff" d="M416.771 26H79.425l-.732 350.612 338.693 2L416.771 26" />
            </clipPath>
            <clipPath id="b">
                <path fill="#fff" d="M416.732-248H79.386l-.04 352.612h337.347L416.732-248" />
            </clipPath>
          </defs>
          <g clip-path="url(#a)">
              <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="50" d="M93.159 306.026v48.543c0 21.87 17.728 39.601 39.598 39.601h233.82c21.87 0 39.598-17.731 39.598-39.601v-48.543" />
              <!-- 需要动画的部分，命名为 arrow -->
              <g clip-path="url(#c)" class="arrow">
                  <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="50" d="M249.667 271.794V48.165" transform="matrix(1 0 0 .9901 0 6.545)" />
                  <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="50" d="m-74.576-32.89 72.811 67.723a2.498 2.498 0 0 0 3.53 0l73.207-67.306" transform="matrix(1 0 0 .9901 249.666 265.39)" />
              </g>
          </g>
    </svg>
</div>
```

  


我们使用 CSS 为 `.arrow` 添加了一个很微妙的动画，在鼠标悬浮状态时，沿着 `y` 轴向上移动：

  


```CSS
@layer transition {
    .button {
        transition: opacity 300ms ease;
    
        .arrow {
            transform-origion: center bottom;
            transition: translate 300ms ease;
        }
    
        &:hover {
            opacity: 0.9;
    
            .arrow {
                translate: 0 -50px;
            }
        }
    }
}
```

  


上面所演示的是两个非常常见，而且非常简单的过渡动画效果。你可能已经发现了，使用 `transition` 为 SVG 元素添加过渡动画效果和为 HTML 元素添加过渡动画效果是相似的。也就是说，为 SVG 元素添加过渡动画效果，技术不是问题，我们始终缺少的是创意，是想法。

  


### 给 SVG 添加关键帧动画

  


我们可以通过使用 CSS 的 `@keyframes` 规则定义一系列动画的关键帧，指导元素随时间的推移而演变。这些关键帧将 SVG 元素转化为引人入胜的动画。

  


例如，我们把一个 `bounce` 的动画效果应用于上面示例中的 `.arrow` 上：

  


```CSS
@layer animation {
    @keyframes bounce {
        from,
        20%,
        53%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            translate3d: 0 0 0;
        }
    
        40%,
        43% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            translate: 0 -30px 0;
            scale: 1 1.1;
        }
    
        70% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            translate: 0 -15px 0;
            scale: 1 1.05;
        }
    
        80% {
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            translate: 0 0 0;
            scale: 1 0.95;
        }
    
        90% {
            translate: 0 -4px 0;
            scale: 1 1.02;
        }
    }

    .arrow {
        transform-origin: center bottom;
    
        .button:hover & {
            animation: bounce 300ms ease infinite;
        }
    }
}
```

  


你现在看到的效果将如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c83bf813248649448c4bf383476faefa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=418&s=196465&e=gif&f=100&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/bGZPbvd

  


接着再来看一个 CSS 关键帧给 SVG 添加动画的案例。假设你使用 SVG 绘制了一个小铃铛的图形：

  


```SVG
<svg class="bell" width="200" height="200" viewBox="-100 -100 200 200">
    <g stroke="#001514" stroke-width="2">
        <circle cx="0" cy="-45" r="7" fill="#4F6D7A" />
        <circle class="bell--tongue" cx="0" cy="50" r="10" fill="#F79257" />
        <path d="M -50 40 L -50 50 L 50 50 L 50 40 Q 40 40 40 10 C 40 -60 -40 -60 -40 10 Q -40 40 -50 40" fill="#FDEA96" />
    </g>
</svg>
```

  


我们通过 CSS 给这个小铃铛添加一个摆动的动画效果：

  


```CSS
@layer animation {
    .bell {
        transform-origin: center 30%;
    }

    .bell,.bell--tongue {
        animation: ring .5s ease-in-out -.25s infinite alternate;
    }

    @keyframes ring {
        from {
            rotate: -20deg;
        }
        to {
            rotate: 20deg;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4850dba649414f59893c1fabfa77b17c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=436&s=358207&e=gif&f=84&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/VwRJZgR

  


上面所演示的都是最基础的 SVG 动画。我们还可以使 SVG 动画变得更为复杂，例如下面这个 `TodoList` 效果，使用 SVG 给复选框添加动画，当用户勾选和不勾选复选框都会有一个动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56931a9e076d4a17a164d8f3aa1000d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=568&s=925052&e=gif&f=163&b=fcfcfc)

  


> Demo 地址：https://codepen.io/airen/full/poYXzMw

  


上面示例中复选框选中和未选中两个状态的以及文本的删除线都是 SVG 绘制的：

  


```HTML
<label class="todo">
    <input class="todo__state" type="checkbox" />

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 25" class="todo__icon">
        <use xlink:href="#todo__line" class="todo__line"></use>
        <use xlink:href="#todo__box" class="todo__box"></use>
        <use xlink:href="#todo__check" class="todo__check"></use>
        <use xlink:href="#todo__circle" class="todo__circle"></use>
    </svg>
    <div class="todo__text">现代 Web 布局</div>
</label>
```

  


这里使用了 SVG 的 `<use>` ，重复利用了下面这个 SVG 绘制的图形：

  


```SVG
<svg viewBox="0 0 0 0" style="position: absolute; z-index: -1; opacity: 0;">
    <defs>
        <linearGradient id="boxGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="25" y2="25">
            <stop offset="0%" stop-color="#27FDC7" />
            <stop offset="100%" stop-color="#0FC0F5" />
        </linearGradient>
    
        <linearGradient id="lineGradient">
            <stop offset="0%" stop-color="#0FC0F5" />
            <stop offset="100%" stop-color="#27FDC7" />
        </linearGradient>
    
        <path id="todo__line" stroke="url(#lineGradient)" d="M21 12.3h168v0.1z" />
        <path id="todo__box" stroke="url(#boxGradient)" d="M21 12.7v5c0 1.3-1 2.3-2.3 2.3H8.3C7 20 6 19 6 17.7V7.3C6 6 7 5 8.3 5h10.4C20 5 21 6 21 7.3v5.4" />
        <path id="todo__check" stroke="url(#boxGradient)" d="M10 13l2 2 5-5" />
        <circle id="todo__circle" cx="13.5" cy="12.5" r="10" />
    </defs>
</svg>
```

  


然后使用 CSS 给 SVG 元素添加下面的动画效果：

  


```CSS
@layer animation {
    @keyframes explode {
        30% {
            stroke-width: 3;
            stroke-opacity: 1;
            transform: scale(0.8) rotate(40deg);
        }
        100% {
            stroke-width: 0;
            stroke-opacity: 0;
            transform: scale(1.1) rotate(60deg);
        }
    }

    .todo__icon {
        fill: none;
        stroke: #27fdc7;
        stroke-width: 2;
        stroke-linejoin: round;
        stroke-linecap: round;
    }
    
    .todo__line,
    .todo__box,
    .todo__check {
        transition: stroke-dashoffset 0.8s cubic-bezier(0.9, 0, 0.5, 1);
    }
    
    .todo__circle {
        stroke: #27fdc7;
        stroke-dasharray: 1 6;
        stroke-width: 0;
        transform-origin: 13.5px 12.5px;
        transform: scale(0.4) rotate(0deg);
        animation: none 0.8s linear;
    }

    .todo__box {
        stroke-dasharray: 56.1053, 56.1053;
        stroke-dashoffset: 0;
        transition-delay: 0.16s;
    }
    
    .todo__check {
        stroke: #27fdc7;
        stroke-dasharray: 9.8995, 9.8995;
        stroke-dashoffset: 9.8995;
        transition-duration: 0.32s;
    }
    
    .todo__line {
        stroke-dasharray: 168, 1684;
        stroke-dashoffset: 168;
    }
    
    .todo__circle {
        animation-delay: 0.56s;
        animation-duration: 0.56s;
    }
    
    .todo__state:checked {
        ~ .todo__text {
            transition-delay: 0s;
            color: #5ebec1;
            opacity: 0.6;
        }
        
        ~ .todo__icon .todo__box {
            stroke-dashoffset: 56.1053;
            transition-delay: 0s;
        }
        
        ~ .todo__icon .todo__line {
            stroke-dashoffset: -8;
        }
        
        ~ .todo__icon .todo__check {
            stroke-dashoffset: 0;
            transition-delay: 0.48s;
        }
        
        ~ .todo__icon .todo__circle {
            animation-name: explode;
        }
    }
}
```

  


其中，`stroke-dasharray` 属性控制用于描边路径的虚线和间隙的模式。如果你想将线条绘制为一组虚线和间隙，而不是一条连续的墨迹，这就是你会使用的属性。`stroke-dashoffset` 属性指定从虚线模式的哪里开始绘制虚线。它们都可以使用 CSS 进行控制。

  


你将在 CSS 中利用 `stroke-dasharray` 和 `stroke-dashoffset` 属性为 SVG 路径添加动画。它们给用户一种路径逐渐被绘制的幻觉。稍后的示例还会用到这两种属性。

  


## 你可以使用 CSS 对哪些内容进行动画呢？

  


CSS 使你能够通过对各种属性进行动画来创建动态的视觉效果。虽然并非所有属性都是“可动画的”，但许多属性可以使用 CSS 与 SVG 进行平滑地过渡或动画。

  


接下来，我们通过一些实际案例来向大家演示 CSS 对 SVG 动画化的威力，它可以通过 `transform` 、`opacity` 和 `color` 等属性转换静态 SVG，这些动画利用基本数学来创建动态的菜单切换、加载动画、流体线条移动、生动的插图以及平滑的文本动画。

  


### SVG 线条动画

  


我喜欢 SVG 线条动画，因为我觉得它能给用户一种线条（路径）逐渐被绘制的幻觉，这种效果看起来很棒，而且足够简单，以至于这种效果在 Web 上得到了广泛的运用。

  


正如上面那个 `TodoList` 中复选框的效果所示，可以使用 `stroke-dasharray` 和 `stroke-dashoffset` 属性来对 SVG 进行动画化，从而实现线条动画效果。虽然使用它们能很容易实现 SVG 线条动画，但其中也有一些较少人知道的或者高级技巧。其中包括操纵起点或使线条向多个方向延伸。

  


首先简单的了解一下 SVG 的 `stroke-dasharray` 属性。它用于使 SVG 路径成为虚线而不是实线。这个属性的值越大，虚线之间的间隔就越大。

  


```CSS
@layer demo {
    .heart {
        --stroke-dasharray: 90;
        stroke-dasharray: var(--stroke-dasharray);
        transition: stroke-dasharray 300ms ease;
    }
}
```

  


尝试拖动示例中的手柄来改变 `stroke-dasharray` 属性的值：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3393d61c78934b3d80b1b507ba8433ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=442&s=485685&e=gif&f=325&b=fefefe)

  


  


> Demo 地址：https://codepen.io/airen/full/NWJZXoo

  


上面示例中的心形是 SVG 的 `path` 元素绘制的，整个路径的长度是 `100` 个单位（根据 `SVGGeometryElement.getTotalLength()` 确定）。其中红色标记是表示路径的起点。假设 `stroke-dasharray` 的值为 `50` ，将表示线条有 `50` 个单位实色，然后是 `50` 个单位的空白。

  


也就是说，我们可以使用 `stroke-dasharray` 属性来定义线条虚线间隙模式。它最多可以采用四个值，取值不同时，所描述的虚线则不同：

  


-   一个值，例如 `stroke-dasharray: 40` ，表示虚线和间隙的大小相同
-   两个值，例如 `stroke-dasharray: 40 20` ，第一个值用于虚线长度，第二个值应用于间隙
-   三个值，例如 `stroke-dasharray: 40 20 80` ，第一个值用于第一段虚线长度，第二个值应用于间隙，第三个值用于第二段虚线长度，依此类推
-   四个值，例如 `stroke-dasharray: 40 20 80 120` ，第一个值用于第一段虚线长度，第二个值应用于第一个间隙，第三个值应用于第二段虚线长度，第四个值应用于第二个间隙，依此类推

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dda1bba16da4ca29c90c857cc2e67ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1339&h=968&s=657672&e=gif&f=548&b=3e423c)

  


除了使用`stroke-dasharray` 使虚线的长度不同之外，我们还可以使用 `stroke-dashoffset` 来偏移描边位置。如果我们改变这个属性，看起来就像我们的虚线沿着路径移动一样。

  


```CSS
@layer demo {
    .heart {
        --stroke-dasharray: 90;
        --stroke-dashoffset: 90;
        stroke-dasharray: var(--stroke-dasharray);
        stroke-dashoffset: var(--stroke-dashoffset);
        transition: all 300ms ease;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ace6a0a3212246359a69a8e50ed66801~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=484&s=351812&e=gif&f=207&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/vYPqdpQ

  


如此一来，我们就可以在 `@keyframes` 中改变 `stroke-dashoffset` 的值，实现 SVG 线条动画。例如：

  


```CSS
@layer animation {
    @keyframes reveal {
        to {
          stroke-dashoffset: 0;
        }
    }
  
    .heart {
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        animation: reveal 2s ease-in-out infinite;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fe0638636a64177b5ae727771e38b3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=430&s=54063&e=gif&f=64&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/vYPqRjO

  


上面这个示例，从起点开始（红色标记处），动画在 `100` 个单位后结束。CSS 的 `stroke-dasharray: 100` 定义了虚线的模式，`100` 个单位实色，然后是 `100` 个单位的空白（间隙）。使用 `stroke-dashoffset: 100` ，将其向后拉了 `100` 个单位。然后在 `@keyframes` 中将 `stroke-dashoffset` 减少到 `0` ，以便动画可以将线条的实色部分推入视图，使人产生一种绘制线条的动画效果。

  


类似的方式，可以给 SVG 绘制的任何线条（`<line>` 、`<circle>` 、`<polygon>` 或 `<path>` 等）添加动画效果：

  


```SVG
<svg viewBox="0 0 120 120" width="80vh">
    <defs>
        <g id="gg">
            <line id="line" x1="10" y1="10" x2="110" y2="10" />
            <rect id="rect" x="10" y="26.3" width="25" height="25" />
            <circle id="circle" cx="60" cy="38.8" r="15.92" />
            <path id="football" d="M106.1,19.2C97,22,90.3,27.1,87.3,34.3s-1.8,15.6,2.7,24c9.1-2.8,15.9-7.9,18.9-15.1 C111.8,36,110.6,27.6,106.1,19.2z" />
            <path id="bit" d="M92,101.3c1.4-3,3-5.9,4.8-8.7c3-5.1,9-10.1,6.9-17.4c-0.9-3.3-5.9-9.8-9.3-5.9c-4.4,5,5.5,17.6,8,21.1 C112.5,105.9,85.1,116.1,92,101.3z" />
            <polygon id="diamond" points="11.4,96.8 22.5,66 33.6,96.8 22.5,110" />
            <path id="heart" d="M60,102.3c2.6-1.9,4.9-4.2,7.1-6.5c4.6-4.5,10.5-13,5.6-19.5c-1.3-1.7-3.3-2.8-5.5-2.8c-4,0-7.2,3.5-7.2,7.8 c0-4.3-3.2-7.8-7.2-7.8c-2.2,0-4.2,1.1-5.5,2.8c-4.9,6.4,1,14.9,5.6,19.5C55.1,98.1,57.4,100.5,60,102.3z" />
        </g>
    </defs>
    
    <!-- 灰色图形 -->
    <g fill="none" stroke="#EEE" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <use xlink:href="#gg" />
    </g>
    
    <!-- 动画元素 -->
    <g  fill="none" stroke="#000" stroke-width="1" stroke-linecap="butt" stroke-linejoin="round">
        <use xlink:href="#line" class="anim" />
        <use xlink:href="#rect" class="anim" />
        <use xlink:href="#circle" class="anim" />
        <use xlink:href="#football" class="anim" />
        <use xlink:href="#bit" class="anim" />
        <use xlink:href="#diamond" class="anim" />
        <use xlink:href="#heart" class="anim" />
    </g>
    
    <!-- 红色标记线 -->
    <g fill="none" stroke="#F32D66" stroke-width="3" stroke-linecap="butt" stroke-linejoin="round" stroke-dasharray="0.5 100">
        <use xlink:href="#gg" />
    </g>
</svg>  
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0467936b8cf43388f056fd788b915cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150&h=644&s=583791&e=gif&f=98&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/YzgoaOX

  


正如你所看到的，我们可以按照下面的模式动画化绘制线条：

  


```CSS
@keyframes reveal {
    to {
        stroke-dashoffset: 0;
    }
}

.animated {
    --line-full-length: FULL_LENGTH;
    stroke-dashoffset: var(--line-full-length);
    stroke-dasharray: var(--line-full-length);
    
    animation: reveal 1s ease-in-out infinite;   
}
```

  


注意，`FULL_LENGTH` 是指 SVG 路径的长度，可以 根据 `SVGGeometryElement.getTotalLength()` 获得该值。另外，`stroke-dashoffset` 应尽量避免使用负值，因为负值在 Safari 上可能会出现闪烁的现象。

  


在给 SVG 线条添加动画时，你希望能控制动画的方向，比如，按顺时针方向运动或按逆时针方向运动。在上面的示例中，足球（`football`）和心形（`heart`）的方向是逆时针的，其他图形则是顺时针的。如果，希望足球和心形的结动运动方向也是顺时针的话，我们可以通过下面这种方式来完成：

  


-   该线是不可见的，有 `0` 个单位的虚线和 `100` 个单位间隔
-   它变为可见，有 `100` 个单位的虚线和 `0` 个单位的间距
-   `stroke-dashoffset` 将其拉回 `100` 个单位，从而反转它

  


```CSS
@keyframes reversed {
    from {
        stroke-dasharray: 0 100;
        stroke-dashoffset: 0;
    }
    to {
        stroke-dasharray: 100 0;
        stroke-dashoffset: 100;
    }
}

.football,.heart {
    animation: reversed 1s ease-in-out forwards;   
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4402638381fc4784beba5b90dfb220aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=678&s=365021&e=gif&f=49&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/KKEjRKB

  


也就是说，你可以按照以下的方式来反转线条运动方向：

  


```CSS
@keyframes reversed {
    from {
        stroke-dasharray: 0 FULL_LENGTH;
        stroke-dashoffset: 0;
    }
    to {
        stroke-dasharray: FULL_LENGTH 0;
        stroke-dashoffset: FULL_LENGTH;
    }
}

.reversed {
    animation: reversed 1s ease-in-out infinite;
}
```

  


只要理解了线条的虚线模式，就能很容易理解上面的代码发生了什么。

  


另外一种方式是，使线条的 `stroke-dasharray` 保持在完整长度（`FULL_LENGTH`）的固定位置，只动画化线条的 `stroke-dashoffset` ，并且从完整长度（`FULL_LENGTH`）过渡到双倍长度（`FULL_LENGTH x 2`）：

  


```CSS
@keyframes reversed {
    from {
        stroke-dashoffset: 100; /* 100 是线条的完整长度，即 FULL_LENGTH */
    }
    to {
        stroke-dashoffset: 200; /* 200 是线条完整长度的两倍，即 FULL_LENHTG x 2 */
    }
}

.football,
.heart {
    stroke-dasharray: 100; /* 100 是线条的完整长度，即 FULL_LENGTH  */
    animation: reversed 2s ease-in-out infinite;
}
```

  


> Demo 地址：https://codepen.io/airen/full/BabgxQY

  


接下来，我们再来看看如何控制线条绘制的起点，即移动动画的起点。由于线条就像一个环绕循环的火车，轨道从哪里开始并不重要。通常情况之下，移动动画的起点有三种不同的方式：

  


-   从另一则开始：从封闭路径的另一侧或开放路径的中点开始
-   反向并从另一侧开始：在保留先前更改的方向的同时，从相反的一侧开始
-   任意起点：具有自定义的起点

  


先来看从封闭路径的另一侧或开放路径的中点开始为例。类似于上一个技巧，`stroke-dasharray` 属性的值互换位置，从而绘制一条线。由于 `stroke-dashoffset` 保持不变，原始绘制方向将保持不变。然后，通过将 `stroke-dashoffset` 设置为线条总长度（`FULL_LENGTH`）的一半，线条动画将从相反的一侧开始，这对于对称路径非常有用：

  


```CSS
@keyframes start-from-other-side {
    from {
        stroke-dasharray: 0 100; /* 100 是线条总长度 FULL_LENGTH */
        stroke-dashoffset: 50;  /* 50 是线条总长度 FULL_LENGTH 的一半 */
    }
    to {
        stroke-dasharray: 100 0; /* 100 是线条总长 FULL_LENGTH */
        stroke-dashoffset: 50;   /* 50 是线条总长度 FULL_LENGTH */
    }
}

.animated {
    animation: start-from-other-side 1s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abb354924d824121982ae0801b6db002~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=638&s=594394&e=gif&f=103&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/qBvzYpN

  


注意，就上面这个示例，还可以将 `@keyframes` 中的 `stroke-dashoffset` 移到动画元素（需要动画的线条元素）上：

  


```CSS
@keyframes start-from-other-side {
    from {
        stroke-dasharray: 0 100; /* 100 是线条总长度 FULL_LENGTH */
    }
    to {
        stroke-dasharray: 100 0; /* 100 是线条总长 FULL_LENGTH */
    }
}

.animated {
    stroke-dashoffset: 50;  /* 50 是线条总长度 FULL_LENGTH 的一半 */    
    animation: start-from-other-side 1s ease-in-out infinite;
}
```

  


它们最终达到的效果是一样的。

  


你也可以选择动画反向并从另一侧开始。你可以选择在线条的半长度上偏移（`stroke-dashoffset` 的值是线长总长度 `FULL_LENGTH` 的一半），也可以选择从其他值开始。然而，你需要将完整的长度添加到其中，以反转方向：

  


```CSS
@keyframes other-side-and-reverse {
    from {
        stroke-dasharray: 0 100; /* 100 是线条总长度 FULL_LENGTH */
        stroke-dashoffset: 50;   /* 50 是线条总长度 FULL_LENGTH 的一半 */
    }
    to {
        stroke-dasharray: 100 0; /* 100 是线条总长度 FULL_LENGTH */
        stroke-dashoffset: 150;  /* 150 是线条总度的 1.5 倍 （线长总长度 + 线条总长度的一半）*/
    }
}

.animated {
    animation: other-side-and-reverse 1s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a3c48ba427e4715aa9e24ca3a1b3978~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=662&s=405816&e=gif&f=66&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/poYXVKm

  


你只需要将 `stroke-dashoffset` 属性设置为任意值，例如 `17` 个单位，可以指定线条动画的任意起点：

  


```CSS
@keyframes custom-start-point {
    from {
        stroke-dasharray: 0 100; /* 100 是线条总长度 FULL_LENGTH */
    }
    to {
        stroke-dasharray: 100 0; /* 100 是线条总长度 FULL_LENGTH */
    }
}

.animated {
    stroke-dashoffset: 17; /* 可以是任意值 */
    animation: custom-start-point 1s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8f5bce17ba84ecf9c7ee43783122b75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=648&s=604445&e=gif&f=104&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/JjzQvmb

  


你还可以将线条从内向外移动。只需要将 `stroke-dashoffset` 从线长总长度（`FULL_LENGTH`）过渡到总长度的一半：

  


```CSS
@keyframes inside-out {
    from {
        stroke-dasharray: 0 100; /* 100 是线条总长度 FULL_LENGTH */
        stroke-dashoffset: 50;   /* 50 是线条总长度 FULL_LENGTH 的一半 */
    }
    to {
        stroke-dasharray: 100 0; /* 100 是线条总长度 FULL_LENGTH */
        stroke-dashoffset: 100;  /* 100 是线条总长度 FULL_LENGTH */
    }
}

.animated {
    animation: inside-out 1s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3acf42efe1a04765badef03a1d5777f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=656&s=736918&e=gif&f=96&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/rNREvEx

  


同样的，反过来也是可以的，动画从外到内。对于开放路径（例如直线），将会创建出“双线”效果，就像有两支笔在同时绘制 SVG 线条一样。它通过将 `0` 虚线，`100` 间隙的线换换为 `50` 虚线，`0` 间隙版本来实现。

  


```CSS
@keyframes outside-in {
    from {
        stroke-dasharray: 0 100; /* 100 是线条总长度 FULL_LENGTH */
    }
    to {
        stroke-dasharray: 50 0; /* 50 是线条总长度 FULL_LENGTH 的一半 */
    }
}

.animated {
    animation: outside-in 1s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68ceb3d5e46c4ca281570f281786e975~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=654&s=690982&e=gif&f=91&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/wvOLXwN

  


对动画如何绘制线条有完全的控制权可能非常方便。从定义上来说，控制起始点和结束点意味着动画具有两个移动的线头，它们共同到达目的地。否则，SVG 的一部分将保持不可见。如果关键点靠近，一条线段将移动缓慢，而另一条线段需要快速移动，以同时覆盖更多区域。

  


```CSS
@keyframes custom-start-end {
    from {
        stroke-dasharray: 0 100; /* 100 是线条总长度 FULL_LENGTH */
        stroke-dashoffset: 34;   /* 34 任意值，动画任意起点*/
    }
    to {
        stroke-dasharray: 100 0; /* 100 是线条总长度 FULL_LENGTH */
        stroke-dashoffset: 68;  /* 68 任意值，动画任意结束点 */
    }
}

.animated {
    animation: custom-start-end 1s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28fe2e2ea50d4ce983d13b360cb2ae74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=712&s=728982&e=gif&f=75&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/YzgovXa

  


正如前面这几个示例所演示的一样，在 `@keyframes` 中调整 `stroke-dasharray` 和 `stroke-dashoffset` 将得到不同的线条动画。这也是 SVG 线条动画在 Web 应用或网站上得到广泛应用的主要原因之一。

  


例如，给链接添加与众不同的悬浮效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6da3046025745888703186d3a7783ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=378&s=85885&e=gif&f=143&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/qBvzGJY

  


上面示例中的下划线是 SVG 的 `<rect>` 绘制的：

  


```HTML
<div class="container">
    <svg height="60" width="100%" xmlns="http://www.w3.org/2000/svg">
        <rect class="shape" height="60" width="100%" />
    </svg>
   <div class="text">HOVER ME</div>
</div> 
```

  


CSS 调整 `<rect>` 元素的 `stroke-dasharray` 和 `stroke-dashoffset` 属性，使其在视觉上看上去不是一个矩形，只是文本的下划线。然后在 `@keyframes` 中修改它们的最终值，最终得到你所看到的悬浮效果：

  


```CSS
@layer animation {
    @keyframes draw {
        0% {
            stroke-dasharray: 230 540;
            stroke-dashoffset: -398;
            stroke-width: 8px;
        }
        100% {
            stroke-dasharray: 760;
            stroke-dashoffset: 0;
            stroke-width: 2px;
        }
    }
    
    .shape {
        fill: transparent;
        stroke-dasharray: 230 540;
        stroke-dashoffset: -398;
        stroke-width: 8px;
        stroke: #ff3366;
        
        .container:hover {
            animation: 0.5s draw linear forwards;
        }    
    }
}
```

  


还可以给文本和图标制作自擦除的动画效果，例如下面这个文本描边效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbc23df2b5394ec48863102f75a0ab0c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=510&s=4097188&e=gif&f=181&b=061d27)

  


> Demo 地址：https://codepen.io/airen/full/abMgrXq

  


实现上面效果，其核心代码如下：

  


```SVG
<svg viewBox="0 0 1200 600" class="anim">
    <symbol id="s-text">
        <text text-anchor="middle" x="50%" y="35%" class="text--line">
            SVG
        </text>
        <text text-anchor="middle" x="50%" y="68%" class="text--line2">
            Animation
        </text>
    </symbol>

    <g class="g-ants">
        <use xlink:href="#s-text" class="text-copy" style="--index: 1;" />
        <use xlink:href="#s-text" class="text-copy" style="--index: 2;" />
        <use xlink:href="#s-text" class="text-copy" style="--index: 3;" />
        <use xlink:href="#s-text" class="text-copy" style="--index: 4;" />
        <use xlink:href="#s-text" class="text-copy" style="--index: 5;" />
        <use xlink:href="#s-text" class="text-copy" style="--index: 6;" /
    </g>
</svg>
```

  


```CSS
@layer animation {
    @keyframes stroke-offset {
        50% {
            stroke-dashoffset: 42%;
            stroke-dasharray: 0 87.5%;
        }
    }

    .text-copy {
        fill: none;
        stroke-dasharray: 7% 28%;
        stroke-width: 10px;
        animation: stroke-offset 12s infinite linear;
    }
}
```

  


下面这个是动画化线条绘制小企鹅图形的动画。对三条不同的路径进行绘制：

  


```SVG
<svg x="0px" y="0px" width="250px" height="250px" viewBox="0 0 250 250">
    <path class="path" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="  M219.638,217.784c-5.204-11.196-1.548-24.239-1.548-24.239c-10.28-57.368-44.34-67.251-61.09-76.96s-1.641-16.537,7.68-16.728  s13.737-1.869,13.242-7.182C175.25,81.5,121.75,78.5,111.176,119.907c-3.073,16.19,21.835,39.559,26.068,60.438  c0.684,3.691-5.729,8.884-24.906-0.249c-19.178-9.133-23.088-30.346-33.699-34.514c-43.51-14.963-50.188,59.404-50.188,59.404  c24.735,9.521,36.923-18.126,66.668-38.722"/>
    <path class="path2" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="  M124.241,151.721c29.446-9.411,64.104-4.367,91.04,42.945c0,0-33.618,3.563-31.382,39.307c22.249,3.821,35.751-15.939,35.751-15.939  c6.006,13.203,22.958,18.904,22.958,18.904c16.673-33.518-14.624-49.546-14.624-49.546C245.333,68.601,167.75,54.5,134.502,52.163  C88.5,49,96.252,18.706,97,7.125C64.875,15,71.667,56.667,68.752,58.141C-45.066,124.14,20.167,201.375,27.667,204.5"/>
    <path class="eye" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="  M23.833,146.667c11.667,1.833,14.16-23.786,3.83-25.56S12.167,144.834,23.833,146.667z"/>
</svg>
```

  


```CSS
@layer animation {
    .path {
        stroke-dasharray: 572;
        stroke-dashoffset: 572;
        animation: pathAnimation 1.2s linear 0.001s forwards;
        visibility: hidden;
    }

    .path2 {
        stroke-dasharray: 800;
        stroke-dashoffset: 800;
        animation: pathAnimation2 1.5s linear 1.2s forwards;
        visibility: hidden;
    }

    .eye {
        stroke-dasharray: 68;
        stroke-dashoffset: 68;
        animation: eyeAnimation 0.5s linear 2.72s forwards;
        visibility: hidden;
    }

    @keyframes pathAnimation {
        from {
            visibility: hidden;
            stroke-dashoffset: 572;
        }
        to {
            visibility: visible;
            stroke-dashoffset: 0;
        }
    }

    @keyframes pathAnimation2 {
        from {
            visibility: hidden;
            stroke-dashoffset: 800;
        }
        to {
            visibility: visible;
            stroke-dashoffset: 0;
        }
    }

    @keyframes eyeAnimation {
        from {
            visibility: hidden;
            stroke-dashoffset: 68;
        }
        to {
            visibility: visible;
            stroke-dashoffset: 0;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f23856b990f48299e1b6e52aace4e97~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=414&s=200672&e=gif&f=250&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/vYPoYQO

  


你可能会认为上面所展示的动画效果没有太多的实际意义。事实上，并非如此。利用 SVG 线条动画，你可以为 Web 应用或网站提供与众不同的效果。例如 [@Genaro Colusso](https://codepen.io/genarocolusso) 提供的 404 页面的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9367b87336d242f9a4e0a0898be62791~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=428&s=1894534&e=gif&f=187&b=fefefe)

  


> Demo 地址：https://codepen.io/genarocolusso/full/XWbGMLp （来源于 [@Genaro Colusso](https://codepen.io/genarocolusso)）

  


一些与众不同的页面加载动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af086c5b180842d6953d4922b30f25ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=472&s=276366&e=gif&f=108&b=16151a)

  


> Demo 地址：https://codepen.io/jkantner/full/abwgLNX （来源于 [@Jon Kantner](https://codepen.io/jkantner)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8642601dc8b34022b2d3d577d2559295~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=476&s=605944&e=gif&f=70&b=ffffff)

  


> Demo 地址：https://codepen.io/ainalem/full/eYmGLyp （来源于 [@Mikael Ainalem](https://codepen.io/ainalem)）

  


还可以是一些 UI 组件，例如常见的圆形进度条效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb57aa574b1e4adf876df3ac6eff961d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=504&s=225504&e=gif&f=153&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/WNmVNVd

  


使用两个 `<path>` 创建两个圆环，然后通过 `stroke-dasharray` 对内圆环（绿色）做动画处理：

  


```SVG
<svg viewBox="0 0 36 36" class="circular-chart" width="300">
    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill=" none" stroke = "#eee" stroke-width= "3.8" />
    <path class="circle" stroke-dasharray="30, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831  a 15.9155 15.9155 0 0 1 0 -31.831" fill = "none" stroke-width =  "2.8" stroke-linecap = "round" stroke = "#4CC790"/>
    <text x="18" y="20.35" class="percentage">30%</text>
</svg>
```

  


```CSS
@layer animation {
    @keyframes progress {
        0% {
            stroke-dasharray: 0 100;
        }
    }
    
    .circle {
        stroke-dasharray: 30 100;
        animation: progress 1s ease-out forwards;
    }
}
```

  


在此基础上，借助一些 JavaScript 脚本，还可以制作一些更复杂的 UI 组件，例如 [@Jon Kantner](https://codepen.io/jkantner) 写的一个圆环时钟效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75ae7895aa2f4b6f9267a89d2cf25f89~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=550&s=1106243&e=gif&f=102&b=16151a)

  


> Demo 地址：https://codepen.io/jkantner/full/MWEmExB （来源于 [@Jon Kantner](https://codepen.io/jkantner)）

  


上面所展示的只是 SVG 常见的一些动画效果，你可以发挥你自己的创意，制作出一些更优秀的 SVG 线条动画效果。由于篇幅所限，有关于 SVG 的线条动画就暂时聊到这里。

  


### 路径动画

  


在现实生活中，很少有东西沿着直线运动，因此沿着路径运动允许我们模仿我们在目常生活中看到的运动。[通过 SMIL 动画的学习](https://juejin.cn/book/7288940354408022074/section/7308623556815159307)，我们知道，在 SVG 中，我们可以使用 `<animateMotion>` 来构建一个物体沿着指定的路径进行运动。

  


```SVG
<svg viewBox="-10 -10 173 61" width="300" class="anim">
    <path d="M153,20.89c0-45.88-74.95,0-74.95,0S.5,66.76.5,20.89s77.54,0,77.54,0S153,66.76,153,20.89Z" fill="none" stroke="#000" stroke-dasharray="4" stoke-width="4" class="infinity" />
    <circle r="5" cx="0" cy="0" fill="purple" class="circle" >
        <animateMotion dur="5s" repeatCount="indefinite" path="M153,20.89c0-45.88-74.95,0-74.95,0S.5,66.76.5,20.89s77.54,0,77.54,0S153,66.76,153,20.89Z" /> 
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ca12d62329a4d7190b8aea09bafdc54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150&h=528&s=446159&e=gif&f=114&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/vYPoEZg

  


SMIL 的 `<animateMotion>` 构建路径动画很简单，可 SMIL 将会慢慢被遗弃。庆幸的是，CSS 提供了相应的替代方案，这意味着，我们可以直接使用 CSS 来实现路径动画。小册的《[CSS 路径动画：动画对象沿着指定路径运动](https://juejin.cn/book/7288940354408022074/section/7308623339038670860)》一节课中，详细向大家介绍了如何使用 CSS 的 `offset-path` 、`offset-distance` 、`offset-rotate` 和 `offset-anchor` 等属性实现元素沿着指定路径运动。

  


就拿上面的示例来说，我们使用 CSS 的话，同样可以实现相似的效果：

  


```SVG
<svg viewBox="-10 -10 173 61" width="300" class="anim">
    <path d="M153,20.89c0-45.88-74.95,0-74.95,0S.5,66.76.5,20.89s77.54,0,77.54,0S153,66.76,153,20.89Z" fill="none" stroke="#000" stroke-dasharray="4" stoke-width="4" class="infinity" />
    <circle r="5" cx="0" cy="0" fill="purple" class="circle" />
</svg>
```

  


```CSS
@layer animation {
    @keyframes infinity {
        from {
            offset-distance: 0%;
        }
    
        to {
            offset-distance: 100%;
        }
  }
    
    .circle {
        offset-path:path("M153 20.89c0-45.88-74.95 0-74.95 0S.5 66.76.5 20.89s77.54 0 77.54 0S153 66.76 153 20.89Z");
        animation: infinity 5s infinite linear;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff91353f003d4e0fbeb8f003c85c008e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=498&s=294462&e=gif&f=70&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/WNmVbzg

  


正如上面示例所示，你可以将任何物体按你所需的路径运动，例如下面这个火箭沿着指定路径，从屏幕左下角向右上角移动：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac38322d85fd42bc99687c115d8794fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1308&h=736&s=2197273&e=gif&f=259&b=300133)

  


> Demo 地址：https://codepen.io/airen/full/NWJQPeE

  


上面示例对应的代码如下所示：

  


```SVG
<svg  viewBox="0 0 1300 1000" class="anim">
    <!-- 运动路径，可以根据需要，使该路径不在屏幕上显示 -->
    <path id="path" fill="none" stroke="#90acef" stroke-miterlimit="10" stroke-width="2" stroke-dasharray="10 20.1" d="M20.2 679.7c210.3-19.1 398.9-219.6 236.5-257.5-170.5-16.8-132.5 146.2-6.8 184.7 141.6 55.7 242.3-9.9 215.3-89.3-43.7-94-330-292-85-347.3 135.5-18.7 251 54.7 302.9 141.5 50.2 85 25.5 183.8 136.6 248.6C1000 627 1037.7 427 1039 395.7c20.3-196.6-133.8-218-199.5-170s-11.3 138.5 107 114S1126.7 147.6 1092.6 67c-2.4-12.2-1.4-23.1 9.2-31.8 100.8-49.4 112.2 198.4 239-23.8"/>
 
    <!-- 火箭图形 --> 
    <g class="rocket">
        <g fill="#fff">
            <path d="M77.4 651.4a13.3 13.3 0 00-14.8-11.6c-19 2.2-29.8 17-55.5 20 25.7-3 39.7 8.7 58.7 6.4a13.3 13.3 0 0011.6-14.8z" opacity=".5" style="isolation:isolate"/>
            <path d="M77.4 651.4a9 9 0 00-9.9-7.8c-12.7 1.5-20 11.4-37.1 13.4 17.2-2 26.5 5.8 39.2 4.3a9 9 0 007.8-9.9z"/>
        </g>
        <g fill="#63c6be">
            <path d="M111.9 669.7l-15.1 13.7a8.4 8.4 0 01-6.7 2.1l-23-2.8a1 1 0 01-1-1.1 1 1 0 01.2-.5l14-19.7z"/>
            <path d="M106.7 625.4L89 615.5a8.4 8.4 0 00-7-.5l-21.8 8a1 1 0 00-.3 1.7l18.2 16z"/>
        </g>
        
        <path fill="#fff" d="M173.2 640.3c-18.8-18.2-72-23.2-94.7-4a2.6 2.6 0 00-1 2.2l3 25a2.6 2.6 0 001.4 2c26.4 13.6 77-3.3 91.3-25.2z"/>
        <path fill="#63c6be" d="M173.2 640.3a63.6 63.6 0 00-30.8-14c-.4-6.5 4 34.5 4 34.5a63.7 63.7 0 0026.8-20.5z"/>
        <circle cx="123.2" cy="646" r="11.7" fill="#63c6be" transform="rotate(-49.2 123.2 646)"/>
        <path fill="#22173f" d="M125.7 655a9.4 9.4 0 116.6-11.5 9.4 9.4 0 01-6.6 11.6z"/>
    </g>
</svg>
```

  


```CSS
@layer animation {
    @keyframes fly {
        from {
            offset-distance: 0%;
        }
        to {
            offset-distance: 100%;
        }
     }
        
    .rocket {
        transform-box: fill-box;
        offset-anchor: 50% 50%;
        transform-origin: 50% 50%;
        offset-rotate: auto;
        offset-path: path("M20.2 679.7c210.3-19.1 398.9-219.6 236.5-257.5-170.5-16.8-132.5 146.2-6.8 184.7 141.6 55.7 242.3-9.9 215.3-89.3-43.7-94-330-292-85-347.3 135.5-18.7 251 54.7 302.9 141.5 50.2 85 25.5 183.8 136.6 248.6C1000 627 1037.7 427 1039 395.7c20.3-196.6-133.8-218-199.5-170s-11.3 138.5 107 114S1126.7 147.6 1092.6 67c-2.4-12.2-1.4-23.1 9.2-31.8 100.8-49.4 112.2 198.4 239-23.8");
        animation: fly 10s infinite ease-in-out;
    }
}
```

  


> 关于路径动画的更多案例和相关介绍，请移步阅读小册的 《[CSS 路径动画：动画对象沿着指定路径运动](https://juejin.cn/book/7288940354408022074/section/7308623339038670860)》！

  


### 变形动画

  


现如今天，在 Web 应用或网站上时常能看到变形动画，该动画效果常用于形状变形、文本变形上，在一些交互效果上也能常看到，例如用鼠标悬浮在用户头像时变形。

  


在 SVG 中，我们知道通过 `<animate>` 改变路径的 `d` 属性，能轻易实现变形动画效果：

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" width="288" height="288" viewBox="0 0 288 288" class="element">
    <linearGradient id="PSgrad_0" x1="70.711%" x2="0%" y1="70.711%" y2="0%">
        <stop offset="0%" stop-color="rgb(95,54,152)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(247,109,138)" stop-opacity="1" />
    </linearGradient>
    <path fill="url(#PSgrad_0)">
        <animate repeatCount="indefinite" attributeName="d" dur="5s" values="M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45
        c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2
        c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7
        c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z;
        
        
        M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4
        c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6
        c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8
        C48.9,198.6,57.8,191,51,171.3z;
        
        M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45
        c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2
        c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7
        c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z        " />
    </path>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84edec0b948a4db98130444c241aa5a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=516&s=1125473&e=gif&f=81&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/rNRbXVa

  


上面这个 SVG 的变形动画效果，在 CSS 中同样可以实现：

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" width="288" height="288" viewBox="0 0 288 288" class="element">
    <linearGradient id="PSgrad_0" x1="70.711%" x2="0%" y1="70.711%" y2="0%">
        <stop offset="0%" stop-color="rgb(95,54,152)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(247,109,138)" stop-opacity="1" />
    </linearGradient>
    <path class="morphing" fill="url(#PSgrad_0)" />
</svg>
```

  


首先在 CSS 中给 `<path>` 指定 `d` 属性的初始值，然后在 `@keyframes` 改变 `d` 属性的值即可：

  


```CSS
@layer animation {
    @keyframes morphing {
        0%, 100%{
            d:path('M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45        c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2        c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7        c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z');
        }
        50%{
            d:path('M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4 c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6        c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8        C48.9,198.6,57.8,191,51,171.3z')
        }
    }
  
    .morphing {
        d:path('M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45        c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2        c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7        c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z');
        animation: morphing 5s linear infinite;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a87037f364243c7b3e604f2f577b789~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=476&s=952838&e=gif&f=64&b=300133)

  


> Demo 地址：https://codepen.io/airen/full/LYawVbz

  


基于上面这个示例，我们只需要稍微调整一下，就可以给用户头像添加一个变形的过渡动画效果：

  


```SVG
<svg viewBox="0 0 1024 768" class="avatar">
    <clipPath id="mask1">
        <path class="anim" d="M804,437C804,619.53,582.03,721,399.5,721S69,573.03,69,390.5S216.97,60,399.5,60S804,254.47,804,437Z"/>
    </clipPath>
  
    <image x="0" y="0"  height="800" clip-path="url(#mask1)"  xlink:href="http://i.pravatar.cc/500?img=7" />
</svg>
```

  


```CSS
@layer animation {
    .anim {
        d: path("M804,437C804,619.53,582.03,721,399.5,721S301,625.53,301,443S216.97,60,399.5,60S804,254.47,804,437Z");
        transition: d 300ms linear;
    
        .avatar:hover & {
            d: path("M771,436C753,627,582.03,721,399.5,721S139,646.53,139,464S405.47,78,588,78S788.126,254.275,771,436Z");
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bf8c3ca49794bcaad13a59b7fc030c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1158&h=676&s=6250953&e=gif&f=91&b=300133)

  


> Demo 地址：https://codepen.io/airen/full/NWJQqBW

  


你还可以结束其他的 CSS 特性制作出更具创意的变形动画效果，例如 [@Dominika](https://codepen.io/magiai) 基于 SVG 滤镜和 CSS 的 `clip-path` 制作的文字变形效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6148a10219c4c228bc02d7252718c50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=614&s=17674696&e=gif&f=61&b=bbaaa5)

  


> Demo 地址：https://codepen.io/magiai/full/YzaeQQy

  


### 文本动画

  


给文本添加动画效果是 SVG 动画被广泛应用的另一个场景。从简单的文本淡入淡出效果，到文本的线条效果，可以说，无处不在。

  


例如下面这个淡入淡出文本动画，它类似于在 HTML 中使用 CSS 实现的文本闪烁效果。

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" class="blinking--text" width="400" height="200" viewBox="0 0 400 200">
    <text class="text-animation-title" text-anchor="middle" x="50%" y="50%">
        Blinking Text
    </text>
</svg>
```

  


让我们使用 SVG 的 `<text>` 元素，并使用 CSS 设置一个关键帧动画来切换文本不透明度，实现平滑的淡入淡出 SVG 文本动画：

  


```CSS
@layer animation {
    @keyframes blink {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
        
    .blinking--text {
         animation: blink 0.5s ease-in infinite alternate;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0957ee130654aa390d2b5a4fab751f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=444&s=949666&e=gif&f=68&b=300133)

  


> Demo 地址：https://codepen.io/airen/full/XWGvNqM

  


在此基础上，我们可以很轻易扩展出一个 Loading 动画效果：

  


```SVG
<svg viewBox="0 0 240 240" class="loading">
    <circle cx="35" cy="35" r="60" fill="none"/>
    <text x="32%" y="52%">Loading...</text>
</svg>
```

  


```CSS
@layer animation {
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes text {
        0%,
        100% {
            fill: #555;
        }
        50% {
            fill: #eee;
        }
    }

    @keyframes loader {
        0% {
            stroke: #3498db;
            stroke-width: 10;
            troke-dasharray: 320;
            stroke-dashoffset: -180;
        }
        65% {
            stroke: #27ae60;
            stroke-width: 8;
            stroke-dasharray: 160;
            stroke-dashoffset: -90;
        }
        100% {
            stroke: #3498db;
            stroke-width: 10;
            rotate: 270deg;
            stroke-dasharray: 320;
            stroke-dashoffset: -180;
        }
    }

    .loading {
        circle {
            stroke-dasharray: 320;
            stroke-linecap: round;
            animation: loader 2s infinite ease-in-out;
            transform-origin: center;
            rotate: -90deg;
            cx: 50%;
            cy: 50%;
        }
        text {
            animation: text 2s infinite, fadeIn 2s ease-in-out infinite;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fb389bdeed84e3fad4d63f0472e2b0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=574&s=1483417&e=gif&f=113&b=300133)

  


> Demo 地址：https://codepen.io/airen/full/LYawbBd

  


我们还可以通过 SVG 的 `<text>` 元素（包裹单个字母）并结合 CSS 的变换特性来改变每个字母在 `Y` 轴上的位置，从而实现类似于波浪形运动的文本动画：

  


```SVG
<svg width="400" class="wavy-text" viewBox="0 0 800 200">
    <g>
        <text y="50%" class="char" style="--index: 1;">A</text>
        <text y="50%" x="11.111%" class="char" style="--index: 2;">N</text>
        <text y="50%" x="22.222%" class="char" style="--index: 3;">I</text>
        <text y="50%" x="33.333%" class="char" style="--index: 4;">M</text>
        <text y="50%" x="44.444%" class="char" style="--index: 5;">A</text>
        <text y="50%" x="55.555%" class="char" style="--index: 6;">T</text>
        <text y="50%" x="66.666%" class="char" style="--index: 7;">I</text>
        <text y="50%" x="77.777%" class="char" style="--index: 8;">O</text>
        <text y="50%" x="88.888%" class="char" style="--index: 9;">N</text>
    </g>
</svg>
```

  


```CSS
@layer animation {
    @keyframes wave {
        0%,
        100% {
            translate: 0 0;
        }
        25%,
        50% {
            translate: 0 50%;
        }
    }
  
    .char {
        --delay: 100ms;
        --_delay: calc(var(--index) * var(--delay));
        
        transform-origin: center;
        translate: 0 0;
        animation: wave 1s ease-in-out infinite var(--_delay);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cfa48c7d3464110b35ce6ee16f8c9c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=506&s=2098190&e=gif&f=102&b=300133)

  


> Demo 地址：https://codepen.io/airen/full/PoLMbVv

  


在 Web 上，有的时候会需要将文本环绕着指定的路径排列，例如环绕一个圆排列，这在 SVG 中很容易就能实现，例如：

  


```SVG
<svg width="800" viewBox="100 100 200 200" class="text--circle">
    <path id="myTextPath" d="M -64,0 A 64 64 0 0 1 64,0 A 64,64 0 0 1 -64,0" transform="translate(200,200)" fill="none" stroke="#ea9ab2" stroke-width="25"/>

    <text fill="#fefae0" stroke-width="0" stroke="none">
        <textPath xlink:href="#myTextPath">
            <tspan dy="5">Ein Torten-Text im Halbkreis  </tspan>
        </textPath>
    </text>
    
    <clipPath id="clipCircle">
        <circle r="50" cx="200" cy="200"/>
    </clipPath>
 
    <image x=120 y=140 height=110 clip-path="url(#clipCircle)" href="https://images.unsplash.com/photo-1606871807176-1c9f5ebacd52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=550&q=80"  />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c67aadba609470e8bcc98c19e681694~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1295&s=456049&e=jpg&b=320b38)

  


> Demo 地址：https://codepen.io/airen/full/RwdXoXd

  


你可以基于这个基础上，给文本添加一些动画效果。感兴趣的同学可以尝试一下！

  


### 遮罩动画

  


在 CSS 中，我们可以通过 [CSS 的 Masking ](https://juejin.cn/book/7223230325122400288/section/7259668885224456252)（遮罩）特性来创建很多与众不同的效果，包括遮罩动效。在 SVG 中同样如此。例如下面这个探照灯的效果，使用了 SVG 的 `mask` 功能，并使用 CSS 做了简单的位移动效：

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" width="600" viewBox="0 0 600 100">
    <defs>
        <mask id="experiment">
            <path fill="#000" class="experiment" d="M150.142 73.467v-46.61h34.56v7.884h-25.15v10.335h23.402v7.854h-23.4v12.685h26.04v7.854H150.14v-.003zM188.835 73.467l15.93-24.323-14.436-22.288h11l9.348 14.976 9.157-14.976h10.905l-14.498 22.638 15.93 23.974H220.82l-10.333-16.12-10.365 16.12h-11.287zM237.004 73.467v-46.61h15.103c5.723 0 9.453.233 11.19.698 2.672.7 4.908 2.22 6.71 4.562 1.8 2.343 2.702 5.37 2.702 9.078 0 2.86-.52 5.268-1.56 7.217-1.038 1.95-2.357 3.482-3.957 4.595-1.6 1.112-3.227 1.85-4.88 2.21-2.247.445-5.5.667-9.76.667h-6.137v17.583h-9.412zm9.41-38.727v13.227h5.152c3.71 0 6.19-.243 7.44-.73 1.25-.488 2.23-1.25 2.94-2.29.71-1.038 1.066-2.246 1.066-3.624 0-1.695-.498-3.095-1.494-4.197-.997-1.102-2.257-1.79-3.784-2.066-1.124-.21-3.38-.318-6.772-.318h-4.547v-.002zM280.435 73.467v-46.61h34.56v7.884h-25.148v10.335h23.4v7.854h-23.4v12.685h26.04v7.854h-35.452v-.003zM323.898 73.467v-46.61h19.81c4.98 0 8.6.418 10.856 1.255 2.258.838 4.063 2.326 5.42 4.467 1.356 2.14 2.035 4.59 2.035 7.345 0 3.496-1.028 6.385-3.085 8.664-2.058 2.276-5.13 3.715-9.222 4.307 2.035 1.188 3.716 2.492 5.04 3.912 1.325 1.42 3.11 3.94 5.357 7.564l5.69 9.094h-11.255l-6.805-10.143c-2.416-3.625-4.07-5.908-4.96-6.853-.89-.943-1.833-1.59-2.83-1.938-.996-.35-2.575-.525-4.737-.525h-1.906v19.458h-9.41zm9.413-26.9h6.964c4.515 0 7.332-.19 8.457-.57 1.124-.383 2.003-1.04 2.64-1.972.636-.934.954-2.1.954-3.498 0-1.568-.42-2.834-1.257-3.8s-2.018-1.573-3.545-1.827c-.764-.106-3.053-.16-6.867-.16h-7.344v11.828zM370.604 73.467v-46.61h9.412v46.61h-9.412zM388.855 73.467v-46.61h14.084l8.456 31.793 8.362-31.794h14.115v46.61h-8.742v-36.69l-9.25 36.69h-9.063l-9.22-36.69v36.69h-8.742zM443.223 73.467v-46.61h34.562v7.884h-25.148v10.335h23.4v7.854h-23.4v12.685h26.04v7.854h-35.453v-.003zM486.75 73.467v-46.61h9.156l19.076 31.125V26.856h8.743v46.61h-9.442l-18.79-30.395v30.397h-8.743zM544.17 73.467V34.74h-13.83v-7.885h37.04v7.885h-13.8v38.727h-9.41z" />
            <path class="tube" fill="#020202" d="M136.07 27.246h-22.185v5.547h2.31V67.92c0 3.05 2.497 5.547 5.547 5.547h6.47c3.052 0 5.547-2.496 5.547-5.547V32.793h2.31v-5.547zm-4.62 33.74h-11.094v-1.848h11.093v1.848zm0-6.93h-6.472v-1.85h6.47v1.85zm0-6.935h-11.094v-1.848h11.093v1.85zm0-6.932h-6.472V38.34h6.47v1.848z" />
            <circle fill="#fff" cx="66.836" cy="50.356" r="34" />
        <mask>
    </defs>

    <path mask="url(#experiment)" class="experiment" fill="yellow" d="M150.142 73.467v-46.61h34.56v7.884h-25.15v10.335h23.402v7.854h-23.4v12.685h26.04v7.854H150.14v-.003zM188.835 73.467l15.93-24.323-14.436-22.288h11l9.348 14.976 9.157-14.976h10.905l-14.498 22.638 15.93 23.974H220.82l-10.333-16.12-10.365 16.12h-11.287zM237.004 73.467v-46.61h15.103c5.723 0 9.453.233 11.19.698 2.672.7 4.908 2.22 6.71 4.562 1.8 2.343 2.702 5.37 2.702 9.078 0 2.86-.52 5.268-1.56 7.217-1.038 1.95-2.357 3.482-3.957 4.595-1.6 1.112-3.227 1.85-4.88 2.21-2.247.445-5.5.667-9.76.667h-6.137v17.583h-9.412zm9.41-38.727v13.227h5.152c3.71 0 6.19-.243 7.44-.73 1.25-.488 2.23-1.25 2.94-2.29.71-1.038 1.066-2.246 1.066-3.624 0-1.695-.498-3.095-1.494-4.197-.997-1.102-2.257-1.79-3.784-2.066-1.124-.21-3.38-.318-6.772-.318h-4.547v-.002zM280.435 73.467v-46.61h34.56v7.884h-25.148v10.335h23.4v7.854h-23.4v12.685h26.04v7.854h-35.452v-.003zM323.898 73.467v-46.61h19.81c4.98 0 8.6.418 10.856 1.255 2.258.838 4.063 2.326 5.42 4.467 1.356 2.14 2.035 4.59 2.035 7.345 0 3.496-1.028 6.385-3.085 8.664-2.058 2.276-5.13 3.715-9.222 4.307 2.035 1.188 3.716 2.492 5.04 3.912 1.325 1.42 3.11 3.94 5.357 7.564l5.69 9.094h-11.255l-6.805-10.143c-2.416-3.625-4.07-5.908-4.96-6.853-.89-.943-1.833-1.59-2.83-1.938-.996-.35-2.575-.525-4.737-.525h-1.906v19.458h-9.41zm9.413-26.9h6.964c4.515 0 7.332-.19 8.457-.57 1.124-.383 2.003-1.04 2.64-1.972.636-.934.954-2.1.954-3.498 0-1.568-.42-2.834-1.257-3.8s-2.018-1.573-3.545-1.827c-.764-.106-3.053-.16-6.867-.16h-7.344v11.828zM370.604 73.467v-46.61h9.412v46.61h-9.412zM388.855 73.467v-46.61h14.084l8.456 31.793 8.362-31.794h14.115v46.61h-8.742v-36.69l-9.25 36.69h-9.063l-9.22-36.69v36.69h-8.742zM443.223 73.467v-46.61h34.562v7.884h-25.148v10.335h23.4v7.854h-23.4v12.685h26.04v7.854h-35.453v-.003zM486.75 73.467v-46.61h9.156l19.076 31.125V26.856h8.743v46.61h-9.442l-18.79-30.395v30.397h-8.743zM544.17 73.467V34.74h-13.83v-7.885h37.04v7.885h-13.8v38.727h-9.41z" />
    <path mask="url(#experiment)" class="tube" fill="yellow" d="M136.07 27.246h-22.185v5.547h2.31V67.92c0 3.05 2.497 5.547 5.547 5.547h6.47c3.052 0 5.547-2.496 5.547-5.547V32.793h2.31v-5.547zm-4.62 33.74h-11.094v-1.848h11.093v1.848zm0-6.93h-6.472v-1.85h6.47v1.85zm0-6.935h-11.094v-1.848h11.093v1.85zm0-6.932h-6.472V38.34h6.47v1.848z" />
</svg>
```

  


```CSS
@layer animation {
    @keyframes move {
        from {
            translate:0 0;
        }
        to {
            translate: 400px 0;
        }
    }
  
    circle {
        animation: 3s move alternate infinite;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8560c81f9a8d4556847cfe939a155f65~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1138&h=398&s=159693&e=gif&f=114&b=300133)

  


> Demo 地址：https://codepen.io/airen/full/BabXpWj

  


### 粒子动画

  


前面在介绍 SVG 线条动画时，曾提到，我们可以使用 `SVGGeometryElement.getPointAtLength()` 方法返回沿路径的给定距离的点。它将给出沿路径精确距离上的坐标。例如 `path.getPointAtLength(10)` 将返回一个包含 `x` 和 `y` 坐标的 `SVGPoint`（一个对象）。

  


这意味着，我们可以基于 SVG 路径和 `getPointAtLength()` 来创建一些有创意的动画效果，例如 [@Louis Hoebregts](https://codepen.io/Mamboleoo) 提供的相关案例，他结合了 [GreenSock 相关特性](https://greensock.com/motionpath/)，创建了一个粒子动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/375d76d7d74a428693b7d78a16f8e483~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1472&h=786&s=1241662&e=gif&f=116&b=ffffff)

  


> Demo 地址：https://codepen.io/Mamboleoo/full/NWaogXW （来源于 [@Louis Hoebregts](https://codepen.io/Mamboleoo) ）

  


这个动画在每一帧上，将创建一个新的圆圈元素，并对其进行动画处理，以使新的粒子弹出并淡出。以下是制作这个动画的效果的核心步骤：

  


-   创建一个新的 `<circle>` 元素，并将其附加到 SVG 中
-   使用 `getPointAtLength` 计算的点坐标
-   为每个圆定义随机的半径和颜色
-   将圆的 `cx` 和 `cy` 属性动画到一个随机位置
-   动画完成后，从 DOM 中移除圆

  


```JavaScript
function createParticle (point) {
    // 创建 circle 元素（粒子）
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    // 将 circle 插入 svg
    svg.prepend(circle);
    // 设置 circle 位置
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    // 为每个 circle 设置随机的半径 
    circle.setAttribute('r', (Math.random() * 2) + 0.2);
    // 为每个 circle 设置随机的填充色
    circle.setAttribute('fill', gsap.utils.random(['#ff0000', '#ff5a00', '#ff9a00', '#ffce00', '#ffe808']));
  
    // 动画化 circle
    gsap.to(circle, {
        // 基于当前位置给 cx 一个随机值
        cx: '+=random(-20,20)',
        // 基于当前位置给 cy 一个随机值
        cy: '+=random(-20,20)',
        // 淡出
        opacity: 0,
        // 给每个圆的动画设置一个随机的持续时间
        duration: 'random(1, 2)',
        // 防止gsap四舍五入cx & cy值
        autoRound: false,
        // 动画完成后删除 SVG 中的 circle 
        onComplete: () => {
            svg.removeChild(circle);
        }
    });
}
```

  


更详细的代码，请参阅案例源码。

  


除此之外，要是你对 WebGL 了解，例如 [three.js](https://threejs.org/) 。你还可以制作出更酷炫的粒子动画效果，例如下面这个：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e13de732603146baa876918696880ce6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=536&s=18259464&e=gif&f=195&b=000000)

  


> Demo 地址：https://codepen.io/Mamboleoo/full/zYEJVWy （来源于 [@Louis Hoebregts](https://codepen.io/Mamboleoo)）

  


你也可以基于 [anime.js 来制作 SVG 动画](https://animejs.com/)。例如，下面这个动画效果，它给 `Notitication` 组件的徽标添加了一个类似火焰燃烧的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00ab6bfef5e747daa011f489bdd18405~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=504&s=559212&e=gif&f=70&b=000000)

  


> Demo 地址：https://codepen.io/AlikinVV/full/wOyGNJ （来源于 [@Valery Alikin](https://codepen.io/AlikinVV)）

  


### 其他动画效果

  


上面所展示的是 SVG 和 CSS 共同制作的一些动画效果，它有一些常见的基本动画效果，也有一些酷炫的粒子动画效果。其实，在 Web 上还有可能带有交互的效果的 SVG 动画，或者用于常组件上的 SVG 动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c38168ed4d64921b16ac0e895557801~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=468&s=175663&e=gif&f=122&b=ebeaf3)

  


> Demo 地址：https://codepen.io/milanraring/full/qBEPzKB （来源于 [@Milan Raring](https://codepen.io/milanraring)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26ffbe0b8ba04479b0f428dd9248bd57~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=550&s=948965&e=gif&f=108&b=cfe5f8)

  


> Demo 地址：https://codepen.io/Anna_Batura/details/ExKBXdd （来源于 [@BrawadaCom](https://codepen.io/Anna_Batura) ）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b54e5595b964306bc39fd623ea7ec67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=618&s=12892946&e=gif&f=132&b=475d7e)

  


> Demo 地址：https://codepen.io/TurkAysenur/details/bGawdKv （来源于 [@Aysenur Turk](https://codepen.io/TurkAysenur)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24ef9b17020a47b3bba5bed857cfa00d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=430&s=305097&e=gif&f=205&b=dfe7f7)

  


> Demo 地址：https://codepen.io/aaroniker/details/yLyJYxx （来源于 [@Aaron Iker](https://codepen.io/aaroniker)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c6a7d14dd52496bb102f6e4527d7c54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=444&s=856568&e=gif&f=151&b=f2f0ee)

  


> Demo 地址：https://codepen.io/arcticben/full/zZaRqQ （来源于 [@Ben Sinca](https://codepen.io/arcticben)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d6ef7104b4843fd92c78f3d3a5e8291~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=502&s=568985&e=gif&f=186&b=2a0020)

  


> Demo 地址：https://codepen.io/AbubakerSaeed/full/yLOaaKM （来源于 [@Abubaker Saeed](https://codepen.io/AbubakerSaeed)）

  


你可以在 CodePen 上查看更多有关于 SVG 方面的动画。这里就不一一向大家展示了。

  


## 结论

  


希望这节课能鼓励你尝试制作一些精彩的 SVG 动画和交互，并将这种工作流程整合到你的日常项目中。我们只使用了一些小技巧和 CSS 属性，就能够轻松创建各种不错的效果。如果你愿意投入一些额外的时间、知识和努力，就能够创造一些真正令人惊叹和交互式的图形。