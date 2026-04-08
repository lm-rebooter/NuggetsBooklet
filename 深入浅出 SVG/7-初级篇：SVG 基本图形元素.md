SVG 是一种用于在 Web 上创建可缩放矢量图形的技术，它通过数学和几何原理实现了图形的绘制和渲染。在 SVG 中，可以使用多种基本图形元素来绘制各种形状，例如矩形（`<rect>`）、圆（`<circle>`）、椭圆（`<ellipse>`）、直线（`<line>`）、开放式线段（`<polyline>`）、多边形（`<polygon>`）等。这些基本图形元素提供了灵活而简单的方式来创建各种图形，而无需依赖复杂的图形编辑软件。除了这些基本图形元素之外，SVG 还提供了路径（`<path>`）元素，用于创建各种复杂的图形。

  


这节课将带领你深入了解 SVG 图形元素的绘制，探索如何使用 SVG 的基本图形元素来创建各种形状。通过详细的示例和实践操作，你将逐步掌握如何使用这些基本元素绘制各种形状，从而为你的项目增添更多创意和想象空间。

  


在这个过程中，我们还将分享一些实用的技巧和窍门，帮助你更加高效地利用 SVG 来实现你的设计目标。同时，还将帮助你了解图形设计软件如何生成 SVG，让你更仔细地了解使用图形设计软件绘制图形和生成 SVG 的过程以及如何将其运用到自己项目中。如此一来，无论你是想创建简单的图标，还是复杂的艺术品，SVG 都能够满足你的需求，并为你的项目增添独特的视觉效果。

  


最后，还将展示一些实际应用案例，让你了解 SVG 图形元素在 Web 设计和开发中的真实应用场景。通过这些案例，你将更加深入地理解 SVG 的潜力和优势，为你的下一个项目注入新的灵感和创造力。

  


无论你是刚入门的新手还是经验丰富的专业人士，这节课都将为你提供全面而易懂的指导，帮助你掌握 SVG 图形元素的绘制技巧，从而成为一名更加出色的设计师和开发者。让我们一起开始这段充满创意和挑战的旅程吧！

  


## SVG 图形元素简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e79afa80aa246269261e47e1ba04f61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1910&h=980&s=54362&e=jpg&b=1c2828)

  


在图形设计软件中（例如 Figma），形状通常指几何图形，它们可以被用于各种用途。Figma 提供了五种预设形状供你使用，它们分别是矩形、椭圆、多边形、星形和箭头。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44c49f9d311e4449bc186ff2affc5478~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3338&h=1694&s=270492&e=jpg&b=f7f7f7)

  


-   矩形：创建一个具有 `4` 个点的四边形矢量对象。
-   椭圆：创建一个具有 `4` 个点的圆形矢量对象。
-   多边形：创建一个具有 `3` 个点的三角形矢量对象。
-   星形：创建一个具有 `5` 个点的星形矢量对象。
-   箭头：创建一个具有 `2` 个点的箭头线条。
-   线条：创建一个至少包含 `2` 个顶点的线条，但你可以继续创建额外的顶点，它将在你点击的位置创建更多线条。

  


每种形状都有自己的用途。除此之外，Figma 还为你提供了使用线条（铅笔）工具和形状（钢笔）工具创建任何你想要的形状的功能。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b02f9262dfc44c696063afc48c72207~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3342&h=838&s=134382&e=jpg&b=f7f7f7)

  


SVG 与 图形设计软件 Figma 类似，它也提供了矩形、圆形、椭圆、直线、折线、多边形等基本图形元素，这些基本元素允许你绘制基本形状：

  


-   **矩形（** **`<rect>`** **）** ：用于创建矩形形状的元素，可以定义矩形的位置、宽度、高度和圆角半径等属性。
-   **圆形（** **`<circle>`** **）** ：用于创建圆形形状的元素，通过指定圆心坐标和半径来定义圆的大小和位置。
-   **椭圆（** **`<ellipse>`** **）** ：用于创建椭圆形状的元素，可以定义椭圆的中心坐标、水平半径和垂直半径。
-   **直线（** **`<line>`** **）** ：用于创建直线的元素，通过指定起点和终点坐标来定义直线的位置和长度。
-   **折线（** **`<polyline>`** **）** ：用于创建折线形状的元素，通过指定多个点的坐标来定义折线的路径。
-   **多边形（** **`<polygon>`** **）** ：用于创建多边形形状的元素，通过指定多个顶点的坐标来定义多边形的边界。

  


在 SVG 中，图形元素是创建图形的基本单元，它们是 SVG 中用于创建这些基本形状的标签或元素。它们提供了一种灵活而简单的方式来绘制各种形状，无需深入的数学计算或复杂的路径定义。从数学上讲，这些形状元素相当于构建相同形状的 <path> 元素。它们可以用于描边、填充或作为裁剪的路径（所有适用于 path 元素的属性也适用于基本形状）。这些形状元素拥有各自的属性和方法，可以通过 SVG 标记语言在 Web 上直接创建和使用。

  


## 如何使用图形元素绘制图形

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06b77969b65d4ec6b1cc59f445b79ffc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3000&h=1500&s=63681&e=jpg&b=f8f8ff)

  


探索 SVG 图形元素的绘制过程是理解 SVG 的关键一环。SVG 提供了一系列基本的图形元素，包括矩形、圆形、椭圆、直线等，借助这些元素，我们可以轻松创建各种形状和图案。接下来，让我们一起深入了解如何运用这些图形元素，绘制出你所需的形状吧！

  


### 矩形

  


在 SVG 中，我们可以使用 `<rect>` 元素创建一个矩形（长方形或正方形）：

  


```XML
<svg viewBox="0 0 800 600">
    <rect x="100" y="100" width="400" height="300" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg>
```

  


其属性包括：

  


-   `x` 和 `y` 设置了矩形的左上角在用户坐标系中的位置，其中 `x` 表示左上角水平位置，`y` 表示左上角的垂直位置
-   `width` 和 `height` 设置矩形的尺寸，其中 `width` 表示矩形的宽度，`height` 表示矩形的高度

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e69222ba00d54110b24ef52f3783ce21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=180447&e=jpg&b=fcfafd)

  


除此之外，`<rect>` 元素还提供了两个可选属性 `rx` 和 `ry` ：

  


-   `rx` 定义了水平圆角半径
-   `ry` 定义了垂直圆角半径

  


如果这两个属性设置了一个，那么另一个属性将取相同的值：

  


