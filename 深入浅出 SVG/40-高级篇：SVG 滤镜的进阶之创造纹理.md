[在上一节课的示例中](https://juejin.cn/book/7341630791099383835/section/7368318262368534578)，我们展示了如何将 `<feTurbulence>` 滤镜生成的噪声图案用作位移滤镜 `<feDisplacementMap>` 的位移图像，从而实现了引人注目的立体感扭曲效果。事实上，在 SVG 的世界里， `<feTurbulence>` 滤镜犹如一颗闪亮的明珠，为我们打开了创造丰富纹理的大门。这个滤镜不仅是一个简单的噪声生成器，更是一个神奇的工具，可以创造出独特而复杂的纹理。

  


`<feTurbulence>` 滤镜可以与其他滤镜效果结合，例如模糊（`<feGaussianBlur>`）、[高阶颜色矩阵](https://juejin.cn/book/7341630791099383835/section/7368318058076569638)（`<feColorMatrix>`）、[颜色变换](https://juejin.cn/book/7341630791099383835/section/7368318225756454962)（`<feComponentTransfer>`）和[位移](https://juejin.cn/book/7341630791099383835/section/7368318262368534578)（`<feDisplacementMap>`） ，可以创造出更加丰富多彩的视觉效果。在这节课中，我们将深入探讨 `<feTurbulence>` 滤镜基元的各种参数和技巧，带你进阶使用 SVG 滤镜，创造出令人惊叹的视觉效果。

  


通过本课程的学习，你将掌握高级的 SVG 滤镜技巧和方法，为你的设计和创意项目注入新的活力和魅力。让我们一起探索 `<feTurbulence>` 滤镜的无限可能，创造出令人惊叹的纹理效果吧！

  


## `<feTurbulence>` 滤镜简介

  


现如今，我们可以使用[现代 CSS](https://s.juejin.cn/ds/ijgrvS9y/) 相关特性制作一些简单的图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65ab9316ade44e6fa0bd1b19e06205ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=720&s=201700&e=png&b=303043)

  


> MagicPattern：https://www.magicpattern.design/tools/css-backgrounds

  


并且在 [SVG Pattern](https://juejin.cn/book/7341630791099383835/section/7355510532712955954) 的加持之下，可以制作出一些更复杂的图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ef2cfe0cf94b19a3866c36d5434f56~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3238&h=1206&s=1395445&e=jpg&b=f7f7f7)

  


> PatternMonster： https://pattern.monster/

  


但要制作出一些看起来比较自然的图案（例如模拟火焰、树丛、云朵、木纹等），几乎是不太可能。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a0b82aaf7004870bcd1bacf4e2a72f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2232&h=1261&s=565442&e=jpg&b=e1d8cf)

  


以往在 Web 的开发中，Web 上的自然质感的视觉表现通常是使用外部图像，但外部图像是额外的依赖项，它们引入了新的复杂性，例如适配、性能等。而且更换图片的内容成本也比较高，例如有一朵云的图片，想要让这个图片中的云朵随风飘动，就很难实现。

  


现在，这些问题的很大一部分可以用几行 SVG 代码来解决，那就是 SVG 滤镜中的 `<feTurbulence>` 滤镜基元。它的特殊之处在于它不需要输入任何图像，就能生成图像。它可以用来实现诸如云、火和烟等几种自然现象以及生成复杂的纹理（如大理石或花岗岩）等很多很酷的效果。

  


`<feTurbulence>` 滤镜基元正如其名“Turbulence”（湍流），会使图像生成类似紊乱、波动或湍流效果的纹理。其背后采用了一种被称为 Perlin 湍流函数算法，可以生成 Perlin 噪声。Perlin 噪声在计算机生成的图形中被广泛使用，用于创建各种纹理。

  


> [Perlin 噪声](https://en.wikipedia.org/wiki/Perlin_noise)（Perlin Noise）是一种在计算机图形学中广泛使用的渐变噪声算法，由 Ken Perlin 在 1983 年开发。它被设计用来生成自然且平滑的随机纹理，是一种伪随机函数，主要应用于纹理生成、程序化内容创作和特效制作。

  


这意味着，`<feTurbulence>` 带有创建多种类型的噪声纹理的选项，每种类型有数百万种变化。它在模拟诸如云、火焰、烟雾等几种自然现象以及生成复杂的纹理（如大理石、花岗岩、木纹、纸张等）时非常有用。使用`<feTurbulence>` 滤镜的时候，我们可以通过调整参数直观地看到效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b012aeefd34543bba6d44e8f5a5022b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=634&s=13184387&e=gif&f=303&b=f7f7f7)

  


> SVG Filters：https://yoksel.github.io/svg-filters/#/

  


需要注意的是，我们使用的是一种随机噪声生成器。因此，大多数情况下，生成纹理是一个试验和调试的过程，直到你获得满意的结果。随着经验的积累，预测纹理的外观会变得稍微容易一些。这也意味着，对于初次接触 `<feTurbulence>` 滤镜的开发者来说，通过视觉上调整其属性是理解其功能的最佳方式。

  


在接下来的内容中，我将尽可能以视觉方式解释 `<feTurbulence>` 滤镜，并提供一些交互演示，帮助大家更好地学习和掌握它。这样，你不仅可以更直观地理解每个属性的作用，还能通过实践快速上手，创造出理想的纹理效果。

  


## `<feTurbulence>` 滤镜的属性和功能

  


`<feTurbulence>` 滤镜基元类似于 `<feFlood>` ，都能为滤镜区域填充新的内容。例如：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feTurbulence 
                type="fractalNoise" 
                baseFrequency=".006" 
                numOctaves="2" 
                seed="8" 
                stitchTiles="stitch"
                in="SourceGraphic"
                result="TURBULENCE" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/147dd49cb13f44078663bcd384024aea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1050&s=298778&e=jpg&b=070707)

  


> Demo 地址：https://codepen.io/airen/full/YzbEWLY

  


与 `<feFlood>` 提供纯色填充不同，`<feTurbulence>` 生成随机噪声图案。通过调整其属性参数，可以实现从细腻的砂岩纹理到波涛汹涌的海面等各种视觉效果。它有以下五个主要属性：

  


-   **`type`** （类型）：确定噪声的类型，可以是 `turbulence` （会生成湍流效果的噪声）或 `fractalNoise` （会生成分形噪声）
-   **`baseFrequency`** （基础频率）：控制噪声的频率。低频率会生成较大的噪声波形，高频率会生成较小的噪声波形
-   **`numOctaves`**（层级数量）：也称为八度数，用于控制噪声层级数量。更多的层级会增加细节，使噪声看起来更加复杂
-   **`seed`** （种子）：设置噪声的随机种子值。不同的种子值会生成不同的噪声图案
-   **`stichTiles`** （平铺）：决定噪声图案是否在边缘拼接，以便生成平铺效果。它有两个值可选，`stitch` 会生成无缝拼接的噪声图案，`noStitch` 则不会

  


在接下来的内容中，我们将通过实际示例展示每个属性如何影响视觉效果，但不会深入研究函数的技术细节。你会发现，大多数情况下，你只面要关注其中的三个属性：`type` （类型）、`baseFrequency` （基础频率）和层数（`numOctaves`）。

  


我们先从最重要的 `baseFrequency` 属性开始！

  


### 基础频率：baseFrequency

  


`baseFrequency` 属性对于 `<feTurbulence>` 滤镜非常重要，因为它是创建图案所必需的。甚至是，`<feTurbulence>` 滤镜只需要 `baseFrequency` 属性就可以生成噪声。基础频率会影响生成的噪声大小（或比例）和颗粒度。你可以尝试着拖动下面示例中的滑块更改 `baseFrequency` 的值，并看到它如何实时影响生成的噪声：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c8ae2a180ac45f1a181402f957bba90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=680&s=5495059&e=gif&f=168&b=faf8f7)

  


> Demo 地址：https://codepen.io/airen/full/vYwWXLV

  


你会注意到，随着 `baseFrequency` 属性值的增加或减少，生成的图案会保持完整，当它变小或变大时，看起来就像是在左上角的原点放大和缩小一样。

  


较小的 `baseFrequency` 值（如 `0.001`）会生成较大的图案，而较大的值（例如 `0.5`）则会生成较小的图案。该属性的值可以从 `0` 开始向上增加，不允许使用负值，其中 `0` 表示没有频率，也就不会生成图案。另外，在 `0.01 ~ 1` 之间是一个合理的区间，并且在 `0.02 ~ 0.2` 之间内的值对于大多数纹理来说是有用的起始点。

  


注意，`<feFrequency>` 生成的噪声没有背景颜色。也就是说，你能够透过噪声看到其背景颜色。例如，你尝试着调整上面示例中 `body` 的背景颜色，所呈现的图案在视觉上也会有所不同：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e954539664d84816a89499ee16f5df98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=490&s=9820527&e=gif&f=209&b=faf7f7)

  


