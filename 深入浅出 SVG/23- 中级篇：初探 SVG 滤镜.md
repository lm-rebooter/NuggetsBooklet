在当今的 Web 世界中，创新的视觉呈现已经成为吸引和留住用户的关键因素。然而，要实现引人注目的视觉效果，[我们需要精通各种图形处理技术](https://juejin.cn/book/7223230325122400288/section/7259669043622690853)。在这方面，CSS 滤镜和 SVG 滤镜发挥着至关重要的作用。SVG 滤镜作为一种强大的工具，为我们提供了多种丰富的视觉效果实现方式，而 CSS 滤镜则是其中之一。

  


与我们熟悉的 CSS 滤镜不同，SVG 滤镜的独特之处在于其灵活性和多样性。它不仅可以应用于 SVG 元素，还可以用于 HTML 元素，并且能够实时地对图形进行处理。SVG 滤镜提供了更加丰富和动态的视觉效果，使得元素可以呈现出生动活泼的外观，为用户带来沉浸式的视觉体验。

  


这节课将以 CSS 滤镜为起点，为你介绍 SVG 滤镜技术的基础理论和工作原理。我们将从基本的滤镜效果如模糊、颜色偏移开始讲解，逐步深入到更高级的效果如光照模拟和复合操作。每一种效果都将通过示例详细展示，以确保你能够逐步学会如何运用 SVG 滤镜，实现出色的视觉效果，为你的 Web 项目增添新的魅力和创意。

  


通过学习，你将不仅掌握 SVG 滤镜的理论和实践，还将激发你的创造力，为未来的设计项目注入独特的视觉魅力。让我们一起踏上探索视觉创意之美的旅程吧！

  


## CSS 滤镜

  


滤镜就好像是一种魔法工具，接受图形输入，施加变化，然后呈现出新的结果。在现代浏览器中，我们拥有两种主要类型的滤镜：CSS 滤镜和 SVG 滤镜，其中 CSS 滤镜是 SVG 滤镜的一个子集。SVG 滤镜提供了更广泛的功能和范围。与诸如 Photoshop 等图形软件相比，浏览器滤镜可以实现同样的效果。然而，浏览器滤镜有两个明显的优势：它们可以被动画化，也可以与用户进行交互。

  


CSS 滤镜目前为我们提供了三种主要应用方式：

  


-   `filter` 属性：这是一个 CSS 属性，可以直接应用于任何 HTML 元素上。通过 `filter` 属性，我们可以实现各种效果，如模糊、亮度调整、对比度增强、饱和度控制等。
-   `filter()` 函数：这是一个 CSS 函数，用于在特定属性值中应用滤镜效果。它只能用于值为 `<image>` 类型的属性上，比如 `background-image`。使用 `filter()` 函数可以将多个滤镜效果组合在一起，创造更加复杂的背景效果。
-   `backdrop-filter` 属性：与 `filter` 属性相似，`backdrop-filter` 也可以应用滤镜效果，但它仅会影响元素的背景，而不影响元素本身。

  


CSS 滤镜提供了大约 11 种不同的滤镜函数，可以实现多种效果，从简单的模糊到改变颜色对比度和饱和度等。这些功能丰富的滤镜函数为开发人员提供了丰富的选择，可以根据具体需求创建出色的视觉效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95363496b3804f84acf0a3cf48ad911d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1300&s=1124671&e=jpg&b=141414)

  


> Demo 地址：https://codepen.io/airen/full/KKLKeeg

  


尽管 CSS 滤镜功能强大且非常方便，但也有很大的局限性。我们能够创建的效果通常适用于图像，并且仅限于颜色调整和基本模糊化。例如，使用 `blur()` 滤镜函数模糊元素，其效果将在应用于该元素的图像上创建一个统一的高斯模糊。

  


```CSS
img {
    filter: blur(6px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/460a5bbbd54e44788fb27dfc690c015e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=701&s=516356&e=jpg&b=418080)

  


> Demo 地址：https://codepen.io/airen/full/zYQYLGa

  


上面代码中的 `blur(6px)` 创建的模糊效果在图像上均匀的应用于 `x` 和 `y` 方向。但是，此函数只是 SVG 中可用的模糊滤镜基元的简化和有限的快捷方式，该基于允许我们对图像进行模糊处理，可以是统一的，也可以沿 `x` 或 `y` 轴之一应用单向模糊效果：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="blur">
            <feGaussianBlur stdDeviation="6"></feGaussianBlur>
        </filter>
    </defs>
</svg>
```

  


```CSS
img {
    filter: url(#blur);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8f9604af0ac4bf89aab20698ec49bd3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=701&s=552187&e=jpg&b=428080)

  


> Demo 地址：https://codepen.io/airen/full/LYoYBZa

  


正如你所看到的，SVG 滤镜只需几行代码就能够创建类似于 诸如 Photoshop 图像编辑软件中滤镜级别的效果。

  


## SVG 滤镜

  


SVG 滤镜（以及 CSS 滤镜）通常被认为是通过模糊效果或颜色操作来提升位图的一种方法。然而，它们的功能远不止于此。与 CSS 规则类似，SVG 滤镜是一系列指令的集合，可以在元素对象（例如图像、文本和 HTML 元素等）上创建视觉层。通过将这些效果应用于对象的 `filter` 属性，我们可以实现各种视觉效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553ef0feecdc40c1a7d08b34c14ea5ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2459&h=1445&s=846764&e=jpg&b=ffffff)

  


-   **输入（Source）** ：通常是 SVG 元素或 HTML 元素
-   **滤镜构造器**：使用 SVG 的 `<filter>` 元素和一个或多个滤镜基元（**Filter Primitive**）组成
-   **输出（Result）** ：通过 `filter` 属性引用定义好的滤镜构造器，最终在浏览器呈现应用滤镜之后的结果。

  


我们可以通过下面这个代码来描述这三者之间的关系：

  


```XML
<svg>
    <defs>
        <filter id="myFilter">
            <!-- 滤镜基元 -->
        </filter>
    </defs>
    <!-- 使用 filter 属性将滤镜应用到 SVG 元素 -->
    <image href="example.jpg" filter="url(#myFilter)" class="filtered" />
</svg>

