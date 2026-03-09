在现代 Web 体验中，动画已经成为吸引用户、传递信息的不可或缺的元素。而在这场视觉盛宴中，[CSS 帧动画和过渡动画](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)以其简单易用的特性成为 Web 设计师和开发者的宠儿。然而，要真正发挥 CSS 动画的潜力，深入了解动画的持续时间和延迟时间是至关重要的。这两个时间参数不仅决定了动画的速度和时长，还影响动画的流畅度。我们能够通过这两个时间参数在时间轴上精确控制动画的启动时机，更精细调校用户感知，为用户呈现更加令人满意的交互效果。

  


这节课，我们将深入剖析 CSS 动画中的两个核心概念：**持续时间**和**延迟时间**，帮助大家理解这两个关键时间参数对动画效果的影响。首先，我们会详细介绍动画的持续时间，探讨如何通过设置合适的时间长度，调整动画的速度和变化过程，使之更符合设计意图。我们将深入了解关键帧动画和 CSS 属性的使用方法，帮助大家掌握灵活运用持续时间的技巧。

  


其次，我们将探讨动画的延迟时间，解析延迟时间在动画序列和用户体验中的重要性。通过合理设置延迟时间，我们能够创造出错落有致的动画效果，增强用户对动画的感知。课程将分享如何在关键帧动画和 CSS 属性中灵活运用延迟时间，使你能够精准掌握动画的时机，创造出更具层次感和协调性的页面动态。

  


最后，我们将通过案例研究和实际运用，展示如何在项目中优化和调整动画的时间参数，创造出更加生动、引人入胜的动画体验。无论是为了打造独特的用户体验，还是为了提升 Web 设计和开发的专业水平，深入了解 CSS 动画的持续时间和延迟时间都是不可忽视的重要环节。

  


让我们一同踏入这个关于时间与艺术的探索之旅，深入了解 CSS 动画的持续时间和延迟时间，为你的设计注入更丰富的表现力和创意。

  


## 为什么深入了解 CSS 动画的时间参数如此重要？

  


在介绍 [Web 动画基本原理](https://juejin.cn/book/7288940354408022074/section/7288342442284154932#heading-6)的时候说过，**速度和时间**是发挥动画潜力的核心要素。其中，速度由距离和时间来决定，它的主要表现形式就是应用于动画的缓动函数（也称缓动曲线）。因此，我在小册中花了多节课向大家介绍了 CSS 的缓动函数，例如：

  


-   [如何通过缓动函数给 Web 动画注入灵魂](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)
-   [如何使用 CSS 的 `steps()` 步阶曲线来创造分段动画](https://juejin.cn/book/7288940354408022074/section/7301594361152667698)
-   [如何使用 CSS 的 `cubic-bezier()` 函数来创造高级动画](https://juejin.cn/book/7288940354408022074/section/7298995488580337714)
-   [如何使用 CSS 的 `linear()` 函数来创造令人惊叹的缓动曲线](https://juejin.cn/book/7288940354408022074/section/7301665456824254515)

  


速度之外的另一个核心要素就是**时间**。它分为动画的持续时间和延迟时间。它们在定义、控制和优化动画效果方面起着至关重要的作用。以下是为什么这两个时间参数被视为动画核心的原因：

  


-   **定义动画时间和速度**：动画的持续时间决定了动画从开始到结束所需的时间，它是用户与之互动的时间，决定了用户感知的速度和流畅度。通过巧妙设置持续时间，我们可以打造出既引人入胜又不失舒适感的动画效果。短暂的时间（短持续时间的动画）可能适用于快速而引人注目的效果，而更长的时间（长持续时间的动画）则有助于呈现更为沉浸式、深度感的动画场景，更适合展示缓慢而连贯的状态 变化
-   **控制动画的启动时机**：延迟时间则是动画启动的关键，它定义了动画从触发到实际开始的等待时间。在 Web 设计中，元素不必同时开始动画，通过巧妙设置延迟时间，我们可以创造出错落有致的动画序列，使用户的注意力得以引导，从而提升整体的用户体验。延迟时间还有助于解决多个元素同时触发动画时可能产生的视觉混乱问题，使整体动画显得更加协调和美观以及更具层次感

  


接下来，我们来通过真实的案例从不同方面来阐述 CSS 动画时间参数之所以如此重要。

  


### 影响用户体验

  


持续时间决定了动画的速度和变化过程，直接影响用户对动画的感知。合理设置持续时间能够创造出既引人入胜又不过于仓促的动画效果，提升用户体验。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f11caae586d42f5bfc6cfa409d29c3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=660&s=3321931&e=gif&f=97&b=100f0f)

  


比如上面这个效果，Logo 和标题分别应用了 `zoomIn` 、`fadeInUp` （主标题和子标题使用相同动画），但 Logo 的动画持续了 `1s` ，主标题的动画持续了 `4s` 和子标题的动画持续了 `1s` 。你会发现，子标题会有一个延迟效果，相比其他两个元素，它大约延迟 `0.3s` 才出现。

  


### 传达设计意图

  


动画的时间参数是设计师表达情感和意图的一种手段。不同的持续时间可以传递出不同的情感。例如短暂的时间可以强调突然出现的元素，而长时间则更适合呈现平缓的状态变化。例如下面这个效果，用户鼠标悬停在图片上时，图片会以较快的速度放大，同时内容快速出现在图片之上：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59ce779f570d4826b8a20a340d105834~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=542&s=12892170&e=gif&f=136&b=121212)

  


### 引导用户注意力

  


通过设置延迟时间，可以实现元素错落有致的动画序列，引导用户的注意力。这种巧妙的时间调度能够使整体动画效果更具吸引力和协调性。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7b308142ee64caf824916a208439cdc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=650&s=1895073&e=gif&f=317&b=fefefe)

  


上面这个列表动画，每一列都比前一列延迟 `0.5s` 出现。

  


### 解决动画的冲突问题

  


在多个元素同时触发动画时，适当的延迟时间可以避免动画效果的视觉混乱，使各个元素的动画显示更协调和有序。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9613ed6d7181479a97187968938b8acf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=666&s=14331965&e=gif&f=358&b=1e1c1a)

  


上面这个效果中，标题、子标题和按钮三个元素都应用了动画，其中子标题的动画延迟了 `0.2s` 才开始，按钮的动画延迟了 `1.1s` 才开始。不难发现，虽然三个动画同时触发，但它们所呈现的视觉效果一点也不混乱，这就是动画延迟时间发挥的作用。

  


除此之外，Web 设计师或开发者通过精细调校时间参数，可以优化动画的性能和效果。适当的持续时间和延迟时间有助于避免动画过快或过慢，提高整体动画的质量。另外一方面，对 CSS 动画时间参数的深入理解，也将意味着你对这一技术维度的全面掌握。对于 Web 设计和开发者而言，这是提升专业水平、创造更高水平动画的关键。

  


总体而言，动画的持续时间和延迟时间是 Web 设计师或开发者在实现视觉创意和用户交互性方面的两个关键参数。它们相辅相成，共同构建出生动、吸引人的动画效果，还为设计者提供了更大的创作空间。这种对时间参数的敏感性和精准调控，是创造出成功而令人难忘的动画作品的必备技能。

  


## 时间轴

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01f9b79d424b444e87b3e35fb4357296~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2878&h=490&s=177407&e=jpg&b=d2e0f5)

  


时间轴是动画中一个重要的概念，在这根时间轴上，可以清楚的呈现动画的关键要素，比如动画名称或过渡属性、持续时间，延迟时间以及播放次数等。

  


到目前为止，CSS 动画主要由三种类型的时间轴，即文档时间轴、滚动进度时间轴和视图进度时间轴：

  


-   **文档时间轴（Document Timeline）** ：表示当前文档的默认时间轴，它会在网页加载时自动创建。此时间轴对于每个文档（`document`）来说都是唯一的，并在文档的生命周期中保持不变。默认情况下，CSS 动画播放都是使用文档时间轴，**动画播放进度是跟着自然时间走的**
-   **滚动进度时间轴（Scroll Progress Timeline）** ：与滚动容器沿特定轴的滚动位置的进度相关联的时间轴
-   **视图进度时间轴（View Progress Timeline）** ：与滚动容器内特定元素的相对进度相关联的时间轴

  


注意，滚动进度时间轴和视图进度时间轴是 CSS 滚动动效引入的两个新的时间轴，它们都可以改变动画的时间线，用于控制 CSS 动画播放进度。这意味着，使用这两种新的时间轴，CSS 动画的执行（播放）过程由页面（或滚动容器）的滚动进行接管。也就是说，CSS 滚动驱动的动画只会跟随滚动容器的滚动进度而变化，即滚动条滚动了多少，动画就播放多少，时间已不再起作用。有关于这方面更详细的介绍，我们将会在滚动驱动动效一节课中阐述。

  


> 特别声明，在接下来的内容中，如果没有特别声明，我们都将以文档时间轴来阐述动画的延迟时间和持续时间。

  


我们通过 Chrome 浏览器的动画调试工具，来看看动画持续时间和延迟时间是如何在时间轴上呈现的。首先来看一个过渡动画的示例：

  


```CSS
.transition {
    background-color: #09f;
    border-radius: 4px;
    transition: background-color 1s, translate 2s 1s, scale 3s 2s;
    
    &:hover {
        background-color: #f36;
        border-radius: 8px;
        scale: 1.2;
        translate: 0 -4px;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5a2abe19e034a738c0b463860cdae2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=438&s=416155&e=gif&f=129&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/LYqQbGd

  


在这个过渡动画中，分别对 `background-color` 、`translate` 和 `scale` 三个 CSS 属性状态变化进行动画化，其中：

  


-   `background-color` 属性从 `#09f` （起始状态） 过渡到 `#f36` （结束状态） ，共用时 `1s` （持续时间）
-   `translate` 属性从 `0 0` （起始状态）过渡到 `0 -4px` （结束状态），共用时 `2s` （持续时间），而且延迟 `1s` 才开始执行
-   `scale` 属性从 `1` （起始状态）过渡到 `1.2` （结束状态），共用时 `3s` （持续时间），而且延迟 `2s` 才开始执行

  


它们在时间轴上位置如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba65d87d9f85405ab673ba61b57799d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2876&h=620&s=137513&e=jpg&b=f9f9f9)

  


上图中分别展示了 `.transition` 元素的 `sclae` 、`background-color` 和 `translate` 三个属性值过渡运动的变化。它看起来有点类似于设计软件中的图层，只不过添加了时间轴，而且在时间轴上每个属性过渡所用时间和等待时间都展示出来了。我们可以用下来描述，会更清晰一点：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8a31263a53a45288f64d237878f7ff4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1331&s=695950&e=jpg&b=282b3e)

  


CSS 过渡动画相对而言更简单一些，每个动画化属性的状态只有初始状态（`A`）和结束状态（`B`）。

  


接着来看 CSS 的关键帧动画。例如：

  


