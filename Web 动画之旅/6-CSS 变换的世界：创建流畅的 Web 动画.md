在当今的 Web 设计和开发中，动画不仅仅是吸引用户的注意力，还是提高用户体验的关键要素之一。CSS 变换（`transform`）是创建流畅 Web 动画的强大特性之一，它使我们能够为用户呈现令人印象深刻的视觉效果，而无需依赖繁重的 JavaScript 代码或第三方动画库。通过巧妙地使用 CSS 变换属性，你可以使元素平滑地移动、旋转、缩放和倾斜，从而为你的网页增添生动性和互动性。你还可以将变换的不同函数（它有 `20` 多种不同的函数）与透视、视差效果组合起来，创建更复杂的动画效果和引人入胜的三维效果，为用户呈现更多的立体感和深度，同时还能使 Web 动画保持流畅。

  


我将和大家一起进入 CSS 变换的世界，将带领你深入了解 CSS 变换，探讨如何使用它来创建复杂而又流畅的 Web 动画。我们将学习如何运用 CSS 的变换属性，将静态元素转化为引人入胜的用户界面，以吸引用户的眼球，提高用户互动体验。我们还将学习如何组合 CSS 变换的不同函数、透视和视差效果，在 Web 中创建引人入胜的 3D 效果，使你构建的 Web 作品更有立体感和深度，进一步使你的 Web 作品更生动、吸引人，并提供更好的用户体验。

  


无论你是初学者还是有一定经验的开发人员，这节课都将为你提供实际操作的示例和技巧，使你能够创建引人入胜的 Web 动画，提升你的 Web 设计和开发技巧。动画不再是神秘的领域，它现在在你的指尖，只需一些 CSS 技能和创造力即可创造出流畅的 Web 动画。

  


准备好让你的 Web 网站和应用程序在浏览器中焕发新生吗？那么，让我们开始吧！

  


## 变换与动画之间的关系

  


一直以来，大家都认为 CSS 动画主要包括了 CSS 的过渡动画（Transition Animations）、帧动画（Keyframes Animations）和变换（Transform）三个部分。这是因为它们各自负责不同类型的动画，涵盖了大部分常见的 Web 动画需求。

  


简单地说，[过渡动画用于简单的状态变化，帧动画用于更复杂的动画序列](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)，而变换用于改变元素的位置和外观，这三个部分共同构成了 CSS 动画的核心。通过合理组合和应用这些技术，开发人员可以创建各种吸引人的 Web 动画效果，提高用户体验。这些部分的灵活性和互补性使它们成为创建 Web 动画的不可或缺的工具。

  


除此之外，CSS 变换（`transform`）特性能成为 CSS 动画核心之一还有另一个重要因素。它和我们追求的高性能、流畅的 Web 动画效果之间有着紧密的关联。因为 CSS 变换特性在设计和实现 Web 动画时具有多个优势，这些优势使得它们成为创建高性能和流畅动画的理想选择。具体表现在以下几个方面：

  


-   **硬件加速**：通常情况之下，Web 开发者会使用 CSS 变换（例如 `translateZ(0)`）来启动硬件加速。这意味着浏览器将 CSS 动画效果委托给图形处理器（GPU），而不是中央处理器（CPU）。这减轻了 CPU 的负担，提高了动画性能，自然使动画就变得更流畅了。硬件加速有助于避免动画卡顿和闪烁
-   **平滑的过渡效果**：CSS 变换允许你在不使用 JavaScript 的情况下，以一种平滑的方式对元素进行平移、旋转、缩放和倾斜等变换。这些变换可以应用于任何 HTML 元素，使它们在用户与网页交互时产生吸引人的动画效果
-   **关键帧动画**：CSS 变换还可以与关键帧（`@keyframes`）结合使用，以创建更复杂的动画序列。你可以定义多个关键帧，指定元素在不同时间点的状态，然后让浏览器自动计算中间状态，以实现流畅的动画。例如，[Animation.css](https://animate.style/) 中的大部分帧动画，都有 CSS 变换的身影。
-   **3D 透视和立体呈现**：CSS 变换通过 `perspective` 属性将透视这样的一个三维概念引入到 CSS 中。这样一来，你可将 CSS 变换、透视和视差三个概念协同工作。通过应用透视，你可以模拟远近的效果，然后使用变换来旋转、平移和缩放元素，使它们在三维空间中移动。视差效果可以通过改变元素的移动速度，为用户呈现更多的立体感和深度。

  


总之，CSS 变换是创建流畅 Web 动画的关键工具，它能够使你的 Web 页面更具吸引力和交互性，同时保持良好的性能和可访问性。无论是创建微小的悬停效果还是复杂的页面过渡，CSS 变换都为 Web 开发人员提供了丰富的工具来实现各种令人印象深刻的动画效果。

  


接下来，我们将深入了解我们常用的 `transform` 函数，以及它们如何组合在一起，创建更复杂的动画效果，同时仍然以流畅的每秒 `60` 帧的速度播放。

  


## CSS 变换简介

  


简单地说，CSS 变换特性允许你通过应用位移（`translate`）、旋转（`rotate`）、缩放（`scale`）和倾斜（`skew`）等变换效果，以及三维空间的变换，改变 Web 元素的位置、大小和外观，从而创建各种动画、视觉效果和交互效果。这些变换可以通过 CSS 的 `transform` 属性应用于 HTML 元素，使得 Web 开发者能够实现富有创意和引人入胜的用户界面。

  


CSS 变换和许多 CSS 功能一样，异常出色，绝不仅限于动画开发中。不少 Web 开发者都认为 CSS 的变换特性通常只用于动画开发中，如果没有动画开发的需求，几乎不会用到它。事实上并非如此，随着你对它越来越了解之后，你会发现它除了可以帮助你轻松控制元素在 Web 页面上的外观和行为之外，还可以帮助你为用户提供更吸引人的 Web 体验。

  


如果从 W3C 相关规范的角度来看，CSS 变换已经很强大了，你在 CSS 变换模块的 **[Level 1](https://www.w3.org/TR/css-transforms-1/)** 和 **[Level 2](https://www.w3.org/TR/css-transforms-2/)** 中可以找到它所有的功能特性。我们在这里不会阐述 CSS 变换涉及到的所有知识，但我将会带你深入了解它，并掌握它。

  


## CSS 变换的划分

  


根据 CSS 的变换的功能特性，它可以分为**位移**、**旋转**、**缩放**、**倾斜**和**透视**：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d6d29cdd6c94fcda70e37bea1fd68f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2278&h=1257&s=679731&e=jpg&b=ffffff)

  


除了上图中所列之外，还包括两个矩阵函数 `matrix()` 和 `matrix3d()` 。

  


CSS 变换还为 CSS 引入了一个重要的概念，那就是空间概念。因此，很多时候也将 CSS 变换分成 2D 变换（2D Transforms）和 3D 变换（3D Transforms），它们允许你在 2D 空间或 3D 空间中移动、旋转、缩放和倾斜元素。其主要区别是：

  


-   **2D 变换**：2D 变换是二维平面上进行的，即 `X` 轴和 `Y` 轴。这些变换不涉及 `Z` 轴，因此元素保持平坦。它常用于创建二维界面元素的动画、变换和效果。
-   **3D 变换**：3D 变换允许元素在三维空间中进行操作，这些变换涉及 `X` 、`Y` 和 `Z` 轴。这使得元素可以在视觉上远离或靠近观察者，创造出更加逼真的三维效果。它常用于创建更具深度感的用户界面，如 3D 旋转的卡片、3D 效果的菜单等。它们也常与透视（`prespective()`）一起使用，以模拟透视和深度效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54ee2ee2517941e492d7385080427c66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2278&h=949&s=571358&e=jpg&b=ffffff)

  


上图中所展示的都是可用于 `transform` 属性的变换函数 `<transform-function>` 。我们可以在 `transform` 属性上使用单个变换函数，也可以以空格分隔的方式使用多个变换函数。例如：

  


```CSS
/* 使用单个变换函数 */
.element {
    transform: rotate(45deg);
}

/* 同时使用多个变换函数 */
.element {
    transform: rotate(45deg) scale(1.1) translate3d(0, -10px, 0);
}
```

  


`transform` 属性使用组合变换函数（同时包含多个变换函数）时，将会带来另一个挑战。因为，`transform` 属性包含多个变换函数时，**它的顺序很重要，变换函数将按顺序应用**。从 [W3C 的规范中](https://www.w3.org/TR/css-transforms-1/#transform-rendering)，我们可以获知，变换函数（`translate()` 、`rotate()` 等）是从左向右应用的，即**从左到右乘以变换属性中的每个变换函数**。这意味着 `transform` 属性值中不同顺序的变换函数组合，其结果是不同的。例如：

  


```CSS
.element {
    transform: translate(80px, 80px) scale(1.5, 1.5) rotate(45deg);
}

.element {
    transform: rotate(45deg) scale(1.5, 1.5) translate(80px, 80px);
}
```

  


上面示例代码中，`transform` 属性中的 `translate(80px, 80px)` 和 `rotate(45deg)` 两个变换函数互换了一下位置。最终呈现给用户的结果是完全不同的。如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2950062a340d48b4bbbf6b67a21aa10d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2255&h=1971&s=864592&e=jpg&b=555674)

  


其中具体原委，我们稍后会介绍。

  


为了使 Web 开发者能更好的使用 CSS 的变换和避免 `transform` 属性的组合函数带来的不必要麻烦和困惑。W3C 的 CSS 工作小组，在 ****[CSS 变换模块的 Level 2](https://www.w3.org/TR/css-transforms-2/#individual-transforms) 中为开发者引入了**[单个变换属性](https://juejin.cn/book/7223230325122400288/section/7259668493158023205)**，即 `rotate` ，`scale` 和 `translate` 。

  


注意，新增的 `rotate` 、`scale` 和 `translate` 是 CSS 的属性，而以往我们熟悉的 `rotate()` 、`scale()` 和 `translate()` 是 CSS 的函数，它们只能运用于 CSS 的 `transform` 属性。**你也可以简单记住它们之间的差异，不带小括号（** **`()`** **）是 CSS 的属性，带有小括号是 CSS 的函数，仅用于 CSS 的** **`transform`** **属性上**。

  


这意味着，`translate` 、`rotate` 和 `scale` 属性对于 Web 开发者来说是更便利的，更具可读性的。这三个属性允许 Web 开发者单独指定元素的平移、旋转和缩放，而无需担心它们在 `transform` 中的组合顺序。这使得 CSS 代码更易于编写和维护，因为 Web 开发者可以按照直观的方式描述所需的变换，而不必深入了解复杂的组合规则。

  


以这种方式使用这些属性，可以更容易地创建用户界面元素的变换效果，例如拖放、旋转图像、缩放元素等，而不必担心变换的顺序和协调问题。这提高了代码的可读性和可维护性，使 Web 开发者能够更直观地实现所需的用户界面互动。

  


我想，现在的你更想知道 CSS 中的变换是如何使用，才能创造出流畅的动画效果。我们先从 CSS 变换函数的使用开始！

  


## CSS 变换函数

  


CSS 的变换函数有近 `20` 种不同的函数，它们分别用来帮助你对元素进行平移、旋转、缩放、倾斜和透视：

  


-   **平移**：`translate()` 、`translateX()` 、`translateY()` 、`translateZ()` 和 `translate3d()`
-   **旋转**：`rotate()` 、`rotateX()` 、`rotateY()` 、`rotateZ()` 和 `rotate3d()`
-   **缩放**：`scale()` 、`scaleX()` 、`scaleY()` 、`scaleZ()` 和 `scale3d()`
-   **倾斜（有时也称扭曲）** ：`skew()` 、`skewX()` 和 `skewY()` 。注意，它没有 3D 空间的概念，在 CSS 中并没有 `skewZ()` 和 `skew3d()` 两个函数
-   **透视**：`perspective()` ，它有对应的一个 CSS 属性，即 `perspective`

  


除了上面所列的 CSS 变换函数之外，还有两个矩阵函数，它们分别是 2D 矩阵 `matrix()` 和 3D 矩阵 `matrix3d()` 。

  


让我们逐个来看每个变换函数的使用以及所起的作用。

  


### 平移函数

  


你可以在 Web 上使用平移函数来移动一个元素，将元素从一个位置移动到另一个位置：

  


```CSS
.translate {
    transform: translate(var(--positionX), var(--positionY));
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/019c8f27bf1c4556804ee2c6c486e741~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=514&s=324519&e=gif&f=131&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/YzBXbeQ

  


我们可以通过 `translate()` 函数使元素在任一轴上移动位置：

  


-   沿 `x` 轴水平移动，正值向右移动，负值向左移动
-   沿 `y` 轴上下移动，正值向下移动，负值向上移动

  


正如你所看到的，元素的初始位置是不会改变的，改变的只是视觉位置。它的好处是，无论是流式布局（Flow）、[Flexbox 布局](https://juejin.cn/book/7161370789680250917/section/7161621092560273439)还是 [Grid 布局](https://juejin.cn/book/7161370789680250917/section/7161372229123440648)，它都不会影响 Web 上其他元素的布局。例如下面这个示例，我们采用的是 Grid 布局。当中间网格项目通过 `translate()` 函数调整位置时，网格布局算法并不能察觉到，其他网格项目依旧保持在原位：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5a354bbb8184e64901acc05230be3b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=458&s=436802&e=gif&f=148&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/BaMNgoM

  


`translate()` 与定位（`position`）布局中的 `top` 、`right` 、`bottom` 和 `left` 的工作方式类似，尤其是与相对定位（`position: relative`）相似，看上去都是相对于元素原始位置移动。

  


`translate()` 函数接受两个参数，第一个参数是在 `X` 轴平移的距离，第二个参数是在 `Y` 轴上平移的距离。它的值可以是一个长度值（`<length>`）、百分比值（`<percentage>`），还可以是其他的数学函数表达式值。另外，该函数相当于是 `translateX()` 和 `translateY()` 函数的简写方式。即：

  


```CSS
.element {
    transform: translate(var(--positionX), var(--positionY));
    
    /* 等同于 */
    transform: translateX(var(--positionX)) translateY(var(--positionY));
}
```

  


也就是说，当我们希望沿单一轴（`x` 轴或 `y` 轴）移动元素时，可以使用 `translateX()` 和 `translateY()` 函数。例如：

  


```CSS
/* 只沿 x 轴移动元素 */
.element {
    transform: translateX(var(--positionX));
    
    /* 等同于 */
    transform: translate(var(--positionX), 0);
}

/* 只沿 y 轴移动元素*/
.element {
    transform: translateY(var(--positionY));
    
    /* 等同于 */
    transform: translate(0, var(--positionY));
}
```

  


我们在使用 `translate()` 函数对元素进行平移时，有一个细节需要注意。那就是 `translate()` 函数的参数是个百分比值时，该百分比值是相对于元素自身的大小计算，而不是父容器尺寸计算，即 `x` 轴方向相对于元素的 `width` 计算，`y` 轴方向相对于元素的 `height` 计算。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c712f3c96c042ae88b09b91670ec643~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=532&s=630519&e=gif&f=243&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/RwvPzQE

  


当我们希望一个元素从外部移入，或将一个元素移到外部去，这非常有用。比如常见的移入移出动画，就是这样做的：

  


```CSS
/* 从左侧移入 */
@keyframes slideInLeft {
    from {
        transform: translate(-100%, 0);
        opacity: 0;
    }

    to {
        transform: translate(0, 0);
        opacity: 1;
    }
}

/* 从右侧移出 */
@keyframes slideInLeft {
    from {
        transform: translate(0%, 0);
        opacity: 1;
    }

    to {
        transform: translate(100%, 0);
        opacity: 0;
    }
}
```

  


例如下面这个效果，第一张图片从屏幕右侧移入，第二张图片从屏幕左侧移入：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc886b493ad74250a4b923105eb03fcc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=742&s=6725149&e=gif&f=189&b=fefdfd)

  


> Demo 地址：https://codepen.io/airen/full/QWYjLjx

  


我用下图来阐述示例中 `translate(100%, 0)` 和 `translate(-100%, 0)` 的具体含义：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21f772ecf00c4ea6b8cb80a73673f8c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=949&s=578821&e=jpg&b=fdfcfc)

  


这样一目了然了吧！`translateX(-100%)` 会把图片向左移动，移动距离等于图片确切的宽度，可以精确到像素。

  


如果你想给 `translate()` 函数运用百分比值时还能添加一个“缓冲区”，以便可以将某物平移一个其自身尺寸再加上几个额外像素的距离。那么可以借助 `calc()` 函数来实现，甚至还可以[混合使用相对单位和绝对单位](https://juejin.cn/book/7223230325122400288/section/7249357892611440700)：

  


```CSS
.element {
    --positionX: calc(100% + 2vh);
    transform: translateX(var(--positionX));
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16cef4a71b4947008ce47fbcaa4bd37e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=460&s=441509&e=gif&f=174&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/Vwgvwzd

  


上面我们所探讨的都是关于如何使用 `translate()` （ `translateX()` 或 `translateY()`）函数将元素沿着 `x` 轴或 `y` 轴移动位置。除此之外，CSS 还提供了一个 `translateZ()` 函数，它主要用于在三维坐标系中移动元素，主要影响的是 `Z` 轴，**即深度方向**。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ec2b900c16040d5927a1e25895e17df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=949&s=176803&e=jpg&b=c0d8d2)

  


在三维坐标系中，`x` 轴用于水平移动（`translateX()`）、`y` 轴用于垂直称动（`translateY()`），而 `z` 轴用于控制元素在深度方向的位置（`translateZ()`）。通过使用 `translateZ()` 函数，你可以将元素向前（离你的眼睛更近）或向后（离你的眼睛更远）移动，改变其在三维空间中的位置，而不影响水平和垂直方向的位置。

不过，要使 `translateZ()` 函数生效，就必须得有一个 `perspective()` 函数。`perspective()` 函数定义了计算屏幕的平面与应用 `translateZ()` 的元素之间的虚拟距离。例如：

  


```CSS
.element {
    transform: perspective(400px) translateZ(100px);
}
```

  


上面代码的意思是：

  


-   首先 `perspective(400px)` 函数定义了计算机屏幕的平面与 `.element` 元素之间的虚拟距离，该距离是 `400px`
-   然后 `translateZ(100px)` 会将元素 `.element` 向你靠近 `100px` ，离你的眼睛更近，看上去就更大（有点类似放大的效果）。反之，要是 `translateZ()` 函数的值是一个负值，比如 `-100px` ，那么 `.element` 元素则会离你的眼睛更远，看上去就更小（有点类似缩小的效果）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54534be11a2542b6be43847977e31f32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=949&s=469580&e=jpg&b=272935)

  


