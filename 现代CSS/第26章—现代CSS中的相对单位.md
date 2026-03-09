时至今日，CSS 中已经有五十多种不同类型的单位，而且这个数量可能还会增加，其中有很多单位是相对的。例如我们熟悉的 `em` 、`rem` 、`vw` 和 `vh` 等单位都是相对单位。在 Web 开发的过程中，使用相对单位对于 Web 开发者而言是有益的。尤其是我们在构建一个响应式 Web 应用或网站时，它们显得更为灵活和有益。换句话说，作为 Web 开发人员，我们应该用动态的方法构建 Web 的布局。

在这节课中，我们主要一起来探讨 CSS 单位中的相对单位。我们将从这节课中了解到 CSS 的相对单位有哪些，我们又是如何通过 CSS 相对单位来调整组件的大小。

## 相对单位简介

在 CSS 中，单位类型主要有两种：绝对单位和相对单位。它们又分别称为绝对长度单位和相对长度单位。其中相对长度单位是相对于其他一些东西，比如父元素的字体大小，或者浏览器视窗的大小，或者元素容器的大小。简单地说，相对长度单位是相对于另一个长度的长度。

使用相对单位的好处是，经过一些仔细的规划，你可以使用文本或其他元素的大小与页面上的其他内容相对应。即可以更容易地从一个输出环境扩展到另一个输出环境。

到目前为止，CSS 相对长度单位主要分为**字体相对长度单位**、**视窗相对长度单位**和**容器查询相对长度单位**三种：

-   **字体相对长度单位**：指的是使用它们的元素（用于本地字体相对长度）或根元素（用于根字体相对长度）的字体度量
-   **视窗相对长度单位**：相对于浏览器视窗的尺寸的长度，例如 `vw` 和 `vh` 等
-   **容器查询相对长度单位**：相对于查询容器的尺寸的长度，例如 `cqw` 和 `cqh` 等

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb9d633628aa422b8eeed47a43289463~tplv-k3u1fbpfcp-zoom-1.image)


下面这个示例向你展示了所有相对长度单位运用于 `font-size` 的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd1405d18e9443aebf3f8624dde17f8c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjerJyM>

## CSS 视窗单位

CSS 视窗单位已经存在很多年了，随着时间的推移，越来越多的 Web 开发者在项目中使用它们。它们的好处在于Web 开发者不需要依赖任何 JavaScript 脚本，就可以相对于浏览器视窗尺寸来设置元素的大小，而且这个大小是动态的，会随着浏览器视窗大小自动调整。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ae1c6b4f5ad4550acac5d946d40fd4a~tplv-k3u1fbpfcp-zoom-1.image)

最早在 CSS 中，只有四个视窗单位，即 `vw` 、`vh` 、`vmin` 和 `vmax` :

-   **`vw`** ：表示根元素（`html`）宽度的百分比，`1vw` 等于浏览器视窗宽度的 `1%`
-   **`vh`** ：表示根元素（`html`）高度的百分比，`1vh` 等于浏览器视窗高度的 `1%`
-   **`vmin`** ：表示浏览器视窗宽度和高度的最小值，如果浏览器视窗宽度大于其高度，则该值将根据浏览器视窗的高度计算，反之则根据浏览器视窗宽度计算。
-   **`vmax`** ：表示浏览器视窗宽度和高度的最大值，如果浏览器视窗宽度大于其高度，则该值将根据浏览器视窗的宽度计算，反之则根据浏览器视窗高度计算

它们的大小都和浏览器视窗的宽高有着直接关系，例如：

```CSS
.element {
    width: 50vw; 
}
```

代码中的 `50vw` 相当于 `html` 元素宽度的 `50%` ，也相当于浏览器视窗宽度的 `50%` 。假设浏览器视窗宽度是 `1200px` ，那么 `50vw` 则等于 `600px` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6176a9bc4a43417b932c371952c3c79f~tplv-k3u1fbpfcp-zoom-1.image)

如果你给元素的高度设置为 `50vh` ：

```CSS
.element {
    height: 50vh;
}
```

那么元素的高度相当于根元素 `html` 高度的 `50%` ，也相当于浏览器视窗高度的 `50%` 。假设浏览器视窗高度是 `768px` ，那么 `50vh` 则等于 `384px` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b32836f979fe46cb8f00f42ea8f2af42~tplv-k3u1fbpfcp-zoom-1.image)

`vmin` 和 `vmax` 与 `vw` 和 `vh` 略有不同，其中：

-   `vmin` 等于 `vw` 或 `vh` 中较小一个
-   `vmax` 等于 `vw` 或 `vh` 中较大一个

假设你给一个元素设置了宽度为 `10vmin` ：

