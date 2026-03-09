一直以来，Web 开发者都习惯了使用标准的红绿蓝（sRGB）来定义 Web 中的颜色。事实上，这也是近 25 年以来，CSS 中唯一的颜色色域，同时也是显示器最常见的颜色空间。随着显示器能够显示的颜色越来越广泛，CSS 也开始有了变化。

**[CSS 颜色 Level4](https://www.w3.org/TR/css-color-4/)** 开始，为 Web 添加了许多新的颜色空间，其中一些颜色空间，例如 Display P3 使 CSS 有了更广泛的色域。这意味着，我们将可以访问更多颜色，而且这些颜色比我们一直在使用的颜色更加鲜艳。换句话说，CSS 现在可以支持高清（高清晰度）显示器，指定来自 HD 色域的颜色，同时还提供具有特定专业化的颜色空间。在这节课中，我们将一起探讨新的 CSS 颜色空间，以及如何使用这些新的颜色空间为 Web 设置高清的颜色。

## 概述

颜色与 Web 的问题在于，**CSS 并不支持高清晰度的准备工作**。CSS 在 1996 年引入 Web 时，大多数计算机显示器都非常糟糕，大多不是高清的。无论是使用 RGB 、HSL 或 HEX （十六进制）定义的颜色，都是在 sRGB 色域内，仅适用于当时的显示器。

现在，大多数新设备都具备广色域显示能力，比如使用 [Display P3 色域](https://en.wikipedia.org/wiki/DCI-P3)，甚至还有像 [Rec.2020](https://en.wikipedia.org/wiki/Rec._2020) 更大的色域。广色域显示器能够显示比 sRGB 更多的颜色。正如 CSS 工作组的 @Lea Verou 所说，“我们的网站失真了，因为显示器屏幕的颜色增长速度要比 CSS 颜色增长速度快”。

庆幸的是，CSS 正在努力赶上，例如，CSS 颜色模块 Level 4 规范新增了多个新的颜色函数，它们都允许你使用色相、明度和饱和度等属性来指定颜色。新的颜色功能使你能够使用超出 sRGB 色域的更加生动的颜色，因此在支持的显示器屏幕上可以使用更广泛的颜色范围。

例如，你可以使用新的 CSS 颜色格式：`lab`、`lch` 或 `display-p3` ，使得你的 Web 应用或页面可以更充分利用大多数屏幕能够显示的广泛颜色范围。这样一来，Web 上就能使用高清颜色，不会使得你的 Web 失真。

## 重要的几个概念

在深入探讨 CSS 颜色空间和如何给 Web 设置高清颜色之前，有几个概念需要先了解。

### 色域是什么？

色域是可以显示的颜色范围，或者说是它可供选择的颜色范围。即一种设备或媒介所能表现的颜色的范围。不同的设备、媒介、颜色模型或者色彩空间可以有不同的色域。例如，印刷品的色域和电脑显示器的色域是不同的，同样的颜色在这两种媒介上可能表现得不一样。比如，下图中三角形越大的，表示可选择的颜色数量就越多：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd66b75f887643aa84ab44599d25492a~tplv-k3u1fbpfcp-zoom-1.image)

> 上图来自：<https://en.wikipedia.org/wiki/DCI-P3>

从图中不难发现，Rec.2020 可选颜色要比 sRGB 可选颜色多得多。

颜色色域也可以有一个名称。就像人一样，有张三李四，根据不同的尺寸定义不同的名称，这样做是为了更好地帮助人们进行沟通。学习这些颜色色域名称有助于你快速理解和沟通一系列颜色。稍后会向你介绍七个新的颜色色域，即 sRGB 、RGB 98、Display P3、Rec.2020、ProPhoto、CIE 和 HVS 等。描述它们的不同特点，帮助你选择使用哪种颜色空间和颜色范围。

### 人类视觉色域是什么？

人类视觉色域指的是人眼能够看到（感知）的全部颜色范围，也就是我们所能观察到的所有颜色的集合。它是一个三维的色彩空间，通常用[色度图](https://en.wikipedia.org/wiki/Chromaticity)来表示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7b962cdcf24404b8d7549ae6a3a5604~tplv-k3u1fbpfcp-zoom-1.image)

> 上图来自：<https://en.wikipedia.org/wiki/Chromaticity>

上图中，最外层的形状就是我们人类可以看到的全部颜色，而内部的三角形则是 `rgb()` 函数的范围，也就是 sRGB 色域。正如你上面看到的比较两个色域大小的三角形一样，在下面你也会发现三角形。这是业界用来交流关于颜色色域并进行比较的方式。

需要知道的是，人类视觉色域的大小和形状受到多种因素的影响，包括眼睛对颜色的感知机理、色觉细胞的数量和种类等。理解人类视觉色域可以帮助我们更好地了解和应用颜色学。

### 什么是颜色空间？

为了理解 CSS 中如何描述颜色，快速了解一下颜色空间将有所帮助。颜色空间是根据已定义的颜色模型对颜色进行分组的系统。颜色空间提供了一种清晰和一致的方式来描述颜色，同时在转换为不同的颜色空间时保持外观不变。许多颜色空间是简单的 3D 形状，如立方体或圆柱体。这种颜色排列决定了相邻的颜色和插值颜色的方法。

在 [CSS 颜色模块 Levle4](https://www.w3.org/TR/css-color-4/) 之前，CSS 中的颜色是 RGB（红、绿和蓝）颜色空间和色域（所有颜色的总范围）中定义的。它类似于矩形的颜色空间，可以通过在三个轴上指定坐标来访问颜色。而 HSL 则是一个圆柱形的颜色空间，可以通过色相轴和 `s` 与 `l` 两个轴上的坐标来访问颜色。

将半个打开的 RGB 立方体与切片的 HSL 圆柱体并排显示，可以展示如何在各个空间将颜色打包到对应的形状中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/485286532ad14d35871b15104eff45db~tplv-k3u1fbpfcp-zoom-1.image)

> 上图来自于 <https://en.wikipedia.org/wiki/HSL_and_HSV>

相应的，[CSS 颜色模块 Level4 规范](https://www.w3.org/TR/css-color-4/)中引入了 12 种新的颜色空间，它们分别是 sRGB Linear、LCH、OKLCH、 LAB、OKLAB、Display P3、Rec.2020 、a98 RGB、ProPhoto RGB 、XYZ 、XYZ D50 和 XYZ D65 等，它们可以查找从先前共享的七种颜色空间中的颜色。

换句话说，在 [CSS 颜色模块 Level4 规范](https://www.w3.org/TR/css-color-4/) 中，它提供了更多的特性，比如：

*   有了对其他空间和色域的支持，你不再局限于在 sRGB 颜色空间中描述颜色；你现在可以使用 Display P3，CIELAB 和 OKLAB 色彩空间。
*   Display P3 使用 P3 色彩空间，代表了比标准 sRGB 更广泛的颜色范围。它对于在现代显示器上使用的更生动的颜色非常有用。
*   CIELAB 是一种均匀的颜色空间（UCS），根据人眼的感知定义颜色。
*   OKLAB 是一种新的色彩空间，使用与 CIELAB 相同的模型结构，但是通过“对一组视觉上相似颜色的数据集进行数字优化”制作，因此值的准确性比 CIELAB 更高。
*   ……

与轮子、圆柱体或立方体不同，CIELAB 和 OKLAB 色彩空间可以表示为以下三维空间：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a3f67ae619747cbab07dbe675700332~tplv-k3u1fbpfcp-zoom-1.image)

### 色域和颜色空间

颜色空间是颜色映射，其中颜色色域是颜色的范围。将颜色色域视为粒子的总和，而将颜色空间视为用于容纳该粒子范围的瓶子。

以下是一个互动的可视化演示，展示了我的意思。在这个色彩空间充满颜色粒子的演示中，可以点、拖动和缩放。然后更改颜色空间或在这个演示中称之为颜色模型，以查看其他空间的可视化。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c183b90fec6b405aae57d8d29d40bda7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 来源于 <https://codepen.io/meodai/full/zdgXJj/> （源码地址：<https://github.com/meodai/color-names）>

简单地说，色域与颜色空间之间的差别就是：

*   使用色域来描述颜色范围，例如低范围或窄色域与高范围或宽色域等。
*   使用色彩空间来讨论颜色的排列方式、用于指定颜色的语法、颜色的处理以及颜色的插值等。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc73a8cbe445411489553fb0a18071c8~tplv-k3u1fbpfcp-zoom-1.image)

> 上图来自于：<https://cran.r-project.org/web/packages/colordistance/vignettes/color-spaces.html>

## CSS 颜色空间

在 W3C 规范中，关于 CSS 颜色相关的规范已经历多次变更，尤其是在 CSS 颜色模块 Level4 中，在新的规范中为 CSS 颜色提供了很多新功能和工具。在介绍新功能之前，我们先来回顾一下传统 CSS 颜色空间的使用。

### 传统颜色空间的回顾

在 CSS 早期（自 CSS 引入到 Web 开始至 2000 年之间），Web 开发者一般会采用颜色名称（比如 `hotpink`）、 十六进制（比如 `#09f90f`）、`rgb()` （比如 `rgb(0,10,20)`）、`rgba()` （比如 `rgba(0, 10, 20 ,.5)`）或关键词 `currentColor` 来指定颜色（`<color>`）属性的值。大约 2010 年左右，你可以使用 `hsl()` 或 `hsla()` 来指定颜色属性的值。然后 2017 年，带有透明度的十六进制出现了。最近几年，你还可以使用 `hwb()` 来指定颜色属性的值。

但不管使用哪种方式，这些指定的颜色都是在同一色域 sRGB 中的颜色。也就是说，我们以往使用的颜色空间都是参考同一色域 sRGB 中的颜色。

#### HEX（十六进制）

十六进制颜色空间使用[十六进制数字](https://en.wikipedia.org/wiki/Hexadecimal)指定 `R`、`G`、`B` 和 `A`。以下代码示例显示了该语法可以指定的红色、绿色和蓝色以及不透明度的所有方式。

```CSS
.hex-colors {
    /* 经典的用法 */
    --3-digits: #49b;
    --6-digits: #4499bb;

    /* 带透明通道的 Hex 用法 */
    --4-digits-opaque: #f9bf;
    --8-digits-opaque: #ff99bbff;
}
```

#### RGB

RGB 颜色空间直接访问红色、绿色和蓝色通道。它允许指定 `0 ~ 255` （或 `0% ~ 100%`）之间的数值。这种语法在规范之前就已经存在，因此你在网站中会看到逗号或空格分隔符两种语法。

```CSS
.rgb-colors {
    --classic: rgb(64, 149, 191);
    --modern: rgb(64 149 191);
    --percents: rgb(25% 58% 75%);

    --classic-with-opacity-percent: rgb(64, 149, 191, 50%);
    --classic-with-opacity-decimal: rgb(64, 149, 191, .5);

    --modern-with-opacity-percent: rgb(64 149 191 / 50%);
    --modern-with-opacity-decimal: rgb(64 149 191 / .5);

    --percents-with-opacity-percent: rgb(25% 58% 75% / 50%);
    --percents-with-opacity-decimal: rgb(25% 58% 75% / 50%);
}
```

在新语法规则之间，在 RGB 颜色空间上使用 `rgba()` 函数，指定透明通道 `a` 的值：

```CSS
.rgba-color {
    --classic-with-opacity-percent: rgba(64, 149, 191, 50%);
    --classic-with-opacity-decimal: rgba(64, 149, 191, .5);
}
```

如果向前看的话，逗号分隔符不再是必需的，包括以前的 `rgba()` 也不再是必需的。

#### HSL

作为最早面向人类语言和交流的色彩空间之一，HSL（色相、饱和度和亮度）在不需要你的大脑知道红色、绿色和蓝色如何交互的情况下提供了 sRGB 色域中的所有颜色。与 RGB 一样，它最初的语法中也有逗号，但向前看，逗号不再是必需的。

```CSS
.hsl-colors {
    --classic: hsl(200deg, 50%, 50%);
    --modern: hsl(200 50% 50%);
    
    --modern-with-opacity-percent: hsl(200 50% 50% / 50%);
    --modern-with-opacity-decimal: hsl(200 50% 50% / .5);
}
```

`hsl()` 和 `rgb()` 类似，有一个 `hsla()` 函数，专门来指定颜色透明通道的：

```CSS
.hsla-colors {
    --classic-with-opacity-percent: hsla(200deg, 50%, 50%, 50%);
    --classic-with-opacity-decimal: hsla(200deg, 50%, 50%, .5);
}
```

当然，如果往前看的话，`hsla()` 也同样会慢慢退出历史的舞台。

#### HWB

另一个面向人类描述颜色的 sRGB 色域的颜色空间是 HWB（色相、白度、黑度）。允许你选择一种色相，并混入白色或黑色来找到所需的颜色。

```CSS
.hwb--colors {
    --modern: hwb(200deg 25% 25%);
    --modern2: hwb(200 25% 25%);

    --modern-with-opacity-percent: hwb(200 25% 25% / 50%);
    --modern-with-opacity-decimal: hwb(200 25% 25% / .5);
}
```

### 认识新的颜色空间

以下颜色空间提供比 sRGB 更大的颜色范围。Display P3 色彩空间提供的颜色几乎是 sRGB 的两倍，而 Rec.2020 提供的颜色几乎是 Display P3 的两倍。那是非常多的颜色！

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cddfe09178304ce9b5ae188030b65277~tplv-k3u1fbpfcp-zoom-1.image)

与此同时，CSS 也新增了一些颜色函数。一种可以访问 sRGB 色域之外颜色的颜色空间！它们可以很容易为显示器创建色域外颜色的空间。比如，LCH 、OKLCH 、LAB 和 OKLAB 等，它们都是可以访问 CIE 空间中的颜色，都能够表示整个人类可见的颜色光谱。

#### LAB

一种访问 CIE 色域的颜色空间，具有感知线性的亮度（`L`）维度。LAB 中的 `A` 和 `B` 表示人类视觉的独特轴：红绿和蓝黄。当 `A` 被赋予正值时，它添加红色，当它小于 `0` 时，它添加绿色。当 `B` 被赋予正值时，它添加黄色，而负值是朝向蓝色的。

也就是说，CSS 的 `lab()` 函数会使用颜色空间中 `a` 和 `b` 轴上的亮度、红绿色和黄蓝色表示 CIELAB 颜色。例如：

```CSS
.lab-red {
    color: lab(87.6 125 104);
}

.lab-green {
    color: lab(87.8 -79 81);
}

.lab-opacity {
    color: lab(58% -16 -30 / 50%);
    
    /* 等同于 */
    color: lab(58% -16 -30 / .5);
}
```

#### LCH

这个颜色空间是以人类视觉为模型，并提供了指定任何这些颜色的语法。LCH 通道包括亮度、色度和色相。色相类似于 HSL 和 HWB中 的角度。亮度是介于 `0 ~ 100` 之间的值，但不像 HSL 的亮度，它是一种特殊的“感知线性”的以人为中心的亮度。色度类似于饱和度；可以从 `0 ~ 230` 范围内，但在技术上是无界的。

CSS 中的 `lch()` 函数会使用颜色的亮度、色度和色相表示 CIELAB 颜色。色相是代表颜色的颜色轮上的角度。

```CSS
.lch-red {
    color: lch(54.3 107 40.9deg);
}

.lch-green {
    color: lch(87.8 113 134deg);
}

.lch-opacity {
    color: lch(58% 32 241 / 50%);
    
    /* 或者 */
    color: lch(58% 32 241 / .5);
}
```

#### OKLCH

这个颜色空间是针对 LCH 的修正。可以使用 `L`（亮度）、`C`（色度）和 `H`（色相）来定义颜色，其中：

*   `L` 表示感知线性亮度；
*   `C` 表示色度；
*   `H` 表示色相。

如果你曾经使用 HSL 或 LCH，那么这个空间会让人感到亲切。针对 `H` 选择颜色轮上的角度，通过调整 `L` 选择亮度或暗度量，但这里我们有色度而不是饱和度。它们非常相似，只是亮度和色度的调整往往成对出现，否则很容易要求高色度颜色时超出目标色域。

相比于 LCH，使用 OKLCH 可以更好地控制色彩饱和度，尤其在蓝色和紫色色调中表现更出色，同时它也支持高动态范围。

```CSS
.oklch-colors {
    --percent-and-degrees: oklch(64% .1 233deg);
    --just-the-degrees: oklch(64 .1 233deg);
    --minimal: oklch(64 .1 233);

    --percent-opacity: oklch(64% .1 233 / 50%);
    --decimal-opacity: oklch(64% .1 233 / .5);
}
```

#### OKLAB

它是对 LAB 颜色空间的修正。它被认为是一种高质量的图像处理颜色空间，尤其适用于 CSS 中的渐变和色彩函数处理。与其他一些可能存在色相偏移的颜色空间不同，OKLAB 可以提供感知一致、更加自然的颜色渐变。OKLAB 中的 `L` 通道表示亮度，`a` 和 `b` 则表示颜色范围，它的表现类似于 RGB 或 LAB 中的 `A` 和 `B` 通道，但 OKLAB 中的颜色是感知线性的，所以可以提供更好的渐变和插值效果。

```CSS
.oklab-colors {
    --percent-and-degrees: oklab(64% -.1 -.1);
    --minimal: oklab(64 -.1 -.1);

    --percent-opacity: oklab(64% -.1 -.1 / 50%);
    --decimal-opacity: oklab(64% -.1 -.1 / .5);
}
```

#### Display P3

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96441e64b8324d2ea3744106471eaacd~tplv-k3u1fbpfcp-zoom-1.image)

Display P3 是一种广色域颜色空间，用于显示器和其他电子设备上的显示。它使用一种相对较宽的色域，可以显示比标准 sRGB 颜色空间更多的颜色，从而提供了更高的动态范围、更好的色彩深度和更准确的颜色。Display P3 最初由苹果公司在其 iMac 设备中引入，并迅速在许多其他电子设备中得到使用，尤其是一些支持 HDR 技术的电视和显示器。为了最大化利用 Display P3 的优势，设计人员可以使用支持该颜色空间的设备和软件来创建和处理图像和视频资产，以确保在各种显示器和设备上呈现一致和准确的颜色。

如果希望将 Display P3 颜色空间运用到 Web 上，那就需要结合 CSS 的 `color()` 函数一起使用：

```CSS
.display-p3-colors {
    --percents: color(display-p3 34% 58% 73%);
    --decimals: color(display-p3 .34 .58 .73);

    --percent-opacity: color(display-p3 34% 58% 73% / 50%);
    --decimal-opacity: color(display-p3 .34 .58 .73 / .5);
}
```

> 有关于 `color()` 函数的介绍，稍后会详细介绍。

#### Rec.2020

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/367ba52fe813408db12e8a642876b6a8~tplv-k3u1fbpfcp-zoom-1.image)

