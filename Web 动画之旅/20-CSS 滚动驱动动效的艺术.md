滚动驱动动效是 Web 上常见的一种用户交互模式。在过去，Web 开发者要么使用 JavaScript 的滚动事件（`scroll`），要么使用像 [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 这样的东西，要么使用像 [GreenSock 动画库](https://gsap.com/scroll/)来实现它。如今，W3C 的 CSS 工作小组为滚动驱动动效提供相应的规范（**[Scroll-driven Animations](https://www.w3.org/TR/scroll-animations-1/)**），可以将滚动作为 CSS 动画的时间轴。这意味着，当你向上或向下滚动时，CSS 动画会向前或向后播放。

  


CSS 滚动驱动动效是一种强大的工具，使 Web 设计师和开发人员能够在用户滚动页面时呈现出动态而引人注目的动画效果。通过巧妙地运用 [CSS 的动画、过渡](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)和[视图过渡](https://juejin.cn/book/7288940354408022074/section/7308623298618163212)、[路径动画](https://juejin.cn/book/7288940354408022074/section/7308623339038670860)等特性，可以实现各种独特的滚动驱动动效，例如视差滚动、滚动进度指示器，以及在进入视图时显示的图片可以具有淡入淡出的效果。为用户提供更加生动和丰富的浏览体验。

  


深入了解 CSS 滚动驱动动效，不令可以让你的 Web 应用或网站更具吸引力，还能提升用户与页面互动的乐趣。这节课将带领你深入了解 CSS 滚动驱动动效的多个方面，从基础知识到高级技巧，让你全面掌握这一设计和开发利器。通过丰富的实例演示和详细的代码解释，你将能够运用所学知识，创造出引人入胜的滚动动效，为 Web 应用或页面的交互设计注入新的活力，也将使你在 Web 设计中展现创意和技术的完美结合。

  


## CSS 滚动驱动动效是什么？

  


当我们想到滚动驱动动效时，通常指的是下面两种情况之一。

  


首先来看第一种。当用户滚动时发生的动画，动画播放的播放进度与滚动进度相关联。例如，文章阅读指示器：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d9a513c972b484ca90e64ba0632a8e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=638&s=15054335&e=gif&f=91&b=fbfafb)

  


> Demo 地址：https://scroll-driven-animations.style/demos/progress-bar/css/

  


另外一种是，在元素进入、退出或通过可视区域时发生的动画。通常是浏览器视窗，但也可以是另一个可滚动容器的可见部分。例如，轮播图片指示器：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/440bc072796a43968b02419684217e3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=544&s=20203165&e=gif&f=127&b=fbfafb)

  


> Demo 地址：https://scroll-driven-animations.style/demos/horizontal-carousel/css/

  


CSS 滚动驱动动效规范（[Scroll-driven Animations](https://www.w3.org/TR/scroll-animations-1/)）涵盖了这两种类型的动画。

  


那什么是 CSS 滚动驱动动效呢？

  


简单地说，CSS 滚动驱动动效是一种利用 CSS 技术实现的动画效果，其特点是通过监测用户在页面上的滚动行为，触发特定元素或样式的变化，从而创造出与用户滚动交互的动画效果。这种技术通常通过 CSS 的动画、过渡和视图过渡等特性来实现，而无需依赖 JavaScript。

  


我们先从 CSS 动画讲起。默认情况下，CSS 动画播放都是使用文档时间轴（[DocumentTimeline](https://developer.mozilla.org/en-US/docs/Web/API/DocumentTimeline)），简单来说就是页面加载完成后就开始运行 `@keyframes` 所定义动画，即**动画播放进度是跟着自然时间走的**。

  


而 **CSS 滚动驱动动效指的是将动画的执行（播放）过程由页面（或滚动容器）的滚动进行接管**。也就是说，CSS 滚动驱动的动画只会跟随滚动容器的滚动进度而变化，即滚动条滚动了多少，动画就播放多少，时间已不再起作用。

  


换句话说，CSS 滚动驱动动画又是如何改变动画的时间线呢？为此，CSS 滚动驱动动效规范（[Scroll-driven Animations](https://www.w3.org/TR/scroll-animations-1/)）定义了两种改变动画的时间线，用于控制 CSS 动画播放进度：

  


-   **滚动进度时间线** （**Scroll Progress Timeline**），简称 `scroll-timeline`，代表容器已滚动的距离，从 `0% ~ 100%`
-   **视图进度时间线** （**View Progress Timeline**），简称 `view-timeline`，代表一个在容器内的元素相对于滚动距离的相对位置，从 `0% ~ 100%`

  


在 CSS 中，我们可以使用 `animation-timeline` 属性将这些时间轴附加到动画。整个 CSS 滚动驱动动效所涵盖的 CSS 属性如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2781a01ba00b4725a4c94eb6fc4ba947~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1248&h=1279&s=218898&e=png&b=fbfbfb)

  


> 注意，CSS 的 `animation-timeline 属性`是 [CSS Animations Level 2 规范](https://www.w3.org/TR/css-animations-2)中新增的一个 CSS 属性！它可以接受的值有 `auto` （默认值） 、`none` 、`<custom-ident>` 、`scroll()` 或 `view()` 。

  


在开始介绍这些属性如何使用之前，我们先来简单回顾一下 Web 动画！

  


## 简单地回顾一下 Web 动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/367837f645354c4a815ce917c6c38b03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1767&h=1174&s=1001858&e=jpg&b=d0d0d0)

  


CSS Animation 和 Web Animation API 是创建 Web 动画的常见方式。

  


### 使用 CSS Animation 为 Web 创建动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0845b59db49f4af88fe6b03fd9fc3db2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1767&h=1543&s=1156342&e=jpg&b=161719)

  


在 CSS 中，[可以使用 @keyframes 规则定义一组关键帧](https://juejin.cn/book/7288940354408022074/section/7295617447058407474)。使用 `animation-name 属性`将 `@keyframes` 指定的关键帧动画运用到一个元素上，同时设置 `animation-duration` 来决定动画完成的时间（应该持续多长时间）。也可以使用属性，比如 `animation-timing-function` 、`animation-fill-mode` 和 `animation-iteration-count` 来设置动画。

  


例如，下面这个动画，它在 `x` 轴上缩放一个元素，同时改变元素的背景颜色：

  


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

.progress {
    animation: 2.5s linear forwards scale-up;
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ceb9862015b64e0699b8845db65e10dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=878&h=254&s=33262&e=gif&f=111&b=494868)

  


> Demo 地址：https://codepen.io/airen/full/bGzJweo

  


### 使用 Web Animation API 为 Web 制作动画

  


[Web 动画 API](https://www.w3.org/TR/web-animations-1/) （Web Animation API）简称 WAAPI，它将浏览器动画引擎向 Web 开发者开放，并由 JavaScript 进行操作。Web 动画 API 被设计成 CSS Animation 和 CSS Transition 的接口（未来会对这些 API 做补充以丰富更多的功能）允许 Web 开发者使用 JavaScript 写动画并且控制动画。

  


简单地说，通过 Web 动画 API，我们可以将交互式动画从样式表（比如 [CSS 的 transition 和 animation 动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)）移动到 JavaScript，将表现与行为分开。例如，上面的 CSS `animation` 动画，我们可以使用 Web 动画 API 来实现完全相同的效果。你可以通过创建新的 `Animation` 和 `KeyFrameEffect` 实例，或者使用 `Element.animate()` 方法来实现：

  


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

> Demo 地址：https://codepen.io/airen/full/bGzJwwY

  


## 快速入门 CSS 滚动驱动动效

  


很显然，上面两种方式（CSS `animation` 和 WAAPI）制作的 Web 动画没有太大的意义。如果你想让这个 CSS 动画只在用户滚动页面时运行，并且滚动多少，动画就播放多少。只需在动画元素 `.progress` 上添加以下 CSS 代码：

  


```CSS
.progress {
    animation-timeline: scroll(root);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fd0a4640c3c45c793d37a288e8fc44f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=572&s=284770&e=gif&f=170&b=494868)

  


> Demo 地址：https://codepen.io/airen/full/PoVgGbm

  


这很简单，对吧？关键帧的百分比与用户滚动的百分比相同。在这个例子中，我们要把一个值从 `0` 变到 `100%` ，这是整个滚动页的长度（即滚动条长度）。

  


但代码中的 `animation-timeline` 属性和 `scroll()` 函数又是什么呢？这是 CSS 的新特性，非常令人兴奋，因为它们可以帮助我们快速构建滚动驱动动效。

  


## 了解动画时间轴

  


前面提到过，[CSS 滚动驱动动效规范](https://www.w3.org/TR/scroll-animations-1/)为 CSS 动画定义了两种新的可以使用的时间线（也称时间轴）类型：

  


-   **[滚动进度时间轴](https://www.w3.org/TR/scroll-animations-1/#scroll-timelines)** ：与滚动容器沿特定轴的滚动位置的进度相关联的时间轴，可以使用 `scroll()` 函数匿名使用（将 `animation-timeline` 属性设置为 `scroll()`），也可以通过 `scroll-timeline` 属性引用名称使用。在 WAAPI 中，它们可以通过 `ScrollTimeline` 对象匿名表示。
-   **[视图进度时间轴](https://www.w3.org/TR/scroll-animations-1/#view-timelines)** ：与滚动容器内特定元素的相对进度相关联的时间轴，可以使用 `view()` 函数匿名使用（将 `animation-timeline` 属性设置为 `view()`），也可以通过 `view-timeline` 属性引用名称使用。在 WAAPI 中，它们可以通过 `ViewTimeline` 对象匿名表示。

  


简单地说，在 CSS 中，可以使用 `animation-timeline` 属性将这些时间轴附加到元素上的动画。所以，我们有必要花一些篇幅来了解这些新时间轴的含义以及差异。

  


### 滚动进度时间轴

  


滚动进度时间轴是与滚动容器（也称滚动端口或滚动条）沿特定轴的滚动位置相关联的动画时间轴。它会将滚动范围内的某个位置转换为时间轴上的进度百分比。这意味着，页面或者容器滚动时，会将滚动进度映射到动画进度上。

  


开始滚动位置代表 `0%` 进度，结束滚动位置代表 `100%` 进度。在下面的可视化演示中，当你向下滚动滚动条时，进度会从 `0%` 增加到 `100%` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1de27be8fcd411eb01376b0220b344d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=612&s=3292888&e=gif&f=155&b=cbcbcb)

  


> 滚动进度时间轴可视化演示工具：https://scroll-driven-animations.style/tools/scroll-timeline/progress/?debug=

注意，滚动进度时间轴通常也称为“**滚动时间轴**”。

  


### 视图进度时间轴

  


视图进度时间轴与滚动容器中特定元素的相对进度相关联。与滚动进度时间轴一样，系统会跟踪滚动条的滚动偏移量。与滚动进度时间轴不同的是，视图进度时间轴决定进度的是该滚动条中主题的相对位置。简单地说，视图进度时间轴表示的是一个元素出现在页面视野范围内的进度，也就是关注的是元素自身位置。元素刚出现之前代表 `0%` 进度，元素完全离开之后代表 `100%` 进度。在下面的可视化演示中，当元素进入滚动容器时，进度会从 `0%` 开始计数，当元素离开滚动容器时，进度会达到 `100%` 。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cec024bd87a841568b08c6b13b448007~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=706&s=5638904&e=gif&f=354&b=e2eef7)

  


> 视图进度时间轴可视化演示工具：https://scroll-driven-animations.style/tools/view-timeline/progress/?debug=

  


视图进度时间轴的概念与 JavaScript 的 `IntersectionObserver` （交叉观察者）非常相似，可以监测到元素在可视区的情况，因此，在这种场景中，无需关注滚动容器是哪个，只要处理自身就行了。不同的是：

-   `IntersectionObserver` 用于跟踪元素在滚动条中的可见程度。如果该元素在滚动条中不可见，则不会交叉。如果它在滚动条内可见（即使是最小部分），则会交叉。
-   视图进度时间轴从元素开始与滚动条相交开始，到元素停止与滚动条交叉时结束

  


默认情况下，与视图进度时间轴关联的动画会附加到其整个范围。此动画从元素进入滚动端口的那一刻开始，到元素离开滚动端口时结束。

  


注意，视图进度时间轴通常也称为“**视图时间轴**”。

  


## 滚动进度时间轴实战

  


接下来，我们通过一些实例来向大家阐述，如何使用 CSS 滚动进度时间轴来构建滚动驱动动效？

  


### 使用 `scroll()` 函数创建匿名滚动进度时间轴

  


在前面所呈现的滚动驱动动效的示例中，出现了一个大家不怎么熟悉的 CSS 属性（`animation-timeline`）和函数 `scroll()` 。我想大家并不知道它们的作用以及使用。

  


其实，这是在 CSS 中创建滚动时间轴最简单的方法，即在动画元素上设置 `animation-timeline` 的值为 `scroll()` ，例如：

  


```CSS
.progress {
    animation -timeline: scroll ();
}
```

  


在这里，我们使用 `scroll()` 函数创建了一个匿名滚动时间轴。该函数可以接受两个参数值，即 `<scroller>` 和 `<axis>` ：

  


```
<scroll()> = scroll( [ <scroller> || <axis> ]? )
```

  


其中，`<scroller>`表示滚动容器，可接受的值有：

  


-   **`nearest`**：使用最近的祖先滚动容器（**默认值**）
-   **`root`**：使用文档视口作为滚动容器
-   **`self`**：使用元素本身作为滚动容器

  


`<axios>`表示滚动方向，可接受的值有：

  


-   **`block`**：滚动容器的块级轴方向（**默认值**）
-   **`inline`**：滚动容器内联轴方向
-   **`y`**：滚动容器沿 `y` 轴方向
-   **`x`**：滚动容器沿 `x` 轴方向

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/135feb4038ca48408026e78884e27fa5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1440&h=795&s=517578&e=jpg&b=fcfcfc)

  


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

.scroll-to-top {
    animation: revealScroller  ease-out;
    animation-timeline: scroll(root);
}
```

  


当用户滚动到页面的 `10%` 时，按钮（`.scroll-to-top`）将显示自己，当用户滚动到页面的 `18%` 时，按钮（`.scroll-to-top`）将完全可见：

  

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3497d60ae7ad409f99846e1f0771ba15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=614&s=4548126&e=gif&f=276&b=0187fc)

  


> Demo 地址：https://codepen.io/airen/full/jOdRZRP

  


需要注意的是，`animation-timeline` 属性不是 `animation` 简写的一部分，必须要单独声明。此外，`animation-timeline` 必须在 `animation` 之后声明，否则 `animation` 会将 `animation-timeline` 重置为初始值。其次，在使用滚动进度时间轴时，以秒为单位设置动画持续时间（`animation-duration`）是没有意义的，所以必须将动画持续时间（`animation-duration`）设置为 `auto` ，或者不显式设置动画持续时间，因为它将使用其默认值 `auto`。

  


```CSS
/* ❌ Bad: animation-timeline 被覆盖 */
.animated {
    animation-timeline: scroll();
    animation: animation: revealScroller  ease-out;
}

/* ✅ Good */
.animated {
    animation: animation: revealScroller  ease-out;
    animation-timeline: scroll();
}

/* ❌ Bad: animation-duration 指定具体数值没有任何意义 */
#progressbar {
    animation: 1s linear forwards adjust-progressbar; 
    animation-timeline: scroll(block root); 
} 

/* ✅ Good: animation-duration: auto (未显式设置，默认为 auto) */
#progressbar {
    animation: linear forwards adjust-progressbar; 
    animation-timeline: scroll(block root); 
} 

/* ✅ Good: animation-duration: auto (显式设置) */
#progressbar {
    animation: linear forwards adjust-progressbar; 
    animation-duration: auto;
    animation-timeline: scroll(block root); 
} 
```

  


另一个有用的例子是，可以用滚动进度时间轴来创建滚动视差效果，例如创建视差背景效果。在页面中向下滚动时，背景图片会移动，只是速度不同。

  


如需实现这一点，需要完成两个步骤：

  


-   创建一个用于移动背景图片位置的动画。
-   将动画与文档的滚动进度相关联。

  


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

  


```CSS
body {
    animation-timeline: scroll(nearest block);
}
```

  


如果一切顺利，你将看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2d43f26b3af4d0ca4089d21ea93dcc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=600&s=14773369&e=gif&f=58&b=cadbe3)

  


> Demo 地址：https://codepen.io/airen/full/ExrJEPo

  


### 使用 scroll-timeline 创建一个命名的滚动进度时间轴

  


如果动画元素不需要与最近的祖先或根滚动交互，而是与页面上其他地方发生的滚动交互，或者当页面使用多个时间轴或自动查找不起作用时，那么使用命名滚动进度时间轴就很有用。这样，你就可以根据所给的名称来标识滚动进度时间轴。这也是定义滚动进度时间轴的另一种方法。

  


若要在元素创建命名的滚动进度时间轴，就需要使用 `scroll-timeline` 属性给滚动进度时间轴命名，而且必须以 `--` 开头，有点类似于 CSS 自定义属性的命名方式。

  


`scroll-timeline` 是 `scroll-timeline-name` 和 `scroll-timeline-axis` 两个属性的简写属性：

  


-   `scroll-timeline-name` ：为滚动进度时间轴命名，命名方式必须以 `--` 为前缀，例如 `--timeline-name`
-   `scroll-timeline-axis` ：设置滚动方向，与 `scroll()` 函数中的 `<axis>` 值相似，主要包含 `x` 、`y` 、`inline` 和 `block` 等值

  


来看一个真实的案例，给图库添加进度指示器：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5832c2cb40ac46d39c82db03877430bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=894&h=604&s=19003536&e=gif&f=104&b=d5e0e8)

  


假设页面上有一个横向轮播图组件（如上图所示），我们需要给这个轮播图组件添加一个进度指示器，来告诉用户当前正在查看哪张图片。

  


构建这样的一个轮播图组件，你可能用到像下面这样的 HTML 结构：

  


```HTML
<div class="gallery">
    <div class="gallery__scrollcontainer" style="--num-images: 3;"><!-- --num-image 的值与下面 gallery__entry 数量相匹配 -->
        < div  class = "gallery__progress" >
 <!-- 进度指示器 -->
 </ div >
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
        transform : scaleX ( calc ( 1 / var (--num-images)));
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
        animation -timeline: --gallery-is-scrolling;
    }
}
```

  


如果不出意外，你将能看到下图这样的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff68e4b38bfe424ab263b497562a06df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=590&s=16047065&e=gif&f=76&b=34312e)

> Demo 地址：https://codepen.io/airen/full/VwVNVML

  


注意，就上面这个示例而言，使用 `scroll()` 创建的匿名滚动进度时间轴是行不通的。例如，你在 `.gallery__progress` 动画元素上设置 `animation-timeline: scroll(nearest inline)` ，它将不会从 `.gallery__scrollcontainer` 中找到滚动容器，即使该元素是它的直接父元素。这是因为，`.gallery__progress` 是绝对定位的，所以决定它的大小和位置的第一个元素是 `.gallery` 元素，因为我们在 `.gallery` 元素上显式设置了 `position: relative` ，因此跳过了 `.gallery__scrollcontainer` 元素。

  


我们有的时候会碰到动画元素要与页面上其他地方发生的滚动交互。比如下面这个示例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/652c4ec66cff46818dc26cf754f2bffa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=638&s=2677794&e=gif&f=112&b=d7c8c7)

  


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
    animation -timeline: --listTimeline;
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

    .list {
        scroll-timeline: --listTimeline block;
    }
}
```

  


最终效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec64bedae66547b28f011ef3c1033bb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=638&s=2677794&e=gif&f=112&b=d7c8c7)

  


> Demo 地址：https://codepen.io/airen/full/zYeXWgM

  


使用同样的技术，你还可以实现水平滚动驱动动效，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d6a7c0f19774ba6adc511574c27903a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=420&s=3431362&e=gif&f=189&b=e8dfe0)

  


> Demo 地址：https://codepen.io/airen/full/JjxVLgV

  


我们还可以将滚动进度时间轴与滚动捕捉特性相结合，构建一个卡片分页指示器：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb4e9f05628a4a05aca80828aff7fb3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=486&s=4451223&e=gif&f=228&b=ffe6eb)

  


> Demo 地址：https://codepen.io/airen/full/BaMErpy

  


```HTML
<div class="section">
    <div id="scroll-wrapper">
        <div class="card"></div>
        <!-- 省略其他 card -->
        <div class="card"></div>
    </div>
    <div id="indicatorWrapper">
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="animated"></div>
    </div>
