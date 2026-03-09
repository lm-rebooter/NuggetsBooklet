每位 Web 开发者都知道如何设置文本颜色，对吧？这是我们开始学习 CSS 时做的第一件事之一。我们可以使用 CSS 的 `color` 属性给文本设置颜色，例如 `color: blue` 或 `color: purple` ，这样在浏览器上呈现给用户的文本颜色将会是蓝色或紫色，且是一种纯颜色文本。但是，如果要给每个字形运用多种颜色，甚至是渐变色，那应该怎么办呢？

庆幸的是，随着 OpenType 彩色字体的出现，你可以很容易做到这一点。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a7a43486343423889e1d3e6708f53d0~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，它可能看起来像是在设计软件中设计的图片，但实际上你正在使用浏览器查看实时的、可编辑的、可搜索的文本。这些就是彩色字体，它使得每个字形具有多种颜色，而不是通过 CSS 控制它们的颜色，从而展示出相当惊人的效果。

也就是说，彩色字体提供了一种不牺牲使用纯文本所带来的诸多优势的情况下增加设计丰富度的方式，同时它也开辟了全新的排版创意。这也意味着彩色字体可以以一种新颖、有趣、具有表现力的方式呈现文本，让 Web 设计师有更多创意自由度来表达信息和情感。

随着新增的 CSS 特性（包括 `font-palette` 属性和 `@font-palette-values` 规则）可用来控制彩色字体的颜色调色板以及 COLR 字体格式等。彩色字体已经成为许多 Web 设计师和开发人员的首选，因为它们不仅在 Web 和APP 开发中提供更多的视觉创造空间，而且能够有效改变文字的情感和表达。

换句话说，现在是深入研究并尝试使用彩色字体的时候了。在这节课中，将和大家一起深入探讨了彩色字体的操作方式以及如何在 Web 设计中利用和自定义它们。

## 为什么要使用彩色字体？

在 Web 上，文本通常以 CSS 中的 `color` 属性值来指定颜色。字体本身并不定义任何特定的颜色，它只描述字体外形的特征。这本是件好事。CSS 可以让 Web 开发者更灵活的为文本指定颜色。然而，有时一个字形包含多个颜色，它们是有意义的。例如，Web 设计师想在某些特别的专题活动中使用下图的字体作为标题展示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a3f07cce44a45f8a0b3c3bf0afeae53~tplv-k3u1fbpfcp-zoom-1.image)

如果仅以当前文本颜色简单绘制，则无法传达相同的含义。如果不这么做，则很多时候需要将其制作成图片的方式，然后在 Web 上呈现给用户。如此一来，你可能会遇到这几个问题：不同屏幕下的适配，要是只做一种尺寸的图片，放大或缩小后的效果都不太好。直接做成 SVG？好像不能复制到文本编辑里之类。也就是说，这种做法使得这些“文本”本身失去了真实文字该有的功能。

此时，彩色字体的好处就显现出来了。既能达到视觉效果上的要求，还拥有常规文字的功能，能够复制，能够粘贴，还可以被屏幕阅读器阅读，丝毫不妨碍常规操作。

## 什么是彩色字体？

在我们所熟知的传统字体中，字体文件本身仅仅描述了字体的外形特征，这些特征一般包含着矢量的轮廓数据或是单色调位图数据。在浏览器渲染单色字体时，渲染引擎使用设定的字体颜色填充字形区域，最后绘制出对应文字及其设定的颜色。而彩色字体中，不仅仅存储了字体的外形特征，还保存了颜色信息，甚至还能在字体中提供不同的配色，增加了灵活性的同时也更具丰富的外形细节。

简单地说，彩色字体是一种字体，包含多种颜色、阴影、纹理和透明度。它们可以在排版中呈现更加复杂和具有视觉吸引力的效果，为平面设计带来了新的创意和表现力。彩色字体可以包含矢量形状、位图图像或两者的组合，全部存储在字体文件中。彩色字体被认为是平面设计中的一大趋势，尤其是 COLRv1 的到来。

