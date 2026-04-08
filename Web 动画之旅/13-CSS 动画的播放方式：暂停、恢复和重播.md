CSS 动画的播放就好比视频的播放方式，通过一定的方式可以控制动画播放和暂停。严则上说，Web 上的所有动画类型都具备播放、暂停和重新播放等功能或操作方式。只不过，不同类型的动画有着不同的控制方式。对于 Web 开发者，掌握如何有效播放和暂停 CSS 动画是很有必要的。这不仅对于创造性的 Web 页面设计至关重要，而且对性能、用户控制和可访问性都具有重要意义。在这节课中将深入研究 CSS 动画的播放机制，探讨如何通过简洁而强大的技术手段实现动画的灵活控制。在这节课中，不仅提供了深入的技术细节，还分享了实践中的最佳方法，助你在 Web 设计中展现出色的创意。

  


## 动画暂停和恢复播放

  


CSS 动画主要有[过渡动画和关键帧动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)，其播放、暂停和重新播放等方式的控制是有所差异的，其中 CSS 关键帧动画的控制相对于 CSS 过渡动画要简单地多。

  


我们就从 CSS 关键帧动画开始！

  


### CSS 关键帧动画的暂停与恢复播放

  


默认情况下，只要是通过 `animation` 属性将 `@keyframes` 关键帧定义的动画应用到 Web 元素上，你的动画就会开始播放。这基本上意味着页面加载的瞬间，CSS 关键帧动画就会自动播放，这有点类似于视频（`<video>`）设置了自动播放（`autoplay`）一样。例如：

  


```CSS
@keyframes slideInLeft {
    from {
        translate: -300%;
    }
    to {
        translate: 0;
    }
}

.animated {
    animation: slideInLeft 2s ease-in infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c212c38ad0042f0bb26ad85f5c8ab5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=382&s=213977&e=gif&f=106&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/PoVBqJQ

  


红色框（`.animated` 元素）应用了 `slideInLeft` 动画，该动画持续时间为 `2s` ，并且设置为无限循环播放。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/340af34543f74c77921642c430f95c58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1307&s=448462&e=jpg&b=282b3e)

  


上图中每个矩形代表动画的一个迭代（播放一次）。上图中将动画的每个迭代并排放置在一起。

  


正如你所看到的，一旦动画开始，它将不会停止，直到达到结束（上面的示例播放完一次需要 `2s` ）。如果你的动画设置为无限循环，动画每迭代完一次就会重新开始。每次重新开始都会表示为一个单独的紫色矩形。上面示例中的 `slideInLeft` 动画就是这种行为的证明。

  


有时，你可能希望的动画并不是像上面示例那样呈现的效果。你可能希望动画不是立即播放，或者你想让正在播放的动画在中途暂停。我们可以通过调整 `animation-play-state` 属性的值为 `paused` 来实现。

  


```CSS
.animated {
    animation-play-state: paused;
}
```

  


`animation-play-state` 属性有 `running` 和 `paused` 两个值：

  


-   `running` ：默认值，表示当前动画正在播放
-   `paused` ：表示当前动画暂停播放

  


也就是说，你可以通过对 `running` 或 `paused` 的反应来切换动画是否播放。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ac6e203b82c43b6a57e27bf25ce250d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=430&s=196489&e=gif&f=111&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/YzBjqNN

  


它的行为有点类似视频的播放和暂停：

  


-   **点击暂停按钮（** **`animation-play-state`** **切换）** ： 如果你点击了视频的暂停按钮，视频会停止播放，就像我们可以使用 CSS 的 `animation-play-state` 属性的 `paused` 值将动画暂停。这种切换状态就像暂停按钮切换视频播放状态一样。
-   **再次点击播放按钮（** **`animation-play-state`** **切换）** ： 如果你再次点击播放按钮，视频将继续播放。在 CSS 动画中，我们可以通过切换 `animation-play-state` 属性的值为 `running` 来重新开始动画。这一行为在 CSS 动画也被称为恢复动画，即恢复动画播放

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/280c826090804b5099bda77dc2fbcbc6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=961&h=544&s=2519948&e=gif&f=63&b=eaeaec)

  


我们需要知道的是，当动画被暂停时，它会保留动画最后计算的值：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ae4d7d95af44ca481e1288243b4c7b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1307&s=530380&e=jpg&b=282b3e)

  


就好像时间突然停滞了一样。你可以通过将 `animation-play-state` 属性重新设置为 `running` 来恢复它。没有突然重新启动的情况，动画不会回到 `0%` 标记之前再恢复：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db524c38aa4c4a8a857520f6d3d8d6b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1307&s=597137&e=jpg&b=282b3e)

  


你的动画会从暂停的地方继续开始，就像你在媒体播放器上使用播放和暂停功能时所期望的那样。这意味着，恢复暂停的动画将从暂停时停止的位置开始播放，而不是从动画序列的开头重新开始播放。

  


正如你所看到的，对于 CSS 关键帧动画，我们可以通过 `animation-play-state` 属性暂停（设置为 `paused`）和恢复（`running`）动画的播放。另外，默认情况下，关键帧动画是自动播放的，除非你显式设置了 `animation-play-state` 属性的值为 `paused` 。这意味着，当从页面加载的开始应用 CSS 关键帧动画时，事情很简单。只需要使用带有适当参数的 `animation` 属性，然后完成了。然而，如果动画应用于特定状态，例如 `:hover` 、`:active` 、`:focus` 、`:checked` 或由 JavaScript 触发的类更改呢？例如，下面这个示例，用户鼠标悬停在元素上时才触发 `spin` 动画：

  


```CSS
@keyframes spin {
    to {
        rotate: 360deg;
    }
}

