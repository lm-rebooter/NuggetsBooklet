在现代 Web 开发和可视化设计中，创建引人注目的图形和图像已经成为一种重要的技能。在这个追求视觉吸引力和用户体验的时代，SVG 渐变脱颖而出，成为 Web 设计师和开发者的利器之一。SVG 渐变不仅能够为你的项目增添魅力，还能够让你以一种优雅而灵活的方式实现丰富多样的效果。

  


无论你是在构建 Web 页面、开发数据可视化应用还是设计用户界面，SVG 渐变都可以为你的作品添加绚丽的色彩和流畅的过渡效果。通过简单的定义起始颜色、结束颜色以及渐变方式，你就可以创造出令人惊叹的视觉效果，从温和的单色渐变到华丽的多色径向渐变，无所不能。

  


在这节课中，我们将从基础知识开始，介绍 SVG 渐变的基本概念和语法。然后，我们将深入研究各种渐变类型，包括线性渐变和径向渐变。通过实例演示和实践操作，你将逐步掌握如何创建令人惊叹的渐变效果。不仅如此，我们还将探讨 SVG 渐变与 CSS 渐变功能之间的联系和区别。我们将学习如何充分利用这些工具，创造出更加生动、立体的视觉效果，让你的作品脱颖而出。

  


无论你是初学者还是有经验的开发者，我们都将为你提供清晰易懂的解释和实用的示例，帮助你掌握 SVG 渐变的精髓，从而让你的作品更加生动、引人入胜。让我们一起探索SVG渐变的魔法，为我们的设计增添更多色彩和创意吧！

  


## SVG 渐变简介与基本用法

  


当谈到渐变时，CSS 提供了一系列丰富的选项，包括线性渐变、径向渐变和锥形渐变，以及它们的重复版本：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7722dd6fe893455a8f5405802e039712~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1058&s=652984&e=jpg&b=ea7b44)

  


-   **线性渐变**：`linear-gradient()` 和 `repeating-linear-gradient()` ，可以在两个或多个指定的颜色之间创建一个沿着一条直线的方向进行过渡的渐变效果。可以通过指定渐变的起点和终点来控制渐变的方向，也可以添加多个颜色和色标，以实现更加复杂的效果
-   **径向渐变**：`radial-gradient()` 和 `repeating-radial-gradient()` ，在一个指定的圆形或椭圆形区域内创建一个渐变效果，从中心向外辐射。与线性渐变不同的是，径向渐变的起点是渐变的中心，可以通过指定渐变的形状、渐变中心位置和半径大小来控制渐变的效果
-   **锥形渐变**：`conic-gradient()` 和 `repeating-conic-gradient()` ，在一个指定的圆形或椭圆形区域内创建一个渐变效果。与径向渐变不同的是，锥形渐变是沿着一个中心点向外呈锥形扩展的，可以通过指定渐变的起始角度和旋转角度来控制渐变的方式和样式

  


```CSS
.gradients {
    /* 线性渐变 */
    background: linear-gradient(to right, red, blue);     /* 从左到右的渐变，从红色到蓝色 */
    background: linear-gradient(45deg, red, blue, green); /* 45度角的渐变，从红色到蓝色再到绿色 */
    
    /* 径向渐变 */
    background: radial-gradient(red, blue);                           /* 从中心向四周辐射的径向渐变，从红色到蓝色 */
    background: radial-gradient(ellipse at center, red, blue, green); /* 椭圆形的径向渐变，从红色到蓝色再到绿色 */
    
    /* 锥形渐变 */
    background: conic-gradient(red, blue); /* 以 0 度为起始角，顺时针旋转的锥形渐变，从红色到蓝色 */
    background: conic-gradient(from 45deg at center, red, blue, green); /* 以45度为起始角度，顺时针旋转的锥形渐变，从红色到蓝色再到绿色 */
    
    /* 重复性渐变 */
    
    /* 重复性线性渐变，从红色到蓝色，循环间距50px */
    background: repeating-linear-gradient(to right, red, blue 50px);

    /* 重复性径向渐变，从中心向四周辐射，循环间距100px */
    background: repeating-radial-gradient(red, blue 100px);

    /* 重复性锥形渐变，顺时针旋转，循环间距 200deg */
    background: repeating-conic-gradient(red, blue 200deg);
}
```

  


通过这些功能，Web 开发者可以实现各种各样的渐变效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4f31f3a8dfd446d8162ba599b4755f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=730&s=98234&e=jpg&b=131313)

  


除了 CSS 渐变，SVG 也提供了丰富的渐变功能。与 CSS 不同的是，SVG 的渐变是通过 `<linearGradient>` 和 `<radialGradient>` 元素来实现的。这两个元素分别定义了线性渐变和径向渐变效果，并允许用户自定义渐变的起始点、终止点、颜色和渐变方向等属性。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2d9ba6664cb40ecb103552819e1d7be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3816&h=2640&s=408762&e=png&b=ffffff)

  


-   **线性渐变**：通过 `<linearGradient>` 元素实现，在 SVG 中定义两个或多个颜色之间的渐变效果，沿着一条直线进行过渡。可以通过指定渐变的起点和终点来控制渐变的方向和长度。
-   **径向渐变**：通过 `<radialGradient>` 元素实现，在 SVG 中创建一个从中心向外的渐变效果。可以指定渐变的中心、起始半径和结束半径，以及渐变的颜色和位置。

  


例如：

  


```XML
<svg viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient" x1="732" x2="732" y1="0" y2="609" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ED1515" />
            <stop offset=".48" stop-color="#CB6F19" />
            <stop offset="1" stop-color="#A71EC9" />
        </linearGradient>
    </defs>
    <path fill="url(#linearGradient)" d="M0 0h1464v609H0z" />
</svg>

<svg viewBox="0 0 1024 1024">
    <defs>
        <radialGradient id="radialGradient" cx="0" cy="0" r="1" gradientTransform="rotate(-23.039 1113.031 -1643.569) scale(778.059 798.177)" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ED1515" />
            <stop offset=".348" stop-color="#CB6F19" />
            <stop offset=".904" stop-color="#A71EC9" />
        </radialGradient>
    </defs>
    <path fill="url(#radialGradient)" d="M0 0h1464v609H0z" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd7f6e88f3df45e2bff1fb0cd70b3b49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=853&s=312902&e=jpg&b=c95e30)

  


> Demo 地址：https://codepen.io/airen/full/KKYyOVx

  


正如你所看到的，定义线性和径向渐变的详细信息都存储在 `<defs>` 元素内，并且每个渐变都有一个唯一的 `id` 名，然后使用 `url(#idName)` 将定义好的渐变应用到 SVG 图形元素的 `fill` 或 `stroke` 属性中。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6ea91f78543420688b25d48ebd67839~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2493&h=1532&s=916919&e=jpg&b=050505)

  


简单地说，定义 SVG 渐变需要遵循唯一标识符、指定渐变属性、定义渐变颜色和位置等基本信息。然后，通过将渐变应用到相应的图形元素上，可以实现丰富多彩的渐变效果。当然，SVG 渐变允许创建更加复杂的效果，例如在渐变中添加多个颜色和位置的停止点，或者在图形中使用不同的渐变。这使得 SVG 渐变成为创建各种视觉效果的理想选择，无论是简单的图形还是复杂的图形，都可以通过 SVG 渐变来实现。

  


SVG 渐变的优势之一是可以在矢量图形中实现复杂的渐变效果，使得图形在放大或缩小时保持清晰度和平滑度。

  


注意，到目前为止，SVG 中还没有锥形渐变。接下来，我们将深入探讨 SVG 的线性渐变和径向渐变，以及它们和 CSS 渐变之间的差异。先从 SVG 的线性渐变开始。

  


## SVG 线性渐变：`<linearGradient>`

  


SVG 线性渐变类似于 CSS 的线性渐变，它将沿着一条直线（渐变轴）均匀地改变颜色。我们可以通过改变渐变轴的方向、长短来改变渐变效果；在渐变轴上增加颜色和调整色标位置也将会改变渐变效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf4dbcb669b248fa8f3c272806fccf13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=556&s=19227523&e=gif&f=479&b=f6f5f5)

  


上图演示了诸如 Figma 图形设计软件给五角星图形填充了一个线性渐变，并通过调整渐变轴、渐变颜色、色标位置等改变线性渐变的效果。

  


借助上图，先来解释线性渐为中的几个重要的概念与参数：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fdd2aeccff0423cb7db29526297052a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1236&s=441561&e=jpg&b=f5f5f5)

  


-   渐变轴：也称渐变线，它的起点（`x1,y1`）和终点（`x2,y2`）位置将会决定渐变的方向，
-   渐变轴起点和终点位置：`<linearGradient>` 元素的 `x1` 、`y1` 、`x2` 和 `y2` 属性将定义渐变轴的起点和终点位置，其中 `x1` 和 `y1` 决定起点位置，`x2` 和 `y2` 决定终点位置
-   渐变颜色和色标位置：它们指的是渐变轴上定义的颜色和位置。SVG 的 `<stop>` 元素将会定义渐变颜色和色标位置，其中该元素的 `stop-color` 用于定义渐变颜色，`offset` 用于定义色标位置（渐变颜色在渐变轴上的位置）

  


注意，SVG 渐变中还有一个边界框的概念，这个概念将放到课程后面再介绍。

  


接下来，我们通过示例来向大家逐步介绍 SVG 的线性渐变如何创建和应用，以及可用的属性选项。

  


首先，我们使用 `<path>` 元素绘制一个五角星，并且它的 `fill` 属性的值是 `<linearGradient>` 定义的渐变，例如 `url(#linearGradient)`，其中 `linearGradient` 是 `<linearGradient>` 元素的 `id` 名，它也是该渐变的唯一标识符。

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
        </linearGradient>
    </defs>
    <path fill="url(#linearGradient)" d="m565.229 34.69 112.062 237.506c8.703 18.317 25.412 31.051 44.817 33.995l250.736 38.074c48.689 7.406 68.214 70.036 32.931 105.959L824.308 635.13c-13.998 14.238-20.349 34.811-17.053 54.928l42.809 261.086c8.343 50.688-42.633 89.442-86.21 65.51L539.577 893.402a57.031 57.031 0 0 0-55.271 0l-224.277 123.26c-43.577 23.916-94.553-14.83-86.202-65.51l42.81-261.094c3.319-20.117-3.096-40.698-17.086-54.928L18.148 450.224C-17.127 414.3 2.326 351.67 51.07 344.264l250.705-38.073c19.349-2.944 36.074-15.678 44.753-33.995L458.638 34.69c21.82-46.153 84.826-46.153 106.583 0z"/>
