多年来，我们一直用物理关键词来标识 CSS 位置：`top` 、`right` 、`bottom` 和 `left` 。这些词与浏览器视窗本身的物理尺寸有关。任何包含 `left` 的属性都表示位置位于浏览器窗口的左侧。许多属性使用物理位置语法，例如 `padding` 、`margin` 、`border` 和与位置相关的属性。

我们已经像这样写了这么多年的 CSS，很难想象改变我们对位置标识的看法。然而，我们在 CSS 中识别位置和方向有了新的发展，它允许我们用更少的代码创建更健壮的 Web 布局！这就是 CSS 逻辑属性和逻辑值。

随着时间的推移，主流浏览器对 CSS 的逻辑属性和逻辑值的支持越来越好。然而，每当我们想在项目中使用它们时，仍然很难记住它们。`start` 是什么意思？`end` 意味着什么？不试错就掌握所有细节有点棘手。在这节课中，我将从不同的语言体系（例如汉语体系、拉丁语体系和阿拉伯语体系等）出发，让你开始使用逻辑属性和逻辑值。我将试着用一种直观的方式来思考逻辑属性和逻辑值，希望大家能更好的理解和掌握它们。你准备好了吗？让我们开始吧。

## 逻辑属性和逻辑值描述了什么？

CSS 的逻辑属性和逻辑值的基本思想是**我们不会在 CSS 属性和值中使用物理方向**。相反，我们将使用依赖 HTML 文档方向的属性，例如 `dir="ltr"` 或 `dir="rtl"` 。因为，CSS 的逻辑属性和逻辑值能自动响应文本方向和书写模式。这也意味着以前由左和右标识的位置将自动反转为 RTL 布局，水平和垂直属性将自动旋转为垂直书写模式。