```XML
<svg viewBox="0 0 800 600">
    <rect x="100" y="100" width="400" height="300" rx="10" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg>

<!-- 或者 -->
<svg viewBox="0 0 800 600">
    <rect x="100" y="100" width="400" height="300" ry="10" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/155b8b32c1374e8eb4e236d5f69fde78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=206829&e=jpg&b=fcfafd)

  


如果使用 `<rect>` 绘制的矩形，它的 `width` 和 `height` 相等（绘制的是一个正方形），并且 `rx` 或 `ry` 的值大于或等于 `width` 或 `height` 的一半时，将会绘制一个圆形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89f9db3dc0b54c9185f74653367b2301~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=297958&e=jpg&b=fcfafd)

  


如果使用 `<rect>` 绘制的矩形，它的 `width` 和 `height` 不相等（绘制的是一个长方形），并且 `rx` 或 `ry` 的值大于或等于 `width` 或 `height` 时，将会绘制一个椭圆形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c5ae61ead7043649326556cd490765c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=602&s=2861821&e=gif&f=306&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/qBwabMa

  


与此同时，在 SVG 中，`<rect>` 元素的圆角可以同时由 `rx` 和 `ry` 定义。它们允许我们创建具有椭圆形：

  


```XML
<svg viewBox="0 0 800 600">
    <rect x="100" y="100" width="400" height="300" rx="200" ry="150" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f07c94ce6aa44d7abf2cf963e4f8667~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=286016&e=jpg&b=fcfafd)

  


> Demo 地址：https://codepen.io/airen/full/rNbMeEz

  


在 SVG 中，矩形元素（`<rect>`）中的 `x` 和 `y` 属性可以是负值，但是 `width` 和 `height` 属性的值不能是负值。如果其中任何一个维度的计算值为`0`，则不会呈现该元素。

  


对于具有圆角的矩形，`rx` 和 `ry` 属性的计算值定义了圆角矩形角落（矩形的四个角）的椭圆弧的 `x` 和 `y` 轴的半径。椭圆弧始终沿水平和垂直轴对称；如果要创建具有不同大小圆角的矩形，需要使用路径元素（`<path>`）来定义。

  


此外，如果 `rx` 和 `ry` 中的任何一个维度的计算值为 `0`，或者两个维度的计算值都为 `auto`，将导致矩形没有圆角。`x` 和 `y` 轴圆角半径的使用值可以隐含地由另一个维度（使用`auto`）确定，并且也受到约束，以确保矩形的直线段长度永远不会为负。



  


`rx` 和 `ry` 的使用值由以下步骤按顺序确定：

  


-   如果 `rx` 和 `ry` 均具有 `auto` 的计算值，它们的使用值将都为 `0`，这将导致矩形的四个角都是直角。

-   否则，按照以下方式将指定的值转换为绝对值：

    -   如果`rx` 设置为长度值或百分比，但 `ry` 为 `auto`，则计算等效于 `rx` 的绝对长度，百分比相对于矩形的宽度计算；`ry`的绝对值相同。
    -   如果`ry`设置为长度值或百分比，但`rx`为auto，则计算等效于`ry`的绝对长度，百分比相对于矩形的高度计算；`rx`的绝对值相同。
    -   如果`rx`和`ry`均设置为长度或百分比，将分别生成绝对值，将`rx`百分比相对于矩形宽度计算，将`ry`百分比相对于矩形高度计算。

  


最后，应用约束生成使用值：

  


-   如果绝对值 `rx` 大于使用宽度的一半，则 `rx` 的使用值为使用宽度的一半。
-   如果绝对值 `ry` 大于使用高度的一半，则 `ry` 的使用值为使用高度的一半。

  


否则，`rx` 和 `ry` 的使用值为先前计算的绝对值。

  


### 椭圆和圆

  


在 SVG 中，我们可以使用 `<ellipse>` 元素来绘制一个椭圆，由椭圆中心的坐标（`cx` 和 `cy`）以及两个半径（`rx` 和 `ry` ）定义：

  


```XML
<svg viewBox="0 0 800 600">
    <ellipse cx="200" cy="100" rx="150" ry="80" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7ba255e9ad24522b72b0a0014bac3c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=187567&e=jpg&b=fcfafd)

  


-   `cx` 和 `cy` 属性定义了椭圆的中心点，其中 `cx` 表示水平中心，`cy` 表示垂直中心
-   `rx` 和 `ry` 属性定义了椭圆的 `x` 轴（水平）和 `y` 轴（垂直）半径。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d66bbc1339c4052b41fe2e6639e98d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=600&s=5355106&e=gif&f=517&b=041e46)

  


> Demo 地址：https://codepen.io/airen/full/BaELjod

  


椭圆中心 `cx` 和 `cy` 属性可以是一个负值，但椭圆的半径 `rx` 和 `ry` 的值不能是负值。

  


另外，当 `rx` 和 `ry` 任一维度的计算值为 `0` ，或者对于两个维度的计算值为 `auto` ，则 `<ellipse>` 元素不会被渲染。对于 `rx` 或 `ry` 的 `auto` 值会转换为一个使用过的值，遵循上述矩形的规则（但不会基于宽度或高度做限制）。实际上，`auto` 值会创建一个圆形，其半径仅过一个维的值来定义；这允许创建一个半径根据以下之一的值来定义的圆：

  


-   相对于坐标系宽度的百分比；即 `rx` 的百分比值和 `ry` 的 `auto` 值。
-   相对于坐标系高度的百分比；即 `rx` 的 `auto` 值和 `ry` 的百分比值。

  


```XML
<svg viewBox="0 0 800 600">
    <ellipse cx="400" cy="300" rx="150" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg>
 
<!-- 或者 -->
<svg viewBox="0 0 800 600">
    <ellipse cx="400" cy="300" ry="150" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg> 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6d5c732a0bf4153a0a3aa2dfa2dd5ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=504&s=2190965&e=gif&f=276&b=031d45)

  


> Demo 地址：https://codepen.io/airen/full/RwOGRKX

  


而且，椭圆的 `rx` 和 `ry` 具有相等的值时，`<ellipse>` 就会绘制出一个圆形：

  


```XML
<svg viewBox="0 0 800 600">
    <ellipse cx="400" cy="300" ry="150" rx="150" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg> 
```

  


甚至可以说，圆形是一个特殊的椭圆。不过，SVG 中有一个专门绘制圆形的元素 `<circle>` 。

  


