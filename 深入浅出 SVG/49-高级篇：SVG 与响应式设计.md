![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2479c1e357634e9b8a1d4d350ce896cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1792&h=1024&s=43430&e=webp&b=ecf0da)

  


在现代 Web 设计中，[响应式 Web 设计已经成为一个标准](https://juejin.cn/book/7161370789680250917/section/7165845190614188062)，确保你的 Web 网站或应用能够在各种设备和屏幕尺寸上都能完美呈现。SVG 作为一种基于矢量的图像格式，可以在各种分辨率下无限缩放，并且保持清晰无损，使其成为实现响应式设计的理想选择！

  


从概念上讲，让 SVG 随其容器缩放应该是非常简单的，甚至很多 Web 开发者都认为，SVG 能自动随容器缩放。在大多数情况之下，的确是这样，但又不完全是这样。由于不同浏览器的实现和不一致性，使 SVG 随容器大小进行缩放并不是那么简单，因为浏览器在以不同方式嵌入 SVG 时确定其尺寸的方式并不一致。

  


话虽如此，我们可以使用某些技巧使 SVG 在所有浏览器获得预期的行为。在这节课中，我们将探讨这些技术，介绍何时使用哪种技术，以使 SVG 能更好的随容器尺寸进行缩放，并保持良好的比例，为响应式 Web 设计注入完美的视觉元素。

  


## SVG 不仅仅是一种图像

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e053fb4f993441cea5d1f53e29827412~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1380&h=725&s=44793&e=png&b=33706c)

  


如果你曾经有过开发响应式 Web 设计的经验，你应该感触得到，在构建响应式 Web 时，最为头痛的是[图像的响应式适配](https://juejin.cn/book/7199571709102391328/section/7199845663143067660)。SVG 的出现，为我们提供了一种有效解决这一难题的方法。而且，SVG 一直在不断的强调，SVG 作为一种基于矢量的图像格式，它具有许多独特的优势，例如无限缩放，使其在响太式设计中尤为出色。

  


正因如此，大部分 Web 开发者会认为，在响应式 Web 设计中，SVG 是无敌的，它自身就能随容器尺寸进行缩放。然而，事实并非如此。例如，当我们直接将一个 SVG 嵌套在一个容器中时，SVG 并没有如你所期望的一样，自动缩放填充整个容器：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aba76167ea584e57a58d4fbb10dda9ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1640&h=682&s=6028294&e=gif&f=162&b=1a8787)

  


> Demo 地址：https://codepen.io/airen/full/mdYYqRZ

  


你可能会问？SVG 不是号称能无限缩放吗？为什么 SVG 没有填满整个 `div` 容器呢？这是因为 SVG 不仅仅是一种图像。

  


[我想你对 Web 上的图像应该如何缩放有一定的认知](https://juejin.cn/book/7199571709102391328/section/7199845663143067660)，但 SVG 的行为方式与之不同。对于传统的位图（例如 JPG、PNG 和GIF 等），它们有明确定义的尺寸。图像文件描述了浏览器应该如何填充一个特定宽度和特定高度的像素网格（注意，传统的位图就是一个像素网格）。一个重要的副作是，传统的位图有明确的宽高比。例如，下面这张图片：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b26a0e0c68db4e1f8206097e39201249~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=768&s=116442&e=jpg&b=dfdddc)

  


上图是一张 `1024px x 768px` 的图像：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fb7ab892e44452ea811e45a9cffbba4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2838&h=1566&s=665606&e=jpg&b=f7f5f5)

  


该图像的自然宽度（即原始宽度，`naturalWidth`）是 `1024px` ，自然高度（即原始高度 `naturalHeight`）是 `768px` ，这两者的比就是该图像的自然宽高比（即原始宽高比）：`1024:768` ，这个宽高比是一个固定的不变的值，无论图像如何缩放，其宽高比都应该保持一致。

  


也就是说，你可以强制浏览器以与其自然宽度和自然高度不同的尺寸渲染图像，但如果你强制改变其宽高比，图像就会被扭曲。因此，自 Web 早期以来，对图像自动缩放就有了支持：你设置宽度或高度，浏览器会自动调整另一个维度，确保图像的宽高比保持不变：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/176f6d12a9224b4389f70e085f23445a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1340&s=919659&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/MWddOVO

  


SVG 图像则可以以任意像素大小绘制，因此它们不需要明确定义的宽度或高度。也就是说，SVG 图像并不像传统位图，它是没有自然宽度、自然高度和自然宽高比一说：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41e5fb5208384be08227f2d8bb70d09e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2814&h=1252&s=183163&e=jpg&b=fefdfd)

  


这也意味着，SVG 也不总是具有明确定义的宽高比。如果你希望 SVG 按照给定的尺寸缩放到合适的尺寸，你需要明确提供这些信息，甚至是更多的信息。如果不这样做，SVG 将不会进行缩放。例如下面这个示例，SVG 内联到 HTML 中，并且调整 `<svg>` 元素的尺寸（虚线），而不改变 SVG 图形的尺寸：

  


```XML
<svg class="sr-only">
    <defs>
        <linearGradient id="coin" x2="50%" y2="40%" spreadMethod="reflect">
            <stop stop-color="gold" offset="30%" />
            <stop stop-color="goldenrod" offset="70%" />
            <stop stop-color="white" offset="82%" />
            <stop stop-color="gold" offset="92%" />
            <stop stop-color="darkgoldenrod" offset="100%" />
        </linearGradient>
        <radialGradient id="pot" fx="30%" fy="35%">
            <stop stop-color="white" offset="0%" />
            <stop stop-color="gold" offset="15%" />
            <stop stop-color="goldenrod" offset="80%" />
            <stop stop-color="darkgoldenrod" offset="100%" />
        </radialGradient>
        <symbol id="potofgold">
            <g fill="url(#coin)" stroke="darkgoldenrod" stroke-width="0.5">
                <circle r="5" transform="translate(30,7)" />
                <circle r="5" transform="translate(35,13)" />
                <circle r="5" transform="translate(22,10)" />
                <circle r="5" transform="translate(27,9)" />
                <circle r="5" transform="translate(18,17)" />
                <circle r="5" transform="translate(42,18)" />
                <circle r="5" transform="translate(32,19)" />
                <circle r="5" transform="translate(30,14)" />
                <circle r="5" transform="translate(25,15)" />
                <circle r="5" transform="translate(37,19)" />
                <circle r="5" transform="translate(31,16)" />
                <circle r="5" transform="translate(20,18)" />
                <circle r="5" transform="translate(26,21)" />
            </g>
          <path fill="url(#pot)" stroke="#751" stroke-width="0.5" d="M30,50 C45,50 55,45 55,35  Q 55,27 50,25 C55,22 53,15 45,20 S 23,25 15,20 S5,22 10,25 Q 5,27 5,35 C5,45 15,50 30,50Z" />
        </symbol>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35d167a510874a2096c94a4bbc6f51cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1340&s=503714&e=jpg&b=06adf4)

  


> Demo 地址：https://codepen.io/airen/full/KKLLyrv

  


为什么 SVG 会表现出这种方式呢？因为 SVG 不仅仅是一种图像。SVG 是一个文档。尽管上面示例使用了内联 SVG，但同样可以使用 `<iframe>` 或 `<object>` 以及 `<img>` 。即使你使用 `<img>` 将 SVG 引入 Web，它在浏览器中呈现的效果也是完全相同。

  


你可以想象一下，当你在 HTML 中嵌入一个 `<iframe>` 时，你不希望调整 `<iframe>` 尺寸时，其里面的文本也随之缩放。SVG 亦是如此。默认情况下，SVG 将按照代码中指定的大小绘制，而不考虑 SVG 画布的大小。如果你将 SVG 的宽度或高度（或两者都）设置为 `auto` 会发生什么？HTML 元素元素的默认大小将会被使用：宽度为 `300px` ，高度为 `150px` 。例如，下面这个简单的 SVG：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="100" height="100" fill="red" />
</svg>
```

  


注意，上面代码中的 `<svg>` 没有显式设置 `width` 和 `height` ，它们的值默认为 `auto` 。此时，你将上面的 SVG 代码保存为独立的一个 `.svg` 文件，例如 `rect.svg` 。然后，你在一个 HTML 文档中通过 `iframe` 、`object` 或 `img` 来引用：

  


```HTML
<img src="rect.svg" alt="rect" />
```

  


当 `img` 没有显式设置与尺寸相关的任何属性或样式时，默认情况之下，浏览器渲染出来的尺寸是 `300px x 150px` （即可替换元素 `img` 的默认尺寸）。这是 HTML5 规范的一个相对较新的共识。

  


换句话说，即使你认为 `300px x 150px` 是一个完美的图像尺寸，也不要依赖 HTML 中的 `<svg>` 的默认大小。除了决定你想要的 SVG 尺寸之外，你还需要决定如何使你的 SVG 图形按照所需的尺寸进行缩放。例如：

  


-   缩放 SVG 以适应特定的大小，而且不扭曲图形
-   缩放 SVG 以适应特定的大小，并且根据需要拉伸或压缩图形
-   缩放 SVG 以适应可用宽度或高度，同时图形保持宽高比
-   以不均匀方式对 SVG 进行缩放，使图形的某些部分与其他部分缩放不同步

  


也就是说，如果你想控制 SVG 的缩放比例，你需要熟悉 SVG 缩放属性以及相关特性。

  


## 与 SVG 缩放相关的属性和特性

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a58de9fc838e4fcbb3c7da12ddc52e2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1500&h=1100&s=25463&e=png&b=40c6ff)

  


传统位图之所以能够缩放，是因为浏览器知道图像的宽度、高度和宽高比，并可以一起调整。为 SVG 设置这些属性是使其可以缩放的第一步。然而，缩放 SVG 远远超出了其他图像的可能性。这意味着，为了构建具有响应式的 SVG 图形，我们需要了解 SVG 的几个基本属性和概念，例如 `<svg>` 元素的 `width` 、`height` 、`viewBox` 和 `preserveAspectRatio` 等属性 。

  


### `<svg>` 元素的 `width` 和 `height`

  


