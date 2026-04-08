在 SVG 中，文本元素是不可或缺的一部分，它使得我们能够向图形中添加文字或文本内容，从而丰富了图形的信息传达和可读性。SVG 文本元素的灵活性和可定制性使其成为 Web 设计师、开发者和数据可视化专家的首选工具之一。

  


通过 SVG 文本元素，我们可以控制文本的位置、大小、字体、颜色和对齐方式，使其与[图形元素](https://juejin.cn/book/7341630791099383835/section/7345813971552698406)完美融合。无论是创建数据可视化图表、设计个性化图标还是制作交互式地图，SVG 文本元素都扮演着关键的角色。它们为我们提供了展示创意、传达信息和提升用户体验的重要手段。

  


在这节课中，我们将深入探讨 SVG 文本元素的各种用法和技巧。我们将学习如何使用 SVG 文本元素创建各种样式的文本，包括普通文本、路径文本和文本样式化。我们还将探讨如何利用 SVG 文本元素创建动态文本效果和交互文本元素，以及如何优化文本在不同设备和分辨率下的显示效果。

  


无论你是初学者还是有经验的开发者，这节课都将为你提供有关于 SVG 文本元素的全面指南。让我们一起探索 SVG 文本元素的世界，并发现它们在创意设计和数据可视化中的无限潜力！

  


## SVG 文本元素简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ca7b715067f44a09c2cc4eb1614dd1c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3272&h=1660&s=197687&e=jpg&b=a6c2ce)

  


SVG 中的文本元素提供了在矢量图形中添加文字或文本内容的功能，从而丰富了图形的信息传达和可读性。尽管 SVG 主要用于图形，但它也支持文本元素，允许在图形中直接嵌入文本。

  


SVG 中的文本元素主要包括 `<text>`、`<tspan>` 和 `<textPath>` ：

  


-   **`<text>`** **元素**：用于在 SVG 中创建单行或多行文本。它定义了一个文本区域，可以在其中添加文本内容，并通过属性控制文本的位置、大小、字体、颜色等样式。
-   **`<tspan>`** **元素**：用于在文本中创建子文本块，可以在其中独立设置样式或调整位置。通过在 `<text>` 或其他 `<tspan>` 元素内部使用 `<tspan>` 元素，可以创建复杂的文本样式或布局。
-   **`<textPath>`** **元素**：用于沿着路径排列文本。它将文本沿着指定的路径进行排列，并通过路径的 ID 和其他属性来控制文本的样式和布局。

  


这些文本元素可以与其他 SVG 元素结合使用，例如图形、线条等，从而创建出丰富多彩的图形效果。通过灵活运用这些文本元素，我们可以实现各种各样的文本样式和布局，为图形设计和数据可视化提供更多可能性。

  


## 基本概念

  


在深入讨论 SVG 的 `<text>` 、`<tspan>` 和 `<textPath>` 元素之前，我们先来了解与文本相关的几个基本概念：**字符、字形、字体和 EM 盒**。

  


### 字符

  


字符是文本中的基本单位，通常表示为字母、数字、标点符号或其他符号。在计算机科学中，字符是使用数字编码表示的，例如 Unicode 编码。每个字符都有一个唯一的编码，使得计算机能够识别和处理文本中的不同符号。字符是构成文字和语言的基本组成部分，用于表达和传达信息。

  


SVG 文本由一系列字符定义，这就是为什么它可以被搜索和选中的原因。

  


### 字形

  


字形是指字符的视觉表示形式，通常是字体的外观和样式。同一个字符可以有不同的字形，例如，字母 `a` 可以以不同的字体、大小、粗细和样式呈现出来，每种呈现形式都被称为一个字形。字形包括了字母的形状、笔画和结构，这些元素共同决定了字符的外观。在设计和排版中，选择合适的字形可以影响文本的可读性、视觉效果和美观度。

  


### 字体

  


字体是字形的集合，是指一组具有相似风格和设计特点的字形集合。它包括了字母、数字、标点符号和其他符号的完整集合，以及它们的不同变体和样式。字体通常由字形、字重、字宽、字间距等元素组成。

  


在字体设计中，字形是指每个字符的具体形态，而字体则是包含了多种字形的整体集合。字体可以根据不同的设计风格和排版要求进行分类，例如衬线体、非衬线体、手写体、黑体等。不同的字体具有不同的特点和风格，可以用于不同的设计目的，如文档排片，Logo 设计、广告制作等。选择合适的字体可以提升文本的可读性、吸引力和视觉效果。

  


> **字形和字体表的集合称为字体数据**。

  


简而言之，字符是文本中的基本单位，字形是字符的可视化形式，而字体是包含了多种字形的集合。通过理解它们之间的区别，我们可以更好地掌握字体设计和排版的基本概念，从而更有效地处理文本内容。

  


### EM 盒子

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a912dcc1edff43918b01a99d0dc9234b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=182912&e=jpg&b=ffffff)

  


EM 盒子是字体排印中常见的概念，用于确定字符的尺寸和定位。

  


简单来说，EM 盒子是一个虚拟的方框，用于包围字体中的字符或字形。它的大小相对于当前字体的 `em` 单位而言，通常等于字体中大写字母 `M` 的宽度和高度。主要用于确定字符或字形的尺寸和定位，是计算字符大小、行高和字间距的重要参考。在排版过程中，EM 盒子的尺寸和位置决定了文本整体布局的外观。

  


[在之前的课程中](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)，我们已经了解了在 SVG 画布上绘制图形的坐标系以及通过视口查看画布的不同坐标系，如用户坐标系（`viewBox`）。

  


实际上，字体还有一个特定的坐标系。不同字体的几何特性是在基于 EM 盒子的坐标系内表示的。每个字形周围的盒子高度和宽度都是 `1em`。该盒子称为设计空间，该坐标系称为设计空间坐标系。

  


通过将 EM 盒子分割成每个 `em` 单位的数量来确定具体的坐标。该数字是字体的一个特征，包含在字体表的信息中。

  


通常，该坐标系中的 `(0,0)` 点位于盒子的左边缘，但通常不在左下角。例如，罗马大写字母的底部通常位于 `y=0` 坐标处。某些字母，如小写字母 `g` 或 `y`，其下沉部分仍然包含在设计空间内，但其 `y` 坐标将为负值。这导致 `y=0` 成为设计空间底部的某个值。

  


SVG 假设字体表将提供至少三个字体特征：

  


-   上升：从字体的 `(0,0)` 点到 EM 盒的顶部的距离
-   下降：从字体的 `(0,0)` 点到 EM 盒的底部的距离
-   基线表：设计空间坐标系中一个或多个基线的位置

  


至少，字体表告诉 SVG 如何定位字体内的字形，虽然它可能还包括关于字体粗细等的信息。

  


由于 SVG 文本元素与文本排版和渲染相关，因此有必要向大家简单介绍一下这几个基本概念。了解完这几个基本概念之后，我们可以开始进入 SVG 的文本元素世界中。

  


## `<text>` 元素

  


在SVG中，你可以通过使用 `<text>` 元素来创建文本。该元素定义了一个由文本组成的图形元素，并提供了许多属性选项，例如`x`、`y`、`dx`、`dy`、`rotate`、`textLength`、`lengthAdjust`等等。你可以利用这些属性将文本应用于渐变、图案、剪切路径、蒙板或滤镜。此外，你也可以像使用其他基本图形元素一样对文本进行填充、添加描边等操作。

  


### 基本属性 ：x 、y 、dx 和 dy

  


