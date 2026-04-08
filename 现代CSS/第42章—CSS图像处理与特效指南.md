在现代 Web 设计中，图像处理和特效已经成为提高用户体验和吸引注意的重要元素之一。CSS 提供了一系列强大的功能，使 Web 开发者能够对 Web 页面上的图像或元素进行各种处理和增强效果。这节课将带你深入了解 CSS 中的一些关键特性，包括 `filter` 属性、`filter()` 函数、CSS 混合模式（CSS Blend Mode）以及 `backdrop-filter` 属性等。

  


CSS 的这些功能不仅能够创建令人印象深刻的视觉效果，还可以进行图像处理，使图像在 Web 上更具吸引力。无论你是 Web 设计师还是 Web 开发人员，都可以从这些功能中受益。以下是我们将在这节课中涵盖的主要内容：

  


-   **`filter`** **属性**：我们将介绍如何使用 `filter` 属性来对图像进行各种处理，如模糊、亮度调整、对比度增强、饱和度控制等。这些简单但强大的功能可用于改善图像的外观
-   **`filter()`** **函数：** 了解如何使用 `filter()` 函数将多个滤镜效果组合在一起，以创建更复杂的图像处理效果。我们将演示如何应用多个滤镜来实现创意和独特的效果
-   **混合模式（Blend Mode）** ：我们将深入研究 CSS 的混合模式（即 CSS 的 `mix-blend-mode` 和 `background-blend-mode`），这些模式允许图像之间以不同的方式进行混合，如正片叠底、叠加、差值等。你将了解如何利用混合模式来创建引人注目的效果
-   **`backdrop-filter`** **属性**：介绍 `backdrop-filter` 属性，它允许我们对元素的背景进行模糊和处理，创造出毛玻璃效果和其他视觉吸引人的效果

  


这些功能的用途广泛，不仅可以用于 Web 设计中的装饰和美化，还可以用于改善用户界面的交互性，比如缩放和拖动图像。无论你是想为网站增添一些独特的视觉元素，还是想在图像处理方面更有创意，这节课都将为你提供有关如何实现这些目标的深入知识。

  


现在，让我们开始探索这些强大的 CSS 图像处理和特效功能，以提升你的网页设计和前端开发技能！

  


## CSS 的 filter 属性

  


滤镜功能已不再是图形设计软件（例如 Photoshop）独有的功能，它也成为 CSS 的一个非常重要的特性，我们可以使用 CSS 的 `filter` 特性来实现各种图像处理和特效效果。也就是说，你无需使用复杂的图形设计软件，就可以在 Web 上轻松地改变图像的外观和行为。

  


### CSS 的 filter 是什么

  


CSS 的 `filter` 属性对应着图形设计软件中的“滤镜”功能，允许 Web 开发人员对 HTML 元素的内容做一些特效处理，比如模糊、亮度调整、对比度增强、颜色转换等。例如，在某些特殊的场景下，希望将整个 Web 页面置灰，那么就可以使用 CSS 的 `filter` 来实现：

  


```CSS
html {
    filter: grayscale(100%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f122f64b9fe451baaef6a257e595cbb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2551&h=1222&s=971718&e=jpg&b=f4f4f4)

  


### 基本用法

  


首先，让我们来看看 `filter` 属性的基本用法。要应用 `filter` 属性，只需在 CSS 中选中一个元素，然后添加以下规则：

  


```CSS
.element {
    filter: <filter-value-list>;
}
```

  


其中 `<filter-value-list>` 是 CSS 的滤镜函数，它包括：

  


```
<filter-value-list> = <blur()> | <brightness()> | <contrast()> | <drop-shadow()> | <grayscale()> | <hue-rotate()> | <invert()> | <opacity()> | <sepia()> | <saturate()>
```

  


你可以使用一个或多个滤镜函数作为 `filter` 属性的值，例如：

  


```CSS
.element {
    filter: hue-rotate(30deg);
}