```XML
<svg viewBox="0 0 800 600">
    <circle cx="400" cy="300" r="150" fill="#DB7092" stroke="#B82E5A" stroke-width="10" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/563d6caadce04a05832239deb0d1752b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=184293&e=jpg&b=fcfafd)

  


其属性包括 `r` 代表圆的半径，`cx` 和 `cy` 代表圆的中心，其中 `cx` 代表圆的水平中心，`cy` 代表圆的垂直中心。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0710658d42494979850c7a8cc011ca92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=536&s=3287144&e=gif&f=355&b=011c45)

  


> Demo 地址：https://codepen.io/airen/full/ExJgyXp

  


### 直线

  


直线是 SVG 中最简单的基本图形，通过两点就能绘制出一条简单的直线，例如从点 `A` 到点 `B` 。在 SVG 中，我们可以使用 `<line>` 元素绘制直线。它有四个必需的属性：

  


-   `x1` 和 `y1` 确定点 `A` （起点）坐标，其中 `x1` 用于指定起点的水平位置，`y1` 用于指定起点的垂直位置
-   `x2` 和 `y2` 确定点 `B` （终点）坐标，其中 `x2` 用于指定终点的水平位置，`y2` 用于指定终点的垂直位置

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00668383e4ee4c2fb5dd3042045694fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=147010&e=jpg&b=fcfafd)

  


```XML
<svg  viewBox="0 0 800 600">
    <line x1="100" y1="150" x2="450" y2="500"  stroke="#B82E5A" stroke-width="10" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/105a3c7d8c6f46a2aa5ec1bb15e1e484~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=574&s=2267530&e=gif&f=328&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/JjVRRRj

  


### 折线

  


折线是一系列相连的直线段。在 SVG 中，可以通过使用 `<polyline>` 元素来绘制折线。 `<polyline>` 元素使用 `points` 属性进行控制，该属性是一个包含所有折线点坐标的列表。每个点由其水平位置 `x` 和垂直位置 `y` 定义。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e82f05e38844a53a552cc98fb12273f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=240294&e=jpg&b=fcfafd)

  


```XML
<svg  viewBox="0 0 800 600">
    <polyline points="0,0 300,300 50,400 500, 600" stroke="#B82E5A" stroke-width="10" fill="none" />
</svg>
```

  


注意，`points` 属性中每个点的 `x` 和 `y` 之间使用逗号分隔，相邻两个点之间有空格符进行分隔。每个点的坐标值（`x` 或 `y`）可以是负值：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c5eba458acd49dda29dd94d3d67d57f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=662&s=4015132&e=gif&f=519&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/vYMXXzZ

  


### 多边形

  


`<polygon>` 元素是 SVG 中绘制图形的最后个基本图形元素，它可以绘制由多段直线构成的闭合形状，例如星形或六边形。你也可以将其视为闭合的折线。`<polygon>` 元素的语法实际上与 `<polyline>` 相同，也是通过 `points` 属性进行控制。它与折线（`<polyline>`）主要区别在于，在 `<polygon>` 中，列表中的最后个点始终与第一个点连接，以形成一个闭合的形状：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6861a49fe2b64ab3ad2f699e1c47b1e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1537&s=215759&e=jpg&b=fcfafd)

  


```XML
<svg  viewBox="0 0 800 600">
    <polygon points="0,0 300,300 50,400 500, 600" stroke="#B82E5A" stroke-width="10" fill="#70DB8E" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a970a2d145804e79928a0126c886eb3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=664&s=3749341&e=gif&f=393&b=021d45)

  


> Demo 地址：https://codepen.io/airen/full/mdgrORj

  


重要的是要记住，SVG 的 `<polygon>` 元素可以用于任何多边形，无论是规则的还是不规则的创作。只不过，在使用 `<polygon>` 绘制一些图形时（例如星形，正多边形等），需要一些数学计算。例如下面这个星星图形：

  


```XML
<svg viewBox='-250 -250 500 500'>
    <polygon points='250,0 20,20 0,250 -20,20 -250,0 -20,-20 0,-250 20,-20'/>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a1146abb4cb485b8cd8e0961b7bed8c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=648&s=531771&e=gif&f=151&b=ffffff)

  


> Demo 地址： https://codepen.io/thebabydino/full/WvjOYQ （来源于 [@Ana Tudor](https://codepen.io/thebabydino) ）

  


上面这个示例中的 `polygon` 中的每个坐标就是通过计算获得的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bfe2baa110c4c65a4c0f97cda21467f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1166&s=294691&e=jpg&b=ffffff)

  


## 使用设计软件绘制图形

  


SVG 图形与传统的图形格式（如 JPG 或 PNG 等）最大的区别在于它是一种基于 XML 的标记语言。就像其他编程语言一样，SVG 可以在文本编辑器中编写和编辑。理论上来说，我们无需任何图形设计软件就可以创建 SVG 图形。然而，在实际情况下，大多数情况下还是需要使用图形设计软件。

  


虽然在文本编辑器中处理复杂形状和图形是完全可能的，但通常会非常复杂和繁琐。因此，通常的做法是使用诸如 Figma 这样的图形设计软件，通过可视化界面绘制图形，然后将其导出为 SVG 格式。

  


因此，无论你是一位擅长编码的 Web 开发者还是注重设计的设计师，要熟练掌握 SVG 需要一定的设计工具和 SVG 语言本身的知识。正如本课程所述，使用诸如 Figma 等图形设计软件，可以快速绘制出各种基本图形，并生成相应的 SVG 代码。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9acda393023f4e11b623a43b70beae2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=730&s=2460550&e=gif&f=608&b=f5f5f5)

  


正如上图所示，使用图形设计软件提供的一些工具，你可以快速获得所需的图形。然后将其导出 SVG 代码：

  


```XML
<svg width="1733" height="953" viewBox="0 0 1733 953" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="492" height="364" fill="#D9D9D9"/>
    <line x1="742.269" y1="72.5782" x2="1177.27" y2="349.578" stroke="black"/>
    <ellipse cx="171.5" cy="801" rx="168.5" ry="136" fill="#D9D9D9"/>
    <circle cx="992" cy="801" r="152" fill="#D9D9D9"/>
    <path d="M1602 532L1732.77 799H1471.23L1602 532Z" fill="#D9D9D9"/>
</svg>
```

  