```CSS
@keyframes backgroundColor {
    to {
        background-color: #f36;
    }
}

@keyframes translate {
    to {
        translate: 0 -4px;
    }
}

@keyframes scale {
    to {
        scale: 1.2;
    }
}

.animated {
    background-color: #09f;
    border-radius: 4px;
    
    &:hover {
        animation:
            backgroundColor 1s forwards,
            translate 2s 1s forwards,
            scale 3s 2s forwards;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7db7d4f796c49faaadeaf514f17db51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=412&s=307124&e=gif&f=169&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/XWOZpNx

  


你看到的效果和前面过渡动画的效果是一致的。它对应在的时间轴示意图如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24d8791910614311929fbd012766abaf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2878&h=436&s=126399&e=jpg&b=2d2d2d)

  


它和过渡动画有所不同。上图所呈现的是 `backgroundColor` 、`translate` 和 `scale` 三个关键帧动画（`@keyframes`）分别在时间轴上的时序图。当用户鼠标悬停在 `.animated` 元素上马上就会触发这三个关键帧动画，只不过：

  


-   `backgroundColor` 关键帧动画持续 `1s`
-   `translate` 关键帧持续 `2s` ，并延迟 `1s` 后开始执行
-   `scale` 关键帧持续 `3s` ，并延迟 `2s` 后开始执行

  


由于 `animation-fill-mode` 属性的值为 `forwards` ，使得 `backgroundColor` 、`translate` 和 `scale` 三个关键帧动画所设置的属性值将停留在最后一帧。其对应的时序图如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6502e8d6477f4738b5b9d09d07fbe98e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1331&s=767310&e=jpg&b=282b3e)

  


注意，就这个示例而言，虽然我们在 `.animated` 元素上应用了多个关键帧动画，但它们都是比较简单的关键帧动画，每个关键帧动画都只有初始状态和结束状态，并且只有单独的属性值变化。随着关键帧动画的复杂度增加，其对应的时序图也会相应变得更为复杂。稍且将会向大家展示这方面的示例。

  


有了这个基础之后，我们就可以真正的进入 CSS 动画的持续时间和延迟时间的世界中。我们先从持续时间开始，因为它相对于延迟时间要简单地多。

  


## 动画持续时间

  


想象一下，你正在观看一个展示某种技艺的表演，比如魔术秀。在这个场景中，CSS 动画（帧动画和过渡动画）的持续时间就好比是整个魔术表演的时长。

  


假设魔术师正在进行一场表演，他将一只兔子变出一个空的帽子。这整个过程就是表演的动画，而动画的持续时间就是这一魔术过程所花费的时间。

  


在 CSS 动画中，持续时间定义了从动画开始到结束所经历的时间长度。就像在魔术表演中，魔术师在一段时间内进行变化，而这段时间的长短影响着观众对魔术的感知。

  


如果动画持续时间较短，就像一个快速的魔术变化，观众可能会感到震惊和惊奇。相反，如果动画持续时间较长，就像一个缓慢的魔术过程，观众可能会更加专注，并感受到更多的细节和变化。

  


CSS 动画的持续时间在页面设计中非常重要，因为它直接影响用户对页面变化的感知和体验。通过精心调整动画的持续时间，设计师可以创造出令人愉悦、引人入胜的用户界面。

  


在 CSS 中，不管是过渡动画还是关键帧动画，都可以通过设置持续时间来定义动画的时长，即动画从开始到结束所需的时间长度。虽然持续时间对于关键帧动画和过渡动画作用是相似的，但它们之间还是有一定差异的。

  


### 过渡动画的持续时间

  


我们通常使用 `transition-duration` 或它的简写属性 `transition` 给过渡动画设定持续时间。例如：

  


```CSS
.element {
    color: #09f;
    transition-property: color; /* 过渡的属性为width */
    transition-duration: 1s;    /* 过渡时间为1秒 */
    
    &:hover {
        color: #f36; /* 鼠标悬停时改变 color 属性的值（#09f 👉 #f36），触发过渡效果 */
    }
}
```

  


上面的例子中，当鼠标悬停在 `.element` 元素上时，`color` 属性的值会从 `#09f` （初始状态）过渡到 `#f36` （结束状态），整个过渡过程会用时 `1s` 。这个 `1s` 就是这个过渡动画的持续时间。

  


你是否还有印象，[在介绍过渡动画时，我曾说过：要使过渡动画效果生效需要指定两个值](https://juejin.cn/book/7288940354408022074/section/7292735608995184678#heading-1)：

  


-   希望进行动画的属性名称
-   过渡动画的持续时间

  


由于 `transition-duration` 属性（过渡动画的持续时间）默认值为 `0` ，我们内眼是无法看到过渡属性的变化，从而产生没有无过渡动画效果的错觉。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/304077c1248448c3a02bb477aa390c4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=448&s=629770&e=gif&f=201&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/ZEwrLdP

  


不难发现，当 `transition-duration` 属性的值为 `0` 时，属性状态的变化不会有一个平滑过渡的过程，你所看到的只是一闪而过的效果，即从初始状态到结束状态是瞬间发生的。

  


我们可以在 `transition-duration` 属性上指定多个过渡持续时间，并且以逗号（`,`）进行分隔。当 `transition-duration` 指定多个过渡持续时间时，每个持续时间会被应用到由 `transition-property` 指定的对应属性上。如果指定的过渡持续时间（`transition-duration`）个数小于属性个数（`transition-property` 指定的过渡属性），那么过渡持续时间的列表就会重复。例如：

  


```CSS
.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-duration: .1s;
}

.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-duration: .1s, .2s;
}

.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-duration: .1s, .2s, .3s;
}
```

  


上面代码中过渡持续时间（`transition-duration`）和过渡属性（`transition-property`）之间的对应关系如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cdaccbf4c8a4a82a9ebbe0db6ca22fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2234&s=1280702&e=jpg&b=161719)

  


如果过渡持续时间列表更长（比过渡属性列表长），那么多出来的过渡持续时间会被忽略。例如：

  


```CSS
.element {
    transition-property: color, translate;
    transition-duration: .1s, .2s, .3s;
}
```

  


上面示例中的 `.3s` 过渡持续会被忽略，其中 `.1s` 对应的是 `color` 属性过渡，`.2s` 对应的是 `translate` 属性过渡，`.3s` 找不到相对应的过渡属性，因此被忽略不计。

  


该特性在某些情境中是非常有用的，比如：

  


```CSS
.element {
    background-color: #09f;
    border-radius: 4px;
    transition: 
        background-color 1s,
        border-radius .75s,
        scale .5s,
        translate .25s;
    
    &:hover {
        background-color: #f36;
        border-radius: 18px;
        scale: 1.5;
        translate: 0 -10px;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14011c147dec4d379e1a657d110d6835~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1324&h=348&s=2983748&e=gif&f=259&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/eYxVvrN

  


上面这个示例还无法展示出多个过渡动画持续时间的魅力所在，后面我们在介绍过渡持续时间的时候，回过头来优化该示例，我们在过渡动画上也能实现类似于 [CSS 的 steps() 步阶缓动函数创建的分段动画效果](https://juejin.cn/book/7288940354408022074/section/7301594361152667698)。

  


### 关键帧动画的持续时间

  


对于 CSS 关键帧动画，通常使用 `animation-duration` 或它的简写属性 `animaiton` 给动画设置持续时间。例如：

  


```CSS
@keyframes slide {
    to {
        translate: 100px;
    }
}
.element {
    animation-duration: 2s; /* 持续时间为2秒 */
    animation-name: slide; /* 动画名称为slide，需要事先定义该动画 */
}
```

  


关键帧动画的持续时间是指该动画完成一个周期所需的时间，即完成 `@keyframes` 中定义的动画。

  


`animation-duration` 和 `transition-duration` 一样，如果未指供值，则使用默认值 `0` 。它和过渡动画的持续时间有所不同，即使未显式给动画指定持续时间，关键帧动画仍然会执行，它会触发 `animationStart` 和 `animationEnd` 事件。

  


另外，如果 `transition-duration` 为 `0` 时，过渡动画不具有平滑过渡的效果，两个状态的属性变化将是瞬间的。关键帧动画在这一种也有所不同。如果 `animation-duration` 为 `0` 时，动画是否可见取决于 `animation-fill-mode` 的值，而 `animation-fill-mode` 的表现又受到 `animaiton-direction` 属性的影响。我们来看一个简单的示例：

  


```CSS
@keyframes ani {
    to {
        translate: 1000px;
        border-radius: 50%;
    }
}

.animated {
    animation: ani var(--animation-duration, 0s) var(--animation-fill-mode, none) var(--animation-direction, normal);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd23ea66e3f44ac9578ffa7abcffb17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=430&s=2280110&e=gif&f=806&b=32062f)

  


> Demo 地址：https://codepen.io/airen/full/xxMYWGQ

  


不难发现，如果 `animation-duration` 为 `0` 时，`animation-fill-mode` 和 `animatin-direction` 取不同值时，关键帧动画最终位置是有所不同的：

  


-   如果 `animation-fill-mode` 设置为 `forwards` 或者 `both` ，并且 `animation-direction` 设置为 `normal` 或者 `alternate` ，那么动画将会显示最后一帧
-   如果 `animation-fill-mode` 设置为 `forwards` 或者 `both` ，但 `animation-direction` 设置为 `reverse` 或者 `alternate-reverse` ，那么动画将会显示第一帧
-   如果 `animation-fill-mode` 设置为 `backwards` ，不管 `animation-direction` 设置为任何值，动画始终显示第一帧
-   如果 `animation-fill-mode` 设置为 `none` ，动画将不会有任何视觉效果

  


注意，如果 `animation-duration` 不为 `0` 时，那么关键帧动画将会有一个平滑的运动过程。动画元素最终保持的状态也将受到 `animation-fill-mode` 和 `animation-direction` 属性值的影响。有关于这方面的详细阐述，将会在介绍 `animation-fill-mode` 和 `animation-direction` 课程中阐述，这里我们还是专注于动画的持续时间吧。

  


关键帧的持续时间与过渡动画持续还有一点有所不同。过渡动画持续时间周期对应的是过渡属性初始状态到结束状态，而关键帧的持续时间周期对应的是 `@keyframes` 。我们来看一个简单的示例：

  


```CSS
@layer animation {
    @keyframes ani {
        50% {
            scale: .5;
        }
        to {
            translate: calc(60vw - 1.25rem);
            rotate: 360deg;
            scale: 1.1
        }
    }
    .animated {
        animation: ani var(--animation-duration, 1s) infinite;
    }
} 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb2aa31553164174b1a558ef2f549558~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1438&h=340&s=380276&e=gif&f=72&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/MWLQVOX

  


正如上图所示，整个时间轴上只有 `.animated` 元素运用的 `ani` 关键帧，并不像过渡动画那样，会把所有过渡属性在时间轴上呈现出来。在这个示例中，`ani` 有三个关键位置，初始位置 `0%` 或 `from` （示例中未显示定义，它对应的是 `.animated` 元素相应属性的初始值），`50%` 和 `to` （或 `100%`）。这意味着，示例中的 `ani` 与下面这个显式设置 `from` 的关键帧是等同的：

  


```CSS
/* 未显示设置 from 或 0% 的 ani 关键帧 */
@keyframes ani {
    50% {
        scale: .5;
    }
    to {
        translate: calc(60vw - 1.25rem);
        rotate: 360deg;
        scale: 1.1
    }
}

/* 等同于（显式设置 from 或 0% 的 ani 关键帧）*/
@keyframes ani {
    from {
        translate: 0; /* 或 none */
        rotate: 0deg; /* 或 none */
        scale: 1;    /* 或 none */
    }
    50% {
        scale: .5;
    }
    to {
        translate: calc(60vw - 1.25rem);
        rotate: 360deg;
        scale: 1.1
    }
}
```

  


我们通过 `animation-duration` 属性给 `ani` 关键帧动画设置了一个持续时间 `1s` ，即动画的一个周期所花费的时间是 `1s` 。由于示例动画设置了无限次循环播放，因此关键帧动画在完成第一个时间周期时，会重新播放。因此，你会发现在时间轴上有无限个 `0s ~ 1s` 的过程。

  


我们忽略时间轴上循环的次数不看，仅看关键帧的第一个时间周期，即 `0s` 到 `1s` 这个过程。你会发现时间轴在这个周期中存在三个节点。这三个节点分别对应的是 `@keyframes` 中的百分比选择器。就上面这个示例而言，`@keyframes` 中的：

  


-   `from` 或 `0%` 对应的是持续时间周期的 `0%` 位置，也就是 `0s` 时间位置
-   `50%` 对应的是持续时间周期的 `50%` 位置，也就是 `.5s` 时间位置
-   `to` 或 `100%` 对应的是持续时间周期的 `100%` 位置，也就是 `1s` 时间位置

  


我们可以用下图来描绘整个动画的时序：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a80f0e296c3b4f64844958134813da27~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1331&s=807014&e=jpg&b=282b3e)

  


这出再次验证，CSS 的 `@keyframes` 中的百分比选择器，它们是相对于动画的持续时间计算的。[这一点在介绍 @keyframes 有详细阐述过](https://juejin.cn/book/7288940354408022074/section/7295617447058407474)，这里就不再重复阐述。

  


CSS 的 `animation-duration` 和 `transiiton-duration` 类似，也可以在 `animation-duration` 属性上指定多个值。只不过，当 `animation-duration` 属性指定多个持续时间时，每个持续时间将映射到 `animation-name` 属性指定的关键帧（动画名称上）。例如：

  


```CSS
.animated {
    animation-name: translate, rotate, scale;
    animation-duration: 1s;
    
    /* 等同于 */
    animation-duration: 1s, 1s, 1s;
}