</div>    
```

  


```CSS
@layer animaiton {
    @property --moveX {
        syntax: "<number>";
        inherits: false;
        initial-value: 0;
    }

    /* (gap + dotSize) x index */
    @keyframes moveX {
        0% {
            --moveX: 0;
        }
        20% {
            --moveX: 40;
        }
        40% {
            --moveX: 80;
        }
        60% {
            --moveX: 120;
        }
        80% {
            --moveX: 160;
        }
        100% {
            --moveX: 200;
        }
    }

    .section {
        timeline-scope: --listTimeline;
    }

    #scroll-wrapper {
        overflow-y: auto;
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
        scroll-timeline: --listTimeline block;
    }

    .animated {
        animation: moveX alternate linear both;
        animation-timeline: --listTimeline;
    }
}
```

  


注意，有关于时间轴作用域相关的话题我们稍后会详细阐述。

  


## 视图进度时间轴实战

  


视图进度时间轴和滚动进度时间轴相似，也分为匿名视图进度时间轴和命名视图进度时间轴两种。我们先来看第一种，匿名视图进度时间轴创建与使用。

  


### 使用 view() 函数创建匿名视图进度时间轴

  


在 CSS 中，我们可以使用 `view()` 函数来创建一个匿名视图进度时间轴，该函数和 `scroll()` 函数类似，也接受两个参数，即 `<axis>` 和 `<view-timeline-inset>` ：

  


-   `<axis>` ：与滚动进度时间轴相同，定义滚动的方向，可接受的值有 `x` 、`y` 、`inline` 和 `block` ，其中默认值为 `block`
-   `<view-timeline-inset>` ：用来指定一个偏移量（正或负），以便在元素被视为是否在视图范围内时调整边界。该值必须是百分比值或 `auto` ，其中 `auto` 是其默认值。另外，它支持两个值，例如 `view(100% 20%)` ，它们表示开始和结束两个范围

  


我们先来看一个简单的示例，卡片叠加的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53019ba9f6ed415a985f9508eff58c4c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=618&s=19541384&e=gif&f=177&b=311823)

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e887fe6fc41456e9eb55517a8be1e29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=618&s=19541384&e=gif&f=177&b=311823)

  


> Demo 地址：https://codepen.io/airen/full/jOdRxEa

  


可以看到，**每个卡片在滚动出现到离开的过程中都完整的执行了我们定义的动画（** **`scale`** **）** 。如果你想改变这种现象，你可以在 `view()` 函数中指定 `<view-timeline-inset>` 参数的值。例如：

  


```CSS
@keyframes scale {
    100% {
        scale: calc(1.1 - calc(0.1 * var(--reverse-index)));
    }
}