Rec.2020 是一种 ITU-R 建议规范，它是超高清电视（UHDTV）的一部分，也是一种广色域颜色空间标准。它是根据电视和视频技术需求而开发的，旨在提供比传统的 sRGB 和 Rec.709 色彩空间更高的动态范围和更丰富的显示颜色。Rec.2020 的色域比 sRGB 和 Rec.709 更广，可以呈现更多的红色、绿色和蓝色的颜色。由于 Rec.2020 可以呈现更高的动态范围和更全面的色彩，它是许多高端电视和显示器以及视频产业中广泛使用的颜色空间标准。同时，Rec.2020 也是许多 4K 和 8K 电视、监视器和摄像机的主要颜色空间标准之一。

在 CSS 中使用 Rec.2020 颜色空间，也要像 Display P3 一样，使用 `color()` 函数：

```CSS
.rec2020-colors {
    --percents: color(rec2020 34% 58% 73%);
    --decimals: color(rec2020 .34 .58 .73);

    --percent-opacity: color(rec2020 34% 58% 73% / 50%);
    --decimal-opacity: color(rec2020 .34 .58 .73 / .5);
}
```

#### A98 RGB

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/286bb8882bfe48a2b87c4da4a893a081~tplv-k3u1fbpfcp-zoom-1.image)