下面这个案例向你演示了 `perspective()` 和 `translateZ()` 效果，你可以尝试调整这两个函数的值，你将会看到元素不同的变化效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c38d80687bbb4029a46cc1c46c164806~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=546&s=1177979&e=gif&f=429&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/vYbNEdE

  


我们来看一个简单的案例。

  


```CSS
button {
    transform: perspective(100px) translateZ(0px);
    transition: transform 100ms linear;
    
    &:hover {
        transform: perspective(100px) translateZ(10px);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/188169d8d3e64a81bbedf11f3e84b760~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=362&s=192477&e=gif&f=131&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/rNPOaPo

  


正如你所看到的，使用 `translateZ()` 函数非常容易创建引人入胜的视觉效果（上图中左侧是 `translateZ()` 实现按钮缩放的过渡效果；右侧是使用 `scale()` 函数实现的，两者效果基本上无差异）。

  


你现在知道了，如何使用 `translateZ()` 函数将元素在 `z` 轴上移动。不过，`translateZ()` 函数的使用有一些细节必须知道：

  


如果 `translateZ()` 函数的值等于或大于 `perspective()` 函数的值，它会导致位移消失。你可以随时在 `translateZ()` 函数中设置一个无限小的值，但反之则不成立。一旦超过 `perspective()` 函数的值，元素将不再可见。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7560c3146a42451bbb044b346d7f8a15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=552&s=1445794&e=gif&f=375&b=494868)

  


另一点是，应用 `perspective(0px)` 会导致 `translateZ()` 效果被忽略。任何非零的 `perspective()` 函数，`translateZ()` 都会有效：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9f4b5f6ce7546c0aa0942761948198e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=542&s=412683&e=gif&f=157&b=4a4969)

  


CSS 变换中，还有一个 `translate3d()` 函数也可以用来调整元素在 Web 上的位置。该函数接受三个参数：

  


-   第一个参数用于指定元素在 `x` 轴的移动位置的值
-   第二个参数用于指定元素在 `y` 轴的移动位置的值
-   第三个参数用于指定元素在 `z` 轴的移动位置的值

  


它相当于同时涵盖了 `translateX()` 、`translateY()` 和 `translateZ()` 三个函数。

  


```CSS
.element {
    transform: translate3d(100px, -100px, 20px);
    
    /* 等同于 */
    transform: translateX(100px) translateY(-100px) translateZ(20px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2d86a2c36c3485193f4c66d449a67ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=482&s=445502&e=gif&f=179&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/RwvWPML

  


你可能已经发现了，上面这个示例中，不管你怎么调整 `translate3d()` 函数中 `z` 轴的值，它都不会有任何效果。始终只能看到元素沿着 `x` 轴和 `y` 移动。这是因为，我们没有显式设置 `perspective()` 函数，`translate3d()` 函数中对应的 `z` 轴移动也就失效了。也就是说，你希望 `translate3d()` 函数中的 `z` 轴（相当于 `translateZ()`）生效，那就需要显式定义 `perspective()` 函数：

  


```CSS
.element {
    transform: perspective(100px) translate3d(100px, -100px, 20px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9aef503cc42d4935afe428f2e7c30a63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=528&s=1502530&e=gif&f=444&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/dyaYojW

  


注意， `perspective()` 函数是 CSS 变换中的一个重要函数，只要是和 3D 空间有关的变换函数，都离不开它。稍后我们会详细介绍这个函数的相关细节。

  


到此，CSS 变换中与平移相关的函数就全部介绍完了。简单地说，平移是 CSS 变换中的一个重要功能，通过 `translateX()` 、`translateY()` 、`translateZ()` 、`translate()` 和 `translate3d()` 等函数，可以在 Web 上移动一个元素，而且还不会打破 Web 的布局。它也是一种常用的变换，用于控制平移的距离和方向，你可以改变元素在页面中的位置和大小，从而创造出各种吸引人的用户界面效果。同时，它们常用于实现各动画和交互效果。例如，与 CSS 的过渡和关键帧动画一起使用，可以创建幻灯片轮播、缩放、滑入滑出等效果。

  


```CSS
.box span{
    transition: all 0.2s ease .1s;
    transform: translate3d(0, -0.5em, 0);
}
    
.box:hover span {
    transform: translate3d(0, 0, 0);
}
```

  


鼠标悬停到按钮上时，按钮文本会有一个从上往下掉落的动画效果。使用 `translate3d()` 和 CSS 过渡动画一起制作的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95d0b701e92649f1a4bd7e8f7b34602d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=558&s=3109949&e=gif&f=317&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/xxMwwRr

  


### 缩放函数

  


CSS 变换中的缩放函数主要有 `scale()` 、`scaleX()` 、`scaleY()` 、`scaleZ()` 和 `scale3d()` ，它们以不同的方向来控制元素的缩放效果。可以说，Web 上很多动画效果都离不开缩放函数，比如加载动画、水波动画、呼吸动画、放大缩小动画等。

  


先来看 `scale()` 函数。`scale()` 函数可以使用一个无单位的数字值，该数字值代表缩放的倍数。通常情况：

  


-   `scale()` 函数的值为 `1` 时，元素将保持原样不变，既不放大，也不缩小
-   `scale()` 函数的值为 `0` 时，元素将缩小到不可见
-   `scale()` 函数的值大于 `1` 时，元素将会放大
-   `scale()` 函数的值小于 `1` 时，元素将会缩小

  


例如：

  


```CSS
.element {
    transform: scale(2);   
}
```

  


上面代码表示元素尺寸会放大 `2` 倍。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90b32d076a6d413cbb52ec1016362ed1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=460&s=543251&e=gif&f=233&b=494867)

  


> Demo 地址：https://codepen.io/airen/full/RwvWRqv

  


正如你所看到的，只给 `scale()` 函数传一个值时，元素的水平方向（`x` 轴）和垂直方向（`y` 轴）缩放倍数是相同的。换句话说，你可以同时给 `scale()` 函数同时传两个值不同的值，使元素能分别沿着 `x` 轴和 `y` 轴进行缩放：

  


```CSS
.element {
    transform: scale(2, 1.5);
}
```

  


上面代码表示，元素会沿着水平方向（`x` 轴）放大 `2` 倍，同时会沿着垂直方向（`y` 轴）放大 `1.5` 倍。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe5a76fd7bbc4a74a278ffce9f9340d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=492&s=732100&e=gif&f=372&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/wvNKoKP

  


注意，当 `scale()` 函数传递两个值时，只要其中有一个值为 `0` ，元素都会被缩小到不可见。另外，当两个值相同时，第二个参数值（`y` 轴）可以省略不写。

  


同样的，`scale()` 函数可以被视为 `scaleX()` 和 `scaleY()` 的简写函数。例如：

  


```CSS
.element {
    transform: scale(2, 1.5);
    
    /* 等同于 */
    transform: scaleX(2) scaleY(1.5);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c685cfeb1a464874bc48e7311298d448~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=558&s=362287&e=gif&f=150&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/oNmjYwL

  


-   **`scaleX()`** **函数**：用于指定元素在水平方向上的缩放倍数，而垂直方向保持不变
-   **`scaleY()`** **函数**：用于指定元素在垂直方向上的缩放倍数，而水平方向保持不变

  


上面我们所介绍的三个缩放函数 `scale()` 、`scaleX()` 和 `scaleY()` 都是用于 2D 空间的。它们只会使元素沿着 `x` 轴或 `y` 轴（或同时沿着 `x` 轴和 `y` 轴）进行缩放。如果你希望元素能沿着 `z` 轴进行缩放，那就需要使用 3D 变换中的 `scaleZ()` 函数。例如：

  


```CSS
.element {
    transform: scaleZ(2);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3691209383d489c93fc609c6256ed6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=498&s=248040&e=gif&f=125&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYxpBbY

  


看上去似乎没有太大差异，但你将 `scaleZ()` 函数的值调整到 `0` 时，元素在 `z` 轴上也会缩小到不可见。为了使大家能更清楚看到 `scaleZ()` 函数给元素带来的变化，我在上面示例的基础上添加了 `perspective()` 函数和 `rotateY()` 函数：

  


```CSS
.element {
    transform: perspective(400px) scaleZ(2) rotateY(45deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d32ef152f42f4a2692becfd8886243c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=474&s=1052172&e=gif&f=285&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/jOdbyPg

  


3D 变换中还有另一个缩放函数，那就是 `scale3d()` ，你可以把它理解成 `scaleX()` 、`scaleY()` 和 `scaleZ()` 三个缩放函数的综合产物：

  


```CSS
.element {
    transform: scale3d(2, .5, 1);
    
    /* 等同于 */
    transform: scaleX(2) scaleY(.5) scaleZ(1);
}
```

  


`scale3d()` 函数允许同时指定三个方向（`x`、`y` 和 `z`）上的缩放倍数，用于三维变换。

  


-   `x`：表示水平方向的缩放倍数。
-   `y`：表示垂直方向的缩放倍数。
-   `z`：表示在Z轴上的缩放倍数。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae0af74de6ef4e8386e74f7524280e37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=528&s=2080746&e=gif&f=517&b=484765)

  


> Demo 地址：https://codepen.io/airen/full/poGjKdq

  


需要注意的是，元素进行缩放设置时，不仅是对元素框的缩放，而且会对整个元素以及其所有后代元素，包括匿名元素框（比如文本）以及伪元素。

  


```HTML
<div class="scale">
    Hello World!
    <span></span>
</div>
```

  


```CSS
.scale {
    transform: scale3d(2, 1.5, 1);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc2981d0a5ff453dab794f64b1543e26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=524&s=1353867&e=gif&f=424&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/MWLaXPM

  


这也从侧面告诉我们关于变换的一个重要事实：CSS 变换会将元素视为一个平面图像，就像在图像编辑软件中一样，可以对它进行缩放、扭曲和变形等操作。这也是为什么变换在动画中具有优势的主要原因。

  


如果你稍微了解 Web 布局相关知识的话，那么你就晓得，当我们改变像宽度这样的属性时，浏览器会需要做多少计算。所有的布局算法都需要重新运行，确切地确定这个元素和它的所有兄弟元素应该在哪里。如果元素内有文本，那么换行算法需要确定这个新宽度是否会影响断行位置。然后，绘制算法运行，确定每个像素的颜色应该是什么，并填充它。

  


在页面加载时执行一次这些计算是可以的，但当我们对某些内容进行动画时，我们需要每秒执行许多次这些计算。使用 CSS 变换，我们可以跳过许多步骤。这意味着计算速度更快，制作的动画效果就更平滑，不会那么容易卡顿。

  


虽然变换中缩放函数会拉伸或挤压元素的内容，但实际上我们可以利用这种效果。例如一个进度条动画或滚动指示器动画效果。我们来看 `scaleX()` 制作的进度条动画效果：

  


```CSS
@keyframes progress {
    0% {
        transform: scaleX(0);
    }
    
    100% {
        transform: scaleX(1);
    }
}
  
.progress::before {
    transform-origin: left center;
    animation:progress 5s ease-in-out infinite alternate;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2a5c22aac1a4005bb6d238fd44ee304~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=222&s=457846&e=gif&f=91&b=f8f8f8)

  


> Demo 地址：https://codepen.io/airen/full/poGjZyz

  


再来看看这个电视开关动画：

  


```CSS
@layer animation {
    @keyframes closeTV {
        from {
            transform: scale(1, 1);
            filter: brightness(100%);
        }
        to {
            transform: scale(0.5, 0);
            filter: brightness(800%);
        }
    }

    .switch:has(:checked) ~ .video > video {
        animation: closeTV 0.28s ease-out both;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c85ac8ec18454e0d987a4e07d4b61a64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=496&s=1829824&e=gif&f=173&b=4350a5)

  


> Demo 地址：https://codepen.io/airen/full/VwgvBbQ

  


`sacle()` 和 `sacle3d()` 函数还常用来制作呼吸灯和脉搏器的动画效果：

  


```CSS
@layer animation {
    @keyframes zoomIn {
        0% {
            opacity: 0;
            transform: scale3d(0.4, 0.4, 0.4);
        }
    
        50% {
            opacity: 0.5;
        }
    
        100% {
            opacity: 0;
        }
    }
  
    .animated::after {
          animation: zoomIn 2s infinite;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d47690f1274e43ada5149496ac0a9f2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=432&s=281822&e=gif&f=81&b=202a30)

  


> Demo 地址：https://codepen.io/airen/full/XWOmPOx

  


包括各种 `zoomIn` 和 `zoomOut` 动画效果，也离不开 CSS 变换中的缩放函数：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f3927a741ea458e83561a06e82851e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=634&s=3807514&e=gif&f=260&b=fce833)

  


> URL 地址：https://xsgames.co/animatiss/

  


### 旋转函数

  


CSS 变换中旋转函数主要包括 `rotate()` 、`rotateX()` 、`rotateY()` 、`rotateZ()` 和 `rotate3d()` ，主要用来旋转元素。除 `rotate()` 函数之外的其他旋转函数都是在 3D 空间中旋转元素的。其中：

  


-   `rotateX()` 函数 ：元素绕 `x` 轴进行 3D 旋转
-   `rotateY()` 函数：元素绕 `y` 轴进行 3D 旋转
-   `rotateZ()` 函数：元素绕 `z` 轴进行 3D 旋转
-   `rotate3d()` 函数：元素在三维空间中绕指定轴进行旋转

  


这些旋转函数可用于各种场景，包括创建旋转动画、翻转卡片、制作 3D 效果、旋转图标等。它们允许你以不同的方式旋转元素，增加网页和应用的交互性和视觉吸引力。根据需求选择适当的旋转函数来实现所期望的效果。

  


我们先来看 2D 空间中的旋转函数 `rotate()` 。你可以给这个函数传递一个角度值，例如 `90deg` ：

  


```CSS
.element {
    transform: rotate(45deg);
}
```

  


上面的代码会使元素绕着其原点顺时针旋转 `90deg` （即四分之一圈）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c54bb54dc1a041728e44653bcf1d102b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=414&s=223542&e=gif&f=61&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/qBgOJXO

  


`rotate()` 函数允许你以特定的角度旋转元素，而旋转的中心点是元素的原点，该原点可以通过 `transform-origin` 来调整（稍后会介绍）。如果 `rotate()` 函数使用正角度值，则元素进行顺时针旋转；反之元素进行逆时针旋转。

  


`rotate()` 函数的值除了正负角度值之外，你还可以使用其他描述角度值的单位，比如：

  


-   **角度值（** **`deg`** **）** ：一个完整的圆是 `360deg`
-   **梯度值（** **`grad`** **）** ：一个完整的圆是 `400grad`
-   **弧度值（** **`rad`** **）** ：一个完整的圆是 `2π` 弧度
-   **圈（** **`turn`** **）** ：一个完整的圆是 `1turn`

  


它们之间可以相互转换：

  


```
1 度（deg）  = 1.11111 梯度（grad）
1 度（deg）  = π ÷ 180 弧度（rad）
1 圈（turn） = 360 度（deg）
```

  


例如，`90deg` ，它分别等于 `100grd` （`100` 梯度 ）、`.25turn` （`.25` 圈，即四分之一圈）和大约 `1.57rad` （大约 `1.57` 弧度）。

  


也就是说，你可以使用上面四种单位中的任意一种作为旋转函数的值单位。例如，你使用 `turn` （圈）单位作为旋转函数的值单位，它可以描述元素旋转了多少圈。例如：

  


```CSS
.element {
    transform: rotate(.25turn);
}
```

  


表示元素旋转了四分之一圈，即 `90deg` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d282afaa812464c99d69c141b588aea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=504&s=441938&e=gif&f=128&b=4a4968)

  


> Demo 地址：https://codepen.io/airen/full/dyaYQoz

  


需要知道的是，`rotate()` 只能传一个值，它也不是 `rotateX()` 和 `rotateY()` 函数的组合物。

  


如果你希望元素绕着指定的轴旋转，那只能使用指定轴对应的旋转函数。例如，你希望元素能绕 `x` 轴旋转，那得使用 `rotateX()` 函数：

  


```CSS
.element {
    transform:perspective(400px) rotateX(45deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae5f0928f4ff4e0b8b76e9f5ce11e40c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=398&s=880431&e=gif&f=267&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYxpQgJ

  


使用 `rotateY()` 函数，可以指定元素绕 `y` 轴旋转：

  


```CSS
.element {
    transform:perspective(400px) rotateY(45deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc41f3bcb7c34469a148377d65e10ca5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=384&s=864261&e=gif&f=273&b=494867)

  


> Demo 地址：https://codepen.io/airen/full/jOdbQZE

  


使用 `rotateZ()` 函数，可以指定元素绕 `z` 轴旋转：

  


```CSS
.element {
    transform:perspective(400px) rotateZ(45deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a9eb32f32d84efda2a3f2f0edd2f260~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=430&s=502421&e=gif&f=134&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/zYevMjw

  


你可能已经发现了，`rotateZ()` 和 `rotate()` 的视觉效果上是一样的：

  


```CSS
.rotate {
    transform:rotate(45deg);
}

.rotateZ {
    transform:perspective(400px) rotateZ(45deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a814626304aa4714899cddfcc5960adb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=514&s=1207950&e=gif&f=256&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/abXvQRL

  


正如你所看到的，`rotateZ()` 和 `rotate()` 函数都可以用于在 2D 空间中旋转元素，以实现相同的旋转效果。但需要知道的是，`rotateZ()` 函数会告诉浏览器元素绕 `z` 轴旋转，尽管其效果在二维平面中应用，但它为变换添加了深度感。

  


你可以在下面这个可视化演示中，查看 `rotate()` 、`rotateX()` 、`rotateY()` 和 `rotateZ()` 各旋转函数给元素带来的不同变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d873992dca144bed83216d437950cdef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=728&s=2614036&e=gif&f=375&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/xxMwmbj

  


在介绍 `translate3d()` 和 `scale3d()` 两个 3D 变换函数的时候，提到过，它们可以由单个轴的变换函数组合而成，即：

  


```
translate3d(tx, ty, tz) = translateX(tx) translateY(ty) translateZ(tz)
scale3d(sx, sy, sz) = scaleX(sx) scaleY(sy) scaleZ(sz) 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/590239393a19431f90e1c46c840a2d90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=554&s=2265876&e=gif&f=437&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/PoVPXeZ

  


CSS 变换中也有一个 `rotate3d()` 函数，但它并不是 `rotateX()` 、`rotateY()` 和 `rotateZ()` 等旋转函数的组合物。它有着不同的语法规则：

  


```
 rotate3d() = rotate3d( <number> , <number> , <number> , [ <angle> | <zero> ] )
```

  


即：

  


```
rotate3d() = rotate3d(rx, ry, rz, angle)
```

  


它用于绕 `[rx, ry, rz]` 方向向量描述的轴进行 3D 旋转，旋转角度由最后一个参数 `angle` 指定。其中 `rx` 、`ry` 和 `rz` 是方向向量的分量，通常为 `1` 或 `-1` ，表示绕坐标轴旋转；`angle` 是旋转的角度。你可以使用 `rotate3d()` 函数创建复杂的三维旋转效果。

  


下面是一个示例，演示如何使用 `rotate3d()` 函数绕指定轴进行 3D 旋转：

```CSS
.element {
    transform: rotate3d(1, 1, 0, 45deg);
}
```

  


上面代码将使元素绕 `[1, 1, 0]` 方向向量描述的轴逆时针旋转 `45deg`。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fac1669d8dce46d2bc2787edd5e0fe91~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=538&s=2279073&e=gif&f=667&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/YzByBrp

  


`rotate3d()` 函数中的 `rx` 、`ry` 和 `rz` 也可以是 `0 ~ 1` 之间的数值。

  


-   `rx` ：表示旋转轴 `x` 坐标方向的矢量
-   `ry` ：表示旋转轴 `y` 坐标方向的矢量
-   `rz` ：表示旋转轴 `z` 坐标方向的矢量

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1c985340b114895964fe46a0a520b34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=512&s=1279648&e=gif&f=307&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/jOdbdXX

  


注意，我们可以使用 `rotate3d()` 分别来描述 `rotateX()` 、`rotateY()` 和 `rotateZ()` 三个函数：

  


```
rotate3d(1, 0, 0, <angle>) = rotateX(<angle>)
rotate3d(0, 1, 0, <angle>) = rotateY(<angle>)
rotate3d(0, 0, 1, <angle>) = rotateZ(<angle>)
```

  


在 Web 上，我们可以使用旋转函数来制作很多有创意的 Web 动画或交互效果。我们先从最简单的入手。

  


下面这个示例中，初始状态是一个“加号”按钮，当用户点击它的时候，它将会变成一个“关闭按钮”：

  


```CSS
input[type="checkbox"] ~ svg {
    transition: transform .2s ease-in-out;
}
  
input[type="checkbox"]:checked ~ svg {
    transform: rotate(315deg) scale(.9);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7a78e759f8d49d6a9e2bb8a61138f4f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=410&s=10174577&e=gif&f=75&b=e9c8b5)

  


> Demo 地址：https://codepen.io/airen/full/ZEwbgjx

  


上面这个示例，将 CSS 变换中的旋转函数 `rotate()` 与 CSS 过渡动画结合起来，既节省了资源，又使交互略带微弱动画效果，提示用户加购成功，用户取消加购将回到初始状态。

  


我们也可以使用 `rotate()` 和 CSS 的帧动画一起来制作一些装饰性的动画效果，比如页面的加载动画：

  


```CSS
@layer animation {
    @keyframes spin {
        to {
            transform: rotate(-360deg) translateY(var(--y));
        }
    }

    .loader {
        transform: rotate(0deg) translateY(var(--y));
        animation: spin var(--speed) infinite linear;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12d8c815c2a74f4db7f72dad5b773dee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=500&s=310332&e=gif&f=59&b=1a0a16)

  


> Demo 地址：https://codepen.io/airen/full/ExrPWJO

  


基于上面加载动画的基础上，稍微调整我们就可以制作出别的旋转动画。例如制作一个用于语音识别 UI ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfa06a91da684dcdb9637f32f9161d3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=426&s=190706&e=gif&f=68&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/jOdWmOa

  


在我们现实生活中，很多事物都是带有动作的。例如风吹过之时，树枝会有呈现左右摆动的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31db4cd38891402bb53f608c7b54573f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1200&s=10219666&e=gif&f=47&b=ffbeb1)

  


我们把上图这种效果称作为“摆锤”或“钟摆”效果。这种效果在 Web 上也很常见，而且我们使用变换中旋转函数就可以很容易的实现。例如下面这个，挂在门面上的休息门牌：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c46894301e0a4cbd9ae7327dba682ec9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=488&s=10722967&e=gif&f=170&b=cecac8)

  


> Demo 地址：https://codepen.io/airen/full/VwgeWPM

  


关键代码如下：

  


```CSS
@layer animation {
    @keyframes init {
        0% {
            transform: scale(0);
        }
        40% {
            transform: scale(1.1);
        }
        60% {
            transform: scale(0.9);
        }
        80% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes init-sign-move {
        100% {
            transform: rotate(3deg);
        }
    }
    
    @keyframes sign-move {
        0% {
            transform: rotate(3deg);
        }
        50% {
            transform: rotate(-3deg);
        }
        100% {
            transform: rotate(3deg);
        }
    }
  
    .signboard-wrapper {
        animation: 
            1000ms init forwards, 
            1000ms init-sign-move ease-out 1000ms,
            3000ms sign-move 2000ms infinite;
    }
}
```

  


如果把上面这个动画效果用于图片墙上，它看起来就会有点像心愿墙上的标签被风吹动的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33e33511b0764c7eade862dcfdb33999~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=830&h=602&s=19432560&e=gif&f=71&b=dcd7d4)

  


> Demo 地址：https://codepen.io/airen/full/NWoxjZL

  


### 倾斜函数

  


CSS 变换中的倾斜函数又被称为扭曲函数，主要有 `skew()` 、`skewX()` 和 `skewY()` ，它们只能在 2D 空间中对元素时行变换。它通过沿水平方向 `x` 轴和（或）垂直方向 `y` 轴倾斜元素来扭曲元素，从而呈现出倾斜的外观：

  


-   **`skew()`** ：接受两个参数，第一个是水平方向倾斜元素的角度，第二个是垂直方向倾斜元素的角度，如果第二个参数省略不写，将表示垂直方向不做任何角度的倾斜，即为 `0`。
-   **`skewX()`** ：使元素沿着水平方向按指定的角度倾斜元素
-   **`skewY()`** ：使元素沿着垂直方向按指定的角度倾斜元素

  


例如，如果要对元素应用水平倾斜，你可以使用 `transform: skewX(30deg)` ；类似地，`transform: skewY(-30deg)` 会使元素在垂直方向倾斜。你也可以使用 `skew()` 函数来替代它们，例如：

  


```CSS
.element {
    transform: skewX(30deg);
    
    /* 等同于 */
    transform: skew(30deg, 0);
}

.element {
    transform: skewY(-30deg);
    
    /* 等同于 */
    transform: skew(0, -30deg);
}
```

  


`skew()` 函数和 `translate()` 函数有点类似，它相同于是 `skewX()` 和 `skewY()` 的综合产物，例如：

  


```CSS
.element {
    transform: skew(30deg, -30deg);
    
    /* 等同于 */
    transform: skewX(30deg) skewY(-30deg);
}
```

  


另外，如果元素在垂直方向的倾斜角度为 `0` 时，那么除了使用 `skewX()` 函数来表示之外，也可以直接使用 `skew()` 函数表示。例如：

  


```CSS
.element {
    transform: skewX(30deg);
    
    /* 等同于 */
    transform: skew(30deg);
    
    /* 或等同于 */
    transform: skew(30deg, 0);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7487d79fe4244b6bce17ba6daaaa1e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=328&s=961298&e=gif&f=218&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/gOqPjKB

  


变换中的倾斜函数还与旋转函数有一点相同，它的值单位，除了角度值 `deg` 之外，也还可以是圈值 `turn` 、弧度值 `rad` 和梯度值 `grad` ，同样可以接受正负值:

  


```CSS
.element {
    transform: skew(.2turn, -.1turn);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a52927f18964cb29e23c4351b96e5a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150&h=556&s=788423&e=gif&f=148&b=494868)

  


> Demo 地址：https://codepen.io/airen/full/gOqPjZQ

  


倾斜变换通常用于创建独特的设计效果，特别适用于处理形状和文本。它并不像其他变换（如平移、旋转或缩放）那么常见，但在适当的情况下，它可以为你的设计增添有趣的元素。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deb4d62425354ad3a3a029c75182a153~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5000&h=3334&s=2626737&e=jpg&b=e8d8ce)

  


来看一个具体的示例。下面这个示例是由 [@Olivia Ng 提供的“文件夹选项卡” UI 效果](https://codepen.io/oliviale/full/bGWXEWK)，每个选项卡左右两侧的倾斜效果就是使用 `skew()` 的实现的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6905ab955e7e47a3a55df261850ba3d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1176&s=713462&e=jpg&b=7c3e78)

  


> Demo 地址：https://codepen.io/airen/full/eYxJLOg （来源于 [@Olivia Ng](https://codepen.io/oliviale/full/bGWXEWK) ）

  


`skew()` 函数除了能帮助我们增添一些有趣的 UI 设计效果之外，它也能给 CSS 过渡动画和帧动画增色不少。比如下面这个简单的图片悬浮效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/234359b887184ff9a88fa705036d47a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=360&s=13105056&e=gif&f=106&b=d9cdc6)

  


> Demo 地址：https://codepen.io/airen/full/YzBwOXJ

  


示例中图片和文本之间的背景就是使用 `skew()` 函数使其沿着水平方向倾斜 `-45deg` 实现的。当然，整个效果还离不开 CSS 变换中的其他函数，比如缩放 `scale()` 。整个过渡效果的 CSS 代码如下所示：

  


```CSS
@layer transition {
    figure {
        overflow: hidden;
        
        &::after {
            opacity: 0.75;
            transform: skew(-45deg) scaleX(0);
            transition: all 0.3s ease-in-out;
        }
    
        & img {
            opacity: 1;
            transition: all 0.35s ease-in-out;
        }
    
        &:hover {
            &::after {
                backdrop-filter: blur(6px);
                transform: skew(-45deg) scaleX(1);
                transition: all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
    
            :is(h2, p) {
                transform: translate3d(0%, 0%, 0);
                transition-delay: 0.2s;
            }
    
            & h2 {
                opacity: 1;
            }
    
            & p {
                opacity: 0.7;
            }
          
            & img {
                filter: blur(1px);
                transform: scale(1.1);
                opacity: .85;
            }
        }
    }
}
```

  


也可以在这个基础上稍微加点料，可以给图片添加一个与众不同的边框效果：

  


```CSS
figure {
    &:before {
        transform: skew(2deg, 3deg);
        transition: 0.5s;
    }
    
    &:hover::before {
        transform: skew(-2deg, -3deg);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0dec27b8af2457191cb7c4f6455554d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1434&h=428&s=12936182&e=gif&f=127&b=4f4d6b)

  


> Demo 地址：https://codepen.io/airen/full/dyaGgmG

  


我们还可以使用 `skew()` 来替代 CSS 的 `box-shadow` 制作 3D 导航或按钮，除了能使你更好控制光源效果之外，其性能也将要比 `box-shadow` 更好。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93c5c6f7850645328f8749aa46bd1bc6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1664&s=590834&e=jpg&b=d1d1d1)

  


```CSS
@layer transition {
    ul {
        & a {
            background: #fff;
            box-shadow: -20px 20px 10px rgba(0, 0, 0, 0.5);
            color: #262626;
    
            transform: rotate(-30deg) skew(25deg) translate(0, 0);
            transition: all 0.5s;
    
            &::before,
            &::after {
                transform: 0.5s;
            }
    
            &::before {
                transform: rotate(0deg) skewY(-45deg);
            }
            
            &::after {
                transform: rotate(0deg) skewX(-45deg);
            }
    
            &:hover {
                transform: rotate(-30deg) skew(25deg) translate(20px, -15px);
                box-shadow: -50px 50px 50px rgba(0, 0, 0, 0.5);
                color: #fff;
                background: var(--bg);
        
                &::before {
                    background: var(--bg-before);
                }
        
                &::after {
                    background: var(--bg-after);
                }
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dc55d7689b5428eb761d6558a7f8373~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=470&s=1394747&e=gif&f=111&b=cacaca)

  


> Demo 地址：https://codepen.io/airen/full/gOqPdmN

  


在上面的示例基础上稍微调整一下，你就可以构建类似效果的 3D 导航菜：

  


```CSS
@layer transition {
    ul {
        transform: rotate(-35deg) skew(20deg, 5deg);
    
        & a {
            box-shadow: rgb(225 225 225) -0.8325em 0.8em 0px;
            transition: all 0.25s linear;
    
            &::before,
            &::after {
                transition: all 0.25s linear;
            }
    
            &::before {
                transform: skewY(-45deg);
            }
    
            &::after {
                transform: rotate(90deg) skew(0, 45deg);
            }
          
            & svg {
                transition: transform .2s ease-in-out;
            }
    
            &:hover {
                transform: translate(0.465em, -0.465em);
                transition: all 0.25s linear;
                box-shadow: rgb(225 225 225) -1.25em 1.25em 0px;
        
                &::before,
                &::after {
                    transition: all 0.25s linear;
                }
                
                & svg {
                    transform: scale(1.215);
                    transition: transform .2s ease-in-out;
                }
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9397aaf51ab04ae0b4bb9141a7db4f56~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=656&s=1124072&e=gif&f=116&b=efefef)

  


> Demo 地址：https://codepen.io/airen/full/JjxGmXq

  


我们再来看一个使用倾斜函数实现的折纸效果：

  


```HTML
<div class="card">
    <div class="folds" style="--folds: 5;">
        <div class="fold" style="--index: 1;"></div>
        <div class="fold" style="--index: 2;"></div>
        <div class="fold" style="--index: 3;"></div>
        <div class="fold" style="--index: 4;"></div>
        <div class="fold" style="--index: 5;"></div>
    </div>
</div>
```

  


```CSS
@layer animation {
    @keyframes crunch {
        50% {
            transform: scaleX(0.6);
        }
    }
  
    @keyframes odd-fold {
        50% {
            transform: skewY(15deg);
            filter: brightness(1.25);
        }
    }

    @keyframes even-fold {
        50% {
            transform: skewY(-15deg);
            filter: brightness(0.75);
        }
    }
    
    .card {
        animation: crunch 4s 1s ease-in-out infinite;
    }

    .fold {
        /* 根据总折数和当前元素位置计算出背景图位置 */
        background-position-x: calc((var(--index) - 1) / (var(--folds) - 1) * 100%);
    
        animation: 4s 1s ease-in-out infinite;
        
        &:nth-child(odd) {
            animation-name: odd-fold;
        }
        
        &:nth-child(even) {
            animation-name: even-fold;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65f7b9adf4d04ea582680129266b77d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1428&h=466&s=14798829&e=gif&f=48&b=4c486b)

  


> Demo 地址：https://codepen.io/airen/full/KKJVGLr

  


代码很简单，最为关键的部分是，每个 `.fold` 的 `background-position` 值不同，分五个部分拼成全图。然后使用 `skewY()` 函数，在奇偶数上设置不同的旋转角度，同时折起来的时候，在它父容器上使用 `scale()` 将图片缩小。即折叠时收缩，展开时放大。

  


事实上，Web 上的动画效果，使用 CSS 变换函数和过渡或帧动画，实施起来并不复杂，也不难。真正难的是创意和创新。

  


### 透视函数

  


CSS 中的透视（Perspective）是一种创建三维效果的技术，它用于模拟物体在三维空间中的深度感。透视通过改变物体的大小和位置，使物体在不同深度上产生不同的视觉效果，从而增加了 Web 中的视觉吸引力。

  


简单地说，要使 CSS 中的 3D 变换函数起作用，就得启用三维空间。在 CSS 中，我们可以通过两种方式来启用三维空间。其中一种是前面提到的 CSS 变换中的透视函数 `perspective()` ，另一种是 CSS 的 `perspective` 属性。你可能会感到困惑和疑问，为什么 CSS 会设两种不同的透视语法呢？

  


因为 `perspective()` （透视函数）和 `perspective` （透视属性）具有不同的工作方式。虽然透视本身不能单独实现三维效果（因为基本形状不能具有深度），但你可以使用变换属性将对象在三维空间中 `x` 、`y` 和 `z` 轴进行移动、旋转和缩放，然后使用透视来控制深度。

  


其中，透视函数 `perspective()` 主要用于单个元素，作为 `transform` 属性的一个值，以创建一个单一的消失点透视空间。当与 `transform` 一起使用时，它为该元素创建了三维空间。如果不使用 `perspective()` 函数，其他变换函数仍将以正交方式工作。由于透视函数作用在单个元素上，消失点将始终保持在中心位置。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5704adbbf38a44dab4c29839c3f6e641~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=570&s=3794025&e=gif&f=328&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/bGzpGZy

  


注意，这里出现了一个“**消失点**”的概念，这个概念对于 CSS 透视来说非常重要。我们稍后会介绍。我们继续回到透视函数中来。

  


正如你所预期的，使用 CSS 透视函数 `perspective()` 之后，每个元素都可以拥有自己的 3D 空间。它们围绕着自己的中心旋转，这在创建多个 3D 元素时可能会很难管理。因为它们都是独立的，所以在将它们与一组对象对齐时会产生意想不到的结果。

  


为了解决这个问题，可以在父元素上使用 CSS 的透视属性 `perspective` 启动三维空间。如此一来，你可以整体性的控制一组元素的变换，而不是单个元素，从而更容易控制它们的位置和行为。

  


CSS 透度属性 `perspective` 主要用于变换元素的父元素或容器元素。这是因为它可以在所有子元素之间保持一个单一的消失点，就像我们在实现世界中看到的一样。例如，下面这个示例，拖动透视原点（`perspective-origin`）手柄来改变它的值，你可以观察到，消失点是如何在三维空间中移动，并且变换元素会根据来自相同消失点的参考线进行对齐。

  


```HTML
<div class="boxes">
    <div class="box"></div>
    <!-- 其他 div -->
    <div class="box"></div>
</div>
```

  


```CSS
.boxes {
    perspective: var(--perspective);
    perspective-origin: var(--perspective-originX) var(--perspective-originY);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4413a38068c44817a4c6fed4887386b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=592&s=5195766&e=gif&f=414&b=484766)

  


> Demo 地址：https://codepen.io/airen/full/WNPwbyx

  


透视原点（`perspective-origin`）是一个非常重要的概念，它决定了透视变换的中心点。通过调整透视原点的位置，你可以控制变换元素在 3D 空间中的位置和对齐方式。

  


简单地说，透视属性 `perspective` 和透视原点属性 `perspective-origin` 一起控制了透视效果的深度和观察位置，允许你在创建 3D 效果时微调元素的外观。它们也是赋予动画深度的关键，就好比下面这个立方体在左右滚动以及前后移动一样。

  


```HTML
<div class="container">
    <div class="cube">
        <div class="side front">
            <img src="https://picsum.photos/800/600?random=1" alt="" />
        </div>
        <div class="side left">
            <img src="https://picsum.photos/800/600?random=2" alt="" />
        </div>
        <div class="side right">
            <img src="https://picsum.photos/800/600?random=3" alt="" />
        </div>
        <div class="side back">
            <img src="https://picsum.photos/800/600?random=4" alt="" />
        </div>
        <div class="side top">
            <img src="https://picsum.photos/800/600?random=5" alt="" />
        </div>
        <div class="side bottom">
            <img src="https://picsum.photos/800/600?random=6" alt="" />
        </div>
    </div>
</div>
```

  


```CSS
@layer animation {
    @keyframes cubeRotate {
        from {
            transform: rotateY(0deg) rotateX(720deg) rotateZ(0deg);
        }
        to {
            transform: rotateY(360deg) rotateX(0deg) rotateZ(360deg);
        }
    }

    .animated {
        animation: cubeRotate 10s linear infinite;
    }
}

@layer transform {
    .container {
        --perspective: 1000px;
        --originX: 0%;
        --originY: 100%;
        perspective: var(--perspective);
        perspective-origin: var(--originX) var(--originY);
        transition: all 0.2s ease;
    }
    
    .cube {
        transform-style: preserve-3d;
    
        .front {
            transform: translateZ(100px);
        }
    
        .back {
            transform: translateZ(-100px);
        }
    
        .left {
            transform: rotateY(90deg) translateZ(100px);
        }
    
        .right {
            transform: rotateY(-90deg) translateZ(100px);
        }
    
        .top {
            transform: rotateX(90deg) translateZ(100px);
        }
        
        .bottom {
            transform: rotateX(-90deg) translateZ(100px);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95c4d3f8ea5f487799e52904e6d2cff5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=650&s=15762970&e=gif&f=491&b=4b496a)

  


> Demo 地址：https://codepen.io/airen/full/VwgaLaZ

  


我在这个示例中添加了三个滑块，可以帮助你查看不同数值对立方体的透视效果产生的影响：

  


-   第一个滑块用于设置透视属性 `perspective` 的值。请记住，这个值设置了观察点与对象平面之间的距离，因此数值越小，透视效果越明显
-   另外两个滑块用于调整透视原点属性 `perspective-origin` 的值，`originX` 调整原点在 `x` 轴上的位置，`originY` 调整原点在 `y` 轴上的位置

  


另外，你可以点击示例中的复选框按钮，来关闭透视效果（`perspective` 的值为 `none`），整个立方体的六个面都会位置同一平面，将看不到 3D 效果。同时，你还可以点击“播放”按钮，来看立方体在 3D 空间的旋转效果。

  


这个示例所呈现的视觉效果，再次说明透视属性和透视原点的调整可以让你更好地控制立方体的外观和动态效果。

  


注意，为了实现跨浏览器兼容性，CSS 透视属性 `perspective` 还需要另一个属性，即 `transform-style` 属性。它适用于父元素或容器元素，并接受 `flat` 或 `perspective-3d` 两个值。当我们将该属性设置为 `preserve-3d` 时，它会执行两个重要的功能：

  


-   它告诉立方体的各个侧面（子元素）要在相同的 3D 空间中定位。如果不将其设置为 `preserve-3d` （取默认值 `flat`），这时各侧面会被平铺在立方体的平面内。`preserve-3d` 将立方体的透视效果“复制”给了它的子元素（各个侧面），这允许我们只需要旋转整个立方体，而不需要分别对每个侧面进行动画处理
-   它根据子元素在 3D 空间中的位置来显示它们，而不管它们在 DOM 中的位置如何

  


这意味着 `preserve-3d` 让立方体的侧面子元素具有真正的 3D 位置和旋转，使我们能够以更直观的方式进行动画效果的控制。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62b273ec2cec4a03921fe75280772398~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=586&s=5143392&e=gif&f=214&b=4a4768)

  


> Demo 地址：https://codepen.io/airen/full/bGzpdPv

  


这两种透视语法的选择取决于你的需求和设计。`perspective()` 函数适用于单个元素，而 `perspective` 属性通常用于父容器以为其中的多个子元素创建共享的透视效果。根据具体情况，你可以选择使用哪种透视语法。

  


在介绍透视的时候说过，在透视中有一个重要的概念，那就是“消失点”。为了让大家能更好的理解和掌握 CSS 变换中的透视功能，有必要花点时间向大家介绍一下这个“消失点”，以及它为什么对透视很重要。

  


消失点是透视绘画中的重要概念，无论是在艺术中还是在 CSS 的 3D 变换中。它好比地平线上的一个点，平行线似乎会在远处汇聚或消失。这个概念通常用于在二维绘画或三维环境中营造深度和距离的幻觉。

  


在艺术中，正如你所提到的，艺术家使用一条水平线来代表视线水平（也称地平线），然后在该线上选择一个单一的消失点，从那个点绘制其他对角线，以指导绘制图形。这有点像铁路或道路消失在山中的景象。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/237fab16cf7a4c76894e514c123d4ec8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=358&s=95356&e=jpg&b=bfcad4)

  


在绘制物体或场景时，现实世界中平行的线将会似乎汇聚到地平线上的这个消失点。这一技巧对于创建绘画或绘画中的透视感至关重要。

  


在 CSS 3D 变换中，消失点的概念用于确定三维空间中的对象相对于观察者视角的呈现方式。通过定义透视并指定透视原点，你可以控制三维空间内的元素如何变换，以创造深度和距离的幻觉。消失点在实现 Web 设计和动画中的逼真三维效果方面发挥着关键作用。

  


上面所描述的就是“消失点”的概念。接着再来了解一下它的重要性。

  


简单一句话说来， **“消失点”是三维绘图或三维空间的基础**。在 CSS 变换中，我们有一个称为 `perspective-origin` 属性，该属性主要用于定义透视原点的位置，这是决定 3D 变换效果的关键之一。它控制你从哪个角度或位置观察 3D 变换。

  


换句话说，CSS 的 `perspective-origin` 属性指定了观察者的位置，它被用作 `perspective` 属性的消失点。通过调整`perspective-origin`，你可以控制元素在不同方向上的视觉效果，从而实现各种有趣的 3D 效果。例如下图中的那些红线，它们在远处相交于一点。这个点就是“消失点”。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbf209a2ac324b9baf7d9be175dae5d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=724&s=15916800&e=gif&f=192&b=ececec)

  


如果没有这个“消失点”，几何图形会看起来是等轴侧的。

  


要是你觉得上面这样阐述“消失点”不易于理解，那么你只需要记住一点即可。**所谓的消失点，其实就是 3D 空间中的透视原点，即** **`perspective-origin`** **属性所指定的位置**。它的使用方式和 CSS 中的 `background-position` 相似，具体的使用方式就不在这里阐述了。

  


你也知道，CSS 中除 `perspective` 属性可以启用三维空间之外，还可以通过 `perspective()` 函数来启用三维空间。既然我们可以通过 `perspective-origin` 属性来指定 `perspective` 属性的消失点，那么也应该有相应的属性可以用来指定 `perspective()` 函数的消失点。

  


你的思考是正确的，在 CSS 变换中，如果你是通过 `perspective()` 函数启用三维空间，那么你就可以通过 `transform-origin` 来指定 `perspective()` 函数的消失点。它与 `perspective-origin` 不同之处是：

  


-   `perspective-origin` 通常与 `perspective` 属性一起使用，指定同一个场景中所有变换元素的透视原点。类似于 `perspective` 属性一样，应用于全局。正如课程前面立方体示例所展示的那样，`perspective-origin` 服务于立方体所有侧，即所有的 `.side` 元素
-   `transform-origin` 通常与 `perspective()` 属性一起使用，指定单个元素的透视原点（也常称为变换原点）

  


`transform-origin` 属性的使用很简单，和我们熟悉的 `background-position` 属性，以及 `perspective-origin` 属性是相似的。例如下面这个示例，你可以尝试调整 `transform-origin` 属性的 `x` 轴和 `y` 的值，看看它对变换带来哪些变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dd0ba6878a24e0a8af306c0366af566~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=690&s=3360163&e=gif&f=620&b=494865)

  


> Demo 地址：https://codepen.io/airen/full/mdvPPjO

注意，CSS 中的变换函数除了 `translateX()` 、`translateY()` 和 `translate()` 等 2D 相关的位移函数之外的其他变换函数，都会受 `transform-origin` 属性值的影响。

  


我们在开发 Web 或制作 Web 动画中，通过轻微使用 3D 变换，可以使你的用户界面在众多界面中脱颖而出。例如，通过透视和 CSS 变换以及其他一些 CSS 特性，我们可以创建出令人惊叹的 3D 效果。例如 3D 闪光、3D 视差、3D 翻转等效果。

  


例如下面这个 3D 闪光的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cadca8a1ab5f4fea852db029a49367cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=480&s=7405240&e=gif&f=63&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/dyaMXdz

  


卡片一开始略微倾斜，但当用户的鼠标悬停在卡片上时，它会变得平稳一些，同时会在表面有一道亮光滑过。这种效果既可以给用户界面增添一些逼真感，而又不会过于复杂。示例中的倾斜效果就是使用 3D 变换中的透视和旋转来实现的：

  


```CSS
@layer transform {
    figure {
        --a: 8deg; /* 控制旋转角度，越小效果越佳 */
        transform: 
            perspective(400px)
            rotate3d(var(--r, 1, -1), 0, calc(var(--i, 1) * var(--a)));
    
        transition: 0.4s;
    
        &:hover {
            --i: -1;
        }
    
        &:nth-child(2) {
            --r: 1, 1;
        }
    }
}
```

  


示例中，使用透视函数 `perspective()` 为卡片添加了一点不平衡，并且通过 `rotate3d()` 函数允许卡片绕其指定的轴进行旋转，在这里将 `z` 轴设为 `0` ，并在 `x` 轴和 `y` 轴使用 `1` 或 `-1` 。为了简化代码，这里使用了 [CSS 的自定义属性](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)，鼠标悬停到卡片上（`:hover`）时更换旋转角度的值。角度的值的变更，直接交给了 `calc()` 函数完成。通过将度数值（`--a`）乘以 `1` （由 `--i` 自定义属性定义），我们默认得到旋转角度是 `8deg` 。然后，我们在 `:hover` 状态下将 `--i` 自定义属性的值更改变 `-1` ，这样就重新得到旋转角度值是 `-8deg` 。

  


注意，示例中的亮光滑过是通过[ CSS 的遮罩特性](https://juejin.cn/book/7223230325122400288/section/7259668885224456252)（`mask`）完成的，在这里就不做过多阐述了。

  


在此基础上，你还可以给卡片上的缩略图（`img`）添加变换效果，使整个效果看上去更具深度和动感：

  


```CSS
@layer transform {
    figure {
        --a: 8deg;
        transform: 
            perspective(400px)
            rotate3d(var(--r, 1, -1), 0, calc(var(--i, 1) * var(--a)));
    
        transition: 0.4s;
    
        & img {
            --f: 0.1;
            --_f: calc(100% * var(--f) / (1 + var(--f)));
            --_a: calc(90deg * var(--f));
            transform: perspective(1200px) var(--_t, rotateY(var(--_a))) scale(1.2);
            transition: 0.5s;
        }
    
        &:hover {
            --i: -1;
    
            & img {
                --_t: 
                    translateX(calc(-1 * var(--_f))) 
                    rotateY(calc(-1 * var(--_a)))
                    scale(1.35);
            }
        }
    
        &:nth-child(2) {
            --r: 1, 1;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de7713051bf1407eb6abf4a541e4ac2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=444&s=9585812&e=gif&f=58&b=0c0c0b)

  


> Demo 地址：https://codepen.io/airen/full/VwgaKwx

  


在这两个示例中，旋转的方向是有一定的局限性的。你可以通过简单的几行 JavaScript 代码和 CSS 自定义属性结合起来，使得旋转的角度能随鼠标位置动态调整：

  


```CSS
@layer transform {
    figure {
        --rotateX: 0.03deg;
        --rotateY: 3deg;
        transform: 
            perspective(400px) 
            rotateY(var(--rotateY))
            rotateX(var(--rotateX));
        transition: 0.4s;
    
        & img {
            --f: 0.1;
            --_f: calc(100% * var(--f) / (1 + var(--f)));
            --_a: calc(90deg * var(--f));
            transform: 
                perspective(1200px) 
                var(--_t, rotateY(var(--_a))) 
                scale(1.2);
            transition: 0.5s;
        }
    
        &:hover {
            & img {
                --_t: 
                    translateX(calc(-1 * var(--_f))) 
                    rotateY(calc(-1 * var(--_a)))
                    scale(1.35);
            }
        }
    }
}
```

  


使用 JavaScript 监听鼠标移动事件，然后动态改变 `--rotateY` 和 `--rotateX` 自定义属性的值，使得你移动鼠标时，卡片旋转效果会随鼠标移动而不同：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e442e7344cea4e19806a9d5ccf070360~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=978&h=416&s=10655562&e=gif&f=116&b=ede5e3)

  


> Demo 地址：https://codepen.io/airen/full/qBgZqrG

  


使用 CSS 的透视功能，还可以实现 3D 视差效果。比如下面这个示例，鼠标悬浮在卡片上，卡片上的文字和背景之间看上去有一个距离感：

  


```CSS
@layer transform {
    .card {
        --rotateY: 3deg;
        --rotateX: 0.1deg;
        --translateX: 3px;
        --translateY: 4px;
        transform: perspective(400px) rotateX(var(--rotateX)) rotateY(var(--rotateY));
        transform-style: preserve-3d;
        transition: all 0.4s;
    
        & img {
            transform: translateX(var(--translateX)) translateY(var(--translateY));
            transform-style: preserve-3d;
            transition: all 0.4s 0.05s;
        }
    
        .card__content {
            transition: all 0.4s 0.02s;
            transform: perspective(400px) translateZ(80px) scale(0.8) rotateY(var(--rotateY));
            transform-style: preserve-3d;
        }
    
        &:hover {
            transition: all 0.4s;
    
            & img {
                transform: perspective(400px) translateX(var(--translateX)) translateY(var(--translateY)) scale(1.035) translateZ(-50px);
                transition: all 0.4s;
            }
    
            .card__content {
                transform: perspective(400px) translateZ(100px) scale(0.85) rotateX(var(--rotateX));
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1b98f2306f84de4953f877a9fb5a105~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=494&s=8941299&e=gif&f=89&b=f4eeee)

  


> Demo 地址：https://codepen.io/airen/full/dyaMNJR

  


使用相似的技术，你将制作出更炫酷的悬浮视差效果，例如下面这个由 [@Gayane Gasparyan 提供的效果](https://codepen.io/gayane-gasparyan/full/wvxewXO)：

  


```CSS
@layer transform {
    .card {
        perspective: 2500px;
    
        .wrapper {
            transition: all 0.5s;
          
            &::before,
            &::after {
                transition: all 0.5s;
            }
        }
    
        .title {
            transition: transform 0.5s;
        }
        
        .character {
            opacity: 0;
            transition: all 0.5s;
        }
    
        &:hover {
            .wrapper {
                transform: perspective(900px) translateY(-5%) rotateX(25deg) translateZ(0);
                box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
                
                &::before {
                    opacity: 1;
                }
                
                &::after {
                    height: 120px;
                }
            }
    
            .title {
                transform: translate3d(0%, -50px, 100px);
            }
            
            .character {
                opacity: 1;
                transform: translate3d(0%, -30%, 100px);
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4877f716225e4f75aadb57f45c381b54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=500&s=6093704&e=gif&f=167&b=171723)

  


> Demo 地址：https://codepen.io/airen/full/gOqrRzK （来源于 [@Gayane Gasparyan](https://codepen.io/gayane-gasparyan/full/wvxewXO) ）

  


我们还可以使用透视和变换来制作一些 3D 交互式（可翻转）的卡片。这些效果也非常适用于各种不同的用途，例如银行卡、纸牌或个人页面的 UI。

  


构建翻转类的 UI，你可以根据下面这样的模板来编写所需的 HTML 结构：

  


```HTML
<div class="container">
    <div class="front side">
        <div class="content">
            <!-- 前面的内容 -->
        </div>
    </div>
    <div class="back side">
        <div class="content">
            <!-- 背面的内容 -->
        </div>
    </div>
</div>
```

  


关键的 CSS ：

  


```CSS
@layer transform {
    .container {
        transition: 1.5s ease-in-out;
        transform-style: preserve-3d;
        backface-visibility: visible;
        
        .side {
            transform-style: preserve-3d;
            backface-visibility: hidden;
          
            &.back {
                transform: rotateY(180deg);
            }
        }
        
        .content {
            transform: translatez(70px) scale(0.8);
        }
    
        &:hover {
            transform: rotateY(180deg);
        }
    }
}
```

  


使用 `rotateY(180deg)` 函数将 `.back` 容器沿着 `y` 轴旋转 `180deg` ，使其位置 `.front` 容器的后面，同时使用 `backface-visibility` 属性，在创建翻转或旋转效果时控制元素的背面是否可见。这在创建卡片翻转、3D按钮等互动元素时非常有用。在这个示例中，可以在 `.back` 容器上设置 `backface-visibility` 为 `hidden`，以确保用户在卡片背面时看不到卡片的正面内容。

  


为了让内容和背景之间有一个深度感，示例中在 `.content` 上使用 `translateZ()` 函数来实现，使其沿着 `z` 轴向前移动，同时通过 `scale()` 函数将其略微缩小一点。

  


最后在卡片悬停状态时，依旧使用 `rotateY()` 函数将整个卡片沿着 `y` 轴旋转 `180deg` ，这样一来，正面的被微转到背后，背面同时被翻转到前面。最终你将看到像下图这样一个 3D 翻转的卡片效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39f2ac8bb8314d829070ce35377b7b3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=578&s=12864503&e=gif&f=174&b=0d0d0d)

  


> Demo 地址：https://codepen.io/airen/full/xxMVrVw

  


有了上例这样的一个模板，你只需要改更 `.content` 中的内容，你就可以轻易实现任意想要翻转的卡片 UI。例如下面这个个人名片的示例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6411e922ccb64677ba8c1b48109d2e0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=520&s=3924239&e=gif&f=137&b=4c486b)

  


> Demo 地址：https://codepen.io/airen/full/gOqrBvw

  


使用 3D 变换，你还可以制作一些小游戏，[比如摇骰子的游戏](https://codepen.io/jico/full/wvMpgog)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9bbbf98ca7d40a5bb6cdd17e8d4bc39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=518&s=746023&e=gif&f=115&b=2c2c2c)

  


> Demo 地址：https://codepen.io/airen/full/vYbGQZZ （来源于 [@jico](https://codepen.io/jico/full/wvMpgog) ）

  


结合 [CSS 的滚动驱动动效特性](https://juejin.cn/book/7223230325122400288/section/7259272255786450981)，还可以制作出更有创意的动画效果，例如下面这个由 [@Ana Tudor 提供的“纯 CSS 滚动触发图像显示和缩放”的动画效果](https://codepen.io/thebabydino/full/XWywJMW)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2299c444f5f4ae7a4aed0ce82f14323~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=532&s=9789764&e=gif&f=78&b=111111)

  


> Demo 地址：https://codepen.io/airen/full/ExrKOoV （来源于 [@Ana Tudor](https://codepen.io/thebabydino/full/XWywJMW) ）

  


### 矩阵函数

  


CSS 中的变换函数除了上面所提到的函数之外，它还有两个矩阵相关的函数：2D 矩阵函数 `matrix()` 和 3D 矩阵函数 `matrix3d()` 。它们的语法如下：

  


```
matrix()   = matrix(a, b, c, d, e, f)
matrix3d() = matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
```

  


-   `matrix()` 函数用于 2D 变换，接受六个参数 `a`, `b`, `c`, `d`, `e`, 和 `f`，分别代表矩阵的各个元素。这个矩阵可以执行平移、旋转、缩放和倾斜等操作。
-   `matrix3d()` 函数用于 3D 变换，接受 `16` 个参数 `a1` 到 `d4`，代表一个 `4x4` 的矩阵，用于执行复杂的 3D 变换。

  


这两个函数的详细工作原理需要涉及线性代数和矩阵变换的知识，通常情况下，它们比常见的变换函数更复杂，但也更灵活。你可以使用[在线矩阵变换计算器](https://ramlmn.github.io/visualizing-matrix3d/)来生成适当的矩阵值，以实现复杂的变换效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c9f0e2d9a4746ac8fe35ac8cdfb8f00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=752&s=1969756&e=gif&f=229&b=fafafa)

  


> 3D 矩阵在线生成计算器：https://ramlmn.github.io/visualizing-matrix3d/

  


注意，由于变换中的矩阵函数涉及较多的线性代数相关的知识，这已超出这节课的范畴，因此我们不在这里做过多的阐述。

  


## 多个变换的组合

  


我们在使用 CSS 变换 `transform` 时，可以通过使用空格将多个变换函数组合在一起，以执行多个变换操作。这意味着你可以在一个元素上依次应用多个变换，创造出更复杂的效果。例如，你可以这样组合多个变换函数：

  


```CSS
.element {
    transform: translate(50px, 50px) rotate(45deg) scale(1.5);
}
```

  


在上面的例子中，`transform` 属性将首先执行平移，然后执行旋转，最后执行缩放。这些操作将按照给定的顺序依次应用在元素上。这样，你可以创造出精确的视觉效果，如平移后旋转再缩放的动画。通过组合不同的变换函数，你可以实现各种有趣的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/277fd0355e15498d863689cfeea4e862~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=596&s=687857&e=gif&f=159&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/bGzpObJ

  


正如你所看到的，我们可以将多个变换函数串联到 `transform` 属性上（多个变换函数之间用空格符分隔）。但在使用多个变换时，有三个非常重要的事项需要考虑：

  


-   旋转对象时，其坐标系也会随着对象一起变换（旋转）
-   平移对象时，它相对于自己的坐标系移动（而不是相对于其父元素的坐标系）
-   变换属性的值顺序很重要，这些值的顺序可以（而且将）改变最终结果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31305dcdbf8a4ee6a02b29140815a4d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=486&s=1120544&e=gif&f=64&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/RwvaEgq

  


为了强调 `transform` 属性值的顺序对它的重要性，从 [W3C 的规范中](https://www.w3.org/TR/css-transforms-1/#transform-rendering)，我们可以获知，变换函数（`translate()` 、`rotate()` 等）是从左向右应用的，即**从左到右乘以变换属性中的每个变换函数**。让我们快速看一下两个简单的 2D 变换示例。这两个正方形具有相同的 `transform` 值，但以不同的顺序声明。你可以拖动示例中的滑块，查看它们颠倒顺序会发生什么：

  


```CSS
.element {
    transform: translate(-59px , -82px) scale(1) rotate(115deg);
}

.element {
    transform: rotate(115deg) scale(1) translate(-59px , -82px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29a1bb4bc4534eb9923ef67f96f99950~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=432&s=1500061&e=gif&f=230&b=464562)

  


> Demo 地址：https://codepen.io/airen/full/wvNGRXv

  


CSS 变换 `transform` 值的顺序对于 Web 动画效果也是很重要的。例如下面这个示例，我们希望链接元素 `a` 能围绕着 `.circle` 元素旋转，有点类似月亮围绕着行星轨道运行的效果。要是 `transform` 值顺序搞错了，整个效果将是千差万别：

  


```HTML
<div class="circle">
    <div class="center">🎅</div>
    <a href="#">🎁</a>
</div>
```

  


```CSS
@layer animation {
    @keyframes orbit {
        from {
            transform: rotate(0deg) translateX(var(--radius));
        }
        to {
            transform: rotate(360deg) translateX(var(--radius));
        }
    }

    @keyframes orbit2 {
        from {
            transform:translateX(var(--radius)) rotate(0deg) ;
        }
        to {
            transform:translateX(var(--radius)) rotate(360deg) ;
        }
    }

    .circle {
        & a {
            animation: orbit 6000ms linear infinite;
        }
        
        &:nth-child(2) a {
            animation: orbit2 6000ms linear infinite;
        }
    }
}
```

  


上面代码中 `orbit` 和 `orbit2` 的关键帧什么都相同，唯一区别就是 `transform` 属性值顺序之间的差异。但最终给我们呈现出来的效果呢？只有 `orbit` 帧动画才是我们期望的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/150a1c9651614916ac755656a6480247~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=538&s=978827&e=gif&f=91&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/MWLyxjx

  


## CSS 变换的局限性

  


我想你对 CSS 的 `transform` 有一定的认识了。但为了让大家能更好的理解单个变换属性的好处，我们先一起来看看 `transform` 属性的局限性。

  


前面说过，CSS 的 `transform` 属性可以使用单个或多个变换函数。例如：

  


```CSS
.element {
    transform: rotate(45deg);
}
```

  


上面代码中的 `transform` 可以很好的工作，元素会基于其中心位置旋转 `45deg` 。

  


我们在实际开发的过程中，可能会在元素不同状态下应用不同的变换。比如上面这个示例，元素默认状态有一个旋转效果（`rotate(45deg)`），当用户将鼠标悬停在元素上时，希望在旋转效果的基础上叠加一个放大的效果，例如 `scale(1.5)` 。如果你像下面这样编写 CSS 的话，最终效果和你期望的有所不同：

  


```CSS
.element {
    transform: rotate(45deg);
    
    &:hover {
        transform: scale(1.5);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f8f8991fe9f4782ac85f95a0d48b806~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=548&s=415187&e=gif&f=136&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYxZXRq

  


不难发现，当用户鼠标悬浮在元素上时，只有放大的效果，而原本的旋转效果被丢失了。这是因为 `:hover` 状态下的 `transform` 覆盖了默认状态下的 `transform` 。如果要改变这一现象，我们不得不在 `:hover` 状态下保留 `transform` 属性的初始值：

  


```CSS
.element {
    transform: rotate(45deg);
    
    &:hover {
        transform: rotate(45deg) scale(1.5);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0850fa6de8a84a698718ac5cef238cdd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=500&s=362953&e=gif&f=77&b=4a4969)

  


上面示例还不算复杂，因为 `transform` 使用的是单一值，可实际开发的过程中，`transform` 属性会同时使用多个变换函数，例如：

  


```CSS
.element {
    transform: scale(1.5) translate(0, 50%) rotate(90deg);
}
```

  


同样的，如果我们想在悬浮状态（`:hover`）调整缩放量，我们不得不要像下面这样编写 CSS 代码：

  


```CSS
.element {
    transform: scale(1.5) translate(0, 50%) rotate(90deg);
    
    &:hover {
        transform: scale(.5) translate(0, 50%) rotate(90deg);
    }
}
```

  


元素在悬浮状态下，为了在不丢失平移（`translate(0, 50%)`）和旋转（`rotate(90deg)`）值的情况下缩小，我们不得不把它们复制过来与更新的缩放值（`scale(.5)`）一起使用。

  


对于单个悬浮状态，这可能不是太大的负担。但随着变换的增长或创建多帧动画时，这就会变得很复杂。这样的场景在实际生产中也是很常见。

  


假设你正在开发一个模态框（Modal）组件，使用 `transform` 让模态框在浏览器视窗中水平垂直居中：

  


```CSS
.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80fad2bfdd644f7181c84ad36742568f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=512&s=3240259&e=gif&f=125&b=676689)

  


它可以很好的工作。但是，有一个新的需求，需要给模态框添加一个 `bounceInDown` 的动效：

  


```CSS
@layer modal {
    @keyframes bounceInDown {
        from,
        60%,
        75%,
        90%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
    
        0% {
            opacity: 0;
            transform: translate3d(0, -3000px, 0) scaleY(3);
        }
    
        60% {
            opacity: 1;
            transform: translate3d(0, 25px, 0) scaleY(0.9);
        }
    
        75% {
            transform: translate3d(0, -10px, 0) scaleY(0.95);
        }
    
        90% {
            transform: translate3d(0, 5px, 0) scaleY(0.985);
        }
    
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: bounceInDown 0.28s cubic-bezier(0.215, 0.61, 0.355, 1) both;
    }
}
```

  


你会发现，添加 `bounceInDown` 动效之后的模态框，在动效结束时，它的位置也被改变了，并没有在浏览器视窗中水平居中：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c6f57fe9e0b48039a4beea33abd8915~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=622&s=3177372&e=gif&f=114&b=6f6e91)

  


是因为运用于模态框的 `transform` 并不是最初设置的值（`transform: translate(-50%,-50%)`），而是被 `@keyframes` 中最后一帧的 `transform` 属性值（`translate3d(0,0,0)`）覆盖了。如果要让添加了 `bounceInDown` 动效的模态框，在动效结束之后依旧在浏览器视窗中水平垂直居中，我们不得不改变水平垂直居中的布局方案，或者调整 `bounceInDown` 动画中每一帧的 `transform` 的值，例如：

  


```CSS
@layer modal {
    @keyframes bounceInDown {
        from,
        60%,
        75%,
        90%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
    
        0% {
            opacity: 0;
            transform : translate3d (- 50% , calc (- 3000px - 50% ), 0 ) scaleY ( 3 );
        }
    
        60% {
            opacity: 1;
            transform : translate3d (- 50% , calc ( 25px - 50% ), 0 ) scaleY ( 0.9 );
        }
    
        75% {
            transform : translate3d (- 50% , calc (- 10px - 50% ), 0 ) scaleY ( 0.95 );
        }
    
        90% {
            transform : translate3d (- 50% , calc ( 5px - 50% ), 0 ) scaleY ( 0.985 );
        }
    
        to {
            transform : translate3d (- 50% , - 50% , 0 );
        }
    }
    
    dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: bounceInDown 0.28s cubic-bezier(0.215, 0.61, 0.355, 1) both;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b3c5bfcc3d447149a872537852ac397~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=514&s=3678850&e=gif&f=139&b=676689)

  


> Demo 地址：https://codepen.io/airen/full/mdvPoBB

  


这对于 Web 开发者来说是痛苦的，而且也是易于出错的。

  


CSS 变换的另一个局限性就是多个变换函数的组合使用，出现在 `transform` 属性的变换函数的顺序决定着最终的变换效果。这也增加了变换使用的成本，尤其是在复杂的场景之中。这也意味着，随着变换变得越来越复杂，使用的变换函数也越来越多，管理 `transform` 属性就变得越来越困难。

  


## 单个变换

  


W3C 的 **[CSS 变换模块 Level 2](https://www.w3.org/TR/css-transforms-2/)** （CSS Transforms Module Level 2）为 CSS 的变换新增了一个特性，即**[单个变换属性](https://www.w3.org/TR/css-transforms-2/#individual-transforms)**。单个变换属性主要包括 `translate` 、`rotate` 和 `scale` 三个属性，分别映射 `transform` 属性的 `translate()` 、`rotate()` 和 `scale()` 三个函数。

  


在 CSS 中使用这些单个变换属性，会让 Web 开发者有一种宾至如归的感觉。比如下面这个示例，它们最终的结果是一样的：

  


```CSS
.transform {
    transform: translate(100px, 100px) rotate(45deg) scale(2);
}

.individual--transform {
    translate: 100px 100px;
    rotate: 45deg;
    scale: 2;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21ba7dd0ce7e4eb298bf26a1a517c9cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=799&s=56354&e=jpg&b=555674)

  


正如你所看到的，使用 `transform` 和单个变换属性最终效果都是一样的，即元素做了一次平移，一次旋转和一次缩放。但相对而言，单个变换属性要比 `transform` 属性使用组合值要好得多。其中一个原因是方便，Web 开发者不是总在一个 `transform` 中包含所有内容。对于某些代码库，这可能更清晰或更具可读性。除此之外，单个变换属性是相互独立的，Web 开发者可以按自已认为合适的方式来自由地组合那些不同的变换属性。例如：

  


```CSS
.element {
    translate: 100px 100px;
    rotate: 45deg;
    scale: 1.1;
}

/* 等同于 */
.element {
    rotate: 45deg;
    scale: 1.1;
    translate: 100px 100px;
}
```

  


当然，Web 开发者同样可以使用单个变换属性构建出复杂的动画效果，并且省去了不少的麻烦。简单地说，使用单个变换属性好处总比使用 `transform` 属性好得多。

  


单个变换属性 `translate` 、`scale` 和 `rotate` 使用也很简单。首先来看 `translate` 属性的使用。

  


`translate` 属性也可以接受 `1 ~ 3` 个值，每个值按照 `x` 、`y` 和 `z` 轴的顺序指定平移值。

  


-   当 `translate` 属性指定一个值时，它的工作原理和 `translate()` （或 `translateX()`）函数一样，元素会沿着 `x` 轴平移。当 `translate` 属性指定的值大于 `0` 时，元素将沿着 `x` 轴向右平移，反之它将沿着 `x` 轴向左平移
-   当 `translate` 属性指定两个值时，它的工作原理和 `translate(x, y)` 函数一样，元素会同时沿着 `x` 轴和 `y` 轴平移。其中第一个值指定 `x` 轴的平移量，第二个值指定 `y` 轴的平移量。如果 `x` 轴的值大于 `0` ，元素将沿着 `x` 轴向右平移，反之将沿着 `x` 轴向左平移；如果 `y` 轴的值大于 `0` ，元素将沿着 `y` 向下平移，反之将沿着 `y` 轴向上平移
-   当 `translate` 属性指定三个值时，它的工作原理和 `translate3d(x, y, z)` 函数一样。第一个值指定 `x` 轴的平移量，第二个值指定 `y` 轴的平移量，第三个值指定 `z` 轴的平移量。如果 `x` 轴的值大于 `0` ，元素将沿着 `x` 轴向右平移，反之将沿着 `x` 轴向左平移；如果 `y` 轴的值大于 `0` ，元素将沿着 `y` 轴向下平移，反之将沿着 `y` 轴向上平移；如果 `z` 轴的值大于 `0` ，元素将沿着 `z` 轴平移，离用户眼睛越来越近，元素有放大的效果，反之元素离用户的眼睛越来越远，元素有缩小的效果

  


注意，当 `translate` 属性缺少第二个或第三个值时，它们默认为 `0px` 。

  


```CSS
/* 一个值 */
.translate {
    translate: 100px; /* x = 100px, y = 0, z = 0 */
    
    /* 等同于 */
    transform: translate(100px);
    
    /* 也等同于 */
    transform: translateX(100px);
}

/* 两个值 */
.translate {
    translate: 100px 200px; /* x = 100px, y = 200px, z = 0 */
    
    /* 等同于 */
    transform: translate(100px, 200px);
}

/* 三个值 */
.translate {
    translate: 100px 200px 50px; /* x = 100px, y = 200px, z = 50px */
    
    /* 等同于 */
    transform: translate3d(100px, 200px, 50px);
}
```

  


`scale` 属性接受 `1 ~ 3` 个值，每个值按照 `x` 、`y` 和 `z` 轴的顺序来指定缩放比例：

  


-   当 `scale` 只设置了一个值时，那么 `x` 轴和 `y` 轴的缩放比例值相同
-   当 `scale` 设置了两个值时，那么第一个值指定 `x` 轴缩放比例，第二个值指定 `y` 轴的缩放比例
-   当 `scale` 设置了三个值时，那么第一个值指定 `x` 轴的缩放比例，第二个值指定 `y` 轴的缩放比例，第三个值指定 `z` 轴的缩放比例

  


注意，如果未给出 `z` 轴的值，则默认为 `1` 。

  


如果 `scale` 属性未显式设置第三个值（省略第三个值 `1` 或 `100%`），那么 `scale` 指定 2D 缩放，相当于 `scale()` 函数；否则，`scale` 指定一个 3D 缩放，相当于 `scale3d()` 函数。只不过，省略第三个值与设置第三个值为 `1` 或 `100%` 最终结果没有区别。

  


```CSS
/* 指定一个值 */
.scale {
    scale: 2; /* x = y = 2, z = 1*/
    
    /* 等同于 */
    transform: scale(2);
}

/* 指定两个值 */
.scale {
    scale: 2 .5; /* x = 2, y = .5, z = 1*/
    
    /* 等同于 */
    transform: scale(2, .5);
}

/* 指定三个值 */
.scale {
    scale: 1.2 2 .5; /* x = 1.2, y = 2, z = .5*/
    
    /* 等同于 */
    transform: scale3d(1.2, 2, .5);
}
```

  


相对而言，旋转 `rotate` 属性的使用要比缩放 `scale` 和平移 `translate` 属性复杂一些。`rotate` 属性接受一个角度来旋转元素，也可以接受一个轴来旋转元素：

  


```
rotate: none | <angle> | [ x | y | z | <number>{3} ] && <angle>
```

  


-   当 `rotate` 属性只指定一个角度值（`<angle>`），它的工作原理就像 `rotate()` （或 `rotateZ()`）函数，元素围绕着 `z` 轴旋转指定的角度
-   当 `rotate` 属性同时指定一个轴（可以是 `x` 、`y` 或 `z` 任一轴）和一个角度值（`<angle>`），那么元素将会围绕着指定的轴旋转对应的角度。其中第一个值为指定的轴，第二个值为旋转的角度值。如果指定的轴是 `x` 轴，那么它的工作原理和 `rotateX()` 函数相同；如果指定的轴是 `y` 轴，那么它的工作原理和 `rotateY()` 函数相同，如果指定的轴是 `z` 轴，那么它的工作原理和 `rotateZ()` 函数相同
-   当 `rotate` 属性指定了三个数字和一个角度值（`<angle>`），它的工作原理就像 `rotate3d()` ，其中给出的三个数字表示以原点为中心的向量的 `x` 、`y` 和 `z` 分量（即每个轴上应用的旋转程度），第四个角度值是旋转的角度

  


```CSS
.rotate {
    rotate: 45deg;
    
    /* 等同于 */
    transform: rotate(45deg);
    
    /* 也等同于*/
    transform: rotateZ(45deg);
}

.rotate {
    rotate: x 45deg;
    
    /* 等同于 */
    transform: rotateX(45deg);
}

.rotate {
    rotate: y 45deg;
    
    /* 等同于 */
    transform: rotateY(45deg);
}

.rotate {
    rotate: z 45deg;
    
    /* 等同于 */
    transform: rotateZ(45deg);
}

.rotate {
    rotate: 0 1 1.5 90deg;
    
    /* 等同于 */
    transform: rotate3d(0, 1, 1.5, 90deg);
}
```

  


知道了如何使用 `scale` 、`translate` 和 `rotate` 属性之后，我们一起来看看它们给 Web 开发者带来哪些益处？

  


在介绍 `transform` 属性的时候，我们有说过，[元素在不同状态下可能会设置不同的变换函数](https://codepen.io/airen/full/GRPJawq)。例如：

  


```CSS
.element {
    transform: rotate(45deg);
    
    &:hover {
        transform: rotate(45deg) scale(1.5);
    }
}
```

  


元素在悬浮状态下，Web 开发者不得不复制变换的初始值（`rotate(45deg)`），否则悬浮状态下的 `transform` 属性将会覆盖元素最初设置的 `transform` 属性的值。

  


有了单个变换属性之后，这一切就显得容易而且清晰多了。例如：

  


```CSS
.element {
    rotate: 45deg;
    
    &:hover {
        scale: 1.5;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f9329b4e3ed49b98c161a26da85df27~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=944&h=528&s=334288&e=gif&f=67&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/wvNGOXE

  


其次，单个变换属性和 CSS 的 `transform` 属性有一个关键性的区别，那就是单个变换属性对于顺序不是那么的重要，即顺序不是声明它们的顺序，它们的顺序总是相同的：**首先平移（向外），然后旋转，然后缩放（向内）** 。

  


这意味着，下面两个代码片段最终的结果是相同的：

  


```CSS
.transform--individual {
    translate: 50% 0;
    rotate: 30deg;
    scale: 1.2;
}

.transform--individual-alt {
    rotate: 30deg;
    translate: 50% 0;
    scale: 1.2;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a17e90e20af94e8ba4c03fa261af9a64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=763&s=56557&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/xxMVBJE

  


在这两种情况下，目标元素将首先沿着 `x` 轴向右平移 `50%` ，然后旋转 `30deg` ，最后放大 `1.2` 倍。

  


单个变换属性还有一个优势是，使得 Web 开发者开发动效时变得更简单，更清晰。例如，你要给目标元素添加下面这样的一个动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/695d6a4f39fe44158f1ea670de6ae030~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=1036&s=50022&e=jpg&b=f7f7f7)

  


在没有单个变换属性之前，使用 `transform` 属性的 `translate()` 、`rotate()` 和 `scale()` 函数实现这个动画，就必须计算所有定义的变换的中间值，并在每个关键帧中包含它们：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6fb338a04cf4e3ebcdcae24de5c2740~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=718&s=56295&e=jpg&b=f7f7f7)

  


如上图右侧关键帧示意图所示，如果要在时间轴的 `10%` 位置旋转元素，其他变换的值也必须计算，例如 `translateX(10%)` 、`scale(1.2)` 等，因为 `transform` 属性需要所有变换函数的值。这一点在介绍 `transfrom` 属性的局限性时也着重阐述过。简单地说，使用 `transform` 属性组合多个变换函数，会使得 `@keyframes` 变得很复杂，也易于弄错。

  


```CSS
@keyframes animation {
    0% {
        transform: translateX(0%) rotate(0deg) scale(1);
    }
    
    5% {
        transform: translateX(5%) rotate(90deg) scale(1.2);
    }
    
    10% {
        transform: translateX(10%) rotate(180deg) scale(1.2);
    }
    
    90% {
        transform: translateX(90%) rotate(180deg) scale(1.2);
    }
    
    95% {
        transform: translateX(95%) rotate(270deg) scale(1.2);
    }
    
    100% {
        transform: translateX(100%) rotate(360deg) scale(1);
    }
} 

.animation {
    animation: animation 2s linear both;
}
```

  


有了单个变换属性之后，编写动画帧 `@keyframes` 就要容易得多了，也不至于出错了。因为你不需要在每个关键帧都编写所有的变换，也不需再担心变换顺序影响最终的变换结果。

  


```CSS
@keyframes animation {
    /* 元素平移的效果 */
    0% {
        translate: 0%;
    }
    
    100% {
        translate: 100%
    }
    
    /* 元素旋转的效果 */
    0% {
        rotate: 0deg;
    }
    
    10%, 90% {
        rotate: 180deg;
    }
    
    100% {
        rotate: 360deg;
    }
    
    /* 元素缩放的效果*/
    0% {
        scale: 1;
    }
    
    5%, 95% {
        scale: 1.2;
    }
    
    100% {
        scale: 1;
    }
}

.animation {
    animation: animation 2s linear both;
}
```

  


为了使代码模块化，我们可以将每个子动画（比如 `translate` 、`rotate` 和 `scale` ）分成独立的 `@keyframes` 。换句话说，将 `translate` 、`rotate` 和 `scale` 放到单独的 `@keyframes` 中，然后再使用 `animation` 引用它们。

  


```CSS
@keyframes translate {
    0% {
        translate: 0%;
    }
    100% {
        translate: 100%;
    }
}

@keyframes rotate {
    0% {
        rotate: 0deg;
    }
    
    10%, 90% {
        rotate: 180deg;
    }
    
    100% {
        rotate: 360deg;
    }
}

@keyframes scale {
    0% {
        scale: 1;
    }
    
    5%, 95% {
        scale: 1.2;
    }
    
    100% {
        scale: 1;
    }
}

.animation {
    animation: 
        translate 2s linear both,
        rotate 2s linear both,
        scale 2s linear both;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a512fc28a8d24132b6107e73bf43b945~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=464&s=500661&e=gif&f=104&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/BaMKbOO

  


上面我们看到的是单个变换属性带来的优势。其实，它也有一定的局限性。

  


单个变换属性 `translate` 、`rotate` 和 `scale` 不能像 `transform` 属性那样接受组合值，所以单个变换属性在元素上只能使用一次。例如：

  


```CSS
.translate {
    translate: 30px;
    translate: 40px;
    translate: 50px;
}

.transform {
    transform: 
        translate(30px)
        translate(40px)
        translate(50px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f57e7e483ebd413690879788d8cdb180~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=575&s=59631&e=jpg&b=555774)

  


正如你所看到的，相同的单个变换属性同时出现在一个元素上时，会根据 CSS 的级联规则，出现在后面的属性会覆盖前面的。但 `transform` 属性中不会存在该现象，因为 `transform` 属性允许出现多个变换函数的组合值，相同的变换函数也是一样，当相同的变换函数出现在 `transform` 属性上时，它们会做加法计算。也就是说，当你想要给元素添加多个变换属性时，你需要使用 `transform` 属性。例如，你需要实现下面这样的一个变换效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f925b0ca443471589d33ccf86c606ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=558&s=6624755&e=gif&f=264&b=eff6f8)

  


如果使用单个变换属性是无法实现上图所示的变换效果，因为最后一个 `translate` 会覆盖第一个 `translate` 属性，代码如下所示：

  


```CSS
.element {
    translate: 66vmin;
    rotate: .125turn;
    scale: .5;
    translate: 66vmin; 
}
```

  


在此情况之下，你只能使用 `transform` 属性来实现：

  


```CSS
.element {
    transform: translateX(66vmin) rotate(.125turn) scale(.5) translateX(66vmin);
}
```

  


另外有两点需要注意。

  


当单个变换属性 `translate` 、`rotate` 、`scale` 和 CSS 的 `transform` 属性同时使用时，它们会涉及到一个计算过程：“**单个变换属性首先会被应用（** **`translate`** **，** **`rotate`** **，然后** **`scale`** **），最后应用** **`transform`**”。

  


当单个变换属性、`transform` 和 `offset` 一起对一个元素进行平移、旋转、缩放等操作时，三个新的独立变换属性（`translate` 、`rotate` 和 `scale` ）发生在 `offset` 属性之前，`transform` 属性则会应用在 `offset` 属性之后：

  


-   ①: `translate`
-   ②：`rotate`
-   ③：`scale`
-   ④：`offset` （距离 、锚定和旋转）
-   ⑤：`transform` （按指定顺序应用函数）

  


即：“`translate` ➟ `rotate` ➟ `scale` ➟ `offset` ➟ `transform`”。[在定义如何计算变换矩阵的规范中对这方面有详细的阐述](https://www.w3.org/TR/css-transforms-2/#ctm)。

  


> 注意，单个变换属性是现代 CSS 的一个新特性，它也称得上是一个独立的知识点，如果你对该特性想进一步的了解，可以移步阅读[现代 CSS](https://s.juejin.cn/ds/idwHW6uG/) 中的《[CSS 变换中的单个变换](https://juejin.cn/book/7223230325122400288/section/7259668493158023205)》。

  


## CSS 变换案例

  


前面，我们花了很长的篇幅和大量的案例向大家阐述了 CSS 变换的基础知识、相关理论，并且探讨了如何将 CSS 变换与 [CSS 过渡（Transitions）和动画（Animations）](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)来制作各式各样的、流畅的 Web 动画。

  


虽然课程前面已经有大量的真实案例了，但我还是想以几个常见的案例来结束这节课，并且再次向大家呈现，CSS 变换是制作 Web 动画核心技术之一。

  


### 月球绕着行星旋转

  


这是一个简单的而又常见的动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9588fb3dc6a4ca0aa04612316fbb0a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=606&s=957481&e=gif&f=55&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/VwgaNxE

  


它的 HTML 结构很简单：

  


```HTML
<div class="orbit">
    <div class="planet">🎅</div>
    <div class="moon">🪆</div>
</div>
```

  


首先，使用 [CSS 网格布局技术](https://juejin.cn/book/7161370789680250917/section/7161624078397210638#heading-0)，将 `.planet` 和 `.moon` 都位置于 `.orbit` 正中心，就是一个简单的水平垂直居中的布局技术：

  


```CSS
.orbit {
    --radius: 30vmin;
    display: grid;
    place-content: center;
    position: relative;
    width: calc(var(--radius) * 2);
    aspect-ratio: 1;

    > * {
      grid-area: 1 / 1 / -1 / -1;
    }
}
```

  


然后，使用 CSS 的变换，将 `.moon` 沿水平方向向右移动 `--radius` ，即圆对应的半径：

  


```CSS
.moon {
    transform: rotate(0turn) translateX(var(--radius)) rotate(1turn);
}
```

  


注意，上面代码中还有两个 `rotate()` 函数，这两个旋转函数很有意思。第一个旋转函数会使 `.moon` 围绕着圆心旋转，第二个 `rotate()` 会使 `.moon` 围绕着自己旋转：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e821ed032554e14a0502cccc56d9477~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=558&s=3405254&e=gif&f=570&b=4a4969)

这样做的好处是，当 `.moon` 围绕着圆心旋转时，它自身始终处于正向不变的位置，使它在旋转过程中，它自身位置看上去没有旋转。

  


接着使用 `@keyframes` 定义一个帧动画，帧动画结束位置的变换也用了两个 `rotate()` 函数，只是旋转的角度与 `.moon` 初始设置的值刚好相反，对于 `translateX()` 函数的值，始终保持不变：

  


```CSS
@keyframes spin {
    to {
        transform: rotate(1turn) translateX(var(--radius)) rotate(0turn);
    }
}
```

  


现在，你只需要将定义好的 `spin` 帧动画应用到 `.moon` 上，就能实现你所期望的动画效果了。

  


```CSS
.moon {
    transform: rotate(0turn) translateX(var(--radius)) rotate(1turn);
    animation: spin 4s infinite linear;
} 
```

  


在此基础上，你可以添加更多的 `.moon` 元素，并且通过调整动画的延迟来防止它们重叠。要实现这一点，可以按以下步骤计算每个旋转元素的动画延迟时间（`animation-delay`）的偏移值：

  


-   确定动画的总持续时间（`animation-duration`），这是整个旋转动画从开始到结束所需的时间，你可以使用 `--duration` 自定义属性来描述
-   确定旋转元素的数量，也就是示例中 `.moon` 元素的个数，你可以使用 `--counts` 自定义属性来描述
-   将动画持续时间除以旋转元素的数量，以计算出每个旋转元素的延迟偏移值

  


例如，旋转元素的总个数是 `10` （即 `--counts: 10`），动画的持续时间是 `10s` （即 `--duration: 10s`），那么你可以这样计算延迟时间的偏移值：

  


```
延迟时间偏移值 = 动画总持续时间 ÷ 旋转元素总数量 = 10s ÷ 10 = 1s
```

  


这意味着每个旋转元素的动画将以 `1s` 的延迟开始，从而使它们依次旋转，而不是同时旋转，从而防止它们重叠。

  


这里有一个小细节，那就是通过设置 `animation-delay` 属性的负值来实现不同旋转元素的旋转时机。具体来说，将计算出来的延迟时间的偏移值以负值的方式赋予给 `animation-delay` 属性，以确保旋转元素按照期望的顺序旋转。总之，使用 `animation-delay` 属性和负值来控制旋转元素不同的动画时机，以实现有序的旋转效果。

  


```CSS
@layer animation {
    @keyframes spin {
        to {
            transform: rotate(1turn) translateX(var(--radius)) rotate(0turn);
        }
    }
    
    .orbit {
        --durations: 10s;
        --counts: 10;
        --delay-offset: calc(var(--durations) / var(--counts));
    }
  
    .moon {
        transform: rotate(0turn) translateX(var(--radius)) rotate(1turn);
        animation: spin var(--durations) infinite linear;
        animation-delay: calc(var(--index) * var(--delay-offset) * (-1));
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00880ee0505b481890311544d52edd38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=636&s=1607460&e=gif&f=56&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/jOdqorm

  


当然，除了上面这种方法之外，还有其他方法也可以实现同样的效果。比如每个 `.moon` 元素在圆上的位置坐标通过 [CSS 的三角函数](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)，例如 `sin()` 和 `cos()` 函数计算出来，然后再对其进行旋转。这里就不详细阐述了，感兴趣的同学可以自己尝试一下。

  


如果你想难正一下自己是否掌握了这方面的知识，那么可以使用上面示例学到的知识，[来构建一个圆形菜单](https://codepen.io/chriskirknielsen/full/BbNqEg)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd19d50e699f4866a0ef21648b4454ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=502&s=1156538&e=gif&f=145&b=00978d)

  


> Demo 地址：https://codepen.io/airen/full/YzBqbdw （来源于[ @Christopher Kirk-Nielsen](https://codepen.io/chriskirknielsen/full/BbNqEg) ）

  


### 构建 3D 游戏导航菜单

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/079af99841744879b566b5567cec6235~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=638&s=5859010&e=gif&f=138&b=4c486b)

  


> Demo 地址：https://codepen.io/airen/full/RwvaOWB （Demo 来源于 [@Adam Argyle](https://web.dev/articles/building/a-3d-game-menu-component) ）

  


上面这个导航菜单是使用 CSS 变换和透视等特性制作的，具有 3D 动画效果的导航菜单。使菜单看起来像悬浮在太空中一样，在新的 AR 或 VR 游戏中很常见。

  


如果你掌握了课程中透视函数中所介绍的内容，那么要制作出上图所示的导航效果，对你来说一点难度都不会有。这里简单的介绍一下制作过程中的关键部分。

  


首先，使用 `perspective` 属性来启动三维空间。我选择将视角放在 `body` 元素上：

  


```CSS
body {
    perspective: 40vw;
}
```

  


接下来，将容器设置为 3D 空间环境，并设置 CSS `clamp()` 函数，以确保卡片在旋转时不会超出清晰的旋转角度。请注意，夹扣的中间值是自定义属性，这些 `--x` 和 `--y` 值稍后将在鼠标互动时通过 JavaScript 设置。

  


```CSS
.threeD-button-set {
    /* 创建 3D 空间 */
    transform-style: preserve-3d;

    /* 通过比较函数 clamp() 设置旋转角度，确保卡片在旋转时不会超出清晰的旋转角度 */
    transform:
        rotateY(
            clamp(
                calc(var(--_max-rotateY) * -1),
                var(--y),
                var(--_max-rotateY)
            )
        )
        rotateX(
            clamp(
                calc(var(--_max-rotateX) * -1),
                var(--x),
                var(--_max-rotateX)
            )
        );
}
```

  


接下来，如果访问用户所需的动作正常，则通过 `will-change` 向浏览器添加提示，表明此项的转换将不断变化。此外，还可通过在转换上设置 `transition` 来启用插值。当鼠标与卡互动时会发生这种过渡，从而平滑过渡到旋转变化。该动画是一个持续运行的动画，用于演示卡片所在的 3D 空间，即使鼠标无法或不与组件互动也是如此。

  


```CSS
.threeD-button-set {
    will-change: transform;

    transition: transform .1s ease;
    animation: rotate-y 5s ease-in-out infinite;
}
```

  


`rotate-y` 动画仅会将中间关键帧设置在 `50%` 处，因为浏览器会将 `0%` 和 `100%` 默认设置为元素的默认样式。这是交替动画的简写形式，需要在同一位置开始和结束。这是阐明无限交替动画的好方法。

  


```CSS
@keyframes rotate-y {
    50% {
        transform: rotateY(15deg) rotateX(-6deg);
    }
}
```

  


最后就是给每个菜单项添加样式，下面是菜单项涉及到的变换和动画效果所需的代码：

  


```CSS
button {
    transform: translateZ(var(--distance));
    transform-style: preserve-3d;
    will-change: transform;
    transition:  transform .2s ease, background-color .5s ease;

    &:is(:hover, :focus-visible):not(:active) {
        transition-timing-function: var(--_bounce-ease);
        transition-duration: .4s;

        &::after  { 
            transition-duration: .5s 
        }
        &::before { 
            transition-duration: .3s 
        }
    }

    &::after,
    &::before {
         transform: translateZ(calc(var(--distance) / 3));
        transition: transform .1s ease-out;   
    }

    &::before {
        transform: translateZ(calc(var(--distance) / 3 * -1));
    }
}
```

  


最后，通过 JavaScript 来改变 `--x` 和 `--y` 自定义属性的值：

  


```CSS
const menu = document.querySelector(".threeD-button-set");
const menuRect = menu.getBoundingClientRect();

window.addEventListener("mousemove", ({ target, clientX, clientY }) => {
    const { dx, dy } = getAngles(clientX, clientY);

    menu.style.setProperty("--x", `${dy / 20}deg`);
    menu.style.setProperty("--y", `${dx / 20}deg`);
});

const getAngles = (clientX, clientY) => {
    const { x, y, width, height } = menuRect;
    const dx = clientX - (x + 0.5 * width);
    const dy = clientY - (y + 0.5 * height);

    return { dx, dy };
};
```

  


`--x` 和 `--y` 的值会随鼠标移动而改变，使整个导航菜单带有视差效果。

  


到这里，这节课的内容基本上就要结束了，最后给大家布置两个作业，请使用这节课所学知识，完成下面这两个动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2524499d371b4f418a6c4097ed4f6780~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=656&s=3458271&e=gif&f=91&b=4c486b)

  


> Demo 地址：https://codepen.io/airen/full/ExryYxL （来源于 [@Kilian Valkhof](https://codepen.io/Kilian/full/yLJBymR) ）

  


请使用单个变换特性来改造 [animation.css](https://animate.style/) 中的帧动画，看看哪些动画效果是可以使用单个变换来简化的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19429c626a2846eb86abaaa5d44a8bd3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=636&s=2358142&e=gif&f=129&b=f8dcc1)

  


> Animation.css URL: https://animate.style/

  


你甚至还可以借助陀螺仪、滚动相关的 API 与变换、透视、帧动画结合起来，创造出更具交互性，更吸引人的动画效果。感兴趣的同学不妨一试。

  


## 小结

  


在这节中，我们一起探讨了 CSS 变换中的平移、旋转、缩放、倾斜和扭曲等基本变换的基础知识。我相信，在学习这些基础知识的过程中你也掌握了如何使用这些属性来创建简单而有效的动画效果，从而为 Web 页面添加互动性和吸引力。这些基础技巧是构建更复杂动画的基础。

  


随着课程的进行，你将更进一步的掌握了 3D 变换技术，包括 3D 变换、透视和视差效果。这些技巧可以帮助你创建更具立体感的动画，使用户感觉自己仿佛置身于一个三维世界中。另外，你还将通过课程中大量的实例，掌握过渡动画和帧动画中应该如何使用变换，才能制作出流畅的动画。

  


总之，这节课可以帮助你掌握 CSS 变换特性，以创建引人入胜的网页动画。无论是初学者还是有经验的开发者，这节课的内容都为他们提供了丰富的知识和实践机会，以提高网页设计和动画制作技能。还将使你能够在 Web 开发中更好地实现其创意，为用户提供令人惊叹的视觉体验。