> 如果你不熟悉 `LTR` （从左到右）和 `RTL` （从右到左）或垂直书写模式，我建议你花一点时间阅读 **[现代 Web 布局](https://s.juejin.cn/ds/iD8fc3g/)** 中的《[Web 中的向左向右：Flexbox 和 Grid 布局中的 LTR 与 RTL](https://juejin.cn/book/7161370789680250917/section/7161625525763440647)》和《[Web 中的向左向右：Web 布局中 LTR 切换到 RTL 常见错误](https://juejin.cn/book/7161370789680250917/section/7161625415935590436)》相关课程。

我们一起先来看一个最基本的例子：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ac14aabb2ad482faf20b281c37ae436~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQoBQd>

正如你所看到的，上图是 Web 中很常见的卡片组件，它包含了一张缩略图，标题和描述文本，并且卡片缩略图与卡片内容（标题和描述文本）之间有一个间距。其中，英文内容的卡片是一个 LTR （从左到右）的布局，间距位于缩略图的右侧；阿拉伯内容的卡片是一个 RTL （从右到左）的布局，间距位于缩略图的左侧，刚好与英文内容的间距相反。

在还没有 CSS 逻辑属性的情况之下，我们需要像下面这样写 CSS ：

```CSS
.card img {
    margin-right: 1.5rem;
}
​
.card[dir="rtl"] img {
    margin-left: 1.5rem;
    margin-right: 0;
}
```

注意，对于 RTL 布局，`margin-right` 被重置为 `0` ，因为那里不需要它。想象一下，如果在一个大型项目中这样做，你的 CSS 代码将会变得非常臃肿，而且难于维护，并且在下次更新的过程中也很容易出错。

要是使用 CSS 逻辑属性的话，这一切就显得很方便，你只需要一行 CSS 代码即可实现：

```CSS
.card img {
    margin-inline-end: 1.5rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf3b13b2e7d847a0b65fd8e019e91d1f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKryaYz>

CSS 的 `margin-inline-end` 属性将会将根据 HTML 文档的方向自动调整外边距的位置。这就是 CSS 逻辑属性的强大之处。

当然，你可能会对 `margin-inline-end` 属性中的 `inline` 和 `end` 感到好奇，它们分别表示什么意思？又应该如何使用？要回答这些个问题，我们就有必要花点时间来了解一些基础理论知识。

## 需要理解和掌握的术语

`top` 、`right` 、`bottom` 和 `left` 等物理属性指的是浏览器视窗的物理方向。你可以把它们想象成地图上的罗盘：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93c5c6a369a34840af047f17256f8bbf~tplv-k3u1fbpfcp-zoom-1.image)

另一方面，逻辑属性指的是与内容流相关的框的边缘。因此，如果文本方向或书写方式发生变化，它们也会发生变化。这是方向性样式的一大转变，它给了我们在设计界面样式时更多的灵活性。

### 文档流

任何语言都有自身的书写模式和阅读模式。比如，在拉丁语体系（例如英文、德文和法文），字母和单词从左到右流动，而段落从上到下堆叠。在阿拉伯语系（例如阿拉伯语和希伯来语），字母和单词从右到左流动，而段落从上到下堆叠。在繁体中文中，字母和单词从上到下排列，而段落从右到左排列。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2a232342e4d4b3085e36a677dd5eedd~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，页面的内容会根据语言的书写模式和阅读模式有所不同。映射到 Web 页面中，那就是页面内容根据文档方向变化而更新时，布局及其元素也会发生变化。我们时常把这种变化（即页面内容根据文档方向变化而更新时，布局及元素也发生变化）视为流（Flow），即文档流（有时也称为正常流）。也意味着方向、字母、单词和内容需要沿着方向移动。这就引出流的另外两个概念，即**块流** （Block Flow）和**内联流** （Inline Flow）。

### 块流

块流是文档中内容块放置的方向。例如，如果有两个段落，那么块流就是第二段的位置。在英文文档中，块流是从上到下的。把它想象成一段又一段的文本，从上到下。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e6a4148af5442e598b14a21efd7a8d0~tplv-k3u1fbpfcp-zoom-1.image)

### 内联流

内联流是文本在句子中的流动方式。在英文文档中，内联流是从左到右的。如果将 Web 的文档语言更改为阿拉伯语(`<html lang="ar">`)，则内联流将从右向左。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18e3e3ea3105491fb35afa3c784cc95c~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，内联流也常称为文本流。

文本的流动方向由文档的书写模式决定。可以使用 `writing-mode` 属性更改文本布局的方向。这可以应用于整个文档，也可以应用于单个元素。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d073e015099b47a09305ad0ef9a604b4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQVryv>

这里所说的块流和文本流，主要指的是 HTML 块元素的流动方向和文本内容的流动方向，其中文本流也常称“内联方向”：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/160607c8551a43f8a06e8673286da567~tplv-k3u1fbpfcp-zoom-1.image)

在 Web 中除了文档有流方向一说之外，对于文本同样有流的概念，比如说英文，一般是从左到右，阿拉伯文是从右到左，而日文（古代的中文）从上到下，从右到左：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcad9b8e74704932a8be785bc36b85aa~tplv-k3u1fbpfcp-zoom-1.image)

不管是文档流还是文本流，它们都具有相应的物理特性，比如从左到右，从右到左，从上到下，从下到上。即，它们都没有离开 `top`、`right`、`bottom` 和 `left` 方向。这也是 CSS 中为什么有那么多属性和值都与方向有着紧密联系的原因所在。比如：

-   `text-align` 属性：用于指定文本的对齐方式，属性值包括 `left`（左对齐）、`right`（右对齐）和 `center`（居中对齐）。
-   `vertical-align` 属性：用于指定元素内容的垂直对齐方式，属性值包括 `top`（顶端对齐）、`bottom`（底端对齐）和 `middle`（居中对齐）。
-   `position` 属性：用来设置元素的定位方式，取值 `relative`、`absolute`、`fixed`、`sticky`，配合 `top` 、`right` 、`bottom` 和 `left` 值，可以对元素进行精确定位。
-   `margin-top`、`margin-right`、`margin-bottom`、`margin-left` 属性：用于设置元素的外边距，四个方向的值可以单独设置。
-   `padding-top`、`padding-right`、`padding-bottom`、`padding-left` 属性：用于设置元素的内边距，四个方向的值可以单独设置。
-   `border-top`、`border-right`、`border-bottom`、`border-left` 属性：用于设置元素的边框，四个方向的值可以单独设置，还可以结合 `border-style`（边框样式）、`border-width`（边框宽度）等属性一起使用。
-   `border-top-left-radius` 、`border-top-right-radius` 、`border-bottom-right-radius` 、`border-bottom-left-radius` 属性：用于设置元素的圆角，四个顶点的值可以单独设置。
-   `linear-gradient()` 和 `repeating-linear-gradient()` 属性：`to right` 、`to left` 、`to top` 和 `to bottom` 可以设定渐变的方向、起点和终点颜色。
-   `float` 属性的值可以设置为 `left`、`right` ，分别表示浮动在左边、右边。
-   `clear` 属性的值可以设置为 `left`、 `right`，分别表示清除浮动元素在左边、右边。
-   CSS Flexbox 布局中的 `flex-direction` 和 CSS Grid 布局中的 `grid-auto-flow` 。
-   CSS 框对齐相关的属性。

这些与 `top` 、`right` 、`bottom` 和 `left` 方向有关联的属性和值，都被统称为 **CSS 物理属性或值**，它们最终在浏览器的呈现都会受到 HTML 的 `dir` 、CSS 的 `direction` （指定文本方向）、`writing-mode` （控制文本排列方式）、`text-orientation` （控制文本方向）和 `unicode-bidi` （设置双向文本的方向）等属性的影响。

### 内联和块的区别

在默认情况下，CSS 元素的内容是从左到右排列。但是对于某些语言或特定的排版需求，需要从右到左排列，或从上到下排列等。通常这种从左到右、从上到下的排列方向分别是沿着 Web 坐标轴的 `x` 轴（水平方向）和 `y` 轴（垂直方向）排列的。

我们都知道，在 Web 中有一个坐标系统，它分为 `x` 轴和 `y` 轴：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fec93faa87c43e59e19c0588634f250~tplv-k3u1fbpfcp-zoom-1.image)

CSS 中的任一元素可以在这个坐标系统中沿着 `x` 轴向左或向右移动位置，也可以沿着 `y` 轴向上或向下移动位置。它们具有明确的物理方向：

-   `x` 轴方向有 `left` 和 `right` ；
-   `y` 轴方向有 `top` 和 `bottom` 。

除此之外，CSS 中还有一个**流**的概念，也就是我们常说的**文档流（Document Flow）** ，它指的是元素在 HTML 文档中的流动方向。在 HTML 文档中，元素通常从上到下（块元素）、从左到右（内联元素）依次排列。而且 Web 布局也是基于这个顺序进行排列的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bac94f2805d4e8daec56735306b6485~tplv-k3u1fbpfcp-zoom-1.image)

如果你想改变元素在文档流中的位置，就需要使用一些 [Web 布局技巧](https://juejin.cn/book/7161370789680250917?utm_source=profile_book)，例如浮动（`float`）、定位（`position`）、Flexbox 和 Grid 布局等。

同样的，Web 中的文本也存在流的概念。在拉丁语体系中（比如英文），字母和单词从左到右流动，而段落从上到下垂直排列；在阿拉伯语体系中（比如阿拉伯语），字母和单词从右到左流动，而段落从上到下垂直排列；在传统的汉语体系中（比如中文和日文），字和词从上到下排列，而段落从右到左水平排列。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d35318d284dc40139b1ff6e2dd445a48~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，在一个多语言 Web 应用或网站中，页面的内容和布局应该能随着 HTML 文档方向更改而自动更新。换句话说，CSS 中的流意味着**方向**，字母、单词和内容以及布局都需要沿着流移动。这将引导我们进入块和内联逻辑方向。

也就是说，随着 CSS 的逻辑属性的出现，CSS 的坐标系就不再以 `x` 轴 和 `y` 轴来定义，而是以 **内联** （Inline）和 **块** （Block）来区分：

-   内联维度是在使用的书写模式中运行的文本行（文本流）所在的维度。即，对应于文本流（阅读方式）的轴线。例如，英文是从左到右的文本流（或阿拉伯文从右到左），因此内联轴是水平的；对于日文，它的阅读方式是自上而下，因此内联轴是垂直的。
-   块维度是另一个维度，以及块（如段落）相继显示的方向。在英语和阿拉伯语中，这些是垂直的，而在任何垂直书写模式中，这些是水平的。

它们随着 CSS 的书写模式改变，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2478a781ded94bbf86bb3dfacb9f662c~tplv-k3u1fbpfcp-zoom-1.image)

我们可以换过一种方式来理解：

-   **块轴** ：主要定义网站文档（元素块）流，CSS 的书写模式 `writing-mode` 会影响块轴的方向；
-   **内联轴** ：主要定义网站的文本流方向，也就是文本的阅读方式，CSS 的 `direction` 或 HTML 的`dir` 会影响内联轴的方向。

简单地说，**`writing-mode`** **能很好地和块轴、行内轴、阅读模式以及书写模式结合起来** ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92f5cbdd5fa94467b069a297db691d13~tplv-k3u1fbpfcp-zoom-1.image)

为了更好地匹配书写模式或者说多语言的 Web 布局，我们需要从一些理念上做出改变。

换句话说，在使用 CSS 逻辑属性时，你经常会看到关键词 `inline` 或 `block` 。根据书写方式的不同，内联或块的含义会发生变化。对于像英语这样的语言，内联是水平方向（`x` 轴），块是垂直方向（`y` 轴）。对于像日语这样的语言，内联是垂直方向（`y` 轴），块是水平方向（`x`）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25513d270b114fee95a3bbf1ea91886a~tplv-k3u1fbpfcp-zoom-1.image)

### 开始与结束

在逻辑属性中除了能经常看到 `inline` 和 `block` 之外，还能经常看到另外两个关键词，即 `start` （开始）和 `end` （结束），它们代表着流的开始和结束位置。即：

-   `block-start` 表示块流的开始位置
-   `block-end` 表示块流的结束位置
-   `inline-start` 表示内联流的开始位置
-   `inline-end` 表示内联流的结束位置

更为有意思的是，它们与 HTML 的 `dir` 属性以及 CSS 的 `writing-mode` 和 `direction` 属性有一定的关联。这些特性都将影响 `start` 和 `end` 的位置。拿内联流的 `start` 和 `end` 为例，在 HTML 中，我们可以在元素标签上使用 `dir` 属性来指定它们：

-   `dir="ltr"` ：对应着 LTR 模式，汉语体系和拉丁语体系都是这种模式；
-   `dir="rtl"` ：对应着 RTL 模式，阿拉伯语体系都是该模式。

```HTML
<!-- RTL -->
<html lang="ar" dir="rtl">
    <body>
        <h1>مياه للجميع، مستقبل مشترك</h1>
    </body>
</html>
​
<!-- LTR -->
<html lang="zh" dir="ltr">
    <body>
        <h1>人人有水、共享未来</h1>
    </body>
</html>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95077fdbfb744e6281557c65eb9e7d3f~tplv-k3u1fbpfcp-zoom-1.image)

