近年来，CSS 添加了一些全局关键词：`inherit` 、`initial` 、`unset` 和  `revert` 。理论上，它们可以应用于除 `none` 以外的任何 CSS 属性。它们在 CSS 中也被称为 **CSS 显式默认值**，其中 `inherit` 、`initial` 和 `unset` 是在级联层 Level3 （[Cascading Level 3](https://www.w3.org/TR/css-cascade-3/)）规范中定义的，而 `revert` 是在级联层 Level4 （[Cascading Level 4](https://drafts.csswg.org/css-cascade/)）中添加的。在 CSS 中，它们可以在属性的默认值或重置属性的值方面提供很多细微的控制。

今天，我们就来简单了解一下这些特殊的 CSS 关键词。同时，我们也将探讨何时使用它们的效果最好，以及它们之间存在的一些重要的区别。

## CSS 的基础知识

在我们深入探讨 `inherit` 、`initial` 、`unset` 和 `revert` 等关键词之前，我们有必要先了解一些 CSS 的基础知识，比如 CSS 属性的初始值、浏览器默认样式表、继承和非继承等。

那我们就先从 CSS 属性的初始值开始！

### CSS 属性的初始值

在 CSS 中，每一个 CSS 属性都会有一个属于自己的初始值，即由客户端（比如，浏览器）定义的值。这个值通常在 CSS 规范中为该属性定义。简单地说，你在 W3C 规范中查询任何 CSS 属性，它都会具有一个初始值。如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deedced02f1d4cabb18de1b20eb72083~tplv-k3u1fbpfcp-zoom-1.image)

即，规范中介绍属性参数时，会有一个名为 “Initial” 选项，该选项对应的值就是 CSS 属性的初始值，也就是 `initial` 对应的值。例如 `font-size` 的初始值是 `medium` ，即：

```CSS
.font-size {
    font-size: initial;
}

/* 等同于 */
.font-size {
    font-size: medium;
}
```

这是很重要的，因为在大多数情况下，我们都希望**将属性的值重置为其初始值**。

### 浏览器默认（User-Agent）样式表

在所有的 CSS 属性都设置完初始样式之后，紧接着浏览器会加载自身的样式表。该样式表与 CSS 属性的初始值没有任何关系。例如，`h1` 元素，浏览器给它设置的默认样式如下：

```CSS
/* user agent stylesheet */
h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}
```

HTML 元素是没有初始样式值的！上面所示代码中 `<h1>` 标签元素的基础样式是从“用户代理样式表”（user agent stylesheet）中获取的，而不是 CSS 属性的初始值 `initial`。

### 两种属性类型：继承和非继承

CSS 中有两组属性：

*   **继承属性组**：由默认情况下从父元素继承定义的属性组成；它们主要是排版属性（如 `font-size`、`color` 等）。[你可以点击这里查询可继承的 CSS 属性组](https://www.w3.org/TR/CSS21/propidx.html)。
*   **非继承属性组**：由其余的属性组成，它们不受父元素的定义影响（比如 `margin` 、`padding` 等）。

同样的，在 W3C 描述每个属性的时候，都有明确的描述，该属性是哪种类型的属性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc1e18ff34114f59b8677f6634790edf~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，`font-size` 属性的 “Inherited” 参数值为 “yes” 时，表示该属性是一个可继承属性；`dispaly` 和 `background-color` 属性的 “Inherited” 参数值为 “no”，表示它们是一个非可继承属性。

CSS 的可继承属性是有一种机制的。简单地说，每个 HTML 元素默认有每个 CSS 属性的定义初始值。初始值是一个不可继承的属性，如果级联无法计算元素的值，则会显示为默认值。

可以被继承的属性会向下级联，子元素将获得一个计算值，该计算值代表其父元素的值。这意味着，如果父元素的 `font-weight` 属性设置为 `bold`，所有子元素都会是粗体，除非它们的 `font-weight` 属性被设置为不同的值，或者用户代理样式表为该元素设置了一个 `font-weight` 值。

也就是说：

*   当元素的一个继承属性没有指定值时，则取父元素的同属性的计算值，只有文档根元素取该属性的概述中给定的初始值；
*   当元素的一个非继承属性没有指定值时，则取属性的初始值。

## 处理 CSS 继承的机制

在 CSS 中提供了几个属性值，可以用来处理 CSS 属性的继承。这几个属性值就是 `initial`、`inherit`、`unset` 和 `revert`。其实除了这四个属性值之外，还有一个 `all` 属性值。虽然这几个属性值主要用来帮助大家处理 CSS 属性继承的，但他们之间的使用，还是有一定的差异化。

先用一张图来阐述它们之间的差异：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/257f9fe2b0da410ea8fbad2cb2e3af29~tplv-k3u1fbpfcp-zoom-1.image)