<!-- 使用 CSS 的 filter 属性将滤镜应用到 HTML 元素 -->
<img class="filtered" src="example.jpg" alt="Filtered Image" />
```

  


```CSS
.filtered {
    filter: url(#myFilter);
}
```

  


正如上面代码所示。在 SVG 中，滤镜通过 `<filter>` 元素来定义，该元素通常包含一个或多个滤镜基元，每个滤镜基元负责执行特定的滤镜操作。然后，可以通过 `filter` 属性将 `<fiter>` 定义好的滤镜应用到 HTML 或 SVG 元素上。

  


需要知道的是，如果 SVG 元素在 CSS 中同时应用了 `filter` 属性，那么 CSS 中的 `filter` 属性将会覆盖 SVG 元素自身的 `filter` 属性。

  


相对于 CSS 滤镜而言，理解 SVG 滤镜确实具有一定挑战性。SVG 滤镜的语法通常更为复杂和冗长，即使是实现简单效果如阴影也是如此。例如，一些常见的滤镜效果，如 `feColorMatrix` 和 `feComposite`，需要对数学和色彩理论有一定的了解才能理解其原理和应用方式。然而，尽管初始学习可能会有些困难，但不必担心，随着深入学习，你将能够更好地理解和掌握 SVG 滤镜的概念和技术。逐步探索和实践将帮助你逐渐熟悉 SVG 滤镜的语法和用法，并最终能够运用它们创造出各种令人惊叹的视觉效果。

  


## SVG 的 `<filter>` 元素

  


SVG 的 `<filter>` 元素是用于创建滤镜效果的关键元素。它允许你定义一个或多个滤镜基元，并通过 `filter` 属性将它们应用于 SVG 图形元素或 HTML 元素，从而实现各种视觉效果，例如模糊、颜色调整、阴影等。

  


`<filter>` 元素的使用与 SVG 中的[渐变](https://juejin.cn/book/7341630791099383835/section/7354948936039137289)（`<linearGradieng>` 或 `<radialGradient>`）、[图案](https://juejin.cn/book/7341630791099383835/section/7355510532712955954)（`<pattern>`）、[剪切](https://juejin.cn/book/7341630791099383835/section/7362748816769941540)（`<clipPath>`）和[遮罩](https://juejin.cn/book/7341630791099383835/section/7366549423813296165)（`<mask>`）等元素类似。通常情况下，`<filter>` 在 SVG 中的 `<defs>` 元素内被定义为可重复使用的模板，但并非必须如此。无论你是否将 `<filter>` 放置在 `<defs>` 元素内，它都不会直接呈现在页面上。这是因为滤镜需要一个源图像来工作，除非你显式地在该源图像上调用滤镜，否则它不会产生任何可见效果。

  


```XML
<svg>
    <defs>
        <filter 
            id="filter" 
            x="-20%" 
            y="-20%" 
            width="140%" 
            height="140%" 
            filterUnits="objectBoundingBox" 
            primitiveUnits="userSpaceOnUse">
            <!-- 滤镜基元放在这里 -->
        </filter>
    </defs>
</svg>
```

  


与其他 SVG 元素相似，`<filter>` 元素也包含了一些常见的属性，例如 `x` 、`y` 、`width` 、`height` 、`id` 、`filterUnits` 和 `primitiveUnits` 等。这些属性主要用于控制滤镜效果的位置（`x` 和 `y` ）、尺寸（`width` 和 `height`）、标识符（`id`）以及滤镜效果的单元类型（`filterUnits`）和滤镜基元中各种长度值以及定义滤镜基元子区域的属性所采用的坐标系统（`primitiveUnits`）。

  


`<filter>` 元素的 `id` 属性非常重要，因为它是指定滤镜的唯一标识符，以便被 `filter` 属性的 `url()` 引用，例如：

  


```CSS
.filtered {
    filter: url(#myFilter);
}
```

  


`<filter>` 元素的 `filterUnits` 属性类似于 `<clipPath>` 的 `clipPathUnits` 属性，它定义了 `<filter>` 元素的 `x` 、`y` 、`width` 和 `height` 属性的坐标系统。它有两个可选值：`userSpaceOnUse` 和 `objectBoundingBox` ：

  


-   `userSpaceOnUse` ：`x` 、`y` 、`width` 和 `height` 表示在引用 `<filter>` 元素在当前用户坐标系统中的位置和大小。例如，通过 `filter` 属性引用 `<filter>` 的元素的用户坐标系统
-   `objectBoundingBox` ：`x` 、`y` 、`width` 和 `height` 表示引用元素的边界框（bbox）的部分或百分比

  


如果 `filterUnits` 属性未指定，那么效果如同指定了值为 `objectBoundingBox`。

  


需要知道的是，`x` 、`y` 、`width` 和 `height` 四个属性定义了滤镜在画布上的矩形区域，该矩形区域的大小将取决于 `filterUnits` 的值。而且，该矩形的边界充当给定 `<filter>` 元素包含的每个滤镜基元的硬剪切区域。因此，如果给定滤镜基元的效果超出该矩形的边界（当 `<feGaussianBlur>` 基元的 `stdDeviation` 使用非常大的值时，有时会发生这种情况），那么滤镜的部分效果将被裁剪掉。如果未指定 `x` 或 `y` ，则效果就像指定了值为 `-20%` 一样；同样地，如果未指定 `width` 或 `height` ，则效果就像指定了值为 `140%` 一样。

  


这意味着，通常需要提供填充空间，因为滤镜效果可能会超出给定对象边界框。出于这些目的，可以为 `x` 和 `y` 提供负百分比值，并为 `width` 和 `height` 提供大于 `100%` 的百分比值。这就是为什么示例代码的 `<filter>` 的设置 `x="-20%"` 、`y="-20%"` 、`width="140%"` 和 `height="140%"` 的原因。

  


`<filter>` 的 `primitiveUnits` 类似于 `<mask>` 元素的 `maskContentUnits` 属性，它主要用于给滤镜基元以及其子域中的各种各样的长度单位指定坐标系统。这个属性决定了在滤镜基元以及定义滤镜基元子区域的属性使用的长度单位是相对于用户坐标系统还是相对于对象边界框的百分比。`primitiveUnits` 属性与 `filterUnits` 相似，有两个可选的值：

  


-   `userSpaceOnUse`：表示滤镜基元的长度单位是相对于引用滤镜的元素的用户坐标系统。在这种模式下，滤镜基元的坐标和尺寸使用用户坐标系统的值。这意味着无论引用 `<filter>` 元素的对象尺寸如何，滤镜的效果都会保持一致。
-   `objectBoundingBox`：表示滤镜基元的长度单位是相对于引用滤镜的元素的边界框的百分比。在这种模式下，滤镜基元的坐标和尺寸是相对于引用它的元素的边界框的百分比。这意味着滤镜的效果会根据引用 `<filter>` 元素的对象的边界框的尺寸而变化。

  


如果未指定 `primitiveUnits` 属性，默认值是 `userSpaceOnUse`。

  


在 SVG 中，`primitiveUnits` 属性通常与 `filter` 元素一起使用，用于指定滤镜基元的坐标系统，从而影响滤镜效果的表现方式。

  


介绍完 `<filter>` 元素的常用属性之后，请继续回到我们的示例代码中来：

  


```XML
<svg>
    <defs>
        <filter 
            id="filter" 
            x="-20%" 
            y="-20%" 
            width="140%" 
            height="140%" 
            filterUnits="objectBoundingBox" 
            primitiveUnits="userSpaceOnUse">
            <!-- 滤镜基元放在这里 -->
        </filter>
    </defs>
</svg>
```

  


```CSS
.filtered {
    filter: url(#myFilter);
}
```

  


上述代码示例中，虽然我们使用 `<filter>` 创建一个名为 `#myFilter` 的滤镜，并且通过 CSS 的 `filter` 属性将其应用于 `.filtered` 元素上，但它并没有给 `.filtered` 元素带来任何效果。这是因为，上述代码中的滤镜什么也没有（它是空的）。

  


为了要使 `<filter>` 创建的滤镜有相应的效果，则需要在 `<filter>` 内空义一个或多个滤镜基元，这些滤镜基元会根据你设置的参数，创建出相应的滤镜效果。换句话说，`<filter>` 元素只是一系列滤镜基元的容器，只有结合这些滤镜基元，才会有实打实的滤镜效果。例如：

  


```XML
<svg>
    <defs>
        <filter 
            id="filter" 
            x="-20%" 
            y="-20%" 
            width="140%" 
            height="140%" 
            filterUnits="objectBoundingBox" 
            primitiveUnits="userSpaceOnUse">
            <!-- 高期模糊 -->
            <feGaussianBlur stdDeviation="3 10" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88ff6b0f9f1e47d6b3d540aa3447dd9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=512&s=10502437&e=gif&f=283&b=72790c)

  


> Demo 地址：https://codepen.io/airen/full/MWdWZmd

  


正如你所看到的，`<filter>` 元素需要通过一系列滤镜基元来构建所需的效果。这些滤镜基元是在 `<filter>` 元素的内部定义的。这些滤镜基元可以在 SVG 中通过 `<fe>` 开头的标签来使用，共有十七个滤镜基元：

  


-   **`feGaussianBlur`** **（高斯模糊）** ：用于对图像进行高斯模糊处理。可以通过调整 `stdDeviation` 属性来控制模糊的程度。
-   **`feDropShadow`** **（投影阴影）** ：用于创建对象的投影阴影效果。可以通过调整 `dx`、`dy`、`stdDeviation` 和 `flood-color` 属性来控制阴影的位置、模糊程度和颜色。
-   **`feMorphology`** **（形态学）** ：用于对图像进行形态学处理，如膨胀或腐蚀。可以通过调整 `operator` 和 `radius` 属性来控制形态学处理的类型和半径。
-   **`feDisplacementMap`** **（位移映射）** ：用于根据位移图像对图像进行变形。可以通过调整 `scale` 和 `xChannelSelector/yChannelSelector` 属性来控制变形的程度和方向。
-   **`feBlend`** **（混合）** ：用于对两个图像进行混合。可以通过调整 `mode` 属性来控制混合模式，如叠加、正片叠底等。
-   **`feColorMatrix`** **（颜色矩阵）** ：用于对图像进行颜色矩阵变换。可以通过调整矩阵的值来实现颜色调整、色彩转换等效果。
-   **`feConvolveMatrix`** **（卷积矩阵）** ：用于对图像进行卷积处理，如边缘检测、模糊等。可以通过调整 `kernelMatrix` 属性来定义卷积核。
-   **`feComponentTransfer`** **（组件传输）** ：该滤镜基元用于对图像的不同颜色通道进行传输处理。可以通过调整 `type` 和 `table-values` 属性来控制传输类型和值。
-   **`feSpecularLighting`** **（镜面光照）** ：用于模拟镜面光照效果。可以通过调整 `surfaceScale`、`specularConstant` 和 `specularExponent` 属性来控制光照的强度和方向。
-   **`feDiffuseLighting`** **（漫反射光照）** ：用于模拟漫反射光照效果。可以通过调整 `surfaceScale`、`diffuseConstant` 和 `kernelUnitLength` 属性来控制光照的强度和方向。
-   **`feFlood`** **（填充）** ：用于在图像上创建一个填充区域。可以通过调整 `flood-color` 和 `flood-opacity` 属性来控制填充的颜色和不透明度。
-   **`feTurbulence`** **（湍流）** ：用于创建湍流纹理。可以通过调整 `type`、`baseFrequency` 和 `numOctaves` 属性来控制湍流的类型、频率和数量。
-   **`feImage`** **（图像）** ：用于在图像中嵌入外部图像。可以通过调整 `xlink:href` 和 `preserveAspectRatio` 属性来控制外部图像的路径和保持方面比。
-   **`feTile`** **（平铺）** ：用于对图像进行平铺处理。可以通过调整 `in` 和 `result` 属性来控制输入和输出的图像。
-   **`feOffset`** **（偏移）** ：用于对图像进行偏移处理。可以通过调整 `dx` 和 `dy` 属性来控制水平和垂直方向的偏移量。
-   **`feComposite`** **（合成）** ：用于对多个图像进行合成处理。可以通过调整 `operator`、`in` 和 `result` 属性来控制合成的方式和输入输出。
-   **`feMerge`** **（合并）** ：用于将多个图像合并为一个图像。可以通过调整 `in` 子元素来控制输入图像。

  


这些滤镜基元可以单独使用或组合使用，以创建各种复杂的图形效果。通过调整它们的属性值和组合方式，可以实现各种视觉效果，如模糊、阴影、颜色调整等。

  


## SVG 滤镜基元

  


在 SVG 中，每个 `<filter>` 元素包含一组滤镜基元作为其子元素。每个滤镜基元对一个或多个输入执行单个基本图形操作，产生一个图形结果。

  


滤镜基元的命名与其执行的图形操作相对应。例如，将高期模糊效果应用于源图形的基元称为 `feGaussianBlur` 。所有滤镜基元都共享相前的前缀：`fe` ，即滤镜效果（Filter Effect）。到目前为止，[SVG 滤镜规范定义了 17 种不同的滤镜基元](https://www.w3.org/TR/filter-effects-1/#FilterPrimitivesOverview)，能够实现各种不同的图形效果，包括但不限于噪声和纹理生成、光照效果、颜色操作等。

  


| **滤镜基元名称**   | **滤镜基元描述**      |
| -----------------| ------------------- |
| ***`feBlend`***  | 混合两个图层。         |
| ***`feColorMatrix`***       | 改变输入颜色。用于控制色调、饱和度和亮度。 |
| ***`feComponentTransfer`*** | 为每个像素重新映射颜色。用于调整亮度、对比度、色彩平衡和阈值。与 `feFuncA`、`feFuncR`、`feFuncG`、`feFuncB` 一起使用。`feFuncA`、`feFuncR`、`feFuncG`、`feFuncB`：定义输入图形的 Alpha、红、绿和蓝分量的转换函数。输入图形在 `feComponentTransfer` 中定义。 |
| ***`feComposite`***         | 组合 2 个输入<br />   `over`：`in` 放在 `in2` 的前面。<br /> `in`：`in` 和 `in2` 的重叠部分渲染 `in` 图形。<br />`atop`：`in` 和 `in2` 的重叠部分渲染 `in` 图形。不重叠的 `in2` 区域被渲染。<br />`out`：不重叠 `in2` 的 `in` 区域被渲染。 <br />`xor`：不重叠的 `in` 和 `in2` 区域被渲染。<br/ > `lighter`：`in` 和 `in2` 的总和被渲染。<br /> `arithmetic`：用于将 `feDiffuseLighting` 和 `feSpecularLighting` 滤镜的输出与纹理数据组合在一起。每个像素的计算公式为：`result = k1i1i2 + k2i1 + k3i2 + k4`。`i1` 和 `i2` 分别表示输入图像的相应像素通道值，它们映射到 `in` 和 `in2`。`k1`、`k2`、`k3` 和 `k4` 表示具有相同名称的属性的值。 |
| ***`feConvolveMatrix`***    | 将输入图像的像素与相邻像素组合。用于模糊、锐化、浮雕和斜面。      |
| ***`feDiffuseLighting`***   | 使用 Alpha 通道作为凹凸图来照亮图像。与 `fePointlight` 和 `feSpotlight` 一起使用。<br />   `fePointlight`：定义光源，可以创建点光源效果。<br /> `feSpotlight`：定义光源。    |
| ***`feDisplacementMap`***   | 用于将图像轮廓到纹理。   |
| ***`feDropShadow`***        | 对输入图像进行投影阴影处理。    |
| ***`feFlood`***             | 用颜色填充滤镜区域。       |
| ***`feGaussianBlur`***      | 对输入图像进行模糊处理。  |
| ***`feImage`***             | 图像元素的滤镜版本（具有相同的属性）。它从外部源获取图像数据，并提供像素数据作为输出（如果外部源是 SVG，则对其进行栅格化）。 |
| ***`feMerge`***             | 同时应用滤镜效果，而不是顺序应用。与 `feMergeNode` 一起使用。`feMergeNode` 获取另一个滤镜的结果。  |
| ***`feMorphology`***        | 侵蚀或膨胀输入图像。用于增大或减小。   |
| ***`feOffset`***            | 平移图像。用于创建阴影。    |
| ***`feSpecularLighting`***  | 使用 Alpha 通道作为凹凸图来照亮图像。生成的图像是基于光线颜色的 RGBA 图像。光照计算遵循 Phong 光照模型的标准镜面成分。生成的图像取决于光线颜色、光线位置和输入凹凸图的表面几何形状。光照计算的结果被添加。滤镜基元假定观察者在 `z` 方向上处于无限远处。生成的图像包含光照计算的镜面反射部分。与使用算术 `feComposite` 方法的添加项纹理一起使用。与 `fePointlight` 和 `feSpotlight` 一起使用。`fePointlight` 定义了一个光源，可以创建点光源效果。`feSpotlight` 定义了一个光源。 |
| ***`feTile`***              | 用输入图像的重复平铺模式填充目标矩形。   |
| ***`feTurbulence`***        | 使用 Perlin 涡流函数创建图像。用于制作纹理。  |

  


每个滤镜基元通过接收一个源图形作为输入，并输出另一个源图形来工作。一个滤镜效果的输出可以用作另一个效果的输入。这非常重要和强大，因为这意味着你几乎可以无限组合滤镜效果，从而创建几乎无限数量的图形效果。

  


每个滤镜基元可以接受一个或两个输入，并且仅输出一个结果。滤镜基元的输入在名为 `in` 的属性中定义。操作的结果在 `result` 属性中定义。如果滤镜效果需要第二个输入，则将第二个输入设置在 `in2` 属性中。操作的结果可以用作任何其他操作的输入，但是如果操作的输入未在 `in` 属性中指定，则自动使用前一个操作的结果作为输入。如果不指定基元的结果，则其结果将自动用作接下来的基元的输入。

  


除了使用其他基元的结果作为输入外，滤镜基元还接受其他类型的输入，其中最重要的是：

  


-   `SourceGraphic`：将整个滤镜应用于的元素；例如，一个图像或一段文本。
-   `SourceAlpha`：与`SourceGraphic`相同，只是这个图形仅包含元素的Alpha通道。例如，对于JPEG图像，它是一个大小与图像本身相同的黑色矩形。

  


你会发现，有时你会想要使用源图形作为输入，有时只想使用其Alpha通道。

  


接下来，我们通过简单的实例来解释这些滤镜基元。注意，在这里我们不会对每个滤镜基元做很详细的阐述，但将会通过真实案例，告诉大家每个基础的使用以及效果。不过，在小册后面还会有很多章节向大家阐述 SVG 滤镜的高级功能。

  


在开始之前，我为大家准备了下面这段代码：

  


```HTML
<svg width="0" height="0">
    <defs>
        <filter 
            id="替换成滤镜基元的名称,当然也可以是任意你喜欢的名称" 
            x="-20%" 
            y="-20%" 
            width="140%" 
            height="140%" 
            filterUnits="objectBoundingBox" 
            primitiveUnits="userSpaceOnUse">
            <!-- 每个滤镜基元的代码将会放置在这里 -->
        </filter>
    </defs>
</svg>

<!-- 应用滤镜的元素 -->
<div class="wrapper">
    <img src="https://picsum.photos/id/124/800/600" alt="" class="filtered" />
    <div class="text">
        <h2 class="filtered">I ❣️ SVG</h2>
    </div>
</div>
```

  


```CSS
.filtered {
    filter: url(#filterIdName);
}
```

  


注意，接下来的示例，请将 `<filter>` 元素中的 `id` 属性替换成滤镜基元的名称或你自己喜欢的名称，同时在 CSS 中将 `filter` 属性 `url()` 函数中的 `#filterIdName` 替换为 `<filter>` 元素的 `id` 值。另外，每个滤镜基元的具体属性参数可以参考 [SVG Filters 在线工具](https://yoksel.github.io/svg-filters/#/)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e1b34616acd4874bd24e606f5fbad2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3352&h=1796&s=703029&e=jpg&b=faf8f8)

  


> URL: https://yoksel.github.io/svg-filters

  


### 高斯模糊：feGaussianBlur

  


高斯模糊（`<feGaussianBlur>`）滤镜是以已故数学家卡尔·弗里德里希·高斯命名，并应用数学函数来模糊图像。它会对输入图像执行高斯模糊。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feGaussianBlur" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feGaussianBlur 
                stdDeviation="3 10" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                edgeMode="none" 
                result="blur" />
        </filter>
    </defs>
</svg>
```

  


上面的代码中，我们在 `<filter>` 元素内嵌套了高斯模糊 `<feGaussianBlur>` ，该滤镜基元的一些属性将会影响产生的模糊效果。

  


-   `stdDeviation` ：用于调整模糊的程度。如果提供了两个值，第一个数字表示沿滤镜元素的 `x` 轴方向的模糊值；第二个数字则表示沿滤镜元素的 `y` 轴方向的模糊值。如果只提供一个数字，则表示 `x` 和 `y` 轴的值相同。`x` 或 `y` 轴中有一个值为 `0` ，则表示模糊只在滤镜元素的一个方向上进行。负值或零值会禁用给定滤镜基元的效果。
-   `edgeMode` ：确定如何根据需要使用颜色值扩展输入图像，以便在内核位于输入图像的边缘或附近时可以应用矩阵操作。它可选的值有 `duplicate` （表示必要时沿着输入图像的每个边界通过复制给定边的颜色值来扩展输入图像） 、 `wrap` （表示通过从图像的相反边获取颜色值来扩展输入图像）和 `none` （表示使用零的像素值对输入图像进行扩展，`R`、`G`、`B` 和 `A` 均为零）
-   `in` ：定义了滤镜将被应用到的位置。它有六个值可选（`SourceGraphic` 、 `SourceAlpha` 、 `BackgroundImage` 、 `BackgroundAlpha` 、 `FillPaint` 、 `StrokePaint` 和 `<filter-primitive-reference>`）。如果未提供值且这是第一个滤镜基元，则此滤镜基元将使用 `SourceGraphic` 作为其输入。如果未提供值且这是后续滤镜基元，则此滤镜基元将使用先前滤镜基元的结果作为其输入。如果未提供值且这是后续滤镜基元，则此滤镜基元将使用先前滤镜基元的结果作为其输入。如果 `result` 的值在给定滤镜元素中出现多次，则对该结果的引用将使用具有给定结果属性值的最近的前一个滤镜基元。不允许对结果进行前向引用，且将被视为未指定结果。对不存在的结果的引用将被视为未指定结果。
-   `result` ：我们用它来命名滤镜。这在使用多个滤镜时作为`in` 的参考很有用。如果未提供值，则仅当该滤镜基元为其 `in` 属性提供值时，输出才可用于作为下一个滤镜基元的隐式输入重复使用 `feGaussianBlur` 滤镜。

  


应用高斯模糊滤镜的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e86ef58b5be041bdbaa601c99897fdf7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1119&s=682155&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/QWRwWVO

  


注意，CSS 的 `filter` 中的 `blur()` 是该滤镜的快捷和简化方式。

  


### 投影阴影：feDropShadow

  


这个滤镜比较简单，它将在元素后面添加一个投影阴影：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feDropShadow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feDropShadow 
                stdDeviation="5 5" 
                in="SourceGraphic" 
                dx="20" 
                dy="20" 
                flood-color="#f36" 
                flood-opacity=".8" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                result="dropShadow"/>
        </filter>
    </defs>
</svg>
```

  


上面的代码中，我们在 `<filter>` 元素内嵌套了高斯模糊 `<feDropShadow>` ，该滤镜基元的一些属性将会影响产生的投影阴影效果。

  


-   `stdDeviation` ：与 `<feGaussianBlur>` 滤镜基元的 `stdDeviation` 属性相似。
-   `dx` ：投影阴影的 `x` 偏移量。此属性将转发到内部 `feOffset` 元素的 `dx` 属性。
-   `dy` ：投影阴影的 `y` 偏移量。此属性将转发到内部 `feOffset` 元素的 `dy` 属性。
-   `flood-color` ：投影阴影的颜色。此属性将转发到内部 `feFlood` 元素的 ` flood-color  `属性。
-   `flood-opacity` ：投影阴影的不透明度。此属性将转发到内部 `feFlood` 元素的 `flood-opacity` 属性。
-   `in` ：与 `<feGaussianBlur>` 滤镜基元的 `in` 属性相似
-   `result` ：如果提供，则由于处理此滤镜基元而产生的图形可以由同一滤镜元素中后续滤镜基元的 `in` 属性引用。如果未提供值，则仅当该滤镜基元为其 `in` 属性提供值时，输出才可用于作为下一个滤镜基元的隐式输入重复使用 `FeDropShadow` 滤镜

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07069547df6d4ae8a00de77d271d8e08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=921213&e=jpg)

  


> Demo 地址：https://codepen.io/airen/full/zYQxYgX

  


### 形态学：feMorphology

  


> 形态学是研究形状和结构的学科

  


`<feMorphology>` 主要用于改变图形元素的形状，例如通过膨胀（Dilation）或腐蚀（Erosion）操作来调整边缘或整体形态。它特别适用于增大或减小 Alpha 通道。其主要属性有：

  


-   `operator` ：该属性可接受的值有 `dilate` 和 `erode` 以及一个半径，用于定义膨胀（变胖）或腐蚀（变瘦）的程度。膨胀（或腐蚀）核是一个宽度为 `2*x` 半径，高度为 `2*y` 半径的矩形。在膨胀中，输出像素是输入图像核矩形中相应 `R`、`G`、`B`、`A` 值的分量最大值。在腐蚀中，输出像素是输入图像核矩形中相应 `R`、`G`、`B`、`A` 值的分量最小值。
-   `radius` ：操作的半径（或半径）。如果提供两个数值，第一个数字表示 `x` 半径，第二个值表示 `y` 半径。如果提供一个数字，则该值用于 `x` 和 `y`。如果未指定属性，则效果就像指定了值为 `0` 一样。负值或零值将禁用给定滤镜基元的效果。
-   `in` ：与 `feGaussianBlur` 的 `in` 属性类似
-   `result` ：与 `feGaussianBlur` 的 `result` 类似

  


我们首先来看膨胀的效果，即 `operator="dilate"` ：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feMorphology" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feMorphology 
                operator="dilate" 
                radius="3 3" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="morphology"/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9108f3650e074df09f432285f96b2b41~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=727111&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/OJYPPpz

  


将上面示例中 `operator` 替换为 `erode` ，就是腐蚀的效果：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feMorphology" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feMorphology 
                operator="erode" 
                radius="3 3" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="morphology"/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aff8cafa92d54b8bb1c538f2da47073c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=743970&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/JjqooyG

  


从这些结果中，我们可以看到，与侵蚀产生的变暗而低调的图像相比，膨胀产生了一个更加生动的图像。亮度是由于图像的像素扩展导致的，反之亦然。拿示例中的文本为例，膨胀和侵蚀使文本变得更胖或更瘦：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1624ff0ebe6146538ce3e627e670579c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1906&s=1207115&e=jpg)

  


### **湍流：** feTurbulence

  


`<feTurbulence>` 用于在图形中生成类似紊乱、波动或湍流效果的纹理。即，它会生成随机噪声图案，常用于创造自然的纹理外观，如云朵、火焰或水流的效果。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feTurbulence" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTurbulence 
                type="turbulence" 
                baseFrequency="0.01 0.02" 
                numOctaves="1" 
                result="turbulence" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c484e1193ac2438998f6c78ae3d9507b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=1132978&e=jpg&b=7d8511)

  


> Demo 地址：https://codepen.io/airen/full/vYwEEpZ

  


上面这个示例，仅在 `<feTurbulence>` 中使用了`baseFrequency` 和 `numOctaves` 两个属性。其中，`baseFrequency` 属性控制 `x` 和 `y` 方向的扭曲或噪声量。较高的 `baseFrequency` 值会减小扭曲图案的大小。它可以包含两个值，如果只使用一个值，则覆盖 `x` 和 `y` 轴。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47819af9eb67472cb6b31d86440f5945~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=735&s=1150308&e=jpg&b=ffffff)

  