CSS 中的 `direction` 和 HTML 的 `dir` 是完全相同的。我们可以在 CSS 中使用 `direction` 来改为阅读模式：

-   `ltr` ：对应着 LTR 模式，汉语体系和拉丁语体系都是这种模式；
-   `rtl` ：对应着 RTL 模式，阿拉伯语体系都是该模式。

```CSS
[lang="ar"] {
    direction: rtl;
}
​
[lange="zh"] {
    direction: ltr;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3341f791d6d4892b1ec56a431297818~tplv-k3u1fbpfcp-zoom-1.image)

汉语、日语、韩语和蒙古语既可以从左到右水平书写，也可以从上到下垂直书写。大多数这些语言的网站都是水平的，和英语一样。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c87cbae33f8d4ee686e76cc6f03fe833~tplv-k3u1fbpfcp-zoom-1.image)

相比之下，垂直书写在日本网站上更为常见。有些网站同时使用垂直和水平文本。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d51031f915746aabf5b67f211d7352e~tplv-k3u1fbpfcp-zoom-1.image)

对于垂直书写（从上到下且从右到左或从上到下且从左到右）模式，HTML 的 `dir` 和 CSS 的 `direction` 是无法实现的。庆幸的是，CSS 中有一个名为书写模式的模块，即 `writting-mode` ，它可以做到：

-   **`horizontal-tb`** ：定义了内容从左到右水平流动（内联流），从上到下垂直流动（块流）。下一条水平线位于上一条线下方；
-   **`vertical-rl`** ：定义了内容从上到下垂直流动（内联流），从右到左水平流动（块流）。下一条垂直线位于上一行的左侧；
-   **`vertical-lr`** ：定义了内容从上到下垂直流动（内联流），从左到右水平流动 （块流）。下一条垂直线位于上一行的右侧；
-   **`sideways-rl`** ：定义了内容从上到下垂直流动，所有字形，甚至是垂直脚本中的字形，都设置在右侧；
-   **`sideways-lr`** ：内容从上到下垂直流动，所有字形，甚至是垂直脚本中的字形，都设置在左侧。

也就是说，在使用 CSS 逻辑属性或逻辑值时，我们将会使用 `start` 和 `end` 来替代以往的 TRBL（即 `top` 、`right` 、`bottom` 和 `left` ）：

-   **开始（`start`）** 这对应于文本的方向，并反映了文本的侧边，你将从哪里开始阅读。对于英文，开始对应于左。对于阿位伯文来说，对应于右。
-   **结束（`end`）** 这也对应于文本的方向，并反映了文本的侧边，你将在哪里结束阅读。对于英文，结束对应于右。对于阿拉伯文来说，对应于左。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/860b12f8cd4d4b1e9431808f1d4d475b~tplv-k3u1fbpfcp-zoom-1.image)

### 逻辑维度

在使用 CSS 逻辑属性或值时，是基于逻辑维度进行的，即使用“逻辑维度”替代“物理维度”。前面的内联轴、块轴、开始和结束结合起来可以构建 CSS 逻辑属性中的流相对值。即 `block-start` 、`block-end` 、 `inline-start` 和 `inline-end` 。这几个属性也被称为**逻辑维度** ，其实就是用来指定在对应轴上的开始和结束位置。它们对应的就是我们熟悉的 `top` 、`right` 、 `bottom` 和 `left` 几个物理方向。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/244d63a45342479fa3ad877f5158b222~tplv-k3u1fbpfcp-zoom-1.image)

换句话说，在 CSS 逻辑中，使用流相对值来代替相应的物理值。正如前面所述，流相对值（逻辑维度）和 CSS 的书写模式 `writing-mode` 或阅读方式 `direction` 有关。

接下来，我们通过几种典型的语言为例，来向大家阐述逻辑维度和物理维度的映射关系。 首先来看英文，英文的阅读方式一般是从左往右（即 `dirction: ltr` 和 `writing-mode:horizontal-tb` ），这种模式常称为 **LTR** （Left-To-Right）。它的内联轴是水平的，块轴是垂直的，相应的逻辑维度和物理维度映射关系如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a267734a8f06474896e513b2e6543f2b~tplv-k3u1fbpfcp-zoom-1.image)

| **逻辑维度**       | **物理维度** |
| -------------- | -------- |
| `inline-start` | `left`   |
| `inline-end`   | `right`  |
| `block-start`  | `top`    |
| `block-end`    | `bottom` |

接着来看阿拉伯文，它的阅读方式是从右往左（即 `direction: rtl` 和 `writing-mode:horizontal-tb`），这种模式常称为 **RTL** （Right-To-Left）。它的内联轴是水平的，块轴是垂直的，相应的逻辑维度和物理维度映射关系如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/261af6573f8a45e89158401931c38e5a~tplv-k3u1fbpfcp-zoom-1.image)

| **逻辑维度**       | **物理维度** |
| -------------- | -------- |
| `inline-start` | `right`  |
| `inline-end`   | `left`   |
| `block-start`  | `top`    |
| `block-end`    | `bottom` |

再来看日文，竖排（有点类似中国古代的汉字书写模式），对应的 `writing-mode: vertical-rl` 。它的内联轴是垂直的，块轴是水平的，相应的逻辑维度和物理维度映射关系如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7a2366b72e84b8d8c2e96813e938941~tplv-k3u1fbpfcp-zoom-1.image)

| **逻辑维度**       | **物理维度** |
| -------------- | -------- |
| `inline-start` | `top`    |
| `inline-end`   | `bottom` |
| `block-start`  | `right`  |
| `block-end`    | `left`   |

最后再来看蒙文，也是竖排，和日文不同的是 `writing-mode: vertical-lr` 。它的内联轴是垂直的，块轴是水平的，相应的逻辑维度和物理维度映射关系如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9be9dcb9f7344a30b5278054428f8259~tplv-k3u1fbpfcp-zoom-1.image)

| **逻辑维度**       | **物理维度** |
| -------------- | -------- |
| `inline-start` | `top`    |
| `inline-end`   | `bottom` |
| `block-start`  | `left`   |
| `block-end`    | `right`  |

## CSS 逻辑属性和逻辑值

在 CSS 中有许多 CSS 属性和值都有逻辑替代语法。[@Adrian Roselli 在 CodePen 上提供了一个 Demo](https://codepen.io/aardrian/full/bGGxrvM)，可视化展示常用 CSS 属性和值对应的逻辑属性和逻辑值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3780d7b473b4b8f883d6a28a10a03a5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQpqya>

示仅展示了 `direction` 为 `ltr` 和 `writing-mode` 为 `horizontal-tb` 时，物理属性和值所映射的逻辑属性和逻辑值。

我们来进一步分解所有 CSS 逻辑属性和逻辑值，但请记住，**逻辑属性和逻辑值的关键在于它们会根据上下文而变化**！

### CSS 逻辑属性

先从 CSS 逻辑属性开始！

#### CSS 逻辑尺寸

元素的宽度（`width`）和高度（`height`）属性有相对应的逻辑属性。一旦我们理解了内联和块的概念，就更容易理解 CSS 的逻辑尺寸。

在水平书写模式下（例如 `writing-mode` 的值为 `horizontal-tb` ），`inline-size` 用来设置元素的宽度（`width`），而 `block-size` 用来设置元素的高度（`height`）。在垂直书写模式下（例如 `writing-mode` 的值为 `vertical-rl` 或 `vertical-lr`），情况正好相反：`inline-size` 用来设置元素的高度（`height`），`block-size` 用来设置元素的宽度（`width`）。

例如，在英文（LTR）和阿拉伯文（RTL）中：

```
width = inline-size
height = block-size
```

在自上而下（阅读模式）的语言中，比如日语（`writing-mode:vertical-rl` ），我们看到的情况是相反的：

```
width = block-size
height = inline-size
```

来看一个具体的示例：

```CSS
.card {
    inline-size: 300px;
    block-size: 100px;
}
​
.card[lang="jp"] {
    writing-mode: vertical-rl;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/667e9c0cefde4e4d9081266503bd037c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOQYLom>

需要知道的是，上面所述的逻辑属性也适用于 `max-*` 和 `min-*` 对应的属性。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11e4e721771f473bba889cec6f5cc68e~tplv-k3u1fbpfcp-zoom-1.image)

