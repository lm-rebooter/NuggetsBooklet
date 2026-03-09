自 2007 年 Webkit 团队首次提出 [CSS 过渡动画（transition）和关键帧动画（animation）](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)已经有很多年了，而且 CSS 动画经过多年的发展已经非常的成熟，并且成为制作 Web 动画的关键技术之一。作为一名 Web 开发者，尤其是一名 CSS 崇拜者，我非常享受 CSS 动画给我带来的乐趣。

  


除此之外，CSS 动画也成为我开发 Web 动画的主要技术之一，它的简单性和出色的性能，能更好的帮助我完成创意和工作。然而，在享受这美好的过程当中，我不得不承认，CSS 的某些使其成为开发 Web 动画的主要工具之一，但在实际开发当中，它也存在一些缺陷，而且这些缺陷令 Web 开发者感到沮丧，例如：动态创建、播放控制和监听动画的生命周期等。

  


庆幸的是，Web Animations API（简称 WAAPI）很好的解决了这些问题。WAAPI 为 Web 开发者提供访问浏览器动画引擎的能力，定义了在各个浏览器中如何实现动画的重要概念。使得 Web 开发者除了 CSS 之外，又添一利器，能够以更灵活、更动态的方式创建 Web 动画。

  


在这节课，我将与大家一起深入探讨 WAAPI，从基础的概念到如何使用 WAAPI 创建和控制动画。通过实际案例，你将能更深入的了解 WAAPI ，并且能更好的使用它构建更灵活、交互性更强的 Web 动画。让你能够从容地在项目中应用这一现代 Web 动画的利器。

  


## 历史与现状

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2f23b36a6cf42c2b70a7749dbd0adfc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1207&h=781&s=33829&e=png&b=ffffff)

  


