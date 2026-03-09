在Web设计与开发领域，剪切技术是一项非常强大的工具，它让我们以惊人的方式控制元素的可见性，并创造出令人惊叹的视觉效果和动画。无论是通过CSS的剪切还是SVG的剪切，都能为我们的项目增添独特的魅力和创意。

  


尽管 SVG 的剪切技术与 CSS 的剪切技术有一些相似之处，但也存在一些独特之处。SVG 的剪切是通过 `<clipPath>` 元素来实现的，它允许我们在 SVG 图形中定义裁剪路径，从而控制图形的可见区域。换句话说，通过定义裁剪路径，我们可以使只有路径内的内容可见，而路径外的内容则被隐藏。这种技术使得我们能够实现图形的遮罩效果、动态变形、视差滚动等多种复杂效果，为用户带来更加丰富和生动的视觉体验。与 CSS 相比，SVG 的剪切更适用于创建复杂的图形和动画，例如图标、地图和数据可视化。

  


我们将从 CSS 的剪切开始，逐步过渡到 SVG 的剪切。我们将深入探索 SVG 的剪切技术，学习如何使用 `<clipPath>` 元素来定义裁剪路径，并将其应用到实际的项目中。在这个过程中，将会探讨 SVG 剪切的语法、属性和应用场景，带你一步步领略 SVG 剪切技术的神奇之处。

  


通过学习 SVG 的剪切技术，你能够将创意付诸实践，为 Web 设计增添新的元素和动态效果。无论是创建个性化的图形效果、设计独特的用户界面还是实现复杂的动画场景，SVG 剪切技术都将成为你的得力助手。

  


让我们一起踏上 SVG 剪切技术的探索之旅，开启无限创意的大门，为用户带来更加精彩的 Web 体验！

  


## 剪切是什么？

  


想象一下，你手中拿着一把剪刀，准备修剪一张照片。你想把照剪成一个心形，于是你沿着心形的形状用剪刀剪了一圈，然后把照片多余的部分剪掉。最后，你得到了一个心形的照片，而原本超出心形区域的部分则被剪掉了。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbcdfa19656e4064a68dac96d3f55bed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=1432&s=896458&e=jpg&b=060606)

  


剪切就好像你用剪刀沿着心形修剪照片一样，心形的轮廓就是剪切路径，而被修剪掉的部分则在路径之外。通过这样的方式，你可以控制照片的形状，并删除不需要的部分，达到剪切的效果。

  


在 Web 设计和开发中，剪切也有类似的概念。我们可以利用剪切技术定义一个形状，然后将该形状应用到元素上，只显示形状内部的部分，而将形状外部的部分隐藏起来。这样就可以实现各种视觉效果和动画，就像修剪照片一样。

  


事实上，剪切是一种图形处理技术，用于控制元素或图形的可见区域，并将其限制在指定的边界内。超出边界的部分将被隐藏或裁剪掉，从而实现对元素可视范围的限制和控制。这个指定的“边界内”由一个剪切路径来定义。换句话说，剪切路径定义了一个区域，在这个区域的“内部”，所有东西都被允许显示，但在区域“外部”，所有东西都被“裁剪掉”，不会呈现在画布上。

  


在 Web 开发中，剪切可以通过不同的方式实现，其中包括：

  


-   **CSS 剪切**：通过 CSS 的 `clip-path` 属性可以定义元素的剪切区域，从而裁剪元素的可见部分。可以使用各种形状（如矩形、圆形、椭圆形和多边形等）或 SVG 图形作为剪切区域，实现各种独特的效果和动画
-   **SVG 剪切**：通过 SVG 的 `<clipPath>` 元素来实现。通过定义裁剪路径，可以限制图形的可见区域，并裁剪超出路径范围的部分。SVG 剪切通常用于创建复杂的图形和动画效果，如图标、地图和数据可视化。

  


虽然它们隶属于不同的语言当中，但它们之间有很多共同之处。

  


> 你知道吗？许多优秀的 CSS 特性都是从 SVG 中引入的，CSS 剪切就是其中之一。

  


或许你对CSS剪切更加熟悉，这也很正常。那么，我们就从CSS的剪切开始，逐步深入了解SVG剪切的世界。

  


## CSS 剪切：clip-path

  


`clip-path` 属性是 [CSS 遮罩模块的一部分](https://www.w3.org/TR/css-masking-1/#the-clip-path)（CSS Masking Module Level 1），它源于 SVG 有剪切（自 2000 年以来一直是 SVG 的一部分）。这意味着剪切操作不仅适用于 SVG 元素，还可以应用于 HTML 元素。

  


在 CSS 中，我们可以通过 `clip-path` 属性创建一个剪切区域，这个剪切区域可以使用 CSS 形状模块中的形状函数来创建，例如 `inset()` 、`circle()` 、`ellipse()` 和 `polygon()` 等。当元素应用 `clip-path` 后，位于剪切区域内的元素内容是可见的，而位于剪切区域外的元素内容是不可见的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9427cf919a7d425ca6e8b7acff2bfe1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2672&h=3538&s=1256487&e=jpg&b=fcfcfc)

  


上图是 `clip-path` 属性应用基本图形函数所呈现的效果。

  


-   `circle()` 可以裁剪出一个圆形
-   `inset()` 可以裁剪出一个矩形，也可以是一个带圆角的矩形
-   `ellipse()` 可以裁剪出一个椭圆形
-   `polygon()` 可以裁剪出一个多个边形

  