```CSS
.element {
    width: 10vmin;
}
```

当浏览器视窗宽度小于高度时（例如移动手机竖屏模式时），则 `1vmin` 等于视窗宽度的 `1%` ；当浏览器视窗宽度大于高度时（例如移动手机横屏模式时），则 `1vmin` 等于视窗高度的 `1%` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52e80ceda6ca4e8e80326b5d7c69f89e~tplv-k3u1fbpfcp-zoom-1.image)

`vmax` 和 `vmin` 刚好相反。

```CSS
.element {
    width: 10vmax;
}
```

当浏览器视窗宽度大于高度时（例如移动手机横屏模式时），则 `1vmax` 等于视窗宽度的 `1%` ；当浏览器视窗宽度小于高度时（例如移动手机竖屏模式时），则 `1vmax` 等于视窗高度的 `1%` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5830cd88add6407b8f82a12ca7b784fc~tplv-k3u1fbpfcp-zoom-1.image)

你可以尝试在下面示例中调整视窗单位：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a32c31abf959492c96f6f7b92f8cc233~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzEqJO>

随着 CSS 逻辑属性的出现，视窗单位新增了 `vi` 和 `vb` ：

-   **`vi`** ：指浏览器视窗内联轴尺寸（`inline-size`）的 `1%`
-   **`vb`** ：指浏览器视窗块轴尺寸（`block-size`）的 `1%`

有了视窗单位之后，我们可以使用 `100vw` 和 `100vh` 就轻易实现和浏览器视窗一样的尺寸大小，而且还能自动随着浏览器尺寸变化而变化：