.animated {
    animation-name: translate, rotate, scale;
    animation-duration: 1s, 2s;
    
    /* 等同于 */
    animation-duration: 1s, 2s, 1s;
}

.animated {
    animation-name: translate, rotate, scale;
    animation-duration: 1s, 2s, 3s; /* 每个关键帧动画有相应的持续时间 */
}

.animated {
    animation-name: translate, rotate, scale;
    animation-duration: 1s, 2s, 3s, 4s;
    
    /* 等同于 */
    animation-duration: 1s, 2s, 3s; /* 持续时间 4s 没有相应的关键帧动画，将会被忽略 */
}
```

  


比如上面的示例，我们把单个的 `ani` 关键帧动画分拆为三个关键帧动画，分别是 `translate` 、`rotate` 和 `scale` ，并且应用不同的持续时间，比如 `1s` 、`2s` 和 `3s` ：

  


```CSS
@keyframes translate {
    to {
        translate: calc(60vw - 1.25rem);
    }
}

@keyframes rotate {
    to {
        rotate: 360deg;
    }
}

@keyfrmaes scale {
    50% {
        scale: .5;
    }
    
    to {
        scale: 1.1;
    }
}

.animated {
    animation-name: translate, rotate, scale;
    animation-duration: 1s, 2s, 3s;
}
```

  


这个时候，`.animated` 元素同时应用也三个不同的关键帧动画，并且动画的持续时间不一致。该示例对应的时序图也将有所不同：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e33f5e7dc8b74244aace3bcca8aa51bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1438&h=414&s=514587&e=gif&f=59&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/PoVQaQM

  


很明显，上例中的时间轴上有三个关键帧动画，它们分别是 `translate` 、`rotate` 和 `scale` ，并且它们的时间周期也有所不同：

  


-   `translate` 关键帧动画的持续时间周期是 `1s` ，对应的关键帧只有 `from` 和 `to` ，并且以 `1s` 为一个周期，不断循环
-   `rotate` 关键帧动画的持续时间周期是 `2s` ，对应的关键帧也只有 `from` 和 `to` ，并且以 `2s` 为一个周期，不断循环
-   `scale` 关键帧动画的持续时间周期是 `3s` ，对应的关键帧分别是 `from` 、`50%` 和 `to` ，并且以 `3s` 为一个周期，不断循环

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bed7d656ce5344a698b44ef582f32e06~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1592&s=848216&e=jpg&b=282b3e)

  


就这个示例而言，关键帧 `scale` 动画播放一次时，`rotate` 动画播放了两次，`translate` 动画播放了三次。

  


### 动画持续时间最佳实践

  


动画的速度对于可用性至关重要。如果过快，可能难以观察或令人晕眩；如果过慢，可能会显得冗长，给用户一种延迟的感觉。其中动画持续时间又是决定动画速度的关键要素，例如，在相等的距离情况下，如果持续时间太短将会导致动画速度过快；反之又会导致动画过慢。因此，我们在给动画设置持续时间时，应该找到一个最为匹配的时间点。

  


我们可以根据一些实践法则来给动画设置一个合理的持续时间。

  


当元素改变它们的状态或位置时，动画的持续时间应该足够慢，以便用户有可能注意到变化，但同时也应该足够快，不至于用户感到等待。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a86e977d912941a9a3d209083ea55eea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=575672&e=gif&f=66&b=fbebea)

  


许多研究发现，用户界面上的动画最佳速度在 `200ms ~ 500ms` 之间。这些数字基于人脑的特定特性。任何时间短于 `100ms` 的动画都是瞬时的，根本不会被察觉。而持续时间超过 `1s` 的动画会给用户一种延迟的感觉，因此变得乏味。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/455fa1b0b50e4fe1880569770e241b3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=750439&e=gif&f=78&b=e4eef9)

  


当然，动画持续时间设置为多少更为合理，还应该取决于动画的复杂性以及元素的移动距离。作为经验法则，寻找能够在没有刺眼感的情况下完成动画的最短时间。相比过短，动画过长的情况更为常见。

  


[Material Design](https://material.io/design/motion/speed.html#duration) 在这方面做过大量的研究和实践，该指南建议我们在移动设备上，动画的持续时间限制在 `200ms ~ 300ms` 之间为佳。至于平板电脑，持续时间应该比移动设备长 `30%` 左右，大约在 `400ms ~ 450ms` 之间。其中原因是，平板电脑的屏幕尺寸较大，因此在对象改变位置时需要克服更长的距离。对于可穿戴设备，动画的持续时间应该相应缩短 `30%` 左右，大约在 `150ms ~ 200ms` 之间，因为在较小的屏幕上移动的距离较短。这也符合更长的距离需要用时更长，更短的距离用时更少的运动规律，也更符合现实生活中物体运动法则。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/791968a50d9841ef92ca87d7942f634c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=451947&e=gif&f=61&b=e4eef9)

  


Web 动画的处理方式有所不同。由于我们习惯于在浏览器中立即打开网页，我们也希望在不同状态之间快速切换。因此，Web 过渡的持续时间应该大约比在移动设备上短两倍，介于 `150ms ~ 200ms` 之间。在其他情况下，用户会不可避免地认为计算机死机或网络连接有问题。

  


但是，如果你正在为网站创建装饰性动画或试图引起用户对某些元素的注意，则可以忽略这些规则。在这些情况下，动画的持续时间可以更长。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cecc48a7ea184d0e80e75de736efe9a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=79239&e=gif&f=10&b=e4eefa)

  


你还需要记住，无论平台如何，动画的持续时间都不仅仅取决于移动的距离，还应该取决于对象的大小。较小的元素或具有较小变化的动画应移动得更快。因此，对于具有大型和复杂元素的动画，动画持续时间稍长会看起来更好。

  


在相同大小的移动对象中，最先停止的是已经移动的最短距离的对象。与大型对象相比，相对较小的对象移动得较慢，因此它们产生更大的偏移距离。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d7748ef2ca840a0a21bae49083c5e93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=336761&e=gif&f=24&b=e4eefa)

  


当运动物体发生碰撞时，碰撞的能量必须根据物理法则均匀分配给它们。因此，最好排除弹跳效果。只在确实有意义的特殊情况下使用它（避免使用弹跳效果，因为它会分散注意力）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3aed9033b5b34e78aa1adfb4c61daab7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=337386&e=gif&f=59&b=fceeed)

  


我们一起来看几个简单而又更贴近我们生活的用例。

  


对于简单的反馈动画，比如显示复选框或切换开关，总持续时间应该大致为 `100ms` 。这个持续时间对用户来说感觉是立即的，创建了物理操纵对象的错觉。`100ms` 位于可察觉运动的较低端，几乎感觉像是从一个位置瞬间跳到另一个位置，但足以使反馈引人注目。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b471d92ff8b74f03afee12e0dc860a3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1200&s=1816451&e=gif&f=22&b=fefefe)

当动画涉及屏幕发生较大变化时，比如模态框移入视图，`200ms ~ 300ms` 的持续时间可能是合适的。元素需要移动的距离越远，保证平稳且不刺眼就越重要（特别是对于对运动敏感的人，比如癫痫障碍的用户）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf2d592af81e4447b18ccf2277e631d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1940&h=920&s=986371&e=gif&f=97&b=fefdfd)

  


请注意，对象出现或进入屏幕的动画通常需要比对象消失或退出屏幕的动画略长的持续时间：弹出窗口可能需要 `300ms` 来出现，但只需要 `200ms` 或 `250ms` 来消失。

  


再来看一个列表项相关的动画，列表项在出现之间应该有很短的延迟。新列表项的每次出现应该持续 `20ms ~ 25ms` 。元素出现的速度慢可能会让用户感到烦恼。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51f026f1336a477d9783c2f2143801f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=960&s=494535&e=gif&f=87&b=fdf3f3)

  


综上所述，我们在给动画设置持续时间时，可以按照即时、快速（一般针对小的元素或更改）和慢、缓慢（一般针对大型元素或更改）来设置动画的持续时间。如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a3115ee6f014c98b117157d9d6bef13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=745&s=64658&e=jpg&b=fefbfb)

  


-   对于淡入淡出和颜色动画，使用几乎瞬时的持续时间（小于 `100ms`）
-   对于简单效果和相对较小的动画，使用较短的持续时间，大约在 `100ms ~ 300ms` 。还可以用于用户发起的需要反馈的操作，例如触摸、点击和滑动等
-   对于更复杂的效果和较大规模的动画（如页面过渡或屏幕内外的对象移动），使用较长的持续时间（大于 `300ms`）
-   保留慢动画（大于 `500ms`）用于大幅移动和影响氛围的背景元素

  


总体来说，动画的持续时间应该在短而明确的原则下，根据具体的使用场景和用户体验的要求进行调整。

  


注意，动画持续时间不是影响动画速度的唯一要素，除了运动距离，物体大小之外，还有缓动函数也会影响动画速度。例如，一样大小的元素，在相等的距离，同样的持续时间之下，动动元素应用的缓动函数不同，最终动画元素运动的速度（动画速度）也将不同。这个观点，曾在介绍 [CSS 缓动函数基础](https://juejin.cn/book/7288940354408022074/section/7297493957557092404#heading-0)时有过阐述，这里不再做相关的、重复性阐述。

  


## 动画延迟时间

  


想象一下，你在电影院等待一部即将开始放映的电影。在这个场景中，CSS 动画（关键帧动画和过渡动画）的延迟时间就像是电影开始播放之前的等待时间。

  


假设你提前到达电影院，但是电影还没有开始。这段等待时间就是动画的延迟时间。在这段时间内，你可能会看到一睦信息画面、广告片或者预告片，但正片尚未开始。这个延迟时间给了观众准备坐好、找到座位的时间，就像 CSS 动画的延迟时间给了元素准备好开始动画的时间。

  


同样地，CSS 动画的延迟时间是指动画开始执行之前等待的时间长度。在这段延迟时间内，元素保持原始状态，直到延迟时间结束，然后动画开始按照定义的规则进行播放。这就使得页面上的元素可以在一定的时间间隔后逐渐进行动画，而不是立即开始，为用户提供更流畅和令人愉悦的体验。

  


### 过渡动画的延迟时间

  


在 CSS 中， 通常使用 `transition-delay` 或其简写属性 `transition` 属性给过渡动画指定延迟时间。现在，让我们使用过渡动画来模拟开关灯的情况。你定义了过渡效果，使灯光在状态改变时产生过渡效果。同样，你可以设置过渡的延迟时间，就像在按下开关后等待一段时间再开始过渡。

  


```CSS
.lamp {
    opacity: .25;
    transition: opacity 1s ease-out 0.5s; /* 过渡效果：1秒，延迟0.5秒开始 */
}

.lamp--on {
    opacity: 1; /* 开关打开后，灯光立即变亮 */
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6cb8d6f61d849308c2274d0af9c8468~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=332&s=1125509&e=gif&f=180&b=222222)

  


> Demo 地址：https://codepen.io/airen/full/abXqQRr

  


