![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3b0f2d07bed4faa829f5e38769463d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=645&s=20038&e=jpg&b=b472d0)

  


模糊和阴影效果在 Web 设计中扮演着关键角色，远非仅仅是装饰性的设计元素。它们不仅能赋予界面元素深度和现代感，还能有效地引导用户注意力，提升整体视觉吸引力和用户操作的友好性。尽管现代 `CSS` 提供了诸如 `box-shadow`、`drop-shadow()`、`blur()` 和 `backdrop-filter` 等特性，但它们在实现复杂模糊和阴影效果时存在一定的局限性。

  


幸运的是，SVG 滤镜技术为增强 Web 视觉效果提供了强大而灵活的解决方案。其中，模糊和阴影效果是最为突出和广泛应用的技术之一。通过利用 SVG 滤镜功能，如 `<feGaussianBlur>`、`<feDropShadow>` 、 `<feSpecularLighting>` 、 `<feDiffuseLighting>` 、`<feComposite>` 、`<feOffset>` 和 `<feMerge>` 等，Web 开发者能轻松为网页元素添加精细的模糊效果和复杂的阴影效果，远远超越了现代 CSS 的功能限制。

  


在这节课中，我们将深入探讨如何利用 SVG 滤镜技术创建高度定制的模糊效果，并实现各种类型的阴影效果，从简单的投影到复杂的内阴影，甚至包括与元素透明度交互响应的动态效果。通过深入理解 SVG 滤镜的工作原理，以及如何巧妙结合不同的滤镜效果，你将能够为 Web 设计带来全新的视觉层次和动态交互体验。这些技术不仅能够增强用户界面的美观性，还能提升用户体验和操作的直观性，为现代 Web 设计开辟出更广阔的创新空间。

  


## Web 上的模糊与阴影效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/665fb9b65cd74b5d873fc9bb463d68bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1200&s=875662&e=png&b=030303)

  


> [图片由 @Seddik walid 提供](https://dribbble.com/shots/15900095-Glow-up-Photographe-studio-web-design)！

  


我想你和我有同样的感觉，在 Web 上随处都可见到带有模糊和阴影等效果的 UI 视觉元素。这是因为，在现代 Web UI 设计中，模糊和阴影效果已经成为突出视觉层次和增强用户体验的重要元素之一。Web 设计将模糊和阴影加入设计中是有其独特的原因——它们帮助在界面中创建视觉提示，让人类大脑能够理解正在查看的用户界面元素。

  


在 Web 界面设计中，模糊效果不仅仅是为了美观，更是为了突出重要内容和优化体验。通过将背景或部分元素模糊化，可以有效凸显前景内容、使得文字、图标等元素更加突出清晰，从而提升阅读体验和视觉焦点的集中度。动态模糊效果的运用、如滚动模糊和动画过渡中的模糊，不仅增加了界面的生动感和现代感，还可以提升用户对内容变化的感知和互动的乐趣。例如 iOS 系统中很多界面都有模糊效果的身影，也就是大家常说的磨砂效果或玻璃效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/123f0abaf98e4fc1a3a25461aed03e3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1200&s=62916&e=webp&b=711423)

  


同样的，阴影效果在 Web 界面设计中也扮演着关键角色，它为元素增添了深度和立体感，使得界面元素更加真实和具有触感。通过合理的阴影设置，可以清晰地突出各个界面元素之间的关系和层次，例如按钮、卡片、弹出框等，从而使用户界面看起来更加整洁、有序和易于理解。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cc3686ad7754546bebcd65e92b6f20c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1080&s=56479&e=png&b=242424)

  


例如，**[Google 的 Material Design 设计系统](https://material.io/)** 是 Web 阴影设计中最典型案例。我想你肯定感受到了 Material Design 中阴影给 Web UI 带来的美感，因为在 Google 的产品上，几乎都能看到这样的设计：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22b2cd49fcbb4f70945e5da51e5a9afc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=882&s=140229&e=jpg&b=e9ebed)

  


除此之外，内阴影的应用也为设计师提供了更多创造性的可能，例如在按钮按下时的内嵌效果或者选项卡的深度感应用，都能够有效提升用户操作的直观性和互动的体验感。其中，Neumorphism UI （拟物化用户界面）就是内阴影的经典案例之一：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25db226c61b5477c90713d704baa5366~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=750&s=1036489&e=png&a=1&b=dde5ef)

  


随着 Web 技术的进步和浏览器支持的增强，模糊和阴影效果的应用空间也在不断扩展和创新。未来，随着更多的交互式设计趋势和响应式布局的发展，模糊和阴影效果将继续发挥重要作用，成为设计师打造现代化、功能强大的用户界面的重要工具。通过综合运用艺术美学与功能优化，模糊和阴影效果将继续为 Web UI 设计带来更多的创新和实用价值，为用户提供更加流畅和愉悦的使用体验。

  


因此，作为一名专业且优秀的 Web 开发者，必须精通阴影和模糊效果的制作，能够随时灵活应对这些方面的新需求。掌握和运用这些技巧不仅是一种能力的体现，也是保持竞争优势的关键之一。

  


我们先从模糊效果开始聊起！

  


## 创建模糊效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6800bd0a067d47fb8a0efde4346f2660~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3314&h=1638&s=787593&e=jpg)

  


> URL:https://www.freepik.com/vectors/glassmorphism-ui-design

  


我们以流行的磨砂玻璃效果为例，因为它是 Web 上模糊效果的典型案例之一！社区里时上图这种 UI 效果有多种不同的称呼，即磨砂玻璃（Frosted Glass）、Glass UI 和 Glassmorphism UI。从 UI 视觉呈现的出的效果上看并无差异，甚至可以说是同样的。它们之间的关系是：

  