.card {
    --index0: calc(var(--index) - 1);
    --reverse-index: calc(var(--numcards) - var(--index0));
    
}

.card__content {
    --range: calc(var(--index0) / var(--numcards) * 100%);
    
    animation: linear scale forwards;
    animation -timeline: view ( var (--range) 0 );
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dbf9cf7e6b34fbfba71ddb744e08441~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=848&h=502&s=18267533&e=gif&f=235&b=311823)

  


> Demo 地址：https://codepen.io/airen/full/ZEwZoYj

  


简单使用下图来向大家阐述 `<view-timeline-inset>` 值的含义：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23be2603cc2044e3acbc8c54c70abfcc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2470&h=1078&s=690216&e=jpg&b=efefef)

  


`<view-timeline-inset>` 的第一个值表示相关轴上的开始插入；第二个值表示结束插入。如果省略第二个值，则将其设置为第一个值。比如上图中的 `view(30% 0%)` 相当于将滚动容器上边距减少 `30%` ，当滚动到视区上面 `30%` 的时候就完成了动画（默认是滚动到 `0%` ，也就是完全离开的时候）。

  


注意，`<view-timeline-inset>` 是 `view()` 函数的可选值，它对应着 `view-timeline-inset` 属性（稍后会介绍），有点类似于 [CSS 滚动捕捉中的 scroll-padding 属性](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)。

  