在这个例子中，过渡动画通过 `transition` 属性（也可以使用其子属性 `transition-delay`）定义过渡动画的延迟时间。当灯光状态从关闭（`opacity: .25`）变为打开（`opacity: 1`）时，将产生 `1s` 的过渡效果，但在按下开关后，灯光会延迟 `0.5s` 开始执行。

  


也就是说，当你按下开关那刻开始计算，`0.5s` 之后，灯光才由暗（关闭状态，即 `opacity: .25`）平滑过渡到亮（打开状态，即 `opacity: 1`）。

  


你会发现，显示指定延迟时间的过渡动画，在时间轴上会有一个明显的等待时间。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0707b9b9ad834711901abe7e58318c04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1331&s=555339&e=jpg&b=282b3e)

  


和持续时间类似，我们可以在 `transition-delay` 属性上指定多个过渡延迟时间，并且以逗号分隔。当 `transition-delay` 指定多个过渡延迟时间时，每个过渡延迟时间会被应用到由 `transition-property` 指定的对应属性上。如果指定的过渡延迟时间（`transition-delay`）个数小于属性个数（`transition-property` 指定的过渡属性），那么过渡延迟时间的列表就会重复，反之要是过渡延迟时间个数大于属性个数，则多出来的过渡延迟时间会忽略不计。例如：

  


```CSS
.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-delay: .5s;
    
    /* 等同于 */
    transition-delay: .5s, .5s, .5s, .5s, .5s;
}

.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-delay: .5s, 1s;
    
    /* 等同于 */
    transition-delay: .5s, 1s, .5s, 1s, .5s;
}

.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-delay: .5s, 1s, 1.5s;
    
    /* 等同于 */
    transition-delay: .5s, 1s, 1.5s, .5s, 1s;
}

.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-delay: .5s, 1s, 1.5s, 2s;
    
    /* 等同于 */
    transition-delay: .5s, 1s, 1.5s, 2s, .5s;
}

.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-delay: .5s, 1s, 1.5s, 2s, 2.5s;
    
    /* 等同于 */
    transition-delay: .5s, 1s, 1.5s, 2s, 2.5s;
}

.element {
    transition-property: color, translate, scale, rotate, opacity;
    transition-delay: .5s, 1s, 1.5s, 2s, 2.5s, 3s;
    
    /* 等同于 */
    transition-delay: .5s, 1s, 1.5s, 2s, 2.5s; /* 3s 将会被忽略 */
}
```

  


利用该特性，我们也可以实现一个分段的过渡动画。例如：

  


```CSS
.element {
    background-color: #09f;
    transition: 
        background-color 1s,
        translate 1s 1s,
        rotate 1s 2s,
        scale 1s 3s;
        
    &.player {
        background-color: #f36;
        translate: 100px;
        rotate: 315deg;
        scale: .65; 
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d44b08bed624f58b40755a69f3ba3bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=272&s=2531914&e=gif&f=351&b=232323)

  


> Demo 地址：https://codepen.io/airen/full/poGaGNg

  


在这个示例中，通过使用逗号将多个过渡效果连接在一起，并且为每个过渡效果指定不同的过渡延迟时间，创建了一个类似关键帧动画中多步动画效果。从其时序图中，不难发现。当 `.element` 元素的过渡动画被触发时（通过省添加一个 `.player` 类触发），它会由以下几个过渡效果组成一个多步过渡效果：

  


-   首先，`.element` 元素的背景颜色（`background-color`）会以 `1s` 的时长（持续时间）从 `#09f` （初始状态）平滑过渡到 `#f36` （结束状态）
-   `1s` 之后（刚好 `background-color` 过渡完成） ，元素 `.element` 会从初始位置（`translate: 0`）平滑向右移动 `100px` （`translate: 100px`），这个过渡也持续 `1s` 时间。它相对于最初的 `background-color` 过渡动画延迟了 `1s`
-   刚好 `translate` 过渡动画执行完之后（也是 `1s`），元素 `.element` 会花费 `1s` 的时间，从 `0deg` 旋转到 `315deg` 。它相对于最初的 `background-color` 过渡动画延迟了 `2s` ，相对于 `translate` 过渡动画延迟了 `1s`
-   最后（也就是 `3s`）元素缩小到 `.65` （`scale` 从 `1` 过渡到 `.65`），整个过程也花费 `1s` 时间。它相对于最初的 `background-color` 过渡动画延迟了 `3s` ，相对于 `translate` 过渡动画延迟了 `2s` ，相对于 `rotate` 过渡动画延迟了 `1s`

  


也就是说，通过这种方式，我们可以更加炫酷地对过渡动画进行编排，增加额外的动作。例如，通过多个过渡属性与过渡延迟时间使按钮在悬停状态下具有多步过渡动画效果。

  


```HTML
<button>
    Welcome CSS.<span>Transition Is Cool.</span>
</button>
```

  


```CSS
@layer demo {
    button {
        border: 5px solid transparent;
        background: #aed6d1;
        color: #333;
        border-radius: 999rem;
        padding: 15px 30px;
        overflow: hidden;
        width: 200px;
        cursor: pointer;
        white-space: nowrap;
        text-indent: 23px;
        font-weight: bold;
        
        transition: all 1.2s, border 0.5s 1.2s, box-shadow 0.3s 1.5s;
        
        & span {
            display: inline-flex;
            font-weight: normal;
          
            translate: 100%;
            opacity: 0;
            transition: opacity 0.1s 0.5s, translate 0.4s 0.5s;
        }
        
        &:hover {
            text-indent: 0;
            background: #55706d;
            color: #ffe8a3;
            width: 300px;
            border: 10px solid #8dccc4;
            box-shadow: 3px 3px 2px color-mix(in oklch, #000, transparent 85%);
          
            & span {
                translate: 0;
                opacity: 1;
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c94813b07e142ceb6e784738be20cf0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1416&h=526&s=5211070&e=gif&f=339&b=2b405e)

  


> Demo 地址：https://codepen.io/airen/full/MWLQxwO

  


我们还可以给 `transition-delay` 属性指定一个负值。如果给过渡动画指定一个负的延迟时间，过渡动画会立即执行。例如下面这个示例，三个元素的背景颜色 `background-color` 都是用时 `3s` 从 `red` 过渡到 `lime` 颜色，只不过它们的延迟时间分别是 `0` 、`1.5s` 和 `-1.5s` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1204bb26c0dc4c8a8b3b0961142240f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=570&s=4355017&e=gif&f=246&b=fefcfb)

  


  


> Demo 地址：https://codepen.io/airen/full/ZEwxWmK

你会发现，第一个元素（最顶上的）的过渡动画会立即执行，它会有一个平滑过程，这个过程会持续 `3s` ；第二个元素（中间的）的过渡动画会延迟 `1.5s` 后才执行，它也会有一个平滑过程，这个过程也会持续 `3s` ；第三个元素（最下面的）则有所不同，其过渡动画会立即执行，并且 `background-color` 属性的值从 `red` 更改到 `lime` 是瞬间的，内眼很难看到它有一个平滑过渡的效果。

  


从 [W3C 规范](https://www.w3.org/TR/css-transitions-1/#transition-delay-property)中，我们可以获知，过渡动画的延迟时间为负值时，过渡动画的执行并不是从头开始，而是从过渡动画执行了延迟时间的那一刻开始执行。也就是说，过渡似乎会在其播放周期的某个阶段开始。如果过渡具有隐含的起始值并且具有负的 `transition-delay` ，则起始值将从属性更改的时刻获取。例如下面这个示例：

  


```HTML
<!-- transition-delay: 0s -->
<div class="container">
    <div class="animated ani1" style="--delay: 0s; --bg: #09eafc"></div>
</div>

<!-- transition-delay: 2s -->
<div class="container">
    <div class="animated ani2" style="--delay: 2s; --bg: #f36afc"></div>
</div>

<!-- transition-delay: -2s -->
<div class="container">
    <div class="animated ani3" style="--delay: -2s; --bg: #f3590a"></div>
</div>

<!-- transition-delay: -8s -->
<div class="container">
    <div class="animated ani4" style="--delay: -8s; --bg: #4aecdf"></div>
