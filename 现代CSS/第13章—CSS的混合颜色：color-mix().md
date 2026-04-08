现实生活的经验告诉我们，如果将两种或多种颜色混合在一起，就可以得到一种新的颜色。在日常生活中我们看到的颜色，大多是通过颜色混合得来的。事实上，这种日常生活的常识也可以运用于 Web 上。而且，一直以来，Web 开发者都在以不同的方式处理颜色的混合，以得到新的颜色。庆幸的是，CSS 中提供了一个专门处理混合颜色的函数，即 `color-mix()` ，它直接允许你混合两种颜色得到一种新的颜色。这是一个开创性的功能，将改变我们在项目和设计系统中处理颜色的方式。

接下来，我将以我的角度讨论 `color-mix()` 函数，并提供相应的示例来展示这个创新性 CSS 函数的多功能性和潜力。此外，我们还将探索将 `color-mix()` 与 Design Token（设计令牌）一起纳入设计系统的好处，展示处理颜色及其透明度值的示例，以及如何使用它来创建一个调色板。

## CSS 中的混合颜色

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b45a309567fe4b81a85a70a576e88eb9~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，蓝色（`blue`）加上红色（`red`）就会得到一个紫色（`purple`）。这在日常生活中很常见，但在 CSS 中有什么表达方式呢？一般都是使用 `calc()` 来操作的，例如：

```CSS
.color-mixing {
    --lightness: 50%;
    --red: hsl(0 50% var(--lightness));

    /* 通过增加 25% 的亮度通道将“白色”添加到红色中 */
    --lightered: hsl(0 50% calc(var(--lightness) + 25%);
}
```

现在，使用 `color-mix()` 要简单得多，例如：

```CSS
.color-mixing {
      --red-white-mix: color-mix(in oklab, red, white);
}
```

你肯定想一探 `color-mix()` 的究竟，但先不用着急，我想先花一点点时间和大家简单说说混合颜色。

简单地说，**混合颜色通常指的是将两种或多种颜色混合在一起，得到一种新颜色**。而 CSS 的混合颜色会在指定的颜色空间中进行插值计算，例如从 `blue` 过渡到 `red` ：

```CSS
.element {
    background-color: blue;
    transition: background-color 1s linear;
}

.element:hover {
    background-color: red;
}
```

或者：

```CSS
.element {
    background-color: blue;
    animation: mix-color 8s both linear infinite alternate;
}

@keyframes mix-color {
    to {
        background-color: red;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb9a4825ed474938bb80131c72d9ba5b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJdbrJ>

你可能已经发现了，上面这个动画，蓝色 `blue` 向红色 `red` 过渡中会出现紫色 `purple` 。

如果这个动画运行到一半的时候暂停动画呢？我们可以通过设置 `animation-delay` 的值为 `-4s` 来实现它（动画持续时间是 `8s` ，它的一半刚好是 `4s`）。你会发现刚好是紫色 `purple` 介于蓝色 `blue` 和红色 `red` 之间：

```CSS
.element {
    animation: mix-color 8s -4s linear both paused;
}