</svg>
```

  


通常情况之下，`<linearGradient>` 被放置在 `<defs>` 元素内，这样做的好处是重用性和性能优化：

  


-   重用性：将渐变定义放置在 `<defs>` 元素内使其成为一个可重用的资源。这意味着你可以在文档中多次引用相同的渐变，而无需重复定义。这样做有助于减少重复代码，提高代码的可维护性
-   性能优化：将渐变定义放置在 `<defs>` 元素有助于优化性能。当浏览器解析 SVG 文档时，它会在遇到渐变引用时仅计算一次渐变，然后将其应用到多个图形元素中。这样可以减少浏览器的计算量，提高页面加载和渲染速度

  


理论上说，渐变元素可以放置在文档其他位置（不嵌套在 `<defs>` 内），但这不符合 SVG 最佳实践。

  


接着，使用 `<stop>` 元素为渐变定义渐变颜色。你至少需要两种颜色来创建一个渐变（在 `<linearGradient>` 元素中有两个 `<stop>` 元素）。但是，你可以使用的渐变颜色没有上限。对于渐变中的每个颜色，它将由 `<stop>` 元素的 `stop-color` 、`offset` 和 `stop-opacity` 来决定：

  


-   `stop-color` ：指定了渐变中当前位置的颜色（你想要在渐变中使用的颜色）。这个属性可以使用任何颜色值来表示，即 CSS 的 `<color>` 值类型都可用
-   `offset` ：指定渐变颜色在渐变轴中的位置。它表示沿着渐变方向的百分比位置。例如，如果 `offset` 设置为 `0%` ，那么这个颜色将出现在渐变轴的起始位置；如果 `offset` 设置为 `100%` ，那么这个颜色将出现在渐变轴的结束位置。它也可以是 `0 ~ 1` 之间的值
-   `stop-opacity` ：指定了渐变颜色的不透明度。它表示在给定位置的颜色的透明度。它的默认值为 `1` ，表示完全不透明。如果希望颜色在渐变中逐渐变为透明，则可以调整此属性值为小于 `1` 的值

  


例如：

  


```XML
<svg viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop stop-color="#ED2B2B" />
            <stop stop-color="#FEBA0B" offset="1" /> 
        </linearGradient>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29a9d378c9f141308c5af503adba56f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=837&s=266310&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/xxepRzP

  


你可以通过调整每个 `<stop>` 元素的 `stop-color` 和 `offset` 属性的值，创建出不同的渐变效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcd5f78bfea3493fbcb4dfa4fdbe95ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=568&s=7854927&e=gif&f=804&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/YzMYNgX

  


不难发现，如果第一个偏移量大于零（第一个 `<stop>` 元素的 `offset`），或者最后一个偏移量小于 `1` （最后一个 `<stop>` 元素的 `offset`），那么渐变轴的两侧将会有一块纯色:

  


```XML
<svg viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop stop-color="#ED2B2B" offset="0.3" />
            <stop stop-color="#FEBA0B" offset="0.7" /> 
        </linearGradient>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42d143d4a7424a048c4be748867e6814~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=954&s=400573&e=jpg&b=050505)

  


-   渐变轴 `0 ~ 0.3` 之间的偏移量对应的是 `#ed2b2b` 纯色（第一个 `<stop>` 元素的 `stop-color` 值）
-   渐变轴 `0.7 ~ 1` 之间的偏移量对应的是 `#feba0b` 纯色（第二个 `<stop>` 元素的 `stop-color` 值）

  


前面提到过，可以在 `<linearGradient>` 添加多个 `<stop>` 元素创建多色渐变效果，例如：

  


```XML
<svg viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop stop-color="#ff0000" offset="0.14"/>
            <stop stop-color="#ffa500" offset="0.28" />
            <stop stop-color="#ffff00" offset="0.42" />
            <stop stop-color="#008000" offset="0.56" />
            <stop stop-color="#0000ff" offset="0.70" />
            <stop stop-color="#4b0082" offset="0.84" />
            <stop stop-color="#800080" offset="1" />
        </linearGradient>
    </defs>
</svg>
```

  


当有两个以上的渐变颜色时，偏移之间的间距控制着渐变颜色变化的速率：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dae307377de34f77afdb18a1ff02304e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=654&s=12301559&e=gif&f=992&b=0a0a0a)

  


> Demo 地址：https://codepen.io/airen/full/xxepqzZ

  


另外，在 SVG 中，元素出现的顺序很重要，`<stop>` 元素必须按照从渐变开始到结束的顺序给出。如果你指定的偏移量小于前一个 `<stop>` 的偏移量，它将被调整为与前一个最大偏移量完全匹配。如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29c1e2ef09604850b28d79535bcd6cda~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1169&s=419222&e=jpg&b=282725)

  


如果连续的 `<stop>` 具有相同的偏移量（`offset` 值相等），渐变颜色之间就没有过渡的效果，将会呈现一条锐利的线，这种方式可以用于绘制条纹效果。这一点以 CSS 的线性渐变是相似的：

  


```CSS
.ele {
    background-image: linear-gradient(
        to right,
        red 0%,red 14%,
        orange 14%, orange 28%,
        yellow 28%, yellow 42%,
        green 42%, green 58%,
        blue 58%, blue 72%,
        indigo 72%, indigo 86%,
        violet 86%, violet 100%
    )
}
```

  


```XML
<svg viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop offset="0" stop-color="red" />
            <stop offset="14%" stop-color="red" />
            <stop offset="14%" stop-color="orange" />
            <stop offset="28%" stop-color="orange" />
            <stop offset="28%" stop-color="yellow" />
            <stop offset="42%" stop-color="yellow" />
            <stop offset="42%" stop-color="green" />
            <stop offset="58%" stop-color="green" />
            <stop offset="58%" stop-color="blue" />
            <stop offset="72%" stop-color="blue" />
            <stop offset="72%" stop-color="indigo" />
            <stop offset="86%" stop-color="indigo" />
            <stop offset="86%" stop-color="violet" />
            <stop offset="100%" stop-color="violet" />
        </linearGradient>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c14ec06420d94ef981c338e12a52f26f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=992&s=371049&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/bGJaRge

  


前面演示的示例，渐变颜色都是完全不透明的，但我们也可以控制渐变颜色的不透明度。简单的方式是设置带有透明通道的渐变颜色，例如：

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop stop-color="oklch(0.61 0.23 27.24 / .8)" />
            <stop stop-color="oklch(0.83 0.17 81.66 / .3)" offset="1" />
        </linearGradient>
    </defs>
</svg>
```

  


上面代码中，两个渐变颜色都带有一定的透明度。效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c839ef395c604d4282f1c4d5d1479be1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=992&s=361125&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/jORYwKL

  


然而，SVG 有一个更简单的解决方案，允放不透明与颜色独立控制。即 `<stop>` 元素的 `stop-opacity` 属性来控制渐变颜色的透明度。该属性的值与 `fill-opacity` 以及 CSS 的 `opacity` 属性值是相似的，值介于 `0 ~ 1` （也可以是 `0% ~ 100%`），越接近 `1` ，表示渐变颜色不完全透明；越接近 `0` ，则表示渐变颜色完全透明。

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop stop-color="oklch(0.61 0.23 27.24)" stop-opacity=".8" />
            <stop stop-color="oklch(0.83 0.17 81.66)" stop-opacity=".3" offset="1" />
        </linearGradient>
    </defs>