#### CSS 逻辑边框

在 CSS 中，我们一般使用 `border` 以及它的子属性 `border-top` 、`border-right` 、`border-bottom` 和 `border-left` 来设置元素的边框，它们也有相应的逻辑属性。比如 `border-inline-start` 、`border-inline-end` 、 `border-block-start` 和 `border-block-end` 等。

```CSS
.card {
    border-inline-start: 2px solid red;
    border-inline-end: 4px solid blue;
    border-block-start: 6px solid green;
    border-block-end: 8px solid lime;
}
​
.card[lang="jp"] {
    writing-mode: vertical-rl;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eb9538b6eba481db3847e9a46c59e4a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEmvaEN>

在英文（LTR）中：

```
border-top    = border-block-start
border-right  = border-inline-end
border-bottom = border-block-end
border-left   = border-inline-start
```

在阿拉伯文（RTL）中：

```
border-top    = border-block-start
border-right  = border-inline-start
border-bottom = border-block-end
border-left   = border-inline-end
```

在自上而下（阅读模式）的语言中，比如日语（`writing-mode:vertical-rl` ）：

```
border-top    = border-inline-start
border-right  = border-block-start
border-bottom = border-inline-end
border-left   = border-block-end
```

CSS 的边框（`border`）子属性还可以根据方向来单独设置边框颜色（`border-color`）、边框粗细（`border-width`）和边框样式（`border-style`）。它们是 `border-top-width`、`border-right-width` 、`border-bottom-width` 、`border-left-width` 、`border-top-style` 、`border-right-style` 、`border-bottom-style` 、`border-left-style` 、`border-top-color` 、`border-right-color` 、`border-bottom-color` 和 `border-left-color` 等物理属性。在 CSS 中，这些与边框相关的物理属性也有相应的逻辑属性。即在 `-width` 、`-color` 和 `-style` 前面加上 `border-inline-start` 、`border-inline-end` 、`border-block-start` 和 `border-block-end` ，例如逻辑边框颜色，`border-inline-start-color` 、`border-inline-end-color` 、`border-block-start-color` 和 `border-block-end-color` 等。

注意，我们还可以使用 `border-block` 和 `border-inline` 来设置逻辑边框。当 `direction` 为 `ltr` 或 `writing-mode` 为 `horizontal-tb` 时，`border-block` 相当于 `border-top` 和 `border-bottom` ，`border-inline` 相当于 `border-left` 和 `border-right` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d41dc0bf6b82447299e84fccf44a4475~tplv-k3u1fbpfcp-zoom-1.image)

#### CSS 逻辑外边距

CSS 的外边距 `margin` 有四个子属性，分别为 `margin-top` 、`margin-right` 、`margin-bottom` 和 `margin-left` 。也可以使用 `margin-block-start` 、`margin-block-end` 、`margin-inline-start` 和 `margin-inline-end` 来设置逻辑外边距。

例如，在英文（LTR）中：

```
margin-top = margin-block-start
margin-right = margin-inline-end
margin-bottom = margin-block-end
margin-left = margin-inline-start
```

在阿拉伯文（RTL）中：

```
margin-top = margin-block-start
margin-right = margin-inline-start
margin-bottom = margin-block-end
margin-left = margin-inline-end
```

在自上而下（阅读模式）的语言中，比如日语（`writing-mode:vertical-rl` ），我们看到的情况是：

```
margin-top = margin-inline-start
margin-right = margin-block-start
margin-bottom = margin-inline-end
margin-left = margin-block-end
```

```CSS
h3 + p {
    margin-block-start: 1rem;
    margin-block-end: 2rem;
    margin-inline-start: 3rem;
    margin-inline-end: 4rem;
}
​
.card[lang="jp"] {
    writing-mode: vertical-rl;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/929f3557cf294daf9b918d902dd5b80f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQoXZB>

注意，我们还可以使用 `margin-block` 和 `margin-inline` 给元素设置逻辑外距。如果 `direction` 的值为 `ltr` 或 `writing-mode` 的值为 `horizontal-tb` ，那么 `margin-block` 相当于 `margin-top` 和 `margin-bottom` ，而 `margin-inline` 相当于 `margin-left` 和 `margin-right` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87e14bc67c9a4e3bbc32df710320dcc5~tplv-k3u1fbpfcp-zoom-1.image)

#### CSS 逻辑内距

CSS 的逻辑内距和 CSS 逻辑外距相似：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a525b7222a94493fbeed8bc8fdf87344~tplv-k3u1fbpfcp-zoom-1.image)

同样的，我们还可以使用 `padding-block` 和 `padding-inline` 给元素设置逻辑外距。如果 `direction` 的值为 `ltr` 或 `writing-mode` 的值为 `horizontal-tb` ，那么 `padding-block` 相当于 `padding-top` 和 `padding-bottom` ，而 `padding-inline` 相当于 `padding-left` 和 `padding-right` 。

将逻辑尺寸、逻辑边框、逻辑外距和逻辑内距组合在一起，我们以往熟悉的 CSS 盒模型也分为物理盒模型和逻辑盒模型。在 `direction` 属性值为 `ltr` 和 `writing-mode` 属性值为 `horizontal-tb` 时，物理盒模型和逻辑盒模型映射关系如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb5f9820eaf74a63ab6d7d685bd7ef8b~tplv-k3u1fbpfcp-zoom-1.image)

