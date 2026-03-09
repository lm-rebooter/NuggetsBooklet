在 Web 设计中，动画是提高用户体验和吸引注意力的重要元素。这也是导致许多 JavaScript 动画库的增长，包括 [Framer Motion](https://www.framer.com/motion/) 和 [GreenSock](https://gsap.com/)。然而，随着 Web 技术的发展，Web 开发人员实现 Web 动画效果仍然选择使用 [CSS 过渡（transition）](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)、[CSS 动画（animation）](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)或 [WAAPI](https://juejin.cn/book/7288940354408022074/section/7308623717105008652)。

  


CSS 动画和 WAAPI 具有不同的特性和用法，因此在选择动画方法时需要权衡各种因素。也就是说，在选择 CSS 动画或 WAAPI 时，Web 开发人员应该根据具体项目需求和团队技能做出明智的决策。综合考虑各种因素，可以根据动画的复杂性、性能需求和开发团队的熟悉程度来确定最佳的动画实现方法。

  


在这节课中，我将与大家一起探讨 CSS 动画和 WAAPI 两种方法的优势、劣势以及在不同场景下选择最佳动画方法的考虑因素。通过深入了解两者的利弊，Web 开发人员才能更好的决定在特定的情境下使用哪种动画技术，以实现最佳的用户体验。

  


## CSS Animations vs. WAAPI

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e616df98726d4302b31ad0d6cfae47e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200&h=600&s=15784&e=webp&b=fff9d8)

  


通常情况之下，CSS 动画指的是过渡动画（`transition`）和关键帧动画（`animation`），但在这节课中，我们所说的 CSS 动画主要以关键帧动画为主，即使用 CSS 的 `@keyframes` 定义的关键帧动画，并以 `animation` 属性设置动画相关参数。而 WAAPI 则是通过一系列 JavaScript API 定义的动画。从这一点而言，CSS 动画与 WAAPI 最大的差异就是：**CSS 动画是一种声明式动画；WAAPI 是一种命令式动画**。

  


在深入探讨 CSS 动画和 WAAPI 之间差异之前，我们先来看看，如何通过它们来制作同一个动画。

  


假设你有一个名为 `slideInBlurredTop` 的入场动画，它的效果看起来像下面这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e756fead870b46599aabe0a1efaaa2f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=574&s=282050&e=gif&f=143&b=dadada)

  


使用 CSS 实现这个效果的动画，需要的代码如下：

  


```CSS
/* 使用 @keyframe 创建名为 slideInBlurredTop 动画 */
@keyframes slideInBlurredTop {
    0% {
        transform: translateY(-1000px) scaleY(2.5) scaleX(.2);
        transform-origin: 50% 0;
        filter: blur(40px);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scaleY(1) scaleX(1);
        transform-origin: 50% 50%;
        filter: blur(0);
        opacity: 1;
    }
}

/* 将已创建的 slideInBlurredTop 动画应用到 animated 元素上 */
.animated {
    animation: slideInBlurredTop 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) infinite alternate forwards;
}
```

  


在 WAAPI 中，我们可以使用两种不同的方式来创建该动画效果。第一种是使用 `new Animation()` 和 `new KeyframeEffect()` 来构建，另一种是使用 `Element.animate()` 来实现。不管是使用哪种方式，它们都需要一个类似 CSS 的 `@keyframes` 的关键帧 `keyframes` 和类似于 `animation-*` 属性值列表，即 `options` ：

  


```JavaScript
// 创建关键帧，类似于 CSS 的 @keyframes
const keyframes = [
    { 
        offset: 0, // 相当于 @keyframes 中的 0% 或 from
        transform: 'translateY(-1000px) scaleY(2.5) scaleX(.2)',
        transformOrigin: '50% 0',
        filter: 'blur(40px)',
        opacity: 0
    },
    {
        offset: 1,
        transform: 'translateY(0) scaleY(1) scaleX(1)',
        transformOrigin: '50% 50%',
        filter: 'blur(0)',
        opacity: 1
    }
]

// 定义 options，配置动画参数，相当于 CSS 的 animation-* 属性值
const options = {
    duration: 600,  // 设置动画持续时间：相当于 animation-duration: 0.6s
    easing: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)', // 设置动画缓动函数：相当于 animation-timing-function: cubic-bezier(0.230, 1.000, 0.320, 1.000)
    iterations: Infinity, // 设置动画播放次数：相当于 animation-iteration-count: infinite
    direction: 'alternate', // 设置动画方向：相当于 animation-direction: alternate
    fill: 'forwards' // 设置动画填充模式：相当于 animation-fill-mode: forwards
}
```

  


