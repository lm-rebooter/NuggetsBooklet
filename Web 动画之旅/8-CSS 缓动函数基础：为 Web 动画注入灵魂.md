通过前面课程的学习，我想你已经掌握了如何使用 CSS 的 [`transform`](https://juejin.cn/book/7288940354408022074/section/7295240572736897064) 、[`transition` 和 `animation`](https://juejin.cn/book/7288940354408022074/section/7292735608995184678) 以及 [`@keyframes`](https://juejin.cn/book/7288940354408022074/section/7295617447058407474) 等制作 CSS 动画。对于大多数 Web 开发者而言，制作一个 CSS 动画不是一件难事，但要制作出一个优秀的 CSS 动画，可不是一件易事。出色的动画会让你惊叹不已，它流畅、优雅，最重要的是，自然，不呆板、僵硬或机械。

鉴于众多出色的 Web 设计师创造了如此美丽的动画，任何 Web 开发者都自然希望在自己的项目中重新创建它们。制作出流畅和谐与令人愉悦的动画，有一个必要的原则，那就是让动画更接近于现实。要做到这一点，就得控制好动画中的速度。其中，缓动函数就是影响动画的速度或速率的重要且必要条件之一。

在编写 CSS 中的过渡（`transition`）和帧动画（`animation`）属性时，我们通常会选择 CSS 提供的一些预设的缓动函数，比如 `linear` 、`ease` 、`ease-in` 、`ease-out` 和 `ease-in-out` ，它们为动画添加了一定程度的平滑性和逼真感，但它们非常通用，不是吗？如果页面上有十几个或更多元素，它们都具有相同的持续时间和缓动函数，可能会使用户界面显得单调和单一。人们对自然运动有更好的响应，因此使动画和过渡更加多样化和自然将给用户带来更好的体验。

换句话说，流动性与设计和呈现的结合使动画看起来令人印象深刻和自然。这就是缓动函数（也称为时间函数）的威力。在这节课中，我们将深入研究缓动函数，并了解如何使用它们来创建自然而令人惊叹的动画。我们将讨论什么是缓动函数，它们是如何工作的，以及如何自定义缓动函数以实现独特的动画效果。准备好让你的 Web 动画变得更出色吧！

## 缓动函数是什么？

在开始介绍缓动函数是什么之前，我们先来看看下面这个示例：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d6d7d7b45074cdd84e4f96786552d3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970\&h=634\&s=4159229\&e=gif\&f=139\&b=4c486b)

> Demo 地址：<https://codepen.io/airen/full/YzBpGxx>

示例中五个轮子（`.wheel`）都是从屏幕的左侧向右侧滚动，然后返回到它们的起点。对于这五个轮子，我们设置的关键帧动画属性是一样的：

```CSS
@keyframes move {
    to {
        translate: calc(100vw - 2rem - 88px) 0;
        rotate: 2turn;
    }
}
```

同时设置的动画持续时间 `animation-duration` 也是一样的，都是 `5s` ：

```CSS
.wheel {
    animation: move 5s infinite alternate;
}
```

可以说，它们共享相同的持续时间，相同的关键帧，相同的属性值的变化量。尽管这些都相同，但呈现给你的动画效果显然是不同的。这是怎么回事呢？

造成每个轮子（`.wheel`）动画不同（并导致它们之间的差异）的是**缓动函数**。每个轮子的应用动画使用不同的缓动函数来实现将轮子来回滚动的相同目标：

```CSS
.wheel {
    animation: move 5s infinite alternate;
    
    &:nth-child(1) {
        animation-timing-function: linear;
    }
    
    &:nth-child(2) {
        animation-timing-function: ease;
    }
    
    &:nth-child(3) {
        animation-timing-function: ease-in;
    }
    
    &:nth-child(4) {
        animation-timing-function: ease-out;
    }
    
    &:nth-child(5) {
        animation-timing-function: ease-in-out;
    }
}
```

所以，让我们回到最初的问题。缓动函数是什么？**缓动函数是一种改变属性动画速度的东西**。

为了能更好地向你解释缓动函数是什么？我们把上面的示例简化一下。想象一下，将一个元素（比如一个圆圈）从屏幕的左边移动到右边。为了更好的可视化，我们将动画分解为 `24` 帧：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43196766f6ad4769bdc54cccaa61d000~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2555\&h=987\&s=212414\&e=jpg\&b=fcfcfc)

你可能会想，除了第 `1` 帧和第 `24` 帧之外的所有中间帧会在哪里？让我们从最“合理”的方法开始，均匀地分割空间：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3df8159a7f7492d833e33357cdde84a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2550\&h=987\&s=492392\&e=jpg\&b=fbfbfb)

也就是说，我们假设圆圈是以恒速从屏幕左侧滚动到屏幕右侧：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d642348ff0ea4f9e8eb0b47f85246eb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120\&h=468\&s=1185135\&e=gif\&f=156\&b=000000)

> Demo 地址：<https://codepen.io/airen/full/LYqbbXX>

这样制作的动画看上去会很呆板，运动对象（圆圈）似乎没有任何质量感，也没有动力感。

如果我们将这种动画绘制在一个图表上，它看起来会像下面这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/550ddfd9a63c4b5381bc621964e5862d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2550\&h=2639\&s=2856212\&e=jpg\&b=fefefe)

*   水平方向 `x` 轴表示动画的持续时间（`animation-duration`）的百分比

*   垂直方向 `y` 轴表示距离（`@keyframes`）的百分比，即已完成的运动的百分比（也常称进度）

动画持续时间（`animation-duration`）决定了动画从第一个关键帧（比如 `0%` 或 `from`）到最后一个关键帧（比如 `100%` 或 `to`）所需的时间。这意味着，从左下角 `0%` 持续时间和 `0%` 进度开始，然后在右上角结束，进度和持续时间都达到了 `100%` 。这就有了起点（`A`）和终点（`B`），它们连接在一起就是一条路径，或者说一条曲线，用来表示动画速度。这条曲线（路径）就是我们所说的**缓动曲线**（也常称缓动函数）。

注意，上面示例中所呈现的缓动“曲线”是唯一一种没有曲线部分的，也是最易于理解的一种缓动曲线，它被称为**线性曲线**。

在现实生活中，物体的运动不总是一种恒速运动。这也意味着速度并不总是一条直线，我们可以给物体的运动添加一定的斜率，使物体运动的路径变成一条真正的曲线。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c4182909c76463eaeab9df1ad55d6c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960\&h=960\&s=102386\&e=gif\&f=100\&b=fbfbfb)

这就是为什么五个轮子在同样的距离和时间下运动，会有不一样结果的原因所在：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9337dfc820e649eb8c5c3550c0ba43a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970\&h=634\&s=4159229\&e=gif\&f=139\&b=4c486b)

示例中的五个轮子分别运用了不同的缓动函数， `linear` 、`ease` 、`ease-in` 、`ease-out` 和 `ease-in-out` 。这也意味着，从 `A` 点到 `B` 点，虽然用时都是 `5s` ，但它们的运动曲线（速度）不同，最终呈现给你的动画效果就有所不同。

总之，这些构成了四种主要的缓动曲线类型：`linear` 、`ease` 、`ease-in`、`ease-out` 和 `ease-in-out`。大多数动画使用这四种曲线中的一种。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d962fa13a124631a82c4ae805544385~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2555\&h=1409\&s=624490\&e=jpg\&b=282b3e)

