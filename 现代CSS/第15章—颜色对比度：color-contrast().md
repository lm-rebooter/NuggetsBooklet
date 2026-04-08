你是否曾因为一个网站使用困难而感到沮丧，甚至放弃使用？也许是因为网站的文本太小，也许是由于颜色方案导致阅读困难，也许是在非常明亮或低光环境中难以看清屏幕……

如果你也曾有这些令人讨厌的经历，导致无法正确浏览网站，那你很可能已经在某种形式上体验了不可访问性。

如果你是名 Web 设计师或开发者，为 Web 提供了更好的字体大小，那么就可以提高所有用户的体验和可访问性，包括视力受损的人。

作为 Web 设计师或开发人员，需要了解人们如何感知颜色和对比度，无论是暂时的，情境性的还是永久性的。作为 Web 开发人员，我们可以使用 CSS 的 `color-contrast()`创建易于访问的用户界面，创建一个更具平等和包容性的 Web 应用。

## 颜色对比度和可访问性基础知识

在具体介绍 CSS 的 `color-contrast()` 之前，我们先花一点时间来了解一些可访问的颜色对比度以及与 Web 可访问性相关的基础知识。

### 感知颜色

你知道吗？物体并不拥有颜色，而是会反射光的波长。当你看到颜色时，你的眼睛接收和处理这些波长，并将其转换为颜色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5123d69a06de4e1194677d018236acd5~tplv-k3u1fbpfcp-zoom-1.image)

当涉及数字可访问性时，我们称这些波长为**色相**、**饱和度**和**亮度**（HSL）。HSL 模型被创建为 RGB 颜色模型的一种替代，更接近人类感知颜色的方式。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e0c282beb3a462b9b743b3cf5b93040~tplv-k3u1fbpfcp-zoom-1.image)

> 在 CSS 中，可以使用许多方式指定颜色，例如使用颜色名称、RGB、HEX、HSL、HWB、LCH、LAB、OKLAB 和 OKLCH 等。有关于这方面更具体的介绍，可以阅读《[10 | 现代 CSS 中的颜色格式：RGB、HSL、HWB、LAB 和 LCH](https://juejin.cn/book/7223230325122400288/section/7231515598088306720)》和《[12 | CSS 中的 OKLCH 和 OKLAB](https://juejin.cn/book/7223230325122400288/section/7235205520154427429)》。

色相是描述颜色的一种定性方式，如红色、绿色或蓝色，每种色相在颜色谱上具有特定的位置，取值范围为 `0 ~ 360` ，红色为 `0`，绿色为 `120`，蓝色为 `240`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f5042e063a44483b5db832f8ba30ccd~tplv-k3u1fbpfcp-zoom-1.image)

饱和度是颜色的强度，以 `0% ~ 100%` 的百分比测量。饱和度为 `100%` 的颜色非常鲜明，而饱和度为 `0%` 的颜色则是灰色或黑白色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92754c8f6ec3421093dbbdd80fae2ab5~tplv-k3u1fbpfcp-zoom-1.image)

亮度是颜色的明暗程度，以 `0%`（黑色）到 `100%`（白色）的百分比测量。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a40af57c3d34149ac002c40f0d2d183~tplv-k3u1fbpfcp-zoom-1.image)

上面所列的仅是 HSL 颜色模式，在 CSS 中还有其他的颜色模式，比如 LCH、LAB 之类，在这里就不多说了，感兴趣的可以阅读《[11 | 新的 CSS 颜色空间：为 Web 设置高清颜色](https://juejin.cn/book/7223230325122400288/section/7233227753909125178)》。

### 什么是颜色对比度

对比度最简单的描述就是两种颜色在亮度（Brightness）上的差别，理解对比度的一个好方法是比较色调相同的颜色。两个颜色越接近，对比度越低。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e832ccd660a64de5a30d3387ba493daa~tplv-k3u1fbpfcp-zoom-1.image)

除了在灰色调做对比之外，还可以在不同色调的颜色之间做对比：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70ed33e097a948e58be9f48cc73fee2b~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，**对比度解释了在给定范围内最亮颜色亮度和最暗颜色亮度之间****的****差异**。它是每种颜色的[相对亮度（Relative Luminance）](https://www.w3.org/TR/WCAG/%23dfn-relative-luminance)，是标准化的值，从最黑的 `0` 值到最亮的 `1` 值。

要想更好地理解颜色对比度需要一些数学知识。庆幸的是，[W3C 规范](https://www.w3.org/TR/WCAG20-TECHS/G17.html%23G17-tests)已经为社区提供了帮助分析同时使用的两种颜色的公式。规则中提供的将 RGB 值转换为相对亮度的公式如下所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8704f6f77bb74853991452913cacc2d3~tplv-k3u1fbpfcp-zoom-1.image)

对于 sRGB 颜色空间，颜色的相对亮度（Luma）的计算公式：

```CSS
Luma = 0.2126 × R + 0.7152 × G + 0.0722 × B 
```

其中 `R`、`G` 和 `B` 通道值的校正细节：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ba753cdfd904341ad337a3943286a88~tplv-k3u1fbpfcp-zoom-1.image)

最终得到`sRGB`颜色空间中的`R`、`G`和`B`的值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d76b89cc867443b83d3384f693198d6~tplv-k3u1fbpfcp-zoom-1.image)

有了一种确定颜色相对亮度的方法，就可以用所谓的颜色对比度来比较它们：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a735e8a3034440b182138e5e795ea88f~tplv-k3u1fbpfcp-zoom-1.image)

我们来看一个简单的示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23d698a82603424cb5803dc549c1430e~tplv-k3u1fbpfcp-zoom-1.image)

比如上图中的按钮，背景色颜色值是 `#ff4400`，文本颜色值是 `#ffffff`。如果要计算出这两种颜色的相对亮度，首先要得到颜色的 RGB 表示法。取出对应颜色的 `R`、`G` 和 `B` 颜色通道的值：

```CSS
#ff4400  ❯❯❯ rgb(255 68 0)    ❯❯❯ R = 255, G = 68, B = 0 

#ffffff  ❯❯❯ rgb(255 255 255) ❯❯❯ R = 255, G = 255, B = 255
```

也可以直接使用拾色器取出颜色 RGB 的值。接下来将 `R`、`G` 和 `B` 各通道的值除以 `255`，就可以得到对应的线性值：

