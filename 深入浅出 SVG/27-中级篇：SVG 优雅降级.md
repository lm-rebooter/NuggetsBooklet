在当今的 Web 设计中，SVG 技术的应用日益广泛，已经成为不可或缺的一部分。SVG 图形不仅能够呈现出精美的矢量图形和生动的动画效果，还具备可伸缩和分辨率独立性等诸多优势。

然而，[面对不同浏览器和设备的兼容性差异](https://caniuse.com/?search=svg)，确保 SVG 在各种环境下都能提供一致的用户体验仍然是一项挑战。


在这个课程中，我们将深入探讨 SVG 优雅降级的理念和实践。无论是在旧版浏览器上呈现不完整的 SVG 图形，还是在不支持 SVG 的环境下提供替代方案，我们将为你提供全方位的指导。通过本课程的学习，你将掌握各种降级处理策略，并学会实施不同类型的备用方案，同时了解如何运用渐进增强的原则，以确保 Web 页面在不支持 SVG 的环境下依然能够正常运行，为用户提供一致而高效的体验。

让我们一同探索 SVG 的降级处理和备用方案，为你的网页设计增添更多的灵活性和可靠性。




## 什么是优雅降级与渐进式增强

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/518d20bd13c4435886294c58396ca5fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2828&h=1811&s=1861729&e=jpg&b=fdfafa)


互联网上的网站和应用覆盖了各种不同领域，每一个都有其特定的目的。无论是游戏、电子商务、博客还是社交媒体，每个网站或应用的主要目标都在于吸引用户的注意力，提供平等、包容和友好的用户体验。因此，无论何种网站或应用，都必须能够有效地向用户传达其目的。例如，如果一个旅游网站无法准确显示酒店信息，或者支付平台存在问题，用户将不会再次访问该网站。


提供无瑕疵的用户体验是任何网站或应用的首要目标之一，但在不同平台和浏览器上确保一致性往往具有挑战性。因此，`渐进式增强（Progressive Enhancement）`和`优雅降级（Graceful Degradation）`这两个概念应运而生。

在 Web 设计和开发领域，人们经常谈及渐进式增强和优雅降级，但实际上它们代表了构建网站或应用的两种不同策略。尽管这两种策略都旨在为广泛的设备和浏览器用户提供良好的用户体验，但它们的关注点和实施方式却有所不同。无论是在处理浏览器和设备的兼容性差异，还是在确保核心功能正常运行的同时应对用户可能面临的各种限制，渐进式增强和优雅降级都发挥着重要作用。

尽管这两个概念通常与 HTML 和 CSS 紧密相关，但它们同样适用于 SVG 的集成与应用。尤其是在考虑到兼容性和可访问性时，它们旨在确保在不支持 SVG 的环境下也能够提供良好的用户体验。因此，我们有必要知道在使用 SVG 过程中，具体有哪些方案可以用于优雅降级或渐进式增强。


在讨论具体如何在 SVG 应用中选择优雅降级或渐进增强之前，我们先了解一下这两个概念的内涵。

  


### 渐进式增强

[渐进增强](https://en.wikipedia.org/wiki/Progressive_enhancement)（Progressive Enhancement）是一种设计理念，采用从基础到高级的设计方法。它假设用户可能使用各种不同的浏览器和设备，并为这些用户提供最基本的功能和内容。

在这种策略下，网页首先被设计和构建为在所有设备和浏览器上都能正确显示和运行，即使是最基本的功能也能正常使用。然后，针对支持更高级功能的现代浏览器和设备，逐步增强网页的功能和体验，以提供更丰富和互动性更强的用户体验。换言之，渐进增强确保网页在任何情况下都能提供最基本的功能，而在支持的环境中则逐步提升功能和体验。

渐进增强中的“渐进”一词，意味着这种策略为使用较旧浏览器和功能有限设备的用户提供一个更简单但仍可用的体验，然后随着用户浏览器和设备能力的提升，逐步丰富用户体验至更吸引人、功能更全面的层次。

以下插图清晰地展示了“渐进增强”的概念，这类似于我们制作蛋糕的过程。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/954e1bb26a9c478cac79c0211a178e93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1115&s=478692&e=jpg&b=aee1ce)


我们首先使用基本的原料制作蛋糕。蛋糕完成后，我们给它加上奶油。最后，通过添加更多的奶油、颜色、图案和蜡烛来进一步美化蛋糕。

渐进式增强的设计流程与我们设计一个响应式 Web 网站或应用的流程（移动端第一）非常相似。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a492a924c1994baeb42199e97051f63b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=965&s=345408&e=jpg&b=ffffff)

从左至右依次为智能手机、平板电脑和台式机。每个设备都有箭头指向下一个设备，表示它们共享相同的 Web 页面核心功能，但在功能和视觉效果上逐步增强。这一过程是向上兼容的，Web 开发者通常会使用特性检测来判断浏览器是否能处理现代的功能，并借助 Polyfills 通过 JavaScript 来添加缺失的功能。这意味着开发者首先确保内容的基本可用性，然后逐步提升体验，以适应更先进的浏览器环境。


在使用 SVG 时，我们同样可以应用渐进式增强策略。

