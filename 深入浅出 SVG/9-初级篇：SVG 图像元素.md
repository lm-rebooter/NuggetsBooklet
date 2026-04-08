图像在 Web 应用或网站中扮演着至关重要的角色。作为 Web 开发者，我们有多种方式可以为 Web 添加图片，比如使用 HTML 提供的 `<img>` 和 `<picture>` 元素，或者利用 CSS 的 `background-image` 属性。与此类似，SVG 也提供了 `<image>` 元素，类似于 HTML 中的 `<img>` 元素，使得我们能够轻松地将图片引入到 SVG 文档中。

  


SVG 图像元素 `<image>` 在 SVG 中扮演着与[基本图形元素](https://juejin.cn/book/7341630791099383835/section/7345813971552698406)、[文本元素](https://juejin.cn/book/7341630791099383835/section/7346773005114507304)同等重要的角色。它允许我们将各种类型的图像文件（如 JPG、PNG、WebP 和 GIF 等）嵌入到 SVG 中，并在指定的位置进行渲染和展示。

  


这节课将深入探讨 SVG 图像元素 `<image>` 的各种用法，从基本的图像引用到更复杂的渲染和处理，为大家详细介绍其各项属性、用法、兼容性以及最佳实践。无论你是初学者还是有一定经验的 Web 开发者，这节课都将为你提供清晰易懂的指导，帮助你轻松掌握 SVG 图像元素 `<image>` 的技巧，并将其应用到实际的项目中去。让我们一起踏上探索 SVG 图像元素 `<image>` 的旅程，开启一段令人兴奋的学习之旅！

  


## SVG 图像元素的概述

  


SVG 图像元素（`<image>`）是 SVG 标准中的一个重要组成部分。它允许 Web 开发者将外部图像文件以及 MIME 类型为 `"image/svg+xml"` 的文件嵌入到 SVG 文档中，并在指定位置进行渲染和展示。与 HTML 中的 `<img>` 元素类似，SVG 的 `<image>` 元素可以引用多种图像格式，包括 JPG、PNG、WebP 和 GIF 等。

  


Web 开发者通过使用 SVG 图像元素可以引入外部图像文件并进行各种处理。例如：

  


-   **缩放和定位**：使用 `x` 、`y` 、`width` 和 `height` 属性可以对图像进行位置和尺寸的调整，以便将其放置在适当的位置并调整大小
-   **保持宽高比**：使用 `preserveAspectRatio` 属性可以控制图像的缩放和定位，以确保其原始宽高比得到保持
-   **裁剪**：可以通过设置 `viewBox` 属性来定义一个裁剪框，只显示图像的特定部分，而不是全部显示
-   **滤镜效果**：可以使用 SVG 滤镜来对引入的图像进行各种视觉效果处理，如模糊、颜色变换等
-   **叠加效果**：可以通过叠加多个图像元素来创建图像叠加效果，从而实现更复杂的视觉效果
-   **交互效果**：可以结合 JavaScript 代码来为引入的图像添加互交效果，如鼠标悬停、点击等事件响应
-   **动画效果**：可以使用 CSS 或 JavaScript 创建动画效果，使引入的图像产生动态变化
-   **组合和分组**：可以将多个图像元素组合在一起，形成一个复杂的图像场景，并对它们进行分组管理

  


总的来说，SVG 的 `<image>` 元素为我们提供了丰富的功能和灵活的处理方式，可以实现各种复杂的图像处理效果。通过合理利用这些功能，可以创建出更加丰富、生动和具有交互性的 SVG 图像。

  


## SVG 图像元素的基本应用

  


假设你有一张像下图这样的一张图片，需要嵌入到 SVG 文档中：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33c61c8ea4544645a840e40ba83408b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1631&h=1102&s=229331&e=jpg&b=dbd4cd)

  


> 图片地址：https://picsum.photos/id/77/1631/1102

  


在介绍如何通过 `<image>` 元素将上图嵌入到 SVG 文档中之前，我们先简单回忆一下 HTML 的 `<img>` 元素是如何将该图片嵌入到 HTML 文档中。事情很简单，只需要在 `<img>` 的 `src` 属性上引入你所要的图片文件地址即可，该地址可以是图片文件的相对地址，也可以是绝对地址，还可以是 Data URIs。这里图片文件的绝对地址为例：

  


```HTML
<img src="https://picsum.photos/id/77/1631/1102" />
```

  


在不做任何修改的情况之下，在浏览器看到 `<img>` 引入的图片效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15889f1c4009434eab4e1e96c9cbc0b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1158&h=504&s=20146594&e=gif&f=55&b=dfd9d8)

  


> Demo 地址：https://codepen.io/airen/full/bGJBZwb

  


