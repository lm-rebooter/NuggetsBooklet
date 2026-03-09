SVG 已经成为 Web 开发、数据可视化和图形设计领域的不可或缺的工具，它的灵活性和强大功能令人印象深刻。然而，随着 SVG 图形的复杂性不断增加，有效地组织和管理这些图形变得至关重要。在 SVG 中，你可以利用 `<g>`、`<use>`、`<defs>` 和 `<symbol>` 等元素，有条不紊地组织和管理 SVG 图形的内容。通过结构化和分组，你能够将图形元素组织为逻辑单元，使代码更具可读性和可维护性。同时，引用和重用技术将帮助你减少重复代码，并实现图形元素的高效复用，从而提高开发效率。接下来的内容中，我将深入探讨这些元素，突出它们之间的区别以及各自的优势。

  


除了技术层面的探索外，本节课还将分享优化和简化 SVG 代码的实用技巧和最佳实践。你将了解如何通过减少代码体积和复杂性来提高性能，并学会如何创建出令人印象深刻的图形内容。让我们一起深入探索 SVG 的世界，掌握组织 SVG 图形的技巧，创造出令人惊叹的视觉体验！

  


## SVG 结构元素的简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37c2a668b60b40aaaee69e93f5593d67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200&h=800&s=29889&e=jpg&b=7acbee)

  


在 SVG 中，结构元素扮演着重要的角色，它们主要用于组织、管理和重用图形内容。这些元素不仅使用 SVG 文档更具可读性和可维护性，还为 Web 开发人员提供了强大的工具来创建复杂的图形结构和动态效果。

  


当涉及到组织和管理 SVG 图形内容时，SVG 提供了一些关键的结构元素，包括 `<g>` 、`<defs>` 、`<symbol>` 和 `<use>` 等元素：

  


-   **`<g>`** **元素**：它主要用于创建一个分组，将多个 SVG 元素组织在一起。它类似于 HTML 的 `<div>` 元素，不具有特定的图形语义，但允许你将相关的图形元素放在一起，并对它们进行统一的变换和样式设置。例如，你可以将多个路径（`<path>`）、圆形（`<circle>`）和矩形（`<rect>`）放在一个 `<g>` 元素内，以便处理和样式化。
-   **`<defs>`** **元素**：它主要用于定义可重复使用的图形元素、渐变、滤镜和纹理等。你可以在 `<defs>` 元素内部定义这些元素，然后在整个 SVG 文档中使用它们。这种方式使得 SVG 文档更加模块化，让你能够更轻松地管理和维护定义的元素，以实现代码的简化和复用性。
-   **`<symbol>`** **元素**：它主要用于定义可重用的图形符号。与 `<defs>` 元素类似，你可以在 `<symbol>` 元素内部定义图形，并在需要时通过 `<use>` 元素进行引用。不同之处在于，`<symbol>` 元素通常用于定义独立的图形符号，比如 Icon 图标、Logo或其他可重复使用的图形元素。该元素可以实现图形的高效复用。
-   **`<use>`** **元素**：它允许你在 SVG 文档中重复使用现有的图形元素。通过使用 `<use>` 元素，你可以在同一文档中多次引用 `<symbol>` 或其他已定义的图形元素，而无需重复编写相同的代码。这对于创建大型和复杂的 SVG 图形非常有用，因为它可以减少代码的重复性，并简化代码的维护和管理。

  


接下来，我们将介绍这些元素，突出它们之间的区别以及各自的优点。

  


## 使用 `<g>` 元素进行分组

  


SVG 的 `<g>` 元素代表组（“group”）的意思，使用 `<g>` 元素可以将逻辑上相关的图形元素组合在一起。在 SVG 中，使用 `<g>` 元素进行分组是组织和管理图形内容的一种常见方法。`<g>` 元素类似于 HTML 中的 `<div>` 元素，它不具有特定的图形语义，而是用于将多个 SVG 元素（通常是逻辑上相关的图形元素）组合在一起。在图形编辑软件（如 Figma）中，`<g>` 元素的功能类似于图层中的“组”。你可以将组类比为图形设计软件中图层的概念，因为图层也是元素的一种组合：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58341eb53ed54a8f8e94d628520c5738~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1284&h=746&s=573385&e=gif&f=162&b=f2eeee)

  


正如你所见，这个五角星被分成了五个组，每个组包含两个多边形（`<polygon>` 元素）。这些组中的多边形通常被认为是逻辑上相关的图形元素。

  


在对逻辑相关的图形元素进行分组时，我们通常会给 `<g>` 元素指定一个 `id` 属性，以便为该组命名。任何应用于 `<g>` 元素的样式都会应用到其所有后代元素上。这样可以轻松地为整个对象添加样式、变换和交互性动画等。

  


以上图中的五角星为例。它由五个相同的角组成，每个角中包括了两个 `<polygon>` 元素绘制的多边形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac7bc7a52d44a13a3fa1aa212326328~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1077&s=192563&e=jpg&b=0b0b27)

  


也就是说，首先在 SVG 中，使用 `<polygon>` 元素绘制两个多边形，并且它们都嵌套在同一个 `<g>` 元素内：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g class="arm arm-1">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e2c44c7043c4fd58c5569394cacc95d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=250674&e=jpg&b=060606)

  


使用相同的方式，在上面代码的基础上再复制出四个一样的 `<g>` ：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g class="arm arm-1">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-2">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-3">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-4">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-5">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
</svg>
```

  


现在五角星的五个角重叠在一起。我们需要通过其他的样式将每个角放置到它该去的位置，例如，旋转每个组（在 `<g>` 元素上设置 `transform` 的 `rotate` ）到正确的位置：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g class="arm arm-1">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-2" transform="rotate(72)">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-3" transform="rotate(144)">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-4" transform="rotate(216)">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g class="arm arm-5" transform="rotate(288)">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
</svg>
```

  


你可能注意到，我们将多边形定义为从坐标系的原点（即图像中心）开始。默认情况下，旋转也是围绕坐标系的原点进行的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/345baa601b0f452595735587ab302bbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=329662&e=jpg&b=060606)

  


由于五角星有五个角，图像的底部比顶部略短，为了使图像居中，我们可以将整个五角星图案组合在一起，即用一个 `<g>` 元素来包裹所有的角（`<g>`）。然后再该元素元素使用 `tranform` 的 `translate` ，将整个五角星沿着 `y` 轴向下移动 `10` 个单位：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g class="arms" transform="translate(0,10)">
        <g class="arm arm-1">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-2" transform="rotate(72)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-3" transform="rotate(144)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-4" transform="rotate(216)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-5" transform="rotate(288)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3aa10d71d24806a793e9c70f268119~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=340240&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/NWmdZXK

  


正如你所看到的，分组元素不仅在组织和结构上非常有用。特别是当你想要向多个项目组成的 SVG 图形添加交互和变换时，它就显得特别有用。对于包含在同一个 `<g>` 元素内的所有子元素，可以统一应用变换和样式。这意味着你可以对整个组执行移动、旋转、缩放等设置，而不必单独操作每个元素，从而保持它们之间的空间关系。这非常方便。

  


分组使交互性变得更加方便。例如，你可以将鼠标事件附加到整个“五角星”上，并使其作为一个整体组响应事件，而不必对该组中的每个元素应用相同的交互事件。

  


`<g>`元素还有一个重要且很棒的功能：它可以拥有自己的 `<title>` 和 `<desc>` 标签，这有助于使其对屏幕阅读器更具可访问性，并且使代码对人类来说更易读。例如：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g class="arms" transform="translate(0,10)">
        <title>五角星</title>
        <desc>闪闪发光的五角星</desc>
        
        <g class="arm arm-1">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-2" transform="rotate(72)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-3" transform="rotate(144)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-4" transform="rotate(216)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <g class="arm arm-5" transform="rotate(288)">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
    </g>