> 小册的《[初级篇：如何获得 SVG](https://juejin.cn/book/7341630791099383835/section/7343645889896022050)》一课中曾详细介绍了如何从设计软件（例如 Figma）导出 SVG，这里就不再重复阐述！

  


需要知道的是，不同的图形设计软件，导出的 SVG 代码是有所差异的。例如，Illustrator 和 Sketch 会将折线转换为 `<polyline>` 元素，而 Figma 则将折线导出为 `<path>` 元素。

  


## SVG 路径

  


`<path>` 是 SVG 中最灵活的元素。它可以用于绘制任何可能的线条和形状，包括但不限于上面列出的所有基本形状。事实上，每个基本形状（`<rect>` 、`<ellipse>` 、`<line>` 、`<polyline>` 和 `<polygon>` ）都可以使用 `<path>` 来绘制。此外，有许多形状可以使用 `<path>` 创建，但无法使用其他任何 SVG 元素创建。

  


换句话说，SVG 的 `<path>` 元素是用于绘制任何形状的通用元素，它的 `d` 属性是一堆数字和字母拼接在一起形成的路径数据。以下是一个 `<path>` 绘制的心形图形：

  


```XML
<svg viewBox="0 0 502 502" class="heart">
      <path d="M 140,20 C 73,20 20,74 20,140 c 0,135 136,170 228,303 c 88,-132 229,-173 229,-303 c 0,-66 -54,-120 -120,-120 c -48,0 -90,28 -109,69 c -19,-41 -60,-69 -108,-69 Z" stroke="#B82E5A" stroke-width="10" fill="#70DB8E" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5353dfd329f948de8907ddc2fcba07f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=956&s=197828&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/rNbMrgZ

  


我们可以对其进行重新格式化以便更好地理解（仍然是有效的代码）：

  


```XML
<svg viewBox="0 0 502 502" class="heart">
      <path 
          d="
              M 140,20
              C 73,20 20,74 20,140
              c 0,135 136,170 228,303
              c 88,-132 229,-173 229,-303
              c 0,-66 -54,-120 -120,-120
              c -48,0 -90,28 -109,69
              c -19,-41 -60,-69 -108,-69
              Z" 
          stroke="#B82E5A" 
          stroke-width="10" 
          fill="#70DB8E" />
</svg>
```

  


`d` 属性中有很多字母和数字，例如 `M` 、`C` 、`c` 和 `Z` 等，还有一些数字，例如 `140,20` 。这些字母表示的是命令，数字是传递给这些命令的值。所有逗号都是可选的（它们可以是空格）。

  


以上面示例来说：

  


-   `M 140,20` ：拿起笔并将其移动到 `{ x: 140, y: 20 }` 位置。暂时不要绘制任何东西，只是移动笔的位置。这样，如果其他命令要绘制图形，它现在就从这个位置开始。
-   `C 73,20 20,74 20,140` ：放下笔并从当前点绘制贝塞尔曲线到新点 `{ x: 20, y: 140 }` ；起始控制点是 `{ x: 73, y: 20 }`，结束控制点是 `{ x: 20, y: 74 }`
-   `c 0,135 136,170 228,303` ：从当前点绘制贝塞尔曲线到新点 `{ x: 上一个点 + 228, y: 上一个点 + 303 }` ；起始控制点是 `{ x: 上一个点 + 0, y: 上一个点 + 135 }`，结束控制点是 `{ x: 上一个点 + 136, y: 上一个点 + 170 }`
-   `c 88,-132 229,-173 229,-303` ：从当前点绘制贝塞尔曲线到新点 `{ x: 上一个点 + 229, y: 上一个点 - 303 }` ；起始控制点是 `{ x: 上一个点 + 88, y: 上一个点 - 132 }`，结束控制点是 `{ x: 上一个点 + 229, y: 上一个点 - 173 }`
-   `c 0,-66 -54,-120 -120,-120` ：从当前点绘制贝塞尔曲线到新点 `{ x: 上一个点 - 120, y: 上一个点 - 120 }` ；起始控制点是 `{ x: 上一个点 + 0, y: 上一个点 - 66 }`，结束控制点是 `{ x: 上一个点 - 54, y: 上一个点 - 120 }`
-   `c -48,0 -90,28 -109,69` ：从当前点绘制贝塞尔曲线到新点 `{ x: 上一个点 - 109, y: 上一个点 + 69 }` ；起始控制点是 `{ x: 上一个点 - 48, y: 上一个点 + 0 }`，结束控制点是 `{ x: 上一个点 - 90, y: 上一个点 + 28 }`
-   `c -19,-41 -60,-69 -108,-69` ：从当前点绘制贝塞尔曲线到新点 `{ x: 上一个点 - 108, y: 上一个点 - 69 }` ；起始控制点是 `{ x: 上一个点 - 19, y: 上一个点 - 41 }`，结束控制点是 `{ x: 上一个点 - 60, y: 上一个点 - 69 }`
-   `Z` ：直线返回到起点

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e49ac989172f454ab48c4d0d04f6d12d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1809&s=999296&e=jpg&b=fefefe)

  


上面所看到的 `M` 、`C` 、`c` 和 `Z` 中是众多路径命中的一个。据我的统计，它共有 `18` 个命令：

  


-   `M` 或 `m`：将路径的起始点移动到指定的坐标位置。
-   `L` 或 `l`：从当前点绘制一条直线到指定的坐标位置。
-   `H` 或 `h`：从当前点水平绘制一条直线到指定的 `x` 坐标位置。
-   `V` 或 `v`：从当前点垂直绘制一条直线到指定的 `y` 坐标位置。
-   `C` 或 `c`：绘制一条三次贝塞尔曲线，使用两个控制点来确定曲线的形状。
-   `S` 或 `s`：绘制一条平滑的三次贝塞尔曲线，只需要一个控制点，前一个控制点会被假设为上一条曲线的结束点的镜像。
-   `Q` 或 `q`：绘制一条二次贝塞尔曲线，使用一个控制点来确定曲线的形状。
-   `T` 或 `t`：绘制一条平滑的二次贝塞尔曲线，只需要一个控制点，前一个控制点会被假设为上一条曲线的结束点的镜像。
-   `A` 或 `a`：绘制一条弧线，用于绘制椭圆的一部分。
-   `Z` 或 `z`：闭合路径，从当前点绘制一条直线到路径的起始点，形成一个闭合的形状。

  


你可能已经发现了，上面这个命令都是成对出现的，一个大写版本和一个小写版本，但这并不意味着路径的命令都是以成对方式存在。SVG 路径命令中的大写版本和小写版本之间的区别主要在于坐标值的解释方式：

  


-   **大写版本（绝对坐标）** ：大写命令表示路径坐标是绝对的，即相对于 SVG 视图的原点（左上角）来定义的。例如，大写命令 `M` 表示将路径的起始点移动到绝对坐标位置。
-   **小写版本（相对坐标）** ：小写命令表示路径坐标是相对于当前点的位置来定义的。换句话说，它们是相对于上一个点的坐标偏移量。例如，小写命令 `m` 表示将路径的起始点移动到相对坐标位置。

  


因此，大写命令会将路径的起始点重新设置到指定的绝对位置，而小写命令会将路径的起始点移动相对于当前点的指定偏移量。这些命令可以组合在一起，以描述复杂的路径形状，从简单的直线到曲线和弧线等各种形状都可以用这些命令来绘制。

  


例如下面这个示例，使用 `<path>` 绘制一个十字架图标：

  


```XML
<svg viewBox="0 0 5 5" class="plus">
    <path d="M2 1 h1 v1 h1 v1 h-1 v1 h-1 v-1 h-1 v-1 h1 z" stroke="gold" stroke-width=".1" fill="gold" stroke-linejoin="round" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a8ef05dedb84656a8a84f27c44784e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=656&s=116285&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/BaELOVY

  


这个示例，是使用相对坐标绘制的，你会发现代码量极少。

  


## 图形元素的 DOM 接口

  


在之前的学习中，我们已经了解了如何在 SVG 文档中使用图形元素来绘制图形。除此之外，SVG 还为这些图形元素提供了对应的 DOM 接口。通过 JavaScript 脚本，我们可以访问这些图形元素的 DOM 接口。

  


SVG 基本图形元素的 DOM 接口定义了用于操作这些图形的方法和属性。以下是 SVG 基本图形元素的 DOM 接口：

  


-   **SVGRectElement（矩形元素）** ：用于创建矩形。可以通过指定位置（`x`、`y`）、宽度（`width`）、高度（`height`）以及圆角（`rx` 和 `ry`）来定义矩形的形状和样式。通过创建 `<rect>` 元素，并设置其属性来定义矩形的位置、大小和圆角属性。
-   **SVGCircleElement（圆形元素）** ：用于创建圆形。可以通过指定圆心位置（`cx`、`cy`）和半径（`r`）来定义圆的形状和样式。通过创建 `<circle>` 元素，并设置其属性来定义圆的位置和半径。
-   **SVGEllipseElement（椭圆元素）** ：用于创建椭圆。可以通过指定中心点位置（`cx`、`cy`）和两个轴的半径（`rx` 和 `ry`）来定义椭圆的形状和样式。通过创建 `<ellipse>` 元素，并设置其属性来定义椭圆的位置和轴的半径。
-   **SVGLineElement（直线元素）** ：用于创建直线。可以通过指定起点（`x1`、`y1`）和终点（`x2`、`y2`）来定义直线的形状和样式。通过创建 `<line>` 元素，并设置其属性来定义直线的起点和终点。
-   **SVGPolygonElement（多边形元素）** ：用于创建多边形。可以通过指定多个顶点的坐标（`points`）来定义多边形的形状和样式。通过创建 `<polygon>` 元素，并设置其属性来定义多边形的顶点坐标。
-   **SVGPolylineElement（折线元素）** ：用于创建折线。与多边形类似，可以通过指定多个顶点的坐标（`points`）来定义折线的形状和样式。通过创建 `<polyline>` 元素，并设置其属性来定义折线的顶点坐标。

  


这些 DOM 接口提供了一种通过 JavaScript 操作 SVG 基本图形元素的方式，可以动态地创建、修改和删除这些元素，从而实现对 SVG 图形的动态渲染和交互。

  


以下是一个使用 SVG 基本图形元素 DOM 接口的示例，展示了如何通过 JavaScript 动态创建 SVG 图形：

  


```XML
<svg id="svg-container" width="400" height="200">
    <!-- SVG图形将在这里动态创建 -->
</svg>
```

  


```JavaScript
const svgEle = document.getElementById("svg-container");
// 创建矩形元素
const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect.setAttribute("x", "50");
rect.setAttribute("y", "50");
rect.setAttribute("width", "100");
rect.setAttribute("height", "50");
rect.setAttribute("fill", "blue");
svgEle.appendChild(rect);

// 创建圆形元素
const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
circle.setAttribute("cx", "250");
circle.setAttribute("cy", "100");
circle.setAttribute("r", "30");
circle.setAttribute("fill", "green");
svgEle.appendChild(circle);

// 创建椭圆元素
const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
ellipse.setAttribute("cx", "150");
ellipse.setAttribute("cy", "150");
ellipse.setAttribute("rx", "80");
ellipse.setAttribute("ry", "40");
ellipse.setAttribute("fill", "yellow");
svgEle.appendChild(ellipse);

// 创建直线元素
const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
line.setAttribute("x1", "200");
line.setAttribute("y1", "50");
line.setAttribute("x2", "300");
line.setAttribute("y2", "150");
line.setAttribute("stroke", "red");
line.setAttribute("stroke-width", "2");
svgEle.appendChild(line);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d92ecdbdb2fa4b55a84cc2fb5241c7fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=656&s=124269&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/YzMGJeL

  


## 案例

  


接下来，我们使用 SVG 基本图形元素来绘制一些图形。

  


### 绘制圣诞装饰品

  


先从一个简单的圣诞装饰品开始。在这里我们使用一个矩形和两个圆来绘制一个圣诞装饰品的简单图形。

  


首先，使用 `<circle>` 绘制圣诞装饰品的主体部分。我们可以使用 SVG 的 `<circle>` 元素来绘制这个圆：

  


```XML
<svg viewBox="-200 -200 400 400">
  <circle cx="0" cy="40" r="140" fill="#D1495B" />
</svg>
```

  


然后，使用 `<rect>` 元素绘制一个矩形作为圣诞装饰品的顶部帽子。在这种情况下，我们必须设置矩形的左上角位置以及其大小。

  


```XML
<svg viewBox="-200 -200 400 400" class="christmas">
    <circle cx="0" cy="40" r="140" fill="#D1495B" />
    <rect x="-35" y="-134" width="70" height="40" fill="#F79257" />
</svg>
```

  


最后，我们在顶部添加另一个圆作为吊钩。请注意，我们使用相同的 `<circle>` 元素，但具有不同的属性。我们将 `fill` 属性设置为 `none`，并使用 `stroke` 和 `stroke-width` 属性为形状设置边框。

  


```XML
<svg viewBox="-200 -200 400 400" class="christmas">
    <circle cx="0" cy="40" r="140" fill="#D1495B" />
    <rect x="-35" y="-134" width="70" height="40" fill="#F79257" />
    <circle cx="0" cy="-156" r="25" fill="none" stroke="#F79257" stroke-width="4" />
</svg>
```

  


最终呈现的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c66852cfba2b4f71a71ee34fe4e622be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=190221&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/mdgrzjz

  


上面是最基础的图形效果。如果你感兴趣的话，还可以给这个装饰品添加一些其他的效果。例如，使用 `<polyline>` 给主体（大的红色圆形）添加简单的花纹装饰：

  


```XML
<svg viewBox="-200 -200 400 400" class="christmas">
    <circle cx="0" cy="40" r="140" fill="#D1495B" />
    <polyline points="-240 80 -160 0 -80 80 0 0 80 80 160 0 240 80" fill="none" stroke="gold" stroke-width="10" />
    <polyline points="-260 40 -160 -40 -80 40 0 -40 80 40 160 -40 240 40" fill="none" stroke="gold" stroke-width="10" />
    <rect x="-35" y="-134" width="70" height="40" fill="#F79257" />
    <circle cx="0" cy="-156" r="25" fill="none" stroke="#F79257" stroke-width="4" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de2927c97c444390b37f957cdde5b264~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=309987&e=jpg&b=0b0b27)

  