> Demo 地址：https://codepen.io/airen/full/bGyYwqG

  


`baseFrequency` 属性还可以接受两个值。

  


-   当你提供一个值时，则 `x` 轴和 `y` 轴定义的频率相同
-   当你提供两个值时，第一个值将用于 `x` 轴的频率，而第二个值将对应 `y` 轴频率

  


如果 `baseFrequency` 提供两个不同的值，那么会生成水平或垂直的噪声，这可以用来实现一些奇妙的噪声效果。下面这个示例，为 `baseFrequency` 属性提供了两个不同的值，并且你可以拖动滑块，调整它们的值，并注意当你给它们不同的值时，生成的图案是如何沿着 `x` 和 `y` 轴变化：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feTurbulence 
                baseFrequency=".06 .03" 
                in="SourceGraphic"
                result="TURBULENCE" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e6f00cd3e5b47fd89ff10ed5fb511ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=642&s=9212800&e=gif&f=249&b=faf8f7)

  


> Demo 地址：https://codepen.io/airen/full/MWdObKV

  


你会发现，`x` 和 `y` 频率之间差异越大，图案就会变得越“拉长”。例如，当 `baseFrequency` 值相对较小时（比如 `0.01`），将会使水平方向的图案更大（就像被拉伸了一样）。如果进一步减少它（比如到 `0.001`），你会看到水平方向的图案变得更像是线条：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/741ef073c73c4d93adfdba79bb6a7655~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1218&h=654&s=10836627&e=gif&f=136&b=fbf9f8)

  


注意，垂直方向亦是如此！

  


### 噪声类型：type

  


顾名思义，`type` 属性是用来指定 `<feTurbulence>` 滤镜生成噪声（图案）的类型。该属性有两个值可选：`turbulence` 和 `fractalNoise` 。这两个值决定了噪声的外观和生成方式：

  


-   `turbulence` 类型的噪声是指将柏林函数进行合成时，只取函数的绝对值，合成后的函数在 `0` 处不可导。它声明的是基于随机数的噪声，看起来更像是云层或者流体的运动。通常用于模拟自然界中的不规则纹理，例如水面波纹、云层或者火焰效果
-   `fractalNoise` 类型的噪声是由多个频率的噪声叠加而成的，即在原来的噪声中叠加白色噪声，让最终的结果呈现出高斯模糊的效果，看起来更加平滑且具有连续性。通常用于创建复杂的纹理，例如木纹、纸张的粗糙表面或者其他自然材质

  


你可以基于相同的频率下调整 `type` 的类型，查看生成的图案效果：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feTurbulence 
                baseFrequency=".06 .03" 
                type="turbulence"
                in="SourceGraphic"
                result="TURBULENCE" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d59062556834e9f83bf02223d48bd3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=614&s=10196321&e=gif&f=331&b=fcfafa)

  


