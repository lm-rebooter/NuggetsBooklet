通过之前几节课的学习，我相信你和我有着同样的感受。SVG 滤镜效果既神奇又奇特，还有许多东西需要我们继续探索。学习和使用 SVG 滤镜需要勇气，敢于进入这个充满未知和不确定性的世界。你的探索精神将不断受到意想不到效果的考验，必须学习复杂的知识和技巧。然而，一旦掌握了它，你将获得前所未有的力量——只需几行代码就能改变 Web UI 和整个应用的视觉效果。

  


在这节课中，我将和大家一起探讨 SVG 滤镜中的位移滤镜，即 `<feDisplacementMap>` 滤镜基元。我会结合理论和实际操作，用最简单的方式，通过实际案例来讲解 `<feDisplacementMap>` 滤镜的功能和使用方法。通过这次学习，我们将掌握 `<feDisplacementMap>` 滤镜的工作原理，以及如何使用它创建酷炫的位移效果。此外，我们还会学习一些动画滤镜的技巧，以创造出更具戏剧性的视觉效果。

  


## 位移滤镜简介

  


在开始介绍位移滤镜（`<feDisplacementMap>`）之前，我们先来看两个 `<feDisplacementMap>` 滤镜的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/555655c3fb6144fc890b3077afd4fa38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=622&s=5151451&e=gif&f=151&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/wvbrzOg

  