```CSS
.element {
    width: 100vw;
    height: 100vh;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d5d8a5ff8cd479ebfa2f98e58ea7430~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQPMjg>

事实上，Web 开发人员今天面临一个常见的问题，那就是准确和一致的全视窗大小。比如上面这个全屏的示例，它在某些情况之下并不是全屏的。即使我们设置了元素的高度为 `100vh` ，希望元素高度和浏览器视窗高度相等（`100%` 的浏览器视窗高度），但 `vh` 单位并没有考虑到移动设备上的导航条收缩等因素，所以在垂直方向会出现滚动条。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d08fb0dc23654a8a8c0b5ae21828917b~tplv-k3u1fbpfcp-zoom-1.image)

过去，大多是使用 [Viewport Units Buggyfill](https://www.bram.us/2016/09/12/making-viewport-units-work-properly-in-mobile-safari/) 或 [@Louis Hoebregts 的 CSS 自定义属性 Hack ](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)来修复此行为。

```JavaScript
const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};
​
window.addEventListener('load', setVh);
window.addEventListener('resize', setVh);
```

```CSS
body {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
}
```

我很高兴看到 [@Matt Smith 最近找到了一种使用 CSS 让 Mobile Safari 将元素设置为 100vh 的方法](https://twitter.com/AllThingsSmitty/status/1254151507412496384)：

```CSS
body {
    height: 100vh;
}
​
@supports (-webkit-touch-callout: none) {
    body {
        height: -webkit-fill-available;
    }
}
```

但这不是最佳的方案，因为使用 `-webkit-fill-available` 仅适用于实现 `100vh`。例如，如果你想要实现完美的 `50vh`，`-webkit-fill-available` 将无法使用在 `calc()` 中。例如 `height:calc(-webkit-fill-available * 0.5)` 就是无效的 CSS。即使有一天允许这样做，如果目标元素在 DOM 树的深层嵌套中，并且其中一个父元素已经设置了高度，则它将无效。

同样的，设置 `100vw` 同样会存在类似的问题。如果你是 Mac OS 用户，当使用 `100vw` 设置元素宽度与浏览器视窗宽度相等时，效果可能会很好，因为垂直滚动条默认是隐藏的。结果，滚动条宽度被添加到总宽度中。

但是，在 Windows 机器上，你会发现页面出现水平滚动条，因为滚动条的宽度被添加到宽度中。例如上面示例，设置了元素 `.element` 的宽度（`width`）为 `100vw` 。此时，在窗口中，`.element` 的计算宽度为 `100vw + 8.5px` ，其中 `8.5px` 是垂直滚动条的宽度。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f67137ab0ec4f80977f586af2942763~tplv-k3u1fbpfcp-zoom-1.image)

因此，我们需要新的视窗单位来避免这些现象。庆幸的是，CSS 工作组指定了视窗的各种状态：

-   **大视窗（Large Viewport）** ：假设任何 UA 接口都是收缩的，例如浏览器工具栏、标签栏和地址栏都是不可见的状态
-   **小视窗（Small Viewport）** ：假设任何 UA 接口都是扩展的，例如浏览器工具栏、标签栏和地址栏都是可见的状态

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67a241b788d340758f63f709aee85b93~tplv-k3u1fbpfcp-zoom-1.image)

在 CSS 中使用 `lv` 前缀来定义大视窗的单位，其包含了 `lvw` 、`lvh` 、`lvi` 、`lvb` 、`lvmin` 和 `lvmax` 等单位。另外使用 `sv` 前缀来定义小视窗的单位，其包含了 `svw` 、`svh` 、`svi` 、`svb` 、`svmin` 和 `svmax` 等单位。

它们的定义和 `vw` 、`vh` 、`vi` 、`vb` 、`vmin` 和 `vmax` 是相似的：

-   `lvw` 等于浏览器视窗大尺寸的宽度的 `1%`
-   `lvh` 等于浏览器视窗大尺寸的高度的 `1%`
-   `lvi` 等于浏览器视窗大尺寸的内联轴尺寸（`inline-size`）的 `1%`
-   `lvb` 等于浏览器视窗大尺寸的块轴尺寸（`block-size`）的 `1%`
-   `lvmin` 等于浏览器视窗大尺寸的宽度或高度中的较小值，即 `lvw` 或 `lvh` 较小的那个值
-   `lvmax` 等于浏览器视窗大尺寸的宽度或高度中的较大值，即 `lvw` 或 `lvh` 较大的那个值
-   `svw` 等于浏览器视窗小尺寸的宽度的 `1%`
-   `svh` 等于浏览器视窗小尺寸的高度的 `1%`
-   `svi` 等于浏览器视窗小尺寸内联轴尺寸（`inline-size`）的 `1%`
-   `svb` 等于浏览器视窗小尺寸块轴尺寸（`block-size`）的 `1%`
-   `svmin` 等于浏览器视窗小尺寸的宽度或高度中的较小值，即 `svw` 或 `svh` 较小的那个值
-   `svmax` 等于浏览器视窗小尺寸的宽度或高度中的较大值，即 `svw` 或 `svh` 较大的那个值

这些视窗相对单位的大小是固定的（因此是稳定的），除非视口本身被调整大小。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e96ba211595445da95d17332d307ff4f~tplv-k3u1fbpfcp-zoom-1.image)

除了大小视窗之外，还有一个动态视窗，它有动态考虑的 UA UI:

-   当动态工具栏展开时，动态视口等于小视窗的大小。
-   当动态工具栏收缩时，动态视口等于大视窗的大小。

动态视窗单位以 `dv` 前缀定义，其中包括 `dvw` 、`dvh` 、`dvi` 、`dvb` 、`dvmin` 和 `dvmax` 。

-   `dvw` 表示动态视窗宽度的 `1%`
-   `dvh` 表示动态视窗高度的 `1%`
-   `dvi` 表示动态视窗内联轴尺寸的 `1%`
-   `dvb` 表示动态视窗块轴尺寸的 `1%`
-   `dvmin` 表示动态视窗宽度或高度中的较小值，即 `dvw` 或 `dvh` 中较小的那个值
-   `dvmax` 表示动态视窗宽度或高度中的较大值，即 `dvw` 或 `dvh` 中较大的那个值

而且 `dv*` 相关的动态视窗单位的尺寸夹在 `lv*` 大视窗单位尺寸和 `sv*` 小视窗单位尺寸之间。也就是说，当附加的动态浏览器工具栏(如顶部的地址或底部的选项卡栏)可见或不可见时，动态视口单元的值会发生变化。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36d3ff8e15674177acf7c85854efdd0e~tplv-k3u1fbpfcp-zoom-1.image)

需要注意的是，`*vi` 和 `*vb` 等视窗单位由 `writing-mode` 属性的初始值来确定它们对应哪个轴（内联轴尺寸或块轴尺寸）。

## CSS 容器查询单位

现在我们知道了，CSS 视窗单位是以一种响应浏览器视窗大小（宽度或高度）的方式工作。这很棒，但我们并不总是希望使用与浏览器视窗大小相关的单位。如果我们想查询容器的宽度呢？这就是 CSS 容器查询单位的作用。

为了更清楚地说明这一点，我想用下图来描述视窗单位和容器查询单位之间的区别：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d87f8c61c164adda5f8cda5c9abf8df~tplv-k3u1fbpfcp-zoom-1.image)

上图左侧的卡片组件标题的字号（`font-size`）是由 `rem` 和 `vw` 控制，这将相对于浏览器视窗宽度计算。在某些情况下，这可能会起作用，但它可能会导致意想不到的问题，因为它是相对于浏览器视窗宽度计算的。

在处理组件（比如上图中卡片组件的标题）的字体大小（`font-size`）时，容器查询单位可以节省我们不少精力和时间。我们可以使用容器查询单位来代替手动增加字体大小。

[CSS 规范](https://www.w3.org/TR/css-contain-3/#container-lengths)目前主要定义了以下几种容器查询单位：

-   **`cqw`** ：查询宽度，相对于查询容器宽度计算，即 `1cqw` 等于查询容器宽度的 `1%`
-   **`cqh`** ：查询高度，相寻于查询容器高度计算，即 `1cqh` 等于查询容器高度的 `1%`
-   **`cqi`** ：查询内联轴尺寸，相对于查询容器内联轴尺寸计算，即 `1cqi` 等于查询容器内联轴尺寸的 `1%`
-   **`cqb`** ：查询块轴尺寸，相对于查询容器块轴尺寸计算，即 `1cqb` 等于查询容器块轴尺寸的 `1%`
-   **`cqmin`** ：查询最小值，是查询内联轴尺寸 `cqi` 或查询块轴尺寸 `cqb` 中较小的那个值
-   **`cqmax`** ：查询最大值，是查询内联轴尺寸 `cqi` 或查询块轴尺寸 `cqb` 中较大的那个值

## 字体相对长度单位

字体相对长度指的是使用它们的元素（用于本地字体相对长度）或根元素（用于根字体相对长度）的字体度量。在表现形式上有一个很好的区别，即相对于根元素（用于根字体相对长度）的单位都是以 `r` 前缀开头的单位。其中：

-   用于本地字体相对长度的单位有 `em` 、`ex` 、`cap` 、`ch` 、`ic` 和 `lh`
-   用于根字体相对长度的单位有 `rem` 、`rex` 、`rcap` 、`rch` 、`ric` 和 `rlh`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab4f84cbabfa454e904c6f0ec5d1aab3~tplv-k3u1fbpfcp-zoom-1.image)

它们具体含义如下：

-   **`em`** ：如果在元素的 `font-size` 属性中使用 `em` 单位，则相对于元素父元素的 `font-size` 计算，如果在元素的其他属性（非 `font-size`）中使用 `em` 单位，则相对于元素自身的 `font-size` 计算，例如 `width` 属性
-   **`rem`** ：相对于根元素的 `font-size` 计算
-   **`ex`** ：等于第一个可用字体的 `x-height` ，即小写字符 `x` 的高度
-   **`rex`** ：相对于根元素上的 `ex` 单位的值计算
-   **`ch`** ：数字 `0` （`U+0030`）的宽度
-   **`rch`** ：相对于根元素上的 `ch` 单位的值计算
-   **`cap`** ：等于第一个可用字体的使用帽高度（cap-height），它大约等于大写拉丁字母的高度
-   **`rcap`** ：相对于根元素上的 `cap` 单位的值计算
-   **`lh`** ：等于元素的行高（`line-height` ）
-   **`rlh`** ：相对于根元素上的 `lh` 单位的值计算，当用于根元素的 `font-size` 或 `line-height` 属性时，它指的是这些属性的初始值
-   **`ic`** ：是 `ch` 的东方版本。它是 CJK （中文、日文和韩文）表意文字 `水` （`U+6C34`）的大小，因此可以粗略地解释为“表意文字计数”。在不可能或不实际确定表意文字的大小情况下，必须假定为 `1em`
-   **`ric`** ：相对于根元素上的 `ic` 单位的值计算

## 使用 CSS 相对单位构建可调整大小的组件

Web 开发者往往将构建一个可调整大小的组件作为终极目标，这样做的主要目的是，Web 组件更具灵活性和适配性，可以很好的用于更多不同的使用场景。Web 开发者使用 CSS 相对单位构建可调整大小的组件有极大的便利和优势。接下来，我们来通过一些实际的案例来向大家展示，CSS 相对单位是如何使组件调整大小更便利。

### 响应式排版

在响应式排版中使用视窗单位已经变得非常流行，Web 开发者可以根据当前浏览器视窗的大小来设置字体大小。它能使字体大小随着浏览器视窗大小而增大或缩小。

例如，我们可以像下面给一个标题设置 `font-size` ：

```CSS
.title {
    font-size: 5vw;
}
```

标题的字体大小（`font-size`）将根据浏览器视窗宽度变大或变小。这就相当于将当前浏览器视窗宽度的 `5%` 大小用于 `font-size` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4e9f506e0cc4dfa870cb8c0ce238fe0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLQPBJR>

对 `font-size` 使用简单的视窗单位有一个有趣（危险）的效果。正如你所看到的，字体的缩放速度非常快，字体大小在移动设备中变得非常小，这不利于可访问性和用户体验。据我所知，移动设备上的最小字体大小不应该小于 `14px`。在 GIF 中，字体大小低于 `10px`。

为了解决这个问题，我们需要给标题一个最小的字体大小，字体大小不能低于它。这个时候 ，CSS 的 `calc()` 函数就起作用了。

```CSS
.title {
    font-size: calc(14px + 2vw);
}
```

我们将 `14px` 作为 `font-size` 的基本尺寸，并在此基础添加 `2vw` 。有了它，字体大小的值就不会变得太小。

另一个需要考虑的重要问题是字体大小在大屏幕上的表现，比如 `27` 英寸的 iMac。会发生什么?嗯，你猜对了。字体大小约为 `95px`，这是一个很大的值。为了防止这种情况，我们应该在某些断点处使用媒体查询并更改字体大小。

```CSS
@media only screen and (width > 1800px) {
    .title {
        font-size: 40px;
     }
}
```

通过重置字体大小，我们可以确保大小不会太大。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6f448928871436c930ac3155c19823e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqjboK>

效果看上去已经好很多了，但你可能需要根据你的项目上下文在代码中添加多个媒体查询。这是 Web 开发者不想要的。

庆幸的是，我们可以使用 CSS 的比较函数 `clamp()` 来替代上面示例中的 `calc()` 函数。使用 `clamp()` 函数有一个最大优势，它可以接受三个值：最小值、理想值和最大值。响应式排版的核心思想是“理想”值使用一个视窗单位（例如 `vw`），以便在最小值和最大值之间进行插值。这有效地允许字体大小沿着首选范围调整大小。例如：

```CSS
.title {
    font-size: clamp(1rem, 4vw + 1rem, 3rem);
}
```

上面的代码将会告诉浏览器，标题 `.title` 的 `font-size` 的最小值是 `1rem` ，最大值是 `3rem` ，其中 `4vw` 允许沿着范围内（`1rem ~ 3rem`）插值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e12ce1027dc4f41a42b29982fea562c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJOLdx>

至于在 `clamp()` 函数的首选值中为什么要使用 `4vw + 1rem` ，在这里就不详细阐述了，如果你对这方面知识感兴趣，可以回过头阅读小册的《[16 | CSS 的比较函数：min() 、max() 和 clamp()](https://juejin.cn/book/7223230325122400288/section/7241401565653762108)》。

正如你所看到的，使用视窗单位是相对于浏览器视窗来计算的。不过很多时候，我们希望字体大小与书写模式的内联轴尺寸能相关联起来。要实现这样的效果，我们就需要将视窗单位升级到容器查询单位。例如，我们可以将上面示例中的 `vw` 单位替换成 `cqi` 单位：

```CSS
.title {
    font-size: clamp(1rem, 4cqi + 1rem, 3rem);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3a63184976f4892ba03fd802751fa95~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxOYmJ>

你可能已经发现了，上面这个示例它的响应还是基于浏览器视窗大小的。这是怎么回事呢？

容器查询规范包括一项规定，即每个元素默认为样式容器，这就是为什么使用 `cqi` 已经可以灵活调整大小。但是，由于我们没有为示例定义查询容器，因此测量仍然针对应用了包含的最接近的祖先。这意味着对于我们查询“内联”轴的规则，浏览器的视窗宽度被用作度量。

为了达到我们真正想要的效果，也就是让字体大小响应父容器，我们需要一个查询容器。例如：

```HTML
<div class="container">
    <h1 class="title">Using CSS Container Query Units For Font Sizing</h1>
</div>
```

```CSS
.container {
    container-type: inline-size;
}
​
.title {
    font-size: clamp(1rem, 4cqi + 1rem, 3rem);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/598e355439b74491ae05597b945a2030~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJaOLgO>

如此一来，我们就可以使用 CSS 容器查询单位和 `clamp()` 或 `calc()` 实现动态范围的字体大小设置、基于基本字体大小的扩展和使用字体比例来设置字体大小。具体代码如下：

```CSS
/* 使用 clamp() 实现动态范围字体大小设置 */
:root {
    --headline-1: 2.75rem;
    --headline-2: 2.35rem;
    --headline-3: 1.5rem;
    --headline-4: 1.15rem;
}
​
h1,
.h1 {
    --font-size: var(--headline-1);
    font-size: var(--headline-1);
}
​
h2,
.h2 {
    --font-size: var(--headline-2);
    --font-size-fluid: 4.5cqi;
    font-size: var(--headline-2);
}
​
h3,
.h3 {
    --font-size: var(--headline-3);
    --font-size-fluid: 4.25cqi;
    --font-size-diff: 0.2;
    font-size: var(--headline-3);
}
​
h4,
.h4 {
    --font-size: var(--headline-4);
    --font-size-fluid: 4cqi;
    --font-size-diff: 0.2;
    font-size: var(--headline-4);
}
​
@supports (font-size: 1cqi) {
    :is(h1, .h1, h2, .h2, h3, .h3, h4, .h4, .fluid-type) {
        font-size: clamp(
            max(1rem, var(--font-size) - var(--font-size) * var(--font-size-diff, 0.3)),
            var(--font-size-fluid, 5cqi),
            var(--font-size)
         );
     }
}
​
/* 使用 calc() 从基本字体大小扩展 */
:root {
    --h1-base: 1.75rem;
    --h2-base: 1.5rem;
    --h3-base: 1.35rem;
    --h4-base: 1.15rem;
}
​
h1,
.h1 {
    --font-size-base: var(--h1-base);
    font-size: var(--h1-base);
}
​
h2,
.h2 {
    --font-size-base: var(--h2-base);
    --font-size-fluid: 2.5cqi;
    font-size: var(--h2-base);
}
​
h3,
.h3 {
    --font-size-base: var(--h3-base);
    --font-size-fluid: 2.25cqi;
    font-size: var(--h3-base);
}
​
h4,
.h4 {
    --font-size-base: var(--h4-base);
    --font-size-fluid: 2cqi;
    font-size: var(--h4-base);
}
​
@supports (font-size: 1cqi) {
    :is(h1, .h1, h2, .h2, h3, .h3, h4, .h4, .fluid-type) {
        font-size: calc(var(--font-size-base) + var(--font-size-fluid, 3cqi));
     }
}
​
/* 使用字体比例设置字体大小 */
:root {
    --type-ratio: 1.33;
    --body-font-size: 1rem;
    --font-size-4: calc(var(--body-font-size) * var(--type-ratio));
    --font-size-3: calc(var(--font-size-4) * var(--type-ratio));
    --font-size-2: calc(var(--font-size-3) * var(--type-ratio));
    --font-size-1: calc(var(--font-size-2) * var(--type-ratio));
}
​
h1,
.h1 {
    --font-size: var(--font-size-1);
    font-size: var(--font-size);
}
​
h2,
.h2 {
    --font-size: var(--font-size-2);
    font-size: var(--font-size);
}
​
h3,
.h3 {
    --font-size: var(--font-size-3);
    font-size: var(--font-size);
}
​
h4,
.h4 {
    --font-size: var(--font-size-4);
    font-size: var(--font-size);
}
​
@supports (font-size: 1cqi) {
    :is(h1, .h1, h2, .h2, h3, .h3, h4, .h4, .fluid-type) {
        --_font-min: var(--font-size) - var(--font-size) * var(--font-size-diff, 0.3);
        font-size: clamp(
            max(var(--body-font-size), var(--_font-min)),
            var(--_font-min) + 1cqi,
            var(--font-size)
        );
    }
}
```

### 全高布局

在构建 Web 布局时，有的时候希望页面高度和屏幕高度是一样的。在以往我们一般使用 `100vh` 来实现，例如：

```CSS
section {
    height: 100vh;
}
```

但由于 `100vh` 在移动端上存在一定的缺陷，为了避免该现象，建议使用新增的视窗单位 `dvh` 来替代 `vh` 。这样不管浏览器的工具栏、状态栏、地址栏是否收缩都能使元素高度与屏幕高度相等：

```CSS
section {
    height: 100dvh;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cd702bb9a8543ee9195c7b325c04498~tplv-k3u1fbpfcp-zoom-1.image)

### Sticky Footer

Sticky Footer 是 Web 经典布局之一，我曾在现代 [Web 布局](https://s.juejin.cn/ds/iSqLf6D/)中介绍了如何使用 [Flexbox](https://juejin.cn/book/7161370789680250917/section/7161623855054716935) 和 [Grid](https://juejin.cn/book/7161370789680250917/section/7161624078397210638) 来实现 Sticky Footer 布局效果。在这里我将介绍另一种方案，即使用视窗单位实现 Sticky Footer 布局效果。

```HTML
<body>
    <header>Header Section</header>
    <main>Main Section</main>
    <footer>Footer Section</footer>
</body>
```

假设页面的 `header` 和 `footer` 内容所占高度都是 `120px` ，那么可以使用 `calc()` 计算出 `main` 的高度：

```
main 高度 = 100vh - 120px - 120px
```

CSS 可以这样写：

```CSS
header,
footer {
    height: 120px;
}
​
main {
    min-height: calc(100vh - 120px * 2);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d431381bed44eef939d1fb2681179d0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGQYbMK>

### 带有粘性头部和脚部的模态框

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7296837810094fa0baef083b613f7175~tplv-k3u1fbpfcp-zoom-1.image)

这是一个带有粘性页头和页脚的模态框。如果内容足够长，中间部分是可以滚动的。你往往会像下面这样设置模态框的 CSS 样式:

```CSS
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
}
```

代码中使用了 `100vh` 来设置模态框的高度，但它将使得模态框的底部（页脚）不可见，这将破坏用户体验。以下是 iOS 上传统（`vh`）和新型视窗单位（`dvh`）的表现：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79b32618825847f49241b90478ab0165~tplv-k3u1fbpfcp-zoom-1.image)

再加上 Android 上的 Chrome 和 Firefox：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03d0667755cf4ff9bacc6be4037d6ec4~tplv-k3u1fbpfcp-zoom-1.image)

和全高布局类似，我们可以使用 `svh` 或 `dvh` 来解决这个问题，个人更建议使用 `dvh` 来替代 `vh` ：

```CSS
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100dvh;
}
```

### 英雄区（Hero Section）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/482ad19f64fd4702965183aca458fb63~tplv-k3u1fbpfcp-zoom-1.image)

通常情况下，我们需要让英雄区域（Hero Section）的高度等于整个视窗的高度减去页头的高度，即：

```
height = 100vh - header-height
```

即：

```CSS
:root {
    --header-height: 60px;
}
​
header {
    position: sticky;
    top: 0;
    min-height: var(--header-height, initial);
}
​
.hero {
    min-height: calc(100vh - var(--header-height));
}
```

在这种情况下，使用传统的 `vh` 将无法在 iOS Safari、Firefox 和 Android Chrome 等浏览器中运行，即滚动收缩浏览器地址栏。你发现装饰元素（上图中紫色部分）根本不可见。事实上，如果你仔细观察，它在 iOS Safari 的地址栏下面是模糊的，在 Android 浏览器中是裁剪的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81f4ca5962334bd8825a7b04d3cc0f22~tplv-k3u1fbpfcp-zoom-1.image)

在这个示例中，我们可以使用 `svh` 来解决这个问题：

```CSS
.hero {
    min-height: calc(100svh - var(--header-height));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6be8cc9409234b49831533a00856d2ff~tplv-k3u1fbpfcp-zoom-1.image)