.element {
    filter: blur(5px) brightness(134%);
}
```

  


如果你在 `filter` 属性上使用多个滤镜函数，需要使用空格符将它们分隔开。另外，要是你错误地应用了一个滤镜函数，那么整个 `filter` 将会失去作用。

  


接下来，我们一起来看看这些滤镜函数所起的作用。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/189fe69934ec434bb6816a79f8ad3ec4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1300&s=1124671&e=jpg&b=141414)

  


> Demo 地址：https://codepen.io/airen/full/MWZvjMj

  


#### 模糊：blur()

  


模糊是一种常见的图像处理效果，可以用来创建柔和的外观和实现高斯模糊效果。你只需要往 `blur()` 函数中传递一个长度单位值，就可以轻松实现模糊效果。

  


```CSS
.element {
    filter: blur(10px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/673db9eeeebf433bb1f95f2da3d504dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=582&s=4608533&e=gif&f=136&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/ZEVJBQe

  


传给 `blur()` 函数的值是用于指定应用的模糊程度，需要注意的是，该参数的值只能使用长度单位（`<length>`）表示，不接受百分比作为参数，而且该值越大，其模糊程度就越高。

  


#### 亮度：brightness()

  


如果你需要给元素增加或减少亮度，那就可以使用 `brightness()` 函数。以下是如何使用 `brightness()` 函数的示例：

  


```CSS
.element {
    filter: brightness(80%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54079ef151fb4c2a822898b51409841d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=618&s=3570357&e=gif&f=268&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/yLGoVjo

  


其中不变的图像以 `100%` 的值表示，值为 `0%` 将图像完全变黑，因此在 `0% ~ 100%` 之间的值将使图像变暗，使用超过 `100%` 的值来增加亮度。

  


在使用 `brightness()` 函数改变元素亮度时，还可以使用小数值，比如上面示例中的 `80%` ，可以写为 `0.8` ：

  


```CSS
.element {
    filter: brightness(.8);
}
```

  


也就是说，`brightness()` 函数的参数值可以是任何数字，其中 `1` 表示原始亮度，大于 `1` 的值会增加亮度，小于 `1` 的值会降低亮度。

  


```CSS
.element {
    filter: brightness(0.7);
}
```

  


#### 对比度：contrast()

  


`contrast()` 函数可用来调整图像的对比度，你可以像下面这样使用 `contrast()` 函数：

  


```CSS
.element {
    filter: contrast(150%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33cf47ede8c04aa99e3a299af5d30f50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=586&s=3300531&e=gif&f=210&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/WNLEoaR

  


`contrast()` 函数的值为 `0%` 表示完全灰度图像，而值为 `100%` 表示原始对比度，大于 `100%` 时将增加图像的对比度。比如上面示例中的 `150%` 表示图像对比度增加到原始值的 `1.5` 倍。

  


`contrast()` 函数和亮度 `brightness()` 函数相似，其参数值可以是任何数字，其中 `1` 表示原始对比度，大于 `1` 的值会增加对比度，小于 `1` 的值会降低对比度。

  


```CSS
.element {
    filter: contrast(.7);
}
```

  


#### 灰度：grayscale()

  


`grayscale()` 函数可用于将图像转换为灰度图像。以下是如何使用 `grayscale()` 函数的示例：

  


```CSS
.element {
    filter: grayscale(1);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/294b96f1a6f34e0e82578814730f272f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=586&s=3915827&e=gif&f=184&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/NWevbod

  


在上面的示例中，`.element` 元素的图像将完全转换为灰度图像，参数值 `1` 表示完全灰度化。你可以使用从 `0` 到 `1` 的值来控制灰度的程度，`0` 表示没有灰度，`1` 表示完全灰度。

  


```CSS
.element {
    filter: grayscale(0.5);
}
```

  


在上面的示例中，`.element` 元素的图像被部分灰度化，参数值 `0.5` 表示将图像的颜色减弱一半。

  


```CSS
.element {
    filter: grayscale(0);
}
```

  


在上面的示例中，`.element` 元素的图像将取消灰度效果，即还原为彩色图像。

  


你还可以使用百分比值来实现部分灰度效果。如果不传递参数，元素将完全变为灰度。如果传递一个大于 `100%` 的值，它将被限制在 `100%`。

  


#### 反转：invert()

  


像灰度 `grayscale()` 函数一样，你可以将 `invert()` 函数的值设置为 `1` 或 `0` 来打开或关闭反转。其中参数值 `1` 表示完全反转（打开反转），`0` 表示没有反转（关闭反转），也可以使用从 `0 ~ 1` 之间的值来控制颜色反转的程度：

  


```CSS
.element {
    filter: invert(1);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83cd5b544d2545d591140e4aa4d1cb22~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=598&s=3753912&e=gif&f=200&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/OJrjbYX

  


`invert()` 函数的参数值也可以使用百分比值。如果不传递任何参数给 `invert()` 函数，反转完全打开。

  


#### 透明度：opacity()

  


`opacity()` 函数的工作方式类似于 CSS 的 `opacity` 属性，可用于调整元素的不透明度或透明度，你可以传递一个数字（`0 ~ 1` 之间的数字）或百分比（`0% ~ 100%` 之间的百分比值）来增加或减少不透明度，其中 `0` （或 `0%`）表示完全透明，`1` （或 `100%`）表示完全不透明。

  


```CSS
.element {
    filter: opacity(.5);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a17587c0fc9445196657889be6e6e12~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=916&h=614&s=1915651&e=gif&f=110&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/dywzNbx

  


注意，如果 `opacity()` 函数不传递任何参数，元素将保持完全可见状态。我们可以使用 `opacity()` 函数控制元素的透明度级别，使元素实现淡入淡出等效果。

  


#### 饱和度：saturate()

  


`saturate()` 与 `brightness()` 函数非常相似，并接受相同的参数类型：数字或百分比。不同之处在于，`saturate()` 用于增加或减少颜色的饱和度，而不是亮度。

  


```CSS
.element {
    filter: saturate(200%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea0ade7cf1e346938df7b23a42a0c5f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=616&s=1692828&e=gif&f=92&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/NWevdGg

  


在上面的示例中，`.element` 元素的图像饱和度被增加到原始饱和度的两倍。`saturate()` 函数的参数值可以是任何数字，其中 `100%` 表示原始饱和度，大于 `100%` 的值会增加饱和度，而小于 `100%` 的值会减少饱和度。

  


```CSS
.element {
    filter: saturate(50%);
}
```

  


在上面的示例中，`.element` 元素的图像饱和度被降低到原始饱和度的一半。

  


```CSS
.element {
    filter: saturate(0%);
}
```

  


在上面的示例中，`.element` 元素的图像饱和度被降低到 `0%`，将图像转换为完全的灰度图像。

  


#### 复古的棕褐色调：sepia()

  


你可以使用 `sepia()` 函数添加类似于 `grayscale()` 函数的棕褐色调效果。棕褐色调是一种摄影印刷技术，它将黑色调转换为棕色调以使图像变得温暖。你可以将数字或百分比作为 `sepia()` 的参数，从而增加或减少效果。如果不传递参数，将添加完整的棕褐色调效果（等同于 `sepia(100%)`）。以下是如何使用 `sepia()` 函数的示例：

  


```CSS
.element {
    filter: sepia(1);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e39ef4d3cf6e4a72bf5b5da46000070e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=598&s=2226320&e=gif&f=132&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/eYbEvep

  


  


在上面的示例中，`.element` 元素的图像被完全转换为复古的棕褐色调，参数值 `1` 表示完全应用 `sepia()` 效果。你可以使用从 `0 ~ 1` 的值来控制棕褐色调的程度，`0` 表示没有棕褐色调（彩色图像），`1` 表示完全棕褐。这个函数可用于创建复古或怀旧的图像效果。

  


#### 色调旋转：hue-rotate()

  


[在学习 CSS 颜色函数的使用过程中](https://juejin.cn/book/7223230325122400288/section/7231515598088306720)，学到了 `hsl()` 中的色相是指颜色轮的旋转。滤镜的 `hue-rotate()` 函数的工作方式与 `hsl()` 函数相似。`hue-rotate()` 函数可用于旋转图像的色相。

  


```CSS
.element {
    filter: hue-rotate(45deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e1390075ef24fa9b387e807e8b0d8f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=648&s=4040947&e=gif&f=146&b=201c1d)

  


> Demo 地址：https://codepen.io/airen/full/xxmLqpq

  


可以给 `hue-rotate()` 函数传递一个角度，如 `deg` 、`rad` 、`turn` 或 `grads` 等，它会改变元素所有颜色的色相，从而改变了它所参考的颜色轮的部分。如果不传递任何参数，它将不产生任何效果。这个函数可用于改变图像的色调，创建丰富多彩的效果。

  


#### 投影：drop-shadow()

  


`drop-shadow()` 函数和 CSS 的 `box-shadow` 或 `text-shadow` 属性非常相似，可以为元素应用一个紧贴曲线的阴影。

  


`drop-shadow()` 投影实际上是输入图像的 Alpha 蒙板的一个模糊、偏移的版本，用特定的颜色绘制并合成在图像下面。简单地说，`box-shadow` 在元素的整个框后面创建一个矩形阴影，而 `drop-shadow()` 过滤器则是创建一个符合图像本身形状（Alpha 通道）的阴影。

  


```CSS
.box-shadow {
    box-shadow: 5px 5px 5vmin 5vmin rgb(250 20 20 / 0.5);
}

.drop-shadow {
    filter: drop-shadow(5px 5px 5vmin rgb(250 20 20 / 0.5));
}
```

  


`drop-shadow()` 函数接受一个 `shadow` 参数，其中包含空格分隔的 `offset-x`、`offset-y`、`blur` 和`color` 值。它与 `box-shadow` 几乎相同，但不支持 `inset` 关键字和 `spread` 值。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a95faaabdde47f98dc9ab8ca106ecbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=718&s=7291610&e=gif&f=312&b=1f1b1c)

  


> Demo 地址：https://codepen.io/airen/full/BavdWGb

  


`drop-shadow()` 函数的参数可以根据需要组合使用，以创建不同的阴影效果。这个函数非常有用，可以用于为元素添加立体感或突出显示。

  


`drop-shadow()` 同样有多阴影的概念，只是使用方法和 `text-shadow` 、`box-shadow` 不同，即在 `filter` 属性使用多个 `drop-shadow()` 函数，并且以空格符隔开。

  


```CSS
.parent-element {
    filter: 
        drop-shadow(10rem 0 0 rgb(0 30 200 / 0.8)) 
        drop-shadow(-10rem 0 0 rgb(0 30 200 / 0.8)) 
        drop-shadow(20rem 0 0 rgb(0 30 200 / 0.8)) 
        drop-shadow(-20rem 0 0 rgb(0 30 200 / 0.8));
    transition: filter 600ms;
}

.parent-element:hover {
    filter: drop-shadow(0 0 0 rgb(0 30 200 / 0.8));
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b43e660347e4cb3806454bbf5a1ad67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1352&h=440&s=2036418&e=gif&f=161&b=391ad2)

  


> Demo 地址：https://codepen.io/airen/full/BavdRoX

  


需要注意的是，即使使用相同的参数，`drop-shadow()` 并不会渲染与 `box-shadow` 完全相同的阴影效果。当使用相同的值时，`box-shadow` 通常会产生更暗、更重的阴影效果，而 `drop-shadow()` 则不然。我怀疑这与 CSS 滤镜是基于 SVG 滤镜的事实有关。无论如何，你可能需要通过调整 `drop-shadow()` 的值来弥补这种差异。

  


#### 引用外部文件：url()

  


`url()` 滤镜允许你从链接的 SVG 元素或文件中应用 SVG 滤镜，让其作为滤镜效果的一部分。例如：

  


```HTML
<figure>
    <img src="filter.png" alt="" />
</figure>

<!-- SVG Filter effect -->
<svg xmlns="http://www.w3.org/2000/svg">
    <defs>
        <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
            <feGaussianBlur stdDeviation="3 10" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
            <feMorphology operator="erode" radius="3 3" x="0%" y="0%" width="100%" height="100%" in="blur" result="morphology" />
            <feTurbulence type="turbulence" baseFrequency="0.015 0.1" numOctaves="2" seed="2" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence" />
            <feColorMatrix type="saturate" values="5" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="colormatrix1" />
            <feDisplacementMap in="SourceGraphic" in2="colormatrix1" scale="20" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" result="displacementMap" />
        </filter>
    </defs>
</svg> 
```

  


```CSS
figure {
    filter: url("#filter");
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acd157bd3f9246ac99ec3b39722dfb72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=943&s=205858&e=jpg&b=251f21)

  


> Demo 地址：https://codepen.io/airen/full/jOXLmVr

  


如果你引用的是外部的 SVG 文件作为滤镜效果的一部分，那么你可以像下面这样使用：

  


```CSS
.element {
    filter: url('filter.svg#filter-id');
}
```

  


在上面的示例中，`.element` 元素将应用一个名为 `filter-id` 的外部滤镜效果，这个滤镜效果定义在名为 `filter.svg` 的外部 SVG 文件中。你可以在 SVG 文件中定义各种自定义滤镜效果，然后在 CSS 中使用 `url()` 函数引用它们。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a88add43b8dd45778ccc0bbde4543b7d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=548&s=6416774&e=gif&f=198&b=f4f3f3)

  


> SVG Filters：https://yoksel.github.io/svg-filters/#/

  


这种方式允许你创建复杂的自定义滤镜效果，并将它们应用于元素，以改变其外观。

  


### 复合效果

  


CSS 的 `filter` 属性允许你同时应用多个滤镜函数，以改变元素的外观。这些滤镜函数以空格分隔并按顺序应用。

  


```CSS
.element {
    filter: grayscale(50%) brightness(120%) blur(3px);
}
```

  


在上面的示例中，`.element` 元素同时应用了三个不同的滤镜函数：`grayscale()`、`brightness()`和`blur()`。它们按照指定的顺序依次应用。首先，元素被转化为 `50%` 的灰度，然后亮度增加到 `120%`，最后应用了 `3px` 的模糊效果。

  


你可以按照自己的需求组合和调整滤镜函数，以创建各种不同的效果。这使得可以轻松地调整图像的外观，添加动态效果或创建视觉特效。只需确保在 `filter` 属性中按正确的顺序列出所需的滤镜函数即可。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/490ab4db377c4a8092a46f6839aef886~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=540&s=7367227&e=gif&f=403&b=292929)

  


> Demo 地址：https://codepen.io/airen/full/OJrjjMZ

  


### 实际示例

  


现在让我们来看看一些实际应用示例，以展示 `filter` 属性如何改善 Web 设计和用户界面。

  


#### 图像遮罩

  


通过将亮度、饱和度和对比度滤镜组合在一起，你可以为图像创建遮罩效果，使文本更易于阅读。

  


```CSS
.card__background {
    filter: brightness(0.75) saturate(1.2) contrast(0.85);
    transition: filter 200ms linear, transform 200ms linear;
}

.card-grid:has(.card:hover) .card:not(:hover) {
    filter: brightness(0.5) saturate(0) contrast(1.2) blur(20px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b29fad44b53c4e8ab112f2439efb7724~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=448&s=14490428&e=gif&f=127&b=125876)

  


> Demo 地址：https://codepen.io/airen/full/gOZxxMe

  


#### 图像悬浮效果

  


使用 `filter` 属性可以在悬浮时应用特效，比如色调旋转或调整图片色彩饱和度：

  


```CSS
.rgb-first {
    opacity: 0;
    filter: hue-rotate(230deg);
    transition: 0.5s ease all;
    will-change: opacity, filter;
}

.rgb-second {
    opacity: 0;
    filter: saturate(164%);
    transition: 0.7s ease all;
    will-change: opacity, filter;
}

.rgbize:hover .rgb-first{
    opacity: 0.8;
    will-change: opacity;
}

.rgbize:hover .rgb-second{
    opacity: 0.6;
    will-change: opacity;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff51d0ee78fe417096a305bfd6cf7736~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1286&h=402&s=6677302&e=gif&f=144&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/wvRqRLb

  


#### 调整产品图片色彩

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a43a0590acf4423daa079d8baa1117cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=943&s=148544&e=jpg&b=073f54)

  


假设你有一张像上图一样的产品图原稿，你可以使用组合滤镜调试出不同风格的产品图。这样一来可以节省图片的使用率：

  


```CSS
@layer filter {
    :is(.btn, .text,.car__bodywork) {
        --hue: 0deg;
        filter: sepia() saturate(1000%) hue-rotate(var(--hue));
    }
    
    :is(.btn--color-1, .text-color-1, .car__color-1) {
        --hue: 60deg;
    }
    
    :is(.btn--color-2, .text-color-2, .car__color-2) {
        --hue: 120deg;
    }
    
    :is(.btn--color-3, .text-color-3, .car__color-3) {
        --hue: 180deg;
    }
  
    :is(.btn--color-4, .text-color-4, .car__color-4) {
        --hue: 240deg;
    }
    
    :is(.btn--color-5, .text-color-5, .car__color-5) {
        --hue: 300deg;
    }
    
    :is(.btn--color-6, .text-color-6, .car__color-6) {
        --hue: 360deg;
    }
  
  .btn--light {
    filter: invert(100%);
  }
}
```

  


上面代码首先使用 `sepia()` 函数给图片添加完整的棕褐色、然后使用 `saturate()` 函数给图片增加饱和度，最后使用 `hue-rotate()` 函数调整图片的色相。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/340aaa49ccd549d1b32016343c2e873e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=724&s=6874972&e=gif&f=212&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/xxmLMKL

  


#### 导航菜单

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edc1c95a0d34447181654108c2e57107~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=886&h=390&s=410811&e=gif&f=124&b=fefcfc)

> Demo 地址：https://codepen.io/airen/full/PoXKVjM

  


上面示例中，导航面板和底下彩色阴影效果都是使用 `filter` 来实现的：

  


```CSS
.phone_content {
    filter: contrast(20);
}

.phone_bottom {
    filter: blur(10px);
}
```

  


注意，这个效果也离不开其他元素上的样式。比如导航菜单底下的彩色模糊的彩色阴影效果，它需要下面这段代码衬托：

  


```CSS
.phone::before {
    box-shadow: 
        0 0 25px 9px rgb(255 0 0 / 0.33),
        50px 10px 25px 8px rgb(18 255 0 / 0.33),
        -40px 8px 25px 9px rgb(242 255 0 / 0.33);
}
```

  


#### Gooey 效果

  


我们可以使用 `filter` 的 `blur()` 和 `contrast()` 函数实现 Gooey 效果（一种融合的效果）。其中，`blur()` 给图像设置高斯模糊效果， `contrast()` 调整图像的对比度，当他们“合体”的时候，产生了奇妙的融合现象。

  


```CSS
@layer gooey {
    @keyframes move {
        50% {
            translate: 0 0;
        }
    }
    
    .container {
        filter: blur(10px) contrast(30);

        
        &::before,
        &::after {
          --size: 80px;
          animation: move 4s ease-out infinite;
        }
        
        &::before {
          --size: 120px;
          background: linear-gradient(
              to bottom left in oklab, 
              oklch(55% .45 350) 0%, oklch(100% .4 95) 100%
          );
          translate: -200px 0;
        }
        
        &::after {
          background: conic-gradient(
              from 0deg at 0% 0% in oklch, 
              oklch(75% 0.5 156) 0%, oklch(70% 0.5 261) 100%
          );
          translate: 200px 0;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2ba1ca3840449c081d5eb8667c008fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1008&h=442&s=1703595&e=gif&f=153&b=4b4a6a)

  


> Demo 地址：https://codepen.io/airen/full/NWevoLr

  


使用相似的方法，使文本带有一种融合的动画效果：

  


```HTML
<div class="container">
    <h1>Awesome!</h1>
</div>
```

  


```CSS
.container {
    filter: contrast(20);
}

h1 {
    filter: blur(0.5rem);
    animation: letterspacing 10s infinite alternate cubic-bezier(0.2, 0, 0, 1);
}

@keyframes letterspacing {
    0% {
        letter-spacing: -5rem;
        filter: blur(0.5rem);
    }

    50% {
        filter: blur(0.5rem);
    }

    100% {
        letter-spacing: 1rem;
        filter: blur(1.5rem);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27cf187fa3bf4c3f913832d897371ab2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=468&s=2195061&e=gif&f=310&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/jOXLddB

  


其实，你还可以使用 `filter` 的 `url()` 函数和 SVG 的滤镜结合起来制作 Gooey 效果，效果会更好，而且更简单。例如：

  


```HTML
<div class="wrapper">
    <a class="button" href="#">Hover me!</a>
</div>

<svg style="visibility: hidden; position: absolute;" width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
        <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />    
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
        </filter>
    </defs>
</svg>
```

  


```CSS
.wrapper {
    filter: url('#goo');
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5e811f5d36a4f8f8b61bc8030537c7c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=372&s=144482&e=gif&f=102&b=161a1e)

  


> Demo 地址：https://codepen.io/airen/full/KKbvJYq

  


正如你看到的，CSS 的 `filter` 属性为 Web 设计和前端开发提供了强大的图像处理和特效功能。通过简单的 CSS 代码，你可以实现各种视觉效果，从模糊到对比度调整，再到颜色反转。希望这些示例能帮助你更好地理解如何使用 `filter` 属性，为你的 Web 设计和用户界面增加创意和吸引力。不断尝试和实验，发掘更多可能性，让你的网站更加引人注目！

  


## CSS 的 filter() 函数

  


首先要明确一点的是，`filter()` 是 CSS 的一个函数，同时也是一个属性值，而 `filter` 是 CSS 的一个属性。

  


`filter()` 函数在“[滤镜效果规范](https://www.w3.org/TR/filter-effects/#FilterCSSImageValue)”中有定义：

  


```
filter() = filter( [ <image> | <string> ], <filter-value-list> )
```

  


该函数接受两个参数，第一个参数是 `<image>` ，第二个参数与 CSS 的 `filter` 属性指定的滤镜函数列表（`<filter-value-list>`）。它可以将 `<image>` 参数应用 CSS 滤镜规则，并返回一个处理后的图像。然后，这个图像可以与接受图像的任何属性一起使用。

  


你或许会感到困惑，`filter()` 会出现在什么地方？或者说，我们应该在什么时候，什么地方使用 `filter()` 函数。想象一下，我们在开发 Web 应用的时候，有时并不想在元素本身上应用滤镜（`filter`），而只是希望在背景上应用滤镜。可是，在 CSS 中并没有一个像 `background-filter` 的属性存在。这就是 `filter()` 函数可能派上用场的地方。

  


来看一个简单的示例：

  


```CSS
.element {
    background: filter(url("filter.jpg"), blur(5px));
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6acfc8752187468294e74e04f49493aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=600&s=10293989&e=gif&f=130&b=1f2526)

  


> Demo 地址：https://codepen.io/airen/full/NWevmpE （请使用 Safari 查看 Demo）

  


因此，你现在可以在背景图上应用滤镜，你也可以将其视为 `background-filter` 、 `background-opacity` 或 `background-blur` 等。

  


```CSS
:root {
    --bg: url("filter.png");
    --background-blur: filter(var(--bg), blur(10px));
    --background-brightness: filter(var(--bg), brightness(80%));
    --background-contrast: filter(var(--bg), contrast(150%));
    --background-grayscale: filter(var(--bg), grayscale(1));
    --background-invert: filter(var(--bg), invert(1));
    --background-opacity: filter(var(--bg), opacity(.5));
    --background-saturate: filter(var(--bg), saturate(200%));
    --background-sepia: filter(var(--bg), sepia(1));
    --background-hue-rotate: filter(var(--bg), hue-rotate(45deg));
    
    background: var(--bg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c195edf89fe54dce96344291e4ab9105~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=943&s=1047741&e=jpg&b=565875)

  


> Demo 地址：https://codepen.io/airen/full/BavdEmO （请使用 Safari 浏览器查看）

  


注意：由于原始图像的尺寸和起点必须保留，因此某些滤镜效果，如对完全不透明图像的 `<drop-shadow()>` ，可能没有任何效果。

  


### filter 属性与 filter() 函数的差异

  


刚才也提到了，`filter` 和 `filter()` 两者最大的差异是：

  


-   `filter` 是一个 CSS 属性，它可以应用在任何元素上
-   `filter()` 是一个 CSS 函数，而且是一个属性值，它只能运用于值为 `<image>` 类型的属性上，比如 `background-image`

  


另外一个差异是，`filter` 属性会影响元素的后代元素，而 `filter()` 则不会。例如：

  


```HTML
<figure class="filter">
    <p>CSS Filter Property</p>
</figure>

<figure class="filter">
    <p>CSS Filter Function</p>
</figure>    
```

  


```CSS
@layer filter {
    figure {
        --bg: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/153385/jpgls-leaf.jpg");
        --filter: 
            blur(2px) 
            brightness(80%) 
            contrast(150%) 
            grayscale(1) 
            invert(1)
            opacity(0.5) 
            saturate(200%) 
            sepia(1) 
            hue-rotate(45deg);
        background-color: rgb(0 0 0 / 0.25);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    
        &:nth-child(1) {
            background-image: var(--bg);
            filter: var(--filter);
        }
    
        &:nth-child(2) {
            background-image: filter(var(--bg), var(--filter));
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd8659c1a2014241b91e06dbd9dae5af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=943&s=420628&e=jpg&b=555673)

  


> Demo 地址：https://codepen.io/airen/full/vYvJMMr （请使用 Safari 浏览器查看）

  


## CSS 混合模式（Blend Mode）

  


在现代 Web 设计中，我们经常追求超越传统的颜色、图像和文本排列的平凡效果。我们寻求的是创造性和视觉上令人愉悦的用户体验。这就是 CSS 混合模式（CSS Blend Mode）的力量所在。

  


### CSS 混合模式是什么？

  


[维基百科是这样描述混合模式的](https://en.wikipedia.org/wiki/Blend_modes)：“混合模式（或称为混合方式）在数字图像编辑和计算机图形中用于确定两个图层如何混合在一起。大多数应用程序中的默认混合模式是通过顶部层上的内容覆盖底部图层以隐藏底部图层”。

  


混合模式通过在设计工具中使用，比如 Photoshop、Sketch 或 Figma：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/affb4f4e71da4b5786d126e0cd48cc81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=943&s=530148&e=jpg&b=f0eeed)

  


通过混合两个或更多图层的颜色来创建一种合成效果。通过改变颜色的混合方式，你可以实现非常有趣的视觉效果。

  


CSS 混合模式（CSS Blend Mode）是一种用于控制 HTML 元素之间颜色混合的技术。它允许你定义两个或多个元素之间的颜色交互，从而创建各种视觉效果。其基本原理是，它定义了如何将一个元素的颜色与另一个元素的颜色进行混合，从而创建新的颜色效果。这些混合模式是基于图形设计工具中的同名功能而来，使 Web 开发者能够在 Web 设计或开发中实现更多的创意和复杂效果。

  


你可以在 CSS 中使用 `mix-blend-mode` 或 `background-blend-mode` 属性可以应用设计工具中的大多数混合模式。其中，`mix-blend-mode` 将混合应用于整个元素，它将会影响整个元素，包括其伪元素及其后代元素；而 `background-blend-mode` 将混合应用于元素的背景。

  


总之，CSS 混合模式是一项强大的技术，它可以应用于文本、图像、背景和其他 HTML 元素，使它们在呈现时以不同的方式混合其颜色。它可用于改善 Web 应用或网站的外观和用户体验，并允许开发者实现各种创意和艺术效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d8f1ddd83c64f97ba09880114d3b876~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1633&s=2180523&e=jpg&b=f8f2f1)

  


### CSS 混合模式分类

  


CSS 混合模式可以按不同的方式分类。如果按照 CSS 属性的使用方式来分的话，它主要分为 `mix-blend-mode` 和 `background-blend-mode` ：

  


-   `mix-blend-mode` 用于 HTML 元素上，将混合应用于整个元素，它将会影响整个元素，包括其伪元素及其后代元素；
-   `background-blend-mode` 将混合应用于元素的背景

  


如果不按属性来分，它可以分为**可分离**和**不可分离**两种类型：

  


-   可分离的混合模式将每个颜色分量（如 RGB）单独考虑，其包括 `normal` 、`multiply` 、`screen` 、`overlay` 、`darken` 、`lighten` 、`color-dodge` 、`color-burn` 、`hard-light` 、`soft-light` 、`difference` 和 `exclusion`
-   不可分离的混合模式将所有颜色分量平等考虑，其包括 `hue` 、`saturation` 、`color` 和 `luminosity`

  


其次可以按照设计软件中的混合模式来分类：

  


-   `normal` ，混合模式的默认值，表示没有任何混合效果
-   变暗模式，主要包括 `darken` 、`multiple` 和 `color-burn`
-   变亮模式，主要包括 `lighten` 、`screen` 和 `color-dodge`
-   调整对比度模式，主要包括 `overlay` 、`soft-light` 和 `hard-light`
-   反色模式，主要包括 `difference` 和 `exclusion`
-   更改单个 HSL 模式，主要包括 `hue` 、`saturation` 、`luminosity` 和 `color`

  


每种混合模式都有其特定的用途和效果，开发者可以根据需要选择合适的混合模式来实现不同的视觉效果。

  


### CSS 混合模式的使用与基础原理

  


不管是使用 `mix-blend-mode` 对元素进行混合，还是使用 `background-blend-mode` 对元素背景层进行混合，它们都需要有多个元素（或层）进行混合，至少需要两个元素（或层）进行混合。这是因为混合模式是一种根据两种输入颜色创建新颜色的方式，因此，层次结构对我们计算新颜色的方式很重要。例如：

  


```HTML
<div class="card mix-blend-mode">
    <img src="middle.png" />
</div>

<div class="card background-blend-mode">
</div>
```

  


```CSS
.card {
    width: 300px;
    aspect-ratio: 3 / 4;

    
    & img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
}

.mix-blend-mode {
    position: relative;
    
    &::before,
    &::after {
        content:"";
        position: absolute;
        inset: 0;
    }
    
    /* 顶层是一个渐变层 */
    &::before {
        background: linear-gradient(225deg in oklab,oklch(70% 0.5 340) 0%,oklch(90% 0.5 200) 91% 91%);
        z-index: 3;
    }
    
    /* 中间层是一张图片 */
    & img {
        position: relative;
        z-index: 2;
    }
    
    /* 底层是一个纯色 */
    &::after {
        background: hsl(2400 60% 50%);
        z-index: 1;
    }
}

.background-blend-mode {
    --bg-top:linear-gradient(225deg in oklab,oklch(70% 0.5 340) 0%,oklch(90% 0.5 200) 91% 91%);
    --bg-middle: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/153385/jpgls-leaf.jpg");
    --bg-bottom: hsl(240 60% 50%);
      
    background: var(--bg-top) no-repeat left top, var(--bg-middle) no-repeat center;
    background-color: var(--bg-bottom);
    background-size: cover;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76ca08fec9a44963b423b6db7e254553~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1347&s=573321&e=jpg&b=000000)

  


接下来，我们来看一下在顶层和中间层使用不同的混合模式的效果，从而了解混合模式每个值所起的作用。

  


#### 正片叠底：multiply

  


正片叠底混合模式就像将多个透明图层叠放在一起。白色像素将变为透明，而黑色像素将保持为黑色。介于两者之间的颜色将会相乘其亮度（光）值。这意味着亮色会变得更亮，而暗色会变得更暗，通常会产生较暗的结果。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: multiply;
    }
}

.background-blend-mode {
    background-blend-mode: multiply;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49c75366ec4c41738f933b09a9df7ef1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=642&s=4844842&e=gif&f=140&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/BavwjYO

  


正如你所看到的，正片叠底混合模式（`multiply`）简单地将每个颜色通道的值相乘。由于这些值在 `0` 和 `1` 之间进行了归一化，因此其乘积始终比原始值更暗：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8c7f28eb5c94963be1270be79993763~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=811&s=180264&e=jpg&b=f4f4f6)

  


在这种模式下，计算每个颜色通道（红、绿、蓝）的新值，新值等于相应颜色通道的两个输入值相乘。例如，如果一个像素的背景颜色通道为 `0.5`（半亮度），前景颜色通道为 `0.8`（较亮），则计算结果为 `0.5 x 0.8 = 0.4`。这个过程针对每个颜色通道分别进行，得到新的 RGB 值。

  


#### 屏幕：screen

  


屏幕混合模式（`screen`）实际上与正片叠混合模式（`multiply`）相似，但它反转了输入和结果，因此它的效果与正片叠底效果相反，通常会产生更亮的结果。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: screen;
    }
}

.background-blend-mode {
    background-blend-mode: screen;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fcc58ef381a46e994bc0fa95a5cf531~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=630&s=3481321&e=gif&f=97&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/bGOoEPJ

  


使用屏幕混合模式会将亮度值相乘。同样，我们需要将这些值归一化在 `0` 和 `1` 之间来计算。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/817b6f7489124f4aa822eb28a5033966~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=896&s=253756&e=jpg&b=f4f4f6)

  


在这种模式下，计算每个颜色通道的新值，新值等于 `1` 减去相应颜色通道的两个输入值相乘。这相当于将颜色通道的亮度反转，使其变得更亮。例如，如果一个像素的背景颜色通道为 `0.5`，前景颜色通道为 `0.8` ，则计算结果为`1 - (0.5 x 0.8) = 0.6`。同样，这个过程针对每个颜色通道分别进行，得到新的 RGB 值。

  


#### 叠加：overlay

叠加混合模式（`overlay`）将正片叠底（`multiply`）和屏幕（`screen`）两种模式结合起来。基础（背景层）的深色变得更深，而基础（背景层）的浅色变得更亮。中间范围的颜色，比如 `50%` 的灰色，不受影响。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: overlay;
    }
}

.background-blend-mode {
    background-blend-mode: overlay;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/967e09e6599f409eb9117cfffd397270~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=622&s=5301069&e=gif&f=177&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/ExGwKxW

  


叠加混合模式（`overlay`）共实是很有趣的。如果背景值较亮（`> 127.5`），则它会以一半的强度应用屏幕混合（`screen`），使前景变得更亮；如果背景值较暗（ 小于或等于 `127.5`），则它会以一半的强度应用正片叠底混合（`multiply`），使前景变得更暗。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dccb46679d234ec1aba3769aded40aa2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=896&s=213453&e=jpg&b=f4f4f6)

  


叠加混合模式（`overlay`）的计算方法如下：

  


-   如果背景颜色通道值大于 `0.5`（通常用 `255` 的一半来表示，即 `127.5`），则将背景颜色通道值减去 `0.5`，然后将结果与前景颜色通道值相乘，得到新的颜色通道值。
-   如果背景颜色通道值小于或等于 `0.5` （通常用 `255` 的一半来表示，即 `127.5`），则将背景颜色通道值加上 `0.5`，然后将结果与前景颜色通道值相乘，得到新的颜色通道值。

  


这个计算过程分别针对每个颜色通道（红、绿、蓝）进行，得到新的 RGB 值。这样，`overlay` 混合模式会根据背景颜色的亮度来选择是应用正片叠底（使颜色变暗）还是应用屏幕（使颜色变亮），从而产生一种同时调整亮度和对比度的效果。

  


#### 变暗：darken

  


变暗混合模式（`darken`）会比较前景层与背景层的暗色亮度，并选择两者中最暗的部分。它通过比较每个颜色通道的 RGB 值而不是亮度（与正片叠和屏幕混合模式不同）来实现这一点。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: darken;
    }
}

.background-blend-mode {
    background-blend-mode: darken;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d47e63a3f8684606b02c78e237f49e5d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=614&s=2896741&e=gif&f=117&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/yLGzOoa

  


变暗混合模式（`darken`）是根据每个颜色通道的 RGB 值进行计算的：

  


-   对于每个颜色通道（红、绿、蓝），比前景层和背景层相应颜色通道的 RGB 值
-   选择两者中较小的 RGB 值作为新的颜色通道值
-   使用新的 RGB 值为创建新的颜色，这个颜色通常会比原来的颜色更暗

  


简单地说，`darken` 会比较每个颜色的 RGB 值并选择最暗的值，从而创建一个新的颜色。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d151556b755b4e93b7744662d14ddfe1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=896&s=185696&e=jpg&b=f4f4f6)

  


这个计算过程分别针对每个颜色通道进行，从而实现了变暗混合模式（`darken`）。它会选择每个颜色通道中更暗的像素值，以创建一个新的颜色，使图像中的颜色更加深沉。

  


#### 变亮：lighten

  


变亮混合模式（`lighten`）刚好与变暗混合模式（`darken`）相反：

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: lighten;
    }
}

.background-blend-mode {
    background-blend-mode: lighten;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d8724acf4814b0b9892afd7396d9f29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=612&s=3895410&e=gif&f=130&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/ExGwKoo

  


变亮混合模式（`lighten`）做的事情与变暗混合模式（`darken`）完全相同，只是它选择了最亮的值。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/387ebbb0da344b24a5ad401cc2224096~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1086&s=215063&e=jpg&b=f3f3f6)

  


这个计算过程分别针对每个颜色通道进行，从而实现了变亮混合模式。它会选择每个颜色通道中更亮的像素值，以创建一个新的颜色，使图像中的颜色更加明亮。

  


#### 颜色加深：color-burn

  


颜色加深混合模式（`color-burn`）与正片叠底混合模式（`multiply`）非常相似，但它增加了对比度，导致中间色调更饱和，同时减少了亮光部分。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: color-burn;
    }
}

.background-blend-mode {
    background-blend-mode: color-burn;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5f5071112894415b9c03a547eead091~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=630&s=4831102&e=gif&f=224&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/poqWyLN

  


颜色加深混合模式（`color-burn`）的工作方式是反转背景，将其除以前景，然后反转结果：

  


-   针对每个颜色通道（红、绿、蓝），首先反转背景层的颜色通道值
-   然后将反转后的背景层颜色通道值除以前景层的颜色通道值
-   最后，再次反转结果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/632a5695000f423a8c3a341b289dd81b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=275580&e=jpg&b=f4f4f6)

  


这个计算过程会导致颜色加深，尤其是在中间色调和阴影部分，从而增加了对比度并提高了颜色的饱和度。高光部分通常会减少。这使得图像中的阴影区域变得更加突出，但可能会损失一些亮度。这就是颜色加深混合模式的效果。

  


#### 颜色减淡：color-dodge

  


如果使用颜色减淡混合模式（`color-dodge`），它会将背景层颜色变亮以反映前景层颜色。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: color-dodge;
    }
}

.background-blend-mode {
    background-blend-mode: color-dodge;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/184d0726578e422194f0077034b2def0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=618&s=3803419&e=gif&f=175&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/GRPMZdb

注意，纯黑色颜色不受颜色减淡模式（`color-dodge`）影响。

  


CSS 混合模式中的颜色减淡模式（`color-dodge`）是通过以下计算方式实现的：

  


-   对于每个颜色通道（红、绿、蓝），首先反转前景（源）层的颜色通道值，然后将背景层的颜色通道值除以反转后的前景层的颜色通道值
-   这个计算将导致背景颜色变亮，以反映前景颜色。颜色通道值越接近白色的地方，变化越明显，而对于纯黑色颜色通道值，不会产生变化
-   使用新的颜色通道值来创建新的颜色，这个颜色通常比原来的颜色更亮

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7e9efc215564f3f92923e7bab794a44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=246716&e=jpg&b=f4f4f6)

  


这个计算过程分别针对每个颜色通道进行，从而实现了颜色减淡混合模式，它将背景颜色变亮，以反映前景颜色。

  


注意，颜色加深混合模式（`color-burn`）和颜色减淡混合模式（`color-dodge`）具有明显的阶梯效应，它们可能产生相当强烈的效果。

  


#### 硬光：hard-light

  


使用硬光混合模式（`hard-light`）会产生鲜明的对比效果。这种混合模式要么进行屏幕混合（`screen`），要么进行正片叠底混合（`multiply`）。如果像素值比 `50%` 灰色更轻，则图像会变亮，就像进行了屏幕混合一样。如果像素值比 `50%` 灰色更暗，则会进行正片叠底混合。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: hard-light;
    }
}

.background-blend-mode {
    background-blend-mode: hard-light;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae4359a50f754aca8ef0c27c10cac78b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=608&s=5304833&e=gif&f=171&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/gOZGrBY

  


在 CSS 混合模式中，硬光混合模式（`hard-light`）的计算方式如下：

  


-   如果前景颜色（前景图像的颜色）的值大于 `127.5`（`50%`灰度），则将前景颜色应用于屏幕混合模式，以一半的强度
-   如果前景颜色的值小于或等于 `127.5`，那么将前景颜色应用于正片叠底混合模式，以一半的强度

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a987fbfee2bf497b948c6586ef4d8e4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=247722&e=jpg&b=f4f4f6)

  


这个计算方式会根据前景颜色的亮度来决定是应用屏幕混合还是正片叠底混合，从而产生鲜明的对比效果。如果前景颜色较亮，则会增强图像的亮度，而如果前景颜色较暗，则会增强图像的暗部。这使得图像中的细节更加突出，同时保留了一定的对比度。

  


#### 柔光：soft-light

  


柔光混合模式（`soft-light`）是标准混合模式中最复杂的一种。它产生的效果类似于叠加混合模式（`overlay`），但更加微妙（对比度较低）。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: soft-light;
    }
}

.background-blend-mode {
    background-blend-mode: soft-light;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a9b996353484287b18108c2ad62b0f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=644&s=3481270&e=gif&f=120&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/YzdrGpV

  


在 CSS 混合模式中，柔光混合模式（`soft-light`）的计算方式如下：

  


-   将前景翻倍，并反转它
-   将反转后的前景与背景的平方相乘
-   将上述结果乘以 `2`，并将其添加到前景和背景的乘积的两倍上

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c2145249e3b46b29fe763ad0e67dad4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2141&s=538271&e=jpg&b=f4f4f6)

  


这个计算方式会产生一种比叠加混合模式更为柔和的效果，保留了图像的细节，但降低了对比度。它常用于创建柔和的照明效果或给图像增加一些微妙的变化。

  


#### 差异：difference

  


差异混合模式（`difference`）的工作方式可以类比为照片底片的效果。它会取每个像素的差异值，反转亮色。如果颜色值相同，则变为黑色。它会在输入颜色之间找到一种颜色。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: difference;
    }
}

.background-blend-mode {
    background-blend-mode: difference;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c27311ade23d459e8084d07166e80f61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=594&s=5943033&e=gif&f=128&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/mdaBrpp

  


差异混合模式（`difference`）会将底部颜色从顶部颜色中减去，任何负数都会变为正数。这个过程产生了一种颜色，该颜色位于输入颜色之间，并突出它们之间的差异。具体计算方式如下：

  


-   对比两个输入颜色的每个通道（红、绿、蓝）的值
-   从顶部（前景）颜色的通道中减去底部（背景）颜色的相应通道值
-   如果结果为负数，将其转换为正数
-   使用这些修改后的通道值创建新的颜色

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8590304b08e4555933731e360449dea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1174&s=259087&e=jpg&b=f4f4f6)

  


这种混合模式会产生一个颜色，该颜色位于输入颜色之间，并且突出它们之间的差异。如果两个输入颜色相同，结果将是黑色。如果它们有差异，结果将显示这些差异的颜色。这种混合模式用于突出图像中不同的部分，通常产生高对比度的效果。

  


#### 排除：exclusion

  


排除混合模式（`exclusion`）和差异混合模式（`difference`）非常相似，但不同之处在于，它不会对相同的像素返回黑色，而是返回 `50%` 的灰色，从而产生了更柔和、对比度较低的结果。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: exclusion;
    }
}

.background-blend-mode {
    background-blend-mode: exclusion;
}
```

  


> Demo 地址：https://codepen.io/airen/full/GRPMjBd

  


排除混合模式（`exclusion`）计算如下：

  


-   首先，将每个通道（红、绿、蓝）的颜色值标准化为介于 `0` 和 `1` 之间的小数
-   对于每个通道，计算底图（背景）颜色值与顶图（前景）颜色值的乘积的两倍
-   将每个通道的乘积的两倍从每个通道的颜色值总和中减去
-   最后，将结果的每个通道的值重新标准化到 `0` 到 `1` 之间，以获得最终的混合颜色

  


简单地说，从每个通道的总和中减去每个通道的两倍乘积：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/314214d7f70b4cf2a41107c2b2dd4e89~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1174&s=354670&e=jpg&b=f4f4f6)

  


这个过程使得相同颜色的像素产生中性的混合颜色，不同颜色的像素则产生柔和的混合效果，相对于 `difference` 混合模式来说更加柔和。

  


注意，其中差异混合模式（`difference`）和排除混合模式（`exclusion`）也被称为反转混合模式，因为它们创建的颜色几乎是其中一个输入的相反色。这些混合模式通常用于图像中创建反向效果（类似照片底片效果）。

  


#### 色相：hue

  


色相混合模式（`hue`）将获取前景颜色的色调值，并将其应用于背景颜色的饱和度和亮度。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: hue;
    }
}

.background-blend-mode {
    background-blend-mode: hue;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79384820dc2e45d7a0c171871c37e312~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=612&s=5128939&e=gif&f=184&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/ZEVXpwb

  


它的计算步骤如下：

  


-   从前景颜色中提取色相值（Hue），保留前景颜色的饱和度（Saturation）和亮度（Luminosity）值
-   从背景颜色中提取饱和度和亮度值，保留背景颜色的色相值
-   将前景颜色的色调值应用到背景颜色的饱和度和亮度值上，形成新的颜色

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a3451d44f2842a897fac5d13385899b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1353&s=341546&e=jpg&b=f2f2f5)

  


这样，色相混合模式（`hue`）会改变背景颜色的饱和度和亮度，以匹配前景颜色的色调，从而产生一种新的混合颜色。这个模式通常用于调整颜色的整体外观，而不影响亮度和对比度。

  


#### 饱和度：saturation

  


饱和度混合模式（`saturation`）与色相混合模式（`hue`）类似，但饱和度混合模式（`saturation`）会采用前景颜色的饱和度值，同时使用背景颜色的色相和亮度值。即，将前景颜色的饱和度应用于背景颜色的色调和亮度。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: saturation;
    }
}

.background-blend-mode {
    background-blend-mode: saturation;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/742e761158474eed89441b8277187429~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=612&s=3379008&e=gif&f=166&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/zYyEoxN

  


它的计算步骤如下：

  


-   从前景颜色中提取饱和度值（Saturation），保留前景颜色的色相（Hue）和亮度（Luminosity）值
-   从背景颜色中提取色相和亮度值，保留背景颜色的饱和度值
-   将前景颜色的饱和度值应用到背景颜色的色相和亮度值上，形成新的颜色

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60f1661d48fc401babd369adec590640~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1353&s=339063&e=jpg&b=f4f4f6)

  


这种混合模式的计算方式是将前景颜色的饱和度应用到背景颜色的色相和亮度上。这样可以改变背景颜色的饱和度，使其与前景颜色更加相似。

  


#### 颜色：color

  


颜色混合模式（`color`）将基于前景颜色的色相（Hue）和饱和度（Saturation）以及背景颜色的亮度（Luminosity）创建一个新的颜色。

```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: color;
    }
}

.background-blend-mode {
    background-blend-mode: color;
}
```

  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efa708aac3d94ef3a1de496a759e9cad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=618&s=2861634&e=gif&f=121&b=000000)



  


> Demo 地址：https://codepen.io/airen/full/gOZGLPZ

  


它的计算步骤如下：

  


-   从前景颜色中提取色相（Hue）和饱和度值（Saturation），保留前景颜色的亮度（Luminosity）值
-   从背景颜色中提取亮度值，保留背景颜色的色相和饱和度值
-   将前景颜色的色相和饱和度值应用到背景颜色的亮度值上，形成新的颜色

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c9b6b7e8bcc4be49cb7cc7ac022b513~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1353&s=337962&e=jpg&b=f4f4f6)

  