#### CSS 逻辑圆角

CSS 的逻辑圆角相对来说要复杂一点。

了解 CSS 的同学都知道，`border-radius` 拆分为下面这几个子属性：

-   左上角圆角：`border-top-left-radius`
-   右上角圆角：`border-top-right-radius`
-   右下角圆角：`border-bottom-right-radius`
-   左下角圆角：`border-bottom-left-radius`

需要知道的是，简写属性 `border-radius` 并没有相对应的逻辑属性，但它的子属性却有相对应的逻辑属性。比如，`direction` 属性值为 `ltr` 和 `writing-mode` 属性值为 `horizontal-tb` 时，物理圆角和逻辑圆角相对应的关系如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81bb91a0bbd047d29ff5281a84ebcc99~tplv-k3u1fbpfcp-zoom-1.image)

它和其他逻辑属性略有不同，大多数逻辑属性中同时会包含轴的方向（例如 `block` 和 `inline`）和起始与结束位置（例如 `start` 和 `end`），而逻辑圆角中只有起始和结束位置 `start` 和 `end` 。其中出现在前面的 `start` 和 `end` 代表块轴方向，出现在后面的 `start` 和 `end` 代表内联轴方向：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86fbdddb17cf4fdeb8db1565e04054f4~tplv-k3u1fbpfcp-zoom-1.image)

来看一个具体的示例：

```CSS
.card {
    border-start-start-radius: 1rem;
    border-start-end-radius: 2rem;
    border-end-end-radius: 3rem;
    border-end-start-radius: 4rem;
}
​
.card[lang="jp"] {
    writing-mode: vertical-rl;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b27e35f9e7e4ff28d406ff752afed50~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOoQdB>

在英文（LTR）中：

```
border-top-left-radius     = border-start-start-radius
border-top-right-radius    = border-start-end-radius
border-bottom-right-radius = border-end-end-radius
border-bottom-left-radius  = border-end-start-radius
```

在阿拉伯文（RTL）中：

```
border-top-left-radius     = border-start-end-radius
border-top-right-radius    = border-start-start-radius
border-bottom-right-radius = border-end-start-radius
border-bottom-left-radius  = border-end-end-radius
```

在自上而下（阅读模式）的语言中，比如日语（`writing-mode:vertical-rl` ）：

```
border-top-left-radius = border-end-start-radius
border-top-right-radius = border-start-start-radius
border-bottom-right-radius = border-start-end-radius
border-bottom-left-radius = border-end-end-radius
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e992b014de94e4ab773457ab0efedd1~tplv-k3u1fbpfcp-zoom-1.image)

CSS 逻辑圆角相关属性和物理圆角相关属性是类似的，也可以接受两个值，例如：

```CSS
.element {
    border-start-start-radius: 2rem 4rem;
}
```

其中第一个值是内联轴方向的半径值，第二个值是块轴方向的半径值。这就有点令人感到困惑了，前面我们说过，逻辑圆角属性中的第一个 `start` 或 `end` 指的是块轴方向，第二个 `start` 或 `end` 才是内联轴方向，但半径值却先写内联轴方向半径，再写块轴方向半径。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a940818afc44baa826c7c52ce0d42df~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQpWqO>

#### CSS 逻辑偏移

在 CSS 中，我们可以使用 `top` 、`right` 、`bottom` 、`left` 或它们的简写属性 `inset` 对定位元素（`position` 的值不是 `static`）设置偏移量。例如：

```CSS
.popup{
    position:fixed;  
    top:0;
    bottom:0;
    left:0;
    right:0;
    
    /* 或者 */
    inset: 0;
}
```

同样的，它们也有相应的逻辑偏移量。例如：