`numOctaves` 也是一个噪声函数，控制滤镜效果中的八度数（八度音阶）。使用 `"0.01 0.02"` 的`baseFrequency`，我们得到以下结果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8599682e6ba4f71b6382c273080ca6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1695&s=1925914&e=jpg&b=8a8c42)

  


`<FeTurbulence>` 除了`baseFrequency` 和 `numOctaves` 两个属性之外，还有其他几个常用属性：

  


-   `seed` ：伪随机数生成器的起始数字，起始值为 `0`
-   `stitchTiles` ：可选 值为 `stitch` 和 `noStitch` 。如果值为 `noStitch`，则不会尝试在包含湍流函数的图块的边界上实现平滑过渡。有时结果会在图块边界显示明显的不连续性。
-   `type`：指示滤镜基元应执行噪声还是湍流函数。可选的值：`fractalNoise` 和 `turbulence`
-   `result` ：与前面所介绍的滤镜基元的 `result` 属性相似

  


### 位移映射：feDisplacementMap

  


`<feDisplacementMap>` 用于根据一个图像（即所谓的位移图）来改变另一个图像像素的位置，从而实现视觉上的扭曲或位移效果，常用于创造水波纹、烟雾、波动文字等动态或失真视觉效果。

  


对于这个 SVG 滤镜基元，我们需要两个输入： `in` 和 `in2` ，其中一个保存原始图形，另一个作为位移图的图像。它会使用来自 `in2` 图像的像素值来空间位移来自 `in` 的图像：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feDisplacementMap" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTurbulence 
                type="turbulence" 
                baseFrequency="0.01 0.02" 
                numOctaves="1" 
                result="noise" />
            <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="50" 
                xChannelSelector="R" 
                yChannelSelector="B" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                result="displacementMap"/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be490ff33141468493c23d88e9b9b8f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=997546&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/RwmNPZe

  


