在现代 Web 开发中，遮罩（Masking）技术是实现各种视觉效果的重要工具之一。[与剪切技术相似](https://juejin.cn/book/7341630791099383835/section/7362748816769941540)，在 Web 开发中，我们可以使用 [CSS 遮罩](https://juejin.cn/book/7223230325122400288/section/7259668885224456252#heading-9)和 SVG 遮罩来实现各种有创意的视觉效果和动画效果。CSS 遮罩通过 `mask` 属性实现，可以使用 PNG 图片、CSS 渐变或 SVG 元素来定义遮罩效果，而 SVG 遮罩则使用 `<mask>` 元素，提供了更大的灵活性和自定义能力。

  


首先，我们将简要回顾 [CSS 遮罩的相关特性](https://juejin.cn/book/7223230325122400288/section/7259668885224456252#heading-9)，然后深入探讨 SVG 遮罩。SVG 遮罩提供了更多的控制和自定义选项，可以实现更复杂的遮罩效果。我们将学习如何创建 SVG 遮罩元素，并结合 SVG 图形和滤镜效果，实现各种独特的遮罩效果。

  


通过本节课的学习，你将掌握两种遮罩技术的基本原理和实际应用方法，能够灵活运用它们来实现各种炫酷的视觉效果。无论你是新手还是经验丰富的开发者，本节课都将为你提供有价值的知识和实用技能，帮助你在 Web 开发中更加游刃有余。

  


## Web 上的遮罩

  


在 Web 上，遮罩技术通常使用剪切（Clipping）或遮罩（Masking）来实现。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfddb3af2e8040a29a0e921a3b0a3572~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=3346&s=1738923&e=jpg&b=050505)

  


-   剪切（Clipping）：剪切是一种通过在图像或元素上放置闭合的矢量形状（如圆形或多边形）来隐藏或显示图像或元素的部分区域的技术。这个开头被称为剪切路径。任何位于形状后面的图像部分将可见，而超出边界的部分将被隐藏。我们可以使用 `clip-path` 属性来创建和控制，对于剪切路径（形状）还可以使用 SVG 的 `<clipPath>` 元素来创建。
-   遮罩（Masking）：遮罩技术允许你使用 PNG 图像、CSS 渐变或 SVG 元素来隐藏图像或元素的特定部分，而显示其他部分。在 CSS 中，你可以使用 `mask` 属性来定义遮罩效果。你可以通过一个遮罩图像或一个 SVG 元素来创建遮罩效果，从而实现在元素上的特定区域的透明度或可见性效果。此外，SVG 中的 `<mask>` 元素也是一种常见的遮罩技术，它允许你以更灵活的方式定义遮罩效果，例如使用 SVG 图形和滤镜效果来创建复杂的遮罩效果。这种技术可以为 Web 设计师和开发者提供更大的创作自由度和灵活性。

  


简单地说，剪切（Clipping）主要用于路径，而遮罩（Masking）用于图像或渐变。

  


-   剪切需要一个剪切路径，剪切路径可以是一个闭合矢量路径、形状或多边形；剪切路径是一个区域，该区域内部的所有内容都可以显示出来，外部的所有内容将被剪切掉，在页面上不可见；
-   遮罩需要一个高亮或 Alpha 遮罩层，将源和遮罩层合在一起会创建一个缓冲区域，在合层阶段之前，亮度和 Alpha 遮罩会影响这个缓冲区的透明度，从而实现完全或部分遮罩源的部分

  


这两种技术之间存在着微妙的区别。将剪切路径视为“硬遮罩”，其中被删除的剪切对象是一个没有任何透明或不透明像素显示的形状。而遮罩则由每个像素的不同透明度和不透明度组成，以一种非常细微的方式来显示或隐藏部分内容。课程后面，我们将会讨论这两种技术应该如何选择？

  


## 遮罩是什么？

  


简单来说，遮罩就是在不删除元素的情况下隐藏其部分内容。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b257480cd1b54fd8957ff8f28d036861~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=1705&s=778471&e=jpg&b=050505)

  


如上图所示，我们有一张图像以及一个遮罩（白色图形）。在诸如 Figma 这样的图形设计软件中，我们可以将图像插入白色的形状中，这将导致产生一个被遮罩的图片。即白色图形底部区域的照片会显示，而图形之外的区域则被隐藏起来。

  


遮罩的原理是通过隐藏图片的某些部分，而不是擦除它（它们仍然存在，但被隐藏了）。这就是遮罩的核心概念，即使用形状来显示和隐藏元素的部分内容。

  


根据遮罩层的不同，遮罩分为**高亮**和 **Alpha** 两种模式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca54585a51104e06aeb5b5a49fa3d6c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=3346&s=1620826&e=jpg&b=050505)

  


-   高亮模式使用图像的亮度值作为遮罩值，上图中白色遮罩层对应区域将会显示出来，透明区域将会被隐藏。根据遮罩层图形的亮度来确定遮罩层的透明度
-   Alpha 模式带有 Alpha 通道的图像（遮罩图层），Alpha 通道包含在每个像素数据中的透明信息。上图中黑色遮罩层对应区域将会显示出来，透明区域内容将会被隐藏。根据遮罩层图形的透明度信息来确定遮罩层的透明度

  


为了能更好展示遮罩层透明信息对遮罩效果的影响，我们以一个带有渐变的遮罩图形为例：

  


```HTML
<img src="https://picsum.photos/id/19/800/800" alt="" class="masking--svg">
<img src="https://picsum.photos/id/19/800/800" alt="" class="masking--css">

<svg class="sr-only">
  <defs>
    <mask maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" id="mask">
      <linearGradient id="grad" gradientUnits="objectBoundingBox" x2="1" y2="0">
        <stop stop-color="black" offset="0" />
        <stop stop-color="white" offset=".25" />
        <stop stop-color="white" offset=".75" />
        <stop stop-color="black" offset="1" />
      </linearGradient>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </mask>
  </defs>
</svg>
```

  


```CSS
.masking--svg {
    mask: url(#mask);
}

.masking--css {
    mask: linear-gradient(to right, transparent, white 25%, white 75%,transparent 100%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eae14a170c84f53a26eca9fcbd10784~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=735&s=722474&e=jpg&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/wvZLBvb

  


正如你所看到的，在渐变中，有填充和透明像素。填充像素是元素部分可见的地方，而透明像素则是隐藏部分的地方。

  


再来看来个示例：

  


```HTML
<div class="wrapper">
    <h3>clip-path</h3>
    <img src="https://picsum.photos/id/199/800/800" alt="">
</div>
<div class="wrapper">
    <h3>mask: luminance</h3>
    <img src="https://picsum.photos/id/199/800/800" alt="">
</div>
<div class="wrapper">
    <h3>mask: Alpha</h3>
    <img src="https://picsum.photos/id/199/800/800" alt="">
</div>
<div class="wrapper">
    <h3>mask: Gradient</h3>
    <img src="https://picsum.photos/id/199/800/800" alt="">
</div>

<svg class="sr-only">
    <defs>
        <path d="M0.976,0.205 C0.96,0.165,0.938,0.129,0.91,0.098 C0.882,0.067,0.849,0.043,0.813,0.026 C0.775,0.009,0.735,0,0.694,0 C0.637,0,0.581,0.017,0.533,0.05 C0.521,0.058,0.51,0.067,0.5,0.076 C0.49,0.067,0.479,0.058,0.467,0.05 C0.419,0.017,0.363,0,0.306,0 C0.265,0,0.225,0.009,0.187,0.026 C0.151,0.043,0.118,0.067,0.09,0.098 C0.062,0.129,0.04,0.165,0.024,0.205 C0.008,0.247,0,0.291,0,0.337 C0,0.38,0.008,0.424,0.023,0.47 C0.037,0.508,0.055,0.548,0.079,0.588 C0.117,0.651,0.169,0.717,0.234,0.784 C0.342,0.894,0.448,0.971,0.453,0.974 L0.48,0.994 C0.492,1,0.508,1,0.52,0.994 L0.547,0.974 C0.552,0.971,0.658,0.894,0.766,0.784 C0.831,0.717,0.883,0.651,0.921,0.588 C0.945,0.548,0.964,0.508,0.977,0.47 C0.992,0.424,1,0.38,1,0.337 C1,0.291,0.992,0.247,0.976,0.205" id="heart" />
        
        <linearGradient id="linearGradient" x1="0" y1="0" x2="0%" y2="100%">
            <stop offset="0%" stop-color="white" />
            <stop offset="100%" stop-color="black" />
        </linearGradient>
        
        <clipPath id="clip" clipPathUnits="objectBoundingBox">
            <use href="#heart" />
        </clipPath>
        
        <mask maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" id="mask1" mask-type="luminance">
            <use href="#heart" fill="#fff" />
        </mask>
        <mask maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" id="mask2" mask-type="alpha">
            <use href="#heart" fill="#000" />
        </mask>
        <mask maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" id="mask3">
            <use href="#heart" fill="url(#linearGradient)" />
        </mask>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecb4046222744160b0c75d97539c6bea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=735&s=871804&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/abxgbRp

  


正如上图所示：

  


-   遮罩（Masking）：可以使用透明度来表达。它可以使用遮罩图像的亮度作为透明度的亮度蒙版，也可以使用只包含透明度信息的 Alpha 遮罩。
-   剪切（Clipping）：无法使用透明度来表达

  


也就是说，在需要使用透明度表达的情况下，通常会选择遮罩，而在需要清晰轮廓的情况下，则会选择剪切。

  


前面提到过，在 Web 开发中，我们既可以使用 CSS 遮罩（或剪切），也可以使用 SVG 遮罩（或剪切）。它们很多时候能帮助我们创建出相似的效果。理论上它们有很多特性也是相似的，只不过 SVG 的遮罩要更灵活，更强大一些，它允许你创建出更强大的遮罩效果。

  


为了能让大家更好的理解 SVG 遮罩，我们先从熟悉的 CSS 遮罩开始！

  


## CSS 遮罩

  


在 CSS 中，有几种方式可以对元素进行遮罩：

  


-   CSS 的 `clip-path` 属性，也可以结合 SVG 的 `<clipPath>` 定义的剪切路径一起使用
-   CSS 的 `mask` 属性，也可以结合 SVG 的 `<mask>` 定义的遮罩一起使用

  


对于文本遮罩，还可以使用 CSS 的 `background-clip:text` 。

  