在深入了解这些内容之前，让我们从一个简单的示例开始。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="0" y="0" fill="#ED6E46">Hello! SVG Text!</text>
</svg>
```

  


上面的代码中，我们在 `<svg>` 元素内嵌套了一个 `<text>` 元素，并设置了 `x` 和 `y` 属性的值为`0` ，以便文本在 SVG 视口的原点处呈现。在 `<text>` 元素的开始和结束标签之间，你可以添加你想要在 SVG 中显示的文本内容。这就是创建 SVG 文本的简单方式。

  


使用 CSS 给 `<svg>` 元素和 `<text>` 元素添加一些基本样式，以便于大家更好的观看 `<text>` 元素绘制的文本在 SVG 视口中（或用户坐标系中）呈现的效果。

  


```CSS
@layer demo {
    .text {
        display: block;
        width: 40vw;
        outline: 1px dashed #fff;
        height: auto;
        --overflow: visible;
        overflow: var(--overflow);
        
        text {
            font-family:'Leckerli One', cursive;
            font-size: 4rem;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6184ba630c97488995a99bc4a96b41e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=572&s=491188&e=gif&f=130&b=0a0822)

  


> Demo 地址：https://codepen.io/airen/full/JjVbGpj

  


请注意文本显示的位置。你可能猜到文本会出现在 SVG 视口的左边缘，但我敢打赌你没想到文本会出现在 SVG 视口的上方。如果在 CSS 中没有将 `svg` 元素的 `overflow` 属性重置为 `visible` （客户端默认将 `svg` 元素的 `overflow` 设置为 `hidden` ， 溢出视口的图形不可见），你都可能看不到 `<text>` 元素绘制的文本内容。

  


造成这种现象的主要原因是 `y` 表示文本基线的位置，基线包含在字体表中，回忆一下前面所说的 EM 盒子（SVG 中，字体还有一个特定的坐标系）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a21032448f93428f87c9642e3419b2ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=321149&e=jpg&b=0b0b27)

  


我们可以通过调整 `<text>` 元素的 `x` 和 `y` 值来改变文本在 SVG 视口中的位置。如果你希望文本向右移动，可以给 `x` 设置正值，反之则设置负值；如果希望文本向下移动，可以给 `y` 设置正值，反之则设置负值。一般情况下，如果想让文本在 SVG 视口中呈现，你会给 `y` 设置一个和 `font-size` 相等的值：

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="0" y="100" fill="#ED6E46" id="text">Hello! SVG Text!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60259c8b5b064f56971f8a2cab02c8ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=506&s=1890330&e=gif&f=235&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/poBNgXY

  


`<text>` 元素的 `x` 和 `y` 不仅仅用于设置文本的起始位置，它们还可以接受一个列表值（以逗号或空格分隔的 `n` 个 `<length>` 的列表）。列表中的第一个坐标是文本的第一个字符的位置，第二个坐标是第二个字符的位置，以此类推。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="0" y="100" fill="#ED6E46">Hello! SVG Text!</text>
    <text x="0,60,100,140,180,220" y="240" fill="lime">Hello! SVG Text!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b62ec97983f64005b988e11fa2e05065~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=706007&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/rNbWeNN

  


在上述示例中，绿色文本的 `x` 属性设置了一个坐标列表。列表中的第一个坐标（`0`）对应于字符 “H” 的 `x` 位置，而第二个坐标（`60`）对应于字符 “e” 的 `x` 位置，以此类推。一旦坐标列表结束，任何剩余的字符将按照自然顺序跟随在前一个字符之后显示。

  


接下来这个示例中，同时给 `<text>` 元素的 `x` 和 `y` 属性都设置了一个列表值：

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text 
        x="0,50,80,100,120,140,130,170,220,280,310,350, 380, 414, 460,480" 
        y="100, 130, 180,240, 280,340,280,280,280,290,330,330,330,350,380,360"  
        fill="#ED6E46">Hello! SVG Text!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cae92659f0444e2a84234f3fe317f8ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=587259&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/VwNmaeW

  


这种方式使你能够绘制出更具创意的文本效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2136a4e638f24fc9ae1f9a1bb3d00c5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1005&s=1042165&e=jpg&b=f0efee)

  


在 SVG 视口中设置文本位置并不仅限于使用 `x` 和 `y` 属性。在 `<text>` 元素中，除了 `x` 和 `y` 属性外，还可以使用 `dx` 和 `dy` 属性。这些属性类似于 `x` 和 `y`，但它们表示的是相对于前一个字符的偏移量，而不是相对于视口的绝对位置。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <!-- 使用绝对位置，起始坐标点是 (50, 300) -->
    <text x="50" y="300"  fill="#ED6E46">Hello! SVG Text!</text>
 
    <!-- 在绝对位置 (50,300) 上向右移动 150，向下移动 100，其起始位置相当于 (200, 400) -->
    <text x="50" y="300" dx="150" dy="100" fill="lime">Hello! SVG Text!</text>
</svg>
```

  


在上面的示例中，橙色文本仅使用 `x` 和 `y` 属性设置位置，起始位置为 `(50, 300)`。而绿色文本在橙色文本的基础上增加了 `dx` 和 `dy` 属性的设置，它相当于在 `(50, 300)` 的位置向右移动了 `150` 个单位（`dx="150"`），向下移动了 `100` 个单位（`dy="100"`）。因此，绿色文本的起点位置是 `(200, 400)` 。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c875282d4f464a41843cd77bcfe1a879~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=721775&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/oNOYxJE

  


与 `x` 和 `y` 类似，`dx` 和 `dy` 的值也可以是一个列表值。例如：

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="0" y="100" dx="10, 20, 30, 40, 50, 60" dy="20, 30, 40, 50, 60, 70, -30, -40, -50, -60" fill="#ED6E46">Hello! SVG Text!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a36233edecb4aec91e6f28241a066a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=491043&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/jORVrPW

  


在这里，`dx` 和 `dy` 上设置了一系列长度值。请注意，随着值的增加，到下一个字符的距离也在增加。

  


> 注意，`<text>` 文本内容中的空格也会被算作字符！

  


### 旋转字符：rotate

  


你可以在 `<text>` 元素上使用 `rotate` 属性来旋转字符，它接受一个数字列表，每个数字表示一个特定的字符。如果你设置的旋转值数量与字符数量不匹配，则未设置单独值的字符将遵循最后的设置值。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="0" y="100" rotate="0, 15, 30, 45"  fill="#ED6E46">Hello! SVG Text!</text>
</svg>
```

  


在这里，字符 “H” 将旋转 `0deg` ，“e” 将旋转 `15deg` ，“l" 将旋转 `30deg` ，依此类推，直到我们达到列表的末尾，所有剩余字符将旋转 `45deg` （遵循 `rotate` 属性的最后的设置值）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a79f9d9ba3654e79a510ec32464387ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=520057&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/qBwqNqK

  


注意，使用 `rotate` 属性只会旋转单个字符，而不是整个文本字符串。如果需要旋转整个字符串，则需要使用 `transform` 属性。

  


### 文本长度：textLength

  


`<text>` 元素的 `textLength` 属性允许你将文本的长度设置为特定的值，而且不用管容器的大小如何：

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="0" y="100" dx="0" dy="50" textLength="1200" fill="#ED6E46" id="text">Hello! SVG Text!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6da6b19e5f82495491e3c98c8b797de5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=564&s=1863224&e=gif&f=283&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/GRLNqyK

  


