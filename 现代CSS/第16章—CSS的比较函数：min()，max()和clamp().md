一个交互性和响应式的 Web 应用或网站可以在所有设备上为用户提供更好的体验。这可以吸引用户并鼓励他们花更多的时间在 Web 应用或网站上。而[响应式 Web 设计](https://s.juejin.cn/ds/U4ProRu/)已经有十多年的发展史了，而且它还在不断地向前发展。在现代 CSS 中有很多 CSS 特性可以更好地帮助我们构建一个响应式 Web 应用或网站，比如，我们这节课要介绍的 CSS 比较函数，即 `min()` 、`max()` 和 `clamp()` 。它们最大的作用就是可以为我们提供动态布局和更灵活设计组件方法。简单地说，这几个函数可以用来设置元素尺寸，比如容器大小、字号大小、内距、外距等。在这节课中，我将和大家一起来探讨 CSS 比较函数在实际开发中能用在哪些地方，又是如何帮助我们构建响应式 UI 的。

## CSS 比较函数简介

CSS 比较函数是指 `min()` 、`max()` 和 `clamp()` 几个函数，它们是 CSS 函数中的一小部分，主要用于比较多个值，并根据计算返回其中一个值。其中：

*   `min()` 从传递给函数的值列表中返回最小值；
*   `max()` 从传递给函数的值列表中返回最大值；
*   `clamp()` 需要以三个逗号分隔的值，最小值、首选值和最大值。如果首选值在范围内，它将返回首选值；否则它将根据情况返回最小值或最大值。

接下来，让我们深入了解每个函数的更多细节。

### min() 函数

CSS 的 `min()` 函数从逗号分隔的值列表中返回最小值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a406b5b7b5204dadbc7ef045d11aeba7~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，`min()` 函数会使用指定值范围中的最小值。我们可以**使用** **`min()`** **函数来设置最大值**。看到这样的描述，你可能会感到困惑，`min()` 函数会返回列表值中的最小值，怎么又是用来设置最大值呢？这不相互矛盾了？事实上并不是这样，我们来看一个示例：

```CSS
.element {
    width: min(50vw, 500px);
}
```

在上面代码中，`50vw` 会随着浏览器视窗宽度动态变化。

*   当浏览器视窗宽度是 `1200px` 时， `50vw` 相当于 `600px` ，此时 `min(50vw, 500px)` 等同于 `min(600px, 500px)` ，相应的 `min(50vw, 500px)` 函数则会返回 `500px` ，相当于 `max-width` 的值为 `500px`。
*   当游览器视窗宽度是 `768px` 时，`50vw` 相当于 `384px` ，此时 `min(50vw, 500px)` 等同于 `min(384px, 500px)` ，相应的 `min(50vw, 500px)` 函数则会返回 `50vw` ，相当于 `min-width` 的值为 `50vw`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17bb5f2934c34dd28bbb16bec31a773c~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，就该示例而言，`.element` 元素的宽度将取决于浏览器视窗宽度。如果 `50vw` 计算的值大于 `500px` ，那么 `min(50vw, 500px)` 将会忽略 `50vw` ，返回 `500px` ，此时元素 `.element` 宽度（`width`）值为 `500px` ；反之，如果 `50vw` 计算的值小于 `500px` ，那么 `min(50vw, 500px)` 将会忽略 `500px` ，返回 `50vw` ，此时元素 `.element` 宽度（`width`）值为 `50vw` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58fadd117625460bbf3bad365ebfa2d4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQKxBg>

正如上面示例所示，`min()` 函数最终返回值和函数中设置的值单位有着直接关系，比如上面示例中的 `50vw` 是和视窗宽度的计算有关，如果换成下面这样的示例：

```CSS
.element { 
    width: min(30%, 50em, 500px); 
} 
```

那么 `%` 和父容器宽度有关，`em` 和元素自身 `font-size` 有关。

如果你还不能很好地理解 `min()` 函数，可以和熟悉的案例结合起来看。比如我们构建一个响应式布局，在 PC 端希望容器的宽度是 `1024px`，而在移动端（比如手机端）希望宽度是 `100%`。以往可能会这样写我们的 CSS：

```CSS
.container { 
    width: 100%; 
    max-width: 1024px; 
} 
```

要是用 `min()` 函数来表达，就可以像下面这样：

```CSS
.container { 
    width: min(1024px, 100%) 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/562dd7c5da2b47d98f62ff304a824acc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEKdWy>

### max() 函数

CSS 的 `max()` 函数刚好与 `min()` 函数相反，它从一个列表值中返回其中最大的值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdc10c0dfd594920b47e14fa676f07fa~tplv-k3u1fbpfcp-zoom-1.image)

我们可以使用它来给元素指定一个最小值，有点类似于 `min-width` 。例如下面这个示例：

```CSS
.container {
    display: grid;
    grid-template-columns: repeat(2, auto);
}

main {
    width: 100%;
}

aside {
    width: max(100%, 300px);
}
```

`.container` 容器从 `100%` 宽度缩小到 `220px` 时，在我们这个例子中，侧边栏 `aside` 的宽度始终不会小于 `300px` ，这就是 `max()` 函数所起的作用。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e1e1a9e9c044848805e5877e4906716~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQWROd>

你可能已经领略到了，CSS 的 `max()` 函数的计算也和列表值单位有着紧密联系，比如下面这个示例：

```CSS
.element {
    width: max(50vw, 500px);
}
```

在上面代码中，`50vw` 会随着浏览器视窗宽度动态变化。

*   当浏览器视窗宽度是 `1200px` 时， `50vw` 相当于 `600px` ，此时 `max(50vw, 500px)` 等同于 `max(600px, 500px)` ，相应的 `max(50vw, 500px)` 函数则会返回 `50vw` 。相当于 `min-width` 的值为 `50vw`。
*   当游览器视窗宽度是 `768px` 时，`50vw` 相当于 `384px` ，此时 `max(50vw, 500px)` 等同于 `max(384px, 500px)` ，相应的 `max(50vw, 500px)` 函数则会返回 `500px` 。相当于 `max-width` 的值为 `500px`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcf808cbd8e046be9e9975a210babaec~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzRKNGp>

不难发现，不管你怎么改变浏览器视窗的宽度，元素 `.element` 最小宽度不会小于 `500px` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c78efb2cdc846fea207f505b800a06f~tplv-k3u1fbpfcp-zoom-1.image)

### clamp() 函数

`clamp()` 函数和 `min()` 以及 `max()` 函数有所不同，它返回的是一个区间值。简单地说，它允许你在最小和最大值之间设置一个值。或者说，它将在下限（最小值）和上限（最大值）之间设置这个值。

也就是说，`clamp()` 函数接受三个参数，即 `clamp(MIN, VAL, MAX)`，其中：

*   `MIN` 表示最小值；
*   `VAL` 表示首选值；
*   `MAX` 表示最大值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12e25707250e4860aad806570b3083f5~tplv-k3u1fbpfcp-zoom-1.image)

`clamp()` 函数会根据下面条件来返回不同的值：

*   如果 `VAL` 在 `MIN` 和 `MAX` 之间（即 `MIN < VAL < MAX`），则使用 `VAL` 作为函数的返回值；
*   如果 `VAL` 大于 `MAX` （即 `VAL > MAX`），则使用 `MAX` 作为函数的返回值；
*   如果 `VAL` 小于 `MIN` （即 `VAL < MIN`），则使用 `MIN` 作为函数的返回值。

我们来看一个示例：

```CSS
.element { 
    /** 
     * MIN = 100px 
     * VAL = 50vw ➜ 根据视窗的宽度计算 
     * MAX = 500px 
     **/ 
    width: clamp(100px, 50vw, 500px); 
} 
```

上面代码中，`50vw` 是一个动态值，它会根据浏览器视窗宽度来计算：

*   当浏览器宽度是 `1200px` 时，`50vw` 相当于 `600px` ，此时 `clamp(MIN, VAL, MAX)` 函数中的 `MIN = 100px` ，`VAL = 50vw = 600px` ，`MAX = 500px` ，并且 `VAL > MAX` ，所以 `clamp(100px, 50vw, 500px)` 函数将会返回 `MAX` 的值，即 `500px` 。
*   当浏览器宽度是 `768px` 时，`50vw` 相当于 `384px` ，此时 `clamp(MIN, VAL, MAX)` 函数中的 `MIN = 100px` ，`VAL = 50vw = 384px` ，`MAX = 500px` ，并且 `MIN < VAL < MAX` ，所以 `clamp(100px, 50vw, 500px)` 函数将会返回 `VAL` 的值，即 `50vw` （相当于 `384px`）。
*   当浏览器宽度是 `180px` 时，`50vw` 相当于 `90px` ，此时 `clamp(MIN, VAL, MAX)` 函数中的 `MIN = 100px` ，`VAL = 50vw = 90px` ，`MAX = 500px` ，此时 `VAL < MIN` ，所以 `clamp(100px, 50vw, 500px)` 函数将会返回 `MIN` 的值，即 `100px` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f39f1a98c3de4dcf87c8b53effc49d05~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLQBgPr>

就该示例而言，`clamp(100px, 50vw, 500px)` 还可以这样来理解：

*   元素 `.element` 的宽度不会小于 `100px`（有点类似于元素设置了 `min-width: 100px`）；
*   元素 `.element` 的宽度不会大于 `500px`（有点类似于元素设置了 `max-width: 500px`）；
*   首选值 `VAL` 为 `50vw`，只有当视窗的宽度大于 `200px` 且小于 `1000px` 时才会有效，即元素 `.element` 的宽度为 `50vw`（有点类似于元素设置了 `width： 50vw`）。

具体效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83204c8b0a2b41fb8e1aaa94ab66c31c~tplv-k3u1fbpfcp-zoom-1.image)

如果使用了 `clamp()` 函数的话，相当于使用了 `min()` 和 `max()` 函数，具体来说：

```CSS
clamp(MIN, VAL, MAX) = max(MIN, min(VAL, MAX))
```

就上面示例而言：

```CSS
.element { 
    width: clamp(100px, 50vw, 500px); 
} 
```

和下面的代码等效：

```CSS
.element { 
    width: max(100px, max(50vw, 500px)); 
} 
```

正如前面所述，`clamp()` 的计算会经历以下几个步骤：

```CSS
.element { 
    width: clamp(100px, 50vw, 500px); 
    /* 50vw 相当于视窗宽度的一半，如果视窗宽度是 768px的话，那么50vw 相当等于384px */ 
    width: clamp(100px, 384px, 500px); 
    
    /* 用 min() 和 max() 描述*/ 
    width: max(100px, min(384px, 500px));
    
    /* min(384px, 500px)返回的值是384px */ 
    width: max(100px, 384px) 
    
    /* max(100px, 384px)返回的值是384px */ 
    width: 384px; 
} 
```

这和前面介绍 `clamp(MIN,VAL,MAX)` 时计算出来结果一致（`VAL` 大于 `MIN` 且小于 `MAX` 会取首选值 `VAL`）。

简单地总结一下：

*   `min(val1, val2, val3, ...)`：从逗号分隔的表达式列表中选择最小值；
*   `max(val1, val2, val3, ...)`：从逗号分隔的表达式列表中选择最大值；
*   `clamp(MIN, VAL, MAX)`：根据设定的理想值，将值限定在上限与下限之间。

需要知道的是，在 CSS 中，只要属性的值是 `<length>`、`<frequency>`、`<angle>`、`<time>`、`<percentage>`、`<number>` 或 `<integer>` 类型之一，就可以使用这些函数。例如 `width` 、`font-size` 、`animation-delay` 、`padding` 、`margin` 和 `rotate` 等。但我们常常在尺寸大小、内距、外距、边框宽度等属性上使用这些函数，可以更好地构建响应式 UI，让我们构建 **[现代 Web 布局](https://s.juejin.cn/ds/UVUS3Yt/)** 变得更容易。

比如下面这个示例，构建一个单列页面布局，使其宽度处于最理想状态。

> [@Robert Bringhurst 曾经说过](http://webtypography.net/2.1.2#:~:text=%E2%80%9CAnything%3E%20from%2045%20to%2075,is%2040%20to%2050%20characters.)：对于有衬线字体的单列页面，一般认为一行 `45` 到 `75` 个字符的长度是比较理想的。

为了确保文本块不少于 `45` 个字符，也不超过 `75` 个字符，请使用 `clamp()` 和 `ch`单位：

```CSS
.container {
    width: clamp(45ch, 50%, 75ch);
}
```

这样，浏览器就可以确定段落的宽度。它会将宽度设置为 `50%`，但如果 `50%` 的宽度小于 `45ch`，则会选择 `45ch`；反之，如果 `50%` 的宽度比 `75ch` 更宽，则会选择 `75ch`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb8d2912fbb0409ab3890fcd11570438~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMONeq>

只需要使用 `min()` 或 `max()` 函数，你就可以打破这种限制。如果您希望元素使用 `50%` 的宽度，并且不超过 `75ch`（即在较大的屏幕上），则可以这样编写代码：

```CSS
.container {
    width: min(75ch, 50%);
}
```

实际上，这是使用 `min()` 函数来给容器 `.container` 设置“最大宽度”值，即 `max-width: 75ch` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b85079b0dbeb4b6592d99d599ecc262b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQKgog>

你可能已经发现了，这样给容器设置宽度，用户的体验并不好，尤其是在小屏下，它始终只有容器宽度的一半。

同样，你也可以使用 `max()` 函数来设定最小尺寸，让文本更清晰易读。例如：

```CSS
.container {
    width: max(45ch, 50%);
}
```

这样，浏览器就会选择 `45ch` 或 `50%` 中较大的值，这意味着元素 `.container` 的宽度至少为 `45ch`，有点类似于设置 `min-width: 45ch` ，否则会更大。但这样的设备同样不是一个理想宽度，在小于 `45ch` 的屏幕宽度会出现水平滚动条：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d967b10cb8b491d939ab0fe05438590~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQOvOJ>

通过比较这三个示例，我们可以知道，使用 `clamp()` 函数可以限制容器最小和最大宽度，可以帮助我们构建一个理想宽度。

## CSS 比较函数计算取决于上下文

不知道你有没有发现，在前面的示例中，我们在 `min()`、`max()` 和 `clamp()` 函数参数使用 `vw` 时，最终的计算值是依据视窗的宽度来计算的；使用百分比 `%` 时，最终计算是依据父元素的 `width` 来计算。换句话说，我们在使用这些函数时，参数中运用的不同值单位对最终值是有一定的影响，也就是说：**`min()`****、****`max()`** **和** **`clamp()`** **函数中的参数，计算的值取决于上下文**。

在 CSS 中很多取值的单位是和上下文有关系的，比如我们熟悉的 `vw`、`vh`、`%`、`rem` 和 `em` 等。就拿 `%` 单位来说吧，如果元素是 `<body>` 子元素，那么它的计算方式就是基于浏览器视窗宽度来计算，如果元素是另一个元素的子元素，那这个时候可能会基于它的父元素来计算。再比如说，`rem` 单位，它始终会基于 `<html>` 元素的 `font-size` 来计算。

可以说，这些相对单位对于 `min()`、`max()` 和 `clamp()` 返回值有着直接的影响。比如下面这个示例：

```CSS
.element { 
    width: min(10vw, 10rem, 100px); 
} 
```

其中 `10vw` 和浏览器视窗宽度有关，`rem` 和 `html` 的 `font-size` 有关（默认为 `16px`）。在 `10vw`、`10rem` 和 `100px` 三个值中，前两个是相对长度值，最后一个是固定长度值。因此，就该示例来说，`width` 真实的值和视窗宽度以及 `html` 元素的 `font-size` 有关：

*   假设浏览器视窗宽度是 `1200px` ，那么 `10vw` 对应的就是 `120px` ；
*   假设 `html` 的 `font-size` 采用的是默认值（ `16px`），那么 `10rem` 对应的值是 `160px`。

在这样的上下文信息中， `min(10vw, 10rem, 100px)` 对应的值就是 `min(120px, 160px, 100px)`，即最后`width` 的值为 `100px`。同样是这个示例：

*   假设浏览器视窗宽度是 `768px` ，那么 `10vw` 对应的值就是 `76.8px` ；
*   假设 `html` 的 `font-size` 显式地修改为 `12px` ，那么 `10rem` 对应的就是 `120px` 。

在这样的上下文信息中，`min(10vw, 10rem, 100px)` 对应的值就是 `min(76.8px, 120px, 100px)`，即`min()` 函数最终返回的值就是 `10vw`（即浏览器视窗宽度处在 `768px` 位置处时，相当于 `76.8px`）。

对于 `vw`、`vh`、`vmin`、`vmax` 和 `rem` 这样的相对单位计算起来还是很简单的，它们之间的依赖关系很明确。但对于像 `%` 和 `em` 这样的相对单位和环境之间的关系就很紧密了。

## CSS 比较函数中的数学表达式

在 CSS 中，最早可以使用数学表达式的函数是 `calc()` 。`calc()` 允许你用 CSS 尺寸属性的值进行基本的数学运算，比如给 `width` 的值做**加（****`+`****）**、**减（****`-`****）**、 **乘（`×`）** 和 **除（****`÷`****）** 四则运算。并且可以在单位之间做插值计算，比如不同单位之间的混合计算，如  `calc(100% - 20px)` ，运算式中的 `%` 和 `px` 单位，客户端会自己进行插件计算。

`calc()` 最大的好处是允许你避免在 CSS 硬编码一系列神奇的数字或使用 JavaScript 来计算所需的值。特别是在 CSS 自定义属性的使用中，`calc()` 的身影随处可见。比如下面这个示例，使用 `calc()` 将一个数值变成带有 `%` 的值：

```CSS
:root { 
    --h: 180; 
    --s: 50; 
    --l: 50; 
} 

.icon__container { 
    color: hsl(var(--h) calc(var(--s) * 1%) calc(var(--l) * 1%)); 
} 

.icon__container--like { 
    --h: 232; 
}
```

而比较函数  `min()`、`max()` 和 `clamp()` 和 `calc()` 类似，函数列表中的值可以是一个数学表达式。例如：

```CSS
body { 
    font-size: clamp(12px, 10 * (1vw + 1vh) / 2, 100px); 
}

.container {
    width: min(80ch, 100vw - 2rem);
}

footer {
    padding: var(--blockPadding) max(2rem, 50vw - var(--contentWidth) / 2);
}
```

你也可以与 `calc()` 结合使用，例如：

```CSS
body {
    font-size: max(calc(0.5vw - 1em), 2rem)
}
```

但没有这样的必要，因为上面的代码等同于：

```CSS
body {
    font-size: max(0.5vw - 1em, 2rem)
}
```

在 `min()`、`max()` 和 `clamp()` 函数中使用数学表达式时，为了避免它们失效，有一个细节需要注意：如果表达式中用到加法（`+`）和减法（`-`）时，**其前后必须要有空格**；对于乘法（`*`）和除法（`/`），其**前后可以没有空格**。但为了避免这样的书写方式引起错误，我建议你平时在写代码的时候，在运算符前后都留一定的空格。

在使用 CSS 比较函数时，除了使用数学表达式之外，还可以嵌套使用，比如：

```CSS
.element { 
    width: max(100px, min(50vw, 500px)); 
    border: min(10px, 2px * 1vw) solid #f36; 
    box-shaodw: max(2vh, var(--x)) min(2vh, var(--y)) 0 rgb(0 0 0 /.25); 
} 
```

嵌套层级越深越易造成错误，因此在没有特性情况（非必要）下，不建议在函数中嵌套函数。

## 注意事项

我们使用 `min()` 、`max()` 和 `clamp()` 函数主要是用来确保值不超过“**安全**”限制。例如，`font-size` 使用了视窗单位，比如 `vw` ，但为了可访问性，会设置一个最小值，确保文本可阅读。这个时候，我们可以像下面这样使用：

```CSS
body { 
    font-size: max(3vw + 12px, 12px); 
} 
```

我们在使用 `min()` 和 `max()` 函数时，偶尔也会造成一定的混淆，比如在 `max()` 函数中对某个值设置了最小值（即，像 `min-width` 这样的属性有效地使用 `max()`）；同样的，在 `min()` 函数中设置了最大值（即，像 `max-width` 这样的属性有效地使用 `min()`）。为了便于理解，使用 `clamp()` 函数会更自然些，因为数值介于最小和最大值之间：

```CSS
body { 
    font-size: clamp(12px, 3vw + 12px, 24px); 
} 
```

但要注意，`clamp()` 函数中值有“顺序错误”，即它的最小值（`MIN`）超过了最大值（`MAX`）。例如 `clamp(100px, 50vw, 50px)` ，它会被解析为 `100px` 。针对这个示例，我们来看看它的计算过程。当浏览器视窗宽度等于 `170px` 时：

```CSS
clamp(100px, 50vw, 50px) ➜ clamp(100px, 85px, 50px) 
```

此时，`clamp()` 函数中的 `VAL` 大于 `MAX`，但同时也小于 `MIN` 。

通过前面的内容，我们可以知道，当 `VAL > MAX` 时，`clamp()` 函数返回的是 `MAX`，但在这个示例中，`VAL` 同时也小于 `MIN`（即 `VAL < MIN` ），`clamp()` 函数会返回 `MIN`。看上去没矛盾，但看上去又有矛盾。而事实上呢，这个场景之下，`clamp()` 函数返回的的的确确是 `MIN`的值，即 `100px`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdce4cb3f78d418985501964f0eec799~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/zYMOwye>

正如你所看到的，`clamp()` 函数中两个参数（`MIN` 和 `MAX`）顺序相反，那么最小值 `MIN` “胜出”于最大值 `MAX` 。也就是上面示例中，你所看到的，`clamp(100px, 50vw, 50px)` 的结果是 `100px` 。

如果需要其他的解决方案，可以将 `clamp()` 与 `min()` 或 `max()` 结合使用。

*   要使 `MAX` 的值取胜，可以使用 `clamp(min(MIN, MAX), VAL, MAX)` 。如果想避免重复计算 `MAX` 值，可以反转 `clamp()` 函数定义的嵌套方式，即 `clamp(min(MAX, max(MIN, VAL)))` 。
*   要在最小值和最大值的顺序相反时进行交换，可以使用 `clamp(min(MIN, MAX), VAL, max(MIN, MAX))`。不幸的是，没有简单的方法可以不重复使用 `MIN` 和 `MAX` 参数。

这两种情况下要重点记住，这种嵌套函数的方法可能对性能产生影响，并且应该谨慎使用，仅在需要时使用。

还有一点需要特别注意的是，在使用 `min()`、`max()` 和 `clamp()` 函数时，里面的值都应该显式指定值单位，即使是值为 `0` 也应该带上相应单位，比如：

```CSS
.element { 
    padding: clamp(0, 2vw, 10px); 
} 
```

上面的 `padding` 将会是无效的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/941a4de380fe438d829aeffbd006b32f~tplv-k3u1fbpfcp-zoom-1.image)

## CSS 比较函数给设计带来的变化

对于现代 Web 设计师和开发者都不是一件容易的事情，因为随着众多不同终端的出现，要考虑的场景越来越复杂。随着 `min()`、`max()` 和 `clamp()` 函数的到来，设计师估计在做设计的时候也要有一些思想上的变化。比如说，在这之前，设计师可能会根据不同的场景为元素设计不同的大小：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bd38539bece460291c2be208e566a81~tplv-k3u1fbpfcp-zoom-1.image)

那现在，基于 CSS 比较函数相关特性，Web 设计师可以像下图这样提供设计。比如，提供最小、最大和推荐三种状态下的设计风格：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9216edab42ab4e938d7b041cf0a6d86d~tplv-k3u1fbpfcp-zoom-1.image)

比如说，在响应式设计中，希望在不同的终端上文本的字号有所不同，就可以像下面这样使用：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d5ca6b44dff411784e61004f0c46231~tplv-k3u1fbpfcp-zoom-1.image)

你可能也已经发现了，这和我们前面介绍的 `clamp()` 函数非常匹配：

```CSS
body { 
    font-size: clamp(16px, 5vw, 50px);
} 
```

这样的设计对于一些需要动态改变值的场景非常有用。

## 案例

通过前面的学习，我们对 CSS 的 `min()` 、`max()` 和 `clamp()` 等函数有了一定的认识，接下来，我们来看它们在实际开发中应该如何使用，具体可以用在哪些场景。

### 吶应式布局

[现代 Web 布局](https://s.juejin.cn/ds/UVpffar/)中，常常基于 CSS 的 Flexbox 或 Grid 来布局，但不管是使用哪种布局技术，都离不开对元素的尺寸设置和值单位的运用等。也就是说，我们在布局中总是少不了对尺寸进行计算。在没有这些 CSS 函数之前，我们需要使用 JavaScript 来动态计算，但有了这些函数特性，让你布局更为灵活。

先拿典型的两列布局为例。希望侧边栏在大屏幕下有足够宽的空间，但同时也希望它有一个最小的宽度。在这之前，我们可能会这样来写 CSS：

```CSS
aside { 
    width: 30vw; 
    min-width: 220px; 
} 
```

如果是用 CSS Grid 布局的话，可以使用 `minmax()` 函数：

```CSS
 .container { 
     display: grid; 
     grid-template-column: minmax(220px, 30vw) 1fr;
 } 
```

而现在，我们可以使用 `max()` 函数来处理：

```CSS
aside { 
    flex-basis: max(30vw, 220px);
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f10e9dd571a4d03ba1aac635ff8cb41~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzgoBN>

再来看另一个两列布局示例，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e02c55bf9cf6445b89a442e7695af465~tplv-k3u1fbpfcp-zoom-1.image)

就上图这布局，对于 CSS Flexbox 和 CSS Grid 而言，一点难度都没有。

```CSS
body {
     --aside-w: 320px;
     --gap: 20px;
  
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

aside { 
    flex: 1 0 var(--aside-w); 
} 

main { 
    flex: 1 1 calc(100% - var(--aside-w) - var(--gap)); 
}
```

不过，我们可以在这个基础上做得更好，可以给 `main` 设置一个最佳的值，比如：

```CSS
main { 
    flex: 1 1 calc(100% - var(--aside-w) - var(--gap)); 
    min-width: min(100%, 18ch); 
}
```

在 `min-width` 属性上使用 `min()` 函数，给 Flex 项目 `main` 设置一个下限值。根据上下文环境计算，当 `18ch` 长度值小于 `100%`（父容器宽度的 `100%`），`min()` 函数会返回 `18ch`，反之则会返回 `100%`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06d0c8f3179341c38867e834bb465a9f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQWjMq>

不知道你有没有发现，让浏览器视窗宽度小于 `320px` 的时候，页面的布局还是不够完美的。即：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a12f941ca1ee45b8947b709a52df5b2c~tplv-k3u1fbpfcp-zoom-1.image)

