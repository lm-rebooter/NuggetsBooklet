CSS 中有一整套不同的颜色格式：

*   颜色关键词，比如 `red`
*   十六进制代码，比如 `#09f`
*   `rgb()` ，比如 `rgb(0 0 0) `
*   `hsl()` ，比如 `hsl(40 50% 50%)`
*   `lch()` ，比如 `lch(90% 100 50)`
*   等等

而且这定义颜色的格式还在不断增加，比如 `hwb()` 和 `lab()` 等。可以说是列举不尽！

在 Web 中我们应该使用哪种颜色格式呢？这似乎是一个微不足道的决定，但它们之间又有一些非常重要的区别，比如颜色空间。在选择使用哪种颜色格式之前，应该要先了解这些定义颜色的格式，然后根据需要，选择正确的方式。

在这节课中，我先带你了解 CSS 颜色的格式，你将看到它们如何工作，如何使用。稍后，如果我们选择了正确的颜色格式，我将向你展示现代 CSS 如何让我们及时调整颜色。在此过程，我们也会掌握描述 CSS 颜色函数的新语法和相对颜色语法等。

## CSS 中的颜色

色彩是很复杂的一门学科，真正要聊的话，需要单独开一本小册，甚至都还很难说清楚。在这里，我们还是回到CSS 的世界中来，聊聊 CSS 世界中的颜色。 在 CSS 的世界中，颜色可以分为两个部分：能运用颜色的 CSS 属性和运用于 CSS 属性的颜色值。CSS 就是这么的神奇，任何一个 CSS 属性都有值和单位，颜色也是如此。简单的统计了一下，CSS 中能使用颜色的属性和颜色值相关的信息，可以像下图那样简单描述：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b310de8d36514baea73af8c181fb4d68~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，CSS 颜色的各种格式的值都可以用于可接受 `<color>` 值类型的属性，比如文本颜色 ：`color` ，它的值可以是一个十六进制的，也可以是 `rgb()` 、`hsl()` 等格式中的任一种：

```CSS
.element {
    color: red;                   /* <named-color> */
    color: #ff0000;               /* <hex-color>   */
    color: rgb(255 0 0);          /* <rgb()>       */
    color: hsl(0deg 100% 50%);    /* <hsl()>       */
    color: hwb(0deg 0% 0%);       /* <hwb()>       */
    color: lch(54 106.85 40.86);  /* <lch()>       */
    color: lab(54 80.81 69.9);    /* <lab()>       */
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd697cd02b4d41f18c62fa4f3df32f9a~tplv-k3u1fbpfcp-zoom-1.image)

> 正如你所看到的，除了我们熟悉的颜色格式之外，还有定义颜色的新格式，例如上图中的 `oklch()` 和 `oklab()` 函数。但在这节课中，我们不向大家阐述这两个函数，有关于它们更详细的介绍，将会放到单独的一节课来介绍。

## CSS 中的颜色格式

课程开头就提到了，在 CSS 中描述颜色的格式有很多种。那么我们从最早出现的一种颜色格式说起。

### 命名颜色

在 CSS 中可以用一些英文单词来描述颜色的值，它们不区分大小写，比如 `red` ，这些英文单词是用来命名颜色的，即给颜色取一个名称。事实上，“命名颜色”并不是真的颜色格式。但从命名颜色着手学习 CSS 中的颜色格式是一个好的起点！

时至今日，能用英文单词命名的颜色值差不多有 `147` 个：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89de955f6f214af6a9cfcf5b7511684a~tplv-k3u1fbpfcp-zoom-1.image)

> 上图录制于 @Anthony Lieuallen 制作的页面，源码地址：<https://github.com/arantius/web-color-wheel>

在这 `147` 个颜色名称中，有 `16` 个颜色最初来自于 HTML：`aqua`，`black`，`blue`，`fuchsia`，`gray`，`green`，`lime`，`maroon`，`navy`，`olive`，`purple`，`red`，`silver`，`teal`，`white` 和 `yellow`。除了这 `16` 个颜色之外的颜色被称为 X11 颜色集，其中 X11 颜色集的历史很有趣，如果感兴趣的话可以听 @Alex Sexton 分享的《[Peachpuffs and Lemonchiffons](https://www.youtube.com/watch?v=HmStJQzclHc)》。

> 其中 `rebeccapurple` 颜色能进入 CSS 颜色列表中，其中还有一个故事，如果你感兴趣的话，可以阅读 @Eric Meyer 的《[rebeccapurple](https://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/)》一文。

另外，命名颜色也可以称得上是“一锅炖”（大杂烩）。这样说，是因为有些颜色的关键词（英文单词）不同，但对应的颜色是一样的，比如：`darkgray = darkgrey`、`darkslategray = darkslategrey`、`dimgray = dimgrey`、`lightgray = lightgrey`、`lightslategray = lightslategrey`、`gray = grey` 和`slategray = slategrey`。出现这种现象是因为命名的 Web 颜色来源各不相同，有的出自于 HTML 规范，有的出自于 X11 （Unix 窗口系统）和[令人心碎的纪念](https://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/)（比如 `rebeccapurple`）。它是不同调色板的大杂烩，因此它并不总是非常一致。

除此之外，用英文单词命名的颜色，也能找到对应的其他表示方法，比如十六进制、`rgb()`、`hsl()`等。比如下`crimson` 颜色，对应着 `#ed143d`、`rgb(237, 20, 61)`（或 `rgba(237, 20, 61, 1)`）、`hsl(349, 86%, 50%)`（或 `hsla(349, 86%, 50%, 1)`）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87da39946eb741c7a1223bdafc7a8fab~tplv-k3u1fbpfcp-zoom-1.image)

说实话，命名颜色的这些单词很难让人全部记住。所以它的实用性并不太大，但如果你需要一个颜色占位符时，它就非常好用。例如，你正在制作一个 Web 原型，需要一个临时的颜色值，那么从 `147` 个颜色名中随意取一个即可。

除了名称不易记住之外，这些值非常有限（`147` 种颜色也远远不够 Web 的使用），很少能正好适合我们正在构建的设计。因此，我们还可以使用颜色十六进制（`16` 进制）值。

### 十六进制颜色

十六进制代码是 Web 上最常用的颜色格式之一，它长这样：

```CSS
.element {
    color: #ffffff; /* = #fff */
}
```

十六进制颜色表示法在 CSS 中被称为 `<hex-color>`，其语法是一个 `<hash-token>` 令牌，其值由 `3`、`4`、`6` 或 `8` 个十六进制数字组成。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a72cf73b4f0d4829a7056564b34fcb2c~tplv-k3u1fbpfcp-zoom-1.image)

哈希符 `#` 后面带了 `6` 位数，这六位数会分成三对，从左往右每两位分别代表的是红色（Red）、绿色（Green）和蓝色（Blue）三个通道。每位值都可以是数字 `0~9` 或字母 `a~f` 组合而成。当十六进制采用六位数表示颜色值时，该颜色对应的透明通道（Alpha）为默认值，即完全不透明。比如上图中的示例所示的颜色 `#00ff00` 对应的其实就是 `rgb(0, 255, 0)`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e2f45d7a31940618d89d61fdfc24fa9~tplv-k3u1fbpfcp-zoom-1.image)

