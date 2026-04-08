首先我要声明的是，接下来要聊的 SVG 库和工具并不是如何创建一个 SVG 库或工具，我们主要聊的是社区 Web 开发者为 SVG 提供的一些优秀的库和工具。这些库和工具种类繁多，涵盖从创建形状和背景到可视化 SVG 路径以及 SVG 动画等各种需求。

  


在之前的课程中，或多或少也向大家展示了如何借助社区开源的库和在线工具帮助我们快速理解 SVG 的知识以及在实际工作中如何使用这些工具创建出符合项目需求的 SVG，从而提供我们的开发效率。

  


## SVG 编辑器

  


虽然 SVG 提供了很多图形元素，允许我们通过编码的方式来绘制各式各样的图形，但很多时候，通过代码绘制复杂图形时，着实是件痛苦的事情。除了效率低，易于出错之外，在视觉上总是难于满足美学的需求。

  


其实，我们可以先借助 SVG 编辑器来辅助我们快速创建 SVG 图形，并获取相应的 SVG 代码，再将代码应用到自己的 Web 项目中。或者说，如果你只需要修复 SVG 文件中的一些问题，但又不想使用诸如 Figma 或 Sketch 这样的大型应用程序，那么 [Boxy SVG](https://boxy-svg.com/) 或 [Editor Method](https://editor.method.ac/) 将是不错的选择。它们具有基本 SVG 编辑功能和可视化编辑器的 Web 应用程序。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91199c39ff974cc0807f3f2117bf4e3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1320&s=33203&e=avif&b=f4f3f3)

  


> Boxy SVG: https://boxy-svg.com/

  


除此之外，你还可以使用 [Vecta](https://vecta.io/)、[MacSVG](https://macsvg.org/) （一款轻量级的开源 MacOS 应用程序，用于 SVG 编辑和动画制作）和 [SVG-Edit](https://github.com/SVG-Edit/svgedit) 等在线 SVG 编辑器。

  


## SVG 图形生成器

  


在 Web 开发过程中，常常会使用一些不规则的图形增加 UI 的视觉美感。例如，Blob 形状、水波纹、斑点背景、分隔线和多边形等。我们可以通过一些在线生成器，快速获得所需要的形状。

  


### SVG 多边形生成器

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b513d2728044969b91eca104a77864a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1440&s=31962&e=avif&b=fdfdfd)

  


> Polygon Generator：https://codepen.io/winkerVSbecks/full/wrZQQm/

  


这是一款由 [@Varun Vachhar 使用 JavaScript 构建的多边形生成工具](https://codepen.io/winkerVSbecks/full/wrZQQm/)，你只需要定义边数、半径和中心点位置，就可以为你生成一个 `<polygon>` 元素绘制的多边形。通常情况下，是一个正多边形。

  


### SVG Blob 生成器

  


在社区中生成 Blob 图形的生成器有很多款，例如 [BlobMaker](https://www.blobmaker.app/) 就是其中之一。它允许你随机生成一个 Blob 形状，你也可以根据个性化定制一个 Blob 形状。该生成器可以导出 SVG 文件，也可以直接获取 SVG 代码：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38c24df339a44fe0a3dbccae637d3b3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1586&h=766&s=1411340&e=gif&f=200&b=fdfdfd)

  


> BlobMaker：https://www.blobmaker.app/

  


如果你觉得 BlobMaker 生成器还不够用，那么 [Haikei](https://app.haikei.app/) 将能满足你更多的应用场景。你可以使用 Haikei 应用程序来生成一个更高级的 SVG 资源，比如分层波浪、堆叠波浪以入斑点背景等：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd190ea774424d60a5dbeda9f56de26f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1088&s=20127&e=avif&b=0f0f0f)

  


> Haikei App: https://app.haikei.app/

  


### SVG 波浪生成器

  


除了 Haikei 应用可以生成类似波浪的 SVG 图形之外，你还可以考虑使用 [SVGwave](https://svgwave.in/) 生成器。你可以调整颜色、层次和一些设置，选择一个随机生成的选项，并将其导出为 SVG 或 PNG：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e34cb953c941406797681a9fd702a42a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1658&h=798&s=2326997&e=gif&f=133&b=f8f8f8)

  


> SVGwave：https://svgwave.in/

  


SVGWave 除了能生成静态的水波纹之外，还可以生成动态的水波纹。

  


如果你需要生成更复杂的水波纹，那么可以选择 [Wavelry](https://wavelry.vercel.app/) 生成器，它允许在锐利、线性和平滑波浪之间进行选择：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68f14d09563b4c139edbd5ca83eeab95~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1660&h=892&s=3948199&e=gif&f=218&b=040404)

  


> Wavelry：https://wavelry.vercel.app/

  


而 [SVG Gradient Wave Generator](https://www.outpan.com/app/9aaaf27303/svg-gradient-wave-generator) 生成器则更进一步，它允许你调整振幅、平滑渡、饱和度和色调。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/443bbc39301e48ecbf979d73a62ceda8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=882&s=5927428&e=gif&f=177&b=036b68)

  


> SVG Gradient Wave Generator：https://www.outpan.com/app/9aaaf27303/svg-gradient-wave-generator

  


最后，[Loading.io](https://loading.io/background/m-wave/) 不仅提供生成波浪图形，还可以对它们进行动画处理。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5ea73c87eca4f42b468738d7dde1d1a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1652&h=874&s=8668835&e=gif&f=103&b=ffffff)

  


> Loading.io：https://loading.io/background/m-wave/

  


所以，如果你的设计中需要波浪，这些工具基本上可以满足你的需求。

  


### SVG 分段分隔线生成器

  


当页面上有几个部分时，通常会用轻微的背景颜色变化将它们分隔开。然而，我们可以使用任何形式的形状作为这些部分之间更有趣的分隔线。[ShapeDivider](https://www.shapedivider.app/) 允许你生成自定义形状的分隔线，并将它们导出为SVG文件。它为你预设置了十种不同的分隔线效果，你可以选择其中的一个，并调整颜色、宽度、高度以及其他一些设置，并在窄屏和大屏上实时预览结果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5fedfcc83c84a61924551a920f9eb02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1392&h=798&s=8568180&e=gif&f=347&b=fdfcfc)

  


> ShapeDivider：https://www.shapedivider.app/

  


注意，前面提到的波浪生成器也可以为你生成波浪形分隔线！

  


## SVG 背景生成器

  


在 Web 上，除了位图、纯色、渐变色作为页面或元素的背景之外，还可能会需要一些不规则的图形作为背景，例如斑点背景、图案背景等。

  


为了让创建抽象和彩色背景变得轻而易举，[Moe Amaya 的项目 Cool Backgrounds](https://coolbackgrounds.io/) 现在将一些出色的背景生成器汇集在一起：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ba8eb1278244384836bcdbe7fd11b7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1311&s=23369&e=avif&b=f0f0f0)

  


> Cool Backgrounds: https://coolbackgrounds.io/

  


SVG 有一个强大的功能，那就是 [SVG 的 `<pattern>` 元素](https://juejin.cn/book/7341630791099383835/section/7355510532712955954)，它允许我们创建复杂的图案，用于填充 SVG 图形元素。当然，它创建的图案也可以用于作为页面或元素的背景。如果仅通过代码来创建这些图案，那你需要对 `<pattern>` 具有足够深的了解。如果你并不想了解它的底层工作原理，那么使用在线生成器将是一个不错的选择：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6183dc8b94624f3b8bab1250e991a0cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=656&s=105444&e=jpg&b=275c8b)

  


我们可以直接使用一些在线工具来生成图案瓷砖。例如：

  


-   [10015.io](https://10015.io/tools/svg-pattern-generator) ：它生成真正的、可直接使用的 SVG 图案，而不像许多其他工具一样生成通用的 SVG 图像块
-   [Hero Patterns](https://heropatterns.com/)：提供了超过 90 种免费下载的 SVG 图案，并允许你设置文件的不透明度、前景和背景颜色
-   [Iros Pattern Fills](https://iros.github.io/patternfills/)：收集了一本单色图案填充的图案书，你可以轻松地在你的工作中参考。这些文件非常小，即使你只引用了其中的一部分，也可以轻松包含它们。
-   [Pattern Monster](https://pattern.monster/)：是一个庞大的、优雅的 SVG 图形集合，大约有 250 个。你可以轻松快速地缩放、着色、旋转和重新定位每个设计。你可以直接从平台上导出 CSS 和 SVG 代码。
-   [Mmmotif](https://fffuel.co/mmmotif/)：@Sébastien Noël 在他的 [fffuel.co](https://fffuel.co) 网站上提供了一个令人瞠目结舌的简单、原创和美丽的设计工具集合。在这个集合中，他的 Mmmotif 等距三维图案生成器非常出色。与 Pattern Monster 类似，你可以混合和匹配形状、颜色、缩放和角度，以组合一个凹凸不平的三维等距图块。
-   [SVGBackgrounds.com](https://www.svgbackgrounds.com/) ：这个工具目前提供了 30 种基本图案，但颜色和不透明度可以通过几次点击进行自定义。完成后，它会导出 CSS 和 SVG，可以粘贴到你的样式表中。与 Pattern Monster 类似，你需要手动编写 SVG 图案定义。
-   [SVG Patterns Gallery](https://philiprogers.com/svgpatterns/)：基于 [@Lea Verou 的 CSS3 图案](https://projects.verou.me/css3patterns/)的一个小型 SVG 图案集合。已经有一段时间没有更新了，但仍然有价值。

  


## SVG 精灵生成器

  


我们曾在之前的课程中探讨过[如何使用 SVG 构建工具来创建 SVG 精灵](https://juejin.cn/book/7341630791099383835/section/7366975819270324275)，比如在 [Vue](https://juejin.cn/book/7341630791099383835/section/7368317661245079561)、[React](https://juejin.cn/book/7341630791099383835/section/7368317806100054043) 、[Nextjs](https://juejin.cn/book/7341630791099383835/section/7368318018335539238) 中创建 SVG 精灵以及[借助 SVG 精灵创建自己的图标系统](https://juejin.cn/book/7341630791099383835/section/7351368000697532427)。其优势就不在这里复述了。

  


其实，除了使用构建工具之外，还可以使用在线生成器来创建 SVG 精灵，例如 [SVG Spreact 生成器](https://svgsprit.es/)，你只需要将 SVG 文件拖到 SVG Spreact 中，它就会自动帮助生成一个 SVG 精灵。该工具还会帮你整理 SVG、优化它，并生成一个包含 HTML 标记和在 CodePen 上演示的 SVG 精灵。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9a558010b924f59bd8509f9f47bb6a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3324&h=1784&s=292426&e=jpg&b=ffffff)

  


> SVG Spreact：https://svgsprit.es/

  


## SVG 优化工具

  


在《[优化 SVG](https://juejin.cn/book/7341630791099383835/section/7368114202180845605)》课程中，我曾提到过，很多图形编辑软件导出的 SVG 文件或代码可能会包含大量的元信息和不必要的细节，如空元素、注释、隐藏路径或重复内容。这意味着，将导出的 SVG 应用到项目中之前，需要对 SVG 进行优化。这样做除了提高 SVG 的可读性之外，还有利于提高 Web 性能。

  


通常情况之下，你可以直接在项目中配置 [SVGO](https://github.com/svg/svgo) 来对 SVG 进行优化，你也可以通过其他方式使用 SVGO，例如 [GitHub Actions](https://github.com/marketplace/actions/svgo-action)、[Webpack 加载器](https://github.com/tcoopman/image-webpack-loader)、[Vite 加载器](https://github.com/r3dDoX/vite-plugin-svgo)、[VS Code 插件](https://github.com/1000ch/vscode-svgo)、[Sketch 插件](https://github.com/BohemianCoding/svgo-compressor)或 [Figma 插件](https://www.figma.com/c/plugin/782713260363070260/Advanced-SVG-Export)。除此之外，你还可以使用 [SVGOMG](https://jakearchibald.github.io/svgomg/) 在线对 SVG 进行优化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b482f997d794e0db15938b0f8bd4a99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3328&h=1796&s=970991&e=jpg&b=eeeeee)

  


> SVGOMG:https://jakearchibald.github.io/svgomg/

  


## SVG 滤镜工具

  


[SVG 滤镜是 SVG 中一个重要特性](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)，相对于 SVG 的其他特性而言，不管是学习还是使用都要复杂的多。所以，小册中花了多节课与大家一起探讨 SVG 滤镜的特性与使用：

  


-   [中级篇：初探 SVG 滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)
-   [高级篇：SVG 滤镜的进阶之高阶颜色矩阵](https://juejin.cn/book/7341630791099383835/section/7368318058076569638)
-   [高级篇：SVG 滤镜的进阶之文本描边](https://juejin.cn/book/7341630791099383835/section/7368318146262138889)
-   [高级篇：SVG 滤镜的进阶之创建图像特效](https://juejin.cn/book/7341630791099383835/section/7368318225756454962)
-   [高级篇：SVG 滤镜的进阶之奇妙的位移滤镜](https://juejin.cn/book/7341630791099383835/section/7368318262368534578)
-   [高级篇：SVG 滤镜的进阶之创造纹理](https://juejin.cn/book/7341630791099383835/section/7368318101526183986)
-   [高级篇：SVG 滤镜的进阶之创建颗粒效果](https://juejin.cn/book/7341630791099383835/section/7368318185768615962)
-   [高级篇：SVG 滤镜的进阶之模糊与阴影效果](https://juejin.cn/book/7341630791099383835/section/7368318391733452850)
-   [高级篇：SVG 滤镜的进阶之黏糊效果](https://juejin.cn/book/7341630791099383835/section/7368318301761437746)
-   [高级篇：SVG 滤镜的进阶之混合模式](https://juejin.cn/book/7341630791099383835/section/7368318429935173682)

  


其实，我们还可以借助相关的工具使我们快速了解和掌握 SVG 滤镜，并能将所掌握的技能用于实际开发中。例如 [SVG Filters](https://yoksel.github.io/svg-filters/#/)、[SVG FM](https://svgfm.chriskirknielsen.com/) 和 [SVG Filters Builder](https://svgfilters.client.io/) 等。尤其是 SVG Filters，这款工具多次出现在 SVG 滤镜相关的课程中：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12b2e90db03446ce859fcab1a9ea54c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1786&s=760752&e=jpg&b=f9f9f9)

  


> SVG Filters:https://yoksel.github.io/svg-filters/#/

  


除此之外，还有 [SVG Color Matrix Mixer ](https://fecolormatrix.com/)小工具，允许你为页面上的任何组件直观地生成复杂的颜色矩阵滤镜，然后使用 `<feColorMatrix>` 滤镜基元作为 CSS 滤镜（`filter`）属性的值来更改 HTML 元素的颜色。该工具还提供了一段代码片段，方便你立即应用滤镜：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4ddce0b9b204a719b52992c0a4f8927~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3334&h=1796&s=442080&e=jpg&b=fdfcfc)

  


> SVG Color Matrix Mixer：https://fecolormatrix.com/

  


与之相似的还有一款名为 [SVG Color Filter Playground 的小工具](https://kazzkiq.github.io/svg-color-filter/)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53b78d643ec84433a86a729b3ce5d745~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=646&s=3154308&e=gif&f=191&b=fcf2ef)

  


> SVG Color Filter Playground：https://kazzkiq.github.io/svg-color-filter/

  


还有一款与滤镜颜色有关的工具则是 [SVG Gradient Map Filter](https://yoksel.github.io/svg-gradient-map/#/) ，与之前两款略有不同之处是，我们可以使用它来快速创建双色调或多调图像效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3b730541a194b7ea5123c272d16aa49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1440&h=678&s=4725677&e=gif&f=55&b=fefdfd)

  


> SVG Gradient Map Filter：https://yoksel.github.io/svg-gradient-map/#/

  


## SVG 坐标系统

  


[SVG 坐标系统](https://juejin.cn/book/7341630791099383835/section/7345677438053810214)与我们熟悉的 Web 坐标系统有所不同，而且理解和掌握 SVG 坐标系统是使用 SVG 的前提条件。在 SVG 坐标系统中，`<svg>` 元素的 `viewBox` 和 `preserveAspectRatio` 属性更其中的重中之重。下面这个小工具，有利于你更好的理解和掌握这两个属性以及 SVG 坐标系统：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61da7dd931254bbca554088d5278e24a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1370&h=764&s=2384594&e=gif&f=336&b=ffffff)

  


> SVG 坐标系统：https://codepen.io/airen/full/oNOxxqm

  


## SVG 数据转换

  


通过《[如何使用 SVG](https://juejin.cn/book/7341630791099383835/section/7344089098363076620)》中学习，在开发过程中有多种方式可以将 SVG 用于 Web 上。常见的几种方式是：

  


-   内联 SVG
-   `img` 或 `iframe` 引用 SVG
-   `background-image` 或 `mask-image` 等属性引用 SVG

  


在使用 HTML 元素 （比如`img` 或 `iframe`） 和 CSS 属性 （比如 `background-image` 或 `mask-image`）引用 SVG 时，并不总是引用 `.svg` 文件。我们还可以引用 Data URI 或 Base 64 等数据格式。如果你的项目工程中没有配置相关的构建工具，那么可以考虑使用诸如[ SVGViewer](https://www.svgviewer.dev/svg-to-data-uri)、[eeencode](https://www.fffuel.co/eeencode/) 和 [URL-encoder](https://yoksel.github.io/url-encoder/) 等在线工具，将 SVG 代码转换为所需要的数据格式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e674b175e9647fc8aa16cd08fa5f559~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3312&h=1480&s=454202&e=jpg&b=ffffff)

  


> URL-encoder：https://yoksel.github.io/url-encoder/

  


另外，你的 Web 项目可能是基于 React 框架在开发。要在 React 环境中使用 SVG （内联方式），则需要将 SVG 属性替换为其 JSX 有效的等效项。也就是说，我们需要一款诸如 [SVG2JSX](https://svg2jsx.com/) 的工具，帮助我们快速将 SVG 代码转换为符合 JSX 语法规则的代码：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8699099ce92d40ab9bc2a188ddc2a683~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3336&h=1796&s=892122&e=jpg&b=0e0e0e)

  


> SVG2JSX：https://svg2jsx.com/

  


如果你不想使用像 SVG2JSX 这样的在线工具来转换 SVG 代码，你也可以考虑在项目的工程中配置 [SVGR](https://react-svgr.com/playground/)，它也能自动化将 SVG 转换为符合 JSX 语法格式的代码，并且还提供了 Prettier 配置以及整个过程中对 SVG 进行优化。我曾在小册的《[SVG 与 Web 开发之 SVG 在 React 的应用](https://juejin.cn/book/7341630791099383835/section/7368317806100054043)》课程中向大家介绍过 SVGR 的使用，这里就不再花时间复述！

  


我们在使用 SVG 的时候，尤其是将 SVG 作为[剪切路径](https://juejin.cn/book/7341630791099383835/section/7362748816769941540)或[遮罩图形](https://juejin.cn/book/7341630791099383835/section/7366549423813296165)时，需要将 SVG 图形中的绝对单位转换为相对单位，这样更易于适配不同尺寸的元素。如果碰到这方面的需求，推荐你使用 [@yoksel 的 “Convert SVG absolute clip-path to relative”](https://yoksel.github.io/relative-clip-path/)，一款非常不错的小工具，它能将剪切路径中的绝对值转换为相对值：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d8f85f2745c49348ed34c7e5f7258bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3322&h=1786&s=634954&e=jpg&b=fefefe)

  


> Relative Clip-path：https://yoksel.github.io/relative-clip-path/

  


上面介绍的都是从一种数据转换成另一种数据格式。接下来，我们来看图像格式之间的转换，这种需求可能不多，但偶尔你也可能会有这方面的需求。例如，将 JPG 或 PNG 格式的位图转换为 SVG 格式的图像。

  


如果你在之后的开发过程中真碰到这方面的需求，可以考虑使用 [SVGurt](https://svgurt.com/#/) 工具，它是一款开源的图像转换为 SVG 的工具，提供了许多控件和调节选项，你可以根据需要调整这些参数，最终转换成符合你需求的 SVG：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49464f69aea547c2bc51796ce73f2be5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3330&h=1800&s=855888&e=jpg&b=f6f6f6)

  


> SVGurt：https://svgurt.com/#/

  


你也可以使用 [PicSVG](https://picsvg.com/)，它也可以将位图转换为 SVG：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b7efcda43bb478fa0f96fa52dbbc29f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3294&h=1178&s=1219263&e=jpg&b=f0f0f0)

  


> PicSVG：https://picsvg.com/

  


## SVG 动画工具

  


SVG 的美妙之处在于它的本质：你可以直接通过代码进行路径动画、过渡和形态变换，甚至可以组合多个动画效果。然而，我们不必每次都从头写动画。[Vivus Instant 是一个简单的工具](https://maxwellito.github.io/vivus-instant/)，允许你对 SVG 路径进行动画化。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d34ff32767e4c17b4fd8ecd52cb3b93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3316&h=1762&s=408666&e=jpg&b=f4f4f4)

  


> Vivus Instant：https://maxwellito.github.io/vivus-instant/

  


你也可以使用由 [@Sergej Skrjanec和 @Ana Travas开发免费工具 SVGArtista](https://svgartista.net/)，它包含了一些基本的填充和描边动国效果。你也可以定义动画的缓动函数、方向、持续时间和延迟时间等：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6c17d9efbe2421f88c73b179d688fb5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=736&s=517607&e=gif&f=74&b=eeeeee)

  


> SVGArtista：https://svgartista.net/

  


如果你要给 SVG 添加比较复杂的动画，那么 [SVGator](https://www.svgator.com/) 将是首选。它是一款专门用于 SVG 动画的编辑器，提供了丰富的功能。有点类似于 AE 软件。不过，该工具需要付费，免费版本功能非常有限：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1ccda619bda4a1a8676f74c198e34cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1642&h=674&s=1093043&e=gif&f=40&b=000815)

  


> SVGator：https://www.svgator.com/

  


如果你喜欢直接使用代码进行动画制作，那么 [GSAP](https://greensock.com/gsap/) 是一个极好的工具，它允许你使用 JavaScript 对 SVG 、CSS 属性、React 、Canvas 或其他内容进行动画化。此外，你也可以看看 [SVG.js](https://svgjs.dev/)，它是一个轻量级的工具，专门用于操作和动画化 SVG。如果你想要类似于 AE 的高质量动画效果，那么 [Lottie](https://airbnb.design/lottie/) 绝对值得一试，无论是在 Web 上还是在 iOS 和 Android 平台上，都能创建出非常丰富的 SVG 动画。

  


这里所提到的仅仅是 JavaScript 动画库的一小部分，如果你想了解更多的，可以用于 SVG 动画创作的动画库，可以移步阅读《[精通 Web 动画：探索最佳 Web 动画库](https://juejin.cn/book/7288940354408022074/section/7308624219628109835#heading-12)》！

  


## SVG 资源管理器

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baa598c6d5c742f4afbccbbedf589e4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3314&h=1784&s=636213&e=jpg&b=ffffff)

  


我想应该有不少同学有类似的困惑与烦恼！当你有大量的 SVG 文件，应该如何管理它们？如何知道哪里有什么，如何轻松找到所需要的 SVG ？[SVGX](https://svgx.app/) 是一款免费的桌面 SVG 资源管理器，可以帮助你将所有 SVG 文件集中管理。你可以书签标记、搜索和预览 SVG 图标，在线编辑 SVG 标记，并通过一键复制粘贴 SVG 和 CSS。默认情况下，它还使用 SVGO 对 SVG 进行优化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3712f26db05247dd9cd263064d0eb5b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2786&h=1418&s=233168&e=jpg&b=fefefe)

  


> SVGX：https://svgx.app/

  


## 小结

  


Web 上有成百上千的资源，我们希望这里列出的一些资源能在你的日常工作中派上用场，尤其是帮助你避免一些耗时的例行任务。最后再向大家推荐[ fffuel.co](https://www.fffuel.co/) ，是一个色彩工具和免费 SVG 生成器的集合，适用于渐变、图案、纹理、形状和背景：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79eb8ee663974248ba5bee12d4a090e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1053&s=264515&e=jpg&b=050c3e)

  


> fffuel.co：https://www.fffuel.co/