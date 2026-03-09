![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7ae4f2dcbd14aae8183f2cc7410f60b~tplv-k3u1fbpfcp-zoom-1.image)

首字下沉最早出现在印刷媒体上，例如报纸、杂志、小说、教科书等。它可以为章节或段落的第一个字母增添一些时尚感。这些下沉字母能够吸引读者的注意力，并且还可以使用非常华丽的字体，因为它只会对一串文字中的一个字母进行处理，不会影响到文本的可读性。

随着时间的推移，首字下沉的排版技术不再局限于印刷媒体上，在 Web 设计中也可以看到首字下沉的排版效果。Web 中的首字下沉的排版效果可以创造出独特而优美的视觉效果，而且不会影响到文章的阅读流畅性。不过，使用首字下沉可能会对页面布局产生影响，因为文本流动时需要考虑元素之间的相互作用。如果 Web 开发者没有处理好首字下沉的位置和对页面元素的影响，可能会导致 Web 页面混乱或难以阅读。

而且，在数字化时代，对首字下沉进行样式化设置一直是个难题。庆幸的是，我们可以利用现代 CSS 中的一些新特性来处理 Web 页面上首字下沉的效果。这些新的 CSS 特性使我们的设计更加独特，并为你的用户提供有用的视觉提示。其中一种较新的技术就是使用 CSS 中的 `::first-letter` 伪元素选择器和 `initial-letter` 特性来创建首字下沉的布局效果。

接下来，我们来看看如何使用 CSS 的新特性 `initial-letter` 实现首字下沉布局效果以及需要注意的相关细节？

## 首字下沉的简介

首字下沉也被称为下沉字母，它是一种特殊类型的首字母，即在一段文本的开头出现的大号字母，有时也比周围的字体更为华丽。在几个世纪以前，这些下沉字母（初始字母）通常是经过精心绘制的，但即使只是放大同一字体或样式中的第一个字母，这种做法至今仍然在使用。它通常表示着一个新的章节、文章或段落的开始。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a2e8af1f75748b389d69fe44de3228a~tplv-k3u1fbpfcp-zoom-1.image)

随着活字印刷技术逐渐取代手写书稿，人们通常会在段落开头留下一个空格，以便于印刷完成后手绘大写字母。有趣的是，这种缩进在手绘大写字母的做法被淘汰后仍然保留着，受到了排版机速度越来越快的影响，插图师跟不上生产速度了。

在 Web 中，有人可能会认为这种神秘的做法可能没有用武之地。手持屏幕的读者和纸质读者的阅读习惯有所不同，而更大、更图形化的元素可以为读者提供强烈的视觉提示，表明一个新章节的开始，无需使用额外的元素和间距。事实上并非如此，这种古老的排版技术在 Web 排版中随处可见。

在 Web 中，我们使用下沉字母出现类似的原因：既是 Web 设计的点缀，也是视觉暗示，吸引读者的眼球注视到重要的文字。

## 首字下沉的类型

首字下沉（**Drop Caps**）指的是在段落的开头使用一个大号的字母来引起读者的注意，是一种常见的印刷排版技术。这个字母通常比周围的文本更大，有时会突破文本边界而越到下一行。这种排版技术会根据不同的排版效果有不同的称谓，所以它有时候也称为“下沉首字母”（Drop Initial）、“凹陷首字母”（Sunken Initial）或“凸起首字母”（Raised Initial）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11d3a8bdb41f452dbee66ff319d0132b~tplv-k3u1fbpfcp-zoom-1.image)

### 下沉首字母

下沉首字母（Drop Initial）是段落开头使用的略大于常规字体的字母，其基线至少比段落的第一条基线低一行。下沉首字母的大小通常根据其占据的行数来表示，两至三行的下沉首字母是非常常见的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c13df0c602b486191feb7d83db092cc~tplv-k3u1fbpfcp-zoom-1.image)

一个下沉首字母的确切大小和位置取决于其字形的对齐方式。下沉首字母的参考点必须与正文中的参考点精确定位对齐，而且其对齐约束取决于书写系统。

