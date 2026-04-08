[在 CSS 动画和过渡中](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)，我们通常习惯于平滑地从一个值过渡到另一个值，产生[流畅的动画效果](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)。然而，有时候我们希望创建一种分段、定格的动画，而不是连续的过渡。这时，`steps()` 函数就派上用场了。与传统的平滑过渡动画不同，`steps()` 函数为 Web 开发者提供了一种创新的方式，使得我们能够在动画中呈现出分明的离散步骤。这项技术不仅丰富了动画的表现形式，也为 Web 设计师和开发者提供了更大的创作空间。

  


`steps()` 函数之所以引人注目，是因为它允许我们将动画分解成指定数量的步骤，而不是平滑地从一个状态过渡到另一个状态。这种离散的动画呈现方式适用于许多场景，尤其是对于需要突出每一阶段变化的情境，比如游戏动画、图标切换等。通过使用 `steps()` 函数，我们能够创造出更生动、更有趣味性的用户界面，从而能够引起用户的兴趣，提高他们对网站内容的关注度。

  


我将在这节课中带领大家深入研究 `steps()` 函数的应用，将介绍该函数的基本语法和参数配置，通过实际案例演示如何创建各种类型的分段动画。在此过程中，你将学习如何使用 `steps()` 函数来控制动画的步数和方向，同时探讨它在不同场景中的实际运用。通过学习这个功能强大的 CSS 函数，你将能够为你的 Web 应用或页面添加独特和引人注目的动画效果。无论是为了实现独特的视觉效果还是为了满足特定设计需求，了解和掌握 `steps()` 函数都将为你的动画带来新的可能性。

  


无论你是初学者还是经验丰富的 Web 设计师或开发者，都将从这节课中获得实用的技能和灵感。让我们一同深入探讨 `steps()` 函数，为 Web 动画注入新的活力。

  


## steps() 函数可用来做什么

  


在 CSS 动画制作中，我们通常会使用一些熟悉的缓动函数，比如 `linear` 、`ease` 、`ease-in` 、`ease-out` 、`ease-in-out` 和 `cubic-bezier()` 来设置动画从一个状态（初始状态）到另一个状态（结束状态）的速率。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9016eda5ee104abfbfbd16dc085ad1b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1328&h=578&s=1033933&e=gif&f=135&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/wvNezro

  


