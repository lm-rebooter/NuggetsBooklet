[W3C 的选择器模块（Level 4）](https://drafts.csswg.org/selectors-4)为 Web 开发者新增了很多强大的 CSS 选择器，在这些选择器中，就有大家最为期待的 CSS 父选择器 `:has()` 。事实证明，`:has()` 伪类选择器不仅仅是一个“**父选择器**”，它更是一个**关系选择器**。它可以基于包含指定的后代元素来匹配祖先元素，但它也可以基于后续的内容匹配前置元素等。简单地说，这个选择器可以做更多的事情。这也是为什么关系选择器是近二十多年来最受欢迎的功能之一，在没有该选择器之前，Web 开发者为绕开这个缺失的选择器需要做很多额外的事情。在这节课中，我将告诉大家，`:has()` 选择器是什么？如何使用？

## 先从需求聊起

我们先从平时的开发需求聊起。假设你有下图这样的一个需求：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aaba438fed6b405f9d65880c6d80c460~tplv-k3u1fbpfcp-zoom-1.image)

以往，你要实现上图所示的效果，需要给它们定义不同的类名，例如：

```HTML
<!-- 上图中左侧卡片 -->
<figure class="card">
    <img src="card-thumbnail.jpg" alt="Card Thumbnail" />
</figure>

<!-- 上图中右侧卡片 -->
<figure class="card card--has-title">
    <img src="card-thumbnail.jpg" alt="Card Thumbnail" />
    <figcaption>Modern CSS:Parent Selector:has()</figcaption>
</figure>
```

```CSS
.card {
    display: flex;
    border-radius: 10px;
    max-width: 40vw;
    background-color: #F5F5F5;
}

.card img {
    display: block;
    max-width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    object-position: center;
}

.card--has-title {
    flex-direction: column;
    gap: 1rem;
    padding: 20px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08e42f3682864736a0867e95694e414d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWPjoXq>

如果有 `:has()` 选择器，你就不需要额外在 HTML 上新增类名 `.card--has-title` ，因为它可以帮助你检查 `.card` 元素是否包含了 `figcaption` 元素，即检查卡片是否带有标题。在这里，它的功能就有点类似于其他语言的 `if ... else ...` 功能：

```JavaScript
if (卡片带有标题) {
    // 卡片样式 1
} else {
    // 卡片样式 2
}
```

如果使用 CSS 代码来描述的话，我们的代码可以变成：

```CSS
/* 卡片不带标题的样式规则 */
.card {
    display: flex;
    border-radius: 10px;
    max-width: 40vw;
    background-color: #F5F5F5;
}

.card img {
    display: block;
    max-width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    object-position: center;
}

/* 卡片带标题的样式规则 */
.card:has(figcaption) {
    flex-direction: column;
    gap: 1rem;
    padding: 20px;
}
```

最终效果是等同的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a22e8407a0974fb1b99d99b5cd4f503b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNaGOPz>

当然，就此例而言，你可能会说，使用结构伪类 `:nth-child()` 或 `:nth-of-type()` 也可以达到类似 `:has()` 选择器的效果。比如：

```CSS
.card:nth-child(2) {
    flex-direction: column;
    gap: 1rem;
    padding: 20px;
}
```

这样做，只能确认只有两张卡片的情景之下，但 Web 的内容是动态输出的，如果输出的内容不仅仅是两张卡片（即两个 `.card`）而是三个以上，那么使用结构伪类就会显得很鸡肋：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8412a8a4b1f243a79c684ad747965542~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNazwrb>

当然，`:has()` 能做的事情不仅仅是这么简单的事情，它可以帮助我们做更多复杂的事情，甚至很多时候是可以用来替代 JavaScript 脚本，帮助我们做一些带有交互效果的事情。稍后在介绍实例的时候会向大家介绍到这些。

## :has() 选择器是什么？

用一句话来描述： **`:has()`** **选择器是一个关系型伪类选择器，也被称为函数型伪类选择器，它和** **`:is()`****、****`:not()`** **以及** **`:where()`** **函数型选择器被称为 CSS 的逻辑组合选择器** ！ 而 [W3C 规范是这样描述 :has() 选择器](https://drafts.csswg.org/selectors-4/#relational)：

> The relational pseudo-class, `:has()`, is a functional pseudo-class taking a `<forgiving-relative-selector-list>` as an argument. It represents an element if any of the relative selectors, when absolutized and evaluated with the element as the `:scope` elements, would match at least one element.

大致意思是： **关系型伪类** **`:has()`** **是一个函数型伪类，接受一个选择器组（****`< forgive -relative-selector-list>`****）作为参数。其给定的选择器参数（相对于该元素的 **`:scope`**）至少匹配一个元素** 。

其实，我们可以像理解 jQuery 中的 `:has()` 选择器那样来理解： `:has()` 选择器选取所有包含一个或多个元素在其内的元素，匹配指定的选择器”。 即，`:has()` 选择器接受一个相对的选择器列表，如果至少有一个其他元素与列表中的选择器相匹配，那么它将代表一个元素。

> 注意，在规范中并没有父选择器一描述，社区中把 `:has()` 描述为“父选择器”是因为这样更形象，也易于理解。

你可能会觉得上面的描述太过于晦涩，不易于理解。那么，我们就先从其他选择器着手来介绍 `:has()` ？下图是 @nana 提供的 CSS 中常见的选择器列表：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15e1a772909640689e9a929ef480795c~tplv-k3u1fbpfcp-zoom-1.image)

> 图片来源：<https://medium.com/design-code-repository/css-selectors-cheatsheet-details-9593bc204e3f>

其中有很多类型的选择器是和 DOM 结构有关的，比如我们熟悉的子选择器（`a > b`）、后代选择器（`a b`） 、 相邻兄弟选择器（`a + b`）、通用兄弟选择器（`a ~ b`） 、结构伪类选择器（比如 `:nth-child()`、`:nth-of-type()`等） ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ec17450032348c0bd87d373a52726e0~tplv-k3u1fbpfcp-zoom-1.image)

> URL 地址：<https://frontend30.com/css-selectors-cheatsheet/> （Demo 地址：<https://codepen.io/nanacodesign/full/aXQgoj）by> @nana

事实上，`:has()` 选择器也是非常类似的，它与 HTML 的 DOM 关系紧密相连，这也是它被称之为是关系型选择器的主要原因。比如下面这个示例，你正在寻找后代元素的存在，但应用的样式将是父元素。

```HTML
<!-- Case ① -->
<figure> 
    <figcaption>CSS Pseudo-Class Specification</figcaption> 
    <img src="https://picsum.photos/1240/?random=11" alt=""> 