#### 亮度：luminosity

  


亮度混合模式（`luminosity`）与颜色混合模式（`color`）刚好相反。它将使用前景颜色的亮度值与背景颜色的色相和饱和度值创建新的颜色。

  


```CSS
.mix-blend-mode {
    &::before, > img {
        mix-blend-mode: luminosity;
    }
}

.background-blend-mode {
    background-blend-mode: luminosity;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57da11af01ae4b55923c7b651467f37a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=614&s=3904579&e=gif&f=140&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/gOZGLwq

  


它的计算步骤如下：

  


-   从前景颜色中提取亮度值（Luminosity），保留前景颜色的色相值（Hue）和饱和度值（Saturation）
-   从背景颜色中提取色相值和饱和度值，保留背景颜色的亮度值
-   将前景颜色的亮度值应用到背景颜色的色相值和饱和度值上，形成新的颜色

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6ffe50bb9784c56a34b35569f918047~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1353&s=341943&e=jpg&b=f4f4f6)

  


注意，色相混合模式（`hue`）、饱和度混合模式（`saturation`）、颜色混合模式（`color`）和亮度混合模式（`luminosity`）与其他混合模式不同，因为它们操作的是颜色的色相（Hue）、饱和度（Saturation）和亮度（Luminosity），而不是颜色的 RGB 通道值。

  


> **特别声明**：CSS 混合模式的计算是一个复杂的过程，W3C 规范详细阐述了它们是如何计算的，感兴趣的话，可以分别查看规范中的《[Introduction to compositing](https://www.w3.org/TR/compositing-1/#whatiscompositing)》和《[Advanced compositing features](https://www.w3.org/TR/compositing-1/#advancedcompositing)》。

  


上面向大家所呈现的是 CSS 混合模式最基础的应用。不过，我们需要知道的是，层次结构对混合模式最终的结果是有关键词影响的。就拿下面这个示例而言，图片在渐变层上面或下面，即使是使用相同的混合模式，最终结果也是不一样的：

  


```CSS
.card::before {
    mix-blend-mode: var(--blend-mode);
}