```CSS
.card {
    position: relative;
}
​
.card[lang="jp"] {
    writing-mode: vertical-rl;
}
​
.card::after {
    content: '';
    position: absolute;
​
    inset-block-start: 10px;
    inset-block-end: 20px;
    inset-inline-start: 30px;
    inset-inline-end: 40px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c964f915486452dbdbe68fdf0aa29b7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGJgbv>

在英文（LTR）中：

```
top    = inset-block-start
right  = inset-inline-end
bottom = inset-block-end
left   = inset-inline-start
```

在阿拉伯文（RTL）中：

```
top    = inset-block-start
right  = inset-inline-start
bottom = inset-block-end
left   = inset-inline-end
```

在自上而下（阅读模式）的语言中，比如日语（`writing-mode:vertical-rl` ）：

```
top    = inset-inline-start
right  = inset-block-start
bottom = inset-inline-end
left   = inset-block-end
```

我们还可以使用 `inset-block` 和 `inset-inline` 给元素设置逻辑偏移量。如果 `direction` 的值为 `ltr` 或 `writing-mode` 的值为 `horizontal-tb` ，那么 `inset-block` 相当于 `top` 和 `bottom` ，而 `inset-inline` 相当于 `left` 和 `right` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fa50c10eb3b4eb4953178e9593e9440~tplv-k3u1fbpfcp-zoom-1.image)

#### 其他 CSS 逻辑属性

除了上述所介绍的 CSS 逻辑属性之外，CSS 还有其逻辑属性，比如 `overflow-inline` 、`overflow-block` 、`overscroll-behavior-block` 和 `overscroll-behavior-inline`。

下图是较为完整的 CSS 逻辑属性清单列表，并且提供了相应的物理属性清单：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e92beef13904afc927a6623d7e8751b~tplv-k3u1fbpfcp-zoom-1.image)

来看一个简单地示例：

```CSS
.button {
    --writing-mode: horizontal-tb;
    writing-mode: var(--writing-mode);
    
    display: inline-flex;
    align-items: center;
    justify-content: center;
    place-self: center;
  
    transition: all .2s linear;
  
    padding-block: .8rem;
    padding-inline: 2rem;
    border-start-start-radius: .2em;
    border-start-end-radius: .2em;
    border-end-start-radius: .2em;
    border-end-end-radius: .2em;
}
​
.button:hover {
    border-start-start-radius: 2em 4em;
    border-start-end-radius: 2em 4em;
    border-end-start-radius: 4em 2em;
    border-end-end-radius: 4em 2em;
}
​
.button svg {
    margin-inline-end: 0.5em;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d491d12e57ca48a8bc0e59975ba7dfdc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQaoEG>

### CSS 的简写逻辑属性

在 CSS 中有很多属性具有简写属性（子属性），比如我们熟悉的 `margin` 、`padding` 、`border` 、`border-radius` 、`overflow` 和 `overscroll-behavior` 等。拿 `margin` 为例吧，它可以拆分出 `margin-top` 、`margin-right` 、`margin-bottom` 和 `margin-left` 四个子属性。

其实，在 CSS 逻辑属性中也有这样的概念。

#### margin 和 padding 简写属性

CSS 逻辑属性中 `margin` 的简写属性有 `margin-block` 和 `margin-inline` ：

```CSS
.margin--logical {
    margin-block: 4ch 2ch;
    margin-inline: 2ch 4ch;
    
    /* 等同于 */
    margin-block-start: 4ch;
    margin-block-end: 2ch;
    
    margin-inline-start: 2ch;
    margin-inline-end: 4ch;
}
```

如果 `-start` 和 `-end` 对应的属性值相同，那么使用简写属性时，可以只设置一个值，比如：

```CSS
.margin--logical {
    margin-block: 2ch;
    margin-inline: 4ch;
    
    /* 等同于 */
    margin-block-start: 2ch;
    margin-block-end: 2ch;
    
    margin-inline-start: 4ch;
    margin-inline-end: 4ch;
}
```

逻辑属性 `padding` 和 `margin` 类似：

-   `padding-inline` 是 `padding-inline-start` 和 `padding-inline-end` 的简写属性；
-   `padding-block` 是 `padding-block-start` 和 `padding-block-end` 的简写属性。

#### border 简写属性

我们知道物理属性 `border` 可以拆分为：

-   边框粗细：`border-width` ，它又可以拆分为 `border-top-width` 、`border-right-width` 、`border-bottom-width` 和 `border-left-width`。
-   边框颜色：`border-color` ，它又可以拆分为 `border-top-color` 、`border-right-color` 、`border-bottom-color` 和 `border-left-color`。
-   边框样式：`border-style` ，它又可拆分为 `border-top-style` 、`border-right-style` 、`border-bottom-style` 和 `border-left-style` 。

它相对于 `padding` 和 `margin` 要复杂得多。

逻辑属性 `border` 也可以根据颜色（`color`）、粗细（`width`）和样式（`style`）进行拆分，即：

-   边框粗细：`border-block-width` 和 `border-inline-width` ，它们又分别可以拆分出 `border-block-start-width` 和 `border-block-end-width` ；`border-inline-start-width` 和 `border-inline-end-width`。
-   边框颜色：`border-block-color` 和 `border-inline-color` ，它们又分别可以拆分出 `border-block-start-color` 和 `border-block-end-color` ；`border-inline-start-color` 和 `border-inline-end-color`。
-   边框样式：`border-block-style` 和 `border-inline-style` ，它们又分别可以拆分出 `border-block-start-style` 和 `border-block-end-style` ；`border-inline-start-style` 和 `border-inline-end-style`。

来看一个边框颜色的示例：

```CSS
.border-color--logical {
    border-block-color: #09f #f36;
    
    /* 等同于 */
    border-block-start: #09f;
    border-block-end: #f36;
}
```

但需要注意的是，逻辑边框和逻辑内外、逻辑外边距有一点不同，使用逻辑边框 `border-block` 和 `border-inline` 子属性设置元素边框时，只能设置同一方向相同的边框样式。例如：

```CSS
.border--logical {
    border-block: 2px solid orange;
    border-inline: 4px dashed;
}
```

如果每条边框样式规则不同，则需要分别使用 `border-block-start` 、`border-block-end` 、`border-inline-start` 和 `border-inline-end` 。例如：

```CSS
.border--logical {
    border-block-start: 4ch solid red;
    border-block-end: 3ch dashed yellow;
    border-inline-start: 4ch double;
    border-inline-end: 3ch groove orange;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/877c9515f0874dac88358e54fa60ba63~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/vYQdYzp>

#### 简写的 border-radius 属性

`border-radius` 的子属性有：

-   左上角：`border-top-left-radius`；
-   右上角：`border-top-right-radius`；
-   右下角：`border-bottom-right-radius`；
-   左下角：`border-bottom-left-radius`。

例如：

```CSS
.border-radius {
    border-radius: 30px 50px 50px 100px;
    
    /* 等同于 */
    border-top-left-radius: 30px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    border-bottom-left-radius: 100px;
}
​
.border-radius {
    border-radius: 30px 50px 100px 50px / 100px 50px 50px 50px;
    
    /* 等同于 */
    border-top-left-radius: 30px 100px;
    border-top-right-radius: 50px 50px;
    border-bottom-right-radius: 100px 50px;
    border-bottom-left-radius: 50px 50px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec849dcf81914753b65e74923c799202~tplv-k3u1fbpfcp-zoom-1.image)

但对于逻辑属性 `border-radius` 的子属性，并不像 `margin` 、`padding` 和 `border` 等属性，它没有 `border-block-radius` 和 `border-inline-radius` 子属性。逻辑属性 `border-radius` 的子属性：

-   `border-start-start-radius`；
-   `border-start-end-radius`；
-   `border-end-end-radius`；
-   `border-end-start-radius`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8d3f85ab9ca48508459231e96d49ef0~tplv-k3u1fbpfcp-zoom-1.image)

你可能会对 `-start-start` 和 `-start-end` 等感到困惑。其实它和物理属性中的 `-top-left` 、`-top-right` 等是相似的：出现在前面的 `start` 和 `end` 是指块轴（Block Axis）的起始和结束位置；出现在后面的 `start` 和 `end` 是指内联轴（Inline Axis）的起始和结束位置。

```CSS
/* 物理 CSS border-radius */
.border-radius--physical {
  border-top-left-radius: 5rem 10rem;
  border-top-right-radius: 2rem 1rem;
  border-bottom-right-radius: 4rem 2rem;
  border-bottom-left-radius: 3rem 5rem;
}
​
/* 逻辑 CSS border-radius */
.border-radius--logical {
  border-start-start-radius: 5rem 10rem;
  border-start-end-radius: 2rem 1rem;
  border-end-end-radius: 4rem 2rem;
  border-end-start-radius: 3rem 5rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79fcdae124d949e388ab253ca48d52ee~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJaQJaB>、

需要注意的是，在 CSS 中逻辑属性 `border-radius` 并没有简写属性。因此，在开发多语言 Web 应用或网站时，最好是使用拆分后的逻辑 `border-radius` 属性，尤其是四个角的圆角半径不同之时。不然，你将遇到意想不到的效果。比如下面这个示例，你在按钮默认状态使用的是 `border-radius` （物理属性），而在悬浮状态下却使用的是逻辑属性：

```CSS
button {
    border-radius: 2rem;
}
​
button:hover {
    border-start-start-radius: 2rem 4rem;
    border-start-end-radius: 4rem 2rem;
    border-end-start-radius: 2rem 4rem;
    border-end-end-radius: 4rem 2rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/537a39d644e440cd8152452f08e1aad8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwQRzG>

从浏览器开发者调试工具中不难发现，按钮悬浮状态下的逻辑圆角并没有覆盖初始化状态下的物理圆角，可浏览器实际渲染还是以逻辑圆角的值进行，这难免会令人感到困惑。

#### inset 简写属性

对于定位元素（即 `position` 设置非 `static` 的元素）可以使用 `top` 、`right` 、`bottom` 和 `left` 来设置偏移量。这四个属性有一个简写属性 `inset` ：

```CSS
.inset {
    position: absolute;
    inset: 10px 20px 30px 40px;
    
    /* inset 等同于 */
    top: 10px;
    right: 20px;
    bottom: 20px;
    left: 40px;
}
```

看起来很方便。只不过，`inset` 属性是一个物理属性。相应的 CSS 逻辑属性是：

-   `top` 映射 `inset-block-start`；
-   `right` 映射 `inset-inline-end`；
-   `bottom` 映射 `inset-block-end`；
-   `left` 映射 `inset-inline-start`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e72612423015414b9790361705a11165~tplv-k3u1fbpfcp-zoom-1.image)