然而，在 [CSS 规范](https://www.w3.org/TR/css-easing-1)中，还有一种较少为人知的、有些被忽视的缓动函数，它被称为步进缓动，也被称为阶梯缓动，即 **`steps() 缓动函数`**。这种强大的技术允许我们将动画分解成指定数量的步骤，而不是平滑地从一个状态过渡到另一个状态，这意味着动画可以跳跃地从一个关键帧到另一个关键帧。

  


步进缓动函数 `steps()` 遵循一个简单的原则：**它使你能够指定动画应该跳跃到达其最终值所需的步数**。举个例子，想象一个动画，动画元素的透明度 `opacity` 从 `0` 过渡 `1` 用时 `1s` ，并且分 `4` 步完成。在这个时间段内，动画元素的不透明度（`opacity`）将在不同的时间内瞬间过渡到特定的值：

  


```CSS
@layer animation {
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .ball {
        animation: fadeIn 1s steps(5) infinite alternate;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef7ea1dd03bf4af3ae61a9f0db7fb49e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1767&s=754798&e=jpg&b=282b3e)

  


在这些预定义的值之间，不透明度保持静止，产生一种类似于定格在时间中的快照的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38ba13cfb00243808fd09b67404cad55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=964&h=462&s=167480&e=gif&f=93&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/ZEwypMj

  


可能上面这个示例还不够明显。我们再来看一个类似 Twitter 点赞按钮的动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa90a8ba0e8144d8a526962bde3e8d72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=472&s=2977804&e=gif&f=288&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/LYqLRMP

  


再来看一个复杂一点的场景，由 [@Julien Knebel 提供的一个使用 steps() 模拟《街头霸王2》的动画效果](https://codepen.io/jkneb/full/DRWdGg)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6529f4e5aca9425baaf40803533fabe2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=688&h=256&s=4447729&e=gif&f=306&b=f9f3f2)

  


> Demo 地址：https://codepen.io/jkneb/full/DRWdGg

  


正如你所看到的，虽然标准的缓动函数可以使动画元素沿着平滑的缓动曲线运动，但步进缓动函数 `steps()` 却带有一些不寻常的气息。通过强制动画在设定的点之间跳跃，Web 开发者可以为项目注入一种突然的动感。步进缓动函数的明确、量化的特性为创造性的自由提供了可能性，特别适用于需要明显、离散变化的情景。

  


无论是打造独特的加载动画还是为精灵注入生命（精灵动画），步进缓动函数的受控跳跃为动画带来了新的视角，使其更具吸引力和独特性。随着我们深入探讨步进缓动函数的微妙之处，并探索它在各种动画场景中的应用，让我们踏上一段为 Web 动画注入新生命的旅程，使其更为独特、引人入胜，最重要的是令人难忘。

  


## steps() 函数的简介

  


[W3C 规范](https://www.w3.org/TR/css-easing-1/#step-easing-functions)是这样定义步进缓动函数 `steps()` 的：

  


> **`steps()`** **函数是一种缓动函数类型，将输入时间分为指定数量的等长间隔**。

  


简单地说，步进函数 `steps()` 也是 CSS 中用于动画的一种缓动函数，同样可用定义动画在其持续时间内的时间进度。它和其他缓动函数不同的是，步进缓动函数 `steps()` 允许我们将动画或过渡分解为多个片段，而不是从一个状态到另一个状态的连续过渡。这意味着，`steps()` 函数将动画分为一定数量的步骤，使得动画的变化变得离散而非连续。

  


`steps()` 函数接受两个参数：

  


```
steps() = steps(<integer>[, <step-position>]?)

<step-position> = jump-start | jump-end | jump-none | jump-both | start | end
```

  


它由步数（`<integer>`）和方向（`<step-position>`）两个参数组成：

  


-   **步数（** **`<integer>`** **）** ：指定动画应该分成多少个步骤。它必须是大于 `0` 的正整数，除非第二个参数是 `jump-none` ，在这种情况下，它必须是大于 `1` 的正整数
-   **方向（** **`<step-position>`** **）** ：这是一个可选参数，指定动画的方向，可以是 `jump-start` 、`jump-end` 、`jump-none` 、`jump-both` 、`start` 和 `end` 中的另一个。默认是 `end` 。该参数定义了在 `@keyframes` 中声明的动作将发生的时间点。

  


这个函数的工作方式是在每个步骤中直接跳转到下一个状态，而不是平滑地过渡。这使得 `steps()` 函数特别适用于模拟帧动画或其他需要离散状态变化的情况。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bd00c062e6e4796a0761589a15b9c93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=462&s=2788100&e=gif&f=252&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/QWYgdNe

  


上面示例所展示的是 `steps()` 函数与我们常用的缓动函数的效果对比。它们之间的差异一目了解，现在的你，可能更想知道的是 `steps()` 函数每个值的具体作用以及在什么情况下最适合使用哪个值？

  


## 在动画中如何使用 steps() 函数

  


`steps()` 函数也是 [CSS 缓动函数中的一种](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)，它可以用于 CSS 的 `transition-timing-function` 和 `animation-timing-function` 以及它们的简写属性 `transition` 和 `animation` 。例如：

  


```CSS
.transition {
    transition-timing-function: steps(5);
}

.animation {
    animation-timing-function: steps(5);
}
```

  


`steps()` 缓动函数与其他缓动函数有所不同，该函数通过指定动画中的步数，将动画分为不同的间隔。这种缓动函数的使用方式与其他缓动函数不同，它以分段的方式控制动画的运动。例如下面这个示例：

  


```HTML
<div class="animated" style="--easing: linear">
    <!-- 动画运用 linear 缓动函数 -->
</div>

<div class="animated" style="--easing: steps(4)">
    <!-- 动画运用 steps() 缓动函数 -->
</div>
```

  


```CSS
@layer animation {
    @keyframes move {
        to {
            translate: 400px;
        }
    }
  
    .animated {
        animation: move 4s var(--easing) 1 both;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bc1f5cc1c7f4069b48235e89e2890e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=538&s=789608&e=gif&f=343&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/LYqLWGM

  


正如你所看到的， `linear` 函数使动画平滑的从初始状态过渡到终点状态；而 `steps(4)` 函数将动画分为 `4` 个步骤。这意味着动画会在整个过程中跳跃，而不是平滑过渡。

  


就上面这个示例而言，`steps(4)` 函数使关键帧动画分了四段来执行：

  


```CSS
@keyframes move2 {
    0%, 24.9% {
        translate: 0;
    }
    
    /* 第一步 */
    25%,49.9% {
        translate: 100px;
    }
    
    /* 第二步 */
    50%,74.9% {
        translate: 200px;
    }
    
    /* 第三步 */
    75%,99.9% {
        translate: 300px;
    }
    
    /* 第四步 */
    100% {
        translate: 400px;
    }
}

.linear {
    animation: move2 4s var(--easing) 1 both;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccaf901af90a418facca5b18191e33cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=650&s=1093005&e=gif&f=330&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/KKJqWZX

  


虽然我们在关键帧上通过分段的方式使 `linear` 缓动函数的运行行为类似于 `steps()` 函数，但这是有一定的局限性的。对于一个简单的动画，我们可以像上面这样来调整 `@keyframes` ，但对于一个有很多步数的动画，再使用这种方式就不是易事，而且还容易出错。

  


就这种分段跳跃式的动画而言，`steps()` 最具优势了。除此之外，`steps()` 函数还可以具有第二个参数，用于指定动画在何处进行跳跃。这也是 `steps()` 函数主要功能之一，而且也是令 Web 开发者感到困惑的一个地方。换句话说，你要彻底掌握 `steps()` 函数，你就需要明白它的第二个参数。

  


### 搞清楚 `steps()` 函数中的 start 和 end

  


`steps()` 函数可以接受两个参数，其中第一个参数用来指定将一个动画分成多少段，第二个参数用来指定动画中动作将发生的时间点。相对而言，第一个参数是直观的，易于理解的；第二个参数对于大多数 Web 开发者是有难度的，总是搞不清楚，最主要就是 `start` 和 `end` 傻傻分不清楚。接下来，我们就来聊一聊 `steps()` 函数中的 `start` 和 `end` ，它们的差别是什么？作用又是什么？

  


在 `steps()` 函数中，第二个参数的值主要有 `jump-start` 、`jump-end` 、`jump-none` 、`jump-both` 、`start` 和 `end` 。其中带有 `start` 和 `end` 关键词的是 `jump-start` 、`jump-end` 、`start` 和 `end` 。其实，`start` 和 `end` 是 `steps()` 函数的原始值，而 `jump-start` 和 `jump-end` 分别是它们的别名。也就是说，`jump-start` 和 `jump-end` 分别与原始的 `start` 和 `end` 等价：

  


```
jump-start === start
jump-end   === end
```

  


新增 `jump-` 前缀就是表示跳过的意思，能更清晰地解释 `start` 和 `end` 。也就是说，使用 `start` 或 `jump-start` 时，表示跳过起始位置；使用 `end` 或 `jump-end` 时，表示跳过结束位置。

  


说了这么多，你可能只了解到 `jump-start` 等价于 `start` 和 `jump-end` 等价于 `end` ，但并不知道 `jump-start` （或 `start`）与 `jump-end` （或 `end`）两者之间的差异。不用着急，我们通过示例来一步一步来解释它们之间的差异。

  


假设你有一个动画，它沿着 `x` 轴从 `0` 的位置移动到 `50vw` 。我们使用 [CSS 的 @keyframes](https://juejin.cn/book/7288940354408022074/section/7295617447058407474) 很容易就将这个动画描述出来：

  


```CSS
@keyframes moveX {
    to {
        translate: 50vw;
    }
}
```

  


要是将 `moveX` 关键帧动画应用在 `.animated` 元素上，整个动画持续了 `4s` 时间，而且是分四个步骤（`steps(4)`）完成：

  


```CSS
.animated {
    animation: moveX 4s steps(4);
}
```

  


前面说过了，如果 `steps()` 函数未显式指定第二个参数，那么其值是默认值 `end` ，也就是 `jump-end` 。因此，上面的代码等同于：

  


```CSS
.animated {
    animation: moveX 4s steps(4, jump-end);
    
    /* 等同于 */
    animation: moveX 4s steps(4, end);
}
```

  


暂不说 `jump-end` 是啥意思和起什么作用。

  


我们先暂时回顾一下，如果 `moveX` 动画指定的缓动函数是 `linear` ，那么它的执行过程大致会像下面这样：

  


-   第 `0s` 时（初始位置），动画元素位于 `0` 的位置，即 `translate: 0`
-   第 `1s` 时 （执行了 `1s` ），动画元素位于 `100px` 的位置，即 `translate: 100px` （从 `0` 移动到 `100px`）
-   第 `2s` 时（执行了 `2s`），动画元素位于 `200px` 的位置，即 `translate: 200px` （从 `100px` 移动到 `200px`）
-   第 `3s` 时（执行了 `3s`），动画元素位于 `300px` 的位置，即 `translate: 300px` （从 `200px` 移动到 `300px`）
-   第 `4s` 时（执行了 `4s` ），动画元素位于 `400px` 的位置，即 `translate: 400px` （从 `300px` 移动到 `400px`）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41efc3f8084a449380f53f913796a7ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1767&s=866894&e=jpg&b=282b3e)

  


使用 `steps(4, jump-end)` 或 `steps(4, jump-start)` 缓动函数，会将 `moveX` 动画分为四段（它的第个参数 `4` 决定），但第二个参数 `jump-end` 和 `jump-start` 将会指过 `moveX` 中声明的动作将发生的时间点。下将向大家阐述它们两之间的差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf81dc3e28b54e098ac25c9f2e91885b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4017&h=1961&s=1872341&e=jpg&b=282b3e)

  


-   `start` 或 `jump-start` 表示一个左连续函数，动画的第一步将在动画开始时立即完成。它会立即跳到第一步的末尾，并一直保持在那里，直到这一步的持续时间结束。这意味着，使用 `start` 或 `jump-start` 时，表示跳过起始位置。
-   `end` 或 `jump-end` 表示一个右连续函数，它指示元素保持不动，直到第一步的持续时间完成。这意味着，使用 `end` 或 `jump-end` 时，表示跳过结束位置。

  


每个选项实质上都会将元素从不同的一侧移动，并会为相同的动画产生不同的定位。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1398f2da82e4347bf9380998efbd60f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=656&s=1402941&e=gif&f=273&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/NWogjgz

  


W3C 规范提供了一张时序图来解释 `start` （或 `jump-start`）和 `end` （`jump-end`）两者之间的差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed578f82a6254d2ea7c7724084b769ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1211&s=195824&e=jpg&b=ffffff)

  


按照上图所表述的意思，那么上面示例中 `steps(4, jump-start)` 和 `steps(4, jump-end)` 对应的时序图将会是像下面这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce31dededae949808532801f3992d68b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2696&h=2664&s=1193177&e=jpg&b=292c3f)

  


正如你所看到的，`jump-start` （或 `start`）表示直接开始。也就是时间才开始，就已经执行了一个距离段。于是，`steps(4, jump-start)` 函数将动画分成四段，起点被忽略，因为时间一开始直接就到了第二个点。

  


`jump-end` （或 `end` ）表示表示戛然而止。也就是时间一结束，当前距离位移就停止。于是，`steps(4, jump-end)` 函数将动画分成四段，结束点被忽略，因为等要执行结束点的时候已经没有时间了。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad901a3afd664289a3edcb892d8d408a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2696&h=1835&s=879895&e=jpg&b=282b3e)

  


这里 `jump-end` （或 `end`）和 `jump-start` （或 `start`）所指的开始和结束是相对于时间（动画的持续时间）而言的，但是，如果站在人类可感知的具体事物而言，`jump-end` （或 `end`）和 `jump-start` （或 `start`）却有相反的含义。因此，你可以这么理解：

  


-   `jump-start` （或 `start`）：表示结束。分段结束的时候，时间才开始走（动画才开始播放）。于是，`steps(4, jump-start)` 动画执行的四个分段点是后四个点
-   `jump-end` （或 `end`）：表示开始，分段开始的时候，时间跟着一起走（动画开始播放）。于是，`steps(4, jump-end)` 动画执行的四个分段点是前四个点

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/309549d06c874d32b0ba724dbc894d95~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2696&h=1835&s=887202&e=jpg&b=282b3e)

  


你也可以将 `steps(n)` 函数视为在指定间隔内使用线性缓动（`linear`）拍摄动画的快照，并在显示下一个快照之间显示该快照。因此，当我们说我们要 `steps(4, jump-end)` 时，我们将得到一个将动画分成四个部分并拍摄每个部分的初始位置的动画。使用 `steps(4, jump-start)` 时，我们得到一个将动画分成四个部分，并在每个部分中拍摄最终位置的动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c26ed8c9ec154cf7b9a8fd8d51b7d0ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=612&s=1864519&e=gif&f=279&b=2f4f7f)

  


> Demo 地址：https://codepen.io/airen/full/oNmwqLG

  


正如上图所呈现的，`steps(4, jump-start)` 有一个明显的空档（没有图片）。

  


### steps() 函数中的 jump-none

  


你可能已经发现了，`jump-start` （或 `start`）和 `jump-end` （或 `end`）选项，总是会让动画跳过结束状态或开始状态。但有的时候这两者都可能不是我们想要的动画效果，也就是说，希望动画不跳过动画的初始或结束状态。这个时候，`steps()` 函数的另一个新选项 `jump-none` 就可以派上用场了。

  


`jump-none` 允许动画不跳过开始或结束状态。对于任何至少有两个步骤的动画，动画的起始状态和结束状态都将被表示。其余的步骤将均匀分布。三个步骤将在 `0%` 、`50%` 和 `100%` 处分别拍摄它们的有效快照。

  


> 注意，`steps()` 函数第二个参数设置为 `jump-none` 时，它的步数必须大于 `1` ，至少从 `2` 开始！

  


这个选项的一个简单应用是移动屏幕上的对象。我们可能希望通过 `steps()` 缓动函数将动元素从点 `A` （动画初始状态元素的位置，如 `translate: 0`）移动到点 `B` （动画结束状态元素的位置，如 `translate: 50vw`）。不管是选择 `jupm-start` （或 `start`）还是 `jump-end` （或 `end`）时，动画总是会跳过初始状态或结束状态。也就是说，它们无法告诉动画在两者之间显示相等的帧数的起始位置和结束位置。现在增加了 `jump-none` 选项，我们可以实现这个目标。

  


```CSS
@keyframes moveX {
    0% {
        translate: 0;
    }
    
    100% {
        translate: 50vw;
    }
}

.animated {
    animation: moveX 4s steps(4, jump-none) infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ef092f16d8a4a50a677ac353aa8ff9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=554&s=1091121&e=gif&f=224&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/YzBQaod

  


如上图所示，`steps(4, jump-none)` 将动画分成四段，分别是 `0%` 、`33.333%` 、`66.667%` 和 `100%` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29e04c3c43e4437d90447354aa2533f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3605&h=1835&s=1242018&e=jpg&b=282b3e)

  


同样的，我们可以通过模拟快照的方式来查看 `jump-none` 与 `jump-start` 与 `jump-end` 之间的差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e1e8340dfd24038a1b84859da5bdd41~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=236&s=1355629&e=gif&f=265&b=2f4f7e)

  


> Demo 地址：https://codepen.io/airen/full/xxMrzrb

  


`jump-none` 非常适合用淡出或淡入的动画效果中。假设我们想通过 `steps()` 函数使动画元素的透明度（`opacity`）从 `1` 过渡到 `0` ，即实现一个淡出的动画效果。要是 `steps()` 函数的第二个参数使用 `jump-start` 或 `jump-end` 的话，完全不透明或完全透明的状态将永远不会被看到。但是 `jump-none` 可以确保完全透明和完全不透明都可见。例如，一个使用 `steps(2, jump-none)` 的动画将产生一个直接的开或关的动画，可以创建一个闪烁的动画效果，而 `steps(4, jump-none)` 可以将元素的 `opacity` 分四个状态，分别是 `1` 、`.667` 、`.33` 和 `0` ：

  


```CSS
@keyframes fadeOut {
    form {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.animation-1{
    animation: fadeOut 2s steps(2, jump-none) infinite; 
}

.animation-2 {
    animation: fadeOut 4s steps(4, jump-none) infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95a3a2a3612142b9980a0765e2206142~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=532&s=15291096&e=gif&f=167&b=30062d)

  


> Demo 地址：https://codepen.io/airen/full/abXwKGO

  


### steps() 函数中的 jump-both

  


现在我们知道了，`steps()` 函数中的 `jump-start` （或 `start`）、`jump-end` （或 `end`）、`jump-none` 可以让动画元素：

  


-   `jump-start` 跳过初始状态
-   `jump-end` 跳过终点状态
-   `jump-none` 初始状态和终点状态都不跳过

  


同样的，我们有时候制作动画效果的时候，希望同时跳过动画的初始状态和终点状态。这个时候，`jump-both` 就非常有用了。它允许动画将初始状态和终点状态都跳过， 并在此过程将动画分成多段。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2b6c82d83ac42dba80956853d4437c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=618&s=998514&e=gif&f=167&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/NWogzeO

  


`steps(4, jump-both)` 将动画分成四段，分别跳过 `0%` 和 `100%` ，而动画的四个步骤点分别是 `20%` 、`40%` 、`60%` 和 `80%` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/badcb37c4c3a4005829c12511eedf67e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2566&h=3340&s=1592364&e=jpg&b=282b3e)

  


`jump-both` 对应的快照方式如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14dca58b5eb54305ba3c4e00e7f5ddbb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1422&h=236&s=2099577&e=gif&f=303&b=2f4f7e)

  


> Demo 地址：https://codepen.io/airen/full/RwvgBpJ

  


### steps() 函数会受到哪些属性的影响

  


`steps()` 函数的最终表现结果会受到 `animation-fill-mode` 属性值的影响，而 `animation-fill-mode` 属性又会受到 `animation-direction` 和 `animation-iteration-count` 的影响。在这里不会将所有情景向大家展示，我将相应的情景简化一下向大家展示。

  


假设动画的迭代次数为 `1` ，我们来改变 `animation-fill-mode` 属性的值，看看它对 `steps()` 函数的呈现有何影响。

  


```CSS
@layer animation {
    @keyframes move {
        to {
            translate: 50vw;
        }
    }
  
    .animated {
        --animation-fill-mode: none;
        animation: move 4s var(--easing) 1 var(--animation-fill-mode);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae52777ff00c49b89f503d6cd06d282a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=668&s=2670738&e=gif&f=546&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/yLZXQyB

  


`move` 动画只执行一次，因为没有设置 `infinite` 无限循环。我们以 `animation-fill-mode: forwards` 为例，`forwards` 表示关键帧动画在动画结束后，动画元素的样式设置为动画的最后一帧的样式。它所呈现的效果刚好 `forwards` 词表面意思相反。所以，上面示例中的动画，不管缓动函数是 `linear` 还是 `steps()` 函数（即使它的第二个参数为不同的值），整个动画停止在关键帧 `move` 最后的状态，即 `translate: 50vw` 。对于 `steps()` 函数，整个动画停止在第 `5` 个分段点上。

  


使用快照的方式，更易于理解一点：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20a5d5b6d009452a8569e1d0e1102752~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=360&s=2018827&e=gif&f=512&b=2f4f7e)

  


> Demo 地址：https://codepen.io/airen/full/GRzEBXz

  


以 `animation-fill-mode` 的 `forwards` 值为例，它会使动画元素将样式从 `@keyframes` 中最后一帧（通常是 `100%`）延伸到动画的持续时间之外，并保留该状态。将其与动画中的 `steps()` 函数结合使用，使动作看起来好像初始静止状态不计入步数的总和，正如应该使用 `jump-end` 或 `end` ，或者说动画元素在 `steps()` 函数之外再走一步。正如上面示例所示，`steps(6, jump-start)` 和 `steps(6, jump-end)` 遇到 `animation-fill-mode: forwards` 时，待动画结束之后，容器中看不到任何东西。

  


这显然不是我们想要的，怎么处理呢？我们可以消减分段个数和动画运动的跨度。例如：

  


```HTML
<div class="wrapper" style="--easing: steps(4,jump-start);--animationFillMode: none;">
    <div class="octocat"></div>
    <div class="roll"></div>
</div>

<div class="wrapper" style="--easing: steps(3,jump-start);--animationFillMode: none;">
    <div class="octocat" style="--name: octocat-animation2;"></div>
    <div class="roll" style="--name: roll-animation2;"></div>
</div>
```

  


```CSS
@layer animation {
    /* 服务于 steps(4, jump-start) */
    @keyframes roll-animation {
        0% {
            translate: 0;
        }
        100% {
            translate: -200px;
        }
    }
    @keyframes octocat-animation {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -200px 0;
        }
    }
  
    /* 服务于 steps(3, jump-start)，它比四步少了一个跨度 */
    @keyframes roll-animation2 {
        0% {
            translate: 0;
        }
        100% {
            translate: -150px;
        }
    }
    @keyframes octocat-animation2 {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -150px 0;
        }
    }
    
    .octocat {
        --name: octocat-animation;
        animation: var(--name) var(--duration) var(--easing) 1 var(--animationFillMode);
    }
    .roll {
        --name: roll-animation;
        animation:var(--name)  var(--duration) var(--easing) 1 var(--animationFillMode);
    }
}
```

  


这样调整之后，你会发现调整后 `steps(3,jump-start)` 和 `octocat-animation2` 构建的动画效果才是我们所期望的（下图中右侧的效果）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d5693969f7f40d896c5c9644fe6d5d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=248&s=2202661&e=gif&f=639&b=304f7f)

  


> Demo 地址：https://codepen.io/airen/full/vYbZzjY

  


就 `jump-start` 或 `start` 而言，即使 `animation-iteration-count` 属性设置为 `infinite` ，`steps()` 也会有一个空档帧（什么都没有），但 `jump-end` 和 `end` 不会有这个现象。所以说，你要是使用 `steps()` 函数来制作雪碧图动画，选择 `jump-end` 的效果要好于 `jump-start` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b84c29612f84bc3a64916a4b622851e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=382&s=4119818&e=gif&f=1099&b=2f4f7e)

  


> Demo 地址：https://codepen.io/airen/full/OJdgaKL

  


刚才提到过，`animation-fill-mode` 属性也会受 `animation-direction` 属性的影响。这也意味着它对 `steps()` 函数最终呈现的效果也会有相应的影响。具体效果如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8307b5147d0046ce8626b98e6ec30d50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1268&h=708&s=8526556&e=gif&f=1593&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/vYbZvpB

  


有关于 `animation-fill-mode` 、`animation-direction` 以及 `animation-iteration-count` 对 `steps()` 函数的影响就聊到这里。小册后续的课程中还会详细介绍 `animaiton-fill-mode` 和 `animation-direction` ，这部分内容已超过这节课的范畴，因此不再过多阐述！

  


### step-start 和 step-end

  


`step-start` 和 `step-end` 是 `steps()` 缓动函数中用于指定步进位置的两个预定值。

  


-   **`step-start`** ：它等效于 `steps(1, start)` 或 `steps(1, jump-start)` 。此步进位置将使动画在开始时立即完成第一步，并立即跳到第一步的结束位置。在整个步进的持续时间内，元素将停留在第一步的结束位置
-   **`step-end`** ：它等效于 `steps(1, end)` 或 `steps(1, jump-end)` 。此步进位置将使动画在开始时等待，直到第一步的持续时间结束，然后立即完成第一步，停留在第一步的结束位置。在整个步进的持续时间内，元素将保留在第一步的结束位置

  


这两者的区别在于它们对第一步的处理方式，即 `step-start` 在动画开始时立即完成第一步，而 `step-end` 在动画开始时等待第一步的持续时间。

  


简单地说，`step-start` 和 `step-end` 是一步到位（`step-start`）和延迟到位（`step-end`）。

  


在实际项目当中，如果动画只有 `0%` （或 `from`）和 `100%` （或 `to`）两个关键帧，那么 `step-start` 和 `step-end` 就没有任何意义。如果关键帧动画是非等分，无法过渡的阶梯动画，那么它们的存在还是有意义的。例如下面这个动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0086791afe4449c49bd38a644ecd827c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=352&s=20968&e=gif&f=90&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/gOqRErj

  


其核心代码如下：

  


```CSS
@layer animation {
    @keyframes loading {
        25% {
            box-shadow: none; /* 0个点 */
        } 
        50% {
            box-shadow: 0.5em 0; /* 1个点 */
        } 
        75% {
            box-shadow: 0.5em 0, 1.5em 0; /* 2个点 */
        } 
    }
    
    button::after {
        box-shadow: 0.5em 0, 1.5em 0, 2.5em 0;
        animation: loading 2s infinite step-start both;
    }
}
```

  


## steps() 缓动函数的用例

  


CSS 的 `steps()` 缓动函数在动画中的运用也非常地多，而且是其他 [CSS 缓动函数](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)无法达到的效果。 例如，我们可以使用 `steps()` 缓动函数来创建精灵动画（Sprite Animation）、创建频闪效果、模拟钟表指针运动、打字机效果、游戏场景、加载动画、交互动画等。

  


### 精灵动画

  


我们先从最经典的精灵动画开始。

  


精灵动画（Sprite Animation）是一种通过快速连续显示图像的不同帧来创建动画效果的技术。在精灵动画中，所有动画的图像帧都包含在一个图像文件（通常是一个精灵表或精灵图）中的不同部分。通过在屏幕上迅速切换显示这些不同的图像帧，就能够创建出动画效果。

  


假设你有一张像下图这样的精灵图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7abd788ca6e042d581c8cabfb510b40f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2304&h=190&s=346128&e=png&b=f6f2f0)

  


