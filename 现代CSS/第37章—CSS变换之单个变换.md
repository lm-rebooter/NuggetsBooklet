CSS 变换（`transform`）与 CSS 的过渡（`transition`）和 CSS 的动画（`animation`）一起出现在 Web 上，它们主要用于 Web 上动效的制作。十多年以来，这些都是 Web 开发者常用的 CSS 特性。例如，使用 CSS 的 `transform` 可以对元素进行旋转、平移、缩放和扭曲等操作。

对于 Web 开发者而言，使用 `transform` 操作单个函数时，它很容易，也很易于理解。然而，当处理多个值时，就绝非易事，会给 Web 开发者带来繁重的认知负荷。庆幸的是，CSS 通过引入单独的变换属性来解决这种认知负荷。也就是说，我们除了可以使用 CSS 的 `transform` 属性进行旋转、平移和缩放等操作之外，我们还可以使用 `rotate` 、`translate` 和 `scale` 等属性进行旋转、平移和缩放等操作。这些新增的单个变换属性几乎完全消除了使用 `transform` 属性的需要，这是令人难以置信的，因为它们打开了大量的可能性。

在这节课中，我将分解这三个属性是如何工作的(它并不像你想象的那么简单)，并在最后解释为什么它们是如此重要。

首先，让我们回顾一下当前的变换属性（`transform`），然后如何通过使用新的单个变换属性来改进其功能。让我们开始吧。

## 回顾 CSS 的变换属性 transform

CSS 的 `transform` 属性的值主要分为 **[2D 函数](https://www.w3.org/TR/css-transforms-1/#two-d-transform-functions)** 和 **[3D 函数](https://www.w3.org/TR/css-transforms-2/#three-d-transform-functions)**：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5930d842a0fa4c3d9048c649c4ea8f74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1900&h=966&e=jpg&b=ffffff)

在 CSS 中，`transform` 属性通过使用它的函数（比如 `translate()` 、`rotate()` 和 `scale()` 等）可以做很多不同的事情，例如：

-   平移：`translate()` 、`translateX()` 、`translateY()` 、`translateZ()` 和 `translate3d()`
-   旋转：`rotate()` 、`rotateX()` 、`rotateY()` 、`rotateZ()` 和 `rotate3d()`
-   缩放：`scale()` 、`scaleX()` 、`scaleY()` 、`scaleZ()` 和 `scale3d()`
-   扭曲：`skew()` 、`skewX()` 、`skewY()`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4050e9a8f2a944978985e01b3b6776a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1900&h=419&e=jpg&b=ffffff)

这是 `transform` 属性最基础的使用。你也可以尝试在 **[www.moro.es](https://moro.es/)** (变换可视化工具)上调整变换函数对应的参数，可视化查看 CSS 变换各函数的功能和作用：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bd9ccd94f6d45b6bc1dac7d504811f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=754&e=gif&f=475&b=0f191d)

> 变换可视化工具：<https://css-transform.moro.es/>

`transform` 属性除了可以运用单个函数值之外，还可以使用多个组合函数，例如：

```CSS
.element {
    transform: translateX(66vmin) rotate(.125turn) scale(.5) translateY(66vmin);
}
```

> 注意，`transform` 运用多个变换函数时，函数之间需要使用空格符隔开。

上面代码运行效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1df5fbff6b946ddad108a99007419f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=558&e=gif&f=264&b=eff6f8)

> Demo 地址：<https://codepen.io/airen/full/LYMVXYV>

正如你所看到的，元素 `.element` 先沿着 `x` 轴向右平移了 `66vmin` ，然后旋转 `0.125turn` ，再缩小 `0.5` 倍，最后沿着 `y` 轴向下平移 `66vmin` 。注意，该示例整个操作都是基于元素正中心的，这是因为 `transform-origin` 属性的值为 `50% 50%` 。

当你对元素执行变换时，从技术上讲，你并没有修改元素本身，你只是正在影响它的坐标系。它并不会影响元素盒子自身的大小，以及它所占的空间大小。

在 Web 上，使用 `transform` 可以调整 UI 外观之外，更多的时候是用于 Web 动效的制作中。比如下面这个简单的动效，即“月球绕着地球转”：

```HTML
<div class="orbit">
    <div class="moon"><!-- 月球 --></div>
    <div class="planet"><!-- 地球 --></div>
</div>
```

```CSS
@layer animation {
    @keyframes moonOrbit {
        from {
            transform: rotate(0deg) translateX(200px);
        }
        to {
            transform: rotate(360deg) translateX(200px);
        }
    }
    
    .moon {
        animation: moonOrbit 6s linear infinite;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7577a1d346ad4291b3167ab9970bc70f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=598&e=gif&f=72&b=13171f)

> Demo 地址：<https://codepen.io/airen/full/LYMVaqW>

在这个例子中，首先将月球（`.moon`）定位在地球（`.planet`）的正中心。然后在 `@keyframes` 中把月球向右平移 `200px` ，然后使它在一个圆圈中旋转。因为月球是绕着地球的中心旋转，所以它绕地球运行的距离是一样的。

## transform 属性的局限性

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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87227a6e768340f4a2f770934308d782~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=548&e=gif&f=136&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/YzdXbLz>

不难发现，当用户鼠标悬浮在元素上时，只有放大的效果，而原本的旋转效果被丢失了。这是因为 `:hover` 状态下的 `transform` 覆盖了默认状态下的 `transform` 。如果要改变这一现象，我们不得不在 `:hover` 状态下保留 `transform` 属性的初始值：

```CSS
.element {
    transform: rotate(45deg);
    
    &:hover {
        transform: rotate(45deg) scale(1.5);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4131883dd804bbda752d85a5fc65865~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=500&e=gif&f=77&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/GRPJawq>

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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/122f388450b84407879d9135b8a5758e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=512&e=gif&f=125&b=676689)

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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af360334b3bd4f97a144ad68fab9f60e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=622&e=gif&f=114&b=6f6e91)