.animated:hover {
    animation: spin 2s linear infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ceeddee5f78347f793a1c89949e554a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=436&s=505210&e=gif&f=152&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/yLZqJge

  


你可能已经发现了，当用户鼠标悬停在元素上并移出时，它会突然切换到其原始状态（没有旋转）。事实上，在许多情况下，更希望它在最后显示的帧中冻结，直到再次悬停在其上面。换句话说，我们希望的效果是，用户鼠标悬停在元素上时，元素自动旋转（触发 `spin` 动画），一旦用户鼠标移出元素时，元素停留在鼠标移出的那一刻（暂停 `spin` 动画播放），直到用户鼠标再次悬浮在元素上时，元素又开始自转（恢复 `spin` 动画播放）。为了实现这个效果，我们可以从一开始就在元素上应用 `spin` 动画，只不过需要设置 `animation-play-state` 属性的值为 `paused` （动画暂停播放），然后在用户鼠标悬浮状态（`:hover`）将 `animation-play-state` 属性的值切换为 `running` 。具体操作如下：

  


```CSS
@keyframes spin {
    to {
        rotate: 360deg;
    }
}

.animated {
    --play-state: paused;
    animation: spin 2s linear var(--play-state) infinite;
    
    &:hover {
        --play-state: running;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c2781f16d4f453b9f73652976a27558~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=426&s=516621&e=gif&f=163&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/LYqBZOd

  


反之亦然。例如，你正在对其进行动画处理的对象内部有可点击的元素，你不希望用户必须点击移动的目标。点击而错过的感觉非常令人沮丧，更不用说点击，错过，然后点击其他东西了。我们可以通过 `animation-play-state` 属性来优化它。即用户鼠标在悬停时将 `animation-play-state` 设置为 `paused` ，动画将暂停，你的点击目标将停止移动，你的用户将感到满意。

  


```CSS
@keyframes pulse {
  0% {
    scale: 1;
  }

  50% {
    scale: 1.1;
  }

  100% {
    scale: 1;
  }
}


.box {
    --play-state: running;
    animation: pulse 3s infinite var(--play-state);
    
    &:hover {
        --play-state: paused;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74448a88d43a4da78242f58fa5a4ee6e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=434&s=1161410&e=gif&f=180&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/WNPKGMO

  


这两个简单地示例告诉我们，在 Web 上使用 `animation-play-state` 可以很容易实现平滑状态（状态切换）动画。

  


在 CSS 中通过 `animation-play-state` 属性控制动画暂停和恢复动画播放是一种正宗的姿势。除此之外，也可以使用一些奇淫之技，例如使用 `animation-duration` 属性将动画的持续时间设置为 `0s` 或者将 `animation-name` 属性的值设置为 `none` 。不过，这些技巧的有着明显的缺陷：

  


-   将动画的持续时间设置为 `0s` 时，动画还在运行，而且动画只是在其初始位置和序列中的下一个位置之间切换
-   将动画的名称设置为 `none` 时，相当于完全删除动画

  


所以说，这两种方法实际上并没有暂停动画。也正因如此，不建议通过这种方式来暂停动画的播放，这与我们所追求的真正的动画暂停是有极大差距的。

  


### CSS 过渡动画的暂停与恢复播放

  


在 CSS 中，过渡动画（Transition）是一种简化状态变化的方式，常用于在元素属性状态变化时添加平滑效果。它并没有一个类似 `animation-play-state` 属性存在。这也意味着，CSS 过渡动画在暂停和恢复播放的方式上与关键帧动画有着本质上的差异：

  


-   **过渡动画**：过渡动画通常是与状态变化或交互相关的，它只会在属性上从一个初始值到最终值的变化时发生一次。一旦变化完成，属性将保持在最终值，直到再次触发状态变化。这意味着，过渡动画不会在中途停止，也不会保留属性的中间值
-   **帧动画**：帧动画通常不依赖于状态或交互，可以根据定义的迭代次数无限循环播放。它有能力在特定时间点停止。这也意味着，它可以在播放过程中暂停，并在特定时间保持属性的中间值。你可以手动控制帧动画的播放，包括暂停、继续和跳转到特定帧。

  


换句话说，帧动画提供了更多控制，可以在播放过程中操作属性的中间状态，例如在悬念状态暂停动画，而过渡动画通常只处理属性的起始和结束状态的变化。

  


```CSS
.animation:hover .car{
    animation-play-state: paused;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c842c5261eb4e48b503cb49cc08d691~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=324&s=1463242&e=gif&f=285&b=4c496b)

  


> Demo 地址：https://codepen.io/airen/full/NWoPEyN

  


正如上面示例所呈现的一样，对于过渡动画，只有用户鼠标悬停到元素上，动画才开始播放，当用户鼠标移动元素之后，动画会立即停止，并且回到初始状态。帧动画则不同，用户鼠标悬停到元素上时，动画会暂停播放，用户鼠标移动之后，动画会继续向前播放。

  


总之，过渡动画通常与状态变化相关，播放一次且不能在中途停止，而帧动画可以无限循环播放，可以手动控制播放进度并在播放过程中保持属性的中间值。

  


## 动画暂停的重要性

  


就 CSS 动画而言，只要动画开始播放了，即使它不在视窗或容器的可视区内，它仍然在运行！

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f92610e2595c421da92d9731ec6b89f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=662&s=7271602&e=gif&f=214&b=1d1d1d)

  


> Demo 地址：https://codepen.io/airen/full/xxMJgJY

  


它看起来和视频相似。视频启动播放之后，它会一直播放，直到你暂停了视频的播放。那么，你可能会问，这些正在播放的动画是否仍然在使用 CPU 或 GPU ？它们是否消耗不必要的处理能力，从而影响到页面的性能呢？

  


这个回答是肯定的。在页面中存在大量的动画元素时，这些动画可能会消耗大量的 CPU 和 GPU 资源。即使用户当前并未查看页面上的某些动画，它们仍然在后台运行，可能导致性能下降。通过暂停那些不在视窗或容器可视区中的动画，可以减轻系统负担，提高页面整体性能。

  


性能只是其中一个显而易见的原因，其实还有另一个原因，那就是用户控制。用户希望对其浏览体验有更多的控制权。在某些情况下，用户可能希望暂停正在播放的动画，以便更好的关注内容或减少可能引起不适感的动态效果。通过提供暂停选项，增强了用户对页面上动画行为的掌控能力。

  


除了上述两个原因之外，那就是可访问性。可访问性是确保 Web 应用或网站对所有用户，包括那些有特殊需求的用户都友好的重要方面。有些用户可能对动画敏感，甚至可能触发癫痫或晕动症等问题。提供动画暂停选项可以使网站更加包容，满足各种用户的需求，特别是那些可能受到动画影响的用户。

  


综上所述，通过允许暂停 CSS 动画，我们可以在性能、用户控制和可访问性方面提供更好的用户体验。这对于创建功能丰富且对所有用户都友好的网站至关重要。

  


既然动画暂停这么重要，而使用 CSS 的 `animation-play-state` 才是真正控制动画暂停和恢复播放，那我们就有必要对其进入更深层次的探讨，并研究其他使用方法。

  


## 使用不同方法控制动画暂停和恢复播放

  


接下来，我们主要分两个部分来展开如何更好地控制动画暂停和恢复播放。其中第一部分是 CSS 相关的技术，另一部分则是 JavaScript 相关的技术。首先来看 CSS 相关的技术。

  


### CSS 如何控制动画暂停和恢复播放

  


我想你已经想到了，在 CSS 中控制动画暂停和恢复播放，最简单的方法就是使用 CSS 的 `animation-play-state` 或其简写属性 `animation` 。是的，这一点没有任何问题，也不存在任何的争议。但是，我想接下来以另外的方式来与告诉大家，如何更好的使用 `animation-play-state` 来控制动画暂停和恢复播放。

  


#### 属性选择器与 CSS 自定义属性相结合

  


我们可以通过属性选择器与 CSS 自定义属性相结合来控制动画的暂停和恢复播放，这是一种较为轻便且灵活的技巧。

  


我们可以在 CSS 中使用属性选择器，比如 `[data-animation]` 选择器来选中将在所有希望暂停和恢复播放的动画的元素。例如：

  


```HTML
<!-- 你希望这个元素上的动画将会暂停或恢复播放 -->
<div data-animation></div>

<!-- 你希望这个元素上的动画不会出现暂停或恢复播放等操作 -->
<div class="animated"></div>
```

  


当然，你可以在 HTML 元素上定义任何你喜欢的属性，你甚至可以直接使用 `animation` 属性，只是我个人更喜欢使用数据属性，这也是 HTML 元素上常见的一种[属性类型](https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)。

  


这样，它就可以与其他动画区分开来：

  


```CSS
[data-animation] {
    /* 默认动画播放状态为运行 */
    animation-play-state: running;
}

[data-animation][data-animation-state="paused"] {
    /* 当 data-animation-state 为 paused 时，暂停动画 */
    animation-play-state: paused;
}
```

  


通过上述 CSS 代码，我们为具有 `[data-animation]` 属性的元素定义了动画的默认播放状态为 `running`。然后，当 `data-animation-state` 属性为 `paused` 时，我们将动画的播放状态设置为 `paused`，从而实现了动画的暂停。

  


我们还可以将数据属性选择器与 CSS 自定义属性结合起来。在编写 CSS 代码的时候，个人一直在提倡，能使用 CSS 简写属性的时候，应该尽量使用简写属性。是的，我们在给元素应用动画时，也应该尽可能的使用 CSS 的 `animation` 属性。不过，在这个过程中，我将 CSS 的自定义属性引入进来，作为 `animation` 属性的每个子属性的值，此时每个子属性具有一个变量值：

  


```CSS
[data-animation] {
    animation:
        var(--animn, none)        /* 动画名称 animation-name, 初始值为 none */
        var(--animdur, 1s)        /* 动画持续时间 animation-duration, 初始值为 1s */
        var(--animtf, linear)     /* 动画缓动函数 animation-timing-function, 初始值为 linear */
        var(--animdel, 0s)        /* 动画延迟时间 animation-delay, 初始值为 0s */
        var(--animdir, alternate) /* 动画方向 animation-direction, 初始值为 alternate */
        var(--animic, infinite)   /* 动画播放次数 animation-iteration-count, 初始值为 infinite */
        var(--animfm, none)       /* 动画填充查式 animation-fill-mode，初始值为 none */
        var(--animps, running)    /* 动画播放方式 animation-play-state，初始值为 running */
}
```

  


有了这个设置，任何具有这个数据数属性 `[data-animation]` 的元素都将完美地准备好接受动画，我们可以使用自定义属性来控制动画的各个方面（参数）。某些动画可能会有一些共同之处（比如持续时间，缓动函数等），因此在自定义属性上也设置了回退值，这个回退值你可以理解成是 `animation` 的每个子属性的初始值，比如上面代码中的 `--animdur` 属性的回退值是 `1s` ，它相当于 `animation-duration` 属性的值为 `1s` ，如果你在 CSS 代码中没有重新给 `--animdur` 自定义属性设置值，它将取回退值 `1s` 。这是 [CSS 自定义属性的主要特性之一](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)，在这里就不详细阐述。

  


为什么要使用 CSS 自定义属性？如果你了解过[ CSS 自定义属性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)，那么你就不会问这个问题。在这里使用 CSS 自定义属性具备两个明显的好处。首先，你可以在 CSS 和 JavaScript 中读取和设置它们。其次，它们有助于显著减少我们需要编写的 CSS 代码量。并且，我们可以在 `@keyframes` 中设置它们。可以说，它们提供了使用动画的新而令人兴奋的方式！

  


对于动画本身，我使用了类选择器，并从 `[data-animation]` 属性选择器中更新变量（自定义属性的值）：

  


```HTML
<div class="animated square a-slide" data-animation></div>
<div class="animated circle a-pulse" data-animation></div>
```

  


为什么要同时使用类和属性选择器呢？在这个阶段，`data-animation` 属性可能同样可以是一个普通的类，但我们将在以后更高级的方式中使用它。请注意，`.animated` 、`.square` 和 `.circle` 类名实际上与动画无关，它们只是用于为元素设置样式的类。

  


```CSS
.animated {
    display: grid;
    place-content: center;
    padding: 1rem;
    width: 100px;
    
    &.square {
        aspect-ratio: 1;
    }
    
    &.circle {
        aspect-ratio: 1;
        border-radius: 50%;
    }
}
```

  


上面代码中，`.a-slide` 和 `.a-pulse` 两个类名，将表示它们引用不同的两个关键帧动画。所以我们只需要在它们所对应的代码块中更新将发生变化的值。例如：

  


```CSS
@keyframes slide {
    to {
       translate: 600px; 
    }
}

@keyframes pulse {
    0% { 
        scale:1; 
    }
    25% { 
        scale:.9; 
    }
    50% { 
        scale:1; 
    }
    75% { 
        scale:1.1; 
    }
    100% { 
        scale:1; 
    }
}

.a-slide {
    --animn: slide;
    --animdur: 3s;
}

.a-pulse {
    --animn: pulse;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abc1a82d53a64afd8b1a0cbf66e30d75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=456&s=443074&e=gif&f=119&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/eYxjjON

  


因此，如果我们在 `data-animation` 选择器的回退值中使用一些常见值，我们只需要更新动画自定义属性 `--animn` 的名称。

  


上面这个示例让我们看到了使用 CSS 自定义属性和属性选择器能让我们减少很多 CSS 代码的编写量。接下来，我们来看它更高级一点的用法。比如，我们希望让页面所有设置 `data-animation` 属性的动画元素暂停其正在播放的动画。按照前面所讲解的内容，我们只需要将 `--animps` 自定义属性的值设置为 `paused` 即可。

  


现如今，我们使用 CSS 或 JavaScript 都可以轻易实现，只不过使用 CSS 可能需要在 HTML 中添加一两行代码。例如，我们在页面上提供了一个动画暂停和恢复切换按钮（比如一个复选框），把控制权留给用户，当用户选中复选框，设置 `data-animation` 数据属性的动画暂停其播放，当用户再次点击复选框之后，暂停的动画恢复播放。

  


如果你是使用 CSS 来实现，你需要在 `[data-animation]` 元素前添加一个复选框元素，例如：

  


```HTML
<input type="checkebox" data-animation-pause name="play-state" id="play-state" />
<div class="animated square a-slide" data-animation></div>
<div class="animated circle a-pulse" data-animation></div>
```

  


当然，你也可以不必完全遵守这样的规则，只是你的代码量会增加不少。

  


在此基础上，可以通过复选框的 `:checked` 状态选择器来调整 `--animps` 自定义属性的值。例如：

  


```CSS
[data-animation-pause]:checked ~ [data-animation] {
    --animps: paused;
}
```

  


这样一来，用户选中复选框时，页面上设置 `data-namation` 数据属性的元素上应用的动画都会暂停播放，用户再次点击复选框时，它们又会恢复动画的播放：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ba098539cec4bc9ac6890ebf7e8de7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=396&s=873108&e=gif&f=286&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/eYxjjzJ

  


注意，如果你仔细查看上面示例的源代码，你会发现我在示例中使用的 HTML 结构更为复杂，因此对应的 CSS 选择器也做出相应的调整。我在示例中[使用了 :has() 和 :checked 相结合](https://juejin.cn/book/7223230325122400288/section/7224404685615005728)，实现了相应的效果：

  


```CSS
.forms:has(:checked) ~ .container [data-animation] {
    --animps: paused;
}
```

  


我这样做是为了美化复选框样式所需。因此，你在实际使用的时候，应该根据自已业务场景，对其做出相应的调整。不可千篇一律！

  


我们同样可以使用 JavaScript 来调整 `--animps` 自定义属性的值。如果使用 JavaScript 的话，那么对于复选框或其他元素（比如一个 `<button>`）在 HTML 结构中的顺序以入嵌套层级就不会有太多的要求。同样以复选框为例，那么我们只需要在 JavaScript 中添加以下几行代码即可：

  


```JavaScript
const forms = document.querySelector(".forms");
const animatedEles = document.querySelectorAll("[data-animation]");
const player = document.querySelector("input[data-animation-paused]");

forms.addEventListener("change", (etv) => {
    if (etv.target.type === "checkbox") {
        /* 选中暂停动画播放 */
        if (player.checked) {
            animatedEles.forEach((animated) => {
                animated.style.setProperty(`--animps`, "paused");
            });
        } else { /* 未选中恢复动画播放 */
            animatedEles.forEach((animated) => {
                animated.style.setProperty(`--animps`, "running");
            });
        }
    }
});
```

  


最终得到的效果是一样的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e24f0315630443d880802893831891b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=442&s=670282&e=gif&f=200&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/vYbaaxr

  


基本用法你已经掌握了，接下来就是要将这种技巧付诸实践了。我们先从简单的案例开始，不过我们最终目的是要使用 CSS 制作一个幻灯片播放的动画效果。

  


前面我们向大家展示了如何通过复选框的状态（`:checked`）来切换动画暂停和恢复播放。其实，HTML 中还有一个好东西，那就是 `<details> 元素`。我们可以使用 `<details>` 制作手风琴、提示框、下拉菜单等常见的 Web 组件。除此之外，`<details>` 元素有一个 `open` 属性和一个 `toggle` 事件。因此，就像复选框技巧一样，它非常适合切换状态，比如动画的暂停和恢复播放，而且还更简单：

  


```CSS
details[open] {
    --animps: running;
}

details:not([open]) {
    --animps: paused;
}
```

  


以 `<details>` 制作的提示框为例：

  


```HTML
<details class="tooltip">
    <summary><svg></svg>3 days ago</summary>
    <p data-animation>November 27th, 2023</p>
</details>
```

  


我们需要给 `<details>` 的子元素 `<p>` 的显示添加一个动画效果，而且默认情况下它是暂停播放的，只有当 `<details>` 的 `open` 为 `true` 时（展开状态），那么 `p` 元素上应用一个 `slideInDown` 动画，而且是恢复播放状态，并且该动画只播放一次：

  


```CSS
@layer animation {
    @keyframes slideInDown {
        0% {
            opacity: 0;
            translate: 0 -100%;
        }
        100% {
            opacity: 1;
            translate: 0 0;
        }
    }

    [data-animation] {
        --animps: paused;
        animation: 
            var(--animn, none) 
            var(--animdur, 1s) 
            var(--animtf, linear)
            var(--animdel, 0s) 
            var(--animdir, alternate) 
            var(--animic, infinite)
            var(--animfm, none) 
            var(--animps, running);
    }

    details[open] [data-animation] {
        --animn: slideInDown;
        --animps: running;
        --animfm: forwards;
        --animdur: 0.2s;
        --animic: 1;
    }
}
```

  


你将看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9210dbeee4c14626aa31705de9326841~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=458&s=239014&e=gif&f=147&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/dyajqKx

  


你可能已经发现了，在上面这个示例中，当用户再次点击 `<details>` 元素时，其子元素 `p` 出现的时候并不具备第一次点击那样的 `slideInUp` 动画效果。这一切都是因为 `<details>` 内在的机制，即 `display` 的 `block` 到 `none` 这样的一个过程，它属性离散型过渡属性，要给这类属性添加过渡效果或动画效果，需要进行额外的处理。这部分内容已超出这节课的范畴，如果你对这方面的话题感兴趣，可以返回阅读小册的《[帧动画与过渡动画：谁更适合你的业务场景？](https://juejin.cn/book/7288940354408022074/section/7292735608995184678#heading-5)》。

  


有了这个基础之后，我们来看一个 `<details>` 制作的幻灯片组件。[这个案例由 @Mads Stoumann 提供](https://codepen.io/stoumann/full/NWRGavM)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e96d3ad360e4942bf277f46375f14ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=482&s=18174784&e=gif&f=134&b=2f323a)

  


> Demo 地址：https://codepen.io/airen/full/RwvBeVp

  


构建上面这个效果，我们需要像下面这样一个 HTML 结构：

  


```HTML
<div class="c-mm">
    <details>
        <summary class="c-mm__play"><span data-css-icon="play"><i></i></span></summary>
        <span hidden></span>
    </details>

    <div class="c-mm__inner">
        <figure class="c-mm__frame" style="--_animn:kenburns-bottom-left;--index:1;" data-animation="frame">
            <img class="c-mm__img" data-animation="figure" src="https://picsum.photos/1024/768?random=1" />
            <figcaption data-caption="bottom left">Holiday Memories<div>Bornholm</div></figcaption>
        </figure>
    
        <!-- 省略其他 figure -->
    
        <figure class="c-mm__frame" style="--_animn:kenburns-bottom-left;--index:10;" data-animation="frame">
            <img class="c-mm__img" data-animation="figure" src="https://picsum.photos/1024/768?random=10" />
            <figcaption data-caption="bottom left">Sunset At Bokul<div>Gudhjem</div></figcaption>
        </figure>
    </div>
</div>
```

  


在这里使用 `<details>` 元素主要是用于动画播放状态的切换，你也可以根据需要将它换成复选框，它们能达到同等效果，只不过利用 `<details>` 元素的 `open` 属性更简单一点。

  


示例中的每张幻灯片都有两个动画，其中主动画为 `autoplay` ，它应用于 `<figure>` 元素（`.c-mm__frame`）上，同时其子元素 `<img>` （`.c-mm__img`）也有独立的动画。即：

  


-   所有 `<figure>` 元素应用同一个关键帧动画 `autoplay` ，也就是说，`--animn` 自定义属性的值为 `autoplay`
-   每个 `<img>` 元素将应用不同的关键帧动画，其对应的关键帧动画名称是在 `<figure>` 元素中内联样式中声明。也就是你在上面代码中看到的 `--_animn` ，它有着不同的值

  


同样的，我们在所有需要动画化的元素上设置了一个 `data-animation` 属性，只不过根据具体的场景，指定了不同的值：

  


-   `<figure>` 元素上的 `data-animation` 指定的值为 `frame`
-   `<img>` 元素上的 `data-animation` 指定的值为 `figure`

  


指定什么样的值并不重要，你可以根据你的喜好来设置。关键的是，我们可以像前面所说的那样，通过 CSS 的属性选择器和 CSS 自定义属性给动画化元素应用 `animation` ，并且根据需要调整已定义的自定义属性的值：

  


```CSS
[data-animation] {
    animation: 
        var(--animn, none) 
        var(--animdur, 1s) 
        var(--animtf, linear)
        var(--animdel, 0s) 
        var(--animdir, alternate) 
        var(--animic, infinite)
        var(--animfm, none) 
        var(--animps, running);
}

.c-mm {
    --_animdur: 18000ms;
    --animtf: ease-out;
    --slides: 20;
}

.c-mm__frame {
    --animn: autoplay;
    --animps: paused;
    --_img-animps: paused;
    --index: 1;
    --animdur: var(--_animdur);
    --animdel: calc(((var(--index) - 1) * var(--_animdur)) / 3);
}

.c-mm__img {
    --animdur: calc(var(--_animdur) / 1.5);
    --animfm: both;
    --animn: var(--_animn);
    --animps: var(--_img-animps);
}
```

  


不难发现，动画的名称由 `--animn` 定义，在 `<figure>` （即 `.c-mm__frame`）定义的值是 `autoplay` ，而在 `<img>` （即 `.c-m__img`）定义的值是 `--_animn` 自定义属性，也就是在 `figure` 元素上内联方式声明的自定义属性。

  


动画播放状态由 `--animps` 属性控制，只不过次要动画（也就是应用于 `<img>` 元素的动画）的播放状态则由 `--_img-animps` 属性控制。

  


除此之外，根据动画效果所需，动画的持续时间 `--animdur` 、延迟时间 `--animdel` 和填充模式 `--animfm` 都有所差异。

  


为了防止 CPU 和 GPU 过载，动画在播放之前最好是处于暂停播放的状态，即：

  


```CSS
.c-m__frame {
    --animps: paused;      /* 应用于主动画，figure 元素上的动画 */
    --_img-animps: paused; /* 应用于次动画， img 元素上的动画 */
}

.c-m__img {
    --animps: var(--_img-animps);
}

/* details 处于折叠状态（未打开） */
details:not([open]) ~ .c-mm__inner .c-mm__frame {
    --animps: paused;
    --_img-animps: paused !important;
}
```

  


更为重要的是，次要动画（应用在 `img` 元素上的动画）的初始播放状态，即 `--_img-animps` 属性的值需要被设置为 `paused` ，即使主动画（应用在 `figure` 元素上的动画）正在运行：

  


```CSS
/* details 元素处于展开状态（已打开）*/
details[open] ~ .c-mm__inner .c-mm__frame {
    --animps: running;      /* 主动画（应用在 figure 元素上的动画）恢复播放 */
    --_img-animps: paused;  /* 次动画（应用在 img 元素上的动画）继续暂停 */
}
```

  


次要动画的播放状态的切换，我们是在主动画 `autoplay` 的关键帧中进行的：

  


```CSS
@keyframes autoplay {
    0.1% {
        --_img-animps: running; /* 次要动画恢复播放 */
        opacity: 0;
        z-index: calc(var(--z) + var(--slides));
    }
    5% {
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    51% {
        --_img-animps: paused; /* 次要动画暂停播放 */
    }
    100% {
        opacity: 0;
        z-index: var(--z);
    }
}
```

  


为了使这个效果能在除 Chrome 之外的浏览器中正常工作，`--_img-animps` 的初始值需要设置为 `running`，因为它们无法从 `@keyframe` 更新 CSS 自定义属性。即：

  


```CSS
details[open] ~ .c-mm__inner .c-mm__frame {
    --animps: running;
    --_img-animps: running;
}
```

  


注意，示例中的次要动画是通过 [Animista](https://animista.net/) 工具获取的，它类似于 [animate.style](https://animate.style/) ，可以在线获得 CSS 关键帧动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7402c3cfdc3a4a128570831e216ade28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=656&s=14750477&e=gif&f=96&b=f6f6f6)

  


> URL：https://animista.net/

  


只不过，我的示例中对获得的关键帧代码进行了微调，即使用[单个变换属性替换了原来的 transform 组合值](https://juejin.cn/book/7223230325122400288/section/7259668493158023205)。最终动画相关的核心代码如下所示：

  


```CSS
@layer animation {
    @keyframes autoplay {
        0.1% {
            --_img-animps: running;
            opacity: 0;
            z-index: calc(var(--z) + var(--slides));
        }
        5% {
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        51% {
            --_img-animps: paused;
        }
        100% {
            opacity: 0;
            z-index: var(--z);
        }
    }
    
    @keyframes kenburns-top {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 50% 16%;
        }
        100% {
            scale: 1.25;
            translate: 0 -15px;
            transform-origin: top;
        }
    }
    
    @keyframes kenburns-top-right {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 84% 16%;
        }
        100% {
            scale: 1.25;
            translate: 20px -15px;
            transform-origin: right top;
        }
    }
    
    @keyframes kenburns-right {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 84% 50%;
        }
        100% {
            scale: 1.25;
            translate: 20px 0;
            transform-origin: right;
        }
    }
    
    @keyframes kenburns-bottom-right {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 84% 84%;
        }
        100% {
            scale: 1.25;
            translate: 20px 15px;
            transform-origin: right bottom;
        }
    }
    
    @keyframes kenburns-bottom {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 50% 84%;
        }
        100% {
            scale: 1.25;
            translate: 0 15px;
            transform-origin: bottom;
        }
    }
    
    @keyframes kenburns-bottom-left {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 16% 84%;
        }
        100% {
            scale: 1.25;
            translate: -20px 15px;
            transform-origin: left bottom;
        }
    }
    
    @keyframes kenburns-left {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 16% 50%;
        }
        100% {
            scale: 1.25;
            translate: -20px 15px;
            transform-origin: left;
        }
    }
    
    @keyframes kenburns-top-left {
        0% {
            scale: 1;
            translate: 0 0;
            transform-origin: 16% 16%;
        }
        100% {
            scale: 1.25;
            translate: -20px -15px;
            transform-origin: top left;
        }
    }
    
    [data-animation] {
        animation: 
            var(--animn, none) 
            var(--animdur, 1s) 
            var(--animtf, linear)
            var(--animdel, 0s) 
            var(--animdir, alternate) 
            var(--animic, infinite)
            var(--animfm, none) 
            var(--animps, running);
    }

    .c-mm {
        --_animdur: 18000ms;
        --animtf: ease-out;
        --slides: 20;
    }

    .c-mm__frame {
        --animn: autoplay;
        --animps: paused;
        --_img-animps: paused;
        --index: 1;
        --animdur: var(--_animdur);
        --animdel: calc(((var(--index) - 1) * var(--_animdur)) / 3);
    }

    .c-mm__frame:nth-last-child(3):first-child,
    .c-mm__frame:nth-last-child(3):first-child ~ .c-mm__frame {
        --animdur: var(--_animdur);
    }
    
    .c-mm__frame:nth-last-child(4):first-child,
    .c-mm__frame:nth-last-child(4):first-child ~ .c-mm__frame {
        --animdur: calc((4 / 3) * var(--_animdur));
    }
    
    .c-mm__frame:nth-last-child(5):first-child,
    .c-mm__frame:nth-last-child(5):first-child ~ .c-mm__frame {
        --animdur: calc((5 / 3) * var(--_animdur));
    }
    
    .c-mm__frame:nth-last-child(6):first-child,
    .c-mm__frame:nth-last-child(6):first-child ~ .c-mm__frame {
        --animdur: calc((6 / 3) * var(--_animdur));
    }
  
    .c-mm__frame:nth-last-child(7):first-child,
    .c-mm__frame:nth-last-child(7):first-child ~ .c-mm__frame {
        --animdur: calc((7 / 3) * var(--_animdur));
    }
    
    .c-mm__frame:nth-last-child(8):first-child,
    .c-mm__frame:nth-last-child(8):first-child ~ .c-mm__frame {
        --animdur: calc((8 / 3) * var(--_animdur));
    }
    
    .c-mm__frame:nth-last-child(9):first-child,
    .c-mm__frame:nth-last-child(9):first-child ~ .c-mm__frame {
        --animdur: calc((9 / 3) * var(--_animdur));
    }
    
    .c-mm__frame:nth-last-child(10):first-child,
    .c-mm__frame:nth-last-child(10):first-child ~ .c-mm__frame {
        --animdur: calc((10 / 3) * var(--_animdur));
    }

    .c-mm__img {
        --animdur: calc(var(--_animdur) / 1.5);
        --animfm: both;
        --animn: var(--_animn);
        --animps: var(--_img-animps);
    }

    details[open] ~ .c-mm__inner .c-mm__frame {
        --animps: running;
        --_img-animps: running;
    }
    
    details:not([open]) ~ .c-mm__inner .c-mm__frame {
        --animps: paused;
        --_img-animps: paused !important;
    }
    
    details:not([open]) ~ .c-mm__inner .c-mm__frame:first-of-type {
        opacity: 1;
    }
}
```

  


注意，上面代码中 `kenburns-*` 系列的关键帧动画中的 `0%` 选择器对应的 `scale: 1` 和 `translate: 0 0` 可以省略不写。

  


你也可以像下面这个示例一样，将 `<details>` 替换为复选框，只需要更改部分代码即可实现同样的效果：

  


```CSS
[name="slideshow"]:checked ~ .c-mm__inner .c-mm__frame {
    --animps: running;
    --_img-animps: running;
}

[name="slideshow"]:not(:checked) ~ .c-mm__inner .c-mm__frame {
    --animps: paused;
    --_img-animps: paused !important;
}

[name="slideshow"]:not(:checked) ~ .c-mm__inner .c-mm__frame:first-of-type {
    opacity: 1;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44b05845bf6242c7b27813589446fec2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=480&s=12675100&e=gif&f=82&b=ca720d)

  


> Demo 地址：https://codepen.io/airen/full/QWYBzqp

  


#### 通过媒体查询控制动画暂停和恢复播放

  


当下很多设备都提供了用户偏好设置。例如，有些人不喜欢在 Web 应用或页面上看到任何动画，或者说减少动画的效果。他们可能会在设备上勾选相关的选项来禁用动画或减少动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81babbdf59ec4d3e92d67aaac0895f22~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1560&h=1176&s=207449&e=png&a=1&b=e9e9e9)

  


当用户勾选了 “Reduce motion” 选项，则会告诉终端，他们不希望在应用中看到动画效果，或者说希望减少动画效果。

  


庆幸的是，Web 开发者可以通过[媒体查询](https://juejin.cn/book/7223230325122400288/section/7257368158451793935)获取到用户在设备上的相关设置。比如，使用 `prefers-reduced-motion` 媒体查询用于检测用户的系统是否被开启了动画减弱功能。该媒体查询特性接受两个值：

  


-   **`no-preference`**：用户未修改系统动画相关特性
-   **`reduce`**：这个值意味着用户修改了系统设置，将动画效果最小化，最好所有的不必要的动画都能被移除

  


```CSS
@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
        animation-delay: -1ms !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        background-attachment: initial !important;
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f99272e35eb04fb4ac4fd3464796cc81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=720&s=1790981&e=gif&f=247&b=f0f0f0)

  


这意味着，我们可以通过 `prefers-reduced-motion` 来控制动画的暂停和恢复播放。换句话说，如果用户的设备勾选了 “Reduce motion” 选项，表示他们不希望在应用或页面上看到动画，那么我们可以将 `--animps` 自定义属性的值设置为 `paused` （动画暂停播放）；反之，用户未勾选 “Reduce motion” 选项，表示他们希望在应用或页面上看到动画，那么可以将 `--animps` 自定义属性的值设置为 `running` 。

  


```CSS
[data-animation] {
    animation: 
        var(--animn, none) 
        var(--animdur, 1s) 
        var(--animtf, linear)
        var(--animdel, 0s) 
        var(--animdir, alternate) 
        var(--animic, infinite)
        var(--animfm, none) 
        var(--animps, running);
}

@media (prefers-reduced-motion: reduce) {
    [data-animation] {
        --animps: paused;
    }
}
```

  


使用同样的方式，通过自定义数据属性 `data-animation` 指定的值，给动画设置不同的效果，比如将动画替换成一个简单的备用动画，或者使动画只播放一次，或者动画以很慢的速度运行（甚至可以慢到似乎没有动画效果），或者暂停动画播放等：

  


```HTML
<div class="animated" data-animation="alternate">
    <!-- 替换成一个简单的备用动画 -->
</div>

<div class="animated" data-animation="once">
    <!-- 动画只播放一次 -->
</div>

<div class="animated" data-animation="slow">
    <!-- 动画播放速度较慢 -->
</div> 

<div class="animated" data-animation="slowly">
    <!-- 动画播放速度非常慢，慢到你无法感觉到它在运动 -->
</div>   

<div class="animated" data-animation="stop">
    <!-- 动画暂停播放 -->
</div>   
```

  


```CSS
[data-animation] {
    animation: 
        var(--animn, none) 
        var(--animdur, 1s) 
        var(--animtf, linear)
        var(--animdel, 0s) 
        var(--animdir, alternate) 
        var(--animic, infinite)
        var(--animfm, none) 
        var(--animps, running);
}

@media (prefers-reduced-motion: reduce) {
    [data-animation="alternate"] {
        --animn: opacity;
    }
    
    [data-animation="once"]{
        --animic: 1;
    }
    
    [data-animation="slow"]{
        --animdur: 10s;
    }
    
    [data-animation="slowly"]{
        --animdur: 99999999s;
    }
    
    [data-animation="stop"]{
        --animps: paused;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4733a5521954b2ababcf737ea13d8cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=592&s=3631422&e=gif&f=381&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/abXjxJj

  


注意，这里提到的媒体查询 `prefers-reduced-motion` 已经是动画可访问性方面的话题了。如果你在这里对它并不了解，或者说从未接触这方面的知识，那也不用过于担心，因为小册后续有一节课会与大家专门探讨这个方面的话题。

  


### JavaScript 如何控制动画暂停和恢复播放

  


前面曾提到过，使用 CSS 自定义属性作为 `animation` 各子属性的值，其中有一个优势是，我们通过 JavaScript 可以很容易获得这些自定义属性的值，也可以给这些自定义属性重置一个值。它和前面的复选框或 `<details>` 元素的方式是相似的，不同的是通过脚本来重置定义在 `[data-animation]` 上的 `--animps` 属性的值。

  


例如：

  


```HTML
<div class="animated" data-animation></div>
<!-- 省略其他的带有 data-animation 数据属性的元素 -->
<div class="animated" data-animation></div>

<button class="toggle">Toggle Animation</button>
```

  


```
[data-animation] {
    animation: 
        var(--animn, none) 
        var(--animdur, 1s) 
        var(--animtf, linear)
        var(--animdel, 0s) 
        var(--animdir, alternate) 
        var(--animic, infinite)
        var(--animfm, none) 
        var(--animps, running);
}
```

  


通过下面这段 JavaScript 脚本，可以将 `--animps` 自定义属性的值重置为 `paused` ，暂停正在播放的动画。注意，是暂停带有 `data-animation` 数据属性的动画元素的动画播放：

  


```JavaScript
const toggle = document.querySelector(".toggle");
const animatedEles = document.querySelectorAll("[data-animation]");

toggle.addEventListener('click', () => {
    animatedEles.forEach(animated => {
        const running = getComputedStyle(animated).getPropertyValue("--animps") || 'running';
        animated.style.setProperty('--animps', running === 'running' ? 'paused' : 'running');
    })
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91d95b14b17543a6af68dbef14c2384a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=410&s=616064&e=gif&f=193&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/MWLBMYW

  


除了上面所展示的方法之外，我们还可以使用 `IntersectionObserver` API 来暂停和恢复所有 `[data-animation]` 的动画。

  


首先，我们需要确保 `[data-animation]` 元素上的动画都处于暂停播放的状态：

  


```CSS
[data-animation] {
    animation: 
        var(--animn, none) 
        var(--animdur, 1s) 
        var(--animtf, linear)
        var(--animdel, 0s) 
        var(--animdir, alternate) 
        var(--animic, infinite)
        var(--animfm, none) 
        var(--animps, running);
}

[data-animation] {
    --animps: paused;
}
```

  


然后使用 `IntersectionObserver` 创建一个观察器，元素在视口中达到 `25%` 或 `75%` 时触发它。如果达到后者，动画开始播放，即 `--animps` 属性的值为 `running` ；否则就暂停，即 `--animps` 属性的值为 `paused` 。

  


```JavaScript
const IO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const state = (entry.intersectionRatio >= 0.75) ? 'running' : 'paused';
            entry.target.style.setProperty('--animps', state);
        }
    });
}, {
    threshold: [0.25, 0.75]
});

const animatedEles = document.querySelectorAll("[data-animation]");

animatedEles.forEach(animated => {
    IO.observe(animated);
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27fbd775b6ae43c8beac744e969e8810~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072&h=402&s=4122721&e=gif&f=386&b=310530)

  


> Demo 地址：https://codepen.io/airen/full/poGZXdJ

  


我们可以利用这种方式来实现滚动触发 CSS 动画，而无需任何 JavaScript 库。例如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c74e3d581cb42138b0726505b8b302a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=448&s=9365491&e=gif&f=102&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/VwgBoZV

  


注意，在现代 CSS 中，我们可以使用原生的 CSS 方法实现滚动驱动动效，但这个话题已经超出这节课的范畴，因此不在这里做过多的阐述。

  


## 重播 CSS 动画

  


通过前面的学习，我们知道 CSS 和 JavaScript 是如何控制动画的暂停和恢复播放。但一直没有介绍 CSS 动画应该如何重新播放。注意，这里说的重新播放和恢复播放是两个完全不同的概念：

  


-   恢复播放是指从暂停的地方继续向前播放
-   重新播放是指从头开始播放

  


不幸的是，CSS 中的 `animation-play-state` 属性并没有一个叫 `restart` 的值。也就是说，CSS 并没有内置的方法来停止该动画并让它从头开始播放。这也意味着，CSS 动画一旦开始运行，就没有内容的方法来停止该动画并且让它从头开始。即使是动画运行完成并且没有设置循环，重新启动该动画也容易。

  


到目前为止，要使动画重新开启，只能借助 JavaScript 脚本来完成。例如：

  


```HTML
<div class="animated"></div>
<button class="restart">Restart Animation</button>
```

  


```CSS
@layer animation {
    @keyframes slide {
        to {
            translate: calc(60vw - 3.5rem);
        }
    }

    .animated {
        animation: slide 1s cubic-bezier(.17, .67, .32, 1.55) 1 both;
    }
}
```

  


在没有添加任何 JavaScript 脚本的情况之下，应用在 `.animated` 元素上的 `slide` 动画只会运行一次，动画持续运行 `1s` 之后，元素会停留在容器右侧：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a41e5697aaac40749ad2bbb0fbc3ff99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=378&s=98104&e=gif&f=190&b=310630)

  


我们可以通过 JavaScript 给按钮 `button` 绑定一个点击事件（`click`），并且执行下面这段 JavaScript 代码：

  


```JavaScript
const restart = document.querySelector(".restart");
const animated = document.querySelector(".animated");

restart.addEventListener('click', () => {
    animated.style.animationName = "none";
    requestAnimationFrame(() => {
        setTimeout(() => {
            animated.style.animationName = ""
        }, 0);
    });
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82ada46551414e82a6f6fd3521c63339~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=372&s=345150&e=gif&f=200&b=32052f)

  


> Demo 地址：https://codepen.io/airen/full/bGzxeKP

  


正如你所看到的，动画播放完或正在播放，你只要点击了按钮，动画就会从头开始重新播放。

  


上面代码中的关键技巧在于，CSS 动画只有在与之关联的关键帧存在时才执行所有类似动画的操作。通过将 `animation-name` 属性设置为 `none` ，我们断开了与关键帧的链接，使动画停止。通过将 `animation-name` 设置为空，我们告诉浏览器回退到最初在 CSS 中设置的 `animation-name` 值。为了确保我们的关键帧在帧中被分离并在另一帧中重新附加，我们插入了人为的延迟。在这里我们有很多选择，但我们采用的方法依赖于我们的好朋友`requestAnimationFrame`，再加上一点 `setTimeout` 以处理跨浏览器的怪异之处。

  


你也可以将上面的代码封装成一个简单的函数，例如：

  


```JavaScript
const restartAnimation = (aniEle, animn) => {
    aniEle.style.animationName = "none";
    requestAnimationFrame(() => {
        setTimeout(() => {
            aniEle.style.animationName = '' || `${animn}`;
        }, 0);
    });
};
```

  


如此一来，你再需要对一个动画进行重启的操作时，就方便得多：

  


```JavaScript
const restart = document.querySelector(".restart");
const animated = document.querySelector(".animated");

restart.addEventListener("click", () => {
    restartAnimation(animated, 'slide');
});
```

  


我们也可以像控制动画的暂停和恢复播放一样，通过 JavaScript 来控制 CSS 自定义属性的值，比如 `--animn` ，JavaScript 脚本是相似的，唯一不同的是我们要传一个具体的值给 `--animn` 自定义属性，而不能是一个空值。具体代码如下：

  


```CSS
@layer animation {
    [data-animation] {
        animation: 
            var(--animn, none)        /* 动画名称 animation-name, 初始值为 none */
            var(--animdur, 1s)        /* 动画持续时间 animation-duration, 初始值为 1s */
            var(--animtf, linear)     /* 动画缓动函数 animation-timing-function, 初始值为 linear */
            var(--animdel, 0s)        /* 动画延迟时间 animation-delay, 初始值为 0s */
            var(--animdir, alternate) /* 动画方向 animation-direction, 初始值为 alternate */
            var(--animic, infinite)   /* 动画播放次数 animation-iteration-count, 初始值为 infinite */
            var(--animfm, none)       /* 动画填充查式 animation-fill-mode，初始值为 none */
            var(--animps, running);   /* 动画播放方式 animation-play-state，初始值为 running */
    }

    @keyframes slide {
        to {
            translate: calc(60vw - 3.5rem);
        }
    }

    .animated {
        --animn: slide;
        --animic: 1;
        --animfm: both;
    }
}
```

  


```JavaScript
const restart = document.querySelector(".restart");
const animated = document.querySelector(".animated");

restart.addEventListener("click", () => {
    restartAnimation(animated, 'slide');
});

const restartAnimation = (aniEle, animn) => {
    aniEle.style.setProperty(`--animn`, 'none');
    requestAnimationFrame(() => {
        setTimeout(() => {
            aniEle.style.setProperty(`--animn`, `${animn}`);
        }, 0);
    });
};
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b749c3df55a42a3ac93ff327eb05743~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=354&s=283768&e=gif&f=188&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/xxMaOop

  


除此之外，还可以使用 `getAnimations() 函数`使 CSS 动画重新播放。我们可以给 `getAnimations()` 函数传入一个动画元素，该函数将循环遍历绑定到元素上的所有附加动画。对于每个动画，通过取消（`cancel()`）加播放（`play()`）来重新启动它们。从而达到重启 CSS 动画的目的。具体 JavaScript 代码如下：

  


```JavaScript
const restartAnimations = (aniEl) => {
    aniEl.getAnimations().forEach((anim) => {
        anim.cancel();
        anim.play();
    });
};


const restart = document.querySelector(".restart");
const animated = document.querySelector(".animated");

restart.addEventListener("click", () => {
    restartAnimations(animated);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba3128cab3ad4ddd9305162e25d13f21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=422&s=178330&e=gif&f=134&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/MWLqjwp

  


## 动画的暂停、恢复和重新播放

  


通过前面的学习，我们可以通过数据属性 `[data-animation]` 、CSS 自定义属性 和简单的 JavaScript 代码，灵活的控制 CSS 动画的暂停、恢复播放和从头重新播放等操作。

  


这里简单的总结一下。

  


首先，在需要动画的元素上设置一个 `data-animation` 数据属性，你可以根据需要给它指定值，也可以不指定值。例如：

  


```HTML
<div class="container">
    <div class="animated" data-animation>
        <!-- 我是一个需要动画化的元素 -->
    </div>
</div>
```

  


接着定义 CSS 自定义属性，这些自定义属性刚好匹配控制一个动画所需的各项参数，即对应着 `animation` 属性的子属性。同时给所有自定义属性提供一个备用值，也就是初始值：

  


```CSS
[data-animation] {
    animation: 
        var(--animn, none)        /* 动画名称 animation-name, 初始值为 none */
        var(--animdur, 1s)        /* 动画持续时间 animation-duration, 初始值为 1s */
        var(--animtf, linear)     /* 动画缓动函数 animation-timing-function, 初始值为 linear */
        var(--animdel, 0s)        /* 动画延迟时间 animation-delay, 初始值为 0s */
        var(--animdir, alternate) /* 动画方向 animation-direction, 初始值为 alternate */
        var(--animic, infinite)   /* 动画播放次数 animation-iteration-count, 初始值为 infinite */
        var(--animfm, none)       /* 动画填充查式 animation-fill-mode，初始值为 none */
        var(--animps, running);   /* 动画播放方式 animation-play-state，初始值为 running */
}
```

  


假设你的动画元素 `.animated` 需要运用一个名为 `progress` 的关键帧动画，只需调整已定义的自定义属性的值。例如：

  


```CSS
@keyframes progress {
    from {
        scale: 0 1;
    }
    to {
        scale: 1 1;
    }
}

.animated {
    --animn: progress;
    --animic: 1;
    --animfm: both;
}
```

  


此时，`.animated` 元素应用了 `progress` 关键帧动画，并且该动画会执行一次，播放完之后将会停留在最后一帧的位置处。你将看到一个简单的进度条动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/177b60fca0154de996a00c9f7b849f0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=410&s=89035&e=gif&f=133&b=320631)

  


为了使让用户自己能更方便的控制动画，我们需要添加三个按钮，分别用来控制 `progress` 动画的暂停、恢复播放和重新播放。

  


最后，使用 JavaScript 分别为动画暂停、恢复播放和重新播放封装三个函数，并且绑定到相应的按钮上，就实现了我们的终极目标：

  


```JavaScript
const restartBtn = document.querySelector(".restart");
const pausedBtn = document.querySelector(".paused");
const playBtn = document.querySelector(".play");

const animated = document.querySelector(".animated");

// 暂停动画
const pausedAnimations = (aniEl) => {
    aniEl.style.setProperty(`--animps`, "paused");
};

// 恢复动画播放
const playAnimations = (aniEl) => {
    aniEl.style.setProperty(`--animps`, "running");
};

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

restartBtn.addEventListener("click", () => {
    restartAnimations(animated, "progress");
});

pausedBtn.addEventListener("click", () => {
    pausedAnimations(animated);
});

playBtn.addEventListener("click", () => {
    playAnimations(animated);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c288511de7bc4cb69fff6b222c3e193a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=508&s=793029&e=gif&f=337&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/OJdoRRJ

  


## 小结

  


在这节课中，主要和大家一起探讨了如何控制 CSS 动画的播放方式，其中主要以 CSS 关键帧为核心。对于 CSS 关键帧动画，我们可以通过内置的 CSS 属性 `animation-play-state` 或其简写属性 `animation` 就可以轻易地实现动画的暂停和恢复播放的操作。

  


不庆的是，CSS 的 `animation-play-state` 属性并没有一个 `restart` 值，我们无法直接通过 CSS 内置的方法使动画从头开始播放。好在，通过简单的 JavaScript 脚本就可以使 CSS 关键帧动画从头开始播放。

  


除此之外，课程花了更多的篇幅和时间与大家探讨了，如何使用 CSS 属性选择器、CSS 自定义属性和 JavaScript 更好的控制动画的暂停、恢复播放和重新播放。我想，大家通过这节课的学习，将能更好的控制 CSS 动画，为用户提供更好的体验。