在这个示例中，我们应用了两个滤镜基元，其中将 `<feTurbulence>` 滤镜基元创建的效果作为 `<feDisplacementMap>` 滤镜基元的 `in2` 值（位移图的图像）。你看到的效果，图像将会遵循 `<feTurbulence>` 滤镜基元创建的扭曲图案。

  


`<feDisplacementMap>` 滤镜基元除了`in` 和 `in2` 属性之外，还包括下面这些常见属性：

  


-   `scale` ：位移比例因子。当此属性的值为 `0` 时，此操作对源图像没有影响。
-   `xChannelSelector` ：值为 `R` 、`G` 、 `B` 和 `A` ，指定要使用来自 `in2` 的哪个通道来沿 `x` 轴位移 `in` 中的像素。
-   `yChannelSelector` ：类似于 `xChannelSelector` ，它用来指定要使用来自 `in2` 的哪个通道来沿 `y` 轴位移 `in` 中的像素。

  


在此基础上，我们还可以使用 SVG 的 `<animate>` 让 `feDisplacementMap` 创建的水波纹动起来：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feDisplacementMap" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTurbulence 
                id="turbulence" 
                type="turbulence" 
                baseFrequency="0.01 0.02" 
                numOctaves="1" 
                result="noise" />
            <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="50" 
                xChannelSelector="R" 
                yChannelSelector="B" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                result="displacementMap"/>
            <animate 
                xlink:href="#turbulence" 
                attributeName="baseFrequency" 
                dur="60s" 
                keyTimes="0;0.5;1"
                values="0.01 0.02;0.02 0.04;0.01 0.02" 
                repeatCount="indefinite" />
        </filter>
    </defs>
</svg>
```

  


注意，`<feTurbulence>` 滤镜基元有一个 `id` ，我们使用 `<animate>` 的 `xlink:href` 引用了 `<feTurbulence>` 滤镜基元的 `id` ，将对该滤镜进行动画化处理。然后是 `attributeName` 属性，指定对 `<feTurbulence>` 滤镜基元的 `baseFrequency` 属性进行动画处理。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b39566f2708846658221833af0d9106f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1462&h=462&s=5665826&e=gif&f=34&b=72790c)

  


> Demo 地址：https://codepen.io/airen/full/pomvjrd

  


你可能会好奇，这个水波纹怎么就动起来了是吧。在这个示例中，动画效果都来源于 SVG 的 `<animate>` 元素，它的各属性控制了整个动画效果。你现在不明白示例中 `<animate>` 元素每个属性的功能，并不要紧，小册后续会有专门的课程向大家阐述，到时你也可以轻易使用它来制作你想要的动画效果。

  


### 颜色矩阵：feColorMatrix

  


`<feColorMatrix>` 滤镜基元通过输入图形的每个像素上的 RGBA 颜色和 Alpha 修正 应用矩阵变换，以产生具有新的RGBA 颜色和 Alpha 值集合的结果。简单地说，它是通过矩阵运算来调整图像颜色。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/131a8d3d60904669bca3de0705cd10fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=582&s=9887383&e=gif&f=304&b=fbfbfb)

  


`<feColorMatrix>` 滤镜基元包括 `in` 、`result` 、 `type` 和 `value` 等属性值，其中 `in` 和 `result` 与前面所介绍的滤镜基元是相似的，这里单独将 `type` 和 `value` 拎出来介绍 ：

  


-   `type` ：可选值包括 `matrix`、`saturate`、`hueRotate` 和 `luminaceToAlpha` 。主要用于指定颜色矩阵操作的类型。其中关键字 `matrix` 表示将提供完整的 `5x4` 值矩阵。其他关键字代表方便的快捷方式，允许执行常用的颜色操作，而无需指定完整的矩阵。
-   `values` ：其内容取决于 `type` 属性的值。对于 `matrix`，`values` 是由空格和 `/` 或逗号分隔的 `20` 个矩阵值的列表（`5x4` 值矩阵）；对于 `hueRotate`，`values` 是一个实数值（度数）；对于 `luminanceToAlpha`，`values` 不适用。如果未指定属性，则默认行为取决于属性 `type` 的值。如果是 `matrix`，则此属性默认为单位矩阵。如果是 `saturate`，则此属性默认为值 `1`，这会产生单位矩阵。如果是 `hueRotate`，则此属性默认为值 `0`，这会产生单位矩阵。

  


首先来看 `type` 为 `matrix` 值的效果（它是 `type` 的默认值，也是最复杂的一种操作类型）：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feColorMatrix" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feColorMatrix 
                type="matrix" 
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="colormatrix"/>
        </filter>
    </defs>
</svg>
```

  


乍一看语法似乎相当复杂，但将其可视化如下可能会有所帮助：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5984dbc5e9074c65840079bdf7c1b34f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=990301&e=jpg&b=fefdfd)

  


色彩矩阵网格 `x` 轴代表我们原始图像的通道（`R`、`G`、`B` 和 `A`），`y` 轴代表我们可以添加或移除这些通道的颜色。`x` 轴上的最后一个值是乘法因子，目前我们暂时不必太担心它。

  


正如上图所示，这是一个未编辑的普通图像的矩阵。`R` 、`G` 、`B` 和 `A` 值都在它们各自的通道中，所以红色像素保持红色，绿色像素保持绿色，以此类推。最终你会发现，上面这个滤镜，并不会改变图像的颜色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b930b34f6cf4cceb27d2884b58457b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=822469&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/WNBbQMO

  


为了给图像着色，我们可以在其他通道中引入不同量的红（`R`）、绿（`G`）或蓝（`B`）。例如，我们可以通过从所有通道中移除除了一个之外的红、绿、蓝，将彩色图像转为灰阶：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feColorMatrix" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feColorMatrix 
                type="matrix" 
                values="1 0 0 0 0
                        1 0 0 0 0
                        1 0 0 0 0
                        0 0 0 1 0" 
                 x="0%" 
                 y="0%" 
                 width="100%" 
                 height="100%" 
                 in="SourceGraphic" 
                 result="colormatrix"/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1faf244490e646b5bb8fd83b9ffa47ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=931039&e=jpg&b=fefefe)

  


这个时候你看到的图像呈灰色状态：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dba3609eabe34ab69a6518f922a61462~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=731368&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/VwOYeyp

  


如果你不想花太多心思去了解这些数学计算的话，那么可以尝试使用 [@Ana Tudor 写的小工具](https://codepen.io/thebabydino/full/LYamwrz)，该工具可以使你快速获得想要的颜色滤镜效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aae62a9076134bbca2c3ebf69b6ee846~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326&h=576&s=2299733&e=gif&f=159&b=1e253c)

  


> URL：https://codepen.io/thebabydino/full/LYamwrz

  


当然，你也可以尝试着手动调整 `feColorMatrix` 的 `values` 的值，看看你能得到什么颜色！

  


`feColorMatrix` 的 `type` 除了 `matrix` 之外，还有 `saturate` 、`hueRotate` 和 `luminaceToAlpha` ，相比而言，它们要比 `matrix` 简单地多。

  


例如 `type` 为 `saturate` 。它会使用 `0 ~ 1` 之间的值来控制图像中黑白的数量：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feColorMatrix" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feColorMatrix 
                type="saturate" 
                values=".5" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="colormatrix"/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aa1a3f725364049b92082c96eb938eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=793118&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/ExzaPJy

  


接下来是 `hueRotate`。该属性按照颜色的色相值来调整颜色，其值为 `0 ~ 360` 度 ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11909a11ee674d109041420ab341890c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=378698&e=jpg&b=88c3cf)

  


