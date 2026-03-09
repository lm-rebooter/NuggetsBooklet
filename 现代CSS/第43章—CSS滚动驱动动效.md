滚动驱动动效是 Web 上常见的一种用户交互模式。在过去，Web 开发者要么使用 JavaScript 的滚动事件（`scroll`），要么使用像 [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 这样的东西，要么使用像 GreenSock 动画库来实现它。如今，W3C 的 CSS 工作小组为滚动驱动动效提供相应的规范（**[Scroll-driven Animations](https://www.w3.org/TR/scroll-animations-1/)**），可以将滚动作为 CSS 动画的时间轴。也就是说，借助滚动驱动的动效，Web 开发者可以根据滚动容器的滚动位置控制动画的播放。这意味着，当你向上或向下滚动时，CSS 动画会向前或向后播放。此外，借助滚动驱动的动效，Web 开发者还可以根据元素在其滚动容器中的位置来控制动画。这样一来，你就可以制作有趣的交互效果，例如视差滚动、滚动进度指示器，以及在进入视图时显示的图片可以具有淡入淡出的效果。接下来，我将通过一些实际案例来告诉大家如何使用 CSS 滚动驱动动效来创建一些有趣的交互。

## CSS 滚动驱动动效是什么？

当我们想到滚动驱动动效时，通常指的是下面两种情况之一。

首先来看第一种。当用户滚动时发生的动画，动画播放的时度与滚动进度相关联。例如，文章阅读指示器：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e417d648b9b48cfb14b1a5fa3ae149b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://scroll-driven-animations.style/demos/progress-bar/css/>

另外一种是，在元素进入、退出或通过可视区域时发生的动画。通常是浏览器视窗，但也可以是另一个可滚动容器的可见部分。例如，轮播图片指示器：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42e52c5dd6174539961ef16fb93cb760~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://scroll-driven-animations.style/demos/horizontal-carousel/css/>

CSS 滚动驱动动效规范（[Scroll-driven Animations](https://www.w3.org/TR/scroll-animations-1/)）涵盖了这两种类型的动画。

那什么是 CSS 滚动驱动动效呢？

我们先从 CSS 动画讲起。默认情况下，CSS 动画播放都是使用文档时间轴（[DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline)），简单来说就是页面加载完成后就开始运行 `@keyframes` 内所定义动画，即**动画播放进度是跟着自然时间走的**。

而 **CSS 滚动驱动动效指的是将动画的执行（播放）过程由页面（或滚动容器）的滚动进行接管**。也就是说，CSS 滚动驱动的动画只会跟随滚动容器的滚动进度而变化，即滚动条滚动了多少，动画就播放多少，时间已不再起作用。

换句话说，CSS 滚动驱动动画又是如何改变动画的时间线呢？为此，CSS 滚动驱动动效规范（[Scroll-driven Animations](https://www.w3.org/TR/scroll-animations-1/)）定义了两种改变动画的时间线，用于控制 CSS 动画播放进度：

*   **滚动进度时间线** （**Scroll Progress Timeline**），简称 `scroll-timeline`，代表容器已滚动的距离，从 `0% ~ 100%`
*   **视图进度时间线** （**View Progress Timeline**），简称 `view-timeline`，代表一个在容器内的元素相对于滚动距离的相对位置，从 `0% ~ 100%`

在 CSS 中，我们可以使用 `animation-timeline` 属性将这些时间轴附加到动画。整个 CSS 滚动驱动动效所涵盖的 CSS 属性如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1beeb860589c43c082679716f96aeedb~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，CSS 的 `animation-timeline 属性`是 [CSS Animations Level 2 规范](https://www.w3.org/TR/css-animations-2)中新增的一个 CSS 属性！它可以接受的值有 `auto` （默认值） 、`none` 、`<custom-ident>` 、`scroll()` 或 `view()` 。

在开始介绍这些属性如何使用之前，我们先来简单回顾一下 Web 动画！

## 简单地回顾一下 Web 动画

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2da9c3f263aa4f88bc5a61b20b001090~tplv-k3u1fbpfcp-zoom-1.image)

CSS Animation 和 Web Animation API 是创建 Web 动画的常见方式。

### 使用 CSS Animation 为 Web 创建动画

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65191592069d40c1abe4224818ebd773~tplv-k3u1fbpfcp-zoom-1.image)

在 CSS 中，可以使用 `@keyframes` 规则定义一组关键帧。使用 `animation-name` 属性将 `@keyframes` 指定的关键帧动画运用到一个元素上，同时设置 `animation-duration` 来决定动画完成的时间（应该持续多长时间）。也可以使用属性，比如 `animation-timing-function` 、`animation-fill-mode` 和 `animation-iteration-count` 来设置动画。

例如，这里有一个动画，它在 `x` 轴上缩放一个元素，同时改变它的背景颜色：

```CSS
@keyframes scale-up {
    from {
        background-color: hotpink;
        transform:scaleX(0);
    }
    to {
        background-color: #9b1759;
        transform:scaleX(1);
    }
}
​
.progress {
    animation: 2.5s linear forwards scale-up;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af0a1475302f4b659c2994f7075b140c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqOyRL>

### 使用 Web Animation API 为 Web 制作动画

[Web 动画 API](https://www.w3.org/TR/web-animations-1/) （Web Animation API）简称 WAAPI，它将浏览器动画引擎向 Web 开发者开放，并由 JavaScript 进行操作。Web 动画 API 被设计成 CSS Animation 和 CSS Transition 的接口（未来会对这些 API 做补充以丰富更多的功能）允许 Web 开发者使用 JavaScript 写动画并且控制动画。

简单地说，通过 Web 动画 API，我们可以将交互式动画从样式表（比如 CSS 的 `transition` 和 `animation` 动画）移动到 JavaScript，将表现与行为分开。例如，上面的 CSS `animation` 动画，我们可以使用 Web 动画 API 来实现完全相同的效果。你可以通过创建新的 `Animation` 和 `KeyFrameEffect` 实例，或者使用 `Element.animate()` 方法来实现：

```JavaScript
document.querySelector('.progress').animate(
    {
        backgroundColor: ['hotpink', '#9b1759'],
        transform: ['scaleX(0)', 'scaleX(1)'],
    },
    {
        duration: 2500,
        fill: 'forwards',
        easing: 'linear',
    }
);
```

> Demo 地址：<https://codepen.io/airen/full/qBQwYGP>

## 快速入门 CSS 滚动驱动动效

很显然，上面两种方式（CSS `animation` 和 WAAPI）制作的 Web 动画没有太大的意义。如果你想让这个 CSS 动画只在用户滚动页面时运行，并且滚动多少，动画就播放多少。只需在动画元素 `.progress` 上添加以下 CSS 代码：

```CSS
.progress {
    animation-timeline: scroll(root);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13b47d4fe685466ba78806227b57c66c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQOyvE>

这很简单，对吧？关键帧的百分比与用户滚动的百分比相同。在这个例子中，我们要把一个值从 `0` 变到 `100%` ，这是整个滚动页的长度。

但代码中的 `animation-timeline` 属性和 `scroll()` 函数又是什么呢？这是 CSS 的新特性，非常令人兴奋，因为它们可以帮助我们快速构建滚动驱动动效。

## 了解动画时间轴

前面提到过，[CSS 滚动驱动动效规范](https://www.w3.org/TR/scroll-animations-1/)为 CSS 动画定义了两种新的可以使用的时间线（也称时间轴）类型：

*   **[滚动进度时间轴](https://www.w3.org/TR/scroll-animations-1/#scroll-timelines)** ：与滚动容器沿特定轴的滚动位置的进度相关联的时间轴，可以使用 `scroll()` 函数匿名使用（将 `animation-timeline` 属性设置为 `scroll()`），也可以通过 `scroll-timeline` 属性引用名称使用。在 WAAPI 中，它们可以通过 `ScrollTimeline` 对象匿名表示。
*   **[视图进度时间轴](https://www.w3.org/TR/scroll-animations-1/#view-timelines)** ：与滚动容器内特定元素的相对进度相关联的时间轴，可以使用 `view()` 函数匿名使用（将 `animation-timeline` 属性设置为 `view()`），也可以通过 `view-timeline` 属性引用名称使用。在 WAAPI 中，它们可以通过 `ViewTimeline` 对象匿名表示。

简单地说，在 CSS 中，可以使用 `animation-timeline` 属性将这些时间轴附加到元素上的动画。所以，我们有必要花一些篇幅来了解这些新时间轴的含义以及差异。

### 滚动进度时间轴

滚动进度时间轴是与滚动容器（也称滚动端口或滚动条）沿特定轴的滚动位置相关联的动画时间轴。它会将滚动范围内的某个位置转换为时间轴上的进度百分比。这意味着，页面或者容器滚动时，会将滚动进度映射到动画进度上。

开始滚动位置代表 `0%` 进度，结束滚动位置代表 `100%` 进度。在下面的可视化演示中，当你向下滚动滚动条时，进度会从 `0%` 增加到 `100%` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdc31ecd76324c2dbffaa0826a104d79~tplv-k3u1fbpfcp-zoom-1.image)

> 滚动进度时间轴可视化演示工具：<https://scroll-driven-animations.style/tools/scroll-timeline/progress/?debug=>

注意，滚动进度时间轴通常也称为“**滚动时间轴**”。

### 视图进度时间轴

视图进度时间轴与滚动容器中特定元素的相对进度相关联。与滚动进度时间轴一样，系统会跟踪滚动条的滚动偏移量。与滚动进度时间轴不同的是，视图进度时间轴决定进度的是该滚动条中主题的相对位置。简单地说，视图进度时间轴表示的是一个元素出现在页面视野范围内的进度，也就是关注的是元素自身位置。元素刚出现之前代表 `0%` 进度，元素完全离开之后代表 `100%` 进度。在下面的可视化演示中，当元素进入滚动容器时，进度会从 `0%` 开始计数，当元素离开滚动容器时，进度会达到 `100%` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92f2c6052000482692bfc190af559d88~tplv-k3u1fbpfcp-zoom-1.image)

> 视图进度时间轴可视化演示工具：<https://scroll-driven-animations.style/tools/view-timeline/progress/?debug=>

视图进度时间轴的概念与 JavaScript 的 `IntersectionObserver` （交叉观察者）非常相似，可以监测到元素在可视区的情况，因此，在这种场景中，无需关注滚动容器是哪个，只有处理自身就行了。不同的是：

*   `IntersectionObserver` 用于跟踪元素在滚动条中的可见程度。如果该元素在滚动条中不可见，则不会交叉。如果它在滚动条内可见（即使是最小部分），则会交叉。
*   视图进度时间轴从元素开始与滚动条相交开始，到元素停止与滚动条交叉时结束

默认情况下，与视图进度时间轴关联的动画会附加到其整个范围。此动画从元素进入滚动端口的那一刻开始，到元素离开滚动端口时结束。

注意，视图进度时间轴通常也称为“**视图时间轴**”。

## 滚动进度时间轴实战

接下来，我们通过一些实例来向大家阐述，如何使用 CSS 滚动进度时间轴来构建滚动驱动动效？

### 使用 `scroll()` 函数创建匿名滚动进度时间轴

在前面所呈现的滚动驱动动效的示例中，出现了一个大家不怎么熟悉的 CSS 属性（`animation-timeline`）和函数 `scroll()` 。我想大家并不知道它们的作用以及使用。

其实，这是在 CSS 中创建滚动时间轴最简单的方法，即在动画元素上设置 `animation-timeline` 的值为 `scroll()` ，例如：

```CSS
.progress {
    animation-timeline: scroll();
}
```

在这里，我们使用 `scroll()` 函数创建了一个匿名滚动时间轴。该函数可以接受两个参数值，即 `<scroller>` 和 `<axis>` ：

    <scroll()> = scroll( [ <scroller> || <axis> ]? )

其中，`<scroller>`表示滚动容器，可接受的值有：

*   **`nearest`**：使用最近的祖先滚动容器（**默认值**）
*   **`root`**：使用文档视口作为滚动容器
*   **`self`**：使用元素本身作为滚动容器

`<axios>`表示滚动方向，可接受的值有：

*   **`block`**：滚动容器的块级轴方向（**默认值**）
*   **`inline`**：滚动容器内联轴方向
*   **`y`**：滚动容器沿 `y` 轴方向
*   **`x`**：滚动容器沿 `x` 轴方向

在具体使用的时候，可以不给 `scroll()` 函数传递任何参数值，例如：

```CSS
.animation-element {
    animation-timeline: scroll();
}
```

它等同于：

```CSS
.animation-element {
    animation-timeline: scroll(nearest block);
}
```

你也可以只给 `scroll()` 传递一个参数，例如：

```CSS
.animation-element {
    /* 设置滚动容器 */
    animation-timeline: scroll(nearest); 
    animation-timeline: scroll(root);
    animation-timeline: scroll(self);
    
    /* 设置滚动方向 */
    animation-timeline: scroll(block); 
    animation-timeline: scroll(inline);
    animation-timeline: scroll(y);
    animation-timeline: scroll(x);
}
```

需要注意的是，当另一个参数被省略时，将会取其参数的默认值，例如：

```CSS
.animation-element {
    animation-timeline: scroll(root);
    
    /* 等同于 */
    animation-timeline: scroll(root block); /* block 是 <axis> 参数的默认值 */
}
​
.animation-element {
    animation-timeline: scroll(inline);
    
    /* 等同于 */
    animation-timeline: scroll(nearest inline); /* nearest 是 <scroller> 参数的默认值 */
}
```

你也可以同时给 `scroll()` 函数传递两个参数值，例如：

```CSS
.animation-element {
    animation-timeline: scroll(nearest block); /* 默认值 */
    animation-timeline: scroll(root inline);
    animation-timeline: scroll(self y);
}
```

需要注意的是，当给 `scroll()` 函数同时传递两个参数值时，需要使用空格符对它们进行分开。

这是一个非常方便的功能，特别是针对页面的根滚动容器。例如，Web 上部分页面底部右下角处会为用户提供一个“返回到顶部”的按钮或图标。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40f87ee7780f4d77bc9a631efdeb5b43~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，页面右下角的“返回到页面顶部”图标默认是不可见的，只有用户滚动到页面长度的某个位置（比如页面长度的 `20%`）时才会显示，同时用户点击该图标时，页面会滚动到顶部，此时图标也不可见。以往要实现这种交互效果，Web 开发者或多或少都需要依赖 JavaScript。

今天开始，Web 开发者可以不使用 JavaScript 就可以轻松完成：

```HTML
<main id="top">
    <!-- 页面其他内容 -->
    <a href="#top" class="scroll-to-top">
        <svg></svg>
        <span class="visually-hidden">Scroll to top</span>
    </a>
</main>
```

我们只需要在 CSS 中编写以下代码：

```CSS
@keyframes revealScroller {
    0%,
    10% {
        opacity: 0;
        transform: translateY(100%);
    }
    18%,
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
​
.scroll-to-top {
    animation: revealScroller 0.2s ease-out;
    animation-timeline: scroll(root);
}
```

当用户滚动到页面的 `10%` 时，按钮（`.scroll-to-top`）将显示自己，当用户滚动到页面的 `18%` 时，按钮（`.scroll-to-top`）将完全可见：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28b218b794394b388feeac93a5939a23~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXvgGd>

需要注意的是，`animation-timeline` 属性不是 `animation` 简写的一部分，必须要单独声明。此外，`animation-timeline` 必须在 `animation` 之后声明，否则 `animation` 会将 `animation-timeline` 重置为初始值。其次，在使用滚动进度时间轴时，以秒为单位设置动画持续时间（`animation-duration`）是没有意义的，所以必须将动画持续时间（`animation-duration`）设置为 `auto` ，或者不显式设置动画持续时间，因为它将使用其默认值 `auto`。或者，像上面示例代码一样，将 `animation-duration` 设置为一个非 `0` 的值（因为 `0` 表示动画不执行）。

另一个有用的例子是，可以用滚动进度时间轴来创建滚动视差效果，例如创建视差背景效果。在页面中向下滚动时，背景图片会移动，只是速度不同。

如需实现这一点，需要完成两个步骤：

*   创建一个用于移动背景图片位置的动画。
*   将动画与文档的滚动进度相关联。

你可以给运用于 `body` 的背景图片添加一个帧动画，使用 `@keyframes` 调整背景图片 `Y` 轴的位置，即：

```CSS
@keyframes move-background {
    from {
        background-position: 50% 0%;
    }
    to {
        background-position: 50% 100%;
    }
}
​
body {
    animation: move-background 1s linear;
}
```

然后，使用滚动进度时间轴将动画与块轴上的根滚动条相关联起来：

```CSS
body {
    animation-timeline: scroll(root block);
}
```

由于根滚动条恰好是 `body` 元素的最接近的父滚动条，因此你还可以使用值 `nearest`：

```CSS
body {
    animation-timeline: scroll(nearest block);
}
```

由于 `nearest` 和 `block` 是默认值，因此你可以选择省略它们。在这种情况下，代码可以简化为：

    body {
        animation-timeline: scroll(nearest block);
    }

如果一切顺利，你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b79153d555404d50adf219217c411cb6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGEqGo>

### 使用 scroll-timeline 创建一个命名的滚动进度时间轴

如果动画元素不需要与最近的祖先或根滚动交互，而是与页面上其他地方发生的滚动交互，或者当页面使用多个时间轴或自动查找不起作用时，那么使用命名滚动进度时间轴就很有用。这样，你就可以根据所给的名称来标识滚动进度时间轴。这也是定义滚动进度时间轴的另一种方法。

若要在元素创建命名的滚动进度时间轴，就需要使用 `scroll-timeline` 属性给滚动进度时间轴命名，而且必须以 `--` 开头，有点类似于 CSS 自定义属性的命名方式。

`scroll-timeline` 是 `scroll-timeline-name` 和 `scroll-timeline-axis` 两个属性的简写属性：

*   `scroll-timeline-name` ：为滚动进度时间轴命名，命名方式必须以 `--` 为前缀，例如 `--timeline-name`
*   `scroll-timeline-axis` ：设置滚动方向，与 `scroll()` 函数中的 `<axis>` 值相似，主要包含 `x` 、`y` 、`inline` 和 `block` 等值

来看一个真实的案例，给图库添加进度指示器：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8af75ce396524ac58aeb26972778443d~tplv-k3u1fbpfcp-zoom-1.image)

假设页面上有一个横向轮播图组件（如上图所示），我们需要给这个轮播图组件添加一个进度指示器，来告诉用户当前正在查看哪张图片。

构建这样的一个轮播图组件，你可能用到像下面这样的 HTML 结构：

```HTML
<div class="gallery">
    <div class="gallery__scrollcontainer" style="--num-images: 3;"><!-- --num-image 的值与下面 gallery__entry 数量相匹配 -->
        <div class="gallery__progress">
            <!-- 进度指示器 -->
        </div>
        <div class="gallery__entry">
            <figure>
                <img src="https://source.unsplash.com/PX_1j-M59I8" alt="" title="" draggable="false" width="1080" height="720" />
                <figcaption><a href="https://assets.codepen.io/89905/photo-1610570426407-efa770f9d31a.jpeg">Polar bear walking</a> by <a href="https://unsplash.com/@dtbosse">Daniel Bosse</a></figcaption>
            </figure>
        </div>
        <!-- 省略其他的 .gallery__entry -->                                
    </div>
</div>
```

进度指示器元素（也是动画元素）`.gallery__progress` 在 `.gallery` 容器中进行绝对定位，并且初始大小由 `--num-images` 自定义属性来决定。

```CSS
@layer gallery {
    .gallery {
        position: relative;
    }
    
    .gallery__progress {
        position: absolute;
        top: 0;
        left: 0;
        right: 0%;
        width: 100%;
        height: 1em;
        transform-origin: 0 50%;
        background: #FF9800;
        transform: scaleX(calc(1 / var(--num-images)));
    }
}
```

注意，自定义属性 `--num-images` 的值应该与 `.gallery` 中的 `.gallery__entry` 相匹配，在该示例中是 `3` 。

我们可以在 `.gallery__scrollcontainer` 中使用 Flexbox 布局，将所有的 `.gallery__entry` 元素水平排列，并且不换行，并且在 `.galler__scrollcontainer` 上设置 `overflow-x: scroll` ，实现图片轮播的布局：

```CSS
@layer gallery {
    .gallery__scrollcontainer {
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        display: flex;
        flex-direction: row;
    }
    
    .gallery__entry {
        scroll-snap-align: center;
        flex: 0 0 100%;
    }
}
```

> 注意，为了能给用户带来更好的滚动体验，在示例中我们使用了滚动捕捉相关的特性，如果你对这方面知识感兴趣，可以移步阅读《[CSS 的滚动捕捉](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)》一文。

接着使用 `@keyframes` 为轮播图库进度指示器创建一个动画：

```CSS
@layer animation {
    @keyframes adjust-progress {
        from {
            transform: scaleX(calc(1 / var(--num-images)));
        }
        to {
            transform: scaleX(1);
        }
    }
}
```

也可以像下面这样创建 `adjust-progress` 动画：

```CSS
@layer animation {
    @keyframes adjust-progress {
        to {
            transform: scaleX(1);
        }
    }
}
```

最后，可以在 `.gallery__scrollcontainer` 元素上使用 `scroll-timeline` 创建一个具名的滚动进度时间轴，用来跟踪其滚动位置：

```CSS
@layer animation {
    .gallery__scrollcontainer {
        scroll-timeline: --gallery-is-scrolling inline;
    }
    
    /* 等同于 */
    .gallery__scrollcontainer {
        scroll-timeline-name: --gallery-is-scrolling;
        scroll-timeline-axis: inline;
    }
}
```

由于我们示例是一个水平滚动，所以需要设置 `scroll-timeline-axis` 的值为 `inline` （也可以是 `x`），用来指定滚动方向。

最后，若要将动画与滚动进度时间轴相关联，请将需要添加动画效果的元素上的 `animation-timeline` 属性设置为与 `scroll-timeline-name` 所用的标识符相同的值。

```CSS
@layer animation {
    .gallery__progress {
        animation: auto linear adjust-progress;
        animation-timeline: --gallery-is-scrolling;
    }
}
```

如果不出意外，你将能看到下图这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3188d0ad7bc4fafb480728e90aff65b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwVNVML>

注意，就上面这个示例而言，使用 `scroll()` 创建的匿名滚动进度时间轴是行不通的。例如，你在 `.gallery__progress` 动画元素上设置 `animation-timeline: scroll(nearest inline)` ，它将不会从 `.gallery__scrollcontainer` 中找到滚动容器，即使该元素是它的直接父元素。这是因为，`.gallery__progress` 是绝对定位的，所以决定它的大小和位置的第一个元素是 `.gallery` 元素，因为我们在 `.gallery` 元素上显式设置了 `position: relative` ，因此跳过了 `.gallery__scrollcontainer` 元素。

我们有的时候会碰到动画元素要与页面上其他地方发生的滚动交互。比如下面这个示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d5241fb75464ede9d67a4552495f363~tplv-k3u1fbpfcp-zoom-1.image)

正如你所看到的，动画元素 `.animation` 是与页面上列表元素的容器 `.list` （它是一个滚动容器）发生交互。它的 HTML 结构像下面这样：

```HTML
<section>
    <div class="list"><!-- 它是一个滚动容器 -->
        <ul>
            <li>Ducks, geese, and waterfowl</li>
            <!-- 其他列表项 li -->
        </ul>
    </div>
    <div class="animation">
        <!-- 动画元素 -->
    </div>
</section>
```

在这个例子中，`.list` 元素有一个固定高度，并且设置了 `overflow-y: auto` ，它已然是一个滚动容器：

```CSS
.list {
    max-height: var(--container-height);
    border: 2px solid #37392e;
    border-radius: 5px;
    scroll-snap-type: y mandatory;
    overscroll-behavior-y: contain;
    overflow-x: hidden;
    overflow-y: auto;
}
```

在这个例子中，`.animation` 并不是 `.list` 的子元素。当我们在 `.list` 中滚动时，我们希望 `.animation` 做一些事情，比如改变 `.animation` 元素的背景图片位置，让它看上去随着 `.list` 滚动：

```CSS
@keyframes moveBackground {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 calc(var(--container-height) / -1);
    }
}

.animation {
    animation: moveBackground alternate linear;
}
```

要真正实现所要的效果，我们需要从创建一个自定义的滚动进度时间轴开始，所以我们将使用 `scroll-timeline` 来给 `.list` 命名一个滚动进度时间轴：

```CSS
.list {
    scroll-timeline: --listTimeline block;
}
​
/* 等同于 */
.list {
    scroll-timeline-name: --listTimeline;
    scroll-timeline-axis: block;
}
```

由于 `block` 是 `scroll-timeline-axis` 的默认值，所以我们也可以像下面这样给 `.list` 命名一个滚动进度时间轴：

```CSS
.list {
    scroll-timeline: --listTimeline;
}
```

你可能想着，接下来在 `.animation` 元素上使用 `animation-timeline` 引用已命名的滚动进度时间轴，元素就会有相应的动画效果了：

```CSS
.animation {
    animation: moveBackground alternate linear;
    animation-timeline: --listTimeline;
}
```

不幸的是，仅仅添加这个是不够的，因为我们的 `.animation` 不是正在滚动的元素（`.list`）的子元素，我们需要一些方法让它们父元素（示例中的 `section`）知道它们属于同一个作用域，这就是时间线作用域（`timeline-scope`）派上用场的地方。简单地说，你需要在 `section` 使用 `timeline-scope` 指定 `.animation` 和 `.list` 元素滚动进度时间轴的作用域相同的：

```CSS
section {
    timeline-scope: --listTimeline;
}
```

注意，`timeline-scope` 的值是 `scroll-timeline-name` 的值。

最终核心 CSS 代码如下：

```CSS
@layer animation {
    @keyframes moveBackground {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: 0 calc(var(--container-height) / -1);
        }
    }
  
    section {
        timeline-scope: --listTimeline;
    }
    
    .animation {
        animation: moveBackground alternate linear;
        animation-timeline: --listTimeline;
    }
​
    .list {
        scroll-timeline: --listTimeline block;
    }
}
```

最终效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1af1f6d974a14c1baa6c420ed62c6d03~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQgWpw> （请使用 Chrome Canary 查看）

使用同样的技术，你还可以实现水平滚动驱动动效，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d599f80bffaf4238a23eada28c825da6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQbgxe> （请使用 Chrome Canary 查看）

注意，有关于时间轴作用域相关的话题我们稍后会详细阐述。

## 视图进度时间轴实战

视图进度时间轴和滚动进度时间轴相似，也分为匿名视图进度时间轴和命名视图进度时间轴两种。我们先来看第一种，匿名视图进度时间轴创建与使用。

### 使用 view() 函数创建匿名视图进度时间轴

在 CSS 中，我们可以使用 `view()` 函数来创建一个匿名视图进度时间轴，该函数和 `scroll()` 函数类似，也接受两个参数，即 `<axis>` 和 `<view-timeline-inset>` ：

*   `<axis>` ：与滚动进度时间轴相同，定义滚动的方向，可接受的值有 `x` 、`y` 、`inline` 和 `block` ，其中默认值为 `block`
*   `<view-timeline-inset>` ：用来指定一个偏移量（正或负），以便在元素被视为是否在视图范围内时调整边界。该值必须是百分比值或 `auto` ，其中 `auto` 是其默认值。另外，它支持两个值，例如 `view(100% 20%)` ，它们表示开始和结束两个范围

我们先来看一个简单的示例，卡片叠加的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96d44721ae7e4629a83cd4a4d4e2e63d~tplv-k3u1fbpfcp-zoom-1.image)

你可能需要一个像下面这样的 HTML 结构：

```HTML
<main>
    <ul class="cards" style="--numcards: 6;">
        <li class="card" style="--index: 1;">
            <div class="card__content">
                <div>
                    <h2>Card One</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <p><a href="#top" class="btn btn--accent">Read more</a></p>
                </div>
                <figure>
                    <img src="https://picsum.photos/800/800?random=2" alt="Image description">
                </figure>
              </div>
          </li>
          <!-- 省图其他 li -->
    </ul>
</main>
```

注意，`.cards` 和 `.card` 中定义的自定义属性 `--numcards` 和 `--index` 稍后在制作动画效果时会用到，其中 `--numcards` 的值是卡片总数量，`--index` 是卡片在源码中所对应的索引值。

首先给卡片创建一个缩放动画，这里使用 `scale()` 函数来创建：

```CSS
.card {
    --index0: calc(var(--index) - 1);
    --reverse-index: calc(var(--numcards) - var(--index0));
}
  
@keyframes scale {
    100% {
        scale: calc(1.1 - calc(0.1 * var(--reverse-index)));
    }
}
```

然后使用 `view()` 函数创建一个匿名视图进度时间轴，并通过 `animation-timeline` 属性，将该视图进度时间轴绑到动画元素 `.card__content` 上：

```CSS
.card__content {
    animation: linear scale forwards;
    animation-timeline: view();
}
```

这个时候你就能看到像下图这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/595ef24dd7aa4a4f83ef03ee2ccefaae~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEVLqy>

可以看到，**每个卡片在滚动出现到离开的过程中都完整的执行了我们定义的动画（**`scale`**）**。如果你想改变这种现象，你可以在 `view()` 函数中指定 `<view-timeline-inset>` 参数的值。例如：

```CSS
@keyframes scale {
    100% {
        scale: calc(1.1 - calc(0.1 * var(--reverse-index)));
    }
}
​
.card {
    --index0: calc(var(--index) - 1);
    --reverse-index: calc(var(--numcards) - var(--index0));
    
}
​
.card__content {
    --range: calc(var(--index0) / var(--numcards) * 100%);
    
    animation: linear scale forwards;
    animation-timeline: view(var(--range) 0);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e4d4e100bcd401eb229791c783ee15e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOBpKQ>

简单使用下图来向大家阐述 `<view-timeline-inset>` 值的含义：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1851b2f5aad44f8fa8b2725423185893~tplv-k3u1fbpfcp-zoom-1.image)

`<view-timeline-inset>` 的第一个值表示相关轴上的开始插入；第二个值表示结束插入。如果省略第二个值，则将其设置为第一个值。比如上图中的 `view(30% 0%)` 相当于将滚动容器上边距减少 `30%` ，当滚动到视区上面 `30%` 的时候就完成了动画（默认是滚动到 `0%` ，也就是完全离开的时候）。

注意，`<view-timeline-inset>` 是 `view()` 函数的可选值，它对应着 `view-timeline-inset` 属性（稍后会介绍），有点类似于 [CSS 滚动捕捉中的 scroll-padding 属性](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)。

### 使用 view-timeline 创建一个命名的视图进度时间轴

`view-timeline` 和 `scroll-timeline` 是相似的，不同的是 `view-timeline` 用来创建命名的视图进度时间轴。它主要有以下几个子属性：

*   `view-timeline-name` ，为视图进度时间轴命名，命名方式必须以 `--` 为前缀，例如 `--timeline-name`
*   `view-timeline-axis` ，设置滚动方向，与 `view()` 函数中的 `<axis>` 值相似，主要包含 `x` 、`y` 、`inline` 和 `block` 等值
*   `view-tiemeline-inset` ，用来指定滚动视图范围，与 `view()` 函数中的 `<view-timeline-inset>` 相似，有点类似于滚动捕捉中的 `scroll-padding`

我们可以使用 `view-timeline` 来改造前面的卡片层叠的示例：

```CSS
@layer animation {
    /* 创建缩放动画 */
    @keyframes scale {
        100% {
            scale: calc(1.1 - calc(0.1 * var(--reverse-index)));
        }
    }
  
    .cards {
        view-timeline-name: --cards-element-scrolls-in-body; /* 给视图进度时间轴命名 */
        view-timeline-axis: block; /* 指定滚动轴方向，可以省略，默认为 block */
        view-timeline-inset: 100% 0%; /* 指定滚动视图范围 */
    }
    
    .card {
        --index0: calc(var(--index) - 1);
        --reverse-index: calc(var(--numcards) - var(--index0));
    }
    
    .card__content {
        animation: linear scale forwards;
        animation-timeline: --cards-element-scrolls-in-body;  
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c66ba68777c54868892c1c1042511bd7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGQPjxB>

## CSS 动画时间轴范围

默认情况，动画时间轴会根据滚动区间范围一一映射，就比如课程前面所展示的阅读指示器的案例，用户向下滚动页面多少，阅读指示器的进度向前走多少；同样的，用户向上滚动页面多少，阅读指示器的进度就向后退多少：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc80206641c2434f9ef168e35a6e0056~tplv-k3u1fbpfcp-zoom-1.image)

不过，我们有的时候并不需要完整的区间，比如下面这个示例，页面右下角出现返回顶部按钮：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33ac9f667b3f4e1a804fd1e96e41a0a1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOQjemg>

如果你足够仔细，你会发现上面这个示例的效果并不太完美，页面右侧底部“返回顶部按钮”出来太晚，用户向下滚动页面很长之后才出现。如果要避免这种现象，即用户只需要向下滚动页面一定的距离（例如滚动条距顶部 `100px` ）就可以让页面右侧底部“返回顶部按钮”完全出现，那就需要使用 CSS 的 `animation-range` 属性，也就是“动画时间轴范围”。

```CSS
@layer animation {
    @keyframes revealScroller {
        from {
            transform: translateY(200%);
        }
        to {
            transform: translateY(0%);
        }
    }
    
    .scroll-to-top {
        animation: revealScroller 0.2s ease-out;
        animation-timeline: scroll();
        animation-range: 0 100px;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dcb754a86454c7dabec1091b41ed721~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abQgRVJ>

这个时候，`animation-range` 属性就改变了滚动区间范围与动画时间的默认的映射关系：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4449745a6a24e3db15685fc19e51e01~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，**`animation-range`** **属性能够指定动画应该播放的范围**，这也是 CSS 滚动驱动动效的另一个重要特性。根据具体的使用场景，它也分为**滚动时间轴范围**和**视图时间轴范围**。在详细介绍它们之前，我们简单地先了解一下 `animation-range` 属性。

CSS 的 `animation-range` 属性是 `animation-range-start` 和 `animation-range-end` 的简写属性：

*   `animation-range-start` 指定动画的播放范围的开始，相应地移动动画的开始时间（例如，当动画播放的次数为 `1` ，映射为 `@keyframes` 关键帧的 `0%` 进度）
*   `animation-range-end` 指定动画的播放范围的结束，可能会改变动画的结束时间（例如，当动画播放的次数为 `1` ，映射为 `@keyframes` 关键帧的 `100%` 或截断动画的活动间隔）

下面的代码显示了一个 `animation-range` 的简写方式，后面跟着等价的 `animation-range-start` 和 `animation-range-end` 声明：

```CSS
animation-range: entry 10% exit 90%;
animation-range-start: entry 10%;
animation-range-end: exit 90%;
​
animation-range: entry;
animation-range-start: entry 0%;
animation-range-end: entry 100%;
​
animation-range: entry exit;
animation-range-start: entry 0%;
animation-range-end: exit 100%;
​
animation-range: 10%;
animation-range-start: 10%;
animation-range-end: normal;
​
animation-range: 10% 90%;
animation-range-start: 10%;
animation-range-end: 90%;
​
animation-range: entry 10% exit;
animation-range-start: entry 10%;
animation-range-end: exit 100%;
​
animation-range: 10% exit 90%;
animation-range-start: 10%;
animation-range-end: exit 90%;
​
animation-range: entry 10% 90%;
animation-range-start: entry 10%;
animation-range-end: 90%;
```

### 滚动时间轴范围

滚动时间轴范围相对于视图时间轴范围要容易理解一些。就滚动进度时间轴而言，它只是滚动容器的监听，因此比较简单，我们直接设置滚动时间轴范围即可。比如上面这个返回顶部的例子，我们在 `.scroll-to-top` （返回顶部的按钮）上显式设置了 `animation-range: 0 100px` ，表示只在 `[0， 100px]` 区间范围内触发动画 `revealScroller` 。这样就实现了，当用户向下滚动页面 `100px` 时（滚动条距顶部 `100px`）自动出现的返回顶部按钮，即滚动条距顶部 `100px` 后“返回顶部按钮”一直显示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/863bd2035cea469ba1e4125a399bb9c3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abQgRVJ>

我们使用同样的原理，可以实现头部吸顶的效果。

```HTML
<header>
    <div class="container">
        <div class="media">
            <img src="https://picsum.photos/220/220?random=1" alt="" height="220" width="220" class="media__object">
            <div class="media__content">
                <h2>大漠_W3cplus.com</h2>
                <ul class="meta">
                    <li>前端码农</li>
                    <li>CSSer</li>
                    <li>W3cplus站长</li>
                </ul>
            </div>
        </div>
        <a href="#" class="button button--circle" id="button-edit">✎</a>
    </div>
</header>
<main class="container">
</main>
```

核心 CSS 代码：

```CSS
@layer animation {
    @keyframes adjust-info {
        to {
            grid-template-columns: 4em 1fr;
            gap: 1rem;
            height: 4.75rem;
        }
    }
    
    @keyframes shrink-name {
        to {
            font-size: 1.125rem;
        }
    }
    
    @keyframes add-shadow {
        to {
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.26);
        }
    }
    
    @keyframes move-button {
        to {
            translate: 0% 40%;
        }
    }
    
    @keyframes move-and-fade-background {
        to {
            translate: 0% -5%;
            scale: 0.96;
            opacity: 0.3;
        }
    }
​
    .media {
        animation: adjust-info linear both;
        
        & h2 {
            animation: shrink-name linear both;
        }
    }
​
    header {
        animation: add-shadow linear both;
    
        & .container::before {
            animation: move-and-fade-background linear both;
        }
    }
    
    #button-edit {
        animation: move-button linear both;
    }
​
    .media,
    .media h2,
    header,
    #button-edit,
    header .container::before {
        animation-timeline: scroll();
        animation-range: 0 150px;
    }
}
​
@layer layout {
    header {
        position: sticky;
        top: 0;
        z-index: 2;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0105135ae38442e2bf7a639718f00188~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJeWdE>

### 视图时间轴范围

由于涉及到动画元素和可视区域的交叉，视图时间轴范围要比滚动时间轴范围复杂的多。在默认情况下，链接到视图时间轴的动画会附加到整个视图时间轴范围。这从动画元素即将进入滚动视口的那一刻开始，到动画元素完全离开滚动视口时结束。

和滚动时间轴范围类似，也可以通过 `animation-range` 来指定视图时间轴范围。例如，下面这个可视化演示中，当滚动元素进入滚动容器时，进度从 `0%` 开始计数，但从它完全相交的那一刻起，进度已达经达到 `100%` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cce24f249d549c9a0a027392efdb1f7~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，若要仅定位动画元素的 `entry` 范围，我们可以使用 CSS 的 `animation-range` 属性，以限制动画的运行时间。

```CSS
.element {
    animation:fade-in auto linear both;
​
    animation-timeline: view(inline);
    animation-range: entry 0% entry 100%;
}
```

动画现在从 `entry 0%`（动画元素即将进入滚动容器）运行到 `entry 100%`（动画元素已完全进入滚动容器）。

你可能发现了，在上面的示例代码中，`animation-range` 属性的值有一些关键词，例如 `entry` 。这些关键词表示视图时间轴范围：

*   **`cover`** 表示视图进度时间轴的完整范围，即动画元素首次开始进入滚动容器可视区（`0%`）到完全离开的过程（`100%` ），也就是动画元素只需要和可视范围有交集（默认）
*   **`entry`** 表示主框进入视图进度可见性范围的范围，即动画元素进入滚动容器可视区的过程，刚进入是 `0%`，完全进入是 `100%`
*   **`exit`** 表示主框退出视图进度可见性范围的范围，即动画元素离开滚动容器可视区的过程，刚离开是 `0%`，完全离开是 `100%`
*   **`entry-crossing`** 表示主框跨越结束边框边缘的范围
*   **`exit-crossing`** 表示主框跨越起始边框边缘的范围
*   **`contain`** 表示主框完全位于或完全覆盖滚动端口内视图进度可见性范围的范围。这取决于动画元素比滚动条更高还是更短。即动画元素完全进入滚动容器可视区（`0%`）到刚好要离开的过程（`100%`），也就是动画元素必须完全在可视区才会触发

若是使用 `animation-range` 定义视图时间轴范围，则必须设置范围的开始和结束，分别由描述范围的关键词和一个距离偏移值组成。例如：

```CSS
.element {
    animation-range: entry 0% entry 100%;
}
```

其中距离偏移值通常是一个 `0% ~ 100%` 之间的百分比，但你也可以指定一个固定的长度值，例如 `150px` 。

你可以使用下面这个工具，查看每个范围名称代表什么，以及百分比如何影响起始位置和结束位置。尝试将范围开始设置为 `entry 0%` ，范围结束设置为 `cover 50%` ，然后拖动滚动条查看动画结果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3602f3d3a5a40cb9642369ca54b56b5~tplv-k3u1fbpfcp-zoom-1.image)

> 视图时间轴范围可视化工具：<https://scroll-driven-animations.style/tools/view-timeline/ranges/>

还记得，前面卡片叠层的示例吗？我们在使用 `view()` 创建一个匿名视图进度时间轴时，在 `view()` 传递了一个 `<view-timeline-inset>` 参数：

```CSS
.card__content {
    --range: calc(var(--index0) / var(--numcards) * 100%);
    
    animation: linear scale forwards;
    animation-timeline: view(var(--range) 0);
}
```

假设 `--range` 的值是 `100%` ，那么 `view(var(--range) 0)` 就等价于 `view(100% 0)` ，它其实和 `entry` 效果是等价的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6ebc8a512394870b1a328b1f50b99f8~tplv-k3u1fbpfcp-zoom-1.image)

如果用 **`animation-range` 就很好理解了，这里需要进入动画，所以可以直接用`entry`** ：

```CSS
.card__content {
    animation: linear scale forwards;
    animation-timeline: view();
    animation-range: entry;
}
```

我们可以使用 `animation-range` 来优化前面的“卡片堆叠”的示例：

```CSS
@layer animation {
    @keyframes scale {
        100% {
            scale: calc(1.1 - calc(0.1 * var(--reverse-index)));
        }
    }
  
    .cards {
        view-timeline-name: --cards-element-scrolls-in-body; 
    }
​
    .card {
        --index0: calc(var(--index) - 1);
        --reverse-index: calc(var(--numcards) - var(--index0));
        --reverse-index0: calc(var(--reverse-index) - 1);
    }
​
    .card__content {
        --start-range: calc(var(--index0) / var(--numcards) * 100%);
        --end-range: calc((var(--index)) / var(--numcards) * 100%);
​
        animation: linear scale forwards;
        animation-timeline: --cards-element-scrolls-in-body;
        animation-range: exit-crossing var(--start-range) exit-crossing var(--end-range);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e67a9741f86541f190755cc6bfc8c88a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOQgEPa>

我们还可以利用该原理来改变滚动的交互模式，例如下面这个示例，当你垂直滚动时，水平也会滚动。

```CSS
@layer animation {
    @keyframes move {
        to {
            transform: translateX(calc(var(--nums) * -25% + 100vw));/* --nums 对应 .pin-wrap 内元素数量 */
            left: 0px;
        }
    }
​
    #sectionPin {
        view-timeline-name: --section-pin-tl;
        view-timeline-axis: block;
    }
​
    .pin-wrap {
        animation: linear move forwards;
    
        animation-timeline: --section-pin-tl;
        animation-range: contain 0% contain 100%;
    }
}
​
@layer layout {
    #sectionPin {
        height: 500vh;
        overflow: visible;
    }