上图是由 `16` 张 `144px x 190px` 图像拼接而成的精灵图（也称雪碧图）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddd5eb77ce914533b6c36b74b2a8c95e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=803&s=563203&e=jpg&b=fdfcfc)

  


通过将位置从 `translateX(0)` 过渡到 `translateX(-1600%)` （或使用背景位置 `background-posiiton: -1600%` ），实现动画效果。在这个动画效果中，`steps()` 函数将发挥着关键性的作用，它可以指定动画分 `16` 步完成，这个步数对应着精灵图中的图像数量。由于我们将整个精灵图的宽度进行了平移，最终状态将不可见，因此需要给 `steps()` 函数指定步进位置，这里使用 `jump-end` ，可以神奇的捕捉每一帧。

  


```HTML
<div class="octocat"></div>
<div class="roll"></div>
```

  


```CSS
@layer animation {
    @keyframes roll-animation {
        0% {
            translate: 0;
        }
        100% {
            translate: calc(var(--w) * -1);
        }
    }
    
    @keyframes octocat-animation {
        from {
            background-position: 0 0;
        }
        to {
            background-position: calc(var(--w) * -1) 0;
        }
    }
  
    .wrapper {
        --opacity: 0;
        --duration: 2s;
        --w: 2304px;
        --h: 190px;
        --steps: 16;
        --easing: steps(var(--steps), jump-end);
        --bg-size: var(--w) var(--h);
    }

    
    .octocat {
        animation: octocat-animation var(--duration) var(--easing) infinite;
    }
    .roll {
        animation: roll-animation var(--duration) var(--easing) infinite;
    } 
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/580b8c8ff8ee40b9b6f2242560add6dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=324&s=6624187&e=gif&f=240&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/ZEwJRYR

  


在这个示例中，我们分别展示了如何使用 `translate` 和 `background-position` 实现精灵动画。

  


拿`background-position` 方案为例。精灵的第一帧显示为背景图像，而其余帧则刚好在视野之外。通过将图片向左滑动，以便显示其余帧，只需要将 `background-position-x` 的值设置背景宽度相等的一个负值，例如示例中的 `-2304px` 。另外，容器的尺寸刚好是精灵图中每一帧图像的尺寸，比如上例是 `144px` 宽，`190px` 高：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9254eb1eecab48dfb307afa674222046~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=610&s=469438&e=jpg&b=fbf9f9)

  


在制作精灵动画时，有一个细节要注意，当动画元素或其容器尺寸调整之后，精灵图片的 `background-size` 和关键帧动画中的 `translateX` 或 `background-position-x` 的值也需要按容器调整的比例进行调整。例如，如果将上面示例中容器尺寸调整为 `72px x 95px` ，相比原先尺寸缩小一半。这意味着精灵图片的 `background-size` 的宽和高也需要相应的缩小一半，关键帧中的 `translateX` 和 `background-position-x` 对应的负值也需要缩小一半：

  


```CSS
@layer animation {
    @keyframes roll-animation {
        0% {
            translate: 0;
        }
        100% {
            translate: calc(var(--w) * -1);
        }
    }
    @keyframes octocat-animation {
        from {
            background-position: 0 0;
        }
        to {
            background-position: calc(var(--w) * -1) 0;
        }
    }

    .wrapper {
        --opacity: 0;
        --duration: 2s;
        --w: 2304px;
        --h: 190px;
        --steps: 16;
        --easing: steps(var(--steps), jump-end);
        --bg-size: var(--w) var(--h);
        
        /* 缩小一半 */
        &:nth-child(2) {
            --w: 1152px; /*2304px*/
            --h: 95px; /*190px*/
        }
    }

    .octocat {
        animation: octocat-animation var(--duration) var(--easing) infinite;
    }
    .roll {
        animation: roll-animation var(--duration) var(--easing) infinite;
    }
}