三位数的十六进制颜色表示法是六位数十六进制颜色表示法的简化形式。当六位数的十六进制数中每对数值相同时，可以简写，比如 `#00ff00` 可以简写为 `#0f0`，即 **`#RRGGBB`** **简写成** **`#RGB`**。同样的，从左往右每一位分别代表的是红色（Red）、绿色（Green）和蓝色（Blue）三个通道。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f59ec8517b88441180862713b792067f~tplv-k3u1fbpfcp-zoom-1.image)

如果我们想要包含一个透明（Alpha) 通道，可以传递一个八位数的十六进制代码。八位数的十六进制颜色表示法与六位数十六进制颜色表示法相似，不同的是，在六位数十六进制的基础上增加了**第四对**数，这一对数主要是用来指定颜色的透明通道。同样的，这对值可以是数字 `0~9` 或字母 `a~f`。比如上图中的 `#00ff00cc` 颜色对应的就是`rgb(0, 255, 0, .8)`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c43edf275d74f288849c643b0c34ec1~tplv-k3u1fbpfcp-zoom-1.image)

四位数的十六进制颜色表示法其实是八位数十六进制颜色表示法简写形式。比如 `#00ff00cc` 可以简写成 `#0f0c`。

使用八位或四位十六进制描述带有透明通道的颜色还是不够灵活的，你需要知道它们之间的转换方式，这里告诉大家一个小技巧，你可以使用 Chrome 浏览器来辅助你。如下图所示，拖动透明通道的滑块位置，你就可以得到一个带有透明通道的八位十六进制的颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bae74b230a64e7a8fd46be86f3a3d66~tplv-k3u1fbpfcp-zoom-1.image)

你现在应该知道了，十六进制颜色被写成一个哈希符 `#`，后面紧跟一些 `0 ~ 9` 数字或 `a ~ f` 字母（字母没有大小写之分）。在使用十六进制来表示颜色时，给定的十六进制数字的数量决定了如何解码十六进制符号成 `RGB` 颜色。 通过交互式演示，你将更清晰地了解它的工作原理：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbe50878922549a6a5487dc43a2d0449~tplv-k3u1fbpfcp-zoom-1.image)

从根本上讲，十六进制代码与 `RGB` 值相同。在两种情况下，我们都为红色、绿色和蓝色提供一个值。

正如你所看到的，除非你是颜色专家，否则十六进制值非常难以读取。通过读取十六进制值，你不太能够猜测一个元素的颜色。当构建 Web 时，设计师可能会给我们一个十六进制颜色值，但如果他们要求我们将其变暗 `20％`，我们将很难通过调整十六进制值来实现，除非有一个视觉指南或颜色选择器。

### RGB 颜色

`RGB`（红、绿、蓝）格式是写颜色的另一种选择，以一种更易读的形式为我们提供与十六进制值相同范围的颜色。在 CSS 中，我们有一个 `rgb()` 函数来操作颜色。例如：

```CSS
.element {
    color: rgb(255, 0, 0);
}
```

在我们今天学习的所有颜色格式中，`rgb()` 是最不抽象的。你的电脑、手机显示器实际上是组成像素的数百万个小型红、绿、蓝 LED 灯的集合。因此，`rgb()` 颜色格式可以让我们直接调整这些灯的亮度。

`RGB` 颜色格式主要有红色（Red）、绿色（Green）和蓝色（Blue）三个通道，每个通道的值是 `0 ~ 255` 。通过以不同的方式混合这些通道的值，可以创造出超过 `1600` 万不同的颜色。下面这个示例是一个 `RGB` 颜色选择器，它可以很好地向大家展示 `RGB` 颜色格式的工作方式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ec940c23a3f44f89901755905ccfd62~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWPBwOL>

`RGB` 颜色的好处在于它基于光的物理性质，我们可以混合红、绿和蓝光创造任何颜色。Web 上的颜色是相加的，这也意味着红、绿、蓝三种颜色的比例越高，得到的颜色就会越浅。如果我们只使用红色通道，结果就是红色（ `rgb(255, 0, 0)`）；如果将它们（红、绿、蓝）全部调到 `255`，我们就得到了白色（`rgb(255, 255, 255)`）；将它们全部设为 `0`，我们就得到黑色（`rgb(0,0,0)`）。

同样的，RGB 颜色格式还允许我们针对透明度指定第 `4`个可选值作为透明通道进行控制，即制作一个带有一定透明度的颜色。该值是一个 `0 ~ 1` 之间的值，其中 `0` 表示完全透明，`1` 表示完全不透明：

```CSS
.element {
    color: rgb(255, 0, 0, .8);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86adf937c9144e6ca256352d3a392f65~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJBwVoQ>

注意，`rgb()` 带有四个值时，它和 `rgba()` 是等同的。

```CSS
.element {
    color: rgb(255, 0, 0, .8);
}

/* 等同于 */
.element {
    color: rgba(255, 0, 0, .8);
}
```

这是 [CSS Color Module Level 4 引入的新语法格式](https://www.w3.org/TR/css-color-4/#rgb-functions)，稍后我们会详细介绍。

上面我们所看到的 `rgb()` 函数中的值都是 `0 ~ 255` 之间的整数值。其实，在 `rgb()` 函数中，也可以使用百分比值，比如 `rgb(10%, 20%, 30%)` 。只不过，`rgb()` 函数取百分比值时，它相对于 `255` 计算，对透明通道，它是相对于 `1` 计算。而且在转换的过程中，不同的客户端对于小数位的处理略有不同，就是四舍五入的方式有差异，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85544d3f097f4b34a86620e2b4936d74~tplv-k3u1fbpfcp-zoom-1.image)

虽然我们一直在强调，`rgb()` 函数的值是 `0 ~ 255` 或 `0% ~ 100%` 之间的正数值，其实它的值也可以是小于 `0` （`0%`）或大于 `255` （`100%`）的值。只不过，如果在 `rgb()` 函数中使用的值超出规范所描述的值，比如小于 `0%`（或 `0` ），大于 `100%`（或 `255`）的话，那么将会计算成两个极点值，即小于 `0%`（或 `0` ）的会被计算成 `0%`（或 `0` ），大于 `100%`（或 `255`）的会被计算成 `100%`（或 `255`）。比如：

```CSS
.element {
    color: rgb(120%, 150%, 190%);
    /* 等同于*/ 
    color: rgb(100%, 100%, 100%);
} 