在上面的示例中，如果将 `textLength` 设置为与 `viewBox` 相同的宽度，整个文本将会横跨整个视口的宽度，从一端延伸到另一端。字符会自动间隔开，以填满整个空间。但如果你愿意，你也可以将 `textLength` 设置为一个比所需空间小的长度，这样就会使字符挤在一起。

  


值得注意的是，`textLength` 调整的是字符之间的间距，而不是字符本身的大小。

  


### 调整字符宽度：lengthAdjust

  


SVG 中的 `<text>` 元素的 `lengthAdjust` 属性用于控制文本在指定的长度（由 `textLength` 属性定义）内的拉伸方式。`lengthAdjust` 属性有两个可能的值：

  


-   **`spacing`**：在这种模式下，只调整字符之间的间距，而字符本身的大小保持不变。这意味着字符之间的间距会根据所定义的长度进行调整，但字符的形状和大小不会改变。
-   **`spacingAndGlyphs`**：在这种模式下，不仅会调整字符之间的间距，还会根据所定义的长度拉伸或压缩字符本身，使文本填充指定的长度。这意味着字符的间距和字符本身都会根据所定义的长度进行调整。

  


在这两个值中，`spacing` 是默认值。因此，在之前的示例中，当使用 `textLength` 属性时，文本只会调整字符之间的间距，而不会改变字符本身的大小。然而，如果你将 `lengthAdjust` 属性设置为 `spacingAndGlyphs`，你会发现字符会被拉伸，而不仅仅是调整字符之间的间距。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text lengthAdjust="spacingAndGlyphs" x="0" y="100" dx="0" dy="50" textLength="1200" fill="#ED6E46" id="text">Hello! SVG Text!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6abc6af9f5a740fabd341887849f1bb0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=534&s=2762322&e=gif&f=329&b=021d44)

  


> Demo 地址：https://codepen.io/airen/full/OJGbRyb

  


通过设置 `lengthAdjust` 属性，可以控制文本在指定长度内的拉伸方式，从而实现不同的文本布局效果。

  


## `<tspan>` 元素

  


SVG 的 `<text>` 文本元素提供了定位和样式化文本的简单方式，但如果你想对文本的不同部分进行不同的定位和样式化，你需要创建多个 `<text>` 元素吗？其实不需要。在 SVG 中有一种更简单的方法可以实现。

  


除了 `<text>` 元素之外，还有一个 `<tspan>` 元素，你可以将其视为 SVG 文本的 `<span>`。通过将部分或全部 SVG 文本嵌套在 `<tspan>` 元素中，你可以更好地控制文本的呈现，并相对于彼此定位不同样式或文本片段。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="15" y="150" fill="#e13137">Coca-Cola 
        <tspan y="200" fill="gold" font-size="80">is</tspan>
        <tspan dy="50" dx="30" font-size="120">Cool!</tspan>
    </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/759c5e87b07e491bb831d8ef68ecc610~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=581975&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/oNOYzZg

  


`<tspan>` 中的文本会依次显示在一起，就像它们直接在 `<text>` 元素中显示一样，它们之间有一个空格。

  


要知道的是，可用于 `<text>` 元素的属性同样也适用于 `<tspan>` 元素。例如，上面示例中的第一个 `<tspan>` 元素的 `y` 坐标改变黄色文本在 `y` 轴的位置；第二个 `<tspan>` 元素设置了 `dx` 和 `dy` ，它会相对于第一个 `<tspan>` 元素定位。

  


通常情况之下，用于 `<tspan>` 会继续其父元素样式，例如 `rotate` 、`textLength` 、`lengthAdjust` 、`fill` 等。例如下面这个示例，改变 `<text>` 元素的 `textLength` 和 `lengthAdjust` 属性时，其子元素 `<tspan>` 同样会受到影响：

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text textLength="1200" lengthAdjust="spacing" x="15" y="200" fill="#fff" stroke="#e13137" stroke-width="4" id="text">
        Coca-Cola 
        <tspan dx="-30" y="280" fill="gold" font-size="60" >is</tspan>
        <tspan  y="280" dx="-30" dy="100" font-size="80" fill="#e13137" stroke="#fff">Cool!</tspan>
    </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb4ef9564d0e4820a76a99fd4f6ca700~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=516&s=3178924&e=gif&f=313&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/zYXoKRQ

  


## 可用于 SVG 文本的属性

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/120c49f7c94c42448d17bafc9fa3bfa1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=6132&h=2348&s=557138&e=png&b=ffffff)

  


### SVG 字体属性

  


以下是你可以在 SVG 中使用的所有字体属性列表。你可以将它们中的任何一个作为 `<text>` 或 `<tspan>` 元素的属性使用。你也可以将它们设置为 CSS 属性：

  


-   `font-family`
-   `font-style`
-   `font-variant`
-   `font-weight`
-   `font-size`
-   `font-size-adjust`
-   `font-stretch`
-   `font`

  


其中 `font` 仅作为 CSS 属性提供，不能作为 SVG 元素的属性使用。在使用 SVG 时需要注意的一点是行高（`line-height`）对其没有影响。在 SVG 中，它被假定为与字体大小相同。

  


