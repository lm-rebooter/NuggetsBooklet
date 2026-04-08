CSS 为 Web 开发者提供了多种不同[裁剪图片或元素](https://juejin.cn/book/7199571709102391328/section/7199845888997457959)的技术，比如 CSS 的 `clip` 、`object-fit` 、`image()` 和 [CSS Clipping（clip-path）与 CSS Masking（mask）](https://juejin.cn/book/7223230325122400288/section/7259668885224456252)等。除此之外，[@Jake Archibald 提出了一个新的功能，即 CSS 的 object-view-box](https://github.com/WICG/view-transitions/issues/120) 。它允许你对元素的内容进行缩放或平移，从表现形式上看，它既有点类似于 CSS 的 `clip-path` 属性的表现，又有点类似于带有 `viewBox` 的 `<svg>` 元素的行为。在这节课中，我将与大家一起探讨 `object-view-box` 属性的使用，它能给 Web 开发者带来哪些便利，Web 开发者在使用的时候需要注意哪些细节？

## 需求与痛苦

Web 开发人员经常需要在开发过程中处理图像。有时，在 Web 上的不同部分对图像进行缩放和定位时会令 Web 开发者感到头痛与沮丧，甚至可能会让事情变得更为复杂。如下图所示，有一张较大版本的原始大图，需要在不同的终端（比如笔记本电脑、平板和手机端）上呈现不同区域的图片内容。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d70a48dc13b4aee9015700e56b8c899~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1055&s=975869&e=jpg&b=1b1b27)

目前，我们可以通过以下方式之一来解决这个问题：

-   使用 `<img>` ，并将其放置在一个容器内
-   将图片用作背景图，并根据需要调整背景图的位置和大小

先来看第一种解决方案。

假设你的原图如下所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb440e01fd68417bb0248417efc2a925~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=432&s=96333&e=jpg&b=d6c9b6)

你需要在 HTML 中把 `<img>` 放置在一个容器中，比如 `<figure>` ：

```HTML
<figure>
    <img src="hero.png" alt="" />
</figure>
```

```CSS
@layer figure {
    figure {
        overflow: hidden;
        position: relative;
    
        & img {
            position: absolute;
        }
    
        &.desktop {
            width: 558px;
            height: 316px;
    
            & img {
                left: -3.2%;
                top: -5.7%;
            }
        }
    
        &.tablet {
            width: 338px;
            height: 402px;
    
            & img {
                top: -1%;
                left: -35%;
            }
        }
        &.iphone {
            width: 262px;
            height: 372px;
    
            & img {
                left: -60%;
                top: -5.5%;
            }
        }
    }
}
```

上面示例中，简单的使用 `.desktop` 、`.tablet` 和 `.iphone` 来模拟了原图在笔记本电脑、平板和手端端的展示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2951ed62f15e496f81514245e30e1b69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=867&s=1048763&e=jpg&b=565775)

> Demo 地址：<https://codepen.io/airen/full/JjwJoJr>

另外一种方式就是将图片当作背景图，通过改变它的位置（`background-position`）来实现：