.element {
    background-color: rgb(-290, 290, 325 , .85);
    /* 等同于 */ 
    background-color: rgb(0, 255, 255, .85);
}
```

### HSL 颜色

到目前为止，我们看到的两种颜色格式（十六进制和 `RGB` 颜色）都是同一基本思想的不同“包装方式”：**传递红、绿、蓝通道的特定值** 。

然而，这不是仅有的颜色格式。我们还可以使用一个完全不同的颜色格式，那就是 `HSL` 颜色格式。在 CSS 中，我们可以使用 `hsl()` 和 `hsla()` 颜色函数来描述 HSL 颜色。对于 Web 开发人员而言，这些功能在调整颜色值方面更加直观。例如，我们可以通过调整色相、饱和度或亮度参数来获得不同的颜色，甚至你可以只调整亮度参数，来获得相同颜色的深色和浅色变体：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82e734eda16d4e3aaa0acd4df0df1eb3~tplv-k3u1fbpfcp-zoom-1.image)

上图这个颜色选择器，你应该不会感到陌生，它有点类似于设计软件 Figma 或 Photoshop 中使用的颜色选择器。

简单地说，HSL 颜色格式采用三种不同的值：

*   `H` 指的是色调，即 Hue，就是我们想要使用的颜色，其有效值的范围是 `0 ~ 360` （单位为度，即 `deg`）。在实际运用中，只需要记住色相环上的六大主色，用作基本参照：`360°`（`0°`）红、`60°` 黄、`120°` 绿、`180°` 青、`240°` 蓝、`300°` 洋红，它们在色相环上按照 `60°` 圆心角的间隔排列
*   `S` 指的是饱和度，即 SATURATION，就是我们使用的颜色中有多少色彩，它的有效值范围是 `0% ~ 100%` 。其中 `0%` 表示颜色中没有颜色，完全为灰；在 `100%` 时，表示颜色尽可能的鲜艳。在标准色轮上饱和度是从中心逐渐向边缘递增的。纯度即各色彩中包含的单种标准色成分的多少。纯度高的色彩色感强，即色度强，所以纯度亦是色彩感觉强弱的标志。不同色相所能达到的纯度是不同的，其中红色纯度最高，绿色纯度相对低些，其余色相居中，同时明度也不相同
*   `L` 指的是亮度，即 LIGHTNESS，就是我们使用的颜色的明度或暗度，它的有效值范围也是 `0% ~ 100%` 。其中 `0%` 表示颜色是全黑的；在 `100%` 时，表示颜色是纯白色的

`hsl()` 也可以像 `rgb()` 颜色函数一样，可以往里传四个值，其中第四个值就是透明通道的值，它的值范围是 `0 ~ 1` （或 `0% ~ 100%`）。与此相似，它也可以使用 `hsla()` 颜色函数来表示带有透明通道的 `hsl()` 颜色函数：

```CSS
.element {
    color: hsl(60deg, 50%, 50%, 80%);
}

/* 等同于 */
.element {
    color: hsla(60deg, 50%, 50%, 80%);
}
```

有意思的是，你会发现，在大多数图形设计软件中会使用一个 HSB 的颜色格式，而不是 HSL 颜色格式。它与 HSL 不同之处是，H 代表色相，S 代表饱和度，B 代码亮度；而 HSL 中的 H 代表色调，S 代表饱和度，L 代表亮度。

以下是使用 Figma 的颜色选择器表示 HSB 和 HSL 之间相同颜色的方式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85a10a6dfaa44a5c8c1f4ade30da5ca7~tplv-k3u1fbpfcp-zoom-1.image)

在 HSB 中，事情变得有点复杂。 “亮度”仍然是亮度的度量，`0％` 仍将产生黑色，但 `100％` 不再总是产生白色。 这取决于饱和度：在完全亮度下，`0％` 的饱和度为白色，`100％` 的饱和度为我们的明亮，鲜艳的颜色。

也就是说，HSL 中的黑色和白色是对立的，而 HSB 不是。当 HSL 中 L（亮度） 的值大于 `50` 并往上升的时候，和 HSB 中向白色靠拢的逻辑一致（亮度上升和饱和度下降）；当 HSL 中 L（亮度） 的值小于 `50` 并往下降的时候，和 HSB 中向黑色靠拢的逻辑一致（亮度下降和饱和度不变）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37089753946b4922bbdcdd3fd3fc1be5~tplv-k3u1fbpfcp-zoom-1.image)

就我个人而言，我更喜欢 HSB 颜色格式，只是在 CSS 中并没有 `hsb()` 这样的颜色函数。如果你的设计师在设计稿中提供的是 HSB 颜色值，那么你需要找到相应的工具，将 HSB 转换为 HSL ，比如 [rgb.to 工具](https://rgb.to/hex/0099ff)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45c460553dfa4dd4904f988555f7376c~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，HSB 颜色格式也被称为 HSV 颜色格式。

### HWB 颜色

HWB 是 Hue Whiteness Blackness 的简写，是 `sRGB` 颜色空间的一种基于颜色的表示。HWB 类似于 HSL ，因为它比 HSL 模型更直观（HSL 颜色本身被广泛认为比 RGB 更直观）。因此，它（HWB 颜色格式）也被称为“**更易于人类使用**”的颜色格式。这是因为，HWB 颜色允许你选择色相盘上的一种颜色，然后根据自己需要将其与白色和黑色混合。即可以在由黑色、白色和所选颜色所组成的三角形中可视化，就像混合颜色一样：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54d90856dca545798c7a6645e7a18e83~tplv-k3u1fbpfcp-zoom-1.image)

HWB 和 HSL 类似，每个字母都代表不同的意义：

*   H：和 HSL 和 HSV 中的 H 相同，指的都是色相（颜色的角度）
*   W：指的是白色的程度，范围从 `0% ~ 100%`（或 `0 ~ 1`）
*   B：指的是黑色的程度，范围从 `0% ~ 100%`（或 `0 ~ 1`）

简单地说，HWB 它描述了一开始的色相（H），然后将一定程度的白色（W）和黑色（B）混合到基本色调，从而得到一个颜色。 我们平时在开发者或者在制图软件中看到的颜色拾色器都是基于 HWB 颜色模式，由于它更直观。即选择一种颜色并通过添加黑色或白色来调整其亮度。

这个想法似乎很简单，但我不得不承认，`hwb()`让我感到困惑。

当然，通过色相角度选择颜色并使其变得更亮或更暗。非常简单，但是如果添加白色和黑色会发生什么？我如何为颜色角度定义白色和黑色，黑色和白色不会互相抵消吗？如果一种颜色包括 `100％` 的白色和 `100％` 的黑色会发生什么？

我想通过下面演示来解答这个疑惑：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a9002f4d1024baaa7825c6e64198e27~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxyJVjG>

如上图所示，当色相 H 不变，改变 W 和 B 的值时，将会取得不同的颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b71de33ed19f4fadaeff9ce4fa0fc98f~tplv-k3u1fbpfcp-zoom-1.image)

虽然在相同色相 H 不变情况之下，调整 W 和 B 可以改变颜色，但有的时候 W 和 B 调整总和有可能会大于 `100%` ，这就涉及一个计算。

如果你向颜色添加相同数量的白色和黑色，那么颜色色调保持不变，但颜色会失去饱和度。如果将 `50％` 的白色和 `50％` 的黑色（`hwb(0deg 50％ 50％)`）添加到颜色中，结果会产生一种无色彩的颜色；如果将白度或黑度的 `100％` 添加到颜色中，结果将是纯白或纯黑色。

如果白度和黑度的总和超过 `100％`，那么 W 和 B 的值会按照相应比例（白度和黑度之间的相对比例保持不变）计算，最终加起来等于 `100%`：

```Plain
计算后的 W 比例 = 计算前的 W 比例 ÷ (计算前 W 的比例 + 计算前 B 的比例)
计算后的 B 比例 = 100% - 计算后的 W 比例
```

例如，`hwb(0deg 100％ 100％)` ，它的 W 和 B 总和为 `200%` ，已然超出 `100%` ，此时，将会按上面的公式进行计算，重新按照相应比例调整 W 和 B 所占的比例：

```Plain
计算后的 W 比例 = 计算前的 W 比例 ÷ (计算前 W 的比例 + 计算前 B 的比例)
?% (W) = 100% ÷ (100% + 100%) = 1 ÷ 2 = 50%
计算后的 W 比例 = 50%；
计算后的 B 比例 = 100% - 50% = 50%;
```

因此，`hwb(0deg 100％ 100％)` 的结果为 `hwb(0deg 50％ 50％)`。同样的，`hwb(0deg 300％ 100％)` 中的 W 和 B 总和超出 `100%` ，也需要重新计算：

```Plain
计算后的 W 比例 = 计算前的 W 比例 ÷ (计算前 W 的比例 + 计算前 B 的比例)
?% (W) = 300% ÷ (300% + 100%) = 3 ÷ 4 = 75%
计算后的 W 比例 = 75%；
计算后的 B 比例 = 100% - 75% = 25%;
```

即 `hwb(0deg 300％ 100％)`变为`hwb(0deg 75％ 25％)`，依此类推。所有颜色都保持无色彩状态。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17f715f268c74365833d10f34d45e3df~tplv-k3u1fbpfcp-zoom-1.image)

另外，CSS 的 `hwb()` 颜色函数与 `rgb()` 和 `hsl()` 颜色函数类似，你还可以向 `hwb()` 中传入第四个参数，即不透明度参数。例如：

```CSS
.element {
    color: hwb(30deg 20% 20% / .5);
}
```

但需要注意的是，CSS 的 `hwb()` 颜色函数只支持新的语法规则，即 `hwb()` 函数中的值与值之间不能使用逗号（`,`）分隔，只能使用空格符分隔：

```CSS
/* 有效规则 */
.element {
    color: hwb(30deg 30% 30%);
    background-color: hwb(90deg 90% 5% / .5);
}