Glassmorphism 是一种设计风格，强调使用透明度和模糊效果，让界面元素看起来像是半透明的玻璃。这个概念由 [@Michal Malewicz](https://x.com/michalmalewicz) 提出，旨在统一和连接所有使用“磨砂玻璃”效果的 UI 设计。

  


[Glass UI](https://ui.glass/) 是一个基于玻璃拟态（Glassmorphism）设计原则的现代 CSS 用户界面库。其主要目标是帮助设计师和开发者快速创建美观的网站和应用程序。Glass UI 提供了一系列预设的样式和组件，简化了设计和开发过程，使得即使是没有太多设计经验的开发者也能够轻松创建出美观的界面。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f7d87da930b4daf8284015e9ec922cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1412&h=590&s=3570474&e=gif&f=106&b=c1d0ce)

  


> URL:https://ui.glass/

  


Frosted Glass 是 Glassmorphism 设计风格中的核心视觉效果之一。Glassmorphism 通过使用 Frosted Glass 效果来实现其独特的视觉体验。因此，Frosted Glass 是实现 Glassmorphism UI 的一种技术手段。

  


简单地说：

  


-   **Glassmorphism UI**：一种设计风格，使用透明度和模糊效果，营造出半透明玻璃的视觉效果
-   **Glass UI**：一个基于 Glassmorphism 设计原则的 CSS 库，帮助开发者快速创建美观的界面
-   **Frosted Glass**：一种具体的视觉效果，表现为半透明和模糊，是 Glassmorphism UI 的核心效果之一

  


Glass UI 利用 Glassmorphism 的设计原则，通过实现 Frosted Glass 效果，帮助开发者快速创建现代、美观的用户界面。这三者之间相互关联，组成了一个完整的设计和开发体系。

  


### CSS 创建磨砂玻璃效果的局限性

  


通常情况之下，Web 开发者会使用 `backdrop-filter` 或 `filter` 属性来制作磨砂玻璃效果。例如[ Glass UI 提供的生成工具](https://ui.glass/generator/)采用的就是 `backdrop-filter` 属性：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1978b08a82b04c3e927838760a2b04ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1264&h=740&s=10326440&e=gif&f=155&b=fdfdfd)

  


> URL: https://ui.glass/generator/

  


我们来看一个真实的案例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a9c913f130948808e90f238244690ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1138&h=584&s=6410001&e=gif&f=127&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/GRayMRV

  


从呈现的效果上看，两者之间有明显的差异，而且在代码也有所差异。因为 CSS 的 `filter` 属性会影响其所有后代元素，所以你需要为磨砂玻璃效果提供单独的层，例如伪元素 `::after` 。下面是这两个效果的关键代码：

  


```HTML
<div class="card backdrop-filter">
    <img src="https://picsum.photos/id/85/300/400" alt="">
    <div class="card__content">
        <h2 class="title">Backdrop Filter</h2>
        <p class="copy">Check out all of these gorgeous mountain trips with beautiful views of, you guessed it, the mountains</p>
        <button class="button">View Trips</button>
    </div>
</div>

<div class="card filter">
    <img src="https://picsum.photos/id/85/300/400" alt="">
    <div class="card__content">
        <h2 class="title">CSS Filter</h2>
        <p class="copy">Check out all of these gorgeous mountain trips with beautiful views of, you guessed it, the mountains</p>
        <button class="button">View Trips</button>
    </div>
</div>
```

  


```CSS
.backdrop-filter .card__content {
    backdrop-filter: blur(5px) saturate(65%);
    background-color: rgba(255, 255, 255, 0.3);
}
  
.filter .card__content::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: url("https://picsum.photos/id/85/300/400") 0% calc(-100% + 3.5rem) / cover;
    filter:  blur(5px) saturate(65%);
}
  
.filter:hover .card__content::after {
    background-position: 0 0;
}
```

  


正如你所看到的，CSS 和 `filter` 和 `backdrop-filter` 是可以用于创建磨砂玻璃的视觉效果。然而，这些功能在某些方面存在一些缺陷和不足之处，特别是在复杂的视觉效果和动态交互中可能显得有限。

  


-   CSS 的 `filter` 属性可以应用于元素本身，但它的模糊效果通常是静态的，并且对元素周围的其他内容不会产生影响。这意味着使用 `filter` 创建的磨砂玻璃效果在视觉上可能缺乏深度和交互性，无法实现与其他元素的实时交互效果
-   CSS 的 `backdrop-filter` 属性允许在元素背景上应用模糊效果，这使得可以创建一些复杂的背景模糊效果，但它在浏览器兼容性上存在问题，不同浏览器的支持程度不一致，而且性能可能受到影响，尤其是在动画和复杂布局中。

  


相比而言，SVG 的高斯模糊滤镜（`<feGaussianBlur>`）提供了更高级的图像处理能力。高斯模糊滤镜可以精确控制模糊程度和效果的范围，还可以与 SVG 的其他功能结合使用，例如 `<feMerge>` 和 `<feComposite>`，从而创建出更加复杂和动态的效果。

  


除此之外，SVG 的滤镜功能在现代浏览器中得到了广泛支持，并且性能较为稳定，能够处理复杂的动画和交互效果。也就是说，对于需要实现高度定制化、复杂动态效果的磨砂玻璃效果，使用 SVG 的高斯模糊滤镜是一个更为可靠和强大的选择。

  


### 使用 `<feGaussianBlur>` 创建磨砂玻璃效果

  


在开始使用 `<feGaussianBlur>` 创建磨砂玻璃效果之前，我们先了解一下 `<feGaussianBlur>` 滤镜。

  


`<feGaussianBlur>` 是 SVG 滤镜中较为简单的一个滤镜基元，它一种基于[高斯函数](https://en.wikipedia.org/wiki/Gaussian_function)的模糊技术，能平滑图像的细节，使图像看起来更加柔和。简单地说，我们可通过调整 `<feGaussianBlur>` 滤镜基元的 `stdDeviation` 属性来调整图像的模糊大小，值越大，模糊效果越强。可以是一个数值（对 `x` 和 `y` 方向同时生效），也可以是两个数值（分别指定 `x` 和 `y` 方向的模糊程度）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27a1a618a98a4b5cbb3732e54d5b1922~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=638&s=13308297&e=gif&f=219&b=f6f5f5)

  


> URL: https://yoksel.github.io/svg-filters/#/

  


要是用 SVG 代码来描述的话，大致像下面这样：

  


```XML
<svg>
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feGaussianBlur stdDeviation="15 14"  in="SourceGraphic"  result="BLUR" />
        </filter>
    </defs>
</svg>
```

  


如果上面这段 SVG 代码放到你的页面中，那么你就定义了一个名为 `#filter>` 的滤镜，并使用 CSS 的 `filter` 属性的 `url()` 函数引用该滤镜。

  


```CSS
.filtered {
    filter: url(#filter);
}
```

  


有了这个基础之后，我们就可以尝试着将 SVG 滤镜创建的高斯模糊效果应用到之前的卡片示例中：

  


```CSS
.svg-filter .card__content::after{
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: url("https://picsum.photos/id/85/300/400") 0% calc(-100% + 3.5rem) / cover;
    filter: url(#filter) saturate(65%);
}
  
.svg-filter:hover .card__content::after {
    background-position: 0 0;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5de21bdcd024f809e40c26baeb365cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1196&h=640&s=13939782&e=gif&f=242&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/MWdrOvx

  


再来看一个带有磨砂玻璃效果的进度环：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3788549d518348a28316521381827fc2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=762&s=3180474&e=gif&f=173&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/rNgppBO

  


在这个效果中，我们使用了两个 `<filter>` 元素，定义了两个高斯模糊的效果：

  


```XML
<filter id="glass-glow">
    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
</filter>
    
<filter id="glass2-blur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
</filter>
```

  


稍微熟悉进度条制作的开发者都知道，整个进度条分两个部分组件，进度条轨道和当前状态：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30bd7d23a70e46389547058ffdd2d45e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=429717&e=jpg&b=060606)

  


通常情况之下，我们会使用两个圆 `<circle>` 或 `<path>` 元素绘制的形状来表示这两种状态。不过，在这个示例中，是通过多个圆（`<circle>`）相互组合，构建成带有一点层次感的进度条形状，并且些圆的描边（`stroke`）都不是纯色，而是由 SVG 的 `<linearGradient>` 或 `<radialGradient>` 定义的渐变色：

  


```XML
<svg class="progress" viewBox="0 0 270 270" width="270" height="270">
    <defs>
        <radialGradient id="glass1" r="1">
            <stop stop-color="hsl(0 0% 100% / 0.05)" offset="0.4" />
            <stop stop-color="hsl(0 0% 100% /0.35)" offset="1" />
        </radialGradient>
        <linearGradient id="glass2" x1="0" y1="0" x2="0.75" y2="1">
            <stop stop-color="hsl(0 0% 100% / 0.3)" offset="0" />
            <stop stop-color="hsl(0 0% 100% / 0.08)" offset="1" />
        </linearGradient>
        <linearGradient id="glass3" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="hsl(0 0% 100% / 0.3)" offset="0" />
            <stop stop-color="hsl(0 0% 100% / 0)" offset="0.5" />
        </linearGradient>
        <linearGradient id="glass4" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="hsl(0 0% 100% / 0)" offset="0.6" />
            <stop stop-color="hsl(0 0% 100% / 0.3)" offset="1" />
        </linearGradient>
        <radialGradient id="glass5" r="1">
            <stop stop-color="hsl(0 0% 0% / 0.2)" offset="0.45" />
            <stop stop-color="hsl(0 0% 0% / 0)" offset="0.55" />
        </radialGradient>
        <linearGradient id="glass6" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="hsl(0 0% 100% / 0.15)" offset="0" />
            <stop stop-color="hsl(0 0% 100% / 0)" offset="0.3" />
        </linearGradient>
        <linearGradient id="glass7" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="hsl(0 0% 100% / 0)" offset="0.7" />
            <stop stop-color="hsl(0 0% 100% / 0.1)" offset="1" />
        </linearGradient>
        <clipPath id="glass8">
            <circle cx="135" cy="135" r="125" />
        </clipPath>
        <!-- 高斯模糊滤镜 -->
        <filter id="glass-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
        <filter id="glass2-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
    </defs>
    <g fill="none">
        <!-- 进度条完成的进度 -->
        <g transform="rotate(-90,135,135)" class="progress__schedule">
            <circle class="progress__ring" r="105" cx="135" cy="135" stroke-dasharray="659.74 659.74" stroke-dashoffset="659.74" stroke-width="40" />
            <g filter="url(#glass-glow)" stroke-linecap="round" stroke-width="4" opacity="0.6">
                <circle class="progress__ring-glow1" r="80" cx="135" cy="135" stroke-dasharray="502.66 502.66" stroke-dashoffset="502.66" />
                <circle class="progress__ring-glow2" r="130" cx="135" cy="135" stroke-dasharray="816.82 816.82" stroke-dashoffset="816.82" />
            </g>
        </g>
        <!-- 进度条轨道 -->
        <g class="progress__track">
            <circle stroke="url(#glass1)" stroke-width="40" r="105" cx="135" cy="135" />
            <circle filter="url(#glass2-blur)" stroke="url(#glass2)" stroke-width="9" r="105" cx="135" cy="135" />
            <circle stroke="url(#glass3)" stroke-width="1" r="109" cx="135" cy="135" />
            <circle stroke="url(#glass4)" stroke-width="1" r="101" cx="135" cy="135" />
            <circle stroke="url(#glass5)" stroke-width="14" r="92" cx="135" cy="135" />
            <circle stroke="url(#glass6)" stroke-width="2" r="86" cx="135" cy="135" />
            <circle stroke="url(#glass7)" stroke-width="4" r="87" cx="135" cy="135" />
            <circle clip-path="url(#glass8)" stroke="hsl(var(--hue) 90% 10% / 0.1)" stroke-width="4" r="125" cx="135" cy="142" />
        </g>
    </g>
    <text id="progress__percent" fill="currentcolor" font-size="48" text-anchor="middle" x="135" y="151" data-percent></text>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c85634e454ed442f99547e883210f6f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=640884&e=jpg&b=090909)

  


仔细对比应用滤镜前后的效果。当然，完成整个效果还需要一些 CSS 和 JavaScript 代码，这里就不贴出来了，因为它们并不复杂，感兴趣的可以阅读案例源码。

  


请注意，尽管前面的例子展示了高斯模糊用于创建磨砂玻璃效果，但这并不意味着它的应用局限于此。接下来的案例将进一步展示高斯模糊在其他场景中的多样应用。期待你的探索和发现！

  


## 创建阴影效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ba294ad2251417993abfa074031f81a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=720&s=32121&e=jpg&b=abd4e9)

  


在 CSS 的世界中，[它为 Web 开发者提供了多个特性为 Web 元素添加阴影效果](https://juejin.cn/book/7199571709102391328/section/7199844993455325216)。例如：

  


-   `text-shadow` 属性给元素文本内容添加阴影
-   `box-shadow` 属性给元素框添加阴影
-   `drop-shadow()` 函数给元素内容或元素框添加阴影

  


然而，在实际开发过程中，这些属性都或多或少有一定的局限性。例如 `box-shadow` 属性，它遵循元素的矩形外边缘，而不是我们想要的 SVG 元素的边缘。换句话说，如果你使用 `box-shadow` 给一个图标添加阴影效果，最终呈现的效果并不是你所期望的：

  


```CSS
.icon--cat {
    box-shadow: .2em .2em .2em .2em rgb(255 255 255 / .5);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/964d8ae17f5548ffbc6c3addb6d1e6ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=334934&e=jpg&b=050505)

  


注意，如果 Icon 图标使用的是字体图标，那么使用 `text-shadow` 给图标添加阴影总是可用的。也确实可以工作，但让我们把更多的注意力放在 `box-shadow` 属性的局限性上。

  


除此之外，如果你使用 `box-shadow` 给一个元素组添加阴影效果，最终呈现的结果也将是不尽人意的。例如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4d7f5a95c374462ab25b20b27ea9515~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=876&s=750833&e=jpg&b=fefefe)

  


当然，面对诸如上面这两种情景，你可能会考虑使用 `filter` 的 `drop-shadow()` 函数来给 SVG 图标，不规则图形或元素组添加阴影效果：

  


```CSS
.svg-icon {
    filter: drop-shadow(0.35rem 0.35rem 0.4rem rgba(0, 0, 0, 0.5));
}

.element--group {
    filter: drop-shadow(0.35rem 0.35rem 0.4rem rgba(0, 0, 0, 0.5));
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c016cf56bd74de2885e952c5d10f929~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1817&s=998659&e=jpg&b=fefefe)

  


虽然 `drop-shadow()` 函数的出现让 Web 开发者多了一种选择——可以为不规则图形设置阴影效果，但它和 `box-shadow` 属性一样，无法直接给元素设置内阴影。以 `box-shadow` 属性为例，它就无法直接给诸如 `<img>` 、`<iframe>` 和 `<video>` 等可替换元素设置内阴影：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e36ac6e7841d4213b49f5b21ca1607d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=526&s=8234648&e=gif&f=299&b=4a4968)

  


> Demo 地址：https://codepen.io/airen/full/NWVXzdR

  


[虽然有一些 Hack 手段可以帮助我们避免这些现象出现](https://juejin.cn/book/7199571709102391328/section/7199844993455325216)，但有一些场景即便是通过各种 Hack 手段，也未必能实现我们所期望的内阴影效果，例如给不规则图形设置内阴影以及给 SVG 图形或图标设置内阴影。既然如此，为何不考虑使用 SVG 滤镜来创建阴影效果呢？

  


是的，我们可以借助 SVG 滤镜来创建各种所需要的阴影效果。为了能让大家更好的理解如何使用 SVG 滤镜创建阴影效果，我们先从简单的 `<feDropShadow>` 滤镜开始！

  


### 使用 `<feDropShadow>` 滤镜创建阴影效果

  


`<feDropShadow>` 滤镜基元看上去和 CSS 的 `filter` 的 `drop-shadow()` 函数非常相似。的确如此，之前我们提到过，CSS `filter` 属性中的滤镜函数都是 SVG 滤镜基元的简捷方式，你可以理解成 SVG 滤镜的阉割版。这意味着，`drop-shadow()` 函数所具备的功能，`<feDropShadow>` 滤镜基元都具备，而且还更强大：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2de8657833d45aba5333d77db4457a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=640&s=4881592&e=gif&f=315&b=f3f3f3)

  


> Demo 地址：https://yoksel.github.io/svg-filters/#/

  


正如上图所示，我们可以通过 `<feDropShadow>` 提供的属性和功能更精细的控制阴影的模糊程度、颜色和透明度：

  


-   **`dx`** 和 **`dy`**：控制阴影的水平和垂直偏移量
-   **`stdDeviation`**：设置阴影的模糊程度。值越大，阴影越模糊。它可以接受两个值，第一个值表示阴影在水平方向（`x` 轴）模糊程度，第二个值表示阴影在垂直方向（`y` 轴）模糊程度。如果省略第二个值，则表示阴影在 `x` 轴和 `y` 轴的模糊程度相同
-   **`flood-color`**：指定阴影的颜色
-   **`flood-opacity`**：设置阴影颜色的透明度

  


我们来看一个简单的示例。假设我们在 HTML 中使用 `<feDropShadow>` 创建了一个 `shadow` 阴影滤镜：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="shadow" color-interpolation-filters="sRGB">
            <feDropShadow dx="4" dy="4" stdDeviation="4" flood-color="#fff" flood-opacity="0.75" in="SourceGraphic" result="DROPSHADOW" />
        </filter>
    </defs>
</svg>
```

  


简单的解释一下上面的代码：

  


-   **`dx="4"`** ：表示阴影在水平方向上的偏移量为 `4` 个用户单位。正值表示向右偏移，负值表示向左偏移
-   **`dy="4"`** ：表示阴影在垂直方向上的偏移量为 `4` 个用户单位。正值表示向下偏移，负值表示向上偏移
-   **`stdDeviation="4"`** ：表示阴影的模糊半径为 `4` 个用户单位
-   **`flood-color="#fff"`** ：指定阴影的颜色是 `#fff` 。如果不指定颜色，默认为黑色
-   **`flood-opacity="0.75"`** ：指定阴影的透明度，值范围从 `0 ~ 1` 。示例中 `0.75` 表示 `75%` 的不透明度，即阴影只有 `25%` 的透明度

  


它与 CSS 的 ` drop-shadow(4px 4px 4px rgb(255 255 255  ``/ .75``))` 效果有点相似：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e7776d99bfe48d890e31f3de1a060d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=262419&e=jpg&b=060606)

  


同样地，`<feDropShadow>` 创建的阴影也可以用于元素组。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b48fba32700a49cdb0a99864938a6d2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=792743&e=jpg&b=fbf9f9)

  


> Demo 地址：https://codepen.io/airen/full/pompKOp

  


然后，`<feDropShadow>` 滤镜并不是一个基本的滤镜，它是由多个更简单的滤镜效果组合而成的，而且相当复杂。换句话说，`<feDropShadow>` 滤镜基元的几个关键属性的功能对应着其他几个更简单的滤镜：

  


-   `stdDeviation` ：将转发到内部 `<feGaussianBlur>` 滤镜基元的 `stdDeviation` 属性
-   `dx` 和 `dy` ：分别转发到内部 `<feOffset>` 滤镜基元的 `dx` 和 `dy` 属性
-   `flood-color` ：将转发到内部 `<feFlood>` 滤镜基元的 `flood-color` 属性
-   `flood-opacity` ：将转发到内部 `<feFlood>` 滤镜基元的 `flood-opacity` 属性

  


这意味着，任何一个由 `<feDropShadow>` 滤镜基元创建的阴影效果，都可以通过 `<feGaussianBlur>` 、`<feFlood>` 、`<feOffset>` 等滤镜基元组合而成。例如，下面两个滤镜最终效果是一致的：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="shadow" color-interpolation-filters="sRGB">
            <feDropShadow dx="4" dy="4" stdDeviation="4" flood-color="#fff" flood-opacity="0.75" in="SourceGraphic" result="DROPSHADOW" />
        </filter>
        
        <filter id="shadow2" color-interpolation-filters="sRGB">
            <feGaussianBlur stdDeviation="4" in="SourceAlpha" result="BLUR" />
            <feOffset dx="4" dy="4" in="BLUR" result="OFFSET" />
            <feFlood flood-color="#fff" flood-opacity="0.75" in="OFFSET" resutl="FLOOD" />
            <feComposite in="FLOOD" in2="OFFSET" operator="in" result="COMPOSITE" />
            <feMerge>
                <feMergeNode in="COMPOSITE" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/112b864fc4b245d28e39cb9f67d5ba6e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=264206&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/abrEjgZ

  


这仅仅实现了一个普通的投影效果，即元素在下方投射阴影。要修改它以实现内阴影，即元素“被切除”，光源从内部投射阴影。虽然不难，但你必须了解原始阴影的所有细微之处。

  


> 阴影是一门复杂而又深奥的学科，它与**光** 、**颜色** 、**投影** 、**形体** 、**光源定位** 、**阴影分层** 和 **阴影模糊度** 等都有关。只不过，这些理论知识已超出这节课的范畴，因此不在这里做过多的阐述。

  


我们还是从实际出发，如何使用 SVG 滤镜创建内阴影。例如，我们要给 Twitter 图标添加内阴影效果：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon--twitter">
    <path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/>
</svg>
```

  


```CSS
.icon--twitter {
    fill: #4691f6;
    filter: url("#inset-shadow");
}
```

  


让我们开始关键部分：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="inset-shadow" color-interpolation-filters="sRGB">
            <feComponentTransfer in="SourceAlpha" result="INVERSE">
                <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur in="INVERSE" result="BLUR__INVERSE" stdDeviation="4" />
            <feOffset dx="5" dy="5" in="BLUR__INVERSE" result="OFFSET__BLUR__INVERSE" />
            <feFlood flood-color="rgb(20 0 0)" in="OFFSET__BLUR__INVERSE" result="BLUR__COLOR" />
            <feComposite in="BLUR__COLOR" in2="OFFSET__BLUR__INVERSE" operator="in" result="COMPOSITE__10" />
            <feComposite in="COMPOSITE__10" in2="SourceAlpha" operator="in" result="COMPOSITE__20" />
            <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="COMPOSITE__20" />
            </feMerge>
        </filter>
    </defs>
</svg>
```

  


上面代码呈现的效果如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17fc71cf176046b2b431bb2ce9dd7e23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=286713&e=jpg&b=108579)

  