我们可以在 `aside` 的 `flex-basis` 上使用 `min()` 函数，让它变得更为完善：

```CSS
aside { 
    flex: 1 0 min(100%, var(--aside-w)); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99e3c8ab9f624eeaae3018f1ffbbe779~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGBZqP>

如此一来，构建的布局不会那么容易被打破，具有较强的动态性和响应性，而且还不需要依赖任何的 JavaScript 脚本和 CSS 媒体查询（或其他的条件查询）。

不知道大家是否还有印象，CSS Grid 构建的 Full-Bleed 和 RAM 布局中都有 CSS 比较函数的身影：

```CSS
/* CSS Grid Layout: Full-Bleed Layout */
.full-bleed {
    --limit-max-container-width: 1024px;
    --limit-min-container-width: 320px;
    --gutter: 1rem;
    
    display: grid;
    grid-template-columns:
        minmax(var(--gutter), 1fr)
        minmax(
            min(var(--limit-min-container-width), 100% - var(--gutter) * 2),
            var(--limit-max-container-width)
        )
        minmax(var(--gutter), 1fr);
    row-gap: var(--gutter);
}

/* CSS Grid Layout: RAM Layout */
.ram-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100% - 2rem, 380px), 1fr));
    gap: 1rem;
}
```

上面示例向大家展示了使用 CSS 比较函数构建的布局，除了具有一定的响应之外，还可以给元素设置一个界限值。其实，使用它们还可以构建一些更有意思的布局，比如 [@Temani Afif](https://twitter.com/ChallengesCss) 的《[Responsive Layouts, Fewer Media Queries](https://css-tricks.com/responsive-layouts-fewer-media-queries/)》文章中所介绍的，使用 `clamp()` 函数来构建理想列。

> **"理想列"这个词是我根据“理想宽度”提出来的**！

简单地说，在一些特殊场景中，可以不依赖任何 CSS 媒体特性实现，让你的布局离 CSS 容器查询更近一步。比如下面这样的布局：

```CSS
:root { 
    --item-size: 400px; 
    --gap: 1rem; 
} 