按钮和用户头像都是 Web 中的常见 UI，应用了位移滤镜之后的，UI 效果是不是立马显得高大上了。位移滤镜效果除了可以应用于常见的 UI 元素上之外，还可以制作一些酷炫的动画效果。例如下面这个效果，[由 @yoksel 在 Codepen 上提供](https://codepen.io/yoksel/full/MLVjoB)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba70ddebfaed4f5b8b26575601e5bc94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1138&h=704&s=2664123&e=gif&f=54&b=000000)

  


> Demo 地址：https://codepen.io/yoksel/full/MLVjoB （来源于 @yoksel ）

  


是不是很酷炫！这两个案例的效果都离不开位移滤镜 `<feDisplacementMap>` 的功劳。那么，什么是位移滤镜呢？

  


简单地说，位移滤镜实际上是一个置换滤镜，通过改变图像的像素位置来实现诸如 [Photoshop 扭曲滤镜](https://helpx.adobe.com/photoshop-elements/using/distort-filters.html)那样的变形、旋转或波纹等各种有趣的视觉效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d8b3da1cd4749deb792327235272f87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=720&s=76251&e=jpg&b=d7d8de)

  


以 `<feDisplacementMap>` 滤镜实现扭曲效果为例，它需要两个图像作为输入：

  


-   实际需要被扭曲的源图像，由 `<feDisplacementMap>` 滤镜基元的 `in` 属性指定
-   “位移图像”，由 `<feDisplacementMap>` 滤镜基元的 `in2` 属性指定，它可以是噪声图像或任何其他图像。该图像的像素值决定了源图像像素的偏移量

  


例如：

  


```HTML
<!-- 源图像，需要被扭曲的图像 -->
<img src="https://picsum.photos/id/823/600/600" alt="" class="filtered" />


<svg class="sr-only">
    <defs>
        <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
            <!-- 位移图像 -->
            <feImage href="https://picsum.photos/id/41/600/600" result="IMAGE" />
            <!-- 位移滤镜 -->
            <feDisplacementMap id="fedisplacementmap" in="SourceGraphic" in2="IMAGE" xChannelSelector="R" yChannelSelector="B" scale="50" />
        </filter>
    </defs>
</svg>
```

  


使用 CSS 的 `filter` 属性，将 SVG 的 `<filter>` 定义的滤镜（`#filter`）应用到源图像 `.filtered` 上：

  


```CSS
.filtered {
    filter: url("#filter");
}
```

  


你将在浏览器中看到，源图像被扭曲了，看上去就像一个水波形状：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/056a93c55f5143c2ab42f12a1bd8a5d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1113&s=915199&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/bGyogwO

  


示例中的滤镜构建如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec7c5bb6f06546f98f65f68b98b03764~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=1260&s=1125830&e=jpg&b=060606)

  


首先，使用了 `<feImage> 滤镜基元`引入一张图像，这个滤镜的结果被命名为 `IMAGE` ，它被 `<feDisplacementMap>` 滤镜基元的 `in2` 属性引用，用作位移图。而实际扭曲是在这里发生：

  


-   正负的 `scale` 属性定义了扭曲的强度。在这个示例中，设置了 `scale="50"`
-   `xChannelSelector` 和 `yChannelSelector` 属性用于确定输入图像的颜色通道（R、G、B 和 A）中哪一个应用该用于哪个轴进行扭曲。两个属性默认使用位移图的透明通道（`A`），这意味着，如果你使用了没有透明通道的位移图，并且省略了这些属性（未显式设置），那么你只会看到源图像的对象线偏移。在这个示例中，设置 了`xChannelSelector="R"` 和 `yChannelSelector="B"` ，它们会告诉浏览器，用位移图的红色通道控制水平方向位移，用蓝色通道控制垂直方向位移

  


以这种方式扭曲图像可能会很有趣，但结果是不可预测的，而且大多数情况下，视觉效果并不美观。那么，有没有办法对输出进行像素级的精确控制呢？

  


[SVG 规范](https://drafts.fxtf.org/filter-effects/#elementdef-fedisplacementmap)是这么说的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e32a67d0fa8d4c1a9c2c35de08e3ffcd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3336&h=1478&s=719523&e=jpg&b=fefdfd)

  


> SVG 规范：https://drafts.fxtf.org/filter-effects/#elementdef-fedisplacementmap

  


简单地说，`<feDisplacementMap>` 滤镜基元使用来自 `in2` 图像（位移图）的像素值来空间上位移 `in` 图像（源图像）。在这个位移过程中，会通过下面这个公式来执行变换：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5177ae8e503f492aa75f1095bfb288df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3316&h=582&s=109882&e=jpg&b=ffffff)

也就是说，`<feDisplacementMap>` 滤镜基元对图像进行位置映射时，会通过上面这个公式来来进行映射。这意味着，只要我们理解了这个映射公式，就能对输出进行像素级的精确控制。

  


简单解释一下：

  


-   `P'(x,y)` 表示结果图像中一个像素的 `x,y` 坐标
-   `P(x,y)` 表示输入图像 `in` （源图像）中该像素的 `x,y` 坐标
-   `XC` 和 `YC` 是位移图中给定像素的归一化（`1 ÷ 255`）RGB 颜色值，即由 `xChannelSelector` 和 `yChannelSelector` 指定的通道的分量值。
-   `XC(x,y)`表示当前 `x,y` 坐标像素点其 `X` 轴方向上设置的对应通道的计算值，范围是 `0~1`
-   `YC(x,y)`表示当前 `x,y` 坐标像素点其 `Y` 轴方向上设置的对应通道的计算值，范围是 `0~1`
-   `x + scale × (XC(x,y) - 0.5), y + scale × (YC(x,y) - 0.5)` 指的是具体的转换规则
-   `-0.5` 是偏移值，因此`XC(x,y) - 0.5` 范围是 `-0.5~0.5`，`YC(x,y) - 0.5` 范围也是 `-0.5~0.5`
-   `scale` 表示计算后的偏移值相乘的比例，`scale` 越大，则偏移越大

  


最后，操作结果必须取反（基本上就是公式中的每个 `+` 号都需要替换成 `-` 号），即每个加法都变成减法，那么公式将变成：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1c53bbc7ada4b4897e6b6f38b98cad3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3200&h=500&s=101535&e=jpg&b=ffffff)

  


这样做的目的是为了反向应用位移效果，使得每个像素的位置变成其原始位置的相反方向上的相应位置。这通常是在处理特定图像效果时所需要的。

  