虽然动态视窗单位（例如 `dvh`）可以帮助我们解决一些 `100vh` 的问题，但我们在使用的时候还是要小心使用 `dvh` 视窗单位。因为动态视窗单位可能会影响 Web 页面性能，使用动态单位时，浏览器会重新计算用户向上或向下滚动的样式，这个成本是昂贵的。

### 流式宽高比

现在，我们在 CSS 中可以使用 `aspect-ratio` 属性给元素设置一个宽高比，这对于嵌入内容（如视频）尤其有用。在过去，`aspect-ratio` 还没有得到主流浏览器支持的时候，我们会在容器元素使用 `padding-bottom` 或 `padding-top` 的百分比来实现类似 `aspect-ratio` 属性的特性，但这是一种 Hack 手段。

现在我们可以使用视窗单位来实现 `aspect-ratio` 属性的特性，可以说是另一种 Hack 手段，只不过这种 Hack 手段相比于 `padding-top` 或 `padding-bottom` 来说，无需增加额外的 HTML 标签元素。假设，我们希望视频是全屏的，我们可以设置相对于整个视窗宽度的高度：

```CSS
video {
    width: 100vw;
    height: calc(100vw * (9 / 16)); /* full-width * aspect-ratio */
}
```

> Demo 地址：<https://codepen.io/airen/full/xxQPKeO>