它将会以图片的原始尺寸（`1631 × 1102`）渲染，当容器尺寸小于图片尺寸时，会使容器出现滚动条。当然，你可以在 `<img>` 元素上指定一个你想要的尺寸：

  


```HTML
<img src="https://picsum.photos/id/77/1631/1102" width="400" height="300" />
```

  


或者是通过 CSS 的 `width` 和 `height` 设置渲染的大小：

  


```CSS
img {
    display: block;
    width: 400px;
    height: 300px;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b901198d8106430292733eb77e1ada3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1161&s=1015471&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/PogbLWv

  


这是一种简单又粗暴的方式，很容易造成图片的扭曲变形，因为重置的宽高比与图片原始宽高比不相等时。更为合理的方式是，仅给图片宽高中的一个指定确切的值，另一个设置为 `auto` 。这个时候，浏览器会根据图片原始宽高比计算出相应的值：

  


```CSS
img {
    display: block;
    width: 400px;
    height: auto;
}

/* 或者 */
img {
    display: block;
    height: 300px;
    width: auto;
}
```

  


当然，[你还可以借助 CSS 的 aspect-ratio 属性使图片按照指定的宽高比来设置尺寸](https://juejin.cn/book/7223230325122400288/section/7259316040151236666)：

  


```CSS
img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ccb314b85ed44b298428605df24034c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=764&s=18460169&e=gif&f=164&b=0a0822)

  


> Demo 地址：https://codepen.io/airen/full/dyLOrWq

  


这些对于 Web 开发者来说，是图片在 Web 上应用的最基础部分，但要在 Web 上用好图片，还是有很多细节的，比如[如何防止图片拉伸或挤压](https://juejin.cn/book/7199571709102391328/section/7199845663143067660)、[图片裁剪](https://juejin.cn/book/7199571709102391328/section/7199845888997457959)等。不过，这些内容已超出这节课的范畴，因此不在这里做过多的阐述。

  


我们还是回到这节课的主题中来， `<image>` 元素是如何将该图片嵌入到 SVG 文档中。

  


首先，假设你有一个 SVG 文档：

  


```XML
<svg viewBox="0 0 800 600">
    <!-- 我是一个 SVG 文档 -->
</svg>
```

  


```CSS
svg {
    display: block;
    width: 50vw;
    aspect-ratio: 4 / 3;
    outline: 1px dashed #fff;
}
```

  


我们使用上面的代码创建了一个 SVG 文档，而且视口和宽高比与 `viewBox` 的宽高比相等，都是 `4:3` 。现在，我们使用 `<image>` 元素，将需要的图片嵌入到 `<svg>` 元素中：

  


```XML
<svg viewBox="0 0 800 600">
    <image href="https://picsum.photos/id/77/1631/1102" />
</svg>
```

  


`<image>` 和 `<img>` 最直观的差异，`<image>` 是通过 `href` （SVG 2 之前是通过 `xlink:href`）属性来引入图片源。另外一个差异是，`<image>` 引入的图片尺寸与 SVG 视口尺寸不匹配时，图片溢出部分会被裁剪：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8877da2be4f94b3aa47a34c21d365b59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1436&s=975236&e=jpg&b=d0c8c5)

  


> Demo 地址：https://codepen.io/airen/full/vYMyPWb

  


这是因为用户代理（Web 浏览器）默认情况之下将 `<svg>` 元素的 `overflow` 属性的值设置为 `hidden` ：

  


```CSS
/* User Agent Stylesheet */
svg :not ( :root ) {
 overflow - clip - margin : content-box;
 overflow : hidden;
} 
```

  


有意思的是，用户代理同时也将 `<image>` 元素上的 `overflow` 属性的值设置为 `hidden` ：

  


```CSS
/* User Agent Stylesheet */
image {
 overflow : hidden;
} 
```

  


这意味着，对于嵌入 SVG 图像的 `<image>` 元素，应用两个不同的溢出值。在 `image` 元素上指定的值确定了图像渲染矩形是否被裁剪到定位矩形中。在所引用 SVG 的根元素上的值确定了图形是否被裁剪到图像渲染矩形中。也就是说，除非 Web 开发者覆盖 `image` 元素的 `overflow` 属性值，否则图像将被裁剪到由几何属性定义的定位矩形中。

  


> 注意，这里所说的定位矩形是指 `image` 元素的 `x`、`y`、`width` 和 `height` 几何属性指定了嵌入内容所放置的矩形区域（称为定位矩形）。定位矩形被用作元素的边界框；然而需要注意的是，根据 `overflow` 属性的值，图形可能会溢出定位矩形。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79a551bbcb4147c1b7b48f0896701654~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=750&s=6105653&e=gif&f=103&b=0a0822)

  


> Demo 地址：https://codepen.io/airen/full/xxeRePN

  


