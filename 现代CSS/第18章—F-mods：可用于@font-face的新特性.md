在现代 Web 设计中，Web 设计师时常会使用非系统字体设置 Web 页面的字体，尤其是一些标题部分，会采用一些艺术字体来实现。Web 开发者要么采用图片替代文本的方式实现，要么采用 `@font-face` 规则引用非系统字体实现。如果使用 `@font-face` 实现将影响 Web 的性能，因此 CSS 工作小组为 `@font-face` 引入了一些新的 CSS 特性，它们能更好地优化外部字体，提高页面的性能，给到更好的用户体验。这些新的 CSS 特性有一个统一的称谓，那就是 **F-mods**。

这节课，我们就介绍一下 F-mods 是什么，它包括哪些 CSS 新特性，这些新特性又可以用来做些什么。

## @font-face 给 Web 排版带来的变化与不足

Web 是一种视觉媒介，可以通过**设计**和**排版**来传达思想。多年来，设计师们急于将自定义的排版带到 Web 上，并突破“[Web 安全字体](https://en.wikipedia.org/wiki/Web_typography#Web-safe_fonts)”的限制。在 Web 三十多年的发展过程中，先后使用过 “图片替换文本”（带有艺术字体，至今也还在使用），还有 [sIFR](https://www.sifrgenerator.com/)（Scalable Inman Flash Replacement，使用 Flash 等价物替换屏幕上的文本元素，今天基本废弃不使用），接下来是 [cufón](https://cufon.shoqolate.com/generate/)（2017年停止服务）。这些技术都存在一定的缺陷，甚至已不是现代 Web 开发的主流技术，哪怕现在还在使用的“图片替换文本”。

比如下图就是“图片替换文本”技术在 Web 页面中的运用场景：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/427fc773766e4c8ba56cb016ee50a17c~tplv-k3u1fbpfcp-zoom-1.image)

在现代 Web 开发中，我们应该通过 CSS 的 `@font-face` 技术来使用自定义的字体（即 Web Fonts），该技术早在 2008 年左右就出现了（最早出现在 1998 年 CSS2 规范中），它可以让浏览器加载本地字体或放在 CDN 的字体。

```CSS
@font-face { 
    font-family: 'Alibaba Sans 102 v1 TaoBao'; 
    src: url('AlibabaSans102v1TaoBao-Bold.eot'); 
    src: url('AlibabaSans102v1TaoBao-Bold.eot?#iefix') format('embedded-opentype'), 
        url('AlibabaSans102v1TaoBao-Bold.woff2') format('woff2'), 
        url('AlibabaSans102v1TaoBao-Bold.woff') format('woff'), 
        url('AlibabaSans102v1TaoBao-Bold.svg#AlibabaSans102v1TaoBao-Bold') format('svg'); 
    font-weight: bold; 
    font-style: normal; 
    font-display: swap; 
}
```

CSS 的 `@font-face` 对于 Web 来说是一个很好的补充，它解决了上述老技术（“图片替代文本”、sIFR 和 cufón）中与可访问性和可维护性有关的许多问题。但是，`@font-face` 也带来了它自己一系列挑战。主要是不同的字体格式，以及它们的加载方式，更为麻烦的是它对 Web 性能和用户体验的影响。

如果 Web Fonts 未加载，浏览器通常会延迟任何使用 Web Fonts 的文本，比如下图中的描述价格的文本：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1370a917fdb84cc5af51f82e444b750f~tplv-k3u1fbpfcp-zoom-1.image)

这在许多情况下，将延迟 FCP（First Contenttful Paint），在某些情况下也会延迟 LCP（Largest Contentful Paint）。甚至更为严重的是导致布局偏移（Layout Shifts），触发页面的重排和重绘（Web Fonts 和它的备用字体或系统字体在页面上占用不同的空间），也会触发 CLS（Cumulative Layout Shift）。更令人头痛的是，Web Fonts 造成布局偏移的原因是 FOUT（Flashes Of Unstyled Text），而且 FOUT 还是业内公认难以解决的。

简单地说，Web Fonts 对视觉效果有显著帮助，但对 Web 性能和用户体验有严重影响。如果在实际业务中能避免使用 Web Fonts 应该尽可能避免，实在不能避免，就要在使用 Web Fonts 时做一些策略上的选择。

## FOUT、FOIT 和 FOFT

聊 Web Fonts 就离不开 FOUT 、FOIT 和 FOFT 话题，特别是 FOUT 和 FOIT 。先从字面意思开始：

-   FOUT 是 Flash Of Unstyled Text 首字母缩写，中文意思是**无样式文本闪现**；
-   FOIT 是 Flash Of Invisibale Text 首字母缩写，中文意思是**不可见文本闪现**；
-   FOFT 是 Flash Of Faux Text 首字母缩写，中文意思是**伪文本闪现**。

简单地说，FOUT、FOIT 和 FOFT 是浏览器渲染文本的三种不同表现，特别是 Web Fonts 被引入到 Web 中时，浏览器对 FOUT 和 FOIT 的优化就没有停止过。

如果你在 Web 中使用 Web Fonts，那么时常会看到下图这样的两种现象：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08477b4bbf074ad7bb2985fd79a10ef2~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，FOIT（不可见文本闪烁）和 FOUT（无样式文本闪烁）其实就是**描述了浏览器处理页面加载和字体加载之间时间的两种主要方式**。

事实上，Web Font 的文件相对较大（特别是中文字体），而页面的其他部分很可能在字体下载完之前就下载完了。因此，我们需要决定在等待字体时如何处理页面上的文字。我们基本上有两种选择：

-   可以隐藏文本，直到字体准备好止（FOIT）；
-   可以先使用备用字体显示，然后字体加载完成将其与 Web Font 交换（FOUT）。

虽然采用不同的字体加载策略（FOUT 或 FOIT）给用户带来不同的体验，但对于 Web 页面的性能方面来说，它们都致命的。不管是 FOUT 还是 FOIT 或 FOFT，都会影响 CWV 的 FCP、LCP 和 CLS分数，也会触发页面的重排和重绘。下图展示了 FOUT 和 FOIT 触发的重排（Reflows）和重绘（Repaints）的次数：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb3f5e3e723f484cac205ac601069954~tplv-k3u1fbpfcp-zoom-1.image)

> 图片来源于：<https://www.zachleat.com/foitfout/#8000,8000,9000,8000>

Web Fonts 加载除了会造成页面的重排和重绘之外，还会产生布局的偏移（Layout Shifts）。我们把页面内容在没有用户交互（互动）的情况下发生移动这种现象称之为**意外的布局偏移**（Layout Shifts），这种意外的布局偏移对用户体验极其不利。当浏览器加载 Web Fonts 时，容器元素（比如 `div` 或 `p`）的大小发生变化时就导致了布局偏移。这主要是因为 Web Fonts 和系统字体高度、宽度或其他字体度量参数不同，造成容器内容文本宽度和高度不一样，从而改变容器的大小。在页面布局时，浏览器将使用备用字体的尺寸和属性来决定容器元素的大小，即使你已经使用了 `font-display: block` 声明了一种 Web Font 来阻止系统字体。