当谈及到字体在 CSS 中的使用时，你可能会立即想到 `font-family` 、`font-size` 、`font-weight` 、`font-style` 和 `font-variant` 这些属性，因为它们是常见且熟悉的。相较之下，`font-variant` 可能对你来说稍显陌生，但如果提到 CSS 中的可变字体特性，你可能会马上联想到它。如果你对 CSS 中的可变字体特性不太熟悉，我建议你阅读一下《[Web 上的可变字体](https://juejin.cn/book/7223230325122400288/section/7246384512219742266)》，它介绍了这个非常有趣的 [CSS 现代特性](https://s.juejin.cn/ds/iFmyeAww/)。

  


在下面的示例中，我重复了文本“Coca-Cola is Cool!”四次，每次使用不同的字体（`font-family`），并且在每个字体上调整了额外的字体属性，以便你可以看到它们的效果。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="10" y="100" fill="lime"  font-family="Palatino" font-variant="small-caps">coca-cola is cool!</text>
    <text x="10" y="220" fill="gold" font-family="Helvetica" font-style="italic">Coca-Cola is Cool!</text>
    <text x="10" y="340" fill="pink"  font-family="Georgia" font-weight="bold">Coca-Cola is Cool!</text>
    <text x="10" y="480" fill="#e13137" font-family="Verdana" font-size="8em">Coca-Cola is Cool!</text>
</svg>
```

  


-   第一个 `<text>` 元素的 `font-family` 为 `Palatino` ，同时 `font-variant` 的值是 `small-caps` ，注意该元素的文本字符都是小写。
-   第二个 `<text>` 元素的 `font-family` 为 `Helvetica` ，同时 `font-style` 的值是 `italic`
-   第三个 `<text>` 元素的 `font-family` 为 `Georgia` ， 同时 `font-weight` 的值是 `bold`
-   第四个 `<text>` 元素的 `font-family` 为 `Verdana` ，同时 `font-size` 的值是 `8em`

  


我还在 CSS 中为前三个 `<text>` 元素设置了 `font-size` 为 `100px` :

  


```CSS
text:not(:last-child) {
    font-size: 100px;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0375ebe4f86048f48b678e68e300c4ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=373639&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/JjVbMoz

  


你可能已经发现它们之间的差异了。以第一个 `<text>` 元素为例，尽管元素字符都是小写，但元素设置了 `font-variant: small-caps` ，最终呈现给你的结果是，元素所有字符都变成了大写。

  


需要知道的是，这些属性在 CSS 中设置也是有效的，但在这里它们都作为 `<text>` 元素的属性设置。

  


相对而言，可能大家对 `font-size-adjust` 和 `font-stretch` 会略感陌生，因此多花一点时间来聊一下这两个属性。

  


`font-stretch` 属性为字体定义一个正常或经过伸缩变形的字体外观，这个属性并不会通过扩展或压缩而改为字体的几何外形，如 `font-feature-settings 和 font-variant 属性`，它仅仅意味着当有多种字体可供选择时，会为字体选择最适合的大小。

  


虽然你可能从未使用过它，但 `font-stretch` 是一个有效的 CSS 属性，具有以下可能的值。

  


-   `normal`
-   `wider`
-   `narrower`
-   `ultra-condensed`
-   `extra-condensed`
-   `condensed`
-   `semi-condensed`
-   `semi-expanded`
-   `expanded`
-   `extra-expanded`
-   `ultra-expanded`
-   `inherit`

  


你可能认为该属性确实如其所说，可以拉伸或压缩你正在使用的任何字体，但事实并非如此。`font-stretch` 属性适用于带有几个字形的字体，并且根据该属性设置的值，替换最佳字形。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text font-stretch="expanded" lengthAdjust="spacing" x="0" y="100" dx="0" dy="50" textLength="1200" fill="#ED6E46" id="text">Hello! SVG Text!</text>
  </svg>
```

  


```CSS
@font-face {
    font-family: "Roboto Flex";
    src: url("https://digitalupgrade.com/images/misc/RobotoFlex-VariableFont_GRADXTRAYOPQYTASYTDEYTFIYTLCYTUCopszslntwdthwght.woff2")
    format("woff2-variations");
    font-weight: 1 999;
    font-style: oblique -10deg 360deg;
    font-stretch: 0% 999%;
}

text {
    font-family: "Roboto Flex", sans-serif;
    font-weight: 800;
    font-style: italic;
    font-variation-settings: "SSTR" 183, "INLN" 648, "TSHR" 460, "TRSB" 312, "TWRM" 638, "SINL" 557, "TOIL" 333, "TINL" 526, "WORM" 523;
    font-size: 100px;
    transition: all 0.3s ease;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/618730060dd445ea90263c875f0e094d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=514&s=2638978&e=gif&f=177&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/qBwqpaz

  


注意，要使 `font-stretch` 生效，需要给文本应用一个可变字体。你可以参阅《[Web 上可变字体](https://juejin.cn/book/7223230325122400288/section/7246384512219742266#heading-3)》一文给文本设置一个可变字体。

  


`font-size-adjust` 属性提供了一种修改小写字母大小相对于大写字母大小的方式，以定义整体字体大小。[在字体回退可能发生的性况下](https://juejin.cn/book/7223230325122400288/section/7243643072888700985#heading-9)，这个属性非常有用。

  


字首选字体不可用，并且其替代回退字体具有明显不同的外观值（小写 `x` 字母高度除以字体大小）时，即该字体的小写字母 `x` 和大写字母 `X` 之间的大小差异，可读性可能会成为一个问题。字体的可读性，特别是在小字号时，更多取决于小写字母 `x` 的大小而不是大写字母 `X` 的大小。`font-size-adjust` 属性有助于调整回退字体的字号，以保持字体之间的外观值一致，确保文本无论使用何种字体，看起来都类似。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text font-stretch="expanded" font-size-adjust="0.42" lengthAdjust="spacing" x="0" y="100" dx="0" dy="50" textLength="1200" fill="#ED6E46" id="text">Hello! SVG Text XxX!</text>
</svg>
```

  


### 字距调整

  


大多数情况下，字符和单词之间的默认间距是完全可以接受的，但在处理标题和副标题中的显示类型时，你可能希望调整文本中的间距。SVG提供了一种方法来实现这一点。

  


-   字母间距（`letter-spacing`）：调整所有字母之间的空间。
-   单词间距（`word-spacing`）：调整单词之间的空间，而不是单个字符。

  


你可能已经熟悉并在 CSS 中使用过这两个属性，即字母间距和单词间距。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text font-stretch="expanded" letter-spacing="20" word-spacing="20" lengthAdjust="spacing" x="0" y="100" dx="0" dy="50" textLength="1200" fill="#ED6E46" id="text">Coca-Cola is Cool!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a43571ac65854c9cb4cb425448d49776~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=584&s=3082867&e=gif&f=212&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/yLrVpbE

  


### 文本装饰

  


在 SVG 中，你可以使用 `text-decoration` 为文本添加上划线（`overline`）、删除线（`line-through`）和下划线（`underline）：

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text  x="0" y="200" fill="#ED6E46">
        <tspan text-decoration="overline">Hello!</tspan>  
        <tspan text-decoration="underline">SVG</tspan>
        <tspan text-decoration="line-through">Text!</tspan>
    </text>
  
    <text x="0" y="400" text-decoration="overline line-through underline" fill="lime">Coca-Cola is Cool!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0b8f99da52047cdbd116a423af0c86e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=298245&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/VwNmQrM

  


我原以为 CSS 的 `text-decoration` 相关的特性也可以应用于 SVG 文本中，但我尝试了一下，并没有预期的好。你可以通过下面这个案例体验一下 CSS 的 `text-decoration` 属性给文本设置装饰的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2a5779f4ded4e99924377963daa07f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1402&h=682&s=4593809&e=gif&f=622&b=23133a)

  


> Demo 地址：https://codepen.io/airen/full/OJVEQRo

  


### text-anchor 属性

  


默认情况下，当你定位 SVG 文本时，你指定的位置与文本的左边缘和基线对齐。SVG 的 `text-anchor` 属性允许你在 EM 框的开始（`start`）、中间（`middle`）或结束（`end`）水平对齐文本。

  


`text-anchor` 属性应用于给定 `<text>` 元素中的每个单独的文本块。每个文本块都有一个初始的当前文本位置，它代表了用户坐标系中的一个点，该点由以下情况（具体取决于上下文）决定：`<text>` 元素上的 `x` 和 `y` 属性的应用，分配给文本块中第一个呈现字符的任何 `<tspan>` 或 `<tref>` 元素（注意，该元素已在 SVG2 中删除）上的 `x` 或 `y` 属性值，或者确定 `<textPath>` 元素的初始当前文本位置。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text   text-anchor="start" font-stretch="expanded" lengthAdjust="spacing" x="0" y="100" dx="0" dy="50" textLength="1200" letter-spacing="20" word-spacing="20" fill="#ED6E46" id="text">Coca-Cola is Cool! </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68dcdab6e72a4cf8b3210f0d06c626bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=556&s=1780056&e=gif&f=149&b=041e46)

  


> Demo 地址：https://codepen.io/airen/full/jORVZBR

  


### 基线对齐

  


不同的字体可以具有不同的基线，因此在 EM 框内具有不同的位置：

  


-   对于水平书写，表意文字（汉字、片假名、平假名和韩文字母）的基线对齐到字形的底部附近。
-   字母基础的文字（拉丁文、西里尔文、希伯来文、阿拉伯文）的基线对齐到大多数字形的底部，但某些字形会下降到基线以下。
-   印度基础的文字则在字形顶部附近对齐。

  


如果你始终使用单一字体，就没有问题，但如果在一行中更换字体，则可能会出现问题。实际上，更换字体可能比你想象的更常见。

  


例如，一个 Logo 中的两个词使用不同的字体并不少见，或者你可能会在句子中间切换到等宽字体以显示代码。根据所涉及的字体，它们可能无法沿着相同的基线对齐。

  


在 SVG 中，它提供了几个基线对齐属性，允许你调整不同的基线：

  


-   `dominant-baseline`：用于确定或重新确定缩放的基线表。它可以采用以下任何值：`auto`、`use-script`、`no-change`、`reset-size`、`ideographic`、`alphabetic`、`hanging`、`mathematical`、`central`、`middle`、`text-after-edge`、`text-before-edge`、`inherit`。
-   `alignment-baseline`：指定要与父元素的相应基线对齐的基线，它接受类似于 `dominant-baseline` 属性的一组值。
-   `baseline-shift`：允许重新定位相对于父元素的基线的基线，它接受 `sub`、`super`、`<percent>`、`<length>` 四个值，对于后两个值，正值向上移动文本（`super`），负值向下移动文本（`sub`）。

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text  dominant-baseline="middle" alignment-baseline="middle" text-anchor="start" font-stretch="expanded" lengthAdjust="spacing" x="0" y="100" dx="0" dy="50" textLength="1200" letter-spacing="20" word-spacing="20" fill="#ED6E46" id="text">
        Coca-Cola is Cool! 
        <tspan font-size="60" dx="-50" dy="0" fill="lime" baseline-shift="super" id="tspan">TM</tspan>
    </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b87eaa706987432da308081458e899f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=710&s=3452892&e=gif&f=313&b=031e46)

  


> Demo 地址：https://codepen.io/airen/full/poBNaQv

  


## SVG 文本沿着路径布局

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63422b500f664e559c8f5a2f49b1a1f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250&h=452&s=55686&e=png&b=ffffff)

  


除了在直线上布置文本之外，SVG 在你创建的任何路径上布局文本。这为显示文本打开了许多可能性。

  


要创建沿路径的 SVG 文本，你需要将 `<textPath>` 和 `<path>` 组合起来使用：

  


-   `<path>` 绘制一条路径，并且给该路径定义一个 `id` 名
-   `<textPath>` 元素通过 `xlink:href` 来引用 `path` 中的 `id` ，即引用路径。

  


注意，SVG 2 删除了 `xlink:` ，直接使用 `href` 属性来引用路径。

  


接下来，我们通过一个示例来向大家展示，SVG 中如何将文本放置在指定的路径上。

  


首先，使用 SVG 的 `<path>` 元素创建一个路径，例如：

  


```XML
<svg class="svgwave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 301 21">
    <path id="wavepath"  d="M0,.5c30.0978,0,30.0978,20,60.1956,20S90.2948.5,120.394.5s30.1,20,60.2,20c30.1015,0,30.1015-20,60.203-20s30.1014,20,60.2029,20" fill="none" stroke="#fefefe" stroke-width="1" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />
</svg>
```

  


记得要给 `<path>` 定义一个 `id` 名，这里给它命名为 `wavepath` ，因为稍后这个 `id` 名要被引用。你将看到一条类似波浪形的路径：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19c55d53494a4004ac23f8867752b64e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=193182&e=jpg&b=0b0b27)

  


