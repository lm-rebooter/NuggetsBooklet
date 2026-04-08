![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/552b88e8e0074c179003beff5b59127b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=610&s=16476799&e=gif&f=158&b=181818)

  


在20世纪80年代，描边文本是一种更受欢迎的美学风格，经常出现在海报、广告和音乐封面上，成为了那个时代的标志之一。虽然现代Web设计趋向于简约和扁平化，但描边文本却有着独特的魅力，能够赋予设计作品独特的风格和个性。而如今，随着技术的不断发展，在Web开发过程中，我们可以使用CSS和SVG技术为Web上的文本添加描边效果，例如标题、商标设计和广告标语等。

  


虽然可以在CSS中创建漂亮的描边文字，但有时你可能会发现这些方法有点不可靠或难以控制，以实现你想要的结果。庆幸的是，我们可以利用SVG滤镜为文本添加描边效果。在这节课中，我将引领你深入探讨如何利用SVG滤镜技术来创建描边文字效果，并探索其在现代Web设计中的应用。

  


## 关于描边的基础知识

  


在 Web 设计或平面设计中，轮廓文字的外部部分被称为描边，内部部分被称为填充：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eaa28150e7f450a91327f58d630093b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1161&s=1155693&e=jpg&b=755dd6)

  


描边可以有与填充不同的颜色，通常称为描边颜色。此外，它的宽度（即厚度）也可以不同。在这方面类似于边框，这通常被称为描边的宽度。描边的文字可能没有填充，或者填充为透明，以便通过文字看到背景。在这种情况，文字看起来像一个轮廓：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6fe71a0ccfd4cac85d232cfa30ff921~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1140&s=526286&e=jpg&b=1a1a1a)

  


描边的一个不太明显的方面是它的对齐方式。描边就像边框一样，它位于填充区域的外部，但其位置可能会有所不同，例如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/383bc7abec264e1eabac529e80340ea9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1140&s=649117&e=jpg&b=1a1a1a)

  


-   居中（Center）：描边宽度一半在填充区之外，一半在填充区之内
-   居内（Inside）：描边宽度都在填充区域内
-   居外（Outside）：描边宽度在填充区域外

  


选择不同的对齐方式，将直接影响到描边文本的呈现效果。

  


## 实现文本描边的常见方案

  


通常情况之下，Web 开发者习惯性的选择 CSS 来给文本添加描边效果。常见的方式有：

  


-   使用 `text-shadow` 模拟描边效果
-   使用 `text-stroke` 设置文本描边效果

  


在 `text-stroke` 属性还没有得到主流现代浏览器支持之前，Web 开发者会先考虑使用 `text-shadow` 来给文本添加描边效果：

  


```CSS
h3 {
    text-shadow: 
        -0.025em -0.025em 0 #444, 
        0.025em -0.025em 0 #444,
        -0.025em 0.025em 0 #444, 
        0.025em 0.025em 0 #444;
    color: #fff;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93a9bfb120d3401aa9c4b6151579bd12~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1184&s=520781&e=jpg&b=1c61a7)

  


> Demo 地址：https://codepen.io/airen/full/YzbQgVO

  


初步看上去，这个效果还令人满意，但仔细看或者当屏幕放大时，或者 `text-shadow` 的 `x` 和 `y` 轴偏移量过猛时，不管是什么语系，文本描边会有明显的断裂感：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f97a628618941b4891c9870e6024230~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3340&h=1950&s=604284&e=jpg&b=2f61a3)

  


这可能对于追求细节的同学而言，是无法接受的！而且，使用 `text-shadow` 给文本添加描边效果有诸多的不足，比如：

  


-   不适用于具有更多边缘或曲线的文本
-   需要添加更多阴影以提供更平滑的外观
-   不能与透明填充一起使用
-   角落可能会呈现略微不同的形状

  


另一种方式就是 CSS 的 `text-stroke` 属性，它允许你在文本周围添加描边效果。`text-stroke` 属性有两个主要值：

  


-   `text-stroke-color` ：设置描边颜色
-   `text-stroke-width` ：设置描边宽度

  


```CSS
h3 {
    -webkit-text-stroke: 0.025em #444;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d515c997fb3456bb60f2b57a1911539~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1184&s=516370&e=jpg&b=1c61a7)

  


> Demo 地址：https://codepen.io/airen/full/WNBOWrR

  


它与 `text-shadow` 实现的描边效果相比，不管如何放大，描边都不会有断裂感存在，即角落不会呈现别的形状：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f278c1f3ac414d179bd88388211a3673~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1946&s=614573&e=jpg&b=2f61a3)

  


但不难发现，`text-stroke` 描边，它会占用部分填充区域，类似于居中（Center）对齐的描边类型。注意，在 CSS 中，并没有类似 `text-stroke-align` 的属性来设置描边的对齐方式。

  


`text-stroke` 属性有一个最为明显的缺陷是，当 `text-stroke-width` 的值比填充区域还要大时，将会造成文本没有填充区域，甚至描还会重叠在一起。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bbcb8f6280d46698da82d41540dd2b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1668&h=890&s=4874340&e=gif&f=147&b=17569d)

  


但可以通过 `paint-order` 属性来控制文本区域和图形绘制的填充和绘制的顺序。例如：

  


```CSS
h3 {
    -webkit-text-stroke: 0.025em #444;
    paint-order: stroke fill; /* 先描边，然后填充，然后 markers */
}
```

  


这个时候，`text-stroke-width` 如何调整，都能保证填充区域不变：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/548f520e8f114c5bb9d526884ccc512e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320&h=738&s=1665297&e=gif&f=125&b=17569d)

  


> Demo 地址：https://codepen.io/airen/full/qBGjwpG

  


`text-stroke` 属性的另一个好处是，允许你结合 `background-clip:text` 给文本设置渐变的描边效果：

  


```CSS
 h3 {
    background-image: linear-gradient(
      to bottom left in oklab,
      oklch(55% 0.45 350) 0%,
      oklch(95% 0.4 95) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: #fff;
    -webkit-text-stroke: .125em transparent;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bf93ea6fc41414d8d6600b6e4793d7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1184&s=752665&e=jpg&b=1c61a7)

  


> Demo 地址：https://codepen.io/airen/full/dyERLRx

  


需要注意的是，到目前为止，在使用 `text-stroke` 属性时，还得需要添加 `-webkit-` ，才能被主流浏览器识别！这一点，请切记！

  


对于创建描边文本，我更倾向于使用 SVG ，而不是 CSS 的 `-webkit-text-stroke` 属性。 SVG 方法是一个标准，实现的效果可以在所有浏览器中达到一致。例如：

  


```XML
<svg class="text">
    <text dx="50%" dy="1.25em">SVG 太棒了！</text>
    <text dx="50%" dy="2.5em">SVG Awesome!</text>
    <text dx="50%" dy="3.75em">SVG 素晴らしいです！</text>
    <text dx="50%" dy="5em" lang="ar">SVG رائع</text>
