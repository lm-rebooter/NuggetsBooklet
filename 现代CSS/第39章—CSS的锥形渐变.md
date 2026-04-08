自从 CSS3 推出之后，CSS 渐变就已然成为 CSS 的一个重要特性，Web 开发者可以用它们来创建有趣的 UI 效果，甚至可以帮助我们绘制一些图形和纹理。换句话说，自从 CSS 推荐渐变特性之后，Web 开发者时常使用它们来替代图片的使用。事实上，越来越多的 Web 应用或网站上的 UI 是使用渐变绘制的，比如网站的导航、按钮等，或者与图像一起使用创建一些不错的效果。

CSS 中的渐变主要有**线性渐变** 、**径向渐变** 和**锥形渐变** ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67dd768823244433a943825ce519b977~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1006&s=231735&e=jpg&b=ffffff)

就线性渐变、径向渐变和锥形渐变而言，Web 开发者可能对 CSS 的锥形渐变（`conic-gradient()` 和 `repeating-conic-gradient()`）会更陌生一点。我们在这节课中重点讨论 CSS 的锥形渐变，你将详细了解锥形渐变是如何工作的以及在哪里使用它。

## CSS 渐变简介

CSS 渐变通常是指一种颜色平滑地过渡到另一种颜色，但允许你控制发生这种情况的各个方面，从方向和形状到颜色以及它们如何从一种颜色过渡到另一种颜色。另外，用户代理（比如浏览器）会将渐变渲染为图像，这个图像可以是纯色、渐变色或者纹理等，而且它可以是背景图（`background-image`）、边框图（`border-image`）和遮罩图（`mask-image`）等，只要是可接受 `<image>` 值类型的属性都可以使用渐变。

实际上，CSS 渐变主要有三种类型：**线性渐变** 、**径向渐变** 和**锥形渐变** ，每一种类型渐变又包含一次性渐变和重复性渐变：

-   线性渐变：`linear-gradient()` （一次性线性渐变）和 `repeating-linear-gradient()` （重复性线性渐变）
-   径向渐变：`radial-gradient()` （一次性径向渐变）和 `repeating-radial-gradient()` （重复性径向渐变）
-   锥形渐变：`conic-gradient()` （一次性锥形渐变）和 `repeating-conic-gradient()` （重复性锥形渐变）

下面是它们的基本语法：