接下来，我们将通过一些简单的小实验，通过将原始位移图输入到滤镜中来验证上面这个公式。注意，这些原始位移图只包含一种颜色。例如：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
            <feImage href="https://assets.codepen.io/100347/fedm_rgb515151.png" result="IMAGE" width="600" height="600" />
            <feDisplacementMap id="fedisplacementmap" in="SourceGraphic" in2="IMAGE" xChannelSelector="R" yChannelSelector="B" scale="100" />
        </filter>
    </defs>
</svg>
```

  


上位代码中 `<feImage>` 引入的位移图是具有 `rgb(51 51 51)` 的纯色图像，当 `<feDisplacementMap>` 滤镜的 `scale` 值为 `100` 时，如何预期源图像在 `x = 100` 和 `y=100` 处的像素坐标会被转换？

  


我们把 `<feDisplacementMap>` 滤镜基元中的相关参数值套入上面公式进行计算：

  


```
scale = 100
x = 100
y = 100
XC = 51 ÷ 255
YC = 51 ÷ 255

X = x - scale × （XC - 0.5） = 100 - 100 × (51 ÷ 255 - 0.5) = 130
Y = y - scale × （YC - 0.5） = 100 - 100 × (51 ÷ 255 - 0.5) = 130
```

  


结果就是 `P'(x,y) = P'(130,130)` ，即结果像素被移动到 `(130,130)` 坐标点。这意味着它将向右移动 `30px` ，并向下移动 `30px` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bb687e45be044779fba4e798cbc3049~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=1642&s=882974&e=jpg&b=090909)

  


> Demo 地址：https://codepen.io/airen/full/WNBZpjx

  


现在，我们将 `<feImage>` 引入的位移图调整 `rgb(127 127 127)` 纯色图像（大概是 `50%` 的灰色）。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
            <feImage href="https://assets.codepen.io/100347/fedm_grey.png" result="IMAGE" width="600" height="600" />
            <feDisplacementMap id="fedisplacementmap" in="SourceGraphic" in2="IMAGE" xChannelSelector="R" yChannelSelector="B" scale="100" />
        </filter>
    </defs>
</svg>
```

  


和之前一样，将相关参数套入公式进行计算：

  


```
scale = 100
x = 100
y = 100
XC = 127 ÷ 255
YC = 127 ÷ 255

X = x - scale × （XC - 0.5） = 100 - 100 × (127 ÷ 255 - 0.5) = 100.196 ≈ 100
Y = y - scale × （YC - 0.5） = 100 - 100 × (127 ÷ 255 - 0.5) = 100.196 ≈ 100
```

  


很显然，中性色（`rgb(127 127 127)`）对图像不会产生明显的变化。肉眼之下，目标结果像素将保持不变：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac3a5190948442c79044314594d712eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=1642&s=896657&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/WNBZjZz

请继续，这次我们把 `<feImage>` 引入的图像调得更亮一些，例如 `rgb(204 204 204)` ，颜色通道的值大于 `127` ：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
            <feImage href="https://assets.codepen.io/100347/fedm_rgb204204204.png" result="IMAGE" width="600" height="600" />
            <feDisplacementMap id="fedisplacementmap" in="SourceGraphic" in2="IMAGE" xChannelSelector="R" yChannelSelector="B" scale="100" />
        </filter>
    </defs>
</svg>
```

  


同样根据公式计算出最终值：

  


```
scale = 100
x = 100
y = 100
XC = 204 ÷ 255
YC = 204 ÷ 255

X = x - scale × （XC - 0.5） = 100 - 100 × (204 ÷ 255 - 0.5) = 70
Y = y - scale × （YC - 0.5） = 100 - 100 × (204 ÷ 255 - 0.5) = 70
```

  


最终坐标 `P'(70,70)` 与初始坐标 `P(100,100)` 相比，很明显它会向左移动 `30px` ，并向上移动 `30px` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5ff009cd15d4c5b9f9787ea65d58d43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3196&h=1642&s=892377&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/NWVajOz

  