> 注意，在 WAAPI 中还可以以对象形式来创建 `keyframes` ，有关于这方面详细介绍，请移步阅读上一节课《[掌握 Web Animations API 的精髓](https://juejin.cn/book/7288940354408022074/section/7308623761975017508)》中关于 `keyframes` 定义的内容。

  


在 WAAPI 中，你可以将已定义好的 `keyframes` 和 `options` 分别传递给 `new KeyframeEffect()` 构建函数或 `Element.animate()` 函数。

  


```JavaScript
const animEle = document.querySelector('.animated'); // 获取要应用动画的目标元素，相当于 CSS 中的 .animated 选择中的元素

// 使用 new KeyframeEffect() 创建一个效果
const slideInBlurredTop = new KeyframeEffect(animEle, keyframes, options);

// 使用 new Animation() 创建一个动画
const animation = new Animation(slideInBlurredTop, document.timeline);

// 播放动画
animation.play()
```

  


如果使用 `Element.animate()` 会更省事一些：

  


```JavaScript
const animEle = document.querySelector('.animated'); // 获取要应用动画的目标元素，相当于 CSS 中的 .animated 选择中的元素

animEle.animate(keyframes, options);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e4674ca7b254fb39fa5955ae408ca75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1670&h=526&s=1348295&e=gif&f=115&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/rNRzzGb

  


不难发现，动画最终的效果几乎是一致的。但从代码层面来说，对于熟悉 CSS 动画的 Web 开发者而言，有一些术语在习惯上还是会有所不同的：

  


| **CSS** **`animation`** **属性**  | **WAAPI 等效 API（** **`options`** **）** | **描述**                                                                                                                                               |
| ------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`animation-name`**            | **`id`**                              | 相当于 `new KeyframeEffect()` 创建的 `effect` 对象                                                                                                           |
| **`animation-duration`**        | **`duration`**                        | 动画单次迭代所需时间（动画持续时间），等同于 CSS 的 `animation-duration` 。在 WAAPI 中 `duration` 的值不带单位，而且只能是 `ms` ，但在 CSS 中可以是 `ms` 也可以是 `s`                                 |
| **`animation-timing-function`** | **`easing`**                          | 动画缓动函数，等同于 CSS 的 `animation-timing-function`。                                                                                                        |
| **`animation-fill-mode`**       | **`fill`**                            | 动画填充模式，等同于 CSS 的 `animation-fill-mode`                                                                                                               |
| **`animation-iteration-count`** | **`iterations`**                      | 动画循环播放次数，等同于 CSS 的 `animation-iteration-count` 。如果我们希望动画无限循环播放，是 `Infinity` 而不是 `infinite`。`Infinity` 不用引号括起来，因为 `Infinity` 是JavaScript关键字，而其他值是字符串。 |
| **`animation-direction`**       | **`direction`**                       | 动画运动方向，等同于 CSS 的 `animation-direction`                                                                                                               |
| **`animation-delay`**           | **`delay`**                           | 动画延迟时间，等同于 CSS 的 `animation-delay` 。在 WAAPI 中 `delay` 的值不带单位，而且只能是 `ms` ，但在 CSS 中可以是 `ms` 也可以是 `s`                                                   |
| **`animation-play-state`**      | ❌                                     | 与 WAAPI 中的 `play()` 和 `pause()` 方法有点类似                                                                                                               |
| **`animation-composition`**     | **`composite`**                       | 动画合成，等同于 CSS 的 `animation-composition`                                                                                                               |
| ❌                               | **`endDelay`**                        | 指定动画结束后的延迟时间                                                                                                                                         |
| ❌                               | **`iterationStart`**                  | 指定动画应该在迭代的哪个点开始                                                                                                                                      |

  


注意，在 WAAPI 中配置动画参数时，并没有类似 `animaiton-play-state` 属性的参数，但可以通过 `play()` 和 `pause()` 方法来控制动画的播放和暂停。另外，在 CSS 中是没有 `endDelay` 和 `iterationStart` 的概念，它只有一个动画延迟播放的概念。 在 WAAPI 中，`endDealy` 和 `iterationStart` 指的是：

  


-   `endDelay`：指定动画结束后的延迟时间，如果你想在彼此之后串联多个动画，但希望在一个动画结束和任何后续动画开始之间有一段间隔，则 `endDelay` 很有用
-   `iterationStart`：指定动画应该在迭代的哪个点开始，取值范围从 `0.0 ~ 1.0`。例如，值为 `0.5` 表示动画应该在 `50%` 的关键帧点开始，即动画从中间开始。一整个需要两个半部分，因此如果你的迭代次数设置为 `1` ，而你的 `iterationStart` 设置为 0.5，则动画将从中间开始播放到动画结束，然后从动画的开始重新开始，并在中间结束

  


值得注意的是，你还可以将总迭代次数设置为小于一。例如：

  


```JavaScript
const options = {
    iterations: .5,
    iterationStart: .5
}
```

  


这将使动画从中间播放到结束。

  


> 注意，[上节课对 WAAPI 的 endDelay 和 iterationStart 有过详细的阐述](https://juejin.cn/book/7288940354408022074/section/7308623761975017508)，这里就不做再重复性阐述。

  


作为一名 Web 开发者，尤其是 CSSer，在平时开发过程中，只要是 CSS 能实现的，我都会首先 CSS 。在创作 Web 动画亦是如此。在这个过程中，我享受了 CSS 动画（`transition` 和 `animation`）给我带来的便利与优越性同时，CSS 动画也让我在某些方面感到沮丧，例如动态创建、播放控制和监听动画的生命周期等方面。

  


不过，令我感到振奋的是，WAAPI 解决了所有这些问题。

  


## 动画的创建

  


虽然在 CSS 中，我们可以很容易为元素状态变化添加动画效果，例如在按钮的悬浮状态改变其 `transform` 的值：

  


```CSS
.button {
    transition: transform .2s ease;
    
    &:hover {
        transform: scale(1.2);
    }
}
```

  


或者：

  


```CSS
@keyframes scale {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.2);
    }
}

.button:hover {
    animation: scale .2s ease;
}
```

  


CSS 动画显得容易是因为我们预先知道动画化属性开始值和结束值。换句话说，要是动画化属性的开始值和结束值事先未知的话，那么使用 CSS 就没有那么容易了。例如，按钮悬浮状态下的 `scale()` 值是一个随机值。在这种情况之下，Web 开发者通常会采用 JavaScript 来处理：

  


```JavaScript
const buttonHandler = document.querySelector(".button");

buttonHandler.addEventListener("mousemove", (etv) => {
    const randomValue = 1 + Math.random() * 0.5;
    
    const target = etv.target;

    // 设置过渡属性和起始值。
    target.style.transitionProperty = "transform";
    target.style.transitionDuration = "1s";
    target.style.transform = "scale(1)";

    // 强制进行样式失效，以记录起始值。
    window.getComputedStyle(target);

    // 现在，设置结束值。
    target.style.transform = `scale(${randomValue})`;
});