你可能已经发现了，`<polyline>` 绘制的黄色条纹线超出主圆的位置。为了使黄色条纹看上去和主圆是一体的，我们需要应用一点我们这节课没介绍的内容，即使用 SVG 的剪切（`<clipPath>），裁剪条纹超出圆的那部分：

  


```XML
<svg viewBox="-200 -200 400 400" class="christmas">
    <defs>
        <clipPath id="ball">
            <circle cx="0" cy="40" r="140" />
        </clipPath>
    </defs>

    <circle cx="0" cy="40" r="140" fill="#D1495B" />
    <polyline clip-path="url(#ball)" points="-240 80 -160 0 -80 80 0 0 80 80 160 0 240 80" fill="none" stroke="gold" stroke-width="10" />
    <polyline clip-path="url(#ball)" points="-260 40 -160 -40 -80 40 0 -40 80 40 160 -40 240 40" fill="none" stroke="gold" stroke-width="10" />
    <rect x="-35" y="-134" width="70" height="40" fill="#F79257" />
    <circle cx="0" cy="-156" r="25" fill="none" stroke="#F79257" stroke-width="4" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16de1e8bd32c4aa09165e91473f7f651~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=269461&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/oNOzamd

  


### 绘制图表

  


SVG 图形另一个被应用的重要领域是数据图可视化图表，对于一些简单的数据可视化图表，可以在不依赖任何图表库（例如 [Echarts](https://echarts.apache.org/zh/index.html)、 [D3](https://d3js.org/) 等），只使用基本图形元素也可以绘制出来。例如：

  


```XML
<svg viewBox="0 0 960 400" class="chart">
    <g transform="translate(50, 20)">
        <g class="axis" transform="translate( -10, 0 )">
            <g class="tick" transform="translate(0,360)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">0</text>
            </g>
            <g class="tick" transform="translate(0,317.6470588235294)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">2</text>
            </g>
            <g class="tick" transform="translate(0,275.2941176470588)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">4</text>
            </g>
            <g class="tick" transform="translate(0,232.9411764705882)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">6</text>
            </g>
            <g class="tick" transform="translate(0,190.58823529411765)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">8</text>
            </g>
            <g class="tick" transform="translate(0,148.23529411764704)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">10</text>
            </g>
            <g class="tick" transform="translate(0,105.88235294117645)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">12</text>
            </g>
            <g class="tick" transform="translate(0,63.5294117647059)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">14</text>
            </g>
            <g class="tick" transform="translate(0,21.176470588235297)">
                <line x1="-2" y1="0" x2="6" y2="0" />
                <text dy=".32em" x="-12" y="0">16</text>
            </g>
            <path class="domain" d="M-2,0H0V360H-2" />
        </g>
        
        <rect class="items" x="4" y="338.8235294117647" height="21.176470588235293" width="73" fill="#6d68d8" />
        <rect class="items" x="95" y="317.6470588235294" height="42.35294117647059" width="73" fill="#766ccb" />
        <rect class="items" x="186" y="232.94117647058823" height="127.05882352941177" width="73" fill="#9b7b95" />
        <rect class="items" x="277" y="63.52941176470591" height="296.4705882352941" width="73" fill="#e49a29" />
        <rect class="items" x="368" y="254.11764705882354" height="105.88235294117648" width="73" fill="#9277a2" />
        <rect class="items" x="459" y="0" height="360" width="73" fill="#ffa500" />
        <rect class="items" x="550" y="296.47058823529414" height="63.529411764705884" width="73" fill="#7f6fbd" />
        <rect class="items" x="641" y="232.94117647058823" height="127.05882352941177" width="73" fill="#9b7b95" />
        <rect class="items" x="732" y="169.41176470588235" height="190.58823529411765" width="73" fill="#b6866c" />
        <rect class="items" x="823" y="317.6470588235294" height="42.35294117647059" width="73" fill="#766ccb" />
    </g>
</svg>
```

  


上面示例中，使用 `<line>` 绘制 `y` 轴的刻度，使用 `<rect>` 绘制图表的柱状。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c58b71b4877a4f3996c8b93c54629676~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=184901&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/jORMQyV

  


### 非矩形页头

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3072a245369745c1b9176067c0311e95~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=1530&s=2127246&e=jpg&b=f4f3f3)

  