通过这三个简单的小实验（示例），我们可以得到一个初浅的结论：

  


-   任何大于 `127` 的颜色值都会将相应像素向缩放值（`scale`）的方向移动
-   任何小于 `127` 的颜色值都会将相应像素向缩放值（`scale`）相反的方向移动
-   颜色值为 `127` 图像像素几乎不会有任何移动

  


凭直觉，大家可能会认为黑色不会有任何效果，但现在应该很清楚，事实并非如此。实际上，黑色和白色将导致最大可能的向缩放值（`scale`）方向或相反方向的移动。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61b5bcd8fcc5467a978dd3fb318155e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1361&s=1090883&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/abrLwzN

  


正如你所看到，纯黑色位移图使图像向右并向下移动移动 `50px` ，而白色位移图使图像向左并向上移动 `50px` 。

  


上面我们展示的都是纯色的位移图对源图像颜色像素位置的影响。接下来，我们再来看一个示例，进一步加深大家对 `<feDisplacementMap>` 滤镜的 `xChannelSelector`，`yChannelSelector` 和 `scale` 属性的理解。

  


我们把前面的纯色位移图换成像下面这样的一张图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a8a2799ff8a4e98862c60fca470b44a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=256&h=256&s=1226&e=png&b=ff7f7f)

  


左半边是 `rgb(255 127 127)` ，该颜色的 R 通道的计算值是 `1` ，G 和 B 通道的计算值是 `0.5` ；右半边则是完全透明 ` rgb(255 255 255  ``/ 0``)` 。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
              <feImage href="data:image/png;base64,..." result="IMAGE" width="600" height="600" />
              <feDisplacementMap id="fedisplacementmap" in="SourceGraphic" in2="IMAGE" xChannelSelector="R" yChannelSelector="G" scale="100" />
              <feComposite in="SourceGraphic" operator="in" in2="IMAGE"  />
        </filter>
    </defs>
</svg>
```

  


尝试着调整 `scale` 的值，你看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2f9c407612345c49fcdbb818fa515de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=556&s=3235977&e=gif&f=137&b=070707)

  


> Demo 地址：https://codepen.io/airen/full/GRaMEPP

  


并不难发现，应用滤镜的图片只是单纯的沿着水平方向（`x` 轴）移动。为什么呢？

  


这是因为`xChannelSelector="R"`，`yChannelSelector="G"`，水平方向基于图像颜色的 R 通道进行位移，垂直方向基于图像颜色的 G 通道进行位移。我们应用的位移图颜色（`rgb(255 127 127)`），其 R 通道的计算值是 `1` ，G 通道的计算值是 `0.5` 。套用公式：

  


```
XC(x,y) = 1
YC(x,y) = 0.5