例如，开发者可以首先提供一个基本的 SVG 图像，确保它在不支持 SVG 的老式浏览器中至少能以某种形式（如降级为 PNG 或其他格式的图片）显示。然后，对于支持 SVG 的现代浏览器，逐步添加动画、滤镜效果或交互功能，从而提供更加丰富的视觉和互动体验。

举一个使用 SVG 图形创建交互图表的例子：在现代浏览器中，SVG 图形可以具有动画效果、交互式功能和高级样式。然而，在旧版浏览器中，可能不支持某些 SVG 特性，如动画或滤镜效果。在这种情况下，可以逐步增强网站或应用的功能，添加备用的静态图像或简化的交互功能，以确保在所有浏览器中都能提供一致的用户体验。

这种方法的好处包括：


-   确保基础功能的普遍可用性，提高网站或应用的可访问性。
-   鼓励开发者从核心内容和功能出发，逐步提升用户体验，而非一开始就追求复杂性。
-   有助于提高 Web 页面性能，因为非必要的高级特性仅在必要时加载。



综合而言，渐进式增强是一种实用技术，使开发者能够专注于开发最优网站或应用，同时确保这些网站或应用能在多种未知的用户代理上运行。虽然优雅降级与其相关，但并不相同，通常被视为渐进式增强的相反方向。

既然如此，我们接下来一起探讨一下优雅降级的概念和应用！




### 优雅降级

前面提到了，优雅降级（Graceful Degradation）通常被视为渐进式增强的相反方向：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baeef731b7a8402ca60e9a4df33d2df8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1115&s=618980&e=jpg&b=afe1cf)

[优雅降级](https://en.wikipedia.org/wiki/Graceful_degradation)（Graceful Degradation）是一种设计理念，其核心思想是在构建现代 Web 网站或应用时，首先假设用户拥有先进的浏览器和设备，并为这些用户提供最优质的体验。

在这种策略下，网页的核心功能首先被开发和优化，确保其在最新的浏览器和设备上完美运行。然后，针对不支持某些高级功能的旧版浏览器和设备，逐步提供替代方案或简化的体验。换言之，如果用户的环境无法支持网页的全部功能，网页仍能够以一种优雅的方式进行降级，确保基本功能的可用性。

我们也可以通过响应式网站的设计流程（桌面端优先）来解释优雅降级的设计流程。举例来说，从左至右依次为台式机、平板电脑和智能手机。它们共享相同的网页核心功能，但在功能和视觉效果上有逐步降低的过程。这种方式确保即使在功能受限的设备上，用户也能获得基本的使用体验。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7261f6cd81d641248fc1f7c70fc3a2d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1639&s=762291&e=jpg&b=ffffff)

优雅降级的核心理念是在构建现代网站或应用时，确保其能在最新的浏览器和设备中正常工作，同时在旧版浏览器和设备中退化为虽然不那么完美但仍能提供核心内容和功能的体验。在这一过程中，Web 开发者通常会通过 Polyfill 使用 JavaScript 引入缺失的功能，对于样式和布局等特性，则尽量提供可接受的替代方案。这在 CSS 的应用中尤为常见。例如，在现代浏览器中使用 CSS 的新特性如动画和渐变效果，而在旧版浏览器中则提供简化的视觉效果或完全移除这些高级特性。这确保了所有用户都能访问核心内容和功能，同时为使用现代浏览器的用户提供更丰富的体验。

同样地，在使用 SVG 时，优雅降级可能意味着 Web 开发者首先会应用一个包含高级 SVG 特性的交互式图形，比如鼠标悬停效果、动画或复杂的滤镜。随后，通过条件判断和特性检测，对不支持这些特性的浏览器提供一个简化版的 SVG 或甚至是一张静态图像作为备用方案，以确保基本内容的传达。

假设一个网站使用 SVG 图标来增强用户界面。在支持 SVG 的现代浏览器上，这些图标可以展现出丰富的细节和动画效果。然而，在旧版浏览器中，可能不支持 SVG，这时就需要使用备用方案，比如 PNG 或 GIF 格式的图标。通过优雅降级，即使在不支持 SVG 的浏览器上，用户仍然可以看到相同的图标，虽然可能会失去一些动画效果或细节。


这种方法的好处是：


-   优先考虑了高级用户的需求，确保在最佳环境下有最佳体验。
-   虽然可能导致在老旧浏览器上的体验不如渐进增强那么平滑，但至少提供了内容的可访问性。


其不足之处在于，可能需要更多的测试和维护工作来确保所有版本的兼容性。




### 渐进式增强 vs. 优雅降级

优雅降级旨在为使用旧版浏览器的用户提供备用（降级）体验，而渐进式增强则采取相反的方法，从基本但功能完整的网站或应用开始，为拥有更高级设备和浏览器的用户添加额外的功能和增强体验。

你可能会问，为何要采取这些策略？如果想要吸引用户，逐步降低网站或应用程序的功能难道不是错误的选择吗？为什么有人会发布只提供基础功能而不是全部功能的网站和应用程序呢？让我尝试着来帮助大家解惑。