> 特别声明，[我们在上一节课一起探讨了 clip-path 和 `<clipPath>` 如何对元素进行遮罩（裁剪）](https://juejin.cn/book/7341630791099383835/section/7362748816769941540)。另外，我曾在《[CSS 的 Clipping 和 Masking](https://juejin.cn/book/7223230325122400288/section/7259668885224456252)》课程中详细阐述了 CSS 的 `clip-path` 和 `mask` 是如何对元素进行遮罩！

  


接下来，我们先重温一下 CSS 的 `mask` 属性，然后再进入 SVG 的 `<mask>` 。

  


CSS 的 `mask` 属性是一系列独立属性的简写，它的大部功能的工作原理与 CSS 的 `background` 属性非常相似：

  


-   `mask-image` ：设置遮罩层的图像。可以是 PNG 图片、SVG 文件、CSS 渐变或得对 SVG `<mask>` 元素的引用。类似于 CSS 的 `background-image` 属性的工作原理
-   `mask-mode` ：设置遮罩层图像的模式，可以是 `alpha` （使用图像的 Alpha 通道作为遮罩值）或 `luminance` （使用图像的亮度值作为遮罩值）
-   `mask-repeat` ：设置遮罩层图像的重复方式，可以是 `no-repeat` 、`repeat` 、`space` 或 `round` 等。类似于 CSS 的 `background-repeat` 属性的工作原理
-   `mask-position` ：设置遮罩层图像的位置。类似于 CSS 的 `background-position` 属性的工作原理
-   `mask-size` ：设置遮罩层图像的大小。类似于 CSS 的 `background-size` 属性的工作原理
-   `mask-origin` ：设置遮罩层图像相对于元素框的位置，它的值可以是 `border-box` 、`padding-box` 或 `content-box` 。类似于 CSS 的 `background-origin` 属性的工作原理
-   `mask-clip` ：设置遮罩层图像的裁剪区域，即确定了遮罩层图像的可见区域。类似于 CSS 的 `background-clip` 属性的工作原理
-   `mask-composite` ：用于合成多个遮罩层的效果。它定义了不同遮罩层之间的组合方式。常见的值有 `add` 、`subtract` 、`intersect` 和 `exclude` 等

  


`mask` 也可以像 `background` 一样，同时使用多个遮罩层。例如：

  


```CSS
.mask {
    mask: url("mask1.png"), url("mask2.svg"), linear-gradient(45deg, #000, rgb(0 0 0 / 0));
}
```

  


[以 @Temani Afif 在 Codepen 提供的用户头像效果为例](https://codepen.io/t_afif/full/MWBjraa)，来看看 CSS `mask` 是如何工作的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9200d2a3ca654d46b8b8ef49d71ed1da~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1088&h=542&s=3031993&e=gif&f=125&b=dbe0c3)

  


> Demo 地址：https://codepen.io/t_afif/full/MWBjraa （来源于 @Temani Afif）

  


这个效果非常类似于著名的 Porky Pig 动画中，他在一系列红色圆环中挥手告别时的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05c01501867b4c2cbdaadc879286c3b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=622&s=1800770&e=gif&f=76&b=fffefe)

  


> Demo 地址：https://codepen.io/Kilian/full/yLJBymR （来源于 @Kilian Valkhof）

  


当用户将鼠标悬停在用户头像上时，会出现一种效果，仿佛用户头像穿过一个圆形或洞口。用户头像会放大，同时其背景会缩小，最令人瞩目的是，用户头像仿佛从圆圈中弹出来一样。这种悬停效果既酷炫又实用，而且可以通过 CSS 的 `mask` 属性轻松实现。

  


实现该效果，你需要一张像下面这样的带有透明背景的正方形图片（用户头像）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8278e916c8ca42cb8717a8afd4c24801~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1600&s=564712&e=webp&a=1&b=6382cb)

  


接下来，我们来挑战在一个 `img` 元素上实现这个效果：

  


```HTML
<img src="avatar.png" alt="" />
```

  


在开始编写具体的 CSS 代码之前，我们先来剖析一下这个效果。当用户将鼠标悬停在图像上时，它会放大，因此我们需要使用 `transform: scale()` 或 `scale` 来实现这一效果。图像后面有一个圆圈，我们可以利用径向渐变（`radial-gradient()`）来创建。最关键的是，我们需要找到一种方法，让用户的头像部分视觉上穿过同一个圆圈，即头像部分被圆圈遮盖，同时圆圈部分也被头像遮盖。

  


```CSS
@layer demo {
    .avatar {
        --size: 280px; 
        --border-width: 5px;
        --border-color: #C02942;
        --bg-circle: #ECD078;
        width: var(--size);
        aspect-ratio: 1;
        cursor: pointer;
        transition: 0.5s;
        background:radial-gradient(
            circle closest-side,
            var(--bg-circle) calc(99% - var(--border-width)),
            var(--border-color) calc(100% - var(--border-width)) 99%,
            #0000
        );
        
        &:hover {
            scale: 1.35;
        }
    }
}
```

  


注意，代码中的 `--border-width` 变量。虽然它表示“边框”的粗细，但实际上只是用来定义径向渐变中红色的在渐变轴上的停止位置。

  


现在，你看到的效果是，用户头像和圆圈会同时随用户鼠标悬停放大和缩小：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19bd9829658840ed8e79dd391799e335~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=510&s=2396606&e=gif&f=73&b=030303)

  


接下来，我们需要调整这个效果。当鼠标悬停时，我们要调整渐变的大小，以确保圆圈保持不变，而图像增大。但是，由于我们应用了 `scale` 变换，实际上我们需要减小圆圈的大小，以确保它不会随着头像的增大而缩放。因此，当图像增大时，我们需要让渐变缩小。

  


同样的，使用一个 CSS 变量来定义这个缩放因子，例如 `--f` ，并将其用于设置圆圈（径向渐变）的大小。

  


```CSS
@layer demo {
    .avatar {
        --size: 280px;
        --border-width: 5px;
        --border-color: #c02942;
        --bg-circle: #ecd078;
        --f: 1;
        width: var(--size);
        aspect-ratio: 1;
        cursor: pointer;
        transition: 0.5s;
    
        background: radial-gradient(
            circle closest-side,
            var(--bg-circle) calc(99% - var(--border-width)),
            var(--border-color) calc(100% - var(--border-width)) 99%,
            lightblue
          )
          50% / calc(100% / var(--f)) 100% no-repeat;
        scale: var(--f);
        
        &:hover {
          --f: 1.35;
        }
    }
}
```

  


我们使用 `1` 作为 `--f` 的默认值，它是图像和圆圈变换的初始比例。另外在径向渐变中添加了一个 `lightblue` 颜色，以便在悬停时更好地识别渐变区域。最为关键的是，将渐变背景放置在中心位置，即 `background-position` 为 `center` （或 `50%`），同时使用 `background-size` 调整径向渐变的尺寸，它的宽度等于 ` calc(100%  ``/ var(--f)``)` ，高度等于 `100%` 。

  


```CSS
.avatar {
    background: radial-gradient(
        circle closest-side,
        var(--bg-circle) calc(99% - var(--border-width)),
        var(--border-color) calc(100% - var(--border-width)) 99%,
        lightblue
     )
     50% / calc(100% / var(--f)) 100% no-repeat;
}

/* 等同于 */
.avatar {
    background-image: radial-gradient(
        circle closest-side,
        var(--bg-circle) calc(99% - var(--border-width)),
        var(--border-color) calc(100% - var(--border-width)) 99%,
        lightblue
     );
     background-position: 50%; 
     background-size: calc(100% / var(--f)) 100%;
     background-repeat: no-repeat;
}
```

  


当 `--f` 等于 `1` 时，没有任何缩放（这是初始缩放）。与此同时，渐变占据了容器的整个宽度。当我们在悬停时调整 `--f` 的缩放比例时，例如 `--f: 1.35` ，元素的大小会增加，而渐变的大小则会减小：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a9f9ddfae054b63bbbc1ef0206b5bc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=532&s=4153207&e=gif&f=146&b=040404)

  


正如你所看到的，现在圆圈整个边框都在用户头像的底下。接下来需要将圆圈边框的另一部分放置在用户头像的上面。我们可以通过 CSS 的 `outline` 和 `outline-offset` 来实现它。这意味着，我们要在图像上设置一个 `outline` ，并通过 `outline-offset` 来调整其偏移量来创建底部边框（遮盖在用户图像的边框）。不过，我们需要通过一些计算才能获得这个偏移量：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f26050056c6a4a66b51806467a290500~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1382&s=704528&e=jpg&b=050505)

  


默认情况之下，`outline` 是在元素框的外部绘制的。就这个示例而言，我们需要将它（`outline` 绘制的轮廓）重叠在元素上。更准确地说，我们需要它跟随渐变创建的圆圈。

  


当我们缩放元素时，我们会看到圆圈和边缘之间的空间。不要忘记，想法是在缩放变换后保持圆圈的大小不变，这使得我们可以根据上图中所列公式计算出 `outline-offset` 的值（偏移量）。但不要忘记第二个元素被缩放，所以我们的结果也被缩放。这意味着我们需要将结果除以 `f` 获得实际的偏移值：

  


```CSS
outline-offset = ((f - 1) × Size ÷ 2) ÷ f = (1 - 1 ÷ f) × Size ÷ 2
```

  


注意，我们需要的是一个负偏移值，因此要给上面的公式加上负号：

  


```
outline-offset = -1 × ((f - 1) × Size ÷ 2) ÷ f = -1 × (1 - 1 ÷ f) × Size ÷ 2 = (1 ÷ f - 1) × Size ÷ 2

--o = calc((1/var(--f) - 1)*var(--size)/2);
```

  


将计算获得的 `--o` 用于 `outline-offset` ：

  


```CSS
@layer demo {
    .avatar {
        --size: 280px;
        --border-width: 5px;
        --border-color: #c02942;
        --bg-circle: #ecd078;
        --f: 1;
        --o: calc((1 / var(--f) - 1) * var(--size) / 2);
        
        width: var(--size);
        aspect-ratio: 1;
        cursor: pointer;
        transition: 0.5s;
        border-radius: 0 0 999px 999px;
        outline: var(--border-width) solid var(--border-color);
        outline-offset:var(--o);
        background: radial-gradient(
            circle closest-side,
            var(--bg-circle) calc(99% - var(--border-width)),
            var(--border-color) calc(100% - var(--border-width)) 99%,
            lightblue
          )
          50% / calc(100% / var(--f)) 100% no-repeat;
        scale: var(--f);
        
        &:hover {
            --f: 1.35;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0baf572da8734023b35b9213f4d6178c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=622&s=4015464&e=gif&f=128&b=040404)

  


不能发现，`outline` 绘制的轮廓与径向渐变的绘制圆圈边框并不完全重叠。我们可以通过从偏移量中移除边框的大小来实现：

  


```CSS
.avatar {
    --o: calc((1 / var(--f) - 1) * var(--size) / 2);
    --_o: calc(var(--o) - var(--border-width));
    outline-offset: var(--_o);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a8288ef99364bd8aa9a1b76a852bc06~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=608&s=5598816&e=gif&f=173&b=030303)

  