P′(x,y) ← P(x + scale × (XC(x,y) − 0.5),y + scale × (YC(x,y) − 0.5))
P′(x,y) ← P(x + scale × (1 − 0.5),y + scale × (0.5 − 0.5))
P′(x,y) ← P(x + scale × 0.5,y + 0)
P′(x,y) ← P(x + scale × 0.5,y)
```

最终结果的坐标是 `P(x + scale × 0.5,y)` 。因此，调整 `scale` 的值，最终坐标只是 `x` 轴的值在变化。所以，你看到的图片只在水平方向发生了移动。

  


我想，通过这些简单的小实验，你对位移滤镜有所了解了。但问题是，到目前为止，还是不知道如何使用位移滤镜实现扭曲和水波纹等有趣的视觉效果。

  


在具体讲解如何制作水波纹 UI 效果之前，有一个概念需要与大家一起探讨——**绝对图像映射**！这对于位移滤镜而言，是一个非常重要的东西，因为它是所有后续效果的基础。这意味着，只有了解和掌握了这个概念，才能使用位移滤镜制作引人注目的 UI 效果。

  


## 绝对图像映射

  


绝对图像映射（Absolute Map）又称为恒等图像映射（Identity Map）。它既是一张特殊图像，将成为我们接下来所见所有效果的基础。这种映射执行一个非常简单的扭曲操作：按比例缩放图像。通过这种映射，我们可以实现多种视觉效果，并且它非常容易理解和应用。

  


为了在所有方向上等比缩放图像，颜色值必须从一边的最大值逐渐减少到对边的最小值。例如：

  


-   `x` 轴使用红色，那么它的颜色值应该从最大值 `rgb(255 0 0)` （左侧）逐渐减少到最小值 ` rgb(255 0 0  ``/ 0``)` （右侧）
-   `y` 轴使用蓝色，那么它的颜色值也应该从最大值 `rgb(0 0 255)` （顶部）逐渐减少到最小值 ` rgb(0 0 255  ``/ 0``)` （底部）

  


这张利用红色和蓝色通道制作的绝对映射图，看起来大致像下图这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/351d33864b364171a28fc3ac4d40031e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1113&s=888553&e=jpg&b=d801d8)

  


正如你所看到的，上图将使用红色表示 `x` 轴（水平方向），蓝色表示 `y` 轴（垂直方向）。但最终 `xChannelSelector` 和 `yChannelSelector` 选择哪种颜色都无关紧要。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/160dfc380eac4adc8ea85bf83f470182~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=676&s=10866626&e=gif&f=169&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/LYozOEb

  


通常这个绝对映射图可以按照下面几个步骤来制作：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b488b202db7c4048be4684828d5f00d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2634&h=1467&s=782182&e=jpg&b=ffffff)

  


注意，上图中第一矩形填充了一个从左（`rgb(255 0 0)`）到右（` rgb(255 0 0  ``/ 0``)`）的线性渐变；第二个矩形填充了一个从上（`rgb(0 0 255)`）到下（` rgb(0 0 255  ``/ 0``)`）的线性渐变，并将该矩形（它的图层）的混合模式设置为 `screen` 。请记住这个制作过程，稍后在 SVG 中制作绝对映射图像步骤与在 Figma 中制作步骤相同。

  


从 Figma 导出这个图形，这样你就创建了一个绝对映射图像！这个图像将作为各种图像扭曲的基础。换句话说，你可以在这个图像上制作图其他的位移图像：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de903a408462407b85d310915086e864~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2634&h=1467&s=651795&e=jpg&b=ffffff)

  


看到上图，你是否产生了新的疑惑，“绝对”图像映射难道不是唯一的？不是的，这里所说的绝对图像映射并不指唯一性，而是指一种特定的图像变换技术，用于对图像进行比例缩放。这个技术确保每个像素点都按比例进行移动，但图像的整体形状和相对位置保持不变。你可以将其理解为一种怛等变换，即不引入复杂的扭曲或变形。

  


为了更好地理解这个过程，我写了一个小示例，给 `<feImage>` 滤镜基元提供了多种不同的位移图像。而且这些位移图像并不都是红蓝渐变或扭曲的，还提供了黑白渐变以及其他形状。请尝试选择下面 Demo 中的位移图像，查看 `<feDisplacementMap>` 滤镜对源图像产生的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d128b4cf82544661977d80a32023aa0f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=652&s=7283810&e=gif&f=113&b=354437)

  


> Dem 地址：https://codepen.io/airen/full/RwmLxyX

  


## SVG 位移图映射

  


上面案例所展示的位移图（`<feImage>` 引用的图片）基本上都是传统的位图格式，例如 PNG 和 JPG 等。其实，我们还可以直接使用 SVG 创建位移图。

  


使用 SVG 创建位移图与之前在 Figma 中创建位移图步骤是相似的：

  


-   1️⃣：使用 `<rect>` 创建两个矩形
-   2️⃣：使用 `<linearGradient>` 创建两个线性渐变，其中一个水平渐变，从 `rgb(255 0 0 )` 到 ` rgb(255 0 0  ``/ 0``)` ，另一个中垂直渐变，从 `rgb(0 0 255)` 到 ` rgb(0 0 255  ``/ 0``)` 。将它们应用到 `<rect>` 创建的矩形元素上
-   3️⃣：在第二个矩形上应用 CSS 的 `mix-blend-mode: screen` ，将它们合并

  


上面步骤对应的 SVG 代码如下：

  


```XML
<svg viewBox="0 0 512 512" width="512" height="512">
    <defs>
        <!-- 创建水平渐变：rgb(255 0 0) 👉 rgb(255 0 0 / 0) -->
        <linearGradient id="red-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgb(255 0 0)" />
            <stop offset="100%" stop-color="rgb(255 0 0 / 0)" />
        </linearGradient>
        <!-- 创建垂直渐变： rgb(0 0 255) 👉 rgb(0 0 255 / 0) -->
        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgb(0 0 255)" />
            <stop offset="100%" stop-color="rgb(0 0 255 / 0)" />
        </linearGradient>
        
        <symbol id="image" viewBox="0 0 512 512">
            <g>
                <rect id="black-rect" x="0" y="0" width="100%" height="100%" fill="#000" class="black" />
                <rect id="red-rect" x="0" y="0" width="100%" height="100%" fill="url(#red-gradient)" class="rect--red" />
                <rect id="blue-rect" x="0" y="0" width="100%" height="100%" fill="url(#blue-gradient)" class="rect--blue" style="mix-blend-mode: screen;"/>
            </g>
        </symbol>
    </defs>
    
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad26781d55ed4a9392f3afbb7154659d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=972&s=323484&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/ZENXmJY

  