渐进式增强背后的理由是，Web 开发者可以构建一个包含基本功能、支持所有浏览器的可行产品，确保网站或应用仍能正常使用。一旦通过可用性测试和用户反馈，了解到网站或应用未来需要哪些功能，就可以逐步将它们添加进网站或应用程序中，给用户提供一个功能更强、体验更好的网站或应用，这是一个“逐步的”、“渐进式”的过程。这样做能够确保用户在不同浏览器和平台上获得一致的体验，使产品具有面向未来的适应性。

至于优雅降级，假设有一个现代浏览器上表现很好的应用，但如果想让它在旧版浏览器上也能工作，就需要为旧浏览器修复代码，或者换句话说，优雅地降低其功能表现。这与渐进式增强正好相反。

其中关键要点是：**渐进式增强从简单出发，逐步构建复杂性；而优雅降级则取复杂性入手，力求在应用中实现清晰明确的解决方案**。


这两种策略各有利弊，选择哪一种取决于网站（或应用）及用户的具体需求。优雅降级适用于需要高级功能和特性的，但仍需对旧设备和浏览器用户开放的网站或应用。渐进式增强则适用于需要面向广泛用户，但仍希望为拥有高级设备和浏览器用户提供增强体验的网站或应用。

相比而言，渐进式增强通常是更广泛使用的方法，因为它解决了基本问题，并朝着复杂性发展。这意味着，它从一开始就与所有浏览器和设备兼容。优雅降级方法在较旧的浏览器版本和设备中无法令人满意，但会逐渐发展。这意味着，在 Web 网站或应用程序开始时，在较旧的浏览器和设备上的工作效果不佳。


也就是说，**当你想从零开始构建一个网站或应用时，`渐进增强`是首选的；反之，如果你想要创建一个符合新标准的网站或应用，那么`优雅降级`是首选方案**。


总结一下，优雅降级和渐进式增强，既有差异，也有联系。

-   出发点不同：渐进式增强从最基本功能开始，逐步添加；优雅降级从全功能开始，逐步回退。
-   目标用户：渐进式增强优先考虑的是最低配置用户；优雅降级则先满足高配置用户。
-   设计理念：渐进式增强是“向前看”，确保新功能的平滑加入；优雅降级是“向后兼容”，确保在任何情况下都能提供服务。
-   目标相同：两者都旨在提高 Web 网站或应用程序的兼容性和用户体验。
-   实践互补：在实际开发中，两者经常结合使用，既确保基础功能的普及，又照顾到高端体验的优化。



简而言之，优雅降级和渐进式增强是 Web 设计和开发领域中两种重要理念，旨在创建广泛设备和浏览器上都能访问和功能完备的网站或应用程序。尽管它们代表着不同的设计方法，两者各有优势，并可结合使用来创造既可访问又功能丰富的网站或应用程序。最终，采取哪种方法取决于网站及其用户的特定需求，设计者应准备好运用一系列技术和设计元素，确保网站对所有用户保持可用和可访问。


在 SVG 的集成和使用过程中，合理运用这两种策略，可以有效使 SVG 图形发挥作用。优雅降级确保即使在不支持 SVG 的环境下，用户仍然能够正常访问网站，而渐进式增强则允许在现代浏览器中提供更丰富的功能和效果，逐步向下兼容旧版浏览器。这种综合应用有助于确保网站在各种环境下都能提供良好的用户体验。

  


## 为何需要考虑 SVG 的备用方案和降级策略

虽然现代浏览器对 SVG 相关特性的支持已经非常好了，但你的用户群体并不全都是使用现代浏览器的。这意味着，如果将 SVG 应用于生产环境中，就不得不考虑 SVG 的备用方案和降级策略。这样做，主要是为了确保在不同浏览器环境、设备兼容、网络状态以及辅助技术需求下，用户均能获得良好的体验和内容可访问性。



以下是几个关键性原因：

-   **浏览器兼容性：** 并不是所有浏览器都能完全支持所有的 SVG 特性。老旧的浏览器或者一些特定环境下的浏览器可能无法渲染复杂的 SVG 图像或其特性。通过提供备用方案，可以确保这些浏览器仍能显示基本内容。

-   **用户体验：** 确保所有用户无论使用何种设备或浏览器，都能获得良好的用户体验是至关重要的。即使某些特性在旧版浏览器上不可用，提供简化的视觉效果或替代方案可以避免用户因无法看到内容而感到困惑或失望。
-   **可访问性：** 某些用户可能会使用不支持 SVG 的辅助技术设备，或者可能禁用了浏览器中的某些功能。提供降级策略可以确保这些用户仍能访问核心内容，提高网站的整体可访问性。
-   **性能优化：** 在某些情况下，复杂的 SVG 图像和效果可能会影响页面加载速度和性能。通过在必要时提供更简单的图像或效果，可以优化加载时间和性能，特别是在移动设备或低带宽环境中。
-   **维护和测试：** 通过采用降级策略，可以更轻松地进行维护和测试。开发者可以确保在任何环境下，网页都能正常工作并显示核心内容，减少因特性不兼容而导致的问题和错误。



假设一个网站使用了复杂的 SVG 图标，包含动画和交互效果。在支持这些特性的现代浏览器上，用户可以享受这些高级效果。但在旧版浏览器中，这些效果可能无法正常显示。此时，通过降级策略，可以提供一个静态的 PNG 或 GIF 图标，确保用户仍能看到图标并理解其功能。

