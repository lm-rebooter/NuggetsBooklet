Web 排版设计的好坏会直接影响 Web 应用或页面的体验，而“字体”在 Web 排版中又是重中之重，良好的字体可以给 Web 排版的设计、可读性和整体体验带来巨大的好处。虽然 Web 已进入一个新的、令人兴奋的、未知的领域，但 Web 字体自古以来一直是静态和停滞不前的。幸运的是，2015 年开始推出了 OpenType 字体格式，以一些非常显著的方式改变了开发者面临的实际困难。

也就是说，这一切都随着“可变字体”（可变字体是 OpenType 规范中的一部分）的出现而发生了变化，它们彻底改变了我们与 Web 字体互动的方式。可变字体释放了一个全新的创意世界，同时增强了网站的可读性、可访问性、灵活性和响应性。Web 开发者不再需要依赖带有固定设计限制的标准静态字体，可以采用可变字体来解锁数千种排版变体以及字体动画，并创建独特的自定义字体样式。

在这节课中，我们将探讨可变字体是什么，它们与标准静态字体相比具有哪些优点，Web 开发者又应该如何使用它们，以及如何给不支持可变字体的浏览器做降级处理或提供相应的回退方案，以确保不支持可变字体的浏览器仍然可以正确显示字体。

## 设计师和开发人员面临的挑战

众所周知，Web 设计与印刷设计有所不同，Web 设计师和开发人员虽然不会受版面的物理尺寸和可以使用的颜色数量等限制，但他们同样也有其他的限制，其中一个重要的限制是与我们的设计相关的带宽成本。这一点一直是构建一个丰富的、有创意的 Web 排版体验的最大难点，因为它们需要付出昂贵的代价。

就拿“字体”为例。

“字体”这个话题对于 Web 开发者而言，并不是件易事。一直以来，Web 开发者都在Web 应用或页面上想要使用的字体数量和用户需要下载的数量之间做相应的平衡。因为，使用传统的 Web 字体，我们设计中使用的每个样式都需要用户下载单独的字体文件，这会增加延迟和页面渲染时间。仅包含常规和粗体样式以及它们对应的斜体，就可能达到 `500kb` 或更多的字体数据。这甚至还没有解决字体的渲染方式，我们需要使用的回退方案或不良影响（比如 FOIT 和 FOUT）等问题。

在开发中，字体（Font）和字型（Typeface）这两个词通常可以互换使用，但它们有所不同：字型是底层的视觉设计，可以在许多不同的排版技术中存在，而字体是其中的一个数字文件格式。换句话说，字型是你看到的东西，字体是你使用的东西。

另一个常被忽视的概念是风格（Style）和系列（Family）之间的区别。风格是一种单独的特定字型，例如加粗斜体，而系列是完整的一组风格（也称字体族）。

在可变字体之前，每个字体风格都是用单独的字体文件实现的。因此，许多 Web 开发人员选择不使用这些功能，降低了用户的阅读体验。

来看一个具体的示例。假设在你的一个 Web 项目中，需要 `Roboto` 和 `Open sans` 两种静态字体，其中 `Roboto` 用于标题，而 `Open sans` 用于段落文本。你实际上正在选择一个“字体族”，而字体族又包括不同的“字体样式”，比如不同字重和斜体所形成的变化。

在我们的示例中，假设你需要 “light 300”、“regular 400” 、“semi bold 600”、“bold 700” 和 “regular 400 italic” 等字体样式变体。你需要为每种字体样式（或使用[ Google Fonts ](https://fonts.google.com/specimen/Open+Sans?query=Open+Sans)的嵌入链接）下载分别针对 `Roboto` 和 `Open Sans` 的单独文件：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11146591355847f0be37bbd1a94409a1~tplv-k3u1fbpfcp-zoom-1.image)

按照我们上面的 `Roboto` 和 `Open Sans`的示例情况来看，你最终需要 `22` 个文件，总大小约为 `3MB`！每个访问者的浏览器都会下载这些字体文件，以准确显示所需字体。这会导致网站加载时间激增，并会给任何访问者令人沮丧的用户体验，尤其是在较慢的移动连接下。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bff828af5764d0eb9f7162728f49f46~tplv-k3u1fbpfcp-zoom-1.image)

可以说，传统的静态字体没有任何灵活性，仅限于一定数量的固定字体样式，如“light”、“regular”、“regular-italic”、“semi-bold”、“bold”、“extra-bold”。例如，`Open Sans` 字体系列仅有 `10` 种样式，而 `Roboto` 的字体系列则有 `12` 种样式。一些字体系列，如 `Lobster` 和 `Abril Fatface`，只有一个可用的字体样式。这就是可变字体的用武之地，它可以为开发者解锁来自单个文件的潜在数千个字体样式变体，而不会影响性能。

## 什么是可变字体？

可变字体是数字时代的一种字体技术。[@John Hudson 对可变字体是这样解说的](https://medium.com/variable-fonts/https-medium-com-tiro-introducing-opentype-variable-fonts-12ba6cd2369)：

> 可变字体文件是一种字体文件，它的行为类似于多种字体。

传统上，大多数网站使用的字体都属于同一字体族。每种字体都存储在一个单独的文件中，并具有一组独特的属性，比如字宽、字重和样式。现在，在一个 OpenType 可变字体文件中，可以存储多种字体样式。也就是说，可变字体将字体所有变化都存储在一个字体文件中，并且字体的大小相对较小。与静态字体相比，可变字体允许你在一个范围内使用字体的字宽、字重和样式等。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/002f9811764b4eb0a82d3ad69fd33184~tplv-k3u1fbpfcp-zoom-1.image)

例如，大多数字体族都包含一组字体，这些字体具有 `100~900` 的不同字重（`font-weight`）。可变字体提供了在指定范围内使用任何字重的能力。因此，如果在你的网站上使用 `font-weight: 700` 是一个最佳的效果，那么你就可以使用字重为 `700` 的字体。另外一点就是，可变字体文件要比静态字体文件小得多，这是因为可变字体中每个字符只有一个结构。构建此结构的点具有可操作性，比如可以移动这些点，从而创建出另一个权重的指令。然后插入各个样式，这意味着它们是在浏览器内动态绘制的。这也使得在半粗体和粗体之间生成不同的样式成为可能。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87230eb21afc480cab82ab6b1f8ef9c1~tplv-k3u1fbpfcp-zoom-1.image)