> Demo 地址：https://codepen.io/airen/full/mdYpGVL

  


让我们逐步分析这段代码。

  


`<feComponentTransfer>` 滤镜基元使用 `in="SourceAlpha"` 获取源图形的 Alpha 通道，并对其进行反转。普通的投影阴影使用图形的正常 Alpha 通道，对其进行模糊和偏移以生成阴影。在这里，源图形本身不会投射阴影，而是其他所有东西，因此我们需要反转其 Alpha 通道。这样我们得到的图像在图形实心处是透明的，在图形透明处是实心的，我们将其转换为阴影：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0864596aaef246fe9c4e476c843b4662~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=460115&e=jpg&b=0f8579)

  


`<feGaussianBlur>` 滤镜基元对该图像（`<feComponentTransfer>` 滤镜基元的结果）进行模糊处理，为创建阴影做准备，然后使用 `<feOffset>` 将其稍微偏移，使光源似乎来自侧面：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55cb8171771d460fb3799bbcf46125c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=394933&e=jpg&b=0f8579)

  


接下来，使用 `<feFlood>` 滤镜给阴影上色。当我们获取 `SourceAlpha` 时，它会给我们一个纯黑色图像，其 Alpha 通道与源图像相同。如果我们需要黑色阴影，这很好用，但如果我们想要给它上色，就需要做一些工作。在这种情况下，你可以使用 `<feFlood>` 滤镜基元设置任何你喜欢的阴影颜色，不过在我们示例中使用的是黑色 `rgb(20 0 0)` 。注意，这个时候整个滤镜区域填充了一个黑色矩形，你并看不到 Twitter 图标：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cfcb95baf9e4785ba0e6eda6396a3bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=279383&e=jpg&b=0f8579)

  