</svg>
```

  


```CSS
text {
    fill: #fff;
    stroke: #09cefa;
    stroke-width: 8;
    paint-order: stroke fill;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f7b1164bd284677ab53025278a4006e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1184&s=675589&e=jpg&b=050505)

  


另外，你还可以借助 SVG 的相关特性，实现更丰富的描边效果，例如：

  


-   基于 [SVG 渐变](https://juejin.cn/book/7341630791099383835/section/7354948936039137289)，实现带有渐变效果的描边
-   基于 [SVG 纹理](https://juejin.cn/book/7341630791099383835/section/7355510532712955954)，实现带有纹理效果的描边
-   基于 [SVG 的描边属性](https://juejin.cn/book/7341630791099383835/section/7349188496181887017)，例如 `stroke-dasharray` 来创建带有虚线的描边效果，以及带有动画效果的描边

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a9de7866ec44a7c9823d63677e49e61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=536&s=801655&e=gif&f=35&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/BaeZeBw

  


虽然 SVG 的 `<text> 元素`结合[ SVG 的描边属性](https://juejin.cn/book/7341630791099383835/section/7349188496181887017)，例如 `stroke` 和 `stroke-width` 可以实现丰富的文本描边效果，但它有一个致命的缺点，就是排版不够灵活。在小册的《[SVG 文本元素](https://juejin.cn/book/7341630791099383835/section/7346773005114507304)》课程中曾经阐述过，这里就不再复述！

  


庆幸的是，在 SVG 中除了上述所介绍的方案之外，我们还可以使用 [SVG 的滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)与 HTML 元素相互结合，实现丰富多样文本描边效果。更为有意思的是，SVG 滤镜除了能实现描边文本效果之外，还能实现很多吸引人的文本效果，例如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2dd8eca449e4ec88c90729b36c148f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=991&s=1677915&e=jpg&b=ebdacc)

  


接下来，我们将以 **`<feMorphology>`** 和 **`<feComposite>`** 滤镜为主，向大家展示它们是如何给文本添加描边效果的，与此同时，在课程中还会涉及到 `<feConvolveMatrix>` 、`<feOffset>` 、`<feFlood>` 、`<feMerge>` 以及[上节课介绍过的 `<feColorMatrix>` 滤镜](https://juejin.cn/book/7341630791099383835/section/7368318058076569638)。

  


> 特别声明，如果你还没来得及阅读前面的课程就到了这里，个人建议你先返回去阅读小册中《**[初探 SVG 滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)**》课程的内容，这将能帮助你对 SVG 滤镜有一个初步的，全面的认识。也易于帮助你更好的理解接下来的内容！

  


## `<feMorphology>` 滤镜

  


在计算机图形学和图像处理领域，形态学（Morphology）是指对图形或图像进行操作，以改变其形状或结构的一种技术。这意味着，它将改变物体的形状或形式。

  


SVG 的 `<feMorphology>` 滤镜元素作用于物体的形态。它提供了两种预定义的形态变换：`dilate` （即“膨胀”，也称为加厚或扩展）和 `erode` （即“侵蚀”，也称为变薄或缩小），这两个类型是通过其 **`operator`** ****属性来设置。换句话说，`<feMorphology>` 滤镜可以用来扩展或缩小元素：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9338858856b472abb3823094effbff8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1400&h=740&s=2230328&e=gif&f=141&b=f3f3f3)

  


> URL:https://yoksel.github.io/svg-filters/#/

  


正如你所看到的，使用此滤镜，可以使目标源（例如文本）变粗或变细。

  


`<feMorphology>` 滤镜除了 `operator` 属性之外，还有以下几个主要属性：

  


-   **输入源（** **`in`** **）** ：如果未指定，则为 `SourceGraphic` （原始图形元素）或前一个滤镜的输出结果
-   **半径值（** **`radius`** **）** ：如果只有一个值，则表示 `x` 和 `y` 相等；如果有两个值，则分别指定 `x` 轴和 `y` 轴
-   **输出名称（** **`result`** **）** ：如果未指定，则为滤镜的最终结果或下一个滤镜的输入值

  


我们先来聊 `operator` 。从技术上说，`operator` 提供的两种操作（`dilate` 和 `erode`）都是在像素级别上运行，`dilate` （膨胀）是将一个像素扩展到其邻近像素上，而`erode` （侵蚀）则相反，它会侵蚀掉像素边缘的邻近像素。这两种操作都会影响像素边缘的描边效果。

  


膨胀（`dilate`）和侵蚀（`erode`）的程度由“半径”（`radius`）参数决定。半径参数越大，膨胀或侵蚀的效果就越明显。简单来说，半径参数控制了有多少邻近像素会参与到膨胀或侵蚀的过程中，从而决定了最终图像的变化程度。

  


你可以将形变半径（`radius`）理解为一个圆或椭圆的半径；从输入像素开始，位于该半径确定的圆内的任何邻近像素都将算作邻近像素，并将在膨胀或侵蚀效果中使用。

  


但实际上，半径（`radius`）定义了一个结构元素的内核大小，它更像是一个 `3 x 3` 矩阵，其宽度和高度由 `radius` 属性中指定的像素数决定。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa9baa9fa1294a6499b3dce4942ac62b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=991&s=325175&e=jpg&b=fefefe)

  


如上图所示，输入图像是由一系列 `0` 和 `1` 组成的二值化矩阵，`1` 表示白色像素，`0` 表示黑色像素。图中的左则是侵蚀操作前的二值化图像，右侧是侵蚀操作后的二值化图像。可以看到，白色区域被侵蚀掉了一部分，只有中心的几个白色像素保留了下来。边缘的白色像素被“侵蚀”掉，变成了黑色像素。

  


其实，我们在实际使用 `<feMorphology>` 滤镜时，不需要理解这么多。你只要知道可以向 `<feMorphology>` 的 `radius` 属性设置一个或两个值，这将决定你的元素被侵蚀或膨胀的程度。

  


我们来看一个简单的示例，使用 `<feMorphology>` 分别定义了名为 `dilate` 和 `erode` 的滤镜，它们对应着 `<feMorphology>` 滤镜的 `operator` 操作符，并且将半径设置为 `3` ：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="erode">
            <feMorphology operator="erode" radius="3"  in="SourceGraphic" result="ERODE" />
        </filter>
        <filter id="dilate">
            <feMorphology operator="dilate" radius="3"  in="SourceGraphic" result="DILATE" />
        </filter>
    </defs>
</svg>
```

  


分别将它们应用于图像和文本元素上：

  


```CSS
.dilate {
    filter:url('#dilate');
}

.erode {
    filter:url('#erode');
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/394e71cf94d44ccb9d79cc13de5119d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=991&s=1514396&e=jpg&b=070707)

  


你会发现，当 `<feMorphology>` 滤镜作用于图像时，会产生两个结果：

  


-   如果使用 `dilate` （膨胀）操作符，图像尺寸会变大（上图左侧所示）；如果使用 `erode` （侵蚀）操作符，图像尺寸会变小（上图右侧所示）
-   不管使用哪种操作符，图像看上去长满了很多斑点，整个图像失去了原有的细节

  


除了这两点之外，你可能还注意到了，`dilate` 和 `erode` 还会导致颜色的差异，其中 `dilate` 会产生亮色像素 输出，而 `erode` 则会产生深色像素输出。这是由于以下原因所产生：

  


-   `erode` （默认值）将每个像素的每个通道设置为其邻居中最暗或最透明的值匹配，分别针对于 RGBA 每个通道
-   `dilate` 将每个像素的每个通道设置为与其邻居中最亮或最不透明的值匹配，分别针对于 RGBA 每个通道

  


抛开技术细节不谈，如果将 `<feMorphology>` 滤镜应用于图像上，几乎会产生相同的结果：图像缩小（`erode`）或放大（`dilate`），并且图片会失去细节。

  


然而，`<feMorphology>` 滤镜应用于文本（纯色或渐变色文本）上时，它只会使文本缩小或放大——不会发生明显的颜色变化。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44209fd7b2514d9886af0752ea1910af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=991&s=1501971&e=jpg&b=0e4875)

  


你可以尝试着拖动示例中的滑块，改变 `<feMorphology>` 元素的 `radius` 值，查看滤镜对于图像和文本带来的变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2420af10a84e48818e64774c9d672c14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=850&s=14116911&e=gif&f=116&b=6faeec)

  