当然，我们这只是触及了表面。`ease-*` 曲线可以稍微调整以提供更多细微差别，例如 [easings.net](https://easings.net/) 中所展示的各缓动曲线：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9e5437490d84430b790126f3678ff5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040\&h=642\&s=985357\&e=gif\&f=162\&b=fcfcfc)

> URL: <https://easings.net/>

除此之外，还有一些更高级的缓动曲线，例如弹簧曲线。但通过这几种类型，你现在了解了缓动曲线的“基本要领”以及它的重要特点：

*   它们不改变属性值的起始点

*   它们不改变属性值的结束点

*   它们不改变动画的持续时间

*   它们改变属性值变化的速度

到这里，我想你已经知道缓动函数是什么了，但要使用它们来制作出更优雅的动画，这些基础还是不够的。我们需要更进一步理解缓动函数。

## 理解缓动函数

通过上一节内容的学习，我们知道缓动函数就是一条曲线，一条描述物体运动的曲线，或者说物体运动的路径。具体一点来说呢？缓动函数（也称动画曲线）无非就是在任何可动画化的属性和时间之间绘制的一种图形。它定义了动画运行的速度如何随时间变化。

换句话说，缓动函数定义了在动画过程中属性值如何随时间变化。它可以改变动画的速度，使动画在开始、中间和结束阶段都有不同的速度，从而创建更加自然和有吸引力的动画效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbf02fb68d294c0baf2dd6bfb60b1990~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1570\&s=462950\&e=jpg\&b=282b3e)

我们以距离（`translate`）作为可动画化属性为例，例如物体通过 `translate` 属性从点 `A` 移动到点 `B` ，两点之间有一个距离，该距离就是物体将要移动的距离。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75c085399dfb4f9fa725618b2db6f0cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1570\&s=185142\&e=jpg\&b=ffffff)

在动画中，通常使用 `f(t)` 来表示动画中某个属性（如位置、颜色等）随时间 `t` 变化的函数。这个函数描述了动画中属性的变化规律，即在不同时间点 `t` 上，属性的取值是多少。`f(t)` 中的 `t` 通常代表时间，而 `f(t)` 的输出值表示属性在对应时间点上的值。

例如，如果我们有一个动画，其中一个物体的位置随时间 `t` 变化，那么 `f(t)` 可能表示该物体的位置属性。在不同的 `t` 值上，`f(t)` 将给出物体在动画中的位置。这种方式可以用来描述动画中各种属性的变化，以便更好地理解和控制动画的行为。`f(t)` 函数的形式取决于动画的具体需求和使用的数学模型。

如果你有物理和微积分相关的基础知识，你会知道从距离与时间的图中解读速度是非常简单的。距离作为时间函数对时间的第一阶导数就是速度 ，这意味着按照距离与时间曲线运动的物体在曲线陡峭的地方速度较高，在曲线较平缓的地方速度较低。

也许上面的描述对你来说太过于专业化了，要是没有这方面的知识背景，可能无法很好的理解。请不要担心，我将会尝试着以简单地示例来解释它。

假设，你正在构建一个物体移动的动画。例如，通过 `translate` 将一个轮子（`.wheel`）从点 `A` （初始位置）移动到点 `B` （结束位置），`AB` 两点之间的距离刚好是 `1000px` ，并且它总共花费了 `1s` 的时间才完成这个运动。我们使用 CSS 帧动画，可以像下面这样来定义这个动画：