.card img {
    mix-blend-mode: var(--blend-mode);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c8dd5a1e9a044da981ffcb40864d522~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=634&s=8893963&e=gif&f=294&b=010101)

  


> Demo 地址：https://codepen.io/airen/full/yLGzgRq

  


 除此之外，在使用 CSS 混合模式时，还有一个细节需要注意。通过前面的学习，我们知道，在 CSS 中可以使用 `mix-blend-mode` 或 `background-blend-mode` 属性创建混合效果。虽然这两个属性的值是一样的，但它们的使用是有着本质上区别的。`mix-blend-mode` 应用于元素上，`background-blend-mode` 用于元素的背景层上。其中 `background-blend-mode` 很易于理解，也易于掌握，那是因为 `background-blend-mode` 仅影响元素的背景效果。可 `mix-blend-mode` 则不同，它会影响元素及其所有后代元素，所以我们在使用 `mix-blend-mode` 时要尤其注意。例如：

  


```HTML
<div class="container">
    <div class="card">
        <img src="https://picsum.photos/800/600?random=2" alt="">
        <h3>Modern CSS</h3>
        <p>CSS Blend Mode: mix-blend-mode</p>
    </div>
</div>
```

  


```CSS
.container {
    background-image: linear-gradient(
        to bottom left in oklab,
        oklch(55% 0.45 350) 0%,
        oklch(100% 0.4 95) 100%
    );
    
    .card {
        mix-blend-mode: var(--blend-mode, normal);
        background-color: #fff;
        border: 1px solid rgb(0 0 0 / 0.125);
        color: #f5f5f5;
        text-shadow: 1px 1px 0 rgb(0 0 0 / 0.25);
        
        &::before {
            background-color: color-mix(in oklch, #09f, transparent 60%);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbd7d9208aa04d16ba157d8a21a77cee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=546&s=6150500&e=gif&f=336&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYbGeRK

  


为了避免 `mix-blend-mode` 对其后代元素产生影响，需要对 HTML 结构做出相应的调整。比如下面这个示例：

  


```HTML
<div class="container">
    <div class="backdrop">
        <p class="shapes">🍃</p>
        <p class="shapes">🍂</p>
        <p class="shapes"></p>
    </div>
    <div class="card">
        <img src="https://picsum.photos/800/600?random=2" alt="">
        <h3>Modern CSS</h3>
        <p>CSS Blend Mode: mix-blend-mode</p>
    </div>