> Demo 地址：https://codepen.io/airen/full/LYoLwPX

  


请暂时记住 `<feMorphology>` 应用于文本上的效果，它可以使用文本加粗或变细。一旦使用 `<feMorphology>` 加粗或缩小文本，它可以用作其他滤镜的输入（`in`），从而允许我们按照应有的方式创建文本轮廓。

  


需要知道的是，仅使用 `<feMorphology>` 滤镜是无法直接给文本添加描边效果，我们还需要应用其他滤镜（例如 `<feComposite>` ）才能实现文本描边效果。

  


## `<feComposite>` 滤镜

  


[我们快速回忆一下 `<feComposite>` 滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273#heading-15)。它是一个合成两个元素的滤镜。它可以通过各种操作，将两个图像（即 `in` 和 `in2` ）合成在一起。其合成操作方式（`operator`）主要有：

  


-   应用 Porter-Duff 合成操作之一：`over`、`in`、`atop`、`out`、`xor`、`lighter`
-   应用一个分量级的算术运算（`arithmetic`），其结果会限制在 `0 ~ 1` 范围内

  


即 `operator` 可以使用 `over` （默认值）、`in`、`out`、`atop`、`xor` 和 `lighter` 等关键词，不同值的合成方式如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33d79fe6925646fdac8c25859cea7aee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2452&h=1164&s=291923&e=jpg&b=042021)

  


`operator` 为 `arithmetic` 时，`<feComposite>` 滤镜可以通过 `k1` 、`k2` 、`k3` 和 `k4` 等属性来设置合成操作。

  


接下来，我们主要会使用 `out` 和 `xor` 。

  


## SVG 滤镜制作文本描边

  


现在，让我们结合 `<feMorphology>` 和 `<feComposite>` 滤镜创建带有轮廓的文本（即文本描边）。我们将一步一步地进行。下图是我们将要实现的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb0cbc456b964b14877e8d9b1bfb7fb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1261&s=803573&e=jpg&b=224edf)

  


> Demo 地址：https://codepen.io/airen/full/dyEzoyG

  


首先，我们在 SVG 中创建一个名为 `#outline` 的滤镜，起初在 `<filter>` 元素中没有任何滤镜基元：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <!-- 没有任何滤镜基元 -->
        </filter>
    </defs>
</svg>
```

  


在 CSS 中通过 `filter` 属性将 `#outline` 滤镜应用于需要实现文本描边的元素上：

  


```CSS
h3 {
    filter: url("#outline");
}
```

  


接下来，我们往 `<filter>` 元素中添加第一个滤镜基元，即 `<feMorphology>` ，并且将其 `operator` 属性设置为 `dilate` ，使文本变粗，具体要变粗多少取决于你想要的描边厚度。如果你想要一个 `2px` 的描边厚度，只需要将 `<feMorphology>` 的 `radius` 设置为 `2` 。注意，为了保持文本描边厚度一致，需要将 `radius` 属性的 `x` 和 `y` 值保持一致。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology in="SourceGraphic" operator="dilate" radius="2" result="DILATED" />
        </filter>
    </defs>
</svg>
```

  


注意，请不要忘记给 `<feMorphology>` 设置一个 `result` 值，因为接下来的滤镜需要引用 `result` 值。个人建议，在使用 SVG 滤镜时，最好养成一个给每个滤镜基元设置 `result` 值的习惯。

  


你可能已经猜到了，上面的代码会使文本变粗：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f269a3aad6841509b3f213f4a2ef59d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=724&s=2069203&e=gif&f=144&b=1b48da)

  


为了实现目标效果（一个镂空的，只有描边的文本效果），我们需要将原始文本与膨胀之后的文本合成在一起，这样只有膨胀文本（额外的 `2px`）的边缘可见，从而使它们看起来像镂空的描边文本。

  


我们使用 `<feComposite>` 滤镜来实现。将 `<feMorphology>` 滤镜的 `result` 属性的值（`DILATED`）作为 `<feComposite>` 滤镜的第一个图像输入源（`in`），并且将原始文本（`SourceGraphic`）作为第二个图像输入源（`in2`），同时设置 `operator` 的值为 `out` ，这样就可以去除重叠的原始文本部分：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology in="SourceGraphic" operator="dilate" radius="2" result="DILATED" />
            <feComposite in="DILATED" in2="SourceGraphic" operator="out" />
        </filter>
    </defs>
</svg>
```

  


这样就实现了我们想要的文本描边效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d46514b4f5c04d04b6153473820f99bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1261&s=803573&e=jpg&b=224edf)

  