例如，`type` 为 `hueRotate` 时，`values` 的值为 `60` ，则表示图像中的每种颜色的色相旋转 `60` 度：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feColorMatrix" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feColorMatrix 
                type="hueRotate" 
                values="60" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="colormatrix" />
        </filter>
    </defs>
</svg> 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24b0e163da344fa08682ca386e54a88d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=823161&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/ZENYWEG

  


最后一种类型是 `luminaceToAlpha`。这基本上是通过移除 Alpha 通道，使图像变成半透明的负片效果。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feColorMatrix" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feColorMatrix 
                type="luminanceToAlpha" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="colormatrix" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94ca6b650d64c4cbe6329b78670a3e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=757940&e=jpg&b=7a820d)

  


> Demo 地址：https://codepen.io/airen/full/qBGEZEj

  


### 卷积矩阵：feConvolveMatrix

  


`<feConvolveMatrix>` 应用卷积矩阵将输入图像中的像素与相邻像素结合，产生结果图像。通过卷积矩阵滤镜可以实现各种图像操作，包括模糊、边缘检测、锐化、浮雕等效果。

  


卷积矩阵基于一个 `n × m` 矩阵（卷积核），描述了如何将输入图像中的给定像素值与其相邻像素值结合以产生结果像素值。每个结果像素由将核矩阵应用于相应的源像素及其相邻像素确定。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/083fdf4c3bff4b548cb8523982c35f96~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=344&s=939338&e=gif&f=219&b=fefdfd)

  


例如：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feConvolveMatrix" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feConvolveMatrix 
                order="3 3" 
                kernelMatrix="1 -4 1 
                              1 0 -8 
                              1 0 -4" 
                divisor="2" 
                bias="1.2" 
                targetX="1" 
                targetY="1" 
                edgeMode="duplicate" 
                preserveAlpha="true" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="convolveMatrix"  />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9742d53777047adaf4d759787a4e315~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=1064717&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/oNRgxjG

  


`<feConvolveMatrix>` 滤镜基元的主要属性有：

  


-   `order` ：指示 `kernelMatrix` 中每个维度的单元格数。提供的值必须是大于零的整数。不是整数的值将被截断，即四舍五入为最接近零的整数值。第一个数字 `<orderX>` 表示矩阵中的列数。第二个数字 `<orderY>` 表示矩阵中的行数。如果未提供 `<orderY>`，则默认为 `<orderX>`。建议仅使用较小的值（例如 `3`）；较高的值可能导致非常高的 CPU 开销，并且通常不会产生能够证明对性能影响的结果。
-   `kernelMatrix` ：构成卷积核矩阵的数字列表。值由空格字符和 `/` 或逗号分隔。列表中的条目数必须等于 `<orderX>` 乘以 `<orderY>`。
-   `divisor` ：将 `kernelMatrix` 应用于输入图像以产生数字后，将该数字除以除数以产生最终的目标颜色值。除数是所有矩阵值的总和，往往会对结果的整体颜色强度产生均衡效果。如果指定的除数为零，则将使用默认值。缺省值为 `kernelMatrix` 中所有值的总和，但如果总和为零，则除数将设置为 `1`。
-   `bias` ：将 `kernelMatrix` 应用于输入图像以产生数字并应用除数后，将偏差属性添加到每个分量。偏差的一种应用是当希望 `.5` 灰度值成为滤镜的零响应时。偏差属性调整了滤镜的范围。这允许表示否则将被限制为 `0` 或 `1` 的值。
-   `targetX` ：确定卷积矩阵在给定输入图像中的目标像素相对于 `x` 的定位。矩阵的最左列是列号零。该值必须满足：`0 <= targetX < orderX`。默认情况下，卷积矩阵在 `x` 上居中于输入图像的每个像素上（即，`targetX = floor(orderX / 2)`）。
-   `targetY` ：确定卷积矩阵在给定输入图像中的目标像素相对于 `y` 的定位。矩阵的最顶行是行号零。该值必须满足：`0 <= targetY < orderY`。默认情况下，卷积矩阵在 `y` 上居中于输入图像的每个像素上（即，`targetY = floor(orderY / 2)`）。
-   `edgeMode` ：可选的值有 `duplicate` 、 `wrap` 和 `none` 。确定在必要时如何扩展输入图像以使得在卷积核定位在或接近输入图像边缘时可以应用矩阵操作。`duplicate` 表示根据需要沿着输入图像的每个边界扩展输入图像，通过复制输入图像给定边缘的颜色值来实现；`wrap` 表示通过从图像的相反边缘获取颜色值来扩展输入图像；`none` 表示使用 `R`、`G`、`B` 和 `A` 的零像素值来扩展输入图像。
-   `preserveAlpha` ：可选值为 `false` 或 `true` 。`false` 表示卷积将应用于所有通道，包括 Alpha 通道；`true` 表示卷积将仅应用于颜色通道。在这种情况下，滤镜将临时解除颜色组件值的预乘并应用核。

  


### 组件转移：feComponentTransfer

  


`<feComponentTransfer>` 滤镜基元有点类似于 `<feColorMatrix>` ，但每个颜色通道（RGBA）都是一个单独的函数，通过操作这些通道上的颜色值来实现诸如亮度调整、对比度变化、色彩平衡或阈值等效果。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feComponentTransfer" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="componentTransfer">
                <feFuncR type="discrete" tableValues="0 0.5 0 1" />
                <feFuncG type="discrete" tableValues="0 0.5 0 1" />
                <feFuncB type="discrete" tableValues="0 0.5 0 1" />
                <feFuncA type="discrete" tableValues="0 0.5 0 1" />
            </feComponentTransfer>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d6ead8e20d24df29a23cda3260f9e37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=949307&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/zYQxqjd

  


`<feComponentTransfer>` 滤镜基元将会按照以下方式执行数据的逐分量重新映射：

  


```
R = feFuncR( R )
G = feFuncG( G )
B = feFuncB( B )
A = feFuncA( A )
```

  


-   `feFuncR` ：输入图形的红色分量的传输函数
-   `feFuncG` ：输入图形的绿色分量的传输函数
-   `feFuncB` ：输入图形的蓝色分量的传输函数
-   `feFuncA` ：输入图形的 Alpha 分量的传输函数

  


`feFuncR`、`feFuncG`、`feFuncB`、`feFuncA` 元素的集合也称为传输函数元素。对于每个像素。它允许进行亮度调整、对比度调整、颜色平衡或阈值处理等操作。例如上面示例：

  


```XML
<feFuncR type="discrete" tableValues="0 0.5 0 1" />
<feFuncG type="discrete" tableValues="0 0.5 0 1" />
<feFuncB type="discrete" tableValues="0 0.5 0 1" />
<feFuncA type="discrete" tableValues="0 0.5 0 1" />
```

  


例如，在红色通道中（`feFuncR`），颜色强度范围是 `0 ~ 1` 。我们选择了四个值，所以 `1` 被除以 `4` 。现在我们有四个相等的红色范围： `0 ~ 0.25` （被分配为 `0`）、`0.25 ~ 0.5` (被分配为 `0.5`) 、`0.5 ~ 0.75` （被分配为 `0`） 和 `0.75 ~ 1` （被分配为 `1`）。

  


在 `0 ~ 0.25` 的任何红色值都会被分配到表值中的第一个值，依此类推。对于多达 `10` 个值，使用相同的原理。

  


注意，`feFuncR`、`feFuncG`、`feFuncB`、`feFuncA` 元素的属性会随着 `type` 属性值不同，也会有所差异：

  


```XML
<feFuncR type="table" tableValues="0 0.5 0 1"/>
<feFuncG type="discrete" tableValues="0 0.5 0 1"/>
<feFuncB type="linear" slope="1" intercept="0"/>
<feFuncA type="gamma" amplitude="1" exponent="1" offset="0"/>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f55e97f859a4afd82456dad6dac6256~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=1100274&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/yLWyMaQ

  


-   `tableValues` ：当 `type` 为 `table` 或 `discrete` 时，由空格和 `/` 或逗号分隔的数值列表，定义了查找表。空列表将导致一个身份传输函数（等同于 `type` 为 `identity`）。如果未指定该属性，则效果等同于提供了一个空列表。
-   `slope` ：当 `type` 为 `linear` 时，线性函数的斜率。
-   `intercept` ：当 `type` 为 `linear` 时，线性函数的截距。
-   `amplitude` ：当 `type` 为 `gamma` 时，伽马函数的振幅。
-   `exponent` ：当 `type` 为 `gamma` 时，伽马函数的指数。
-   `offset` ：当 `type` 为 `gamma` 时，伽马函数的偏移量。

  


相比而言，`type` 为 `table` 时，它对图像的对比度会进行更细微的更改。例如，使用上面相同的 `tableValues` 值，只将 `type` 从 `discrete` 调整为 `table` ：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feComponentTransfer" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="componentTransfer">
                <feFuncR type="table" tableValues="0 0.5 0 1" />
                <feFuncG type="table" tableValues="0 0.5 0 1" />
                <feFuncB type="table" tableValues="0 0.5 0 1" />
                <feFuncA type="table" tableValues="0 0.5 0 1" />
            </feComponentTransfer>
        </filter>
    </defs>
</svg>
```

  


效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad86755406944457a18454344de9874c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1885&s=1568556&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/wvbBJgy

  


我们可以使用这个滤镜基元创建双色调效果。双色调意味着两种颜色，因此我们在 `tableValues` 中为每个通道使用两个颜色值。

  


我们需要两种颜色，让我们选择 `#A91C93` （相当于 `rgb(169 28 147)`）和 `#8EE3FF` （相当于 `rgb(255 142 227)`）。接下来，我们需要将 `R`、`G` 和 `B` 值除以 `255`，以获得 `0 ~ 1` 范围内的值。这些值将放入 `tableValues` 中。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feComponentTransfer" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="componentTransfer">
                <feFuncR type="table" tableValues="0.662745098 1" />
                <feFuncG type="table" tableValues="0.109803922 0.556862745" />
                <feFuncB type="table" tableValues="0.576470588 0.890196078" />
            </feComponentTransfer>
        </filter>
    </defs>