现在我们需要找到如何从轮廓中移除顶部部分。也就是说，我们需要想办法确保轮廓不会触及头像的顶部。我们可以通过给元素设置一个 `padding-top` 定义这个空间，并且将径向渐变的初始位置设置为 `content-box` ，这样做是只是希望径向渐变仅填充在元素的内容框为止：

  


```CSS
.avatar {
    background: radial-gradient(
        circle closest-side,
        var(--bg-circle) calc(99% - var(--border-width)),
        var(--border-color) calc(100% - var(--border-width)) 99%,
        lightblue 
      )
      50% / calc(100% / var(--f)) 100% no-repeat content-box;
    padding-top: calc(var(--size) / 5);
}
```

  


注意，这个 `padding-top` 没有特定的逻辑，只是用来确保轮廓不会触及头像的顶部。另外，由于我们添加了 `padding-top` ，因此需要将背景的 `background-origin` 设置为 `content-box` ，以确保背景只在元素内容框中填充。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4cfa08ad0004c4cac82b8c2c5529c63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=522&s=3773524&e=gif&f=136&b=030303)

  


> 注意，需要将元素的 `box-sizing` 设置为 `content-box` 。

  


现在，我们离最终目标效果只差最后一步！我们需要使用 CSS 的 `mask` 来隐藏一部分内容。注意，这里我们使用 CSS 渐变作为遮罩层的图像。下图展示了我们需要隐藏的部分，或者更准确地说，我们需要展示的部分：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d471aee0e7a48f0a1c796a0d9b2973f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=526&s=64322&e=webp&b=fbf8f8)

  


上图中左侧部分展示了我们当前的状态，右侧的图像则是我们最终想要的结果。绿色部分说明了我们必须对原始图像应用的 `mask` ，即遮罩层图像。我们可以将遮罩图分成两个部分：

  


-   顶部的矩形部分覆盖了轮廓内部的区域。请注意，轮廓位于顶部绿色区域的外部，这是最重要的部分，因为它允许将轮廓裁剪，以便仅可见底部部分
-   底部圆形部分，尺寸和曲率与我们用来创建头像后面的圆圈径向渐变相同

  


它对应的 CSS 代码如下：

  


```CSS
.avatar {
    mask: 
        linear-gradient(#000 0 0) no-repeat 50% calc(1px - var(--_o)) / calc(100% / var(--f) - 2 * var(--border-width) - 2px) 50%,
        radial-gradient(circle closest-side, #000 99%, #0000) var(--_g);
}
```

  


最终得到我们想要的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/096a338aaca540e996682d6d8e80b092~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=558&s=3077285&e=gif&f=106&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/eYoqGqQ

  


最终核心代码如下：

  


```CSS
@layer demo {
    .avatar {
        --size: 280px;
        --border-width: 5px;
        --border-color: #c02942;
        --bg-circle: #ecd078;
        --f: 1;
        --o: calc((1 / var(--f) - 1) * var(--size) / 2);
        --_o: calc((1 / var(--f) - 1) * var(--size) / 2 - var(--border-width));
        --_g: 50% / calc(100% / var(--f)) 100% no-repeat content-box;
        
        display: block;
        box-sizing: content-box; /* 这个很重要 */
        width: var(--size);
        outline: var(--border-width) solid var(--border-color);
        outline-offset: var(--_o);
        aspect-ratio: 1;
        cursor: pointer;
        transition: 0.5s;
        border-radius: 0 0 999px 999px;
        background: radial-gradient(
            circle closest-side,
            var(--bg-circle) calc(99% - var(--border-width)),
            var(--border-color) calc(100% - var(--border-width)) 99%,
            #0000
          )
          var(--_g);
        scale: var(--f);
        padding-top: calc(var(--size) / 5);
        mask: linear-gradient(#000 0 0) no-repeat 50% calc(1px - var(--_o)) /
            calc(100% / var(--f) - 2 * var(--border-width) - 2px) 50%,
          radial-gradient(circle closest-side, #000 99%, #0000) var(--_g);
    
        &:hover {
            --f: 1.35;
        }
    }
}
```

  


再来看一个模拟 Chrome 浏览器标签选项卡的 UI 效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/799c90c9cdea4083b201ab68d1478736~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1404&h=1096&s=153847&e=png&a=1&b=8b54a7)

  


先来看一个比较老的解决方案，即利用 CSS 的伪元素来制作选项卡底部圆角：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd61ece281a54249abcfa5af50a7772b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=744&s=238424&e=jpg&b=222222)

  


```HTML
<ul id="tab--lists" class="tabs">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li class="active"><a href="#">Contact</a></li>
    <li><a href="#">Dashboard</a></li>
</ul>
```

  


```CSS
:root {
    --circle: 20px;
    --square: calc(var(--circle) / 2);
    --bg-color: #000;
    --bg-tab-color: #ddc385;
    --bg-tab-color-active: #fff;
    --tab-text-color: #000;
    --tab-text-color-active: #000;
}

.tabs {
    padding: 1rem 1rem 0;
    list-style: none;
    display: flex;
    justify-content: flex-start;
    border-bottom: 2px solid;

    li {
        position: relative;

        &::before,
        &::after {
            position: absolute;
            bottom: 0;
            background: var(--bg-tab-color);
            width: var(--square);
            aspect-ratio: 1;
        }

        &::before {
            left: calc(-1 * var(--square));
        }

        &::after {
            right: calc(-1 * var(--square));
        }
        
        &:last-child {
            &::after {
                content: "";
            }
            a::after {
                content: "";
            }
        }
        
        &:first-child {
            &::before {
                content: "";
            }
            a:before {
                content: "";
            }
        }

        &:first-child.active a::before,
        &:last-child.active a::after {
            background: var(--bg-color);
        }
    }

    a {
        display: inline-flex;
        padding: 10px 40px;
        text-decoration: none;
        color: var(--tab-text-color);
        background: var(--bg-tab-color);
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;

        &::before,
        &::after {
            position: absolute;
            bottom: 0;
            width: var(--circle);
            aspect-ratio: 1;
            border-radius: 50%;
            background: var(--bg-color);
            z-index: 2;
        }

        &::before {
            left: calc(-1 * var(--circle));
        }

        &::after {
            right: calc(-1 * var(--circle));
        }
    }

    .active {
        z-index: 3;
      
        &::before,
        &::after {
            content: "";
            background: var(--bg-tab-color-active);
            z-index: 1;
        }
      
        a {
            background: var(--bg-tab-color-active);
            color: var(--tab-text-color-active);
            
            &::before,
            &::after {
                content: "";
                background: var(--bg-tab-color);
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/114428769b704cdeaff8fe7d418526a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=354&s=721795&e=gif&f=188&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/vYMoVaY

  


上面这个示例，通过使用多个伪元素来实现。其实，采用 CSS 的 `mask` 将会是一个更好的方案。

  


我们想要实现的形状是一个正方形和一个圆形的交集：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d9bf7112d7a4ba090dcce44398500de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=482&s=731371&e=gif&f=171&b=f3f3f3)

  


正如上图所示，我们需要两个遮罩图，一个正方形，一个圆形，其中使用 `linear-gradient()` 绘制正方形，`radial-gradient()` 绘制圆形，然后应用 `mask` 的多层遮罩特性。最为关键的是，需要使用 `mask-composite` 属性对它们进行合成操作。

  


```CSS
.element {
    width: 480px;
    aspect-ratio: 1;
    background-image: 
        linear-gradient(to top, rgb(190 90 90 / .5), rgb(190 90 90 / .5)),
        radial-gradient(circle 300px at center, rgb(90 190 190 / .5) 80%, transparent 81%);
    background-size: 240px 240px, 100%;
    background-position: bottom left, center;
    background-repeat: no-repeat, repeat;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0238edd3d7134356bf0d859acb3407bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1010&s=271866&e=jpg&b=f6f0f0)

  


前面我们提到过，CSS 的 `mask` 的使用与 `background` 是非常相似的。换句话说，我们把上面的 `background-*` 相关属性替换成 `mask-*` 属性就完成了多层遮罩。只不过，在这个示例中，我们需要用到 `mask-composite` 属性，对两个渐变遮罩层进行合成，才能得到我们需要的图形：

  


```CSS
.element {
    width: 480px;
    aspect-ratio: 1;
    background-color: var(--active-bg, red);
    mask-image: linear-gradient(
        to top,
        rgb(190 90 90),
        rgb(190 90 90)
    ),
    radial-gradient(
        circle 300px at center,
        rgb(90 190 190) 80%,
        transparent 81%
    );
    mask-size: 240px 240px, 100%;
    mask-position: bottom left, center;
    mask-repeat: no-repeat, repeat;
    mask-composite: subtract; /* 这个很关键 */
}
```

  


注意，记得将渐变颜色中的透明度去掉，因为它会影响遮罩的效果。以上是一个右侧的形状，在此基础上只需调整遮罩图片位置，就可以得到左侧形状：

  