```CSS
@layer figure {
    figure {
        overflow: hidden;
        outline: 4px solid orange;
        background: var(--bg) no-repeat;
        background-size: 800 auto;
    
        &.desktop {
            width: 558px;
            height: 316px;
            background-position: -10px -20px;
        }
    
        &.tablet {
            width: 338px;
            height: 402px;
            background-position: -100px -10px;
        }
        
        &.iphone {
            width: 262px;
            height: 372px;
            background-position: -150px -6px;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d68555e10134db0900969ed09a3c925~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=867&s=907524&e=jpg&b=565774)

> Demo 地址：<https://codepen.io/airen/full/bGORNON>

这两种方法都可以正常工作。当然，在 CSS 中还存有其他的解决方案，比如 `clip-path` 或 `mask` 之类，但没有一个方案可以像 `object-view-box` 简单和干净。

## object-view-box 是什么？

[W3C 规范是这样描述 object-view-box](https://w3c.github.io/csswg-drafts/css-images-5/#propdef-object-view-box) ：

> The `object-view-box` property specifies a “view box” over an element, similar to the `<svg viewBox>` attribute, zooming or panning over the element’s contents.

大致的意思是，CSS 的 `object-view-box` 属性为元素指定了一个视窗框（View Box），这个视窗框有点类似于 `<svg>` 元素的 `viewBox` 属性，可以对元素的内容进行缩放或平移。也就是说，CSS 的 `object-view-box` 属性通过指定元素上的一个视窗框来实现元素内容缩放或平移，使我们能够调整位置和缩放，以满足我们的特定需求。

简而言之，就像相机镜头可以调整以放大或缩小或在视野之外平移一样，`object-view-box` 属性允许我们放大元素的特定部分或在元素周围平移以显示元素的不同部分。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/902e621b8547493fbcf8c3a55a689d9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1240&h=612&s=2554574&e=gif&f=297&b=292841)

> Demo 地址：<https://2019.wattenberger.com/guide/scaling-svg>

注意，上图是调整 `<svg>` 的 `viewBox` 参数的效果。CSS 的 `object-view-box` 与上图有相似的效果。

## SVG 的 viewBox

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/203513afb05b4676938c07fda05fd669~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=420&s=32758&e=webp&b=cdc7bc)

为了能更好的理解和用好 `object-view-box` 属性，我们有必要花一点时间来了解一下 `<svg>` 元素的 `viewBox` 属性。这一点非常重要。

SVG 中有一空间概念，它可分为 `viewport` 和 `viewBox` 两个部分，你可以把 `viewport` 比作一个相框，而 `viewBox` 比作相片：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/436651ee3f724bf586d88f03ef54027d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1237&s=694615&e=jpg&b=59884b)

正如你所看到的，其中 `viewport` 的大小就是相框的大小，也就是你的眼睛看得到的范围，不管你的相片有多大，你所能看到的就是相框范围内的大小，而 `viewBox` 则是这张照片的大小。如果相框（`viewport`）和照片（`viewBox`）一样大的时候，不会有什么问题。可是，当相框比照片小的时候或大的时候，麻烦就来了，即相片放置在相框中要花很多时间去思考，相片在相框中要如何放置才能有一个较好的效果。

也就是说，相框（`viewport`）除了能控制照片（`viewBox`）的大小之外，还能够控制照片（`viewport`）要如何在相框（`viewBox`）中摆放。

上面我们所说的相框（`viewport`）和照片（`viewBox`）都是发生在 `<svg>` 元素上的，它们分别对应着：

-   相框（`viewport`）由 `<svg>` 元素上的 `width` 和 `height` 属性来决定（也可以在 CSS 中定义它的大小）
-   照片（`viewBox`）由 `<svg>` 元素上的 `viewBox` 属性决定，它包含了 `<min-x>` 、`<min-y>` 、`<width>` 和 `<height>` 四个参数，即 `viewBox = "<min-x> <min-y> width height"` 。其中 `<min-x>` 和 `<min-y>` 用来控制照片要如何在相框中摆放，`<width>` 和 `<height>` 用来控制照片的大小

例如：

```SVG
<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image  width="600" height="800" xlink:href="https://picsum.photos/800/600?random=1" />
</svg>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/961722a75a614dbeb7cde68a5b432620~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1237&s=852559&e=jpg&b=555674)

在实际使用的时候，你可能会碰到三种情形：

-   相框（`viewport`）与照片（`viewBox`）相等
-   相框（`viewport`）比照片（`viewBox`）大
-   相框（`viewport`）比照片（`viewBox`）小

### 相框（viewport）与照片（viewBox）相等

默认情况下，`<svg>` 的 `viewport` （相框）和 `viewBox` （照片）是相等的。例如：

```SVG
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image  width="800" height="600" xlink:href="https://picsum.photos/id/64/800/600" />
</svg>
```

相片会很完整的融入到相框中：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f90b43ea68b4d9fa823d9da47ef82ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2093&s=1128583&e=jpg&b=565775)