</svg>
```

  


就效果上而言，设置 `stop-opacity` 与带 Alpha（透明通道）的颜色值效果近乎一样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c17f5dc3c5447a184e6ef88c268fc73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1658&s=798791&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/NWmXgog

  


也就是说，使用 `stop-opacity` ，你可以创建一个渐变，从不透明过渡到透明的单一颜色，或者同时过渡颜色和不透明度。尝试着调整下面示例中的 `stop-opacity` 值，但看渐变效果的变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c0d095a76a443cda54b43051aa3aa52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=478&s=9026154&e=gif&f=592&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/mdgpMyr

  


正如你所看到的，`<stop>` 元素的 `stop-color` 、`stop-opacity` 和 `offset` 三个属性决定了渐变的效果。但需要知道的是，其中 `stop-color` 和 `stop-opacity` 不是必须的。换句话说，当 `stop-color` 和 `stop-opacity` 未显式设置时，将会取其默认值，其中 `stop-color` 的默认值为黑色，`stop-opacity` 的默认值为 `1` 。不过 `offset` 是必须的属性，如果未设置，它将默认为 `0`。例如，下面这个示例，它从透明黑变为不透明黑：

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop stop-opacity="0" />
            <stop offset="1" />
        </linearGradient>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aed84168f439494ca531b9c02b0de510~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=992&s=381364&e=jpg&b=255d89)

  


> Demo 地址：https://codepen.io/airen/full/KKYZbbJ

  


上面我们所展示的案例，它的渐变方向都是从左到右的（默认方向），但 SVG 的线性渐变并不限于这一方向。实际上，SVG 允许我们灵活地定义渐变的方向，从而创建各种不同的效果。

  


只不过，改变 SVG 线性渐变的方向与 CSS 线性渐变有所不同，CSS 的线性渐变的默认方向是从上到下，而 SVG 的线性渐变方向是从左到右。其次，我们可以通过使用诸如 `to right` 、`to bottom` 、`to top right` 和角度值（如 `45deg`）来改变 CSS 线性渐变的方向：

  


```CSS
.ele {
    background-image: linear-gradient(to right, red, blue);
    background-image: linear-gradient(45deg, red, blue);
}
```

  


然而，要改变 SVG 线性渐变的方向，则需要通过调整渐变元素 `<linearGradient>` 的 `x1` 、`y1` 、`x2` 和 `y2` 属性来实现。这些属性定义了一个向量，从渐为轴的起点 `[x1,y1]`到结束点 `[x2,y2]`，从而确定了渐变的方向（渐变沿着这个向量的方向进行）。

  


`<linearGradient>` 元素上的 `x1` 、`y1` 、`x2` 和 `y2` 与 `<line>` 元素的 `x1` 、`y1` 、`x2` 和 `y2` 是相似的，类似绘制了一条线（渐变线，也称渐变轴）。默认情况下，`x2` 为 `100%` ，其他属性为 `0`。这意味着，使用默认属性绘制的线，它将从绘图的顶部从左到右延伸。这就是 SVG 线性渐变默认方向是从左到右。

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient">
            <stop stop-color="#ED2B2B" />
            <stop offset="1" stop-color="#FEBA0B" />
        </linearGradient>
    </defs>
</svg>

<!-- 等同于 -->
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient" x1="0" y1="0" x2="100%" y2="0">
            <stop stop-color="#ED2B2B" />
            <stop offset="1" stop-color="#FEBA0B" />
        </linearGradient>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78640a480e5943c7b1674ad2163bd2fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=992&s=477965&e=jpg&b=255f8b)

  


> Demo 地址：https://codepen.io/airen/full/KKYZJpL

  


如此一来，我们只需要调整 `<linearGradient>` 的 `x1` 、`y1` 、`x2` 和 `y2` 属性的值，就可以模拟出 CSS 线性渐变相同的渐变方向：

  


| **CSS 线性渐变方向**    | **SVG 线性渐变方向**                            |
| ----------------- | ----------------------------------------- |
| `to right`        | `x1="0"` `y1="0"` `x2="100%"` `y2="0"`    |
| `to bottom`       | `x1="0"` `y1="0"` `x2="0"` `y2="100%"`    |
| `to left`         | `x1="100%"` `y1="0"` `x2="0"` `y2="0"`    |
| `to top`          | `x1="0"` `y1="100%"` `x2="0"` `y2="0"`    |
| `to top right`    | `x1="0"` `y1="100%"` `x2="100%"` `y2="0"` |
| `to bottom right` | `x1="0"` `y1="0"` `x2="100%"` `y2="100%"` |
| `to bottom left`  | `x1="100%"` `y1="0"` `x2="0"` `y2="100%"` |
| `to top left`     | `x1="100%"` `y1="100%"` `x2="0"` `y2="0"` |

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5bf83e5d43a40f0afeb7e3631de0f1a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1343&s=1637433&e=jpg&b=045f8d)

  


> Demo 地址：https://codepen.io/airen/full/BaEJMYb

  


事实上，通过调整 `x1` 、`y1` 、`x2` 和 `y2` 属性的值可以将模拟出任意你需要的渐变方向。另外，渐变向量的起始点和结束点也可以超出 `0% ~ 100%` 的范围。例如下面这个示例，可以尝试调整 `x1` 、`y1` 、`x2` 和 `y2` 获得任意你想要的渐变方向：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70436d13b5b94ddb90317afde805306b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=610&s=7465823&e=gif&f=671&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/mdgpZxd

  


你可能会问，`<linearGradient>` 元素的 `x1` 、`y1` 、`x2` 和 `y2` 等属性的百分比值是相对谁计算？简单地说，它们是由 `<linearGradient>` 元素的 `gradientUnits` 属性来决定。该属性提供了 `userSpaceOnUse` 和 `objectBoundingBox` 两个选项，用于指定渐变的单位，其中 `objectBoundingBox` 为预设值（默认值）：

  


-   `userSpaceOnUse`：这个属性意味着我们在渐变定义中使用的坐标值是相对于 SVG 视口的。简单来说，渐变的位置和尺寸是直接以像素值或者百分比值来计算的，而不考虑对象的大小和位置。这种方式可以让我们更精细地控制渐变的位置和尺寸，不受对象的限制。这意味着，在这种模式下，`x1`、`y1`、`x2` 和 `y2` 属性的值可以直接表示为像素值或者百分比值，而不是相对于对象的边界框来计算的。
-   `objectBoundingBox`：这个属性意味着我们在渐变定义中使用的坐标值是相对于应用渐变的对象的边界框的。换句话说，渐变的位置和尺寸是相对于对象的宽度和高度来计算的。这种方式可以让渐变随着对象的大小和位置的变化而自动调整，保持与对象的相关性。在这种模式下，`x1`、`y1`、`x2` 和 `y2` 属性的值是相对于对象的宽度和高度的百分比值来指定的，取值范围在 `0` 到 `1` 之间。

  


简单来说，`userSpaceOnUse` 让我们可以独立地定义渐变，而 `objectBoundingBox` 让渐变与对象的大小和位置相关联。选择适当的 `gradientUnits` 取决于你希望如何定义渐变的位置和尺寸。如果希望渐变与对象的大小和位置无关，而是在用户坐标系中定义，那么使用 `userSpaceOnUse`。如果希望渐变与对象的大小和位置有关，并且希望它随着对象的大小和位置的变化而自动调整，那么使用 `objectBoundingBox`。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6904a10c0f447bd8abd8bb1f903aa37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1196&h=884&s=3642588&e=gif&f=117&b=f46c1e)

  


> Demo 地址：https://codepen.io/airen/full/YzMYmYG

  


上面这个示例可能不太明显，换下面这个示例，我们创建了三个 `<rect>` ，它们的宽度和在 SVG 视口中的位置都有所差异，但 `fill` 都应用了同一个渐变填充 `#linearGradient` ：

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
            <stop stop-color="#ED2B2B" offset="0" />
            <stop offset="1" stop-color="#FEBA0B" />
        </linearGradient>
        <marker id="start" viewBox="-2 -2 4 4">
            <circle r="1.5" />
        </marker>
        <marker id="end" viewBox="-4 -2 6 4" orient="auto">
            <polygon points="-5,-3 2,0 -5,3" />
        </marker>
    </defs>

    <rect x="0" y="0" width="100%" height="30%" fill="url(#linearGradient)" />
    <rect x="0%" y="32%" width="50%" height="30%" fill="url(#linearGradient)" />
    <rect x="0%" y="64%" width="70%" height="30%" fill="url(#linearGradient)" />

    <line x1="0" y1="0" x2="100%" y2="0" />
</svg>
```

  


尝试着调整示例中 `gradientUnits` 的值，你可以看到 `userSpaceOnUse` 和 `objectBoundingBox` 两个选项对矩形渐变效果的影响：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c13b0454b654899b8140545082e1255~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=648&s=5025041&e=gif&f=286&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/yLrvByd

  


众所周知，CSS 的线性渐变还可以通过角度值来改变线性渐变的方向，例如：

  


```
.ele {
    background-image: linear(45deg, red, blue);
}
```

  


事实上，在 SVG 中，除了直接指定渐变轴起始点和结束点位置改变线性渐变方向之外，还可以通过使用 `gradientTransform` 属性来改变渐变方向。该属性允许对渐变进行额外的变换，从渐变坐标系统到目标坐标系统（即 `userSpaceOnUse` 或 `objectBoundingBox`）。这个属性可以用来实现一些特殊的渐变效果，例如倾斜、旋转或缩放渐变。

  


具体来说，`gradientTransform` 属性包含一个变换矩阵，该矩阵将应用于渐变坐标系统的坐标，并将其转换为目标坐标系统。这个变换矩阵可以是平移（`translate`）、缩放（`scale`）、旋转（`rotate`）或倾斜（`skew`）等一系列变换函数的组合。

  


-   平移（`translate(tx,ty)`）：把渐变整体往左右上下移动，但不改变形状。
-   缩放（`scale(s)` 或 `scale(sx,sy)`）：可以让渐变变得更大或更小，拉伸或翻转为镜像。
-   旋转（`rotate(a)` 或 `rotate(a,cx,cy)`）：让渐变绕着一个点转动，就像是围绕中心点旋转一样。
-   倾斜（`skewX(a)` 或 `skewY(a)`）：可以让渐变倾斜，就像是把画布倾斜一样，可以让渐变的角度发生变化。

  


以放置为例，使用 `gradientTransform="rotate(45)"` 可以模拟出类似 CSS 线性渐变效果。你可以尝试调整下面示例中的角度值，查看渐变效果的变化：

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox" gradientTransform="rotate(45)">
            <stop stop-color="#ED2B2B" offset="0"  />
            <stop offset="1" stop-color="#FEBA0B" />
        </linearGradient>
    </defs>
  
    <path fill="url(#linearGradient)"  d="m565.229 34.69 112.062 237.506c8.703 18.317 25.412 31.051 44.817 33.995l250.736 38.074c48.689 7.406 68.214 70.036 32.931 105.959L824.308 635.13c-13.998 14.238-20.349 34.811-17.053 54.928l42.809 261.086c8.343 50.688-42.633 89.442-86.21 65.51L539.577 893.402a57.031 57.031 0 0 0-55.271 0l-224.277 123.26c-43.577 23.916-94.553-14.83-86.202-65.51l42.81-261.094c3.319-20.117-3.096-40.698-17.086-54.928L18.148 450.224C-17.127 414.3 2.326 351.67 51.07 344.264l250.705-38.073c19.349-2.944 36.074-15.678 44.753-33.995L458.638 34.69c21.82-46.153 84.826-46.153 106.583 0z" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/339f9a20f0d74a809583733c6265584e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=716&s=3312220&e=gif&f=194&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/eYoVOLd

  


结合 `<linearGradient>` 元素的 `href` 属性，在另一个已经定义好的线性渐变的基础上，通过调整 `gradientTransform` 属性的值，获得更多的渐变效果：

  


```XML
<svg class="sr-only" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
            <stop stop-color="darkViolet" offset="0" />
            <stop stop-color="blue" offset="0.143" />
            <stop stop-color="cyan" offset="0.286" />
            <stop stop-color="limeGreen" offset="0.429" />
            <stop stop-color="yellow" offset="0.572" />
            <stop stop-color="orange" offset="0.715" />
            <stop stop-color="red" offset="0.857" />
            <stop stop-color="maroon" offset="1" />
        </linearGradient>
    </defs>
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="rotate(45)" href="#linearGradient" id="linearGradient1"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient1')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="rotate(-45, .3, .5)" href="#linearGradient" id="linearGradient2"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient2')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="translate(0.3, .5)" href="#linearGradient" id="linearGradient3"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient3')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="translate(-0.1, -0.2)" href="#linearGradient" id="linearGradient4"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient4')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="skewX(20)" href="#linearGradient" id="linearGradient5"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient5')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="skewY(-45)" href="#linearGradient" id="linearGradient6"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient6')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="scale(.5)" href="#linearGradient" id="linearGradient7"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient7')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="scale(3)" href="#linearGradient" id="linearGradient8"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient8')" />
</svg>