正如你所看到的，基本形状函数允许你创建有限数量的形状，其中最复杂的形状之一是多边形 `polygon()` 。例如 [Clippy 工具](https://bennettfeely.com/clippy/)提供了 `polygon()` 函数定义的常见多边形图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53f42891c725434f8ef344eefb35d95e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1350&h=506&s=5212136&e=gif&f=185&b=f4f5ef)

  


> Clippy：https://bennettfeely.com/clippy/

  


虽然 `polygon()` 函数允许你定义一些复杂的裁剪区域，但它始终是由一组相连的直线连接而成。如果你想要使用更复杂的裁剪形状，并且不是由一组相连的直线构成，那么可以考虑使用 `path()` 函数：

  


```CSS
.card {
    clip-path: path('M256 203C150 309 150 309 44 203 15 174 15 126 44 97 73 68 121 68 150 97 179 68 227 68 256 97 285 126 285 174 256 203');
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89dcd6a5eb844f378743fc312d534e40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1841&s=759084&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/RwOvjyX

  


除此之外，`clip-path` 属性还允许你使用 `url()` 函数引用 SVG `<clipPath>` 元素定义的复杂图形。例如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/647b3141de584aeca21d48193151985d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=1432&s=924786&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/JjVxOzw

  


上图中蓝色形状是由 `<clipPath>` 元素定义的。正如 `<clipPath>` 的名称所暗示的那样，你可以使用 `<path>` 元素创建任意路径，并将其用作剪切路径：

  


```XML
<svg class="sr-only">
    <defs>
        <clipPath id="mask">
            <path d="M0,370.6c-0.5,35,29.5,68,60,82.8c40.8,19.7,82.2,6.8,99.3,1.4c76-23.8,83.3-81.4,130.3-79.9c43.9,1.4,53.2,52.1,102.2,52.5 c38.6,0.3,67.2-30.9,79.9-44.6c44.4-48.3,49.5-116.9,33.1-165.5c-6-17.7-11.5-34.1-27.4-45.3c-30.9-22-62.5,2.7-96.2-16.2 c-27.9-15.7-17.7-39-44.8-68c-44.9-47.9-125.5-40.2-155.5-37.3C145.6,53.7,101.3,58,66.5,92c-43.9,42.9-46.3,107.1-46.8,120.2  c-1.7,45.2,14.1,62.2,1.4,103.6C12.1,345.6,0.3,348.8,0,370.6z" />
            <path d="M373.8,89.9c2.7-4.9,14.3-24.5,37.4-30.2c5.6-1.4,18.5-4.6,30.9,2.2c18.8,10.2,20,33.9,20.2,38.1c0.1,3.2,0.6,21.6-8.6,25.9 c-6.9,3.3-13-4.5-24.5-1.4c-7.4,1.9-7.1,5.7-13.7,7.9c-12.5,4.2-32-3.2-39.6-18.7C371.2,103.7,372.8,94,373.8,89.9z" />
            <path d="M432.1,133.8c-4.2,1.6-9.3,6-8.6,10.8c0.7,5.5,8.7,9.2,15.1,7.9c6.7-1.4,12.4-8.5,10.8-13.7 C447.7,133.4,438.5,131.3,432.1,133.8z" />
        </clipPath>
    </defs>
</svg>
```

  


```CSS
img {
    clip-path: url(#mask);
}
```

  


这也意味着，现如今，我们可以将 SVG 的 `<clipPath>` 与 CSS 的 `clip-path` 结合起来使用，并且能实现更为复杂的裁剪效果。因为，SVG 的 `<clipPath>` 元素可以包含任意数量的基本形状（例如 `<circle>` 、`<rect>` `<polygon>` 等）、`<path>` 元素，甚至是 `<text>` 元素。

  


下面这个示例，在 `<clipPath>` 中使用了 `<path>` 、`<circle>` 和 `<text>` 等元素用作剪切路径，并且将定义的剪切路径应用于视频元素（`video`）之上：

  


```HTML
<video autoplay playsinline muted loop preload poster="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/oceanshot.jpg">
    <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/ocean-small.webm" />
    <source src="http://thenewcode.com/assets/videos/ocean-small.mp4" />
</video>

<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute" width="0" height="0">
    <defs>
        <clipPath id="mask">
            <path d="M373.8,89.9c2.7-4.9,14.3-24.5,37.4-30.2c5.6-1.4,18.5-4.6,30.9,2.2c18.8,10.2,20,33.9,20.2,38.1c0.1,3.2,0.6,21.6-8.6,25.9  c-6.9,3.3-13-4.5-24.5-1.4c-7.4,1.9-7.1,5.7-13.7,7.9c-12.5,4.2-32-3.2-39.6-18.7C371.2,103.7,372.8,94,373.8,89.9z" />
            <path d="M432.1,133.8c-4.2,1.6-9.3,6-8.6,10.8c0.7,5.5,8.7,9.2,15.1,7.9c6.7-1.4,12.4-8.5,10.8-13.7  C447.7,133.4,438.5,131.3,432.1,133.8z" />
            <circle cx="50" cy="50" r="30" />
            <circle cx="900" cy="320" r="40" />
            <circle cx="500" cy="350" r="50" />
            <text x="0" y="300" textLength="1200" lengthAdjust="spacing" font-family="Exo" font-size="230" font-weight="900" font-style="italic"> Hello SVG! </text>
        </clipPath>
    </defs>
</svg>
```

  


```CSS
video {
    clip-path: url(#mask);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfdd8d7a663146d3b0c048d453ab9024~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=454&s=2055507&e=gif&f=38&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/MWZJexJ

  


这将为你的创意打开无限的可能性。既然如此，我们就开始进入 SVG 的 `<clipPath>` 的世界中！

  


## SVG 剪切：`<clipPath>`

  


SVG 中的 `<clipPath>` 元素是一种机制，主要用于定义图形元素的剪切区域。它允许你指定一个路径或形状，然后将该路径或形状应用于 SVG 中的其他元素或 HTML 元素，以确定哪些部分应该显示，哪些部分应该隐藏。

  


[SVG 的 `<clipPath>` 元素接受许多属性和内容模型类型](https://drafts.fxtf.org/css-masking-1/#elementdef-clippath)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fadc6886c56b449cb86f1c244c62ff4f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2486&h=1528&s=587913&e=jpg&b=ffffff)

  


> URL：https://drafts.fxtf.org/css-masking-1/#elementdef-clippath

  


接受的内容模型类型包括 `<title>` 、`<desc>` 以及其他类型的元素数据标签。它还接受 SMIL 动画标签，如 `<animate>` 、`<animateTransform>` ，以及 SVG 基本形状（如 `<rect>` 、`<circle>` 、`<polygon>` 和 `<path>`），包括 `<text>` 、`<use>` 、`<style>` 和 `<script>` 。甚至可以在父 `<clipPath>` 中有多个 `<clipPath>` 。

  


例如，下面这个示例，使用 SMIL 和 `<path>` 路径创建的剪切效果：

  


```XML
<svg class="sr-only" viewBox="0 0 120 120">
    <defs>
        <clipPath id="wavy">
            <path id="path" class="clip" d="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z">
                <animate id="morph-one" dur="1" begin="0" repeatCount="indefinite" attributeName="d" 
                    from="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z" 
                    to="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z" 
                    values="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z;
                            M101.807,135.303c10-0.352,18.193-6.531,18.193-6.531V0H0v128.771c0,0,9.701,4.952,17.069,4.952s10.464-9.299,20.877-9.299 c10.175,0,12.703,9.299,22.053,9.299s11.981-9.123,20.578-9.123S91.807,135.654,101.807,135.303z ;M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z" />
            </path>
        </clipPath>
    </defs>
</svg>
```

  


然后在 CSS 中，通过 `clip-path` 属性引用 SVG 的 `<clipPath>` 创建的剪切路径 `#wavy` ：

  


```CSS
img {
    clip-path:url(#wavy);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d593b39a8a40467c8066dc3c9f02bff1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=560&s=329241&e=gif&f=45&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/QWPYJGy

  


`<clipPath>` 元素创建的剪切路径，除了可以被 CSS 的 `clip-path` 属性应用于 HTML 元素之外，还可以直接应用于 SVG 元素。在 SVG 元素上，同样是使用 `clip-path` 来引用 `<clipPath>` 创建的裁剪路径。例如：

  


```XML
<svg viewBox="0 0 120 120" class="wavy">
    <defs>
        <clipPath id="wavy">
            <path class="clip" d="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z">
                <animate id="morph-one" dur="1" begin="0" repeatCount="indefinite" attributeName="d" 
                    from="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z" to="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z" values="M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z;M101.807,135.303c10-0.352,18.193-6.531,18.193-6.531V0H0v128.771c0,0,9.701,4.952,17.069,4.952s10.464-9.299,20.877-9.299 c10.175,0,12.703,9.299,22.053,9.299s11.981-9.123,20.578-9.123S91.807,135.654,101.807,135.303z;
                          M101.807,123.37c10-0.352,18.193,5.401,18.193,5.401V0H0v128.771c0,0,9.701-5.227,17.069-5.227s10.464,6.314,20.877,6.314 c10.175,0,12.703-4.209,22.053-4.209s11.981,5.438,20.578,5.438S91.807,123.722,101.807,123.37z" />
            </path>
        </clipPath>
    </defs>

    <image clip-path="url(#wavy)" href="https://picsum.photos/id/49/1280/1280" width="100%" height="100%" />
</svg>
```

  


上面代码中的 `<image>` 元素的 `clip-path` 属性的值为 `url(#wavy)` ，表示图片元素 `<image>` 将会根据 `<clipPath>` 元素定义的 `#wavy` 路径进行裁剪。你还可以添加一些一点 CSS 代码，制作出不一样的图片效果：

  


```CSS
@layer demo {
    .wavy {
        display: block;
        width: 80vh;
        aspect-ratio: 1;
        border-radius: 50%;
        mix-blend-mode: plus-lighter;
        
        image {
            filter: sepia(.5) hue-rotate(-45deg) opacity(0.5);
        }
    }

    .clip {
        animation: slide 8s infinite;
    }

    @keyframes slide {
        from {
            transform: translateY(-135px);
        }
        50% {
            transform: translateY(-5px);
        }
        to {
            transform: translateY(-135px);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77b12cf3965d4320ace30dfdf90e521d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=758&s=1112271&e=gif&f=63&b=070707)

  


> Demo 地址：https://codepen.io/airen/full/ExJrzja

  


正如前面所提到的，你还可以在 `<clipPath>` 内部使用多个基本形状。例如下面这个示例，在 `<clipPath>` 内部使用多个 `<circle>` ，每个都具有不同的大小和位置，并且通过 CSS 给这些圆添加了一点动画。

  


```XML
<svg viewBox="0 0 1024 512" class="dots">
    <defs>
        <clipPath id="dots">
            <circle  cx="50" cy="50" r="40"></circle>
            <circle  cx="193.949" cy="235" r="74.576"></circle>
            <circle  cx="426.576" cy="108.305" r="47.034"></circle>
            <circle cx="346.915" cy="255.763" r="43.644"></circle>
            <circle cx="255.39" cy="82.882" r="35.17"></circle>
            <circle  cx="328.695" cy="157.034" r="25.424"></circle>
            <circle cx="760" cy="360.424" r="121.187"></circle>
            <circle cx="470.008" cy="223.771" r="31.992"></circle>
            <circle cx="299.525" cy="400.762" r="64.407"></circle>
            <circle  cx="634.627" cy="183.305" r="92.373"></circle>
            <circle cx="136.746" cy="172.712" r="106.356"></circle>
            <circle cx="91.831" cy="416.779" r="36.017"></circle>
            <circle cx="125.305" cy="335" r="25.424"></circle>
            <circle cx="192.424" cy="421.271" r="20.509"></circle>
            <circle cx="584.847" cy="362.543" r="18.22"></circle>
            <circle cx="436.568" cy="385.602" r="72.635"></circle>
            <circle cx="345.644" cy="90.085" r="23.729"></circle>
            <circle cx="634.627" cy="85" r="42.373"></circle>
            <circle cx="760" cy="12.017" r="83.898"></circle>
            <circle cx="277.458" cy="314.694" r="22.068"></circle>
            <circle cx="413.229" cy="195.381" r="22.669"></circle>
            <circle cx="277.848" cy="185" r="16.949"></circle>
            <circle cx="993.102" cy="158.729" r="19.492"/>
            <circle cx="424.517" cy="290.873" r="24.517"/>
            <circle cx="71.067" cy="348.56" r="49.152"/>
            <circle cx="937.221" cy="62.915" r="50.898"/>
            <circle  cx="940" cy="430" r="50"/>
        </clipPath>
    </defs>

    <image clip-path="url(#dots)" href="https://picsum.photos/id/49/1024/512" />
</svg>
```

  


```CSS
@layer demo {
    .dots {
        display: block;
        width: 50vw;
        aspect-ratio: 2 / 1;
        mix-blend-mode: plus-lighter;
        outline: 1px dashed lime;
    
        image {
            filter: sepia(0.5) hue-rotate(-45deg) opacity(0.5);
        }
    
        circle {
            transform-box: fill-box;
            transform-origin: center;
            animation: pluse 3s ease-in-out infinite alternate;
        }
    }

    @keyframes pluse {
        50% {
            scale: 0.8;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02ac9d111b664276a3c0f8fb7c02cf34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=526&s=5762210&e=gif&f=116&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/JjVxqrb

  


这几个简单的示例向大家展示了 SVG 剪切 `<clipPath>` 最基础的应用。

  


使用 `<clipPath>` 元素定义剪切路径时，与 `<linearGradient>`、`<radialGradient>` 和 `<pattern>` 类似，通常将其置于 `<defs>` 元素中，并给予一个唯一的 `id`。这样一来，我们就可以在 CSS 中使用 `clip-path` 属性来引用该 `id`，从而将剪切效果应用于 HTML 元素。或者，在 SVG 元素上使用 `clip-path` 属性引用该 `id`，从而将剪切效果应用于 SVG 元素。

  


换句话说，如果没有使用 `clip-path` 属性（不管是 CSS 还是 SVG）引用 `<clipPath>` 指定的 `id` ，那么 `<clipPath>` 元素内的内容是不会直接呈现的。简单地说，它的唯一用途是作为 `clip-path` 属性的引用对象。

  


需要知道的是，`display` 属性不适用于 `<clipPath>` 元素，即使将 `display` 属性设置为 `none` 以外的值，`<clipPath>` 元素中的内容也不会直接呈现，而且即使在 `<clipPath>` 元素或其任何祖先元素的 `display` 属性为 `none` 时，它也可以被 `clip-path` 属性引用。

  


## 掌握 SVG 剪切的核心

  


在前面我们已经介绍了 SVG 剪切的基础知识，但要真正驾驭 SVG 剪切，有几个关键概念和技术细节必须要掌握。这包括剪切路径的参考框、剪切路径的内容、剪切路径的单位属性以及剪切规则等要点。只有掌握了这些要点，你才能在 SVG 中实现各种独特而引人注目的图形效果。

  


### 剪切路径的参考框

  


[CSS 图形模块](https://www.w3.org/TR/css-shapes/#shapes-from-box-values)定义了基本图形（`<basic-shape>`）的参考框。也就是说，当使用 CSS 的 `clip-path` 属性使用基本形状函数（`rect()`、`circle()`、`ellipse()` 和 `polygon()`）创建剪切路径时，它们都会指定一个参考框。参考框仅针对用作剪切路径的 CSS 形状指定，而不适用于 SVG 的 `<clipPath>` 元素。

  


如果被剪切的是 HTML 元素，则参考框可以是 `margin-box`、`border-box`、`padding-box` 或`content-box` 中的一种：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa3155f1ac6b4eb1a29d5a3aff7b0fe8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1326&s=547638&e=jpg&b=fff7f6)

  


它们也被称为 CSS 图形参考框。

  


如果基本形状的剪切路径应用于 SVG 元素，则参考框可以设置为 `fill-box` 、`stroke-box` 和 `view-box` 中的一种：

  


-   `fill-box`：使用对象边界框作为参考点。
-   `stroke-box`：选择描边边界框作为参考点。
-   `view-box`：将最近的 SVG 视口作为参考点。如果 SVG 元素具有 `viewBox` 属性，则参考点将位于 `viewBox` 定义的坐标系统的原点处。参考点的尺寸与 `viewBox` 属性的宽度和高度值相匹配。

  


注意，它们也被称为 SVG 图形参考框。

  


如果在 SVG 元素上使用了CSS 图形参考框之一，则等同于 `fill-box` ；如果在 HTML 元素上使用 SVG 参考框之一，则等同于 `border-box` 。

  


```CSS
.clip-path {
    clip-path: polygon(0% 15%, 50% 50%, 15% 0%, 85% 0%, 50% 50%, 100% 15%, 100% 85%, 50% 50%, 85% 100%, 15% 100%, 50% 50%, 0% 85%) var(--basic-shape);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70e60fa1aafd4da195fe135a5f7ba33d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=610&s=2594495&e=gif&f=389&b=040404)

  


注意，基本参考框除了可以应用于 `clip-path` 属性之外，还可以用于 CSS 的 `shape-outside` 、`transform-box` 等属性。

  


### 剪切路径的内容

  


与 CSS 的剪切路径相比，SVG 的剪切路径要丰富，且有趣地多。`<clipPath>` 的内容可以是：

  


-   描述性的，例如 `<title>` 、`<desc>` 和 `<metadata>`
-   任意数量的基本形状，例如 `<rect>` 、`<circle>` 、`<ellipse>`、`<line>`、`<path>`、`<polygon>`、`<polyline>` 和 `<rect>`
-   文本，例如 `<text>`

  


除此之外，它还可以包含一个 `<use>` 元素。不过，它只能引用上面提到的基本形状，不能引用组 `<g>` 。例如，下面这样使用是无效的：

  


```XML
<svg viewBox="0 0 1024 1024">
    <defs>
        <g id="dots" fill="#000">
            <circle cx="10%" cy="10%" r="30" />
            <circle cx="20%" cy="20%" r="30" />
            <circle cx="30%" cy="30%" r="30" />
            <circle cx="40%" cy="40%" r="30" />
            <circle cx="50%" cy="50%" r="30" />
            <circle cx="60%" cy="40%" r="30" />
            <circle cx="70%" cy="30%" r="30" />
            <circle cx="80%" cy="20%" r="30" />
            <circle cx="90%" cy="10%" r="30" />
        </g>
        <clipPath id="clip">
            <use href="#dots" />
        </clipPath>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="lime" clip-path="url(#clip)" />
</svg>
```

  


更为有趣的是，`<clipPath>` 元素中还可以包含 `<animate>` 、`<animateTransform>` 、`<animateMotion>` 或 `<set>` ，创建带有动画效果的剪切的路径。

  


```XML
<svg viewBox="0 0 80 80">
    <defs>
        <clipPath id="clip">
            <path d="M 0,70 A 65,70 0 0,0 65,0 5,5 0 0,1 75,0 75,70 0 0,1 0,70Z" fill="#000" stroke-miterlimit="10" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" clip-rule="evenodd">
                <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="5s" repeatCount="indefinite" />
            </path>
        </clipPath>
    </defs>
    <image href="https://picsum.photos/id/66/1024/1024" clip-path="url(#clip)" />
</svg>
```

  


上面代码对剪切路径做了放置动效：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd3a993d85441d0b549c649c22427b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1242&h=700&s=529613&e=gif&f=82&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/bGJZPwy

  


### 剪切路径单位属性

  


`<clipPath>` 元素可以接受多个属性，包括 `id` 、`class` 、`transform` 、`fill` 、`stroke` 和 `stroke-width` 等等，在这里无法一一列举。但其中 `clipPathUnits` 属性特别有用。

  


`clipPathUnits` 这个属性非常重要，因为它定义了 `<clipPath>` 的内容的“坐标系”或者说“位置”。它有两个值，`objectBoundingBox` 和 `userSpaceOnUse` ，其中默认值是 `userSpaceOnUse` 。

  


-   `userSpaceOnUse` ：`<clipPath>` 的内容代表在引用 `<clipPath>` 元素的当前用户坐标系中的值，换句话说，通过 `clip-path` 属性引用 `<clipPath>` 元素的元素的用户坐标系
-   `objectBoundingBox` ：坐标系的原点位于剪切路径应用的元素的边框的左上角，宽度和高度与边界框相同。边界框是所有 SVG 元素的对象边界框（仅包含元素的几何形状），并且是具有关联盒模型的 HTML 元素的边框框（`border-box`）。用户坐标等于 CSS 像素单位

  


通过前面的学习，我们知道当前用户坐标系统（也称为地本坐标系统）是当前活动的坐标系统，用于定义坐标和长度的位置和计算方式。但具有 CSS 盒模型框的 HTML 元素与只具有对象边界框的 SVG 元素所使用的当前用户坐标系统是不同的。

  


对于具有 CSS 盒模型框的 HTML 元素，其当前用户坐标系统的原点位于参考框的左上角，一个单位等于一个 CSS 像素。用于解析百分比值的视口由参考框的宽度和高度决定。例如下面这个示例：

  


```HTML
<div class="container">
    <svg class="element">
        <circle cx="100" cy="100" r="100" fill="lime" />
    </svg>
</div>
```

  


```CSS
.element {
    display: block;
    width: 400px;
    height: 400px;
    outline: 1px dashed;
}
```

  


上面代码中的 `<svg>` 元素包括了一个 `<circle>` 元素，该圆的中心位于 `(100,100)` ，那么该中心将在参考框的边界向右 `100` 像素和向下 `100` 像素的位置。

  


如果是 SVG 元素，则当前用户坐标系统的原点位于元素最近的视口（Viewport）的左上角。在大多数情况下，最近的视口是由最接近的祖先 `<svg>` 元素的 `width` 和 `height` 建立的。如果没有使用嵌套 `<svg>` ，它就是根 `<svg>` 元素创建的视口。这部分更详细的阐述，可以移步阅读《[中级篇：嵌套 SVG](https://juejin.cn/book/7341630791099383835/section/7359889736816656419)》!注意，SVG 元素上的坐标系统可以使用 `viewBox` 属性进行修改，它有助于更改坐标系统。

  


```HTML
<div class="container">
    <svg class="element" viewBox="0 0 100 100">
        <circle cx="100" cy="100" r="100" fill="lime" />
    </svg>
</div>
```

  


```CSS
.element {
    display: block;
    width: 400px;
    height: 400px;
    outline: 1px dashed;
}
```

  


上面 个示例，`<svg>` 元素的 `viewBox` 属性的值为 `0 0 100 100` ，它会调整用户坐标系统。这个时候 `<circle>` 的 `cx` 和 `cy` 的值会被放大四倍，因此它们的中心位置变成 `(400,400)` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb2f0fa34d7a4adf8f253e3f5ea510b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=895&s=296950&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/RwOOPOQ

  


如果把这个圆用于 `<clipPath>` 元素，并且不调整 `clipPathUnits` 属性的值，采用默认值。此时，它创建一个圆形剪切路径，将其应用于相应的元素上。例如：

  


```XML
<svg class="element" viewBox="0 0 100 100">
    <defs>
        <clipPath id="circlePath">
            <circle cx="100" cy="100" r="100" fill="lime" />
        </clipPath>
    </defs>
    
    <g stroke="red" stroke-width=".5">
        <rect id="r1" x=".5" y=".5" width="45" height="45" />
        <rect id="r2" x="0.5" y="54.5" width="45" height="45" />
        <rect id="r3" x="54.5" y="54.5" width="45" height="45" />
        <rect id="r4" x="54.5" y="0.5" width="45" height="45" />
    </g>

    <use href="#r1" clip-path="url(#circlePath)" fill="lime" />
    <use href="#r2" clip-path="url(#circlePath)" fill="pink" />
    <use href="#r3" clip-path="url(#circlePath)" fill="orange" />
    <use href="#r4" clip-path="url(#circlePath)" fill="yellow" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15cd46e90406428b9a98949bb8c4cf83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=927&s=207306&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/poBByeQ

  


上面所呈现的是 `clipPathUnits` 属性的值为 `userSpaceOnUse` 的效果。

  


`clipPathUnits` 属性除了默认值 `userSpaceOnUse` 之外，还可以设置为 `objectBoundingBox` 值。这个值对于 SVG 元素特别有用，因为它允许你将剪切路径应用于元素本身的边界框，而不是使用的坐标系统。下图向大家呈现了 `<clipPath>` 的 `clipPathUnits` 属性使用了 `userSpaceOnUse` 和 `objectBoundingBox` 将剪切路径应用于 SVG 画布中图像的结果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/204c2d06c458449fb56de935abddcbeb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1047&s=706738&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/oNOOzqr

  


使用 `userSpaceOnUse` （左）的剪切路径位于 SVG 视口（Viewport）的坐标系统中；使用 `objectBoundingBox` （右）时，将使用图像本身的边界框作为剪切路径的坐标系。

  


这里需要注意的一件重要事情是，当你使用 `objectBoundingBox` 值时，为剪切路径内容指定的坐标必须在 `[0, 1]` 范围内——坐标系变为单位系统，并且剪切路径内的形状的坐标必须是该范围内的分数。例如上面示例中使用的剪切路径是通过诸如 Figma 设计软件中获得的 `<path>` 值：

  


```XML
<clipPath id="userSpaceOnUse">
    <path d="M606.781 52.1984C462.235 132.238 334.013 -105.25 115.746 61.6765C-102.52 228.603 40.4452 392.634 144.708 438.971C248.971 485.309 305.313 772.556 435.115 730.957C564.918 689.358 448.018 607.475 683.925 417.907C919.832 228.339 751.327 -27.8409 606.781 52.1984Z" stroke="black" fill="none" />
</clipPath>
```

  


通常情况下，`<path>` 元素的 `d` 属性中的坐标都是基于用户当前坐标系统，即 `clipPathUnits` 为 `userSpaceOnUse` 时的值。这些值都是绝对值。如果你想将 `clipPathUnits` 的值设置为 `objectBoundingBox` ，那么需要将 `<path>` 的 `d` 属性中的绝对值转换为相对值（即转换为 `[0,1]` 范围的分数）。对于复杂的路径值，我们可以使用相应的转换工具来辅助将其值转换为符合需求的值：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbbc95bd17ea4f6db26194b9954a4726~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2444&h=1194&s=334511&e=jpg&b=fefefe)

  


> URL：https://yoksel.github.io/relative-clip-path/

  


```XML
<!-- 转换前：绝对值 -->
<clipPath id="userSpaceOnUse">
    <path d="M606.781 52.1984C462.235 132.238 334.013 -105.25 115.746 61.6765C-102.52 228.603 40.4452 392.634 144.708 438.971C248.971 485.309 305.313 772.556 435.115 730.957C564.918 689.358 448.018 607.475 683.925 417.907C919.832 228.339 751.327 -27.8409 606.781 52.1984Z" stroke="black" fill="none" />
</clipPath>

<!-- 转换后：相对值 -->
<clipPath id="objectBoundingBox" clipPathUnits="objectBoundingBox">
    <path d="M0.758,0.071 C0.578,0.18,0.418,-0.143,0.145,0.084 C-0.128,0.311,0.051,0.535,0.181,0.598 C0.311,0.661,0.382,1,0.544,0.995 C0.706,0.939,0.56,0.827,0.855,0.569 C1,0.311,0.939,-0.038,0.758,0.071" stroke="black" fill="none" />
</clipPath>
```

  


对于简单的剪切路径，我们可以直接将其转换为相应的分数值。

  


```XML
<!-- 转换前 -->
<clipPath id="circlePath">
    <circle cx="100" cy="100" r="100" fill="lime" />
</clipPath>

<!-- 转换后 -->
<clipPath id="circlePath" clipPathUnits="objectBoundingBox">
    <circle cx="1" cy="1" r="1" fill="lime" />
</clipPath>
```

  


如果将上面两个剪切路径分别用于不同的矩形元素：

  


```XML
<svg class="element" viewBox="0 0 100 100">
    <defs>
        <clipPath id="circlePath">
            <circle cx="100" cy="100" r="100" fill="lime" />
        </clipPath>
    </defs>
    
    <g stroke="red" stroke-width=".5">
        <rect id="r1" x=".5" y=".5" width="45" height="45" />
        <rect id="r2" x="0.5" y="54.5" width="45" height="45" />
        <rect id="r3" x="54.5" y="54.5" width="45" height="45" />
        <rect id="r4" x="54.5" y="0.5" width="45" height="45" />
    </g>

    <use href="#r1" clip-path="url(#circlePath)" fill="lime" />
    <use href="#r2" clip-path="url(#circlePath)" fill="pink" />
    <use href="#r3" clip-path="url(#circlePath)" fill="orange" />
    <use href="#r4" clip-path="url(#circlePath)" fill="yellow" />
</svg>

<svg class="element" viewBox="0 0 100 100">
    <defs>
        <clipPath id="circlePath2" clipPathUnits="objectBoundingBox">
            <circle cx="1" cy="1" r="1" fill="lime" />
        </clipPath>
    </defs>
    
    <g stroke="red" stroke-width=".5">
        <rect id="r11" x=".5" y=".5" width="45" height="45" />
        <rect id="r12" x="0.5" y="54.5" width="45" height="45" />
        <rect id="r13" x="54.5" y="54.5" width="45" height="45" />
        <rect id="r14" x="54.5" y="0.5" width="45" height="45" />
    </g>

    <use href="#r11" clip-path="url(#circlePath2)" fill="lime" />
    <use href="#r12" clip-path="url(#circlePath2)" fill="pink" />
    <use href="#r13" clip-path="url(#circlePath2)" fill="orange" />
    <use href="#r14" clip-path="url(#circlePath2)" fill="yellow" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/865019d4ffb3473abc2536325bcc295a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1047&s=386982&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/NWmmRrR

  


### 剪切路径的剪切规则

  


`clip-rule` 是 `<clipPath>` 的另一个重要属性，但也是相当复杂的，它属于 `<clipPath>` 的“展示属性”。这个属性仅适用于包含在 `<clipPath>` 元素内的图形元素。与 `clip-path` 属性结合使用时，它定义了在填充图形的不同部分时要使用的剪切规则或算法。[它与前面课程中所介绍的 fill-rule 属性是非常相似的](https://juejin.cn/book/7341630791099383835/section/7349188496181887017#heading-10)。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6cf350b8f70449a96c50c820e0a07fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1254&h=800&s=929075&e=gif&f=135&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/QWPgEyV

  


上图演示了 `fill-rule` 属性取值为 `nonzero` 和 `evenodd` 所产生的不同效果。`clip-rule` 属性的值也可以是 `nonzero` 和 `evenodd` ，它们的计算方式与 `fill-rule` 是相似的。即 `clip-rule` 属性指定要使用的算法，用于确定在使用图形元素创建的裁剪区域中给定点是否在形状内部。

  


-   `nonzero`: 这个值定义了一个点是在路径内部还是外部的方式，方法是从一个起始点向任意方向延伸一条线，并计算形状片段在特定方向上穿过线的位置。当一个片段从左向右穿过线时，计数递增；当一个片段从右向左穿过线时，计数递减。如果计数为零，则点在外部；如果非零，则在内部。
-   `evenodd`: 这个值定义了一个点是在路径内部还是外部的方式，方法是从该点向任意方向延伸一条线，并计算线穿过的形状片段数。如果计数为奇数，则点在内部；如果为偶数，则在外部。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/628f9d5ab8cc48c088fdd026d12dd335~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=620&s=263924&e=jpg&b=050505)

  


上图左说明了 `clip-rule` 为 `nonzero` 的规则；上图右说明了 `clip-rule` 为 `evenodd` 的规则。从左到右：

  


-   第一个形状是一个具有五个点的星形，以一个连续的、重叠的线绘制
-   第二个形状是两个顺时针绘制的圆，其中一个圆包含另一个圆，两者都是同一个形状的子路径
-   第三个形状是也是两个圆，其中较大的圆顺时针绘制，较小的圆逆时针绘制，两者都属于同一个形状

  


不难发现，当 `clip-rule` 的值为 `nonzero` 时，只有第三个形状有一个“孔”（外圆顺时针，内圆逆时针）；当 `clip-rule` 为 `evenodd` 时，所有三个形状都有一个“孔”。

  


`clip-rule` 属性可以放置在 `<clipPath>` 上，也可以在 CSS 中使用，也可以内联到 SVG 样式中。

  


```HTML
<div class="container">
    <div class="box"></div>
    <div class="box"></div>
</div>

<svg viewBox="0 0 250 250" class="sr-only">
    <defs>
        <clipPath id="clip-star" >
            <polygon fill="#F9F38C" stroke="#E5D50C" stroke-width="5" stroke-linejoin="round" points="47.773,241.534 123.868,8.466 200.427,241.534 7.784,98.208 242.216,98.208 " id="star" />
        </clipPath>
        
        <clipPath id="clip-flowers">
            <path id="flowers"  fill="#F4CF84" stroke="#D07735" stroke-width="5" d="M124.999,202.856  c-42.93,0-77.855-34.928-77.855-77.858s34.925-77.855,77.855-77.855s77.858,34.925,77.858,77.855S167.929,202.856,124.999,202.856z M125.003,245.385c-7.61,0-13.025-6.921-17.802-13.03c-2.79-3.559-6.259-8.002-8.654-8.638c-0.318-0.085-0.71-0.134-1.159-0.134 c-2.873,0-7.1,1.698-11.188,3.335c-4.929,1.973-10.029,4.021-14.774,4.021c-2.486,0-4.718-0.563-6.633-1.677 c-6.451-3.733-7.618-11.959-8.742-19.919c-0.646-4.571-1.45-10.261-3.292-12.096c-1.84-1.845-7.524-2.646-12.093-3.298 c-7.96-1.119-16.192-2.286-19.927-8.739c-3.682-6.358-0.614-14.005,2.35-21.404c1.829-4.563,3.904-9.735,3.201-12.352 c-0.638-2.392-5.073-5.861-8.64-8.648C11.539,138.025,4.618,132.612,4.618,125c0-7.61,6.921-13.025,13.027-17.802 c3.567-2.79,8.002-6.259,8.64-8.651c0.702-2.614-1.375-7.789-3.201-12.349c-2.961-7.399-6.029-15.046-2.347-21.409 c3.733-6.451,11.962-7.618,19.924-8.742c4.569-0.646,10.253-1.45,12.096-3.292c1.84-1.84,2.646-7.524,3.29-12.093 c1.127-7.96,2.291-16.192,8.745-19.924c1.914-1.111,4.147-1.674,6.633-1.674c4.745,0,9.845,2.045,14.771,4.021 c4.085,1.639,8.312,3.335,11.188,3.335c0.446,0,0.836-0.045,1.161-0.131c2.392-0.641,5.861-5.079,8.654-8.643 c4.782-6.109,10.194-13.03,17.804-13.03c7.612,0,13.025,6.921,17.804,13.027c2.782,3.565,6.259,8.002,8.654,8.643 c0.323,0.085,0.71,0.131,1.161,0.131c2.876,0,7.094-1.696,11.185-3.332c4.932-1.976,10.029-4.021,14.779-4.021 c2.478,0,4.715,0.563,6.627,1.671c6.448,3.733,7.618,11.962,8.739,19.927c0.646,4.569,1.453,10.253,3.292,12.093 c1.84,1.84,7.524,2.646,12.096,3.292c7.96,1.127,16.189,2.291,19.919,8.745c3.687,6.36,0.619,14.007-2.344,21.404  c-1.824,4.563-3.898,9.735-3.201,12.347c0.641,2.395,5.079,5.864,8.643,8.657c6.104,4.774,13.025,10.189,13.025,17.799 c0,7.612-6.921,13.025-13.03,17.804c-3.559,2.788-8.002,6.264-8.638,8.654c-0.702,2.614,1.375,7.783,3.201,12.347 c2.964,7.399,6.032,15.046,2.344,21.409c-3.733,6.448-11.959,7.618-19.924,8.739c-4.566,0.646-10.256,1.453-12.09,3.292 c-1.845,1.84-2.646,7.524-3.298,12.096c-1.119,7.96-2.291,16.189-8.745,19.919c-1.909,1.113-4.147,1.677-6.627,1.677 c-4.745,0-9.839-2.048-14.768-4.021c-4.091-1.637-8.315-3.335-11.19-3.335c-0.446,0-0.836,0.048-1.161,0.134 c-2.392,0.635-5.861,5.073-8.648,8.638C138.027,238.464,132.615,245.385,125.003,245.385z" />
        </clipPath>
    </defs>
</svg>
```

  


```CSS
:root {
    --clip-rule: nonzero;
}

#star,#flowers {
    clip-rule: var(--clip-rule);
}

.box {
    &:nth-child(1) {
        clip-path: url(#clip-star);
    }
    &:nth-child(2) {
        clip-path: url(#clip-flowers);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/561dc434fbcb440bb6afa94194db1400~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1418&h=496&s=1230875&e=gif&f=157&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/YzMMxWM

  


注意，上图左侧演示了 `fill-rule` 应用于 SVG 图形的效果，右侧则演示了 `clip-rule` 应用于裁剪路径上的效果。

  


## SVG 剪切案例

  


在之前，我们重点讨论了 SVG 剪切的理论知识。现在，我想通过一些实际案例，进一步探讨 SVG 剪切的应用领域。我希望通过这些案例加深大家对 SVG 剪切的理解，并将学到的理论知识应用到实际操作中，从而为大家在构建 Web 应用时提供一些实用的技巧和灵感。

  


### 完美的提示工具

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec2211ce054b4384bfd8dda72f1b2fe0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=720&s=28144&e=avif&b=f5f9fa)

  


Tooltip （信息提示）组件是 Web 中常见的一种应用。 能于普通的信息提示 UI 效果，我们使用 CSS 的 `clip-path` 属性就可以实现。例如：

  


```CSS
.tooltips::before {
    clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 50% 75%, 50% 100%, 45% 75%, 0% 75%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f8bc7e327b94408ac8b9c4b496d93a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=496&s=382152&e=gif&f=108&b=030303)

  


> Demo 地址： https://codepen.io/airen/full/NWmmwNm

  


遗憾的是，如果提示框的方向指示符形状不是一个多边形，而是一个平滑的路径图形时，就不得不考虑 SVG 的 `<path>` 构建的剪切路径。这也意味着，使用 SVG 的 `<clipPath>` 可以帮助我们构建 UI 更为复杂的提示框组件。

  


```HTML
<div class="tooltips" data-content="Hello Tooltips with Pure CSS">❓</div>
<svg class="sr-only">
    <clipPath id="tooltip" clipPathUnits="objectBoundingBox">
        <path d="M1,0H0v0.9302195h0.4483962C0.477628,0.9342086,0.5003342,0.9639273,0.5003369,1h0.0000107 c0-0.0360727,0.022709-0.0657914,0.0519407-0.0697805H1V0z" />
    </clipPath>
</svg>
```

  


```CSS
.tooltips::before {
    clip-path: url(#tooltip);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4a7b5c93615414bbda2dbeef303dd0f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=486&s=384234&e=gif&f=130&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/LYvvOjO

  


### 精美的悬浮效果

  


不管是 CSS 的剪切还是 SVG 的剪切，它们常常能给鼠标的悬浮交互带来与众不同的交互效果。例如下面这个卡片效果，SVG 的 `<clipPath>` 将给卡片带来一些精致的，引人注目的悬浮效果。

  


```HTML
<div class="card">
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 300 200" class="sr-only">
        <defs>
            <clipPath id="clip-0">
                <circle cx="0" cy="0" fill="#000" r="150px" />
            </clipPath>
        </defs>
        <text class="svg-text" dy=".3em" x="50%" y="50%">X-rays</text>
        <g clip-path="url(#clip-0)">
            <image height="100%" preserveAspectRatio="xMinYMin slice" width="100%" href="https://picsum.photos/1024/768?random=52" />
            <text class="svg-masked-text" dy=".3em" x="50%" y="50%">X-rays</text>
        </g>
    </svg>
</div>
```

  


```CSS
@layer demo {
    .cards {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(min(100% - 2rem, 300px), 1fr)
        );
        gap: 1rem;
        align-items: start;
        align-content: start;
    }

    .card {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        background-color: #3b3e46;
        border-radius: 2px;
        box-shadow: 0 5px 5px rgb(0 0 0 / 0.02),inset 0 0px 0px 1px rgb(0 0 0 / 0.07);
        transform: translateZ(0);
        
        circle {
            transform-origin: 50% 50%;
            scale: 0;
            transition: scale 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
    
        text {
            font-size: 1.1rem;
            text-transform: uppercase;
            text-anchor: middle;
            letter-spacing: 1px;
            font-weight: 600;
        }
    
        .svg-text {
            fill: #545a64;
        }
    
        .svg-masked-text {
            fill: white;
        }
        
        image {
            scale: 1.1;
            transform-origin: 50% 50%;
            transition: scale 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
    
        &:hover  {
            :is(circle, image) {
                scale: 1;
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa60a2e9ed1c434d98b6bcd9c23483c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1328&h=680&s=3397233&e=gif&f=175&b=32333b)

  


> Demo 地址：https://codepen.io/airen/full/BaEEmOg

  


注意，示例中还通过 JavaScript 代码，改变剪切路径 `<circle>` 的 `cx` 和 `cy` 的坐标值！详细代码请查看案例源码！

  


### 不一样的用户头像

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93ed422c63f34ada9dd94a47c7af0353~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=1517&s=64512&e=webp&b=faf4f3)

  


用户头像（UserAvatar）在 Web 应用中也是无处不在。我们可以利用 SVG 的剪切功能可以为用户头像添加一些与众不同的效果。我们先从简单的开始。例如，语音助手或语音控制的应用程序，给头像添加一个动画效果，用于呈现语音识别技术的应用：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69b298f86d2a4cddbd9d985b75dde7ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200&h=680&s=14664978&e=gif&f=251&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/WNWWdMp

  


这个效果很简单。使用 `<clipPath>` 定义了一个圆形的剪切路径，并且将该剪切路径应用于用户头像（`<image>`）。注意，用户头像一圈圈 涟漪的效果是使用 SVG 的 `<animate>` 来实现的，改变圆的半径（`r`）和填充颜色的透明度（`fill-opacity`）。

  


```HTML
<div class="visual">
    <svg viewBox="0 0 320 320">
      <defs>
          <circle id="circle-clip" cx="50%" cy="50%" r="25%" />
          <clipPath id="avatar-clip">
              <use href="#circle-clip" />
          </clipPath>
      </defs>
    
      <!-- 涟漪动画效果 -->
      <g fill="white" fill-opacity="1">
            <circle cx="50%" cy="50%" r="25%">
                <animate attributeName="r" values="25%;50%" dur="4s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="1;0" dur="4s" repeatCount="indefinite" />
            </circle>
    
            <circle cx="50%" cy="50%" r="25%">
                <animate attributeName="r" values="25%;50%" dur="4s" begin="1s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="1;0" dur="4s" begin="1s" repeatCount="indefinite" />
            </circle>
    
            <circle cx="50%" cy="50%" r="25%">
                <animate attributeName="r" values="25%;50%" dur="4s" begin="2s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="1;0" dur="4s" begin="2s" repeatCount="indefinite" />
            </circle>
    
            <circle cx="50%" cy="50%" r="25%">
                <animate attributeName="r" values="25%;50%" dur="4s" begin="3s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="1;0" dur="4s" begin="3s" repeatCount="indefinite" />
            </circle>
        </g>
    
        <image clip-path="url(#avatar-clip)" height="50%" width="50%" x="25%" y="25%" href="http://i.pravatar.cc/300?img=3"  />
    </svg>
</div>
```

  


注意，示例中涟漪的颜色变化是通过 CSS 的自定义属性来实现的。即改变 SVG 圆的填充颜色。

  


```CSS
@layer demo {
    .visual {
        --fill-color: #fff;
        
        g {
            fill: var(--fill-color); 
        }
    }
}
```

  


注意，上面示例中的涟漪动效，可以直接使用 CSS 动画来实现，感兴趣的同学不妨一试，这里就不向大家展示了！

  


上面这个示例相对而言还是比较简单的，接下来看一个稍微复杂那么一点点的效果，即用户头像弹出的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07cbf6d85660407e93b46756388cd901~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=568&s=3481510&e=gif&f=74&b=efeeee)

  


> Demo 地址：https://codepen.io/ainalem/full/QWGNzYm （来源于 [@Mikael Ainalem](https://codepen.io/ainalem)）

  


上面这个效果是 [@Mikael Ainalem](https://codepen.io/ainalem) 使用 CSS 的 `clip-path` 的 `path()` 函数实现的。不过，接下来，我想向大家展示如何使用 SVG 的 `<clipPath>` 来实现它。

  


这个效果的基本思想是，当鼠标悬停在元素上时，用户头像看起来会从背景图中弹出并放大。一个重要的细节是，用户头像（前景图）动画（放大和向上移动）看起来与背景图像动画（仅放大）是独立的。这个效果看起来不错，而且 CSS 的 `clip-path` 属性引用 `path()` 值可以得到一个不错的效果。但 `path()` 应用于 CSS 的 `clip-path` 属性时会受到一些限制，到目前为止，它只能使用像素值，这意味着它不具备响应式。

  


如果你希望构建一个具备响应式的效果，那么可以考虑使用 SVG 的 `<clipPath>` 来替代 CSS 的 `clip-path` 。因为，SVG 的 `<clipPath>` 和 `<path>` 元素会自动适应 SVG 元素的坐标系统，因此它们具有响应式。随着 SVG 元素的缩放，它的坐标系统也在缩放。这也是 SVG 的最大特性之一。

  


实现这个效果，我们需要两个 `<path>` 元素，分别定义前景图片和背景图片的剪切路径：

  


```XML
<svg viewBox="0 -10 100 120">
    <path d="M100 63A50 50 0 110 70C0 42 20 0 48 0c27 0 52 42 52 70z" fill="lime"/>
    <path d="M190 101a50 50 0 01-50 50 50 50 0 01-50-50 50 50 0 0150-50 50 50 0 0150 50z" fill="orange" transform="translate(-90, -34)"/>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfa11247003c494a964ea9774d172b6a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1484&s=297554&e=jpg&b=ffffff)

  


绿色的 `<path>` 表示将应用于前景和背景图片的剪切路径，橙色的 `<path>` 将应用于背景图像的剪切路径。注意，它们需要被包裹在 `<clipPath>` 元素当中：

  


```HTML
<figure>
    <svg viewBox="0 -10 100 120" class="image">
        <defs>
            <!-- 定义用于前景和背景图像的剪切路径 -->
            <clipPath id="maskImage" clipPathUnits="userSpaceOnUse">
                <path d="M100 63A50 50 0 110 70C0 42 20 0 48 0c27 0 52 42 52 70z" />
            </clipPath>
            <!-- 定义用于背景图像的剪切路径 -->
            <clipPath id="maskBackground" clipPathUnits="userSpaceOnUse">
                <path d="M190 101a50 50 0 01-50 50 50 50 0 01-50-50 50 50 0 0150-50 50 50 0 0150 50z" />
            </clipPath>
        </defs>
    
        <g clip-path="url(#maskImage)" transform="translate(0 -7)">
            <!-- 背景图像 -->  
            <image clip-path="url(#maskBackground)" width="120" height="120" x="70" y="38" href="https://res.cloudinary.com/dazdt97d3/image/upload/v1615813805/background.png" transform="translate(-90 -31)" />
            
            <!-- 前景图像 -->
            <image width="120" height="144" x="-15" y="0" fill="none" class="image__foreground" href="https://res.cloudinary.com/dazdt97d3/image/upload/v1615813805/foreground.png" />
        </g>
    </svg>
</figure>
```

  


当然，实现整个效果，我们还需要应用一些 CSS，例如在鼠标悬浮状态，使用 CSS 的 `transform` （或 `translate` 和 `scale` ）和 `transition` 改变图片的位置和大小。具体代码如下：

  


```CSS
@layer demo {
    .image {
        scale: 0.9;
        transition: scale 0.2s ease-in;
        
        .image__foreground {
            transform-origin: 50% 50%;
            translate: 0 4px;
            scale: 1;
            transition: translate 0.2s ease-in, scale 0.2s ease-in;
        }
    
        &:hover {
            scale: 1;
    
            .image__foreground {
                translate: 0 -7px;
                scale: 1.05;
            }
        }
    }
    
    figure {
        width: 50vh;
        aspect-ratio: 1;
    }
}
```

  


最终呈现的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba80c5542bbe4243a8a6bc7e70b5612e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=678&s=3933006&e=gif&f=116&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/xxeeYbo

  


上面展示的两个用户头像都是带动画效果的，接下来向大家演示一个带提示符（徽标）效果的用户头像：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad5fc921d0a24d9fb1aa3d4975461cf4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=721&s=149621&e=jpg&b=fefdfd)

  


上图是来自 Facebook Messenger 的一个真实用例。用户头像带有一个绿色徽章，表示用户当前是在线状态。这种 UI 设计在 Web 上也是很常见，可能的差异就是用户头像的会标位置和颜色有所不同。

  


当然，CSS 实现类似的效果也很容易，只需要给绿色徽标添加一个与背景颜色相同的边框即可。注意，这里明显提到过，与背景颜色相同，这也意味着，当背景颜色不同时，徽标边框的颜色也需要不断的调整，这是 CSS 方案的明显缺陷之一。

  


这意味着，纯 CSS 方案可能不是一个最佳解决方案。我们可以考虑 CSS 和 SVG 混合方案来解决 CSS 方案存在的缺陷（徽章边框颜色与背景颜色相匹配）。CSS 和 SVG 混合方案最大的优势是，使用 SVG 的 `<path>` 为用户头像创建一个类似下图的裁剪路径：

  


```XML
<svg viewBox="0 0 1 1">
    <path d="M0.5,0 C0.776,0,1,0.224,1,0.5 C1,0.603,0.969,0.7,0.915,0.779 C0.897,0.767,0.876,0.76,0.853,0.76 C0.794,0.76,0.747,0.808,0.747,0.867 C0.747,0.888,0.753,0.908,0.764,0.925 C0.687,0.972,0.597,1,0.5,1 C0.224,1,0,0.776,0,0.5 C0,0.224,0.224,0,0.5,0" fill="#000" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2126c8a45c94462293740cf0e261dd6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1137&s=140290&e=jpg&b=ffffff)

  


注意，我们可以使用诸如 Figma 这样的设计软件获得上图所示形状的颜色路径，但在应用于实际项目中时，[需要通过工具将其转换为相对单位](https://yoksel.github.io/relative-clip-path/)（默认情况之下，路径的点坐标是绝对值）。这意味着，如果宽度和高度发生变化，它们就会被拉伸，转换为相对值之后，就不会存在该问题。

  


将带有相对值的路径放置在 `<clipPath>` 中，这样你就创建了一个带有上图形状的剪切路径：

  


```XML
<svg class="sr-only">
    <defs>
        <clipPath id="avatar-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0 C0.776,0,1,0.224,1,0.5 C1,0.603,0.969,0.7,0.915,0.779 C0.897,0.767,0.876,0.76,0.853,0.76 C0.794,0.76,0.747,0.808,0.747,0.867 C0.747,0.888,0.753,0.908,0.764,0.925 C0.687,0.972,0.597,1,0.5,1 C0.224,1,0,0.776,0,0.5 C0,0.224,0.224,0,0.5,0"></path>
        </clipPath>
    </defs>
</svg>
```

  


注意，`clipPathUnits` 属性的值 `objectBoundingBox` 表示路径内的值是相对于应用了剪切路径的元素的边界框。

  


有了这个基础，我们就可以通过 CSS 的 `clip-path` 将 SVG 的 `<clipPath>` 定义的剪切路径应用到用户头像上：

  


```HTML
<div class="card">
    <div class="avatar">
        <img src="http://i.pravatar.cc/300?img=2" alt="" />
    </div>
    <div class="card__content">
        <h3>w3cplus</h3>
        <span>Front-end technologist</span>
    </div>
</div>

<svg class="sr-only">
    <defs>
        <clipPath id="avatar-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0 C0.776,0,1,0.224,1,0.5 C1,0.603,0.969,0.7,0.915,0.779 C0.897,0.767,0.876,0.76,0.853,0.76 C0.794,0.76,0.747,0.808,0.747,0.867 C0.747,0.888,0.753,0.908,0.764,0.925 C0.687,0.972,0.597,1,0.5,1 C0.224,1,0,0.776,0,0.5 C0,0.224,0.224,0,0.5,0"></path>
        </clipPath>
    </defs>
</svg>
```

  


```CSS
@layer demo {
    .card {
        display: flex;
        gap: 2rem;
        align-items: center;
        border: 1px solid rgb(0 0 0 / 0.5);
        background: #fff;
        padding: 1rem;
        border-radius: 0.5em;
        color: #333;
        transition: all .2s ease-in;
        
        &:hover {
            background: #607D8B;
            color: #fff;
        }
    }
    
    .avatar {
        position: relative;
        width: 120px;
        aspect-ratio: 1;
        flex-shrink: 0;
    
        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            clip-path: url("#avatar-clip");
        }
    
        &::before,
        &::after {
            content: "";
            position: absolute;
        }
    
        &::before {
            width: 20px;
            height: 20px;
            background: oklch(0.87 0.29 140.72);
            border-radius: 50%;
            right: 8px;
            bottom: 6px;
        }
    
        &::after {
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid;
            opacity: 0.2;
            clip-path: url("#avatar-clip");
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09247e023d604df1b56016ebebba8096~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=478&s=553039&e=gif&f=116&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/oNOOqKP

  


这里有一个小技巧，可以使用 `transform` 来调整 `<clipPath>` 中的 `<path>` ，并调整徽章的定位，可以使得徽章在任意你想要的位置：

  


```CSS
#avatar-clip path {
    transform: rotate(275deg);
    transform-box: fill-box;
    transform-origin: center;
}

.avatar::before {
     right: 2px;
     top: 11px;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/860b9efb3cab4eacb406b5bfaeb13ab4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=508&s=642018&e=gif&f=100&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/JjVVvJe

  


### 创建圆形导航菜单

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6e5e5bd70354d7aad6638668560d5b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1137&s=621064&e=jpg&b=100841)

  


类似上图的 UI 效果，大家应该不会感到陌生。在现代 Web 的开发中，CSS 有很多方案可以实现上图中 UI 的效果，例如 CSS 的[锥形渐变](https://juejin.cn/book/7223230325122400288/section/7259668771856941111)、[变换](https://juejin.cn/book/7288940354408022074/section/7295240572736897064)和[三角函数](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)等。

  


在这里，我们以圆形导航菜单为例，使用 SVG 的 `<clipPath>` 和变换来实现。

  


我们需要创建一个圆形导航菜单，导航菜单的每一项都是一个扇形，我们可以使用 SVG 的 `<path>` 来绘制这个扇形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9aa363e0e5694edda0b506b57f677aa1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=692&s=2591771&e=gif&f=324&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/bGJJmNr

  


每一个扇形由三个点，一个半径和一个角度定义。为了使用 SVG 的 `<path>` 元素绘制扇形，你需要知道三个点的坐标。然后使用路径命令，我们将移动到圆的中心（第一个点），画一条线到圆的周长（第二个点），然后从第二个点画一个圆弧到第三个点的位置，然后通过一条线返回中心（第一个点）位置来关闭路径：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dca6e7305414e00bf2ac31ad7b8da08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=700&s=348279&e=gif&f=115&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/mdggZrL

  


上图中三个彩色点是绘制扇形所需的点。因此，让我们进行一些简单的计算，确定这些点的坐标。

  


假设你构建了一个 `500 x 500` 的 SVG 画布，并且圆形菜单的半径为 `250` 。圆形菜单的圆心将位于 SVG 画布的正中心，因此圆心点 A （上图中蓝色圆点）的坐标将是 `(250,250)` ，第二个点 B （上图中橙色圆点）位于圆形菜单的圆周上，它的坐标是 `(500, 250)`。第三个点 C （上图中粉色圆点）的坐标，我们需要知道角度的值，该角度的值可以根据菜单项的数量来确定。例如，如果菜单项是 `12` 项，那么这个角度的值则是 `30` 度（`360 ÷ 12 = 30`）。如此一来，我们就可以根据三角函数计算出 C 点的坐标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cfdf658551f44a6a6e7a3110a40e1ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2158&h=1658&s=843733&e=jpg&b=2c2c48)

  


也就是说，使用给定的数据和角度，我们就可以根据上图中的正弦和余弦函数，计算出点 C 的极坐标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebd7bf6bc6854f159d24227f9aa931cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1477&s=660333&e=jpg&b=050505)

  


即点 C 的 `x` 值等于 `cos(θ) × radius` ，`y` 值等于 `sin(θ) × radius` 。

  


注意，对于路径数据，我们需要点的笛卡尔坐标，这意味着我们需要将已知的极坐标 `x` 和 `y` 转换为笛卡尔坐标。

  


```javacrtip
// 获取弧度制的角度值
angleInRadians = -angleInDegrees * Math.PI / 180.0; 
👇
angleInRadians = -30 * Math.PI / 180.0 👉 -0.5235987755982988
👇
angleInRadians = -0.5235987755982988

// 获取笛卡尔x坐标（centerX = 圆的中心的x坐标 == 在我们的情况下为250像素）
x = centerX + radius * Math.cos(angleInRadians);
👇
x = 250 + 250 * Math.cos(-0.5235987755982988) 👉 466.5063509461097
👇
x = 466.5063509461097

// 获取笛卡尔y坐标（centerY = 圆的中心的y坐标 == 在我们的情况下为250像素）
y = centerY + radius * Math.sin(angleInRadians);
👇
y = 250 + 250 * Math.sin(-0.5235987755982988) 👉 125.000000000000
👇
y = 125.000000000000
```

  


最终计算出 C 点的坐标为 `(466.50, 125)` 。有了这三个点的坐标，你就可以使用 `<path>` 的命令绘制出扇形：

  


```XML
<svg>
    <path d="M250,250 l250,0 A250,250 0 0,0 466.50,125 z" />
</svg>
```

  


这里使用了四个命令：`M` 、`l` （小写的 `L`）、`A` 和 `z` 。

  


首先，移动（`M`）坐标为 `250,250` 的点（`M250,250`），也就是圆心位置。

  


接下来，画一条线（`l`）到相对于当前位置的 `250,0` 的点（`l250,0`）。换句话说，当我们移动到桃色点 B 时，我们不使用该点的坐标。我们计算的是这个点相对于当前位置（在这种情况下是圆的中心）的水平和垂直距离。但是，如果你使用 `L` 命令，则可以使用橙色点 B 的坐标，该命令使用绝对坐标而不是相对坐标绘制线条。所以，从中心向右移动 `250` 个用户单位，沿着这个方向绘制一条线。

  


接着，使用 `A` 命令从当前位置 B点（`A250,250 0 0,0`）到粉色 C 点（`466.50,125`）绘制一个弧形。大写 `A` 命令将使用绝对值绘制弧线；也就是说，它将从当前位置绘制一条弧线到你在坐标中指定的位置，而这些坐标将是绝对的，而不是相对于当前位置的。

  


最后，使用 `z` 命令关闭路径，即从粉色 C 点回到蓝色 A 点（圆中心），扇形绘制完成。

  


如此一来，我们可以将绘制好的扇形 `<path>` 放置到 `<clipPath>` 元素中，它就变成了一个具有扇形形状的剪切路径：

  


```XML
<svg class="sr-only">
    <defs>
        <clipPath id="sector">
            <path d="M250,250 l250,0 A250,250 0 0,0 466.50,125 z" />
        </clipPath>
    </defs>
</svg>
```

  


使用 CSS 的 `clip-path` 引用 `<clipPath>` 创建的 `#sector` 剪切路径，你就可以获得一个圆形的导航菜单：

  


```HTML
<ul class="menu" style="--counts: 12;">
    <li style="--index: 0;">
        <span>item1</span>
    </li>
    <li style="--index: 1;">
        <span>item2</span>
    </li>
    <li style="--index: 2;">
        <span>item3</span>
    </li>
    <li style="--index: 3;">
        <span>item4</span>
    </li>
    <li style="--index: 4;">
        <span>item5</span>
    </li>
    <li style="--index: 5;">
        <span>item6</span>
    </li>
    <li style="--index: 6;">
        <span>item7</span>
    </li>
    <li style="--index: 7;">
        <span>item8</span>
    </li>
    <li style="--index: 8;">
        <span>item9</span>
    </li>
    <li style="--index: 9;">
        <span>item10</span>
    </li>
    <li style="--index: 10;">
        <span>item11</span>
    </li>
    <li style="--index: 11;">
        <span>item12</span>
    </li>
</ul>
```

  


```XML
@layer demo {
    .menu {
        --h: 30;
        --deg: calc(360deg / var(--counts));
        display: grid;
        outline: 1px dashed;
        width: 500px;
        aspect-ratio: 1;
    
        li {
            --_h: calc(var(--index) * var(--h));
            rotate: calc(-1 * var(--index) * var(--deg));
            list-style: none;
            grid-area: 1 / 1 / -1 / -1;
    
            background: hsl(var(--_h) 60% 45%);
            clip-path: url(#sector);
            position: relative;
            transition: all 0.2s linear;
            cursor: pointer;
    
            &:hover {
                background: hsl(var(--_h) 55% 35%);
            }
        }
    
        span {
            position: absolute;
            right: 10%;
            top: 38%;
            transform: rotate(75deg);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9addc748e3148aaa17d3dde355f1ad5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=658&s=1436253&e=gif&f=133&b=030303)

  


> Demo 地址： https://codepen.io/airen/full/JjVVgPL

  


看上去似乎不错，但遗憾的是，上面这个案例并不具备响应式能力，尝试着调整容器大小，你会发现它的效果并不是我们所期望的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d3884c51df14495afc3884762a16bef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=782&s=11588438&e=gif&f=349&b=040404)

  


造成这种现象是，是由于 `<clipPath>` 的 `clipPathUnits` 属性应用的是默认值 `userSpaceOnUse` ，表示在定位剪切路径时使用页面上的坐标系统（在 HTML 的情况下）或正在使用当前用户坐标系统（在 SVG 的情况下），这意味着它可能会真正应用于你的元素，也可能不会，这取决于元素在页面或画布上的位置。

  


我们可以将 `<clipPath>` 的 `clipPathUnits` 设置为 `objectBoundingBox` 。这个时候绘制扇形路径的点的坐标是使用相对值，并且值在 `[0,1]` 范围内设置。这些值原则上与百分比值非常相似，并将相对于元素的边界框进行计算，即元素的宽度和高度。

  


我们可以按照前面的方式重新定义蓝色点 A（第一个点，圆心位置） 、橙色点 B（第二个点，位于圆周上）和粉色点 C （第三个点，也位于圆周上）的坐标。换句话说，SVG 画布的尺寸变成了 `1 x 1` ，圆的半径为 `0.5` （元素宽度的一半），圆心也位于 `(0.5,0.5)` ，即第一个点 A 的坐标位于 `(0.5,0.5)` 。第二个点 B 的坐标位于 `(1,0.5)` 。使用三角函数，计算出第三个点 C 的坐标位于 `(0.75, 0.066987298)` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae624707f04342c78dc2ef40da5d0cf2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1477&s=685076&e=jpg&b=050505)

  


有了这些数据，我们可以创建定义我们的 `<clipPath>` 的 `<path>`，并准备将其应用于我们的菜单项。

  


```XML
<svg class="sr-only">
    <defs>
        <clipPath id="sector" clipPathUnits="objectBoundingBox">
             <path d="M0.5,0.5 l0.5,0 A0.5,0.5 0 0,0 0.75,.066987298 z" />
        </clipPath>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f39d84571d8e4d79a37c2b02ec167ff2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298&h=772&s=3836705&e=gif&f=159&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/wvZbvwE

  


注意，为了保证圆形导航菜单具有一个较好的缩放效果，请确保每个导航项目的宽高比都是 `1:1` ，与 SVG 的宽高比保持一致。

  


## 小结

  


SVG 剪切是一种强大的技术，用于定义要在 SVG 图形上进行裁剪或遮罩的区域。它允许我们在 SVG 图形中创建各种视觉效果和动画，从简单的图形裁剪到复杂的动态效果都能实现。在使用 SVG 剪切时，以下几个关键点值得注意：

  


-   `<clipPath>`元素：`<clipPath>` 元素是 SVG 中用于定义剪切路径的基本组件。它允许我们创建任意形状的裁剪区域，可以是矩形、圆形、多边形或自定义路径。通过在 `<clipPath>` 元素中定义裁剪路径，并将其赋予一个唯一的 ID ，我们可以在 SVG 文档中重复使用该裁剪路径，提高代码的可维护性和重用性。
-   `clip-path` 属性：`clip-path` 属性是 CSS 中用于将剪切路径应用于 SVG 元素的属性。它可以直接在 CSS 中定义 SVG 路径或形状，也可以通过 `url(#pathIdName)` 引用已定义的 `<clipPath>` 元素。`clip-path` 属性的灵活性使得我们可以轻松地创建各种复杂的剪切效果，如动态剪切、用户交互等。注意，你也可以直接在 SVG 元素上使用 `clip-path` 属性，对该元素进行裁剪
-   剪切路径的应用：剪切路径可以应用于 SVG 元素的任何部分，包括形状、图像、文本等。通过将剪切路径应用于元素，只有位于剪切路径内的内容才会显示出来，超出剪切路径范围的内容则会被隐藏。这使得我们可以实现各种独特的视觉效果，如形状蒙版、动态裁剪动画等。
-   动态剪切效果：利用 CSS 动画和过渡，我们可以为剪切路径创建动态效果，使得裁剪区域可以在 SVG 图形上移动、变形或旋转。这为我们提供了丰富的创作可能性，可以实现各种引人注目的动画效果。

  


总的来说，SVG 剪切技术为我们提供了丰富多彩的图形效果和动画表现力。通过灵活运用 `<clipPath>` 元素和 `clip-path` 属性，我们可以创造出各种引人注目的 SVG 图形和动画，为 Web 设计和开发带来更多的创意和灵感。