在西方字符系统中，顶部参考点是首字母和第一行文本的大写字母高度（cap-height）。底部参考点是首字母的字母基线（baseline）和第 `N` 行文本的基线（baseline）。下图显示了一个简单的两行首字下沉式，标出了相关的参考线。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dfd606c7bbc4325b4fd9575b25453ab~tplv-k3u1fbpfcp-zoom-1.image)

在汉字衍生的书写系统中，下沉首字从第一行字形的块开始边缘（`block-start`）延伸到第 `N` 行字形的块结束边缘（`block-end`）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b12f44657e14cb0989b5d2df45ed26b~tplv-k3u1fbpfcp-zoom-1.image)

在某些印度书写系统中，顶部对齐点是悬挂基线（Hanging Baseline），底部对齐点是文本后缘（text-after-edge）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c817f6806aa54614af1107d6f1911423~tplv-k3u1fbpfcp-zoom-1.image)

### 凹陷首字母

凹陷首字母不与文本的第一行对齐。下陷的首字母(或“下陷帽”)既下沉到第一个基线以下，又延伸到第一行文本以上。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fd1a18eb2914d9e8c8992887a7b11b4~tplv-k3u1fbpfcp-zoom-1.image)

### 凸起式首字母

凸起式首字母（通常称为“凸起式大写字母”或“窄缝式大写字母”）“上浮”至第一行正文基线。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/233610bc8644409e95fa8771c70ee17f~tplv-k3u1fbpfcp-zoom-1.image)

使用凸起式首字母的一个优点是，它比简单地增加第一个字母的字号更加美观。段落中其余行的行距不会改变，但可以在大字母的底部保留文本。如果定义凸起式首字母的大小为一行的整数倍，隐式基线网格可以得到保留。

## 选择首字母

一般来说，首字母通常是一个单独的字母，尽管它们可能包括标点符号或一系列被用户视为单个排版元素的字符。在 CSS 中，你需要一个元素或类来用作目标，然后使用 CSS 的伪元素 `::first-letter` (类似于伪元素 `::before` 或 `::after`) 来选择中首字母。即 `::first-letter` 伪元素可以使元素的第一个字母变成类似一个独立的元素，这样你就可以给其添加 CSS 规则，来样式化首字母。这样就不需要在页面中添加任何额外的标记。

以下是一个简单的示例，演示如何样式化第一个段落或文章元素中的首字母：

```HTML
<p>Lorem ipsum dolor sit amet...</p>
<p>"Lorem ipsum dolor sit amet...</p>
```

```CSS
p::first-letter {
    color: hotpink;
    padding: 0 .3rem;
    margin: 0 .3rem 0 0;
    border: 2px solid;
    border-radius: 8px;
    font-family: “IBM Plex Mono”, monospace;
}
```

使用上述代码，我们可以得到如下效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8df3ff75982b4d07a623dbf8bc37e2cd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQaora>

请注意，由于 `::first-letter` 选择第一个字母之前或之后的标点符号，因此当使用 `::first-letter` 时，这些字符包含在首字母中，例如上面示例中第二个段落 `<p>` ，首字母 `L` 前面带有双引号 `"L`。

不过，这里也存在一个问题，看看当我们使用更大的字号时会发生什么，这通常是一个典型的下沉字母的主要特征之一：

```CSS
p::first-letter {
    color: hotpink;
    padding: 0 .3rem;
    margin: 0 .3rem 0 0;
    border: 2px solid;
    border-radius: 8px;
    font-family: "IBM Plex Mono", monospace;
  
    font-size: 4rem;
    line-height: 1;
}
```

使用上述代码，我们会得到以下效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/717f06ac8f3d47b7acfaeae9e462dd7a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGLrZP>

正如你所看到的，这样做并没有实现首字母下沉的排版效果。

## 旧的解决方案

前面的示例我们并没有让首字母真的下沉。因此，可以使用老式的浮动来解决这个问题：

```CSS
p::first-letter {
    color: hotpink;
    padding: 0 .3rem;
    margin: 0 .3rem 0 0;
    border: 2px solid;
    border-radius: 8px;
    font-family: "IBM Plex Mono", monospace;
​
    font-size: 4rem;
    float: left;
    line-height: 1;
}
```

在上面的 CSS 代码中，我们使用了 `float:left` 将首字母从其余文本中悬浮出来，从而使下沉字母效果更加明显。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61e3990e1ba54829b4deb6871a3a9b02~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQwzaq>