</figure> 

<!-- Case ② -->
<figure> 
    <div class="media"> 
        <img src="https://picsum.photos/1240/?random=12" alt=""> 
    </div> 
    <figcaption>CSS Pseudo-Class Specification</figcaption> 
</figure> 

<!-- Case ③ -->
<figure> 
    <img src="https://picsum.photos/1240/?random=13" alt=""> 
    <figcaption>CSS Pseudo-Class Specification</figcaption> 
</figure>
```

这三个 Case 对应的 DOM 树如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e14af537bd234a63a67b11a19a615541~tplv-k3u1fbpfcp-zoom-1.image)

添加下面这样一段 CSS 代码：

```CSS
/* 匹配包含<figcaption>后代元素的<figure>元素 */ 
figure:has(figcaption) { 
    background-color: #3f51b5; 
} 
```

`figure:has(figcaption)` 将能匹配所有 `figure` ，因为 `figure` 都包含了 `figcaption` 元素：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b452415ccd364c879871d4cf8575f1c1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOeMapz>

在此基础上新增 CSS 规则：

```JavaScript
/* 匹配包含 <figcaption> 后代元素的 <figure> 元素，可以匹配所有 Case */ 
figure:has(figcaption) { 
    background-color: #3f51b5; 
} 

/* 匹配包含 <img> 子元素的 <figure> 元素，仅能匹配到 Case ① 和 Case ③  */ 
figure:has(> img) { 
    background-color: #009688; 
} 
```

它只能匹配到 Case ① 和 Case ③ ，因为只有这两个 Case 的 `figure` 包含子元素 `img` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c02311cc7423425088771a71397498ee~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxyEPBK>

如果我们把 `:has(> img)` 换成 `:has(img)`，结果又完全不定样，它将匹配所有 Case：

```CSS
/* 匹配包含 <figcaption> 后代元素的 <figure> 元素，可以匹配所有 Case */ 
figure:has(figcaption) { 
    background-color: #3f51b5; 
} 

