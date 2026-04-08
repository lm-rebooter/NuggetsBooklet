我们在 Web 开发过程中，尤其是还原 Web 设计师的静态稿子时，总会发现元素之间的垂直距离与设计师提供的稿子有所差异，不能百分百还原它们之间的间距。这也让 Web 设计师和开发人员之间有争论：Web 设计师认为开发者并没有按照设计稿进行还原，而 Web 开发人员始终坚持自己是按照设计师进行还原的。说实在的，这样的一个过程并不愉快，而且也没有意义。

这一切的一切并不是 Web 开发人员没有按照设计师所提供的设计稿进行还原，而是许多设计工具和 Web 浏览器在处理行高（或者说行间距）的方式存在差异。以至于在大多数时候，Web 开发者都需要经过一定的 Hack 手段，才能达到 Web 设计师的诉求。但这并不是真正的解决方案，也不是最佳的解决方案。

庆幸的是，[CSS 行内布局模块 Level 3 ](https://www.w3.org/TR/css-inline-3/)（CSS Inline Layout Module Level 3）提供了两个属性，即 `text-box-trim` 和 `text-box-edge` 可以帮助 Web 开发者更好地处理元素之间的垂直方向的间距，使得元素在垂直方向的间距更能符合设计师的要求。在这节课中，我将和大家一起来探讨 `text-box-trim` 和 `text-box-edge` 属性，以及它们给 Web 排版带来的变化。

## 背景：间距给我们带来的烦恼

不知道大家是不是也曾碰到过这样的排版烦恼，特别是在 UI 还原的过程中，文本框之间或者说文本框和其他对象之间的间距总是和最终需要的诉求有所偏差。在视觉走查过程中，CSS 还原的效果和设计师想要的效果总是有一定的偏差，即**有额外的空间存在**。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f9f9106c7a6432791a1c2a48764c785~tplv-k3u1fbpfcp-zoom-1.image)

例如，上图中的标题和其相邻的矩形框为例：

```HTML
<div class="container"> 
    <h2>初一赛事报告</h2> 
    <div class="box"></div> 
</div> 
```