不用担心，我们可以使用 `<feComposite>` 滤镜基元将其裁剪为仅与模糊阴影重叠的部分。`<feComposite>` 滤镜操作符（`operator`）有很多种类型，我们在这里使用 `in` ，将 `in="BLUR__COLOR"` 和 `in2="OFFSET__BLUR__INVERSE"` 重叠部分显示出来，`in2` 图像的实体部分让 `in` 图像显示出来，透明部分阻止它。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/527984e41bd444f3b8a3fdd1563908fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=346783&e=jpg&b=108579)

  


这给我们提供了正确颜色的模糊。然后我们再次使用 `<feComposite operator="in">`，这次使用 `SourceAlpha` 作为 `in2` ，并将第一个 `<feComposite>` 的结果（`result`）作为 `in` 的值。这样做减少了大部分模糊效果，只留下与源图像重叠的部分。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18501ea8cc5a4f36b1174106e690ba3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=341979&e=jpg&b=0f8579)

  


最后，我们使用 `<feMerge>` 和预定义的 `SourceImage` 值将阴影和源图像合并，使阴影位于顶部。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac1875499b1e4e3281632d4c0df355a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=347394&e=jpg&b=0f8579)

  


> Demo 地址：https://codepen.io/airen/full/mdYpGVL

  


你可能已经发现了，在制作内阴影的所有滤镜基元中并没有 `<feDropShadow>` 。是的，因为只使用 `<feDropShadow>` 是无法直接实现内阴影的，这正如 `drop-shadow()` 无法实现内阴影是一样的。庆幸的是，在 SVG 滤镜中，我们组合多个不同的滤镜基元，可以轻松实现内阴影的效果。

  


另外，还需要知道的是，上面这个示例仅仅是创建内阴影的一种方式，在 SVG 滤镜中，只要用好了 SVG 的各个滤镜基元，创建内阴影的滤镜组合就有多种组合方式。例如：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="inset-shadow" color-interpolation-filters="sRGB">
            <!-- 阴影偏移 -->
            <feOffset dx="0" dy="0" />
        
            <!-- 阴影模糊 -->
            <feGaussianBlur stdDeviation="4" result="offset-blur" />
        
            <!-- 反转投影以形成内阴影 -->
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          
            <!-- 切割阴影内的颜色 -->
            <feFlood flood-color="black" flood-opacity=".95" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
        
            <!-- 将阴影放在元素上 -->
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
    </defs>
</svg>
```

  


这里有四个不同的滤镜基元，每个原滤镜基元执行不同的功能，但结合起来，它们实现了一个内阴影。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f8ccb291835451392d8e982495fdf51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1289&s=482786&e=jpg&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/pompxoR

  


使用这种方式创建的内阴影也可以用于诸如 `img` 、`video` 这样的可替代元素上：

  


```XML
<img src='https://picsum.photos/800/600?random=1' alt='' class="figure" />

<svg class="sr-only">
    <defs>
        <filter id="inset-shadow" color-interpolation-filters="sRGB">
            <feOffset dx="0" dy="0" in="SourceGraphic" result="OFFSET" />
            <feGaussianBlur stdDeviation="14" in="OFFSET" result="BLUR" />
            <feComposite operator="out" in="SourceAlpha" in2="BLUR" result="COMPOSITE" />
             <feColorMatrix values="
                 0 0 0 0 1 
                 0 0 0 0 .271
                 0 0 0 0 0
                 0 0 0 1 0" in="COMPOSITE" result="COLORMATRIX" />
            <feBlend in2="SourceGraphic" in="COLORMATRIX" />
        </filter>
    </defs>