接下来我们一看看这几个属性值的实际使用以及对应的差异化。

### initial 的作用是什么？

最容易理解的 CSS 值是 `initial`。这个值只是将 CSS 属性重置为其初始值，这个初始值在该属性的 W3C 规范中指定。但使用它时，你可能会感到困惑，因为属性的初始 CSS 值并不总是你想象的那样，它通常与浏览器的默认样式不同。

事实上，从 W3C 规范中获取的 CSS 属性初始值也较为混乱。其中有些是合理的，有些是不合理的。例如，CSS 的 `float` 的初始值是 `none` ，`background-color` 的初始值是 `transparent` ，它们是属性合理的一类。但有一些基本上是任意的。比如 CSS 的 `display` 属性，为什么初始值就是 `inline` ，而不是 `block` 呢？我也不知道当时 CSS 工作小组为什么要这样设计 `display` 属性，我们只知道 W3C 规范也给 `display` 定义了一个初始值，虽然 `inine` 有点奇怪，但 `block` 同样奇怪。

也就是说，**无论如何，`initial`** **关键字****都要****将属性恢复到规范中****定义****的初始值，无论是否合理**。

即使 W3C 对 CSS 属性的初始值定义有些混乱或者不合理，但是在一些具体场景中，将 CSS 的属性的值设置为 `initial` 是非常有益的。比如，你想删除所有特定于浏览器的样式时，使用 `initial` 值就是非常好的选择。

我们来看一个具体的示例。假设我们有一个`<p>` 元素：

```HTML
<p>👧🏼欢迎来到现代 CSS 的世界中🎫</p>
```

这个 `<p>` 元素是一个块元素，即 `display: block` 。

为了好看，咱们添加一点修饰的样式代码：

```CSS
p {
    background: #f36;
    padding: 2rem;
    font-size: clamp(2rem, 5cqw + 2.25rem, 3rem);
    color: #fff;
    text-shadow: 1px 1px .0125em rgb(0 0 0 / .5);
}
```

你在浏览器中看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b5eb2140fd547409815e9f14250de5b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYPMarJ>

如果我们希望 `p` 元素变成行内元素时，按照我们以前的处理方式，需要手动处理浏览器默认样式（User-Agent 用户代理样式），也就是显示的重置：

```CSS
p { 
    dispaly: inline; 
}
```

`block` 和 `inline` 效果对比如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8f548622edc44348e6969e50dc09808~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEXOGQ>

前面提到过 `inline` 是 `display` 的初始值（也就是默认值），而在规范中也提到过： **你在元素样式的设置中显示的设置某个属性的值为** **`initial`** **时，其实就表示设置了该属性的默认值**。 也就是说，我们可以给 `display` 设置 `initial` 关键词：

```CSS
p { 
    display: initial; 
    
    /* 等同于将 diplay 重置为 inline */
    display: inline;
} 
```

这个时候得到的效果其实和使用 `display:inline` 是一样的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93551bb3032e41c69f057f35d7b60bc2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxLmBj>

使用开发者工具查看相应的计算值，不难发现，`display` 设置为 `initial` 时，会覆盖用户代理的样式值 `block`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc573a3a3ea8448897d5b9336ce4ab23~tplv-k3u1fbpfcp-zoom-1.image)

接下来，我们再来看一个继承属性 `color` 的示例。

```HTML
<p>👧🏼欢迎来到<strong>现代 CSS </strong>的世界中🎫</p>
```

```CSS
p {
    background: #f36;
    padding: 2rem;
    font-size: clamp(2rem, 5cqw + 2.25rem, 3rem);
    color: #fff;
    text-shadow: 1px 1px .0125em rgb(0 0 0 / .5);
}

p strong {
    color: initial;
}
```

示例中的 `color` 属性是一个可继承属性，所以 `<p>` 元素的后代元素 `<strong>` 也会继承 `<p>` 元素中设置的`color: #fff` 值。如果我们显式的在 `strong` 中设置 `color` 的值为 `initial` 时，那么 `strong` 的 `color`将重置为默认值。由于我们没有设置默认的 `color` 颜色，那么这个时候，浏览器将会把一个计算值赋予成`color` 的初始值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/175bc943ac6c4cddab8efb7636eff980~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRYgmE>

### inherit 的作用是什么？