> Demo 地址：<https://codepen.io/airen/full/ExGXPPN>

### 相框（viewport）比照片（viewBox）大

假设 `<svg>` 元素的 `viewBox` 属性的 `<width>` 和 `<height>` 参数值小于 `width` 和 `height` 属性值时，那么就会出现相框（`viewport`）比照片（`viewBox`）大的情形。

```SVG
<svg width="800" height="600" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image  width="800" height="600" xlink:href="https://picsum.photos/id/64/800/600" />
</svg>
```

上面的代码表示相框（`viewport`）的尺寸是 `800 x 600` ，而照片（`viewBox`）的尺寸则是 `400 x 300` 。照片设定的尺寸比相框小，它会在原本的照片上裁剪一小块区域（在这里是 `400 x 300`），然后再将裁剪出来的区域放大，并且填满相框（`viewport`）的大小，即 `800 x 600` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dfa79a965f04ff38bb7ff265f73c119~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3824&h=2382&s=2730798&e=jpg&b=555674)

> Demo 地址：<https://codepen.io/airen/full/oNJwxWV>

不难发现，照片先按照 `viewBox` 属性的 `<width>` 和 `<height>` 进行裁剪，相当于得到了一张新的照片，然后新照片会自动放大到填满整个相框。因此，最终看到的效果照片被裁剪且放大了。

也就是说，**当相框（** `viewport` **）的尺寸比照片（****`viewBox`****）的尺寸更大时，照片（****`viewBox`****）会自动尽可能去填满整个相框（****`viewport`****）**。

### 相框（viewport）比照片（viewBox）小

同样的，你可以通过设置 `<svg>` 元素的 `viewBox` 属性的 `<width>` 和 `<height>` 参数比它的 `width` 和 `height` 属性值大。这个时候就会出现相框（`viewport`）比照片（`viewBox`）小的情形。

```SVG
<svg width="800" height="600" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image  width="800" height="600" xlink:href="https://picsum.photos/id/64/800/600" />
</svg>
```

这个时候，它会先把这张照片的底图放大（这里是 `1200 x 900`），但是图案大小不变，然后再尽可能的将照片（`viewBox`）塞入相框（`viewport`）中（这里是 `800 x 600`）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70f1d133f3704b3e9bd7443e7b605828~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3824&h=2382&s=2241126&e=jpg&b=555674)

> Demo 地址：<https://codepen.io/airen/full/yLGXJYx>

### 调整照片（viewBox）的位置

前面展示的都是调整照片（`viewBox`）尺寸的，其实还可以调整照片的位置，即通过调整 `<svg>` 的 `viewBox` 属性的 `<min-x>` 和 `<min-y>` 来调整照片在相框（`viewport`）的位置。

例如，我们设置 `<svg>` 元素的 `viewBox` 的 `<min-x>` 参数的值为 `200` ，即 `viewBox = "200 0 800 600"` ，那么照片（`viewBox`）会向左移动 `200` 个单位：