</svg>
```

  


你可能已经发现了，上面示例中，绘制五角星的五个角是相同的代码，我们不得不一遍又一遍地复制粘贴每个角的代码。其实，在 SVG 中，我们有更好的方式可以重复利用相同的形状。那就是 SVG 的 `<use>` 元素。

  


## 使用 `<use>` 元素重复使用相同的形状

  


SVG 中的 `<use>` 元素提供了在同一文档中重复利用已定义图形元素的功能。通过 `<use>` 元素，你可以在 SVG 中创建一个图形，然后在需要的地方多次使用它，而无需重复编写相同的代码。换言之，使用 `<use>` 元素就像在 Figma 图形编辑软件中进行复制粘贴一样方便。它可以用于重用单个元素，也可以用于重用由 `<g>` 元素定义的一组元素。

  


`<use>` 元素接受 `x`、`y`、`width` 和 `height` 属性，并使用 `href` 属性（在 SVG 2 之前使用 `xlink:href` 属性）引用其他内容（需要重用的元素或组）。因此，如果你在某处定义了一个具有特定 `ID` 的元素或组，并且想要在其他地方重用它，你只需在 `href` 属性中指定它的 URI，并设置 `x` 和 `y` 值，就可以将该元素或组移动到指定的位置。

  


接下来，我们来看两个简单的示例，看看 `<use>` 元素是如何重复使用单个元素和组。

  


首先，通过绘制一个太阳的形状，来向大家展示 `<use>` 是如何重复使用单个元素的。我们需要绘制的太阳看起来像下图这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b59ee6e5ce76492b975ab175ade3617b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=210844&e=jpg&b=0b0b27)

  


不难发现，上图中有八条相同的太阳光线。假设你是使用 SVG 的 `<line>` 绘制了太阳光线，如果你不利用 `<use>` 元素的话，你不得不重复使用八次 `<line>` 来绘制上图中所有太阳光线。

  


```XML
<svg class="sun" viewBox="-15 -15 30 30">
    <circle r="6" fill="#F8CE6A" x="0" y="0" stroke="#FEBA0B" stroke-width=".8" />

    <line stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(45)" stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(90)" stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(135)" stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(180)" stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(225)" stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(270)" stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(315)" stroke="#FEBA0B" stroke-width="2" stroke-linecap="round" x1="0" y1="10" x2="0" y2="13" />
</svg>
```

  


你可以考虑将 `<line>` 元素中的 `stroke` 、`stroke-width` 和 `stroke-linecap` 等属性提取到 CSS 中，使你的 SVG 代码变得更简洁：

  


```XML
<svg class="sun" viewBox="-15 -15 30 30">
    <circle r="6" fill="#F8CE6A" x="0" y="0" stroke="#FEBA0B" stroke-width=".8" />

    <line  x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(45)"  x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(90)"  x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(135)"  x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(180)"  x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(225)"  x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(270)"  x1="0" y1="10" x2="0" y2="13" />
    <line transform="rotate(315)"  x1="0" y1="10" x2="0" y2="13" />