</svg>
```

  


然后我们得到了这个：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b2b3c9f0f0244f78268850f79a77a60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2177&s=1469514&e=jpg&b=7d850c)

  


> Demo 地址：https://codepen.io/airen/full/QWRwppB

  


以此类推，可以创建更多颜色调的效果。

  


还有第三种控制图像对比度的方法，那就是 `type` 为 `gamma`。此时，它带有另外三个属性：`exponent`、`amplitude` 和 `offset`。

  


-   `amplitude` ：增加该指数会使图像中亮的区域变得更亮
-   `exponent` ：增加该指数值为会使图像中暗的区域变得更暗
-   `offset` ：它会为图像添加白色调，其值介于 `0 ~ 1` 之间

  


增加指数会使图像中变暗的区域变得更加黑暗。而振幅则相反，会增亮图像中已经亮的区域。

偏移量会为图像添加白色色调，其值介于 0 和 1 之间。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feComponentTransfer" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="componentTransfer">
                <feFuncR type="gamma" exponent="1.9" amplitude="1.9" offset="0" />
                <feFuncG type="gamma" exponent="1.9" amplitude="1.9" offset="0" />
                <feFuncB type="gamma" exponent="1.9" amplitude="1.9" offset="0" />
            </feComponentTransfer>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7618008869c0419aac6b7689778bf45b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=1020199&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/pomverq

  


除此之外，还可以将 `type` 指定为 `linear` ，通过调整斜率（`slope`）和截距（`intercept`）来改变图像的颜色和对比度，从而产生视觉上的效果变化。具体来说：

  


-   斜率（`slope`）：斜率决定了线性函数的变化速率。在颜色通道的线性组件转换中，斜率决定了颜色通道的增益或衰减速度。斜率越大，颜色通道的变化速率就越快，图像的对比度也会增加；斜率越小，颜色通道的变化速率就越慢，图像的对比度也会减少。
-   截距（`intercept`）：截距决定了线性函数在坐标轴上的截距位置。在颜色通道的线性组件转换中，截距决定了颜色通道的亮度偏移量。截距为正数时，图像的亮度会增加；截距为负数时，图像的亮度会减少。截距的绝对值越大，对图像亮度的影响越显著。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feComponentTransfer" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="componentTransfer">
                <feFuncR type="linear" slope="1.2" intercept="0.2" />
                <feFuncG type="linear" slope="1.2" intercept="0.4" />
                <feFuncB type="linear" slope="0.6" intercept="-0.6" />
            </feComponentTransfer>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5dd2f6a043247a6b92bc8cf6700c322~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=861304&e=jpg&b=7e860d)

  


> Demo 地址：https://codepen.io/airen/full/NWVPpwB

  


### 偏移：feOffset

  


`<feOffset>` 滤镜基元相对比较简单，它通过指定的向量将输入图像相对于图像空间中的当前位置进行偏移。其主要属性：

  


-   `dx` ：沿 `x` 轴偏移输入图形的量。如果未指定该属性，则效果等同于指定了值 `0`。
-   `dy` ：沿 `y` 轴偏移输入图形的量。如果未指定该属性，则效果等同于指定了值 `0`。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feOffset" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feOffset 
                dx="20" 
                dy="20" 
                x="0%" 
                y="0%" 
                width="100%" 
                height="100%" 
                in="SourceGraphic" 
                result="offset"/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dfcff11a50f4358a088153a9ce3bb98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=859661&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/GRagWyM

  


可以使用 `<feOffset>` 和 `<feGaussianBlur>` 元素结合起来创建一个美观的滤镜效果，比如阴影效果。下面是一个示例代码：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feOffset" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <!-- 先进行偏移 -->
            <feOffset dx="5" dy="5" in="SourceAlpha" result="offsetResult" />
    
            <!-- 对偏移后的图像进行高斯模糊 -->
            <feGaussianBlur in="offsetResult" stdDeviation="3" result="blurResult" />
    
            <!-- 将模糊后的图像与原始图像叠加，产生阴影效果 -->
            <feMerge>
                <feMergeNode in="blurResult" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


在这个示例中：

  


-   `<feOffset>` 用于对输入图像进行偏移，创建阴影的偏移效果。在此示例中，`dx="5"` 和 `dy="5"` 分别指定了阴影在水平和垂直方向的偏移量。
-   `<feGaussianBlur>` 用于对偏移后的图像进行高斯模糊处理，使阴影看起来更加柔和。`stdDeviation` 属性指定了模糊的程度。
-   最后，使用 `<feMerge>` 将模糊后的图像与原始图像叠加，产生最终的阴影效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c8ab1aee683473f9819e3f866300616~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=934625&e=jpg)

  


> Demo 地址：https://codepen.io/airen/full/JjqoNEy

  


### 合并：feMerge

  


`<feMerge>` 滤镜基元正如其名，在 SVG 中用于将多个滤镜效果合并到一起。换句话说，它可以将两个或多个元素层叠在一起。每一个层都是主要 `<feMerge>` 基元内的一个 `<feMergeNode>` 。进一步说，它使用覆盖运算符将输入图像层叠在彼此之上，其中 `input1` （对应于第一个 `<feMergeNode>` 子元素）位于底部，而最后指定的输入 `inputN` （对应于最后一个 `<feMergeNode>` 子元素）位于顶部。许多效果会产生一些中间层，以创建最终的输出图像。

  


也就是说，每个 `<feMerge>` 元素可以具有任意数量的 `<feMergeNode>` 子元素，每个子元素都有一个 `in` 属性。

  


我们来看一个实例。

  


首先将 `<feOffset>` 滤镜基元的 `in` 属性指定为 `SourceAlpha` ，它将创建一个与图像尺寸相同的黑色矩形，利用这一点可以为图像创建阴影效果：

  


```XML
<filter id="feMerge" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
    <!-- 先进行偏移 -->
    <feOffset dx="15" dy="15" in="SourceAlpha" result="offsetResult" />
</filter>
```

  


接下来，将应用高斯模糊 `<feGaussianBlur>` 和颜色矩阵 `<feColorMatrix>` 来改变阴影的模糊程度和不透明度：

  


```XML
<feOffset dx="15" dy="15" in="SourceAlpha" result="offsetResult" />
<feGaussianBlur in="offsetResult" stdDeviation="10" result="blur" />
<feColorMatrix type="matrix" in="blur" result="dropshadow" 
    values="1 0 0 0 0
            1 1 0 0 0
            1 0 1 0 0
            0 0 0 0.5 0" />
```

  


此时，我们有一个模糊的半透明图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/542f405e612246f5943d04e51daefdaa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=666268&e=jpg&b=7c840c)

  


最后，使用 `<feMerge>` 进行图层合并，第一个 `<feMergeNode>` 将是顶层，其他的将按照这个顺序进行，最终图形会放在这个阴影之上。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feMerge" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feOffset dx="15" dy="15" in="SourceAlpha" result="offsetResult" />
            <feGaussianBlur in="offsetResult" stdDeviation="10" result="blur" />
            <feColorMatrix type="matrix" in="blur" result="dropshadow" 
                values="1 0 0 0 0
                        1 1 0 0 0
                        1 0 1 0 0
                        0 0 0 0.5 0" />
            <feMerge>
                <feMergeNode in="dropshadow" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


现在，通过组合四个 SVG 滤镜，我们得到了一个更好的阴影！

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a00494cda46459cafd8a50f3b09335a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=953502&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/xxNbdrL

  


### 填充：feFlood

  


`<feFlood>` 滤镜将创建一个矩形，填充了来自 `flood-color` 和 `flood-opacity` 属性指定的颜色和不透明度值。该矩形的大小与由 `<feFlood>` 元素建立的滤镜基元子区域一样大。

  


-   `flood-color` ：指定要用于填充当前滤镜基元子区域的颜色。
-   `flood-opacity` ：定义了要在整个滤镜基元子区域中使用的不透明度值。如果 `flood-color` 值包括 Alpha 通道，则 Alpha 通道会与 `flood-opacity` 属性的计算值相乘。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feFlood" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <!-- 使用 feFlood 创建一个填充整个区域的矩形，并设置颜色和不透明度 -->
            <feFlood flood-color="#ff0000" flood-opacity="0.5" />
          
            <!-- 将 feFlood 产生的矩形与源图像叠加 -->
            <feComposite in2="SourceGraphic" operator="lighter" />
        </filter>
    </defs>
</svg>
```

  


在这个示例中，`<feFlood>` 元素创建了一个填充整个区域的矩形，并设置了颜色为红色 (`#ff0000`)，不透明度为 `0.5`。然后使用 `<feComposite>` 将这个矩形与源图像叠加，产生了一个渐变效果。你可以根据需要调整 `<feFlood>` 元素的属性来创建不同的颜色和不透明度的渐变效果，以实现不同的视觉效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b97bf1db204475aa9638fe231d56055~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=893378&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/KKLwmod

  


### 合成：feComposite

  


`<feComposite>` 滤镜基元会在图像空间中以像素为单位将两个输入图像的合成在一起。合成操作方式主要有：

  


-   应用 Porter-Duff 合成操作之一：`over`、`in`、`atop`、`out`、`xor`、`lighter`
-   应用一个分量级的算术运算（`arithmetic`），其结果会限制在 `0 ~ 1` 范围内

  


算术运算对于将 `<feDiffuseLighting>` 和 `<feSpecularLighting>` 滤镜的输出与纹理数据进行组合非常有用。它也可用于实现溶解效果。

  


其主要属性有：

  


-   `operator` ：指定合成方式，可选的值有 `over`、`in`、`atop`、`out`、`xor`、`lighter` 和 `arithmetic`，其默认值为 `over`
-   `k1`、`k2`、`k3`、`k4` 等属性只适用于 `operator` 为 `arithmetic` 的情况。

  


使用 `<feComposite>` 可以创建吸引人的滤镜效果，比如结合 `<feFlood>` 和 `<feMorphology>`，来创建文本镂空的效果：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feComposite" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feMorphology operator="dilate" radius="2" in="sourceGraphic" result="dilate" />
            <feFlood flood-color="#301934" flood-opacity="0.5" result="flood" />
            <feComposite operator="out" in="flood" in2="dilate" />
        </filter>
    </defs>
</svg>
```

  


简单解释一下上面这段代码：

  


-   `<feMorphology>` 滤镜基元使用膨胀（`dilate`）操作符扩展了输入图形（`sourceGraphic`）的边界，半径为 `2` 像素，结果保存在名为 `dilate` 的图像中。
-   `<feFlood>` 滤镜基元创建了一个填充整个区域的矩形，填充颜色为 `#301934`，不透明度为 `0.5`，结果保存在名为 `flood` 的图像中。
-   `<feComposite>`滤镜基元执行了一个合成操作，将 `<feFlood>` 产生的填充矩形 `floo`" 和 `<feMorphology>` 产生的扩展图像 `dilate` 进行组合。在这里使用了 `out` 操作符，意味着结果图像将是 `flood` 中不与 `dilate` 重叠的部分。这样，最终的效果将是一个带有填充颜色的扩展边界。

  


整个效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3a10d7489414428a35c85534a61cdbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=602132&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/oNRgWay

  


你可以根据需要调整 `<feComposite>` 元素的属性，比如 `operator` 属性，来实现不同的混合效果，从而创建吸引人的滤镜效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ec4166f10534907baff8e6259660e4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=654&s=8320041&e=gif&f=218&b=72790c)

  


我们可以使用 `<feComposite>` 来合成两个图像，并且通过控制一个图像的透明度来模拟溶解的效果。以下是一个示例代码：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feComposite" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <!-- 将第一个图像作为输入 -->
            <feImage xlink:href="https://picsum.photos/id/124/1422/800" result="inputImage1" />
            <!-- 将第二个图像作为输入 -->
            <feImage xlink:href="https://picsum.photos/id/143/1422/800" result="inputImage2" />
            <!-- 将两个图像通过混合操作符 "arithmetic" 进行合成 -->
            <feComposite in="inputImage1" in2="inputImage2" operator="arithmetic" k1="0" k2="12" k3="-0.5" k4="-0.5" x="0%" y="0%" width="100%" height="100%" result="composite"/>
        </filter>
    </defs>