```CSS
.linear-gradient {
    background-image: linear-gradient(
        var(--primary) 0 1vw,
        var(--secondary) 1vw 2vw
    );
}
​
.radial-gradient {
    background-image: radial-gradient(
        var(--primary) 0 1vw,
        var(--secondary) 1vw 2vw
    );
}
​
.conic-gradient {
    background-image: conic-gradient(
        var(--primary) 0 45deg,
        var(--secondary) 45deg 90deg
    );
}
​
.repeating-linear-gradient{
    background-image: repeating-linear-gradient(
        var(--primary) 0 1vw,
        var(--secondary) 1vw 2vw
    );
}
​
.repeating-radial-gradient{
    background-image: repeating-radial-gradient(
        var(--primary) 0 1vw,
        var(--secondary) 1vw 2vw
    );
}
​
.repeating-conic-gradient {
    background-image: repeating-conic-gradient(
        var(--primary) 0 45deg,
        var(--secondary) 45deg 90deg
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21b4ce9d916c40618cafdbdcc94d90df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1109&s=776410&e=jpg&b=17181a)

> Demo 地址：<https://codepen.io/airen/full/mdaEbWG>

## 锥形渐变是什么？

锥形渐变和线性渐变、径向渐变类似，都分为“一次性锥形渐变”和“重复性锥形渐变”。我们先来看一次性锥形渐变。

### 一次性锥形渐变：conic-gradient()

锥形渐变（`conic-gradient()`）和径向渐变（`radial-gradient()`）在某种意义上是相似的，它们都从一个指定的或默认的点开始，作为用于绘制它们的圆的中心。两者的区别在于，径向渐变的渐变颜色停止点（位置）是沿着径向线（圆的半径）放置，而锥形渐变的渐变颜色停止点沿圆周放置。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a630c52eae7d4ac3b61b8f4db2c54c45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1006&s=564624&e=jpg&b=555674)

简单地说，我们可以使用 `conic-gradient()` 函数创建一个围绕元素中心旋转的渐变。例如：

```CSS
.element {
    background: conic-gradient(
        var(--primary, #9c27b0), 
        var(--secondary, #ff9800)
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c206b779ad74ac3a7a05fadefd8aece~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=971&s=455339&e=jpg&b=1f1f41)

> Demo 地址：<https://codepen.io/airen/full/zYyBzRL>

正如你所看到的，使用 `conic-gradient()` 函数绘制的渐变，渐变颜色会围绕着圆心转，从顶部开始顺时针旋转。默认情况下，它是从 `0deg` 旋转到 `360deg` 。

我们也可以给渐变颜色指定停止位置。比如，我们给 `--primary` 颜色指定的停止位置是 `50%` ：

```CSS
.element {
    background: conic-gradient(
        var(--primary, #9c27b0) var(--stop, 50%), 
        var(--secondary, #ff9800)
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5187e3ab54c0465da57cb6ff6e977da3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=952&h=556&s=1746284&e=gif&f=209&b=9422a5)

> Demo 地址：<https://codepen.io/airen/full/zYyBzJm>

上面这个示例，`--primary` 渐变颜色指定了具体的停止位置 `--stop` （比如 `50%`），而 `--secondary` 渐变颜色并没有显式指定停止位置，但它会逐渐显示到 `100%` 。也就是说，下面这两个渐变效果是等同的：

```CSS
.element {
    background: conic-gradient(
        var(--primary, #9c27b0) var(--stop, 50%), 
        var(--secondary, #ff9800)
    );
}
​
/* 等同于 */
.element {
    background: conic-gradient(
        var(--primary, #9c27b0) var(--stop, 50%), 
        var(--secondary, #ff9800) 100%
    );
}
```

要是我们也给 `--secondary` 渐变颜色指定具体的停止位置，那么 `conic-gradient()` 绘制的渐变时又会发生什么呢？例如：

```CSS
.element {
    background: conic-gradient(
        var(--primary, #9c27b0) var(--primary-stop, 50%), 
        var(--secondary, #ff9800) var(--secondary-stop, 100%)
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/370e3151304e4358a6a3a38d17f9e915~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=556&s=2120539&e=gif&f=419&b=9422a5)

> Demo 地址：<https://codepen.io/airen/full/oNJLwrv>

拖动上面示例中第二个滑块，可以调整 `--secondary` 渐变颜色的停止位置，不难发现，当其停止小于或等于 `--primary` 渐变颜色的停止位置时，将会得到一个硬性和径向渐变，即从 `--primary` 硬性过渡到 `--secondary` ，而且两渐变颜色之间有明显的分隔线：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57f24343a14d44de9dfcdf41432434d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=971&s=431646&e=jpg&b=050526)

在此基础上，你调整 `--primary` 渐变颜色，还可以得到一个带有角度的渐变：

```CSS
.element {
    background: conic-gradient(
        var(--primary, #9c27b0) var(--primary-stop, 50%), 
        var(--secondary, #ff9800) var(--secondary-stop, 0)
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fc1860baf614606917d9f3bf9cdd3f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=588&s=686685&e=gif&f=264&b=9021a6)

> Demo 地址：<https://codepen.io/airen/full/oNJLwrv>

将第二个渐变颜色停止位置指定为 `0` 时，你调整第一个渐变颜色停止位置，就可以得到任意角度的渐变效果。而且当两个渐变颜色停止位置相同时，可以得到一个纯色的渐变。

通过上面这几个简单的示例，我们可以得知。如果在 `conic-gradient()` 函数内部，我们有一个没有显式位置的渐变颜色列表（即所有渐变颜色没有显式指定停止点位置），那么第一个渐变颜色的停止点位于圆周上的 `0%` 处，最后一个渐变颜色停止点位于圆周上的 `100%` 处，而其他渐变颜色停止点均匀分布在圆角的 `[0%, 100%]` 区间内：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94e2c7c0d42e41bc8cee36bd6d2d6b32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=754&s=8230027&e=gif&f=302&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/dywXzdp>

如果 `conic-gradient()` 只有两个渐变颜色（即只有两个颜色停止点），那么就很简单。第一个渐变颜色的停止点位于圆周上 `0%` 位置，第二个渐变颜色（也是最后一个渐变颜色）的停止点位于圆周上 `100%` 位置，在它们之间没有其他渐变颜色停止点：

```CSS
.element {
    background-image: conic-gradient(rgb(255 140 0), rgb(255 215 0));
}
​
/* 等同于 */
.element {
    background-image: conic-gradient(rgb(255 140 0) 0%, rgb(255 215 0) 100%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6be62758edd49b58ec591a1a2a7e096~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1726&s=606941&e=jpg&b=ffffff)

如果 `conic-gradient()` 有三个渐变颜色（即有三个颜色停止点），那么第一个渐变颜色停止点位于圆周上 `0%` 的位置，最后一个（第三个）渐变颜色停止点位于圆周上 `100%` 的位置，而第二个颜色停止点正好位于圆周上 `[0%,100%]` 区间的中间位置，即 `50%` 处：

```CSS
.element {
    background-image: conic-gradient(
        rgb(226 224 225),
        rgb(178 191 220),
        rgb(220 188 141)
    );
}
​
/* 等同于 */
.element {
    background-image: conic-gradient(
        rgb(226 224 225) 0%,
        rgb(178 191 220) 50%,
        rgb(220 188 141) 100%
    )
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/788b648ff71a4878a27fa4e999145337~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1902&s=664608&e=jpg&b=f5eeed)

如果 `conic-gradient()` 有四个渐变颜色（即有四个渐变颜色停止点），那么第一个渐变颜色停止点位于圆周上 `0%` 位置处，最后一个（第四个）渐变颜色停止点位于圆周上 `100%` 位置处，而第二个和第三个渐变颜色停止点将圆周上 `[0%, 100%]` 区间均匀分为三个相等的区间，分别位于圆周上 `33.333%` 位置处（第二个渐变颜色停止点）和 `66.666%` 位置处（第三个渐变颜色停止点）：

```CSS
.element {
    background-image: conic-gradient(
        rgb(243 148 80),
        rgb(220 197 183),
        rgb(250 210 63),
        rgb(21 56 76)
    );
}

/* 等同于 */
.element {
    background-image: conic-gradient(
        rgb(243 148 80) 0%,
        rgb(220 197 183) 33.333%,
        rgb(250 210 63) 66.667%,
        rgb(21 56 76) 100%
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcc791b75f044ba98126ff2244fe707d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1902&s=765118&e=jpg&b=fbf4f3)

如果 `conic-gradient()` 有五个渐变颜色（即有五个渐变颜色停止点），那么第一个渐变颜色停止点位于圆周上 `0%` 位置处，最后一个渐变颜色停止点位于圆周上 `100%` 位置处，而第二个、第三个和第四个渐变颜色停止点将圆周上 `[0%, 100%]` 区间均分为四个相等的区间，分别位于圆周上的 `25%` （第二个渐变颜色停止点）、`50%` （第三个渐变颜色停止点）和 `75%` （第四个渐变颜色停止点）位置处：

```CSS
.element {
    background-image: conic-gradient(
        rgb(255 251 180),
        rgb(254 187 21),
        rgb(218 102 1),
        rgb(48 18 0),
        rgb(114 128 15)
    );
}

/* 等同于 */
.element {
    background-image: conic-gradient(
        rgb(255 251 180) 0%,
        rgb(254 187 21) 25%,
        rgb(218 102 1) 50%,
        rgb(48 18 0) 75%,
        rgb(114 128 15) 100%
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/115141143a28480bb57bb2529ff99704~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1902&s=790867&e=jpg&b=fffefe)

如果 `conic-gradient()` 有六个渐变颜色（即有六个渐变颜色停止点），那么第一个渐变颜色停止点位于圆周上 `0%` 位置处，最后一个渐变颜色停止点位于圆周上 `100%` 位置处，而第二个、第三个、第四个和第五个渐变颜色停止点将圆周上 `[0%, 100%]` 区间均分为五个相等的区间，分别位于圆周上 `20%` （第二个渐变颜色停止点）、`40%` （第三个渐变颜色停止点）、`60%` （第四个渐变颜色停止点）和 `80%` (第五个渐变颜色停止点)位置处：

```CSS
.element {
    background-image: conic-gradient(
        rgb(62 4 34), 
        rgb(142 48 82), 
        rgb(170 86 120), 
        rgb(186 213 118), 
        rgb(220 224 165),
        var(236 232 208)
    );
}

/* 等同于 */
.element {
    background-image: conic-gradient(
        rgb(62 4 34) 0%, 
        rgb(142 48 82) 20%, 
        rgb(170 86 120) 40%, 
        rgb(186 213 118) 60%, 
        rgb(220 224 165) 80%,
        var(236 232 208) 100%
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6c1d02093664328b2912c301c8f1b52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1902&s=773157&e=jpg&b=f9f0ee)

也就是说，如果 `conic-gradient()` 函数有 `n` 个渐变颜色（即有 `n` 个渐变颜色停止点），第一个渐变颜色停止点位于圆周上 `0%` 位置处，最后一个渐变颜色停止点位于圆周上 `100%` 位置处，而中间的渐变颜色停止点将圆周的 `[0%, 100%]` 区间均分为 `n-1` 个相等的区间，每个区间跨越 `100% ÷ (n - 1)` 。如果渐变颜色停止点索引号（`i`）从 `0` 开始，那么每个渐变颜色停止点的位置都在圆周上 `i × 100% ÷ (n - 1)` 处：

-   当 `i = 0` （第一个渐变颜色停止点），那么它将位于圆周上 `0 × 100% ÷ (n - 1) = 0%` 处
-   当 `i = n` （第 `n` 个渐变颜色停止点，也是最后一个渐变颜色停止点），那么 `i = n - 1` ，它将位于圆周上 `(n - 1) × 100% ÷ (n - 1) = 100%` 处

如果说 `n = 7` ，即 `conic-gradient()` 共有七个渐变颜色，那么：

-   当 `i = 0` 时（第一个渐变颜色停止点），那么它将位于圆周上 `i × 100% ÷ (n - 1) = 0 × 100% ÷ (7 - 1) = 0%` 处
-   当 `i = 1` 时（第二个渐变颜色停止点），那么它将位于圆周上 `i × 100% ÷ (n - 1) = 1 × 100% ÷ (7 - 1) = 16.667%`
-   当 `i = 2` 时（第三个渐变颜色停止点），那么它将位于圆周上 `i × 100% ÷ (n - 1) = 2 × 100% ÷ (7 - 1) = 33.333%`
-   当 `i = 3` 时（第四个渐变颜色停止点），那么它将位于圆周上 `i × 100% ÷ (n - 1) = 3 × 100% ÷ (7 - 1) = 50%`
-   当 `i = 4` 时（第五个渐变颜色停止点），那么它将位于圆周上 `i × 100% ÷ (n - 1) = 4 × 100% ÷ (7 - 1) = 66.667%`
-   当 `i = 5` 时（第六个渐变颜色停止点），那么它将位于圆周上 `i × 100% ÷ (n - 1) = 5 × 100% ÷ (7 - 1) = 83.333%`
-   当 `i = 6` 时（第七个渐变颜色停止点，即 `i = n - 1`），那么它将位于圆周上 `i × 100% ÷ (n - 1) = 6 × 100% ÷ (7 - 1) = (7 - 1) × 100% ÷ (7 - 1) = 100%`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e526ce3f8f9743ac96bdc98fbee8f206~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1902&s=815328&e=jpg&b=ffffff)

事实上，`conic-gradient()` 函数中的渐变颜色要是未显式指定停止位置，那么会将整个圆周均分成 `n - 1` 个等份。如上图所示，`conic-gradient()` 函数有七个渐变颜色，即 `n = 7` ，相应的整个圆角均分为 `6` 个等份，每个等份对应的是 `360deg ÷ 6 = 60deg` ，然后使用每个渐变颜色索引号（从 `0` 开始计）乘以每个等份的值，计算出来的值就是该渐变颜色在圆周上的停止位置。

`conic-gradient()` 函数除了可以使用百分比值（`%`）指定渐变颜色停止位置之外，还可以通过角度（`<angle>`）值来指定渐变颜色停止位置，比如 `deg` 、`grad` 、`rad` 和 `turn` 等。在一个圆中有 `360deg` 、`400grad` 、`2π rad` 和 `1trun` ，所以 `1个圆 = 360度（deg） = 400梯度（grad） = 2π弧度（rad） = 1圈（trun）` 。以 `deg` 为例：

```CSS
.element {
    background-image: conic-gradient(
        #09f 0deg,
        #123 60deg,
        #aef 120deg,
        #ced 180deg,
        #bae 240deg,
        #90f 300deg,
        #ced 360deg
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93c9cf7169f444c5a316881e7e58c80a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1177&s=502562&e=jpg&b=555577)

> Demo 地址：<https://codepen.io/airen/full/GRPqOzZ>

`conic-gradient()` 函数中渐变颜色停止点位置如果指定的是百分比值，它可以相对于 `360deg` 、`400grad` 、`2π rad` 或 `turn` 来计算，例如 `deg` 为单位，`0%` 对应的是 `0deg` ，它是指圆锥渐变的顶部，`100%` 对应的是 `360deg` ，它也等于 `0deg` 。

需要知道的是，`conic-gradient()` 函数中渐变颜色停止点位置可以大于 `100%` 或 `360deg` ，只不过浏览器通常会将它们视为一圈之后的位置，并将其重新映射到 `[0%, 100%]` 或 `[0deg, 360deg]` 范围内（其他 `<angle>` 单位类似）。这会导致渐变颜色在继续之前重新开始。例如，如果你指定一个渐变颜色的停止点在 `150%` 或 `540deg` 处，浏览器将其视为在 `50%` （`150% - 100% = 50%`）处或 `180deg` （`540deg - 360deg`）处，然后继续进行渐变。这意味着颜色会从指定位置重新开始渐变，而不是继续超出范围。

```CSS
.element {
    background-image: conic-gradient(
        var(--primary, #f59e0b) 0deg,
        var(--secondary, #10b981) 540deg,
        var(--neutral, #525252) 360deg
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dde900ba574443cb359f0ab829a4026~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044&h=712&s=5799970&e=gif&f=417&b=d29927)

> Demo 地址：<https://codepen.io/airen/full/WNLxLqY>

当然，你也可以为 `conic-gradient()` 渐变颜色停止点指定为负值，比如：

```CSS
.element {
    background: conic-gradient(white -50%, black 150%);
}

.element {
    background: conic-gradient(white -180deg, black 540deg);
}

.element {
    background: conic-gradient(hsl(0 0% 75%), hsl(0 0% 25%));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a057222da7fe459881a2d00bfef092d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1160&s=471271&e=jpg&b=8b8b8b)

> Demo 地址：<https://codepen.io/airen/full/KKbMJwY>

在 `conic-gradient()` 中指定负值的颜色停止点通常是无效的，浏览器会将其视为无效的停止点，不会渲染或显示这些颜色。CSS规范要求 `conic-gradient()` 中的颜色停止点必须位于 `[0deg, 360deg]` 或 `[0%, 100%]`范围内。

上面这两个示例都演示了即使在 `[0deg, 360deg]` 或 `[0%, 100%]` 范围之外渐变颜色停止点不会直接绘制，但它们仍然可以影响渐变效果。

因此，在使用 `conic-gradient()` 时，渐变颜色停止点尽可能的不要越出规范定义的范围，比如 `[0%, 100%]` 或 `[0deg, 360deg]` 。

上面所展示的是 `conic-gradient()` 函数最简单的使用方法，而且渐变颜色的起始点都是 `0deg` 或 `0%` 开始。我们可以给 `conic-gradient()` 添加一个 `from` 关键词，来指定渐变颜色的起始点。例如：

```CSS
.element {
    background-image: conic-gradient(
        from var(--start-deg, 0deg),
        var(--primary, #f59e0b) var(--primary-stop, 0deg),
        var(--secondary, #10b981) var(--secondary-stop, 360deg)
    )
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45a6f0b3f9d746ff93883e8b1b22fa3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=952&h=658&s=3641491&e=gif&f=406&b=d29927)

> Demo 地址：<https://codepen.io/airen/full/XWoKOjX>

注意，`from` 关键词后面的角度值（`<angle>`）单位可以是 `deg` 、`grad` 、`rad` 或 `turn` ，而且其范围也是 `[0deg, 360deg]` 区间。

`conic-gradient()` 函数的 `from` 指定的角度值一般是正值，即从顶部顺时针方向的 `<angle>` 位置开始。例如：

```CSS
.element {
    background-image: conic-gradient(
        from 90deg, 
        #34ef91, 
        #34ef4b, 
        #63ef34, 
        #a9ef34, 
        #efef34, 
        #efa934, 
        #ef6334, 
        #ef344b, 
        #ef3491
    )
} 
```

上面代码，渐变是右侧开始，即第一个渐变颜色从顶部顺时针（正向）方向 `90deg` 的位置开始。

反过来说，如果你希望渐变的第一个渐变颜色从左侧开始，即第一个渐变颜色从顶部逆时针（负向）方向`90deg` 的位置开始。在 `conic-gradient()` 函数中，可以给 `from` 指定负值，比如 `from -90deg` 。但我们一般换过一种思路来使用，从顶部逆时针方向 `90deg` 位置开始，相当于从顶部顺时针方向 `270deg` （`360deg - 90deg = 270deg`）位置开始。因此，我们可以这样写 CSS 代码：

```CSS
.element {
    background-image: conic-gradient(
        from 270deg, 
        #34ef91, 
        #34ef4b, 
        #63ef34, 
        #a9ef34, 
        #efef34, 
        #efa934, 
        #ef6334, 
        #ef344b, 
        #ef3491
    )
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9c16102e4f04b92b85505aade5e8063~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1160&s=735088&e=jpg&b=efef35)

> Demo 地址：<https://codepen.io/airen/full/NWerodJ>

除了可以使用 `from` 关键词来改变渐变颜色起始位置之外，`conic-gradient()` 函数还可以使用 `at` 关键词改变锥形渐变的中心点。例如：

```CSS
.element {
    background-image: conic-gradient(
        form var(--start-deg, 0deg) at var(--position, 0px 0px),
        var(--primar, #34ef91) var(--primary-stop, 0deg),
        var(--secondary, #ff5722) var(--secondary, 360deg)
    )
}
```

上面代码中的 `at var(--position, 0px 0px)` 会告诉浏览器锥形渐变的中心指定在元素盒子框的左上角：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/108be75defea4cafa2f34f9be4135040~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=704&s=14653404&e=gif&f=1011&b=6acb70)

> Demo 地址：<https://codepen.io/airen/full/OJrXdxr>

注意，`at` 关键词之后的值和 `background-position` 属性值的使用相似。

如果你想要一个带有角度的硬性渐变，可以指定第二个渐变颜色的停止位置，例如：

```CSS
.element {
    background-image: conic-gradient(
        from 36deg at 20% 80%,
        #a100ffff 0% 25%,
        #000 25% 30%,
        #119cfdff 30% 50%
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b23ae9e4e06d4707a07dfca8c6ef0e67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1044&s=390060&e=jpg&b=202043)

> Demo 地址：<https://codepen.io/airen/full/wvRWNmZ>

如果你对 CSS 渐变有所了解的话，都知道[渐变中有一个灰色死亡区的概念](https://juejin.cn/book/7199571709102391328/section/7199845781149810727)。我们可以使用[颜色插值的功能](https://juejin.cn/book/7223230325122400288/section/7233227753909125178)来避免这个现象。换句话说，颜色插值的功能也可以用于 `conic-gradient()` 函数，它将绘制出更高清的渐变效果，也可以避免渐变中的灰色死亡区现象。例如：

```CSS
.element {
    background-image: conic-gradient(
       from var(--start-deg, 0deg) at var(--position, 50% 50%) in var(--rectangular-color-space, oklch),
       var(--primary,oklch(60% .5 353)) 0deg, 
       var(--secondary, oklch(80% .5 325)) 360deg
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88bf7a4e2e1d4d51b4c6df1ac46e581f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1370&h=724&s=9533577&e=gif&f=138&b=06e7f7)

> Demo 地址：<https://codepen.io/airen/full/abPZxBg>

你可以使用在线的 [HD Gradients 工具](https://gradient.style)来获取高清的圆锥渐变效果。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6326413903424dc491acb20965ea360b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1103&s=422096&e=jpg&b=e0e3e7)

> HD Gradients: <https://gradient.style>

### 重复性圆锥渐变：repeating-conic-gradient()

`conic-gradient()` 与 `linear-gradient()` 和 `radial-gradient()` 渐变函数类似，在该函数前添加 `repeating-` 前缀，即 `repeating-conic-gradient()` ，它就变成了重复性圆锥渐变。

从理论上说，`repeating-conic-gradient()` 与 `conic-gradient()` 和 `repeating-radial-gradient()` 非常相似：

-   与一次性圆锥渐变 `conic-gradient()` 一样，渐变颜色的停止点位于渐变的圆周上
-   与重复性径向渐变 `repeating-radial-gradient()` 一样，重复部分的大小是最后一个渐变颜色停止点的角度减去第一个渐变颜色停止点的角度

例如：

```CSS
.conic-gradient{
    background-image: conic-gradient(
       from var(--start-deg, 0deg) at var(--position, 50% 50%) in var(--rectangular-color-space, oklch),
       var(--primary,oklch(60% .5 353)) 0deg, 
       var(--secondary, oklch(80% .5 325)) 60deg
    );
}

.repeating-conic-gradient {
    background-image: repeating-conic-gradient(
       from var(--start-deg, 0deg) at var(--position, 50% 50%) in var(--rectangular-color-space, oklch),
       var(--primary,oklch(60% .5 353)) 0deg, 
       var(--secondary, oklch(80% .5 325)) 60deg
    );
}
```

上面两代码代码基本上是相同的，前者是一次性圆锥渐变，后者是重复性圆锥渐变，但它们的效果是完全不同的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c3eaae354c84d8f8ec3c37853d3e68f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=578&s=8257710&e=gif&f=338&b=ed7f11)

> Demo 地址：<https://codepen.io/airen/full/jOXrRoX>

我们把上面示例代码稍微调整一下，能更好的理解 `repeating-conic-gradient()` 与 `conic-gradient()` 之间的差异：

```CSS
.conic-gradient{
    background-image: conic-gradient(
       from var(--start-deg, 0deg) at var(--position, 50% 50%) in var(--rectangular-color-space, oklch),
       var(--primary,oklch(60% .5 353)) 0deg 0deg, 
       var(--secondary, oklch(80% .5 325)) 0deg 60deg,
       transparent 0deg
    );
}

.repeating-conic-gradient {
    background-image: repeating-conic-gradient(
       from var(--start-deg, 0deg) at var(--position, 50% 50%) in var(--rectangular-color-space, oklch),
       var(--primary,oklch(60% .5 353)) 0deg 0deg, 
       var(--secondary, oklch(80% .5 325)) 0deg 60deg,
       transparent 0deg
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9b2a4ada5d14c8a94b49da06742d8b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1103&s=746410&e=jpg&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/poqbmwz>

正如你所看到的，`conic-gradient()` 只绘制了 `0deg ~ 60deg` 这一个片段，而 `repeating-conic-gradient()` 自动循环了六次 `0deg ~ 60deg` 的片段，因为在这个示例当中，一个圆对应的度数（`360deg`）刚好是渐变片段（`60deg`）的六倍，因此它重复了六次。如果你将第二个颜色调整之生，它的循环次数也会相应改变：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff145ab6caa74f72b8bde6922dcc65ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1418&h=580&s=1622660&e=gif&f=167&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/poqbmwz>

如果在使用 `repeating-conic-gradient()` 没有明确定义第一个和最后一个渐变颜色停止点位置，那么第一个和最后一个颜色停止点位置分别为 `0` （`0deg`）和 `100%` （`360deg`），那么 `repeating-conic-gradient()` 绘制的渐变将不会重复绘制，它的效果和 `conic-gradient()` 看起来一样：

```CSS
.conic-gradient{
    background-image: conic-gradient(
       from var(--start-deg, 0deg) at var(--position, 50% 50%) in var(--rectangular-color-space, oklch),
       var(--primary,oklch(60% .5 353)), 
       var(--secondary, oklch(80% .5 325))
    );
}

.repeating-conic-gradient {
    background-image: repeating-conic-gradient(
       from var(--start-deg, 0deg) at var(--position, 50% 50%) in var(--rectangular-color-space, oklch),
       var(--primary,oklch(60% .5 353)), 
       var(--secondary, oklch(80% .5 325))
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/117bf70bdd7b4444bc02b491952b33ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=564&s=2724415&e=gif&f=117&b=ed7f11)

> Demo 地址：<https://codepen.io/airen/full/JjwRYPp>

`repeating-conic-gradient()` 和 `conic-gradient()` 类似，可以在渐变圆周上添加多个渐变颜色，并且可以为每个渐变颜色指定停止位置：

```CSS
.conic-gradient{
    background-image: conic-gradient( 
        #09f 0deg, 
        #123 60deg, 
        #aef 120deg, 
        #ced 180deg, 
        #bae 240deg, 
        #90f 300deg, 
        #ced 360deg 
    )
}

.repeating-conic-gradient {
    background-image: repeating-conic-gradient(
        #09f 0deg, 
        #123 60deg, 
        #aef 120deg, 
        #ced 180deg, 
        #bae 240deg, 
        #90f 300deg, 
        #ced 360deg 
    )
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da803a6b440140bcb14de0232c2d3047~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=962&s=477203&e=jpg&b=ffffff)

也可以不给渐变颜色停止点指定具体位置，它将位于前一个渐变颜色停止点和后一个渐变颜色停止点之间的中点：

```CSS
.conic-gradient{
    background-image: conic-gradient( 
        #09f, 
        #123, 
        #aef, 
        #ced, 
        #bae, 
        #90f, 
        #ced 145deg 
    )
}

.repeating-conic-gradient {
    background-image: repeating-conic-gradient(
        #09f, 
        #123, 
        #aef, 
        #ced, 
        #bae, 
        #90f, 
        #ced 145deg 
    )
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31ed710e2e674f3a99183d7b907daf90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=962&s=486321&e=jpg&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/GRPjpoL>

## 锥形渐变的案例

锥形渐变（`conic-gradient()` 和 `repeating-conic-gradient()`）是一种强大的 CSS 渐变类型，它在 Web 设计中具有各种用途，可以用于创建各种各样的视觉效果。以下是一些锥形渐变的使用案例。

### 绘制饼图

可以说，使用 `conic-gradient()` 绘制饼图是再容易不过了。例如：

```CSS
.pie-chart {
    width: 80vh;
    aspect-ratio: 1;
    border-radius: 50%;
    
    background-image: conic-gradient(
        from 0deg at center,
        #f35906 30%,
        #90eafe 0
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5387ca0f995141f1bb89e7cf45652373~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1219&s=295602&e=jpg&b=555577)

> Demo 地址：<https://codepen.io/airen/full/WNLGQXG>

使用多个渐变颜色，还可以绘制更复杂的饼图，比如 [2023 年 CSS 状态报告中有关于 conic-gradient() 的使用](https://2023.stateofcss.com/en-US/features/shapes-and-graphics/)，我们可以像下面这样绘制：

```CSS
.conic-gradient-2021 {
    background-image: conic-gradient(
        #8B8085 60%,
        #38D6FE 0 90.7%,
        #129DC0 0 100%
    );
}

.conic-gradient-2022 {
    background-image: conic-gradient(
        #8B8085 47.1%,
        #38D6FE 0 84.2%,
        #129DC0 0 100%
    );
}

.conic-gradient-2023 {
    background-image: conic-gradient(
        #8B8085 39.3%,
        #38D6FE 0 79.5%,
        #129DC0 0 100%
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98179de83cfe47b282f5e7571ec124ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1219&s=264077&e=jpg&b=5f5979)

> Demo 地址：<https://codepen.io/airen/full/XWojmvP>

使用 `conic-gradient()` 制作饼图有一个小技巧，给渐变颜色指定停止点位置时，需要显式指定两个值，并且第一个值的角度为 `0deg` ，只有这样才能得到一个硬性的渐变过渡，它在外观呈现上才更像一张饼图。

你甚至可以将 `conic-gradient()` 函数与 CSS 自定义属性结合起来创建一个甜甜圈的 UI 效果，该效果会随着用户拖动滑块而改变：

```HTML
<div class="wrapper">
    <input id="r" type="range" min="0" max="100" value="50" step="5">
    <output for="r" role="img" aria-label="50%">50</output>
</div>
```

```CSS
output {
    background: 
        radial-gradient(#3d3d4a 39%, transparent 39.5%),
        conic-gradient(#e64c65 var(--val), #41a8ab 0%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5269b6cfe53461898fa3c146418da75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=952&h=566&s=419251&e=gif&f=141&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/JjwRGdq>

其实这个甜甜圈效果类似于 Web 中的进度条组件（`Progress`）。也就是说，使用 `conic-gradient()` 可以很快构建一个 `Progress` 组件：

```HTML
<div class="progress" role="progressbar" style="--p: 40" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
```

```CSS
@layer animation {
    @property --p {
        syntax: "<integer>";
        inherits: true;
        initial-value: 0;
    }

    @keyframes p {
        95%,
        100% {
            --p: 100;
        }
    }
}

@layer progress {
    .progress {
        --w: 5em;
        --b: 0.33em;
        --c: deeppink;
        
        width: var(--w);
        aspect-ratio: 1;
        position: relative;
        display: inline-grid;
        place-content: center;
        font-size: 2rem;
        
        counter-reset: p var(--p);
        animation: p 8s linear infinite alternate;
    
        &::before,
        &::after {
            content: "";
            position: absolute;
            border-radius: 50%;
        }
    
        &::before {
            content: counter(p) "%";
            inset: 0;
            display: grid;
            place-content: center;
            
            background: 
                radial-gradient(farthest-side, var(--c) 98%, #0000) top / var(--b) var(--b) no-repeat,
                conic-gradient(var(--c) calc(var(--p) * 1%), rgb(0 0 0 / 0.4) 0);
    
            mask: 
                linear-gradient(red, red) text,
                radial-gradient(farthest-side,#0000 calc(99% - var(--b)),#000 calc(100% - var(--b)));
        }
        &::after {
            inset: calc(50% - var(--b) / 2);
            background: var(--c);
            transform: rotate(calc(var(--p) * 3.6deg)) translateY(calc(50% - var(--w) / 2));
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/180111e33bb74788a9cccd58f94d8818~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=958&h=546&s=181469&e=gif&f=111&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/abPmdYo>

用下图简单解释一下上面代码功能：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33dc89853e954e3d94c259029ac49edb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1460&s=679475&e=jpg&b=555577)

上面这个示例，我们还使用了 CSS 的径向渐变、多背景、多遮罩、[CSS 计数器](https://juejin.cn/book/7223230325122400288/section/7259668400379527205) 和 `@property` 等特性。有关于 CSS 遮罩功能，小册后面章节会有详细的介绍。

利用同等原理，还可以制作出 Apple Watch径向图：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0ac39ed57bc4ed6bea8355c75b38121~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=504&s=942186&e=gif&f=110&b=000000)

> Demo 地址：<https://codepen.io/airen/full/PoXGNdX>

同样的，基于 `conic-gradient()` 函数绘制饼图的原理，我们还可以使用它制作一个转盘菜单或转盘类的抽奖 UI:

```CSS
.spinner {
    background-image:conic-gradient(
        from 270deg,
        hsl(140 36% 74%) 0 12.5%,
        hsl(91 43% 54%) 0 25%,
        hsl(350 60% 52%) 0 37.5%,
        hsl(12 76% 61%) 0 50%,
        hsl(27 87% 67%) 0 62.5%,
        hsl(43 74% 66%) 0 75%,
        hsl(173 58% 39%) 0 87.5%,
        hsl(197 30% 43%) 0 100%
    );
  }
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d205e7b41d334379acbdf7267326ab13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=734&s=1638838&e=gif&f=85&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/mdarPbB>

你还可以使用 `conic-gradient()` 和 CSS 的 Masking （遮罩）特性制作一个 Loading 动效：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4919c3816a814e81a38d864723d6b80c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=870&h=516&s=740249&e=gif&f=50&b=000000)

> Demo 地址：<https://codepen.io/airen/full/qBLajbo>

核心代码如下：

```CSS
@layer animation {
    @keyframes r {
        to {
            transform: rotate(1turn);
        }
    }
​
    .load {
        background: 
            conic-gradient(
                from 57.1951535312deg,
                #f8a201 25%,
                #fa2402 0 50%,
                #fdb3b0 0 75%,
                #02dde1 0
            ) border-box;
        
        -webkit-mask-composite: source-over, source-out;
        
        mask: 
            radial-gradient(
                circle 1em,
                red calc(100% - 0.5px),
                transparent calc(100% + 0.5px)
            ) 8em 8em / 9.8994949366em 9.8994949366em border-box add,
            repeating-conic-gradient(
                from 45deg,
                transparent 0% 16.2602047083deg,
                red 81.8698976458deg 25%
            ) border-box subtract,
            linear-gradient(red, red) padding-box;
          animation: r 4s linear infinite;
    }
}
```

[@Ana Tudor 在 Codepen 上有一个 Loading 的动画效果](https://codepen.io/thebabydino/full/WNrbGBz)，都是使用 CSS 的渐变、Masking 和 `@property` 等特性制作的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/797de92b504f4d70865580903ea506a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=906&h=558&s=8622363&e=gif&f=60&b=070707)

> Demo 地址：<https://codepen.io/airen/full/MWZjobJ>

### 渐变边框

如今，使用 CSS 的 `border-image` 和 `conic-gradient()` 函数可以很容易给元素添加一个渐变边框。例如：

```CSS
.card {
    border: 5vmin solid hsl(100 100% 60%);
    border-image-slice: 1;
      
    border-image-source: conic-gradient(
        hsl(100 100% 60%), 
        hsl(200 100% 60%),
        hsl(100 100% 60%)
    );
}
```

在此基础上，如果我们将 `conic-gradient()` 函数中的参数换成 CSS 自定义属性，然后配合一点 JavaScript 脚本代码，更改自定义属性的值，我们就可以得到不一样的渐变边框效果：

```CSS
.card {
    --start-deg: 30deg;
    --border-width: 1em;
    --x: .5;
    --y: .5;
    --conic-gradient-color: #fd0e4c,#fe9000,#fff020,#3edf4b,#3363ff,#b102b7,#fd004c;
​
    border: var(--border-width) solid transparent;
    border-image-slice: 1;
    border-image-source: conic-gradient(
        from var(--start-deg) at calc(var(--x) * 100%) calc(var(--y) * 100%),
        var(--conic-gradient-color)
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfbc6e6bd4c04dc29712cca3938e1a13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=618&s=5255047&e=gif&f=292&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/bGOwRRV>

除此之外，我们还可以使用锥形渐变背景和径向渐变蒙板，可以实现令人惊叹的部分渐变边框，为用户头像组件赋予独特的风格。

```HTML
<figure class="avatar">
    <img src="avatar.png" alt="avatar" />
</figure>
```

```CSS
@layer avatar {
    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }
    
    .avatar {
        --thickness: 3;
        --color1: #fd0e4c, #fe9000, #fff020, #3edf4b, #3363ff, #b102b7;
        --color2: #fd004c;
        --from: 30deg;
        --distance: 46;
    
        width: 80vmin;
        aspect-ratio: 1;
        border-radius: 50%;
        padding: calc(10px + var(--thickness) * 1px);
        position: relative;
        place-self: center;
    
        &::after {
            content: "";
            border-radius: 100%;
            display: block;
            position: absolute;
            inset:0;
            height: 100%;
            aspect-ratio: 1;
            
            background: conic-gradient(
                from var(--from),
                var(--color1),
                var(--color2) calc(var(--distance) * 1%),
                transparent 0
            );
    
            mask: radial-gradient(
                farthest-side,
                transparent calc(100% - calc(var(--thickness) * 1px)),
                #fff calc(100% - calc(var(--thickness) * 1px) + 1px)
            );
        }
    
        &.playing::after {
            animation: spin 2.5s infinite linear;
        }
    
        & img {
            border-radius: 50%;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/856e1074926b4588b450233e972a50b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=594&s=12776150&e=gif&f=297&b=4a4969)

> Demo 地址： <https://codepen.io/airen/full/KKbgqYv>

简单的解释一下上面示例中的代码。首先，使用伪元素 `::after` 给用户头像添加了一个层，该层和图片容器 `.avatar` 一样大，然后伪元素 `::after` 中运用 `conic-gradient()` 函数，绘制了一个锥形渐变的背景，此时它会遮盖住用户头像。为了能让用户头像裸露出来，就需要使用 CSS 的 `mask` 属性。在这个示例中，使用了 CSS 的径向渐变绘制了一个遮罩图，并且它刚好比 `--thickness` 小。这样就从视觉上得到了一个锥形渐变的边框效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4862f9c0aa34eb0ac285ba84c8dc9d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2060&h=1636&s=1057067&e=jpg&b=555577)

### 金属按钮

锥形渐变可用于设计独特的按钮效果，例如类似金属材质的按钮：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/902c28f27f6a48708d69d575f2311d81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=634&s=3926768&e=gif&f=46&b=151a26)

> Demo 地址：<https://codepen.io/airen/full/yLGaopx>

```CSS
.box {
    --d: 30em;
    --bw: 2.25em;
    --pw: 2.3125em;
    --bd: calc(var(--d) - 2 * (var(--bw) + var(--pw) + 0.15em));
    --ad: calc(var(--bd) - 0.125em);
    --alpha: 65%;
    --start-deg:0deg;
   
    padding: var(--pw);
    width: var(--d);
    aspect-ratio: 1;
    z-index: -1;
    border-radius: 50%;
    position: relative;
    border: solid var(--bw) transparent;
    box-shadow: 
        inset 0 0 0 3px #12171f,
        inset 0 0 1px 8px color-mix(in oklch, #1d1f2b, transparent 46%);
    background: 
        linear-gradient(#1a2238, #373944) content-box,
        radial-gradient(color-mix(in oklch,#12171f, transparent 100% ) 70%, #12171f 70%) padding-box, 
        linear-gradient(#414859, #272d3b) padding-box,
        radial-gradient(color-mix(in oklch, #808384, transparent 100%) 70%, color-mix(in oklch, #808384, transparent 68%) 71%) 0 -1px border-box,
        linear-gradient(#10111b, #292c3d) border-box;
​
    &::before,
    &::after {
        z-index: -1;
        content: "";
        aspect-ratio: 1;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        translate:-50% -50%;
    }
    
    &::before {
        width: var(--bd);
        box-shadow: 0 0 0 4px color-mix(in oklch, #02050a, transparent 30%);
        background: linear-gradient(#c8cbd4, #383c44);
    }
    
    &::after {
        width: var(--ad);
        box-shadow: 0 2px 2px -1px #3a3d4b, 0 -2px 2px -1px #f5f4fd;
        background: conic-gradient(
            from var(--start-deg),
            color-mix(in oklch, #d5d8e1, transparent 65%),
            color-mix(in oklch, #666c80, transparent 65%) 36deg,
            color-mix(in oklch, #e6e7eb, transparent 65%) 75deg,
            color-mix(in oklch, grey, transparent 65%) 105deg,
            color-mix(in oklch, #c5c7d3, transparent 65%) 135deg,
            color-mix(in oklch, #898c9b, transparent 65%) 170deg,
            color-mix(in oklch, #d7dee8, transparent 65%),
            color-mix(in oklch, #787d90, transparent 65%) 230deg,
            color-mix(in oklch, #c6c9d2, transparent 65%) 280deg,
            color-mix(in oklch, #9296a3, transparent 65%) 310deg,
            color-mix(in oklch, #d5d8e1, transparent 65%)
       ),
       repeating-radial-gradient(
            transparent,
            color-mix(in oklch, #6d7285, transparent 100%) 2px,
            color-mix(in oklch, #6d7285, transparent 35%) 3px,
            color-mix(in oklch, #6d7285, transparent 35%) 4px,
            color-mix(in oklch, #6d7285, transparent 100%) 5px) #cecfd6;
        animation: startDeg 2.5s infinite linear alternate;
    }
  }
```

我们可以把下面这段代码用于任何按钮上，例如：

```CSS
.handle {
    background: conic-gradient(
        from var(--start-deg, 30deg) at center,
        color-mix(in oklch, #d5d8e1, transparent 65%),
        color-mix(in oklch, #666c80, transparent 65%) 36deg,
        color-mix(in oklch, #e6e7eb, transparent 65%) 75deg,
        color-mix(in oklch, grey, transparent 65%) 105deg,
        color-mix(in oklch, #c5c7d3, transparent 65%) 135deg,
        color-mix(in oklch, #898c9b, transparent 65%) 170deg,
        color-mix(in oklch, #d7dee8, transparent 65%),
        color-mix(in oklch, #787d90, transparent 65%) 230deg,
        color-mix(in oklch, #c6c9d2, transparent 65%) 280deg,
        color-mix(in oklch, #9296a3, transparent 65%) 310deg,
        color-mix(in oklch, #d5d8e1, transparent 65%)
      ),
      repeating-radial-gradient(
          transparent,
          color-mix(in oklch, #6d7285, transparent 80%) 2%,
          color-mix(in oklch, #6d7285, transparent 80%) 2%,
          color-mix(in oklch, #6d7285, transparent 80%) 3%,
          color-mix(in oklch, #6d7285, transparent 80%) 3%
        )
        #cecfd6;
    border-radius: 50%;
    box-shadow: 3px 5px 10px 0 rgba(0, 0, 0, 0.4);
    transition: left 0.4s;
}
```

我们将得到像下面这样的一个切换按钮：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5417355f06a4fdabf745eb297e7c6a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=498&s=982169&e=gif&f=93&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/eYbdeBW>

注意，上面的代码中使用了 [CSS 的 color-mix() 函数](https://juejin.cn/book/7223230325122400288/section/7237288025221234744)来改变一个颜色的透明度。

### 仪表盘：芝麻信用

在没有 `conic-gradient()` 之前，Web 开发者要实现类似芝麻信用仪表盘这样的 UI 还是很痛苦的。现在，使用 `conic-gradient()` 函数把难度一下子降低了。

先来看一个简单的仪表盘的制作。你可以把它看到是饼图的升级版：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93b0bea0283c412fa336ad989b69d585~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=508&s=435226&e=gif&f=89&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/VwqKrQg>

其核心代码如下：

```CSS
.dashboard {
    --w: 400px;
    position: relative;
    width: var(--w);
    aspect-ratio: 1;
    border-radius: 50%;
    background: 
        radial-gradient(
            calc(var(--w) - 60px) circle at center, 
            #fff 49.99%, 
            transparent 50.1%
        ),
        conic-gradient(
            from 247.5deg at center,
            #f1462c 0%,
            #fc5d2c 12.4%,
            #fff 12.5%,
            #fff 12.5%,
            #fc5d2c 12.5%,
            #fba73e 24.9%,
            #fff 24.9%,
            #fff 25%,
            #fba73e 25%,
            #e0fa4e 37.4%,
            #fff 37.4%,
            #fff 37.5%,
            #e0fa4e 37.5%,
            #12dd7e 49.9%,
            #fff 49.9%,
            #fff 50%,
            #12dd7e 50%,
            #0a6e3f 62.5%,
            transparent 0
        );
    mask:conic-gradient(
        from 247.5deg at 50% calc(50% + 20px), red, red 62.5%, #fff0 0
    );
    
    &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: 
            radial-gradient(
                #fff 0%,
                #fff 25%,
                transparent 25%,
                transparent 100%
            ),
            conic-gradient(
                from 247.5deg ,
                #f1462c 0 12.5%,
                #fba73e 0 25%,
                #e0fa4e 0 37.5%,
                #12dd7e 0 50%,
                #0a6e3f 0 62.5%,
                transparent 0
            );
    }
}
​
.point {
    position: absolute;
    width: 30px;
    aspect-ratio: 1;
    translate:-50% -50%;
    left: 50%;
    top: 50%;
    background: radial-gradient(#0e0c0bc7 0%, #090b0ead 100%);
    border-radius: 50%;
    z-index: 999;
    
    &::before {
        content: "";
        position: absolute;
        width: 5px;
        height: 350px;
        left: 50%;
        top: 50%;
        translate:-50% -50% ;
        rotate:-75deg;
        border-radius: 100% 100% 5% 5%;
        background: linear-gradient(
            180deg,
            #0e0c0bc7 0,
            #090b0ead 50%,
            transparent 50%,
            transparent 100%
        );
        animation: rotate 3s cubic-bezier(.93, 1.32, .89, 1.15) infinite alternate;
      }
}
​
@keyframes rotate {
    50% {
        rotate:-100deg;
    }
    100% {
        rotate:90deg;
    }
}
```

在此基础上升级一下，就可以实现类似支付宝芝麻信用分的仪表盘动效：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c86461a807d84412a0bba570c80a0206~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=532&s=297751&e=gif&f=127&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/JjwRMxd>

你还可以使用同样的原理，构建一个雷达扫描的动效：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63352c09c56941f59aba46d2a639ecd7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=900&h=478&s=3115323&e=gif&f=106&b=031417)

> Demo 地址：<https://codepen.io/airen/full/JjwRpGK>

关键代码如下：

```CSS
@layer sonar {
    .rotary {
        width: 100%;
        aspect-ratio: 1;
        background: conic-gradient(#000716 20%, rgb(0 7 22 / 0) 86%, #41f525);
        overflow: hidden;
        border-radius: 50%;
        animation: rotating 5.4s linear infinite;
        transform-origin: center center;
        z-index: -1;
        position: relative;
    }
​
    @keyframes rotating {
        from {
            rotate:0deg;
        }
        to {
            rotate:360deg;
        }
    }
}
```

### 模拟线性渐变

我们可以使用锥形渐变来创建微妙的渐变效果。比如，[@Adam Argyle 设计的一个小型 CSS 库](https://www.conic.style/)，提供了很多好看的圆锥渐变，但它呈现出来的效果更像是线性渐变效果。使用锥形渐变来创建具有角落较暗或较亮的渐变效果。例如：

```CSS
.element {
    background-image: conic-gradient(from 90deg at bottom right, cyan, rebeccapurple);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cab8afb001644222b0eaf7b7c4cfc6aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2060&h=968&s=460033&e=jpg&b=fbfafa)

> conic.css：<https://www.conic.style/>

### 绘制图形

使用 CSS 绘制图形，其中 CSS 渐变是不可或缺技术之一。我们可以使用 `conic-gradient()` 绘制渐变，并且通过 `background-size` 来控制渐变的大小，然后改变锥形渐变的角度以实现不同的效果。

例如：

```CSS
@layer triangle {
    :root {
        --primary: #34ef91;
        --secondary: #FF5722;
        --position-x: 50;
        --position-y: 50;
        --start-deg: 0;
        --primary-stop: 45;
        --alpha: 0;
    }
​
    .triangle {
        --_primary: var(--primary);
        --_secondary: var(--secondary);
        --_start-deg: calc(var(--start-deg) * 1deg);
        --_primary-stop: calc(var(--primary-stop) * 1deg);
        --_position-x: calc(var(--position-x) * 1%);
        --_position-y: calc(var(--position-y) * 1%);
        --_alpha: calc(var(--alpha) * 1%);
        
        background-image: conic-gradient(
            from var(--_start-deg) at var(--_position-x) var(--_position-y),
            var(--_primary)  var(--_primary-stop), 
            color-mix(in oklch, var(--_secondary), transparent var(--_alpha)) 0deg
        );
    } 
}
```

当你改变 `conic-gradient()` 函数中第二个渐变颜色 `--secondary` 的透明度值（`--alpha`）值时，锥形渐变绘制的渐变结果是一个三角形：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7631fd69ca304b8db83130fad7e897da~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=969&s=288655&e=jpg&b=fffefe)

改变 `conic-gradient()` 相关参数，你将得到不同的形状，比如调整锥形渐变的起始角度（`--start-deg`）将将会得到不一样的三角形：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b89f53692cda4c658b3fe13cc2ff5a7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=628&s=3601418&e=gif&f=439&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/ExGgJmr>

你可以通过上面的示例，使用多个 `conic-gradient()` 绘制出不同的形状。例如：

```CSS
@layer patterns {
    .box {
        --b: 20px;
        --a: 90deg;
        --p: 10px;
        --g: #0000 var(--a), #000 0;
        background: 
            conic-gradient(
                from calc(var(--a) / -2 - 45deg) at top var(--b) left var(--b),
                var(--g)
            ) 0 0,
          conic-gradient(
              from calc(var(--a) / -2 + 45deg) at top var(--b) right var(--b),
              var(--g)
          ) 100% 0,
          conic-gradient(
              from calc(var(--a) / -2 - 135deg) at bottom var(--b) left var(--b),
              var(--g)
          ) 0 100%,
          conic-gradient(
              from calc(var(--a) / -2 + 135deg) at bottom var(--b) right var(--b),
              var(--g)
          ) 100% 100%;
​
        background-size: 50.1% 50.1%;
        background-repeat: no-repeat;
    
        &:nth-child(2) {
            --a: 45deg;
        }
    
        &:nth-child(3) {
            --a: 180deg;
        }
      
        &:nth-child(4) {
            --a: 345deg;
        }
    
        &:nth-child(5) {
            --b: 60%;
        }
      
        &:nth-child(6) {
            --b: 60%;
            --a: 45deg;
        }
    
        &:nth-child(7) {
            --b: 40%;
            --a: 215deg;
        }
        
        &:nth-child(8) {
            background-size: 160.1% 50.1%;
            --b: 60%;
            --a: 45deg;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc3f7a89220b4a00873ceaf2765adc70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=974&s=351280&e=jpg&b=000000)

> Demo 地址：<https://codepen.io/airen/full/NWeRVWz>

如果把上面示例中 `conic-gradient()` 绘制出来的图形当作蒙板中的图片（`mask-image`），你将得到不同创意的图片效果。例如：

```CSS
@layer patterns {
    .box {
        --b: 20px;
        --a: 90deg;
        --p: 10px;
        --g: #0000 var(--a), #000 0;
        
        mask: 
            conic-gradient(
                from calc(var(--a) / -2 - 45deg) at top var(--b) left var(--b),
                var(--g)
            ) 0 0,
            conic-gradient(
                from calc(var(--a) / -2 + 45deg) at top var(--b) right var(--b),
                var(--g)
            ) 100% 0,
            conic-gradient(
                from calc(var(--a) / -2 - 135deg) at bottom var(--b) left var(--b),
                var(--g)
            ) 0 100%,
            conic-gradient(
                from calc(var(--a) / -2 + 135deg) at bottom var(--b) right var(--b),
                var(--g)
            ) 100% 100%;
    
        mask-size: 50.1% 50.1%;
        mask-repeat: no-repeat;
        
        &:nth-child(2) {
            --a: 45deg;
        }
    
        &:nth-child(3) {
            --a: 180deg;
        }
        &:nth-child(4) {
            --a: 345deg;
        }
    
        &:nth-child(5) {
            --b: 60%;
        }
        &:nth-child(6) {
            --b: 60%;
            --a: 45deg;
        }
    
        &:nth-child(7) {
            --b: 40%;
            --a: 215deg;
        }
        
        &:nth-child(8) {
            mask-size: 160.1% 50.1%;
            --b: 60%;
            --a: 45deg;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07f971c520834eeba1bd39bbd2be1ac9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1035&s=683532&e=jpg&b=585b77)

> Demo 地址：<https://codepen.io/airen/full/bGOwyjz>

### 背景图案

大约在十年前，[@Lea Verou 使用 CSS 的 `linear-gradient()` 和 `radial-gradient()` 创建了一系列的背景图案](https://projects.verou.me/css3patterns/)。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b18ff7758e74bfe822168b1a1607739~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=706&s=3309410&e=gif&f=70&b=dae4ea)

> URL: <https://projects.verou.me/css3patterns/>

现在，我们可以使用 CSS 的 `conic-gradient()` 对这些图案的制作进行简化。拿下图为例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d4167fdd38e425daa7e0ac6c3b57c6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2940&h=2133&s=1083686&e=png&b=313336)

上图是由多个下图组成的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7299da87c9674dd98445512a61c8a736~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1129&s=892578&e=jpg&b=58221c)

我们使用 `conic-gradient()` 很容易绘制出与上图一样的效果，而且只需要一个 `conic-gradient()` 。

通过前面的学习，我们已然知道。`conic-gradient()` 在默认情况下是从十二点钟方向开始顺时针旋转。就上图效果而言，渐变的起始点顺时针偏移 `45deg` ，然后每个颜色占正方形方框的四分之一：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffc08ed15ef5448f95eae8aed3f4a6e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1129&s=196212&e=jpg&b=ffffff)

使用 `conic-gradient()` 函数很容易绘制上图所示的效果：

```CSS
.element {
    --color1: #4F1E19;
    --color2: #62251F;
    --color3: #9B3C31;
    --color4: #C6645A;
    
    background-image: conic-gradient(
        from 45deg at center,
        var(--color1) 25%,
        var(--color2) 0 50%,
        var(--color3) 0 75%,
        var(--color4) 0
    );
}
```

但要实现真正的效果，那还离不开 `background-size` 。我们可以使用 `background-size` 来设置 `conic-gradient()` 绘制出来的图形大小，比如 `background-size: 20px 20px` ，同时让该图形在容器背景层中平铺（`background-repeat: repeat`）：

```CSS
@layer patterns {
    body {
        --color1: #4F1E19;
        --color2: #62251F;
        --color3: #9B3C31;
        --color4: #C6645A;
        --size: 20px;
        
        background-image: conic-gradient(
            from 45deg at center,
            var(--color1) 25%,
            var(--color2) 0 50%,
            var(--color3) 0 75%,
            var(--color4) 0
        );
        
        background-size: var(--size) var(--size);
    }
}
```

最终你所看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/729a40fd70c34062916cd3d9572aa0ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1129&s=900247&e=jpg&b=58221c)

> Demo 地址：<https://codepen.io/airen/full/ExGgqxe>

再来看一个棋盘的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88d123678f66408f8e916dc70fe175d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1129&s=325069&e=jpg&b=f2f2f2)

```CSS
@layer patterns {
    body {
        --color1: #333;
        --color2: #fff;
        --size: 40px;
        
        background-image: conic-gradient(
            from 0deg at center,
            var(--color1) 25%,
            var(--color2) 0 50%,
            var(--color1) 0 75%,
            var(--color2) 0
        );
        
        background-size: var(--size) var(--size);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17c16e73c43248429d2d4909b56de416~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1129&s=201664&e=jpg&b=efefef)

> Demo 地址：<https://codepen.io/airen/full/oNJzKZK>

如果我们使用 `repeating-conic-gradient()` 也可以实现与上面示例等同的效果，并且还可以让代码变得更简洁：

```CSS
@layer patterns {
    body {
        --color1: #333;
        --color2: #fff;
    
        --size: 40px;
        background-image: repeating-conic-gradient(
            from 0deg at center,
            var(--color1) 0 25%,
            var(--color2) 0 50%
        );
        background-size: var(--size) var(--size);
    }
}
```

> Demo 地址：<https://codepen.io/airen/full/poqEMrL>

你甚至还可以尝试调整锥形渐变的起始角度来获得不一样的背景图案：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a10cb6e7a02949ec89aabef5fefaca8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=882&h=462&s=4489192&e=gif&f=410&b=2b2b2b)

> Demo 地址：<https://codepen.io/airen/full/ExGgqwM>

你甚至还可以使用 CSS 的渐变创作出更有创意的背景图案，比如 [@Ana Tudor 在 Codepen 上提供的一个案例](https://codepen.io/thebabydino/full/NWxBzRv)，就是采用 CSS 的渐变（不仅限于锥形渐变）绘制的不同纹理的背景图：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ced0b196d72040d9b425ff4e4740ab03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1212&s=1477685&e=jpg&b=922c62)

> Demo 地址：<https://codepen.io/airen/full/LYMRwBE>

### Loading 动效

其实前面就介绍过了，使用 `conic-gradient()` 可以制作很有创意的 Loading 动效。另外，前面的示例大部分都是以 `conic-gradient()` 为例的，在这里，向大家展示一个 `repeating-conic-gradient()` 制作 Loading 动效的示例。

```HTML
<div class='loader' style='--n: 1; --f: 0'></div>
<div class='loader' style='--n: 16; --f: .2'></div>
<div class='loader' style='--n: 36; --f: .5'></div>
```

```CSS
@layer animation {
    @property --p {
        syntax: "<integer>";
        initial-value: 0;
        inherits: true;
    }
    
   @keyframes p {
        90%,
        100% {
            --p: 100;
        }
    }
​
    .loader {
        --p: 0;
        animation: p 10s steps(100) infinite;
    
        &::before {
          --slice: calc(360deg / var(--n));
          --s-gap: calc(var(--f) * var(--slice));
          --solid: calc((1 - var(--f)) * var(--slice));
          
          background: 
              repeating-conic-gradient(
                  from calc(0.5 * var(--s-gap)),
                  currentcolor 0% var(--solid),
                  transparent 0% var(--slice)
              ) border-box;
          filter: blur(0.5px);
          
          --mask: 
              conic-gradient(
                  red 0% calc(var(--p) * 1%),
                  rgba(255, 0, 0, 0.3) 0%
              ),
              linear-gradient(red, red) border-box,
              radial-gradient(
                  red 0% 5.5em,
                  transparent calc(5.5em + 1px) calc(5.75em - 1px),
                  red 5.75em calc(6em + 1px),
                  transparent calc(6em + 2px)
              );
              
            mask: var(--mask);
            -webkit-mask-composite: source-in, source-out;
        }
        
        &::after {
            counter-reset: p var(--p);
            content: counter(p) "%";
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/370402e9eff04b41bb31376d11043b28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=530&s=564827&e=gif&f=31&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/JjwRgmP>

## 小结

在这节课中，我们主要和大家一起探讨了 CSS 锥形渐变（`conic-gradient()` 和 `repeating-conic-graident()`）相关的知识。正如你所看到的，CSS 的锥形渐变是一种强大的渐变效果，可以在 Web 设计中创建独特的背景、图形和视觉效果。

CSS 的锥形渐变以角度为基础，沿着一个圆形渐变，使渐变颜色按照指定的角度分布，创造出无限多的可能性。你可以使它来创建饼图、分隔背景、渐变边框、背景图案、加载动画等。使用锥形渐变时，你可以控制渐变颜色的过渡、位置和角度，从而实现复杂的视觉效果。它的灵活性和多功能性使得它成为现代 Web 设计的重要工具之一。无论是创建简单的图形还是复杂的艺术作品，锥形渐变都为 Web 设计师和开发者提供了广泛的创意空间，使得 Web 页面更具吸引力和交互性。

总之，CSS 的锥形渐变是一个强大而多用途的工具，有助于丰富 Web 设计中的视觉元素和用户体验。