@keyframes mix-color {
    from {
        background-color: blue;
    }
    to {
        background-color: red;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fab7dc24951f4c0a87276a60509a80ea~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaqvemX>

注意，`animation-delay` 的值，就相当于用来指定两种颜色的百分比。你可以尝试着拖动下面示例中的滑块，来改变 `animation-delay` 的值，从而调整两种颜色的百分比。`animation-delay` 的值不同时，得到的混合颜色也不一样：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64b6905911b043fe9a0d3f76bf85572d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dygwEEa>

现在，你对 CSS 中的混合颜色应该已经有了一个基本的认识了。简单地说，就是两种颜色按一定的比例进行插值计算。有关于颜色插值更详细的介绍，可以阅读小册前面的课程《[11 | 新的 CSS 颜色空间：为 Web 设置高清颜色](https://juejin.cn/book/7223230325122400288/section/7233227753909125178)》，这里不再重复阐述。

## CSS 的 color-mix()

`color-mix()` 函数是 **[CSS 颜色模块 Level5](https://www.w3.org/TR/css-color-5/#color-mix)** 新增的一个颜色函数，主要用于混合两种颜色值的 CSS 函数。它采用两个颜色值作为参数，并根据所指定的颜色空间和混合比例来返回混合后的颜色值。相对于传统的颜色混合方法（比如，简单平均值、线性加权平均值等），`color-mix()` 函数提供了更灵活的混合方式。除此之外，它可以在不同的颜色空间进行混合，例如 sRGB、HSL 和 LCH 等，这在调整颜色时更加灵活，并且可以根据需要选择合适的颜色空间进行混合。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f6078ad7f0e41c9a85db50d748279a2~tplv-k3u1fbpfcp-zoom-1.image)

上图所示是 `color-mix()` 函数最基础的使用方式，函数中各参数的含义分别是：

*   指定生成的颜色空间是 HSL；
*   底色（基色）是 `blue` ；
*   底色的百分比是 `50%` ；
*   混合色是 `red` ；
*   混合色的百分比是 `50%` 。

正如下面这个示例所示，`color-mix()` 函数会根据相应的参数给你输出一个新的颜色（混合色）值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41ffabd8aa464c14a47111f0cbefa32d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmygJr>

总之，`color-mix()` 函数是一种非常有用的 CSS 函数，可以帮助你快速混合两种颜色值，并在不同的颜色空间中进行调整。

## color-mix() 语法

CSS 的 `color-mix()` 函数接受两个 `<color>` 值，并通过指定的数量，在给定的 `<color-space>` 中将它们混合，然后返回一个新的颜色值，它看上去像下面这样：

```Shell
color-mix() = color(
    <color-interpolation-method>, [<color> && <percentage [0, 100]>?]#{2}
)
```

其中 `<color-interpolation-methon>` 等于：

```Shell
<color-interpolation-method> = in [ <rectangular-color-space> | <polar-color-space> <hue-interpolation-method>? ]
```

该表达式中的对应参数分别等于：

```Shell
<rectangular-color-space> = srgb | srgb-linear | lab | oklab | xyz | xyz-d50 | xyz-d65
<polar-color-space> = hsl | hwb | lch | oklch
<hue-interpolation-method> = [ shorter | longer | increasing | decreasing ] hue
```

而 `<color>` 等于：

```Shell
<color> = <absolute-color-base> | currentcolor | <system-color> 
<absolute-color-base> = <hex-color> | <absolute-color-function> | <named-color> | transparent
<absolute-color-function> = <rgb()> | <rgba()> |<hsl()> | <hsla()> | <hwb()> |<lab()> | <lch()> | <oklab()> | <oklch()> |<color()>
```

其中基色和混合色的百分比的值是 `0% ~ 100%` 。例如：

```CSS
:root {
    --mix-color-srgb: color-mix(in srgb, blue, red);
    --mix-color-srgb-linear: color-mix(in srgb-linear, blue, red);
    --mix-color-lab: color-mix(in lab, blue, red);
    --mix-color-oklab: color-mix(in oklab, blue, red);
    --mix-color-xyz: color-mix(in xyz, blue, red);
    --mix-color-xyz-d50: color-mix(in xyz-d50, blue, red);
    --mix-color-xyz-d65: color-mix(in xyz-d65, blue, red);
    --mix-color-hsl: color-mix(in hsl, blue, red);
    --mix-color-hwb: color-mix(in hwb, blue, red);
    --mix-color-lch: color-mix(in lch, blue, red);
    --mix-color-oklch: color-mix(in oklch, blue, red);
    
    --mix-color-shorter: color-mix(in oklch shorter hue, blue, red);
    --mix-color-longer: color-mix(in oklch longer hue, blue, red);
    --mix-color-increasing: color-mix(in oklch increasing hue, blue, red);
    --mix-color-decreasing: color-mix(in oklch decreasing hue, blue, red);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3157beee73ac4fcd8b67236de25fec84~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNqPBeW>

你也可以尝试使用[ @Adam Argyle 提供的 color-mix() 工具（color-mix.style）](https://color-mix.style/)进行交互：

*   探索每个颜色空间的效果；
*   探索在圆柱形颜色空间（`lch` 、`oklch` 、`hsl` 和 `hwb`）中混合时的色调插值效果；
*   通过点击顶部的两个颜色框中的任意一个来改变混合的颜色；
*   使用滑块来改变混合比例。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/729a196d7997466999406fb491243aa6~tplv-k3u1fbpfcp-zoom-1.image)

> `color-mix()` 工具地址：<https://color-mix.style/>

不难发现，不同的颜色空间可以大幅改变混合颜色的结果。

## color-mix() 背后的计算

乍看 `color-mix()` 也就那么一回事，将两个颜色按比例在指定的颜色空间进行混合，即可得到一个新的颜色。看上去很棒也很简单，可事实上并非如此，因为 `color-mix()` 函数背后有一些数学计算。我们只有了解其背后的原理，才能用好 `color-mix()` 。

> 特别声明，接下来的内容，有些示例来自于 **[W3C 的颜色模块 Level5 规范](https://www.w3.org/TR/css-color-5/#color-mix)**。

### 混合颜色的百分比归一化

从 `color-mix()` 函数的语法规则中，我们不难知道，两个颜是按比例进行混合的，而这个比例是一个 `0% ~ 100%` 范围内的值。在实际使用的时候，两个颜色的百分比值的和有可能：

*   等于 `100%` ，比如 `color-mix(in hsl, blue 50%, red 50%)`
*   小于 `100%` ，比如 `color-mix(in hsl, blue 25%, red 30%)`
*   大于 `100%` ，比如 `color-mix(in hsl, blue 65% , red 75%)`

针对于上述所列现象，规范中都有明确的处理方式，也就是[规范中所说的“百分比的归一化处理”](https://www.w3.org/TR/css-color-5/#color-mix-percent-norm)。

假设 `color-mix()` 函数中基色的混合百分比是 `p1` ，混合色的百分比是 `p2` ，即：

```CSS
color-mix(in hsl, blue p1, red p2)
```

在实际使用的过程中，如果两个百分比都被省略，那么两个颜色的混合百分比都等于 `50%` ，即 `p1 = p2 = 50%` ，表示两种颜色平均混合。例如：

```CSS
.element {
    color: color-mix(in hsl, blue, red);
}

/* 等同于 */
.element {
    color: color-mix(in hsl, blue 50%, red 50%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e0ecc1a4bdc4c2eaac1b8710533d9b0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJBzwo>

如果仅省略了 `p2` ，则 `p2 = 100% - p1` ；如果仅省略了 `p1` ，则 `p1 = 100% - p2` 。例如下面代码所示都是等同的：

```CSS
.element {
    color: color-mix(in lch, blue 50%, red 50%);
    color: color-mix(in lch, 50% blue, 50% red);
    color: color-mix(in lch, blue 50%, red);
    color: color-mix(in lch, 50% blue, red);
    color: color-mix(in lch, blue, red 50%);
    color: color-mix(in lch, blue, 50% red);
    color: color-mix(in lch, blue, red);
    color: color-mix(in lch, red, blue);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eddaea6dfafe4f18bef6e647e03fef17~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNamNer>

如果两个颜色的百分比都提供并且总和大于 `100%` ，它们就会按比例缩放，以便总和等于 `100%` 。例如：

```CSS
.element {
    color: color-mix(in hsl, blue 60%, red 80%); 
}
```

上面示例中的 `p1 = 60%` ，`p2 = 80%` ，`p1 + p2 = 60% + 80% = 140%` ，即 `p1` 和 `p2` 的总和大于 `100%` 。此时，我们需要按下面的公式重新对 `p1` 和 `p2` 分配百分比值：

```Shell
p1' = p1 ÷ (p1 + p2)
p2' = p2 ÷ (p1 + p2)
```

即：

```Shell
p1' = 60% ÷ (60% + 80%) = 60% ÷ 140% = (60 ÷ 140) × 100% = 42.86%
p2' = 80% ÷ (60% + 80%) = 80% ÷ 140% = (80 ÷ 140) × 100% = 57.14%
```

也就是说，下面两种 CSS 规则是等效的：

```CSS
.element {
    color: color-mix(in hsl, blue 60%, red 80%); 
}

/* 等同于 */
.element {
    /**
    *    p1 = 60% 
    *    p2 = 80%
    *    p1 + p2 = 140% > 100%
    *    p1' = 60% ÷ (60% + 80%) = 42.86%
    *    p2' = 80% ÷ (60% + 80%) = 57.14%
    */
    color: color-mix(in hsl, blue 42.86%, red 57.14%); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740c16e976064c19a6d9fc5a822c23e1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNaPNWM>

如果两个百分比总和小于 `100%` ，则该总和将保存为 `α` 乘数，该 `α` 在此称为倍增器，其中 `1 = 100`。然后，它们按比例缩放，以便它们总和为 `100%` 。即：

```Shell
α = (p1 + p2) × 100
p1' = p1 × 100 ÷ α
p2' = p2 × 100 ÷ α
```

例如：

```CSS
.element {
    color: color-mix(in hsl, blue 20%, red 60%);
}
```

在这个例子中，`p1` 的百分比为 `20%`，`p2` 的百分比为 `60%`，总计为 `80%`。这给我们带来了所谓的 `α` 倍增器 的值为 `80％` （即 `0.8`）。根据上面公式，可以计算出 `p1'` 的 `p2'` 的值：

```Shell
α = (p1 + p2) × 100 = (20% + 60%) × 100 = 80
p1' = p1 × 100 ÷ α = 20% × 100 ÷ 80 = 25%
p2' = p2 × 100 ÷ α = 60% × 100 ÷ 80 = 75%
```

其实，我们也可以按 `p1 + p2 > 100%` 的公式进行计算，这样易于统一，即：

```Shell
p1' = 20% ÷ (20% + 60%) = 20% ÷ 80% = (20 ÷ 80) × 100% = 25%
p2' = 60% ÷ (20% + 60%) = 60% ÷ 80% = (60 ÷ 80) × 100% = 75%
```

不过需要注意的是，`color-mix(in hsl, blue 20%, red 80%)` 混合出来的颜色透明度将会小于 `1` ，即 `80%` 。对应的 `blue` 将转换成 `hsl(240deg 100% 50% ``/ 80%``)`，`red` 会转换成 `hsl(0deg 100% 50% ``/ 80%``)` 。即：

```CSS
.element {
    color: color-mix(in hsl, blue 20%, red 60%);
}

/* 等同于 */
.element {
    color: color-mix(in hsl, hsl(240deg 100% 50% / 80%) 25%, hsl(0deg 100% 50% / 80%) 75%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8c41a7163e3407898b43e87318e06d1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/XWxOJRr>

注意，这是一个复杂的计算过程，稍后我们还会继续聊到它们。如果你想先睹为快，[可以阅读规范相对应的文档](https://www.w3.org/TR/css-color-5/#color-mix-with-alpha)。

如果两个百分比总和为 `0` ，则 `color-mix()` 会无效。例如：

```CSS
/* 无效 CSS 规则 */
.void-css {
    color: color-mix(in hsl, red 0%, blue 0%);
}
```

而且，百分比也不能是负值。如果是负值，同样会被视为无效 CSS 规则：

```CSS
.void-css {
    color: color-mix(in hsl, red -20%, blue -80%);
}
```

正如你所看到的，`color-mix()` 函数中的两个颜色的混合百分比 `p1` 和 `p2` 值的背后计算是复杂的。如果你不想深入了解它们之间的计算原理，那么下面这个示例就比较适合你，你只需要调整基色和混合色的百分比就可以查看到 `color-mix()` 的结果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37a483c6cb5e42f2a03301c977aff850~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOoGVX>

### color-mix() 函数结果是如何计算的

`color-mix()` 函数将两个颜色混合百分比归一化之后，其产生的结果（定义的颜色）会通过以下算法计算。

*   Step ①：两个颜色都转换为指定的颜色空间（`<color-space>`）。如果指定的颜色空间无法表示颜色（例如，`hsl` 和 `hwb` 空间无法表示 sRGB 色域之外的颜色），则会进行色域映射。
*   Step ②：接着在指定的颜色空间中进行[颜色插值计算](https://juejin.cn/book/7223230325122400288/section/7233227753909125178)。如果指定的颜色空间是圆柱极坐标空间，则 `<hue-interpolation-method>` 控制色调的插值；如果没有显式指定 `<hue-interpolation-method>`，则就像指定了 `shorter` 值 ；如果指定的颜色空间是矩形直角颜色空间，则指定 `<hue-interpolation-method>` 是一个错误。
*   Step ③：如果在百分比归一化期间产生了 `α` 乘数，则插值结果的 `α` 分量会乘以 `α` 乘数。

`color-mix()` 所产生的结果是从第二个颜色到第一个颜色的进度中指定百分比处的颜色。

> 注意：作为推论，`0%` 的百分比返回的是另一种转换为指定颜色空间的颜色，而 `100%` 的百分比返回的是转换为指定颜色空间的相同颜色。

W3C 规范提供了相关的示例来解释 `color-mix()` 函数结果是如何计算的。先来看第一个示例，

```CSS
.element {
    color: color-mix(in lch, peru 40%, palegoldenrod);
}
```

上面代码将 `40%` 的 `peru` 色和 `60%` 的 `palegoldenrod` 进行混合，将产生一个新的颜色，即 `lch(79.7256 40.448 84.771)` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f105bc5d43924ce588827240c56ab5f4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxOVdw>

这个示例的混合是在 `lch` 颜色空间中完成。这是一个自上而下沿着 `L` 轴的视图：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c81c86d9c8b34654b196d8fa9b8acfec~tplv-k3u1fbpfcp-zoom-1.image)

上图所展示的是，秘鲁色(`peru`)和淡黄菊色(`palegoldenrod`)的混合。`peru` 的色相角（从正 `a` 轴测量）为 `63.677` 度，而 `palegoldenrod` 的色相角为 `98.834` 度。`peru` 的浓度（或距离中心轴心的距离）为 `54.011`，而 `palegoldenrod` 的浓度为 `31.406`。混合物位于曲线上。

`color-mix(in lch, peru 40%, palegoldenrod)` 的计算方法如下：

*   秘鲁色（`peru`）转换为 `lch` 空间的颜色是 `lch(62.253％ 54.011 63.677)` ；
*   淡黄菊色（`palegoldenrod`）转换为 `lch` 空间的颜色是 `lch(91.374％ 31.406 98.834)` ；
*   混合物（颜色）的亮度： `L =  62.253 × 40 ÷ 100 + 91.374 × (100 - 40)  ÷  100 = 79.7256`；
*   混合物（颜色）的饱和度：`C = 54.011 × 40 ÷ 100 + 31.406 × (100 - 40) ÷ 100 = 40.448`；
*   混合物（颜色）的色调：`H = 63.677 × 40 ÷ 100 + 98.834 × (100-40) ÷ 100 = 84.771`。

`color-mix(in lch, peru 40%, palegoldenrod)` 的最终计算出的结果是 `lch(79.7256 40.448 84.771)` 。

### 在各种颜色空间中的混合颜色

混合颜色的默认颜色空间是 OKLAB，它提供了一致的结果。当然，使用 `color-mix()` 允许指定替代的颜色空间。如此一来，你可以根据自己的需求定制混合颜色。下面，让我们看一下各颜色空间混合颜色的示例。

首先来看在 sRGB 颜色空间中混合 RGB 颜色。例如：

```CSS
:root {
    --base-color: rgb(0 145 255);
    --blend-color: rgb(0 0 255);
    --mix-color: color-mix(in srgb, var(--base-color) 50%, var(--blend-color));
}

.element {
    background-color: var(--mix-color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3103563d5284433971778b679709968~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWPLrMW>

在这个例子中，我们在 sRGB 颜色空间中混合相等比例饱和度较高的蔚蓝和蓝色（各 `50%`）。最终的颜色将是霓虹蓝。

在 sRGB 颜色空间中混合 RGB 颜色可以通过以下方式进行。首先将 Color1 和 Color2 的每个颜色通道（红色 R、绿色 G 和 蓝色 B）值限制 `0 ~ 255` 的范围内：

```Shell
color1 = rgb(0 145 255) → R1 = 0, G1 = 145, B1 = 255

color2 = rgb(0 0 255) → R2 = 0, G2 = 0, B2 = 255
```

接着将每个通道的值除以 `255` ，将它们归一化为 `0 ~ 1` 范围内的数值：

```Shell
color1 = rgb(0 145 255) → R1 = 0, G1 = 145, B1 = 255
R1 = 0 ÷ 255 = 0
G1 = 145 ÷ 255 = 0.56863
B1 = 255 ÷ 255 = 1

color2 = rgb(0 0 255) → R2 = 0, G2 = 0, B2 = 255
R2 = 0 ÷ 255 = 0
G2 = 0 ÷ 255 = 0
B2 = 255 ÷ 255 = 1 
```

这样就可以计算出混合颜色的每个颜色通道的值：

```Shell
R' = R1 × p1 + R2 × p2 = 0 × 50 ÷ 100 + 0 × 50 ÷ 100 = 0
G' = G1 × p1 + G2 × p2 = 0.56863 × 50 ÷ 100 + 0 × 50 ÷ 100 = 0.284315
B' = B1 × p1 + B2 × p2 = 1 × 50 ÷ 100 + 1 × 50 ÷ 100 = 1
```

这样就得到混合颜色 `--mix-color` 的值，即 `color(srgb 0 0.284315 1)`，在此基础上，可以将每个通道的加权平均值乘以 `255`，以将其重新归一化为 `0 ~ 255` 范围内的数值。

```Shell
R' = 0 × 255 = 0;
G' = 0.284315 × 255 = 72.50
B' = 1 × 255 = 255
```

最终得到混合颜色就是 `rgb(0 72.50 255)` 。我们再来看 HSL 颜色空间混合 LCH 颜色。例如：

```CSS
:root {
    --base-color: hsl(0 100% 50%);
    --blend-color: hsl(240 100% 50%);
    --mix-color: color-mix(in lch, var(--base-color) 70%, var(--blend-color) 30%);
}

.element {
    background-color: var(--mix-color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4bd43a782d343a3ada037039f29d1af~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRXqBW>

这个示例中，我们在 LCH 颜色空间中混合  `70%` 的红色和 `30%` 的蓝色，其中红色和蓝色是 HSL 颜色空间中的颜色。最终的颜色将是一个充满活力的带粉红色调的红色。

上面两个示例不怎么能看得出混合颜色因颜色空间不同所带来的差异。我们来看另一个示例，基色 `black` 和混合色 `white` 各占 `50%` 的混合比，在不同颜色空间中混合颜色：

```CSS
:root {
    --base-color: black;
    --blend-color: white;
    
    --mix-color-in-srgb: color-mix(in srgb, black, white);
    --mix-color-in-srgb-linear: color-mix(in srgb-linear, black, white);
    --mix-color-in-lab: color-mix(in lab, black, white);
    --mix-color-in-oklab: color-mix(in oklab, black, white);
    --mix-color-in-xyz: color-mix(in xyz, black, white);
    --mix-color-in-xyz-d50: color-mix(in xyz-d50, black, white);
    --mix-color-in-xyz-d65: color-mix(in xyz-d65, black, white);
    --mix-color-in-hsl: color-mix(in hsl, black, white);
    --mix-color-in-hwb: color-mix(in hwb, black, white);
    --mix-color-in-lch: color-mix(in lch, black, white);
    --mix-color-in-oklch: color-mix(in srgb, black, white);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/492ae665e4424fcbb0d13ceda0d7bd62~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOBqvdy>

确实会有很大的影响！

再举一个例子：蓝色和白色。我特意选择这个例子，因为这是一个颜色空间可能会影响结果的情况。在这种情况下，大多数颜色空间都会在从白色到蓝色的过程中变成紫色。它还展示了 OKLAB 如何在颜色空间进行混合，它最接近于大多数人混合白色和蓝色的期望（没有紫色）。

```CSS
:root {
    --base-color: blue;
    --blend-color: white;
    
    --mix-color-in-srgb: color-mix(in srgb, black, white);
    --mix-color-in-srgb-linear: color-mix(in srgb-linear, black, white);
    --mix-color-in-lab: color-mix(in lab, black, white);
    --mix-color-in-oklab: color-mix(in oklab, black, white);
    --mix-color-in-xyz: color-mix(in xyz, black, white);
    --mix-color-in-xyz-d50: color-mix(in xyz-d50, black, white);
    --mix-color-in-xyz-d65: color-mix(in xyz-d65, black, white);
    --mix-color-in-hsl: color-mix(in hsl, black, white);
    --mix-color-in-hwb: color-mix(in hwb, black, white);
    --mix-color-in-lch: color-mix(in lch, black, white);
    --mix-color-in-oklch: color-mix(in srgb, black, white);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5abf253a68646108dee0abac712531f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmeWaM>

如果你想知道哪种颜色空间是“最好”的，我的回答是没有。这就是为什么存在这么多选项的原因！如果有一个“最好”的颜色空间，也就不会有新的颜色空间被发明了 （比如 [OKLAB 和 OKLCH](https://juejin.cn/book/7223230325122400288/section/7235205520154427429)）。每种颜色空间都可以有自己独特的光芒，我们应该根据自已的需求来做出正确的选择。

例如，如果你想要一个鲜艳的混合结果，可以使用 `hsl` 或 `hwb`。在以下演示中，将两种鲜艳的颜色（品红和青柠）混合在一起，`hsl` 和 `hwb` 都产生了鲜艳的混合结果，而 `srgb` 和 `oklab` 产生了不饱和的颜色。

```CSS
:root {
    --p1: 50%;
    --p2: 50%;
    --base-color: magenta;
    --blend-color: lime;
 
  
    --mix-color-in-srgb: color-mix(in srgb, var(--base-color), var(--blend-color));
    --mix-color-in-oklab: color-mix(in oklab, var(--base-color), var(--blend-color));
    --mix-color-in-hsl: color-mix(in hsl, var(--base-color), var(--blend-color));
    --mix-color-in-hwb: color-mix(in hwb, var(--base-color), var(--blend-color));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3783931a16e74770852f28095895ea93~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEgXVY>

如果你想要一种微妙的混合结果，可以使用 OKLAB。在以下演示中，将蓝色和黑色混合在一起，`hsl` 和 `hwb` 会产生过于鲜艳和色调改变的颜色，而 `srgb` 和 `oklab` 则会产生较暗的蓝色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2106abd3ac6448e893846c5700d6c01c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdzvxvP>

上面这几个示例，再次向大家验证了**混合颜色空间的选择可能会对最终结果产生很大影响**。

除了指定颜色空间对混合颜色之外，你还可以调整色调的插值。如果你选择在一个圆柱形颜色空间（即 `hsl`  、 `hwb`  、 `lch` 和 `oklch`）进行混合，你可以指定插值为 `shorter` 、 `longer` 、 `increasing` 和 `decreasing` 。比如下面这个示例，使用不同色调插值方法的圆柱形空间颜色混合的效果：

```CSS
:root {
    --p1: 50%;
    --p2: 50%;
    --base-color: blue;
    --blend-color: white;
    
    --shorter-space: shorter hue;
    --longer-space: longer hue;
    --increasing-space: increasing hue;
    --decreasing-space: decreasing hue;
  
    --mix-color-lch: color-mix(in lch var(--shorter-space), var(--base-color) var(--p1), var(--blend-color) var(--p2));
    --mix-color-oklch: color-mix(in oklch var(--longer-space), var(--base-color) var(--p1), var(--blend-color) var(--p2));
    --mix-color-hsl: color-mix(in hsl var(--increasing-space), var(--base-color) var(--p1), var(--blend-color) var(--p2));
    --mix-color-hwb: color-mix(in hwb var(--decreasing-space), var(--base-color) var(--p1), var(--blend-color) var(--p2));
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5c47a32a4934f9ea11228dbcffca77b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNqPdgo>

注意，它们之间也会涉及一些计算。比如 [W3C 规范中提供的这个示例](https://www.w3.org/TR/css-color-5/#color-mix-color-space-effect)，向大家阐述了它背景的计算。比如下面这个示例，使用了三个不同的颜色空间，将白色（`white`）和黑色（`black`）进行 `50%` 的混合：

```CSS
:root {
    --base-color: white;
    --blend-color: black;
    --mix-color-in-lch: color-mix(in lch, var(--base-color), var(--blend-color));
    --mix-color-in-xyz: color-mix(in xyz, var(--base-color), var(--blend-color));
    --mix-color-in-srgb: color-mix(in srgb, var(--base-color), var(--blend-color));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06b05109bb234901a7610985e1cb01f4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwevyKp>

*   在 LCH 颜色空间中进行混合的结果是 `lch(50% 0 0)`；
*   在 XYZ 颜色空间中混合的结果是 `lch(76% 0 0)`，较灰；
*   在 sRGB 颜色空间中混合的结果是 `lch(53.4% 0 0)`，略微偏亮。

在 LCH 中进行混合得到 `50%` 的 `L` 值，就是完美的中性灰色，与预期完全一致（在 LAB 中进行混合会得到相同的结果，因为 LCH 和 LAB 中的亮度轴 `L` 是相同的）。在 XYZ 中进行混合得到的结果太浅了，因为 XYZ 是线性光，但不是感知均匀的；在 sRGB 中进行混合得到的结果略微偏亮，因为 sRGB 既不是感知均匀的，也不是线性光。

再来看一个示例，在 XYZ 颜色空间，将 `75.23%` 的红色和 `24.77%` 的蓝色混合在一起：

```CSS
.element {
    color-mix(in xyz, rgb(82.02% 30.21% 35.02%) 75.23%, rgb(5.64% 55.94% 85.31%));
}
```

它的计算过程如下所示。

*   `rgb(82.02% 30.21% 35.02%)` 是 `lch(52% 58.1 22.7)` ，对应的 XYZ 是 `X=0.3214`，`Y=0.2014`，`Z=0.0879`。
*   `rgb(5.64% 55.94% 85.31%)` 是 `lch(56% 49.1 257.1)`，对应的 XYZ 是 `X=0.2070`，`Y=0.2391`，`Z=0.5249`。

在此基础上计算出混合颜色的 `X` 、`Y` 和 `Z` 的值：

*   混合结果的 `X` 值为 `(0.3214 × 0.7523) + (0.2070 × (1 - 0.7523)) = 0.29306`；
*   混合结果的 `Y` 值为 `(0.2014 × 0.7523) + (0.2391 × (1 - 0.7523)) = 0.21074`；
*   混合结果的 `Z` 值为 `(0.0879 × 0.7523) + (0.5249 × (1 - 0.7523)) = 0.19614`。

最终得到混合结果是 `lch(53.0304% 38.9346, 352.8138)` ，对应的 RGB 是 `rgb(72.300% 38.639% 53.557%)`。

前面我们所展示的都是同类型颜色的混合，比如混合了 CSS 英文词命名的颜色（`white` 和 `black`），混合了同类型的颜色（`rgb` 与 `rgb` 或 `hsl` 与 `hsl`）。其实，在使用 `color-mix()` 的时候，还可以混合来自两种不同颜色空间的颜色。例如：

```CSS
.element {
    color: color-mix(in hsl, color(display-p3 0 1 0) 80%, yellow);
}
```

在上述示例中，其计算过程如下所示。

*   `color(display-p3 0 1 0)` 是 `color(srgb -0.5116 1.01827 -0.3107)`，位于 sRGB 色域之外。首先会对它做 CSS 色域的映射，CSS 色域映射后，新的颜色是 `color(srgb 0 0.99797 0)`，然后可以将其转换为 `hsl`，结果为 `hsl(120 100% 49.898%)`。
*   黄色（`yellow`）对应的颜色是 `hsl(60 100% 50%)`。
*   混合颜色的色相是 `120 × 0.8 + 60 × 0.2 = 108`。
*   混合颜色的饱和度是 `100%`。
*   混合颜色的亮度是 `49.898 × 0.8 + 50 × 0.2 = 49.9184`。

最终混合结果是 `hsl(108 100% 49.9184%)`，对应的色彩空间是 `color(display-p3 0.48903 0.98415 0.29889)`。

### 透明度对 color-mix() 的影响

到目前为止，所有的 `color-mix()` 示例都使用了完全不透明的颜色。那么我们来看看，带有一定透明度的颜色混合在一起，又会发生什么？比如，下面这个示例，我们在 sRGB 颜色空间中混合相等比例，并且带有 `50%` 透明度的红色和蓝色：

```CSS
:root {
    --base-color: rgb(255 0 0 / 0.5);
    --blend-color: rgb(0 0 255 / 0.5);
    --mix-color: color-mix(in srgb, var(--base-color), var(--blend-color));
}

.element {
    background-color: var(--min-color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04ee85f44dc74ac4aec5d3438813c85d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNqPvgV>

正如你所看到的，最终的颜色是一个半透明的紫色。

带有透明度的颜色进行混合时，它背后的计算相对而言要复杂得多，将会涉及预乘、插值和取消预乘步骤等。在 [W3C 规范中有相关的示例](https://www.w3.org/TR/css-color-5/#color-mix-with-alpha)，我直接搬过来向大家展示它背景计算的复杂性。

例如：

```CSS
.element {
    color: color-mix(in srgb, rgb(100% 0% 0% / 0.7) 25%, rgb(0% 100% 0% / 0.2));
}
```

其计算过程如下：

*   `rgb(100% 0% 0% / 0.7)` 在预乘的情况下等于 `[0.7，0，0]`；
*   `rgb(0% 100% 0% / 0.2)` 在预乘的情况下等于 `[0,0.2,0]`；
*   预乘、插值的结果为 `[0.7 × 0.25 + 0 × (1 - 0.25)，0 × 0.25 + 0.2 × (1-0.25)，0 × 0.25 + 0 × (1-0.25)]`，即`[0.175，0.150，0]`；
*   插值后的 Alpha 值为 `0.7 × 0.25 + 0.2 × (1-0.25) = 0.325`；
*   取消预乘后的结果为 `[0.175/0.325，0.150/0.325，0/0.325]`，即 `[0.53846，0.46154，0]`。

因此，混合颜色为 `color(srgb 0.53846 0.46154 0 / 0.325)`。

错误的计算方法是：

*   插值的结果为 `[10.25 + 0 × (1-0.25)，0 × 0.25 + 1 × (1-0.25)，0 × 0.25 + 0 × (1-0.25)]`，即 `[0.25，0.75，0]`

因此，错误的混合颜色是 `color(srgb 0.25 0.75 0 / 0.325)`。

由此可见，这是一个巨大的差异；正确结果和错误结果之间的 `ΔE2000` 为 `30.7`！

再来看第二个示例。它与上一个示例类似，以 `25%` 半透明的红色和 `75%` 半透明的绿色在 sRGB 中混合。但是，在这种情况下，百分比是指定第一个颜色的 `20%` ，第二个颜色的 `60%`。这两个颜色相加为 `80%` ，因此 `α` （Alpha）乘数为 `0.8`。

然后将混合百分比缩放 `100/80` 的因子：

*   `20% * 100/80 = 25%`；
*   `60% * 100/80 = 75%`。

给出了与先前示例相同的最终混合百分比。

```CSS
.element {
    color: color-mix(in srgb, rgb(100% 0% 0% / 0.7) 20%, rgb(0% 100% 0% / 0.2) 60%);
}
```

计算过程如下：

*   `rgb(100% 0% 0% / 0.7)` 在预乘的情况下等于 `[0.7，0，0]`；
*   `rgb(0% 100% 0% / 0.2)` 在预乘的情况下等于 `[0,0.2,0]`；
*   预乘、插值的结果为 `[0.7 × 0.25 + 0 × (1 - 0.25)，0 × 0.25 + 0.2 × (1 - 0.25)，0 × 0.25 + 0 × (1 - 0.25)]` ，即 `[0.175，0.150，0]`；
*   插值后的 `α` （Alpha）值为 `0.7 × 0.25 + 0.2 × (1 - 0.25)=0.325`；
*   取消预乘后的结果为 `[0.175/0.325，0.150/0.325，0/0.325]`，即 `[0.53846，0.46154，0]`。

因此，混合颜色应该是 `color(srgb 0.53846 0.46154 0 / 0.325)`。

有一个 `0.8` 的 `α` （Alpha）乘数，因此混合结果的 Alpha 实际上是 `0.325 * 0.8=0.260`，因此混合颜色实际上是 `color(srgb 0.53846 0.46154 0 / 0.260)`。

这个计算过程很复杂，但经过试验，带有透明度的颜色混合看起来与不带透明度的混合百分比类似。例如：

```CSS
:root {
    --base-opacity: 50%;
    --blend-opacity: 50%;
    --base-color: rgb(255 0 0 / var(--base-opacity));
    --blend-color: rgb(0 0 255 / var(--blend-opacity));
    --mix-color: color-mix(in lch, var(--base-color) 50%, var(--blend-color));
}

.element {
    background-color: var(--mix-color);
}
```

在这个示例中，基色为红色，混合色为蓝色。在正常情况下，这些颜色会混合成粉色。然而，每个颜色都是使用 `rgb`和 `50%` 的不透明度定义的。结果是预期的粉色调，但具有平均的不透明度。如果基本不透明度为 `100%`，混合不透明度为 `0%`，则得到的不透明度将为 `50%`。但无论得到的不透明度如何，`50/50` 的颜色混合保持着一致的粉色调。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67bea3d3946b47f986939a1ebfcdd041~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvYNXrb>

不知你是否还记得，前面展示了一个示例，当两个颜色的混合百分比总和小于 `100%` 时，最终混合的颜色也是一个带有透明度的颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1137d30dcf44d0e9554c813e0a15c30~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 在址：<https://codepen.io/airen/full/NWOoGVX>

更有趣的是，我们可以将一个不带任何透明度的基色与 `transparent` 关键词进行混合，这样做只是为了使用 `color-mix()` 改变基色，使其带有一定的透明度。例如：

```CSS
:root {
    --base-color: lightseagreen;
    --blend-color: transparent;
    --mix-color: color-mix(in oklab, var(--base-color), var(--blend-color) 75%);
}

.element {
    background-color: var(--mix-color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d945a859fa84008a26b38e76a0a4ef6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOoBPN>

在这个示例中，我们将一个 `75%` 透明度的无色（`transparent`）混合颜色和一个完全不透明的浅海洋绿色（`lightseagreen`）混合，结果是具有 `25%` 不透明度的浅海洋绿色（`lightseagreen`）。`25%` 是因为在混合过程中指定了透明色在混合中占据 `75%` ，为浅海洋绿色（`lightseagreen`）留下了 `25%` 的不透明度。

以下是另一个例子。让这个浅海洋绿色（`lightseagreen`）更加透明，降低它的透明度一半。

```CSS
.element {
    background-color: color-mix(in srgb, rgb(32 178 170 / 10%), transparent 75%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc38e14bcb5e4a8188a560ff20663b4c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/XWxOBdZ>

## 嵌套 color-mix()

CSS 的 `color-mix()` 函数与其他颜色函数有一点不相同，它支持 `color-mix()` 的嵌套，即在 `color-mix()` 中嵌套 `color-mix()` 。例如：

```CSS
.element {
    background-color: color-mix(in lch, purple 40%, color-mix(in oklch, plum, white 60%));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0729242d93a422ea57f16985b262eaa~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYVbapY>

`color-mix()` 函数嵌套时，内部的 `color-mix()` 函数会首先解析，并将其值返回给其父函数（`color-mix()`）。你可以在 `color-mix()` 函数中嵌套你需要的次数，以获得所需的结果。只不过嵌套的层级越深，你的代码就会变得越复杂。在实际使用的时候，还是需要考虑代码的可阅读性，个人建议，即使要使用嵌套的 `color-mix()` 函数，层级也不应该过深。

## color-mix() 可用来做些什么？

阅读到这里，大家对于 `color-mix()` 是什么肯定比较清楚了。此时，你更想知道的应该是，在实际开发项目的时候，我们可以使用 `color-mix()` 做些什么？

简单地说，`color-mix()` 主要可以应用于设计系统中，用于定义和管理一组连贯的设计属性，比如主题色或者调色板。换句话说，通过将 `color-mix()` 函数纳入设计系统中，我们可以增强颜色管理的灵活性和适应性。主要有下面一些优点。

*   **动态颜色操作** ：`color-mix()` 函数允许设计师基于预定义的颜色 Token 创建各种颜色变化，这种灵活性使得在设计系统内管理和调整颜色更加容易，减少了手动颜色调整的需求。
*   **适应性颜色主题** ：通过混合不同比例的基础颜色，`color-mix()` 函数可以用于生成适应不同环境的颜色主题，如暗黑模式。这种适应性简化了在上下文感知的设计中的颜色主题创建，并确保在不同环境下保持视觉一致性。
*   **改进的颜色一致性** ：使用 `color-mix()` 函数混合颜色可以确保设计系统中的一致性，因为这些颜色源自一组预定义的 Token。这种一致性使得设计师更容易在整个项目中保持一致的视觉语言。
*   **高效的颜色探索** ：`color-mix()` 函数使设计师能够快速探索各种颜色组合，并找到适合他们设计的完美平衡点。这减少了试错的时间，让设计师能够更多地关注设计流程的其他方面。
*   **更轻松的协作** ：将 `color-mix()` 函数集成到设计系统中，可以更有效地共享和协作颜色方案。这种集成促进了一种统一的颜色管理方法，并有助于在涉及多个设计师的大型项目中保持视觉连贯性。

总之，将 `color-mix()` 函数纳入设计系统可以极大地增强设计流程，使设计师更容易管理颜色、创建适应性主题和保持视觉一致性。通过利用这个强大的功能，设计师可以专注于提供更加完美和连贯的用户体验。

接下来，我们一起来看几个真实场景的用例。

### 使用 color-mix() 简化你的调色板

在设计中，一个简单的颜色调色板通常会比一个杂乱的、不经意的颜色调色板表现得更好。CSS 的 `color-mix()` 函数是一个简单而强大的工具，可以将你现有的颜色混合在一起，创造出新的颜色等级和更多的颜色组合。例如，我们在创建一个颜色调色板时，首先会定义好一个主色调：

```CSS
:root {
    --primary-color-1:＃ff0;
    --primary-color-2:＃f00;
    --primary-color-3:＃00f;
}
```

在主色调的基础上，我们可以使用 `color-mix()` 来创建二级（次要）颜色：

```CSS
:root {
    /* 一级颜色（主色调）*/
    --primary-color-1:＃ff0;
    --primary-color-2:＃f00;
    --primary-color-3:＃00f;
    
    /* 使用 color-mix() 函数，基于主色调创建二级颜色 */
    --secondary-color-1: color-mix(in srgb, var(--primary-color-1) 50%, var(--primary-color-2));
    --secondary-color-2: color-mix(in srgb, var(--primary-color-2) 50%, var(--primary-color-3));
    --secondary-color-3: color-mix(in srgb, var(--primary-color-3) 50%, var(--primary-color-1));
}
```

最后，基于主色调和二级颜色创建第三级颜色：

```CSS
:root {
    /* 一级颜色（主色调）*/
    --primary-color-1:#ff0;
    --primary-color-2:#f00;
    --primary-color-3:#00f;
    
    /* 使用 color-mix() 函数，基于主色调创建二级颜色 */
    --secondary-color-1: color-mix(in srgb, var(--primary-color-1) 50%, var(--primary-color-2));
    --secondary-color-2: color-mix(in srgb, var(--primary-color-2) 50%, var(--primary-color-3));
    --secondary-color-3: color-mix(in srgb, var(--primary-color-3) 50%, var(--primary-color-1));
    
    /* 使用 color-mix() 函数，基于一级颜色和二级颜色来创建三级颜色 */
    --tertiary-color-1: color-mix(in srgb, var(--primary-color-1) 50%, var(--secondary-color-1));
    --tertiary-color-2: color-mix(in srgb, var(--secondary-color-1) 50%, var(--primary-color-2));
    --tertiary-color-3: color-mix(in srgb, var(--primary-color-2) 50%, var(--secondary-color-2));
    --tertiary-color-4: color-mix(in srgb, var(--secondary-color-2) 50%, var(--primary-color-3));
    --tertiary-color-5: color-mix(in srgb, var(--primary-color-3) 50%, var(--secondary-color-3));
    --tertiary-color-6: color-mix(in srgb, var(--secondary-color-3) 50%, var(--primary-color-1));
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99ee92c1596c4226b8ac4229e881e7c8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvYOGjb>

示例中的颜色只是一个展示性的颜色，你完全可以根据类似的方法构建符合你需求的调色板。另外，示例中使用的是 sRGB 颜色空间，你甚至可以改变相应的颜色空间，为你自己的调色板提供更广泛的，更鲜艳的色调，为最新屏幕技术提供更多的颜色。你可以尝试，下面这个示例中，调整颜色空间，查看调色板相应的变化：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0d6a2046b0d4205a23c49055a45bdb9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOJNeW>

我们再来看一个更真实的案例，比如基于 `--primary-color` 、`--success-color` 和 `--warning-color` ，通过 `color-mix()` 函数创建适合于信息警告框（`.alert--info`）和错误警告信息框（`.alert--error`）的背景颜色：

```CSS
:root {
    --primary-color: #0074D9;
    --success-color: #2ECC40;
    --warning-color: #FFDC00;

    --info-color: color-mix(in oklab,var(--primary-color), color-mix(in oklab, var(--success-color),var(--warning-color)));
    --error-color: color-mix(in oklab,var(--warning-color), color-mix(in oklab, var(--primary-color), var(--warning-color)));
 }
 
 .alert--info {
     background-color: var(--info-color);
 }
 
 .alert-error {
     background-color: var(--error-color);
 }
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7be19ec0e83b4886be465fc59d81dd54~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJgqoR>

正如你所看到的，通过使用 `color-mix()` 函数，我们可以轻松地创建新的颜色变体，而不需要明确地定义每种颜色的变体。这使得我们可以更轻松地管理一个简单的颜色调色板，同时保持这些颜色的可变性。

除了创建新颜色以外，`color-mix()` 还可以用于创建动态颜色方案，如 `:hover` 和 `:active` 状态，以及创建渐变色。通过使用这个小巧而强大的功能，你可以轻松快速地创建灵活的、灵活的设计系统。例如下面这个示例，使用 `color-mix()` 函数创建按钮 `:hover` 和 `:active` 状态的颜色：

```CSS
:root {
    --primary-color: #dedbd2;
}

.button {
    --button-bg: #087e8b;
    --button-bg-hover: color-mix(in srgb, var(--button-bg) 75%, var(--primary-color));
    --button-bg-active: color-mix(in srgb, var(--button-bg-hover) 80%, var(--primary-color));
    
    background-color: var(--button-bg);
}

.button:hover {
    background-color: var(--button-bg-hover);
}

.button:active {
    background-color: var(--button-bg-active);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c825bbb62f74af8a714990dcf664a4a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNaVLLQ>

在这个示例中，通过将 `--button-bg` 的 `75%` 混合到 `--primary-color` 中来定义 `--button-bg-hover` 的值。然后，通过再次将 `--button-bg-hover` 的 `80%` 混合到 `--primary-color` 中来设置 `--button-bg-active` 。这样可以轻松地为元素的各个状态（如 `:hover` 和 `:active` 状态）定义新的颜色，它和 Sass 中的 `darken()` 和 `lighten()` 函数不同之处是，`color-mix()` 函数在如何调整颜色方面提供更大的和更精细的控制，并且它是 CSS 本身的一部分，毕竟是 CSS 原生的特性。

### 使用 color-mix() 构建颜色主题

接下来，我们一起来看一个使用 `color-mix()` 构建颜色主题的案例。

我们基于一个十六进制的品牌颜色（例如，`#0af`）为 Web 应用或页面创建一个浅色和深色主题。首先，使用 `color-mix()` 为 Web 创建浅色主题，浅色主题为文本颜色（`color`）创建了两个深蓝色和一个非常明亮的白色背景颜色：

```CSS
:root {
    /* 十六进制表示的品牌色 */
    --brand-color: #0af;
    
    /* 浅色主题*/
    
    /* 两个深蓝的文本颜色 */
    --text-primary: color-mix(in oklab, var(--brand-color) 25%, black);
    --text-secondary: color-mix(in oklab, var(--brand-color) 40%, black);
    
    /* 非常明亮的白色背景色 */
    --surface-primary: color-mix(in oklab, var(--brand-color) 5%, white);
}
```

然后，再基于 CSS 的媒体查询，为 Web 创建一个深色主题，我们只需要在 `@media (prefers-color-scheme：dark) {}` 中调整自定义属性的值（即使用 `color-mix()` 函数为自定义属性重新分配新的颜色值），以便背景是暗色，而文本颜色是浅色：

```CSS
:root {
    /* 十六进制表示的品牌色 */
    --brand-color: #0af;
    
    /* 浅色主题*/
    
    /* 两个深蓝的文本颜色 */
    --text-primary: color-mix(in oklab, var(--brand-color) 25%, black);
    --text-secondary: color-mix(in oklab, var(--brand-color) 40%, black);
    
    /* 非常明亮的白色背景色 */
    --surface-primary: color-mix(in oklab, var(--brand-color) 5%, white);
}

/* 创建暗色主题 */
@media (prefers-color-scheme：dark) {
    :root {
        --text-primary: color-mix(in oklab, var(--brand-color) 15%, white);
        --text-secondary: color-mix(in oklab, var(--brand-color) 40%, white);
        --surface-primary: color-mix(in oklab, var(--brand-color) 5%, black);
    }
}
```

再借助一下 [CSS 的 :has() 选择器](https://juejin.cn/book/7223230325122400288/section/7224404685615005728)的功能以及 [CSS 的样式查询功能](https://juejin.cn/book/7161370789680250917/section/7164357178164248612)，你就可以完全不依赖任何 JavaScript 脚本，完成 Web 应用或页面主题之间的切换，而且主题颜色是通过 `color-mix()` 完成的。最终的 CSS 代码如下：

```CSS
:where(html) {
    --darkmode: 0;
    container-name: root;
    container-type: normal;
    color-scheme: light dark;
}

body {
    /* 十六进制表示的品牌色 */
    --brand-color: #0af;

    /* 浅色主题*/

    /* 两个深蓝的文本颜色 */
    --text-primary: color-mix(in oklab, var(--brand-color) 25%, black);
    --text-secondary: color-mix(in oklab, var(--brand-color) 40%, black);

    /* 非常明亮的白色背景色 */
    --surface-primary: color-mix(in oklab, var(--brand-color) 5%, white);
    --surface-secondary: color-mix(in oklab, var(--brand-color) 20%, white);
}

/* 创建暗色主题 */
@media (prefers-color-scheme：dark) {
    body {
        --text-primary: color-mix(in oklab, var(--brand-color) 15%, white);
        --text-secondary: color-mix(in oklab, var(--brand-color) 40%, white);
        --surface-primary: color-mix(in oklab, var(--brand-color) 5%, black);
        --surface-secondary: color-mix(in oklab, var(--brand-color) 20%, black);
    }
}

@media (prefers-color-scheme: dark) {
    html {
        --darkmode: 1;
        color-scheme: dark;
    }
}
@media (prefers-color-scheme: light) {
    html {
        --darkmode: 0;
    }
}

html:has(#color-scheme-light:checked) {
    --darkmode: 0;
}
html:has(#color-scheme-dark:checked) {
    --darkmode: 1;
}

@container root style(--darkmode: 1) {
    body {
        --text-primary: color-mix(in oklab, var(--brand-color) 15%, white);
        --text-secondary: color-mix(in oklab, var(--brand-color) 40%, white);
        --surface-primary: color-mix(in oklab, var(--brand-color) 5%, black);
        --surface-secondary: color-mix(in oklab, var(--brand-color) 20%, black);
    }
}

body {
    background: var(--surface-primary);
    color: var(--text-primary);
    color-scheme: light dark;
  
    background-color: var(--surface-primary);
    background-image:linear-gradient(
        130deg,
        transparent 0%,
        transparent 86%,
        var(--surface-primary) 86%,
        var(--surface-primary) 87%,
        transparent 87%,
        transparent 91%,
        var(--text-primary) 91%,
        var(--text-primary) 95%,
        var(--text-secondary) 95%,
        var(--text-secondary) 100%
        ),
        url('data:image/svg+xml,<svg width="42" height="44" viewBox="0 0 42 44" xmlns="http://www.w3.org/2000/svg"><g id="Page-1" fill="none" fill-rule="evenodd"><g id="brick-wall" fill="%239C92AC" fill-opacity="0.4"><path d="M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z"/></g></g></svg>');
}

p {
    color: var(--text-secondary);
}

.toggle-group {
    border: 2px solid var(--text-primary);
}

.toggle-group label:has(input:checked) {
    background-color: var(--surface-secondary);
    color: var(--text-secondary);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95dfef539e9f409ea51c2e94dffe813c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgagNx>

### 使用 color-mix() 调整颜色透明度

在学习 [CSS 的相对颜色](https://juejin.cn/book/7223230325122400288/section/7231515598088306720)的时候，我们知道了 CSS 可以使用相对语法来调整一个十六进制颜色的透明。例如：

```CSS
:root {
    --theme-primary: #8832CC;
}
.bg-primary-100 {
    background-color: hsl(from var(--theme-primary) h s 90%);
}

.bg-primary-200 {
    background-color: hsl(from var(--theme-primary) h s 80%);
}

.bg-primary-300 {
    background-color: hsl(from var(--theme-primary) h s 70%);
}

.bg-primary-400 {
    background-color: hsl(from var(--theme-primary) h s 60%);
}
```

有意思的是，CSS 的 `color-mix()` 也可以用来调整颜色的不透明度。假设你要创建品牌颜色的半透明版本，可以使用 `transparent` 与品牌色混合，并且调整 `transparent` （透明颜色）的混合比例。它看起来有点像这样：

```CSS
:root {
    --brand-color: #8832CC;
    
    --brand-color-a10: color-mix(in oklch, var(--brand-color), transparent 90%);
    --brand-color-a20: color-mix(in oklch, var(--brand-color), transparent 80%);
    --brand-color-a30: color-mix(in oklch, var(--brand-color), transparent 70%);
    --brand-color-a40: color-mix(in oklch, var(--brand-color), transparent 60%);
    --brand-color-a50: color-mix(in oklch, var(--brand-color), transparent 50%);
    --brand-color-a60: color-mix(in oklch, var(--brand-color), transparent 40%);
    --brand-color-a70: color-mix(in oklch, var(--brand-color), transparent 30%);
    --brand-color-a80: color-mix(in oklch, var(--brand-color), transparent 20%);
    --brand-color-a90: color-mix(in oklch, var(--brand-color), transparent 10%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a41cca8def649fd837dffb577d5761d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYPXPrZ>

这种使用 `color-mix` 函数的方式，可以在保留品牌颜色的同时调整透明度。

## color-mix() 与 currentColor

在 CSS 中给颜色属性设置颜色时，还可以使用 `currentColor` ，而且 `currentColor` 是一个很有意思的属性，它可以根据元素当前的 `color` 或其父元素（或祖先元素）来决定 `currentColor` 的值。换句话说，在一些场景中使用 `currentColor` 作为颜色属性的值时，可以根据 `color` 来动态匹配颜色值。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cba51cfdac6492aa4cc219ccd566dee~tplv-k3u1fbpfcp-zoom-1.image)

这个相对变量 `currentColor` 同样也能与 `color-mix()` 一起使用。例如：

```CSS
.box {
    color: red;
    border: 5px solid color-mix(in srgb, currentColor 30%, white);
    background-color: color-mix(in srgb, currentColor 30%, black);
    outline: 5px solid currentColor;
    outline-offset: 5px;
}
```

在 `color-mix()` 函数中使用 `currentColor` 的效果如下所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ade9e942814447c0a2b866e377d380bc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRYewKz>

也就是说，在 `color-mix()` 函数中使用相对变量 `currentColor` 可以相对于某个颜色进行混合，有点类似于 CSS 相对颜色特性。

不过有些地方曾经阐述过，在 `color-mix()` 函数中使用 `currentColor` 是不起作用的，但我实测下来是有效果。只不过，在 Chrome 调试器中改变 `color` 值时，并没看到 `color-mix()` 有相应变化：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c14cf62d60e8413f9711009d3f1442f0~tplv-k3u1fbpfcp-zoom-1.image)

你可能已经发现了，在 Chrome 浏览器中，可以使用开发者工具查看 `color-mix()` 函数的结果，也可以使用它来调试 `color-mix()` 函数。它可以识别并突出显示语法，在样式面板的样式旁边创建混合预览，并允许选择替代颜色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97a9f93e017e4e7cbeae94ca694b8ee3~tplv-k3u1fbpfcp-zoom-1.image)

## color-mix() 的降级处理

由于 `color-mix()` 函数是 CSS 规范的一个相对较新的特性，虽然截至目前为止（2023年 06 月），`color-mix()` 函数已得到主流浏览器的支持，但是要在项目中使用，还是需要考虑旧版本浏览器兼容性问题。

你可以像使用 `color()` 函数那样，在使用 `color-mix()` 函数时，对其进行降级处理。首先使用备用样式，为不支持 `color-mix()` 函数的浏览器提供替代的颜色。在 CSS 中使用 `@supports` 规则检测函数支持情况，并相应地应用备用样式：

```CSS
.element {
    background-color: purple; /* 不支持的浏览器的备用颜色 */
}

@supports (background-color: color-mix(in srgb, red, blue)) {
    .element {
        background-color: color-mix(in srgb, red 50%, blue);
    }
}
```

其次也可以有效使用自定义属性的无效变量，例如：

```CSS
@supports (background-color: color-mix(in srgb, red, blue)) {
    :root {
        --mix-color: ; /* 冒号(:)和分号(;) 之间有一个空格符 */
    }
}

.element {
    --mixing-color: var(--mix-color) color-mix(in srgb, red 50%, blue);
    --primary-color: var(--mixing-color, purple);
    background-color: var(--primary-color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bff7e7b272442a3b080f41adec78ba7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNamYPp>

你也可以采用渐进增强的处理方式，首先设计基本的颜色方案，以在所有浏览器上运行良好，然后增强 `color-mix()` 函数在支持它的浏览器上的使用。这种方法确保所有用户都拥有一个功能强大且外观吸引人的体验，而不管的浏览器能力如何。

最后就是采用 `color-mix()` 函数的 Polyfill 了，只不过到目前为止还没有相应的 Polyfill 出现，但你可以持续关注这方面的进展。如果有相应的 Polyfill，就可以为不支持的浏览器提供 JavaScript 实现函数，来填补浏览器支持的差距。当然，你也可以使用相关的 PostCSS 插件，这样无需增加额外的精力来处理 `color-mix()` 函数的兼容性。

## 小结

CSS 的 `color-mix()` 函数主要特性是可以将两种颜色按比例混合出新的颜色，除此之外，它可以像相对颜色一样，改变颜色的透明度。虽然它的表现上似乎复制了 Sass 处理器中的 `light()` 和 `darken()` 函数，但它在如何调整颜色方面提供了更大、更精细的控制，并且它是 CSS 的一部分，是 CSS 原生的特性。

在实际开发的过程中，我们可以使用 `color-mix()` 函数来制作 Web 应用或页面的主题，也可以用它来制作主题色的调色板等。

虽然目前仅有现代浏览器支持 `color-mix()` 函数，但采用备用样式和渐进增强等策略，可以确保你的设计在不同的浏览器上保持视觉一致性和功能性。随着对 `color-mix()` 函数的支持不断改进，它预计成为 Web 设计师和开发人员创建动态和适应性颜色方案的宝贵工具。

就我个人而言，将 `color-mix()` 与 `color-contrast()` 结合起来是一个特别令人兴奋的领域，可以帮助我们制作出一个可访问性更强的应用，也能给用户一个更佳的体验。