简而言之，Web Fonts 和系统字体有着不同的度量参数，在两种字体交换（系统字体切换到 Web Fonts）时造成文本内容区域大小不同。用下图来描述，会有一个更清晰的认识：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c82b3029a6964154a23d3e4a2a20e099~tplv-k3u1fbpfcp-zoom-1.image)

不过，CSS 的一些新特性，即 F-mods（字体度量覆盖描述符）来覆盖字体的一些度量参数，让系统字体字体（备用字体）和 Web Fonts 更接近，尽可能地减少布局偏移，从而可以提高页面的性能。

## 字体度量（Font Metrics）

在了解如何使用 F-mods 减少布局偏移之前，我们有必要花一点时间来简单了解字体度量（Font Metrics）。正如 @Weston Thayer 在其博客《[Intro to Font Metrics](https://westonthayer.com/writing/intro-to-font-metrics/)》开头提到：“**字体文件包含大量关于字体的信息**”。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d87338703cb4944aa8484a02500a8d8~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，字体是由一系列符号（通常称为字母或字符）组成的数字表示形式。计算机读取字体文件，以便将屏幕上的字形渲染为像素。为了描述如何将所有单独符号组合到单词、句子和段落中，字体设计人员用指标对字体进行编码。字体参数可以帮助计算机确定行与行之间的默认间距，上标（sup）和下标（sub）的高低，以及如何将两个不同大小的文本对齐。

通常情况下，这些参数不会向用户公开，但我们可以使用一些工具来获取这些参数，比如 [FontForge](https://fontforge.org/en-US/) 和 [Font Inspector](https://opentype.js.org/font-inspector.html)。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e16c0557b3ab42ae8a61256dbddd84cc~tplv-k3u1fbpfcp-zoom-1.image)

另外，字体在 Web 上的使用是个复杂的体系，除了涉及一些排版知识之外，还涉及一些字体知识，它们已经超出这节课的范畴，这里就不做过多阐述了。

## F-mods 简介

F-mods 是 **Font Metrics Override Descriptors**（字体度量覆盖描述符）的简称。它对应着 [CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4) 规范中 `@font-face` 部分的第十一小节，即 **[默认的字体度量覆盖](https://www.w3.org/TR/css-fonts-4/#font-metrics-override-desc)**。简单地说，就是新增的四个 CSS 属性，对应着字体度量的四个描述符。

-   `ascent-override`：对应字体度量中的 **ascender** 参数，用来覆盖分配给字体上升部分的尺寸，即[上升指示](https://www.w3.org/TR/css-inline-3/#ascent-metric)（Ascent Metric）；该描述符定义了字体基线（Baseline）以上的高度。
-   `descent-override`：对应字体度量中的 **descender** 参数，用来覆盖分配给字体下降部分的尺寸，即[下降指标](https://www.w3.org/TR/css-inline-3/#descent-metric)（Descent Metric）；该描述符定义了字体基线（Baseline）以下的高度。
-   `line-gap-override`：对应字体度量中的 **lineGag** 参数，用来覆盖行间距，即[行距指标](https://www.w3.org/TR/css-inline-3/#line-gap-metric)（Line Gap Metric）；该描述是字体推荐的行距或外部引线（External Leading）。
-   `advance-override`：为每个字符设置一个额外的提前量，以帮助匹配行宽并防止单词溢出。

## F-mods 作用

这四个描述符的组合可以告诉浏览器下载 Web Fonts 之前字符占用多少空间，可以用来覆盖回退字体（系统字体）字符所占用的空间。

简单地说：**这四个描述符可以让你的系统字体更接近 Web Fonts！** 其中 `ascent-override`、`descent-override` 和 `line-gap-override` 描述符使我们**能够完全消除垂直布局的偏移**，因为它们都会影响行高。

当计算行高时，字体的上升（Ascent）、下降（Descent）和行距（Line Gap）三指标会被设置为所用字体大小（`font-size`）的给定百分比，即解析为给定百分比（也就是 `ascent-override`、`descent-override` 和 `line-gap-override` 的值，它们取值是个百分比值，除默认值 `normal` 之外）乘以字体大小（`font-size`）。这也让我们可以使用它们来覆盖行框高度（Line Box Height）和基线位置（Baseline Position）。

```
行框高度（Line Box Height） = 上升（Ascent） + 下降（Descent） + 行距（Line Gap） 
基线位置（Baseline Position） = 行框顶部（Line Box Top） + 行距（Line Gap） / 2 + 上升（Ascent）
```

注意，如上这几个专业术语，可以通过下图找到它们在一个字体中对应的位置：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/932fe251f08745bfa2d6603be2d47965~tplv-k3u1fbpfcp-zoom-1.image)

假设，我们分别给 `ascent-override` 设置值为 `80%`，`descent-override` 设置值为 `20%`，`line-gap-override` 设置值为 `0%`，把这些参数套用到上面公式的计算公式中，就可以得出每个行框的高度为 `1em`（假设使用的 `font-size` 为 `1em`），而基线位于行框顶部以下 `0.8em` 的位置。

> 注意，开发者可以在元素上设置 `line-height` 为非 `normal` 的值。然而，`line-height: normal` 是一个重要的用例，我们希望在这种情况之下也能消除布局偏移。

而 `advance-override` 描述符允许我们减少水平布局的偏移，以及由不同的换行引起的垂直布局的偏移。这个描述为使用该字体的每个字符设置了一个额外的提前量。额外的提前量等于描述符的值乘以使用的字体大小。该描述符是在 CSS 的 `letter-spacing` 属性之外应用的。比如，如果我们在一个元素上设置了 `font-size: 20px; letter-spacing: -1px`，并且设置了 `adavance-override: 0.1`，那么最终会得到 `20px * 0.1 - 1px = 1px` 的字符间的额外间距。

## 如何获取 F-Mods 所需参数

字体对于很多 Web 开发者而言就是个谜，大多数情况只知道字体的名称，比如 `AlibabaSans102`。字体对应的参数对于我们来说并不是开放的，而我们要使用 `ascent-override`、`descent-override`、`line-gap-override` 和 `advance-override` ，就需要字体对应的上升（Ascent）、下降（Descent）和行距（Line Gap）这几个度量参数的值。

你可能会问，这些参数要怎么获取呢？除了找字体设计师提供这些度量参数之外，Web 开发者还有另一途径，那就是使用一些在线工具，比如前面提到的 [FontForge](https://fontforge.org/en-US/) 和 [Font Inspector ](https://opentype.js.org/font-inspector.html)工具。它们可以帮助我们快速获取需要的参数值。这里拿 Font Inspector 来举例，因为它相对来说更简单些。只需要在控制面板上传你将使用的 Web Fonts 文件，建议上传字体的原始文件，即 `.ttf` 或 `.eot` 格式。这个时候，你可以在 `head` 和 `hhea` 中折叠面板中找到这些所需的参数值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58513b3e2451425d9e4bb9cb5a937eab~tplv-k3u1fbpfcp-zoom-1.image)

我们可以在 Font Inspector 的 `hhead` 中找到四个关键值，它和这四个描述符有一定的映射关系。

-   ascender：对应 `ascent-override` 。
-   descender：对应 `descent-override` 。
-   lineGap：对应 `line-gap-override` 。
-   advanceWidthMax：对应 `advance-override` 。

除了这四个参数之外，每个字体还有一个 `unitsPerEm` 参数，其字面意思是字体的每一个 `Em` 的单位值。一般情况之下，`unitsPerEm` 的值为 `1000`（在 Font Inspector 检测工具中的 head 折叠面板中可获取）。

从规范中，我们可以获知 `ascent-override`、`descent-override`、`line-gap-override` 描述符的值是百分比值（`%`），而从[相关提案](https://docs.google.com/document/d/1PW-5ML5hOZw7GczOargelPo6_8Zkuk2DXtgfOtJ59Eo/edit#)可以获知 `advance-override` 是一个小数值（能不能用百分比描述，待规范发布）。例如，如果 Web Fonts 的 `unitsPerEm=1000`，`ascender=1041`，那么对应的 `ascent-override` 描述符值为 `104.1%`（即 `1041 / 1000 * 100% = 104.1%`）。

如果已获得了这些参数，我们可以借助 CSS 自定义属性，让它们在实际使用的时候变得更灵活些：

```CSS
@font-face { 
    font-family: 'Arial';
    src: local('Arial'); 
    
    --unitsPerEm: 1000; 
    --lineGap: 10; 
    --descender: -237; 
    --ascender: 1041; 
    --advanceWidthMax: 815; 
    
    ascent-override: calc(var(--ascender) / var(--unitsPerEm) * 100%); 
    descent-override: calc(var(--descender) / var(--unitsPerEm) * 100%); 
    line-gap-override: calc(var(--lineGap) / var(--unitsPerEm) * 100%); 
    advance-override: calc(var(--advanceWidthMax) / var(--unitsPerEm)); 
} 
```

如果你不习惯 Font Inspector 工具，你还可以使用一款与其相似的工具 [FontDrop](https://fontdrop.info/)，你只需要把要使用的 Web Fonts 拖到控制面板中，在 “Data”一栏中可以获得该字体的所有信息，相应的在 `hhea` 一栏中能找到 “ascender”、“descender”、“lineGap”和 “advanceWidthMax”的值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ff56d53553142c8bd28aa02f9abd1eb~tplv-k3u1fbpfcp-zoom-1.image)

## F-mods 的使用

有了这些字体度量参数之后，就能知道 F-mods 中每个属性对应的值是多少了，使用 F-mods 就容易得多了。假设你决定在使用 Web Fonts 时采用 F-mods 来减少字体带来的布局偏移，那只需要掌握这个基本诀窍即可：在 `@font-face` 声明中使用 `src: local()` 定义备用字体（系统字体）。这样就可以覆盖备用字体的显示，以匹配 Web Fonts。

```CSS
/* Web Fonts */ 
@font-face { 
    font-family: AlibabaSans102; 
    src: url("https://example.com/AlibabaSans102.woff2"); 
    font-display: swap; 
    font-weight: 700; 
    font-style: normal; 
} 
​
/* 指定备用字体，local() 函数中指定备用的系统字体 */ 
@font-face { 
    font-family: 'AlibabaSans102-fallback';
    src: local('Arial'); 
    
    /* 使用 Font Inspector 或 FontDrop 相关工具，获取 Web Fonts 映射 CSS 字体覆盖描述符所需参数值 */ 
    --unitsPerEm: 1000; 
    --lineGap: 10; 
    --descender: -237; 
    --ascender: 1041; 
    --advanceWidthMax: 815; 
    
    /* 使用 CSS 自定义属性 和 calc() 函数将值转换成 CSS 属性相匹配的值 */ 
    ascent-override: calc(var(--ascender) / var(--unitsPerEm)  100%); 
    descent-override: calc(var(--descender) / var(--unitsPerEm) * 100%); 
    line-gap-override: calc(var(--lineGap) / var(--unitsPerEm) * 100%); 
    advance-override: calc(var(--advanceWidthMax) / var(--unitsPerEm)); 
} 
​
.price { 
    font-family: AlibabaSans102, 'AlibabaSans102-fallback';
} 
```

简单地来看 `ascent-override`、`descent-override`、`line-gap-override` 描述带来的作用。为了省事，下面示例中直接使用 `local()` 调用了系统的 `Arial Bold` 字体，并且分别使用这几个描述覆盖本地系统的 `Arial Bold` 字体，创建新的字体。先来看 `ascent-override`：

```CSS
/* 使用 local() 调用系统的 “Arial bold”字体，你可以在此更换成你喜欢的 Web Fonts */ 
@font-face { 
    font-family: "Arial Bold"; 
    src: local(Arial Bold); 
} 
​
/* 使用 ascent-overrid 覆盖系统“Arial bold”字体，当作新字体 */ 
@font-face { 
    font-family: "Arial-Bold-fallback"; 
    src: local(Arial Bold); 
    ascent-override: 71%; 
} 
​
.default { 
    font-family: "Arial Bold"; 
} 
​
.adjusted { 
    font-family: Arial-Bold-fallback; 
} 
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b57c9fec015441eaa8e495148ab5aadf~tplv-k3u1fbpfcp-zoom-1.image)

红字文字是未调整的（对应 `.default`，即使用的是 `Arial Bold`），其中大写的 `A` 和 `O` 上面有空间（间距），而蓝色文本已使用 `ascent-override` 调整过（对应 `.adjusted`，即可使用了 `ascent-overrid` 覆盖之后的 `Arial-Bold-fallback` ）的字体，所以蓝字文本中的大写 `A` 和 `O` 的上限高度与整个边界框是紧密相连的。

把上面示例中的 `ascent-override` 换成 `descent-override`：

```CSS
 /* 使用 descent-override 覆盖系统“Arial bold”字体，当作新字体 */ 
 @font-face { 
     font-family: "Arial-Bold-fallback"; 
     src: local(Arial Bold); 
     descent-override: 0%; 
 } 
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a0091b68c284e368adb8ae31279fc33~tplv-k3u1fbpfcp-zoom-1.image)

从效果截图中不难发现，红色文本（未调整）的 `D` 和 `O` 基线下有空间，而蓝色文本是调整之后的，它的字母紧贴在基线上。

最后看 `line-gap-override` 描述符，把上面示例换成：

```CSS
/* 使用 line-gap-override 覆盖系统“Arial bold”字体，当作新字体 */ 
@font-face { 
    font-family: "Arial-Bold-fallback"; 
    src: local(Arial Bold); 
    line-gap-override: 50%; 
}
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d4fd9f4e2c147d18a32f53bd3208e64~tplv-k3u1fbpfcp-zoom-1.image)

红色文本（未调整）没有行距覆盖，基本上是 `0%`，而蓝色文本已经被调整为 `50%`，在字母上方和下方创建相应空间。

如果我们把这些覆盖都放在一起，你将看到如下效果：

```CSS
/* 使用 local() 调用系统的 “Arial bold”字体，你可以在此更换成你喜欢的 Web Fonts */ 
@font-face { 
    font-family: "Arial Bold"; 
    src: local(Arial Bold); 
} 
​
/* 使用 ascent-overrid 覆盖系统“Arial bold”字体，当作新字体 */ 
@font-face { 
    font-family: "Arial-Bold-fallback"; 
    src: local(Arial Bold); 
    ascent-override: 71%; 
    line-gap-override: 50%; 
    ascent-override: 0%; 
 } 
 
.default { 
     font-family: "Arial Bold"; 
} 
​
.adjusted { 
    font-family: Arial-Bold-fallback; 
} 
```

最终效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e589ffc1732a4e61ac0e1090edfcd068~tplv-k3u1fbpfcp-zoom-1.image)

我们来看一个真正的 Web Fonts 被 F-mods 覆盖后的效果，就拿 `AlibabaSans102` 为例。

```CSS
/* Web Fonts */ 
@font-face { 
    font-family: AlibabaSans102; 
    font-weight: 700; 
    font-style: normal; 
    font-display: swap; 
    src: url("https://g.alicdn.com/eva-assets/8f07c38aa173457f747f15a8774161a4/0.0.1/tmp/font/0ce464d2-bb11-41c8-8470-0049cea5f6b1.woff2") format("woff2"); 
} 

/* 系统 Arial bold */ 
@font-face { 
    font-family: "Arial Bold"; 
    src: local(Arial Bold); 
} 

/* 覆盖系统 Arial bold */ 
@font-face { 
    font-family: Arial-Bold-fallback; 
    src: local(Arial Bold); 
    descent-override: 0%; 
    ascent-override: 72%; 
    line-gap-override: 3%; 
} 

/* 覆盖 Web Fonts */ 
@font-face { 
    font-family: AlibabaSans102-fallback; 
    src: local(Arial Bold); 
    
    --unitsPerEm: 1000; 
    --lineGap: 10; 
    --descender: -237; 
    --ascender: 1041; 
    --advanceWidthMax: 815; 
    
    ascent-override: calc(var(--ascender) / var(--unitsPerEm)  100%); 
    descent-override: calc(var(--descender) / var(--unitsPerEm) * 100%); 
    line-gap-override: calc(var(--lineGap) / var(--unitsPerEm) * 100%); 
    advance-override: calc(var(--advanceWidthMax) / var(--unitsPerEm)); 
} 
```

最终效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d64e4e2cb82c42e9ad9277bf2ae100af~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMGyax>

## F-mods 也不是万能的

F-mods 只是修正了垂直方向的间距和位置。这也意味着字符间距和字母间距仍然需要处理，否则可能会在不同的点上断行，改变元素高度，从而导致布局的偏移。

不幸的是，CSS 的 `letter-spacinng` 和 `word-spacing` 并不能直接用于 `@font-face` 规则中。因此，我们需要在元素上单独使用。正如 [@SimonHearne 的示例中](https://codepen.io/simonjhearne/full/rNMGJyr)所示，单独在一个选择器中使用了这两个属性：

```CSS
/* Web Fonts */ 
@font-face { 
    font-family: custom-font; 
    src: url('https://simonhearne.com/assets/fonts/dosis-v17-latin-variable.woff2') format('woff2'); 
} 

/* 使用F-mods调整后的备用字体 */ 
@font-face { 
    font-family: fallback-font; 
    ascent-override: 100%; 
    descent-override: 20%; 
    line-gap-override: normal; 
    advance-override: 10; 
    src: local(Arial); 
} 

/* 调整字母和单词之间间距 */ 
.fallback { 
    letter-spacing: -1.1px; 
    word-spacing: -0.2px; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f49671397e974e02ae10797fb6fc4046~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/simonjhearne/full/rNMGJyr>

这个工作稍微麻烦一些。如果你为了调整字母和单词之间的间距，额外使用 `letter-spacing` 和 `word-spacing` 属性，那么在 Web Fonts 加载成功之后，需要从你的样式表中删除这两个规则。这个时候你就需要使用 CSS Font Loading API 或 FontFaceObserver了，当然，你也可以直接使用 JavaScript 来控制，只是略微麻烦一些。

## 可用于 @font-face 规则中的新特性

正如 F-mods 中所描述的一样，`ascent-override`、`descent-override`、`line-gap-override` 和已废弃的 `advance-override` 都是用于 `@font-face` 规则中的 CSS 特性。他们都是用于服务 Web Fonts，主要目的就是使用 CSS 来调整字体的度量参数，让备用字体（系统字体）更匹配 Web Fonts，从而减少 Web Fonts 引起的布局偏移。

值得庆幸的是，在 [CSS Fonts Module Level 5](https://www.w3.org/TR/css-fonts-5) 规范中又为 `@font-face` 规则添加了几个新属性。比如，[用来覆盖字体上标（sup）和下标（sub）](https://www.w3.org/TR/css-fonts-5/#font-sup-sub-override-desc)的 `superscript-position-override`、`subscript-position-override`、`superscript-size-override` 和 `subscript-size-override` 描述符。虽然这几个属性还没有得到任何浏览器的支持，但对于 Web 开发者而言，这是希望。

除此之外，还新增了 `size-adjust` 和 `font-display` 属性，其中 `size-adjust` 属性允许我们调整字形的比例系数（百分比）。该描述符取代了前面提到的 `advance-override`描述符，而 `font-display` 属性允许我们对 Web Fonts 加载进行优化，防止 Web 布局偏移。

我们先来看 `size-adjust` 。

### CSS 的 size-adjust

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d66fc0ded3a41339bf46159ee824e2b~tplv-k3u1fbpfcp-zoom-1.image)

上图中的字体大小（`font-size`）是一致的，都是 `64px`，但每个标题使用了不同的字体。左侧图是没有使用 `size-adjust` 的效果，文本会因为字体不同，对应的所在区域大小也不同。而右侧是使用了 `size-adjust` 的效果，确保了不同字体的最终尺寸都是 `64px`。从图中不难发现，左侧因字体不同造成布局偏移，而右侧则没有。

那么，`size-adjust` 如何使用呢？其实，它的使用并不复杂，和前面介绍的 F-mods 使用差不多。比如下面这段 CSS 代码：

```CSS
@font-face { 
    font-family: 'Lato'; 
    src: url('/static/fonts/Lato.woff2') format('woff2'); 
    font-weight: 400; 
} 

h1 { 
    font-family: Lato, Arial, sans-serif; 
} 
```

我们现在要做的就是使用一个系统字体作为 `Lato` 的备用字体，比如 `Arial`，然后在相应的 `@font-face` 规则中使用 `size-adjust` ：

```CSS
 /* Web Fonts */ 
 @font-face { 
     font-family: 'Lato'; 
     src: url('./fonts/Lato.woff2') format('woff2'); 
     font-weight: 400; 
} 

/* 使用系统字体作为 Web Fonts 的备用字体 */ 
@font-face { 
    font-family: "Lato-fallback"; 
    size-adjust: 97.38%; 
    ascent-override: 99%; 
    src: local("Arial"); 
} 

h1 { 
    font-family: Lato, Lato-fallback, sans-serif; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed389673b59745fba2151d0269679436~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQarZE>

这意味着使用了系统字体 `Arial`（系统字体可以直接使用，不需要额外下载），然后使用 `size-adjust` 和 `ascent-override` 让系统字体 `Arial` 更接近 `Lato` 字体（Web Fonts），并且该 `@font-face` 创建的字体 `Lato-fallback` 作为 `Lato` 的备用字体。注意，经过调整的 `Lato-fallback` 更接近 `Lato` 字体。也就是说，从备用字体 `Lato-fallback` 切换到 `Lato`（Web Fonts 字体加载完，会切换到 `Lato` 字体，当然，这也和 `font-display` 的值有关），造成的布局偏移要好很多。

[@Malte Ubl 创建了一个工具 Automatic font matching](https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback/?font=Alatsi)，可以在给定两个字体和一个支持这些新特性（`ascent-override`、`descent-override`、`line-gap-override` 和 `size-adjust`）的浏览器的情况下自动计算这些属性的值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c96d06dcc734138add42887e88e3807~tplv-k3u1fbpfcp-zoom-1.image)

> 工具地址：<https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback/?font=Alatsi>

> [Automatic font matching](https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback/?font=Alatsi) 是基于 [@Monica Dinculescu 的 Font Style Matcher](https://meowni.ca/font-style-matcher/) 构建的。详细的可以阅读 @Malte Ubl 的 《[More than you ever wanted to know about font loading on the web](https://deploy-preview-15--upbeat-shirley-608546.netlify.app/posts/high-performance-web-font-loading/)》一文。如果你的 Web Fonts 不是 Google Fonts，而又希望 Automatic Font Matching 工具帮助你计算字体之间的差异，那么你[可以把该工具的代码下载下来](https://glitch.com/edit/#!/perfect-ish-font-fallback?path=demo.html%3A1%3A0)，在代码中更换你自己想要的 Web Fonts。

也就是说，我们在使用 Web Fonts 时，可以把这些描述符放置到一个 `@font-face` 规则中，并且该 `@font-face` 引用一个系统字体来作为 Web Fonts 的备用字体。这样一来，就可以改善 `font-display: swap` 引起的布局偏移。这样就有一个两全其美的效果：**内容可以尽快被看到，而且还可以得到 Web Fonts 带来的美化，同时还不会牺牲用户看内容的时间**。

综合下来，我们在使用 Web Fonts 时，像下面这样使用会给用户提供一个更好的体验，还能尽可能改善 Web Fonts 带来的布局偏移（要完全根除 Web Fonts 带来的布局偏移是不可能的）。

```HTML
<html>
    <head> 
        <!-- 如果 Web Fonts 和域名在同一个地方，preconnect 可以忽略 --> 
        <link rel="preconnect" href="https://g.alicdn.com" crossorigin /> 
        <!-- Web Fonts 预加载，需要放置在页面关键渲染资源之后 --> 
        <link rel="preload" importance="high" href="https://g.alicdn.com/font/lota.woff2" as="font" type="font/woff2" crossorigin="anonymous"> 
        <style> 
            /* 声明 Web Fonts */ 
            @font-face { 
                font-display: swap; 
                font-family: lota; 
                font-style: normal; 
                font-weight: normal; 
                src: url('https://g.alicdn.com/font/lota.woff2') format('woff2'); 
            } 
            
            /* 使用系统字体作为 Web Fonts 备用字体，并且使用 FontDrop 给的参数来覆盖 */ 
            @font-face { 
                font-family: lota-fallback; 
                font-style: normal; 
                font-weight: normal; 
                src: local('Arial'); 
                
                /* 使用系统的 Arial 作为备用字体 */ 
                --unitsPerEm: 2000; 
                --lineGap: 0; 
                --descender: -426; 
                --ascender: 1974; 
                
                ascent-override: calc(var(--ascender) / var(--unitsPerEm)  100%); 
                descent-override: calc(var(--descender) / var(--unitsPerEm) * 100%); 
                line-gap-override: calc(var(--lineGap) / var(--unitsPerEm) * 100%); 
                size-adjust: 107.6%;  
            } 
            
            /* 运用 Web Fonts */ 
            .font { 
                font-family: lota, lota-fallback, sans-serif； 
            } 
        </style> 
    </head> 
    <body>
    </body>
</html>
```

另外，需要注意的是，CSS 的 `size-adjust` 不等同于 `text-size-adjust` 和 `font-adjust-size` 两个属性，大家千万别混淆了！

### CSS 的 font-display

我们现在已经知道，使用 Web Fonts 可以让页面更美观，但也给 Web 页面带来一定的损失，比如 Web Fonts 会引起布局抖动和偏移。如果我们要对此进行优化，减少 Web Fonts 引起的布局偏移，就要从字体加载方面去做相应的优化策略。[@Zach Leatherman 经过多年的研究，对字体加载提供了一些优化策略](https://www.zachleat.com/web/comprehensive-webfonts/)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c5c3f76588849dcb59492beaabd48ff~tplv-k3u1fbpfcp-zoom-1.image)

不管是 FOIT 还是 FOUT （字体加载策略），两者都不太理想，会产生布局偏移。

庆幸的是，在 `@font-face` 规则中添加 CSS 的 `font-display` 可以告诉浏览器我们更喜欢 Web Fonts 在不同的下载时间和可用时间下以哪种方式来渲染文本。

```CSS
@font-face { 
    font-family: AlibabaSans102; 
    font-display: optional; 
    src: url('/font/AlibabaSans102.woff2') format('woff2'), 
        url('/font/AlibabaSans102.woff') format('woff'), 
        url('/font/AlibabaSans102.ttf') format('truetype'); 
}
```

`font-display` 有五个可选值（`auto`、`swap`、`block` 、`fallback` 和 `optional`），其中 `auto` 是它的默认值，也就是浏览器渲染 Web Fonts 的默认行为（大多数浏览器喜欢 FOIT）。另外四个值在字体未加载完的前后，浏览器将会以不同的形式（Web Fonts 还是备用字体）渲染文本，即**修改 Web Font 的渲染行为**。

在开始介绍了解这几种类型之前先来了解一个基本概念：**字体显示时间轴**。

字体显示时间线基于一个计时器，该计时器在用户代理（浏览器）尝试使用给定下载字体的那一刻开始。时间线分为三个时间段，在这三个时间段中指定使用字体的元素的渲染行为。

-   **字体阻塞周期（Block）** ：如果未加载字体，任何试图使用它的元素都必须渲染不可见的后备字体。如果在此期间字体已成功加载，则正常使用它。
-   **字体交换周期（Swap）** ：在阻塞周期后立即发生，如果未加载字体，任何尝试使用它的元素都必须渲染后备字体。如果在此期间字体已成功加载，则正常使用它。
-   **字体失败周期（Fail）** ：在交换周期后立即发生，如果在此周期开始时字体还未加载，则标记为加载失败，使用正常的后备字体。否则，字体就会正常使用。

有了这个概念，我们再了解 `font-display` 取 `swap`、`block` 、`fallback` 和 `optional` 会让浏览器以什么方式（字体显示时间轴）渲染使用 Web Fonts 的文本。下面先从 `swap` 开始！

#### font-display: swap

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/def402ec345a4013a4021d889eb286c2~tplv-k3u1fbpfcp-zoom-1.image)

`font-display` 取值为 `swap` 是在告诉浏览器，Web Fonts 在未加载完成之前都采用备用字体来显示文本（也就是 FOUT）。不管 Web Fonts 加载费时多久，只要字体被加载，文本就会从备用字体切换到 Web Fonts。使用 `swap` 方式的优势是**可以让用户立即看到内容，但备用字体最好能和 Web Fonts 相似，以防止字体交换（备用字体切换到 Web Font）时出现较大的布局偏移**。

#### font-display: block

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29a158da89e5446f9a0f324f23576ee5~tplv-k3u1fbpfcp-zoom-1.image)

`font-display` 取值 `block` 则会告诉浏览器，Web Fonts 在未加载之前隐藏文本（也就是 FOIT）。不过 `block` 并不会让使用 Web Fonts 的文本永远隐藏不可见，如果 Web Fonts 在一定时间内（通常是 `3s`）未加载，文本不可见，但超过 `3s` 这个时间，浏览器会使用备用字体渲染文本（介于 Web Fonts 加载时间大于 `3s` 与加载完成之间）。一旦 Web Fonts 加载成功，就会从备用字体切换到 Web Fonts。

是否选择 `block` 就看你自己了。如果你找不到和 Web Fonts 相似的备用字体，又不希望在字体切换时造成较大的布局偏移，可以选择 `block` ，但也得记住，使用 `block` 有可能会有近 `3s` 的时间内用户什么也看不到（在这个时间段内文本被隐藏）。这很可能会让用户感觉访问的页面什么内容都没有，甚至会觉得加载页面失败。

#### font-display: fallback

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2497408fb3e441fbc8d78bafbb3f932~tplv-k3u1fbpfcp-zoom-1.image)

`font-display` 的 `fallback` 和 `swap` 略有差异：

Web Fonts 在小于 `0.1s` 未加载时，文本不可见（文本有 `0.1s` 不可见期）； `0.1s ~ 3s` 内加载成功，则会在 `0.1s ~ 3s` 内使用备用字体渲染，字体一旦加载完就会切换到 Web Fonts 渲染，`3s` 内还未加载成功（即使在超过 `3s` 字体加载成功，比如 `4s` 时加载完成），文本也会一直使用备用字体渲染，好像是字体没加载成功一样。

如果你并不关心用户在第一次访问你的 Web 应用时，是否看到你的 Web Fonts（很可能他们自己也不那么关心），那么 `fallback` 是一个不错的选择。

#### font-display: optional

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eab7e0440b1e47b69f02c9cce57f175e~tplv-k3u1fbpfcp-zoom-1.image)

`optional` 与 `fallback` 类似，但它给字体一个极短的时间（`~100ms`）来加载，之后就不会被切换。从上图的字体显示时间轴上可以看出，如果 Web Fonts 在小于 `0.1s` 内未加载完成，即使在后面字体完成加载，文本也不会使用 Web Fonts 渲染。同样，它也有一个极短时间（`~100ms`）会让文本不可见。

不过，它确实有一个额外的功能，即**如果连接速度太慢，字体无法加载，它可以让浏览器中止字体的请求**。

`optional` 对 Web 可用性有明显的好处，而且它对慢速的网络连接的数据占用也有改善。不过 `optional` 也有着自己独特之处。这样说吧，如果显示的是备用字体，那么 Web Fonts 将永远不会被显示，即使是快速的加载（除非在小于 `100ms` 字体加载完成）。因此，这就导致用户在快速的设备和连接上，文本使用备用字体渲染出来了，Web Fonts 已被加载，但它并没有被渲染出来。只有当用户浏览到另一个页面时，Web Fonts 才会被显示出来。

在加载 Web Fonts 时，我们要防止布局偏移（可以使用 CWV 的 CLS 来计算 Web Fonts 引起的布局偏移）。这发生在两种情况之下。

-   FOUT ：备用字体被换成了 Web Fonts ，例如 `font-display: swap` 。
-   FOIT：文本不可见，直到 Web Fonts 加载成功被渲染，例如 `font-display: block` 。

浏览器目前有一个类似 `block` 的默认策略。不过，唯一能消除布局偏移的是 `optional` ，在结合字体其他加载策略下，`optional` 将是你最佳选择！

### CSS 的 unicode-range

许多字体会有来自多个字母的字形（字形是单个字符，比如 `a` 和 `&`），如果你的网站是一个纯英文的网站，可能只会用到拉丁字母（`a~Z`、`0~9` 或一些基本字符，比如 `+` 、`-` 等），并且不使用连字符（比如 `é`），那么这些字形在你的字体文件中就是多余的，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/973e233402a843ea8371ebc4e179bfa9~tplv-k3u1fbpfcp-zoom-1.image)

这样就可以生成一个新的较小的字体文件，其中只包括我们需要的字形。

> 如果你需要对一个字体文件进行子集的优化，可以使用一些工具来完成，比如 [Everything Fonts 上的 Font Subsetter 工具](https://everythingfonts.com/subsetter)或 [@Munter 的 subfont](https://github.com/Munter/subfont)。

字体子集是优化字体文件大小的有效手段之一，但它也有一些潜在的缺点。比如，你正在建立一个显示用户生成的内容、人名或地名的网站，你应该考虑 `26`个标准字母（`a~Z`）、`10` 个数字（`0~9`）和英语写作中常见符号以外的字符（比如 `+` 、`-` 、`$` 等）。至少，你应该考虑到变音符：出现在字符上方或下方，改变其发音的字形。这在法语、西班牙语、越南语以及希腊语或希伯来语等字母的音译（或 “罗马化”）文本中很常见，它们也出现在借词（从另一种语言采用的词语）中。如果你过于积极地进行子集，你甚至可能在同一个词中出现各种字体的混合。

还有，要是你的网站支持多国语言，就有可能为你的字体创建多个子集变化。在这种情况下，在你的 `@font-face`规则中使用 `unicode-range` 声明，可以让浏览器知道哪些字符在哪个字体文件中。比如：

```CSS
/* cyrillic */ 
@font-face { 
    font-family: 'Open Sans'; 
    font-style: normal; 
    font-weight: 400; 
    font-stretch: 100%; 
    font-display: swap; 
    src: url(/font/open-sans.woff2) format('woff2'); 
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; 
} 
​
/* greek */ 
@font-face { 
    font-family: 'Open Sans'; 
    font-style: normal; 
    font-weight: 400; 
    font-stretch: 100%; 
    font-display: swap; 
    src: url(/font/open-sans.woff2) format('woff2'); 
    unicode-range: U+0370-03FF; 
} 
​
/* hebrew */ 
@font-face { 
    font-family: 'Open Sans'; 
    font-style: normal; 
    font-weight: 400; 
    font-stretch: 100%; 
    font-display: swap; 
    src: url(/font/open-sans.woff2) format('woff2'); 
    unicode-range: U+0590-05FF, U+20AA, U+25CC, U+FB1D-FB4F; 
} 
```

有关于 `@font-face` 声明块中使用 `unicode-range` 更多的介绍，还可以阅读：

-   [Creating Custom Font Stacks with Unicode-range](https://24ways.org/2011/creating-custom-font-stacks-with-unicode-range/)
-   [Unicode-range Interchange](https://www.zachleat.com/web/unicode-range-interchange/)

如果你开发的是一个中文应用，而且会用到非系统字体，那么字体的子集就非常有用了。因为中文字体包要比其他字体包大得多，而且我们可能只会用到部分中文汉字，比如说标题。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c0df37f697b45b9861276f1a25e0f2a~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，“前端练习生计划”标题使用的是“方正兰亭大黑简体”、“计划介绍”使用的是“方正汉真广标简体”。针对这种知道使用的文字（文字内容是固定的），那就可以使用字体的子集，可以让中文字体文件变小很多。我们可以使用一些工具，快速构建出所需内容的字体子集，比如 [font-extractor](https://github.com/bung87/font-extractor) 和 [font-spider-plus（字蛛）](https://github.com/allanguys/font-spider-plus)。

我们以字蛛为例。在本地构建一个项目，将中文字体文件放置到该项目中，并且创建一个 `index.html` 文件，通过 `@font-face` 把字体引入到相应的 `<style>` 中，并且运用到指定文字内容的元素上，同时在 HTML 中将需要的文字内容输入到某个元素中：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fd1d579cbd3419eaafb0e821fccc07d~tplv-k3u1fbpfcp-zoom-1.image)

类似上图操作完成之后保存 `index.html` 文件，然后在命令终端上进入该项目下，执行下面的命令：

```
❯ font-spider *.html 
```

此时字蛛会根据指定的内容和字体创建字体子集：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0cdb3fa586447b9aebcade95385155f~tplv-k3u1fbpfcp-zoom-1.image)

生成的字体子集对应的还是 `.ttf` 文件，如果不需要兼容低版本浏览器的话，我们应该尽可能的使用 `.woff2` 字体。因此，我们还需要使用字体转换工具，将 `.ttf` 转换成 `.woff2` 字体：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7311907a177d4f4ea3def12b1e6f85e6~tplv-k3u1fbpfcp-zoom-1.image)

将转换出来的 `.woff2` 应用到 `@font-face` 声明块中：

```CSS
@font-face { 
    font-family: "FZHZGBJW"; 
    src: url("FZHZGBJW.woff2") format("woff2"); 
    font-weight: normal; 
    font-style: normal; 
    font-display: swap; 
} 
​
@font-face { 
    font-family: "FZLTDHJW"; 
    src: url("FZLTDHJW.woff2") format("woff2"); 
    font-weight: normal; 
    font-style: normal; 
    font-display: swap; 
} 
```

这样一来，`FZLTDHJW` 和 `FZHZGBJW` 就可以运用到指定的元素上了。但需要注意的是，如果被用到其他文本上，将不会有效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22d3fa5158bf4751bb95e6a45dc29d98~tplv-k3u1fbpfcp-zoom-1.image)

这种方案只适合在指定的文字内容中使用，如果你的文本内容是动态生成的或由用户动态输入的，那么字体子集方案就不适用了！就拿聚划算首页来说，像下图这种固定的文字内容，我们就可以使用字体子集技术方案：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dde93bc5a8247b9b87461f08f56a7df~tplv-k3u1fbpfcp-zoom-1.image)

## CSS 的 font-tech() 和 font-format() 函数

我们在使用 `@font-face` 的时候，会加载不同的字体格式，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80932732ad344b148c924dc356931a02~tplv-k3u1fbpfcp-zoom-1.image)

不幸运的是，尽管字体格式种类繁多，但没有哪一种格式可以在所有浏览器中使用。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d3e352f40354efbbd733053a5035c14~tplv-k3u1fbpfcp-zoom-1.image)

在 CSS 中，我们可以使用 `font-format()` 函数和 `@supports` 一起来检测浏览器是否支持指定的字体技术或字体格式。拿 `.woff2` 格式的字体为例，IE 或 Edge 就不支持，我们可以像下面这样使用 CSS 来对其进行检测：

```CSS
@supports font-format(woff2) {
  
}
```

另外，我们还可以使用 `font-tech()` 函数用于检查浏览器是否支持指定的字体技术。例如，CSS 字体调色板 `font-palette` 或增量字体加载技术。我们可以这样使用 CSS 代码：

```CSS
/* 支持 font-paletter 浏览器 */
@supports font-tech(palettes) {
  
}

/* 不支持增量字体加载技术的浏览器 */
@supports not font-tech(incremental) {

}
```

## 字体性能的未来

使用 Web Fonts 对于 Web 应用或网站来说是很昂贵的，他直接对 Web 应用或页面的性能有着直接的影响，以致于 Web 开发者需要使用不同的技术手段来对其进行优化。例如：

-   加载更少的字体文件
-   使用伪粗体和伪斜体
-   使用可变字体
-   字体子集
-   优化字体文件
-   使用现代的字体格式
-   优化字体加载策略
-   缓存字体
-   等等

很明显，字体性能还不是一个已经解决的问题。

值得庆幸的是，在 [W3C Web Fonts 工作组](https://www.w3.org/Fonts/WG/)（Web Fonts Working Group）中，有一项工作正在进行，以改善这个问题。其中一项建议是**[渐进式字体丰富化](https://www.w3.org/TR/PFE-evaluation/)**，这是一个增量字体加载的概念，它允许浏览器准确地请求它们渲染文本所需的字符，有可能极大地减少初始字体文件的大小，从而提高渲染速度。

[谷歌提供了一个关于这个增量传输概念的演示](https://fonts.gstatic.com/experimental/incxfer_demo)，如果你对这个概念感兴趣的话，可以深入阅读 @Jason Pamental的《[Progressive Font Enrichment: reinventing web font performance](https://rwt.io/typography-tips/progressive-font-enrichment-reinventing-web-font-performance)》博文。

## 一些可用于排版的 CSS 特性

在 CSS 中，还提供了一些用于排版方面的新特性（不是用在 `@font-face` 规则内）。这里再花简短的篇幅来聊一下这些属性。

### 间距（Spacing）和字距（Kerning）

在字体文件中，有两种设置可以定义字符之间的空间。在 CSS 中可以使用 `letter-spacing` 和 `font-kerning` 来控制。

-   `letter-spacing`：用于设置文本字符的间距表现（每个字符左右两边的边距）。
-   `font-kerning`：设置是否使用字体中存储的字距信息（两个字符之间的间距）。

在字体中，间距（Spacing）是不能关闭的，否则渲染引擎（浏览器）在渲染文本时就不知道如何处理字符的间距；字距（Kerning）在浏览器中默认是关闭的，需要使用 CSS 的 `font-kerning` 来打开。

`letter-spacing` 大家非常熟悉，设置一个带有单位的正负值即可，比如 `-.1px`；`font-kerning` 的使用也不复杂：

```CSS
p { 
    font-feature-settings: "kern" 1; 
    font-kerning: normal; 
}
```

### OpenType 字体的高级功能

OpenType 功能很强大，它们为控制字体开启了大量的可能性，而不必为获得相同的效果提供多个字体文件。CSS 的可变字体就是属于 OpenType 的，该字体所支持的功能都是由字体设计者决定的，而且是所有的字体都支持相同的功能。在 CSS 中除了 `font-variation-settings` 属性用于控制可变字体之外，还可以使用 `font-feature-settings` 属性用来控制 OpenType 字体中的高级印刷功能。比如：

```CSS
p { 
    font-feature-settings: "onum" 1, "pnum" 1, "kern" 1, "ss01" 1; 
} 
```

示例代码中的 `onum`（old style figures）、`pnum` （proportional numerals）、`kern` （kerning） 和 `ss01`（stylistic sets） 代表着 OpenType 字体中不同的功能。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a63f6ddf6fc947b39b2be8a007669043~tplv-k3u1fbpfcp-zoom-1.image)

Web 开发者应该尽可能使用类似 `font-variant` 这样的短标记属性或者相关的速记标识属性等，类似 `font-variant-ligatures` 、 `font-variant-caps` 、`font-variant-east-asian` 、 `font-variant-alternates` 、 `font-variant-numeric` 或 `font-variant-position`。该属性是一个比较偏底层的功能接口，用于解决由于没有其他方法去访问和设置 OpenType 字体某些特性而无法解决一些特殊功能需求。特别需要注意的是，该 CSS 属性不应该用来开启大写字母转换。

> 注意，在小册后面介绍可变字体一节中，我们会详细介绍这些知识点。

### 字体平滑化

虽然字体文件中包含的提示信息在 MacOS 上大多都被忽略了，但特定的浏览器对字体渲染提供了一些额外的控制。

```CSS
html { 
    -webkit-font-smoothing: antialiased; /* Chrome, Safari */ 
    -moz-osx-font-smoothing: grayscale; /* Firefox */ 
} 
```

使用 `font-smoothing` 可以使 MacOS 和 iOS 上文本渲染更清楚、更细（Thin）。但这也可能导致渲染问题，特别是你已经使用了一种字更细（Thin）字体或 `font-weight`（字重）。`antialiased` 和 `grayscale` 主要用于平衡在深色背景上使用浅色文字时的字体渲染。注意，该属性已从 CSS 规范中移除，但在一些阅读类的网站上还是可以看到该属性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0688e03b740a465d83aaa11063816b62~tplv-k3u1fbpfcp-zoom-1.image)

### 优化可读性

我在 Medium 网站上看到 `<body>` 元素上设置了一个 `text-renderng: optimizeLegibility` 样式规则：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dbce7942b7d460da96b76996bdac131~tplv-k3u1fbpfcp-zoom-1.image)

`text-rendering` 定义浏览器渲染引擎如何渲染字体。浏览器会在速度、清晰度、几何精度之间进行权衡。

-   `optimizeSpeed`：浏览器在绘制文本时将着重考虑渲染速度，而不是易读性和几何精度。它会使字间距和连字无效。
-   `optimizeLegibility`：浏览器在绘制文本时将着重考虑易读性，而不是渲染速度和几何精度。它会使字间距和连字有效。该属性值在移动设备上会造成比较明显的性能问题。
-   `geometricPrecision`：浏览器在绘制文本时将着重考虑几何精度，而不是渲染速度和易读性。字体的某些方面—比如字间距—不再线性缩放，所以该值可以使用某些字体的文本看起来不错。

如果你追求的是页面性能，那么 `text-rendering` 就慎用，甚至是不要使用。特别是在文本较多的地方。

## 小结

布局偏移对用户体验不好，而且很难解决，特别是使用 Web Fonts 造成的布局偏移更难解决。虽然使用 `font-display: optional` 可以避免 Web Fonts 带来的布局偏移，但用户会在极短时间内看不到任何文本，甚至是字体加载完成也有可能看不到 Web Fonts 渲染的效果。而使用 `font-display: swap` 可以正常使用 Web Fonts 渲染文本，但会造成布局偏移。虽然 CSS 的新特性（`ascent-override`、`descent-override`、`line-gap-override` 和 `size-adjust`）可以减少 Web Fonts 带来的布局偏移，但还是无法彻底根除。这似乎又进入到两难境地，或者说这就是在和浏览器赛跑，即**试图在浏览器开始渲染文本之前加载完你的 Web Fonts**。

通过优化你的字体文件，与浏览器赛跑是可能的：

-   使用 `woff2` 来最小化文件大小
-   自己服务器托管 Web Fonts
-   预加载关键字体（如果 Web Fonts 有多个，在一个主站上，使用 `<link rel="preload">` 不超过三个）
-   使用 `preconnect`，让用户提前连接到存放 Web Fonts 的域名
-   对所需字符进行字体子集 限制使用的重量变化的数量，不采用可变字体情况下，每个不同重量的字体需要一个字体文件
-   探索可变字体
-   尽可能使用系统字体
-   使用 F-mods 来减少字体交换的影响

如果你确认，在使用 Web Fonts 时不能使用 `font-display: optional` 控制浏览器加载字体和渲染字体策略（必须使用 `font-display: swap`），那么就尽可能地使用 `@font-face` 规则加载一个系统字体作为该 Web Fonts 的备用字体，并且在该 `@font-face` 规则中配置 F-mods 描述符（`ascent-override`、`descent-override`、`line-gap-override` ）和 `size-adjust`，尽可能让使用覆盖描述符修改后的系统字体更贴近 Web Fonts，更好地减少 Web Fonts 引起的布局偏移。