### 使用 view-timeline 创建一个命名的视图进度时间轴

  


`view-timeline` 和 `scroll-timeline` 是相似的，不同的是 `view-timeline` 用来创建命名的视图进度时间轴。它主要有以下几个子属性：

  


-   `view-timeline-name` ，为视图进度时间轴命名，命名方式必须以 `--` 为前缀，例如 `--timeline-name`
-   `view-timeline-axis` ，设置滚动方向，与 `view()` 函数中的 `<axis>` 值相似，主要包含 `x` 、`y` 、`inline` 和 `block` 等值
-   `view-tiemeline-inset` ，用来指定滚动视图范围，与 `view()` 函数中的 `<view-timeline-inset>` 相似，有点类似于滚动捕捉中的 `scroll-padding`

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e962241baf54467a07d2fb9439a5a6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=530&s=17754246&e=gif&f=211&b=311823)

  


> Demo 地址：https://codepen.io/airen/full/oNmOdXv

  


## CSS 动画时间轴范围

  


默认情况，动画时间轴会根据滚动区间范围一一映射，就比如课程前面所展示的阅读指示器的案例，用户向下滚动页面多少，阅读指示器的进度向前走多少；同样的，用户向上滚动页面多少，阅读指示器的进度就向后退多少：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fc1cbf8f6e84804961cc49409728136~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1440&h=795&s=250660&e=jpg&b=efefef)

  


不过，我们有的时候并不需要完整的区间，比如下面这个示例，页面右下角出现返回顶部按钮：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cbe5297f06e41cc961d7b8bcec1620b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=748&s=3097017&e=gif&f=236&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/OJdGZVW

  


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
        animation -range: 0  100px ;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45569ad61f7743788fcc2a7f26fda266~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=442&s=1444523&e=gif&f=184&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYxorNL

  


这个时候，`animation-range` 属性就改变了滚动区间范围与动画时间的默认的映射关系：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c147a14fb974f59863661e564abe55b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1440&h=795&s=242372&e=jpg&b=efefef)

  


也就是说，**`animation-range`** **属性能够指定动画应该播放的范围**，这也是 CSS 滚动驱动动效的另一个重要特性。根据具体的使用场景，它也分为**滚动时间轴范围**和**视图时间轴范围**。在详细介绍它们之前，我们简单地先了解一下 `animation-range` 属性。

  


CSS 的 `animation-range` 属性是 `animation-range-start` 和 `animation-range-end` 的简写属性：

  


-   `animation-range-start` 指定动画的播放范围的开始，相应地移动动画的开始时间（例如，当动画播放的次数为 `1` ，映射为 `@keyframes` 关键帧的 `0%` 进度）
-   `animation-range-end` 指定动画的播放范围的结束，可能会改变动画的结束时间（例如，当动画播放的次数为 `1` ，映射为 `@keyframes` 关键帧的 `100%` 或截断动画的活动间隔）

  


下面的代码显示了一个 `animation-range` 的简写方式，后面跟着等价的 `animation-range-start` 和 `animation-range-end` 声明：

  


```CSS
animation-range: entry 10% exit 90%;
animation-range-start: entry 10%;
animation-range-end: exit 90%;

animation-range: entry;
animation-range-start: entry 0%;
animation-range-end: entry 100%;

animation-range: entry exit;
animation-range-start: entry 0%;
animation-range-end: exit 100%;

animation-range: 10%;
animation-range-start: 10%;
animation-range-end: normal;

animation-range: 10% 90%;
animation-range-start: 10%;
animation-range-end: 90%;

animation-range: entry 10% exit;
animation-range-start: entry 10%;
animation-range-end: exit 100%;

animation-range: 10% exit 90%;
animation-range-start: 10%;
animation-range-end: exit 90%;

animation-range: entry 10% 90%;
animation-range-start: entry 10%;
animation-range-end: 90%;
```

  


### 滚动时间轴范围

  


滚动时间轴范围相对于视图时间轴范围要容易理解一些。就滚动进度时间轴而言，它只是滚动容器的监听，因此比较简单，我们直接设置滚动时间轴范围即可。比如上面这个返回顶部的例子，我们在 `.scroll-to-top` （返回顶部的按钮）上显式设置了 `animation-range: 0 100px` ，表示只在 `[0， 100px]` 区间范围内触发动画 `revealScroller` 。这样就实现了，当用户向下滚动页面 `100px` 时（滚动条距顶部 `100px`）自动出现的返回顶部按钮，即滚动条距顶部 `100px` 后“返回顶部按钮”一直显示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10b7985918c448e28e5e2ca9be5d918d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=394&s=782551&e=gif&f=130&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/BaMExoW

  


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

    .media {
        animation: adjust-info linear both;
        
        & h2 {
            animation: shrink-name linear both;
        }
    }

    header {
        animation: add-shadow linear both;
    
        & .container::before {
            animation: move-and-fade-background linear both;
        }
    }
    
    #button-edit {
        animation: move-button linear both;
    }

    .media,
    .media h2,
    header,
    #button-edit,
    header .container::before {
        animation-timeline: scroll();
        animation -range: 0  150px ;
    }
}

@layer layout {
    header {
        position: sticky;
        top: 0;
        z-index: 2;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4102dbae2a87464e9b02ff79fd87a0b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=962&h=690&s=3071375&e=gif&f=185&b=fbfbfb)

  


> Demo 地址：https://codepen.io/airen/full/poGBVjL

  


这种效果也非常适合于一些详情页的布局。例如，横幅广告图随着页面往下滚动时高度变小并固定在页面顶部：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5eb8f16b92454b6e88bcbd4ea748248b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=516&s=18154936&e=gif&f=78&b=7b7662)

  


> Demo 地址：https://codepen.io/airen/full/ExrJeGx

  


```HTML
<body>
    <div class="hero">
        <h1>title</h1>
        <img src="figure.png" alt="" />
    </div>
    <main>
        <p>Content</p>
    </main>
</body>
```

  


```CSS
@layer animation {
    @keyframes parallax-hero {
        to {
            height: 20vh;
            font-size: 1.5em;
        }
    }
  
    @keyframes blur {
        from {
            object-position: 50% 0;
            scale: 2;
        }
        to {
            filter: opacity(0.95) blur(3px) ;
            object-position: 50% 100%;
            scale: 1;
        }
    }
    
    .hero {
        height: 80vh;
        animation: parallax-hero linear forwards;
        animation-timeline: scroll();
        animation-range: 0vh 70vh;
        
        & img {
            animation: blur linear forwards;
            animation-timeline: scroll();
            animation-range: 0vh 70vh;
        }
    }
}
```

  


### 视图时间轴范围

  


由于涉及到动画元素和可视区域的交叉，视图时间轴范围要比滚动时间轴范围复杂的多。在默认情况下，链接到视图时间轴的动画会附加到整个视图时间轴范围。这从动画元素即将进入滚动视口的那一刻开始，到动画元素完全离开滚动视口时结束。

  


和滚动时间轴范围类似，也可以通过 `animation-range` 来指定视图时间轴范围。例如，下面这个可视化演示中，当滚动元素进入滚动容器时，进度从 `0%` 开始计数，但从它完全相交的那一刻起，进度已达经达到 `100%` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcc80a0ab74c4ac9a09b85305ff4cf20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=1024&s=1703870&e=gif&f=271&b=fbfcf5)

  


也就是说，若要仅定位动画元素的 `entry` 范围，我们可以使用 CSS 的 `animation-range` 属性，以限制动画的运行时间。

  


```CSS
.element {
    animation:fade-in auto linear both;

    animation-timeline: view(inline);
    animation -range: entry 0% entry 100% ;
}
```

  


动画现在从 `entry 0%`（动画元素即将进入滚动容器）运行到 `entry 100%`（动画元素已完全进入滚动容器）。

  


你可能发现了，在上面的示例代码中，`animation-range` 属性的值有一些关键词，例如 `entry` 。这些关键词表示视图时间轴范围：

  