</svg>
```

  


```CSS
.figure {
    filter: url(#inset-shadow);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9652eea33ccb40ecba27034f1c20d63f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=519738&e=jpg&b=108579)

  


> Demo 地址：https://codepen.io/airen/full/xxNpyVJ

  


## SVG 滤镜中的光照效果

  


之前我们提到过，阴影效果也会受到光的影响。既然如此，我们就顺便了解一下 SVG 滤镜中的光照效果。在 SVG 中，我们可以使用 `<feSpecularLighting>` 和（或）`<feDiffuseLighting>` 滤镜基元来应用光照效果，然后通过下面三种光源之一来控制光照细节：`fePointLight`、`feDistantLight`和`feSpotLight`。

  


这些光源滤镜可以创建出特别酷的效果，例如：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter" color-interpolation-filters="linearRGB">
            <feOffset dx="25" dy="15"  in="SourceGraphic" result="OFFSET" />
            <feGaussianBlur stdDeviation="3"  in="OFFSET" result="BLUR" />
            <feDiffuseLighting surfaceScale="5" diffuseConstant="0.75" lighting-color="#BBF900"  in="BLUR" result="DIFFUSELIGHTING">
                <fePointLight x="195" y="150" z="200" />
            </feDiffuseLighting>
            <feComposite in="DIFFUSELIGHTING" in2="BLUR" operator="in" result="composite" />
        </filter>  
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/183a69f783044725a7128ea8376369ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=295848&e=jpg&b=5d71bf)

  


> Demo 地址：https://codepen.io/airen/full/MWdrPVQ

  


正如你所看到的，SVG 的光照效果是通过使用 `<feDiffuseLighting>` 或 `<feSpecularLighting>` 滤镜基元来实现，它们是基于 [Phong 光照模型](https://www.cs.utexas.edu/~bajaj/graphics2012/cs354/lectures/lect14.pdf)的适当组件进行计算，使图像或图形看起来更具立体感和质感。

  


-   `<feDiffuseLighting>` 用于模拟漫反射光照效果。漫反射光是指均匀散射的光线，使物体表面看起来更加柔和和均匀。这个元素需要一个高度图（通常由 `<feTile>` 或 `<feDisplacementMap>` 生成）作为输入，以确定每个像素的光照强度
-   `<feSpecularLighting>` 用于模拟镜面反射光照效果。镜面反射光光是指光线直接反射到观察者眼中的那部分光，使物体表面看起来有光泽或闪光。与 `<feDiffuseLighting>` 类似，它也需要一个高度图来确定光照强度

  


它们各自都包含了一些主要属性，下面这个表格描述了它们的主要属性及其功能和作用：

  


| **属性名称**               | **`<feDiffuseLighting>`**                                         | **`<feSpecularLighting>`**                                              |
| ---------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **`in`**               | 指定输入图像，用于确定光照效果应用于哪个图像                                                  | 指定输入图像，用于确定光照效果应用于哪个图像                                                  |
| **`surfaceScale`**     | 指定表面高度的比例，用于控制光照效果在图形表面上的高度变化。较高的值会增加表面的起伏，使光照效果更明显                     | 指定表面高度的比例，用于控制光照效果在图形表面上的高度变化。较高的值会增加表面的起伏，使光照效果更明显                     |
| **`diffuseConstant`**  | 指定漫反射光的常数，用于决定光照的强度。较高的值会使图形表面的漫反射光更亮                                   | **🚫**                                                                  |
| **`kernelUnitLength`** | 指定用于计算光照的采样单位长度，用于定义采样单位长度的 `x` 和 `y` 值。如果只提供一个数字，它将用于两个方向。它影响到光照效果的分辨率 | 指定用于计算光照的采样单位长度，用于定义采样单位长度的 `x` 和 `y` 值。如果只提供一个数字，它将用于两个方向。它影响到光照效果的分辨率 |
| **`lighting-color`**   | 指定光的颜色，用于设置光源的颜色，这会影响光照效果的颜色，使被光照部分呈现出指定的颜色                             | 指定光的颜色，用于设置光源的颜色，这会影响光照效果的颜色，使被光照部分呈现出指定的颜色                             |
| **`specularConstant`** | **🚫**                                                                  | 指定镜面反射光的常数，用于决定光照的强度。较高的值会使图形表面的镜面反射光更亮                                 |
| **`specularExponent`** | **🚫**                                                                  | 指定镜面反射光的指数，用于控制光的聚集程度。较高的值会使光的反射更集中在高亮区域，从而产生更尖锐的高光                     |

  


需要知道的是，`<feDiffuseLighting>` 和 `<feSpecularLighting>` 滤镜基元都需要依赖于光源的定义来产生光照效果。即 `<fePointLight>`、`<feDistantLight>` 和 `<feSpotLight>` ：

  


### 点光源：`<fePointLight>`

  


`<fePointLight>` 是一种点光源，它模拟从一个特定点向外辐射的光线，类似于房间中的灯泡。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ab4a867631e455b8ba131a008a56b58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2940&h=1960&s=183623&e=jpg&b=322b24)

  


它从一个三维空间中的点发射光线，并且光线向所有方向均匀扩散。

  


`<fePointLight>` 点光源的位置由要由 `x` 、`y` 和 `z` 三个属性来确定，即确定光源在适当轴上的坐标系中的位置：

  


-   `x`：定义光源在 `x` 轴上的位置。表示光源在水平方向上的位置
-   `y`：定义光源在 `y` 轴上的位置。表示光源在垂直方向上的位置
-   `z`：定义光源在 `z` 轴上的位置，表示光源离图形平面的高度。换句话说，它会确定从光点到用户的位置来调整光源的感知大小；值越大，产生的光点也会更大，它在视觉上更“接近”用户

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter1" color-interpolation-filters="linearRGB" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves="3" seed="2" in="SourceGraphic" result="TURBULENCE__10" />
            <feDiffuseLighting surfaceScale="2.5" diffuseConstant="12" lighting-color="#268ddb" in="TURBULENCE__10" result="DIFFUSELIGHTING__10">
                <fePointLight x="100" y="100" z="3" />
            </feDiffuseLighting>
        </filter>
        <filter id="filter2" color-interpolation-filters="linearRGB" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves="3" seed="2" in="SourceGraphic" result="TURBULENCE__20" />
            <feSpecularLighting surfaceScale="2.5" specularConstant="12" specularExponent="40" lighting-color="#268ddb" in="TURBULENCE__20" result="DIFFUSELIGHTING__20">
                <fePointLight x="100" y="100" z="3" />
            </feSpecularLighting>
        </filter>
    </defs>
</svg>
```

  


示例中的点光源位于 `(100,100,3)` 位置，呈现的效果如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21683fca3a6442cc9be2cddd57a338a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1117&s=3643324&e=jpg&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/JjqpjYg

  


### 聚光灯光源： `<feSpotLight>`

  


`<feSpotLight>` 是一种聚光灯光源，它模拟从一个特定点向一个目标点照射的光束，光束可以聚焦成锥形，类似于舞台上的聚光灯。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e9c57231d7747948bcc59a68b046df0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1674&h=1049&s=58364&e=jpg&b=104582)

  


我们可以通过下面这些属性来调整聚光灯光源的位置、投射区域等：

  


-   `x`：定义光源在 `x` 轴上的位置。表示光源在水平方向上的位置
-   `y`：定义光源在 `y` 轴上的位置。表示光源在垂直方向上的位置
-   `z`：定义光源在 `z` 轴上的位置，表示光源离图形平面的高度
-   `pointsAtX`：定义光束指向的目标点在 `x` 轴上的位置
-   `pointsAtY`：定义光束指向的目标点在 `y` 轴上的位置
-   `pointsAtZ`：定义光束指向的目标点在 `z` 轴上的位置，表示目标点离图形平面的高度
-   `specularExponent`：定义光束的聚焦程度，值越大，光束越集中
-   `limitingConeAngle`：定义光束的锥角，值越小，光束越聚焦

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter1" color-interpolation-filters="linearRGB" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves="3" seed="2" in="SourceGraphic" result="TURBULENCE__10" />
            <feDiffuseLighting surfaceScale="2.5" diffuseConstant="12" lighting-color="#268ddb" in="TURBULENCE__10" result="DIFFUSELIGHTING__10">
                <feSpotLight x="50" y="50" z="100" pointsAtX="100" pointsAtY="100" pointsAtZ="100" specularExponent="30" limitingConeAngle="45" />
            </feDiffuseLighting>
        </filter>
        <filter id="filter2" color-interpolation-filters="linearRGB" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves="3" seed="2" in="SourceGraphic" result="TURBULENCE__20" />
            <feSpecularLighting surfaceScale="2.5" specularConstant="12" specularExponent="40" lighting-color="#268ddb" in="TURBULENCE__20" result="DIFFUSELIGHTING__20">
                <feSpotLight x="50" y="50" z="100" pointsAtX="100" pointsAtY="100" pointsAtZ="100" specularExponent="30" limitingConeAngle="45" />
            </feSpecularLighting>
        </filter>
    </defs>
</svg>
```

  


此示例表示光源位于 `(50,50,100)` ，光束指向 `(100, 100, 100)` 的目标点，光束的聚焦程度为 `30` ，光束的锥角为 `45` 度。所呈现的效果如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3f83ba983314c3db23a9b3b473c078b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1117&s=1460194&e=jpg&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/vYwdYwJ

  


### 远距离光源： `<feDistantLight>`

  


`<feDistantLight>` 是一种远距离光源，它模拟从无限远处照射过来的平行光束，类似于太阳光。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/836d3a5352f9476fb43c499c09dfbc89~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1960&h=1960&s=293836&e=jpg&b=321b09)

  


