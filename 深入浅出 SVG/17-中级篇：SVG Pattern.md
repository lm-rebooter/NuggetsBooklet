![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69274969a1f2440e8a9d5b2bd24af6b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1900&h=704&s=291005&e=jpg&b=ff7fb6)

  


如今，图案无处不在。它们经常出现在精美的包装上，各种精彩的出版物封面上，甚至是漂亮的布料上。在 Web 设计中，图案是一种引人注目的设计元素，也是 Web 网站设计中非常有用的资源。通过使用仅有几 KB 的小图像，我们可以为网站背景增添活力。重复的图形是响应式设计的一个好策略，因为它完美地适应了所有屏幕分辨率。图案在水平和垂直方向上可以无限重复，我们可以尝试使用各种形状和颜色、位图或矢量图以及不同的样式。

  


在创建各种图案的过程中，SVG Pattern 和 CSS Pattern 是两种常见的方式。就像 CSS Pattern 可以为 Web 元素添加背景纹理和图案一样，SVG Pattern 也可以为 SVG 图像添加各式各样的图案效果。SVG Pattern 可以创建更丰富、更复杂的图案，包括条纹、格子、波纹和纹理等。与 CSS Pattern 相比，SVG Pattern 的灵活性和可定制性更高，能够创建更多样化的图案效果。

  


与 CSS Pattern 相似，SVG Pattern 也可以通过调整参数和属性来实现各种不同的图案效果。但与 CSS Pattern 不同的是，SVG Pattern 可以结合使用 SVG 的强大功能，如形状、路径和滤镜，从而创造出更加复杂和生动的图案效果。

  


无论你是想为 Web 添加一些独特的图案元素，还是为了实现特定的视觉效果，SVG Pattern 都是一个非常强大的工具。在这节课中，我们将深入探讨 SVG Pattern 的各种用法和技巧，带你领略 SVG 图案的无限魅力，并教你如何利用它们为你的 Web 设计增添个性和视觉吸引力。让我们一起开始这段充满创造力和想象力的旅程吧！

  


> 注意，Pattern 通常有多种不同的称呼，例如模式、图案和纹理。我个人常称它为“图案”。同时 CSS Pattern 和 SVG Pattern 分别是使用 CSS 和 SVG 是创建图像的两种不同技术。因此，CSS Pattern 和 SVG Pattern 也称被称为“CSS 图案”和“SVG 图案”。

  


## 回顾一下 CSS Pattern

  


CSS Pattern 是指使用 CSS 技术来创建各种图案和纹理效果的方法。这些图案可以用作元素的背景（`background-image`）、边框（`border-image`）或装饰性元素，为 Web 页面增添美感和视觉吸引力。CSS Pattern 的创建方式通常涉及到利用 CSS 属性和伪类来实现各种图案效果，例如使用线性渐变（`linear-gradient`）、径向渐变（`radial-gradient`）、圆锥渐变（`conic-gradient`）以及相应的重复性渐变（`repeating-*-gradient`，这里的 `*` 可以是 `linear` 、`radial` 和 `conic` 中的任何一个）等。与传统的背景图像相比，CSS Pattern 具有许多优势，例如文件大小更小、加载速度更快、可调整性更强等。同时， CSS Pattern 也更灵活，可以通过调整参数来快速修改图案的样式和布局，使得 Web 开发者能够更加轻松地实现他们的创意想法。

  


CSS Pattern 是 Web 设计中常用的技术之一，它为 Web 开发者提供了丰富的图案选择和创作的可能性，为 Web 设计注入了更多的个性和创意。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6644b9243fa04136855cb374ffc6603b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1846&h=945&s=483963&e=jpg&b=e4decf)

  


> Demo: https://codepen.io/poulamic/full/MWyGvjd

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/444566f7ccbc4e0f945eb180d7e6408f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3474&h=2292&s=1021010&e=png&b=ece6e4)

  


> Demo 地址：https://css-pattern.com/ （带动画效果的版本：https://animated.css-pattern.com/）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/789c7ff99eaf49c7998bcb81eb05ee20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2540&h=1505&s=1582847&e=png&b=e2e9ef)

  


> Demo 地址：https://projects.verou.me/css3patterns/

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/870c824b39634c0f9ef9d8b62e5eb411~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3038&h=1548&s=1850365&e=jpg&b=902b64)

  


> Demo 地址：https://codepen.io/thebabydino/full/NWxBzRv （https://codepen.io/thebabydino/full/GRRpzNX）

  


我们来看一个简单的效果：

  


```CSS
body {
    background-image: 
        radial-gradient(black 3px, transparent 4px),
        radial-gradient(black 3px, transparent 4px),
        linear-gradient(#fff 4px, transparent 0),
        linear-gradient(45deg, transparent 74px, transparent 75px, #a4a4a4 75px, #a4a4a4 76px, transparent 77px, transparent 109px),
        linear-gradient(-45deg, transparent 75px, transparent 76px, #a4a4a4 76px, #a4a4a4 77px, transparent 78px, transparent 109px);
  
    background-repeat: repeat;
    background-size: 109px 109px, 109px 109px,100% 6px, 109px 109px, 109px 109px;
    background-position: 54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px;
}
```

  


> Demo 地址：https://codepen.io/airen/full/abxYmNQ

  


在此基础上，[还可以结合 CSS 处理图像特效相关的特性](https://juejin.cn/book/7223230325122400288/section/7259669043622690853)，例如滤镜 `filter` 、混合模式 `background-blend-mode` 给图案添加特效，从而创建出一个新的图案效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5fd0e69266f4e58bf1f5cc88bf2b366~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=486&s=3050832&e=gif&f=374&b=fdfdfd)

  


正如你所看到的，虽然 CSS Pattern 在一些简单的图案效果上表现不错，并且易于实现和调整，但对于复杂或高度定制的图案需求，CSS 实现可能会变得笨拙和不灵活。就这一点而言，SVG Pattern 往往更具优势。

  


SVG Pattern 提供了更多的灵活性、功能和性能，能够实现更丰富、更复杂的图案效果，同时具有更好的浏览器兼容性和性能表现。

  


## SVG Pattern 简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/084bf18f02d847c491dd4c58d11eccb1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3028&h=1872&s=513238&e=webp&b=b38f70)

  


我想大家对上图应该不会有任何的陌生感。接下来，让我们以“砌砖模式”（砖块图案）为例，简单介绍一下 SVG Pattern（SVG 图案）。

  


“砖块图案”是一种常见的图案设计，仿效砖墙排列方式（即砌砖的模式），你可能在很多地方都见过它：每一行砖块都向下偏移了半个砖块的长度，形成一种交错重复的效果。这种排列方式非常简单易懂，因此使用 SVG 的 `<pattern>` 元素来复制这种效果非常合适。

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern" width="220" height="80" patternUnits="userSpaceOnUse">
            <path d="m0 77h218V40H0V36h109V0h3v36h109V0H0" />
        </pattern>
        <filter id="filter">
            <feDropShadow dx="0" dy="0" result="s" />
            <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="9" />
            <feComposite in="s" operator="arithmetic" k2=".7" k3=".35" />
            <feDiffuseLighting lighting-color="#f84" surfaceScale="9">
                <feDistantLight azimuth="225" elevation="9" />
            </feDiffuseLighting>
        </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#pattern)" filter="url(#filter)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/982d1493b41f4637a11d8c7b72bab167~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=3446123&e=jpg&b=77360b)

  


> Demo 地址：https://codepen.io/airen/full/XWQEjYO

  


SVG Pattern 通过预定义的图形对象来创建，可以在水平和垂直方向上以固定的间隔进行复制，从而形成图案的填充效果。我们首先要做的是定义砖块的尺寸和砖块之间的间隙。为了方便起见，我们使用整数尺寸：假设砖块的宽度为 `100` ，高度为 `30` ，砖块之间的水平和垂直间隙为 `10` 。

  


接下来，我们需要确定图案的“基本”图案瓷砖。这里的“瓷砖”指的是图案瓷砖，而不是真实的建筑材料。我们使用下图中突出显示的部分作为我们的基本图案瓷砖：第一排有两块完整的砖，第二排有一块完整的砖夹在两块半砖之间。需要注意的是，间隙的位置和大小也需要考虑在内：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33bc2f6beb9e4e40b3ba489ac24e5f37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=3456873&e=jpg&b=77360b)

  


