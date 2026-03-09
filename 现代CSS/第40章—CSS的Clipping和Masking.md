CSS Clipping 和 Masking 是 CSS 的两个关键性特性，它们在现代 Web 中扮演着重要的角色，它们也是现代 Web 设计中的两个强大工具，它们赋予 Web 设计师和开发者创造性的自由，使得 Web 开发者能够实现各种惊人的视觉效果。

  


CSS Clipping 允许我们能够定义元素的可视区域，创造出非矩形形状和独特效果，改变了元素的外观和呈现方式，为 Web 设计师和开发者提供了更多创新的可能性。而 CSS Masking 允许 Web 开发者创建复杂的遮罩效果，将元素的可见部分限制为另一个形状，从而实现透明、融合和创意效果。这两种技术不仅可以用于图像处理，还可以用于构建独特的布局、文本效果和背景图案。无论你是新手还是经验丰富的开发者，了解和掌握 CSS Clipping 和 Masking 都将为你的 Web 应用或页面设计带来新的维度和惊喜。这节课将深入探讨 CSS Clipping 和 Masking 的工作原理、属性和实际应用，帮助你了解如何在 Web 开发中充分发挥它们的潜力，创造出引人注目的用户体验。

  


## CSS Clipping 和 Masking 简介

  


在现代 Web 设计和开发中 CSS Clipping 和 Masking 扮演着重要的角色。简单地说，CSS Clipping 和 Masking 都可以用来控制元素可视区域。简单地说，它们都可以用来对[元素进行裁剪](https://juejin.cn/book/7199571709102391328/section/7199845888997457959)，除此之外还可以用于创建复杂的图形和视觉效果，从而为 Web 设计和开发提供更多的创意自由度。

  


CSS Clipping 和 Masking 两大特性主要在 W3C 的 [CSS Masking Module Level 1](https://www.w3.org/TR/css-masking-1/)（CSS遮罩模块1级）定义的。其中：

  


-   CSS Clipping 是一种用于定义元素的可见区域的技术。它允许你创建非矩形形状，将元素剪裁成各种复杂的轮廓，从而改变元素的呈现方式。它常被称为**裁剪**或**剪切**
-   CSS Masking 是一种用于控制元素可见性的技术。它允许你创建图像遮罩，将一张图像应用于另一张图像或元素上，以实现复杂的透明和混合效果。它常被称为**遮罩**或**蒙板**

  


它们对应的 CSS 属性和值如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0bab922497d4662bffb813adf828670~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=849&s=219181&e=jpg&b=ffffff)

  


CSS Clipping 的主要属性是 `clip-path` ，它用于定义剪裁路径，可以是基本形状（如矩形 `inset()` 、圆形 `circle()` 、椭圆形 `ellipse()` ）、不规则形状（如多边形 `polygon()`）和自定义路径（如 `path()`）。它和设计软件中的裁剪功能非常相似，比如 Figma 的裁剪工具：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/041477ecb3814338896b2e18cc7ee1c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1715&h=999&s=1025681&e=jpg&b=f3f1f1)

  


只不过设计软件中的裁剪工具只能裁出矩形，类似于 `clip-path` 的 `inset()` 函数绘制的图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f8e6bb349204142a6e4b71d54414a84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1500&h=1207&s=560804&e=jpg&b=f2f1f1)

  


Web 开发者可以通过 CSS Clipping 创建非矩形布局、独特的边框效果，裁剪图像等。它为设计师提供了更多的创意自由度，可以改变元素的呈现方式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3fb02ca888a415f977445410b470a13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=964&s=646570&e=jpg&b=f6f3f2)

  


CSS Masking 的主要属性是 `mask` ，但它更像 CSS 的 `background` 属性，相应也有很多子属性，比如 `mask-image` 、`mask-position` 、`mask-repeat` 、`mask-size` 、`mask-clip` 等。除此之外它还具有 `background` 属性没有的一个功能，那就是蒙板合成，即 `mask-composite` 属性。它与=设计软件（比如 Figma）中遮罩功能是相似的：

  


![fig-05.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3b20e17dffe418b894b8c60a41b948d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2105&h=1927&s=1748380&e=jpg&b=f3f1f1)


  


CSS Masking 在图像处理、文本效果、图像融合、遮罩图标等方面非常有用。它可以用于创建具有艺术性的界面元素和特效。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5980c97a7a7b46368ff13c6cd317c297~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2213&h=1361&s=1554114&e=jpg&b=fcfafa)

  


这两种技术通常结合使用，可以帮助 Web 设计师和开发者创造出令人惊叹的用户界面和视觉效果。无论是用于图像处理、布局设计还是创造独特的用户体验，CSS Clipping 和 Masking 都提供了丰富的创意空间。它们在现代浏览器中得到广泛支持，为 Web 设计和开发提供了更多工具和可能性。

  


接下来，我们来深入探讨一下这两种技术。先从 CSS Clipping 开始。

  


## CSS Clipping

  


CSS Clipping 允许你使用 `clip-path` 创建一个剪切区域，在裁剪区域内可见，裁剪区域外则不可见。想象一下，你正拿着一支笔在 A4 画纸上绘制一个形状（比如，一个正方形）。很可能你会从一个点开始，然后向右画一条直线到达另一个点，然后重复这个过程三次，回到初始点。你还必须确保直线是平行的，长度相等。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/388e0b4df77142cbb5c4277740b839b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=478&s=214820&e=gif&f=289&b=f3f3f3)

  


因此，`clip-path` 可以指定绘制形状的基本要素，比如点、线、方向、角度和长度等等，以便对元素进行裁剪，使得元素按照指定的形状呈现。CSS 为 `clip-path` 属性提供了一些函数，可以直接用来绘制基本形状：

  


-   **`inset(`** `)` ：绘制一个矩形（当四条边相等时，绘制一个正方形）
-   **`circle()`** ：绘制一个圆形
-   **`ellipse()`** ：绘制一个椭圆形
-   **`polygon()`** ：绘制一个多边形
-   **`url()`** ：根据 `url()` 函数提供的裁剪源绘制图形
-   **`path()`** ：根据 SVG 路径（`path`）绘制图形

  


注意，`clip-path` 使得元素按照特定的区域显示内容，即被裁剪区域内（图形内）可视，被裁剪区域外（图形外）不可见（被隐藏）。例如，下面这个演示，展示了 `clip-path` 绘制一个圆形，只有圆形内的内容可见：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfc5cc9cb2084300a2f2d5714b3a8662~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2522&h=1576&s=1760066&e=gif&f=329&b=fdfcff)

  


### 坐标系统

  


在深入探讨 `clip-path` 属性之前，我们需要稍微了解基本的坐标系统。在将 `clip-path` 属性应用于元素以创建形状时，我们必须考虑 `x` 轴（向右为正方向）、`y` 轴（向下为正方向）和元素左上角的初始坐标 `(0,0)` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56b745fdd5ac4477bb74b3e42aad5b2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1044&s=113484&e=jpg&b=ffffff)

  


有了这个概念，我们就可以通过一个简单的示例来了解 `clip-path` 是如何对元素进行裁剪的。在这个示例中，被剪裁的区域是一个半径为 `100px` 的圆，并且圆心位于元素的左上角，即 `(0,0)` 位置（默认位置）：

  


```CSS
.element {
    clip-path: circle(100px at 0 0);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0bee0a75aed4b59b59835431b6b3447~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2682&h=1635&s=498834&e=jpg&b=fdf2f1)

  


正如你所看到的，只有四分之一圆（蓝色区域）可见，其他部分（淡黄色区域）是不可见的。

  


现在，我们将上面示例中的圆心位置调整到 `(100px 100px)` ：

  


```CSS
.element {
    clip-path: circle(100px at 100px 100px)；
}
```

  


现在，只有这个圆形区域可见，元素位于该圆之外的区域都不可见：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eeaf606066744dd39773d611a17a5586~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2682&h=1635&s=576224&e=jpg&b=fef5f4)

  


现在你已经了解了坐标系统的工作原理，我将简单解释 `clip-path` 属性常用值的使用。

  


### clip-path 绘制矩形：inset()

  


`clip-path` 属性的 `inset()` 函数用于绘制矩形，它定义了一个矩形形状，可以通过指定矩形的边缘来裁剪元素的区域。`inset()` 函数接受 `1 ~ 4` 个参数值，用来指定矩形的内边距（或称边缘间距），它与 `padding` 和 `margin` 属性类似，取值遵循 TRBL 原则。

  


```CSS
/* inset() 取一个值，表示 Top = Right = Bottom = Left = 50px */
.element {
    clip-path: inset(50px);
}

/* inset() 取两个值，表示 Top = Bottom = val1, Right = Left = val2 */
.element {
    clip-path: inset(50px 80px);
}

/* inset() 取三个值，表示 Top = val1, Right = Left = val2 ，Bottom = val3 */
.element {
    clip-path: inset(50px 80px 100px);
}

/* inset() 取四个值，表示 Top = val1, Right = val2, Bottom = val3, Left = val4 */
.element {
    clip-path: inset(50px 80px 100px 120px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b49848e7b6d4116ab546dc74e3acc1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2408&h=2721&s=1350907&e=jpg&b=ffffff)

  


使用 `inset()` 函数可以轻松地创建各种矩形形状，通过调整边距值，你可以自定义矩形的大小和位置。这对于创建特定的视觉效果或布局元素非常有用。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33b6d781036e46d0947229c02b785397~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=570&s=496041&e=gif&f=135&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/vYvyRPM

  


注意， `inset()` 函数使用多个参数时，需要用空格将它们进行分隔。

  


`inset()` 函数除了使用 `<length-percentage>` 值指定矩形的内边距之外，还可以显式使用 `round` 关键词来绘制带有圆角的矩形：

  


```CSS
.element {
    clip-path: inset(20px round 10px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cca8a8d54094de099f674a31c2cdc9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2408&h=1261&s=579844&e=jpg&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/NWedPRR

  


正如你所看到的，`inset()` 函数中的 `round <border-radius>` 有点类似于 CSS 的 `border-radius` 属性，可以为矩形每个角指定不同的半径：

  


```CSS
.element {
    clip-path: inset(20px round 10px); /* 四个角的圆角半径都是 10px */
}

.element {
    clip-path: inset(20px 50px round 10px 5px); /* 左上角=右下角=10px, 右上角=左下角=5px */
}

.element {
    clip-path: inset(20px 50px 80px round 10px 5px 20px); /* 左上角 = 10px, 右上角 = 左下角= 5px, 右下角 = 20px*/
}

.element {
    clip-path: inset(20px 50px 80px 100px round 10px 5px 20px 30px); /* 左上角 = 10px, 右上角 = 5px，右下角 = 20px, 左下角 = 30px */
}
```

  


也可以为圆角的 `x` 轴和 `y` 轴指定不同的半径：

  


```CSS
.element {
    clip-path: inset(30px round 10px / 20px);
}
```

  


注意，只有显式指定关键词 `round` 才会有圆角效果，[圆角大小的使用请参阅 border-radius 的使用](https://juejin.cn/book/7199571709102391328/section/7199845563389444099)。

  


### clip-path 绘制圆形：circle()

  


你可以使用 `clip-path` 属性的 `circle()` 函数绘制一个圆形。例如：

  


```CSS
.element {
    clip-path: circle(100px); /* r=100px, 圆心坐标是 (0,0) */
}

.element {
    clip-path: circle(100px at 100px 100px); /* r=100px, 圆心坐标是 (100px, 100px) */
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82f877a7580a466da1fcae4cc558d5a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2682&h=2978&s=1043898&e=jpg&b=fdf2f1)

  


你可以调整 `circle()` 的半径和圆心位置，来更改圆的大小和位置：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c16d981ea2cc4d0fb2cc26daf613f66c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=926&h=594&s=925733&e=gif&f=224&b=455583)

  