```CSS
h2 {
    margin-bottom: 42px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ae34f93427e425e9bbff81becf2ab09~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQOqKV>

实际效果，标题 `h2` 和 `div.box` 之间的间距和设计稿还是有一定差异：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb7932a9e6d44befa015858c905e6970~tplv-k3u1fbpfcp-zoom-1.image)

就上面示例而言，`h2` 的行高（`line-height`）是 `1.15`，如果你将其 `line-height` 设置为 `1`，可以看到它们之间的差异：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9cbdab2cb6d44eb8c2bc090ca8570d3~tplv-k3u1fbpfcp-zoom-1.image)

我们再来看一个纯文本排版的示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03563cdb89f746d59330ec990cde2538~tplv-k3u1fbpfcp-zoom-1.image)

在 Web 设计师选择的设计工具中，设计师分别定义了 `12px` 和 `36px` 的间距。但在浏览器中最终的结果看起来更像下图这样：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d54e81ecf36451f8de6b34e8c54cac4~tplv-k3u1fbpfcp-zoom-1.image)

如果看不出区别，你可以在浏览器中使用一些视觉走查工具，将还原出来的 Web 页面与 Web 设计重叠在一起对比，就能很快发现它们之间的差异：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac2ccca460f4462e80f9f5a82f9813a7~tplv-k3u1fbpfcp-zoom-1.image)

这看起来不对劲。Web 设计师测量间距时发现它们比原始布局要大得多。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e02df319bcb14b15a47116a714437084~tplv-k3u1fbpfcp-zoom-1.image)

换句话说，当使用边界框来度量空间时，它最终会比我们预期的要大。而且 `line-height` 越大，这样的问题越大。如果上面的示例还不够明显的话，我们来看下面这个例子，设计是通过测量边框之间的空间来创建的。当所有的间距被设置为 `32px` 时（在第一张卡片中），所有的垂直间距实际上比 `32px` 大得多（正如在第二张卡片中所示），即使你将它们全部设置为 `32px`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed78043a86824c4984ddf153614e33df~tplv-k3u1fbpfcp-zoom-1.image)

这是一个跨越工具和平台的常见问题，也是众多 Web 开发者在还原 UI 时最易于碰到的，同时也是最易和视觉设计师有冲突的。造成这个现象是有其历史原因存在的。如果要说清楚真正的原因，就要从字体设计说起。

在铅字由金属制成的年代，事情要简单得多。那个时候只有两个角色：类型设计师（Type Designer）和排字工人（Typesetter）。他们的工作受到物理宇宙规则的限制。

到了 19 世纪末期，制造行业已经掌握了大部分的基本技术，这也起到了推波助澜的作用。字体的生命从纸上开始，字体设计师将花费数周或数月的时间来勾勒出所有必要的字体形式。完成之后，字体的图纸就变成了一种字体：**实际上就是铅块**！

你需要为每个字母购买一个或多个这样的字母块，还需要为不同大小的文本购买额外的金属块。但是字体大小并不是用字母的大小来定义的，而是用金属块的高度来表示，用一个叫做点的单位来表示（每个点是 `1/72` 英寸，也就是 `0.4` 毫米）。块的高度是已知的，但在其中，类型设计师可以做任何他们想做的事情：**相同大小的字体可以更大或更小，它们的基线（baseline），即每个字母所在的行，可以更高或更低，** 等等。

当字体完成和字体制作好后，雇佣设计师的铸造厂将把它们卖给印刷厂。反过来，他们会雇佣排字工，把这些金属块排列成单词，然后是句子，是段落，最后是页面。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83e37371d6a1493d8520c4119db9724a~tplv-k3u1fbpfcp-zoom-1.image)

排字工人可以把一行行铅块一个接一个地排上去，这个过程叫做整型，因为它会产生整块的、同时有间隔的铅块。不过，通常他们会在文本中插入额外的窄金属片，以留出空间，让文本更流畅，让读者的眼睛更容易从一行跳到另一行。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52e557294a134a4481187ba56c2c3778~tplv-k3u1fbpfcp-zoom-1.image)

由于间隔条是用铅做的，添加空格的做法被称为“**前置**”，即 **Leading**。下面是一个 `16pt` 类型和 `4pt` 前置的示例，它为我们提供了合并行高为 `20pt` 的文本。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d22bbc3c35b14cc6af6e498ada8f9faf~tplv-k3u1fbpfcp-zoom-1.image)

找到合适的铅块是它自己的艺术。它需要根据字体大小和行长度有所不同。即使在处理相同的字体大小和相同数量的前置时，也会使一种字体看起来很局促，而另一种字体则是浮动的。

这是一个相对简单的系统，有着明确的角色和规则。字体来自铸造厂，作为一个整体、不可改变的块，行高只能增加，不能删除。当然，你也可以用一个具有不寻常的行高的字体。你的工作就是让它们按你的意愿摆放好。

但是进入到电脑世界中，这些铅字印刷排版的技术就毁了。

字体不再是铅块；相反，它们以打包成文件的数字集合的形式出现。Type Designer 或 Type Foundry 也必须准备不同文件格式的字体，以适应早期图形平台的要求，比如 Windows、MMacintosh 和现在已被遗忘的 OS/2。

当然，并不是每件事都是那么可怕的。计算机给了打字设计师和排字工人前所未有的自由。像素几乎不受金属（铅字印刷）的限制，事物可以随意重叠，或者从它们曾经僵硬的盒子中伸出来。作为一个排字工人，你可以添加任意多的前置（“leading”），而不需要任何实际的前置（“leading”）。或者，你可以删除所有前置。

在物理世界中，一个盒子需要有最小点的实际维度，因为前置只能被添加。但在数字类型中，字体的默认行高可以设置为一个完全任意的数字，而且它通常会比字体大小更高，读起来更舒服。比如下面这四种字体，大小都是 `16pt` 且行高为 `100%` 时的默认效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ad2aaa7907445d5a01d0c7e604f789c~tplv-k3u1fbpfcp-zoom-1.image)

话又说回来，事物是会随着时间和科学技术不断向前演进的，排版的技术也是如此。随着电脑屏幕的普及，更多的工作是针对屏幕本身设计的，因此产生了不同的需求。特别是在用户界面设计中，在图标或头像旁边小心地将文字垂直居中变得更加重要，而这个问题在印刷的世界中并不那么重要。

与此同时，一些古老的技术就会慢慢消失。字体和线高开始更多地用像素表示，而不是点。随着铅（铅印）的消失，“铅”一词慢慢被抽象的术语“行间距”所取代。

所有竞争的字体标准也融合在一起。业界发明了 [OpenType](https://en.wikipedia.org/wiki/OpenType) ，一种可以在任何地方使用的统一字体。这有点像一种错觉，在字体文件中，仍然有三组不同的值，不同的平台和程序只会选其中一组。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9343429bc9444373862ae4cca84dfda7~tplv-k3u1fbpfcp-zoom-1.image)

随着 1989 年，Web 的诞生，这个挑战也随之加剧。甚至说这种痛苦一直延续到现在。

人们把早期的 Web 构建块放在一起，做了两个决定，改变了**行高**的性质。首先，他们在每条线上和线下都分配了额外的空间，这些空间曾经是一条铅条。他们给新体制起了一个新名字，叫做“半前置”（Half-leading）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16296bc7bc064a07a1d164e7bc61ffe7~tplv-k3u1fbpfcp-zoom-1.image)

即：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/077e7712a4714205bc0ce52115262d5e~tplv-k3u1fbpfcp-zoom-1.image)

而 CSS 中又引入了另一个变化：行高的 `100%` 被重新定义为字体大小的 `100%`。以前，字体设计人员可能给 `16px` 的字体默认行高为 `20px`。但在 Web 上，无论最初的设计者是怎么规定的，`100%` 的 `16px` 字体的行高（`line-height`）都恰好是 `16px`。

原因很简单，知道字体的默认行高需要加载该字体，这在早期的互联网上可能会很慢。另一方面，将行高乘以字体大小可以立即完成。CSS 的创造者之一 [@Hakon Wium Lie](https://twitter.com/wiumlie) 提到过：**我们想在不加载字体的情况下做尽可能多的计算**。

行高不再能理解里面的字体。幸运的是，字体不需要符合物理框的大小，所以这不是一个大问题。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb500ad10f5a4eb59d84c334934240ab~tplv-k3u1fbpfcp-zoom-1.image)

因此，同样的字体将有一个 `16px` 的大小，但行高 `20px` 现在将表示为 `125%` 或 `1.25` ，因为 `16 × 1.25` 正好是 `20`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4b6f433415041f6906c8ad4c4d023d7~tplv-k3u1fbpfcp-zoom-1.image)

另外，Web 还剥夺了排字工人的一些控制。在印刷时代绝对的规则，现在变成了建议。将文本框精确地定位到你想要的位置不仅变得更加困难，而且常常会被阻止。毕竟，Web 浏览器可以在不同的电脑上找到，每台电脑都有不同的屏幕和安装的字体。

浏览器，就像之前的平台一样，现在必须承担一些类型渲染和排版的责任。但是可以想象，它们也有自己的特性和相应存在的缺陷。无论是对齐方式，还是像素四舍五入的计算，甚至是 CSS 不同属性的渲染结果等都有不同。

这也就造成了前面提到的现象。简单地说，Web 上各个元素之间的垂直方向间距，一直是 Web 设计人员（相当于铅印时代的“类型设计师”）和开发人员（相当于铅印时代的“排字工人”）经常争论的问题。设计者坚持认为他们在浏览器中看到布局和他们最初设计的布局完全不一样。开发人员回答说，样式表中的所有间距和设计稿中的间距是完全匹配的。那么是谁对的呢？棘手的是：在某种程序上，他们都是对的。

## 排版术语

从上一节的内容中，我们或多或少知道从铅印术到 Web 的排版之间变化以及差异。但对于众多 Web 开发者来说，他可能对这些并不感兴趣，甚至不知道这个历史的发展过程。而他们更关心的是为什么会有这样的现象？也就是说，我们抛开其他的一切，仅仅从 Web 排版的角度来说，造成文章开头提到的现象，其最大的原因就是：“**字体的行高引起了垂直间距的偏差**”！

也就是说，了解了 `line-height` 这一切都变得好说，但是在 Web 排版中，或者说在 CSS 的世界中，CSS 的 `line-height` 是一个非常复杂的技术体系，它涉及的东西特别多，比如说，字体如何工作就足够我们花很多时间去了解学习。

前置（“leading”）和 `line-height` 尽管相似，但有一些重要的区别。要理解这些差异，我们首先要对排版有更多了解。

在传统的西方字体设计中，一行文字由以下几个部分组成。

-   **基线（Baseline）** ：这是类型所在的假想线。当你在横线笔记本上写字时，基线就是你写字的那条线。
-   **上降线（Descender）** ：这条线正好位于基线之一，它是一些字符（比如小写的 `g`、`j`、`q`、`y` 和 `p`）触及基线以下的一行。
-   **`x-height`**：这是一行文本中标准小写 `x` 的高度。一般来说，这是其他小写字母的高度，尽管有些字符的某些部分可能会超过 `x` 高度。
-   **帽高（Cap-height）** ：这是在给定行的文本中大部分大写字母的高度。
-   **上升线（Ascender）** ：通常出现在帽高之上的一条线，其中一些字符如小写字母 `h` 或 `b` 可能会超过正常的帽高 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0958f0505ea74fed886d0aef17a7962a~tplv-k3u1fbpfcp-zoom-1.image)

上面描述的文本的每个部分都是字体本身固有的，设计字体时要考虑这些因素。然而，排版的某些部分是留给排版者而不是设计者的，其中一个就是前置（“leading”）。

前置定义为一组类型中两个基线之间的距离。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/668bc991b9d64ce8a23d7a8da08e6f78~tplv-k3u1fbpfcp-zoom-1.image)

CSS 开发人员可能会想，“好的，前置（leading）是行高，那我知道了”。但事实上，它们还是有很大差异的。

如果开发者要彻底掌握这些，还是需要对字体度量有深度的理解，而且字体度量很多东西只对设计师暴露，对 Web 开发者是不暴露的。从排版的术语中可能你已经感知到了，其中 `line-height` 是对 Web 开发者影响最大的。如果你想深入了解这方面的内容，建议你阅读下面这些资料：

-   [Intro to Font Metrics](https://westonthayer.com/writing/intro-to-font-metrics/)
-   [Flipping how we define typography in CSS](https://seek-oss.github.io/capsize/)
-   [How to Tame Line Height in CSS](https://css-tricks.com/how-to-tame-line-height-in-css/)
-   [Deep dive CSS: font metrics, line-height and vertical-align](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align)

有了这些基本概念，我们就可以来聊聊 CSS 的 `text-box-trim` 和 `text-box-edge` 。

## CSS 的铅剪术

正是像这样的挑战，促使 CSS 工作组为排版提供了新的 CSS 属性，比如 `text-box-trim` 和 `text-box-edge` 。这将大大改善对文本行位置和间距的控制。

CSS 的 `text-box-trim` 和 `text-box-edge` 两个属性来自 [CSS 行内布局模块 Level 3 ](https://www.w3.org/TR/css-inline-3/)（CSS Inline Layout Module Level 3），它们被称为 **CSS 的铅剪术**。其中：

-   `text-box-trim` 将允许你修剪文本上方或下方的所有额外间距；
-   `text-box-edge` 将允许你设置内联框的上下边缘，即使用哪个度量作为内联框的布局边界的上边界和下边界的基础。

需要注意的是，[在 2022 年 11 月 4 日之前](https://github.com/w3c/csswg-drafts/issues/8067)，`text-box-trim` 和 `text-box-edge` 分别称为 `leading-trim` 和 `text-edge` 。另外，到目前为止（写这节课的时候），[仅 Safar TP 17 支持这两个属性](https://caniuse.com/css-text-box-trim)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78488ec8ba254d8ba4ab3e26b67115bf~tplv-k3u1fbpfcp-zoom-1.image)

### CSS 的 text-box-trim

> `text-box-trim` 试图改变我们使用了近三十多年的标准。

[CSS 行布局引入了 text-box-trim 属性](https://www.w3.org/TR/css-inline-3/#leading-trim)，其主要作用就是**用来改变文本布局**。

`text-box-trim` 也被称为“铅剪切”。在铅印刷术中，为了让铅字块（排成行）之间有一定的间距，排字工人会在行与行之间垫一些铅条，让阅读变得更舒服一些。在那个时代，铅条一般都放置在铅块下方。同样的，在 Web 排版上也有铅条的身影，只不过他分为上下两个部分。在 CSS 中引入该特性，它的工作原理就像一个文本框被剪切，切掉文本框上下之间多余的空间，这个空间其实就是铅条高度的一半：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/324eea0a62854c319555ff823980968e~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，`text-box-trim` 属性允许剪切掉第一行和最后一行文本上方和下方的额外空间，从而允许更精确地控制字形周围的间距。此外，通过依赖字体度量而不是硬编码的长度，它允许内容调整大小，重新包装并以各种字体呈现，同时保持该间距。

CSS 的 `text-box-trim` 属性主要有 `none` （其初始值）、`start` 、`end` 和 `both` 。它们的含义如下：

-   **`none`** ：当 `text-box-trim` 应用在块容器时，不会对第一个和最后一个行盒子进行特殊处理。当 `text-box-trim` 运用在行内盒子时，指定上和下内容边缘与文本上和文本下基线重合，而且不会考虑 `text-box-edge` 。
-   **`start`** ：当 `text-box-trim` 应用在块容器时，将第一个格式化的行的 `block-start` 端修剪为其根内联框的相应文框边缘度量。如果没有这样的行，或者有介入的非零填充（`padding`）或边框（`border`），则没有效果。当 `text-box-trim` 应用于内联框，修剪框的 `block-start` 端以将其内容边缘与 `text-box-edge` 指定的度量匹配（将 `leading` 视为文本）。
-   **`end`** ：刚好与 `start` 相反。当 `text-box-trim` 应用在块容器时，将最后一个格式化行的 `block-end` 端修剪为其根内联框的相应文本框边缘度量。如果没有这样的行，或者有介入的非零内距（`padding`）或边框（`border`），则没有效果。当 `text-box-trim` 运用于内联框，修剪框的 `block-end` 端以将其内容边缘与 `text-box-edge` 指定的度量匹配（将 `leading` 视为文本）。
-   **`both`** ：同时具备 `start` 和 `end` 的行为。

注意：当 `writing-mode` 为 `vertical-lr` 时，块结束端不会与行下端重合。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/286a808352414937a184d6cfd09fe163~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQOrLN> （请使用 Safari TP 17 查看）

正如你所看到的，`text-box-trim` 只在行内框（`display: inline`）、块容器（`display:block`）和内联框（`display: inline-block`）中有效。而且该属性必须与 `text-box-edge` 一起使用才会有效果，**`text-box-edge`** **属性的值还不能是** **`leading`** **，否则** **`text-box-trim`** **也无效**。

再来看一个具体的示例：

```
h1 { 
    text-box-edge: cap alphabetic; 
    text-box-trim: both; 
}
```

首先使用 `text-box-edge` 来告诉浏览器想要的文本边缘是帽高（Cap-height）和字母基线。然后用 `text-box-trim` 从上下两边修剪。注意，边框只影响文本边框，它不会切断其中的文字。这两行简单的 CSS 创建了一个包含文本的干净文本框。这有助于实现精确的间距（垂直方向方本块与其他元素之间的间距），并创建更好的视觉层次结构。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d59522de4d584ff4b97f598f890483d6~tplv-k3u1fbpfcp-zoom-1.image)

### CSS 的 text-box-edge

在 CSS 布局模型中，文本框边缘是一个框（可能是块级框、行框或内联框）中表现文本行边界的一系列指标。特别地，其从该盒子的第一行顶部开始，结束于该盒子最后一行的底部结尾。这些指标取决于 `font-family` 、`font-size` 、`vertical-align` 、`line-height` 、`font-size-adjust` 以及 `text-box-trim` 和 `text-box-edge` 等属性。它们可能比上升（ascent）和下降（descent）高或低，但它们反映了字形的视觉边缘。例如，在大多数情况下，句点符号通常位于基线（baseline）下面，因此其底部减去字形的下部空间反映视觉下边缘。

CSS 的 `text-box-edge` 属性指定了文本框边缘的度量。它在内联框和块容器上都有用，并且在一些情况下，`text-box-trim` 渲染结果与 `text-box-edge` 的度量方式有直接关系。

`text-box-edge` 属性的值主要有 `leading` （默认值）、`text` 、`cap` 、`ex` 、`ideographic` 和 `ideographic-ink` 等。每个值代表的度量方式如下所示。

-   `leading` ：使用上升（Ascent）或下降（Descent）加上任何正的半前置（Half-leading），为了调整行盒的大小，将忽略外边距 `margin` 、内距 `padding` 和边框 `border` 。
-   `text` ：使用文本在基线之上、文本在基线之下。
-   `cap` ：使用帽高（Cap-height）。
-   `ex` ：使用 `x` 高度。
-   `ideographic` ：使用表意字符上基线或表意字符下基线。
-   `ideographic-ink` ：使用表意字符油墨覆盖上基线或下基线。
-   `alphabetic` ：使用字符基线。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2caeb8757179432c8cba09183a5f3dcd~tplv-k3u1fbpfcp-zoom-1.image)

`text-box-edge` 属性定义使用哪个度量作为内联框的布局边界的上边界和下边界的基础。`text-box-trim` 属性可用于将内容边匹配到这些相同的度量。`text-box-edge` 属性可以接受两个值，其中第一个值指定文本框上边的度量方式，第二个值指定文本框下边缘的度量方式。如果只指定了一个值，则尽可能给两条边分配相同的关键字。

```CSS
:root {
    --leading: leading;
    --text: text;
    --cap: cap;
    --ex: ex;
    --ideographic: ideographic;
    --ideographic-ink: ideographic-ink;
    --alphabetic: alphabetic;
    --text-and-alphabetic: text alphabetic;
    --text-and-ideographic: text ideographic;
    --text-and-ideographic-ink: text ideographic-ink;
    --cap-and-text: cap text;
    --cap-and-alphabetic: cap alphabetic;
    --cap-and-ideographic: cap ideographic;
    --cap-and-ideographic-ink: cap ideographic-ink;
    --ideographic-and-text: ideographic text;
    --ideographic-and-alphabetic: ideographic alphabetic;
    --ideographic-and-ideographic-ink:ideographic ideographic-ink;
    --ideographic-ink-and-text: ideographic-ink text;
    --ideographic-ink-and-alphabetic: ideographic-ink alphabetic;
    --ideographic-ink-and-ideographic: ideographic-ink ideographic;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be35df83737f4408a031381b681050cd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzRyRyR> （请使用 Safari TP 17+ 查看）

注意，`leading` 和 `text` 值依赖于字体的上升和下降以确保文本匹配。其他值更可能由于高于指定的度量值而导致重叠或溢出，因此使用这些值的作者需要小心地在行上提供足够的间距。

内联框对其行内框逻辑高度的贡献总是根据其自身的文本度量来计算，如下所述，并由 `text-box-edge` 和 `line-height` 控制。子框的大小和位置不会影响它的布局边界。

当计算出的 `line-height` 不是 `normal` 时，它的布局边界仅从其第一种可用字体度量（忽略其他字体的符号）派生出来，并使用前置（“leading”）来调整有效的 `A` 和 `D`，使其与所使用的 `line-height` 相加。我们可以使用下面的公式来计算主要的 `L`：

```
1. A 表示其在基线上方的上升度量，即 Ascent
2. D 表示其在基线下方的下降度量，即 Descent
3. L 表示前置 Leading
​
L = line-height - (A + D)
```

一半的前置（Half-leading）添加上面的第一个可用的字体，和下面的另一半D的第一个可用字体，使用一个有效地提升上面的基线，该基线可以按下面的公式计算：

```
A′ = A + L / 2 
```

一个有效的：

```
D′ = D + L / 2
```

但是，如果 `text-box-edge` 不是 `leading`，这也不是根行内框，如果半前置（Half-leading）是正值，则将其视为 `0`。布局边界准确地包含了这个有效的 `A'` 和 `D'`。

此外，`text-box-edge` 不是 `leading` 时，布局边界会因每边的 `margin`、`padding` 和 `border` 的总和进行扩展。

## text-box-trim 和 text-box-edge 可用来做些什么？

`text-box-trim` 和 `text-box-edge` 最大的功能就是可以用来改变文本垂直方向的排版方式。例如，用它们来控制半导前置（Half-leading）。

为了确保在运行文本的基本情况下保持一致的间距，CSS 行布局引入了在每行文本内容的上面和下面同时具有前置（Half-leading）。换句话说，铅印术中的铅垫片一分为二，放在了文本的上面和下面。此外，上升（Ascent）和 下降（Descent）字体度量本身包括在最常见符号大小的上方和下方的额外空间，以便容纳上升或下降超出典型边界的偶发字符和变音符号。这可以防止后续的文本行相互重叠。然而，所有这些额外的间距都干扰了视觉对齐和有效（视觉上的）间距的控制。

CSS 的 `text-box-trim` 属性允许控制块的第一行和最后一行之上和之下的间距。它允许精确控制间距；此外，通过依赖字体度量而不是硬编码的长度，它允许内容调整大小、重新包装和以各种字体渲染，同时保持间距。

我们来看一个常见的问题，即垂直居中。将文本容器和图标在垂直方向居中对齐，从 CSS 的角度来看，实现这样的效果似乎并不复杂，但是因为拉丁文本的视觉边界是帽高（Cap-height）和字母基线（Baseline），而不是上升和下降，所以这通常不会产生预期的视觉效果。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6214f648b3d44d79b28ca5fc7a9403a~tplv-k3u1fbpfcp-zoom-1.image)