如果你觉得使用 `<path>` 元素的命令绘制路径感到困难，那么你可以考虑使用诸如 Figma 这样的图形设计软件或 [SVG Path Builder](https://codepen.io/anthonydugois/full/mewdyZ/) 在线工具来获取路径的数据（`d` 属性的值）。这里假设你能轻易获得各种你喜欢的路径数据，或者移步阅读《[初级篇：SVG图形基本元素](https://juejin.cn/book/7341630791099383835/section/7345813971552698406)》一课，了解如何获取路径。

  


接下来，使用 `<text>` 和 `<textPath>` 元素创建文本，其中 `<textPath>` 嵌套在 `<text>` 元素中。最为关键的是在 `<textPath>` 元素上设置 `xlink:href` （SVG 2 可以直接使用 `href`）引用已创建的 `<path>` 的 `id` ，即引用路径：

  


```XML
<svg class="svgwave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 301 21">
     <path id="wavepath" d="M0,.5c30.0978,0,30.0978,20,60.1956,20S90.2948.5,120.394.5s30.1,20,60.2,20c30.1015,0,30.1015-20,60.203-20s30.1014,20,60.2029,20" fill="none" stroke="#fefefe" stroke-width="1" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />

    <text text-anchor="middle" fill="#e13137">
        <textPath class="my-text" href="#wavepath" startOffset="50%">My text is on a wavy path!</textPath>
    </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d603ad5b7e2e467ead92d2adbbaa9ce2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=375318&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/ZEZBxzp

  


如果你不希望路径在 SVG 画布中呈现，最简单的方式是将 `<path>` 放置在 `<defs>` 元素内：

  


```XML
<svg class="svgwave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 301 21">
    <defs>
        <path id="wavepath" d="M0,.5c30.0978,0,30.0978,20,60.1956,20S90.2948.5,120.394.5s30.1,20,60.2,20c30.1015,0,30.1015-20,60.203-20s30.1014,20,60.2029,20" fill="none" stroke="#fefefe" stroke-width="1" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />
    </defs>
    <text text-anchor="middle" fill="#e13137">
        <textPath class="my-text" href="#wavepath" startOffset="50%">
          My text is on a wavy path!
        </textPath>
    </text>
</svg>
```

  


> Demo 地址：https://codepen.io/airen/full/QWPGmpy

  


你可能已经注意到了，示例中的 `<textPath>` 元素除了使用了 `href` 属性来引用路径之外，还设置了一个 `startOffset` 属性。`startOffset` 属性允许你偏移路径的起点以获得初始文本位置。它采用长度作为值，可以是百分比或数字。如果使用后者，则数字表示当前坐标系中的路径距离。

  


你可以尝试着拖动下面示例中的滑块，调整 `startOffset` 的值，这样你就可以看到它的工作原理：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab71e154ac5a4a4ea3863f144c5f1356~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=462&s=2827828&e=gif&f=229&b=041e46)

  


> Demo 地址：https://codepen.io/airen/full/MWRbVGo

  


实际上，你可以不使用 `startOffset` 来偏移路径。将 `<textPath>` 上的 `startOffset` 属性删除，并在它的父元素 `<text>` 元素上设置 `x` 的坐标：

  


```XML
<svg class="svgwave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 301 21">
    <path id="wavepath" d="M0,.5c30.0978,0,30.0978,20,60.1956,20S90.2948.5,120.394.5s30.1,20,60.2,20c30.1015,0,30.1015-20,60.203-20s30.1014,20,60.2029,20" fill="none" stroke="#fefefe" stroke-width="1" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />
    <text text-anchor="start" fill="#e13137">
        <textPath id="textPath"  href="#wavepath" startOffset="0%">
          My text is on a wavy path!
        </textPath>
    </text>
    
    <text text-anchor="start" fill="lime" fill-opacity="0.5" x="0%" id="text">
        <textPath href="#wavepath">
          My text is on a wavy path!
        </textPath>
    </text>

</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97b6b14e1fe645ecab126b6d95f2cdf7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=554&s=6511891&e=gif&f=248&b=031e46)

  


> Demo 地址：https://codepen.io/airen/pen/vYMyRZb

  


上面这个示例中，红色文本是通过改变 `<textPath>` 的 `startOffset` 属性来设置文本在路径上的起始偏移位置；带透明度的绿色文本则是通过改变 `<text>` 的 `x` 坐标来设置文本在路径上的起始偏移位置。你会发现它们的效果看起来是相同的。请注意，示例中只给 `<text>` 元素设置了 `x` 的值，但文本在 `x` 和 `y` 方向上都沿着路径移动。`x` 的值沿着路径平移文本，不要将其视为水平和垂直，而应该视为平行和垂直于路径。

  