> Demo 地址：https://codepen.io/airen/full/zYQPoPe

  


### 层级数量：numOctaves

  


`numOctaves` 根据单词“Octaves”的意思，又被称为“八度”。如果你喜欢音乐，那么“八度”这个概念对你而言，不会感到陌生。在音乐中，八度是指音高之间的关系，其中较高的音的频率是较低音的频率的两倍。即两个相邻音组中的同名音之间的音高差距是一个八度，这两个音振动图像相似，高八度的音的振动频率刚好是低八度的两倍。相关八度的两个音同时弹响的时候，可以产生细节更加丰富的音。这种概念可以帮助我们理解 SVG 滤镜 `<feTurbulence>` 的 `numOctaves` 属性。

  


在 `<feTurbulence>` 滤镜中，`numOctaves` 属性定义了在 `baseFrequency` （频率）上渲染的八度数。换句话说，`numOctaves` 主要用于指定生成噪声时叠加的噪声层数，每一层噪声的频率是前一层的两倍。这个类似于音乐中的八度，因为每个新的噪声层相当于在前一层的基础上增加了一个“八度”，即频率加倍。

  


多个八度的组合（较高的 `numOctaves` 值）可以生成更为复杂和自然的纹理。例如，`numOctaves = 1` 时只有一层基础噪声，`numOctaves = 3` 时则包含三层噪声，每一层的频率是前一层的两倍，产生的效果更为细致和复杂。

  


默认的 `numOctaves` 值为 `1`，这意味着它以基础频率渲染噪声。任何额外的八度都会使频率加倍并减半振幅。这个数字越高，其效果就越不明显。此外，更多的八度意味着更多的计算，可能会影响性能。我通常使用 `1 ~ 5`之间的值，仅用于完善图案。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feTurbulence 
                baseFrequency=".06 .03" 
                type="turbulence"
                numOctaves="3"          
                in="SourceGraphic"
                result="TURBULENCE" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc58d382fd684c02a4461d9028bf0828~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=536&s=9376626&e=gif&f=221&b=faf8f7)

  


> Demo 地址：https://codepen.io/airen/full/dyEZNyp

  


正如上图所示，随着 `numOctaves` 不断增加，生成的图像大致形状与 `numOctaves` 值等于 `1` 的时候一样，但是细节在不断增加。当 `numOctaves` 值增加到一定程度后，图像的差异就变得不太明显，具体这个值多大，与 `baseFrequency` 属性的值密切相关。

  


有一点需要知道提，`numOctaves` 值大到一定程度后，例如 `5` 或 `6` ，生成的图像就看不到明显变化，但这并不代表着 `numOctaves` 属性的值达到了某个阈值之后，八度叠加就不生效了，而是叠加之后产生的变化更加细小，需要拿个放大镜放大看了。

  


### 种子：seed

  


在 SVG 的 `<feTurbulence>` 滤镜中，`seed` 属性用于指定生成噪声的随机种子，即“伪随机数生成器的起始数字”。换句话说，它为用于生成我们的随机噪声的随机函数提供了一个不同的起始数字。注意，`seed` 属性表示的是 `<feTurbulence>` 滤镜效果中伪随机数生成的起始值，并不是随机数量。因此，不同数量的 `seed` 不会改变噪声的频率和密度，改变的是噪声的形状和位置。

  


这意味着，`seed` 属性会创建不同的噪声实例，并作为噪声生成器的起始数字，该生成器在内部生成伪随机数。如果定义了 `seed` 属性值，则会出现一个不同的噪声实例，但具有相同的特性。它非常适合添加图案的独特性。例如，可以在访问页面时生成一个随机种子（`seed`），以便每位访问者都会获得稍微不同的图案。由于一些技术细节和单精度浮点数，生成随机种子的实际区间是从 `0` 到 `9999999`。但是，这仍然是千万个不同的实例。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feTurbulence 
                baseFrequency=".06 .03" 
                type="turbulence"
                numOctaves="3"     
                seed="2"
                in="SourceGraphic"
                result="TURBULENCE" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d608849145f6490fbad4a789c1322821~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=638&s=9303923&e=gif&f=105&b=f6f2f0)

  


> Demo 地址：https://codepen.io/airen/full/bGyYgaQ

  


### 平铺：stitchTiles

  


`stitchTiles` 属性有点类似于 CSS 的 `background-repeat` 属性，主要用于控制生成的噪声图案是否可以平铺。正如规范所述，有时噪声生成的结果会在“瓷砖”边界处显示出明显的不连续性。你可告诉浏览器尝试平滑处理结果，使两个瓷砖看起来“拼接”在一起。

  


`stitchTiles` 属性可以接受两个值：`stitch` 和 `noStitch` ：

  


-   `stitch`：生成的噪声图案会在边界处平滑衔接，从而可以无缝平铺
-   `noStitch`：生成的噪声图案不会在边界处衔接，直接平铺时可能会有明显的接缝

  


我们通过下面这个示例来展示 `stitch` 和 `noStitch` 。注意，我们在四个 `.box` 元素中应用了相同的一个滤镜，这个滤镜是由 `<feTurbulence>` 滤镜生成的噪声图：

  


```HTML
<div class="boxes">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
</div>

<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
                baseFrequency=".06 .03" 
                type="turbulence"
                numOctaves="3"     
                seed="2"
                stitchTiles="noStitch"
                in="SourceGraphic"
                result="TURBULENCE" />
        </filter>
    </defs>
</svg>
```

  


使用 CSS 网格布局，将四个 `.box` 拼接在一起。此时，你可以整滤镜 `<feTurbulence>` 的 `stitchTies` 属性的值，查看四个 `.box` 的边缘连接处的噪声图案差异。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37ca431c0fa944fc896305d10f0437fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1352&h=762&s=13651805&e=gif&f=195&b=faf8f7)

  


> Demo 地址：https://codepen.io/airen/full/yLWPgGy

  