A98 RGB 是一种颜色空间，也称为 Adobe RGB（1998）色彩空间，由 Adobe Systems 于 1998 年推出并得到广泛应用，主要用于数字摄影、出版和印刷行业中的颜色管理。与 sRGB 相比，A98 RGB 可以呈现更广泛的颜色范围，尤其是在红色和绿色方向上，提供更高的色彩深度和更准确的颜色显示。A98 RGB 是一个较大的颜色空间，其色域比 sRGB 更广，但比 DCI-P3 和 Rec.2020 色域更小。它通常用于印刷行业中，其中颜色准确性和细节非常重要，但在数字媒体中的应用相对较少。

```CSS
.a98-rgb-colors {
    --percents: color(a98-rgb 34% 58% 73%);
    --decimals: color(a98-rgb .34 .58 .73);

    --percent-opacity: color(a98-rgb 34% 58% 73% / 50%);
    --decimal-opacity: color(a98-rgb .34 .58 .73 / .5);
}
```

#### ProPhoto RGB

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afbffa84a80b4032bb6f341d00bbb0f0~tplv-k3u1fbpfcp-zoom-1.image)

ProPhoto RGB 是一种广泛使用于数字摄影和印刷行业的颜色空间，它具有非常广泛的色域，可以展示大多数 RGB 颜色。它在色彩范围方面比其他常见的颜色空间（如 sRGB 和 Adobe RGB）更广，因此更适合于高质量的数字图像处理，可以呈现更微妙的色调和更丰富的颜色。ProPhoto RGB 常用于数字摄影，因为它可以捕捉相机所能看到的最广泛的色域，同时在后期处理和打印时提供更大的灵活性。但是，由于其色域过大，可能有一部分颜色会在转换为更小的颜色空间时丢失，因此需要进行谨慎处理和管理。