这是因为运用于模态框的 `transform` 并不是最初设置的值（`transform: translate(-50%,-50%)`），而是被 `@keyframes` 中最后一帧的 `transform` 属性值（`translate3d(0,0,0)`）覆盖了。如果要让添加了 `bounceInDown` 动效的模态框，在动效结束之后依旧在浏览器视窗中水平垂直居中，我们不得不改变水平垂直居中的布局方案，或者调整 `bounceInDown` 动画中每一帧的 `transform` 的值，例如：

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
            transform: translate3d(-50%, calc(-3000px - 50%), 0) scaleY(3);
        }
    
        60% {
            opacity: 1;
            transform: translate3d(-50%, calc(25px - 50%), 0) scaleY(0.9);
        }
    
        75% {
            transform: translate3d(-50%, calc(-10px - 50%), 0) scaleY(0.95);
        }
    
        90% {
            transform: translate3d(-50%, calc(5px - 50%), 0) scaleY(0.985);
        }
    
        to {
            transform: translate3d(-50%, -50%, 0);
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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97124ee88a7048e69c05080f2d1cc55f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=514&e=gif&f=139&b=676689)

> Demo 地址：<https://codepen.io/airen/full/rNoOMWL>

这对于 Web 开发者来说是痛苦的，而且也是易于出错的。

