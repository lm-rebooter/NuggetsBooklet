在当今数字化的时代，Web 开发者对于创造引人入胜、交互丰富的用户体验的需求愈发迫切。而 CSS 动画作为实现这一目标的利器，其灵活性和强大的表现力使得开发者能够创造出独具魅力的界面动效。然而，深度挖掘 CSS 动画的细节之一——**动画填充模式**，将带你进入一个全新的层次。这个不太被注意却关键的属性，决定了动画元素在开始前和结束后的样式状态，直接影响用户感知体验。

  


换句话说，要创建流畅、自然的动画效果并确保在动画结束后元素样式的一致性，就需要深入了解 CSS 动画填充模式。CSS 动画填充模式（`animation-fill-mode`）在动画播放前和播放后的样式处理上发挥了关键作用，能够解决动画播放前后可能出现的样式问题，是优化动画交互的不可或缺的一部分。

  


这节课将围绕 CSS 动画填充模式（`animation-fill-mode`）的基本概念、取值的应用、最佳实践以及在实际项目中的应用场景展开，为你揭示 CSS 动画填充模式的精髓。通过深入理解 CSS 动画填充模式，你可以更好地掌握动画的控制和表现，提高用户体验，并确保动画在整个过程中呈现一致的外观。希望这节课能够帮助你更自信、更高效地运用 CSS 动画填充模式，为你的 Web 项目注入更生动、更引人入胜的交互效果。

  


## 从困惑启程

  


通过前面一系列课程的学习，我能确信，你可以使用 CSS 的 `@keyframes` 和 `animation` 制作出令自己满意的 CSS 动画效果。但在制作 CSS 动画过程中，动画填充模式应该是令你感到困惑的其中之一，它甚至有可能成为你创造 CSS 动画的最大障碍。

  


让我们从现实中遇到的问题开始。

  


假设你给一个元素添加了淡出的动画效果，动画本身效果良好，但在动画结束时，元素突然又出现了：

  