这种广色域空间是由柯达（Kodak）公司创建的，它独特地提供超宽范围的原色，并在改变亮度时呈现最小的色调变化。它还声称可以覆盖迈克尔·波因特 1980 年记录的 100％ [真实世界的表面颜色](https://en.wikipedia.org/wiki/Munsell_color_system)。

```CSS
.prophoto-rgb-colors {
    --percents: color(prophoto-rgb 34% 58% 73%);
    --decimals: color(prophoto-rgb .34 .58 .73);

    --percent-opacity: color(prophoto-rgb 34% 58% 73% / 50%);
    --decimal-opacity: color(prophoto-rgb .34 .58 .73 / .5);
}
```

#### XYZ, XYZ-d50, XYZ-d65

XYZ 是一种基于 CIE1931 标准观察者模型的颜色空间，被认为是一种“参考空间”，通常用于计算和处理其他颜色空间中的颜色。XYZ 空间不是基于某种物理测量，而是基于人眼对颜色的感知，并将其定义为一组基色的线性组合。

XYZ-D50 和 XYZ-D65 都是基于 XYZ 颜色空间的变体，它们使用不同的白点进行标准化。XYZ-D50 使用标准照明条件下的 D50 白点（即日光色温为 5000K ），而 XYZ-D65 使用标准照明条件下的 D65 白点（即日光色温为 6500K）。

> 注意，白点是颜色空间的属性，表示真正的白色在该空间内存在的位置。对于电子屏幕而言，D65 是最常见的白点，它代表摄氏 6500 度的色温。在颜色转换中，白点的匹配非常重要，以避免温暖或寒冷的色温影响。

这些变体通常用于为不同的应用程序提供标准化的颜色空间，以确保在各种环境和条件下呈现一致和准确的颜色。例如，D50 通常用于打印和出版行业，而 D65 通常用于图形设计和数字图像处理。

```CSS
.xyz-colors {
    --percents: color(xyz 22% 26% 53%);
    --decimals: color(xyz .22 .26 .53);

    --percent-opacity: color(xyz .22 .26 .53 / 50%);
    --decimal-opacity: color(xyz .22 .26 .53 / .5);
}

.xyz-d50-colors {
    --percents: color(xyz-d50 22% 26% 53%);
    --decimals: color(xyz-d50 .22 .26 .53);

    --percent-opacity: color(xyz-d50 .22 .26 .53 / 50%);
    --decimal-opacity: color(xyz-d50 .22 .26 .53 / .5);
}
  
.xyz-d65-colors {
    --percents: color(xyz-d65 22% 26% 53%);
    --decimals: color(xyz-d65 .22 .26 .53);

    --percent-opacity: color(xyz-d65 .22 .26 .53 / 50%);
    --decimal-opacity: color(xyz-d65 .22 .26 .53 / .5);
}
```

#### 自定义颜色空间

[CSS 颜色模块 Level5 ](https://www.w3.org/TR/css-color-5)规范还提供了一种教浏览器如何使用[自定义颜色空间](https://www.w3.org/TR/css-color-5/#custom-color)的方法。这是一个[ ICC 配置文件](https://en.wikipedia.org/wiki/ICC_profile)，告诉浏览器如何解析颜色。

换句话说，用户可以自己创建或指定的用于描述颜色的特定颜色范围。在 Web 开发中，自定义颜色空间允许开发人员使用包含特定颜色数据的颜色配置文件，这些数据可以用于准确地呈现数字图像和 UI 元素的颜色。例如：

```CSS
@color-profile --foo {
    src: url(./custom.icc); /* 用户自定义颜色数据，即颜色空间配置文件 */
}
```

加载后，可以使用 `color()` 函数访问此自定义配置文件中的颜色，并指定其通道值。

```CSS
.custom-color-spaces {
    background: color(--foo 1 0 0);
}
```

可以说，新颜色空间各有自己的优缺点，大家在选用时，可以根据相应的场景来做选择：

| **颜色空间**                  | **优点**                                                                 | **缺点**                                                                     |
| ------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **LAB**                   | 感知一致的渐变高动态范围                                                           | 可能存在色相变化在阅读值时，很难手工编写或猜测颜色                                                  |
| **LCH**                   | 由于是感知线性的（大多数情况下），颜色处理可预测使用熟悉的通道具有允满活力的渐变                               | 容器超出色域在极少情况下，渐变可能需要中间点进行调整，以防止色相移动                                         |
| **OKLCH**                 | 处理蓝色和紫色色调更出色感知线性的亮度使用熟悉的通道高动态范围                                        | 容器超出色域新的和相对未被探索的仅有少数颜色选择器                                                  |
| **OKLAB**                 | 可以提供更好的渐变和插值效果感知线性的亮度不像 LAB 那样存在色相移动感知一致的渐变                            | 新的和相对未探索的仅有少数颜色选择器                                                         |
| **Display P3**            | 极好的支持，被认为是 HDR 显示器的基线比 sRGB 多 50％ 的颜色DevTools 提供了一个优秀的颜色选择器            | 最终会被 Rec.2020 和 CIE 空间超越                                                   |
| **Rec2020**               | 具备超高清颜色                                                                | 尚未在消费者中普及在手持设备或平板电脑中不常见                                                    |
| **A98 RGB**               | 颜色空间比 sRGB ，但比 DCI-P3 和 Rec.2020 色域更小                                  | 数字设计师中使用的空间相对较少没有很多人将调色板从 CMYK 转换过来使用                                      |
| **ProPhoto RGB**          | 颜色空间的色域范围是当前已知 RGB 颜色空间中最宽的能够显示人眼可见的大多数颜色高精度和详细的颜色还原改变亮度时具有最小的色调变化原色鲜艳 | 大约 13％ 所提供的颜色是虚构的，意味着它们不在人类可见的光谱范围内没有被应用程序广泛支持在共享或在较小的色域空间中显示图像时可能会引起兼容性问题 |
| **XYZ, XYZ-d50, XYZ-d65** | 线性光的访问具有方便的用途适用于物理颜色混合                                                 | 不像 LCH、OKLCH、LAB 和 OKLAB那样具有感知上的线性属性                                       |
| **自定义颜色空间**               | 更准确的颜色呈现更大的独立性                                                         | 浏览器支持不足颜色空间的复杂性                                                            |

有关于它们的使用方式，可以查看下面这个 Demo：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/335c379f3c484f519715a1acf2cd986b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/web-dot-dev/full/LYBNbzp> （来自 [web.dev](https://codepen.io/web-dot-dev) ）

### 如何选择颜色空间

一下子，可用于 CSS 的颜色空间新增了这么多。可选择的条件多了，选择就犯难了，甚至在知道这些颜色空间及其效果之后，会感到不知所措，在实际使用的时候，就更不知道要选择哪个颜色空间，或者如何选择颜色空间了。

就我个人经验来看，选择颜色空间的过程就像我在\*\*[现代 Web 布局](https://juejin.cn/book/7161370789680250917?utm_source=profile_book)\*\*中所说的那样：

> 虽然现代 Web 布局中有很多可用于 Web 布局的技术，但并没有哪一种布局技术可以适用于所有 Web 布局，它们之间更没有好坏之分，只有适合与否。

这个观点同样可以用于颜色空间选择上。也就是说，我并不认为有一个颜色空间可以适用于所有任务。每个颜色空间都有产生所需结果的时刻，也不会有最好的空间一说，总有适合自己的。

但就目前来说，CIE 空间是我们使用新颜色空间的起点，我们可以在项目中开始使用像 `lab()` 、`oklab()` 、`lch()` 和 `oklch()` 等颜色函数。如果它们的输出不符合你的需求，就可以尝试使用其他的颜色空间，比如 `color()` 指定一个颜色空间。

另外，这里有一个小技巧与大家分享：**对于混合颜色和渐变，使用** **`oklab()`** **更好；对于颜色系统和整体 UI 颜色，则使用** **`oklch()`** **更好**。我也会在后面的课程中详细介绍这两个颜色函数。

## 给 Web 设置高清颜色

现在你应该知道了，在 CSS 中使用 HEX（`#rrggbb` 或 `#rgb`）、`rgb(r g b)` 、`hsl(h s l)` 和 `hwb(h w b)` 颜色格式设置的颜色都是 sRGB 颜色空间中的色域，它相对于新的颜色空间，比如 Display P3、Rec.2020 和 CIELAB 等，颜色数量要少得多，也容易使你的 Web 应用或 Web 页面在高清屏幕下失真。为了避免这个现象，需要使用新的颜色函数，比如 `lab()` 、`lch()` 、`oklab()` 和 `oklch()` 等。

不过，`lab()` 、`lch()` 、`oklab()` 和 `oklch()` 也只能使用相应颜色空间中的色彩，如果你要使用 Display P3、Rec.2020、A98 RGB、ProPhoto RGB、XYZ、XYZ-d50、XYZ-d65 以及自定义颜色空间中的色彩，还是需要使用 CSS 的 `color()` 函数。

### CSS 的 color() 函数

CSS 的 `color()` 函数是 [CSS 颜色模块 Level4 新增的一个颜色函数](https://www.w3.org/TR/css-color-4/#color-function)。该函数允许在特定颜色空间中指定颜色，而不是在大多数其他颜色函数（比如 `rgb()` 、`hsl()` 、`hwb()` 或 HEX）中使用的隐式的 sRGB 颜色空间。它的语法规则很简单：

```CSS
color() =  color(colorspace R G B / A)
```

其中：

*   **`colorspace`** ：指的是颜色空间名称，它可以是预定义的颜色空间之一，例如：`srgb`、`srgb-linear`、`display-p3`、`a98-rgb`、`prophoto-rgb`、`rec2020`、`xyz`、`xyz-d50` 和 `xyz-d65` ，还可以是自己自定义的颜色空间名称。
*   **`R`** 、**`G`** 、**`B`**  ：分别指的是颜色的红色（`R`）、绿色（`G`）和蓝色（`B`）通道的值。其中：`1 0 0` 表示完全红色，`0 0 1` 表示完全蓝色，`0 1 0` 表示完全绿色。它们可以是数值（`<number>`），也可以是百分比值（`<percentage>`）。
*   **`A`** ：是指颜色的透明通道的值，该值是一个可选值。

例如：

```CSS
.element {
    background-color: color(display-p3 1 0 0.87)
}
```

正如你所看到的，在 `color()` 函数指定了一个名为 `display-p3` 的颜色空间，并且它使用了三个数值，分别表示颜色的红色、绿色和蓝色通道的值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab0377417b7c42fea131cca157ee26cf~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGmxBzL>

正如上例所示，你可以在 `color()` 函数中基于广色域设置颜色的值，例如：

```CSS
.element {
    --srgb: color(srgb 1 0 1); /* 基于 sRGB 颜色空间 */
    --srgb-linear: color(srgb-linear 100% 100% 100% / 50%); /* 基于 sRGB Linear 颜色空间 */
    --display-p3: color(display-p3 0.8 0.9 0); /* 基于 Display P3 颜色空间 */
    --rec2020: color(rec2020 0 0 0); /* 基于 Rec.2020 颜色空间 */
    --a98-rgb: color(a98-rgb 1 1 1 / 25%); /* 基于 A98 RGB 颜色空间 */
    --prophoto: color(prophoto-rgb 10% 20% 30%); /* 基于 ProPhoto RGB 颜色空间 */
    --xyz: color(xyz 1 0 0.3); /* 基于 XYZ 颜色空间 */
    --xyz-d50: color(xyz-d50 0 1 1); /* 基于 XYZ-d50 颜色空间 */
    --xyz-d65: color(xyz-d65 0.3 0 1 / 50%); /* 基于 XYZ-d65 颜色空间 */
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/220c8d9794fb4c66a393fb596633c04b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYPLPMP>

需要注意的是，**`color()`** **函数不能与 HSL、HWB、LCH 、OKLAB 和 OKLAC 等颜色空间一起使用，否则会被视为无效 CSS 规范**。例如，下面的 CSS 规则都将是无效的：

```CSS
.void-css-colors {
    --lab: color(lab 1 0 0);
    --oklab: color(oklab 0 0 1);
    --lch: color(lch 1 1 1);
    --oklch: color(oklch 0.93 0.39 1);
    --hwb: color(hwb 0 0 0 / .5);
}
```

### 给 Web 设置高清颜色

到目前为止，我们给 Web 元素设置高清颜色的方式主要有：

*   使用 `lch()` 、`lab()` 、`oklch()` 和 `oklab()` 等函数给元素设置颜色；
*   使用 `color()` 函数给元素设置颜色。

有关于 `lch()` 、`lab()` 、`oklch()` 和 `oklab()` 函数的使用很简单，我们可以像下面这样使用：

```CSS
:root {
    --lab-red:lab(87.6 125 104);
    --lab-green:lab(87.8 -79 81);
    
    --lch-red:lch(54.3 107 40.9deg);
    --lch-green:lch(87.8 113 134deg);
    
    --oklab-red:oklab(0.63 0.22 0.13);
    --oklab-green:oklab(0.87 -0.2 0.18);
    
    --oklch-red:oklch(0.93 0.39 28deg);
    --oklch-green:oklch(0.87 0.29 142deg);
}
```

> 注意，在小册的上一节课《[10 | 现代 CSS 中的颜色格式：RGB、HSL、HWB、LAB 和 LCH](https://juejin.cn/book/7223230325122400288/section/7231515598088306720)》对 `lab()` 和 `lch()` 有过详细阐述，对于 `oklab()` 和 `oklch()` 函数，小册后面有独立的章节介绍。

不过，在给 Web 元素设置高清颜色的时候，更多是考虑使用 `color()` 函数。前面也介绍过，使用 `color()` 函数可以指定更广域的颜色空间，使得 Web 元素的颜色更高清。但是，我们在使用 `color()` 函数给 Web 元素设置高清颜色时，需要考虑到两点。即**浏览器对新的 CSS 颜色值的支持（比如** **`display-p3`** **、`rec2020`** **等）和屏幕设备显示这些颜色的能力**。

因此，我们有两种主要策略来更新你的 Web 项目颜色以支持广色域显示：

*   **优雅降级**：使用新的颜色空间，让浏览器和操作系统根据显示能力确定要显示哪种颜色。
*   **渐进增强**：使用 `@supports` 和 `@media` 来评估用户浏览器的能力，如果满足条件，则提供广色域颜色。

先来看优雅降级的方式。就拿 `display-p3` 为例吧，如果浏览器不支持 `display-p3` 或者设备没有能力支持这种色域，我们可以考虑将颜色回退到最接近的 sRGB 色域的值。我们可以这样写代码：

```CSS
.element {
    color: hotpink; /* 回退值 */
    color: color(display-p3 1 0 0.87); /* 如果设备支持，就使用该值 */
}
```

需要注意代码的书写顺序，sRGB 颜色空间的值要写在前面。这里涉及 CSS 的权重相关基础知识，就不做过多阐述了。

除了上面这种方式之外，原本我想借助 CSS 自定义属性中的 `var()` 函数的回退值做降级，比如：

```CSS
:root {
    --hd-css-color:color(display-p3 1 0 0.87);
}

.element {
    color: var(--hd-css-color, hotpink);
}
```

但它并不能如我预期的那样工作。这主要是因为 CSS 不会检查所引用的自定义属性的有效性，它只会检查是否已设置值（除了保证无效的 `initial` 值之外）。也就是说，只要自定义属性设置了一个值，它就不会使用回退值。

> 有关于 `initial` 更详细的介绍，可以阅读小册的《[09 | CSS 显式默认值：inherit 、initial 、unset revert](https://juejin.cn/book/7223230325122400288/section/7232094160071688227)》。对于自定义属性中的无效值以及有效的使用无效值，是 CSS 中自定义中相关的知识，小册后面介绍自定义属性的时候会介绍到这方面的知识，如果你急切想了解它的话，可以移步阅读《[条件 CSS 之 CSS 属性/值和 CSS 函数](https://juejin.cn/book/7199571709102391328/section/7217644982898720779)》一文。

虽然 `var()` 的回退值不起作用，但可以借助 CSS 自定义属性的另一特性（即**有效使用 CSS 自定义属性的无效值**）可以做一个优雅降级，但它需要依赖 CSS 的 `@supports` 功能才能实现：

```CSS
@supports (background: color(display-p3 1 1 1)) {
    :root {
        --supports-display-p3: ; /* 冒号(:)和分号(;) 之间有一个空格符 */
    }
}

body {
    --hotterpink: var(--supports-display-p3) color(display-p3 1 0 0.87);
    --hotpink: var(--hotterpink, hotpink);
    background: var(--hotpink);
}
```

如果检测不到对 `display-p3` 的支持，则 `--hotterpink` 将未定义并变为保证无效的初始值（`initial`）。在这种情况下，`--hotpink`将退回到 `hotpink`。你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85ab358e310b44a697b5c8f8f1f2d34d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxPoKM>

另一种方式是使用 CSS 的 `@property` 规则，将 `--hd-css-color` 的值注册为 `<color>` 类型，并且设置它的初始值为 `hotpink` ，然后将其值设置为 `color(display-p3 1 0 0.87)`。

```CSS
@property --css-hd-color {
    syntax: '<color>';
    initial-value: hotpink;
    inherits: true;
}

:root {
    --css-hd-color: color(display-p3 1 0 0.87);
}

body {
    background-color: var(--css-hd-color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd4f7326da7446a98133f6092083f718~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNaPJVJ>

对于不支持 `display-p3` 的设备，那么在 `:root{}` 中定义的 `--hd-css-color` 属性的值 `color(display-p3 1 0 0.87)` 就不会生效，它将会取 `@property` 中定义的初始值 `hotpink` 。

> 注意，CSS 的 `@property` 是 CSS 中 `@` 规则中的另一个，它属于 [CSS Houdini ](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Houdini)中的一部分，但它也可以用来注册一个 CSS 自定义属性。如果从未接触过这部分知识，不用着急，后面有一个章节会详细介绍它。

上面所介绍的都是优雅降级的方式，其实在介绍第二种的时候，也用到了 CSS 的 `@supports` 特性，我们可以使用它来检测浏览器是否支持 `color()` 属性。因此，在使用 `color()` 函数时，可以借助 `@supports` 来做检测：

```CSS
@supports(background: color(display-p3 1 1 1)) {
    :root {
        --hd-css-color: color(display-p3 1 0 0.87);
    }
}

:root {
    --hotpink: var(--hd-css-color, hotpink);
}
```

使用这个代码，你可以在整个代码中使用 `var(--hotpink)`。这个属性将会解析成 `color(display-p3 1 0 0.87)` 或者是 `hotpink`，这取决于浏览器对该特性的支持。

*   当浏览器支持 `color(display-p3 1 1 1)` 时，自定义属性 `--hd-css-color` 将被声明并具有 `color(display-p3 1 0 0.87)` 值 。
*   额外的自定义属性 `--hotpink` 是指 `--hd-css-color` 。在支持 `display-p3` 的浏览器中，`--hotpink` 会取 `--hd-css-color` 的值。在不支持 `display-p3` 的浏览器中，`--hd-css-color` 将不存在，所以它会退回到 `hotpink` 的值。

仅使用一个 `@supports` 来检测 `color()` 函数还不够完美，因为 `@supports` 只能用来检测浏览器是否支持 `color()` 函数，并不能检测出用户的显示器是否能支持广色域，比如 `display-p3` 。如果显示器不支持广色域的颜色，屏幕将显示最接近的、等同于 sRGB 域中的颜色。这意味着，不需要编写任何额外的代码即可为所有显示器提供支持。

然而，如果你想手动选择回退颜色，而不是让浏览器帮你做出选择，那么你就要在 `color()` 函数中传递第二个颜色值，但目前为止，还没有浏览器支持这种语法规则。例如：

```CSS
.element {
    color: color(display-p3 1 0 0.331, #f54281);
}
```

换句话说，如果你需要更精细的控制来实现某些高级操作，那么还得依赖 CSS 媒体查询。在 [CSS 媒体查询模块 Level4 中，提供了一个关于颜色空间相关的媒体查询 color-gamut](https://www.w3.org/TR/mediaqueries-4/%23color-gamut) ，它可以帮助你做更精细的控制。例如：

```CSS
:root {
  --hotpink: hotpink;
}

@media (color-gamut: p3) {
    :root {
        --hotpink: color(display-p3 1 0 0.87);
    }
}

body {
    background-color: var(--hotpink);
}
```

示例中的 `@media (color-gamut: p3)` 查询的是硬件是否支持 `p3` ，而不是浏览器支持。在一台 MacBook Pro 上，虽然该电脑上安装的浏览器不支持 `display-p3` ，但该电脑的显示器能够显示 `p3` 颜色。因此，该媒体查询将返回一个真（`true`）。最终 `color(display-p3 1 0 0.87)` 被运用于 `--hotpink` ，最终呈现给你的也是高清的粉红色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e0f1bfa543c48dab15fd14b27e67f10~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEqMPpN>

在这个例子中，我们明显是在检查 `display-p3`的支持，但我们还可以检查前面提到的更广色域的 `rec2020` 颜色空间。当前支持 `rec2020` 的屏幕数量很少，仅包括高清电视，这意味着它们在不久的将来不会成为开发人员的常见目标。你也可以检查 `srgb` 的支持，但是这几乎是所有显示器都支持的。

当然，如果你既想检测浏览器是否支持 `color()` 函数，又想检测硬件（比如显示器屏幕）是否支持广色域，那么你可以将 `@supports` 和 `@media` 结合起来使用。像下面这样：

```CSS
:root {
    --hotpink: hotpink;
}

@supports (color: color(display-p3 1 1 1)){
    @media (color-gamut: p3) {
        :root {
            --hotpink: color(display-p3 1 0 0.87);
        }
    }
}

body {
    background-color: var(--hotpink);
}
```

注意，代码的先后顺序，或者将 `:root{--hotpink: hotpink}` 也放到 `@supports` 中，但需要在条件前添加 `not` 关键词：

```CSS
/* 支持 color() 函数的浏览器 */
@supports (color: color(display-p3 1 1 1)){
    /* 支持 display-p3 的显示器 */
    @media (color-gamut: p3) {
        :root {
            --hotpink: color(display-p3 1 0 0.87);
        }
    }
}

/* 不支持 color() 函数的浏览器 */
@supports not (color: color(display-p3 1 1 1)) {
    :root {
        --hotpink: hotpink;
    }
}

body {
    background-color: var(--hotpink);
}
```

要是你的电脑屏幕支持 `display-p3` 颜色空间，且其安装的浏览器又支持 `color()` 函数的话，你将看到的最终效果如下所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/275cc9706d124000882a6a27e8c87d87~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJOgxQ>

### 使用浏览器开发者工具来调试颜色

不知道你是否和我有同样的困惑，在使用 `color()` 函数时，如何确定指定颜色空间中颜色的红色（R）、绿色（G）和蓝色（B）通道的值。

我这有一个小技巧，那就是使用浏览器开发者工具。比如 Chrome 浏览器的开发者工具，已经为颜色的调试提供了很全面的工具。就拿高清颜色来说，它在高清颜色色域（比如 `display-p3`）和 sRGB 色域之间画了一条线，清楚地展现选定颜色位于哪个色域中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fc8c6f9fed34608918dd3db7fd92f86~tplv-k3u1fbpfcp-zoom-1.image)

这有助于开发者在视觉上区分高清颜色和非高清颜色。在使用 `color()` 函数和新的颜色空间时，它尤其有用，因为它们能够生成非高清和高清颜色。如果你想要检查你的颜色位于哪个色域中，在弹出的颜色选择器中查看即可！

多年来，开发者工具颜色选择器就一直能够在诸如 `hsl()`、`hwb()`、`rgb()` 和 HEX 等颜色格式之间转换颜色。在样式面板中，单击一个方形色块来执行此转换。新的颜色工具不仅可以循环转换，还可以产生一个弹出窗口，作者就可以看到并选择他们想要的转换了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbde33920a8442ee9de31278af531967~tplv-k3u1fbpfcp-zoom-1.image)

在转换时，比如从高清转换为非高清时，开发者工具中的颜色选择器面板会剪切色域以适应空间，并用警告图标标记剪切的值。鼠标悬停在图标上可以查看原始值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a63ce84cea94d7685264ce99a873004~tplv-k3u1fbpfcp-zoom-1.image)

来看一个小示例。如果你想把一个 HEX 颜色，比如 `#09f` 转换成其他颜色，或高清颜色，你可以在开发者工具中像下面这人录屏一样操作：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00b36d8d452f46abb1a2f3bed2ea4519~tplv-k3u1fbpfcp-zoom-1.image)

将相应转换出来的代码复制到你的 CSS 中即可：

```CSS
:root {
    --hex: #09f;
    --rgb: rgb(0 153 255);
    --hsl: hsl(204deg 100% 50%);
    --hwb: hwb(204deg 0% 0%);
    --lch: lch(61 61.3 265.16);
    --lab: lab(61 -5.17 -61.08);
    --oklch: oklch(0.67 0.18 248.89);
    --oklab: oklab(0.67 -0.06 -0.17);
    --srgb: color(srgb 0.13 0.6 1);
    --display-p3: color(display-p3 0.29 0.59 0.97);
    --a98-rgb:color(a98-rgb 0.35 0.59 0.99);
    --prophoto-rgb:color(prophoto-rgb 0.47 0.52 0.95);
    --rec2020: color(rec2020 0.38 0.55 0.97);
    --xyz: color(xyz 0.3 0.31 1.01);
    --xyz-d50: color(xyz-d50 0.27 0.3 0.76);
    --xyz-d65: color(xyz-d65 0.3 0.31 1.01);
}
```

这是比较笨的一种转换方式。你也可以根据它们之间的转换公式自己写一个颜色格式之间的转换器。

> 有关于开发者工具中颜色面板更详细的介绍，还可以阅读《[Inspect and debug HD and non-HD colors with the Color Picker](https://developer.chrome.com/docs/devtools/css/color/)》一文。注意，各浏览器的开发者调试工具有一定的差异，至少在写这节课的时候，我还没有发现 Safari 和 Firefox 浏览器的开发者工具具备该方面的能力。

## 颜色插值

> **“插值”指的是计算两个已知值之间的一个或多个值**。

在 CSS 的一些属性中也会有“插值”的概念，比如 CSS 的动画和渐变等。就拿 CSS 的渐变为例吧，**使用不同的“插值模式”可以避免两个颜色之间的灰色死亡区，并通过选择精确的停止位置（渐变颜色的停止位置）来缓解渐变**，[可以用来避免渐变中的“死亡灰色区”](https://juejin.cn/book/7199571709102391328/section/7199845781149810727)。例如，从一个红色到蓝色的渐变，插值将计算在红色和蓝色之间哪些颜色在范围内。

```CSS
body {
    background: linear-gradient(to right, red, blue);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/503afd4a89fc4a54a89e1428f07cecd1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNagBoj>

除了渐变，颜色插值在过渡动效中也很常见，比如一个红色按钮过渡到悬浮状态时，变成一个蓝色按钮，在这个过程中，它其实就是从一个颜色（`red`）到另一个颜色（`blue`）的过渡：

```CSS
.button {
    background-color: red;
    transition: background-color 5s ease-in-out;
}

.button:hover {
    background-color: blue;
    transition: background-color 5s ease-in-out;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/456cec1b363e4da294c7498ff79b9613~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJObzb>

在这个示例中，我们在过渡动效中指定了起始颜色（`red`）和结束颜色（`blue`），浏览器将在这两者之间进行插值计算。在这种情况下，插值意味着生成一系列中间颜色，以创建平稳而不是暖意的过渡。

另外一个示例是 CSS `animation` 中的动效，比如：

```CSS
@keyframes bg {
    0%, 100% {
        background: orange;
    }
    25% {
        background: magenta;
    }
    50% {
        background: lime;
    }
    75% {
        background: cyan;
    }
}

.button {
    background-color: orange;
    animation: bg 5s ease-in-out infinite;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ef68f3869b7420da29a7e5130b6335b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOLVrd>

简单地说，**对于渐变，插值是沿着形状的一系列颜色；对于动画，它是随着时间的一系列颜色**。

> 注意，颜色插值除了可运用于渐变、过渡、动画之外，还可以合成、滤镜、颜色混合和颜色修改函数上。

### 颜色插值的新功能

随着新增色域和颜色空间，插值有了新的功能，即可以使用关键词 `in` 来指定颜色的空间。例如，同样是一个从蓝色 `blue` 到红色 `red` 的线性渐变，但使用关键词 `in` 指定了颜色空间和未使用 `in` 指定颜色空间（标准的 sRGB）得到的结果是完全不同的。

```CSS
.rgb {
    background: linear-gradient(to right, blue, red);
}

.hwb {
    background: linear-gradient(in hwb to right, blue, red);
}
.hsl {
    background: linear-gradient(in hsl to right, blue, red);
}

.lch {
    background: linear-gradient(in lch to right, blue, red);
}

.lab {
    background: linear-gradient(in lab to right, blue, red);
}

.oklch {
    background: linear-gradient(in oklch to right, blue, red);
}

.oklab {
    background: linear-gradient(in oklab to right, blue, red);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12af74a3f9ae42188832bea083079966~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOLVoX>

注意，上面示例所演示的只是颜色插值中一部分，即  `in `**`<polar-color-space>`** 。其中， `<polar-color-space>` 指的是 `hsl` 、`hwb` 、 `lch` 和 `oklch` 。它的整体语法规则是：

```CSS
<color-space> = <rectangular-color-space> | <polar-color-space>
<rectangular-color-space> = srgb | srgb-linear | lab | oklab | xyz | xyz-d50 | xyz-d65
<polar-color-space> = hsl | hwb | lch | oklch
<hue-interpolation-method> = [ shorter | longer | increasing | decreasing ] hue
<color-interpolation-method> = in [ <rectangular-color-space> | <polar-color-space> <hue-interpolation-method>? ]
```

例如：

```CSS
:root {
    --srgb: linear-gradient(in srgb to right, blue, red);
    --srgb-color: linear-gradient(in srgb to right, blue, color(srgb 1 0 0));
    --srgb-linear: linear-gradient(in srgb-linear to right, blue, red);
    --srgb-linear-color: linear-gradient(in srgb-linear to right, blue, color(srgb 1 0 0));
    --xyz: linear-gradient(in xyz to right, blue, red);
    --xyz-color: linear-gradient(in xyz to right,blue, color(srgb 1 0 0));
    --xyz-d50: linear-gradient(in xyz-d50 to right, blue, red);
    --xyz-d50-color: linear-gradient(in xyz-d50 to right, blue, color(srgb 1 0 0));
    --xyz-d65: linear-gradient(in xyz-d65 to right, blue, red);
    --xyz-d65-color: linear-gradient(in xyz-d65 to right,blue, color(srgb 1 0 0));
    --shorter-hue: linear-gradient(in hsl shorter hue, blue, red);
    --shorter-hue-to-right: linear-gradient(in hsl shorter hue to right, blue, red);
    --shorter-hue-30deg: linear-gradient(in hsl shorter hue 30deg, blue, red);
    --longer-hue:linear-gradient(in hsl longer hue, blue, red);
    --longer-hue-to-right: linear-gradient(in hsl longer hue to right, blue, red);
    --longer-hue-30deg: linear-gradient(in hsl longer hue 30deg, blue, red);
    --increasing-hue: linear-gradient(in hsl increasing hue, blue, red);
    --increasing-hue-to-right: linear-gradient(in hsl increasing hue to right, blue, red);
    --increasing-hue-30deg: linear-gradient(in hsl increasing hue 30deg, blue, red);
    --decreasing-hue:linear-gradient(in hsl decreasing hue, blue, red);
    --decreasing-hue-to-right:linear-gradient(in hsl decreasing hue to right, blue, red);
    --decreasing-hue-30deg:linear-gradient(in hsl decreasing hue 30deg, blue, red);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/136e8f3642d1423892bdfa5eb34e5aab~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOeewLQ>

上面就是颜色插值的基础使用。

### 跨颜色空间使用颜色

以往我们设置颜色都是在同一颜色空间中进行的，现在有了更多的颜色空间之后，我们可能会同时在不同颜色空间设置颜色。比如，在设置渐变颜色、颜色过渡、颜色混合等场景会用到多个颜色空间。那么问题来了，如果你从一个颜色空间中的颜色过渡到完全不同的颜色空间中的颜色，会发生什么？比如下面这个渐变示例，它从 LCH 颜色空间过渡到 sRGB 颜色空间：

```CSS
/* 未使用颜色插值绘制的渐变 */
.linear-gradient-1 {
    background-image: linear-gradient(to right, lch(29.6 131 301), hsl(330 100% 50%));
}

/* 使用颜色插值功能绘制的渐变 */
.linear-gradient-2 {
    background-image: linear-gradient(in lch to right, lch(29.6 131 301), hsl(330 100% 50%));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/318fc073562f479e81c6135c7b21d9b8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGmmROQ>

幸运的是， [颜色模块 Level4 规范中有指导浏览器如何处理这些跨颜色空间插值的说明](https://www.w3.org/TR/css-color-4/#interpolation)。在上面这个示例中，对于 `.linear-gradient-1` ，浏览器将注意到不同的颜色空间，并使用默认的颜色空间 OKLAB。你可能会认为浏览器会使用 LCH 作为颜色空间，因为那是第一个颜色，但它并不是这样的。这就是为什么我展示第二渐变 `.linear-gradient-2` ，因为第二个渐变，明确使用颜色插值的功能，指定了颜色的空间是 LCH 空间。也就是说，渐变（`.linear-gradient-2`）是 LCH 颜色空间的渐变。

### 如何控制颜色插值

众所周知，两点之间最短的距离总是一条直线。对于颜色插值，浏览器默认会选择较短的路径。考虑下面这样的一个场景，一个 HSL 颜色圆柱体中有两个点，线性渐变通过沿着两点之间的线移动来获得其颜色步长。

```CSS
.linear-gradient {
    background-image: linear-gradient(188.77deg, #A4E6A9 19.33%, #E4937D 74.97%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d54e7e5c2e954fa38cfb2d1b4375b003~tplv-k3u1fbpfcp-zoom-1.image)

上面的渐变线直接在绿色和红色之间，穿过颜色空间的中心。虽然以上内容有助于初步理解，但事实并非如此。浏览器实际渲染出来的渐变显然不会像模拟演示中那样，中间是白色的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f54f2f2fbcc94f21b183302cc75dc42a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGmmrwy>

正如你所看到的，渐变的中间区域失去了它的活力。这是因为最鲜艳的颜色是在颜色空间形状的边缘，而不是在插值靠近的中心。这通常被称为“**[灰色死区](https://juejin.cn/book/7199571709102391328/section/7199845781149810727)**”。有一些方法可以修复或解决这个问题。

今天避免死区的一种技术是在渐变中添加额外的颜色停止，有意地引导插值保持在色彩空间的活力范围内。这实际上是一种变通，**绕道而不是直接穿过灰色地带**：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb5fdc515996435292e7ee120ce53b5f~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
/* 💩 直通灰色死亡区 */
.dead-zone {
    background-image: linear-gradient(to right, #94e99c, #e06242); 
}

/* 👍 绕开灰色死亡区  */
.un-dead-zone {
    background-image: linear-gradient(90deg, #94e99c, #99e789, #ace67d, #c4e472, #e2e366, #e2bf5a, #e1934e, #e06242); 
}
```

简单地说，**使用不同的“插值模式”可以避免两个颜色之间的灰色死亡区，并通过选择精确的停止位置（渐变颜色的停止位置）来缓解渐变** 。即**插值不再是一条直线，而是在死区周围出现曲线，有助于保持饱和度，从而产生更有活力的渐变**。

人工获取这些颜色插值不是件易事，所以可以考虑使用 [@Erik Kennedy 创建了一个渐变工具](https://www.learnui.design/tools/gradient-generator.html)。它可以为你计算额外的停止颜色（颜色插值），帮助你避免死区，即使是在倾向于向死区倾斜的颜色空间中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28596b285c204101a7f8c8d4dd92c234~tplv-k3u1fbpfcp-zoom-1.image)

> URL：<https://www.learnui.design/tools/gradient-generator.html>

你甚至还可以使用 [@Tom Quinonero 写的一款工具](https://non-boring-gradients.netlify.app/)，即[缓动渐变](https://juejin.cn/book/7199571709102391328/section/7199845781149810727)与颜色插值相结合，增加渐变步长，绕开灰色死亡区，从而改变渐变外观，使渐变看起更独特而美丽。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78aee2a37ad6416880aadc4a63e060a9~tplv-k3u1fbpfcp-zoom-1.image)

> URL: <https://non-boring-gradients.netlify.app/>

生成出来的渐变代码：

```CSS
linear-gradient(
    90deg, 
    rgb(21.176% 46.275% 99.608%) 0%, 
    rgb(20.806% 46.327% 99.64%) 6.25%, 
    rgb(17.995% 46.689% 99.858%) 12.5%, 
    rgb(5.816% 47.651% 100%) 18.75%, 
    rgb(24.795% 49.1% 87.781%) 25%, 
    rgb(7.034% 51.288% 88.363%) 31.25%, 
    rgb(0% 53.959% 85.448%) 37.5%, 
    rgb(0% 56.614% 78.563%) 43.75%, 
    rgb(0% 59.594% 71.498%) 50%, 
    rgb(0% 64.705% 64.569%) 56.25%, 
    rgb(0% 66.945% 46.042%) 62.5%, 
    rgb(43.436% 68.094% 13.689%) 68.75%, 
    rgb(85.629% 60.454% 16.302%) 75%, 
    rgb(100% 56.879% 61.481%) 81.25%, 
    rgb(88.914% 69.212% 100%) 87.5%, 
    rgb(55.954% 87.996% 100%) 93.75%, 
    rgb(59.216% 100% 69.412%) 100% 
)
```

与线性渐变 `linear-gradient(90deg, rgb(54 118 254), rgb(151 255 177))` 相比，效果要好得多：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cd776209f674afa865ed1b7ef0b15c5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWPPvZJ>

有意思的是，自 CSS 有了颜色插值功能之后，我们不再依赖这些工具就可以成功绕开渐变中的“死亡灰色区”了，这主要依靠**色相插值**的功能。

### 色相插值

在 [CSS 颜色模块 Level4 的规范中提供了一个色相插值（Hue interpolation）的功能](https://www.w3.org/TR/css-color-4/#hue-interpolation)，它是一种绕开“死亡区”的新方法。想象一下色相角度，并考虑仅更改渐变停止颜色的色相角度，例如从 `140deg` 到 `240deg` ：

```CSS
.linear-gradient {
    background: linear-gradient(to right, hsl(140deg 100% 75%), hsl(240deg 100% 75%));
}
```

注意渐变中的两个颜色 `hsl(140deg 100% 75%)` 和 `hsl(240deg 100% 75%))` ，它们都是 `hsl()` 函数描述的颜色。唯一不同的是，渐变起始色的色相是 `140deg` ，渐变终止色的色相是 `240deg` 。最终在浏览器中呈现的渐变效果如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25e3554a52284077bb1bc873b1677efe~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEErZe>

现在，你可以通过控制色相插值，让渐变效果更好。比如：

```CSS
.linear-gradient {
    background: linear-gradient(to right in hsl, hsl(140deg 100% 75%), hsl(240deg 100% 75%));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c45bee1fe774878974e6e6f22624a40~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dyggZPY>

除此之外，你还可以使用关键词 `shorter hue` 、 `longer hue` 、`increasing hue` 和 `decreasing hue` 。默认情况渐变会采用最短路径，即 `shorter hue` 。

前面也提到过了，较短路径之间具有更少的色相，因为它们之间的路径是最短的，如果你需要更多色相，则要指定渐变采用较长的路径，即 `longer hue` 。除此之外，你还可以使用增加（`increasing hue` ）或减少（`decreasing hue`） 相色的插值，例如：

```CSS
:root {
    --standard-hue:background: linear-gradient(to right in hsl, hsl(140deg 100% 75%), hsl(240deg 100% 75%));
    --shorter-hue: linear-gradient(to right in hsl shorter hue, hsl(140deg 100% 75%), hsl(240deg 100% 75%));
    --longer-hue: linear-gradient(to right in hsl longer hue, hsl(140deg 100% 75%), hsl(240deg 100% 75%));
    --increasing-hue: linear-gradient(to right in hsl increasing hue, hsl(140deg 100% 75%), hsl(240deg 100% 75%));
    --decreasing-hue: linear-gradient(to right in hsl decreasing hue, hsl(140deg 100% 75%), hsl(240deg 100% 75%));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/356dc13681ba4cf0b12ea3e95ab64cfd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExddbNY>

### 不同颜色空间的渐变

由于其独特的形状和颜色排列方式，每个颜色空间的最终渐变效果都会有所不同。比如下面示例中的“从蓝到白”的渐变，每个颜色空间都会以不同的方式处理它。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb7a8eb5e1524b969e2fc98082915c59~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJBBOgz>

正如上图所示，许多颜色空间中会有紫色，这在插值过程中称为“**色调偏移**”。

这些颜色空间中的某些渐变将比其他渐变更加鲜艳，或者会在死区中经过较少的距离。比如 LAB 和 HWB 颜色空间相比，使用 LAB 颜色空间时插值效果更一致。

```CSS
.hwb {
    background: linear-gradient(to right, hwb(250 10% 10%), hwb(150 10% 10%));
}
.lab {
    background: linear-gradient(to right, lab(30 59.4 -96), lab(80 -64 36.2));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3f4a29c7f6d4c20b672b97d1200f6f9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRYYOYQ>

好消息是，我们可以使用 `hwb()` 来获得熟悉的语法，但要求该渐变完全在另一个颜色空间（如 `oklab` ）内进行插值。

```CSS
.hwb {
    background: linear-gradient(in hwb to right, hwb(250 10% 10%), hwb(150 10% 10%));
}
.oklab {
    background: linear-gradient(in oklab to right, hwb(250 10% 10%), hwb(150 10% 10%));
}
```

上面代码使用 `hwb()` 中的相同颜色，但指定了插值的颜色空间为 `hwb` 、`oklab`  或 `oklch`。`hwb()` 是一种非常适合饱和度高的颜色空间，但可能会有死区或亮斑。`oklab` 对于保持饱和度的感知线性渐变非常有效。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce56d40d0b7c49c787b1535c0bb66605~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/Rweejvx>

你也可以使用 [@Adam Argyle 提供的工具 HD Gradients ](https://gradient.style/)在线制作更高清的渐变效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec818f1445d94f6c899ec3720c4025ce~tplv-k3u1fbpfcp-zoom-1.image)

> URL：<https://gradient.style/>

```CSS
/* 高清渐变代码 */
.modern-gradient {
    background-image: 
        linear-gradient(
            to bottom left in oklab, 
            oklch(55% .45 350) 0%, oklch(55% .45 350) 50%, oklch(100% .4 95) 100%
        )
    ;
}

/* 普通渐变代码 */
.classic-gradient {
    background-image: linear-gradient(to bottom left, #ff0094 0%, #ff0094 50%, #ffec00 100%);
}
```

同样的，你要是担心浏览器不支持颜色插值功能，可以使用 `@supports` 做检测，让支持颜色插值功能的浏览器使用高清渐变，不支持的浏览使用普通渐变：

```CSS
@supports (background-image: linear-gradient(in oklch to right, red, blue)) {
    :root {
        --bg: linear-gradient(
            to bottom left in oklab, 
            oklch(55% .45 350) 0%, oklch(55% .45 350) 50%, oklch(100% .4 95) 100%
        )
    }
}

@supports not (background-image: linear-gradient(in oklch to right, red, blue)) {
    :root {
        --bg:linear-gradient(to bottom left, #ff0094 0%, #ff0094 50%, #ffec00 100%);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4f7fff38f2f4ecaa23a080be0261a7c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/Baqqmgq>

## 小结

在这节课中，我们主要一起探讨了 CSS 中新增的颜色空间以及颜色插值相关的知识。在现代 CSS 中，颜色空间和颜色插值已经是非常重要的概念了。以下是关于它们的总结。

*   颜色空间是一种定义了颜色的数学模型，它根据特定的色彩规则来表示颜色。
*   在 CSS 中，有多种不同的颜色空间可供使用，如早期的 sRGB 颜色空间，新增的 CIELAB、OKLAB、OKLCH、Display P3、Rec.2020、A98 RGB 等。
*   每种颜色空间都有其独特的特点和用途，如 sRGB 通常用于屏幕上的颜色表示，CIELAB 更适合用于打印和场景颜色，Display P3 更适合高清的屏幕。

至于颜色插值，它在现代 Web 中也变得越来越重要。

*   颜色插值是一种用于生成渐变色的技术，该技术除了运用于渐变之外，还可以用于过渡、动画、合成、滤镜和颜色混合等场景。
*   插值可以基于两种或多种颜色之间进行，颜色之间的过渡可以是线性的或非线性的。
*   渐变还可以指定颜色空间和插值模式，以精确控制渐变的外观和行为。

虽然现在 Web 上主要使用的还是 sRGB 颜色空间，但我相信随着时间的推移，Web 设计师和开发者会越来越多地使用新的颜色空间，比如 OKLAB、OKLCH 和 Display P3 等。因为这些颜色空间能让你构建的 Web，颜色更鲜艳，更饱满，更高清。尤其是在高清屏幕下，你不用再担心颜色的失真。

另外，对于 Web 开发者而言，知道在哪个颜色空间上构建设计系统也非常重要。每种颜色空间都有其特点，存在于 CSS 规范中的原因也不同，只有了解和掌握了它们之间差异，在实际生产和使用过程中才会更加顺手，不会出错。使用这些知识还可以帮助你解决以往一些老 CSS 存在的问题，比如构建渐变时，使用颜色插值功能可以绕开渐变中的死亡灰色，也可以避免渐变带的产生等。

总的来说，掌握颜色空间和颜色插值技术可以帮助开发者更好地控制页面颜色，它们能够为你的用户提供更多的色彩、更加一致的操作和插值，从而获得更加丰富多彩的用户体验。