如今，对于大多数用户来说，表情符号是他们看到的唯一彩色字体。例如在 Windows 10 上，[Segoe UI Emoji ](https://en.wikipedia.org/wiki/Segoe)就属于一款彩色字体：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcc9c12b7b3b47a7b6613da68bf4670b~tplv-k3u1fbpfcp-zoom-1.image)

通常彩色字体还会包含一些兼容信息，这些兼容信息包含 [Unicode](https://apps.timwhitlock.info/emoji/tables/unicode) 编码的单色字形数据，使得在一些不支持彩色字体的平台上，仍然能够像渲染普通字体一样将彩色字体的字形渲染出来，达到一种向后兼容的效果。

## 彩色字体的类型和实现标准

在彩色字体设计的发展历史上，由于各家有自己的实现方案，导致在 OpenType 字体中嵌入的色彩信息标准也不尽相同。在[最新的 OpenType 标准中](https://docs.microsoft.com/en-us/typography/opentype/spec/otff)，就有多达四种彩色字体数据的描述格式。

-   SVG，由 Adobe 和 Mozilla 主导的矢量字体标准。其中不仅包含了标准的 TrueType 或 CFF 字形信息，还包含了可选的 SVG 数据，允许为字体定义颜色、渐变甚至是动画效果。SVG 标准中的配色信息也将存储在 CPAL 中。
-   COLR + CPAL，由微软主导的矢量字体标准。其中包含 COLR 即字形图层数据和 CPAL 配色信息表，对其的支持集成在 Windows 8.1 及之后的版本中。
-   CBDT + CBLC，由 Google 主导的位图字体标准。其中包含了 CBDT 彩色外形位图数据和 CBLC 位图定位数据，对其的支持集成在 Android 中。
-   SBIX，由 Apple 主导的位图字体标准。SBIX 即标准位图图像表其中包含了 PNG、JPEG 或 TIFF 的图片信息，对其的支持集成在 macOS 和 iOS 中。

这也造成不同的浏览器采用了不同的标准：

|                          | **Microsoft Edge** | **Chrome** | **Firefox** | **Safari** |
| ------------------------ | ------------------ | ---------- | ----------- | ---------- |
| **SVG(SVG-in-Opentype)** | ✔                  | ✘          | ✔           | ✘          |
| **COLR + CPAL**          | ✔                  | ✔          | ✔           | ✔          |
| **CBDT + CBLC**          | ✔                  | ✔          | ✘           | ✘          |
| **SBIX**                 | ✔                  | ✔          | ✘           | ✔          |

由于这些格式的差异和不兼容性，设计行业正在经历一段过渡期，在这个过渡期中，可能需要几种彩色字体格式来确保跨多个操作系统、浏览器和应用程序的兼容性。

> 有关于这方面更详细的讨论就不在这里阐述了，如果你对这方面的历史故事感兴趣的话，可以移步阅读 @Roel Nieskens 的博文《[Colorful typography on the web: get ready for multicolor fonts](https://pixelambacht.nl/2014/multicolor-fonts/)》。

就彩色字体而言，到目前为止主要分为三种类型：**位图**、**SVG** 和 **COLR** 彩色字体。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e22ea42822c34d818f15a8bec67453ae~tplv-k3u1fbpfcp-zoom-1.image)

其中：

-   位图彩色字体是使用像素绘制的，可以创造出任何你想要的形状。但它的缺点是这些字体的颜色无法更改，也不能放大到大尺寸，不然会产生失真的现象（像素虚化），另外其字体文件尺寸较大
-   SVG 彩色字体是基于向量的，因此可以缩放，并且不会丢失质量（不会像位图彩色字体那样，放大时失真）。但它的缺点是颜色无法更改，并且不能制作成可变字体
-   COLR 字体结合了位图和 SVG 彩色字体的优点，它是可变的，而且颜色也可以调整

### COLRv0 和 COLRv1

所有浏览器都支持 COLR 字体，到目前为止，COLR 字体分为 COLRv0 和 COLRv1 两种：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c0790dcfd164b9abf4430de13faef9b~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，COLRv0 仅支持纯色以及只有一个透明通道。虽然支持字体变化是一个很大的优势，但视觉效果方面的范围较小，限制了其潜力。

COLRv1 则有所不同，它允许你使用渐变（例如线性、径向或圆锥形渐变）、混合模式（例如屏幕、正片叠底等）和合成等功能设计字体，而且还允许你使用其他绘制的形状（例如纹理）来填充字形。例如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/619df1d33bea44c59604d60b11194e4f~tplv-k3u1fbpfcp-zoom-1.image)

> 上图录自于：<https://www.underware.nl/COLRv1b/Pywu%C3%A4fkee_Metal+Umlauts>

### COLRv1 比 COLRv0 更好的地方

COLRv1 是 [OpenType 1.9 标准](https://docs.microsoft.com/en-us/typography/opentype/spec/)的一部分。虽然最初的 COLRv0 缺乏 OpenType-SVG 的许多创意可能性，但 COLRv1 却要比 OpenType-SVG 更胜一筹。正如排版专家 [@Roel Nieskins 所说](https://mobile.twitter.com/PixelAmbacht/status/1479401648883740681)：

> “我曾经说过 OpenType-SVG 格式是最好的格式，因为它提供了最多的多用途性，直到我意识到这对于像文本渲染这样的低水平工作来说太复杂了。它在字体渲染级别上实现了SVG 的基本子集，但它与其他字体技术（提示、可变轴等）不兼容，并且实现起来很麻烦。所以，我转向了COLR。COLR 基本上重新使用了 OpenType 字体已经拥有的一切。它“仅”添加了分层和更改每个图层颜色的可能性。简单但有效。”

COLRv1 与[可变字体轴](https://juejin.cn/book/7223230325122400288/section/7246384512219742266)完全兼容，已经有许多变量 COLR 字体的示例，例如 [Merit Badge](https://djr.com/notes/merit-badge-font-of-the-month/)、[Plakato Color](https://underware.nl/fonts/plakato/features/color/#feature_info) 和 [Rocher Color](https://www.harbortype.com/rocher-color-making-a-variable-color-font/)。

简单地说，COLRv1 是一种新的字体格式，支持多种不同的颜色方式，但这些方式都存在不同的权衡。我们希望COLRv1 的图形能力和紧凑文件的组合将使其成为许多彩色字体应用实例的不错选择。COLRv1 增加了渐变、合成和混合，并改进了内部形状重用以获得更紧凑的文件。

COLRv1 的表现能力与[ SVG Native](https://svgwg.org/specs/svg-native/) 加上[混合和合成](https://www.w3.org/TR/compositing-1/)功能相当。它有四种类型的颜色填充: **纯色**、**线性渐变**、**径向渐变**和**锥形渐变**。COLRv1 允许您使用完整的平移、旋转、切变和比例变换重新定位和转换字形元素。此外，它还支持字体变体，并重用字体中现有的形状定义格式。

以水晶球表情符号为例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbb399dd8ac1479293739821337c718f~tplv-k3u1fbpfcp-zoom-1.image)

星形的亮点形状相同但大小不同，这意味着只需一个形状即可在文件内重新定位和重复使用，而无需重复编码每个形状以用于每个字形。该格式允许你在新的字形内重复使用全部字形，而无需为每个字形冗余地编码相同的形状。想象一下一个有花卉装饰的装饰性彩色字体，其中只需引用现有的彩色字形即可将同一花朵形状放置在不同的字母上。对于 Web 字体用例，COLRv1 在 `woff2` 下压缩效果良好。例如，使用 COLRv1 构建的 Twemoji 测试版本在解压后约为`1.2MB`，但在 `woff2` 格式下约为 `0.6MB`。完整的 Noto Emoji Glyp 字形集从位图版本的 `9MB` 缩减到了COLRv1+woff2 格式下的 `1.85MB`。

尽管如此，让我们更深入地了解其关键属性以及它们如何为用户和字体创建者带来价值。

-   预定义和可自定义调色板：如前所述，COLRv1 彩色字体具有内置的颜色调色板，我们可以调整它们以匹配所需的项目外观和感觉。这使得设计师对其文本的整体外观有更多的控制。
-   高保真度渲染：COLRv1 使用基于矢量的光栅化来提供高质量的渲染。这确保字形在所有尺寸下保持锐利和清晰。
-   轻量级：与 COLRv0 字体不同，COLRv1 字体更加轻量级，不会膨胀文件大小。这使得它们非常适合在需要考虑文件大小的 Web 和其他情境中使用。

### COLRv1 彩色字体是如何工作的？

在 COLR 字体文件中，包含了各种轮廓形状，每个形状分配有颜色、渐变或混合模式。在导出为字体时，这些层被组合为一个单独的字符，可以通过键盘进行访问。因为颜色是从最高层的“颜色表”为形状分配的，不像 SVG 字体那样嵌入到它们内部，所以可以通过代码更改颜色值，并使用字体变量转换形状。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f9f2821cbec45f7bf942ced52d1549d~tplv-k3u1fbpfcp-zoom-1.image)

### 如何自定义 COLRv1 ？

目前没有桌面应用程序支持 COLRv1 字体，而只有少数应用程序支持 COLRv0。但是，在 Web 上，COLR 规范运行良好。与其他彩色字体版本相比，COLR 字体的文件大小很小，通过 CSS，可以逐个颜色地调整颜色板。网页的进一步可能性提供了可变字体变化和动画的可能性。想要自己尝试一下吗？你可以在此处找到有关自定义颜色板的更多信息，以及有关可变动画的更多信息。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec29ecba52ba46b19bd18a2c1dfc1a2f~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，在图中示意的代码中，出现了几个你可能不太熟悉的 CSS 属性和 `@` 规则，例如 `base-palette` 、`override-colors` 和 `@font-palette-values` 等。在 CSS 中，我们可以通过这些属性和规则来使用彩色字体。

如果你现在不知道这些属性和规则如何使用，不用担心，稍后我们会详细介绍他们。

## 如何获取彩色字体？

彩色字体仍然很新颖，因此还没有发布大量的彩色字体，在现有的彩色字体中，有一些是免费的，也有一些是付费字体。

你可以在许多免费和付费字体资源网站上找到彩色字体。一些免费字体资源网站，例如 [DaFont](https://www.dafont.com/)、[Fontspace](https://www.fontspace.com/) 和[Google Fonts](https://fonts.google.com/) 等，提供大量的可下载字体。此外，一些字体设计师也会在个人网站或社交媒体上分享自己创作的彩色字体。

你知道最受欢迎的免费彩色字体之一是 [Gilbert 字体](https://www.typewithpride.com/)吗？它由 Gilbert Baker 设计。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0fcfbf2089b499b9cac9310352879ee~tplv-k3u1fbpfcp-zoom-1.image)

现在为了确保你可以在 Web 上玩彩色字体，你可以通过 Google Fonts 来下载相应的彩色字体。[Google Fonts 库提供了一系列彩色字体](https://fonts.google.com/?coloronly=true)，它们具有自己内置的颜色调色板，与 CSS 的颜色属性独立。可以在 Google Fonts 网站上勾选“仅显示彩色字体”复选框，以快速访问可用的彩色字体，或者查看此列表，其中列出了所有基于 COLRv1 的 Google 字体。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ce60cb2ef1a4ebd8052ae9e5c7b1594~tplv-k3u1fbpfcp-zoom-1.image)

就拿 `Bungee Spice` 为例，你只需在 Google Fonts 平台上，选中该字体：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa33336f3dce4e6cafb3bd0aea345ed2~tplv-k3u1fbpfcp-zoom-1.image)

然后在 `<head>` 或 CSS 文件中引入相应的字体文件：

```HTML
<html>
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap" rel="stylesheet">
    </head>
</html>
​
<!-- 或者 -->
<html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap');
        </style>
    </head>
</html>
```

接着将 `Bungee Spice` 字体运用到相应的元素上即可：

```CSS
h1 {
    font-family: 'Bungee Spice', cursive;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/232586a392174506830e271dd79de05e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQEoZv>

除此之外，你还可以在 Creative Market 获得彩色字体，[它被号称是世界上第一个提供彩色字体集的一个平台](https://creativemarket.com/fontself/collections/359610/Color-fonts-made-with-Fontself?u=fontself&utm_source=Twitter&utm_medium=CM+Social+Share&utm_campaign=User+Collection+Social+Share&utm_content=Color+fonts+made+with+Fontself)。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f55a4f09603a4ae49f3d0f5224799560~tplv-k3u1fbpfcp-zoom-1.image)

## 加载彩色字体

在 CSS 中，也是通过 `@font-face` 规则来加载彩色字体。正如前面示所示，你使用的是 Google Fonts 平台上提供的彩色字体，例如 `Bungee Spice` 字体，你只需要在浏览器的 URL 中输入该字体对应的链接地址：

```
https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap
```

你会发现，也是使用 `@font-face` 规则来引入彩色字体：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9587a931fa36492b80c2ca2574b7c8d2~tplv-k3u1fbpfcp-zoom-1.image)

但是你也会在有的地方，看到 `@font-face` 加载彩色字体是像下面这样：

```CSS
@font-face { 
    font-family: "Family Name"; 
    src: url("YourVariableFontName.woff2") format("woff2 supports variations"), 
        url("YourVariableFontName.woff2") format("woff2-variations"); 
    font-weight: [low] [high]; 
    font-stretch: [low]% [high]%; 
    font-style: oblique [low]deg [high]deg; 
} 
```

你可能已经注意到的第一个不同之处就是 `src`，`src` 指向了同一个字体文件，这主要是 `@font-face` 的语法规则做出了调整，只不过目前有些浏览器还没有跟进而以。这种语法相对来说更为灵活了，因为我们除了彩色字体之外，可能还会使用可变颜色字体。因此第一个入口使用 `woff2 supports variations` 的格式化（`format`）参数来指定支持两种（可变字体和可变颜色字体）字体。一旦浏览器理解了这种语法，它们就会停止解析 `src` 行。

而 `woff2-variations` 是加载可变字体的格式化方式，我们在上一节课《[20 | Web 上的可变字体](https://juejin.cn/book/7223230325122400288/section/7246384512219742266)》中有详细介绍过，这里不做重复性的阐述。

## CSS 如何控制彩色字体

正如前面示例所示，在 CSS 中，你可以将彩色字体分配给任何元素，就像使用常规字体一样。默认情况下，应用的字体将采用其默认调色板中的颜色。例如：

```CSS
h1 {
    font-family: 'Bungee Spice', cursive;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/795d7b9ce8364cddbaae87fd37c9cbd9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQEoZv>

彩色字体可以在其字体文件的 CPAL 表中定义一个或多个颜色调色板（拥有多种不同的配色方案）。那我们如何来设置字体的调色呢？CSS 提供了两种方法来实现这一点：

-   `font-palette` 属性允许选择字体中包含的多个不同调色板之一，或者强制不使用彩色字形
-   `@font-palette-values` 规则允许从调色板内覆盖一个或多个颜色，甚至创建完全不同的调色板

### 控制彩色字体调色板：font-palette 属性

许多彩色字体文件格式允许对字形内部的颜色进行参数化。在这些字体中，描述每个字形的几何形状时，颜色是通过索引引用的。这些索引在当前活动调色板中使用查找表来解析，该查找表存在于字体内。然而，许多字体包含多个调色板，每个调色板都包含一组由字体设计师选择的互补颜色，以提供令人愉悦的视觉效果。

此外，一些彩色字体文件格式提供常规的未着色字形轮廓以及着色版本。

我们可以通过 CSS 的 `font-palette` 属性来选择或者调整它的配色方案。CSS 的 `font-palette` 属性可接受的值主要有 `normal` 、`light` 、`dark` 和 `<palette-identifier>` ，其具体的含义是：

-   **`normal`** ：User-Agents 会尽可能地将彩色字体视为非彩色字体。特别是，用户代理会使用调色板，以获得最佳的默认阅读结果。用户代理在做出此决定时可能会考虑颜色属性的计算值。用户代理还可以构建和使用未在字体中定义的调色板。
-   **`light`** ：某些彩色字体格式包括元数据，标记某些调色板适用于浅色（接近白色）背景。此关键字会导致用户代理在字体文件中使用标记为这种方式的第一个可用调色板。如果字体文件格式没有考虑这些元数据，或字体中没有标记为这种方式的调色板，则此值将像普通一样运行。
-   **`dark`** ：某些彩色字体格式包括元数据，标记某些调色板适用于深色（接近黑色）背景。此关键字会导致用户代理在字体文件中使用标记为这种方式的第一个可用调色板。如果字体文件格式没有考虑这些元数据，或字体中没有标记为这种方式的调色板，则此值将像普通一样运行。
-   **`<palette-identifier>`** ： 此值标识要使用的 CSS 定义调色板。用户可以使用 `@font-palette-values` 规则定义调色板。如果没有适用的 `@font-palette-values` 规则存在，则此值将像 `normal` 一样运行。 `<palette-identifier>` 解析为 `<dashed-ident>`。

以 `Rocher Color` 字体为例（[Henrique Beier 平台](https://www.harbortype.com/fonts/rocher-color/)提供的一个免费彩色字体，[可以点击这里获取字体文件](https://assets.codepen.io/9632/RocherColorGX.woff2)）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec5d403e210b478e89ffebe8c388c8e8~tplv-k3u1fbpfcp-zoom-1.image)

> URL：<https://www.harbortype.com/fonts/rocher-color/>

现在我们有了 `Rocher Color` 字体，但我们又如何确定字体是否提供备用调色板呢？有的时候，在提供字体平台上可以获知，但有的时候平台可能不会给你提供这方面的信息。如果没有，那么你可以使用一个名为 [Wakamai Fondue 在线工具](https://wakamaifondue.com/)，你只需要将彩色字体文件拖到该页面上，它将列出所有可用的颜色方案。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b068485bde74bdfa168631ed5a60050~tplv-k3u1fbpfcp-zoom-1.image)

从Wakamai Foundue上可以看出，该字体使用四种颜色，并带有 `11` 种不同的调色板选项。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f40f905a78aa46ddbfd948109f01ca08~tplv-k3u1fbpfcp-zoom-1.image)

使用 `base-palette: 0` 将选择默认颜色调色板（对于 `Rocher Color` 而言，这是橙色和棕色的阴影）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8de59035581647ff91809889f8b5d4d0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQMaew>

使用 `base-palette: 1` 将选择类型设计师定义的第一个可选调色板，以此类推。

为了使用不同的调色板，你必须使用 `@font-palette-value` 规则引用和关联它。在规则内，你可以使用 `base-palette` 属性分配调色板。该值是一个索引，从 `0` 开始（默认调色板）。 `Rocher Color`带有 `11` 个调色板，这意味着您可以在 `0 ~ 10`之间分配值。

```CSS
@font-palette-values --pink {
    font-family: "Rocher Color";
    base-palette: 1;
}
​
@font-palette-values --green {
    font-family: "Rocher Color";
    base-palette: 2;
}
​
@font-palette-values --gray {
    font-family: "Rocher Color";
    base-palette: 9;
}
​
@font-palette-values --purples {
    font-family: "Rocher Color";
    base-palette: 6;
}
​
@font-palette-values --mint {
    font-family: "Rocher Color";
    base-palette: 7;
}
​
h1 {
    font-palette: --pink;
}
​
h1 {
    font-palette: --green;
}
​
h1 {
    font-palette: --gray;
}
​
h1 {
    font-palette: --purples;
}
​
h1 {
    font-palette: --mint;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c47c4a424d3b4c6695a9ab2e5a8eba76~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKrgwjX>

注意，CSS 的 `@font-palette-values` 规则允许你从调色板内覆盖一个或多个颜色，甚至创建完全不同的调色板，稍后我们会详细介绍该规则。

我们需要知道的是，彩色字体的颜色并不是在所有背景上都是清晰可见的。在没有彩色字体的情况下，用于呈现文本的颜色完全由 Web 开发者使用 CSS 的 `color` 属性来控制，但是现在，因为字体可以在其内部定义颜色调色板，所以 Web 开发者来选择或创建可以在其上呈现并且可读的颜色调色板。在字体回退发生或用户已阻止某些字体加载时，这可能特别棘手。

例如，像 `Bradley Initials DJR Web` 这样的字体有一个额外的工具可以帮助解决此问题。字体可以指示其中某些调色板适用于浅色背景或适用于深色背景，并将这些调色板连接到 `font-palette`属性。你甚至不需要使用`@font-palette-values`！

因此，如果你想在深色背景上使用颜色调色板，则可以简单地说 `font-palette: dark`，如下所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35b909fe452a4d1fb9a715da700b96e6~tplv-k3u1fbpfcp-zoom-1.image)

同样的，对于浅色背景你可以使用 `font-palette: light`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5a6c35e0eeb4130b5bd11f579cff90d~tplv-k3u1fbpfcp-zoom-1.image)

由于 `font-palette` 属性对非彩色字体没有影响，因此可以将其与 `prefers-color-scheme` 媒体查询一起设置，如下所示：

```CSS
@media (prefers-color-scheme: dark) {
    :root {
        background: black;
        color: white;
        font-palette: dark;
    }
}
​
@media (prefers-color-scheme: light) {
    :root {
        background: wihte;
        color: black;
        font-palette: light;
    }
}
```

除此之外，你还可以在 `@font-palette-values` 规则块中使用 `override-colors` 来覆盖彩色字体中的颜色调色板。以便在暗黑或亮色模式下文本的呈现更清晰。例如：

```CSS
@font-palette-values --custom-palette {
    font-family: "Bungee Spice";
    override-colors: 0 hsl(0 55% 55%), 1 hsl(0 15% 15%);
}
​
@media (prefers-color-scheme: dark) {
    @font-palette-values --custom-palette {
        font-family: "Bungee Spice";
        override-colors: 0 hsl(0 65% 65%), 1 hsl(0 85% 85%);
    }
}
​
h1 {
    font-family: 'Bungee Spice', serif;
    font-palette: --custom-palette;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/515f21203cf44e8f9539ccf3372d04d5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYGvpX>

同样的，你也可以针对每个调色板颜色使用不同的背景颜色，以使彩色字体的呈现更加平衡。比如下面这个示例，请尝试拖动滑块，你将看到不同颜色下的彩色字体呈现效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/628c0d98b6ca4b13839abe111106b852~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dyQpozo>

### 用户自定义字体颜色调色板：@font-palette-values 规则

前面的示例我们多次看到了 `@font-palette-values` 规则。接下来，我们来详细介绍该规则。

`@font-palette-values` 规则定义了一个颜色调色板，并将该颜色调色板与特定字体关联起来。这使得 Web 开发者可以在彩色字体中选择任意颜色，而不仅仅是受限于字体文件中预先定义的调色板。此外，该规则与特定字体的关联使得调色板的名称在不同的字体中应用时可以产生不同的效果，从而在元素中使用多个字体时可以使用类似的颜色（即用于字体回退）。

`@font-palette-values` 规则表示字体中使用的颜色调色板。调色板由一组有序的颜色组成。使用 `@font-palette-values` 允许 Web 开发者引用存在于字体中的调色板，以及创建由作者定义的颜色填充的调色板。此外，它允许使用 Web 开发者描述的颜色来覆盖字体中调色板中的一组颜色。

调色板始终是完整的，这意味着无法描述一个存在丢失颜色的调色板。如果缺少颜色，它们将从由 `base-palette` 描述符标识的字体的调色板中获取。

`@font-palette-values` 规则的使用很简单，它由 `@font-palette-values` 后紧跟一描述符组成。它的语法如下：

```CSS
@font-palette-values <dashed-ident> {
    <declaration-list>
}
```

其中 `<dashed-ident>` 用来定义颜色调色板的名称，例如 `--gray` ；而 `<declaration-list>` 是一组描述符，它包括 `font-family` 、`base-palette` 和 `override-colors` 三个属性。例如：

```CSS
@font-palette-values --cooler {
    font-family: Bixa;
    base-palette: 1;
    override-colors:
        1 #7EB7E4;
}
```

其中 `base-palette` 和 `override-colors` 不是必须的。

在使用CSS `@font-palette-values` 规则选择调色板后，你可以使用 `font-palette` 属性应用它：

```CSS
.cooler {
    font-family: Bixa;
    font-palette: --cooler;
}
```

简单介绍一下 `@font-palette-values` 规则中的三个属性（`font-family` 、`base-palette` 和 `override-colors`）。先来看 `font-family` 。

### font-family 指定彩色字体名称

使用 `@font-palette-value` 规则，你可以创建一个新的字体调色板。你使用 `font-family` 属性引用要为其创建调色板的字体。简单地说，在 `@font-palette-value` 规则中的 `font-family` 有点类似于 `@font-face` 规则中的 `font-family` ，主要用来指定引用的彩色字体名称。

### base-palette 选择不同的调色板

对于一个彩色字体而言，它很可能有多种不同的调色板，比如前面示例所展示的 `Rocher Color` 字体，它就有 `11` 种不同颜色调色板。默认使用的是 `0` 编号调色板。如果你希望选择不同的调色板，可以使用 `@font-palette-values` 指令并指定 `base-palette` 属性。命名指令就像使用 CSS 自定义属性一样简单明了：

```CSS
@font-palette-value --rocher-color-0 {
    font-family: "Rocker Color";
    base-palette: 0;
}
​
@font-palette-value --rocher-color-1 {
    font-family: "Rocker Color";
    base-palette: 1;
}
​
@font-palette-value --rocher-color-2 {
    font-family: "Rocker Color";
    base-palette: 2;
}
​
@font-palette-value --rocher-color-3 {
    font-family: "Rocker Color";
    base-palette: 3;
}
​
@font-palette-value --rocher-color-4 {
    font-family: "Rocker Color";
    base-palette: 4;
}
​
@font-palette-value --rocher-color-5 {
    font-family: "Rocker Color";
    base-palette: 5;
}
​
@font-palette-value --rocher-color-6 {
    font-family: "Rocker Color";
    base-palette: 6;
}
​
@font-palette-value --rocher-color-7 {
    font-family: "Rocker Color";
    base-palette: 7;
}
​
@font-palette-value --rocher-color-8 {
    font-family: "Rocker Color";
    base-palette: 8;
}
​
@font-palette-value --rocher-color-9 {
    font-family: "Rocker Color";
    base-palette: 9;
}
​
@font-palette-value --rocher-color-10 {
    font-family: "Rocker Color";
    base-palette: 10;
}
```

要应用新的调色板值，只需将 `font-palette` 属性添加到元素中，并包含先前定义的指令：

```CSS
.rocher-color-9 {
    font-family: "Rocker Color";
    font-palette: --rocher-color-9;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71d16436e567466d8c563740bb493391~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzjwxx>

注意，`base-palette` 除了可以取整数值之外，还可以设置其值为 `light` 或 `dark` ：

-   `light` ：某些彩色字体格式包括元数据，将某些调色板标记为适用于浅色（接近白色）背景。此关键字标识文件中标记为此方式的第一个可用调色板。如果字体文件格式未考虑此元数据，或字体中没有任何调色板标记为此方式，则此值的行为为 `0`。
-   `dark` ：某些彩色字体格式包括元数据，将某些调色版标记为适用于深色（接近黑色）背景。此关键字标识文件中标记为此方式的第一个可用调色板。如果字体文件格式未考虑此元数据，或字体中没有任何调色板标记为此方式，则此值的行为为 `0`。

### override-colors 调整颜色面板

`@font-palette-values` 中的 `override-colors` 属性可以用来覆盖彩色字体调色面板中的颜色。它接受一个逗号分隔的调色板索引条目和颜色列表。逗号分隔列表中的每个项目表示调色板中的一个条目和要替换的颜色。

例如：

```CSS
@font-palette-values --custom {
      font-family: "Rocher Color";
      override-colors: 0 #a13908;
}
​
h1 {
      font-palette: --custom;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64f10acd02d34a7f84d25e27a0e46ba8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMKvqG>

你也可以不从 `0` 开始，可以覆盖任何颜色：

```CSS
@font-palette-values --custom {
      font-family: "Rocher Color";
      override-colors: 2 #09faec;
}
​
h1 {
    font-family: 'Rocher Color';
    font-palette: --custom;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31d0727b3f1b4032b14fa36d8f96c58e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQreEp>

你甚至可以覆盖所有调色板所有颜色：

```CSS
@font-palette-values --custom {
    font-family: "Rocher Color";
    override-colors:
        0 rgb(121 158 181),
        1 rgb(255 215 10),
        2 rgb(184 159 67),
        3 rgb(112 121 19);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6c0373e026d4bd6bbc2f34cee999434~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQEjEm>

你甚至可以在已有调色板的基础上，更改其中的一个或多个颜色。比如，我们在第六组紫色调色板做些更改。

```CSS
@font-palette-values --custom {
    font-family: "Rocher Color";
    base-palette: 6;
    override-colors: 
        0 #9e4356,
        1 #f36,
        2 #09feac,
        3 #099090;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e2539fcce6645a3a443a34f6a37e029~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQzjZW>

当然了，`override-colors` 除了可以定义字体的颜色，还可以自定义 [emoji 表情](https://github.com/mozilla/twemoji-colr)各个部位的颜色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb8db2225a3b47a583cb35425f40b91d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://rsheeter.github.io/recolor>

需要注意的是，**`base-palette`** **和** **`override-colors`** **只能用于** **`@font-palette-values`** **规则中**。

另外，如果 `@font-palette-values` 规则中不存在 `override-colors` ，则 `@font-palette-values` 规则表示与此描述符的值相同索引的字体中的调色板。如果 `@font-palette-values` 规则中存在 `override-colors` ，则该描述符值中的每个条目将覆盖此 `@font-palette-values` 块所表示的颜色调色板中的单个颜色。

如果 `@font-palette-values` 中不存在 `base-palette`，或者字体没有一个与 `base-palette` 的值对应的调色板，则其行为就像指定了 `0` 一样。如果字体不包含任何彩色调色板，则初始颜色调色板中不包含任何颜色，由 `@font-palette-values` 规则表示。可以通过在 `@font-palette-values` 规则中使用 `override-color` 覆盖调色板中的颜色。

而且，在指定 `override-colors` 时，很难知道每个数字会覆盖字体的哪一部分，你必须进行尝试和实验，并通过反复试验来实现所需的效果。

### 目前局限性

目前，CSS自定义属性无法用于主题化彩色字体，因为 CSS 中的彩色字体属性不支持自定义属性。例如，目前无法使用以下方法对自定义字体进行主题化：

```CSS
:root {
    --font-hue: 180;
}
​
@font-palette-values --custom {
    font-family: "Rocher Color";
    base-palette: 6;
    override-colors: 
      0 hsl(var(--font-hue) 65% 65%),
      1 hsl(var(--font-hue) 85% 85%),
      2 hsl(var(--font-hue) 5% 65%),
      3 hsl(var(--font-hue) 65% 5%);
}
​
h1 {
    font-family: "Rocher Color";
    font-palette: --custom;
    --font-hue: 120;
}
​
h1:nth-child(2) {
    --font-hue: 90;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6d2a7b114394398ac40422bfe1731ac~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwjpyG>

同样，无法在 `@font-palette-value` 中调用 CSS 自定义属性值。以下示例不起作用：

```CSS
:root {
    --base-palette: 3;
}
​
@font-palette-values --Nabla {
    font-family: "Nabla";
    base-palette: var(--base-palette);
}
```

不过，[W3C 规范](https://www.w3.org/TR/css-fonts-4/#font-palette-values)中也说过：

> `calc()`、`var()` 和 `env()` 在 `@font-palette-values` 规则的括号内有效。它们在根元素的上下文中进行评估。相对单位也在根元素的上下文中进行评估。

[GitHub 上有一项讨论](https://github.com/w3c/csswg-drafts/issues/6931)，正在争论是否允许使用 `var()`。

我不确定未来会发生什么，但是如果你想在现有规范状态下动态切换调色板值，则可以将 `@font-palette-values` 本身分配给自定义属性以解决问题。

```CSS
@font-palette-values --blue {
    font-family: "Nabla";
    base-palette: 3;
}
​
@font-palette-values --gray {
    font-family: "Nabla";
    base-palette: 4;
}
​
:root {
    --font-palette: --blue;
}
​
h2 {
    font-family: "Nabla";
    font-palette: var(--font-palette);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed8b262446044807b0850a19346a75ba~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQzKXN>

## 小结

当然，有权力就应该有责任，仅仅因为你可以更改颜色，并不意味着你总是应该这样做。通常，调色板中的颜色是协调美学上的相互关系，因此有必要了解它们应该如何相互关联。你可以查看字体的预定义颜色调色板，以了解字体设计师分配调色板中每种颜色的角色，然后进行微调。

选择与背景形成强烈对比的颜色也是非常重要的，以保持你的文本可读性和网页可访问性。字母基础色调色板中使用的颜色通常应该在背景上突出显示，而像阴影、轮廓和装饰元素之类的支持层可能会更少地对比以保持从不压倒字形。

彩色字体比图形图像更有改进之处，因为它们默认情况下与屏幕阅读器、复制、粘贴和页面查找一起使用。此外，如果字体无法加载，它们会优雅地显示备用文本，并且如果浏览器窗口大小调整，则可以重新流动。不仅如此，彩色字体比图形图像更灵活，因为它们可以将使用它们的元素的前景色融入字体的设计中。

彩色字体并不意味着取代单色字体。但是在适当的情况下以适当的大小使用时，它们可以是完美的锦上添花！

随着越来越多的可变字体和彩色字体的出现，网页排版正朝着丰富的定制和创造性表达的方向发展。它们为网页设计提供了新的表现力和创造性，可以使你的网站脱颖而出。