</div>
```

  


```CSS
@layer animation {
    .animated {
        translate: 0;
        transition: translate 6s var(--delay);
    
        &.player {
            translate: 600px;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dc18add2a13470682a7af0f0ff3f20e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1418&h=546&s=5601551&e=gif&f=691&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/ExrQMbG

  


你会发现，设置延迟时间为 `-2s` 的元素，它的位置瞬间就到了大约 `350px` ，然后执行过渡动画，离开时的效果也一致；而设置延迟时间为 `-8s` 的元素，它的位置瞬间就到了 `600px` （结束状态），看不到任何过渡的效果。这个就是 `transition-delay` 属性传递负值的效果。

  


如果 `transition-delay` 负值应用妥，能给过渡动画带来更协调的，更优雅的效果。比如下面这个效果，左侧的悬浮效果是使用的正延迟时间，右侧的悬浮效果是使用的负延迟时间。虽然它们都是一个错落有致的效果，但右则的整体效果会让你感到更舒服一些：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d17071118e7341eb8febe07ceba950e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=490&s=1064424&e=gif&f=609&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/poGLbOL

  


在上例的基础上，只要稍微调整一下过渡动画相关的参数，你将得到更别致的悬浮效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb32e63c15484f71a17cecb8aa86c9f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=516&s=765754&e=gif&f=429&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/eYxMdYx

  


想象一下，如果按钮上不只是这几个点，那是不是可以模拟一个简单的粒子效果呢？感兴趣的同学不妨一试。

  


### 关键帧动画的延迟时间

  


我们继续以生活中开关灯的场景来解释 CSS 关键帧动画的延迟时间。

  


想象一下你进入一个房间，想要通过一个 CSS 关键帧动画模拟灯光的逐渐变亮效果。你定义了关键帧，描述了灯光从暗到亮的过程。在这个过程中，你可以设置一个延迟时间，就像按下灯光开关后，灯光并不会立即变亮，而是在一段时间后逐渐变亮。

  


```CSS
@keyframes lightUp {
    to {
        opacity: 1; /* 最终状态：完全亮起 */
    }
}

.lamp {
    opacity: .25; /* 最初状态：灯光未点亮 */
    animation: lightUp 2s ease-out 1s; /* 动画持续 2s，延迟 1s 开始 */
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a96e1efa82b432a8ea4d736e1dcd9d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1382&h=348&s=1554163&e=gif&f=233&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/XWOEjpv

  


在这个例子中，通过 `animation` 属性（或者其子属性 `animation-delay` ）给关键帧动画 `lightUp` 指定了一个延迟时间（`animation-delay: 1s`）。当你按下开关那个开始计算，`1s` 之后，灯光才由暗逐渐变亮（执行 `lightUp` 关键帧动画的过程），并且这个过程持续了 `2s` （`animation-duration: 2s`）。由于 `animation-fill-mode` 属性设置为 `both` ，所以 `lightUp` 动画执行完之后，动画元素停留在关键帧的最后一帧的状态，因此你看到的灯一直是亮着的状态。

  


就这个示例的动画效果而言，从等待时间（动画的延迟时间是 `1s`），再到执行完动画（动画的持续时间是 `2s`），总共用时 `3s` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be9ec8b55bec49768affb756f6199dd6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1331&s=538884&e=jpg&b=282b3e)

  


和持续时间类似，我们可以在 `animation-delay` 属性上指定多个延迟时间，并且以逗号分隔。当 `animation-delay` 指定多个延迟时间时，每个延迟时间会被应用到由 `animation-name` 指定的对应关键帧动画上。如果指定的延迟时间（`animation-delay`）个数小于关键帧个数（`animation-name` 指定的关键帧动画），那么延迟时间的列表就会重复，反之要是延迟时间个数多于关键帧个数，则多出来的延迟时间会忽略不计。例如：

  


```CSS
.element {
    animation-name: color, translate, scale, rotate, opacity;
    animation-delay: .5s;
    
    /* 等同于 */
    animation-delay: .5s, .5s, .5s, .5s, .5s;
}

.element {
    animation-name: color, translate, scale, rotate, opacity;
    animation-delay: .5s, 1s;
    
    /* 等同于 */
    animation-delay: .5s, 1s, .5s, 1s, .5s;
}

.element {
    animation-name: color, translate, scale, rotate, opacity;
    animation-delay: .5s, 1s, 1.5s;
    
    /* 等同于 */
    animation-delay: .5s, 1s, 1.5s, .5s, 1s;
}

.element {
    animation-name: color, translate, scale, rotate, opacity;
    animation-delay: .5s, 1s, 1.5s, 2s;
    
    /* 等同于 */
    animation-delay: .5s, 1s, 1.5s, 2s, .5s;
}

.element {
    animation-name: color, translate, scale, rotate, opacity;
    animation-delay: .5s, 1s, 1.5s, 2s, 2.5s;
    
    /* 等同于 */
    animation-delay: .5s, 1s, 1.5s, 2s, 2.5s;
}

.element {
    animation-name: color, translate, scale, rotate, opacity;
    animation-delay: .5s, 1s, 1.5s, 2s, 2.5s, 3s;
    
    /* 等同于 */
    animation-delay: .5s, 1s, 1.5s, 2s, 2.5s; /* 3s 将会被忽略 */
}
```

  


为不同元素上应用的关键帧动画指定不同的延迟时间，我们可以很容易就制作出像下图这样的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e1f02ff4dbd4bb88519aceb581da917~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=634&s=1821234&e=gif&f=294&b=fefefe)

  


你需要一个类似下面这样的 HTML 结构：

  


```HTML
<ul class="lists">
    <li class="item">
        <div class="list__icon" style="--delay: 0s;">
            <svg> </svg>
        </div>
        <div class="list__content" style="--delay: 0.8s;">
            <h4>Basic design skills</h4>
            <p>Read 15 lectures...</p>
        </div>
    </li>
    <li class="item">
        <div class="list__icon" style="--delay: 1.6s;">
            <svg> </svg>
        </div>
        <div class="list__content" style="--delay: 2.4s;">
            <h4>Composition principles</h4>
            <p>We discover classic ...</p>
        </div>
    </li>
    <li class="item">
        <div class="list__icon" style="--delay: 3.2s;">
            <svg> </svg>
        </div>
        <div class="list__content" style="--delay: 4.0s;">
            <h4>Being confident in graphic software</h4>
            <p>Be qualified! We...</p>
        </div>
    </li>
  </ul>
```

  


注意，我们在 `.list__icon` 和 `.list__content` 所对应的 HTML 标签上使用内联样式定义了 `--delay` ，用来设置每个动画元素的延迟时间。从上图效果不难发现，从第一个列表中的内容开始，每个动画元素都会延迟出现，在这里我将延迟时间设置为 `.8s` 。

  


使用 CSS 定义两个关键帧动画，并应用到相应动画元素上：

  


```CSS
@layer animation {
    /* 用于列表标记 .list__icon */
    @keyframes zoomIn {
        to {
          scale: 1;
          opacity: 1;
        }
    }
  
    /* 用于列表内容 .list__content */
    @keyframes fadeInLeft {
        to {
            opacity: 1;
            translate: 0;
        }
    }
  
    .list__icon {
        /* 初始状态 */
        opacity: 0;
        scale: 0;
        
        animation: zoomIn 2s cubic-bezier(0.19, 1, 0.22, 1) var(--delay) both;
    }
  
    .list__content {
        /* 初始状态 */
        opacity: 0;
        translate: 100px;
        
        animation: fadeInLeft 1s cubic-bezier(0.19, 1, 0.22, 1) var(--delay) both;
    }
}
```

  


你最终看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e3c8ab390c47978988596c2af15d3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=502&s=3361794&e=gif&f=240&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/NWoYRee

  


通常情况下，`animation-delay` 接受一个正值，表示关键帧动画延迟开始的时间。然而，你也可以使用负值，这里它不再表示延迟，而是成为一个偏移量。在这种情况下，关键帧动画会立即开始，但会在指定的时间偏移内自动进行，就好像动画在过去的某个时间点开始一样，因此看起来是在活跃的持续时间中间开始的。这个特性允许你更灵活地控制动画的启动时机。

  


使用负动画延迟，可以使错开动画看起来更加自然。比如，我们有一组元素，我们希望它们依次循环播放动画，类似一个波浪形动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660e5153e40548dea7966103d424e38d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=596&s=1045786&e=gif&f=66&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/YzBaZBr

  


示例中使用一个与元素索引直对应的自定义属性 `--index` 来计算它们的 `animation-delay` 值：

  


```HTML
<h1>
    <span style="--i: 0"><span>H</span></span>
    <span style="--i: 1"><span>E</span></span>
    <span style="--i: 2"><span>L</span></span>
    <span style="--i: 3"><span>L</span></span>
    <span style="--i: 4"><span>O</span></span>
    <span style="--i: 5"><span>C</span></span>
    <span style="--i: 6"><span>S</span></span>
    <span style="--i: 7"><span>S</span></span>
</h1>
```

  


```CSS
@layer animation {
    @keyframes bounce {
        0% {
            translate: 0 0 0;
            rotate: y 0deg;
            scale: 1 1;
            animation-timing-function: ease-in;
        }
        45% {
            translate: 0 4em 0;
            rotate: y 180deg;
            scale: 1 1;
            animation-timing-function: ease-in;
        }
        50% {
            translate: 0 4em 0;
            rotate: y 180deg;
            scale: 1 0.2;
            animation-timing-function: ease-out, ease-out, linear;
        }
        100% {
            translate: 0 0 0;
            rotate: y 0deg;
            scale: 1 1;
            animation-timing-function: ease-out;
        }
    }

    @keyframes shadow {
        0% {
            translate: 0 3.8em 0;
            scale: 1.5 0.3 1;
            opacity: 0;
            animation-timing-function: ease-in;
        }
        45% {
            translate: 0 3.8em 0;
            scale: 0.8 0.2 1;
            opacity: 1;
            animation-timing-function: ease-in;
        }
        50% {
            translate: 0 3.8em 0;
            scale: 0.8 0.2 1;
            opacity: 1;
            animation-timing-function: linear;
        }
        100% {
            translate: 0 3.8em 0;
            scale: 1.5 0.3 1;
            opacity: 0;
            animation-timing-function: ease-out;
        }
    }
    
    h1 {
        --hue: 60;
    }
    
    span {
        --stagger: -200ms;
        --delay: calc(var(--i) * var(--stagger, 200ms));
        > span {
            animation: bounce 2000ms var(--delay, 0ms) infinite;
            transform-origin: center bottom;
        }
    }

    span:not(span > span)::after {
        translate: 0 3.8em 0;
        scale: 0.8 0.3 1;
        transform-origin: center top;
        animation: shadow 2000ms var(--delay, 0ms) infinite;
    }
}
```

  


`animation-delay` 负值中的负号充当一个信号，告诉浏览器将这个值视为偏移而不是延迟。这意味着动画立即执行，但自动按延迟的绝对值进行推进，就像动画在过去的某个指定时间开始一样，因此似乎是在其活动持续时间的中途开始。如果动画的关键帧有暗示的起始值，这些值将从动画开始的时间取得，而不是从过去的某个时间。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1375e098dea445d989778358db40f8d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=600&s=5991025&e=gif&f=651&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/gOqzGYv

  


如果你指定的偏移量（`animtion-delay`）大于动画单次迭代的持续时间，那一点问题都没有。你的动画将从在迭代中起始点所在的任何点开始。只需要确保你有足够的迭代数来考虑未来迭代中的起始点。如果迭代次数不够，并且你指定了一个较大的偏移量，你的动画就不会运行。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/736b253a1e274b1da396cfdbb91d633e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2624&h=1731&s=1046313&e=jpg&b=282b3e)

  


```HTML
<div class="container">
    <div class="animated ani1" style="--delay: 0s; --bg: #09eafc"></div>
</div>

<div class="container">
    <div class="animated ani2" style="--delay: 2s; --bg: #f36afc"></div>
</div>

<div class="container">
    <div class="animated ani3" style="--delay: -2s; --bg: #f3590a"></div>
</div>

<div class="container">
    <div class="animated ani4" style="--delay: -10s; --bg: #4aecdf"></div>
</div>
```

  


```CSS
@layer animation {
    @keyframes ani{
        from {
            translate: 0;
        }
        to {
            translate: 600px;
        }
    }
  
    .player {
        animation: ani 3s var(--delay) both 3;
    }
}
```

  


在这个示例中，`ani` 循环播放 `3` 次，每次持续时间是 `3s` 。最后一个元素的延迟时间 `-10s` ，它的绝对值大于动画三次循环所用时间（`9s`），你会发现，该元素不会有任何动画效果，它一瞬间就来到 `ani` 关键帧的最终状态（在我们示例中 `animation-fill-mode` 设置为 `both`）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/637a148bb08b4522a6f8786b3b56c7e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=962&h=562&s=2379572&e=gif&f=483&b=30052d)

  


> Demo 地址：https://codepen.io/airen/full/VwgxMmM

  


正如你所看到的，通过 `animation-delay` 属性使动画可以稍后开始、立即从开头开始或立即开始并在动画中途播放。

  


需要知道的是，`animation-delay` 只能延迟动画的启动，但启动后它会持续运行。如果你想在 CSS `@keyframes` 动画的每次迭代之间添加暂停，你可能会发现 CSS 中没有内置的方法来实现这一点。例如，你希望动画运行 `1s` ，然后延迟 `4s` 再次运行。事实证明，要使用 CSS 实现，并不那么直接，庆幸的是可以模拟实现。

  


```CSS
@layer animation {
    @keyframes move {
        20%, 100% {
            translate: calc(100% + 50vw);
            rotate: 360deg;
        }
    }
  
    .ball {
        animation: move 5s infinite ease-in-out;
    }
} 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/051de811dafa4e6d87e286c774da5c3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=418&s=140259&e=gif&f=185&b=4c496b)

  


> Demo 地址：https://codepen.io/airen/full/eYxdjZL

  


再来看一个稍微复杂一点的案例。下面这个流星雨的动画效果是由 [@Yusuke Nakaya](https://codepen.io/YusukeNakaya/full/XyOaBj) 提供的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d6d2518f07d4e388490353bf712277c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=666&s=5153567&e=gif&f=146&b=12171f)

  


> Demo 地址：https://codepen.io/airen/full/gOqzoYM （来源于 [@Yusuke Nakaya](https://codepen.io/YusukeNakaya/full/XyOaBj) ）

  


这效果看上去没什么问题，对吧！但要是将这个效果放在首页的横幅上时，就很有可能会对横幅主内容产生干扰。也就是说，如果我们想使用较少的星星来减少对主内容的干扰，防止 CPU 过热，并仍然使流星看看起来是随机产生的。就需要使用 `@keyframes` 对流星雨的动画做延迟处理：

  


```CSS
@layer animation {
    @keyframes tail {
        /* 动画发生在 0% 和 50% 之间 */
        0% {
            width: 0;
        }
        15% {
            width: 100px;
        }
        /* 动画在 50% ~ 100% 之间暂停（延迟） */
        50%,
        100% {
            width: 0;
        }
    }

    @keyframes shining {
        /* 动画发生在 0% 和 50% 之间 */
        0% {
            width: 0;
        }
        25% {
            width: 30px;
        }
        /* 动画在 50% ~ 100% 之间暂停（延迟） */
        50%,
        100% {
            width: 0;
        }
    }
    
    @keyframes shooting {
        /* 动画发生在 0% 和 50% 之间 */
        0% {
            translate: 0;
        }
        /* 动画在 50% ~ 100% 之间暂停（延迟） */
        50%,
        100% {
            translate: 300px;
        }
    }
    
    .shooting_star {
        animation: 
            tail 6000ms ease-in-out infinite var(--delay),
            shooting 6000ms ease-in-out infinite var(--delay);
    
        &::before {
            animation: shining 6000ms ease-in-out infinite var(--delay);
        }
    
        &::after {
            animation: shining 6000ms ease-in-out infinite var(--delay);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25657851ac9c49ee8b37ed1d0ebe2ae9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=618&s=895878&e=gif&f=99&b=131921)

  


> Demo 地址：https://codepen.io/airen/full/OJdZzyW

  


这种方法涉及找出我们希望在迭代之间设置的延迟时间，然后将关键帧压缩到 `100%` 的一小部分。然后，我们保持动画的最终状态，直到达到 `100%` 以实现暂停。这种方案有一个主要缺点，每个关键帧都必须手动调整，这有点痛苦，而且容易出错。如果需要在头脑中将所有关键帧转换回到 `100%` ，那么理解动画正在执行的操作也会变得更加困难。

  


该方案对于 Web 开发者来说，最困难的是如何将延迟嵌入到关键帧动画中。我们可以通过一些计算，使用关键帧中的百分比来定义动画应该包含多少延迟。例如，如果你设置了动画持续时间为 `1s` ，并在 `0%` 处指定了起始关键帧，然后在 `20%` 处指定了相同的值，将结束关键帧放在 `80%` 处，并在 `100%` 处再次使用相同的结束值，那么你的动画将等待 `0.2s` ，运行 `0.6s` ，然后再等待 `0.2s` 。

  


接下来，我将通过一个简单的案例，与大家一起探讨一下，该方案的关键帧中的百分比该如何定义：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/259b12bfb9474c32b728a7db3c8ad06d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=392&s=231055&e=gif&f=110&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/WNPJMXB

  


在这个示例中，我们希望每个圆点在执行实际动画之间等待 `0.15s` ，动画持续 `0.5s` ，整个过程需要 `1s` 。这意味着第四个圆点的动画等待 `0s` ，然后进行 `0.5` 的动画，再等待 `0.5s` 。第二个圆点等待 `0.15s` ，然后进行 `0.5s` 的动画，再等待 `0.35s` ，依此类推。

  


要实现这一点，你需要四个关键帧（或三对关键帧）：`1` 和 `2` 用于等待延迟，`2` 和 `3` 用于实际动画时间，而 `3` 和 `4` 用于最终等待。“诀窍”在于理解如何将所需的时间转换为关键帧百分比，但这是一个相对简单的计算。例如，第二个圆点要等待 `0.15 x 2 = 0.3s` ，然后进行 `0.5s` 的动画。动画的总持续时间是 `1s` ，所以关键帧百分比的计算如下：

  


```
0s   = 0%
0.3s = 0.3 / 1s * 100 =  30%
0.8s = (0.3 + 0.5) / 1s * 100 = 80%
1s   = 100%
```

  


  


整个动画，包括嵌入到 CSS 关键帧中的交错时间和等待时间，总共正好一秒钟，这样动画就不会失去同步。

幸运的是，Sass 允许我们使用简单的 for 循环和一些内联数学来自动化这个过程，最终编译成一系列的关键帧动画。这样，你可以操纵时间变量来进行实验和测试，找出对你的动画效果最佳的设置：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be44f39fa8454a4bbe606facef09b945~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2624&h=1170&s=386428&e=jpg&b=282b3e)

  


```HTML
<div id="container">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>
```

  


```CSS
@layer animaiton {
    @keyframes dot1 {
        0% {
            translate: 0;
        }
        50%,
        100% {
            translate: 60px;
        }
    }

    @keyframes dot2 {
        0%,
        15% {
            translate: 0;
        }
        65%,
        100% {
            translate: 60px;
        }
    }

    @keyframes dot3 {
        0%,
        30% {
            translate: 0;
        }
        80%,
        100% {
            translate: 60px;
        }
    }

    @keyframes dot4 {
        0%,
        45% {
            translate: 0;
        }
        95%,
        100% {
            translate: 60px;
        }
    }
    
    span {
        animation: dot4 1s infinite;
        
        &:nth-child(1) {
            animation-name: dot4;
        }
        &:nth-child(2) {
            animation-name: dot3;
        }
        &:nth-child(3) {
            animation-name: dot2;
        }
        &:nth-child(4) {
            animation-name: dot1;
        }
    } 
}
```

  


整个动画，包括嵌入到 CSS 关键帧中的交错时间和等待时间，总共正好一秒钟，这样动画就不会失去同步。

  


幸运的是，Sass 允许我们使用简单的 `for` 循环和一些内联数学来自动化这个过程，最终编译成一系列的关键帧动画。这样，你可以操纵时间变量来进行实验和测试，找出对你的动画效果最佳的设置：

  


```SCSS
$animTime: 0.5s;
$totalTime: 1s;
$staggerTime: 0.15s;

@mixin createCircleAnimation($i, $animTime, $totalTime, $delay){   
    @keyframes dot#{$i+1}{
        0%, #{($i * $delay)/$totalTime * 100}%{              
            translate: 0;           
        }         
        #{($i * $delay + $animTime)/$totalTime * 100}%, 100% {     
            translate: 60px;          
        }                    
    }      
}