那么，我们在使用 SVG 时，又需要提供什么样的后备方案呢？不过，在回答这个具体而又复杂的问题之前，我们先自我思考一下，提供什么样的后备方案是有用的。

-   **无需后备方案**：如果 SVG 是一个其含义通过文本标签清晰表达的图标，那么即使该图标消失，也不会影响网站的功能性。
-   **文本后备方案**：如果 SVG 是一个可以用文本标签表达其含义的图标，也许你只需要确保在它的位置显示替代文本即可。
-   **图像后备方案**：这也是大多数人认为的 SVG 后备方案，即使用 PNG 或 GIF 图像来表示相同的图形，只是文件大小更大且分辨率更低。
-   **交互后备方案**：对于替换动画和交互式 SVG，PNG 可能无法做到这一点。你需要一个具有交互式 DOM 的图形语言。

  


接下来，我们主要一起探讨如何为你的 SVG 创建文本和图像提供后备方案。你的选择几乎完全取决于你最初如何在 Web 中使用 SVG：


-   作为嵌入对象：通过 `<iframe>` 或 `<object>` 为 Web 引入 SVG，这种方式变得越来越少。
-   作为内联 SVG 代码：SVG 代码直接嵌套在 HTML 文档中，这是常用方式之一。
-   作为 HTML 中的图像：通过 `<img>` 元素为 Web 引入 SVG。
-   作为 CSS 中的图像：通过支持 `<image>` 类型的 CSS 属性为 Web 引入 SVG，例如 `background-iamge` 、`mask-image` 等。