`<image>` 元素还有一点与 `<img>` 不一样的是，我们可以通过 `<image>` 元素的 `x` 和 `y` 属性来设置 `<image>` 元素左上角在 SVG 视口中的位置。这两个属性的值可以是数字也可以是百分比值，也可以是负值。当 `x` 的值为正值时，`image` 元素会沿 `x` 轴向右移动，反则之向左移动；当 `y` 的值为正值时，`image` 元素会沿着 `y` 轴向下移动，反之则向上移动。如果没有给 `<image>` 元素显式设置 `x` 和 `y` 属性的值，它们默认为 `0` ，那么 `image` 元素的左上角将与 SVG 视窗的左上角（原点）对齐：

  


```XML
<svg viewBox="0 0 800 600">
    <image href="https://picsum.photos/id/77/1631/1102" x="50" y="50" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a9234d6c93f491892ebb04381a67d2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1236&h=616&s=9672409&e=gif&f=165&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/LYvbvmY

  


`<image>` 元素与 `<img>` 元素有一点相似的是，可以给 `<image>` 元素指定 `width` 和（或）`height` 。当只给 `<image>` 元素设置 `width` 和 `height` 中的一个值时，客户端（例如浏览器）会根据图片的原始宽高比计算出另一个值。

  


```XML
<svg viewBox="0 0 800 600">
    <!-- 根据图片原始宽高比，在设置的宽度基础上计算出图片的高度 -->
    <image href="https://picsum.photos/id/77/1631/1102" x="50" y="50" width="400" />
</svg>

<!-- 或者 -->
<svg viewBox="0 0 800 600">
    <!-- 根据图片原始宽高比，在设置的高度基础上计算出图片的宽度 -->
    <image href="https://picsum.photos/id/77/1631/1102" x="50" y="50" height="300" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc1b9fdf66944c4d8485f0108eb3a4ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1236&h=492&s=4813490&e=gif&f=197&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/abxBxRe

  


也可以同时给 `<image>` 元素设置 `width` 和 `height` ，但与 `<img>` 不同的是，它们并不会造成图片的扭曲，依旧会根据图片原始宽度进行缩放，有可能会使图片溢出或者小于定位矩形所在的区域：

  


```XML
<svg viewBox="0 0 800 600">
    <image href="https://picsum.photos/id/77/1631/1102" x="50" y="50" width="400" height="300" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05ffed2617094bffae83fdf65ba44d17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1240&h=562&s=7219105&e=gif&f=347&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/LYvxPgL

  


需要注意的是，`<image>` 元素的 `width` 和 `height` 属性的任一值为 `0` 的时候，图片都不会在 SVG 视口中呈现：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d66e49546a04bf8b948c5dfe502f80f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1238&h=482&s=3201232&e=gif&f=221&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/jORyOrP

  


## SVG 的 viewBox 属性对 image 元素的影响

  


`<svg>` 元素的 `viewBox` 属性对 `<image>` 元素的影响是非常重要的，它可以用来控制图像在 SVG 视口中的显示方式，包括图像尺寸调整、图像位置和图像的显示等。

  


[通过对 SVG 坐标系统的学习](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)，我们知道 `<svg>` 元素的 `viewBox` 属性包括了 `<min-x>` 、`<min-y>` 、`<width>` 和 `<height>` 四个参数，其中 `<min-x>` 和 `<min-y>` 决定了 `viewBox` 左上角在视口中的位置，`<width>` 和 `<height>` 决定了 `viewBox` 的尺寸大小。如果将 `viewBox` 比作相片，把 SVG 视口比作相框的话，其两者的关系是：

  


-   如果相片和相框尺寸相等，那么效果可以说是堪称完美，相片会完美的填充在相框中
-   如果相片比相框小，那么相片就填不满整个区域，你需要考虑相片在相框中的摆放位置，才能达到满意的效果
-   如果相片比相框大，那么相片就会超出相框的区域，你同样需要考虑相片在相框中的摆放位置，才能达到满意效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8c0d9e537d04c38b40e4fc2a95e3971~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3627&h=3005&s=3171297&e=jpg&b=8499a0)

  


注意，这里描述的相片与框之间存在的关系，其前提是相片（`viewBox`）和相框（SVG 视口）的宽高比相等。

  


这意味着，调整 `viewBox` 的 `<min-x>` 和（或）`<min-y>` 将会改变相片在相框中的位置，调整 `<width>` 和 （或）`<height>` 将会放大或缩小相片。

  


也就是说，当我们调整 `<svg>` 元素的 `viewBox` 的 `<min-x>` 和 `<min-y>` 参数的值，将会调整 `<image>` 元素在 SVG 视口中的位置；调整 `<svg>` 元素的 `viewBox` 的 `<width>` 和 `<height>` 参数的值，将会对 `<image>` 进行缩放。

  


```XML
<svg viewBox="0 0 400 300" class="figure">
    <image href="https://picsum.photos/id/77/1631/1102" x="50" y="50" width="400" height="300" />