```CSS
@keyframes fadeOut {
    to {
        opacity: 0;
    }
}

.animated {
    animation: fadeOut 2s ease-out 1;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/634b688f72174112ba67707c690c42bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=458&s=673755&e=gif&f=376&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/QWYVqEa

  


如果我们将 `.animated` 元素的不透明度（`opacity`）随时间变化绘制成图表（“距离时间图”），它可能会看起来像下图这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a1a506b817a4e45a16331712b36c4b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=931&s=380771&e=jpg&b=282b3e)

  


在动画 `fadeOut` 执行前，`.animated` 元素是完全可见的，这个容易理解，在 CSS 中并没有给 `.animated` 元素的 `opacity` 指定任何值，因此它相当于 `opacity` 的值为 `1` ，元素可见。问题是，`fadeOut` 动画执行完之后，`.animated` 元素怎么会突然回到完全可见的状态呢？

  


要回答这个问题并不复杂。这是 `@keyframes 关键帧的工作机制`，`@keyframes` 规则块中的样式规则（例如 `from` 和 `to` 选择器中的样式规则）仅在动画运行时应用。这也是 CSS 级联的基本规则，`@keyframes` 中的样式权重大于常规则中声明的样式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f91b7c48179344fb82bb09df7a137f04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=871&h=731&s=490333&e=jpg&b=131416)

  


也就是说，上面示例中的 `fadeOut` 关键帧在经过 `2s` （动画持续时间）后，该动画执行结束，`to` 选择器中的 `opacity: 0` 也相应的消失了，动画元素 `.animated` 的 `opacity` 将回到样式表中的其他地方声明（如果有的话）。在这个示例中，由于我们没有在其他地方为此元素设置不透明度，它会回到默认值，即 `opacity: 1` 。因此，在 `fadeOut` 动画运行结束的那一刻，`opacity` 的值回到 `1` ，动画元素立即变得可见。

  


解决这个问题的一种方法是在动画元素 `.animated` 中指定 `opacity` 属性的值为 `0` ：

  


```CSS
@layer animation {
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
  
    .animated {
        animation: var(--animn, fadeOut) 2s ease-out 1 var(--animps, paused);
        
        &.playing {
            opacity: 0;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77bb6839ac96444c9a98250511c27990~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=492&s=671983&e=gif&f=283&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/mdvGqRx

  


在动画运行时，`@keyframes` 规则块中的 `opacity` 会覆盖 `.playing` 选择器中的 `opacity` 。然而，一旦动画结束，`.playing` 选择器中的 `opacity` 将生效并使元素保持在完全透明的状态。

  


虽然我们通过一定的技术手段，使元素的 `opactiy` 与 `@keyframes` 关键帧中的 `to` 选择器中 `opacity` 声明保持一致，但这种方式并不是一种最好的方式？稍后我们会详细介绍，在 CSS 中，有更好的方式能达到相同的效果。

  


接着再来看第二种情形。

  


我们在制作 CSS 动画的时候，有的时候并不希望动画立即执行。在这种情境之下，通常会使用 `animation-delay` 来延迟一段时间，再让动画开始执行（即让动画等一段时间再执行）。例如：

  


```CSS
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animated {
    animation: var(--animn, fadeIn) 2s ease-in 2s 1;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7594d3f07f7d4be2b4db4976018da558~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=478&s=888332&e=gif&f=419&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/YzBOEBj

  


不难发现，当用户点击播放按钮，`.animated` 元素仍然有 `2s` 的时间完全可见，然后才从完全不可见（`opacity: 0`）过渡到完全可见（`opacity`）。同样的，如果用距离时间图来描述它的话，它可能看起来像下面这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad56c748aa2a4f7983eb1875ab5483f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=931&s=366158&e=jpg&b=282b3e)

  


需要知道的是，`@keyframes` 规则中的 `from` （`opacity: 0`）和 `to` （`opacity: 1`）选择器中设置的样式规则只有在动画运行时才会应用到 `.animated` 动画元素上。令人沮丧的是，动画延迟期间并不计算在内。因此，在那个 `2s` 钟内（动画延迟时间），就好像 `from` 块中的 CSS 不存在一样。而且，在样式表的其他地方又没有给 `.animated` 元素设置 `opacity` 的值与 `from` 选择器中的一样，因此你就会看到上面示例所呈现的视觉效果。

  


简单的解决方法是在 `.animated` 元素上设置 `opacity` 的值与 `@keyframes` 规则的 `from` 选择器中的 `opacity` 值相等：

  


```CSS
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animated {
    opacity: 0;
    animation: var(--animn, fadeIn) 2s ease-in 2s 1;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d68fe7110c1d4bfb8fa56105a22fa202~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=474&s=521433&e=gif&f=437&b=320631)

  


这样虽然解决动画延迟之前的问题，但动画结束之后又产生了与上一例所阐述的现象相似，元素淡入之后立即又变得不可见了。这并不是我们所期望的效果，我们希望的效果是淡入之后，元素保持可见状态。因此，不得不再按之前的方法，来改变元素的 `opacity` 的值：

  


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
  
    .animated {
        opacity: 0;
        animation: var(--animn, fadeIn) 2s ease-in 1 var(--animps, paused) 2s;
        transition: opacity 2s ease-in 2s;
        &.playing {
            opacity: 1;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/871b5a961f1d43ad94f0438a64860e78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=476&s=713316&e=gif&f=360&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/BaMOJWy

  


虽然视觉效果达到所期望的效果，但从代码或实现的技术角度来看，似乎脱离的关键帧动画的优势，也有点画蛇添足的味道。因此，这样的解决方案也决不是大家所期望的。

  


事实上，这两个示例所呈现的都是动画结束前后，动画元素样式应该如何保持一致性的问题。CSS 动画填充模式就是用来解决这个问题的。也就是说，我们可以通过 CSS 的 `animation-fill-mode` 来解决上面所碰到的问题，使动画元素的视觉在动画执行完前后都能保持一致，避免在视觉上给用户带来困惑。

  


## 动画填充模式是什么？

  


简单地说，动画填充模式 `animation-fill-mode` 设置 CSS 动画（关键帧动画）在执行之前和之后如何将样式应用于其目标（动画元素）。

  


如果用 [W3C 规范](https://drafts.csswg.org/css-animations/#animation-fill-mode)来解释的话。动画填充模式（`animation-fill-mode`）是一种用于控制 CSS 动画在执行期间以外的时间内如何应用样式的属性。默认情况下，动画在应用（即将 `animation-name` 属性设置在元素上）和动画开始执行（由 `animation-delay` 属性确定）之间以及动画结束后（由 `animation-duration` 和 `animation-iteration-count` 属性确定）并不会影响属性值。然而，通过使用 `animation-fill-mode` 属性，可以改变这种默认行为，允许动态更新属性值在动画延迟期间或动画结束后反映出来。

  


简而言之，`animation-fill-mode` 是 CSS 中用于控制动画如何影响元素样式的属性。它允许你更精细地控制动画在执行之前和之后对元素样式的影响，使得在动画过程中和之后的元素状态更加可定制。

  


`animation-fill-mode` 属性主要有四个值：

  


-   **`none`** ：默认值，表示动画在应用但未执行时没有效果。当动画未执行时，动画将不会将任何样式应用于目标，而是已经赋予给该元素的 CSS 规则来显示该元素。
-   **`forwards`** ：在动画结束时，动画将应用动画结束时的属性值，即目标将保留由执行期间遇到的最后一个关键帧的计算值。
-   **`backwards`** ：在由 `animation-delay` 定义的期间，动画将应用定义在将开始动画的第一次迭代的关键帧中的属性值。也就是说，动画将在应用于目标时立即应用第一个关键帧中定义的值，并在 `animation-delay` 期间保留此值。
-   **`both`** ：动画将遵循 `forwards` 和 `backwards` 的规则，从而在两个方向上扩展动画属性。

  


对于 `animation-fill-mode` 属性值的详细解释暂且搁置，我们先回到上面的两个示例中。

  


第一个示例，我们给动画元素 `.animated` 添加了一个淡出 `fadeOut` 动画：

  


```CSS
@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.animated {
    animation: fadeOut 2s ease-out 1;
}
```

  


如你所见，当你点击“Player”（播放按钮）时，`fadeOut` 动画会立即执行，动画元素 `.animated` 可见度会从完全可见过渡到完全不可见。最后，在 `2s` 的过渡结束时（动画结束），动画元素 `.animated` 将再次变得完全可见。这是因为默认情况下，`animation-fill-mode` 属性的值为 `none` ，这意味着在动画开始之前和结束之后，动画元素将不使用来自关键帧的任何样式。

  


然而，显然这不是我们所期望的结果。我们想要的元素有一个淡出的动画效果，并且在动画结束之后，动画元素应该保持在完全不可见的状态，即 `opacity` 属性的值仍然是 `0` 。在这个示例中，我们希望动画元素的 `opacity` 避属性值保持与关键帧中的 `100%` 选择器中的 `opacity` 值相等。也就是说，为了使动画在结束后使其最终关键帧的值（在我们的例子中是 `100%`），我们需要将 `animation-fill-mode` 属性的值设置为 `forwards` 。

  


```CSS
.animated {
    animation: fadeOut 2s ease-out 1 forwards;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3062bb284ae4930b00e7b2e6ff79ba5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1118&h=490&s=570854&e=gif&f=379&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/jOdvJVR

  


如你所见，当 `fadeOut` 动画结束时，`animation-fill-mode: forwards` 将复制粘贴最终块中的声明，将它们持续保留在时间轴上。相当于继续应用于动画元素上，这比之前所说的方法要灵活且方便多也，而且还不易于出错。

  


第二个示例，我们给动画元素 `.animated` 应用了一个淡入 `fadeIn` 动画，并且该动画将延迟 `2s` 才开始执行：

  


```CSS
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animated {
    animation: fadeIn 2s ease-in 1 2s;
}
```

  


很显然，这个效果并不是我们所期望的，我们所期望的是，动画元素 `.animated` 应用 `fadeIn` 动画之后，即使是在等待期间（动画延迟等待的阶段），它也应该是不可见的。默认情况之下，关键帧中的 `from` 和 `to` 选择器中声明的样式规则在动画延迟期间是不会应用到目标元素上的。因此，在那最初的 `2s` 钟里，动画元素是完全可见的，然后再从不可见慢慢过渡到可见。

  


第二个示例刚好与第一个示例相反。第一个示例，我们希望将关键帧最后一帧的样式应用到目标元素上；这个示例，我们希望将关键帧第一帧的样式应用到目标元素上。第一个示例是通过给动画添加 `animation-fill-mode: forwards` 来解决的。同样地，第二个示例我们也可以使用 `animation-fill-mode` 属性来解决，只是应用的值为 `backwards` 。

  


`animation-fill-mode` 的 `backwards` 与 `forwards` 做的事情完全相同，但它将使用动画的第一个关键帧，并在动画开始之前将这些样式应用于目标元素。因此，我们在第二个示例中，添加 `animation-fill-mode: backwards` ，你将得到一个你所期望的淡入动画效果：

  


```CSS
.animated {
    animation: fadeIn 2s ease-out 1 backwards 2s;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48b91967fc924a08a8b2f4a00ef58572~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=512&s=608803&e=gif&f=450&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/vYbzPmp

  


再来看另外一个示例，给动画元素 `.animated` 添加一个淡入淡出 `fadeInOut` 的动画效果，同样延迟 `2s` 执行：

  


```CSS
@keyframes fadeInOut {
    0% {
        opacity: 0;
    }
    
    50% {
        opacity: 1;
    }
    
    100% {
        opacity: 0;
    }
}

.animated {
    animation: fadeInOut 2s ease-in-out 1 2s;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ae3760f648e4847aab525b4b977de58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=436&s=394897&e=gif&f=249&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/XWOPGYj

  


同样地，上面所呈现的效果不是我们期望的效果。我们期望的效果是，动画元素在等待期间和执行完动画之后都要不可见。换句话说，我们期望 `fadeInOut` 关键帧中的第一帧（示例中 `0%` 选择器的样式）和最后一帧（示例中 `100%` 选择器样式）同时应用于动画元素。即同时具备 `animation-fill-mode` 属性的 `forwards` 和 `backwards` 两个值的特性。而 `animation-fill-mode` 属性的 `both` 值刚好具备 `forwards` 和 `backwards` 。如此一来，给动画元素设置 `animation-fill-mode` 的值为 `both` ，动画元素在动画开始之前将会使用第一个关键帧，并在动画结束之后使用最后一个关键帧，从而达到我们所期望的淡入淡出动画效果：

  


```CSS
.animated {
    animation: fadeInOut 2s ease-in-out 1 both 2s;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ae7c15ed2d74e1793c3d1c15f27bbfb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=450&s=601452&e=gif&f=392&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/qBgMvLP

  


通过这几个示例的展示，我想你对 CSS 动画填充模式有了一定的认知。接下来，我将尝试用距离时间图来深度解析一下 CSS 动画填充模式。希望能更好的帮助大家理解它，以便在实际开发中能更好的应用它控制动画元素的样式。

  


## 深度解析 CSS 动画填充模式

  


首先，我们已经知道了。动画填充模式 `animation-fill-mode` 是 CSS 的 `animation` 属性的一个子属性，它指定了 CSS 动画中关键帧开始前后的状态。它有四个值：

  


-   ① `none` ：默认值，关键帧开始前后保持默认值
-   ② `forwards` ：关键帧结束后保持最后采用的关键帧
-   ③ `backwards` ：保持关键帧开始前最先采用的关键帧（保留关键帧）
-   ④ `both`：同时满足条件 ② 和 ③ ，即同时具备 `forwards` 和 `backwards` 两者的特性

  


也就是说，只要理解了 `forwards` 和 `backwards` ，就理解了 `animation-fill-mode` 属性。那它是如何工作的呢？

  


首先，还是从 `forwards` 和 `backwards` 两个属性值开始，从字面说来说 `forwards` 是“向前”的意思，而 `backwards` 则是“向后”的意思。说实话，“向前”和“向后”会令人感到困惑的，通常都会这么认为：

  


-   “向前” 应该对应的是关键帧的前面，即关键帧的第一帧 `from` 或 `0%` 。事实上，它对应的是关键帧的最后一帧 `to` 或 `100%` ，**实为后**
-   “向后”应该对应的是关键帧的后面，即关键帧的最后一帧 `to` 或 `100%` 。事实上，它对应的是关键帧的第一帧 `from` 或 `0%` ，**实为前**

  


从这一点来说，“向前”（`forwards`）并不是前，实为后；“向后”（`backwards`）并不是后，实为前。这里有一个可能有助于理解的类比：想象一下，如果我们从页面加载的那一刻开始记录用户的会话，我们可以在视频中向前和向后移动。我们可以在动画开始之前向后移动，或者在动画结束后向前移动。或者说，这里所说的“向前”实质上是位于距离时间图的时间轴前面，也就是关键帧结束位置的前面；“向后”则刚好相反，它位于距离时间图的时间轴的后面，也就是关键帧开始位置的后面。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0178c92081c54e0eb50396655b825f59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1135&s=500326&e=jpg&b=282b3e)

  


通过上图你对“向前”（`forwards`）和“向后”（`backwards`）肯定有了更清晰的认识。

  


前面多次提到，`animation-fill-mode` 是指定关键帧开始之前和关键帧结束之后目标元素保持哪种状态。**它指的是“关键帧之前和之后”，而不是“动画之前和之后”** 。是不是要被这两句话绕晕了。我将尝试着使用下面这个示例来向大家解释，“关键帧之前和之后”和“动画之前和之后”两者有何差异。

  


假设，你有一个动画元素 `.animated` ，它被放置在一个名为 `.container` 容器中。如果用 HTML 来描述的话，它大致如下：

  


```HTML
<div class="container">
    <div class="animated">
        <!-- 我是目标元素，也是动画元素 -->
    </div>
</div>
```

  


在不加任何关键帧动画的前提之前，我们给这两个设置了一段普通的 CSS 代码，这段代码和 CSS 动画没有任何关联：

  


```CSS
.container {
    width: 60vw;
    display: grid;
    place-content: center start;
    background: #2b062a;
    
    .animated {
        --size: 100px;
        width: var(--size);
        aspect-ratio: 1;
        background: #f36;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11a6263aee014e5ebd6751c7a34c143d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1146&s=166439&e=jpg&b=330e36)

  


给 `.animated` 元素添加一个 `ani` 动画：

  


```CSS
@keyframes ani {
    0% {
        background: orange;
        translate: -100%;
    }
    100% {
        background: yellow;
        translate: 60vw;
    }
}

.animated {
    animation: ani 2s linear 1s;
}
```

  


`ani` 动画将对元素的背景色（`background`）和位移（`translate`）两个属性的值做了动画化处理。如此一来，动画元素 `.animated` 的 `background` 和 `translate` 在动画前后可能存在以下几种表现：

  


-   默认情况，`.animated` 的 `background` 为 `#f36` ，`translate` 为 `0` （未显式设置该属性的值）。我们在这里将它们称为既定值或规定值
-   `ani` 关键帧的 `0%` 选择器中将 `background` 的值更改为 `orange` ，`translate` 的值更改变 `-100%`
-   `ani` 关键帧的 `100%` 选择器中将 `background` 的值更改变 `yellow` ，`translate` 的值更改变 `60vw`

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87e6a5dc804147fc986684ae90cb9315~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=314&s=203487&e=gif&f=305&b=340631)

  


我们可以使用“距离时间”图来描述它：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/feec5cb3694241a192ade67b9017cb52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2164&h=2099&s=1097360&e=jpg&b=282b3e)

  


由于应用了动画延迟（`animation-delay: 1s`），因此即使在动画本身开始之后，关键帧开始之前也会有一段“等待时间”。

  


`animation-fill-mode` 所指的“开始之前”指的是由于这种延迟而产生的“等待时间”。换句话说，在关键帧开始之前。如果发生动画延迟，它将与 CSS 动画本身的开始时间不匹配。而 `animation-fill-mode` 所指的“完成后”是指关键帧完成后。这始终与 CSS 动画本身的结束时间一致。

  


简单地说，关键帧开始之前指的是在动画开始应用动画延迟的状态；关键帧结束后与动画完成后同样。

  


最终动画元素样式在关键帧之前和之后应用的是哪个状态的样式，则由 CSS 动画填充模式 `animation-fill-mode` 来指定。

  


-   关键帧开始之前，目标元素应用的是原定值还是第一个关键帧的样式值
-   关键帧结束之后，目标元素应用的是原定值还是最后一个关键帧的样式值

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bbfdef8db364b58abf1b1cc50277056~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2164&h=2910&s=1721255&e=jpg&b=282b3e)

  


基于上面的示例，`animation-fill-mode` 指定不同值时，动画元素 `.animated` 在关键帧前后的样式都会有所不同：

  


```CSS
@keyframes ani {
    0% {
        background: orange;
        translate: -100%;
    }
    100% {
        background: yellow;
        translate: 60vw;
    }
}

.animated {
    animation: ani 2s linear 1s var(--animfm, none);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b29993629bb436aabd47dea3770bc34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=678&s=1472654&e=gif&f=416&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/xxMaoqE

  


接下来单独看看 `animation-fill-mode` 属性取不同值时，动画元素在关键帧前后会应用什么样式。为了更好的向大家呈现它们之间的差异，我将上面的示例稍作调整：

  


```CSS
/* 动画元素预定样式值 */
.animated {
    background: red;
}

@keyframes ani {
    from {
        background: lime;
        translate: -300px;
    }
    to {
        background: yellow;
        translate: 300px;
    }
}

.animated {
    animation: ani 5s linear var(--animdel, 0s) var(--animfm, none);
}
```

  


上面代码告诉我们，动画元素 `.animated` 的 `background` 和 `translate` 会在关键帧 `ani` 不同的选择器变化。就此示例而言，它会有三个状态，即预定值、关键帧第一帧和关键帧最后一帧。它们分别是：

  


```CSS
/* CSS 预定值 */
.animated {
    background: red;
    translate: 0;
}

/* 关键帧第一帧 */
.animated {
    background: lime;
    translate: -300px;
}

/* 关键帧最后一帧 */
.animated {
    background: yellow;
    translate: 300px;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c457b1173d04658b7bcb1d3ccc640bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1548&s=476907&e=jpg&b=282b3e)

  


动画元素运用 `ani` 关键帧动画之后，在关键帧前后，目标元素的样式则会由动画填充模式决定。

  


### 没有任何模式：none

  


`animation-fill-mode` 取默认值 `none` 时，关键帧开始前后目标元素保持默认值。

  


```CSS
.animated {
    animation: ani 5s linear 0s none 1;
    
    &.delay {
        animation-delay: 2s;
    }
}
```

  


这两个动画元素只有一个差异，第二个动画元素设置了动画延迟 `animation-delay: 2s` 。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1acab20b62d4c8fa254c7c0b0fcf36a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=496&s=1223534&e=gif&f=419&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/WNPabPR

  


不难发现，第一个动画元素没有设置动画延迟时间，那么“等待时间等于关键帧开始之前”就不存在，动画会立即执行，此时动画元素会立即应用关键帧 `ani` 中第一帧（示例是 `0%`）的样式规则；而第二个动画元素设置了 `2s` 的延迟时间，那么“等待时间等于关键帧开始之前” 就存在，动画执行之后，关键帧需要等待 `2s` 才开始运行（它有 `2s` 的等待时间），此时动画元素并不会应用关键帧 `ani` 中第一帧的样式规则，而是应用元素在 CSS 中的预定值。

  


在这个示例中，动画结束后刚好与是关键帧结束，因此，两个动画元素的样式规则都会应用 CSS 中的预定值。这就是 `animation-fill-mode` 取 `none` 值时，动画元素在关键帧前后样式的应用规则。

  


### “向前”模式：forwards

  


`animation-fill-mode` 取 `forwards` 值，动画填充会采用“向前”模式，关键帧结束后保持最后采用的关键帧。

  


```CSS
.animated {
    animation: ani 5s linear 0s forward 1;
    
    &.delay {
        animation-delay: 2s;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95d7fc62330b46d1b62542f744609d20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=484&s=1802624&e=gif&f=558&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/BaMqoKV

  


正如你所见，“向前”模式对于动画元素在关键帧之前的样式并不会影响，它的表现行为与 `none` 是一样的。但它会对动画元素在关键帧结束之后的样式起到决定性的作用。在这个示例中，动画的结束刚好与关键帧的结束相同。前面也提到过，“向前”模式（`forwards`）是在时间轴的前面填充，它将会把关键帧的最后一帧 `to` （或 `100%`）中的样式规则复制粘贴给动画元素。简单地说，关键帧结束之后，动画元素始终会应用关键帧中最后一帧的样式规则。这意味着，**如果你想将动画元素的样式维持在关键帧结束状态，就得使用“向前”填充模式**。即动画保持在结束状态。

  


### “向后”模式：backwards

  


“向后”模式（`backwards`）刚好与“向前”模式（`forward`）相反，动画元素在关键帧开始之前会采用关键帧第一帧的样式规则。

  


```CSS
.animated {
    animation: ani 5s linear 0s backwards 1;
    
    &.delay {
        animation-delay: 2s;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf540b8c6367476c819a9115805e79f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1218&h=484&s=1857814&e=gif&f=667&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/RwveWRL

  


你会发现，当动画填充模式为“向后”模式（`backwards`）时，不管动画有没有设置延迟时间（`animation-delay`），动画元素在关键帧开始之前都将会应用关键帧中第一帧的样式规则。它相当于将关键帧第一帧的样式规则复制粘贴给了动画元素。同样的，“向后”模式不会对动画元素在关键帧之后样式有任何影响，因此，上面示例中的动画执行完，动画元素的样式将会应用 CSS 中的预定值，关键帧中样式规则似乎被丢失了。

  


也就是说，如果你希望动画维护开始状态，那么就得选择“向后”填充模式。

  


### “向前向后”模式：both

  


“向前向后”模式（`both`）比较简单，它同时具有“向前”模式（`forwards`）和“向后”模式（`backwards`）两者的特征：

  


```CSS
.animated {
    animation: ani 5s linear 0s both 1;
    
    &.delay {
        animation-delay: 2s;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff957517f2724faaa31cac8c3dd8f42b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=470&s=1870369&e=gif&f=583&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/QWYZjEz

  


当动画填充模式为 `both` 时，不管动画是否设置了延迟播放，在关键帧开始之前，动画元素都会应用关键帧中第一帧的样式；当关键帧结束时，动画元素会应用关键帧中最后一个关键帧的样式。

  


上面通过四个简单的示例，向大家呈现了动画填充模式 `animation-fill-mode` 在不同模式下对动画元素样式的设置。回顾一下，在时间轴上，一次动画过程主要三个状态：

  


-   动画等待：只有设置了动画延迟的动画才有这个过程
-   动画进行：关键帧执行的过程
-   动画结束：动画执行完成，这个过程也是关键帧执行完成

  


在这三个过程中，动画元素样式都将会受到关键帧和动画填充模式的影响：

  


-   动画等待状态下，动画元素的样式由动画填充模式决定
-   动画进行状态下，动画元素的样式由关键帧决定
-   动画结束状态下，动画元素的样式由动画填充模式决定

  


也就是说，动画填充模式 `animation-fill-mode` 只能控制动画元素在关键帧前后的样式，这和前面所描述的观点是一致的。其中：

  


-   如果 `animation-fill-mode` 取 `forwards` ，那么动画结束状态下，动画元素的样式会应用关键帧的最后一帧的样式，在动画等待和进行中不受影响
-   如果 `animation-fill-mode` 取 `backwards`，那么动画等待状态下，动画元素的样式会应用关键帧的第一帧的样式，在动画等待和进行中不受影响
-   如果 `animation-fill-mode` 取 `both`，那么动画等待状态下，动画元素的样式会应用关键帧的第一帧的样式；在动画结束状态下，动画元素的样式会应用关键帧的最后一帧的样式，在动画执行过程中不受影响

  


你可能已经发现了，前面所展示的示例的关键帧都显式指定了第一帧（`from` 或 `0%`）和最后一帧（`to` 或 `100%`）。你可能和我有同样的一个疑惑，如果关键帧并没有显式指定第一帧 (`from` 或 `0%`) 和最后一帧（`to` 或 `100%`），甚至整个关键帧只显示了一个帧（例如 `50%`）；那么动画填充模式对动画元素在关键帧前后样式有何影响呢？

  


我们通过下面这个简单的示例来寻找答案：

  


```CSS
@layer animation {
    @keyframes ani {
        50% {
            translate: 20vw;
            scale: 1.5;
            background: lime;
        }
    }

    .animated {
        background: red;
        animation: var(--animn, ani) 5s linear var(--animdel, 0s) var(--animfm, none) var(--animps, paused) 1;
    }
}
```

  


上面示例中的 `ani` 关键帧，只有一个 `50%` 选择器设置样式。当你改变动画填充模式时，你看到的效果如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5959402fc64f4f438497909726dc0cb7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=474&s=3490359&e=gif&f=844&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/Jjxmrjw

  


正如你所看到的，就这个示例而言，不管 `animation-fill-mode` 取何值，动画元素在关键帧前后的样式都是一样的。在解释为什么之前，我们通过浏览器调试工具，将整个动画慢放，请仔细观察动画元素的样式变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aee9909974f46acbbb56192ecf9cc9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1434&h=660&s=6267397&e=gif&f=671&b=32052f)

  


你将观察到，虽然关键帧 `ani` 并没有显式地通过 `from` （或 `0%`）和 `to` （`100%`）指定关键帧第一帧和最后一帧的样式变化，但并不代表就没有相应的样式。如果你知道 `@keyframes` 中百分比选择器与时间轴（`animation-duration`）之间的关系，就能很好的理解了。

  


就拿上面这个示例来说，动画的持续时间是 `5s` 。不管任何动画，它都有开始时间和结束时间，其中开始时间就是对应时间轴 `0s` 位置，而结束时间则由动画延迟时间和动画持续时间来决定。例如上面示例中的第一个动画元素，它没有设置延迟时间，因此动画结束时间位于时间轴 `5s` 位置；第二个元素设置了 `2s` 的延迟时间，因此动画结束时间位于时间轴 `7s` 位置。但关键帧中的百分比选择器的计算是相对于动画持续时间计算，即便是没有显式指定 `0%` 和 `100%` ，它们始终在时间轴上是有自己的位置。这也意味着，关键帧有没有显式设置 `0%` 和 `100%` ，动画元素在这两个位置都会有相应的样式规则，只不过这个样式规则是 CSS 中预定值。

  


```CSS
@keyframes ani {
    50% {
        translate: 20vw;
        scale: 1.5;
        background: lime;
    }
}

/* 等同于 */
@keyframes ani {
    0%, 100% {
        translate: 0;
        scale: 1;
        background: red;
    }
    50% {
        translate: 20vw;
        scale: 1.5;
        background: lime;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11d4186c4cec491f989d8914395d7dd6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=512&s=2522135&e=gif&f=615&b=32052f)

  


> Demo 地址：https://codepen.io/airen/full/oNmaGGv

  


这个示例告诉我们，虽然 `@keyframes` 中只定义了一个 `50%` 的帧，并没显式的定义 `0%` 和 `100%` ，但事实上，动画中同样具有第一帧和最后一帧。但有几个事实是真正存在的：

  


-   任何一个关键帧，第一帧（`0%`）和最后一帧（`100%`）不是绝对的
-   `@keyframes` 中虽没显式的声明 `0%` 和 `100%` ，并不表示没有第一帧和最后一帧。也就是说任何一个关键帧动画都有第一帧和最后一帧
-   `@keyframes` 中虽没有显式的声明 `0%` 和 `100%` ，但 `animation-fill-mode` 属性值的作用是一样的

  


结合前面的示例，我们可以得出：`animation-fill-mode` 和 `@keyframes` 中第一个和最后一个显式声明的百分比选择器并无关联。事实上它只与 `@keyframes` 的 `0%` 和 `100%` 选择器有关。换句话说，我们前面所说的关键帧的第一帧指的是 `@keyframes` 中的 `0%` 或 `from` 选择器；最后一帧指的是 `@keyframes` 中的 `100%` 或 `to` 选择器。这也意味着，`animation-fill-mode` 属性决定着动画元素在关键帧执行完前后，应用的是 `@keyframes` 中的 `0%` 选择器中的样式、`100%` 选择器中的样式，还是 CSS 预定值。

  


注意，如果 `@keyframes` 规则中没有显式指定 `0%` 和 `100%` 选择器对应的样式规则，那么它们将和动画元素在 CSS 中预定值等同。

  


## 动画填充模式需要注意的事项

  


乍一看，动画填充模式中的“向前”模式（`forwards`）总是使用 `100%` 关键帧，“向后”模式（`backwards`）总是使用 `0%` 关键帧，但实际上，情况并如总是如此。因为关键帧的 `0%` 和 `100%` 会受到 CSS 的 `animation-direction` 和 `animation-iteration-count` 属性值的影响，动画的第一个关键帧实际上可能不是 `0%` ，而最后一个关键帧可能不是 `100%` 。

  


让我们看一个使用 `backwards` 但 `animation-direction` 设置为 `reverse` 的简单示例。

  


```CSS
@layer animation {
    @keyframes ani {
        0% {
            background: lime;
            translate: -300px;
        }
        100% {
            background: yellow;
            translate: 300px;
        }
    }

    .animated {
        animation: ani 5s linear backwards reverse;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d74239b2701f4dd0b126a6dfec483b8a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=488&s=1223460&e=gif&f=388&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/rNPqpPp

  


动画的方向被反转了（`animation-direction: reverse`），动画的第一个关键帧是 `100%` ，这意味着在动画开始之前元素使用了 `100%` 关键帧的样式。这就是为什么动画元素一开始就向右移了 `300px` （即 `translate: 300px`），并且背景色为 `yellow` （即 `background:yellow`），然后慢慢向左移动，并且背景色慢慢变成 `lime` 色，最后跳到 `0` 位置（`translate: 0`），且背景色跳到红色（`red`）的原因。

  


也就是说，当 `animation-direction` 为 `normal` 或 `alternate` 时，关键帧第一帧为 `0%` 或 `from` ；反之，当 `animation-direction` 属性的值为 `reverse` 或 `alternate-reverse` 时，关键帧的第一帧为 `100%` 或 `to` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fe47faadacd49a68670fb8052a29de6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=478&s=3015476&e=gif&f=849&b=32052f)

  


> Demo 地址：https://codepen.io/airen/full/abXRqoa

在使用反向动画时，使用 `forwards` 填充模式也会出现类似的问题，但使用多次迭代的交替动画也可能导致结束关键帧不是 `100%`。在以下示例中，我们的 `animation-direction` 设置为 `alternate`，`animation-iteration-count` 设置为 `2`。

  


```CSS
@layer animation {
    @keyframes ani {
        0% {
            background: lime;; 
            translate: -300px;
        }
        100% {
            background: yellow;
            translate: 300px;
        }
    }

    .animated {
        animation: 
            var(--animn, ani) 5s linear var(--animdel, 0s) 
            var(--animfm, forwards) var(--animps, paused) 
            var(--animic, 2) var(--animdir, alternate);  
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8e859a9a96145d3a9bc0bc57bc14770~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=466&s=2137520&e=gif&f=586&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/BaMqYjL

  


在这个示例子，完成整个动画之后，动画元素一直保持着这个样式，向左移了 `300px` （`translate: -300px`），并且背景色为 `lime` 。这是因为我们动画的最后一个关键帧是 `0%` ，因为动画运行了两次，第一次迭代是从 `0%` 到 `100%` ，第二次迭代从 `100%` 到 `0%` 。

  


在动画结束时，`forwards` 指定动画元素应用关键帧最后一帧的样式规则，但关键帧最后一帧会受到 `animation-direction` （动画运动方向）和 `animation-iteration-count` （播放次数）的影响。

  


| **`animation-direction`** | **`animation-iteration-count`** | **关键帧最后一帧**   |
| ------------------------- | ------------------------------- | ------------- |
| `normal`                  | 偶数或奇数                           | `100%` 或 `to` |
| `reverse`                 | 偶数或奇数                           | `0%` 或 `from` |
| `alternate`               | 偶数                              | `0%` 或 `from` |
| `alternate`               | 奇数                              | `100%` 或 `to` |
| `alternate-reverse`       | 偶数                              | `100%` 或 `to` |
| `alternate-reverse`       | 奇数                              | `0%` 或 `from` |

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b518cadac3e14647a924c8392721285f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=490&s=3505828&e=gif&f=912&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/OJdBQQp

  


重要的是要注意你动画的方向（`animation-direction`）和迭代次数（`animation-iteration-count`），以便确切知道动画第一个和最后一个关键帧是哪个，从而才能准确判断出动画填充模式最终会将哪个状态的样式应用到动画元素上：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6632a43febf74abcb95d6ca4d330cd4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=494&s=2501759&e=gif&f=607&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/RwveQEo

  


## 案例：封面动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d43b1a93b52044d697ccd8e4c5ba1534~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=598&s=15097865&e=gif&f=124&b=b7cbe2)

  


上图是一个很常见的封面动画效果。封面的“标题”、“描述文本”和“按钮”三个元素都应用了动画：

  


-   标题应用了一个 `zoomIn` 的动画，整个动画大约持续了 `1s`
-   描述文本应用了一个 `fadeInUp` 的动画，整个动画大约持续了 `.6s` ，并且延迟 `0.3s` 执行
-   按钮应用了一个与描述文本相同的动画 `fadeInUp` ，整个动画大约持续了 `1.2s` ，并且延迟 `0.4s`

  


三个动画执行完都保留在结束状态。

  


构建上图这样的一个封面动画，你可能需要下面这样的一个 HTML 结构：

  


```HTML
<div class="hero">
    <h1>NOUVEAU</h1>
    <p>NYC online clothing store</p>
    <button>Online Store</button>
    <figure><img src="hero.png" alt="hero" /></figure>
</div>
```

  


首先添加一些 CSS 代码，完成整个封面的布局效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d3c682d62ea451ca23e7e2e848ecddb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1146&s=2236066&e=jpg&b=300836)

  


接下来，我们开始编写与动画相关的 CSS 代码。首先，我们要创建两个关键帧动画，一个用于标题，另一个用于描述文本的按钮。这两个关键帧动画对应的代码如下：

  


```CSS
@keyframes zoomIn {
    from {
        scale: .3
    }
    to {
        scale: 1;
    }
}

@keyframes fadeInUp {
    from {
        translate: 0 50px
    }
    to {
        translate: 0 0;
    }
}
```

  


将创建好的关键帧动画应用到相应的动画元素上：

  


```CSS
.hero {
    & h1 {
        animation: zoomIn 1s cubic-bezier(.19,1,.22,1);
    }
    
    & p {
        animation: fadeInUp .6s cubic-bezier(.19,1,.22,1) .3s;
    }
    
    & button {
        animation: fadeInUp 1.2s cubic-bezier(.19,1,.22,1) .4s;
    }
}
```

  


上面代码中，并没有给任何动画设置动画填充模式，你看到的效果如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd8f42a7b494e838f62e80b3a084ff5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=682&s=11767630&e=gif&f=188&b=330331)

  


看上去似乎也还过得去。不急，我们先把动画放慢速度来播放：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c2b19b8d48a4d9db141902861f09c52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1434&h=580&s=12085344&e=gif&f=131&b=2e032f)

  


不知道你是否发现了：

  


-   标题应用的 `zoomIn` 动画，首先将元素缩小到 `0.3` ，然后再慢慢放大到 `1` ，恢复到正常状态。由于该动画没有动画延迟（没有等待过程），所以动画运行的时候，元素就会立即应用关键帧第一帧，然后到最后一帧结束。
-   描述文本和按钮则有所不同，最初的时候它位于原始位置不动，动画开始运行后，待动画延迟时间结束（关键帧开始运行）时，它先会向下移动 `50px` ，然后再慢慢回到原始位置，即向上移动 `50px`

  


事实上，我们并不希望它们是这样的一个效果，我们更希望它们都从关键帧第一帧开始，然后慢慢运行到关键帧最后一帧，并且动画线束之后，它们始终保持在关键帧结束状态。为了达到这样的效果（目的），我们需要通过动画填充模式来实现。

  


就这个示例而言，标题的 `zoomIn` 动画，它并没有延迟时间，我们只需要确保它在动画结束之后，标题样式保持动画结束状态（也就是关键帧最后一帧状态）即可。也就是说，我们需要将它的 `animation-fill-mode` 设置为 `forwards` 。

  


对于描述文本和按钮则有所不同，首先它们都有延迟时间，分别是 `.3s` 和 `.4s` ，为了确保它们的样式保持与关键帧第一帧一致，我们需要将 `animation-fill-mode` 设置为 `backwards` 。可是，这样还是不够的，我们还需要确保它们在动画结束之后，样式保持与关键帧最后一帧一样，因此 `animation-fill-mode` 还需具备 `forwards` 功能。所以，要将应用在描述文本和按钮上的 `animation-fill-mode` 设置为 `both` ，只有这样它才能同时具备 `forwards` 和 `backwards` 的效果：

  


```CSS
.hero {
    & h1 {
        animation: zoomIn 1s cubic-bezier(.19,1,.22,1) forwards;
    }
    
    & p {
        animation: fadeInUp .6s cubic-bezier(.19,1,.22,1) .3s both;
    }
    
    & button {
        animation: fadeInUp 1.2s cubic-bezier(.19,1,.22,1) .4s both;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac8b34ba685443e696799cf128b6a783~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1438&h=590&s=12414825&e=gif&f=139&b=2e032f)

  


仔细对比一下，现在是不是要更协调一些，最起码描述文本和按钮不会有闪跳这种突兀感。

  


当然，很多开发者可能不会留意到这样的细节，因为大多时候在定义 `zoomIn` 和 `fadeInUp` 动画的时候，会将 `opacity` 属性加入，至少 `fade` 系列动画会这样做：

  


```CSS
@layer animation {
    @keyframes zoomIn {
        from {
            opacity: 0;
            scale: 0.3;
        }
        to {
            opacity: 1;
            scale: 1;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            translate: 0 50px;
        }
        to {
            opacity: 1;
            translate: 0 0;
        }
    }

    .hero {
        & h1 {
            animation: zoomIn 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
    
        & p {
            animation: fadeInUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) 0.3s both;
        }
    
        & button {
            animation: fadeInUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) 0.4s both;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7f58fb6a97f427c830977057bf1b8f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1438&h=622&s=11741880&e=gif&f=123&b=2e032f)

  


如此处理之后的动画效果，是不是让你舒服多了。不带慢动作的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68133248c42b4f899eca39e6f2eaa8c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=688&s=10345019&e=gif&f=150&b=2f0331)

  


> Demo 地址：https://codepen.io/airen/full/QWYZmNZ

  


我们在创造动画效果的时候，很多时候细节将会决定最终的效果，哪怕微小的细节都会影响整体的动画效果。细节将决定成败！

  


这是一个非常常见，也非常简单的动画示例，通过一步一步拆解，只是想告诉大家，我们在开发动画的过程中，应该如何选择正确的动画填充模式。当然，做出正确选择的前提是，你对动画填充模式的基础和理论要有足够的了解。

  


## 小结

  


动画可能很难处理，因为它们需要完全掌握 CSS 才能充分利用。动画的复杂性又因它们在动画结束时自动重置回初始状态而变得更加复杂。幸运的是，`animation-fill-mode` 属性让我们可以精确调整元素在动画运行之前和之后的样式。有了这个属性，制作元素在两个状态之间永久过渡的复杂动画变得非常简单。