```CSS
.element {
    --bg-color-active: #09f;
    --text-color: #fff;
    --size: 32px;
    --square-size: calc(var(--size) / 2);
    --circle-size: calc(var(--size) / 2 * 1.25);
    --square-color: red;
    --circle-color: green;
    --mask-image: 
        linear-gradient(to top,var(--square-color),var(--square-color)),
        radial-gradient(circle var(--circle-size) at center,var(--circle-color) 80%,transparent 81%);
  
    display: inline-flex;
    border-radius: 0.5em 0.5em 0 0;
    font-size: 1.25rem;
    padding: 1em 1.5em;
    background-color: var(--bg-color-active);
    color: var(--text-color);
    position: relative;

    &::before,
    &::after {
        content: "";
        position: absolute;
        width: var(--size);
        aspect-ratio: 1;
        bottom: 0;
        background-color: var(--bg-color-active);
        mask-image: var(--mask-image);
        mask-size: var(--square-size) var(--square-size), 100%;
        mask-position: bottom left, center;
        mask-repeat: no-repeat, repeat;
        mask-composite: subtract;
    }

    &::before {
        right: 100%;
        mask-position: bottom right, center;
    }
  
    &::after {
        left: 100%;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b20b2d98e7f34862bcb8dc13a6cddfa7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1010&s=92473&e=jpg&b=ffffff)

把这个代码应用到前面的示例中，就可以得到一个 Chrome 浏览器选项卡的 UI 效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcffca4f4b2445829ac667c59907c853~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=476&s=475410&e=gif&f=117&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/mdYbbKy

  


还记得上一节课，我们[使用 SVG 的 `<clipPath>` 和 `clip-path` 实现带徽章的用户头像](https://juejin.cn/book/7341630791099383835/section/7362748816769941540)吗？

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c10c40fecad24f1083eddc65835398ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=721&s=149621&e=jpg&b=fefdfd)

  


> Demo 地址：https://codepen.io/airen/full/JjVVvJe

  


就这个效果而言，我们可以使用 CSS 的 `mask` 实现相似的效果：

  


```CSS
@layer demo {
    @property --s {
        syntax: "<length>";
        initial-value: 0px;
        inherits: true;
    }

    .avatar {
        --w: 200px; /* 用户头像尺寸 */
        --s: 10px; /* 控制指示器尺寸 */
        --g: 1.5px; /* 控制间隙(+默认间隙) */
        display: block;
        object-fit: cover;
        object-position: center;
        width: var(--w);
        aspect-ratio: 1;
        outline: var(--s) solid oklch(0.81 0.3 138.55);
        outline-offset: -9e9q;
        mask: radial-gradient(#000 calc(var(--s) - 1px), #0000 var(--s)),
              radial-gradient(#000 70%, #0000 71%) content-box subtract,
              radial-gradient( #000 calc(sqrt(2) * var(--s) + var(--g)), #0000 calc(sqrt(2) * var(--s) + var(--g) + 1px) );
        /* 仅用于减少鼠标交互区域 */
        clip-path: circle(calc(var(--w) / 2 + var(--s))) content-box;
        cursor: pointer;
        transition: --s 0.5s;
        box-sizing: content-box;
        
        &:hover {
            --s: 16px;
        }
    
        &:nth-child(1) {
            padding: 0 calc(var(--w) / sqrt(2)) calc(var(--w) / sqrt(2)) 0;
            margin: 0 calc(-1 * var(--w) / sqrt(2)) calc(-1 * var(--w) / sqrt(2)) 0;
        }
        
        &:nth-child(2) {
            padding: 0 0 calc(var(--w)/sqrt(2)) calc(var(--w)/sqrt(2));
            margin: 0 0 calc(-1*var(--w)/sqrt(2)) calc(-1*var(--w)/sqrt(2));
        }
        
        &:nth-child(3) {
            padding: calc(var(--w)/sqrt(2)) calc(var(--w)/sqrt(2)) 0 0;
            margin: calc(-1*var(--w)/sqrt(2)) calc(-1*var(--w)/sqrt(2)) 0 0;
        }
        
        &:nth-child(4) {
            padding: calc(var(--w)/sqrt(2)) 0 0 calc(var(--w)/sqrt(2));
            margin: calc(-1*var(--w)/sqrt(2)) 0 0 calc(-1*var(--w)/sqrt(2));
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ca78b00c0014c49932909a49d920523~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=554&s=2466842&e=gif&f=99&b=0c424a)

  


> Demo 地址：https://codepen.io/airen/full/OJYLJVp

  


这里展示的只是 CSS `mask` 的一小部分应用案例，实际上，在前端开发中，`mask` 有着广泛的应用场景。除了已经展示的功能外，我们还可以利用 `mask` 实现更多复杂的图形效果、遮罩效果和动画效果。例如，利用 `mask` 可以实现图片的不规则裁剪、创建有趣的按钮效果、制作炫酷的文字动画，甚至可以用于创建复杂的图形背景等。只要有创意，`mask` 的潜力是无限的，它可以让你的网页更加生动、丰富多彩。

  


不过，这节课的主题是 SVG 遮罩，因此，有关于 CSS 的遮罩（`mask`）相关的讨论就到此为止。接下来，我们一起进入到 SVG 遮罩的世界。

  


## SVG 遮罩

  


在 SVG 中，我们可以使用 `<mask>` 元素创建遮罩效果。类似于 `<clipPath>` 元素，`<mask>` 允许在内部使用各种形状（如 `<rect>`、`<circle>`、`<polygon>`、`<path>`）和渐变等来绘制遮罩图形。接着，通过 `mask` 属性，将 `<mask>` 中定义的遮罩效果应用于 SVG 或 HTML 元素，从而为它们添加遮罩效果。这为你创造各种复杂的遮罩效果提供了可能性。

  


以下是一个在 `<mask>` 中使用 `<path>` 创建的遮罩图形：

  


```XML
<svg class="sr-only">
    <defs>
        <mask id="fingerprint"  mask-type="luminance" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <path id="test" fill="#fff" d="M0.094,0.508 c0,-0.228,0.182,-0.413,0.406,-0.413 c0.123,0,0.234,0.056,0.308,0.144 c0.017,0.02,0.046,0.022,0.066,0.005 s0.022,-0.047,0.005,-0.067 C0.788,0.069,0.652,0,0.5,0 C0.224,0,0,0.227,0,0.508 v0.079 c0,0.026,0.021,0.048,0.047,0.048 s0.047,-0.021,0.047,-0.048 v-0.079 m0.895,-0.105 c-0.005,-0.026,-0.03,-0.042,-0.055,-0.037 s-0.042,0.031,-0.036,0.056 c0.006,0.028,0.009,0.056,0.009,0.086 v0.079 c0,0.026,0.021,0.048,0.047,0.048 s0.047,-0.021,0.047,-0.048 V0.508 c0,-0.036,-0.004,-0.071,-0.011,-0.105 M0.5,0.159 c-0.037,0,-0.073,0.006,-0.106,0.017 c-0.03,0.01,-0.037,0.047,-0.016,0.071 c0.014,0.016,0.037,0.021,0.057,0.016 c0.021,-0.006,0.043,-0.009,0.065,-0.009 c0.138,0,0.25,0.114,0.25,0.254 v0.049 c0,0.05,-0.003,0.1,-0.009,0.149 c-0.003,0.029,0.018,0.055,0.047,0.055 c0.023,0,0.043,-0.017,0.045,-0.04 c0.006,-0.054,0.01,-0.109,0.01,-0.164 v-0.05 c0,-0.193,-0.154,-0.349,-0.344,-0.349 m-0.206,0.136 c-0.018,-0.021,-0.049,-0.023,-0.066,-0.001 C0.183,0.353,0.156,0.427,0.156,0.508 v0.049 c0,0.048,-0.005,0.096,-0.015,0.143 c-0.007,0.031,0.015,0.062,0.047,0.062 c0.021,0,0.039,-0.014,0.043,-0.034 c0.012,-0.056,0.019,-0.113,0.019,-0.17 V0.508 c0,-0.054,0.017,-0.104,0.045,-0.145 c0.014,-0.021,0.016,-0.049,0,-0.068 M0.5,0.317 c-0.103,0,-0.187,0.085,-0.187,0.19 v0.049 c0,0.071,-0.009,0.142,-0.027,0.211 c-0.007,0.028,0.013,0.058,0.042,0.058 c0.019,0,0.035,-0.012,0.04,-0.031 c0.021,-0.077,0.031,-0.157,0.031,-0.238 V0.508 c0,-0.057,0.045,-0.103,0.102,-0.103 s0.102,0.046,0.102,0.103 v0.049 c0,0.072,-0.007,0.144,-0.02,0.214 c-0.005,0.028,0.015,0.054,0.043,0.054 c0.02,0,0.037,-0.014,0.041,-0.034 c0.015,-0.077,0.023,-0.155,0.023,-0.234 V0.508 c0,-0.105,-0.084,-0.19,-0.187,-0.19 m0.047,0.19 c0,-0.026,-0.021,-0.048,-0.047,-0.048 s-0.047,0.021,-0.047,0.048 v0.049 c0,0.119,-0.021,0.237,-0.063,0.348 l-0.012,0.03 c-0.009,0.025,0.003,0.052,0.027,0.062 s0.051,-0.003,0.061,-0.027 l0.012,-0.03 A1,1,0,0,0,0.547,0.557 V0.508"/>
        </mask> 
    </defs>
</svg>
```

  


`<path>` 路径绘制了一个类似指纹的图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01499f3dffa0421d8cbc3b795fc75824~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1010&s=142533&e=jpg&b=000000)

  


```XML
<svg viewBox="0 0 512 512">
    <path d="M48 256c0-114.9 93.1-208 208-208 63.1 0 119.6 28.1 157.8 72.5 8.6 10.1 23.8 11.2 33.8 2.6s11.2-23.8 2.6-33.8C403.3 34.6 333.7 0 256 0 114.6 0 0 114.6 0 256v40c0 13.3 10.7 24 24 24s24-10.7 24-24v-40zm458.5-52.9c-2.7-13-15.5-21.3-28.4-18.5s-21.3 15.5-18.5 28.4c2.9 13.9 4.5 28.3 4.5 43.1v40c0 13.3 10.7 24 24 24s24-10.7 24-24V256c0-18.1-1.9-35.8-5.5-52.9zM256 80c-19 0-37.4 3-54.5 8.6-15.2 5-18.7 23.7-8.3 35.9 7.1 8.3 18.8 10.8 29.4 7.9 10.6-2.9 21.8-4.4 33.4-4.4 70.7 0 128 57.3 128 128v24.9c0 25.2-1.5 50.3-4.4 75.3-1.7 14.6 9.4 27.8 24.2 27.8 11.8 0 21.9-8.6 23.3-20.3 3.3-27.4 5-55 5-82.7v-25c0-97.2-78.8-176-176-176zm-105.3 68.7c-9.1-10.6-25.3-11.4-33.9-.4C93.7 178 80 215.4 80 256v24.9c0 24.2-2.6 48.4-7.8 71.9-3.4 15.6 7.9 31.2 23.9 31.2 10.5 0 19.9-7 22.2-17.3 6.4-28.1 9.7-56.8 9.7-85.8V256c0-27.2 8.5-52.4 22.9-73.1 7.2-10.4 8-24.6-.2-34.2zM256 160c-53 0-96 43-96 96v24.9c0 35.9-4.6 71.5-13.8 106.1-3.8 14.3 6.7 29 21.5 29 9.5 0 17.9-6.2 20.4-15.4 10.5-39 15.9-79.2 15.9-119.7V256c0-28.7 23.3-52 52-52s52 23.3 52 52v24.9c0 36.3-3.5 72.4-10.4 107.9-2.7 13.9 7.7 27.2 21.8 27.2 10.2 0 19-7 21-17 7.7-38.8 11.6-78.3 11.6-118.1V256c0-53-43-96-96-96zm24 96c0-13.3-10.7-24-24-24s-24 10.7-24 24v24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8l5.9-15.3A536.19 536.19 0 0 0 280 280.9V256z"/>
</svg>
```

  


注意，需要将 `<path>` 元素的 `d` 属性值转换为相对值，然后再将其应用于 `<mask>` 中的 `<path>` 。

  


我们分别将 `<mask>` 定义的遮罩分别应用于 HTML 元素 `<img>` 和 SVG 的 `<image>` 元素上：

  


```HTML
<img src="https://picsum.photos/id/19/800/800" alt="" class="mask">
<svg class="element" viewBox="0 0 800 800" width="800" height="800">
    <image href="https://picsum.photos/id/19/800/800" mask="url(#fingerprint)"/>
</svg>
```

  


```CSS
.mask {
    mask: url(#fingerprint);
}
```

  


正如你所见，对于 HTML 元素，我们使用 CSS 的 `mask` 属性引用 `<mask>` 定义的遮罩图形；对于 SVG 元素，则是使用相应元素的 `mask` 属性来引用 `<mask>` 定义的遮罩图形。它们的最终效果非常相似：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6437bd31be0442dea7ecfb7c200e94c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1029&s=736924&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/QWRLKGP

  


你可能已经发现了，我们在 `<mask>` 元素上设置了 `id` 、`maskUnits` 、`maskContentUnits` 和 `mask-type` 等属性。 这些属性对于 `<mask>` 来说非常重要。

  


-   `id` ：定义遮罩的唯一标识符
-   `maskUnits` ：指定遮罩的坐标系统，默认为 `userSpaceOnUse` ，即使用用户坐标系统；另一个选项是 `objectBoundingBox` ，表示使用目标元素的边界框作为坐标系统
-   `maskContentUnits` ：指定遮罩内容的坐标系统，类似于 `maskUnits`
-   `mask-type` ：指定遮罩的类型，确定了遮罩是作为亮度遮罩（`luminance`）还是透明（`alpha`）度遮罩进行处理

  


需要注意的是，`<mask>` 元素内部的内容（嵌套的元素）可以包括各种图形元素、渐变、滤镜等。通常情况下，它会被放置在 `<defs>` 元素中，以便在需要时重复引用。

  


此外，`<mask>` 元素定义的遮罩默认不会在 SVG 画布上显示，而是需要通过在目标元素的 `mask` 属性中引用遮罩的 ID，即 `url(#maskIdName)`，才能将遮罩应用到目标元素上。

  


通过使用 `<mask>` 元素，你可以创建各种视觉效果，如镂空文本、图像淡出、图形遮罩等。这使得 SVG 具有了更多的设计和创意可能性，可以用来打造生动丰富的网页内容。在实际操作之前，我们有必要先了解 `<mask>` 元素的几个重要属性及其功能。

  


### maskUnits 属性

  


`<mask>` 元素的 `maskUnits` 属性与 `<clipPath>` 元素的 `clipPathUnits` 属性非常相似。对于 `<mask>` 元素， `maskUnits` 属性定义了元素几何属性（`x` 、`y` 、`width` 和 `height`）所使用的坐标系统，即指定了遮罩的坐标系统。这个属性决定了定义遮罩的坐标空间，即确定了遮罩元素内部的坐标系统。`maskUnits` 属性有两个值可选：`objectBoundingBox` 和 `userSpaceOnUse`。

  


-   `objectBoundingBox`：这是 `maskUnits` 的默认值。当使用 `objectBoundingBox` 时，遮罩元素的大小会相对于所应用的元素的边界框进行缩放。也就是说，坐标（`x` 和 `y`）和尺寸（`width` 和 `height`）是相对于所应用的元素的边界框（bbox）的，边界框可以被视为与 `viewBox="0 0 1 1"` 绑定的 `<mask>` 内容相同。例如，如果一个矩形元素的宽度是 `100%`，而 `maskUnits` 被设置为 `objectBoundingBox`，那么遮罩的宽度也将等于这个矩形元素的宽度。
-   `userSpaceOnUse`：当使用 `userSpaceOnUse` 时，遮罩元素的大小将相对于整个用户坐标系统（用户空间）来确定。这意味着遮罩元素的坐标和尺寸将是相对于 SVG 画布的。使用这个值时，遮罩的大小和位置不会随所应用的元素的大小和位置而变化，而是保持不变。

  


需要知道的是，通过诸如 Figma 设计软件获得的遮罩图形，其使用的单位是绝对值。如果 `maskUnits` 被设置为 `objectBoundingBox` ，那么需要使用前面提到的转换工具，将其转换为相对坐标。换句话说，遮罩图形的 `x` 、`y` 、`width` 和 `height` 的值都在 `[0,1]` 分值范围内。

  


下面这个示例， `maskUnits` 属性的值分别为 `objectBoundingBox` 和 `userSpaceOnUse` ：

  


```XML
<svg class="sr-only">
    <defs>
      <mask id="objectBoundingBox"  mask-type="luminance" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
          <path  fill="#fff" d="M0.094,0.508 c0,-0.228,0.182,-0.413,0.406,-0.413 c0.123,0,0.234,0.056,0.308,0.144 c0.017,0.02,0.046,0.022,0.066,0.005 s0.022,-0.047,0.005,-0.067 C0.788,0.069,0.652,0,0.5,0 C0.224,0,0,0.227,0,0.508 v0.079 c0,0.026,0.021,0.048,0.047,0.048 s0.047,-0.021,0.047,-0.048 v-0.079 m0.895,-0.105 c-0.005,-0.026,-0.03,-0.042,-0.055,-0.037 s-0.042,0.031,-0.036,0.056 c0.006,0.028,0.009,0.056,0.009,0.086 v0.079 c0,0.026,0.021,0.048,0.047,0.048 s0.047,-0.021,0.047,-0.048 V0.508 c0,-0.036,-0.004,-0.071,-0.011,-0.105 M0.5,0.159 c-0.037,0,-0.073,0.006,-0.106,0.017 c-0.03,0.01,-0.037,0.047,-0.016,0.071 c0.014,0.016,0.037,0.021,0.057,0.016 c0.021,-0.006,0.043,-0.009,0.065,-0.009 c0.138,0,0.25,0.114,0.25,0.254 v0.049 c0,0.05,-0.003,0.1,-0.009,0.149 c-0.003,0.029,0.018,0.055,0.047,0.055 c0.023,0,0.043,-0.017,0.045,-0.04 c0.006,-0.054,0.01,-0.109,0.01,-0.164 v-0.05 c0,-0.193,-0.154,-0.349,-0.344,-0.349 m-0.206,0.136 c-0.018,-0.021,-0.049,-0.023,-0.066,-0.001 C0.183,0.353,0.156,0.427,0.156,0.508 v0.049 c0,0.048,-0.005,0.096,-0.015,0.143 c-0.007,0.031,0.015,0.062,0.047,0.062 c0.021,0,0.039,-0.014,0.043,-0.034 c0.012,-0.056,0.019,-0.113,0.019,-0.17 V0.508 c0,-0.054,0.017,-0.104,0.045,-0.145 c0.014,-0.021,0.016,-0.049,0,-0.068 M0.5,0.317 c-0.103,0,-0.187,0.085,-0.187,0.19 v0.049 c0,0.071,-0.009,0.142,-0.027,0.211 c-0.007,0.028,0.013,0.058,0.042,0.058 c0.019,0,0.035,-0.012,0.04,-0.031 c0.021,-0.077,0.031,-0.157,0.031,-0.238 V0.508 c0,-0.057,0.045,-0.103,0.102,-0.103 s0.102,0.046,0.102,0.103 v0.049 c0,0.072,-0.007,0.144,-0.02,0.214 c-0.005,0.028,0.015,0.054,0.043,0.054 c0.02,0,0.037,-0.014,0.041,-0.034 c0.015,-0.077,0.023,-0.155,0.023,-0.234 V0.508 c0,-0.105,-0.084,-0.19,-0.187,-0.19 m0.047,0.19 c0,-0.026,-0.021,-0.048,-0.047,-0.048 s-0.047,0.021,-0.047,0.048 v0.049 c0,0.119,-0.021,0.237,-0.063,0.348 l-0.012,0.03 c-0.009,0.025,0.003,0.052,0.027,0.062 s0.051,-0.003,0.061,-0.027 l0.012,-0.03 A1,1,0,0,0,0.547,0.557 V0.508"/>
      </mask>
      
      <mask id="objectBoundingBox" mask-type="luminance" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
          <path  fill="#fff" d="M48 256c0-114.9 93.1-208 208-208 63.1 0 119.6 28.1 157.8 72.5 8.6 10.1 23.8 11.2 33.8 2.6s11.2-23.8 2.6-33.8C403.3 34.6 333.7 0 256 0 114.6 0 0 114.6 0 256v40c0 13.3 10.7 24 24 24s24-10.7 24-24v-40zm458.5-52.9c-2.7-13-15.5-21.3-28.4-18.5s-21.3 15.5-18.5 28.4c2.9 13.9 4.5 28.3 4.5 43.1v40c0 13.3 10.7 24 24 24s24-10.7 24-24V256c0-18.1-1.9-35.8-5.5-52.9zM256 80c-19 0-37.4 3-54.5 8.6-15.2 5-18.7 23.7-8.3 35.9 7.1 8.3 18.8 10.8 29.4 7.9 10.6-2.9 21.8-4.4 33.4-4.4 70.7 0 128 57.3 128 128v24.9c0 25.2-1.5 50.3-4.4 75.3-1.7 14.6 9.4 27.8 24.2 27.8 11.8 0 21.9-8.6 23.3-20.3 3.3-27.4 5-55 5-82.7v-25c0-97.2-78.8-176-176-176zm-105.3 68.7c-9.1-10.6-25.3-11.4-33.9-.4C93.7 178 80 215.4 80 256v24.9c0 24.2-2.6 48.4-7.8 71.9-3.4 15.6 7.9 31.2 23.9 31.2 10.5 0 19.9-7 22.2-17.3 6.4-28.1 9.7-56.8 9.7-85.8V256c0-27.2 8.5-52.4 22.9-73.1 7.2-10.4 8-24.6-.2-34.2zM256 160c-53 0-96 43-96 96v24.9c0 35.9-4.6 71.5-13.8 106.1-3.8 14.3 6.7 29 21.5 29 9.5 0 17.9-6.2 20.4-15.4 10.5-39 15.9-79.2 15.9-119.7V256c0-28.7 23.3-52 52-52s52 23.3 52 52v24.9c0 36.3-3.5 72.4-10.4 107.9-2.7 13.9 7.7 27.2 21.8 27.2 10.2 0 19-7 21-17 7.7-38.8 11.6-78.3 11.6-118.1V256c0-53-43-96-96-96zm24 96c0-13.3-10.7-24-24-24s-24 10.7-24 24v24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8l5.9-15.3A536.19 536.19 0 0 0 280 280.9V256z"/>
      </mask>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc1c29e9c4864a69933b7f2ca8449cea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1029&s=577385&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/KKLPQdz

  


在实际应用中，你可以根据具体需求选择适合的 `maskUnits` 值。`objectBoundingBox` 可以使得遮罩元素与所应用元素保持一致的缩放比例，而 `userSpaceOnUse` 则可以让你更灵活地控制遮罩元素的大小和位置，独立于所应用元素。

  


### maskContentUnits 属性

  


`maskContentUnits` 属性用于指定 `<mask>` 元素中内容的坐标系统。它决定了 `<mask>` 元素内部定义的图形的尺寸单位。与 `maskUnits` 类似，它也接受 `userSpaceOnUse` 或 `objectBoundingBox` 作为值。如果没有传递值，则默认使用 `userSpaceOnUse` 值。

  


-   `userSpaceOnUse` ：当 `maskContentUnits` 设置为 `userSpaceOnUse` 时，表示 `<mask>` 元素内部定义的图形的坐标使用用户坐标系统。这意味着图形的尺寸将以像素或其他用户定义的单位进行测量，不受外部容器的影响。
-   `objectBoundingBox` ：当 `maskContentUnits` 设置为 `objectBoundingBox` 时，表示 `<mask>` 元素内部定义的图形的坐标相对于元素的边界框进行定位。这意味着图形的尺寸将相对于元素的宽度和高度的百分比进行定义，范围从 `0 ~ 1`，其中 `0` 表示边界框的起始位置，`1` 表示边界框的结束位置。

  


### mask-type 属性

  


前面我们提到过，遮罩可以分为`luminance` （高亮）遮罩和 `alpha` （带有 Alpha 通道）遮罩。SVG 的 `mask-type` 属性就是用于确定一个 SVG `<mask>` 元素是被视为 `luminance` 遮罩还是 `alpha` 遮罩。这个属性适用于 `<mask>` 元素本身。

  


那么，在实际使用的时候，我们应该如何给 `<mask>` 元素设置一个适合的 `mask-type` 属性值呢？在回答这个问题之前，我们有必要更深入的了解高亮遮罩和带有 Alpha 通道遮罩的工作原理。

  


假设你使用 SVG 的 `<path>` 绘制了一个类似下图的遮罩图形，分别填充了黑色（`#000`）、白色（`#fff`）和一个线渐渐变色(`linear-gradient(to bottom, #000, transparent, #fff)`)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d806dfd720704b21a0b1519fa294f63e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1029&s=279786&e=jpg&b=255f8b)

  


使用 `<mask>` 分别将它们定义为三个不同的遮罩：

  


```XML
<svg class="sr-only">
    <defs>
        <linearGradient id="linearGradient" x2="0" y2="1">
            <stop offset="0" stop-color="#000" />
            <stop offset="0.5" stop-color="#0000" />
            <stop offset="1" stop-color="#fff" />
        </linearGradient>
    
        <mask id="maskBlack" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#mPath" fill="#000" />
        </mask>
        <mask id="maskWhite" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#mPath" fill="#fff" />
        </mask>
        <mask id="maskLinearGradient" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#mPath" fill="url(#linearGradient)" />
        </mask>
        <path id="mPath" d="M0.142,0.135 C0.103,0.161,0.03,0.064,0.03,0.117 c0,0.031,0.052,0.038,0.039,0.065 c-0.012,0.026,-0.046,-0.02,-0.064,0 c-0.026,0.03,0.055,0.039,0.064,0.081 c0.004,0.021,0.008,0.035,0,0.054 c-0.007,0.016,-0.029,0.012,-0.029,0.029 c0.001,0.021,0.029,0.004,0.043,0.017 c0.038,0.037,-0.084,0.061,-0.078,0.119 c0.003,0.026,0.008,0.043,0.025,0.06 c0.04,0.041,0.073,-0.107,0.118,-0.076 c0.013,0.009,0.022,0.015,0.027,0.031 c0.011,0.035,-0.065,0.033,-0.056,0.068 c0.005,0.018,0.014,0.028,0.029,0.036 c0.02,0.011,0.047,-0.032,0.056,-0.008 c0.006,0.015,-0.004,0.026,-0.009,0.042 c-0.028,0.099,-0.2,0.085,-0.165,0.18 c0.01,0.026,0.015,0.053,0.039,0.057 c0.024,0.004,0.026,-0.045,0.051,-0.043 c0.017,0.001,0.031,0.007,0.038,0.025 c0.01,0.027,-0.042,0.031,-0.038,0.06 c0.003,0.024,0.02,0.03,0.038,0.043 c0.062,0.048,0.113,-0.062,0.184,-0.043 c0.025,0.006,0.052,-0.002,0.061,0.026 c0.012,0.037,-0.099,0.012,-0.078,0.043 c0.015,0.021,0.035,0.014,0.058,0.011 c0.027,-0.004,0.036,-0.032,0.064,-0.037 c0.036,-0.007,0.054,0.022,0.091,0.026 c0.122,0.013,0.163,-0.144,0.284,-0.155 c0.069,-0.006,0.2,0.102,0.175,0.025 c-0.011,-0.035,-0.044,-0.034,-0.057,-0.068 c-0.016,-0.041,0.015,-0.074,0,-0.115 c-0.011,-0.03,-0.033,-0.034,-0.045,-0.064 c-0.01,-0.024,0,-0.045,-0.014,-0.065 c-0.026,-0.037,-0.091,0.046,-0.104,0 c-0.008,-0.03,0.022,-0.044,0.023,-0.076 c0.001,-0.035,-0.002,-0.062,-0.023,-0.085 c-0.038,-0.042,-0.125,0.11,-0.127,0.048 c-0.002,-0.041,0.047,-0.043,0.052,-0.084 c0.006,-0.05,-0.063,-0.065,-0.052,-0.113 c0.005,-0.024,0.031,-0.027,0.03,-0.051 c-0.001,-0.023,-0.012,-0.037,-0.03,-0.047 c-0.027,-0.015,-0.041,0.04,-0.07,0.036 c-0.029,-0.004,-0.054,-0.02,-0.061,-0.054 c-0.01,-0.048,0.094,-0.042,0.077,-0.087 C0.581,-0.004,0.549,0.004,0.518,0 C0.429,-0.01,0.39,0.217,0.325,0.145 c-0.009,-0.01,-0.01,-0.02,-0.019,-0.028 c-0.023,-0.019,-0.044,0.005,-0.071,0 c-0.023,-0.004,-0.036,-0.029,-0.058,-0.02 c-0.017,0.007,-0.018,0.028,-0.034,0.039" />
    </defs>
</svg>
```

  


将这三个遮罩应用于 `img` 元素上：

  


```HTML
<img style="--mask: url(#maskBlack)" src="https://picsum.photos/id/19/800/800" alt="" class="mask" />
<img style="--mask: url(#maskWhite)" src="https://picsum.photos/id/19/800/800" alt="" class="mask" />
<img style="--mask: url(#maskLinearGradient)" src="https://picsum.photos/id/19/800/800" alt="" class="mask" />
```

  


```CSS
.mask {
    mask: var(--mask);
}
```

  


你会发现，遮罩图形 `<path>` 的 `fill` 为 `#000` （黑色）时，整个图像都不可见：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16667b62e56746db82c44d719aa805ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2798&s=1523895&e=jpg&b=002341)

  


> Demo 地址：https://codepen.io/airen/full/zYQORWW

  


一旦我们将 `<mask>` 的 `mask-type` 设置为 `alpha` 时，整个效果又将不同：

  


```XML
<svg class="sr-only">
    <defs>
        <linearGradient id="linearGradient" x2="0" y2="1">
            <stop offset="0" stop-color="#000" />
            <stop offset="0.5" stop-color="#0000" />
            <stop offset="1" stop-color="#fff" />
        </linearGradient>
    
        <mask id="maskBlack" mask-type="alpha" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#mPath" fill="#000" />
        </mask>
        <mask id="maskWhite" mask-type="alpha" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#mPath" fill="#fff" />
        </mask>
        <mask id="maskLinearGradient" mask-type="alpha" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#mPath" fill="url(#linearGradient)" />
        </mask>
        <path id="mPath" d="M0.142,0.135 C0.103,0.161,0.03,0.064,0.03,0.117 c0,0.031,0.052,0.038,0.039,0.065 c-0.012,0.026,-0.046,-0.02,-0.064,0 c-0.026,0.03,0.055,0.039,0.064,0.081 c0.004,0.021,0.008,0.035,0,0.054 c-0.007,0.016,-0.029,0.012,-0.029,0.029 c0.001,0.021,0.029,0.004,0.043,0.017 c0.038,0.037,-0.084,0.061,-0.078,0.119 c0.003,0.026,0.008,0.043,0.025,0.06 c0.04,0.041,0.073,-0.107,0.118,-0.076 c0.013,0.009,0.022,0.015,0.027,0.031 c0.011,0.035,-0.065,0.033,-0.056,0.068 c0.005,0.018,0.014,0.028,0.029,0.036 c0.02,0.011,0.047,-0.032,0.056,-0.008 c0.006,0.015,-0.004,0.026,-0.009,0.042 c-0.028,0.099,-0.2,0.085,-0.165,0.18 c0.01,0.026,0.015,0.053,0.039,0.057 c0.024,0.004,0.026,-0.045,0.051,-0.043 c0.017,0.001,0.031,0.007,0.038,0.025 c0.01,0.027,-0.042,0.031,-0.038,0.06 c0.003,0.024,0.02,0.03,0.038,0.043 c0.062,0.048,0.113,-0.062,0.184,-0.043 c0.025,0.006,0.052,-0.002,0.061,0.026 c0.012,0.037,-0.099,0.012,-0.078,0.043 c0.015,0.021,0.035,0.014,0.058,0.011 c0.027,-0.004,0.036,-0.032,0.064,-0.037 c0.036,-0.007,0.054,0.022,0.091,0.026 c0.122,0.013,0.163,-0.144,0.284,-0.155 c0.069,-0.006,0.2,0.102,0.175,0.025 c-0.011,-0.035,-0.044,-0.034,-0.057,-0.068 c-0.016,-0.041,0.015,-0.074,0,-0.115 c-0.011,-0.03,-0.033,-0.034,-0.045,-0.064 c-0.01,-0.024,0,-0.045,-0.014,-0.065 c-0.026,-0.037,-0.091,0.046,-0.104,0 c-0.008,-0.03,0.022,-0.044,0.023,-0.076 c0.001,-0.035,-0.002,-0.062,-0.023,-0.085 c-0.038,-0.042,-0.125,0.11,-0.127,0.048 c-0.002,-0.041,0.047,-0.043,0.052,-0.084 c0.006,-0.05,-0.063,-0.065,-0.052,-0.113 c0.005,-0.024,0.031,-0.027,0.03,-0.051 c-0.001,-0.023,-0.012,-0.037,-0.03,-0.047 c-0.027,-0.015,-0.041,0.04,-0.07,0.036 c-0.029,-0.004,-0.054,-0.02,-0.061,-0.054 c-0.01,-0.048,0.094,-0.042,0.077,-0.087 C0.581,-0.004,0.549,0.004,0.518,0 C0.429,-0.01,0.39,0.217,0.325,0.145 c-0.009,-0.01,-0.01,-0.02,-0.019,-0.028 c-0.023,-0.019,-0.044,0.005,-0.071,0 c-0.023,-0.004,-0.036,-0.029,-0.058,-0.02 c-0.017,0.007,-0.018,0.028,-0.034,0.039" />
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e7b355e5b52479b8c0816dd3e291b71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2395&s=1698901&e=jpg&b=012341)

  


> Demo 地址：https://codepen.io/airen/full/MWdgGWd

  


注意，`mask-type` 属性的默认值为 `luminance` 。

  


很奇怪，是吧！当 `mask-type` 属性为 `luminance` 时，填充色越接近亮色（如白色），越可见；反之则越不可见。当 `mask-type` 属性为 `alpha` 时，透明度值越接近 `1` （完全可见）时，越可见；反之则越不可见。简单地说：

  


-   `luminance`：表示关联的遮罩图像是亮度遮罩，即在应用遮罩时要使用其相对亮度值
-   `alpha`：表示关联的遮罩图像是 Alpha 遮罩，即在应用遮罩时要使用其 alpha 通道值

  


简单地解释一下。

  


遮罩为高亮遮罩时，应该使用图像的亮度值。它的意思是，当使用高亮遮罩时，给定点的遮罩值首先会从颜色通道值计算亮度，然后将计算的亮度值乘以相应的 Alpha 值来产生遮罩值。其中，亮度值由遮罩的 RGB 值和亮度系数来确定：

  


```
luma =（0.2126 * R + 0.7152 * G + 0.0722 * B）
```

  


为了确定对象的透明度，然后将对象的 Alpha 通道乘以亮度值和遮罩的 Alpha 通道。这意味着，在高亮遮罩中，颜色和 Alpha 值都很重要。当 Alpha 值为 `0` (即完全透明)时，元素会被隐藏；当 Alpha 值为 `1` 时，遮罩值取决于像素的颜色通道，即根据颜色通道值计算出来的亮度值。这也就是，为什么 `mask-type` 为 `luminance` 时，遮罩图形颜色为白色时，元素可见；遮罩图形为黑色时，元素不可见。

  


注意，高亮遮罩图形的填充颜色可以是任何颜色，只不过，颜色不同，计算出来的亮度值也将不同，会最终影响遮罩效果。亮度值越高，元素越可见；反之则越不可见！

  


Alpha 遮罩与高亮遮罩不同的是，它以遮罩图形的 Alpha 值作为遮罩值。在图形学中，图像由像素组成，每个像素包含颜色值。有些颜色值包含 Alpha 通道，用于设置颜色的透明度。具有 Alpha 通道的图像可以是 Alpha 遮罩，例如上面示例中的渐变遮罩，黑色和白色区域的 Alpha 值为 `1`，透明区域的 Alpha 值为 `0`。当 Alpha 值越接近 `1` 时，元素越可见，反之越接近 `0` 时，元素越不可见。

  


另外，在简单的遮罩操作中，我们有一个元素和一个放置在其上方的遮罩图像。遮罩图像中每个像素的 Alpha 值将与元素中对应的像素进行合并。如果 Alpha值为 `0`（即透明），则它获胜，并且元素的那部分被遮罩（即隐藏）；Alpha值为 `1`（即完全不透明）时，显示这些像素；Alpha值介于 `0 ~ 1` 之间（例如 `0.5`）时，像素可见，但具有一定的透明度。

  


总之，给定点的遮罩值是遮罩图像该点处的 Alpha通道值。如果该点完全透明（即 Alpha 值为 `0`），则不会显示。反之，如果完全不透明（即 Alpha 值为 `1`），则该点完全显示。

  


有一点尤其重要，当你在 CSS 中显式设置了 `mask-mode` 属性值时，它将会覆盖 SVG 的 `<mask>` 元素上 `mask-type` 属性的值。CSS 的 `mask-mode` 与应用于 `<mask>` 元素的 `mask-type` 属性所起的作用是相似的，也是用来确定遮罩是作为高亮遮罩还是 Alpha 遮罩。`alpha` 值控制了遮罩允许的透明度程度，而 `luminance` 值则控制了发出的光的强度。

  


这意味着，你既可以在 SVG 的 `<mask>` 元素上使用 `mask-type` 属性，也可以在 CSS 中使用 `mask-mode` 属性来确定遮罩是作为高亮遮罩还是 Alpha 遮罩。

  


## SVG 遮罩案例

  


在之前的学习中，你已经对 SVG 遮罩的理论知识有了一定的了解。现在，我们将通过实际案例进一步探索 SVG 遮罩的应用。作为一种强大的技术，SVG 遮罩可以实现各种视觉效果和图形处理。在接下来的案例中，我们将深入探讨如何利用 SVG 遮罩来创建镂空效果、图像淡出以及光影效果等。通过这些实际案例，你将更全面地了解 SVG 遮罩的潜力，以及如何在 Web 开发中巧妙运用它，为网站增添更多的视觉吸引力。

  


### 镂空效果

  


镂空效果是 Web 中常见的一种效果。

  


我们结合 SVG 的 `<mask>` 和 CSS 的 `mask-*` 相关特性，可以实现很多有创意的镂空效果，例如优惠卷 UI，就是其中典型案例之一：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9ae78f60caa48c7afb45a1e8a434673~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2206&s=1598618&e=jpg&b=012341)

  


首先，我们可以使用 SVG 的 `<mask>` 来创建遮罩图形，它比 CSS 的渐变要灵活得多：

  


```XML
<svg viewBox="0 0 1 1">
    <defs>
        <mask id="maskDots" mask-type="alpha" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#dots" />
        </mask>
        <mask id="maskRect" mask-type="alpha" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="rgb(210 210 10 / 1)">
        </mask>
        <g id="dots">
            <g id="top" fill="rgb(210 210 10 / 1)">
                <circle cx="0" cy="0" r=".05" />
                <circle cx=".20" cy="0" r=".05" />
                <circle cx=".40" cy="0" r=".05" />
                <circle cx=".60" cy="0" r=".05" />
                <circle cx=".80" cy="0" r=".05" />
                <circle cx="1" cy="0" r=".05" />
            </g>
    
            <g id="bottom" fill="rgb(210 210 10 / 1)">
                <circle cx="0" cy="1" r=".05" />
                <circle cx=".20" cy="1" r=".05" />
                <circle cx=".40" cy="1" r=".05" />
                <circle cx=".60" cy="1" r=".05" />
                <circle cx=".80" cy="1" r=".05" />
                <circle cx="1" cy="1" r=".05" />
            </g>
    
            <g id="left" fill="rgb(210 210 10 / 1)">
                <circle cy="0" cx="0" r=".05" />
                <circle cy=".20" cx="0" r=".05" />
                <circle cy=".40" cx="0" r=".05" />
                <circle cy=".60" cx="0" r=".05" />
                <circle cy=".80" cx="0" r=".05" />
                <circle cy="1" cx="0" r=".05" />
            </g>
    
            <g id="right" fill="rgb(210 210 10 / 1)">
                <circle cy="0" cx="1" r=".05" />
                <circle cy=".20" cx="1" r=".05" />
                <circle cy=".40" cx="1" r=".05" />
                <circle cy=".60" cx="1" r=".05" />
                <circle cy=".80" cx="1" r=".05" />
                <circle cy="1" cx="1" r=".05" />
            </g>
        </g>
    </defs>
</svg>
```

  


上面代码中创建了两个遮罩图像，其中一个遮罩图像由很多个 `<circle>` 构成，最终的形状有点类似于我们生活中的邮票边缘的效果，另外一个遮罩层由一个 `<rect>` 构成。然后将它们同时应用于一个 `<img>` 元素上：

  


```CSS
.mask {
    mask: url(#maskDots), url(#maskRect);
    mask-composite: exclude;
}
```

  


注意，我们使用了多个遮罩层，并且使用 `mask-composite` 对多个遮罩成进行合成处理。最终呈现给你的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bb291e159a349e5a9263b7e45908d1a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=852&s=519819&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/NWVKOvx

  


正如你所看到的，按相似的方法，只需要调整遮罩一中的图形，就可以获得各式各样的优惠券 UI 效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f881ef1ffc2d4a8586bbcb8bc17e0765~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=852&s=660997&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/xxNKyWJ

  


其次，还可以在 SVG `<mask>` 元素内放置 `<text>` ，就可以实现文本镂空的效果。类似于 `background-clip: text` 的效果，但它将比 `background-clip:text` 更强大。比如，可以将一个视频填充到文本中：

  


```HTML
<div class="container">
    <video loop muted autoplay>
        <source src="https://livefiredev.com/wp-content/uploads/2022/09/size_reduced_fire_bg_video.mp4" type="video/mp4">
    </video>
  
    <div class="text">
        <svg>
            <defs>
                <mask id="mask" x="0" y="0" width="100%" height="100%">
                    <text id="title" x="50%" y="0" dy="2em">SVG + CSS</text>
                </mask>
            </defs>
        </svg>
    </div>
</div>
```

  


```CSS
@layer demo {
    .container {
        display: grid;
        width: 50vw;
        aspect-ratio: 21 / 9;
        outline: 1px dashed;
    
        > * {
            grid-area: 1 / 1 / -1 / -1;
        }
    
        video {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: bottom;
            mask: url(#mask);
            z-index: 2;
        }
        
        svg {
            display: block;
            width: 100%;
            height: inherit;
        }
        
        text {
            text-anchor: middle;
            fill: #fff;
            letter-spacing: -2px;
            font-size: 10vw;
            font-weight: 900;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93b3c0c89f10450fa2d6302591fd4f9a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=538&s=2422199&e=gif&f=103&b=0d6654)

  


> Demo 地址：https://codepen.io/airen/full/QWRWwEJ

  


### 不规则 UI

  


我们在 Web 开发过程中，经常会碰到一些不规则 UI 效果，如下图中的红包 UI：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/296655350eda4367a4ee05dec70699fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1136&s=389746&e=jpg&b=002341)

  


正如你所看到的，上图中的红包 UI 顶部有一个不规则的形状。就这个 UI 效果而言，可能很多 Web 开发者都会使用图片来替代。事实上，我们只需要一个该图形形状的 `<mask>` 就可以轻易实现。它与图片相比的优势是，除了适配性更灵活之外，在样式更新上也更具优势，例如，当你不需要金黄色的顶盖时，只需要调整渐变颜色即可。

  


实现该效果，首先需要使用 `<mask>` 创建类似下图这样的遮罩图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0798efd7de294e91841287eb78f4e841~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=997&s=88294&e=jpg&b=ffffff)

  


我们使用 SVG 的 `<path>` 可以轻易实现该形状：

  


```XML
<svg class="sr-only">
    <defs>
        <mask id="mask">
            <path fill="#fff"  clip-rule="evenodd" fill-rule="evenodd" d="M63.5 68c20.235 0 39.456 2.96 56.785 8.282C133.899 44.928 165.139 23 201.5 23c36.638 0 68.076 22.264 81.523 54h1.411c17.916-5.772 37.939-9 59.066-9 19.736 0 38.508 2.817 55.5 7.893V61c0-11.046-8.954-20-20-20h-91.169C267.011 15.95 235.618 0 200.5 0s-66.511 15.95-87.331 41H24C12.954 41 4 49.954 4 61v16h.434c17.916-5.772 37.939-9 59.066-9Z" />  
        </mask>
    </defs>
</svg>
```

  


接下来，在 CSS 中将 `#mask` 遮罩应用于相应的元素上即可：

  


```HTML
<div class="card">
    <div class="card__circle"><span>领</span></div>
</div>
```

  


```CSS
@layer demo {
    .card {
        width: 395px;
        min-height: 386px;
        background: linear-gradient(180deg, #e86969 0%, #c60606 111.4%);
        border-radius: 20px;
        position: relative;
    
        &::before,
        &::after {
            content: "";
            position: absolute;
            width: 403px;
            height: 85px;
            left: 50%;
            translate: -50%;
            mask: url(#mask);
            mask-size: cover;
        }
    
        &::before {
            top: -42px;
            background: linear-gradient(180deg, #fff6d8 0%, #ffcf52 100%);
            z-index: 2;
        }
    
        &::after {
            background: rgb(0 0 0 / 0.25);
            top: -38px;
            z-index: 1;
        }
    }
}
```

  


注意，上面示例中，同时在 `.card` 的伪元素 `::before` 和 `::after` 上应用了 `#mask` 遮罩图形。这样做是因为，金黄色不规则 UI 有一个阴影效果，由于应用了 `mask` ，元素上直接应用阴影将被隐藏，因此这里通过 `::after` 伪元素来模拟其阴影效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea5c5f5798b54645b6f30a606f53d85d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=997&s=318804&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/yLWBZRo

  


是不是很简单！

  


### 渐变图标

  


在介绍 SVG 渐变的时候，我们一起探索了如何使用 SVG 渐变创建渐变图标的效果。其实，`<mask>` 和 CSS 的渐变相互结合，也可以轻易创建出带有渐变效果的图标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c5eff393b63472599a583bd7b0562fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=997&s=330726&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/VwOwKvP

  


假设你需要创建一个带有渐变效果的图标集，那么可以按照下面的方式来制作。

  


首先，使用 SVG 的 `<symbol>` 为图标集中的每个图标创建一个实例，有一点需要的是，为了让图标能较好的适应元素的尺寸，在创建图标集的时候，最好使用相对单位。[我们可以使用诸如 Convert SVG absolute clip-path to relative 工具将图标路径的绝对坐标转换为相对坐标](https://yoksel.github.io/relative-clip-path/)：

  


```XML
<svg class="sr-only">
    <defs>
        <symbol id="gost">
            <path d="m0.104,0.912,-0.029,0.018 c-0.008,0.005,-0.018,0.008,-0.029,0.008 C0.021,0.938,0,0.922,0,0.903 V0.375 C0,0.168,0.224,0,0.5,0 s0.5,0.168,0.5,0.375 v0.528 c0,0.019,-0.021,0.035,-0.046,0.035 c-0.01,0,-0.021,-0.003,-0.029,-0.008 l-0.029,-0.018 c-0.035,-0.021,-0.085,-0.018,-0.115,0.008 l-0.079,0.068 c-0.009,0.007,-0.021,0.012,-0.035,0.012 s-0.026,-0.004,-0.035,-0.012 l-0.069,-0.06 c-0.033,-0.029,-0.092,-0.029,-0.126,0 L0.368,0.988 c-0.009,0.007,-0.021,0.012,-0.035,0.012 s-0.026,-0.004,-0.035,-0.012 l-0.079,-0.068 c-0.029,-0.025,-0.08,-0.029,-0.115,-0.008 M0.417,0.375 a0.083,0.063,0,1,0,-0.167,0 a0.083,0.063,0,1,0,0.167,0 m0.25,0.063 a0.083,0.063,0,1,0,0,-0.125 a0.083,0.063,0,1,0,0,0.125" />
        </symbol>
        <symbol id="dragon">
            <path d="m0.55,0.243,-0.081,-0.025 c-0.01,-0.003,-0.018,-0.014,-0.019,-0.027 s0.004,-0.026,0.014,-0.031 l0.064,-0.04,-0.067,-0.063 c-0.009,-0.008,-0.012,-0.022,-0.009,-0.035 S0.464,0,0.475,0 h0.25 c0.047,0,0.092,0.028,0.12,0.075 l0.09,0.15 c0.01,0.016,0.015,0.036,0.015,0.056 c0,0.052,-0.034,0.094,-0.075,0.094 h-0.034 c-0.027,0,-0.052,-0.013,-0.071,-0.037 L0.75,0.313 h-0.05 v0.042 c0,0.048,0.02,0.094,0.053,0.119 l0.167,0.13 c0.05,0.039,0.081,0.108,0.081,0.182 c0,0.118,-0.077,0.214,-0.172,0.214 H0.05 c-0.005,0,-0.01,-0.001,-0.015,-0.003 c-0.014,-0.005,-0.026,-0.019,-0.032,-0.036 C0.002,0.954,0,0.948,0,0.94 c0,-0.007,0,-0.014,0.002,-0.021 c0.004,-0.018,0.015,-0.033,0.029,-0.04 c0.005,-0.002,0.01,-0.004,0.015,-0.004 L0.677,0.805 c0.013,-0.001,0.023,-0.015,0.023,-0.031 c0,-0.008,-0.003,-0.016,-0.007,-0.022 l-0.069,-0.087 c-0.047,-0.059,-0.073,-0.138,-0.073,-0.221 V0.243 m0.25,-0.102 v-0.001,0.001 m-0.002,0.014,-0.072,-0.023 c0,0.003,0,0.005,0,0.008 c0,0.026,0.017,0.047,0.037,0.047 c0.017,0,0.03,-0.013,0.035,-0.032 m-0.593,0.072 c0.025,-0.028,0.063,-0.032,0.091,-0.008 l0.204,0.17 V0.443 c0,0.064,0.013,0.127,0.037,0.182 H0.175 c-0.01,0,-0.02,-0.008,-0.023,-0.02 s-0.001,-0.026,0.007,-0.035 l0.108,-0.116,-0.238,0.046 c-0.011,0.002,-0.022,-0.005,-0.026,-0.018 S0,0.454,0.008,0.445 l0.196,-0.218" />
        </symbol>
        <symbol id="crossbones">
            <path d="M0.817,0.25 C0.817,0.337,0.76,0.413,0.674,0.458 V0.5 C0.674,0.535,0.642,0.563,0.603,0.563 H0.389 C0.349,0.563,0.317,0.535,0.317,0.5 V0.458 C0.231,0.413,0.174,0.337,0.174,0.25 C0.174,0.112,0.318,0,0.496,0 S0.817,0.112,0.817,0.25 M0.371,0.344 A0.071,0.063,0,1,0,0.371,0.219 A0.071,0.063,0,1,0,0.371,0.344 M0.692,0.281 A0.071,0.063,0,1,0,0.549,0.281 A0.071,0.063,0,1,0,0.692,0.281 M0.003,0.535 C0.021,0.504,0.064,0.491,0.099,0.507 L0.496,0.68 L0.892,0.507 C0.928,0.491,0.97,0.504,0.988,0.535 S0.991,0.603,0.956,0.618 L0.655,0.75 L0.956,0.882 C0.992,0.897,1,0.935,0.988,0.965 S0.928,1,0.892,0.993 L0.496,0.82,0.099,0.993 C0.064,1,0.021,0.996,0.003,0.965 S0,0.897,0.035,0.882 L0.336,0.75,0.035,0.618 C0,0.603,-0.014,0.565,0.003,0.535" />
        </symbol>
        <!-- 其他 Icon 图标 -->
    </defs>
</svg>
```

  


接着在 `<mask>` 中使用 `<use>` 引用 `<symbol>` 创建的图标实例，将每个图标定义为遮罩图形：

  


```XML
<svg class="sr-only">
    <defs>
        <mask id="maskGost" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#gost" fill="#fff" />
        </mask>
        
        <mask id="maskDragon" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#dragon" fill="#fff" />
        </mask>
        
        <mask id="maskCrossbones" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <use href="#crossbones" fill="#fff" />
        </mask>
    </defs>
</svg>
```

  


注意，需要将 `<mask>` 的 `maskUnits` 和 `maskContentUnits` 的值设置为 `objectBoundingBox` 。这样做的好处是，可以使 `<mask>` 创建的遮罩图根据应用遮罩图的元素尺寸进行适配：

  


```CSS
@layer demo {
    .icon--gradient:nth-child(1) {
        background-image: linear-gradient(
            to right in lch,
            color(display-p3 25% 25% 100%) 0%,
            color(display-p3 100% 85% 30%) 100%
        );
        mask: url(#maskGost);
    }

    .icon--gradient:nth-child(2) {
        background-image: conic-gradient(
            from 0deg at 50% 50% in oklch longer hue,
            oklch(70% 0.3 0) 0%,
            oklch(70% 0.3 0) 100%
        );
        mask: url(#maskDragon);
    }

    .icon--gradient:nth-child(3) {
        background-image: linear-gradient(
            293deg in oklch,
            oklch(70% 0.5 340) 0%,
            oklch(90% 0.3 200) 100%
        );
        mask: url(#maskCrossbones);
    }
}
```

  


与 SVG 的渐变制作渐变图标相比，这种方式要更为灵活，毕竟 CSS 的渐变要给 SVG 的渐变更简便，灵活性，可定制定要更高。

  


### 带有滤镜的遮罩效果

  


SVG 的 `<mask>` 有一个强大功能，它可以与 SVG 的 `<filter>` 相结合，创建出各种更具创意的视觉效果。例如下面这几个效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75a06d430e0a49028b3398a0590a4f5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1222&h=576&s=367182&e=gif&f=114&b=faf9f9)

  


> Demo 地址：https://codepen.io/supah/full/poxmKPQ （来源于 [@Fabio Ottaviani](https://codepen.io/supah)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5abbe6a15be48878b4ad1e751180c15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=574&s=8818011&e=gif&f=262&b=365589)

  


> Demo 地址：https://codepen.io/iremlopsum/full/VQOvOW （来源于 [@Irem Lopsum](https://codepen.io/iremlopsum)）

  


还有更多更有创意和吸引人的效果，这里就不一一展示了。

  


你可能会感到好奇？为什么这两个案例不详加阐述呢？这里简单的说一下，因为它们用到了 SVG 的滤镜特性，而且这个特性在前面的课程中都未有做过任何阐述。为了让大家能更好的应用好滤镜，接下来的这节课，我将与大家开始进入 SVG 滤镜的世界！