> Demo 地址：https://codepen.io/airen/full/eYbgmPL

  


注意，`circle()` 函数中 `at` 关键词后面紧跟的 `<position>` 参数使用方式与 `background-position` 相似，另外 `circle()` 函数的半径 `r` 的值也可以是百分比值。如果半径是百分比值，它是从参考框的使用宽度和高度解析出来的，公式为：

  


```
r = sqrt(width((2))+height((2)))/sqrt(2)
```

  


### clip-path 绘制椭圆：ellipse()

  


使用 `ellipse()` 函数，我们可以分别设置 `x` 轴的半径 `rx` 和 `y` 轴的半径 `ry` 来绘制一个椭圆。例如：

  


```CSS
.element {
    clip-path: ellipse(100px 50px); /* x 轴半径 rx = 100px, y 轴半径 ry = 50px */
}
```

  


也可以像 `circle()` 函数一样，使用 `at` 关键词显式指定圆心位置：

  


```CSS
.element {
    clip-path: ellipse(100px 50px at 100px 100px); /* x 轴半径 rx = 100px, y 轴半径 ry = 50px, 圆心坐标位置是 (100px, 100px) */
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8da1a4f46b04fd9aef893cbb5cb1f22~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2682&h=2978&s=1120646&e=jpg&b=fdf1f0)

  


> Demo 地址：https://codepen.io/airen/full/vYvgNzQ

  


注意，`ellipse()` 函数的的半径 `rx` 和 `ry` 也可以取百分比值。它是相对于参考框的使用宽度（用于`rx`值）和使用高度（用于`ry`值）进行解析的。

  


`clip-path` 使用 `circle()` 和 `ellipse()` 函数绘制圆或椭圆形时，其半径还可以使用 **`closest-side`** 和 **`farthest-side`** 关键词。

  


-   **`closest-side`** 会使用从形状中心到参考框最近边缘的长度。对于圆形，这是在任何维度上最近的边缘。对于椭圆，这是在半径维度上最近的边缘。
-   **`farthest-side`** 会使用从形状中心到参考框最远边缘的长度。对于圆形，这是在任何维度上最远的边缘。对于椭圆，这是在半径维度上最远的边缘。

  


拿 `circle()` 为例：

  


```CSS
.element {
    width: 400px;
    aspect-ratio: 1;
    
    /* 以元素框中心到最近边缘的距离为半径绘制圆 */
    &.closest-side {
        clip-path: circle(closest-side); 
    }
    
    /* 以元素框中心到最远边缘的距离为半径绘制圆 */
    &.closest-side {
        clip-path: circle(farthest-side); 
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d89fea90ac8f4c599f4d21d42bda8376~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2600&h=2978&s=942796&e=jpg&b=4498eb)

  


> Demo 地址：https://codepen.io/airen/full/abPpdRX

  


正如你所看到的，此时圆心的位置是 `center` ，即元素的正中心。

  


另外，如果你在 `circle()` 和 `ellipse()` 函数中未传入任何数，那么它们将以 **`closest-side`** 关键词为半径来绘制圆和椭圆。

  


### clip-path 绘制多边形：polygon()

  


`clip-path` 属性可以使用 `polygon()` 绘制多边形，比如三角形，四边形，五边形，甚至是不规则的多边形等。你只需要给 `polygon()` 传入多个坐标值，并且使用逗号（`,`）将每对坐标值进行分隔。例如：

  


```CSS
.element {
    clip-path: polygon(50% 0%, 61.8% 38.2%, 50% 61.8%, 38.2% 38.2%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/379a153ce26842acb872622307bb1aa5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2600&h=2227&s=720618&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/yLGgOVQ

  


在此示例中，我们定义了五个顶点的坐标，从而创建了一个五边形。你可以根据需要更改这些坐标，以创建不同形状的多边形。你也可以使用浏览器的调试工具来调整每个坐标的位置，比如 Firefox 的调试工具：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cba039e4867d47cd81481b67ec1672bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=544&s=2530110&e=gif&f=384&b=fefefe)

  


你也可以在 Chrome 浏览器调试工具中使用“Shape”工具来调整 `polygon()` 函数的坐标值：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/def9e73a040c475aa048505edea025d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=544&s=15500950&e=gif&f=463&b=fbfafa)

  


你还可以使用[在线工具 clippy 来绘制不同的形状](https://bennettfeely.com/clippy/)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba57f7683d4648318b008e724fd7d6f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2144&h=1456&s=1181692&e=jpg&b=f2f0ef)

  


> Clippy: https://bennettfeely.com/clippy/

  


`polygon()` 函数还接受一个可选的关键字，即 **`nonzero`** 或 **`evenodd`** 。用于确定给定点是否位于图形元素创建的剪切区域内形状的算法。

  


**`nonzero`** 值采用的算法是：从需要判定的点向任意方向发射线，然后计算图形与线段交点处的走向；计算结果从 `0` 开始，每有一个交点处的线段是从左到右的，就加 `1` ；每有一个交点处的线段是从右到左的，就减 `1` ；这样计算完所有交点后，如果这个计算的结果不等于 `0` ，则该点在图形内，需要填充；如果该值等于 `0` ，则在图形外，不需要填充。比如下图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d2315a12b0e4e68badb6463c3534db5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209&h=449&s=26301&e=jpg&b=555674)

  


来看一个示例：

  


```SVG
<svg width="250px" height="250px" viewBox="0 0 250 250"> 
    <polygon fill="#F9F38C" fill-rule = "nonzero" stroke="#E5D50C" stroke-width="5" stroke-linejoin="round" points="47.773,241.534 123.868,8.466 200.427,241.534 7.784,98.208 242.216,98.208 " /> 
</svg> 

<svg width="250px" height="250px" viewBox="0 0 250 250"> 
    <path fill="#F4CF84" fill-rule = "nonzero" stroke="#D07735" stroke-width="5" d="M124.999,202.856 c-42.93,0-77.855-34.928-77.855-77.858s34.925-77.855,77.855-77.855s77.858,34.925,77.858,77.855S167.929,202.856,124.999,202.856z M125.003,245.385c-7.61,0-13.025-6.921-17.802-13.03c-2.79-3.559-6.259-8.002-8.654-8.638c-0.318-0.085-0.71-0.134-1.159-0.134 c-2.873,0-7.1,1.698-11.188,3.335c-4.929,1.973-10.029,4.021-14.774,4.021c-2.486,0-4.718-0.563-6.633-1.677 c-6.451-3.733-7.618-11.959-8.742-19.919c-0.646-4.571-1.45-10.261-3.292-12.096c-1.84-1.845-7.524-2.646-12.093-3.298 c-7.96-1.119-16.192-2.286-19.927-8.739c-3.682-6.358-0.614-14.005,2.35-21.404c1.829-4.563,3.904-9.735,3.201-12.352 c-0.638-2.392-5.073-5.861-8.64-8.648C11.539,138.025,4.618,132.612,4.618,125c0-7.61,6.921-13.025,13.027-17.802 c3.567-2.79,8.002-6.259,8.64-8.651c0.702-2.614-1.375-7.789-3.201-12.349c-2.961-7.399-6.029-15.046-2.347-21.409 c3.733-6.451,11.962-7.618,19.924-8.742c4.569-0.646,10.253-1.45,12.096-3.292c1.84-1.84,2.646-7.524,3.29-12.093 c1.127-7.96,2.291-16.192,8.745-19.924c1.914-1.111,4.147-1.674,6.633-1.674c4.745,0,9.845,2.045,14.771,4.021 c4.085,1.639,8.312,3.335,11.188,3.335c0.446,0,0.836-0.045,1.161-0.131c2.392-0.641,5.861-5.079,8.654-8.643 c4.782-6.109,10.194-13.03,17.804-13.03c7.612,0,13.025,6.921,17.804,13.027c2.782,3.565,6.259,8.002,8.654,8.643 c0.323,0.085,0.71,0.131,1.161,0.131c2.876,0,7.094-1.696,11.185-3.332c4.932-1.976,10.029-4.021,14.779-4.021 c2.478,0,4.715,0.563,6.627,1.671c6.448,3.733,7.618,11.962,8.739,19.927c0.646,4.569,1.453,10.253,3.292,12.093 c1.84,1.84,7.524,2.646,12.096,3.292c7.96,1.127,16.189,2.291,19.919,8.745c3.687,6.36,0.619,14.007-2.344,21.404 c-1.824,4.563-3.898,9.735-3.201,12.347c0.641,2.395,5.079,5.864,8.643,8.657c6.104,4.774,13.025,10.189,13.025,17.799 c0,7.612-6.921,13.025-13.03,17.804c-3.559,2.788-8.002,6.264-8.638,8.654c-0.702,2.614,1.375,7.783,3.201,12.347 c2.964,7.399,6.032,15.046,2.344,21.409c-3.733,6.448-11.959,7.618-19.924,8.739c-4.566,0.646-10.256,1.453-12.09,3.292 c-1.845,1.84-2.646,7.524-3.298,12.096c-1.119,7.96-2.291,16.189-8.745,19.919c-1.909,1.113-4.147,1.677-6.627,1.677 c-4.745,0-9.839-2.048-14.768-4.021c-4.091-1.637-8.315-3.335-11.19-3.335c-0.446,0-0.836,0.048-1.161,0.134 c-2.392,0.635-5.861,5.073-8.648,8.638C138.027,238.464,132.615,245.385,125.003,245.385z" /> 
</svg> 
```

  


效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fb7563b7de440719fcc388395e8125b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209&h=449&s=19886&e=jpg&b=ffffff)

  


星星是由一条相交的路径组成的，太阳则是由一条长复合的路径组成。每个形状的内部最初并不清楚，可以根据作者的意图而有所不同。在这些情况下，`fill-rule` 允许进一步澄清。

  


在下一个例子中，我们可以看得更清楚些，当 `nonzero` 算法被应用到类似的图形时，究竟发生了什么？

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8e0a14c25a4489891e33ac3ef6c8d28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209&h=620&s=36279&e=jpg&b=fffefe)

  


从上图中我们可以理解成，当方向是顺时针时，加 `1` ，逆时针时减 `1`。相交的值不等于 `0` 则填充，如果等于 `0` 则不填充。

  


**`evenodd`** 值采用的算法是，从需要判定的点向任意方向发射线，然后计算图形与线段交点的个数，个数为奇数则该点在图形内，则需要填充；个数为偶数，则该点在图形外，不需要填充。如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d01b4af605ed410d93d22ae6fddcdef3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209&h=421&s=25107&e=jpg&b=555674)

  


上面的示例稍作调整：

  


```SVG
<svg width="250px" height="250px" viewBox="0 0 250 250"> 
    <polygon fill="#F9F38C" fill-rule = "evenodd" stroke="#E5D50C" stroke-width="5" stroke-linejoin="round" points="47.773,241.534 123.868,8.466 200.427,241.534 7.784,98.208 242.216,98.208 " /> 
</svg> 

<svg width="250px" height="250px" viewBox="0 0 250 250"> 
    <path fill="#F4CF84" fill-rule = "evenodd" stroke="#D07735" stroke-width="5" d="M124.999,202.856 c-42.93,0-77.855-34.928-77.855-77.858s34.925-77.855,77.855-77.855s77.858,34.925,77.858,77.855S167.929,202.856,124.999,202.856z M125.003,245.385c-7.61,0-13.025-6.921-17.802-13.03c-2.79-3.559-6.259-8.002-8.654-8.638c-0.318-0.085-0.71-0.134-1.159-0.134 c-2.873,0-7.1,1.698-11.188,3.335c-4.929,1.973-10.029,4.021-14.774,4.021c-2.486,0-4.718-0.563-6.633-1.677 c-6.451-3.733-7.618-11.959-8.742-19.919c-0.646-4.571-1.45-10.261-3.292-12.096c-1.84-1.845-7.524-2.646-12.093-3.298 c-7.96-1.119-16.192-2.286-19.927-8.739c-3.682-6.358-0.614-14.005,2.35-21.404c1.829-4.563,3.904-9.735,3.201-12.352 c-0.638-2.392-5.073-5.861-8.64-8.648C11.539,138.025,4.618,132.612,4.618,125c0-7.61,6.921-13.025,13.027-17.802 c3.567-2.79,8.002-6.259,8.64-8.651c0.702-2.614-1.375-7.789-3.201-12.349c-2.961-7.399-6.029-15.046-2.347-21.409 c3.733-6.451,11.962-7.618,19.924-8.742c4.569-0.646,10.253-1.45,12.096-3.292c1.84-1.84,2.646-7.524,3.29-12.093 c1.127-7.96,2.291-16.192,8.745-19.924c1.914-1.111,4.147-1.674,6.633-1.674c4.745,0,9.845,2.045,14.771,4.021 c4.085,1.639,8.312,3.335,11.188,3.335c0.446,0,0.836-0.045,1.161-0.131c2.392-0.641,5.861-5.079,8.654-8.643 c4.782-6.109,10.194-13.03,17.804-13.03c7.612,0,13.025,6.921,17.804,13.027c2.782,3.565,6.259,8.002,8.654,8.643 c0.323,0.085,0.71,0.131,1.161,0.131c2.876,0,7.094-1.696,11.185-3.332c4.932-1.976,10.029-4.021,14.779-4.021 c2.478,0,4.715,0.563,6.627,1.671c6.448,3.733,7.618,11.962,8.739,19.927c0.646,4.569,1.453,10.253,3.292,12.093 c1.84,1.84,7.524,2.646,12.096,3.292c7.96,1.127,16.189,2.291,19.919,8.745c3.687,6.36,0.619,14.007-2.344,21.404 c-1.824,4.563-3.898,9.735-3.201,12.347c0.641,2.395,5.079,5.864,8.643,8.657c6.104,4.774,13.025,10.189,13.025,17.799 c0,7.612-6.921,13.025-13.03,17.804c-3.559,2.788-8.002,6.264-8.638,8.654c-0.702,2.614,1.375,7.783,3.201,12.347 c2.964,7.399,6.032,15.046,2.344,21.409c-3.733,6.448-11.959,7.618-19.924,8.739c-4.566,0.646-10.256,1.453-12.09,3.292 c-1.845,1.84-2.646,7.524-3.298,12.096c-1.119,7.96-2.291,16.189-8.745,19.919c-1.909,1.113-4.147,1.677-6.627,1.677 c-4.745,0-9.839-2.048-14.768-4.021c-4.091-1.637-8.315-3.335-11.19-3.335c-0.446,0-0.836,0.048-1.161,0.134 c-2.392,0.635-5.861,5.073-8.648,8.638C138.027,238.464,132.615,245.385,125.003,245.385z" /> 
</svg>
```

  


运用 `fill-rule="evenodd"` 的星星和太阳的效果就和刚才的不一样了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8483dadac464d1e9d4bbcc9a251ce70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209&h=449&s=39580&e=jpg&b=fefdfd)

  


同样用一张图来描述，可能更易于理解：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4a4538325440e0bf9017fd3e39234d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209&h=620&s=37240&e=jpg&b=ffffff)

  


`evenodd` 规则是特定的算法，与 `nonzero` 情况不同，其算法和内部形状绘制的方向不相关，因为只是简单地计算它们穿过直线的路径数是不是奇偶数。

  


注意，如果 `polygon()` 函数中未显式指定 `<'fill-rule'>` 的值，默认会取 `nonzero` 值。

  


### clip-path 引用 SVG 路径绘制图形：url()

  


`clip-path` 的 `polygon()` 函数可以绘制不同的多边形，可它有一个致命的弱点，那就是不能绘制线条平滑的图形。庆幸的是，`clip-path` 可以通过 `url()` 函数来引用 SVG 的 `path` 作为裁剪路径，对元素进行裁剪。

  


如此一来，你需要先使用 SVG 定义一个路径，例如：

  


```SVG
<svg width="0" height="0" style="position:absolute;">
    <clipPath id="custom-clip">
        <path d="M50,0 C77.614,0 100,22.386 100,50 C100,77.614 77.614,100 50,100 C22.386,100 0,77.614 0,50 C0,22.386 22.386,0 50,0 Z" />
    </clipPath>
</svg>
```

  


然后，在 CSS 中，将 `custom-clip` 作为 `url()` 的参数来定义 `clip-path`：

  


```CSS
.element {
    clip-path: url(#custom-clip);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91a24ca07a5c4d4b845d87109254cc98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=2227&s=948615&e=jpg&b=52638c)

  


> Demo 地址：https://codepen.io/airen/full/LYMxZze

  


你只需要改变 SVG 绘制的路径，就可以得到不一样的形状：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67f5497583ba4b1e9d89cf92a3e50877~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=523105&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/bGOgeQG

  


尝试着将上面示例中的图片改成视频，你将看到的视频将会像下面这样呈现给用户：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a057310c43e41728c402ab591d03f0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=508&s=8592814&e=gif&f=91&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/MWZJexJ

  


这里有一个关键点，那就是 SVG 路径如何获取，这对于不懂 SVG 或从未接触过 SVG 的同学是个难事。我这里告诉大家一个小技巧。那就是我们可以使用设计软件，例如 Figma，在设计软件上绘制好矢量图，然后获取相应的 SVG 代码。下面这个演示，展示了如何从 Figma 中获取 SVG 的路径：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f90227fa8e845c1a717ff9ad7f573dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1166&h=608&s=3547435&e=gif&f=446&b=f7f7f7)

  


就这么简单的获得了相应的 SVG 代码：

  


```SVG
<svg width="681" height="681" viewBox="0 0 681 681" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M636.148 509.531C664.688 459.725 681 402.018 681 340.5C681 152.447 528.555 0 340.5 0C152.445 0 0 152.447 0 340.5C0 528.553 152.445 681 340.5 681C391.316 681 439.531 669.869 482.84 649.912C464.387 631.143 453 605.4 453 577C453 519.562 499.562 473 557 473C588.691 473 617.074 487.174 636.148 509.531Z" fill="#120E0E"/>
</svg>
```

  


你会发现，获取的 SVG 代码，`<path>` 并没有放在 `<clipPath>` 中。只不过，中间还需要将 SVG 路径点的值转换为相对单位。这是因为，SVG 路径点的值默认是绝对的。这意味着，如果宽度和高度发生变化，它们就会拉伸。为了提前解决这个问题，我们可以使用[这个强大的工具（Convert SVG absolute clip-path to relative）](https://yoksel.github.io/relative-clip-path/)。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd40bb47f33446298bdca07037b9887a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=852&s=117075&e=jpg&b=fbfbfb)

  


> Convert SVG absolute clip-path to relative：https://yoksel.github.io/relative-clip-path/

  


然后，将该路径作为 `<clipPath>` 节点加入到页面里的内联 SVG 中。

  


```SVG
<svg class="svg">
    <clipPath id="my-clip-path" clipPathUnits="objectBoundingBox">
        <path d="M0.934,0.748 C0.976,0.675,1,0.59,1,0.5 C1,0.224,0.776,0,0.5,0 C0.224,0,0,0.224,0,0.5 C0,0.776,0.224,1,0.5,1 C0.575,1,0.645,0.984,0.709,0.954 C0.682,0.927,0.665,0.889,0.665,0.847 C0.665,0.763,0.734,0.695,0.818,0.695 C0.864,0.695,0.906,0.715,0.934,0.748"></path>
    </clipPath>
</svg>
```

  


`clipPathUnits` 属性的值 `objectBoundingBox` 意味着路径内的值**是相对于** **`clip-path`** **所应用元素****的****边界框的**。

  


要是我们把它运用到用户头像上，你将获取一个像下图这样的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aebe1293e4d74f46911d46cd2b2f632b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=413818&e=jpg&b=555674)

  


```HTML
<figure class="avatar">
    <img src="https://picsum.photos/800/800?random=52" alt="" >
</figure>

<svg class="svg" style="position: absolute" width="0" height="0">
    <clipPath id="avatar-clip" clipPathUnits="objectBoundingBox">
        <path d="M0.934,0.748 C0.976,0.675,1,0.59,1,0.5 C1,0.224,0.776,0,0.5,0 C0.224,0,0,0.224,0,0.5 C0,0.776,0.224,1,0.5,1 C0.575,1,0.645,0.984,0.709,0.954 C0.682,0.927,0.665,0.889,0.665,0.847 C0.665,0.763,0.734,0.695,0.818,0.695 C0.864,0.695,0.906,0.715,0.934,0.748"></path>
    </clipPath>
</svg>
```

  


```CSS
figure {
    clip-path: url('#avatar-clip');
}
```

  


### clip-path 引用 SVG 路径绘制图形：path()

  


如果你觉得 `clip-path` 属性的 `url()` 函数引用 SVG 路径裁剪元素要在 HTML 添加 SVG 代码而感到麻烦，那么可以使用 `path()` 函数，它同样可以将 SVG 的路径来裁剪元素，而且不需要在 HTML 中添加额外的 SVG 代码。例如：

  


```CSS
.element {
    clip-path: path('M256 203C150 309 150 309 44 203 15 174 15 126 44 97 73 68 121 68 150 97 179 68 227 68 256 97 285 126 285 174 256 203');
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83c4fd0e12e84779b029e6e662298e71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1841&s=759084&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/rNojvXq

  


`path()` 中的值将会涉及到 SVG 绘制 `path` 的一些命令，比如你在代码中看到的 `M` 、`L` 和 `Z` 等等。这些知识已超出这节课的范畴，如果你对此感兴趣的话，推荐你阅读下面这几篇文章：

  


-   [The SVG path Syntax: An Illustrated Guide](https://css-tricks.com/svg-path-syntax-illustrated-guide/)
-   [SVG Path Visualizer](https://svg-path-visualizer.netlify.app/)
-   [A Practical Guide To SVG And Design Tools](https://www.smashingmagazine.com/2019/05/svg-design-tools-practical-guide/)
-   [Understanding SVG Paths](https://www.nan.fyi/svg-paths)

  


或者使用 [svgpathtools 命令工具获取 path](https://pypi.org/project/svgpathtools/) ，还可以通过下面这个 [SvgPathEditor 工具](https://yqnn.github.io/svg-path-editor/)获取 `path` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b0344810c4840f5b4ef9dbc9a406742~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2494&h=1994&s=672026&e=png&a=1&b=262626)

  


> SvgPathEditor: https://yqnn.github.io/svg-path-editor/

  


## CSS Masking

  


Masking（遮罩）是设计中常见的一种技术，同样的，在 CSS 中也是一种不可缺少的特性。Masking 和 Clipping 类似，都可以用来裁剪元素，只不过 CSS Masking 是用来隐藏元素的一部分，而不是将其擦除。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d40890c73764b80937e07ad30f397e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=696&s=75539&e=jpg&b=f6f5f5)

  


-   剪切需要一个剪切路径，剪切路径可以是一个闭合矢量路径、形状或多边形；剪切路径是一个区域，该区域内部的所有内容都可以显示出来，外部的所有内容将被剪切掉，在页面上不可见；
-   遮罩需要一个高亮或 Alpha 遮罩层，将源和遮罩层合在一起会创建一个缓冲区域，在合层阶段之前，亮度和 Alpha 遮罩会影响这个缓冲区的透明度，从而实现完全或部分遮罩源的部分

  


简单地说，CSS Clipping 主要用于路径，而 CSS Masking 用于图像或渐变。

  


根据遮罩层的不同，CSS 遮罩分为**高亮**和 **Alpha** 两种模式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db5a37b28ef241cd9592d6f7374c9b37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=796&s=83849&e=jpg&b=f4f4f4)

  


-   Alpha 模式带有 Alpha 通道的图像（遮罩图层），Alpha 通道包含在每个像素数据中的透明信息。上图左侧就是带有黑色和透明区域的 PNG 图像，其中黑色部分将会显示，透明区域内容将会被隐藏；
-   高亮模式使用图像的亮度值作为遮罩值，上图右侧的遮罩层白色区域将会显示出来，透明区域将会被隐藏。

  


来看一个简单的示例：

  


```CSS
.mask {
    mask-repeat: no-repeat;
    mask-size: cover;
    mask-position: center;
}

.mask--alpha {
    mask-image: url("alpha-mask.png");
}

.mask--luminance {
    mask-image: url("luminance-mask.png");
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a111e0cfdfcb41fca6dee00fa0a44c69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=796&s=102778&e=jpg&b=565874)

  


> Demo 地址：https://codepen.io/airen/full/ExGZRJV

  


在 CSS 中，我们有一个 `mask` 的简写属性，它使用方式和语法规则与 `background` 属性基本相同，只是增加了一些额外的属性。接下来，我们来看一看，在 CSS 中是如何使用 `mask` ？

  


### 遮罩图片：mask-image

  


首先，你需要创建一个遮罩图，这个遮罩图的格式没有较大的限制，它可以是 PNG、SVG 或 JPEG 格式的图片。这个图像将确定哪些部分将被显示，哪些部分将被隐藏。我们可以使用图形设计软件（例如 Figma）来创建遮罩图。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/196a10890b9447fa91ae9032f5adf94d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=282635&e=jpg&b=ffffff)

  


可以使用 `mask-image` 将遮罩图用于元素上：

  


```CSS
.element {
    mask-image: url("mask-image.png");
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64115bdcc9ac4c53851c2397e9c2c01f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=910&h=556&s=3398195&e=gif&f=240&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/wvRgxMQ

  


和你预期的效果有所差距吧。这和我们使用背景图片是一样的，默认情况下，遮罩图片会沿着 `x` 轴和 `y` 轴重复平铺：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2810361ddebd490abb2278386a2daca9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2204&h=1930&s=1250279&e=jpg&b=555775)

  


我们可以通过 `mask-repeat` 或 `mask-size` 来避免这种现象。这个稍后再介绍。

  


注意，上面示例中的遮罩图是一个带 Alpha 遮罩模式，即采用具有 Alpha 通道的图像，其中 Alpha 值用来遮罩的值。遮罩图像黑色部分将会显示（Alpha 通道的值是 `1`），透明区域内容将会隐藏（Alpha 通道的值是 `0`）。

  


遮罩图除了可以是 Alpha 模式之外，还可以是高亮模式（Luminance）。比如将上面遮罩图中黑色替换成白色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e49695019d3a4053aa0447b9dfbe299f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=263367&e=jpg&b=b5b5b5)

  


如果使用上图作为遮罩图，那么白色区域（高亮）可见，透明区域不可见。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebecbf4149514d0e807d3bda8af73e02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=968&h=622&s=2879497&e=gif&f=149&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/dywNgyy

  


仅从效果上来看，两者得到的效果是一样的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/641e33193b874b7e8af2b21b22fecc51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2204&h=1930&s=1252812&e=jpg&b=555775)

  


但它们在算法上有较大的差异。当使用亮度遮罩模式时，会先计算颜色通道的亮度，然后计算出的亮度值乘以相应的 Alpha 值，从颜色通道值中计算出给定的遮罩模式的值。 亮度遮罩模式可以包含任何颜色，而不仅仅是白色。亮度值然后由遮罩的 RGB 值和亮度系数，比如：`luma = (0.2126 * R + 0.7152 * G + 0.0722 * B)`。确定对象的透明度，然后乘以 Alpha 通道对象的亮度值和遮罩的 Alpha 通道值。

  


比如，我们把上面示例中的纯白色改成带有一定透明度的其他颜色（` rgb(15 158 200  ``/ 60%``)`）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5662d8f206c844f19501be6244560204~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=320764&e=jpg&b=b5b5b5)

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2228ed93fd0479fb08d21c16c006717~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=852&h=570&s=3966942&e=gif&f=167&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/qBLRJaB

  


在 CSS 中，我们可以通过 `mask-mode` （遮罩模式）属性来控制遮罩的模式，它有三个值：

  


-   `luminance`：使用遮罩元素的亮度来控制元素的可见性
-   `alpha`：使用遮罩元素的透明度来控制元素的可见性，`alpha` 越趋向于 `1` 时，越可见；反之越不可见
-   `match-source`：默认值，使用遮罩元素的 Alpha 通道和源元素的 Alpha 通道来决定可见性

  


比如，我们的遮罩图片既有 Alpha 模式又有高亮模式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe856217aed54e19be87c0b1fc17375a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=417170&e=jpg&b=555675)

  


你会发现，当 `mask-mode` 的值为 `match-source` 和 `alpha` 时，黑白两半组合的图像都将可见，但当 `mask-mode` 的值为 `luminance` 时，只有遮罩图白色区域可见（高亮部分）：

  


```CSS
.element {
    mask-image: url("mask-image.png");
    mask-mode: luminance;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/154776ccc34b419093ca0e5bb8d83140~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=838&h=662&s=2648442&e=gif&f=169&b=4d4a6a)

  


> Demo 地址：https://codepen.io/airen/full/QWzdZpr （请使用 Safari 或 Firefox 查看 Demo ）

  


请注意，`mask-mode` 是一项高级 CSS 技术，涉及复杂的图形处理。你需要熟悉 CSS 和图形设计基础，以有效地使用它来创建所需的效果。

  


正因如此，我们的遮罩图还可以是一个带渐变的图像：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35953a76ff834383bd5d21ac755646d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=330057&e=jpg&b=b5b5b5)

  