```SVG
<svg width="800" height="600" viewBox="200 0 800 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image  width="800" height="600" xlink:href="https://picsum.photos/id/64/800/600" />
</svg>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ef8aa4172f644b8af2ee9a7d270360b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3028&h=1963&s=1715333&e=jpg&b=565775)

> Demo 地址：<https://codepen.io/airen/full/KKbqNvq>

最终看到的照片变小了，沿着 `x` 轴移出相框（`viewport`）的那 `200` 个单位被裁掉了。

同时还可以通过改变 `viewBox` 属性的 `<min-y>` 参数，使得照片同时在 `x` 轴和 `y` 轴移动照片：

```SVG
<svg width="800" height="600" viewBox="200 200 800 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image  width="800" height="600" xlink:href="https://picsum.photos/id/64/800/600" />
</svg>
```

最终照片沿着 `x` 轴向左，沿着 `y` 轴向上，同时移出相框 `200` 个单位，而且这 `200 x 200` 个单位的区域都会被裁掉：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b18adb6f7c2d4012844a841398b8c5cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3028&h=2153&s=1776090&e=jpg&b=565775)

> Demo 地址：<https://codepen.io/airen/full/vYvZrLP>

​​

```SVG
<svg width="800" height="600" viewBox="-200 -200 800 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <image  width="800" height="600" xlink:href="https://picsum.photos/id/64/800/600" />
</svg>
```

你会看到照片（`viewBox`）同时沿着 `x` 轴向右和 `y` 轴向下移出相框（`viewport`） `200` 个单位，照片被裁剪了：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b9c1e2aad1d4faeb8cc39d687b7e8e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3028&h=2153&s=1719553&e=jpg&b=555674)

> Demo 地址：<https://codepen.io/airen/full/GRPEGyg>

在 SVG 中，通过 `<svg>` 元素的 `viewBox` 属性中的四个参数值，其中 `<min-x>` 和 `<min-y>` 控制照片的位移，可以达到裁剪的效果；`<width>` 和 `<height>` 控制大小，可以达到缩放的效果。不过，`viewBox` 实际上影响的是 SVG 的坐标系统，因此呈现给你的视觉效果和你的直觉是相反的。例如，当 `<min-x>` 和 `<min-y>` 越大时，实际上看到的是照片往左上方移动，即左上方区域被裁剪，反之照片则往右下角移动，照片的右下角被裁剪；同样地，当你设定的 `<width>` 和 `<height>` 越大时，实际上看到的照片会缩小，反之则放大。

注意，SVG 的 `viewBox` 和坐标系统是一个复杂的知识体系，这方面的知识已经超出这节课的范畴，这里不再过多的阐述，不过你可以使用 [@Sara Soueidan 提供的一个 Demo](https://www.sarasoueidan.com/demos/interactive-svg-coordinate-system/index.html)，切身体验一下 `viewBox` 属性各参数是如何影响 SVG 坐标系统的，视觉上的所看到的效果是哪何变化的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70c8c9e16af143dd9684266f5b6885d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=600&s=5581775&e=gif&f=813&b=fefdfd)

> Demo 地址：<https://www.sarasoueidan.com/demos/interactive-svg-coordinate-system/index.html>

## 如何使用 object-view-box

CSS 的 `object-view-box` 属性的使用与 [CSS 的 clip-path](https://juejin.cn/book/7223230325122400288/section/7259668885224456252) 有点相似，但 `object-view-box` 属性只能用于[可替换元素](https://html.spec.whatwg.org/#replaced-elements)（Replaced Elements），比如 `<audio>` 、 `<canvas>` 、`<``embed>` 、`<``iframe>` 、`<``img>` 、 `<input>` （`type` 属性必须为 `image`）、`<``object>` 和 `<video>` 等。

`object-view-box` 属性可接受的值主要有：

```
object-view-box = none | <basic-shape-rect>
​
<basic-shape-rect> = <inset()> | <rect()> | <xywh()>
```

它的默认值是 `none` ，`object-view-box` 不会对元素做任何处理。其次，`object-view-box` 属性的值还可以是 `inset()` 、`rect()` 和 `xywh()` 函数，只不过，我们接下来的内容将主要围绕着 `inset()` 函数展开。

在介绍 `object-view-box` 属性如何使用之前，有几个前提条件得先了解。

首先，要是设置 `object-view-box` 的元素没有[自然宽度](https://www.w3.org/TR/css-images-3/#natural-width)（Natural Width）又没有[自然高度](https://www.w3.org/TR/css-images-3/#natural-height)（Natural Height），那么 `object-view-box` 取值为 `<basic-shape-rect>` 时（比如 `inset()` 函数），不会起任何作用，它的表现形式就类似于 `none` 。例如：

```HTML
<div class="container">
    <div class="box"></div>