-   **`cover`** 表示视图进度时间轴的完整范围，即动画元素首次开始进入滚动容器可视区（`0%`）到完全离开的过程（`100%` ），也就是动画元素只需要和可视范围有交集（默认）
-   **`entry`** 表示主框进入视图进度可见性范围的范围，即动画元素进入滚动容器可视区的过程，刚进入是 `0%`，完全进入是 `100%`
-   **`exit`** 表示主框退出视图进度可见性范围的范围，即动画元素离开滚动容器可视区的过程，刚离开是 `0%`，完全离开是 `100%`
-   **`entry-crossing`** 表示主框跨越结束边框边缘的范围
-   **`exit-crossing`** 表示主框跨越起始边框边缘的范围
-   **`contain`** 表示主框完全位于或完全覆盖滚动端口内视图进度可见性范围的范围。这取决于动画元素比滚动条更高还是更短。即动画元素完全进入滚动容器可视区（`0%`）到刚好要离开的过程（` 100%  `），也就是动画元素必须完全在可视区才会触发

若是使用 `animation-range` 定义视图时间轴范围，则必须设置范围的开始和结束，分别由描述范围的关键词和一个距离偏移值组成。例如：

  


```CSS
.element {
    animation-range: entry 0% entry 100%;
}
```

  


其中距离偏移值通常是一个 `0% ~ 100%` 之间的百分比，但你也可以指定一个固定的长度值，例如 `150px` 。

  


你可以使用下面这个工具，查看每个范围名称代表什么，以及百分比如何影响起始位置和结束位置。尝试将范围开始设置为 `entry 0%` ，范围结束设置为 `cover 50%` ，然后拖动滚动条查看动画结果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0c91892f97b4b42a898f08709b50bb1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=736&s=13027360&e=gif&f=504&b=fcfcfc)

  


> 视图时间轴范围可视化工具：https://scroll-driven-animations.style/tools/view-timeline/ranges/

  


还记得，前面卡片叠层的示例吗？我们在使用 `view()` 创建一个匿名视图进度时间轴时，在 `view()` 传递了一个 `<view-timeline-inset>` 参数：

  


```CSS
.card__content {
    --range: calc(var(--index0) / var(--numcards) * 100%);
    
    animation: linear scale forwards;
    animation -timeline: view ( var (--range) 0 );
}
```

  


假设 `--range` 的值是 `100%` ，那么 `view(var(--range) 0)` 就等价于 `view(100% 0)` ，它其实和 `entry` 效果是等价的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a297f6dccb484c36a34992232a2d5e82~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2470&h=949&s=406989&e=jpg&b=efefef)

  


如果用 **`animation-range`** 就很好理解了，这里需要进入动画，所以可以直接用 **`entry`** ：

  


```CSS
.card__content {
    animation: linear scale forwards;
    animation-timeline: view();
    animation -range: entry;
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

    .card {
        --index0: calc(var(--index) - 1);
        --reverse-index: calc(var(--numcards) - var(--index0));
        --reverse-index0: calc(var(--reverse-index) - 1);
    }

    .card__content {
        --start-range: calc(var(--index0) / var(--numcards) * 100%);
        --end-range: calc((var(--index)) / var(--numcards) * 100%);

        animation: linear scale forwards;
        animation-timeline: --cards-element-scrolls-in-body;
        animation -range: exit-crossing var (--start-range) exit-crossing var (--end-range);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c032151a5ab84d44885519a4a14c680a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=612&s=19161844&e=gif&f=178&b=311823)

  


> Demo 地址：https://codepen.io/airen/full/oNmOJwg

  


在 Web 应用中，带有视差效果的整屏滚动动效随处可见：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cb6aa54a06f4611b70adc15fc6ccfad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1347&h=558&s=2760112&e=gif&f=103&b=edebeb)

  


以往要实现这种交互效果，Web 开发者不不依赖于第三方库或者编写很多复杂的 JavaScript 脚本。现如今天，我们只需要使用纯 CSS 就可以实现。将 [CSS 的滚动捕捉](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)、[自定义属性](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)和滚动驱动动效相结合，就可以实现一个相似的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13a8d46f7b9145b4bc40c0194eee14bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=468&s=13120049&e=gif&f=101&b=f7f1ef)

  


> Demo 地址：https://codepen.io/airen/full/YzBMgQB

  


上面这个示例还带有响应式功能，当你将浏览器屏幕缩小到小于 `768px` 时，页面也可以整屏幕滚动，带视差效果更明显：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac7484d3077a4a2c901df703827140ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=614&h=748&s=14426069&e=gif&f=106&b=f5e9e7)

  


这个效果实现起来并不复杂：

  


```HTML
<body>
    <!-- 滚动容器：卡片容器 --> 
    <main class="cards" style="--count: 10;">
        <div class="card" style="--index: 1;">
            <figure class="card__figure">
                <img src="https://picsum.photos/1920/1080?random=1" alt="">
            </figure>
            <div class="card__content">
                <h2>CSS Scroll Animations</h2>
                <p>Check out this rad demo</p>
                <a href="#">Preorder</a>
            </div>
        </div>
        <!-- 省略其他卡片，这个示例共10张卡片，相当于10屏滚动 -->
    </main>
    
    <!-- 卡片（屏幕）滚动指示器 -->
    <div class="indicators">
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="indicator"></div>
        <div class="animated"></div>
    </div>
</body>
```

  


整个页面的布局这里就不展开了，示例采用了[现代 Web 布局](https://s.juejin.cn/ds/i86VtLF3/)中的[网格布局技术](https://juejin.cn/book/7161370789680250917/section/7161372229123440648)、[自定义属性](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)与 [CSS 媒体查询](https://juejin.cn/book/7223230325122400288/section/7257368158451793935)相结合，构建了一个具有[响应式布局](https://juejin.cn/book/7161370789680250917/section/7165845190614188062)的页面效果。

  


全屏效果很容易实现，示例使用了[ CSS 的视窗单位 vw 和 vh ](https://juejin.cn/book/7223230325122400288/section/7249357892611440700)，设置张卡片 `.card` 和卡片容器 `.cards` 的宽度为 `100vw` ，高度为 `100vh` ，保证它们都与视窗宽高相等，从而达到满屏的效果。在些基础上，通过 [CSS 滚动捕捉特性](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)，用户在滚动屏幕的时候，可以一屏一屏滚动，并且整个滚动效果看上去和原生应用的滚动效果是相似的：

  


```CSS
.cards {
    width: min(100%, 100vw);
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
}
.card {
    width: 100%;
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
}
```

  


使用视图时间轴特性，将动画与用户的滚动交互行为绑定在一起。换句话说，就是通过视图时间来驱动动画播放进度。具体代码如下：

  


```CSS
@layer animation {
    @property --count {
        syntax: "<number>";
        inherits: false;
        initial-value: 0;
    }
  
    @keyframes clip-out {
        0% {
            clip-path: inset(0 0 0 0);
        }
        100% {
            filter: brightness(0.5);
            clip-path: inset(100% 0 0 0);
        }
    }
  
    @keyframes brighten {
        0% {
            filter: brightness(2);
        }
        100% {
            filter: brightness(1);
        }
    }
    
    @keyframes filter-out {
        100% {
            filter: brightness(2);
            translate: 0 -60%;
        }
    }

    @keyframes in-n-out {
        0%,
        100% {
            opacity: 0;
        }
        10%,
        60% {
            opacity: 1;
        }
    }
    
    @keyframes moveX {
        0% {
            --count: 0;
        }
        11.1111% {
            --count: 1;
        }
        22.2222% {
            --count: 2;
        }
        33.3333% {
            --count: 3;
        }
        44.4444% {
            --count: 4;
        }
        55.5555% {
            --count: 5;
        }
        66.6666% {
            --count: 6;
        }
        77.7777% {
            --count: 7;
        }
        88.8888% {
            --count: 8;
        }
        100% {
            --count: 9;
        }
    }
    
    body {
        timeline-scope: --indicator;
    }
  
    .cards {
        scroll-timeline: --indicator ;
    }
    
    .card {
        view-timeline: --card;
    }
  
    .card__figure {
        animation: in-n-out both linear;
        animation-timeline: --card;
    
        & img {
            animation: filter-out both linear;
            animation-timeline: --card;
            animation-range: exit 0% cover 100%;
        }
    }
    
    .animated {
        animation: moveX alternate linear both;
        animation-timeline: --indicator;
    }
    
    @meida (width >= 768px) {
        .card__figure {
            animation: brighten both linear;
            animation-timeline: --card;
            animation-range: entry 0% entry 50%;
          
            & img {
                animation: clip-out both linear;
                animation-timeline: --card;
                animation-range: exit 0% exit 100%;
            }
        }
    }
}
```

  


每一行代码的意思和所起的作用，这里就不做阐述了，因为它们在课程中出现很多次了。这里额外提出一点的是，滚动指示器（也就是示例中位于页面底部的小圆点）动画应用了 `@property` ，并且通过 `calc()` 计算来改变它在 `x` 轴（即 `translate` 属性 `x` 轴的值）的值，然后在 `@keyframes` 中对已定义的 `--count` 做动画处理：

  


```CSS
.animated {
    --_x: calc((var(--indicators-gap) + var(--indicators-size)) * var(--count));
    aspect-ratio: 1;
    position: absolute;
    left: 0;
    top: 50%;
    translate: var(--_x) -50%;
    scale: 0.6;
    z-index: 999;
    background-color: var(--color-primary);
    width: var(--indicators-size);
    border-radius: 50%;
    z-index: 999;
    mix-blend-mode: color-burn;
}
```

  


另外，视图效果我们用到了 CSS 的粘性定位和固定定位，这里就不阐述了，详细的请大家查阅示例源码。

  


CSS 视图时间轴范围的强大之处不仅仅在此。我们还可以利用该原理来改变滚动的交互模式，例如下面这个示例，当你垂直滚动时，水平也会滚动。

  


```CSS
@layer animation {
    @keyframes move {
        to {
            transform: translateX(calc(var(--nums) * -25% + 100vw));/* --nums 对应 .pin-wrap 内元素数量 */
            left: 0px;
        }
    }

    #sectionPin {
        view-timeline-name: --section-pin-tl;
        view-timeline-axis: block;
    }

    .pin-wrap {
        animation: linear move forwards;
    
        animation-timeline: --section-pin-tl;
        animation-range: contain 0% contain 100%;
    }
}