事实上，即使是使用浮动方式，我们也可以做得更好一些。那就是使用 CSS 的新单位，例如 `lh` （一个相对于 `line-height` 计算的 CSS 单位）:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4afd4733cf64a5dba09f07243fc355d~tplv-k3u1fbpfcp-zoom-1.image)

换句话说，使用 CSS 的 `lh` 单位，可以让首字母下沉的样式更美观一些：

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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79208191cab24912b9336f04268a461a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOgLgv>

## 新的解决方案

[CSS 内联布局模块 Level 3](https://www.w3.org/TR/css-inline-3/)（CSS Inline Layout Module Level 3）提供的 `initial-letter 属性`允许你更精细化的控制首字母下沉的样式。它可以指定下沉首字母、凹陷首字母和凸起首字母的大小和下沉行数。

例如，以下代码可以使每段落开头的首字母下沉两行：

```CSS
p::first-letter { 
    initial-letter: 2; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a5ee19bc53e4ff7b22aa32c78c23987~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQrLMo>

除此之外，你还可以给 `initial-letter` 属性设置两个参数值，例如：

```CSS
p::first-letter {
    initial-letter: 3.5  3;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32368c9c2a0c490fb03a7a63d8bcdfc3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLQajPg>

`initial-letter` 属性的：

-   第一个参数定义字母的大小及其所占据的行数。字母将按其宽高比例进行缩放。不能使用负数，但可以使用小数。
-   第二个参数定义字母下沉的量。它可以被视为字母的偏移量。第二个值是可选的，不能为负数。 如果不存在，则假定其值为向下取整的值，约为最接近的整数的数字。这相当于使用 `drop` 关键字。 第二个参数值还可以关键词值 `raise`，该值等同于下沉量为 `1`。

你可以在下面的 Demo 中尝试修改 `initial-letter` 的值，以查看它们如何影响首字下沉字体的样式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3ac18b31af04a9595663ddbe9d3a5c1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzjGQm>

结合 `::first-line`，你可以获得类似以下样式：

```CSS
p::first-line {
    font-variant: small-caps;
    font-weight: bold;
    font-size: 1.25rem;
}
​
p::first-letter {
    font-family: "Merriweather", serif;
    initial-letter: 3.5 3;
    font-weight: bold;
    line-height: 1;
    margin-right: 1rem;
    color: #3b5bdb;
    text-shadow: 0.25rem 0.25rem #be4bdb;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c445244b338427dbfe089cb3f28b401~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQaYoy>

我们还可以在 `initial-letter` 属性中调整第二个值（可选值），指示浏览器放置首字母大写字母的位置。可以实现“凸起和凹陷的首字母”下沉效果：

```CSS
.intro::first-letter {
    initial-letter: 3; 
}
​
.raised-cap::first-letter {
    initial-letter: 3 1; 
}
​
.sunken-cap::first-letter {
    initial-letter: 3 2; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9a689a6c7c74155963620087f0b1184~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQEVOe>

## CSS 的 initial-letter 属性

正如前面示例所示，CSS 的 `initial-letter` 属性将为首字下沉字体样式设置提供更简便的解决方案。它可以使用以下几个值：

```
initial-letter: 
    normal | 
    <number [1,∞]> <integer [1,∞]> | 
    <number [1,∞]> && [ drop | raise ]?
```

具体值的含义如下：

-   **`normal`** ：没有特殊的首字母效果，文本的表现方式和默认完全一致
-   **`<number [1,∞]>`** ：此第一个参数是指首字母占据的行数。少于 `1` 的值是无效的
-   **`<integer [1,∞]>`** ：此可选的第二个参数是指首字母所下沉的行数。`1` 表示凸起式首字母；大于 `1` 表示下沉式首字母。少于 `1` 的值是无效的
-   **`raise`** ：等同于指定下沉行数为 `1`
-   **`drop`** ：计算的首字母下沉行数减去到最近正整数。如果省略了首字母下沉数值则默认为 `drop`。

除 `normal` 外的值会使受影响的盒子成为首字母盒子，这是具有特殊布局行为的内联级别盒子。

例如：

```CSS
p::first-letter {
    initial-letter: 3
}
​
p::first-letter {
    initial-letter: 3 3;
}
​
p::first-letter {
    initial-letter: 3 drop;
}
​
p::first-letter {
    initial-letter: drop 3;
}
```

上面代码表示首字母下沉所占据高度为 `3` 行，同时也下沉 `3` 行：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a97d5c5b8a4b98b3dec916bacef249~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQEjea>

```CSS
p::first-letter {
    initial-letter: 3 2
}
```

上面代码创建一个凹陷首字母，高占 `3` 行，下沉 `2` 行：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/222a7e7c4707436098c0415e3a444518~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/VwVKdZJ>

```CSS
p::first-letter {
    initial-letter: 3 1;
}
​
p::first-letter {
    initial-letter: 3 raise;
}
​
p::first-letter {
    initial-letter: raise 3;
}
```

上面代码将创建一个凸起式首字母，高度为 `3` 行，下沉为 `1` 行：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5006521d5e90496b946e070b3686a533~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEmpRGx>

在使用 `initial-letter` 属性时，首字母的大小不必是行数的整数倍，它可以是任意小数，例如 `2.5` ：

```CSS
p::first-letter {
    initial-letter: 2.5 3;
}
```

在这种情况下，仅顶部对齐：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cd88aa4e97f416a85866751c0af0b4e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQEKbp>

结合其他 CSS 属性，`initial-letter` 可以用于创建“相邻的首字母”，其中首字母与文本相邻：

```CSS
p::first-letter {
    initial-letter: 3;
    width: 5em;
    text-align: right;
    margin-left: -.7em;
}
​
p {
    padding-left: 5em;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4db6d839a9949f2b1c42865928c8e23~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqGJpW>

你还可以将 `initial-letter` 属性与其他 CSS 属性组合在一起使用，制作出不同的首字下沉的效果。比如下面这个示例，使用 `border` 为其添加一个边框：

```CSS
p::first-letter {
    initial-letter: 3.5 drop;
    border: 0.25rem dashed #be4bdb;
    padding: 0.5rem;
    border-radius: 5px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3233c937162404384ec8833232f6d92~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzjXVq>

请注意，示例中使用的 `drop` 关键字，如果省略，则将作为默认值等于 `3` 。

你也可以像下面这样，为首字母添加一些阴影或一些背景来增添效果：

```CSS
p::first-line {
    font-variant: small-caps;
    font-weight: bold;
    font-size: 1.25rem;
}
  
p:first-letter {
    initial-letter: 3.5 3;
    margin-right: 1rem;
    background: #be4bdb;
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 0.5rem 0.5rem 0 #3b5bdb;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43e4b92fcd7a4b13b6f658ea950bfb29~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEmpRRm>

或者使用 `background-clip` 给首字母添加渐变效果：

```CSS
p::first-letter {
    background: linear-gradient(to bottom right,#1f005c,#5b0060,#870160,#ac255e,#ca485c,#e16b5c,#f39060,#ffb56b);
    initial-letter: 3.5 3;
    font-weight: bold;
    line-height: 1;
    margin-right: 1rem;
    color: transparent;
    -webkit-background-clip: text;
    padding: 0.5rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f36a9a110dd24a18a3cb508d857d78d3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGQwKxY>

你甚至还可以给首字母运用[彩色字体](https://juejin.cn/book/7223230325122400288/section/7247046282135470139)，使其更具艺术创意：

```CSS
@font-face {
    font-family: 'Rocher Color';
    src: url(https://assets.codepen.io/9632/RocherColorGX.woff2);
}


p::first-line {
    font-variant: small-caps;
    font-weight: bold;
    font-size: 1.25rem;
}

p::first-letter {
    font-family: 'Rocher Color';
    color: hsl(20 94% 51%);
    initial-letter: 3.5 3;
    font-weight: bold;
    line-height: 1;
    margin-right: 1rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe2a360cc5c541908714a1c1a8f1562a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOQMKQK>

这里所展示的仅仅是首字下沉的部分效果，你可以根据自己的需求创造出更具创意的首字下沉的效果。

## initial-letter 的适用性

为了使 Web 开发者更能掌控可以将哪些字符样式化为首字母并允许多个字符首字母的可能性（例如用于第一单词或短语的样式），`initial-letter` 属性不仅适用于 CSS 定义的 `::first-letter` 伪元素，也适用于内部定位的 `::marker` 伪元素以及位于第一行开头的内联级别盒子。具体来说，`initial-letter` 适用于任何内联级别盒子，包括任何这样的 `::first-letter` 或 `::marker`盒子。该盒子是其父盒子的第一个子盒子，且祖先（如果有）是其包含块的后代的第一个子级内联盒子，其具有计算出的 `normal` 初始字母值。

例如，以下示例中的 `<span>`、`<em>` 和 `<b>` 元素都是 `<p>` 的第一个内联级别的后代，但 `<strong>` 元素不是：

```HTML
<p><span><em><b>This</b> phrase</em> is styled<strong>specially</strong>.</span> …</p>
```

如果应用以下规则：

```CSS
em { 
    initial-letter: 2; 
}
​
b，strong { 
    initial-letter: 3; 
}
```

`initial-letter` 属性只会影响 `<em>` 元素，而 `<b>` 元素会被忽略，因为它有一个已经被样式化为首字母的祖先元素；而 `<strong>` 元素样式的忽略，则因为它是一个次级兄弟元素 *。* 所以，你看到的效果可能像下图这样：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a52fc9b341e8400fb4fbf2a6f92dfa14~tplv-k3u1fbpfcp-zoom-1.image)

注意：`initial-letter` 属性无法应用于其 `float` 不是 `none` 或 `position` 不是 `static` 的任何元素，因为这些值会导致其 `display` 的计算值为 `block` 。

## initial-letter 降级处理

CSS 的 `initial-letter` 还是一个较新的特性，你在 Chrome 、Safari 和 Edge 等主流浏览器上都能看到其效果，但在 Firefox 上还未得到支持。所以，在使用 `initial-letter` 设置首字母下沉的效果时，还是需要对其做一些降级处理。需要在不支持的浏览器上采用旧的解决方案（浮动的方案），在支持的浏览器上采用新的方案（`initial-letter` 方案）。我们可以使用 `@supports` 来相关的检测：

```CSS
/* 不支持 initial-letter 采用旧的方案 */
@supports not (initial-letter: 2){
    p:first-of-type::first-letter {
        font-family: Georgia, serif;
        float: left;
        font-size: 7.125em;
        font-weight: bold;
        line-height: 0.65;
        margin: 0;
        padding: 0.05em 0.1em 0 0;
    }
}
​
/* 支持 initial-letter 采用新的方案 */
@supports (initial-letter: 2) or (-webkit-initial-letter: 2) {
    p:first-of-type::first-letter {
        -webkit-initial-letter: 4;
        initial-letter: 4;
        font-size: inherit;
        line-height: inherit;
        margin: 0;
        padding: 0 0.25em 0 0;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e88cfa24665a4c64b3ad478f264805ac~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQrjbm>

注意，在 Safari 中，还需要使用前缀 `-webkit` 才能让 `initial-letter` 生效，即 `-webkit-initial-letter` 。

## 小结

CSS 的 `initial-letter` 属性可用于将一个段落的首字母进行修饰，实现首字下沉等特殊效果。甚至在未来，你还可以使用 `initial-letter-align` （有助于非罗马字母的排版）和 `initial-letter-wrap` （允许更紧密地环绕文本）等属性，更好的控制首字所占用的大小、对齐方式等。

在实现过程中，需要注意 `initial-letter` 所得到的效果并不适用于所有浏览器，使用前应仔细考虑应用场景和目标用户使用浏览器等因素。同时，由于不同字体的字形和字符编码的不同，可能对首字的下沉效果产生一定影响，需要进行适当调整。但是，`initial-letter` 属性提供了一种简单便捷的方式，可以帮助开发者快速实现出色的排版效果，也为用户带来更为舒适的阅读体验。

课程中所演示的示例是 `initial-letter` 非常常见的功能，但请想象一下，它将开启我们使用装饰性排版的大门！原则上，我们可以自由地将许多熟悉的属性和 `initial-letter` 结合使用，包括：

-   所有熟悉的字体属性
-   颜色和不透明度
-   文本阴影和其他文本装饰
-   变换属性
-   再来一些 `background-clip` 、混合模式、滤镜等的效果