近几年中，CSS 为 Web 开发者提供了很多优秀且强大的选择器，可以很好地帮助 Web 开发者快速选中目标元素。有些新选择器还可以允许你在开发的过程中减少对类名和 JavaScript 的依赖，比如， `:has()` 和 `:not()` 选择器。

只不过，CSS 中依然缺失很多强大的选择器，比如通过选择器来选择一个范围内的元素。庆幸的是，CSS 的 `:has()` 和 `:not()` 选择器组合在一起，可以构建出更多强大的选择器，比如 **`:nth-child(An+B [of S]?)`** 。在这节课中，我们将一起来探讨 `:has()` 与 `:not()` 组合在一起可以做哪些事情？又有哪些差异和需要注意的细节？

## :has() 和 :not() 是什么？

CSS 的 `:has()` 和 `:not()` 选择器都被称为**函数伪类**，其中 `:has()` 被称为是一个**关系选择器**。它可以基于包含特定后代来匹配祖先元素，但它也可以基于后续的内容匹配前置元素等。比如：

```CSS
figure:has(> figcaption) {
    /* 选中含有子元素 figcaption 的 figure */
}
```

代码中的选择器，将会选中含有子元素 `figcaption` 的 `figure` 元素，并且样式规则会运用于 `figure` 。

> 有关于 `:has()` 是什么以及相关详细介绍，请移步阅读《[CSS 的父选择器：`:has()` ](https://juejin.cn/book/7223230325122400288/section/7224404685615005728)》!

而 `:not()` 被称为是一个**否定伪类选择器**，它可以用来作为条件判断，类似 JavaScript 中的非。其主要作用就是防止特定的元素被选中，因此它也被称为**反选伪类**。比如：

```CSS
/* 选择 body 后代元素中不是段落 p 的元素 */
body :not(p) { 
    color: #000; 
}

/* 选择没有 .fancy 类名的段落 p 元素 */
p:not(.fancy) { 
    color: orange; 
}

/* 选择 body 后代元素中不是 p 或 span 元素 */
body :not(p):not(span) { 
    color: red 
}

/* 选择 body 后代元素中不是 p 或 span 元素 */
body :not(p, span) { 
    color: yellow;
}
```

## :has() 和 :not() 可以做什么？

我们在小册第二节课《[CSS 选择器 :has() 能解决什么问题？](https://juejin.cn/book/7223230325122400288/section/7224404685799555111)》中花了很大的篇幅阐述了 `:has()` 选择器可以做什么。因此，这节课我们来看看 `:not()` 选择器可以做什么？

我们平时开发项目的时候，时常会碰到列表这样的效果，列表项之间有一个 `margin-bottom`，而往往想在最后一项中不需要设置 `margin-bottom`。比如下图这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17931ac621ad4c4e92134cd808928801~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，如果我们每一个 `.card` 都指定一个 `margin-bottom` 值，就会出现上图中左侧所呈现的效果，无法达到 Web 设计师预期的效果。这个时候，我们使用 `:not()` 伪类选择器就可以很好地避免这个现象：

```CSS
.cards {
    padding: 20px;
}

.card:not(:first-child){
    margin-top: 20px;
}

/* 或者 */
.card:not(:last-child) {
    margin-bottom: 20px;
}
```

上面代码意思很简单：

*   `.card:not(:first-child)` 表示除了第一个 `.card` 之外的所有 `.card` 都指定 `margin-top` 的值为 `20px`；
*   `.card:not(:last-child)` 则表示除了最后一个 `.card` 之外的所有 `.card` 都指定 `margin-bottom` 的值为 `20px`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f1cebd66f5a4dd2aa744e2039bb2756~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxeKrB>

现在，`:not()` 伪类在 CSS 中支持复杂选择器。

> 复杂选择器是由组合符分隔的一个或多个复合选择器的序列。

在 `:not()` 伪类中支持复杂选择器的有趣之处在于，现在可以使用通用选择器（`*`）选择不是其他元素的子级或后代元素。比如下面这个示例：

```HTML
<img src="./logos.png"alt="A Twitter, RSS and Twitch logo" width="508" height="201">

<picture>
    <source srcset="./logos.webp"type="image/webp">
    <img src="./logos.png"alt="A Twitter, RSS and Twitch logo" width="508" height="201">
</picture>
```

如今，你可以使用 `:not()` 选择器选择所 `img` 元素，但它不是 `picture` 元素的子元素：

```CSS
img:not(picture *) {
    border: 3px solid red;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e262c8990fe14727bc1115f8af12524b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOeBKdj>

就此例而言，我们也可以使用简单的 `:not()` 选择器达到相同的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02c3d39c2fd6498f9223e8ce1842f9c2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdzWKoK>

上面示例告诉我们，CSS 的 `:not()` 选择器的使用并不复杂，但你在使用它的时候，有几点还需要注意：

*   可以使用 `:not()` 选择器编写一个完全无用的选择器。例如，`:not(*)` 匹配任何不是元素的元素，这显然是荒谬的，所以这个附加的规则将永远不被应用。
*   可以利用 `:not()` 选择器提高选择器的权重。例如，`#foo:not(#bar)` 和 `#foo` 都将匹配相同的元素，但是具有两个 `id` 的选择器的权重要更高（`#foo:not(#bar)` 的权重是 `(3, 0,1)` ，`#foo` 的权重是 `(1,0，0)`）。
*   `:not()` 伪类的优先级将由其逗号分割的参数中优先级最高的选择器指定；提供与 `:not(:is(argument))` 相同的优先级。
*   `:not(.foo)` 将匹配任何非 `.foo` 的元素，包括 `<html>` 和 `<body>`。
*   `:not()` 选择器将匹配任意“不是一个 X”的元素。当与后代选择器一起使用，这可能令人惊讶，因为有多种路径可以选择一个目标元素。例如，`body :not(table) a` 仍将应用 `<table>` 中的 `a` 元素，因为 `<tr>`、`<tbody>`、`<th>`、`<td>`、`<caption>` 等都可以匹配选择器 `:not(table)` 部分。
*   你可以同时否定多个选择器。例如：`:not(.foo, .bar)` 等同于 `:not(.foo):not(.bar)`。
*   `:not()` 选择器和 `:has()` 选择器一样，都被视为严格型选择器。如果传递给 `:not()` 伪类的选择器无效或者浏览器不支持，则整个规则都将是无效的。克服这种行为的有效方式是使用：`:is()` 或 `:where()` 伪类，它们接受一个可容错选择器列表。例如 `:not(.foo, :invalid-pseudo-class)` 将使整个规则无效，但是 `:is(:not(.foo), :not(:invalid-pseudo-class))` 或 `:where(:not(.foo), :not(:invalid-pseudo-class))` 将匹配任何不是 `.foo` 的元素。

## 可以将 :has() 和 :not() 组合在一起使用

我们在实际使用的时候，可以将 `:has()` 和 `:not()` 两个选择器组合在一起。比如：

```CSS
a:not(:has(> svg)) {
    color: red;
}
```

`a:not(:has > svg)` 选择器将会选择所有 `<a>` 元素，但是它们不能直接包含 `<svg>` 元素，即 `<a>` 元素中不能直接有子元素 `<svg>` ，但可以有后代的 `<svg>` 元素。因为 `:has()` 选择器指定了要包含一个子元素 `<svg>` ，而不是更深层的后代元素：

```HTML
<!-- 相匹配的 HTML 结构 -->
<a href="">CSS Selector</a>

<a href="">
    CSS Selector
    <span><svg></svg></span>
</a>

<!-- 不相匹配的 HTML 结构 -->
<a href="">CSS Selector <svg></svg></a>
```

你也可以在 `:has()` 中包含 `:not()` ，比如：

```CSS
article:has(img:not([alt])) {
    color: red;
}
```

`article:has(img:not([alt]))` 选择器会选中所有包含 `<img>` ，且这个 `<img>` 元素没有 `alt` 属性的 `article` 元素。具体来说，`:has()` 选择器指定了 `article` 元素必须包含一个满足条件的子元素或后代元素，即 `img:not([alt])` ，也就是含有 `<img>` 元素，且没有 `alt` 属性。如果条件满足，那么这个 `article` 元素就被选中。

```HTML
<!-- 相匹配的 HTML 结构 -->
<article>
    Article Element
    <img src="article.jpg" /> <!-- img 是 article 的子元素，且没有设置 alt 属性 -->
</article>

<article>
    Article Element
    <figure>
        <img src="figure.jpg" /> <!-- img 是 article 的后代元素，且没有设置 alt 属性 -->
    </figure>
</article>

<!-- 不相匹配的 HTML 结构 -->
<article>
    Article Element
    <img src="article.jpg" alt="article element" /><!-- img 是 article 的子元素，但设置了 alt 属性 -->
</article>

<article>
    Article Element
    <figure>
        <img src="figure.jpg" alt><!-- img 是 article 的后代元素，但设置了 alt 属性 -->
    </figure>
</article>
```

它们的结合看上去没什么，但对于初学者而言，有的时候总是易于混淆，尤其是 `:has(:not())` 与 `:not(:has())` 之间的差异。让我通过一个示例来展示它们之间的差异。假设我们有两张卡片，每张卡片都有一个标题和一些描述文本，但其中一张卡片没有缩略图。它们对应的 HTML 结构如下：

```HTML
<!-- 包含缩略图的卡片 -->
<div class="card">
    <figure>
        <img src="card-thumbnail.jpg" alt="Card Thumbnail" />
    </figure>
    <h3>Card Title</h3>
    <p>Card Description</p>
</div>

<!-- 不包含缩略图的卡片 -->
<div class="card">
    <h3>Card Title</h3>
    <p>Card Description</p>
</div>
```

现在，我们想要为没有包含图片的卡片设置一个内距（`padding`）：

```CSS
.card:has(:not(img)) {
    padding: 1rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71fca66724484b95b9f0c466c264b6e9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYVxzJO>

正如你所看到的，两张卡片都设置了 `padding: 1rem` ，无论卡片是否包含了缩略图 `img` 。这是因为 `.card:has(:not(img))` 的意思是“**选择一个包含任何非** **`img`** **元素的** **`.card`**”。这意味着该选择器仅在卡片仅包含 `img` 时不适用。

说实话，最开始也令我感到意外，我原本对 `.card:has(:not(img))` 理解是，不包含 `img` 元素的 `.card` 元素，但事实上却事与愿违。

如果我们把 `:has()` 和 `:not()` 选择器的嵌套关系对换一下，例如：

```CSS
.card:not(:has(img)) {
    padding: 1rem;
}
```

浏览器得出的结果正是我们所期望的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/890e3e2760d34fb1b507d2a902b4d6b7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/jOeBvzY>

`.card:not(:has(img))` 的意思是“选择一个不包含 `img` 的 `.card`”，这正是我们在这种情况下想要的。

也就是说，`:has(:not(img))` 与 `:not(:has(img))` 的差异在于它们选择元素的方式。

*   `:has(:not(img))` 的意思是“选择包含任何非 `img` 元素的元素”。因此，它会选择包含任何非 `img` 元素的父元素（在这种情况下，是 `.card` 元素）。
*   `:not(:has(img))` 的意思是“选择不包含 `img` 元素的任何元素”。因此，它会选择不包含 `img` 元素的 `.card` 元素。

因此，两个选择器选择的元素是不同的。`:has(:not(img))` 选择的是包含非 `img` 元素的 `.card` 元素，而 `:not(:has(img))` 选择的是不包含 `img` 元素的 `.card` 元素。

这有点绕口或更易于引起对它们的混淆。但就此示例而言，我们可以使用更简单的选择器，比如选中不带图片（`img`）的 `.card` ，我们可以使用 `.card:not(:has(img))` ；反之，如果选择带有 `img` 的 `.card` 则可以使用 `.card:has(img)` ：

```CSS
.card:has(img) {
    outline: 3px solid red;
}

.card:not(:has(img)) {
    outline: 3px solid blue;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/013e4a13c44941419d413a0a207c2ac1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExdWedJ>

## :has() 和 :not() 构建高级选择器

`:has()` 和 `:not()` 选择器组合使用，除了能帮助你选中所需要的元素之外，还可以构建一些高级选择器。比如，选择多个范围的组、模拟 `:nth-child(An+B [of S]?)` 和选择一个具有特定类的兄弟元素的组中的最后一个元素等。

### 选择多个范围的组

在 CSS 中，我们可以使用 `:has()` 选择器和通用兄弟组合选择器（`~`）选择一个范围组的元素。例如，我们有下面这样的一个 HTML 结构：

```HTML
<ul>
    <li class="rect"></li>
    <li class="rect"></li>
    <li data-range></li>
    <li class="circle"></li>
    <li class="circle"></li>
    <li class="circle"></li>
    <li class="circle"></li>
    <li data-range></li>
    <li class="star"></li>
    <li class="star"></li>
    <li class="star"></li>
    <li class="rect"></li>
</ul>
```

为了演示，我们在其中的两个列表项中定义了一个名为 `data-range` 的属性，主要用它们来确定范围的开始和结束。我们可以使用 `:has()` 和 `~` 选择器组合在一起，选中 `data-range` 开始和结束之间所有 `li` （即所有 `.circle` 元素）：

```CSS
[data-range] ~ :has(~ [data-range])  {
    width: 100px;
    border: 2px solid #09f;
    outline: 4px solid rgb(0 0 0 / .5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f93ecd8a18949e6b3b6c4d62ea156dc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEpEMb>

而且我们可以分别使用：

*   `[data-range]:has(~ [data-range])` 给范围起始元素（第一个设置 `data-range` 的 `li` 元素）设置样式
*   `[data-range] ~ [data-range]` 给范围结束元素（第二个设置 `data-range` 的 `li` 元素）设置样式

```CSS
/* 选择一个范围的起始元素 */
[data-range]:has(~ [data-range]) {
    background-color: #987;
    outline: 2px solid red;
}

/* 选择一个范围的结束元素 */
[data-range] ~ [data-range] {
    background-color: #90f;
    outline: 2px solid orange;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f0c29bae13a49d6a5bf7d5c9e46416e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dygvQbJ>

现在，我们将推进我们之前的演示，并解决选择多个范围的问题。像上面示例一样，在列项上使用数据属性 `data-range` 在单个父元素内创建多个范围组设置可区分的起始和结束标记，并且设置起始标记的值为 `start` （即 `data-range="start"`）和结束标记的值为 `end` （即 `data-range="end"`）：

```HTML
<ul>
    <li data-range="start"></li>
    <li class="rect"></li>
    <li class="rect"></li>
    <li data-range="end"></li>
    <li data-range="start"></li>
    <li class="circle"></li>
    <li class="circle"></li>
    <li class="circle"></li>
    <li class="circle"></li>
    <li data-range="end"></li>
    <li data-range="start"></li>
    <li class="star"></li>
    <li class="star"></li>
    <li class="star"></li>
    <li data-range="end"></li>
    <li class="rect"></li>
</ul>
```

由于我们给自定义属性设置了具体的值，因此使用 CSS 属性选择器就可以很轻易地选中一个组中的起始元素和结束元素：

```CSS
/* 选择范围组中开始和结束元素 */
[data-range] {
    box-shadow: 0 0 0 6px red;
    border-radius: 2px;
}

/* 选择范围组中起始元素 */
[data-range="start"] {
    outline:3px solid yellow;
}

/* 选择范围组中结束元素 */
[data-range="end"] {
    outline: 3px solid #e90;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ea314470dd7490f9c38d78fa62564c7~tplv-k3u1fbpfcp-zoom-1.image)

让我们把范围组中的第一个和最后一个元素选出来。这里使用了排除条件 `:not([data-range])` 选择器，将自定义属性 `data-range` 没有 `start` 和 `end` 的标记排除出去：

```CSS
/* 选择范围组内的第一个元素 */
[data-range="start"] + :has(~ [data-range="end"]):not([data-range]) {
    width: 80px;
    border: 4px solid #09f;
}

/* 选择范围组内的最后一个元素 */
[data-range="start"] ~ :has(+ [data-range="end"]):not([data-range]) {
     width: 80px;
     border: 4px solid;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1a0d9d3fb344183ac51e0835e625678~tplv-k3u1fbpfcp-zoom-1.image)

最后，我们需要选择器来匹配范围内的列表项。一开始，它与我们之前为“范围内”选择器创建的相似。同样，我们添加了一个条件，即它不匹配一个本身是 `[data-range]` 元素的元素。

```CSS
/* 选择范围组内的所有元素 */
[data-range="start"] ~ :has(~ [data-range="end"]):not([data-range]) {
    width: 80px;
    border: 4px solid;
    box-shadow: 0 0 0 4px rgb(0 0 0 / .125);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4578d55ab3734443b5f5c2ac77c881a2~tplv-k3u1fbpfcp-zoom-1.image)

需要注意的是，通用兄弟组合选择器（`~`）是具有跳跃能力的。因此，上面的选择器选中的范围将会超出我们的预期范围。为了解决这个问题，我们需要添加一个更为复杂的条件选择器，即 `AND` 条件，使用 `:not()` 选择器来排除那些不在 `[data-range="end"]` 和 `[data-range="start"]` 之间的列表项。

但是，如果你还记得，我提到过通用兄弟选择器具有跳跃能力，所以目前，该选择器将会样式化超出我们预期范围的项目。下面的图片展示了在没有进一步限制如何应用规则的情况下，该规则如何工作。也就是说，单独使用这部分的选择器，将会告诉浏览器“不要选择跟随 `[data-range="end"]` 的列表项，这些列表项还有一个后续名为 `[data-range="start"]` 的兄弟元素”。

```CSS
[data-range="start"] ~ :has(~ [data-range="end"]):not([data-range]):not([data-range="end"] ~ :has(~ [data-range="start"])) {
    background-image: 
        linear-gradient(to bottom left in oklab, oklch(55% .45 350) 0%, oklch(100% .4 95) 100%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ddf5633b61e4a1c8df8e12ca8eb1842~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaqWGmX>

总体来说，这是一个相当冗长但非常强大的选择器，之前在没有 CSS 中的“向前查看”和“向后查看”能力的情况下，要想实现这个效果就必须使用 JavaScript。

上面示例展示了使用 `:has()` 和 `:not()` 选择器实现多范围组的选择，但还是需要依赖于手动在 HTML 中添加“钩子”（`data-range="start"` 和 `data-range="end"`）。如果我们换成有一个包含复选框的字段集，则可以再次使用 `:checked` 状态选择器来自动地、清晰地标识已选和未选项之间的边界。它们的结合可以允许你基于状态的动态样式变化，创建视觉边界变得更加容易。比如下面这个示例，当复选框被选中时，所选中的复选框将会变成一个范围组，会有一个边框和背景的视觉效果。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3654c398389454bacd0cf84d98928b1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxRjOo>

实现上图的效果，你需要一个 HTML 结构：

```HTML
<div class="card">
    <header>
        <h3>请选择你喜欢的语言 </h3>
    </header>
    <div class="card__content">
        <label for="css"><input type="checkbox" name="css" id="css" />CSS</label>
        <label for="html"><input type="checkbox" name="html" id="html" checked />HTML</label>
        <label for="js"><input type="checkbox" name="js" id="js" />JavaScript</label>
        <label for="vue"><input type="checkbox" name="vue" id="vue" checked />Vue</label>
        <label for="react"><input type="checkbox" name="react" id="react" />React</label>
        <label for="php"><input type="checkbox" name="php" id="php" />PHP</label>
        <label for="java"><input type="checkbox" name="java" id="java" />Java</label>
        <label for="python"><input type="checkbox" name="python" id="python" />Python</label>
    </div>
</div>
```

关键 CSS 代码：

```CSS
/* 自定义复选框 UI 样式 */
input[type="checkbox"] {
    height: 1px;
    overflow: hidden;
    width: 1px;
    position: absolute;
    clip-path: inset(50%);
}

label {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em;
    border: 1px solid transparent;
    border-radius: var(--radius-tl, 0) var(--radius-tr, 0) var(--radius-br, 0) var(--radius-bl, 0);
}

label::before {
    content: "";
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #c5c5c5;
    background: #fff;
    color: #c5c5c5;
    width: 24px;
    aspect-ratio: 1;
    transition: all 0.2s ease;
}

label:has(:checked) {
    color: #9739e8;
}

label:has(:checked)::before {
    content: "✔";
    border-color: #9739e8;
    background-color: #9739e8;
    color: #fff;
    font-size: 0.75em;
}

/* 有状态的多范围选择组 */

/* 范围组内的第一个选中项或单个选中项的顶部样式 */
label:has(:checked):not(label:has(:checked) + label) {
    --radius-tl: 0.75em;
    --radius-tr: 0.75em;
    border-block-start-color: black;
}

/* 范围组内最后一次选中的项或单个选中项的底部样式 */
label:has(:checked):not(label:has(+ label :checked)) {
    --radius-bl: 0.75em;
    --radius-br: 0.75em;
    border-block-end-color: black;
    box-shadow: 0 4px 3px -2px rgba(0, 0, 0, 0.35);
}

/* 范围组内所有项的样式 */
label:has(:checked):has(~ label :checked),
label:has(:checked):not(label:has(+ label :checked)) {
    border-inline-color: black;
    background-color: palegreen;
}
```

简单解释一下。我们需要对范围组或单个选中项目的顶部、中间和底部定义 UI 样式。

通过 `label:has(:checked):not(label:has(:checked) + label)` 选择器来选中范围组的第一个项目或单个项目，然后给其顶部设置样式，即添加圆角和顶部边框：

```CSS
/* 范围组内的第一个选中项或单个选中项的顶部样式 */
label:has(:checked):not(label:has(:checked) + label) {
    --radius-tl: 0.75em;
    --radius-tr: 0.75em;
    border-block-start-color: black;
}
```

同样的，通过 `label:has(:checked):not(label:has(+ label :checked))` 选择器来选中范围组的最后一项或单个项目，然后给其底部设置样式，也是添加圆角和底部边框：

```CSS
/* 范围组内最后一次选中的项或单个选中项的底部样式 */
label:has(:checked):not(label:has(+ label :checked)) {
    --radius-bl: 0.75em;
    --radius-br: 0.75em;
    border-block-end-color: black;
    box-shadow: 0 4px 3px -2px rgba(0, 0, 0, 0.35);
}
```

注意，其实单个选中项目也是一范围组，是最小范围组，它既是范围组中的第一个项目，也是范围组中的最后一个项目。

最后就是选中项目设置样式。其实只使用 `label:has(:checked)` 就可以选中状态为 `:checked` 的复选框（已选复选框），但我们这里是一个多范围组的演示，所以会复杂一些：

```CSS
/* 范围组内所有项的样式 */
label:has(:checked):has(~ label :checked),
label:has(:checked):not(label:has(+ label :checked)) {
    border-inline-color: black;
    background-color: palegreen;
}
```

### 模拟 :nth-child(An+B \[of S]?) 和 :nth-last-child(An+B \[of S]?) 选择器

`:nth-child(An+B [of S]?)` 和 `:nth-last-child(An+B [of S]?)` 选择器也是结构伪类选择器中的一部分。正如 [@Stefan Judis  在 Twitter 上所说，浏览器对其支持度还是有限的](https://twitter.com/stefanjudis/status/1650574371814006787)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b17acf49da004ae680f9751654a67a7d~tplv-k3u1fbpfcp-zoom-1.image)

目前可以在 Chromium 111、Safari 9 和 Firefox 113 看到该选择器的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39b5e4a138f0481f9a588f0ce134452e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJVpLQ>

不过，我在这里不想介绍 `:nth-child(An+B [of S]?)` 和 `:nth-last-child(An+B [of S]?)` 选择器如何使用。我想和大家一起来探讨，如何使用 `:has()` 和 `:not()` 模拟出它们一样的功能。

在开始之前，我们明确一个概念“元素组”，即**可以被分组在一起的相邻兄弟元素的一组**。例如下面这个列表：

```HTML
<ul>
    <li>No Class Name<li>
    
    <li class="special">Special</li>
    <li class="special">Special</li>
    <li class="special">Special</li>
    
    <li>No Class Name<li>
    
    <li class="special">Special</li>
    <li class="special">Special</li>
    
    <li>No Class Name<li>
    <li>No Class Name<li>
    
    <li class="special">Special</li>
    
    <li>No Class Name<li>
</ul>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2591973b30194f0790d6097ecffa50f1~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，列表中的第 `2`、`3` 和 `4` 个 `li` 构成一个元素组，因为它们共享同一个类名 `.special` ，所以被分组在一起。同样地，列表中的第 `6` 和 `7` 个 `li` 也是如此，它们也组成了一个元素组。甚至列表中的第 `10` 个 `li` 也是一个元素组，即使它只包含单个 `li` 元素。

接下来，将使用 `:has()` 和 `:not()` 选择器来选中我们希望选中的元素。

首先来看选中“元素组”中的第一个元素。

```CSS
.😍:not(.😍 + .😍) {
    background: #09f;
}
```

这个选择器将会选中“元素组”中的第一个元素：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5cea95f9c5a484a82b23e14f4f19af1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoymmPj>

`.😍`  选择所有具有 `.😍` 的元素。通过追加 `:not(.😍 + .😍)`，我们将排除前面有 `.😍` 的 `.😍`。

再来看第二个选择器，我们可以通过下面这个选择器来选中“元素组”中最后一个元素：

```CSS
.😍:not(:has(+ .😍)) {
    background: #f35;
}
```

它的工作原理是选择任何不直接跟在另一个 `.😍` 后面的 `.😍`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9d3e5fef4534007ba5e581626d7ba01~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOemmVv>

注意，在此示例中，`.😍:not(.😍 + .😍)` 选择器权重是 `(0, 3, 0)` ，而 `.😍:not(:has(+ .😍))` 选择器权重是 `(0, 2, 0)` ，因此，你看到第 `11` 个列表项 `li` 的背景依旧是 `#09f` 。

你可以通过 `.😍:not(.😍 + .😍)` （选中“元素组”中第一个元素）和 `.😍:not(:has(+ .😍))` （选中“元素组”中最后一个元素）相结合，来选中仅一个元素组成的“元素组”：

```CSS
.😍:not(.😍 + .😍):not(:has(+ .😍)) {
   background-color: #890aef;
}
```

这个选择器选择那些没有前置 `.😍` 和没有后置 `.😍` 兄弟的 `.😍` 元素。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31ebd97a0d924289b8fe01d5326b31e7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRYmmOM>

更为有意思的是，通过添加更多的  `.😍` 条件，可以让你不仅限于选择“元素组”中的第一个或最后一个元素，你可以像 `:nth-child(n)` 选择器一样，选择“元素组”中的第 `n` 个元素：

```CSS
/* 选择元素组中第二个元素 */
.😍:not(.😍 + .😍) + .😍 {
    background-color: #09f;
}

/* 选择元素组中第三个元素*/
.😍:not(.😍 + .😍) + .😍 + .😍 {
    background-color: #f35;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b52af6c707d425780bb53259acae06d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/QWZvvVz>

同样的，要条件中添加更多的 `+ .😍` 选择器，可以实现类似 `:last-nth-child()` 选择器，从“组元素”中后面向前数的第 `n` 个元素：

```CSS
/* 选择元素组中倒数第二个元素 */
.😍:not(:has(+ .😍 + .😍)):has(+ .😍) {
    background-color: #09f;
}

/* 选择元素组中倒数第三个元素*/
.😍:not(:has(+ .😍 + .😍 + .😍)):has(+ .😍 + .😍) {
    background-color: #f35;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40d2f0997f4d4f4093574ea9b8ce1927~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/WNajOrB>

正如你所看到的，我们可以使用 `:has()` 、`:not()` 、`~` 和 `+` 组合在一起，实现：


*   **`:first-in-ElementGroups-of-class(.😍)`** ，即选中元素组（`ElementGroups`）中第一个元素（类名为 `.`**`😍`**），对应的选择器为 `.😍:not(.😍 + .😍))` 。
*   **`:last-in-ElementGroups-of-class(.😍)`** ，即选中元素组（`ElementGroups`）中最后一个元素（类名为 `.`**`😍`**），对应的选择器为 `.😍:not(:has(+ .😍))` 。
*   **`:single-in-ElementGroups-of-class(.😍)`** ，即选中元素组（`ElementGroups`）中仅有的一个元素（类名为 `.`**`😍`**），对应的选择器为 `.😍:not(.😍 + .😍):not(:has(+ .😍))` 。
*   **`:nth-in-ElementGroups-of-class(.😍)`** ，即选中元素组（`ElementGroups`）中的第 `n` 个元素（类名为 `.`**`😍`**）。比如 `.😍:not(.😍 + .😍) + .😍` 选择元素组中第 `2` 个元素（类名为 `.`**`😍`**）；`.😍:not(.😍 + .😍) + .😍 + .😍` 选择元素组中第 `3` 个元素（类名为 `.`**`😍`**）。
*   **`:nth-last-in-island-of-class(.special)`**，即选中元素组（`ElementGroups`）中的倒数第 `n` 个元素（类名为 `.`**`😍`**）。比如 `.😍:not(:has(+ .😍 + .😍)):has(+ .😍)` 选中元素组中倒数第 `2` 个元素（类名为 `.`**`😍`**），`.😍:not(:has(+ .😍 + .😍 + .😍)):has(+ .😍 + .😍)` 选中元素组中倒数第 `3` 个元素（类名为 `.`**`😍`**）。

你可以写一个简单的小工具，自动生成相应的选择器。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19d4eae520924ccdb2b061833fc18b9e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOemweW>

基于该原理，你也可以使用 `:has()` 、`:not()` 和 `~` 组合在一起来模拟 `:nth-child(An+B [of S]?)` 和 `:nth-last-child(An+B [of S]?)`。

先从简单的着手，使用下面选择器可以模拟出 `:nth-child(2 of .🦵)` 选择器，即 **`:nth-child(B of S)`**：

```CSS
.🦵 ~ .🦵:not(.🦵 ~ .🦵 ~ .🦵) {
    background-color: #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ebc3f10b36f4b8eb63e5e954121e35e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWZvMMv>

它的工作原理是：

*   使用 `.🦵 ~ .🦵` 选择所有前面有 `1` 个 `.🦵` 的 `.🦵` ，从而有效地选择第 `2` 个、第 `3` 个、第 `4` 个、第 `n`  个 `.🦵` 兄弟元素。简单地说，会选择除了第一个 `.🦵` 之外的所有 `.🦵`
*   将该选择限制为排除任何前面有 `2` 个 `.🦵` 的 `.🦵`，从而从初始选择中排除第 `3` 个、第 `4`个、第  `n` 个 `.🦵` 兄弟元素。

也就是说，你可以通过在选择器中添加更多的 `~ .🦵` 部分，来选择第 `3` 个、第 `4` 个、第 `5` 个、第 `n` 个 `.🦵` 兄弟元素，从而实现 `:nth-child(B of S)` 选择器。

模拟 **`:nth-last-child(B of S)`**  选择器是相似的。比如，使用下面的代码可以模拟出 `:nth-last-child(3 of .🦵)` 选择器：

```CSS
.🦵:not(:has(~ .🦵 ~ .🦵 ~ .🦵)):not(.🦵:not(:has(~ .🦵 ~ .🦵))) {
    background-color: #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57e378e2d8e34a31ab15f33df5f764fe~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/QWZvMeQ>

它的工作原理是：

*   使用 `.🦵:not(:has(~ .🦵 ~ .🦵 ~ .🦵))` 选择最后 `3` 个 `.🦵`
*   使用 `.🦵:not(.🦵:not(:has(~ .🦵 ~ .🦵)))` 选择除最后 `2` 个 `.🦵` 之外的所有 `.🦵`

从两个选择中取交集就得到了 `:nth-last-child(3 of .🦵)`。

同样地，你可以构建一个简单的工具，自动生成所需要的选择器：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3126d99fe2c0493ea9a155e5d24ef08f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNqmGrN>

这样做主要是因为 `:nth-child(An+B [of S]?)` 和 `:nth-last-child(An+B [of S]?)` 选择器需要在 Chromium 111+、Safari 9+ 和 Firefox 113+ 上才能得到支持。而 `:has()` 和 `:not()` 选择器得到浏览器支持的版本要更早。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bbb1e5d1e1743709bf6ac29ea63d76b~tplv-k3u1fbpfcp-zoom-1.image)

如果你想在和 `:has()` 以及 `:not()` 选择器同浏览器版本上使用  `:nth-child(An+B [of S]?)` 和 `:nth-last-child(An+B [of S]?)` 选择器，前面的内容尤其有意义。反之，仅是使用 `:has()` 和 `:not()` 来模拟 `:nth-child(An+B [of S]?)` 和 `:nth-last-child(An+B [of S]?)` 选择器的话，意义不大。

事实上，这里仅是想通过这些实例来告诉大家 `:has()` 和 `:not()` 选择器以及 `~` 和 `+` 选择器的组合，可以构建出强大的 CSS 选择器。

## 小结

在这节课中，主要向大家介绍了 `:has()` 和 `:not()` 选择器的差异，以及它们的相互组合能构建出强大的 CSS 选择器。正如课程中示例所展示，`:has()` 、`:not()` 、`~` 和 `+` 组合在一起，可以让你选择单个或多个范围内的元素、也可以模拟出 `:nth-child(An+B [of S]?)` 和 `:nth-last-child(An+B [of S]?)` 等选择器的功能。虽然这些选择器冗余和复杂，但其功能是强大的。

另外，这些组合选择器也从侧面告诉大家 `:has(:not())` 与 `:not(:has())` 是完全不同的。我们在使用它们的组合时，尤其需要注意这一点。

最后想说的是，虽然这些复杂的选择器我们用到的时候很少，但是希望大家在使用 `:has()` 和 `:not()` 选择器时，能打破固有的思维，创造出更适合生产与使用的高级选择器。