buttonHandler.addEventListener("mouseout", (etv) => {
    const target = etv.target;

    target.style.transitionProperty = "transform";
    target.style.transitionDuration = "1s";

    target.style.transform = `scale(1)`;
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5733683f3bd49c2b66a3c82e95cebf8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=396&s=523024&e=gif&f=183&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/PoLKMWW

  


就这个情境而言，JavaScript 可以帮助 Web 开发者解决问题。不过，使用这种方式实现动画时，还有其他的一些因素需要考虑。例如示例中的强制进行样式失效不会让浏览器在它认为最合适的时间执行该任务。而且这只是一个单一的动画，如果页面上有多个与这个相似的效果，这将导致样式失效的倍增，降低页面性能。

  


如果考虑使用 CSS 关键帧动画（`animation`），就必须先生成一个专用的 `@keyframes` 规则并将其插入到 `<style>` 元素中，未能封装对于单个元素而言实际上是有针对性的样式更改，会导致昂贵的样式失效。

  


要是换作 WAAPI 就不一样了，因为 WAAPI 提供了很多 JavaScript API，它保留了让浏览器引擎高效运行动画的能力，同时使你对动画有更高级别的控制。使用 WAAPI，我们可以通过调用 `Element.animate()` 来实现上面那个按钮悬浮的动画效果：

  


```JavaScript
const buttonHandler = document.querySelector(".button");

buttonHandler.addEventListener("mousemove", (etv) => {
    const randomValue = 1 + Math.random() * 0.5;
    const target = etv.target;
    const keyframes = [
        {
            transform: `scale(1)`
        },
        {
            transform: `scale(${randomValue})`
        }
    ];
    const options = {
        duration: 1000,
        fill: "both"
    };

    target.animate(keyframes, options);
});

buttonHandler.addEventListener("mouseout", (etv) => {
    const target = etv.target;
    const keyframes = [
        {
            transform: `scale(1)`,
            offset: 1
        }
    ];
    const options = {
        duration: 1000,
        fill: "both"
    };

    target.animate(keyframes, options);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6e7985531514f86bb44a112e2f689a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=546&s=372738&e=gif&f=183&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/mdoMNjW

  


虽然这个示例非常简单，但 `Element.animate()` 是一把真正的瑞士军刀，它可以表达更高级的功能。正如课程 开头那节所述， `Element.animate()` 的第一个参数类似于 CSS 的 `@keyframes` ，第二个参数类似于 CSS 的 `animation-*` 属性值。简单地说，它可以表达 CSS 动画的所有特性。

  


现在我们知道如何使用 WAAPI 创建动画，但它与前一个过渡动画相比有何优势呢？前一个示例只是告诉浏览器要对什么进行动画以及如何对其进行动画，但没有指定何时进行动画。使用 WAAPI 创建的动画则有所不同，浏览器将能够在下一个最合适的时刻处理所有新的动画，而无需强制进行样式失效。这意味着，你自己创建的动画以及可能来自第三方 JavaScript 库的动画，甚至是位于不同文档中的动画，都将同时启动并同步进行。

  


## 动画的控制

  


通常情况之下，我们通过下面三个方面来控制一个动画：

  


-   控制动画的播放状态（比如开始播放、暂停、重播和取消等）
-   动画播放速度（速率）
-   动画的时间（动画持续时间和延迟时间）

  


先来说 CSS 动画。

  


动画播放状态这个方面来说，CSS 过渡动画（`transition`）是最弱的，它一旦被触发，只能往前运行，你无法在其播放过程中暂停、取消动画。CSS 关键帧动画（`animation`）要稍微强一点，你可以通过 `animation-play-state` 属性来控制动画的播放（`running`）和暂停（`pasued`），但与过渡动画一样，在 CSS 中，你无法使一个动画重新播放（重播）。通常情况下，[需要借助 JavaScript 脚本才能使动画进行重播](https://juejin.cn/book/7288940354408022074/section/7304648624272015372)。

  


对于动画的时间而言，我们可以通过`transition-duration` 或 `animaiton-duration` 来控制过渡动画和关键帧动画的持续时间；还可以通过 `transition-delay` 或 `animation-delay` 来控制过渡动画和关键帧动画的延迟时间。但要设置动画的当前时间，只能采用巧妙的方法，比如巧妙地操纵负的 `animation-delay` 或 `transition-delay` 值。有关这方面的介绍，可以回过头阅读小册的《[深入了解 CSS 动画的持续时间和延迟时间](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)》！

  


如果要调整 CSS 动画播放的速度，可以考虑调整动画的缓动函数和时间值，因为在 CSS 中没有相应的属性可以直接调整动画的播放速度。在相同的距离和时间条件下，不同的缓动曲线（除恒速 `linear` 之外）也会影响动画的播放速度；另外，调整动画持续时间也会影响到动画的播放速度。

  


上面所提到的这些方面，对于 WAAPI 来说都不是什么问题，因为这些问题都由专用的 API 处理。例如，我们可以使用 `play()` （播放）、`pause()` （暂停）、`cancel()` （取消）和 `finish()` （结束）等方法控制动画播放状态；使用 `currentTime` 、 `startTime` 、`endDelay` 和 `iterationStart` 来查询和设置时间；使用 `playbackRate` 控制动画播放速度。

  


```JavaScript
const animEle = document.querySelector(".animated");
const buttonHandler = document.querySelector(".button");

const keyframes = [
    { 
        scale: 1.2, 
        offset: 0.5 
    }
];

const options = {
    duration: 1000,
    iterations: Infinity,
    easing: "ease"
};

const animation = animEle.animate(keyframes, options);

animation.pause();

// 将其当前时间更改，使其向前移动500ms。
animation.currentTime += 500;

// 将动画减速以半速播放
animation.playbackRate = 0.5;

buttonHandler.addEventListener("click", () => {
    if (animation.playState === "paused") {
        animation.play();
    } else {
        animation.pause();
    }
});
```

  


这使得 Web 开发人员可以在动画创建后控制其行为。现在执行以前可能令人生畏的任务变得微不足道。要在按下按钮时切换动画的播放状态：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/872671e4826846ad803441906d753a36~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=506&s=636588&e=gif&f=151&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/ExMwVpR

  


你还可以根据一个 `<input type="range">` 来调整动画的 `currentTime` ：

```JavaScript
const animEle = document.querySelector(".animated");
const inputHandler = document.querySelector("#currentTime");

const keyframes = [{ scale: 1.2, offset: 0.5 }];

const options = {
    duration: 1000,
    iterations: Infinity,
    easing: "ease"
};

const animation = animEle.animate(keyframes, options);

animation.pause();

// 将其当前时间更改，使其向前移动500ms。
animation.currentTime += 500;

// 将动画减速以半速播放
animation.playbackRate = 0.5;

inputHandler.addEventListener("input", (etv) => {
    animation.currentTime = etv.target.value * animation.effect.getTiming().duration;
    console.log(animation.currentTime);
    animation.play();
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/596979791ebb4016a2053fcad8e45db2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=538&s=1253874&e=gif&f=270&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/eYXGpqr

  


如果你将在其自然播放范围之外暂停的动画的开始时间设置为以下内容，可以将其从暂停状态转换为已完成状态，而无需重新启动：

  


```JavaScript
const animEle = document.querySelector(".animated");

const keyframes = [{ scale: 1.2, offset: 0.5 }];

const options = {
    duration: 1000,
    iterations: 1,
    easing: "ease"
};

const animation = animEle.animate(keyframes, options);

// 更新了动画效果的时间设置，它将动画的持续时间设置为 5000ms
animation.effect.updateTiming({ duration: 5000 });

// 将动画的当前时间设置为 4000ms, 动画将从 4000ms 的位置开始播放
animation.currentTime = 4000;

// 将动画暂停，此时动画处于暂停状态
animation.pause();

// 在动画准备好之后执行回调函数，在这个回调函数中，我们对动画进行一些额外的操作
animation.ready.then(function() {
    // 在 Promise 回调中，再次更新动画效果的时间设置，将持续时间缩短为 3000ms
    animation.effect.updateTiming({ duration: 3000 });
    
    // 命令行 输出动画的播放状态，这个时候动画被暂停，所以状态显示为 paused
    console.log(animation.playState); // 显示 'paused'
    
    // 计算新的开始时间，以便将动画从暂停状态转换为已完成状态。它使用了当前文档时间减去动画当前时间乘以播放速率的计算
    animation.startTime = document.timeline.currentTime - animation.currentTime * animation.playbackRate;
    
    // 命令行 输出动画的播放状态，这个时候动画设置为已完成，所以状态显示为 finished
    console.log(animation.playState); // 显示 'finished'
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad8135734f54c99b48a70a75519213a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=504&s=66873&e=gif&f=66&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/eYXGJgP

  


这个示例演示了如何将已暂停的动画在其自然播放范围之外的位置转换为已完成状态，而无需重新启动。通过设置新的持续时间和开始时间，可以在动画暂停后修改其状态。

  


通常，关于动画完成状态的通知是异步执行的。这允许动画暂时进入已完成的播放状态，而不触发事件或解析 Promise。例如，下面这个示例，动画暂时进入已完成的状态。如果有关已完成状态的通知同步发生，这段代码将导致完成事件排队和当前已完成的 Promise 被解析。然而，如果我们颠倒两个语句的顺序，首先更新迭代次数，这将不会发生。为了避免这种令人惊讶的行为，通常会异步执行关于动画完成状态的通知。

  


```JavaScript
const animEle = document.querySelector(".animated");
const buttonHandler = document.querySelector(".button");

const keyframes = [{ scale: 1.2, offset: 0.5 }];

const options = {
    duration: 2000,
    easing: "ease"
};

buttonHandler.addEventListener("click", (etv) => {
    // 创建了一个动画对象 animation
    const animation = animEle.animate(keyframes, options);
    
    // 设置动画的播放速率为 2。这意味着动画将以正常速度的两倍播放。
    animation.playbackRate = 2;
    
    // 将动画的当前时间设置为 1000ms, 相当于动画已完成一部分
    animation.currentTime = 1000; // 动画现在已完成
    
    // 更新动画效果，将迭代次数设置为 2。这会导致动画不再处于已完成状态，而是会再次播放两次
    animation.effect.updateTiming({ iterations: 2 }); // 动画不再处于已完成状态
});
```

  


这种设置可能会导致动画在点击按钮后以加速的速度重新播放，并在播放两次后停止。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52cda77b3f6d42a6b866f284177ab177~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=514&s=582427&e=gif&f=151&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/WNmZXBR

  


这种异步行为的唯一例外是执行完成动画过程（通常通过调用`finish()`方法）。在这种情况下，Web 开发者明确希望完成动画，因此有关动画完成状态的通知是同步执行的，如下例所示：

  


```JavaScript
const animEle = document.querySelector(".animated");
const buttonHandler = document.querySelector(".button");

const keyframes = [{ scale: 1.2, offset: 0.5 }];

const options = {
    duration: 2000,
    easing: "ease"
};

buttonHandler.addEventListener("click", (etv) => {
    const animation = animEle.animate(keyframes, options);
    
    // 方法会立即触发完成事件，并解析已完成的 Promise
    animation.finish(); 
    
    // 将动画的当前时间设置为 0
    animation.currentTime = 0;
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8104fe2f9b4842aaba2523f39320545f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=494&s=625002&e=gif&f=161&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/xxBXpxm

  


上面这个示例，当点击 `buttonHandler` 元素时，会创建一个动画对象，立即调用 `finish` 方法触发完成事件，然后将动画的当前时间设置为 `0`，使其离开已完成状态，准备好重新播放。

  


## 动画生命周期

  


[JavaScript 为 CSS 的 transition 和 animation 提供了相关的事件](https://juejin.cn/book/7288940354408022074/section/7308623389638590505)，例如：

  


-   CSS `transition` 对应的 JavaScript 事件：`transitionstart` 、`transitionrun` 、`transitionend` 和 `transitioncancel`
-   CSS `animation` 对应的 JavaScript 事件：`animationstart` 、`animationend` 、`animationcancel` 和 `animationiteration`

  


虽然我们可以通过这些事件监听 CSS 动画如何开始、结束和取消等，但要正确使用它们却还很困难。例如下面这个示例，元素应用了一个 `fadeOut` 动画，在该动画结束时从 DOM 中删除该元素。通常，使用 CSS 动画，会像下面这样编写代码：

  


```CSS
@keyframes fadeOut {
    to {
        opacity: 0;
    }
}

.animated.play {
    animation: fadeOut 1s ease-out;
}
```

  


```JavaScript
const animEle = document.querySelector(".animated");

animEle.addEventListener('animationend', etv => {
    animEle.remove();
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05bea4b053e1444680c14952b3a81d6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=542&s=177126&e=gif&f=112&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/MWxErML

  


看起来没问题，但进一步检查发现问题。这段代码将在元素上分派 `animationend` 事件时立即删除元素，但由于动画事件会冒泡，事件可能来自DOM层次结构中子元素的完成的动画。你可以采取措施使这种代码更安全，但使用WAAPI，编写这种代码不仅更容易，而且更安全，因为你可以直接引用 `Animation` 对象，而不是通过元素层次结构范围内的动画事件。

  


除此之外，WAAPI 还使用 Promises 来监视动画的准备和完成状态：

  


```JavaScript
const animEle = document.querySelector(".animated");
const buttonHandler = document.querySelector(".button");

const keyframes = [
    {
        opacity: 1
    },
    {
        opacity: 0
    }
];

const options = {
    duration: 1000,
    easing: "ease-out"
};

buttonHandler.addEventListener("click", (etv) => {
    const animation = animEle.animate(keyframes, options);
    
    // animation 动画结束时删除 animEle 元素
    animation.finished.then(() => {
        animEle.remove();
    });
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2bc8aebc4fc4a48a420cb94e36d435d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=476&s=132073&e=gif&f=60&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/poYWaPm

  


想象一下，如果你想在删除共享容器之前监视针对多个元素的多个 CSS 动画的完成，执行相同的任务会有多么复杂。使用 WAAPI 及其对 Promises 的支持，现在可以简洁地表示如下：

  


```JavaScript
// 在删除容器之前等待所有动画完成。
let animations = container.getAnimations();
Promise.all(
    animations.map(animation => animation.finished.then(() => {
        container.remove();
    }
);
```

  


## 缓动函数

  


缓动函数（缓动曲线）对于任何动画而言都非常重要。

  


在 CSS 的过渡动画（`transition`）中，我们可以使用 `transition-timing-function` 属性为过渡动画指定缓动函数。在 CSS 的关键帧动画（`animation`）和 WAAPI 中，我们可以使用两种不同的方式给动画设置缓动函数。第一种是与过渡动画相似，CSS 关键帧动画使用 `animation-timing-function` 属性为整个动画指定缓动函数，WAAPI 在 `options` 中设置 `easing` 属性值为整个动画指定缓动函数：

  


```CSS
.animation {
    animation-timing-function: ease;
}
```

  


```JavaScript
const options = {
    easing: 'ease'
}
```

  


另一种方式是可以在定义关键帧的时候指定缓动函数：

  


```CSS
@keyframes fadeIn {
    0% {
        opacity: 0;
        animation-timing-function: ease-in;
    }
    50% {
        opacity: .5;
        animation-timing-function: ease-out;
    }
    100% {
        opacity: 1;
    }
}
```

  


```JavaScript
const keyframes = [
    {
        offset: 0,
        opacity: 0,
        easing: 'ease-in'
    },
    {
        offset: .5,
        opacity: .5,
        easing: 'ease-out'
    },
    {
        offset: 1,
        opacity: 1
    }
]
```

  


实际上，在关键帧中定义的缓动函数，它只是应用于关键帧之间，而不是整个动画。这样可以对动画进行精细的控制。值得注意的是，在 CSS 和 WAAPI 中，不应为最后一帧传递缓动值，因为这将没有效果。这是许多人犯的一个错误。

  


我们来看一个 WAAPI 的示例，在下面这个示例中，分别在关键帧 `keyframes` 和 `options` 中定义了缓动函数，这两个动画呈现给用户的效果是有所不同的：

  


```JavaScript
const animEle1 = document.querySelector(".animated1");
const animEle2 = document.querySelector(".animated2");

// 在 keyframes 中应用缓动函数
const keyframes1 = [
    {
        offset: 0,
        rotate: '0deg',
        easing: 'ease-out'
    },
    {
        offset: .5,
        rotate: '180deg',
        easing: 'ease-out'
    },
    {
        offset: 1,
        rotate: '0deg'
    }
]

const options1 = {
    duration: 1000,
    iterations: Infinity
}

const keyframes2 = [
    {
        offset: 0,
        rotate: '0deg'
    },
    {
        offset: .5,
        rotate: '180deg'
    },
    {
        offset: 1,
        rotate: '0deg'
    }
]

// 在 options 中定义缓动函数
const options2 = {
    duration: 1000,
    iterations: Infinity,
    easing: 'ease-out'
}

buttonHandler.addEventListener("click", (etv) => {
    animEle1.animate(keyframes1, options1);
    animEle2.animate(keyframes2, options2);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bacc9bda56e842f8a3f9da184ce8062e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=478&s=1586603&e=gif&f=153&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/dyrVdwJ

  


值得注意的是，CSS 动画的缓动函数的默认值是 `ease` ，而 WAAPI 的缓动函数的默认值是 `linear` 。相对而言，`linear` 是一种恒速运动，应用该缓动函数的动画看上去比较机械而不自然。因此，在 WAAPI 中，需要手动重置 `easing` 的值，以免你的动画看起来乏味和呆板。

  


通过前面的学习，我们知道 WAAPI 提供了很多 JavaScript 的 API，那么像 easings.net 定义的一些缓动函数是否就可以直接应用于 WAAPI 的 `easing` 上呢？如果是的话，那么应用于 WAAPI 的缓动函数可选项就多了。但事实上呢？有点令人感到失望，并不能直接在 WAAPI 上应用 JavaScript 定义的缓动函数。以 easings.net 定义 `bounce` 为例：

  


```JavaScript
const bounce = (pos) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (pos < 1 / d1) {
        return n1 * pos * pos;
    } else if (pos < 2 / d1) {
        return n1 * (pos -= 1.5 / d1) * pos + 0.75;
    } else if (pos < 2.5 / d1) {
        return n1 * (pos -= 2.25 / d1) * pos + 0.9375;
    } else {
        return n1 * (pos -= 2.625 / d1) * pos + 0.984375;
    }
};

const animEle = document.querySelector('.animated');

const keyframes = [
    {
        translate: '0% 0%'
    },
    {
        translate: '100% 0%'
    }
]

const options = {
    duration: 2000,
    easing: bounce, // ❌ 不工作
    fill: 'both',
    iterations: Infinity
}

animEle.animate(keyframes, options);
```

  


如果要让它起作用，还是要另辟蹊径。

  


如果你了解缓动函数的话，那就应该知道。缓动函数只不过是一个简单的函数，它接受一个输入值并产生一个输出值，并且输入值通常在 `[0,1]` 范围内。如果用代码表示的话，大致像下面这样：

  


```JavaScript
const easingInput = 0.5; // 缓动函数的输入值，通常在 0 ~ 1 之间

// 缓动函数的输出值, 根据传入的输入值，缓动函数会输出一个值 
const easingOutput = easingFn(easingInput); 
```

  


对于 `linear` 缓动，输出与输入相同，因为它以恒速的方式运行：

  


```JavaScript
const linear = (input) => {
    const output = input;
    return output;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3d43afc86c4c89a7076a29bde8dd7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=732&s=1100791&e=gif&f=264&b=edf5fe)

  


正如上图所示，通过在 `x` 轴上绘制输入（`input`）和在 `y` 轴上绘制输出（`output`）来可视化 `linear` 缓动函数。

  


当然，前面所提到的 `bounce` 要比 `linear` 复杂得多，但它与 `linear` 的原理是相同的：它也是一个根据给定输入 `input` 产生特定输出值 `output` 的函数 `bounce()` 。在 WAAPI 中，我们可以通过一些方法来实现 `bounce()` 函数的功能。

  


最简单的是使用 WAAPI2 中的 `CustomEffect` ，允许你通过 JavaScript 来定义效果。例如：

  


```JavaScript
const animEle = document.querySelector('.animated');

const bounce = (pos) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (pos < 1 / d1) {
        return n1 * pos * pos;
    } else if (pos < 2 / d1) {
        return n1 * (pos -= 1.5 / d1) * pos + 0.75;
    } else if (pos < 2.5 / d1) {
        return n1 * (pos -= 2.25 / d1) * pos + 0.9375;
    } else {
        return n1 * (pos -= 2.625 / d1) * pos + 0.984375;
    }
};

const animation = new Animation();

animation.effect = new CustomEffect((progress) => {
    animEle.style.transform = `translateY(${CSS.percent(200 * bounce(progress))})`
}, 2000)

animation.play();
```

  


只不过，到现在还没有得到主流浏览器的支持，而且该功能在未来有可能会发生很大的变化。还有就是，`CustomEffect` 不像常规动画那样高效，因为它始终在主线程上运行。

  


另一个方法是使用最新增加到 `linear()` 缓动函数。它允许你以简单的方式构建复杂的缓动函数。它通过将原始曲线简化为一系列点来实现。例如，前面提到的 `bounce()` 函数要是使用 `linear()` 函数来表示的话，看上去会像下面这样：

  


```JavaScript
const bounce = `linear(
    0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765,
    1, 0.891 40.9%, 0.848, 0.813, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785,
    0.813, 0.848, 0.891 68.2%, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953,
    0.973, 1, 0.988, 0.984, 0.988, 1
  );`
```

  


在 WAAPI 中，可以直接将 `linear()` 作为 WAAPI 的 `easing` 选项的值，通过将其作为字符串传递。

  


```JavaScript
const animEle = document.querySelector('.animated');

const keyframes = [
    {
        translate: '0% 0%'
    },
    {
        translate: '0% 100%'
    }
]

const bounce = `linear(
    0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765,
    1, 0.891 40.9%, 0.848, 0.813, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785,
    0.813, 0.848, 0.891 68.2%, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953,
    0.973, 1, 0.988, 0.984, 0.988, 1
  );`
  
const options = {
    duration: 2000,
    easing: bounce,
    fill: "both",
    iterations: Infinity,
    pseudoElement: '::before'
}

buttonHandler.addEventListener("click", (etv) => {
    animEle.animate(keyframes, options);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3e6c328cd004f1395b85f74ff82c224~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=470&s=362053&e=gif&f=146&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/LYazmPa

  


没有接触过 CSS 的 `linear()` 缓动函数的同学，一定会好奇，`bounce()` 函数是如何转换成 `linear()` 函数的。正如小册的《[使用 linear() 函数创建令人惊叹的动画曲线](https://juejin.cn/book/7288940354408022074/section/7301665456824254515)》课程中所介绍的，我们可以通过 [@Jake Archibald](https://link.juejin.cn/?target=https%3A%2F%2Ftwitter.com%2Fjaffathecake) 创建了一个[在线生成器](https://link.juejin.cn/?target=https%3A%2F%2Flinear-easing-generator.netlify.app%2F)，将 `bounce()` 函数或其他 JavaScript 版本的缓动函数转换为 `linear()` 函数：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6b7a739238f48dfb8a1a376833322c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1178&h=750&s=4015455&e=gif&f=304&b=24262c)

  


> URL：https://linear-easing-generator.netlify.app/

  


在 WAAPI 中，你可以直接在 JavaScript 中使用 [@Michelle Barker](https://michellebarker.co.uk/) 提供的转换函数，将 JavaScript 版本定义的缓动函数转换为 `linear()` 函数。比如，上面那个示例，我们可以像下面这样编写 JavaScript：

  


```JavaScript
const animEle = document.querySelector('.animated');
const buttonHandler = document.querySelector('.button');

// 来自 easings.net 的 bounce 缓动函数
const bounce =  (pos) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (pos < 1 / d1) {
        return n1 * pos * pos;
    } else if (pos < 2 / d1) {
        return n1 * (pos -= 1.5 / d1) * pos + 0.75;
    } else if (pos < 2.5 / d1) {
        return n1 * (pos -= 2.25 / d1) * pos + 0.9375;
    } else {
        return n1 * (pos -= 2.625 / d1) * pos + 0.984375;
    }
};

// 将 JavaScript 定义的缓动函数转换成 linear() 函数，返回的是 options 中 easing 选项所的字符串
const toLinear = (easing, points = 50) => {
    const result = [...new Array(points+1)].map((d, i) => easing( i * (1 / points)));
    return `linear(${result.join(",")})`;
};


// 创建关键帧
const keyframes = [
    {
        translate: '0% 0%'
    },
    {
        translate: '0% 100%'
    }
]

const options = {
    duration: 2000,
    easing: toLinear(bounce),
    fill: "both",
    iterations: Infinity,
    pseudoElement: '::before'
}

buttonHandler.addEventListener("click", (etv) => {
    animEle.animate(keyframes, options);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1af260a967f4f8685b35a16231262b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=532&s=304719&e=gif&f=143&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/RwdLyOK

  


在不久的未来，你可能还会拥有更高级的方法，即注册自定义缓动函数。这是 [W3C 的 CSS 工作小组最新提出的一个建议，允许 Web 开发人员注册自定义缓动函数](https://github.com/w3c/csswg-drafts/issues/1012)。该建议提出了一个新的方法 `document.registerTimingFunction` 来实现：

  


```JavaScript
document.registerTimingFunction('bounce', function (pos) {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (pos < 1 / d1) {
        return n1 * pos * pos;} 
    else if (pos < 2 / d1) {
        return n1 * (pos -= 1.5 / d1) * pos + 0.75;
    } else if (pos < 2.5 / d1) {
        return n1 * (pos -= 2.25 / d1) * pos + 0.9375;
    } else {
        return n1 * (pos -= 2.625 / d1) * pos + 0.984375;
    }
});
```

  


注册后，该方法将可用于CSS 动画：

  


```CSS
.animated {
    animation-timing-function: bounce;
}

.transitioned {
    transition-timing-function: bounce;
}
```

  


也可以用于 WAAPI 中 `options` 的 `easing` 选项：

  


```JavaScript
const options = {
    easing: bounce
}
```

  


这仍然只是一个提案。目前还没有关于它的正式内容，但我很希望看到这一点取得进展。

  


## 文档中的动画

  


如果你在 `document.timeline` 中描述了所有动画，你就可以通过 `getAnimations()` 获得你站点上的所有动画，其中包括 WAAPI 定义的任何动画对象，以及任何 CSS 过渡动画和关键帧动画。例如：

  


```JavaScript
// 获取文档中所有动画
const animations = document.getAnimations()

// 获取应用于 Element 元素的所有动画
const animations = element.getAnimations()
```

  


你可以将 `getAnimations()` 和 `@keyframes` 一起使用。假设你和我一样，比较喜欢使用 CSS 来创作动画，但有时需要通过一些 API 来控制动画。那么使用 `getAnimations()` 会让事情变得容易得多。

  


需要注意的是，`getAnimations()` 方法始终返回的是一个数组。即使 DOM 元素只应用了一个动画，`getAnimations()` 仍然会返回一个数组。我们可以通过下面这种方式来获取应用于元素上的那个单一的动画对象：

  


```JavaScript
const animEle = document.querySelector(".animated");

// 获取用于 animEle 元素的动画
const animation = animEle.getAnimations()[0]
```

  


如此一来，你就可以通过相关的 API 来控制 CSS 动画，例如：

  


```JavaScript
animation.playbackRate = 4;
animation.reverse()
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc39f9b0d51e41c0b6850774971ea07e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=598&s=1563982&e=gif&f=257&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/MWxEXjd

  


不知道大家是否还记得，我曾在《[提升可访问性动画的关键技巧](https://juejin.cn/book/7288940354408022074/section/7308623518789763083)》提出一个观点，好的 Web 动画能给 Web 应用或网站起到锦上添花的作用。但作为一名 Web 开发者，我们需要为自己创作的 Web 动画负责任。我们不能因为自己创作给一些用户带伤害，比如患有类似前庭障碍疾病的用户。因为你的动画创作，可能对这个群体的用户产生心理负担，甚至有可能导致他们触发疾病。正因为如此，现在很多终端设备都提供了“减少运动”的用户偏好设置。

  


就这个情境而言，`getAnimations()` 能起到很好的作用，它可以获取到文档中的所有动画，你可以根据需要取消动画：

  


```JavaScript
if (window.matchMedia('(prefers-reduced-motion)')) {
    document.getAnimations().forEach((animation) => animation.cancel());
}
```

  


## 多动画

  


多动画通常有两种形式，第一种形式是同一个元素上应用多个动画，第二种形式是同一个页面有多个元素应用动画。不管哪种方式，在 CSS 中，多动画的时序主要依赖于动画的持续时间和延迟时间来进行编排。例如下面这个示例，在同一个元素上应用了 `rotate` 、`scale` 和 `opacity` 三个关键帧动画：

  


```CSS
@keyframes rotate{
    from {
        rotate: 540deg;
    }
    to {
        rotate: 0deg;
    }
}

@keyframes scale {
    from {
        scale: 5;
    }
    to {
        scale: 1;
    }
}

@keyframes opacity {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animated {
    animation: rotate .65s ease-out both, scale .65s ease-out both, opacity .65s ease-out both;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9453d0571f6d46d7ab33f102d2ddc46c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=550&s=1214840&e=gif&f=158&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/wvOrYzX

  


在 WAAPI 中，你可以在同一个元素上调用 `Element.animate()` ，类似于 CSS 一样，给元素设置多个动画：

  


```JavaScript
const animEle = document.querySelector('.animated');

const rotateKeyframe = [
    {rotate: '540deg'},
    {rotate: '0deg'}
]

const scaleKeyframe = [
    {scale: 5},
    {scale: 1}
]

const opacityKeyframe = [
    {opacity: 0},
    {opacity: 1}
]

const options = {
    duration: 650,
    easing: 'ease-out',
    fill: 'both'
}

const rotateEffect = animEle.animate(rotateKeyframe, options);
const scaleEffect = animEle.animate(scaleKeyframe, options);
const opacityEffect = animEle.animate(opacityKeyframe, options);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9308a17c66054752aec1290aa9f53903~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044&h=572&s=958566&e=gif&f=112&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/wvOrYPY

  


上面这两个示例，虽然使用的方法不相同，但你都可以使用 `getAnimations()` 获取应用于 `.animated` 上的 `rotate` 、`scale` 和 `opacity` 三个动画，每个动画都可以暂停、播放、完成、取消，并通过时间轴或播放速率进行操作。

  


继续以这个动画效果为例，假设你希望 `rotate` 、`scale` 和 `opacity` 三个动画不是同时播放，持续时间和缓动函数都有所不同。在 CSS 中你只能利用多动画的特性，为每个动画设置不一样的参数，比如动画延迟时间和持续时间以及缓动函数等：

  


```CSS
.animated {
    animation: rotate 1s linear both, scale 1s linear .3s, opacity 1s ease-in .5s both;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c8de168417f4c64afc6d8d4c69d4895~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=504&s=1203592&e=gif&f=229&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/jOJaPEv

  


在 WAAPI 中，同样可以通过 `delay` 和 `duration` 来控制动画的时间，但与 CSS 不同的是，WAAPI 还可以通过 `endDelay` 和 `iterationStart` 来控制动画在时间轴上的时间。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b0cfebb35c04d33a1562f2ef7ddbb91~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=530&s=3819506&e=gif&f=649&b=fbf4f1)

  


> Demo 地址：https://codepen.io/smashingmag/full/VwWWrzz

  


第二种多动画是指在 Web 上多个元素应用动画，哪怕是相同的动画效果。相比之下，控制 Web 页面上多个元素的动画效果，WAAPI 要比 CSS 更具优势。例如下面这个效果，二十个 `div` 分别应用 `transform` 、`opacity` 和 `bgColor` 关键帧效果，并且每个动画的 `duration` 和 `delay` 都不相同：

  


```JavaScript
const animEles = document.querySelectorAll(".animated");

const options = {
    easing: "ease-in-out",
    iterations: Infinity,
    direction: "alternate",
    fill: "both"
};

animEles.forEach((animEle, index) => {
    const transform = [
        {
            translate: "0 0",
            scale: ".8 1"
        },
        {
            translate: "0 90vh",
            scale: "1 1"
        }
    ];

    const opacity = [{ opacity: 1 }, { opacity: 0 }];

    const bgColor = [
        { backgroundColor: "rgb(239 239 255)" },
        { backgroundColor: "#e4c349" }
    ];

    options.delay = index * 98;
  
    options.duration = 2500;
    animEle.animate(transform, options);

    options.duration = 2000;
    animEle.animate(opacity, options);

    options.duration = 3000;
    animEle.animate(bgColor, options);
});
```

  


你将看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1966661ca83c45119484b874fe517b6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1678&h=634&s=2873463&e=gif&f=144&b=e14640)

  


> Demo 地址：https://codepen.io/airen/full/abMEOQd

  


除此之外，WAAPI 的 Level 2 规范还提供了 `GroupEffects` （组合效果）和 `SequenceEffects` （序列效果）两个 API，使得 Web 开发者能更好的创建多动画。

  


WAAPI 的 `GroupEffects` 将一个或多个 `KeyframeEffect` 组合在一起同时播放。它接受一个 `effects` 参数，我们可以在其中传递表示多个动画的 `KeyframeEffects` 数组。一旦定义，我们可以在默认时间轴上播放动画组。

  


例如下面这个效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67987a26601445e3a81161ee83df10a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=552&s=2248578&e=gif&f=181&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/gOEoapK

  


很明显，这是一个分组动画效果，第一组的元素会沿着 `Y` 轴向上移，第二组的元素会沿着 `Y` 轴向下移。我在这里把第一组称为舞蹈组，第二组称为滑雪组。

  


```HTML
<div class="container">
    <!-- 第一组，舞蹈组 -->
    <div  class="animated dance" style="--hue: .5turn">①💃</div>
    <div  class="animated dance" style="--hue: .5turn">①🕺</div>
    
    <!-- 第二组：滑雪组 -->
    <div  class="animated skiing" style="--hue: .25turn">②⛷️</div>
    <div  class="animated skiing" style="--hue: .25turn">②🏂</div>
</div>
<button class="button" id="play">Play</button>
```

  


我们首先初始化两个对象来保存动画所需的关键帧效果：

  


```JavaScript
const danceKeyframeEffects = [];
const skiingKeyframeEffects = [];
```

  


然后，分别给“舞蹈组”和“滑雪组”定义动画效果。这两个动画效果其实很简单，在关键帧中改变 `translate` 属性 `Y` 轴的值，具体代码如下：

  


```JavaScript
const effects = {
    // 舞蹈组关键帧，沿 Y 轴向上移动 100%
    danceKeyframes: [
        {
            translate: "0% 0%",
            offset: 0
        },
        {
            translate: "0% -100%",
            offset: 0.7
        },
        {
            translate: "0% 0%",
            offset: 1
        }
    ],
    // 滑雪组关键帧，沿 Y 轴向下移动 100%
    skiingKeyframes: [
        {
            translate: "0% 0%",
            offset: 0
        },
        {
            translate: "0 100%",
            offset: 0.7
        },
        {
            translate: "0% 0%",
            offset: 1
        }
    ]
};
```

  


在这个示例中，我们为这两组动画设置了相同的动画参数：

  


```JavaScript
const options = {
    duration: 1000,
    easing: "ease-in",
    fill: "both",
    iterations: 1
};
```

  


接下来，使用 `new KeyframeEffect()` 分别为“舞蹈组”和“滑雪组”中的成员创建动画，并推送到相应的 `KeyframeEffects` 数组中。这是创建具有相同动画和定时功能的多个对象的方法。还要注意，我们使用关键帧效果而不是直接调用 `Element.animate()` ，因为我们想更多地控制何时启动动画：

  


```JavaScript
const dances = document.querySelectorAll(".dance");
const skiings = document.querySelectorAll(".skiing");

dances.forEach((dance) => {
    const effect = new KeyframeEffect(dance, effects.danceKeyframes, options);
    danceKeyframeEffects.push(effect);
});

skiings.forEach((skiing) => {
    const effect = new KeyframeEffect(skiing, effects.skiingKeyframes, options);
    skiingKeyframeEffects.push(effect);
});
```

  


使用刚刚创建的关键帧效果作为 `new GroupEffect()` 的参数，就可以创建两个组效果，一个用于“舞蹈组”，一个用于“滑雪组”：

  


```JavaScript
const danceEffect = new GroupEffect(danceKeyframeEffects);
const anim = document.timeline.play(danceEffect);

const skiingEffect = new GroupEffect(skiingKeyframeEffects);
const anim2 = document.timeline.play(skiingEffect);
```

  


最后要做的一件事情就是创建一个按钮来控制动画的播放和暂停。我们可以创建单独的按钮来独立控制每个动画。

  


```JavaScript
const buttonHandler = document.getElementById("play");

buttonHandler.addEventListener("click", (etv) => {
    if (anim.playState !== "running") {
        anim.play();
    } else {
        anim.pause();
    }
    
    if (anim2.playState !== "running") {
        anim2.play();
    } else {
        anim2.pause();
    }
});
```

  


这样我们就能看到示例所呈现的效果，页面上四个元素分为两组动画效果，其中“舞蹈组”的两个元素会沿着 `Y` 轴向上移动，“滑雪组”的两个元素会沿着 `Y` 轴向下移动：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f73cbe05ddb48b1aef08e83dd24fe45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=552&s=2248578&e=gif&f=181&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/gOEoapK

  


`SequenceEffects` 与 `GroupEffect` 有点类似，允许 Web 开发者将多个动画（由 `KeyframeEffects` 指定）分组在一起，但不是并行播放，而是一个接一个地播放。

  


我们把上面示例中的 `new GroupEffect()` 替换为 `new SequenceEffects()` ，其他代码不变：

  


```JavaScript
const danceEffect = new SequenceEffect(danceKeyframeEffects);
const anim = document.timeline.play(danceEffect);

const skiingEffect = new SequenceEffect(skiingKeyframeEffects);
const anim2 = document.timeline.play(skiingEffect);
```

  


你将看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5c852f018ca4acdb7a3870d74d27094~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1166&h=606&s=2175082&e=gif&f=217&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/NWJXjxw

  


`SequenceEffect` 为我们提供了在 CSS 或到目前为止所见动画 API 中需要解决的问题。我们必须基于先前动画的持续时间维护延迟，或使用完成回调。这些方法可能难以维护，并且可能不太精确。

  


注意，`GroupEffect` 和 `SequenceEffects` 为我们提供了制作多动画更高级的 API，如果现在要使用这两个 API 相关的功能，[需要使用 WAAPI 的 Poliyfill](https://github.com/web-animations/web-animations-js)。

  


最后，通过下面这个示例向大家呈现 `GroupEffect` 和 `SequenceEffects` 之间的差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77077d64294a4142881d51036fb13c8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=494&s=3762007&e=gif&f=395&b=340632)

  


> Demo 地址：https://codepen.io/airen/full/oNVpWZj

  


## 硬件加速

  


在过去，你通常会更喜欢 CSS 动画，[因为它可以提供硬件加速，提高动画性能](https://juejin.cn/book/7288940354408022074/section/7308623429937135670)。但是现在，如果浏览器已经支持 WAAPI，你在 WAAPI 中也将获得此加速。

  


当你使用 WAAPI 时，所以动画将在 `document.timeline` 中描述，你（以及浏览器）可以访问所有动画。

  


外部动画库的问题之一是浏览器有时无法识别动画库的元素是正在进行动画的元素，因此它们不会被提升到自己的层级或在 GPU 上呈现。使用 WAAPI，我们告诉浏览器：“嘿浏览器，我正在使用你提供的 API 对这个元素进行动画，你能否使用你可用的方式对其进行优化？”

  


## WAAPI 与 CSS 集成

  


WAAPI 并不是用来替代 CSS 动画或者说现有技术，而是紧密集成在其中。你可以自由选择使用适合你用例和偏好的任何技术。

  


WAAPI 规范不仅定义了一个 API，还旨在为 Web 上的动画提供一个共享的模型。处理动画的其他规划都使用相同的模型和术语。因此，最好将 WAAPI 视为 Web 上动画的基础，并将其 API 以及 CSS 过渡动画（`transition`）和关键帧动画（`animation`）视为共享基础之上的层。

  


这意味着，为了创建一个出色的 WAPI 动画，我们必须从头开始，为 CSS Animations、CSS Transitions 和新的 WAAPI 创建一个全新且共享的动画引擎。即使你不使用 WAAPI，你编写 CSS Animations 和 CSS Transitions ，也可以在新的 WAAPI 引擎中运行。无论选择哪种技术，所有动画都将同步运行和更新，由 CSS 发起的动画和 WAAPI 分派的事件将一起传递等。

  


但对于 Web 开发者来说，可能更重要的是整个 WAAPI 都可以用于查询或控制由 CSS 创建的动画。你可以使用 `Document.getAnimations()` 和 `Element.getAnimations()` 指定纯 CSS 中的动画，但也可以使用 WAAPI 控制它们。

  


很不幸的是，到目前为止，SVG Animations 仍然与 WAAPI 模型不同，并且 WAAPI 与 SVG 之间没有集成。这仍然是 Web 平台改进的一个方向。

  


## 小结

  


WAAPI 在 Web 动画领域确实有着重要的地位，因为它建立了在所有浏览器中描述动画的基础。它为我们提供了许多新选项，如播放控制、JavaScript 中 CSS 硬件加速以及对文档中所有动画的访问。它还允许 Web 开发者将更复杂的动画行为放在 JavaScript 中，从而可以使用 CSS 动画更简单。

总的来说，在 Web 上有很多动画的方式，而 WAAPI 并不是解决所有动画问题的方法。对于常见问题，有一些真正惊人的纯 CSS 解决方案，我建议每个人都尝试在纯 CSS 中执行动画，因为深入研究 CSS 可能真的很有益，因为你并不总是需要 Javascript。 CSS 本身就非常强大。

  


然而，当动画变得更加复杂且您希望更好地控制本机动画时，WAAPI 将成为你的朋友。当你想要创建动态值或处理 DOM 事件以使某些内容更具交互性时，Javascript 将为你提供很大的灵活性。