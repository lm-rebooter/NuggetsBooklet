[CSS 帧动画（Keyframe Animations）](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)是现代 Web 设计和动画制作中不可或缺的一部分。它们赋予 Web 生命，增强用户体验，使内容更具吸引力。然而，要创建出引人注目的 CSS 帧动画并不是一项容易的任务，特别是对于那些刚刚踏入这个领域的 Web 开发者来说。

  


在 CSS 动画的世界中，`@keyframes` 是一个强大而神秘的概念。它是帧动画的核心，可以让你定义动画的每一个阶段和状态。然而，很多人对 `@keyframes` 的语法和工作原理感到困惑，因此放弃了尝试创建自己的动画。

  


这也是为什么要花一节课的篇幅，与大家一起探讨 `@keyframes` 的原因。我们将深入剖析 `@keyframes` ，从基础知识到高级技巧，为你揭开它的神秘面纱。通过这节课的学习，你将更进一步的掌握一些你所不知道的 `@keyframes` 知识，帮助你轻松掌握 `@keyframes` 并创建出惊人的 CSS 帧动画。

  


不要让 `@keyframes` 再成为你创造美丽 Web 动画的障碍。让我们一起深入学习，并释放你的创造力，为用户带来令人印象深刻的 Web 体验。

  


## 什么是关键帧？

  


关键帧（Keyframes）是动画制作中的关键元素，用于定义动画在不同时间点的状态或属性值。它指定了动画的特定帧，这些帧之间的动画过渡由动画制作软件或浏览器自动计算和插值。

  


动画中的关键帧是动画中的特定参考点，用于对对象的状态或属性进行更改或调整。在关键帧动画中，你可以定义动画的开始状态、中间状态和结束状态，以及它们之间的过渡。这些状态通常包括元素的位置、尺寸、颜色、透明度、缩放、旋转以及许多其他属性。通过在关键帧之间定义这些状态，你可以创建平滑的动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ca6a2400a3e4285901f872db4f5341f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=624&s=1901998&e=gif&f=402&b=ffffff)

  


> URL：https://keyframes.app/animate

  


关键帧对于实现动画效果的精确控制至关重要，并在确定运动中的动画对象的时间和行为方面发挥关键作用。例如，如果你想创建一个动画，其中一个元素在 `3s` 的持续时间内从左边移动到右边，通常应该：

  


-   在起始位置（点 `A` ）设置一个关键帧
-   在终点位置（点 `B` ）设置另一个关键帧

  


然后，动画软件或浏览器会自动生成这两个关键帧之间的中间位置，以创建点 `A` 到点 `B` 之间的平滑和连续动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63ca558856a94ae488bfdeab50b8ca15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=402&s=671655&e=gif&f=73&b=ffffff)

  


关键帧之间的过渡速度由时间轴上的关键帧之间的距离决定。关键帧之间的距离越大，过渡速度就越慢，而距离越近，动画元素的过渡速度就越快。关键帧在动画过程中起着至关重要的作用，允许动画师在动画时间轴的不同时刻控制和定义对象的行为。

  


关键帧动画通常用于 CSS 动画中的帧动画（Keyframe Animations）、JavaScript 动画和动画制作软件中。在 CSS 中，你可以使用 `@keyframes` 规则定关键帧。这些关键帧指定了元素在动画的各个阶段应该如何呈现。例如，你可以使用关键帧来定义动画的起始点、中间点和结束点。

  


以下是在 CSS 中使用 `@keyframes` 中定义的关键帧的简单示例：

  


```CSS
@keyframes slideInRight {
    0% {
        translate: 100%;
    }
    100% {
        translate: 0;
    }
}
```

  


在这个示例中，定义了一个名为 `slideInRight` 的关键帧。在开始时（`0%`），元素向右平移 `100%` （元素自身的宽度），而在结束时（`0%`），它位于原始位置。这些关键帧可以应用于 HTML 元素，以创建一个从右向左滑入的动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f682e4f095e4097b2d899cbf8673538~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=338&s=461501&e=gif&f=213&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/vYbKZVJ

  


在 JavaScript 中，你可以使用动画库或框架来定义和控制关键帧。例如， Web Animation API 允许你像下面这样创建一个帧动画：

  


```CSS
// 创建一个新的动画
const element = document.getElementById('myElement');
const animation = element.animate(
    [
        { translate: '100%' },
        { translate: '0' }
    ],
    {
        duration: 1000, // 1秒
        iterations: Infinity, // 无限重复
        direction: 'alternate' // 每次迭代反向
    }
);

// 播放动画
animation.play();
```

  


虽然 Web Animation API 不像 CSS 动画那样使用"关键帧"这个术语，但它提供了一个强大且灵活的方式来处理 JavaScript 中的动画和过渡，使你能够创建动态和交互式的 Web 动画。（注意，小册后续课程会专门介绍 Web Animation API）。

  


总之，关键帧是动画制作中的基本概念，允许你通过指定元素在不同时间点的状态来创建各种动画，包括过渡、变换等。这种对动画行为和时间的控制是关键帧在 Web 动画中至关重要的原因。它们为在网站和 Web 应用程序上创建引人入胜和互动性的动画提供了强大的方式。

  


## 关键帧的起源

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27e6147e47af49188786ebcc71cfbb3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1456&h=692&s=1192773&e=gif&f=18&b=232323)

  


如今，关键帧这个词通常与视频编辑有关，但它们在数字视频编辑出现之前早在动画领域就有了。然而，如果你熟悉视频编辑中的关键帧，那么你可能已经对动画中的关键帧有了相当好的理解。

  


“关键帧”一词源于传统的动画技术，它指的是动画序列中定义主要姿势或关键位置的重要帧或绘画。在传统的手绘动画中，关键帧对于定义动画的起始和结束位置至关重要。这些关键帧是由熟练的动画师绘制的，它们充当了动画的基本参考点。经验较少的动画师，被称为“中间者”或“中间艺术家”，然后会创建填补关键帧之间间隙的帧，以实现平滑的动画效果。例如下面这个手绘动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac8569603d0947e69f80749d6b72727a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1459&h=1080&s=434074&e=gif&f=17&b=ffffff)

  


就上面这个手绘动画而言，首先会由动画师绘制出该动画中的主要关键帧（如下图所示），然后关键帧之间的中间帧则由经验较少的“中间艺术家”完成：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb6de6f03b0d4c28b83e9973c44d82e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=824549&e=jpg&b=f5f4f9)

  


换句话说，“关键帧”的概念在数字时代之前就已经确立，当时动画师逐帧在纸上创建动画。这个术语“关键帧”反映了它在动画过程中的关键参考点的角色，就像一把解锁动画的运动和进程的钥匙一样。

  


迪士尼早在 30 年代就开创了关键帧动画，通过设定运动的主要姿势供艺术家绘制，而中间帧由经验较少的“中间艺术家”或机器创建。该公司是第一个建立[动画原则](https://juejin.cn/book/7288940354408022074/section/7288940354580480056)并影响其他工作室采用他们的技术的公司。

  


与迪士尼动画相比而言，计算机动画晚了几十年，它到 70 年代才兴起，成为一种制作动画的新技术。随着动画技术的发展，“关键帧”的概念被应用到数字动画中，包括计算机生成的动画和 CSS 动画，其中关键帧定义了动画序列中的特定时刻。

  


总而言之，“关键帧”这个术语一直作为动画中的基本概念，无论使用的媒体如何，都一直存在。

  


## 什么是帧？

  


帧（Frame）是指图像序列中的单个图像。在视频、电影或动画中，帧是构成其基本单元。当这些帧以一定的速率连续播放时（通常以每秒帧数 `fps` 来衡量），它们创造出了连续运动的错觉。就好比你在每张纸上绘制了一个图像，每个静止的图像就是一个帧，但当它们以足够快的速度播放时，它们会产生连续运动的错觉。这意味着它们在连续播放时产生了视觉上的连续动画或视频。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cefd79ac46c242e5af5c51ba69b652b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=450&s=11063574&e=gif&f=62&b=7f5141)

  


正如上图所示，假设你是一名设计师，你在一叠中的每张白绝上绘制了不同的图像，一旦你快速将它们翻页时，每张白纸上的图案将会以动画的形式向你呈现。而且不同的帧率（即每分钟翻多少页）将会影响动画的流畅度和感知效果。

  


也就是说，我们所说的帧，它就是图像序列中的单个图像。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6ab2073bf67452882fc39f3619d96c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=600&s=474619&e=gif&f=41&b=fbd208)

  


如上图效果是由 `36` 个不同的图像所组成的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef8648fc9697491ea72560193d5c3a69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1289&s=752595&e=jpg&b=cecece)

  


当你将 `36` 图按指定顺序堆叠在一起，并且以一定的速率向用户呈现时，就是动画效果。这也意味着，**一系列连续的帧构成了动画**。帧会在被下一帧生新考虑后放到视图中。所有帧都在屏幕上特定的时间内呈现，我们可以将一系列帧（图像）放在一个空间中以创建单一动画。

  