​
    .pin-wrap-sticky {
        height: 100vh;
        width: 100vw;
        position: sticky;
        top: 0;
        overflow-x: hidden;
    }
​
    .pin-wrap {
        width: 250vmax;
        will-change: transform;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11cf506fb4ef463aa4fac44ad3a2c9e9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXwRrp>

## 使用一组关键帧附加到多个视图时间轴范围

先来看一个图片淡入淡出的动画效果。以往我们会使用两个 `@keyframes` （关键帧）分别制作淡入（`fade-in`）和淡出（`fade-out`）效果：

```CSS
/* 淡入动画效果 */
@keyframes fade-in {
    from {
        opacity: 0;
    }
​
    to {
        opacity: 1;
    }
}
​
/* 淡出动画效果 */
@keyframes fade-out {
    from {
        opacity: 1;
    }
​
    to {
        opacity: 0;
    }
}
```

我们可以同时给动画元素使用 `fade-in` 和 `fade-out` ，并且给它们指定不同的视图时间轴范围，例如，给 `fade-in` 关键帧将应用于 `entry` 范围，`fade-out` 关键帧将应用于 `exit` 范围。

```CSS
.gallery__entry {
    animation: linear fade-in, linear fade-out;
    animation-duration: auto;
    animation-timeline: view(inline);
    animation-range: entry, exit;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56d11001a28248af857111b3bbf19d7e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQNzYG>

其实，可以不必将两个动画附加到不同的范围，而是创建一组包含范围信息的关键帧。关键帧的形式如下所示：

```CSS
@keyframes keyframes-name {
    range-name range-offset {
        /* CSS ... */
    }
    range-name range-offset {
        /* CSS ... */
    }
}
```

其中 `range-name` 是指视图时间范围的名称，比如 `entry` ；`range-offset` 是视图时间范围的位置，比如 `0%` 。如此一来，前面的 `fade-in` 和 `fade-out` 就可以合并成一个 `@keyframes` ，比如 `animation-fade` ：

```CSS
@keyframes animation-fade {
    entry 0% {
        opacity: 0;
    }
    entry 90% {
        opacity: 1;
    }
    exit 10% {
        opacity: 1;
    }
    exit 100% {
        opacity: 0;
    }
}
```

当关键帧中包含范围信息时，你无需再单独指定 `animation-range`。以 `animation` 属性的形式附加关键帧。

```CSS
.gallery__entry {
    animation: linear animation-fade both;
    animation-duration: auto;
    animation-timeline: view(inline);
}
```

最终效果是一样的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c12e89906b3242a9ab9b53b159f4bb99~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEQEGK>

正如你所看到的，动画元素（`.gallery__entry`）都有一个视图时间轴来装饰，该时间轴在元素穿过滚动视口时跟踪元素，并且附加了两个滚动驱动的动效。动画进入时的动画效果附加到时间轴的进入范围（例如，图片淡入效果附加到时间轴的 `entry` 范围），动画退出时的动画效果附加到时间轴的退出范围（例如，图片淡出效果附加到时间轴的 `exit` 范围）。

使用同样的原理，我们可以给一个列表添加两个滚动驱动动效。当列表项从底部进入滚动容器时，具有滑动加淡入的效果，当列表项从顶部退出滚动容器时，具有滑动加淡出的效果：

```HTML
<main>
    <div id="list-view">
        <ul>
            <li>
                <img src="https://picsum.photos/200/200?random=3" alt="">
                <span class="name">大漠</span>
            </li>
            <!-- 其他 li -->
        </ul>
    </div>
</main> 
```

```CSS
@layer animation {
    @keyframes fade-in-out {
        entry 0% {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
        }
        entry 100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
        exit 0% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
        exit 100% {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
        }
    }
​
    #list-view li {
        animation: linear fade-in-out both;
        animation-duration: auto;
        animation-timeline: view();
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d86a40b7611c4a0b8d55a7a1f0c61701~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQMQWN>

## 附加到非祖先滚动时间轴

命名滚动时间轴和命名视图时间轴的查询机制仅限于滚动祖先。但有时，我们可能想要的动画元素并不是滚动容器的后代，但仍然希望该元素的动画进度与滚动容器的进度相匹配。例如：

```HTML
<div class="parent">
    <div class="scroller">
        <!-- 滚动容器 -->
    </div>
    <div class="animation--element">
        <!-- 动画元素 -->
    </div>
</div>
```

要做到这一点，就需要使用 `timeline-scope` 属性，你可以使用此属性声明具有该名称的时间轴，而无需实际创建它。这使得具有该名称的时间轴具有更广泛的范围。换句话说，它允许我们修改一个命名时间轴的范围，以包含它所设置的元素。在实践中，你可以在滚动容器（`.scroller`）和动画元素（`.animation--element`）共同的父元素上使用 `timeline-scope` 属性，以滚动容器（`.scroller`）上时间轴可以附加到动画元素（`.animation--element`）上。

```CSS
.parent {
    timeline-scope: --tl;
    
    & .scroller {
        scroll-timeline: --tl;
        
        ~ .animation--element {
            animation: animate linear;
            animation-timeline: --tl;
        }
    }
}
```

在上面这个代码中:

*   `.parent` 元素声明了一个名为 `--tl` 的时间轴。它的任何子元素都可以找到并使用它作为 `animation-timeline` 属性的值
*   `.scroller` 元素实际上定义了一个名为 `--tl` 的滚动时间轴。默认情况下，它只对它的子节点可见，但是因为它的父元素（`.parent`）将它设置为 `scroll-timeline-root` ，所以 `--tl` 滚动时间轴会附加到 `.scroller` 上
*   `.animation--element` 元素使用 `--tl` 时间轴，它沿着它的祖先树，在 `.parent` 上找到 `--tl` 时间轴。随着 `.parent` 上的 `--tl` 指向到 `.scroller` 的 `--tl` ，此时，动画元素 `.animation--element` 将会跟踪 `.scroller` 上的滚动进度时间轴

换句话说，你可以使用 `timeline-root` 将时间轴向上移动到一个祖先(也称为提升)，以便该祖先的所有子节点都可以访问它。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bd9d3c0cd4442c49ba21f3387cbaba0~tplv-k3u1fbpfcp-zoom-1.image)

我们来看一个简单的示例：

```CSS
@layer animation {
    @keyframes rotate {
        to {
            rotate: 720deg;
        }
    }

    .parent {
        timeline-scope: --tl;

        & .scroller {
            scroll-timeline: --tl;

            ~ .animation--element {
                animation: rotate auto linear both;
                animation-timeline: --tl;
            }
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3f435dd1ebc40d9b1f8371642b73c54~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQqboo>

## 使用 WAAPI 创建滚动驱动动效

前面我们所聊的都是 CSS 滚动驱动动效相关的知识。事实上，在 Web 中，使用 WAAPI （Web Animation API）也是创建 Web 动效的常见方式之一。换句话说，我们同样可以使用 WAAPI 来创建滚动驱动动效。

我们先来看 WAAPI 是如何创建滚动进度轴驱动的动效。

### 使用 WAAPI 创建滚动进度轴

我们可以使用 `ScrollTimeline` 创建滚动时间轴，它可以接受 `scource` 和 `axis` 两个参数：

*   `source` ：对要跟踪其滚动条的元素的引用。使用 `document.documentElement` 表示以根滚动容器为目标
*   `axis` 确定要跟踪滚动的方向，可以接受的值有 `block` 、`inline` 、`x` 和 `y`

```JavaScript
const tl = new ScrollTimeline({
    source: document.documentElement,
});
```

然后将其附加到 `animation` 的 `timeline` 属性上，并省略任何可持续时间（如果有的话）：

```JavaScript
document.querySelector('.animation--element').animate({
    opacity: [0, 1],
}, {
    timeline: tl,
});
```

来看一个简单的示例，使用 WAAPI 重新创建阅读进度指示器。

```JavaScript
const progressbar = document.querySelector("#progress");
    ​
const tl = new ScrollTimeline({
    source: document.documentElement
});
    ​
progressbar.animate(
    {
        transform: ["scaleX(0)", "scaleX(1)"]
    },
    {
        fill: "forwards",
        timeline: tl
    }
);
```

```CSS
@layer progress {
    #progress {
        position: fixed;
        z-index: 10;
        left: 0;
        top: 0;
        width: 100%;
        height: .5em;
        transform-origin: 0 50%;
        background: linear-gradient(to right, #90f, #09f);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/766d54c4de5f42f8952254ae06b1ef77~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQVqRe>

### 使用 WAAPI 创建视图进度轴

同样的，我们可以使用 `ViewTimeline` 来创建视图进度轴，它主要包括三个参数：

*   `subject` 对要跟踪其滚动条的元素的引用
*   `axis` 滚动方向，接受的值有 `block` 、`inline` 、`y` 和 `x`
*   `inset` 用来指定滚动视图范围


```JavaScript
const tl = new ViewTimeline({
    subject: document.getElementById('subject'),
});
```

然后将其附加到 `animation` 的 `timeline` 属性上，并省略任何可持续时间（如果有的话）。它还有两个可选参数 `rangeStart` 和 `rangeEnd` ，可以用来设置时间轴范围相关的信息：

```JavaScript
document.querySelector('.animation--element').animate({
    opacity: [0, 1],
}, {
    timeline: tl,
    rangeStart: 'entry 25%',
    rangeEnd: 'cover 50%',
});
```

注意，动画元素 `document.querySelector('.animation--element')` 和 `subject` 不需要是同一个元素。这意味着你可以在滚动容器中跟踪一个元素，同时为 DOM 树中其他位置的元素制作动画。

## 案例

本文中涉及到的大部分案例都来源于 [scroll-driven-animations.style](https://scroll-driven-animations.style/) 站点，该网站提供的案例都是和 CSS 滚动驱动动效有关，同时还提供了滚动进度时间轴和视图进度时间轴相关的可视化工具：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0bf08106671425abd4f5c09ad9792f1~tplv-k3u1fbpfcp-zoom-1.image)

> URL：<https://scroll-driven-animations.style/>

我们来看几个这方面的示例。

### 反向滚动列

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09c5c46f847a4ea0824ecef5098d09d0~tplv-k3u1fbpfcp-zoom-1.image)

> URL：<https://scroll-driven-animations.style/demos/reverse-scroll/css/>

你会发现，中间列和其两侧列滚动方向刚好相反。使用滚动进度时间轴，可以很容易就实现上图的效果：

```HTML
<div class="columns">
    <div class="column column-reverse">
        <figure>
            <img src="thumbnail.jpg" alt="" />
            <figcaption>Gnostic Will 2012</figcaption>
        </figure>
    </div>
    <div class="column">
        <figure>
            <img src="thumbnail.jpg" alt="" />
            <figcaption>Gnostic Will 2012</figcaption>
        </figure>
    </div>
    <div class="column column-reverse">
        <figure>
            <img src="thumbnail.jpg" alt="" />
            <figcaption>Gnostic Will 2012</figcaption>
        </figure>
    </div>
</div>
```

核心 CSS 代码：

```CSS
@layer animation {
    .columns {
        overflow-y: hidden;
        scroll-snap-type: y mandatory;
        
        & figure {
            scroll-snap-align: start;
            scroll-snap-stop: always;
        }
    }
    ​
    .column-reverse {
        flex-direction: column-reverse;
    }
    ​
    @keyframes adjust-position {
        from {
            transform: translateY(calc(-100% + 100vh));
        }
        
        to {
            transform: translateY(calc(100% - 100vh));
        }
    }
    ​
    .column-reverse {
        animation: adjust-position linear forwards;
        animation-timeline: scroll(root block);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e7ed0414d1f4fd8b8c6994fb934c3d7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQVNZO>

### 塞尔达传说：结合滚动捕捉与滚动驱动动效

CSS 中出现 **[滚动捕捉](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)** 似乎只是昨天的事情，现在我们可以考虑将 [CSS 滚动捕捉特性](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)和 CSS 滚动驱动动效结合在一起创建更好的效果。比如，我们使用它们来创建一个《塞尔达传说》的[时间轴案例](https://codepen.io/utilitybend/full/mdQpxBX)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04fffb0619034bb289f8405b92f664c0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/utilitybend/full/mdQpxBX>

其核心代码如下。

```HTML
<section class="timeline">
    <article>
        <img src="..." alt="" />
        <div>
            <h2>The legend of Zelda</h2>
            <time>1986</time> -<strong>NES</strong>
        </div>
    </article>
    <!-- 其他 article -->
</section>
```

```CSS
@layer layout {
    .timeline {
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
    }
}
    ​
@layer card {
    article {
        scroll-snap-align: center;
        scroll-snap-stop: always;
    }
}
    ​
@layer animation {
    @keyframes reveal {
        0%,
        100% {
            translate: 0 -25%;
            scale: 0.7;
            opacity: 0.2;
        }
        50% {
            scale: 1;
            translate: 0;
            opacity: 1;
        }
    }
    ​
    @keyframes info {
        0%,40%,60%,100% {
            opacity: 0;
            transform: translateY(-100%);
        }
        50% {
            opacity: 1;
            transform: translateY(0%);
        }
    }
    ​
    @keyframes imageEnter {
        0% {
            scale: 0.2;
            rotate: 70deg;
            border-radius: 0;
        }
        
        40%,60% {
            scale: 1;
            rotate: 0deg;
            border-radius: 20px 20px 0 0;
        }
        100% {
            scale: 0.2;
            rotate: -70deg;
            border-radius: 0;
        }
    }
      
    article {
        animation: reveal linear both;
        animation-timeline: view(inline);
            
        & div {
            animation: info linear both;
            animation-timeline: view(inline);
        }
            
        & img {
            animation: imageEnter linear both;
            animation-timeline: view(inline);
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff3cb20d731549febff692fb4ca13820~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMgbKz>

### 封面流：3D 滚动切换

Swiper 有一个经典效果，即 [3D 滚动切换](https://www.swiper.com.cn/demo/240-effect-coverflow.html)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/626690c32eb74a62b17d91a416078feb~tplv-k3u1fbpfcp-zoom-1.image)

现在，我们使用 CSS 滚动捕捉和 CSS 滚动驱动动效两个功能，可以模拟出类似的效果，而且不需要依赖任何 JavaScript 脚本。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60699226035947efb2c84bfee37c6bc3~tplv-k3u1fbpfcp-zoom-1.image)

> URL：<https://scroll-driven-animations.style/demos/cover-flow/css/>

这两个效果是不是看上去很相似了。实现上图的效果，其核心代码如下：

```HTML
<ul class="cards">
    <li>
        <img src="https://picsum.photos/1200/1200?random=1" width="1200" height="1200">
    </li>
    <!-- 其他 li -->
</ul>
```

```CSS
@layer card {
    .cards {
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
           
    ​
        & li {
            scroll-snap-align: center;
            display: inline-flex;
            width: var(--cover-size);
            aspect-ratio: 1;
            perspective: 40em;
        }
    ​
        & img {
            width: var(--cover-size);
            aspect-ratio: 1;
            transform: translateX(-100%) rotateY(-45deg);
            will-change: transform;
            -webkit-box-reflect: below 0.5em linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25));
        }
    }
}
    ​
@layer animation {
    @keyframes adjust-z-index {
        0% {
            z-index: 1;
        }
        50% {
            z-index: 100;
        }
        100% {
            z-index: 1;
        }
    }
    ​
    @keyframes rotate-cover {
        0% {
            transform: translateX(-100%) rotateY(-45deg);
        }
        35% {
            transform: translateX(0) rotateY(-45deg);
        }
        50% {
            transform: rotateY(0deg) translateZ(1em) scale(1.5);
        }
        65% {
            transform: translateX(0) rotateY(45deg);
        }
        100% {
            transform: translateX(100%) rotateY(45deg);
        }
    }
    ​
    .cards li {
        view-timeline-name: --li-in-and-out-of-view;
        view-timeline-axis: inline;
        
        animation: linear adjust-z-index both;
        animation-timeline: --li-in-and-out-of-view;
    ​
        & img {
            animation: linear rotate-cover both;
            animation-timeline: --li-in-and-out-of-view;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aa76fc33a254178b7ca9eb00c2f39f9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQKrvp>

### 路径动画与滚动驱动动效的组合

在 CSS 中，我们还可以使用 `offset-path` 为元素定义一个运动路径，即路径动画。这是一种比矩形进度条更有趣的指示进度的方式。例如，我们可以让一架飞机的飞行轨迹随着页面滚动而变化：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/905b0530c50b4ec8b1acf18fa822f770~tplv-k3u1fbpfcp-zoom-1.image)

```SVG
<svg viewBox="0 0 640 512" width="100" title="fighter-jet" class="progress">
    <path d="M544 224l-128-16-48-16h-24L227.158 44h39.509C278.333 44 288 41.375 288 38s-9.667-6-21.333-6H152v12h16v164h-48l-66.667-80H18.667L8 138.667V208h8v16h48v2.666l-64 8v42.667l64 8V288H16v16H8v69.333L18.667 384h34.667L120 304h48v164h-16v12h114.667c11.667 0 21.333-2.625 21.333-6s-9.667-6-21.333-6h-39.509L344 320h24l48-16 128-16c96-21.333 96-26.583 96-32 0-5.417 0-10.667-96-32z" />
</svg>
```

```CSS
@keyframes move {
    0% {
        offset-distance: 0%;
    }
    100% {
        offset-distance: 100%;
    }
}
    ​
.progress {
    position: fixed;
    top: 3rem;
    left: 3rem;
    width: 3rem;
    height: auto;
    fill: currentColor;
    z-index: 1;
        
    offset-path: path('M.5 122.7s24.7-275 276.9 0c327.1 356.7 266.1-330.3 548-33.3 256.9 270.7 271.1 0 271.1 0');
    animation: move auto linear;
    animation-timeline: scroll(root);
}
```

> Demo 地址：<https://codepen.io/airen/full/bGQXPpX>

## 小结

那么，CSS 的滚动驱动动效与 JS 库（例如 GSAP 这样的库）相比如何？你是不是已经感觉到了 CSS 滚动驱动动效的强大之处，以及未来可带来的无限想象空间。