插值可以在不同的轴上发生变化，比如字重的轴上。这样可以创造一个具有层次感的字体样式。还有一些命名的实例，比如 `regular` 或 `font-weight: 700`都可以工作，但你还可以选择两者之间的任何设计。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bc3091118244ad381731f77867b8ad7~tplv-k3u1fbpfcp-zoom-1.image)

可变字体可以包含多个轴。你可以添加一个字宽的轴到字重轴上，并获得更多的风格。由 [@Dalton Maag 设计的Venn](https://daltonmaag.com/library/venn)，在这些例子中使用的可变字体，支持 `300~800` 的字重和 `75%~125%` 的字宽。这意味着，如果你把这些范围（`500×50`）相乘，就可以得到 `25000` 种风格的 `Venn`，而且文件大小约 `112kb`，这已经非常完美了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9855e2ea3f324a95baac990db2d4a602~tplv-k3u1fbpfcp-zoom-1.image)

在可变字体中，常见的“注册轴”有：字宽（`width`）、字重（`weight`）、斜度（`slant`）、斜体（`italic`）和光学尺寸（`optical size`）等，但注册轴是可以扩展的，这样设计师可以定义他们自己所需的自定义轴，并允许他们创建任何类型的变化。

在 Web 方面，这意味着我们可以加载单个文件，而不是为每个字体样式变体加载独立的文件。通过 CSS `@font-face` 和样式规则的帮助，可以创建数千种不同的字体重量、宽度和样式变体。此外，与静态字体不同，可变字体支持 CSS 过渡和动画属性，有助于在各种字体样式之间实现流畅地转换和实现动画效果。可变字体还可以创建自定义字体样式，这对于创建独特的品牌和标志设计非常有用，可以使你的设计与众不同。

需要注意的是，尽管可变字体文件的大小与传统静态字体文件相比略大，但总体上可变字体提供了更好的效率。考虑到平均而言，你至少需要每种字体系列 `4 ~ 5` 种字体样式变体，单个可变字体文件的大小显著小于 `4 ~ 5`个静态字体文件的组合大小。

## 如何处理可变字体？

可变字体背后的关键概念是“**变体系数轴**”。这些变体系数轴控制字体样式的所有方面，比如字母的粗细、宽窄，以及字母是否为斜体。

可变字体定义了两种变体系数轴，即**注册轴（标准变体系数轴）** 和**自定义轴（自定义变体系数轴）** 。注册轴是最常见的轴，并且是显式定义的。在可变字体设计中有五个注册轴，包括字重、字宽、斜体、倾斜和光学尺寸。每个注册轴都有一个对应的四个字母的标记，可以映射到现有的 CSS 属性。

-   重量 `wgth` 轴：控制可变字体的重量。该值的范围为 `1 ~ 999`，可以使用 CSS 的 `font-weight` 属性来控制该值。
-   宽度 `wdth` 轴：控制可变字体的宽度。该值通常以百分比表示，可以从 `0％ ~ 100％`（或更高）变化。较高的值，例如 `120％` 或 `150％`，将根据字体所定义的最高允许值进行调整。可以使用 CSS 的 `font-stretch` 属性来控制该值。
-   倾斜 `slnt`轴：控制可变字体的倾斜程度。该值以 `deg` 为单位，可以在 `-90deg ~ 90deg` 之间变化。默认情况下设置为 `20deg`。可以使用 CSS 的 `font-style: oblique` 来控制该值。
-   斜体 `ital`轴：控制可变字体是否为斜体。可以使用 CSS 的 `font-style` 属性，并且将其值设置为 `italic` 或 `none`来控制该值。为避免与倾斜轴混淆，可以设置 `font-synthesis: none` 。
-   光学大小 `opsz` 轴：控制可变字体的光学大小。可以使用 CSS 的 `font-optical-sizing` 属性，并且将其值设置为 `auto` 或 `none` 来控制该值。如果要根据字体大小增加或减少字母的笔画整体厚度，则光学大小将起到作用。

除了注册轴之外，字体设计器还可以包含自定义轴。自定义轴让可变字体变得更具创造性，因为不限制自定义轴的范围、定义或数量。与注册轴类似，自定义轴具有相应的四个字母标记。例如，你定义了一个注册轴是 `grade`，其对应的字母标记是 `GRAD`。

在 CSS 中有两种方法可以定义可变字体的变体系数轴的值。第一种是使用与每个轴相关联的 CSS 属性，即 `font-weight` 、`font-stretch` 、`font-style` 和 `font-optical-sizing` 。例如：

```CSS
.element {
    font-weight: 650;
    font-style: oblique 80deg;
    font-stretch: 75%;
    font-optical-sizing: auto;
}
```

另外一种是使用 CSS 的 `font-variation-settings` 属性。该属性是 CSS 的一个新属性，是 [CSS 字体模块 Level 4](https://www.w3.org/TR/css-fonts-4/#font-rend-desc) （CSS Fonts Module Level 4）的一部分。它的语法规则如下：

```CSS
font-variation-settings：
    'wgth' <value>，
    'wdth' <value>，
    'ital' <value>，
    'slnt' <value>，
    'opsz' <value>，
    'PROP' <value>，
    …;
```

例如：

```CSS
.element {
    font-variation-settings: "wght" 650, "slnt" 80, "wdth" 65, "opsz" 70;
}
​
/* 等同于 */
.element {
    font-weight: 650;
    font-style: oblique 80deg;
    font-stretch: 65%;
    font-optical-sizing: auto;
}
```

这两种方法有一些细节上的差异。

-   使用标准 CSS 的 `font-optical-sizing` 属性设置可变字体的光学大小 `opsz` 轴时，只有 `auto` 或 `none` 两个值，它只能用于打开或关闭光学大小 `opsz` 轴。但使用 `font-variation-settings` 设置光学大小 `opsz` 轴时，可以添加数字值，例如 `font-variation-settings: "opsz" 70` 。
-   使用标准 CSS 的 `font-stretch` 属性设置可变字体的宽度 `wdth` 轴时，它的值是一个带有百分比的值，例如 `font-stretch: 65%` 。但使用 `font-variation-settings` 设置宽度 `wdth` 轴时，其值可以不带百分比，例如 `font-variation-settings: "wdth" 65` 。
-   使用标准 CSS 的 `font-style` 属性设置可变字体的斜体 `ital`轴时，它的值为 `none` 或 `italic` 。但使用 `font-variation-settings` 设置斜体 `ital`轴时，其值可以是 `0` 或 `1` ，例如 `font-variation-settings: "ital" 1` 。
-   使用标准 CSS 的 `font-style` 属性设置可变字体的倾斜 `slnt`轴时，它的值需要带上 `deg` 单位，例如 `font-style: oblique 80deg` 。但使用 `font-variation-settings` 设置倾斜 `slnt`轴时，它的值可以不带 `deg` 单位，例如 `font-variation-settings: "slnt" 80` 。

但需要注意的是，自定义变体系数轴只能使用 `font-variation-settings` 来设置，例如 `font-variation-settings: "GRAD" 90` 。

在 CSS 中，这两种方法将产生相同的输出。但是，根据 W3C 的建议，使用标准 CSS 属性（`font-weight` 、`font-stretch` 、`font-style` 和 `font-optical-sizing` ）来控制五个标准变体系数轴的值，这有助于浏览器理解并深入了解所有字体变体的含义，并将其应用于其他格式。但是，如上所述，对于控制自定义变体系数轴，需要使用 `font-variation-settings` 属性。

现在让我们看一下五个注册轴是什么，以及如何使用它们。

### 字重（Weight）

五个注册轴中可能属字重最明显，几乎所有的字体都至少设计普通（Regular）和粗体（Bold），而且还有像更轻（Lighter）、更薄（Thinner）和更粗（Bolder）等极端现象。对于可变字体，可以使用 CSS 的 `font-weight` 属性提供一个介于为字体定义的最小值和最大值之间的数字，而不仅仅是一个关键词（比如 `normal` 或 `bold`）。根据 OpenType 规范，对于任何给定的字体，`400` 对应的是 `normal`，但是在实践中，你将看到目前它可以根据字体的不同有很大变化。

```CSS
p {
    font-weight: 425;
}
strong {
    font-weight: 675;
}
```

你也可以使用 CSS 的 `font-variation-settings` 属性，像下面：

```CSS
:root { 
    --text-vf-wght: 400; 
} 
​
.element { 
    font-variation-settings: "wght" var(--text-vf-wght); 
} 
```

在上面的例子中，`wght` 对应的是 CSS 的 `font-weight`，而 `var(--text-vf-wght)` 是其值 `400` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1126f739ac354ddc8c54923a204034fd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJNXOW>

这样做的好处是，能够利用更广泛的范围来做一些事情，例如在超薄重量下添加大引用或使用超重重量添加更多强调。此外，你还可以使用不同的方式来理解“粗体”的形式。例如，你可以将 `strong` 的 `font-weight` 设置为 `500 ~ 600` 之间，而不是默认的 `700` 。

### 字宽（Width）

字体设计的另一个常见变化是字宽。它通常被称为压缩（Condensed）或扩展（Expanded）。根据相关规范可得知，`100` 对应的是 `normal` 字宽，其有效值是 `1~1000`。和字体权重（字重）类似，在 CSS 中也有相应的标准属性 `font-stretch`，并以百分比的形式表示。在早期阶段，许多设计人员不一定遵守这个标准的数值范围，所以在 CSS 中看起来有点奇怪，但是 `3%~5%` 的范围仍然有效。在 Web 的使用中，可以像字宽类似有两种方式。第一种是使用 CSS 标准属性 `font-stretch`：

```CSS
.element { 
    font-stretch: 89%; 
} 
```

也可以像下面这样使用 `font-variation-settings` 属性：

```CSS
:root { 
    --text-vf-wdth: 95; 
} 
​
.element { 
    font-variation-settings: 'wdth' var(--text-vf-wdth); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7be4c3cf52424fab982904e2a466350d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQGLNw>

使用这种方式，你可以尝试对文本进行收缩（稍微缩窄）。这在响应式设计中非常有用，可以避免小屏幕上的标题断行。

### 斜体（Italic）

有时候一些字体不包含斜体类型，但这种类型却又或多或少被需要。在大多数情况下，它是一个布尔值 `0` 或 `1`。通常小写字母 `a` 或 `g` 的斜体形式略有不同。虽然有可能有一个范围，而不是严格意义上的 `0` 或 `1`，但关闭或打开场景可能是你遇到的最常见的情况。不幸的是，尽管它的目的是和 CSS 的 `font-style:italic` 相匹配，但这是浏览器尚未完全实现的一个方面，因此我们不得不依赖 `font-variation-settings`属性。

```CSS
:root { 
    --text-ital: 0; 
} 
​
.element { 
    font-variation-settings: 'ital' var(--text-ital); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23a5cc3cd6ff49af83905a53b130a41f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dyQMBBg>

### 倾斜（Slant）

可变字体中倾斜轴类似于斜体，但在两个关键方面有所不同。首先，它在一个角度范围内做倾斜，根据 OpenType 规范，这个角度的范围应该是“大于 `-90` 且小于 `+90`”，其次，它不包括字形替换。通常与无衬线字体设计相关，它允许指定范围内的任何值。如果你使用的字体只有一个倾斜轴，没有斜体，你也可以使用 CSS 的 `font-style`，就像下面这样：

```CSS
em { 
    font-style: oblique 12deg; 
} 
```

如果两个轴都有（倾斜轴和斜体轴），则需要使用 `font-variation-settings` 属性：

```CSS
:root { 
    --text-slnt: 0; 
} 

.element { 
    font-variation-settings: 'slnt' var(--text-slnt); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd7bebc566a74141a1137f37cb33104f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYwVbw>

斜度轴允许在定义的范围内进行任何设置，因此可以有很多机会略微调整角度，或添加动画，以便在页面加载后，正文文字稍微变为斜体。这是一种非常微妙地吸引屏幕上文本元素注意的好方法。

### 光学尺寸（Optical Size）

光学上色是印刷设计的一个概念，它的目标是在小字体上达到最佳的可读性，在大字体上达到最佳的个性化。在金属字体时代，一切都是为特定的字体大小而优化的。例如，小字体的笔画可能会更粗，这意味着有更少的对比，同时让文本更易读；另一方面，在更大的尺寸上，可以看到更多的细节，因此有更多的对比度。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50755c6152a94c9496d0d44994ec8c20~tplv-k3u1fbpfcp-zoom-1.image)

在可变字体中，这个轴的数值应该与 `font-size` 相匹配，并引入了一个新的 CSS 属性 `font-optical-sizing`，该属性的默认值是 `auto`。

```CSS
.element { 
    font-optical-sizing: auto; 
} 
```

你也可以强制关闭它，或者可以使用 `font-variation-settings` 属性显式设置值。

```CSS
:root {
    --text-opsz: 16;
}

body {
    font-variation-settings: 'opsz' var(--text-opsz);
}

.element {
    --text-opsz: 48;
    font-size: 3em;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e4599e1a4dc415ea2cd8918b8674106~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYwVjo>

一个好的光学尺寸轴使得字体在较小的情况下更易读，并且可以量身定制，使其大小可以产生显著的差异。

### 自定义轴

可变字体到目前为止只有五个注册轴，但是类型设计器也可以创建它们自己的轴。字体设计的任何方面都可能成为一个轴。比如衬线字体（`serif`）或小写 `x` 字母的高度（`x-height`），以及其他更具创意的方面，比如重图片。

我们来看一个示例。字体的“等级”（grade）概念，其最初只是为了补偿不同类型的纸张和印刷机上的油墨增益，从而在视觉上纠正不同的工作流程，并使每个人都能看到相同的字体。其概念是在不改变间距的情况下改变字体的重量（Weight）。创建一个高对比度模式，使文本变得更重，而不需要重新流动，可以使文本在光线较暗的情况下或在设计暗黑模式时更清晰。另外在响应分辨率较低的屏幕时，它也可以派上用场，因为在低分辨率屏幕上，类型很容易变得有点细长。

在使用自定义轴时，四个字母需要使用大写方式。比如：

```CSS
:root { 
    --text-GRAD: 0; 
} 

body { 
    font-variation-settings: 'GRAD' var(--text-GRAD); 
} 

body.dark { 
    --text-GRAD: 0.5; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb7d144be409435aab7b0905be02a831~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJaXLov>

### 运用多个注册轴

如果可变字体同时具备多个注册轴，那么我们在实际使用的时候，可以使用 `font-variation-settings` 同时在文本上运用，比如下面这样：

```CSS
:root { 
    --text-vf-wght: 400; 
    --text-vf-wdth: 95; 
    --text-vf-opsz: 80; 
    --text-vf-cntr: 100;
    --text-vf-grad: 200;
    --text-vf-prwd: 600;
    --text-vf-prwg: 210;
    --text-vf-srfr: 47.5;
    --text-vf-xhgt: 1000;
} 

.element { 
    font-variation-settings:
        "wght" var(--text-vf-wght), 
        "wdth" var(--text-vf-wdth), 
        "opsz" var(--text-vf-opsz),
        "cntr" var(--text-vf-cntr),
        "grad" var(--text-vf-grad),
        "prwd" var(--text-vf-prwd),
        "prwg" var(--text-vf-prwg),
        "srfr" var(--text-vf-srfr),
        "xhgt" var(--text-vf-xhgt); 
} 
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8a8f485db024bd2b93209ea942c669e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQbozX>

## 如何在 Web 上使用可变字体？

通过前面内容的学习，我们知道可变字体是什么了。接下来，我们一起来看看如何在 Web 上使用可变字体。简单地说，在 Web 上使用可变字体可以分以下几个步骤。

-   步骤一：获取可用的可变字体。
-   步骤二：在 CSS 中集成可变字体。
-   步骤三：找出可变字体的轴和范围值。
-   步骤四：设置可变字体样式。
-   步骤五：降级处理。

### 步骤一：获取可用的可变字体

可变字体相对来说是一项较新的技术，而且可变字体是一种特定的字体。所以在 Web 中使用可变字体时需要先确认该字体是不是可变字体。如果你自己没有可变字体，又想体验一下可变字体相关技术，那么 @Nick Sherman 的 v-fonts.com 是一个不错的选择。在这个网站上你可以找到很多可用的可变字体，而且还是开源的。另外 [@Indra Kupferschmid 还整理了一份可变字体列表](https://docs.google.com/spreadsheets/d/1ycxOqpcPA9NmCWcNbmxiY-KHEh820MucI1eO6QkKLOE/htmlview#gid=0)，你也可以从这里获取。

除此之外，[Google Fonts ](https://fonts.google.com/?vfonly)提供了很多可变字体，你只需要在 Google Fonts 页面中搜索时选择 “Show only variable fonts” 选项，那么过滤出来的字体都是可变字体：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6476cf5b41aa411a98ffdcad008885dd~tplv-k3u1fbpfcp-zoom-1.image)

当你在右上角选择带有 “Variable” 标签的字体时，你将在样式列表的底部找到可变字体版本：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11a65bb7446f4a57833a9680ee853df8~tplv-k3u1fbpfcp-zoom-1.image)

接下来创建自定义样式，在页面中你就可以获取到嵌入 Web 页面的代码：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5589faa87c64037949f0a9fefa9e7ba~tplv-k3u1fbpfcp-zoom-1.image)

代码如下：

```HTML
<html>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;469;500;600;681;700&display=swap" rel="stylesheet"> 
    </head>
</html>
```

你可以根据自己的需要去自定义样式，比如 `wght`（即 `font-weight`）的值。

### 步骤二：在样式表中集成可变字体

正如第一步所示，如果你使用的是 Google Fonts，你最终可以获取到一个 `<link>` 标签，同时指定了你所需要的字体以及你自定义的相关参数，比如：

```HTML
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;469;500;600;681;700&display=swap" rel="stylesheet"> 
```

除了 `<link>` 方式之外，还可以是 CSS 的 `@import` 方式：

```HTML
<html>
    <head>
        <style> 
            @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;469;500;600;681;700&display=swap'); 
        </style>
    </head>
</html>
```

这样你在 CSS 中就可以使用 `Oswald` 这个可变字体：

```CSS
p { 
    font-family: 'Oswald'; 
    font-weight: 681; 
} 
```

对于可变字体的集成并不是件复杂的事情，都是使用 CSS `@font-face` 来加载可变字体，其过程和 `@font-face` 加载静态字体的过程非常相似，但仍然存在一些细微差别。

首先，为了比较方便，让我们看一下如何使用 CSS 加载静态字体的基本示例：

```CSS
@font-face {
    font-family: MartianGrotesk;
    src: url('/fonts/MartianGrotesk.woff2') format('woff2');
}
```

现在，对于可变字体，在各种规范中你可以找到许多不同的加载方法，但哪种才是正确的方法？现在我们尝试使用与静态字体相同的格式，但只是将文件更改为可变版本（请注意文件名中的 `VF`）：

```CSS
@font-face {
    font-family: MartianGroteskVF;
    src: url("/fonts/MartianGroteskVF.woff2") format("woff2");
}
```

这种方法可以工作吗？简单的答案是，可以。但是这种方法的问题在于，我们没有向浏览器提供任何指示，表明这种字体是可变字体。这意味着，它将加载一种它实际上不知道如何使用的字体，而不是平稳地回退。

有几种指定可变字体的方法，尽管其中一些现在已被弃用或缺乏广泛的浏览器支持。因此如果在实际中看到它们，最好认识它们。先来看第一种，在加载可变字体的时候就指示该字体是可变字体，即使用 `-variations` 格式告诉浏览器，我们正在加载可变字体：

```CSS
@font-face {
    font-family: "MartianGrotesk-VF";
    src: url("/fonts/MartianGrotesk-VF.woff2") format("woff2-variations");
}
```

`-variations` （例如 `woff2-variations`）格式是解决这个问题的第一种标准，大多数浏览器都支持这种方法。**问题在于，它在最新的规范中已被弃用**。

第二，在许多教程中，你可能会遇到 `supports variations` 格式：

```CSS
@font-face {
    font-family: "MartianGrotesk-VF";
    src: url("/fonts/MartianGrotesk-VF.woff2") format("woff2 supports variations");
}
```

虽然上述格式在 2018 年就在 W3C 草案中展示过，但他们已经决定对其进行更改。最后，根据[最新的规范草案](https://www.w3.org/TR/css-fonts-4/#font-face-src-parsing)，应该使用以下方式：

```CSS
@font-face {
    font-family: "MartianGrotesk-VF";
    src: url("/fonts/MartianGrotesk-VF.woff2") format("woff2") tech("variations");
}
```

但不要过快使用这类声明！如果你现在尝试切换，由于缺乏广泛的支持，你可能会破坏整个 `@font-face` 指令。

那么，我们到底应该使用哪种格式呢？

我们可能不应该依赖已被弃用或尚未广泛接受的格式。但是，我们可以使用一个东西：**特性查询**。

我们可以通过 `@supports` 指令针对浏览器，并仅在他们支持可变字体时才加载它们。实际上，`@supports` 的支持范围比 `format('woff2-variations')` 还要广泛！

而且，一旦新的标准广泛可用，我们就可以轻松添加 `tech('variations')`和任何新标准可能带来的其他特性，并且我们的 `@supports` 指令可能仍然有用，因为旧浏览器在解析新格式时可能会有问题。

```CSS
@font-face {
    font-family: Martian Grotesk;
    src: url("/fonts/MartianGrotesk.woff2") format("woff2");
}
@font-face {
    font-family: MartianGroteskVF;
    src: url("/fonts/MartianGroteskVF.woff2") format("woff2");
}

body {
    font-family: MartianGrotesk;
}

@supports (font-variation-settings: normal) {
    font-family: MartianGroteskVF;
}
```

### 步骤三：找出可变字体的轴和范围值

每个可变字体的细节都有所不同，在 Web 上使用可变字体之前，必须要对可变字体所支持的细节有所了解。如果你有可变字体文件，那么可以使用 @Roel Nieskens 的 WakamaiFondue.com 网站来做检测：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/884ccbce5cf446898ce60aa50f5998c1~tplv-k3u1fbpfcp-zoom-1.image)

你只需要把本地的字体文件拖到这个网页中，那么 WakamaiFondue.com 就会自动给你生成一份有关于该可变字体相关细节的报告，显示字体的特性、支持的语言、文件大小、字形数量和字体支持的所有可变轴，并显示低/高/默认值。还会生成对应的样式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b88fac4f3364f98bf696a8e84f05c3a~tplv-k3u1fbpfcp-zoom-1.image)

同时允许你使用不同的轴，并做出相应的调整。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b94fc1b4ab024ab4ba8e075fc4234069~tplv-k3u1fbpfcp-zoom-1.image)

如果你使用的是线上托管的可变字体（比如 [Google Fonts](https://fonts.google.com/)），想了解相关信息时，可以使用 Firefox 浏览器。比如前面示例中用到的 `Amstelvar VF` 字体。在查看页面元素时，选中使用了 `Amstelvar VF` 的元素，并选择浏览器“字体”选项卡，就可以看到可变字体的相关信息：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b60590cf0574427785cc078d78f8a5f8~tplv-k3u1fbpfcp-zoom-1.image)

你可以在“字体”面板中调整你想调整的信息，在调整的同时，可以在浏览器中直接看到相应的效果，如果你选择更改选项卡，可以轻松地复制和粘贴更改后的 CSS，将其带回到自己的代码中。

```CSS
.text { 
    font-style: italic; 
    font-variation-settings: 
        "wght" 501, 
        "wdth" 57.3, 
        "slnt" -9, 
        "ital" 0, 
        "opsz" 23, 
        "MONO" 0, 
        "CASL" 0, 
        "XTRA" 572, 
        "GRAD" -0.47, 
        "XOPQ" 402; 
} 
```

整个操作过程如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b27d19f59774fc899d12ec510ec1e46~tplv-k3u1fbpfcp-zoom-1.image)

不难发现，可变字体使用的是一个范围值而不是单个值，这也是可变字体和静态字体之间的另一个区别。换句话说，加载可变字体时，我们可以将字体样式设置为一个范围值，而不是单个值。

有三个属性需要范围：字重（`font-weight`）、字体拉伸（`font-stretch`）和斜体（`font-style`），如果你的可变字体支持它们，必须声明它们。如果你没有将这些样式范围明确添加到可变字体声明中，则可能会出现不可预测的结果。例如，某些浏览器可能会尝试从字体中获取这些度量值，但有些浏览器将尝试使用默认度量值。

让我们比较一下如何添加两个文件对应于常规和粗体风格以及如何使用范围值添加单一可变字体风格。

首先是使用数字和两个文件的静态字体版本：

```CSS
/* 加载静态字体 */
@font-face {
    font-family: MartianGrotesk;
    src: url("/fonts/MartianGrotesk.woff2") format("woff2");
    font-weight: 400; /* normal */
}

@font-face {
    font-family: MartianGrotesk;
    src: url("/fonts/MartianGrotesk-bold.woff2") format("woff2");
    font-weight: 700; /* bold */
}
```

现在我们来看看可变字体版本：

```CSS
/* 加载可变字体 */
@font-face {
    font-family: MartianGroteskVF;
    src: url("/fonts/MartianGroteskVF.woff2") format("woff2-variations");
    font-weight: 100 1000;
    font-stretch: 75% 200%;
    font-style: oblique 9deg 36deg;
}
```

因此，你可以按照下面这个模板来加载可变字体：

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

### 步骤四：设置可变字体样式

通过前面几个步骤，你已经有了可变字体，并且也知道可变字体具体轴以及其范围值。有了这些信息，你就可以在 CSS 中使用相应的可变字体。

正如前面内容所提到的，在 CSS 中使用可变字体时，对于 `wght` 、`wdth` 、`ital` 和 `slnt` 轴应该尽可能使用标准 CSS 属性，即 `font-weight` 、`font-stretch` 和 `font-style` 。当然，你也可以使用 CSS 的 `font-variation-settings` 属性，只是不建议这么做。对于自定义轴，就只能使用 `font-variation-settings` 属性。

-   `font-weight`：设置可变字体的权重，它的值可以是 `1~999` 的任何数字，该属性对应可变字体的 `wght` 轴，即 `font-variation-settings: "wght" 200` 。
-   `font-stretch`：设置可变字体的字宽（可以对字体进行拉伸或挤压），其值是个百分比值，其中 `100%` 对应的是 `normal` 关键词，`50%` 对应的是 `ultra-condensed`，`200%` 对应的是 `ultra-expanded`。除此之外还有 `extra-condensed`、`condensed`、`semi-condensed`、`semi-expanded`、`expanded` 和`extra-expanded` 等关键词。该属性对应的是可变字体中的 `wdth` 轴，即 `font-variation-settings: "wdth" 50`，注意，在 `font-variation-settings` 中的 `wdth` 轴对应的值是不带百分比单位。
-   `font-style`：有两种方式，第一种是大家熟悉的方式，就是将字体设置为斜体，即 `italic`，另一种是倾斜，即 `oblique`，当 `font-style` 取值为 `oblique` 时，还可以指定字体的倾斜角度，比如 `oblique 10deg`。该属性对应可变字体中的 `ital` 和 `slnt轴` 。
-   `font-optical-sizing`：该属性用来设置字体的光学尺寸，其值有 `auto` 和 `none`。默认情况下，浏览器会将光学尺寸设置为 `auto`，如果你想将其关闭，可以将其值设置为 `none`。该属性对应的是可变字体中的 `opsz`轴，可以在 `font-variation-settings` 中指定 `opsz` ，并且其值是一个数字值。

来看一个简单的示例：

```CSS
:root { 
    --text-vf-wght: 400; 
    --text-vf-wdth: 95; 
    --text-vf-slnt: 9; 
    --text-vf-ital: 0; 
    --text-vf-opsz: 80; 
} 

.element { 
    font-variation-settings:
        "wght" var(--text-vf-wght), 
        "wdth" var(--text-vf-wdth), 
        "slnt" var(--text-vf-slnt), 
        "ital" var(--text-vf-ital), 
        "opsz" var(--text-vf-opsz); 
} 

/* 等同于 */
.element{ 
    font-weight: var(--text-vf-wght); 
    font-stretch: calc(var(--text-vf-wdth) * 1%); 
    font-style: oblique calc(var(--text-vf-slnt) * 1deg); 
    font-style: italic; 
    font-optical-sizing: auto; 
} 
```

将整个过程所用的代码整合到一起，就会像下面这样：

```CSS
@font-face { 
    font-family: "Amstelvar Roman VF"; 
    src: url("/fonts/Amstelvar-Roman-VF.woff2") format("woff2 supports variations"), 
        url("/fonts/Amstelvar-Roman-VF.woff2") format("woff2-variations"); 
    font-display: swap; 
    font-weight: 100 900; 
    font-stretch: 75% 125%; 
} 
​
:root { 
    --text-vf-wght: 400; 
    --text-vf-wdth: 95; 
    --text-vf-slnt: 9; 
    --text-vf-ital: 0; 
    --text-vf-opsz: 80; 
} 
​
.element { 
    font-variation-settings:
        "wght" var(--text-vf-wght), 
        "wdth" var(--text-vf-wdth), 
        "slnt" var(--text-vf-slnt), 
        "ital" var(--text-vf-ital), 
        "opsz" var(--text-vf-opsz); 
} 
```

上面我们看到的是可变字体中已知的注册轴（实际上并不是所有可变字体都默认有所有注册轴），但有些可变字体根据设计者设计的不同，可能会有 `N` 个自定义的注册轴，这些自定义的轴始终以四个大写字母为标记，运用于 `font-variation-settings` 属性中：

```CSS
@font-face { 
    font-family:'Decovar Regular24'; 
    src:url('/fonts/Decovar-VF.ttf') format("woff2-variations"); 
} 
​
.element { 
    font-weight: 800; 
    font-style: italic; 
    font-variation-settings: 
        "SSTR" 183, 
        "INLN" 648, 
        "TSHR" 460, 
        "TRSB" 312, 
        "TWRM" 638, 
        "SINL" 557, 
        "TOIL" 333, 
        "TINL" 526, 
        "WORM" 523; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c275030594d540bfa4675e9639e680b6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQOXVo>

正如你所看到的，可变字体可以有五个主要轴和无限的自定义轴。在此，我们不会深入探讨此内容，主要是因为变量很多，这可能取决于特定字体的细节。但是，如果我们想为字体提供一些默认的自定义设置，我们该怎么办呢？

其实很简单，可以在 `@font-face` 指令中使用 `font-variation-settings` 属性为可变字体应用默认设置：

```CSS
@font-face {
    font-family: MartianGroteskVF;
    src: url("/fonts/MartianGroteskVF.woff2") format("woff2-variations");
    font-weight: 100 1000;
    font-stretch: 75% 200%;
    font-variation-settings: "wdth" 100, "wght" 400;
}
```

不过，我们在 CSS 中使用可变字体时，尤其是使用 `font-variation-settings` 属性指定轴的值时，有一些小问题。你没有明确设置的每个属性都将自动重置为其默认值。以前设置的值不会继承！这意味着以下内容将无法按预期工作：

```HTML
<p class="slanted grade-light">I should be slanted and have a light grade</p> 
```

```CSS
.slanted {
    font-variation-settings: "slnt" 10;
}
​
.grade-light {
    font-variation-settings: "GRAD" -200;
}
```

首先，浏览器将从 `.slanted` 类中应用 `font-variation-settings: "slnt" 10`。然后，它将从 `.grade-light` 类中应用 `font-variation-settings: "GRAD" -200`。但这会将 `slnt` 重置为其默认值`0`！结果将是使用轻量级的文本，但未倾斜。

幸运的是，我们可以通过使用 CSS 自定义属性来解决此问题：

```CSS
/* 设置默认值 */
:root {
    --slnt: 0;
    --GRAD: 0;
}
​
/* 子元素上更改相应的值 */
.slanted {
    --slnt: 10;
}
​
.grade-light {
    --GRAD: -200;
}
​
.grade-normal {
    --GRAD: 0;
}
​
.grade-heavy {
    --GRAD: 150;
}
​
/* 具体运用 */
.slanted,
.grade-light,
.grade-normal,
.grade-heavy {
    font-variation-settings: "slnt" var(--slnt), "GRAD" var(--GRAD);
}
```

CSS 自定义属性会层叠，因此如果元素（或其父级之一）设置了 `slnt` 为 `10`，它将保留该值，即使你将 `GRAD` 设置为其他值。

请注意，无法使用 CSS 自定义属性进行动画（出于设计目的），因此类似以下内容将不起作用：

```CSS
@keyframes width-animation {
    from { 
        --wdth: 25; 
    }
    to { 
        --wdth: 151; 
    }
}
```

这些动画必须直接在 `font-variation-settings` 上完成（稍后会介绍）。

### 步骤五：降级处理

可变字体是一种较新技术，虽然在 2018 年就得到主流浏览器的支持，但如果你的业务还需要支持一些更低版本的浏览器，就难免需要考虑可变字体的降级处理方案。一般情况下，如果浏览器不支持可变字体的话，将会采用系统级别的字体，但这种方式会对整体排版效果有所影响。如果希望在不支持可变字体的浏览器中使用指定的字体，我们可以借助条件 CSS 中的 `@supports` 属性来做降级处理。即可以选择使用静态字体构建你的网站，并使用可变字体进行渐进增强：

```CSS
/* 不支持可变字体的浏览器 */
@supports not (font-variation-settings: normal) {
    @font-face {
        font-family: Roboto;
        src: url('Roboto-Regular.woff2');
        font-weight: normal;
    }
​
    @font-face {
        font-family: Roboto;
        src: url('Roboto-Bold.woff2');
        font-weight: bold;
    }
​
    body {
        font-family: Roboto;
    }
​
    .super-bold {
        font-weight: bold;
    }
}
​
/* 支持可变字体的浏览器 */
@supports (font-variation-settings: normal) {
    @font-face {
        font-family: 'Roboto';
        src: url('RobotoFlex-VF.woff2') format('woff2 supports variations'),
           url('RobotoFlex-VF.woff2') format('woff2-variations');
        font-weight: 100 1000;
        font-stretch: 25% 151%;
    }
​
    .super-bold {
        font-weight: 1000;
    }
}
```

对于旧版浏览器，具有 `.super-bold` 类的文本将以正常粗体字呈现，因为那是我们唯一可用的粗体字。当支持可变字体时，我们实际上可以使用最重的 `1000` 权重。

如果您使用 Google Fonts API，它将负责为你的访问者浏览器加载合适的字体。假设你请求 `200 ~ 700` 权重范围内的 `Oswald` 字体，如下所示：

```HTML
<html>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
    </head>
</html>
```

可以处理可变字体的现代浏览器将获得可变字体，并且将提供 `200 ~ 700` 之间的每个权重。旧版浏览器将为每个权重提供单独的静态字体。在这种情况下，这意味着它们将下载 `6` 个字体文件：一个用于 `200` 权重，一个用于`300` 权重，以此类推。

## 使用 CSS 对可变字体进行动画处理

CSS 的 `font-variation-settings` 属性是可动画化的，并且由于它覆盖一定范围的值而不是 `100` 的增量，因此我们可以使用简单的 CSS `transition` 或 `animation` 获得一些非常不错的效果。比如字体 `Roboto Flex` 有多个变量轴，我们可以在 `@keyframes` 中改变它们的值，例如：

```HTML
<h1>mozzarella</h1>
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
​
@keyframes varifont {
    0% {
        font-variation-settings: 
            "wght" 100, 
            "slnt" 10, 
            "wdth" 25, 
            "opsz" 40,
            "GRAD" 0, 
            "XTRA" 350, 
            "YOPQ" 79, 
            "YTAS" 750, 
            "YTDE" -305, 
            "YTFI" 738,
            "YTLC" 514, 
            "YTUC" 712;
        letter-spacing: 20px;
        font-size: 200pt;
    }
​
    50% {
        font-variation-settings: 
            "wght" 1000, 
            "slnt" -20, 
            "wdth" 120, 
            "opsz" 144,
            "GRAD" 50, 
            "XTRA" 603, 
            "YOPQ" 100, 
            "YTAS" 854, 
            "YTDE" -98, 
            "YTFI" 788,
            "YTLC" 570, 
            "YTUC" 760;
        font-size: 100pt;
        letter-spacing: 5px;
    }
​
    100% {
        font-variation-settings: 
            "wght" 100, 
            "slnt" 10, 
            "wdth" 25, 
            "opsz" 40,
            "GRAD" 0, 
            "XTRA" 350, 
            "YOPQ" 79, 
            "YTAS" 750, 
            "YTDE" -305, 
            "YTFI" 738,
            "YTLC" 514, 
            "YTUC" 712;
        font-size: 200pt;
        letter-spacing: 20px;
    }
}
​
​
h1 {
  color: transparent;
  background: url("https://picsum.photos/id/805/1366/768") center no-repeat;
  background-size: cover;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: brightness(1.5) saturate(120%);
  text-transform: uppercase;
  animation: varifont 4s ease infinite;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d5eb7077d6841839e4716671d2ac1be~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEmOXrP>

我们还可以将整段文本以不同的速度变化，让字母逐个动起来会更好看。我们可以将文本的每个字母单独包裹起来，例如：

```HTML
<h1>
    <span>W</span>
    <span>3</span>
    <span>C</span>
    <span>P</span>
    <span>L</span>
    <span>U</span>
    <span>S</span>
</h1>
```

每个 `span` 使用 `animation-delay` 来延迟动画播放的时间：

```CSS
span {
    animation: text var(--loop) ease-in alternate infinite;
}
​
span:nth-child(1) {
    animation-delay: calc(var(--loop) * -1);
}
​
span:nth-child(2) {
    animation-delay: calc(var(--loop) * -1 + (var(--loop) * var(--delay)));
}
​
span:nth-child(3) {
    animation-delay: calc(var(--loop) * -1 + (var(--loop) * var(--delay) * 2));
}
​
span:nth-child(4) {
    animation-delay: calc(var(--loop) * -1 + (var(--loop) * var(--delay) * 3));
}
​
span:nth-child(5) {
    animation-delay: calc(var(--loop) * -1 + (var(--loop) * var(--delay) * 4));
}
​
span:nth-child(6) {
    animation-delay: calc(var(--loop) * -1 + (var(--loop) * var(--delay) * 5));
}
​
span:nth-child(7) {
    animation-delay: calc(var(--loop) * -1 + (var(--loop) * var(--delay) * 6));
}
​
@keyframes text {
    0% {
        font-weight: 900;
        font-variation-settings: "RTTX" 0, "DPTH" 62, "OFST" 0;
        scale: 1;
        filter: blur(calc(var(--size) * 0.005));
        color: var(--color1);
    }
    100% {
        font-weight: 100;
        font-variation-settings: "RTTX" 180, "DPTH" 62, "OFST" 0;
        scale: 1.5;
        filter: blur(calc(var(--size) * 0.06));
        color: var(--color2);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1eca25150b94148bf12d55eb59f79fe~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGzwVY>

## 使用可变字体的陷阱

可变字体对于 Web 的排版来说更丰富了，但是随着新技术的发展，需要注意的地方也就多了。

-   可选性太多：可变字体提供了很多以最微小的方式来改变某事的可能性，但这样选择就变得更加困难了。
-   需要更多的排版知识：可变字体有很多东西可供选择，这意味着你必须清楚自己想要什么，以及为什么想要。它也更易于搞砸，更容易在你的设计中出现不一致。这也涉及评估什么是合适的字体。当然，你可以像以前一样只使用全名实例，而忽略其他选项。唯一改变的是你只需要加载的一个字体文件。
-   并不总是有性能上的提高：如果你只需要一种字体样式，那么可变字体文件将会更大。大多数情况下，当你需要三到四种不同的字体权重或字宽时，你将开始节省文件大小。

## CSS 的 font-variant-* 属性

CSS 的 `font-variant-settings` 属性只是 CSS 的 `font-variant-*` 属性中的一个，除此之外，它还包含

`font-variant-ligatures` 、 `font-variant-caps` 、 `font-variant-numeric` 、 `font-variant-alternates` 和 `font-variant-east-asian` 等属性。这些属性可以用来控制大多数的 OpenType 特性。

不过，这些属性已经超出了本节课的范畴，就不阐述了，感兴趣的同学，可以通过相关关键词来获取更详细的内容。

## 小结

可变字体是有意义的，不仅易于丰富 Web 排版，也更易于还原设计师期望的效果。另外，到目前为止，很多主流浏览器已经支持了可变字体技术，但对于可变字体的使用还有一定的障碍，比如性能（可变字体类型，字体文件越大）以及可变字体的设计（并不是人人都能设计出想要的字体）。

虽然说，可变字体并不是我们遇到的每个设计问题的完美解决方案，在使用它们之前还需要考虑一些技术问题。但是，从每个指标来看，可变字体已经准备好迎接大时代。我希望，在学习了这节课内容之后，你至少会考虑在项目中使用它们。