@for $i from 0 through 3 {
    @include createCircleAnimation($i, $animTime, $totalTime, $staggerTime);     
  
    span:nth-child(#{($i + 1)}){
        animation: dot#{(4 - $i)} $totalTime infinite;
        left: #{$i * 60 - 60 }px;
    }
}
```

  


除此之外，还可以在延迟期间隐藏动画。也就是创建一个新的 `@keyframes` ，负责在延迟期间隐藏动画。然后，将其与原始动画时应用。

  


这种技术的局限性在于动画之间的暂停必须是“暂停”关键帧的整数倍。这是因为无限重复的关键帧将立即再次执行，即使相同的元素上应用了更长时间的运行关键帧。这里有一个使用这种方法在流星之间添加延迟的示例：

  


```CSS
@layer animation {
    @keyframes tail {
        0% {
            width: 0;
        }
        30% {
            width: 100px;
        }
        100% {
            width: 0;
        }
    }

    @keyframes shining {
        0% {
            width: 0;
        }
        50% {
            width: 30px;
        }
        100% {
            width: 0;
        }
    }
    
    @keyframes shooting {
        0% {
            translate: 0;
        }
        100% {
            translate: 300px;
        }
    }

    @keyframes pause-animation {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        50.1% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }

    .shooting_star {
        animation: 
            tail 3000ms ease-in-out infinite var(--delay),
            shooting 3000ms ease-in-out infinite var(--delay),
            pause-animation 6000ms infinite var(--delay);
    
        &::before {
            animation: 
                shining 3000ms ease-in-out infinite var(--delay),
                pause-animation 6000ms infinite var(--delay);
        }
    
        &::after {
            animation: 
                shining 3000ms ease-in-out infinite var(--delay),
                pause-animation 6000ms infinite var(--delay);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b37b7a559c04b5f89a0060b60776f1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1100&h=658&s=1165380&e=gif&f=135&b=12171f)

  


> Demo 地址：https://codepen.io/airen/full/YzBLYVq

  


### 动画延迟时间的作用

  


动画中的延迟时间，它主要有两个方面的作用：

  


-   **控制动画的启动时间**：延迟时间允许你指定动画何时开始执行。通过设置延迟时间，你可以调整动画在应用到元素后等待一段时间，然后再开始执行。这对于创建更自然、流畅的动画效果非常有用，尤其是在处理复杂的页面过渡或用户界面元素时
-   **协调多个动画**：在一个元素上同时应用多个动画时，可以使用延迟时间来协调它们的启动顺序，以达到预期的动画效果。这对于在同一个元素上应用多个过渡或关键帧动画时特别重要，以避免它们同时启动

  


## 案例

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51f1506a0df944e98003401889d6d9c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=440&h=776&s=14844931&e=gif&f=200&b=fdfcfc)

  


上图所展示的是一个真实的案例。它看上去很复杂，但事实上并没有大家想象的那么复杂，它是多个元素同时运用了 CSS 的关键帧动画，并且通过持续时间和延迟时间控制每个元素动画的时序，从而构建了上图这个氛围动画效果。只是很可惜，现在无法找到相关素材来还原该动画。不过，大家不用担心，接下来我将会向大家呈现一些关键帧动画和过渡动画，通过真实的案例，进一步阐述动画持续时间和延迟时间对于动画的重要性。

  


### 交错动画

  


运动在自然界中并不是一次性完成的。想象一下一群鸟飞起、雨滴溅落在地面上，或者树在风中摇曳的情景。这些瞬间的魔力来自许多小运动的重叠和交汇。这种类型的动画被称为交错动画，在 Web 上这种动画类型很常见。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/197f6d3409814e2cb73647a291f59978~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=750&s=7696461&e=gif&f=234&b=05897c)

  


> Demo 地址：https://codepen.io/airen/full/ExrYWbP

  


现如今，CSS 过渡动和关键帧动画都可以很容易实现交错动画效果。我们先来看一个使用 CSS 过渡动画实现的交错动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed490fb2e96348b8871abea7d8caa156~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=456&s=581972&e=gif&f=190&b=2c2b3c)

  


> Demo 地址：https://codepen.io/airen/full/mdvLxjd

  


在这个动画中，它有六个菜单项，最初它们都位置容器的可视区域之外。当用户点击“Show”按钮的时候，会触过渡动画，每个菜单项会逐渐从容器右侧移入。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faffefcb6c094fa8ae41b7d9ab457222~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3370&h=1541&s=779651&e=jpg&b=282b3e)

  


我们可以给相应的元素定义一个自定义属性 `--index` ，该属性的值对应着元素的索引值，这样做有利于我们给动画设置延迟时间。例如：

  


```HTML
<ul class="menu">
    <li style="--index: 1"></li>
    <!-- 省略其它的 li -->
    <li style="--index: 6"></li>
</ul>
```

  


接着通过 `translate: 100%` 将菜单项移出容器，当过渡动画被触发时，再将 `translate` 设置为 `0` ，这样我们就了一个从右向左移入的运动距离。

  


```CSS
li {
    translate: 100%;
    opacity: 0;
    transition: translate .2s ease-out var(--delay), opacity .2s ease-out var(--delay);
}

.player li {
    translate: 0;
    opacity: 1;
}
```

  


由于每个列表项从右向左移入是逐个的过程，因此我们要通过 `calc()` 函数和 `--index` 来计算每个菜单项延迟时间（替代上面代码中的 `--delay`）。假设每个菜单项都比前一个延迟 `0.025s` ，那么很容易得到计算出来的 `--delay` 值：

  


```CSS
li {
    --delay: calc((var(--index) - 1) * 0.025s);
}
```

  


你将看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1035c137430f45fab83eb0667a202a41~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=562&s=291953&e=gif&f=130&b=ffffff)

  


我们在此基础上还可以进一步优化它。当隐藏菜单时，添加一个反转动画。可以通过移除 `.player` 类来实现这一点，但有一个问题。在隐藏时，菜单项应该以相反的顺序动画。比如，第一个菜单项在隐藏时应该是最后一个消失。为了实现这一点，我们需要交换过渡延迟。

  


我们可以通过另一个自定义属性来实现这一点。首先，在 `ul` 上添加一个新的自定义属性，比如 `--length` ，它的值是菜单项的总数量，我们这个示例是 `6` ：

  


```HTML
<ul class="menu" style="--length: 6">
    <li style="--index: 1"></li>
    <!-- 省略其它的 li -->
    <li style="--index: 6"></li>
</ul>
```

  


相应的 CSS 也需要调整一下：

  