上面所呈现的效果也是帧动画的效果。它也是一种传统的动画制作技术，它需要绘制每一帧，这在某些情况下可以提供更大的创造性控制。每个帧都可以手动绘制或制作，然后在播放时以一定的速率快速切换，从而创造出动画效果。这与计算机生成的动画的动画制作方法有所不同，后者通常使用复杂的计算来实现动画效果。帧动画在传统手绘动画、绘本动画和某些影响中仍然得到广泛应用。

  


在 CSS 动画中，我们所说的雪碧图（Sprites）动画，就是帧动画的典型案例。假设你有像下图一张拼接而成的图，美女每个跳舞动画可以被视为一帧：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/370ab7f4571643acb3c0375add1abc7c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=6041&h=544&s=204576&e=png&a=1&b=c62757)

  


```CSS
@layer animation {
    @keyframes sprite-animation {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: -6041px 0;
        }
    }
    .dance {
        animation: sprite-animation 1.45s steps(11, end) infinite;
    }
}
```

  


只需要在 CSS 定义的 `@keyframes` 中改变背景图片的位置，你将得到像下面这样的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddaf99a0fbfa484f8b948e5307b647f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=548&s=9554569&e=gif&f=92&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/WNPxdXe

  


## 帧和关键帧之间有什么区别？

动画中的帧（Frame）和关键帧（Keyframe）是两个不同的概念，它们在动画制作中具有不同的作用和特征。简单的用下图来阐述帧与关键之间的区别：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af24aee560604e9c8a7ab8010bc353be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1104&s=488050&e=jpg&b=fcfcfc)

  


上图中，实体人形（实心）对应的是动画中的关键帧，所有人形（包括空心）对应的是动画中的帧。

  


简单地说，帧和关键帧之间的区别是，帧是一系列帧中的单个组成部分，而关键帧是一个参考点，用于标记对象或元素如何过渡或改变到特定的帧。

  


-   **帧（Frame）** ：一系列帧中的一个单独组成部分
-   **关键帧（Keyframe）** ：标记分配给特定帧的变化（或过渡）的参考点

  


我们可以从不同的方面来进一步阐述它们之间的差异。首先从定义和作用来看它们之间的差异。

  


帧是动画中的基本图像单元，它们代表了不同时间点的静态图像。帧按顺序排列，当它们以一定速率连续播放时，会产生动画效果。帧通常没有特殊标记或属性，仅代表特定瞬间的图像。而关键帧则是动画中的特殊帧，它们用于标记动画中的重要变化或转折点。每个关键帧通常包含了具体的指令，用于定义对象或元素在该帧上的位置、状态、变换或动作。关键帧对于控制动画中的关键变化非常重要。

  


不难发现，帧通常只包含图像信息，代表了某一时刻的画面，而且它在动画中是连续出现的，它们按照一定的帧率（FPS）持续播放，使动画流畅地呈现。关键帧除了图像信息外，还包含了有关对象或元素在该帧上的行为和属性信息，例如位置、旋转、透明度等。它主要用来标记动画中的特定时刻或状态的，通常出现在动画中需要重要变化的地方。

  


除此之外，两者的使用方式也略有不同。帧通常用于填充关键帧之间的动画效果，它们在动画中以较快的速率播放，使动画连贯。关键帧用于定义动画中的关键变化，它们确定了动画中的重要状态和动作。

  


总之，帧是动画中的基本图像单元，而关键帧是动画中用于标记和控制重要变化的特殊帧，它们包含了更多的信息和指令。帧在填充动画中起到衔接作用，而关键帧定义了动画的关键时刻和关键动作。

## 关键帧可以对对象进行哪些更改？

关键帧是动画中的重要元素，允许你控制和定义场景中对象或元素的各种变化和动画。你可以通过关键帧在对象上进行位置、变换、透明度、颜色、路径、可见性、缓动函数等操作。

  


-   **位置**：你可以在关键帧上指定对象的确切位置。例如，使用变换中的 `translate` 使对象平滑地从一个位置移动到另一个位置。切记，不到万不得已的情况之下，不要通过 `top` 、`right` 、`bottom` 和 `left` 来调整元素位置
-   **变换**：你可以在关键帧上给对象或元素应用 [CSS 变换相关特性](https://juejin.cn/book/7288940354408022074/section/7295240572736897064)，例如，旋转、缩放、倾斜和扭曲等，甚至还可以给对象或元素添加透视、视差等效果
-   **透明度**：你可以在关键帧上控制对象或元素的透明度，通过在不同的关键帧上调整透明度，可以使对象淡入淡出
-   **颜色**：你可以在关键帧上指定对象或元素的颜色。例如，文本颜色 ，背景颜色、边框颜色和阴影颜色等
-   **路径**：你可以在关键帧上指定对象或元素根据指定的路径运动。这对于创建路径动画非常有用
-   **可见性**：你可以使用关键帧使对象可见或不可见。这对于创建对象在场景中出现或消失的效果非常有用
-   **缓动函数**：你可以在关键帧上控制对象或元素动画的时序，并应用缓动函数来控制对象或元素的运动速度
-   **其他属性**：你可以在关键帧调整对象或元素可动画化的属性，例如圆角、尺寸、剪切和蒙板等

  


总之，关键帧是动画中不可或缺的工具，尤其是帧动画，允许你控制对象的位置、旋转、缩放、透明度、颜色、运动等各个方面。它们对于在 Web 应用程序或网站中创建流畅和引人入胜的动画非常重要。

  


## 对关键帧可以进行哪些更改？

  


通常情况下，除了在关键帧中定义对象或元素的属性变化之外，我们还可以对关键帧之间的时间、位置、缓动函数和过渡进行修改。

  


**关键帧之间的时间**指的是两个关键帧之间的时间间隔，它决定了动画或过渡在这两个关键帧之间的速度。这是指动画从一个关键帧到另一个关键帧之间的运动速度或过渡速度。

  


你可以通过调整关键帧在时间轴上的位置来更改变关键帧之间的时间。增加两个关键帧之间的时间间隔会使动画元素在这段时间内以较慢的速度运动，而减小时间间隔会加快元素的运动速度。这种调整可以影响动画的速度和流畅度，以便达到所需的效果。

  


调整关键帧之间的时间间隔对于控制动画中的速度和节奏非常重要，可以使动画元素以不同的速度移动或过渡，从而实现各种动画效果。这是制作动画中的关键控制因素之一。

  


**关键帧的位置**指的是关键帧在时间轴上的具体位置或顺序。这个位置决定了动画中不同关键帧的出现时间和顺序。调整关键帧的位置可以影响动画的顺序和时间表。你可以通过移动关键帧在时间轴上的位置来改变动画中不同部分的出现顺序，从而创建不同的动画效果。这在视频编辑和动画制作中非常有用，因为它允许你控制动画中不同元素的出现和运动时间。

  


通过调整关键帧的位置，你可以创建动画中的不同场景和效果，使动画更加生动和具有吸引力。这个位置的调整是制作动画时的重要工具之一。

  


**关键帧缓动效果**是指在动画制作中应用于关键帧的效果，以控制对象从一个关键帧到另一个关键帧之间的加速和减速过渡。这些缓动效果允许你使动画元素的运动更加平滑和自然，而不是突然改变速度或方向。关键帧缓动效果在动画制作中非常重要，因为它们可以使动画看起来更流畅和真实。以下是一些常见的关键帧缓动效果：

  


-   **线性缓动**： 线性缓动表示动画元素以恒定速度从一个关键帧移动到另一个关键帧，没有加速或减速
-   **缓入**： 缓入效果使动画元素从起始关键帧开始时以较慢的速度运动，然后逐渐加速到结束关键帧
-   **缓出**： 缓出效果使动画元素从起始关键帧开始时以较快的速度运动，然后逐渐减速到结束关键帧
-   **缓入缓出**： 缓入缓出效果结合了缓入和缓出，使动画元素在开始和结束关键帧附近都以较慢的速度运动，而在中间部分加速

  


这些缓动效果可以根据动画的需求进行调整和应用，以实现不同的运动和过渡效果。它们有助于使动画看起来更加生动和自然，增加观众的视觉体验。

  


**跳过关键帧之间的过渡**是指在动画中消除两个或多个关键帧之间的平滑过渡，使动画元素在这些关键帧之间发生突然的变化，而不是逐渐变化。这种效果也称为“保持关键帧”（Hold Keyframes）。在跳过关键帧之间的过渡中，动画元素会立即从一个关键帧的状态转变为下一个关键帧的状态，而不经历中间的渐变或平滑过渡。这意味着在两个关键帧之间不会有连续的动画过程，而是突然的跳跃。

  


这种效果通常用于制作需要快速变化或突然转变的动画场景，例如某些类型的动画效果或特殊效果。通过跳过关键帧之间的过渡，你可以创建出具有冲击力和戏剧性效果的动画，而不是平滑的过渡。这在某些动画场景中非常有用。

  


## 关键帧分类

  


在关键帧动画中，我们常见的关键帧主要有“**线性插值关键帧**”、“**贝塞尔插值关键帧**”和“**保持插值关键帧**”三种类型。

  


如果你是初次使用关键帧来制作动画，那么线性关键帧是一个不错的起点。线性关键帧表示关键帧之间的过渡以均匀或一致的速度进行。它表示对象在关键帧之间的运动是匀速的，速度既不增加也不减少。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb388c45ffce43869f3a934233fb06c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=572&s=968465&e=gif&f=88&b=ffffff)

  