这意味着，使用 `<animate>` 你可以制作一个文本沿指定路径运动的动画效果：

  


```XML
<svg class="svgwave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 301 21">
    <path id="wavepath" d="M0,.5c30.0978,0,30.0978,20,60.1956,20S90.2948.5,120.394.5s30.1,20,60.2,20c30.1015,0,30.1015-20,60.203-20s30.1014,20,60.2029,20" fill="none" stroke="#fefefe" stroke-width="1" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />

    <text text-anchor="middle" fill="#e13137">
        <textPath class="my-text" href="#wavepath" startOffset="50%">
            <animate attributeName="startOffset" from="-50%" to="150%" begin="0s" dur="3s" repeatCount="indefinite" />
          My text is on a wavy path!
        </textPath>
    </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3570ee115244969a5c26fc184d3314e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1138&h=522&s=1559423&e=gif&f=69&b=0b0923)

  


> Demo 地址：https://codepen.io/airen/full/qBwqoQQ

  


注意，`<animate>` 涉及到 SVG 动画相关的知识，小册后面会专门介绍这方面的知识。如果你现在迫切就想知道 SVG 动画相关的知识，建议你移步阅读《[Web 动画之旅](https://s.juejin.cn/ds/iFukErqx/)》关于 [SVG 动画那部分课程](https://juejin.cn/book/7288940354408022074/section/7308623638335815692)！另外，[CSS 中的 offset-path 和 offset-distance 结合](https://juejin.cn/book/7288940354408022074/section/7308623339038670860)在一起也可以创建文本沿着指定路径运动的动画效果。

  


`<textPath>` 元素的另两个属性是 `method` 和 `spacing` ，你可能不会经常使用这两个属性。因为它们都是用来细化文本（或间距）在路径上的呈现方式的。

  


这里简单的介绍一下它们：

  


-   `method` ：它允许你指定字形应如何沿路径呈现的两种方式之一。它接受 `align` 和 `stretch` 两个值，其中 `align` 是默认值。`align` 值使用简单的 `2×3` 转换方式呈现字形，使得字形既不拉伸也不扭曲。`stretch` 值将拉伸并可能扭曲字形，但根据路径的不同，可能看起来更好。
-   `spacing` ：它类似地调整了沿路径渲染的文本（或文本间距）。它接受 `exact` 和 `auto` 两个值，其中 `exact` 是默认值。`exact` 值会告诉浏览器按照文本在路径上的布局规则精确呈现字形。

  


另外，在 SVG 2 中，`<textPath>` 还新增了 `d` 和 `side` 两个属性：

  


-   `d` 属性与你用于设置路径的 `d` 属性相同。SVG 2 将允许你直接在 `<textPath>` 元素上设置它，这样就不需要在 SVG 文档中额外使用 `<path>` 元素来设定路径。如果一个 `<texgtPath>` 元素同时包含 `d` 属性和 `href` 属性，那么 `href` 属性将会被忽略，而在 `d` 上设置的路径将是文本呈现的路径。
-   `side` 属性将采用 `left` （默认值） 或 `right` 值，它有效地反转路径

  


## SVG 文本案例

  


通过上面的学习，我想你对 SVG 文本有了一定的认识。接下来，通过几个具体的案例来加强你对 SVG 文本的理解。

  


### 文本描边效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/655c336c3d464ac197085768b92ba778~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1460&h=730&s=34164&e=jpg&b=180d23)

  


文本描边的效果是 Web 应用或页面上常见的文本效果。在 CSS 中通常会使用 `text-shadow` 或 `text-stroke` 给文本添加描边效果。但使用 SVG 文本可能会创建出最好看的文本描边效果。除了效果好之外，使用也非常简单。你只需要在 `<text>` 元素设置 `stroke` 和 `stroke-width` 两个属性值即可，前者设置描边颜色，后者设置描边的粗细。当然，你也可以给 `<text>` 设置一个 `fill` 属性，给文本设置一个填充色：

  


```XML
<svg class="text" viewBox="0 0 1200 600">
    <text x="15" y="150" fill="#e13137" stroke="lime" stroke-width="4">Coca-Cola is Cool!
  </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5843bf009bfd443eb999c23c1426a44d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=331837&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/yLrVjBp

  


使用 SVG 描边创建双重轮廓或多重轮廓文本效果也非常简单，只需对上面的代码进行几处修改即可：

  


```XML
<svg  viewBox="0 0 800 600" class="text">
    <!--   创建双重描边 -->
    <g>
        <text stroke="#e13137" stroke-width="12" x="50%" y="40%">Coca-Cola is Cool!</text>
        <text stroke="dodgerblue" stroke-width="4" x="50%" y="40%">Coca-Cola is Cool!</text>
    </g>
    
    <!-- 创建多重描边  -->
    <g>
        <text stroke="#e13137" stroke-width="20" x="50%" y="70%">Coca-Cola is Cool!</text>
        <text stroke="dodgerblue" stroke-width="12" x="50%" y="70%">Coca-Cola is Cool!</text>
        <text stroke="orange" stroke-width="4" x="50%" y="70%">Coca-Cola is Cool!</text>
    </g>
</svg>
```

  


```
text {
    font-family: "Leckerli One", cursive;
    font-size: 120px;
    text-anchor: middle;
    fill: none;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/783b6d344e5848448c210cfc573401ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=871685&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/yLrVjev

  


只需在 SVG 中添加多个带有不同描边值的 `<text>` 元素即可。请注意，要从最粗的描边开始，逐渐使用较细的描边值（`stroke-width`）。因为文本元素将叠加在彼此之上，形成多重描边文本效果。

  


你甚至还可以借助 SVG 滤镜来创建描边的效果：

  


```XML
<svg viewBox="0 0 800 600" class="text">
    <defs>
        <filter id="stroke-text-svg-filter">
            <feMorphology operator="dilate" radius="2"></feMorphology>
            <feComposite operator="xor" in="SourceGraphic" />
        </filter>
    </defs>

    <text fill="red" filter="url(#stroke-text-svg-filter)" x="50%" y="50%">Coca-Cola is Cool!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0295854e558544ff81a60b08ed65824d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=441427&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/OJGbZmp

  


SVG 滤镜具有很多神奇的功能，它允许你创作很多与众不同的文本效果，例如下面这个示例，使用 SVG 滤镜制作出一个带有玻璃效果的文本：

  