/* CSS Flexbox Layout */
.flex { 
    display: flex; 
    flex-wrap: wrap; 
    gap: var(--gap); 
} 

.flex li { 
    flex: 1 1 var(--item-size); 
 } 
 
/* CSS Grid Layout: RAM */
.grid { 
    display: grid; 
    gap: var(--gap); 
    grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--item-size)), 1fr)); 
}
```

能让卡片随容器尺寸做出响应：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80777a135f134fc8b2dcf1e6628b4f0b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxYjxa>

虽然上面的效果已经不错了，但还是没法在指定的视窗断点下显示具体的列数。有意思的是，我们可以使用 `clamp()` 来实现该效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb6b2d2cca47432aa98474ca3d83c559~tplv-k3u1fbpfcp-zoom-1.image)

上图的意思是，可以随着浏览器视窗宽度来改变排列的列数：

*   视窗宽度小于或等于 `W3` 断点（比如，`768px`）时，每行保持 `M` 列（比如 `M = 1` ）显示；
*   视窗宽度在 `W3 ~ W2` （比如 `768px ~ 992px`）范围内，每行保持 `N` 列（比如 `N = 2` )显示；
*   视窗宽度在 `W2 ~ W1` （比如 `992px ~ 1200px`） 范围内，每行保持 `O` 列（比如 `O = 3` )列显示；
*   视窗宽度大于或等于 `W1` （比如 `1200px`）时，每行保持 `P` （比如 `P = 4` ）列显示。

假设我们期望的每行显示 `P` 列，这个 `P = 4` ，并且列与列之间有一个间距 `gap` ，我们就可以通过下面这个公式计算出每列的初始列宽：

```CSS
初始宽度 = 容器宽度的 100% ÷ 列数 - （列数 - 1） × 列间距 = 100% ÷ P - (P - 1) × gap = 100% ÷ 4 - (4 - 1) × gap
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e6c701e6404672876a7710f366d567~tplv-k3u1fbpfcp-zoom-1.image)

我们可以使用 CSS 自定义属性来替代上面所描述的参数：

```CSS
:root {
    --P: 4;      /* 期望每行显示的列数 */
    --gap: 1rem; /* 期望的列间距 */
    
    /* 根据公式计算出初始尺寸 100% ÷ P - (P - 1) × gap */
    --initial-size: calc(100% / var(--P) - (var(--P) - 1) * var(--gap));
}
```

将计算出来的 `--initial-size` 值分别用于 Flex 项目和 Grid 项目：