### 打破容器限制

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c624ee0b94c14d8ca940ec0d32b515c4~tplv-k3u1fbpfcp-zoom-1.image)

多年来，将约束文本与全宽背景混合使用一直很流行。这样的布局和你的 HTML 结构有着紧密关系，但在一些系统上你控制 HTML 标记成本会比较高（例如 CMS 系统），那么实现这样的布局就变得很困难。有了视窗单位之后，实现该类布局，就显得没那么困难了，只需要几行代码就可以完成：

```CSS
.full-width {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
}
```

> Demo 地址： <https://codepen.io/airen/full/mdQqbYX>

或者使用下面这种方式也是可以的：

```CSS
.break-out {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
}
```

> Demo 地址：<https://codepen.io/airen/full/VwVrZJz>

### 根据重要性调整字体大小

在 Web 布局中，有的时候为了突显某个元素的重要性时，往往会把字体大小设置的更大。比如，同一个组件放置在 Web 页面的侧边栏（`aside`）和主内容区域（`main`），其中主内容区域的标题比侧边栏要大：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d08a87e1710e4288905212f9083fe16e~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，我们使用 CSS 的容器查询单位，可以很容易地实现。

首先，我们需要将 `aside` 和 `main` 定义为一个查询容器：

```CSS
aside,
main {
    container: inline-size;
}
```