注意，线性插值关键帧还有一种线性子类，称为连续关键帧，它要求在不间断的过渡中保持一致的插值或过渡。

  


贝塞尔插值关键帧通常也称为“缓动关键帧”。这是一种更复杂的插值类型，它允许指定对象在两个点之间的速度和运动路径。它提供了更多的控制，可以创建不同速度和轨迹的动画过渡。其中两种常见的选项是缓入和缓出。缓入表示对象在开始时加速，一旦到达结束关键帧就减速。缓出与之相反，对象在开始时减速，然后加速到结束关键帧。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/297628e9b6564631814dc061ceca77d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1258&h=504&s=1571517&e=gif&f=145&b=ffffff)

  


保持插值关键帧也被称为“定格帧”，这是许多电影中常见的效果。保持插值关键帧将对象保持在特定的姿势或状态中，不发生变化。它用于冻结或锁定某个关键帧，使对象保持在静态状态。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab15b935aaa04db1bed1760505b1ec79~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1252&h=528&s=228468&e=gif&f=146&b=ffffff)

  


这些不同类型的关键帧允许动画师根据需要创建不同类型的动画效果，从匀速的过渡到复杂的速度和轨迹控制，以及静态的关键帧。不同类型的关键帧可以为动画增加不同的风格和动态。

  


注意，在关键帧的上下文中，插值（Interpolation）是指在两个关键帧之间填充数据的过程。根据设置的关键帧类型，可以以不同的方式计算属性值的变化。在动画中，插值是一种数学方法，用于在两个或多个指定点之间填充未知的数值。这一过程有助于创建平滑的动画过渡，确保在关键帧之间的连续性。通过插值，动画软件或浏览器可以计算出在不同帧之间属性值的逐渐变化，从而使动画看起来更加自然和流畅。在后续的课程中，我们将会深入探讨动画中的插值计算。

  


## 关键帧的优点是什么？

  


使用关键帧的最大优势是它使动画创建过程更加高效，同时保持了质量。动画师只需要设置少数重要的参考点，而不是创建成百上千个单独的帧。其具体的优势包括：

  


-   **加速动画制作过程**：使用关键帧可以大大加速动画制作过程，无需创建数百个独立的帧，而只需设置几个重要的参考点
-   **能够轻松创建各种动作**：关键帧允许动画师轻松创建各种类型的动作，从对象的平滑移动到复杂的角色动画
-   **创建流畅的过渡**：关键帧可用于创建流畅的过渡，使不同帧之间的动画变化自然且无缝
-   **便于后期修改**：使用关键帧后，以后对动画进行修改变得更加容易，因为开发人员只需要修改主要数值和或特征，而不必处理所有帧
-   **可重复使用**：关键帧可以轻松复制和粘贴，因此它们可以被重复用于其他元素的创建

  


此外，你可以自由地根据需要在每几秒钟或任何持续时间内更改效果，从而提供了很大的创作灵活性。这些优势有助于吸引观众的注意，使最终作品更具吸引力，提高了动画制作的质量。

  


## 关键帧的缺点是什么？

  


有优点就会有缺点，关键帧主要缺点体现在以下几点：

  


-   **手动设置和调整每个关键帧可能会耗费大量时间**：在创建复杂的动画时，手动设置和调整每个关键帧可能会非常耗时，特别是在需要大量关键帧的情况下
-   **创建复杂动作具有挑战性**：对于复杂的、自然的运动和动作，使用关键帧动画可能会变得复杂和具有挑战性。这些类型的动画通常更容易通过运动捕捉等技术来实现
-   **难以在有大量关键帧的情况下跟踪它们**：当在时间轴上设置了大量的关键帧时，可能会变得难以跟踪和管理它们

  


此外，关键帧在表现情感和激发行动方面可能效果不如其他技术，如运动捕捉。虽然帧动画适合解释复杂的过程和娱乐观众，但在表达情感和推动人们采取行动方面效果不如其他方法。因此，在不同的动画制作情境中，需要权衡关键帧的优点和缺点。

  


## CSS 的 @keyframes 规则

  


有了前面的理论基础之后，我们开始进入关键帧动画的实战阶段。

  


[CSS 关键帧动画与过渡动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)最大的差异之一就是，首先需要使用 `@keyframes` 规则定义一个关键帧动画，然后通过 `animation` 或 `animation-name` 属性给要动画化的对象或元素上使用 `@keyframes` 定义好的关键帧动画。例如：

  


```CSS
/* 第一步：定义关键帧动画 */
@keyframes zoomIn{
    from {
        opacity: 0;
        scale: 0;
    }
    to {
        opacity: 1;
        scale: 1;
    }
}

/* 第二步：引用已定义的关键帧动画 */
.animated {
    animation-name: zoomIn;
}
```

  


正如上面示例所示，`@keyframes` 规则后面会紧跟一个标识符，然后在该标识符后面紧跟一系列规则集（即带有声明块的样式规则，就像正常的 CSS 代码一样）。这一组规则集由花括号（`{}`）括起，将规则集嵌套在 `@` 规则内。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c0c982535c44d85a83751489abbe587~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1675&s=687857&e=jpg&b=161719)

  


### 关键帧选择器

  


CSS 的 `@keyframes` 规则内添加了一些样式集：

  


```CSS
@keyframes headShake {
    0%, 50%, 100% {
        translate: 0;
    }

    6.5% {
        translate: -6px; 
        rotate: y -9deg;
    }

    18.5% {
        translate: 5px; 
        rotate: y 7deg;
    }

    31.5% {
        translate: -3px; 
        rotate: y -5deg;
    }

    43.5% {
        translate: 2px;
        rotate: y 3deg;
    }
}
```

  


通过添加这些新的规则集，我们引入了**关键帧选择器**。在上面的代码示例中，关键帧选择器分别是 `0%` 、`6.5%` 、`18.5%` 、`31.5%` 、`43.5%` 、 `50%` 和 `100%` 。其中 `0%` 和 `100%` 关键帧选择器可以分别替换关键词 `from` 和 `to` ，效果将是相同的。

  


这个示例的 `@keyframes` 中包含了五个规则集，它们分别代表了动画元素的不同快照，其中的样式定义了动画的那个点（状态）下元素的外观。未定义的点（例如从 `43.5%` 到 `50%`）构成了定义的样式之间的过渡期（点与点之间的中间状态），这个过渡期是由动画制作软件或浏览器计算出来的，它们也被称为插值关键帧。

  


正如上面示例所示，出现在 `@keyframes` 规则中的关键帧顺序并不真的重要。关键帧将按照百分比值指定的顺序播放，而不是按照它们在代码中出现的先后顺序播放。例如上面示例代码中，`50%` 和 `100%` 关键帧选择器出现在比它百分比值小的选择器 `18.5%` 、`31.5%` 和 `43.5%` 之前，但动画仍然以相同的方式播放。

  


另外，如果 `@keyframes` 中没有声明 `to` 或 `from` （或者基于百分比的等效值），浏览器将自动构造它，浏览器将使用元素的现有样式作为起始或结束状态。这可以用来从初始状态开始元素动画，最终返回初始状态。

  


### 关键帧名称

  


每一个 `@keyframes` 规则都可以有一个独立的名称，这个名称被称为关键帧名称，它紧跟 `@keyframes` 关键词之后，例如上面示例中的 `headShake` 。它也被称为动画名称，主要提供给 `animation` 属性中的 `animation-name` 使用。

  


```CSS
.animated {
    animation-name: headShake;
}
```

  


简单地说，关键帧名称是用来给定义的动画命名。

  


你可以使用任何你喜欢的名称给动画命名，但尽可能避免使用 CSS 的关键词给动画命名，例如 `span` 、`inherit` 和 `auto` 等。因为个别关键词的命名会导致动画失效。因此为了避免这种现象出现，个人建议不要使用 CSS 关键词来给动画命名。

  


另外，给动画命名时，它是区分大小写的，例如：

  


```CSS
@keyframes zoomIn {
    from {
        opacity: 0;
        scale: 0;
    }
    to {
        opacity: 1;
        scale: 1;
    }
}

@keyframes zoomin {
    50% {
        opacity: 0;
        scale: 0;
    }
}
```

  


上面代码中的 `zoomIn` 和 `zoomin` 是两个不同的动画。

  


在 CSS 样式表中，会有多个关键帧存在。如果多个关键帧使用同一个名称，以最后一次定义的为准。例如：

  


```CSS
@keyframes zoomIn {
    from {
        opacity: 0;
        scale: 0;
    }
    to {
        opacity: 1;
        scale: 1;
    }
}

@keyframes zoomIn {
    50% {
        opacity: 0;
        scale: 0;
    }
}
```

  


上面代码中定义了两个 `zoomIn` 关键帧，最终被应用（生效）的是第二个 `zoomIn` 关键帧。

  


在 CSS 中，`@keyframes` 不存在层叠样式的情况，所以动画在一个时刻（阶段）只会使用一个关键帧的数据。

  


如果一个 `@keyframes` 内的关键帧的百分比存在重复的情况，则 `@keyframes` 规则中该百分比的所有关键帧都将用于该帧。例如：

  