很明显，当 `stitchTiles` 属性的值为 `noStitch` 时，在各个 `.box` 元素的边界处噪声图案各自为政，因此，连接处的纹理有明显的断裂感；而 `stitch` 则不一样，它会自动调整坐标，让下一个噪声图形应用上一个噪声图形的宽高等数据，使元素连接处纹理有平滑感：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3595428ff5d347849da595a8dc72d0d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1050&s=705144&e=jpg&b=f5f1ed)

  


正如我之前提到的，你最有可能使用的只有三个属性是 `type`、`baseFrequency` 和 `numOctaves`。因此，我们将在接下来重点关注这三个属性。

  


## 案例一：制作精美图案

  


我想你现在对 `<feTurbulence>` 滤镜有所了解了，也知道每个属性的功能。但对于大部分 Web 开发者来说，依旧不知道从何下手，才能使用相关的滤镜制作出自己喜欢的图案效果。接下来，我们通过几个简单且真实的案例，向大家展示 SVG 的 `<feTurbulence>` 滤镜是如何与其他滤镜相结合，制作出精美的图案。

  


### 星空图案

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fb963323b8e48beac6ee79ec3de182c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1156&h=610&s=306091&e=gif&f=173&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/gOJXmBY

  


这是一个由 `<feTurbulence>` 和 `<feColorMatrix>` 两个滤镜基元相结合制作的一个星空图案效果。

  


-   `<feTurbulence>` 滤镜负责生成噪声图案
-   `<feColorMatrix>` 滤镜改变 `<feTurbulence>` 生所的图案的像素颜色

  


具体代码如下：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence baseFrequency=".25 .12" in="SourceGraphic" result="TURBULENCE" />
          <feColorMatrix values="
                    0 0 0 9 -5
                    0 0 0 9 -5
                    0 0 0 9 -5
                    0 0 0 0 1" in="TURBULENCE" result="STARS" type="matrix" />
        </filter>
    </defs>
</svg>
```

  


简单解释一下上面的代码。

  


首先，使用 `<feTurbulence>` 滤镜生成了一个噪声图案，在这里通过 `baseFrequency` 属性指定了噪声的基础频率，其中水平方向的基础频率是 `0.25` ，垂直方向的频率是 `0.12` 。并且将该滤镜的结果命名为 `TURBULENCE` ，方便被接下来的 `<feColorMatrix>` 滤镜引用。该滤镜生了一个大致如下图这样的噪声图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1db3bc4d8d6447abbecba0503b98b0e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1221&s=3510500&e=jpg&b=201020)

  


很显然，这并不是我们所期望的星空图案。这是一张彩色的图案，其中的点你可以想象它是夜空中的星星。但我们通常看过的星空，应该只有两种颜色，即可黑色和白色。其中黑色代表天空，白色代表最亮的星星。

  


在 SVG 中，要将一张彩色图转换为黑白图，[我们可以应用之前介绍的 `<feColorMatrix>` 滤镜来实现](https://juejin.cn/book/7341630791099383835/section/7368318058076569638)。该滤镜提供了一个高阶颜色矩阵，可以通过调整图像颜色的 RGBA 通道的值来生成所需的图像：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/032241df2abf49d592d88980334eab58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=2147&s=2567921&e=jpg&b=2c7391)

  


需要注意的是，RGBA 值是浮点数，范围从 `[0, 1]`（包括边界），而不是从 `[0, 255]` 的整数，这可能与预期的有所不同。权重可以是任何浮点数，尽管在计算结束时，任何小于 `0` 的结果将被限制为 `0`，而任何大于 `1` 的结果将被限制为 `1`。星空图案依赖于这种限制，因为它的矩阵如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54fdc97c213c425c80c7901089ba1bee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2924&h=606&s=77948&e=jpg&b=ffffff)

  


  


我们在 RGB 通道上使用相同的公式，这意味着我们生成了一幅灰度图像。这个公式将 A 通道的值乘以九，然后减去五。请记住，即使在 `<feTurbulence>` 的输出中，Alpha 值也会有所变化。大多数结果值不会落在 `0 ~ 1` 的范围内，因此它们会被限制在这个范围内。在第四行中，我们将 Alpha 通道设置为常数 `1`，意味着图像完全不透明。

  


最终 `<feColorMatrix>` 滤镜将噪声的 Alpha 通道增强并将其余部分设为黑色，从而得到星空的图案效果。

  


在此基础上，我们还可以通过 JavaScript 脚本动态调整 `<feTurbulence>` 滤镜的 `seed` 属性值，使每次刷新页面都能看到不同的星空效果。

  


### 木纹图案

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/249c714e341d49df8459e54dee7424a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=739155&e=jpg&b=ffdb9e)


  


> Demo 地址：https://codepen.io/airen/full/NWVwjQM

  


这个图案的实现与刚才的星空效果并没有太大不同。只是在噪声图案生成和颜色矩形转换上略有差异：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence baseFrequency=".002 .3" type="fractalNoise" in="SourceGraphic" result="TURBULENCE__10" />
            <feColorMatrix values="
                    0.05 0 0 0 0.95
                    0.15 0 0 0 0.65
                    0.5  0 0 0 0.15
                    0    0 0 0 1" in="TURBULENCE__10" result="TURBULENCE__20" type="matrix" />
          
        </filter>
    </defs>
</svg>
```

  


为了模仿木纹的图案，我给 `<feTurbulence>` 滤镜的 `baseFrequency` 的 `x` 轴设置了一个较小的值，`y` 轴设置了一个较大的值，创建出拉伸的噪声图案。此外，我们设置了 `type` 为 `fractalNoise` ，使噪声图案带有模糊效果。

  


使用 `<feColorMatrix>` 只是重新给噪声图案着色。与星空示例不同之处是，这里将原始色 `#0d2680` （即 `rgb(5% 15% 50%)`）转换为目标色 `#f2a626` （即 `rgb(95% 65% 15%)`）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bfe0b28616047b0949aac42ccb30b1c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=1813&s=1571420&e=jpg&b=2b7291)

  