/* 无有效规则 */
.element {
    color: hwb(30deg, 30%, 30%);
    background-color: hwb(90deg, 90%, 5%, .5);
}
```

简单地说，我们可以将 HWB 为混合颜料。这对于创建单色调配色方案特别有用。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fa8f389340348ec8822185e3253c5a6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RweBaMp>

### LAB 颜色

LAB 和 LCH 在[规范中](https://www.w3.org/TR/css-color-4/#specifying-lab-lch)被定义为设备独立的颜色。LAB 是一种可以在像 Photoshop 这样的软件中访问的颜色空间，如果你想要一种颜色在屏幕上和印在 T 恤上看起来相同，建议使用 LAB。

Lab 是一个中心亮度轴的直系坐标系。这个值通常写成无单位数；为了与 CSS 的其余部分兼容，它被写成百分比。`100%` 表示 `L` 值为 `100`，而不是 `1.0`。`L=0%` 为深黑（完全无光），`L=100%` 为漫反射白（光源为 D50 白，色温为 5000K 的标准日光光谱，由一个完美的漫反射镜反射）。大于 `100` 的值对应高光，但在本规范中没有定义它们的精确颜色。有用的是，根据设计，`L=50%` 是中灰色的，`L` 的等距增量在视觉上是均匀间隔的：实验室的颜色空间在视觉上是均匀的。`a` 轴和 `b` 轴表示色调，沿 `a` 轴的正值为红色，负值为补色，为绿色。同样，沿着 `b` 轴的正值为黄色，负值为互补的蓝色（或紫色）。去饱和的颜色 `a` 和 `b` 值较小，接近 `L` 轴；饱和色远离 `L`轴。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ce66740708f4a9597daf55923e18393~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，LAB 有三个轴，亮度 `L` 轴，紧随其后的是 `a` 轴(绿色到红色)和 `b` 轴(蓝色到黄色)：

*   `L` （亮度）：取值范围为 `0~100`，表示亮度
*   `a` （分量）：代表由绿色到红色的光谱变化，取值范围均为 `-120~120`
*   `b` （分量）：代表由蓝色到黄色的光谱变化，取值范围均为 `-120~120`

注意，LAB 中的亮度（`L`）像 HSL 一样，采用百分比来描述，但实际上可以超过 `100%` ，超明亮的白色可以使用高达 `400%` 的百分比。 `a` 轴和 `b` 轴的值可以从正到负范围内变化。两个负值会导致一种在光谱的绿/蓝端的颜色，而两个正值可能会给出更橙色/红色的色调。

```CSS
.element {
    background-color: lab(80% 100 50); 
}