```CSS
@keyframes move{
    to {
        translate: 1000px;
    }
}

.wheel {
    translate: 0px; /* 可以省略不写 */
    animation: move 1s linear both; 
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162f2e8fd41b4d00b51ddb5249e8ed3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190\&h=356\&s=954011\&e=gif\&f=187\&b=000000)

> Demo 地址：<https://codepen.io/airen/full/dyaORbL>

为了使大家能更好的理解缓动函数，我们先从最简单的 `linear` 开始。因此，上面示例中，动画的运动曲线（缓动函数）使用了 CSS 的缓动函数的预设值 `linear` 。

在上一节中，我们得知，动画使用的缓动曲线要是 `linear` 的话，整个动画会很生硬，因为它是线性的，动画恒速运动。但你能解释其中的为什么吗？背后到底发生了什么？这是我们首先要弄清楚的，我们将深入了解为什么这种动画给人感觉是机械的、生硬和不自然的。

让我们从绘制轮子（`.wheel`）的运动图开始，看看是否可以得到一些见解。轮子的运动图将有两个坐标轴，第一个是距离，也就是轮子运动的进度，对应的是 `@keyframes` 中动画属性变化；第二个是时间，也就是动画持续时间。在这个示例中，轮子 `.wheel` 在 `1s` 内（时间）移动 `1000px` 的距离（点 `A` 到点 `B` 之间的距离）。这是一张非常简单的图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c10f8627cf8d461090a366533a4798e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1757\&s=582988\&e=jpg\&b=282b3e)

你可能已经发现了，上面这张运动图表，除了 `x` 轴和 `y` 轴之外，没有任何数据。不用着急，随着后面的内容这图上的数据也会随之完善。

就这个示例的动画而言。我们知道在 `0s` 时，动画还没有开始，轮子 `.wheel` 位于其初始值（`translate: 0`）；动画播放完（经过 `1s`）后，轮子沿着水平方向行进了 `1000px` ，来到了容器的另一侧（`translate: 1000px`）:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3846be858b404de2b6b825d8f1516057~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=2713\&s=951550\&e=jpg\&b=282b3e)

前面也说过，在这个图表中，左下角表示 `0%` 持续时间和 `0%` 的距离（动画开始位置），然后在右上结束，持续时间和距离都达到了 `100%` 。如此一来，我们就可以将轮子 `.wheel` 的初始位置和最终位置放到运动图中：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb6b4a168352494f951c1ce014987757~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1827\&s=719779\&e=jpg\&b=282b3e)

可能只用两个点来描述，还不足够清晰，还不能让你理解透彻。我们继续往运动图上添加一些点。例如，下图显示了轮子 `.wheel` 在不同时间点的位置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81b7501e8f7743a09b443c899870208f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=2260\&s=800135\&e=jpg\&b=282b3e)

将不同的时间点和距离点填充到“距离和时间”的图表中：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0927c6bd5dd43019beacbbde70918ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=851370\&e=jpg\&b=282b3e)

当然，你可以按类似的方法给图片添加更多的数据点，比如 `.0375s` 、`.6s` 等，但我们已经有足够的数据来完成我们的图表。通过连接所有这些点，我们完成了上面示例所对应的“距离时间”图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93517349d0b7467c8012936bef1f3cf0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=972089\&e=jpg\&b=282b3e)

你可能会感到困惑，“距离时间”图是绘制出来了，但还是不知道为什么轮子 `.wheel` 使用线性运动曲线（`linear`）会使动画的感觉不自然和机械化？请先记住这张图，我们接着往下探讨。

我们接着来聊速度。我想你知道什么是速度，但这里我还是使用数学表达式来描述一下计算速度的公式：

    速度 = 行驶距离 ÷ 走完这段距离所花费的时间

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4026b65bd0584d8b8c07ea61e071166c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=900\&s=109700\&e=jpg\&b=ffffff)

因此，如果一辆汽车在 `1` 小时内行驶 `100` 公里的距离，我们就说它的速度是每小时 `100` 公里。

如果汽车的速度加倍，它将在相同的时间间隔（`1` 小时）行驶 `200` 公里，或者换句话说，汽车在半小时（`.5` 小时）行驶了 `100` 公里的距离。同样，如果汽车的速度减半，它将在相同的时间间隔（`1` 小时）就只能行驶当初 `100` 公里的一半（即 `50` 公里），或者换句话说，汽车需要用两小时才能行驶完当初的 `100` 公里。

这就是我们现实生活中的速度、距离与时间之间的关系。回到之前的话题。试图弄清楚距离和时间之间图表如何帮助我们理解为什么轮子 `.wheel` 的线性运动感觉生硬呆板。

在此之前，我们根据 `.wheel` 的帧动画和动画持续时间，我们绘制了一张关于距离和时间的图表。现实生活告诉我们，速度可以通过距离和时间计算出来。如此一来，我们就可以尝试计算不同时间间隔内轮子 `.wheel` 的运动速度。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f09938ffb6a44bc39d3d930fd967cc2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=1082992\&e=jpg\&b=282b3e)

从图中不难发现，在这四个时间间隔内，轮子 `.wheel` 的速度完全相同（`s1 = s2 = s3 = s4`），为每秒 `1000px` 。也就是说，无论你在上面的图表中选择哪个时间间隔，你都会发现轮子 `.wheel` 以每秒 `1000px` 的速度移动。这不奇怪吗？

现实生活中的物体运动是不会以恒定的速度移动。它们会从慢慢开始，逐渐增加速度，移动一段时间，然后再次减速直到停止。可我们示例中的轮子 `.wheel` 从一开始就以每秒 `1000px` 的速度移动，并且一直以相同的速度移动，还以完全相同的速度突然停止运动。这就是轮子 `.wheel` 动画给人感觉呆板和不自然的原因所在。我们将不得不更改我们的图表来解决这个问题。但在深入研究之前，我们需要知道速度的变化将如何影响距离和时间之间绘制的图表。

我们先来给轮子 `.wheel` 移动加速，看看“距离时间”的图表外观是如何随之改变的。轮子的原始速度是每秒 `1000px` ，如果我们将轮子速度加倍，那么轮子将在 `.5s` 内就能移动 `1000px` （完成移动）。同样的，如果轮子移动的速度是初始速度的三倍，那么轮子将在 `0.3333s` 内就能移动 `1000px` 。我们将这几种速度都在同一图表上绘制出来。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d87d69ca3f2c44148e3de8b62f38ccb9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=1115805\&e=jpg\&b=282b3e)

注意到了吗，**当速度变快时，运动曲线与时间轴的夹角会变大（** **`α1 < α2 < α3`** **）** 。

再来看轮子减慢速度给“距离时间”图带来的变化。先让轮子速度减半，即轮子需要花 `2s` 的时间才能移动 `1000px` ，换句话说，轮子花费 `1s` 时间，只能移动 `500px` 的距离。继续给轮子减速，例如轮子需要花费 `3s` 时间才能移动 `1000px` ，换句话说，轮子花费 `1s` 时间，只能移动大约 `333.33px` 。同样的，把它们放到同一张“距离时间”图表上：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22420c45d04a48ed9f4a3d62a05246db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=1139427\&e=jpg\&b=282b3e)

刚好与轮子加速相反，**当速度变慢时，运动曲线与时间夹角会变小（** **`α1 > α2 > α3`** **）** 。

看到了吗？随着我们增加轮子 `.wheel` 的速度，运动曲线会变得越来越陡峭；当我们给轮子减速时，运动曲线会变得越来越平缓：


![fig-22.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91d5af04e6c943ca8a3e1fb91e3885f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1767&s=1414067&e=jpg&b=282b3e)


这是有道理的，因为对于一条更陡峭的运动曲线，短时间会导致距离上的更大变化，这意味着轮子运动的速度更快；反之，对于一条更平缓的运动曲线，长时间也只能使距离发生微小的变化，这意味着轮子运动的速度更慢。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd1c00dd091f4225a3d2d6b422478826~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=1339963\&e=jpg\&b=282b3e)

上面所说的各种情境，只是调整了轮子 `.wheel` 从点 `A` （`translate: 0`）到点 `B` （`translate: 1000px`）的运行速度，但它始终还是以恒速在运动。不过，通过上面的学习，我们已经知道了距离与时间的变化是如何影响速度的。有了这个基础之后，我们可以进一步做实验，在“距离时间”图表上绘制一个使轮子运动看起来更自然和更真实的运动曲线。

首先，现实生活中，物体移动通常都是从缓慢开始，然后慢慢加速。我们可以像下图这样来描述轮子运动的图表：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40d01bf3fe9144c6aad9ed17ec830a6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=930362\&e=jpg\&b=282b3e)

在上面所示的图表中的所有迭代中，你会注意到轮子起点和终点位置并没有发生变化。这是因为我们没有改变动画运行的持续时间，也没有改变轮子移动的距离。

如果轮子 `.wheel` 按照上图中的运动曲线移动，那么它将在 `.25s` 内以较慢的速度移动，因为从 `0s` 到 `0.25s` 之间的运动曲线坡度较小（比较平缓），然后在 `0.25s` 后它将突然切换到更高的速度（原因是在 `.025s` 后，图中的运动曲线变得更陡峭）。从上图中不难发现，在 `.25s` 这个点上，运动曲线之间有一个锐角，这是我们不希望有的，毕竟这是一条运动曲线，我们希望这个转换点能平滑一些。也就是说，我们需要想办法将这个折线变成一条曲线。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd84590051b64da7b0cc5eb45a8cb850~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=929862\&e=jpg\&b=282b3e)

注意，上图中的运动曲线使得轮子移动时，先缓慢再加速。

轮子移动的运动曲线越来越接近现实生活中的物体移动了。接下来，现实生活中的物体在停下来之前会逐渐减速。让我们改变图表以实现这一目标。我们再次选择一个时间点，假设你希望轮子在 `.6s` 左右开始减速。可以在前面的折线图表中，再增加一个变换点（运动曲线与时间轴 `.6s` 位置交汇处）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f442f5c688f455eabc656697d3feacf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=956445\&e=jpg\&b=282b3e)

这样一来，轮子在 `0s` 至 `0.25s` 之间缓慢运行（一开始慢慢移动），然后在 `.25s` 至 `.6s` 之间加速移动（开始加速），接着 `.6s` 至 `1s` 之间开始慢慢减速移动，直至停止。

注意，需要把运动曲线上的两个锐角点（折角点）给它抹平了，将一条折线变成一条曲线：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0747cd44c44f4c90996320fe84041944~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1767\&s=954422\&e=jpg\&b=282b3e)

如果你足够细心的话，你会发现，这两条曲线和我们经常看到的 `ease-in` 和 `ease-in-out` 非常的相似：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d482ec2c3ae747cfb0227e3ba08a240e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1828\&h=774\&s=271815\&e=jpg\&b=282b3c)

注意，在拐角处绘制的曲线实际上是许多小线段的集合；而且，正如你所知道的那样，图表上线越陡峭，速度越快，线越平缓，速度越慢。下图左侧，组成曲线的线段变得越来越陡峭，导到速度逐渐增加，并在右侧逐渐变平，导致速度逐渐减慢。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbf9f4307d1a4e748328b3c0627d7338~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=695\&s=97596\&e=jpg\&b=ffffff)

有了这些知识，理解动画曲线（缓动函数）变得更容易。这也是为什么缓动曲线会影响动画效果原因所在。

## 设计缓动函数

或许你会问，“应该在什么情况下使用哪种缓动函数？” 我的回答是，这取决于具体情况。**没有一种缓动函数适用于所有情况**。设计这些缓动函数是设计动画的一个关键组成部分。缓动函数通常是根据现实世界中的物理规律设计的，但并不总是遵循这些规则。现实世界是获得动画灵感的好地方。例如，在现实世界中，没有任何物体会以全速开始然后立即停止，就像线性（`linear`）缓动函数那样。物体总是有一定的加速或减速度。这只是[迪士尼在动画的十二大原则](https://juejin.cn/book/7288940354408022074/section/7288940354580480056)中概述的众多概念之一，这些原则在很大程度上基于物理学和对物理学的夸张表现。

在创建缓动函数时，请记住**陡峭（垂直）表示速动快，平缓（水平）表示速度慢**。你所创建的缓动函数应该取决于你正在设计的交互。你可以在 `(x, y)` 坐标系（“距离时间”图表）中创建许多不同类型的缓动函数（动画曲线）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15cc0bf204964b1fb71808ef55f69b50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170\&h=438\&s=888723\&e=gif\&f=119\&b=fefefe)

除了在帧内制作缓动函数之外，还可以打破帧！打破帧限制会导致动画超出关键帧之间的值。采用这种方式可以创建弹跳、弹簧等动画效果的动画曲线。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5a6c7e0c9084c3581c08e8d281f7cc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030\&h=642\&s=238010\&e=gif\&f=78\&b=fefefe)

简而言之，你需要具备设计缓动函数的能力。只有具备这方面的能力才能开发出看起来流畅和自然的动画效果，才能大大提高用户界面的质量。这将让用户界面感觉非常出色。例如，下面这个滑出的菜单栏：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d1d6193691845ffad828c25ce8fad11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000\&h=440\&s=336306\&e=gif\&f=181\&b=f8f8f8)

> Demo 地址：<https://codepen.io/airen/full/JjxbevQ>

点击右上角的“☰”图标，菜单栏从屏幕右侧滑入，但整个动画效果让人感觉生硬。这是因为，动画的 `transition-timing-function` 属性值为 `linear` ：

```CSS
@layer animation {
    .menu {
        translate: 100%;
        transition: all 0.3s linear;
    }
  
    input[type="checkbox"]:checked ~ .menu {
        translate: 0;
    }
  
    input[type="checkbox"]:unchecked ~ .menu {
        translate: 100%;
    }
}
```

我们可以通过改变缓动函数来优化它。比如，你可以尝试使用 `transition-timing-function` 预设的曲线函数，比如 `ease` 、`ease-in` 、`ease-out` 或 `ease-in-out` 。

当然，你也可以自己为动画设计缓动函数。你可以尝试使用 `cubic-bezier()` 来创建一个自定义的缓动函数。你只需要修改四个不同点的位置，就可以创建所需的动画曲线。由于我们总是知道动画对象的初始和最终状态，因此我们可以确定其中两个点。这样就只需要调整两个点的位置。这两个固定点称为锚点，而剩余的另两个点称为控制点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/542db36711134792b50f764aeab88b7f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2600\&h=1704\&s=3851575\&e=gif\&f=316\&b=292423)

`cubic-bezier()` 接受四个数字（`n1`、`n2`、`n3`、`n4`）。这四个数字仅代表两个控制点的位置：

*   `n1` 和 `n2` 代表第一个控制点的 `x` 和 `y` 坐标

*   `n3` 和 `n4` 代表第二个控制点的 `x` 和 `y` 坐标

因为改变控制点的位置会改变曲线的形状，从而影响动画的效果，所以修改 `n1` 、`n2` 、`n3` 和 `n4` 中的任何一个或全部都会产生相同的结果。例如，下图表示 `cubic-bezier(.14, .78, .89, .35)`：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f48ec2ab8b24413ae6dbf361df89aea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=695\&s=262317\&e=jpg\&b=fdfdfd)

当然，你也可以使用 [cubic-bezier](https://cubic-bezier.com/) 在线工具来设计所需要缓动函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7d3c903bcba4c708d6638cbe53ff519~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020\&h=596\&s=1616610\&e=gif\&f=254\&b=f8f8f8)

> 工具地址：<https://cubic-bezier.com>

假设你想要的菜单以非常快的速度滑入，然后优雅地减速并停止。你可以使用 [cubic-bezier](https://cubic-bezier.com/) 工具获得 `cubic-bezier()` 函数的 `n1` 、`n2` 、`n3` 和 `n4` 坐标值，例如 `cubic-bezier(.05, .69, .14, 1)` 。然后，只需要将它替代 `linear` ，作为 `transition-timing-function` 属性的值：

```CSS
.menu {
    transition: all 0.3s cubic-bezier(.05, .69, .14, 1);
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1578aba8df664725ac12dd87922c7c40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=938\&h=414\&s=386544\&e=gif\&f=177\&b=f8f8f8)

