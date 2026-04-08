在 W3C 规范的 [CSS 值和单位模块 Level 4](https://www.w3.org/TR/css-values-4/) （CSS Values and Units Module Level 4）为 Web 开发者提供了[数学表达式](https://www.w3.org/TR/css-values-4/#math)相关的能力。除了我们所熟悉的 `calc()` 函数和 [CSS 比较函数](https://juejin.cn/book/7223230325122400288/section/7241401565653762108)（比如 `min()` 、`max()` 和 `clamp()`）之外，还有 [CSS 的三角函数](https://www.w3.org/TR/css-values-4/#trig-funcs)，比如 `sin()` 、`cos()` 、`tan()` 、 `asin()` 、 `acos()` 、 `atan()` 和 `atan2()` 等。以往这些能力只能在 Sass 这样的 CSS 处理器或 JavaScript 脚本中使用，但在今天，CSS 三角函数终于来了，这使得 CSS 拥有了数学能力。

三角函数可能赋予 Web 开发者超能力，因为 CSS 三角函数拥有的数学能力并且能帮助我们开启大量的可能性。但对于未曾接触的人来说，它会有些令人生畏。因此在这节课中，我们一起聊聊三角函数，了解它如何有用，并深入探讨它在 CSS 中的创意应用。

## 三角函数简介

要聊三角函数，我们就得先从[三角学](https://en.wikipedia.org/wiki/Trigonometry)说起。三角学是研究三角形和它们的角度、边长、面积、正弦、余弦和正切等性质的数学分支。三角学的发展历史可以追溯到古希腊时期，早在公元前2世纪，希腊数学家提出三角函数的概念和使用。

三角学的核心概念是 **[三角函数](https://en.wikipedia.org/wiki/Trigonometric_functions)**，包括正弦（`sin()`）、余弦（`cos()`）和正切（`tan()`）等函数，它们分别表示一个角的对边、邻边和斜边之间的比值。除此之外，也包括[反三角函数](https://en.wikipedia.org/wiki/Inverse_trigonometric_functions)，它是三角函数的反函数，比如反正弦（`asin()`）、反余弦（`acos()`）、反正切（`atan()` 和 `atan2()`）等。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab790b16c9e242bf8ae6df03ef207ea4~tplv-k3u1fbpfcp-zoom-1.image)

三角函数在数学和科学中应用广泛，例如在物理学、工程学和天文学等领域中用于描述和解决各种问题。同时，三角函数也是计算机图形学、游戏开发和计算机辅助设计等数字产业中不可或缺的一部分，因为它们可以用于构建各种形状和动画效果。

简单地说，在 CSS 中也可以使用三角函数来帮助我们绘制各种图形和制作 Web 动效，甚至是一些有创意的效果。如此一来，我们就有必要掌握三角函数的一些基础知识。

## 三角函数基础

如果你和我一样，在课堂外很少使用三角函数，那有必要重温一下三角函数相关的知识。

三角函数允许我们从已知参数计算出直角三角形的未知值。想象一下，你站在地面上仰望一棵高树，那从地面上测量树的高度将非常困难。但是，如果我们知道自己向上看树顶的角度，并且知道自己到树的距离，就可以推断出树的高度。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/978fcac791c4404fb5ffcf45c14b6696~tplv-k3u1fbpfcp-zoom-1.image)

如果我们将这个场景想象成一个三角形，已知的长度（从我们到树）被称为相邻边，树是对边（与角度相对），而从我们到树顶的最长边称为斜边。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dba109149d94b799423aad7473d5817~tplv-k3u1fbpfcp-zoom-1.image)

### 正弦、余弦和正切

三角函数中需要记住的有三个主要函数：正弦函数（`sin()`）、余弦函数（`cos()`）和正切函数（`tan()`）。

*   **[正弦函数（sin(θ)）](https://en.wikipedia.org/wiki/Sine_and_cosine)**：定义为该角（`θ`）的对边（Opposite）与斜边（Hypotenuse）的比例，即 `sin(θ) = Opposite / Hypotenuse = 对边 / 斜边 = a / c` ，会返回一个角（`θ`）的正弦，它是一个介于 `-1` 和 `1` 之间的值。
*   **[余弦函数（cos(θ)）](https://en.wikipedia.org/wiki/Sine_and_cosine)**：定义为该角（`θ`）的邻边（Adjacent）与斜边（Hypotenuse）的比例，即 `cos(θ) = Adjacent / Hypotenuse = 邻边 / 斜边 = b ``/ c` ，会返回一个角（`θ`）的余弦，它是一个介于 `-1` 和 `1` 之间的值。
*   **[正切函数（tan(θ)）](https://en.wikipedia.org/wiki/Trigonometric_functions)**：定义为该角（`θ`）的对边（Opposite）与邻边（Adjacent）的比例，即 `tan(θ) = Opposite / Adjacent = 对边 / 邻边 = a / b`  ，会返回一个角（`θ`）的正切，它是一个介于 `-∞` 和 `+∞` 之间的值。

正弦、余弦和正切等函数可以使用以下公式来描述：

```CSS
sin(θ) = Opposite ÷ Hypotenuse = 对边 ÷ 斜边 = BC ÷ AB = a ÷ c
cos(θ) = Adjacent ÷ Hypotenuse = 邻边 ÷ 斜边 = AC ÷ AB = b ÷ c
tan(θ) = Opposite ÷ Adjacent = 对边 ÷ 邻边 = BC ÷ AC = a ÷ b = sin(θ) ÷ cos(θ)
```

> 通常会用希腊字母 `θ` 表示角度。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e92c044f57f04b248c377b1e3356ee18~tplv-k3u1fbpfcp-zoom-1.image)

我们可以使用这些方程式从已知值计算三角形的未知值。例如，在这个例子中，我们知道角度（`θ`）和相邻边（Adjacent）就可以计算出树（Opposite）的高度。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f19fb099419b478fb7e377f9921c3662~tplv-k3u1fbpfcp-zoom-1.image)

为了计算对边（Opposite），我们会用到正切函数（`tan(θ)`），需要重新排列这个公式：

```CSS
对边 = tan(θ) × 邻边 
Opposite = tan(θ) × Adjacent
BC = tan(θ) × AC
a = tan(θ) × b
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87c1cbf56c634fe6b0123d51cd2eea1c~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，只需要知道三角形中两个参数，就可以按照类似的方式计算出三角形中第三个未知的值。例如，你已经知道三角形斜边的长度 `--radius` 和角度 `--angle` ，那么就可以得到：

*   三角形斜边（Hypotenuse）的长度等于 `--radius` ；
*   三角形角度（`--angle`）的对边（Opposite）的长度等于斜边长度（`--radius`）乘以 `sin(var(--ange))`；
*   三角形角度（`--angle`）的邻边（Adjacent）的长度等于斜边长度（`--radius`）乘以 `cos(var(--angle))`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1b0e98f2ce34224979b42dfda9d5d31~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQOGPN>

### 反正弦、反余弦和反正切

与 `sin()`，`cos()` 和 `tan()` 相对应的“弧”或“反”函数，表示其相应“正常”三角函数的反函数，分别是 `asin()`，`acos()` 和 `atan()` 。这些函数在相反的方向进行计算：以一个数值作为参数，并返回其对应的角度。

*   反正弦（`asin()`）返回的角度为 `-90deg` 至 `90deg` 。
*   反余弦（`acos()`）返回的角度为 `0deg` 至 `180deg` 。
*   反正切（`atan()`）返回的角度为 `-90deg` 至 `90deg` 。

注意，除此之外还有一个[ atan2() 函数](https://zh.wikipedia.org/wiki/Atan2)，它是正切函数 `tan()` 的一个变种。它会接收两个参数 `A` 和 `B` ，返回的角度为 `-180deg` 至 `180deg` 。

反三角函数（ `asin()` 、`acos()` 和 `atan()`）是和三角函数（`sin()`、`cos()` 和 `tan()`）有相对应关系的函数。

三角函数（`sin()`、`cos()` 和 `tan()`）是用来计算一个给定角度的正弦、余弦和正切值的函数。例如，`sin(θ)` 表示角度 `θ` 的正弦值，`cos(θ)` 表示角度 `θ` 的余弦值，`tan(θ)` 表示角度 `θ` 的正切值。

而反三角函数（`asin()`、`acos()` 和 `atan()`）则是用来计算给定正弦、余弦和正切值的角度的函数。例如，`asin(x)` 表示正弦值为 `x` 的角度，`acos(x)` 表示余弦值为 `x` 的角度，`atan(x)` 表示正切值为`x` 的角度。

这些反三角函数可以帮助我们在已知三角函数值时求出对应的角度，或者在已知角度时求出对应的三角函数值。它们成为三角函数与角度之间的桥梁，让我们可以在不同形式的表达之间转换。

所以，我们可以说反三角函数和三角函数是彼此相互对应的，它们帮助我们在三角函数和角度之间建立了联系。

这方面更深入的知识就不阐述了，感兴趣的同学可以拿起数学书，重温这方面的知识。

## Sass 中的三角函数

前面我们一起重温了三角函数的基础知识，接下来，我们再来看看 CSS 处理器 Sass 中如何运用三角函数。毕竟原生 CSS 的三角函数刚刚得到主流浏览器的支持，在此之前，一般都是在 CSS 处理器语言（比如 Sass）和 JavaScript 脚本语言中使用三角函数。因此，在正式阐述原生 CSS 三角函数之前，还是和大家一起回顾一下 Sass 中的三角函数的应用。

稍微熟悉 Sass 预定处理器的同学都知道，[Sass 中集成了 Math 功能](https://sass-lang.com/documentation/modules/math)，就涵盖了三角函数相关的能力。我们在使用 Sass 的时候，只需要像下面这样引入 Math 模块，就可以在 Sass 中使用三角函数。

```CSS
@use "sass:math";
```

例如，我们可以像下面这样，从已定义好的角度 `$angle` 和邻边 `$adjacent` 已知值，使用正切函数 `math.tan()` 计算出三角形对边 `$opposite` 的值，即 `math.tan($angle) * $adjacent` ：

```SCSS
$angle: 45deg;
$adjacent: 100%;
$opposite: math.tan($angle) * $adjacent;
```

上面的代码中，正切函数 `tan()` 可以使用弧度或角度，如果使用角度则必须指定单位；如果没有单位，则默认使用弧度。

来看一个具体的示例，在 `clip-path` 属性上使用上述所列的变量，来确定多边形点的坐标，相当于计算对边（Opposite），类似于树的高度。具体代码如下：

```SCSS
@use "sass:math";

$angle1: 45deg;
$adjacent1: 100%;
$opposite1: math.tan($angle1) * $adjacent1;

$angle2: 30deg;
$adjacent2: 100%;
$opposite2: math.tan($angle2) * $adjacent2;

$angle3: 60deg;
$adjacent3: 50%;
$opposite3: math.tan($angle3) * $adjacent3;

.triangle {
    &::after {
        clip-path: polygon(0 100%, $adjacent1 (100% - $opposite1), $adjacent1 100%);
    }
    
    &:nth-child(2)::after {
        clip-path: polygon(0 100%, $adjacent2 (100% - $opposite2), $adjacent2 100%);
    }
        
    &:nth-child(3)::after {
        clip-path: polygon(0 100%, $adjacent3 (100% - $opposite3), $adjacent3 100%);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c885fb9a02f413aa332723ca726bfcb~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/wvQvpaE>

正如你所看到的，`clip-path` 属性绘制的三角形，每个点坐标都由 `(x, y)` 组成，其中对边与斜边交点的 `y` 坐标需要通过计算才能获得，即需要将 `$opposite` 变量从元素的高度中减去，即 `100% - $opposite` ：

```CSS
.element {
    clip-path: polygon(0 100%, $adjacent (100% - $opposite), $adjacent 100%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2566cfac8c84899b9e6d2d48d0b3467~tplv-k3u1fbpfcp-zoom-1.image)

上面这个示例，使用 `clip-path` 剪切出来的都是直角三角形，可以说直角三角形是三角函数最简单的用法，但我们可以通过将更复杂的形状分解成直角三角形，然后计算出它们的坐标。比如，使用 `clip-path` 和三角函数剪切出一个等边三角形。

从以往的几何知识中我们可以知道，等边三角形的三条边都相等，而且每个角都是 `60º`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8bef3e50a4449c29e235c1a929c583a~tplv-k3u1fbpfcp-zoom-1.image)

我们在等边三角形中间画一条直线，将其分割成两个直角三角形。因此，我们从给定长度的等边三形中可以获得分割后的直角三角形的相关值：

*   斜边（Hypotenuse）长度，等于等边三角形的边长；
*   邻边（Adjacent）长度，等于斜边（也是等边三角形边长）的一半；
*   斜边与邻边夹角为 `60º` 。

有了这些参数，我们就可以使用三角函数计算出对边（Opposite）的长度，从而可以计算出等边三角形顶点的坐标：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/795c41889a744be387c3d3f52b25e655~tplv-k3u1fbpfcp-zoom-1.image)

```SCSS
@use "sass:math";

$angle: 60deg;
$hypotenuse: 100%;
$opposite: math.sin($angle) * $hypotenuse;

.triangle {
    aspect-ratio: 1;
    width: 80vh;
        
    &::after {
        clip-path: polygon(
            0 100%,
            ($hypotenuse / 2) 0,
            $hypotenuse 100%
        );
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27dbacdb5c154173981fbe1104c71709~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYberv>

注意，就上面这个示例而言，你也可以使用正切函数计算等边三角形顶点坐标。因为你也知道邻边的长度，只不过它是斜边长度的一半。这里就不展示了，感兴趣的同学可以自己尝试一下。

当然，使用同样的原理，你可以绘制出复杂的图形，稍后我们在介绍 CSS 三角函数时会向大家展示。

虽然 Sass 处理器可以使用三角函数，但它也有一定的局限性，

*   变量需要在编译前已知，不能使用动态值；
*   对于单位混合，Sass 不能很好处理，在某些情况下可能会出错；
*   Sass 不支持类似于 `calc()` 的直接在计算中混合不同类型的单位，例如从百分比中减去像素单位的长度。

要解决这些问题，需要使用 CSS 和 Sass 提供的其他功能和技巧来编写代码，并确保代码在不同情况下都能正常工作。

## CSS 三角函数

CSS 的三角函数主要包括 `sin()` 、`cos()` 、`tan()` 、`asin()` 、`acos()` 、`atan()` 和 `atan2()` 。

`sin()` 、`cos()` 和 `tan()` 三个函数的参数值为 `<number>` 或 `<angle>` ，通过将其参数的结果解释为弧度来计算。也就是说，`sin(45deg)` 、`sin(.125turn)` 和 `sin(3.14159 ``/ 4``)` 都表示相同的值，大约为 `0.707` 。其中 `sin()` 和 `cos()` 函数始终会返回 `-1 ~ 1` 之间的数字，而 `tan()` 函数可以返回在 `-∞` 和`+∞` 之间的任何数字。

`asin()` 、`acos()` 和 `atan()` 函数仅接受 `<number>` 类型值，其返回值最终会是 `<angle>` 的弧度数。

*   `asin()` 函数会返回介于 `-1` 和 `1` 之间的数的反正弦值，即返回表示介于 `-90deg` 和 `90deg` 之间的 `<angle>` 的弧度数。
*   `acos()` 函数会返回介于 `-1` 和 `1` 之间的数的反余弦值，即返回表示介于 `0deg` 和 `180deg` 之间的 `<angle>` 的弧度数。
*   `atan()` 函数会返回介于 `-∞` 和 `+∞` 之间的数的反正切值，即返回表示介于 `-90deg` 和 `90deg` 之间的`<angle>` 的弧度数。
*   `atan2()` 函数会返回介于 `-infinity` 和 `infinity` 之间的两值的反正切值，即返回表示介于 `-180deg` 和 `180deg` 之间的 `<angle>` 的弧度数。

`atan2()` 函数和其他函数有点不相同，它可以接受以逗号分隔的两个值作为其参数，即 `atan(Y, X)`。其中：

*   `Y` 点表示的是纵坐标
*   `X` 点表示的是横坐标

`Y` 和 `X` 的值可以是 `<number>` 、`<dimension>` 或 `<percentage>` 。只不过，两个值必须为同一类型，但若为 `<dimension>` 类型值，其单位可以不同，例如 `atan2(100px, 5vw)` 。

需要注意的是，`atan2(Y, X)` 通常相当于 `atan(Y ``/ X``)` ，但当所涉及的点可能包含负分量时，它可以给出更好的答案。例如，`atan2(1, -1)` 对应于点 `(-1, 1)`，返回 `135deg` ，与 `atan2(-1, 1)` 相对应，它返回 `-45deg` 。相比之下，`atan(1 ``/ -1``)` 和 `atan(-1 ``/ 1``)` 都返回 `-45deg` ，因为内部计算对于两者都解析为 `-1` 。

### 三角函数的参数范围

三角函数的返回值也会因传入的值有所不同。

*   在 `sin(θ)` 、`cos(θ)` 或 `tan(θ)` 函数中，如果 `θ` 是 `infinity`、`-infinity` 或 `NaN` ，则返回的结果为 `NaN` 。
*   在 `sin(θ)` 或 `tan(θ)` 函数中，如果 `θ` 是 `0⁻` ，则返回的结果为 `0⁻` 。
*   在 `tan(θ)` 函数中，如果 `θ` 是渐进值之一（例如 `90deg` 、`270deg`），则结果明确未定义。如果实现能够精确表示这些输入的值，则渐近线上的值应为 `90deg + N * 360deg` 的正穷大值，并且在 `-90deg + N * 360deg` 的渐近线上的值线应为负无穷大值，但实现并不要求能够精确表示这些输入（如果不能，则返回最接近输入的正数值的逼近值）。作者不能依赖 `tan()` 返回这些输入的任何特定值。
*   在 `asin(θ)` 或 `acos(θ)` 函数中，如果 `θ` 小于 `-1` 或大于 `1` ，则返回的结果为 `NaN` 。
*   在 `acos(θ)` 函数中，如果 `θ` 等于 `1` ，则返回的结果为 `0` 。
*   在 `asin(θ)` 或 `atan(θ)` 函数中，如果 `θ` 是 `0⁻`，则返回的结果为 `0⁻` 。
*   在 `atan(θ)` 函数中，如果 `θ` 是正无穷大，则返回的结果为 `90deg` ；如果 `θ` 是负无穷大，则返回的结果为 `-90deg` 。
*   在 `atan2(Y, X)` 函数中，以下表格给出了所有异常参数组合的结果。

|             | **X**       |          |         |             |          |        |        |
| ----------- | ----------- | -------- | ------- | ----------- | -------- | ------ | ------ |
| **−∞**      | **-finite** | **0⁻**   | **0⁺**  | **+finite** | **+∞**   |        |        |
| **Y**       | **−∞**      | -135deg  | -90deg  | -90deg      | -90deg   | -90deg | -45deg |
| **-finite** | -180deg     | (normal) | -90deg  | -90deg      | (normal) | 0⁻deg  |        |
| **0⁻**      | -180deg     | -180deg  | -180deg | 0⁻deg       | 0⁻deg    | 0⁻deg  |        |
| **0⁺**      | 180deg      | 180deg   | 180deg  | 0⁺deg       | 0⁺deg    | 0⁺deg  |        |
| **+finite** | 180deg      | (normal) | 90deg   | 90deg       | (normal) | 0⁺deg  |        |
| **+∞**      | 135deg      | 90deg    | 90deg   | 90deg       | 90deg    | 45deg  |        |

## CSS 三角函数的基本应用

我们在 CSS 中可以这样来使用 CSS 的三角函数，例如：

*   `sin()` 函数可用于改变元素尺寸或控制动画时长；
*   `cos()` 函数可用于保持旋转元素的尺寸不变；
*   `tan()` 函数可用于绘制平行四边形；
*   `asin()` 、`acos()` 、`atan()` 和 `atan2()` 函数可用于旋转元素。

我们来看一个简单的示例，使用余弦函数 `cos()` 保持旋转元素的尺寸不变。稍微熟悉 CSS 的同学都知道，使用 `rotate()` 旋转元素时，元素将超出其初始尺寸：

```CSS
.element {
    rotate: 45deg;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62337cd70aed42aaa7d9ffabdfd0f7c1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQbbMr>

现在，我们可以使用 `cos()` 函数修复这个问题。上面示例中是一个 `60vh x 60vh` 的正方形，并且沿着中心点位置旋转了 `45deg` ，旋转之后的正方形会产生一个菱形，而且宽度和高度都会大于初始的正方形。为了将旋转后的正方形（菱形）缩小至原始正方形分配的盒子中，需要将元素的宽度和高度都设置为 `60vh * cos(45deg)` ，还需要使用 `traslate` 来修正位置：

```CSS
:root {
    --width: 60vh;
}

.container {
   width: calc(var(--width) * cos(45deg));
   aspect-ratio: 1;
   transform-origin: center;
  
   rotate: 45deg;
   translate: 
       calc((var(--width) - var(--width) * cos(45deg)) / 2) 
       calc((var(--width) - var(--width) * cos(45deg)) / 2);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c65e038f9e544836a5197b3b96ec3e18~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwVYYOx>

我们还可以使用三角函数来旋转元素，例如：

```CSS
.element {
    rotate: asin(0.5);
    rotate: acos(0.5);
    rotate: atan(1);
    rotate: atan2(1, 0.5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf26368bdada44eeb8d537f03247fd53~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxwqWM>

同样的，我们可以使用三角函数和 `clip-path` 属性来绘制图形，比如前面所介绍的等边三角形。

```CSS
.triangle {
    --size: 10rem;
    --hypotenuse: 8rem;
    --angle: 60deg;
    --opposite: calc(sin(var(--angle)) * var(--hypotenuse));
    --adjacent: calc(var(--hypotenuse) / 2);
    --startPosX: calc(var(--size) / 2 - var(--adjacent));
    --startPosY: calc(var(--size) / 2 - var(--opposite) / 2);
    --endPosX: calc(var(--size) / 2 + var(--adjacent));
    --endPosY: calc(var(--size) / 2 + var(--opposite) / 2);
        
    --clip: polygon(
        var(--startPosX) var(--endPosY),
        50% var(--startPosY),
        var(--endPosX) var(--endPosY)
    );
    
    clip-path: var(--clip);
    width: var(--size);
    aspect-ratio: 1;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34ae827fd2ba4712aaa8e0553f29ab19~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQbpdb>

除此之外，我们还可以使用相似的方法来绘制更为复杂的形状。比如一个正多边形，它可以是一个正五边形和正六边形等。

要创建一个正多边形，可以在圆周上等间距放置点，并使用直线将它们连接起来。因此，对于一个正六边形，我们可以在一个已知半径的圆周上放置六个点，然后使用直线将这些点连接起来，这样就创建了一个正六边形。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/654eedc7495548ee950d5fe659e8dc04~tplv-k3u1fbpfcp-zoom-1.image)

如何获取每个点的 `x` 和 `y` 坐标是绘制正多边形的关键之处，为了获得多边形每个顶点的 `x` 和 `y` 坐标，我们可以使用三角学和圆的特性。

首先，我们可以将 `360deg` 除以多边形的边数找到相邻顶点之间的夹角，此角度为 `θ` 。然后，我们可以以原点 `(0,0)` 为中心，绘制所需半径的圆。多边形的顶点将位于该圆的周长上。接着，从正 `x` 轴（即圆上的点 `(r,0)`）开始，我们使用三角函数找到每个后续顶点的 `x` 和 `y` 坐标。

但是如何获取每个点的 `x` 和 `y` 坐标呢？这些被称为笛卡尔坐标，而极坐标告诉我们的是特定点的距离和角度。本质上，是圆的半径和线的角度。从中心到边缘绘制一条线给出一个直角三角形，其中斜边等于圆的半径。例如，要找到第二个顶点（即距离第一个项点 `θ` 度的顶点）的 `x` 和 `y` 坐标。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68577fdb61454afcbf9e136aa925ebdd~tplv-k3u1fbpfcp-zoom-1.image)

我们可以使用三角函数来计算 `x` 和 `y` 坐标：

```CSS
x = r * cos(θ)
y = r * sin(θ)
```

然后，我们可以逐个重复此过程，每次增加 `θ` 度的角度。使用这些公式，我们可以绘制任意数量边的顶点坐标。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19e91189d60d441ab1e98e8d1282fc21~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEPGYX>

如此一来就从 **[极坐标系](https://en.wikipedia.org/wiki/Polar_coordinate_system)** 转换到了 **[笛卡尔坐标系](https://en.wikipedia.org/wiki/Cartesian_coordinate_system)**，也就是我们 Web 坐标系中描述点的位置。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0e6140432f6434e90f9d96841c32e03~tplv-k3u1fbpfcp-zoom-1.image)

假设圆半径为 `100px` ，每相邻两顶点夹角相隔 `60deg` ，把六个点坐标集起来，并当作 `clip-path` 属性的 `polygon()` 的值，就可以轻易绘制出一个正六边形：

```CSS
:root {
    --r: 100px;
    --clip: polygon(
        calc(sin(0deg) * var(--r))
        calc(cos(0deg) * var(--r)),
        calc(sin(60deg) * var(--r))
        calc(cos(60deg) * var(--r)),
        calc(sin(120deg) * var(--r))
        calc(cos(120deg) * var(--r)),
        calc(sin(180deg) * var(--r))
        calc(cos(180deg) * var(--r)),
        calc(sin(240deg) * var(--r))
        calc(cos(240deg) * var(--r)),
        calc(sin(300deg) * var(--r))
        calc(cos(300deg) * var(--r)),
        calc(sin(360deg) * var(--r))
        calc(cos(360deg) * var(--r))
    );
}

.hexagon {
    width: 200px;
    aspect-ratio: 1;
    clip-path: var(--clip);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a64682c2ca404608ad757d150d4ba8e5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzYaMx>

你或许会纳闷，最终效果怎么会有缺失，不是完整的正六边形。这是因为，当从传统坐标系统移到设置屏幕上时，我们需要考虑两个主要问题：

*   元素的 `(0,0)` 位置是在左上角；
*   随着你向下移动轴，`Y` 值变为正值。

因此，在处理裁剪路径时，如果我们希望正六边形位于元素的中心位置，需要将中心点偏移 `50%` 。根据我们所需的方向，将某些 `Y` 值乘以 `-1` 可能会很有用。在这种情况下，我们主要想让元素居中，那就可以使用以下方式来修正：

```CSS
:root {
    --r: 100px;
    --center: 50%;
    --clip: polygon(
        calc(var(--center) + sin(0deg) * var(--r))
        calc(var(--center) - cos(0deg) * var(--r)),
        calc(var(--center) + sin(60deg) * var(--r))
        calc(var(--center) - cos(60deg) * var(--r)),
        calc(var(--center) + sin(120deg) * var(--r))
        calc(var(--center) - cos(120deg) * var(--r)),
        calc(var(--center) + sin(180deg) * var(--r))
        calc(var(--center) - cos(180deg) * var(--r)),
        calc(var(--center) + sin(240deg) * var(--r))
        calc(var(--center) - cos(240deg) * var(--r)),
        calc(var(--center) + sin(300deg) * var(--r))
        calc(var(--center) - cos(300deg) * var(--r)),
        calc(var(--center) + sin(360deg) * var(--r))
        calc(var(--center) - cos(360deg) * var(--r))
    )
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/307e6c9b384247a4880cad1e4af3fa43~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKrwQdd>

我们要裁剪的元素是一个正方形。到目前为止，我们仍然使用 `100px` （即圆的半径 `--r = 100px`），但是为了让我们的正六边形最大化，且位于正方形元素内部，应该将圆的半径 `--r` 设置为 `50%` ，这能够尽可能地利用元素内部的空间。为了使其具有灵活性，我们可以使用 CSS 自定义属性来更改中心点和半径：

```CSS
:root {
    --r: 50%;
    --size: 200px;
    --center-x: 50%;
    --center-y: 50%;
  
    --clip: polygon(
        calc(var(--center-x) - cos(0deg) * var(--r))
        calc(var(--center-y) + sin(0deg) * var(--r)),
        calc(var(--center-x) - cos(60deg) * var(--r))
        calc(var(--center-y) + sin(60deg) * var(--r)),
        calc(var(--center-x) - cos(120deg) * var(--r))
        calc(var(--center-y) + sin(120deg) * var(--r)),
        calc(var(--center-x) - cos(180deg) * var(--r))
        calc(var(--center-y) + sin(180deg) * var(--r)),
        calc(var(--center-x) - cos(240deg) * var(--r))
        calc(var(--center-y) + sin(240deg) * var(--r)),
        calc(var(--center-x) - cos(300deg) * var(--r))
        calc(var(--center-y) + sin(300deg) * var(--r)),
        calc(var(--center-x) - cos(360deg) * var(--r))
        calc(var(--center-y) + sin(360deg) * var(--r))
    )
}

.hexagon {
    width: var(--size);
    aspect-ratio: 1;
    clip-path: var(--clip);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8281651149164df1b68474a4ccefe235~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXEQNd>

使用 CSS 三角函数的另一个关键优势是它们可以用于任何有效的 CSS 度数单位，无论是在度（`deg`）、弧度（`rad`）、转角（`turn`）或百分度（`grad`）。因此，我们可以使用 `turn` 单位来定义正六边形。

```CSS
:root {
    --r: 50%;
    --size: 200px;
    --center-x: 50%;
    --center-y: 50%;
  
    --clip: polygon(
        calc(var(--center-x) - cos(0turn) * var(--r))
        calc(var(--center-y) + sin(0turn) * var(--r)),
        calc(var(--center-x) - cos(0.1666667turn) * var(--r))
        calc(var(--center-y) + sin(0.1666667turn) * var(--r)),
        calc(var(--center-x) - cos(0.3333333turn) * var(--r))
        calc(var(--center-y) + sin(0.3333333turn) * var(--r)),
        calc(var(--center-x) - cos(.5turn) * var(--r))
        calc(var(--center-y) + sin(.5turn) * var(--r)),
        calc(var(--center-x) - cos(0.66666667turn) * var(--r))
        calc(var(--center-y) + sin(0.66666667turn) * var(--r)),
        calc(var(--center-x) - cos(0.8333333turn) * var(--r))
        calc(var(--center-y) + sin(0.8333333turn) * var(--r)),
        calc(var(--center-x) - cos(1turn) * var(--r))
        calc(var(--center-y) + sin(1turn) * var(--r))
    )
}
```

可以和 `deg` 单位得到同样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9140f9e63f7b4678bc41f274526ee1b0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/LYXEQyr>

你甚至还可以调整正多边形的边数，来实现正五边形、正八边形之类。

```CSS
:root {
    --r: 50%;
    --size: 200px;
    --center-x: 50%;
    --center-y: 50%;
}

.hexagon {
    width: var(--size);
    aspect-ratio: 1;
    clip-path: var(--clip);
}
const root = document.documentElement;
const slidesInput = document.querySelector("#slides");
const slidesOutput = document.querySelector("#slides-output");
const minSides = 3;

function generateViaCss() {
    let points = [];

    for (let i = minSides; i <= 60; i++) {
        points.push(generateNSides(i));
    }

    return points;
}

function generateNSides(n) {
    let points = [];

    for (let i = 0; i < n; i++) {
        points.push(
            `calc(var(--center-x) + (cos(${
            (i / n) * 360
            }deg) * var(--r))) calc(var(--center-y) + (sin(${
            (i / n) * 360
            }deg) * var(--r)))`
        );
    }

    return `polygon(evenodd, ${points.join(",")})`;
}

function setupInteraction() {
    slidesInput.setAttribute("max", finalPoints.length + minSides - 1);
    const pathLength = finalPoints.length;
    
    slidesInput.addEventListener("input", updateOutput);

    function updateOutput() {
        const step = slidesInput.value;
        root.style.setProperty(
            "--clip",
            finalPoints[parseInt(step, 10) - minSides]
        );

        slidesOutput.textContent = step;
    }

    updateOutput();
}

finalPoints = generateViaCss();
setupInteraction();
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57cb71b4c5574a9f9dc9bcbac87df7ed~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqNQxd>

## CSS 三角函数的高级应用

CSS 三角函数除了与 `clip-path` 属性绘制不同的多边形之外，还可以用来给元素定位、制作动效等。比如 [@Mads Stoumann 提供的时钟示例](https://codepen.io/stoumann/full/wvxOQKo)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1ef9591ffc14ae1baf56020ba1e7911~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/stoumann/full/wvxOQKo>

时钟面板上的数字定位就用到了 CSS 的三角函数。每个小时数的 `X` 轴和 `Y` 的坐标的公式为：

```CSS
--_x: calc(var(--_r) + (var(--_r) * cos(var(--_d))));
--_y: calc(var(--_r) + (var(--_r) * sin(var(--_d))));
```

其中 `--_r` 为圆的半径，`--_d` 为三角形夹角对应的度数：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee59463c37ea49b980f6585813b51fd8~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
.clock-face time {
    --_x: calc(var(--_r) + (var(--_r) * cos(var(--_d))));
    --_y: calc(var(--_r) + (var(--_r) * sin(var(--_d))));
    --_sz: 12cqi;
  
    width: var(--_sz);
    height: var(--_sz);
    position: absolute;
    left: var(--_x);
    top: var(--_y);
    
    display: grid;
    place-content: center;
}
```

仅这样还是不够的，要使每个数字左上角位于正确的位置，我们还需要在计算每个数字的位置时缩小半径（`--_r`），即从圆的尺寸 `--_w` 中减去数字的尺寸 `--_sz` ：

```CSS
--_r: calc((var(--_w) - var(--_sz)) / 2);
```

关键的 CSS 代码如下：

```CSS
.clock {
    --_ow: clamp(5rem, 60vw, 40rem);
    --_w: 88cqi;
    --_r: calc((var(--_w) - var(--_sz)) / 2);
    --_sz: 12cqi;

    block-size: var(--_ow);
    inline-size: var(--_ow);
    
    border-radius: 24%;
    container-type: inline-size;
    display: grid;
    margin-inline: auto;
    place-content: center;
}

.clock-face time {
    --_x: calc(var(--_r) + (var(--_r) * cos(var(--_d))));
    --_y: calc(var(--_r) + (var(--_r) * sin(var(--_d))));
  
    position: absolute;
    top: var(--_y);
    width: var(--_sz);
    height: var(--_sz);
    left: var(--_x);
    
    display: grid;
    place-content: center;
}
```

更详细的介绍，可以阅读 @Mads Stoumann 写的教程《[Creating a Clock with the New CSS sin() and cos() Trigonometry Functions](https://css-tricks.com/creating-a-clock-with-the-new-css-sin-and-cos-trigonometry-functions/)》。

使用同样的原理，我们还可以使用三角函数来制作圆形菜单，例如 [@Una Kravets 提供的示例](https://codepen.io/una/full/VwGRpXN)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57731c6a05ad4618991ba5e1cd3b1d80~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKrpBrQ>

关键代码如下：

```CSS
:root {
    --btn-size: 2.5rem;
    --extra-space: 1.2rem;
}

.item {
    --radius: calc(var(--btn-size) + var(--extra-space));
    --x: calc(cos(var(--angle)) * var(--radius));
    --y: calc(sin(var(--angle) * -1) * var(--radius));
    transform: translate(var(--x), var(--y)) rotate(0deg);
    transition: all 0.3s var(--delay) ease;
}

.menu:not(:focus-within) .item {
    --radius: 0;
    --angle: 0;
    rotate: 45deg;
}
```

你也可以使用它来制作一个圆形文本围绕的效果。比如 [@Jhey 提供的这个示例](https://codepen.io/jh3y/pen/LYBdKXE)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/160522aa1bc24037bdf27c4e1dca800d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOjpzJ>

```CSS
.ring {
    --char-count: 27; 
    --inner-angle: calc((360 / var(--char-count, 27)) * 1deg);
    --character-width: 2.0;
    --radius: calc((var(--character-width, 2.0) / sin(var(--inner-angle))) * -1ch;
    --font-size: 2.0rem;
    
    font-size: calc(var(--font-size, 1) * 1rem);
    animation: rotation 6s infinite linear;
    position: relative;
}
.char {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform:
        translate(-50%, -50%)
        rotate(calc(var(--inner-angle) * var(--char-index)))
        translateY(var(--radius));
}

@keyframes rotation {
    to {
        rotate: -360deg;
    }
}
```

注意，该示例使用了一点 JavaScript 脚本，它会将输入的文本分割出来，每个文字会用一个独立的标签元素来包裹：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9991f541da7f4286a55c0b2036124309~tplv-k3u1fbpfcp-zoom-1.image)

我们还可以使用 CSS 三角函数来制作动效，比如 [@Jhey 写的另一个示例](https://codepen.io/jh3y/full/GRBVNJE)，使用三角函数，可以实现点在旋转时完全对齐：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e6dc8c3cb764b18b2e55df98759c05b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXVJEE>

除此之外，还可以用来构建复杂的布局，例如，使用 `sin()` 函数将图片放置在一条曲线上。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/376d7b6411994f11b7564118014ad3a9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwJXpW>

```HTML
<ul>
    <li style="--index: 1;"><img src="https://picsum.photos/400/400?random=1" alt=""></li>
    <li style="--index: 2;"><img src="https://picsum.photos/400/400?random=2" alt=""></li>
    <!-- 省略其他 li -->
</ul>
```

关键 CSS 代码：

```CSS
img {
    display: block;
    border-radius: var(--size-2);
    translate: 0 var(--y, 0);
    box-shadow: var(--shadow-5);
    transition: translate 0.2s;
    block-size: auto;
    max-inline-size: 100%;
}

ul img {
    --y: calc(sin(var(--index)) * 50%);
}
```

## 小结

在这节课中，我们主要学习了 CSS 三角函数 `sin()` 、`cos()` 、`tan()` 和反三角函数 `asin()` 、`acos()` 、`atan()` 和 `atan2()` 等基础知识，以及如何在 CSS 中运用这些三角函数。

简单地说，CSS 三角函数是利用三角学函数 `sin()` 、`cos()` 和 `tan()` 等来计算元素位置和变换的新特性，这让使用 CSS 创建更复杂的动画和布局效果成为可能。使用 `sin()` 和 `cos()` 可以在圆周围放置元素，创建旋转和弯曲的动画效果，而利用 `tan()` 则可以进行倾斜和扭曲的变形效果。此外，与以前的解决方案相比，使用这些 CSS 三角函数可以获得更简单的代码和更具可维护性的设计，尤其是当主流浏览器都支持它们之后，这些功能将会有更多的创意应用和使用案例。