由于光源离目标非常远，所以光线是平行的。我们可以通过 `azimuth` 和 `elevation` 属性来设置远距离光源的效果：

  


-   `azimuth`：定义光源在 `XY` 平面上的顺时针方向角度（以度数表示）。它表示光源在水平方向上相对于图形中心的角度
-   `elevation`：定义光源相对于图形平面的高度角（以度数表示），即光源从 `XY` 平面向 `z` 轴方向的方向角度。它表示光源在垂直方向上的高度角

  


其中 `azimuth` 又称为“方位角”，而 `elevation` 称为“仰角”。方位角和仰角是定义天体（太阳、月亮）在天空中特定位置的两个坐标，这些坐标是从特定地点在特定时间观看到的。假设你希望太阳或月亮在天空中的某个特定位置，天空中的这个位置是由方位角和仰角定义的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb8e396afb61474282abc949ef21baa4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=740&h=556&s=52470&e=jpg&b=f5f4ef)

  


方位角（`azimuth`）是指从北方向顺时针沿观察者地平线测量的天体（太阳或月亮）的角度。它决定了天体的方向。例如，正北方向的天体方位角为 `0º`，正东方向的方位角为 `90º`，正南方向的方位角为 `180º`，正西方向的方位角为 `270º`。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4d2f681f05444cfab0d8b4297bac8ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=740&h=555&s=104149&e=jpg&b=f4f3ee)

  


仰角（`elevation`）是指天体（太阳、月亮）与观察者的当地地平线或当地平面的垂直角距离。对于我们来说，太阳的仰角是太阳表观盘几何中心的方向与观察者当地地平线之间的角度。当太阳或月亮的几何中心位于观察者的当地地平线或当地平面上方 `12º` 时，我们会说太阳或月亮的仰角为 `12º`。

  


下图显示了在两种不同观察者位置下的太阳仰角。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d2525e97f744a488c49c8bab00b59ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=891&s=535604&e=jpg&b=f4f2ee)

  


我们来看一个关于 `<feDistantLight>` 光源的简单示例：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter1" color-interpolation-filters="linearRGB" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves="3" seed="2" in="SourceGraphic" result="TURBULENCE__10" />
            <feDiffuseLighting surfaceScale="2.5" diffuseConstant="12" lighting-color="#268ddb" in="TURBULENCE__10" result="DIFFUSELIGHTING__10">
                <feDistantLight azimuth="45" elevation="5" />
            </feDiffuseLighting>
        </filter>
        <filter id="filter2" color-interpolation-filters="linearRGB" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.006 0.04" numOctaves="3" seed="2" in="SourceGraphic" result="TURBULENCE__20" />
            <feSpecularLighting surfaceScale="2.5" specularConstant="12" specularExponent="40" lighting-color="#268ddb" in="TURBULENCE__20" result="DIFFUSELIGHTING__20">
                <feDistantLight azimuth="45" elevation="5" />
            </feSpecularLighting>
        </filter>
    </defs>
</svg>
```

  


此示例表示光源以 `45` 度的角度从水平方向照射，并以 `5` 度的角度从垂直方向照射。呈现的效果如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cb30fff74b5430c99e5af8a541d6e5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1117&s=3408862&e=jpg&b=009dec)

  


> Demo 地址：https://codepen.io/airen/full/KKLQwwL

  


## 案例：制作玻璃文字效果

  


我们来看一个综合案例，玻璃文字效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/290ffdd51d5742c5b50e0089bcc5d2a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=881280&e=jpg&b=e7bc90)

  


> Demo 地址：https://codepen.io/airen/full/WNBMbWv

  


接下来，我们一步一步来看这个效果是如何实现的。

  


### 第一步：引入背景图像

  


在这个示例中，我们需要一张图像作为“玻璃”效果的背景，我在这里使用了下图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1f089d85ec44725baea93d7a1d0de08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1024&s=83964&e=jpg&b=ebc293)

  


> https://picsum.photos/id/56/1920/1024

  


你可以选择你喜欢的图像。

  


在这个示例中，并没有使用 HTML 的 `<img>` 元素来引入背景图，而是使用了 SVG 的 [`<image>` 元素](https://juejin.cn/book/7341630791099383835/section/7347990618057998388)：

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <!-- 背景图（可见） -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
</svg>
```

  


你会注意到，示例中的 `<svg>` 元素的 `viewBox` 属性的 `width` 和 `height` 和 `<image>` 元素引入的图片原始尺寸是相同的，即 `1920 x 1024` 。这确保了 SVG 的视窗大小与图片的尺寸相同，减少了很多不必要的麻烦。例如，确保图像位于我们指定的位置。

  


### 第二步：扭曲图像

  


复制第一步中的 `<image>` 元素，唯一不同的是，在这个图像上我们将会应用一个 ID 为 `distortion` 的滤镜。这个滤镜将会扭曲图像。我们将使用 [`<feTurbulence>`](https://juejin.cn/book/7341630791099383835/section/7368318101526183986) 和 [`<feDisplacementMap>`](https://juejin.cn/book/7341630791099383835/section/7368318262368534578) 滤镜基元来对图像进行扭曲操作，即 `<feTurbulence>` 生成噪声图，并且该图像将作为 `<feDisplacementMap>` 滤镜的位移图，并且图像的 `x` 轴上的红色通道和 `y` 轴上的绿色通道值会根据 `scale` 指定的值进行缩放。

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 -->
    <image href="https://picsum.photos/id/56/1920/1024" filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e971a8370e374400be7105a230174aa3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=703&s=707658&e=jpg&b=f2ebdd)

  


如果你仔细观察上图，你人看到应用了滤镜（`filter="url(#distortion)"`）的图像中物体的边缘有些粗糙和波浪状。这就是滤镜的作用。

  


### 第三步：裁剪文本

  


我们不希望整个图像被扭曲。我们要将扭曲的 `<image>` 裁剪成一些文本形状。这样就能看到“透过”玻璃的图片部分。

  