> Demo 地址：<https://codepen.io/airen/full/WNPoLEa>

这看起来不错。动画将以快速开始，然后减速，而不是在整个过程中以恒定速度移动。

注意，`cubic-bezier()` 函数很强大，也很灵活，它可以制作出各式各样的动画曲线：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f035c5c82b44c7cafcb5e9fbe520fb0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920\&h=960\&s=662047\&e=gif\&f=46\&b=dce9f8)

每一条不同的曲线都会给动画带来不一样的效果。例如，课程前面的轮子转动的示例，如果使用 `cubic-bezier()` 函数，它的转动效果将会各式各样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c4938c1b5f84f55b76adb9abe150c88~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1088\&h=546\&s=2265657\&e=gif\&f=309\&b=000000)

> Demo 地址：<https://codepen.io/airen/full/VwgmVaJ>

正因为 `cubic-bezier()` 函数很灵活，所以要掌握它也不是一件易事。不过大家不用担心，后续我们会专门介绍 `cubic-bezier()` 函数相关的特性、设计和应用。

在这里，你只需要知道我们可以使用 `cubic-bezier()` 函数设计出各式各样的缓动函数即可。

## CSS 缓动函数的类型

缓动函数 `f(x)` 是一个数学函数，其满足 `f(0)=0` 和 `f(1)=1` 的条件，精确描述了在动画期间物体从一个状态到另一个状态之间的移动速率。简单地说，缓动函数是一种用于动画的技术，它在你希望移动的对象上添加加速和减速的效果。主要有四种类型：恒速（`linear`）、加速（`ease-in`）、减速（`ease-out`）和加减速（`ease-in-out`）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eebb3674d6c24bbf97d835277e66aa99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000\&h=338\&s=935870\&e=gif\&f=78\&b=fefefe)

另外，进一步细分的话，它还有七种不同类型的缓动动画，它们分别是：二次缓动（Quadratic）、三次缓动（Cubic）、四次缓动（Quartic）、正弦缓动（Sinusoidal，也叫 Sine）、五次缓动（Quintic）、指数缓动（Exponential）和圆形缓动（Circular）。

注意，只有缓动函数中的加速（`ease-in`）、减速（`ease-out`）和加减速（`ease-in-out`）才有这些细分的缓动动画。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/515f8f3035514bedbad9d1707590a55c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986\&h=644\&s=3186936\&e=gif\&f=122\&b=fefdfd)

CSS 中主要有四种类型的缓动函数：

*   **线性缓动函数**： `linear`

*   **三次贝塞尔函数**：`ease` 、`ease-in` 、`ease-out` 和 `ease-in-out`

*   **阶梯函数（分段函数）** ：`steps()` 、`step-start` 和 `step-end`

*   **自定义缓动函数**：`linear()`

这些缓动函数主要用作于过渡动画的 `transition-timing-function` 或帧动画的 `animation-timing-function` 属性的值。例如：

```CSS
.transition {
    transition-timing-function: linear;
}

.animation {
    animation-timing-function: linear;
}
```

也可以用于简写的 `transition` 和 `animation` 属性上：

```CSS
.transition {
    transition: transform 2s linear;
}

.animation {
    animation: move 2s linear;
}
```

接下来，我们花点时间来看看这几种类型的 CSS 缓动函数。

### 线性缓动函数

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55bc20b6eb7d4e948940ff416a3d80ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=888\&s=171375\&e=jpg\&b=282b3e)

我们在之前的示例中已经介绍过了线性缓动函数（`linear`），所以让我们快速回顾一下。线性缓动函数创建的动画从开始到结束都以恒定速度运动。与其他缓动函数不同，整个动画过程中速度没有变化。速度曲线是一条直线图，这意味着运动物体以恒速移动，没有加速和减速。

正如你可能已经知道的，可以通过在 CSS 中使用 `linear` 关键词轻松设置线性缓动函数。

```CSS
.transition {
    transition-timing-function: linear;
}

.animation {
    animation-timing-function: linear;
}
```

线性缓动函数具有以下几个明显特征：

*   **匀速运动**：线性缓动函数创建的动画以恒定速度运动，动画过程中没有加速或减速

*   **简单直接**：线性缓动函数的速度曲线是一条直线，动画以均匀速度进行，没有起伏，因此非常简单和直接

*   **预测性**：由于恒定速度，开发人员可以轻松地预测和控制动画的行为

其优点是可预测和简单：

*   **预测性**：线性缓动函数具有很高的可预测性，可以精确控制动画的速度和持续时间。

*   **简单性**：它非常简单，易于实现和调整，适用于一些简单的动画需求。

其缺点是，设置线性缓动函数的动画给人感觉是单调乏味，缺乏自然感的：

*   **缺乏自然感**：线性缓动函数通常不具备自然感，因为大多数现实世界中的运动都伴随着加速和减速。