> Demo 地址：https://codepen.io/airen/full/dyEzoyG

  


注意，你也可以将 `<feComposite>` 滤镜的 `operator` 设置为 `xor` ，将两者不重叠的部分进行合并。

  


再来看 `<feMorphology>` 的 `operator` 为 `erode` (侵蚀)又是如何制作文本描边：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology operator="erode" radius="2" in="SourceGraphic" result="ERODE" />
            <!-- <feComposite in="ERODE" in2="SourceGraphic" operator="out" /> -->
        </filter>
    </defs>
</svg>
```

  


上面代码中，我先把 `<feComposite>` 滤镜注释掉了。现在，`<feMorphology>` 将文本变细了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e75ad10385e46bc95475d04d843c047~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=724&s=2430593&e=gif&f=148&b=1b48da)

  


你可能会认为直接去掉示例代码中的注释，即可实现文本描边效果。意外是，并不能。当 `<feMorphology>` 滤镜操作符为 `erode` （侵蚀）时，文本变细了。这意味着文本会向内侵蚀 `radius` 的距离。

  


此时，即使通过 `<feComposite>` 滤镜，将前一个滤镜的结果（`ERODE`）设置为 `in` ，原始文本设置为 `in2` ，使两个元素进行合成操作。与之前不同的是，膨胀是向外扩展 `radius` 的距离，`<feComposite>` 需要将两者重叠的部分进行合并，使文本只有描边轮廓存在；而侵蚀则是向内收缩 `radius` 的距离，`<feComposite>` 需要将两者不重叠的部分进行合并，因此要将 `operator` 设置为 `xor` ，才能实现文本描边的效果（继续设置 `out` 则屏幕上是空白的）：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology operator="erode" radius="2" in="SourceGraphic" result="ERODE" />
            <feComposite in="ERODE" in2="SourceGraphic" operator="xor" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d49c113eabcf4906843c56aa3614d8ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1261&s=784532&e=jpg&b=224edf)

  


> Demo 地址：https://codepen.io/airen/full/MWdveMo

  


你可能已经发现了，上面两个示例所实现的文本描边效果都是镂空的，如果你想通过它们实现带有填充颜色的文本描边效果，相对而言还是比较棘手的。虽然 `<feComposite>` 滤镜的 `operator` 操作符设置为 `lighter` 时，可以实现填充文本描边，但你无法控制文本填充的颜色。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9624842f1f9247fc98a4ca32d5933245~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1089&s=880291&e=jpg&b=224edf)

  


你可以尝试着在下面的的示例中，调整 `<feMorphology>` 和 `<feComposite>` 滤镜的 `operator` 以及 `<feMorphology>` 滤镜的 `radius` ，查看这些参数对文本最终效果的影响：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7385dc5e22d24a8c974c734444256f24~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=594&s=6859147&e=gif&f=519&b=1c48d8)

  


> Demo 地址：https://codepen.io/airen/full/wvbqzBM

  


如果你足够仔细的话，你会发现，`<feMorphology>` 滤镜的操作符为 `erode` （侵蚀）时，它的效果与 CSS 的 `-webkit-text-stroke` 以及 SVG 的 `<text>` 元素的 `stroke-width` 所设置的描边效果最接近，前提是没有显式设置 `paint-order` 属性改变绘制顺序。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e1ee85ee5e404fa01589a4a294ebf4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1089&s=880875&e=jpg&b=224edf)

  


> Demo 地址：https://codepen.io/airen/full/oNRezxm

  


正如你所看到的，`<feMorphology>` 和 `<feComposite>` 滤镜创作镂空文本描边效果是一个很不错的选择。不过，我们很多时候需要的并不是镂空文本描边。这个时候，它们的结合就比较吃力了。

  


庆幸的是，[SVG 滤镜提供了 17 种不同的滤镜基元](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)，我们可以在 `<feMorphology>` 和 `<feComposite>` 的基础上追加其他的滤镜基元，比如 `<feFlood>` 和 `<feMerge>` ：

  


-   `<feFlood>` 滤镜基元用于生成一个填充指定颜色的图像。它通常与其他滤镜元素结合使用，以创建各种视觉效果。它的`flood-color` 属性可以指定填充颜色，`flood-opacity` 属性可以指定填充颜色的不透明度
-   `<feMerge>` 滤镜基础用于将多个输入图像合并成一个。它包含多个 `<feMergeNode>` 子元素，每个 `<feMergeNode>` 代表一个要合并的输入图像。合并顺序是按子元素的顺序进行的。

  


我们来看下面这个效果，它是使用多个滤镜基元结合在一起实现的文本描边效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b450ddff6914923a45ba25d7310cb46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1019&s=780195&e=jpg&b=688801)

  


> Demo 地址：https://codepen.io/airen/full/VwOzKmO

  


同样的，我们先从 `<feMorphology>` 开始，使用膨胀，将文本变粗：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DILATE" />
        </filter>
    </defs>
</svg>
```

  


与前面示例不同的是，`<feMorphology>` 滤镜的输入图像 `in` 设置为 `SourceAlpha` ，它将获取文本的 Alpha 通道值——即文本的黑色版本。在这种情况下，不管文本的 `color` 是什么值，它都将会变成黑色。正如前面的示例所示，如果你期望文本描边颜色与 `color` 属性始终保持一致，则需要将输入源设置为 `SourceGraphic` 。

  


这个时候，上面代码呈现的结果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f6816bc4ed1436aa10a5832909f7e18~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=572&s=1427246&e=gif&f=148&b=527b01)

  


文本由蓝色变成了黑色，并且向外扩展了 `4px` 。

  


接着，我们将使用 `<feFlood>` 滤镜，将滤镜区域填充为所需的颜色，例如 `#41e0eb` ，并且将 `<feMorphology>` 滤镜的结果 `DILATE` 作为该滤镜的图像输入源（即 `in` 的值），与此同时，把它的结果命名为 `NAVY` 。因为它需要作为其他滤镜的图像输入源。代码如下：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DILATE" />
            <feFlood flood-color="#41e0eb" flood-opacity="1" result="NAVY" />
        </filter>
    </defs>
</svg>
```

  


这个时候，滤镜区域都填充了 `#41e0eb` ，将看不到任何文本内容：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d689fbf7c68649179e92fe6284f831b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=628&s=910816&e=gif&f=121&b=3ad7e8)

  