在 SVG 中，[我们可以使用 `<clipPath>` 元素来定义剪切路径](https://juejin.cn/book/7341630791099383835/section/7362748816769941540)，只不过我们这个示例中是由 [`<text>` 元素](https://juejin.cn/book/7341630791099383835/section/7346773005114507304)来决定剪切路径形状的。

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 -->
    <image href="https://picsum.photos/id/56/1920/1024" filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
</svg>
```

  


并在 CSS 中给 `<text>` 元素设置一些样式：

  


```CSS
text {
    font-size: 12vw;
    font-family: "Mona Sans", serif;
    font-weight: 900;
    z-index: 3;
    place-self: center;
    text-transform: uppercase;
    color: #fff;
}
```

  


定义好裁剪路径之后，请别忘了在扭曲图像 `<image>` 上使用 `clip-path` 引用 `<clipPath>` 定义的剪切路径（你也可以在 CSS 中使用 `clip-path` 引用），否则看不到任何被裁剪的效果：

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5002136633ca4da791618849dd23c921~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=210473&e=jpg&b=ffffff)

  


注意，为了让大家能看到被裁剪的扭曲图像效果，我把背景图先禁用了。如果开启背景图，在浏览器中你看到效果如下图。似乎看不到“SVG AWESOME” 文本字样。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9919661f6c6460faa9a3e6769dd37b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=803460&e=jpg&b=eac192)

  


如果你足够仔细的话，还是能发现差异的。只有“SVG AWESOME” 文本区域的图像带有扭曲效果。或者你给扭曲图像临时设置一个混合模式，立刻就能显示出差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/920a30bc00454751be3799b31b98499c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=562&s=13739185&e=gif&f=67&b=eac08f)

  


### 第四步：添加文本

  


接下来，我们要在 SVG 中添加一个与 `<clipPath>` 中一模一样的 `<text>` 元素：

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d10301cfcc04666a6c870ccc4f00110~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=826028&e=jpg&b=e8ceb0)

  


正如你所看到的，在背景图片上面有一个黑色文本（“SVG AWESOME”）。如果我们已经制作的 `<image>` 上的扭曲滤镜是我们通过“玻璃”看到的内容，那么我们的新 `<text>` 就是玻璃本身。

  


### 第五步：创建文本的暗色边缘

  


接下来的内容就更有趣了，当然也变得更复杂了。

  


我们想在文本元素的边缘创建一个暗边缘（有点类似描边的效果），这样当与亮边缘结合时，会增加文本在图像上的深度感。

  


我们需要为 `<text>` 创建一个新的滤镜，并给这个滤镜一个 `id="textFilter"`，然后将其链接到 `<text>` 元素的 `filter` 属性。

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <!-- 应用于文本的滤镜 -->
        <filter id="textFilter" color-interpolation-filters="linearRGB">
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text filter="url(#textFilter)" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


我们需要往 `textFilter` 滤镜中添加更多的滤镜基元。

  


由于 SVG 从背景到前景工具，所以我们在滤镜中首先放置的是玻璃的阴影，因为它在最远的后面。这一部分有点复杂，但我们会逐步讲解。

  


为了实现这个效果，我们使用了四个滤镜基元：`<feMorphology>`、`<feOffset>`、`<feFlood>` 和 `<feComposite>`。

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <!-- 应用于文本的滤镜 -->
        <filter id="textFilter" color-interpolation-filters="linearRGB">
            <!-- 暗色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DARK__EDGE__10" />
            <feOffset dx="5" dy="5" in="DARK__EDGE__10" result="DARK__EDGE__30" />
            <feFlood flood-color="rgb(0 0 0 / .5)" result="DARK__EDGE__40" />
            <feComposite in="DARK__EDGE__40" in2="DARK__EDGE__30" operator="in" result="DARK__EDGE__50" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text filter="url(#textFilter)" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


首先是 `<feMorphology>` 滤镜基元，在这里它会使文本变得更粗，因为我们设置的操作类型是 `dilate` 膨胀（变粗）。并且将它的 `radius` 设置为 `4` ，这个相当于文本描边粗细：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3655bcbf3fd04373be0d8f2a1fff8bf4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=566&s=16253779&e=gif&f=92&b=e5b88b)

  


接着使用 `<feOffset>` 滤镜基元，将 `<feMorphology>` 滤镜基元的结果（所有“像素”）在 `x` 轴或 `y` 轴上移动。值 `dx="5"` 和 `dy="5"` 分别在 `x` 轴和 `y` 轴上向右向下移动 `5` 个用户单位。数字越大，移动得越远。为 `dx` 输入负数，像素将向左移动；负 `dy` 将向上移动！

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/854b1583886e47e5930c5c455d42fb9a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=550&s=16139847&e=gif&f=107&b=e6b98d)

  


然后，使用 `<feFlood>` 滤镜基元给文本着色。你会发现，`<feFlood>` 滤镜基元将按照你指定的颜色（`flood-color`）填充整个滤镜区域：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf1d058c83754aac8dfcf79a7cdcfa0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=781919&e=jpg&b=e6bb90)

  


正如你所看到的，现在整个滤镜区域被填充了一个 ` rgb(0 0 0  / .5)` 颜色。注意，`<feFlood>` 滤镜基元并不知道你之前做了什么，而且它也不关心你之前做了什么，它唯一做的就是将按照像指定的颜色来填充整个滤镜区域。

  


这就是为什么有些人对 SVG 感到沮丧。看不见的东西很难工作！相信我，随着你对 SVG 的熟练，你会习惯这种情况。事实上，接下来的几步我们需要依赖这个并相信一切都还在。比如 `<feComposite>` 滤镜基元。它就像个魔法师一样，会将你感觉消失的东西又重新变回来。

  


在这个示列中，`<feComposite>` 滤镜基元会将 `<feOffset>` 和 `<feFlood>` 两个滤镜基元的结果做一个合成操作，将两者未重叠的部分消除。这样一来，我们可以再次看到文本，并且由于我们使用的颜色略带透明（` rgb(0 0 0  / .5)`），我们甚至可以看到失真“玻璃”效果（其实就是填充颜色是透明的，从而看到底部的背景图像）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c02200aeeaf4f998088db3b2e5e2e2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=837093&e=jpg&b=e6bb8f)

  


### 第六步：制作文本的亮色边缘

  


这一步与我们刚刚完成的几乎相同：

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <!-- 应用于文本的滤镜 -->
        <filter id="textFilter" color-interpolation-filters="linearRGB">
            <!-- 暗色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DARK__EDGE__10" />
            <feOffset dx="5" dy="5" in="DARK__EDGE__10" result="DARK__EDGE__30" />
            <feFlood flood-color="rgb(0 0 0 / .5)" result="DARK__EDGE__40" />
            <feComposite in="DARK__EDGE__40" in2="DARK__EDGE__30" operator="in" result="DARK__EDGE__50" />
            
            <!-- 亮色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="LIGHT__EDGE__10" />
            <feOffset dx="-2" dy="-2" in="LIGHT__EDGE__10" result="LIGHT__EDGE__20" />
            <feFlood flood-color="rgb(255 255 255 / .5)" result="LIGHT__EDGE__30" />
            <feComposite in="LIGHT__EDGE__30" in2="LIGHT__EDGE__20" operator="in" result="LIGHT__EDGE__40" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text filter="url(#textFilter)" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


这次 `<feOffset>` 的 `dx` 和 `dy` 设置了负值 `-2` ，使 `<feMorphology>` 的结果向左向上移动 `2` 个用户单位。`<feFlood>` 设置的填充颜色略微白色（`rgb(255 255 255  / .5)`）。我们经在达到一个漂亮的深度效果。

  


这个时候，你在浏览器只能看到亮色边缘的效果，第五步的暗色边缘看上去似乎又被丢失了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/586915a4a39444f0a186f41a7c1a0af4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=830050&e=jpg&b=ebc293)

  


### 第七步：合并暗色和亮色边缘

  


由于我们希望文本亮色描边和暗色描边效果都存在，因此我们需要使用另一个滤镜基元来对它们进行合并，即 SVG 的 `<feMerge>` 滤镜基元。它让我们可以将任意数量的基本结果合并，生成一个新的图像。

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <!-- 应用于文本的滤镜 -->
        <filter id="textFilter" color-interpolation-filters="linearRGB">
            <!-- 暗色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DARK__EDGE__10" />
            <feOffset dx="5" dy="5" in="DARK__EDGE__10" result="DARK__EDGE__30" />
            <feFlood flood-color="rgb(0 0 0 / .5)" result="DARK__EDGE__40" />
            <feComposite in="DARK__EDGE__40" in2="DARK__EDGE__30" operator="in" result="DARK__EDGE__50" />
            
            <!-- 亮色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="LIGHT__EDGE__10" />
            <feOffset dx="-2" dy="-2" in="LIGHT__EDGE__10" result="LIGHT__EDGE__20" />
            <feFlood flood-color="rgb(255 255 255 / .5)" result="LIGHT__EDGE__30" />
            <feComposite in="LIGHT__EDGE__30" in2="LIGHT__EDGE__20" operator="in" result="LIGHT__EDGE__40" />
            
            <!-- 暗色边缘和亮色边缘合并 -->
            <feMerge result="EDGES__10">
                <feMergeNode in="DARK__EDGE__50" />
                <feMergeNode in="LIGHT__EDGE__40" />
            </feMerge>
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text filter="url(#textFilter)" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e58dbd22242d4238981edd7dbdd48f8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=840179&e=jpg&b=e6bb90)

  


现在，两者（文本暗色描边和亮色描边）共存了！然而，这效果并不是我们所期望的。我们只是想要描边的效果，而不是填充整个文本。因此，我们需要移除原始 `<text>` 占据的空间。

  


接下来，我们继续使用 `<feComposite>` 滤镜基元来移除原始的 `SourceGraphic`。因为我们使用 `<feMorphology>` 加粗字母，使文本具有描边效果，现在我们可以从 `<feMerge>` 的结果中移除原始的字母形状。

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <!-- 应用于文本的滤镜 -->
        <filter id="textFilter" color-interpolation-filters="linearRGB">
            <!-- 暗色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DARK__EDGE__10" />
            <feOffset dx="5" dy="5" in="DARK__EDGE__10" result="DARK__EDGE__30" />
            <feFlood flood-color="rgb(0 0 0 / .5)" result="DARK__EDGE__40" />
            <feComposite in="DARK__EDGE__40" in2="DARK__EDGE__30" operator="in" result="DARK__EDGE__50" />
            
            <!-- 亮色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="LIGHT__EDGE__10" />
            <feOffset dx="-2" dy="-2" in="LIGHT__EDGE__10" result="LIGHT__EDGE__20" />
            <feFlood flood-color="rgb(255 255 255 / .5)" result="LIGHT__EDGE__30" />
            <feComposite in="LIGHT__EDGE__30" in2="LIGHT__EDGE__20" operator="in" result="LIGHT__EDGE__40" />
            
            <!-- 暗色边缘和亮色边缘合并 -->
            <feMerge result="EDGES__10">
                <feMergeNode in="DARK__EDGE__50" />
                <feMergeNode in="LIGHT__EDGE__40" />
            </feMerge>
            
            <!-- 移除文本原始空间 -->
            <feComposite in="EDGES__10" in2="SourceGraphic" operator="out" result="EDGES__20" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text filter="url(#textFilter)" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1943f8803b44bacb57c387485d50852~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=898864&e=jpg&b=e7bc90)

  


通过这些步骤，我们成功的将暗色描边和亮色描边结合在一起，并且只留文本的描边效果，使文本在图像上显得更加立体。仔细观察整个效果，文本看上去像是应用了两个不同方向的、不同颜色的阴影效果，想象一下 CSS 的 `text-shadow` 给文本添加描边的效果。

  


现在我们看起来像玻璃了，只剩下一个部分还需完成。

  


### 第八步：添加斜角效果

  


我们已经有了一个相当不错的立体玻璃效果。然而，字母看起来还是比较平坦。让我们再添加一个效果，让它们看起来更加圆润。

  


为了实现这一点，我们将创建一个斜角效果。

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <!-- 应用于文本的滤镜 -->
        <filter id="textFilter" color-interpolation-filters="linearRGB">
            <!-- 暗色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DARK__EDGE__10" />
            <feOffset dx="5" dy="5" in="DARK__EDGE__10" result="DARK__EDGE__30" />
            <feFlood flood-color="rgb(0 0 0 / .5)" result="DARK__EDGE__40" />
            <feComposite in="DARK__EDGE__40" in2="DARK__EDGE__30" operator="in" result="DARK__EDGE__50" />
            
            <!-- 亮色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="LIGHT__EDGE__10" />
            <feOffset dx="-2" dy="-2" in="LIGHT__EDGE__10" result="LIGHT__EDGE__20" />
            <feFlood flood-color="rgb(255 255 255 / .5)" result="LIGHT__EDGE__30" />
            <feComposite in="LIGHT__EDGE__30" in2="LIGHT__EDGE__20" operator="in" result="LIGHT__EDGE__40" />
            
            <!-- 暗色边缘和亮色边缘合并 -->
            <feMerge result="EDGES__10">
                <feMergeNode in="DARK__EDGE__50" />
                <feMergeNode in="LIGHT__EDGE__40" />
            </feMerge>
            
            <!-- 移除文本原始空间 -->
            <feComposite in="EDGES__10" in2="SourceGraphic" operator="out" result="EDGES__20" />
            
            <!-- 斜角 -->
            <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="BEVEL__BLUR__10" />
            <feSpecularLighting result="BEVEL__BLUR__20" in="BEVEL__BLUR__10" specularConstant="2.4" specularExponent="13" lighting-color="rgb(60 60 60 / .4)">
                <feDistantLight azimuth="25" elevation="40" />
            </feSpecularLighting>
            <feComposite in="BEVEL__BLUR__20" in2="SourceGraphic" operator="in" result="BEVEL__BLUR__30" />
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text filter="url(#textFilter)" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


首先，我们将使用 `<feGaussianBlur>`。这会轻微地模糊我们现有的滤镜结果。我们将使用这个模糊的结果作为基础，然后使用 `<feSpecularLighting>` 滤镜基元为整个效果添加光照效果。和往常一样，你可以随意调整这里的参数，看看能够得到什么效果！你可能想要改变的主要参数是 `lighting-color`。我们使用的图像稍微暗一些，因此使用了一个明亮的 `lighting-color`。如果你的图像非常明亮，这会使字母难以阅读，那么在这种情况下你可能会使用较暗的 `lighting-color`。

  


通过这些步骤，我们将为文本添加一个斜角效果，使其看起来更加立体和真实，与背景图像融为一体。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8378b18c5f9439f8beda2c289a7e2d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=825080&e=jpg&b=ebc293)

  


### 第九步：所有步骤综合起来！

  


最后，将所有部分组合到一起，使用最后的 `<feMerge>` 将所有内容放置到最终效果中！

  


```XML
<svg viewBox="0 0 1920 1024" class="demo">
    <defs>
        <!-- 定义剪切路径 -->
        <clipPath id="clip">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>
        </clipPath>
        <!-- 定义扭曲图像的滤镜 -->
        <filter id="distortion" color-interpolation-filters="linearRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" in="SourceGraphic" result="TURBULENCE" />
            <feDisplacementMap in2="TURBULENCE" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        
        <!-- 应用于文本的滤镜 -->
        <filter id="textFilter" color-interpolation-filters="linearRGB">
            <!-- 暗色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="DARK__EDGE__10" />
            <feOffset dx="5" dy="5" in="DARK__EDGE__10" result="DARK__EDGE__30" />
            <feFlood flood-color="rgb(0 0 0 / .5)" result="DARK__EDGE__40" />
            <feComposite in="DARK__EDGE__40" in2="DARK__EDGE__30" operator="in" result="DARK__EDGE__50" />
            
            <!-- 亮色边缘 -->
            <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="LIGHT__EDGE__10" />
            <feOffset dx="-2" dy="-2" in="LIGHT__EDGE__10" result="LIGHT__EDGE__20" />
            <feFlood flood-color="rgb(255 255 255 / .5)" result="LIGHT__EDGE__30" />
            <feComposite in="LIGHT__EDGE__30" in2="LIGHT__EDGE__20" operator="in" result="LIGHT__EDGE__40" />
            
            <!-- 暗色边缘和亮色边缘合并 -->
            <feMerge result="EDGES__10">
                <feMergeNode in="DARK__EDGE__50" />
                <feMergeNode in="LIGHT__EDGE__40" />
            </feMerge>
            
            <!-- 移除文本原始空间 -->
            <feComposite in="EDGES__10" in2="SourceGraphic" operator="out" result="EDGES__20" />
            
            <!-- 斜角 -->
            <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="BEVEL__BLUR__10" />
            <feSpecularLighting result="BEVEL__BLUR__20" in="BEVEL__BLUR__10" specularConstant="2.4" specularExponent="13" lighting-color="rgb(60 60 60 / .4)">
                <feDistantLight azimuth="25" elevation="40" />
            </feSpecularLighting>
            <feComposite in="BEVEL__BLUR__20" in2="SourceGraphic" operator="in" result="BEVEL__BLUR__30" />
            
            <!-- 斜角与边缘合并 -->
            <feMerge result="complete">
                <feMergeNode in="EDGES__20" />
                <feMergeNode in="BEVEL__BLUR__30" />
            </feMerge>
        </filter>
    </defs>
    <!-- 背景图 -->
    <image href="https://picsum.photos/id/56/1920/1024" width="100%"  height="100%" x=0 y=0 />
    <!-- 扭曲图像 + 裁剪 -->
    <image href="https://picsum.photos/id/56/1920/1024" 
        clip-path="url(#clip)"
        filter="url(#distortion)" width="100%"  height="100%" x=0 y=0 />
        
    <!-- 可见文本 -->
    <text filter="url(#textFilter)" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">svg awesome</text>        
</svg>
```

  


通过这些步骤，我们创建了一个真实的玻璃效果，使得文本和背景图像相互融合，看起来立体而逼真。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f4426199c4f416490dc3719bee6f719~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=898864&e=jpg&b=e7bc90)

  


> Demo 地址：https://codepen.io/airen/full/WNBMbWv

  


## 小结

  


正如课程中示例所呈现的效果，SVG 滤镜中有太多不可思议的东西，也有很非常有趣的东西可以玩，它们的结合为我们打开了很多视觉的可能性。这些效果以前在诸如 Photoshop 等图像编辑器这外几乎不可想象。这些是设计师的设计技巧，现如今，SVG 滤镜为你打开了新世界的大门，你可以通过几行代码创建出很神奇的 UI 视觉效果。

  


另外，SVG 滤镜效果除了让你感到惊艳之外，还让你感到惧怕，并且止步往前。其实，它并没有我们想象的那么复杂，正如课程中制作玻璃文字效果的案例所示，很多时候，我们只需要一步步理清楚 SVG 每一个滤镜基元的功能，了解它们的参数，我们就可以组合它们创建出自己期望的效果。