/* 匹配包含 <img> 后代元素的 <figure> 元素，可以匹配所有 Case */ 
figure:has(img) { 
    background-color: #9c27b0; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64c265ed69d64a8aa2fdf25b3b930a09~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRapLG>

要是换成 `:has(img + figcaption)` ，则仅能匹配 Case ③：

```CSS
/* 匹配包含 <figcaption> 后代元素的 <figure> 元素，可以匹配所有 Case */ 
figure:has(figcaption) { 
    background-color: #3f51b5; 
} 

/* 匹配包含 <img> 后代元素的 <figure> 元素，可以匹配所有 Case */ 
figure:has(img) { 
    background-color: #9c27b0; 
} 

/* 匹配包含 <img> 后面有 <figcaption> 元素的 <figure> 元素，仅匹配 Case ③ */ 
figure:has(img + figcaption) { 
    background-color: #607d8b; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2602b70e6929408d911c404682018b5f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dygpJMO>

## 高级的 :has() 选择器

其实，在介绍 `:has()` 选择器是什么的时候就向大家展示了 `:has()` 选择器的最基础使用，即通过后代元素来找到与之匹配的父元素。比如：

```CSS
figure:has(figcaption) {
    background-color: #09f;
}
```

除了可以用来选择父元素之外，还可以用来选择其他元素，比如：

```CSS
figure:has(figcaption) img {
    border-radius: 1rem 1rem 0 0;
}
```

`figure:has(figcaption)` 选择器匹配包含 `figcaption` 的 `figure` 元素。相反，`figure:has(figcaption) img` 选择器匹配包含 `figcaption` 的 `figure` 元素内的 `img` 元素。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddf765c0d8bf48d08766602032f99bfb~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWORXZV>

更为高级的是将 `:has()` 选择器和其他组合选择器或伪类选择器结合在一起使用。为了更好地理解我们将创建的高级选择器如何工作，我们将快速回顾最相关的组合选择器和伪类选择器。

“组合选择器”是一种特殊字符，表示选择器之间的关系类型。常见的组合选择器主要有：

*   ` ` 空格字符，例如 `a b` ，称之为后代组合选择器，匹配直接或嵌套的子元素；
*   `>` 字符，例如 `a > b` ，称之为直接子元素组合选择器，仅匹配顶层未嵌套的子元素；
*   `+` 字符，例如 `a + b` ，称之为相邻兄弟组合选择器，仅匹配紧随其后的下一个兄弟元素；
*   `~` 字符，例如 `a  ~ b` ，称之为通用兄弟组合选择器，匹配基础选择器（`a`）之后的一个或多个兄弟元素（`b`）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16cf089979cb414eb5cb0cda2b674e71~tplv-k3u1fbpfcp-zoom-1.image)

而伪类选择器就相对比较复杂一些，它根据不同功能可以分为：

*   状态伪类选择器，比如 `:hover` 、`:active` 、`visited` 和 `focus` 等；
*   焦点伪类选择器，比如 `:focus-within` 和 `:focus-visible` 等；
*   结构型伪类选择器，比如 `:nth-child`、`:nth-last-child`、`:first-child`、 `:last-child`、`:only-child`、`:nth-of-type`、`:nth-last-of-type`、 `:first-of-type`、 `:last-of-type` 和 `:only-of-type` 等；
*   表单伪类选择器，比如 `:autofill`、`:enabled`、 `:disabled`、`:read-only`、 `:read-write`, `:placeholder-shown`、 `:default`、 `:checked`、`:indeterminate`、`:valid`、`:invalid`、`:in-range`、`:out-of-range`、`:required` 和 `:optional` 等；
*   目标伪类选择器，比如 `:target` ；
*   语言伪类选择器，比如 `:dir()` 和 `:lang()` 等；
*   函数伪类选择器，比如 `:not()` 、`:is()` 和 `:where()` 等。

CSS 的 `:has()` 选择器也被称为是一种函数型伪类选择器，是一种功能性伪类，因为它接受一个选择器列表，无论是简单的（比如 `:has(img)`）还是带有组合器的复杂选择器（比如 `:has(img + figcaption)`）。

也就是说，我们再结合 CSS 中其他选择器，可以使 `:has()` 选择器具备更高级的能力。接下来，我们通过示例来演示 `:has()` 选择器的高级能力。

### 模拟 :only-of-selector

熟悉 CSS 选择器的 Web 开发者都知道，在 CSS 中有 `:only-child` 和 `:only-of-type` 选择器，就没有 `:only-of-selector` 选择器。虽然 `:only-child` 和 `:only-of-type` 都是有效的选择器，但它们在使用的时候有一定的局限性，就拿 `:only-of-type` 选择器来说，这个元素没有其他相同类型的兄弟元素。例如：

```HTML
<div class="box">Div Element</div>
<span class="box">Span Element</span>
<div class="box">Div Element</div>
```

```CSS
span:only-of-type {
    border-color: #09f;
    color: #09f;
}
```

它可以很好的工作：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58d06c4d237440e0805051e19da8a7b4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxNgwG>

但是，要是我们的 HTML 结构中不仅有一个 `span` 元素，那么 `span:only-of-type` 就将失效：

```HTML
<div class="box">Div Element</div>
<span class="box">Span Element</span>
<div class="box">Div Element</div>
<span class="box">Span Element</span>
```

或者说，如果我们的 HTML 结构中都是相同的元素，只有其中一个类名不一样：

```HTML
<div class="box">Div Element</div>
<div class="box">Dive Element</div>
<div class="divider">Divider</div>
<div class="box">Dive Element</div>
<div class="box">Dive Element</div>
```

即使你使用 `.divider:only-of-type` 选择器，也将匹配不到任何元素：

```CSS
.divider:only-of-type {
    color: red;
}
```

有意思的是，我们现在可以使用 `:has()` 选择器，并结合 `:not()` 选择器，来模拟一个类似 `:only-of-selector` 的选择器，它将基于类或其他有效选择器在一系列兄弟姐妹中匹配单个选择器。

试想一下，我们最终想要的是，在我们的选择器匹配目标之前或之后不存在任何与其匹配的兄弟元素，而 `:has()` 选择器其中一个优点就是可以用来检测元素后面的内容。由于我们想测试任意数量的后续兄弟元素，因此，我们将使用**通用兄弟组合选择器（****`~`****）** 创建第一个条件。

```CSS
.divider:not(:has(~ .divider)) {
    color: red;
}
```

到目前为止，这给我们提供了“`.divider` 没有后续兄弟元素叫 `.divider`”。接下来，我们需要检查 `.divider` 之前的兄弟元素有没有被命名为 `.divider`，我们可以使用`:not()` 选择器来添加该条件。

```CSS
.divider:not(:has(~ .divider)):not(.divider ~  *) {
    color: red;
}
```

这样我们就模拟出 `:only-of-selector` 选择器功能：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/505a120d4d674c0cbb614b935d7d831b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaqQjmx>

### 上一个兄弟选择器

在 CSS 的众多选择器中，我们可以使用 `a + b` （相邻兄弟组合选择器）选择器来选择与之相邻的后面的兄弟元素：

```HTML
<div class="box"></div>
<div class="box"></div>
<div class="box"></div>
<div class="circle"></div>
<div class="box"></div>
```

```CSS
.box + .circle {
    width: 100px;
    border-radius: 50%;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e9819848cb94006a7af6403a76fd14b~tplv-k3u1fbpfcp-zoom-1.image)

但一直以来，CSS 却没有一个选择器可以允许你来选择与元素相邻的前面的兄弟元素。比如，我们想要选择和样式化圆圈前面的元素。现在，你可以将 `:has()` 选择器与相邻兄弟组合选择器 `+` 结合在一起实现所需要的功能，即将其与 `:has()` 组合，仅选择紧接在 `.circle` 之后的 `.box` 。从圆圈的角度来看，选中的是圆圈 `.circle` 的前一个兄弟元素 `.box` ：

```CSS
.box:has(+ .circle) {
    width: 100px;
    border: 2px solid #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2d1621469ce4611b0f595b2aa3d0a9c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEmaJg>

你可以将 `.box:has(+ .circle)` 选择器分为两部分：

*   `.box` 选择器所有类名为 `.box` 的元素
*   `:has(.box + .circle)` ，仅选择与模式 `.box + .circle` 匹配的元素 ，起到一种过滤功能，它仅将返回圆圈（`.circle` 元素）的前一个兄弟元素 `.box`

利用该特性，你就可以选择第 `n` 个前元素，比如，你使用两个相邻兄弟组合选择器时，就可以选中圆圈 `.circle` 元素前面的第二个 `.box` 元素：

```CSS
.box:has(+ * + .circle) {
    width: 100px;
    border: 2px solid #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12ace83e97bf4667a65bfdf4346e792d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNaoxwo>

如果您愿意，您也可以将选择器范围限定为一个类（而不是通配符 `*`），在这个示例中，你也可以使用 `.box` 来替代 `*` ：

```CSS
.box:has(+ * + .circle) {
    width: 100px;
    border: 2px solid #09f;
}

/* 等同于 */
.box:has(+ .box + .circle) {
    width: 100px;
    border: 2px solid #09f;
}
```

依此类推，你可以选择更前面的元素。例如，你要选择圆圈 `.circle` 前面的第三个兄弟元素 `.box` ，可以这样使用你的选择器：

```CSS
.box:has(+ * + * + .circle) {
    width: 100px;
    border: 2px solid #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0eed97462894379b2bc1360ff20a869~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExdNyWe>

利用该特性，我们就可以轻易实现下图所示的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7f83d0fa76d4d78923b14ce1388b354~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJBbXZb>

在一个列表中，当鼠标悬浮在列表项上时，它会放大，其前后元素也会略微放大。其余未悬浮的列表项会缩小。除了悬浮的列表项之外，所有列表项的不透明度也应降低，并且变模糊。

实现上例效果所需的关键 CSS 代码：

```CSS
:root {
    --li-scale: 1.25;
    --li-scale-adj: 0.2;
    --li-pb: 0.25em;
}

li:hover {
    --li-pb: 0.75em;
    scale: var(--li-scale);
}

/* 选择悬浮列表项前的列表项 */
li:has(+ li:hover),
/* 选择悬浮列表项后的列表项 */
li:hover + li {
    --li-pb: 0.15em;
    --li-delay: 40ms;

    scale: calc(var(--li-scale) - var(--li-scale-adj));
    opacity: 0.75;
    filter: blur(.5px);
}

/* 当列表项被悬浮时，选择未悬浮或悬浮前后的列表项 */
ul:has(> :hover) li:not(:hover, :has(+ :hover), li:hover + *) {
    --list-pb: 0;
    --li-delay: 60ms;

    scale: calc(1 - var(--li-scale-adj));
    opacity: 0.5;
    filter: blur(2px);
}
```

简单解释一下。首先使用 `li:hover` 来选择当前鼠标悬浮的列表项：

```CSS
li:hover {
    --li-pb: 0.75em;
    scale: var(--li-scale);
}
```

接着使用 `+` 来选择与当前悬浮列表项相邻的兄弟元素，它后一个列表项：

```CSS
li:hover + li {
    --li-pb: 0.15em;
    --li-delay: 40ms;

    scale: calc(var(--li-scale) - var(--li-scale-adj));
    opacity: 0.75;
    filter: blur(.5px);
}
```

然后利用 `:has()` 选择器和相邻兄弟选择器 `+` 来选择当前悬浮列表项之前的一个列表项：

```CSS
li:has(+ li:hover) {
    --li-pb: 0.15em;
    --li-delay: 40ms;

    scale: calc(var(--li-scale) - var(--li-scale-adj));
    opacity: 0.75;
    filter: blur(.5px);
}
```

因为与当前悬浮列表项相邻的前后列表项效果是一样的，所以使用选择器列表，将相同的样式规则合并在一起：

```CSS
/* 选择悬浮列表项前的列表项 */
li:has(+ li:hover),
/* 选择悬浮列表项后的列表项 */
li:hover + li {
    --li-pb: 0.15em;
    --li-delay: 40ms;

    scale: calc(var(--li-scale) - var(--li-scale-adj));
    opacity: 0.75;
    filter: blur(.5px);
}
```

最后就是选中其他列表项。选中它们需要创建第三个复杂选择器，需要将 `:has()` 和 `:not()` 选择器组合在一起。首先限定选择器仅在 `ul` 的直接子元素（也就是列表项）被悬浮时才应用。如果满足条件，我们将根据排除被悬浮的列表项以及其前面和后面的列表项来选择其他列表项。

```CSS
/* 当列表项被悬浮时，选择未悬浮或悬浮前后的列表项 */
ul:has(> :hover) li:not(:hover, :has(+ :hover), li:hover + *) {
    --list-pb: 0;
    --li-delay: 60ms;

    scale: calc(1 - var(--li-scale-adj));
    opacity: 0.5;
    filter: blur(2px);
}
```

> 注意，在这个示例中，我们使用到了另一个函数型伪类选择器 `:not()` 。如果你从未接触过该选择器，或者对其并不了解，不必过于担心，我们在后面的课程中会专门向大家介绍 `:has()` 和 `:not()` 选择器的差异与共存。

### 选择前面所有的兄弟元素

既然 `:has()` 选择器可以与相邻兄弟组合选择器 `+` 共用，来选择前一个兄弟元素或指定的前第 `n` 个兄弟元素；那么我们是否可以将 `:has()` 选择器与通用兄弟组合选择器 `~` 组合，来选择其前面所有的兄弟元素？

假设你有这样的一个 HTML 结构：

```HTML
<div class="box"></div>
<div class="box"></div>
<div class="box"></div>
<div class="circle"></div>
<div class="rect"></div>
<div class="circle"></div>
<div class="circle"></div>
```

我们可以使用通用兄弟组合选择器 `~` 来选中 `.box` 后面的所有 `.circle` 元素。

```CSS
.box ~ .circle {
    width: 100px;
    border-radius: 50%;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d52b80199124754ad3c1ae7d98fdb47~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRVqXz>

如果把示例选择器换成 `.box:has( ~ .cirlce)` 选择器，你会发现将会选中圆圈前面的所有的 `.box` 元素：

```CSS
.box:has(~ .circle) {
    width: 100px;
    border: 2px solid #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/847024af8bfa45a6b93ab5273db06ff7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNaYMER>

我们还可以将 `:has()` 选择器、相邻兄弟组合选择器（`+`）和通用兄弟组合选择器（`~`）结合在一起使用。比如：

```CSS
.box:has(~ .box + .circle) {
    width: 100px;
    border: 2px solid #09f;
}
```

将选择 `.circle` 元素所有前面的兄弟元素 `.box` ，但除了 `.circle` 元素相邻的前一个兄弟元素 `.box` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b59d33d386d4c8bb4b8143f38f6fac9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOBLjqM>

### 选择一个范围内的元素

`:has()` 选择器与 `+` 和 `~` 组合不仅仅可以选中上一个兄弟元素和选择前面所有兄弟元素，它还能允许你选择一个范围内的元素：

*   范围内的第一个元素
*   范围内的最后一个元素
*   范围内的所有同级元素

比如：

```HTML
<div class="rect"></div>
<!-- Rect 范围开始 -->
<div class="circle"></div>
<div class="circle"></div>
<div class="circle"></div>
<!-- Rect 范围结束 -->
<div class="rect"></div>

<div class="circle"></div>

<div class="star"></div>
<!-- Star 范围开始 -->
<div class="circle"></div>
<div class="circle"></div>
<div class="circle"></div>
<!-- Start 范围结束 -->
<div class="star"></div>
```

上面的代码有两个范围，分别是矩形（Rect）以及星星（Star）开始和结束：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fde41f9f4f8435c93df4fe1f44b9ae0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRBjgx>

假设你想选中矩形（Rect）范围内的第一个圆 `.circle` ，那么你可以像下面这样使用 `:has()` 选择器：

```CSS
.rect + :has(~ .rect) {
    width: 100%;
    border: 2px solid #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/345b5a7f8c204dc1a24ea606052068b9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYPBLvX>

反之，如果你希望选中一个范围中最后一个元素，可以像下面这样使用 `:has()` 选择器：

```CSS
.star ~ :has(+ .star) {
    width: 100px;
    border: 2px solid #09f;
}
```

它将会选中星星范围内的最后 `.circle` 元素，即第二个星星（Start 结束）前的 `.circle` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d22c3db1f0c4efea9517f3c577bff3e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dygOqVX>

如果你希望选中一个范围内的所有内级元素，比如 Rect 范围内的所有 `.circle` 元素，那么你可以像下面这样使用 `:has()` 选择器：

```CSS
.rect ~ :has(~ .rect) {
    width: 100px;
    border: 2px solid #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0375fb789eec4ffb9d399016cd948afc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxyRaYG>

虽然符合你的预期，但这个选择器也有一定的局限性。它的限制在于，它仅适用于父元素内的单个范围。这是因为，当使用同级组合选择器而没有硬性停止时，这些同级元素可以在元素后面的任何位置。所以，该选择器会包括“跳跃”其他可能在范围内的元素，导致这个选择器的范围扩大。但是，如果你确定在给定的父元素内仅有一个范围，则此选择器就显得非常有用了。

例如，你有一个列表项，你希望选中除了第一项和最后一项的所有列表项，那么这个选择器就很有用：

```HTML
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
    <li>React</li>
    <li>Vue</li>
</ul>
```

```CSS
li ~ :has(~ li) {
    text-decoration: underline;
    rotate: 5deg;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57eb5bfb7d7e4fba9044361a1c4c9293~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：

上面的代码等同于：<https://codepen.io/airen/full/eYPBLjq>

```CSS
li:not(:first-child, :last-child) {
    text-decoration: underline;
    rotate: 5deg;
}
```

### 无需任何 JavaScript 即可为表单状态设置样式

在 `:has()` 选择器中可以使用很多神奇的伪类，并将彻底改变伪类可以做什么的方式。以前，伪类仅用于基于特殊状态来设置元素或其子元素的样式。比如：

```CSS
input:focus-visible {
    outline: 3px solid plum;
}

input:checked + label {
    color: red;
}
```

现在，`:has()` 选择器使伪类在不基于 JavaScript 脚本之下用来捕捉状态，并根据该状态样式化 DOM 中的任何内容。例如，表单中的 `input` 控件，它的相关伪类（比如，`:autofill` 、`:enabled`、`:disabled`、`:read-only`、`:read-write`、`:placeholder-shown`、`:default`、`:checked`、`:indeterminate`、`:valid`、`:invalid`、`:in-range`、`:out-of-range`、`:required` 和 `:optional` 等）就提供了捕获此类状态的强大方式。来看一个这方面的具体示例：

```CSS
form button { 
    /* 按钮默认样式，比如未选中状态的样式 */ 
} 

form:has(input[type="checkbox"]:checked) button { 
    /* 复选框选中状态的按钮样式 */ 
} 
```

使用 `:has()` 改变按钮 `button` 样式，比如一个注册表单，只有用户同意相关注册协议（表单中的筛选框被选中），创建账号的按钮才高亮，变成可用状态，否则就是处于禁用状态：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53b85cb5319642bf8f6d2980f2e89267~tplv-k3u1fbpfcp-zoom-1.image)

你可以在 `:has()` 中使用 `input` 的 `:valid` 和 `:invalid` 伪类，让 `input` 输入框能根据用户输入的数据有效或无效时提供不同的 UI 风格：

```CSS
.control__input is(.icon-cancel, .icon-check) {
    display: none;
}
.control:has(:focus:invalid) .icon-cancel,
.control:has(:focus:valid) .icon-check {
    display: unset
}
.control:has(:focus:invalid) {
    color: tomato;
}
.control:has(:focus:valid) {
    color: limegreen;
}
.control:has(:focus-visible:invalid) .control__input {
    outline-color: pink;
}
.control:has(:focus-visible:valid) .control__input {
    outline-color: palegreen;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/148a963f8a054dff9d7a65f6559363af~tplv-k3u1fbpfcp-zoom-1.image)

事实上，通过CSS `:has()` 选择器和表单伪类，可以用来改善 HTML 表单，包括验证提示、条件内容、更精美的设计等。在后面介绍 `:has()` 选择器的实际案例时，就会有这方面的介绍。

### 逻辑运算符

`:has()` 选择器还可以用于检查一个或多个特征是否为真，或者所有特征是否都为真。

当我们在相对选择器列表中包含多个选择器时，如果任何关系选择器为真，则可以匹配锚元素。以下示例匹配包含任何副标题的 `main` 元素（即紧接着 `h1` 标题之后是 `h2` 标题）：

```CSS
main:has( > h1 + h2, > h2 + h3, > h3 + h4) p {
    color: red;
}
```

上面这段代码的意思是“如果 `main` 元素有一个子元素 `h1` ，并且 `h1` 元素后面紧跟着一个 `h2` 元素；或 `main` 元素有一个子元素 `h2` ，并且 `h2` 元素后面紧跟着一个 `h3` 元素；或者 `main` 元素有一个子元素 `h3` ，并且 `h3` 元素后面紧跟着一个 `h4` 元素；那么就对 `main` 元素的所有后代 `p` 元素设置文本色（`color`）为红色（`red`）”

```HTML
<!-- 可匹配的 HTML 结构 -->
<main>
    <h1>H1 Heading</h1>
    <h2>H2 Heading</h2>
    <p>Paragraph</p>
</main>

<main>
    <h2>H2 Heading</h2>
    <h3>H3 Heading</h3>
    <p>Paragraph</p>
</main>

<main>
    <h3>H3 Heading</h3>
    <h4>H4 Heading</h4>
    <p>Paragraph</p>
</main>

<!-- 不匹配的 HTML 结构 -->
<main>
    <h1>H1 Heading</h1>
    <h3>H3 Heading</h3>
    <p>Paragraph</p>
</main>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/166f324f9fe44fae98d9bc937af0f0ab~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRVRay>

在这个示例中，`:has()` 选择器中有一个长列表，它包含了多个选择器，只要列表中的任何一个关联选择器为 `true` ，则可以匹配锚定元素。这里长列表中的每个选择器关系相当于**或（****`OR`****）** 关系。

也就是说，你还可以将多个关联选择器串联在一起，以创建 **与（`AND`** **）** 的关系：

```CSS
main:has( > h1 + h2):has( > h2 + h3):has(> h3 + h4) p {
    color: red;
}
```

这个选择器的意思是“如果 `main` 元素有一个子元素 `h1` ，并且 `h2` 元素后面紧跟着一个 `h2` 元素；同时 `main` 元素有一个子元素 `h2` ，并且 `h2` 元素后面紧跟着一个 `h3` 元素；同时 `main` 元素有一个子元素 `h3` ，并且 `h3` 元素后面紧跟着一个 `h4` 元素；那么就对 `main` 元素的所有后代 `p` 元素设置文本色（`color`）为红色（`red`）”。要是将这段代码运用于前一个示例中，它将匹配不到任何元素，但它能匹配到下面的 HTML 结构：

```HTML
<main>
    <h1>H1 Heading</h1>
    <h2>H2 Heading</h2>
    <p>Paragraph</p>
    <h2>H2 Heading</h2>
    <h3>H3 Heading</h3>
    <p>Paragraph</p>
    <h3>H3 Heading</h3>
    <h4>H4 Heading</h4>
    <section>
      <p>Paragraph In Section</p>
    </section>
</main>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c6fbb1260d147ab973fce3ffb73d9ee~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaqQqQv>

### :has() 根据父元素的子元素数量进行样式设置

在 CSS 中，可以通过利用 `:nth-child` 、`:last-child` 选择器基于同级元素的数量来进行样式设置。比如下面的代码，选择一切能被 `3` 整除的列表：

```CSS
/*选择列表中所有能被3整除的列表*/ 
li:nth-last-child(3n):first-child, 
li:nth-last-child(3n):first-child ~ li { } 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74455ac532da4db2be094a49866f8dea~tplv-k3u1fbpfcp-zoom-1.image)

但是，如果想要基于子元素数量来设置父元素的样式呢？这就是 CSS `:has()` 选择器发挥作用的地方。例如，下面这段代码就是使用 CSS `:has()` 选择器根据子元素数量来为列表元素（父元素 `ul`）设置不同的边框样式。

```CSS
/* ul 包含最多 3 个( 3 个或更少，不包括 0 ) li 项 */
ul:has(> :nth-child(-n+3):last-child) {
    border: 3px solid palegreen;
}

/* ul 包含最多 3 个( 3 个或更少，包括 0 个) li 项 */
ul:not(:has(> :nth-child(3))) {
    border: 3px solid limegreen;
}

/* ul 正好包含 5 个 li 项 */
ul:has(> :nth-child(5):last-child) {
    border: 3px solid plum;
}

/* ul 至少包含 10 个 （10 个或更多）li 项 */
ul:has(> :nth-child(10)) {
    border: 3px solid pink;
}

/* ul 包含 7 ~ 9 个 li 项*/
ul:has(> :nth-child(7)):has(> :nth-child(-n+9):last-child) {
    border: 3px solid tomato;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9192f910b72a4246a43d9b69a3e62939~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWZGJyK>

注意，这里涉及 CSS 的**数量查询** （也称为**范围选择器** ）相关的知识，但这部分知识已超出这节课的范畴，所以不在这里做更多的阐述。如果你感兴趣，可以移步阅读 **[条件CSS之 @ 规则和选择器 中的 :has() 选择器和结构型伪类选择器的组合](https://juejin.cn/book/7199571709102391328/section/7199845944760729632)**。

`:has()` 选择器可以根据父元素的子元素数量设置样式之外，还同样可以利用该特性给父元素的子元素或相邻元素设置样式。比如：

```CSS
section > div { 
    flex: 1 1 calc((100% - 10px * 2) / 3); 
} 

section:has(div:nth-child(3n + 1):last-child)::after { 
    flex: 1 1 calc(((100% - 10px * 2) / 3) * 2 + 10px); 
} 

section:has(div:nth-child(3n + 2):last-child)::after { 
    flex: 1 1 calc((100% - 10px * 2) / 3); 
} 
```

根据在 `<section>` 中的 `<div>` 元素数量，给 `section` 的 `::after` 元素设置不同的 `flex-basis` 的值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd0ba2b761ad439bb9a84fb48632fa44~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/JjmbeMw>

上面示例的方法也同样适用于 CSS 网格布局中。比如根据网格项目的数量显示并更改网格中的列宽度：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c6b4ba6e9094582995ddb25ef8dfab9~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
.container {
    --item-size: 200px;
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(var(--item-size), 1fr));
    gap: 1rem;
}

.container:has(.item:nth-last-child(n + 5)) {
    --item-size: 120px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07fd4f89f1284b33a34edf3aedc4edd5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJpRem>

### 还有更多

CSS 中的伪类还有很多，其中大部分伪类都是可以和 `:has()` 结合使用。比如前面所提到的结构性伪类 `:nth-child` 、`:nth-last-child` 、`:first-child` 、`:last-child` 和表单伪类 `:valid`、`:invalid`、`:in-range`、`:out-of-range`、`:required` 和 `:optional` 等。

但 CSS 中也有一些新增的伪类，比如 `:empty` 、`:modal` 、`:target` 、`:paused` 等。你可以：

*   使用 `:has(:modal)` ，可以根据模态框（Modal）是打开还是关闭为 DOM 中的任何内容设置样式；
*   使用 `:has(:empty)` ，可以根据元素是否为空来设置样式，比如来隐藏空元素；
*   使用 `:has(:target)` ，为编写查看与特定元素 ID 匹配的片段的当前 URL 的代码打开了有趣的可能性。例如，如果用户在文档顶部单击目录，并跳转到与该链接匹配的页面部分。

然而，并非每个伪类都可以和 `:has()` 选择器结合在一起使用，比如控制媒体 `video` 、`audio` 的伪类，比如 `:playing` 、`:paused` 和 `:muted` 等就不起作用，至少在写这节课的时候还不起作用。它们很可能未来某一天也能和 `:has()` 一起组合使用。

另外，需要注意的是，CSS 工作组决定禁止在 `:has()` 内部使用所有现有的伪元素，比如 `::before` 、`::after` 、`::marker` 和 `::first-line` 等。

## :has() 选择器是一个严格型选择器

最初发布 `:has()` 选择器时，它和 `:is()` 和 `:where()` 等选择器都归于“宽容型”选择器的范畴中（在 2022 年 5 月 7 日的早期草案中）。但是，后面有人提出宽容性与 jQuery 的 `:has()` 选择器会发生冲突。所以，W3C 的 CSS 工作小组重新决定 `:has()` 选择器变为一个“严格”型选择器。

也就是说，如果你像下面这样使用 `:has()` 选择器，那么它将是一个无效的选择器：

```CSS
article:has(h2, ul, ::-scoobydoo) { 
    color: red;
}
```

`:has()` 选择器中的 `::-scoobydoo` 是个无效的伪类，所以整个 `:has()` 选择器也将是一个无效的选择器。

当然，即使 `:has()` 选择器是一个严格型选择器，但 `:is()` 和 `:where()` 还是一个宽容型选择器。这就意味着我们可以将其中一个选择器嵌套在 `:has()` 选择器中，以获得更宽容的行为：

```CSS
article:has(:where(h2, ul, ::-scoobydoo)) { 
    color: red;
}

/* 或者 */
article:has(:is(h2, ul, ::-scoobydoo)) { 
    color: red;
}
```

不管是`:is()` 还是 `:where()`，都很重要，因为 `:is()` 选择器的权重取决于参数列表中最高权重的一项，而 `:where()` 会将选择器权重降为 `0` ：

```CSS
/* 选择器权重: (0,0,1) */
article:has(:where(h2, ul, ::-scoobydoo)) {
    color: red;
}

/* 选择器权重: (0,0,2) */
article:has(:is(h2, ul, ::-scoobydoo)) { }
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be90ffad00224091b8fe3e2ee48b5fcd~tplv-k3u1fbpfcp-zoom-1.image)

> 测试 CSS 选择器权重工具：[CSS Selector Specificity](https://polypane.app/css-specificity-calculator/#selector=article%3Ahas(%3Awhere(h2%2C%3E%20ul%2C%20%3A%3A-scoobydoo))%2Carticle%3Ahas(%3Ais(h2%2C%20ul%2C%20%3A%3A-scoobydoo)))

注意，`:has()` 选择器本身不会向选择器添加任何权重。

## 小结

在还没有 `:has()` 选择器之前，Web 开发者习惯于通过编写多个类来解决缺少父选择器的功能问题，而这些类需要你手动或使用 JavaScript 来动态添加。现在，你完全可以使用 `:has()` 选择器来实现。

正如课程中“高级的 `:has()` 选择器”一节中所展示的，CSS 的 `:has()` 选择器不仅仅是一个父选择器，它可以和其他的 CSS 选择器组合在一起，使 CSS 选择器变成一个高级的选择器，比如 `:has()` 选择器和相邻兄弟组合选择器（`+`）、通用兄弟组合选择器（`~`）结合在一起使用，可以让你选择一个范围内的元素。

其实，`:has()` 选择器的使用并不复杂，最为困难的部分在于我们要打开思维，看到它的可能性。我们已经习惯了没有父选择器所强加的限制。现在，我们必须打破这些习惯。

在下一节课中，我将通过更多的实际案例，让大家看到 `:has()` 选择器更多可能性，并且充分利用今天浏览器的所有强大功能，帮助我们更好地解决实际开发问题。