</svg>
```

  


```CSS
.sun line {
    stroke: #FEBA0B;
    stroke-width: 2;
    stroke-linecap: round;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/266628476ac24c66a186d8dd35473b14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=350524&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/XWQpvmZ

  


要是使用 `<use>` 怎么来绘制上图的太阳呢？我们使用 `<use>` 元素的主要目的是重复使用 `<line>` （太阳线），因此，我们还得使用一个 `<circle>` 和 `<line>` 元素绘制出太阳的“脸蛋”（中间的圆）和一条太阳线：

  


```XML
<svg class="sun" viewBox="-15 -15 30 30">
    <circle r="6" fill="#F8CE6A" x="0" y="0" stroke="#FEBA0B" stroke-width=".8" />
    <line id="solar-line" x1="0" y1="10" x2="0" y2="13" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf903a3d0ec64f1ab42ef2b21b6a8afe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=224171&e=jpg&b=050505)

  


现在，我们已经创建了一条用 `<line>` 元素绘制的太阳线。你可以使用 `<use>` 元素来重复使用此太阳线，并绘制出其他的太阳线。为了让 `<use>` 元素能够重复使用 `<line>` 元素绘制的太阳线，我们需要在 `<line>` 元素上指定一个 `id` 值，为这条线命名。这样，`<use>` 元素的 `href` 属性就可以引用这个 `id`，从而重复使用相同的太阳线：

  


```XML
<svg class="sun" viewBox="-15 -15 30 30">
    <circle r="6" fill="#F8CE6A" x="0" y="0" stroke="#FEBA0B" stroke-width=".8" />

    <line id="solar-line" x1="0" y1="10" x2="0" y2="13" />
    <use href="#solar-line" transform="rotate(45)" />
    <use href="#solar-line" transform="rotate(90)" />
    <use href="#solar-line" transform="rotate(135)" />
    <use href="#solar-line" transform="rotate(180)" />
    <use href="#solar-line" transform="rotate(225)" />
    <use href="#solar-line" transform="rotate(270)" />
    <use href="#solar-line" transform="rotate(315)" />
</svg>
```

  


上面的代码中，我们在 `<use>` 元素上使用了 `transform` 的 `rotate()` ，使每条重复利用的太阳线移动到其正确的位置。你甚至还可以将 `<line>` 和所有 `<use>` 元素嵌套在一个 `<g>` 元素内，毕竟它们都是太阳线，逻辑上是相关的图形：

  


```XML
<svg class="sun" viewBox="-15 -15 30 30">
    <circle r="6" fill="#F8CE6A" x="0" y="0" stroke="#FEBA0B" stroke-width=".8" />
  
    <g class="solar-lines">
        <line id="solar-line" x1="0" y1="10" x2="0" y2="13" />
        <use href="#solar-line" transform="rotate(45)" />
        <use href="#solar-line" transform="rotate(90)" />
        <use href="#solar-line" transform="rotate(135)" />
        <use href="#solar-line" transform="rotate(180)" />
        <use href="#solar-line" transform="rotate(225)" />
        <use href="#solar-line" transform="rotate(270)" />
        <use href="#solar-line" transform="rotate(315)" />
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1fe411609ab458eac6f3777117c3837~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=350524&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/oNOBKzV

  


请注意，你可以在 `<use>` 元素的 `href` 属性中引用任何 SVG 元素，即使该元素位于外部文件中。引用的元素或分组不必存在于同一个文件中。这对于组织文件（例如，你可以为重用组件创建一个文件）和缓存已使用的文件非常有用。例如，你为自己创建了一个图标组件，将项目中所有 Icon 图标存在一个名 `icons.svg` 文件中，你可以在任何一个项目中像下面这样引用 `icons.svg` 文件已定义的图标：

  


```XML
<use href="./path/icons.svg#sun" />
```

  


这种方式存在一定的兼容性，例如 IE11 之前的版本，使用 `<use>` 引用外部 SVG 是不起作用的。因此，这种方式请谨慎使用。

  


现在，你可以使用相似的方式来改造前面五角星的案例。与之前绘制五角星一样，首先将绘制五角星角的两个 `<polygon>` 放置在一个 `<g>` 元素中，并且给它指定一个 `id` 值，例如：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g class="arms" transform="translate(0,10)">
        <!-- 将重复使用这个角 -->
        <g id="arm">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
    
    </g>
</svg>
```

  


这是因为我们需要使用 `<use>` 重复使用五角星的角，也就是 `id` 名为 `arm` 的 `<g>` 元素：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g class="arms" transform="translate(0,10)">
        <g id="arm">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
        <use href="#arm" transform="rotate(72)" />
        <use href="#arm" transform="rotate(144)" />
        <use href="#arm" transform="rotate(216)" />
        <use href="#arm" transform="rotate(288)" />
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e43a61d6ab8e4ee28f414fadac814dbf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=340240&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/bGJgXLq

  


`<use>` 元素允许你重用已经呈现在画布上的元素。但是，如果你想定义一个不显示的元素，然后在需要或想要时在特定位置绘制它呢？这就是 `<defs>` 元素的用武之地。

  


## 使用 `<defs>` 元素存储可重用元素

  


在上面两个示例中，你可能已经注意到了一个共同点：无论是重复利用 `<line>` 元素绘制的太阳线，还是重复利用 `<g>` 元素中 `<polygon>` 绘制的五角星的“角”，这些可重用的元素都会在 SVG 视口中进行渲染。然而，如果你希望这些可重用的元素不在 SVG 视口中渲染，而只是作为一个被复制的对象存在，那么 SVG 的 `<defs>` 元素就是你的不二选择。

  


SVG 的 `<defs>` 元素充当了一个非渲染的容器，主要用于存储那些不会直接显示在页面上的内容，比如可重用的图形元素、渐变、滤镜和纹理等。它的作用类似于一个“仓库”，用于存放那些在整个 SVG 文档中需要多次使用的元素，以便于集中管理和维护。换句话说，`<defs>` 元素的作用是定义元素，而不是直接渲染它们。然后，这些存储在 `<defs>` 内部的隐藏内容可以被其他 SVG 元素引用和显示。这意味着，使用 `<defs>` 元素可以使 SVG 文档更加模块化，减少代码的重复性，提高代码的可维护性和可读性。

  


通过使用 `<defs>` 元素，我们可以定义需要重复使用的任何元素，无论是之前提到的五角星的“角”（`<g>` 元素），还是太阳线（`<line>` 元素），甚至是更为复杂的 SVG 效果，比如裁剪、渐变、滤镜和纹理等。基本上，任何我们想要定义和存储以备将来使用的内容都可以放在 `<defs>` 元素内部，并且该元素将作为未来使用的模板或者工具，但它本身不会被渲染，只有当它的实例被调用时才会显示出来。

  


下面是 `<defs>` 元素的一些主要特点和用法：

  


-   定义可重用的图形元素： 在 `<defs>` 元素内部，可以定义各种类型的图形元素，如 `<path>`、`<circle>`、`<rect>` 等。这些图形元素可以在整个 SVG 文档中被多次引用。
-   定义渐变： `<defs>` 元素常用于定义线性渐变 (`<linearGradient>`) 和径向渐变 (`<radialGradient>`)。通过定义渐变，可以在 SVG 图形中应用复杂的颜色效果，而无需重复定义渐变的属性。
-   定义滤镜： `<defs>` 元素也可以用来定义滤镜效果，比如模糊、阴影等。定义一次滤镜效果后，可以在需要的地方通过 `<filter>` 元素引用，并将其应用到具体的图形元素上。
-   定义图案和纹理： 除了渐变和滤镜外，`<defs>` 元素还可以用来定义图案 (`<pattern>`) 和纹理等。这些图案和纹理可以应用于填充图形元素，从而创建出复杂的视觉效果。

  


使用 `<defs>` 元素时，通常会结合 `<use>` 元素来实现图形元素的重用。定义在 `<defs>` 内部的元素可以通过在其他地方引用来重复使用，从而提高 SVG 图形的效率和灵活性。

  


继续以绘制五角形为例。我们都知道，不管是重复使用 `<g>` 元素，还是使用 `<use>` 元素，它们都在重复使用下面代码所绘制的五角星的“角”：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <g id="arm">
        <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
        <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
</svg>        
```

  


既然如此，我们可以把这个对象存储在 `<defs>` 中：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <defs>
        <g id="arm">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
    </defs>
</svg>    
```

  


注意，前面我们提到过，`<defs>` 是个不可渲染的元素，放置在 `<defs>` 的所有内容都不会在 SVG 视口中呈现。因此，这个时候，你在 SVG 视口中看不到任何图形。

  


现在，我们可以通过 `<use>` 元素来重复使用存储在 `<defs>` 中的对象，比如这个示例中的 `#arm` ，它是一个 `<g>` 元素：

  


```XML
<svg viewBox="-100 -100 200 200" class="star">
    <defs>
        <g id="arm">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
    </defs>
    
    <g class="arms" transform="translate(0,10)">
        <use href="#arm"  />
        <use href="#arm" transform="rotate(72)" />
        <use href="#arm" transform="rotate(144)" />
        <use href="#arm" transform="rotate(216)" />
        <use href="#arm" transform="rotate(288)" />
    </g>
</svg>  
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e71c1a94a9114430ba44ae3af34542f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1448&s=340240&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/YzMZKLV

  


我们再来看一个稍微复杂一点的案例。在 `<defs>` 中存储了一个径性渐变：

  


```XML
<svg viewBox="-100 -200 200 400" class="snowman">
    <defs>
        <radialGradient id="snowball" cx="0.25" cy="0.25" r="1">
            <stop offset="0%" stop-color="white" />
            <stop offset="50%" stop-color="white" />
            <stop offset="100%" stop-color="#d6d6d6" />
        </radialGradient>
    </defs>
</svg>
```

  


然后将其（径向渐变 `#snowball`）用作其他 SVG 元素的填充颜色：

  


```XML
<svg viewBox="-100 -200 200 400" class="snowman">
    <defs>
        <radialGradient id="snowball" cx="0.25" cy="0.25" r="1">
            <stop offset="0%" stop-color="white" />
            <stop offset="50%" stop-color="white" />
            <stop offset="100%" stop-color="#d6d6d6" />
        </radialGradient>
        
        <circle id="eye" cx="0" cy="-55" r="5" />
    </defs>

    <circle class="body" cx="0" cy="60" r="80" fill="url(#snowball)" />

    <g class="head">
        <circle class="face" cx="0" cy="-40" r="50" fill="url(#snowball)" />
        <g class="eyes">
            <use href="#eye" />
            <use href="#eye" x="20" />
        </g>
        <polygon class="mouth" points="10,-46 50,-40 10,-34" fill="#e66465" />
    </g>

    <g class="branch">
        <line x1="-40" y1="30" x2="-90" y2="-30" stroke="pink" stroke-width="5" />
        <line x1="-65" y1="0" x2="-90" y2="-10" stroke="pink" stroke-width="5" />
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea1af356c16048b19d41c28e7046f23f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1095&s=182213&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/RwOpbBL

  


使用 `<defs>` 元素存储可重用的对象时，原始元素不仅不会被直接渲染，而且在你想要在 `<defs>` 内重用一个元素时，你为每个实例指定的位置将相对于用户坐标系统的原点设置，而不是相对于原始元素的位置。举例来说，考虑下面这个示例，我们使用 SVG 绘制了一串樱桃，它由“茎叶”和“果实”组成。“茎叶”被分组到一个 `id` 名为 `stems-leaf` 的组内，它由茎和叶两个部分组成，分别使用两个 `<path>` 元素绘制而成；而樱桃的“果实”也是由两个 `<path>` 绘制面成，并且将它们分组到一个 `id` 名为 `cherrys` 的组内。随后，这个组与“茎叶”一起分组到一个 `id` 名为 `fruit-cherry` 的组中。

  


如果我们将 `#fruit-cherry` 组嵌套在 `<defs>` 元素中，那么它是不会在画布上渲染的。

  


```XML
<svg class="cherry" viewBox="0 0 512 512">
    <defs>
        <!-- 一串樱桃 -->
        <g id="fruit-cherry">
            <!-- 樱桃茎叶 -->
            <g id="stems-leaf" stroke="#7AA20D" stroke-linejoin="round" stroke-linecap="round">
                <path class="stems" fill="none" stroke-width="8" d="M54.817,169.848c0,0,77.943-73.477,82.528-104.043c4.585-30.566,46.364,91.186,27.512,121.498" />
                <path class="leaf" fill="#7AA20D" stroke-width="4" d="M134.747,62.926c-1.342-6.078,0.404-12.924,5.762-19.681c11.179-14.098,23.582-17.539,40.795-17.846 c0.007,0,22.115-0.396,26.714-20.031c-2.859,12.205-5.58,24.168-9.774,36.045c-6.817,19.301-22.399,48.527-47.631,38.028 C141.823,75.784,136.277,69.855,134.747,62.926z" />
            </g>
            
            <!-- 樱桃果实 -->
            <g id="cherrys" fill="#ED6E46" stroke="#ED6E46" stroke-width="12">
                <path class="r-cherry" d="M164.836,193.136 c1.754-0.12,3.609-0.485,5.649-1.148c8.512-2.768,21.185-6.985,28.181,3.152c15.076,21.845,5.764,55.876-18.387,66.523 c-27.61,12.172-58.962-16.947-56.383-45.005c1.266-13.779,8.163-35.95,26.136-27.478   C155.46,191.738,159.715,193.485,164.836,193.136z" />
                <path class="l-cherry" d="M55.99,176.859 c1.736,0.273,3.626,0.328,5.763,0.135c8.914-0.809,22.207-2.108,26.778,9.329c9.851,24.647-6.784,55.761-32.696,60.78 c-29.623,5.739-53.728-29.614-44.985-56.399c4.294-13.154,15.94-33.241,31.584-20.99C47.158,173.415,50.919,176.062,55.99,176.859z" />
            </g>
        </g>
    </defs>

</svg>
```

  


现在，这串樱桃 `#fruit-cherry` 可以作为一个模板供使用。我们可以像使用任何其他元素一样使用它，使用 `<use>` 元素。唯一的区别在于，在这种情况下，`x` 和 `y` 属性现在是相对于用户坐标系统设置的，而不是相对于被使用的元素的位置。

  


例如，我们使用 `<use>` 元素在 SVG 画布上创建了三串樱桃，并通过 `x` 和 `y` 属性设置它们的位置：

  


```XML
<use xlink:href="#fruit-cherry" />
<use xlink:href="#fruit-cherry" x="220" />
<use xlink:href="#fruit-cherry" x="100" y="210" />
```

  


假设在这种情况下用户坐标系统与视口的宽高相匹配，原点位于 SVG 视口的左上角，上面代码最终得到的结果如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9552ae65ab294ac087348a1d5c6eaee6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1469&s=455162&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/WNWpeBm

  


正如你在上面的图片中看到的，每串樱桃都相对于坐标系的原点进行了定位，而在这种情况下，原点是 SVG 的左上角。因此，每串樱桃的左上角都位于用户坐标系统中的其自身的 `(x，y)` 位置，与其他樱桃独立，与在 `<defs>` 内定义的樱桃模板无关。

  


当你使用 `<defs>` 定义的重用元素时，可以为每个独立对象（如上面示例中的“一串串樱桃”）应用不同的样式和填充颜色，前提是这些样式没有在原始“樱桃”模板上定义。如果 `<defs>` 内的“樱桃”应用了样式，这些样式仍然不会被任何新的样式覆盖。因此，`<defs>` 非常适合创建最小的模板，然后根据需要对副本进行样式设置。如果没有 `<defs>` ，单独使用 `<use>` 就无法实现这一点。

  


注意，有关于样式覆盖这一部分内容，稍后还会单独讨论。

  


## 使用 `<symbol>` 元素进行分组

  


SVG 的 `<symbol>` 元素是用于定义可重用图形符号的元素。它允许你将一个或多个图形元素打包成一个符号，然后在需要时通过 `<use>` 元素进行引用。这种机制非常适合定义独立的图形符号，比如图标、标志或其他可重复使用的图形元素。

  


以下是 `<symbol>` 元素的一些关键特点和使用方法：

  


-   定义图形符号：`<symbol>` 元素内部包含了一个或多个 SVG 图形元素，如路径（`<path>`）、矩形（`<rect>`）、圆形（`<circle>`）等。这些图形元素定义了图形符号的形状和样式。
-   标识符：每个 `<symbol>` 元素通常都会有一个唯一的 `id` 属性，用于标识这个符号。这个 `id` 属性在后续使用 `<use>` 元素引用该符号时会被用到。
-   复用：一旦定义了 `<symbol>` 元素，你可以在同一个 SVG 文档中的任何地方重复使用它。通过 `<use>` 元素，你可以在文档的不同位置插入相同的图形符号，而不需要重复定义相同的图形元素。
-   样式和属性继承：在使用 `<symbol>` 元素定义的图形符号中，可以设置各种样式和属性，如填充色、边框色、线条粗细等。这些样式和属性会被继承到使用 `<use>` 元素引用该符号的地方，但也可以在引用时进行覆盖。
-   图形符号的不可见性：与 `<defs>` 元素类似，`<symbol>` 元素也是不可渲染的，它内部定义的图形在 SVG 渲染时不会直接显示出来。而是通过 `<use>` 元素引用和显示。

  


简而言之，`<symbol>` 元素类似于组元素 `<g>`，它提供了一种将元素组合在一起的方法。然而，它与 `<g>` 组元素在两个方面有所不同：

  


-   `<symbol>` 元素类似于 `<defs>` 元素，是一个不可渲染的 SVG 元素。在没有被其他元素（例如 `<use>` 元素）引用的情况下，它定义的图形符号不会在 SVG 画布中显示出来。
-   `<symbol>` 元素可以拥有自己的 `viewBox` 和 `preserveAspectRatio` 属性。这使得它可以根据需要适应于渲染到的视口，而不是默认的方式。

  


SVG Sprites（SVG 雪碧图）应该是 `<symbol>` 最经典的用例。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62d163d66a5d4bf9b5b0b8b9be62be63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3166&h=1070&s=274634&e=jpg&b=ffffff)

  


