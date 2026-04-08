在当今数字时代，Web 设计已经超越了静态的呈现方式，更加注重与用户互动和吸引。在这个变革的时刻，SVG 动画以其独特的矢量特性和可伸缩性，成为 Web 设计和开发领域的一颗璀璨明珠。而在 SVG 的世界中，SMIL动画为我们提供了一种独特的方式来实现这些引人入胜的动态效果。

  


随着互联网的发展，用户对于动态、生动的体验的需求不断增加。如何在 Web 中创造引人入胜的动画效果，使用户流连忘返，正是每个 Web 设计师和开发者都需要思考的问题。这节课将引导您深入了解 SVG 动画的核心原理和 SMIL 动画的高级特性。从基础知识到高级技巧，你将获得丰富的学习体验，为你的项目带来无限的创意可能性。

  


无论你是刚入门的新手，还是经验丰富的专业人士，这节课都将为你打开新的创作视角。让我们一同揭开 SVG 和 SMIL 动画的神秘面纱，释放创意的能量，为你的项目注入全新的生命和灵感。开始你的探索之旅吧，打造独一无二的动态网页设计！

  


## 为什么使用 SVG 动画？

  


[通过上一节课](https://juejin.cn/book/7288940354408022074/section/7308623638335815692)，我们知道 SVG 可以通过 CSS 进行样式和动画设计，基本上，可以应用于 HTML 元素的 CSS 动画（`animation` 或 `transition`）也可以应用于 SVG 元素。但是，有一些 SVG 属性通过 SVG 可以进行动画处理，而通过 CSS 不能。例如， SVG 路径（`<path>`）元素的 `d` 属性。`d` 属性对应的数据可以通过 SMIL 进行修改和动画，但不能通过 CSS 实现。这是因为 SVG 元素由一组称为 SVG 表示属性的属性描述。其中一些属性可以通过 CSS 进行设置、修改和动画处理，而其他一些则不能。

  


也就是说，SVG 中的有些动画和效果是无法通过 CSS 实现。庆幸的是，SVG 中无法使用 CSS 实现的动画可以通过使用 JavaScript 或 SMIL 派生的声明性 SVG 动画来填补。

  


SMIL 相对于JavaScript 动画，还具有另一个优势，当 SVG 作为 `img` 嵌入或用作 CSS 中的 `background-image` 时，JavaScript 动画不起作用。SMIL 动画在这两种情况下都能够工作（或应该能够，在浏览器支持的情况下）。这是一个很大的优势，我认为。由于这一点，你可能会选择 SMIL 而不是其他选项。接下来的内容，旨在帮助你开始使用SMIL。

  


## SMIL 是什么？

  


[SMIL（Synchronized Multimedia Integration Language）](https://www.w3.org/TR/SMIL3/)是 W3C 推荐的 XML 标记语言，用于描述多媒体演示。它定义了用于定时、布局、动画、视觉过渡和媒体嵌入的标记。SMIL 允许呈现诸如文本、图像、视频、链接到其他 SMIL 演示以及来自多个 Web 服务器的文件等媒体项。 SMIL 标记以 XML 编写，与 HTML 具有相似之处。

  


另外，SMIL 的设计目标是提供一种描述时间和空间的结构，使得多种媒体元素能够同步播放或呈现的方式。其主要特点和功能如下：

  


-   **多媒体同步**： SMIL 专注于实现多媒体元素的同步，包括文本、图像、音频和视频等。通过 SMIL，这些元素可以在时间轴上进行同步播放，实现更复杂的多媒体呈现
-   **时间控制**： SMIL 提供了对时间的精确控制，允许定义动画、过渡和媒体元素的出现和消失时间。这种时间控制使得开发者可以创造出更生动、有趣的多媒体演示
-   **嵌套结构**： SMIL 支持嵌套结构，允许开发者在文档中创建层次结构，以组织和控制多媒体元素的关系。这种嵌套结构提供了更灵活的布局和设计选项
-   **与 XML 的兼容性**： 作为一种基于 XML 的标记语言，SMIL 与 XML 兼容，可以与其他 XML 技术（如SVG、HTML等）集成使用，从而创造出更丰富的 Web 体验
-   **声明式动画**： SMIL 提供了一种声明式的动画方式，通过简单的 XML 标记就可以描述元素的动态行为，而无需编写大量的 JavaScript 代码。

  


总体而言，SMIL 为开发者提供了一种强大的工具，用于创建时间和空间上同步的多媒体演示。尽管在 Web 中的广泛使用受到了一些限制，但它仍然在特定的场景和应用中发挥着重要作用。

  


## SMIL 动画

  


[SMIL Animation](https://www.w3.org/TR/REC-smil/smil-animation.html)（Synchronized Multimedia Integration Language Animation）是一种使用 [SMIL](https://www.w3.org/TR/SMIL3/)（Synchronized Multimedia Integration Language）标准创建的多媒体动画。SMIL Animation 允许 Web 开发者定义和控制在 Web 上呈现的多媒体元素（如图像、音频、视频等）的时间序列和交互。

  


SMIL 本身是一种 XML（可扩展标记语言）应用，它提供了一种描述和同步多媒体元素的标准方式。SMIL Animation 通过在 SMIL 文档中使用特定的元素和属性，使得开发者能够创建丰富的多媒体演示和动画效果。

  


以下是SMIL Animation的一些关键特性和用法：

  


-   **时间轴控制**： SMIL Animation 通过定义时间轴上的关键帧和时刻，允许开发者对多媒体元素的时间表进行精确的控制。这包括动画的开始时间、结束时间、持续时间等
-   **同步多媒体**： SMIL Animation 强调多媒体元素之间的同步。开发者可以确保音频、视频、图形等元素在演示中同步播放，以创建更具交互性和表现力的用户体验
-   **动画效果**： SMIL Animation 支持各种动画效果，包括移动、缩放、旋转等。这些效果可以通过简单地定义在不同时间点的元素属性值来实现
-   **嵌套结构**： SMIL Animation 允许嵌套不同的动画元素，从而创建复杂的动画序列。这使得开发者可以构建更具层次结构和复杂性的动画场景
-   **与其他标准整合**： SMIL Animation 可以与其他 Web 标准和技术整合使用，例如 SVG、HTML 等。这使得它在创建富媒体内容和交互式用户界面方面非常灵活

  


尽管 SMIL Animation 在过去在 Web 开发中曾经很流行，但随着 HTML5 和 CSS3 的兴起，以及对 JavaScript 动画的广泛应用，其使用逐渐减少。然而，SMIL Animation 仍然在某些特定的场景和应用中具有一定的优势，特别是在需要强调多媒体元素同步性的情况下。

  


注意，了解 SVG 动画时， SMIL Animation 相比于 SVG 和 SMIL 更为重要。

  


## SVG 、SMIL 和 SMIL Animation 之间的关系

  


SVG 是一种用于描述二维矢量图形的 XML 标记语言，用于在 Web 上呈现图形。SVG 本身提供了一些基本的图形元素，例如矩形、圆形、线条等，以及文本和图像的支持。与此同时，SVG 还支持通过 SMIL和SMIL Animation（SMIL动画） 等标准来添加多媒体和动画效果。

  


-   **[SVG](https://www.w3.org/TR/SVG2/)**： SVG 是一种用于描述可伸缩矢量图形的 XML 标记语言。它定义了一组图形元素，可以用于创建静态和交互性的图形。SVG 提供了图形绘制和文本渲染的基本功能，但它可以通过整合其他标准和技术来实现更高级的效果。
-   **[SMIL](https://www.w3.org/TR/SMIL3/)**： SMIL 是一种用于创建同步多媒体演示的标准。它是一种 XML 应用，用于描述多媒体元素之间的时间关系和同步。SVG 中的动画效果和时间控制可以通过整合 SMIL 来实现，使得 SVG 文档能够包含丰富的多媒体内容和动画
-   **[SMIL Animation](https://www.w3.org/TR/REC-smil/smil-animation.html)**： SMIL Animation 是 SMIL 的一部分，专注于描述和控制动画效果。它提供了一种在文档中定义和控制动画序列的方式。在 SVG 中，可以使用 SMIL Animation 来添加对图形元素的动画效果，例如移动、旋转、渐变等

  


简单地说，SVG 图形可以使用动画元素进行动画处理。这些动画元素最初是在 [SMIL Animation 规范](https://www.w3.org/TR/REC-smil/smil-animation.html#animationNS-BasicAnimationElements)中定义的，其中包括：

  


-   **`<animate>`** ： 它允许你在 SVG 图形中定义各种动画效果，如平移、旋转、缩放、颜色变化等。
-   **`<set>`** ：它允许你在 SVG 图形中指定一个属性的值，并在特定的时间点将其设置为目标值。 `<set>` 通常用于创建静态的、非交互式的属性更改。
-   **`<animateMotion>`** ： 它允许你在 SVG 图形中指定元素的路径，然后动画元素将沿着运动路径移动。 `<animateMotion>` 提供了一种简便的方法来定义元素的动态运动。
-   **`<animateColor>`** ： 它允许你在 SVG 图形中指定颜色属性的动画效果，实现颜色的平滑过渡和变化。`<animateColor>` 主要用于对 SVG 元素的颜色属性（如 `fill` 或 `stroke`）进行动画处理。请注意，该元素已被弃用，推荐使用`animate`元素直接定位可以接受颜色值的属性。尽管它仍然存在于 [SVG 1.1 规范](https://www.w3.org/TR/SVG11/animate.html#AnimateColorElement)中，但明确指出已被弃用，并已在 SVG 2 规范中完全删除。

  


除了 SMIL 规范中定义的动画元素外，SVG 还包括与 SMIL 动画规范兼容的扩展。这些扩展包括扩展元素功能的属性和其他动画元素。SVG 扩展包括：

  


-   **`<animateTransform>`** ： 它允许你对 SVG 元素应用不同类型的变换，如平移、缩放、旋转和倾斜。通过使用 `<animateTransform>`，你可以为这些变换属性创建平滑的动画效果。
-   **`path`**（属性）： 允许在 `<animateMotion>` 元素的 `path` 属性中指定 SVG 路径数据语法的任何特征（SMIL Animation 仅允许在 `path` 属性中使用 SVG 路径数据语法的子集）。
-   **`<mpath>`** ：SVG 动画中的一个元素，用于指定一个路径元素，使得其他动画元素（比如 `<animateMotion>`）沿着这个路径进行运动。它通常作为 `<animateMotion>` 元素的子元素出现，用于将动画运动的路径与动画元素分离，使得动画元素的运动更加灵活。
-   **`keypoints`**（属性）：作为`<animateMotion>` 的属性，用于精确控制运动路径动画的速度。
-   **`rotate`**（属性）：作为 `<animateMotion>` 的属性，用于控制对象是否会自动旋转，以使其 `x` 轴指向运动路径的方向切线矢量相同（或相反方向）。该属性是使沿路径运动正常工作的关键。

  


SVG 动画在性质上类似于 CSS 动画和过渡。关键帧被创建，物体移动，颜色改变等。然而，它们可以做一些 CSS 动画无法做到的事情，我们将在后文中详细介绍。

  


## 给 SVG 静态元素添加动画

  


首先，我们来看看如何将动画添加到简单的 SVG 形状中。

  


通常情况之下，使用 SVG 元素绘制的形状是静态的，例如，使用 `<rect>` 绘制一个 `40 x 40` 的矩形：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect x="50" y="50" width="40" height="40" stroke="lime" fill="#3498db" stroke-width="2"/>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3745a8e9a3f4c3a88d84ba46cf6fdf9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=801&s=131350&e=jpg&b=340e37)

  


> Demo 地址：https://codepen.io/airen/full/eYXxbPe

  


正如你所看到的，矩形没有任何动画效果。

  


如果你要给绘制的矩形元素添加一个动画效果，那么你得使用适当的 SVG 动画元素将动画嵌套进去。例如，使用 `<animate>` 元素来对单一属性进行动画：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect x="50" y="50" width="40" height="40" stroke="lime" fill="#3498db" stroke-width="2">
        <!-- 动画元素嵌套在这里 -->
        <animate attributeName="width" from="40" to="300" begin="0s" dur="5s" repeatCount="indefinite" fill="freeze" />
    </rect>
</svg>
```

  


上面的代码，在嵌套的动画元素 `<animate>` 中，定义了动画的属性，例如 `attributeName`、`from`、`to`、`begin`、`dur` 等。这些属性控制着动画的行为，例如属性名称、起始值、结束值、开始时间、持续时间等。

  


通过像这样嵌套动画元素，你定义了动画的作用范围。因为在这种情况下，`<animate>` 元素直接嵌套在 `<rect>` 元素内，所以将对包含的 `<rect>` 元素的属性进行动画处理。这将使矩形的宽度在 `5s` 内从 `40` 个单位变化到 `300` 个单位，并且不断的重复播放这个动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21a70cac44ae4253a86d2dfc0da58bfc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1090&h=404&s=168684&e=gif&f=101&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/LYaqqeP

  


正如你所看到的，将 `<animate>` 元素嵌套在 `<rect>` 元素内，并且使用其简单语法在动画的持续时间产生属性（`width`）的线性变化。然而，SVG 提供了其他方法来添加非线性或非插值的动画。

  


例如，在 SVG 中，你可以使用 `calcMode` 属性创建非线性和非插值的动画。以下是一个简单的示例，演示了在颜色变化方面使用 `calcMode` 属性：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect x="50" y="50" width="300" height="50" fill="#ffffff">
        <animate attributeName="fill" calcMode="linear" from="#ffffff" to="#ff3366" begin="1s" dur="5s" fill="freeze" />
    </rect>
    <rect x="50" y="150" width="300" height="50" fill="#ffffff">
        <animate attributeName="fill" calcMode="discrete" from="#ffffff" to="#ff3366" begin="1s" dur="5s" fill="freeze" />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c49318e5b2774c2bb08218f1036959b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=552&s=205106&e=gif&f=160&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/zYbeejb

  


在上面这个示例中，我们创建了两个矩形，它们都有颜色变化的动画。第一个矩形（顶部的矩形）使用了 `calcMode="linear"` ，矩形的填充色（`fill`）在 `5s` 内从白色（`#ffffff`）缓慢变为玫红色（`#ff3366`），它会在动画期间线性变化。第二个矩形（底部的矩形）使用了 `calcMode="discrete"` ，矩形的填充色保持白色，直到过了 `5s` ，然后颜色突然从白色变成玫红色。也就是说，第二个矩形颜色变化是非插值的，即在动画结束时突然切换到目标值。

  


注意，应用在 `<animate>` 元素中的 `fill` 属性和应用在 SVG 元素，如 `<rect>` 元素的 `fill` 属性所起的作用不同。如果你想让 SVG 元素保留在动画结束时的状态，就需要在 `<animate>` 元素上显式设置 `fill="freeze"` 。稍后我们还会详细介绍该属性。

  


上面这个示例告诉我们，在没有插值值存在的情况下，将 `calcMode` 设置为 `discrete` 尤其重要。例如，当你将 `visibility` 属性从 `visible` 更改变 `hidden` 或者从 `hidden` 更改变 `visible` 。

  


你还可以使用 `calcMode` 属性的其他值，如 `paced` 和 `spline`，来实现不同类型的非线性动画。当 `calcMode` 属性值为 `paced` 时，动画将在给定的时间内均匀分布，以便在整个动画周期内保持匀速。

  


```SVG
<svg width="400" height="100" viewBox="0 0 400 100" class="element">
    <!-- 使用 calcMode="paced" 创建均匀分布的动画 -->
    <circle cx="50" cy="50" r="40" fill="lime">
        <animate attributeName="cx" values="50; 300" dur="4s" calcMode="paced" repeatCount="indefinite"/>
    </circle>
</svg>
```

  


在这个例子中，一个圆沿着 `x` 轴从起点 ` (50, 50)  `移动到终点 `(300, 50)`。由于 `calcMode` 设置为 `paced`，它将以均匀的速度移动。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46429b48b3a4429aa33132bd987bc8c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150&h=456&s=347254&e=gif&f=91&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/gOEqqqW

  


在 `spline` 模式下，你可以使用 `keyTimes` 和 `keySplines` 属性来定义动画的变化曲线。这些属性允许你更精细地控制动画的进度。

  


```SVG
<svg width="400" height="100" viewBox="0 0 400 100" class="element">
    <!-- 使用 calcMode="spline" 创建复杂路径的动画 -->
    <circle cx="50" cy="50" r="40" fill="lime">
        <animate attributeName="cx" values="50; 300" dur="4s" calcMode="spline" keyTimes="0; 1" keySplines="0.5 0 0.5 1" repeatCount="indefinite"/>
    </circle>
</svg>
```

  


在这个例子中，圆沿着 `x` 轴从起点 `(50, 50)` 移动到终点 `(300, 50)`，但使用了 `spline` 模式来定义路径。`keyTimes` 属性指定关键时刻，而 `keySplines` 属性定义了与这些关键时刻对应的贝塞尔曲线控制点。这样，你可以创建更加复杂和自定义的路径。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f6c8a1a393545caa0191f5af0c5e86f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=534&s=378312&e=gif&f=119&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/yLwZZwQ

  


下面这个示例演示了 `calcMode` 四种不同模式带来的动画效果差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f22f85ce44f14c819524c975e8d4fd72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1664&h=232&s=2522135&e=gif&f=224&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/bGZzzyL

  


除此之外，SVG 还允许你随时间动画 SVG 元素的许多属性。你可以改变形状的颜色、位置、透明度，或使形状的一部分可见或隐藏，例如，通过使用声明性动画语法。另外，你还可以随时间动画 SVG 滤镜，创建特别引人注目或微妙的动画效果。

  


下面是一个使用 SVG 滤镜创建动画效果的简单案例。在这个例子中，我们将使用 `<feGaussianBlur>` 滤镜来创建一个模糊效果，并通过 `<animate>` 元素改变模糊半径以产生动画。

  


```SVG
<svg width="400" height="150" viewBox="0 0 400 150" class="element">
    <defs>
        <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blurResult">
                <!-- 使用动画改变滤镜属性（模糊半径） -->
                <animate attributeName="stdDeviation" values="0;5;0" dur="2s" keyTimes="0;0.5;1" repeatCount="indefinite" />
            </feGaussianBlur>
        </filter>
    </defs>

    <!-- 创建矩形元素并应用滤镜 -->
    <rect x="10" y="10" width="380" height="130" fill="lime" filter="url(#blurFilter)" />
</svg>
```

  


在这个例子中，`<feGaussianBlur>` 滤镜用于创建模糊效果。通过 `<animate>` 元素，我们动态地改变 `stdDeviation` 属性，即模糊半径。`values` 属性定义了模糊半径在动画过程中的变化，`dur` 属性设置了动画的持续时间，`keyTimes` 属性指定了关键时间点，`repeatCount` 属性设置为 `indefinite` 表示动画将无限循环。你可以根据需要调整这些属性值以及滤镜效果，创建不同的动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a2c655f67e040868dfe311dd787f13a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=430&s=579601&e=gif&f=81&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/NWJoJWz

  


通过上面这几个简单的示例演示，我想你已经知道了如何给 SVG 静态元素添加动画效果。不知道是你否发现了，上面这几个示例都是将动画“封装”到应用于的元素中，即目标元素将是当前动画元素的直接父元素：

  


```SVG
<rect width="50" height="50">
    <animate />
</rect>
```

  


如果你想在 SVG 中将“动画元素”与目标元素分开，那么可以通过 `xlink:href` 来实现。即使用 `xlink:href` 将“动画元素”与目标元素绑定在一起。该属性接受对当前 SVG 文档片段中的目标元素的 `URI` 引用，因此该目标元素将随时间而修改。例如：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <defs>
        <animate xlink:href="#animated" attributeName="width" from="40" to="300" begin="0s" dur="5s" repeatCount="indefinite" fill="freeze"  />
    </defs>
    <rect id="animated" x="50" y="50" width="40" height="40" stroke="lime" fill=" #3498db" stroke-width="2"  />
</svg>
```

  


上面这个示例，我们使用 `xlink:href="#animated"` 指定了动画（`<animate>`）的目标元素，即 ID 为 `"animated"` 的矩形。它与下面这段代码所呈现的效果是相同的：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect x="50" y="50" width="40" height="40" stroke="lime" fill=" #3498db" stroke-width="2">
        <animate attributeName="width" from="40" to="300" begin="0s" dur="5s" repeatCount="indefinite" fill="freeze"/>
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f09ecd921e0e4e78bdba7dd6c62fbae4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=482&s=118041&e=gif&f=77&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/ExMMKbr

  


现在，我们已经知道如何给 SVG 静态元素添加动画。不过，仅仅知道这些还是不够的，我们还需要知道如何在动画元素上处理动画内容。即“可动画化的 SVG 元素属性”。

  


## SVG 动画的基本属性

  


在 SVG 中，要给 SVG 静态元素添加动画效果，需要执行两个步骤：

  


-   ①：指定动画目标元素，将“动画元素”（例如 `<animate>` 、`<animateTransform>` 和 `<animateMotion>` 等 ）嵌套在目标元素中，或者通过 `xlink:href` 指定目标元素
-   ②：在“动画元素”上定义动画属性

  


在 SVG 中定义动画和在 CSS 中定义动画非常相似。要在 SVG 中定义动画，需要知道要进行动画处理的内容是什么，动画将在何时开始，要进行动画处理的属性的起始值是什么，以及在动画结束时该属性的演示值是什么。

  


接下来一起来探讨如何在动画元素上定义动画属性。

  


### 使用 attributeName 和 attributeType 指定动画的目标属性

  


就 SVG 动画而言，通常是由 `attributeName`属性的值指定，该属性用于指定你要动画化的属性的名称。例如：

  


```SVG
<svg width="400" height="20" viewBox="0 0 400 20" class="element">
    <rect width="400" height="20" fill="#356908" rx="10">
        <animate attributeName="width" from="0" to="400" dur="5s" repeatCount="indefinite" />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a32f5d7c83741cdaecbb9696ef8a8a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=378&s=52890&e=gif&f=102&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/XWGGjeg

  


在这个示例中，我们有一个绿色的矩形（`#356908`），通过 `<animate>` 元素对其 `width` 属性进行动画。在 `<animate>` 元素中，`attributeName` 被设置为 `"width"` ，这意味着我们希望动画矩形（`<rect>` ）的宽度（`width`）属性。

  


`attributeName` 属性只接受一个值，而不是值列表，因此一次只能对一个属性进动画化。如果要动画化多个属性，则需要为该元素定义多个动画。例如，基于上面这个示例，如果你希望同时对矩形的宽度和填充颜色两个属性进行动画化，则需要同时在 `<rect>` 中同时嵌套两个 `<animate>` 元素，并且将 `attributeName` 属性分别指定为 `width` 和 `fill` ：

  


```SVG
<svg width="400" height="20" viewBox="0 0 400 20" class="element">
    <rect width="400" height="20" fill="#356908" rx="10">
        <!-- 对 rect 元素的 width 属性进行动画化 -->
        <animate attributeName="width" from="0" to="400" dur="5s" repeatCount="indefinite" />
        <!-- 对 rect 元素的 fill 属性进行动画化 -->
        <animate attributeName="fill" from="#356908" to="#ff3366" dur="5s" repeatCount="indefinite" />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f44616508544218b21b12f1a7be85a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=384&s=106088&e=gif&f=102&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/LYaaRmB

  


就这一点而言，CSS 要比 SMIL 更具优势。但从另一个角度来说，一次只定义一个属性名称是有道理的，否则其他属性的值可能会变得过于复杂，难以处理。

  


正如你所看到的，在 SVG 中，在“动画元素”指定 `attributeName` 属性的值，我们可以指定要应用动画的确切属性，从而实现不同种类的动画效果。

  


在指定动画化属性名称的同时，还可以通过 `attributeType` 属性用于指定动画要操作的属性的命名空间。在 SVG 动画中，有两个主要的命名空间：`CSS` 和 `XML` ：

  


```SVG
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="50" width="300" height="50" fill="lime">
        <!-- 通过 attributeType 属性，指定动画要操作的属性的命名空间是 XML -->
        <animate attributeType="XML" attributeName="width" from="50" to="300" dur="5s" repeatCount="indefinite"  />
    </rect>
    
    <rect x="50" y="100" width="300" height="50" fill="lime">
        <!-- 通过 attributeType 属性，指定动画要操作的属性的命名空间是 CSS -->
        <animate attributetype="CSS" attributename="opacity" from=".3" to="1" dur="5s"  repeatcount="indefinite" />
    </rect>    
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6fb8e26f2d14ecd8d5af3ca9515c99b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=460&s=191057&e=gif&f=87&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/PoLLGVo

  


通常情况下，如果要操作的属性是 CSS 属性，可以将 `attributeType` 设置为 `"CSS"` （这意味着该属性也可以作为 CSS 属性找到）。而其他属性仅属于 `"XML"`。

  


如果 `attributeType` 属性的值没有被明确设置或设置为 `auto`，则浏览器必须首先在 CSS 属性列表中搜索匹配的属性名称，如果找不到，则在元素的默认 XML 命名空间中搜索。这意味着，在实际应用中，通常不需要显式设置 `attributeType`，因为浏览器会根据属性的类型自动选择正确的命名空间。

  


### 定义动画的关键特征

  


当使用 SVG 动画元素时， `from`、`to`、`dur` 、`begin` 和 `fill` 等属性用于定义动画的关键特征。让我们通过一个实际案例详细解释它们的作用和如何使用：

  


```SVG
<svg width="400" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="element">
    <circle cx="50" cy="60" r="50" fill="lime">
        <animate attributeName="cx" from="50" to="350" dur="2s" begin="click" fill="freeze" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0bebd5c343242049632465f04fef0cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=318&s=743420&e=gif&f=188&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/LYaabVq

  


上面这个示例，使用 `<animate>` 更改 `<circle>` 的 `cx` 属性的值（圆心位置），把圆从 `50` （起始位置）移动到 `350` （终点位置），整个过程持续 `2s` 钟，并在动画结束后保持在最终状态。为了在一段时间内将一个值更改变另一个值，我们使用了 `from` 、`to` 和 `dur` 属性。

  


-   `from` 属性： `from="50"` 指定动画属性的起始值为 `50`
-   `to` 属性： `to="350"` 指定动画属性的结束值为 `350`
-   `dur` 属性： `dur="2s"` 指定动画的持续时间为 `2s`

  


其中 `from` 和 `to` 属性类似于 CSS `@keyframes` 中的 `from` 和 `to` 关键帧：

  


```CSS
@keyframes moveCircle {
    from {
        /* 起始值 */
    }
    to {
        /* 结束值 */
    }
}
```

  


`dur` 属性类似于 CSS 中的 `animation-duration` :

  


```CSS
.animated {
    animation-duration: 2s;
}
```

  


除了这些属性，你还会想要指定动画应该在什么时候开始，这就是 `begin` 属性的作用。在上面的示例中，我们设置了 `begin` 属性的值为 `"click"` 。这意味着圆将在点击时移动。你也可以将此值设置为时间值，例如 `begin="0s"` ，表示应用于圆的动画将在页面加载后立即启动。你还可以将 `begin` 设置正的时间值来延迟动画。例如，`begin="2s"` 将在页面加载后的 `2s` 后启动动画。

  


另外，你也可以将 `begin` 属性的值设置为 `click + 1s` 这样的值，它会在元素（`<circle>`）被点击后的 `1s` 后启动动画：

  


```SVG
<svg width="400" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" class="element">
    <circle cx="50" cy="60" r="50" fill="lime">
        <animate begin="click + 1s" attributeName="cx" from="50" to="350" dur="2s"  fill="freeze" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ca9ef151a444277aaba3f3d41f173b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=342&s=697174&e=gif&f=245&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/JjzzEZb

  


更有趣的是，你还可以将 `begin` 设置为其他值，允许你在不必计算其他动画的持续时间和延迟的情况下同步动画。稍后会详细介绍这一特性。

  


你也可能已发现了，动画结束之后，圆的停留位置保持在最终状态。这是“动画元素”的 `fill` 属性所起的作用，它有点类似于 CSS 的 `animation-fill-mode` 属性，该属性指定动画结束后元素应该如何填充。SVG 中的值与 CSS 中的值相似，只是名称不同：

  


-   `freeze` （默认值）：动画结束后，元素将保持在动画的最终状态。换句话说，它会被冻结在最后一帧的状态上，不再改变
-   `remove` ：动画结束后，元素将被移除，不再应用动画效果。这意味着元素会返回到其初始状态

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/244385ed448e42c7b7c65dde0e014afe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1470&h=484&s=617578&e=gif&f=178&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/yLwwgwL

  


### 使用 by 指定动画的相对偏移量

  


在 SVG 动画元素中， `by` 属性主要用于指定相对偏移，即动画属性相对于其初始值的偏移量。通过使用 `by` ，你可以定义相对于 `from` 或当前值的增量，而无需显式指定目标值 `to` 。例如：

  


```SVG
<svg width="400" height="150" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg" class="element">
    <circle cx="50" cy="75" r="50" fill="orange">
        <!-- 将 cx 属性从当前值增加 300 -->
        <animate attributeName="cx" from="50" by="300" dur="2s" fill="freeze" begin="click" />
    </circle>
</svg>
```

  


上面示例中，`cx` 属性的初始值是 `50` 个单位值，通过使用 `by="300"` ，动画将 `cx` 属性从当前值（`50`）开始增加 `300` ，因此最终位置是 `350` 。它与 `to="350"` 最终效果是等同的：

  


```SVG
<svg width="400" height="150" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg" class="element">
    <circle cx="50" cy="75" r="50" fill="orange">
        <animate attributeName="cx" from="50" to="350" dur="2s" fill="freeze" begin="click" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dda43922cb234ef8a47dc270322bd752~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=458&s=665701&e=gif&f=155&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/mdooRYK

  


`by` 属性在 SVG 动画中的应用非常有用，特别是在相对性动画和累积动画中。在相对性动画中，你可以指定相对于当前值的增量，而无需知道元素的确切初始值。在积累动画中，多个动画可以基于之前动画的结果进行操作，通过 `by` 属性可以更方便地实现这一点。

  


### 使用 restart 重新启动动画

  


SVG 动画中，你可以使用 `restart` 属性来控制动画元素在其活动期间是否可以被重新启动，即使在其活动期间也可以。这对于 SVG 动画处于活动状态时阻止重新启动可能是有用的。你可以将 `restart` 属性设置为三种可能的值：

  


-   `always` （始终重新启动） ：这是默认值，动画可以在任何时候重新启动，即使在其活动期间也可以
-   `whenNotActive` （非活动时重新启动） ：动画只能在其非活动状态下重新启动，即在活动结束后。如果尝试在活动期间重新启动动画，该尝试将被忽略
-   `never` （永不重新启动）：元素在其父时间容器的当前简单持续时间内不能重新启动。（在 SVG 的情况下，由于父时间容器是 SVG 文档片段，因此动画在文档持续时间内不能重新启动。）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99ad650d54554f0f87dfd0c6197f7dfc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250&h=714&s=2069366&e=gif&f=352&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/BabbRB

  


### 使用 begin 来命名动画并同步它们

  


课程前面曾提到过，我们可以将 `begin` 设置为其他值，允许你在不必计算其他动画的持续时间和延迟的情况下同步动画。

  


简单地说，在 SVG 动画中，我们可以使用 `begin` 属性来命名动画并同步它们。通过给动画元素设置 `id` 属性，可以为动画命名，然后在其他动的的 `begin` 属性中引用这个 `id` ，以实现动画的同步。比如下面这个示例，向大家展示了如何使用 `begin` 属性同步两个命名的动画：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="element">
    <!-- 圆形动画 -->
    <circle r="30" cx="50" cy="50" fill="orange">
        <animate begin="click" id="circ-anim" attributeName="cx" from="50" to="450" dur="5s"  fill="freeze"  />
    </circle>

    <!-- 矩形动画，开始时间与圆形动画同步 -->
    <rect width="50" height="50" x="25" y="200" fill="#0099cc">
        <animate begin="circ-anim.begin + 1s" id="rect-anim" attributeName="x" from="50" to="425" dur="5s"  fill="freeze"  />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98fe0732f262462684c8fd90ad701f08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=454&s=340688&e=gif&f=104&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/oNVVWbV

  


上面这个示例中，圆形（`<circle>`）和矩形（`<rect>`）动画（嵌套在它们里面的 `<animate>`）都有一个唯一的 `id` ，分别是 `circ-anim` 和 `rect-anim` 。嵌套在矩形（`<rect>`）的 `<animate>` 元素的 `begin` 属性设置为 `"circ-anim.begin + 1s"` ，表示它的开始时间与圆形动画的开始时间同步，但是在圆形动画的开始时间基础上延迟 `1s` 。这样，可以实现两个动画的同步效果。

  


此外，如果需要，还可以使用 `end` 事件来指定一个动画在另一个动画结束时开始。例如：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="element">
    <!-- 圆形动画 -->
    <circle r="30" cx="50" cy="50" fill="orange">
        <animate begin="click" id="circ-anim" attributeName="cx" from="50" to="350" dur="5s"  fill="freeze"  />
    </circle>

    <!-- 矩形动画在圆形动画结束时开始 -->
    <rect width="50" height="50" x="25" y="200" fill="#0099cc">
        <animate begin="circ-anim.end + 0s" id="rect-anim" attributeName="x" from="50" to="350" dur="5s"  fill="freeze"  />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9384216a5e343098a2fef0cef4c580b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=468&s=463254&e=gif&f=254&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/BabbVWz

  


这允许你在 SVG 动画中非常灵活地控制动画元素之间的时间关系。例如，创建链式动画。

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect x="10" y="10" width="30" height="30" fill="pink">
        <animate begin="2s" dur="10s" attributeName="width" from="10" to="380" />
    </rect>
</svg>
```

  


上面的代码，我们创建了一个矩形，然后应用了一个动画，使其在 `2s` 后开始（`begin=2s`），持续了 `10s` ，动画属性是宽度从 `10` 到 `380` 的变化。在这个动画中，矩形的宽度将从初始值 `10` 逐渐增加到目标值 `380` 。

  


这是一个最基础的 SVG 动画，但要理解链式动画，我们还需要额外做一些工作，比如为 `<rect>` 、`<animate>` 和新的 `<rect>` 元素添加 `id` 属性：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect id="PinkRect" x="10" y="10" width="30" height="30" fill="pink" id="PinkRect">
        <animate id="PinkAnim" begin="2s" dur="10s" attributeName="width" from="10" to="380" />
    </rect>
    <rect id="limeRect" x="10" y="45" width="30" height="30" fill="lime">
        <animate begin="PinkAnim.begin + 2s" id="limeAnim" dur="10s" attributeName="width" from="10" to="380" />
    </rect>
</svg>
```

  


上面示例，动画的执行顺序如下：

  


SVG 文档加载完成后的两秒钟，粉色矩形（`PinkRect`）由于以下代码而产生动画效果：

  


```SVG
<animate id="PinkAnim" begin="2s" dur="10s" attributeName="width" from="10" to="380" />
```

  


请注意，动画（`<animate>` 元素）的 `id` 是是`PinkAnim`。在下一行中，另一个动画（`LimeAnim`）与该动画的开始相链接：

  


```SVG
<animate begin="PinkAnim.begin + 2s" id="LimeAnim" dur="10s" attributeName="width" from="10" to="380" />
```

  


上面代码中的 `begin="PinkAnim.begin + 2s"` 表示 `LimeAnim` 动画将会在 `PinkAnim` 动画开始后的 `2s` 运行。具体效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dfb474573214a68b4279d6b17a08b74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=472&s=445408&e=gif&f=307&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/wvOOXpg

  


类似地，你可以通过使用以下代码添加另一个相对于`PinkAnim` 动画结束时开始的动画：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect id="PinkRect" x="10" y="10" width="30" height="30" fill="pink" id="PinkRect">
        <animate id="PinkAnim" begin="2s" dur="10s" attributeName="width" from="10" to="380" />
    </rect>
     
    <rect id="LimeRect" x="10" y="45" width="30" height="30" fill="lime">
        <animate begin="PinkAnim.begin + 2s" id="LimeAnim" dur="10s" attributeName="width" from="10" to="380" />
    </rect>

    <rect id="YellowRect" x="10" y="80" width="30" height="30" fill="yellow">
        <animate begin="PinkAnim.end + 2s" id="YellowAnim" dur="10s" attributeName="width" from="10" to="380" />
    </rect>
</svg>
```

  


如果运行上述代码，你将看到粉色矩形（`PinkRect`）在文档加载完成后的两秒钟内开始动画。再过两秒钟，绿色矩形（`LimeRect`）开始动画；粉色矩形的动画完成，再过两秒钟，黄色矩形的动画开始。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f276b2beaf674c679744386f0dbb1255~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=520&s=405790&e=gif&f=368&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/KKEEeOe

  


如果要让这三个矩形动画按顺序链接执行，那么你可以将第一个动画的结束作为第二个动画的开始，将第二个动画的结束作为第三个动画的开始：

  


```SVG
<svg width="400" height="300" viewBox="0 0 400 300" class="element">
    <rect id="PinkRect" x="10" y="10" width="30" height="30" fill="pink" id="PinkRect">
        <animate id="PinkAnim" begin="2s" dur="10s" attributeName="width" from="10" to="380" />
    </rect>
    
    <rect id="LimeRect" x="10" y="45" width="30" height="30" fill="lime">
        <animate begin="PinkAnim.end" id="LimeAnim" dur="10s" attributeName="width" from="10" to="380" />
    </rect>

    <rect id="YellowRect" x="10" y="80" width="30" height="30" fill="yellow">
        <animate begin="LimeAnim.end" id="YellowAnim" dur="10s" attributeName="width" from="10" to="380" />
    </rect>
</svg>
```

  


这段代码中，第一个动画（粉色矩形）开始于文档加载完成后的 `2s` ，第二个动画（绿色矩形）开始于第一个动画的结束，第三个动画（黄色矩形）开始于第二个动画的结束。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87b60f4ade124afc94890cbe7da5dbc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=434&s=341080&e=gif&f=264&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/GReeBZm

  


以此类推，你可以轻易制作出交错动画。

  


### 使用 end 来指定动画的结束时间

  


除了指定动画何时开始，你还可以使用 `end` 属性指定动画何时结束。例如，你可以将动画设置为无限重复，然后在另一个元素开始动画时停止它。`end` 属性接受与 `begin` 值类似的值。你可以指定绝对或相对的时间值、偏移量、重复值、事件值等。

  


例如，在以下演示中，粉色矩形（`PinkRect`）的宽度 `width` 在 `5s`内缓慢由 `50` 变成 `380` 。绿色矩形（`LimeRect`）也会动画，但只有在点击时才会触发。粉色矩形的动画将在绿色矩形的动画开始时结束。点击绿色矩形查看粉色停止：

  


```SVG
<svg width="400" height="110" viewBox="0 0 400 110" class="element">
    <!-- 点击绿色矩形时，粉色矩形动画将结束 -->
    <rect id="PinkRect" x="10" y="20" width="30" height="30" fill="pink" id="PinkRect">
        <animate id="PinkAnim" begin="0s" dur="5s" end="LimeAnim.begin" fill="freeze" attributeName="width" from="10" to="380" />
    </rect>
    
    <rect id="LimeRect" x="10" y="60" width="30" height="30" fill="lime">
        <animate begin="click" id="LimeAnim" dur="5s" attributeName="width" from="10" to="380" fill="freeze" />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66626b2135ed49cc8343f41b94698485~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=398&s=166225&e=gif&f=142&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/VwRRBMP

  


当然，同样的动画同步效果也可以应用于同一元素的两个动画。例如，假设我们将矩形的颜色设置为无限制地从一种值（`lime`）变化到另一种值（`pink`）。然后，当单击元素时，它的宽度会从 `30` 缓慢变宽到 `380`。我们现在将其设置为，一旦单击元素并触发动宽度变化动画（`WidthAnim`），颜色动画（`ColorAnim`）就会停止。

  


```SVG
<svg width="400" height="70" viewBox="0 0 400 70" class="element">
    <rect id="PinkRect" x="10" y="20" width="30" height="30" fill="lime" id="PinkRect">
        <animate id="ColorAnim" attributeName="fill" begin="0s" dur="5s" from="lime" to="deepPink" repeatCount="indefinite" end="WidthAnim.begin" fill="freeze"  from="10" to="380" />
        <animate id="WidthAnim" attributeName="width" begin="click" dur="5s" fill="freeze"  from="30" to="380" />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/761be67ef88842329a01fac9968b4a07~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=398&s=148718&e=gif&f=162&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/qBvvyxN

  


### 使用多个 begin 和 end 值决定动画开始或结束的多个时间点

  


到目前为止，你只看到了在“动画元素”（例如 `<animate>`）的 `begin` 或 `end` 属性中使用一个值。然而，在 SVG 中，`begin` 和 `end` 属性都接受一个以分号分隔的值列表。`begin` 属性中的每个值将对应于 `end` 属性中的一个值，从而形成活动和非常活动的动画间隔。这好比行驶的小汽车，汽车的轮胎在一段时间内容是活动的，然后是非活动的，这取决于小汽车是否在行驶中。

  


例如：

  


```SVG
<svg width="400" height="70" viewBox="0 0 400 70" class="element">
    <rect id="PinkRect" x="10" y="20" width="30" height="30" fill="pink" id="PinkRect">
         <animate begin="2s; click" end="widthAnim.end; mouseover" 
         id="widthAnim" attributeName="width" from="30" to="380" dur="5s"  fill="freeze" />
    </rect>
</svg>
```

  


让我们详细解释这个例子：

  


-   `begin="2s; click"`：这表示动画将在页面加载后 `2` 秒开始，然后可以通过点击事件触发。这样，动画就有了两个入口点，分别是时间触发和用户点击。
-   `end="widthAnim.end; mouseover"`：这表示动画将在 `widthAnim` 结束后或鼠标悬停（`mouseover`）事件来结束动画。这样，动画会在点击后开始，然后在鼠标悬停时停止。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b13be1d9469443daab06199ee508b1d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=412&s=429222&e=gif&f=434&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/gOEEjQz

  


这种方式允许动画有多个入口和出口点，提供了更灵活的控制方式。这在创建复杂的动画序列时特别有用。

  


```SVG
<svg width="430" height="310" viewBox="0 0 430 310" class="element">
    <rect id="rect1" x="10" y="10" width="50" height="50" fill="lime">
        <animate id="anim1" begin="0s; anim35.end" dur="0.2s" attributeName="opacity" from="0" to="1" fill="freeze"  />
    </rect>
  
    <rect id="rect2" x="70" y="10" width="50" height="50" fill="lime" >
        <animate id="anim2" begin="anim1.end" dur="0.2s" attributeName="opacity" from="0" to="1" fill="freeze"  />
    </rect>
  
    <!-- 省略其他 rect 元素 -->
  
    <rect id="rect35" x="370" y="250" width="50" height="50" fill="lime" >
        <animate id="anim35" begin="anim34.end" dur="0.2s" attributeName="opacity" from="0" to="1" fill="freeze"  />
    </rect>
</svg>
```

  


在上面的示例中，我们为每个 `<animate>` 元素都定义了一个 `id` 名称，并且第二个动画的 `begin` 属性的值是前一个 `<animate>` 的结束时间，例如 `anim1.end` 。需要注意的是，第一个 `<animate>` 元素的 `begin` 属性的值为 `0s; anim35.end` 。它包含了一个值列表。第一个值表示矩形在文档加载完后就开始动画。第二个值表示它在最后一个矩形完成动画后开始动画。因此，通过将第一个动画链接到最后一个动画的结束，你就创建了一个循环动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0402d08e56924deea737596b2e91568d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=582&s=700529&e=gif&f=248&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/yLwwxNy

  


正如你所看到的，在任何单独动画的末尾，你都可以启动其他动画。此外，你还可以循环回第一个动画的开始，创建循环动画。当动画像矩形那样简单时，这个过程并不引人注目；然而，如果你将创造力应用于创建更复杂的动画，例如涉及颜色变化或动画渐变，你就可以开始窥视到可用于你的潜在创造力。

  


你可以为这个过程添加另一个维度。如果动画的开始是由用户事件触发的会怎么样？如果通过鼠标悬停在 SVG 图像的某个部分或点击特定部分，你可以创建一系列链式动画，其中一些可能也循环？你能看到这里的巨大潜力吗？如果你的大脑在可视化、规划和编码所有这些材料的实际困难上感到困扰，不要担心——只需让自己看一看这个潜在的力量。

  


下面是一个带有简单交互效果的链式动画，你需要将鼠标悬浮在玫红（最顶部的）矩形或黄色（最底部的）矩形上，或者点击粉色矩形（中间的）来触发动画。

  


```SVG
<svg width="300" height="150" viewBox="0 0 300 150" class="element">
    <g>
        <rect id="MaroonRect" x="10" y="15" width="32" height="32" fill="#ff3366">
            <animate id="MaroonAnim" begin="PinkAnim.end; mouseover" dur="5s" attributeName="width" from="32" to="250" />
        </rect>
        <rect id="PinkRect" x="10" y="62" width="32" height="32" fill="pink">
            <animate id="PinkAnim" begin="YellowAnim.end; click" dur="5s" attributeName="width" from="32" to="250" />
        </rect>
        <rect id="YellowRect" x="10" y="107" width="32" height="32" fill="#ffff00">
            <animate id="YellowAnim" begin="MaroonAnim.end; mouseover" dur="5s" attributeName="width" from="32" to="250" />
        </rect>
    </g>
    <g>
        <text x="50" y="38" fill="red" stroke="red">
            <animate begin="MaroonAnim.begin" dur="0.1s" attributeName="visibility" from="visible" to="hidden" fill="freeze" calcMode="discrete" />
            <animate begin="MaroonAnim.end" dur="0.1s" attributeName="visibility" from="hidden" to="visible" fill="freeze" calcMode="discrete" />
            👈Mouse here
        </text>
        <text x="50" y="86" fill="red" stroke="red">
            <animate begin="PinkAnim.begin" dur="0.1s" attributeName="visibility" from="visible" to="hidden" fill="freeze" calcMode="discrete" />
            <animate begin="PinkAnim.end" dur="0.1s" attributeName="visibility" from="hidden" to="visible" fill="freeze" calcMode="discrete" />
            👈Click here
        </text>
        <text x="50" y="130" fill="red" stroke="red">
            <animate begin="YellowAnim.begin" dur="0.1s" attributeName="visibility" from="visible" to="hidden" fill="freeze" calcMode="discrete" />
            <animate begin="YellowAnim.end" dur="0.1s" attributeName="visibility" from="hidden" to="visible" fill="freeze" calcMode="discrete" />
            👈Mouse here
        </text>
    </g>
</svg>
```

  


这些动画通过鼠标事件和点击事件相互关联，创造出一个动态的视觉体验。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcc7290152134bf7b4c7b017dedaa8f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=510&s=457279&e=gif&f=324&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/KKEEGgq

  


### 使用 repeatCount 来指定动画重复播放的次数

  


`repeatCount` 属性主要用于指定动画重复播放的次数，它与 CSS 的 `animation-iteration-count` 属性非常相似。你可以设置为一个具体的次数，或者使用关键字 `indefinite` 表示动画将无限重复。以下是一个示例，演示了如何使用 `repeatCount` 属性：

  


```SVG
<svg width="300" height="300" viewBox="0 0 300 300" class="element">
    <circle cx="150" cy="150" r="50" stroke="lime" stroke-width="3" fill="orange">
        <animate attributeName="r" from="50" to="10" dur="2s" repeatCount="3" fill="freeze" />
    </circle>
</svg>
```

  


在这个例子中，圆的半径从 `50` 逐渐减小到 `10`，动画的持续时间为 `2s`，而 `repeatCount` 属性被设置为 `3`，表示动画将重复播放 `3` 次。一旦动画完成 `3` 次，它将保持在最后一帧的状态。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e66663692f245c7bdb9e1ed642b54c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=464&s=411345&e=gif&f=171&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/QWooJmJ

  


你还可以将 `repeatCount` 设置为 `indefinite`，使动画的播放无限重复：

  


```SVG
<svg width="300" height="300" viewBox="0 0 300 300" class="element">
    <circle cx="150" cy="150" r="50" stroke="lime" stroke-width="3" fill="orange">
        <animate repeatCount="indefinite" attributeName="r" from="50" to="10" dur="2s" fill="freeze" begin="click" />
    </circle>
</svg> 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a03b540879fe4a3dbbc47a7c600b6dfa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=476&s=406957&e=gif&f=113&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/LYaaXBb

  


这意味着动画将持续无限次数，直到停止或文档卸载。

  


不难发现，动画重新开始时是从初始的 `from` 值而不是动画的结束时的值 `to` 。令人遗憾的是，SMIL 中并没有提供类似于 CSS 动画中的 `animation-direction` 属性的机制。在 CSS 中，我们可以将 `animation-direction` 属性的值设置为 `alternate` ，使奇数次的动画周期迭代以正常方向播放，而偶数次的动画周期迭代以相反方向播放。这意味着，第一个周期将从开始（`from`）到结束（`to`）播放，然后第二个周期将从结束（`to`）到开始（`from`）播放，然后第三个周期从开始到结束播放，依此类推。

  


在 CSS 动画中可以很轻易实现的一个效果，但在 SMIL 中却不得不依赖于 JavaScript 脚本动态更改“动画元素”的 `from` 和 `to` 属性的值。不过，在某些场景中，我们可以将结束值指定为中间值，然后将结束值和初始值设置为相同的值。这和 在 CSS 的 `@keyframes` 的 `50%` 处设置结束值，然后在 `from` 和 `to` 设置相同值是类似的。以 `pluse` 动画为例：

  


```CSS
@keyframes pluse {
    from,to {
        scale: 1;
    }
    50% {
        scale: 1.3;
    } 
}
```

  


要在 SMIL 中实现相似的效果，不得不使用 `values` 属性，稍后我们会详细介绍。

  


### 使用 `repeatDur` 限制动画的重复时间

  


“限制动画的重复时间” 是一个新的概念，在 CSS 动画以及 WAAPI 中并没有这样的概念。在 SVG 动画中，通过 `repeatDur` 属性可以限制动画的重复时间，这样可以更好的地控制动画的表现。

  


试想一下，如果将一个动画设置为无限次重复播放，很可能会惹人烦，甚至对用户也不够友好，尤其是那种持续时间很长的动画。因此，将重复时间限制在一定的时间段内，并在相对于文档开头的某个时间后停止重复，这对于动画自身以及用户来说，都可能会更好一些。这也就是大家所说的“演示时间”。

  


> SVG 动画中的“演示时间”是指相对于文档开始的时间，表示文档片段在时间轴上的位置。演示时间可以用来控制动画的时序和重复行为。你可以通过 `begin` 、`end` 、`dur` 、`repeatCount` 和 `repeatDur` 等属性来控制演示时间。演示时间的理解对于精确控制 SVG 动画的行为非常重要。

  


在 SVG 动画中，我们可以使用 `repeatDur` 属性来限制动画的总重复时间，使其在指定的时间段内反复播放。它的语法类似于时钟值，但与另一个动画事件或交互事件相对无关，而是相对于文档的开头。

  


例如下面这个示例：

  


```SVG
<svg width="300" height="300" viewBox="0 0 300 300" class="element">
    <circle cx="150" cy="150" r="50" fill="orange">
        <animate attributeName="r" values="50;10;50" dur="3s" repeatCount="indefinite" repeatDur="2s" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6f205c1bb004a43847488446f0a9b71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=464&s=126669&e=gif&f=82&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/ExMJVpj

  


在这个例子中，我们有一个圆形，它的半径（`r`）在动画期间发生变化。动画使用 `<animate>` 元素，其中 `repeatCount` 属性被设置为 `"indefinite"`，表示动画将无限次重复。而 `repeatDur` 属性被设置为 `"2s"`，表示动画将在文档开始后的 `2s` 内重复，即在第 `2s` 时，动画将重新开始，继续执行。

  


我们也可以将上面示例中的 `repeatDur` 设置为 `"01:30"` ，表示动画将在文档开始后的 `1` 分 `30` 秒内重复。

  


```SVG
<svg width="300" height="300" viewBox="0 0 300 300" class="element">
    <circle cx="150" cy="150" r="50" fill="orange">
        <animate repeatDur="01:30" attributeName="r" values="50;10;50" dur="3s" repeatCount="indefinite"  />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b49c3ebc7d274e48951458b53c9bbfe5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=410&s=307976&e=gif&f=113&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/eYXopPO

  


这在需要在特定时长内重复运行的场景中很有用，例如制作循环播放的动画或展示。

  


### 基于重复次数来同步动画

  


前面我们一起探讨了如何通过 `begin` 和 `end` 属性来同步动画。事实上，在 SMIL 中，除了使用 `begin` 和 `end` 属性之外，还可以使用 `repeat()` 重复次数来同步动画（SVG动画中的同步动画基于重复次数是指一个动画可以根据另一个动画的重复次数来启动）。例如，你可以在另一个动画的第 `n` 次重复后的某个时间开始一个动画，可以增加或减少一定的时间。

  


```SVG
<svg width="400" height="240" viewBox="0 0 400 240" class="element">
    <circle cx="60" cy="60" r="30" fill="lime">
        <animate id="circleAnim" attributeName="cx" begin="click" dur="5s" repeatCount="3" from="60" to="300" fill="freeze"/>
    </circle>
    
    <!-- 圆形动画的第三次重复后，矩形的动画在 2.5s 后开始 -->
    <rect x="230" y="140" width="60" height="60" fill="#ff3366">
        <animate id="rectAnim" begin="circleAnim.repeat(2)+2.5s" attributeName="x"   dur="5s" from="230" to="30" fill="freeze"/>
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6ef6aa0077a4eb39dc10bdf26dccb58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=484&s=1091217&e=gif&f=328&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/NWJmGeO

  


上面的示例中，我们将 `rectAnim` 动画的 `begin` 设置为 `"circleAnim.repeat(2)+2.5s"` ，它表示的意思是，`circleAnim` 动画第三次重复播放的 `2.5s` 后，`rectAnim` 动画才开始播放。这就是基于动画重复播放次数来同步动画的效果。

  


这种方法使得两个动画能够同步，确保第一个动画的重复次数和第二个动画的启动时间是相关联的。这对于创造更加复杂和有机的动画序列非常有帮助。

  


### 使用 keyTimes 和 values 属性来控制动画关键帧值

  


在 CSS 和 WAAPI 动画中，我们都可以指定动画属性在动画过程中的某一帧中应该采用的值。例如，你正在对元素进行偏移动画处理，你可以在动画过程中指定它采用特定的值，而不是直接从开始值（例如 `0`）到结束值（例如 `300px`）：

  


```CSS
/* CSS 定义关键帧值的方式 */
@keyframes move {
    0% {
        translate: 0px;
    }
    50% {
        translate: 360px;
    } 
    80% {
        translate: 260px;
    }
    100% {
        translate: 300px;
    }
}
```

  


其中 `@keyframes` 中的 `0%` 、`20%` 、`80%` 和 `100%` 是动画的关键帧，每个关键帧中的值是每个帧的值

  


```JavaScript
const move = [
    {
        translate: '0px',
        offset: 0
    },
    {
        translate: '360px',
        offset: .5
    },
    {
        translate: '260px',
        offset: .8
    },
    {
        translate: '300px',
        offset: 1
    }
]
```

  


在 WAAPI 中指定每个关键帧的值与 CSS 的 `@keyframes` 非常相似，不同的是，使用 `offset` 指定关键帧位置。

  


在 SMIL 中， 我们可以以类似的方式控制每帧的值，但语法有些不同。你需要使用 `keyTimes` 属性来指定关键帧位置，然后使用 `values` 属性为每帧指定动画属性的值。例如：

  


```SVG
<svg width="400" height="240" viewBox="0 0 400 240" class="element">
    <circle cx="60" cy="60" r="30" fill="lime">
        <animate values="0; 360; 260; 300" keytimes="0; 0.5; 0.8; 1" attributename="cx" from="0" to="300" dur="2s" begin="click"  fill="freeze" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/502933b8711a40edad40ce8ce97d876a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=424&s=153377&e=gif&f=82&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/ZEPZWQJ

  


那么，我们在这里做了什么呢？

  


首先要注意的是，关键帧时间和中间值被指定为列表。`keyTimes` 属性是一个以分号分隔的时间值列表，用于控制动画的速度。列表中的每个时间对应于 `values` 属性列表中的一个值，并定义了值在动画函数中的使用时间。`keyTimes`列表中的每个时间值都指定为 `0 ~ 1` 之间的浮点值（包括 `0` 和 `1`），表示动画元素的简单持续时间内的比例偏移。因此，`keyTimes`类似于CSS中的百分比，只是你将它们指定为分数，它更类似于 WAAPI 的 `offset`。

  


需要知道的是，如果使用值列表，动画将按顺序在动画过程中应用这些值。如果指定了值列表，则会忽略任何 `from` 、`to` 和 `by` 属性值。

  


在这一点上，值得一提的是，你可以在没有 `keyTimes` 属性的情况下使用 `values` 属性，这些值会自动在时间上均匀分布。

  


### 使用 calcMode 和 keySplines 控制动画的速率

  


在 CSS 中，我们可以使用 `animation-timing-function` 或 `transition-timing-function` 属性指定动画的速率，即缓动函数。它可以是一些预定义的关键词，例如 `linear` 、`ease` 、`ease-in` 、`ease-out` 和 `ease-in-out` 等，也可以是一些函数，例如 `cubic-bezier()` 、`linear()` 和 `steps()` 等。

  


在 SVG 动画中（SMIL 中），可以使用 `calcMode` 属性来指定动画的节奏（速率）。默认的动画节奏对于所有动画元素都是线性的（`linear`），除 `<animateMotion>` 之外。除了线性值之外，你还可以将其值设置为 `discrete`，`paced`或`spline` ：

  


-   **`discrete`**：指定动画函数将从一个值跳到下一个值，没有任何插值。这类似于CSS中的 `steps()` 函数。
-   **`paced`**：类似于线性（`linear`），但会忽略由 `keyTimes` 定义的任何中间进度时间。它计算出后续值之间的距离，并相应地分配时间。如果你的值都按线性顺序排列，你将不会注意到差异。但是如果它们来回移动，或者如果它们是颜色（被视为三维矢量值），你肯定会看到中间值。
-   **`spline`** ：它根据由 `keySplines` 属性定义的时间函数，从值列表中的一个值插值到下一个值。 `spline` 的的点在`keyTimes` 属性中定义，而每个区间的控制点在 `keySplines` 属性中定义。

  


下面这个示例演示了 `calcMode` 四种不同模式带来的动画效果差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ca6b711557b4e0098fd8b6dbc44f7e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1664&h=232&s=2522135&e=gif&f=224&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/bGZzzyL

  


那么，`keySplines` 属性是做什么的呢？继续借助 CSS 中的相关特性来解释 `keySplines` 属性。

  


不知道你是否还有印象，我们在介绍 [CSS 的 @keyframes 时](https://juejin.cn/book/7288940354408022074/section/7295617447058407474)，曾经说过，在 CSS 中，你可以在每个关键帧内指定动画缓动函数（即 `animation-timing-function`），这使你能更好控制动画的每个关键帧应该如何进行。例如：

  


```CSS
@keyframes bounce {
    0% {
        translate: 0 0;
        animation-timing-function: ease-in;
    }
    15% {
        translate:0 200px;
        animation-timing-function: ease-out;
    }
    30% {
        translate: 70px;
        animation-timing-function: ease-in;
    }  
    45% {
        translate: 0 200px;
        animation-timing-function: ease-out;
    }
    60% {
        translate: 0 120px;
        animation-timing-function: ease-in;
    }
    75% {
        translate: 0 200px;
        animation-timing-function: ease-out;
    }
    90% {
        translate: 0 170px;
        animation-timing-function: ease-in;
    }
    100% {
        translate: 0 200px;
        animation-timing-function: ease-out;
    }    
}
```

  


注意，CSS 中的预定义的缓动函数的关键词都可以使用相应的三次贝塞尔函数 `cubic-bezier()` 来描述，例如 ：

  


-   `ease-in = cubic-bezier(0.42, 0, 1, 1)`
-   `ease-out = cubic-bezier(0, 0, 0.59, 1)`

  


现在，我们可以在 SVG 中像下面这样来描述与 CSS 的 `bounce` 类似的动画效果：

  


```SVG
<svg width="300" height="300" viewBox="0 0 300 300" class="element">
    <circle cx="150" cy="60" r="30" fill="lime">
        <animate 
            values="0; 200; 70; 200; 120; 200; 170; 200" 
            keytimes="0; 0.15; 0.3; 0.45; 0.6; 0.75; 0.9; 1"
            attributeName="cy" from="60" to="250" dur="3s" begin="click" fill="freeze" />
    </circle>
</svg>
```

  


动画将在点击时开始，并在达到结束值时冻结。接下来，我们添加 `keySplines` 属性为每个关键帧指定速率（缓动函数）。

  


`keySplines` 属性接受与 `keyTimes` 列表相关联的一组贝塞尔控制点，定义控制间隔节奏的三次贝塞尔函数。该属性值是以分号分隔的控制点描述列表。每个控制点描述是四个值的集合：`x1 y1 x2 y2`，描述了一个时间段的贝塞尔控制点。所有值必须在 `0 ~ 1` 的范围内，并且 `calcMode` 属性的值要设置为`spline`，否则该属性将被忽略。

  


`keySplines` 不像以值形式接受三次贝塞尔函数，而是接受用于绘制曲线的两个控制点的坐标。[这两个控制点可以从三次贝塞尔曲线的相关工具中获取](https://cubic-bezier.com/#.17,.67,.85,.06)，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d373d4942ea341adaf10ef517e0af9cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=801&s=316433&e=jpg&b=fdfdfd)

  


上图中显示了每个点的坐标，对于 `keySplines` 属性，我们将使用这些值来定义关键帧动画的缓动函数。`keySplines` 属性的使用与 `keyTimes` 属性相似，允许使用逗号和可选空格分隔这些值，或仅使用空格分隔这些值。换句话说，定义相关段的 `keyTimes` 值是贝塞尔“锚点”，而 `keySplines` 值是控制点。因此，必须有一个控制点的集合比 `keyTimes` 少一个。

  


```SVG
<svg width="300" height="300" viewBox="0 0 300 300" class="element">
    <circle cx="150" cy="60" r="30" fill="lime">
        <animate 
            calcMode="spline"
            keytimes="0; 0.15; 0.3; 0.45; 0.6; 0.75; 0.9; 1"
            values="0; 200; 70; 200; 120; 200; 170; 200"  
            keySplines="0.42 0 1 1; 0 0 0.59 1; 0.42 0 1 1; 0 0 0.59 1; 0.42 0 1 1; 0 0 0.59 1;  0.42 0 1 1"
            attributeName="cy" from="60" to="250" dur="3s" begin="click" fill="freeze"  />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e2fe8344ac34e6189b40f05f6d4285d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=392&s=468457&e=gif&f=189&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/eYXoZMr

  


如果你只想为整个动画指定一个整体缓动函数而没有任何中间值，你仍然必须使用 `keyTimes` 属性指定关键帧，但只需指定起始和结束关键帧，即 `0; 1`，而不指定中间值。

  


### 附加和累积动画：additive 和 accumulate

  


在 CSS 动画中，有一个名为[“动画合成”的特性](https://juejin.cn/book/7288940354408022074/section/7308623246604599307#heading-2)（即 `animation-composition` 属性），允许同时使用多个 CSS 动画效果来影响同一属性的值。这使得在多个动画效果同时作用于元素时，可以更加灵活地控制动画的表现方式，包括属性值的叠加、替换等。

  


在 WAAPI 中，可以使用 `composite` 来实现与 CSS 的 `animation-composite` 属性相似的效果。

  


在 SVG 动画中，`additive` 和 `accumulate` 属性具备相似的功能。当你定义一个动画，它从前一个动画结束的地方开始；或者使用前一个动画的累积和作为进行下去的值，那么 `additive` 和 `accumulate` 就显得非常有用。

  


例如，下面这个示例，你正在对圆形的 `cx` 进行动画处理，假设从 `0` (`from="0"`) 移动到 `360` （`to="360"`）。但是，当你将 `additive` 属性的值设置为 `sum` 时，它们的每个值都将相对于动画属性的原始值。

  


```SVG
<svg width="400" height="200" viewBox="0 0 400 200" class="element">
    <circle cx="50" cy="50" r="30" fill="#ff3366">
        <animate additive="sum" attributeName="cx" from="0" to="360" dur="3s" begin="click" fill="freeze" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4fa5c30c2da4695ad126e9fc1813254~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=592&s=573473&e=gif&f=182&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/RwdORjV

  


上面示例中，圆的 `cx` 初始位置都是 `50` ，并且圆会沿着 `x` 轴从 `0` （起始位置 `from="0"`）移动到 `360` （终点位置 `to="360"`）。但是，当动画元素 `<animate>` 的 `additive` 设置为 `sum` 时，`0` （`from` 的值）实际上是原始的 `50` ，而 `360` （`to` 的值）实际上是 `50 + 360` 。换句话说，这实际上与设置了 `from="50"` 和 `to="410"` 的效果是相同的：

  


```SVG
<!-- 未设置additive -->
<svg width="400" height="200" viewBox="0 0 400 200" class="element">
    <circle cx="50" cy="50" r="30" fill="lime">
        <animate attributeName="cx" from="50" to="410" dur="3s" begin="click" fill="freeze" />
    </circle>
</svg>

<!-- additive="sum" -->
<svg width="400" height="200" viewBox="0 0 400 200" class="element">
    <circle cx="50" cy="50" r="30" fill="#ff3366">
        <animate additive="sum" attributeName="cx" from="0" to="360" dur="3s" begin="click" fill="freeze" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aaf7e5fd4f254266844fa59e882a6508~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=524&s=838026&e=gif&f=175&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/LYavZBR

  


正如你所看到的，`additive` 属性用于定义动画的值是否相对于当前值（原始值）进行累加。在 SVG 动画中，有时我们希望一个动画从前一个动画结束的地方开始，而不是从初始值开始。这时就可以使用 `additive` 属性。`additive` 属性有两个可能的值：

  


-   **`replace`**: 默认值。表示动画的 `from` 和 `to` 值将替换当前（原始）值。这可能导致在动画开始之前出现奇怪的跳跃
-   **`sum`**: 表示动画的 `from` 和 `to` 值将相对于当前值进行累加。也就是说，它们的值将与当前值相加。

  


```SVG
<!-- additive="sum" -->
<svg width="400" height="100" viewBox="0 0 400 100" class="element">
    <circle cx="50" cy="50" r="30" fill="#ff3366">
        <animate additive="sum" attributeName="cx" from="0" to="360" dur="3s" begin="orangeAnim.begin; click" fill="freeze" id="redAnim" />
    </circle>
</svg>

<!-- additive="replace" -->
<svg width="400" height="100" viewBox="0 0 400 100" class="element">
    <circle cx="50" cy="50" r="30" fill="orange">
        <animate additive="replace" attributeName="cx" from="0" to="360" dur="3s" begin="redAnim.begin; click" fill="freeze" id="orangeAnim" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10fd347defac498d8b17529d8b219c13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=418&s=791244&e=gif&f=186&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/PoLgzXR

  


在这个示例中，有两个圆，一个是玫红色的，一个是橙色的。两个圆都有相同的动画，将 `cx` 属性从 `0` 移动到 `360`。但是，橙色的圆使用默认值 `additive="replace"`，而玫红色的圆使用 `additive="sum"`。不难发现，玫红色的圆的动画是 `50` 移动到 `410` ，它相对于当前值进行了累加。

  


但是，如果我们希望值相加，使第二次重复从前一个的结束值开始呢？这就是`accumulate`属性发挥作用的地方。`accumulate` 属性用于控制动画是否累积。累积意味着在动画重复进行时，每次迭代都会基于前一次迭代的最终值进行累加。这对于创建连续累积的动画效果非常有用。

  


`accumulate` 属性有两个可能的值：

  


-   **`none`**（默认值）：表示动画在重复时将从头开始，不进行累积。每次重复都从初始状态重新开始。
-   **`sum`**：表示动画在重复时将累积。每次迭代都会基于前一次迭代的最终值进行累加。

  


```SVG
<svg width="400" height="200" viewBox="0 0 400 200" class="element">
    <!-- 初始圆 -->
    <circle cx="50" cy="60" r="20" fill="blue">
        <animate attributeName="cx" from="50" to="150" dur="2s" accumulate="none" begin="click" repeatCount="2" fill="freeze" />
    </circle>

    <!-- 累积动画 -->
    <circle cx="50" cy="140" r="20" fill="red">
        <animate attributeName="cx" from="50" to="150" dur="2s" accumulate="sum" repeatCount="2" fill="freeze" begin="click" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64ebc1bd767f44b09e1dd02b5413e5e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=338&s=317929&e=gif&f=212&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/mdogrbX

  


在这个示例中，有两个圆，一个是蓝色的，一个是红色的。两个圆都有相同的动画，将 `cx` 属性从 `50` 移动到 `150`。但是，蓝色的圆使用默认值 `accumulate="none"`，而红色的圆使用 `accumulate="sum"`。你可以注意到，红色的圆的动画在每次重复时都是基于前一次最终值进行累加的，而蓝色的圆在每次重复时都从初始状态重新开始。这是通过设置 `accumulate` 属性来实现的。

  


请注意，如果目标属性值不支持加法，或者如果动画元素不重复，则`accumulate`属性将被忽略。如果仅使用`to`属性指定动画函数，它也将被忽略。

  


### 使用 min 和 max 属性限制 SVG 动画元素的活动持续时间

  


就像 `repeatDur` 属性一样，在 SVG 动画中，你可以使用 `min`和 `max` 属性来限制动画的活动持续时间。它们分别用于指定动画活动持续时间的最小值（`min`）和最大值（`max`）。它们为我们提供了控制元素活动持续时间的下限和上限的方式。这两个属性都以时钟值作为值。

  


对于 `min` 属性，它指定活动持续时间的最小值，以元素活动时间为单位测量。其默认值为 `0` ，表示没有对活动持续时间进行限制。如果设置了 `min` 属性，值必须大于或等于 `0` 。

  


对于 `max` 属性，它指定活动持续时间的最大值，以元素活动时间为单位测量。其默认值为 `indefinite` ，表示没有对活动持续时间进行限制。如果设置了 `max` 属性，值必须大于 `0` 。

  


如果同时指定了 `min` 和 `max` 属性，则 `max` 值必须大于或等于 `min` 值。否则，这两个属性都将被忽略。

  


这里多次提到“元素的活动持续时间”，你可能会感到好奇，“元素的活动持续时间”究竟指的是什么？对吧！

  


其实，在 SVG 动画中，有三个关键的时间概念，它们分别是“**元素的活动持续时间**”、“**元素的重复持续时间**”、以及“**元素的简单持续时间**”。这些时间概念描述了动画元素在时间轴上的行为。

  


-   **元素的活动持续时间**：是指动画元素实际处于活动状态的时间段。这个时间段是指动画元素正在产生可见效果，影响文档状态或执行其他动画操作的时间范围。它最大的特点是，它考虑了动画的整体执行情况，包括所有的重复周期和可能的结束。元素的 `dur` （持续时间）、`repeatCount` （重复次数）、`repeatDur` （重复持续时间）和 `end` 属性都会影响动画元素的活动持续时间。
-   **元素的重复持续时间**：是指动画元素单个重复周期的持续时间，即在动画重复期间，元素的状态从开始到结束的时间。它最大的特点是，它仅考虑单个重复周期的时间，不考虑整个动画的执行情况。另外，它主要会受到 `dur` （持续时间）和 `repeatCount` （重复次数）的影响。
-   **元素的简单持续时间**：是指动画元素在没有任何重复的情况下的单次执行的时间，即不考虑任何重复或循环的情况下，动画从开始到结束的时间。它最大的特点是，它仅描述动画的最基本的执行时间，没有考虑任何重复。它仅受 `dur` （持续时间）属性的影响。

  


总的来说，这些时间概念之间的差异主要在于它们关注的时间段和受到的影响因素。活动持续时间是整个动画执行的总时间，重复持续时间是单个重复周期的时间，而简单持续时间是没有任何重复的情况下的单次执行时间。这些概念帮助我们更好地理解和控制 SVG 动画的时间轴行为。

  


那么新问题来了，所有这些是如何在一起工作的呢？哪个会覆盖哪个？然后 `end` 属性又会覆盖并简单结束动画？


简单地说，浏览器首先根据动画元素的 `dur` 、`repeatCount` 、`repeatDur` 和 `end` 属性的值计算出元素的活动持续时间。如果动画元素使用了 `min` 和 `max` 属性，那么浏览器会将计算得到的活动持续时间与指定的 `min` 和 `max` 进行比较。要是元素活动持续时间超出了 `min` 和 `max` 的范围，浏览器将会根据下面两种情况进行调整：

  


-   如果计算的活动持续时间大于 `max` ，则元素的活动持续时间被设定为 `max` 的值
-   如果计算的活动持续时间小于 `min` ，则元素的活动持续时间被设定为 `min` 的值。如果元素的重复持续时间（或元素简单持续时间）大于 `min` ，则元素将以（`min` 受限的）活动持续时间正常播放；否则，元素将以其重复持续时间（或元素简单持续时间）正常播放，然后根据 `fill` 属性的值冻结或不显式

  


如果元素使用了 `end` 属性，它会覆盖计算得到的活动持续时间，直接结束动画。

  


综合起来，各属性的优先级如下：

  


-   `end` 属性具有最高的优先级，它可以直接结束动画。
-   `min` 和 `max` 属性会限制活动持续时间的范围，如果超出范围则进行调整。
-   计算得到的活动持续时间考虑了 `dur`、`repeatCount`、`repeatDur` 等属性，但会受到 `min` 和 `max` 的调整。

  


[在规范中有一张非常全面的表格](https://www.w3.org/TR/2001/REC-smil-animation-20010904/#ComputingActiveDur)，展示了 `dur` 、`repeatCount` 、`repeatDur` 和 `end` 属性的不同组合，然后显示了基于每种组合的活动持续时间是什么。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d521305141514c3195ebda2e3f8ba103~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3262&h=1510&s=598540&e=jpg&b=ffffff)

  


> 表格来源于：https://www.w3.org/TR/2001/REC-smil-animation-20010904/#ComputingActiveDur

  


我们来看一个简单示例：

  


```SVG
<svg width="400" height="120" viewBox="0 0 400 120" class="element">
    <circle cx="50" cy="60" r="30" fill="lime">
        <animate attributeName="cx" from="50" to="400" dur="5s" begin="click" repeatCount="indefinite" min="2s" max="4s" fill="freeze" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bba7513c4a6147c09030e83faee9dca7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=294&s=245665&e=gif&f=161&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/oNVOzRM

  


在上面的示例中，动画元素 `<circle>` 的活动持续时间被限制在 `2s` （`min="2s"`）到 `4s` （`max="4s"`）之间。这意味着，无论 `dur` （`dur="5s"`）、`repeatCount` （`repeatCount="indefinite"`）或其他可能影响活动持续时间的属性设置如何，该动画元素的活动持续时间都将在 `2s ~ 4s` 之间。

  


需要注意的是，`min` 和 `max` 属性需要与其他控制动画时长的属性（如 `dur`、`repeatCount`、`repeatDur` 和 `end`）一起使用，以获得所需的效果。浏览器会根据这些属性的值计算出初始的活动持续时间，然后将其与 `min` 和 `max` 的设置进行比较，最终确定元素的活动持续时间。

  


总体而言，这些属性一起决定了动画元素在时间轴上的行为，提供了对动画执行时间的灵活控制。

  


## SVG 动画元素

  


课程前面向大家呈现的案例大多数是使用 `<animate>` 元素来创建的。在 SVG 动画中，我将 `<animate>` 元素视为通用的 SVG 动画元素，因为它可以完成各种任务。当然，对于某些动画来说，则需要应用专门的动画元素，例如 `<animateTransform>` 、`<animateMotion>` 和 `<set>` ，甚至还可以使用已被废弃的 `<animateColor>` 元素，这些元素提供了额外的控制或便利性。

  


接下来，我们一起来探讨这些动画元素。先从最通用的 `<animate>` 元素开始。

  


### `<animate>` 元素

  


`<animate>` 元素是 SVG 中用于创建动画的主要元素之一。它允许你在 SVG 图形中应用各种动画效果，例如平移动画、缩放动画、颜色动画、透明度动画等。你可以通过组合不同的属性和使用其他的 SVG 动画元素来创建更复杂和引人注目的动画。

  


可应用于 `<animate>` 元素上的属性主要有：

  


-   `xlink:href`：指定要应用动画的目标元素的 `ID` 或 `URL`。动画将影响此元素的属性。
-   `attributeName`：指定要动画的属性的名称。例如，如果你想要更改圆的半径，则设置为 `"r"`。
-   `from`：指定动画属性的起始值。
-   `to`：指定动画属性的结束值。
-   `dur`：指定动画的持续时间。可以使用表示时间的值，如`s`（秒）或`ms`（毫秒）。
-   `begin`：指定动画何时开始。可以是 `"0s"` 表示立即开始，也可以是[事件触发](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Events)（例如`"click"`）。
-   `repeatCount`：指定动画重复的次数。可以设置为整数值或 `"indefinite"`（无限循环）。
-   `fill`：指定动画结束后属性值的处理方式。常见的值包括 `"freeze"`（保持最终值）和 `"remove"`（恢复到初始状态）。
-   `keyTimes`：指定关键帧的时间值，用于控制动画属性的插值。
-   `keySplines`：如果使用 `calcMode="spline"`，则指定贝塞尔曲线的控制点，以定制缓动效果。
-   `calcMode`：指定插值模式，包括 `"linear"`、`"paced"`、`"discrete"` 和 `"spline"`。
-   `keyPoints`：用于指定关键帧的百分比值，仅在 `calcMode="paced"` 时使用。
-   `accumulate`：指定是否累积动画效果，允许上一个动画的效果叠加到下一个动画。
-   `additive`：指定是否相对于原始值叠加动画效果，允许动画从当前值开始。
-   `min` 和 `max`：指定动画的最小和最大活动时间，以控制动画的时长。
-   `end`：指定动画的结束时间。

  


以下是使用 `<animate>` 元素创建的脉博动画：

  


```SVG
<svg width="400" height="400" viewBox="0 0 400 400" class="element">
    <circle class="pulse" cx="50%" cy="50%" r="30" stroke="black" stroke-width="4" fill="#ffffff" stroke-opacity="0">
        <animate attributeName="stroke-width" from="4" to="0" repeatCount="indefinite" begin="0s" dur="2s" />
        <animate attributeName="stroke-opacity" from="1" to="0" repeatCount="indefinite" begin="0s" dur="2s" />
        <animate attributeName="r" from="9" to="60" repeatCount="indefinite" begin="0s" dur="2s" />
    </circle>
    <circle cx="50%" cy="50%" r="30" stroke="black" stroke-width="4" stroke-opacity="1" fill="black"></circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/984d877bddf6412aa359d0244fd76926~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=530&s=140474&e=gif&f=92&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/GReLNLq

  


在这个示例中，对 `.pluse` 圆的 `stroke-width` 、`stroke-opacity` 和 `r` 属性进行动画处理，`from` 和 `to` 分别设置了它们的起始值和结束值，`dur` 设置了动画持续时间为 `2s` ，`begin` 设置为 `0s` ，文档加载完就开始播放，`repeatCount` 设置为 `indefinite` ，动画无限循环播放。

  


我们在使用 `<animate>` 元素创建 SVG 动画时，有一些重要的事项需要注意。

  


#### 属性名称和目标元素选择

  


确保 `attributeName` 属性指定的属性名称在目标元素上是有效的。同时，需要将 `<animate>` 嵌套在目标元素内，或者通过 `xlink:href` 属性选择要应用动画的目标元素。

  


```SVG
<animate
    xlink:href="#target-element"
    attributeName="opacity"
    from="0"
    to="1"
    dur="2s"
    begin="click"
    fill="freeze"
/>
```

  


#### 值的类型和格式

  


根据属性的类型，确保提供正确类型和格式的值。例如，颜色属性可能需要使用有效的颜色值，而位置属性可能需要数字或百分比。

  


#### 动画持续时间

  


这一点和 CSS 的动画有点相似，如果你将 `animation-duration` 或 `transition-duration` 设置为 `0` 时，你将看不到任何动画效果。在 SVG 中，也是如此。你需要使用 `dur` 属性为动画设置一个适当的动画持续时间，以确保动画在适当的时间内完成。过长或过短的持续时间可能导致不理想的动画效果。

  


#### 动画开始时间

  


通过 `begin` 属性设置动画的开始时间，可以使用关键字，例如 `click` 、`mouseover` 等，或时钟值，例如 `2s` 。

  


#### 动画重复

  


通过 `repeatCount` 或 `repeatDur` 属性来指定动画的重复次数或重复持续时间。

  


#### 动画填充模式

  


使用 `fill` 属性定义动画结束后元素的状态。常见的值包括 `"freeze"`（保持最后一帧）和 `"remove"`（回到初始状态）。

  


```SVG
<animate
    xlink:href="#target-element"
    attributeName="opacity"
    from="0"
    to="1"
    dur="2s"
    begin="click"
    fill="freeze" <!-- 或者 fill="remove" -->
/>
```

  


#### 附加或累积动画

  


可以使用 `additive` 和 `accumulate` 属性来控制动画效果的附加和累积。

  


```SVG
<animate
    xlink:href="#moving-rectangle"
    attributeName="x"
    from="0"
    to="300"
    dur="2s"
    begin="click"
    fill="freeze"
    additive="sum"
/>
```

  


#### 控制动画元素的活动持续时间

  


使用 `min` 和 `max` 属性限制动画的活动持续时间。这可以帮助你确保动画不会过短或过长：

  


```SVG
<animate
    xlink:href="#scaling-circle"
    attributeName="r"
    from="20"
    to="50"
    dur="1s"
    begin="click"
    fill="freeze"
    min="0.5s"
    max="2s"
/>
```

  


通过理解并注意这些事项，你可以更有效地使用 `<animate>` 元素创建令人印象深刻的 SVG 动画。

  


### `<set>` 元素

  


`<set>` 元素提供了一种直接设置属性或属性值在指定时间段内达到特定值的方式。与其他 SMIL 动画和 SVG 动画元素一样，`<set>` 元素设置表示属性值，保留目标属性在 DOM 中的原始值不变。

  


在使用 `<set>` 时，你需要知道：

  


-   使用 `<set>` 元素设置属性的值，对于这些属性，插值值没有意义；例如，`visibility` 属性只能有 `hidden` 或 `visible` 这两个值
-   `<set>` 元素是非累积的，不允许使用 `additive` 和 `accumulate` 属性，如果指定了这些属性，将会被忽略
-   由于 `<set>` 用于在特定时间内将元素设置为特定值，它不接受前面动画元素中提到的所有属性。例如，它没有 `from` 或 `by` 属性，因为在一段时间内发生变化的值并不是渐进性地变化
-   对于 `<set>` ，你可以指定要定位的元素、属性名称和类型、目标值，并且动画的时序可以通过 `begin`、`dur`、`end`、`min`、`max`、`restart`、`repeatCount`、`repeatDur` 和 `fill` 进行控制。需要知道的是，`repeatCount` 属性并不会导致动画重复，而只是简单地延长显示动画呈现值的时间

  


例如，你可以使用 `<set>` 元素来控制简单的滑入滑出的效果：

  


```SVG
<svg width="400" height="400" viewBox="0 0 400 400" class="element">
    <rect x="100" y="100" rx="10" ry="10" width="200" height="200" fill="#000099"> 
        <set begin="mouseover" end="mouseout" attributeName="class" to="round"/> 
    </rect>
</svg>
```

  


```CSS
.round {
    rx: 100px;
    ry: 100px;
    fill: #CCCCFF;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d59cfe8dc7ae4734a3fc26d16f9f3ea7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=510&s=89518&e=gif&f=109&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/yLwrbXo

  


当用户的鼠标移动到矩形上时，矩形变成圆形，同时填充颜色会变成一种淡蓝色，并保持在这个视觉效果，直到鼠标移开，结束动画。相对于使用成对的 `<animate>` 元素，`<set>` 元素提供了一种更简洁的方式。

  


SVG 允许使用 `<set>` 元素使一个元素或一组元素在可见和不可见之间切换。假设你想要在最初的 `2s` 内保持一些文本的隐藏，然后让它在接来的 `6s` 内可见。那么你可以先在 `<text>` 上设置 `visibility` 属性的值为 `hidden` ，然后在里面嵌套一个 `<set>` 元素，该元素将 `visibility` 属性从 `hidden` 动画到 `visible` ，并且设置 `begin` 的值为 `2s` （文本在最初的 `2s` 内不可见），`dur` 设置为 `6s` ，表示文本可见 `6s` 。在此期间后，`visibility` 属性的原始值（`hidden`）将恢复，文本也再次隐藏，变得不可见。

  


```SVG
<svg width="400" height="60" viewBox="0 0 400 60" class="element">
    <text x="40" y="40" fill="#990066" stroke="#990066">
        <set attributeName="visibility" attributeType="CSS" to="visible" begin="2s" dur="6s" />
        现在你看到我了!🦹♀️
    </text>
</svg>
```

  


```CSS
text {
    visibility: hidden;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22e05fa076bd424bbb22ec685867877e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=282&s=93377&e=gif&f=223&b=ffffff)

  


  


> Demo 地址：https://codepen.io/airen/full/MWxRmXQ

  


你也可以在 `<set>` 元素上指定 `fill` 属性的值为 `freeze` ，使文本保持在可见状态：

  


```SVG
<svg width="400" height="60" viewBox="0 0 400 60" class="element">
    <text x="40" y="40" fill="#990066" stroke="#990066">
        <set attributeName="visibility" fill="freeze" attributeType="CSS" to="visible" begin="2s" dur="6s" />
        现在你看到我了!🦹♀️
    </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8209ade24e8468d8eadf0f7c1db4aa4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072&h=332&s=67655&e=gif&f=156&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/BabERvQ

  


在 SVG 中，当引用 SVG 填充时，你可能会使用一个 `URI` ，该 `URI` 指向定义填充的 `<linearGradient>` 或其他元素的 `id` 属性。这个 `URI` ，就像许多其他 SVG 属性一样，是可以被动画化的。例如下面这个示例：

  


```SVG
<svg width="460" height="120" viewBox="0 0 460 120" class="element">
    <defs>
        <linearGradient id="gradient1" gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="450" y2="100">
            <stop offset="10%"  stop-color="#ff0066" />
            <stop offset="90%" stop-color="#eeffee" />
        </linearGradient>
        <linearGradient id="gradient2" gradientUnits="userSpaceOnUse" x1="60" y1="60" x2="400" y2="120">
            <stop offset="20%" stop-color="#ff3366" />
            <stop offset="80%" stop-color="#ffccff" />
        </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="50" fill="url(#gradient1)" id="circle1" /> 
    <circle cx="170" cy="60" r="50" fill="url(#gradient1)" id="circle2" />
    <circle cx="280" cy="60" r="50" fill="url(#gradient1)" id="circle3" />
    <circle cx="390" cy="60" r="50" fill="url(#gradient1)"  id="circle4">
        <set attributeName="fill" from="url(#gradient1)" to="url(#gradient2)" begin="3s" dur="5s" repeatCount="3" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6640a984f8cd4abca675e963d047d824~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=326&s=822815&e=gif&f=411&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/BabEReW

  


上面的示例中，使用 `<linearGradient>` 定义了 `id` 为 `gradient1` 和 `gradient2` 两个线性渐变，并且将所有 `<circle>` 的 `fill` 属性设置为 `url(#gradient1)` ，相当于圆填充了一个渐变效果（`gradient1`）。同时在 `circle4` （第四个圆） 中嵌套了 `<set>` 元素，该元素的 `from` 属性引用了具有 `id` 属性 `gradient1` 的 `<linearGradient>` 元素，然后将引用的渐变修改为 `id` 属性 `gradient2` 的 `<linearGradient>` 元素。在动画结束时，因为 `<set>` 元素上没有设置 `fill` 属性，所以使用的渐变返回到 `<circle>` 元素的 `fill` 属性描述的渐变：

  


```SVG
<circle cx="390" cy="60" r="50" fill="url(#gradient1)"  id="circle4">
    <set attributeName="fill" from="url(#gradient1)" to="url(#gradient2)" begin="3s" dur="5s" repeatCount="3" />
</circle>
```

  


### `<animateMotion>` 元素

  


`<animateMotion>` 元素是我最喜欢的 SMIL 动画元素之一，因为它和 [CSS 的路径动画](https://juejin.cn/book/7288940354408022074/section/7308623339038670860)类似，它可以在 SVG 中创建沿着路径运动的动画效果。通过结合路径信息和动画属性，`<animateMotion>` 元素能够实现各种有趣的效果：

  


-   **路径动画**： 最基本的用途是沿着路径移动元素，可以创建平滑的曲线、直线或复杂的路径。这对于呈现路径动画的图形或图标非常有用。
-   **模拟车辆运动**： 通过在道路或轨道上移动元素，可以创建模拟车辆、飞机或其他运动物体的效果。这对于创建动态的交通场景或游戏中的元素移动效果很有用。
-   **动态图表元素**： 在图表中使用 `<animateMotion>` 可以使图表元素沿着预定的路径移动，以引起用户的注意或强调数据的变化。
-   **路径跟随效果**： 元素可以根据某个路径的形状而不断改变其方向，例如，沿着螺旋形路径移动的元素，呈现出跟随螺旋形的效果。
-   **视觉故事叙述**： 通过在场景中移动元素，可以创建更生动的场景，用于讲述视觉故事。这对于网页设计、动画、演示文稿等方面都很有用。
-   **模拟粒子效果**： 通过沿着路径移动小元素，可以模拟粒子的运动效果，例如，星星沿着弯曲路径飘动的效果。

  


在使用 `<animateMotion>` 元素时，你可以通过设置 `dur`（动画持续时间）、`repeatCount`（重复次数）、`rotate`（旋转方向）、`path`（路径定义）等属性来控制动画的行为。这使得 `<animateMotion>` 元素成为在 SVG 动画中非常灵活和有创意的工具。

  


例如下面这个示例：

  


```SVG
<svg width="500" height="300" viewBox="0 0 500 300" class="element">
    <path d="M0,300 C 100,0 400,0 500,300" fill="none" stroke="#00ff00" stroke-width="2"/> 
    <circle x="100" y="50" r="20" fill="red"> 
        <animateMotion dur="6s" repeatCount="indefinite" path="M0,300 C 100,0 400,0 500,300" /> 
    </circle>
</svg>
```

  


上面代码创建了一个路径和一个沿着该路径移动的动画圆圈：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40a7f03e0e674aadb79aec56c0baba3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044&h=482&s=206131&e=gif&f=65&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/oNVOQGj

  


正如你看到的，一个红色的圆圈沿着预定义的曲线路径移动，动画持续 `6s` 并无限循环。这种效果是通过 `<animateMotion>` 元素结合路径信息实现的，它使得元素在路径上运动，并且动画属性通过设置 `dur`、`repeatCount` 和 `path` 进行控制。

  


上面这个是最简单的一个路径动画，你还可以使用相似的方法，创建出更复杂的路径动画，例如下面这个小汽车在赛道上行驶的效果，也是路径动画构建的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/892cf48c345f4a51a2d08eaa117af594~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=620&s=1766870&e=gif&f=99&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/yLwrXjZ

  


使用 `<animateMotion>` 元素制作路径动画并不难，它有一个关键要素，即运动路径，因为它是元素沿着路径运动的首要和必要条件。在 SVG 中，你可以通过两种不同的方式为元素指定运动路径：

  


-   通过 `path` 属性指定运动路径
-   使用 `<mpath>` 元素指定运动路径

  


`<animateMotion>` 元素在控制动画行为方面与 `<animate>` 元素相似，除了可以使用 SVG 动画的基本属性之外，它还额外有 `keyPoints` 、`rotate` 和 `path` 三个属性。此外，关于 `calcMode` 属性有一个不同之处，默认值为 `paced` ，而不是 `linear` 。

  


接下来，继续以一些简单的实例来向大家阐述 `<animateMotion>` 元素。我们先从指定运动路径开始。

  


#### 通过 path 属性指定运动路径

  


使用 `<animateMotion>` 元素的 `path` 属性来指定运动路径，是最常见的方式之一，它的格式和在 `<path>` 元素上的 `d` 属性相同。你需要使用路径数据来定义路径的形状。路径数据是由一系列的命令和参数组成的字符串：

  


-   **`M`** (Move To)：将画笔移动到指定的坐标位置，不画线。例如，`M10 20` 表示将画笔移动到坐标 `(10, 20)`。
-   **`L`** (Line To)：从当前位置画一条直线到指定的坐标位置。例如，`L30 40` 表示从当前位置画一条直线到坐标 `(30, 40)`。
-   **`H`** (Horizontal Line To)：画一条水平线到指定的 `x` 坐标。例如，`H50` 表示画一条水平线到 `x` 坐标为 `50` 的位置。
-   **`V`** (Vertical Line To)：画一条垂直线到指定的 `y` 坐标。例如，`V60` 表示画一条垂直线到 `y` 坐标为 `60` 的位置。
-   **`C`** (Cubic Bezier Curve)：创建三次贝塞尔曲线。例如，`C80 90, 100 110, 120 130` 表示创建一个三次贝塞尔曲线。
-   **`Q`** (Quadratic Bezier Curve)：创建二次贝塞尔曲线。例如，`Q40 50, 60 70` 表示创建一个二次贝塞尔曲线。
-   **`S`** (Smooth Curve)：创建平滑的贝塞尔曲线，可以继续前面的曲线。例如，`S80 90, 100 110` 表示创建一个平滑的贝塞尔曲线。
-   **`A`** (Elliptical Arc Curve)：创建椭圆弧曲线。例如，`A15 20 45 0 1 75 85` 表示创建一个椭圆弧曲线。
-   **`Z`** (Close Path)：封闭当前路径，连接当前点和起始点。例如，`Z` 表示封闭当前路径。

  


这些指令可以组合在一起，以创建复杂的路径形状。路径数据是通过这些指令和相关参数的组合来构建的。你可以通过 [SVG Path Visualizer](https://svg-path-visualizer.netlify.app/) ****或 [W3C 规范来进一步了解 SVG 的 path](https://www.w3.org/TR/SVG2/paths.html) 。

  


需要知道的是，使用命令来绘制路径是件极其痛苦的事情，甚至还易于出错，个人建议还是通过一些矢量图形绘制工具，或在线工具来获取所需要路径数据。例如，在 Figma 中绘制路径，这里就不向大家展示这个过程了。

  


下面是一个小汽车沿着指定路径运动的动画效果：

  


```SVG
<svg viewBox="0 0 307 184" xmlns="http://www.w3.org/2000/svg" class="element">
    <!-- 定义路径形状 -->
    <path fill="none" stroke="#facc15" stroke-dasharray="4" d="M167.88,111.3 c3.11,0,6.12,1.44,8.06,3.96l30.58,39.82c1.75,2.28,4.95,2.91,7.43,1.46l64.07-37.37c1.75-1.02,2.84-2.92,2.84-4.95V96.04 c0-1.64-0.71-3.21-1.94-4.29c-1.23-1.09-2.87-1.59-4.5-1.39l-9.83,1.23c-4.66,0.58-8.96-1.96-10.68-6.34 c-1.73-4.37-0.33-9.16,3.48-11.93l0.19-0.14c2.48-1.8,2.71-4.49,2.09-6.41c-0.62-1.91-2.38-3.96-5.45-3.96 c-3.66,0-7.05-1.98-8.84-5.18L229.65,29.6c-1.01-1.8-2.93-2.93-5-2.93H155.2c-1.59,0-3.12,0.67-4.2,1.83l-28.78,31.06 c-1.91,2.06-4.62,3.25-7.43,3.25H31.87c-3.16,0-5.73,2.57-5.73,5.73v32.5c0,2.68,1.83,4.98,4.44,5.58l35.59-1.79 c3.27,0.76,23.73,23.28,26.51,22.67l73.06-15.98C166.45,111.38,167.17,111.3,167.88,111.3z" />
  
    <!-- 在路径上移动的小汽车 -->
    <path class="car" fill="#84CC16" style="transform: translate(-12px, -12px)" d="M16.38,18.39c0.22-0.44,0.24-0.8,0.2-1.07l0.19,0.01c0.02,0.21,0.18,0.37,0.4,0.38l2.44,0.06 c0.21,0.01,0.38-0.15,0.41-0.35l1.05,0.03c0.34,0.01,0.66-0.15,0.86-0.42l0.86-1.17c0.18-0.25,0.28-0.55,0.28-0.85V8.99 c0-0.31-0.1-0.6-0.28-0.85l-0.86-1.17c-0.2-0.27-0.52-0.43-0.86-0.42l-1.05,0.03c-0.03-0.2-0.2-0.36-0.41-0.35l-2.44,0.06 c-0.21,0.01-0.38,0.17-0.4,0.38l-0.19,0.01c0.04-0.27,0.02-0.63-0.2-1.07c-0.15-0.3-0.27-0.31-0.35-0.18 c-0.15,0.25-0.16,1,0.01,1.27L7.73,6.93C7.7,6.73,7.53,6.57,7.32,6.57L4.88,6.64C4.66,6.64,4.5,6.82,4.48,7.03L2.58,7.08 c0,0,0,0,0,0l-0.08,0C2.07,7.1,1.7,7.33,1.5,7.69C1.47,7.74,1.45,7.8,1.43,7.85C1.19,8.53,0.93,9.76,0.93,12 c0,2.24,0.26,3.47,0.5,4.15c0.16,0.45,0.59,0.75,1.06,0.77l2.04,0.06c0.01,0.21,0.18,0.38,0.4,0.39l2.44,0.06 c0.21,0.01,0.39-0.15,0.41-0.36l8.26,0.24c-0.17,0.27-0.16,1.02-0.01,1.27C16.11,18.71,16.23,18.7,16.38,18.39z M17.22,12 c0,0-0.02,3.07-0.57,4.6c0,0-1.07-0.27-2.03-1.49c-0.11-0.14-0.17-0.32-0.17-0.5V12V9.38c0-0.18,0.06-0.35,0.17-0.5 c0.96-1.22,2.03-1.49,2.03-1.49C17.2,8.93,17.22,12,17.22,12z M21.66,6.99c0.03-0.03,0.08-0.03,0.11,0.01 c0.19,0.25,0.88,1.16,1.04,1.38c0.18,0.26-0.02,0.74-0.2,0.36c-0.14-0.29-0.7-1.03-0.97-1.38C21.55,7.25,21.56,7.09,21.66,6.99z M15.83,7.18c0,0-0.95,1.2-3.43,1.2c-0.01,0-0.01,0-0.02,0V7.27L15.83,7.18z M6.51,7.42l5.56-0.14v1.1c-2.07,0-1.26,0-3.14,0 C6.97,8.37,6.51,7.42,6.51,7.42z M5.56,12c0-3.28,0.57-3.99,0.57-3.99C6.59,8.37,7.14,8.62,7.5,8.76c0.24,0.1,0.41,0.33,0.41,0.6 V12v2.64c0,0.26-0.16,0.5-0.41,0.6c-0.37,0.14-0.91,0.4-1.37,0.75C6.13,15.99,5.56,15.28,5.56,12z M6.51,16.58 c0,0,0.46-0.95,2.43-0.95c1.88,0,1.07,0,3.14,0v1.1L6.51,16.58z M12.38,16.73v-1.11c0.01,0,0.01,0,0.02,0c2.49,0,3.43,1.2,3.43,1.2 L12.38,16.73z M21.64,16.64c0.27-0.35,0.83-1.1,0.97-1.38c0.18-0.38,0.38,0.1,0.2,0.36c-0.16,0.22-0.85,1.13-1.04,1.38 c-0.03,0.03-0.08,0.04-0.11,0.01C21.56,16.91,21.55,16.75,21.64,16.64z">
        <!-- 使用animateMotion指定路径动画 -->
        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" begin="0.8" path="M167.88,111.3 c3.11,0,6.12,1.44,8.06,3.96l30.58,39.82c1.75,2.28,4.95,2.91,7.43,1.46l64.07-37.37c1.75-1.02,2.84-2.92,2.84-4.95V96.04 c0-1.64-0.71-3.21-1.94-4.29c-1.23-1.09-2.87-1.59-4.5-1.39l-9.83,1.23c-4.66,0.58-8.96-1.96-10.68-6.34 c-1.73-4.37-0.33-9.16,3.48-11.93l0.19-0.14c2.48-1.8,2.71-4.49,2.09-6.41c-0.62-1.91-2.38-3.96-5.45-3.96 c-3.66,0-7.05-1.98-8.84-5.18L229.65,29.6c-1.01-1.8-2.93-2.93-5-2.93H155.2c-1.59,0-3.12,0.67-4.2,1.83l-28.78,31.06 c-1.91,2.06-4.62,3.25-7.43,3.25H31.87c-3.16,0-5.73,2.57-5.73,5.73v32.5c0,2.68,1.83,4.98,4.44,5.58l35.59-1.79 c3.27,0.76,23.73,23.28,26.51,22.67l73.06-15.98C166.45,111.38,167.17,111.3,167.88,111.3z" />
    </path>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7158a08f5607450288afaeab339fd823~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300&h=600&s=412922&e=gif&f=64&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/WNmWYVY

  


我们通过图形设计软件，绘制了一个路径，而小汽车 `.car` （它也是 `<path>` 绘制出来的）使用 `<animateMotion>` 元素指定了一个动画，通过 `path` 属性引用了路径（它和 `<path>` 元素的 `d` 值相同）。`dur` 属性指定了动画的持续时间，`repeatCount` 属性设置为 `"indefinite"` 表示动画会无限循环。`rotate` 属性设置为 `auto` ，指定元素沿运动路径的方向运动。

  


通过 `path` 属性指定运动路径看上去并不复杂，但你需要知道的是，运动路径的动画的效果是将一个被充变换矩阵添加到引用对象的当前变换矩阵上，从而通过计算得到的 `x` 和 `y` 值在当前用户坐标系的 `x` 和 `y` 轴上进行平移。换句话说，指定的路径是相对于元素当前位置计算的，通过使用路径数据将元素变换到路径位置。

  


要是对 SVG 坐标系了解不够的话，理解上面这段话是有较大困难的。非常遗憾的是，它也是一个复杂的知识体系，也是 SVG 中非常重要的一个知识。但这部分内容已经超出了这节课的范畴，因此我也无法在这里对其进行详细阐述，希望后面能有专门针对 SVG 系统的课程，向大家阐述这方面的知识。在这里，我尝试着用下面这个案例来解释上面这段话。

  


以下是让一个圆沿着指定路径运动所需的代码：

  


```SVG
<svg width="500" height="350" viewBox="0 0 500 350" class="element">
    <!-- 定义圆的运动路径 -->
    <path fill="none" stroke="#facc15" stroke-dasharray="4" d="M0,0c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5 c1.9-2.1,3.7-5.5,6.5-6.5" />
  
    <!-- 在指定的路径上移动圆 -->
    <circle id="circle" r="20" cx="100" cy="100" fill="lime">
        <!-- 使用animateMotion指定路径动画 -->
        <animateMotion dur="1s" begin="click" fill="freeze" path="M0,0c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5 c1.9-2.1,3.7-5.5,6.5-6.5" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/effd84f25e814a6ab6abed2df5405b9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=436&s=242068&e=gif&f=111&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/yLwrZNV

  


你可能已经发现了，圆的中心位置并没有在指定的路径上。我们来看一下路径数据中的坐标。路径开始时通过（`M`）移动到坐标点 `(0,0)` ，然后开始绘制曲线（`c`）到另一点。重要的是要注意，`(0,0)` 点实际上是圆的位置，它并不是坐标系统左上角的 `(0,0)` 。这就是前面所提到的，**路径属性中的坐标是相对于元素当前位置的**！

  


要改变这种现象，我们需要调整路径的位置或调整元素的位置。就上面的示例而言，我们可以使用 CSS 的 `transform` 将 `<path>` 位置移动到与圆圈相同的坐标位置：

  


```SVG
<svg width="500" height="350" viewBox="0 0 500 350" class="element">
    <!-- 定义圆的运动路径 -->
    <path style="translate:100px 100px" fill="none" stroke="#facc15" stroke-dasharray="4" d="M0,0c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5 c1.9-2.1,3.7-5.5,6.5-6.5" />
  
    <!-- 在指定的路径上移动圆 -->
    <circle id="circle" r="20" cx="100" cy="100" fill="lime">
        <!-- 使用animateMotion指定路径动画 -->
        <animateMotion dur="1s" begin="click" fill="freeze" path="M0,0c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5 c1.9-2.1,3.7-5.5,6.5-6.5" />
    </circle>
</svg>
```

  


或者调整圆圈的坐标位置：

  


```SVG
<svg width="500" height="350" viewBox="0 0 500 350" class="element">
    <!-- 定义圆的运动路径 -->
    <path fill="none" stroke="#facc15" stroke-dasharray="4" d="M0,0c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5 c1.9-2.1,3.7-5.5,6.5-6.5" />
  
    <!-- 在指定的路径上移动圆 -->
    <circle id="circle" r="20" cx="0" cy="0" fill="lime">
        <!-- 使用animateMotion指定路径动画 -->
        <animateMotion dur="1s" begin="click" fill="freeze" path="M0,0c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5 c1.9-2.1,3.7-5.5,6.5-6.5" />
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8af5881b9aa64a5ab969b3e3d70b87eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1324&h=500&s=614452&e=gif&f=168&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/KKEYJgN

  


你可能已经发现了，不管使用哪种方式，最终呈现的效果圆圈都是位于指定路径坐标上运动，只是两种方式最终呈现的效果有所差异。这也是路径动画较为头痛之处，这一点在 CSS 路径动画中是一样的。因此，在准备动画的运动路径时，请确保记住这一点。

  


#### 使用 `<mpath>` 元素指定运动路径

  


在 SVG 中，`<mpath>` 是另一种指定运动路径的方法。它使用的不是相对路径属性，而是引用外部路径。`<mpath>` 元素的 `xlink:href` 属性会引用外部路径。

  


```SVG
<svg width="500" height="300" viewBox="0 0 500 300" class="element">
    <path id="motionPath" d="M0,300 C 100,0 400,0 500,300" fill="none"  stroke="#facc15" stroke-dasharray="4" />

    <circle x="100" y="50" r="20" fill="lime">
        <animateMotion dur="6s" repeatCount="indefinite">
            <mpath xlink:href="#motionPath" />
        </animateMotion>
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cec7cb3cc94342e5b2f7f67a1bd85e8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=372&s=183347&e=gif&f=40&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/qBvwgpQ

  


在上面这个示例中，`<path>` 元素定义了一个曲线路径，它有一个 `id` 为 `motionPath` 的名称，同时在 `<circle>` 内嵌套了一个 `<animateMotion>` 元素，并且在 `<animateMotion>` 元素内部嵌套了一个 `<mpath>` 元素，该元素通过 `xlink:href="#motionPath"` 引用了 `id` 名为 `motionPath` 的 `<path>` 元素定义的曲线路径。

  


这样，圆将沿着 `motionPath` 路径移动，并且动画将不断重复。你可以根据需要更改路径的形状和`<animateMotion>`元素的属性来调整动画效果。

  


正如上面示例所示，运动路径可以在文档的任何地方定义，甚至可以在文档中仅仅定义，而不在 SVG 画布上渲染。在上面的示例中，路径被渲染，因为在大多数情况下，你可能希望显示元素沿其移动的路径。

  


需要注意的是，W3C 规范有这样的一段描述：

  


> 形状的各个 `(x, y)` 点为引用对象的 CTM 提供了一个补充变换矩阵，该矩阵通过计算得到的形状的 `(x,y)` 值在当前用户坐标系的 `x` 和 `y` 轴上进行平移。因此，引用对象会随时间的推移通过运动路径的偏移相对于当前用户坐标系的原点进行平移。该补充变换是应用在由于目标元素的 `transform` 属性或目标元素上的 `animateTransform` 元素导致的任何变换之上的。

  


同样，圆的位置由路径数据中的坐标“乘以”或“变换”。例如下面这个示例，我们在 SVG 画布的中央有一条路径，圆位于该路径的起点。然而，当应用运动路径时，圆不会从其当前位置开始运动：

  


```SVG
<svg width="500" height="350" viewBox="0 0 500 350" class="element">
    <path id="motionPath" fill="none" stroke="#facc15" stroke-dasharray="4" stroke-miterlimit="10" d="M91.4,104.2c3.2-3.4,18.4-0.6,23.4-0.6c5.7,0.1,10.8,0.9,16.3,2.3 c13.5,3.5,26.1,9.6,38.5,16.2c12.3,6.5,21.3,16.8,31.9,25.4c10.8,8.7,21,18.3,31.7,26.9c9.3,7.4,20.9,11.5,31.4,16.7 c13.7,6.8,26.8,9.7,41.8,9c21.4-1,40.8-3.7,61.3-10.4c10.9-3.5,18.9-11.3,28.5-17.8c5.4-3.7,10.4-6.7,14.8-11.5 c1.9-2.1,3.7-5.5,6.5-6.5" />
    <circle id="circle" r="20" cx="100" cy="100" fill="lime" />
    <animateMotion xlink:href="#circle" dur="1s" begin="click" fill="freeze">
        <mpath xlink:href="#motionPath" />
    </animateMotion>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5582a73d81364b4b91ad62ba1bc74f28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1118&h=512&s=330469&e=gif&f=160&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/rNRbPKd

  


看看圆是如何遵循路径的相同形状，但在不同位置上的？这是因为圆的位置由路径数据的值转换。这个现象和 `path` 属性指定的路径是相似的。其中一个解决方法是从圆的位置 `(0, 0)` 开始，以便在应用路径时，它将按预期开始并进行。另一种方法是应用“重置”圆坐标的变换，使它们在应用路径之前计算为零。

  


以下是上述演示的修改版本，使用了一个闭合路径并无限次重复运动动画。

  


```SVG
<svg width="500" height="350" viewBox="0 0 500 350" class="element">
    <path id="motionPath" fill="none" stroke="#facc15" stroke-dasharray="4" stroke-miterlimit="10" d="M202.4,58.3c-13.8,0.1-33.3,0.4-44.8,9.2 c-14,10.7-26.2,29.2-31.9,45.6c-7.8,22.2-13.5,48-3.5,70.2c12.8,28.2,47.1,43.6,68.8,63.6c19.6,18.1,43.4,26.1,69.5,29.4 c21.7,2.7,43.6,3.3,65.4,4.7c19.4,1.3,33.9-7.7,51.2-15.3c24.4-10.7,38.2-44,40.9-68.9c1.8-16.7,3.4-34.9-10.3-46.5 c-9.5-8-22.6-8.1-33.2-14.1c-13.7-7.7-27.4-17.2-39.7-26.8c-5.4-4.2-10.4-8.8-15.8-12.9c-4.5-3.5-8.1-8.3-13.2-11 c-6.2-3.3-14.3-5.4-20.9-8.2c-5-2.1-9.5-5.2-14.3-7.6c-6.5-3.3-12.1-7.4-19.3-8.9c-6-1.2-12.4-1.3-18.6-1.5 C222.5,59,212.5,57.8,202.4,58.3" />

    <circle id="circle" r="10" cx="0" cy="0" fill="lime" />

    <animateMotion xlink:href="#circle" dur="5s" begin="0s" fill="freeze" repeatCount="indefinite">
        <mpath xlink:href="#motionPath" />
    </animateMotion>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40e8fc2658484fe5a8d0cf285fb09841~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=448&s=237151&e=gif&f=62&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/RwdOvYw

  


#### `<animateMotion>` 元素的覆盖规则

  


由于在 `<animateMotion>` 中有多种方式执行相同的操作，因此有必要制定覆盖规则以指定哪些值会覆盖其他值。它的覆盖规则分为两个部分：

  


-   **关于运动路径的定义**：`<mpath>` 元素指定的运动路径将会覆盖 `path` 属性指定的运动路径；`path` 属性会覆盖 `<animateMotion>` 元素的 `values` 属性，而 `values` 属性又会覆盖 `from` 、`by` 和 `to`
-   **关于确定与** **`keyTimes`** **属性对应的点的定义**：`keyPoints` 属性会覆盖 `path`，`path` 会覆盖 `values`，`values` 会覆盖 `from`、`by` 和 `to`

  


这些规则帮助你在定义运动路径和关键点时确保正确的覆盖和动画效果。例如，如果你使用 `path` 属性定义了运动路径，但同时也使用了 `<mpath>` 元素，那么 `<mpath>` 中的路径将覆盖 `path` 中的路径。同样，`keyPoints` 属性会覆盖 `path` 中的定义。

  


#### 使用 rotate 属性设置元素沿运动路径的方向

  


不知道你是否发现了，课程前面小汽车在沿着指定路径移动的案例中，我们在 `<animateMotion>` 元素上设置了 `rotate` 属性的值为 `auto` ：

  


```SVG
<svg viewBox="0 0 307 184" xmlns="http://www.w3.org/2000/svg" class="element">
    <!-- 定义路径形状 -->
    <path fill="none" stroke="#facc15" stroke-dasharray="4" d="M167.88,111.3 c3.11,0,6.12,1.44,8.06,3.96l30.58,39.82c1.75,2.28,4.95,2.91,7.43,1.46l64.07-37.37c1.75-1.02,2.84-2.92,2.84-4.95V96.04 c0-1.64-0.71-3.21-1.94-4.29c-1.23-1.09-2.87-1.59-4.5-1.39l-9.83,1.23c-4.66,0.58-8.96-1.96-10.68-6.34 c-1.73-4.37-0.33-9.16,3.48-11.93l0.19-0.14c2.48-1.8,2.71-4.49,2.09-6.41c-0.62-1.91-2.38-3.96-5.45-3.96 c-3.66,0-7.05-1.98-8.84-5.18L229.65,29.6c-1.01-1.8-2.93-2.93-5-2.93H155.2c-1.59,0-3.12,0.67-4.2,1.83l-28.78,31.06 c-1.91,2.06-4.62,3.25-7.43,3.25H31.87c-3.16,0-5.73,2.57-5.73,5.73v32.5c0,2.68,1.83,4.98,4.44,5.58l35.59-1.79 c3.27,0.76,23.73,23.28,26.51,22.67l73.06-15.98C166.45,111.38,167.17,111.3,167.88,111.3z" />
  
    <!-- 在路径上移动的小汽车 -->
    <path class="car" fill="#84CC16" style="transform: translate(-12px, -12px)" d="M16.38,18.39c0.22-0.44,0.24-0.8,0.2-1.07l0.19,0.01c0.02,0.21,0.18,0.37,0.4,0.38l2.44,0.06 c0.21,0.01,0.38-0.15,0.41-0.35l1.05,0.03c0.34,0.01,0.66-0.15,0.86-0.42l0.86-1.17c0.18-0.25,0.28-0.55,0.28-0.85V8.99 c0-0.31-0.1-0.6-0.28-0.85l-0.86-1.17c-0.2-0.27-0.52-0.43-0.86-0.42l-1.05,0.03c-0.03-0.2-0.2-0.36-0.41-0.35l-2.44,0.06 c-0.21,0.01-0.38,0.17-0.4,0.38l-0.19,0.01c0.04-0.27,0.02-0.63-0.2-1.07c-0.15-0.3-0.27-0.31-0.35-0.18 c-0.15,0.25-0.16,1,0.01,1.27L7.73,6.93C7.7,6.73,7.53,6.57,7.32,6.57L4.88,6.64C4.66,6.64,4.5,6.82,4.48,7.03L2.58,7.08 c0,0,0,0,0,0l-0.08,0C2.07,7.1,1.7,7.33,1.5,7.69C1.47,7.74,1.45,7.8,1.43,7.85C1.19,8.53,0.93,9.76,0.93,12 c0,2.24,0.26,3.47,0.5,4.15c0.16,0.45,0.59,0.75,1.06,0.77l2.04,0.06c0.01,0.21,0.18,0.38,0.4,0.39l2.44,0.06 c0.21,0.01,0.39-0.15,0.41-0.36l8.26,0.24c-0.17,0.27-0.16,1.02-0.01,1.27C16.11,18.71,16.23,18.7,16.38,18.39z M17.22,12 c0,0-0.02,3.07-0.57,4.6c0,0-1.07-0.27-2.03-1.49c-0.11-0.14-0.17-0.32-0.17-0.5V12V9.38c0-0.18,0.06-0.35,0.17-0.5 c0.96-1.22,2.03-1.49,2.03-1.49C17.2,8.93,17.22,12,17.22,12z M21.66,6.99c0.03-0.03,0.08-0.03,0.11,0.01 c0.19,0.25,0.88,1.16,1.04,1.38c0.18,0.26-0.02,0.74-0.2,0.36c-0.14-0.29-0.7-1.03-0.97-1.38C21.55,7.25,21.56,7.09,21.66,6.99z M15.83,7.18c0,0-0.95,1.2-3.43,1.2c-0.01,0-0.01,0-0.02,0V7.27L15.83,7.18z M6.51,7.42l5.56-0.14v1.1c-2.07,0-1.26,0-3.14,0 C6.97,8.37,6.51,7.42,6.51,7.42z M5.56,12c0-3.28,0.57-3.99,0.57-3.99C6.59,8.37,7.14,8.62,7.5,8.76c0.24,0.1,0.41,0.33,0.41,0.6 V12v2.64c0,0.26-0.16,0.5-0.41,0.6c-0.37,0.14-0.91,0.4-1.37,0.75C6.13,15.99,5.56,15.28,5.56,12z M6.51,16.58 c0,0,0.46-0.95,2.43-0.95c1.88,0,1.07,0,3.14,0v1.1L6.51,16.58z M12.38,16.73v-1.11c0.01,0,0.01,0,0.02,0c2.49,0,3.43,1.2,3.43,1.2 L12.38,16.73z M21.64,16.64c0.27-0.35,0.83-1.1,0.97-1.38c0.18-0.38,0.38,0.1,0.2,0.36c-0.16,0.22-0.85,1.13-1.04,1.38 c-0.03,0.03-0.08,0.04-0.11,0.01C21.56,16.91,21.55,16.75,21.64,16.64z">
        <!-- 使用animateMotion指定路径动画 -->
        <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" begin="0.8" path="M167.88,111.3 c3.11,0,6.12,1.44,8.06,3.96l30.58,39.82c1.75,2.28,4.95,2.91,7.43,1.46l64.07-37.37c1.75-1.02,2.84-2.92,2.84-4.95V96.04 c0-1.64-0.71-3.21-1.94-4.29c-1.23-1.09-2.87-1.59-4.5-1.39l-9.83,1.23c-4.66,0.58-8.96-1.96-10.68-6.34 c-1.73-4.37-0.33-9.16,3.48-11.93l0.19-0.14c2.48-1.8,2.71-4.49,2.09-6.41c-0.62-1.91-2.38-3.96-5.45-3.96 c-3.66,0-7.05-1.98-8.84-5.18L229.65,29.6c-1.01-1.8-2.93-2.93-5-2.93H155.2c-1.59,0-3.12,0.67-4.2,1.83l-28.78,31.06 c-1.91,2.06-4.62,3.25-7.43,3.25H31.87c-3.16,0-5.73,2.57-5.73,5.73v32.5c0,2.68,1.83,4.98,4.44,5.58l35.59-1.79 c3.27,0.76,23.73,23.28,26.51,22.67l73.06-15.98C166.45,111.38,167.17,111.3,167.88,111.3z" />
    </path>
</svg>
```

  


这是因为汽车的方向是固定的，不会随着运动路径而改变。为了改变这一点，我们将使用 `rotate` 属性。

  


也就是说，在 SVG 动画中，`rotate` 属性可以用来设置元素沿着路径的方向。换句话说，这个属性影响元素在路径上的朝向，确保元素在运动路径上始终面向运动的方向。它和 [CSS 路径动画中的 offset-rotate 属性](https://juejin.cn/book/7288940354408022074/section/7308623339038670860#heading-6)是非常相似的。

  


`rotate` 属性可以接受以下三个值：

  


-   **`auto`**：表示对象会随着运动路径方向的角度（即，方向切线矢量）而随时间旋转。
-   **`auto-reverse`**：表示对象会随着运动路径方向的角度（即，方向切线矢量）加上 `180deg` 而随时间旋转。
-   **数字**：表示目标元素受到一个恒定的旋转变换，其中旋转角度是指定的角度数。

  


#### 使用 keyPoints 控制沿运动路径的动画距离

  


在 SVG 动画中，`keyPoints` 属性主要用于控制沿运动路径的动画距离。它允许为 `keyTimes` 指定的每个值的运动路径上的进度，以便更灵活地控制动画的行为。如果指定了 `keyPoints`，则 `keyTimes` 将应用于 `keyPoints` 中的值，而不是在 `values` 属性数组中指定的点或 `path` 属性上的点。

  


`keyPoints` 接受一个以分号分隔的浮点数值列表，这些值介于 `0 ~ 1` 之间。这些值表示在由 `keyTimes` 属性指定的时刻，对象在运动路径上的移动距离，距离的计算由浏览器的算法确定。列表中的每个进度值对应于 `keyTimes` 属性列表中的一个值。如果指定了`keyPoints`列表，它将导致 `keyTimes` 应用于`keyPoints` 中的值，而不是 `values` 属性数组或 `path` 属性中指定的点。

  


这里需要注意的一件事是，要使 `keyPoints` 正常工作，需要将 `calcMode` 值设置为 `linear`。如果您的关键点来回移动，看起来似乎应该逻辑上适用于步调动画，但实际上不适用。

  


以下是一个简单的示例，演示如何使用 `keyPoints` 属性来控制沿着运动路径的动画距离：

  


```SVG
<svg width="300" height="180" viewBox="0 0 300 180" class="element">
    <path id="motionPath" fill="none" stroke="#facc15" stroke-dasharray="4" d="M10,80 Q150,10 300,80" />
    <circle cx="10" cy="80" r="10" fill="red" style="translate: -10px -80px">
        <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0.5;1" keyTimes="0;0.5;1" calcMode="linear">
            <mpath xlink:href="#motionPath"/>
        </animateMotion>
    </circle>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4696d54f2054e30ad292eb0c2d94601~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=328&s=242569&e=gif&f=96&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/MWxRxoP

  


在这个示例中，`keyPoints`属性设置为 `"0;0.5;1"`，它表示动画在 `0%`、`50%` 和 `100%` 的时刻沿运动路径的进度。通过这种方式，你可以在关键时刻更精确地控制动画的位置。需要注意的是，为了让 `keyPoints` 正常工作，`calcMode` 属性应设置为 `"linear"`。

  


#### 沿任意路径移动文本

  


在 SVG 动画中，沿任意路径移动文本与其他 SVG 元素沿路径移动有所不同。要为文创建沿指定路径运动，你不得不使用 SVG 的 `<textPath>` 元素，而不是 `<animateMotion>` 元素。

  


首先，让我们通过将 `<textPath>` 元素嵌套在 `<text>` 元素中，来沿路径定位文本。将要沿路径定位的文本将在 `<textPath>` 元素内定义，而不是作为 `<text>` 元素的子元素。即通过 `<textPath>` 元素，我们使用`xlink:href` 属性引用了 `<path>` 元素定义的路径，使文本沿着这条路径移动。

  


```SVG
<svg width="500" height="180" viewBox="0 0 500 180" class="element">
    <path id="motionPath" fill="none" stroke="#facc15" stroke-dasharray="4" d="M10,120 Q250,10 500,120" />
    <text fill="lime">
        <textPath xlink:href="#motionPath">Follow me along the path!</textPath>
    </text>
</svg>
```

  


到目前为止，你只能看到文本沿着 `#motionPath` 路径排列文本，并看不到任何的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71d0c25256454835b039b6cec0c6d839~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=801&s=201107&e=jpg&b=340e37)

  


为了使文本能沿着指定的路径 `#motionPath` 运动，我们需要使用 `<animate>` 元素来动画化 `startOffset` 属性：

  


```SVG
<svg width="500" height="180" viewBox="0 0 500 180" class="element">
    <path id="motionPath" fill="none" stroke="#facc15" stroke-dasharray="4" d="M10,120 Q250,10 500,120" />
    <text  fill="lime">
        <textPath xlink:href="#motionPath">
            <animate attributeName="startOffset" from="0%" to ="100%" begin="0s" dur="10s" repeatCount="indefinite" keyTimes="0;1" calcMode="spline" keySplines="0.1 0.2 .22 1"/>
            Follow me along the path!
        </textPath>
    </text>
</svg>
```

  


`startOffset` 表示文本在路径上的偏移。`0%` 是路径的开始；`100%` 表示路径的结束。通过动画化 `startOffset`，我们将创建文本沿路径移动的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67e226b6187e4e2d8ba6bba2f29868a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=368&s=902207&e=gif&f=178&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/vYPMPrg

  


### `<animateTransform>` 元素

  


熟悉 CSS 的同学都知道，在 CSS 中，我们可以通过 `transform` 属性以及新的变换特性，例如 `translate` 、`scale` 或 `roate` 对元素进行变换，而且 [CSS 变换是创建流畅动画的首先之一](https://juejin.cn/book/7288940354408022074/section/7295240572736897064)。

  


在 SVG 中，我们可以使用 `<animateTransform>` 元素对目标元素进行变换动画，它允许你对元素进行平移、缩放、旋转和倾斜。它可以用来在一定的时间内逐渐改变目标元素的变换属性，创建各种动画效果。它采用与 `<animate>` 元素相同的属性，还额外提供了一个属性：`type`。

  


`type` 属性用于指定正在进行动画的变换类型。它有五个可能的值：`translate`、`scale`、`rotate`、`skewX`和`skewY`。

  


`from`、`by` 和 `to` 属性采用一个使用给定变换类型的相同语法表达的值：

  


-   对于 `type="translate"` ，每个独立的值表示为 `<tx> [,<ty>]`。
-   对于 `type="scale"`，每个独立的值表示为 `<sx> [,<sy>]`。
-   对于 `type="rotate"`，每个独立的值表示为 `<rotate-angle> [<cx> <cy>]</cy></cx></rotate-angle>`。
-   对于 `type="skewX"`和`type="skewY"`，每个独立的值表示为 `<skew-angle></skew-angle>`。

  


相比而言，个人认为 `<animateTransform>` 是 SVG 动画中最复杂的部分。为什么这么说呢？

  


对于单个变换动画，使用 `<animateTransform>` 并不复杂。然而，当包含多个变换时，情况可能变得非常混乱和复杂，特别是因为一个 `<animateTransform>` 可能会覆盖另一个，所以你可能最终得到的效果不是你预期的效果。如果让我选择的话，我更趋向于选择 CSS 的变换，因为它要比 SVG 的变换简单地多，而且现在 CSS 和 SVG 能完美的配合在一起创建复杂，酷炫和引人注目的动画效果。这将在下一节课中会详细介绍。这也意味着，你可能根本不需要在 SVG 中使用 `<animateTransform>` 来创建动画。

  


下面是一个使用 `<animateTransform>` 元素旋转一个矩形的简单示例：

  


```SVG
<svg width="500" height="400" viewBox="0 0 500 400" class="element">
    <rect width="30" height="30" x="300" y="100" fill="lime">
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 25" to="360 50 25" dur="3s" repeatCount="indefinite" />
    </rect>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ca1d1cf4ac34a65bf503149a25632c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=518&s=221860&e=gif&f=110&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/ExMJJNy

  


上述代码中，矩形在 `3s` 秒内从初始状态（旋转角度为 `0`）逐渐旋转到 `360deg`，实现了一个旋转动画，并且设置了无限次重复。

  


再来看一个稍微复杂一点的效果，使用 `<animate>` 和 `<animateTransform>` 一起创建一个脉博动画效果：

  


```SVG
<svg width="400" height="400" viewBox="0 0 400 400" class="element">
    <circle class="pulse" cx="50%" cy="50%" r="30" stroke="black" stroke-width="4" fill="#ffffff" stroke-opacity="0">
        <animate attributeName="stroke-width" from="4" to="0" repeatCount="indefinite" begin="0s" dur="2s" />
        <animate attributeName="stroke-opacity" from="1" to="0" repeatCount="indefinite" begin="0s" dur="2s" />
        <animateTransform attributeName="transform" type="scale" from=".3" to="2" repeatCount="indefinite" begin="0s" dur="2s" />
    </circle>
    <circle cx="50%" cy="50%" r="30" stroke="black" stroke-width="4" stroke-opacity="1" fill="black"></circle>
</svg>
```

  


上面的代码中，使用 `<animateTransform>` 元素实现了一个缩放动画。让我们逐步解释这些属性的含义：

  


-   `attributeName="transform"`：指定要进行动画的属性是元素的变换属性。
-   `type="scale"`：指定进行的变换类型是缩放。
-   `from=".3"`：指定缩放动画的起始值，从原始大小的 `0.3` 倍开始。
-   `to="2"`：指定缩放动画的结束值，缩放到原始大小的 `2` 倍。
-   `repeatCount="indefinite"`：表示动画无限次重复。
-   `begin="0s"`：指定动画何时开始，这里是从动画开始就立即执行。
-   `dur="2s"`：指定动画的持续时间为 2 秒。

  


注意，需要使用 CSS 的 `transform-origin` 使圆围绕着圆心进行缩放:

  


```CSS
.pulse {
    transform-origin: 50% 50%;
}
```

  


你最终看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6a5a0ba58dd4551b39211042f2db835~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=508&s=101472&e=gif&f=69&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/dyrLLvV

  


## SVG 动画案例

  


通过前面的学习，我想你已经可以使用 SVG 动画元素创建出自己喜欢的动画效果了。即使是如此，我还是想再花一点时间向大家展示一些 SVG 动画案例。

  


### 渐变动画

  


在 SVG 中，我们可以使用 `<linearGradient>` 创建渐变效果，但这里我想向大家演示的是，如何为渐变添加动画效果：

  


```SVG
<svg width="500" height="200" viewBox="0 0 500 200" class="element">
    <defs>
        <linearGradient id="gradient">
            <stop offset="5%" stop-color="#FF6600" />
            <stop offset="95%" stop-color="#FFFFCC" />
        </linearGradient>
    </defs>
    <rect x="50" y="50" width="400" height="100" fill="url(#gradient)" />
</svg>
```

  


上面代码，我们使用 `<linearGradient>` 创建了一个 `#ff6600` 到 `ffffcc` 的线性渐变，并且将其当作矩形的背景。

  


假设你想对构建成渐变右端的淡黄色进行动画。为此，你需要在 `<stop>` 元素中插入一个 `<animate>` 元素。例如：

  


```SVG
<svg width="500" height="200" viewBox="0 0 500 200" class="element">
    <defs>
        <linearGradient id="gradient">
            <stop offset="5%" stop-color="#FF6600" />
            <stop offset="95%" stop-color="#FFFFCC">
                <animate attributeName="stop-color" begin="0s" dur="5s" from="#FFFFCC"
    to="#000066" repeatCount="indefinite" />
            </stop>
        </linearGradient>
    </defs>
    <rect x="50" y="50" width="400" height="100" fill="url(#gradient)" />
</svg>
```

  


第二个渐变色会从淡黄色 `#ffffcc` 到深蓝色 `#000066` 进行动画，整个过程会持续 `5s` ，而且动画会不断循环播放：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b82e3fe65326473f808de780af894fd0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=360&s=1717350&e=gif&f=101&b=340631)

  


如果你想要同时为渐变的两个颜色添加动画效果，只需要按照上面的方式给另一个 `<stop>` 元素添加动画效果：

  


```SVG
<svg width="500" height="200" viewBox="0 0 500 200" class="element">
    <defs>
        <linearGradient id="gradient">
            <stop offset="5%" stop-color="#FF6600">
                <animate attributeName="stop-color" begin="0s" dur="5s" from="#FF6600" to="#FFFFCC" repeatCount="indefinite" />
            </stop>
            <stop offset="95%" stop-color="#FFFFCC">
                <animate attributeName="stop-color" begin="0s" dur="5s" from="#FFFFCC"
    to="#FF6600" repeatCount="indefinite" />
            </stop>
        </linearGradient>
    </defs>
    <rect x="50" y="50" width="400" height="100" fill="url(#gradient)" />
</svg>
```

  


你会发现，上面的代码会动画化改变渐变的方向：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77113e9a899445f4a88f30f9a64d969a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=408&s=2341623&e=gif&f=197&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/jOJRRXE

  


### 滤镜动画

  


如果你并不喜欢上面这种渐变效果，那么你可以考虑使用 SVG 的滤镜，并且动画化滤镜。

  


```SVG
<svg width="500" height="400" viewBox="0 0 500 400" class="element">
    <defs>
        <!-- 给渐变添加动画 -->
        <linearGradient id="gradient">
            <stop offset="5%" stop-color="#FF6600">
                <animate attributeName="stop-color" begin="0s" dur="5s" from="#FF6600" to="#FFFFCC" repeatCount="indefinite" />
            </stop>
            <stop offset="95%" stop-color="#FFFFCC">
                <animate attributeName="stop-color" begin="0s" dur="5s" from="#FFFFCC" to="#FF6600" repeatCount="indefinite" />
            </stop>
        </linearGradient>
         
        <!-- 给滤镜添加动画 -->
        <filter id="Turbulence1" in="SourceImage" filterUnits="objectBoundingBox">
            <feTurbulence in="SourceAlpha" type="turbulence" baseFrequency="0.01" numOctaves="1" seed="0">
                <animate attributeName="baseFrequency" values="0.01; 0.008; 0.01; 0.012; 0.01" keyTimes="0; 0.25; 0.5; 0.75; 1" begin="0s" dur="5s" repeatCount="indefinite" />
            </feTurbulence>
        </filter>
    </defs>
    
    <rect x="0" y="0" width="500" height="400" fill="url(#gradient)" filter="url(#Turbulence1)" />
</svg>
```

  


你将看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/018a59afd10b47209ad57879c51805b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=574&s=13721912&e=gif&f=109&b=010101)

  


> Demo 地址：https://codepen.io/airen/full/xxBeNwY

  


继续开动大脑，使用相似的方法，你还可以创建类似于投射在一些字母上的探照灯的效果：

  


```SVG
<svg width="600" height="270" viewBox="0 0 600 270" class="element">
    <defs>
        <filter id="spot" x="-20%" y="-60%" width="150%" height="300%">
            <feDiffuseLighting in="SourceGraphic" lighting-color="red" result="lamp" diffuseConstant=".8" surfaceScale="10" resultScale=".2">
                <feSpotLight x="300" y="250" z="15" pointsAtX="0" pointsAtY="100" pointsAtZ="0" specularExponent="10">
                     <animate attributeName="pointsAtX" values="0;100;400;100;0" begin="0s" dur="8s" repeatCount="indefinite" />
                </feSpotLight>
                <animate attributeName="lighting-color" values="yellow;white;red;white;yellow;" begin="0s" dur="8s" repeatCount="indefinite"/>
            </feDiffuseLighting>
            <feComposite in="lamp" result="lamp" operator="arithmetic" k2="1" k3="1" />
        </filter>
    </defs>
    
    <text id="Spotlight" pointer-events="none" fill="white" stroke-width="4" stroke="white" filter="url(#spot)" x="10" y="150">SVG Animation!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29c3e58aeed1462698998ab98e150577~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=458&s=3928323&e=gif&f=136&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/rNRbgzp

  


发挥你的创意，你可以利用 SVG 滤镜创建更多引人注目的 SVG 动画效果。如果你从未接触过 SVG 滤镜，但又喜欢 SVG 滤镜带来的视觉效果，那么推荐你使用 [@yoksel_en](https://twitter.com/yoksel_en) 写的 [SVG Filters 工具](https://yoksel.github.io/svg-filters/#/)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/710678f1fbb34a53b13b66d51769c911~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=612&s=19939308&e=gif&f=604&b=f8f7f7)

  


> Demo 地址：https://yoksel.github.io/svg-filters/

  


### 形状变形的路径

  


在 SVG 中，我们还可以对 SVG `<path>` 元素的 `d` 属性进行动画处理。通过这种方式，你可以轻易地创建一个形状变形的动画效果。

  


`<path>` 元素的 `d` 属性包含定义所绘制形状轮廓的数据。路径数据包括一组命令和坐标，告诉浏览器在最终路径中绘制点、弧线和线段的位置和方式。

  


通过对该属性进行动画处理，我们可以对 SVG 路径进行形状变形，创造出形状过渡的效果。但是，为了能够实现形状变形，起始、结束和任何中间路径形状都需要具有相同数量的顶点（点），并且它们需要以相同的顺序出现。如果顶点数量不匹配，动画将无法正常工作。这是因为形状变化实际上是通过移动顶点并插值它们的位置来实现的。也就是说，如果形状缺少或不匹配一个顶点，路径将不再被插值。

  


例如，我们要创建一个 SVG 形状变形的动画，我们需要超过两个具有相同数量的点（或顶点）的 SVG ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/683a836683064316b34e00df6fbe0892~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=574&h=573&s=1242508&e=gif&f=500&b=ffffff)

  


注意，两个形状（即 `<path>`）不要删除或添加任意节点，否则动画将会出错。正如上图所示，基于相同数量和顺序的顶点，你可以获得两个或多个不同效果的形状：

  


```SVG
<!-- 形状一 -->
<svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 288 288">
    <linearGradient id="PSgrad_0" x1="70.711%" x2="0%" y1="70.711%" y2="0%">
        <stop offset="0%" stop-color="rgb(95,54,152)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(247,109,138)" stop-opacity="1" />
    </linearGradient>
    
    <path fill="url(#PSgrad_0)" d="M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z"/>
</svg> 

<!-- 形状二 -->
<svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 288 288">
    <linearGradient id="PSgrad_0" x1="70.711%" x2="0%" y1="70.711%" y2="0%">
        <stop offset="0%" stop-color="rgb(95,54,152)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(247,109,138)" stop-opacity="1" />
    </linearGradient>
    <path fill="url(#PSgrad_0)" d="M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4 c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6 c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8 C48.9,198.6,57.8,191,51,171.3z"/>
</svg>
```

  


这两个形状看起来像下图这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2716754df0b4a8885ccaa7f908f3a60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=801&s=329361&e=jpg&b=ffffff)

  


如果比较这两个 SVG，你会发现 `<path>` 元素的 `d` 属性的值有所差异，但 `d` 属性中的顶点数量和顺序都是相同的。要是我们把两个 `<svg>` 合并在一起，并且只有一个 `<path>` 元素，同时在 `<path>` 元素内嵌套一个 `<animate>` 元素。然后对 `<path>` 元素的 `d` 属性进行动画处理，并且设置动画持续时间为 `5s` ，整个动画无限次循环播放。

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" width="288" height="288" viewBox="0 0 288 288" class="element">
    <linearGradient id="PSgrad_0" x1="70.711%" x2="0%" y1="70.711%" y2="0%">
        <stop offset="0%" stop-color="rgb(95,54,152)" stop-opacity="1" />
        <stop offset="100%" stop-color="rgb(247,109,138)" stop-opacity="1" />
    </linearGradient>
    
    <path fill="url(#PSgrad_0)">
    <animate repeatCount="indefinite" attributeName="d" dur="5s" 
        values="
            M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z;
            M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4 c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6 c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8 C48.9,198.6,57.8,191,51,171.3z;
            M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z" />
    </path>
</svg>
```

  


请注意上面代码中 `<aniamte>` 元素的 `values` 属性的值，它是一个以分号分隔的列表值，列表值中的每个值对应的是 `d` 属性的值。就上面的代码，我们设置定义了三个形状的变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4e98a56a984416d959022bc5d23cd0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=452&s=988201&e=gif&f=73&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/rNRbXVa

  


上面示例我们所展示的只是三个不同形状之间的变形。你可以根据自己需要，创建更多不同的形状变形。例如 [@Felix Hornoiu 写的一个数字倒计时的变形效果](https://codepen.io/felixhornoiu/full/JjmVZw)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/189f5b58a5834506af7667f1315b13fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=658&s=900306&e=gif&f=189&b=ffffff)

  


> Demo 地址：https://codepen.io/felixhornoiu/full/JjmVZw （来源于 [@Felix Hornoiu](https://codepen.io/felixhornoiu/full/JjmVZw)）

  


### 粒子动画

  


你甚至还可以结合一些其他的特性构建更复杂的动画效果。比如，基于 `getPointAtLength()` 函数动态改变 `<path>` 的数据，从而创造出复杂的，酷炫的粒子动画效果。例如 [@Louis Hoebregts](https://codepen.io/Mamboleoo) 在 CodePen 提供的两个案例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc63bccd157b4d66a654991b6028c242~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1662&h=790&s=18282383&e=gif&f=171&b=ffffff)

  


> Demo 地址：https://codepen.io/Mamboleoo/full/ZEXMjmm

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2d24b1f3faf45a287d4e54e9ec4c775~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1552&h=772&s=2468036&e=gif&f=187&b=ffffff)

  


> Demo 地址：https://codepen.io/Mamboleoo/full/NWaogXW

  


在此基础上，你只需要稍微调整一下，就可以将上面这些酷炫的动画效果添加到你的 Web 组件或界面中，从而创建出引人注目和吸引用户注意力的视觉效果。甚至可以给你的交互添加与众不同的动画效果。

  


### 给 SVG 插图添加动画效果

  


很多时候，我们在 Web 上应用的 SVG 都是从第三方库或工具中获取的。通常情况下，我们获得的 SVG 都是静态的。例如，我们在 [unDraw](https://undraw.co/illustrations) 平台上获得的插图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b55550d9abab40999b80b1beec3ff64e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=897&h=936&s=31434&e=png&b=fefefe)

  


现在，我们可以使用上面所学到的知识，给插图添加一些动画效果。

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="657.03596" height="776.13897" viewBox="0 0 657.03596 776.13897" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path id="line1" data-name="Path 2548" d="M319.381,207.34151a4.98,4.98,0,0,1-3.286-1.233l-42.939-37.481a5,5,0,0,1,6.576-7.533l42.939,37.481a5,5,0,0,1-3.29,8.767Z" transform="translate(-271.48202 -61.93052)" fill="#e4e4e4" fill-opacity="0">
        <animate attributeName="fill" from="#e4e4e4" to="#FFEB3B" dur=".5s" begin="0s" fill="freeze" />
        <animate attributeName="fill-opacity" from="0" to="1" dur=".5s" begin="0s" fill="freeze" id="anim1" />
    </path>
    <path id="line2" data-name="Path 2553" d="M451.981,157.43052a5,5,0,0,1-5-5v-85.5a5,5,0,0,1,10,0v85.5A5,5,0,0,1,451.981,157.43052Z" transform="translate(-271.48202 -61.93052)" fill="#e4e4e4" fill-opacity="0">
        <animate attributeName="fill" from="#e4e4e4" to="#FFEB3B" dur=".5s" begin="anim1.end" fill="freeze" />
        <animate attributeName="fill-opacity" from="0" to="1" dur=".5s" begin="anim1.end" fill="freeze" id="anim2" />
    </path>
  
    <path id="line3" data-name="Path 2549" d="M577.45905,207.34151a5,5,0,0,1-3.29-8.767l42.93792-37.484a5,5,0,0,1,6.576,7.533l-42.939,37.481A4.98,4.98,0,0,1,577.45905,207.34151Z" transform="translate(-271.48202 -61.93052)" fill="#e4e4e4" fill-opacity="0">
        <animate attributeName="fill" from="#e4e4e4" to="#FFEB3B" dur=".5s" begin="anim2.end" fill="freeze"  />
        <animate attributeName="fill-opacity" from="0" to="1" dur=".5s" begin="anim2.end" fill="freeze" id="anim3" />
    </path>
  
    <path d="M916.98312,822.59834a50.79382,50.79382,0,0,1-13.58984,12.63c-1.12012.71-2.27,1.38-3.43994,2H872.42355c.32959-.66.64991-1.33.96-2a95.35446,95.35446,0,0,0-19.84034-109.34c16.64014,5.14,32.02,15.16,42.08008,29.37006a64.46956,64.46956,0,0,1,10.23,23,96.27571,96.27571,0,0,0-7.66992-48.41c13.50977,10.99,24.03027,26.04,28.04,42.98C930.23312,789.77833,927.32346,808.58833,916.98312,822.59834Z" transform="translate(-271.48202 -61.93052)" fill="#f0f0f0" />
    <path id="b35682e1-9f03-403a-b8b0-c3d37d0d1380-2562" data-name="Path 2533" d="M928.136,838.06948H670.398v-2.106h258.12Z" transform="translate(-271.48202 -61.93052)" fill="#3f3d56" />
    <path d="M580.23,325.2c0,38.64-13.5,71.63-39.19,96.18-18.23,17.43-46.31,41.86-46.31,67.69v21.37h-85.5V489.07c0-26.1-28.19-50.58-46.31-67.69-25.11-23.69-39.19-58.92-39.19-96.18v-.79a128.25061,128.25061,0,0,1,256.5.79Z" transform="translate(-271.48202 -61.93052)" fill="#6c63ff" />
    <path id="ecc2cf6c-8ee8-498c-972d-3c77e28b77e9-2563" data-name="Path 2546" d="M494.729,513.44052a3,3,0,0,1-3-3v-21.374c0-25.125,24.779-48.58,42.873-65.706,1.5-1.422,2.961-2.8,4.363-4.145,25.029-23.928,38.259-56.437,38.259-94.014,0-70.229-55.013-125.243-125.242-125.243h-.354A125.03,125.03,0,0,0,326.739,324.49652v.7c0,36.8,13.939,71.063,38.245,94.007,1.231,1.163,2.51,2.36,3.823,3.589,18.327,17.159,43.427,40.658,43.427,66.275v21.373a3,3,0,0,1-6,0v-21.374c0-23.015-24-45.486-41.528-61.9q-1.9785-1.851-3.841-3.605c-25.5-24.072-40.126-59.924-40.126-98.364v-.72c.2-72.045,58.885-130.523,130.88-130.523h.371A130.557,130.557,0,0,1,583.22407,323.83091q.00357.68526-.00006,1.3706c0,39.255-13.871,73.264-40.112,98.351-1.409,1.347-2.876,2.736-4.386,4.165-17.3,16.377-41,38.806-41,61.349v21.374a3,3,0,0,1-3,3Z" transform="translate(-271.48202 -61.93052)" fill="#3f3d56" />
    <path id="b22bef41-3cd7-4c1e-881c-c9a642005cb0-2564" data-name="Path 2547" d="M480.481,551.93552h-57a5,5,0,1,1,0-10h57a5,5,0,0,1,0,10Z" transform="translate(-271.48202 -61.93052)" fill="#6c63ff" />
    <path d="M458.10991,585.43538H445.84282a23.44664,23.44664,0,0,1-12.09412-3.35059,2.79354,2.79354,0,0,1-1.26831-3.21435,2.8865,2.8865,0,0,1,2.80164-2.14209h33.38891a2.88664,2.88664,0,0,1,2.80176,2.14209,2.79336,2.79336,0,0,1-1.26856,3.21435A23.44509,23.44509,0,0,1,458.10991,585.43538Z" transform="translate(-271.48202 -61.93052)" fill="#3f3d56" />
    <path d="M480.49077,567.72932l-57.33814-.00634-.17761-.38086a4.726,4.726,0,0,1,.89978-4.05811,4.85563,4.85563,0,0,1,3.82288-1.84863h48.55773a4.855,4.855,0,0,1,3.82325,1.84912,4.698,4.698,0,0,1,.91089,4.00732l-.09009.38623Z" transform="translate(-271.48202 -61.93052)" fill="#3f3d56" />
    <path id="a74da646-4683-465e-97fe-dd817e7fc328-2567" data-name="Path 2550" d="M494.729,534.19052h-85.5a5,5,0,0,1,0-10h85.5a5,5,0,0,1,0,10Z" transform="translate(-271.48202 -61.93052)" fill="#6c63ff" />
  
    <path d="M449.88,403.57,432.1,510.44H421.95l18.06-108.51a5.00266,5.00266,0,0,1,9.87,1.64Z" transform="translate(-271.48202 -61.93052)" fill="#e6e6e6" >
        <animate attributeName="fill" from="#e4e4e4" to="red" dur="1s" begin="0s" fill="freeze" repeatCount="indefinite" />
    </path>
    <path d="M484.05,510.44H473.9L456.12,403.57a5.00266,5.00266,0,0,1,9.87-1.64Z" transform="translate(-271.48202 -61.93052)" fill="#e6e6e6" >
        <animate attributeName="fill" from="#e4e4e4" to="red" dur="1s" begin="0s" fill="freeze" repeatCount="indefinite" />
    </path>
    <path id="line4" data-name="Path 2551" d="M419.48452,400a5,5,0,0,1,5-5h54.993a5,5,0,0,1,0,10h-54.993A5,5,0,0,1,419.48452,400Z" transform="translate(-271.48202 -61.93052)" fill="#e6e6e6" >
        <animate attributeName="fill" from="#e4e4e4" to="red" dur="1s" begin="0s" fill="freeze" repeatCount="indefinite" />
    </path>
  
    <path id="eba1f826-879a-4c25-b118-6bb025be95d0-2570" data-name="Path 2559" d="M860.701,824.07953H848.443l-5.832-47.288h18.092Z" transform="translate(-271.48202 -61.93052)" fill="#feb8b8" />
    <path id="f6694a1b-3521-46e6-aa9c-51f4297aac52-2571" data-name="Path 2560" d="M863.82805,835.96354H824.297v-.5a15.387,15.387,0,0,1,15.385-15.386h24.146Z" transform="translate(-271.48202 -61.93052)" fill="#2f2e41" />
    <path id="fae71c2d-33fb-45f7-8331-19b4de5eddc8-2572" data-name="Path 2561" d="M767.564,823.67553l-11.844-3.167,6.58-47.19,17.48,4.674Z" transform="translate(-271.48202 -61.93052)" fill="#feb8b8" />
    <path id="b3b10fd6-5fa4-49f3-8270-96ad6a3a1e0e-2573" data-name="Path 2562" d="M767.515,835.96354l-38.189-10.212.129-.483a15.387,15.387,0,0,1,18.839-10.89h0l23.325,6.237Z" transform="translate(-271.48202 -61.93052)" fill="#2f2e41" />
    <path id="f6267da0-acb1-421a-9dac-5a6151c1f955-2574" data-name="Path 2563" d="M867.754,559.06753l10.269,11.931-13.28,242.442h-28.369l-14.3-186.551-44.349,191.554-29.492-7.233,26.816-243.3Z" transform="translate(-271.48202 -61.93052)" fill="#2f2e41" />
    <path id="ea0dabd6-18d7-4484-8048-4cddc34702bd-2575" data-name="Path 2564" d="M781.905,402.54252l28.246-14.172,43.437.764,37.38,19.127L869.7,514.4795l9.187,55.38h0a226.53255,226.53255,0,0,1-108.335.892l-.284-.068s21.114-74.916,12.126-97.779Z" transform="translate(-271.48202 -61.93052)" fill="#e6e6e6" />
    <path id="a75b604a-8411-40e9-b5d3-81fba8b6e00c-2576" data-name="Path 2565" d="M863.621,345.93452a31.994,31.994,0,1,0,0,.237Z" transform="translate(-271.48202 -61.93052)" fill="#feb8b8" />
    <path id="b97e8772-edf1-4d51-bb40-aaab108bf113-2577" data-name="Path 2567" d="M778.007,479.9835a11.462,11.462,0,0,0,16.65,5.627l57.353,30.318,1.857-13.971-55.73-32.863a11.524,11.524,0,0,0-20.131,10.889Z" transform="translate(-271.48202 -61.93052)" fill="#feb8b8" />
    <path id="b7638692-4395-4c34-bc33-e4b41c888504-2578" data-name="Path 2568" d="M854.436,482.39851a11.462,11.462,0,0,1-17.478,1.848l-62.6,17.035.545-17.738,62.27106-16.173a11.524,11.524,0,0,1,17.261,15.03Z" transform="translate(-271.48202 -61.93052)" fill="#feb8b8" />
    <path id="fb7d8996-2760-43c1-a9a4-d402d6d3756c-2579" data-name="Path 2569" d="M878.762,409.0305l12.205-.765s14.29,18.855,6.364,39.316c0,0,1.373,73.5-30.276,70.48s-41.65-3.019-41.65-3.019l9.5-26.5,21.253-6.562s-6.55-28.894,5.849-40.916Z" transform="translate(-271.48202 -61.93052)" fill="#e6e6e6" />
    <path id="a9eb06d8-8cbf-43ab-991d-4f9eccd60edd-2580" data-name="Path 2570" d="M790.63005,408.38551l-1.725-8.843s-25.44-.6-30.47,37.951c0,0-22.877,57.692-.454,65.121s47.089,0,47.089,0l-1.85711-25.444-24.67-5.033s12.745-16.489,5.805-30.792Z" transform="translate(-271.48202 -61.93052)" fill="#e6e6e6" />
    <path id="ba7ab43e-494b-455d-a87f-0e0f24cb0a47-2581" data-name="Path 2387" d="M842.70445,361.6451c-2.35273-.92321-4.95894-.87527-7.44567-1.33105-8.89342-1.63849-15.75239-10.70648-14.90781-19.70962a10.84778,10.84778,0,0,0,.05763-3.5329c-.61621-2.569-3.47169-3.94789-6.09484-4.25558s-5.33331.086-7.885-.59694c-3.93954-1.05505-6.883-4.64835-7.88062-8.603a19.487,19.487,0,0,1,1.267-11.96329l1.22416,2.55209a9.91759,9.91759,0,0,0,2.5062-4.85275,6.25462,6.25462,0,0,1,5.16622,3.27253c1.58106.70614,1.388-2.90614,2.96395-3.621a2.95887,2.95887,0,0,1,2.10019.27339c3.47269,1.16515,7.156-.583,10.59739-1.83576a40.41732,40.41732,0,0,1,18.64164-2.13018c4.18269.51056,8.40506,1.74686,11.66025,4.41951a26.60667,26.60667,0,0,1,6.156,8.27393c4.017,7.50846,7.04316,15.79159,6.96075,24.30956a35.29808,35.29808,0,0,1-6.1645,19.5192c-2.052,2.98581-8.67978,13.34292-13.08484,12.20287C843.00869,372.607,849.32934,364.24347,842.70445,361.6451Z" transform="translate(-271.48202 -61.93052)" fill="#2f2e41" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1182862d5e047c08eac50dcf3c7c5ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=808&s=968779&e=gif&f=183&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/zYbXgEK

  


这种思路创建的动画效果非常适用于一些插图的页面，比如 404 页面：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10b08007bbd348cc9b2a418033c2c9e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1200&s=250343&e=gif&f=229&b=7979f9)

  


## 小结

  


SMIL 有很大的潜力，我们这节课只是触及了其表面，只涉及了它们在 SVG 中的基础和技术性方面。但这些知识足够你创建出许多令人印象深刻的动画效果，尤其是涉及到形状变形和滤镜的效果。技术是有限的，创意是无限的，最终的效果不是局限于技术，而是创意。

  


虽然花了很长的篇幅与大家一起探讨了 SMIL 动画，但我还是想在课程的末尾强调一下。

  


SMIL 是 SVG 动画的规范，因为它为高性能的 SVG 动画渲染提供了许多强大的功能。不幸运的是，对于 Webkit 来说，对 SMIL 的支持逐渐减弱，并且 Microsoft 的 IE 或 Edge 浏览器从未支持过 SMIL，而且可能永远不会支持。不用担心，我们有解决方案，我们可以使用 CSS 和 WAAPI 找到相应的替代方案，而且能更好的实现相同的动画效果。

  


简而言之，你可以花时间去了解和学习 SMIL，但我并不希望你深入去了解，因为它很有可能会像 Flash 技术一样，成为历史，而且当下有很多更好的技术可以替代它。在下一节课，我将与大家一起探讨带有 CSS 的 SVG 动画。随着进一步的学习，你会发现，这节课中提到的动画效果，其实使用 CSS 或 WAAPI 可能更好的实现，甚至能更好的控制。