> 注意，在 CSS 中有很多种方式可以实现水平垂直居中，比如 **[CSS Flexbox](https://juejin.cn/book/7161370789680250917/section/7161623855054716935)** 或 **[CSS Grid](https://juejin.cn/book/7161370789680250917/section/7161624078397210638)** 中就有多不同的方案。换句话说，示例中的模态框（`dialog`）不使用 `transform` 制作水平垂直居中，就可以完全避免上面示例所呈现的现象。不过，课程中使用 `transform` 来实现，是为了更好的通过示例告诉大家，在使用 `transform` 时，你将在实际生产中，将会碰到哪些挑战！

`transform` 属性使用组合变换函数（同时包含多个变换函数）时，将会带来另一个挑战。因为，`transform` 属性包含多个变换函数时，**它的顺序很重要，变换函数将按顺序应用**。从 [W3C 的规范中](https://www.w3.org/TR/css-transforms-1/#transform-rendering)，我们可以获知，变换函数（`translate()` 、`rotate()` 等）是从左向右应用的，即**从左到右乘以变换属性中的每个变换函数**。

这一事实可能令人惊讶，因为应用相同的转换函数可能会导致不同的视觉效果，这取决于它们的顺序。例如：

```CSS
.box1 {
    transform: 
        translate(var(--translateX), var(--translateY)) 
        scale(var(--scaleX), var(--scaleY)) 
        rotate(var(--deg));
}
​
.box2 {
    transform: 
        rotate(var(--deg))
        scale(var(--scaleX), var(--scaleY)) 
        translate(var(--translateX), var(--translateY)) ;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9df4f59c6d764cf1be5bffa50792a1d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=614&e=gif&f=461&b=4b496a)

> Demo 地址：<https://codepen.io/airen/full/GRPJwmv>

假设上面示例中的各参数的值为：

```CSS
.box {
    --translateX: 80px;
    --translateY: 80px;
    --scaleX: 1.5;
    --scaleY: 1.5;
    --deg: 45deg;
}
```

那么 `transform: translate(80px, 80px) scale(1.5, 1.5) rotate(45deg)` 和 `transform: rotate(45deg) scale(1.5, 1.5) translate(80px, 80px)` 对应的效果如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f6751b72a11422392836f798d66094f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2255&h=1971&e=jpg&b=555674)

事实上，你可通过嵌套元素获得相同的效果。例如 `transform: translate(80px, 80px) scale(1.5, 1.5) rotate(45deg)` 对应的嵌套关系如下所示：

```HTML
<div style="transform: translate(80px, 80px)">
    <div style="transform: scale(1.5, 1.5)">
        <div class="transform: roate(45deg)"></div>
    </div>
</div>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4a179aaf7ee4610bfdc07a888934529~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2255&h=1005&e=jpg&b=555674)

> Demo 地址：<https://codepen.io/airen/full/zYyGebb>

随着变换变得越来越复杂，使用的变换函数也越来越多，管理 `transform` 属性就变得越来越困难。以多帧动画为例:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e18cec6c34f40d18a688b447595513e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=386&e=gif&f=127&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/OJryRZG>

当创建具有多个变换值的动画时，在每一帧中以正确的顺序管理每个属性的认知负荷可能会成为相当大的负担。因为顺序一旦出错，整个效果就会出错。

```CSS
@layer animation {
    @keyframes animate {
        10%,
        15% {
            transform: translateX(0);
        }
        16% {
            transform: translateX(0) scale(0.5);
        }
        18% {
            transform: translateX(0) scale(1.5);
        }
        20% {
            transform: translateX(0) scale(1);
        }
        50% {
            transform: translateX(50%) scale(1) rotate(180deg);
        }
        65% {
            transform: translateX(-50%) scale(1) rotate(180deg);
        }
    }
    
    @keyframes animate-alt {
        10%,
        15% {
            transform: translateX(-150%);
        }
        16% {
            transform: translateX(-150%) scale(0.5);
        }
        18% {
            transform: translateX(-150%) scale(1.5);
        }
        20% {
            transform: translateX(-150%) scale(1);
        }
        50% {
            transform: translateX(-150%) scale(1) rotate(-180deg);
        }
        65% {
            transform: translateX(-50%) scale(1) rotate(-180deg);
        }
    }
​
    .animation {
        &::before {
            animation: animate 5s linear infinite;
        }
        &::after {
            animation: animate-alt 5s linear infinite;
        }
    }
}
```

这些挑战和认知负荷似乎可以通过引入 CSS 单个的变换属性来消除。

## 单个变换属性的简介

W3C 的 **[CSS 变换模块 Level 2](https://www.w3.org/TR/css-transforms-2/)** （CSS Transforms Module Level 2）为 CSS 的变换新增了一个特性，即 **[单个变换属性](https://www.w3.org/TR/css-transforms-2/#individual-transforms)**。单个变换属性主要包括 `translate` 、`rotate` 和 `scale` 三个属性，分别映射 `transform` 属性的 `translate()` 、`rotate()` 和 `scale()` 三个函数。

> 注意，并非 `transform` 属性的所有变换函数都有匹配的单独变换属性，例如 `skew()` 和 `matrix()` 函数。

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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e57ffcbebbe4c22b05560f304b68cb7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2255&h=1408&e=jpg&b=555674)

> Demo 地址：<https://codepen.io/airen/full/OJryRGK>

正如你所看到的，使用 `transform` 和单个变换属性最终效果都是一样的，即元素做了一次平移，一次旋转和一次缩放。但相对而言，单个变换属性要比 `transform` 属性使用组合值要好得多。其中一个原因是方便，Web 开发者不是总在一个 `transform` 中包含所有内容。对于某些代码库，这可能更清晰或更具可读性。除此之外，单个变换属性是相互独立的，Web 开发者可以按自已认为合适的方式来自由地组合那些不同的变换属性。例如：

```CSS
.element {
    translate: 100px 100px;
    rotate: 45deg;
    scale: 1.1;
}
​
/* 等同于 */
.element {
    rotate: 45deg;
    scale: 1.1;
    translate: 100px 100px;
}
```

当然，Web 开发者同样可以使用单个变换属性构建出复杂的动画效果，并且省去了不少的麻烦。简单地说，使用单个变换属性好处总比使用 `transform` 属性好得多。稍后我将会以具体实例来解释它。

## 单个变换属性的使用

在阐述单个变换属性的益处之前，我们先来了解一下单个变换属性如何使用。

### 缩放：scale

让我们从三个新属性中最简单的一个开始，即缩放属性 `scale` 。它的工作原理与 `scale()` 函数完全相同：

```CSS
scale: none | [ <number> | <percentage> ]{1,3}
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
​
/* 指定两个值 */
.scale {
    scale: 2 .5; /* x = 2, y = .5, z = 1*/
    
    /* 等同于 */
    transform: scale(2, .5);
}
​
/* 指定三个值 */
.scale {
    scale: 1.2 2 .5; /* x = 1.2, y = 2, z = .5*/
    
    /* 等同于 */
    transform: scale3d(1.2, 2, .5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf68245a4bb3457cb84218a605985482~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942&h=486&e=gif&f=270&b=4a4869)

> Demo 地址：<https://codepen.io/airen/full/NWeGbab>

### 平移：translate

接下来是 `translate` 属性，其**大部分工作原理**与 `translate()` 函数完全相同：

```CSS
translate: none | <length-percentage> [ <length-percentage> <length>? ]?
```

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
​
/* 两个值 */
.translate {
    translate: 100px 200px; /* x = 100px, y = 200px, z = 0 */
    
    /* 等同于 */
    transform: translate(100px, 200px);
}
​
/* 三个值 */
.translate {
    translate: 100px 200px 50px; /* x = 100px, y = 200px, z = 50px */
    
    /* 等同于 */
    transform: translate3d(100px, 200px, 50px);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a45d623385ea45e195d3c83a6bffa783~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1008&h=596&e=gif&f=333&b=4b496a)

> Demo 地址：<https://codepen.io/airen/full/xxmwRyB>

### 旋转：rotate

相对而言，旋转 `rotate` 属性的使用要比缩放 `scale` 和平移 `translate` 属性复杂一些。`rotate` 属性接受一个角度来旋转元素，也可以接受一个轴来旋转元素：

```CSS
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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a93b528d8c32449e9102f48c9dc16f9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=480&e=gif&f=580&b=4a4869)