.element {
    background-color: lab(80% -80 -100);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/326f3653e6da49789470434069506ac3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNaKZJy>

其实，LAB 就像一个更广泛的色域下的 `rgb()` 函数。因为，LAB 就像 RGB 一样具有三个线性组件。数字越小意味着含量越少，数字越大意味着含量越多。因此，你可以使用 LAB 指定最亮绿色，它对于每个人都会非常亮和绿，但是在具有更广泛色域的显示器上，它会更加亮和绿。

因此，我们会得到所有额外的颜色，这很棒，但是 sRGB 还有这另一个问题（除了在颜色表达方面受限），就是它不是感知均匀的。然而，在 LAB 中，显然是感知均匀的，这意味着以编程方式操作颜色是一个更加明智的任务。而且，另一个好处是 LAB 颜色是设备独立的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77206beb365c4cd1b3e02d9a8c7f3028~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/qBJyPKO>

在 CSS 中使用 `lab()` 颜色函数时，同样可以像 `rgb()` 、`hsl()` 和 `hwb()` 颜色函数一样，引入第四个参数，即颜色的透明通道，它的值范围是 `0 ~ 1` （或 `0% ~ 100%`）：

```CSS
.element {
    background-color: lab(80% 100 50 / .5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adec16d4f98549a6914b02618eee5a13~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgBzqZ>

需要注意的是，它的语法规则和 `hwb()` 颜色函数一样，只支持新语法规则，即使用空格符分隔每个参数：

```CSS
/* 有效规则 */
.element {
    color: lab(80% 30 30);
    background-color: lab(90% 90 5 / .5);
}

/* 无有效规则 */
.element {
    color: lab(80%, 30, 30);
    background-color: lab(90%, 90, 5, .5);
}
```

### LCH 颜色

前面提到过，LAB 和 LCH 在[规范中](https://www.w3.org/TR/css-color-4/#specifying-lab-lch)被定义为设备独立的颜色。换句话说，LCH 与 LAB 是相同的颜色空间，只是以不同的方式呈现！

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ae354bd27c9484d969e08aaec329546~tplv-k3u1fbpfcp-zoom-1.image)

LCH 与 LAB 具有相同的 `L` 轴，但使用极坐标 `C`（色度）和 `H` (色调)。`C` 是与 `L` 轴的几何距离，`H` 是与 `a` 轴正方向的夹角，正方向的夹角是顺时针。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e61268711f4e1698761fb6a997ad30~tplv-k3u1fbpfcp-zoom-1.image)

LCH 和 LAB 本质是一样的，在 LCH 和 LAB 色相图上，`c` 表示极径长度，`h` 表示逆时针转过的角度，约定水平向右为 `0` 度：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb3313f3017c4dd1af3b1230e35ebdd1~tplv-k3u1fbpfcp-zoom-1.image)

简单地说， LCH 代表亮度（Lightness）、色度（Chroma）和色相（Hue）。乍一看，这似乎与HSL（色相、饱和度和亮度）相似，但这些颜色空间以不同的方式描述颜色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/955eeec34d3848f4bd15431bfa297942~tplv-k3u1fbpfcp-zoom-1.image)

*   `L` （Lightness）：跟 LAB 一样，可以是一个超过 `100%` 的百分比
*   `C` （Chroma）：色彩的相对饱和度。类似于 HSL 颜色格式中的饱和度（S），但 LCH 中的 `C` 可以超过 `100`
*   `H` （Hue）：与 HSL 颜色格式中的色相（`H`）类似，范围值是 `0 ~ 360`

虽然说，LCH 看上去和 HSL 相似，但它们还是有着本质上的差异。比如下面这个示例：

```CSS
.box-hsl-l50-1 {
    background-color:hsl(60deg 100% 50%);
}

.box-hsl-l50-2 {
    background-color:hsl(240deg 100% 50%);
}

.box-lch-l50-1 {
    background-color:lch(50% 132 95);
}

.box-lch-l50-2 {
    background-color:lch(55% 132 280);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46629cc8a86b428083388b039859c8ed~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEqjaKG>

正如你所看到的，这些 HSL 颜色都具有相同的“亮度”值： `50％`。然而，感觉它们并不一样轻。黄色比蓝色看起来更轻！这也说明，在 HSL 颜色中，亮度是没有意义的。颜色可以具有相同的亮度值，而其感知上的亮度差异巨大。造成这种现象的主要原因是， HSL 颜色格式是根据数学、物理模型建模的，它并不考虑人类感知。事实证明，人类对颜色的感知并不非常准确！

LCH 是一种旨在对人类感知均匀的颜色格式，它更接近人眼感知。如上图中 LCH 颜色，具有相同“亮度”值（都是 `50%`）的两种颜色（黄色和蓝色）应感觉同样明亮。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90a8186725574ce29848dba3966667f4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxBzZj>

也就是说，通过 LCH，任何具有相同亮度的颜色都具有同等的感知明亮度，任何具有相同色度的颜色都具有同等的感知饱和度。所以说，**这种感知均匀性质使得 LCH 成为设计中创建易于访问** **、一致性** **和可预测性颜色系统的极佳选择**。

而且这种新的颜色模式，它还有另一个好处是，我们可以告别 CSS 颜色渐变中的“灰色死亡区”。我认为由于这种感知均匀性的原因，两种丰富的颜色不会越过非丰富颜色区域进行渐变。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb7a946f886c425f99d5c1fee71a074b~tplv-k3u1fbpfcp-zoom-1.image)

> URL：<https://twitter.com/argyleink/status/1490376117064065025>

```CSS
h1 {
    --colorspace: srgb;
}

.red-to-white h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        red, hsl(none none 100%)
    );
}

.blue-to-white h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        blue, white
    );
}

.red-to-green h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        red, green
    );
}

.purple-to-gold h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        purple, gold
    );
}

.blue-to-black h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        blue, black
    );
}

.black-to-white h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        black, white 
   );
}

.blue-to-red h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        blue, red
    );
}

.extreme-gamut h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        lch(50% 230 0), lch(50% 230 250)
    );
}

.mediumvioletred-to-gold h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        mediumvioletred, gold
    );
}

.indigo-to-lightseagreen h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        indigo, lightseagreen
    );
}

.same-perceptual-lightness h1 {
    background-image: linear-gradient(
        to right in var(--colorspace), 
        lch(50% 100 150), lch(50% 100 250)
    );
}
```

> Demo 地址：<https://codepen.io/argyleink/full/OJObWEW> （如果你想了解有关于渐变中的“灰色死亡区”的相关概念，可以移步阅读《[你不知道的 CSS 渐变](https://juejin.cn/book/7199571709102391328/section/7199845781149810727)》一文）。

虽然在概念上 LCH 与 HSL 非常相似，但存在两个主要区别：

*   如前所述，LCH 优先考虑人类感知，因此具有相同“亮度”值的两种颜色将感觉同样明亮。
*   LCH 不局限于任何特定的颜色空间。

与我们见过的其他颜色格式不同，LCH 并不局限于 sRGB。它甚至没有局限于 P3！这是因为它没有色度上限。

在 HSL 中，饱和度范围从 `0％`（无饱和度）到 `100％`（完全饱和度）。这是可能的，因为我们知道我们正在谈论有限的 sRGB 颜色空间。

但是，LCH 与特定的颜色空间无关，因此我们不知道上限饱和度在哪里。它不是静态的：随着显示技术的不断改进，我们可以期望显示器达到更广泛的色域。 LCH 将通过增加色度自动引用这些扩展颜色。这就是所谓的未来证明技术！

在过去的几十年中，我们一直在 Web 上使用 sRGB 颜色空间。sRGB 仅限于 `1670` 万种颜色，这可能听起来很多，但随着显示器的快速进化，现在普遍存在具有超过 `100％` sRGB 覆盖范围的显示器。此外，sRGB 是基于显示器工作原理设计的，而不是基于我们眼睛感知颜色的方式。这使得它不太适合创建一致且易于访问的颜色系统。这就是 LCH 的用途。

注意，这里就涉及“颜色空间的概念”。其中，我们前面所介绍的 HEX（十六进制）、 RGB、 HSL 、HWB 都是属性 sRGB 颜色空间，而 LAB 和 LCH 属于 **CIE Lab** 颜色空间 （也称为 HCL、LAB 、CIELUV 或 CIELCH 颜色空间）。LCH 的主要目标是实现感知均匀性，即它的行为方式符合我们眼睛感知颜色的方式。理论上，LCH 可以描述无限数量的颜色，但对我们而言，重要的是它的颜色色域比 sRGB 更大。这意味着它可以表示更广泛的颜色范围，从而允许创建更美丽的网站。

抛开这些理论不说（下一节课，将会和大家更进一步的聊 CSS 中的颜色空间），在 CSS 中，我们可以使用 `lch()` 颜色函数来描述 LCH 颜色。在使用 `lch()` 颜色函数时，它和 `hwb()` 和 `lab()` 颜色函数一样，只支持新的语法规则，即 `lch()` 颜色函数中的参数只能以空格符作为分隔：

```CSS
/* 有效规则 */
.element {
    color: lch(50% 120 20);
    background-color: lch(99% 95 301 / .5);
}

/* 无有效规则 */
.element {
    color: lch(50%， 120， 20);
    background-color: lch(99%， 95， 301， .5);
}
```

同样的，`lch()` 函数中也可以引入第四个参数，即颜色透明通道，它的值也是 `0 ~ 1` （或 `0% ~ 100%`）之间。正如上面代码所示：

```CSS
.element {
    background-color: lch(99% 95 301 / .5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/345ada381b954943aa12b7f0a4380e25~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOepYdL>

## 选择正确的颜色格式

现在，我们知道了，在 CSS 中可用于设置 Web 元素颜色的格式有很多种，比如 HEX（十六进制）、RGB 、HSL 、HWB 、LAB 和 LCH 。甚至还有新的颜色格式，比如 **OKLCH** **、OKLAB 等**（将会在后面的课程中介绍）。选择多了，困惑就多了。那么我们在进行 Web 开发的时候，应该如何正确的选择颜色格式呢？

在回答这个问题之前，我们先来看看选择 UI 颜色的历史。

在 2000 年代初期，Web 开发者通常只使用 HEX （十六进制）或 RGB 颜色为 Web UI 选择颜色。这主要是因为在那个时代，Web 开发者可用于选择颜色的工具很少，而且那个时候 HSL 颜色格式也并没有得到广泛的支持。例如，如果需要一种橙色的颜色，你只需要将红色和绿色结合起来，然后进入下一步。

这种盲目选择颜色的方式很快就被更为复杂的工具所取代，比如 Photoshop 设计软件，它使得你选择准确的颜色变得更容易。如今天，在 Figma 或 Sketch 中同样提供 Photoshop 软件中相似的颜色工具。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a853f3a1f284af2acf3c44f713aef0e~tplv-k3u1fbpfcp-zoom-1.image)

> 上图是 Figma 设计软件中颜色选择器面板。

由于这些工具的易用，再加上 HSL 颜色格式慢慢得到所有主流浏览器的支持，使得 HSL 颜色格式成为 Web 设计师或 Web 开发者首先颜色格式，甚至说是给 Web UI 上色的黄金标准。正如 @Ahmad Shadeed 在他的博文《[Using HSL Colors In CSS](https://www.smashingmagazine.com/2021/07/hsl-colors-css/)》中所述，Web 开发者，可以轻易的设置 HSL 颜色格式，只需调整其中任一参数（`H` 、`S` 或 `L`）就可以得到新的颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/128797cc773b4842bafb896958f7f650~tplv-k3u1fbpfcp-zoom-1.image)

例如，当特定组件中的颜色需要在悬停时变得更深时，HSL 颜色可以非常理想。这对于按钮和卡片之类的组件非常有帮助。

```CSS
:root {
    --primary-h: 221;
    --primary-s: 72%;
    --primary-l: 62%;
}

.button {
    background-color: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
}

.button:hover {
    --primary-l: 54%;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58f29d62014b436c8318e980442c4990~tplv-k3u1fbpfcp-zoom-1.image)

还有，就是当我们使用相同颜色但具有不同色调的设计时，HSL 可以非常方便。例如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db3d4d4d532c4848b70b905c87cb99e4~tplv-k3u1fbpfcp-zoom-1.image)