在 CSS 中，许多属性会从其父元素继承值。例如，`font-family`（字体系列）、`color`（颜色）和许多其他属性默认情况下会继承其值。这就是为什么你可以将一个 `div` 元素的文本颜色（`color`）设置为绿色，并使该 `div` 的所有子元素文本也都变为绿色。通过将 CSS 属性的值设置为 `inherit`，你告诉浏览器将该 CSS 属性的值设置为与其父元素的属性值相等。如果父元素也继承该属性的话，它将一直向上寻找，直到找到某个父元素上设置的具体值。

举个例子，如果我给一个 `div` 元素设置了 `5px` 的实线蓝色边框（即 `border: 5px solid blue`），并在该 `div` 内部放置了一个子元素（比如 `p` ），那么我们知道边框只会显示在父 `div` 上，而不会显示在子元素上。

```HTML
<div>
    <p>👧🏼欢迎来到<strong>现代 CSS </strong>的世界中🎫</p>
</div>
```

```CSS
div {
    border: 5px solid #09f;
    padding: 1rem;
}

p {
    background: #f36;
    padding: 2rem;
    font-size: clamp(2rem, 5cqw + 2.25rem, 3rem);
    color: #fff;
    text-shadow: 1px 1px .0125em rgb(0 0 0 / .5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb1cf8f3e7304cdd9f837021e9642dda~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYVRqqB>

然而，如果我在子元素 `p` 上将 `border` 属性设置为 `inherit`，那么该子元素也将具有 `5px` 的实线蓝色边框：

```CSS
p {
    border: inherit;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8a3ffda158a4dc9986e932bd330c6ba~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOYQWp>

这是一个非常有用的属性值，因为某些元素（如按钮）在浏览器样式表中有特定的 `font-family` 设置，但你很可能希望继承该 `font-family` 以与站点的其余部分保持一致。这就是为什么我几乎总是将按钮的 `font-family` 设置为 `inherit` 的原因。

```CSS
:where(button) {
    font-family: inherit;
}
```

需要记住的重要一点是，**`inherit`** **属性值使元素从其父元素继承其值，而不是从级联中继承其值**。比如上面这个示例，如果我们在 `p` 元素上未显式设置 `border` 属性的值，即使你在 `strong` 元素中显式设置 `border` 的值为 `inherit` ，它也不会继承其祖父元素 `div` 的边框样式：

```CSS
div {
    border: 5px solid #09f;
}

div strong {
    border: inherit;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ada2e7d6d9349a2a5cfa8736b101dbd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOezgVY>

这个示例说明：尽管元素自身显式的设置了 `inherit` 关键词，但是，如果其父元素没有明确指定样式，那么其最终效果将和 `revert` 的效果一致。**即继承的是其父元素的计算值，也就是浏览器默认样式（User Agent Stylesheet）**。

前面我们提到过，CSS 的属性会**可继承**和**不可继承**两种类型，对于可继承属性，它是会自动继承其父元素对应的属性值。比如 `color` 属性，默认情况之下会继承其父元素的 `color` 值。来看一个具体的例子：

```HTML
<div class="box"><strong>Color</strong>是一个可继承属性</div>
```

```CSS
.box {
    color: #fff;
}
```

理论上，你是不需要在 `<strong>` 元素上显式设置 `color` 属性的值，它的文本颜色也是 `#fff` 。虽然说，`color` 属性是可继承属性，但也并不意味着它总是会继承其父元素的 `color` 属性值。因为，有的时候它和客户端（比如，浏览器）设置的默认值也是有关系的。比如，将上面示例中的 `<strong>` 换成 `<a>` 元素，要是你没有将 `<a>` 元素的 `color` 属性值设置为 `inherit` ，即使 `color` 是可继承属性，它的颜色也不会是 `#fff` （不会继承其父元素的 `color` 属性值）。这是因为浏览器自动将 `<a>` 元素的 `color` 值设置为蓝色。

```HTML
<div class="box"><a href="">我是一个链接元素</a>，我的 color 并不会自动继承父元素的 color 值</div>
```

```CSS
.box {
    color: #fff;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29856d5d79184d9abe4389d71dcefaff~tplv-k3u1fbpfcp-zoom-1.image)

这种现象在 CSS 中很常见，比如 `mark` 标签也和 `a` 标签类似。但是，要是你在 `a` 和 `mark` 元素上显式将 `color` 属性的值设置为 `inherit` 时，结果就会不一样了：

```CSS
.box a, 
.box mark {
    color: inherit;
}
```

它会明确告诉浏览器，`a` 和 `mark` 的文本颜色 `color` 要继承其父元素 `.box` 的 `color` 值。在我们这个示例中，`a` 和 `mark` 的文本颜色都将变成白色（`#fff`）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ac412a8b0cd4fc8bda0ebfcf121fe37~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxqzmM>

无论如何，这就是 `inherit` 关键字的工作原理。在字体大小或颜色方面使用它可能偶尔是一个好主意，但其他情况下少使用。并且请记住继承和非继承属性之间的差异，稍后这将变得很重要。

### unset 的作用是什么？

`unset` 是一个有趣的属性值，因为它会执行与 `initial` 或 `inherit` 相同的操作。换句话说，`unset` 关键词可以重置可继承和不可继承的属性。

*   如果一个 CSS 属性本来就是继承的，比如 `color`、`font-family`等，那么它（`unset`）将像 `inherit` 一样执行。
*   如果一个 CSS 属性本来就是不可继承的，比如 `display`、`border`等，那么它（`unset`）将像 `initial` 一样执行。

也就是说，在任何属性上使用 `unset` 关键词将会应用其适当的重置关键词。例如：

```CSS
.box {
    max-width: unset; /* unset = initial = none */
    font-size: unset; /* unset = inherit = 父元素的 font-size 值 */
}
```

起初 `unset` 关键词似乎并不是很有用，因为你可以手动将 `inherit` 或 `initial` 作为属性的重置值，但是随着 `all` 属性出现，`unset` 就变得非常有用。就拿上面的代码为例，现在你可以直接将 `all`  设置为 `unset` 即可：

```CSS
.box {
    all: unset;
}

/* 等同于 */
.box {
    max-width: unset; /* unset = initial = none */
    font-size: unset; /* unset = inherit = 父元素的 font-size 值 */
}
```

通过使用 `all`，我们可以将元素的所有内容重置为初始值或确保它们继承，这在从头开始创建 HTML 元素的样式时非常理想。例如，如果你想从一个按钮（`<button>`）元素中删除所有浏览器特定的样式，这就非常有用了。

或者说，一个元素运用了很多属性，你希望能够确保它们全部重置，而无需逐个进行操作。例如，你正在使用一个第三方库（比如 Bootstrap）中的按钮 `.button` ，但你在某个场景下，需要重置第三方库赋予的所有样式，那么使用 `all:unset` 就非常有用。

```CSS
.btn-secondary {
    all: unset;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00969cf7f249495bbaf0229172df1d89~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoyeOgq>

不过，这几乎是 `unset` 的唯一用例。

然而，在某些情况下，将 CSS 恢复到其默认值是不够的。例如，如果我们将一个 `<div>` 元素的 `display` 属性重置为 `unset`，我们得到的初始值（`initial`）将是 `inline` 而不是 `block`。示例：

```CSS
div {
    display: unset; /* = initial = inline */
}
```

此时，`inline` 的值将应用于 `div` 元素。

事实上，客户端（比如浏览器）在渲染 HTML 元素时，对于块元素（例如，`<div>` 、`<p>` 等），`display` 属性的初始值为 `block`，但对于内联元素（例如 `<span>` 和 `<a>`），`display` 的初始值为 `inline`。如果仅是将元素的 `display` 属性被设置为 `unset`，它将最终以 `inline` 的方式渲染，这是因为初始值（`initial`）没有使用浏览器的 User-agent-stylesheet 中的默认样式。

### revert 的作用是什么？

作为一名 Web 开发者，我想你在对一个 Web 应用或页面开始编写 CSS 的时候，都会先重置客户端（如浏览器）所提供的默认样式。那么，关键词 `revert` 就显得尤其的重要，因为它允许将 CSS 属性的值重置回浏览器特定的样式。例如，一个元素的 CSS 样式已经被大量修改，你想将其中的一部分或全部样式更改回浏览器默认样式，那么可以将属性值设置为 `revert` 。

我并不经常使用这个功能，因为我更喜欢删除所有浏览器样式，但在使用 `all: unset` 后，将一些样式更改回浏览器特定的样式可能会很有用。`revert` 关键字首先确定浏览器的 User-agent-stylesheet （浏览器加载的默认 CSS 文件）是否为特定的 HTML 元素创建特殊样式。如果是，则将重置为这些默认样式。例如：

```CSS
div {
    display: revert; /* = block */
}

span {
    display: revert; /* = inline */
}

table {
    display: revert; /* = table */
}
```

如果 User-agent-stylesheet （浏览器加载的默认 CSS 文件）中没有为该元素定义样式，则 `revert` 关键字的行为将类似于 `unset` 值。如果属性属于继承组，则将其重置为 `inherit` 值；否则，将其重置为 `initial`。

也就是说，`revert` 也区分了可继承属性和不可继承属性：

*   如果一个属性通常是可继承的，`revert` 的含义就是继承
*   如果一个属性通常不可继承，`revert` 将还原为浏览器样式表中指定的值

如果你想将应用程序中的每个元素，使其回到浏览器的默认样式，则可以选择使用 `all: revert` ，即：

```CSS
* {
    all: revert;
}
```

实际上，应用程序内的每个元素都像是从头开始一样！

### revert vs. unset

`revert` 和 `unset` 非常像，唯一的区别在于 `revert` 会把 CSS 属性值重置为 User-agent-stylesheet （浏览器加载的默认 CSS 文件）中对应的值，例如：

```CSS
/* unset */
div {
    display: unset; /* = initial = inline */
}

h1 {
    font-weight: unset; /* = inherit = 其父元素的 font-weight 的值 */
    font-size: unset;   /* = inherit = 其父元素的 font-size 的值  */
}

/* revert */
div {
    display: revert; /* = block = User-agent-stylesheet */
}

h1 {
    font-weight: revert; /* = bold = User-agent-stylesheet */
    font-size: revert;   /* = 2em = User-agent-stylesheet */
}
```

总之，`unset` 和 `revert` 的主要区别在于 `revert` 考虑了用户定义和开发者编写的样式，而 `unset` 只考虑继承。因此，如果你想将属性重置为其继承（`inherit`）或初始（`initial`）值，并考虑用户定义或开发者编写的样式，请使用 `revert`。如果你只想将属性重置为其继承（`inherit`）或初始（`initial`）值，并且不需要考虑用户定义或开发者编写的样式，请使用 `unset`。

## initial  VS.  inherit  VS.  unset  VS.  revert

我们花了一些篇幅向大家阐述了 `initial` 、`inherit` 、`unset` 和 `revert` 几个关键词的作用和功能是什么以及何时使用哪个关键词。但我还是希望一个示例，向大家阐述它们之间的差异之处。比如，下面这个示例：

```HTML
<div>
    <h2>Title</h2>
</div>
```

```CSS
div {
    color: red;
    border: 5px solid green;
    margin: 10px;
    padding: 10px;
}

h2 {
   color: blue;
}
```

我们分别在 `div` 和 `h2` 元素上应用了一些简单的 CSS 样式。在浏览器中呈现的效果如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f574d3bae254578945516d80ad074fa~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJBZZwm>

其中 `color` 是可继承属性，`border` 、`margin` 和 `padding` 是不可继承属性。例如，`div` 元素各属性的具体描述如下所示：

| **属性名**            | **初始值**        | **是否可继承** | ***User Agent Style（浏览器默认样式）*** | **开发者编写样式** |
| ------------------ | -------------- | --------- | ------------------------------- | ----------- |
| **`color`**        | 取决于用户代理        | ✔         | `black`                         | `red`       |
| **`border-color`** | `currentColor` | ✘         | No                              | `green`     |
| **`border-width`** | `medium`       | ✘         | No                              | `5px`       |
| **`border-style`** | 取决于计算值         | ✘         | No                              | `solid`     |
| **`margin`**       | `0`            | ✘         | No                              | `10px`      |
| **`padding`**      | `0`            | ✘         | No                              | `10px`      |

`h2` 元素各属性具体描述如下所示：

| **属性名**            | **初始值**        | **是否可继承** | ***User Agent Style（浏览器默认样式）*** | **开发者编写样式** |
| ------------------ | -------------- | --------- | ------------------------------- | ----------- |
| **`color`**        | 取决于用户代理        | ✔         | `black`                         | `blue`      |
| **`border-color`** | `currentColor` | ✘         | No                              | No          |
| **`border-width`** | `medium`       | ✘         | No                              | No          |
| **`border-style`** | 取决于计算值         | ✘         | No                              | No          |
| **`margin`**       | `0`            | ✘         | *`0.83em  0px`*                 | No          |
| **`padding`**      | `0`            | ✘         | No                              | No          |

如果给 `h2` 元素添加下面这段代码：

```CSS
h2 {
    color: inherit;
    border: inherit;
    margin: inherit;
    padding: inherit;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b78eefe9f34ca99d7db9eae37d4258~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJLvVQ>

很明显，`h2` 元素继承了其父元素 `div` 的 `color` 、`border` 、`margin` 和 `padding` 。即：

| **属性名**            | **开发者编写样式（值）** | **计算值** | **继承值来源** |
| ------------------ | -------------- | ------- | --------- |
| **`color`**        | `inherit`      | `red`   | 父元素 `div` |
| **`border-color`** | `inherit`      | `green` |           |
| **`border-width`** | `inherit`      | `5px`   |           |
| **`border-style`** | `inherit`      | `solid` |           |
| **`margin`**       | `inherit`      | `10px`  |           |
| **`padding`**      | `inherit`      | `10px`  |           |

将上面代码中的 `inherit` 值替换为 `initial` ，即 `h2` 元素中的 `color` 、`border` 、`padding` 和 `margin` 都为初始值：

```CSS
h2 {
    color: initial;
    border: initial;
    margin: initial;
    padding: initial;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0309718295774893b860363dab5b25c7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWZrxQo>

| **属性名**            | **初始值**        | **开发者编写样式（值）** | **计算值**        | **值来源** |
| ------------------ | -------------- | -------------- | -------------- | ------- |
| **`color`**        | `CanvasText`   | `initial`      | `black`        | 初始值     |
| **`border-color`** | `currentColor` | `initial`      | `currentColor` | 初始值     |
| **`border-width`** | `medium`       | `initial`      | `5px`          | 初始值     |
| **`border-style`** | `none`         | `initial`      | `none`         | 初始值     |
| **`margin`**       | `0`            | `initial`      | `0`            | 初始值     |
| **`padding`**      | `0`            | `initial`      | `0`            | 初始值     |

继续把 `h2` 中的 `color` 、`padding` 、`margin` 和 `border` 属性的值重置为 `unset` ：

```CSS
h2 {
   color: unset;
   border: unset;
   margin: unset;
   padding: unset;
}
```

你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d46960be5c2846c9be3baa35621fe2d7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgmrgL>

前面说过了，`unset` 会根据属性是否为可继承属性来做判断。如果属性是可继承属性，那么 `unset` 相当于 `inherit`，比如 `color` ，则 `h2` 的 `color` 会继承父元素 `div` 的 `color` 值；如果属性是不可继承属性，那么 `unset` 相当于 `initial` ，比如 `border` 、`padding` 和 `margin` 都是不可继承属性，所以 `h2` 上的 `border` 、`padding` 和 `margin` 都会取它们各自的初始值 `initial` ：

| **属性名**            | **初始值**        | **是否可继承** | ***User Agent Style（浏览器默认样式）*** | **开发者编写样式** | **计算值**        | **值来源**                 |
| ------------------ | -------------- | --------- | ------------------------------- | ----------- | -------------- | ----------------------- |
| **`color`**        | `CanvasText`   | ✔         | `black`                         | `unset`     | `red`          | 继承父元素 `div` 的 `color` 值 |
| **`border-color`** | `currentColor` | ✘         | No                              | `unset`     | `currentColor` | 初始值                     |
| **`border-width`** | `medium`       | ✘         | No                              | `unset`     | `medium`       | 初始值                     |
| **`border-style`** | `none`         | ✘         | No                              | `unset`     | `none`         | 初始值                     |
| **`margin`**       | `0`            | ✘         | *`0.83em  0px`*                 | `unset`     | `0`            | 初始值                     |
| **`padding`**      | `0`            | ✘         | No                              | `unset`     | `0`            | 初始值                     |

最后再来看 `revert` 关键词，把 `h2` 中的 `color` 、`border` 、`margin` 和 `padding` 等属性的值设置为 `revert` ：

```CSS
h2 {
   color: revert;
   border: revert;
   margin: revert;
   padding: revert;
}
```

此时看到的效果如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c40af52d3dbc425b9878d9d5a51d010f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJBZwVq>

`revert` 会将属性重置为其父级自然继承的值。在我们的例子中，它从父级 `div` 继承了 `color`。如果该属性不是可继承属性，则 `revert` 会将级联值回退到先前的级别。如果存在用户代理或用户默认样式，则将属性设置为默认值。在我们的例子中，它将 `h2` 的 `margin` 设置为其用户代理默认值 `0.83em`。如果没有默认样式，则将值设置为其初始值。这适用于我们示例中的边框属性。

| **属性名**            | **初始值**        | **是否可继承** | ***User Agent Style（浏览器默认样式）*** | **开发者编写样式** | **计算值**           | **值来源**                 |
| ------------------ | -------------- | --------- | ------------------------------- | ----------- | ----------------- | ----------------------- |
| **`color`**        | `CanvasText`   | ✔         | `black`                         | `revert`    | `red`             | 继承父元素 `div` 的 `color` 值 |
| **`border-color`** | `currentColor` | ✘         | No                              | `revert`    | `currentColor`    | 初始值                     |
| **`border-width`** | `medium`       | ✘         | No                              | `revert`    | `medium`          | 初始值                     |
| **`border-style`** | `none`         | ✘         | No                              | `revert`    | `none`            | 初始值                     |
| **`margin`**       | `0`            | ✘         | *`0.83em  0px`*                 | `revert`    | `0`*`.83em  0px`* | ***浏览器默认样式***           |
| **`padding`**      | `0`            | ✘         | No                              | `revert`    | `0`               | 初始值                     |

简而言之，`initial` 将值设置为属性的定义初始值，`inherit` 将值设置为父元素的值，`unset` 将属性值恢复到继承值或初始值，`revert` 将属性重置为父级自然继承的值。

## all 的作用是什么？

有时候我需要为网站的特定组件设计样式，但我需要重用已经以不同方式进行样式化的类名。当无法使用代码拆分时，这可能导致从其他源继承某些样式，我需要为我的组件覆盖这些样式。例如，假设我们有一个使用 Materialize 进行样式化的按钮，但我需要创建一个完全不同样式的按钮：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fce6bfb864494efb80cfdd925fe5dec4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNaddvV>

```CSS
.unstyled,
.unstyled:hover {
    color: revert;
    background: revert;
    transition: initial;
    cursor: initial;
    text-decoration: revert;
    text-align: initial;
    letter-spacing: initial;
    font-size: revert;
    outline: initial;
    border: initial;
    border-radius: initial;
    display: initial;
    line-height: initial;
    padding: initial;
    text-transform: initial;
    vertical-align: initial;
    box-shadow: initial;
}
```

Materialize 的按钮有许多样式，虽然最好的方法是使用不同的类来移除它们，但可能存在这样的情况，你没有这个选项，只能选择逐行调整每个属性或使用 `all` 属性。`all` 属性将允许你一次性重置多行：

```CSS
.unstyled-all, 
.unstyled-all:hover {
    all: revert;
}
```

`all` 属性将所有属性的值重置为给定的值。它目前接受四个值：`initial`、`inherit`、`revert` 和 `unset`。这些值也可以用作任何其他 CSS 属性的值，以将其重置为特定状态，但如果你确实需要重置所有内容，可以使用 `all`。

需要再次强调的是，`all` 可能不是从元素中删除样式的最佳方法。更有效的方法是更新你的选择器，使样式不会被覆盖或使用代码拆分。我只建议在受到应用样式方式和顺序限制时使用 `all`。

另外，需要注意的是，`all` 在 CSS 中有时候是一个属性，比如这里说的就是属性，但有的时候它还是 CSS 中某些属性的值。比如我们常在 `transition` 中用到的 `all`，那这个时候就是属性值。到目前为止，CSS 中的 `all` 属性也得到了众多浏览器的支持。

## 综合案例：创建重置 CSS

现在 CSS 有了这些新的重置功能，即 `initial` 、`inherit` 、`unset` 、`revert` 和 `all` ，使得我们创建一个重置 CSS 样式比以前简单得多。

在大部分情况下，我们希望将大多数属性重置为它们的默认初始值或 CSS 的内在行为，使用 `unset` 值。但正如我们上面所看到的，我们还想保留来自客户端（User-agent-stylesheet）的样式，比如 `display` 属性。那么我们就可以这样做：

```CSS
/* 重置除了 `display` 属性之外的所有 User-Agent-Stylesheet 样式 */
* {
    all: unset;
    display: revert;
}
```

看上去很完美，但还有一些细节需要处理。

当一些特殊的 HTML 元素（例如，`<img>` 、`<video>` 、`<svg>` 、`<canvas>` 和 `<iframe>` ）的 `width` 和 `height` 属性被 `all: unset` 重置时，这些元素上的 `width` 和 `height` 属性的效果也被重置。将会造成这些元素的大小属性不再起作用。

为了解决这个问题，你可以使用一些 CSS 伪类，比如前面课程《[CSS 选择器 :has() 和 :not() 的组合](https://juejin.cn/book/7223230325122400288/section/7226251495276609569)》中提到的 `:not()` 伪类函数。即，将这些元素（比如，`img` 、`video` 、`svg` 、`canvas` 、`iframe` 等）当作 `:not()` 伪类函数的参数：

```CSS
*:not(img, video, svg, canvas, iframe):not(svg *) {
    all: unset;
    display: revert;
}
```

但是，使用 `:not()` 伪类函数会产生一个意想不到的后果，它会增加选择器权重，因此可能会覆盖项目中稍后定义的样式。例如：

```CSS
*:not(img, svg, video, iframe, canvas):not(svg *) {
    all: unset;
    display: revert;
}

body {
    width: 100vw;
    min-height: 100vh;
    font-family: "Exo", "Bungee Shade", cursive, Arial, sans-serif;
    background-color: #557;
    color: #fff;
    display: grid;
    place-content: center;
    padding: 1rem;
}

div {
    color: red;
    font-size: clamp(2rem, 3vw + 2.5rem, 3rem);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0f09d303a89471c8ee33cd4dc9bbad3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/BaqVoOB>

其中 `*:not(img, svg, video, iframe, canvas):not(svg *)` 的权重是 `(0, 0, 2)` ，而 `body` 和 `div` 的权重是 `(0, 0, 1)` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23eb50fd6959493baa3d046b624a8257~tplv-k3u1fbpfcp-zoom-1.image)

这就是 `body` 和 `div` 选择器对应的样式没有起作用的原因。如果你不希望这种现象出现，可以使用 [CSS 的 :where() 伪类选择器](https://juejin.cn/book/7223230325122400288/section/7226251495069450278)，将 `*:not(img, svg, video, firame, canvas):not(svg *)` 选择器权重除至最低，即 `(0 , 0, 0)` 。你可以像下面这样做：

```CSS
*:where(:not(img, svg, video, iframe, canvas):not(svg *)) {
    all: unset;
    display: revert;
}
```

如果你不想重置一些表单元素，则可以将其 `all` 属性设置为 `revert` 。比如 [@Elad Shechter](https://twitter.com/eladsc) 的 《[The New CSS Reset](https://elad2412.github.io/the-new-css-reset/)》就有这些关键词的使用：

```CSS
*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *)) {
    all: unset;
    display: revert;
}

a, button {
    cursor: revert;
}

textarea {
    white-space: revert;
}

meter {
    -webkit-appearance: revert;
    appearance: revert;
}

:where(pre) {
    all: revert;
}

::placeholder {
    color: unset;
}

::marker {
    content: initial;
}

:where(dialog:modal) {
    all: revert;
}
```

> 上面代码来源于：<https://elad2412.github.io/the-new-css-reset/>

当然，你也可以采用更为激进的做法，将 `all` 属性的值设置为 `initial` 。其中差别是，`initial` 使用 CSS 规范上基于每个属性定义的初始值，而 `revert` 是用户代理样式表根据 CSS 选择器设置的默认值。例如，`display` 的初始值是 `inline` （即 `initial = inline`），而普通用户代理样式表将块元素（比如 `div`）的默认 `display` 值设置为 `block` ，将 `table` 元素的 `display` 值设置为 `table` ，等等。

## 小结

在 CSS 中，有一些全局关键字（ `initial`、`inherit`、`unset` 和 `revert`）可以用于设置属性的默认值或重置属性的值。虽然它们都可以用于任何属性，但它们之间存在一些重要的区别：

*   **`initial`** 会将属性设置为其初始值，即由浏览器定义的值。这个值通常在 CSS 规范中为该属性定义。
*   **`inherit`** 将属性设置为其父元素的值。如果没有继承值，则将使用该属性的初始值。
*   **`unset`** ，如果属性可以继承，则将属性设置为其继承值（等同于 `inherit`）。否则，将使用该属性的初始值（等同于 `initial` ）。这意味着 `unset` 允许继承，并且适用于将属性重置为其默认值，同时仍然允许从父元素继承。
*   **`revert`** 与 `unset` 类似，如果属性可以继承，则将属性设置为其继承值。否则，将使用该属性的初始值。不同之处在于，`revert` 还考虑了任何用户定义的样式或作者样式表可能应用于元素。如果没有用户定义或作者样式，则 `revert` 的行为与 `unset` 相同。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31704fede0ac44fbb166182b5fdb3c7d~tplv-k3u1fbpfcp-zoom-1.image)

而 `all` 既可以是一个值，也可以是一个属性。只不过，我们这节课所探讨的 `all` 只是一个属性。或者更确切地说，是元素上所有 CSS 属性的集合。它的值可以是前面所讨论的关键字中的任何一个，并允许你将该关键字应用于所有 CSS 属性。

除此之外，在 [W3C 的 CSS Cascading and Inheritance Level 5 规范](https://www.w3.org/TR/css-cascade-5)中新增了一个 `revert-layer 关键词`。它可以让你回滚到之前的层级中指定的样式。理想情况下，`revert-layer` 关键词适用于在一个层级内部应用于属性。然而，如果将 `revert-layer` 关键词设置在一个层级外的属性上，那么该属性的值将回滚到用户代理样式表（或用户样式，如果存在）建立的默认值。因此，在这种情况下，`revert-layer` 关键词的行为类似于 `revert` 关键词。

这节课没有对 `revert-layer` 做过多阐述，我们将会在介绍 `@layer` 的时候，详细阐述该关键词的具体使用。

最后，再次强调一下，`initial` 、`inherit` 、`unset` 、`revert` 和 `all` 要是用好了的话，可以使你的代码更为简洁和灵活性更强，甚至起到事半功倍的效果。