大约在 1998 年开始，[W3C 引入了 SMIL （Synchronized Multimedia Integration Language）标准](https://www.w3.org/TR/REC-smil/)，它为 SVG 引入了动画。那个时候，它是浏览器唯一需要担心的动画引擎，但它主要用于创建基于时间的多媒体呈现，包括音频、视频、文本和图形等元素的同步播放。SMIL 主要（或者说只能）用于动画 SVG 元素，而且非常复杂，兼容性也较差。

  


然而，随着时间的推移，Web 技术和标准发生了变化，新的技术崭露头角，尤其是 Webkit 团队推出 CSS 动画（过渡动画 `transition` 和关键帧动画 `animation`）之后，SMIL 技术在 Web 开发中的地位逐渐减弱，[Web 开发者更喜欢使用 CSS 特性来创作动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)。

  


虽然 CSS 已成为 Web 开发者创建动画主要工具之一，但它也有着自己的局限性，例如播放控制不方便、无法监听动画的生命周期等。因此，Mozilla Firefox 和 Google Chrome 团队的开发人员开始着手创建一种动画规范，以解决一切问题，即在所有浏览器中规范化动画功能。这个规范就是 [Web Animations API](https://www.w3.org/TR/web-animations-1/)（简称 WAAPI）。

  


WAAPI 为 Web 开发人员提供了访问浏览器动画引擎的途径，并描述了在各种浏览器中应用如何实现动画。换句话说，WAAPI 填补了声明式 CSS 动画和过渡与动态 JavaScript 动画之间的差距。这意味着，Web 开发者可以使用它来创造操作类似于 CSS 的动画，从一个预定义的状态到另一个状态，或者我们可以使用变量、循环和回调来创建交互式动画，使其能够适应和响应变化。

  


然而，到目前为止，大多数 Web 开发者要么是通过 CSS 的 `transition` 或 `animation` 来创作动画，要么是通过 JavaScript 修改内联样式创作动画。

  


CSS 过渡通常用于元素两个状态（开始状态和结束状态）之间的平滑过渡，Web 开发者可以通过其给定的时间函数、持续时间和延迟时间来控制 CSS 过渡动画。由于其简单性，因此常被用于制作一些基本动画效果，例如按钮悬浮效果：

  


```CSS
.button {
    opacity: .5; /* 开始状态 */
    transition: opacity .2s linear;
    
    &:hover {
        opacity: 1; /* 结束状态 */
    }
}
```

  


CSS 关键帧动画与过渡动画相比，它提供了更多的控制，比如迭代次数，动画方向，填充模式等。并且动画本身是通过关键帧 `@keyframes` 指定的，允许创建比 CSS 过渡更复杂的动画效果：

  


```CSS
@keyframes pluse{
    50% {
        sacle: 1.15;
        opacity: .5;
    }
}

.button:hover {
    animation: pluse .2s ease-in-out both alternate;
}
```

  


这两者都属性声明式动画，并且在单个元素上可以高性能的方式执行动画。当然，[它们都提供了像 animationend 这样的 JavaScript 事件](https://juejin.cn/book/7288940354408022074/section/7308623389638590505)，允许 Web 开发者在动画完成的时候做出反应，例如显示或隐藏一个元素，但它们在很多方面还是有较大的局限性的，比如要使动画与应用程序状态同步就比较困难，比如 Web 开发者不太好监听动画的生命周期。等等！

  


[即便 CSS 技术在这几年得到很快的发展](https://s.juejin.cn/ds/iLjX9fPt/)，提供了很多便于制作动画的特性，例如[动画合成](https://juejin.cn/book/7288940354408022074/section/7308623246604599307)、[路径动画](https://juejin.cn/book/7288940354408022074/section/7308623339038670860)、[视图过渡](https://juejin.cn/book/7288940354408022074/section/7308623298618163212)、[滚动驱动动效](https://juejin.cn/book/7288940354408022074/section/7307223031717724172)、[锚点定位](https://juejin.cn/book/7223230325122400288/section/7259669151743279159)以及 [CSS 的自定义属性 @property](https://juejin.cn/book/7223230325122400288/section/7258870477462962236) 和[三角函数](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)等，但 CSS 这种声明式创建的动画始终是简单动画的代名词。

  


也就是说，如果你要创建一个循环的，复杂的动画，仍然是基于 JavaScript 脚本或 JavaScript 库来实现，例如 [Greensock](http://greensock.com/) 、[AnimeJs](http://animejs.com/) 、[Animxyz](http://animxyz.com/) 、[Three.js](https://threejs.org/) 、[Velocity.js](http://velocityjs.org/) 、[Framer Motion](https://www.framer.com/motion/) 和 [Mo.js](https://mojs.github.io/) 等。Web 开发者基于 JavaScript 可以完全控制动画的时间和状态，并且还可以根据时间函数计算当前帧的状态等。

  


```JavaScript
const aniElement = document.getElementById('animated');
const initialOpacity = 0;
const targetOpacity = 1;
const durationTime = 5000;
let startTime;

function step(time) {
    if (!startTime) {
        startTime = time;
    }
    
    let progress = time - startTime
    // 计算动画进度，作为 0 到 1 之间的因子
    let factor = Math.min(progress / durationTime, 1);
    // 将初始状态和目标状态差异与计算的因子相乘，计算出当前透明度
    let currentOpacity = initialOpacity + (targetOpacity - initialOpacity) * factor;
    
    // 将计算出来的透明度应用到动画元素上
    aniElement.style.opacity = currentOpacity;
    
    // 如果尚未达到目标持续时间，则移动下一帧
    if(progress < durationTime) {
        window.requestAnimationFrame(step);
    }
}

// 启动动画
window.requestAnimationFrame(step);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f31b218eef6c49769a7319311a82d18e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=494&s=1037836&e=gif&f=144&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/bGZBdEW

  


过去，通过 `setInterval` 执行 JavaScript 动画循环以获得 `60fps` 的动画效果。如今，`requestAnimationFrame` 可以使我们获得更平滑的动画效果，因为浏览器会在下一次重绘之前调用它。浏览器还可以在标签页失去焦点时暂停`requestAnimationFrame`，以防止非活动标签以高帧率运行昂贵的动画。

  


尽管这种动画技术非常强大，但它需要在动画持续时间内每帧都进行大量计算。这可能导致卡顿或延迟，尤其是页面上发生其他事件的时候，例如切换到另一页的路由或进行某些数据获取和解析。浏览器在优化此类动画方面的方式也有限，因为它只知道当前帧，并且无法完全将动画卸载到 GPU 上。

  


即便是如此，Web 开发者可以通过 CSS 和（或）JavaScript 技术创作出更吸引人、创新和交互性更强的 Web 动画；但随着时间的推移，Web技术和标准发生了变化，包括 CSS 和 JavaScript 技术。就在这个发展过程中，新的技术崭露头角，例如 WAAPI。它可以以更加便利的方式，使 Web 开发者创作出性能更佳的 Web 动画，还能让浏览器在没有 Hack或 `Window.requestAnimationFrame()` 的情况下进行自身内部优化。

  


## WAAPI 简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7413b9115cc469d917a31575ac99a53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=670&s=12396&e=webp&b=cba6b9)

  


简单地说，[WAAPI （全称是 Web Animations API）](https://www.w3.org/TR/web-animations-1)是一套允许 Web 开发者通过 JavaScript 脚本创建动画并且控制动画的 API。它最早得到 Firefox 和 Safari 的支持，但 Chrome 和 Edge 进一步推进了 WAAPI 的发展，也为 Web 开发者带来了更多的功能，最为可贵的是可以实现跨浏览器互操作性。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79874c0fa66843cdabfae9cae60c23d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2670&h=1248&s=54250&e=png&b=ffffff)

  


WAAPI 打开了浏览器的动画引擎，使得 Web 开发者可能通过 JavaScript 脚本访问这些 API。这也意味着，Web 开发者可以通过 JavaScript 对动画进行开发和操作。该 API 的设计目的是为 CSS 动画（`transition` 和 `animation`）实现提供基础，并为未来的动画效果留下更多的可能性。

  


换句话说，WAAPI 被设计成 CSS 动画（`transition` 和 `animation`）的接口，通过这些 API，Web 开发者可以将交互式动画从样式表移到 JavaScript，并且将表现（CSS）与行为（JavaScript）分开。Web 开发者不再需要依赖 DOM 重的技术，例如将 CSS 属性和范围类写入元素来控制播放方向。与纯粹的声明式 CSS 不同，JavaScript 还允许我们动态地将属性值设置为持续时间。对于构建自定义动画库和创建交互式动画，WAAPI 可能是完成工作的完美工具。让我们看看它能做什么！

  


## WAAPI 的核心

  


从 W3C 定义的 [WAAPI 规范](https://www.w3.org/TR/web-animations-1/)的角度来看，整个体系是复杂的庞统的，甚至令人费解的，学习起来也是枯燥无味的。事实上，它也没有那么繁杂。简单地说，WAAPI 的核心将会涉及到两个模型：

  


-   [时间（Timing）模型](https://www.w3.org/TR/web-animations-1/#timing-model)
-   [动画（Animation）模型](https://www.w3.org/TR/web-animations-1/#animation-model)

  


除模型之外，WAAPI 还将涉及几个核心概念，即：

  


-   [时间轴对象（Timeline Objects）](https://www.w3.org/TR/web-animations-1/#timelines)
-   [动画对象（Animation Objects](https://www.w3.org/TR/web-animations-1/#animations)）
-   [动画效果对象（Animation Effects Objects）](https://www.w3.org/TR/web-animations-1/#animation-effects)

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71f4a464e0144f1182adb56287f0af2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2092&h=1644&s=243750&e=jpg&b=ffffff)

  


### 两个模型：Timing 和 Animation

  


WAAPI 运行在时间和动画两个模型之上，一个处理时间（Timing Model），另一个处理随时间发生的视觉变化（Animation Model）。

  


-   **时间模型（Timing Model）** ：在动画的单次迭代内，迭代进度使时间点转换为比例距离。由于某些动画每次重复时可能会发生变化，因此还会保留迭代索引
-   **动画模型（Animation Model）** ：动画模型将时间模型的迭代进度值和迭代索引转换为一系列要应用于动画模型的值

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b90948c2151c422da738157bb1f63a4a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3348&h=1120&s=200388&e=jpg&b=fef7f6)

时间模型（Timing Model）是使用 WAAPI 的基础，该模型跟踪动画在时间轴上的进度。

  


每个文档都有一个主时间轴（`Document.timeline`），它从页面加载的瞬间开始，直到窗口关闭结束。根据它们的持续时间，我们的动画沿着该时间轴分布。每个动画通过其 `startTime` 锚定到时间轴上的某一点，表示动画开始播放时沿文档时间轴的时刻。

  


所有动画的播放都依赖于这个时间轴：

  


-   搜索动画会将动画的位置沿时间轴移动
-   减缓或加速播放速率会在时间轴上压缩或扩展其分布
-   重复动画会使其沿时间轴排列额外的迭代

  


简单地说，时间模型主要关注动画的时序，允许 Web 开发者精确控制动画何时开始、结束，以及在播放期间的时间轴变化。这使得 Web 开发者可以根据需求调整动画的时序，实现更灵活的动画效果。

  


动画模型可以被看作是动画在其持续时间内在任何给定时间可能呈现的快照数组。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b67139c2b5864bb3904acc3731517384~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1915&h=732&s=219029&e=jpg&b=ffffff)

  


它提供了描述动画结构和行为的框架，使 Web 开发者能够以声明性的方式定义动画效果。通过关键帧、效果、动画组等概念，使得动画的创建更直观，同时支持复杂的动画组合。

  


这两个模型相互配合，使得 Web 开发者能够创建丰富、灵活且高性能的动画效果。时间模型提供了对时序的细致控制，而动画模型提供了描述和组织动画结构的框架。

  


### 核心概念

  


WAAPI 除了时间模型和动画模型之外，还涉及许多核心概念，例如时间轴对象（Animation Objects）、动画对象（Aanimation Objects）和动画效果对象（Animation Effect Objects）等。它们可以共同协作，我们可以对这些对象进行组装，就可以创建自己需要的动画。

  


#### 时间轴对象

  


在 WAAPI 中，时间对象指的是表示时间轴上的一段时间的实体，它主要用于管理动画的时间进度和持续时间，包含了动画在时间轴上的位置和时长信息。

  


通常情况下，我们的动画都是在文档时间轴上运行。因此，我们可以通过调用 `document.timeline` 或使用 `new AnimationTimeline()` 构建函数来创建：

  


```JavaScript
const timeline = document.timeline || new AnimationTimeline();
```

  


注意，文档时间轴（`document.timeline`）指的是文档的主时间轴，从页面加载一直延伸到无穷远，并且是全局共享的。

  


我们可以通过创建的时间对象在页面中统一管理所有动画的时间。

  


自从[滚动驱动动画](https://juejin.cn/book/7288940354408022074/section/7307223031717724172)出现之后，文档时间轴不再是页面唯一的时间对象了。与 `new AnimationTimeline()` 构造函数类似，我们可使用：

  


-   `new ScrollTimeline() 构造函数`创建了一个滚动进度时间轴对象，它可以被用于控制滚动进度时间轴动画
-   `new ViewTimeline() 构造函数`创建了一个视图进度时间轴对象，它可以被用于控制视图进度时间轴动画

  


```JavaScript
// 创建滚动进度时间轴对象
const scrollTimeline = new ScrollTimeline({
    source: document.documentElement,
    axis: "block",
});

// 创建视图进度时间轴对象
const viewTimeline = new ViewTimeline({
    document.querySelector(".subject"),
    axis: "block",
});
```

  


时间对象提供了一些属性和方法供我们使用。我们可以使用这些属性来获取或设置动画相关的参数：

  


-   `currentTime` ：获取或设置当前时间，表示动画的当前播放位置。
-   `startTime` ：获取或设置动画的起始时间，表示动画开始播放的时刻。
-   `paused` ：表示动画是否处于暂停状态，是一个只读属性。
-   `playbackRate` ： 获取或设置动画的播放速率，`1` 表示正常速率。

  


```JavaScript
const timeline = document.timeline || new AnimationTimeline();

// 获取或设置当前时间
console.log(timeline.currentTime);    // 获取当前时间
timeline.currentTime = 2000;          // 设置当前时间为2000ms

// 获取或设置动画的起始时间
console.log(timeline.startTime);      // 获取动画的起始时间
timeline.startTime = 1000;            // 设置动画的起始时间为1000ms

// 检查动画是否处理暂停状态
console.log(timeline.paused);         // 检查动画是否处于暂停状态

// 获取或设置动画播放速率
console.log(timeline.playbackRate);   // 获取当前播放速率
timeline.playbackRate = 2;            // 设置播放速率为2倍
```

  


这些属性允许你在运行时获取有关动画的信息，同时也提供了一些属性用于修改动画的状态，如设置当前时间、起始时间、播放速率等。通过这些属性，可以更精细地控制动画的播放过程。

  


我们可以使用时间对象的方法来控制时间，例如：

  


-   `play()` ：播放动画，如果动画已经在运行，会重新播放。
-   `pause()` ：暂停动画，保留当前播放状态。
-   `cancel()` ：取消动画，使其立即停止。
-   `finish()` ：将动画播放到末尾，结束动画。
-   `reverse()` ：反向播放动画。
-   `updatePlaybackRate(playbackRate)` ：异步更新动画的播放速率。
-   `persist()` ：将动画的替代状态设置为持久化。
-   `commitStyles()` ：将动画效果产生的当前效果值写入其相应效果目标的内联样式。

  


```JavaScript
const timeline = document.timeline || new AnimationTimeline();

// 启动或继续动画的播放
timeline.play();

// 暂停动画的播放。
timeline.pause();

// 取消动画，清除所有由该动画引起的效果
timeline.cancel();

// 将动画定位到效果的结束，完成播放
timeline.finish();

// 反转动画的播放方向。
timeline.reverse();

// 异步更新动画的播放速率。
timeline.updatePlaybackRate(2); // 将播放速率更新为2倍

// 将动画的替代状态设置为持久化
timeline.persist();

// 将动画效果产生的当前效果值写入其相应效果目标的内联样式
timeline.commitStyles();
```

  


通过这些方法，你可以在运行时控制动画的播放、暂停、定位、取消等行为，以及调整动画的速率和持久化状态。这些方法使得在使用 WAAPI 进行动画开发时能够更加灵活地操控动画效果。

  


有一点需要知道。由于 `document.timeline` 是全局共享的，因此它可以用于全局时间控制，即可以控制页面上所有动画的时间。例如，通过调整 `currentTime` 或 `pause` 或 `play` 来影响所有动画。

  


```JavaScript
document.timeline.currentTime = 1000;  // 设置全局当前时间
document.timeline.play();             // 播放全局动画
```

  


可以说，时间对象是 WAAPI 中一个重要的概念，通过它，可以更灵活地控制和管理动画的时间轴。理解时间对象的属性和方法，能够更好地使用 WAAPI 进行动画的时间控制。

  


我们通过一个简单的示例来向大家演示 WAAPI 中时间对象的使用。假设我们有一个简单的 HTML 结构和 CSS，其中包含了一个动画元素（`.animated` ）和一个按钮（`.button`）：

  


```HTML
<div class="animated"><!-- 我是一个动画元素 --></div>
<button class="button">Start Animation</button>
```

  


我们将使用 WAAPI 来对元素进行动画处理：

  


```JavaScript
// 获取时间对象
const timeline = document.timeline || new AnimationTimeline();

// 获取要进行动画的元素
const animationEle = document.querySelector('.animated');

// 获取按钮
const buttonHandler = document.querySelector('.button');

// 创建动画效果对象
const keyframes = [
    { translate: '0px' },
    { translate: '200px' }
];

const effect = new KeyframeEffect(animationEle, keyframes, { duration: 1000 });

// 创建动画对象，关联时间对象和动画效果对象
const animation = new Animation(effect, timeline);
    
// 点击按钮，开始播放动画
buttonHandler.addEventListener('click', () => {
    // 播放动画
    animation.play();
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f38a3335f8894a2cb479e8e700a808d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=556&s=453737&e=gif&f=119&b=34062f)

  


> Demo 地址：https://codepen.io/airen/full/LYaxpaL

  


#### 动画对象

  


你可以把动画对象想象成 DVD 播放器，把光碟想象成动画效果。我们都知道，DVD 主要用于控制光碟播放，但如果 DVD 中没有光碟，那么它就什么都不做。WAAPI 中的动画对象亦是如此，动画对象以动画效果的形式接受媒体，特别是关键帧效果。像 DVD 播放器一样，我们可以使用动画对象的方法来播放、暂停和控制动画的播放方向和速度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cb0eaa7cdd34e09ae73cdc441ae3d7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1344&h=456&s=51331&e=png&b=ffffff)

  


如果将动画对象比作 DVD 播放器，那么动画效果，或者关键帧效果，可以看作是 DVD（光碟）。关键帧效果是一组信息，包括至少一组关键帧及其需要进行动画处理的持续时间。动画对象接受这些信息，并使用时间轴对象组装出一个可播放的动画，我们可以观看和引用。

  


```JavaScript
// 创建动画效果对象
const keyframes = [
    { opacity: 0 },
    { opacity: 1 }
];

const effect = new KeyframeEffect(targetElement, keyframes, { duration: 1000 });

// 创建动画对象，关联动画效果对象和时间轴
const animation = new Animation(effect, document.timeline);
```

  


上面的代码中，我们创建了一个动画效果对象 `effect` ，通过定义两个关键帧来改变元素的透明度 `opacity` ；创建了动画对象 `animation` ，将动画效果对象 `effect` 和全局时间对象 `document.timeline` 关联。在这个案例中，`animation` 对象是 WAAPI 中的动画对象，通过它我们可以控制动画的播放。类似的动画对象可以用于创建更复杂的交互效果，例如页面过渡、元素的动态显示等。

  


#### 动画效果对象

  


正如上面所述，动画效果对象就好比 DVD 光碟。到目前为止，在 WAAPI 中（Level1 规范），动画效果对象主要是指 `KeyframeEffect 对象`。事实上，在未来（WAAPI 的 Level2 规范），动画效果对象还将会有[组效果（GroupEffect 对象）](https://www.w3.org/TR/web-animations-2/#the-groupeffect-interface)和[序列效果（SequenceEffect 对象）](https://www.w3.org/TR/web-animations-2/#the-sequenceeffect-interface)。

  


在这里我们主要来看一下 `KeyframeEffect` 对象。下面详细解释一下 `KeyframeEffect` 对象。

  


`KeyframeEffect` 对象表示动画的效果，即在动画过程中元素如何从一个状态过渡到另一个状态。它通过定义了一系列的关键帧来描述这个过渡过程。关键帧包含了在动画不同时间点上元素的样式属性值。例如：

  


```JavaScript
const keyframes = [
    { 
        opacity: 0, 
        translate: '0px' 
    },
    { 
        opacity: 1, 
        translate: '100%' 
    }
];

const effect = new KeyframeEffect(
    targetElement,      // 动画元素
    keyframes,          // 关键帧
    { duration: 1000 }  // 动画属性，这里设置动画持续时间
);
```

  


正如上面代码所示，我们使用 `new KeyframeEffect()` 构造函数定义了一个动画效果对象 `effect` 。在这个 `effect` 动画效果中，包括了三个部分：

  


-   `targetElement` ：要应用动画效果的目标元素（动画元素）。
-   `keyframes` ：由关键帧组成的数组，描述了动画过程中元素属性的变化（关键帧）。
-   `options` ：配置动画的参数，例如动画持续时间、缓动函数等。

  


`targetElement` 比较好理解，就是动画元素。

  


第二个部分是关键帧 `keyframe` ，它有点类似于 [CSS 中的 @keyframes ](https://juejin.cn/book/7288940354408022074/section/7295617447058407474)，不同的是，在 WAAPI 中，它是以数组形式来描述。例如：

  


```CSS
@keyframes ani {
    from {
        opacity: 0;
        translate: 0;
    }
    to {
        opacity: 1;
        translate: 100%;
    }
}
```

  


要是在 WAAPI 中的话，会像下面这样来描述上面的 CSS 关键帧：

  


```JavaScript
const ani = [
    // 相当于 from 或 0%
    {
        opacity: 0,
        translate: '0px'
    },
    // 相当于 to 或 100%
    {
        opacity: 1;
        translate: '100'
    }
]
```

  


数组中的每个对象（`{}`）就相当于 `@keyframes` 中的一个百分比选择器，同样是描述动画中某个时间点上元素属性的变化。我们来看一个更复杂的定义：

  


```CSS
@keyframes flash {
    from,
    50%,
    to {
        opacity: 1;
    }

    25%,
    75% {
        opacity: 0;
    }
}
```

  


```JavaScript
const flash = [
    // from （0%）
    {opacity: 1},
    // 25%
    {opacity: 0},
    // 50%
    {opacity: 1},
    // 75%
    {opacity: 0},
    // to （100%）
    {opacity: 1}
]
```

  


`KeyframeEffect` 对象的第三个部分是动画属性的相关配置项，用于定义动画的行为和外观，是用来定义动画的配置参数。常见的属性配置项有：

  


-   `duration` ：动画的持续时间，例如 `duration: 1000` ，接受一个数值，并且以 `ms` 为单位。类似于 [CSS 的 animation-duration](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)
-   `easing` ：动画的缓动函数，定义动画的在不同时间点之间的速度变化，例如 `easing: 'ease'` ，接受一个字符串。类似于 [CSS 的 animation-timing-function](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)
-   `delay` ：动画的延迟时间，例如 `delay: 500` ，和 `duration` 类似，接受一个数值，单位也是 `ms` 。类似于 [CSS 的 animation-delay](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)
-   `endDelay` ：在动画结束后延迟的毫秒数。在基于另一个动画的结束时间序列动画时，这个很有用。默认为 `0`。
-   `iterations` ：动画播放的迭代次数，可以是具体的次数（数值）或 `'infinite'` （字符串），例如 `iterations: 2` 表示动画循环播放两次。类似于 CSS 的 `animation-iteration-count`
-   `iterationStart` ：动画迭代的起始位置，通常是一个小数，表示动画的整个周期中的开始位置。例如 `iterationStart: 0.5` 表示从动画周期的中间位置（`50%`）开始播放
-   `iterationEnd` ：动画迭代的结束位置，通常是一个小数，表示动画的整个周期中的结束位置。示例: `iterationEnd: 0.8` 表示在动画周期的 `80%` 处结束。
-   `direction` ：动画的播放方向，可以是 `'normal'`（正向播放）、`'reverse'`（反向播放）、`'alternate'`（交替播放）或 `'alternate-reverse'`（交替反向播放）。类似于 [CSS 的 animation-direction](https://juejin.cn/book/7288940354408022074/section/7308548793962922025)
-   `fill` ：动画完成后，是否保持最后状态，可以是 `'none'`、`'forwards'`、`'backwards'` 或 `'both'`。类似于 [CSS 的 animation-fill-mode](https://juejin.cn/book/7288940354408022074/section/7307284837554585638)
-   `composite` ：确定在此动画和其他未指定自己特定合成操作的独立动画之间如何组合值。可以是 `add` 、`accumulate` 和 `replace` 。类似于 [CSS 的 animation-composite](https://juejin.cn/book/7288940354408022074/section/7308623246604599307)
-   `iterationComposite` ：确定值如何在此动画的迭代之间构建。可以是 `add` 、`accumulate` 和 `replace`

  


这些属性可以在创建 `KeyframeEffect` 对象时作为配置项传递，以定制动画的效果和行为。例如：

  


```JavaScript
const keyframes = [
    { 
        opacity: 0, 
        translate: '0' 
    },
    { 
        opacity: 1, 
        translate: '100%' 
    }
];

const effect = new KeyframeEffect(
    targetElement, 
    keyframes, 
    {
        duration: 1000,
        easing: 'ease-in-out',
        delay: 500,
        iterations: 2,
        direction: 'alternate',
        fill: 'forwards'
     }
 );
```

  


在这个示例中，定义了一个具有持续时间（`1000ms`）、缓动函数（`ease-in-out`）、延迟（`500ms`）、迭代次数（`2`）、播放方向（`alternate`）和填充模式（`forwards`）等属性的动画效果。

  


### 组装动画

  


在 WAAPI 中，我们可以使用 `Animation()` 构造函数或 `Element.animate()` 函数将动画的不同部分（时间轴对象、动画对象和动画效果对象）组装在一起，以创建一个可工作的动画。

  


这里简单地介绍一下。

  


使用 `Animation()` 构造函数可以创建 `Animation` 对象，该对象表示动画的主要控制器。通过此构造函数，可以设置动画的各种属性、包括动画持续时间、延迟时间、播放方向、循环播放次数等。例如：

  


```JavaScript
// 创建 Animation 对象
const animation = new Animation(
    document.getElementById('targetElement'),  // 动画元素
    keyframes,                                 // 关键帧
    options                                    // 配置动画参数
);

// 播放动画
animation.play();
```

  


你也可以直接在 `Element` 元素上调用 `.animate()` 函数，用于创建并播放动画。该函数接受关键帧、选项等参数，并返回一个 `Animation` 对象。例如：

  


```JavaScript
// 使用 Element.animate() 创建并播放动画
const targetElement = document.getElementById('targetElement'); // 动画元素
const animation = targetElement.animate(
    keyframes, // 关键帧
    options    // 配置动画参数
);
```

  


动画通常由关键帧（`keyframes`）序列定义，表示在动画的不同时间点上元素应该具有的样式。关键帧可以是单个样式对象，也可以是样式对象的数组。示例：

  


```JavaScript
const keyframes = [
    { translate: '0px' },
    { translate: '100%' }
];
```

选项（`options`）包括设置动画的各种属性，如持续时间、延迟、播放方向、迭代次数等。例如：

  


```JavaScript
const options = {
    duration: 1000,          // 持续时间为1秒
    delay: 500,              // 延迟0.5秒开始
    iterations: 2,           // 重复2次
    direction: 'alternate',  // 播放方向交替
    easing: 'ease-in-out',   // 动画缓动函数是 ease-in-out
    fill: 'both'             // 动画填充模式是 both   
};
```

  


通过组合这些部分，可以轻松地创建和控制动画。这使得在 Web 页面上实现丰富、交互式的动画效果变得更加方便。

  


## WAAPI 的应用

  


我想大家通过前面的学习，对 WAAPI 有了一定的认识。我还是想通过一些实际的案例来向大家阐述，在实际生产中应该如何使用 WAAPI 来创作动画。

  


### 先从 CSS 动画开始

  


虽然 WAAPI 都是一些用于制作动画的 JavaScript API，但它和 CSS 动画还是有很多相似之处。因此，从一个 CSS 动画着手是应用 WAAPI 最易于入门。

  


假设你有两个元素，一个是将要应用动画的元素 `.animated` ，另一个是按钮元素。

  


```HTML
<div class="animated"></div>
<button>Player</button> 
```

  


当你点击 `button` 按钮，将会应用一个名为 `tada` 的动画（该动画来自于 [Animation.css](https://animate.style/)）：

  


```CSS
@keyframes tada {
    from {
        transform: scale3d(1, 1, 1);
    }

    10%,
    20% {
        transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    }

    30%,
    50%,
    70%,
    90% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    }

    40%,
    60%,
    80% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    }

    to {
        transform: scale3d(1, 1, 1);
    }
}

.player {
    animation: tada 1s ease both;
}
```

  


```JavaScript
const animatedEle = document.querySelector('.animated');
const buttonHandler = document.querySelector('button');

buttonHandler.addEventListener('click', () => {
    animatedEle.classList.toggle('player');
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1d65783fdee416fa89c8bcda8056c23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=550&s=438888&e=gif&f=124&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/WNmRRzY

  


接下来，我们需要使用 WAAPI 相关的 API 来实现一个与上面相同的动画效果。

  


如果我们使用 WAAPI 实现一个与上例相同的动画效果，我们有两种方法：

  


```JavaScript
const animatedEle = document.querySelector('.animated');
const buttonHandler = document.querySelector('button');

// 创建动画效果
const effect = new KeyframeEffect(
    animatedEle,  // 应用动画的元素 .animated
    tada,         // tada 动画 （CSS @keyframes 定义的关键帧动画）
    options       // 动画配置参数 （CSS animation-* 属性对应的值）
)

// 创建动画对象，关联时间对象和动画效果对象
const animation = new Animation(
    effect,  // 动画效果
    timeline // 时间轴
)

// 动画播放
buttonHandler.addEventListener('click', () => {
    animation.play()
})
```

  


上面示例我们是使用 `new Animation()` 来构建的。另一种方法是 `element.animate()` 创建：

  


```JavaScript
const animatedEle = document.querySelector('.animated');
const buttonHandler = document.querySelector('button');

// 动画播放
buttonHandler.addEventListener("click", () => {
    // 创建动画对象并播放动画
    const animation = animatedEle.animate(
        tada, // tada 动画 （CSS @keyframes 定义的关键帧动画）
        options // 动画配置参数 （CSS animation-* 属性对应的值）
    );
});
```

  


不管是哪种方式（`new Animation()` 还是 `element.animate()`），我们要动元素 `.animated` 动起来，都需要 `tada` （关键帧）和 `options` （动画参数配置）。

  


首先来看关键帧 `tada` 的创建。在 WAAPI 中，有两种不同的格式来创建关键帧，第一种方式和 CSS 的 `@keyframes` 相似，将 CSS 属性定义在 JavaScript 对象中，并且将它们放在一个数组中。例如：

  


```JavaScript
// 创建关键帧
const tada = [
    {
        transform: "scale3d(1, 1, 1)" // 0%
    },
    {
        transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)" // 10%
    },
    {
        transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)" // 20%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" // 30%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)" // 40%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" // 50%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)" // 60%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" // 70%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)" // 80%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" // 90%
    },
    {
        transform: "scale3d(1, 1, 1)" // 100%
    }
];
```

  


注意，CSS 的属性需要使用驼峰（camelCase）的形式来描述，例如 `background-color` 需要写成 `backgroundColor` 。

  


在定义关键帧的时候，我们可以在每个对象（`{}`）中显式设置 `offset` ，这个 `offset` 可以指定关键帧中的每个百分比，类似于 `@keyframes` 中的百分比选择器，不同的是需要使用小数表示百分比：

  


```JavaScript
// 创建关键帧
const tada = [
    {
        transform: "scale3d(1, 1, 1)",
    },
    {
        transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)",
        offset: .1 // 10%
    },
    {
        transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)",
        offset: .2 // 20%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)";
        offset: .3 // 30%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)" 
        offset: .4 // 40%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",
        offset: .5 // 50%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",
        offset: .6 // 60%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)" ,
        offset: .7 // 70%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",
        offset: .8  // 80%
    },
    {
        transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",
        offset: .9  // 90%
    },
    {
        transform: "scale3d(1, 1, 1)" // 100%
    }
];
```

  


要是在对象中（`{}`）没有显式指定 `offset` ，动画时间则会被平均分配。例如：

  


```JavaScript
const keyframes = [
    { 
        opacity: 0  // 0%
    },
    {
        opacity: 1 // 50%
    },
    {
        opacity: 0 // 100%
    }
]
```

  


第二种定义关键帧的方式是以属性为 `key` ，属性的值为 `value` ：

  


```JavaScript
const tada = {
    transform:[
        "scale3d(1, 1, 1)", // 0%
        "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)", // 10%
        "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)", // 20%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)", // 30%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",  // 40%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)", // 50%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)", // 60%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",  // 70%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)", // 80%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)", // 90%
        "scale3d(1, 1, 1)"
    ]
}
```

  


这种方式同样也可以添加 `offset` 来指定关键帧的百分比：

  


```JavaScript
const tada = {
    transform:[
        "scale3d(1, 1, 1)", // 0%
        "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)", // 10%
        "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)", // 20%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)", // 30%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",  // 40%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)", // 50%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)", // 60%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",  // 70%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)", // 80%
        "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)", // 90%
        "scale3d(1, 1, 1)"
    ],
    offset: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]
}
```

  


不知道你是否还有印象，在介绍 [CSS 的 @keyframes 时](https://juejin.cn/book/7288940354408022074/section/7295617447058407474)，曾介绍过，我们可以在 `@keyframes` 的百分比选择器中显式声明 `animation-timing-function` 属性的值，以控制动画在这些关键帧之间的进展方式。例如：

  


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

  


在 WAAPI 中定义关键帧时，我们同样可以在每个对象中设置 `easing` 属性的值。在 WAAPI 中，我们可以将上面的 `@keyframes` 按下面的方式来定义：

  


```JavaScript
const flip = [
    {
        transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg)',
        offset: 0,
        easing: 'ease-out'
    },
    {
        transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)',
        offset: .4,
        easing: 'ease-out'
    },
    {
        transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)',
        offset: .5,
        easing: 'ease-in'   
    },
    {
        transform: 'perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
        offset: .8,
        easing: 'ease-in'
    },
    {
        transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
        offset: 1,
        easing: 'ease-in'
    }
]
```

  


创建完 `tada` 关键帧之后，我们可以定义 `options` ，这是一个对象，主要用来设置动画的相关参数，你可以简单的理解成，`options` 对象中定义的参数与 CSS 的 `animation-*` 相似。例如，前面 CSS 关键帧创建的动画：

  


```CSS
.player {
    animation: tada 1s ease both;
}
```

  


它相当于：

  


```CSS
.player {
    animation-name: tada;
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-fill-mode: both;
}
```

  


我们在 WAAPI 中定义 `options` 时，可以按下面方式来定义出与上面 CSS 代码中相似的动画参数：

  


```JavaScript
const options = {
    duration: 1000, // 等同于 animation-duration
    easing: 'ease', // 等同于 animation-timing-functin
    fill: 'both'    // 等同于 animation-fill-mode
}
```

  


正如前面所述，你还可以在 `options` 对象中配置动画其他的参数，例如迭代次数、播放方向等，具体的在这里就不重阐述了。

  


那么到了这里，使用 WAAPI 的 `new Animation()` 和 `element.animate()` 复刻 CSS 的 `tada` 动画就实现了。具体效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1b5a7298575489588a99c68a5c0998e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1640&h=464&s=1653722&e=gif&f=330&b=32062f)

  


上图中最左侧的是 [CSS 的 @keyframes 创建的动画效果](https://codepen.io/airen/full/WNmRRzY)，中间是 [WAAPI 的 new Animation() 创建的效果](https://codepen.io/airen/full/LYaxWPj)，右侧则是 `Element.animate() 创建的效果`。最终效果基本上是一致的，只是它们实现的方式略有差异，甚至可以说，WAAPI 的两种方式创建的动画，在控制方面略胜一筹，稍后会介绍。

  


### 创建一个复杂的动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d15a8df576f24ce78c9cabaf0dffe533~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=738&s=18807548&e=gif&f=192&b=ef155d)

  


> Demo 地址：https://codepen.io/airen/full/oNVByZO

  


这是 Web 中的一个典型的交互效果，即 Ripple Animation。当用户鼠标悬浮到图片上时，会有一个蓝色层覆盖整个图片，而且这个蓝色层是由小到大平滑过渡的；反之，当用户鼠标移出图片时，该蓝色层会由大到小，直到看不见为止，并且该蓝色层的圆心位置是随着鼠标移入图片的点而决定。

  


接下来，我们来看看如何使用 WAAPI 来实现上面这个效果。这个效果所对应的 HTML 很简单：

  


```HTML
<figure style="--grid-area: 1 / 1 / 13 / 4;">
    <img src="https://picsum.photos/1024/768?random=1" alt=""  />
    <div class="box"></div>
</figure>
```

  


示例中的蓝色过渡遮罩层就是 `.box` 元素。它初始的样式如下：

  


```CSS
.box {
    position: absolute;
    aspect-ratio: 1;
    width: var(--w, 0px);
    background-color:oklch(0.5 0.21 258.61/ .85);
    border-radius: 100%;
    will-change: scale, width, height, translate;
    transition: all .2s cubic-bezier(.2, 1, .2, 1);
    translate: var(--x, 0px) var(--y, 0px);
    scale: 0;
}
```

  


我们需要使用 WAAPI 分别给 `.box` 元素制作入场和离场两个动画：

  


```JavaScript
// 创建入场动画
const animationEnter = (element) => {
    const keyframes = [
        {
            scale: 0,
            mixBlendMode: "normal"
        },
        {
            scale: 1,
            mixBlendMode: "multiply"
        }
    ];
    
    const options = {
        duration: 600,
        fill: "forwards",
        easing: "cubic-bezier(.2, 1, .2, 1)",
        iterations: 1
    };
    
    element.animate(keyframes, options);
};

// 创建离场动画
const animationLeave = (element) => {
    const keyframes = [
        {
          scale: 1,
          mixBlendMode: "multiply"
        },
        {
          scale: 0,
          mixBlendMode: "normal"
        }
    ];
    
    const options = {
        duration: 400,
        fill: "forwards",
        easing: "cubic-bezier(.2, 1, .2, 1)",
        iterations: 1
    };
    
    element.animate(keyframes, options);
};
```

  


这两个使用 WAAPI 创建的 `animationEnter` 和 `animationLeave` 动画都是使用 `Element.animate()` 创建的，在关键帧 `keyframes` 中对元素的 `scale` 的 `mixBlendMode` （即 CSS 的 `mix-blend-mode` 属性）属性做动画化处理。相当于给 `.box` 应用下面这两个 CSS 动画：

  


```CSS
@keyframes animationEnter {
    form {
        scale: 0;
        mix-blend-mode: normal;
    }
    to {
        scale: 1;
        mix-blend-mode: multiply;
    }
}

@keyframes animationLeave {
    from {
        scale: 1;
        mix-blend-mode: multiply;
    }
    to {
        scale: 0;
        mix-blend-mode: normal;
    }
}

.box {
    animation: animationLeave 400ms cubic-bezier(.2, 1, .2, 1) 1 forwards;
    
    figure:hover & {
        animation: animationEnter 600ms cubic-bezier(.2, 1, .2, 1) 1 forwards;
    }
}
```

  


然后将 WAAPI 创建的 `animationEnter` 和 `animationLeave` 动画应用到 `.box` 元素上：

  


```JavaScript
const figures = document.querySelectorAll("figure");

figures.forEach((figure) => {
    figure.addEventListener("mouseenter", (event) => {
        const element = event.target.querySelector(".box");
        const coords = getCoords(event.target.getBoundingClientRect());
        const radius = circleSize(event.target.getBoundingClientRect(), coords);
    
        circleConstraints(element, coords, radius);
        animationEnter(element);
    });

    figure.addEventListener("mouseleave", function (event) {
        const element = event.target.querySelector(".box");
        animationLeave(element);
    });
});
```

  


如此一来，我们就通过 WAAPI 构建了一个更为复杂的交互动画效果。该示例所有 JavaScript 代码如下：

  


```JavaScript
const figures = document.querySelectorAll("figure");

figures.forEach((figure) => {
    figure.addEventListener("mouseenter", (event) => {
        const element = event.target.querySelector(".box");
        const coords = getCoords(event.target.getBoundingClientRect());
        const radius = circleSize(event.target.getBoundingClientRect(), coords);
    
        circleConstraints(element, coords, radius);
        animationEnter(element);
    });

    figure.addEventListener("mouseleave", function (event) {
        const element = event.target.querySelector(".box");
        animationLeave(element);
    });
});

// 创建入场动画
const animationEnter = (element) => {
    const keyframes = [
        {
            scale: 0,
            mixBlendMode: "normal"
        },
        {
            scale: 1,
            mixBlendMode: "multiply"
        }
    ];
    const options = {
        duration: 600,
        fill: "forwards",
        easing: "cubic-bezier(.2, 1, .2, 1)",
        iterations: 1
    };
    element.animate(keyframes, options);
};

// 创建离场动画
const animationLeave = (element) => {
    const keyframes = [
        {
            scale: 1,
            mixBlendMode: "multiply"
        },
        {
            scale: 0,
            mixBlendMode: "normal"
        }
    ];
    const options = {
        duration: 400,
        fill: "forwards",
        easing: "cubic-bezier(.2, 1, .2, 1)",
        iterations: 1
    };
    element.animate(keyframes, options);
};

// 获取坐标
const getCoords = (rectangle) => {
    const xPos = rectangle.width * Math.random();
    const yPos = rectangle.height * Math.random();
    return {
        x: xPos,
        y: yPos
    };
};

// 圆形大小
const circleSize = (rectangle, coords) => {
    const x1 = coords.x;
    const y1 = coords.y;
    const rectCoords = [
        {
            x: 0,
            y: 0
        },
        {
            x: 0,
            y: rectangle.height
        },
        {
            x: rectangle.width,
            y: 0
        },
        {
            x: rectangle.width,
            y: rectangle.height
        }
    ];
    
    return Math.max(
        ...rectCoords.map((el) => {
            const x2 = el.x;
            const y2 = el.y;
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        })
    );
};

// 改变圆大小和位置
const circleConstraints = (element, coords, radius) => {
    element.style.setProperty(`--w`, `${radius * 2}px`);
    element.style.setProperty(`--x`, `${coords.x - radius}px`);
    element.style.setProperty(`--y`, `${coords.y - radius}px`);
};
```

  


### 操控动画

  


正如小册的《[CSS 动画的播放方式：暂停、恢复和重播](https://juejin.cn/book/7288940354408022074/section/7304648624272015372)》课程中所述，虽然我们可以使用 `animation-play-state` 属性控制关键帧动画暂停播放（`paused`）和恢复播放（`running`），但该属性并无法使关键帧动画重播。就这一点而言，它是 CSS 动画致命的缺点之一。有时候为了控制动画能重播，不得不借助 JavaScript 来实现。

  


```JavaScript
 // 重播动画
const restartAnimations = (aniEl, animn) => {
    aniEl.style.setProperty(`--animn`, "none");
    requestAnimationFrame(() => {
        setTimeout(() => {
            aniEl.style.setProperty(`--animn`, `${animn}`);
            aniEl.style.setProperty(`--animps`, "running");
        }, 0);
    });
};
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ee8fa0ef4964e3dba2088b85a5ec2ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=508&s=793029&e=gif&f=337&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/OJdoRRJ

  


相比之下，WAAPI 就要灵活地很多。

  


虽然我们可以使用 WAAPI 编写 CSS 动画，但其 API 真正派上用场的是操控动画。也就是说，WAAPI 提供了一系列用于[控制动画的 API](https://www.w3.org/TR/web-animations-1/#the-animation-interface)：

  


-   `play()` ：启动或继续播放动画
-   `pause()` ：暂停动画的播放
-   `cancel()` ：取消动画，并清除所有由该动画引起的效果
-   `reverse()` ：反转动画的播放方向
-   `updatePlaybackRate(playbackRate)` ：异步更新动画的播放速率
-   `finish()` ：将动画设置为完成状态，即立即将其移到最后的关键帧
-   `replaceState()` ：提供了一种跟踪动画是处于活跃状态、持久保留还是已移除的方法
-   `commitStyles()` ：会根据底层样式更新元素的样式，以及元素上的所有动画（按合成顺序）
-   `persist()` ：用于将动画标记为不可替换
-   `onfinish` ：设置或获取动画完成时触发的事件处理程序
-   `oncancel` ：设置或获取动画取消时触发的事件处理程序
-   `ready` ：可以让你等待更改项生效（即在播放或暂停等播放控制方法之间切换）
-   `finished` ：提供了一种在动画播放完毕后执行自定义 JavaScript 代码的方法

  


这些 API 允许 Web 开发者对动画进行各种控制和交互，包括播放、暂停、取消、完成、反转等操作。通过结合使用这些 API，可以实现对动画的精细控制和定制。

  


接下来，我们来看看这些 API 是如何操控动画的。假设你有下面这样的一个动画：

  


```HTML
<div class="loader">
    <div class="animated"></div>
</div>
```

  


```CSS
.loader {
    container-type: inline-size;    
    width: 300px;
    height: 1.5rem;
    border-radius: 999rem;
    color: #514b82;
    border: 2px solid;
    position: relative;
    
    .animated {
        position: absolute;
        margin: 2px;
        width: 25%;
        top: 0;
        bottom: 0;
        left: 0;
        border-radius: inherit;
        background: currentColor;
    }
}
```

  


```JavaScript
const animatedEle = document.querySelector(".animated");

const keyframes = [
    {
        translate: 'calc(100cqi - 75px)',
        offset: .5
    }
]

const options = {
    duration: 1000,
    easing: 'linear',
    iterations: Infinity
}

const animation = animatedEle.animate(keyframes, options);
```

  


上面示例的动画效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/134a8d1b4f82468c9b84f70293bc12b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=476&s=87886&e=gif&f=91&b=320631)

  


这是一个简单的 Loading 动画效果。在上面示例的基础上添加一些按钮，并给监听这些按钮的点击（`click`）事件。这些按钮只做一件事，那就是触发 WAAPI 控制动画的 API，例如 `play()` 、`pause()` 等。

  


```HTML
<div class="actions">
    <button class="play">Play</button>
    <button class="pause">Pause</button>
    <button class="reverse">Reverse</button>
    <button class="cancel">Cancel</button>
    <button class="finish">Finish</button>
</div>
```

  


```JavaScript
const action = document.querySelector(".actions");

action.addEventListener('click', (event) => {
    const targetClassName = event.target.className;
    
    if(targetClassName === 'play') {
        // 播放动画
        animation.play();
    } else if (targetClassName === 'pause'){
        // 暂停动画
        animation.pause();
    } else if (targetClassName === 'reverse'){
        // 反向播放
        animation.reverse();
    } else if (targetClassName === 'cancel'){
        // 取消动画
        animation.cancel();
    } else if (targetClassName === 'finish'){
        // 结束动画
        animation.finish();
    }else {
        return false;
    }
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1c484d02e8f49d5bfcc317d5b18b488~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=542&s=780474&e=gif&f=356&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/oNVBQzb

  


注意，如果动画设置了无限次循环播放，点击 `Finish` 按钮触发 `animation.finish()` 方法时，浏览器会报错：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2b759260fc0431b9d19a59929286f8f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3318&h=788&s=207177&e=jpg&b=fffefe)

  


因此，你会发现上面的案例存在程序上的错误。为了能向大家展示这几个函数的作用，我将动画持续时间调长，并且动画只播放一次：

  


```JavaScript
const options = {
    duration: 6000,
    easing: 'linear'
    // iterations: Infinity
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03a732de4a894953a987f64f3a5ae37d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=476&s=1232238&e=gif&f=446&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/zYbNyBo

  


动画编排一直是构建复杂动画和多动画的有效技巧之一。但在 CSS 动画中，通常依赖[动画的持续时间和延迟时间](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)或者[动画相关事件](https://juejin.cn/book/7288940354408022074/section/7308623389638590505)，例如 `transitionend` 或 `animationend` 来对动画进行编排。虽然这些方式也能帮助 Web 开发者对动画进行编排，但相比于 WAAPI 而言，WAAPI 在这方面具有天然的优势。

  


在 WAAPI 中，我们可以通过 `onfinish` 、`oncancel` 事件处理程序或监听 `finish` 和 `cancel` 事件以及 `ready` 和 `finished` 两个 Promise。它们使得我们编排动画变得更容易，这也意味着，我们可以构建更复杂的动画效果。

  


拿 `finished` 为例，假设你希望在动画元素 `.animated` 上应用 `fadeIn` 和 `swing` 两个动画效果，而且 `swing` 动画要在 `fadeIn` 动画结束那一刻才执行。如果使用 CSS 来制作的话，一般会像下面这样：

  


```CSS
@keyframes fadeIn {
    from {
        opacity: 0.1;
    }
    to {
        opacity: 1;
    }
}

@keyframes swing {
    0% {
        rotate:0 0 1 30deg;
    }
    100% {
        rotate: 0 0 1 -30deg;
    }
}

.animated {
    animation: fadeIn 1s ease-in both, swing 2s ease-in-out 1s infinite alternate;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03f7aebede4346fbbf54e8cd33530d10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=560&s=1239671&e=gif&f=178&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/PoLWgPd

  


我们可以使用 WAAPI 的 `finished` 来创建一个编写的动画链，实现上面的 CSS 动画效果：

  


```JavaScript
const animatedEle = document.querySelector(".lamp");
const playHandler = document.querySelector(".play");

// 创建 fadeIn 关键帧
const fadeIn = [
    { opacity: .1},
    { opacity: 1}, 
];

// fadeIn 动画参数
const fadeInOptions = {
  duration: 1000,     // 动画持续 1s
  iterations: 1,      // 播放 1 次
  easing: 'ease-in',  // 动画缓动函数为 ease-in
  fill: 'both'        // 动画填充模式为 both
}

// 创建 swing 关键帧
const swing = [
  { rotate: '0 0 1 30deg'},
  { rotate: '0 0 1 -30deg'}, 
];

// swing 动画参数
const swingOptions = {
  duration: 2000,        // 动画持续时间为 2s
  iterations: Infinity,  // 动画无限次循环播放
  easing: 'ease-in-out', // 动画缓动函数为 ease-in-out
  direction: 'alternate' // 动画来回播放
}

playHandler.addEventListener('click', () => {
    // 点击 Play 按钮，先播放 fadeIn 动画
    const animation = animatedEle.animate(fadeIn, fadeInOptions);
    
    // fadeIn 动画结束时开始播放 swing 动画
    animation.finished.then(() => {
        animatedEle.animate(swing, swingOptions)
    });
})
```

  


在执行链中的下一个动画集（`swing`）之前，我们已使用 `animation.finished.then()` 将这些动画链接起来。这样，动画就会按顺序显示，你甚至可以通过设置不同的选项集（例如速度和易用性）将效果应用于不同的目标元素。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/590707c1b9f34ceeaf499228f0b4e981~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=536&s=940693&e=gif&f=105&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/VwRPNyd

  


你也可以创建两个等待播放的动画 `fadeIn` 和 `swing` ，然后暂停其中一个动画，比如 `swing` ，将其延迟，直到另一个动画 `fadeIn` 播放完毕。然后，你可以使用 Promise 来等待每个执行完毕，然后再播放。最后，你可以查看是否设置了标记，然后倒放每个动画。

  


```JavaScript
const animatedEle = document.querySelector(".lamp");
const playHandler = document.querySelector(".play");

const fadeIn = [{ opacity: 0.1 }, { opacity: 1 }];

const fadeInOptions = {
    duration: 1000, 
    iterations: 1, 
    easing: "ease-in", 
    fill: "both" 
};

const swing = [{ rotate: "0 0 1 30deg" }, { rotate: "0 0 1 -30deg" }];

const swingOptions = {
    duration: 2000,
    iterations: Infinity,
    easing: "ease-in-out",
    direction: "alternate"
};

// 设置标记
let play = false;

playHandler.addEventListener("click", () => {
    const anim1 = animatedEle.animate(fadeIn, fadeInOptions);
    const anim2 = animatedEle.animate(swing, swingOptions);
    
    // 获取页面中所有动画
    let animations = document.getAnimations();
    
    // 如果标记为 true ，反向播放所有动画
    if (play) {
        animations.forEach((anim) => {
            anim.currentTime = anim.effect.getTiming().duration;
            anim.reverse();
        });
        animations = animations.reverse();
    }

    // swing 动画暂停播放
    animations[1].pause();
    
    // fadeIn 动画播放完了才播放 swing 动画
    animations[0].finished.then(() => {
        animations[1].play();
    });
    
    // 将标记重置为 true
    play = !play;
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c3f45a890a7477a964030d703f7aa00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=576&s=3172931&e=gif&f=371&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/qBvRGEM

  


为了节约时间，我没有重新设计案例。你可以尝试着按上面示例的方式重新设计一个链式动画，比如模态框组件入场动画，你可以给模态框容器定义一个动画，例如 `slideIn` ，然后给模态框的内容定义一个 `fadeIn` 动画，当模态框容器的 `slideIn` 运行完毕之后再执行模态框内容上的 `fadeIn` 动画。

  


使用 WAAPI 制作动画时，还可以与动画的部分关键帧进行交互。比如下面这个示例，整个动画只有一个关键帧，并且没有指定起始位置。此时，鼠标处理程序会执行一些操作：给动画元素设置新的结束位置并触发新动画。系统会根据当前的底层位置推断新的起始位置。

  


```JavaScript
const animatedEle = document.querySelector('.overlay');

const handleClick = (etv) => {
    let sibling = etv.target;
    while (sibling.parentElement != animatedEle.parentElement)
        sibling = sibling.parentElement;
    let x = sibling.offsetLeft;
    let y = sibling.offsetTop - animatedEle.parentElement.offsetTop;
    const keyframes = [
        {
            translate: `${x}px  ${y}px`
        }
    ]
  
    const options = {
        duration: 1000,
        easing: 'ease',
        fill: 'forwards'
    }
    
    animatedEle.animate(keyframes, options)
}

const figures = document.querySelectorAll('.container > img');

figures.forEach(figure => {
    figure.addEventListener('click', handleClick)
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6007ab80c66f414fb6715c2dd241e16f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=546&s=17129963&e=gif&f=151&b=dfd3cf)

  


> Demo 地址：https://codepen.io/airen/full/GReWqWW

  


新的过渡可以在现有过渡仍在运行时触发。这意味着当前过渡会中断，并且系统会创建新的过渡。

  


WAAPI 除了能帮助 Web 开发者更好控制动画之外，在性能上也有明显的优势。例如，我们在基于 `mousemove` 事件创建鼠标跟随动画时，每次都会创建一新的动画，这可能会快速消耗内存并降低性能。我们可以通过 WAAPI 创建一个可替换的动画，从而实现自动清理，将已完成的动画标记为可替换，并在被其他结束的动画替换后自动移除。

  


```JavaScript
let animationTally = 0;
const tally = document.querySelector('.tally');
const indicators = document.querySelectorAll('.indicator');

document.body.addEventListener('mousemove', evt => {
    let duration = 30;
    let opacity = 0.8;
    let size = 10;
    const x = evt.clientX;
    const y = evt.clientY;
  
    indicators.forEach(indicator => {
        indicator.style.opacity = opacity;
        indicator.style.width = `${size}px`;
        indicator.style.height = `${size}px`;
        const keyframes = [
            {
                translate: `${x}px ${y}px`
            }
        ]
        const options = {
            duration: duration,
            fill: 'forwards'
        }
        const anim = indicator.animate(keyframes, options);
        anim.onremove = () => {
            tally.textContent = `${++animationTally}`;
        };
        duration *= 2;
        size *= 0.9;
        opacity *= 0.8;
    });
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f45a915c080401ab5945e4e990a988b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=554&s=586476&e=gif&f=189&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/qBvrNyZ

  


每次鼠标称动时，浏览器都会重新计算每个玫红色圆点的位置，并为这个新点创建动画。现在，浏览器可以在以下情况下移除旧动画（启用替换）：

  


-   动画播放完毕。
-   存在一个或多个复合排序顺序更高的动画也已完成。
-   新动画将为相同的属性添加动画效果。

  


你可以通过将计数器与每个已移除的动画汇总起来，并使用 `anim.onremove` 触发计数器，从而了解被替换的动画的确切数量。你还可以通过一些其他方法进一步控制动画：

  


-   `animation.replaceState()` 提供了一种跟踪动画是处于活跃状态、持久保留还是已移除的方法
-   `animation.commitStyles()` 会根据底层样式更新元素的样式，以及元素上的所有动画（按复合顺序）
-   `animation.persist()` 用于将动画标记为不可替换

  


> **注意** ：**`animation.commitStyles()`** 和 **`animation.persist()`** 常与合成模式（例如 `add`）一起使用。

  


如此一来，我们可以在很多交互场景中运用该特性，制作出更具创意的带动画的交互效果，比如下面这个点赞按钮的效果，点击按钮时会有简单的粒子动画效果，当动画结束时，可以删除这些粒子：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fff2bae42884f32bb9786bceed828be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=552&s=454310&e=gif&f=168&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/XWGMjJm

  


详细代码请参阅示例源码！

  


在 CSS 中，我们可以通过[使用 animation-composition 属性](https://juejin.cn/book/7288940354408022074/section/7308623246604599307)对动画进行合成操作，它将影响所有动画属性，无论元素是否应用一个或多个动画。在 WAAPI 中，你也可以设置动画的合成模式，它允许 Web 开发者编写不同的动画，并控制效果的组合方式。

  


当你合成动画时，Web 开发者可以编写简短的独特效果，并将它们组合在一起。例如下面这个效果，第一个是 `slideInDown` 动画，下拉菜单从页面顶部向下移动；第二个是 `bounce` 动画，它是一个微动画，下拉菜单在贴近底部时会有一个小弹跳。使用 `add` 复合模式可以实现更顺畅的动画效果。

  


```JavaScript
let visibleMenu = undefined;
const dropMenu = document.body.querySelector(".dropmenu");
const menuBar = document.body.querySelector(".menu");
const menuBarHeight = menuBar.clientHeight;
const dropMenuHeight = dropMenu.clientHeight;
const menuItems = document.body.querySelectorAll(".menu--item");


async function displayMenu(name, yOffset) {
    if (visibleMenu) {
        await hideMenu();
    }
  
    document.getElementById(name).classList.add("active");
    visibleMenu = name;
    dropMenu.style.left = `${yOffset}px`;
    const dropMenuHeight = dropMenu.clientHeight;
    const menuBarHeight = menuBar.clientHeight;
    const maxOvershoot = 12;
  
    dropMenu.style.setProperty(`--top`, `0px`);

    const slideInDownKeyframes = [
        {
            translate: `0 ${-dropMenuHeight}px`,
            easing: "ease-in"
        },
        {
            translate: `0 ${menuBarHeight}px`
        }
    ];

    const slideInDownOptions = {
        duration: 300,
        fill: "forwards"
    };

    const slideInDown = dropMenu.animate(
        slideInDownKeyframes,
        slideInDownOptions
    );

    const bounceKeyframes = [
        {
            translate: `0px 0px`,
            easing: "ease-in"
        },
        {
            translate: `0px ${maxOvershoot}px`,
            easing: "ease-out"
        },
        {
            translate: `0px 0px`,
            easing: "ease-in"
        },
        {
            translate: `0px ${-maxOvershoot / 2}px`,
            easing: "ease-out"
        },
        {
            translate: `0px 0px`,
            easing: "ease-in"
        }
    ];

    const bounceOptions = {
        duration: 300,
        composite: "add"
    };

    slideInDown.finished.then(() => {
        const bounce = dropMenu.animate(bounceKeyframes, bounceOptions);
    });
}

function hideMenu() {
    let promise = new Promise((resolve, reject) => {
        if (!visibleMenu) {
            resolve();
            return;
        }
        document.getElementById(visibleMenu).classList.remove("active");
        visibleMenu = undefined;
        
        const slideOutUpKeframes = [
            {
                translate: `0px 0px`,
                easing: "ease-in"
            },
            {
                translate: `0px ${-dropMenuHeight}px`
            }
        ]
        
        const slideOutUpOptions = {
            duration: 300, 
            fill: "forwards"
        }
        const slideOutUp = dropMenu.animate(slideOutUpKeframes, slideOutUpOptions);
        slideOutUp.finished.then(() => {
            resolve();
        });
    });
    return promise;
}


document.body.addEventListener('click', () => {
    hideMenu();
})

menuItems.forEach((item) => {
    item.addEventListener('click', etv => {
        if (visibleMenu == item.id) return;
        displayMenu(item.id, parseFloat(item.offsetLeft));
        etv.stopPropagation();
    })
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b071b2a4d5d04329a188e19d04ed1029~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=450&s=901018&e=gif&f=177&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/MWxpbGr

  


如需想进一步了解 WAAPI 复合模式，可以参阅 WAAPI 规范中的 [CompositeOperation 和 CompositeOperationOrAuto](https://www.w3.org/TR/web-animations-1/#the-compositeoperation-enumeration)。

  


了解 CSS 动画的开发者应该知道，在 CSS 中要调整动画播放速度，通常只能调整动画的持续时间或缓动函数来实现。但在 WAAPI 中呢，如果要调整动画的播放速度，就要灵活地多。我们可以使用 `playbackRate` 来调整动画的播放速率。

  


```JavaScript
const rotate = [{ rotate: "0deg" }, { rotate: "-360deg" }];
const translate = [{ translate: `0px 0px` }, { translate: `0 -100%` }];
const gear1Options = {
    duration: 2500, 
    iterations: Infinity
};
const gear2Options = {
    duration: 5000,
    direction: "reverse",
    iterations: Infinity
};

const beltOption = {
    duration: 100000,
    iterations: Infinity
};

const setAnimation = (item, keyframes, options) =>
  document.getElementById(item).animate(keyframes, options);

const firstGear = setAnimation("gear1", rotate, gear1Options);
const secGear = setAnimation("gear2", rotate, gear2Options);
const belt = setAnimation("belt", translate, beltOption);

const animations = document.getAnimations();

const setSpeed = (etv) => {
    const rate = etv.target.value;

    animations.forEach((ani) => {
        if (rate >= 3) {
            ani.playbackRate = 1 + (rate - 3) * 0.3;
        } else if (rate < 3) {
            ani.playbackRate = 1 - (3 - rate) * 0.3;
        }
    });
    document.getElementById("speed-output").textContent = firstGear.playbackRate;
};

document.getElementById("speed").addEventListener("change", setSpeed);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2adbd6ab1c7f419ca8f89e574cf3ca0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1202&h=534&s=3450209&e=gif&f=303&b=4b496a)

  


> Demo 地址：https://codepen.io/airen/full/zYbZNZQ

  


这里有一个小细节需要提出来，当动画的播放速率 `playbackRate` 为负值时，它相当于给动画设置了 `reverse()` ，动画会反向播放。

  


## 小结

  


这些是 WAAPI 的基本功能，它提供了一组用于控制 Web 动画的 JavaScript API，使得 Web 开发者能更灵活而强大的方式来创建和控制动画。

  


简而言之，WAAPI 为开发人员提供了一种现代、强大的动画控制方式，使得在 Web 应用程序中实现复杂的、交互式的动画变得更加容易。