</div>
```

  


关键 CSS 代码：

  


```CSS
.backdrop {
    filter: brightness(1.7);
    
    .shapes {
        mix-blend-mode: multiply;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bc77167a9404a31874bd9c00f77c86a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=510&s=5780706&e=gif&f=193&b=fefdfd)

  


> Demo 地址：https://codepen.io/airen/full/poqWpzx

  


在这一点上，`mix-blend-mode` 和 CSS 的 `filter` 属性是相似的。当然，你可以使用 `isolation` 属性来阻止混合（稍后会介绍）。

  


另外， `background-blend-mode` 还可以使用链式的混合模式。这意味着将多个混合模式一起应用于同一个元素。这可以通过在 CSS 中使用逗号分隔多个混合模式来实现。例如：

  


```CSS
.element {
    background-blend-mode: overlay, multiply, screen;
}
```

  


在上面的示例中，我们将三个不同的混合模式（`overlay`、`multiply` 和 `screen`）链接在一起，分别应用于元素的背景。这将导致这些混合模式按顺序依次应用于元素的背景，从而创建复杂的视觉效果。

  


通过链接多个混合模式，你可以创造出更多样化和有趣的背景效果，以满足不同的设计需求。这使得 CSS 混合模式成为创建独特和吸引人的背景视觉效果的有力工具。例如：

  


```
.card {
    background: var(--bg-layer-1), var(--bg-layer-2), var(--bg-layer-3);
    background-blend-mode: var(--blned-layer-1), var(--blend-layer-2), var(--blend-layer-3);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61fa9352e7ce409ea90938e8b6793eba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=758&h=452&s=11867538&e=gif&f=270&b=4d4a6a)

  


> Demo 地址：https://codepen.io/airen/full/VwqMymP

  


你可以发挥你的才智，给元素的背景添加一些动效，整体的效果又将完全不一样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c7c0c0371114e469b113bd8d57edcc3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=426&s=19620928&e=gif&f=253&b=4d4a69)

  


> Demo 地址：https://codepen.io/airen/full/ExGwooV

  


### 实际用例

  


使用 CSS 混合模式，我们可以在 Web 上制作出很多有创意或吸引力的视觉效果。例如，纸张效果、双色调效果、浮雕压花效果、着色器（Shaders）效果、点阵图效果和调色等效果。

  


#### 纸张效果

  


你可以将带有噪点图像、CSS 的渐变、颜色 和阴影混合在一起，产生出类似于纸张的效果。例如：

  


```CSS
/* 一张噪点图像 */
.layer-1 {
    background: url("https://garden.bradwoods.io/images/noise.webp");
}

/* CSS 渐变图像 */
.layer-2 {
    background: linear-gradient(
        to bottm right,             
        hsl(0 0% 0% / 0) 40%,             
        hsl(0 0% 0% / 1)           
    );
}

.layer-3 {
    background-color:hsl(40 35% 76%);
}
```

  


将它们合在一起，并且使用正片叠加的混合模式：

  


```CSS
.result {
    background: 
        url("https://garden.bradwoods.io/images/noise.webp"),
        linear-gradient(
            to bottom right,             
            hsl(0 0% 0% / 0) 40%,             
            hsl(0 0% 0% / 1)           
        );
    background-color: hsl(40 35% 76%);
    background-blend-mode: multiply;
}
```

  


此时，你看上去得到一个看似纸张的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28e5b6ea2a4443b7aa655c6fec0a039e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=726&h=566&s=7659492&e=gif&f=267&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/dywVJLV

  


#### 浮雕在压花效果

  


浮雕是图像的部分凸起于表面之上。压花则是将图像的部分压入表面之中。我们可以使用图像的三个副本来创建这种效果。其中一个位于中心，另一个向上和左移动，另一个向下和右移动。在同一图层上结合两种混合模式，即差异和屏幕，来实现这一效果。

  


```CSS
.result {
    --img: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/153385/jpgls-leaf.jpg");
    --bg-layer-1: var(--img);
    --bg-layer-2: var(--img);
    --bg-layer-3: var(--img);
    --blend: difference, screen;
    
    background: 
        var(--bg-layer-1) calc(50% - 1px) calc(50% - 1px) / cover, 
        var(--bg-layer-2) calc(50% + 1px) calc(50% + 1px) / cover,
        var(--bg-layer-3) center / cover;
    
    filter: brightness(2) invert(1) grayscale(1);
    background-blend-mode: var(--blend);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85ceb6493bec452d8b3a024d80b99e99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=962&s=1026701&e=jpg&b=555577)

  


> Demo 地址：https://codepen.io/airen/full/QWzqmwd

  


注意，示例中还使用了多个 `filter` 混合的效果。

  


正如 [@bennettfeely](https://twitter.com/bennettfeely) 提供的案例集（[Image Effects with CSS](https://bennettfeely.com/image-effects/)）所示，你可以在 `filter` 、`mix-blend-mode` 或 `background-blend-mode` 属性上使用多个值可以为单个源图像实现很多惊人的效果。在大多数效果中，单个源背景图像重复一次或多次（比如上面示例，重复了三次），并使用 CSS 混合模式（例如 `multiply` 、`overlay` 、`screen` 或 `differecnce` 等）与自身混合。也有一些效果，还会使用 CSS 的 `filter` 属性做进一步的处理，像 `grayscale()` 、`brightness()` 和 `contrast()` 等函数可以对图像进行调整，以获得更好的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3819c8f8224493780d879c0dfeaf465~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1593&s=2549715&e=jpg&b=575678)

  


> Demo 地址：https://bennettfeely.com/image-effects/ （https://codepen.io/airen/full/aaZaPP）

  


#### 模拟 Shaders 效果

  


我们还可以使用 `mix-blend-mode` 模拟出 Shaders 效果，使得 CSS 具备简单地着色器的功能。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/943b8b7ecec64237a376b32b1f8cc632~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2066&s=1077712&e=jpg&b=f8f6f9)

  


```HTML
<div class="shader">
    <img src="tower.jpg" alt="Asakusa at dusk">
    <div class="shader__layer specular">
        <div class="shader__layer mask"></div>
    </div>
</div>
```

  


```CSS
.shader {
    position: relative;
    overflow: hidden;
    backface-visibility: hidden;
}

.shader__layer {
    background: black;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-position: center;
}

.specular {
    mix-blend-mode: color-dodge;
    background-attachment: fixed;
    background-image: linear-gradient(180deg, black 20%, #3c5e6d 35%, #f4310e, #f58308 80%, black);
}

.mask {
    mix-blend-mode: multiply;
    background-image: url(/tower_spec.jpg);
}
```

  


> Demo 地址：https://codepen.io/airen/full/MWZEVPq

  


#### 改变产品图片颜色

  


在介绍 CSS `filter` 属性时，我们有一个示例是通过 `filter` 属性来改变宝马车颜色的。同样的，你也可以使用 `mix-blend-mode` 的 `multiply` 以及调整前景色来动态调整产品图案的颜色。例如，你有一张下图这样的沙发产品图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9d05c053bb04254a686151328f6b6c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=737&s=186930&e=jpg&b=555577)

  


