[SVG 坐标系](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)和 [SVG 变换](https://juejin.cn/book/7341630791099383835/section/7356918561740161036)是 SVG 图形中不可或缺的两个概念。SVG 坐标系定义了图形的空间结构，而 SVG 变换则允许我们对图形进行各种变换，如旋转、缩放、平移和倾斜等。两者结合起来，构成了 SVG 图形的核心特性之一。

  


SVG 坐标系作为 SVG 图形的基础，决定了图形的布局和位置。在 SVG 中，存在两种坐标系，用户坐标系和视口坐标系。用户坐标系是 SVG 图形的逻辑坐标系，它定义了图形中的点和元素的位置。视口坐标系则是 SVG 图形所在的容器的坐标系，它定义了 SVG 图形在浏览器窗口或其他容器中的位置和大小。通过视口坐标系的设置，我们可以控制 SVG 图形的显示范围和缩放比例，实现响应式布局和适应不同设备的显示效果。

  


而 SVG 变换则是对 SVG 元素进行的各种操作，用于改变元素的位置、大小、形状或方向。SVG 变换包括了平移、缩放、旋转、倾斜等操作，通过这些变换，我们可以实现对 SVG 图形的各种效果和动画。在 SVG 中，变换是通过 `transform` 属性来实现的，该属性可以对单个元素或整个图形进行变换操作，并且可以组合多个变换函数实现复杂的效果。

  


然而，SVG 的变换不仅仅是元素的变换，它们还被称为“坐标系变换”。SVG 坐标系变换是 SVG 图形中实现视觉效果和动画的重要手段。通过 SVG 坐标系变换，我们可以对 SVG 元素进行平移、缩放、旋转和倾斜等操作，从而改变元素在用户坐标系中的位置和形状，进而实现各种视觉效果。

  


SVG 坐标系的核心概念在于建立新的用户坐标系。在 SVG 中，每个元素都有自己的用户坐标系，而 SVG 坐标系变换就是在这个坐标系的基础上进行的。当我们对 SVG 元素应用变换时，实际上是在修改元素的用户坐标系，使其发生相应的变化。这种变换不仅影响到元素本身，还会影响到其内部的所有子元素，从而实现以整个图形的变换效果。

  


与此同时， SVG 坐标系变换也涉及到视口坐标系的调整。视口坐标系定义了 SVG 图形在浏览器窗口或其他容器中的位置和大小，通过调整视口坐标系的参数，我们可以控制 SVG 图形的显示范围和缩放比例，从而实现图形的适应性布局和响应式设计。

  


接下来，我们就一起来探讨 SVG 坐标系的变换，使大家能够更全面，更彻底地掌握 SVG 中的两大核心概念。帮助大家更好的使用 SVG 进行创作。

  


## 简单地回顾一下

  


“SVG 坐标系变换”涵盖了 SVG 中坐标系和变换两个核心概念，既然如此，我们就有必要简单回顾一下这两个方面的知识。

  


### SVG 坐标系统

  


从小册的《[初级篇：SVG 坐标系统](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)》课程中，我们知道 SVG 视口坐标系（即“相框”）可以视为是相对于浏览器不会变动的坐标系统（`1px` 就是 `1px`），但是 SVG 用户坐标系（即“相片”）则是会变动的，随着给定的不同的 `viewBox` 值，SVG 坐标系中的 `1` 个用户单位有可能等于、大于或小于 `1px` 。

  


这就意味着，用户坐标系统（相片）和视口坐标系统（相框）会存在三种情况：

  


-   相片和相框尺寸刚好匹配，即 `viewBox` 尺寸等于视口（Viewport）尺寸
-   相片尺寸大小相框尺寸，即 `viewBox` 尺寸大于视口（Viewport）尺寸
-   相片尺寸小于相框尺寸，即 `viewBox` 尺寸小于视口（Viewport）尺寸

  


当相片（`viewBox`）和相框（Viewport）尺寸相等时，可以看到红色虚线框右下角橙色圆点中心 （`cx` 和 `cy`）的位置，不管是在 Viewport 坐标系中还是 SVG 坐标系统（用户坐标系统）中，位置都相同，即 `cx=180` ，`cy=270` 。如下图所示，Viewport（`<svg>` 元素）的 `width` 和 `height` 与 `viewBox` 的 `<width>` 和 `<height>` 相等，都是 `800 x 600` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfb64c4f44a649c1b74cfc589651ecdf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1149&s=383867&e=jpg&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/oNOxxqm

  


当相片（`viewBox`）尺寸小于相框（Viewport）尺寸，在这里 `viewBox` 的尺寸是 `400 x 300` （`viewBox="0 0 400 300"`），Viewport 尺寸是 `800 x 600` （`<svg width="800" height="600"`）。相片需要放大两倍才能填满整个相框，所以在红色虚线框右下角橙色圆点的中心，它在 SVG 坐标系中仍然是 `cx=180` ，`cy=270` ，但它在 Viewport 坐标系中，`cx=360` ，`cy=540` 。也就是说，在这种情况下，SVG 坐标系统中的 `1` 个用户单位相当于 Viewport 坐标系中的 `2px` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0568da31e00e439ea4bf4a16df8ff1a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1149&s=456315&e=jpg&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/oNOxxqm

  


当相片（`viewBox`）尺寸大于相框（Viewport）尺寸，在这里 `viewBox` 的尺寸是 `1600 x 1200` （`viewBox="0 0 1600 1200"`），Viewport 尺寸是 `800 x 600` （`<svg width="800" height="600">`）。相片需要缩小才能填充整个相框，所以在红色虚线框右下角橙色圆点的中心，它在 SVG 坐标系中仍然是 `cx=180` ，`cy=270` ，但它在 Viewport 坐标系中，`cx=90` ，`cy=135` 。也就是说，在这种情况下，SVG 坐标系统中的 `1` 个用户单位相当于 Viewport 坐标系中的 `0.5px` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53dd94c6742447b9bf861e84e8651a7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1149&s=384639&e=jpg&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/oNOxxqm

  


不难发现，不管相片（`viewBox`）是放大还是缩小，都是从左上角点开始，这点非常重要。事实上，SVG 坐标系统和视口坐标系统是有办法相互转换的，这也是这节课的核心部分，我们稍后会详细阐述！

  


### SVG 变换

  


正如小册的《[中级篇：SVG 的变换属性](https://juejin.cn/book/7341630791099383835/section/7356918561740161036)》课程中所述，我们可以通过 SVG 元素的 `transform` 属性或 CSS 的变换属性 `transform` （或单个变换 `translate` 、`scale` 和 `rotate`）对 SVG 元素进行一个或多变换。以 SVG 元素的 `transform` 属性为例，它的工作方式类似于 CSS 的 `transform` 属性中使用的变换函数，只是它们接受不同的参数。

  


注意，SVG 的 `transform` 属性仅接受 2D 变换函数：

  


-   矩阵变换 `matrix(a,b,c,d,e,f)` ，指定了一个由六个值组成的变换矩阵，`matrix(a,b,c,d,e,f)` 等效于应用变换矩阵 `[a b c d e f]` 。使用变换矩阵需要具备一定的数学知识，通常情况下，其他变换函数都可以使用矩阵变换来描述
-   平移变换 `translate(tx,ty)` ，函数中的 `ty` 是一个可选值，其默认为 `0` ，`tx` 和 `ty` 分别指定水平和垂直平移值。`tx` 表示沿 `x` 轴的平移值，`ty` 表示沿 `y` 轴的平移值。`tx` 和 `ty` 的值可以是以空格或逗号分隔的，它们在函数内不带任何单位，默认为当前用户坐标系的单位。例如 `transform="translate(100 300)"` 将一个元素向右平移了 `100` 个用户单位，并向下平移了 `300` 个用户单位
-   缩放变换 `scale(sx,sy)` ，函数中的 `sy` 是一个可选值，如果省略，则 `sx=sy` ，`sx` 表示沿 `x` 轴的缩放值，用于水平拉伸或收缩元素；`sy` 表示沿 `y` 轴的缩放值，用于垂直拉伸或收缩元素。`sx` 和 `sy` 的值可以是以空格或逗号分隔的，它们是无单位的数值。例如 `transform="scale(2, 0.5)"` 将一个元素水平方向尺寸放大 `2` 倍，并在垂直方向缩小 `0.5` 倍
-   倾斜变换 `skewX(a)` 或 `skewY(a)`，函数中的 `a` 表示倾斜角度，是一个无单位的角度，默认为度数。其中 `skewX(a)` 函数指定元素沿 `x` 轴倾斜 `a` 度，`skewY(a)` 函数指定元素沿 `y` 轴倾斜 `a` 度。例如 `transform="skewX(45)"` 将一个元素沿水平方向倾斜 `45` 度。注意，SVG 中的 `transform` 属性没有 `skew()` 函数
-   旋转变换 `rotate(a)` 或 `rotate(a, cx,cy)` ，其中 `rotate(a)` 函数指定元素将围绕当前用户坐标系的原点旋转 `a` 度，`rotate(a, cx,cy)` 函数指定元素围绕给定点 `(cx,cy)` 旋转 `a` 度。例如 `transform="rotate(45, 50, 50)"` 将一个元素围绕着 `(50,50)` 点顺时针旋转 `45` 度

  


这里需要注意的是，当对 SVG 元素进行缩放、倾斜和旋转等操作时，会使其整个当前用户坐标系发生变换，例如当前用户坐标系会因 SVG 元素缩放被缩放，导致元素在视口内被重新定位。

  


## SVG 坐标系变换

  


我们已经花了一些时间来回顾 SVG 坐标系统和 SVG 变换的相关知识，现在让我们更深入地探讨 SVG 坐标系的变换。

  


首先，需要明确一点，SVG 变换不仅仅是对元素的变换，它还会影响到 SVG 坐标系。这并非偶然。`transform` 属性会为应用变换的元素建立新的用户空间（当前坐标系统），而 `viewBox` 属性则是创建用户空间的另一个重要属性。那么这究竟意味着什么呢？

  


简而言之，当你将 `transform` 属性应用于 SVG 元素时，该元素就获得了正在使用的当前用户坐标系统的“副本”。你可以将其看作是为变换后的元素创建了一个新的“层”，在这个新层中，拥有了当前用户坐标系统（`viewBox`）的副本。然后，元素的新坐标系统通过 `transform` 属性中指定的变换函数进行变换，从而导致元素本身的变换。这就好像元素在变换后的坐标系统中重新绘制在画布上一样。

  


接下来的示例，为了简化起见，将不改变初始坐标系统，即 SVG 的 `viewBox` （相片）和 Viewport（相框）保持相等的尺寸，都是 `800 x 600` ：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <!-- SVG 内容 -->
</svg>
```

  


并且在 `<svg>` 中创建了两个组 (`<g>`)，这两个 `<g>` 都包含了两只小狗的坐标系的标尺：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <!-- 初始坐标系 -->
    <g class="original gray">
        <use href="#dog" style="outline:1px dashed #ccc"/>
    </g>
    
    <!-- 当前用户坐标系的“副本” -->
    <g class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


我们将要变换的元素是 `.transfrom` 。

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <g transform="translate(100,100)" class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b6e0a2eef294f1a9e81140b6153dcd9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=806&s=340617&e=jpg&b=ffffff)

  


正如上图所示，灰色的坐标系是由 `viewBox` 创建的画布的初始坐标系统。当你将 `transform` 属性应用于 SVG 元素时，该元素会获得正在使用的当前用户坐标系统的“副本”（上图中蓝色坐标系）。

  


换言之，将 `transform` 属性应用于一个元素会在其上建立一个新的当前用户坐标系。下图显示了将“小狗”（`.transform`）元素进行平移变换时，建立在其上的初始坐标系的“副本”（蓝色坐标系，即当前坐标系）被平移的情况：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad55df4e7d0e4f1b89e31407580e3bd3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=768&s=1549715&e=gif&f=162&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/jORpeZa

  


这里需要注意的是，建立在元素上的新当前坐标系（蓝色）是初始用户空间的副本（灰色），并且保留了元素的位置。这意味着它不是建立在元素的边界框上，新当前坐标系的大小也不受限于元素的大小。这就是 HTML 和 SVG 坐标系之间的区别所在。

  


我们把上面示例稍微调整一下，假设小狗图形边界框的左上角和 SVG 画布的左上角不在同一个位置，我们对小狗进行平移变换，情况就更加明显了。例如，我们将小狗向右平移 `200` 个用户单位，然后向下平移 `150` 个用户单位。小狗（透明版本小狗）、其初始位置（灰色标尺）以及与小狗一起平移的新当前坐标系（蓝色标尺）会呈现出以下现象。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dd22b98070042e6bee00303d473b34a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=792&s=2351878&e=gif&f=211&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/LYvBMqJ

  


请注意小狗的新当前坐标系的原点不位于小狗边界框的左上角。同时也注意到小狗及其新坐标系似乎被移动到了画布的一个新“层”上。

  


另外，应用平移变换之后的当前坐标系，其效果有点类似于调整了 `viewBox` 的 `<min-x>` 和 `<min-y>` 参数值被调整：

  


-   `translate(tx,ty)` 中的 `tx` 和 `ty` 为正值时，`<min-x>` 的值正好是 `-tx` ，`<min-y>` 的值正好是 `-ty`
-   `translate(tx,ty)` 中的 `tx` 和 `ty` 为负值时，`<min-x>` 的值正好是 `tx` ，`<min-y>` 的值正好是 `ty`

  


以 `translate(200,150)` 平移为例，它相当于 `viewBox="-200 -150 800 600"` 的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64e8e86c58cd400384cfa7f2f4317502~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1262&h=706&s=1379610&e=gif&f=146&b=ffffff)

  


这也意味着，我们调整 `viewBox` 的 `<min-x>` 和 `<min-y>` 参数的值，也能达到类似平移变换 `translate(tx,ty)` 的效果。

  


现在，让我们尝试着将上面应用于小狗的 `traslate` 平移变换换成缩放变换：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <g transform="scale(2,1.5)" class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


对 SVG 元素进行缩放变换的结果与对 HTML 元素进行缩放的结果不同。缩放后，SVG 元素在视口内的位置会发生变化。请留意小狗初始位置和大小（灰色版本）以及最终的位置和大小（彩色版本）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7956f9cc85f8443dab72eb579b0e22ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=722&s=4958388&e=gif&f=327&b=fefdfd)

  


> Demo 地址：https://codepen.io/airen/full/LYvBqVM

  


不难发现，小狗的尺寸（宽度和高度）不仅被缩放，而且坐标 `x` 和 `y` （左上角点）也会随缩放因子变化，`x` 的新位置是 `x*sx` ，`y` 的新位置是 `y*sy` 。在注意上图中蓝色标尺（当前坐标系）也被缩放了。这种效果类似于调整了 `viewBox` 的 `<width>` 和 `<height>` 的值。

  


当 `scale(sx,sy)` 函数缩放元素时，相当于 `<width>` 和 `<height>` 变小，其中 `<width>` 新的值等于 `<width>` 初始值除以 `sx` 缩放因子，`<height>` 新的值等于 `<height>` 初始值除以 `sy` 缩放因子。以 `scale(2)` 函数为例，此时 `sx=sy=2` ，则变换之后的 `viewBox` 的 `<width>` 值等于 `800 / 2 = 400` ，`<height>` 值等于 `600 / 2 = 300` ，即 `viewBox="0 0 400 300"` 。这相当于“放大”坐标系，从而使内部内容被放大：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad32bd4d57ad42e99c73a27eddc76f7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1362&h=752&s=3667349&e=gif&f=288&b=ffffff)

  


反之则“缩小”坐标系，从而使内部内容被缩小：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b66bf2275cf40fb8edd187632be9be1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1336&h=742&s=684006&e=gif&f=82&b=ffffff)

  


上图效果等同于 `scale(0.5)` 的效果。

  


即便如此，在其当前坐标系内，小狗不会重新定位，它只是坐标系缩放的效果将其重新定位到视口内。小狗只是在新的放大系统内以其原始的 `x` 和 `y` 坐标绘制。

  


接着来看 `SkewX(a)` 和 `SkewY(a)` 对坐标系的影响。先来看 `skewX(a)` 。将上面应用于小狗的缩放变换更换成 `skewX(a)` 变换，例如：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <g transform="skewX(30)" class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dd9bf123103407b87699825af444005~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320&h=778&s=8563189&e=gif&f=231&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/MWRBLXX

  


你会发现，在 SVG 中对元素进行倾斜也会导致元素被“移动”。注意上图中小狗图形边界框左上角的橙色圆点，它随着 `skewX(a)` 变换函数的 `a` 角度值变化，会在水平方向左右移动。这是因为当前坐标系（蓝色标尺）在 `x` 轴方向被倾斜了。因此，相应的内容（彩色小狗）本身也被倾斜了。

  


如果将 `skewX(a)` 函数换成 `skewY(a)` 函数，那么当前坐标系（蓝色标尺）和小狗本身会在 `x` 轴方向被倾斜，请留意小狗图形边界框左上角橙色圆点位置，它会在 `y` 轴方向上下移动：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <g transform="skewY(30)" class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d619013bb164a0395bff479def5cf49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=756&s=8991742&e=gif&f=267&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/QWPBYRm

  


请注意，由于倾斜变换会倾斜当前坐标系，小狗相对于其原始位置的位置也发生了变化，因此导致小狗图形被“移动”。

  


继续往下，把倾斜函数换成旋转函数，例如：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <g transform="rotate(30)" class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eb6864b8ebb41639f7f644166969f11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1322&h=818&s=8990123&e=gif&f=263&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/GRLBegW

  


正如你看到的，`rotate(a)` 变换在旋转小狗图形自身时，用户当前坐标系（蓝色标尺）也随之旋转。严格来说，旋转变换会使用户当前坐标系围绕着左上角（坐标系原点）进行旋转，当 `a` 角度值为正值时，用户坐标系围绕着原点顺时针旋转，反之则逆时针旋转。因为用户当前坐标系旋转了，才导致其内容（小狗）也随之旋转。

  


当然，你可能希望用户当前坐标系能围绕着指定的点进行旋转，那么可以考虑使用 `rotate(a,cx,cy)` 函数来旋转，其中 `(cx,cy)` 对应的坐标点就是你希望指定的点。例如：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <g transform="rotate(30, 189, 234)" class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


示例中的 `rotate(30, 189, 234)` 函数的 `cx` 和 `cy` 是根据小狗图形的宽度、高度和位置，我们可以计算出其中心位置大约在 `(189， 234)` 。这意味着，用户当前坐标系将围绕着指定的 `(189,234)` 点进行旋转：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef05700794e41b285bc6771293aff3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360&h=822&s=8726497&e=gif&f=243&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/YzMjMRd

  


最后再来看一个矩阵变换对坐标系的影响。在这里我们使用一个最简单的矩阵变换，例如，使用 `matrix(1,0,0,1,tx,ty)` 来替代 `translate(tx,ty)` 转换：

  


```XML
<svg width="800" height="600" viewBox="0 0 800 600">
    <g transform="matrix(1,0,0,1,100,100) " class="transfrom blue">
        <g id="dog"></g>
    </g>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fef61f8dcd5f43048ad12dc0f9be9c3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=764&s=1744470&e=gif&f=133&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/NWmBVrb

  


是的，`matrix()` 变换同样会对用户当前坐标系进行矩阵变换。

  


这意味着，`matrix()` 变换能实现更为复杂的坐标系变换，比如链式的变换，使用 `matrix()` 变换就更易于理解。有关于其他变换和链式变换如何转换为 `matrix()` 变换，可以回过头来阅读[上一节课中关于矩阵变换相关的内容](https://juejin.cn/book/7341630791099383835/section/7356918561740161036#heading-6)。这里就不做重复性的阐述！

  


上面通过案例可视化效果，向大家展示了 SVG 的 `transform` 的各种变换函数是如何影响到用户当前坐标系的。

  


要知道的是，我们同样可以使用 CSS 的 `transform` 、`translate` 、`rotate` 和 `scale` 等属性在 CSS 中对 SVG 元素进行变换处理。那么，在样式表中给 SVG 元素设置变换，会影响到 SVG 坐标系统？我们通过下面这个示例来告诉大家答案。

  


以 `translate` 为例，我们在 CSS 中给 `.transform` 元素（小狗）应用下面这个样式：

  


```CSS
.transform {
    translate: 100px 100px;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8f88ec886a645369d0d9cd278ff4417~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1254&h=770&s=1528805&e=gif&f=165&b=0a0822)

  


> Demo 地址：https://codepen.io/airen/full/wvZxbeo

  


是的，它们也会影响到 SVG 坐标系。

  


在 CSS 中，我们可以使用 `transform-origin` 来指定变换元素的中心点，但与 HTML 元素不同的是，即使在 CSS 中指定 `transform-origin` 的值为 `50% 50%` ，SVG 元素变换原点也不是元素自身的中心位置，而是变换之后用户当前坐标系的中心：

  


```CSS
.transform {
    rotate: 30deg;
    transform-origin: 50% 50%;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce5595b35b5640b7b4c972605cc21b53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1248&h=802&s=11969407&e=gif&f=286&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/qBwyGpw

  


这是由于 SVG 的变换参考盒子是 `view-box` 。你可以在 CSS 中使用 `transform-box` 属性来改变变换参考框，比如将其设置为 `fill-box` ， 那么变换参考框就会变成图形对象边界框。这个时候，它将围绕着图形元素自己身的中心旋转：

  


```CSS
.transform {
    rotate: 30deg;
    transform-origin: 50% 50%;
    transform-box: fill-box;
}
```

  


这在制作动画时非常有用。在上一节课，我们特意将 `transform-box` 属性拿出来与大家讨论了，[详细的介绍请返回小册上一节课](https://juejin.cn/book/7341630791099383835/section/7356918561740161036#heading-13)。

  


## 小结

  


现在，知道 SVG 坐标系变换背后的概念和原理之后，是不是对于 SVG 元素应用变换属性的结果不会再感到怪异了，也知道了 SVG 元素对变换的响应为什么会与 HTML 元素不同。

  


然而，一旦你掌握了它们的工作原理，就能更好地控制你的 SVG 画布，并更轻松地操纵元素。