如上图所示，我们在构建 Web 应用或网站时，很可能会应用到很多小图标，而且应用 SVG 版本的 Icon 图标是具有明显优势的，例如缩放自如，还不失真。针对这种情境，使用 SVG 的 `<symbol>` 元素将 Web 应用上所需图标集中在一起管理将是一个非常不错的选择。

  


```XML
<svg class="icons sr-only">
    <symbol id="youtube" viewBox="0 0 1024 1024">
        <title>youtube</title>
        <g fill="#212121">
            <path d="M832 128 192 128c-105.6 0-192 86.4-192 192l0 384c0 105.6 86.4 192 192 192l640 0c105.6 0 192-86.4 192-192L1024 320C1024 214.4 937.6 128 832 128zM384 768 384 256l320 256L384 768z" fill="#212121" p-id="1710923637258-2546986_12356" />
        </g>
    </symbol>
    
    <symbol id="weibo" viewBox="0 0 1024 1024"></symbol>
  
    <!-- 其他 symbol -->
</svg>
```

  


上面的代码相当于把将可能会用的到 Icon 图标都放置在一个单独的 SVG 文档中，你也可以其直接嵌套在 HTML 文档中，具体根据实际需求来决定。虽然 `<symbol>` 不会在 SVG 画布中直接呈现，但 `<svg>` 根元素还是会占有一定的空间，为了避免它破坏 Web 布局，你可以直接给它设置一个内联的 `style="display: none"` 。但不建议这样用，因为对 Web 可访问性不太友好，我习惯是使用其他的方案来达到相似的效果（隐藏元素）：

  


```CSS
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

  


> 请注意，`display` 属性不适用于 `<symbol>` 元素；因此，即使将 `display` 属性设置为 `none` 以外的值， `<symbol>` 元素也不会直接呈现，并且即使在 `<symbol>` 元素或其任何祖先上设置了`display` 属性为 `none`，`<symbol>` 元素也可用于引用。

  


接下来，根据实际需求，使用 `<use>` 元素的 `href` 属性来引用 `<symbol>` 元素的 `id` 名，你就可以将所需要的图标应用于 Web：

  


```HTML
<ul class="nav">
    <li>
        <a href="#">
            <svg>
                <use href="#twitter" />
            </svg>
            <span>Twitter</span>
        </a>
    </li>
    <!-- 其他 li -->