</svg>
```

  


```CSS
.figure {
    width: 800px;
    height: 600px;
}
```

  


请拖动示例中的滑块，修改 `viewBox` 的值，你将看到 `viewBox` 给 `<image>` 元素在 SVG 视口中呈现上的变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de2cd2c46b8f4a488b5d103110f0e811~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1284&h=664&s=18163627&e=gif&f=413&b=3c4649)

  


> Demo 地址：https://codepen.io/airen/full/GRLrRaR

  


为了能让大家更好的理解 `viewBox` 对 `<image>` 元素的位置、尺寸等影响，我们在上面的示例基础上简化一下。考虑以下 SVG 代码：

  


```XML
<svg width="800" height="600" viewBox="0 0 400 300" class="figure">
    <image href="https://picsum.photos/id/77/1631/1102" x="50" y="50" width="300" height="150" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2bf9d416e5d4dffbd28047ba0924185~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1436&s=736885&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/yLrgyMK

  


在给定的 SVG 示例中，SVG 的视口（相框 Viewport）的尺寸是 `800 x 600` ，并且设置了一个 `viewBox` 属性为 `"0 0 400 300"` ，SVG 的 `viewBox` （相片）的尺寸是 `400 x 300` 。在 SVG 中，`<image>` 元素引入了一张外部图像，设置的初始位置（图片左上角）是 `(50,50)` ，宽度是 `300` ，高度是 `150` 。同时，`<image>` 元素的“定位矩形”左上角位置是 `(50,50)` ，大小是 `300 x 150`。

  


现在让我们详细解释 `viewBox` 属性对 `image` 元素的影响。

  


我们知道，SVG 视口的尺寸是 `800 x 600` ，SVG 的 `viewBox` 尺寸是 `400 x 300` ，为了使 `viewBox` 能填满 SVG 视口，那么 `viewBox` 则需要放大两倍（在这个示例中），与此同时，`<image>` 元素“定位矩形”受 `viewBox` 的影响，其位置和大小都会放大两倍。即：

  


-   `<image>` 元素的“定位矩形”的左上角由初设的 `(50,50)` 变成了 `(100,100)`
-   `<image>` 元素的“定位矩形”的尺寸由初设的 `300 x 150` 变成了 `600 x 300`

  


因此，`<image>` 元素引用的图片在 SVG 画布中向右下角偏移，同时图片会放大显示。

  


注意，`<image>` 元素上指定的 `width` 和 `height` 只是定位矩形的尺寸，图片实际呈现可能会比定位矩形大，也可能会比定位矩形小。它会根据图片的原始宽高比与定位矩形的宽高比进行计算，该计算有点类似于 CSS 的 `background-size` 或 `object-fit` 属性的 `cover` 或 `contain` 的计算。在这个示例中，图片实际呈现的尺寸是 `444 x 300` （图片的原始宽高比是大约是 `1.48`） ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1d4adf6f1d040e88982fdbf5e44207c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1436&s=1085276&e=jpg&b=0b0b27)

  


图片实际呈现的的效果是位于 `image` 元素“定位矩形”的中心。

  


反之，`image` 引入的图片就会缩小。在上例的基础上，我们把 `viewBox` 的尺寸与 SVG 视口的尺寸对调一下：

  