不过，CSS 逻辑属性中可以使用 `inset-block` 和 `inset-inline` 来设置偏移量，它们分别是：

-   `inset-block` 是 `inset-block-start` 和 `inset-block-end` 的简写属性；
-   `inset-inline` 是 `inset-inline-start` 和 `inset-inline-end` 的简写属性。

例如：

```CSS
.inset {
    position: absolute;
    
    inset-block: 20px 30px;
    inset-inline: 40px 50px;
    
    /* 等同于 */
    inset-block-start: 20px;
    inset-block-end: 30px;
    inset-inline-start: 40px;
    inset-inline-end: 50px;
}
```

#### 避免使用简写属性

如果你正在开发一个多语言 Web 应用或网站，那么应该尽可能地在代码中不使用 CSS 的简写属性，尤其是四个方向的值不相等的情况下。比如 `border` 、`margin` 、`padding` 、`border-radius` 等属性。因为它们始终会代表着物理方向，例如下面这段代码：

```CSS
.element {
    border: 1px solid #f36;
    border-width: 1ch 2ch 3ch 4ch;
    margin: 1rem 2rem 3rem 4rem;
    padding: 1rem 2rem 3rem 4rem;
    border-radius: 1rem 2rem 3rem 4rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2780d1c323fc488d8b8b7eaf495b085c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJQWee>

你会发现，改变 `writing-mode` 时，元素的 `border` 、`border-radius` 、`margin` 和 `padding` 并不会受到任何影响。这对于多语言 Web 应用或网站是非常危险的。反之，如果换成拆分后的子属性（逻辑属性），结果就完全不一样：

```CSS
.element--physical {
    border: 1px solid #f36;
    border-width: 1ch 2ch 3ch 4ch;
    margin: 1rem 2rem 3rem 4rem;
    padding: 1rem 2rem 3rem 4rem;
    border-radius: 1rem 2rem 3rem 4rem;
}
​
.element--logical {
    border: 1px solid #f36;
    border-block-width: 1ch 3ch;
    border-inline-width: 4rem 2rem;
    margin-block: 1rem 3rem; 
    margin-inline: 4rem 2rem;
    padding-block: 1rem 3rem;
    padding-inline: 4rem 2rem;
    border-start-start-radius: 1rem;
    border-start-end-radius: 2rem;
    border-end-end-radius: 3rem;
    border-end-start-radius: 4rem; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87b9dd494c704a81af44e62e1fc22320~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEyPKV>

简而言之，**在开发多语言 Web 应用或网站时，虽然简写的 CSS 属性的使用能使你的代码更干净，但不建议直接使用，因为我们所熟悉的简写 CSS 属性都是物理属性，它和相对应的简写逻辑属性是完全不同的**。

换句话说，在开发多语言 Web 应用或网站时，请尽量不要使用盒模型相关的简写属性，即 `border` 、`padding` 、`margin` 和 `border-radius` 等，同时也包括 `inset` 属性。

#### 未来简写逻辑属性的变化

默认情况之下，`padding` 、`margin` 和 `border` 的简写属性为物理属性设置值。但在未来，Web 开发者可以在这些属性的值前面指定一个名为 `logical` 的关键词，它将告诉浏览器，这些值将映射到逻辑属性，而不是物理属性。例如：

```CSS
.element {
    margin: logical 1rem 2rem 3rem 4rem;
}
​
/* 等同于 */
.element {
    margin-block-start: 1rem;
    margin-inline-start: 2rem;
    margin-block-end: 3rem;
    margin-inline-end: 4rem;
}
```

> 需要注意，[目前这种方案还在讨论中](https://github.com/w3c/csswg-drafts/issues/1282)，并不代表是最终方案。

到目前为止，W3C 规范指定 `inset` 、`margin` 、`padding` 、`border-width` 、`border-style` 、`border-color` 、`scoll-padding` 和 `scroll-margin` 简写属性在设置值时，可以接受 `logical` 关键词。当这些简写属性的值中存在 `logical` 关键词时，后面的值将被分配到相应的逻辑属性上，但需要知道的是，取值数量不同时，所映射的逻辑属性也略有差异：

-   如果只设置一个值，则该值适用于`block-start` 、`block-end` 、`inline-start` 和 `inline-end`
-   如果设置了两个值，则第一个值会用于 `block-start` 和 `block-end` ，第二个值会用于 `inline-start` 和 `inline-end`
-   如果设置了三个值，则第一个值会用于 `block-start` ，第二个值将会用于 `inline-start` 和 `inline-end` ，第三个值将会用于 `block-end`
-   如果设置了四个值，则第一个值会用于 `block-start` ，第二个值将会用于 `inline-end` ，第三个值将会用于 `block-end` ，第四个值将会用于 `inline-start`

例如：

```CSS
.element {
    margin: logical 1rem;
    
    /* 等同于 */
    margin-block-start: 1rem;
    margin-inline-end: 1rem;
    margin-block-end: 1rem;
    margin-inline-start: 1rem;
}
​
.element {
    margin: logical 1rem 2rem;
    
    /* 等同于 */
    margin-block-start: 1rem;
    margin-inline-end: 2rem;
    margin-block-end: 1rem;
    margin-inline-start: 2rem;
}
​
.element {
    margin: logical 1rem 2rem 3rem;
    
    /* 等同于 */
    margin-block-start: 1rem;
    margin-inline-end: 2rem;
    margin-block-end: 3rem;
    margin-inline-start: 2rem;
}
​
.element {
    margin: logical 1rem 2rem 3rem 4rem;
    
    /* 等同于 */
    margin-block-start: 1rem;
    margin-inline-end: 2rem;
    margin-block-end: 3rem;
    margin-inline-start: 4rem;
}
```

### CSS 逻辑值

在 CSS 中有些属性的值也具有逻辑值。

#### CSS 浮动

CSS 的 `float` 属性的物理值有 `left` 、`center` 和 `right` ，它相应的逻辑值只有 `inline-start` 和 `inline-end` ，分别映射了物理值中的 `left` 和 `right` 。

| **CSS 属性**  | **物理值**      | **逻辑值**        |
| ----------- | ------------ | -------------- |
| **`float`** | `left`       | `inline-start` |
|     |         `center`     |                |
|      | `right` |        `inline-end`        |

用在英文（LTR）中：

```
float: left  = float: inline-start
float: right = float: inline-end 
```

用在阿拉伯文（RTL）中：

```
float: left  = float: inline-end
float: right = float: inline-start
```

#### CSS 清除浮动

CSS 的 `clear` 属性和 `float` 属性相似，它也具有 `inline-start` 和 `inline-end` 两个逻辑值，分别映射了物理值中的 `left` 和 `right` ：

| **CSS 属性**  | **物理值**      | **逻辑值**        |
| ----------- | ------------ | -------------- |
| **`clear`** | `left`       | `inline-start` |
|       |         `both`     |                |
|      | `right`  |       `inline-end`         |

#### 文本对齐

文本对齐属性 `text-align` 要比 `float` 和 `clear` 简单，`left` 和 `right` 被 `start` 和 `end` 替代：

| **CSS 属性**       | **物理值** | **逻辑值** |
| ---------------- | ------- | ------- |
| **`text-align`** | `left`  | `start` |
|         |  `right`    |     `end`    |

用英语（LTR）中:

```
text-align: left = text-align: start;
text-align: right = text-align: end;
```

用在阿拉伯文（RTL）中：

```
text-align: left  = text-align: end;
text-align: right = text-align: start
```

#### resize

`resize` 属性主要使用 `inline` 和 `block` 替代了 `horizontal` 和 `vertical` ：

| **CSS 属性**   | **物理值**      | **逻辑值**  |
| ------------ | ------------ | -------- |
| **`resize`** | `horizontal` | `inline` |
|      |          `both`      |          |
|    |  `vertical`   |       `block`     |

在英文（LTR）中：

```
resize: horizontal = resize: inline;
resize: vertical   = resize: block;
```

## 默认就是逻辑属性的 CSS 属性

[CSS Flexbox 或 Grid 特性已然是现代 Web 布局中的主流技术了](https://juejin.cn/book/7161370789680250917?utm_source=profile_book)。更为有意思的是，CSS Flexbox 和 Grid 特性默认都是逻辑的。这意味着，它们将根据文档的方向自动翻转。通过使用 CSS Flexbox 和 Grid 布局技术，你可以最大限度的减少构建多语言 Web 应用或组件所需的工作量。

下面是一个 CSS Grid 布局相关的示例，请注意这些网格项目是如何根据文档的方向排列的：

```CSS
.card {
    inline-size: 300px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
}
​
.card[lang="mn"] {
  writing-mode: vertical-lr;
}
​
.card[lang="jp"] {
  writing-mode: vertical-rl;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ba9f56031da4731b8232b458bede36b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQxdOg>

CSS Flexbox 具有同等的功能，比如把上面示例改成 CSS Flexbox 布局，得到的效果将是相似的：

```CSS
.card {
    inline-size: 300px;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
​
.item {
    flex: 1 1 25%;
}
​
.card[lang="mn"] {
    writing-mode: vertical-lr;
}
​
.card[lang="jp"] {
    writing-mode: vertical-rl;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3a3a67ebb03446ea0e1f20668fdb21a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQEXyN>

## 逻辑属性和逻辑值用例

现在我们对 CSS 的逻辑属性和逻辑值有了一个全面的认识。接下来，来看看一些实际用例，以确保你对 CSS 逻辑属性和逻辑值有一个更全面的理解。

先来看一个卡片相关的示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e78c119853724a22b1c55416b8106ce6~tplv-k3u1fbpfcp-zoom-1.image)

上图是一个简单而又经典的卡片组件，但它包含了英文、阿拉伯文、日文和蒙古文。这四种语言有着典型的特征：

-   英文阅读模式是从左向右，即 LTR
-   阿拉伯文阅读模式是从右向左，即 RTL
-   日文自上而下，但从右向左，即 `writing-mode` 的值为 `vertical-rl`
-   蒙古文也是自上而下，但从左向右，即 `writing-mode` 的值为 `vertical-lr`

为了阐述 CSS 逻辑属性的重要性，卡片组件特意做了额外的设计：

-   卡片左侧有一个蓝色边框
-   卡片左右两侧的距不相等
-   缩略图右侧有一个外边距

在没有 CSS 逻辑属性之前，要实现这样具有多语的卡片组件是件不易的事情，最起码代码会比较冗余。就拿英文（LTR）和阿拉伯文（RTL）为例：

```HTML
<div class="card" lang="en" dir="ltr">
    <img src="https://picsum.photos/200/200/?random=11" alt="">
    <div class="card__content">
        <h3>Modern CSS</h3>
        <p>Logical Properties and Logical Values in Modern CSS</p>
    </div>
</div>
​
<div class="card" lang="ar" dir="rtl">
    <img src="https://picsum.photos/200/200/?random=11" alt="">
    <div class="card__content">
        <h3>CSS الحديثة</h3>
        <p>الخصائص المنطقية والقيم المنطقية في CSS الحديث</p>
    </div>
</div>
```

```CSS
/* 默认是 LTR 模式样式 */
.card {
    border-left: 6px solid #09f;
    padding-left: 2rem;
    padding-right: 1rem;
}
​
.card img {
    margin-right: 2rem;
}
​
/* RTL 模式下重置样式 */
.card[lang="ar"] {
    border-left: none;
    border-right: 6px solid #09f;
    padding-left: 1rem;
    padding-right: 2rem;
}
​
.card[lang="ar"] img {
    margin-left: 2rem;
    margin-right: 0;
}
```

想象一下，如果你还需要加上日文和蒙文，甚至更多的语言时，那是多么的痛苦。

如果使用 CSS 逻辑属性的话，这一切都变得是那么的容易：

```CSS
.card {
    inline-size: 360px;
    border-inline-start: 6px solid #09f;
    padding-block: 1rem;
    padding-inline-start: 2rem;
    padding-inline-end: 1rem;
 }
​
.card img {
    margin-inline-end: 2rem;
}
```

> Demo 地址：<https://codepen.io/airen/full/qBQxdLB>

有了这些基础，你就可以使用 CSS 逻辑属性来开发一个多语言的 Web 应用或网站，例如 [@Alaa Abd El-Rahim 在 Codepen 分享的一个示例](https://codepen.io/Alaa_AbdElrahim/full/XWaBBoq)。我在他的基础上 Fork 了一份，并在该示例的“英文”、“日文”、“阿拉伯文”的基础上新增了“中文”。这样就构建了一个四国语言的 Web 页面：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d5de26d2aee433092b65faae239a683~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYJoGQd> （详细解读可以阅读《[Web 中的向左向右：Web 布局中 LTR 切换到 RTL 常见错误](https://juejin.cn/book/7161370789680250917/section/7161625415935590436)》一文！）

示例代码就不在这里展示了，感兴趣的同学可以查看 Demo 的源码！

## 小结

如果在构建 Web 应用或页面时，面对的仅是单一语言，那么使用 CSS 物理属性并无大碍，而且也不会影响整个 Web 应用的布局。你使用 CSS 逻辑属性来替代物理属性也可以实现同等效果。如果你构建的 Web 应用是要处理多语言，那么物理属性带来的局限性就非常的明显，而且也会造成阅读上的不便，这个时候 CSS 逻辑属性和逻辑值起到的作用就非常大。

逻辑属性和逻辑值的主要优点是，它是一组用于根据文本流方向动态处理布局的属性和值，它们使得在不同的书写模式之间切换更加容易，并且它们是相对于流而不是固定方向来工作的，这使得布局更具灵活性和可重用性。但它们也可能会给开发者带来一定的学习曲线和混淆。

总之，CSS 逻辑属性和逻辑值是一种强大的工具，可以帮助开发者轻松处理国际化网站的布局，并保持代码的简洁和易读性。