<svg class="star">
    <defs>
        <linearGradient gradientTransform="scale(1.3) rotate(325) translate(-.13,-.15)" href="#linearGradient" id="linearGradient9"  />
    </defs>
    <use href="#star" style="--fill:url('#linearGradient9')" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35284b2b5f1f437fa8d929455780253f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=901&s=466281&e=jpg&b=255f8b)

  


> Demo 地址：https://codepen.io/airen/full/poBaozb

  


在 CSS 中，我们可以通过 `repeating-linear-gradient()` 来创建重复线性渐变：

  


```CSS
.ele {
    background: repeating-linear-gradient(to right, red, blue 50px);
}
```

  


在 SVG 中，并没有一个类似于 `<repeatingLinearGradient>` 的元素来创建重复性线性渐变，不过， `<linearGradient>` 元素的 `spreadMethod` 属性的 `repeat` 可以帮助你创建一个重复线性渐变效果。

  


`spreadMethod` 属性的值指定了如果渐变在目标（SVG）的边界内开始或结束，渐变将如何通过形状扩展。它提供了三个选项：`pad`（填充）、`repeat`（重复）、`reflect`（反射）:

  


-   `pad`（填充）：将渐变的第一个和最后一个颜色扩展到未覆盖的目标区域的剩余部分。
-   `repeat`（重复）：将渐变从开始连续重复直到整个目标区域被填满。
-   `reflect`（反射）：将渐变图案从开始到结束交替反射，直到填满目标区域。

  


如果未指定该值，则默认为 `pad`。你可以尝试着更改下面示例中的 `spreadMethod` 值，查看填充在五角星上的渐变效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/423e8062f6f6464da3f7ba3c32fdca5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=862&s=19524395&e=gif&f=735&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/QWPQWVv

  


来看一个与 CSS 重复性线性渐变的效果：

  


```XML
<svg class="star" viewBox="0 0 1024 576">
    <defs>
        <linearGradient id="linearGradient" spreadMethod="repeat" x1="0" y1="0" x2="26.66%" y2="0">
            <stop offset="0%" stop-color="oklch(0.74 0.2 57.77)" />
            <stop offset="50%" stop-color="oklch(0.83 0.27 135.64)" />
            <stop offset="100%" stop-color="oklch(0.6 0.26 30.12)" />
        </linearGradient>
    </defs>
    <rect fill="url(#linearGradient)" x="0" y="0" width="100%" height="100%" />
</svg>

<div class="gradient"></div>
```

  


```CSS
.gradient {
    background: repeating-linear-gradient(to right, oklch(0.74 0.2 57.77), oklch(0.83 0.27 135.64) 13.33%, oklch(0.6 0.26 30.12) 26.66%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df37ec59e9cd4cb7948554ab7de7c2be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=795&s=446820&e=jpg&b=d5bd1e)

  


> Demo 地址：https://codepen.io/airen/full/QWPQvre

  


前面所展示的示例中，有的 `<linearGradient>` 元素上使用了`href` 属性。这里简单的介绍一下该属性。

  


`href` 属性用于指定另一个渐变的 `id` ，从而使当前渐变可以“继承”另一个渐变的定义。这意味着，你可以在文档中的不同位置重用相同的渐变定义。例如，前面 `gradientTransform` 案例中所有五角星都引用了相同的线性渐变 `#linearGradient` ，但每个五角星的 `gradientTransform` 属性应用了不同的值，这些值位于额外的 `<linearGradient>` 元素内部，并具有特定的 `id` 名。除此之外，还可以在继承过来的渐变上做一些调整，例如改变渐变方向、调整 `gradientTransform` 值，也可以调整渐变的颜色和色标的位置：

  


```XML
<svg class="sr-only" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id="linearGradient" x1="0" y1="0" x2="100%" y2="0">
            <stop stop-color="#ED2B2B" />
            <stop offset="1" stop-color="#FEBA0B" />
        </linearGradient>
        <!-- 在 linearGradient 的渐变的基础上调整渐变方向和设置 gradientTransform -->
        <linearGradient id="linearGradient2" href="#linearGradient" x1="0" y1="0" x2="100%" y2="100%" gradientTransform="scale(.2) translate(.2,-.2) rotate(45)" />
        <!-- 在 linearGradient2 的渐变基础上调整渐变方向和改变渐变颜色及位置 -->
        <linearGradient id="linearGradient3" href="#linearGradient2" x1="0" y1="0" x2="0" y2="100%">
            <stop offset=".5" stop-color="#FEBA0B" />
            <stop offset="1" stop-color="#ED2B2B" />
        </linearGradient>
        <symbol id="star" viewBox="0 0 1024 1024">
            <path fill="var(--fill, url(#linearGradient))" d="m565.229 34.69 112.062 237.506c8.703 18.317 25.412 31.051 44.817 33.995l250.736 38.074c48.689 7.406 68.214 70.036 32.931 105.959L824.308 635.13c-13.998 14.238-20.349 34.811-17.053 54.928l42.809 261.086c8.343 50.688-42.633 89.442-86.21 65.51L539.577 893.402a57.031 57.031 0 0 0-55.271 0l-224.277 123.26c-43.577 23.916-94.553-14.83-86.202-65.51l42.81-261.094c3.319-20.117-3.096-40.698-17.086-54.928L18.148 450.224C-17.127 414.3 2.326 351.67 51.07 344.264l250.705-38.073c19.349-2.944 36.074-15.678 44.753-33.995L458.638 34.69c21.82-46.153 84.826-46.153 106.583 0z" />
        </symbol>
    </defs>
</svg>

<svg class="star">
    <use href="#star" /> <!-- 应用默认渐变填充 linearGradient -->
</svg>
<svg class="star">
    <use href="#star" style="--fill: url(#linearGradient2)" />
</svg>
<svg class="star">
    <use href="#star" style="--fill: url(#linearGradient3)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6e85eb36e674042a0447ad93bde20c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=901&s=471597&e=jpg&b=265f8b)

  


> Demo 地址：https://codepen.io/airen/full/abxqWPw

  


关于 SVG 的线性渐变（`<linearGradient>`）元素的使用和基本特性已经介绍完毕。下面对其进行简要总结：：

  


-   **定义渐变**： 在 SVG 中，可以使用 `<linearGradient>` 元素来定义线性渐变。通过指定起始点 `(x1，y1)` 和结束点 `(x2，y2)` 以及渐变中的颜色（`stop-color`）和位置（`offset`）来定义渐变。
-   **渐变方向**： 渐变的方向由起始点和结束点决定。渐变从起始点向结束点进行颜色过渡。也可以通过 `gradientTransform` 属性来改变渐变方向
-   **颜色和位置**： 可以通过 `<stop>` 子元素在渐变中定义颜色和位置。每个 `<stop>` 元素包含一个颜色（`stop-color`）和一个位置偏移值（`offset`），但 `stop-color` 不是必须的。
-   **填充对象**： 定义了渐变后，可以通过将渐变应用为形状（例如矩形、圆形等）的填充（或描边）来实现渐变效果。使用 `fill` （或 `stroke`）属性并将其设置为渐变的 `id` ，例如 `fill="url(#linearGradient)`。
-   **渐变单位**： 可以使用 `gradientUnits` 属性来指定渐变的单位是用户空间还是对象边界框。默认情况下，渐变单位为对象边界框。
-   **渐变转换**： 可以使用`gradientTransform`属性对渐变进行变换，如平移、缩放、旋转等，以适应不同的需求。
-   **填充方式**：还可以使用 `spreadMethod` 属性来指定渐变在超出目标形状范围时的填充方式。
-   **继承渐变**：可以使用 `href` 属性引用另一个渐变元素的URL，该元素用作模板。为了有效，引用必须指向不同的`<linearGradient>` 元素。

  


SVG线性渐变提供了一种灵活的方法来创建丰富多彩的背景和图案，为 SVG 图形增添了视觉吸引力。

  


经过前面的学习，相信你已经对 SVG 的线性渐变（`<linearGradient>`）有了一定的了解。接下来，我们将通过以下案例进一步加深对 SVG 线性渐变的理解和应用。

  


不知道大家是否还有印象，在《[初级篇：SVG 描边与填充](https://juejin.cn/book/7341630791099383835/section/7349188496181887017)》的课程中有一个“使用 SVG 制作星级评分组件”的案例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef4bcea7ad7946c7a466a389f705fcc3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=673&s=39921&e=jpg&b=322e23)

  


当初我们仅介绍了实现整颗五角星的描边与填充效果，并未涉及到半颗星的填充与描边的制作。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44c87655b7fc41478c7080db907870f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=531&s=29905&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/VwNWbeJ

  


但对于一个“星级评分组件”，填充或描边半颗星也是很重要的，毕竟有的时候打分不全都是整数分，例如 `4.5` 。那么，我们就使用今天所学到的线性渐变来完善这个“星级评分组件”。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f243a8d802cf4f0eb2f85460af9b975a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1215&s=537420&e=jpg&b=050505)

  


我们需要分别为填充的星星和描边的星星定义两个渐变。注意渐变中的两个颜色的停止点，它们都位于五角形的一半位置，即 `offset` 属性的值为 `50%` （或 `0.5`）。颜色分别对应的是高亮色（`--_fill-active`）和暗色（`--_fill-disable`）。描边的五角星与填充的五角星类似：

  