```CSS
/* CSS Flexbox Layout */
.container--flex {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
}

.flex__item {
    flex: 1 1 var(--initial-size);
}

/* CSS Grid Layout */
.container--grid {
    display: grid;
    gap: var(--gap);
    grid-template-columns: repeat(auto-fit, minmax(var(--initial-size), 1fr));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78a6c24cc6bf4a6b88b41426f7081e7e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQbwvX>

你可能发现了，不管是 CSS Flexbox 还是 CSS Grid 构建的布局，每行都能显示四列（它符合我们最初的期望），而且不管浏览器视窗大小，大多数情况都能保持每行四列的呈现。只不过浏览器视窗越小，Flex 项目和 Grid 项目的尺寸也会随之变得越小。另外就是，CSS Flexbox 看上去一切都很正常，但对于 CSS Grid 来说，该示例已失去了 RAM 布局的特性。

不过，我们可以在此基础上，将 CSS 比较函数的 `max()` 运用于 `--initial-size` 中，这样就允许你给 Flex 项目或 Grid 项目设置一个理想宽度值。而整个布局效果要比上一个示例更完善（CSS Grid 中的 RAM 又重新起作用了）：

```CSS
:root {
    --P: 4;               /* 期望每行显示的列数 */
    --gap: 1rem;          /* 期望的列间距 */
    --ideal-size: 400px;  /* 理想宽度 */
    
    /* 根据公式计算出初始尺寸 100% ÷ P - (P - 1) × gap */
    --initial-size: max(var(--ideal-size), 100% / var(--P) - (var(--P) - 1) * var(--gap));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61ffa69fb8c1412c89f76ad8ae8d75d0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjePJzE>

上面的示例中，我们都显式设置了列间距 `gap` 。我们也可以把 `gap` 去除，相应的公式就变成：

```CSS
/* 优化前公式 */
width = 100% ÷ P - (P - 1) × gap

/* 优化后公式 */
width = 100% ÷ (P + 1) + 0.1%
```

其逻辑是 “**告诉浏览器，每个 Flex 或** **Grid 项目的宽度等于** **`100% / (P + 1)`** ”，因此每行都会有 `P + 1` 个项目。每个项目宽度增加 `0.1%` 是 CSS 的一个小魔法，就是让**第** **`P + 1`** **个项目换行** 。所以，最后呈现的是每行 `P` 个项目排列：

```CSS
:root { 
    --ideal-size: 400px; /* 理想宽度*/
    --P: 4;              /* 期望每行显示的列数（理想列数）*/
    --gap: 20px;         /* 列间距 */    
    --responsive-size: max( var(--ideal-size), 100% / (var(--P) + 1) + 0.1% ); /* 具有响应式的列宽 */
} 

/* CSS Flexbox Layout */
.container--flex { 
    display: flex; 
    flex-wrap: wrap; 
    gap: var(--gap); 
} 

.flex__item { 
    flex: var(--responsive-size); 
 } 
 
 /* CSS Grid Layout: RAM */
.grid { 
    display: grid; 
    gap: var(--gap); 
    grid-template-columns: repeat( auto-fit, minmax(var(--responsive-size), 1fr)); 
}
```

> Demo 地址：<https://codepen.io/airen/full/KKrPqEj>

你会发现，每个项目最小宽度会是 `400px`（即 `--ideal-size`）：

*   当容器有足够空间（等于 `4 x 400px + 3 x 20px`）容纳时，每行刚好会呈现四列（`4 x 400px`）加上三个列间距（`--gap`）；
*   当容器有足够空间（大于 `4 x 400px + 3 x 20px`）容纳时，每行也将呈现四列，但每个项目的宽度会扩展，**扩展值是均分容器剩余空间** ；
*   当容器无足够空间（小于 `4 x 400px + 3 x 20px` ）容纳时，每行呈现的列数将会小于 `4`，且每个项目的宽度会扩展，扩展值是均分容器剩余空间。

不过，这个方案运用于 CSS Grid 的轨道尺寸设置时会有一定的缺陷：当网格容器小于 `--ideal-size` 时，网格项目会溢出网格容器：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98028dc225e343f181e9500effcd3903~tplv-k3u1fbpfcp-zoom-1.image)

我们可以使用 CSS 比较函数中的 `clamp()` 替换示例中的 `max()` ：

```CSS
/* max() 函数计算的 Responsive Size */ 
width = max(var(--ideal-size),100% / (P + 1) + 0.1%) 

/* clamp() 函数计算的 Responsive Size */ 
width = clamp(100% / (P + 1) + 0.1%, var(--ideal-size), 100%)
```

它的作用是：

*   当容器宽度较大时，`100% / (P + 1) + 0.1%` 的值（或可能）会大于 `--ideal-size`，相当于 `clamp(MIN, VAL, MAX)` 函数中的 `MIN` 值大于 `VAL` 值，`clamp()` 函数会返回 `MIN` 值，即 `100% / (P + 1) + 0.1%` 。这样就保证了对每行最大项目数（`P`）的控制；
*   当容器宽度较小时，`100%` 的值（或可能）会小于 `--ideal-size` ，相当于 `clamp(MIN, VAL, MAX)` 函数中的 `MAX` 值小于 `VAL` 值，`clamp()` 函数会返回 `MAX` 值，即 `100%`。这样就保证了项目（主要是网格项目）不会溢出容器；
*   当容器宽度存在一个最理想状态，即 `--ideal-size` 介于 `100 / (P + 1) + 0.1%` 和 `100%` 之间，相当于 `clamp(MIN, VAL, MAX)` 函数中的 `VAL` 在 `MIN` 和 `MAX` 之间，`clamp()` 函返回 `VAL` 值，即 `--ideal-size`。

将上面的示例稍作修改：

```CSS
 :root { 
     --ideal-size: 400px; 
     --P: 4; 
     --gap: 20px; 
     --responsive-size: clamp( 100% / (var(--P) + 1) + 0.1%, var(--ideal-size), 100% ); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/794c96c821f541729744384a54e4f9e2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEKgmo>

现在你可以很好地控制每行显示多少列了，但还没法设置不同断点范围的每行列数。主要原因是，我们无法知道断行在什么时候发生，它受制于多个因素，比如理想宽度（`--ideal-size`）、间距（`--gap`）、容器宽度等。为了控制这一点，需要对 `clamp()` 函数中的参数值做进一步改进：

```CSS
/* 改进前 */  
:root { 
    --ideal-size: 400px;
    --P: 4;
    --gap: 1rem;
    
    --responsive-size: clamp( 100% / (var(--P) + 1) + 0.1%, var(--ideal-size), 100% ); 
 } 
 
 /* 改进后 */
 :root { 
     --ideal-size: 400px;
     --P: 400px;
     --gap: 1rem;
     
     --responsive-item-size: clamp( 
         100% / (var(--P) + 1) + 0.1%,       /* MIN 值 */
         (var(--ideal-size) - 100vw) * 1000, /* VAL 值 */
         100%                                /* MAX 值 */
     ) 
}
```

简单解释一下这样做的意义：

*   当容器宽度（最大是浏览器视窗宽度，即 `100vw`）大于 `--ideal-size` 时， `var(--ideal-size) - 100vw` 会产生一个负值，会小于 `100% / (var(--P) + 1) + 0.1%`，也就确保每行保持 `--P` 个项目；
*   当容器宽度（最大是浏览器视窗宽度，即 `100vw`）小于 `--ideal-size` 时， `var(--ideal-size) - 100vw` 是一个正值，并乘以一个较大值（比如， `1000` ），它会大于 `100%`，也就确保了项目的宽度将是 `100%`。

到此为止，我们完成了 `P` 列到 `1` 列的响应。有了这个基础，要从 `P` 列到 `O` 列响应也就不是难事了。只需将 `O` 列参数引入到 `clamp()` 函数中：

```CSS
width = clamp( 100% / (P + 1) + 0.1%, (var(--ideal-size) - 100vw) * 1000, 100% / (O + 1) + 0.1%)
```

使用这个公式来替换前面的示例：

```CSS
:root { 
    --P: 4; 
    --O: 3; 
    --ideal-size: 400px; 
    --responsive-size: clamp( 
        100% / (var(--P) + 1) + 0.1%, 
        (var(--ideal-size) - 100vw) * 1000, 
        100% / (var(--O) + 1) + 0.1% );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a0e4cc1842c415b88bd97df92deb3d8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQYRJK>

正如上图所示，它始终是从 `P` 列到 `O` 列变化，即使容器再小，也会是 `O` 列，除非将 `O` 的值设置为 `1` 。

继续加码。如果期望每行列数从 `P ▶ O ▶ 1` 进行响应。要实现这样的响应，从代码上来看会比前面的复杂，需要引入浏览器视窗的断点值，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9df72bdcfd544c3f834ed3f3f0ee6675~tplv-k3u1fbpfcp-zoom-1.image)

*   大于 `W1` 断点时每行保持 `P` 个项目；
*   大于 `W2` 断点时每行保持 `O` 个项目；
*   小于 `W2` 断点时每行保持 `1` 个项目。

除了引入 `W1` 和 `W2` 两个断点之外，还需要使用 `clamp()` 嵌套 `clamp()`：

```CSS
clamp( 
    clamp( 
        100% / (P + 1) + 0.1%, 
        (W1 - 100vw) * 1000, 
        100% / (O + 1) + 0.1% 
    ), 
    (W2 - 100vw) * 1000, 
    100% 
) 
```

有了前面的基础，要理解这个就容易多了。你可以从里往外去理解，先看里面的 `clamp()`：

*   当屏幕宽度小于断点 `W1` 时，会保持每行 `O` 个项目呈现；
*   当屏幕宽度大于断点 `W1` 时，会保持每行 `P` 个项目呈现。

再看外面那个 `clamp()`：

*   当屏幕宽度小于断点 `W2` 时，会保持每行 `1` 个项目呈现；
*   当屏幕宽度大于断点 `W2` 时，将会按里面的 `clamp()` 返回值来做决定。

如果使用这个公式来构建 `P ▶ O ▶ 1` 列响应的示例，其代码看起来如下：

```CSS
 :root { 
     --gap: 20px;   /* 列间距 */
     --W1: 1024px; /* 第一个断点 W1 */ 
     --W2: 719px; /* 第二个断点 W2 */ 
     --P: 4;      /* 大于断点 W1 时，每行显示的列数 */ 
     --O: 2;      /* W2 ~ W1 断点之间，每行显示的列数*/ 
     --responsive-size: clamp( 
         clamp( 
             100% / (var(--P) + 1) + 0.1%, 
             (var(--W1) - 100vw) * 1000, 
             100% / (var(--O) + 1) + 0.1% 
         ), 
         (var(--W2) - 100vw) * 1000, 
         100% 
      );
 } 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e538bb7875f4734a446c39b7059ecf1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQbwZL>

同样的原理，要实现更多的列响应，只需要新增断点和 `clamp()` 的嵌套，比如前面我们说的 `P ▶ O ▶ N ▶ 1` 的列响应：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/391bf1c4b68246e4aaf9e34a36641b8b~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
:root {
    --gap: 20px;
    --W1: 1200px;
    --P: 4;
    --W2: 992px;
    --O: 3;
    --W3: 768px;
    --N: 2;
    --responsive-size: clamp(
        clamp(
            clamp(
                100% / (var(--P) + 1) + 0.1%,
                (var(--W1) - 100vw) * 1000,
                100% / (var(--O) + 1) + 0.1%
            ),
            (var(--W2) - 100vw) * 1000,
            100% / (var(--N) + 1) + 0.1%
        ),
        (var(--W3) - 100vw) * 1000,
        100%
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9de7c4be66b24d4694b1d945aa462b2e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXPLwL>

以此类推，就可以在不同断点下控制不同列数的呈现。

### 响应元素尺寸大小

上面的示例都是围绕着 Flex 项目和 Grid 项目尺寸，前者是响应 Flex 项目的 `flex-basis` ，后者是响应 Grid 的列网格轨道。事实上，除此之外，CSS 比较函数还可以用来调整任何元素的 `width` 或 `height` 。比如，下面这个示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2cd7491cd7d4c1ab88147031febec09~tplv-k3u1fbpfcp-zoom-1.image)

以往，我们会像下面这样编写 CSS 代码：

```CSS
.page__wrapper {
    width: 1024px;
    padding: 0 16px;
    margin: 0 auto;
}