这确保了图像的所有像素保持在某个颜色范围内。找到最佳颜色范围需要稍微调整一下值。

  


### 迷彩服图案

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f04838a82304a1c84fed9ef30fde9af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=1313549&e=jpg&b=785533)

  


> Demo 地址：https://codepen.io/airen/full/YzbEQLE

  


前面我们制作了木纹图案，接一下来我们来制作布料方面的图案，例如迷彩服图案。该图案通常由四种颜色组成：深绿色作为背景、棕色作为形状，黄绿色作为斑块，黑色则点缀为小斑点。

  


使用 SVG 滤镜制作类似上图这样的迷彩服图案，我们可能会用到 `<feTurbulence>` 滤镜、`<feComponentTransfer>` 和 `<feColorMatrix>` 等滤镜。具体代码如下：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" in="SourceGraphic" result="TURBULENCE__10" />
            <feComponentTransfer in="TURBULENCE__10" result="TURBULENCE__20">
                <feFuncR type="discrete" tableValues="0 0 1" />
                <feFuncG type="discrete" tableValues="0 0 0 1 1" />
                <feFuncB type="discrete" tableValues="0 1" />
            </feComponentTransfer>    
            <feColorMatrix values="
                1   0   0  0  0
                -1  1   0  0  0
                -1  -1  1  0  0
                0   0   0  0  1" in="TURBULENCE__20" result="TURBULENCE__30" type="matrix" />
            <feColorMatrix values="
                -.08  .42  .09   0  .08
                -.17  .35  -.08  0  .17
                -.08  .15  -.04  0  .08
                0     0    0     0  1" in="TURBULENCE__30" result="TURBULENCE__40" type="matrix" />
   
        </filter>
    </defs>
</svg>
```

  


与之前几个效果相比，在这个效果中，[我们还使用了 `<feComponentTransfer>` 滤镜](https://juejin.cn/book/7341630791099383835/section/7368318225756454962)。通过它的分量元素的离散函数类型，精确控制图案中红色、绿色和蓝色，它们的切割点分别是 `66.67%`、`60%` 和 `50%`。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a3fd5ef17cf404b989bde9a3990ae70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=608&s=1074343&e=jpg&b=0c0c0c)

  


上图左侧是 `<feTurbulence>` 生成的噪声图案，右则是 `<feComponentTransfer>` 滤镜对噪声图案中像素的 R、G 和 B 通道的线性值映射到一个离散区间范围。有关于这方面更详细的介绍，请移步阅读《[SVG 滤镜的进阶之创建图像特效](https://juejin.cn/book/7341630791099383835/section/7368318225756454962)》！

  


如果你仔细看，你会发现，每一层上的斑块在某些地方重叠，导致我们不想要的颜色出现。这些其他颜色为我们将噪声图案转换为迷彩图增添了不少的障碍。因此，这里使用 `<feColorMatrix>` 滤镜来消除这些障碍：

  


-   对于红色，我们定义恒等函数
-   对于绿色，我们的起点是恒等函数，但从中减去红色
-   对于蓝色，我们的起点也是恒等函数，但从中减去红色和绿色

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b05bfb7cbf4dd0a71240035048ead6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2860&h=884&s=84589&e=jpg&b=ffffff)

这些规则意味着红色保留在红色和绿色及/或蓝色曾经重叠的地方；绿色保留在绿色和蓝色重叠的地方。生成的图像包含四种类型的像素：红色、绿色、蓝色或黑色。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d157864b4a04f8698a417d7a56f0b2e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=1830982&e=jpg&b=2200fd)

  


接着再使用第二个 `<feColorMatrix>` 重新着色所有内容：

  


-   黑色部分通过恒定权重变成深绿色
-   红色部分通过反向恒定权重变成黑色
-   绿色部分通过绿色通道的附加权重变成黄绿色
-   蓝色部分通过蓝色通道的附加权重变成棕色

  


最终得到一个我们想的类似迷彩服的图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cab97c94685496b82b6c100638b26da~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=1313549&e=jpg&b=785533)

  


> Demo 地址：https://codepen.io/airen/full/YzbEQLE

  


很多时候，你往往只需要改为一些参数，将获得很多不同的图案效果。例如：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="6" in="SourceGraphic" result="TURBULENCE__10" />
            <feColorMatrix values="
                1 0 0 0 0
                1 0 0 0 0
                1 0 0 0 0
                0 0 0 0 1" type="matrix" in="TURBULENCE__10" result="TURBULENCE__20"/>
            <feComponentTransfer in="TURBULENCE__20" result="TURBULENCE__30">
                <feFuncR type="table" tableValues="0 .02 .03 .03 .09 .12 .27 .91 .3 .03 0 0"/>
                <feFuncG type="table" tableValues=".01 .09 .16 .18 .38 .48 .54 .73 .33 .09 .01 .01"/>
                <feFuncB type="table" tableValues=".03 .17 .3 .25 .37 .42 .42 .6 .17 .01 0 0"/>
            </feComponentTransfer>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fb2f22c013d4c7c8f05878a0caa77c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=1450647&e=jpg&b=29aaa6)

  


> Demo 地址：https://codepen.io/airen/full/YzbExpO

  


看上去是不是很像岛屿地图！

  


### 大理石图案

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88133ec5420e436196572174c591ffd9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=1295852&e=jpg&b=bebcc2)

  


> Demo 地址：https://codepen.io/airen/full/jOoaLYr

  


类似大理石纹理的图案制作相对而言要简单的多，你只需要使用 `<feTurbulence>` 滤镜，多调试几遍 `baseFrequency` 属性的值，直到符合自己期望的噪声图案，剩下的就是使用 `<feColorMatrix>` 或 `<feComponentTransfer>` 给图案着色。

  


```XML
<svg class="sr-only">
    <defs>
    <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence baseFrequency="0.01"  in="SourceGraphic" result="TURBULENCE__10" />
        <feColorMatrix type="matrix" values="
            1 1 1 0 0
            1 1 1 0 0
            1 1 1 0 0
            0 1 0 1 0 " in="TURBULENCE__10" result="TURBULENCE__20"/>
        <feColorMatrix type="matrix" values="
            .59 0 0 0 0.24
            .67 0 0 0 0.19
            .75 0 0 0 0.19
            0   0 0 1 1 " in="TURBULENCE__20" result="TURBULENCE__30"/>
        </filter>
    </defs>