</div>
```

```CSS
.container {
    width: 50vw;
    aspect-ratio: 21 / 9;
    outline: 2px solid #90face;
    
    .box {
        width: 100%;
        height: 100%;
        object-view-box: inset(25%);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/602ce0f2ccf64b1a86d4206a86104b3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=786&h=456&s=110912&e=gif&f=97&b=0aa0eb)

> Demo 地址：<https://codepen.io/airen/full/KKbqBXx>

正如你所看到的，上面示例中的 `.box` 元素没有自然宽度和自然高度。如果你将上面示例中的 `div.box` 换成 `img` ，效果则完全不同，`object-view-box` 属性会为 `img` 元素指定一个视图框，图片将根据运用的 `inset()` 值进行裁剪和放大：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7465cb0bcef4f4dbff9f6c4fa689207~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884&h=488&s=6291085&e=gif&f=131&b=514d6d)

> Demo 地址：<https://codepen.io/airen/full/NWegBzz>

注意，一般情况下，只有可替换元素才具有自然宽度和自然高度，例如示例中的 `img` 元素。

`object-view-box` 属性会根据元素（比如 `img` ）的自然尺寸，将 `<basic-shape-rect>` 解析为一个参考框，以获取元素的视图框（View Box）。比如，上面示例中的图片的自然宽高是 `1024px x 768px` ，`object-view-box` 基于该尺寸为元素 `img` 创建了一个 `1024px x 768px` 的视图框：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddaba4fa4cf1474f9c3136bab33a894a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2153&s=1207610&e=jpg&b=555674)

在此情况之下，元素会被视为具有与视图框宽度和高度相等的自然尺寸。如果元素具有自然的宽高比，那么现在它被视为具有与视图框相同的宽高比。对元素内容的尺寸或位置的进一步调整，比如 `object-position` 或 `object-fit` ，都会在视图框上执行。

当元素绘制时，其内容会被缩放或平移，以使元素内容相对于视图框的最终大小和位置保持与确定视图框时相同的位置和大小。

有了这个基础，要理解 `object-view-box` 属性的使用就容易得多。例如 `object-view-box` 属性的值为 `inset()` 函数，你可以使用它来控制四个边缘。它和 `clip-path` 属性的 `inset()` 函数非常相似，可以用来指定元素的 `top` 、`right` 、`bottom` 和 `left` 属性的值，按照顺序排列。它遵循与 `padding` 和 `margin` 属性相同的语法（TRBL规则），允许接受 `1 ~ 4` 个值：

-   一个值，将表示 `top` 、`right` 、`bottom` 和 `left` 的值相等
-   两个值，其中第一个值将用于 `top` 和 `bottom` ，第二个值将用于 `right` 和 `left`
-   三个值，其中第一个值将用于 `top` ，第二个值将用于 `right` 和 `left` ，第三个值将用于 `bottom`
-   四个值，其中第一个值将用于 `top` ，第二个值将用于 `right` ，第三个值将用于 `bottom` ，第四个值将用于 `left`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7da457d2e608455287532d66eb2bb730~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2288&h=2153&s=1882465&e=jpg&b=928791)