不用着急，我们只需要使用 `<feComposite>` 滤镜对 `DILATE` （`<feMorphology>` 滤镜的结果）和 `NAVY` （`<feFlood>` 滤镜的结果）进行合成操作。其中，将 `NAVY` 作为 `<feComposite>` 滤镜的第一图像输入源（`in`），`DILATE` 作为它的第二图像输入源（`in2`），并且将其操作符 `operator` 设置为 `in` 。注意，同样将 `<feComposite>` 滤镜的结果命个名，如 `OUTLINE` ：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DILATE" />
            <feFlood flood-color="#41e0eb" flood-opacity="1" result="NAVY" />
            <feComposite in="NAVY" in2="DILATE" operator="in" result="OUTLINE" />
        </filter>
    </defs>
</svg>
```

  


现在的结果是，只有与膨胀文本相交的填充颜色才会被渲染，并与该文本混合，从而文本变成了 `<feFlood>` 滤镜设置的填充色，即 `#41e0eb` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/817eed015df64955a58904b9add4adf2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=622&s=1763157&e=gif&f=151&b=527b00)

  


现在离目标效果只差一步了。

  


为了创建文本描边效果，我们将原始文本叠加在膨胀文本之外，这样只有膨胀文本（额外的 `4px` ）的边缘会在原始文本后面可见，从而使用它们看起来像描边。这个叠加的动作，我们可以使用 `<feMerge>` 滤镜来完成，它可以将文本叠回在其轮廓（膨胀文本）之上。

  


简单地说，在最后一步中，我们使用 `<feMerge>` 滤镜将 `<feFlooad>` 生成的彩色文本与原始文本相互叠加，最终得到我们想要的文本描边效果：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DILATE" />
            <feFlood flood-color="#41e0eb" flood-opacity="1" result="NAVY" />
            <feComposite in="NAVY" in2="DILATE" operator="in" result="OUTLINE" />
            <feMerge>
                <feMergeNode in="OUTLINE" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90506c601a5e4eb18dfc8211092cef8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1019&s=780195&e=jpg&b=688801)

  


> Demo 地址：https://codepen.io/airen/full/VwOzKmO

  


如此一来，我们就通过 SVG 滤镜分别实现了镂空描边文本（也称凹陷文本）效果，这意味着文本的内部被“雕刻出来”，这样你就可以通过轮廓看到其背后的背景。另外一种效果就是上面实例所展示的效果，即文本和描边都带有颜色。

  


除此之外，文本还可以是带有渐变颜色的文本，SVG 滤镜只用于描边，例如下面这个效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bbb666a28704c91a90b36c8f59e2516~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1132&s=869281&e=jpg&b=688800)

  


> Demo 地址：https://codepen.io/airen/full/MWdvbXM

  


就这个效果而言，我们使用还是同一个滤镜：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="outline">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DILATE" />
            <feFlood flood-color="#41e0eb" flood-opacity="1" result="NAVY" />
            <feComposite in="NAVY" in2="DILATE" operator="in" result="OUTLINE" />
            <feMerge>
                <feMergeNode in="OUTLINE" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


不同之处是，通过 CSS 给文本设置了一个渐变效果：

  


```CSS
h3 {
    color: #2F3791;
    filter: url('#outline');
    background: linear-gradient(45deg, #e3ca2b, #e11212);
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

  


与此同时，我还发现个非常有意思的效果，SVG 滤镜作于元素上时，它不仅仅影响的是元素的内容（例如文本）。当我们给 `h3` 元素设置 `border` 、`box-shadow` 、`text-shadow` 和 `outline` 时，也会受到滤镜的影响：

  


```CSS
h3 {
    filter: url('#outline');
    background: linear-gradient(45deg, #e3ca2b, #e11212);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    border-radius: .2em;
    outline: 4px solid #FF5722;
    outline-offset: 16px;
    border: 4px solid;
    box-shadow: 0 0 .5em .5em rgb(120 120 120 / .5);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c72b5197372425da107f39751f7a523~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1001&s=1144777&e=jpg&b=6a8904)

  


> Demo 地址：https://codepen.io/airen/full/xxNLRaO

  


这是因为滤镜是在所有其他 CSS 效果之后应用的，除了剪切和遮罩。这意味着，如果你想一个不随滤镜变色的阴影，你需要单独 SVG 滤镜相关的滤镜基元来实现。这个后面会有课程专门阐述。但有的时候，它也能让你获得意外的收获，例如上图中的 `border` 和 `ouline` 边框效果。

  


## 其他文本效果

  


虽然我们这节课的主题是：使用 SVG 滤镜给文本添加描边效果。但我想告诉大家的是，SVG 滤镜不仅限于用于制作描边文本效果。它还可以与 CSS 相关的特性结合起来制作一些更有创意，更丰富的文本效果。例如下面这几个由 [@Ana Tudor](https://codepen.io/thebabydino) 提供的文本效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dd900b64c7848919fb9d7c9c7202714~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3328&h=1638&s=1638318&e=jpg&b=043448)

  


> Demo 地址：https://codepen.io/thebabydino/full/bGJvOmr

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/538eee87cd664f3bac209c4a48ffb6dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1614&s=502344&e=jpg&b=f1b7da)

  


> Demo 地址：https://codepen.io/thebabydino/full/YzMMNKE

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cfe500f556f4feca1f2c87fb1de1667~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3320&h=1648&s=758718&e=jpg&b=e16a6e)

  


> Demo 地址：https://codepen.io/thebabydino/full/PogJybr

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb416ff8cfe0478aa8cc95f134198cf8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3336&h=1620&s=442569&e=jpg&b=ca9e72)

  


> Demo 地址：https://codepen.io/thebabydino/full/LYvzmLW

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25db015b4258413688d740cc8eda2ce7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3342&h=1640&s=1149548&e=jpg&b=66a6a0)

  


> Demo 地址：https://codepen.io/thebabydino/full/ZEZXaZZ

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc2f1638d687466ebbd352c77601a744~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3328&h=1624&s=952574&e=jpg&b=fdf0cc)

  


> Demo 地址：https://codepen.io/thebabydino/full/QWPqQpN

  


这些效果看上去似乎很复杂，但掌握了 SVG 滤镜基元的应用以及相关的技巧，实现这些效果并不复杂。

  


需要知道的是，当你面对一个 SVG 滤镜创建的复杂效果时，首先不要慌张，只需要将最终结果分解为较小的操作（每个小操作对应一个滤镜基元创建的效果），然后使用一个操作的结果作为另一个操作的输入，最终合并我们创建的所有层，就可以实现最终看似复杂的效果。

  


我们以下图这个效果为例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27cbf6601657437f893f3167229646ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=1886181&e=jpg&b=07635a)

  


> Demo 地址：https://codepen.io/airen/full/KKLvapP

  