测量到文本的顶部、底部可能会产生相同的结果，但是测量到视觉边界表明它在视觉上没有居中。为了在视觉上使文本居中，有必要假设帽高（Cap-height）和字母基线（Baseline）分别作为文本的上边缘和下边缘。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/605ab011e10a452b91be22c103a4adc2~tplv-k3u1fbpfcp-zoom-1.image)

测量帽高度和字母基线，而不是上升和下降，并在视觉上平衡这些距离使文本处于中心位置。使用 `text-box--trim` 去除帽高以上和字母基线以下的间距，方框的中心实际上是文本的中心。并且，无论使用什么字体来渲染它，都能可靠地做到这一点。

```HTML
<div class="container">
    <span>Market Fit</span>
</div>
```

```CSS
.container {
    --font-family: "Exo";
    display: flex;
    justify-content: center;
    align-items:center;
    outline: 1px dashed orange;
    gap: 5px;
    font-size: clamp(2rem, 4vw + 2.5rem, 3rem);
    font-family: var(--font-family);
}
​
.container span {
    display: inline-block;
    text-box-trim: both;
    text-box-edge: cap alphabetic;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f5fa735d57c4855a79ef02280b3b107~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQaQGY> （请使用 Safari TP17 查看）

再来看一个同样是解决对齐问题的示例。

在 Web 排版中，容器中的文本垂直居中是一个自古以来的难题。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45a2d65645c74eb9b5fc8f26418e856d~tplv-k3u1fbpfcp-zoom-1.image)

在默认行高（`line-height`）中保留的额外空间导致文本在文本框并没有真的垂直居中，使用 `text-box-trim` 和 `text-box-edge`，可以将文本在按钮框中垂直居中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8766e5d9e0d471ab82891e894631653~tplv-k3u1fbpfcp-zoom-1.image)

另外每种字体的设计也不一定相同。它有自己的默认行高，其中的文本可以有不同的大小和基线位置。因此，有时即使字体大小（`font-size`）、行高（`line-height`）和文本框位置保持不变，改变字体也会改变文本的对齐方式（特别是文本在一个容器中，始终有时候看上去偏上或偏下，没有垂直居中），就像下图这样：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd08896aaace4f58963a48080c325ed3~tplv-k3u1fbpfcp-zoom-1.image)

在第二个示例中，你可以看到引入 `text-box-trim` 和 `text-box-edge` 是如何防止这种情况发生，并使文本保持原样。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a38360e38b2e4e808bae9926b852c7a8~tplv-k3u1fbpfcp-zoom-1.image)

具体代码如下：

```HTML
<button>
    <span>Button</span>