</ul>
```

  


添加一些 CSS 代码：

  


```CSS
.nav {
    a {
      color: #767c8c;
      transition: color .3s ease-in;
      
        &:hover {
            color: #00b3b0;
        }
    }
    
    svg {
        display: block;
        width: 1.5em;
        height: 1.5em;
        fill: currentColor;    
    }
    
    use {
        fill: red;    
    }
}
```

  


你看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31a1c5b6cefc49c8b942427b3f1e7f52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=536&s=389593&e=gif&f=119&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/jORBEva

  


你可能已经发现了，虽然我们在 CSS 中给 `use` 设置了 `fill:red` ，Icon 图标的颜色并没有被调整。接下来，我们就要来聊聊这方面的内容。

  


## 使用 CSS 样式化 SVG `<use>` 元素内容

  


在前面的学习中，我们了解到 SVG 的 `<g>`、`<defs>`、`<symbol>` 和 `<use>` 元素在分组和引用元素方面发挥着重要作用：

  


-   `<g>` 元素用于逻辑上将一组相关的图形元素进行分组。将元素分组对于应用样式并使所有元素继承该样式的情况非常有用，特别是当需要对一组元素进行动画处理并保持它们之间的空间关系时。
-   `<defs>` 元素对于定义许多内容都很有用，其中一个主要用例是定义模式（例如渐变），然后将这些渐变用作其他 SVG 元素的描边和填充。它可用于通过引用在画布上的任何位置定义的任何元素来定义。
-   `<symbol>` 元素结合了 `<g>` 和 `<defs>` 元素的优点，因为它用于将定义模板的元素组合在一起，该模板将在文档中的其他地方引用。与 `<defs>` 不同，`<symbol>` 主要用于定义符号（例如图标），这些符号在整个文档中被引用。与其他两个元素相比，`<symbol>` 元素具有一个重要的优势，即接受 `viewBox` 和 `preserveAspectRatio` 属性，使其可以根据需要适应于渲染到的视口，而不是默认的方式。
-   `<use>` 元素是用于引用文档中其他地方定义的任何元素的元素。它可用于重用单个元素，也可用于重用由 `<g>` 元素、`<defs>` 元素或 `<symbol>` 定义的一组元素。

  


虽然 SVG 的 `<use>` 元素有许多优点，如提高代码的可维护性和重用性，但它也存在一个明显的缺陷，那就是样式继承问题。`<use>` 元素会继承被引用元素的样式，这可能会导致一些意外的效果。如果被引用元素和 `<use>` 元素具有不同的样式，就可能出现样式冲突或不一致的情况。以 SVG 雪碧图为例，我们要重置 `<use>` 元素实例的样式，就会面临巨大的挑战。

  


接下来，我们来一起探讨为什么样式化 `<use>` 引用的实例可能具有挑战性以及解决这些问题的方法。

  


继续以 SVG 雪碧图为例，当你使用 `<use>` 引用一个元素（例如 Icon 图标），代码可能如下所示：

  


```XML
<!-- 使用 symbol 定义和管理所需要的 icon 图标 -->
<svg class="icons sr-only">
    <symbol id="youtube" viewBox="0 0 1024 1024">
        <title>youtube</title>
        <g fill="#212121">
            <path d="M832 128 192 128c-105.6 0-192 86.4-192 192l0 384c0 105.6 86.4 192 192 192l640 0c105.6 0 192-86.4 192-192L1024 320C1024 214.4 937.6 128 832 128zM384 768 384 256l320 256L384 768z" fill="#212121" p-id="1710923637258-2546986_12356" />
        </g>
    </symbol>
    
    <symbol id="weibo" viewBox="0 0 1024 1024"></symbol>
  
    <!-- 其他 symbol -->
</svg>

<!-- 使用 use 将需要的 icon 引入到 Web 应用或网站中 -->
<ul class="nav">
    <li>
        <a href="#">
            <svg>
                <use href="#twitter" />
            </svg>
            <span>Twitter</span>
        </a>
    </li>
    <!-- 其他 li -->
</ul>
```

  


当你在屏幕上看到的图标时，实际上它是在 `<symbol>` 元素内部定义的，但呈现在屏幕上的不是 `<symbol>` 的内容，而是 `<use>` 的内容，这相当于是 `<symbol>` 内容的一个副本或克隆。但是 `<use>` 元素只是一个 SVG 元素，并且是自闭合的（即 `<use>` 元素的开始和结束标签之间没有任何内容）。那么第一个问题是，`<use>` 元素克隆来的内容到底放在哪里呢？

  


如果您打开浏览器的开发者工具，检查 `<use>` 元素的实例化内容（例如“Twitter”图标），你会发现在 `<use>` 元素下面有一个 `#shadow-root` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8752231cc34c4fb7b220255021193382~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1628&s=681169&e=jpg&b=060606)

  


`#shadow-root` 自身有一个专业的术语，即 **Shadow DOM**。

  