在使用 `<pattern>` 元素时，我们需要定义图案瓷砖的宽度和高度，这些尺寸对应于基本图案瓷砖的尺寸。为了确定这些尺寸，我们需要进行一些简单的数学计算。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfce7833378a40458874066c8785a32d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=3495267&e=jpg&b=77360b)

  


现在，我们已经定义好了图案瓷砖的尺寸（`220 x 80`），并使用了 `<pattern>` 元素来描述它。我们可以将这个图案瓷砖用作其他元素（例如 `<rect>` ）的填充，并在 SVG 图像中创建出与砖块相似的图案效果。

  


```XML
<svg>
    <defs>
        <pattern id="pattern" width="220" height="80" patternUnits="userSpaceOnUse">
            <path d="m0 77h218V40H0V36h109V0h3v36h109V0H0" />
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pattern)" filter="url(#filter)" />
</svg>
```

  


总之，SVG 图案是一种方便灵活的方式，可以在 SVG 图像中创建出各种各样的图案效果，从简单的砖块排列到复杂的纹理图案，都可以通过 SVG 的 `<pattern>` 元素轻松实现。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb4e0a93cc93403fb0c3fd7267544900~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1496&h=884&s=20699996&e=gif&f=103&b=ccd30b)

  


> Demo 地址：https://philiprogers.com/svgpatterns/

  


[这其实就是W3C规范里说的SVG Pattern](https://www.w3.org/TR/SVG2/pservers.html#Patterns)：图案就是用来给一个形状填充或描边的，用的是预先定义好的图形，这些图形可以在横向和纵向以一定的间距重复出现，就像铺瓷砖一样，覆盖整个需要画的区域。图案是用 `<pattern>` 元素定义的，然后通过在形状元素上设置 `fill` 或 `stroke` 属性来使用这个图案。

  


## 理解“图案瓷砖”

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0af79484169a42b59ff54f8fd1b7e83e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1500&h=844&s=130797&e=jpg&b=f4f0eb)

  


在 SVG Pattern 中，图案瓷砖是构成整个图案的基本单元，类似于铺设瓷砖时使用的瓷砖块。然而，在 SVG 中，它不是实际的物理单元，而是一个虚拟的图形单元。

  


当你能够看到一个重复的图案并辨认出图案瓷砖时，你很快就会明白是如何构建的。更重要的是，当你构建自己的图案时遇到问题时，识别图案瓷砖的能力将帮助你找出问题所在。通常情况下，我们可以按照下面的步骤来识别图案瓷砖：

  


-   ①识别重复特征：首先要识别图案设计中重复出现的特征。寻找在整个图案中多次出现的元素、形状或图案
-   ②标记独特点：选择一个重复特征上的独特点并标记它。这个点将作为识别图案瓷砖的参考点
-   ③水平移动：从标记点水平移动，找到同一特征在同一点的下一个实例。同样标记这个点
-   ④垂直移动：从两个标记点垂直移动，以在垂直轴上定位相同特征的相同实例。同样标记这些点

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/479c743aba144ff8b2a12af496a3e973~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=3426472&e=jpg&b=77360b)

  


在复杂图案中找到图案瓷砖可能会更具挑战性。在大多数情况下，你将在第一次尝试时标记形成矩形的四个点，并定位图案瓷砖。然而，具有大型瓷砖或瓷砖内重复元素的复杂图案会使这项工作更具挑战性。在这种情况下，你可能需要扩展点的边界或选择不同的特征，并重试。此外，图案瓷砖可能会旋转，因此你可能需要相应地调整并以角度移动，而不是水平和垂直移动。

  


一旦你能够识别图案中的矩形瓷砖，你就可以学习如何创建自己的瓷砖了。将任何形状放置在图案瓷砖的边界内，它将以图案形式进行重复。但是，当你将相同的元素放置在穿越图案瓷砖边界的位置时，元素将在图案中出现裁剪。要防止这种裁剪，你需要在相反的边界上克隆相同的元素。如果边界位于角上，将元素克隆到所有其他瓷砖角上。

  


为了确保克隆体完美对齐，你需要进行简单的数学计算。处理左右边界时，你将根据瓷砖的宽度添加或减去 `X` 坐标，并保持相同的 `Y` 坐标。对于顶部和底部计算，请使用高度。对于角边界，请使用宽度和高度的组合。

  


换句话说，在 SVG 中，我们是通过 `<pattern>` 元素来定义“图案瓷砖”的，并且它的 `x` 、`y` 、`width` 、`height` 和 `patternUnits` 定义了图案瓷砖大小和位置（它是画布上某处的参考矩形），图案瓷砖（参考矩形）的左上角位于 `(x,y)` ，右下角位于 `(x + width, y + height)` 。理论上，平铺将 `X` 和 `Y` 方向上无限延伸一系列这样的矩形（图案瓷砖），包括正数和负数，每个可能的整数值 `m` 和 `n` 都以 `(x + m × width, y + n × height)` 为起点。

  


这也意味着，在创建 SVG 图案时，理解和设计好图案瓷砖是非常重要的。一个好的图案瓷砖设计可以确保图案的整体外观和重复效果符合预期，同时也能提高图案的可重用性和灵活性。

  


## SVG Pattern 基础应用

  


在很多方面，SVG 中的 `<pattern>` 元素的使用方式与之前我们介绍的 `<linearGradient> 和 <radialGradient>（渐变元素）`非常相似。 `<pattern>` 元素定义了所谓的“图案瓷砖”，它是图案中的最小单元，也是重复的单元。在 `<pattern>` 元素内部，你可以包含之前介绍过的[任何基本形状](https://juejin.cn/book/7341630791099383835/section/7345813971552698406)，而且每个形状都可以使用之前学到的[任何样式](https://juejin.cn/book/7341630791099383835/section/7349188496181887017)，包括[渐变](https://juejin.cn/book/7341630791099383835/section/7354948936039137289)和不透明度。

  


与渐变类似，`<pattern>` 相关的信息应该放置在 SVG 的 `<defs>` 元素中。每个“图案瓷砖”都有一个唯一的 `id` 标识符，然后你可以使用 `url(#idName)` 将定义好的图案应用到 SVG 图形元素的 `fill` 或 `stroke` 属性中。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c5c9a604e1d412dac734a6412f14863~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2493&h=1532&s=694767&e=jpg&b=050505)

  