/* 或者 */
.page__wrapper {
    width: 100%;
    max-width: 1024px;
    padding: 0 16px;
    margin: 0 auto;
}
```

这样的布局场景，我们可以直接使用 `min()` 来替代 `max-width`：

```CSS
.page__wrapper { 
    width: min(1024px, 100% - 32px); 
    padding: 0 16px; 
    margin: 0 auto; 
} 
```

这段代码的意思是，当浏览器视窗宽度大于或等于 `1024px` 时，`.page__wrapper` 宽度是 `1024px`；一旦浏览器视窗宽度小于 `1024px` 时，`.page__wrapper` 的宽度是 `100% - 32px`（这里的 `32px` 是设置了 `padding-left` 和 `padding-right` 的和）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9f0cfd6d3a94107879608e2fd793bb2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwKvKG>

我们还可以把上面示例中的 `min()` 函数换成 `clamp()` 函数，给 `.page__wrapper` 设置一个更理想的宽度：

```CSS
:root { 
    --max-viewport-size: 100vw;    /* 最大视窗尺寸，100vw 等于视窗宽度的 100% */
    --ideal-viewport-size: 1024px; /* 理想视窗尺寸 */
    --min-viewport-size: 320px;   /* 最小视窗尺寸 */ 
    --gap: 1rem; 
    --padding: 1rem; 
} 

.page__wrapper { 
    width: clamp(
        var(--min-viewport-size), 
        var(--ideal-viewport-size), 
        var(--max-viewport-size)
   ); 
   padding: 0 var(--padding); 
   margin: 0 auto; 
}
```

使用该机制，我们可以给一个元素尺寸设置上限值、下限值等。假设你正在开发一个阅读类的 Web 应用，可以使用 `clamp()` 函数给文本段落设置一个更适合阅读的理想宽度。比如，“**衬线字体的单列页面，一般认为一行** **`45 ~ 75`** **个字符的长度是比较理想的** ”。为了确保文本块不少于 `45` 个字符，也不超过 `75` 个字符，你可以使用 `clamp()` 和 `ch` 单位给文本块设置尺寸，比如给段落 `p` 设置宽度：

```CSS
p { 
    width: clamp(45ch, 100%, 75ch); 
}
```

基于该原理，如果我们把最小尺寸的值设置为 `0` 时，就可以让一个元素不可见。即，**使用** **`clamp()`** **函数可以让一个元素根据屏幕尺寸来显示****或****隐藏** （以往要实现这样的效果需要使用媒体查询或 JavaScript）：

```CSS
.toggle--visibility { 
    max-width: clamp(0px,(100vw - 500px) * 1000,100%); 
    max-height:clamp(0px,(100vw - 500px) * 1000,1000px); 
    margin:clamp(0px,(100vw - 500px) * 1000,10px); 
    overflow:hidden; 
 }
```

基于屏幕宽度（`100vw`），把元素的 `max-width`（最大宽度）和 `max-height`（最大宽度）限制在：

*   `0px` ，元素不可见；
*   `100%` ，元素可见。

注意，示例中 `max-height` 并没有设置 `100%`，而是取了一个较大的因定值 `1000px`，主要是因为`max-height` 取百分比，会致使用例失效（如果其父容器未显式设置 `height` 值，`max-height` 取百分比值会无效）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8872e259c74b49d3bfabb7c73444bc25~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQWXBj>

如上图所示，浏览器视窗宽度小于 `500px` 时，绿色盒子不可见。

利用这个原理，就可以使用 `clamp()` 函数来实现内容切换的效果。比如，让我们根据浏览器视窗的断点来对内容进行切换：

```HTML
<button> 
    Contact Us 
    <svg> </svg> 
</button>
.contact { 
    --w: 600px; 
    --c: (100vw - var(--w)); 
    padding: clamp(10px, var(--c) * -1000, 20px); 
    font-size: clamp(0px, var(--c) * 1000, 30px); 
    border-radius: clamp(10px, var(--c) * -1000, 100px); 
} 

.contact svg { 
    width: 1em; 
    height: 1em; 
    font-size: clamp(0px, var(--c) * -1000, 30px); 
 }
```

注意，示例中 `svg` 的 `width` 和 `height` 设置为 `1em` 很关键，可以让 `svg` 图标的大小相对于 `font-size` 进行计算。你可以尝试改变浏览器视窗的大小，当视窗宽度小于 `600px` 时，文本按钮会自动切换成一个图标按钮：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d8bd621701442509360c833984bea60~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJLMwX>

除此之外，还可以**根据项目是否换行，改变分隔符的方向和大小**。例如大屏幕下分隔线是条竖线，位于两项目水平方向之间：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e98acff709e4563a1cf2b77dda355b5~tplv-k3u1fbpfcp-zoom-1.image)

在小屏幕的时候，分隔线变成一条横线，位于两项目垂直方向之间：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1704a691e5b045cc9182e892edda2d59~tplv-k3u1fbpfcp-zoom-1.image)

我们使用 `flex-wrap` 和 `clamp()` 可以实现这一点。

```CSS
.container {
    --breakpoint: 640px;
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
    justify-content: center;
}