你首先要做的是，使用设计软件根据描述出一个与产品图外形相似的 SVG 图案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acded0d7d2f949f18f0039a8ab5aa18f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1469&s=359464&e=jpg&b=555577)

  


将其导出为 SVG 文件，或者导出相应的 SVG 代码。

  


```HTML
<div class="couch">
    <svg id="js-couch" class="couch__overlay" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" width="1000" height="394">
        <defs>
            <path d="M996.35 77.55q-1.85-1.95-8.65-3.75l-62.4-17.1q-9.3-2.75-12.15-2.5-1.8.15-2.85.45l-.75.3q2.25-16.3 3.75-22.05 1.15-4.4 1.4-10.8.2-6.6-.7-10.85-1.25-5.65-3.1-7.8-2.95-3.35-9.65-2.7-5.95.6-39.3 1.7-38.3 1.25-39.45 1.3-10.25.5-126.75.5-5.05 0-54.2 1.3-45.8 1.25-54.05.95-19.45-.45-30.4-.7-20.2-.55-23.1-1.3-22.3-5.85-26.5 1.25-2.65 4.55-3.85 7.9-.6 1.7-.7 2.5-.65-2.2-2.05-4.55-2.75-4.65-6.45-5.2-3.85-.55-13.65-.4-7.4.1-12 .4-.4.05-18.7.9-16.55.8-19.15 1.1-3.4.4-14.6 1.1-11.3.75-13.05.65h-9.8q-8.65-.05-11.45-.4-2.85-.35-9.25-.6-6.7-.15-8.5-.25-2.7-.1-27.75-.1-25.1 0-29.6.1-92.35 1.15-99 1.65-5.15.4-20 0-15.3-.4-24.4-1.25-6.75-.6-21-1.55-12.95-.9-14.85-1.1-6.45-1.05-11.05-1.5-8.7-.85-12.85.5-5.45 1.75-8.1 4.65-3.2 3.4-2.9 8.6.25 4.65 2.1 11.8 1 3.8 2.55 9.1 1 3.85 2.35 10.1-.1 1-1.5 1-1.75 0-7.7.85-7.1 1-9.8 2.05-2.4.9-23 4.75-21.2 3.9-22.05 4.15-8.2 1.85-15.05 3.35Q7.4 69.1 5.65 70.3 2.5 72.45 2 73.1.6 75 .75 79.2q.15 4.15 1.3 12.75.9 6.85 1.45 10 .5 2.75 8.55 54 6.65 42.15 7.35 46.85 1.15 7.65 4.9 28.55 4.55 25.2 6.35 31.2 2.45 8.15 3.8 11.75 1.85 4.9 3.2 5.75 1.25.8 6.85.65 2.75-.05 5.3-.25l23.85.35q.1 0 1 .95t2 .95q1.9 0 3.4-1.4l23.1-.25 43.65.4q135.05 2.15 137.9 1.9 1.25-.1 72.9.5 72.45.65 76.85.45 8.1-.35 64 .4 143.35.95 146 1.1.55.05 75.3.3 74.7.3 79.8.6 8.65.5 68.25-.35l51.75.5 1.6.4q1.95.35 3.8.05 1.45-.25 3.5-.2 1.9 0 3.35-.3 2.1-.45 8.25-.8 6.25-.3 8.75-.05 1.7.2 8 1 5.75.3 7.4-1.75 1.75-2.2 4.95-10.85 2.8-7.55 4.05-12.4.65-2.5 3.6-17.2 2.75-13.75 3.15-14.8.45-1.25 4.45-22.85 4.05-22.4 4.4-24.4.3-1.45 3.75-25.2 3.35-23.2 4-26.3 1.15-5.5 2.35-18.8 1.4-15.7.8-23.7-.6-8.35-3.35-11.15z" id="a" />
        </defs>
        <use xlink:href="#a"/>
    </svg>

    <img class="couch__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/couch-8_xrckc2.png" alt="">
</div>
```

  