在 Web 应用或页面上，Web 设计师有时候为了追求创意与效果，会设计一些不规则的页头风格。这些不规则的页头效果对于 Web 开发者来说，还是很棘手的，有时候甚至的令人头痛的。

  


相对于应用图片而言，使用内联的 SVG 更加高效，易于实现响应式，并且易于迭代设计。事实上，对于大多数情况下，我个人还是使用内联 SVG 多一些，因为它的优势非常明显：多功能、跨浏览器、矢量化、可交互，还可以添加一些特殊效果，例如滤镜效果，遮罩效果等。

  


我们来看一个简单的示例，SVG 路径（`<path>`）绘制的水波纹应用于卡片 UI 上的效果：

  


```HTML
<div class="card">
    <div class="colour">
        <img src="http://i.pravatar.cc/500?img=3" alt="" />
        <div class="svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 48.2">
                <path fill="#ffffff" d="M115.2 29.2C72.4 16.9 40.9.1 0 .1v14.8c15.8 0 40.6 13.6 72.3 23.4 16.1-2.8 29.9-6 42.9-9.1zm175.3-19.1c3.5-.6 6.7-.9 9.5-.9V0s-3.2 4.3-9.5 10.1z" class="ripple0" />
                <path fill="#ffffff" d="M236.3 25.8c-17.6-4-36.9-7-55.1-6.8-23.8.2-43.6 4.9-65.9 10.2 19.6 5.6 41.5 10.4 67.8 12.1 18.2-4.3 36.4-10 53.2-15.5z" class="ripple1" />
                <path fill="#ffffff" d="M132.4 48.1c16.2 0 33.4-2.7 50.6-6.8-26.3-1.8-48.2-6.5-67.8-12.1-13 3.1-26.9 6.3-42.9 9 18 5.6 38.1 9.9 60.1 9.9z" class="ripple2" />
                <path fill="#ffffff" d="M290.5 10.1c-13.9 2.3-32.9 8.8-54.2 15.7 7.5 1.7 14.7 3.6 21.4 5.6 14.8-6.5 25.8-14.8 32.8-21.3z" class="ripple3" />
                <path fill="#ffffff" d="M257.6 31.4A409 409 0 0 1 300 46.2v-37c-2.8 0-6 .3-9.5.9-7 6.5-18 14.8-32.9 21.3zM0 14.9V44c29.1 0 52.4-2.4 72.3-5.7C40.6 28.4 15.8 14.9 0 14.9z" class="ripple2" />
                <path fill="#ffffff" d="M205.4 42.1c20.9 0 38.3-4.5 52.2-10.6-6.7-1.9-13.9-3.9-21.4-5.6-16.8 5.4-35 11.2-53.2 15.5 7.2.4 14.6.7 22.4.7z" class="ripple4" />
                <path fill="#ffffff" d="M300 46.3s-17.6-7.6-42.4-14.8c-13.9 6.1-31.3 10.6-52.2 10.6-7.8 0-15.3-.3-22.4-.7-17.2 4-34.5 6.8-50.6 6.8H300v-1.9zm-167.6 1.8c-22 0-42.1-4.3-60.1-9.9-19.9 3.3-43.2 5.7-72.3 5.7v4.2h132.4z" class="ripple5" />
            </svg>
        </div>
    </div>
    
    <div class="text">
        <h3>Etiam Fusce Ornare</h3>
        <p class="date">8 April 2016</p>
        <div class="author">
            <img src="http://i.pravatar.cc/500?img=3" alt="" />
            <p>Laura Clark</p>
        </div>
        <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames.</p>
    </div>
</div>
```

  