> 特别声明，至于 Shadow DOM 是何方神圣，这里就不做过多的阐述，因为相关的内容超出了这节课的范畴。如果你想进一步了解这方面的内容，你可以移步阅读 W3C 提供的相关规范：[Shadow DOM](https://www.w3.org/TR/shadow-dom/)！

  


从上面的截图中可以看出，SVG 的 `<use>` 元素所实例化的内容被克隆到一个由 `<use>` 元素“托管”的文档片段中。在这种情况下，`<use>` 元素被称为 Shadow Host。换句话说，`<use>` 元素克隆的内容以一种我们熟悉的 DOM 方式存在，但是存在于 `<use>` 元素托管的文档片段中，就像是一个影子一样。

  


对于开发者而言，不能像平时那样使用 CSS 或 JavaScript 来处理 `<use>` 元素托管的文档片段中的 DOM 元素，这是最令人关心的问题之一。开发者希望能够覆盖存在于 Shadow DOM 中的内容，特别是对于样式设置。例如，在介绍 `<symbol>` 元素时所展示的图标用例中，我们可能希望图标的颜色能够与链接文本的颜色同步。

  


然而，实际情况并不如我们想象的那么简单。我们不能以熟悉的方式处理 Shadow DOM 中元素的样式。例如，下面这样的选择器无法选中 Shadow DOM 中的 DOM 元素：

  


```CSS
use path {
    fill: red;
}
```

  


这意味着，Web 开发者无法使用常规的 CSS 选择器来访问 Shadow DOM 中的元素。

  


如果你曾经尝试过在 Web 开发中自定义 `type` 为 `range` 的 `input` 元素的样式，你可能会知道，开发者可以使用一些特殊的选择器来穿透 Shadow DOM 的边界，以选中其中的元素并应用样式。例如：

  


```CSS
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    cursor: pointer;
    -webkit-transition: all 0.15s ()ease-in-out;
    transition: all 0.15s ()ease-in-out;
}
```

  


即便如此，这并不代表这是一种普适的解决方案。因为能够穿透 Shadow DOM 边界的选择器非常有限，并且这些选择器的支持也不一定稳定。

  


除此之外，Web 开发者希望有一种更简便的方法来为 `<use>` 元素的内容设置样式，而不必费力地穿透 Shadow DOM 的边界。为了实现这一目标，并对 `<use>` 元素的内容样式拥有更多的控制权，我们需要以不同的视角来思考，并充分利用 CSS 的层叠和继承特性。

  


样式化 SVG 元素与样式化 HTML 元素是极其相似的。SVG 元素除了可以使用表示属性进行样式化之外，还可以使用 CSS 的三种不同方式进行样式化：外部 CSS 样式（在外部样式表中）、内部样式块（`<style></style>` 元素）和内联样式（元素的 `style` 属性），因此级联规则决定了如何对 SVG 元素进行样式化处理。

  


样式化 SVG 元素与样式化 HTML 元素非常相似。SVG 元素不仅可以使用其自身的属性进行样式化，还可以通过三种不同方式使用 CSS 进行样式化：外部 CSS 样式（在外部样式表中）、 SVG 文档内部样式块（`<style></style>` 元素）和内联样式（元素的 `style` 属性）。因此，级联规则决定了如何对 SVG 元素进行样式化处理。

  


```XML
<!-- SVG 元素属性样式化 -->
<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="20" fill="lime" stroke="orange" stroke-width="2" />
</svg>

<!-- 内部样式块 -->
<svg viewBox="0 0 100 100">
    <style>
        circle {
            fill: lime;
            stroke: orange;
            stroke-width: 2;
        }
    </style>
    <circle cx="50" cy="50" r="20" fill="lime" stroke="orange" stroke-width="2" />
</svg>
```

  


外部样式表：

  


```XML
<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="20" fill="lime" stroke="orange" stroke-width="2" />
</svg>    
```

  


```CSS
circle {
    fill: red;
    stroke: lime;
    stroke-width: 4;
}
```

  


SVG 元素内联样式：

  


```XML
<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="20" style="fill: lime; stroke: orange; stroke-width: 2"  />
</svg>   
```

  


请注意，[SVG 规范](https://www.w3.org/TR/SVG/propidx.html)中列出了一些可以作为 CSS 属性设置的 SVG 属性。其中一些属性与 CSS 共享，例如 `opacity` 和 `transform`，而另一些则不是，例如 `fill`、`stroke` 和 `stroke-width` 等。在 [SVG 2.0 规范](https://www.w3.org/TR/SVG2/styling.html#SVGStylingProperties)中，扩展了一些属性可以作为 CSS 属性来样式化 SVG 元素，例如 `x`、`y`、`width`、`height`、`cx` 和 `cy` 等。

  


尽管可以使用多种方式对 SVG 元素进行样式化处理，但它们的权重是有所不同的。使用 SVG 元素属性进行样式化处理的权重最低，会被任何其他样式定义（外部样式表、文档样式表和内联样式）所覆盖。SVG 元素样式属性在样式级联中唯一具有的权力是对继承样式的覆盖。换句话说，样式属性只能覆盖元素上继承的样式，并且会被任何其他样式声明所覆盖。

  


现在，明确了这一点，让我们回到 `<use>` 元素及其内容。

  


我们现在知道不能使用 CSS 选择器来设置 `<use>` 元素内部的元素样式。我们还知道，就像 `<g>` 元素一样，应用于 `<use>` 的样式将被其所有后代元素（在 Shadow DOM 中）继承。因此，尝试改变 `<use>` 内部元素的填充颜色的第一个尝试是将该填充颜色应用于 `<use>` 元素本身，并让继承和级联自行处理。

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <path fill="#000" d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z"/>
        <rect fill="#000" x="1" y="7" width="15" height="12" rx="3" ry="3"/>
        <path fill="#000" d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z"/>
        <path fill="#000" d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
        <path fill="#000" d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
    </symbol>
</svg>
```

  


```XML
<svg class="icon" aria-hidden="true">
    <use href="#icon-coffee" />
</svg>
```

  


`<symbol>` 中的 `<rect>` 和 `<path>` 元素的 `fill` 被 `<use>` 元素的所有后代元素继承。最终呈现的是一个黑色的“喝咖啡”的图标。

  


如果你希望得到是一个其他颜色的图标，例如 `lime` 颜色。我们是无法直接通过普通的 CSS 选择器来选中 `<use>` 元素的后代元素，但又为了需要改变图标颜色，很多 Web 开发者会考虑直接在 `<symbol>` 中修改元素的 `fill` 属性。例如：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <path fill="lime" d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z"/>
        <rect fill="lime" x="1" y="7" width="15" height="12" rx="3" ry="3"/>
        <path fill="lime" d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z"/>
        <path fill="lime" d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
        <path fill="lime" d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
    </symbol>
</svg>
```

  


这种方式可以使你得到一个绿色的图标。

  


甚至你可能会考虑，将 `<symbol>` 中绘制图形元素的样式属性都从元素中删除。例如，移除上面示例代码中 `<rect>` 和 `<path>` 元素的 `fill` 属性，然后在 `<use>` 元素上应用一个 `fill` 属性，使其后代元素继承该属性：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <path  d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z"/>
        <rect  x="1" y="7" width="15" height="12" rx="3" ry="3"/>
        <path  d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z"/>
        <path  d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
        <path  d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
    </symbol>
</svg>

<svg class="icon" aria-hidden="true">
    <use href="#icon-coffee" fill="lime" />
</svg>
```

  


这种方式你同样可以获得所需要的图标。但问题也随之而来：

  


首先，`fill` 将被 `<use>` 的所有后代元素继承，即使你可能不想对所有后代元素进行样式化。也就是说，如果 `<use>` 内只有一个元素，或者你只需要一个单色图标，这种方式不会有任何问题。反之，如果 `<use>` 内有多个元素，并且是一个彩色图标（哪怕是两种颜色），这种方式会使你得不到最终想要的结果。

  


其次，你的 SVG 代码可能是通过诸如 Figma 图形设计软件导出或从设计师那里获得，或从第三方平台获得，并且出于任何原因，你可能没有权限或机会修改 SVG 代码。那么上面这两种方式也无法让你获得预期的图标。即使你可以有权限编辑 SVG 代码，我个人也强烈建议你不要这样做。因为：

  


-   在大多数情况下，这些属性的值都是黑色（我们这里讨论的是 `fill` 属性），可以称为浏览器的默认值。一旦你移除这些属性，你不得不重置它们，否则它将以黑色形式存在，除非你刚好需要
-   你可能需要重置所有值，例如 `fill`、`stroke`、`stroke-width` 等

  


也就是说，我们应该找到一些更合理的方式对 `<use>` 元素的内容进行样式化处理。

  


事实上，我们还是可以找到一些更合理，更优雅的方式来样式化 `<use>` 元素的内容。

  


首先，我们可以利用 SVG 元素样式属性会被任何其他样式声明覆盖这一特点，让外部样式声明的属性样式覆盖来自 `<use>` 的继续值。通过使用 CSS 的 `inherit` 关键字，会使事情变得非常简单。继续以上面的代码为例，我们希望得到不同颜色的图标：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <path fill="#000" d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z"/>
        <rect fill="#000" x="1" y="7" width="15" height="12" rx="3" ry="3"/>
        <path fill="#000" d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z"/>
        <path fill="#000" d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
        <path fill="#000" d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
    </symbol>
</svg>
```

  


```XML
<svg class="icon" aria-hidden="true">
    <use href="#icon-coffee" class="coffee-1" />
</svg>

<svg class="icon" aria-hidden="true">
    <use href="#icon-coffee" class="coffee-2" />
</svg>

<svg class="icon" aria-hidden="true">
    <use href="#icon-coffee" class="coffee-3" />
</svg>
```

  


我们使用 `<use>` 渲染了多个图标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/890a000051e14b118e53bbef8682f1a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=831&s=126271&e=jpg&b=050505)

  


现在让我们尝试为每个图标实例更改填充颜色：

  


```CSS
.coffee-1 {
    fill: lime;
}

.coffee-2 {
    fill: skyblue;
}

.coffee-3 {
    fill: brown;
} 
```

  


图标的填充颜色仍然不会改变，因为 `<use>` 元素的后代元素（`<rect>` 和 `<path>`）上的 `fill="#000"` 正在覆盖继承的颜色值。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/522b2ef126f447e2948fb47c0fcd5927~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3354&h=1212&s=527564&e=jpg&b=050505)

  


为了防止这种情况发生，我们需要强制 `<rect>` 和 `<path>` 元素继续颜色值：

  


```CSS
:is(rect, path) {
    svg & {
        fill: inherit;
    }
}
```

  


在我们这个示例，需要强制的是 `<rect>` 和 `<path>` ，换成别的图形，你可以还需要对其他元素做类似操作。你可以来点粗暴的方式，那就是将 `svg` 的所有后代元素的 `fill` 属性的值重置为 `inherit` ：

  


```CSS
svg * {
    fill: inherit;
}
```

  


现在，我们在每个 `<use>` 元素上设置的颜色被应用到了它的每个后代元素上。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13f4438361544ed0ac12808a12a782cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=831&s=153700&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/XWQMVGx

  


通过种方式，你可以获得任意你想的颜色图标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b26b5f90f21a446d905439453bda2a63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=740&s=1599341&e=gif&f=157&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/WNWpMNX

  


现在，当你希望强制 `<use>` 的内容继承你在其上设置的样式时，这种技术就非常有用。但在大多数情况下，这可能并不是你想要的确切效果。例如，你希望继承 `<use>` 元素上更多的样式，例如 `fill` 、`stroke` 、`stroke-width` 等。那么，你可能会发现你的 CSS 要这样做：

  


```CSS
:is(rect, path) {
    svg & {
        fill: inherit;
        stroke: inherit;
        stroke-width: inherit;
        /* 甚至还有其他要继承的样式 */
    }
}
```

  


如果你真的碰到类似这样的情景，这里有一个小技巧可以提供给大家。我们可以利用 CSS 的 `all` 属性使你的代码变得更简洁：

  


```CSS
:is(rect, path) {
    svg & {
        all: inherit;
    }
}
```

  


请注意，这只会影响可以在 CSS 中设置的属性，而不是仅适用于 SVG 的属性。因此，如果一个属性可以设置为 CSS 属性，它将被设置为 `inherit`，否则不会。虽然这样做能省不少事情，但带来的潜在风险也随之增加，如果你对 `all 和 inherit` 都不太了解的话，我不建议你这样使用。

  


上面这种方案，能够强制样式属性从 `<use>` 样式中继承是很强大，但是如果你有一个具有多个元素的图标，并且你不希望所有这些元素都从 `<use>` 继续相同的填充颜色，那么你就需要考虑其他的解决方案。继续以上面的“咖啡”图标为例，假设你希望“咖啡杯”与“咖啡热气”的填充颜色不相同，怎么办？

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25359107deea43bcb9ecf73b3c696e80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=831&s=117430&e=jpg&b=050505)

  


仅仅在 `<use>` 上设置一个样式肯定是行不通的。这个时候，我们需要其他方法来帮助我们将正确的颜色应用到正确的元素上。

  


针对于上图这种情景，我们可以使用 CSS 的 `currentColor` 变量来为 `<use>` 元素的内容设置样式。使用 CSS 的 `currentColor` 变量结合上述技术，我们可以在一个元素上指定两种不同的颜色，而不仅仅是一种。这种技术的背后思想是在 `<use>` 上同时使用 `fill` 和 `color` 属性，然后利用 `currentColor` 的变量特性，使这些颜色继承到 `<use>` 的内容中。

  