```XML
<svg width="400" height="300" viewBox="0 0 800 600" class="figure">
    <image href="https://picsum.photos/id/77/1631/1102" x="50" y="50" width="300" height="150" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33ebed5eaf4245c28cb7e1b9cd2791bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1436&s=588158&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/gOygWjz

  


由于 `viewBox` （相片）要缩小两倍才能正好填充在 SVG 视口（相框）中，导致 SVG 视口中的图形也会缩小两倍。因此，`<image>` 元素的“定位矩形”从原来的 `(50,50)` 向左上角移动（移动到 `(25,25)`），尺寸由原来的 `300 x 150` 缩小到 `150 x 75` 。最终呈现的图片尺寸是 `111 x 75` ，图片缩小了两倍！

  


综上所述，`viewBox` 属性可以影响 `<image>` 元素的尺寸、位置和显示方式，以便与 SVG 画布的可见区域相匹配。在处理 SVG 中的图像时，[理解 viewBox 属性的影响是非常重要的](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)。

  


## SVG 的 preserveAspectRatio 属性对 image 元素的影响

  


对于 `<svg>` 元素，`preserveAspectRatio` 属性与 `viewBox` 属性同样重要，它可以用来控制 SVG 中的 `viewBox` 在视口中的缩放和定位。这个属性主要用来确保图形在缩放时能够保持宽高比一致。通过 `preserveAspectRatio`，你可以定义三个关键方面：是均匀缩放还是拉伸、整个 `viewBox` 是否完全可见、以及 `viewBox` 在视口内的对齐方式。

  


在上一部分，我们已经一起探讨了 `viewBox` 属性对于 `<image>` 元素位置、大小和呈现方式的影响。在所展示的示例，它们有着一个共同的特性，那就是 `viewBox` 的宽高比与 SVG 视窗的宽高比相等。因此，并没有在示例中应用 `preserveAspectRatio` 属性。事实上，只有当 `viewBox` 的宽高比与 SVG 视口的宽高比不匹配的时候，我们才会使用 `preserveAspectRatio` 属性来控制图形在 SVG 视口中的对齐方式和缩放形式。

  


这也意味着，SVG 的 `preserveAspectRatio` 同样会对 SVG 的 `<image>` 元素引入的图片呈现有一定的影响：

  


-   **缩放和定位**： `preserveAspectRatio`允许你控制 SVG 图像中嵌入的图像（使用 `image` 元素）的缩放和定位。该属性决定了视口范围内图像如何缩放以及如何在视口内定位。
-   **保持宽高比例**： `preserveAspectRatio`属性允许你保持图像的宽高比例。它可以确保图像在调整大小时保持其原始比例，以避免图像变形。
-   **`meet`** **和** **`slice`** **选项**： `meet` 表示将图像缩放以使其完全适应视口，并且保持图像的宽高比例，类似于 CSS 的 `object-fit` 属性中的 `contain` 值。`slice` 则表示将图像缩放以覆盖整个视口，即使需要裁剪图像以适应视口，也保持图像的宽高比例，类似于 CSS 的 `object-fit` 属性中的 `cover`值。
-   **定位**： `preserveAspectRatio` 还可以控制图像在视口中的定位。它可以决定图像在视口内的水平和垂直位置。你可以通过将 `none`、`xMinYMin`、`xMidYMin`、`xMaxYMin`、`xMinYMid`、`xMidYMid`、`xMaxYMid`、`xMinYMax`、`xMidYMax` 或 `xMaxYMax` 中的一个值 与 `meet` 或 `slice` 组合使用，来控制图像的位置。

  


简单地说，`preserveAspectRatio` 属性决定了如何对引用的图像（`<image>` 元素引入的图像）进行缩放和定位，以适应从“定位矩形”和 `object-fit` 和 `object-position` 属性确定的具体对象大小。应用此属性的结果定义了用于实际图像渲染的图像渲染矩形。

  


简而言之，`preserveAspectRatio` 属性决定了如何对引用的图像（即通过 `<image>` 元素引入的图像）进行缩放和定位，以适应由"定位矩形"和 `object-fit` 与 `object-position` 属性确定的具体对象大小。应用此属性的结果定义了用于实际图像渲染的图像渲染矩形。

  


`preserveAspectRatio` 属性只有满足一定条件时，才于 `<image>` 元素引入的图像才会生效的。即，

`preserveAspectRatio` 计算是在确定具体对象大小之后应用的，仅在该大小与嵌入图像的固有宽高比不匹配时才生效。如果使用了 `object-fit` 的值确保了具体对象大小与固有宽高比匹配（即除默认的 `fill` 以外的任何值），那么 `preserveAspectRatio` 的值将不起作用；图像渲染矩形将是在使用 CSS 进行缩放和定位时确定的。因此，`preserveAspectRatio` 属性可以安全地作为大多数 `object-fit` 和 `object-position` 值的回退使用；它必须显式地设置为 `none` 才能关闭纵横比控制，而不管 `object-fit` 的值如何。

  


只有在满足特定条件时，`preserveAspectRatio` 属性才会对 `<image>` 元素引入的图像生效。换句话说， `preserveAspectRatio` 的计算是在确定具体对象大小之后应用的，仅当该大小与嵌入图像的固有宽高比不匹配时才生效。如果使用 `object-fit` 的值确保了具体对象大小与固有宽高比匹配（即除了默认的 `fill` 以外的任何值），那么 `preserveAspectRatio` 的值将不起作用；图像渲染矩形将是在使用 CSS 进行缩放和定位时确定的。因此，`preserveAspectRatio` 属性可以安全地作为大多数 `object-fit` 和 `object-position`值的备用方案；它必须显式地设置为 `none` 才能关闭宽高比控制，而不管 `object-fit` 的值如何。

  


注意，图片的固有宽高比指的是图片原始宽度和高度的比。

  


接下来，我们以实际用例来看看，如何利用 `viewBox` 和 `preserveAspectRatio` 属性更好控制 `<image>` 的缩放和位置。换句说，我们将使用这些属性来裁剪、缩放和定位图像，并且作为 CSS 的 `object-fit` 和 `object-position` 属性的备用或替代方案。

  


CSS 提供了多种不同的方式允许你对图片进行裁剪、缩放和定位，使用[ CSS 的 object-fit 和 object-position](https://juejin.cn/book/7199571709102391328/section/7199845888997457959#heading-11) 就是其中一种，它们使得你在适应框内裁剪和缩放图像变得轻而易举。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9715c4107a347668af4586030fb76fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1194&h=500&s=5653276&e=gif&f=281&b=f8f7f7)

  


> Demo 地址：https://codepen.io/airen/full/KKxxZOP

  


`object-position` 相对而言更容易理解。你可以使用 `object-position` 来更改图像的默认位置，该属性接受与 `background-position` 类似的值。例如，`object-position: top left` 会使图像的顶部边缘与框的顶部边框对齐，并且图像的左边缘与框的左边框对齐。

  


相比之下，`object-fit` 稍微复杂一些。它指定了替换元素（例如 `<img>`）的内容应该如何适应其使用的高度和宽度所建立的框。即使位图图像具有自己的固有尺寸（即图片的原始宽度和高度）以及宽高比（即图片的原始宽高比），你也可以调整其大小以适应 CSS 中定义的任何大小的框。此外，你可以选择是否保持图像的宽高比。这意味着，`object-fit` 属性值会根据适应框的宽高比和图片的原始宽高比，找到最适合的方式对图片进行裁剪和缩放。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/083e90e177f24b56b19cd73820417c43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1660&h=3024&s=1594696&e=jpg&b=f4f0ef)

  


注意，其中 `object-fit` 的值为 `cover` 和 `contain` 对图片裁剪与缩放是有一套成熟的计算公式的，有关于这方面的介绍就不在这里展开了，如果你感兴趣的话，可以移步阅读《[响应式图片：防止图片的拉伸或挤压](https://juejin.cn/book/7199571709102391328/section/7199845663143067660#heading-2)》一文！

  


接下来，我们来看看如何使用 SVG 裁剪和缩放图像。

  


在 SVG 中，由 `viewBox` 定义的用户坐标系统不一定会与 SVG 视口具有相同的宽高比。当 `viewBox` 的宽高比与视口的宽高比不相等时，浏览器需要将 `viewBox` 定位在视口内，类似于上面示例中将图片定位在适应框内的方式。

  


默认情况下，就像使用 `object-fit` 一样，浏览器将 `viewBox` 适应于SVG视口内，使其完全包含在其中，从而使整个 `viewBox` 都在 SVG 视口内可见。

  


使用 `preserveAspectRatio` 属性，你可以更改 `viewBox` 的位置和缩放，从而更改 SVG 的所有内容，就类似于使用 `object-fit` 时更改图像在适应框内的位置和缩放的方式。

  


例如，假设我们有一个正方式的 SVG 视口（宽高比是 `1:1`）和一个具有不同宽高比的 `viewBox` （例如 `2:1`）：

  


```XML
<svg width="400" height="400" viewBox="0 0 800 600" class="figure">
    <image href="https://picsum.photos/id/77/3000/1024" x="0" y="0" width="100%" height="100%" />