@layer demo {
    /* background-positon 实现精灵动画 */
    .octocat {
        width: calc(var(--w) / var(--steps));
        height: var(--h);
        background: var(--bg) no-repeat left top / var(--bg-size);
    }

    /* translate 实现精灵动画 */
    .roll {
        width: var(--w);
        height: var(--h);
        background: var(--bg) no-repeat left top / var(--bg-size);
    }

    .wrapper {
        width: calc(var(--w) / var(--steps));
        height: var(--h);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d0526e9c8d14dc8ba27952a20ef73d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1164&h=418&s=7652621&e=gif&f=178&b=fefefe)

  


  


> Demo 地址：https://codepen.io/airen/full/yLZoxgg

  


注意，你可以缩小尺寸，但不建议放大尺寸，因为放大尺寸容易造成图片失真。

  


当然，你可能会想到通过百分比（`%`）单位来计算相关尺寸，但你需要知道百分比计算时，`translate` 是相对于元素自身的宽度计算，而 `background-position 的百分比就比较复杂了`。这已超出这节课的范畴了，因此不在这里阐述 `background-position` 属性取百分比值的计算。你只需要记住，它的计算相对而言要比示例中使用自定义属性计算复杂的多，而且还很容易出错。简而言之，在制作精灵动画时，`background-position` 请惧用百分比值。

  


稍微熟悉 CSS 的开发者都知道，精灵图的拼接方式是多样的，可以是横拼，竖拼和矩阵方式拼接，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d7b3a4962f340fca5ae323d3e5e25bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=1913&s=1748769&e=jpg&b=fdfbfb)

  