</svg>
```

  


在这个示例中，我们使用 `<feComposite>` 元素将两个图像 `https://picsum.photos/id/124/1422/800` 和 `https://picsum.photos/id/143/1422/800` 进行合成。通过将 `operator` 属性设置为 `arithmetic`，我们告诉浏览器要进行溶解效果的合成。通过调整 `k1` 、 `k2` 、`k3` 和 `k4` 属性值，我们可以控制两个图像之间的溶解程度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d9e25650db5450a86fbec37f8b70904~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1905&s=3026264&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/oNRgWra

  


### 图像：feImage

  


`<feImage>` 滤镜基元引用了一个与该滤镜元素外部的图形，它可以是一张外部的图像，也可以是另一个 SVG 片段的引用。该图形被加载或渲染成 RGBA 光栅，并成为滤镜基元的结果。它生成的图像类似于内置的图像源 `SourceGraphic`，唯一的区别在于图形来自外部源。

  


如果 `xlink:href` 或 `href` 引用了一个独立的图像资源，比如 JPEG、PNG 或 SVG 文件，那么图像资源将根据 `<image>` 元素的行为进行渲染；否则，引用的资源将根据 SVG 元素的行为进行渲染。无论哪种情况，当前用户坐标系取决于滤镜元素上的 `primitiveUnits` 属性的值。`<feImage>` 元素上的 `preserveAspectRatio` 属性的处理与 `<image>` 元素的处理相同。

  


如果 `xlink:href` 或 `href` 引用的是一个空图像（宽度或高度为零）、下载失败、不存在或无法显示（例如，因为它不是支持的图像格式），则会用透明的黑色填充滤镜基元的子区域。

  


前面，我们演示了利用 `<feFlooad>` 和 `<feComposite>` 制作了一个镂空文本的滤镜效果。如果我们把 `<feFood>` 滤镜基元替换成 `<feImage>` 基元，就可以制作一个图片填充文本的效果，有点类似于 `background-clip: text` 的效果：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feImage" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feImage href="https://picsum.photos/id/124/1422/800"  x="0" y="0"preserveAspectRatio="xMidYMid meet" crossOrigin="anonymous" result="image"/>
            <feComposite operator="in" in="image" in2="SourceGraphic" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4891b0ad96a34e8a86463d4f7a6c453e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=662&s=5984300&e=gif&f=245&b=72790c)

  


> Demo 地址：https://codepen.io/airen/full/JjqoJrw

  


我们还可以使用 `<feImage>` 滤镜基元与其他滤镜结合起来制作出一个吸引人的滤镜。以下是一个示例代码，演示了如何使用 `<feImage>` 、`<feComposite>` 和 `<feBlend>` 来创建一个吸引人的滤镜效果：

  


```XML
<svg width="0" height="0">
    <defs>
        <!-- 定义一个引人注目的外部图像 -->
        <image id="externalImage" href="https://picsum.photos/id/110/1422/800" x="0" y="0" preserveAspectRatio="xMidYMid meet"  />
        
        <filter id="feImage" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <!-- 使用外部图像作为第一个输入 -->
            <feImage href="#externalImage" result="externalImage" x="0" y="0" preserveAspectRatio="xMidYMid meet" />
            
            <!-- 使用内部图像作为第二输入 -->
            <feImage href="https://picsum.photos/id/144/1422/800" result="internalImage" x="0" y="0" preserveAspectRatio="xMidYMid meet" />
            
            <!-- 将两个图像通过合成操作符 "arithmetic" 进行合成 -->
            <feComposite in="externalImage" in2="internalImage" operator="arithmetic" k1="0" k2="12" k3="-0.5" k4="-0.5" x="0%" y="0%" width="100%" height="100%" result="composite"/>
            
            <!-- 使用 feBlend 来将合成图形与 SourceGraphic 做混合处理 -->
            <feBlend mode="exclusion" in="composite" in2="SourceGraphic"/>
        </filter>
    </defs>
</svg>
```

  


在这个示例中，我们首先引入了一张由 `<image>` 元素引入的外部图像，并使用 `id` 属性为其命名为 `externalImage` 。然后，我们定义了一个滤镜效果，其中包含了两个 `<feImage>` 元素，第一个引用 `<Image>` 元素引入的图像，并将其结果命名为 `externalImage` ，第二个 `<feImage>` 直接引用外部一张图像，并将其结果命名为 `internalImage` 。接着，使用 `<feComposite>` 元素将 `externalImage` 当作第一个输入源（`in`）和 `internalImage` 当作第二个输入源 （`in2`）进行合成，其操作符 `arithmetic` ，并反合成结果命名为 `composite`。最后，使用 `<feBlend>` 元素将 `<feComposite>` 元素合成结果 `composite` 与当前图形（`SourceGraphic`）进行混合模式处理，混合模式设置为 `exclusion` 。最终效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2b7de0d34024b74831bfb55956efc7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=1246856&e=jpg)

  


> Demo 地址：https://codepen.io/airen/full/pomvwad

  


### 混合：feBlend

  


`<feBlend>` 滤镜基元类似于 CSS 的 `mix-blend-mode` 和 `background-blend-mode` ，它会将两个对象混合在一起，即它对两个输入图像（`in` 和 `in2`）进行逐像素的混合。

  


其混合模式有 `mode` 属性决定，它的值包括 `normal` 、`darken` 、`multiply` 、`color-burn` 、`lighten` 、`screen` 、`color-dodge` 、 `overlay` 、`soft-light` 、`hard-light` 、 `difference` 、`exclusion` 、`hue` 、`saturation` 、`color` 和 `luminosity` 。其中默认值为 `normal` 。

  


下面这个示例，首先使用 `<feTurbulence>` 创建了一个噪音效果，并将其图像做了一个叠加的混合操作：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feBlend" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTurbulence width="1000px" in="SourceGraphic" id="turbulence" type="turbulence" baseFrequency="0.01 0.02" numOctaves="3" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" result="blend" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9f728d1fb384cc6a906d9a2477539db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=1053763&e=jpg)

  


> Demo 地址：https://codepen.io/airen/full/dyEPRLP

  


你也可以尝试着调整 `<feBlend>` 的 `mode` 属性的值，查看不同混合模式下的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8136d3832c484f479df1d23ebeecb320~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=652&s=16649442&e=gif&f=167&b=72790e)

  


> Demo 地址：https://codepen.io/airen/full/dyEPRLP

  


使用 `<animate>` 对 `<feTurbulence>` 添加点动效，整个效果将又完全不一样：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feBlend" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTurbulence width="1000px" in="SourceGraphic" id="turbulence" type="turbulence" baseFrequency="0.01 0.02" numOctaves="3" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" result="blend" />
            <animate href="#turbulence" attributeName="baseFrequency" dur="60s" keyTimes="0;0.5;1" values="0.01 0.02;0.02 0.04;0.01 0.02" repeatCount="indefinite" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb65ce25e7864d27b353202ad876aa59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=654&s=6670645&e=gif&f=45&b=72790d)

  


> Demo 地址：https://codepen.io/airen/full/yLWyoLq

  


### 漫反射光照：feDiffuseLighting

  


> 漫反射光是来自一个大的外部光源的光线。

  


`<feDiffuseLighting>` 滤镜基元使用图像的Alpha 通道作为凹凸贴图（一种向图像添加纹理的图形方法）来照亮图像。这个滤镜基元产生的光图可以使用算术 `<feComposite>` 合成方法的乘法项与纹理图像相结合。可以通过在应用于纹理图像之前将多个这些光图相加来模拟多个光源。

  


光源由 `<feDistantLight>`、`<fePointLight>` 或 `<feSpotLight>` 中的一个子元素定义。光颜色由属性 `lighting-color` 指定。

  


该滤镜基元的常见属性包括：

  


-   `surfaceScale` ：设置表面的高度。如果未指定该属性，则效果相当于指定了值 `1`。
-   `diffuseConstant` ：冯氏光照模型中的 `kd`。这可以是任何非负数。如果未指定该属性，则效果相当于指定了值 `1`。较低的值会使光变暗。
-   `flood-color` ：光的颜色。

  


注意，它的子元素 `<feDistantLight>`、`<fePointLight>` 或 `<feSpotLight>` 具有自己不同的属性。

  


首先来看 `<feDistantLight>` 光源，它定义了一个来自远处的光源。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feDiffuseLighting" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feDiffuseLighting in="SourceGraphic" lighting-color="#00c2cb" diffuseConstant="2">
               <feDistantLight azimuth="100" elevation="15" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
        </filter>
    </defs>
</svg>
```

  


上面代码中应用了两个滤镜基元：`<feDiffuseLighting>` 和 `<feComposite>` ：

  


-   `<feDiffuseLighting>` 滤镜基元用于模拟光照效果，根据光源的位置和方向对图像进行光照。在这个代码片段中，`<feDiffuseLighting>` 的输入是 `SourceGraphic`（即原始图形），光照颜色（`lighting-color`）为 `#00c2cb`（一种蓝绿色），漫反射常数（`diffuseConstant`）为 `2`。光源是一个 `<feDistantLight>` ，它的方位角（`azimuth`）为 `100` 度，俯仰角（`elevation`）为 `15` 度。这个 `<feDiffuseLighting>` 效果创建了一个仿佛有光源照射的图像。
-   `<feComposite>` 滤镜基元用于将两个图像合成为一个。在这个代码片段中，它的输入是 `SourceGraphic`（原始图形）和上一个滤镜基元产生的光照效果。操作符（`operator`）是 `arithmetic`，通过参数 `k1`、`k2`、`k3` 和 `k4` 控制算术运算。这个 `<feComposite>` 效果主要用于创建一个阴影效果，其中原始图形与光照效果进行合成，但没有发生任何颜色变化。

  


整体来说，这段代码创建了一个具有光照效果的图形，并在原始图形上添加了一层阴影效果，使得图形看起来更加立体和生动。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6220004e00d462aba06724964891bff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=895990&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/PovwKGK

  


上面示例，在 `<feDistantLight>` 元素上应用了 `azimuth` 和 `elevation` 两个属性：

  


-   `azimuth` ：指定光源在 `XY` 平面上的方向角度（顺时针），以度为单位，相对于 `x` 轴。即指定光源方位角的度数
-   `elevation` ：指定光源从 `XY` 平面指向 `z` 轴的方向角度，以度为单位。即指定光源俯仰角的度数。注意，正 `z` 轴指向观察者

  


接下来看 `<fePointLight>` 光源。它可以用于模拟一个点光源。点光源是一种光源，其光线从一个点向外辐射，沿着所有方向发射光线。在 SVG 中，`<fePointLight>` 可以用来创建一个在三维空间中具有位置的光源，从而产生更加真实的光照效果。

  