```CSS
.couch__overlay {
    z-index: 2;
    fill: #fcff4d;
    mix-blend-mode: multiply;
}
```

  


你只需要动态调整 `.couch__overlay` 的 `fill` 的颜色，就能动态调整沙发颜色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c90cdf6ecd9344c6a3030efa611902ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=852&h=466&s=9206979&e=gif&f=304&b=232147)

  


> Demo 地址：https://codepen.io/airen/full/wvRrjGy

  


使用类似的原理，你还可以实现更复杂的效果，比如 [@jasonday 写的这个这个案例](https://jasonday.github.io/custom-product-demo/)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebe9e783b03845e1903578b6c15d10fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334&h=554&s=3495390&e=gif&f=296&b=efefef)

  


> Demo 地址：https://codepen.io/airen/full/PoXJeGO

  


同样的，采用相似的方法，你还可以改变图标的颜色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92cafbc496e84c459118e2c7f49a8ab4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=976&s=1249773&e=jpg&b=555577)

  


```CSS
svg {
    mix-blend-mode: screen;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7be7f97c7824230aca72aa4bcf45f9a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=952&h=530&s=14364234&e=gif&f=221&b=3a5168)

  


> Demo 地址：https://codepen.io/airen/full/oNJGdwY

  


### 阻止混合模式

  


要阻止混合模式效果，你可以使用 CSS 的 `isolation` 属性。将 `isolation` 属性的值设置为 `isolate`，它将创建一个新的堆叠上下文，从而防止元素与背景或其他元素混合。这会将元素视为一个独立的图层，不受其他元素的混合影响。

  


```CSS
.element {
    isolation: isolate;
}
```

  


这样，元素将不再与其周围的元素混合，而成为一个单独的图层。来看一个简单的示例：

  


```HTML
<div class="container">
    <div class="isolation">
        <div class="card"></div>
    </div>