```XML
<svg class="sr-only">
    <defs>
        <linearGradient id="halfFill">
            <stop offset="50%" stop-color="var(--_fill-active)" />
            <stop offset="50%" stop-color="var(--_fill-disable)" />
        </linearGradient>
        <linearGradient id="halfStroke">
            <stop offset="50%" stop-color="var(--_stroke-active)" />
            <stop offset="50%" stop-color="var(--_stroke-disable)" />
        </linearGradient>
    </defs>
    <symbol viewBox="0 0 1024 1024" id="star">
        <path fill="var(--fill, #FECE3C)" stroke="var(--stroke,#F7F7F6)" stroke-width="var(--stroke-width, 10)" d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3-12.3 12.7-12.1 32.9 0.6 45.3l183.7 179.1-43.4 252.9c-1.2 6.9-0.1 14.1 3.2 20.3 8.2 15.6 27.6 21.7 43.2 13.4L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
    </symbol>
</svg>
```

  


在实际应用的时候，半颗五角星的填充（或描边）分别应用 `#halfFill` （或 `#halfStroke`）：

  


```HTML
<div class="rating fill">
    <svg class="active">
        <use href="#star" />
    </svg>
    <svg class="active">
        <use href="#star" />
    </svg>
    <svg class="active">
        <use href="#star" />
    </svg>
    <svg class="active">
        <use href="#star" />
    </svg>
    <svg class="half">
        <use href="#star" />
    </svg>
</div>

<div class="rating stroke">
    <svg class="active">
        <use href="#star" />
    </svg>
    <svg class="active">
        <use href="#star" />
    </svg>
    <svg class="active">
        <use href="#star" />
    </svg>
    <svg class="half">
        <use href="#star" />
    </svg>
    <svg>
        <use href="#star" />
    </svg>
</div>
```

  


```CSS
@layer demo {
    :root {
        --_fill-active: #fece3c;
        --_fill-disable: #a38888;
        --_stroke-active: #f7f7f6;
        --_stroke-disable: #a38888;
    }
  
    .fill {
        svg {
            --stroke: none;
            --fill: var(--_fill-disable);
    
            &.active {
                --fill: var(--_fill-active);
            }
          
            &.half {
                --fill: url(#halfFill);
            }
        }
    }

    .stroke {
        svg {
            --fill: none;
            --stroke: var(--_stroke-disable);
            --stroke-width: 30;
    
            &.active {
                --stroke: var(--_stroke-active);
            }
            
            &.half {
                --stroke: url(#halfStroke);
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f61c9d090fa14960b6869d6c109bc9f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1215&s=629362&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/rNbJbjq

  


## SVG 径向渐变：`<radialGradient>`

  


SVG 不仅支持线性渐变，还提供径向渐变（`<radialGradient>`）。它与线性渐变相似，但也有显著区别。径向渐变不是沿直线变化颜色，而是以圆形方式呈现。径向渐变是一种从中心向外辐射变化的渐变，可用于产生发光的光线效果，或者用于在球体和类似的圆形结构上绘制阴影。

  


在最简单的形式中，径向渐变由一个圆圈定义，颜色从圆圈的中心到其边缘逐渐变化。这是SVG `<radialGradient>` 元素的默认行为。然而，与默认行为不同，径向渐变可以创建多种效果，包括一些无法通过 CSS 渐变实现的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bd070b1d7a04f16b81af1a6b5b62606~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=512&s=17260768&e=gif&f=434&b=f7f7f7)

  


径向渐变在结构上与线性渐变类似，至少在标记中是如此。与 `<linearGradient>` 一样，`<radialGradient>` 是 `<stop>` 元素的容器，每个 `<stop>` 元素都有一个 `offset` 、`stop-color` 和 `stop-opacity` 属性，这些属性定义渐变颜色、位置和透明度。

  


```XML
<svg viewBox="0 0 1024 1024">
    <defs>
        <radialGradient id="radialGradient">
            <stop stop-color="#EF1B1B"/>
            <stop offset="1" stop-color="#AF52DE"/>
        </radialGradient>
    </defs>
</svg>
```

  


默认情况下，当 `<radialGradient>` 没有设置任何定位属性时，结束圆将是填充对象（如下图中的五角星）边框的最大圆，焦点（圆心）是其中心：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/691950e2fd514db89a856b02a64d9426~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1215&s=270276&e=jpg&b=f5f5f5)

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <radialGradient id="radialGradient">
            <stop stop-color="#ff0000" offset="0"/>
            <stop stop-color="#ffa500" offset=".33" />
            <stop stop-color="#ffff00" offset=".66" />
            <stop stop-color="#008000" offset="1" />
        </radialGradient>
    </defs>
    <circle cx="50%" cy="50%" r="50%" fill="url(#radialGradient)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6175570ff36e421c817d28bfc70b97bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=712&s=15669703&e=gif&f=712&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/dyLdENv

  


`<radialGradient>` 元素与 `<linearGradient>` 元素一样，具有 `gradientUnits` （改变用户单位）、`spreadMethod` （调整填充模式）和 `gradientTransform` (渐变变换)等属性，而且使用方式也与 `<linearGradient>` 一样：

  


```XML
<svg class="gradient" viewBox="0 0 1024 1024">
    <defs>
        <radialGradient id="radialGradient" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="rotate(45)">
            <stop stop-color="#ED2B2B" offset="0" />
            <stop offset="1" stop-color="#FEBA0B" />
        </radialGradient>
    </defs>
    <rect x="0" y="0" width="100%" height="25%" fill="url(#radialGradient)" />
    <circle cx="50%" cy="50%" r="20%" fill="url(#radialGradient)" />
    <rect x="0" y="32%" width="25%" height="36%" fill="url(#radialGradient)" />
    <rect x="75%" y="32%" width="25%" height="36%" fill="url(#radialGradient)" />
    <rect x="0" y="75%" width="40%" height="25%" fill="url(#radialGradient)" />
    <rect x="60%" y="75%" width="40%" height="25%" fill="url(#radialGradient)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/204b30387851433a91da84ecf17fa60c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1244&h=742&s=14257687&e=gif&f=743&b=3f717b)

  


> Demo 地址：https://codepen.io/airen/full/vYMdwRp

  


你也可以像 `<linearGradient>` 一样，在 `<radialGradient>` 元素上使用 `href` 属性来引用指定的径向渐变，同样允许你在引用的径向渐变基础上修改渐变效果：

  


```XML
<svg class="sr-only" viewBox="0 0 1024 1024">
    <defs>
        <radialGradient id="radialGradient">
            <stop stop-color="#ED2B2B" />
            <stop offset="1" stop-color="#FEBA0B" />
        </radialGradient>
        <radialGradient id="radialGradient2" href="#radialGradient"  gradientTransform="scale(1.2) translate(.2, -.5)" />
        <radialGradient id="radialGradient3" href="#radialGradient2">
            <stop offset=".5" stop-color="#FEBA0B" />
            <stop offset="1" stop-color="#ED2B2B" />
        </radialGradient>
        <radialGradient id="radialGradient4" href="#radialGradient3" spreadMethod="repeat" gradientTransform="scale(.2) skewX(15)">
            <stop offset="0" stop-color="#FEBA0B" />
            <stop offset=".5" stop-color="#FEBA0B" stop-opacity=".5" />
            <stop offset="1" stop-color="#ED2B2B" />
        </radialGradient>
        <symbol id="star" viewBox="0 0 1024 1024">
            <path fill="var(--fill, url(#radialGradient))" d="m565.229 34.69 112.062 237.506c8.703 18.317 25.412 31.051 44.817 33.995l250.736 38.074c48.689 7.406 68.214 70.036 32.931 105.959L824.308 635.13c-13.998 14.238-20.349 34.811-17.053 54.928l42.809 261.086c8.343 50.688-42.633 89.442-86.21 65.51L539.577 893.402a57.031 57.031 0 0 0-55.271 0l-224.277 123.26c-43.577 23.916-94.553-14.83-86.202-65.51l42.81-261.094c3.319-20.117-3.096-40.698-17.086-54.928L18.148 450.224C-17.127 414.3 2.326 351.67 51.07 344.264l250.705-38.073c19.349-2.944 36.074-15.678 44.753-33.995L458.638 34.69c21.82-46.153 84.826-46.153 106.583 0z" />
        </symbol>
    </defs>
</svg>

<svg class="star">
    <use href="#star" />
</svg>
<svg class="star">
    <use href="#star" style="--fill: url(#radialGradient2)" />
</svg>
<svg class="star">
    <use href="#star" style="--fill: url(#radialGradient3)" />
</svg>
<svg class="star">
    <use href="#star" style="--fill: url(#radialGradient4)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a84d51a3061c43a29acf68ab0ffd7b10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=888&s=386464&e=jpg&b=255f8b)

  


> Demo 地址：https://codepen.io/airen/full/ZEZrNwQ

  


前面所探讨的都是关于 `<radialGradient>` （径向渐变）与 `<linearGradient>` （线性渐变）相似之处以及具有相同的功能：

  


-   都需要在 `<defs>` 元素中定义
-   都可以通过 `<stop>` 元素定义颜色和位置
-   都需要指定 `id` 名，用于标识渐变，使其可以在 SVG 文档中被引用
-   都可以通过 `gradientUnits` 属性来定义渐变坐标系统的类型（用户坐标系统 `userSpaceOnUse` 和对象边界框坐标系统 `objectBoundingBox`）
-   都可以通过 `gradientTransform` 属性来对渐变进行渐变，例如对渐变进行平移（`translate`）、缩放（`scale`）、倾斜（`skew`）和旋转（`rotate`）等操作
-   都可以通过 `spreadMethod` 属性定义渐变如何填充形状区域之外的空白区域，即填充模式，可选的值有 `pad` 、`repeat` 或 `reflect`
-   都可以通过 `href` 属性引用另一个渐变

  


这些属性和元素使得线性渐变和径向渐变在实现方式上有许多相似之处，但它们也有一些差异。除了渐变效果上的差异之外，另一个主要的差异就是改变渐变方向以及渐变轴的不同。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59bc197d42dc4024a42cf9d9fcfccabb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1215&s=539177&e=jpg&b=f5f5f5)

  


正如上图所示，线性渐变（`<linearGradient>`）的定位属性（渐变轴和渐变方向）看起来很像 `<line>` 元素，而径向渐变（`<radialGradient>`）的定位属性则类似于 `<circle>` 元素。简而言之，`<linearGradient>` 使用 `x1`、`y1`、`x2` 和 `y2` 确定渐变的方向和渐变轴的大小，而 `<radialGradient>` 使用 `cx`、`cy` 和 `r` 确定渐变圆轴的位置和大小。它们的默认值都是 `50%`，这会在图形边界框的坐标系统中创建一个居中的圆，填充整个宽度和高度。

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%"  spreadMethod="pad" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#ED2B2B" />
            <stop offset="0.5" stop-color="#0099ff" />
            <stop offset="1" stop-color="#FEBA0B" />
        </radialGradient>
    </defs>
  <circle cx="50%" cy="50%" r="50%" fill="url(#radialGradient)" />
</svg>
```

  