*   **单调乏味**：由于动画速度恒定，可能会显得单调和乏味，缺乏动态性。

而且线性缓动函数是唯一个 `f(x) = x` 的缓动函数，因为它在两点上受限：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c81076fdc864de8bef412d8bb760198~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094\&h=366\&s=485886\&e=gif\&f=165\&b=f9f9f9)

### 三次贝塞尔缓动函数

尽管线性缓动函数（`linear`）有其适用情况，但如果不正确使用或过于频繁使用，可能会使动画看起来单调和不自然。因为用户对自然运动更有反应，即非线性缓动函数可以加速和减速。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cea28bcd62eb4c61a68c05f31f094c1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920\&h=960\&s=1922087\&e=gif\&f=164\&b=e4eefa)

在 CSS 中，我们使用由四个点定义的贝塞尔曲线来设置三次贝塞尔缓动函数。正如我们前面所说的 `cubic-bezier()` 函数，我们可以通过调整其中两个控制点的坐标，来获取各种不同类型的缓动函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a152a410222d4474b2c75c08445d5e61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020\&h=596\&s=1616610\&e=gif\&f=254\&b=f8f8f8)

> 工具地址：<https://cubic-bezier.com>

```CSS
.transition {
    transition-timing-function: cubic-bezier(.49,1.1,.69,.67);
}

.animation {
    animation-timing-function: cubic-bezier(.08,1.34,.95,.03);
}
```

常用的预定义缓动函数，如 `ease` 、`ease-in` 、`ease-out` 和 `ease-in-out` ，都属于三次贝塞尔缓动函数。它们可以用作设置非线性缓动函数的快速方法。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95709ec099ac4b1b8a179bc24569b7de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1437\&s=522756\&e=jpg\&b=282b3e)

*   **`ease`**：它既有加速又有减速，但它们不是均匀的

*   **`ease-in`** ：动画以缓慢的速度开始，逐渐加速，最终达到最大速度。例如，汽车启动就是一个例子

*   **`ease-out`** ：动画以快速开始，然后随着时间减速，有点像球在地板上滚动。不同之处在于， `ease-out` 不显示初始加速

*   **`ease-in-out`** ：开始逐渐加速，然后朝末尾减速

其中 `ease` 是 CSS 缓动函数的默认值，这是一个相当不错的缓动函数！而且它是 `ease-in-out` 缓动函数的一种变种。也就是说，变化在开始和结束时都比较慢，只在中间某个地方加速。使动画能给用户一个很好的感觉。

在 CSS 中，这些预定义的缓动函数也可以使用 `cubic-bezier()` 函数定义：

```CSS
:root {
    --linear: cubic-bezier(0.0, 0.0, 1.0, 1.0);
    --ease: cubic-bezier(0.25, 0.1, 0.25, 1.0);
    --ease-in: cubic-bezier(0.42, 0, 1.0, 1.0);
    --ease-out: cubic-bezier(0, 0, 0.58, 1.0);
    --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1.0);
}
```

这些三次贝塞尔函数提供了更多控制动画外观和效果的选项，使动画更具吸引力和影响力。

尽管预定义的值在许多情况下都很有效，但了解如何创建自定义的三次贝塞尔函数可以让你更多地控制动画的外观和感觉，从而使动画看起来更加引人注目和有影响力。

在“设计缓动函数”一节中，我们有介绍过如何使用 `cubic-bezier()` 函数来设计一条缓动函数（运动曲线）。这里简单的回忆一下。一个三次贝塞尔缓动函数是一种缓动函数，由四个实数定义，这四个实数指定了一个三次贝塞尔曲线的两个控制点 `P1` 和 `P2`。这条三次贝塞尔曲线的端点 `P0` 和 `P3` 被固定在 `(0, 0)` 和 `(1, 1)`。`P1` 和 `P2` 的 `x` 坐标被限制在范围 `[0, 1]`内。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a5c033322f9406d8d428d980839f0ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=1545\&s=382802\&e=jpg\&b=ffffff)

三次贝塞尔缓动函数是一种用于定义缓动动画的函数，这类缓动函数具备以下几个明显特征：

*   三次贝塞尔缓动函数具有非线性的动画速度，可以产生加速和减速的效果，使动画看起来更自然和流畅。

*   它允许在动画的不同阶段定义不同的速度曲线，因为两个控制点的位置可以微调，以满足特定的动画需求。

*   三次贝塞尔缓动函数具有很高的自定义性，可以根据设计要求精确控制动画的速度和效果。

它的优点是自定义性强，并且制作出来的动画更接近现实，给用户感觉更自然流畅：

*   **自定义性强**：三次贝塞尔缓动函数允许 Web 设计师或开发者根据需要创建自定义的缓动效果，以实现独特的动画效果。

*   **自然流畅**：它可以模拟物体在现实生活中的加速和减速运动，使动画看起来更加自然和流畅。

由于其自定义性强，灵活度高，使得 Web 开发在开发动画的时变得更复杂，也难以调整：

*   **难以调整**：创建和微调三次贝塞尔缓动函数可能需要一些数学知识和实验，不太适合初学者。

*   **复杂性**：使用复杂的三次贝塞尔缓动函数可能会增加动画的复杂性，需要更多的测试和调试。

总之，三次贝塞尔缓动函数是一种强大的工具，用于创建自定义、自然流畅的动画效果，但需要一些数学和调试技能。它适合那些希望实现特定动画效果或提高用户体验的项目。

### 阶梯缓动函数

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/053fb8a708d849ee9f43049d95a12917~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=888\&s=168510\&e=jpg\&b=282b3e)

CSS 中的阶梯缓动函数主要有 `step-start` 、`step-end` 和 `steps()` 。阶梯缓动函数是一种将输入时间分成指定数量等长间隔的缓动函数。例如，`steps()` 函数，将输入时间分成指定数量的间隔，因此我们的动画将从一个值跳到下一个值。我们可以指定步数和跳跃位置（可选）以及一系列可能的值。`steps()` 函数还有两个预定义的关键字：`step-start` 和 `step-end`。前者等同于 `steps(1, start)`，而后者等同于 `steps(1, end)`。

换句话说，阶梯缓动函数 `steps()` 允许动画以非常连续的方式跳跃到特定数量的帧之间。你可以将其想象为一种“跳跃”动画。

举个例子，一个轮子 `.wheel` 从点 `A` （初始位置，即 `translate: 0`）移动到点 `B` （终点位置，即 `translate: 1000px`），我们将动画限制为五步，那么动画将跳跃到以下五个关键帧位置：`200px` 、`400px` 、`600px` 、 `800px` 和 `1000px` 。

```CSS
.wheel {
    animation: move 5s steps(5) both;
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ca4247db9b747ccafbc4bdd2dae01c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1180\&h=326\&s=776780\&e=gif\&f=384\&b=000000)

> Demo 地址：<https://codepen.io/airen/full/abXpzqd>

`steps()` 函数还具有一个额外的选项来控制包含哪些关键帧。就像前面的示例中所见，轮子 `.wheel` 的动画从 `0px` 移动到 `1000px`，使用 `5` 个步骤（即 `steps(5)`），将以 `1000px` 的位置结束。如果我们希望动画从 `200px` 开始，我们可以使用`steps()` 函数的第二个参数 `jump-*` 选项。`jump-*` 会影响如何从动画时间轴中选择关键帧。`steps()` 函数的 `jump-*` 选项包括 `jump-start` 、`jump-end` 、 `jump-none` 、 `jump-both` 、`start` 和 `end` ，其中 `start` 和 `jump-start` 表现行为一样，同样的 `end` 和 `jump-end` 表现行为一样。

```CSS
.wheel {
    --jump: jump-start;
    animation: move 5s steps(5, var(--jump)) both;
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f29ea69030c24734bb0dcc78dcfbca94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1266\&h=408\&s=3080207\&e=gif\&f=1270\&b=000000)

> Demo 地址：<https://codepen.io/airen/full/MWLJwKa>