SVG 位移图准备好了，但是将其应用到滤镜中效果，并不如你所期望的那样：

  


```XML
<svg viewBox="0 0 512 512" width="512" height="512">
    <defs>
        <!-- 创建水平渐变：rgb(255 0 0) 👉 rgb(255 0 0 / 0) -->
        <linearGradient id="red-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgb(255 0 0)" />
            <stop offset="100%" stop-color="rgb(255 0 0 / 0)" />
        </linearGradient>
        <!-- 创建垂直渐变： rgb(0 0 255) 👉 rgb(0 0 255 / 0) -->
        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgb(0 0 255)" />
            <stop offset="100%" stop-color="rgb(0 0 255 / 0)" />
        </linearGradient>
    
        <symbol id="image" viewBox="0 0 512 512">
            <g>
                <rect id="black-rect" x="0" y="0" width="512" height="512" fill="#000" class="black" />
                <rect id="red-rect" x="0" y="0" width="512" height="512" fill="url(#red-gradient)" class="rect--red" />
                <rect id="blue-rect" x="0" y="0" width="512" height="512" fill="url(#blue-gradient)" class="rect--blue" style="mix-blend-mode: screen;" />
            </g>
        </symbol>
        <filter id="filter" color-interpolation-filters="sRGB">
            <feImage href="#image" result="IMAGE__10" />
            <feDisplacementMap in="SourceGraphic" in2="IMAGE__10" xChannelSelector="R" yChannelSelector="B" scale="100" result="DISPLACEMENT__MAP__10" />
        </filter>
    </defs>
</svg>
```

  


```JavaScript
const feImage = document.querySelector("feImage");
const url = feImage.getAttribute("href");

fetch(url)
    .then((response) => {
        return response.text();
    })
    .then((svgText) => {
        const uri = encodeURIComponent(svgText);
        feImage.setAttribute("href", `data:image/svg+xml;charset=utf-8,${uri}`);
    })
    .catch((error) => {
        feImage.setAttribute("href", someFallbackURI);
    });
```

  


非常遗憾的是，到写这节课内容的时候，也仅能在 Safari 浏览器中看到效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1121c331d8b4905a5006262ee92bf8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1138&h=496&s=8295851&e=gif&f=110&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/JjqreNE

  


因此，针对 SVG 位移图映射，我们就不展开阐述了！

  