</svg>
```

  


不难发现，这里所展示的几个图案，他的制作方法和思路都是一样的。这意味着，你只要愿意去尝试，基于 `<feTurbulence>`、`<feColorMatrix>` 或 `<feComponentTransfer>` 滤镜你可以创作出各式各样的精美图案！

  


### 纸张图案

  


关于图案的制作，我们再来看一个类似纸张纹理的图案。这个图案的制作过程与前面所展示的几个案例都略有不同，因为我们将要使用 SVG 的光源方面的滤镜。例如：

  


-   `<feDiffuseLighting> 滤镜`：用于在 SVG 图像中创建漫反射光照效果。它模拟了光线在粗糙表面上的散射，使图像看起来更加自然和真实
-   `<feSpecularLighting> 滤镜`：用于在 SVG 图像中创建镜面反射光照效果。它模拟了光线在光滑表面上的反射，使图像看起来有高光和反光点

  


简单地说，这两个滤镜基元都通过使用图像的 Alpha 通道作为凹凸贴图来照亮对象或图像。透明的部分保持平坦，而不透明的部分则凸起，形成被更明显照亮的高峰。

  


换句话说，光源滤镜使用输入图像的 Alpha 通道来提供深度信息：更不透明的区域会向观众凸起，而更透明的区域则会凹陷远离观众。这意味着输入图像中像素的 Alpha 值被用作该像素在 `z` 维度上的高度，滤镜使用该高度来计算虚拟表面，从而反射特定量的光。这是一项非常强大的功能！

  


这两种光源滤镜都接受一个称为 `surfaceScale` 的属性，它实际上是一个 `z` 轴比例因子。如果增加这个值，表面纹理的“坡度”会变得更陡。由于 `<feTurbulence>` 滤镜生成的噪声图案，其 Alpha 通道充满了从 `0 ~ 1` 的噪声值，当我们照射光源时，它会产生一个很好的可变 `Z` 地形，创建出高光效果。

  


在 SVG 中有三种光源：

  


-   `feDistantLight`：表示远程光源，其距离是任意远的，因此以与目标的角度来指定。这是表示阳光的最合适方式
-   `fePointLight`：表示从特定点发出的点光源，该点表示为三维 `x/y/z` 坐标。这类似于房间内或场景内的光源
-   `feSpotLight`：表示聚光灯，其行为类似于点光源，但其光束可以缩小到锥形，而光线可以旋转到其他目标

  


这三种光源中的每一种都有其自己的属性，用于通过指定 3D 空间中源的位置来定制其生成的光。这些属性超出了这节课的范围，但不用担心，我们后续的课程中会详细介绍这些属性。

  


在这里，你只需要知道，在 SVG 中创建和应用光效果，你需要将源嵌套在光类型中。因此，你首先要选择所需的光类型，然后选择要从中发出光线的源，最后需要指定光的颜色。`lighting-color` 属性用于定义 `<feDiffuseLighting>` 和 `<feSpecularLighting>` 的光源颜色。

  


了解了这些基础知识之后，我们就可以使用这些滤镜来制作像下图这样的纸张图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a7b02ea8ae84f8a826c493bb46c82f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=665364&e=jpg&b=efefef)

  


> Demo 地址：https://codepen.io/airen/full/jOoaGOm

  


这个效果对应的代码如下：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" in="SourceGraphic" result="TURBULENCE__10" />
            <feDiffuseLighting lighting-color="white" surfaceScale="2" in='TURBULENCE__10' result="TURBULENCE__20" >
                <feDistantLight azimuth="45"  elevation="60"/>
            </feDiffuseLighting>
        </filter>
    </defs>
</svg>
```

  


首先，我们使用 `<feTurbulence>` 滤镜生成像下图这样的一个噪声图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc4abefcd6eb406499673c0a0b7dbee9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=1746027&e=jpg&b=767562)

  


为了避免纸面上在光源作用下出现锐利的线条，我们将 `<feTurbulence>` 滤镜的噪声类型（`type`）设置 `fractalNoise` ，它会使噪声图案带点模糊效果。与此同时，为了增加纸张的“粗糙感”，我们增加了 `<feTurbulence>` 滤镜的 `numOctaves` 值，增加其中微小细节的量，从而使纸张看起来更粗糙。

  


之后，将类似太阳的光用于噪声图案上。这意味着我们将使用白色漫反射光，该光源从远处发出。方位角（`azimuth="45"`）和仰角（`elevation="60"`）确定了光源在 3D 空间中的位置。并且使用 `surfaceScale` 属性设置了 `z` 轴高度放大的倍数，在这个示例中放大两倍。将这个光源应用于噪声图案上，就制作出了我们想要的纸张图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddf62f21ada64b78a440d93d48b01349~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=665364&e=jpg&b=efefef)

  


> Demo 地址：https://codepen.io/airen/full/jOoaGOm

  


你也可以调整光源颜色，例如将白色光源替换成带有一点橙色调的泛黄，即 `#FFEFD5` 。你可以迅速调整纸张的颜色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb970793b7bd4f999ea0164df24fc310~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=903043&e=jpg&b=f1e1c5)

  


> Demo 地址：https://codepen.io/airen/full/NWVwaya

  


如果你愿意，还可以通过调整光源的源和距离来进一步微调效果。例如，将光源的仰角（`elevation`）从 `60` 降到 `40` 。看到的效果将会像下图这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93429c327ce84f289f296da7bd5f8bab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=1099281&e=jpg&b=d7c7af)

  