利用这种技术，我们需要对 `<symbol>` 做一些调整。例如上面的“咖啡”图标为例，我在 `<symbol>` 中新增了两个 `<g>` 元素，它将“咖啡杯”和“烟”分成两个组，并且将 `fill` 属性移至 `<g>` 元素。

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <g class="cup" fill="currentColor">
              <path d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z"/>
              <rect  x="1" y="7" width="15" height="12" rx="3" ry="3"/>
        </g>
        <g class="smoke">
            <path  d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z"/>
            <path  d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
            <path  d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"/>
        </g>
    </symbol>
</svg>
```

  


注意，我在 `.cup` （咖啡杯）的 `<g>` 元素上设置了 `fill` 为 `currentColor` ，同时将 `.smoke` 和其子元素的 `fill` 移除。如果我们继续以 `inherit` 来处理，事情反而会变得更为复杂一些。现在这样做，有一个很明显的优势，`fill` 为 `currentColor` 的 SVG 元素，它将继承 `<use>` 元素的 `color` 值（咖啡杯），未设置 `fill` 的 SVG 元素，它将直接继承 `<use>` 元素的 `fill` 值（烟）。如果我们继续使用 `inherit` 关键词来强制继承 `<use>` 的值，那么两个 `<g>` 元素（`.cup` 和 `.smoke`）都将继承相同的值，`currentColor` 将不再起作用。

  


现在，同时给 `<use>` 元素指定 `fill` 和 `color` 属性值，我们就可以使“咖啡杯和其上面的烟”具有不同的颜色：

  


```CSS
.coffee-1 {
    fill: red;
    color: orange;
}

.coffee-2 {
    fill: pink;
    color: lime;
}