```CSS
#ff4400  ❯❯❯ rgb(255 68 0) 
❯ R = 255 ❯❯❯ 255 ÷ 255 = 1 
❯ G = 68  ❯❯❯ 68  ÷ 255 = 0.26666667 
❯ B = 0   ❯❯❯ 0   ÷ 255 = 0 

#ffffff  ❯❯❯ rgb(255 255 255) 
❯ R = 255 ❯❯❯ 255 ÷ 255 = 1 
❯ G = 255 ❯❯❯ 255 ÷ 255 = 1 
❯ B = 255 ❯❯❯ 255 ÷ 255 = 1 
```

然后，需要对 RGB 颜色各通道的值进行校正，一般采用 **[伽玛校正](https://www.cambridgeincolour.com/tutorials/gamma-correction.htm)**（它定义了像素的数值和它的实际亮度之间的关系）。

> 伽玛校正是将计算机“看到”的东西转化为人类对亮度的感知。计算机直接记录光，其中两倍的光子等于两倍的亮度。人的眼睛在昏暗的条件下会感知到更多的光线，而在明亮的条件下则会感知到更少的光线。我们周围的数字设备一直在进行伽玛编码和解码计算。

不了解伽玛校正也不用担心，我们可以直接按照下面的公式校正 `R`、`G` 和 `B` 值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb73e911d8c5486bb69b945d21d56261~tplv-k3u1fbpfcp-zoom-1.image)

先来看 `#ff4400` 颜色：

```CSS
R = 1 ❯❯❯ R > 0.03928 ❯❯❯ ((R + 0.055) ÷ 1.055) ^ 2.4 = ((1 + 0.055) ÷ 1.055) ^ 2.4 = 1 
G = 0.26666667 ÷ 12.92 ❯❯❯ G > 0.03928 ❯❯❯ ((R + 0.055) ÷ 1.055) ^ 2.4 = ((0.26666667 + 0.055) ÷ 1.055) ^ 2.4 = 0.05780543 
B = 0 ❯❯❯ B <= 0.03928 ❯❯❯ B ÷ 12.92 = 0 ÷ 12.92 = 0 
```

`#ffffff` 颜色的 `R`、`G` 和 `B` 正好都相等，值为 `1`，大于 `0.03928`，计算出来的幂值为 `1`。

最后，我们用数字来表示颜色在人眼中的亮度，可以用下面的公式来计算：

```CSS
 Luma = 0.2126 × R + 0.7152 × G + 0.0722 × B 
```

我们就可以计算出 `#ffffff` 和 `#ff4400` 对应的相对亮度的值，为了区分这两者，我们分别用`Luma1` 和 `Luma2` 来表示：

```CSS
 #ffffff ❯❯❯ Luma1 = 0.2126 × R + 0.7152 × G + 0.0722 × B = 0.2126 × 1 + 0.7152 × 1 + 0.0722 × 1 = 1 
 #ff4400 ❯❯❯ Luma2 = 0.2126 × R + 0.7152 × G + 0.0722 * B = 0.2126 × 1 + 0.7152 × 0.05780543 + 0.0722 × 0 = 0.25394244 
```

这样就得到了计算颜色对比度所需要的 `Luma1` 和 `Luma2` 的值。为了确定哪个值是 `Luma1`，哪个值是 `Luma2`，我们需要确保较大的数字（亮色）始终是 `Luma1`，将较小的数字（暗色）为 `Luma2`，然后根据对比度计算公式：

```CSS
R = (Luma1 + 0.05) ÷ (Luma2 + 0.05) = (1 + 0.05) ÷ (0.25394244 + 0.05) = 1.05 ÷ 0.30394244 = 3.4546 
```

`#ff4400` 和 `#ffffff` 两颜色的对比度的值约为 `3.4546`。

现在将这个结果与 WCAG 指南中颜色对比度准则进行比较。就上图示例来说，按钮的文本字号 `19pt`，而且加粗，属于大号文本规范：

> 当文本字号（`font-size`）大于 `18pt`（大约 `24px`）或大于 `14pt`（大约 `19px`）粗体时，文本被认为是大号的。大号字体需要达到 `3:1` 的对比度才能通过 `AA` 级，`4.5:1` 的对比度才能通过 `AAA` 级。