```XML
<svg viewBox="0 0 800 600" class="text">
    <defs>
        <filter id="distortion">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="textFilter">
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="dark_edge_01" />
            <feOffset dx="5" dy="5" in="dark_edge_01" result="dark_edge_03" />
            <feFlood flood-color="rgba(0,0,0,.5)" result="dark_edge_04" />
            <feComposite in="dark_edge_04" in2="dark_edge_03" operator="in" result="dark_edge" />
          
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="light_edge_01" />
            <feOffset dx="-2" dy="-2" in="light_edge_01" result="light_edge_03" />
            <feFlood flood-color="rgba(255,255,255,.5)" result="light_edge_04" />
            <feComposite in="light_edge_04" in2="light_edge_03" operator="in" result="light_edge" />
          
            <feMerge result="edges">
                <feMergeNode in="dark_edge" />
                <feMergeNode in="light_edge" />
            </feMerge>
            <feComposite in="edges" in2="SourceGraphic" operator="out" result="edges_complete" />
    
            <feGaussianBlur stdDeviation="5" result="bevel_blur" />
            <feSpecularLighting result="bevel_lighting" in="bevel_blur" specularConstant="2.4" specularExponent="13" lighting-color="rgba(60,60,60,.4)">
                <feDistantLight azimuth="25" elevation="40" />
            </feSpecularLighting>
            <feComposite in="bevel_lighting" in2="SourceGraphic" operator="in" result="bevel_complete" />
    
            <feMerge result="complete">
                <feMergeNode in="edges_complete" />
                <feMergeNode in="bevel_complete" />
            </feMerge>

        </filter>
    </defs>
    
    <clipPath id="clip">
        <text x="50%" y ="50%" dominant-baseline="middle" text-anchor="middle">Coca-Cola is Cool!</text>
    </clipPath>
    
    <image href="https://picsum.photos/1920/1024?random=1" x="-50%" y="-50%" />
    <image href="https://picsum.photos/1920/1024?random=1" x="-50%" y="-50%" clip-path="url(#clip)" filter= "url(#distortion)" />
        
    <text x="50%" y ="50%" dominant-baseline="middle" text-anchor="middle" filter="url(#textFilter)">Coca-Cola is Cool!</text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de9486ce199a478d8c750f4111f4a1eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=897154&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/wvZojrq

  


会不会因为看到这些神奇的 SVG 标签元素感到恐惧，不用担心，随着后续课程的学习，你会明白这些标签起什么作用，你也能使用这些标签元素创作出更精美的图形效果。

  


### Web 中不规则形状的文本

  


通常情况下，在 Web 开发过程中涉及将不规则形状的文本时会使用图片。然而，使用 SVG 可以创建动态、响应式和可访问的图形。

  


在 SVG 中你只需要将 `<path>` 和 `<textPath>` 结合起来使用，你就可以将文本放置在任何不规则的形状上。例如下面这种将文本放置在不规则的丝带上的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f22385e6423c4c31827142e8508498fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1151&s=231138&e=jpg&b=ffffff)

  


首先，你可以使用诸如 Figma 这样的图形设计软件来获得所需要的丝带图形，并为每个图形添加一个路径，用于放置文本，如下图中手虚线，就是放置文本所需要的路径：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f19bcd6d13a40d397627c6492b15236~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=945&s=303724&e=jpg&b=0b0b27)

  


对应的 SVG 代码如下：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 691.3 201.8" class="text">
    <!-- 丝带一 -->
    <g id="banner">
        <path d="M148.6 79.6V21.7c-6.6-3.1-13.7-5.6-20.7-7.7C86.6 1.7 42.7-1.8 0 3.7c25.3 17.2 47.2 39.5 64.1 65.1-20.7 9.5-39.2 23.8-53.6 41.4C52 112.3 93 123.8 129.3 144l19.3-64.4zM549.7 121.8v57.9c45 16.4 94 22 141.6 16.2-27.4-15.1-50.8-37.4-67.1-64 13.4-3.9 26.3-9.4 38-16.9 10.6-6.7 20.2-15.1 28-24.8-39-3.5-77.1-15.7-114.3-28.4l-26.2 60z" fill="#139faa"/>
        <path d="M105 46c0-13.7 11.2-24.8 24.9-24.6l18.7.3v46.5c-13.5-4.8-26.5-11.1-38.5-18.8L105 46zM549.7 179.7v-39.9c14.8 5.8 28.9 13.3 41.7 22.6 0 9.6-7.8 17.4-17.4 17.4h-24.3z" fill="#01686b"/>
        <path d="M591.3 160.8v1.6c-26.5-19.1-58.4-31-90.9-35.1-45.1-5.7-91.4 3-133.2 20.8-35.8 15.2-69 37-106.5 47.3-52.4 14.5-111 4-155.7-26.8V46.1C149.7 77 208.2 87.4 260.7 73c37.5-10.3 70.7-32.1 106.5-47.3C409.1 7.8 455.3-.9 500.4 4.8c32.5 4.1 64.4 16 90.9 35.1v120.9z" fill="#3dc0d1"/>
      </g>
      
      <!-- 放置文本的路径 -->
      <path id="text-path" d="M108.7 124.1c44.2 29 101 38.4 152 24.4 37.5-10.3 70.7-32.1 106.5-47.3 41.9-17.8 88.1-26.4 133.2-20.8 31.7 4 62.7 15.3 88.7 33.6" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6"/>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 691.3 201.8" class="text">
    <!-- 丝带二 -->
    <g id="banner-02">
        <path d="M106.7 59.6C60.4 68.4 21.1 89.5 3.6 100c21.2 10 43.4 18 66.1 24-9.1 23-17.3 46.3-24.5 70 27.7-13.9 94.4-44.2 172.9-56.6.9-11.7-2.6-23.6-9.7-32.9L106.7 59.6z" fill="#139faa"/>
        <path d="M218.1 137.4c-.2 0-.3 0-.5.1l-2.1.3c-.3 0-.6.1-1 .1-11 1.6-46.1 6-89.2 1.2 28.3-11.8 58.2-20.1 88.4-25.8 3.5 7.5 5 15.9 4.4 24.1z" fill="#01686b"/>
        <path d="M584.5 59.6c46.3 8.8 85.6 30 103.1 40.5-21.2 10-43.4 18-66.1 24 9.1 23 17.3 46.3 24.5 70-27.7-13.9-94.4-44.2-172.9-56.6-.9-11.7 2.6-23.6 9.7-32.9l101.7-45z" fill="#139faa"/>
        <path d="M345.6 104.3c46.5 0 81.1-.1 124.9 7.7 32.6 5.8 64.9 14.4 95.5 27.1 6.5-19.7 23.2-70.3 32.7-99.4-35.6-13.2-73.2-22.1-111.2-28.1C437.8 3.9 398.4 4 345.6 4c-52.8 0-92.2-.1-141.9 7.7-38.1 6-75.7 14.9-111.2 28.1 9.6 29 26.2 79.7 32.7 99.4 30.6-12.7 62.9-21.3 95.5-27.1 43.8-7.9 78.5-7.8 124.9-7.8z" fill="#3dc0d1"/>
        <path d="M473.1 137.4c.2 0 .3 0 .5.1l2.1.3c.3 0 .6.1 1 .1 11 1.6 46.1 6 89.2 1.2-28.3-11.8-58.2-20.1-88.4-25.8-3.4 7.5-5 15.9-4.4 24.1z" fill="#01686b"/>
    </g>
    <!-- 放置文本路径 -->
    <path id="text-path-02"  d="M116.7 96.2c28.3-8.8 57.6-15.2 87.1-19.9 49.7-7.8 89.1-7.7 141.9-7.7 52.8 0 92.2-.1 141.9 7.7 30.2 4.7 60.1 11.3 88.9 20.4" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />
</svg>
```

  


注意，上面两点黑色虚线的 `<path>` 仅是为了能更好的向大家展示，后面可以将 `#text-path` 和 `#text-path-02` 两个 `<path>` 元素放到 `<defs>` 标签中。

  