```CSS
.ripple0 {
    opacity: 0.29;
}

.ripple1 {
    opacity: 0.5;
}

.ripple2 {
    opacity: 0.7;
}

.ripple3 {
    opacity: 0.54;
}

.ripple4 {
    opacity: 0.75;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07275f16032242bbaf6033b4e3780135~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=279445&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/mdgrQge

  


注意，像上面这样的水波纹，在文本编辑器中使用 SVG 代码来编辑的话，会损耗你大把精力。所以我建议你使用诸如 Figma 的图形编辑软件来制作，然后导出相应的 SVG 代码，然后将导出的 SVG 代码内联到 HTML 中。或者你可以使用一些在线工具来帮助你获取相似的 SVG 代码。例如：

  


-   [GetWaves](https://getwaves.io/) 或 [SVGwave](https://svgwave.in/) 生成SVG波浪
-   [Blobmaker](https://www.blobmaker.app/)生成一些花哨的斑点
-   [ShapeDivider](https://www.shapedivider.app/) 生成自定义形状的分隔符

  


如果你需要一个更高级的编辑器来生成 SVG 资源，从分层波浪到堆叠波浪和斑点场景，[Haikei](https://app.haikei.app/) 是一个功能齐全的工具，拥有各种生成器，提供 SVG 和 PNG 格式的资源。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa3af77963948778c0e8f19271b8461~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1088&s=20127&e=avif&b=0f0f0f)

  


> URL：https://app.haikei.app/

  


### 菜单切换按钮

  


再来看一个带交互效果的 SVG 图形案例。“汉堡”图标切换为关闭图标，这个效果在 Web 应用上（尤其是移动端上）很常见。接下来，我们使用三个 `<rect>` 元素来绘类似“汉堡”的图标，当用户点击它时，它会动画化切换到关闭按钮：

  


```HTML
<button>
    <svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
        <rect width="18" height="1.5" fill=red ry="0.75" x="3" y="6.25" />
        <rect width="18" height="1.5" fill=red ry="0.75" x="3" y="11.25" />
        <rect width="18" height="1.5" fill=red ry="0.75" x="3" y="16.25" />
    </svg>
</button>
```

  


```CSS
@layer demo {
    button {
        width: 280px;
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        padding: 0;
        scale: 1;
        background: transparent;
        border: 0;
        border-radius: 50%;
        transition: background 0.2s;
        cursor: pointer;
    }

    button:is(:hover, :focus-visible) {
        background: hsl(0 0% 16%);
    }

    button:is(:focus-visible) {
        outline-color: hsl(320 80% 50% / 0.5);
        outline-offset: 1rem;
        outline-width: 4px;
    }

    button svg:first-of-type {
        width: 65%;
    }

    button rect {
        transform-box: fill-box;
        transform-origin: 50% 50%;
        fill: hsl(0 0% 98%);
    }

    [aria-pressed="true"] rect {
        transition: translate 0.2s, rotate 0.2s 0.3s;
    }
    
    rect {
         transition: rotate 0.2s 0s, translate 0.2s 0.2s;
    }

    [aria-pressed="true"] rect:nth-of-type(1) {
        translate: 0 333%;
        rotate: -45deg;
    }
    
    [aria-pressed="true"] rect:nth-of-type(2) {
        rotate: 45deg;
    }
  
    [aria-pressed="true"] rect:nth-of-type(3) {
        translate: 0 -333%;
        rotate: 45deg;
    }
    
    [aria-pressed="true"] svg {
        rotate: 90deg;
        transition: rotate 1s 0.4s;
    }

    @supports (--custom: linear()) {
        :root {
            --elastic-out: linear(
                0,
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
                1
              );
            --elastic-in-out: linear(
                0,
                0.0009 8.51%,
                -0.0047 19.22%,
                0.0016 22.39%,
                0.023 27.81%,
                0.0237 30.08%,
                0.0144 31.81%,
                -0.0051 33.48%,
                -0.1116 39.25%,
                -0.1181 40.59%,
                -0.1058 41.79%,
                -0.0455,
                0.0701 45.34%,
                0.9702 55.19%,
                1.0696 56.97%,
                1.0987 57.88%,
                1.1146 58.82%,
                1.1181 59.83%,
                1.1092 60.95%,
                1.0057 66.48%,
                0.986 68.14%,
                0.9765 69.84%,
                0.9769 72.16%,
                0.9984 77.61%,
                1.0047 80.79%,
                0.9991 91.48%,
                1
              );
        }
        [aria-pressed="true"] svg {
            transition-timing-function: var(--elastic-out);
        }
    }
}
```

  


```JavaScript
const TOGGLE = document.querySelector('button')

const HANDLE_TOGGLE = () => {
    TOGGLE.setAttribute('aria-pressed', TOGGLE.matches('[aria-pressed=true]') ? false : true)
}