大家需要知道的是，精灵图拼接方式不同，我们在定义关键帧 `@keyframes` 也是有所差异的，不然整个精灵动画效果就会不符合你的预期。

  


就上例而言，如果你的精灵图换成下面这种竖排模式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70660c819f394a69b708ad186dedfa3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=194&h=4080&s=415652&e=png&a=1&b=090909)

  


那么相应的 `@keyframes` 和样式就要像下面这样调整：

  


```CSS
@layer animation {
    @keyframes roll-animation {
        0% {
            translate: 0 0;
        }
        100% {
            translate: 0 calc(var(--h) * -1);
        }
    }
    
    @keyframes octocat-animation {
        from {
            background-position: 0 0;
        }
        to {
            background-position: 0 calc(var(--h) * -1);
        }
    }

    .wrapper {
        --opacity: 0;
        --duration: 1s;
        --w: 194px;
        --h: 4080px;
        --steps: 16;
        --easing: steps(var(--steps), jump-end);
        --bg-size: var(--w) var(--h);
    }

    .octocat {
        animation: octocat-animation var(--duration) var(--easing) infinite;
    }
    .roll {
        animation: roll-animation var(--duration) var(--easing) infinite;
    }
}

@layer demo {
    .octocat {
        width: var(--w);
        height: calc(var(--h) / var(--steps));
        background: var(--bg) no-repeat left top / var(--bg-size);
    }

    .roll {
        width: var(--w);
        height: var(--h);
        background: var(--bg) no-repeat left top / var(--bg-size);
    }

    .wrapper {
        width: var(--w);
        height: calc(var(--h) / var(--steps));
        position: relative;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90415c9918f0496fb4c07917442d811a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=450&s=3303418&e=gif&f=151&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/vYbJzjq

  


要是你的精灵图像下图这样矩阵排列，那么对应的 `@keyframes` 会变得更为复杂一些。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5f0e0992e1242d0b890f588a0f155ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=1819&s=448720&e=png&a=1&b=7a4b3f)

  


[@Eduardo Moreno 使用上图制作了一个更为复杂的精灵动画](https://codepen.io/emoreno911/full/PmKmYO)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a40a7a7a3fba470e815c87615ae1ee33~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=502&s=15322796&e=gif&f=147&b=2189d9)

  


> Demo 地址：https://codepen.io/airen/full/xxMLaMQ

  


核心代码如下：

  


```HTML
<div class="char-wrap">
    <div class="char-svg"></div>