除此之外，`<pattern>` 上的属性也与渐变元素上的属性非常相似：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c99ec7e4edc54ae881fc5e8054453ec3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5308&h=2188&s=462781&e=png&b=ffffff)

  


通过设置这些属性，可以灵活地定义和控制 SVG 的“图案瓷砖”，从而创建出各种各样的图案效果：

  


-   `id` ：定义图案瓷砖的唯一标识符，以便其他图形元素的 `fill` 和 `stroke` 可以引用该图案
-   `x` 和 `y` ：定义图案瓷砖的起始位置（通常上图案瓷砖的左上角）在 SVG 坐标系中的位置
-   `width` 和 `height` ：定义图案瓷砖的尺寸，即图案瓷砖的宽度（`width`）和高度（`height`）
-   `patternUnits` ：定义 `<pattern>` 元素中各个属性（如 `x` 、`y` 、`width` 和 `height` ）的单位，它有 `userSpaceOnUse` （用户坐标系）和 `objectBoundingBox` （对象边界框坐标系）
-   `patternContentUnits` ：定义 `<pattern>` 元素内部图案内容的单位，与 `patternUnits` 相似，也有 `userSpaceOnUse` 和 `objectBoundingBox` 两个值可选
-   `patternTransform` ：定义应用于图案瓷砖的变换矩阵，如平移（`translate`）、旋转（`rotate`）、缩放（`scale`）和倾斜（`skew`）等
-   `viewBox` ：定义图案瓷砖的可见区域。它是一个矩形区域，用于指定 `<pattern>` 元素内部的图案内容应如何显示和缩放
-   `preserveAspectRatio` ：定义了如何对图案瓷砖的内容进行缩放和定位，以适应 `<pattern>` 元素的 `viewBox` 。

  


如果说，`<linearGradient>` 和 `<radialGradient>` 上的属性与 `<line>` 和 `<circle>` 的属性相匹配；那么 `<pattern>` 上的几何属性（`x` 、`y` 、 `width` 和 `height` ）类似于 `<rect>` 或 `<image>` 。默认情况下，所有这些属性均为 `0` ，通常情况下，`width` 或 `height` 为 `0` 时会阻止内容被绘制出来。

  


我们通过一个简单的实例，来了解 SVG Pattern 最基础的使用。

  


首先，像创建渐变一样，将 `<pattern>` 元素放置在 `<defs>` 元素内，并且使用 `id` 给图案瓷砖指定唯一标识符：

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern">
            <!-- 定义图案瓷砖的内容放置在这里 -->
        </pattern>
    </defs>
</svg>
```

  


如果你需要改变图案瓷砖在画布中的起始位置，则需要在 `<pattern>` 元素上设置 `x` 和 `y` 的值；如果未设置，图案瓷砖在画布中的起始位置是 `(0,0)` 位置，因为它们的默认值为 `0` 。在这个示例中，不对瓷砖的起始位置进行调整：

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern" x="0" y="0">
            <!-- 定义图案瓷砖的内容放置在这里 -->
        </pattern>
    </defs>
</svg>
```

  


前面提到过，`width` 和 `height` 是定义图案瓷砖大小的，而且它们的默认值为 `0` 。因此，在定义图案瓷砖时，需要显式给 `<pattern>` 元素设置 `width` 和 `height` 的值，否则它们两者中任一值为 `0` 时，都会阻止图案瓷砖的内容显示。

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern" x="0" y="0" width="100" height="100">
            <!-- 定义图案瓷砖的内容放置在这里 -->
        </pattern>
    </defs>
</svg>
```

  


现在我们创建了一个 `100 × 100` 的图案瓷砖。到目前为止，它是一个空的图案瓷砖，因为 `<pattern>` 元素内还没有任何内容。

  


注意，在 `<pattern>` 元素内，可以放置任何基本图形。接下来，我们在 `<pattern>` 内放置一个圆：

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern" x="0" y="0" width="100" height="100">
            <circle cx="50" cy="50" r="50" />
        </pattern>
    </defs>
</svg>
```

  


就这么简单，我们现在已经创建了一个简单的图案。现在，你就可以在其他的图形元素中引用这个图案：

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern" x="0" y="0" width="100" height="100">
            <circle cx="50" cy="50" r="50" />
        </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a33e79d6bc34e2fa8504dd51f17e138~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=93712&e=jpg&b=fefefe)

这似乎并不是我们所期望的效果。这是为什么呢？

  


简单地说，默认情况下，`<pattern>` 的 `patternUnits` 属性的值是 `objectBoundingBox` ，这意味着它采用的是图形对象边界框坐标系，是基于百分比的，这很尴尬，因为图案会变形以适应容器。相反，要是将 `patternUnits` 属性的值设置为 `userSpaceOnUse` ，表示图案采用的是用户坐标系，这个坐标系统在容器固定（基于像素）或流体（基于百分比）时表现一致。这与使用默认的 `viewBox` 坐标系统没有区别。

  


换句话说，在 `<pattern>` 元素上显式设置 `patternUnits` 属性的值为 `userSpaceOnUse` ，你会看到一个黑色的圆圈将会沿着 `x` 轴（水平方向）和 `y` 轴（垂直方向）重复平铺，并且会填充整个矩形：

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="50" />
        </pattern>
    </defs>
    <rect fill="url(#pattern)" width="100%" height="100%" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3e89f702b40441cb9ced449d5d17f06~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=362503&e=jpg&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/NWmYwEx

  


这是一个最简单的图案效果，你也可以继续在 `<pattern>` 添加更多的内容，构建一个更复杂的图案：

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle fill="#f90ace" cx="50" cy="50" r="25" />
            <g fill="orange">
                <circle r="25" /><!-- 左上角 -->
                <circle cx="100" r="25" /><!-- 右上角 -->
                <circle cy="100" r="25" /><!-- 左下角 -->
                <circle cx="100" cy="100" r="25" /><!-- 右下角 -->
            </g>
        </pattern>
    </defs>
    <rect fill="url(#pattern)" width="100%" height="100%" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/799bb8c8161e4369a962d43b00ea3546~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=941342&e=jpg&b=fdfafa)

  


> Demo 地址：https://codepen.io/airen/full/wvZmPLM

  


## SVG Pattern 工作原理

  


现在，我们知道了如何使用 `<pattern>` 元素定义可重复使用的图案（“图案瓷砖”），并将其应用于图形元素的填充（`fill`）或描边（`stroke`）。不过，如果想使用 `<pattern>` 创建各种复杂的图案效果，那么就得需要理解 SVG Pattern 的工作原理。它的工作原理如下：

  