.coffee-3 {
    fill: yellow;
    color: #f26ace;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a62b3f61ded3419a9cdfc2ca6fbfd3c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=831&s=203961&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/vYMxdqe

  


每个 `<use>` 元素都有自己的填充和颜色值。就这个示例来说，`.cup` 将会继承 `<use>` 元素的 `color` 属性的值，因为它的 `fill` 为 `currentColor` （在`<symbol>` 中）；`.smoke` 将会继承 `<use>` 元素的 `fill` 属性的值，因为它没有设置 `fill` 属性值（在`<symbol>` 中）。

  


你可以尝试在下面的示例中，随意调整 `fill` 和 `color` 的颜色值，将会获得任意你喜欢的图标（双色）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db5e643484774cf7b54a7117bc4527c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=544&s=1449387&e=gif&f=160&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/abxJYBp

  


注意，`currentColor` 也适用于单色图标，这比使用 `inherit` 还要更简便，唯一的要求是，需要在 `<symbol>` 中将 `fill` 属性的值设置为 `currentColor` 。你可以通过 `<g>` 元素，避免在每个元素上重置 `fill` 属性的值为 `currentColor` ：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <g fill="currentColor">
            <path d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z" />
            <rect x="1" y="7" width="15" height="12" rx="3" ry="3" />
            <path d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z" />
            <path d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z" />
            <path d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z" />
        </g>
    </symbol>
</svg> 

<svg class="icon-coffee" aria-hidden="true">
    <use href="#icon-coffee" class="coffee" />
</svg>
```

  


```CSS
.coffee {
    color: lime;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91df63ebaa15477496144bdc44ce7908~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=524&s=1159007&e=gif&f=141&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/abxJYWJ

  


继续加码，如果图标不是单色，也不仅是双色，而是更多的色彩呢？

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14bedebf3a6f4d79a6b531008319c361~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=831&s=139008&e=jpg&b=060606)

  


现在我们需要更多的变量。这也意味着，仅使用 `currentColor` 这个单一变量已经无法满足超出双色的情景了。庆幸的是，我们可以借助[现代 CSS](https://s.juejin.cn/ds/iF4TyfGx/) 中的[自定义属性](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)，即 CSS 变量来设置更多的变量。

  


使用 CSS 变量来样式化 `<use>` 内容与使用 `currentColor` 类似，首先我们需要将 `<symbol>` 中每个元素的 `fill` 属性值设置为 CSS 自定义属性：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <symbol id="icon-coffee" viewBox="0 0 20 20">
        <title>icon-coffee</title>
        <path fill="var(--fill-1, lime)" d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z" />
        <rect fill="var(--fill-2, lime)" x="1" y="7" width="15" height="12" rx="3" ry="3" />
        <path fill="var(--fill-3, lime)" d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z" />
        <path fill="var(--fill-4, lime)" d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z" />
        <path fill="var(--fill-5, lime)" d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z" />
    </symbol>
</svg>

<svg class="icon-coffee" aria-hidden="true">
    <use href="#icon-coffee" class="coffee" />
</svg>  
```

  


上面的代码中，我们为每个元素都设置了一个 CSS 自定义属性，并且提供了一个备用值 `lime` 。当你没有给每个变时显式指定值时，都将会使用备用值 `lime` 作为每个自定义属性的值。因此，你看到的咖啡杯将是一个纯色（`lime`）。

  


基于这个前提，你可以在 `<use>` 中为 CSS 自定义属性指定值：

  


```CSS
.coffee {
    --fill-1: red;
    --fill-2: green;
    --fill-3: blue;
    --fill-4: orange;
    --fill-5: pink;
}
```

  


这样你就可以非常容易得到一个多色有图标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61290ef14189418faf681f03ebf35667~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=550&s=2478443&e=gif&f=282&b=0a0a0a)

  


> Demo 地址：https://codepen.io/airen/full/abxJYyJ

  


通过利用CSS 层叠，尽管在 Shadow DOM中，对 `<use>` 元素的内容进行样式化可以变得不那么复杂。而且借助CSS 自定义属性（无论是仅使用 `currentColor` 还是自定义属性），我们可以穿透 Shadow DOM的边界，按照我们的喜好定制图形，同时为任何出现问题时提供非常好的回退机制。

  


就我个人而言，我对 CSS 自定义属性与 SVG 结合的功能非常兴奋。我喜欢它们在一起时的强大功能，特别是考虑到我们拥有的出色回退机制。但需要知道的是，[CSS 自定义属性非常的强大](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)，它可以帮助以更轻便的方式做更多复杂的事情，但它也有很多细节需要注意。不过，这部分内容已超出这节课的范畴，如果你感兴趣的话，可以移步阅读《[CSS 自定义属性你知道多少](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)》。

  


## 案例：会动的魔方

  


接下来，我们通过前面学到的相关知识来制作一个魔方，并通过几行简单的 CSS 代码，使这个魔方动起来：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29d76d020caa4357b27ce53ba0fce74a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=816&s=3188877&e=gif&f=266&b=ffffff)

  


> Demo 地址：https://codepen.io/marianab/full/KKKYdxE （来源于 [@Mariana Beldi](https://codepen.io/marianab) ）

  


正如你所看到的，整个魔方就是一个大立方体，它又是由很多个小立方体组成。绘制这个魔方和我们今天所学到知识非常的匹配。我们可以使用 SVG 的 `<use>` 克隆很多个小立方体，然后将它们拼装在一起，就组成了一个魔方（大立体）。

  


这意味着，在使用 `<use>` 之前，我们先要有一个小立方体。这在 SVG 中，一点都不难。我们可以通过三个 `<rect>` 绘制小立方体的三个可视面（虽然一个立方体是六个面，但在这个示例中，我们只需要三个就足够了）。需要知道的是，`<rect>` 只会绘制出三个矩形，你需要应用一点 `transform` 相关的知识，把三个矩形拼接组成一个立方体：

  


```XML
<svg viewBox="-130 -20 300 100" class="cub">
    <g id="cube" class="cube-unit">
        <rect width="21" height="24" fill="#00affa" stroke="#0079ad" transform="skewY(30)"/>
        <rect width="21" height="24" fill="#008bc7" stroke="#0079ad" transform="skewY(-30) translate(21 24.3)"/>
        <rect width="21" height="21" fill="#009CDE" stroke="#0079ad" transform="scale(1.41,.81) rotate(45) translate(0 -21)"/>
    </g>
</svg>
```

  


上面示例中，应用于 `react` 元素的 `transform` 属性与 [CSS 的变换](https://juejin.cn/book/7223230325122400288/section/7259668493158023205)基本相似，如果使用过 CSS 的变换（`transform`），那么理解它们就不难。即使你从未接触过，也不用紧张，后面我们会有一节课专变介绍 SVG 的 `transform` 属性。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe3691b368324e36a8aeaaf9984c5b3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=831&s=104155&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/BaEWxVz

  


我们通过 `<g>` 元素来包裹这三个 `<rect>` ，并且给它指定了一个 `id` 名为 `cub` ，这是便于 `<use>` 元素来克隆出剩余的小立方体。

  


在克隆出大立方体之前，先把上面绘制出来的小立方体嵌套到一个 `<defs>` 中。

  


```XML
<svg class="sr-only">
    <defs>
        <g id="cube" fill-opacity= "0.9" stroke-miterlimit= "0">
            <rect width="21" height="24" fill="#00affa" stroke="#0079ad" transform="skewY(30)" />
            <rect width="21" height="24" fill="#008bc7" stroke="#0079ad" transform="skewY(-30) translate(21 24.3)" />
            <rect width="21" height="21" fill="#009CDE" stroke="#0079ad" transform="scale(1.41,.81) rotate(45) translate(0 -21)" />
        </g>
    </defs>
</svg>
```

  


你也可以使用 `<symbol>` 来替代前面示例中的 `<g>` 元素：

  


```XML
<svg class="sr-only">
    <symbol id="cube" viewBox="-30 -30 300 230">
        <rect width="21" height="24" fill="#00affa" stroke="#0079ad" transform="skewY(30)" fill-opacity= "0.9" stroke-miterlimit= "0"/>
        <rect width="21" height="24" fill="#008bc7" stroke="#0079ad" transform="skewY(-30) translate(21 24.3)" fill-opacity= "0.9" stroke-miterlimit= "0" />
        <rect width="21" height="21" fill="#009CDE" stroke="#0079ad" transform="scale(1.41,.81) rotate(45) translate(0 -21)" fill-opacity= "0.9" stroke-miterlimit= "0" />
    </symbol>    
</svg> 
```

  


`<defs>` 和 `<symbol>` 都不会让小立体方直接在 SVG 中画布上呈现，除非我们使用 `<use>` 元素来引用它们。以 `<symbol>` 为例，它也有一个 `id` 名 `cube` ，我们使用 `<use>` 的 `href` 属性来引用它，你可以根据你的需要引用任意次数，并在 `<use>` 元素上设置 `x` 和 `y` 值，更改克隆的小立体的位置：

  


```XML
<svg viewBox="50 50 300 230" class="cub">
    <use href="#cube" x="121" y="112" />
    <use href="#cube" x="100" y="124" />
    <use href="#cube" x="142" y="124" />
    <use href="#cube" x="121" y="136" />
    <use href="#cube" x="79" y="136" />
    <use href="#cube" x="163" y="136" />
    <use href="#cube" x="142" y="148" />
    <use href="#cube" x="100" y="148" />
    <use href="#cube" x="121" y="160" />
    <use href="#cube" x="121" y="88" />
    <use href="#cube" x="100" y="100" />
    <use href="#cube" x="142" y="100" />
    <use href="#cube" x="121" y="112" />
    <use href="#cube" x="79" y="112" />
    <use href="#cube" x="163" y="112" />
    <use href="#cube" x="142" y="124" />
    <use href="#cube" x="100" y="124" />
    <use href="#cube" x="121" y="136" />
    <use href="#cube" x="121" y="64" />
    <use href="#cube" x="100" y="76" />
    <use href="#cube" x="142" y="76" />
    <use href="#cube" x="121" y="88" />
    <use href="#cube" x="79" y="88" />
    <use href="#cube" x="163" y="88" />
    <use href="#cube" x="142" y="100" />
    <use href="#cube" x="100" y="100" />
    <use href="#cube" x="121" y="112" />
</svg>
```

  


现在一个蓝色的魔方就出现在你的眼前了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a3689c63e6447f690824f7b61c10b0f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1066&s=234398&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/WNWpJYO

  


如果你不喜欢蓝色，那么可以根据前面所学，使用 CSS 自定义属性来替代 `<symbol>` 中元素（`<rect>`）的 `fill` 和 `stroke` 属性值：

  


```XML
<svg class="sr-only">
    <symbol id="cube" viewBox="-30 -30 300 230">
        <rect width="21" height="24" fill="var(--lightColor, #00affa)" stroke="var(--strokeColor,#0079ad)" transform="skewY(30)" fill-opacity="0.9" stroke-miterlimit="0" />
        <rect width="21" height="24" fill="var(--darkColor,#008bc7)" stroke="var(--strokeColor,#0079ad)" transform="skewY(-30) translate(21 24.3)" fill-opacity="0.9" stroke-miterlimit="0" />
        <rect width="21" height="21" fill="var(--mainColor,#009CDE)" stroke="var(--strokeColor,#0079ad)" transform="scale(1.41,.81) rotate(45) translate(0 -21)" fill-opacity="0.9" stroke-miterlimit="0" />
    </symbol>
</svg>
```

  


你只需要在 CSS 中将 `--lightColor` 、`--darkColor` 、`--mainColor` 和 `--strokeColor` 设置为自己喜欢的颜色值，你就将获得自己喜欢的魔方：

  


```CSS
.pink-cube {
    --mainColor: #de0063;
    --strokeColor: #ad004e;
    --lightColor: #fa0070;
    --darkColor: #c7005a;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fc0dfc7c9c84e299d781283f27a28c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1066&s=201962&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/gOymKrg

  


这样，我们可以创建任意多的魔方，也可以获得任意颜色的魔方：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abbf34054e5a4d7591711a13b5488b09~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=774&s=6465997&e=gif&f=464&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/mdgWKwW

  


最后，你可以使用 [CSS 动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)，给魔方添加一个类似爆炸的动画效果：

  


```CSS
@layer animation {
    @keyframes moveX {
        to {
            translate: var(--translate, 35px) 0;
        }
    }
    
    @keyframes moveY {
        to {
            translate: 0 var(--translate, -35px);
        }
    }

    .m-left {
        --translate: -50px;
    }
    
    .m-right {
        --translate: 50px;
    }

    .m-left,
    .m-right {
        animation: 1s moveX alternate infinite paused;
    }
    
    .m-up,
    .m-down {
        animation: 1s moveY alternate infinite paused;
    }

    .cube:hover * {
        animation-play-state: running;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bfc37872df047268733f121a4050ed0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=728&s=12382441&e=gif&f=600&b=090909)

  


> Demo 地址：https://codepen.io/airen/full/xxeqzPb

  


## 小结

  


这节课中，我们深入探讨了如何组织和利用 SVG 图形的不同元素，以及它们之间的关系。

  


首先，我们介绍了 SVG 中的 `<g>` 元素，它用于将一组相关的图形元素进行逻辑分组。通过使用 `<g>` 元素，我们可以轻松地对一组元素应用样式、变换和动画，同时保持它们之间的空间关系。

  


其次，我们研究了 `<defs>` 元素的作用，它允许我们定义一组不直接显示在画布上的内容，如可重用的图形元素、渐变、滤镜等。`<defs>` 元素在整个 SVG 文档中多次使用的元素提供了一种统一的管理和维护方式，从而提高了代码的可维护性和可读性。

  


然后，我们学习了 `<symbol>` 元素的用法，它类似于 `<g>` 和 `<defs>` 元素，但具有自己的 `viewBox` 和 `preserveAspectRatio` 属性。`<symbol>` 元素通常用于定义符号，如图标，以便在文档中的其他地方引用。与 `<defs>` 不同，`<symbol>` 元素更适合定义模板，而不是直接渲染内容。

  


最后，我们讨论了如何使用 `<use>` 元素来引用和重用其他 SVG 元素。`<use>` 元素允许我们在文档中多次使用相同的图形元素，而无需重复编写代码。然而，我们也注意到了 `<use>` 元素的一些缺点，如样式继承问题和对 Shadow DOM 的限制。

  


总的来说，这节课提供了一种全面的方法来组织和管理 SVG 图形，使其更易于维护和重用。通过深入了解每种元素的用法和特性，我们可以更好地利用 SVG 技术，为网页和应用程序添加丰富的矢量图形效果。