```CSS
li {
    /* 这个延迟将在隐藏元素时生效 */
    --delay: calc(0.025s * (var(--length) - var(--index)));
}

.player li {
    /* 这个延迟将在显示元素时生效 */
    --delay: calc(0.025s * (var(--index) - 1));
}
```

  


有了这些改变，我们在隐藏元素时已经反转了动画！第一个菜单项将是第一个显示的，但在隐藏时将是最后一个消失的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1982aa7f85384146862a3065a434eae6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=566&s=430961&e=gif&f=200&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/mdvLxjd

  


我们要是使用关键帧动画来实现上面示例的效果，则需要定义两个关键帧动画，一个是移入，一个是移出，分别将这两个关键帧动画应用到菜单项显示和隐藏上：

  


```CSS
@layer animation {
    /* 移入，菜单项显示的动画 */
    @keyframes slideIn {
        from {
            translate: 100%;
            opacity: 0;
        }
        to {
            translate: 0;
            opacity: 1;
        }
    }
    
    /* 移出，菜单项隐藏的动画 */
    @keyframes slideOut {
        from {
            translate: 0;
            opacity: 1;
        }
        to {
            translate: 100%;
            opacity: 0;
        }
    }
    
    li {
        /* 菜单项隐藏 */
        --delay: calc(0.025s * (var(--length) - var(--index)));
        animation: slideOut .2s ease-out var(--delay) both;
        
        .player & {
            /* 菜单项显示 */
            --delay: calc((var(--index) - 1) * 0.025s);
            animation: slideIn .2s ease-in var(--delay) both;
        }
    }
}
```

  


这几乎和过渡动画的效果是一致的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e86b8c73adc141dfa7322ddff32c2297~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=530&s=268659&e=gif&f=149&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/RwvyyPW

  


再来看一个 Apple Music 应用中的一个动画效果。它的封面是一个明亮的粉色容器，里面装着一堆一个接一个叠放的盒子。盒子一个接一个地以淡入的方式出现在容器的中心，然后以无限循环的方式淡出并缩放到容器的大小。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b2801ed40c7459287e2ca83f03e325b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=290&s=845518&e=webp&f=38&b=22262b)

  


同样使用交错动画的原理来实现上图这样的动画效果。

  


你可能需要一个像下面这样的 HTML 结构，并且同样在盒子元素 `.box` 定义一个自定义属性 `--index`，它主要用于动画延迟的计算：

  


```HTML
<div class="container">
    <div class="content">
        <h1>Hits</h1>
        <p>in Spatial Audio</p>
    </div>
    <div class="box" style="--index: 1;"></div>
    <div class="box" style="--index: 2;"></div>
    <div class="box" style="--index: 3;"></div>
    <div class="box" style="--index: 4;"></div>
    <div class="box" style="--index: 5;"></div>
    <div class="box" style="--index: 6;"></div>
    <div class="box" style="--index: 7;"></div>
    <div class="box" style="--index: 8;"></div>
    <div class="box" style="--index: 9;"></div>
    <div class="box" style="--index: 10;"></div>
</div> 
```

  


核心的 CSS 代码如下：

  


```CSS
@layer animation {
    @keyframes grow {
        from {
            opacity: 0.5;
            scale: 0;
        }
        to {
            opacity: 0;
            scale: 3.85;
        }
    }
    
    .box {
        --delay: calc(var(--index) * 1s);
        animation: grow 10s linear infinite var(--delay);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1299f40860e14cee9a4ede92bc91ac3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=542&s=3039256&e=gif&f=156&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/yLZjqbM

  


### 通过 CSS 动画轴构建多阶段动画

  


多阶段动画可以帮助 Web 应用或网站更加生动，但在 CSS 中编写和维护这样的动画可能会很困难。因此，通常会添加复杂的 JavaScript 库以便更轻松地创建这些动画。其实，我们可以利用[现代 CSS 的一些特性](https://s.juejin.cn/ds/iR4sSNsB/)，比如 [CSS 的自定义属性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)，帮助我们规划纯 CSS 时间轴，用于创建复杂的动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf6beed2eb2944f4b3f6f2168afdce5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=642&s=11485311&e=gif&f=306&b=1f1d1b)

  


我们可以使用这种类型的动画序列来显示隐藏内容。如上图所示，主标题（Heading）、次标题（Subheading）和按钮（Button）等元素的显示应用了不同的动画效果：

  


-   主标题（Heading）：应用了一个从下往上淡入的动画效果（`fadeInUp`），垂直方向的移动距离是 `100px` ，整个动画持续了 `1.1s`
-   次标题（Subheading）：同样应用了与主题一样的动画效果 `fadeInUp` ，只不过它的持续时间是 `0.9s` ，并且延迟了 `0.2s` 开始
-   按钮（Button）：应用了一个放大的动画效果（`zoomIn`），动画持续了 `0.9s` ，并且延迟 `1.1s` 开始

  


你首先需要使用 `@keyframes` 定义两个关键帧动画：

  


```CSS
@keyframes fadeInUp {
    from {
        opacity: 0;
        translate: 0 100px;
    }
    to {
        opacity: 1;
        translate: 0 0;
    }
}

@keyframes zoomIn {
    from {
        scale: .7;
        opacity: 0;
    }
    to {
        scale: 1;
        opacity: 1;
    }
}
```

  


每个元素都需要在相对于其兄弟元素的精确时间执行动画的持续时间和延迟时间。在过去，大多会像下面这样编写动画序列：

  


```CSS
h1 {
    animation: fadeInUp 1.1s cubic-bezier(.19,1,.22,1) both;
}

h4 {
    animation: fadeInUp .9s cubic-bezier(.19,1,.22,1) both .2s;
}

button {
    animation: zoomIn .9s cubic-bezier(.19,1,.22,1) 1.1s both;
}
```

  


这段代码会存在一些问题。比如，我们更改其中一个元素的动画时间，其他元素的动画时间也需要手动调整，否则整个动画序列就会混乱。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a58a1ee45e6248e4a40631e8070c4e4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1366&h=522&s=10378404&e=gif&f=208&b=0b0b0a)

  


> Demo 地址：https://codepen.io/airen/full/LYqmBav

  


我们可以通过可视化创建动画序列的时间轴。首先是主标题（Heading）动画，接着是次标题（Subheading）动画，最后是按钮（Button）动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0de66e0980d4ecba3682d52676c520f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3370&h=1541&s=425403&e=jpg&b=282b3e)

  


我们可以使用 CSS 自定义属性编写与上面时间轴相匹配的 CSS ，并解决我们之间代码中存在的问题：

  


-   动画延迟时间是相对于前一个动画的时间，而不是设置特定的时间
-   由于每个动画延迟都是相对于前一个动画的时间，改变一个动画的时间会更新整个序列

  


首先，让我们设置动画的每个步骤的持续时间：

  


```CSS
:root {
    --heading-duration: 1.1s;
    --subheading-duration: .9s;
    --button-duration: .9s;
}
```

  


接下来，我们计算每个动画的延迟时间。我们可以通过将前一个动画的开始时间和持续时间相回来实现。这给我们了前一个动画结束的时间：

  


```CSS
:root {
    --heading-delay: 0s;
    --subheading-delay: calc(var(--heading-delay) + var(--heading-duration));
    --button-delay: calc(var(--subheading-delay) + var(--subheading-duration));
}
```

  


这样就获得每个动画的持续时间和延迟时间：

  


```CSS
:root {
    /* 持续时间 */
    --heading-duration: 1.1s;
    --subheading-duration: .9s;
    --button-duration: .9s;
    
    /* 延迟时间 */
    --heading-delay: 0s;
    --subheading-delay: calc(var(--heading-delay) + var(--heading-duration));
    --button-delay: calc(var(--subheading-delay) + var(--subheading-duration));
}
```

  


把相应时间应用到对应的动画元素上：

  


```CSS
h1 {
     animation: fadeInUp var(--heading-duration) cubic-bezier(.19,1,.22,1) var(--heading-delay) both;
}
    
h4 {
     animation: fadeInUp var(--subheading-duration) cubic-bezier(.19,1,.22,1) var(--subheading-delay) both ;
}
 
button {
     animation: zoomIn var(--button-duration) cubic-bezier(.19,1,.22,1) var(--button-delay) both;
}
```

  


这种技术使得理解和更改动画时间轴变得更加容易。更改一个动画的速度会自动影响整个动画序列，无需手动操作。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c2d837d42044b368226910134019769~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1222&h=490&s=6615249&e=gif&f=260&b=2d2b26)

  


> Demo 地址：https://codepen.io/airen/full/YzBLObZ

  


你还可以在此基础上添加一个基础速度 `--base-speed`，这样做能更好的调整动画速度，比如你想整个动画序列变得更快或更慢。

  


```CSS
:root {
    --base-speed-unitless: 0.2;
    --base-speed: calc(var(--base-speed-unitless) * 1s);

    --relative-heading-speed: 0.5;
    --relative-subheading-speed: 0.5;
    --relative-button-speed: 1;

    /* 持续时间 */
    --heading-duration: calc(var(--base-speed) * var(--relative-heading-speed));
    --subheading-duration: calc(
      var(--base-speed) * var(--relative-subheading-speed)
    );
    --button-duration: calc(var(--base-speed) * var(--relative-button-speed));

    /* 延迟时间 */
    --heading-delay: 0s;
    --subheading-delay: calc(var(--heading-delay) + var(--heading-duration));
    --button-delay: calc(var(--subheading-delay) + var(--subheading-duration));
}
```

  


你只需要增加几个滑块，就可以根据需要调整整个动画的时序：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09746aebbc674dd99f40dff702ec0456~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=712&s=9805297&e=gif&f=250&b=262422)

  


> Demo 地址：https://codepen.io/airen/full/mdvLzEp

  


这种技术可以扩展到构建一些真正复杂的动画。例如，[@Paul Hebert 在 CodePen 使用这种技术写了一个“鲁布·戈德堡机”的复杂动画](https://codepen.io/phebert/full/oNXRPNK)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a71c613824b4ab2b57647e6d6e75d5a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1436&h=676&s=5519178&e=gif&f=180&b=d0d1ad)

  


> Demo 地址：https://codepen.io/phebert/full/oNXRPNK

  


这个动画的 CSS 时间轴最终的样子：

  


```CSS
:root {
    --base-speed: 0.5s;

    --domino-speed: calc(var(--base-speed) * 1.5);
    --domino-hit-speed: calc(var(--domino-speed) * 0.25);
    --last-domino-speed: calc(var(--domino-speed) * 10 / 9);

    --domino-1-delay: 0s;
    --domino-2-delay: calc(var(--domino-1-delay) + var(--domino-hit-speed));
    --domino-3-delay: calc(var(--domino-2-delay) + var(--domino-hit-speed));
    --domino-4-delay: calc(var(--domino-3-delay) + var(--domino-hit-speed));
    --domino-5-delay: calc(var(--domino-4-delay) + var(--domino-hit-speed));
    --domino-6-delay: calc(var(--domino-5-delay) + var(--domino-hit-speed));

    --ball-and-string-speed: calc(var(--base-speed) * 2);
    --ball-and-string-delay: calc(var(--domino-6-delay) + var(--domino-speed) * 0.2);

    --car-speed: calc(var(--base-speed) * 4);
    --car-delay: calc(var(--ball-and-string-delay) + var(--ball-and-string-speed) * 0.25);

    --_8-ball-speed: calc(var(--base-speed) * 5);
    --_8-ball-delay: calc(var(--car-delay) + var(--car-speed) * 0.9);

    --domino-7-delay: calc(var(--_8-ball-delay) + var(--_8-ball-speed) * 0.9);
    --domino-8-delay: calc(var(--domino-7-delay) + var(--domino-hit-speed));
    --domino-9-delay: calc(var(--domino-8-delay) + var(--domino-hit-speed));
    --domino-10-delay: calc(var(--domino-9-delay) + var(--domino-hit-speed));
    --domino-11-delay: calc(var(--domino-10-delay) + var(--domino-hit-speed));
    --domino-12-delay:  calc(var(--domino-11-delay) + var(--domino-hit-speed));

    --last-ball-speed: calc(var(--base-speed) * 3);
    --last-ball-delay: calc(var(--domino-12-delay) + var(--domino-hit-speed));

    --total-duration: calc(var(--last-ball-delay) + var(--last-ball-speed));
}
```

  


掌握了该技巧之后，我想再复杂的 CSS 动画你都不会惧怕。像下面这样的动画效果，你将手到擒来：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ff6c1f7363a48c2ae79d9e50cd48696~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=596&s=10978843&e=gif&f=121&b=2b2f32)

  


感兴趣的同学不妨一试。

  


### 纯 CSS 制作幻灯片组件

  


我将通过结合 CSS 动画和自定义属性构建图片幻灯片的小技巧。我们先从最简单的着手。你需要一个像下面这个简单的 HTML 结构：

  


```HTML
<div class="hero">
    <div class="slideshow"></div>