既然 HSL 这么优秀了，我们为什么还需要 LAB 和 LCH 呢？

正如前面介绍  LAB 和 LCH 颜色时所说，使用 LAB 或 LCH，可以获得更大范围的颜色。LAB 和 LCH 的设计是为了让我们能够接触到人类视觉的整个光谱。此外，HSL 和 RGB 也有一些缺点：它们在感知上不是统一的。在 HSL 中，根据 `H` 色相的不同，增加或减少亮度最终导致的结果也会有很大的不同，甚至说，HSL 颜色中的亮度是没有意义的。

这就是 LCH 发挥作用的地方。它是创建统一、易访问和可预测 UI 配色方案的最佳方式。换句话说，由于 HSL 的不一致性，设计师最终将放弃它并转向 LCH 或类似的色彩空间。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ac260903722462aab4d6545f812b63d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRqvPR>

除此之外，由于 LCH 色彩空间的属性，UI 设计的几个方面变得更加容易。

### 通过一致的对比度实现内置的可访问性

如果你有使用 HSL 的经验，可能会注意到同样亮度的两种不同颜色具有极其不同的对比度比率。相比之下，LCH 确保具有相同亮度值的不同颜色几乎具有相同的对比度比率，使确保可访问性变得更加容易。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5580e1fdcaf0469b8db49f70f62abbd8~tplv-k3u1fbpfcp-zoom-1.image)

### 可互换的颜色

LCH 的知觉均匀性使你可以轻松交换颜色，而不会影响对比度比率。这对于在 UI 中尝试不同的颜色组合非常有用。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbdf641dc4e24163ac20e7022a326cc7~tplv-k3u1fbpfcp-zoom-1.image)

这对于构建可访问性 Web 应用也是非常有用的，背景颜色和文本颜色的对比度，可以达到可访问 Web 颜色对比度的相关要求。

### 灵活的调色板

在 LCH 中添加颜色或色调非常简单，无需记住如何创建调色板。如果你匹配其他颜色的亮度和饱和度级别，你可以确保新颜色具有相同的对比度比率，并具有知觉上的均匀性。这对于创建颜色的调色板也是非常有用的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0c817ed90434600afffff4c4eeb08be~tplv-k3u1fbpfcp-zoom-1.image)

> 上图来源于：<https://accessiblepalette.com/>

就我个人而言，至少目前为止，我是非常喜欢 LCH 颜色模式，可以很好地用于创建 UI 颜色调色板或者给 Web UI 上色，但这并不代表这种喜欢是永久的。比如，现在就有比 LCH 颜色模式更优秀的颜色，即 \*\*OKLCH 和 OKLAB。\*\*说不定哪一天，我就更爱它们了。

## 颜色函数的新旧语法

不知道你是否发现了，前面在介绍 CSS 中颜色格式时，示例中有的颜色函数中使用逗号作为参数分隔符，比如 `rgb()` 、`hsl()` 函数：

```CSS
.element {
    color: rgb(0, 0, 0);
    background-color: hsl(0deg, 0%, 100%)
}
```

有的却是空格符作为颜色函数参数的分隔符，比如 `hwb()` 、`lab()` 和 `lch()` 函数：

```CSS
.element {
    color: hwb(0deg 100% 0%);
    background-color: lab(0 0 0);
    border-color: lch(52 76.43 12.91);
}
```