有关于 `steps()` 缓动函数中的第二个参数 `jump-*` 更详细的阐述，我将放到小册后面的课程中。敬请期待！

从上面的示例效果来看，CSS 阶梯缓动函数有着两个明显的特征，即非连续性和控制精确：

*   **非连续性**：阶梯函数将动画分成指定数量的间隔，使动画从一个值跳跃到下一个值。创建非连续的动画，使动画在指定的帧之间跳跃。

*   **控制精确**：可以使用 `steps()` 函数来指定步数和跳跃位置（可选）以控制动画的外观。可以精确地控制动画跳跃到的关键帧位置，以实现特定效果。

它的优点是：

*   阶梯函数非常适合模拟离散的动画，例如模拟物体跳跃、切换帧或模拟机械动作等。

*   它提供了更多的控制选项，允许你自定义动画的节奏和速度。

*   可以用来制作一些有趣和独特的动画效果，如像素化转场或分段的过渡。

其缺点也很明显：

*   由于阶梯函数是离散的，因此在一些情况下可能不适合创建平滑的过渡或动画效果。

*   使用不当可能导致动画显得生硬和不自然。

*   需要更多的调整和试验，以获得所需的效果。

总之，`steps()` 阶梯缓动函数是一种在特定情况下非常有用的工具，可以用于创建离散性质的动画，但需要根据具体情况谨慎使用，以确保动画效果符合预期。例如，CSS 中的雪碧图帧动画（Sprites Animation）一般都是使用 `steps()` 缓动函数来构建的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db90d62e0ae54cc4927abf30503c80ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044\&h=556\&s=1416852\&e=gif\&f=111\&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/ExrZjov>

### 自定义缓动函数

虽然说 CSS 预定定义的缓动函数 `ease` 、`ease-in` 、`ease-out` 和 `ease-in-out` 以及贝塞尔函数 `cubic-bezier()` 可以帮助你构建大部分动画需求，但有时候可能需要更加特定的动画效果，比如弹跳或弹簧效果。那么前面所提到的缓动函数就无法实现了。

正因如此，W3C 规范的 [CSS 缓动函数 Level 2 版本](https://drafts.csswg.org/css-easing/#the-linear-easing-function)新增了 `linear()` 缓动函数。新增的 `linear()` 缓动函数与前面多次提到的 `linear` 缓动函数关键词是完全两个不同的缓动函数。`linear` 制作的动画曲线始终是一条直线，而 `linear()` 函数可以根据动画需要定义一个分段线性函数，可以在指定的点之间进行线性插值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da8895cb7b0143f99de7339f6b5c882e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=888\&s=285203\&e=jpg\&b=282b3e)

换句话说，`linear()` 函数可以让你绘制一个包含任意多个点的运动曲线，以定义自定义的缓动曲线，从而让你能够模拟弹跳和弹簧等更复杂的动画效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b81cb48cc404313ac2e21e61ebfd1fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=888\&s=264988\&e=jpg\&b=282b3e)

这是非常特别的功能，为 CSS 动画和过渡提供了以前无法实现的新可能性。例如，使用 `linear()` 函数模拟出弹跳、弹簧和弹性等动画效果的缓动曲线：

```CSS
:root {
    /* 弹跳缓动曲线 */
    --bounce-easing: linear(
        0, 0.0157, 0.0625, 0.1407, 0.25 18.18%, 0.5625, 1 36.36%, 0.8907, 0.8125,
        0.7657, 0.75, 0.7657, 0.8125, 0.8905, 1, 0.9532, 0.9375, 0.9531, 1, 0.9844, 1
    );
  
    /* 弹簧缓动曲线 */
    --spring-easing: linear(
        0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017,
        1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%,
        1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%,
        0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1
    );
 
    /* 弹性缓动曲线 */
    --elastic-easing: linear(
        0, 0.218 2.1%, 0.862 6.5%, 1.114, 1.296 10.7%, 1.346, 1.37 12.9%, 1.373,
        1.364 14.5%, 1.315 16.2%, 1.032 21.8%, 0.941 24%, 0.891 25.9%, 0.877,
        0.869 27.8%, 0.87, 0.882 30.7%, 0.907 32.4%, 0.981 36.4%, 1.012 38.3%, 1.036,
        1.046 42.7% 44.1%, 1.042 45.7%, 0.996 53.3%, 0.988, 0.984 57.5%, 0.985 60.7%,
        1.001 68.1%, 1.006 72.2%, 0.998 86.7%, 1
    );
}
```

以下是它的实际效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ab325d9b1814fe18971e5b53f128d0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128\&h=492\&s=2199551\&e=gif\&f=118\&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/yLZLYmx>

特别声明，CSS 的 `linear()` 函数是 CSS 的新特性之一，在这节课中无法覆盖到它所有细节，小册后面有一个章节会详细阐述它。

CSS 缓动函数 `linear()` 有着其他缓动函数没有的特点：

*   `linear()` 函数是一种线性缓动函数，它沿着指定的时间间隔内的点之间进行线性插值。

*   可以使用 `linear()` 函数自定义缓动曲线，以实现更复杂的动画效果，如反弹和弹簧效果。

*   `linear()` 函数支持自定义多个点，允许你定义自定义的缓动曲线。

它的优点是：

*   提供更多的自定义选项，使你能够创建自然感觉的 UI 动画。

*   允许你创建各种不同的缓动曲线，以满足特定动画需求。

*   可用于创建自定义的非线性缓动效果，如反弹和弹簧。

其不足之处是需要更多的参数和定义，相对于标准的缓动函数可能需要更多的工作。

## 选择合适的缓动函数

在探讨完可用于动画中的各种缓动函数选项之后，你就会问，有这么多个选项，那么动画开发中使用哪种缓动函数会比较适合？接下来，我们通过一些具体的案例来为大家开发动画选择适合的缓动函数提供相应的参考与指导。

### 与光相关的属性

当对与光相关的属性，如颜色、亮度和不透明度进行动画时，最好使用线性缓动函数 `linear` 。线性缓动函数为这些属性提供了最均匀和一致的过渡效果。例如颜色的过渡动画效果，线性缓动函数将产生最均匀的颜色混合：

```CSS
.animated {
    transition: background-color 200ms linear;
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36c1bb5c77624af4a899bc893b0890ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200\&h=422\&s=5088299\&e=gif\&f=410\&b=7cd4fa)

> Demo 地址：<https://codepen.io/airen/full/rNPjepy>

示例中的三个元素的背景颜色（`background-color`）都是从 `#EA42F7` 过渡到 `#73FBFD` ，它们唯一不同的是使用的缓动函数不同，分别是 `linear` 、`ease-out` 和 `ease-in` 。

尽管非线性缓动函数在动画中可能是理解的，但它们会导致颜色的混合不均匀。从上面的示例中，你不难发现线性缓动函数在很大程度上均匀混合了颜色 `A` （`#EA42F7` ）和颜色 `B` （`#73FBFD`）。但当使用 `ease-out` 时，中间点（颜色过渡的临界点）会更偏左，元素背景颜色很快就由颜色 `A` （`#EA42F7` ）过渡到和颜色 `B` （`#73FBFD`），而使用 `ease-in` 时，中间点会更偏右，元素背景颜色从颜色 `A` （`#EA42F7` ）过渡到和颜色 `B` （`#73FBFD`）用时将会更长：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f72be5aa8b214ed985a1f546a9ae0448~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000\&h=722\&s=201259\&e=jpg\&b=000000)

因此，在大多数情况下，线性缓动函数是最佳选择。

### 旋转

旋转是另一个适用于线性缓动函数 `linear` 的用例。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21dfb28d98fa47128c73b8e9cbd86810~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1164\&h=558\&s=2774992\&e=gif\&f=132\&b=242e88)

> Demo 地址：<https://codepen.io/airen/full/mdvRPgY>