其实，除了使用位图和 SVG 图形制作位移图之外，还可以使用 SVG 的滤镜来制作，例如 `<feTurbulence>` 滤镜。就我个人而言，我更倾向于使用其他滤镜来制作的位移图。接下来的示例，主要会围绕着其他滤镜制作位移图展开。

  


## 案例一：故障效果

  


[通过上一节课的学习](https://juejin.cn/book/7341630791099383835/section/7368318225756454962#heading-6)，我们知道如何使用 `<feComponentTransfer>` 和 `<feColorMatrix>` 等滤镜制作故障图效果。在这里，我们来看看，位移滤镜 `<feDisplacementMap>` 是如何基于其他 SVG 滤镜来制作一个像下面这样的文本故障效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af36d790e763483d8377f09221bc408b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=516&s=670686&e=gif&f=114&b=010101)

  


> Demo 地址：https://codepen.io/airen/pen/yLWzGPb

  


这是一个简单的文本故障效果，直接上代码：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="sRGB" >
            <feFlood flood-color="rgb(128 0 128)" result="BASE-COLOR" />
            <feFlood flood-color="rgb(255 0 128)" result="X-TRANSFORM">
                <animate attributeName="y" values="0; 150; 40; 110; 0" dur="2.5s" repeatCount="indefinite" begin="0" />
                <animate attributeName="height" values="10; 30; 15; 40; 10;" dur="4s" repeatCount="indefinite" begin="0" />
            </feFlood>
            <feMerge result="MERGE">
                <feMergeNode in="BASE-COLOR" />
                <feMergeNode in="X-TRANSFORM" />
            </feMerge>
            <feDisplacementMap in="SourceGraphic" in2="MERGE" scale="8" xChannelSelector="R" yChannelSelector="B">
                <animate attributeName="scale" values="-8; 5.5; 0; 8; 4.5; 7; -4; -9; 5; -5.5; 19; -8" dur="6s" repeatCount="indefinite" begin="0" />
            </feDisplacementMap>
        </filter>
    </defs>
</svg>
```

  


简单解释一下上面的代码。

  


首先使用了 `<feFlood>` 滤镜基元，甚至源图像（`SourceGraphic`）创建了两个填充效果，其中第一个填充的颜色是 `rgb(128 0 128)` ，第二个填充的颜色是 `rgb(255 0 128)` 。同时使用 `<animate>` 元素动态化改变第二个 `<feFlood>` 填充物的 `y` 和 `height` 值。

  


接着使用 `<feMerge>` 将前面定义的两个填充物合并在一起，并且命名为 `MERGE` 。这相当于使用 `<feFlood>` 和 `<feMerge>` 创建了一个动画化的位移图像。它看起来像下面这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f5eb7cfa33349ee8bf7d012e7da10f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1380&h=408&s=104401&e=gif&f=30&b=000000)

  


最后，将 `MERGE` 作为位移图像，被 `<feDisplacementMap>` 滤镜引用，从而产生扭曲效果。其中 `scale` 属性指定了位移的程度，`xChannelSelector` 和 `yChannelSelector` 属性分别指定了 `X` 和 `Y` 通道的颜色值的选择方式。同时，使用 `<animate>` 元素为位移映射效果添加了动画效果，改变了 `scale` 属性的值。最终使实现了一个文本障碍的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/452f60577fa24a3b8a53ab65b343336a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=516&s=670686&e=gif&f=114&b=010101)

  


> Demo 地址：https://codepen.io/airen/pen/yLWzGPb

  


## 案例二：给按钮添加云雾效果

  


在课程开始的时候，向大家展示了一个按钮和用户头像悬浮的动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0beb2235366a450dac1dfe5b01704d41~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=622&s=5151451&e=gif&f=151&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/wvbrzOg

  


这是一个 CSS 和 SVG 滤镜相互结合产生的一个交互动画效果。我们以上图中的按钮效果为例：

  


```HTML
<button class="button">Hover Me</button>
```

  


按钮基本样式就不在这里展示了，但按钮悬浮状态的云雾效果相关的 CSS 代码还是有必要贴一下：

  


```CSS
.button {
    --height: 100px;
    --width: 200px;
    width: calc(0.8 * var(--width));
    height: calc(0.7 * var(--height));
    transition: all 0.3s cubic-bezier(0, 0.22, 0.3, 1);
    transform: translateZ(0);
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        filter: url(#filter);
        border-radius: 50%;
        z-index: -1;
        transition: all 1.5s cubic-bezier(0.1, 0.22, 0.3, 1);
    }
    
    &:hover::after {
        width: calc(2 * var(--width));
        height: calc(2 * var(--height));
    }

    &:nth-child(1):hover::after {
        left: -50%;
        top: -50%;
        background: #27ae60;
    }

    &:nth-child(2):hover::after {
          right: -50%;
          top: -50%;
          background: #c0392b;
    }

    &:nth-child(3):hover::after {
          left: -50%;
          bottom: -50%;
          background: #34495e;
    }
 
    &:nth-child(4):hover::after {
          right: -50%;
          bottom: -50%;
          background: #2980b9;
    }
}
```

  


注意，我们使用 CSS 伪元素 `::after` 添加了一个层，这个层应用了 `#filter` 滤镜，这个滤镜的主要效果是由 `<feTurbulence>` 和 `<feDisplacementMap>` 滤镜制作， 根据 `<feTurbulence>` 生成的噪声图像对源图形进行位移，产生扭曲效果。使 `::after` 在视觉上具有一种类似波纹、水波或云雾等效果。具体代码如下所示：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter"  color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="6" in="SourceGraphic" result="TURBULENCE"/>
            <feDisplacementMap in="SourceGraphic" in2="TURBULENCE" result="DISPLACEMENT_MAP" scale="100" />
        </filter>
    </defs>
</svg>
```

  


其中 `<feTurbulence>` 生成一个具彩色效果的纹理图，它还没有应用到 `<feDisplacementMap>` 滤镜上时，按钮悬浮状态的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da6d4653eca44c3a83dd1a842460c34b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=482&s=7655755&e=gif&f=209&b=040404)

  


像不像七彩云朵的效果。

  


注意，在我们这个示例中，`<feTurbulence>` 生成的彩色纹理图只是作为位移图像，`<feDisplacementMap>` 根据位移图像对伪元素 `::after` 自身（源图形）进行位移，产生扭曲效果。再结合 CSS 位置的变化，从而实现我们所需要的按钮效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a8e7f00b8984c12adbcc602870c06fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=622&s=5151451&e=gif&f=151&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/wvbrzOg

  


在这个基础上，我们可以演变出其他扭曲效果。例如，下面这个示例，我们分别给 `<feTurbulence>` 滤镜的 `baseFrequency` 和 `numOctaves` 以及 `<feDisplacementMap>` 滤镜的 `xChannelSelector` 、 `yChannelSelector` 和 `scale` 等属性的值提供调节器，你可以通过调整相关的参数查看最终的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34780adbe7cb4337857d248c80042305~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=422&s=1755077&e=gif&f=384&b=171616)

  


> Demo 地址：https://codepen.io/airen/full/GRaMzwE

  


## 小结

  


有关于位移滤镜我们就介绍到这里了。简单回顾一下这节课的内容。

  


在这节课中，我们主要探讨了 SVG 滤镜中 `<feDisplacementMap>` 滤镜基元。首先，介绍了位移滤镜的基本原理，即通过位移图像的像素值移动源图像的像素，产生扭曲效果。然后，详细讲解了如何定义和应用滤镜，包括使用 `<feTurbulence>` 生成噪声图像，并将其与 `<feDisplacementMap>` 结合来实现位移效果。

  


小册后续的课程中还会继续应用到位移滤镜 `<feDisplacementMap>` 相关特性。你将在后续的课程中进一步的了解该滤镜，并通过与其他滤镜相结合，创作出更多有趣的 UI 视觉效果！