-   定义图案瓷砖（Pattern Tile）：首先，我们定义一个图案瓷砖，它是图案中的基本单元，也是重复的单元。图案瓷砖可以包含任何形状，如矩形、圆形等，并且可以应用各种样式，包括填充颜色、渐变和不透明度
-   图案瓷砖放置在 `<defs>` 中：我们将 `<pattern>` 元素定义的图案瓷砖放置在 `<defs>` 中，以便在需要时进行引用。这样做可以将图案瓷砖的定义与实际使用它的图形元素分离开来，提高了 SVG 代码的可维护性和重用性
-   将图案应用到图形元素：通过将图案瓷砖的 `id` 用作 `fill` 或 `stroke` 属性的值，我们可以将图案应用到需要填充或描边的图形元素上。这样元素将使用图案瓷砖来填充或描边其内部区域
-   平铺和重复：一旦图案瓷砖被应用到图形元素上，它会根据图案瓷砖的定义在图形元素的区域内进行平铺和重复，直到填充整个区域。我们可以通过调整图案瓷砖的大小和位置来控制图案的平铺方式

  


如果要更好地理解 SVG Pattern 的工作原理，最好通过不同的实际案例来解释 SVG Pattern 的使用方法。

  


我们先从简单的示例开始。使用简单重复的条纹图案填充两个不同的形状，例如矩形和圆形：

  


```XML
<svg class="pattern">
    <defs>
        <!-- 定义图案瓷砖 -->
        <pattern id="stripes"  width="20%" height="100%">
            <rect x="0%" y="0" width="5%" height="100%" fill="#fff" />
            <rect x="5%" y="0" width="5%" height="100%" fill="#f50" />
            <rect x="10%" y="0" width="5%" height="100%" fill="#09f" />
        </pattern>
    </defs>

    <!-- 应用已定义的瓷砖 #stripes -->
    <rect x="1%" y="1%" width="98%" height="40%" fill="url(#stripes) lime" />
    <circle cx="50%" cy="70.5%" r="28%" fill="url(#stripes) lime" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d558e0289c5942929951a111a51cd317~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1276&s=381703&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/dyLmJBG

  


这个示例，使用三个 `<rect>` 绘制了一个条纹图案瓷砖：

  


```XML
<pattern id="stripes"  width="20%" height="100%">
    <rect x="0%" y="0" width="5%" height="100%" fill="#fff" />
    <rect x="5%" y="0" width="5%" height="100%" fill="#f50" />
    <rect x="10%" y="0" width="5%" height="100%" fill="#09f" />
</pattern>
```

  


`<pattern>` 元素的 `width` 和 `height` 属性定义了图案瓷砖的尺寸。在这个示例中，图案瓷砖将从 `(0,0)` 点开始沿着 `x` 轴水平方向重复平铺。它会在 `<rect>` 和 `<circle>` 图形元素中沿 `x` 轴水平方向重复五次平铺。

  


很明显，相同的一个图案瓷砖在 `<rect>` 和 `<circle>` 图形中平铺后的结果有明显的差异，但在矩形中更加接近。你可能会好奇？为什么会这样呢？

  


前面我们提到，默认情况下，图案瓷砖的 `x` 、`y` 、`width` 和 `height` 属性默认会以 `objectBoundingBox` 单位计算，因为 `<pattern>` 元素的 `patternUnits` 属性的默认值是 `objectBoundingBox` （对象边界框坐标系）。每个图案瓷砖都会延伸到边界框的完整高度（`100%`），但只有 `20%` 的宽度。无论形状有多宽（`<rect>` 宽度是 `98%` ，`<circle>` 是 `56%`），图案瓷砖都会在图形元素上有五组条纹（五个图案瓷砖）。

  


我们可以通过将 `patternUnits` 属性的值更改为 `userSpaceOnUse` 来改变这一现象：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fe83371914548f5b3ed8ac6b012051e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=488&s=1552748&e=gif&f=200&b=015180)

  


注意，你可以通过调整 `<pattern>` 元素的 `width` 和 `height` 来改变图案瓷砖的尺寸，也可以通过 `x` 和 `y` 调整图案瓷砖的起始位置（左上角）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b75211867b4043a7a6d9a53725199bf1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=588&s=2248553&e=gif&f=276&b=025280)

  


> Demo 地址：https://codepen.io/airen/full/ZEZxroz

  


你可能发现了，在上面这个示例中，调整图案瓷砖的 `y` 属性的值，不会有任何的变化。为了能向大家展示 `y` 属性对图案瓷砖的影响，我重新定义了一个图案：

  


```XML
<svg class="pattern" viewBox="0 0 1024 1024">
    <defs>
        <!-- 定义图案瓷砖 -->
        <pattern id="dots"  width="20%" height="20%" patternUnits="objectBoundingBox">
            <circle cx="10%" cy="10%" r="4%" fill="oklch(0.75 0.17 81.34)" />
            
            <g fill="oklch(0.81 0.25 149.38)">
                <circle cx="16%" cy="10%" r="2%"  />
                <circle cx="4%" cy="10%" r="2%"  />
                <circle cx="10%" cy="4%" r="2%"  />
                <circle cx="10%" cy="16%" r="2%"  />
            </g>  
        </pattern>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/076ae260dec2427fb04909976ffc341d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=616&s=2966973&e=gif&f=256&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/yLrKKJe

  


你可能已经发现了，不管是条纹图案还是上面这个圆点图案，它们都不是按照对象边界框的比例进行缩放的。这是因为，默认情况之下，`<pattern>` 元素中的内容（图形元素）的单位是相对于用户坐标系统（`userSpaceOnUse`）进行计算。我们可能通过 `<pattern>` 元素上的 `patternContentUnits` 属性来控制，你可以将其设置为 `objectBoundingBox` ，使图形元素的坐标系统与图案瓷砖的坐标系保持一致：

  


