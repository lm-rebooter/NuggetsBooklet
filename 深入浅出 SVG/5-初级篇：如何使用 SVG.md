![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a072d1aa113d4ed1ad7f7e90176147e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=706&s=74677&e=png&b=354e78)

  


[通过前面的课程学习，我们已经对 SVG 有了全面的了解](https://juejin.cn/book/7341630791099383835/section/7342031804691382298)，深刻认识到它为我们在 Web 应用或网站中的应用提供了理想的解决方案。SVG 之所以备受推崇，并非仅因为它能以矢量形式存储图像，使得图像在各种尺寸下都能保持清晰。更为重要的是，SVG 是一项强大的 Web 技术，为开发者提供了丰富而灵活的工具。它能够轻松创造简单的图标，也能构建复杂的图形和动画。因此，我们深刻认识到熟悉掌握 SVG 对于 Web 开发者来说具有重要意义。

  


那么，为何我们要强调学习如何使用 SVG 呢？在过去的一段时间里，SVG 常常被认为是较为复杂和陌生的技术，许多 Web 开发者因此望而却步。然而，正是在这种相对被忽视的状态下，SVG 蕴藏了许多令人惊艳的特性。从表单焦点的高亮效果到汉堡菜单变身关闭图标，再到熔岩灯效果的微妙变换，SVG 为我们提供了丰富多彩的可能性，可用于改进并赋予 Web 以生机。

  


这节课的目标是带领大家深入了解在 Web 中如何使用 SVG。我们将掌握在 HTML、CSS 和 JavaScript 中多种方式，以便在 Web 应用或网站中充分利用 SVG。通过实例和详细解说，你将更加深入理解 SVG 的各种应用场景。让我们共同踏上这段关于 SVG 的精彩之旅，为你的 Web 开发技能注入新的活力。

  


## SVG 是什么？

  


在小册的《[初级篇：SVG 简介](https://juejin.cn/book/7341630791099383835/section/7342031804691382298#heading-0)》一课中，详细阐述了 SVG 是什么？

  


官方的定义称其为**一种用于描述二维矢量图形的** **XML 标记语言**。然而，对于 Web 开发者而言，SVG 既是图像资源，又是代码，类似于 HTML。

  


从图像的角度来看，SVG 可以被视为内容或 UI：

  


-   内容：SVG 图形会根据 Web 内容而变化
-   UI：与 Web 设计密切相关的任何元素

这意味着 SVG 既可以作为普通图像应用于 Web （作为内容），也可以作为样式应用于 Web （作为 UI）。在这个时候，它仅仅类似于 JPG、PNG 等格式的图片资源。

  


从代码角度看，SVG 是一种类似 HTML 的代码，可以直接用于源码开发中，例如嵌套在 HTML 中或者与其他框架（如 React、Vue 或 Next 等）集成在一起。在这种情况下， SVG 只是代码，是一种可以绘制图形的代码。

  


换句话说，SVG 在不同角色下在 Web 中的应用方式会有所不同，其作用也会略有差异。接下来，我们将深入探讨在 Web 开发中使用 SVG 的多种方法。

## Web 中如何使用

  


在 Web 开发过程当中，我们可以以多种不同的方式分别在 HTML 、CSS 或 JavaScript 中使用 SVG。

  


### HTML 中的 SVG

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/507e12e6567b49fd8f57374e890550d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=900&s=183060&e=jpg&b=f9fcd9)

  


在 HTML 中，SVG 扮演着丰富而多才的角色，为 Web 开发者提供了一种强大的图形描述语言。借助 HTML 中的SVG，开发者能够更好地掌握图形呈现的细节，并将其融入到整个 Web 布局中，为用户呈现出精彩纷呈的视觉效果。

  


在 HTML 中，我们至少有六种不同的方式可以使用 SVG ，这些不同的使用方式可以划分为三种类型：

  


-   SVG 作为普通图像应用于 HTML 中
-   SVG 以内联方式嵌套在 HTML 中
-   SVG 以 Data URIs 方式应用于 HTML 中

  


#### SVG 作为普通图像应用于 HTML 中

  


使用 SVG 的最直接方式是将其视为图像，类似于我们处理JPG、PNG和GIF等格式的图像。在 HTML 中使用时，我们可以依然信赖我们的老朋友 `<img>` 标签：

  


```HTML
<img src="dog.svg" alt="dog" />
```

  


通常情况下，如果需要，可以添加 `<img>` 元素的属性，如宽度（`width`）、高度（`height`）和 `alt`等。

  


当 SVG 以这种方式应用于 HTML 时，浏览器将其视为任何其他图像。出于安全原因，SVG 文件中的任何脚本、外部样式表、链接和其他 SVG 交互性都将被禁用。

  


如果在单个 SVG 中定义了多个图像，可以使用目标锚点，例如`icons.svg#heart`：

  


```HTML
<img src="icons.svg#heart" alt="heart" width="32" height="32" />
```

  


但请注意，在较旧的浏览器中，这种方式可能不起作用。有关 SVG 片段标识符的详细介绍，可以参考小册中相关内容。

  


当 SVG 以文件方式直接嵌入 `<img>` 元素时，默认情况下，页面上显示的图像尺寸将与 SVG 文件的实际大小相同，不会发生任何变化。然而，你可以通过为 `<img>` 元素显式设置 `width` 或 `height` 来调整其大小，就像你对 JPG 或 PNG 所做的那样。例如：

  


```HTML
<img src="kiwi.svg" alt="站在椭圆上的猕猴" />
<img src="kiwi.svg" alt="站在椭圆上的猕猴" width="200" />
<img src="kiwi.svg" alt="站在椭圆上的猕猴" height="150" />
<img src="kiwi.svg" alt="站在椭圆上的猕猴" width="200" height="150" />
```

  


你也可以通过 CSS 来调整 SVG 图像的大小：

  


```HTML
<img src="kiwi.svg" alt="站在椭圆上的猕猴" width="200" height="150" class="papa" />
```

  


```CSS
.papa {
    width: 300px;
}
```

  


示例中的 `kiwi.svg` 文件的原始大小是 `612px x 502px` ，更改尺寸之后，在页面上显示的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0d164fe4ebf4f4590683d59b4d8cde7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1196&s=387216&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/OJGMagj

  


另外，你还可以使用 CSS 以与其他图像相同的方式使用 `transform` 、`filter` 等来操作 SVG ，例如上面示例中给 `img` 设置了渐变背景、混合模式等样式：

  


```CSS
img {
    display: block;
    background: linear-gradient(228deg, #14cb16, #bcdf18);
    mix-blend-mode: difference;
    border-radius: 0.2em;
}
```

  


稍微不同的是，由于 SVG 可以无限缩放，因此结果通常优于 JPG、PNG 等传统格式的位图。

  


在引用 SVG 时，有一点需要特别注意。在创建响应式的 Web 应用或网站时，通常会根据图像容器的宽度或图像本身的宽度（取决于哪个较小）来调整图像（`<img>`）的大小。一般情况下，可以通过以下 CSS 来确保图像响应容器的尺寸：

  


```CSS
img {
    display: block;
    max-width: 100%;
    height: auto;
}
```

  


然而，使用在 `<img>` 标签中的 SVG 可能没有隐式的尺寸。你可能会发现最大宽度（`max-width`）被计算为 `0`，导致 SVG 图像在页面上完全消失。为了避免这个问题，请确保你引用的 SVG 文件中的 `<svg>` 元素显式定义了默认的宽度（`width`）和高度（`height`）：

  


```XML
<svg width="612" height="502.174" xmlns="http://www.w3.org/2000/svg" viewBox="0 65.326 612 502.174">
    <ellipse cx="283.5" cy="487.5" fill="#C6C6C6" rx="259" ry="80"/>
    <path d="M210.333 65.331c-105.966.774-222.682 85.306-209.277 211.118 4.303 40.393 18.533 63.704 52.171 79.03 36.307 16.544 57.022 54.556 50.406 112.954-9.935 4.88-17.405 11.031-19.132 20.015 7.531-.17 14.943-.312 22.59 4.341 20.333 12.375 31.296 27.363 42.979 51.72 1.714 3.572 8.192 2.849 8.312-3.078.17-8.467-1.856-17.454-5.226-26.933-2.955-8.313 3.059-7.985 6.917-6.106 6.399 3.115 16.334 9.43 30.39 13.098 5.392 1.407 5.995-3.877 5.224-6.991-1.864-7.522-11.009-10.862-24.519-19.229-4.82-2.984-.927-9.736 5.168-8.351l20.234 2.415c3.359.763 4.555-6.114.882-7.875-14.198-6.804-28.897-10.098-53.864-7.799-11.617-29.265-29.811-61.617-15.674-81.681 12.639-17.938 31.216-20.74 39.147 43.489-5.002 3.107-11.215 5.031-11.332 13.024 7.201-2.845 11.207-1.399 14.791 0 17.912 6.998 35.462 21.826 52.982 37.309 3.739 3.303 8.413-1.718 6.991-6.034-2.138-6.494-8.053-10.659-14.791-20.016-3.239-4.495 5.03-7.045 10.886-6.876 13.849.396 22.886 8.268 35.177 11.218 4.483 1.076 9.741-1.964 6.917-6.917-3.472-6.085-13.015-9.124-19.18-13.413-4.357-3.029-3.025-7.132 2.697-6.602 3.905.361 8.478 2.271 13.908 1.767 9.946-.925 7.717-7.169-.883-9.566-19.036-5.304-39.891-6.311-61.665-5.225-43.837-8.358-31.554-84.887 0-90.363 29.571-5.132 62.966-13.339 99.928-32.156 32.668-5.429 64.835-12.446 92.939-33.85 48.106-14.469 111.903 16.113 204.241 149.695 3.926 5.681 15.819 9.94 9.524-6.351-15.893-41.125-68.176-93.328-92.13-132.085-24.581-39.774-14.34-61.243-39.957-91.247-21.326-24.978-47.502-25.803-77.339-17.365-23.461 6.634-39.234-7.117-52.98-31.273-29.365-51.617-81.947-74.215-137.452-73.811zM445.731 203.01c6.12 0 11.112 4.919 11.112 11.038 0 6.119-4.994 11.111-11.112 11.111s-11.038-4.994-11.038-11.111a11.01 11.01 0 0 1 11.038-11.038z"/>
</svg>
```

  


> 注意，响应式 Web 设计中，处理图片的响应是最麻烦的，如果你对这方面知识感兴趣的话，请移步阅读《[响应式图片：防止图片的拉伸或挤压](https://juejin.cn/book/7199571709102391328/section/7199845663143067660)》！

  


使用 `<img>` 标签加载 SVG 存在两个较为复杂的问题，首先是备用图像的处理。当需要兼容一些较低版本的浏览器时，必须考虑为 SVG 图像提供 JPG 或 PNG 的替代品。其次是响应式 Web 设计，需要使用媒体查询根据不同视口大小提供不同的图像源。

  


为了解决这两个问题，我们可以采用 HTML5 的 `<picture>` 元素。首先，让我们从为 SVG 图像提供备用图像入手。你只需在 `<picture>` 元素中使用 `<img>` 标签引用备用图片，在 `<source>` 元素中引用你的 SVG。例如：

  


```HTML
<picture>
    <source type="image/svg+xml" srcset="path/to/image.svg">
    <img src="path/to/fallback.png" alt="Image description">
</picture>
```

  


`<picture>` 元素中的 `<source>` 元素负责加载所需的图像，而 `<img>` 元素则提供备用图片。对于 `<picture>` 的正常工作， `<img>` 元素是必不可少的，用于为不支持 `<picture>` 或者像我们这里所述的情况，无法加载或不支持 `<source>` 元素中加载的图像类型（例如 `.svg`）的浏览器提供向后兼容。

  


`<source>` 元素是我们指定所需图像的地方。我们在类型属性（`type`）中指定所需图像的类型（SVG），并在 `srcset` 属性中提供图像的 `URL`。这就是提供 SVG 图像备用的简单方法。

  


如果考虑屏幕分辨率，你还可以通过使用 `<img>` 的 `srcset` 属性为 SVG 图像提供多个备用图像。例如：

  


```HTML
<picture>
    <source type="image/svg+xml" srcset="path/to/image.svg">
    <img src="path/to/fallback-1x.png" srcset="path/to/fallback-2x.png 2x, path/to/fallback-3x.png 3x" alt="Image description">
</picture>
```

  


浏览器可以根据屏幕分辨率选择它认为合适的图像。这对于在为更高分辨率提供 `2x` 和 `3x` 版本的同时提供相同大小的相同图像尺寸非常有用。

  


如果愿意的话，你还可以更进一步。借助 `<img>` 的 `sizes` 属性，可以使用媒体查询在不同屏幕尺寸下调整备用图像的大小，以便为较大的屏幕提供更大的图像，为较小的屏幕提供较小的图像。

  


```HTML
<picture>
    <source type="image/svg+xml" srcset="path/to/image.svg">
    <img
      sizes="(width >= 640px) 80vw, 100vw"
      srcset="fallback-300.jpg 300w,
              fallback-400.jpg 400w,
              fallback-700.jpg 700w,
              fallback-1200.jpg 1200w,
              fallback-1600.jpg 1600w,
              fallback-2000.jpg 2000w"
      src="fallback.jpg"
      alt="Image description">
</picture>
```

  


上述代码中的 `sizes` 属性告知浏览器该图像在页面上的占用空间。在这种情况下，如果浏览器视口宽度大于或等于 `640px`，则图像将占据浏览器视口宽度的 `80%`，否则占据视口宽度的 `100%`。接着，在 `srcset` 属性中，我们提供了一系列图像源，它们都是相同的图像，只是尺寸不同。根据 `sizes` 中指定的大小，浏览器将在这些图像中选择最合适的并显示出来。如果浏览器不支持 `<img>` 的 `srcset` 属性，它将仅显示 `src` 属性中指定的备用图像。

  


使用 `<picture>` 不仅可以为 SVG 提供备用图片，还能在不同屏幕上加载不同的 SVG。我们可以在 `<source>` 元素上添加 `media` 属性。该属性赋予我们媒体查询的能力，可以根据媒体查询的条件来选择合适的 SVG，类似于使用 CSS 媒体查询更改背景图像的方式。

  


由于我们使用的是 SVG 图像，其最大特性是可以无限缩放，因此我们无需为不同屏幕分辨率提供多个版本的 SVG 图像，依然能够保持在任何分辨率下呈现出色。然而，如果我们为桌面端提供一个 SVG，例如用于横幅的 SVG 插图，该 SVG 可能会有数百千字节大小。从性能的角度来看，为小屏幕加载相同的 SVG 图像可能并不是一个明智之举。此外，也许你不想在较小屏幕上提供相同的图像，而是想提供该图像的“裁剪”版本。

  


在这种情况下，你可以利用 `<source>` 上的 `media` 属性，根据不同媒体条件指定加载不同的 SVG。在 `media` 属性中，你可以像在[ CSS 媒体查询中一样定义媒体条件](https://juejin.cn/book/7223230325122400288/section/7257368158451793935)。

  


```HTML
<picture>
    <source
        media="(width <= 640px )"
        srcset="image--small.svg"
        type="image/svg+xml">
    <source
        media="(width <= 1024px)"
        srcset="image--medium.svg"
        type="image/svg+xml">
    <source
        srcset="image--full.svg"
        type="image/svg+xml">

    <img src="fallback.jpg" alt="Image description..">
</picture>
```

  


事实上，`<picture>` 元素提供的选项几乎涵盖了任何情况。这里只是向大家阐述了，使用 `<picture>` 元素可以为 `<img>` 加载 SVG 图像提供备用图像，或者根据不同媒体条件更改 SVG 图像。

  


在 HTML 中，除了使用 `<img>` 和 `<picture>` 加载 SVG 之外，还可以使用 `<iframe>` 、`<object>` 和 `<embed>` 等元素加载 SVG。

  


```HTML
<iframe src="./image.svg"></iframe>

<object type="image/svg+xml" data="./image.svg">
    <img src="./fallback.png" />
</object>

<embed type="image/svg+xml" src="./image.svg"></embed>
```

  


使用 `<iframe>`、`<object>` 和 `<embed>` 等元素加载 SVG 图像各自有其优缺点，取决于具体的使用场景和需求。

  


-   使用 `<iframe>` 元素能够加载包含互动性的 SVG 图像，因为它允许加载完整的 HTML 文档，并提供了一个隔离的环境，确保 SVG 图像不会与主文档的样式和脚本发生冲突。然而，它会引入额外的文档结构，可能增加页面复杂性，尤其在处理简单的 SVG 图像时，使用 `<iframe>` 可能显得过于繁琐。
-   使用 `<object>` 元素支持在文档中嵌套多个 `<object>` 元素，每个元素可以加载不同的 SVG 图像，并提供备用图像以增强兼容性。然而，在某些情况下，可能与 CSS 样式和 JavaScript 交互产生问题，同时需要添加额外的标记和属性。
-   `<embed>` 元素简单易用，只需一个标签和少量属性即可嵌入 SVG 图像。但对于复杂的 SVG 图像，可能不如其他元素提供的灵活性。

  


根据具体需求选择合适的元素加载 SVG 图像。如果需要互动性且希望在独立的环境中加载 SVG，可选择 `<iframe>`。若需要嵌套多个 SVG 或提供备用内容，可选择 `<object>`。对于简单场景，`<embed>` 是一个轻量级的选择。然而，在当前的 Web 开发中，个人建议避免使用这几个元素来给 HTML 加载 SVG 图像，特别是 `<object>` 和 `<embed>` 元素。

  


#### HTML 内联 SVG

  


如果你曾经查看过 SVG 文件的内部结构（只需在你喜欢的文本或代码编辑器中打开一个 `.svg` 文件），你会发现它是一系列奇怪的尖括号和看起来类似于 HTML 内容的文本。例如，使用 VSCode 文本编辑器打开 kiwi.svg 文件，你会看到如下的 SVG 内容：

  


```XML
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 16.0.4, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
    y="0px" width="612px" height="502.174px" viewBox="0 65.326 612 502.174" enable-background="new 0 65.326 612 502.174"
    xml:space="preserve">
    <ellipse fill="#C6C6C6" cx="283.5" cy="487.5" rx="259" ry="80" />
    <path id="bird" d="M210.333,65.331C104.367,66.105-12.349,150.637,1.056,276.449c4.303,40.393,18.533,63.704,52.171,79.03
    c36.307,16.544,57.022,54.556,50.406,112.954c-9.935,4.88-17.405,11.031-19.132,20.015c7.531-0.17,14.943-0.312,22.59,4.341
    c20.333,12.375,31.296,27.363,42.979,51.72c1.714,3.572,8.192,2.849,8.312-3.078c0.17-8.467-1.856-17.454-5.226-26.933
    c-2.955-8.313,3.059-7.985,6.917-6.106c6.399,3.115,16.334,9.43,30.39,13.098c5.392,1.407,5.995-3.877,5.224-6.991
    c-1.864-7.522-11.009-10.862-24.519-19.229c-4.82-2.984-0.927-9.736,5.168-8.351l20.234,2.415c3.359,0.763,4.555-6.114,0.882-7.875
    c-14.198-6.804-28.897-10.098-53.864-7.799c-11.617-29.265-29.811-61.617-15.674-81.681c12.639-17.938,31.216-20.74,39.147,43.489
    c-5.002,3.107-11.215,5.031-11.332,13.024c7.201-2.845,11.207-1.399,14.791,0c17.912,6.998,35.462,21.826,52.982,37.309
    c3.739,3.303,8.413-1.718,6.991-6.034c-2.138-6.494-8.053-10.659-14.791-20.016c-3.239-4.495,5.03-7.045,10.886-6.876
    c13.849,0.396,22.886,8.268,35.177,11.218c4.483,1.076,9.741-1.964,6.917-6.917c-3.472-6.085-13.015-9.124-19.18-13.413
    c-4.357-3.029-3.025-7.132,2.697-6.602c3.905,0.361,8.478,2.271,13.908,1.767c9.946-0.925,7.717-7.169-0.883-9.566
    c-19.036-5.304-39.891-6.311-61.665-5.225c-43.837-8.358-31.554-84.887,0-90.363c29.571-5.132,62.966-13.339,99.928-32.156
    c32.668-5.429,64.835-12.446,92.939-33.85c48.106-14.469,111.903,16.113,204.241,149.695c3.926,5.681,15.819,9.94,9.524-6.351
    c-15.893-41.125-68.176-93.328-92.13-132.085c-24.581-39.774-14.34-61.243-39.957-91.247
    c-21.326-24.978-47.502-25.803-77.339-17.365c-23.461,6.634-39.234-7.117-52.98-31.273C318.42,87.525,265.838,64.927,210.333,65.331
    z M445.731,203.01c6.12,0,11.112,4.919,11.112,11.038c0,6.119-4.994,11.111-11.112,11.111s-11.038-4.994-11.038-11.111
    C434.693,207.929,439.613,203.01,445.731,203.01z" />
</svg>
```

  


请注意，上述的 SVG 是通过 Adobe Illustrator 图形编辑软件制作并导出的，其中包含了一些不必要的信息。你可以通过使用 [SVGOMG 工具](https://jakearchibald.github.io/svgomg/)对其进行优化，以使 SVG 代码更为简洁。

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" width="612" height="502.174" viewBox="0 65.326 612 502.174">
    <ellipse cx="283.5" cy="487.5" fill="#C6C6C6" rx="259" ry="80"/>
    <path d="M210.333 65.331c-105.966.774-222.682 85.306-209.277 211.118 4.303 40.393 18.533 63.704 52.171 79.03 36.307 16.544 57.022 54.556 50.406 112.954-9.935 4.88-17.405 11.031-19.132 20.015 7.531-.17 14.943-.312 22.59 4.341 20.333 12.375 31.296 27.363 42.979 51.72 1.714 3.572 8.192 2.849 8.312-3.078.17-8.467-1.856-17.454-5.226-26.933-2.955-8.313 3.059-7.985 6.917-6.106 6.399 3.115 16.334 9.43 30.39 13.098 5.392 1.407 5.995-3.877 5.224-6.991-1.864-7.522-11.009-10.862-24.519-19.229-4.82-2.984-.927-9.736 5.168-8.351l20.234 2.415c3.359.763 4.555-6.114.882-7.875-14.198-6.804-28.897-10.098-53.864-7.799-11.617-29.265-29.811-61.617-15.674-81.681 12.639-17.938 31.216-20.74 39.147 43.489-5.002 3.107-11.215 5.031-11.332 13.024 7.201-2.845 11.207-1.399 14.791 0 17.912 6.998 35.462 21.826 52.982 37.309 3.739 3.303 8.413-1.718 6.991-6.034-2.138-6.494-8.053-10.659-14.791-20.016-3.239-4.495 5.03-7.045 10.886-6.876 13.849.396 22.886 8.268 35.177 11.218 4.483 1.076 9.741-1.964 6.917-6.917-3.472-6.085-13.015-9.124-19.18-13.413-4.357-3.029-3.025-7.132 2.697-6.602 3.905.361 8.478 2.271 13.908 1.767 9.946-.925 7.717-7.169-.883-9.566-19.036-5.304-39.891-6.311-61.665-5.225-43.837-8.358-31.554-84.887 0-90.363 29.571-5.132 62.966-13.339 99.928-32.156 32.668-5.429 64.835-12.446 92.939-33.85 48.106-14.469 111.903 16.113 204.241 149.695 3.926 5.681 15.819 9.94 9.524-6.351-15.893-41.125-68.176-93.328-92.13-132.085-24.581-39.774-14.34-61.243-39.957-91.247-21.326-24.978-47.502-25.803-77.339-17.365-23.461 6.634-39.234-7.117-52.98-31.273-29.365-51.617-81.947-74.215-137.452-73.811zM445.731 203.01c6.12 0 11.112 4.919 11.112 11.038 0 6.119-4.994 11.111-11.112 11.111s-11.038-4.994-11.038-11.111a11.01 11.01 0 0 1 11.038-11.038z"/>
</svg>
```

  


上述的 SVG 代码是不是与 HTML 代码相似？这是因为它们本质上都是 XML，都使用了具有尖括号和内部内容的命名标签。在这个 SVG 文件中，设计由两个元素组成，分别是 `<ellipse>` 和 `<path>`。我们可以直接将上述的 SVG 代码嵌入到 HTML 中，这样 SVG 就成为了 DOM 的一部分。你可以像对待其他 HTML 元素一样为其添加类名，并且可以通过使用 CSS 和 JavaScript 进行相应的操作。

  


```HTML
<body>
    <svg xmlns="http://www.w3.org/2000/svg" width="612" height="502.174" viewBox="0 65.326 612 502.174" class="svg">
       <ellipse class="ground" cx="283.5" cy="487.5" fill="#C6C6C6" rx="259" ry="80"/>
       <path class="kiwi" d="M210.333 65.331c-105.966.774-222.682 85.306-209.277 211.118 4.303 40.393 18.533 63.704 52.171 79.03 36.307 16.544 57.022 54.556 50.406 112.954-9.935 4.88-17.405 11.031-19.132 20.015 7.531-.17 14.943-.312 22.59 4.341 20.333 12.375 31.296 27.363 42.979 51.72 1.714 3.572 8.192 2.849 8.312-3.078.17-8.467-1.856-17.454-5.226-26.933-2.955-8.313 3.059-7.985 6.917-6.106 6.399 3.115 16.334 9.43 30.39 13.098 5.392 1.407 5.995-3.877 5.224-6.991-1.864-7.522-11.009-10.862-24.519-19.229-4.82-2.984-.927-9.736 5.168-8.351l20.234 2.415c3.359.763 4.555-6.114.882-7.875-14.198-6.804-28.897-10.098-53.864-7.799-11.617-29.265-29.811-61.617-15.674-81.681 12.639-17.938 31.216-20.74 39.147 43.489-5.002 3.107-11.215 5.031-11.332 13.024 7.201-2.845 11.207-1.399 14.791 0 17.912 6.998 35.462 21.826 52.982 37.309 3.739 3.303 8.413-1.718 6.991-6.034-2.138-6.494-8.053-10.659-14.791-20.016-3.239-4.495 5.03-7.045 10.886-6.876 13.849.396 22.886 8.268 35.177 11.218 4.483 1.076 9.741-1.964 6.917-6.917-3.472-6.085-13.015-9.124-19.18-13.413-4.357-3.029-3.025-7.132 2.697-6.602 3.905.361 8.478 2.271 13.908 1.767 9.946-.925 7.717-7.169-.883-9.566-19.036-5.304-39.891-6.311-61.665-5.225-43.837-8.358-31.554-84.887 0-90.363 29.571-5.132 62.966-13.339 99.928-32.156 32.668-5.429 64.835-12.446 92.939-33.85 48.106-14.469 111.903 16.113 204.241 149.695 3.926 5.681 15.819 9.94 9.524-6.351-15.893-41.125-68.176-93.328-92.13-132.085-24.581-39.774-14.34-61.243-39.957-91.247-21.326-24.978-47.502-25.803-77.339-17.365-23.461 6.634-39.234-7.117-52.98-31.273-29.365-51.617-81.947-74.215-137.452-73.811zM445.731 203.01c6.12 0 11.112 4.919 11.112 11.038 0 6.119-4.994 11.111-11.112 11.111s-11.038-4.994-11.038-11.111a11.01 11.01 0 0 1 11.038-11.038z"/>
    </svg>
</body>
```

  


在这种情况下，你无需在 `<svg>` 元素上显式指定宽度（`width`）或高度（`height`）属性，因为你可以直接在 CSS 中控制 SVG 的尺寸。例如：

  


```CSS
.svg {
    display: block;
    width: 80vh;
    height: auto;
}
```

  


然而，为 `<svg>` 元素指定尺寸可以确保在没有应用 CSS 时，SVG 不会不适当地调整大小。

  


值得注意的是，SVG 元素类似于 HTML 元素，可以被 CSS 选择器定位，并使用标准 SVG 属性作为 CSS 属性进行样式修改。例如：

  


```CSS
.kiwi {
    fill: oklch(0.73 0.19 59.23);
}

.ground {
    fill:oklch(0.63 0.15 66.55 / 0.6);
    stroke-width: 10;
    stroke: oklch(0.72 0.18 63.87 / 0.75);
}
```

  


这会覆盖 SVG 中定义的任何属性，因为 CSS 的优先级更高。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d2424aa9d464c4db1651e1e787939f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1196&s=279844&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/xxeZmNp

  


SVG CSS 样式提供了几个优势：

  


-   基于属性的样式可以完全从 SVG 中删除，使 SVG 代码变得更简洁
-   CSS 样式可以在任意数量的页面上重用，适用于任意数量的 SVG
-   整个 SVG 或图像的各个元素可以使用 `:hover`、`transition`、`animation` 等应用 CSS 效果

  


更酷的是，你还可以使用 SVG 的滤镜特性，为 SVG 添加一些花里胡哨的效果。例如：

  


```HTML
<body>
    <svg xmlns="http://www.w3.org/2000/svg" width="612" height="502.174" viewBox="0 65.326 612 502.174" class="svg">
      <defs>
          <filter id="blurEffect">
              <feGaussianBlur stdDeviation="5" />
          </filter>
      </defs>
      <ellipse class="ground" cx="283.5" cy="487.5" fill="#C6C6C6" rx="259" ry="80" />
      <path class="kiwi" d="M210.333 65.331c-105.966.774-222.682 85.306-209.277 211.118 4.303 40.393 18.533 63.704 52.171 79.03 36.307 16.544 57.022 54.556 50.406 112.954-9.935 4.88-17.405 11.031-19.132 20.015 7.531-.17 14.943-.312 22.59 4.341 20.333 12.375 31.296 27.363 42.979 51.72 1.714 3.572 8.192 2.849 8.312-3.078.17-8.467-1.856-17.454-5.226-26.933-2.955-8.313 3.059-7.985 6.917-6.106 6.399 3.115 16.334 9.43 30.39 13.098 5.392 1.407 5.995-3.877 5.224-6.991-1.864-7.522-11.009-10.862-24.519-19.229-4.82-2.984-.927-9.736 5.168-8.351l20.234 2.415c3.359.763 4.555-6.114.882-7.875-14.198-6.804-28.897-10.098-53.864-7.799-11.617-29.265-29.811-61.617-15.674-81.681 12.639-17.938 31.216-20.74 39.147 43.489-5.002 3.107-11.215 5.031-11.332 13.024 7.201-2.845 11.207-1.399 14.791 0 17.912 6.998 35.462 21.826 52.982 37.309 3.739 3.303 8.413-1.718 6.991-6.034-2.138-6.494-8.053-10.659-14.791-20.016-3.239-4.495 5.03-7.045 10.886-6.876 13.849.396 22.886 8.268 35.177 11.218 4.483 1.076 9.741-1.964 6.917-6.917-3.472-6.085-13.015-9.124-19.18-13.413-4.357-3.029-3.025-7.132 2.697-6.602 3.905.361 8.478 2.271 13.908 1.767 9.946-.925 7.717-7.169-.883-9.566-19.036-5.304-39.891-6.311-61.665-5.225-43.837-8.358-31.554-84.887 0-90.363 29.571-5.132 62.966-13.339 99.928-32.156 32.668-5.429 64.835-12.446 92.939-33.85 48.106-14.469 111.903 16.113 204.241 149.695 3.926 5.681 15.819 9.94 9.524-6.351-15.893-41.125-68.176-93.328-92.13-132.085-24.581-39.774-14.34-61.243-39.957-91.247-21.326-24.978-47.502-25.803-77.339-17.365-23.461 6.634-39.234-7.117-52.98-31.273-29.365-51.617-81.947-74.215-137.452-73.811zM445.731 203.01c6.12 0 11.112 4.919 11.112 11.038 0 6.119-4.994 11.111-11.112 11.111s-11.038-4.994-11.038-11.111a11.01 11.01 0 0 1 11.038-11.038z" />
    </svg>
</body>
```

  


```CSS
.kiwi {
    fill: oklch(0.73 0.19 59.23);
    transition: all .28s ease-in-out;
    
    .svg:hover & {
        fill: oklch(0.73 0.19 59.23 / .85);
    }
}

.ground {
    fill: oklch(0.63 0.15 66.55 / 0.6);
    stroke-width: 10;
    stroke: oklch(0.72 0.18 63.87 / 0.75);
    will-change: filter;
    transition: filter .2s ease-in-out;
    
    .svg:hover & {
        filter: url(#blurEffect);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7e2f9be870d49a7afb71da49c21c97c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=516&s=990613&e=gif&f=124&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/abxdXOq


有时候，一个独立的 SVG 文件可能包含多个单独的图像。以 [IcoMoon](https://icomoon.io/) 生成的文件夹图标为例，其 `folders.svg` 文件中包含了多个不同状态的图标。每个图标都嵌套在一个带有独特 `id` 的 `<symbol>` 容器中。而且这些图标可以在任何 Web上重复使用。

  


```XML
<svg xmlns="https://www.w3.org/2000/svg" class="sr-only">
    <defs>
        <symbol id="icon-folder" viewBox="0 0 32 32">
            <title>folder</title>
            <path d="M14 4l4 4h14v22h-32v-26z" fill="currentColor"></path>
        </symbol>
        <symbol id="icon-folder-open" viewBox="0 0 32 32">
            <title>open</title>
            <path d="M26 30l6-16h-26l-6 16zM4 12l-4 18v-26h9l4 4h13v4z" fill="currentColor"></path>
        </symbol>
        <symbol id="icon-folder-plus" viewBox="0 0 32 32">
            <title>plus</title>
            <path d="M18 8l-4-4h-14v26h32v-22h-14zM22 22h-4v4h-4v-4h-4v-4h4v-4h4v4h4v4z" fill="currentColor"></path>
        </symbol>
        <symbol id="icon-folder-minus" viewBox="0 0 32 32">
            <title>minus</title>
            <path d="M18 8l-4-4h-14v26h32v-22h-14zM22 22h-12v-4h12v4z" fill="currentColor"></path>
        </symbol>
        <symbol id="icon-folder-download" viewBox="0 0 32 32">
            <title>download</title>
            <path d="M18 8l-4-4h-14v26h32v-22h-14zM16 27l-7-7h5v-8h4v8h5l-7 7z" fill="currentColor"></path>
        </symbol>
        <symbol id="icon-folder-upload" viewBox="0 0 32 32">
            <title>upload</title>
            <path d="M18 8l-4-4h-14v26h32v-22h-14zM16 15l7 7h-5v8h-4v-8h-5l7-7z" fill="currentColor"></path>
        </symbol>
    </defs>
</svg>
```

  


上面的代码在页面上并不会渲染出任何图形，因为放置在 `<defs>` 和 `<symbol>` 中图形是不会被渲染的。

  


SVG 文件（`folders.svg`）可以作为外部缓存的资源在 HTML 页面中引用。例如：

  


```XML
<svg class="folder" viewBox="0 0 100 100">
    <use xlink:href="folders.svg#icon-folder"></use>
</svg>
```

  


并且以下是如何使用 CSS 对其进行样式设置：

  


```CSS
svg.folder { 
    fill: #f7d674; 
}
```

  


不过，这种方法存在一些缺点：

  


-   在 IE 中不起作用
-   CSS 样式仅适用于包含 `<use>` 的 `<svg>` 元素。上面代码中的 `fill` 样式会使图标的每个元素都具有相同的颜色

  


为了解决这些问题，我们可以直接将 `folders.svg` 文件对应的 SVG 代码内嵌到 HTML 中，然后使用 `display: none` 或类似技术对 `<svg>` 进行隐藏。

  


```CSS
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

  


然后，通过 `<use>` 元素的 `xlink:href` 来引用 SVG （`folders.svg` 文件）中的 `<symbol>` 元素的 `id` ：

  


```HTML
<div class="folders">
    <svg class="folder" viewBox="0 0 100 100">
        <use xlink:href="#icon-folder"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100">
        <use xlink:href="#icon-folder-open"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100">
        <use xlink:href="#icon-folder-plus"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100">
        <use xlink:href="#icon-folder-minus"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100">
        <use xlink:href="#icon-folder-download"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100">
        <use xlink:href="#icon-folder-upload"></use>
    </svg>
</div>
```

  


这在所有现代浏览器中均能正常工作，而且可以通过 CSS 样式为每个图标进行定制。例如，通过使用 [CSS 自定义属性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)，为每个 `<svg>` 元素定义一个 `color` 值，并将 `<symbol>` 中的图形元素（例如示例中的 `<path>`）的 `fill` 属性设置为 `currentColor`，从而能够为每个图标指定独特的填充颜色：

  


```HTML
<div class="folders">
    <svg class="folder" viewBox="0 0 100 100" style="--h: 0;">
        <use xlink:href="#icon-folder"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100" style="--h: 45;">
        <use xlink:href="#icon-folder-open"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100" style="--h: 90;">
        <use xlink:href="#icon-folder-plus"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100" style="--h: 135;">
        <use xlink:href="#icon-folder-minus"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100" style="--h: 180;">
        <use xlink:href="#icon-folder-download"></use>
    </svg>
    <svg class="folder" viewBox="0 0 100 100" style="--h: 225;">
        <use xlink:href="#icon-folder-upload"></use>
    </svg>
</div>
```

  


```CSS
.folder {
    --color: hsl(var(--h) 30% 60%);
    color: var(--color);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e0b654a564a4073b3228836dcf023e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1196&s=157898&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/vYMLbmw

  


上述示例是 SVG 的一个典型用例，它有一个专业术语，被称为SVG 雪碧图（SVG Sprites）！

  


SVG 与 HTML 有一点不同的是，它自身带有一些特殊效果的能力，例如蒙板、剪切和滤镜等。如今，这些特效已被移植到 CSS 的 。然而，仍然可以通过目标 SVG 选择器来实现：

  


SVG 与 HTML 有一个显著的区别，即其内建了一些独特的特效功能，如蒙板、剪切和滤镜等。尽管如今这些特效已经被移植到 CSS 的 `mask 、clip-path` 和 `filter` 属性中，但仍然可以通过目标 SVG 选择器来实现这些效果。

  


```HTML
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <defs>
        <clipPath id="clip">
            <text x="0" y="300" font-size="10rem" font-weight="900" font-family="Exo">SVG Clipping (^_^) </text>
        </clipPath>
    </defs>
</svg>

<div class="word">
    <span class="sr-only">SVG Clipping With clipPath (^_^)</span>
</div>
```

  


```CSS
.word {
    width: 100vw;
    height: 100vh;
    background: url("https://picsum.photos/1920/1024?random=1") no-repeat center / cover,radial-gradient(circle, rgb(131 58 180) 0%, rgb(253 29 29) 50%, rgb(252 176 69) 100%) no-repeat center /cover;
    background-blend-mode: difference;
    clip-path: url(#clip);
}
```

  


`.word` 引用了 HTML 嵌入的 SVG 中的剪切效果，实现文本裁剪的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97a7c58768f64b0aa12540dbdbc419ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1196&s=288677&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/GRLozzp

  


#### SVG 作为 Data URIs 用于 HTML

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c9bbd3be583408ca99002dc79a33680~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=32435&e=png&b=ff7272)

  


之前我们演示了使用 HTML 的 `<img>`、`<picture>`、`<iframe>` 和 `<object>` 等元素来加载 `.svg` 文件。实际上，我们也可以将 SVG 作为 Data URIs 直接嵌入，而不必依赖外部的 `.svg` 文件。Data URIs 可能不会减小实际文件大小，但因为数据直接存在，它可能更有效率。它不需要额外的 Http 请求。

  


简单地说，Data URIs 是 SVG 的另一种常见格式，它只是 SVG 内容的多个变体：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2dfed51bdec4dfaa78ee00413044654~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3312&h=1696&s=2027534&e=jpg&b=ffffff)

  


我们常见的是 Data URIs 和 Base64 编码，但这两者并非完全等同，Base64 编码只是 Data URIs 中一种常见形式。 Data URIs 是一种用于在 URL 中嵌入小型数据的方案，而 Base64 编码则是其中一种常用的数据编码方式。因此，可以统一称它们为“数据统一资源标识符”（Data Uniform Resouce Identifirs）或者简称为“数据 URI”。

  


请注意，Data URIs 还可以采用其他编码方式，不一定是 Base64。例如，可以使用纯文本方式（`"text/plain"`）或其他编码方式，但在实践中，Base64 是最常见的选择。

  


将 SVG 作为 Data URIs 嵌入到 HTML 中，可以通过以下步骤实现：

  


首先，使用在线工具或编码器，将 SVG 文件转换为 Data URIs。请确保选择正确的媒体类型，如 `image/svg+xml` 。我个人比较喜欢使用在线工具来转码，例如 [SVGViewer](https://www.svgviewer.dev/svg-to-data-uri) 和 [eeencode](https://fffuel.co/eeencode/) 都是很不错的工具。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad16ece37ee7476eaa8b7c75e169a684~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3352&h=1800&s=1476482&e=jpg&b=ffffff)

  


> SVGViewer：https://www.svgviewer.dev/svg-to-data-uri

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e53790b58b74e1b8ee5060c1e85329e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3352&h=1720&s=433622&e=jpg&b=f4f1f8)

  


> eeencoode：https://fffuel.co/eeencode/

  


接着将转换出来的 Data URIs 或 Base64 编码作为 `<img>` 元素的 `src` 属性值：

  


```HTML
<!-- SVG 转换为 Data URIs -->
<img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22888%22%20height%3D%22483.611%22%20viewBox%3D%220%200%20888%20483.611%22%3E%3Cpath%20d%3D%22M1%20421.535h887v-2H1a1%201%200%201%200%200%202%22%20fill%3D%22%233f3d56%22%2F%3E%3Cpath%20d%3D%22M406%20438.535c5%2024%2033.5-5.5%2033.5-5.5l34-4s21.5.5%2035.5%2011.5%2023.5-3.5%2023.5-3.5c15.773%205.257%2035.097%205.236%2051.833%203.552%2024.116-2.426%2043.446-21.04%2046.76-45.05C649.79%20260.095%20547%20193.535%20547%20193.535l-30-81s9.5-23.5%2012.5-44.5-19-41-46-61c-11.813-8.75-25.348-8.121-36.837-4.645-12.89%203.9-24.132%2011.918-32.44%2022.516-6.882%208.78-18.687%2021.215-31.663%2023.369-4.49.74-8.92%202.52-13.06%205.76-4.28%203.35-6.17%208.94-6.23%2015.89-.32%2030.36%2024.75%2066.91%2046.73%2072.61%2027%207%2012.5%2073.5%2012.5%2073.5-44%2062-13%20131-13%20131l-8%2056s-.5%2011.5%204.5%2035.5%22%20fill%3D%22%233f3d56%22%2F%3E%3Cpath%20d%3D%22m553%20309.535-11%20137s15%2038-36%2036-21-80-21-80l16-102%22%20fill%3D%22%233f3d56%22%2F%3E%3Cpath%20d%3D%22M509.795%20483.611q-1.87%200-3.834-.077c-11.29-.443-19.604-4.6-24.711-12.359-14.603-22.181%201.639-65.906%202.778-68.899l15.984-101.896a1%201%200%200%201%201.143-.833%201%201%200%200%201%20.833%201.143l-16%20102q-.017.105-.054.204c-.175.452-17.252%2045.556-3.012%2067.184%204.732%207.186%2012.51%2011.042%2023.117%2011.458%2016.652.65%2027.853-2.904%2033.298-10.569%207.124-10.028%201.787-23.926%201.732-24.066a1%201%200%200%201-.066-.446l11-137c.044-.55.517-.951%201.077-.917a1%201%200%200%201%20.917%201.077L543.015%20446.39c.726%201.961%205.282%2015.405-2.04%2025.724-5.416%207.636-15.898%2011.497-31.18%2011.497%22%20fill%3D%22%232f2e41%22%2F%3E%3Cpath%20d%3D%22M462%20337.535s3%20127-60%20124-6-43-6-43l5.5-15.5%22%20fill%3D%22%233f3d56%22%2F%3E%3Cpath%20d%3D%22M404.162%20462.587q-1.096%200-2.21-.053c-17.988-.857-28.152-4.887-30.208-11.979-3.704-12.779%2020.44-30.521%2023.42-32.653l5.394-15.201a.999.999%200%201%201%201.884.668l-5.5%2015.5a1%201%200%200%201-.368.484c-.263.186-26.377%2018.685-22.908%2030.646%201.792%206.18%2011.34%209.725%2028.382%2010.537%2011.348.546%2021.297-3.27%2029.55-11.33C462.552%20418.992%20461.02%20338.37%20461%20337.559a1%201%200%200%201%20.977-1.023c.522%200%201.01.425%201.023.976.08%203.346%201.572%2082.298-30.003%20113.125-8.128%207.936-17.82%2011.95-28.835%2011.95M363.27%2069.925c7.18.86%2018.42.82%2027.73-5.39%209.97-6.65-.38-12.85-8.44-16.26-4.49.74-8.92%202.52-13.06%205.76-4.28%203.35-6.17%208.94-6.23%2015.89m116.028-17.981S461.848%207.127%20486.841%206.5s44.732%2038.21%2044.732%2038.21%2062.728%20114.343-23.213%20108.177-44.874-51.811-44.874-51.811%2019.602-24.1%2015.812-49.132%22%20fill%3D%22%232f2e41%22%2F%3E%3Cpath%20d%3D%22M575.039%20386.85c11.067%204.924%2022.631%209.949%2034.735%209.468s24.842-8.276%2026.728-20.241c.974-6.177-.957-12.804%201.408-18.593%203.182-7.789%2013.446-10.792%2021.425-8.123s13.841%209.552%2018.044%2016.84c7.863%2013.637%2011.014%2031.535%202.583%2044.828-7.309%2011.524-21.17%2016.731-34.065%2021.198-17.175%205.949-36.351%2011.854-52.994%204.546-16.738-7.35-25.856-28.585-19.658-45.782%22%20fill%3D%22%233f3d56%22%2F%3E%3Cpath%20d%3D%22M538.114%20170.921s22%2011%2011%2023-79%2046-104%2041-31-20-31-24S416%20158.535%20424%20160.535s58.114%2047.386%20114.114%2010.386%22%20fill%3D%22%236c63ff%22%2F%3E%3C%2Fsvg%3E" alt="" />

<!-- SVG 转换为 Base64 -->
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4ODgiIGhlaWdodD0iNDgzLjYxMSIgdmlld0JveD0iMCAwIDg4OCA0ODMuNjExIj4KICA8cGF0aCBkPSJNMSA0MjEuNTM1aDg4N3YtMkgxYTEgMSAwIDEgMCAwIDIiIGZpbGw9IiMzZjNkNTYiLz4KICA8cGF0aCBkPSJNNDA2IDQzOC41MzVjNSAyNCAzMy41LTUuNSAzMy41LTUuNWwzNC00czIxLjUuNSAzNS41IDExLjUgMjMuNS0zLjUgMjMuNS0zLjVjMTUuNzczIDUuMjU3IDM1LjA5NyA1LjIzNiA1MS44MzMgMy41NTIgMjQuMTE2LTIuNDI2IDQzLjQ0Ni0yMS4wNCA0Ni43Ni00NS4wNUM2NDkuNzkgMjYwLjA5NSA1NDcgMTkzLjUzNSA1NDcgMTkzLjUzNWwtMzAtODFzOS41LTIzLjUgMTIuNS00NC41LTE5LTQxLTQ2LTYxYy0xMS44MTMtOC43NS0yNS4zNDgtOC4xMjEtMzYuODM3LTQuNjQ1LTEyLjg5IDMuOS0yNC4xMzIgMTEuOTE4LTMyLjQ0IDIyLjUxNi02Ljg4MiA4Ljc4LTE4LjY4NyAyMS4yMTUtMzEuNjYzIDIzLjM2OS00LjQ5Ljc0LTguOTIgMi41Mi0xMy4wNiA1Ljc2LTQuMjggMy4zNS02LjE3IDguOTQtNi4yMyAxNS44OS0uMzIgMzAuMzYgMjQuNzUgNjYuOTEgNDYuNzMgNzIuNjEgMjcgNyAxMi41IDczLjUgMTIuNSA3My41LTQ0IDYyLTEzIDEzMS0xMyAxMzFsLTggNTZzLS41IDExLjUgNC41IDM1LjUiIGZpbGw9IiMzZjNkNTYiLz4KICA8cGF0aCBkPSJtNTUzIDMwOS41MzUtMTEgMTM3czE1IDM4LTM2IDM2LTIxLTgwLTIxLTgwbDE2LTEwMiIgZmlsbD0iIzNmM2Q1NiIvPgogIDxwYXRoIGQ9Ik01MDkuNzk1IDQ4My42MTFxLTEuODcgMC0zLjgzNC0uMDc3Yy0xMS4yOS0uNDQzLTE5LjYwNC00LjYtMjQuNzExLTEyLjM1OS0xNC42MDMtMjIuMTgxIDEuNjM5LTY1LjkwNiAyLjc3OC02OC44OTlsMTUuOTg0LTEwMS44OTZhMSAxIDAgMCAxIDEuMTQzLS44MzMgMSAxIDAgMCAxIC44MzMgMS4xNDNsLTE2IDEwMnEtLjAxNy4xMDUtLjA1NC4yMDRjLS4xNzUuNDUyLTE3LjI1MiA0NS41NTYtMy4wMTIgNjcuMTg0IDQuNzMyIDcuMTg2IDEyLjUxIDExLjA0MiAyMy4xMTcgMTEuNDU4IDE2LjY1Mi42NSAyNy44NTMtMi45MDQgMzMuMjk4LTEwLjU2OSA3LjEyNC0xMC4wMjggMS43ODctMjMuOTI2IDEuNzMyLTI0LjA2NmExIDEgMCAwIDEtLjA2Ni0uNDQ2bDExLTEzN2MuMDQ0LS41NS41MTctLjk1MSAxLjA3Ny0uOTE3YTEgMSAwIDAgMSAuOTE3IDEuMDc3TDU0My4wMTUgNDQ2LjM5Yy43MjYgMS45NjEgNS4yODIgMTUuNDA1LTIuMDQgMjUuNzI0LTUuNDE2IDcuNjM2LTE1Ljg5OCAxMS40OTctMzEuMTggMTEuNDk3IiBmaWxsPSIjMmYyZTQxIi8+CiAgPHBhdGggZD0iTTQ2MiAzMzcuNTM1czMgMTI3LTYwIDEyNC02LTQzLTYtNDNsNS41LTE1LjUiIGZpbGw9IiMzZjNkNTYiLz4KICA8cGF0aCBkPSJNNDA0LjE2MiA0NjIuNTg3cS0xLjA5NiAwLTIuMjEtLjA1M2MtMTcuOTg4LS44NTctMjguMTUyLTQuODg3LTMwLjIwOC0xMS45NzktMy43MDQtMTIuNzc5IDIwLjQ0LTMwLjUyMSAyMy40Mi0zMi42NTNsNS4zOTQtMTUuMjAxYS45OTkuOTk5IDAgMSAxIDEuODg0LjY2OGwtNS41IDE1LjVhMSAxIDAgMCAxLS4zNjguNDg0Yy0uMjYzLjE4Ni0yNi4zNzcgMTguNjg1LTIyLjkwOCAzMC42NDYgMS43OTIgNi4xOCAxMS4zNCA5LjcyNSAyOC4zODIgMTAuNTM3IDExLjM0OC41NDYgMjEuMjk3LTMuMjcgMjkuNTUtMTEuMzNDNDYyLjU1MiA0MTguOTkyIDQ2MS4wMiAzMzguMzcgNDYxIDMzNy41NTlhMSAxIDAgMCAxIC45NzctMS4wMjNjLjUyMiAwIDEuMDEuNDI1IDEuMDIzLjk3Ni4wOCAzLjM0NiAxLjU3MiA4Mi4yOTgtMzAuMDAzIDExMy4xMjUtOC4xMjggNy45MzYtMTcuODIgMTEuOTUtMjguODM1IDExLjk1TTM2My4yNyA2OS45MjVjNy4xOC44NiAxOC40Mi44MiAyNy43My01LjM5IDkuOTctNi42NS0uMzgtMTIuODUtOC40NC0xNi4yNi00LjQ5Ljc0LTguOTIgMi41Mi0xMy4wNiA1Ljc2LTQuMjggMy4zNS02LjE3IDguOTQtNi4yMyAxNS44OW0xMTYuMDI4LTE3Ljk4MVM0NjEuODQ4IDcuMTI3IDQ4Ni44NDEgNi41czQ0LjczMiAzOC4yMSA0NC43MzIgMzguMjEgNjIuNzI4IDExNC4zNDMtMjMuMjEzIDEwOC4xNzctNDQuODc0LTUxLjgxMS00NC44NzQtNTEuODExIDE5LjYwMi0yNC4xIDE1LjgxMi00OS4xMzIiIGZpbGw9IiMyZjJlNDEiLz4KICA8cGF0aCBkPSJNNTc1LjAzOSAzODYuODVjMTEuMDY3IDQuOTI0IDIyLjYzMSA5Ljk0OSAzNC43MzUgOS40NjhzMjQuODQyLTguMjc2IDI2LjcyOC0yMC4yNDFjLjk3NC02LjE3Ny0uOTU3LTEyLjgwNCAxLjQwOC0xOC41OTMgMy4xODItNy43ODkgMTMuNDQ2LTEwLjc5MiAyMS40MjUtOC4xMjNzMTMuODQxIDkuNTUyIDE4LjA0NCAxNi44NGM3Ljg2MyAxMy42MzcgMTEuMDE0IDMxLjUzNSAyLjU4MyA0NC44MjgtNy4zMDkgMTEuNTI0LTIxLjE3IDE2LjczMS0zNC4wNjUgMjEuMTk4LTE3LjE3NSA1Ljk0OS0zNi4zNTEgMTEuODU0LTUyLjk5NCA0LjU0Ni0xNi43MzgtNy4zNS0yNS44NTYtMjguNTg1LTE5LjY1OC00NS43ODIiIGZpbGw9IiMzZjNkNTYiLz4KICA8cGF0aCBkPSJNNTM4LjExNCAxNzAuOTIxczIyIDExIDExIDIzLTc5IDQ2LTEwNCA0MS0zMS0yMC0zMS0yNFM0MTYgMTU4LjUzNSA0MjQgMTYwLjUzNXM1OC4xMTQgNDcuMzg2IDExNC4xMTQgMTAuMzg2IiBmaWxsPSIjNmM2M2ZmIi8+Cjwvc3ZnPgo=" alt="" />
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b02f7628403e47fa89cc4121b0145840~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=259027&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/WNWrWae

  


Data URIs 和 Base64 编码在页面上的呈现效果是一样的，只是 Data URIs 生成的数据看起来较为可读，而 Base64 看上去则是一串奇怪的字母和数字排列。然而，浏览器能够完全理解并处理它们。例如，如果你想要两个版本的图标，一个是红色的，一个是黄色的，你可以使用相同的 SVG 语法，只需调整填充颜色即可。而 Gzip 压缩能够轻松处理这些数据。

  


```
<!-- base64 -->
data:image/svg+xml;base64,PHN2ZyB4b...

<!-- UTF-8，未编码 -->
data:image/svg+xml;charset=UTF-8,<svg ...> ... </svg>

<!-- UTF-8，为了兼容性进行优化编码 -->
data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://...'

<!-- 完全URL编码的ASCII -->
data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//...
```

  


### CSS 中的 SVG

  


众所周知，在CSS中，很多属性的值可以是 `<image>` 类型，可以通过 `url()` 函数引用图像，例如我们熟悉的 `background-image` 、`border-image-source` 、`list-style-image` 、`mask-image` 、`clip-path` 、`shape-outside` 、`offset-path` 、`cursor` 、`content` 和 `filter` 等。这意味着这些属性都可以使用SVG，只是在某些细节上略有差异。

  


换句话说，前面 HTML 中使用 SVG 的那几种方式都可以应用于 CSS 中。以我们最熟悉的 `background-image` 为例：

  


```HTML
<div class="svg--file svg">
    <!-- url() 引用 .svg 文件 -->
</div>

<div class="svg--datauri svg">
    <!-- url() 引用 Data URIs -->
</div>

<div class="svg--base64 svg">
    <!-- url() 引用 Base64 -->
</div>
```

  


```CSS
.svg--file {
    background-image: url("https://assets.codepen.io/3/kiwi.svg");
}

.svg--datauri {
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xml%3Aspace%3D%22preserve%22%20width%3D%22612%22%20height%3D%22502.174%22%20viewBox%3D%220%2065.326%20612%20502.174%22%3E%3Cellipse%20cx%3D%22283.5%22%20cy%3D%22487.5%22%20fill%3D%22%23C6C6C6%22%20rx%3D%22259%22%20ry%3D%2280%22%2F%3E%3Cpath%20d%3D%22M210.333%2065.331c-105.966.774-222.682%2085.306-209.277%20211.118%204.303%2040.393%2018.533%2063.704%2052.171%2079.03%2036.307%2016.544%2057.022%2054.556%2050.406%20112.954-9.935%204.88-17.405%2011.031-19.132%2020.015%207.531-.17%2014.943-.312%2022.59%204.341%2020.333%2012.375%2031.296%2027.363%2042.979%2051.72%201.714%203.572%208.192%202.849%208.312-3.078.17-8.467-1.856-17.454-5.226-26.933-2.955-8.313%203.059-7.985%206.917-6.106%206.399%203.115%2016.334%209.43%2030.39%2013.098%205.392%201.407%205.995-3.877%205.224-6.991-1.864-7.522-11.009-10.862-24.519-19.229-4.82-2.984-.927-9.736%205.168-8.351l20.234%202.415c3.359.763%204.555-6.114.882-7.875-14.198-6.804-28.897-10.098-53.864-7.799-11.617-29.265-29.811-61.617-15.674-81.681%2012.639-17.938%2031.216-20.74%2039.147%2043.489-5.002%203.107-11.215%205.031-11.332%2013.024%207.201-2.845%2011.207-1.399%2014.791%200%2017.912%206.998%2035.462%2021.826%2052.982%2037.309%203.739%203.303%208.413-1.718%206.991-6.034-2.138-6.494-8.053-10.659-14.791-20.016-3.239-4.495%205.03-7.045%2010.886-6.876%2013.849.396%2022.886%208.268%2035.177%2011.218%204.483%201.076%209.741-1.964%206.917-6.917-3.472-6.085-13.015-9.124-19.18-13.413-4.357-3.029-3.025-7.132%202.697-6.602%203.905.361%208.478%202.271%2013.908%201.767%209.946-.925%207.717-7.169-.883-9.566-19.036-5.304-39.891-6.311-61.665-5.225-43.837-8.358-31.554-84.887%200-90.363%2029.571-5.132%2062.966-13.339%2099.928-32.156%2032.668-5.429%2064.835-12.446%2092.939-33.85%2048.106-14.469%20111.903%2016.113%20204.241%20149.695%203.926%205.681%2015.819%209.94%209.524-6.351-15.893-41.125-68.176-93.328-92.13-132.085-24.581-39.774-14.34-61.243-39.957-91.247-21.326-24.978-47.502-25.803-77.339-17.365-23.461%206.634-39.234-7.117-52.98-31.273-29.365-51.617-81.947-74.215-137.452-73.811zM445.731%20203.01c6.12%200%2011.112%204.919%2011.112%2011.038%200%206.119-4.994%2011.111-11.112%2011.111s-11.038-4.994-11.038-11.111a11.01%2011.01%200%200%201%2011.038-11.038z%22%2F%3E%3C%2Fsvg%3E");
}

.svg--base64 {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2MTIiIGhlaWdodD0iNTAyLjE3NCIgdmlld0JveD0iMCA2NS4zMjYgNjEyIDUwMi4xNzQiPgogIDxlbGxpcHNlIGN4PSIyODMuNSIgY3k9IjQ4Ny41IiBmaWxsPSIjQzZDNkM2IiByeD0iMjU5IiByeT0iODAiLz4KICA8cGF0aCBkPSJNMjEwLjMzMyA2NS4zMzFjLTEwNS45NjYuNzc0LTIyMi42ODIgODUuMzA2LTIwOS4yNzcgMjExLjExOCA0LjMwMyA0MC4zOTMgMTguNTMzIDYzLjcwNCA1Mi4xNzEgNzkuMDMgMzYuMzA3IDE2LjU0NCA1Ny4wMjIgNTQuNTU2IDUwLjQwNiAxMTIuOTU0LTkuOTM1IDQuODgtMTcuNDA1IDExLjAzMS0xOS4xMzIgMjAuMDE1IDcuNTMxLS4xNyAxNC45NDMtLjMxMiAyMi41OSA0LjM0MSAyMC4zMzMgMTIuMzc1IDMxLjI5NiAyNy4zNjMgNDIuOTc5IDUxLjcyIDEuNzE0IDMuNTcyIDguMTkyIDIuODQ5IDguMzEyLTMuMDc4LjE3LTguNDY3LTEuODU2LTE3LjQ1NC01LjIyNi0yNi45MzMtMi45NTUtOC4zMTMgMy4wNTktNy45ODUgNi45MTctNi4xMDYgNi4zOTkgMy4xMTUgMTYuMzM0IDkuNDMgMzAuMzkgMTMuMDk4IDUuMzkyIDEuNDA3IDUuOTk1LTMuODc3IDUuMjI0LTYuOTkxLTEuODY0LTcuNTIyLTExLjAwOS0xMC44NjItMjQuNTE5LTE5LjIyOS00LjgyLTIuOTg0LS45MjctOS43MzYgNS4xNjgtOC4zNTFsMjAuMjM0IDIuNDE1YzMuMzU5Ljc2MyA0LjU1NS02LjExNC44ODItNy44NzUtMTQuMTk4LTYuODA0LTI4Ljg5Ny0xMC4wOTgtNTMuODY0LTcuNzk5LTExLjYxNy0yOS4yNjUtMjkuODExLTYxLjYxNy0xNS42NzQtODEuNjgxIDEyLjYzOS0xNy45MzggMzEuMjE2LTIwLjc0IDM5LjE0NyA0My40ODktNS4wMDIgMy4xMDctMTEuMjE1IDUuMDMxLTExLjMzMiAxMy4wMjQgNy4yMDEtMi44NDUgMTEuMjA3LTEuMzk5IDE0Ljc5MSAwIDE3LjkxMiA2Ljk5OCAzNS40NjIgMjEuODI2IDUyLjk4MiAzNy4zMDkgMy43MzkgMy4zMDMgOC40MTMtMS43MTggNi45OTEtNi4wMzQtMi4xMzgtNi40OTQtOC4wNTMtMTAuNjU5LTE0Ljc5MS0yMC4wMTYtMy4yMzktNC40OTUgNS4wMy03LjA0NSAxMC44ODYtNi44NzYgMTMuODQ5LjM5NiAyMi44ODYgOC4yNjggMzUuMTc3IDExLjIxOCA0LjQ4MyAxLjA3NiA5Ljc0MS0xLjk2NCA2LjkxNy02LjkxNy0zLjQ3Mi02LjA4NS0xMy4wMTUtOS4xMjQtMTkuMTgtMTMuNDEzLTQuMzU3LTMuMDI5LTMuMDI1LTcuMTMyIDIuNjk3LTYuNjAyIDMuOTA1LjM2MSA4LjQ3OCAyLjI3MSAxMy45MDggMS43NjcgOS45NDYtLjkyNSA3LjcxNy03LjE2OS0uODgzLTkuNTY2LTE5LjAzNi01LjMwNC0zOS44OTEtNi4zMTEtNjEuNjY1LTUuMjI1LTQzLjgzNy04LjM1OC0zMS41NTQtODQuODg3IDAtOTAuMzYzIDI5LjU3MS01LjEzMiA2Mi45NjYtMTMuMzM5IDk5LjkyOC0zMi4xNTYgMzIuNjY4LTUuNDI5IDY0LjgzNS0xMi40NDYgOTIuOTM5LTMzLjg1IDQ4LjEwNi0xNC40NjkgMTExLjkwMyAxNi4xMTMgMjA0LjI0MSAxNDkuNjk1IDMuOTI2IDUuNjgxIDE1LjgxOSA5Ljk0IDkuNTI0LTYuMzUxLTE1Ljg5My00MS4xMjUtNjguMTc2LTkzLjMyOC05Mi4xMy0xMzIuMDg1LTI0LjU4MS0zOS43NzQtMTQuMzQtNjEuMjQzLTM5Ljk1Ny05MS4yNDctMjEuMzI2LTI0Ljk3OC00Ny41MDItMjUuODAzLTc3LjMzOS0xNy4zNjUtMjMuNDYxIDYuNjM0LTM5LjIzNC03LjExNy01Mi45OC0zMS4yNzMtMjkuMzY1LTUxLjYxNy04MS45NDctNzQuMjE1LTEzNy40NTItNzMuODExek00NDUuNzMxIDIwMy4wMWM2LjEyIDAgMTEuMTEyIDQuOTE5IDExLjExMiAxMS4wMzggMCA2LjExOS00Ljk5NCAxMS4xMTEtMTEuMTEyIDExLjExMXMtMTEuMDM4LTQuOTk0LTExLjAzOC0xMS4xMTFhMTEuMDEgMTEuMDEgMCAwIDEgMTEuMDM4LTExLjAzOHoiLz4KPC9zdmc+Cg==");
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a42d29bd722c4dd792ae655f4b08a5af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=288971&e=jpg&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/jORWomV

  


当我们希望在 CSS 中使用内联 SVG 时，与 HTML 内联 SVG 有所不同。通常情况下，我们将 Data URIs 视为在 CSS 中内联 SVG 的用法。换句话说，当我们希望将内联 SVG 用作 CSS 属性值时，需要指定以下三个部分：

  


-   作为 CSS 数据类型的 URL 值：`url("....")`
-   起始字符：`data:image/svg+xml,`
-   编译后的数据（Data URIs编码的SVG内容）：`%3Csvg xmlns='``http://www.w3.org/2000/svg'``  viewBox='0 0 36 36'%3E%3Cpath fill='%23A0041E' d='M1 ...' `

  


将这三部分组合在一起，你就得到了在CSS属性值中内联SVG的秘密配方。

  


其实，CSS 内联 SVG 还有一个小技巧，在 `url()` 中巧妙应用反斜杆（``），使其看上去像 JavaScript 模板字面量的功能。例如：

  


```CSS
.svg {
    background-image: url('data:image/svg+xml,\
    <svg t="1709991319824" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1522" width="200" height="200">\
    <path d="M607.860021 191.971879c52.992237 0 95.98594-42.993702 95.98594-95.985939S660.852259 0 607.860021 0s-95.98594 42.993702-95.985939 95.98594 42.993702 95.98594 95.985939 95.985939z m188.972319 298.156325l-46.593175-23.596544-19.397159-58.791388c-29.395694-89.186936-111.383684-151.577796-204.370062-151.777767-71.989455-0.199971-111.783625 20.197041-186.572671 50.392619-43.193673 17.397452-78.588488 50.392618-99.385441 92.386467L227.115795 425.937607c-15.597715 31.595372-2.999561 69.989748 28.39584 85.787433 31.19543 15.797686 69.189865 2.999561 84.987551-28.595811L353.897223 455.933213c6.998975-13.99795 18.597276-24.996338 32.995167-30.795489l53.592149-21.596836-30.395547 121.382219c-10.398477 41.593907 0.799883 85.787433 29.795635 117.582776l119.782454 130.780843c14.397891 15.797686 24.596397 34.794903 29.795635 55.391886l36.59464 146.578528c8.59874 34.194991 43.393644 55.191915 77.588634 46.593175 34.194991-8.59874 55.191915-43.393644 46.593175-77.588635l-44.393497-177.973929c-5.199238-20.596983-15.397744-39.794171-29.795635-55.391886l-90.986672-99.385442 34.394961-137.379876 10.998389 32.995167c10.598447 32.195284 33.395108 58.791388 63.390715 73.989162l46.593174 23.596543c31.19543 15.797686 69.189865 2.999561 84.987551-28.595811 15.397744-31.395401 2.79959-70.189718-28.595811-85.987404zM339.099391 771.486989c-6.399063 16.197627-15.997657 30.795489-28.395841 42.993702l-99.985354 100.185325c-24.996338 24.996338-24.996338 65.590392 0 90.58673s65.390421 24.996338 90.38676 0l118.7826-118.7826c12.198213-12.198213 21.796807-26.796075 28.395841-42.993702l26.996045-67.590099c-110.583801-120.582337-77.388664-83.587756-94.786115-107.38427l-41.393936 102.984914z" fill="lime" p-id="1523" />\
    </svg>');
}
```

  


这种小技巧最大的优势是，SVG 保持相当完整，既可读，又可编辑。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a9aa4086d064aa3af68225df999b443~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1386&h=686&s=3004513&e=gif&f=458&b=1d2426)

  


> Demo 地址：https://codepen.io/airen/full/ExJPzrd

  


不过，这种方式存的一个风险是，代码中的反斜杠（``）会不会受到代码格式化或压缩工具的影响，从而影响最终的结果，这一点我无法确认，或许不会有问题。

  


如果这种方式不受代码格式化或压缩工具的影响，那么它还可以用于 CSS 的 `filter` 、`mask` 和 `clip-path` 等属性。例如下面这个滤镜效果的示例：

  


```CSS
@layer demo {
    .filter {
        will-change: filter;
        transition: filter 0.3s ease-in-out;
        filter: url('data:image/svg+xml,\
        <svg xmlns="http://www.w3.org/2000/svg">\
          <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">\
            <feTurbulence type="turbulence" baseFrequency="0.01 0.05" numOctaves="2" seed="2" stitchTiles="noStitch" result="turbulence"/>\
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>\
    </filter>\
        </svg>#filter');
        
    
        &:hover {
            filter: url('data:image/svg+xml,\
        <svg xmlns="http://www.w3.org/2000/svg">\
          <filter id="filter2" x="-10%" y="-10%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">\
            <feTurbulence type="turbulence" baseFrequency="0.11 0.15" numOctaves="4" seed="4" stitchTiles="noStitch" result="turbulence"/>\
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="30" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>\
    </filter>\
        </svg>#filter2');
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93027b74b6ee4b5e8f2acf89dbb805a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=584&s=6089157&e=gif&f=124&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/bGJEPNR

  


注意，SVG 的滤镜效果可以从 @Yoksel 的 [SVG Filters](https://yoksel.github.io/svg-filters/#/) 和 [SVG Gradient Map Filter](https://yoksel.github.io/svg-gradient-map/#/) 工具中获取。现在看不懂 SVG 滤镜中的代码，并不要紧，小册后面有专门介绍 SVG 滤镜的课程。

  


### SVG 和 JavaScript

  


由于 JavaScript 与 DOM 之间的密切关系，我们之前介绍的所有方法都可以通过 JavaScript 代码实现。无论是创建整个带有 SVG 定义的 HTML 元素并将其添加到 DOM，还是仅为单独的 `src` 属性、`data` 属性或 `background-image` 属性设置值，都可以通过一些基本的 DOM 操作轻松完成任务。让我们在各种常见情景中详细了解这些操作。

  


#### 在 HTML 中指向 SVG 文件

  


首先，让我们看一下使用 JavaScript 直接将 SVG 文件加载到 Web 页面上的图像元素（`<img>`）的情况。例如，在你的 HTML 文档中，有一个 `id` 名为 `#figure` 的 `div` 元素。这个元素是空元素，里面什么也没有放置。

  


```HTML
<div id="figure">
    <!-- JavaScript 创建的 img 放在这里 -->
</div>
```

  


接下来，我们需要使用 JavaScript 创建一个 `<img>` 元素，并且设置 `<img>` 的 `src` 属性的值为 `kiwi.svg` 文件对应的路径，然后将新创建的 `<img>` 嵌入到 `#figure` 元素内。

  


使用 JavaScript，可以有多种不同的方式实现该效果。先以图像对象 `new Image()` 为例：

  


```JavaScript
// 放置 img 的容器
const figureContainer = document.getElementById('figure');

// 需要加载的 kiwi.svg 文件路径
const svgFilePath = `https://assets.codepen.io/3/kiwi.svg`;

// 创建一个 img
const svgImage = new Image();

// 设置 img 的 src 属性的值为 svgFilePath
svgImage.src = `${svgFilePath}`;

// 将加载后的 SVG 图像添加到页面上的 #figure 元素
figureContainer.appendChild(svgImage);
```

  


其次，可以使用 DOM 操作创建元素：

  


```JavaScript
// 放置 img 的容器
const figureContainer = document.getElementById('figure');

// 需要加载的 kiwi.svg 文件路径
const svgFilePath = `https://assets.codepen.io/3/kiwi.svg`;

// 创建 img 元素
const imgElement = document.createElement('img');

// 设置 img 的 src 属性为 SVG 文件的路径
imgElement.src = `${svgFilePath}`;

// 将 <img> 元素添加到页面上的 #figure 元素
figureContainer.appendChild(imgElement);
```

  


你还可以使用 AJAX 请求的方式来创建：

  


```JavaScript
// 创建一个新的 XMLHttpRequest 对象
const xhr = new XMLHttpRequest();

// 需要加载的 kiwi.svg 文件路径
const svgFilePath = `https://assets.codepen.io/3/kiwi.svg`

// 放置 img 的容器
const figureContainer = document.getElementById('figure');

// 设置请求方式和 SVG 文件路径
xhr.open("GET", `${svgFilePath}`, true);

// 指定响应类型为 XML，确保获取到 SVG 数据
xhr.overrideMimeType("image/svg+xml");

// 监听加载完成事件
xhr.onload = () => {
    // 创建一个新的 <img> 元素，并将 SVG 数据赋值给 src 属性
    const imgElement = document.createElement("img");
  
    imgElement.src = URL.createObjectURL(
        new Blob([xhr.response], { type: "image/svg+xml" })
    );

    // 将 <img> 元素添加到页面上的某个元素
    figureContainer.appendChild(imgElement);
};

// 发送请求
xhr.send();
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbcc747c50034ece8e1950d34b901a94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=247767&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/vYMGOdq

  


在这个场景下，我们完全通过 JavaScript 动态创建了图像元素。另一种情况是，在 HTML 中预先存在一个空的图像元素，然后通过 JavaScript 将其关联到 SVG 文件：

  


```HTML
<div id="figure">
    <!-- 空的 img 元素 -->
    <img class="kiwi" />
</div>
```

  


我们可以分别使用 DOM 操作的方法和使用 AJAX 请求来指定 `<img>` 元素的 `src` 属性的值：

  


```JavaSript
// 方法一：DOM 操作
// SVG 文件路径
const svgFilePath = `https://assets.codepen.io/3/kiwi.svg`;

// 需要设置 src 的 img
const kiwiImg = document.querySelector(".kiwi-1");

kiwiImg.src = `${svgFilePath}`;


// 方法二： AJAX 请求
// 创建一个新的 XMLHttpRequest 对象
const xhr = new XMLHttpRequest();

// 设置请求方式和 SVG 文件路径
xhr.open("GET", `${svgFilePath}`, true);

// 指定响应类型为 XML，确保获取到 SVG 数据
xhr.overrideMimeType("image/svg+xml");

// 监听加载完成事件
xhr.onload = () => {
    // 获取空 img
    const kiwiSVG = document.querySelector(".kiwi-2");

    kiwiSVG.src = URL.createObjectURL(
        new Blob([xhr.response], { type: "image/svg+xml" })
    );
};

// 发送请求
xhr.send();
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccb16c2faac3416a87443ce64ad8f9fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=278759&e=jpg&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/MWRywPr

  


这些方法都非常灵活。尽管你可能不总是编写这么多代码来加载单个图像，但你可以将其扩展到包含多个 SVG 图像路径的数组，并在多个元素上一次性动态分配图像源。唯一的限制是你的想象力。

  


#### 在 CSS 中指向 SVG 文件

  


接下来看如何在 CSS 中指定 SVG 文件。继续以 `background-image` 属性为例。

  


```HTML
<div class="kiwi">
    <!-- 使用 JavaScript 给这个 div 设置一个 SVG 图形背景 -->
</div>
```

  


使用 CSS 给 `.kiwi` 设置一些基础样式：

  


```CSS
.kiwi {
    width: 30vw;
    aspect-ratio: 3 / 2;
    border: 2px solid red;
    border-radius: 0.3em;
    background-color: oklch(0.71 0.18 64.3);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-origin: content-box;
    background-clip: padding-box;
    background-blend-mode: multiply;
    padding: 1rem;
}
```

  


接着使用几行简单的 JavaScript 代码，指定 `.kiwi` 的 `background-image` 属性的值：

  


```JavaScript
// SVG 文件路径
const svgFilePath = `https://assets.codepen.io/3/kiwi.svg`;

// 需要设置 SVG 图形背景的 kiwi 元素
const kiwiEle = document.querySelector(".kiwi");

// 指定元素的 background-image 属性的值
kiwiEle.style.backgroundImage = `url(${svgFilePath})`;
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0323ed64a1346e8abbb4641fd99222d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=187723&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/zYXqGbJ

  


在 JavaScript 中，我们为 `backgroundImage` 属性指定的值几乎与我们之前在 CSS 中直接指定的内容相同。这很方便，不是吗？

  


除此之外，我们同样可以借助 CSS 的自定义属性 API（`setProperty()`）来动态设置元素的 SVG 背景。前提是，在CSS中，你需要将元素的 `background-image` 属性值设置为一个自定义属性，然后通过 JavaScript 动态为该自定义属性赋值，实现对元素背景的 SVG 图像进行灵活控制：

  


```CSS
.kiwi {
    background-image: var(--bg-image, none);
}
```

  


```JavaScript
// SVG 文件路径
const svgFilePath = `https://assets.codepen.io/3/kiwi.svg`;

// 需要设置 SVG 图形背景的 kiwi 元素
const kiwiEle = document.querySelector(".kiwi");

// 指 --bg-image 自定义属性的值
kiwiEle.style.setProperty(`--bg-image`, `url(${svgFilePath})`);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eb5c6aaceec46a493c635c61a39d7da~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=187723&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/LYvNVoo

  


我们可以使用相似的方法给 CSS 中其他可以使用 `<image>` 类型的属性指定 SVG 文件。

  


#### 使用 JavaScript 指定内联 SVG

  


在许多情况下，即使在 JavaScript 环境中，你仍然会以 SVG 数据的原始 XML 形式进行处理。这意味着，无论是在 HTML 中还是 CSS 中，我们都能够直接使用 JavaScript 来创建内联的 SVG。

  


先来看 JavaScript 是如何在 HTML 中指定内联 SVG 。

  


由于内联 SVG 是以字符串或文本形式表示的DOM元素，因此我们只需将希望显示的 SVG 以字符串的形式分配给任何元素的 `innerHTML` 属性即可。假设你需要内联的 SVG 代码像下面这样：

  


```XML
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
    <defs>
        <linearGradient id="a" x1=".49" x2=".5" y1="0" y2=".71" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#152055"/>
            <stop offset="100%" stop-color="#0c0b33"/>
        </linearGradient>
        <linearGradient id="b" x1=".21" x2=".55" y1="-.27" y2="1.12" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#2cdafa"/>
            <stop offset="100%" stop-color="#002b55"/>
        </linearGradient>
        <linearGradient id="c" x1=".22" x2=".76" y1=".78" y2=".27" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#07103a"/>
            <stop offset="100%" stop-color="#7e93ff"/>
        </linearGradient>
        <linearGradient id="d" x1="1.64" x2=".4" y1="-.55" y2=".89" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#7e93ff"/>
            <stop offset="100%" stop-color="#2d3a79"/>
        </linearGradient>
        <linearGradient id="e" x1="0" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#8fc2ff"/>
            <stop offset="100%" stop-color="#fff"/>
        </linearGradient>
    </defs>
    <g transform="translate(-42.16 88.62)">
        <circle r="236.19" fill="url(#a)" transform="translate(365.1 214.95) scale(1.041)"/>
        <path fill="url(#b)" d="M-289.23 17.7c0-41.94 146.72-79.93 282.74-79.93 71.16 0 79.28 33.8 112.9 48.95 30.62 13.8 91.32 22.93 91.32 42.93 0 41.93-104.18 47.99-240.19 47.99s-246.77-18.01-246.77-59.95Z" transform="matrix(1 0 0 -1 408.65 430.25)"/>
        <path fill="url(#c)" d="M167.55 66.55c5.99 9.34 8.61 13.18 6.96 14.83s-8.85 5.08-16.73-.97c-19.95-13.68-33.35-74.05-65.63-61.45s16.88 132.42 64.7 179.3c49.47 48.5 71.46 88.2 47.89 134.1s-91.18 56.07-178.84 34.56-155.14-92.17-192.85-153.47c45.08 12.67 92.1 7.4 132.57 7.47a463.7 463.7 0 0 0-10.84-14.73c-8.47-11.01-19.67-20.15-31.97-27.55 40.6 1.73 86.4 3.09 123.06 8.7A159.08 159.08 0 0 1 95 203.5a442 442 0 0 1-20.72-35.38C44.11 110.6 23.06 25.68 59.55-10.1S143.73-27.48 162.3 6.4s9.38 48.02.61 49.82q1.44 4.49 4.63 10.33Z" transform="translate(315.65 44.48)"/>
        <path fill="#0a031b" d="M-172.03 7.98c13.64-44.81-18.9-63.65-6.73-63.65s36.11 29.62 39.84 61.54-.13 50.17-14.43 47.74-33.15 4.65-18.68-45.63Z" style="isolation:isolate" transform="matrix(.559 -.262 .229 .488 551.93 34.7)"/>
        <path fill="#ff518c" d="M470.58 125.37c-4.3-7.11-8.58-18.78-6.1-25.03s14.5-14.32 24.21 9.24 14.59 24.5 14.4 31.6-13.6 11.05-32.51-15.8Z"/>
        <path fill="url(#d)" d="M354.77 287.34c18.52 13.64 64.3 44.15 49.98 75.52s-62.6 47.16-144.99 16.56S107.1 266.79 91 241.8c139.94 2.22 185.57 2.41 263.78 45.54Z" transform="translate(54.09 14.12)"/>
    </g>
    <path fill="none" stroke="url(#e)" stroke-dasharray="2659.74" stroke-dashoffset="2659.74" stroke-miterlimit="36" stroke-width="5" d="M220.91 431.1c90.26 15.24 161.42 9 185-36.9s-10.5-83.28-59.16-128.33S241.13 96.34 273.4 83.73s45.68 47.77 65.63 61.45c7.87 6.04 15.08 2.62 16.73.97s-.97-5.5-6.96-14.84-11.2-25.18-13.04-33.26-8.54-19.33-11.24-14.38 4.95 22.47 13.71 20.67 18.61-7.02 5.33-33.17-66.28-52.29-102.76-16.5-15.44 120.68 14.73 178.22 70.62 102.49 83.57 102.87-31.73-71.34-111.98-83.64S22.96 247.9 5.2 227.99s89.28-11.04 130.83 42.97 58.05 105.19 134.49 116.4 50.05-53.61-7.74-85.14-253.85-37.4-253.85-37.4 77.08 142.5 211.98 166.28Z" transform="translate(92.59 80.63)"/>
</svg>
```

  


并且需要使用 JavaScript 上面的 SVG 代码嵌入到一个 `id` 名为 `swan` 的 `div` 元素中：

  


```HTML
<div id="swan"></div>
```

  


使用 JavaScript 模板字面量，将上面的 SVG 代码转换成字串符，然赋予给 `swan` 的 `innerHTML` 属性：

  


```JavaScript
const inlineSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
    <defs>
        <linearGradient id="a" x1=".49" x2=".5" y1="0" y2=".71" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#152055"/>
            <stop offset="100%" stop-color="#0c0b33"/>
        </linearGradient>
        <linearGradient id="b" x1=".21" x2=".55" y1="-.27" y2="1.12" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#2cdafa"/>
            <stop offset="100%" stop-color="#002b55"/>
        </linearGradient>
        <linearGradient id="c" x1=".22" x2=".76" y1=".78" y2=".27" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#07103a"/>
            <stop offset="100%" stop-color="#7e93ff"/>
        </linearGradient>
        <linearGradient id="d" x1="1.64" x2=".4" y1="-.55" y2=".89" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#7e93ff"/>
            <stop offset="100%" stop-color="#2d3a79"/>
        </linearGradient>
        <linearGradient id="e" x1="0" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#8fc2ff"/>
            <stop offset="100%" stop-color="#fff"/>
        </linearGradient>
    </defs>
    <g transform="translate(-42.16 88.62)">
        <circle r="236.19" fill="url(#a)" transform="translate(365.1 214.95) scale(1.041)"/>
        <path fill="url(#b)" d="M-289.23 17.7c0-41.94 146.72-79.93 282.74-79.93 71.16 0 79.28 33.8 112.9 48.95 30.62 13.8 91.32 22.93 91.32 42.93 0 41.93-104.18 47.99-240.19 47.99s-246.77-18.01-246.77-59.95Z" transform="matrix(1 0 0 -1 408.65 430.25)"/>
        <path fill="url(#c)" d="M167.55 66.55c5.99 9.34 8.61 13.18 6.96 14.83s-8.85 5.08-16.73-.97c-19.95-13.68-33.35-74.05-65.63-61.45s16.88 132.42 64.7 179.3c49.47 48.5 71.46 88.2 47.89 134.1s-91.18 56.07-178.84 34.56-155.14-92.17-192.85-153.47c45.08 12.67 92.1 7.4 132.57 7.47a463.7 463.7 0 0 0-10.84-14.73c-8.47-11.01-19.67-20.15-31.97-27.55 40.6 1.73 86.4 3.09 123.06 8.7A159.08 159.08 0 0 1 95 203.5a442 442 0 0 1-20.72-35.38C44.11 110.6 23.06 25.68 59.55-10.1S143.73-27.48 162.3 6.4s9.38 48.02.61 49.82q1.44 4.49 4.63 10.33Z" transform="translate(315.65 44.48)"/>
        <path fill="#0a031b" d="M-172.03 7.98c13.64-44.81-18.9-63.65-6.73-63.65s36.11 29.62 39.84 61.54-.13 50.17-14.43 47.74-33.15 4.65-18.68-45.63Z" style="isolation:isolate" transform="matrix(.559 -.262 .229 .488 551.93 34.7)"/>
        <path fill="#ff518c" d="M470.58 125.37c-4.3-7.11-8.58-18.78-6.1-25.03s14.5-14.32 24.21 9.24 14.59 24.5 14.4 31.6-13.6 11.05-32.51-15.8Z"/>
        <path fill="url(#d)" d="M354.77 287.34c18.52 13.64 64.3 44.15 49.98 75.52s-62.6 47.16-144.99 16.56S107.1 266.79 91 241.8c139.94 2.22 185.57 2.41 263.78 45.54Z" transform="translate(54.09 14.12)"/>
    </g>
    <path fill="none" stroke="url(#e)" stroke-dasharray="2659.74" stroke-dashoffset="2659.74" stroke-miterlimit="36" stroke-width="5" d="M220.91 431.1c90.26 15.24 161.42 9 185-36.9s-10.5-83.28-59.16-128.33S241.13 96.34 273.4 83.73s45.68 47.77 65.63 61.45c7.87 6.04 15.08 2.62 16.73.97s-.97-5.5-6.96-14.84-11.2-25.18-13.04-33.26-8.54-19.33-11.24-14.38 4.95 22.47 13.71 20.67 18.61-7.02 5.33-33.17-66.28-52.29-102.76-16.5-15.44 120.68 14.73 178.22 70.62 102.49 83.57 102.87-31.73-71.34-111.98-83.64S22.96 247.9 5.2 227.99s89.28-11.04 130.83 42.97 58.05 105.19 134.49 116.4 50.05-53.61-7.74-85.14-253.85-37.4-253.85-37.4 77.08 142.5 211.98 166.28Z" transform="translate(92.59 80.63)"/>
</svg>
`

const swanEle = document.getElementById('swan');

swanEle.innerHTML = inlineSVG;
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bff9e29c22fd4b3693e8b3ad51845b1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=234669&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/wvZGKBJ

  


在之前，我们已经了解了在 CSS 中以 Data URIs 格式指定内联 SVG 的基本方法。在 JavaScript 场景中，我们也采用了类似的方法：

  


```HTML
<div class="swan" id="swan"></div>
```

  


我们可以依赖内置的 `encodeURIComponent` 方法将原始 SVG 转换为 Data URIs 编码格式。然后将其设置为 `backgroundImage` 属性的值：

  


```JavaScript
const swanSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
    <defs>
        <linearGradient id="a" x1=".49" x2=".5" y1="0" y2=".71" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#152055"/>
            <stop offset="100%" stop-color="#0c0b33"/>
        </linearGradient>
        <linearGradient id="b" x1=".21" x2=".55" y1="-.27" y2="1.12" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#2cdafa"/>
            <stop offset="100%" stop-color="#002b55"/>
        </linearGradient>
        <linearGradient id="c" x1=".22" x2=".76" y1=".78" y2=".27" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#07103a"/>
            <stop offset="100%" stop-color="#7e93ff"/>
        </linearGradient>
        <linearGradient id="d" x1="1.64" x2=".4" y1="-.55" y2=".89" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#7e93ff"/>
            <stop offset="100%" stop-color="#2d3a79"/>
        </linearGradient>
        <linearGradient id="e" x1="0" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#8fc2ff"/>
            <stop offset="100%" stop-color="#fff"/>
        </linearGradient>
    </defs>
    <g transform="translate(-42.16 88.62)">
        <circle r="236.19" fill="url(#a)" transform="translate(365.1 214.95) scale(1.041)"/>
        <path fill="url(#b)" d="M-289.23 17.7c0-41.94 146.72-79.93 282.74-79.93 71.16 0 79.28 33.8 112.9 48.95 30.62 13.8 91.32 22.93 91.32 42.93 0 41.93-104.18 47.99-240.19 47.99s-246.77-18.01-246.77-59.95Z" transform="matrix(1 0 0 -1 408.65 430.25)"/>
        <path fill="url(#c)" d="M167.55 66.55c5.99 9.34 8.61 13.18 6.96 14.83s-8.85 5.08-16.73-.97c-19.95-13.68-33.35-74.05-65.63-61.45s16.88 132.42 64.7 179.3c49.47 48.5 71.46 88.2 47.89 134.1s-91.18 56.07-178.84 34.56-155.14-92.17-192.85-153.47c45.08 12.67 92.1 7.4 132.57 7.47a463.7 463.7 0 0 0-10.84-14.73c-8.47-11.01-19.67-20.15-31.97-27.55 40.6 1.73 86.4 3.09 123.06 8.7A159.08 159.08 0 0 1 95 203.5a442 442 0 0 1-20.72-35.38C44.11 110.6 23.06 25.68 59.55-10.1S143.73-27.48 162.3 6.4s9.38 48.02.61 49.82q1.44 4.49 4.63 10.33Z" transform="translate(315.65 44.48)"/>
        <path fill="#0a031b" d="M-172.03 7.98c13.64-44.81-18.9-63.65-6.73-63.65s36.11 29.62 39.84 61.54-.13 50.17-14.43 47.74-33.15 4.65-18.68-45.63Z" style="isolation:isolate" transform="matrix(.559 -.262 .229 .488 551.93 34.7)"/>
        <path fill="#ff518c" d="M470.58 125.37c-4.3-7.11-8.58-18.78-6.1-25.03s14.5-14.32 24.21 9.24 14.59 24.5 14.4 31.6-13.6 11.05-32.51-15.8Z"/>
        <path fill="url(#d)" d="M354.77 287.34c18.52 13.64 64.3 44.15 49.98 75.52s-62.6 47.16-144.99 16.56S107.1 266.79 91 241.8c139.94 2.22 185.57 2.41 263.78 45.54Z" transform="translate(54.09 14.12)"/>
    </g>
    <path fill="none" stroke="url(#e)" stroke-dasharray="2659.74" stroke-dashoffset="2659.74" stroke-miterlimit="36" stroke-width="5" d="M220.91 431.1c90.26 15.24 161.42 9 185-36.9s-10.5-83.28-59.16-128.33S241.13 96.34 273.4 83.73s45.68 47.77 65.63 61.45c7.87 6.04 15.08 2.62 16.73.97s-.97-5.5-6.96-14.84-11.2-25.18-13.04-33.26-8.54-19.33-11.24-14.38 4.95 22.47 13.71 20.67 18.61-7.02 5.33-33.17-66.28-52.29-102.76-16.5-15.44 120.68 14.73 178.22 70.62 102.49 83.57 102.87-31.73-71.34-111.98-83.64S22.96 247.9 5.2 227.99s89.28-11.04 130.83 42.97 58.05 105.19 134.49 116.4 50.05-53.61-7.74-85.14-253.85-37.4-253.85-37.4 77.08 142.5 211.98 166.28Z" transform="translate(92.59 80.63)"/>
</svg>
`

const encodedSVG = encodeURIComponent(swanSVG);

const swanEle = document.getElementById('swan');

swanEle.style.backgroundImage = `url("data:image/svg+xml,${encodedSVG}")`;
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5f2ce8fb7974cc891c50aac0e375efb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=185822&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/wvZGKBJ

  


在 HTML 和 CSS 中指定 SVG 的另一种方法是采用 Base64 编码的方式。从普通 SVG 到普通 SVG 的 Base64 版本，可以使用 `btoa` 函数。

  


```JavaScript
const swanSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
    <defs>
        <linearGradient id="a" x1=".49" x2=".5" y1="0" y2=".71" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#152055"/>
            <stop offset="100%" stop-color="#0c0b33"/>
        </linearGradient>
        <linearGradient id="b" x1=".21" x2=".55" y1="-.27" y2="1.12" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#2cdafa"/>
            <stop offset="100%" stop-color="#002b55"/>
        </linearGradient>
        <linearGradient id="c" x1=".22" x2=".76" y1=".78" y2=".27" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#07103a"/>
            <stop offset="100%" stop-color="#7e93ff"/>
        </linearGradient>
        <linearGradient id="d" x1="1.64" x2=".4" y1="-.55" y2=".89" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#7e93ff"/>
            <stop offset="100%" stop-color="#2d3a79"/>
        </linearGradient>
        <linearGradient id="e" x1="0" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox" spreadMethod="pad">
            <stop offset="0%" stop-color="#8fc2ff"/>
            <stop offset="100%" stop-color="#fff"/>
        </linearGradient>
    </defs>
    <g transform="translate(-42.16 88.62)">
        <circle r="236.19" fill="url(#a)" transform="translate(365.1 214.95) scale(1.041)"/>
        <path fill="url(#b)" d="M-289.23 17.7c0-41.94 146.72-79.93 282.74-79.93 71.16 0 79.28 33.8 112.9 48.95 30.62 13.8 91.32 22.93 91.32 42.93 0 41.93-104.18 47.99-240.19 47.99s-246.77-18.01-246.77-59.95Z" transform="matrix(1 0 0 -1 408.65 430.25)"/>
        <path fill="url(#c)" d="M167.55 66.55c5.99 9.34 8.61 13.18 6.96 14.83s-8.85 5.08-16.73-.97c-19.95-13.68-33.35-74.05-65.63-61.45s16.88 132.42 64.7 179.3c49.47 48.5 71.46 88.2 47.89 134.1s-91.18 56.07-178.84 34.56-155.14-92.17-192.85-153.47c45.08 12.67 92.1 7.4 132.57 7.47a463.7 463.7 0 0 0-10.84-14.73c-8.47-11.01-19.67-20.15-31.97-27.55 40.6 1.73 86.4 3.09 123.06 8.7A159.08 159.08 0 0 1 95 203.5a442 442 0 0 1-20.72-35.38C44.11 110.6 23.06 25.68 59.55-10.1S143.73-27.48 162.3 6.4s9.38 48.02.61 49.82q1.44 4.49 4.63 10.33Z" transform="translate(315.65 44.48)"/>
        <path fill="#0a031b" d="M-172.03 7.98c13.64-44.81-18.9-63.65-6.73-63.65s36.11 29.62 39.84 61.54-.13 50.17-14.43 47.74-33.15 4.65-18.68-45.63Z" style="isolation:isolate" transform="matrix(.559 -.262 .229 .488 551.93 34.7)"/>
        <path fill="#ff518c" d="M470.58 125.37c-4.3-7.11-8.58-18.78-6.1-25.03s14.5-14.32 24.21 9.24 14.59 24.5 14.4 31.6-13.6 11.05-32.51-15.8Z"/>
        <path fill="url(#d)" d="M354.77 287.34c18.52 13.64 64.3 44.15 49.98 75.52s-62.6 47.16-144.99 16.56S107.1 266.79 91 241.8c139.94 2.22 185.57 2.41 263.78 45.54Z" transform="translate(54.09 14.12)"/>
    </g>
    <path fill="none" stroke="url(#e)" stroke-dasharray="2659.74" stroke-dashoffset="2659.74" stroke-miterlimit="36" stroke-width="5" d="M220.91 431.1c90.26 15.24 161.42 9 185-36.9s-10.5-83.28-59.16-128.33S241.13 96.34 273.4 83.73s45.68 47.77 65.63 61.45c7.87 6.04 15.08 2.62 16.73.97s-.97-5.5-6.96-14.84-11.2-25.18-13.04-33.26-8.54-19.33-11.24-14.38 4.95 22.47 13.71 20.67 18.61-7.02 5.33-33.17-66.28-52.29-102.76-16.5-15.44 120.68 14.73 178.22 70.62 102.49 83.57 102.87-31.73-71.34-111.98-83.64S22.96 247.9 5.2 227.99s89.28-11.04 130.83 42.97 58.05 105.19 134.49 116.4 50.05-53.61-7.74-85.14-253.85-37.4-253.85-37.4 77.08 142.5 211.98 166.28Z" transform="translate(92.59 80.63)"/>
</svg>
`

// const encodedSVG = encodeURIComponent(swanSVG);
const base64version = window.btoa(swanSVG);

const swanEle = document.getElementById('swan');

// swanEle.style.backgroundImage = `url("data:image/svg+xml,${encodedSVG}")`;

swanEle.style.backgroundImage = `url("data:image/svg+xml;base64,${base64version}")`;
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a6ca3722ccc4cccadd27e8790198db6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=933&s=185822&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/zYXqvEQ

  


请注意，我们将 SVG 的 Base64 版本存储到 `base64version` 变量中，然后将其提供给元素的 `backgroundImage` 属性。

  


上面这两种方式，也可以直接用于 HTML 的 `<img>` 元素的 `src` 属性。

  


### 哪种 SVG 技术应该使用？

选择 SVG 图像的适当技术取决于特定的使用场景和需求。以下是对三种常见技术的简要比较：

  


-   **SVG图像**： 适用于需要在多个页面或多个项目中多次使用的图像。适合那些需要缓存且不经常更改的静态图像。可以方便地在多个地方重复使用，可以利用浏览器缓存，易于维护和更新。不足之处是，每次使用时需要重新加载，不适合需要动态或实时更新的场景。
-   **内联SVG**：适用于需要在 HTML 文件中嵌入、操纵或样式化的图像，尤其是需要与 DOM 元素进行交互的情况。可以直接在 HTML 中嵌入，便于样式和脚本操纵，适用于需要交互性的图像。不足之处是，每次页面加载时都需要加载 SVG 内容，不适用于大型或频繁更改的图像。
-   **SVG Data URIs**：适用于需要将 SVG 直接嵌入 CSS 或 JavaScript 中的场景，或者希望减少 HTTP 请求次数的情况。可以通过减少 HTTP 请求次数提高性能，适用于小型图像或需要在 CSS 、 JavaScript 中使用的场景。不足之处是，可读性较差，不适用于大型或需要频繁更改的图像。

  


根据具体需求，可以灵活选择这些技术的组合或单独使用其中一种。

  


简单地说，如果你将 SVG 用作图像，不需要更改样式或添加脚本，那么 `<img>` 标签或 CSS 背景可能是最佳选择。文件可以在浏览器中缓存，无需重新下载即可在其他页面上重复使用。在需要交互性的情况下，直接将 SVG 嵌入 HTML 中是最流行的选择。

  


`<object>` 标签已经失宠。然而，如果你想要保持 SVG 的独立性和可缓存性，它仍然是一种可行的技术，但需要一些 JavaScript 操作。对于一些项目，`<iframe>` 可能是合适的选择，但除非你必须为古老的浏览器编码，否则永远不要使用 `<embed>`。

  


以下表格从独立的文件、动画、用户交互、JavaScript 操作和外部可控等几个方面对内联 SVG、SVG 图像、SVG Data URIs 和 Object 进行了对比。根据具体需求，选择最适合的 SVG 技术：

  


|                | **内联 SVG** | **SVG 图像** | **Data URIs** | **Object** |
| -------------- | ---------- | ---------- | ------------- | ---------- |
| **独立的文件**      | **❌**      | **✅**      | **✅**         | **✅**      |
| **动画**         | ✅          | ✅          | ✅             | ✅          |
| **用户交互**       | ✅          | ❌          | ❌             | ✅          |
| **JavaScript** | ✅          | ❌          | ❌             | ✅          |
| **外部可控**       | ✅          | ❌          | ❌             | ❌          |

  


## 小结

  


我之前提到我们将探讨数十种在 Web 上展示 SVG 的方法。我相信，即便不详尽列举每一种变体，我们也几乎能够涵盖所有情况。此刻，我不确定你是否有相同的感觉，但我们在 HTML、CSS 和 JavaScript 中讨论的方法应该足以满足你在 Web 开发中可能会遇到的各种需求。