</div>
```

  


```CSS
.char-svg {
    height: 64px;
    width: 32px;
    background: url(https://dl.dropbox.com/s/gup87pb8b7rvmd7/sprite-color.svg) no-repeat;
    background-size: 450px 341px; /*非常重要*/
    animation: stand 0.8s steps(4) infinite;
}


/* 走的动作 */
@keyframes walk {
    from {
        background-position: -14px -84px;
    }
    to {
        background-position: -224px -84px;
    }
}

.char-svg.walk {
    animation: walk 1s steps(6) infinite;
}

/* 跑的动作 */
@keyframes run {
    from {
        background-position: -228px -84px;
    }
    to {
        background-position: -436px -84px;
    }
}
.char-svg.run {
    animation: run 1s steps(6) infinite;
}

/* 蹲下的动作 */
@keyframes crouch {
    from {
        background-position: -290px -10px;
    }
    to {
        background-position: -365px -10px;
    }
}
.char-svg.crouch {
    animation: crouch 1.6s steps(2) infinite;
}

/* 跳的动作 */
@keyframes jump {
    from {
        background-position: -14px -220px;
    }
    to {
        background-position: -224px -220px;
    }
}
.char-svg.jump {
    height: 82px;
    animation: jump 1s steps(6) infinite;
}

@keyframes play {
    from {
        background-position: -14px -84px;
    }
    to {
        background-position: -440px -84px;
    }
}

@keyframes stand {
    from {
        background-position: -20px -10px;
    }
    to {
        background-position: -152px -10px;
    }
}
```

  


正如你所看到的，你只需要将精灵动画与其他动画结合起来，你就可以在游戏场景为一些元素添加动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26cb136244734f60b42556dc92770ba2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=442&s=4686384&e=gif&f=72&b=fed5b1)

  


> Demo 地址：https://codepen.io/airen/full/mdvMzpO

  


这两个示例所呈现的精灵动画很像游戏中的角色动画。正如你所看到的一样，精灵动画通常可以用来制作游戏中的角色动画，其中一个角色的不同动作和状态都可以绘制在同一个精灵图上，游戏引擎通过切换显示不同的帧来模拟角色的运动和行为。这种技术能够在有限的资源下实现丰富的动画效果，因为所有帧都包含在一个图像文件中，避免了每帧单独加载的开销。

  


除此之外，只需要我们开动大脑，`steps()` 制作精灵动画的时，还可以和其他帧动画结合起来一起创造出更有创意的动画效果，比如下面这个章鱼遨游海洋世界的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/683f6c49470c4ad982579484c90c52dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=478&s=2193791&e=gif&f=121&b=1f5080)

  


> Demo 地址：https://codepen.io/airen/full/MWLvPRx

  


前面所展示的精灵动画，大多都类似于模拟游戏中角色的动画。事实上，它还可以用于很多交互动画中。比如课程前面所提到的模拟 Twitter 点赞的按钮效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/993046df7a4a4e76914a9ddf07956bce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=472&s=2977804&e=gif&f=288&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/LYqLRMP

  


更为有意思的是，精灵动画不仅限于将精灵图片用于元素的背景上。我们还可以将这种技术用于遮罩图片上，增加更多的创意空间，从而创造出更多的交互动画效果。例如下面这个按钮悬浮效果，就是精灵动画应用于 `mask` 上的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d1e39d2fbbb4e66be8c281dd1aa2a20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=420&s=1035261&e=gif&f=249&b=4c496b)

> Demo 地址：[https://codepen.io/airen/full/abXyQwm](https://codepen.io/airen/full/abXyQwm)  
  


上面三个按钮，分别使用下面三张图做为遮罩图，并且动画化改为 `mask-position` 属性的值，并在按钮的悬浮状态触发动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99e87b29a60d4e7a8b4307b923edb923~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2400&h=623&s=246903&e=jpg&b=ffffff)




核心代码如下：

  


```HTML
<button class="button"><span>Hover Me!</span></button>
```

  


```CSS
@layer animation {
    @keyframes ani {
        from {
            mask-position: 0 0;
        }
        to {
            mask-position: -100% 0;
        }
    }
    
    @keyframes ani2 {
        from {
            mask-position: -100% 0;
        }
        to {
            mask-position: 0 0;
        }
    }
    
    button {
    --_mask: var(--mask-bg1);

        &::before {
            mask: var(--_mask);
            mask-size: 2300% 100%;
            animation: ani2 0.7s steps(22) forwards;
        }
    
        &:hover {
            color: #000;
            &::before {
                animation: ani 0.7s steps(22) forwards;
            }
        }
    
        &:nth-child(2) {
            --_mask: var(--mask-bg2);
    
            &::before {
                mask-size: 3000% 100%;
                animation-timing-function: steps(29);
            }
        }
    
        &:nth-child(3) {
            --_mask: var(--mask-bg3);
    
            &::before {
                mask-size: 7100% 100%;
                animation-timing-function: steps(70);
                animation-name: ani;
            }
            &:hover::before {
                animation-timing-function: steps(70);
                animation-name: ani2;
            }
        }
    }
}
```

  


### CSS 时钟

  


时钟是演示 `steps()` 缓动函数的理解案例。我们需要对时钟的指针（秒针、分针和时针）进行旋转，但不是平滑和连续的运动。使用 `steps()` 将允许我们创建模仿真实时钟上指针运动的动画。

  


在使用 `steps()` 时会涉及一些简单的数学计算。比如：

  


-   秒针旋转一圈（`360deg`）刚好用时 `60s` ，这意味着秒针在 `60` 步内旋转 `360deg` ，并在 `60s` 秒内完成动画。即 `steps()` 函数的步数是 `60` ，动画持续时间（`animation-duration`）是 `60s`
-   一分钟等于 `60` 秒，而一秒需要 `60s` 才转完一圈，这意味着分针在 `60` 步内旋转 `360deg` ，需要用时 `3600s` 。即 `steps()` 函数的步数同样是 `60` ，只是动画持续时间要调到 `3600s`
-   时针和分针与秒针有所不同，我们希望时针恒速旋转一圈，只是根据时间计算出其持续时间，即 `43200s` （对应 `12` 小时）

  


我们在定义秒针和分针的动画缓动函数时，可能会考虑使用 `steps(60)` ，它相当于 `steps(60, jump-end)` 或 `steps(60, end)` 。这使得时钟的秒针都会随时钟上的每个标记步进。如果不跳过结束状态，我们将得到一个动画，其中开始和结束将位于顶部（`0deg`），因此我们的时钟在顶部分停留两秒，并在之间进行其余的 `58s` ，这样就不自然了。也就是说，当你考虑时钟上的秒针时，给 `steps()` 函数指定一个 `jump-start` 参数，可以使稍秒跳过其结束状态，使得秒针的动画更自然。

  


```CSS
@layer animation {
    @keyframes clock {
        to {
            rotate: 360deg;
        }
    }
  
    .second-hand {
        animation: clock 60s steps(60 ,jump-start)  infinite;
    }
  
    .minute-hand {
        animation: clock 3600s steps(60, jump-end) infinite;
    }
  
    .hour-hand {
        animation: clock 43200s linear infinite;;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/161a6c9a248b442ab416c1d68b2f6b54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=538&s=3442847&e=gif&f=1247&b=215975)

  


> Demo 地址：https://codepen.io/airen/full/NWovVJM

  


### 频闪效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6d755b881a740bdae20f4a75a603061~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=1020&s=639176&e=webp&f=4&b=040404)

  


我们常见的闪光灯效果就是一种[频闪效果](https://en.wikipedia.org/wiki/Stroboscopic_effect)。虽然这种闪光灯效果乍一看可能显得陈旧，但实际上相当巧妙。为了建立一个比较基准，上面红色闪光效果是一个典型的脉动动画，其中不透明度 `opacity` 从 `1` 到 `0` 再到 `1` ，这个运动过程一直在无限循环。正如预期的那样，这呈现出脉动光源的视觉效果。我们有一个类似的黄色闪光效果（下面），使用了 `steps()` 函数。在这里，步进缓动引起的离散运动跳跃产生一种不安的“多步闪烁”感觉，仿佛是夜总会的闪光灯效果：

  


```CSS
@layer animaiton {
    @keyframes pulse {
        50% {
            opacity: 0;
        }
    }

    .light {
        --easing: linear
        animation: pulse 175ms var(--easing) infinite alternate;
        
        &:nth-of-type(2) {
            --easing: steps(2, jump-none);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17d5957ef33e4efdafefdc5483310f51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=414&s=2494173&e=gif&f=98&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/zYeEpoz

  


使用 `steps(2, jump-none)` 可以确保动画元素要么完全不透明，要么完全透明，以创建干净的闪烁效果。

  


我们还可以 `steps(2, jump-none)` 缓动函数用于类似闪烁的动画效果中，比如像下图这样的眨眼睛的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/709320d911d64c9087eb5930f61f6a39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=848&h=424&s=501684&e=gif&f=17&b=f8e8e0)

  


我们只需要把上面示例中的 `opacity` 换成 `scale()` 函数，就可以制作像下面这个眨眼的企鹅：

  


```CSS
@layer animation {
    @keyframes eye {
        to {
            scale: 1 0.25;
        }
    }

    .belly-eye::before,
    .belly-eye::after {
        animation: eye 0.5s steps(2, jump-none) infinite alternate;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7cea1a1338d4449828a0e176f8821dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=436&s=82911&e=gif&f=107&b=4c486b)

  


> Demo 地址：https://codepen.io/airen/full/bGzoveK

  


### 打字机效果

  


打字机效果涉及文本逐渐显示，就像它正在你眼前被输入一样。将打字机效果应用于文本块可以吸引用户注意力，并保持他们进一步阅读的兴趣。打字机效果有多种用途，例如制作引人入胜的登录页面，个人网站和代码演示等。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3298a57804f45a59afe269545a02c3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1544&h=500&s=302896&e=gif&f=61&b=abd57c)

  


打字机效果很容易创建，其工作原理如下：

  


-   打字机动画将通过使用 CSS 的 `steps()` 函数逐步将文本元素的宽度（`width`）从 `0` 更改为 `100%` 来显示文本
-   一个闪烁动画将对“输入”文本的光标进行动画处理

  


```HTML
<h1>CSS Text Animation: CSS Type Animation.</h1>
<h1>欢迎来到动画世界！我将向你呈现不同动画制作过程与技巧！</h1>
```

  


```CSS
@layer animation {
    @keyframes typing {
        0% {
            width: 0;
        }
    }

    @keyframes blink {
        50% {
            border-color: transparent;
        }
    }

    h1 {
        width: 40ch; /* 字符数量，最好是比文本内容多出 1 个，英文最好使用 ch 单位，这个很重要 */
        animation: 
            typing 10s steps(40) infinite alternate,
            blink 0.4s steps(2, jump-none) infinite alternate;
        
        &:nth-of-type(2) {
            width: 28em; /* 字符数量，最好是比文本内容多出 1 个，中文最好使用 em 单位，这个很重要 */
            animation-timing-function: steps(28), steps(2, jump-none);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a155e84ffb84d139f75ca60158bebab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1316&h=406&s=1973414&e=gif&f=321&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/eYxGrmz

  


在制作打字机动画效果时，元素的 `width` 最好根据语言进行调整，比如拉丁语使用 `ch` 单位，中文使用 `em` 单位比较合适，因为它们刚好是一个字符的宽度。另外，在设置 `width` 的值时，最好比文本字符数量略微多一个，效果会更自然一点。

  


除了单位值之外，`steps()` 函数中的步数与 `width` 属性的值相同，比如上面示例，`width` 的值为 `28em` ，那么相应的步数就是 `28` ，即 `steps(28)` 。

  


这种技术最好用于小部分非关键性文本，只是为了增加一些额外的愉悦感。但要小心不要过度依赖它，因为像这样使用 CSS 动画有一些限制。确保在各种设备和视口大小上测试你的打字机文本，因为结果可能在不同平台上有所不同。如果打字机效果对你很重要，并且你希望将其用于更关键的内容，或许最好也考虑 JavaScript 解决方案。

  


### 数字倒计时

  


如果你的倒计时效果在时间准确性上不会有严格要求的话，那么可以考虑使用 [CSS 计算数器和 steps() ](https://juejin.cn/book/7223230325122400288/section/7259668400379527205)来模拟一个简单的倒计效果。例如下面这个十秒倒计时效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a571e01ed84348f2b9e397437d54f94f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=506&s=446498&e=gif&f=323&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/YzBrjGZ

  


关键代码如下：

  


```CSS
@layer animation {
    @keyframes counter {
        0% {
            counter-increment: count 10;
        }
        10% {
            counter-increment: count 9;
        }
        20% {
            counter-increment: count 8;
        }
        30% {
            counter-increment: count 7;
        }
        40% {
            counter-increment: count 6;
        }
        50% {
            counter-increment: count 5;
        }
        60% {
            counter-increment: count 4;
        }
        70% {
            counter-increment: count 3;
        }
        80% {
            counter-increment: count 2;
        }
        90% {
            counter-increment: count 1;
        }
        100% {
            counter-increment: count 0;
        }
    }
    
    .loading::after {
        counter-reset: count 0;
        content: counter(count);
        animation: counter 10s steps(10) infinite;
    }
}
```

  


这些用例展示了步进缓动 `steps()` 在创建独特视觉效果和控制动画在特定间隔出现的外观方面的多功能性。每个用例都满足不同的设计和动画需求，展示了步进缓动提供的灵活性和创意可能性。

  


## `steps()` 缓动函数的优势

  


`steps()` 缓动函数的最大优势在于它能够将动画或过渡分为特定数量的步骤，而不是平滑过渡。这种分段的方式使等动画看起来更为生动，具有独特的呈现效果。其主要优势可以总结如下：

  


-   **离散性和控制性**： `steps()` 缓动函数让动画变得离散，只显示每个步骤的关键帧，而不是过渡。这种离散性为开发人员提供了更精确的控制，特别适用于需要明确定义动画状态的场景。
-   **复古和动画帧效果**： 由于 `steps()` 可以产生类似帧动画的效果，因此在一些场景中，特别是希望营造复古或动画帧感觉的情况下，它是非常有用的。
-   **自然和特定场景**： 在某些情况下，平滑的过渡可能看起来过于人工，而 `steps()` 的离散效果更能模拟自然的运动，使其在特定的场景中显得更合适和真实。

  


总的来说，`steps()` 缓动函数为开发人员提供了更多的选择，使他们能够更好地定制动画效果，以适应不同的设计需求。

  


## 何时不使用 `steps()` 缓动函数

  


尽管 `steps()` 缓动函数可以实现每秒 `60` 帧的动画，但它也有可能导致文件大小增加，因此在设计复杂动画或需要高分辨率的场景中，可能需要谨慎使用。换句话说，如果需要大型或复杂的动画，步进动画可以是一种可行的选择，但可能还需要探索其他实现方式，以确保选择高性的方法。其他选项包括非步进的 CSS 动画、SVG 动画和 JavaScript 动画。

  


虽然说 `steps()` 缓动函数制作的动画有一定的局限性，但要是用得好，也可以在复杂的场景中使用。我的印象中手淘的第一个 CSS 动画就是 `steps()` 制作的动画，那还是 2015 年年货节的一个揭幕动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67e35928193c452c8becdbe9cc585ad8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=368&h=625&s=7093932&e=gif&f=263&b=f8f2f0)

  


随后在多次大促活动的氛围动画中都有 `steps()` 制作的动画效果的身影。比如2017年年货节的门神动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/719a43ec4763494fae448f7ce50f8dcf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=750&h=1334&s=6150887&e=gif&f=19&b=faf7f7)

  


其实，在很多场景中都有 CSS `steps()` 缓动函数制作的动画，而且从不缺乏优秀的案例。比如来自暴雪娱乐公司的《魔兽世界：军团再临》网站（很可惜现在无法再现）。该网站的一个部分展示了一个游戏角色手持武器，轻轻摇摆。动画时长为三秒，由 `54` 帧组成。动画的迷人之处在于，它由一个尺寸为 `14000px x 300px` 的 `.png` 文件驱动，文件大小仅为 `846kb` 。毫无疑问，这是一个较大的文件，但动画的效果是令人惊叹的。

  


> 当初我在制作门神这个动画的时候，图片尺寸也非常大，它是一张 `14250px x 1334px` 组成，而且在当初的大促活动，每张图片文件大小是有限制，具体限制记不太清楚了，只记得当初也是费了不少精力才达到目标。

  


回到魔兽世界这个案例来，当完整查看源图像时，没有 CSS 步进动画，图像的整个“胶片”似乎在设计 Web 动画时是一种奇怪的方法。源图像非常宽，宽到肉眼无法看清。从生产的角度来看，这张图像似乎相当令人生畏，因为更新图像南非要在正确位置以正确间距替换动画帧。下图就是图像的原始形式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bf04389d7f447498d603cf1d68c0b0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=14040&h=300&s=845515&e=png&a=1&b=1c041a)

  


一张短而宽的图像显示了许多身穿紫色衣物的相同角色站在一起。每个人的副本都略有变化，显示彼此之间动画帧的差异。

  


然而，当图像应用了 CSS 步进动画时，它焕发生机，具有本地移动自动播放、透明背景、高保真图像质量和仅以每秒 `18` 帧运行的相对平滑的动画。我无法详细说明动画师需要付出多少幕后工作，以逐帧捕捉运动中的物体，更别提将它们排列成单个 `png` 文件的序列，但结果仍然令人叹为观止和惊艳。你可以在这里查看动画的最终效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8e918c3033b42508d1fc2c2bb49251b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=450&s=3337319&e=gif&f=154&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/LYqzgZv

  


稍微变动一下，你就能得到另一个动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1669662159bb45ff885ea512809838b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=532&s=4397204&e=gif&f=191&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/ExrwdwG

  


拖动一下滑动，你就可以得到一个镜像的游戏角色动画。注，上面示例的思路来自于 [@Adam Argyle 在 CodePen 提供的一个案例](https://codepen.io/argyleink/full/XWOaazZ)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2422a0db77442a48f0650f28f8f5171~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=626&s=772018&e=gif&f=149&b=101010)

  


> Demo 地址：https://codepen.io/airen/full/rNPGqbR （来源于 [@Adam Argyle](https://codepen.io/argyleink/full/XWOaazZ) ）

  


## 小结

  


`steps()` 函数为 CSS 动画提供了一种强大的分段效果的创建方式。通过以下几个关键点对使用 `steps()` 函数创建分段动画的教程进行总结：

  


首先，`steps()` 允许我们将动画划分为一系列离散的步骤，而不是平滑的过渡。这对于模拟钟表、创建动画精灵表或其他需要分段效果的场景非常实用。

  


在使用 `steps()` 时，我们可以通过设置参数来定义动画的步数。例如，`steps(10)` 将动画分为 `10` 步。同时，我们还可以指定第二个参数来设置动画的方向，如 `start`、`end`、`jump-none`、`jump-start`、`jump-end`、`jump-both`。

  


`steps()` 不仅仅适用于模拟自然运动，还可以用于创造各种独特的视觉效果，比如模拟逐字打印的打字机效果。

  


在性能方面，`steps()` 在某些情况下可能比其他动画选项更具优势，特别是在需要高帧率和透明度支持的情况下。

  


需要注意的是，对于大规模或复杂的动画，`steps()` 可能不是最佳选择，此时可能需要考虑其他实现方法，如非步进的 CSS 动画、SVG 动画或 JavaScript 动画。

  


最后，使用 `steps()` 函数时需要谨慎权衡文件大小、性能和动画效果之间的关系。总体而言，`steps()` 提供了一种有趣而灵活的方式，通过分步动画效果为网站或应用引入生动的运动。