```XML
<pattern id="dots" width=".2" height=".2" patternContentUnits="objectBoundingBox" patternUnits="objectBoundingBox">
    <circle cx=".1" cy=".1" r=".04" fill="oklch(0.75 0.17 81.34)" />
    
    <g fill="oklch(0.81 0.25 149.38)">
        <circle cx=".16" cy=".1" r=".02" />
        <circle cx=".04" cy=".1" r=".02" />
        <circle cx=".1" cy=".04" r=".02" />
        <circle cx=".1" cy=".16" r=".02" />
    </g>
</pattern>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9b27297717e43e3bbbfb2e1cd558dac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1266&h=590&s=5245266&e=gif&f=642&b=01517f)

  


> Demo 地址：https://codepen.io/airen/full/MWRVGgE

  


也就是说，`<pattern>` 元素的 `patternUnits` 和 `patternContentUnits` 属性的默认值不同，并且作用的对象也不同。其中 `patternUnits` 的默认值为 `objectBoundingBox` ，作用于图案瓷砖；`patternContentUnits` 的默认值为 `userSpaceOnUse` ，作用于图案瓷砖内容中的图形元素。因此，在默认情况之下，很少有图案瓷砖能够很好的适应。事实上，我们在设计图案瓷砖时，总是希望图案瓷砖的内容能够按比例缩放以匹配图案瓷砖。

  


所以说，你可以将 `patternUnits` 和 `patternContentUnits` 两属性设置具有相同的值，可以都是 `objectBoundingBox` ，也可以都是 `userSpaceOnUse` ，以确保图案瓷砖区域的位置一致性。由于默认值不匹配，通常只需要声明其中一个，而不是两个都声明。

  


-   将 `patternUnits` 设置为 `userSpaceOnUse` 将确保它与 `patternContentUnits` 使用相同的坐标系，这是一个更直接的选项。如果我们在该坐标系内调整图形元素的大小，图案将重复以填充额外的空间
-   将 `patternContentUnits` 设置为 `objectBoundingBox` 也将确保坐标空间的一致性。如果我们在此坐标系内调整图形元素的大小，图案将按比例缩放以填充额外的空间，而不会重复。为了确保在此系统中的正确缩放，值必须以百分比或小数为基础

  


然而，在 `objectBoundingBox` 系统中工作可能会很困难。在该空间中工作时似乎存在一些错误，并且总体而言，缩放的概念与重复平铺图案的概念并不真正符合。

  


我更偏向将 `patternUnits` 属性设置为 `userSpaceOnUse`，与 `patternContentUnits` 属性的默认值保持一致。这样一来，你可以创建具有固定尺寸图形的固定大小图案瓷砖。这样的设置更符合“瓷砖”的实际概念，就像你可能用来铺盖客厅和房间的“瓷砖”一样。固定尺寸的“瓷砖”（也就是图案瓷砖）在较大的区域（比如客厅）或较小的区域（比如房间）中仅会改变“瓷砖”的数量，而不会改变其尺寸。

  


```XML
<svg class="pattern" viewBox="0 0 1024 1024">
    <defs>
        <!-- 定义图案瓷砖 -->
        <pattern id="dots" x="12px" y="14px" width="100px" height="100px" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="20" fill="oklch(0.75 0.17 81.34)" />
            <g fill="oklch(0.81 0.25 149.38)">
                <circle cx="80" cy="50" r="10" />
                <circle cx="20" cy="50" r="10" />
                <circle cx="50" cy="20" r="10" />
                <circle cx="50" cy="80" r="10" />
            </g>
        </pattern>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6396620ad8f74d6284ac53c2aa5b279b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=658&s=2625141&e=gif&f=147&b=01517f)

  


> Demo 地址：https://codepen.io/airen/full/gOyezew

  


正如你所看到的，经过调整之后，图案瓷砖尺寸大小是固定的，并且能自动匹配填充区域的大小。

  


虽然说 `<pattern>` 定义的图案与 `<linearGradient>` 和 `<radialGradient>` 定义的渐变都可以用于图形元素的 `fill` 和 `stroke` 。但 `<pattern>` 在定义图案瓷砖的时候，会涉及到很多宽度和高度，包括 SVG 画布、图案瓷砖以及用于生成图案瓷砖的图形，这可能会令人不知所措。

  


-   `<svg>` 元素上的 `width` 和 `height` 主要用于确定 SVG 视窗（Viewport）的尺寸
-   `<pattern>` 元素上的 `width` 和 `height` 主要定义了图案瓷砖的尺寸，即确定了图案瓷砖区域的画布大小
-   `<pattern>` 内部图形元素的 `width` 和 `height` 主要定义了图形的大小，它们不能超过 `<pattern>` 元素设置的 `width` 和 `height` ，如果图形的大小超过它们，则多余部分会被裁剪掉，因为 `<pattern>` 元素的 `overflow` 默认值为 `hidden`

  


我们通过下面这个简单的案例来进一步向大家说明尺寸之间的关系：

  