将该遮罩图用于 `mask-image` 属性上，得到的效果如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bb48fdc7f1843dca623f3b419e0c40c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=592&s=5505128&e=gif&f=222&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/LYMxXpW

  


上面所展示的图片都是 PNG 格式的图片，包括渐变效果的图片也是如此。有一个细节需要注意的是，`mask-image` 通过 `url()` 引入的遮罩层图片必须是同域的（要解决 [图片 CROS 兼容性](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)），否则 `mask-image` 会被视为是 `none` 。因此，我们示例中的图片采用的都是 Base 64。

  


另外，CSS 渐变属性绘制出来的渐变效果都属于 `<image>` 值类型，它同样可以用作为遮罩图，即 `mask-image` 属性的值可以是任何渐变函数绘制的图像。如此一来，我们可以利用渐变来创建强大且有用的遮罩效果。

  


我稍后会展示一些有用的用例，但现在，我想集中讨论渐变与遮罩的核心基础原理。

  


在下面的示例中，遮罩图像由一个从完全黑色到透明的 CSS 线性渐变（`linear-gradient()`）绘制的：

  


```CSS
.element {
    mask-image: linear-gradient(
        to bottom, 
        black, 
        color-mix(in oklch, black, transparent 100%)
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfffbd1f70934b388e422cd46aa28191~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=584&s=3630751&e=gif&f=139&b=4e4b69)

  


> Demo 地址：https://codepen.io/airen/full/gOZgQLj

  


正如你所看到的，图片看上去有一种淡入淡出的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e12136530584435aa20c0ff5348d49e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2204&h=2150&s=934941&e=jpg&b=faf9f9)

  


现在，你只需要调整渐变效果，就能创建很多有创意的遮罩效果。例如：

  


```CSS
.card::before {
    mask-image: repeating-linear-gradient(
        125deg, 
        black, 
        black 30px, 
        transparent 30px, 
        transparent 48px
    );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e4890838e80440fae187666a7316459~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1286&s=294817&e=jpg&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/zYyNMpN

  


### 遮罩图平铺方式：mask-repeat

  


前面有说过，遮罩图默认的平铺方式也是 `repeat` ，即遮罩图会沿着 `x` 轴和 `y` 轴重复平铺，直到和元素框尺寸一样为止。一般遮罩图尺寸小于元素框尺寸时才会在视觉上呈现。

  


如果你想改变遮罩图的重复或平铺方式，那么可以通过 `mask-repeat` 属性来指定，它的使用与 `background-repeat` 是相同的：

  


-   `repeat-x`：水平重复遮罩图像，使其覆盖整个水平方向
-   `repeat-y`：垂直重复遮罩图像，使其覆盖整个垂直方向
-   `repeat`：默认值，同时水平和垂直重复遮罩图像，使其覆盖整个元素
-   `space`：如果水平或垂直方向上的遮罩图像尺寸不适合元素尺寸，它会在水平和垂直方向上等间距地重复，留下间距
-   `round`：如果水平或垂直方向上的遮罩图像尺寸不适合元素尺寸，它会在水平和垂直方向上等比例地缩放以适应元素，可能会导致图像部分被裁剪
-   `no-repeat`：遮罩图像不重复，只显示一次

  


例如，下面这个示例，改变 `mask-repeat` 将得到不一样的遮罩效果：

  


```CSS
.element {
    --sz: 8px;
    --c0: transparent;
    --c1: black;
    --c2: color-mix(in oklch, white, transparent 50%);
    --ts:calc(var(--sz) * 10) calc(var(--sz) * 10);
    --mask-image: repeating-linear-gradient(
        90deg,
        var(--c0) 0 10%,
        var(--c1) 0 20%,
        var(--c2) 0 30%,
        var(--c1) 0 40%,
        var(--c0) 0 50%
    );
    --mask-size: var(--ts);
    
    mask-image: var(--mask-image);
    mask-size: var(--mask-size);
    mask-repeat: var(--mask-repeat);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/844b8fb65ba24ed888fea888232f87bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=544&s=15829878&e=gif&f=199&b=d6e1ec)

  


> Demo 地址：https://codepen.io/airen/full/LYMxMNJ

  


### 遮罩图尺寸：mask-size

  


`mask-size` 属性可以像 `background-size` 属性一样，用来设置遮罩图片的尺寸。例如：

  


```CSS
.element {
    mask-size: 50% 50%;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0bcc0bf805f4619bfbb78ab99521054~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=682&s=3605666&e=gif&f=255&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/mdaWaea

  


除了可以给 `mask-size` 设置指定的长度值之外，还可以使用关键词 `cover` 和 `contain` ，它们的使用和 `background-image` 或者 `object-fit` 属性取 `cover` 和 `contain` 相似。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e7019ed9bc54454ba5a08a15ca343d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=808&h=576&s=5053905&e=gif&f=181&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/wvRJRzw

  


注意，当 `mask-size` 属性的值为 `cover` 或 `contain` 关键词时，将会涉及到遮罩图尺寸和遮罩容器尺寸之间的计算，有关于这方面的详细介绍，我曾在《[内在 Web 设计](https://juejin.cn/book/7161370789680250917/section/7161625601713897508)》和《[响应式图片：防止图片的拉伸和挤压](https://juejin.cn/book/7199571709102391328/section/7199845663143067660)》中有过详细阐述。

  


### 遮罩图位置：mask-position

  


`mask-position` 属性的使用和 `background-position` 属性一样，可以用来决定遮罩图在遮罩容器中的位置。例如：

  


```CSS
.element {
    mask-position: 50% 50%; /* Center*/
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0d7698a3cde45d8b60e99ceb7eb4c9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=804&h=608&s=12637821&e=gif&f=453&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/bGOqOqN

  


有关于这方面更详细的介绍可以参阅《[Web 图片：你不该遗忘的 CSS 技巧](https://juejin.cn/book/7199571709102391328/section/7199845838103773195)》中的“为什么背景定位需要新特性？”

  


### mask-origin 和 mask-clip

  


`mask-origin` 和 `mask-clip` 两属性分别与 `background-origin` 及 `background-clip` 相似。它们可以帮助你定义遮罩的位置和裁剪方式。

  


`mask-origin` 属性用于定义遮罩图像的原点位置，即遮罩图像与元素框之间的起始点。它的值可以是：

  


-   `border-box`：默认值，遮罩图像的原点位于元素的边框盒内
-   `padding-box`：遮罩图像的原点位于元素的内边距盒内
-   `content-box`：遮罩图像的原点位于元素的内容盒内

  


例如：

  


```CSS
.element {
    mask-origin: content-box; /* 遮罩图像的原点位于内容盒内 */
}
```

  


`mask-clip` 属性用于定义如何裁剪遮罩图像，以适应元素的盒模型。它的值可以是：

  


-   `border-box` ：默认值，遮罩图像将被裁剪以适应元素的边框盒
-   `padding-box` ：遮罩图像将被裁剪以适应元素的内边距盒
-   `content-box` ：遮罩图像将被裁剪以适应元素的内容盒
-   `no-clip` ：遮罩图像不会被裁剪，将完全显示在元素内。

  


例如：

  


```
.element {
    mask-clip: padding-box; /* 遮罩图像将被裁剪以适应内边距盒 */
}
```

  


这些属性可以用来更精确地控制遮罩的行为，以满足特定设计需求。根据元素的盒模型和遮罩图像的需求，你可以选择适当的 `mask-origin` 和 `mask-clip` 值。

  


### 多个遮罩层

  


在 CSS 中使用遮罩层时，也可以有多个遮罩层，它类似于多背景的使用。例如：

  


```CSS
.element {
    mask-image: 
        url("mask.png"), 
        linear-gradient(to right, #000, transparent),
        radial-gradient(circle at center, #000, transpaernt);
    mask-size: cover;
    mask-position: left top, center, right 20%;
    mask-clip: content-box, padding-box, border-box;
    mask-origin: content-box, padding-box, border-box;
    mask-repeat: no-repeat;
}
```

  


使用多个遮罩层时，需要使用逗号对它们进行分隔。使用多遮罩时，如果多个遮罩层的大小相同，位置也相同，则其中一个将覆盖另一个遮罩；如果第一个遮罩图片尺寸大于或等于容器尺寸，则会覆盖其他遮罩，在整个容器中只能看到一个背景。另外，出现越早的遮罩层，它的层级越高。

  


我们来看一个具体的示例：

  


```CSS
@layer mask {
    .mask {
        --radius: 25px;
        mask-image: 
            /* 左上角 */
            radial-gradient(
                #fff calc(var(--radius) - 1px),
                #fff0 var(--radius)
            ),
          
            /* 右上角 */
            radial-gradient(
                #fff calc(var(--radius) - 1px), 
                #fff0 var(--radius)
            ),
          
            /* 左下角 */
            radial-gradient(
                #fff calc(var(--radius) - 1px), 
                #fff0 var(--radius)
            ),
          
            /* 右下角 */
            radial-gradient(
                #fff calc(var(--radius) - 1px), 
                #fff0 var(--radius)
            ),
           
           /* 水平渐变 */ 
           linear-gradient(#fff, #fff),
           
           /* 垂直渐变 */
           linear-gradient(#fff, #fff),
          
           /* 右下角图标 */
           url('data:image/svg+xml;utf8,<svg width="39" height="25" viewBox="0 0 39 25" xmlns="http://www.w3.org/2000/svg"><path d="M38.4998 24.5C27.6998 22.1 22.9998 7.5 21.9998 0.5C11.8331 1.83333 -6.30022 6.3 2.49978 13.5C13.4998 22.5 21.9998 24.5 38.4998 24.5Z" /></svg>'); 
        mask-position: 
            0 0,              /* 左上角 */ 
            100% 0,           /* 右上角 */ 
            0 100%,           /* 左下角 */ 
            100% 100%,        /* 右下角 */ 
            0 var(--radius), /* 水平渐变 */ 
            var(--radius) 0, /* 垂直渐变 */ 
            100% 100%;       /* 右下角图标 */
        mask-size: 
            /* 左上角 */
            calc(var(--radius) * 2) calc(var(--radius) * 2),
            
            /* 右上角 */
            calc(var(--radius) * 2) calc(var(--radius) * 2),
            
            /* 左下角 */
            calc(var(--radius) * 2) calc(var(--radius) * 2),
            
            /* 右下角 */
            calc(var(--radius) * 2) calc(var(--radius) * 2),
            
            /* 水平渐变 */
            100% calc(100% - var(--radius) * 2),
            
            /* 垂直渐变 */
            calc(100% - var(--radius) * 2) 100%,
            
            /* 右下角图标 */
            calc(39px / 2) calc(25px / 2); 
        mask-repeat: no-repeat;
    }
}
```

  


示例中使用了四个径向渐变（`radial-gradient()`）和两个线性渐变（`linear-gradient()`）以及一个 SVG 图像，总共六个遮罩图形，它们的组合在一起，将得到类似于面图这样的一个遮罩图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86624d8b5bf246ac888255845b3793ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1498&s=656003&e=jpg&b=b4b4b4)

  


最终效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f93450e6577d42879ad4aa7571405334~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1250&s=895466&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/gOZmZBO

  


使用该原理，你将可以制作出各式各样的 `Tooltips` 或 `Bubble` 组件的 UI：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31d613bdc6034b7b9df028e0e0c55d56~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1148&s=905399&e=jpg&b=fefdfd)

  


来看一个类似微信聊天对话框的 `Bubble` 组件：

  


```HTML
<ul class="messages">
    <li class="message">
        <figure class="avatar">
            <img src="https://picsum.photos/800/800?random=52" alt="">
        </figure>
        <div class="bubble bulle--left">Bro ipsum dolor sit amet gaper backside single track, manny Bike epic clipless. Schraeder drop gondy, rail fatty slash gear jammer steeps</div>
    </li>
    <!-- 省略其他 li -->
</ul>
```

  


关键的 CSS ：

  


```CSS
@layer mask {
    .bubble {
        --r: 25px;
        --t: 30px;
    
        
        mask: 
          radial-gradient( 
              var(--t) circle at var(--_d) 0%, 
              #0000 98%, 
              #000 102%
          ) var(--_d) 100% / calc(100% - var(--r)) var(--t) no-repeat,
          
          conic-gradient(
              at var(--r) var(--r), 
              #000 75%, 
              #0000 0
          ) calc(var(--r) / -2) calc(var(--r) / -2) padding-box,
          
          radial-gradient(
              50% 50%, 
              #000 98%, 
              #0000 101%
          ) 0 0 / var(--r) var(--r) space padding-box;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/440c68f90fd74d338a3158ad629c4cc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1250&s=443905&e=jpg&b=565775)

  


> Demo 地址：https://codepen.io/airen/full/GRPWzZo

  


### 遮罩合成：mask-composite

  


通过前面内容的学习，我们知道可以同时使用多个遮罩层。我们在使用多个遮罩层的目的往往是拼接成一个遮罩图形。正因为这个原因，CSS 还为遮罩提供了一个合成的功能。即，**我们可以使用不同的操作将多个不同的遮罩层合并成一个独立的遮罩层**。比如，我们有两个遮罩层，在这两个遮罩层中取每对对应的像素，在它们的通道上应用特定的合成操作，并为最终层获得第三个像素。如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86587ae82b6146a991f96a764b2625aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=996&s=71683&e=jpg&b=fcfcfc)

  


上图中左上图和左下图合层起来成了右侧的层。而左上图被称为源（Source），左下图被称为目标层（Destination），这对我们来说没有多大的意义，因为给我的感觉，一个是输入源，一个是输出结果（事实上，这两个都是输入）。但是，就上图的结果而言，这两个层（源和目标层）却做了一个合层的操作（也被称为合层计算），从而得到最终的结果（上图右侧的合并层）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/398da0b9a2c649cc912cb3a2676ade0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=579&s=46888&e=jpg&b=e1e1e1)

  


上面演示的是仅有两个层合并，而事实上呢？我们可能会有两个以上的层合并，当有这种情形时，合层是分阶段完成的，从底部开始。

  


在第一阶段，从底部开始的第二层是源，从底部开始的第一层是目标，这两层被合成，结果成为第二阶段的目标，接着和从底部开始的第三层（源）合并。通过合成前两层的结果合成第三层，我们就得到了第三阶的目标，接着再从底部开始的第四层（源）合并。如下图这样的一个合并过程：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad19f576fac54e3fb39179122e2563bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=748&s=70394&e=jpg&b=fefefe)

  


以此类推，直到我们达到最后一个阶段，在这里，最顶层由下面所有层的合成结果组成。

  


如果上面太过于理论，不易于理解，不要紧。因为 `mask` 中的合成计算和我们常用的设计软件合成是相似的。换句话说，`mask-composite` 对应的值，比如 `add`、`subtract`、`intersect` 和 `exclude` 可以指定遮罩层的合成计算，它们分别对应设计软件中的联集（`add`）、减去顶层（`subtract`）、交集（`intersect`）和差集（`exclude`）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1a720658aed4ad3a8a214ad90c166f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=924&s=85669&e=jpg&b=fefefe)

  


`mask-composite` 属性除了 `add` 、`subtract` 、`intersect` 和 `exclude` 之外，还可以接受下面这些值：

  


-   `clear` ：清除，不显示任何遮罩
-   `copy` ：只显示上方遮罩，不显示下方遮罩
-   `source-over`：默认值。使用此值时，后面的遮罩图像会覆盖前面的遮罩图像，类似于正常的图层叠加，等价于 `add`
-   `source-in`：将后面的遮罩图像与前面的遮罩图像相交，只显示重叠部分，等价于 `intersect`
-   `source-out`：将前面的遮罩图像从后面的遮罩图像中减去，只显示不重叠的部分，等价于 `subtract`
-   `source-atop`：将后面的遮罩图像与前面的遮罩图像相交，但保留后面遮罩图像的不重叠部分
-   `destination-over`：将前面的遮罩图像放在后面的遮罩图像上，类似于正常的图层叠加
-   `destination-in`：只显示前面的遮罩图像与后面的遮罩图像相交的部分
-   `destination-out`：只显示后面的遮罩图像与前面的遮罩图像不相交的部分
-   `destination-atop`：将前面的遮罩图像与后面的遮罩图像相交，但保留前面遮罩图像的不重叠部分
-   `xor`：只显示前面的遮罩图像与后面的遮罩图像不相交的部分，等价于 `exclude`

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b7db6af74cd4548abb022f5e2fd6c16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2800&h=1445&s=808391&e=jpg&b=ffffff)

  


例如，我们使用径向渐变 `radial-gradient()` 绘制一个圆形遮罩图，同时使用 `linear-gradient()` 绘制一个矩形遮罩图，其中圆形遮罩图是一个源（Source），而矩形遮罩图是目标层（Destination）:

  


```CSS
.element {
    mask-image: 
        /* 源 Source */
        radial-gradient(50% 50% at center, white 0% 80%,#0000 81% 100%), 
        
        /* 目标层 Destination */
        linear-gradient(to bottom, black, black);
    mask-size: 100px 100px, 55% 55%;
    mask-repeat: no-repeat;
    mask-position: center, left top;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e6eafef27dd4196b44f5d557ef7a3d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=937&s=521147&e=jpg&b=565775)

  


`mask-composite` 取不同值时，效果将不一样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecc4693a83aa41fda81a2fb185427c3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=816&h=644&s=5647900&e=gif&f=701&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/BavWEwa

  


利用这种技术，我们很容易实现镂空效果，用于制作探照灯的效果就很方便：

  


```CSS
.mask {
    --x: 50%;
    --y: 50%;
  
    &::before {
        background-color: rgb(0 0 0/ .65);
        backdrop-filter: blur(5px);
        mask-image: 
            radial-gradient(50% 50% at center, white 0% 80%,#0000 81% 100%), 
            linear-gradient(to bottom, black, black);
        mask-size: 100px 100px, 100% 100%;
        mask-repeat: no-repeat;
        mask-position: var(--x) var(--y), left top;
        -webkit-mask-composite: xor; 
        mask-composite: exclude;
        transition: all .2s linear;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce3f91d117d54ddd9ebde906de70c678~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=814&h=590&s=1322590&e=gif&f=101&b=1d2223)

  


> Demo 地址：https://codepen.io/airen/full/KKbWLpX

  


在实际生产中，可用来制作优惠券（`Coupon` 组件） UI 效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b85f78db44349abb8e20baafb36f5d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1370&s=1391020&e=jpg&b=fcfafa)

  


例如：

  


```CSS
.card {
    mask-image: 
        radial-gradient(circle at 50px 10px, transparent 10px, red 10.5px), 
        radial-gradient(circle at 50%, red 99%, transparent 100%);
    mask-size: 100%, 4px 12px;
    mask-repeat: repeat, repeat-y;
    mask-position: 0 -10px, 48px;
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91dfdbe61f04479bad99459da5977465~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=304&s=631552&e=gif&f=149&b=fcfbfc)

  


> Demo 地址：https://codepen.io/airen/full/BavWerZ

  


[@xboxyan](https://github.com/XboxYan) 提供的 [Coupon.io](https://coupon.codelabo.cn/) 工具也是采用 `mask` 原理来制作优惠券的，该工具可以帮助你快速生成优惠券 UI。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dda1c7fa5e0847829a1416156e05ac8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=604&s=4925062&e=gif&f=410&b=fcfbfc)

  


> Coupon.io 工具：https://coupon.codelabo.cn/

  


## 案例

  


前面花了很长的篇幅向大家介绍了 CSS Clipping（剪切）和 Masking（遮罩）相关特性的基本原理和使用。接下来，我想通过一些案例向大家阐述，我们在实际生产中可以用它们来做些什么？

  


### 创建对角布局

  


在某种程度上，你可能会碰到像下图这样的布局风格，其中一个部分具有略微倾斜的背景：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99d73371e188473188f9b06d33ba3cba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1415&s=293083&e=jpg&b=b8e1e4)

  


> Demo 地址：https://codepen.io/airen/full/KKbWLbB

  


就上图这种布局网格，你可以完美的使用 `clip-path` 属性的 `polygon()` 函数来实现，你只需要知道倾斜图形四个顶点的坐标即可：

  


```CSS
.diagonal--layout {
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}
```

  


还可以混合 `calc()` 和 CSS 视窗单位，使角度相对于浏览器视口的宽度：

  


```CSS
.diagonal--layout {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5vw), 0 100%);
}
```

  


> Demo 地址：https://codepen.io/airen/full/eYbvwpw

  


你还可以使用同样的原理来实现对角布局：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32f03f686224410787c910cbb99409b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1627&s=524212&e=jpg&b=b5e5e2)

  


> Demo 地址：https://codepen.io/airen/full/yLGMdbd

  


```CSS
@layer layout {
    :root {
        --diagonal-section-offset: 50px;
    }
    
    .diagonal--layout {
        padding-block: calc(var(--diagonal-section-offset) / 2);
    
        clip-path: polygon(
            0% 0%,
            100% var(--diagonal-section-offset),
            100% 100%,
            0% calc(100% - var(--diagonal-section-offset))
        );
        background: linear-gradient(45deg, #654ea3, #eaafc8);
    }

    main {
        padding-block: calc(var(--diagonal-section-offset) * 1.5);
        padding-inline: 1rem;
    
        clip-path: polygon(
            0% var(--diagonal-section-offset),
            100% 0%,
            100% calc(100% - var(--diagonal-section-offset)),
            0% 100%
        );
        background: linear-gradient(-135deg, #eaafc8, #654ea3);
    }
}
```

  


上面这个示例，还可以使用 [CSS 的三角函数](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)和 `clip-path` 一起实现，通过三角函数计算出 `polygon()` 函数所对应的坐标位置：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20d3f0c592b5445d9cd106485e09643f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=912&s=282106&e=jpg&b=e2e2e2)

  


注意，小册的《[CSS 的三角函数](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)》一节课就详细阐述了 CSS 三角函数对 `clip-path` 作用。感兴趣的同学，不妨尝试一下，使用 CSS 的角函数和 `clip-path` 实现对角布局的效果。

  


### 不规则布局

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e48e57e747864410a1fe1525b6279997~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=912&s=783729&e=jpg&b=e9e2e2)

  


你现在可以使用 CSS 的 `clip-path` 和 `shape-outside` （或者 `shape-inside`）制作图像上图中不规则的布局效果。换句话说，这些属性使得你[创建不规则 Web 布局](https://juejin.cn/book/7161370789680250917/section/7161625566062313503)已不再是难事。

  


例如上图右侧的布局效果，只需要将 `clip-path` 和 `shape-outside` 的值设置为一样的即可。在这个示例中将会使用 `polygon()` 把所需的坐标点定位出来：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc12b013276e4ff7864efb86b8de2e20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=912&s=912093&e=jpg&b=e4e3e3)

  


```CSS
:root {
    --path: polygon(53.45% 90.65%, 52.65% 91.1%, 50.45% 91.1%, 48.15% 90.95%, 46.25% 90.8%, 45% 90.3%, 45.3% 89.4%, 46.7% 88.9%, 49.4% 88.6%, 50.3% 88.15%, 50.45% 86.25%, 50.15% 82.2%, 50% 79.4%, 49.85% 76.25%, 50.15% 72.2%, 49.2% 72.5%, 48.45% 72.8%, 47.65% 72.8%, 46.9% 73.3%, 46.4% 73.45%, 45.3% 72.65%, 43.9% 72.65%, 42.8% 72.35%, 41.7% 71.7%, 41.1% 70.65%, 39.85% 70.65%, 38.3% 70.65%, 37.05% 69.7%, 36.7% 68.45%, 37.2% 67.2%, 38.3% 66.55%, 39.7% 65.95%, 40.8% 64.7%, 42.2% 64.05%, 43.6% 63.75%, 45% 63.75%, 46.25% 64.05%, 47.65% 64.85%, 47.05% 62.65%, 46.7% 60.8%, 47.05% 58.45%, 47.65% 56.1%, 48.15% 53.45%, 47.2% 51.1%, 45.8% 48.45%, 44.2% 45.95%, 43.6% 43.6%, 43.45% 41.1%, 40.95% 38.6%, 39.05% 36.55%, 37.5% 34.2%, 36.7% 33.45%, 36.55% 35.3%, 35.95% 37.2%, 34.85% 39.05%, 34.05% 41.1%, 32.8% 42.8%, 31.9% 44.55%, 31.7% 45.45%, 32.2% 46.1%, 32.8% 46.7%, 33.15% 47.35%, 32.95% 47.95%, 32.5% 48.45%, 31.9% 48.75%, 31.1% 49.2%, 30.15% 50.15%, 29.05% 51.1%, 27.8% 52.65%, 26.9% 53.3%, 26.1% 53.45%, 25.65% 53.15%, 26.4% 51.55%, 27.2% 49.7%, 27.5% 47.2%, 28.45% 44.55%, 30% 41.4%, 31.4% 33.75%, 31.7% 32.2%, 32.05% 30.8%, 32.5% 29.55%, 33.15% 28.3%, 33.9% 27.5%, 35.15% 27.2%, 36.4% 27.35%, 37.5% 27.95%, 39.7% 29.55%, 42.65% 31.55%, 46.55% 35.15%, 49.55% 38.9%, 52.65% 38.45%, 55.45% 38.15%, 57.5% 37.8%, 55.8% 36.7%, 53.9% 35.45%, 52.65% 34.7%, 51.7% 34.4%, 50.95% 34.85%, 50.3% 35.15%, 49.85% 35.45%, 49.2% 35.65%, 48.6% 35.45%, 48.15% 34.85%, 47.95% 34.05%, 47.2% 33.15%, 45.8% 32.35%, 44.4% 31.7%, 43.6% 31.25%, 43.75% 30.45%, 44.4% 30.45%, 45.15% 30.65%, 45.95% 30.95%, 46.9% 31.1%, 48.3% 31.1%, 49.85% 31.25%, 51.55% 31.7%, 53.15% 32.5%, 54.85% 32.95%, 57.95% 33.75%, 60.8% 34.05%, 63.9% 35%, 65.95% 35.65%, 67.2% 36.1%, 67.8% 36.7%, 68.45% 37.5%, 68.6% 38.3%, 68.45% 39.05%, 67.95% 39.85%, 66.25% 40.95%, 64.4% 41.9%, 59.55% 43.9%, 54.7% 45%, 56.7% 49.55%, 58.15% 53.15%, 58.9% 55.45%, 59.2% 57.35%, 59.2% 58.9%, 58.75% 60.45%, 57.65% 61.9%, 56.4% 63.15%, 54.4% 64.05%, 53.15% 64.7%, 52.5% 66.4%, 52.95% 68.45%, 54.05% 73.45%, 54.4% 76.1%, 54.55% 79.85%, 54.2% 85.15%, 53.9% 89.55%);
}

img {
    clip-path: var(--path);
    shape-outside: var(--path);
    float: left; /* 这个很重要 */
}
```

  


> Demo 地址：https://codepen.io/airen/full/ZEVKzqV

  


### 构建自定义图形布局

  


我们可以使用 [CSS 网格布局技术和 clip-path 结合起来构建一些具有创意性的 Web 布局](https://juejin.cn/book/7161370789680250917/section/7161624198429802504)，例如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd70169c60c04bd7ab7d27991e7b384c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1532&s=1119992&e=jpg&b=dedad9)

  


> 注意，构建上图这些布局效果，你需要对 CSS Grid 布局技术有所掌握。如果你对 CSS Grid 不太了解或从未接触过的话，建议你移步阅读《**[现代 Web 布局](https://s.juejin.cn/ds/ieUTL251/)**》中 [CSS Grid 布局](https://juejin.cn/book/7161370789680250917/section/7161372229123440648)相关的课程！

  


以六边形网格（也称“蜂窝”网格）布局为例。你需要下面这样的一个 HTML 结构：

  


```HTML
<div class="gallery">
    <img src="figure.png" alt="" />
    <!-- 省略其他六个 img -->
</div>
```

  


首先，你需要使用 `clip-path` 的 `polygon()` 函数，将每图图片裁剪成六边形：

  


```CSS
:root {
    --hexagons-path: polygon(
        25% 0%,
        75% 0%,
        100% 50%,
        75% 100%,
        25% 100%,
        0 50%
    );
}

.gallery img {
    clip-path: var(--hexagons-path);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a358333595f49deb2edfcb484100961~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=912&s=345594&e=jpg&b=fbfcf7)

  


接着创建一个 `1 x 1` 的网格，并且网格轨道的尺寸和图片尺寸大小相同。示例中将图片设置为 `160px` ，并且宽高都相等，另外图片与图片之间的间距为 `1rem` ：

  


```CSS
:root {
    --size: 160px;
    --gap: 1rem;
}

.gallery {
    display: grid;
    
    & img {
        grid-area: 1 / 1 / -1 / -1;
        width: var(--size);
        aspect-ratio: 1;
    }
}
```

  


此时，你会发现，所有图片都在网格的同一个区域层叠在一起。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d982b29c08e492995383de010540cde~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=912&s=599015&e=jpg&b=fbfcf7)

  


请注意，我们仍然希望其中一张图片保持在中心，其余的图片是使用 CSS 的 `translate` 放置在它周围的，这些图片基于中心点沿着 `x` 轴和 `y` 轴平移，其平移量可以通过 CSS 的三角函数计算出来：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d61b94469c8542aab4aadfcf1a08d045~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2200&h=1832&s=1291826&e=jpg&b=555674)

  


```CSS
img {
    --hypotenuse: calc(var(--size) + var(--gap));
    --deg: 30deg;
    --opposite: calc(sin(var(--deg)) * var(--hypotenuse));
    --adjacent: calc(cos(var(--deg)) * var(--hypotenuse));
    --x: var(--adjacent);
    --y: var(--opposite);
}
```

  


接下来只需要将 `--x` 和 `--y` 计算出来的值赋予给 `translate` 即可，注意，不同的图片它对应的角度（`--deg`）是不一样的：

  


```CSS
@layer gallery {
    :root {
        --hexagons-path: polygon(
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%,
            0 50%
        );
    
        --size: 160px;
        --gap: 1rem;
    }

    .gallery {
        display: grid;
           
        & img {
            --deg: 30deg;
            --hypotenuse: calc(var(--size) + var(--gap));          /* 三角形斜边长度 */
            --opposite: calc(sin(var(--deg)) * var(--hypotenuse)); /* 三角形对边长度 */
            --adjacent: calc(cos(var(--deg)) * var(--hypotenuse)); /* 三角形邻边长度 */
            
            /* 图片平移量，x 轴等于三角形邻边长度，y 轴等于三角形对边长度*/
            --x: var(--adjacent);
            --y: var(--opposite);
          
            clip-path: var(--hexagons-path);
            grid-area: 1 / 1 / -1 / -1;
            
            width: var(--size);
            aspect-ratio: 1; /* 保持图片宽高相等 */
          
            /* 除第一张图片之外所有图片进行平移 */
            &:not(:nth-child(1)) {
                translate: var(--x) var(--y);
                transform-origin: center;
            }
          
            &:nth-child(2) {
                --deg: 90deg;
            }
          
            &:nth-child(3) {
                --deg: 150deg;
            }
          
            &:nth-child(4) {
                --deg: 210deg;
            }
            
            &:nth-child(5) {
                --deg: 270deg;
            }
            
            &:nth-child(6) {
                --deg: 330deg;
            }
          
            &:nth-child(7) {
                --deg: 390deg;
            }
        }
    }
}
```

  


简单地三步走，就完成了所需的布局效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4167601d2e74899b7828a05183d60c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2527&h=912&s=745978&e=jpg&b=fcfcf7)

  


你还可以在此基础上增加一些其他的 CSS ，让整个布局效果更具创意性：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e628db8e9d24974b14355c9c9768f6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=868&h=620&s=8648071&e=gif&f=199&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/abPWbyN

  


注意，如果 `clip-path` 属性中 `polygon()` 函数坐标调整之后，三角函数在计算 `--x` 和 `--y` 也需要做出相应的调整：

  


```CSS
:root {
    --hexagons-path: polygon(0% 25%,0% 75%,50% 100%,100% 75%,100% 25%,50% 0);
} 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ce3b3b9b5ac4ab49e34f984af612308~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=912&s=238004&e=jpg&b=adbbf6)

  


> Demo 地址：https://codepen.io/airen/full/gOZWRee

  


注意，三角形角度不再是 `30deg` ，而是 `60deg` 了。就这个示例而言，我们只需要调整 `--deg` 的值就可以。

  


我们再来看一个使用 CSS Masking 实现相似布局的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/363545ce4c9749fcb336e568855acfb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1058&s=491269&e=jpg&b=e8d185)

  


首先，使用 CSS Grid 将四张图片放置在一个 `2 x 2` 的网格中，而且行和列网格轨道的尺寸由 `--size` 来决定，同时每张图片填满相应的网格单元格：

  


```CSS
@layer grid {
    .gallery {
        --size: 200px;
        --gap: 6px;
    
        display: grid;
        gap: var(--gap);
        grid: auto-flow var(--size) / repeat(2, var(--size));
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/239d28653b42495b989f9c1267b25f55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=807&s=345070&e=jpg&b=555674)

  


接下来，需要使用 `mask` 对图片进行镂空处理。就这个示例而言，我们可以使用 CSS 的径向渐变 `radial-gradient()` 来制作遮罩图。例如：

  


```CSS
figure {
    position: relative;
    
    --mask: 
        radial-gradient(
            var(--radius) at left 50% bottom var(--radius),
            white 95%,
            #0000
        ),
        radial-gradient(
            calc(var(--radius) + var(--gap)) at calc(100% + var(--gap)) 50%,
            #0000 95%,
            black
        )  top / 100% calc(100% - var(--radius)) no-repeat;
      
      &::before {
          content: "";
          position: absolute;
          inset: 0 0;
          z-index: 1;
          opacity: 0.85;
          background: var(--mask);
      }

      &:nth-child(2) {
          --mask: 
              radial-gradient(
                  var(--radius) at top 50% left var(--radius),
                  white 95%,
                  #0000
              ),
              
              radial-gradient(
                  calc(var(--radius) + var(--gap)) at 50% calc(100% + var(--gap)),
                  #0000 95%,
                  #000
              ) right/calc(100% - var(--radius)) 100% no-repeat;
      }

      &:nth-child(3) {
          --mask: 
              radial-gradient(
                  var(--radius) at top 50% right var(--radius),
                  white 95%,
                  #0000
              ),
              
              radial-gradient(
                  calc(var(--radius) + var(--gap)) at 50% calc(0% - var(--gap)),
                  #0000 95%,
                  #000
              ) left/calc(100% - var(--radius)) 100% no-repeat;
      }

      &:nth-child(4) {
          --mask: 
              radial-gradient(
                  var(--radius) at left 50% top var(--radius),
                  white 95%,
                  #0000
              ),
              
              radial-gradient(
                  calc(var(--radius) + var(--gap)) at calc(0% - var(--gap)) 50%,
                  #0000 95%,
                  #000
              ) bottom/100% calc(100% - var(--radius)) no-repeat;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a80f1d49cd44f138c7ad62ac6c06a29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2385&h=807&s=598794&e=jpg&b=555674)

  


注意，上图展示的是如何使用 CSS 渐变来绘制遮罩图。现在我们只需要将其赋予给 `mask` 属性，就能得到镂空的图片效果：

  


```CSS
@layer gallery {
    figure {
        --mask: radial-gradient(
            var(--radius) at left 50% bottom var(--radius),
            white 95%,
            #0000
        ),
        radial-gradient(
            calc(var(--radius) + var(--gap)) at calc(100% + var(--gap)) 50%,
            #0000 95%,
            black
        ) top / 100% calc(100% - var(--radius)) no-repeat;
        
        mask: var(--mask);
    
        &:nth-child(2) {
            --mask: radial-gradient(
                var(--radius) at top 50% left var(--radius),
                white 95%,
                #0000
            ),
            radial-gradient(
                calc(var(--radius) + var(--gap)) at 50% calc(100% + var(--gap)),
                #0000 95%,
                #000
            ) right/calc(100% - var(--radius)) 100% no-repeat;
        }
    
        &:nth-child(3) {
            --mask: radial-gradient(
                var(--radius) at top 50% right var(--radius),
                white 95%,
                #0000
            ),
            radial-gradient(
                calc(var(--radius) + var(--gap)) at 50% calc(0% - var(--gap)),
                #0000 95%,
                #000
            ) left/calc(100% - var(--radius)) 100% no-repeat;
        }
    
        &:nth-child(4) {
            --mask: radial-gradient(
                var(--radius) at left 50% top var(--radius),
                white 95%,
                #0000
            ),
            radial-gradient(
                calc(var(--radius) + var(--gap)) at calc(0% - var(--gap)) 50%,
                #0000 95%,
                #000
            ) bottom/100% calc(100% - var(--radius)) no-repeat;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b2d64d26e7948e19ddd14e8ab0b4bc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=998&s=568974&e=jpg&b=565774)

  


离目标越来越近了。

  


我们已经有了形状，但缺少重叠的边缘，以使它们彼此契合。每个图像都限制在它所在的网格单元格中，所以目前形状有些混乱是有道理的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84c9ba13b604431bede0c4b7866de5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=807&s=501486&e=jpg&b=565775)

  


我们需要通过增加图像的高度或宽度来创建溢出。从上图中可以看出，我们需要增加第一和第四张图片的高度，同时增加第二和第三张图片的宽度。你可能已经猜到，我们需要使用 `--radius` 变量来增加它们。

  


```CSS
@layer gallery {
    figure {
        &:is(:nth-child(1), :nth-child(4)) {
            width: 100%;
            height: calc(100% + var(--radius));
        }
        
        &:is(:nth-child(2), :nth-child(3)) {
            height: 100%;
            width: calc(100% + var(--radius));
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fdfa7fc1a7149918be1cf669b611941~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=807&s=637562&e=jpg&b=565775)

  


我们已经创建了重叠，但默认情况下，我们的图像要么在右侧重叠（如果我们增加宽度），要么在底部重叠（如果我们增加高度）。但第二和第四张图片的效果并不是我们期望的。修复方法是在这两张图片上使用 `place-self: end`，我们的完整代码变成了这样：

  


```CSS
@layer gallery {
    figure {
        --mask: radial-gradient(
            var(--radius) at left 50% bottom var(--radius),
            white 95%,
            #0000
        ),
        radial-gradient(
            calc(var(--radius) + var(--gap)) at calc(100% + var(--gap)) 50%,
            #0000 95%,
            black
        ) top / 100% calc(100% - var(--radius)) no-repeat;
        
        mask: var(--mask);
    
        &:nth-child(2) {
            --mask: radial-gradient(
                var(--radius) at top 50% left var(--radius),
                white 95%,
                #0000
            ),
            radial-gradient(
                calc(var(--radius) + var(--gap)) at 50% calc(100% + var(--gap)),
                #0000 95%,
                #000
            ) right/calc(100% - var(--radius)) 100% no-repeat;
        }
    
        &:nth-child(3) {
            --mask: radial-gradient(
                var(--radius) at top 50% right var(--radius),
                white 95%,
                #0000
            ),
            radial-gradient(
                calc(var(--radius) + var(--gap)) at 50% calc(0% - var(--gap)),
                #0000 95%,
                #000
            ) left/calc(100% - var(--radius)) 100% no-repeat;
        }
    
        &:nth-child(4) {
            --mask: radial-gradient(
                var(--radius) at left 50% top var(--radius),
                white 95%,
                #0000
            ),
            radial-gradient(
                calc(var(--radius) + var(--gap)) at calc(0% - var(--gap)) 50%,
                #0000 95%,
                #000
            ) bottom/100% calc(100% - var(--radius)) no-repeat;
        }
    
        &:is(:nth-child(1), :nth-child(4)) {
            width: 100%;
            height: calc(100% + var(--radius));
        }
        
        &:is(:nth-child(2), :nth-child(3)) {
            height: 100%;
            width: calc(100% + var(--radius));
        }
        
        &:is(:nth-child(2), :nth-child(4)) {
            place-self: end;
        }
    }
}

@layer grid {
      .gallery {
          --size: 200px;
          --gap: 6px;
          --radius: 42px;
    
          display: grid;
          gap: var(--gap);
          grid: auto-flow var(--size) / repeat(2, var(--size));
      }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b1cf27dace749c6b69ef6d14e2471b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=807&s=844026&e=jpg&b=565775)

  


> Demo 地址：https://codepen.io/airen/full/VwqbWgr

  


在这些布局的基础上，我们只需稍加调整，还可以构建出很多有创意的布局。比如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0123a6ac94a46ad965e9d04e07ee6e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=748&s=8599034&e=gif&f=47&b=3a3736)

  


> Demo 地址：https://codepen.io/airen/full/ExGmvME

  


具体代码不在这里展示了，请查看 Demo！

  


### 构建有创意的边框

  


有的时候，你的设计师可能会跟你提出这样的要求，要给图片或元素添加一个具有创意的边框效果，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8099e587512e4e46b08245cc9895ee06~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=432&s=1592307&e=gif&f=99&b=91a8ae)

  


就上图这个效果，小册的《[CSS 的锥形渐变](https://juejin.cn/book/7223230325122400288/section/7259668771856941111)》一节中有一个相似的案例，使用 CSS 的 `conic-gradient()` 函数就可以实现：

  


```CSS
@layer gallery {
    img {
        --b: 5px; /* 边框粗细 */
        --c: #0000 90deg, yellow 0; /* 渐变颜色 */
        padding: 10px;
        background:
            conic-gradient(from 90deg  at top    var(--b) left  var(--b), var(--c)) 0 0,
            conic-gradient(from 180deg at top    var(--b) right var(--b), var(--c)) 100% 0,
            conic-gradient(from 0deg   at bottom var(--b) left  var(--b), var(--c)) 0 100%,
            conic-gradient(from -90deg at bottom var(--b) right var(--b), var(--c)) 100% 100%;
        background-size: 50px 50px; /* 调整大小 */
        background-repeat: no-repeat;
        transition: all .2s linear;
        
        &:hover {
            background-size: 51% 51%;
        }
    }
}
```

  


> Demo 地址：https://codepen.io/airen/full/BavRmMG

  


我们现在使用 `clip-path` 也可以很容易地实现。

  


```CSS
@layer gallery {
    img {
        --s: 15px; 
        padding: var(--s);
        border: var(--s) solid #0000;
        background: 
            linear-gradient(to bottom, #fff, #fff),
            conic-gradient(from 90deg at 15px 15px, #0000, #000 0);
        background-origin: padding-box, border-box;
        background-clip: padding-box, border-box;
        clip-path: polygon(
            0 0,
            33% 0,
            33% var(--s),
            66% var(--s),
            66% 0,
            100% 0,
            100% 33%,
            calc(100% - var(--s)) 33%,
            calc(100% - var(--s)) 66%,
            100% 66%,
            100% 100%,
            66% 100%,
            66% calc(100% - var(--s)),
            33% calc(100% - var(--s)),
            33% 100%,
            0 100%,
            0 66%,
            var(--s) 66%,
            var(--s) 33%,
            0 33%
        );
        transiton: all 1s linear;
    
        &:hover {
            clip-path: polygon(
                0 0,
                33% 0,
                33% 0,
                66% 0,
                66% 0,
                100% 0,
                100% 33%,
                100% 33%,
                100% 66%,
                100% 66%,
                100% 100%,
                66% 100%,
                66% 100%,
                33% 100%,
                33% 100%,
                0 100%,
                0 66%,
                0 66%,
                0 33%,
                0 33%
            );
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8af07017f09848ffab5c3751b00972d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=862&h=722&s=5285325&e=gif&f=93&b=4c4a69)

  


> Demo 地址：https://codepen.io/airen/full/MWZmrwa

  


还能实现更炫酷的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09a5064527b84cb3907dab2e4d11c387~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=462&s=2663778&e=gif&f=110&b=e5e5e5)

  


> Demo 地址：https://codepen.io/airen/full/PoXmEEv

  


```CSS
img {
    --_p: 100px;
    --_g1: radial-gradient(50% 50%,#e71e24 90%,#0000); /* color 1 */
    --_g2: radial-gradient(50% 50%,#fcc010 90%,#0000); /* color 2 */
    --_g3: radial-gradient(50% 50%,#85c341 90%,#0000); /* color 3 */
    --_g4: radial-gradient(50% 50%,#eb2288 90%,#0000); /* color 4 */
  
    border-radius: 50%;
    cursor: pointer;
    padding: 40px;
    clip-path: circle(calc(50% - 40px));
  
    background:
        var(--_g1) calc(20% - var(--_p)) calc(20% - var(--_p)),
        var(--_g2) calc(80% + var(--_p)) calc(8%  - var(--_p)),
        var(--_g3) calc(88% + var(--_p)) calc(82% + var(--_p)),
        var(--_g3) 55%  calc(8% - var(--_p)),
        var(--_g1) calc(18% - var(--_p)) calc(91% + var(--_p)),
        var(--_g2) calc(10% - var(--_p)) calc(70% + var(--_p)),
        var(--_g2) calc(95% + var(--_p)) 40%,
        var(--_g1) calc(82% + var(--_p)) calc(28% - var(--_p)),
        var(--_g4) calc(12% - var(--_p)) 30%,
        var(--_g4) 65% calc(94% + var(--_p)),
        var(--_g3) calc(20% - var(--_p)) calc(10% - var(--_p)),
        var(--_g4) calc(42% - var(--_p)) calc(91% + var(--_p));
    background-size: 15px 15px, 20px 20px, 30px 30px;
    background-repeat: no-repeat;
    outline: 150px solid #0005;
    outline-offset: -150px;
    transition: .5s;
    
    &:hover {
        clip-path: circle(80%);
        outline: 3px solid #EF746F;
        outline-offset: 0;
        --_p: 0px;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3481acf667cc41b2884c2de2b7a8e2e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892&h=456&s=1883770&e=gif&f=87&b=f0cd88)

  


> Demo 地址：https://codepen.io/airen/full/vYvmpRv

  


```CSS
img {
    --b: 6px; 
    --g: 12px;
    --c: #AB3E5B;
    
    --_c: conic-gradient(at var(--b) calc(100% - var(--b)),#0000 25%,var(--c) 0);
    --_p: 200% var(--_i,var(--b)) no-repeat;
    --_m: 
        var(--_c) calc(var(--_i,0%) - 100%) 100%/var(--_p),
        conic-gradient(at var(--b) calc(100% - var(--b)),#000 25%,#0000 0);
  
    padding: calc(var(--b) + var(--g));
  
    background:
        conic-gradient(
            from 180deg at calc(100% - var(--b)) var(--b),
            #0000 25%,
            var(--c) 0
        ) var(--_i,200%) 0/var(--_p), var(--_c);
  

    mask: var(--_m);
    outline: 100vmax solid var(--c);
    outline-offset: -100vmax;
    clip-path: inset(calc(2*(var(--b) + var(--g))));
    transition: 
        .3s clip-path, 
        .3s outline-color,
        .3s transform;
    cursor: pointer;

    &:hover {
        --_i: 100%;
        --_t: 0s;
      
        clip-path: inset(0);
        outline-color: #0000;
        scale: 1.2;
        transition: 
            .25s 1s mask-size, 
            .25s .75s mask-position, 
            .25s .5s background-size,
            .25s .25s background-position,
            .25s clip-path, 
            .25s outline-color,
            .7s transform;
    }
}
```

  


上面我们所展示的仅是 CSS Clipping 和 Masking 部分用例，事实上它们还可以做很多有意义的事情。你可以发挥你的才智，使用它们构建出更具创意的效果。

  


## CSS Clipping 和 Masking 注意事项

  


正如上面示例所展示的那样，CSS Clipping 和 Masking 很强大，可以帮助我们制作很多有意思的东西。但是在使用它们的时候有一些事项需要注意，尤其是 Clipping 。

  


如果元素框运用了 CSS Clipping 或 Masking 时，那么超出剪切图形（`clip-path`）或遮罩图形（`mask`）之外的东西都不可见，比如边框，阴影等。它的表现行为就有点类似于 `overflow: hidden` 的形式。

  


`clip-path` 相对于 `mask` 来说，某些方面更严重一些，比如元素的一些行为也随之丢失，例如悬浮、点击等。简单地说，剪切路路之外的地方，将失去悬浮和用户点击等行为。而 `mask` 不会有类似的现象：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35c2ca25a5574aeeb4e8b1d9f37981fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1428&h=428&s=2632559&e=gif&f=361&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/XWoRZXq

  


## 小结

  


CSS Clipping 和 Masking 是用于创建各种视觉效果的强大的 CSS 特性。其中 CSS Clipping （裁剪）允许你使用知道、圆形、多边形、路径等裁剪元素的可见区域，可用于创建独特的文本效果、动画效果以及各种视觉布局。而 CSS Masking （遮罩）允许你使用图像、渐变或其他元素作为蒙版，以控制元素的可见性，它常用于创建图像融合效果、文本遮罩、渐变蒙版等。

  


总之，CSS Clipping 和 Masking 是用于创建各种视觉效果的有用工具，但需要谨慎使用，以确保最佳性能和用户体验。根据具体的设计需求，选择合适的特性并小心考虑实施细节是非常重要的。