.container:before {
    content: "";
    border: 2px solid lightgrey;
    width: clamp(0px, (var(--breakpoint) - 100%) * 999, 100%);
    border-image: linear-gradient(45deg, #3f51b5, #cddc39) 2;
    border-radius: 2px;
}

.section:nth-child(1) {
    order: -1;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc49ab72b6de4d3c9b21cbc59dacba02~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQWXwy>

### 响应间距

在 CSS 中，可用来设置元素之间间距的属性主要有 `margin` 、`padding` 和 `gap` 。在这个属性上使用 CSS 比较函数 `min()` 、`max()` 和 `clamp()` 返回值，可以让元素之间和周围间距具有动态响应能力。这将帮助我们更好地设计响应式 UI。

大家是否碰到过设计师提这样的需求：“**希望在宽屏时内距大一点，窄屏时内距小一点** ”。以往要实现这样的效果，通常是使用 CSS 媒体查询在不同断点下给元素设置不同的 `padding` 值。现在，我们使用 `min()` 或 `max()` 就可以很轻易实现。比如：

```CSS
.wrapper { 
    padding-inline: max(2rem, 50vw - var(--contentWidth) / 2);
} 
```

甚至设计师还会跟你说：“**内距随着容器宽度增长和缩小，而且永远不会小于** **`1rem`** ，**也不会大于 `3rem`** ”。面对这样的需求，可以使用 `clamp()` 给元素设置 `padding` 值：

```CSS
.element { 
    padding-inline:  clamp(1rem, 3%, 3rem); 
} 
```

与媒体查询相比，这最重要的好处是，定义的 `padding` 是相对于元素的。当元素在页面上有更多的空间时，它就会变大，反之就会变小，并且这个变化始终界于 `1rem ~ 3rem` 之间。如此一来，你就可以像下面这样来定义 `padding`：

```CSS
:root { 
    --padding-sm: clamp(1rem, 3%, 1.5rem); 
    --padding-md: clamp(1.5rem, 6%, 3rem); 
    --padding-lg: clamp(3rem, 12%, 6rem); 
} 
```

这样做，除了能满足设计需求之外，对于 Web 可访问性也是有益的。[WCAG Success Criterion 1.4.10 - Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) 有过这样一段描述：

> Reflow is the term for supporting desktop zoom up to 400%. On a 1280px wide resolution at 400%, the viewport content is equivalent to 320 CSS pixels wide. The intent of a user with this setting is to trigger content to reflow into a single column for ease of reading.

这个规则定义了 Reflow（回流）的标准。Reflow 是支持桌面缩放的一个技术术语，其最高可达 `400%`。在 `1280px` 宽分辨率为 `400%` 的情况下，视口内容相当于 `320` CSS 像素宽。用户使用此设置的目的是触发内容回流到单个列中，以便于阅读。换句话说，该标准定义了对浏览器放大到 `400%` 的期望。在这一点上，屏幕的计算宽度被假定为 `320px` 左右。

结合前面的内容，我们可以像下面这样设置样式，能给用户一个较好的阅读体验：

```CSS
p { 
    width: clamp(45ch, 100%, 75ch); 
    padding-inline: clamp(1rem, 3%, 1.5rem); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df6addfd1572419d950fe6163da0c8de~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQBzOL>

上面示例中，`padding` 值采用百分比单位的话，它是相对于元素的 `width` （或 `inline-size`）计算的，这对于 `clamp()` 特别友好，可以使用百分比作为一个动态值。除此之外，还可以使用视窗单位，比如 `vw` 、 `vh`之类，它们特别适用于那些相对于视窗大小来动态调整值的场景。

同样地，你也可以将 `min()` 、`max()` 和 `clamp()` 用于 `margin` 和 `gap` ：

```CSS
:root { 
    --block-flow-sm: min(2rem, 4vh); 
    --block-flow-md: min(4rem, 8vh); 
    --block-flow-lg: min(8rem, 16vh); 
    
    --layout-gap-sm: clamp(1rem, 3vmax, 1.5rem); 
    --layout-gap-md: clamp(1.5rem, 6vmax, 3rem); 
    --layout-gap-lg: clamp(3rem, 8vmax, 4rem);
}
```

### 边框和圆角半径的响应

在一些设计方案中，有些元素的边框（`border-width`）和圆角半径（`border-radius`）很大，但希望在移动端上更小一些。比如下图这个设计：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2a9d94c066a4d51a4f95d965b211a1d~tplv-k3u1fbpfcp-zoom-1.image)

桌面端（宽屏）中卡片的圆角 `border-radius` 是 `8px`，移动端（窄屏）是 `0`。以往你可能是这样来写：

```CSS
.card { 
    border-radius: 0; 
} 

@media only screen and (min-width: 700px) { 
    .card { 
        border-radius: 8px; 
    } 
} 
```

未来你还可以使用 CSS 容器查询，像下面这样编写代码：

```CSS
.card--container { 
    container-type: inline-size; 
} 

.card { 
    border-radius: 0; 
} 

@container (width > 700px) { 
    .card { 
        border-radius: 8px; 
    } 
}
```

其实，除了使用 CSS 查询特性之外，CSS 中还有一些其他的方式来实现上图的效果。简单地说，**根据上下文环境来改变属性的值** 。

比如，使用 CSS 的 `clamp()` 函数，就是一个不错的选择：

```CSS
:root { 
    --w: 760px; 
    --max-radius: 8px; 
    --min-radius: 0px; /* 这里的单位不能省略 */ 
    --radius: (100vw - var(--w)); 
    --responsive-radius: clamp( 
        var(--min-radius), 
        var(--radius) * 1000, 
        var(--max-radius) ); 
} 

div { 
    border-radius: var(--responsive-radius, 0); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8a1ad5457ed48d3a2c0182f525f8663~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMOdro>

你也可以将 `min()` 和 `max()` 组合起来一起使用，达到 `clamp()` 相似的功能，即 `clamp(MIN, VAL, MAX)` 等同于 `max(MIN, min(VAL, MAX))` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53b5e9be87d1489bb23ade61cd9d93fb~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
.box { 
    --min-radius: 0px; 
    --max-radius: 8px; 
    --ideal-radius: 4px; 
    border-radius: max( var(--min-radius), min(var(--max-radius), (100vw - var(--ideal-radius) - 100%) * 9999) ); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bbc126a7fe8426db8b113323983cc18~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQOEdz>

你可能已经想到了，这里提到的技术也适用于其他需要动态响应的 UI 属性上，比如边框、阴影等。

### 响应背景尺寸和位置

`min()` 、`max()` 和 `clamp()` 还有一个特殊的用处，**可以对背景图片尺寸或位置做一些界限限制** 。

或许你要提供一个背景颜色和图像分层效果，与其使用 `cover`（`background-size` 的一个值），让图像填满整个容器空间，还不如为图像的增长上设置上限。

比如下面这个示例，在 `background-size` 中使用 `min()` 函数，确保背景图片不超过 `600px`，同时通过设置 `100%` 允许图像与元素一起向下响应。也就是说，它将增长到 `600px`，当元素的宽度小于 `600px` 时，它将调整自己的大小来匹配元素的宽度：

```CSS
.element { 
    background: #1f1b1c url(https://picsum.photos/800/800) no-repeat center; 
    background-size: min(600px, 100%); 
} 
```

反过来，也可以使用 `clamp()` 根据断点来设置 `background-size` 的值。比如：

```CSS
 .element { 
     --w: 760px; 
     --min-size: 600px; 
     --max-size: 100%; 
     background-size: clamp(var(--min-size), var(--w) * 1000, var(--max-size)) auto; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fff0cae6141e4076a02027f22fb2630d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEmzJBW>

再来看一个渐变的示例。我们平时可能会像下面这样，给元素添加一个渐变背景效果：

```CSS
.element { 
    background: linear-gradient(135deg, #2c3e50, #2c3e50 60%, #3498db); 
}
```

但很少有同学会留意，上面的渐变效果在不同屏幕（或不同尺寸的元素上）的效果是有一定差异的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e59bb7c87548420f8bbc1de1b228c888~tplv-k3u1fbpfcp-zoom-1.image)

如果想让渐变的效果在桌面端和移动端上看上去基本一致，一般会使用媒体查询来调整渐变颜色的位置：

```CSS
.element { 
    background: linear-gradient(135deg, #2c3e50, #2c3e50 60%, #3498db); 
}

@media only screen and (max-width: 700px) { 
    .element { 
        background: linear-gradient(135deg, #2c3e50, #2c3e50 25%, #3498db); 
    } 
}
```

现在，我们可以使用 `min()` 函数，让事情变得更简单：

```CSS
.element { 
    background: linear-gradient(135deg, #2c3e50, #2c3e50 min(20vw, 60%), #3498db); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b702fb63f4ea4d57b3107aa31733285d~tplv-k3u1fbpfcp-zoom-1.image)

另外，平时在处理图片上文字效果时，为了增强文本可阅读性，你可能会在文本和图片之间增加一层渐变效果。那么这个时候，使用 `max()` 函数控制渐变中透明颜色位置就会有意义得多：

```CSS
.element { 
    background: linear-gradient(to top, #000 0, transparent max(20%, 20vw)); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7419c8509f9346b299b2fdb77c59412f~tplv-k3u1fbpfcp-zoom-1.image)

### 流畅的排版

为了实现流畅的排版，[@Mike Riethmeuller 推广了一种技术](https://twitter.com/mikeriethmuller)。该技术使用 `calc()` 函数来设置最小字体大小、最大字体大小，并允许从最小值过渡至最大值。社区也把这种技术称为 **CSS 锁（CSS Locks）** 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1954a951e3b14eedafd04bc87a3d13bf~tplv-k3u1fbpfcp-zoom-1.image)

如果用 CSS 来描述会像下面这样：

```CSS
 /** 
 * 1. minf: 最小font-size 
 * 2. maxf: 最大font-size 
 * 3. minw: 视窗最小宽度 
 * 4. maxw: 视窗最大宽度 
 **/ 
html {
   font-size: calc([minf]px + ([maxf] - [minf]) * ( (100vw - [minw]px) / ([maxw] - [minw]) )); 
}
 
 @media only screen and (max-width: [minw]px) { 
     html {
         font-size: [minf]px; 
     }
 }
 
 @media only screen and (min-width: [maxw]px) { 
     html{
         font-size: [maxf]px; 
     }
}
```

比如：

```CSS
@media screen and (min-width: 25em){ 
    html { 
        font-size: calc( 16px + (24 - 16) * (100vw - 400px) / (800 - 400) ); 
    } 
} 

@media screen and (min-width: 25em){ 
    html { 
        font-size: calc( 16px + (24 - 16) * (100vw - 400px) / (800 - 400) ); 
    } 
} 

@media screen and (min-width: 50em){ 
    html { 
        font-size: calc( 16px + (24 - 16) * (100vw - 400px) / (800 - 400) ); 
    } 
} 
```

基于该原理，社区中也有不少开发者使用这种方式来处理移动端的适配，它有一个专业名称，即 **`vw + rem`** ：

```CSS
html {
    font-size: 16px;
}

@media screen and (min-width: 375px) {
    html {
        /* iPhone6 的 375px 尺寸作为 16px 基准，414px 正好 18px 大小, 600px 正好 20px 大小 */
        font-size: calc(16px + 2 * (100vw - 375px) / 39);
    }
}
@media screen and (min-width: 414px) {
    html {
        /* 414px-1000px 每 100 像素宽字体增加 1px(18px-22px) */
        font-size: calc(18px + 4 * (100vw - 414px) / 586);
    }
}
@media screen and (min-width: 600px) {
    html {
        /* 600px-1000px 每 100 像素宽字体增加 1px(20px-24px) */
        font-size: calc(20px + 4 * (100vw - 600px) / 400);
    }
}
@media screen and (min-width: 1000px) {
    html {
        /* 1000px 往后是每 100 像素 0.5px 增加 */
        font-size: calc(22px + 6 * (100vw - 1000px) / 1000);
    }
} 
```

CSS 的 `clamp()` 函数的出现，我们可以将上面的公式变得更简单，比如：

```CSS
html { 
    font-size: clamp(1rem, 1vw + 0.75rem, 1.5rem); 
}
```

开发者可以直接使用 [Adrian Bece 提供的在线工具 Modern Fluid Typography Editor](https://modern-fluid-typography.vercel.app/)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6787bdeb23244629a44aa7e35b1a29c6~tplv-k3u1fbpfcp-zoom-1.image)

使用 `clamp()` （或 `max()`）能让我们轻易实现文本大小随视窗宽度（或容器宽度）动态响应（进行缩放），直到达到设定的界限（最大值和最小值），从而实现流畅的排版效果。只不过，该技术对于 Web 可访问性有一定伤害性。

在 WCAG 1.4.4 调整文本大小 (`AA`) 下，利用 `max()` 或 `clamp()` 限制文本大小可能导致 WCAG 失败，因为用户可能无法将文本缩放到其原始大小的 `200%`。因此，在实际运用当中，还需要开发者根据具体的需求做出正确的选择。

使用 `clamp()` 设置动态字号（`font-size`）会涉及一些数学计算。其计算过程如下：

```CSS
1：FontSizeMax：最大视窗 viewportMax 对应的 font-size
2：FontSizeMin：最小视窗 viewportMin 对应的 font-size
3：viewportMax：最大视窗宽度
4：viewportMin：最小视窗宽度
5：Ratio：变化比例
6：MinimumSize：计算出来的最小 font-size
7：MaximumSize：计算出来的最大 font-size

Ratio = (FontSizeMax - FontSizeMin) / (viewportMax - viewportMin)
Ratio = (18px - 16px) / (1000px - 500px)
Ratio = 0.004

--------

A = FontSizeMax - viewportMax * Ratio
A = 18px - 1000px * 0.004
A = 14px = 0.875rem

--------

B = 100vw * Ratio
B = 100vw * 0.004
B = 0.4vw

--------

Result = clamp(FontSizeMin, A + B, FontSizeMax)
Result = clamp(1rem, 0.875rem + 0.4vw, 1.125rem)

--------
A + B = 0.875rem + 0.4vw
A + B = 14px + 0.4vw

MinimumSize ≈ 14px + (0.004 * 500px)
MinimumSize ≈ 14px + 2px
MinimumSize ≈ 16px

MaximumSize ≈ 14px + (0.004 * 1000px)
MaximumSize ≈ 14px + 4px
MaximumSize ≈ 18px
```

也就是说，当你最大视窗宽度是 `1000px` ，且对应的 `font-size` 是 `18px`；最小视窗宽度 `500px` ，且对应的 `font-size` 是 `16px` ，根据上面公式计算出动态的 `font-size` ：

```CSS
body {
    font-size: clamp(1rem, 0.875rem + 0.4vw, 1.125rem);
}
```

有关于这方面更深入的探讨，还可以阅读 @Adrian Bece 的《[Modern Fluid Typography Using CSS Clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)》一文，文章中详细介绍了 `clamp()` 函数实现动态 `font-size` 的原理，而且深入阐述其计算公式相关的内部原理。

### 响应定位位置

我们在构建 Web 布局时，会因视窗大小不同调整定位元素的位置。比如下面这个示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3392ce4fb2774300b4f0aeaf2c14f17f~tplv-k3u1fbpfcp-zoom-1.image)

我们使用 `clamp()` 函数就可以避免在不同断点下调整定位元素的位置了。关键代码如下：

```CSS
.hero::before {
    top: 0;
    left:clamp(-8rem, -10.909rem + 14.55vw, 0rem);
}

.hero::after {
    bottom: 0;
    right:clamp(-8rem, -10.909rem + 14.55vw, 0rem);
}
```

简单解释一下，使用 `clamp()` 设置了：

*   最小值 `-8rem`，即左侧（或右侧）最小偏移量；
*   最大值 `0rem` ，即左侧（或右侧）最大偏移量；
*   首选值 `-10.909rem + 14.55vw` 是根据 [Min-Max-Value Interpolation](https://min-max-calculator.9elements.com/) 工具计算出来的，最小视窗的值为 `320px` ，最大视窗的值为 `1200px`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75d7094cbf944068a214ca1273ae2273~tplv-k3u1fbpfcp-zoom-1.image)

> Min-Max-Value Interpolation 地址：<https://min-max-calculator.9elements.com/> （该工具有点类似于流畅排版中所介绍的动态字号设置的工具）

最终你能看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/251161f82ca849cfa6d532e97050ee77~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYemEy>

再来看一个常见的 UI 组件，即滑块组件。滑块组件中的拖动手柄通常是使用定位来完成的。拖动手柄位于最左侧时，一般会将其 `left` 的值设置为 `0` ：

```CSS
.progress__handle {
    left: 0;
}
```

但是，当手柄拖动到最右侧的时候，你需要将 `left` 重置为 `auto` ，并设置 `right` 为 `0` ：

```CSS
.progress__handle.right {
    left: auto;
    right: 0;
}
```

正如你所看到的，你需要为该状态添加新的类名。而且这样做，你给滑块组件添加一从左到右或从右到左动画效果，就会变得更难一些。如果你继续使用 `left` 来设置拖动手柄位置，那么当它（`left`）的值为 `100%` 时，手柄将会位于滑块轨道之外：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2db37a466d7f408381dba6ab935781f7~tplv-k3u1fbpfcp-zoom-1.image)

你可能想到使用 `calc()` 来避免这种现象：

```CSS
.progress__handle {
    left: calc(100% - var(--handle-width));
}
```

不过，有了 `clamp()` 函数之后，它会比 `calc()` 更灵活一些。

```CSS
.progress__handle {
    --progress-loading: 0%;
    --progress-width: 40px;
    left: clamp(0%, var(--progress-loading), var(--progress-loading) - var(--progress-width));
}
```

首先，我们设置最小值为 `0％` ，首选值是 `--progress-loading` 变量，也就是滑块当前值，最大值是当前加载量减去拖动手柄的宽度。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b047c34c6ad446c896a058da7758e6b~tplv-k3u1fbpfcp-zoom-1.image)

具体效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad5414e1ae56442b8b085532c95ce4c9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQboZX>

不仅如此，我们还可以使用相同的概念来实现不同的设计。例如下面这个进度条组件：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f65ee76157ce4ea285c6a2c5ef3c0944~tplv-k3u1fbpfcp-zoom-1.image)

当前进度值有一个小的把手在顶部。当值为 `100％` 时，我们需要宽度能够完全显示。如下图所示，圆圈必须在最右边结束。如果我们没能解决此问题，那么它的宽度会超出把手宽度的一半，比如下图中右侧进度条就没解决这个问题。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dfc4f229f8342169bb8b40ab9330faa~tplv-k3u1fbpfcp-zoom-1.image)

我们同样可以使用 `clamp()` 函数来修复它：

```CSS
:root {
    --progress-loading: 0%;
    --progress-width: 60px;
    --progress-thumb: 20px;
    --progress-height: 16px;
}

.progress {
    height: var(--progress-height);
}

.progress__handle {
    height: 100%;
    width: clamp(
        var(--progress-thumb) / 2 - 1px, 
        var(--progress-loading), 
        var(--progress-loading) - var(--progress-thumb) / 2
    );
    position: absolute;
    top: 0;
    left: 0;
}

.progress__handle::after {
    content: '';
    position: absolute;
    top: calc((var(--progress-thumb) - var(--progress-height)) / -2);
    right: calc(var(--progress-thumb) / -2);
    width: var(--progress-thumb);
    aspect-ratio: 1;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92ce4e1a6fe64b178a62c083b47e28b6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLQBrzY>

在这个示例中，我们使用 `clamp()` 调整的是进度条轨道的宽度：

```CSS
.progress__handle {
    width: clamp(
        var(--progress-thumb) / 2 - 1px, 
        var(--progress-loading), 
        var(--progress-loading) - var(--progress-thumb) / 2
    );
}
```

最小值等于圆（小把手）的宽度（`--progress-thumb`）的一半，不过示例中为了遮挡进度轨道，稍做了调整，在圆宽度一半的基础上减了 `1px` ；首选值是当前的加载百分比（`--progress-loading`），最大值是当前百分比减去圆的一半宽度得出的差值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e623227c02c740a9b6dae95231ce6b97~tplv-k3u1fbpfcp-zoom-1.image)

### 响应式 UI

[@Georgi Nikoloff 在 Codepen 上提供了一个可具缩放的 UI 界面示例](https://codepen.io/gbnikolov/full/oNZRNQR)。以一种方式对下面这样的设计稿进行了完美地缩放，并保留所有文本的行数、边距、图像尺寸等：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e85d40874804e03996b8dadafc648e1~tplv-k3u1fbpfcp-zoom-1.image)

Web 开发者对上图这样的设计应该很熟悉，特别是对常开发 PC 端产品或大屏幕的同学而言，更没有什么特殊性，也没有什么花哨的东西。

另外，上图的设计是基于 `1600px` 宽度进行设计的。在这个设计尺寸状态下，我们可以获取到设计稿中所有 UI 元素下的像素值，比如元素的宽度、高度，文本的字号等。就拿设计稿中卡片上的标题字号为例，它是 `16px`。此时，我们可以这样来理解，UI 界面在 `1600px` 时，卡片标题大小在“理想状态”（和设计稿宽度 `1600px` 容器相匹配）下，应该是 `16px`。事实上，设计稿也是这样设计的。

现在我们有了“理想”容器宽度下的字体大小，让我们使用当前“视窗宽度”来相应地调整我们的 CSS 像素值。

```CSS
/** 
* ①：设计师提供设计稿时，容器宽度（理解成页面宽度）是 1600px 
* ②：用户当前设备视窗宽度 
**/ 

:root { 
    --ideal-viewport-width: 1600;    /* ① */ 
    --current-viewport-width: 100vw; /* ② */ 
} 

.card__heading { 
    /** 
    * ①：UI 设计希望在 1600px 视窗宽度下卡片标题最理想的字体大小是 16px 
    * ②：计算实际的字体大小。计算公式 理想字体大小 x (当前视窗宽度 / 理想视窗宽度) 
    **/ 
    --ideal-font-size: 16; /* ① */ 
    font-size: calc(var(--ideal-font-size) * (var(--current-viewport-width) / var(--ideal-viewport-width))) 
} 
```

正如你所看到的，我们将以设计稿中获得的理想字体大小作为一个基数，并将其乘以当前视窗宽度和理想视窗宽度之间的比率。

```CSS
 --current-device-width: 100vw; /* 代表理想宽度（设计稿宽度）或屏幕的全宽 */  
 --ideal-viewport-width: 1600;  /* 理想宽度和当前宽度是相匹配的 */  
 --ideal-font-size: 16; 
 
 /* 相当于 */  
 font-size: calc(16 * 1600px / 1600); 
 
 /* 等同于 */ 
 font-size: calc(16 * 1px); 
 
 /* 最终结果 */  
 font-size: 16px 
```

由于我们的视窗宽度和理想宽度完全吻合，字体大小在理想视窗宽度 `1600px` 下正好是 `16px`。假设你的移动设备（比如笔记本）的视窗宽度是 `1366px`，也就是说，在笔记本上浏览这个页面（`1600px` 设计稿下对应的页面），按照上面的计算方式，那会是：

```CSS
/* 视窗宽度变成 1366px */  
font-size: calc(16 * 1366px / 1600); 

/* 等同于 */  
font-size: calc(16 * .85375px); 

/* 结果 */ 
font-size: 13.66px 
```

如果换成在 `1920px` 宽的显示器浏览时，计算就变成：

```CSS
/* 视窗宽度 1920px */  
font-size: calc(16 * 1920px / 1600); 

/* 等同于 */  
font-size: calc(16 * 1.2px); 

/* 最终结果 */  
font-size: 19.2px
```

尽管我们使用像素值作为参考，但实际上能够根据理想视窗宽度和当前视窗宽度之间的比例来调整 CSS 属性的值。

上面我们演示的是 `font-size` 下的计算方式，但在还原一个 UI 设计稿的时候，有很多元素的 CSS 属性都会用到长度单位的值，比如 `width`、`height`、`border-width`、`padding` 和 `margin` 等。那么对于这些要采用长度单位值的属性，我们都可以采用同样的方式来做计算。比如说，卡片的宽度在设计稿状态下是 `690px`，那么我们可以像 `font-size` 这样来对 `width` 进行计算：

```CSS
 :root { 
     --ideal-viewport-width: 1600; 
     --current-viewport-width: 100vw; 
 } 
 
 .card { 
     --ideal-card-width: 690; /* 卡片宽度 */ 
     width: calc(var(--ideal-card-width) * (var(--current-viewport-width) / var(--ideal-viewport-width))) 
 } 
```

当你的设备的视窗宽度刚好和理想的视窗宽度相等，即 `1600px`，那么：

```CSS
width: calc(690 * 1600px / 1600); 

/* 等同于 */  
width: calc(690 * 1px); 

/* 结果 */
width: 690px;
```

你设备视窗宽度从 `1600px` 换到 `1366px` 时（相当于 `--current-viewport-width` 的 `100vw` 就是`1366px`），那么：

```CSS
width: calc(690 * 1366px / 1600); 

/* 等同于 */  
width: calc(690 * 0.85375px); 

/* 结果 */  
width: 589.0875px; 
```

同样的，视窗宽度换到 `1920px` 时：

```CSS
width: calc(690 * 1920px / 1600); 

/* 等同于 */  
width: calc(690 * 1.2px); 

/* 结果 */  
width: 828px;
```

@Georgi Nikoloff 就是采用这种方式对各个元素做了计算，最终看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1a53bbde23849a18c2ed7cebe7e1012~tplv-k3u1fbpfcp-zoom-1.image)

按照前面的介绍，我们可以得到一个像素缩放计算的公式：

```CSS
元素像素缩放计算值 = 设计稿上元素尺寸基数 x  100vw / 设计稿视窗宽度基数 
```

*   **设计稿上元素尺寸基数**：指的是设计稿上 UI 元素尺寸的基数值，不带任何单位。比如设计稿上的某个 UI 元素的字号是 `16px`，那么代表 `font-size` 的基数值是`16`，该值也被称为理想尺寸值。
*   **`100vw`**：代表访问应用设备当前视窗的宽度。
*   **设计稿视窗宽度基数**：指的是设计稿的尺寸宽度，该宽度也被称为理想视窗宽度，比如目前移动端设计稿都是`750px` 宽度做的设计，那么这个理想视窗宽度（设计稿视窗宽度基数）就是 `750`。
*   **元素像素缩放计算值**：指的就是 UI 元素根据计算公式得到的最终计算值，它会随着设备的当前视窗宽度值做缩放。

上面这几个值中，“设计稿上元素尺寸基数”和“设计稿视窗宽度基数”是固定值，除非设计师将设计稿整体尺寸做了调整。`100vw` 大家都应该熟悉，它的单位 `vw` 是 CSS 单位中的视窗单位，会随着用户设备当前视窗宽度做变化。这也造成最终计算出来的值（元素像素缩放计算值）也是一个动态值，会随用户当前设备视窗宽度做出调整。

使用上面这种方式，虽然能让 UI 元素尺寸大小根据视窗大小做出动态计算，从而实现完美的像素级缩放，但还是略有不完美之处，因为不管视窗的大小，最终都会影响到计算值，也会影响到 UI 界面的最终效果。为此，我们可以给这种方式添加一把锁，即使用 CSS 的 `clamp()` 函数控制用户的最小视窗和最大视窗的宽度。

比如说，你的最小视窗是 `320px`，最大视窗是 `3840px`，那我们可以使用 `clamp(320px, 100vw, 3840px)` 来替代 `--current-viewport-width`（即 `100vw`）。这就意味着，如果我们在视窗宽度为 `5000px` 的设备上浏览 Web 应用或页面时，整个页面的布局（UI元素的尺寸大小）将被锁定在 `3840px`。如果我们把 `clamp()` 放到计算公式中，像下面这样来做计算：

```CSS
:root { 
    /* 理想视窗宽度，就是设计稿宽度 */ 
    --ideal-viewport-width: 1600; 
    
    /* 当前视窗宽度 100vw */ 
    --current-viewport-width: 100vw; 
    
    /* 最小视窗宽度 */ 
    --min-viewport-wdith: 320px; 
    
    /* 最大视窗宽度 */ 
    --max-viewport-width: 3840px; 
    
    /** 
    * clamp() 接受三个参数值，MIN、VAL 和 MAX，即 clamp(MIN, VAL, MAX) 
    * MIN：最小值，对应的是最小视窗宽度，即 --min-viewport-width 
    * VAL：首选值，对应的是100vw，即 --current-viewport-width 
    * MAX：最大值，对应的是最大视窗宽度，即 --max-viewport-width 
    **/ 
    --clamped-viewport-width: clamp( var(--min-viewport-width), var(--current-viewport-width), var(--max-viewport-width) ) 
 } 
 
 .card__heading { 
     /* 理想元素尺寸基数 */ 
     --ideal-font-size: 16; 
     
     /* 1600px 设计稿中卡片标题的字号，理想字号 */ 
     font-size: calc( var(--ideal-font-size) * var(--clamped-viewport-width) / var(--ideal-viewport-width) ) 
 } 
 
 .card { 
     /* 理想元素尺寸基数 */ 
     --ideal-card-width: 690; 
     
     /* 1600px 设计稿中卡片宽度，理想宽度 */ 
     width: calc( var(--ideal-card-width) * var(--clamped-viewport-width) / var(--ideal-viewport-width) ) 
} 
```

如果每个元素上涉及长度单位的属性都要像下面这样写的话：

```CSS
 :root { 
     --ideal-viewport-width: 1600; 
     --current-viewport-width: 100vw; 
     --min-viewport-width: 320px; 
     --max-viewport-width: 1920px; 
     --clamped-viewport-width: clamp( var(--min-viewport-width), var(--current-viewport-width), var(--max-viewport-width) ) 
} 

.card { 
    font-size: calc( 14 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    width: calc( 500 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    border: calc( 2 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ) solid rgb(0 0 0 / .8); 
    box-shadow: calc(2 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) calc(2 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) calc(6 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) calc(10 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) rgb(0 0 0 / .5) 
} 
```

除了写起来痛苦之外，维护起来也非常蛋疼。不过，我们可以借助 CSS 处理器让事情变得更简单一些。比如说，可以使用 SCSS 的函数特性，编写一个具有像素缩放值的函数：

```CSS
/** 
* @param {Number} $value - 理想尺寸基数，不带任何单位，设计稿对应的元素尺寸值，eg 设计稿元素宽度是500，$value = 500 
* @param {Number} $idealViewportWidth - 理想视窗宽度基数，不带单位，设计稿的宽度 
* @param {String} $min - 最小视窗宽度 * @param {String} $max - 最大视窗宽度 
**/ 

@function scalePixelValue($value, $idealViewportWidth: 1600, $min: 320px, $max: 3480px) { 
    @return calc( #{$value} * (clamp(#{$min}, 100vw, #{$max}) / #{$idealViewportWidth})) 
}
```

有了这个函数之后，我们可以像下面这样使用：

```CSS
.card { 
    font-size: #{scalePixelValue(14)}; 
    width: #{scalePixelValue(500)}; 
    border: #{scalePixelValue(2)} solid rgb(0 0 0 / .8); 
    box-shadow: #{scalePixelValue(2)} #{scalePixelValue(2)} #{scalePixelValue(6)} #{scalePixelValue(10)} rgb(0 0 0 / .5) 
}
```

编译出来的代码如下：

```CSS
 .card { 
     font-size: calc( 14 * (clamp(320px, 100vw, 3480px) / 1600) ); 
     width: calc( 500 * (clamp(320px, 100vw, 3480px) / 1600) ); 
     border: calc( 2 * (clamp(320px, 100vw, 3480px) / 1600) ) solid rgba(0, 0, 0, 0.8); 
     box-shadow: calc( 2 * (clamp(320px, 100vw, 3480px) / 1600) ) calc( 2 * (clamp(320px, 100vw, 3480px) / 1600) ) calc( 6 * (clamp(320px, 100vw, 3480px) / 1600) ) calc( 10 * (clamp(320px, 100vw, 3480px) / 1600) ) rgba(0, 0, 0, 0.5); 
} 
```

还可以像下面这样使用 `scalePixelValue()` 函数，传你自己想要的值：

```CSS
.card { 
    font-size: #{scalePixelValue(14, 1600, 320px, 1920px)}; 
    width: #{scalePixelValue(500, 1600, 320px, 1920px)}; 
    border: #{scalePixelValue(2, 1600, 320px, 1920px)} solid rgb(0 0 0 / .8); 
    box-shadow: #{scalePixelValue(2, 1600, 320px, 1920px)} #{scalePixelValue(2, 1600, 320px, 1920px)} #{scalePixelValue(6, 1600, 320px, 1920px)} #{scalePixelValue(10, 1600, 320px, 1920px)} rgb(0 0 0 / .5); 
}
```

编译出来的代码：

```CSS
.card { 
    font-size: calc( 14 * (clamp(320px, 100vw, 1920px) / 1600) ); 
    width: calc( 500 * (clamp(320px, 100vw, 1920px) / 1600) ); 
    border: calc( 2 * (clamp(320px, 100vw, 1920px) / 1600) ) solid rgba(0, 0, 0, 0.8); 
    box-shadow: calc( 2 * (clamp(320px, 100vw, 1920px) / 1600) ) calc( 2 * (clamp(320px, 100vw, 1920px) / 1600) ) calc( 6 * (clamp(320px, 100vw, 1920px) / 1600) ) calc( 10 * (clamp(320px, 100vw, 1920px) / 1600) ) rgba(0, 0, 0, 0.5); 
} 
```

除了上面这样编写一个 SCSS 的函数之外，你还可以编写其他 CSS 处理器的函数。如果熟悉 PostCSS 插件开发的话，还可以编写一个 PostCSS 插件。

我们使用同样的方式来构建下图效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dc9b4db2672445e848a98088db61679~tplv-k3u1fbpfcp-zoom-1.image)

关键代码如下：

```CSS
:root { 
    --ideal-viewport-width: 750; 
    --current-viewport-width: 100vw; 
    --min-viewport-width: 320px; 
    --max-viewport-width: 1440px; 
    --clamped-viewport-width: clamp( 
        var(--min-viewport-width), 
        var(--current-viewport-width), 
        var(--max-viewport-width)); 
} 

body { 
    padding: calc( 20 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.tab__content { 
    border-radius: calc( 36 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    padding: calc( 22 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    width: calc( 702 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card { 
    box-shadow: 0 calc(4 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) calc(4 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) 0 #ff5400, inset 0 calc(-2 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) 0 0 rgba(255, 255, 255, 0.51), inset 0 calc(-7 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) calc(6 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) calc(3 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) #ffcca4; 
    border-radius: calc( 38 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    padding: calc( 24 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__media { 
    width: calc( 170 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    height: calc( 170 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    border-radius: calc( 24 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    margin-right: calc( 20 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__media img { 
    border-radius: calc( 24 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__heading { 
    font-size: calc( 30 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    margin-bottom: calc( 6 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__body { 
    font-size: calc( 24 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

button { 
    min-width: calc( 210 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    min-height: calc( 62 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    padding: 0 calc(20 * var(--clamped-viewport-width) / var(--ideal-viewport-width)); 
    font-size: calc( 26 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__price { 
    font-size: calc( 22 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__price--current { 
    font-size: calc( 24 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__price--current span { 
    margin-right: calc( -4 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__price--current strong { 
    font-size: calc( 46 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__price--orgion { 
    margin-left: calc( 8 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 

.card__price--orgion::after { 
    height: calc(2 * var(--clamped-viewport-width) / var(--ideal-viewport-width)); 
} 

.card__badge { 
    font-size: calc( 24 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    border-radius: calc( 36 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ) 0 calc(36 * var(--clamped-viewport-width) / var(--ideal-viewport-width)) 0; 
    max-width: calc( 146 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
    min-height: calc( 42 * var(--clamped-viewport-width) / var(--ideal-viewport-width) ); 
} 
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24f3e73c02ec47d58d8e59cc5976ab25~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOYvOo>

我们再来验证一下，上面示例在真机上的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b489899b54064b9cb240bd2a77709653~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

也就是说，我们在构建 UI 界面时，特别是构建一个响应式 UI 界面时，我们应该将前面所介绍的内容结合在一起。因为我们知道了，在现代 Web 开发中，使用 `min()`、`max()` 、`calc()` 、`clamp()` 以及 CSS 的相对单位（比如，`rem`、`em`、`%`、`vw`、`vh` 等），尤其是 `clamp()` ，CSS 属性的值随着断点变化来动态响应。

如果不想把事情复杂化，我们可以简单地理解，使用 CSS 的一些现代技术，比如 CSS的自定义属性，CSS 的计算函数，CSS 相对单位等，让 CSS 相关的 UI 属性的值具备动态响应能力：

*   容器大小，`width`、`height`、`inline-size`、`block-size` 等；
*   边框大小，`border-width`；
*   阴影大小，`box-shadow`、`text-shadow` 等；
*   排版属性，`font-size`，`line-height` 等。

我们把这些放在一起，就可以实现一个完美缩放（或者说一致、流畅地缩放）的 UI 界面。

简单地说：**一致、流畅地缩放字体和间距，就是我们构建响应式 UI 的终极目标**。