```XML
<svg viewBox="0 0 204 204" width="400" class="pattern">
    <defs>
        <pattern id="pattern" x="2" y="2" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="10" height="10" fill="lime" />
        </pattern>
    </defs>
    <rect x="2" y="2" width="200" height="200" fill="url(#pattern) red" stroke="orange" stroke-width="1"/>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42241e383a0746308d469d22a48303fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=921&s=292579&e=jpg&b=255f8b)

  


> Demo 地址：https://codepen.io/airen/full/mdgxKEw

  


SVG 视口（Viewport）的尺寸是 `400 × 400` ，`viewBox` 的尺寸是 `204 × 204` ，图形 `<rect>` 的尺寸是 `200 × 200` ，我们的图案瓷砖尺寸是 `20 × 20` ，图案内的绿色矩形 `rect` 的尺寸是 `10 × 10` 。这允许 `10` 图案瓷砖（`20 × 20`）平铺在 `200 × 200` 的矩形（黄色边框的矩形）中。

  


每个图案瓷砖中有一个 `10 × 10` 的矩形，并且该矩形的 `x` 和 `y` 属性的值为 `5` 。这意味着在每个矩形的顶部和左侧距离 `<pattern>` 边界有 `5` 个单位的距离。SVG 的 `<rect>` （黄色描边的）矩形本身和图案瓷砖（`<pattern>`）都从左边和顶部各向内移动了 `2` 个用户单位，以确保形状的边界不会被隐藏。

  


接下来，我们再来看一个稍微复杂的图案瓷砖，它看起来就像是鱼的鳞片一样。

  


```XML
<svg viewBox="0 0 1024 1024" class="pattern">
    <defs>
        <!-- 创建径向渐变 -->
        <radialGradient id="scale-gradient">
            <stop stop-color="#004000" offset="0" />
            <stop stop-color="green" offset="0.85" />
            <stop stop-color="yellow" offset="1" />
        </radialGradient>
        <!-- 创建鱼鳞图案瓷砖 -->
        <pattern id="scales-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <g id="scales" fill="url(#scale-gradient)">
                <circle class="scale" cx="0" cy="95" r="50" />
                <circle class="scale" cx="100" cy="95" r="50" />
                <circle class="scale" cx="50" cy="45" r="50" />
                <circle class="scale" cx="0" cy="-5" r="50" />
                <circle class="scale" cx="100" cy="-5" r="50" />
            </g>
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#scales-pattern) green" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/196371dcbd114fe7897950ef68c13c2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=893&s=843171&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/mdgxNXe

  


上面示例使用了五个 `<circle>` 元素错开重叠在一起制作了鱼鳞片形状的图案瓷砖。整个图案瓷砖使用了 `userSpaceOnUse` 作为 `patternUnits` 属性的值，这意味着图案瓷砖将是 `100 x 100` 的正方形，无论填充的形状（`<rect>`）的大小如何。

  


并不难发现，前两个鳞片几乎位于图案瓷砖的底部角落的中心位置（上图红色矩形框左下角和右下角），下一个鳞片被绘制在前两个鳞片的上方，几乎位于图案瓷砖的中心。最后两个鳞片位于图案瓷砖的顶部角落的正上方（上图红色矩形框的左上角和右上角）。这五个鳞片组合在一起，就绘制了鱼鳞图案瓷砖（红色矩形框内的部分，红色框边缘与白色框之间的部分会被 `<pattern>` 元素裁剪）。

  


大多数图案可以用这种方式构建，但可能需要一些额外的数学计算来确定尺寸。将图案块的最终外观草绘出来会有所帮助，从而可以确定图案在水平和垂直方向上的精确重复位置。

  


通过上述示例我们发现，将 `<pattern>` 元素的 `patternUnits` 属性设置为 `userSpaceOnUse` 值能够有效避免图案瓷砖的扭曲变形。然而，这也意味着图案无法根据形状进行缩放调整。此外，坐标的定位是相对于整个图形空间（用户坐标系）而言的，而不是对象本身（图形对象边界框坐标系）。如果要移动对象以改变其位置，我们需要通过其他的方式来处理。

  


你可以通过相对于坐标系中的固定点来定义形状，并使用变换（`transform`）或 `<use>` 元素上的 `x` 和 `y` 属性将其移动到相应的位置来解决定位问题，但要解决缩放问题，则需要为每个形状创建一个单独的坐标系，使用 `<symbol>` 元素或嵌套的 SVG，并填充整个宽度或高度。尽管这种方法可以解决问题，但除了增加额外的工作量外，还会增加复杂性。

  


幸运的是，还有一种选择可以缩放`<pattern>`的内容：[定义一个viewBox 并使用 preserveAspectRatio 来确保其不变形](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)。

  


在 `<pattern>` 元素上，`viewBox` 属性覆盖了 `patternContentUnits` 设置，并为图案创建了自己的坐标系统。由 `viewBox` 创建的坐标系统将按比例缩放以适应图案瓷砖，并尊重任何 `preserveAspectRatio` 属性值。

  


```XML
<svg class="pattern" viewBox="0 0 800 600">
    <defs>
        <radialGradient id="scale-gradient">
            <stop stop-color="#004000" offset="0" />
            <stop stop-color="green" offset="0.85" />
            <stop stop-color="yellow" offset="1" />
        </radialGradient>
        <pattern id="scales-pattern" width=".05" height=".05" viewBox="0 0 1 1">
            <g id="scales" fill="url(#scale-gradient)" stroke-width=".02" stroke="#000">
                <circle r=".5" cx="1" cy=".98" />
                <circle r=".5" cx="0" cy=".98" />
                <circle r=".5" cx=".5" cy=".5" />
                <circle r=".5" cx="0" cy="-.02" />
                <circle r=".5" cx="1" cy="-.02" />
            </g>
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#scales-pattern)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb7eb51110ec4edb96ea9ad3553f9eb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=592&s=2791750&e=gif&f=158&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/yLrjBjW

  


上面这个示例，在 `<pattern>` 元素上设置了 `viewBox="0 0 1 1"` ，并且将其宽度和高度都指定为 `0.05` ，始终保持一比一的比例进行缩放。

  


注意， `<pattern>` 元素的 `viewBox` 和 `preserveAspectRatio` 属性的使用与它们在 `<svg>` 元素上的使用是一致的。有关于这方面的介绍就不在这里重复阐述了。

  


`<pattern>` 与渐变还有一个相似之处，可以通过 `patternTransform` 属性对瓷砖图案做变换处理。这意味着，对于某些几何图案，你可以通过使用坐标变换来简化你的代码以实现相同的效果。例如下面这个示例：

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="pinstripe" patternUnits="userSpaceOnUse" width="30" height="30">
            <rect id="r" width="30" height="30"  fill="oklch(0.33 0.11 25.3)" />
            <line id="l" x1="15" y="0" x2="15" y2="30" stroke="oklch(0.72 0.06 244.48)" />
        </pattern>
        <pattern id="diagonals" href="#pinstripe" patternTransform="rotate(45)" />
        <pattern id="grid" href="#pinstripe">
            <use xlink:href="#r" />
            <use xlink:href="#l" />
            <use xlink:href="#l" transform="rotate(90, 15, 15)" />
        </pattern>
        <pattern id="diagonal-grid" href="#grid" patternTransform="rotate(45)" />
    </defs>
    <rect width="24%" height="100%" fill="url(#pinstripe)" />
    <rect width="25%" height="100%" x="24.666%" fill="url(#diagonals)" />
    <rect width="25%" height="100%" X="50.333%" fill="url(#diagonal-grid)" />
    <rect width="24%" height="100%" x="75.999%"  fill="url(#grid)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26bb83edea1148c7bb90b2408dfbb800~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1025&s=1028563&e=jpg&b=5b1b19)

  


> Demo 地址：https://codepen.io/airen/full/gOyzYVj

  


在 `<defs>` 元素内使用四个 `<pattern>` 元素创建了四个不同的图案瓷砖，它们都使用了相同的颜色方案，并且后面三个图案瓷砖继承了第一个图案瓷砖内的图形，只是使用 `patternTransform` 做了变换处理。

  


-   第一个 `<pattern>` 内使用 `<rect>` 和 `<line>` 绘制了最基本的图案
-   第二个 `<pattern>` 使用 `href` 属性引用了第一个图案（`#pinstripe`），并旋转 `45` 度
-   第三个 `<pattern>` 也使用 `href` 属性引用了第一个图案（`#pinstripe`），并且在该元素内使用 `<use>` 引用了第一个 `<pattern>` 元素内的 `<rect>` 和 `<line>` ，并对其中一个竖线做了变换处理（ `transform="rotate(90, 15, 15)"` ）
-   第四个 `<pattern>` 使用 `href` 属性引用了第三个图案（`#grid`），并旋转 `45` 度

  


使用变换，你可以创建图案瓷砖布局，其中瓷砖是平行四边形或菱形，而不是简单的矩形。

  


```XML
<svg class="pattern">
    <defs>
        <pattern id="triangles" patternUnits="userSpaceOnUse" width="20" height="17.32" patternTransform="skewX(30)">
            <rect width="30" height="20" fill="lightGreen" />
            <polygon points="0,0 20,0 0,17.32" fill="forestgreen" />
        </pattern>
        <pattern id="argyle" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="scale(2,4) rotate(45)">
            <rect fill="mediumPurple" width="20" height="20" />
            <rect fill="indigo" width="10" height="10" />
            <rect fill="navy" width="10" height="10" x="10" y="10" />
            <path stroke="lavender" stroke-width="0.25" fill="none" d="M0,5 L20,5 M5,0 L5,20
     M0,15 L20,15 M15,0 L15,20" />
        </pattern>
    </defs>

    <rect width="50%" height="100%" fill="url(#triangles)" />
    <rect width="50%" height="100%" x="50%" fill="url(#argyle)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20e806f296884d7dba2915b1a82be7d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1025&s=1934180&e=jpg&b=a7e99a)

  


> Demo 地址：https://codepen.io/airen/full/jORxOVO

  


你还可以结合 SVG 滤镜，制作出更出色的图案效果：

  


```XML
<svg class="pattern">
    <filter id="glow">
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="SourceGraphic" operator="out" result="glow" />
        <feFlood flood-color="white" flood-opacity="0.2" />
        <feComposite in2="SourceGraphic" operator="atop" result="light" />
        <feComposite in="glow" in2="light" />
    </filter>
    <pattern id="p" patternUnits="userSpaceOnUse" width="180px" height="120px" patternTransform="scale(1,0.8660254)">
        <g filter="url(#glow)">
            <g class="wrapper">
                <path id="hex" pathLength="388.5" d="M-30,-60 30,-60 60,0 30,60 -30,60 -60,0Z" transform="scale(0.935)" />
            </g>
            <use xlink:href="#hex" x="0" y="+120" />
            <use xlink:href="#hex" x="+90" y="+60" />
            <use xlink:href="#hex" x="+180" y="0" />
            <use xlink:href="#hex" x="+180" y="120" />
        </g>
    </pattern>
    <rect fill="url(#p)" width="100%" height="100%" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/232f6fd351e04204a2d15898a7a8d8b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1025&s=775186&e=jpg&b=426d8d)

  