如你所见，上图左侧动画元素的 `animation-timing-function` 应用的是其默认值 `ease` ，元素在旋转时会停顿一下，然后继续旋转，它看上去像一个扁平轮胎，滚动时给用户的感觉是不平滑的。而右侧的动画元素使用的是 `linear` 缓动函数，它在旋转的过程中不会被分散，旋转更加一致，用户的感觉上会更舒服一些。

旋转比光更加微妙，所以说线性缓动函数不总是适用于旋转动画。例如转盘抽奖的示例，使用线性缓动函数就不太适合。在现实生活中，我们转动一个抽奖的转盘时，它慢慢地停下来。因此，对于该动画效果，使用 `ease-out` （减速）要比 `linear` 适合（当然，你也可以使用 `ease` 或 `ease-in-out`）：

```CSS
.wheel {
    --rotation: 0deg;
    rotate: var(--rotation);
    transition: rotate 2s ease-out;
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f970d401e631453a885020de4c31f4e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998\&h=606\&s=7281227\&e=gif\&f=226\&b=41423d)

> Demo 地址：<https://codepen.io/airen/full/poGREoZ>

即便如此，在开发动画过程中，要是碰到旋转相关的动画效果，我仍然建议先选择线性缓动函数，如果不太合适，再进行更改。

### 交互元素

Web 开发者往往喜欢给交互元素添加一些动画效果，这意味着交互元素是一个广泛的动画类别，包括所有可点击、悬停、可拖动等等。我们在给交互元素的动画设置缓动函数时，可以参考下面这些情境给动画选择合适的缓动函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b8b1b9c4c73463ea1046fdf6d337393~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124\&h=632\&s=2415509\&e=gif\&f=173\&b=fafafa)

上图是一个使用恒速（`linear`）缓动函数的动画效果。由于自然界中的物体很少以恒定的速度移动（物体在相同的时间内以相同的距离移动）。这给动画带来一种相当不自然的感觉，几乎像是机械化的。但实际上这正是你想要的吗？例如上图中的效果。你实际上希望火车的速度感觉机械化，以产生火车驶过的幻觉。它还可以用于不受物理影响的元素和对象，用于颜色和不透明度的动画和过渡效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78b35772f92c4e918db71e06aec18b85~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1118\&h=624\&s=1058776\&e=gif\&f=304\&b=efefef)

上图是一个使用加速（`ease-in`）缓动函数的动画效果。动画开始比较缓慢，直到周期结束时间加速。这给人一种加速的感觉。这对于平滑地将对象过渡出视野非常有效，比较适用于从用户屏幕飞出并永远离开屏幕的元素和对象。例如，当用户关闭通知时。不过，它的一个缺点是可能会感到迟缓。

![fig-59.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8c868de147b4a84b1f291275961c46f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1118\&h=614\&s=1089870\&e=gif\&f=197\&b=efefef)

上图是一个使用减速（`ease-out`）缓动函数的动画效果。动画开始得很慢，然后在时间结束前逐渐变慢。这给人一种减速的感觉。这对于将对象称动到视图中并强调重要的视觉信息非常有效，比较适用于屏幕上出现或到达的元素，比如从外部出现的通知。它适用于从屏幕外部滑动到视口的卡片等任何元素。它还非常适用于页面过渡效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7d810ca4e984b668740a811e7cb921c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110\&h=608\&s=1450280\&e=gif\&f=255\&b=efefef)

上图是一个使用 `ease-in-out` 缓动函数的动画效果。动画开始时缓慢，然后在时间的中点之前变得较快，然后再次减速。给人一种先加速后减速的感觉。对于大多数运动，它感觉流畅且响应灵敏。它通常用于将对象从屏幕的一部分移动到另一部分。它还用于元素消失但用户可以将其带回到以前的位置（例如菜单）。最重要的是，它适用于按钮和需要即时反应的元素。不过，它的一个缺点是，当它被应用于所有情况时，可能会感觉不自然或过于完美。

如果 CSS 预定义的缓动函数 `linear` 、`ease` 、`ease-in` 、`ease-out` 和 `ease-in-out` 无法满足你的动画需求，那就需要考虑使用 `cubic-bezier()` 函数。只是它的使用更为复杂，你需要经过不断调试才能令你得到满意的效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56332ff2463548008406820046c8dba5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=412\&s=1019758\&e=gif\&f=52\&b=ffffff)

对于像上图这种动画效果，选择使用 `steps()` 缓动函数会更为适合一些。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a864c87e2c7a47f4bfd0239274b98cfa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3508\&h=2480\&s=4519647\&e=gif\&f=40\&b=7bcfd2)

对于弹跳或弹簧类的动画效果，目前最为合适的是 `linear()` 。

### 常见错误

可以说，互动类动画在 Web 上随处可见，从不缺乏优秀的动画效果，但也有很多动画由于一些小错误，使最终效果差强人意。下面有几种我们常见的错误，如果避免了，可能会解决你 UI 中的大多数动画问题。

首先来看迟钝的交互。

在[介绍 Web 动画基本原理](https://juejin.cn/book/7288940354408022074/section/7288342442284154932)的时候，曾说过，时间和速度都将会影响动画的效果，进而影响交互的效果。例如：

*   对于淡入淡出和颜色动画，使用几乎瞬时的持续时间（小于 `100ms`）

*   对于简单效果和相对较小的动画，使用较短的持续时间，大约在 `100ms ~ 300ms` 。还可以用于用户发起的需要反馈的操作，例如触摸、点击和滑动等

*   对于更复杂的效果和较大规模的动画（如页面过渡或屏幕内外的对象移动），使用较长的持续时间（大于 `300ms`）

*   保留慢动画（大于 `500ms`）用于大幅移动和影响氛围的背景元素

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ec40139648944e18479c1be3e7000ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280\&h=745\&s=64658\&e=jpg\&b=fefbfb)

如上所述，人们认为，如果交互在 `100ms` 内发生，那它是瞬间的（即不慢）。大多 Web 开发者通常情况下，采用调整动画的持续时间（`animation-duration`）来改变动画的播放，从而达到影响动画速度的目的。事实上，除了调整动画播放的持续时间，还可通过调整动画的缓动函数。

我们把重点放在动画的缓动函数上。例如下面两个悬停的交互效果，一个使用了 `ease-in` ，另一个使用了 `ease-out` 。哪一个感觉更“瞬间”（即更快）？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e7f620fb20d4fdbb9a45aaebfefb060~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012\&h=432\&s=726123\&e=gif\&f=134\&b=030303)

> Demo 地址：<https://codepen.io/airen/full/LYqxQpL>

```CSS
@layer animation {
    .tooltips__content {
        translate: -50% 100%;
        opacity: 0;
        transition: 
            opacity .3s var(--easing),
            translate .3s var(--easing);
        
        .tooltips:hover & {
            opacity: 1;
            translate: -50% calc(-100% - 1.5rem);
        }
    }
}
```

也许很难相信，但上面两个悬停动画除了缓动函数之外都是相同的！这两个动画具有相同的持续时间（`transition-duration: .3s`），都没有显式设置延迟时间。但你可以亲自感受到缓动函数在交互感中的巨大差异！

一般来说，对于交互来说，`ease-out` 缓动函数更好，因为它们反应更快。用户能够更容易地注意到变化，因为大多数运动发生在最前面。当然，像所有的经验法则一样，这个规则也可以被打破，而且有数十种情况下，`ease-in` 或 `ease-out` 可以制作更好的动画。但在大多数情况下，为交互选择 `ease-out` 会感觉更“妥当”。

接着再来看“缓动拖动事件”。

拖动事件应该与用户的鼠标或触摸输入实时跟踪。一旦你开始对所有事物添加动画，就很容易陷入为本不应该进行动画的事物添加缓动函数的陷阱中。拖动是一个主要问题。比较带有缓动效果的可拖动控件（上面）和没有缓动效果的（下面）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d4d9cf6ab264288a25c5703e7dae19a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1366\&h=248\&s=273989\&e=gif\&f=227\&b=010101)

并非总是将一切都做成“令人愉悦”的动画，特别是当它们妨碍了更直接的反馈时。因此，应将缓动效果保留给那些真正受益于它们的交互。

最后一点，那就是我们制作的动画不能脱离实现世界的运动。

大多数情况下，将 `ease-out` 作为默认缓动效果会是最佳选择，但何时不是呢？如果组件充当了现实世界物品的比喻，那么动画也应如此。开关是一个常见的例子。想想，你按下的每一个开关或装置开关。在下面这两者中，哪一个感觉像“咔哒”一样，像开关一样？

```CSS
@layer animation {
    input[type="checkbox"]::before{
        transition: translate .3s var(--easing);
    }
  
    input[type="checkbox"]:checked::before {
        translate: calc(var(--w) - 100% - var(--bw) * 2 - var(--p) * 2);
    }
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55aec80f3f96451baa445399463d6a9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950\&h=370\&s=165446\&e=gif\&f=224\&b=000000)