接着添加所需要的文本，并在 `<textPath>` 元素上使用 `href` 引入文本所需路径：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 691.3 201.8" class="text">
    <defs>
        <!-- 放置文本所需的路径 -->
        <path id="text-path" d="M108.7 124.1c44.2 29 101 38.4 152 24.4 37.5-10.3 70.7-32.1 106.5-47.3 41.9-17.8 88.1-26.4 133.2-20.8 31.7 4 62.7 15.3 88.7 33.6" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />
    </defs>
    <g id="banner"><!-- 丝带 --></g>

    <!-- 需要放置的文本 -->
    <text>
        <textPath href="#text-path" startOffset="50%">Coca-Cola is Cool!</textPath>
    </text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 691.3 201.8" class="text">
    <defs>
        <!-- 放置文本所需的路径 -->
        <path id="text-path-02" d="M116.7 96.2c28.3-8.8 57.6-15.2 87.1-19.9 49.7-7.8 89.1-7.7 141.9-7.7 52.8 0 92.2-.1 141.9 7.7 30.2 4.7 60.1 11.3 88.9 20.4" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="8" stroke-dashoffset="4" stroke-miterlimit="6" />
    </defs>
    <g id="banner-02"><!-- 丝带 --></g>

    <!-- 需要放置的文本 -->
    <text>
        <textPath href="#text-path-02" startOffset="50%">Coca-Cola is Cool!</textPath>
    </text>
</svg>
```

  


使用 CSS 给 `textPath` 添加一点样式：

  


```CSS
textPath {
    font-family: "Leckerli One", cursive;
    fill: oklch(0.35 0.07 194.63);
    font-size: 325%;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-anchor: middle;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}
```

  


最终你所看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73b6949f5d80404c81d541ab8dc09282~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=945&s=385726&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/bGJBKBm

  


[@Wheatup 在 CodePen 上提供了一个与 Web UI 结合的更紧密的案例](https://codepen.io/wheatup/full/rXJrYm)，采用与上面思路一样的方案，在将文本放大卡片背景不规则形状（也类似一个丝带）上：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e79568ff2ec49ac9d8e9d8a16923d44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1064&s=557662&e=jpg&b=e6e5e5)

  


> Demo 地址：https://codepen.io/wheatup/full/rXJrYm （来源于 [@Wheatup ](https://codepen.io/wheatup/full/rXJrYm)）

  


### Web 上的圆形文本

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1846efe284a04ca6890870852cb253d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1235&s=1297001&e=jpg&b=f7eae1)

  


你是否曾经有过这样的需求，将文本放置在一个圆环。面对这样的一个需求，你是还在使用图片做为解决方案呢？还是思考着更优雅，更完美的方案呢？

  


我想告诉大家的是，当下要实现这样的需求并不是件难事，有多种不同的解决方案可以帮助你实现，例如，使用 [CSS 自定义属性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)和 [CSS 的三角函数](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)，你可以完全拥有一个纯 CSS 的解决方案。例如 [@Jhey](https://codepen.io/jh3y) 在 CodePen 上提供的这个解决方案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0adc6d349b4d4c78987cd396055e9185~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=762&s=1146392&e=gif&f=307&b=2c3239)

  


> Demo 地址：https://codepen.io/jh3y/full/QWVwppw （来源于 [@Jhey](https://codepen.io/jh3y) ）

  


除了纯 CSS 的解决方案之外，还可以使用 SVG 的 `textPath` 来实现。你只需要将文本放置在一个圆形的路径上即可：

  


```XML
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="text">
    <path id="circlePath" fill="none" stroke-width="2" stroke="hsl(10 100% 50% / 0.5)" d=" M 10, 50 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0 " />
    <text id="text"  font-size="14" font-weight="bold" fill="hsl(0 100% 50%)">
        <textPath id="textPath" href="#circlePath">Coca-Cola is Cool! Coca-Cola is Cool!</textPath>
    </text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91ecec45e7c74c3e947c208730ab7a87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1235&s=482666&e=jpg&b=0b0b27)

  


> Demo 地址：https://codepen.io/airen/full/KKYNBPp

  


这种方案有两点需要注意。第一点就是你不能直接使用 `<circle>` 绘制的圆形当作 `<textPath>` 路径。这意味着你需要将一个圆（`<circle>`）转换为一个路径（`<path>`）。你可以采用下面这种方式快速将圆转换为路径：

  


```XML
<circle id="MyPath"  fill="none"  stroke="red"  cx="50"  cy="50"   r="25"  />

<!-- 
    转换为路径
    CX 对应的是 circle 元素的 cx
    CY 对应的是 circle 元素的 cy
    R 对应的是 circle 元素的 r    
-->
<path d="
    M (CX - R), CY
    a R,R 0 1,0 (R * 2),0
    a R,R 0 1,0 -(R * 2),0
   "
/>
```

  


> 注意，如果你不喜欢这种转换方式，你可以通过 Figma 将圆转换为路径！

  


另外一点就是，你需要选择是否使用 `textPath` 的 `textLength` 属性。这可以将文本沿着路径分布。它的值将是圆的周长：

  


```
<textPath href="#circularPath" textLength={Math.floor(Math.PI * 2 * RADIUS)}</textPath>
```

  


下面这个案例，你可以更改文本并查看 `textLength` 的使用方式。你可以更改半径和字体大小。另一个功能是文本将遵循路径方向。这使得文本很容易在路径内（圆内）或路径外（圆外）相互翻转：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ca4bba3aef744118435ae5893ec13d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=576&s=2388969&e=gif&f=375&b=2c3138)

  


> Demo 地址：https://codepen.io/jh3y/full/ZEMYebW （来源于 [@Jhey](https://codepen.io/jh3y) ）

  


感兴趣的小伙伴，或者想挑战一下自己的，可以尝试实现下图这个效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2d3240c18a94425811043c34a75f57b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=794&s=281597&e=jpg&b=ffffff)

  


### 给文本添加动画效果

  


SVG 的 `<text>` 文本还可以结合其他的 SVG 特性与 CSS 相关特性，给 SVG 文本添加动画效果。例如下面这个示例，将 `<text>` 嵌套在 `<clipPath>` 中，再将多个不同路径作为剪切文本的填充物，然后使用 CSS 动画，轻易让你实现很有创意的 Blob 动效：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0d03b6478f2406ab70857e4e80490ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1468&h=622&s=2015797&e=gif&f=99&b=0b0a24)

  


> Demo 地址：https://codepen.io/airen/full/MWRbBbb

  


详细代码请查看案例源代码！

  


## 小结

  


SVG 文本元素是用于在 SVG 图像中呈现文本的重要组成部分。SVG 文本元素允许在图形中插入文本内容，并且可以通过多种方式进行定位、样式化和控制。

  


首先，SVG 文本元素可以通过 `<text>` 标签嵌入到 SVG 图像中。这个标签允许我们直接在 SVG 图形中插入文本内容，并且可以通过 `x` 和 `y` 属性来定位文本的起始点。此外，还可以通过设置 `font-family`、`font-size`、`font-weight`、`text-anchor` 等属性来控制文本的字体、大小、粗细和对齐方式等。

  


其次，SVG 文本元素支持使用 `<tspan>` 标签来创建多行文本或者在文本中应用不同的样式。通过 `<tspan>` 标签，我们可以将文本内容分成多行，并且可以为每一行设置不同的样式，例如不同的字体、大小或颜色。

此外，SVG 文本元素还支持在曲线、路径或自定义形状上布局文本。通过使用 `<textPath>` 元素，我们可以将文本沿着指定的路径进行排列，实现沿着曲线或路径绘制文本的效果。这为设计师提供了更加灵活的排版选择，可以创造出各种独特的文本效果。

  


总的来说，SVG 文本元素是 SVG 图形中的重要组成部分，它提供了丰富的功能和灵活的控制选项，可以帮助设计师实现各种各样的文本效果，并且在创建可缩放的矢量图形时起着关键作用。通过合理地利用 SVG 文本元素的各种属性和特性，设计师可以创造出更加生动、丰富和具有创意的 SVG 图形。