> Demo 地址：https://codepen.io/airen/full/eYorYvd

  


## 动画化 SVG Pattern

  


我们可以像动画化其他元素一样，使用 CSS 给 `<pattern>` 中的图形元素添加动画效果，使整个图案带有动画效果。例如上面正边形的较案，只需要添加下面这几行 CSS ，就可以使整个图案动起来：

  


```CSS
@layer animation {
    @keyframes draw {
        from {
            stroke-dashoffset: 388.5;
        }
        to {
            stroke-dashoffset: 0;
        }
    }
    
    @keyframes stroke-color {
        0% {
            stroke: hsl(0 100% 70%);
        }
        16.667% {
            stroke: hsl(60 100% 70%);
        }
        33.333% {
            stroke: hsl(120 100% 70%);
        }
        50% {
            stroke: hsl(180 100% 70%);
        }
        66.667% {
            stroke: hsl(240 100% 70%);
        }
        83.333% {
            stroke: hsl(300 100% 70%);
        }
        100% {
            stroke: hsl(360 100% 70%);
        }
    }
    
    @keyframes back-color {
        0% {
            background: hsl(0 80% 15%);
        }
        16.667% {
            background: hsl(60 80% 15%);
        }
        33.333% {
            background: hsl(120 80% 15%);
        }
        50% {
            background: hsl(180 80% 15%);
        }
        66.667% {
            background: hsl(240 80% 15%);
        }
        83.333% {
            background: hsl(300 80% 15%);
        }
        100% {
            background: hsl(360 80% 15%);
        }
    }
    
    #p {
        animation: stroke-color 11s infinite linear;
    
        :is(.wrapper, use) {
            animation: draw 4s infinite linear;
        }
    
        use:nth-child(3) {
            animation-delay: -2s;
        }
    }

    :root {
        animation: back-color 11s infinite linear;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d82e30e833424db2845bb99b6dab6558~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1254&h=514&s=4081057&e=gif&f=43&b=016184)

  


> Demo 地址：https://codepen.io/airen/full/VwNxwzd

  


再来看一个：

  


```XML
<svg class="pattern">
    <defs>
        <clipPath id="port">
            <circle r="150" />
        </clipPath>
        <filter id="glow">
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="SourceGraphic"  operator="out" result="glow" />
            <feFlood flood-color="white" flood-opacity="0.2" />
            <feComposite in2="SourceGraphic"  operator="atop" result="light" />
            <feComposite in="glow" in2="light" />    
        </filter>
        <filter id="filter">
            <feDropShadow dx="0" dy="0" result="s" />
            <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="9" />
            <feComposite in="s" operator="arithmetic" k2=".7" k3=".35" />
            <feDiffuseLighting lighting-color="#f84" surfaceScale="9">
                <feDistantLight azimuth="225" elevation="9" />
            </feDiffuseLighting>
        </filter>
        <pattern id="p" patternUnits="userSpaceOnUse" x="-30" width="60" height="60" viewBox="-150 -150 300 300">
            <g clip-path="url(#port)" stroke="black" stroke-width="318.3" stroke-dasharray="5 5" filter="url(#glow)">
                <circle r="159.15" fill="white" />
                <circle r="159.15" fill="none" cx="10" cy="10" id="r" />
            </g>
        </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#p)" filter="url(#filter)"/>
</svg>
```

  


```CSS
@layer animation {
    @keyframes rot {
        to {
            rotate: 1turn;
        }
    }
    #r {
        animation: rot 20s cubic-bezier(0.46, 0.03, 0.52, 0.96) infinite alternate;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75aecaf3c1e64a2fa63db71f1a3faa61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=540&s=4810123&e=gif&f=22&b=6b2e0f)

  


> Demo 地址：https://codepen.io/airen/full/OJGZJxG

  


我们前面展示的示例，都是图案填充在图形中，试想一下，如果填充到文本中呢？将会是一种什么的结果：

  


```XML
<svg class="pattern">
    <defs>
        <clipPath id="port">
            <circle r="150" />
        </clipPath>
        <filter id="glow">
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="SourceGraphic"  operator="out" result="glow" />
            <feFlood flood-color="white" flood-opacity="0.2" />
            <feComposite in2="SourceGraphic"  operator="atop" result="light" />
            <feComposite in="glow" in2="light" />    
        </filter>
        <filter id="filter">
            <feDropShadow dx="0" dy="0" result="s" />
            <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="9" />
            <feComposite in="s" operator="arithmetic" k2=".7" k3=".35" />
            <feDiffuseLighting lighting-color="#f84" surfaceScale="9">
                <feDistantLight azimuth="225" elevation="9" />
            </feDiffuseLighting>
        </filter>
        <pattern id="p" patternUnits="userSpaceOnUse" x="-30" width="60" height="60" viewBox="-150 -150 300 300">
            <g clip-path="url(#port)" stroke="black" stroke-width="318.3" stroke-dasharray="5 5" filter="url(#glow)">
                <circle r="159.15" fill="white" />
                <circle r="159.15" fill="none" cx="10" cy="10" id="r" />
            </g>
        </pattern>
    </defs>
    <rect width="100%" height="100%" filter="url(#filter)"/>
    <text fill="url(#p)" lengthAdjust="spacingAndGlyphs" x="0" y="0" dx="50%" dy="50%" textLength="1200" text-anchor="middle" font-stretch="expanded" filter="url(#filter)" stroke-width="5" stroke="red">CSS & SVG are awesome</text>
</svg>
```

  