> Demo 地址：<https://codepen.io/airen/full/xxMgYXL>

上例左侧开关使用的是 `ease-out` ，右侧开关使用的是 `ease-in` 。右边的开关更像它所代表的现实世界开关，最初有一点阻力，因为你要克服内部弹簧的阻力，然后潜在能量释放，开关才能迅速进入最终的静止位置。你几乎可以“听到”第二个开关卡嗒地扣在位！再次强调，两个开关的持续时间相同，缓动效果导致了明显的感觉差异。

然而，通过在一开始增加阻力（`ease-in`），我们也在与我们早期的原则之一作斗争——在前期展示更多的运动，以便交互不会感到“滞后”或延迟。因此，我们需要调整精确的缓动效果和时间，以在现实世界的比喻和响应式 UI 之间取得平衡。

我们现在处于主观观点的领域，作为实施者，你有自由探索运动的微妙之处，做出你认为正确的决策。但无论你决定什么，现在你以更加深思熟虑（并受到现实主义启发）的方式来进行动画制作。

再次强调，由于互动是复杂且高度情境化的，很难制定普遍规则。但希望这三个错误能让你思考如何理顺每种情景中的动画效果。但如果有疑问，对于大多数互动，使用默认的 `ease-out` 效果是正确的选择。根据需要进行调整（特别是如果与现实世界的情境有所不同），并永远不要忘记，不使用缓动效果也是一个选择（例如拖拽的示例中）。

现在，你已经意识到了，动画缓动的更具微妙性、普遍性的方法可能包括：

*   缓动帮助人脑注意到变化（例如，物体横穿屏幕的动画将比在一个帧中“瞬移到”更容易察觉），使用它们来提高对动作的识别
*   在前期加入更多的运动和变化也有助于提高识别度（`ease-out`）
*   使动画模仿现实世界（例如，所有物体在移动时都具有动量，并适当加速或（和）减速；开关“卡嗒”地开启和关闭，而不是平稳滑动等）
*   动画引入了输入延迟！因此，只有在用户此刻没有拖动、缩放、滚动时才添加它们

尝试发挥你新学到的技能，你将很快制作更加复杂的动画。

## 调试工具和实用工具

正如我们从三次贝塞尔示例中看到的，我们需要一种工具，可以帮助我们微调三次贝塞尔曲线参数，以便实现我们想要的动画外观和感觉。

在这一部分，我们将介绍浏览器工具和网站等，这些工具应该有助于我们做到这一点。

### 浏览器工具

浏览器开发者工具提供了有用的缓动函数编辑功能。请注意，仅三次贝塞尔函数可供编辑。这些工具提供了快速简单的动画预览，以便开发人员可以获得即时反馈并微调缓动函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5afad55379149dcaa704386a27e1120~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000\&h=496\&s=2462327\&e=gif\&f=385\&b=fcfbfb)

上图所演示的是 Chrome 浏览器如何调整缓动函数。

事实上，Chrome 、Safari 和 Firefox 等现代浏览器除了提供可编辑三次贝塞尔函数工具之外，还提供了专门的动画选项卡，这意味着，[我们可以在浏览器的开发者工具中来调试自己开发的动画](https://developer.chrome.com/docs/devtools/css/animations/)，包括动画属性、持续时间、时间轴、关键帧和延迟等等。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efc6985868954b1e90f218b92b9f2cda~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960\&h=998\&s=60656\&e=gif\&f=47\&b=fbf9f9)

具体如何使用就不在这节课阐述了，我们在后续有一节专门讲调试的课程，到时会有这方面详细的阐述。

### 实用工具

在互联网上有很多优秀的网站为你提供了很多预设的 CSS 缓动函数，你可以将其作为缓动函数的基础，然后微调曲线以获得适应你的动画的缓动曲线。

例如 @Andrey Sitnik 和 @Ivan Solovev 创建的“[Easing Functions Cheat Sheet](https://easings.net/)”：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4610db4331ce442685e95459a026c241~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040\&h=642\&s=985357\&e=gif\&f=162\&b=fcfcfc)

> URL：<https://easings.net/>

以及 [@Lea Verou 提供的三次贝塞尔缓动函数的调试工具](https://cubic-bezier.com/)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96945db8d78f46158dcf995a9292891e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020\&h=596\&s=1616610\&e=gif\&f=254\&b=f8f8f8)

> URL：<https://cubic-bezier.com/>

你可以使用 [@Jake Archibald 创建的 linear() 缓动曲线的生成器](https://linear-easing-generator.netlify.app/)。该生成器可以将 JavaScript 或 SVG 缓动曲线转换为 `linear()` 函数的缓动曲线。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5a92ef25fdb4c6a94412a3169c198ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1178\&h=702\&s=5122754\&e=gif\&f=367\&b=212227)

> URL：<https://linear-easing-generator.netlify.app/>

你还可以使用 [@Meritt Thomas 提供 EpicEasing 工具](https://epiceasing.com/)，它可以称得上是 [@Lea Verou 提供的三次贝塞尔缓动函数的调试工具](https://cubic-bezier.com/)的升级版本，除了允许你调整三次贝塞尔缓动曲线之外，你还可以通过该工具获得类似弹跳和弹簧动画所需的缓动函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf22b24ce5b1493aa63ac37e3256e7a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040\&h=534\&s=7064596\&e=gif\&f=222\&b=000000)

> URL ：<https://epiceasing.com/>

## 小结

缓动函数，或称时间函数（或者动画曲线），通过影响动画速度（速率），改变了动画的外观和感觉。缓动函数使我们能够创建类似自然运动的动画，从而改善用户体验，给用户留下更好的印象。我们已经看到了如何使用预定义的值，如 `linear` 、`ease` 、`ease-in` 、`ease-out` 和 `ease-in-out` 等，快速添加时间函数，以及如何使用 `cubic-bezier()` 和 `linear()` 函数创建自定义缓动函数，以获得更引人注目和有影响力的动画。我们还简单地介绍了阶梯函数（`steps()`），可以用来创建“跳跃”动画（Sprites 动画）。

除了现代浏览器开发者工具所提供的功能之外，互联网上还有很多优秀的在线工具，可以帮助我们简化和优化创建自定义缓动函数过程，因此创建具有流畅动态效果的动画变得比以往更容易。如果尚未尝试过，我建议尝试使用各种缓动函数，并创建自己的缓动函数库。

在这节课中，我们主要探讨的是 CSS 缓动函数的基础知识，主要是以 CSS 预定义缓动函数。正如课程中所说的，要使自己创建的动画更流畅和更吸引用户，那么掌握创建更复杂的、更具自定义的缓动函数技巧是必不可少的。这意味着，我们必须要掌握 `cubic-bezier()` 、`steps()` 和 `linear()` 等函数。

为了能更好的帮助大家掌握和用好 `cubic-bezier()` 、`steps()` 和 `linear()` 等函数，在后续的课程中会单独针对这几个函数进行深入的探讨。下一节课，我们就会围绕着 `cubic-bezier()` 函数展开，你将会更进一步的了解、掌握和用好 `cubic-bezier()` 函数，为自己创建的动画带来更好的效果。