如果你对这些使用方式不怎么了解，请回过头阅读小册的《[初级篇：如何使用 SVG](https://juejin.cn/book/7341630791099383835/section/7344089098363076620)》。

  


## 为 `<object>` 和 `<iframe>` 元素中的 SVG 设置后备方案

我们先从不怎么常用的方式开始，即为 `<object>` 和 `<iframe>` 元素中的 SVG 设置后备方案。

随着内联 SVG 的支持越来越好，使用 `<object>` 或 `<iframe>` 元素给 Web 插入 SVG 变得不再那么流行了，尤其是 `<object>` 。相比而言，给这两个元素中的 SVG 提供后备方案是最简单的。

我们可以通过给 `<object>` 或 `<iframe>` 元素插入一个子元素，该子元素可以是 HTML 的任何内容，例如图像、格式化文本，甚至是另一个对象。例如：


```HTML
<object type="image/svg+xml" data="logo.svg">
    <img src="logo.png" alt="Logo" />
</object>

<object type="image/svg+xml" data="logo.svg">
    <p class="warning">您的浏览器不支持 SVG！使用现代浏览器访问！</p>
</object>

<iframe src="logo.svg" frameborder="0">
    <img src="logo.png" alt="Logo" />
</iframe>

<iframe src="logo.svg" frameborder="0">
    <p class="warning">您的浏览器不支持 SVG！使用现代浏览器访问！</p>
</iframe>
```

  


当 `<object>` 或 `<iframe>` 自身无法显示时，将会在浏览器中呈现其子元素的内容。比如上面代码中的：

```HTML
<object type="image/svg+xml" data="logo.svg">
    <img src="logo.png" alt="Logo" />
</object>
```


如果浏览器不支持 SVG，`<object>` 元素会显示其子元素 `<img>` 引入的 `logo.png` 图像。除了提供备用图像之外，还可以使用格式文本，当 SVG 无法显示时，不能给用户提供友好的提示。


```HTML
<object type="image/svg+xml" data="logo.svg">
    <p class="warning">您的浏览器不支持 SVG！使用现代浏览器访问！</p>
</object>
```

  


使用 `<object>` 或 `<iframe>` 元素是为 SVG 提供后备方案的一种有效方法，特别是对于需要渐进式增强和优雅降级的网站。它简单易用，并且允许使用多种类型的后备内容来确保在所有浏览器中都能提供良好的用户体验。



## 为 `<img>` 元素中的 SVG 设置后备方案

对于大部分 Web 开发者而言，通常是给 `<img>` 的 `src` 指定一个 `.svg` 格式文件作为图像源，将 SVG 图像应用于 Web：

```HTML
<img src="logo.svg" alt="Logo" />
```


给 `<img>` 元素中的 SVG 设置后备方案，相对而言要比 `<object>` 或 `<iframe>` 复杂一些。因为，我们首先要检测浏览器是否支持 SVG，然后根据检测结果切换 `img` 元素的 `src` 属性来实现 SVG 和其他图像格式的切换。

下面是一个示例，展示了如何使用 `svgasimg` 函数实现这一功能：

```JavaScript
function svgasimg() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
}

function switchImageSource(imgElement, svgSrc, fallbackSrc) {
    if (svgasimg()) {
        imgElement.src = svgSrc;
    } else {
        imgElement.src = fallbackSrc;
    }
}
```


注意，上面代码中的 `svgasimg()` 函数的代码来自 [SVGeezy 库](https://web.archive.org/web/20200808153404/http://benhowdle.im/svgeezy/)（也是用来实现 SVG 作为 `<img>` 元素后备方案的 JavaScript 库）。尽管这个函数用于检测 SVG 内的 `<image>` 元素，但经过测试，也适用于作为 `<img>` 元素源的 SVG。即，`svgasimg()` 函数用于检测浏览器是否支持 SVG 图像。

第二个函数 `switchImageSource()` 接受三个参数：

-   `imgElement` ：一个 `img` 元素。
-   `svgSrc` ：SVG 图像的 URL。
-   `fallbackSrc` ：备用图像的 URL。


如果浏览器支持 SVG ，则设置 `img` 元素的 `src` 属性为 SVG 图像的 URL；否则，设置为备用图像的 URL 。

来看一个简单的示例，假设你有一个 `<img>` 元素，引用了 SVG 图像，那么可以通过下面方式来给这个 `<img>` 元素的 SVG 设置后备方案：

  


```HTML
<img 
    data-svg-src="kiwi.svg" 
    data-fallback-src="kiwi.png" 
    src="kiwi.svg" alt="kiwi" />
```

  


在这个示例中，`img` 元素有两个自定义属性 `data-svg-src` 和 `data-fallback-src`，分别用于指定 SVG 图像和备用图像的 URL。


接下来，我们还需要使用 JavaScript 写一个事件监听器，在文档加载完成后，查找所有具有 `data-svg-src` 和 `data-fallback-src` 属性的 `img` 元素，并根据浏览器的 SVG 支持情况切换图像来源。


```JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const imgElements = document.querySelectorAll('img[data-svg-src][data-fallback-src]');
  
    imgElements.forEach(function(imgElement) {
        const svgSrc = imgElement.getAttribute('data-svg-src');
        const fallbackSrc = imgElement.getAttribute('data-fallback-src');
        
        switchImageSource(imgElement, svgSrc, fallbackSrc);
    });
});
```


如此一来，对于支持 SVG 的浏览器，`<img>` 的 `src` 会加载 `kiwi.svg`，否则会加载 `kiwi.png` 。


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6ba760d246c418d9eaeba152490d3ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1031&s=247415&e=jpg&b=1e8f93)

  


> Demo 地址：https://codepen.io/airen/full/bGyVzba


如果你不想自己编写 JavaScript 脚本，你也可以直接使用诸如 [SVGeezy 库](https://web.archive.org/web/20200808153404/http://benhowdle.im/svgeezy/)，它是用来实现 SVG 作为 `<img>` 后备方案的方法。如果浏览器未通过测试，它将根据需要将 SVG 替换为 PNG。例如 `<img src="kiwi.svg">` 变为 `<img src="kiwi.png">`。你需要自己创建 PNG 版本并将其放在同一目录中。


这种方法有一个明显的缺点，不支持 SVG 的浏览器可能会下载两个图像，从而影响性能。它将下载 SVG 版本（至少下载到不能使用为止），然后是 PNG 版本。


也可以使用 [SVGInjector](https://web.archive.org/web/20200808153404/https://github.com/iconic/SVGInjector) 库，它可以帮助你处理特定场景中的 `<img>` 元素中的 SVG 后备方案。它与 SVGeezy 库的方式不同，它会将 `<img>` 替换为内联 SVG。


```HTML
<img class="inject-me" src="kiwi.svg" />
```

  


```JavaScript
const mySVGsToInject = document.querySelectorAll('img.inject-me');
const injectorOptions = {
    pngFallback: 'assets/png'
};

SVGInjector(mySVGsToInject, injectorOptions);
```

  


[SVGMagic](https://web.archive.org/web/20200808153404/https://dirkgroenen.github.io/SVGMagic/) 是另一个 JavaScript 库，可以用 PNG 版本替换源，包括用于 `<img>`、背景图片甚至内联的 SVG。它的最大优点是可以通过请求第三方服务器自动为你创建 PNG 版本。不过要注意依赖关系并测试速度和可靠性。

除了依赖 JavaScript 脚本或第三库之外，还可以利用 `<picture>` 元素的特性。HTML5 的 `<picture>` 元素允许在浏览器不支持指定图像格式时使用备用图像：


```HTML
<picture>
    <source type="image/svg+xml" srcset="kiwi.svg">
    <img src="kiwi.png" alt="Kiwi" />
</picture>
```


`<picture>` 元素为我们提供了一个更好的无 JavaScript 方式来根据不同的媒体查询更改我们正在提供的图像，以及为不支持的浏览器（或由于任何原因无法加载 SVG 的浏览器）。


不幸的是，当对 SVG 的支持比对 `<picture>` 的支持更好时，这种方法不太有用。这意味着，在一些低版本浏览器中，你要使用 `<picture>` 元素为 `<img>` 的 SVG 设置备用方案，[也不得不依赖 `<picture>` 元素的 Polyfill](https://scottjehl.github.io/picturefill/)（即 **[Picturefill](https://scottjehl.github.io/picturefill/)**）。

最后一种方案是，利用内联 SVG 的 `<image>` 元素为 `<img>` 元素的 SVG 提供备用方案。你是否会觉得很奇怪，既然浏览器不支持 SVG ，内联 SVG 的 `<image>` 怎么又可以成为一种备用方案呢？


```HTML
<svg width="96" height="96">
    <image xlink:href="kiwi.svg" src="kiwi.png" width="96" height="96" />
</svg>
```


示例代码中，为 SVG 的 `<image>` 元素设置了 `src` 属性，并将其值设置为 SVG 图像的备用 URL。

尽管这可能看起来很奇怪，但 SVG 的 `<image>` 元素正好满足这些需求。SVG `<image>` 元素用于在 SVG 内嵌入其他图像文件。然而，在 HTML 中，所有测试过的浏览器都将 `<image>` 识别为 `<img>` 的非标准同义词。在 SVG 中，你使用 `xlink:href` 属性指定图像文件的 URL；在 HTML 中，你用 `src` 属性指定。


因此，在大多数浏览器中，只需在内联 SVG 中包含一个带有 `src` 属性（指向你的备用图像）的 `<image>` 标签。旧浏览器会下载备用图像，而新浏览器不会。唯一的例外是 IE，它会在不显示图像时仍然下载备用图像。解决方法是在元素上添加一个空的 `xlink:href` 属性。IE 的开发者工具仍会显示它请求后备图像，但它几乎立即中止（在 IE11 或 IE10/IE9 仿真模式下小于 1 毫秒），在下载任何内容之前就停止了。代码如下：


```HTML
<svg viewBox="-20 -20 40 40">
    <!-- SVG 代码略 -->
    <image src="fallback.png" xlink:href="" />
</svg>
```

  


## 为 CSS 背景图像中的 SVG 设置后备方案

> 特别声明，虽然标题是“为 CSS 背景图像（`background-image`）中的 SVG 设置后备方案”，但接下来提到的方案同样于 CSS 中值类型为 `<image>` 的属性，例如 `mask-image` 、`border-image` 等。

熟悉 CSS 的 Web 开发者应该知道，CSS 有着其独特规则，比如级联规则，权重大的样式规则会被应用于元素。另外，浏览器在处理 CSS 的错语规则时，它会直接将错语规则忽略，并应用级联中早先声明的规则。这意味着，我们可以利用这些独特的特性来为 CSS 背景图像中的 SVG 设置后备方案。

然而，使用 SVG 图像文件的 CSS 规则对旧版本浏览器来说是完全正确的。因此，它会应用规则，下载文件，但不知道如何处理。不过，在这里我们可以应用语法规则上的一个小技巧，这种技巧在支持 SVG 的现代浏览器中几乎都被支持，但在旧版本浏览器中却不被支持。例如，利用多背景特性，并给背景设置一个渐变。


```CSS
.kiwi {
    background: url(kiwi.png);
    background: url(kiwi.svg), linear-gradient(transparent, transparent);
}
```


如上面代码所示，如果一个浏览器同时支持多重背景和线性渐变，它也支持 SVG。因此，我们在这里用完全透明的线性渐变声明 SVG。如果在旧版浏览器中失败，上面声明的后备方案将起作用。你可能会因为现代浏览器需要计算透明渐变而略微影响性能，但这种影响可能微乎其微。

有一个小细节需要注意，应用多背景时，出现在前面的背景图像将位于最顶层，因此你需要考虑背景图片的出现的顺序，避免影响最终呈现的效果。

  


## 为内联 `<svg>` 设置后备方案


内联 SVG 是指将 SVG 代码嵌套在 HTML 文档中，这是目前使用 SVG 最受欢迎的一种方式。因为，我们可以通过 CSS 和 JavaScript 对内联 SVG 进行控制，小到设置样式，动画效果，大到动态改变 SVG 的图形，控制交互行为等。

正因为其灵活可变，使得为内联 `<svg>` 设置后备方案变得要复杂地多。

如果我们要为不支持 SVG 的浏览器提供备用方案，那么首先需要检测浏览器是否支持 SVG。这意味着，我们需要借助一些 JavaScript 脚本或第三方 JavaScript 库来检测浏览器是否支持内联 SVG。例如：

  


```JavaScript
function supportsSvg() {
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
}
```



正如上面示例代码所示，`supportSvg()` 函数会创建一个 `div` 元素，并且将一个 `<svg>` 元素赋值给这个 `div` 元素的 `innerHTML` ，然后测试其命名空间。简单地说，就是 HTML 解析器（用于解析传递给 `innerHTML` 的内容）是否能正确生成 SVG 元素。

有了这个检测函数之后，我们就可以知道浏览器是否支持内联 SVG。这也意味着，借助这个脚本我们可以做很多事情，比如动态替换内容，比如给元素切换类名等。

例如下面这个示例：

```HTML
<div class="buttons" data-codeblock>
    <button aria-label="Like">
        <span class="inline-svg" data-xlink="#icon-heart">♥</span>
    </button>

    <button aria-label="Close">
        <span class="inline-svg" data-xlink="#icon-close">Close</span>
    </button>

    <button aria-label="Menu">
        <span class="inline-svg" data-xlink="#icon-hamburger">≡</span>
    </button>

    <p>
        <a href="#">Do you <span class="inline-svg" data-xlink="#icon-heart" title="like">♥</span> me?</a>
    </p>

    <button aria-label="Like">
        <span class="inline-svg" data-xlink="#icon-heart">♥</span> Like
    </button>
</div>
```

上面代码中，`<button>` 或 `<a>` 元素中有一个包含 HTML 实体符或纯文本内容的 `<span>` 元素。与此同时，使用 SVG 提供了与 HTML 实体符相同的 SVG 图标：


```HTML
<svg class="sr-only">
    <defs>
        <symbol id="icon-heart" viewBox="0 0 32 32" fill="currentColor">
            <path d="M0 10 C0 6, 3 2, 8 2 C12 2, 15 5, 16 6 C17 5, 20 2, 24 2 C30 2, 32 6, 32 10 C32 18, 18 29, 16 30 C14 29, 0 18, 0 10  "></path>
        </symbol>
        <symbol id="icon-close" viewBox="0 0 32 32" fill="currentColor">
            <path d="M4 8 L8 4 L16 12 L24 4 L28 8 L20 16 L28 24 L24 28 L16 20 L8 28 L4 24 L12 16 z "></path>
        </symbol>
        <symbol id="icon-hamburger" viewBox="0 0 32 32" fill="currentColor">
            <path d="M3 8 A3 3 0 0 0 9 8 A3 3 0 0 0 3 8 M12 6 L28 6 L28 10 L12 10z M3 16 A3 3 0 0 0 9 16 A3 3 0 0 0 3 16 M12 14 L28 14 L28 18 L12 18z M3 24 A3 3 0 0 0 9 24 A3 3 0 0 0 3 24 M12 22 L28 22 L28 26 L12 26z "></path>
        </symbol>
    </defs>
</svg>
```


这是使用 `<symbol>` 创建的 SVG 雪碧图，它的 `id` 或与 `<span>` 元素中的 `data-xlink` 属性的值是相对应的。在这个示例中，添加一些美化按钮和链接的样式之后，不管是旧版本的浏览器，还是现代浏览器，你都能看到一个类似下图的效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e4c308ed16f4990b75f8588376126a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1031&s=205241&e=jpg&b=050505)



注意，到目前为止，上图中的 Icon 图标都还是 HTML 实体符。为了让使用现代浏览器的用户能有一个更好的体验，我们可以利用前面的检测函数 `supportsSvg()` 来检测浏览器是否支持内联 SVG，如果支持的话，将 `<span>` 替换为 `<svg>` ，并在内部使用 `<use>` 引用相应的 SVG 图标。

当然，要完成这个事情，我们需要写一点 JavaScript 脚本：

  


```JavaScript
if (supportsSvg()) {
    const inlineSvgs = document.querySelectorAll("span.inline-svg");
    
    inlineSvgs.forEach((svgElement, index) => {
        const span = inlineSvgs[index];
        const svgns = "http://www.w3.org/2000/svg";
        const xlinkns = "http://www.w3.org/1999/xlink";
        const svg = document.createElementNS(svgns, "svg");
        const use = document.createElementNS(svgns, "use");
        
        // 准备 <use> 元素
        use.setAttributeNS(xlinkns, "href", span.getAttribute("data-xlink"));
    
        // 添加 <use> 元素
        svg.appendChild(use);
    
        // 准备 SVG
        svg.setAttribute("class", "inline-svg");
    
        // 如果有必要，设置标题
        if (span.getAttribute("title")) {
          svg.setAttribute("title", span.getAttribute("title"));
        }
    
        // 注入 SVG
        span.parentNode.insertBefore(svg, span);
    
        // 移除后备内容
        span.remove();
    });
}
```

  


这个时候，在现代浏览器中，你得到的效果是 SVG 图标替代了 HTML 实体符和文本：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c57e40f600f407ba6690a112944e943~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1031&s=203806&e=jpg&b=050505)


> Demo 地址：https://codepen.io/airen/full/XWwmGmN

还有一种方式是，基于 `supportsSvg()` 检测函数将内联 SVG 替换为背景图像。例如，你使用内联 SVG 给按钮添加了个 Icon 图标：


```HTML
<button>
    <svg class="icon icon-key">
        <use xlink:href="#icon-key"></use>
    </svg>
    Sign In
</button>
```

  


使用 `supportsSvg` 函数检测浏览器是否支持内联 SVG，如果不支持，给 `<html>` 元素添加一个 `no-svg` 的类名：

  


```JavaScript
if (!supportsSvg()) {
    document.documentElement.classList.add("no-svg");
}
```

  


如此一来，你可以使用新添加的类在需要时应用 `background-image`：


```CSS
html.no-svg .icon-key {
    background: url(icon-key.png) no-repeat;
}
```



通过这种方式，即使浏览器完全不支持 SVG 元素，按钮仍然会显示带有备用图像的图标。这种方法确保了所有用户都能看到图标，无论他们的浏览器是否支持 SVG。不足之处是，你需要为每个内联 SVG 创建备用图片。你也可以使用 [Grunticon 构建工具](https://github.com/filamentgroup/grunticon)帮做这些事情。


为了获得尽可能深的支持，你可以使用一个 HTML 元素（例如， `<span>`）来包裹 `<svg>` ，并将背景应用于 `<span>` 元素，这样即使浏览器完全不支持 `<svg>` 元素，备用方案仍然可以在 `<span>` 元素上工作：


```HTML
<button>
    <span class="icon icon-key">
        <svg>
            <use href="#icon-key"></use>
        </svg>
    </span>
    Sign In
</button>
```

  


```CSS
html.no-svg {
    .icon {
        display: inline-flex;
        width: 33px;
        height: 33px;
      
        > * {
            display: none;
        }
    }
    
    .icon-key {
        background: url(icon-key.png) no-repeat;
    }
    
    .icon-cart {
        background: url(icon-cart.png)  no-repeat;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03d99a524de04656bf4da3ce894db78f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1031&s=185908&e=jpg&b=050505)

> Demo 地址：https://codepen.io/airen/full/LYopaBB


除了上述提到的方案之外，还可以使用一些粗暴的备用方案。比如，在内联 SVG 代码中嵌入提示文本：


```XML
<svg viewBox="0 0 1024 1024">
    <!-- 提示文本 -->
    对不起，你的浏览器不支持 SVG!
    
    <path d="M-55.9,187.1h-60.7c-0.3-8.4-7.1-15.1-15.6-15.1l-1.3,0c-8.6,0-15.6,7-15.6,15.6v12.7c0,8.6,7,15.6,15.6,15.6l1.3,0 c8.4,0,15.3-6.7,15.6-15.1h36.3v12.6h6.9v-9.2h6.9v9.2h6.9v-12.6h3.8c3.8,0,6.9-3.1,6.9-6.9C-49,190.2-52.1,187.1-55.9,187.1z M-126.1,200.4c0,3.3-2.7,6-6,6.1h-1.3c-3.3,0-6-2.7-6-6.1v-12.7c0-3.3,2.7-6,6-6.1h1.3c3.3,0,6,2.7,6,6.1 C-126.1,187.6-126.1,200.4-126.1,200.4z" />
    
    <!-- 提标文本 -->
    <a href="http://browsehappy.com/?locale=en">请点击这里更新您的浏览器！</a>
</svg>
```


这是因为，支持 SVG 的浏览器会忽略这些文本。SVG 中只有放置在 `<text>` 元素的文本才会显示出来。另外，你还可以在 `<svg>` 中使用其他的 HTML 元素，例如上面代码中的 `<a>` 元素。如此一来，不支持 SVG 的浏览器就会显示这些提示信息。

为了不破坏 SVG ，你可以将这些提示信息放在 SVG 的 `<desc>` 元素内，它允许包含来自其他命名空间的内容：

```XML
<<svg viewBox="0 0 1024 1024">
    <!-- 提示文本 -->
    <desc>
        <p>对不起，你的浏览器不支持 SVG!<a href="http://browsehappy.com/?locale=en">请点击这里更新您的浏览器！</a></p>
    </desc>
    
    <path d="M-55.9,187.1h-60.7c-0.3-8.4-7.1-15.1-15.6-15.1l-1.3,0c-8.6,0-15.6,7-15.6,15.6v12.7c0,8.6,7,15.6,15.6,15.6l1.3,0 c8.4,0,15.3-6.7,15.6-15.1h36.3v12.6h6.9v-9.2h6.9v9.2h6.9v-12.6h3.8c3.8,0,6.9-3.1,6.9-6.9C-49,190.2-52.1,187.1-55.9,187.1z M-126.1,200.4c0,3.3-2.7,6-6,6.1h-1.3c-3.3,0-6-2.7-6-6.1v-12.7c0-3.3,2.7-6,6-6.1h1.3c3.3,0,6,2.7,6,6.1 C-126.1,187.6-126.1,200.4-126.1,200.4z" />
</svg>
```

  


## SVG 的兼容性

SVG 在现代浏览器中得到了广泛的支持，但一些较旧的浏览器和某些特性可能会有不同程度的兼容性问题。

以下是关于 SVG 浏览器兼容性的详细信息。

### 主要浏览器对 SVG 的支持情况

-   **Google Chrome**：从 4.0 版本开始全面支持 SVG。
-   **Mozilla Firefox**：从 1.5 版本开始全面支持 SVG。
-   **Safari**：从 3.0 版本开始全面支持 SVG。
-   **Opera**：从 9.0 版本开始全面支持 SVG。
-   **Microsoft Edge**：从第一个版本（基于 Chromium 的版本）开始全面支持 SVG。
-   **Internet Explorer**：IE 9 及以上版本支持大部分 SVG 特性。IE 8 及以下版本不支持 SVG。


### 特定 SVG 特性的兼容性

尽管大多数现代浏览器都支持 SVG，但某些高级特性在不同浏览器中的支持情况可能有所不同，例如：

-   **SVG 动画**：现代浏览器通常支持 SMIL 动画，但有些浏览器（例如 Microsoft Edge）更推荐使用 CSS 或 JavaScript 进行动画。
-   **SVG 滤镜**：大多数现代浏览器都支持基本的 SVG 滤镜效果，但某些复杂的滤镜可能存在兼容性问题。
-   **SVG 外部文件引用**：对于通过 `<use>` 元素引用的外部 SVG 文件，不同浏览器的支持情况可能有所不同，尤其是在跨域请求时需要注意 CORS 设置。



### 处理 SVG 兼容性问题的策略

为了确保网站在所有浏览器中都有良好的用户体验，可以采取前面提到的相关备用方案和降级策略来处理 SVG 的兼容性问题。

换言之，可通过优雅降级和渐进式增强两种策略，针对 SVG 不同的使用方式提供有效地处理 SVG 在不同浏览器中的兼容性问题，确保网站在各种设备和浏览器上都有一致的用户体验。