```CSS
@keyframes backInDown {
    0% {
        translate: 0 -1200px;
    }

    80% {
        translate: 0 0;
    }
    
    100% {
        scale: 1;
    }
    
    0%, 80% {
        opacity: .7;
        scale: .7;
    }
}
```

  


上面代码中，`0%` 和 `80%` 都有两个，最终在这两个帧选择器中定义的样式规则都会应用。上面代码等同于：

  


```CSS
@keyframes backInDown {
    0% {
        translate: 0 -1200px;
        opacity: .7;
        scale: .7;
    }

    80% {
        translate: 0 0;
        opacity: .7;
        scale: .7;
    }
    
    100% {
        scale: 1;
    }
}
```

  


最终效果是相同的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2da8fce29d9e40e28c65fcca55d01c3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=510&s=204180&e=gif&f=113&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/QWYKWXz

  


还有一点需要知道的是，`@keyframes` 定义的帧动画需要显式被 `animation` 或 `animation-name` 属性调用才会被生效，否则它不会起任何作用，也不会影响任何元素的样式。

  


### 关键帧与持续时间

  


在 `@keyframes` 规则中，关键帧的选择器主要是以百分比值的方式存在，你可能想知道，这个百分比的计算是相对于谁，代表的又是什么？

  


简单地说，**关键帧选择器代表的是动画完成的百分比**。例如下面这个关键帧动画：

  


```CSS
@keyframes pulse {
    0% {
        scale: 1;
    }

    50% {
        scale: 1.05;
    }

    100% {
        scale: 1;
    }
}
```

  


上面 `pulse` 关键帧中的 `0%` 关键帧代表 `pulse` 动画的开始，`50%` 关键帧代表 `pulse` 动画的中间点，`100%` 关键帧代表 `pulse` 动画的结束。

  


不过，在现实生活中，我们考虑动画中发生的事情时，并不会按百分比值来考虑的。我们通常是按时间点来考虑的。比如，`pulse` 动画播放多久，每个时间节点动画发生了什么？因此，我们会给动画设置一个持续时间（`animation-duration`）。例如：

  


```CSS
.animated {
    animation-name: pulse;
    animation-duration: 1000ms;
}
```

  


你可能会问，动画的持续时间和关键帧动画中的关键帧选择器有何关系？

  


首先要知道的是，动画的持续时间值不仅指定了动画的总长度，还有助于指定特定关键帧何时执行。简单地说，动画的持续时间定义了关键帧（`@keyframes`）时间轴的时长。

  


我们可以使用下图来阐述 CSS 中关键帧的百分比值是如何映射到动画时间单位。即 CSS 关键帧（`@keyframes`）中百分比值与 CSS 的 `animation-duration` 单位（一般是 `s` 或 `ms`）之间的关系：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93af84913a6a409c8b613ef4458c51cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=753&s=58352&e=jpg&b=fbfbfb)

  


  


-   位于关键帧的 `0%` 位置的 `scale: 1` 在 `0ms` 后开始生效
-   位于关键帧的 `50%` 位置的 `scale: 1.05` 在 `500ms` 后开始生效
-   位于关键帧的 `100%` 位置的 `scale: 1` 在 `1000ms` 后结束时生效

  


正如你所看到的，如果你不希望把事情搞得复杂化，可以这么来理解，**关键帧（** **`@keyframes`** **）中的百分比值计算是相对于动画的持续时间（** **`animation-duration`** **）来计算的**。

  


有了这个基础之后，不管关键帧有多复杂，你都能知道动画随着时间向前推移时会发生什么事情。拿心跳（`heartBeat`）动画效果为例：

  


```CSS
@keyframes heartBeat {
    0%, 28%, 70% {
        scale:1;
    }

    14%, 42% {
        scale:1.3;
    }
}

.heartBeat {
    animation: heartBeat 1.3s infinite;
}
```

  


`heartBeat` 关键帧分别是 `0%` 、`14%` 、`28%` 、`42%` 和 `70%` 。动画的持续时间为 `1.3s` 。要弄清楚关键帧 `heartBeat` 在这个示例中何时生效，你只需要拿出你的计算器，将动画的持续时间值 `1.3` 乘以关键值的百分比值。很容易就能得出，`heartBeat` 关键值分别在：

  


-   动画播放到 `0s` （动画开始）时将会执行关键帧 `0%` 位置的样式，即 `scale: 1`
-   动画播放到 `0.182s` （即 `1.3s × 14% = 0.182s` ）时将会执行关键帧 `14%` 位置的样式，即 `scale: 1.3`
-   动画播放到 `0.364s` （即 `1.3s × 28% = 0.364s`）时将会执行关键帧 `28%` 位置的样式，即 `scale: 1`
-   动画播放到 `0.546s` （即 `1.3s × 42% = 0.546s`）时将会执行关键帧 `42%` 位置的样式，即 `scale: 1.3`
-   动画播放到 `0.910s` （即 `1.3s × 70% = 0.910s`）时将会执行关键帧 `70%` 位置的样式，即 `scale: 1`
-   动画播放到 `1.3s` （即 `1.3s × 100% = 1.3s`）时将会执行关键帧 `100%` 位置的样式，在这个示例中，它将回到 `scale` 最初值 `1` ，不做任何缩放

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c79956c470cb49838c18faf8289bb743~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=753&s=64934&e=jpg&b=fbfbfb)

  


持续时间和关键帧之间映射关系会使大多数初学 Web 制作者感到困惑。如果上面这两个示例还不能帮你解惑，那么请记住，**CSS 关键帧没有时间的概念，它只有一个百分比完成的概念**。CSS 的 `animation-duration` 将创建的关键帧与时间联系在一起。一旦你理解了这一切，你将不再为此感到困惑，甚至帮你解决了帧动画的另一个谜团。

  


### 关键帧中的 !important

  


稍微熟悉 CSS 的开发者都知道，`!important` 将会增加样式规则的权重，即优先于样式表中较早的声明以及没有 `!important` 注释的声明。但在关键中，却足以令你感到吃惊。**关键帧中带有** **`!important`** **的规则将会被忽略**。

  


这跟 CSS 中“级联”是有关系的。CSS 的一个指导原则是多个不同的样式表可以影响文档的呈现方式。“级联”和“默认”这两个过程有助于实现这一点。

  


在级联中，我们有不同的声明尝试为相同的元素和属性组合设置值，级联根据特定的优先级顺序来确定使用哪个值。默认则是相反的，没有声明尝试为给定的元素和属性组合设置值，因此该值默认为继承自父元素或使用属性的初始值。

  


我们将重点放在级联上，因为 `@keyframes` 的怪异之处在于常规动画声明和 `!important` 声明之间的冲突。要确定级联排序顺序和 `!important` 哪个值胜出，级联会查看三个核心来源的声明：

  


-   **作者来源（Author Origin）** ：将其视为网站的开发者。具有此来源的样式表可以包含在网页文档中或链接到外部
-   **用户来源（User Origin）** ：网站的访问者可以指定要使用的样式，通常出于辅助功能的目的，例如在所有站点上增大文字大小
-   **用户代理来源（User-Agent Origin）** ：通常指浏览器提供的默认样式表

  


还有两个来源来自 CSS 的扩展：动画来源和过渡来源。

  


CSS 的 `!important` 注释的存在是为了让作者或用户将声明从其在优先顺序中的默认位置移动到某个更高的位置。如果声明包含 `!important` 注释，则称为重要声明，它的优先级权重就会加大。否则，它是普通声明。

  


将所有这些类别汇总在一起，CSS 级联排序顺序就如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b363296c232d49c7acbb3b5c6b0cef13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=871&h=731&s=490333&e=jpg&b=131416)

请注意，三个重要来源（带 `!important` 注释的来源）与三个普通来源（不带 `!important` 注释的来源）的顺序相反。正如前面提到的，这对于辅助功能非常有用，它允许 `!important` 用户来源样式覆盖网站作者视为重要的声明。

  


还要注意，所有重要来源，特别是重要作者来源（User Origin），都比动画来源（Animation Origin）具有更大的权重。这是 CSS 规范中关于动画的规定指出的内容。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af6a33d9d35d407d91f1351391e47f13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3186&h=995&s=1316309&e=jpg&b=131416)

  