```CSS
@layer animation {
    @keyframes rot {
        to {
            rotate: 1turn;
        }
    }
    #r {
    animation: rot 20s cubic-bezier(0.46, 0.03, 0.52, 0.96) infinite alternate;
    }
}

@layer demo {
    text {
        font-size: clamp(3rem, 4vw + 4rem, 6rem);
        font-family: "Courier New", Courier, monospace;
        font-weight: 900;
        text-transform: uppercase;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d050e6eafe34cef8a444eb3157de04d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=454&s=4667946&e=gif&f=26&b=6b2b0c)

  


> Demo 地址：https://codepen.io/airen/full/VwNxwBG

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4c1aaf568814e29834aa8c6449b5a0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1368&h=484&s=1525212&e=gif&f=43&b=005180)

  


> Demo 地址：https://codepen.io/airen/full/xxejxmW

  


[更多相关的案例可以点击这里查看](https://codepen.io/collection/DRMKdB)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/406071fbcf274628af455a60bfd3f33c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2058&h=1654&s=479005&e=jpg&b=25041e)

  


> URL：https://codepen.io/collection/DRMKdB

  


## SVG Pattern 生成器

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d93ae0026204ffbaf06423e8cce716d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1025&s=1025574&e=jpg&b=f9f3f1)

  


说实话，手动硬编码创建复杂的图案瓷砖还是很吃力的，除非你对 SVG 有足够深的认识，并且深度的掌握了 SVG 的相关技术与细节。

  


事实上，除了手动编码创建复杂的图案瓷砖之外，还可以借助诸如 Figma、Sketch 等图形设计软件来辅助你设计图案瓷砖。更为简便的是，我们可以直接使用一些在线工具来生成图案瓷砖。例如：

  


-   [10015.io](https://10015.io/tools/svg-pattern-generator) ：它生成真正的、可直接使用的 SVG 图案，而不像许多其他工具一样生成通用的 SVG 图像块
-   [Hero Patterns](https://heropatterns.com/)：提供了超过 90 种免费下载的 SVG 图案，并允许你设置文件的不透明度、前景和背景颜色
-   [Iros Pattern Fills](https://iros.github.io/patternfills/)：收集了一本单色图案填充的图案书，你可以轻松地在你的工作中参考。这些文件非常小，即使你只引用了其中的一部分，也可以轻松包含它们。
-   [Pattern Monster](https://pattern.monster/)：是一个庞大的、优雅的 SVG 图形集合，大约有 250 个。你可以轻松快速地缩放、着色、旋转和重新定位每个设计。你可以直接从平台上导出 CSS 和 SVG 代码。
-   [Mmmotif](https://fffuel.co/mmmotif/)：@Sébastien Noël 在他的 [fffuel.co](https://fffuel.co) 网站上提供了一个令人瞠目结舌的简单、原创和美丽的设计工具集合。在这个集合中，他的 Mmmotif 等距三维图案生成器非常出色。与 Pattern Monster 类似，你可以混合和匹配形状、颜色、缩放和角度，以组合一个凹凸不平的三维等距图块。
-   SVGBackgrounds.com ：这个工具目前提供了 30 种基本图案，但颜色和不透明度可以通过几次点击进行自定义。完成后，它会导出 CSS 和 SVG，可以粘贴到你的样式表中。与 Pattern Monster 类似，你需要手动编写 SVG 图案定义。
-   [SVG Patterns Gallery](https://philiprogers.com/svgpatterns/)：基于 [@Lea Verou 的 CSS3 图案](https://projects.verou.me/css3patterns/)的一个小型 SVG 图案集合。已经有一段时间没有更新了，但仍然有价值。

  


## 如何在 Web 中应用 SVG Pattern

  


现在我们可以创建自己的图案了，我们有三种方法可以将想要的图案添加到 Web 中：

  


-   SVG 平铺：将整个 SVG 文件作为背景。我们已经使用 `<pattern>` 元素创建了SVG代码，该元素已经处理了平铺，并提供了高级控制功能，例如旋转、缩放、平移和倾斜。
-   CSS 平铺：将SVG文件作为图块。这种方法依赖于 CSS 来处理平铺。在这种情况下，SVG 不应该具有包裹图块的 `<pattern>` 元素，但并不改变设计图块的规则。
-   内联 SVG 以进行高级控制：直接将 SVG 代码内嵌在 HTML 文档中，以便能够使用 CSS 或 JavaScript 操纵 SVG 设计。

  


无论你选择 SVG 还是 CSS 平铺，你都将通过 CSS 将 SVG 图案作为背景图像添加。

  


首先，我们将创建一个类，并将 SVG 文件的路径作为 `background-image` 属性的值，如下所示：

  


```CSS
.bg {
    background-image: url("/path/to/pattern.svg");
}
```

  


这与将 JPG 作为背景图像添加没有什么不同。然后，还有一些其他属性需要考虑，以确保图案显示的方式符合你的意图：

  


-   `background-size: cover;`：当将 SVG 拉伸到整个屏幕时，这个声明很有用，这在使用 SVG 平铺时很相关。
-   `background-size: auto;`：这是默认值，对于 CSS 平铺是必需的，因此如果出于任何原因覆盖了 `auto` 值，则需要此声明。
-   `background-position: center;`：这是可选的，但如果你希望将图案居中，则很有用，默认情况下，你的图案锚定在背景容器的左上角。
-   `background-repeat: no-repeat;`：如果我们依赖于 SVG 进行平铺，则不希望有任何 CSS 平铺。但如果使用 `background-size: cover`，则不需要此声明，因为它会显示单个图块。
-   `background-repeat: repeat;`：这是默认值，对于 CSS 平铺是必需的。或者，你还可以使用 `repeat-x` 或 `repeat-y` 这些值，如果你只想要单列或单行图块。
-   `background-attachment: scroll | fixed;`：此属性确定背景与你的内容一起显示的方式。滚动（`scroll`）是默认值，使背景与其容器一起滚动。固定值（`fixed`）会产生视差效果，背景固定在屏幕上，并在滚动时保持位置不变。

  


## CSS Pattern vs. SVG Pattern

  


在 CSS 中，可以使用背景图像创建重复图案。因此，图案内容可以由任何有效的 CSS 图像数据类型创建：光栅、 SVG 图像或 CSS 渐变。默认情况下，图像会在水平和垂直方向重复，以创建类似于 SVG 图案的平铺效果。

  


最初，CSS 背景图像总是以图像的固有大小绘制。类似于用户空间模式，改变具有背景的元素的大小会改变重复的次数，而不是它们的比例。对于应该按比例缩放以适应元素的大型图像背景来说，这并不特别有用，并且对于没有固有大小的渐变（和一些 SVG 图像）来说根本没有用。CSS 的 `background-size` 属性，允许将每个背景图像缩放到固定大小或元素的百分比。

  


与 SVG 图案相比，CSS 背景有一些优势：

  


-   使用 `background-repeat` 属性，可以将背景设置为仅在水平或垂直方向重复（或根本不重复）
-   `background-size` 属性接受 `auto` 值，以允许图案瓷砖的高度或宽度按照其他值和内容的固有宽高比进行缩放。
-   背景可以分层，每个图层都有自己的大小和重复选项。

  


使用 CSS 背景创建图案效果的主要缺点是，图案内容必须在单独的图像文件中（或编码为数据 URI ），除非它们可以表示为渐变。尽管渐变可以用来创建块和条纹，但在某些浏览器上的呈现质量明显较差于 SVG 形状。

  


## 小结

  


SVG Pattern 是一种强大的设计工具，可以为网页和应用程序添加独特的视觉效果。它们可以用作背景、填充和纹理，为用户界面增添吸引力和个性化。以下是关于 SVG 图案的一些关键点：

  


首先，SVG 图案可以通过 `<pattern>` 元素在 SVG 中创建。这些图案可以是重复的形状、线条或其他几何图形，可以自定义大小、颜色、旋转等属性。

  


SVG 图案可以在网页中以多种方式应用，包括作为整个背景、图块或内联 SVG 以进行更高级的控制。无论是使用 SVG 平铺还是 CSS 平铺，都可以通过 CSS 轻松地将 SVG 图案添加到网页中。

  


有许多在线工具和库可供使用，可以帮助你创建、定制和应用 SVG 图案。这些工具提供了各种选项，使你能够轻松地生成各种各样的图案，并将它们应用到你的项目中。

  


一些流行的图形编辑软件，如 Adobe Illustrator 、 Inkscape、 Sketch 和 Figma等，也提供了创建和导出 SVG 图案的功能。然而，某些编辑软件可能对 SVG 图案的支持程度有所不同，因此需要谨慎选择。

  


总的来说，SVG 图案是一种灵活且强大的设计工具，可以为您的项目增添美感和独特性。通过使用 SVG 图案，你可以轻松地创建各种各样的视觉效果，从而为用户带来更加吸引人的体验。