然后，我们将容器查询单位运用于组件的标题中：

```CSS
.section__title {
    font-size: clamp(1.25rem, 3cqw, 2rem);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5506c77063ec49d796ba4db6ad4d0b46~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxOoJV>

### 动态间距

我们一直在 CSS 网格布局中使用视窗单位 `vw` 来创建间距。就像：

```CSS
.container {
    gap: calc(14px + 1vh) calc(14px + 0.5vw);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a16105f76d9248658a166fcd2e46c9bc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abQVbYy>

你可能发现了，网格轨道之间的间距是相对于浏览器视窗宽高计算的。看上去已经很不错了，但是在特定的容器中的组件呢？使用视窗单位就行不通了。在此情况之下就需要使用容器查询单位：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/966adf1720de4bd0b07e8f5d0f258333~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
.container {
    container-type: inline-size;
}
​
.card {
    display: flex;
    flex-direction: column;
    gap: calc(0.5rem + 1cqmin);
}
​
@container (width > 320px) {
    .card {
        flex-direction: row;
    }
  
    .card img {
        max-width: 35cqw;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2911f113a2e5442d8a0040c2a5f690af~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/Rwqjwdv>

### 使用 em 调整 Web 组件尺寸大小

前面向大家所展示的示例都是使用视窗单位或容器查询单位来调整 Web 组件的尺寸。事实上，我们在 Web 开发过程中，也可以使用 CSS 的字体相对单位（例如 `%` 、`rem` 或 `em`）来调整组件的大小。不仅仅是字体大小，还有组件中的所有 UI。就拿 `em` 单位为例，我们调整组件 `font-size` 时，组件所有 UI 尺寸都会随之变化：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78d242de735f498799a0002957e83071~tplv-k3u1fbpfcp-zoom-1.image)

来看一个简单的示例，比如上图中的按钮组件：

```CSS
.button {
    font-size: 1em;
    padding: 0.625em 1em;
    border-radius: 0.25em;
}
​
.button--2x {
    font-size: 150%;
}
​
.button--3x {
    font-size: 200%;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da06a52c35674281a6c64a4cfc580b5c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQdvje>

### 使用 lh 实现首字下沉

在《[22 | 首字母下沉：initial-letter](https://juejin.cn/book/7223230325122400288/section/7246991031319658557)》一节课中，我们介绍了如何使用 `initial-letter` 实现首字母下沉的效果。在以往（`initial-letter` 还没有得到主流浏览器支持的情况下），我们一般都是使用浮动来实现首字母下沉的效果，但在这个过程中却很难控制下沉的行数，即达到 `initial-letter` 的效果。

如今，我们使用 `lh` 单位，就容易得多了：

```CSS
p::first-letter {
    color: hsl(20 94% 51%);
    font-weight: bold;
    font-size: 3lh;
    float: left;
    line-height: 1;
    margin-right: 0.1lh;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9f2c0f4437f49629330e9c117b63530~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEwPbr>

而且在个别情况之下，使用 `lh` 单位也要比其他单位灵活的多，比如实现列表标记与文本垂直居中的效果，使用 `lh` 单位就要比 `em` 效果好些：

```CSS
.inline--icon {
    display: inline-block;
    width: 1lh;
    height: 1lh;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3af174bbbd1848d090078aa7005f1d14~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

时至今日，在 CSS 中有近 43 个相对长度单位，它们分别被纳入到字体相对长度单位、视窗相对长度单位和容器查询相对长度单位。它们分别运用于不同的场景。

理解相对长度单位是流式布局或响应式 Web 布局的关键，它使用 CSS 能够应对几乎无限的视窗大小和 DPI。基于字体的单位一开始可能会觉得奇怪，但在获得一些经验之后，你就会认识到它们比绝对单位有更多的好处。视窗单位是有用的，但重要的是要了解何时使用它们，何时百分比 `%` 单位。容器查询单位的出现，使我们设置组件的大小更为方便，我们可以基于组件容器来调整组件自身的大小。

我们也需要知道的，在开发一个 Web 应用或网站时，经常被忽视的方面是使用它们易于访问。就其本质而言，这些相对单位尊重用户特定的字体大小和缩放设置。

虽然目前这些相对单位已经足够多了，但我相信，随着未来技术的革新，还会有更多的相对单位出现，并且得到主流浏览器的支持。值得庆幸的是，我们已经能很好的将现有的相对长度单位结合在一起使用，构建出适配性，灵活性更强的 Web 组件。