你可以尝试着调整 `<radialGradient>` 元素的 `cx` 、`cy` 和 `r` 查看径向渐变的变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe8817be029148e8a3ba330453ef2736~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=852&s=12876153&e=gif&f=362&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/qBwxeaG

  


除此之外，径向渐变还有另外两个定位属性：`fx` 和 `fy` 。它们可以用来调整焦点坐标，默认情况之下，它们与径向渐变的圆心重合：`fx` 的默认值是 `cx` 的值，`fy` 的默认值是 `cy` 的值。任何其他值都会创建一个不对称的渐变。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a320fcc38fb940419157d7a87571e117~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=400&s=47034&e=png&a=1&b=b18cfb)

  


[以 W3C 规范提供的示意图不为例](https://www.w3.org/TR/SVG2/pservers.html#RadialGradients)。上图展示了当 `fr` 是 `r` 的 `50%` 时几何属性的定义。小圆圈标记了最外圆的中心点 `(cx, cy)` ，而十字架标记了最内圆的中心点 `(fx,fy)` 。虚线显示了两个渐变向量。向量连接最内圆和最外圆上的对应点。最外圆外部的区域使用最后一个停止颜色进行绘制，而最内圆内部的区域使用第一个停止颜色进行绘制。

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"  spreadMethod="pad" gradientUnits="objectBoundingBox">
            <stop offset="0" stop-color="#ED2B2B" />
            <stop offset="0.5" stop-color="#0099ff" />
            <stop offset="1" stop-color="#FEBA0B" />
        </radialGradient>
    </defs>
    <circle cx="50%" cy="50%" r="50%" fill="url(#radialGradient)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/898c7b79e92843e98ab13cc5b7ae063e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=864&s=12518598&e=gif&f=349&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/PogQMLK

  


有一点需要知道，CSS 径向渐变 `radial-gradient()` 提供了 `circle` 和 `ellipse` 关键词，是能够在圆形（`circel`）和椭圆形（`ellipse`）渐变形状之间进行选择，它还具有指图形大小的关键词 `closest-side`、`farthest-side`、`closest-corner` 或 `farthest-corner`。

  


```CSS
.gradient {
    --shape: circle;
    --sideOrCorner:closest-side;
    background-image: radial-gradient(
        var(--shape)
        var(--sideOrCorner)
        at center,
        red,
        blue,
        green,
        yellow,
        orange
      )
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c43e70f444ad42f393c8a5bbb88236e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=662&s=15046921&e=gif&f=400&b=015180)

  


> Demo 地址：https://codepen.io/airen/full/yLrKBYw

  


但在 SVG 中，并没有提供相应的关键词来区分圆形径向渐变和椭圆形径向渐变。换句话说，在 SVG 中，要实现椭圆形径向渐变得另辟蹊径，比如使用 `gradientTransform` 来实现：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9bd55cfd4a841629fd961dbca69715d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=532&s=11436009&e=gif&f=319&b=f7f7f7)

  


```XML
<svg fill="none" viewBox="0 0 2634 2634">
    <circle cx="1317" cy="1317" r="1317" fill="url(#a)"/>
    <defs>
        <radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="matrix(0 1899 -916.602 0 1317 1317)" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F61616"/>
            <stop offset="1" stop-color="#153ECD"/>
        </radialGradient>
    </defs>
</svg>
```

  


了解完 `<radialGradient>` 相关理论与特性之后，我们就可以使用它来绘制图形效果，例如下面这个小雪人的效果，头和身子应用是同一个径向渐变：

  


```XML
<svg class="snowball" viewBox="-100 -200 200 400">
    <defs>
        <radialGradient id="snowball" cx="0.25" cy="0.25" r="1">
            <stop offset="0%" stop-color="white" />
            <stop offset="50%" stop-color="white" />
            <stop offset="100%" stop-color="#d6d6d6" />
        </radialGradient>
    </defs>

    <g class="body">
        <circle cx="0" cy="60" r="80" fill="url(#snowball)" />
        <g class="branches">
            <line x1="-40" y1="30" x2="-90" y2="-30" stroke="black" stroke-width="5" />
            <line x1="-65" y1="0" x2="-90" y2="-10" stroke="black" stroke-width="5" />
        </g>
    </g>
    
    <g class="header">
        <circle cx="0" cy="-40" r="50" fill="url(#snowball)" />
        <polygon points="10,-46 50,-40 10,-34" fill="#e66465" />
    
        <g class="eyes">
            <circle cx="0" cy="-55" r="5" />
            <circle cx="20" cy="-55" r="5" />
        </g>
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/811074f3201b49e290980669a1340f4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1270&s=553365&e=jpg&b=255f8b)

  


> Demo 地址：https://codepen.io/airen/full/poBLzwm

  


## 动画化渐变

  


稍微了解 CSS 渐变的同学都知道，在 CSS 中是无法直接动画化渐变。如果你需要对 CSS 渐变添加动画效果，只能采用别的手段来实现，比如调整 `background-position` 的值：

  


```CSS
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    
    50% {
        background-position: 100% 50%;
    }
    
    100% {
        background-position: 0% 50%;
    }
}
```

  