为了更好地理解和实现这种效果，我们可以将其分解成几个基本构件：

  


-   橙红色文字：这是效果的基础层，表示最终要呈现的文字
-   红色偏移：这个效果模拟了文字的立体感，类似于文字的后面有阴影的效果
-   透明间隙：在橙红色文本和红色阴影之间有一个透明的间隙，使得两者之间有一定的分离感
-   文字的粗糙、风化效果：橙红色文字具有粗糙、风化的外观，增加了整体效果的视觉冲击力

  


整个效果是通过多个小模块（滤镜基元）来构建。每个构件是由一组或多组滤镜基元构成的，这些滤镜基元组合成一个统一的输出。这个效果的构建过程如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dcb0c2de7164a6ebae4652b9cab5658~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=3396&s=1938327&e=jpg&b=056259)

  


接下来，我们一步一步来实现上图中的每个构件。

  


首先准备输入源，它其实就是一个 HTML 元素，并且在 CSS 中使用 `fiter` 属性引用 SVG 的 `<filter>` 定义的滤镜。

  


```HTML
<h3>SVG Awesome!</h3>

<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 这个滤镜什么都还没开始做 -->
        </filter>
    </defs>
</svg>
```

  


```CSS
h3 {
    transform: rotate(-12deg);
    font: 900 140px/1 "Racing Sans One", cursive;
    color: #FF5722;

    text-align: center;
    filter: url("#filter");
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78c3ebe4dc4b402891b2cd74f55ed231~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=245631&e=jpg&b=ffffff)

注意，接下来，我们要往 `<filter>` 元素中添加多个滤镜基元，相比之前的案例，这个滤镜会复杂得多。这意味着，我们在制作一个复杂的滤镜过程中，可能会添加和删除滤镜规则，改变滤镜基元出现的先后顺序和值。在这个过程中很可能会使自己迷失方向。因此，我们在使用滤镜时，就要养成一些好的习惯，或制定一些规则，有助于自己跟踪发生的事情，避免在混乱的场景中迷失自我。

  


当然，这些规则不一定适合你，但可以给你提供制定规则的一些方向和思考。例如：

  


-   分组：可以根据滤镜基元分成不同的模块组，例如边框（`BORDER`）、填充（`FILL`）、斜角（`BEVEL`）等，并且尽可能的在代码中添加注释
-   命名：良好的命名约定有助于你构建滤镜并跟踪滤镜基元内外发生的事情。命名规则可以根据自己的习惯来定义，比如 `BEVEL_10` 、`FILL_20` 等，它们命名模式是 `NAME-OF-GROUP_order-number` 。我个人比较喜欢用大写字母来给滤镜基元的结果命名
-   始终为每个滤镜基元指定一个 `in` 和 `result` ，尤其是 `result` 。在 SVG 中，如果省略 `result` 属性值，那么它就会是其后继者的输入。这在一定程度之上，使滤镜效果不如你预期，而且也难以被发现

  


接下来，给滤镜准备相关的“素材”，例如流程图上最左侧和最右侧所示。需要一个填充颜色和纹理。在 SVG 滤镜中，可以使用 `<feFlood>` 滤镜创建：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
        </filter>
    </defs>
</svg>
```

  


`<feFlood>` 会创建一个 `#f00e0e` （红色）矩形，该矩形的大与滤镜区域相同：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3594cd28ced4756ad61cfe04d9ade8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1090&h=590&s=417266&e=gif&f=106&b=ffffff)

  


这个 `COLOR-red` 填充区域暂时先放着，为了不影响接下来可看到的效果，你可以先把整个 `<feFlood>` 滤镜注释掉。

  


与准备红色填充区域类似，[使用 `<feTurbulence>` 滤镜准备一个纹理图案](https://juejin.cn/book/7341630791099383835/section/7366549423746187273#heading-7)，它的输出与 `<feFlood>` 类似，是一个与滤镜区域大小相同的矩形，不同的是，填充的是嘈杂的、无结构的纹理：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e614a94cc074cbe8230b4dc8ef78fee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=586&s=4228393&e=gif&f=103&b=fbf9f9)

  


注意，这个滤镜基元很耗性能，它的属性值的设置直接会影响滤镜的性能，因此在使用的时候请慎用！

  


另外，默认情况下，`<feTurbulence>` 滤镜输出的是一个带有颜色的纹理（如上图所示）。这可能不是你想要的纹理效果，你可能需要一个灰度 Alpha 图，稍微增加一点对比度会更好。[我们可以使用上一节课介绍的 `<feColorMatrix>` 滤镜](https://juejin.cn/book/7341630791099383835/section/7368318058076569638)来调整纹理图案的颜色，比如增加对比度，将其转换为一个灰色的纹理：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
        </filter>
    </defs>
</svg>
```

  


注意，`<feColorMatrix>` 滤镜的输入源（`in`）是 `<feTurbulence>` 滤镜的输出结果（`result`），即 `FRACTAL-TEXTURE_10` 。这时候你看到的纹理一个灰色的纹理，不再是彩色纹理：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/223c6e4f6fc74a4a97d106eba6563d49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=586&s=2065609&e=gif&f=126&b=fdfdfd)

  


正如你所看到的，到目前为止，这几个滤镜基元创建的效果并没有应用于文本上。这就相当于你在厨房炒菜一样，菜你备好了，也切好了，但还没有下锅开始炒。你就无法吃到美味可口的菜。

  


现在，我们将根据流程图中间那条线往下创作。首先，使用 `<feMorphology>` 滤镜基元使文本变粗：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
            <!-- 使文本变粗 -->   
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="STROKE_10" />     
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d689debdf4043238daee48f3ecc0771~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=143220&e=jpg&b=ffffff)

现在文本是变粗了，但整个文本并没有任何立体感。而目标效果是一个带有 3D 立体感的文本。

  


在 SVG 中，[可以使用 `<feConvolveMatrix>` 滤镜基元使文本具有 3D 视觉效果](https://juejin.cn/book/7341630791099383835/section/7366549423746187273#heading-10)。它通过定义一个矩阵（也称为卷积核或滤波器）来操作图像的像素值，从而实现各种效果，例如模糊、锐化、边缘检测等，甚至可以让文本看起来有 3D 凸出的效果。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
            <!-- 使文本变粗 -->  
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="STROKE_10" />
            <!-- 使文本凸起，具有 3D 立体感 -->
            <feConvolveMatrix  
                kernelMatrix="
                    1 0 0 0 0 0 0 0 0
                    0 1 0 0 0 0 0 0 0
                    0 0 1 0 0 0 0 0 0
                    0 0 0 1 0 0 0 0 0
                    0 0 0 0 1 0 0 0 0
                    0 0 0 0 0 1 0 0 0
                    0 0 0 0 0 0 1 0 0
                    0 0 0 0 0 0 0 1 0
                    0 0 0 0 0 0 0 0 1" 
                order="9,9" divisor="1" in="BEVEL_10" result="BEVEL_20" />      
        </filter>
    </defs>
</svg>
```

  


`<feConvolveMatrix> 是所有滤镜中最复杂的一个`，这里简单解释一下：

  


-   **`order="9,9"`** ： `order` 定义了卷积核的维度。在这里，`order="9,9"` 表示一个 `9 x 9` 的矩阵
-   **`divisor="1"`** ： `divisor` 用于归一化卷积运算的结果。`divisor="1"` 意味着卷积结果不会进行任何缩放
-   **`kernelMatrix`**： 这个属性包含了实际的卷积核矩阵的值。在这里，`kernelMatrix` 被定义为一个 `9 x 9` 的单位矩阵，其中对角线上的元素为 `1`，其余元素为 `0`

  


现在，你看到的文本是具有 3D 立体效果的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e7c0ca27124c63a6304f0f487ad8dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=134742&e=jpg&b=ffffff)

紧接着，我们使用 `<feOffset>` 对 `<feConvolveMatrix>` 滤镜的输出结果 `BEVEL_20` 进行偏移处理，使其与文本之间有一定的间隔：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
            <!-- 使文本变粗 -->  
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="STROKE_10" />
            <!-- 使文本凸起，具有 3D 立体感 -->
            <feConvolveMatrix  
                kernelMatrix="
                    1 0 0 0 0 0 0 0 0
                    0 1 0 0 0 0 0 0 0
                    0 0 1 0 0 0 0 0 0
                    0 0 0 1 0 0 0 0 0
                    0 0 0 0 1 0 0 0 0
                    0 0 0 0 0 1 0 0 0
                    0 0 0 0 0 0 1 0 0
                    0 0 0 0 0 0 0 1 0
                    0 0 0 0 0 0 0 0 1" 
                order="9,9" divisor="1" in="BEVEL_10" result="BEVEL_20" />    
            <!-- 对 BEVEL_20 做偏移处理 -->
            <feOffset dx="4" dy="4" in="BEVEL_20" result="BEVEL_25" />          
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72d7eb6ca7684fa29f90de4c1c215e31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=582&s=714402&e=gif&f=387&b=ffffff)

  