```CSS
.element {
    object-view-box: inset(180px); /* T = R = B = L = 180px */
}
​
.element {
    object-view-box: inset(180px  200px); /* T = B = 180px, R = L = 200px*/
}
​
.element {
    object-view-box: inset(180px 200px 100px); /* T = 180px, R = L = 200px, B = 100px*/
}
​
.element {
    object-view-box: inset(180px 200px 100px 50px); /* T = 180px, R = 200px, B = 100px, L = 50px*/
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b09541a0d37472286877e7915dda00a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=552&s=14679321&e=gif&f=353&b=fffefe)

> Demo 地址：<https://codepen.io/airen/full/abPwRKR>

注意，虽然 `object-view-box` 和 `clip-path` 的 `inset()` 函数使用方式相似，但它们最终结果是有本质上的区别的。其中 `clip-path` 只是将图片进行裁剪了，而 `object-view-box` 会先对图片进行裁剪，然后会再对图片进行缩放，并且缩放到与视图框大小相同：

```CSS
.object-view-box {
    object-view-box: inset(5% 10% 15% 20%);
}
​
.clip-path {
    clip-path: inset(5% 10% 15% 20%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/effc5580befa45dca12b71839a3202e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=708&s=11034401&e=gif&f=223&b=4f4c6c)

> Demo 地址：<https://codepen.io/airen/full/JjwJmez>

正如你所看到的，CSS 的 `object-view-box` 属性的 `inset()` 的值将基于原始图像的宽度和高度，从而产生一个裁剪后的图像。它将帮助我们绘制一个插入式矩形，并控制四个边缘，类似于处理边距（`margin`）或填充（`padding`）。

我们在使用可替换元素，比如 `img` ，可能裁剪出来的图像宽高比会与图像自然宽高比不一致。此时又将会发生什么呢？我们通过一个简单的示例来验证，它将会发生什么？例如，我们有三张图片：

-   第一张是 `800px x 600px` ，自然宽高比是 `4:3`
-   第二张是 `800px x 800px` ，自然宽高比是 `1:1`
-   第三张是 `600px x 800px` ，自然宽高比是 `3:4`

将这三张图片分别裁剪成 `4:3` 、`1:1` 和 `3:4` ，并且 `object-view-box` 设置统一的值为 `inset(25% 20% 15% 0%)` ：

```CSS
.figure-1 {
    width: 400px;
    aspect-ratio: 4 / 3;
    object-view-box: inset(25% 20% 15% 0%);
}
​
.figure-2 {
    width: 400px;
    aspect-ratio: 1 : 1;
    object-view-box: inset(25% 20% 15% 0%);
}
​
.figure-3 {
    width: 400px;
    aspect-ratio: 3 / 4；
    object-view-box: inset(25% 20% 15% 0%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/576f8eb245884ad7b2755c1d29471b2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=640&s=16718101&e=gif&f=113&b=dbc7a4)

> Demo 地址：<https://codepen.io/airen/full/yLGXQax>

不难发现，图片变形了。我们可以在运用 `object-view-box` 的元素上显式设置 `object-fit` 属性的值为 `cover` ，这样就可以避免图形变形：

```CSS
figure img {
    object-view-box: inset(25% 20% 15% 0%);
    object-fit: cover; /* 避免图片变形 */
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/874c9e23d0ff44408b7805ff2db1c012~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1252&h=636&s=9864466&e=gif&f=57&b=5d5475)

> Demo 地址：<https://codepen.io/airen/full/abPwQYb>

使用 `object-view-box` 除了可以对图片进行裁剪之外，还可以对图片进行缩放处理。例如：

```CSS
/* Zoomed In*/
.zoomed-in {
    object-view-box: inset(10%);
    object-fit: cover;
}
​
/* Zoomed Out */
.zoomed-out {
    object-view-box: inset(-10%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38671f1c184341a5ab6f3ff7dc790769~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=1044&s=92288&e=jpg&b=f4f1f1)

`inset()` 值为正值时，图片会放大，反之则缩小。你可以尝试在下面的 Demo 中拖动滑块，它将从视觉上向你呈现 `object-view-box` 是如何对图片进行缩放的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87e1fc9cb49445f89da3e0cb2f1ba476~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=810&h=662&s=10933536&e=gif&f=96&b=e6d1ad)

> Demo 地址：<https://codepen.io/airen/full/YzdQRdV>

## 小结

简单地说，`object-view-box` 属性允许你在不使用额外 HTML 元素或复杂的 CSS 的情况下，实现对可替换元素（例如 `img`）的裁剪和缩放。它的使用方式和 `clip-path` 属性极其相似，不同之处是，`clip-path` 不会对裁剪之后的图像进行缩放，而 `object-view-box` 会在指定的视图框（View Box）对图像进行缩放。

如果你使用 `object-view-box` 对可替换元素，比如 `img` 或 `video` 进行裁剪与缩放时，碰到了图形变形的情况之下，可以使用 `objec-fit: cover` 来避免它。

另外，`object-view-box` 属性对于需要在不同情况下以不同方式缩放和定位图像的应用程序非常有用，例如电子商务网站上的交互功能或响应式设计中的图像控制。

总之，`object-view-box` 属性提供了一种简单且本地的方法来控制元素的图像裁剪和缩放，使开发人员能够更轻松地实现视觉效果和交互功能。