`#ff4400` 和 `#ffffff` 的对比值大约是 `3.4546:1`，达到了 `AA` 级标准。如果你不放心整个计算的结果，可以使用[在线工具来验证](https://accessible-colors.com/)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8f255130f054069ab40f8a60015616e~tplv-k3u1fbpfcp-zoom-1.image)

> 在线工具地址：<https://accessible-colors.com/>

你也可以用 JavaScript 脚本构建一个关于颜色对比度检测的工具：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db13615824764bb6b20d16d7a7c95e9f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmVOXv>

不过，[@Andrew Somers 通过研究和实践发现，该算法提供了错误的结果](https://myndex.com/WEB/W3Contrastissue)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9c48479186c44e2b6192c46d81f1e01~tplv-k3u1fbpfcp-zoom-1.image)

目前，[Silver Task Force 正在研究一种新的检测对比度的模型](https://www.w3.org/WAI/GL/task-forces/silver/)，由于当前的对比度比率不是一种理想的算法，[Silver Task Force 正在研究一种新的可达性准则](https://github.com/w3c/wcag/issues/695)。

### 颜色对比度准则

Web 可访问性（A11Y）服务的群体并不仅服务于残疾人，也服务于很多正常人。因为一些特定环境下会影响正常人士正常访问或使用你的 Web 应用。而颜色的对比度更是如此，因为一个视力低或色盲的人在没有足够对比度的情况下无法区分文本，甚至视力正常的人在特定环境下（比如阳光下、夜晚中）也存在这方面问题。

另外，不要忘记感知颜色是一个需要大脑参与的过程。所以人们可能会有认知问题，这可能会影响他们对颜色的感知，例如在相邻颜色相似的情况下，它们可能看起来更相似或更不同，或者在某些照明条件下，白色可能看起来发黄或灰暗，或者蓝色可能看起来更加饱和。在 Web 的环境中，[WCAG（Web 可访问性指南）规范](https://www.w3.org/TR/WCAG21/)中有许多关于颜色使用的指南。分别是：

*   [Use of Color:Understanding SC 1.4.1 ](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-without-color.html)
*   [Understanding Success Criterion 1.4.3: Contrast (Minimum) ](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
*   [Contrast (Enhanced):Understanding SC 1.4.6 ](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast7.html)
*   [Understanding Success Criterion 1.4.11: Non-text Contrast ](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)

这些指南可以帮助我们在 Web 中更好地处理颜色对比度。WCAG 指南中将颜色对比度分为三个级别：`A`、`AA` 和 `AAA`。例如，如果一个网站满足了 `AA` 级别的所有要求，那么它就满足了 `AA` 级别。在对比度方面，主要分为文本对比度（`AAA` 和 `AA`）和非文本对比度（仅`AA`）。

在涉及文本（或文本的图像）时，需要在文本和背景颜色之间有足够的对比度。可接受的对比度有两个级别：`AA`和 `AAA`。根据文本的大小，这个级别的定义有所不同。

当文本字号（`font-size`）小于 `18pt`（大约 `24px`）或小于 `14pt`（大约 `19px`）粗体时，文本被认为是小号的。小号字体需要达到 `4.5:1` 的对比度才能通过 `AA` 级，`7:1` 的对比度才能通过 `AAA` 级。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e39ee6ef1d274854b33676251f797d65~tplv-k3u1fbpfcp-zoom-1.image)

当文本字号（`font-size`）大于 `18pt`（大约 `24px`）或大于 `14pt`（大约 `19px`）粗体时，文本被认为是大号的。大号字体需要达到 `3:1` 的对比度才能通过 `AA` 级，`4.5:1` 的对比度才能通过 `AAA` 级。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6369eb62cb1c423d8c62fcc9ef4bf9a0~tplv-k3u1fbpfcp-zoom-1.image)

用户界面组件与相邻背景的对比度至少需要达到 `3:1` ，才能达到 `AA` 级：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad87ff1282de43f0a8c001c0198e4dcf~tplv-k3u1fbpfcp-zoom-1.image)

此外，以下几个场景，颜色对比度分数至少要达到 `3:1`：

*   图标和表单元素
*   图形对象（比如图表）
*   元素的焦点、悬浮和激活状态

### 测量颜色对比度

为了帮助支持不同视觉障碍的人群，[WAI 小组](https://www.w3.org/WAI/about/groups/waiig/)创建了一种颜色对比度公式，以确保文本与其背景之间存在足够的对比度。遵循这些颜色对比度比例，低视力人士可以在不需要对比度增强辅助技术的情况下阅读背景上的文本。

让我们看一下颜色鲜艳的图像，并比较这张图像对于特定类型的色盲患者来说会是什么样子。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d259dac9534e63a01af630728497a4~tplv-k3u1fbpfcp-zoom-1.image)

左边的图像显示了紫色、红色、橙色、黄色、水绿色、浅蓝色和深蓝色的彩虹沙。右边是更亮，五颜六色的彩虹图案。

就上图而言，患有不同类型色盲症的人所看到的结果也不同：

*   [绿色色盲](https://www.color-blindness.com/deuteranopia-red-green-color-blindness/)人眼睛中感知绿色的锥形细胞的数量不足，导致无法区分绿色和其他颜色，比如红色、黄色和橙色等，这可能导致色彩上的困惑和误解。绿色色盲无法看到正常人所看到的绿色，而是将绿色错认为灰色或棕色。
*   [红色色盲](https://www.color-blindness.com/protanopia-red-green-color-blindness/)人眼睛中感知红色的锥形细胞的数量不足，导致无法区分红色和其他颜色，比如深绿、棕色和橙色等，这可能导致色彩上的困惑和误解。相对于绿色色盲，红色色盲的情况稍微较为罕见。红色色盲常常将红色与褐色混淆，甚至是颜色过于鲜艳的橙色或者绿色。
*   [无色觉的人](https://www.color-blindness.com/2007/07/20/monochromacy-complete-color-blindness/)对红、绿、蓝光的感知几乎为零。无色觉的人无法感知彩色，这意味着他们无法区分任何颜色的差异，视界中所有物体变成了黑白灰色的，类似于黑白电视的效果。无色觉可能是因为一个人的视网膜上的视觉接收器完全缺失，或者这些接收器无法分辨任何颜色。这种情况非常罕见，只有少数人会出现无色觉。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b307b681181418db58d106b69f46faa~tplv-k3u1fbpfcp-zoom-1.image)

前面提到过，我们可以根据颜色对比度公式计算出颜色的对比度。该公式使用颜色的相对亮度来帮助确定颜色对比度，可以从 `1` 到 `21` 变化，例如，纯黑与纯白之间的对比度最大，为 `21:1` 。

为了符合 WCAG 对颜色的最低要求，包括文本图像在内的常规大小文本必须具有 `4.5:1` 的颜色对比度。大号文本和基本图标必须具有 `3:1` 的颜色对比度。大号文本的特点是字号至少为 `18pt` （`24px`）或 `14pt` （`18.5px`）加粗。标志和装饰元素不受这些颜色对比度要求的限制。

值得庆幸的是，我们可以不用花太多时间去学习它们之间的计算方式，因为有很多工具可以进行颜色对比度计算。像 [Adobe Color](https://color.adobe.com/create/color-accessibility)、[Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)、[Leonardo](https://leonardocolor.io/) 和 [Chrome 的 DevTools 颜色选择器](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast)这样的工具可以快速告诉你颜色对比度比例并提供建议，帮助创建最具包容性的颜色对和调色板。

除此之外，还可以使用一些专业的应用软件和浏览器插件，帮助你在选择颜色时能达到颜色对比度准则。比如 [Pika](https://superhighfives.com/pika) ，它就是一款很好用的 macOS App 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d9a1f98b3f0416698062fdd1a636e1d~tplv-k3u1fbpfcp-zoom-1.image)

> Pika 官网地址：<https://superhighfives.com/pika>

如果没有良好的颜色对比度，文本、图标和其他图形元素就很难被发现，设计很快就会变得不可访问。但同样重要的是要注意在屏幕上如何使用颜色，因为你不能仅凭颜色来传达信息，操作或区分视觉元素。

### 高级感知对比度算法 (APCA)

[高级感知对比度算法 (APCA)](https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html) 是一种基于现代色彩感知研究来计算对比度的新方法。与 `AA` 和 `AAA` 准则相比，APCA 更与上下文相关。对比度的计算基于以下特征：

*   空间属性（字体粗细和文本大小）
*   文本颜色（文本和背景之间的感知亮度差异）
*   上下文（环境光、周围环境和文本的预期目的）

Chrome 包含一项[实验性功能，可将 AA 和 AAA 对比度准则替换为 APCA](https://developers.google.com/web/updates/2021/01/devtools#apca)。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/882ee53e95af413086549df585ccf23e~tplv-k3u1fbpfcp-zoom-1.image)

### Web 可访问性

“可访问性”这个词有时被缩写为 A11Y，意思是“无论用户是谁，无论其语言、位置、能力或硬件（设备）如何，都可以访问 Web 应用或页面”。

可访问性对于为所有人创造积极的用户体验至关重要，包括那些身体有障碍的人群。通过确保所有用户可以轻松地导航和访问他们所需的信息，我们在数字空间中促进包容和平等。这为具有特殊需求的人群带来了益处，并增强了整体用户体验，并提高品牌声誉。

一种实现这一目标的方法是遵循由万维网联盟（W3C）制定的 Web 内容可访问性指南（WCAG）。这些指南提供了创建可访问数字内容的特定建议，包括文本对比度的指南。

WCAG 推荐在文本和其背景之间保持至少 `4.5:1` 的最低对比度，以确保所有用户都可以轻松阅读文本。通过遵循这些指南，设计师可以创建易于访问和用户友好的网站。

因此，考虑文本与背景之间的对比度不仅可以增强视力受损人群和所有用户的用户体验，而且这种易用性，特别是针对视力受损的人群，是创建可访问的现代网页设计的基础。

## 如何使用 CSS 来控制颜色对比度

一般情况之下，Web 应用或页面颜色都是由 CSS 来决定的。因此，作为一名 Web 开发者，如果希望自己构建的 Web 应用或页面更具包容性，提高其可访问性，就有必要掌握如何使用 CSS 来控制颜色对比度。

### 先从老的方式聊起

时至今日，Web 开发者控制颜色对比度有多种方式。接下来，我们一起来看看都有这些方式。

在 Web 开发中，往往关注的是文本颜色（前景色）和背景色两者之间能够保持足够高的对比度，用来达到 WCAG 或 APCA 颜色可访问的标准。早期大多借助于JavaScript 脚本来实现。例如：

```JavaScript
function setForegroundColor(color) { 
    let sep = color.indexOf(",") > -1 ? "," : " "; 
    color = color.substr(4).split(")")[0].split(sep); 
    const sum = Math.round( (parseInt(color[0]) * 299 + parseInt(color[1]) * 587 + parseInt(color[2]) * 114) / 1000 ); 
    return sum > 128 ? "black" : "white"; 
} 
```

上面代码创建了一个名为 `setForegroundColor()` 的函数，并向该函数传入 `color`（一个 RGB 颜色）颜色，函数将颜色 `color` 的 `r`、`g`、`b` 通道的值乘以一些特殊的数字（`r * 299`、`g * 587` 和 `b * 144`），将它们的和除以 `1000`。得到的值大于 `128` 时，返回黑色，否则就会返回白色。

```CSS
((R x 299) + (G x 587) + (B x 114)) ÷ 1000 
```

注意，这个算法是从 RGB 值转换为 YIQ 值的公式中得到的。此亮度值给出颜色的感知亮度(Luma)。对于两个颜色的色差可以按下面的公式来计算：

```CSS
 (maximum (R1, R2) - minimum (R1, R2)) + (maximum (G1, G2) - minimum (G1, G2)) + (maximum (B1, B2) - minimum (B1, B2)) 
```

颜色亮度差的范围是 `125`，色差的范围是 `500`。这样一来，在改变元素背景色时，就可以自动匹配相应的前景色（主要是 `#000` 和 `#fff` 二选一）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5db81ee291464c40a7b1bd698361a3ae~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEqgQQL>

上面的案例使用了JavaScript 来动态改变背景色的 `R`、`G` 和 `B` 通道值。但我们在实际开发中一般是在 CSS 中通过 `background-color` 和 `color` 来赋予元素的色彩：

```CSS
.element { 
    color: rgb(255 255 255); 
    background-color: rgb(255 0 0); 
} 
```

早期的 CSS 不具有动态改变值的能力，比如重新创建颜色值，也无法像其他程序语言一样具有 `if ... else ...` 这样的逻辑条件能力。幸运的是，CSS 的自定义属性的出现让这件事情变得简单得多，而且结合 `calc()` 函数，可以让我们在 CSS 中做一些简单地计算。如此一来，上面的公式，我们就可以使用 `calc()` 来完成：

```CSS
calc((r * 299 + g * 587 + b * 144) / 1000)
```

这个时候把上面公式中的 `r`、`g` 和 `b` 几个参数换成 CSS 自定义属性（因为 CSS 中并没有 `r`，`g` 和 `b` 这样的属性和值）：

```CSS
:root { 
    --r: 255; 
    --g: 0; 
    --b: 0; 
} 
```

使用 `var()` 函数，将 `:root` 中声明的自定义属性替换公式中的 `r`、`g` 和 `b` ：

```CSS
calc((var(--r) * 299 + var(--g) * 587 + var(--b) * 144) / 1000)
```

为了每次在使用的时候能少写一点代码，我们可以将上面的公式赋值给一个自定义属性，比如 `--a11yColor`：

```CSS
:root { 
    --r: 255; 
    --g: 0; 
    --b: 0; 
    --a11yColor: calc((var(--r) * 299 + var(--g) * 587 + var(--b) * 144) / 1000); 
} 
```

你可能已经发现了，在 JavaScript 版本中，我们将计算出来的值和 `128` 做了一个比较，然后才输出正确的值。那么问题来了，在 CSS 中怎么实现类似的功能呢？我们借助 CSS 的自定义属性，可以实现类似于`true`（`1`）和 `false`（`0`）这样的简单逻辑：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88f5f828d6b94eb3a6fab446c1158df7~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，CSS 也具备一些简单的 `if ... else ...` 能力，我们把这种能力称为 **[条件 CSS](https://juejin.cn/book/7199571709102391328/section/7217644982898720779)**。

众所周知，RGB 颜色模式的值是 `0 ~ 255`（也可以是 `0% ~ 100%`）之间，为了不让事情变得复杂化，这里以 `0 ~ 255` 为例。在使用 `rgb()` 函数来设置一个颜色时，它的值只能是在 `0 ~ 255` 的区间内，虽然规范上是这样定义的，但实际上取值小于 `0` 和大于 `255` 也是有效值，比如 `rgb(-255 300 220)` 是一个有效值，只不过浏览器将该值渲染为 `rgb(0 255 220)`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccc9863e796e4c66a6565bce28b76d45~tplv-k3u1fbpfcp-zoom-1.image)

从浏览器的渲染结果中不难发现：小于 `0` 时会取其下限值 `0` ，大于 `255` 时会取其上限值 `255` 。接下来，我们要处理的是“总值是否大于 `128` ”。在 `calc()` 函数的计算中无法做比较，我们只需要从总和中减去 `128` 即可，就能得到一个正整数或负整数。然后，如果我们将它乘以一个大的负值，比如 `-1000`，将会得到一个非常大的正值或负值。最后把这些值传给 `rgb()` 函数。

```CSS
:root { 
    --r: 255; 
    --g: 0; 
    --b: 0; 
    --a11yColor: calc((((var(--r) * 299 + var(--g) * 587 + var(--b) * 114) / 1000) - 128) * -1000); 
} 

.element { 
    color: rgb(var(--a11yColor) var(--a11yColor) var(--a11yColor)); 
    background-color: rgb(var(--r) var(--g) var(--b)); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9970b25a10de49da8adfb16ae8cf842b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaqXjMK>

和 RGB 一样，同样可以将 HSL 和 CSS 自定义属性结合起来，使用 HSL 给背景色设置颜色值。这样做的好处是，允许我们使用一种非常简单的方法来确定颜色的亮度，并将其用于条件语句。

```CSS
:root { 
    --h: 220; 
    --s: 50; 
    --l: 80; 
} 

.element { 
    background-color: hsl(var(--h) calc(var(--s) * 1%) calc(var(--l) * 1%)); 
} 
```

有一点需要特别提出，CSS 中的 HSL 和 RGB 类似，如果 `h`、`l` 和 `s` 的值低于最低值（`0` 或 `0%` ）会以 `0`（或 `0%` )计算，高于最高值时，`h` 会以 `360` 计算（ `h` 的最高值是 `360` 度），`l` 和 `s` 都会以 `100%` 计算。换句话说，当 `h`、`s` 和 `l` 的值都为 `0` 时，颜色为黑色，当超过最高值时为白色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98beead4cf2842e693801e9586de41d7~tplv-k3u1fbpfcp-zoom-1.image)

因此，我们可以将颜色声明为 HSL 模式，从 `l`（亮度）中减去所需的阈值，然后乘以 `100%` 以迫使它超过其中一个限制（低于 `0` 或高于 `100%`）。因为我们需要负的结果以白色表示，正的结果以黑色表示，所以我们还需要将结果乘以 `-1`。

```CSS
:root { 
    --l: 80; 
    --threshold: 60; /* 颜色亮度l的阈值被认为是0 ~ 100之间的整数，但建议采用50~70之间 */ 
} 

.element { 
    /* 任何低于阈值的亮度值将导致颜色为白色，反之为黑色 */ 
    --switch: calc((var(--l) - var(--threshold))  * 100%); 
    color: hsl(0, 0%, var(--switch)); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/638e0d7210234f269f60802298b1491c~tplv-k3u1fbpfcp-zoom-1.image)

如果你对颜色稍微了解（或者多几次更改上面自定义属性的值)，不难发现，当一个元素的背景变得太亮时，它很容易在白色背景下不可见。为了在非常浅的颜色上提供更好的 UI，可以基于相同的背景颜色上设置可见的边框（颜色更深一些）。这样的场景非常适合按钮一类的 UI。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/528848b8663b416aa135b9bf27adc5db~tplv-k3u1fbpfcp-zoom-1.image)

为了实现这个效果，我们可以使用相同的技术，但是要将它应用到 HSL 颜色模式中的 `A`（透明）通道。这样，我们可以根据需要调整颜色，然后选择完全透明或完全不透明。

```CSS
:root { 
    --h: 85; 
    --s: 50; 
    --l: 60; 
    --border-threshold: 60; 
    --threshold: 60; 
} 

.element { 
    --border-l: calc(var(--l) * 0.7%); 
    --border-alpha: calc((var(--l) - var(--border-threshold)) * 10); 
    --switch: calc((var(--l) - var(--threshold)) * -100%); 
    color: hsl(0 0% var(--switch)); 
    border: 2vh solid hsl(var(--l) clac(var(--s) * 1%) var(--border-l) / var(--border-alpha)); 
    background-color: hsl(var(--h) calc(var(--s) * 1%) calc(var(--l) * 1%)); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d05fd5731fc4cddb59ed4a0cb2c7844~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgwGoa>

前面我们多次提到过感知亮度（Luma），在颜色空间中感知亮度和 HSL 颜色模式中的亮度 `L` 不一样。这样一来，我们可以基于 RGB 颜色模式，使用感知亮度来校正三原色，让颜色更能让人眼识别。到目前为止，计算感知亮度的公式有两种。第一种就是前面提到的（也是 [W3C 规范](https://www.w3.org/TR/AERT/#color-contrast)中提供的）：

```CSS
L = (r x 0.299 + g x 0.587 + b x 0.144) ÷ 255 
```

如果用 CSS 的 `calc()` 函数来描述的话，像下面这样：

```CSS
L = calc((var(--r) * 0.299 + var(--g) * 0.587 + var(--b) * 0.114) / 255) 
```

另一个公式是由 [ITU](https://en.wikipedia.org/wiki/Rec._709) 提供的：

```CSS
L = (r x 0.2126 + g x 0.7152 + b x 0.0722) ÷ 255
```

同样的，CSS 表述的话如下：

```CSS
L = calc((var(--r) * 0.2126 + var(--g) * 0.7152 + var(--b) * 0.0722) / 255) 
```

如果在颜色计算中引入感知亮度 Luma ，我们就不能再基于 HSL 来描述颜色了，因为 Luma 的计算离不开 RGB 颜色各通道的值。主要是在 CSS 中，我们很难将 HSL 颜色转换成 RGB。

下面我们简单看看引入 Luma 的颜色对比度计算怎么使用。请直接看代码：

```CSS
:root { 
    /* 使用rgb模式来描述颜色，eg. rgb(255 0 0) */ 
    --r: 255; 
    --g: 0; 
    --b: 0; 
    
    /* 颜色亮度l的阈值(范围0~1)，建议设置在0.5~0.5间 */ 
    --threshold: 0.55; 
    
    /*深颜色边框的阈值(范围0~1)，建议设置在0.8+ */ 
    --border-threshold: 0.8; 
} 

.element { 
    background-color: rgb(var(--r) var(--g) var(--b)); 
    
    /** 使用sRGB Luma方法计算感知亮度Luma: 
     * L = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255 
     * L = calc((var(--r) * 0.2126 + var(--g) * 0.7152 + var(--b) * 0.0722) / 255) 
     */ 
     --luma: calc((var(--r)  0.2126 + var(--g) * 0.7152 + var(--b) * 0.0722) / 255); 
     color: hsl(0 0% calc((var(--luma) - var(--threshold)) * -10000000%)); 
     
     /* 如果亮度高于边框阈值，则应用较暗的边框 */ 
     --border-alpha: calc((var(--luma) - var(--border-threshold)) * 100); 
     border: 3vmin solid rgb(calc(var(--r) - 50) calc(var(--g) - 50) calc(var(--b) - 50) / var(--border-alpha)); 
 } 
```

改变 `--r`、`--g` 和 `--b` 就可以得到不一样的结果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7563a412ecbc44f2a51220a28e94b100~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNaKxvR>

随着技术不断革新，CSS 的特性越来越强大，很多特性都用于优化用户体验。比如[颜色模块 Level6](https://drafts.csswg.org/css-color-6/)（CSS Color Module Level 6）的 `color-contrast() 函数`和 [CSS颜色调整模块 Level1](https://www.w3.org/TR/css-color-adjust-1)（CSS Color Adjustment Module Level 1）的 `color-adjust 属性`能更好地帮助 Web 开发者构建更具包容性的 Web 应用或页面。

### CSS color-contrast() 函数

我们先来看 `color-contrast()` 函数。

`color-contrast()` 函数是一项实验性功能，最早出现于颜色模块 Level 5 中，但后面 W3C 的 CSS 工作组将该特性纳入到了[颜色模块 Level6 中](https://drafts.csswg.org/css-color-6/)。到目前为止（2023年06月02日），仅得到了 [Safari （TP） 浏览器](https://developer.apple.com/safari/technology-preview)的支持，而且还需要在“开发和实验功能（Experimental Features）”菜单中打开该功能：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f6f30196d614323a67ed2e14b4602a3~tplv-k3u1fbpfcp-zoom-1.image)

`color0-contrast()` 函数的主要功能**是在与基准颜色比较时从列表中选择最大对比度的颜色**。换句话说，**其主要目的是从一个颜色列表中选择与基色相比的理想对比色**。

这意味着开发人员可以使用 `color-contrast()` 函数来确保设计中使用的前景色与背景色具有足够的对比度比率，从而提高视力有障碍或色觉缺陷的人的可访问性。利用这个功能，Web 开发人员可以向构建更具包容性和可访问性的设计迈近一步。

`color-contrast()` 函数接受两个参数，其中第一个参数被称为“**基准颜色**”，第二个参数称为“**颜色列表**”。这些参数可以接受任何一种组合，且所有组合都是浏览器支持的 CSS 颜色格式，但要小心不透明度。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bb39e573889416cbdd21b0883067f80~tplv-k3u1fbpfcp-zoom-1.image)

其实，`color-contrast()` 函数还有一个可选的第三个参数，但我们稍后再来看。

我们通过动态定义基于背景的文本颜色来演示这个新特性。因此，我们也从设置容器的背景颜色和文本颜色开始。

```CSS
.container {
    --primary-bg: #1e1e1e;
    background-color: var(--primary-bg);
    color: color-contrast(var(--primary-bg) vs #fff, #000);
}
```

我们从定义自定义属性 `--primary-bg` 开始，颜色是深灰色调 `#1e1e1e` 。然后将该属性用作 `color-contrast()`函数中的基色，并与颜色列表中的每个项目进行比较，以找到最高对比值。

| **基准颜色**  | **颜色列表** | **颜色对比度** |
| --------- | -------- | --------- |
| `#1e1e1e` | `#fff`   | `16.67`   |
| `#1e1e1e` | `#000`   | `1.26`    |

因此，容器 `.container` 的文本颜色将会取颜色列表中的 `#fff` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3e57a59336b48e68d7f2cd959ca966c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvYVzWw> (请使用 Safari TP 浏览器查看)

但这还可以进一步扩展。

我们可以通过将一个 `color-contrast()` 函数的结果用作另一个的基色来有效地链接它们。这让我们通过相对于文本定义 `::selection` 颜色来扩展上面的示例。

```CSS
.container {
    --primary-bg: #1e1e1e;
    --text-color: color-contrast(var(--primary-bg) vs #fff, #000);
    background-color: var(--primary-bg);
    color: var(--text-color);
}

.container::selection {
    background-color: color-contrast(var(--text-color) vs #FFF, #000);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/844bb5333850493b97eb8f12b1636c83~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOegMLr> （请使用 Safari TP 浏览器查看）

`color-contrast()` 函数并不局限于仅比较 HEX 代码。实际上，它可以同时比较多种颜色类型。前面的示例可以修改为使用不同的颜色类型，同时返回相同的结果。

```CSS
.container {
    --primary-bg: rgb(34 34 34);
    --text-color: color-contrast(var(--primary-bg) vs hsl(0 0% 100%), black);

    background-color: var(--primary-bg);
    color: var(--text-color);
}

.container::selection {
    background-color: color-contrast(var(--text-color) vs hsl(0 0% 100%), black);
}
```

我们不仅可以使用 `color-contrast()` 函数设置容器元素 `.container` 的文本颜色，还可以设置其他元素的文本颜色，比如链接元素 `<a>` 的文本颜色。例如：

```CSS
:root {
    --hue: 20;
    --saturation: 60;
    --lightness: 80;
    --bg: hsl(calc(var(--hue) * 1deg) calc(var(--saturation) * 1%) calc(var(--lightness) * 1%));
}

.container {
    background-color: var(--bg);
    color: color-contrast(var(--bg) vs #ffffff, #000000);
}
 .container a {
    color: color-contrast(var(--bg) vs red, lightgreen, blue);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c9fa92b902747a9a528e5c5717595cd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dygxpwr> （请使用 Safari TP 浏览器查看）

使用同样的方式，使得我们给元素不同状态设置符合对比度的颜色会变得容易得多。比如给按钮 `<button>` 元素的不同状态设置符合颜色对比度标准的颜色。

```CSS
:root {
    --body-bg: #131e25;
}

button {
    --button-bg: #ffba76;
    --button-color: color-contrast(var(--button-bg) vs #fff, #000);
    background: var(--button-bg);
    color: var(--button-color);
}

button:hover {
    --button-bg: #b15900;
}

button:focus {
    --color-list: #ffba76, #09faec, #bbb, #555;
    box-shadow: 0 0 1px 3px color-contrast(var(--body-bg) vs var(--color-list));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3bf7ebb645d40418a6031292a0571c9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOegVra> （请使用 Safari TP 浏览器查看）

刚才介绍 `color-contrast()` 函数时提到过，它有第三个参数，而且该参数是一个可选参数。实际上，这个可选参数是 `color-contrast()` 函数展示其潜力的地方。我们可以通过 `color-contrast()` 函数来指定目标对比度比率。该参数接受像 `AA` 、`AA-large` 、`AAA` 和 `AAA-large` 等关键词或者数字。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb9091b954d94cc685012164b8ef51cf~tplv-k3u1fbpfcp-zoom-1.image)

定义了目标对比度时，`color-contrast()` 将返回满足目标对比度的颜色列表中的第一个值。然而，当颜色列表中没有任何一个值满足目标对比度时，就是它发挥妙用的时候了。

```CSS
h1 {
    color: color-contrast(#000 vs #111, #222 to AA);
}
```

上面代码中的基色是个黑色 `#000` ，并且基色 `#000` 会与 `#111` 和 `#222` 两个颜色做对比。

| **基准颜色** | **颜色列表** | **颜色对比度** |
| -------- | -------- | --------- |
| `#000`   | `#111`   | `1.11`    |
| `#000`   | `#222`   | `1.32`    |

不难发现，基色 `#000` 与颜色列表中的颜色（`#111` 和 `#222`）对比度没有任何一组是能满足 `AA` （`4.5`）目标对比度。那么，这个时候又会发生什么呢？

颜色列表中的 `#111` 和 `#222` 相对于基准颜色 `#000` ，它们的对比度最大的颜色对比率也才 `1.32` ，但它远远不具可访问性。此时， `color-contrast()` 函数第三个参数的就会发挥其作用，即如果颜色列表中没有一个值满足目标对比度，则 CSS 将用一个满足目标对比度的颜色填充空缺处，比如黑色或白色。

换句话说，当 `color-contrast()` 函数中颜色列表与基准颜色的颜色对比度达不到指定的对比率要求时，它会另取一个满足目标对比度的颜色。就拿上面代码为例，当颜色列表中没有一个值满足 `AA` (`4.5`) 目标对比度时，函数会选择满足目标对比度的值，这种情况下选择白色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f4c3e77e6d845679201adf3719d144b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBJeqvO>  （请使用 Safari TP 浏览器查看）

这就是 `color-contrast()` 的潜力最大的地方， **它能够真正增强设计系统的可访问性，即使****设计系统的****可访问性达到特定或较高的水平**。

需要知道的是，`color-contrast()` 函数的第三个参数的值除了是  `AA` 、`AA-large` 、`AAA` 和 `AAA-large` 等关键词之外，还可以接受一个 `0 ~ 21` 之间的数值，比如 `4.5`。例如：

```CSS
body {
    --contrast-target: AA;
}

.container {
    --color-set: 
        #001219, 
        #005f73, 
        #0a9396, 
        #94d2bd, 
        #e9d8a6, 
        #ee9b00, 
        #ca6702,
        #bb3e03, 
        #ae2012, 
        #9b2226;
      --base: color-contrast(var(--body-base) vs var(--color-set) to var(--contrast-target));
      background-color: var(--base);
}
.container p {
    color: color-contrast(var(--base) vs var(--color-set), #fff to AA-Large);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49c03291c07e494aa35c2e18b2c74c7b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYVooyz> （请使用 Safari TP 浏览器查看）

通过这几个示例，我想你已经对 CSS 的 `color-contrast()` 函数有了一定的认识。如果你在设计系统的上下文中使用该函数的话，这将允许系统非常精细的强制执行一定水平的颜色可访问性。也就是说，通过使用 `color-contrast()` 函数设置特定（指定）的颜色对比度级别，设计系统可以在多个页面或应用程序中强制实施一致性和可访问性。总体而言，这对于创建对视觉障碍或其他其他残障人士具有包容性和易于使用的用户界面非常重要。

在 CSS 中，你可以通过自定义属性与 `color-contrast()` 函数结合起来使用，比如在 `:root{}` 中定义目标对比度的值，使目标对比度可以是动态的且全局的。

```CSS
:root {
    --contrast-target: AA;
}

.element {
    color: color-contrast(#09a vs #fff, #aefeaf, #333 to var(--contrast-target));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7294ce23c3394467b9225f8265fc3a2a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWPNNoj>  （请使用 Safari TP 浏览器查看）

这样做，虽然在产品方面有了真正的控制感，但在实现时也需要付出代价，即**代码和结果之间存在逻辑上的不一致**。例如，上面示例中的代码并没有表明黑色是结果。当然，产品方面的控制可以转化为现实方面的不确定性。例如，一个人使用设计系统并将特定颜色传递到他们的主题中，为什么会产生黑色和白色的结果呢？这会使结果产生不确定性，也会使开发者感到困惑。

第一个问题可以通过更深入地理解 `color-contrast()` 功能来解决，第二个问题可以通过明确、清晰的文档解决。然而，这两种情况都会给 Web 开发者增加额外的负担，这是不理想的。

#### 颜色和视觉对比度是不同的东西

当使用 `color-contrast()` 根据背景确定文本颜色时，函数比较的确实是颜色。`color-contrast()` 并不考虑可能影响视觉对比度的其他样式，例如字体大小、粗细和不透明度。

这意味着可能会有一种颜色配对在技术上满足特定对比度阈值，但由于其太小，重量太轻或其太透明而导致文本不可访问。

#### 最高对比度并不一定意味着可访问对比度

尽管 `color-contrast()` 可以在颜色和主题方面提供一定的控制，但仍存在限制。当函数将基本颜色与列表进行比较并且未指定目标对比度时，它将选择具有最高对比度的值。仅仅因为两个颜色提供了最大的对比度比率，并不意味着它是可访问的。

```CSS
:root {
    --contrast-target: AA;
}

.container {
    background-color: #000;
    color:  color-contrast(#000 vs #111, #222);
}

.container a {
    color: color-contrast(#000 vs #111, #222, #333 to var(--contrast-target));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eca6195dd9aa4afea488a908d0ab1cdb~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOQQaP> （请使用 Safari TP 浏览器查看）

在这个例子中，`.container` 容器的黑色背景是 `#000` ，但文本颜色是由 `color-contrast()` 函数指定的，它将会使用 `#111` 和 `#222` 与基准颜色 `#000` 相比较，选择较大对比度的颜色。虽然 `#222` 将被选择为具有“最大”的对比度比率，但与黑色搭配使用并不能达到可访问性的要求。不同的是，在链接元素 `<a>` 上使用 `color-contrast()` 函数，并且明确指定了颜色对比度，该函数返回是一个新的颜色 `#fff` ，一个不在颜色列表中的颜色，会给使用者带来理解上的成本。

#### 不支持渐变

需要注意的是，如果容器的背景是一个渐变色，那么文本即使使用 `color-contrast()` 函数，也无法达到预期的效果。比如下面这个示例：

```CSS
:root {
    --color-start: black;
    --color-end: white;
    --contrast-target: AA;
}

.container {
    background-image: linear-gradient(to right, var(--color-start), var(--color-end));
    color: color-contrast(#000 vs #fff, #111, #09f to var(--contrast-target));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/440e2f9091ed44e3a530ee9f366348b3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBJeepY> （请使用 Safari TP 浏览器查看）

正如你所看到的，`color-contrast()` 函数返回的是 `#fff` 颜色，使得距离容器右侧的文本的可访问性达不到 `AA` 级别。其中原委很难清楚，但我的理解是有两种可能。其一，如果一个渐变从黑色到白色，基色会是什么呢？是否需要相对于内容的位置？就像函数无法解释 UI 一样。其二，渐变原本输出的数据类型是 `<image>` ，相当于一张图片，从这个角度来看，它已脱离 `color-contrast()` 函数的特性。

#### 优雅降级

`color-contrast()` 函数是一个较新的 CSS 颜色函数，目前还是一个实验性属性，支持它的浏览器相对较少。因此，在使用 `color-contrast()` 函数时，最好结合 CSS 的 `@supports` 属性。

```CSS
@supports (color: color-contrast(#000 vs #fff, #eee)) {
    :root {
        --article-bg: rgb(34, 34, 34);
        --article-color: color-contrast(var(--article-bg) vs #fff, #000);
    }
}
```

这样可以让支持 `color-contrast()` 函数的浏览器有一个更好的可访问性。但该函数还是一个很新的特性，使用方式也说不定还会有所调整，因此我建议你现在先不要在项目中使用它。

### prefers-contrast 媒体查询

除了在屏幕上检查颜色对比度和颜色的使用外，你应该考虑应用越来越受欢迎和支持的媒体查询，为用户提供更多控制屏幕所显示内容的机会。

例如，使用 `prefers-contrast` 构建高对比度主题，这对患有色盲和对比敏感的人有更好的帮助。`prefers-contrast` 媒体查询会检查用户的操作系统设置，以查看高对比度是否打开或关闭。通过改变你的对比度偏好设置，并导航到支持媒体查询的浏览器（[Mac](https://support.apple.com/lv-lv/guide/mac-help/unac089/mac) 和 [Windows](https://support.microsoft.com/windows/change-color-contrast-in-windows-fedc744c-90ac-69df-aed5-c8a90125e696) 对比模式设置）中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c840712c34e4fb3ad2da4cb1c9b3397~tplv-k3u1fbpfcp-zoom-1.image)

例如：

```CSS
body {
    background: #ffffff;
}

.without {
    color: #10a1a6;
}

.without [data-word=without] .char:before,
.without [data-word=without] .char:after {
    color: #d601f4;
}

@media (prefers-contrast: more) {
    body {
        background: #333333;
    }

    .without {
        color: #fffd00;
    }

    .without [data-word=without] .char:before,
    .without [data-word=without] .char:after {
        color: #16ff00;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7910509727c43d391964d1b1d2e79bd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYPqqwe>

注意，`perfers-contrast 是媒体查询中的一个特性`，它出自[媒体查询 Level5 ](https://www.w3.org/TR/mediaqueries-5)（Media Queries Level 5），根据用户偏好设置来调整颜色对比度，有关于这方面更详细的内容，将在介绍媒体查询特性的课程中进行介绍。

## 接下来要做什么取决于你

你可能已经发现了，色彩的丰富度也造就了色彩的复杂度。

> 颜色的使用远比我们想象的要复杂，并不是简单的设置颜色值而已。

在 Web 可访问性方面更是如此，甚至更为复杂。但我们并不能因为其复杂就停止进步，更应该从此刻开始，让你的产品在颜色方面达到 WCAG 标准。将 WCAG 标准作为设计和开发需求的一部分。你甚至可以基于你的专业技能，为自己的产品创建最具可访问性的颜色品牌体系，这样你只要使用即可。如果你的专业知识还无法达到这个程度，你也可以考虑使用一些在线的工具，帮助你构建这个体系。

但话又说回来，即使你有一套完整的品牌颜色体系，也需要检测 Web 中颜色对比度，因为总有时候你使用的颜色并不能达到 WCAG 相关的标准。甚至，有些场景即使达到了标准，也未必是最佳体验。

最后我想说的是，我们不要停留在想的阶段，应该立刻去实践。只要动手去做了，你就有所获得。

## 总结

颜色是非常复杂的，它以无数种方式被传达和感知。虽然颜色对比度作为一个简单的辅助来确定对比度，但同样至关重要。如果你想让应用或产品达到无障碍和包容性的设计，那不仅是只考虑颜色对比度的问题，还需要在设计中传达所有颜色的复杂性，满足不同人的视觉需求。

正如我们这节课所介绍的 `color-contrast()` 函数，它会比较基础颜色与颜色列表，然后选择最高对比值。此外，它可以将这些值与目标对比度比较，然后选择第一个满足该阈值的颜色或使用动态颜色。与渐进增强相结合，我们就有了一个可以极大地提高 Web 无障碍性的功能。