</svg>
```

  


上述代码的结果如下图所示。`<image>` 元素引入的图像将代表 `viewBox` 在 SVG 视口中的大小和位置。它与下面这个 CSS 应用的 `object-fit` 示例结果是相似的：

  


```HTML
<div class="wrapper">
    <img src="https://picsum.photos/id/77/3000/1024" alt="">
</div>
```

  


```CSS
.wrapper {
    outline: 1px dashed #fff;
    width: 400px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    
    img {
        display: block;
        width: 100%;
        object-position: center;
        object-fit: contain;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97c163ea913e4d569ca53c6bdcafea43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1166&s=699495&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/mdgRBJm

  


现在，使用 `preserveAspectRatio` ，你可以更改 `viewBox` 在视口中的位置以及其大小（或缩放），类似于我们在 CSS 中使用 `object-fit` 和 `object-position` 更改图像位置和缩放方式。

  


`preserveAspectRatio` 属性值由 `<align>` 和 `<meetOrSlice>` 两个参数组成，其中 `<align>` 参数有 `19` 个值，包括 `none` ，除 `none` 之外的值将会使 `viewBox` 在保持宽高比进行缩放以填充 SVG 视口。其中 `<align>` 的值为 `none` 时，有点类似于 `object-fit: fill` 的效果。

  


`preserveAspectRatio` 属性的 `<meetOrSlice>` 代表缩放 `viewBox` ，并具有两个值：`meet` 或 `slice` 。其中 `meet` 具有与 `object-fit: contain` （或 `background-size: contain`）相同的效果，而 `slice` 具有与 `object-fit: cover` （或 `background-size: cover`）相同的效果。前者将保持 `viewBox` 的宽高比，并将其适应到 SVG 视口内，以便完全可见。这是默认行为。而 `slice` 将缩放 `viewBox` ，同时保持其宽高比，以覆盖整个 SVG 视口区域，即使这意味着切掉一些内容（图片会可能会被裁剪）。

  


```XML
<svg width="300px" height="300px" viewBox="0 0 579 375" preserveAspectRatio="xMidYMid meet" class="figure">
    <image href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/9674/photo-1501366062246-723b4d3e4eb6.jpg" x="0" y="0" width="100%" height="100%" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd33ff4601fc4968ac5563a954376d0f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=516&s=8544276&e=gif&f=376&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/OJGWxjv

  


正如你所看到的，几乎任何 `object-fit` 和 `object-position` 值的组合都可以使用 `preserveAspectRatio` 在 `viewBox`上复制。更有意思的是，你可以使用下面这段 SVG 代码作为 `object-fit` 和 `object-position` 的替代方案：

  


```XML
<svg width="x" height="y" viewBox="0 0 imgX imgY" preserveAspectRatio="<align>   <meetOrSlice>” aria-labelledby="title"  aria-role="img">
     <title id="title"> img alt here </title>
      <image xlink:href="..." width="100%" height=“100%” >
</svg>
```

  


其中 `imgX` 和 `imgY` 是要裁剪和缩放的图像的尺寸，`<align>` 和 `<meetOrslice>` 是确定图像在 SVG 包装器内的缩放和位置的两个关键字。

  


SVG 的 `preserveAspectRatio` 属性除了可以应用于 `<svg>` 元素上之外，它也可以直接应用于 `<image>` 元素上。但用于 `<image>` 元素时需要知道。对于通过 `<image>` 元素嵌入的 SVG 图像，SVG 图像中根元素（`<svg>` 元素 ）上的 `preserveAspectRatio` 属性必须被忽略，并且视为具有 `none` 值。这样可以确保 `<image>` 元素上引用的 `preserveAspectRatio` 属性能够按预期生效，即使它是 `none`。

  


当 `<image>` 元素上的 `preserveAspectRatio` 属性值不是 `none` 时，根据 `<image>` 元素的属性确定的图像渲染矩形将完全匹配嵌入 SVG 的固有宽高比。因此，通常情况下忽略来自嵌入 SVG 的 `preserveAspectRatio` 属性不会产生任何影响。唯一的例外是，如果图像的宽高比是根据宽度和高度属性的绝对值来确定的，而这些值与其 `viewBox` 的纵横比不匹配。这种情况比较罕见，建议开发者尽量避免出现，因为可能会引发各种问题。

  


## 响应式 SVG 图像叠加

  


“响应式 SVG 图像叠加”是一种利用 SVG 技术在图像上创建叠加层的技术，以适应不同的屏幕尺寸或视口大小，确保设计的响应式。这种方法允许根据可用空间动态调整 SVG 元素，为不同设备提供视觉上吸引人且灵活的用户体验。

  


在这里，“响应式”意味着 SVG 叠加层根据不同的屏幕尺寸或分辨率动态调整其布局、大小和位置，确保在从桌面端到智能手机和平板电脑等各种设备上的最佳显示。

  


通过利用 SVG 的可扩展性和灵活性，开发人员可以创建具有复杂设计或交互式元素的叠加层，使其能够无缝地适应视觉环境的变化。这种技术通过提供视觉上吸引人且功能齐全的叠加层，增强了用户界面和用户体验，使其在不同设备和屏幕尺寸下仍然易于访问。

  


来看一个简单的示例：

  


```HTML
<div id="greenhouse">
    <svg id="lines" viewBox="0 0 1280 1280" preserveAspectRatio="xMinYMin meet">
        <path stroke="#d4ffde" stroke-width="3" fill="none" d="M 130,820 L 130,320 l 50,0 " />
        <path stroke="#d4ffde" stroke-width="3" fill="none" d="M 620,820 L 620,520 l -230,0 " />
        <path stroke="#d4ffde" stroke-width="3" fill="none" d="M 1100,820 L 1100,380 l -290,0 " />
    </svg>
    
    <svg viewBox="0 0 1280 720" preserveAspectRatio="xMinYMin meet">
        <image width="1280" height="720" xlink:href="https://dkli3tbfz4zj3.cloudfront.net/all/202006_SaladDays/images/greenhouse.jpg">
        </image>
        <circle cx="220" cy="320" r="40" stroke="#d4ffde" stroke-width="3" fill="none" />
        <circle cx="320" cy="520" r="70" stroke="#d4ffde" stroke-width="3" fill="none" />
        <circle cx="750" cy="380" r="60" stroke="#d4ffde" stroke-width="3" fill="none" />
    </svg>
    
    <div id="greenhouse-details">
        <div class="narrow-text">
          <p>Whip up a delicious salad</p>
        </div>
        <div class="narrow-text">
          <p>Cuddle up to Marguerit’s Snow Stalker companion</p>
        </div>
        <div class="narrow-text">
          <p>Learn how to farm new, unusual plants</p>
        </div>
    </div>
</div>
```

  


```CSS
@layer demo {
    #greenhouse {
        position: relative;
        width: 100%;
        overflow: hidden;
        color: #333;
        
        svg {
            position: absolute;
            top: 0;
            left: 0;
        }
    }
    
    #lines {
        z-index: 3;
    }
    
    #greenhouse-details {
        display: flex;
        margin-top: 60%;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .narrow-text {
        background-color: #d4ffde;
        padding: 3% 5%;
        margin: 3%;
        flex-basis: 25%;
        
        @media only screen and (width <= 480px) {
            flex-basis: 100%;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0c4dd1676ed49b7943634cbb74258ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=470&h=758&s=6788810&e=gif&f=85&b=456a95)

  


> Demo 地址：https://codepen.io/airen/full/qBwRPzj

  


总的来说，响应式 SVG 图像叠加提供了一种多功能解决方案，能够有效地响应现代 Web 设计的多样化需求，从而创建引人入胜的视觉体验。

  


## 带有滤镜效果的 image

  


在 SVG 中，你可以将 SVG 的滤镜效果直接应用于 `<image>` 引入的图片上，为图片创建出与众不同的视觉效果：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1024" preserveAspectRatio="xMinYMin slice"class="figure">
    <defs>
       <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
           <feTurbulence type="turbulence" baseFrequency="0.01 0.05" numOctaves="2" seed="2" stitchTiles="noStitch" result="turbulence"/>
           <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>
        </filter>
    </defs>
    
     <image filter="url(#filter)" href="https://picsum.photos/id/188/1920/1024" width="100%" height="100%" x="0" y="0" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9beb82b8460477e90cc8685927e70a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1077&s=2065016&e=jpg&b=b8cad0)

  


> Demo 地址：https://codepen.io/airen/full/vYMgWXa

  


## 考虑图片的可访问性

  


HTML 的 `<img>` 元素有一个 `alt` 属性，它能很好的被诸如屏幕阅读器这种辅助技术识别，使得一些残障人士也能理解好的理解 `<img>` 元素引入的图片代表什么。不幸的是，SVG 的 `<image>` 元素并不像 `<img>` 元素有一个`alt` 属性。到目前为止，为了使 SVG 的 `<image>` 元素引入的图像具有更好的可访问性，通常会将 `<image>` 元素与 `<title>` 和 `<desc>` 等元素结合起来使用。例如：

  


```XML
<svg width="300px" height="300px" viewBox="0 0 579 375" preserveAspectRatio="xMidYMid meet">
    <g>
        <title>画家的双手</title>
        <image xlink:href="./path/to/painter.jpg" x="0" y="0" width="100%" height="100%" />
    </g>  
</svg>

<!-- 或者 -->
<svg width="300px" height="300px" viewBox="0 0 579 375" preserveAspectRatio="xMidYMid meet">
    <g>
        <title>画家的双手</title>
        <desc>这是一双沾满颜料的画家的双手</desc>
        <image xlink:href="./path/to/painter.jpg" x="0" y="0" width="100%" height="100%" />
    </g>  
</svg>
```

  


## 小结

  


通过这节课的内容，我们了解到 `<image>` 元素在 SVG 中是至关重要的。通过掌握如何使用 `<image>` 元素，在 SVG 图形中引入和处理外部图像资源，你可以为你的项目增添更丰富、更生动的视觉效果。不仅如此，`<image>` 元素的灵活性和可扩展性使得你可以根据需要对图像进行缩放、定位和组合，从而实现各种复杂的图像处理效果。

  


尽管 `<image>` 元素的使用可能会略显复杂，但一旦掌握了其基本属性和用法，你就能够在 SVG 图形中轻松地引入外部图像，并根据需求进行灵活处理。无论是网页设计、数据可视化还是其他领域，掌握 `<image>` 元素都将为你的项目增添更多可能性和创造力。

  


希望这节课能够帮助你更好地理解 SVG 图形元素中的 `<image>` 元素，并能够运用它在你的项目中创造出令人惊叹的图像效果。SVG 的学习之路是一个充满创意和探索的旅程，相信通过不断地实践和尝试，你将能够运用 `<image>` 元素创造出令人赞叹的视觉体验。