> Demo 地址：https://codepen.io/airen/full/oNRoGyg

  


有意思的是，我在尝试将光源的仰角（`elevation`）直接从代码中删除时，让我意外的获得了类似于岩石的图案效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37ec8806b02249f1a5fa36e15a00bdf8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=2770551&e=jpg&b=1a1817)

  


> Demo 地址：https://codepen.io/airen/full/gOJXGjg

  


非常有意思吧！

  


除此之外，你还可以在纸张上添加点别的东西，例如 [@Oscar Salazar 在 Codepen 上提供的一个案例](https://codepen.io/raczo/full/KKVbQmV)，在纸张上放了几颗水珠：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae0b7ea8aab2413bb14681ff1c1647db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1191&s=1056896&e=jpg&b=a09f9b)

  


> Demo 地址：https://codepen.io/airen/full/BaemPdV

  


## 案例二：制作水波纹

  


[通过之前的课程学习](https://juejin.cn/book/7341630791099383835/section/7368318262368534578)，我们知道 `<feDisplacementMap>` 滤镜可以让图形按照 R、G 和 B 通道的颜色进行位置的偏移，从而让图形产生各种变形的效果。而且用作位移图的图像可以是任何图像，包括 SVG 滤镜生成的图形，例如 `<feTurbulence>` 生成的噪声图。例如：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence baseFrequency="0.01 0.4" result="TURBULENCE__10" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__10" result="TURBULENCE__20" scale="20" xChannelSelector="R" yChannelSelector="R" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c14d14a97d3a43af947ab8abb17bdf43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1079&s=891942&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/KKLyXLx

  


由于 `<feTurbulence>` 滤镜可以创建随机的噪声图案，因此，当它与 `<feDisplacementMap>` 滤镜相互结合使用时，就会使图形或图像有符合自然效果的扭曲效果。例如下面这个水波效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e51b55ed00c40ca80faf46a0b25cfe9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=530&s=12954476&e=gif&f=55&b=103751)

  


> Demo 地址：https://codepen.io/airen/full/YzbEExx

  


这个水波的效果是不是很逼真。这个效果是通过 `<feTurbulence>` 和 `<feDisplacementMap>` 滤镜使下面这张静态位图中的水动起来：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d51e8281c12b4ae98ff9b5903ab64b3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1024&s=252293&e=jpg&b=42698f)

  


> URL: https://picsum.photos/id/716/1920/1024

  


首先，使用 `<feTurbulence>` 滤镜生成了噪声图案：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence id="feturbulence" type="fractalNoise" baseFrequency="0.001 .01" numOctaves="2" result="TURBULENCE__10"  />
        </filter>
    </defs>
</svg>
```

  


通过调整 `baseFrequency` 属性的值，使纹理拉伸变形，并调整 `numOctaves` 增加纹理的密度：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdb22cd78a684f6f8f47e8b40bf5b3be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1191&s=547849&e=jpg&b=584854)

  


我们可以将生成的噪声图作为 `<feDisplacementMap>` 滤镜的位移图，并使用位移图的绿色通道控制水平方向位移，用蓝色通道控制垂直方向位移，与此同时调整扭曲的强度：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence id="feturbulence" type="fractalNoise" baseFrequency="0.001 .01" numOctaves="2" result="TURBULENCE__10"  />
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__10" result="TURBULENCE__20" xChannelSelector="G" yChannelSelector="B" scale="20" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79ec8cb56e9d484ab2d0c9895b904977~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1191&s=2016427&e=jpg&b=42688e)

  


到现在为止，经过 SVG 滤镜处理之后的图像同样是静止的，而且看上去和原图没有太多差异。要让这个图动起来，我们需要对 `<feTurbulence>` 滤镜的 `baseFrequency` 属性进行动画化处理。我样可以使用像下面这样使用 `<animate>` 对 `baseFrequency` 属性进行动画化处理：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence id="feturbulence" type="fractalNoise" baseFrequency="0.001 .01" numOctaves="2" result="TURBULENCE__10">
                <animate attributeName="baseFrequency" from="0.0015 0.0016" to="0.015 0.016" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__10" result="TURBULENCE__20" xChannelSelector="G" yChannelSelector="B" scale="20" />
        </filter>
    </defs>
</svg>
```

  


也可以使用 JavaScript 脚本动态调整 `baseFrequency` 属性的值：

  


```JavaScript
const turbulenceElement = document.querySelector("feTurbulence");
var startTime = null;

const animate = (time) => {
    if (!startTime) startTime = time;
    var progress = (time - startTime) / 8000;
    var bfX = (progress % 2) * 0.005 + 0.015;
    var bfY = (progress % 2) * 0.05 + 0.01;
    var bfStr = bfX.toString() + " " + bfY.toString();
    turbulenceElement.setAttribute("baseFrequency", bfStr);

    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
```

  


在我们这个示例中，使用的是 JavaScript 方案。经过脚本处理之后，静态的水就动起来了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec1f0fd95a61426595fed6c91997f067~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=530&s=12954476&e=gif&f=55&b=103751)

  


> Demo 地址：https://codepen.io/airen/full/YzbEExx

  


是不是很有魔性！

  


在上面示例的基础上，稍微调整一下，我们就可以获得水中倒影的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d1dc9a0ca244cd29af776c172bed2ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=598&s=7009434&e=gif&f=118&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/eYaejzw

  


## 案例三：故障效果

  