> 特别声明，CSS 的级联是一个很基础但很重要的概念，但这方面知识已超出这节课的范畴，如果你感兴趣的话，可以阅读《[CSS 分层：@layer ](https://juejin.cn/book/7223230325122400288/section/7259563116462080037)》。

  


如上所述，`!important` 提供了一种在不同样式声明来源之间重新平衡权重的方式。动画来源（Animation Origin）已经覆盖了所有普通来源声明，因此有必要有一些可以覆盖动画来源的工具。这个“工具”就是 `!important` 。

  


事实上，对于帧动画而言，它的整个过程首先查看关键帧 `@keyframes` ，然后将适当的值添加到 CSS 级联中。但关键帧中的声明本身不直接与级联互动。在级联的上下文之外，`!important` 就变得没有意义，因此重要声明是无效的。这也就是 `@keyframes` 中带有 `!important` 注释的样式声明被忽略的原因，它会被动画过程忽略。

  


### 关键帧中的缓动函数

  


通过《[帧动画和过渡动画：谁更适合你的业务场景？](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)》这节课的学习，我们知道，在 CSS 中可以通过 `animation-timing-function` 属性来控制动画的速度。例如：

  


```CSS
.animated {
    animation-timing-function: linear;
}
```

  


上面代码会告诉浏览器，以恒速（匀速）的方式来播放动画。

  


其实，在关键帧动画中，除了在设置动画播放方式时可以指定缓动函数之外，还可以在关键帧中的每个关键帧段（关键帧选择器块内）定义缓动函数，以控制动画在这些关键帧之间的进展方式。例如：

  


```CSS
@keyframes flip {
    from {
        transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
        animation-timing-function: ease-out;
    }

    40% {
        transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);
        animation-timing-function: ease-out;
    }

    50% {
        transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);
        animation-timing-function: ease-in;
    }

    80% {
        transform: perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
        animation-timing-function: ease-in;
    }

    to {
        transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
        animation-timing-function: ease-in;
    }
}
```

  


这样一来，你可以通过关键帧创建更复杂和动态的动画，其中在动画的不同点上具有不同的缓动或时间行为。

  


它的使用方式很简单，只需在关键帧段通过 `animation-timing-function` 属性指定所需要的缓动函数即可。当然，在设置缓动函数时，顺序也很重要。如果要关键帧某一段应用缓动函数，必须在前一个关键帧段中设置它。

  


例如，假设我们希望一个球沿着正方形行进，它从左上角开始，以正方形的顺时针方向移动。当水平移动时，我们希望它以恒速（`linear`）移动，就好像不断受到风的推动。当它下降时，应该慢慢开始并变得更快（`ease-in`）。当它上升时，应该该始得更快并变得更慢（`ease-out`）。我们将减慢它，以便可以看到微妙的差异。

  


```CSS
@keyframes move {
    25% {
        translate: 100% 0%;
        animation-timing-function: ease-in;
    }
    50% {
        translate: 100% 100%;
        animation-timing-function: linear;
    }
    75% {
        translate: 0% 100%;
        animation-timing-function: ease-out;
    }
}

.animated {
    animation: 5000ms linear infinite move;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19741492c0fd48beb584fcc5ac8ac0ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=578&s=339873&e=gif&f=97&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/ExrgVLY

  


上面示例有一些事项需要注意：

  


-   `move` 帧动画没有 `0%` (或 `from`) 的段，表示动画从动画元素的起始位置开始
-   `move` 帧动画没有 `100%` （或 `to`）的段，表示动画在起始位置结束
-   关键帧段的缓动函数是在使用之前在前一段中指定的。一个关键段将使用在段开始时活动的时间函数。这一点可能会令人感到困惑。正如上面示例所示，关键帧段 `50%` 使用的缓动函数是来自于关键帧 `25%` 段中 `animation-timing-function` 属性指定的值 `ease-in` 。
-   示例中 `.animated` 元素调用 `move` 关键帧动画时，必须通过 `animation-timing-function` 属性指定缓动函数，比如示例中的 `linear` 函数，以便该时间函数在 `0%` 到 `25%` 的过渡中使用。

  


因此，它的工作方式可能不完全符合你的直觉期望。但你可以采用这种方式创建更复杂的帧动画。

  


### 关键帧中的自定义属性

  


[CSS 自定义属性是现代 CSS 中的一个重要特性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)，它除了给 Web 开发者编写 CSS 带来便利之外，还增强了 CSS 的能力。很多时候可以以更少的代码量编写出更出色的 UI。但是，原生的 CSS 自定义属性在关键帧中使用的话，并不能被动画化，浏览器无法对它进行插值计算。例如：

  


```CSS
@keyframes radius {
    50% {
        --radius: 50%;
    }
}

.animated {
    --radius: 0;
    border-radius: var(--radius);
    animation: radius 1s linear infinite alternate;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b73f1668b828405a8ecd608cfa58dd2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=494&s=32260&e=gif&f=48&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/mdvrVeX

  


最终呈现给你的效果并不是你所期望的，元素并没有从正方形平滑地过渡到圆形，而是一闪而过。当 `--radius` 属性的值从 `0` 过渡到 `50%` 时，浏览器并没有对它进行插值计算。其主要原因是，CSS 自定义属性的值是一个字符串，好比 `font-family` 属性的 `sans-serif` 到 `serif` 之间，无法做插值计算。

  


庆幸的是，我们可以通过 [CSS 的 @property 特性](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)改变它。`@property` 在定义 CSS 自定义属性时，可以指定其值的类型，例如：

  


-   长度：`<length>`
-   数字：`<number>`
-   百分比：`<percentage>`
-   长度百分比：`<length-percentage>`
-   颜色：`<color>`
-   图像：`<image>`
-   URL：`<url>`
-   整数：`<integer>`
-   角度：`<angle>`
-   时间：`<time>`
-   分辨率：`<resolution>`
-   变换列表：`<transform-list>`
-   变换函数：`<transform-function>`
-   自定义标识符字符串：`<custom-ident>`

  


这样就可以对 CSS 值类型进行检测。这意味着，有了 `@property`，我们可以更清晰地定义自定义属性的类型，从而为动画提供更丰富的控制和可能性。这为我们提供了更多创造性的方式来使用 CSS 和动画。

  


例如上面的示例，我们可以这样来做：

  


```CSS
@layer animation {
    @property --radius {
        initial-value: 0;
        inherits: false;
        syntax: '<length-percentage>';
    }
    
    @keyframes radius {
        50% {
            --radius: 50%;
        }
    }
  
    .animated {
        --radius: 0;
    
        border-radius: var(--radius);
        animation: radius 1s linear infinite alternate;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf95d14167044b89afcc8fb812b918b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=500&s=117939&e=gif&f=40&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/bGzwEaJ

  


正如你所看到的，通过 `@property` 注册的自定义属性 `--radius` 应用于 `@keyframes` 中，浏览器也会对其进行插值计算，使动画平滑过渡。

  


这意味着，`@property` 为我们提供了很多创造丰富和有趣动画的可能性，因为我们可以在多个元素之间共享相同的自定义属性值，而这些属性值可以控制动画中的各种效果，如颜色、饱和度、亮度、位置、大小等。这种方法为我们提供了更大的创意自由度，以创建引人注目的交互效果。

  


例如下面这个按钮效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1168d1d7e7a64ff1a60b47c45ac7caaa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=444&s=633644&e=gif&f=148&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/XWOjXPp

  


```CSS
@layer animation {
    @property --hue {
        syntax: "<integer>";
        inherits: true;
        initial-value: 0;
    }
  
    @keyframes hueJump {
        to {
            --hue: 360;
        }
    }
  
    button {
        --border: hsl(var(--hue, 0) 0% 50%);
        --shadow: hsl(var(--hue, 0) 0% 80%);
        
        border-color: var(--border);
        box-shadow: 0 1rem 2rem -1.5rem var(--shadow);
        transition: transform 0.2s, box-shadow 0.2s;
        
        &:hover {
            --border: hsl(var(--hue, 0) 80% 50%);
            --shadow: hsl(var(--hue, 0) 80% 50%);
            
            animation: hueJump 0.75s infinite linear;
            transform: rotateY(10deg) rotateX(10deg);
        }
        
        &:active {
            transform: rotateY(10deg) rotateX(10deg) translate3d(0, 0, -15px);
            box-shadow: 0 0rem 0rem 0rem var(--shadow);
            animation-play-state: paused;
        }
    }
}
```

  


上面示例对颜色的色相 `--hue` 进行动画化，当用户鼠标悬停到按钮上时，边框颜色和阴影颜色的色相会从 `0deg` 过渡到 `360deg` 。因此你会看不到不一样的边框颜色和阴影颜色。

  


通过小册上一节课的学习，[我们知道 CSS 变换（transform）是构建流畅的 CSS 动画核心之一](https://juejin.cn/book/7288940354408022074/section/7295240572736897064)。但有的时候，在使用变换进行动画时，也会存在一些小问题，即在某些部分之间的过渡通常会出现问题，或者不会呈现出预期的效果。比如，下面这个经典案例，一个球被投掷的情况。我们希望它从点 `A` 到点 `B` ，同时模拟重力的效果。现实生活中，投掷球的运动就是如此。你可以会像下面这样定义一个 `@keyframes` ：

  


```CSS
@keyframes throw {
    0% {
        translate:-500% 0;
    }
    
    50% {
        translate:0 -250%;
    }
  
    100% {
        translate:500% 0;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b320b61f564e431a96b51115388540ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=550&s=402352&e=gif&f=61&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/dyapMMQ

  


你会发现，它看起来与我们们期望的完全不同。

  


在还没有 `@property` 之前，你可能会将上面这个动画分成两个动画来实现。其中一个动画水平移动，另一个动画垂直移动，从而模拟出带有重力的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb96f53bb8c949139f281e4ca6349958~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1434&h=590&s=964494&e=gif&f=82&b=e4e4e4)

  


当然，[你也可能想到了使用动画合成技术来实现](https://juejin.cn/book/7223230325122400288/section/7259316083402735674)。但在这里，我想告诉大家的是，借助 `@property` ，我们可以动画化变换的各个值，而且都在同一时间线上。通过定义自定义属性，然后在球上设置一个变换，我们可以改变变换这种工作方式。

  


```CSS
@property --x {
    inherits: false;
    initial-value: 0%;
    syntax: '<percentage>';
}

@property --y {
    inherits: false;
    initial-value: 0%;
    syntax: '<percentage>';
}

@property --rotate {
    inherits: false;
    initial-value: 0deg;
    syntax: '<angle>';
}

.ball {
    animation: throw 1s infinite alternate ease-in-out;
    transform: translateX(var(--x)) translateY(var(--y)) rotate(var(--rotate));
}
```

  


现在，对于我们的动画，我们可以根据关键帧来组合我们想要的变换：

  


```CSS
@keyframes throw {
    0% {
        --x: -500%;
        --rotate: 0deg;
    }
    50% {
        --y: -250%;
    }
    100% {
        --x: 500%;
        --rotate: 360deg;
    }
}
```

  


结果是什么？我们所希望的弯曲路径。而且，根据我们使用的不同缓动函数，我们可以使其看起来不同。我们可以将动画分成三部分，并使用不同的缓动函数。这将为球的移动方式产生不同的结果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5785bd5fd2f94bf0876c11b791193bd0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=486&s=557139&e=gif&f=87&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/poGEyPe

  


你甚至采用这种方式还可以制作出路径动画的效果。[比如下面这个由 @Jehy 提供的案例，小汽车绕着指定的路径行走](https://codepen.io/jh3y/full/jOVNqjv)：

  


```CSS
@layer animation {
    @property --x {
        inherits: false;
        initial-value: -22.5;
        syntax: "<number>";
    }
    
    @property --y {
        inherits: false;
        initial-value: 0;
        syntax: "<number>";
    }
    
    @property --r {
        inherits: false;
        initial-value: 0deg;
        syntax: "<angle>";
    }

    @keyframes journey {
        0% {
            --x: -22.5;
            --y: 0;
            --r: 0deg;
        }
        10% {
            --r: 0deg;
        }
        12.5% {
            --x: -22.5;
            --y: -22.5;
        }
        15% {
            --r: 90deg;
        }
        25% {
            --x: 0;
            --y: -22.5;
        }
        35% {
            --r: 90deg;
        }
        37.5% {
            --y: -22.5;
            --x: 22.5;
        }
        40% {
            --r: 180deg;
        }
        50% {
            --x: 22.5;
            --y: 0;
        }
        60% {
            --r: 180deg;
        }
        62.5% {
            --x: 22.5;
            --y: 22.5;
        }
        65% {
            --r: 270deg;
        }
        75% {
            --x: 0;
            --y: 22.5;
        }
        85% {
            --r: 270deg;
        }
        87.5% {
            --x: -22.5;
            --y: 22.5;
        }
        90% {
            --r: 360deg;
        }
        100% {
            --x: -22.5;
            --y: 0;
            --r: 360deg;
        }
    }

    .car {
        animation: journey 5s infinite linear;
        translate: calc(var(--x) * 1vmin) calc(var(--y) * 1vmin);
        rotate: var(--r);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3b13ed4a5484a7d821b85223152f407~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=522&s=166157&e=gif&f=43&b=4a4969)

  


> Demo 地址： （来源 [@Jehy](https://codepen.io/jh3y/full/jOVNqjv) ）

  


当然，你也可以使用 [CSS 的路径动画相关特性](https://juejin.cn/book/7223230325122400288/section/7259668703032606781)来实现上面示例的效果，但它已超出这节课的范畴，就不在这里向大家展示了。

  


虽然说，在 `@keyframes` 中不能直接对自定义属性动画化，但要是属性引用已定义的自定义属性的话，不会受到这方面的影响。比如下面这个呼吸灯的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad2aa89278254867a8d0663e5ba3fa30~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=546&s=715139&e=gif&f=214&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/poGEyYp

  


```CSS
@layer animation {
    @keyframes breath {
        0% {
            background: var(--colorStart);
            scale: var(--scaleStart);
        }
        100% {
            background: var(--colorEnd);
            scale: var(--scaleEnd);
        }
    }

    .container {
        --colorStart: #222;
        --colorEnd: #eee;
        color: var(--colorEnd);
    
        &:hover .bubble {
            --colorStart: hsl(340deg 82.92% 46.24%);
        }
    }

    .bubble {
        --scaleStart: 0.3;
        background: var(--colorStart);
        scale: var(--scaleStart);
        transition: background-color 2s ease-in-out;
        animation: breath 2s alternate infinite ease-in-out;
    
        :is(&:nth-child(1), &:nth-child(5)) {
            --scaleEnd: 1;
        }
    
        :is(&:nth-child(2), &:nth-child(4)) {
            --scaleEnd: 1.2;
            animation-delay: -250ms;
        }
    
        :is(&:nth-child(3)) {
            --scaleEnd: 1.6;
            animation-delay: -500ms;
        }
    }
}
```

  


注意，这里所不同的是，`@keyframes` 中的自定义属性 CSS 的变量，通过其他 CSS 属性引用。和直接在关键帧中使用自定义属性性质是完全不同的。

  


正如你所看到的，不管是 CSS 原生自定义属性还是 CSS 的 `@property` 定义的自定义属性，它们都能很好的帮助我们更容易创建出更好的帧动画效果。有关于 CSS 自定义属性相关的知识就不在这里阐述了，毕竟我们今天的主题是 CSS 的关键帧 `@keyframes` 。

  


### 关键帧与视图时间轴范围

  


“视图时间轴范围”是一个全新的概念，它隶属于 [CSS 滚动驱动动效](https://juejin.cn/book/7223230325122400288/section/7259272255786450981)的知识范畴，因此在这里不做过多阐述。它的出现给关键帧也带来了一定的变化。例如，一个图片淡入淡出的动画效果。以往我们会使用两个 `@keyframes` （关键帧）分别制作淡入（`fade-in`）和淡出（`fade-out`）效果：

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3de031e9943540cb8bde192945754b87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=584&s=11681090&e=gif&f=59&b=ced9df)

  


> Demo 地址： https://codepen.io/airen/full/GRzjqoj

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c8f8a16ca6547d5aedbfd88b2b45eb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=584&s=11681090&e=gif&f=59&b=ced9df)

  


> Demo 地址：https://codepen.io/airen/full/jOdMypv

  


正如你所看到的，动画元素（`.gallery__entry`）都有一个视图时间轴来装饰，该时间轴在元素穿过滚动视口时跟踪元素，并且附加了两个滚动驱动的动效。动画进入时的动画效果附加到时间轴的进入范围（例如，图片淡入效果附加到时间轴的 `entry` 范围），动画退出时的动画效果附加到时间轴的退出范围（例如，图片淡出效果附加到时间轴的 `exit` 范围）。

  


## 使用 @keyframes 创建更复杂的动画

  


阅读到这里，我想你已经可以使用 `@keyframes` 制作出自己想要的帧动画效果了，但我还是想通过一些实际的案例，向大家呈现一些你可能忽略或不太知道的 `@keyframes` 知识。这些知识将帮助你能更好的创建 Web 动画，甚至是可以创建出一些更复杂的动画。

  


我们先从简单的动画着手。

  


### 只有一个帧的 CSS 动画

  


假设你正在构建一个呼吸灯（或者说心跳）的帧动画。你可能会像下面这样编写 `@keyframes` ：

  


```CSS
@keyframes heartbeat {
    from { 
        scale: none; 
    }
    50% { 
        scale: 1.4; 
    }
    to { 
        scale: none; 
    }
}

.heartbeat {
    animation: heartbeat .5s infinite;
}
```

  


你可能已经发现问题所在了。在 `heartbeat` 帧动画中，你在 `from` 和 `to` 中都定义了 `scale: none` ，即在关键帧中重复两次。或许你已经想到了，可以将 `from` 和 `to` 关键帧选择器合并在一起：

  


```CSS
@keyframes pluse {
    from, to { 
        scale: none; 
    }
    50% { 
        scale: 1.4; 
    }
}
```

  


事实上，你根不需要在 `@keyframes` 中定义 `from` 和 `to` 这两个关键帧，因为它们基本上复制了 `.heartbeat` 规则中的相同状态（它的 `scale` 初始值为 `none` ，没有显式设置 `scale` 属性）。就这一点，[W3C 的 CSS 动画规范也有相应的描述](http://www.w3.org/TR/css3-animations/#keyframes)：

  


> 如果没有指定 `0%` 或 `from` 关键帧，则用户代理将使用正在进行动画处理的属性的计算值构造一个 `0%` 关键帧。如果没有指定 `100%` 或 `to` 关键帧，则用户代理将使用正在进行动画处理的属性的计算值构造一个 `100%` 关键帧。

  


也就是说，上面的 `@keyframes` 帧动画代码可以简化为：

  


```CSS
@keyframes heartbeat {
    50% {
        scale: 1.4;
    }
}
```

  


这个技巧非常有用，可以提供与第一个或最后一个关键帧相同的回退效果，而无需在 `@keyframes` 规则中重复定义它们。当你希望它们与已应用于元素的样式相同时，你可以省略每个动画中的 `from` 和 `to` 关键帧。

  


当然，为了使这个特定的动画看起来更自然，更明智的做法是像下面这样，仍然只使用一个关键帧（`from` 状态由浏览器动态生成）：

  


```CSS
@keyframes heartbeat {
    to { 
        scale:1.4; 
   }
}

.heartbeat {
    animation: heartbeat .25s infinite alternate;
}
```

  


它只是翻转了每个偶数次迭代，而不是在动画中同时具有两种状态（缩小和放大）。之所以这样做，动画看起来更自然，那是因为 `animation-direction: alternate` 也会反转反向迭代的时间（缓动）函数。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4f94342708d475d99afceb50ecabb2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=532&s=799684&e=gif&f=54&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/GRzjWyX

  


我们也常把这种动画称为交替动画，即动画的每个迭代之间来回切换，通常用于创建连续的往复效果。这意味着动画在正常方向（从 `0%` 到 `100%`）和反向（从 `100%` 到 `0%`）之间交替播放。

  


### 延迟关键帧动画

  


就 CSS 帧动画而言，一旦说起“延迟”这个关键词，我想大部分 Web 开发者首先会想到 `animation-delay` 属性。的确是这样，我们可以使用 `animation-delay` 属性来延迟帧动画的启动。例如：

  


```CSS
@keyframes move {
    to {
        translate: calc(100% + 50vw);
        rotate: 360deg;
    }
}

.ball {
    animation: move 5s infinite ease-in-out 2s;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7d94ffc32fa423893ded359eed2c76e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=410&s=440074&e=gif&f=274&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/rNPMmzp

  


你可能已经发现了。`animation-delay` 属性虽然可以使 `move` 动画延迟 `2s` 开始播放。不过，一旦 `move` 动画开始播放，它将持续播放。这也意味着，一旦 CSS 关键帧动画开始播放之后，`animation-delay` 是无法让其暂停，除非使用 JavaScript 相关的 API。

  


问题来了，如果我们需要使动画在关键帧之间暂停呢？解决方案就是**使用相同值的关键帧和一些数学计算，其中数学计算是用来精确计时我们的关键帧**。

  


以上面示例为例，不同的是，圆球总共花了 `1s` 时间，从左向右移动；然后停下来等 `4s` 之后再次执行从左向右移动的动画。即一个动画运行 `1s` ，然后延迟 `4s` 之后再次运行。就这个动画效果来说，看上去似乎很容易，但事实证明，CSS 帧动画并没有直接的解决方案，我们需要通过相同值的关键帧来模拟它。

  


使用相同值的关键帧来模拟延迟关键帧的动画，需要对关键帧进行一些精确计算。圆球运动 `1s` 之后停止 `4s` 后继续运动，如此一来，整个动画总共用时 `5s` ，即动画的持续时间是 `5s` ：

  


```CSS
.ball {
    animation: move 5s infinite ease-in-out;
    
    /* 动画持续时间 1 + 4 = 5 */
    animation-duration: 5s;
}
```

  


根据关键帧百分比与动画持续时间之间的关系，我们可以得知，关键帧动画 `move` 从 `0%` 至 `100%` 对应的持续时间是 `5s` 。为了使 `move` 动画仅过行 `1s` ，我们需要调整 `move` 关键帧，以便变化发生在总时间（`5s`）的五分之一处，也就是关键帧 `20%` 的位置。你可以关键帧中使用百分比值来实现这一点，就像这样：

  


```CSS
@keyframes move {
    /* 初始状态，动画的起始点 */
    0% {
        translate: none; 
        rotate: none;
    }
    /* 在 1s 时的中间状态（5s 的 20%）*/
    20% {
        translate: calc(100% + 50vw);
        rotate: 360deg;
    }
    /* 最终状态，动画的结束点 */
    100% {
        translate: calc(100% + 50vw);
        rotate: 360deg;
    }
}
```

  


这样，动画将从 `0%` 开始，在 `1s` 内达到关键帧的 `20%` 的位置，然后在剩下的 `4s` 内从 `20%` 继续到 `100%`。这使得动画按照预期在 `1s` 内运行。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db7b5018397a4fc5af49d91ea90504b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2278&h=1341&s=713887&e=jpg&b=f8f8f8)

  


上面的 `move` 关键帧动画的代码可以简写成下面这样：

  


```CSS
@keyframes move {
    20%, 50% {
        translate: calc(100% + 50vw);
        rotate: 360deg;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f20e806da3454fa5992ae4c1f97c60f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=414&s=145391&e=gif&f=152&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYxdjZL

  


使用同样的方法，我们再一起来构建一个稍微复杂一点的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/647ac1a581614b54b7060b21e98a382c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=580&s=1194028&e=gif&f=211&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/OJdRwRW

  


你也看到了，瓷娃（`.moon`）会绕着圣诞老人（`.orbit`）旋转（也是模拟月亮绕着行星旋转）。它和别的旋转效果有着明显的区别。

  


-   瓷娃绕着圣诞老人旋转时，分别在 `0deg` 、`90deg` 、`180deg` 、`270deg` 和 `360deg` 位置停止
-   `0deg` 至 `90deg` 旋转时，用时 `1s` ，然后会停止 `2s` ，再从 `90deg` 至 `180deg` 旋转，如此反复，总共重复 `4` 次

  


实现该效果的核心 CSS 代码如下：

  


```CSS
@layer animation {
    @property --rotateStart {
        inherits: false;
        initial-value: 0deg;
        syntax: "<angle>";
    }

    @property --rotateEnd {
        inherits: false;
        initial-value: 360deg;
        syntax: "<angle>";
    }

    @property --translate {
        inherits: false;
        initial-value: 0%;
        syntax: "<length-percentage>";
    }

    @keyframes spin {
        0% {
            --rotateStart: 0deg;
        }
        8.33%,
        25% {
            --rotateStart: 90deg;
        }
        33.333%,
        50% {
            --rotateStart: 180deg;
        }
        58.333%,
        75% {
            --rotateStart: 270deg;
        }
        83.333%,
        100% {
            --rotateStart: 360deg;
        }
    }

    .orbit::before {
        rotate: var(--rotateStart);
    }

    .moon {
        --translate: var(--radius);
        --rotateEnd: calc(360deg - var(--rotateStart));
        transform: rotate(var(--rotateStart)) translateX(var(--translate)) rotate(var(--rotateEnd));
    }

    .orbit::before,
    .moon {
        animation: spin 12s infinite linear;
    }
}
```

  


我们可以采用上一例的方法，来获得关键帧 `spin` 中的百分比值（即关键帧选择器）。

  


首先，你可以根据下面的公式计算出动画播放所需时间（动画持续时间）：

  


```
// 动画运行时间： 1s
// 动画暂停时间： 2s
// 迭代次数：    4

动画持续时间 = （动画运行时间 + 动画暂停时间）× 迭代次数 = （1s + 2s） × 4 = 12s
```

  


接着计算出关键帧的百分比（即关键帧选择器）。

  


```
动画运行时间百分比 = (动画运行时间 ÷ 动画持续时间) × 100
动画暂停时间百分比 = (动画暂停时间 ÷ 动画持续时间) × 100
```

  


这些百分比可以帮助你精确控制动画的时间和暂停段落。

  


```
// 动画运行时间： 1s
// 动画暂停时间： 2s
// 动画总时间（持续时间）： 12s

动画运行时间百分比 = (动画运行时间 ÷ 动画持续时间) × 100 = (1 ÷ 12) × 100 = 8.333%

动画暂停时间百分比 = (动画暂停时间 ÷ 动画持续时间) × 100 = (2 ÷ 12) × 100 = 16.663%
```

  


现在，我们将通过动画运行时间百分比和动画暂停时间百分比相加来初始化关键帧的百分比值，然后逐渐增加它，直到第四次迭代：

  


```
0s + 1s（动画运行时间）= 0% + 8.333% = 8.333% (1s)
1s (动画运行时间) + 2s（动画暂停时间）= 8.333% + 16.667% = 25% （3s） 👉🏿 第一次迭代

3s + 1s（动画运行时间） = 25% + 8.333% = 33.333% (4s)
4s + 2s（动画暂停时间） = 33.333% + 16.667% = 50% （6s） 👉🏿 第二次迭代

6s + 1s（动画运行时间）= 50% + 8.333% = 58.333% (7s)
7s + 2s（动画暂停时间）= 58.333% + 16.667% = 75% (9s) 👉🏿 第三次迭代

9s + 1s（动画运行时间）= 75% + 8.333% = 83.333% （10s）
10s + 2s（动画暂停时间）= 83.333% + 16.667% = 100% (12s) 👉🏿 第四次迭代
```

  


这就有了关键帧的选择器：

  


```CSS
@keyframes spin {
    0% {
        /* 0s: 动画初始状态 */
    }
    8.333% {
        /* 1s: 动画运行 1s */
    }
    25% {
        /* 3s: 动画运行 1s + 动画暂停 2s 👉🏿 第一次迭代 */
    }
    33.333% {
        /* 4s: 动画运行 1s + 动画暂停 2s + 动画运行 1s */
    }
    50% {
        /* 6s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s 👉🏿 第二次迭代 */
    }
    58.333% {
        /* 7s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s */
    }
    75% {
        /* 9s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s 👉🏿 第三次迭代 */
    }
    83.333% {
        /* 10s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s */
    }
    100% {
        /* 12s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s 👉🏿 第四次迭代 */    
    }
}
```

  


关键帧选择器已经有了，接下来要做的是，每个关键帧选择器中的样式规则是什么？

  


```CSS
.orbit::before {
    rotate: var(--rotateStart);
}

.moon {
    --translate: var(--radius);
    --rotateEnd: calc(360deg - var(--rotateStart));
    
    transform: rotate(var(--rotateStart)) translateX(var(--translate)) rotate(var(--rotateEnd));
}
```

  


瓷娃（`.moon`）绕着圣诞老人（`.orbit`）旋转 `360deg` 。在这个动画为，我们在 `.moon` 上运用了两个旋转函数，第一个是用于 `.moon` 绕着 `.orbit` 旋转（有点类似公转），第二个是用于 `.moon` 绕着自己旋转（有点类似自转），并且第二个 `rorate()` 函数旋转的角度是 `360deg` 减去第一个 `rotate()` 函数的旋转角度。

  


因为我们这个动画分四次旋转了 `360deg` ，所以每旋转一次对应的是 `90deg` ，即每次迭代是 `90deg` 。也就获得了每次迭代时 `--rotateStart` 的值：

  


```
// 第一次迭代
--rotateStart = 0deg + 90deg = 90deg

// 第二次迭代 
--rotateStart = 90deg + 90deg = 180deg

// 第三次迭代 
--rotateStart = 180deg + 90deg = 270deg

// 第四次迭代 
--rotateStart = 270deg + 90deg = 360deg
```

  


将计算出来的 `--rotateStart` 值放进相应的关键帧中：

  


```CSS
@keyframes spin {
    0% {
        /* 0s: 动画初始状态 */
        --rotateStart: 0deg;
    }
    8.333% {
        /* 1s: 动画运行 1s */
        --rotateStart: 90deg;
    }
    25% {
        /* 3s: 动画运行 1s + 动画暂停 2s 👉🏿 第一次迭代 */
        --rotateStart: 90deg;
    }
    33.333% {
        /* 4s: 动画运行 1s + 动画暂停 2s + 动画运行 1s */
        --rotateStart: 180deg;
    }
    50% {
        /* 6s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s 👉🏿 第二次迭代 */
        --rotateStart: 180deg;
    }
    58.333% {
        /* 7s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s */
        --rotateStart: 270deg;
    }
    75% {
        /* 9s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s 👉🏿 第三次迭代 */
        --rotateStart: 270deg;
    }
    83.333% {
        /* 10s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s */
        --rotateStart: 360deg;
    }
    100% {
        /* 12s: 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s + 动画运行 1s + 动画暂停 2s 👉🏿 第四次迭代 */  
        --rotateStart: 360deg;  
    }
}
```

  


代码简化一下，就得到最终想要的关键帧 `spin` 动画：

  


```CSS
@keyframes spin {
    0% {
        --rotateStart: 0deg;
    }
    8.333%,
    25% {
        --rotateStart: 90deg;
    }
    33.333%,
    50% {
        --rotateStart: 180deg;
    }
    58.333%,
    75% {
        --rotateStart: 270deg;
    }
    83.333%,
    100% {
        --rotateStart: 360deg;
    }
}
```

  


### 使用关键帧切换状态

  


使用 CSS 关键帧交换状态是一种涉及使用 CSS 关键帧来创建动画的技术或概念，这些动画看起来就像它们在不同状态或视觉表现之间进行了交换或过渡。这可以通过定义关键帧来描述两个或多个状态之间的中间步骤，然后将这些关键帧应用于 HTML 元素来实现。

  


假设你想让一个元素在一个状态停留 `9s` ，在另一个状态下停留 `1s` ，然后循环。这意味着，状态之间只是一个简单的切换，它们之间不需要任何平滑的过程。我们可以只在关键帧设置单个关键帧，并且结合 `steps(1)` 缓动函数来实现它。

  


```
A-A-A-A-A-A-A-A-A-B
```

  


我们整个关键就两个状态，即 `A` 和 `B` ，我们可以下面这样做：

  


```CSS
@layer animation {
    @keyframes toogleState {
        90% {
            background: teal;
        }
    }

    body {
        background: orangered;
        animation: toogleState 10s steps(1) infinite both;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1aba6cf68e814e5d9439e07fdde3b862~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=500&s=13518&e=gif&f=207&b=fd3c01)

  


> Demo 地址：https://codepen.io/airen/full/QWYKZBd

  


`body` 的背景色变为 `teal` 时只有 `1s` ，然后再切换回 `orangered`。

  


你可以根据需要，来调整关键帧中的选择器。例如：

  


```
A-A-A-A-A-A-A-A-A-B 👉🏿 90%
A-A-A-A-A-A-A-B-B-B 👉🏿 70%
A-A-A-A-A-B-B-B-B-B 👉🏿 50%
A-A-A-B-B-B-B-B-B-B 👉🏿 30%
A-B-B-B-B-B-B-B-B-B 👉🏿 90%
```

  


即：

  


```CSS
@keyframes s90 {
    90% {
        background: teal;
    }
}

@keyframes s70 {
    70% {
        background: teal;
    }
}

@keyframes s50 {
    50% {
        background: teal;
    }
}

@keyframes s30 {
    30% {
        background: teal;
    }
}

@keyframes s10 {
    10% {
        background: teal;
    }
}


.animated {
    background: orangered;
    animation: var(--animation-name) 10s steps(1) infinite both;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e7064f80f5f41cb9723df41376c9da1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1422&h=212&s=291142&e=gif&f=361&b=fc3c02)

  


> Demo 地址：https://codepen.io/airen/full/RwvGejm

  


现在，我们掌握了一个在定时循环中改变状态的很酷的技巧。如果你不想要循环部分，你可以让动画只运行一次并保持在那个状态，例如：

  


```CSS
@keyframes color {
    90% {
        background: teal;
    }
}

.animated {
    background: orangered;
    animation: color 10s steps(1) forwards;
}
```

  


在这里，我们只是去掉了使它重复的 `infinite` 关键字，而使用了 `forwards`，意思是“当它达到末尾时，保持在最终状态”。`both` 关键字也可以实现同样的效果。这个是 `animation-fill-mode` 属性的功能，小册后续课中会介绍。

  


但是如何在用户交互时从一个状态切换到另一个状态呢？这也是可能的！想象一下一个非常长时间的动画（比如，持续几天）。你可以将用户交互与在动画内跳转到不同位置（状态）相关联。以下是一个简单的示例，其中单击链接触发了一个 `:target` 状态，该状态又触发了一个动画，跳转到关键帧中的一个位置，该关键帧定义了该状态的样式：

  


```CSS
@layer animation {
    @keyframes stateChanger {
        50% {
            visibility: visible;
            opacity: 1;
            translate: 0% 0%;
        }
    }

    nav {
        translate: 100% 0;
        opacity: 0;
        visibility: hidden;
        transition: translate 0.2s ease-in, opacity 0.2s ease-in;
        animation: stateChanger 200000s steps(1) forwards;
    }

    nav:target {
        animation-delay: -100000s;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c6b00c49ea3473f818337c2c1f60a85~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=584&s=103289&e=gif&f=222&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/abXmRXR

  


使用 CSS 关键帧进行状态交换的具体实现和细节可以根据所需的效果和要进行动画处理的元素而有所不同。这是一种灵活和富有创意的方法，用于为 Web 界面增添互动性和视觉吸引力。

  


## 小结

  


这节课，主要和大家一起探讨了 CSS 帧动画中的 `@keyframes` 的基础知识、利弊，以及一些高级技巧和技术。简单的归纳一下：

  


-   **关键帧动画基础**：`@keyframes` 是 CSS 中的一种 `@` 规则，用于定义动画的每个步骤或关键帧。你可以在关键帧中指定元素在不同时间点的样式和状态。
-   **百分比值（关键帧选择器）** ：在关键帧中，你可以使用百分比值（`0%` 到 `100%`）来表示动画的进展。这些百分比值确定了元素在动画期间的外观。这些百分比值对应的是动画的持续时间，这意味着，它的计算是相对于 `animation-duration` 的值
-   **控制动画时间**：通过在关键帧中设置不同的百分比值，你可以控制动画的时间和速度。较小的时间间隔会使动画更快，而较大的时间间隔会使动画更慢。
-   **关键帧中的缓动函数**：可以在关键帧的每个选择器中设置缓动函数，这允许你创建不同的动画曲线，以实现更自然的动画。需要知道的是，每个关键帧选择器中定义的缓动函数是为下一个关键帧选择器服务的。

  


除了上述这些基本应用之外，`@keyframes` 还有一些小技巧，我们可以利用这些小技巧来实现延迟关键帧和状态切换等交互效果。

  


总之，CSS 的 `@keyframes` 提供了丰富的工具和技术，用于创建各种动画效果。通过深入了解这些概念和技巧，你可以在 Web 设计中实现引人注目的交互和视觉效果。继续实践和探索，你将成为一个高级的 CSS 动画师。