从 [SVG 的规范中](https://www.w3.org/TR/SVG2/struct.html#SVGElement)，我们可以知道，在最外层的 `<svg>` 元素上设置 `width` 和 `height` 属性时，相当于指定了 SVG 文档片段的内在大小。它们（`width` 和 `height`）会隐式给 `<svg>` 元素设置一个宽高比，从而使 SVG 像其他图像一样进行缩放。但也不像大家想象的那么简单。

  


假设，我们有两个 `<svg>` 元素，它们绘制了相同的一个图形。它们唯一的区别是，其中一个 `<svg>` 元素显式设置了 `width` 和 `height` ，另一个则没有。我将设置 `width` 和 `height` 的 `<svg>` 保存为 `coin.svg` ：

  


```XML
<!-- coin.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="55">
    <linearGradient id="coin" x2="50%" y2="40%" spreadMethod="reflect">
        <stop stop-color="gold" offset="30%"/>
        <stop stop-color="goldenrod" offset="70%"/>
        <stop stop-color="white" offset="82%"/>
        <stop stop-color="gold" offset="92%"/>
        <stop stop-color="darkgoldenrod" offset="100%"/>
    </linearGradient>
    <radialGradient id="pot" fx="30%" fy="35%">
        <stop stop-color="white" offset="0%"/>
        <stop stop-color="gold" offset="15%"/>
        <stop stop-color="goldenrod" offset="80%"/>
        <stop stop-color="darkgoldenrod" offset="100%"/>
     </radialGradient>
     <g fill="url(#coin)" stroke="darkgoldenrod" stroke-width="0.5">
         <circle r="5" transform="translate(30,7)"/>
         <circle r="5" transform="translate(35,13)"/>
         <circle r="5" transform="translate(22,10)"/>
         <circle r="5" transform="translate(27,9)"/>
         <circle r="5" transform="translate(18,17)"/>
         <circle r="5" transform="translate(42,18)"/>
         <circle r="5" transform="translate(32,19)"/>
         <circle r="5" transform="translate(30,14)"/>
         <circle r="5" transform="translate(25,15)"/>
         <circle r="5" transform="translate(37,19)"/>
         <circle r="5" transform="translate(31,16)"/>
         <circle r="5" transform="translate(20,18)"/>
         <circle r="5" transform="translate(26,21)"/>
    </g>
    <path fill="url(#pot)" stroke="#751" stroke-width="0.5" d="M30,50 C45,50 55,45 55,35  Q 55,27 50,25 C55,22 53,15 45,20 S 23,25 15,20 S5,22 10,25 Q 5,27 5,35 C5,45 15,50 30,50Z"/>
</svg>
```

  


另一个未设置 `width` 和 `height` 的 `<svg>` 保存为 `coin1.svg` ：

  


```XML
<!-- coin1.svg -->
<svg xmlns="http://www.w3.org/2000/svg">
    <linearGradient id="coin" x2="50%" y2="40%" spreadMethod="reflect">
        <stop stop-color="gold" offset="30%"/>
        <stop stop-color="goldenrod" offset="70%"/>
        <stop stop-color="white" offset="82%"/>
        <stop stop-color="gold" offset="92%"/>
        <stop stop-color="darkgoldenrod" offset="100%"/>
    </linearGradient>
    <radialGradient id="pot" fx="30%" fy="35%">
        <stop stop-color="white" offset="0%"/>
        <stop stop-color="gold" offset="15%"/>
        <stop stop-color="goldenrod" offset="80%"/>
        <stop stop-color="darkgoldenrod" offset="100%"/>
     </radialGradient>
     <g fill="url(#coin)" stroke="darkgoldenrod" stroke-width="0.5">
         <circle r="5" transform="translate(30,7)"/>
         <circle r="5" transform="translate(35,13)"/>
         <circle r="5" transform="translate(22,10)"/>
         <circle r="5" transform="translate(27,9)"/>
         <circle r="5" transform="translate(18,17)"/>
         <circle r="5" transform="translate(42,18)"/>
         <circle r="5" transform="translate(32,19)"/>
         <circle r="5" transform="translate(30,14)"/>
         <circle r="5" transform="translate(25,15)"/>
         <circle r="5" transform="translate(37,19)"/>
         <circle r="5" transform="translate(31,16)"/>
         <circle r="5" transform="translate(20,18)"/>
         <circle r="5" transform="translate(26,21)"/>
    </g>
    <path fill="url(#pot)" stroke="#751" stroke-width="0.5" d="M30,50 C45,50 55,45 55,35  Q 55,27 50,25 C55,22 53,15 45,20 S 23,25 15,20 S5,22 10,25 Q 5,27 5,35 C5,45 15,50 30,50Z"/>
</svg>
```

  


分别以 `<img>` 、`<iframe>` 和内联 SVG 的方式将它们引用到 Web 上（[这是使用 SVG 的几种常见方式](https://juejin.cn/book/7341630791099383835/section/7344089098363076620)），并且未对它们设置任何样式。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28f52e48186b4631a574fa358d5a496c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1002&s=313201&e=jpg&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/QWRRQRb

  


不难发现，未设置 `width` 和 `height` 的 `<svg>` ，不管以哪种方式引用到 Web上，它的尺寸都是 `300px x 150px` ，并且不会影响其内部图形的尺寸。对于设置了 `width` 和 `height` 的 `<svg>` 则不同，它会根据引用方式不同，呈现的结果也会不同。如上图所示，当 SVG 被 `<img>` 元素引用或内联到 HTML 中时，`<svg>` 元素的 `width` 和 `height` 将覆盖默认的尺寸，但 `<iframe>` 则会保持默认的尺寸，即 `300px x 150px` ，这是因为 `<iframe>` 的默认尺寸为 `300px x 150px` 。

  


我们再来看另一种情形，那就是在 CSS 中显式设置 `img` 、`iframe` 和 `svg` 元素的 `width` 和 `height` ：

  


```CSS
:is(img, iframe, svg) {
    display: block;
    width: 100%;
    height: auto;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faf5ec78be2a4a52b105c0c43e2cd530~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1168&s=432412&e=jpg&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/zYQQRaN

  


即便是如此，在引用未设置 `width` 的 `height` 的 `<svg>` 时，浏览器会调整 `img` 、`iframe` 和 `svg` 的宽度，自动匹配容器的宽度（因为设置了 `width` 为 `100%`），但是它们的高度比例不会变，始终是 `150px` ，也不会调整实际的绘图以匹配 `img` (或 `iframe` 或 `svg`)尺寸的缩放。

  


在引用显式设置 `width` 和 `height` 的 `<svg>` 时，情况会变得更为复杂一些：

  


-   对于 `iframe` 元素，浏览器虽会调整其 `width` ，但高度比例不变，也是默认的 `150px` ，即便是 `<svg>` 的 `height` 设置的比较大，也不会改变其高度，只会使 `iframe` 内部出现滚动条
-   对于 `img` 元素，浏览器则会根据 `<svg>` 元素设置的 `width` 和 `height` 比例来调整其高度，并且 SVG 内部的图形尺寸也会按相应比例进行缩放
-   对于内联 SVG ，那么 `<svg>` 元素会承担双重职责，在 Web 页面内定义图像区域以及 SVG 内部，而且 CSS 中设置的 `width` 和 `height` 将会覆盖 `<svg>` 元素上的 `width` 和 `height` 属性。因此，像 `svg {width: 100%;height: auto;}` 这样的规则会覆盖 `<svg>` 元素的 `width` 和 `height` 属性，`height` 会根据其宽高比进行调整，但其内部的图形尺寸不会按该比例进行调整

  


然而，实际上我们并不想为 `<svg>` 元素设置确切的 `width` 和 `height` ，而是希望 SVG 按照 CSS 中设置 `width` 和（或）`height` 进行缩放。这意味着，我们可以删除 `<svg>` 元素上的 `width` 和 `height` ，但需要像给位图一样，设置一个宽高比，并使绘图适应缩放。

  


换句话说，`<svg>` 元素可以不需要 `width` 和（或 `height`）属性，但它需要一个 `viewBox` 属性。因为 `viewBox` 属性可以允许你给 `<svg>` 设置一个宽高比。

  


### `<svg>` 元素的 `viewBox` 属性

  


`viewBox` 是 `<svg>` 元素的一个重要属性，它实现了许多功能：

  


-   它定义了 `<svg>` 元素的宽高比
-   它定义了 SVG 内部图形的长度和坐标如何进行缩放，以适应可用的显示空间，使得 SVG 内容在任何尺寸的容器中都能正确显示
-   它定义了 SVG 坐标系统的原点

  


一旦你向 `<svg>` 添加了 `viewBox` ，你可以将该 SVG 文件用作 `img` 、`iframe` 或内联 SVG ，并且它将完美地缩放以适应你给定的任何大小。例如，我们在上面的 SVG 代码中添加 `viewBox` ，并移除 `width` 和 `height` （我们将在 CSS 中设置 `<svg>` 元素的 `width` 和 `height`），并将该 SVG 保存为 `coin2.svg` ：

  


```XML
<!-- coin2.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 55">
    <linearGradient id="coin" x2="50%" y2="40%" spreadMethod="reflect">
        <stop stop-color="gold" offset="30%"/>
        <stop stop-color="goldenrod" offset="70%"/>
        <stop stop-color="white" offset="82%"/>
        <stop stop-color="gold" offset="92%"/>
        <stop stop-color="darkgoldenrod" offset="100%"/>
    </linearGradient>
    <radialGradient id="pot" fx="30%" fy="35%">
        <stop stop-color="white" offset="0%"/>
        <stop stop-color="gold" offset="15%"/>
        <stop stop-color="goldenrod" offset="80%"/>
        <stop stop-color="darkgoldenrod" offset="100%"/>
     </radialGradient>
     <g fill="url(#coin)" stroke="darkgoldenrod" stroke-width="0.5">
         <circle r="5" transform="translate(30,7)"/>
         <circle r="5" transform="translate(35,13)"/>
         <circle r="5" transform="translate(22,10)"/>
         <circle r="5" transform="translate(27,9)"/>
         <circle r="5" transform="translate(18,17)"/>
         <circle r="5" transform="translate(42,18)"/>
         <circle r="5" transform="translate(32,19)"/>
         <circle r="5" transform="translate(30,14)"/>
         <circle r="5" transform="translate(25,15)"/>
         <circle r="5" transform="translate(37,19)"/>
         <circle r="5" transform="translate(31,16)"/>
         <circle r="5" transform="translate(20,18)"/>
         <circle r="5" transform="translate(26,21)"/>
    </g>
    <path fill="url(#pot)" stroke="#751" stroke-width="0.5" d="M30,50 C45,50 55,45 55,35  Q 55,27 50,25 C55,22 53,15 45,20 S 23,25 15,20 S5,22 10,25 Q 5,27 5,35 C5,45 15,50 30,50Z"/>
</svg>
```

  


你可以将 `<svg>` 中的 `viewBox` 想象成设计工具中的画板。例如，当你看到 `viewBox="0 0 60 55"` 时，就相当于你创建了一个宽度为 `60` 个用户单位，高度为 `55` 个用户单位的画板。它相当于给 `<svg>` 设置了一个 `60:55` 的宽高比，并且内部图形的坐标和长度都将按这个比例来进行缩放，以适配 `svg` 元素的大小：

  


```CSS
:is(img, iframe, svg) {
    display: block;
    width: 100%;
    height: auto;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d7cfd0e428d4e15aac658c758af8d26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1168&s=560077&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/xxNNWWa

  


你会发现，SVG 和内部的图形会根据 `viewBox` 属性指定的宽高比来调整图 `<svg>` 的尺寸以及内部图形。看上去就与传统的位图缩放相似。然而，有一个关键的区别：默认情况下，SVG 的行为就像应用了 `object-fit: contain` 。这意味着，如果宽度和高度设定的宽高比与 `viewBox` 定义的不同，你的“画板”将始终保持完全可见并保持其比例而不失真。比如，上面示例中的 `iframe` ，它的尺寸是 `268px x 150px` ，包含一个 `viewBox` 值为 `0 0 60 55` 的区域，其中 `viewBox` 居中于外部的 `iframe` 中。

  


### `<svg>` 元素的 `preserveAspectRatio` 属性

  


`preserveAspectRatio` 是 `<svg>` 元素的另一个属性，它与 `viewBox` 属性同等重要！该属性有一个前提条件，那就是 `<svg>` 元素要显式设置了 `viewBox` 属性，它才生效。当 `<svg>` 元素的 `viewBox` 属性存在时，且 `viewBox` 的宽高比与视口（Viewport）的宽高比不匹配时，`preserveAspectRatio` 属性将描述 SVG 图像应该如何缩放。

  


`preserveAspectRatio` 属性包含了两个部分，第一部分的值将告诉浏览器缩放后的 `viewBox` 区域在视口（Viewport）中的位置，有点类似于 CSS 的 `object-position` ；第二部分的值有点类似于 CSS 的 `background-size` 。例如，它的默认值 `preserveAspectRatio="xMidYMid meet"` ，其中 `xMidYMid` 将告诉浏览器在 `x` 和 `y` 方向上将缩放后的 `viewBox` 区域在视口（Viewport）中居中对齐；第二部分 `meet` 将告诉浏览器将图形缩放至恰好适应用视口（Viewport）的宽度和高度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef9c9f9c19c842efb24de924e9efe422~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1168&s=413786&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/MWddGQZ

  


在这个示例中，我们将 SVG 的视口（Viewport）和 `viewBox` 的宽高比设置为不相等：

  


```CSS
:is(img, iframe, svg) {
    width: 300px;
    height: 200px;
 }
```

  


SVG 视口的宽高比是 `3:2` ，而 `viewBox` 的宽高比是 `6:5.5` 。

  


示例中的 `img` 和 `iframe` 引用的 `svg` ，它们的 `preserveAspectRatio` 取的是默认值，即 `"xMidYMid meet"` ，而内联的 SVG 的 `preserveAspectRatio` 设置为 `"xMaxYMid meet"` 。因此，你看到的效果是，`img` 和 `iframe` 引入的 SVG ，在容器中水平居中显示，而内联 SVG 在容器中水平居右且垂直居中显示。

  


注意，你也可以在 `img` 和 `iframe` 元素上显式设置 `object-fit` 和 `object-position` 来调整其效果。另外，你可以将 `preserveAspectRatio` 设置为 `none` ，将允许你的 SVG 像传统位图一样缩放（但分辨率要好得多），拉伸或挤压以适应你给定的高度和宽度。

  


需要知道的是，`viewBox` 和 `preserveAspectRatio` 主要用于 `<svg>` 元素，但也可以应用于嵌套的 `<svg>` 元素和一些特定的 SVG 元素，如 `<symbol>`、`<marker>`、`<pattern>` 和 `<view>`，以便更好地控制图形内容在不同视口中的缩放和对齐方式。有关于这两个属性更详细的介绍，可以移步阅读小册的《[SVG 坐标系统](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)》一节！

  


## 响应式 SVG 的应用

  


接下来，我们从不同的角度来看看 SVG 如何缩放才能更好的适配于响应式 Web。

  


### SVG 按比例缩放以适配特定尺寸

  


响应式 SVG 最常用的一个情景就是将 SVG 按比例缩放以适配特定尺寸，并且图像保持不变形。根据之前的介绍，在这个情景中，`viewBox` 属性基本上能满足我们的需要。

  


继续以前面的金币图标为例，我们在 `<svg>` 元素上显式设置了 `viewBox` 属性的值为 `0 0 60 55` ：

  


```HTML
<div class="coin">
    <svg viewBox="0 0 60 55">
        <defs>
            <linearGradient id="coin" x2="50%" y2="40%" spreadMethod="reflect">
                <stop stop-color="gold" offset="30%" />
                <stop stop-color="goldenrod" offset="70%" />
                <stop stop-color="white" offset="82%" />
                <stop stop-color="gold" offset="92%" />
                <stop stop-color="darkgoldenrod" offset="100%" />
            </linearGradient>
            <radialGradient id="pot" fx="30%" fy="35%">
                <stop stop-color="white" offset="0%" />
                <stop stop-color="gold" offset="15%" />
                <stop stop-color="goldenrod" offset="80%" />
                <stop stop-color="darkgoldenrod" offset="100%" />
            </radialGradient>
        </defs>
    
        <g fill="url(#coin)" stroke="darkgoldenrod" stroke-width="0.5">
            <circle r="5" transform="translate(30,7)" />
            <circle r="5" transform="translate(35,13)" />
            <circle r="5" transform="translate(22,10)" />
            <circle r="5" transform="translate(27,9)" />
            <circle r="5" transform="translate(18,17)" />
            <circle r="5" transform="translate(42,18)" />
            <circle r="5" transform="translate(32,19)" />
            <circle r="5" transform="translate(30,14)" />
            <circle r="5" transform="translate(25,15)" />
            <circle r="5" transform="translate(37,19)" />
            <circle r="5" transform="translate(31,16)" />
            <circle r="5" transform="translate(20,18)" />
            <circle r="5" transform="translate(26,21)" />
        </g>
        <path fill="url(#pot)" stroke="#751" stroke-width="0.5" d="M30,50 C45,50 55,45 55,35  Q 55,27 50,25 C55,22 53,15 45,20 S 23,25 15,20 S5,22 10,25 Q 5,27 5,35 C5,45 15,50 30,50Z" />
    </svg>
</div>
```

  


```CSS
.coin {
    width: 50vmin;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    resize: both;
    
    svg {
        display: block;
        width: 100%;
        height: 100%;
    }
}
```

  


在这个示例中，`<svg>` 的宽高等于其父容器 `.coin` 的宽高。你可以尝试着调整 `.coin` 容器的尺寸，将能看到 SVG 图形会按比例（`viewBox` 指定的比例，在这个示例中是 `6:5.5`）进行缩放，当它的宽高比与 `<svg>` 元素的宽高比（在这个示例也就是 `.coin` 元素的宽高比）不相等时，SVG 图形始图会位于容器正中间（相当于位于 SVG 视口的正中间）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbaa4520ae5d4a989f2263f9bde97463~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=742&s=5726525&e=gif&f=184&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/NWVVzPO

  


注意，当 `viewBox` 的宽高比与 SVG 视口宽高比不相等时，SVG 图形在容器中两边（左右或上下会留白），这与传统位图宽高比与容器宽高比不相等时表现一致。如果你是内联 SVG，可以通过 `svg` 元素的 `preserveAspectRatio` 属性来调整对齐和裁剪方式；如果你是通过 `img` 或 `iframe` 来引用 SVG，可以通过 `object-fit` 和 `object-position` 来调整对齐和裁剪方式；如果你将 SVG 作为 `background-image` 或 `mask-image` ，可以通过 `background-size` （或 `mask-size`）和 `background-position` （或 `mask-position`）来调整位置和裁剪方式。如果要与 `<svg>` 的 `preserveAspectRatio` 表现相似，那么 `object-fit` 、`background-size` 和 `mask-size` 只能取值为 `cover` 或 `contain` 。

  


### SVG 按比例缩放以适配可用的宽度，并自动调整高度

  


具有 `viewBox` 的 SVG 可以按比例缩放以适配你给定的宽度，并且自动调整高度。这个有点类似于我们平时给位图设置适配的方式，例如：

  


```CSS
img {
    display: block;
    width: 100%; /* 与容器宽度保持一致 */
    height: auto;
}
```

  


但对于 SVG 而言，情况会变得更为复杂一些，[你需要根据引用 SVG 方式做出一些调整](https://juejin.cn/book/7341630791099383835/section/7344089098363076620)。

  


#### img 引入 SVG

  


当 SVG 文件具有 `viewBox` ，并嵌入到 `<img>` 中时，浏览器（几乎总是）会按照 `viewBox` 中定义的宽高比对 SVG 图形进行缩放。

  


```HTML
<div class="coin">
    <img src="https://static.fedev.cn/damo/coin2.svg" alt="coin" />
</div>
```

  


```CSS
.coin {
    width: 50vmin;
    overflow: hidden;
    resize: horizontal;

    img {
        display: block;
        width: 100%;
        height: auto;
    }
}
```

  


在这个示例中，`img` 的宽度始终与 `.coin` 容器的宽度保持一致，并且 `img` 的高度会自动根据 `viewBox` 设定的宽高比 `6:5.5` 进行调整。这意味着，`img` 的宽高比始终会与 `viewBox` 设定的宽高比保持一致：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ba4bfd88b644fecb183f6bf6ca029d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1432&h=822&s=5068893&e=gif&f=118&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/dyEEjxx

  


#### 使用 CSS 背景图像引入 SVG

  


大多数情况下，将 SVG 用作 CSS 背景图像（`background-image`）与在 `<img>` 中使用它的方式大致相同。然而，对于 CSS 背景图像来说，自动调整大小不是一个选项。如果你希望元素完全匹配你将使用的图像的宽高比，你需要稍微进行一些调整。

  


其中的关键点是，你可以按比例调整元素的总高度以适应宽度。换句话说，你可以根据 `viewBox` 提供的宽高比来调整元素的总高度以适应宽度。在 CSS 中，有两种常见的方式来实现这个：

  


-   将容器的 `padding-top` 或 `padding-bottom` 设置为元素高宽比值，并将 `height` 设置为 `0` 。这是一种常见的 Hack 手段
-   使用 CSS 的 `aspect-ratio` 来调整元素的高度以适应容器的宽度

  


我们以 `aspect-ratio` 为例。在这里，我们继续以 `coin2.svg` 为例，`<svg>` 元素的 `viewBox` 值为 `0 0 60 55` ，这意味着 SVG 图形的宽高比是 `60:55` ，我们把这个值定义为一个 CSS 自定义属性，即 `--ratio: 60 / 55` ，与此同时，在需要应用 SVG 背景图的元素上显式设置 `width` 和 `asepct-ratio` ：

  


```CSS
.coin {
    --ratio: 60 / 55;
    width: 50vmin;
    aspect-ratio: var(--ratio);
    background-image: url("https://static.fedev.cn/damo/coin2.svg");
}
```

  


你可以尝试调整 `.coin` 容器的 `width` ，它的高度（`height`）将会根据 `aspect-ratio` 指定的宽高比（即 `viewBox` 设置的宽高比）自动调整，即 `height = width ÷ aspect-ratio` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4e17cded24143e38d64c9feca06fab7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250&h=746&s=3764053&e=gif&f=140&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/yLWdMVK

  


需要注意的是：

  


-   CSS `aspect-ratio` 属性的值是 `<svg>` 元素的 `viewBox` 属性的 `width:height`
-   SVG 文件最外部的 `<svg>` 元素的 `width` 和 `height` 要移除

  


#### iframe 引入 SVG

  


使用 `<iframe>` 或 `<object>` 是将 SVG 引入 Web 的另一种方式。如果你希望 `iframe` 引入的 SVG 图像能适配 `iframe` 宽度，并且高度根据 `viewBox` 的宽高比自动调整，那么你需要在 HTML 的结构和布局上稍微做一些调整。主要是因为，`iframe` 设置 `width: 100%;height: auto` 时，它的高度总是以默认高度 `150px` 呈现。因此，在 HTML 中，我们需要将 `<iframe>` 放置在一个容器元素中，例如 `<div>` ，并显示设置 `iframe` 的 `width` 和 `height` 的值都为 `100%` ，与此同时，需要将 `div` 的 `aspect-ratio` 值设置为 `viewBox` 的 `width:height` 。具体代码如下：

  


```HTML
<div class="coin">
    <iframe src="https://static.fedev.cn/damo/coin2.svg" frameborder="0"></iframe>
</div>
```

  


```CSS
.coin {
    width: 50vmin;
    --ratio: 60 / 55;
    aspect-ratio: var(--ratio);
    position: relative;
    
    iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: none 0;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe1fef0f989843a88cb4c4f645a9c004~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1268&h=742&s=6541905&e=gif&f=169&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/Rwmzppr

  


请记得将 `iframe` 的 `border` 设置为 `none` ，取消其默认边框。另外，你还可以将 `iframe` 设置为绝对定位，使 `iframe` 占据整个 `div` 的可用空间，并给它添加 `object-fit` 和 `object-position` 样式：

  


```CSS
.coin {
    width: 50vmin;
    overflow: hidden;
    resize: both;
    --ratio: 60 / 55;
    aspect-ratio: var(--ratio);
    position: relative;
    
    iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: none 0;
        object-fit: contain;
        object-position: center;
    }
 }
```

  


此时，即便 `iframe` 的容器（`.coin`）的尺寸没有根据 `viewBox` 进行调整，`iframe` 引入的 SVG 图形也能按 `viewBox` 指定的比例进行调整，并用适配 `iframe` 的尺寸。并且在宽高比不相等的情况之下（`firame` 的宽高比与 `viewBox` 的宽高比不相等）也不会使 SVG 图形扭曲变形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d70f854a9e594cb99fd563176c211e4d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1272&h=784&s=7771960&e=gif&f=244&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/NWVZpjv

  


#### 内联 SVG

  


直接将 SVG 代码嵌入 HTML 中，也是 SVG 常用的方式之一。

  


```HTML
<div class="coin">
    <svg viewBox="0 0 60 55">
        <defs>
            <linearGradient id="coin" x2="50%" y2="40%" spreadMethod="reflect">
                <stop stop-color="gold" offset="30%" />
                <stop stop-color="goldenrod" offset="70%" />
                <stop stop-color="white" offset="82%" />
                <stop stop-color="gold" offset="92%" />
                <stop stop-color="darkgoldenrod" offset="100%" />
            </linearGradient>
            <radialGradient id="pot" fx="30%" fy="35%">
                <stop stop-color="white" offset="0%" />
                <stop stop-color="gold" offset="15%" />
                <stop stop-color="goldenrod" offset="80%" />
                <stop stop-color="darkgoldenrod" offset="100%" />
            </radialGradient>
        </defs>
    
        <g fill="url(#coin)" stroke="darkgoldenrod" stroke-width="0.5">
            <circle r="5" transform="translate(30,7)" />
            <circle r="5" transform="translate(35,13)" />
            <circle r="5" transform="translate(22,10)" />
            <circle r="5" transform="translate(27,9)" />
            <circle r="5" transform="translate(18,17)" />
            <circle r="5" transform="translate(42,18)" />
            <circle r="5" transform="translate(32,19)" />
            <circle r="5" transform="translate(30,14)" />
            <circle r="5" transform="translate(25,15)" />
            <circle r="5" transform="translate(37,19)" />
            <circle r="5" transform="translate(31,16)" />
            <circle r="5" transform="translate(20,18)" />
            <circle r="5" transform="translate(26,21)" />
        </g>
        <path fill="url(#pot)" stroke="#751" stroke-width="0.5" d="M30,50 C45,50 55,45 55,35  Q 55,27 50,25 C55,22 53,15 45,20 S 23,25 15,20 S5,22 10,25 Q 5,27 5,35 C5,45 15,50 30,50Z" />
    </svg>
</div>
```

  


内联 SVG 的视口由根元素 `<svg>` 上指定的宽度和高度建立。一旦删除该元素的 `width` 和 `height` ，所以浏览器假定 `width` 等于 `100%` ，并水平拉伸 SVG 以适应其容器的宽度，与此同时，它的高度会根据 `viewBox` 指定的宽高比自动适配。

  


不过，需要注意的是，CSS 布局相关的特性将会影响 `<svg>` 在浏览器中的渲染。例如，当 `<svg>` 元素的容器 `.coin` 设置了下面这些规则，并且 `<svg>` 未显式设置 `width` 或 `height` ，那么在视觉上，SVG 看上去被丢失了：

  


```CSS
.coin {
    display: grid;
    place-content: center;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b967bdb426d4ccd8c70e2c9572310f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1536&h=714&s=1692486&e=gif&f=104&b=030303)

  


避免这种现象最有效的方式是，显式指定 `svg` 的 `width` 为 `100%` ：

  


```CSS
.coin {
    display: grid;
    place-content: center;
    
    svg {
        display: block;
        width: 100%;
    }
}
```

  


另外，在一些浏览器中，例如 IE ，当 `svg` 元素未设置 `width` 和 `height` 时，它会将 `svg` 元素的宽度假定为 `100%` ，高度假定为 `150px` 。就像 `iframe` 和 `img` 嵌入的情况下，这个高度是固定的。因此，当 SVG 在较小屏幕上缩小时，SVG 内部内容的下下会有空白。在 `img` 嵌入的情况下，显式指定 `img` 的 `width` 为 `100%` 就可以避免这种现象；然而，内联 SVG 时，即使显式设置 `svg` 的 `width` 为 `100%` ，并不能解决这个问题。因此，我们遇到了类似于 `iframe` 嵌入 SVG 的情况。在这种情况下，使用内联 SVG时，可以使用我们在 `iframe` 情况下使用的技巧：

  


```CSS
.coin {
    width: 50vmin;
    --ratio: 60 / 55;
    aspect-ratio: var(--ratio);
    position: relative;
    
    svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c17913db1f949ccb3f3cee8cfeebd22~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=838&s=7422482&e=gif&f=193&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/NWVZpva

  


请注意，不像 `iframe` ，`svg` 可以不设置 `width` 和 `height` 来适应容器。如果你添加了它们也没关系，但在这种情况下不是必要的。

  


其实，这种方式也同样可以适用于 `img` 元素上。也就是说，你可以把 `img` 、`iframe` 和内联 SVG 的适配方式统一起来，这样你就可以不用再花精力为不同的方式使用不同的适配方案：

  


```HTML
<div class="fluid--svg">
    <img src="coin.svg" alt="" />
</div>

<div class="fluid--svg">
    <iframe src="coin.svg" alt="" frameborder="0" />
</div>

<div class="fluid--svg">
    <svg viewBox="0 0 60 55">
        <!-- SVG 图形 -->
    </svg>
</div>
```

  


```CSS
.fluid--svg {
    --ratio: 60 / 55;
    aspect-ratio: var(--ratio);
    position: relative;
    
    :is(img, iframe, svg) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2448a19bfa2e4ee9b2f7b45cacf79d86~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1168&s=619085&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/pomXPjG

  


另外，在使用内联 SVG 时，`aspect-ratio` 可以直接设置在 `svg` 元素上。只不过有一些小细节需要注意：

  


-   `preserveAspectRatio` 使用 `YMin` 作为垂直对齐方式，使得图形与 `<svg>` 内容区域的顶部对齐
-   显式设置 `svg` 的 `overflow` 为 `visible`

  


```HTML
<div class="fluid--svg">
    <svg viewBox="0 0 60 55" preserveAspectRatio="xMidYMin slice">
        <!-- 其他 SVG 代码 -->
    </svg>
</div>  
```

  


```CSS
.fluid--svg {
    --ratio: 60 / 55;
    position: relative;
    
    svg {
        display: block;
        width: 100%;
        overflow: visible;
        aspect-ratio: var(--ratio);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d223c9ff4f224d649031567f4c0fa28c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1412&h=756&s=6505894&e=gif&f=144&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/GRabmYB

  


注意，上面这些示例所展示的是，SVG 按比例缩放以适配可用的宽度，并且高度根据图形的宽高比自动调整。这些技巧同样也适用于 SVG 按比例缩放以适配可用的高度，并且宽度根据图形的宽高比自动调整。具体的代码和案例在这里就不一一展示了，感兴趣的同学可以自己尝试一下。

  


### 把 SVG 拉伸到特定尺寸

  


尽管大多数的时候，我们都希望 SVG 图形能保持宽高比进行缩放，以适配容器的尺寸。但有的时候可能需要图形不按宽高比例进行缩放，以适配容器的尺寸。在这种情况下，最为关键的是，将`svg` 元素的 `preserveAspectRatio` 属性设置为 `none` 。此时，SVG 图形的所有部分都会被等比拉伸或挤压，就像不均匀缩放其他图像类型一样。

  


```HTML
<div class="coin">
    <svg viewBox="0 0 60 55" preserveAspectRatio="none">
        <!-- SVG 代码 -->
    </svg>
</div>  
```

  


```CSS
.coin svg {
    display: block;
    width: 100%;
    height: 100%;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a1833fe970b44279e6cabee80275f42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1412&h=756&s=5486584&e=gif&f=200&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/QWRXgvy

  


### 分别缩放 SVG 的各个部分

  


`viewBox` 和 `preserveAspectRatio` 的结合使用使得 SVG 具有高度的灵活性。理解这一点后，你可以不再将 SVG 仅仅视为另一种图像格式，而是可以将其视为一种灵活的图形工具，可以随着窗口大小的变化进行缩放和调整。

  


其中最为重要的一点是，你不需要为整个 SVG 定义单一的 `viewBox` 和 `preserveAspectRatio` 。相反，你可以使用嵌套的 `<svg>` 元素，每个元素都有自己的缩放属性，以使图形的不同部分可以独立缩放。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1246ce5cf23445928e02da507c5e8091~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1240&h=744&s=2651752&e=gif&f=120&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/wvZQqxQ

  


有关于这方面更详细的介绍，请移步阅读小册的《[嵌套 SVG](https://juejin.cn/book/7341630791099383835/section/7359889736816656419)》!

  


## SVG 中的媒体查询

  


众所周知，我们使用 CSS 构建响应式 Web 布局时，其中 [CSS 的 媒体查询](https://juejin.cn/book/7223230325122400288/section/7257368158451793935)是必不可少的一个部分。当然，在[现代 CSS](https://s.juejin.cn/ds/i6fNuULB/) 中，我们还可以使用 [CSS 的容器查询](https://juejin.cn/book/7223230325122400288/section/7259668032165773368)来构[建响应式 Web 布局](https://juejin.cn/book/7161370789680250917/section/7165845190614188062)，但这部分内容已超出我们这节课的范畴，在这里不做过多的阐述。我们继续回到 SVG 的世界中。

  


由于 SVG 中的图形元素是使用 XML 创建的，因此处理 SVG 时非常灵活。我们同样可以使用 CSS 选择器选择单个元素并应用特定的样式，就像你可以更改 HTML 元素的样式一样，[你也可以使用 CSS 更改 SVG 元素的某些样式](https://juejin.cn/book/7341630791099383835/section/7351339840161447945)。例如：

  


```CSS
rect {
    fill: lime;
}
```

  


有趣的是,SVG 也可以使用媒体查询来实现图片的响应性：

  


```XML
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <style>
        circle {
            fill: green;
        }
        @media (min-width: 100px) {
            circle {
                fill: blue;
            }
        }
    </style>
    <circle cx="50" cy="50" r="50"/>
</svg>
```

  


这是一个非常简单的 SVG 。假设我们把上面的代码保存为 `circle.svg` 文件，并且通过我们常用的方式来将 `circle.svg` 潜入到 Web 上：

  


```HTML
<img src="https://static.fedev.cn/damo/circle.svg" width="50" height="50" />
<img src="https://static.fedev.cn/damo/circle.svg" width="100" height="100" />
<iframe src="https://static.fedev.cn/damo/circle.svg" width="50" height="50"></iframe>
<svg width="50" height="50">
    <style>
        circle {
            fill: green;
        }
        @media (min-width: 100px) {
            circle {
                fill: blue;
            }
        }
    </style>
    <circle cx="50" cy="50" r="50"/>
</svg>
```

  


试想一下，上面的代码中的 `<circle>` 在浏览器中呈现的结果是 `green` 还是 `blue` ？也就是说，`<style>` 中的 `@media` 中的 `min-width` 是相对于谁计算呢？

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe2901173bca47c2953a585ab0cff7be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=868&s=130377&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/BaegvpQ

  


不难发现，SVG 中的媒体查询规则就是 CSS 的 `@media` 规则，但它并不是相对于浏览器视窗尺寸来计算。SVG 中媒体查询中指定的尺寸是指 SVG 视口的尺寸，除非 SVG 是内联到 HTML 中的。而 SVG 视口的尺寸是由 `<svg>` 元素的尺寸定义，即 `width` 和 `height` 。

  


也就是说，对于 `<img>` ，SVG 会按比例缩放以适应图像元素的大小，并且 SVG 的视口是 `<img>` 的 CSS 尺寸。因此，示例中的第一个 `<img>` 的视口宽度是 `50` ，第二个是 `100` 。这意味着第二个 `<img>` 会匹配 `@media (min-width: 100px)` 规则，所以 `<circle>` 的 `fill` 是 `blue` ，在浏览器中呈现的是一个蓝色的圆。

  


对于 `<iframe>` ，SVG 的视口是 `<iframe>` 文档的视口。因此，在上面的示例中，视口宽度是 `50px` ，因为它是 `<iframe>` 元素的 `width` 。因此，浏览器中呈现的是一个绿色的圆。

  


对于内联的 `<svg>` ，SVG 没有自己的视口，它是父文档中的一部分。这意味着 `<style>` 属于父文档，它不是限定于 SVG 的。我们来看一个单独的示例：

  


```HTML
<div class="coin">
    <svg viewBox="0 0 60 55">
        <style>
            svg * {
                transition: fill .1s ease-out, opacity .1s ease-out;
            }
    
            @media all and (max-width: 250px) {
                .coins {
                    opacity: 0;
                }
            }
        </style>
        <defs>
            <linearGradient id="coin" x2="50%" y2="40%" spreadMethod="reflect">
                <stop stop-color="gold" offset="30%" />
                <stop stop-color="goldenrod" offset="70%" />
                <stop stop-color="white" offset="82%" />
                <stop stop-color="gold" offset="92%" />
                <stop stop-color="darkgoldenrod" offset="100%" />
            </linearGradient>
            <radialGradient id="pot" fx="30%" fy="35%">
                <stop stop-color="white" offset="0%" />
                <stop stop-color="gold" offset="15%" />
                <stop stop-color="goldenrod" offset="80%" />
                <stop stop-color="darkgoldenrod" offset="100%" />
            </radialGradient>
        </defs>
    
        <g class="coins" fill="url(#coin)" stroke="darkgoldenrod" stroke-width="0.5">
            <circle r="5" transform="translate(30,7)" />
            <circle r="5" transform="translate(35,13)" />
            <circle r="5" transform="translate(22,10)" />
            <circle r="5" transform="translate(27,9)" />
            <circle r="5" transform="translate(18,17)" />
            <circle r="5" transform="translate(42,18)" />
            <circle r="5" transform="translate(32,19)" />
            <circle r="5" transform="translate(30,14)" />
            <circle r="5" transform="translate(25,15)" />
            <circle r="5" transform="translate(37,19)" />
            <circle r="5" transform="translate(31,16)" />
            <circle r="5" transform="translate(20,18)" />
            <circle r="5" transform="translate(26,21)" />
        </g>
        <path fill="url(#pot)" stroke="#751" stroke-width="0.5" d="M30,50 C45,50 55,45 55,35  Q 55,27 50,25 C55,22 53,15 45,20 S 23,25 15,20 S5,22 10,25 Q 5,27 5,35 C5,45 15,50 30,50Z" />
    </svg>
</div>
```

  


上面的代码中，我们在 `<svg>` 标签内嵌套了一个 `<style>` 标签，并且在这里应用一个简单的 CSS 样式规则，即可视窗宽度小于 `250px` 时，`.coins` 的 `opacity` 为 `0` ，即不可见。

  


与此同时，我们在 CSS 中设置了 `<svg>` 元素的 `width` 和 `height` 等同于它的父元素 `.coin` 的 `width` 和 `height` ：

  


```CSS
.coin {
    width: 50vmin;
    aspect-ratio: 60 / 55;
    padding: 1rem;
    background-color: #fff;
    border-radius: .25em;
    overflow: hidden;
    resize: horizontal;
    
    svg {
        display: block;
        width: 100%;
        height: 100%;
    }
}
```

  


这意味着，我们定义了 SVG 的视口尺寸，它的大小与 `.coin` 盒子尺寸相同。当我们调整 `.coin` 的尺寸小于 `250px` 时，SVG 中的 `.coins` 部分并没有隐藏：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9c46b6fd54c4902bf1d490cf8410493~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=740&s=1385746&e=gif&f=112&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/dyEBwzb

  


但你会发现，当你将浏览器视窗的宽度调小到等于或小于 `250px` 时，SVG 图形中的 `.coins` 会被隐藏，它的 `opacity` 值为 `0` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0d3068e304f4f4db9175e22e8668547~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=558&s=2425399&e=gif&f=246&b=d7e9ec)

  


> Demo 地址：https://codepen.io/airen/full/dyEBwzb

  


这与 CSS 媒体查询控制 HTML 元素样式是一样的。事实上，SVG 内联到 HTML 中时，`<svg>` 元素以及它所有后代元素都将是 HTML 文档中的一部分，也可以被视为 HTML 元素。应用于这些元素上的媒体查询规则，例如 `(max-width: 250px)` ，其视口尺寸就是我们熟悉的浏览器视窗的尺寸。

  


换句话说，内联 SVG 中的媒体查询不会给我们带来多少困惑，因为它与我们以往使用 CSS 媒体查询所带来的结果是一样的。但大家要记住，当一个独立的 `.svg` 中应用了媒体查询，那么 SVG 视口与引用该文件元素的尺寸大小有着紧密的关联，因为元素的尺寸就是 SVG 视口的尺寸。

  


我们再来看一个示例，假设我们有一段 SVG 代码：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 194 186">
    <style>
        svg * {
            transition: fill .1s ease-out, opacity .1s ease-out;
        }
        @media all and (max-width: 250px) {
            #curved_bg { opacity: 0; }
            #secondary_content, #primary_content { fill: #195463; }
        }
        @media all and (max-width: 200px) {
            #secondary_content {
                opacity: 0;
            }
        }
        @media all and (max-width: 150px) {
            #inner-circle, #middle-circle {
                opacity: 0;
            }
        }
    </style>
    <path id="curved_bg" fill="#195463" d="M181.6 65.8c-3-9.4-0.2-21.8-5.9-29.6 -5.7-7.9-18.5-9-26.3-14.8C141.6 15.8 136.6 4 127.2 1c-9-2.9-20 3.6-30 3.6 -10 0-20.9-6.5-30-3.6 -9.4 3-14.4 14.8-22.2 20.5 -7.9 5.7-20.6 6.9-26.3 14.8 -5.7 7.8-2.9 20.2-5.9 29.6 -2.9 9-12.6 17.4-12.6 27.4 0 10 9.7 18.4 12.6 27.4 3 9.4 0.2 21.8 5.9 29.6 5.7 7.9 18.5 9 26.3 14.7 7.8 5.7 12.8 17.5 22.1 20.5 9 2.9 20-3.6 30-3.6 10 0 21 6.5 30 3.6 9.4-3 14.4-14.8 22.2-20.5 7.9-5.7 20.6-6.9 26.3-14.8 5.7-7.8 2.9-20.2 5.9-29.6 2.9-9 12.6-17.4 12.6-27.4C194.2 83.2 184.5 74.9 181.6 65.8z"/>
    <g id="primary_content" fill="#ECECEC">
        <path id="icon" d="M125.7 109.7L125.7 109.7l-1-8.8 0 0 0 0 -6.3 5.3 1.7 0.8c0 0 0.2 8-9.4 8 -9.6 0-10.1-8.5-10.1-8.5V81h10.8 0c0 0 2.3-0.8 2.3-3.1s-2.3-3-2.3-3l-8.3-0.2c2.5-1.8 4.1-4.8 4.1-8.1 0-5.6-4.5-10.1-10.1-10.1 -5.6 0-10.1 4.5-10.1 10.1 0 3.3 1.6 6.3 4.1 8.1L83 74.9c0 0-2.3 0.7-2.3 3S83 81 83 81h10.8v25.5c0 0-0.5 8.5-10.1 8.5 -9.6 0-9.4-8-9.4-8l1.7-0.8 -6.3-5.3 -1 8.8 2.4-1.5c0 0 2 8.9 11.1 12.6 9.1 3.7 13.2 5.9 14.9 9.5v0.1c0 0 0 0 0 0 0 0 0 0 0 0v0c0 0 0 0 0 0 0 0 0 0 0 0v0c0 0 0 0 0 0v-0.1c1.8-3.6 5.9-5.8 14.9-9.5 9-3.7 11.1-12.4 11.1-12.6L125.7 109.7 125.7 109.7zM93.1 66.5c0-2.3 1.9-4.2 4.2-4.2 2.3 0 4.2 1.9 4.2 4.2 0 2.3-1.9 4.2-4.2 4.2v0C94.9 70.7 93.1 68.8 93.1 66.5z"/>
        <path id="inner-circle" d="M97.2 140c-25.7 0-46.6-20.9-46.6-46.6 0-25.7 20.9-46.6 46.6-46.6 25.7 0 46.6 20.9 46.6 46.6C143.8 119.1 122.9 140 97.2 140zM97.2 48.8c-24.6 0-44.6 20-44.6 44.6 0 24.6 20 44.6 44.6 44.6 24.6 0 44.6-20 44.6-44.6C141.8 68.8 121.8 48.8 97.2 48.8z"/>
    </g>
    <g id="secondary_content" fill="#ECECEC">
        <path id="middle-circle" d="M97.2 145.8c-28.9 0-52.4-23.5-52.4-52.4 0-28.9 23.5-52.4 52.4-52.4 28.9 0 52.4 23.5 52.4 52.4C149.6 122.3 126.1 145.8 97.2 145.8zM97.2 42.1c-28.3 0-51.4 23-51.4 51.4s23 51.4 51.4 51.4c28.3 0 51.4-23 51.4-51.4S125.6 42.1 97.2 42.1z"/>
        <path id="bottom-text" d="M49.9 122.8l-0.2 0.8 -2.6 1.3 -0.5-1 2.1-1.1 -0.9-1.8 -6.3 3.1 1.1 2.3 -0.2 0.8 -7.3 3.7 -0.8-0.3 -1.4-2.8 0.3-0.8 2.6-1.3 0.5 1 -2.1 1.1 0.9 1.8 6.3-3.1 -1.1-2.3 0.3-0.8 7.3-3.7 0.8 0.3L49.9 122.8zM37.7 135.6l13-8.9 -0.3-0.5 0.9-0.7 1.3 1.9 -0.9 0.7 -0.3-0.5 -12.5 8.6 1.1 1.6 12.5-8.6 -0.3-0.5 1-0.7 1.3 1.9 -0.9 0.7 -0.3-0.5 -13 8.9 -0.8-0.1 -1.8-2.6L37.7 135.6zM52.8 137.4l-7.5 7.1 0.5 0.5 -0.8 0.8 -1.7-1.8 0.8-0.8 0.5 0.5 11-10.5 -0.5-0.5 0.8-0.8 0.9 0.9 0.1 0.7 -4.5 6.5 6.7-4.2 0.7 0.1 0.9 0.9 -0.8 0.8 -0.5-0.5 -11 10.5 0.5 0.5 -0.8 0.8 -1.7-1.8 0.8-0.8 0.5 0.5 7.5-7.1 -4.4 2.7 -0.8-0.8L52.8 137.4zM60.2 144.3l-6.2 8.3 0.5 0.4 -0.7 0.9 -2-1.5 0.7-0.9 0.5 0.4 9.1-12.2 -0.5-0.4 0.7-0.9 1 0.8 0.2 0.7 -3.3 7.2 5.9-5.2 0.7 0 1 0.8 -0.7 0.9 -0.5-0.4 -9.1 12.2 0.5 0.4 -0.7 0.9 -2-1.5 0.7-0.9 0.5 0.4 6.2-8.3 -3.9 3.4L58 149 60.2 144.3zM65.9 161.5l-4.4-2.3 0.5-1 0.6 0.3 7.2-13.4 -0.6-0.3 0.5-1 4.4 2.3 -1.7 3.1 -1-0.5 1.1-2.1 -1.7-0.9 -3.3 6.2 1 0.5 0.7-1.3 1 0.5 -1.9 3.5 -1-0.5 0.7-1.3 -1-0.5 -3.3 6.2 1.7 0.9 1.1-2.1 1 0.5L65.9 161.5zM75.6 164.2l-0.4 1.1 -1.1-0.4 -0.3-0.7 2.6-7.1 -1.8-0.7 -2.4 6.6 0.6 0.2 -0.4 1.1 -2.2-0.8 0.4-1.1 0.6 0.2 5.2-14.3 -0.7-0.3 0.4-1.1 4.2 1.5 0.4 0.7 -2.6 7.2 -0.7 0.3 0.4 0.8 -2.4 6.6L75.6 164.2zM79.2 149.3l-1.8-0.7 -2.4 6.6 1.8 0.7L79.2 149.3zM90.4 168.4l-3.1-0.4 -0.5-0.7 1.9-16.3 0.6-0.5 3.1 0.4 0.5 0.6L91 167.8 90.4 168.4zM91.7 152l-1.9-0.2L88 166.9l1.9 0.2L91.7 152zM98 167.5l0.7 0 0 1.2 -2.5 0.1 0-1.2 0.7 0 -0.5-15.2 -0.7 0 0-1.2 1.2 0 0.6 0.4 3.7 12.1 -0.4-11.5 -0.7 0 0-1.2 2.5-0.1 0 1.2 -0.7 0 0.5 15.2 0.7 0 0 1.2 -1.2 0 -0.6-0.4 -3.7-12.1L98 167.5zM109.9 149.7l5.3-1.6 1 3.4 -1.1 0.3 -0.7-2.3 -1 0.3 4.4 14.6 0.6-0.2 0.3 1.1 -2.2 0.7 -0.3-1.1 0.6-0.2 -4.4-14.6 -1 0.3 0.7 2.3 -1.1 0.3L109.9 149.7zM122.3 146.3l6.5 13.8 0.5-0.3 0.5 1 -2.1 1 -0.5-1 0.5-0.3 -3-6.4L123 155l3 6.4 0.5-0.3 0.5 1 -2.1 1 -0.5-1 0.5-0.3 -6.5-13.8 -0.5 0.3 -0.5-1 2.1-1 0.5 1 -0.5 0.3 3 6.4 1.8-0.8 -3-6.4 -0.5 0.3 -0.5-1 2.1-1 0.5 1L122.3 146.3zM138 155.9l-4.2 2.7 -0.6-1 0.6-0.4 -8.3-12.8 -0.6 0.4 -0.6-1 4.2-2.7 1.9 3 -1 0.6 -1.3-2 -1.6 1.1 3.8 5.9 0.9-0.6 -0.8-1.2 1-0.6 2.2 3.4 -1 0.6 -0.8-1.2 -0.9 0.6 3.8 5.9 1.6-1.1 -1.3-2 1-0.6L138 155.9zM136.9 133.7l0.8 0 2.1 2.1 -0.8 0.8 -1.7-1.6 -1.4 1.4 5 4.9 1.8-1.8 0.8 0 5.9 5.7 0 0.8 -2.2 2.2 -0.8 0 -2.1-2.1 0.8-0.8 1.7 1.7 1.4-1.4 -5-4.9 -1.8 1.8 -0.8 0 -5.9-5.7 0-0.8L136.9 133.7zM155.9 138l-3 4 -0.9-0.7 0.4-0.6 -12.2-9.1 -0.4 0.6 -0.9-0.7 3-4 2.8 2.1 -0.7 0.9 -1.9-1.4 -1.2 1.6 5.6 4.2 0.7-0.9 -1.1-0.9 0.7-0.9 3.2 2.4 -0.7 0.9 -1.1-0.9 -0.7 0.9 5.6 4.2 1.2-1.6 -1.9-1.4 0.7-0.9L155.9 138zM158.4 131.7l0.1-0.3 1 0.5 -1.2 2.2 -1-0.5 0.5-0.9 -12.6-8.7 -0.2 0.4 -1-0.5 1.2-2.2 1 0.5 -0.2 0.4 14.3 5.6 0.5-0.9 1 0.5 -1.2 2.2 -1-0.5 0.1-0.3 -4.6-1.8 -0.9 1.6L158.4 131.7zM154.2 126.9l-6.2-2.4 5.4 3.8L154.2 126.9z"/>
        <path id="upper-text" d="M50.3 62.5l-2.5 4.3 -1-0.6 0.4-0.6 -13.1-7.8 -0.4 0.6 -1-0.6 2.5-4.3 3 1.8 -0.6 1 -2-1.2 -1 1.7 6 3.6 0.6-0.9L40 58.8l0.6-1 3.5 2.1 -0.6 1 -1.2-0.7L41.7 61l6 3.6 1-1.7 -2.1-1.2 0.6-1L50.3 62.5zM51.7 58.6l0.4-0.5 0.9 0.7 -1.6 2L50.6 60l0.4-0.5 -11.8-9.6 -0.4 0.5 -0.9-0.7 0.8-1 0.7-0.2 11.5 5.1 -8.9-7.2 -0.4 0.5 -0.9-0.7 1.6-2 0.9 0.7 -0.4 0.5 11.8 9.6 0.4-0.5 0.9 0.7 -0.8 1 -0.7 0.2 -11.5-5.1L51.7 58.6zM55.9 50.3l1.6 1.8 1.4-1.3L48.7 39.6 48.2 40l-0.8-0.8 1.9-1.7 0.8 0.8 -0.5 0.5 10.7 11.6 0 0.8 -2.3 2.1 -0.8-0.1 -2-2.2L55.9 50.3zM66.2 46.6l-2.5 1.8 -0.8-0.2 -9.4-13.4 0.1-0.8 2.5-1.8 0.8 0.1 9.4 13.4L66.2 46.6zM56.3 33.5l-1.6 1.1 8.8 12.4 1.6-1.1L56.3 33.5zM64.5 27.4l2.2-1.1 0.5 1 -0.7 0.4 1.6 7.8 3.4 6.7 0.5-0.3 0.5 1 -2.1 1.1 -0.5-1 0.5-0.3 -3.4-6.7L61.9 30l-0.7 0.4 -0.5-1 2.2-1.1 0.5 1 -0.4 0.2 3.8 4.1 -1.2-5.5 -0.5 0.2L64.5 27.4zM85.9 38.4l-4.3 1 -0.3-1.1 0.7-0.2 -3.6-14.8 -0.7 0.2 -0.3-1.1 4.3-1 0.7 0.4 3.8 15.9L85.9 38.4zM81.5 22.6l-1.9 0.5 3.6 14.8 1.9-0.5L81.5 22.6zM93.7 37.3l-5 0.5 -0.1-1.1 0.7-0.1 -1.6-15.1 -0.7 0.1 -0.1-1.1 5-0.5 0.4 3.5 -1.1 0.1 -0.2-2.4 -2 0.2 0.7 7 1.1-0.1 -0.2-1.4 1.1-0.1 0.4 4L91 30.8l-0.2-1.4 -1.1 0.1 0.7 7 2-0.2 -0.3-2.4 1.1-0.1L93.7 37.3zM106.7 20.3l0.5 0.6 -0.3 2.9 -1.1-0.1 0.2-2.4 -2-0.2 -0.7 7 2.5 0.3 0.5 0.6 -0.9 8.1 -0.7 0.5 -3.1-0.3 -0.5-0.6 0.3-2.9 1.1 0.1 -0.3 2.4 2 0.2 0.7-7 -2.5-0.3 -0.5-0.6 0.9-8.1 0.6-0.5L106.7 20.3zM108.5 37.8l3.7-15.3 -0.6-0.1 0.3-1.1 2.3 0.5 -0.3 1.1 -0.6-0.1 -3.6 14.8 1.9 0.5 3.6-14.8 -0.6-0.1 0.3-1.1 2.3 0.5 -0.3 1.1 -0.6-0.1 -3.7 15.3 -0.7 0.4 -3-0.7L108.5 37.8zM117.4 39.7L118 40l-0.4 1.1 -2.3-1 0.4-1.1 0.6 0.3 5.8-14.1 -0.6-0.3 0.4-1.1 1.2 0.5 0.4 0.6 -1.6 12.5 4.3-10.6 -0.6-0.3 0.4-1.1 2.3 1 -0.4 1.1 -0.6-0.3 -5.8 14.1 0.6 0.3 -0.4 1.1 -1.2-0.5 -0.4-0.6 1.6-12.5L117.4 39.7zM135.9 30.7l0.2 0.8 -1.5 2.5 -1-0.6 1.2-2 -1.7-1 -3.6 6.1 2.2 1.3 0.2 0.8 -4.2 7.1 -0.8 0.2 -2.7-1.6 -0.2-0.8 1.5-2.5 1 0.6 -1.2 2.1 1.7 1 3.6-6.1 -2.2-1.3 -0.2-0.8 4.2-7.1 0.8-0.2L135.9 30.7zM143.2 37.3l-9.3 12 0.5 0.4 -0.7 0.9 -1.8-1.4 0.7-0.9 0.5 0.4 4.3-5.6 -1.5-1.2 -4.3 5.6 0.5 0.4 -0.7 0.9 -1.8-1.4 0.7-0.9 0.5 0.4 9.3-12 -0.5-0.4 0.7-0.9 1.8 1.4 -0.7 0.9 -0.5-0.4 -4.3 5.6 1.5 1.2 4.3-5.6 -0.5-0.4 0.7-0.9 1.8 1.4 -0.7 0.9L143.2 37.3zM147.9 41.6l-10.6 11 0.5 0.5 -0.8 0.8 -1.8-1.8 0.8-0.8 0.5 0.5 10.6-11 -0.5-0.5 0.8-0.8 1.8 1.8 -0.8 0.8L147.9 41.6zM140.6 56l0.4 0.5 -0.9 0.7 -1.6-2 0.9-0.7 0.4 0.5 11.8-9.6 -0.4-0.5 0.9-0.7 0.8 1 0 0.7 -7.4 10.2 8.9-7.2 -0.4-0.5 0.9-0.7 1.6 2 -0.9 0.7 -0.4-0.5 -11.8 9.6 0.4 0.5 -0.9 0.7 -0.8-1 0-0.7 7.4-10.2L140.6 56zM146.6 66.8l-2.6-4.3 1-0.6 0.4 0.6 13.1-7.8 -0.4-0.6 1-0.6 2.6 4.3 -3 1.8 -0.6-1 2-1.2 -1-1.7 -6 3.6 0.6 0.9 1.2-0.7 0.6 1 -3.5 2.1 -0.6-1 1.2-0.7 -0.6-0.9 -6 3.6 1 1.7 2.1-1.2 0.6 1L146.6 66.8z"/>
        <path id="outer-circle" d="M97.2 176.5c-45.8 0-83-37.2-83-83s37.2-83 83-83c45.8 0 83 37.2 83 83S143 176.5 97.2 176.5zM97.2 13.4c-44.1 0-80 35.9-80 80s35.9 80 80 80c44.1 0 80-35.9 80-80S141.4 13.4 97.2 13.4z"/>
        <circle id="left-dot" cx="31.1" cy="91.5" r="3"/>
        <circle id="right-dot" cx="163.4" cy="91.5" r="3"/>
    </g>
</svg>
```

  


如果上面代码中的媒体查询相匹配时，SVG 图形将会在浏览器中呈现不一样的视觉效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4810d5324dce4e358ae49a6d2605c5cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=506&s=8577199&e=gif&f=374&b=ffffff)

  


正如你所看到的，这是一个具有响应式的 Logo 图标。如果没有 SVG，我们需要在不同的屏幕尺寸上切换 PNG 实现。而且位图图标在高分辨率屏幕上可能看起来不佳，而为了隐藏 Logo 图标的部分内容，不得不维护多个图像。现在，我们在 SVG 绘制的 Logo 图标中应用媒体查询，就省事多了。

  


我们先来看第一种使用方式，即内联 SVG 的方式：

  


```HTML
<header>
    <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 194 186">
            <style>
                svg * {
                    transition: fill .1s ease-out, opacity .1s ease-out;
                }
                @media all and (max-width: 250px) {
                    #curved_bg { opacity: 0; }
                    #secondary_content, #primary_content { fill: #195463; }
                }
                @media all and (max-width: 200px) {
                    #secondary_content {
                        opacity: 0;
                    }
                }
                @media all and (max-width: 150px) {
                    #inner-circle, #middle-circle {
                        opacity: 0;
                    }
                }
            </style>
            <path id="curved_bg" fill="#195463" d="M181.6 65.8c-3-9.4-0.2-21.8-5.9-29.6 -5.7-7.9-18.5-9-26.3-14.8C141.6 15.8 136.6 4 127.2 1c-9-2.9-20 3.6-30 3.6 -10 0-20.9-6.5-30-3.6 -9.4 3-14.4 14.8-22.2 20.5 -7.9 5.7-20.6 6.9-26.3 14.8 -5.7 7.8-2.9 20.2-5.9 29.6 -2.9 9-12.6 17.4-12.6 27.4 0 10 9.7 18.4 12.6 27.4 3 9.4 0.2 21.8 5.9 29.6 5.7 7.9 18.5 9 26.3 14.7 7.8 5.7 12.8 17.5 22.1 20.5 9 2.9 20-3.6 30-3.6 10 0 21 6.5 30 3.6 9.4-3 14.4-14.8 22.2-20.5 7.9-5.7 20.6-6.9 26.3-14.8 5.7-7.8 2.9-20.2 5.9-29.6 2.9-9 12.6-17.4 12.6-27.4C194.2 83.2 184.5 74.9 181.6 65.8z"/>
            <g id="primary_content" fill="#ECECEC">
                <path id="icon" d="M125.7 109.7L125.7 109.7l-1-8.8 0 0 0 0 -6.3 5.3 1.7 0.8c0 0 0.2 8-9.4 8 -9.6 0-10.1-8.5-10.1-8.5V81h10.8 0c0 0 2.3-0.8 2.3-3.1s-2.3-3-2.3-3l-8.3-0.2c2.5-1.8 4.1-4.8 4.1-8.1 0-5.6-4.5-10.1-10.1-10.1 -5.6 0-10.1 4.5-10.1 10.1 0 3.3 1.6 6.3 4.1 8.1L83 74.9c0 0-2.3 0.7-2.3 3S83 81 83 81h10.8v25.5c0 0-0.5 8.5-10.1 8.5 -9.6 0-9.4-8-9.4-8l1.7-0.8 -6.3-5.3 -1 8.8 2.4-1.5c0 0 2 8.9 11.1 12.6 9.1 3.7 13.2 5.9 14.9 9.5v0.1c0 0 0 0 0 0 0 0 0 0 0 0v0c0 0 0 0 0 0 0 0 0 0 0 0v0c0 0 0 0 0 0v-0.1c1.8-3.6 5.9-5.8 14.9-9.5 9-3.7 11.1-12.4 11.1-12.6L125.7 109.7 125.7 109.7zM93.1 66.5c0-2.3 1.9-4.2 4.2-4.2 2.3 0 4.2 1.9 4.2 4.2 0 2.3-1.9 4.2-4.2 4.2v0C94.9 70.7 93.1 68.8 93.1 66.5z"/>
                <path id="inner-circle" d="M97.2 140c-25.7 0-46.6-20.9-46.6-46.6 0-25.7 20.9-46.6 46.6-46.6 25.7 0 46.6 20.9 46.6 46.6C143.8 119.1 122.9 140 97.2 140zM97.2 48.8c-24.6 0-44.6 20-44.6 44.6 0 24.6 20 44.6 44.6 44.6 24.6 0 44.6-20 44.6-44.6C141.8 68.8 121.8 48.8 97.2 48.8z"/>
            </g>
            <g id="secondary_content" fill="#ECECEC">
                <path id="middle-circle" d="M97.2 145.8c-28.9 0-52.4-23.5-52.4-52.4 0-28.9 23.5-52.4 52.4-52.4 28.9 0 52.4 23.5 52.4 52.4C149.6 122.3 126.1 145.8 97.2 145.8zM97.2 42.1c-28.3 0-51.4 23-51.4 51.4s23 51.4 51.4 51.4c28.3 0 51.4-23 51.4-51.4S125.6 42.1 97.2 42.1z"/>
                <path id="bottom-text" d="M49.9 122.8l-0.2 0.8 -2.6 1.3 -0.5-1 2.1-1.1 -0.9-1.8 -6.3 3.1 1.1 2.3 -0.2 0.8 -7.3 3.7 -0.8-0.3 -1.4-2.8 0.3-0.8 2.6-1.3 0.5 1 -2.1 1.1 0.9 1.8 6.3-3.1 -1.1-2.3 0.3-0.8 7.3-3.7 0.8 0.3L49.9 122.8zM37.7 135.6l13-8.9 -0.3-0.5 0.9-0.7 1.3 1.9 -0.9 0.7 -0.3-0.5 -12.5 8.6 1.1 1.6 12.5-8.6 -0.3-0.5 1-0.7 1.3 1.9 -0.9 0.7 -0.3-0.5 -13 8.9 -0.8-0.1 -1.8-2.6L37.7 135.6zM52.8 137.4l-7.5 7.1 0.5 0.5 -0.8 0.8 -1.7-1.8 0.8-0.8 0.5 0.5 11-10.5 -0.5-0.5 0.8-0.8 0.9 0.9 0.1 0.7 -4.5 6.5 6.7-4.2 0.7 0.1 0.9 0.9 -0.8 0.8 -0.5-0.5 -11 10.5 0.5 0.5 -0.8 0.8 -1.7-1.8 0.8-0.8 0.5 0.5 7.5-7.1 -4.4 2.7 -0.8-0.8L52.8 137.4zM60.2 144.3l-6.2 8.3 0.5 0.4 -0.7 0.9 -2-1.5 0.7-0.9 0.5 0.4 9.1-12.2 -0.5-0.4 0.7-0.9 1 0.8 0.2 0.7 -3.3 7.2 5.9-5.2 0.7 0 1 0.8 -0.7 0.9 -0.5-0.4 -9.1 12.2 0.5 0.4 -0.7 0.9 -2-1.5 0.7-0.9 0.5 0.4 6.2-8.3 -3.9 3.4L58 149 60.2 144.3zM65.9 161.5l-4.4-2.3 0.5-1 0.6 0.3 7.2-13.4 -0.6-0.3 0.5-1 4.4 2.3 -1.7 3.1 -1-0.5 1.1-2.1 -1.7-0.9 -3.3 6.2 1 0.5 0.7-1.3 1 0.5 -1.9 3.5 -1-0.5 0.7-1.3 -1-0.5 -3.3 6.2 1.7 0.9 1.1-2.1 1 0.5L65.9 161.5zM75.6 164.2l-0.4 1.1 -1.1-0.4 -0.3-0.7 2.6-7.1 -1.8-0.7 -2.4 6.6 0.6 0.2 -0.4 1.1 -2.2-0.8 0.4-1.1 0.6 0.2 5.2-14.3 -0.7-0.3 0.4-1.1 4.2 1.5 0.4 0.7 -2.6 7.2 -0.7 0.3 0.4 0.8 -2.4 6.6L75.6 164.2zM79.2 149.3l-1.8-0.7 -2.4 6.6 1.8 0.7L79.2 149.3zM90.4 168.4l-3.1-0.4 -0.5-0.7 1.9-16.3 0.6-0.5 3.1 0.4 0.5 0.6L91 167.8 90.4 168.4zM91.7 152l-1.9-0.2L88 166.9l1.9 0.2L91.7 152zM98 167.5l0.7 0 0 1.2 -2.5 0.1 0-1.2 0.7 0 -0.5-15.2 -0.7 0 0-1.2 1.2 0 0.6 0.4 3.7 12.1 -0.4-11.5 -0.7 0 0-1.2 2.5-0.1 0 1.2 -0.7 0 0.5 15.2 0.7 0 0 1.2 -1.2 0 -0.6-0.4 -3.7-12.1L98 167.5zM109.9 149.7l5.3-1.6 1 3.4 -1.1 0.3 -0.7-2.3 -1 0.3 4.4 14.6 0.6-0.2 0.3 1.1 -2.2 0.7 -0.3-1.1 0.6-0.2 -4.4-14.6 -1 0.3 0.7 2.3 -1.1 0.3L109.9 149.7zM122.3 146.3l6.5 13.8 0.5-0.3 0.5 1 -2.1 1 -0.5-1 0.5-0.3 -3-6.4L123 155l3 6.4 0.5-0.3 0.5 1 -2.1 1 -0.5-1 0.5-0.3 -6.5-13.8 -0.5 0.3 -0.5-1 2.1-1 0.5 1 -0.5 0.3 3 6.4 1.8-0.8 -3-6.4 -0.5 0.3 -0.5-1 2.1-1 0.5 1L122.3 146.3zM138 155.9l-4.2 2.7 -0.6-1 0.6-0.4 -8.3-12.8 -0.6 0.4 -0.6-1 4.2-2.7 1.9 3 -1 0.6 -1.3-2 -1.6 1.1 3.8 5.9 0.9-0.6 -0.8-1.2 1-0.6 2.2 3.4 -1 0.6 -0.8-1.2 -0.9 0.6 3.8 5.9 1.6-1.1 -1.3-2 1-0.6L138 155.9zM136.9 133.7l0.8 0 2.1 2.1 -0.8 0.8 -1.7-1.6 -1.4 1.4 5 4.9 1.8-1.8 0.8 0 5.9 5.7 0 0.8 -2.2 2.2 -0.8 0 -2.1-2.1 0.8-0.8 1.7 1.7 1.4-1.4 -5-4.9 -1.8 1.8 -0.8 0 -5.9-5.7 0-0.8L136.9 133.7zM155.9 138l-3 4 -0.9-0.7 0.4-0.6 -12.2-9.1 -0.4 0.6 -0.9-0.7 3-4 2.8 2.1 -0.7 0.9 -1.9-1.4 -1.2 1.6 5.6 4.2 0.7-0.9 -1.1-0.9 0.7-0.9 3.2 2.4 -0.7 0.9 -1.1-0.9 -0.7 0.9 5.6 4.2 1.2-1.6 -1.9-1.4 0.7-0.9L155.9 138zM158.4 131.7l0.1-0.3 1 0.5 -1.2 2.2 -1-0.5 0.5-0.9 -12.6-8.7 -0.2 0.4 -1-0.5 1.2-2.2 1 0.5 -0.2 0.4 14.3 5.6 0.5-0.9 1 0.5 -1.2 2.2 -1-0.5 0.1-0.3 -4.6-1.8 -0.9 1.6L158.4 131.7zM154.2 126.9l-6.2-2.4 5.4 3.8L154.2 126.9z"/>
                <path id="upper-text" d="M50.3 62.5l-2.5 4.3 -1-0.6 0.4-0.6 -13.1-7.8 -0.4 0.6 -1-0.6 2.5-4.3 3 1.8 -0.6 1 -2-1.2 -1 1.7 6 3.6 0.6-0.9L40 58.8l0.6-1 3.5 2.1 -0.6 1 -1.2-0.7L41.7 61l6 3.6 1-1.7 -2.1-1.2 0.6-1L50.3 62.5zM51.7 58.6l0.4-0.5 0.9 0.7 -1.6 2L50.6 60l0.4-0.5 -11.8-9.6 -0.4 0.5 -0.9-0.7 0.8-1 0.7-0.2 11.5 5.1 -8.9-7.2 -0.4 0.5 -0.9-0.7 1.6-2 0.9 0.7 -0.4 0.5 11.8 9.6 0.4-0.5 0.9 0.7 -0.8 1 -0.7 0.2 -11.5-5.1L51.7 58.6zM55.9 50.3l1.6 1.8 1.4-1.3L48.7 39.6 48.2 40l-0.8-0.8 1.9-1.7 0.8 0.8 -0.5 0.5 10.7 11.6 0 0.8 -2.3 2.1 -0.8-0.1 -2-2.2L55.9 50.3zM66.2 46.6l-2.5 1.8 -0.8-0.2 -9.4-13.4 0.1-0.8 2.5-1.8 0.8 0.1 9.4 13.4L66.2 46.6zM56.3 33.5l-1.6 1.1 8.8 12.4 1.6-1.1L56.3 33.5zM64.5 27.4l2.2-1.1 0.5 1 -0.7 0.4 1.6 7.8 3.4 6.7 0.5-0.3 0.5 1 -2.1 1.1 -0.5-1 0.5-0.3 -3.4-6.7L61.9 30l-0.7 0.4 -0.5-1 2.2-1.1 0.5 1 -0.4 0.2 3.8 4.1 -1.2-5.5 -0.5 0.2L64.5 27.4zM85.9 38.4l-4.3 1 -0.3-1.1 0.7-0.2 -3.6-14.8 -0.7 0.2 -0.3-1.1 4.3-1 0.7 0.4 3.8 15.9L85.9 38.4zM81.5 22.6l-1.9 0.5 3.6 14.8 1.9-0.5L81.5 22.6zM93.7 37.3l-5 0.5 -0.1-1.1 0.7-0.1 -1.6-15.1 -0.7 0.1 -0.1-1.1 5-0.5 0.4 3.5 -1.1 0.1 -0.2-2.4 -2 0.2 0.7 7 1.1-0.1 -0.2-1.4 1.1-0.1 0.4 4L91 30.8l-0.2-1.4 -1.1 0.1 0.7 7 2-0.2 -0.3-2.4 1.1-0.1L93.7 37.3zM106.7 20.3l0.5 0.6 -0.3 2.9 -1.1-0.1 0.2-2.4 -2-0.2 -0.7 7 2.5 0.3 0.5 0.6 -0.9 8.1 -0.7 0.5 -3.1-0.3 -0.5-0.6 0.3-2.9 1.1 0.1 -0.3 2.4 2 0.2 0.7-7 -2.5-0.3 -0.5-0.6 0.9-8.1 0.6-0.5L106.7 20.3zM108.5 37.8l3.7-15.3 -0.6-0.1 0.3-1.1 2.3 0.5 -0.3 1.1 -0.6-0.1 -3.6 14.8 1.9 0.5 3.6-14.8 -0.6-0.1 0.3-1.1 2.3 0.5 -0.3 1.1 -0.6-0.1 -3.7 15.3 -0.7 0.4 -3-0.7L108.5 37.8zM117.4 39.7L118 40l-0.4 1.1 -2.3-1 0.4-1.1 0.6 0.3 5.8-14.1 -0.6-0.3 0.4-1.1 1.2 0.5 0.4 0.6 -1.6 12.5 4.3-10.6 -0.6-0.3 0.4-1.1 2.3 1 -0.4 1.1 -0.6-0.3 -5.8 14.1 0.6 0.3 -0.4 1.1 -1.2-0.5 -0.4-0.6 1.6-12.5L117.4 39.7zM135.9 30.7l0.2 0.8 -1.5 2.5 -1-0.6 1.2-2 -1.7-1 -3.6 6.1 2.2 1.3 0.2 0.8 -4.2 7.1 -0.8 0.2 -2.7-1.6 -0.2-0.8 1.5-2.5 1 0.6 -1.2 2.1 1.7 1 3.6-6.1 -2.2-1.3 -0.2-0.8 4.2-7.1 0.8-0.2L135.9 30.7zM143.2 37.3l-9.3 12 0.5 0.4 -0.7 0.9 -1.8-1.4 0.7-0.9 0.5 0.4 4.3-5.6 -1.5-1.2 -4.3 5.6 0.5 0.4 -0.7 0.9 -1.8-1.4 0.7-0.9 0.5 0.4 9.3-12 -0.5-0.4 0.7-0.9 1.8 1.4 -0.7 0.9 -0.5-0.4 -4.3 5.6 1.5 1.2 4.3-5.6 -0.5-0.4 0.7-0.9 1.8 1.4 -0.7 0.9L143.2 37.3zM147.9 41.6l-10.6 11 0.5 0.5 -0.8 0.8 -1.8-1.8 0.8-0.8 0.5 0.5 10.6-11 -0.5-0.5 0.8-0.8 1.8 1.8 -0.8 0.8L147.9 41.6zM140.6 56l0.4 0.5 -0.9 0.7 -1.6-2 0.9-0.7 0.4 0.5 11.8-9.6 -0.4-0.5 0.9-0.7 0.8 1 0 0.7 -7.4 10.2 8.9-7.2 -0.4-0.5 0.9-0.7 1.6 2 -0.9 0.7 -0.4-0.5 -11.8 9.6 0.4 0.5 -0.9 0.7 -0.8-1 0-0.7 7.4-10.2L140.6 56zM146.6 66.8l-2.6-4.3 1-0.6 0.4 0.6 13.1-7.8 -0.4-0.6 1-0.6 2.6 4.3 -3 1.8 -0.6-1 2-1.2 -1-1.7 -6 3.6 0.6 0.9 1.2-0.7 0.6 1 -3.5 2.1 -0.6-1 1.2-0.7 -0.6-0.9 -6 3.6 1 1.7 2.1-1.2 0.6 1L146.6 66.8z"/>
                <path id="outer-circle" d="M97.2 176.5c-45.8 0-83-37.2-83-83s37.2-83 83-83c45.8 0 83 37.2 83 83S143 176.5 97.2 176.5zM97.2 13.4c-44.1 0-80 35.9-80 80s35.9 80 80 80c44.1 0 80-35.9 80-80S141.4 13.4 97.2 13.4z"/>
                <circle id="left-dot" cx="31.1" cy="91.5" r="3"/>
                <circle id="right-dot" cx="163.4" cy="91.5" r="3"/>
            </g>
        </svg>
    </div>
</header>
```

  


```CSS
.logo {
    width: 72px;
    aspect-ratio: 1;
      
    svg {
        display: block;
        width: 100%;
        height: 100%;
    }
}
```

  


当你调整浏览器视窗尺寸，你看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c9647c1677045a5bee1eb4353a50dab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=502&s=2981891&e=gif&f=305&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/ZENdVRq

  


假设你把上面的 SVG 代码保存为一个 `logo.svg` 文件，并且通过 `<img>` 将 `logo.svg` 引入到 Web 上：

  


```HTML
<header>
    <div class="logo">
        <img src="https://static.fedev.cn/damo/logo.svg" alt="">
    </div>
    <h4>Home</h4>
</header>
```

  


```CSS
.logo {
    width: 72px;
    aspect-ratio: 1;
      
    img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
```

  


此时，不管你如何调整浏览器视窗的尺寸，Logo 图标呈现的都是一种状态：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7f3d1f3592a452893b0392547772f91~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=504&s=1631535&e=gif&f=196&b=030303)

  


如果你希望 `img` 引入的 `logo.svg` 在 Web 中呈现的效果要与内联 SVG 相同，则需要在 CSS 做一些额外的事情：

  


```CSS
.logo {
    width: 72px;
    aspect-ratio: 1;

    @media only screen and (width >= 320px) {
        width: 200px;
    }
      
    @media only screen and (width >= 760px) {
        width: 250px;
    }
      
    @media only screen and (width >= 1024px) {
        width: 300px;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8da76fe636e4933adf4aef5a48761b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=660&s=1906737&e=gif&f=168&b=c6d732)

  


> Demo 地址：https://codepen.io/airen/full/MWdMZqq

  


你可能会说，既然如此，那嵌套在 SVG 中的媒体查询有何意义呢？我想告诉大家的是，有很多情景下，它还是很有用的。继续以上面的 Logo 图标为例，它可能会出现在页头、页尾甚至是页面不同的地方。很可能会因不同的位置，Logo 图标需要呈现不同的大小以及不同的内容。如此一来，就非常有用了。我们来模拟一下这个效果：

  


```HTML
<div class="logo">
    <img src="https://static.fedev.cn/damo/logo.svg" alt="">
</div>
```

  


```CSS
.logo {
    width: 50vmin;
    aspect-ratio: 194 / 186;
    padding: 1rem;
    background-color: #fff;
    border-radius: .25em;
    overflow: hidden;
    resize: horizontal;
    
    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f3acd93182149838c4678d0478a60c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320&h=782&s=8479039&e=gif&f=420&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/VwOJqge

  


想象一下，当 `.logo` 位于不同位置，尺寸大小不同，显示不同的 Logo 图标，是不是非常有用。

  


通过前面所展示的示例，不知道你是否发现了。当媒体查询内嵌在 `<svg>` 元素中时：

  


-   如果通过 `img` 或 `iframe` 元素引入该 SVG ，它的媒体查询表现形式更类似于 [CSS 的容器查询中的尺寸查询](https://juejin.cn/book/7223230325122400288/section/7259668032165773368)
-   如果 SVG 是内联到 HTML 中，它的媒体查询表现形式更类似于 [CSS 的媒体查询](https://juejin.cn/book/7223230325122400288/section/7257368158451793935)

  


## 案例：创建一个响应式 SVG

  


最后，我们通过一个真实案例来结束这节课：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4eeee74e6a994c1aa802a6cec596c497~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=710&s=10903731&e=gif&f=125&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/GRabGLX

  


在这个示例中，用户头像之间的连接线就是 SVG 绘制的。具体代码如下：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" fill="none">
    <style>
        rect {
            height: calc(100% - 24px);
        }
    </style>
    <defs>
        <symbol id="swirl" width="21" height="25" viewBox="0 0 21 25" preserveAspectRatio="xMidYMax" fill="none">
            <path d="M16 21.5C16 19.25 16 18.6 16 15C16 7 11.75 3 7.5 3C3.2503 3 2 6.5 2 8C2 9.5 3.2503 13 7.5 13C10.5 13 16 12 16 2V0" stroke="#ff9800" stroke-width="2" stroke-linecap="round"/>
        </symbol>
    </defs>
    <use href="#swirl" x="0" y="0" width="21" height="100%"/>
    <rect x="15" y="0" width="2" height="100%" rx="1" fill="#ff9800"/>
</svg>
```

  


这段 SVG 代码并不复杂。在 SVG 中，我们将在 `<defs>` 标签中定义了一个名为 `swirl` 的 `<symbol>` ，它的宽度是 `21` ，高度是 `25` 。通过 `viewBox` 将该符号的宽高比设置为 `21:25` ，`preserveAspectRatio="xMidYMax"` 使整个图形在视口（Viewport）的水平方向居中，垂直方向位居底。

  


为了使 `<symbol>` 中定义的路径（`<path>`）可见，我们必须插入一个 `<use>` 标签来引用这个符号。这就是 `preserveAspectRatio` 属性发挥作用的地方，`preserveAspectRatio="xMidYMax"` 确保了涡旋锚定在 SVG 的中底部。

  


此外，通过在 `<use>` 中通过引用将符号的高度设置为 `100%`，我们确保它始终与 SVG 的高度匹配，可以流畅地适应 SVG 尺寸的任何更改。

  


```XML
<svg width="21" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <symbol id="swirl" width="21" height="25" viewBox="0 0 21 25" preserveAspectRatio="xMidYMax" fill="none">
            <path d="M16 21.5C16 19.25 16 18.6 16 15C16 7 11.75 3 7.5 3C3.2503 3 2 6.5 2 8C2 9.5 3.2503 13 7.5 13C10.5 13 16 12 16 2V0" stroke="#ff9800" stroke-width="2" stroke-linecap="round"/>
         </symbol>
    </defs>
    <use href="#swirl" x="0" y="0" width="21" height="100%" />
</svg>
```

  


现在我们已经有了一个 SVG，其中涡旋始终位于底部，无论通过 CSS 进行任何高度更改。

  


接下来，让我们添加一个长垂直线条，它的高度应该是动态计算的。为此，我们将插入一个从顶部到底部延伸的矩形。通过将矩形的高度设置为 `100%`，这很容易实现。

  


```XML
<svg width="21" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <symbol id="swirl" width="21" height="25" viewBox="0 0 21 25" preserveAspectRatio="xMidYMax" fill="none">
            <path d="M16 21.5C16 19.25 16 18.6 16 15C16 7 11.75 3 7.5 3C3.2503 3 2 6.5 2 8C2 9.5 3.2503 13 7.5 13C10.5 13 16 12 16 2V0" stroke="#ff9800" stroke-width="2" stroke-linecap="round"/>
        </symbol>
    </defs>
    <use href="#swirl" x="0" y="0" width="21" height="100%" />
    <rect x="15" y="0" width="2" height="100%" rx="1" fill="#ff9800" />
</svg>
```

  


然而，实际上我们并不希望我们的矩形延伸到 SVG 的完整 `100%` 高度。理想情况下，它应该在涡旋开始的地方停止。

  


在 SVG 中，你无法从底部开始定义坐标，但我们可以巧妙地使用 CSS 来达到所需的效果。通过将矩形的高度设置为 `100% - 24px`，我们确保它只达到涡旋的上方。这个调整可以直接在 SVG 的代码中进行。

  


```XML
<svg width="21" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
        rect {
            height: calc(100% - 24px);
        }
    </style>
    <defs>
        <symbol id="swirl" width="21" height="25" viewBox="0 0 21 25" preserveAspectRatio="xMidYMax" fill="none">
            <path d="M16 21.5C16 19.25 16 18.6 16 15C16 7 11.75 3 7.5 3C3.2503 3 2 6.5 2 8C2 9.5 3.2503 13 7.5 13C10.5 13 16 12 16 2V0" stroke="#ff9800" stroke-width="2" stroke-linecap="round"/>
        </symbol>
    </defs>
    <use href="#swirl" x="0" y="0" width="21" height="100%" />
    <rect  x="15" y="0" width="2" height="100%" rx="1" fill="#ff9800" />
</svg>
```

  


至此，我们成功地创建了一个响应式的 SVG，它可以调整其大小，同时始终保持涡旋环在底部，确保不会变形。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c1b24569bbf4d8195fc5dffaff05b7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=578&s=430902&e=gif&f=158&b=ffffff)

  


在我们的示例中，分别演示了使用响应式 SVG 的三种方式：

  


-   `img` 引入 SVG
-   内联 SVG
-   SVG 作为 `background-image`

  


最简单的方式之一就是将其作为内联 SVG 使用。

  


```HTML
<div class="post">
    <div class="post__avatar">
        <img src='http://i.pravatar.cc/500?img=2' alt='' />
    </div>
    <div class="post__content">
        <p>...</p>
        <p>...</p>
    </div>
    <svg class="post__connector swirl-line" width="21" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use class="swirl-line__swirl" href="#swirl" x="0" y="0" width="21" height="100%" />
        <rect class="swirl-line__line" x="15" y="0" width="2" height="100%" rx="1" fill="currentColor"/>
    </svg>
</div>


<svg class="sr-only" >
    <defs>
        <symbol id="swirl" width="21" height="25" viewBox="0 0 21 25" preserveAspectRatio="xMidYMax">
            <path d="M16 21.5C16 19.25 16 18.6 16 15C16 7 11.75 3 7.5 3C3.2503 3 2 6.5 2 8C2 9.5 3.2503 13 7.5 13C10.5 13 16 12 16 2V0" stroke="currentColor" stroke-width="2" stroke-linecap="round"  fill="none" />
        </symbol>
    </defs>
</svg>
```

  


这种方法允许你在文档开头只定义一次符号（`<symbol>`），而不是多次重复定义。此外，SVG 的样式定义可以包含在你的常规 CSS 样式表中。最好使用特定的类来应用这些样式，以避免全局影响所有 `rect` 元素。例如：

  


```CSS
.swirl-line__line {
    height: calc(100% - 24px);
}
```

  


你也可以将 SVG 代码保存为 `.svg` 文件，例如 `swirlline.svg` ，然后使用 `<img>` 引用 `swirlline.svg` ：

  


```HTML
<div class="post">
    <div class="post__avatar">
        <img src='http://i.pravatar.cc/500?img=4' alt='' />
    </div>
    <div class="post__content">
        <p>...</p>
        <p>...</p>
    </div>
    <img class="post__connector" width="21" height="80" src="https://static.fedev.cn/damo/swirlline.svg" alt="" />
</div>
```

  


请注意，对于这种方法，你必须从 SVG 中删除宽度和高度属性，而是应用它们到 `<img>` 标签中。

  


另外一种方式，就是将 SVG 转换为 Data URI，然后作为 `background-image` 属性的值：

  


```CSS
.post--reply-connection::after {
    content: "";
    background-image: url("data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Csymbol id='swirl' width='21' height='25' viewBox='0 0 21 25' preserveAspectRatio='xMidYMax' fill='none'%3E%3Cpath d='M16 21.5C16 19.25 16 18.6 16 15C16 7 11.75 3 7.5 3C3.2503 3 2 6.5 2 8C2 9.5 3.2503 13 7.5 13C10.5 13 16 12 16 2V0' stroke='%23ff9800' stroke-width='2' stroke-linecap='round'/%3E%3C/symbol%3E%3Cstyle%3E .line %7B height: calc(100%25 - 24px); %7D %3C/style%3E%3C/defs%3E%3Cuse class='swirl' href='%23swirl' x='0' y='0' width='21' height='100%25' /%3E%3Crect class='line' x='15' y='0' width='2' rx='1' height='100%25' fill='%23ff9800'/%3E%3C/svg%3E");
    background-size: 21px 100%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}
```

  


不管使用哪种方式，这个漩涡图形的连接符都可以随内容高度自动适配：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/025325e62264402d859465a06f7ddf7c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=710&s=10903731&e=gif&f=125&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/GRabGLX

  


详细代码请查看 Demo 源码！

  


## 小结

  


响应式 SVG 是现代 Web 设计中的一项强大工具，它结合了 SVG 的分辨率独立性和响应式设计的灵活性，使得图像能够在各种设备和屏幕尺寸上保持最佳显示效果。通过合理使用媒体查询、`viewBox` 和 `preserveAspectRatio` 属性，以及 JavaScript 动态调整，开发者可以创建出更加灵活和高效的 Web 图像解决方案。