TOGGLE.addEventListener('click', HANDLE_TOGGLE)
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab44ac521c6d410b8850bb87e5fdbfa1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=536&s=677073&e=gif&f=158&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/jORMXLK

  


### Loading 动效

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/185d17af27354604a4fa4d7c3c1e28e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1232&h=676&s=2159727&e=gif&f=38&b=fdfaf9)

  


> URL：https://loading.io/

  


正如上图所示，Web 页面加载指示器可以使用 SVG 来创建，这些指示器可以基于 SVG 基本图形元素，然后添加一些 CSS ，就可以构建出一个效果完美的 Loading 动效。例如下面这个示例：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 350" class="loading">
    <defs>
        <filter id="goo">
            <feGaussianBlur id="SvgjsFeGaussianBlur1000" result="SvgjsFeGaussianBlur1000" in="SourceGraphic" stdDeviation="10" />
            <feColorMatrix id="SvgjsFeColorMatrix1001" result="SvgjsFeColorMatrix1001" in="SvgjsFeGaussianBlur1000" values=" 1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 30 -10" type="matrix" />
            <feComposite id="SvgjsFeComposite1002" result="SvgjsFeComposite1002" in="SvgjsFeColorMatrix1001" operator="atop" />
        </filter>
        <linearGradient id="g" x1="100%" x2="0" y1="0" y2="80%" gradientTransform="rotate(10)">
            <stop offset="10%" stop-color="hsl(10, 90%, 50%)" />
            <stop offset="22%" stop-color="hsl(35, 90%, 50%)" />
            <stop offset="38%" stop-color="hsl(45, 90%, 50%)" />
            <stop offset="50%" stop-color="hsl(180, 90%, 50%)" />
            <stop offset="70%" stop-color="hsl(210, 90%, 50%)" />
            <stop offset="84%" stop-color="hsl(280, 90%, 50%)" />
            <stop offset="100%" stop-color="hsl(320, 90%, 50%)" />
        </linearGradient>
        <mask id="mask">
            <g>
                <circle cx="50" cy="25" r="25"  />
                <line x1="50" x2="50" y1="100" y2="250"  />
                <circle cx="50" cy="325" r="25"  />
            </g>
            <g>
                <circle cx="150" cy="25" r="25"  />
                <line x1="150" x2="150" y1="100" y2="250"  />
                <circle cx="150" cy="325" r="25"  />
            </g>
            <g>
                <circle cx="250" cy="25" r="25"  />
                <line x1="250" x2="250" y1="100" y2="250"  />
                <circle cx="250" cy="325" r="25"  />
            </g>
            <g>
                <circle cx="350" cy="25" r="25"  />
                <line x1="350" x2="350" y1="100" y2="250"  />
                <circle cx="350" cy="325" r="25"  />
            </g>
            <g>
                <circle cx="450" cy="25" r="25" />
                <line x1="450" x2="450" y1="100" y2="250"  />
                <circle cx="450" cy="325" r="25" />
            </g>
            <g>
                <circle cx="550" cy="25" r="25" />
                <line x1="550" x2="550" y1="100" y2="250"  />
                <circle cx="550" cy="325" r="25"  />
            </g>
            <g>
                <circle cx="650" cy="25" r="25"  />
                <line x1="650" x2="650" y1="100" y2="250"  />
                <circle cx="650" cy="325" r="25"  />
            </g>
        </mask>
    </defs>
    <g filter="url(#goo)">
        <rect x="0" y="0" width="100%" height="100%" fill="url(#g)" mask="url(#mask)" />
    </g>
</svg>
```

  


```CSS
@layer demo {
    @keyframes drop {
        0%,
        5% {
            translate: 0 -50%;
        }
        95%,
        100% {
            translate: 0 50%;
        }
    }

    @keyframes pulse {
        0%,
        20% {
            transform: scale(1);
        }
        50%,
        100% {
            transform: scale(0);
        }
    }
    
    :root {
        --speed: 0.875s;
        --fill-color: white;
        --stroke-width: 50;
        --stroke-color: white;    
    }

    .loading {
        display: block;
        width: 50vmin;
        height: auto;
    
        g {
            &:nth-of-type(1) {
                --delay: 0.35;
            }
            
            &:nth-of-type(2) {
                --delay: 0.5;
            }
            
            &:nth-of-type(3) {
                --delay: 0.75;
            }
            
            &:nth-of-type(4) {
                --delay: 1;
            }
            
            &:nth-of-type(5) {
                --delay: 0.75;
            }
            
            &:nth-of-type(6) {
                --delay: 0.5;
            }
            
            &:nth-of-type(7) {
                --delay: 0.35;
            }
        }
        
        line {
            stroke-width: var(--stroke-width);
            stroke: var(--stroke-color);
            stroke-linecap: round;
            transform-origin: 50% 50%;
            translate: 0 -50%;
            animation: drop var(--speed) calc((sin(var(--delay)) * -1s)) infinite
            alternate ease-in-out;
        }
        line,
        circle {
            transform-box: fill-box;
        }
    
        circle {
            fill: var(--fill-color);
            
            &:first-of-type {
                transform-origin: 50% 100%;
                animation: pulse calc(var(--speed) * 2) calc((sin(var(--delay)) * -1s))
              infinite ease-in-out;
            }
            
            &:last-of-type {
                transform-origin: 50% 0%;
                animation: pulse calc(var(--speed) * 2)
              calc(((sin(var(--delay)) * -1s) + (var(--speed) * -1))) infinite
              ease-in-out;
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41c6c84dec3f47668995fce4c2f89f1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=398&s=984031&e=gif&f=62&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/KKYgbGb

  


使用 `<line>` 和 `<circle>` 绘制了 Loading 中的图形，图形还应用了 SVG 的滤镜、遮罩和渐变等效果。Loading 的动画则是由 CSS 控制的。

  


## 小结

  


在 SVG 中，可以使用一些基本图形元素来绘制各种形状，包括矩形（`<rect>`）、圆形（`<circle>`）、椭圆（`<ellipse>`）、直线（`<line>`）、折线（`<polyline>`）和多边形（`<polygon>`）等。这些基本图形都可以使用 `<path>` 元素来绘制，而且 `<path>` 元素是 SVG 中最灵活的一个元素，你可以使用它绘制出任何你想要的图形。可以说，它只有你想不到的，没有它做不到的。

  


这些基本图形元素可以通过设置属性（如位置、大小、颜色、边框等）来创建各种形状，并且可以与 CSS 和 JavaScript 进行交互。SVG 的可扩展性和灵活性使其成为在 Web 上绘制图形和图表的理想选择。