@layer layout {
    #sectionPin {
        height: 500vh;
        overflow: visible;
    }

    .pin-wrap-sticky {
        height: 100vh;
        width: 100vw;
        position: sticky;
        top: 0;
        overflow-x: hidden;
    }

    .pin-wrap {
        width: 250vmax;
        will-change: transform;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9e69ea821ad4c1db84ba9f28b2fe50c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=528&s=16644929&e=gif&f=152&b=afaaa0)

  


> Demo 地址：https://codepen.io/airen/full/XWOwKrM

  


甚至结合更多的 CSS 特性，可以制作出更复杂的交互动画效果，而且这些效果不依赖任何的 JavaScript 代码，例如下面这个由[ @Andrew 提供的案例](https://codepen.io/andrewrock/full/NWoRavN)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/880156a038d74228bb3b28a7a5fe7ba9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=450&s=11011614&e=gif&f=191&b=000000)

  


> Demo 地址：https://codepen.io/andrewrock/full/NWoRavN

  


这个效果比较复杂，但如果你有足够的自信，应用所学知识，完成它不会是大问题。感兴趣的同学不妨自己尝试一下。

  


## 使用一组关键帧附加到多个视图时间轴范围

  


先来看一个图片淡入淡出的动画效果。以往我们会使用两个 `@keyframes` （关键帧）分别制作淡入（`fade-in`）和淡出（`fade-out`）效果：

  


```CSS
/* 淡入动画效果 */
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* 淡出动画效果 */
@keyframes fade-out {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
```

我们可以同时给动画元素使用 `fade-in` 和 `fade-out` ，并且给它们指定不同的视图时间轴范围，例如，给 `fade-in` 关键帧将应用于 `entry` 范围，`fade-out` 关键帧将应用于 `exit` 范围。

  


```CSS
.gallery__entry {
    animation : linear fade-in, linear fade-out;
    animation-duration: auto;
    animation-timeline: view(inline);
    animation -range: entry, exit;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f549d3502a774d48a9e98cd6f62dfc73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=584&s=11681090&e=gif&f=59&b=ced9df)

  


> Demo 地址：https://codepen.io/airen/full/vYbwKNV

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/166d7016da9b4bbd89a7028812d3beec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=584&s=11681090&e=gif&f=59&b=ced9df)

  


> Demo 地址：https://codepen.io/airen/full/yLZWJOJ

  


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

    #list-view li {
        animation: linear fade-in-out both;
        animation-duration: auto;
        animation-timeline: view();
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35766c86a8af437fa4a67000618d080f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=528&h=728&s=2827688&e=gif&f=127&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/poQMQWN

  


这也是 CSS 滚动驱动动效特性为 `@keyframes` 带来的最新变化。

  


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

  


-   `.parent` 元素声明了一个名为 `--tl` 的时间轴。它的任何子元素都可以找到并使用它作为 `animation-timeline` 属性的值
-   `.scroller` 元素实际上定义了一个名为 `--tl` 的滚动时间轴。默认情况下，它只对它的子节点可见，但是因为它的父元素（`.parent`）将它设置为 `scroll-timeline-root` ，所以 `--tl` 滚动时间轴会附加到 `.scroller` 上
-   `.animation--element` 元素使用 `--tl` 时间轴，它沿着它的祖先树，在 `.parent` 上找到 `--tl` 时间轴。随着 `.parent` 上的 `--tl` 指向到 `.scroller` 的 `--tl` ，此时，动画元素 `.animation--element` 将会跟踪 `.scroller` 上的滚动进度时间轴

  


换句话说，你可以使用 `timeline-root` 将时间轴向上移动到一个祖先(也称为提升)，以便该祖先的所有子节点都可以访问它。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0d39ee76eb9441bb28f59e02743083f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2317&h=1521&s=1061529&e=jpg&b=f2fbfe)

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e402d3b238da48639e627f10b30631ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=760&s=1295084&e=gif&f=124&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/BaMezWB

  


## 使用 WAAPI 创建滚动驱动动效

  


前面我们所聊的都是 CSS 滚动驱动动效相关的知识。事实上，在 Web 中，使用 WAAPI （Web Animation API）也是创建 Web 动效的常见方式之一。换句话说，我们同样可以使用 WAAPI 来创建滚动驱动动效。

  


我们先来看 WAAPI 是如何创建滚动进度轴驱动的动效。

  


### 使用 WAAPI 创建滚动进度轴

  


我们可以使用 `ScrollTimeline` 创建滚动时间轴，它可以接受 `scource` 和 `axis` 两个参数：

  


-   `source` ：对要跟踪其滚动条的元素的引用。使用 `document.documentElement` 表示以根滚动容器为目标
-   `axis` 确定要跟踪滚动的方向，可以接受的值有 `block` 、`inline` 、`x` 和 `y`

  


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

const tl = new ScrollTimeline({
    source: document.documentElement
});

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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6266463081b74f6a84c3f31bf2b4f1bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=400&s=11651658&e=gif&f=75&b=ccdde3)

  


> Demo 地址：https://codepen.io/airen/full/vYbwKxv

  


### 使用 WAAPI 创建视图进度轴

  


同样的，我们可以使用 `ViewTimeline` 来创建视图进度轴，它主要包括三个参数：

  


-   `subject` 对要跟踪其滚动条的元素的引用
-   `axis` 滚动方向，接受的值有 `block` 、`inline` 、`y` 和 `x`
-   `inset` 用来指定滚动视图范围

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b117674a804f44a89e947f34aa7a48bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=690&s=12921854&e=gif&f=123&b=ffffff)

  


> URL：https://scroll-driven-animations.style/

  


我们来看几个这方面的示例。

  


### 反向滚动列

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce344ec6a6bc459c936f8e761775e18d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=462&s=12674206&e=gif&f=78&b=ffffff)

  


> URL：https://scroll-driven-animations.style/demos/reverse-scroll/css/

  


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

    .column-reverse {
        flex-direction: column-reverse;
    }

    @keyframes adjust-position {
        from {
            transform: translateY(calc(-100% + 100vh));
        }
    
        to {
            transform: translateY(calc(100% - 100vh));
        }
    }

    .column-reverse {
        animation: adjust-position linear forwards;
        animation-timeline: scroll(root block);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d26fe30217f94d41877a2521c77ffcc4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=868&h=574&s=12352324&e=gif&f=58&b=4c4a69)

  


> Demo 地址：https://codepen.io/airen/full/eYxazWR

  


### 塞尔达传说：结合滚动捕捉与滚动驱动动效

  


CSS 中出现 **[滚动捕捉](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)** 似乎只是昨天的事情，现在我们可以考虑将 [CSS 滚动捕捉特性](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)和 CSS 滚动驱动动效结合在一起创建更好的效果。比如，我们使用它们来创建一个《塞尔达传说》的[时间轴案例](https://codepen.io/utilitybend/full/mdQpxBX)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b38dfc26fe741c3993a610d4edb6047~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=878&h=614&s=11121529&e=gif&f=118&b=181d01)

  


> Demo 地址：https://codepen.io/airen/full/VwgOjbV （来源于 [@Utilitybend](https://codepen.io/utilitybend/full/mdQpxBX) ）

  


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

@layer card {
    article {
        scroll-snap-align: center;
        scroll-snap-stop: always;
    }
}

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

    @keyframes info {
        0%,
        40%,
        60%,
        100% {
            opacity: 0;
            transform: translateY(-100%);
        }
        50% {
            opacity: 1;
            transform: translateY(0%);
        }
    }

    @keyframes imageEnter {
        0% {
            scale: 0.2;
            rotate: 70deg;
            border-radius: 0;
        }
    
        40%,
        60% {
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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c6ca7b079a14bcc9adaa2b65fc28e00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=752&s=15035222&e=gif&f=88&b=171a00)

  


> Demo 地址： https://codepen.io/airen/full/VwgOjbV

  


### 封面流：3D 滚动切换

  


Swiper 有一个经典效果，即 [3D 滚动切换](https://www.swiper.com.cn/demo/240-effect-coverflow.html)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/201d807dae2241dd9f22383583108a2e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1090&h=410&s=9300985&e=gif&f=65&b=ededed)

  


现在，我们使用 CSS 滚动捕捉和 CSS 滚动驱动动效两个功能，可以模拟出类似的效果，而且不需要依赖任何 JavaScript 脚本。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2652ab8729f94d488ed160e118166ad8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=426&s=15208114&e=gif&f=148&b=101010)

  


> URL：https://scroll-driven-animations.style/demos/cover-flow/css/

  


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
       

        & li {
            scroll-snap-align: center;
            display: inline-flex;
            width: var(--cover-size);
            aspect-ratio: 1;
            perspective: 40em;
        }

        & img {
            width: var(--cover-size);
            aspect-ratio: 1;
            transform: translateX(-100%) rotateY(-45deg);
            will-change: transform;
            -webkit-box-reflect: below 0.5em linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25));
        }
    }
}

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

    .cards li {
        view-timeline-name: --li-in-and-out-of-view;
view-timeline-axis: inline;

 animation : linear adjust-z-index both;
 animation -timeline: --li-in-and-out-of-view;

        & img {
            animation : linear rotate-cover both;
 animation -timeline: --li-in-and-out-of-view;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3726423552a6450ea2d2ce2f1e1595ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=374&s=11337556&e=gif&f=117&b=101010)

  


> Demo 地址：https://codepen.io/airen/full/yLZWJog

  


### 路径动画与滚动驱动动效的组合

  


在 CSS 中，我们还可以使用 `offset-path` 为元素定义一个运动路径，即路径动画。这是一种比矩形进度条更有趣的指示进度的方式。例如，我们可以让一架飞机的飞行轨迹随着页面滚动而变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae8bae98059a43c6b01fee3653e2c5ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=396&s=1595724&e=gif&f=185&b=3a3f88)

  


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

.progress {
    position: fixed;
    top: 3rem;
    left: 3rem;
    width: 3rem;
    height: auto;
    fill: currentColor;
    z-index: 1;
    
    offset-path: path ( 'M.5 122.7s24.7-275 276.9 0c327.1 356.7 266.1-330.3 548-33.3 256.9 270.7 271.1 0 271.1 0' );
 animation : move auto linear;
 animation -timeline: scroll (root);
}
```

  


> Demo 地址：https://codepen.io/airen/full/bGQXPpX

  


### 视差滚动动效

  


在介绍视图时间轴范围时向大家呈现了视差滚动动效的案例。这里我想再推荐一个由 [@Jhey 制作的视差滚动动效案例](https://codepen.io/jh3y/full/GRzpMLx)。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/524cd782e819477f92dcd4455cddcac0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=496&s=7406357&e=gif&f=341&b=050505)

  


> Demo 地址：https://codepen.io/jh3y/full/GRzpMLx

  


### 图片擦洗效果

  


图片擦洗效果是一种常见的交互效果，通常用于比较两张图片或显示隐藏的内容。这种效果的实现方式是通过用户在图片上进行滑动或拖动，使其中一张图片逐渐显示出来，仿佛在擦拭掉另一张图片的效果。这种效果通常用于展示图像的变化、比较前后状态或者展示隐藏的信息。

  


实现图片擦洗效果的一种方式是使用两个图层，用户通过滑动或拖动的交互操作改变两个图层之间的遮罩，从而控制其中一张图片的可见部分。这可以通过 CSS、JavaScript 和 HTML 元素的组合来实现。 @Jhey 在 Codepen 上提供了一个使用 [CSS 自定义属性](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)，[滤镜](https://juejin.cn/book/7223230325122400288/section/7259669043622690853#heading-4)和滚动驱动等特性实现的[图片擦洗效果的案例](https://codepen.io/jh3y/full/Exramqv)：

  


```HTML
<section>
    <div class="scrub scrub--images">
        <div class="images">      
            <img src="https://picsum.photos/300/300?random1" alt="">
            <img src="https://picsum.photos/300/300?random1" alt="">
        </div>
    </div>
</section>
```

  


```CSS
@property --scroll {
    initial-value: 0;
    inherits: true;
    syntax: '<number>';
}

@property --scrub {
    initial-value: 0;
    inherits: true;
    syntax: '<number>';
}

@property --reveal {
    syntax: '<number>';
    initial-value: 0;
    inherits: true;
}

@keyframes scrub {
    100% {
        --scroll: 100;
        --scrub: 100;
    }
}

@keyframes reveal {
      to { 
          --reveal: 1; 
      }
}

body {
    animation: reveal both steps(1, end);
    animation-timeline: scroll();
    animation-range: 0 100vh;
}

.scrub {
    animation: scrub linear both;
}

.scrub--images {
    animation-timeline: view();
    animation-range: entry 0% cover 50%;
}

img {
    --velocity: clamp(0, max(calc(var(--scroll) - var(--scrub)), calc(-1 * (var(--scroll) - var(--scrub)))), 25);
}

@media (pointer: fine) {
    img {
        transition: --scrub 0.15s ease-out;
    }
}

img:first-of-type {
    scale: calc(var(--scroll) / 100);
}

img:last-of-type {
    filter: brightness(calc(1 + ((var(--velocity, 0) * 4) / 100)));
    scale: calc(var(--scrub) / 100);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/609206bc23c6479d8454015a4ea2c1b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=512&s=7219466&e=gif&f=297&b=030303)

  


> Demo 地址：https://codepen.io/jh3y/full/Exramqv

  


仔细观察上面示例中左侧图片和右侧图片效果的差异，右侧图片是带擦洗的效果。

  


### 模拟苹果官网行动按钮的动画效果

  


一直以来，苹果官网的交互动画效果都是众多 Web 开发者，尤其是 Web 动画开发者所追求的目标。我在很多场合会被问到，如何实现类似苹果官网交互动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/490fbed39ee6443aa8c8947cf0ad0be0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=592&s=7814809&e=gif&f=94&b=020202)

  


现如今，我们也可以通过一些强大的特性简单化的实现一些相似的交互动画效果。例如 [@Jhey 使用滚动驱动动效特性模拟了苹果官网行动按钮的动画效果](https://codepen.io/jh3y/full/zYyzYpY)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0efe024c78d54d5ab06f55d3e54dcde4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1052&h=662&s=12047970&e=gif&f=358&b=121212)

  


> Demo 地址：https://codepen.io/jh3y/full/zYyzYpY

  


注意，如果不考虑兼容性，那么使用滚动驱动动效相关特性，你可以很容易的实现钉钉官网的动效：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b31c325bf3c3455882bddbbd71cf3d8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=608&s=7144125&e=gif&f=198&b=030306)

  


感兴趣的同学，可以尝试运用小册所学到的知识，撸一个相似的动画效果出来（注，网上有相关教程，这里就不再阐述）！

  


### 换肤

  


Web 上的换肤效果对于大多数开发者来说，都不是难事。在介绍 [CSS 视图过渡](https://juejin.cn/book/7288940354408022074/section/7308623298618163212)的时候，我曾介绍了如何通过视图过渡特性实现 Web 页面或组件的换肤效果。但这里，我要向大家推荐一个由 CSS 滚动动效实现的换肤效果。[这个案例是由 @Adam Argyle 提供的](https://codepen.io/argyleink/full/vYQQEmo)，在这个案例中，作者除了应用了这节课所介绍的滚动驱动动效的 `view-timeline` 还应用了不少[现代 CSS 的特性](https://s.juejin.cn/ds/i8M6YhrR/)，比如 `oklch()` （颜色函数）、`subgrid` （子网格）、[滚动捕捉](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)和[自定义属性](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)（`@property`）。具体效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6f0cdc9ebf94ff1ab7f492902bcf1b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=672&s=15301505&e=gif&f=220&b=014634)

  


> Demo 地址：https://codepen.io/argyleink/full/vYQQEmo

  


详细代码请阅读示例源码！

  


### 滚动驱动动效与视图过渡

  


滚动驱动动效和[视图过渡](https://juejin.cn/book/7288940354408022074/section/7308623298618163212)都是[现代 CSS](https://s.juejin.cn/ds/i8M6YhrR/) 中最新的两个特性，它们是什么和能做什么，这里就不再阐述。我在这里告诉大家的是，将它们相结合，我们可以制作出更多与众不同，有创意和引人注目的交互动画效果。例如下面这个示例，图片随着用户滚动页面时，在显示和隐藏时都会有相应的动效效果，这个效果是由滚动驱动动效实现的。另外，当你点击图片时，图片布局会发生变化（扩展网格布局），这个效果是由视图过渡实现的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fd194ce6b83425eb226ba9bddcbd8c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=508&s=13837143&e=gif&f=217&b=fdfcfc)

  


> Demo 地址：https://codepen.io/jh3y/full/XWywwqR

  


### 检测滚动方向和速度

  


当 @Bramus 在他的文章《[Solved by CSS Scroll-Driven Animations: Style an element based on the active Scroll Direction and Scroll Speed](https://www.bram.us/2023/10/23/css-scroll-detection/)》中提出“根据滚动方向和滚动速度调整动画元素样式”这个概念时，我感到非常的震惊和好奇。我们使用相关的 CSS 特性，在不依赖任何 JavaScript 的条件之下，可以根据滚动方向和滚动的速度来调整元素样式。这使得 Web 开发在创造动画的时候更为灵活和便利，甚至以前我们无法使用纯 CSS 实现的动画效果，现在可以轻易就实现，而且效果甚至比依赖于 JavaScript 脚本实现的效果还好。例如下面这个进度条指示器效果，用户向下滚动页面时，小鸡向前（向右）跑；用户向上滚动页面时，小鸡掉转方向向后（向左）跑。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ac82ecb137541fb83dd7b754ae307d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1432&h=552&s=841504&e=gif&f=192&b=818da4)

  


> Demo 地址：https://codepen.io/utilitybend/full/bGjQqXg （来源于 [@utilitybend](https://codepen.io/utilitybend/full/bGjQqXg) ）

  


上面的动画效果是优化前的效果，没有使用滚动监测；下面这个动画效果是优化后的效果，使用了滚动监测：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3c9d07ee3394eadbb53c9ab559b5eed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1432&h=500&s=956410&e=gif&f=196&b=818da4)

  


> Demo 地址：https://codepen.io/bramus/full/LYMjgjB （来源于 [@Bramus](https://codepen.io/bramus/full/LYMjgjB) ）

  


以往要实现相似的交互动画效果，我们不得不依赖 JavaScript 脚本。是不是更进一步的领略到了 CSS 滚动驱动动效的强大。

  


@Bramus 的文章介绍了 CSS 的几个核心特性，结合以下这几点，你就可以仅使用 CSS 来检测滚动速度和滚动方向：

  


-   **[CSS 自定义属性](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)** **（** **`@property`** **）** ：注册两个类型为 `<number>` 的自定义属性，使它们能够在动画中使用
-   **滚动驱动动效**：在滚动时对这些自定义属性进行动画处理。
-   **[过渡延迟时间](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)** **（** **`transition-delay`** **）** ：延迟子元素上的第二个自定义属性的计算。
-   **`calc()`** ：计算两个数值之间的差异，得到滚动速度（`滚动速度 = 速度 + 方向`）。
-   **`sign()`** ：从速度中提取滚动方向，得到值为 `1`、`0` 或 `-1`。
-   **`abs()`** ：从速度中提取滚动速度。

  


```CSS
@property --scroll-position {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
}

@property --scroll-position-delayed {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
}

@keyframes adjust-pos {
    to {
        --scroll-position: 1;
        --scroll-position-delayed: 1;
    }
}

:root {
    animation: adjust-pos linear both;
    animation-timeline: scroll(root);
}

body {
    transition: --scroll-position-delayed 0.15s linear;
    --scroll-velocity: calc(var(--scroll-position) - var(--scroll-position-delayed));
    --scroll-speed: max(var(--scroll-velocity), -1 * var(--scroll-velocity)); /* abs(var(--scroll-velocity)); */
    --scroll-direction: calc(var(--scroll-velocity) / var(--scroll-speed));   /* sign(var(--scroll-velocity)); */
    
    --when-scrolling: abs(var(--scroll-direction));
    --when-not-scrolling: abs(var(--when-scrolling) - 1);
    
    --when-scrolling-up: min(abs(var(--scroll-direction) - abs(var(--scroll-direction))),1);
    --when-scrolling-down: min(var(--scroll-direction) + abs(var(--scroll-direction)), 1);
    
    --when-scrolling-down-or-when-not-scrolling: clamp(0, var(--scroll-direction) + 1, 1);
    --when-scrolling-up-or-when-not-scrolling: clamp(0, abs(var(--scroll-direction) - 1), 1);
}
```

  


如此一来，我们可以基于该特性制作更多有意思的交互动画效果。比如改变精灵动画的方向：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b20823a6931a48a4bb706933ad1a3e20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942&h=472&s=14772404&e=gif&f=92&b=bccd65)

  


> Demo 地址：https://codepen.io/jbasoo/full/VwgaJGz （来源于 [@Jbasoo](https://codepen.io/jbasoo/full/VwgaJGz) ）

  


随着滚动方向调整文本填充效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbbad79efd3043698a9165edb469f342~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=420&s=15837160&e=gif&f=89&b=2c2a23)

  


> Demo 地址：https://codepen.io/bramus/full/OJrxBaL （来源于 [@Bramus](https://codepen.io/bramus/full/OJrxBaL) ）

  


掌握该技术，将使你的 CSS 水平更上一层，更为重要的是你创造的动画效果将提升一个档次。虽然它还不是完全完美的，例如滚动速度在实际情况可能会有点滞后，但它已经可以满足很多需求。这也意味着，滚动驱动动画不再仅局限于在滚动时简单地为元素添加动画，它可以帮助我们做一些更为重要的事情，从而减少了对 JavaScript 的依赖性。

  


当然，随着功能更强大，CSS 代码也相应的变得更为复杂，你需要储备更多的 CSS 知识，提高相关的技能。

  


随着技术不断的革新与发展以及浏览器厂商对它们的支持，有关于滚动驱动动效的应用将会越来越频繁，它所带来的效果也会越来越多，在这里我无法将所有效果都向大家展示。我挑选了一些有意义的案例向大家呈现，希望大家能通过这些案例进一步的了解滚动驱动动效。

  


## 小结

  


在这节课中，我们深入探讨了 CSS 滚动驱动动效的相关特性，比如滚动进度时间轴、视图进度时间轴、滚动时间轴范围和视图时间轴范围等。并通过结合多种 CSS 特性和技巧，展示了如何利用滚动行为创建引人注目的动画效果。

  


可以说，学习完前面的内容，你将会对滚动驱动动效相关特性有一个全面性的了解，并且能通过这些特性构建出符合你自己需求的动画效果。这不仅拓展了你的 CSS 技能，还启发了你对 Web 设计中创新和交互性的思考。