造成这种现象的主要还是因为历史原因。因为 **[CSS 颜色模块 Level 4 版本](https://www.w3.org/TR/css-color-4/)**开始引入了一种新的颜色函数语法。新的语法把逗号分隔符（`,`）都换成了空格分格符。也就是说，新语法中，所有颜色函数（例如，`rgb()` 、`hsl()` 、`hwb()` 、`lab()` 和 `lch()`）都可以使用**空格符**来分隔每个参数（颜色通道的值）。例如：

```CSS
.element {
    color: rgb(0 0 0);        /* RGB */
    color: hsl(0deg 0% 0%);   /* HSL */
    color: hwb(0deg 0% 100%); /* HWB */
    color: lab(0 0 0);        /* LAB */
    color: lch(0 0 0);        /* LCH */
}
```

同时，它们都可以引入颜色透明通道值，并且以斜杠（`/`）作为分隔符，比如，下面代码中所展示的是，带 `50%` 透明度黑色的表示方法：

```CSS
.element {
    color: rgb(0 0 0 / .5);        /* RGB */
    color: hsl(0deg 0% 0% / .5);   /* HSL */
    color: hwb(0deg 0% 100% / .5); /* HWB */
    color: lab(0 0 0 / .5);        /* LAB */
    color: lch(0 0 0 / .5);        /* LCH */
}
```

虽然提供了新语法规则，但有意思的是，各大主流浏览器并没有抛弃早期出现的颜色函数的老语法规则（比如， `rgb()` 和 `hsl()`），即带逗号分隔的语法规则：

```CSS
.element {
    color: rgb(0, 0, 0);        /* RGB */
    color: hsl(0deg, 0%, 0%);   /* HSL */
}
```

同时还支持用逗号分隔透明通道的值：

```CSS
.element {
    color: rgb(0, 0, 0, .5);        /* RGB */
    color: hsl(0deg, 0%, 0%, .5);   /* HSL */
}
```

换句话说，对于 `rgb()` 和 `hsl()` 你不管是使用新语法规则还是旧语法规则，都可以在函数中引入第四个值（透明通道的值）。严格上来说，`rgba()` 和 `hsla()` 可以退出历史的舞台：

```CSS
.element {
    color: rgb(0, 0, 0, .5);        /* RGB */
    color: hsl(0deg, 0%, 0%, .5);   /* HSL */
}

/* 等同于 */
.element {
    color: rgb(0 0 0 / .5);        /* RGB */
    color: hsl(0deg 0% 0% / .5);   /* HSL */
}

/* 等同于 */
.element {
    color: rgba(0, 0, 0, .5);        /* RGBA */
    color: hsla(0deg, 0%, 0%, .5);   /* HSLA */
}

/* 等同于 */
.element {
    color: rgba(0 0 0 / .5);        /* RGBA */
    color: hsl(0deg 0% 0% / .5);   /* HSLA */
}
```

但千万要注意的是， **[CSS 颜色模块 Level 4 版本](https://www.w3.org/TR/css-color-4/)** 开始引入的颜色函数，比如 `hwb()` 、`lab()` 和 `lch()` ，包括 `oklab()` 和 `oklch()` ，甚至是未来可以新引入的颜色函数，都将只支持新语法规则，即**使用空格分隔符来分隔函数参数，如果带有透明通道值，需要使用斜杆符（****`/`****）进行分隔**。

```CSS
/* 有效的 CSS 规则 */
.element {
    /* 带有透明通道参数 */
    color: hwb(0deg 0% 100% / .5); /* HWB */
    color: lab(0 0 0 / .5);        /* LAB */
    color: lch(0 0 0 / .5);        /* LCH */
    
    background-color: hwb(0deg 100% 0%); /* HWB */
    background-color: lab(100 0 0);      /* LAB */
    background-color: lch(100 0 0);      /* LCH */
}

/* 无效的 CSS 规则 */
.element {
    /* 带有透明通道参数 */
    color: hwb(0deg, 0%, 100% , .5); /* HWB */
    color: lab(0, 0, 0 , .5);        /* LAB */
    color: lch(0, 0, 0 , .5);        /* LCH */
    
    background-color: hwb(0deg, 100%, 0%); /* HWB */
    background-color: lab(100, 0, 0);      /* LAB */
    background-color: lch(100, 0, 0);      /* LCH */
}
```

## 相对颜色语法

**[CSS 颜色模块 Level 5 ](https://www.w3.org/TR/css-color-5/#relative-colors)** 为 CSS 颜色函数引入[相对颜色语法](https://www.w3.org/TR/css-color-5/#relative-colors)，进一步增强了颜色函数功能。此语法允许你基于另一个颜色定义新颜色。你可以通过首先使用 `from` 关键字定义起始颜色，然后像往常一样在颜色函数中指定新颜色的通道来使用它。

当你提供起始颜色时，你就可以访问“通道关键字”，这些关键字允许你在颜色空间中引用每个通道。关键字取决于你使用的颜色函数。对于 `rgb()`，你将有 `r`，`g` 和 `b` 通道关键字。对于 `oklch()`，你将有 `l`，`c` 和 `h` 关键字。对于每个颜色函数，你还有一个透明通道关键字，它引用起始颜色的 Alpha 通道。例如：

```CSS
:root {
    --theme-primary: #8832CC;
}
.bg-primary-100 {
    background-color: hsl(from var(--theme-primary) h s 90%);
}

.bg-primary-200 {
    background-color: hsl(from var(--theme-primary) h s 80%);
}

.bg-primary-300 {
    background-color: hsl(from var(--theme-primary) h s 70%);
}

.bg-primary-400 {
    background-color: hsl(from var(--theme-primary) h s 60%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5cf8a3e6af6403f8f1eba94c2138f58~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RweBMeY> （请使用 Safari 16.4+ 查看该 Demo）

拿其中的 `hsl(from var(--theme-primary) h s 30%)` 为例吧：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afa5075afd5e4ce799780f2bc2b29fe0~tplv-k3u1fbpfcp-zoom-1.image)

基于原始颜色 `--theme-primary` ，将 `l` 通道的值调至 `30%` ，且 `h` 和 `s` 通道的值不变，将会基于原始颜色 `--theme-primary` （即 `hsl(274, 61%, 50%)`）得到一个新颜色，即 `hsl(274, 61%, 30%)` 。

而且，使用 `from` 关键词，你还可以很快将一个十六进制的颜色转换为 `rgb()` 和 `hsl()` 等颜色：

```CSS
.element {
    --color: #4488dd;
    
    background-color: rgb(from var(--color) r g b / .5);
}
```

要是你使用过 SCSS 这样的 CSS 处理器，那么你对其 `darken` 和 `lighten` 函数肯定有印象。有了 CSS 的相对语法之后，要在 CSS 中实现与它们相似的功能就变得容易得多，你只需要在 CSS 相对颜色中使用 `calc()` 函数即可。例如：

```CSS
/* 基于 tomato 颜色减少饱和度 */
.tomato-lighten {
    background-color: rgb(from tomato calc(r - 20) calc(g - 20) calc(b - 20));
}

/* 制作一个半透明的 tomato 色 */
.tomato-semi {
    background-color: rgb(from tomato r g b / 50%);
}

/* 甚至 tomato 颜色变暗 */
.tomato-darken {
    background-color: oklch(from tomato calc(l - 0.1) c h);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/098bfb344dac4a10a4e3bf85fab32b7e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJjLEM> （请使用 Safari 16.4+ 查看该 Demo）

你还可以跨颜色空间定义相对颜色。当你使用不同的颜色空间定义新颜色时，浏览器首先将原始颜色转换为新的颜色空间。在这里，我们使用 `hwb()` 基于主要颜色（`--primary`）来定义次要颜色（`--secondary`），通过调整 `--primary` 颜色的色调来实现：

```CSS
:root {
    --primary: #005f73;
    --secondary:hwb(from var(--primary) calc(h - 120deg) w b);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e02e903bdc7f40f8a0e81377dc43a7d6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRYBdBg> （请使用 Safari 16.4+ 查看该 Demo）

相对颜色还有一个功能是，可以为现有颜色添加透明度。我们在介绍十六进制颜色格式的时候提到过，使用八位数十六进制可以来描述一个带有透明通道的颜色，只不过透明度的值转换成十六进制代码较为麻烦。那么，现在你可以使用相对颜色给一个颜色添加透明度。例如，你需要将一个 `#09face` 颜色转换成带有 `50%` 透明度的颜色，可以像下面这样使用：

```CSS
.add-opacity {
  --original-collor: #09face;

  background: rgb(from var(--original-collor) r g b / 50%);
  background: hsl(from var(--original-collor) h s l / 50%);
  background: oklch(from var(--original-collor) l c h / 50%);
  background: hwb(from var(--original-collor) h w b / 50%);
  background: lab(from var(--original-collor) l a b / 50%);
  background: lch(from var(--original-collor) l c h / 50%);
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14a937612f3d4483b15bd08eb7b1d50b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOevEeB> （请使用 Safari 16.4+ 查看该 Demo）

最后再来看一个相对颜色的示例，即相对颜色在设计系统中的使用。如果你曾关注过设计系统的话，应该知道现在很多设计系统都会使用 [Design Token](https://www.w3.org/community/design-tokens/) 来管理 UI 对象的设计元素。比如颜色主题：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97ca41a551c34c32bf5cd96405892415~tplv-k3u1fbpfcp-zoom-1.image)

在编码的时候，一般使用一个自定义属性来定义每个颜色通道的颜色。例如，使用单独的 `l` 、`c` 和 `h` 通道重新定义主色（Primary）`#00573` ，以便我们可以 `oklch()` 函数中创建颜色：

```CSS
:root {
    /* 定义 Primary 颜色各通道的值 */
    
    --primary-l: 0.4485;
    --primary-c: 0.081;
    --primary-h: 218.73;
    
    /* 基础主色 */
    --primary: oklch(var(--primary-l) var(--primary-c) var(--primary-h));
    
    /* 通过从亮度通道减去 0.1 来创建比主色的更暗色 */
    --primary-darker: oklch(calc(var(--primary-l) - 0.1) var(--primary-c) var(--primary-h));
    
    /* 通过从亮度通道加上 0.1 来创建比主色更亮（轻）的色 */
    --primary-lighter: oklch(calc(var(--primary-l) + 0.1) var(--primary-c) var(--primary-h));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da98f5f4faac4c5a8d23d1e4276410d0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExdejaO>

有了相对颜色语法功能之后，我们在定义设计系统中的颜色时就不需要像上面示例所展示的那样，将每个颜色分解为单独的通道。它还允许你使用最方便的颜色格式来定义原始颜色，无论你需要使用哪种颜色空间来修改原始颜色。比如，你的设计师提供的颜色是十六进制的：`#f36980` ，你只需要将该色值（`#f36980`）复制到你的 CSS 中，仍然可以使用任何你想要的颜色格式来定义颜色，如使用 `oklch()` 或 `oklab()` 来定义感知均匀的颜色：

```CSS
:root {
    --primary: #736980;
    --primary-darker: oklch(from var(--primary) calc(l - 0.1) c h);
    --primary-lighter: oklch(from var(--primary) calc(l + 0.1) c h);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac8795db0b074d1ab3a05df5944fa35e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxyaGZB> （请使用 Safari 16.4+ 查看该 Demo）

是不是要简单多了！不过，你可能会担心，这是 CSS 的新特性，至少目前仅得到了 Safari 的支持，还无法在项目中真正的使用。我想告诉你的是，你可以在你的项目中使用 `@csstools/postcss-relative-color-syntax` 这个 PostCSS 插件，这样就可以在任何浏览器中使用相对颜色语法了。

```CSS
/* input.css */
.element {
    background: oklab(
        from oklab(54.3% -22.5% -5%)
        calc(1.0 - l) 
        calc(a * 0.8)
        b
    );
}
```

编译之后的 CSS 代码：

```CSS
.element {
    background: rgb(12, 100, 100);
    background: oklab(from oklab(54.3% -22.5% -5%) calc(1.0 - l) calc(a * 0.8) b);
}
```

如果你正在使用 `postcss-preset-env`，并且使用的是最新版本，则已经拥有了此插件。有了这个 PostCSS 插件之后，你可以放心在项目中使用 CSS 的相对颜色了。

## 小结

在这节课中，我们主要一起探讨了 CSS 中可以使用的颜色格式，以及它们之间的差异和需要注意的事项。只有对它们有所了解之后，你才能在开发过程中选择正确的颜色格式。

另外，随着规范的变更，CSS 颜色函数的语法规则也有所变化，尤其在后面新出的颜色函数，比如 `hwb()` 、`lab()` 、`lch()` 、`oklab()` 和 `oklch()` 等不再支持老版本的语法，即使用逗号分隔参数。虽然如此，但老版本语法规则也没有被弃用，比如 `rgb()` 和 `hsl()` 还是可以使用老语法规则。需要注意的是，随着新语法规则的出现，在颜色函数中可以直接引入第四个参数，即颜色的透明通道，不过需要使用斜杠符（`/`）进行分隔。如此一来，以前的 `rgba()` 和 `hsla()` 就可以退出历史的舞台了。

更为有意思的是，新规范还增加了相对颜色语法功能，可以在颜色函数中使用 `from` 关键词，允许你基于某个原始颜色，调整所需参数，产生新的颜色。它在颜色转换、改变透明度、制作颜色主题等方面都非常有益。

除此之外，CSS 颜色方面还有许多更新的内容。比如，新的颜色规范为 Web 添加了许多新的颜色空间（例如文章中所提到的 OKLAB 和 OKLCH 等），还有一些新的颜色函数，比如 `color()` 函数。它们结合在一起，允许你为 Web 提供更为高清的颜色。那么在下一节课中，我们就和大家一起探讨这方面的话题，即**新的 CSS 颜色空间，为 Web 设置高清颜色**。