</button>
```

```CSS
.button {
    --font-family: "Exo";
    display: flex;
    justify-content: center;
    align-items:center;
    border: 1px solid currentColor;
    min-height: 80px;
    border-radius: 5px;
    font-size: clamp(2rem, 4vw + 2.5rem, 3rem);
    font-family: var(--font-family);
}
​
.button span {
    display: inline-block;
    text-box-trim: both;
    text-box-edge: cap alphabetic;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47be7f1b9a884ff7aa6ba3b6b5b068f9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwpwwJ> （请使用 Safari TP17 查看）

## 小结

在这节课中，主要向大家介绍了 CSS 的 `text-box-trim` 和 `text-box-edge` 两个属性的基本运用。它们是用于控制文本框边缘的两个属性。这两个属性对于我们 Web 排版来说是非常有用的，特别是解决一些文本块与文本块（首行和末尾行之间的间距），文本块（首行与末尾行）和元素块之间的间距，甚至是容器中垂直对齐，图标和文本的垂直对齐都将非常有的有用。甚至可以说，解决 Web 开发人员一直以来存在的排版困惑。可以说，这两个属性是我们一直期待的特性，或许在不久就可以运用到项目中。但要彻底了解他们，还需要深入学习字体的设计、排版技术等相关的知识，但它们都已经超出了 Web 开发者的知识范围，这里不做过多阐述。