到这里，大部构件都已制作完。接下来要做的就是使用 `<feComposite>` 将相关的图像合成在一起。例如：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
            <!-- 使文本变粗 -->  
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="STROKE_10" />
            <!-- 使文本凸起，具有 3D 立体感 -->
            <feConvolveMatrix  
                kernelMatrix="
                    1 0 0 0 0 0 0 0 0
                    0 1 0 0 0 0 0 0 0
                    0 0 1 0 0 0 0 0 0
                    0 0 0 1 0 0 0 0 0
                    0 0 0 0 1 0 0 0 0
                    0 0 0 0 0 1 0 0 0
                    0 0 0 0 0 0 1 0 0
                    0 0 0 0 0 0 0 1 0
                    0 0 0 0 0 0 0 0 1" 
                order="9,9" divisor="1" in="BEVEL_10" result="BEVEL_20" />    
            <!-- 对 BEVEL_20 做偏移处理 -->
            <feOffset dx="4" dy="4" in="BEVEL_20" result="BEVEL_25" />    
            <!-- 合成图像: BEVEL_25 和 STROKE_10 合成在一起 -->
            <feComposite operator="out" in="BEVEL_25" in2="STROKE_10" result="BEVEL_30" />      
        </filter>
    </defs>
</svg>
```

  


请注意 `<feComposite>` 滤镜中的 `in="BEVEL_25"` 和 `in2="STROKE_10"` ，它们表示将 `BEVEL_25` 作为第一输入图像源，`STROKE_10` 则是第二输入图像源。它们都是其他滤镜所产生的结果：

  


-   `BEVEL_25` 是 `<feOffset>` 对 `<feConvolveMatrix>` 进行偏移之后的结果
-   `STROKE_10` 是 `<feMorphology>` 滤镜将文本变粗之后的结果

  


所以说，给每个滤镜基元设置 `result` 属性的值是多么的重要，否则你要按照前后顺序来编写滤镜基础，甚至还不一定能让你有机会按照正确顺序编写滤镜基元。再次强调一下，请记得为你的每个滤镜基元设置 `result` 。

  


现在，效果变成下图这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3006313c94db4821a70f3f566ddd0f62~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=144180&e=jpg&b=ffffff)

离目标越来越近了！还记得之前 `<feFlood>` 和 `<feTurbulence>` 创建的素材吗？接下来，就可以用上了。我们继续使用 `<feComposite>` 滤镜，将 `<feFlood>` 创建的填充图像应用到 `BEVEL_30` ：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
            <!-- 使文本变粗 -->  
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="STROKE_10" />
            <!-- 使文本凸起，具有 3D 立体感 -->
            <feConvolveMatrix  
                kernelMatrix="
                    1 0 0 0 0 0 0 0 0
                    0 1 0 0 0 0 0 0 0
                    0 0 1 0 0 0 0 0 0
                    0 0 0 1 0 0 0 0 0
                    0 0 0 0 1 0 0 0 0
                    0 0 0 0 0 1 0 0 0
                    0 0 0 0 0 0 1 0 0
                    0 0 0 0 0 0 0 1 0
                    0 0 0 0 0 0 0 0 1" 
                order="9,9" divisor="1" in="BEVEL_10" result="BEVEL_20" />    
            <!-- 对 BEVEL_20 做偏移处理 -->
            <feOffset dx="4" dy="4" in="BEVEL_20" result="BEVEL_25" />    
            <!-- 合成图像: BEVEL_25 和 STROKE_10 合成在一起 -->
            <feComposite operator="out" in="BEVEL_25" in2="STROKE_10" result="BEVEL_30" />
            <!-- 给 BEVEL_30 上色 -->
            <feComposite in="COLOR-red" in2="BEVEL_30" operator="in" result="BEVEL_40" />      
        </filter>
    </defs>
</svg>
```

  


这个时候，文本的“阴影”部分变成了红色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c72978a86717463a8ffa21f1695dc469~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=206083&e=jpg&b=ffffff)

  