</div>
```

  


接着使用 CSS 自定义属性定义不同的图片，在这里我使用了五张不同的图片：

  


```CSS
.hero {
    --slide1: url("https://picsum.photos/1920/1028?random=2");
    --slide2: url("https://picsum.photos/1920/1028?random=3");
    --slide3: url("https://picsum.photos/1920/1028?random=4");
    --slide4: url("https://picsum.photos/1920/1028?random=5");
    --slide5: url("https://picsum.photos/1920/1028?random=6");
}
```

  


同时再定义一个名为 `--currentSlide` 的自定义属性，并且在关键帧中改变它的值：

  


```CSS
.hero {
    --currentSlide: var(--slide1);
}

@keyframes slideshow {
    0% {
        --currentSlide: var(--slide1);
    }
    20% {
        --currentSlide: var(--slide2);
    }
    40% {
        --currentSlide: var(--slide3);
    }
    60% {
        --currentSlide: var(--slide4);
    }
    80% {
        --currentSlide: var(--slide5);
    }
    100% {
        --currentSlide: var(--slide1);
    }
}
```

  


最后，你只需要将 `--currentSlide` 作为 `.slideshow` 元素的背景图片，并且通过 `animation` 属性应用已定义好的 `slideshow` 关键帧。你就实现了一个最简单，最基本的图片幻灯片自动播放的效果：

  


```CSS
.slideshow {
    animation: slideshow 20s linear infinite;
    background-size: cover;
    background-image: var(--currentSlide);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35c2fbd0a665499d9b9c7859afe156fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=484&s=15026554&e=gif&f=162&b=370c06)

  


> Demo 地址：https://codepen.io/airen/full/vYbjqzq

  


这个效果太过于粗糙，我们需要给图片添加淡入淡出的效果，这样整个幻灯片图片播放的效果会更自然一些。不过要添加更多关键帧可能会很麻烦，所以让我们可视化一下这个问题。首先，我们希望在下图中的绿色部分显示图像，而在红色部分隐藏图像。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71a1baad7cd34cecadfffb4382b4cf2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3607&h=2712&s=1827489&e=jpg&b=282b3e)

  


在此基础上，我们可以定义一个 `fade` 关键帧：

  


```CSS
@keyframes fade {
    25% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    75% {
        opacity: 1;
    }
}
```

  


并且将其增加到 `.slideshow` 上，即应用多个关键帧动画。注意 `fade` 关键帧动画的持续时间是 `slideshow` 的五分之一（`4s`）：

  


```CSS
.slideshow {
    animation: 
        slideshow 20s linear infinite, 
        fade 4s linear infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecc3ed624fb94394b6f2d6f4a72d849d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=342&s=11423215&e=gif&f=148&b=f9efe9)

  


> Demo 地址：https://codepen.io/airen/full/OJdZKyR

  


我们可以通过添加两个自定义属性来计算动画所需的持续时间：

  


```CSS
.slideshow {
    --numberOfSlides: 5; /* 幻灯片数量 */
    --slideshowDuration: 20s; /* slideshow 动画所需持续时间 */
    --fadeDuration: calc(var(--slideshowDuration) / var(--numberOfSlide)); /* 计算出 fade 动画的持续时间 */
    
    animation:
        slideshow var(--slideshowDuration) linear infinite,
        fade var(--fadeDuration) linear infinite;
}
```

  


最终我们得到了图像之间的平滑过渡，但是每个图像之间存在一些空白，我们想要更多。我们希望我们的图像淡入到下一个图像中，而不是淡入到底色（示例中的你能看到的，来自 `body` 元素的背景色 `#557` ），然后再淡入到下一个图像。为了实现这一点，我们可以在 HTML 中复制 `.slideshow` 元素，并附加一个 `.slideshow2` 。

  


```HTML
<div class="hero">
    <div class="slideshow"></div>
    <div class="slideshow slideshow2"></div>
</div>
```

  


然后，我们为第二个幻灯片添加一个动画延迟时间 `--delay-duration` ，这样图像仍然位于第一个幻灯片的下方，但是时间延迟足够，以避免在它们之间出现底色。

  


为了实现这一点，我们可以在 HTML 中复制 `.slideshow` 元素，并附加一个 `.slideshow2`。然后，我们为第二个幻灯片添加一个动画延迟 `--delay-duration`，这样图像仍然位于第一个幻灯片的下方，但是时间延迟足够，以避免在它们之间出现白色过渡。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1162946a1ebc48529b049d95cad59ee2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3898&h=3015&s=2926502&e=jpg&b=282b3e)

  


请注意，延迟持续时间应该是一个幻灯片的持续时间的一半，我们使用 `calc` 来帮助我们计算该值。

  


```CSS
.slideshow {
    --numberOfSlides: 5;
    --slideshowDuration: 20s;
    --fadeDuration: calc(var(--slideshowDuration) / var(--numberOfSlides));
    --delay-duration: calc(var(--fadeDuration) / 2 );
  
    animation: 
        slideshow var(--slideshowDuration) linear infinite, 
        fade var(--fadeDuration) linear infinite;
}
.slideshow2 {
      animation: 
          slideshow var(--slideshowDuration) var(--delay-duration) linear infinite, 
          fade var(--fadeDuration) var(--delay-duration) linear infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d59d1489d714cbb91e7d6824f08e408~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=560&s=14239828&e=gif&f=94&b=d8c5a8)

  


> Demo 地址：https://codepen.io/airen/full/oNmybyX

  


当然，你也可以像下面这样制作相似的幻灯片图片播放的动画效果：

  


```HTML
<div class="slideshow">
    <img src="slide1.jpg" class="slide" />
    <img src="slide1.jpg" class="slide" />
    <img src="slide1.jpg" class="slide" />
</div>
```

  


我们需要先确定三个要素：

  


-   动画的总持续时间
-   每张幻灯片（每个图像）的动画延迟时间
-   关键帧的时序

  


我们可以通过下面的公式计算出动画的总持续时间：

  


```
动画总持续时间 = （淡入 + 可见）× 图像数
```

  


动画的延迟时间相对简单一点。关键是要在前一个图像开始淡出时启动下一张图像的动画。因此，你希望动画延迟为淡入时间加上前一张图像的可见时间。如果是第二张图像，动画应该淡入 `1s` ，并在淡出之前可见 `2s` ，那么动画的延迟应该是 `3s` 。如果是第三张图片，则延迟为 `6s` 。如果是第四张图片，则延迟为 `9s` ，依此类推。

  


我们也可以按照下面的公式来计算动画的延迟时间：

  


```
动画延迟时间 = (淡入 + 可见) × (顺序位置 - 1)
```

  


这类动画最为麻烦的是关键帧时序的定义。也就是关键帧中的百分比如何设置。为此，我们需要将 `100%` 分割成我们动画的秒数（持续时间的秒数）。如果动画持续时间为 `10s` ，则每秒为 `10%` 。如果动画持续时间为 `6s` ，则每秒为 `16.667%` 。然后，定时变成这个的倍数。它相应的计算公式是：

  


```
100 ÷ 动画持续时间 = 1 秒的百分比
```

  


这是所有要素的组合方式。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43e0b7bc08c44b52a7c393661a14922b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4632&h=2295&s=2015074&e=jpg&b=282b3e)

  


在这种情况下，如果动画正在进行 `1s` 的淡入，加上 `2s` 的可见性，然后淡出。首先，我们定义了淡入动画的 CSS 关键帧：

  


```CSS
@keyframes fade {
    0% { 
        opacity: 0; 
    }
    11.11% {  /* 100 ÷ 动画持续时间 × 1 */
        opacity: 1;  
    }
    33.33% { /* 100 ÷ 动画持续时间 × 3 */
        opacity: 1; 
    }
    44.44% { /* 100 ÷ 动画持续时间 × 4 */
        opacity: 0; 
    }
    100% { /* 延迟到 100% */
        opacity: 0; 
    }
}
```

  


我们分别使用 CSS 自定义属性来定义动画相关的参数，便于计算出相应的动画时间：

  


```CSS
:root {
    --fadein: 1s; /* 1s 淡入时间 */
    --visible: 2s; /* 2s 可见时间 */
    --slides: 3; /* 幻灯片数量 */
    --duration: calc((var(--fadein) + var(--visible)) * var(--slides));
}
```

  


并且在幻灯片对应的元素上以内联的方式定义 `--index` 自定义属性，并且对应其自身的索引值：

  


```HTML
<div class="slideshow">
    <img src="slide1.jpg" class="slide" style="--index: 1;" />
    <img src="slide1.jpg" class="slide" style="--index: 2;" />
    <img src="slide1.jpg" class="slide" style="--index: 3;" />
</div>
```

  


通过 `--index` 计算每张幻灯的持续时间：

  


```CSS
.slideshow img {
    --delay: calc((var(--fadein) + var(--visible)) * (var(--index) - 1));
}
```

  


最终核心代码如下：

  


```CSS
@layer animation {
    @keyframes fade {
        0% { 
            opacity: 0; 
        }
        11.11% {  /* 100 ÷ 动画持续时间 × 1 */
            opacity: 1;  
        }
        33.33% { /* 100 ÷ 动画持续时间 × 3 */
            opacity: 1; 
        }
        44.44% { /* 100 ÷ 动画持续时间 × 4 */
            opacity: 0; 
        }
        100% { /* 延迟到 100% */
            opacity: 0; 
        }
    }
    
    .slideshow {
        --fadein: 1s; /* 1s 淡入时间 */
        --visible: 2s; /* 2s 可见时间 */
        --slides: 3; /* 幻灯片数量 */
        --duration: calc((var(--fadein) + var(--visible)) * var(--slides));
        
        
        & img {
            --delay: calc((var(--fadein) + var(--visible)) * (var(--index) - 1));
            animation: fade var(--duration) linear infinite var(--delay);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eac4204a3e1f4eb7819515aa51d19f10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=486&s=16332375&e=gif&f=147&b=d9d6ce)

  


> Demo 地址：https://codepen.io/airen/full/VwgdjaB

  


使用相似的方法还可以使幻灯具有不同的动画效果，比如 `slideInLeft` 、`zoomIn` 等等。感兴趣的同学可以尝试一下。

  


## 小结

  


在这节课中，我们主要一起探讨了动画中另外一个重要概念，即时间。CSS 动画中的时间主要分为持续时间和延迟时间，它们决定着动画的速度和时序以及启动时机。

  


通过这节课的学习，知道动画的持续时间和延迟时间对于动画的重要性，并且深度阐述了动画持续时间和延迟时间的基本原理和相关细节。并且通过大量实际案例向大家阐述了如何更好的用好动画的持续时间和延迟时间，制作出更精致的动画效果。

  


总体而言，深入了解 CSS 动画的持续时间和延迟时间是提高网页交互性和吸引力的关键步骤。通过巧妙地调整这些参数，开发者可以创造出引人入胜的用户体验，使网站更具活力和创意。