或者[通过 CSS 的 @property 来实现](https://juejin.cn/book/7223230325122400288/section/7258870477462962236#heading-5)：

  


```CSS
@property --startColor {
    syntax: "<color>";
    initial-value: magenta;
    inherits: false;
}

@property --stopColor {
    syntax: "<color>";
    initial-value: magenta;
    inherits: false;
}

@property --stop {
    syntax: "<percentage>";
    initial-value: 50%;
    inherits: false;
}

.gradient__css__houdini {
    --startColor: #2196f3;
    --stopColor: #ff9800;
  
    transition: --stop 0.5s, --startColor 0.2s, --stopColor 0.2s;
    background: linear-gradient(
        to right,
        var(--startColor) var(--stop),
        var(--stopColor)
    );
}

.gradient__css__houdini:hover {
    --startColor: #ff9800;
    --stopColor: #2196f3;
    --stop: 80%;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64a10a22f7b54c638f2b9d1a31e78554~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=470&s=861238&e=gif&f=112&b=4c496b)

  


> Demo 地址：https://codepen.io/airen/full/ZEVGpMy

  


就这方面而言，动画化 SVG 渐变要容易得多。在 SVG 中，可以通过 `<animate>` 或 （和）`<animateTransform>` 元素给 `<linearGradient>` 或 `<radialGradient>` 创建的渐变添加动画效果：

  


```XML
<svg class="star" viewBox="0 0 1024 1024">
    <defs>
        <linearGradient id='linearGradient' gradientUnits='objectBoundingBox' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0' stop-color='red'>
                <animate attributeName="stop-color" values="red;purple;blue;green;yellow;orange;red;" dur="20s" repeatCount="indefinite" />
            </stop>
            <stop offset='.5' stop-color='purple'>
                <animate attributeName="stop-color" values="purple;blue;green;yellow;orange;red;purple;" dur="20s" repeatCount="indefinite" />
            </stop>
            <stop offset='1' stop-color='blue'>
                <animate attributeName="stop-color" values="blue;green;yellow;orange;red;purple;blue;" dur="20s" repeatCount="indefinite" />
            </stop>
          <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="20s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id='linearGradient2' gradientUnits='objectBoundingBox' x1='0' y1='1' x2='1' y2='1'>
            <stop offset='0' stop-color='red'>
                <animate attributeName="stop-color" values="red;purple;blue;green;yellow;orange;red;" dur="20s" repeatCount="indefinite" />
            </stop>
            <stop offset='1' stop-color='purple' stop-opacity="0">
                <animate attributeName="stop-color" values="purple;blue;green;yellow;orange;red;purple;" dur="20s" repeatCount="indefinite" />
            </stop>
            <animateTransform attributeName="gradientTransform" type="rotate" values="360 .5 .5;0 .5 .5" class="ignore" dur="10s" repeatCount="indefinite" />
        </linearGradient>
    </defs>
    <path  d="m565.229 34.69 112.062 237.506c8.703 18.317 25.412 31.051 44.817 33.995l250.736 38.074c48.689 7.406 68.214 70.036 32.931 105.959L824.308 635.13c-13.998 14.238-20.349 34.811-17.053 54.928l42.809 261.086c8.343 50.688-42.633 89.442-86.21 65.51L539.577 893.402a57.031 57.031 0 0 0-55.271 0l-224.277 123.26c-43.577 23.916-94.553-14.83-86.202-65.51l42.81-261.094c3.319-20.117-3.096-40.698-17.086-54.928L18.148 450.224C-17.127 414.3 2.326 351.67 51.07 344.264l250.705-38.073c19.349-2.944 36.074-15.678 44.753-33.995L458.638 34.69c21.82-46.153 84.826-46.153 106.583 0z" />
</svg>
```

  


```CSS
path {
    fill:url(#linearGradient);
    
    &:hover {
        fill: url(#linearGradient2)
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eac109b9c66247038df37397cdf75c87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=724&s=9063489&e=gif&f=99&b=005281)

  


> Demo 地址：https://codepen.io/airen/full/NWmYxdj

  


你可能会对示例代码中的 `<animate>` 和 `<animateTransform>` 元素感到好奇，它们怎么就让 SVG 渐变动起来了。这里简单地说一下，这两个元素是隶属于 SMIL 规范中的，或者说它们是 SVG 动画元素的一部分。小册后续会有专门的章节介绍它们，如果你迫切想知道它们，建议你移步阅读《[Web 动画之旅](https://s.juejin.cn/ds/iYham8Yf/)》的《[探索 SVG 动画的奇妙世界：深入了解 SMIL 动画](https://juejin.cn/book/7288940354408022074/section/7308623556815159307)》。

  


## SVG 渐变未来：网格渐变 `<meshgradient>`

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad25aedd7a04e2eaf702ee7618d57af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=978495&e=png&b=d86ac9)

  


[SVG 2 引入了一项描述复杂二维颜色过渡的新特性](https://svgwg.org/svg-next/pservers.html#MeshGradients)，即网格渐变（`<meshgradient>`）。在网格渐变中，渐变区域被划分为一组相交的路径，可以是直线或曲线。然后，将渐变的颜色停止点分配给这些路径的交点，并且渐变中每个区块（由四条曲线限定的区域）内的颜色都是根据这些停止点进行插值计算的。

  


```XML
<meshgradient x="50" y="50" id="example"> <!-- x, y used for initial point in first patch. -->
    <meshrow> <!-- No attributes, used only to define begin/end of row. -->
        <meshpatch>
            <stop path="c  25,-25  75, 25  100,0" stop-color="lightblue" />
            <stop path="c  25, 25 -25, 75  0,100" stop-color="purple" />
            <stop path="c -25, 25 -75,-25 -100,0" stop-color="red" />
            <stop path="c -25,-25, 25,-75"        stop-color="purple" /> <!-- Last point not needed (closed path). -->
        </meshpatch>
        <meshpatch>
            <stop path="c  25,-25  75, 25  100,0" /> <!-- stop-color from previous patch. -->
            <stop path="c  25, 25 -25, 75  0,100" stop-color="lightblue" />
            <stop path="c -25, 25 -75,-25"        stop-color="purple" /> <!-- Last point not needed (closed path). -->
            <!-- Last path (left side) taken from right side of previous path (with points reversed). -->
        </meshpatch>
    </meshrow>
    <meshrow> <!-- New row. -->
        <meshpatch>
            <!-- First path (top side) taken from bottom path of patch above. -->
            <stop path="c  25, 25 -25, 75  0,100" /> <!-- stop-color from patch above. -->
            <stop path="c -25, 25 -75,-25 -100,0" stop-color="purple" />
            <stop path="c -25,-25, 25,-75"        stop-color="lightblue" /> <!-- Last point not needed (closed path). -->
        </meshpatch>
        <meshpatch>
            <!-- First path (top side) taken from bottom path of patch above (with points reversed). -->
            <stop path="c  25, 25 -25, 75  0,100" /> <!-- stop-color from patch above. -->
            <stop path="c -25, 25 -75,-25"        stop-color="lightblue" /> <!-- Last point not needed (closed path). -->
            <!-- Last path (left side) taken from right side of previous path (with points reversed). -->
        </meshpatch>
    </meshrow>
</meshgradient>
```

  


[上面示例代码来自于 W3C 规范的](https://svgwg.org/svg-next/pservers.html#MeshGradients)。

  


尽管网格渐变过于复杂，不太可能成为 CSS 渐变函数的候选项，至少到目前为止还没有。然而，[CSS 的锥形渐变](https://juejin.cn/book/7223230325122400288/section/7259668771856941111)（ `conic-gradient()` 和 `repeating-conic-gradient()` 函数）提供了一种在围绕着一个中心点移动时颜色会变化的渐变方式；每种颜色沿着从中心点辐射出的直线扩展到所需的距离。这与径向渐变形成对比，径向渐变中颜色随着远离焦点而改变，并且在每个同心圆中保持不变。在锥形渐变中，停止点不是由固定的距离定义的，而是由固定的角度定义的。CSS 语法将使用 `at` 关键字可选地描述中心点的位置（默认为图像的中心），使用与径向渐变相同的语法。然后，停止列表将跟随，偏移量使用角度单位或作为全圆的百分比描述。零角度将是从中心点向上的垂直线。范围在`0° ~ 360°` 之外的角度将被裁剪掉。与其他 CSS 渐变一样，没有指定偏移量的颜色停止将被均匀分布。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ee2b0c2889842fd92aac7f309aa2d46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2666&h=1516&s=263818&e=jpg&b=f7f7f7)

  


由于 CSS 渐变函数将直接在 SVG 2 中可用，目前没有计划创建专用的 SVG 锥形渐变元素。不过，可以使用网格渐变结构实现相同的效果，或者接近的效果。

  


虽然 CSS 还没有专门的网格渐变或相关的提案，但我们可以通过多个 CSS 的径向渐变 （`radial-gradient()` ）来实现。你也可以使用诸如 [mesher](https://csshero.org/mesher/) 和 [Mesh gradient generator](https://colorffy.com/mesh-gradient-generator) 工具来辅助你使用 CSS 径向渐变实现类似一个网格渐变的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0128e909236e4696b7c6a12a82669099~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=572&s=12316368&e=gif&f=100&b=d9cb70)

  


> URL:https://csshero.org/mesher/

  


```CSS
.meshgradient {
    background-color: #0774c4; 
    background-image: 
        radial-gradient(at 41.5% 28.5%, hsl(101, 77%, 71%) 0px, transparent 50%),
        radial-gradient(at 88.0% 74.4%, hsl(140, 36%, 39%) 0px, transparent 50%),
        radial-gradient(at 81.0% 1.0%, hsl(199, 76%, 65%) 0px, transparent 50%),
        radial-gradient(at 20.7% 65.0%, hsl(288, 87%, 29%) 0px, transparent 50%),
        radial-gradient(at 50.0% 92.0%, hsl(320, 65%, 22%) 0px, transparent 50%);    
}

.meshgradient2 {
    background-color:hsla(0,100%,50%,1);
    background-image:
        radial-gradient(at 40% 20%, hsla(133,100%,74%,1) 0px, transparent 50%),
        radial-gradient(at 80% 0%, hsla(294,100%,56%,1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, hsla(100,100%,93%,1) 0px, transparent 50%),
        radial-gradient(at 80% 50%, hsla(85,100%,76%,1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, hsla(127,100%,77%,1) 0px, transparent 50%),
        radial-gradient(at 80% 100%, hsla(347,100%,70%,1) 0px, transparent 50%),
        radial-gradient(at 0% 0%, hsla(88,100%,76%,1) 0px, transparent 50%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ae5ad9e6b774395b8ac7c5b3108d0a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=643&s=365777&e=jpg&b=e4dcbb)

  


> Demo 地址：https://codepen.io/airen/full/bGJvEvr

  


## 案例：制作渐变图标

  


在 《[实战篇：使用 SVG 创建自己的图标系统](https://juejin.cn/book/7341630791099383835/section/7351368000697532427)》课程结尾时，我们举了一个渐变填充的图标的案例。在这里，我重新将它拿出来与大家探讨一下，如何使用 SVG 的 `<linearGradient>` 和 `<radialGradient>` 创建带有渐变效果的图标。

  


首先，通过 SVG 的 `<symbol>` 以内联的方式，在 HTML 文档中创建了一个 SVG 雪碧图：

  


```XML
<svg class="sr-only">
    <symbol id="business" viewBox="0 0 1024 1024">
        <path d="M853.333333 195.047619a73.142857 73.142857 0 0 1 73.142857 73.142857v487.619048a73.142857 73.142857 0 0 1-73.142857 73.142857H170.666667a73.142857 73.142857 0 0 1-73.142857-73.142857V268.190476a73.142857 73.142857 0 0 1 73.142857-73.142857h682.666666z m-228.010666 192.999619c-9.557333 0.195048-18.919619 1.462857-28.086857 3.803429a73.947429 73.947429 0 0 0-28.086858 14.336 62.659048 62.659048 0 0 0-17.261714 23.113143 75.337143 75.337143 0 0 0-5.851428 29.257142c-0.195048 8.97219 1.170286 17.65181 4.096 26.038858 2.145524 5.851429 5.071238 11.215238 8.777142 16.091428 5.656381 7.021714 12.288 12.970667 19.894858 17.846857 9.557333 5.851429 19.602286 10.630095 30.134857 14.336l5.753904 2.267429c7.558095 3.193905 14.628571 7.241143 21.162667 12.068571 5.656381 4.486095 8.582095 10.24 8.777143 17.261715a19.651048 19.651048 0 0 1-7.021714 14.043428 27.794286 27.794286 0 0 1-17.846857 5.558857 110.201905 110.201905 0 0 1-33.938286-5.266285 131.169524 131.169524 0 0 1-29.549714-13.750858l-15.213715 43.885715a159.573333 159.573333 0 0 0 85.138286 23.405714c11.897905 0 23.503238-2.048 34.816-6.144a76.8 76.8 0 0 0 26.331429-16.384c7.216762-7.41181 12.483048-15.993905 15.798857-25.746286 2.340571-7.996952 3.608381-16.286476 3.803428-24.868571 0-8.777143-1.26781-17.456762-3.803428-26.038857a61.19619 61.19619 0 0 0-12.580572-21.065143c-5.071238-4.87619-10.630095-9.264762-16.676571-13.165714-10.727619-6.241524-21.942857-11.50781-33.645714-15.798858a92.91581 92.91581 0 0 1-25.746286-12.580571 27.794286 27.794286 0 0 1-6.729143-7.606857 17.017905 17.017905 0 0 1-2.048-8.192 15.36 15.36 0 0 1 7.899429-13.165714 36.327619 36.327619 0 0 1 18.724571-4.973715 126.780952 126.780952 0 0 1 48.566857 10.24l11.995429-43.300571a153.819429 153.819429 0 0 0-67.584-15.506286z m-244.882286 5.851429H316.952381l64.365714 232.594285h89.234286l64.658286-232.594285h-63.780572l-45.056 183.442285h-0.585143l-45.348571-183.442285z" />
    </symbol>
    <symbol id="red-packet" viewBox="0 0 1024 1024">
        <path d="M828.952381 265.386667V828.952381a73.142857 73.142857 0 0 1-73.142857 73.142857H268.190476a73.142857 73.142857 0 0 1-73.142857-73.142857V268.53181l316.903619 123.684571L828.952381 265.386667z m-251.367619 171.983238L512 502.979048l-65.584762-65.584762-51.687619 51.736381 56.417524 56.417523h-76.288v73.142858H475.428571V646.095238h-100.571428v73.142857H475.428571v64h73.142858V719.238095h100.571428v-73.142857H548.571429v-27.428571h100.571428v-73.142857h-76.312381l56.466286-56.417524-51.736381-51.736381zM755.809524 121.904762a73.142857 73.142857 0 0 1 73.142857 73.142857v17.749333l-316.879238 126.390858L195.047619 216.112762V195.047619a73.142857 73.142857 0 0 1 73.142857-73.142857h487.619048z" />
    </symbol>
    <symbol id="coupon" viewBox="0 0 1024 1024">
        <path d="M96.768 618.617905c57.222095 0 103.619048-46.713905 103.619048-104.326095 0-57.10019-45.592381-103.472762-102.107429-104.301715V243.809524a73.142857 73.142857 0 0 1 73.142857-73.142857h682.666667a73.142857 73.142857 0 0 1 73.142857 73.142857v166.229333l-3.486476 0.073143c-54.905905 2.633143-98.596571 48.274286-98.596572 104.17981 0 57.10019 45.543619 103.497143 102.058667 104.326095L927.232 780.190476a73.142857 73.142857 0 0 1-73.142857 73.142857h-682.666667a73.142857 73.142857 0 0 1-73.142857-73.142857v-161.596952l-1.511619 0.024381zM366.445714 609.52381v97.523809h77.726476v-97.523809H366.445714z m0-146.285715v97.52381h77.726476v-97.52381H366.445714z m0-146.285714v97.523809h77.726476v-97.523809H366.445714z" />
    </symbol>
    <symbol id="qr-code" viewBox="0 0 1024 1024">
        <path d="M489.057524 121.904762v367.152762H121.904762V121.904762h367.152762z m-73.142857 73.142857H195.047619v220.867048h220.867048V195.047619zM365.714286 243.809524v121.904762h-121.904762v-121.904762h121.904762z m123.343238 291.132952V902.095238H121.904762V534.942476h367.152762z m-73.142857 73.142857H195.047619V828.952381h220.867048v-220.867048zM365.714286 658.285714v121.904762h-121.904762v-121.904762h121.904762zM902.095238 121.904762v367.152762H534.942476V121.904762H902.095238z m-73.142857 73.142857h-220.867048v220.867048H828.952381V195.047619z m-48.761905 48.761905v121.904762h-121.904762v-121.904762h121.904762z m-170.666666 585.142857v73.142857h-73.142858v-73.142857h73.142858z m146.285714 73.142857v-73.142857h73.142857v-97.52381h73.142857v170.666667h-146.285714z m-73.142857-292.571428v146.285714h73.142857v73.142857h-146.285714v-219.428571h73.142857z m146.285714 48.761904v73.142857h-73.142857v-73.142857h73.142857z m73.142857-121.904762v121.904762h-73.142857v-48.761904h-73.142857v-73.142858h146.285714z m-292.571428 0v73.142858h-73.142858v-73.142858h73.142858z" />
    </symbol>
</svg>
```

  


在使用 `<symbol>` 创建 SVG 雪碧图时，有一个小细节需要注意，那就是绘制图形（这里是 Icon 图标）的 SVG 元素（例如 `<path>`）不要显式设置描述样式的“演示属性”，例如 `fill` 、`stroke` 和 `stroke-width` 等。即使要设置，请使用 CSS 自定义属性来替代具体的值。例如 `fill="var(--fill, #000)"` 。

  


在这里，我选择了未设置任何与样式有关的属性。这样做的主要原因是，当你通过 CSS 来对图标进行样式化处理时，CSS 的选择器很难选中 `<use>` 元素的后代元素（Shadow DOM）。`<symbol>` 创建的 SVG 雪碧图，是需要通过 `<use>` 元素引用才会在浏览器中呈现：

  


```HTML
<div class="icons">
    <svg class="icon icon--business">
        <use href="#business" />
    </svg>
    <svg class="icon icon--red-packet">
        <use href="#red-packet" />
    </svg>
    <svg class="icon icon--coupon">
        <use href="#coupon" />
    </svg>
    <svg class="icon icon--qr-code">
        <use href="#qr-code" />
    </svg>
</div>
```

  


默认情况之下，在浏览器上呈现的图标是黑色的。我们可以在 CSS 中通过设置 `fill` 属性的值来改变图标的默认颜色：

  


```CSS
.icons {
    fill: oklch(0.62 0.23 35.3);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ae3bdf2d952498b826fe5f2272965ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=825&s=283499&e=jpg&b=035f8d)

  


接下来，我们需要在 `<defs>` 中定义填充图标的渐变效果，例如：

  


```XML
<svg class="sr-only">
    <defs>
        <linearGradient id="gradient-horizontal">
            <stop offset="0%" stop-color="#447799" />
            <stop offset="50%" stop-color="#224488" />
            <stop offset="100%" stop-color="#112266" />
        </linearGradient>
        <linearGradient id="gradient-vertical" x2="0" y2="100%" href="#gradient-horizontal" />
        <linearGradient id="gradient-angle" x2="100%" y2="100%" href="#gradient-horizontal" />
        <radialGradient id="radialGradient">
            <stop offset="0%" stop-color="#447799" />
            <stop offset="50%" stop-color="#224488" />
            <stop offset="100%" stop-color="#112266" />
        </radialGradient>
    </defs>
</svg>
```

  


使用 `<linearGradient>` 和 `<radialGradient>` 定义了四个渐变效果，前三个是线性渐变，并且 `#gradient-vertical` 和 `#gradient-angle` 是基于 `#gradient-horizontal` 创建的，这三个线性渐变的差异就是渐变方向不相同，渐变颜色和位置是相同的。最后一个是径向渐变。现在，将它们分别应用到四个图标上：

  


```CSS
.icon--business {
    fill: url(#gradient-horizontal) oklch(0.62 0.23 35.3);
}
    
.icon--red-packet {
    fill: url(#gradient-vertical) oklch(0.62 0.23 35.3);
}
    
.icon--coupon {
    fill: url(#gradient-angle) oklch(0.62 0.23 35.3);
}
    
.icon--qr-code {
    fill: url(#radialGradient) oklch(0.62 0.23 35.3);
}
```

  


注意，上面代码还给 `fill` 提供了一个备用值。当应用的渐变失效或者说浏览器不支持时，`fill` 将会应用该备用颜色作为图标的填充颜色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b58eef4cca224e908a1a7c16e1442838~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=618&s=630211&e=gif&f=86&b=3fcd48)

  


> Demo 地址：https://codepen.io/airen/full/dyLmGjo

  


请注意，现在每个图标的渐变颜色都是相同，只是渐变方向有所差异。如果你希望为每个图标添加不同的渐变颜色，那就需要借助 CSS 的自定义属性来创建 SVG 的渐变：

  


```XML
<svg class="sr-only">
    <defs>
        <linearGradient id="gradient-horizontal">
            <stop offset="0%" stop-color="var(--stop-color-1, #447799)" />
            <stop offset="50%" stop-color="var(--stop-color-2,#224488)" />
            <stop offset="100%" stop-color="var(--stop-color-3, #112266)" />
        </linearGradient>
        <linearGradient id="gradient-vertical" x2="0" y2="100%" href="#gradient-horizontal">
            <stop offset="0%" stop-color="var(--stop-color-1, #447799)" />
            <stop offset="50%" stop-color="var(--stop-color-2,#224488)" />
            <stop offset="100%" stop-color="var(--stop-color-3, #112266)" />
        </linearGradient>
        <linearGradient id="gradient-angle" x2="100%" y2="100%" href="#gradient-horizontal">
            <stop offset="0%" stop-color="var(--stop-color-1, #447799)" />
            <stop offset="50%" stop-color="var(--stop-color-2,#224488)" />
            <stop offset="100%" stop-color="var(--stop-color-3, #112266)" />
        </linearGradient>
        <radialGradient id="radialGradient">
            <stop offset="0%" stop-color="var(--stop-color-1, #447799)" />
            <stop offset="50%" stop-color="var(--stop-color-2,#224488)" />
            <stop offset="100%" stop-color="var(--stop-color-3, #112266)" />
        </radialGradient>
    </defs>
</svg>
```

  


现在我们可以在 CSS 中设置这些颜色：

  


```CSS
#gradient-horizontal {
    --stop-color-1: #a770ef;
    --stop-color-2: #cf8bf3;
    --stop-color-3: #fdb99b;
}

#gradient-vertical {
    --stop-color-1: #00c3ff;
    --stop-color-2: #77e190;
    --stop-color-3: #ffff1c;
}
  
#gradient-angle {
    --stop-color-1: #77e190;
    --stop-color-2: #a770ef;
    --stop-color-3: #FF5722;
}

#radialGradient {
    --stop-color-1: #03A9F4;
    --stop-color-2: #ff98007d;
    --stop-color-3: #F44336;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e817f8a03e314f59a8a62e61ff371741~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=825&s=321210&e=jpg&b=00518f)

  


> Demo 地址：https://codepen.io/airen/full/xxeWVKb

  


## 小结

  


SVG 渐变是一种在 SVG 中创建颜色渐变的方法。它提供了线性渐变和径向渐变两种类型，分别用于创建沿直线和圆形的颜色过渡效果。

  


线性渐变（`<linearGradient>`）通过两个端点定义了一个渐变的方向和长度，可以沿任意角度进行放置，从而创建水平、垂直或对角线方向的渐变效果。通过在渐变中指定多个颜色停止点，可以实现更复杂的渐变效果，例如在一个图像中同时呈现多种颜色。

  


而径向渐变（`<radialGradient>`）则是从一个中心点向外放射颜色的渐变。可以通过调整中心点的位置和渐变的半径来控制渐变的形状和范围，从而实现不同的视觉效果，比如创建光亮的光线或球体的立体效果。

  


为了使用 SVG 渐变，首先需要在 SVG 文档中定义渐变元素，并指定渐变的各种属性，如颜色、位置和方向。然后，可以在 SVG 图像中使用渐变来填充形状或路径。

  


总的来说，SVG 渐变是一种强大的工具，可以为图像和网页添加丰富多彩的色彩效果，提升用户体验和视觉吸引力。通过灵活运用线性渐变和径向渐变，可以创造出各种各样的视觉效果，从简单的颜色过渡到复杂的立体效果，为设计师和开发者提供了丰富的创作空间。