在之前的课程中，我们介绍了[如何使用 `<feFlood>` 、`<feMerge>` 和 `<feDisplacementMap>` 等滤镜制作故障效果](https://juejin.cn/book/7341630791099383835/section/7368318262368534578#heading-3)。接下来，我们来看看 `<feTurbulence>` 和 `<feDisplacementMap>` 滤镜又是如何实现故障效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6638b93b92047ff83a30f902a1a919b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=492&s=430500&e=gif&f=139&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/PovOBxd

  


上面这个效果对应的滤镜代码很简单：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0 0.000001" result="TURBULENCE__10" in="SourceGraphic" numOctaves="2"/>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__10" scale="30" xChannelSelector="R" yChannelSelector="R" result="TURBULENCE__20" />  
        </filter>
    </defs>
</svg>
```

  


与之类似的代码前面已经展示过多次了。这里就不详细介绍了。

  


就这个效果而言，我们的目标是使按钮水平扭曲，但又不希望扭曲效果太过戏剧性，因此我们将 `baseFrequency` 属性的值设置为 `0 0.000001` 。在这个状态下，你基本上看不到按钮带有扭曲变形的效果。接下来，我们使用 [GSAP](https://gsap.com/) 来动画化 `<feTurbulence>` 滤镜的 `baseFrequency` 属性值到 `0 0.2` ，然后再返回到 `0 0.000001`：

  


```JavaScript
const turbulenceElement = document.querySelector("feTurbulence");
var button = document.querySelector(".button"),
    turbVal = { val: 0.000001 },
    buttonTl = new TimelineLite({
        paused: true,
        onUpdate: function () {
            turbulenceElement.setAttribute("baseFrequency", "0 " + turbVal.val);
        }
    });

buttonTl.to(turbVal, 0.2, { val: 0.2 }).to(turbVal, 0.2, { val: 0.000001 });

button.addEventListener("click", () => {
    buttonTl.restart();
});
```

  


就这样，一个带有故障动画效果的按钮就实现了。如果你对这种交互效果感兴趣的话，还可以看看 [@Adrien Denat 提供的案例](https://tympanus.net/Development/DistortedButtonEffects/)，在这个案例中提供了多种不同的按钮变形动画效果，虽然效果上有所差异，但它们的实现原理与上面这个故障按钮动画效果是相同的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee4f25dc19834ba6940ffa105583cc71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1248&h=764&s=400824&e=gif&f=103&b=f4f4f4)

  


> Demo 地址：https://tympanus.net/Development/DistortedButtonEffects/ （[源码点击这里获取](https://github.com/codrops/DistortedButtonEffects/tree/master)）

  


就是这样，真的。你可以在这里玩耍实时演示：

  


之前案例中应用的动画效果，基本上是借助于 JavaScript 脚本动态调整 `<feTurbulence>` 滤镜的 `baseFrequency` 或 `seed` 属性实现的。接下来，这个案例是在 CSS 的 `@keyframes` 中应用多个 SVG 滤镜实现的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ffab083ea14f5a85250e000d566116~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=646&s=2487766&e=gif&f=43&b=141b5b)

  


> Demo 地址：https://codepen.io/airen/full/gOJXdOQ

  


首先使用 SVG 的 `<feTurbulence>` 和 `<feDisplacementMap>` 滤镜，定义了多个不同的扭曲效果：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="squiggly-0" color-interpolation-filters="linearRGB">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="0" in="SourceGraphic" result="TURBULENCE__10"/>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__10" scale="6" result="TURBULENCE__20"/>
        </filter>
        
        <filter id="squiggly-1" color-interpolation-filters="linearRGB">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="1" in="SourceGraphic" result="TURBULENCE__30"/>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__30" scale="8" result="TURBULENCE__40"/>
        </filter>
    
        <filter id="squiggly-2" color-interpolation-filters="linearRGB">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="2" in="SourceGraphic" result="TURBULENCE__50"/>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__50" scale="6" result="TURBULENCE__60" />
        </filter>
        <filter id="squiggly-3" color-interpolation-filters="linearRGB">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="3" in="SourceGraphic" result="TURBULENCE__70"/>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__70" scale="8" result="TURBULENCE__80"/>
        </filter>
    
        <filter id="squiggly-4" color-interpolation-filters="linearRGB">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="4" in="SourceGraphic" result="TURBULENCE__90"/>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE__90" scale="6" result="TURBULENCE__100"/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6840eea21d24edd9e5c9e3302f29df1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=998&s=710276&e=jpg&b=161e66)

  


你会发现，这四个滤镜的效果差异不是很夸张，如果你愿意，你可以调整 `baseFrequency` 的值，使其变得夸张一些。

  


接下来，我们在 CSS 中使用 `@keyframes` 将这四个滤镜定义为一个帧动画，并应用到文本上：

  


```CSS
@layer demo {
    @keyframes squiggly-anim {
        0% {
            filter: url("#")
        }
        25% {
            filter: url("#squiggly-1");
        }
        50% {
            filter: url("#squiggly-2");
        }
        75% {
            filter: url("#squiggly-3");
        }
        100% {
            filter: url("#squiggly-4");
        }
    }

    h3 {
        animation: squiggly-anim 0.34s linear infinite;
    }
}
```

  


这样就实现了最终的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e4a6ec1b48f440391e67772d543e4b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=646&s=2487766&e=gif&f=43&b=141b5b)

  


> Demo 地址：https://codepen.io/airen/full/gOJXdOQ

  


## 小结

  


哇，终于完成了！

  


我们不仅看到了许多精美的图案，还体验了一些有趣且吸引人的动画效果。最重要的是，我们学到了很多关于 `<feTurbulence>` 滤镜的知识，包括它的各种参数和如何以有趣的方式操控它们。

  


我坚信 `<feTurbulence>` 是一种你会想要反复试验的滤镜。通过研究和拆解别人的代码，你可以更深入地了解它。我自己经常猜测纹理会是什么样子。因为当我们与其他滤镜结合使用时，仅靠一个纹理就可以制作出很多效果，几乎有无限种可能性。我强烈建议你看看别人的作品，并通过拆解来学习更多内容。

  


最后，我希望这节课能激发你的灵感，打开你的想象之门，看看你可以用 SVG 滤镜做出什么样的创意作品。