例如，我们沿着 `x` 、 `y` 和 `z` 轴移动光线：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feDiffuseLighting" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feDiffuseLighting in="SourceGraphic" lighting-color="#00c2cb" diffuseConstant="2">
                <fePointLight x="380" y="100" z="40"/>
            </feDiffuseLighting>
            <feComposite in="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
        </filter>
    </defs>
</svg>
```

  


上面代码中的 `<fePointLight>` 元素分别指定了光源的 `x` 坐标为 `380` 、`y` 轴坐标为 `100` 和 `z` 轴坐标为 `40` ，通过这三个坐标，指定光源位置在三维空间中模拟光照，从而产生一种具有立体感的光照效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/124730f1e76c4b6da218cae51aeea3b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=904655&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/rNgazmg

  


`<fePointLight>` 元素的主要属性包括：

  


-   `x` ：指定光源在滤镜元素上 `x` 轴的位置，默认值为 `0`
-   `y` ：指定光源在滤镜元素上 `y` 轴的位置，默认值为 `0`
-   `z` ：指定光源在滤镜元素上 `z` 轴的位置，默认值为 `0`

  


最后一个光源是 `<feSpotLight>`。它用于模拟聚光灯效果。它创建了一个具有聚焦特性的光源，可以在指定位置上模拟聚光灯的光照效果。其主要属性包括：

  


-   `x`：光源在过滤器元素上 `x` 轴的位置。
-   `y`：光源在过滤器元素上 `y` 轴的位置。
-   `z`：光源在过滤器元素上 `z` 轴的位置。这决定了光源的远近。
-   `pointsAtX`：光源所指向的位置的 `x` 坐标。
-   `pointsAtY`：光源所指向的位置的 `y` 坐标。
-   `pointsAtZ`：光源所指向的位置的 `z` 坐标。
-   `specularExponent`：指定了光的聚焦强度，控制光照的锐度和强度。
-   `limitingConeAngle`：限制光投射的锥形角度，超出这个角度范围的地方将不受光照影响。

  


使用 `<feSpotLight>`，可以实现更精细的光照效果，如在某一区域内产生明亮的光斑，而在其他区域则较暗。通过调整不同的参数，可以实现不同的聚光灯效果，为 SVG 图形增添立体感和视觉效果。

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feDiffuseLighting" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feDiffuseLighting in="SourceGraphic" lighting-color="#00c2cb" diffuseConstant="2">
                <feSpotLight 
                    x="680" 
                    y="20" 
                    z="30" 
                    limitingConeAngle="60" 
                    pointsAtX="100" 
                    pointsAtY="100"
                    pointsAtZ="0" />
            </feDiffuseLighting>
            <feComposite in="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/752b82ab859842859f5b48e644a85a0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=852150&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/oNRgeqz

  


### 镜面光照：feSpecularLighting

  


`<feSpecularLighting>` 滤镜基元用于通过将光照效果添加到源图形上来创建高光效果。它使用源图形的 Alpha 通道作为凸起图，并根据光的颜色、光源位置以及输入凸起图的表面几何形状计算光照效果。简单地说，它用于模拟三维物体表面在光源作用下的镜面反射效果，这种效果通常会使图像看起来更加立体和真实。通过定义光源的位置、反射强度和其他属性，可以控制好光线如何与图形表面交互，从而创造出丰富的视觉效果。例如，创建表面上的光泽、高光或镜面反射等效果。

  


以下是 `<feSpecularLighting>` 的一些关键属性：

  


-   `surfaceScale`：此属性控制表面的高度。它影响了光的高光效果的强度。较大的值会导致更明显的高光效果，而较小的值会产生更柔和的效果。默认值为 `1`。
-   `specularConstant`：这是高光项的常数，类似于 Phong 光照模型中的 `kd`（漫反射系数）。它影响了高光的整体亮度。默认值为 `1`。
-   `specularExponent`：这是高光项的指数，用于控制高光的焦散程度。指数值越高，高光越集中，看起来越尖锐。默认值为 `1`。

  


此外，`<feSpecularLighting>` 滤镜基元使用与 `<feDiffuseLighting>` 滤镜基元相同的光源：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feSpecularLighting" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feSpecularLighting specularExponent="5" lighting-color="#00c2cb" surfaceScale="1" in="SourceGraphic" specularConstant="1.5">
                <fePointLight x="570" y="100" z="200" />
            </feSpecularLighting>
            <feComposite in="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10916c3ef3134517894482c0ac68fac1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=869615&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/rNgazPa

  


总的来说，`<feSpecularLighting>` 通过模拟光照效果，以及源图形的表面形状和光源的位置，来创建出具有高光效果的图像。在这个示例中，我们使用的是 `<fePointLight>` 定义的光源，要是你感兴趣的话，可以尝试着调整光源类型，获得不同的效果！

  


### 平铺：feTile

  


`<feTile>` 滤镜基元使输入图像以重复平铺模式填充目标矩形，目标矩形的大小与 `<feTile>` 元素建立的滤镜基元区域一样大。

  


-   `x` 限制给定滤镜基元的计算和渲染的子区域的最小 `x` 坐标。
-   `y` 限制给定滤镜基元的计算和渲染的子区域的最小 `y` 坐标。
-   `width` 限制给定滤镜基元的计算和渲染的子区域的宽度。
-   `height` 限制给定滤镜基元的计算和渲染的子区域的高度。

  


例如，下面这个示例，在元素上创建一个重复的图案，就像地板上的瓷砖一样：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="feTile" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTile in="SourceGraphic" x="50" y="50" width="50" height="50" />
            <feTile />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86fa104745cc422eb66efe519c5f90b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1305&s=860463&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/WNBbZxB

  


## SVG 滤镜综合案例

  


上一节，我们花了很长的篇幅向大家介绍了 SVG 滤镜中的所有滤镜基元。正如我们所了解的，滤镜基元是 SVG 构建滤镜效果的最基础单元（或模块）。换句话说，滤镜要生效，那么至少需要一个滤镜基元。即 `<filter>` 元素中至少要包含一个滤镜基元。

  


需要知道的是，在同一个 `<filter>` 元素中可以同时应用多个滤镜基元，通过组合多个不同的滤镜基元，可以构造出更为出色的滤镜效果。接下来，以一个简单的示例，一步一步向大家如何通过多个滤镜基元构造出更出色的效果。

  


例如：

  


```HTML
<h2 class="filtered">svg awesome! I Love SVG!</h2>

<svg width="0" height="0">
    <defs>
        <filter id="filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <!-- 没有任何滤镜基元 -->
        </filter>
    </defs>
</svg>
```

  


```CSS
.filtered {
    filter: url(#filter);
}
```

  


这是最初始阶段，虽然使用 `<filter>` 创建了一个 `id` 名为 `filter` 的滤镜，并且在 CSS 中通过 `filter` 属性的 `url()` 函数引用了该滤镜，但 `.filtered` 无事并没有任何滤镜效果。这是因为，在 `<filter>` 中没有任何滤镜基元，也就是说，没有创建任何滤镜效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ef9ea865d814abfac04f188e96e092e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1011&s=291401&e=jpg&b=7d850d)

  


接下来，我们一步一步往 `<filter>` 元素中添加具体的滤镜基元！

  


首先，我们使用形态学滤镜基元 `<feMorphology>` ，将其 `operator` 设置为 `dilate` 使文本变粗：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="dilate" />
        </filter>
    </defs>
</svg>         
```

  


我们将输入源 `in` 设置为 `SourceAlpha` ， 将其视为填充为黑色的源图形。这个时候，你看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5fa126ac83e41d2ba0822cfa494d36c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1011&s=386207&e=jpg&b=7d850c)

  


接着，继续往 `<filter>` 中添加一个 `<feConvolveMatrix>` 滤镜基元，创建一个 `45` 度，深度为 `3px` 的凸出效果。注意，将上一个滤镜的结果 `dilate` 作为这个滤镜基础的第一输入源，并将该滤镜的结果命名为 `convolveMatrix` ：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="dilate" />
          <feConvolveMatrix order="3,3" in="dilate" result="convolveMatrix"
              kernelMatrix="1 0 0 
                            0 1 0
                            0 0 1"  />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1724780fa7b34e08a340c128c5ea389e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1011&s=484157&e=jpg&b=7d850c)

  


继续往里面添加滤镜基元：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="dilate" />
            <feConvolveMatrix order="3,3" in="dilate" result="convolveMatrix" 
                kernelMatrix="1 0 0 
                              0 1 0
                              0 0 1"  />
            <feOffset dx="4" dy="4" in="convolveMatrix" result="offset"/>
            <feComposite operator="out" in="convolveMatrix" in2="offset" result="composite" />
        </filter>
    </defs>
</svg>
```

  


使用 `<feOffset>` 做了个位移处理，同时使用 `<feComposite>` 滤镜基元，将 `convolveMatrix` 和 `offset` 进行合成处理。并且将合成的结果命名为 `composite` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4ce41eedb7f4d7aab240dcaa7629499~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1011&s=260486&e=jpg&b=7d850c)

  


发挥你的才智，可以继续往 `<filter>` 中添加任何你想要的滤镜基元：

  


```XML
<svg width="0" height="0">
    <defs>
        <filter id="filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="dilate" />
            <feConvolveMatrix order="3,3" kernelMatrix="1 0 0  0 1 0 0 0 1" in="dilate" result="convolveMatrix" />
            <feOffset dx="4" dy="4" in="convolveMatrix" result="offset" />
            <feComposite operator="out" in="convolveMatrix" in2="offset" result="composite" />
            <feFlood flood-color="#deface" result="flood" />
            <feComposite in="flood" in2="composite" operator="in" result="composite2" />
            <feMerge result="merge">
                <feMergeNode in="composite2" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
            <feTurbulence result="turbulence" baseFrequency="0.08" numOctaves="1.5" seed="0.21" />
            <feGaussianBlur stdDeviation="5" in="merge" result="blur" />
            <feSpecularLighting surfaceScale="160" specularConstant="180" specularExponent="5" lighting-color="#aec" in="turbulence" result="specular">
                <fePointLight x="140" y="-130" z="100" />
            </feSpecularLighting>
            <feComposite operator="in" in="specular" in2="turbulence" result="composite3" />
            <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="merge" />
                <feMergeNode in="specular" />
                <feMergeNode in="SourceAlpha" />
                <feMergeNode in="composite3" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


上面代码，最终呈现的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee01b2f7b20041a99b5cdf5d2742580e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1011&s=1069917&e=jpg&b=7d850d)

  


> Demo 地址：https://codepen.io/airen/full/oNRgGeE

  


## 小结

  


现在我们已经介绍了 SVG 滤镜的基础知识以及如何创建和应用滤镜，这仅仅是 SVG 滤镜的最基础部分。在小册后续的课程中，将还会与大家更深入的探讨 SVG 滤镜的一些高级技巧。