如果你像我一样，看到最近在 CSS 中涉及颜色的所有事情，可能会有点不知所措。在我的印象中，长达十年来，HSL 是设置 Web 元素颜色的最佳选择。但随着 [@Lea Verou ](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)和 [@Jim Nielsen](https://blog.jim-nielsen.com/2023/ok-lch-im-convinced/) 提出新的观点——“LCH 是最适合给 Web 元素设置颜色的一种方式”。在此之后，我也认为 **LCH 是创建统一、易于访问和可预测的 UI 颜色的最佳方式**。

就在 LCH 颜色空间或者说 CSS 的 `lch()` 颜色函数得到主流浏览器支持的时候，隶属于同一颜色域 CIELAB 的 CSS 颜色函数 `lab()` 、`oklab()` 和 `oklch()` 也得到主流浏览器的支持，而且其中 `oklab()` 和 `oklch()` 又号称是 `lab()` 和 `lch()` 的修正版。简单地说，新创建的 OKLAB 和 OKLCH 解决了 LAB 和 LCH 所存在的部分问题。

换句话说，突然之间，Web 开发者给 Web 元素设置颜色时又多了几个新的选择，比如 `hwb()` 、`lab()` 、`lch()` 、`oklab()` 、`oklch()` 。这对于 Web 设计师或开发者来说，既是件好事，也是件坏事。因为选择一多，人就会迷糊，**很容易在这一切中迷失**。也正如一位掘金网友所说，不就是给 Web 元素设置颜色吗？我们有必要花那么多时间学习新的颜色模式？所以我要尝试让它变得简单，同时在此过程中，希望我能说服你，它们是值得深入学习的。

我在小册的《[10 | 现代 CSS 中的颜色格式： RGB，HSL，HWB，LAB 和 LCH](https://juejin.cn/book/7223230325122400288/section/7231515598088306720)》和《[11 | 新的 CSS 颜色空间：为 Web 设置高清颜色](https://juejin.cn/book/7223230325122400288/section/7233227753909125178)》两节课中，分别介绍了现代 CSS 中的颜色格式和颜色空间以及如何给 Web 设置高清颜色等知识。在介绍它们的过程中，我曾留下了一个小尾巴，那就是 OKLAB 和 OKLCH。那么，这节课将主要围绕 OKLAB 和 OKLCH 来介绍，说说为什么要选择 OKLAB 和 OKLCH ，以及如何使用它们。

接下来让我们直接进入主题吧！

## OKLAB 和 OKLCH

OKLAB 和 OKLCH 颜色空间是由 [@Björn Ottosson](https://twitter.com/bjornornorn) 于 2020 年创建的，它们被创建的主要原因是为了解决 LAB 和 LCH 的问题，即**解决色调偏移的错误**，所以它们又称为 LAB 和 LCH 的修正版本。[@Björn 撰写了一篇优秀的文章](https://bottosson.github.io/posts/oklab/)，详细介绍了为什么创造它们，以及它们的实现细节。

OKLAB 非常年轻，是相对较新的颜色类型。它是一种基于 CIELAB 颜色空间的颜色模型，通过对不同光源下的颜色重新调整，尽可能减少颜色失值。而 OKLCH 则是在 OKLAB 的基础上发展而来的颜色类型，它增加了颜色的饱和度和色调信息，使得在设计中能够更好的进行颜色变化和搭配。

简单地说，在 CSS 中，使用 OKLAB 和 OKLCH 可以更加准确地表达颜色，为设计师提供更多的选择和更好的设计效果。

而 **OKLAB 和 OKLCH 的主要弱点就是新**，不过它们发展得很快，仅仅两年后，OKLAB 就得到了非常好的应用。比如，添加到 [CSS 颜色模块 Level4 规范](https://www.w3.org/TR/css-color-4/#ok-lab)中，得到主流浏览器的支持，而且 Photoshop 设计软件也添加了 OKLAB 的渐变插值，以及被用于[颜色调色板生成器](https://huetone.ardov.me/)以实现良好的可访问性。

我个人认为，CSS 颜色模块 [Level4](https://www.w3.org/TR/css-color-4/) 和 [Level5](https://www.w3.org/TR/css-color-5/) 带来的巨大变化是把最新和最佳解决方案纳入囊中的好时机。在任何情况下，我们都需要为新的 CSS 规范的新特性创建一个新的生态系统。

## CSS 中如何使用 OKLAB 和 OKLCH

在 CSS 中，我们可以使用 `oklab()` 和 `oklch()` 颜色函数来指定使用的颜色是 OKLAB 还是 OKLCH 。它们都可以接受三个参数或四个参数，其中第四个参数是用来指定颜色透明度的，而且需要使用斜杠（`/`）符号与其他三个参数分隔开，即：

*   `oklab(L a b)` 或 `oklab(L a b / A)`
*   `oklch(l c h)` 或 `oklch(l c h / A)`

另外，`oklab()` 和 `oklch()` 仅支持颜色函数的新语法。即每个参数之间使用空格符作为分隔符，不能使用逗号（`,`）。例如：

```CSS
/* 有效的 CSS 规则 */
.valid-css-oklab {
    color: oklab(40.1% 0.1143 0.045);
    background-color: oklab(59.69% 0.1007 0.1191 / 0.5);
} 

.valid-css-oklch {
    color: oklch(40.1% 0.123 21.57);
    background-color: oklch(59.69% 0.156 49.77 / .5);
}

/* 无效的 CSS 规则 */
.valid-css-oklab {
    color: oklab(40.1%, 0.1143, 0.045);
    background-color: oklab(59.69%, 0.1007, 0.1191, 0.5);
} 

.valid-css-oklch {
    color: oklch(40.1%, 0.123, 21.57);
    background-color: oklch(59.69%, 0.156, 49.77, .5);
}
```

看到上面的代码之后，你肯定想知道代码中的每个数值各代表的是什么。

那我们先来看 `oklab()` 函数的四个值。

*   **`L`** 用来指定感知明度（亮度），它介于 `0 ~ 1` 之间的数字（`<number>`）或介于 `0% ~ 100%` 之间的百分比（`<percentage>`）。此处数值 `0` （或 `0%`）代表黑色，`1` （或 `100%`）代表白色。需要注意的是，使用百分比值时，取 `0` 值时也需要带上单位 `%` ，即 `0%` ，而且当值小于 `0%` 时，必须在计算值时被钳制解析为 `0%`；大于 `100%` 的值被钳制解析为 `100%` 。
*   **`a`** 指定了在 OKLAB 空间中沿 `a` 轴的距离，即颜色中绿或红的程度，它的值是介于 `-0.4 ~ 0.4` 之间的数字（`<number>`）或介于 `0% ~ 100%` 之间的百分比（`<percentage>`），其中 `0% = 0` ，`100% = 0.4` ，`-100% = -0.4` 。
*   **`b`** 指定了在 OKLAB 空间中沿 `b` 轴的距离，即颜色中蓝或黄的程度，它的值是介于 `-0.4 ~ 0.4` 之间的数字（`<number>`）或介于 `0% ~ 100%` 之间的百分比（`<percentage>`），其中 `0% = 0` ，`100% = 0.4` ，`-100% = -0.4` 。
*   **`A`** 用来指定颜色的透明度，即颜色的 Alpha 通道的值，它的值是介于 `0 ~ 1` 之间的数字（`<number>`）或介于 `0% ~ 100%` 之间的百分比值（`<percentage>`）。此处的数值 `0` （或 `0%`）表示完全透明，`1` （或 `100%`）表示完全不透明。

例如：

```CSS
.element {
    --color-1: oklab(40.101% 0.1147 0.0453); 
    --color-2: oklab(59.686% 0.1009 0.1192); 
    --color-3: oklab(0.65125 -0.0320 0.1274); 
    --color-4: oklab(66.016% -0.1084 0.1114); 
    --color-5: oklab(72.322% -0.0465 -0.1150); 
    --color-6: oklab(42.1% 41% -25%);
    --color-7: oklab(21% -.4 2.5 / 50%);
    --color-8: oklab(21% .4 -2.5 / .5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aee41e8a2aa34e3d9721015ecb0baeb3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJBaErN> （请使用 Safari 查看 Demo，效果更佳）

`oklab()` 函数中每个参数（即 `L` 、`a` 、`b` 和 `A` ）取值除了数字（`<number>`）和百分比（`<percentage>`）之外，还可以是关键词 `none` 。例如：

```CSS
.element {
    --oklab-l-none: oklab(none .3 -.3);
    --oklab-a-none: oklab(30% none .2);
    --oklab-b-none: oklab(.3 0.2 none);
    --oklab-A-none: oklab(50% .4 -.2 / none);
    --oklab-lab-none: oklab(none none none);
    --oklab-all-none: oklab(none none none / none);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f718c8a55af43ebb40b8b448227a771~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmMagm>

正如你所看到的，当 `oklab()` 函数中的 `A` 的值为 `none` 时，它的效果相当于 `0` ，完全透明不可见。而 `oklab()` 函数中的 `L` 、`a` 和 `b` 三个参数的值同时为 `none` 时，该颜色则为黑色。注意，取值为 `none` 时，这可能发生在颜色变换（计算）之后。

有一点需要注意的是，我们在使用 `oklab()` 颜色函数来设置元素颜色时，其第二个参数（`a`）和第三个参数（`b`）的值理论上是无界限的（即可以大于 `0.4` （或 `100%`）；也可以小于 `-0.4` （或 `-100%`）），但在实践中不超过 `±0.5` （ OKLAB 对应到 sRGB 或 P3 的色域部分不高于 `0.37`，对应到 Rec2020 的色域部分不高于 `0.47`）。

如果你对 `oklab()` 函数感兴趣，可以尝试拖动下面示例中的滑块，查看 `oklab()` 函数参数变化时的颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cc1e0b0395149459fc5dde69ce0acac~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxyBmy>

CSS 的 `oklch()` 函数和 `oklab()` 极其相似，我们来看下它的四个参数值的含义。

*   **`L`** 和 `oklab()` 函数中的 `L` 完全相同，指定了感知明度（亮度），它介于 `0 ~ 1` 之间的数字（`<number>`）或介于 `0% ~ 100%` 之间的百分比（`<percentage>`）。
*   **`C`** 指的是色度（颜色饱和度），用于衡量色度（即“颜色的数量”），它介于 `0 ~ 0.4` 之间的数字（`<number>`）或介于 `0% ~ 100%` 之间的百分比，其中 `0% = 0` ，`100% = 0.4` 。它的最小值为 `0` （或 `0%`），如果提供的值为负值，则在计算值时会将其解析为 `0` （或 `0%`），而其最大值在理论上无界限，实际上却有一个限制（不超过 `0.5`），但这取决于屏幕的颜色色域（P3 颜色会比 sRGB 具有更大的值），每个色调的最大色度不同。对于 P3 和 sRGB，该值始终低于 `0.37`。
*   **`H`** 指的是色相角度，它的解释类似于 HSL 和 LCH 中的 `H` ，但不会以相同的方式将色相映射到角度上。它的值可以是数字（ `<number>` ）或百分比（`<percentage>`），其中 `0% = 0deg` ，`100% = 360deg` ，并且在实际使用的时候，不需要显式设置角度单位，即 `deg`。`0deg` 度沿着正 `a` 轴指向紫红色（如 `360deg` 、`720deg`）；`90deg` 沿正`b` 轴指向芥末黄；`180deg` 沿着负 `a` 轴指向蓝绿色；`270deg` 沿着负 `b` 轴指向天蓝色。
*   **`A`** 用来指定颜色的透明度，即颜色的 Alpha 通道的值，它的值是介于 `0 ~ 1` 之间的数字（`<number>`）或介于 `0% ~ 100%` 之间的百分比值（`<percentage>`）。此处的数值 `0` （或 `0%`）表示完全透明，`1` （或 `100%`）表示完全不透明。

比较有意思的是，OKLCH 中的 L 、C、H 和 A 分别是：

*   `L` ，它从深紫色开始，随着向右移动，变成浅紫色，最终变为白色；
*   `C` ，它开始时是灰紫色的，向浅紫色转变，在约 33％ 的距离向右转变为白色；
*   `H` ，从左右到移动色相，会出现一系列充满活力的颜色变化的范围；
*   `A` ，Alpha 通道向右延伸时变成浅紫色

如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/deaf66e4a00642f0b8072af08537fa24~tplv-k3u1fbpfcp-zoom-1.image)

下面代码展示的就是 `oklch()` 函数最基础的使用方式：

```CSS
:root {
    --color-1:oklch(40.101% 0.12332 21.555); 
    --color-2:oklch(59.686% 0.15619 49.7694); 
    --color-3:oklch(0.65125 0.13138 104.097); 
    --color-4:oklch(0.66016 0.15546 134.231); 
    --color-5:oklch(72.322% 0.12403 247.996); 
    --color-6:oklch(42.1% 48.25% 328.4);
}
```

我制作了一个小示例，你可以尝试拖动示例中的滑块，查看 `oklch()` 函数指定的颜色效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17af0f50e66c4cbfa9c705b2f9db96c3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJBaeXW>

注意，`oklch()` 和 `oklab()` 函数相似，每个参数的值还可以是 `none` 。例如：

```CSS
.white {
    color: oklch(100% 0 none);
}
```

因为白色没有色相，所以浏览器将把 `none` 解析为 `0`。

上面所介绍的都是 `oklab()` 和 `oklch()` 最最基础的使用方式，它们还有一些更高级的使用方法。比如在《[10 | 现代 CSS 中的颜色格式：RGB、HSL、HWB、LAB 和 LCH](https://juejin.cn/book/7223230325122400288/section/7231515598088306720)》中所介绍的相对颜色语法，也可以运用于 `oklab()` 和 `oklch()` 上。拿 `oklch()` 为例，可以基于一个主题色（比如 `oklch(70% .14 113)`），使用相对语法改变它的色相，就可以得到基于 `oklch(70% .14 113)` 演变出来的一系列颜色值：

```CSS
:root {
    --origion-color: oklch(70% .14 113);
    --color-1: oklch(from var(--origion-color) 0% c h);
    --color-2: oklch(from var(--origion-color) 10% c h);
    --color-3: oklch(from var(--origion-color) 20% c h);
    --color-4: oklch(from var(--origion-color) 30% c h);
    --color-5: oklch(from var(--origion-color) 40% c h);
    --color-6: oklch(from var(--origion-color) 50% c h);
    --color-7: oklch(from var(--origion-color) 60% c h);
    --color-8: var(--origion-color);
    --color-9: oklch(from var(--origion-color) 80% c h);
    --color-10: oklch(from var(--origion-color) 90% c h);
    --color-11: oklch(from var(--origion-color) 100% c h);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/144767d3283548b9aed853029bc8f996~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgXKLY> （请使用 Safari 查看）

同样的，你可以在相对颜色中使用 `calc()` 来改变它们的参数值，比如：

```CSS
:root {
    --accent:   oklch(70% 0.14 113);
}

button {
    background-color: var(--accent);
    border-color: var(--accent);
}

button:hover {
    /* 亮度增加 10% */
    background: oklch(from var(--accent) calc(l + 10%) c h);
    
    /* 亮度减少 10% */
    border-color: oklch(from var(--accent) calc(l - 10%) c h);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8baa55685a04449bf1d1f6a27e284d2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxyLzG> （请使用 Safari 查看 Demo）

你可能会担心 `oklab()` 和 `oklch()` 过于新，浏览器支持不好。事实上，它们已经得到了主流浏览器的支持。如果你想现在就尝试在项目中使用它们，比如在支持的浏览器中使用它们，在不支持它们的浏览器进行降级处理。要做到这一点很简单，可以借助 CSS 的 `@supports` 检测。比如像下面这样：

```CSS
@supports (color: oklch(73% 0.17 192)) {
    :root {
        --accent-color-1: oklch(73.54% 0.169 193);
        --accent-color-2: oklch(68.15% 0.272 9);
        --accent-color-3: oklab(77.94% 0.203 62);
        --accent-color-4: oklab(66.67% 0.193 253);
    }
}

@supports not (color:oklch(73% 0.17 192)) {
    :root {
        --accent-color-1: hsl(179.56deg 100% 19.96%);
        --accent-color-2: hsl(335.03deg 100% 54.88%);
        --accent-color-3: hsl(135.81deg 90.67% 57.9%);
        --accent-color-4: hsl(136.53deg 88.04% 55.94%);
    }
}
```

需要注意的是，这种降级方式可能会有部分颜色丢失。因为 HSL 和 OKLCH 或 OKLAB 相比，色彩数量要少得多。或者在编写代码的时候为 `oklab()` 或 `oklch()` 提供备用值，例如：

```CSS
.element {
    background-color: hsl(179 100% 38%);
    background-color: oklch(73% 0.17 193);
}
```

再者就是将 `@supports` 和 CSS 自定义属性中的 `var()` 结合起来使用，也可以做一些降级处理：

```CSS
@supports (background: oklch(0.71 0.34 338.69)) {
    :root {
        --oklch: ; /* 冒号(:)和分号(;) 之间有一个空格符 */
    }
}

body {
    --hotterpink: var(--oklch) oklch(0.71 0.34 338.69);
    --hotpink: var(--hotterpink, hotpink);
    background: var(--hotpink);
}
```

如果检测不到对 `oklch()` 的支持，则 `--hotterpink` 将未定义并变为保证无效的初始值（`initial`）。在这种情况下，`--hotpink`将退回到 `hotpink`。

## OKLAB 和 OKLCH 的优势

在 CSS 中，OKLAB 和 OKLCH 是相对较新的颜色类型，与传统的 RGB 相比，差异主要在于以下几个方面。

*   **颜色空间不同** ：OKLAB 和 OKLCH 是基于 CIELAB 颜色空间的颜色类型，而 RGB 是基于 sRGB 颜色空间的颜色类型，这也决定了它们在表达颜色时的差异。
*   **更加准确的色彩表达** ：由于 OKLAB 和 OKLCH 对不同光源下的颜色进行重新调整，它们能更加准确地表达颜色，为设计师提供更多的选择和更好的设计效果。
*   **更广泛的颜色空间范围** ：相比传统的 sRGB 颜色空间的颜色，OKLAB 和 OKLCH 能够表达更广泛的颜色，包括在鲜艳度、色彩鲜艳度和对比度方面表现更佳。
*   **更灵活的颜色调整** ：OKLCH 在 OKLAB 的基础上增加了颜色的浓度和色调信息，可以在设计中更加灵活且准确的表达颜色，比如通过色调调整来改变颜色的暖度和冷度值。

简单地说，**[OKLAB 和 OKLCH 主要用于解决色调偏移错误](https://bottosson.github.io/posts/oklab/)**。

## OKLAB vs. OKLCH

OKLAB 和 OKLCH 都是 CSS 中用于描述颜色的格式，但它们之间也存在一些区别。

OKLAB 是一种机制颜色空间，它使用光学感应器模拟人眼的感受，根据亮度、绿红值和蓝黄值来描述颜色。OKLAB 通常被认为是一种更准确的颜色格式，更能够捕捉到视觉系统的特征，并且在理论上比其他格式更适合人眼的感知。因此，OKLAB 适用于需要高色彩精度和色彩准确性的场景，例如 CSS 中的渐变就非常适合使用 OKLAB。

OKLCH 是一种基于色相、明度和饱和度的颜色空间，它更侧重于描述颜色的色相、明度和饱和度，可以根据色相、明度和饱和度三个维度直观地调节颜色。因此，OKLCH 非常适用于需要优化整体色彩效果、提升视觉体验的场景，例如 Web 设计、UI 设计等。另外，OKLCH 在诸如拓展参数化颜色、渐变颜色控制等方面，也有着独特的优势和应用价值。

总的来说，OKLAB 更注重颜色的准确性，而 OKLCH 更注重颜色的饱和度和亮度的调整。在实际应用中，可以根据具体的需要选择使用不同的颜色格式。

而在 CSS 中，OKLAB 和 OKLCH 分别对应着 `oklab()` 和 `oklch()` 函数。换句话说，OKLAB 和 OKLCH 定义的颜色是由这两个函数来描述的。其中，`oklab()` 颜色函数在 OKLAB 颜色空间中使用直角坐标系，有 `a` 轴和 `b` 轴，而 `oklch()` 在 OKLCH 颜色空间中使用的是极坐标系，有 `C`（色度）和 `H`（色相）。当然，它们有着最大的共性，都有相同的 `L` 轴，即人眼对颜色的感知明度（亮度）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21fea567dd3f4d6db885a161e60a8257~tplv-k3u1fbpfcp-zoom-1.image)

到这里，我想你对 OKLAB 和 OKLCH 有了一个简单的认识，而且也知道在 CSS 中如何使用 `oklab()` 和 `oklch()` 两个函数来指定 OKLAB 和 OKLCH 颜色空间的颜色类型。这仅是它们最基础的知识，如果你还想深入了解，比如为什么要使用 OKLAB 或 OKLCH，还得继续往下阅读。

> 注意，前面提到过，OKLCH 是在 OKLAB 的基础上发展而来的颜色类型，加上 OKLCH 相比于 OKLAB 更受 Web 设计师和开发者的青睐。因此，接下来的内容主要围绕着 OKLCH 展开。

## 为什么是 OKLCH ?

记得在课程的开头就提到过，在 CSS 中已经有很多描述颜色的函数存在了，而且像 HSL 颜色类型在 Web 中已是霸主了，那为什么还会需要新的颜色类型呢？这不是给 Web 开发者提高学习成本吗？

要阐述清楚这个话题，就不得不从 HSL 和 LCH 说起。

虽然近十年来，HSL 一直是 Web 设计师和开发者最喜欢使用的颜色类型，但它有一个明显的缺陷，即 **HSL 的亮度值与眼睛的感知不一样**。比如，基于 HSL 建立的调色板，在感官上同一等级差异太大。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/666818f8e6464fed9cfaa8a69e369329~tplv-k3u1fbpfcp-zoom-1.image)

而且，基于 HSL 的渐变色，由于各个色相的感知亮度不均匀，可能发生非预期的变化。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50071c31604649dd9fe3ce4efefbacb1~tplv-k3u1fbpfcp-zoom-1.image)

如此一来，HSL 很可能给你的 Web 带来不可预测的麻烦。例如，与在同一个背景上的紫色文字相比，同样 HSL 亮度的绿色文字很难看清：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6a9f09c7b8646939de8045caba3b913~tplv-k3u1fbpfcp-zoom-1.image)

除此之外，HSL 是属于 sRGB 颜色空间，仅限于 1670 万种颜色，看起来已经非常多的颜色了，但对于高速发展的硬件（比如显示器）来说，HSL 是远远不够的，因为新的硬件所支持的颜色范围已经超过了 sRGB 覆盖率。此外，sRGB 是基于显示器的工作方式设计的，而不是人眼，所以不太适合创建一致和可访问的颜色系统。这就是为什么后面又出来一个 LCH 颜色类型，而且 LCH 的出现，得到众多人的赞扬，比如  [@Lea Verou ](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)和 [@Jim Nielsen](https://blog.jim-nielsen.com/2023/ok-lch-im-convinced/) 就曾说过“LCH 是最适合给 Web 元素设置颜色的一种方式”。

这是因为 LCH 的主要目标就是**实现感知均匀性**，这意味着它的行为更符合人类眼睛感知颜色的方式。理论上，LCH 可以描述无限数量的颜色，但对我们来说重要的是，它的颜色色域（CIELAB 或 CIELCH）比 sRGB更大。这意味它可以表示更广泛的颜色范围，从而可以创建出更美丽的 Web。

其实，LCH 和 HSL 有一定的相似性，但每个颜色空间处理颜色的方式都略有不同。下图可以向大家展示 LCH 和 HSL 在亮度、饱和度和色相三大参数之间的差异性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63ef5bcb43bb4087aaa305e35f807dde~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，

*   HSL 亮度类似于在纯色中添加黑色或白色的量，例如纯蓝色通过添加白色来创建浅蓝色；LCH 亮度描述了颜色相对于相同照明下的白色的相对亮度
*   HSL 饱和度范围是从 `0` （灰色）到 `100` （最纯净）；LCH 的饱和度范围是从 `0` 到大约 `131` ，但由于屏幕的限制，并非所有颜色都能达到这个最大值
*   HSL 和 LCH 的色调（色相）基本相似。色谱从红色开始，逐渐过渡到绿色、蓝色，然后回到红色。唯一的区别是，LCH 中的色调与HSL中的略有偏移。比如，HSL中 `0` 的色调值是纯红色，而在 LCH 中它是带有粉红色的红色。

所以说，LCH 的感知均匀性：所有颜色的明度和饱和度相同，只有色调变化。因此，LCH 中的颜色似乎混合在一起，而在 HSL 中它们大不相同。

因此，它目前是创建 UI 调色板的最佳方式。 例如，下面是 `L=75` 时的 HCL 示例，去掉色度后更容易看出色彩具备感知均匀性。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/448bad9d7fcb47cf99610f85a634d3e6~tplv-k3u1fbpfcp-zoom-1.image)

基于 HCL 建立的调色板，能够比较准确的反映色彩级别，可以轻易地更换色相。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1463de5c4164ddbac96306164b44cf6~tplv-k3u1fbpfcp-zoom-1.image)

另外，LCH 的感知均匀性使你可以轻松地交换颜色而不影响对比度比率。这对于在 UI 中尝试不同的颜色组合很有用。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f50fd1272cf44b58911e5799d9976125~tplv-k3u1fbpfcp-zoom-1.image)

你一定会好奇，既然 LCH 这么好，为什么没有像 HSL 那样广泛运用于 Web 上呢？主要原因是浏览器对 `lch()` 的支持没有 `hsl()` 那么好，直到近两年，各大主流浏览器才支持 `lch()` 。

除此之外，LCH 还有一些小瑕疵。比如，在部分色相区域会发生色调偏移，而且强烈的色度会影响亮度感知，HCL 面对色度变化时感知亮度不太均匀。

而我们今天所介绍的 OKLCH 基本上没有 HSL 和 LCH 那些问题。接下来，我们就一起比较 OKLCH 与其他颜色类型，只有比较才能得出相应的结论。

### OKLCH vs. RGB/HEX

RGB 和 HEX（十六进制）颜色格式是 Web 中设置颜色的常用模式之一。它们有着一个共同的特点，颜色格式中都包含三个数字，分别代表红色、绿色和蓝色的数量。例如，`#09fa3e` 和 `rgb(9 250 62)` 描述的同一个颜色。

> 注意，新出现的 P3 类型的颜色 `color(display-p3 0.45 0.97 0.37)` ，也是包含三个数字，也分别代红色、绿色和蓝色的数量。需要知道的是，`color(display-p3 R G B)` 中的 `1` 数字值要比 RGB 中的 `255` 数字值更大。

正如你所看到的，这三种不同的描述方式定义的都是同一个颜色。从侧面说明这几个颜色格式都存在一个根本性的问题：**对于大多数 Web 开发者来说，它们都难以阅读**。相反，大家只能像使用某种魔术一样来使用它们，缺乏任何真正的理解或比较方式。

除此之外，RGB、十六进制和 `color(display-p3 R G B)` 对于颜色修改也不方便，因为对于绝大多数人来说，通过更改红、绿和蓝的数量来直观地设置颜色极其困难。此外，RGB 和 十六进制也不能编码 P3 颜色，这是因为 P3 颜色数量要比 RGB 和十六进制颜色数量多得多。

另一方面， OKLCH、LCH 和 HSL 具有更接近人们自然思考颜色方式的可设置值。正如前面所说，OKLCH 和 LCH 各包含三个数字，分别表示亮度、色度（或饱和度）和色调（色相）。

来看一段具体的代码：

```CSS
:root {
    /* 蓝色 */
    --color-rgb-blue: rgb(110 163 219);
    --color-hex-blue: #6ea3db;
    --color-p3-blue: color(display-p3 0.48 0.63 0.84);
    --color-oklch-blue: oklch(0.7 0.1 252.18);
    
    /* 更亮的蓝色 */
    --color-rgb-lighter-blue: rgb(125 179 235);
    --color-hex-lighter-blue: #7db3eb;
    --color-p3-lighter-blue: color(display-p3 0.54 0.7 0.9);
    --color-oklch-lighter-blue: oklch(0.75 0.1 249.41);
    
    /* 同样饱和度的红色 */
    --color-rgb-red: rgb(214 133 133);
    --color-hex-red: #d68585;
    --color-p3-red: color(display-p3 0.79 0.54 0.53);
    --color-oklch-red: oklch(0.7 0.1 19.9);
}
```

总得来说，OKLCH 和 RGB 、 HEX 之间的主要区别有以下几个方面。

*   **基础的颜色空间** ： RGB 和 HEX 是基于颜色的加法原理来表达颜色的，而 OKLCH 是基于颜色的亮度、饱和度和色调（色相），所以其表达颜色的原理和基础颜色空间是不同的。
*   **调色方式** ： 在 RGB 和 HEX 中，调整颜色通常是通过改变红、绿、蓝的数量或比例来实现的，但这种方式可能会导致色彩失真，不利于产品设计。而在 OKLCH 中，通过调整亮度、饱和度和色调等值来实现更加准确的颜色表现和更好的产品展现。
*   **颜色范围** ： RGB 和 HEX 能够表达的颜色范围是有限的，而 OKLCH 则包含了更鲜艳、更艳丽和更精致的颜色，更适用于某些复杂的场景。
*   **颜色兼容性** ： RGB 和 HEX 是浏览器所默认支持的颜色类型，支持程度高，几乎所有的浏览器都支持。而 OKLCH 则相对较新，并不是所有的浏览器都支持它，如果站点的大部分目标用户使用老旧版本的浏览器，那么OKLCH 的使用可能会导致精度和兼容性问题。

### OKLCH vs. HSL

现在，让我们继续比较 OKLCH 和 HSL。

HSL 颜色格式也包含三个数字来定义颜色，这三个数字分别代表的是色调（色相）`H` 、饱和度 `S` 和亮度 `L` 。例如 `hsl(0.7deg 48.3% 67.8%)` 。HSL 的主要问题在于它具有圆柱形的颜色空间。

在 HSL 中，亮度和饱和度各自从 `0％` 到 `100％` 的范围内变化，其中 `0％` 表示没有颜色，`100％` 表示可以在 sRGB 色域中表示的最高光或饱和颜色，sRGB 是历史上大多数彩色显示器可用的颜色范围。但事实上，我们显示器和眼睛对于不同色调具有不同的最大饱和度，我们可以通过改变颜色空间的形态，并将颜色扩展到具有相同的最大值来隐藏这种复杂性。

简单地说，这与我们的眼睛感知光线的方式并不完全相符。看看这两个 HSL 颜色，它们都具有相同的 HSL 亮度值`50%`：

```CSS
:root {
    /* 具有相同的亮度值 */
    --color-blue: hsl(217deg 55% 50%);
    --color-green: hsl(110deg 55% 50%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60a2500215b64fd680b5e67b0ac8faf2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmyNNy>

这两种颜色具有相同的指定亮度，但第二种颜色在我们眼中看起来更明亮。我们使用 OKLCH 格式来描述与上面相同的颜色：

```CSS
:root {
    --color-blue: oklch(55% 0.15 260);
    --color-green: oklch(73% 0.2 141);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a98a66aced5d4cc59064a1fb27e8ec5e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxopRy>

请注意，在 OKLCH 中亮度是不同的（分别为 `55％` 和 `73％`）。那么，当我们将绿色的亮度降低到与蓝色相同时会发生什么？

```CSS
:root {
    --color-blue: oklch(55% 0.15 260);
    --color-green: oklch(55% 0.2 141);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b734b4a2f5be47429f1b3e8f762557f2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRYPrvj>

不难发现，通过在 OKLCH 中给它们设置相等的亮度值 `55%` ，绿色变暗了。现在它们看起来同样明亮。此外，这两种颜色的指定色度（饱和度）是不同的，分别是 `0.15` 和 `0.2` 。那么，要是将第二个颜色的饱和度也调至 `.015` ，又会发生什么呢？

```CSS
:root {
    --color-blue: oklch(55% 0.15 260);
    --color-green: oklch(55% 0.15 141);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92fc913acb2746199437043534564864~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/abRPpEr>

这里的差异更加微妙，但右侧的绿色已经从前面的例子中脱色了。现在这两种颜色都看起来具有相同的亮度和相同的鲜艳度。

在 HSL 中，`100％` 的饱和度仅表示该特定颜色在 sRGB 色域中可以达到的最高饱和度。在 OKLCH 中，这些值并不基于技术限制或数学定义，而是基于感知的平等。亮度的数量正好表示颜色的亮度，而色度的数量正好表示颜色的鲜艳度。人类眼睛会感知一些颜色（如绿色或黄色）比其他颜色（如蓝色或紫色）更亮，而 OKLCH 会考虑这些细节。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1298ad3dc564ef799d19b31ef135a7b~tplv-k3u1fbpfcp-zoom-1.image)

> 同一色度、饱和度和黑白版本下，HSL 和 OKLCH 空间的色调-亮度分片相同。HSL 亮度在色调轴上不一致。

由于 HSL 中的 `L` （亮度）分量不准确，不同的色调代表不同的“真实”亮度值。因此，使用 HSL 就无法正确的修改颜色。这就会导致对比度问题和较差的可访问性。比如下面这个示例：

```CSS
:root {
    /* HSL：具有相同的饱和度和亮度 */
    --color-hsl-purple: hsl(270 100% 50%);
    --color-hsl-green: hsl(90 100% 50%);
    
    /* OKLCH：具有相同的饱和度和亮度 */
    --color-oklch-purple: oklch(53% 0.29 294);
    --color-oklch-green: oklch(53% 0.29 135);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d06df1d5d144101a0e260714fb6561c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRPpPo>

这个示例再次说明，**HSL 对于颜色修改不利**。许多团队已要求社区避免使用 HSL 生成设计系统调色板。此外，像RGB 和十六进制一样，HSL 不能用于定义 P3 颜色。

OKLCH 不会扭曲颜色空间，它显示所有的复杂真实颜色空间。一方面，这种特性允许我们在颜色转换和 P3 颜色定义后拥有可预测的亮度值。但是，另一方面，OKLCH 中并非所有数字组合都会产生可见的颜色：有些只在 P3 显示器上可见。但还有一些好处：浏览器会呈现最接近支持的颜色。实际上，它可以指定人眼可以看到的任何颜色。在 CSS 中，浏览器将自动将任何超出范围的颜色舍入到硬件能够显示的最接近颜色。

说了这么多，OKLCH 和 HSL 之间的主要区别总结为以下几个方面。

*   **颜色空间不同** ：OKLCH 是基于 CIELUV 颜色空间的颜色类型，而 HSL 则是基于 sRGB 颜色空间，这也决定了它们在表达颜色时的差异。
*   **更高的准确性** : 由于 OKLCH 对不同光源下的颜色进行重新调整，使用它能准确地表达颜色。同时，OKLCH 增加了颜色的浓度和色调信息，使得在设计中更加灵活且准确的表达颜色。而 HSL 则不会有这种颜色调整和色相信息的影响，因此更容易产生色彩偏移的问题，表现的相对不够准确。
*   **颜色表示方式不同** ：在 HSL 中，颜色是由色调（`H`），饱和度（`S`）和亮度（`L`）三个值组成，而在 OKLCH 中，颜色是由亮度（`L`）、饱和度（`C`）和色调（`H`）三个值组成。 HSL 中的亮度也是相对 RGB 为准得出，不同的情况下 `L` 的表现会略有不同（比如在 RGB 值相同的情况下，实际看起来的明暗程度不同），OKLCH 可以更准确地表达适合品种的颜色。
*   **颜色范围不同** : 相对于 HSL，OKLCH 更适合表达饱和度高、色相浓烈的颜色，这样在表现某些特殊的设计要求时有更好的体验效果。

### OKLCH vs. LCH

最后，让我们来比较 OKLCH 和 LCH。

LCH 是一种优秀的颜色格式，它在CIE LAB（Lab）空间上创建，旨在解决 HSL 和 RGB 的所有问题。它可以编码 P3 颜色，并且在大多数情况下，可以产生可预测的颜色修改结果。

事实证明，只改变亮度值时，LCH 颜色空间存在一个痛点：**当色度和亮度改变时，在蓝色（色相值在** **`270 ~ 330`** **之间的蓝色）上会出现意外的色相偏移**。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bebf37155664587835d674a731a8933~tplv-k3u1fbpfcp-zoom-1.image)

比如下面这段代码：

```CSS
:root {
    --color-lch-1: lch(35% 110 300); /* 看起来像蓝色 */
    --color-lch-2: lch(35% 75 300); /* 改变饱和度，它看起来像紫色 */
    --color-lch-3: lch(35% 40 300); /* 改变饱和度，完全像紫色 */
    
    --color-oklch-1: oklch(48% 0.27 274);  /* 看起来像蓝色 */
    --color-oklch-2: oklch(48% 0.185 274); /* 仍然是蓝色 */
    --color-oklch-3: oklch(48% 0.1 274); /* 仍然是蓝色 */
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1d0e98643484b9ab4c6a43b20aa8f94~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRPJJN>

而 **OKLCH 是 LCH 的修正版，其出现主要就是解决 LCH 存在的问题**。现在我们已经介绍了主要的区别，让我们逐个探究每个颜色通道。

首先来看 OKLCH 和 LCH 两颜色模型中亮度 `L` 的差异。OKLCH 和 LCH 的亮度 `L` 都是从 `0%` 到 `100%` ，但在某些情况下，你可能会遇到以 `0` 到 `1` 比例定义的 OKLCH 亮度，如`oklch(0.45 0.11 294.41)` 。而且，这两个颜色空间的深色阴影也有很大的区别。LCH 的亮度为 `5` 大致相当于 OKLCH 的亮度为 `18` 。换句话说，任何 OKLCH 中亮度为 `15` 或以下的阴影都非常暗。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72c468760c5641fc8bf4005e8274feae~tplv-k3u1fbpfcp-zoom-1.image)

OKLCH 和 LCH 两种颜色格式中的色度（饱和度）的工作方式非常类似，唯一不同的是可用范围。LCH 色度范围是 `0 ~ 150` ，这取决于使用的色域，可能更多或更少。OKLCH 色度的范围是 `0 ~ 0.5` ，这也取决于色域。

最后就是它们（OKLCH 和 LCH）的色调（色相）了，都是使用 `0 ~ 360` 的范围。主要区别是改良了蓝色色调。在以下示例中，你可以看到恒定色相 `300` 的阴影，这些阴影也保持一致的色度，以便真正比较色相的差异。正如你所看到的，OKLCH 在整个光谱中都具有漂亮的蓝色。然而，LCH 在较暗的阴影中从蓝色到紫色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8c69f1acaee4d0eac108c18e5e742bb~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，OKLCH 和 LCH 的主要区别在于对颜色空间的调整方式不同。

*   **色彩失真不同** ：LCH 是在 CIE LAB 颜色空间的基础上计算色调，因为 LAB 颜色空间的坐标值在不同的光源下会有不同的色彩失真程度，所以 LCH 具有很高的色彩稳定性，会生成与 LAB 非常相似的颜色值。但是，它的色相信息并不是很充分，往往会导致色调补偿不足，使得颜色显得不够鲜艳。
*   **更准确的颜色表达** ：相比 LCH，OKLCH 通过对不同光源下的颜色的重新调整，尽可能减少色彩失真，因此它更能准确地表达颜色，避免色彩偏移和失真的问题。同时，OKLCH 还增加了颜色的浓度和色调信息，使得在设计中更加灵活且准确的表达颜色。

由于 OKLCH 没有任何主要缺点，因此可以放心地说，在创建下一个UI颜色调色板时，可以放弃 LCH 而采用 OKLCH。除此之外，OKLCH 不仅是错误修复。[它还具有与颜色轴背后的数学相关的不错的新功能](https://www.w3.org/TR/css-color-4/#ok-lab)。例如，[它具有改进的色域校正](https://bottosson.github.io/posts/gamutclipping/)，CSSWG建议[使用OKLCH进行色域映射](https://www.w3.org/TR/css-color-4/#css-gamut-mapping)。

我们还需要知道的是，使用 OKLCH 和 LCH 时，并非所有 `L`，`C` 和 `H` 的组合都会生成所有显示器都支持的颜色。虽然浏览器会尝试查找最接近的支持颜色，但最好还是使用[颜色选择器](https://oklch.com/#70,0.1,281,100)来检查颜色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/600cb97769d04f209c2a869b11490bd7~tplv-k3u1fbpfcp-zoom-1.image)

> 颜色选择器地址：<https://oklch.com/>

## 使用 OKLCH 可以获得的好处

我们花了一定的篇幅向大家阐述了 OKLCH 与其他颜色格式的不同之处。你也或多或少知道为什么应该选择 OKLCH 来设置 Web 元素的颜色。为了让大家接下来能在项目中使用 OKLCH ，在这里将告诉大家，我们现在或未来在项目中使用 OKLCH 可能获得的好处。

### 更好的可读性

第一个好处是，我们使用 OKLCH 颜色格式，从代码中就能知道代码所指的颜色是什么，即只需查看代码就可以理解颜色。例如，我们可以比较代码中的暗度，并找到一些与对比度相关的可访问性问题：

```CSS
.alert {
    background-color: oklch(80% 0.02 300);
    color: oklch(100% 0 0);
}

.alert--error {
    background-color: oklch(90% 0.04 30);
    color: oklch(50% 0.19 27);
}
```

### 颜色修改很简单

在代码中修改颜色很简单，并且可以获得可预测的结果：

```CSS
.button {
    background-color: oklch(50% 0.2 260);
}

.button:hover {
    background-color: oklch(60% 0.2 260);
}
```

### 颜色域的转换

我们可以使用相同的颜色函数处理 sRGB 和 P3 宽色域颜色。

```CSS
.button {
    background: oklch(62% 0.19 145);
}

@media (color-gamut: p3) {
    .button {
        background-color: oklch(62% 0.26 145);
    }
}
```

### 便于沟通

由于 OKLCH 更接近真实的颜色，使用 CSS 中的 `oklch()` 将有助于教育开发人员并带领社区更好地理解颜色。Web 开发者在 CSS 中使用 `oklch()` 易于与 Web 设计师所使用的工具保持同步，为改善开发和设计团队之间的沟通迈出了一小步。

### 我们为未来做好了准备

通过今天转向 OKLCH，我们为不久的将来做好了准备，在那里 CSS 将支持原生的颜色修改功能。 OKLCH 是颜色转换的最佳颜色空间，现在使用它们在颜色定义中以熟悉其轴线会更好。例如：

```CSS
.button:hover {
    background-color: oklch(from var(--button-color) calc(l + 10%) c h);
}
```

## 使用 OKLCH 需要注意的事项

其实，在课程前面已经向大家介绍了，如何在 CSS 中使用 `oklab()` 和 `oklch()` 颜色函数来指定所使用的颜色是 OKLAB 或 OKLCH 。但在具体的使用过程中，有些注意事项还是需要了解一下。继续拿 OKLCH 为例，因为它将是最好的一种颜色格式。

### 色度（饱和度）：C

使用 `oklch()` 时需要注意一些事项。最重要的是色度范围。与 HSL 中的饱和度不同，色度不是一个百分比。

在所有的意图和目的下，色度值是 `0 ~ 0.37` 之间的一个数字（规范定义的是 `0.4` ，理论上最高的值是 `0.5`）。例如，你可以尝试使用更高的色度值，比如 `25`，但是这将会被舍入到支持的颜色范围内，结果可能是不可预测的（你可能指定蓝色色相，但如果它足够鲜艳以“更接近”你指定的值，那么它可能会选择一个蓝绿色）。

理论上，OKLCH 颜色可以指定具有高达无限色度的颜色，但我认为这不合情理，比如我很难想象出比这更亮丽的红色：

```CSS
:root {
    --color-red: oklch(50% 0.37 29);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe0178f9841a4376b25ddf5cd349814c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOeXmVW>

也许我会相信某些超级强烈的颜料可以使其达到 `0.5` 之类的值，但仅此而已。所以，我不认为“无限”限制有任何帮助，应该将色度值尽可能的保持在 `0.37` 以下。

实际上，对于大多数色相，实际限制甚至更低。例如，对于此橙色，最大值为 `0.187`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77ff53290a1b4c719d8baa44774f654f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOBZWgy>

如果要增加亮度，可以稍微再提高一点色度。但问题在于，这些值都是相互关联的。如果你有一种非常暗淡的颜色，监视器只能显示其相应的低色度；因为发射的光量不足以使其变得更为生动。而且每种色相的具体工作方式有所不同，因为我们的眼睛不能完全相等地感知各种波长。

### 色相（色调）：H

还要记住的是，色相值与 HSL 不完全相同。所有的色相值都上移了大约 `30deg`，尽管这个量在颜色方面有所不同。下面是跨越所有色相（`0 ~ 360`）的 HSL 和 OKLCH 的渐变，以进行比较：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82f7f66aa2ed4ca2885386d8c0a16843~tplv-k3u1fbpfcp-zoom-1.image)

同样，这些差异归结于人的感知，因此某些色相在光谱上获得了更多的空间。此外，当在不同的亮度和饱和度级别之间进行比较时，这些变化略有不同。例如，红（`30deg`）、黄色（`90deg`）、绿色（`140deg`）、青色或蓝绿色（`195deg`）、蓝色（`260deg`）、洋红色（`330deg`）等。你可以使用 [Roy G. Biv 助记符](https://en.wikipedia.org/wiki/ROYGBIV)，为每个字母分配约 `50°`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf88684e26ae4448aef960e92c50b01b~tplv-k3u1fbpfcp-zoom-1.image)

### 亮度：L

与 HSL 的另一个差异在于，`0％` 或 `100％` 的亮度并不自动表示完全的黑色或完全发白。如果有足够的色度，你仍然可以在这些极端情况下获得一些颜色。

```CSS
:root {
    --color-1: oklch(100% 0.37 330);
    --color-2: oklch(0% 0.37 140);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1926930755464b4a95b9598145285ca4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBJLmpy>

如果你想要真正的黑色、白色或灰色，请确保色度值为 `0`。

> 一般来说，只要将色度保持在 `0.37` 以下，通常就相当稳妥。

## OKLCH Polyfill

OKLCH 和 OKLAB 是比较新的 CSS 颜色格式，虽然它得到主流浏览器的支持，但是对于老版本浏览器，还是需要做额外的处理。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1854fe333df944ada3364b468d5ba058~tplv-k3u1fbpfcp-zoom-1.image)

目前有两个支持 `oklch()` 的 Polyfill：

*   非常流行的 `postcss-preset-env`
*   用 Rust 编写的非常快速的 [Lightning CSS](https://lightningcss.dev/)

如果你没有构建工具，我建议使用 [Vite](https://vitejs.dev/) 或使用[ Lightningcss CLI ](https://github.com/parcel-bundler/lightningcss#from-the-cli)编译你的 CSS。拿 [Lightningcss CLI ](https://github.com/parcel-bundler/lightningcss#from-the-cli) 为例，你只需要在你的项目中安装 [Lightningcss CLI ](https://github.com/parcel-bundler/lightningcss#from-the-cli)：

```SQL
npm install --save-dev lightningcss-cli
```

在相应的 `package.json` 中添加下面代码：

```JSON
{
    "scripts": {
        "build": "lightningcss --minify --bundle --targets '>= 0.25%' input.css -o output.css"
     }
}
```

注意，代码中的 `input.css` 中编译前的 CSS 文件，`output.css` 是编辑后的 CSS 文件，这两个文件名你可以署名成任意你喜欢的名称。

有了这个基础之后，你就可以在 `input.css` 文件中使用 `oklch()` 定义颜色，例如：

```CSS
/* input.css */
.element {
    color: oklch(97.4% 0.006 240);
}
```

编写完之后，在你的命令终端执行下面一行命令：

```CSS
yarn build
```

你的项目就会编译出一个名为 `output.css` 的文件，里面对应的 CSS 代码就是 `oklch()` 降级处理的相关代码：

```CSS
.element{
    color:#f3f7fa;
    color:color(display-p3 .955581 .968199 .979471);
    color:lab(96.9937% -.986129 -1.98181);
}
```

一旦你拥有 `oklch()` 的 Polyfill，你可以将所有使用十六进制、`rgb()` 或 `hsl()` 格式的颜色替换为 OKLCH；它们会在所有浏览器中工作。

在 CSS 源代码中搜索任何颜色，并使用 [OKLCH 转换器](https://oklch.com/#97.4,0.006,239.82,100)将它们转换为 `oklch()`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b25c97f9cd042ec9599060eb0145db3~tplv-k3u1fbpfcp-zoom-1.image)

> OKLCH 颜色转换器：<https://oklch.com/#97.4,0.006,239.82,100>

```CSS
/* input.css */
.element {
    background-color: oklch(97.4% 0.006 240); /* 对应的 #f3f7fa*/
}
```

编译之后的 CSS ：

```CSS
/* output.css */
.element{
    background-color:#f3f7fa;
    background-color:color(display-p3 .955581 .968199 .979471);
    background-color:lab(96.9937% -.986129 -1.98181)
}
```

如果你想使用 OKLCH 颜色转换器的话，你也可以使用 `convert-to-oklch` ，通过下面这行命令，可以将你的 CSS 文件中的颜色自动换为 `oklch()` 格式：

```SQL
npx convert-to-oklch ./src/**/*.css
```

> 注意，这些 Polyfill 仅适用于 CSS，不适用于 HTML 或 JavaScript 源。

## OKLCH 案例

@Adam Argyle 为他的 [Open Props ](https://open-props.style/)提供了一个关于 OKLCH 制作的颜色调色板。并且使用这个[调色板制作了一个安卓主屏幕相关的 UI](https://nerdy.dev/open-props-oklch-palettes-beta):

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1888129528234fc28ed4f33700624665~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/argyleink/full/OJoYwgx>

该 Demo 的关键 CSS 代码如下：

```CSS
/* https://unpkg.com/open-props@1.5.8/oklch-hues.min.css */
:where(html) {
    --hue-red: 25;
    --hue-pink: 350;
    --hue-purple: 310;
    --hue-violet: 290;
    --hue-indigo: 270;
    --hue-blue: 240;
    --hue-cyan: 210;
    --hue-teal: 185;
    --hue-green: 145;
    --hue-lime: 125;
    --hue-yellow: 100;
    --hue-orange: 75
}

/* https://unpkg.com/open-props/gray-oklch.min.css */
:where(*) {
    --gray-0: oklch(99% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-1: oklch(95% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-2: oklch(88% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-3: oklch(80% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-4: oklch(74% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-5: oklch(68% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-6: oklch(63% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-7: oklch(58% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-8: oklch(53% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-9: oklch(49% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-10: oklch(43% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-11: oklch(37% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-12: oklch(31% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-13: oklch(25% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-14: oklch(18% var(--gray-chroma, none) var(--gray-hue, none));
    --gray-15: oklch(10% var(--gray-chroma, none) var(--gray-hue, none))
}

* {
    --gray-hue: var(--hue-green);
    --gray-chroma: .05;
  
    /* bring the color to focus and stuff */
    accent-color: var(--surface-4);
    outline-color: var(--surface-4);
}

/* this maps the 12 stable Open Props normalize adaptive vars to use the extended 15 vars from this okLCH beta pack */
html {
    --surface-1: var(--gray-14);
    --surface-2: var(--gray-12);
    --surface-3: var(--gray-10);
    --surface-4: var(--gray-9);
  
    --text-1: var(--gray-1);
    --text-2: var(--gray-3);
}

@media (prefers-color-scheme: light) {
    html {
        --surface-1: var(--gray-0);
        --surface-2: var(--gray-1);
        --surface-3: var(--gray-2);
        --surface-4: var(--gray-3);

        --text-1: var(--gray-14);
        --text-2: var(--gray-11);
    }
}
```

更详细的代码[请查看 Demo 源代码](https://codepen.io/argyleink/full/OJoYwgx)！

## 小结

在这节课中，我们一起探讨了 OKLAB 和 OKLCH 两种颜色类型以及在 CSS 中如何运用它们来定义颜色。更多的篇幅是介绍了我们为什么需要 OKLCH，使用 OKLCH 要注意的事项，以及使用它能获得的好处。简单地说：

*   OKLCH 可以做任何旧颜色格式可以做的事情；
*   OKLCH 与 HSL 具有相同的人类可读性；
*   OKLCH 具有“均匀感知亮度”，因此第一个数字的行为比在 HSL 中更可预测；
*   OKLCH 使渐变插值中出现的颜色更好；
*   OKLCH 允许我们使用现代显示器支持的“新”一组颜色（P3），其中许多色彩非常丰富且“超越”。

这些都是非常重要的。我认为其他新颜色选择中没有一个符合所有这些条件，也没有添加任何不在此列表中的条款。虽然 OKLCH 还比较新，但这些优势已经完全值得我们现在开始学习和使用了。