</div>
```

  


```CSS
.container {
    --blend: screen;
    --isolation: auto;
    
    background-image: linear-gradient(
        to bottom left in oklab,
        oklch(55% 0.45 350) 0%,
        oklch(100% 0.4 95) 100%
    );
    
    .card {
        background-color: #fff;
        mix-blend-mode: var(--blend);
    }
    
    .isolation {
        isolation: var(--isolation);
    }
}
```

  


当 `--isolation` 属性为 `isolate` 时，`.isolation` 将会把 `.card` 和 `.container` 进行隔离，运用在 `.card` 上的 `mix-blend-mode` 不会与 `.container` 的背景进行混合：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b79538f7403d42848fdcff26bb2c2485~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=850&h=510&s=2978149&e=gif&f=208&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/wvRrjVN

  


但请注意，这不适用于 `background-blend-mode`，因为 `background` 属性已经被隔离。

  


## CSS 的 backdrop-filter 属性

  


你可能已经注意到一些网站上的引人注目的背景效果，例如磨砂玻璃效果、视频叠加、半透明导航头部、不适当图像审查、图像加载等视觉效果。这些令人印象深刻的效果正是通过 `backdrop-filter` 属性实现的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db5fba21a68443d5839b5b3cc6a065a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1192&s=2055996&e=jpg&b=575678)

  


在 CSS 中，可用于 `filter` 属性的滤镜函数都可以用于 `backdrop-filter` 属性。它和 `filter` 不同的是，`backdrop-filter` 只会给元素的背景应用滤镜效果。例如：

  


```CSS
.element {
    backdrop-filter: blur(5px) brightness(0.8);
}
```

  


上面的代码会在 `.element` 元素的背景上应用模糊（`blur()`）和降低亮度（`brightness()`）的滤镜效果。

  


`backdrop-filter` 属性最经典的案例是用来制作毛玻璃的 UI 效果，也常称 Glass UI 或 Glassmorphism UI。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2e3d6f0b55847ff815ee0a209fcc31e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1295&s=907344&e=jpg&b=4c2955)

  


> Demo 地址：https://codepen.io/TurkAysenur/full/ZEpxeYm

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cd17093b78b47bd826e33444b90caad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1295&s=918804&e=jpg&b=4b757f)

  


> Demo 地址：https://codepen.io/Hyperplexed/full/vYpXNJd

  


以创建玻璃效果（Glassmorphism）为例。玻璃效果的主要思路是在彩色背景上创建玻璃面板。通过使用 CSS 的不透明度和 `backdrop-filter` 属性来实现这种效果。以下是使用 CSS 来实现玻璃效果的步骤：

  


-   在容器中添加生动的背景，可以是图片，也可以是视频
-   焦点对象（或目标对象）应用不透明度
-   使用 `backdrop-filter` 属性为背景添加模糊效果
-   添加浅色边框
-   使用 `box-shadow` 添加阴影效果

  


使用以上步骤，让我们一起来创建一个简单的信用卡效果，如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5044c0cd37d847e3aaca4b841e317792~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1279&s=454623&e=jpg&b=28234c)

  


> Demo 地址：https://codepen.io/airen/full/gOZGdVd

  


首先，我们将使用 HTML 和 CSS 创建整个结构，然后再实现玻璃效果。

  


```HTML
<section>
    <div class="circle-1 circle"></div>
    <div class="circle-2 circle"></div>
    <div class="circle-3 circle"></div>
    <div class="card">
        <div>
            <h1>ANURAG GHARAT</h1>
            <p>1892 1232 1242 0099</p>
        </div>
        <p>07/27</p>
        <i class="ri-visa-line"></i>
    </div>
</section>
```

  


实现玻璃效果的核心 CSS 代码：

  


```CSS
.card {
    background: rgb(39 39 39 / 0.1);
    backdrop-filter: blur(60px);

    border: 2px solid rgb(255  255 255 / 0.2);
    box-shadow: 0 0 80px rgb(0 0 0 / 0.3);
}
```

  


你也可以使用像 [Glass UI 这样的在线工具](https://ui.glass/generator/)帮助你生成玻璃效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f194d269e0cf4a44b0de81456be3c922~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1279&s=577186&e=jpg&b=161d2b)

  


> Glass UI: https://ui.glass/generator/

  


在工具上调整相应参数，直到符合你期望的 UI 效果，然后复制出相应的代码即可：

  


```CSS
.card {
    backdrop-filter: blur(16px) saturate(180%);
    
    background-color: rgba(17, 25, 40, 0.75);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
}
```

  


再来看一个炫的模糊暗角效果。这个效果是通过创建一个带有 `backdrop-filter: blur()` 的叠加层以及一个创建暗角的 `mask-image` 来实现的。这个遮罩图由六个渐变组合而成，每个角落使用的是径向渐变，中间使用两个线性渐变（我们曾在《[CSS 的 Clipping 和 Masking](https://juejin.cn/book/7223230325122400288/section/7259668885224456252)》一节课中有过介绍）。

  


请看下面的图像，以了解这些渐变是如何组合成一个遮罩图的。黑色区域标记了我们叠加层上可见的部分。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41e17a13190e4ba58a2798636e289cb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1092&s=149779&e=jpg&b=424242)

  


以下是这种用法的示例：

  


```HTML
<div class="wrapper">
    <div class="blur-vignette"></div>
</div>
```

  


```CSS
@layer vignette {
    .wrapper {
        --radius: 18px;
        --inset: 10px;
        --transition-length: 22px;
        --blur: 21px;
    
        position: relative;
        aspect-ratio: 1 / 1;
        width: 300px;
        background: url(https://media.istockphoto.com/id/910527852/photo/taxi-ride-in-new-york-city.jpg?s=612x612&w=0&k=20&c=ueaQ7ZPYwOgSsfWOloyI41HmXaLIlYT853vG6x9xa1I=)
          0% 0% / cover;
        border-radius: var(--radius);
        place-self: center;
    
        .blur-vignette {
            --r: max(var(--transition-length), calc(var(--radius) - var(--inset)));
            --corner-size: calc(var(--r) + var(--inset)) calc(var(--r) + var(--inset));
            --corner-gradient: 
                transparent 0px,
                transparent calc(var(--r) - var(--transition-length)), black var(--r);
            --fill-gradient: 
                black, black var(--inset),
                transparent calc(var(--inset) + var(--transition-length)),
                transparent calc(100% - var(--transition-length) - var(--inset)),
                black calc(100% - var(--inset));
            --fill-narrow-size: calc(100% - (var(--inset) + var(--r)) * 2);
            --fill-farther-position: calc(var(--inset) + var(--r));
    
            position: absolute;
            inset: 0;
            border-radius: var(--radius);
            backdrop-filter: blur(var(--blur));
    
            mask-image: 
                linear-gradient(to right, var(--fill-gradient)),
                linear-gradient(to bottom, var(--fill-gradient)),
                radial-gradient(at bottom right, var(--corner-gradient)),
                radial-gradient(at bottom left, var(--corner-gradient)),
                radial-gradient(at top left, var(--corner-gradient)),
                radial-gradient(at top right, var(--corner-gradient));
            mask-size: 
                100% var(--fill-narrow-size), 
                var(--fill-narrow-size) 100%,
                var(--corner-size), var(--corner-size), var(--corner-size),
                var(--corner-size);
            mask-position: 
                0 var(--fill-farther-position),
                var(--fill-farther-position) 0, 
                0 0, 
                100% 0, 
                100% 100%, 
                0 100%;
            mask-repeat: no-repeat;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e20383e751e413699c8e3062c24d75b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=846&h=564&s=17002693&e=gif&f=162&b=1c2b3e)

  


> Demo 地址：https://codepen.io/airen/full/eYbGPGg

  


你可以组合不同的滤镜以实现丰富而巧妙的效果，或者仅使用一个滤镜以获得更加微妙或精确的效果。

  


## 小结

  


当涉及到处理和调整 Web 页面中的图像或元素效果时，CSS 提供了一些有用的属性和功能，比如 CSS 的 `filter` 属性、`filter()` 函数、CSS 混合模式（`mix-blend-mode` 和 `background-blend-mode`）和 `backdrop-filter` 。

  


从视觉效果上来说，它们都可以对图像或元素应用特殊的视觉效果，其中 `filter` 、`filter()` 和 `backdrop-filter` 都接受一个或多个滤镜函数做为值或参数。不同的是，`filter` 和 `backdrop-filter` 是 CSS 的属性，前者用于元素上，后者用于元素的背景上，而 `filter()` 是一个 CSS 函数，它只能用于可接受 `<image>` 值类型的属性上，比如 `background-image` 。

  


`mix-blend-mode` 和 `background-blend-mode` 都是 CSS 的混合模式，前者用于元素上，后者用于元素的背景上。

  


总的来说，这些 CSS 属性和功能为开发者提供了丰富的工具，用于在网页中创建各种图像处理和视觉效果，使用户体验更加丰富和吸引人。可以根据具体的需求和创造力来结合它们，以实现独特的设计和交互。