> Demo 地址：<https://codepen.io/airen/full/YzdyZRJ>

## 单个变换属性的优势

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

![fig-19.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5beca226251241fdbeb850afa4eb33e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=944&h=528&e=gif&f=67&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/OJrymRV>

其次，单个变换属性和 CSS 的 `transform` 属性有一个关键性的区别，那就是单个变换属性对于顺序不是那么的重要，即顺序不是声明它们的顺序，它们的顺序总是相同的：**首先平移（向外），然后旋转，然后缩放（向内）** 。

这意味着，下面两个代码片段最终的结果是相同的：

```CSS
.transform--individual {
    translate: 50% 0;
    rotate: 30deg;
    scale: 1.2;
}
​
.transform--individual-alt {
    rotate: 30deg;
    translate: 50% 0;
    scale: 1.2;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28c664f82dd84aa09edad450f9cc4d15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2255&h=1345&e=jpg&b=555674)

> Demo 地址：<https://codepen.io/airen/full/bGOVWWe>

在这两种情况下，目标元素将首先沿着 `x` 轴向右平移 `50%` ，然后旋转 `30deg` ，最后放大 `1.2` 倍。

单个变换属性还有一个优势是，使得 Web 开发者开发动效时变得更简单，更清晰。例如，你要给目标元素添加下面这样的一个动画效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06c5c9af25354ab58d71b257d401e370~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1295&e=jpg&b=f6f6f6)

在没有单个变换属性之前，使用 `transform` 属性的 `translate()` 、`rotate()` 和 `scale()` 函数实现这个动画，就必须计算所有定义的变换的中间值，并在每个关键帧中包含它们：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/201ab7cafadb416b9f3d987f86e6419b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1011&e=jpg&b=f6f6f6)

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
​
.animation {
    animation: animation 2s linear both;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14e210995dd140cdbff096f424da525c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=482&e=gif&f=189&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/abPvWex>

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
​
.animation {
    animation: animation 2s linear both;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3cc2eac47d240c4805dfc3207653d0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=462&e=gif&f=200&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/zYyvzKQ>

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
​
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
​
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
​
.animation {
    animation: 
        translate 2s linear both,
        rotate 2s linear both,
        scale 2s linear both;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/637c5243e602484e8c3dc766c14fb5de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=464&e=gif&f=104&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/zYyvMMY>

由于这种分离，你可以根据需要应用每一组单独的关键帧，因为单个变换属性不会相互覆盖。在此基础上，你可以为每个变换提供不同的时间，而无需重写全部内容。

```CSS
.animation {
    animation: 
      translate 2s linear both,
      rotate 3s  cubic-bezier(0.54, -0.39, 0.49, 1.58) both,
      scale 1s cubic-bezier(0, 0, 1, -0.27) both;
    animation-composition:accumulate;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/054d7300fa894a58b2bf217692f1cacf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=454&e=gif&f=176&b=ffffff)

> Demo 地址：<https://codepen.io/airen/full/ExGVOrj>

注意，在这个示例中，我们还使用了动画合成（`animation-composition`）的特性，小册后面有一个章节会详细阐述这方面的特性，敬请期待！

## 单个变换属性的限制

单个变换属性 `translate` 、`rotate` 和 `scale` 不能像 `transform` 属性那样接受组合值，所以单个变换属性在元素上只能使用一次。例如：

```CSS
.translate {
    translate: 30px;
    translate: 40px;
    translate: 50px;
}
​
.transform {
    transform: 
        translate(30px)
        translate(40px)
        translate(50px);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03b7a86e057249c4bf5f4f2df5d49e5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2255&h=1014&e=jpg&b=555674)

> Demo 地址：<https://codepen.io/airen/full/qBLOQza>

正如你所看到的，相同的单个变换属性同时出现在一个元素上时，会根据 CSS 的级联规则，出现在后面的属性会覆盖前面的。但 `transform` 属性中不会存在该现象，因为 `transform` 属性允许出现多个变换函数的组合值，相同的变换函数也是一样，当相同的变换函数出现在 `transform` 属性上时，它们会做加法计算。也就是说，当你想要给元素添加多个变换属性时，你需要使用 `transform` 属性。例如，你需要实现下面这样的一个变换效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/844798344fff4701b9bb2ea492029c7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=558&e=gif&f=264&b=eff6f8)

> Demo 地址：<https://codepen.io/airen/full/LYMVXYV>

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

有一个细节我们需要注意，`0` 值在单个变换属性中的使用。稍微熟悉 CSS 的 Web 开发者都知道，当属性的值为 `0` 时，可以不显式设置单位值，比如 `0px` 和 `0rem` 是等同的。同样的，在 `transform` 属性的变换函数 `translate()` 和 `roate()` 等函数中设置 `0` 值时，也可以不显式设置单位，例如：

```CSS
.element {
    transform: rotate(0) scale(1.1) translate(0);
}
```

但在单个变换属性 `rotate` 属性上使用 `0` 值时，必须带上单位 `deg` 、`turn` 、`grad` 或 `rad` ，否则该规则会被视为无效规则：

```CSS
/* ❌ 无效规则 */
.element {
    rotate: 0; /* 未显式设置单位会被视为无效规则 */
}
​
/* ✅  有效规则 */
.element {
    rotate: 0deg; /* 显式指定了单位 */
}
```

注意，`translate` 属性设置 `0` 值时不会有此现象，但我个人习惯性会在 `translate` 属性设置 `0` 值时也显式指定一个单位，比如 `%` ：

```CSS
.element {
    translate: 0%;
}
```

到目前为止，CSS 只引入了 `translate` 、`rotate` 和 `scale` 三个单个变换属性，但其余的变换函数（例如 `skew()` 和 `matrix()` 等）并没有对应的单个变换属性。因此，单个变换属性和 `transform` 属性可以一起工作。例如：

```CSS
.element {
    rotate: 45deg;
    transform: rotate(45deg);
}
```

你会发现，上面的代码做了两次旋转，最终元素旋转 `90deg` ，等同于：

```CSS
.element {
    rotate: 90deg;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d6485218696428e9ae0d66c0722857e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=578&e=gif&f=178&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/oNJjJZe>

正如你所看到的，它们是一个叠加的过程，而不是一个覆盖的过程。因此，下面代码最终获得的效果是一样的：

```CSS
.transform {
    transform: rotate(30deg) translate(10px,10px);
}
​
.individual--transform {
    rotate: 30deg;
    translate: 10px 10px;
}
​
.individual-and-transform {
    rotate: 30deg;
    transfrom: translate(10px, 10px);
}
```

也就是说，当单个变换属性 `translate` 、`rotate` 、`scale` 和 CSS 的 `transform` 属性同时使用时，它们会涉及到一个计算过程：“**单个变换属性首先会被应用（`translate`，`rotate`，然后 `scale`），最后应用** **`transform`**”。

其实，在 CSS 中，除了使用 CSS 的 `transform` 以及单个变换属性可以随心所欲地对元素进行平移、旋转和缩放之外，CSS 的 `offset` 属性也可以有效地平移和旋转元素，只不过它们的工作方式有所不同。尽管 `offset` 以不同的方式工作，但它以类似 `transform` 方式有效地在从标系统上应用变换。因此，它们也依赖于其他四个变换属性（`translate` 、`rotate` 、`scale` 和 `transform`）所使用的相同变换源点，即 `transform-origin` 。

> 注意，`offset` 是一个简写属性，设置了沿定义的路径为元素设置动画所需的所有属性。将会在路径动画一节课中详细介绍！

如此一来，单个变换属性、`transform` 和 `offset` 一起对一个元素进行平移、旋转、缩放等操作时，三个新的独立变换属性（`translate` 、`rotate` 和 `scale` ）发生在 `offset` 属性之前，`transform` 属性则会应用在 `offset` 属性之后：

-   ①: `translate`
-   ②：`rotate`
-   ③：`scale`
-   ④：`offset` （距离 、锚定和旋转）
-   ⑤：`transform` （按指定顺序应用函数）

即：“`translate` ➟ `rotate` ➟ `scale` ➟ `offset` ➟ `transform`”。[在定义如何计算变换矩阵的规范中对这方面有详细的阐述](https://www.w3.org/TR/css-transforms-2/#ctm)。

我们来看两个这方面的示例。假设，你有一个路径动画，它分别与 `transform:translate(25px, -35px)` 和 `translate: 25px -35px` 结合使用，将会产生不同的视觉效果：

```CSS
@keyframes distance {
    100% {
        offset-distance: 100%;
    }
}
​
.pathed {
    offset-path: path('M0,0 C40,240 200,240 240,0');
    animation: distance 4000ms infinite alternate ease-in-out;
}
​
.transformed {
    transform: translate(25px, -35px);
}
​
.translated {
    translate: 25px -35px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb3aed0e4fdf4500a7caf2cf6e926bb7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=560&e=gif&f=152&b=fefefe)

> Demo 地址：<https://codepen.io/airen/full/poqgzdP>

## 单个变换属性的 transform-origin

在变换元素时，通常还会使用 CSS 的 `transform-origin` 。该属性可以用来指定变换原点位置，默认是元素的中心位置。例如围绕着元素中心点旋转 `45deg` ，我们可以不显式设置 `transform-origin` 的值：

```CSS
.rotate {
    rotate: 45deg;
}
```

如果你并不希望元素围绕着中心点旋转，而是希望它围绕着元素左上角旋转，那么就可以通过改变 `transform-origin` 属性的值：

```CSS
.rotate {
    rotate: 45deg;
    transform-origin: left top; /* left top = 0 0 */
}
```

`transform-origin` 属性的使用类似于 `background-origin` ，也和 `background-position` 属性相似，它可以设置关键词（比如 `left` 、`top` 、`right` 、`bottom` 、`center` 等），也可以是长度值（比如 `100px`、`10vmin` 等），还可以百分比值，比如 `10%` 。

`transform-origin`属性可以使用一个，两个或三个值来指定，其中每个值都表示一个偏移量。如果定义了两个或更多值并且没有值的关键字，或者唯一使用的关键字是 `center`，则第一个值表示水平偏移量，第二个值表示垂直偏移量：

-   一个值：必须是 `<length>`，`<percentage>`，或 `left` 、 `center`、`right`、 `top` 、`bottom`关键字中的一个。
-   两个值：其中一个必须是 `<length>`，`<percentage>`，或 `left`、`center`、 `right` 关键字中的一个；另一个必须是 `<length>`，`<percentage>`，或 `top`、`center`、 `bottom` 关键字中的一个。
-   三个值：前两个值和只有两个值时的用法相同；第三个值必须是 `<length>`。它始终代表 `z` 轴偏移量。

```CSS
/* 一个值 */
transform-origin: 2px;
transform-origin: bottom;
​
/* 两个值 */
/* x-offset | y-offset */
transform-origin: 3cm 2px;
​
/* x-offset-keyword | y-offset */
transform-origin: left 2px;
​
/* x-offset-keyword | y-offset-keyword */
transform-origin: right top;
​
/* y-offset-keyword | x-offset-keyword */
transform-origin: top right;
​
/* 三个值 */
/* x-offset | y-offset | z-offset */
transform-origin: 2px 30% 10px;
​
/* x-offset-keyword | y-offset | z-offset */
transform-origin: left 5px -3px;
​
/* x-offset-keyword | y-offset-keyword | z-offset */
transform-origin: right bottom 2cm;
​
/* y-offset-keyword | x-offset-keyword | z-offset */
transform-origin: bottom right 2cm;
```

你可以尝试改变示例中的选项值，查看 `transform-origin` 给旋转元素带来的变化：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07d5c17fdb674e689c99058a22603dac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=514&e=gif&f=418&b=4b496a)

> Demo 地址：<https://codepen.io/airen/full/PoXZYeq>

也可以在下面示例中的虚线矩形框中任意位置按下鼠标左键，查看 `transform-origin` 的变化，以及其对旋转元素的影响：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca34d6178d5c45abbcd3fc93f8fba7b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044&h=672&e=gif&f=324&b=dff0f8)

> Demo 地址：<https://codepen.io/airen/full/YzdwKJm>

`transform-origin` 属性同样可以作用于单个变换属性，并且总是以相同的顺序应用（即 `translate` ➟ `rotate` ➟ `scale` ），并且它们发生在 `transform` 属性中的所有内容之前：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ea927e09d464075aafc0f3262ab2bf8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=716&e=gif&f=385&b=fefefe)

> Demo 地址：<https://codepen.io/airen/full/LYMGPMv>

同样的，`transform-origin` 属性对 `offset-rotate` 也是有相应影响的，比如下面这个路径动画，`transform-origin` 为 `50% 50%` 和 `0% 0%` 的视觉效果是有一定差异的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78cce403e15b496eaebf6562ec6f2091~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=746&e=gif&f=154&b=fefefe)

> Demo 地址：<https://codepen.io/airen/full/zYyrOeJ>

## 使用 CSS 自定义属性来模拟单个变换属性

虽然 CSS 引入了 `translate` 、`rotate` 和 `scale` 三个单个变换属性，但并没有相应的 `skew` 属性。可我们在实际生产过程中，会需要更多的单个变换属性功能。庆幸的是，在 CSS 中有种方法可以从 `transform` 属性中分离出单个变换函数。拿旋转为例吧，Web 开发人员希望能够在不影响先前设置的变换情况之下重新设置新的旋转。就目前为止，除了使用新的单个变换属性之外，还有另外一种方法，即 **[CSS 原生自定义属性](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)** **或** **[CSS Houdini 自定义属性](https://juejin.cn/book/7223230325122400288/section/7259668493158023205)** 。接下来，我们来看看自定义属性和实际单个变换属性之间有何差异。

### 实际单个变换属性

首先来看真正的单个变换属性，即 `translate` 、`rotate` 和 `scale` ，它们可以单独处理，因此也可以分别进行动画和变换。例如：

```CSS
.individual--transform {
    translate: 40px 66vmin;
    rotate: 45deg;
    scale: 1.5;
}

.one--transform {
    transform: translate(40px, 66vmin) rotate(45deg) scale(1.5);
}
```

就上面代码而言，这两个规则集的效果是等同的。现在，无论何时我们想要修改变换，比如悬浮状态下调整 `scale` 的值，我们只需要更改所需的变换属性即可：

```CSS
.individual--transform {
    translate: 40px 66vmin;
    rotate: 45deg;
    scale: 1.5;
}

.individual--transform:hover {
    scale: .9;
}

.one--transform {
    transform: translate(40px, 66vmin) rotate(45deg) scale(1.5);
}

.one--transform:hover {
    transform: translate(40px, 66vmin) rotate(45deg) scale(.9);
}
```

它的优点是：

-   语法简单
-   可以独立改变变换

缺点是：

-   没有独立的扭曲变换 `skew` 和矩阵变换 `matrix`
-   每个独立的变换属性只能使用一次，如果需要多次使用同一个变换，则必须使用 `transform` 属性
-   总是按以下顺序应用变换： `translate` ➟ `rotate` ➟ `scale` ，如果你需要一个不同的变换顺序，也必须使用 `transform` 属性

### CSS 自定义属性

我们在介绍 [CSS 原生自定义属性](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)的时候，曾介绍过 [CSS 自定义属性的一个特性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)，它可以用来分解简写属性。拿 `box-shadow` 属性为例，它并没有相应的子属性，比如 `box-shadow-color` 来改变阴影颜色。不过，我们可以使用 CSS 自定义属性来模拟：

```CSS
.box-shadow {
    --shadow-x: .2em;
    --shadow-y: .2em;
    --shadow-blue: .2em;
    --shadow-spread: .2em;
    --shadow-color: rgb(0 0 0);
    
    box-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-spread) var(--shadow-color);
}
```

此时，你希望在悬浮状态下改变阴影颜色时，只需要这样做即可：

```CSS
.box-shadow {
    --shadow-x: .2em;
    --shadow-y: .2em;
    --shadow-blue: .2em;
    --shadow-spread: .2em;
    --shadow-color: rgb(0 0 0);
    
    box-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-spread) var(--shadow-color);
    
    &:hover {
        --shadow-color: rgb(120 0 0 / .5);
    }
}
```

这个思路同样可以运用于 `transform` 属性上，这样一来，我们就可以指定变换的顺序，也可以做任意多的变换。例如：

```CSS
.using-custom-properties {
    --translate-x: 40px;
    --translate-y: 10vmin;
    --rotate: 45deg;
    --scale: .9;
​
    transform:
        translateX(var(--translate-x, 0))
        translateY(var(--translate-y, 0))
        rotate(var(--rotate, 0deg))
        scale(var(--scale, 1))
        translateX(var(--end-translate-x, 0));
}
​
.using-custom-properties:hover {
    --end-translate-x: 5px;
}
```

我们甚至可以在 `transition` 上使用单个变换，这样就可以使 `transform` 有一个特别的过渡（`transition`）效果，例如给缩放、旋转设置不是的持续时间（`transition-duration`）、过渡函数（`transition-timing-function`）和延迟时间（`transition-delay`）。例如：

```CSS
 .using-custom-properties {
    --translate-x: 40px;
    --translate-y: 10vmin;
    --rotate: 45deg;
    --scale: .9;

    transform:
        translateX(var(--translate-x, 0))
        translateY(var(--translate-y, 0))
        rotate(var(--rotate, 0deg))
        scale(var(--scale, 1))
        translateX(var(--end-translate-x, 0));
    transition:
        var(--rotate) 2s cubic-bezier(0.9, -0.48, 1, 1),
        var(--scale) 1s linear 1s;
}

.using-custom-properties:hover {
    --end-translate-x: 5px;
}
```

我们来看一个真实的示例：

```CSS
/* 不符合预期的效果，后面的 transfrom 会覆盖前面的 transform */
@layer transform.actual {
    .actual {
        transform: translateY(-150%);
    
        &:hover {
            transform: scale(0.8);
        }
    
        &:active {
            transform: rotate(-5deg);
        }
    }
}

/* 以下是符合预期的效果 */

/* 方案一： 使用 transform, 不同状态需要复制变换函数 */
@layer transform.transform {
    .transform {
        transform: translateY(-150%);
    
        &:hover {
            transform: translateY(-150%) scale(0.8);
        }
    
        &:active {
            transform: translateY(-150%) scale(1) rotate(-5deg);
        }
    }
}

/* 方案二：单个变换属性 translate、rotate 和 scale */
@layer transform.individual-transform {
    .individual--transform {
        translate: 0 -150%;
    
        transition: 
            translate 125ms ease-out, 
            scale 125ms ease-out,
            rotate 125ms ease-out;
    
        &:hover {
            scale: 0.8 0.8;
        }
    
        &:active {
            rotate: -5deg;
        }
    }
}

/* 方案三：CSS 自定义属性模拟单个变换属性 */
@layer transform.custom-property {
    .custom-property {
        --y: -150%;
        --scale: 1;
        --rotation: 0deg;
    
        transform: translateY(var(--y)) scale(var(--scale)) rotate(var(--rotation));
        
        &:hover {
            --scale: 0.8;
        }
        
        &:active {
            --rotation: -5deg;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1673d257a15a4c499389f8bea84cadaf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1396&h=444&e=gif&f=373&b=17181c)

> Demo 地址：<https://codepen.io/airen/full/JjwGjjV>

这个方案的优点是：

-   允许任意数量的变换
-   没有顺序的限制，你想用什么顺序都行

其缺点是：

-   需要预先考虑所有潜在的变换
-   在 `@keyframes` 和 WAAPI 中无法正常工作

CSS 自定义属性在 `@keyframes` 中无法正常工作这一点在小册的《[36 | CSS 自定义属性：@property](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)》一节课中做过详细阐述。来看一个简单示例：

```CSS
.animation {
    --translateY: 0px;
    --scale: 1;
    --rotate: 0deg;
    transform: translateY(var(--translateY)) scale(var(--scale)) rotate(var(--rotate));
    animation: move-it 1000ms linear both
}
​
@keyframes move-it {
    25% {
        --translateY: 20vmin;
    }
    
    50% {
        --scale: 1;
    }
  
    100% {
        --scale: .8;
        --rotate: 90deg;
    }
}
```

整个动画效果是非常生硬的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7cc2411962b4a72933cbf6d6a91684c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=452&e=gif&f=108&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/yLGeyam>

我们可以使用 `@property` 或 `CSS.registerProperty()` 来定义自定义属性，并且指定其值类型，自定义属性在 `@keyframes` 中得到较好的工作，也可以很容易地修复上面示例所碰到的现象。比如下面这个示例：

```CSS
CSS.registerProperty({
    name: '--translate',
    syntax: '<length>',
    inherits: false,
    initialValue: '0px'
});
​
CSS.registerProperty({
    name: '--rotate',
    syntax: '<angle>',
    inherits: false,
    initialValue: '0deg'
});
​
CSS.registerProperty({
    name: '--scale',
    syntax: '<number>',
    inherits: false,
    initialValue: '1'
});
@layer animation {
    @keyframes move {
        100% {
            --translate: 75vmin;
        }
    }
    
    @keyframes other {
        50% {
            --scale: 0.8;
        }
        75% {
            --rotate: 180deg;
        }
        100% {
            --rotate: 120deg;
        }
    }
    
    .animation {
        --scale: 1;
        --translate: 0vmin;
        --rotate: 0deg;
        
        transform: 
            scale(var(--scale)) 
            translateX(var(--translate))
            translateY(calc(var(--translate) / 2)) 
            rotate(var(--rotate));
        animation: 
            move 2000ms infinite alternate ease-in-out,
            other 1400ms infinite alternate ease-in-out;
        animation-composition: accumulate;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17635a79b7024afcb2857af2828ecad0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=398&e=gif&f=132&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/PoXZwpB>

## 使用 CSS 变换的三种方式

如此一来，你在 CSS 中可以下面这样使用 CSS 的变换。

第一种，CSS 的 `transform` ：

```CSS
.box {
    animation: chained 2s both;
    transform-origin: 100% 100%;
}


@keyframes chained {
    0% {
        transform: translate(-200%, 0) rotate(0deg);
    }
    40% {
        transform: translate(0, 0) rotate(0deg);
    }
    60% {
        transform: translate(0, 0) rotate(90deg);
    }
    100% {
        transform: translate(200%, 0) rotate(90deg);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed4b6f4d30b340ff8e0ad46b18fd011e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=396&e=gif&f=123&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/rNoxaKM>

第二种，CSS 自定义属性，如果在动画中使用变换，最好是 CSS Houdini 注册的自定义属性。

```CSS
@property --x {
    syntax: '<length-percentage>';
    initial-value: -200%;
    inherits: false;
}
​
@property --y {
    syntax: '<length-percentage>';
    initial-value: 0;
    inherits: false;
}
​
@property --r {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
}
​
.box {
    animation: chained 2s both;
    transform: translateX(var(--x)) rotate(var(--r)) translateY(var(--y));
    transform-origin: 100% 100%;
}
​
​
@keyframes chained {
    0% {
        --x: -200%;
        --y: 0;
        --r: 0deg;
    }
    40% {
        --x: 0;
        --y: 0;
        --r: 0deg;
    }
    60% {
        --x: 0;
        --y: 0;
        --r: 90deg;
    }
    100% {
        --x: 0;
        --y: -200%;
        --r: 90deg;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae8ec0ac9779474c96d4e3836083915b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=364&e=gif&f=116&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/MWZKYqK>

第三种就是 CSS 单个变换属性，即 `translate` 、`rotate` 和 `scale` ：

```CSS
.box {
    animation: composed 2s both;
    transform-origin: 100% 100%;
}
​
@keyframes composed {
    0% {
        rotate: 0deg;
        translate: -200% 0;
    }
    40% {
        rotate: 0deg;
        translate: 0 0;
    }
    60% {
        translate: 0 0;
        rotate: 90deg;
    }
    100% {
        translate: 200% 0;
        rotate: 90deg;
    }
  }
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0dd90388f0e4e36a8b11655a7b87c6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=348&e=gif&f=170&b=4a4969)

> Demo 地址：<https://codepen.io/airen/full/XWoXJxp>

你会发现，这三种不同方式制作出来的效果都是一样的。前面我们也花了很多篇幅介绍了他们之间的差异，最终在实际生产中如何使用，还是应该具体问题具体分析，找到最适合的方式。

## 小结

变换（`transform`）一直以来都是 CSS 的一个基本特性，而且常与 CSS 的 `animation` 一起用来构建 Web 的动效。随着单个变换属性的引入（`translate` 、`rotate` 和 `scale`），动画和变换的界限可能会进一步扩大。

正如课程中所描述的那样，单个变换属性给 Web 开发者带来两个关键好处：

-   使用变换和制作动画更简单
-   代码变得更清晰，更易于维护

由于这两个原因，单个变换属性将会是 Web 开发者喜欢的属性之一。

虽然 CSS 单个变换属性给 Web 开发者带来较大的便利，但并不能说明它们就可以用来替代 `transform` ，毕竟单个变换属性无法完全替代 `transform` 所有的功能，而且它自身也有一定的限制，比如无法多次使用，顺序不能更改等。因此，在未来，你可能会在代码中看到它们一起共舞！