文本“凸起部分”已经是红色了，接下来，我们只需要使用 `<feMerge>` 滤镜将 `BEVEL_40` 与文本自身（`SourceGraphic`）重叠在一起，文本就会带有与 `color` 值一样的颜色：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
            <!-- 使文本变粗 -->  
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="STROKE_10" />
            <!-- 使文本凸起，具有 3D 立体感 -->
            <feConvolveMatrix  
                kernelMatrix="
                    1 0 0 0 0 0 0 0 0
                    0 1 0 0 0 0 0 0 0
                    0 0 1 0 0 0 0 0 0
                    0 0 0 1 0 0 0 0 0
                    0 0 0 0 1 0 0 0 0
                    0 0 0 0 0 1 0 0 0
                    0 0 0 0 0 0 1 0 0
                    0 0 0 0 0 0 0 1 0
                    0 0 0 0 0 0 0 0 1" 
                order="9,9" divisor="1" in="BEVEL_10" result="BEVEL_20" />    
            <!-- 对 BEVEL_20 做偏移处理 -->
            <feOffset dx="4" dy="4" in="BEVEL_20" result="BEVEL_25" />    
            <!-- 合成图像: BEVEL_25 和 STROKE_10 合成在一起 -->
            <feComposite operator="out" in="BEVEL_25" in2="STROKE_10" result="BEVEL_30" />
            <!-- 给 BEVEL_30 上色 -->
            <feComposite in="COLOR-red" in2="BEVEL_30" operator="in" result="BEVEL_40" />      
            <!-- 将 BEVEL_40 和文本自身重叠在一起 -->
            <feMerge result="BEVEL_50">
                <feMergeNode in="BEVEL_40" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3a407aadd4e41588c9f1fa625da2683~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=347277&e=jpg&b=ffffff)

  


看起来很接近期望的结果。最后一件事，继续使用 `<feComposite>` 滤镜将带有灰度的纹理 `FRACTAL-TEXTURE_20` 与上一步输出的结果 `BEVEL_50` 合成在一起，就能使文本具有纹理效果：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <!-- 创建一个带有颜色的区域 -->
            <feFlood flood-color="#f00e0e" result="COLOR-red" />
            <!-- 创建纹理 -->
            <feTurbulence baseFrequency=".05,.004" type="fractalNoise" numOctaves="4" seed="0" result="FRACTAL-TEXTURE_10" />
            <!-- 使用高阶颜色矩阵，将纹理转换为灰色的 -->
            <feColorMatrix  
                values="
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 0    0
                    0 0 0 -1.2 1.1" 
                in="FRACTAL-TEXTURE_10" result="FRACTAL-TEXTURE_20" type="matrix" /> 
            <!-- 使文本变粗 -->  
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="STROKE_10" />
            <feOffset in="STROKE_10" result="BEVEL_10" />
            <!-- 使文本凸起，具有 3D 立体感 -->
            <feConvolveMatrix  
                kernelMatrix="
                    1 0 0 0 0 0 0 0 0
                    0 1 0 0 0 0 0 0 0
                    0 0 1 0 0 0 0 0 0
                    0 0 0 1 0 0 0 0 0
                    0 0 0 0 1 0 0 0 0
                    0 0 0 0 0 1 0 0 0
                    0 0 0 0 0 0 1 0 0
                    0 0 0 0 0 0 0 1 0
                    0 0 0 0 0 0 0 0 1" 
                order="9,9" divisor="1" in="BEVEL_10" result="BEVEL_20" />    
            <!-- 对 BEVEL_20 做偏移处理 -->
            <feOffset dx="4" dy="4" in="BEVEL_20" result="BEVEL_25" />    
            <!-- 合成图像: BEVEL_25 和 STROKE_10 合成在一起 -->
            <feComposite operator="out" in="BEVEL_25" in2="STROKE_10" result="BEVEL_30" />
            <!-- 给 BEVEL_30 上色 -->
            <feComposite in="COLOR-red" in2="BEVEL_30" operator="in" result="BEVEL_40" />      
            <!-- 将 BEVEL_40 和文本自身重叠在一起 -->
            <feMerge result="BEVEL_50">
                <feMergeNode in="BEVEL_40" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
            <!-- 合成灰色纹理 -->
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/114fe8bb73414ecd8904e1ca1c2edac5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=344714&e=jpg&b=fffdfd)

  


到这里，SVG 滤镜要做的事情就完成了。为了使整体效果与我们目标效果一致，只需要 CSS 中为 `body` 添加一个背景效果：

  


```CSS
body {
    --rg:radial-gradient(0.1875em, #fff4 calc(100% - 1px), #0000);
    background: var(--rg), var(--rg) 0.5em 0.5em #066158;
    background-size: 1em 1em;
}
```

  


你看到的最终效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9a91f233de44b848fff84e4095b4ae1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1124&s=1886181&e=jpg&b=07635a)

  


> Demo 地址：https://codepen.io/airen/full/KKLvapP

  


是不是很完美！

  


那么，其他滤镜效果你都可以按这个方式来制作！感兴趣的同学可以试一下！

  


## 总结

  


虽然我们主要围绕着使用 `<feMorphology>` 和 `<feComposite>` 滤镜为你的 SVG 或 HTML 文本内容添加描边效果，但 SVG 滤镜绝仅限于制作描边效果。我们可以通过组合多个不同的 SVG 滤镜基元为文本内容添加更丰富，更具创意的效果。只不过这个过程是复杂的！

  


这也意味着，要想使用 SVG 滤镜创造出有创意，吸引人的效果（不仅限于文本），需要对 SVG 滤镜基元有足够深的认识与了解。其中有一个通用且实用的小技巧，那就是时不时的应用不同的 SVG 滤镜，调整它们的属性参数，并将这些效果记录下来。甚至还可以将多个滤镜使用不同的方式组合起来创建出其他更复杂的效果。通过这个过程，除了能帮助更好的理解和掌握 SVG 滤镜之外，还可能创造出令你感到惊艳的效果。

  


当然，这个过程你也可以借助在线工具，去调整滤镜属性参数，获取你想要的滤镜效果。例如 [SVG Filters 工具](https://yoksel.github.io/svg-filters/#/)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a649d1ee76d4cfd89ab814141a6ed02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3316&h=1486&s=687563&e=jpg&b=f7f7f7)

  


> URL：https://yoksel.github.io/svg-filters/#/

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec8df5db9e4c494d856660d02ac19692~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1788&s=1005226&e=jpg&b=16052a)

  


> URL:https://svgfm.chriskirknielsen.com/

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88e610f4c9904fd7934c4bc8826f6f4f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1634&h=868&s=6756299&e=gif&f=38&b=fcf9f9)

  


> URL:https://svgfilters.com/

  


最后，希望你能将你的创作或你觉得有意思的滤镜效果在评论中与大家一起分享！