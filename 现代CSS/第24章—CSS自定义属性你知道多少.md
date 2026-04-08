大多数 Web 开发者更喜欢将 CSS 自定义属性称为 CSS 变量。近几年中，社区有关于 CSS 自定义属性的讨论到处可见，而且在很多 Web 应用或页面中也可以看到 CSS 自定义属性的身影。虽然如此，但有很多 Web 开发者对 CSS 自定义属性了解的并不多，甚至说不怎么理解，这样一来，在实际开发时就用不好 CSS 自定义属性。在这节课中，我们一起来探讨 CSS 自定义属性，将从不同的角度来阐述 CSS 自定义属性，希望大家能更好地理解 CSS 自定义属性，以及如何更好的使用 CSS 自定义属性。

## CSS 自定义属性的发展进程

众所周知，CSS 和其他程序语言之间有一个最大的差异，即 CSS 中没有变量这样的概念。也正因此，很多 Web 开发者都觉得 CSS 非常简单，没有技术含量。然而，对于 Web 开发者而言，很多时候是希望 CSS 能像其他程序语言一样，有变量的概念，这样有利于 CSS 的编写和维护。比如构建下图这样的 UI Kit：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe3057fd7c434a3e8b3d86f1c307550b~tplv-k3u1fbpfcp-zoom-1.image)

不难发现，上图中很多 UI 都应用了 `#0055fe` 颜色，也就是说该色值会在 CSS 样式表中多次被使用：

```CSS
/* 页头的背景色 */
header { 
    background-color: #0055fe; 
} 
​
/* label 文本颜色 */
label { 
    color: #0055fe; 
} 
​
/* 按钮边框颜色 */
button { 
    border: 1px solid #0055fe; 
} 
```

想象一下，如果你正在维护一个大型的项目，会涉及很多个组件，也可能会有很多个 CSS 样式表文件。也就是说，在多个不同的样式表文件中都有可能会用到 `#0055fe` 颜色。突然有一天，你被要求将 `#0055fe` 这个颜色更换成别的颜色（即换肤）。那么，在没有 CSS 自定义属性（即 CSS 变量）的情况之下，可能最好的办法是在整个项目的样式表文件（即 `.css` 文件）中查找 `#0055fe` ，然后再替换成所需要的目标颜色值。**这么做，是多么痛苦的一件事情，而且还容易被遗漏**！

这样的操作模式对于 Web 开发者来说是极其痛苦的。庆幸的是，Web 开发者会使用像 Sass、LESS 和 Stylus 等 CSS 处理器来编写和维护 CSS 代码，因为在这些处理器中可以使用变量。例如，在 Sass 处理器中，可以像下面这样定义和使用变量：

```SCSS
/* 定义一个 Sass 变量 */
$primary-color: #0055fe;
​
/* 使用已定义好的 Sass 变量 */
header {
    background-color: $primary-color;
}
​
label {
    color: $primary-color;
}
​
button {
    border: 1px solid $primary-color;
}
```

这样一来，我们可以在一个 `_var.scss` 文件中放置项目中会运用到的所有变量，比如 `$primary-color` ：

```SCSS
/* _var.scss 文件 */
$primary-color: #0055fe;
$secondary-color: #09f;
```

然后在需要的地方引用已定义好的变量，例如：

```CSS
/* _header.scss 文件 */
@import "./scss/_var.scss";
​
header {
    background-color: $primary-color;
}
```

这样做的目的是可以在不同的 `.scss` 文件中使用相同的值，从而实现 CSS 值的可重用性和减少冗余的 CSS 代码。基于该特性，Web 开发者可以轻易的实现换肤效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e0eaac588f14d00b0a82c79e747f4b1~tplv-k3u1fbpfcp-zoom-1.image)

另外，CSS 近几年发展和变革是非常地快，而且 W3C 的 CSS 工作者也知道，CSS 也应该具备“变量”这样的特性，为开发者减少重复性的工作和简化工作，并且减少对 CSS 处理器工具的依赖。为此，2012 年左右，W3C CSS 小组为 CSS 引入了 **[CSS自定义属性（CSS变量） 模块](https://www.w3.org/TR/css-variables-1/)**，并在 2017 年左右获得大部分主流浏览器的支持。

有了 CSS 自定义属性后，我们可以像下面这样来编写和维护 CSS：

```CSS
:root { 
    --primary-color: #0055fe; 
} 
​
header { 
    background-color: var(--primary-color); 
} 
​
label { 
    color: var(--primary-color); 
} 
​
button { 
    border: 1px solid var(--primary-color); 
} 
```

不过 CSS 原生的自定义属性（变量），它也有一定的缺陷，比如说无法在声明变量的时候指定其语法类型。例如上面示例中，我们只能在 `:root{}` 中指定 `--primary-color` 自定义属性的值是 `#0055fe`，它只是个字符串，并不是一个 `<color>` 值类型。

除了在 CSS 中可以声明自定义属性之外，**[CSS Houdini 的属性和值 API ](https://www.w3.org/TR/css-properties-values-api-1/)** 也对 CSS 自定义属性进行了扩展：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d14b2fefdab4cf4bb7725db8b689505~tplv-k3u1fbpfcp-zoom-1.image)

对于 CSS Houdini 中的自定义属性，我更喜欢称之为 CSS Houdini 变量。CSS Hounini 变量有两种方式来注册，一种是 JavaScript 来注册：

```JavaScript
CSS.registerProperty({ 
    name: '--primary-color', 
    syntax: '<color>', 
    inherits: false, 
    initialValue: '#0055fe' 
}) 
```

另外一种是使用 `@property` 规则注册：

```CSS
@property --primary-color { 
    syntax: '<color>'; 
    initial-value: #0055fe; 
    inherits: false; 
 } 
```

CSS Houdini 变量的使用方式和 CSS 原生的 CSS 变量使用方式是相同的：

```CSS
header { 
    background-color: var(--primary-color); 
}
```

时至今日，你可能还在 CSS 处理器中使用变量，或许开始在使用原生的 CSS 变量，也有可能两者混合在一起使用。

换句话说，我们有多种方式使用 CSS 变量，但我们应该根据具体的场景使用更合适合的方式，不过我自己更建议从现在开始就使用原生的 CSS 变量，因为它有些特性是 CSS 处理器中变量无法具备的，特别是使用 CSS Houdini 的变量时，它的特性会变得更强大。

## CSS 自定义属性的基础

如果你从未接触过 CSS 自定义属性，那么你可以从 CSS 自定义属性的一些基础开始；如果你是这方面的专家，你可以选择性的阅读后续的内容。

那我们从 CSS 自定义属性最基础的知识开始吧！

### CSS 自定义属性简介

CSS 自定义属性也常被称为 CSS 变量，被称为 CSS 变量主要还是源于 CSS 处理器或其他程序语言的一种叫法。但我想说的是“ **CSS 自定义属性不是变量**”。为什么这么说呢？后面会向大家解释。

CSS 自定义属性是以 `--` 前缀开始命名，比如前面示例中的 `--primary-color`，其中 `primary-color` 可以是任何字符串，它也被称为“**自定义属性名**”。即 `--自定义属性名`（比如 `--primary-color`）组合在一起才是“ CSS 自定义属性”。

CSS 自定义属性的声明和 Sass 的变量声明有所不同，在 Sass 中，我们可以在 `{}` 外声明，比如：

```SCSS
// _var.scss
$primary-color: #0055fe;
```

但 CSS 自定义属性声明需要放置在一个 `{}` 花括号内，比如：

```CSS
:root { 
    --primary-color: #0055fe; 
}
```

除了在 `:root` 中之外，还可以是在其他的代码块中声明自定义属性，例如：

```CSS
html { 
    --primary-color: #0055fe; 
} 
​
header { 
    --primary-color: #00fe55; 
} 
```

虽然按上面的方式在 CSS 中注册了 CSS 自定义属性，但如果没有被 `var()` 函数引用的话，它们不会有任何效果。比如下面这个示例，只有 `--primary-color` 被 `var()` 引用，而 `--gap` 虽已注册，但未被 `var()` 引用，它也就未运用到任何元素上：

```CSS
:root { 
    --primary-color: #0055fe; 
    --gap: 20px; 
} 
​
header { 
    color: var(--primary-color); 
}
```

除了在 CSS 中使用 `--varName` 来注册一个 CSS 自定义属性之外，我们还可以使用 JavaScript 的 `style.setProperty()` 动态注册一个CSS自定义属性，比如：

```JavaScript
 document.documentElement.style.setProperty('--primary-color', '#0055fe');
```

执行完上面脚本之后，在 `<html>` 元素上会添加 `style` 属性：

```HTML
<html style="--primary-color: #0055fe"></html>
```

在 CSS Houdini 中，我们还可以使用另外两种方式来注册 CSS 自定义属性（变量）。在 CSS 样式文件中可以使用 `@property` 注册自定义属性：

```CSS
@property --primary-color { 
    syntax: '<color>'; 
    initial-value: #0055fe; 
    inherits: true; 
}
```

在 JavaScript 中可以使用 `CSS.registerProperty()` 注册：

```JavaScript
CSS.registerProperty({ 
    name: '--primary-color', 
    syntax: '<color>', 
    inherits: true, 
    initialValue: '#0055fe' 
}) 
```

CSS Houdini 中注册好的 CSS 自定义属性同样只有被 `var()` 函数调用才能生效。

### 为什么要使用 CSS 自定义属性？

我将拿一个日常开发中非常常见的示例来回答这个问题。例如，CSS 更改悬浮状态下的颜色，我们会这样编写 CSS ：

```CSS
button {
    color: #0055fe;
    border: 2px solid #0055fe;
    padding: .25em .5em;
    border-radius: .25em;
    background-color: #fefefe;
}
​
button:hover {
    color: #2196F3;
    border-color: #2196F3;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2dfd0b8f7e94337bd1c8ef86a6f32e8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQRLVj>

你也看到了，如果想在按钮悬浮状态下改变文本颜色（`color`）和边框颜色（`border-color`），需要在代码中重复写这些属性。但换成 CSS 自定义属性之后，我们就不再需要重复编写这些属性，仅需要在悬浮状态（`:hover`）下更改自定义属性 `--primary-color` 的值：

```CSS
:root {
    --primary-color: #0055fe;
}
​
button {
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
    padding: .25em .5em;
    border-radius: .25em;
    background-color: #fefefe;
}
​
button:hover {
    --primary-color: #2196F3;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48f2e8d6f1384d15be4c3b8218fdf27a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzJZXa>

正如你所看到的，以 `var(--primary-color)` 函数作为 CSS 的 `color` 和 `border-color` 属性值时，可以获得更大的灵活性。它允许你定义一个或多个自定义属性，然后在整个样式表中使用这些属性。通过这样做，你可以通过简单地更新自定义属性的值来改变 UI 的样式风格。这使得你的代码更具可重用性和可维护性，从而使你的工作效率更高。

简单地说，我们可以使用 `var()` 函数引用已注册的 CSS 自定义属性作为 CSS 属性的值。这为自定义属性开启了无尽的机会！

## CSS 自定义属性 vs. CSS 处理器的变量

很多 Web 开发者都会认为 CSS 自定义属性和 CSS 处理器中的变量有点类似，但事实上，它们之间还是有很大的差异。接下来，拿 CSS 处理器中的 Sass 处理器为例。

> 注意，Sass 处理器又常被称为 SCSS 处理器。

### 语法上的差异

CSS 自定义属性和 CSS 处理器之间最明显的差异就是语法上的差异。例如，在 Sass 中，我们使用 `$` 符号来声明变量，而且不需要在代码块 `{}` 中声明。

```SCSS
// SCSS 中声明变量
$primary-color: #0055fe;
```

而 CSS 自定义属性是使用 `--` 前缀来声明，并且需要在一个选择器块声明，例如：

```CSS
/* CSS 中自定义属性 */
:root {
    --primary-color: #0055fe;
}
```

在引用变量的时候，它们也是有一定的差异。在 Sass 中引用已声明的变量，采用的是“键值对”的语法规则，例如：

```SCSS
// 声明一个 SCSS 变量
$primary-color: #0055fe;
​
// 引用已声明的 $primary-color 变量
​
header {
    background-color: $primary-color;
}
```

在 CSS 中要引用已声明的 CSS 自定义属性，则必须通过 `var()` 函数来引用，例如：

```CSS
/* 声明一个 CSS 自定义属性 */
:root {
    --primary-color: #0055fe;
}
​
/* 引用已声明的 --primary-color 自定义属性 */
header {
    background-color: var(--primary-color);
}
```

需要知道的是，CSS 处理器中的变量就是变量，它不会是其他任何东西。但 CSS 自定义属性则不同，**它既是一个自定义属性，也是一个变量。** 有意思的是，我们又说 CSS 自定义属性不是 CSS 变量。

那为什么说“CSS 自定义属性”不是“ CSS 变量”呢？我们先从相关的文档中来说起。

[首先来看 MDN 文档，他是这样来描述的](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)：

> Custom properties (sometimes referred to as CSS variables or cascading variables) … You can define multiple fallback values when the given variable is not yet defined.

大致意思是： “自定义属性（有时也被称为 CSS 变量或级联变量）。当给定的变量尚未定义时，你可以定义多个回退值”。

[Google 开发者网站有篇文章对 CSS Houdini 的 @property 描述时提到](https://web.dev/at-property/)：

> This API supercharges your CSS custom properties (also commonly referred to as CSS variables) … The --colorPrimary variable has an initial-value of magenta.

它的意思是： 你可以使用 `@property` API来自定义 CSS 属性（也就是通常所说的 CSS 变量）。比如 `--colorPrimary` 变量的初始值是 `magenta`。

为什么这么混乱呢？这是有因可查的。其实在 [W3C 的自定义属性描述的规范（CSS Custom Properties for Cascading Variables Module Level 1）](https://drafts.csswg.org/css-variables/)就出现了“ CSS 自定义属性”和“ CSS 变量”这两个术语。甚至在规范的标题也出现这两个术语“CSS Custom Properties for Cascading Variables”。

事实上呢？前面也提到过，CSS 自定义属性也是 CSS 变量。不过，规范对这两个术语（“CSS 自定义属性”和“CSS 变量”）还是做了区分的： **CSS 自定义属性不是一个 CSS 变量，但它定义了一个 CSS 变量** 。

简单地说呢？在 CSS 代码块中使用 `--` 注册的属性称为“自定义属性”，但只有被 `var()` 引用的“CSS自定义属性”才能被称为“CSS 变量”，而且其值由相关的自定义属性定义。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88630f76a6db4cba978c299f5a3e4989~tplv-k3u1fbpfcp-zoom-1.image)

上图描述的是， `--accent-background` 自定义属性的值是 `var(--main-color)`(其中 `--main-color` 是CSS 变量)，其值由 `--main-color` 自定义属性定义。

在 CSS 中，这样来区分“ CSS 自定义属性”和“ CSS 变量”是有用的，因为它允许我们讨论 `var()` 函数的回退值（CSS 自定义属性像其他 CSS 属性一样，并没有回退值一说）和“使用变量的属性”（一个属性不能使用自定义属性）：

```CSS
html { 
    /* 这是一个 CSS 自定义属性，它只有一个声明值，并不能有回退值 */ 
    --main-color: #ec130e; 
} 
​
button { 
    /* 这是一个 CSS 变量，它可以有回退值 */ 
    background-color: var(--main-color, #eee); 
    
    /* 同时使用了两个 CSS 变量 */ 
    box-shadow: 0 0 var(--shadow-size) var(--main-color); 
}
```

以及“在元素上声明一个自定义属性”（一个变量没有被声明，而是被分配给一个属性）和“自定义属性的计算值”（一个变量没有计算值，而是从其关联的自定义属性的计算值中提取）：

```CSS
html { 
    /* 在 html 元素上注册了一个 CSS 自定义属性 */ 
    --padding: 1rem; 
} 
​
main { 
    /* --padding 自定义属性继承到 main 元素上，它在这个元素上的计算值是 16px */ 
} 
​
main p { 
    /* --padding 自定义属性在 p 元素上重新注册，该属性在该元素上计算值是 8px */ 
    --padding: 0.5rem; 
} 
```

其实也可以简单地来区分“ CSS 自定义属性”和“ CSS 变量”，即 **CSS 的** **`var()`** **引用的自定义属性被称为 CSS 变量**。

除此之外，它们还有另一个差异。CSS 处理器的变量和 CSS 自定义属性被引用也有所不同。在 CSS 处理器中，你可以在任何地方引用已声明的变量，比如外部声明块、媒体查询、选择器、属性中。例如：

```SCSS
// SCSS
$breakpoint: 800px;
$primary-color: #0055fe;
$list: ".text, .cats";
$btm: bottom;
​
$color: $primary-color;
​
@media screen and (min-width: $breakpoint) {
    #{$list} {
        color: $color;
    }
}
​
p { 
    padding-#{$btm}:5rem;
}
```

CSS 自定义属性和常规 CSS 属性的用法是一样的，所以把 CSS 自定义属性当作动态属性会比 CSS 变量更好一些。这也意味着，它们只能在声明块中使用。也就是说，CSS 自定义属性和选择器是强绑定的。一般会在 `:root` 选择器中声明 CSS 自定义属性，事实上，只要是有效的 CSS 选择器都可以。

```CSS
:root {
    --primary-color: #0055fe;
}
​
main {
    --primary-color: #5500fe;
}
```

CSS 自定义属性要想被起作用，则需要通过 `var()` 函数引用，并且赋予给相应的 CSS 属性。例如：

```CSS
:root {
    --primary-color: #0055fe;
}
​
header {
    background-color: var(--primary-color);
}
```

在 CSS 中，你可以在属性声明中的任何地方获取 CSS 自定义属性的值。这也意味着，它们可以作为单个值使用，也可以作为一个简写属性的一部分，甚至还可以在 `calc()` 函数中使用，例如：

```CSS
.cats { 
    color: var(--color); 
    margin: 0 var(--margin-horizontal); 
    padding: calc(var(--margin-horizontal) / 2); 
} 
```

不过，在某些地方，CSS 自定义属性的限制要比 CSS 处理器的变量要多。例如，CSS 自定义属性不能用于媒体查询的条件语句中，也不能用于 CSS 选择器中：

```CSS
/* 下面这样的用法是无效的 */ 
:root { 
    --num: 2; 
    --breakpoint: 30em; 
} 
 
div:nth-child(var(--num)) { 
    color: var(--color); 
} 
​
@media screen and (min-width: var(--breakpoint)) { 
    :root { 
        --color: green; 
    } 
} 
```

### 动态 vs. 静态

CSS 处理器运行机制的过程可能大致如下图：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/394d5dc7d5e24c309273eaae16da29fa~tplv-k3u1fbpfcp-zoom-1.image)

CSS 处理器中的代码最终是会编辑成 CSS 代码。也就是说，CSS 处理器中的变量或其他功能仅仅是在编译的时候生效，它是一种静态的。而 CSS 自定义属性却不一样，他是一种动态的，你在客户端运行时就可以做出相应的改变。比如，在不同的断点运行时，`.card` 的间距不同。

在 CSS 处理器，我们可能会这样来做：

```SCSS
// SCSS 
$gutter: 1em; 
​
@media screen and (min-width: 30em) { 
    $gutter: 2em; 
} 
​
.card { 
    margin: $gutter; 
} 
```

使用过 CSS 处理器的同学都知道，`@media` 中的 `$gutter` 并没有生效，最后编译出来的 CSS 代码中，只能找到：

```CSS
/* 编译后的 CSS 代码 */
.card { 
    margin: 1em; 
} 
```

不管浏览器视窗宽度怎么变化，`$gutter` 的值始终都是 `1em`。这就是所谓的静态（处理器无法在客户端动态编译）。其主要原因是 CSS 处理器需要经过编译之后才能在客户端运行，而 CSS 自定义属性却不需要经过编译这一环节，可以在客户端上直接使用，比如：

```CSS
:root { 
    --gutter: 1em; 
} 
​
@media screen and (min-width: 30em) { 
    :root { 
        --gutter: 2em; 
    } 
} 
​
.card { 
    margin: var(--gutter); 
} 
```

就上面示例代码，当你改变浏览器窗口的时候，你会发现 `.card` 的 `margin` 会发生相应的变化。

从这个示例不难看出，**CSS 自定义属性是动态的（可以在客户端动态响应）** 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f67adbe0693848938640ff5780d27705~tplv-k3u1fbpfcp-zoom-1.image)

另外，我们无法使用 JavaScript 来动态修改 CSS 处理器的变量。但 CSS 自定义属性却不同，我们可以通过 **[CSSOM的 API ](https://www.w3cplus.com/javascript/cssom-css-typed-om.html)**来动态获取或修改 CSS 自定义属性的值。例如：

```CSS
:root { 
    --mouse-x; 
    --mouse-y; 
} 
​
.move { 
    left: var(--mouse-x); 
    top: var(--mouse-y); 
}
```

```JavaScript
let moveEle = document.querySelector('.move'); 
let root = document.documentElement; 
​
moveEle.addEventListener('mousemove', e => { 
    root.style.setProperty('--mouse-x', `${e.clientX}px`); 
    root.style.setProperty('--mouse-y', `${e.clientY}px`); 
})
```

利用该特性，我们很轻易可以实现下图这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b8639d671f44b4cbfcc90d7c6aefd78~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGWOgb>

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/871e96b1c84e42e8af2a086ce697c997~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzpPYy>

### 级联和继承

CSS 处理器和 CSS 自定义属性还有一个较大的差异性，那就是级联和继承方面的。CSS 变量在 CSS 处理器中是不具备级联和继承这方面特性的。先来看级联方面的特性：

```SCSS
// SCSS 
$font-size: 1em; 
​
.user-setting-larger-text { 
    $font-size: 1.5em; 
} 
​
body { 
    font-size: $font-size; 
}
```

编译之后 ，`body` 的 `font-size` 始终都是 `1em`，哪怕是用户显式地在 `<body>` 元素上设置了 `class="user-setting-large-text"` 也是如此。但 CSS 自定义属性在这方面却不同。例如：

```CSS
/* CSS 自定义属性*/ 
:root { 
    --font-size: 1em; 
} 
​
.user-setting-large-text { 
    --font-size: 1.5em; 
} 
​
body { 
    font-size: var(--font-size); 
} 
```

你会发现，当 `<body>` 元素有类名 `user-setting-large-text` 时，它的 `font-size` 值为 `1.5em` ，否则是 `1em` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cf1838e6aec4d118ec252d6a6467677~tplv-k3u1fbpfcp-zoom-1.image)

可以说，**CSS 自定义属性使用级联机制是它们最有用的特性之一**。我们来重点阐述一下。

假设我们在 `body` 元素上定义了一个自定义属性 `--background` ，然后在特定的类（例如 `.sidebar`）上重新定义了 `--background` 。我们在特定的组件中（例如 `.module`）使用它：

```CSS
body {
    --background: #5500fe;
}
​
.sidebar {
    --background: #fe890a;
}
​
.module {
    background-color: var(--background);
}
```

假设我们的 HTML 结构如下：

```HTML
<body> <!-- --background: #5500fe -->
    <main>
        <div class="module">我将使用 #5500fe 作为背景颜色。</div>
    </main>
​
    <aside class="sidebar"> <!-- --background: #fe890a -->
        <div class="module">我将使用 #fe890a 作为背景颜色</div>
    </aside>
</body>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c3e5f63ec6c47318274d3840b67bbf0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQqyrY>

正如你所看到的，侧边栏（`.sidebar`）中的 `.module` 背景颜色是 `#fe890a` ，因为自定义属性（像许多其他 CSS 属性一样）通过 HTML 结构进行继承。在这个示例中，第二个 `.module` 运用的自定义属性 `--background` ，相比而言，它离 `.sidebar` 中的 `--background` 更近，离 `body` 中的 `--background` 却更远，因此，`--background` 被解析为 `#fe890a` ，而在其他地方解析为 `#5500fe` 。

这种机制也可以在其他方面发挥作用：

```CSS
button {
    --primary-color: #5500fe; /* 默认值 */
    background-color: var(--primary-color);
}
​
button:hover {
    --primary-color: #2196f3; /* 按钮悬浮时取该值 */
}
```

上面这个示例是一个更具体的选择器，因此重新设置自定义属性 `--primary-color` 的值将会覆盖在 `button` 定义的值。

在 CSS 的媒体查询中不会改变权重，但它们通常位于 CSS 文件中比原始选择器设置值的位置后（或下面），这也意味着在媒体查询内部将覆盖自定义属性。例如：

```CSS
body {
    --size: 16px;
    font-size: var(--size);
}
​
@media screen and (width < 600px) {
    body {
        --size: 14px;
    }    
}
```

在这个示例中，当浏览器屏幕小于 `600px` 时，`body` 元素的 `font-size` 将会取媒体查询中设置的 `--size` 自定义属性的值，即 `14px` 。除此之外，我们还可以借助媒体查询其他功能，例如用户偏好设置，可以实现其他的一些效果，其中最为典型的案例，就是在亮色和暗色模式下切换 Web 应用的皮肤效果：

```CSS
/* 亮色模式下 */
:root {
    --color: #333;
    --primary-color: #ffffff; /* 主色 */
    --body-bg-color: #f1f1f1; /* body背景颜色 */
    --card-box-shadow-color: #405070; /* card盒子阴影颜色 */
    --btn-bg-color: #28c3f5; /* button背景颜色 */
    --paragraph-color: gray; /* 段落文本颜色 */
    --card-object-bg-color: #eaeff8; /* card顶部背景颜色 */
    --title-color: #101c34; /* 标题2文本颜色 */
    --avatar-bg-color: #fff;
    --light: #fff;
    --saturation: 0;
    --invert: none;
}
​
/* 暗色模式下 */
@media (prefers-color-scheme: dark) {
    :root {
        --color-mode: "dark";
    }
​
    :root:not([data-user-color-scheme]) {
        --color: #fff;
        --primary-color: #1a1515; /* 主色 */
        --body-bg-color: #1a1818; /* body背景颜色 */
        --card-box-shadow-color: #6a716e; /* card盒子阴影颜色 */
        --btn-bg-color: #ff5722; /* button背景颜色 */
        --paragraph-color: #c7c1c1; /* 段落文本颜色 */
        --card-object-bg-color: #282035; /* card顶部背景颜色 */
        --title-color: #ffffff; /* 标题2文本颜色 */
        --avatar-bg-color: #673ab7;
        --saturation: 1;
        --invert: 0.8;
    }
}
​
body {
    background-color: var(--body-bg-color);
    color: var(--color);
}
​
.card {
    background: var(--primary-color);
    box-shadow: 0px 1px 10px 1px var(--card-box-shadow-color);
}
​
.card__object {
    background-color: var(--card-object-bg-color);
}
​
.card__avatar {
    background-color: var(--avatar-bg-color);
}
​
.card__body h4 {
    color: var(--title-color);
}
​
.card__body p {
    color: var(--paragraph-color);
}
​
.card__body .btn {
    background: var(--btn-bg-color);
    color: var(--primary-color);
}
​
.card__body .btn:hover {
    color: var(--btn-bg-color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4e32b65a8b447f9b7aad90e34b4ed60~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMZmbj>

所以说，在 CSS 中声明自定义属性时，都将它们放置在 `:root` 选择器中并不是一种明智的选择。实际上，推荐的方法是只在 `:root` 选择器放置全局的 CSS 自定义属性，而将更多与类或组件相关的样式放在它们需要的地方附近。

除了上面的示例可以解释之外，CSS 自定义还有一个关键概念，那就是**自定义属性的值是在每个元素中计算一次，然后计算后的值可以继承**。例如，你在 `calc()` 或需要进行计算的其他值中使用了 CSS 自定义属性，比如 `hsl()` 中的色调，那么就使得整个计算后的值可以被继承。如果某个值在父元素上进行设置，你将不能在计算中更改它，例如下面这个示例：

```CSS
:root {
    --unit: 10px;
    --size-lg: calc(var(--unit) * 3);
}
​
/* 这里计算时不会使用更新后的 --unit 值 */
.margin-top-xxxl {
    --unit: 30px;
    margin-top: var(--size-lg);
}
```

修复上述继承问题的一个选项是，使用基础类和修饰类的组合，以便将值计算在同一个元素中。在示例中，我们仍然设置了一个全局的 `--unit` 值，并将其作为基础类的默认值。

```CSS
:root {
    --unit: 10px;
}
​
.margin-top {
    --margin-unit: var(--unit);
    --multiplier: 1;
​
    margin-top: calc(var(--multiplier) * var(--margin-unit));
}
​
.margin-top--xxxl {
    --margin-unit: 30px;
    --multiplier: 3;
}
​
div[class*="margin"] {
    background-color: dodgerblue;
    color: white;
    padding: 0.5rem;
    font-size: 1.5rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1afafe3e74f4d778d0e9c1fd453be44~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOWdBp>

### 全局 vs. 局部

CSS 处理器的变量主要有两种类型，即全局和局部。拿 Sass 为例，定义在选择器外部的变量都被称为全局变量，可以在所有选择器中访问到，包括选择器内部和选择器外部。

```SCSS
$color: red;
​
body {
    background-color: $color;
}
​
h1 {
    color: $color;
}
```

而在选择器内部定义的变量被称为局部变量，只能在该选择器内部和其子选择器内部访问到，而无法在选择器外部访问到。比如下面这个示例，`$size` 变量就是一个局部变量，只能在选择器中访问到：

```SCSS
body {
    $size: 16px;
    font-size: $size;
  
    h1 {
        font-size: $size * 2;
    }
}
```

需要注意的是，局部变量只能在其定义的选择器内部访问，如果选择器内部有嵌套的选择器，那么该变量也可以在嵌套的选择器内部访问。也就是说，任何嵌套的代码块都可以访问封闭内的变量：

```SCSS
$globalVar : 10px; // 全局变量
​
.enclosing { 
    $enclosingVar: 20px; // 局部变量
    
    .closure { 
        $closureVar: 30px; // 局部变量 
        
        font-size: $closureVar + $enclosingVar + $globalVar; // 60px 
     } 
}
```

这也意味着，在 CSS 处理器中，变量的作用域完全依赖于代码的结构。

CSS 自定义属性的作用域和 CSS 处理器有所不同。一般情况之下，在选择器 `:root` 中声明的变量才被称为是全局变量，而在其他选择器内声明的变量称为局部变量。

注意，在 `html` 选择器内声明的变量也称为全局变量，只不过在 `:root` 选择器声明的 CSS 自定义属性优先级要更高。

### CSS 自定义属性和 CSS 处理器可以混合使用

虽然 CSS 自定义属性和 CSS 处理器中的变量有所差异，甚至说 CSS 自定义属性胜于 CSS 处理器变量不少，但这也不是谁替代谁的主要原因。换句话说，如果你习惯了使用 CSS 处理器或者你现在还在使用 CSS 处理器，那么完全可以将 CSS 处理器和 CSS 自定义属性结合使用，以充分发挥各自的优势。

继续拿 Sass 处理器为例，为了将 Sass 变量用作自定义属性的值，你需要使用插值语法，如下所示：

```SCSS
--custom-property: #{$sass-var};
```

对于 Web 开发者，时常都会碰到换肤的需求。通过使用 Sass ，我们可以使用 `!default` 标记来设置静态变量，这意味着它们可以被覆盖。然后，我们可以将其传递给 CSS 自定义属性。此外，我们还可以利用 Sass 的其他特性，比如循环遍历，来快速生成一组类似的属性。例如：

```SCSS
$color-link: blue !default;
$font-sizes: (
    "small": .875rem,
    "normal": 1rem,
    "medium": 1.25rem,
    "large": 2rem
) !default;
​
:root {
    --color-link: #{$color-link};
​
    @each $size, $value in $font-sizes {
        --font-size-#{$size}: #{$value};
    }
}
```

编译出来的 CSS 如下：

```CSS
:root {
    --color-link: blue;
    --font-size-small: 0.875rem;
    --font-size-normal: 1rem;
    --font-size-medium: 1.25rem;
    --font-size-large: 2rem;
}
```

通过这种设置，可以在不修改核心 Sass 文件设置的情况下重新定义应用程序的主题。这提供了主题处理的灵活性和可维护性。

## CSS 自定义属性的特性

通过前面的学习，我想你对 CSS 的自定义属性有了一些基本的认识。接下来，我们来聊聊 CSS 自定义属性中你所不知道的特性。

### 当一个 var() 函数使用一个未定义的变量时，会发生什么？

我们在 CSS 中声明一个 CSS 自定义属性时，有一个细节需要注意，那就是 **CSS 自定义属性名称有大小写之分**。比如， `--on` 和 `--ON` 是两个完全不同的 CSS 自定义属性。来看一个具体的示例：

```CSS
:root { 
    --ON: 1; 
} 
​
.box { 
    transform: rotate(calc(var(--ON) * 45deg)); 
    transition: transform 1s ease-in-out; 
} 
​
.box:hover { 
    transform: rotate(calc(var(--on) * 720deg)); 
} 
​
.box:last-of-type:hover{ 
    transform: rotate(calc(var(--ON) * 720deg)); 
} 
```

如果你把鼠标移动蓝色 `.box` 上，效果和我们预想的并不相同，没有旋转 `720deg`，反而旋转到了 `0deg`，即 `--on` 无效值；如果把鼠标移动到红色的 `.box` 上，可以看到元素从 `45deg` 旋转到 `720deg`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7c06c2e50dc4fbb891a9f4c5753c29e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXWqym>

从浏览器开发者工具中不能发现 `var(--on)`（注意，我们在代码中并没有显式声明 `--on` 自定义属性），那么 `transform: rotate(calc(var(--on) * 720deg))` 计算出来的 `transfrom` 为 `none`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8139099161254a30b98332656281e848~tplv-k3u1fbpfcp-zoom-1.image)

这个示例告诉我们：“`var()` 函数引用一个未定定义的变量（CSS 自定义属性）并不会导致样式解析错误，也不会阻止样式加载、解析或渲染”。这个就好比你在编写 CSS 时，因为手误将属性或属性值用借一样，客户端只是不识别这个错误的信息，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/748e726eab984d3095b5293c39490ec1~tplv-k3u1fbpfcp-zoom-1.image)

那么，在 `var()` 函数中使用了一些未定义的 CSS 变量时，有可能是：

-   `var()` 函数引用的变量名输错了（手误造成）
-   你可能使用 `var()` 引用了一个自认为它存在的 CSS 变量，但事实上它并不存在
-   你可能正试图使用一个完全有效的 CSS 变量，但是你想在其他地方使用，它恰好不可见

我们再来看两个示例，先来看一个有关于 `border` 的示例：

```CSS
:root { 
    --primary-color: #0055fe; 
} 
​
body { 
    color: #f36; 
} 
​
/* 注意，这里运用的是一个 --primay-color 自定义属性，并没有显式声明 */
.box { 
    border: 5px solid var(--primay-color); 
    color: var(--primay-color); 
}
```

注意，上面代码中 `.box` 元素的 `border` 和 `color` 运用的是一个并没有显式声明的 CSS 自定义属性 `--primay-color` （可能因为手误，将声明的 `--primary-color` 写成 `--primay-color`）。你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/746c97b6d05049b6a562068e586d475f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwWzeK>

结果浏览器并不知道 `border` 最终的值应该是什么？因为 `border` 属性是一个不可继承的属性，这个时候浏览器会理解成用户把 `border` 属性写错了。此时，浏览器解析 `border` 的值为 `0px none #f36` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/995457ac8b474ef692fe98d0ac384932~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，在 CSS 中，如果 `border-style` 的值被渲染为 `none` 时，你是看不到任何边框效果的。

再来看 `color` 属性。虽然 `var()` 引用的变量也手误写错了，但它却有颜色。这主要是因为 `color` 是一个可继承的属性，所以浏览器渲染的时候会继承其祖先元素的 `color` 值，在我们这个示例中，在 `body` 中显式设置了`color: #f36`，因此 `.box` 的 `color` 继承了 `body` 的 `color` 值，即 `#f36`。

这个示例令人感到困惑的是 `var()` 引用错语的变量（其实是不存在的变量），浏览器渲染的时候到底会发生什么？从上面的示例中我们可以得知，它的根源在于 `var()` 函数使用了无效的属性，这个时候浏览器渲染 CSS 时，它自己也无从得知。

浏览器在渲染 CSS 时，只有属性名或值无法被识别时（浏览器渲染引擎不知道时）才会认为是无效的。但是，**`var()`** **函数可以解析为任何东西，所以样式引擎不知道** **`var()`** **包含的值是否已知（浏览器渲染引擎可识别）** 。只有当这个属性真正被使用时，它才会知道，这时，它会默默地回退到属性的继承或初始状态，并让你疑惑发生了什么？当你碰到这个现象的时候，其实可以借助浏览器开发者工具来查找问题：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abe58904f8674f8084d8b16cceb36e48~tplv-k3u1fbpfcp-zoom-1.image)

除此之外，要是 `var()` 函数引用的 CSS 自定义属性不存在，浏览器开发者调试工具也会有相应的提示，例如 Chrome 开发者调试工具会将引用的自定义属性置灰，Firefox 浏览器会更友好一些，它会告诉你自定义属性没有定义：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d254bd6fd8f149cbb84fac8fccceb301~tplv-k3u1fbpfcp-zoom-1.image)

不知道你有没有发现，CSS 原生中的自定义属性是一个字符串，可以说并不很严谨。比如说，`--primary-color` 应该是一个颜色值 `<color>` ，但有的时候在另一个地方再次注册的时候，它可能被开发者定义成了一个长度值 `<length>` ：

```CSS
:root { 
    --primary-color: #0055fe; 
} 
​
body {
    color: #f36;
}
​
.box { 
    --primary-color: 5px; 
    
    border: solid var(--primary-color); 
    color: var(--primary-color); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6162e2b569f4d0bbb66c59443fd94e3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQmEaa>

可以看到，`.box` 元素的 `border` 引用自己作用域中注册的 `--primary-color`，浏览器这个时候将其解析为 `border-width: 5px`，而 `color` 也同时引用了 `--primary-color`，可相当于 `color: 5px` ，此时浏览器将其继承祖先元素 `<body>` 的 `color` 值。

如果你尝试着将 `.box{}` 中的 `--primary-color` 禁用，你会发现 `border` 和 `color` 中的 `--primary-color` 将会引用全局的（即 `:root{}`）中注册的值（`--primary-color: #0055fe`）。此时 `border` 中的`var(--primary-color)` 被浏览器解析为 `border-color: #0055fe`，而 `border-width` 被解析为 `medium` 。而 `color` 中的 `var(--primary-color)` 也就是一个有效值了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ccca69d51014dabbe74f644171f5d25~tplv-k3u1fbpfcp-zoom-1.image)

CSS 中的自定义属性的值类型没有任何约束，也就造成上面示例中提到的效果。如果你想对自定义属性值的类型有较强约束的话，就可以使用 CSS Houdini 的 `@property` 来声明 CSS 自定义属性。有关于这方面更详细的介绍，将放到小册后面的相关课程中来介绍。

虽然 `var()` 函数引用一个未定义的 CSS 自定义属性，很有可能会令浏览器解析 CSS 规则是造成一定的混乱，但并不是一无事处。有的时候，使用未定义的 CSS 自定义属性也是有益的，比如使实用类更加灵活。未定义属性的好处在于它可以从任何祖先继承其值，这对于更新一组相关元素的值非常理想。

`var()` 函数使用未定义的 CSS 自定义属性的两个选项：

-   完全未定义且没有默认值，这意味着该属性可能具有未设置的行为，例如：`color: var(--color)`，其中 `--color` 在规则中未设置。
-   未定义但有一个回退值，以同时获得继承和确保默认值的好处，例如：`color: var(--color, blue)`。

比如下面这个示例：

```CSS
button {
    --color: blue;
​
    color: var(--color);
    border: 2px solid var(--border-color, var(--color));
}
​
button:hover {
    --border-color: red;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b0a9396ff354381ad6e1fc752321ee2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQeYPa>

在这个示例中，我们并没有显式声明 `--border-color` 这个自定义属性，但 `var()` 函数调用它的时候提供了一个回退值 `var(--color)`，这样一来，`--border-color` 同时获得继承和确保默认值的好处，同时也为组件提供了一个可选的 `--border-color` 值。

使用第一种选项时需要注意的是，你可能会期望它使用你样式表中已设置的元素的先前样式。然而，当计算自定义属性时，浏览器已经丢弃了先前设置的、非继承的值。

在这个示例中，如果未设置 `--color`，按钮的文本颜色（`color`）就会使用继承的颜色，颜色将从最近的祖先继承。而按钮的边框颜色在默认状态下会被浏览器解析为 `currentColor` ，但默认状态下按钮会没有边框，因为它被解析为 `0px none currentColor` ，而其悬浮状态（`:hover`）下 `--border-color` 的值为 `red` ，此时浏览器会将按钮边框解析为 `2px solid red` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96e1543dfabe41b98ad916a7357719c6~tplv-k3u1fbpfcp-zoom-1.image)

注意，这样的骚操作对于 Web 性能来说是昂贵的，按钮在悬浮状态下会产生重绘。

### var() 函数可以提供回退值

当 `var()` 函数引用了一个未定义的自定义属性时，可能会给开发者带来一定的困惑。为了避免这种现象，我们可以使用 `var()` 函数的第二个参数来作为其回退值。

```
var() = var( <custom-property-name> [, <declaration-value> ]? ) 
```

这样做的主要目的是，`var()` 函数引用了未定义或手误写错了自定义属性名称时，会有一个降级处理。例如：

```CSS
:root { 
    --primary-color: #0055fe; 
} 
​
.box { 
    background-color: var(--primy-color, #f36); 
} 
```

从代码中可以看得出来，`var()` 函数引用了一个没有定义的自定义属性，我们定义的是 `--primary-color` 属性，而实际引用的是 `--primy-color` 属性。在这个示例中，`--primy-color` 并不存在（未显式定义）。此时，`var()` 函数会将 `#f36` 作为回退值，你会看到元素 `.box` 的背景颜色会是 `#f36` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88bb149ec8b54454a710dff46ac4a98b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQdGoL>

在使用 `var()` 函数时，还可以嵌套 `var()` 函数，即在 `var()` 函数的第二个参数也是 `var()` 函数：

```CSS
.box { 
    background-color: var(--primary-color, var(--black, #f36)); 
} 
```

甚至还可以嵌套的更深：

```CSS
 .element {
     color: var(--foo, var(--bar, var(--baz, var(--are, var(--you, var(--crazy))))); 
 }
```

但在实际使用的时候并不推荐这样使用，因为层级嵌套的越深越容易出错，而且这样同时增加了代码维护的成本。

### 自定义属性的作用域

前面在介绍 CSS 自定义属性与 CSS 处理器的变量之间差异时，已经向大家介绍过，CSS 自定义属性的作用域也有全局和局部之分。通常的约定是，在 `:root` 或 `html` 选择器中声明的自定义属性是全局的，而在其他选择器中声明的自定义属性则称为局部的。

很多时候大家都会把 `:root` 和 `html` 等同起来，事实上并非如此，因为 `html` 的权重小于 `:root`，好比 `div` 元素标签的权重小于带有类名的 `div` 权重，比如：

```CSS
:root { 
    --color: red; 
} 
​
html { 
    --color: green; 
} 
​
.box { 
    --color: orange; 
} 
```

这样一来，其作用域是：

-   `.box` 中的 `--color` 会作用于类名为 `.box` 元素以及其所有后代元素
-   `html` 中的 `--color` 会作用于 `<html>` 元素以及其所有后代元素
-   `:root` 中的 `--color` 在 HTML 中会作用于 `<html>` 以及其所有后代元素，在 XML 中（比如 `svg`）则会作用于 `<svg>` 以及其所有后代元素

来看一个具体的示例，可能会更清晰一些：

```HTML
<div class="box">
    我带有一个名为 box 类
    <span>我是 .box 元素的后代元素</span>
    <span class="element">我也是 .box 元素的后代元素，但我有一个名为 element 的类 </span>
</div>
​
<div class="element">
    我带有一个名为 element 的类
    <span>我是 .element 元素的后代元素</span>
    <span class="box">我也是 .element 元素的后代元素，但我有一个名为 box 的类 </span>
</div>
```

```CSS
:root {
    --color: red;
}
​
html {
    --color: green;
}
​
.box {
    --color: orange;
}
​
.box {
    border-color: var(--color);
    color: var(--color);
}
​
.element {
    border-color: var(--color);
    color: var(--color);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78347326e6ad4c318278504c726ad4aa~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzRVqJB>

不难发现，`.box` 中定义的 `--color` 会运用于 `.box` 元素及其所有后代元素，而 `.element` 元素并没有显式定义自定义属性 `--color` ，它会根据 DOM 结构往上查询，查询其祖先元素是否显式定义了 `--color` 。在我们这个示例中，`html` 元素中定义的 `--color` 会运用于 `.element` 元素及其后代元素，只不过 `.element` 元素中的 `.box` 有自已定义的 `--color` 而且，不会使用 `html` 中的 `--color` 。

因此，如果你要声明一个全局作用域的 CSS 的自定义属性，最佳方式是在 `:root` 或 `html` 选择器内声明。这也将引出一个问题：“为什么我们要在 `:root` 或 `html` 上定义全局自定义属性，而不是在 `body` 上定义呢？”

这是个很好的问题：似乎大家都习惯于在 `:root` 选择器上定义全局自定义属性（也称为 CSS 变量），并且并没有再多考虑。但为什么选择 `:root` 呢？答案是，并没有真正理由，这只是一种惯例。将自定义属性定义在 `:root` 选择器上可能会使它们看起来更像是全局变量，因为 `:root` 相当于文档的根元素。在 HTML 中，根元素就是 `<html>` 元素。在 SVG 中，根元素就是 `<svg>` 元素。也就是说，如果你希望将相同的自定义属性应用于不同类型的文档，比如 HTML 文档或 SVG 文档，那么 `:root` 来定义全局自定义属性更有益处，否则它并不会带来其他的好处，也没有实际的技术优势。换句话说，如果你的 CSS 自定义属性仅服务于 HTML 文档，那么在 `:root` 、`html` 和 `body` 声明的都将是全局 CSS 自定义属性，它们的工作方式完全相同。

当然，如果你想使用 JavaScript 来操作 CSS 自定义属性，那么还是需要用稍微不同的方式来编码。如果你想通过文档根元素来访问它们，可以这样操作：

```JavaScript
getComputedStyle(document.documentElement).getPropertyValue("–color")；
```

但如果你想获取或设置它们的值，你需要使用 `body` 元素来操作：

```JavaScript
getComputedStyle(document.body).getPropertyValue("–color")
```

不过这只是个人偏好的问题。

另外，了解到 `:root` 选择器的权重比 `html` 选择器高可能会有趣，但在实践中并没有什么区别。只不过，使用 `:root` 作为最外层元素似乎是更合理的一种选择。如果从继承机制角度来看，使用 `:root` 并不总是能够确保自定义属性被所有元素继承。例如，它目前无法用于 `::backdrop` 和 `::selection` 等伪元素。在这两种情况下，尝试使用在 `:root` 上定义的自定义属性将毫无结果。[CSS 工作组正在讨论解决这个问题的方法](https://github.com/w3c/csswg-drafts/issues/6641)。但这绝对是许多人可能没有意识到的问题。

尽管在继承上存在一定的不一致性，尽管我们也可以在 `<body>` 上定义，但使用 `:root` 选择器来定义全局自定义属性已成为一种常见做法。但对我而言，真正有趣的是，通过使用这种约定，我们在使用自定义属性的方式上似乎变得有些自满。因为在 `:root` 上定义大部分或所有自定义属性也可能成为一个问题。例如，你只在一个地方来定义所有的自定义属性，你可能在一个地方管理所有 CSS 的自定义属性，但你也会失去很多灵活性。例如，在构建组件时，我们应该将运用于组件的 CSS 自定义属性在组件的最外层容器中定义，以便你可以轻松地添加或删除自定义属性，而且还不会影响其周围的全局代码，甚至不会破坏系统的其他部分。全局定义的局部属性将使这变得更加困难。所以说，我们没有理由在 `:root` 中定义实际上属于单个组件的局部自定义属性。

当涉及到自定义属性的深度时，即多少属性继承或包含其他属性的值，我们仍然没有充分利用自定义属性的潜力。或者换句话说，我们并不经常在自定义属性中嵌套使用其他自定义属性。其中一个原因可能是我们仍然将 CSS 自定义属性视作为常量。我们通常将它们用作固定值的替代，只需在一个中心位置定义即可，这通常是 `:root`。然而，要理解自定义属性能够做到更多，并改变这种习惯，是发掘其全部潜力的关键。

比如，你可以在本地使用自定义属性，它们基本上就像是基于全局变量的私有变量。听起来复杂吗？想象一下一个简单的按钮组件，其中背景颜色存储在全局自定义属性中：

```CSS
/* tokens.css */
:root {
    --color: hsl(160 100% 75%);
}
​
/* button.css */
button {
    background-color: var(--color);
}
```

这通常情况下能很好地工作，并且该颜色值也能很好地继承到按钮组件中。这在设计系统（或模块化网站）中正是你想要的。然而，为自定义属性提供回退值是一个很好的做法，这样即使没有定义 `--color` 属性，组件仍然能够正常工作。通过一个本地自定义属性，它基于全局属性，但已经包含了回退值，你可以保持从组件外部操纵颜色的灵活性。同时，你也使实现更加健壮：

```CSS
/* tokens.css */
:root {
    --color: hsl(160 100% 75%);
}
​
/* button.css */
button {
    --_color: var(--color, black)
    background-color: var(--_color);
}
```

如果我们在一个提供 `--color` 的系统中使用按钮组件，按钮的背景颜色将是我们定义的颜色。如果没有提供 `--color`，组件仍然能够正常工作并使用回退颜色黑色。在组件内部，我们可以使用本地自定义属性（以下划线开头，这也是一种约定）来定义悬停样式、边框、阴影等。此外，我们仍然可以从组件外部操纵或设置 `--color` 变量，而不会破坏组件。下图可以很好的说明这一点：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4ebb77192544920acd63bda06a8fefd~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
/* 全局的自定义属性 */ 
:root { 
    --primary-color: #235ad1; 
    --unit: 1rem; 
} 
​
/* 运用了全局定义的自定义属性 */ 
.section-title { 
    color: var(--primary-color); 
    margin-bottom: var(--unit); 
} 
​
/* 自定义了局部变量，将覆盖全局定义的自定义属性 */ 
.featured-authors .section-title { 
    --primary-color: #d16823; 
} 
​
/* 自定义了局部变量，将覆盖全局定义的自定义属性 */ 
.latest-articles .section-title { 
    --primary-color: #d12374; 
    --unit: 2rem; 
}
```

### 循环依赖的 CSS 自定义属性是无效的

CSS 是一门声明性的语言，元素的样式规则没有顺序的概念，相同的属性出现在同一个选择器块内，后者会覆盖前者。例如：

```CSS
:root { 
    --size: 10px; 
    --size: var(--size); 
} 
​
body { 
    font-size: var(--size, 2rem); 
} 
```

示例代码中的 `--size` 在同一个选择器内出现了两次，按照 CSS 规则特性来说，上面代码中的 `--size: var(--size)` 将会覆盖前面出现的 `--size: 10px` 。而且第二个 `--size` 自定义属性有一个明显的特征，它的值依赖了自身，即 `var()` 函数引用的是自身，该值是无效的。`body` 的 `font-size` 引用的是 `--size` 是个无效值，但 `var()` 会采用其第二个参数 `2rem` 作为备用值。因此，`body` 现在的 `font-size` 的值是 `2rem` 。

### 有效的自定义属性值

自定义属性在接受值时非常宽容。以下是一些基本示例，你可以预期它们有效。

```CSS
:root {
    --brand-color: #990000;
    --transparent-black: rgba(0, 0, 0, 0.5);
  
    --spacing: 0.66rem;
    --max-reading-length: 70ch;
    --brandAngle: 22deg;
​
    --visibility: hidden;
    --my-name: "w3cplus";
}
```

现在看到了吗？它们可以是十六进制值、颜色函数、各种单位，甚至可以是文本字符串。

不过，自定义属性并不必像那样是完整的值。让我们看看将有效的 CSS 值拆分为可以放入自定义属性的部分的用法有多方便。

让我们想象一下，你正在使用一个颜色函数，比如 `rgb()`。其中的每个颜色通道值都可以是自定义属性。这打开了很多可能性，比如针对特定用例更改 Alpha 值，或者创建颜色主题。

以 HSL 颜色为例，我们可以将其拆分为各个部分，然后很容易地调整我们想要的部分。也许我们正在处理按钮的背景颜色。当鼠标悬停在按钮上时，我们可以更新其 HSL 构成的特定部分，在焦点状态下或禁用状态下，完全不需要在任何状态下声明背景。

```CSS
button {
    --h: 100;
    --s: 50%;
    --l: 50%;
    --a: 1;
    
    background-color: hsl(var(--h) var(--s) var(--l) / var(--a));
}
​
/* 悬浮状态下改变亮度值 */
button:hover {
    --l: 75%;    
}
​
/* 聚焦状态下改变饱和度 */
button:focus {
    --s: 75%;
}
​
/* 禁用状态改变饱和度和透明度 */
button[disabled] {
    --s: 0%;
    --a: .5;
}
```

通过拆分这样的值，我们可以以前无法做到的方式来控制它们的各个部分。看看我们在样式化按钮的悬停、焦点和禁用状态时，没有必要声明 HSL 参数的所有值。我们只需要在需要的地方覆盖特定的 HSL 值即可。非常酷！

熟悉 CSS 的同学应该知道，在 CSS 中有些属性是有子属性的，比如 `border-width` 、`boder-style` 等，但有些属性是没有子属性的，比如 `box-shadow` 属性。它是没有单独控制阴影的子属性。但是，我们可以将 `box-shadow` 属性的值分离出来，将其作为自定义属性来控制。例如：

```CSS
:root {
    --shadow-x: 0;
    --shadow-y: 0;
    --shadow-color: rgb(0 0 0);
    --shadow-blur: .2em;
    --shadow-spread: .12em;
}
​
button {
    box-shadow: 
        var(--shadow-x) 
        var(--shadow-y) 
        var(--shadow-blur) 
        var(--shadow-spread)
        var(--shadow-color);
}
​
button:hover {
    --shadow-y: .2em;
    --shadow-spread: .5em;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11fc2be7ef364624abf9e7bad4752ce2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQWzEK>

同样的，在 CSS 中并没有一个 `background-gradient-angle` （或类似的）属性，允许我们调整渐变的角度。不过，我们可以将渐变的角度使用 CSS 自定义属性来描述，这样你就可以像下面这样来调整渐变的角度：

```CSS
body {
    --angle: 180deg;
    background: linear-gradient(var(--angle), #09f, #5500fe);
}
​
body.sideways {
    --angle: 90deg;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c383002ecdcf410db998d2fda14d1ef1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYQmKdO>

CSS 中有些属性是支持逗号分隔列表，比如 `translate` 、`scale` 和 `background` （多背景）。我们没办法仅针对逗号分隔列表中的一个值进行更改。但有了 CSS 自定义属性之后，这一切就变得很简单。拿多背景为例：

```CSS
body {
    background-image:
        url('./images/angles-top-left.svg'),
        url('./images/angles-top-right.svg'),
        url('./images/angles-bottom-left.svg'),
        url('./images/angles-bottom-right.svg');
}
```

假设你想在媒体查询中仅删除或调整多背景中的一个，可以使用 CSS 自定义属性来完成，会灵活的多：

```CSS
body {
    --bg1: url(./images/angles-top-left.svg);
    --bg2: url(./images/angles-top-right.svg);
    --bg3: url(./images/angles-bottom-left.svg);
    --bg4: url(./images/angles-bottom-right.svg);
    --bg5: url(./images/bonus-background.svg);
    
    background-image:
        var(--bg1),
        var(--bg2),
        var(--bg3),
        var(--bg4);
}
​
@media only screen and (width > 1500px) {
    body {
        background-image: var(--bg1), var(--bg2), var(--bg3), var(--bg4), var(--bg5);
    }
}
```

CSS 很快就会支持单独的 `transform` 属性，比如 `translate` 、`rotate` 和 `scalc` 等，但我们可以通过自定义属性提前实现它。这个想法是先应用元素可能得到的所有 `transform`，然后根据需要分别控制它们：

```CSS
button {
    transform: var(--scale, scale(1)) var(--translate, translate(0));
}
​
button:active {
    --translate: translate(0, 2px);
}
​
button:hover {
    --scale: scale(.9);
}
```

有时候，将值的部分组合在一起并不完全如你所希望的那样。例如，你不能简单地将 `24` 和 `px` 粘在一起来获得 `24px`。不过，可以通过将原始数字乘以带有单位的数值来实现。

```CSS
body {
    --value: 24;
    --unit: px;
    
    /* 无效，行不通的 */
    font-size: var(--value) + var(--unit);
    
    /* 有效，可行的 */
    font-size: calc(var(--value) * 1px);
    
    --pixel_converter: 1px;
    font-size: calc(var(--value) * var(--pixel_converter));
}
```

### CSS 自定义属性的基本运算和延迟计算

当我们将自定义属性与数学运算相结合时，就会释放出更多的力量！

这种情况很常见：

```CSS
main {
    --spacing: 2rem;
}
​
.module {
    padding: var(--spacing);
}
​
.module--tight {
    padding: calc(var(--spacing) / 2);
}
```

我们还可以使用它来计算互补色的色调：

```CSS
html {
    --brand-hue: 320;
    --brand-color: hsl(var(--brand-hue) 50% 50%);
    --complement: hsl(calc(var(--brand-hue) + 180) 50% 50%);
}
```

`calc()` 甚至可以与多个自定义属性一起使用:

```CSS
.slider {
    width: calc(var(--number-of-boxes) * var(--width-of-box));
}
```

在没有 `calc()` 函数的情况下进行类似数学计算，可能看起来有点奇怪：

```CSS
body {
    /* 合法的，但实际上尚未执行计算 */
    --font-size: var(--base-font-size) * var(--modifier);
    
    /* 所以不会起作用 */
    font-size: var(--font-size);
}
```

关键是，只要将其放入 `calc()` 函数中，它就能正常工作：

```CSS
body {
    --base-font-size: 16px;
    --modifier: 2;
    --font-size: var(--base-font-size) * var(--modifier);
    
    /* calc() 在这里被延迟使用，这样就可以正常工作 */
    font-size: calc(var(--font-size));
}
```

如果你在变量上进行了大量的数学计算，并且在代码中看到 `calc()` 函数会分散注意力，这可能会很有用。

### CSS 自定义属性的逻辑运算

在 CSS 处理器中是有逻辑运算的功能，比如 `@if`、`@else`等特性可以帮助我们在代码中做一些条件判断的操作。不幸的是，CSS 目前还不具备这方面的原生特性，不过，我们可以借助 CSS 自定义属性的相关特性配合 `calc()` 函数来实现一个类似于 `if ... else` 这样的条件判断功能。假设有一个自定义属性 `--i`，当：

-   `--i` 的值为 `1` 时，表示真（即打开）
-   `--i` 的值为 `0` 时，表示假（即关闭）

来看一个小示例，我们有一个容器 `.box`，希望根据自定义属性 `--i` 的取值为 `0` 或 `1` 做条件判断：

-   当 `--i` 的值为 `1` 时，表示真，容器 `.box` 旋转 `30deg`
-   当 `--i` 的值为 `0` 时，表示假，容器 `.box` 不旋转

代码可能像下面这样：

```CSS
:root { 
    --i: 0; 
} 
​
.box { 
    /**  
     * 当 --i = 0 » calc(var(--i) * 30deg) = calc(0 * 30deg) = 0deg 
     * 当 --i = 1 » calc(var(--i) * 30deg) = calc(1 * 30deg) = 30deg 
     */
    transform: rotate(calc(1 - var(--i)) * 30deg)); 
} 
​
.box.rotate { 
    --i: 1; 
}
```

或者：

```
:root { 
    --i: 1; 
} 
​
.box { 
    /** 
     * 当 --i = 0 » calc((1 - var(--i)) * 30deg) = calc((1 - 0) * 30deg) = calc(1 * 30deg) = 30deg 
     * 当 --i = 0 » calc((1 - var(--i)) * 30deg) = calc((1 - 1) * 30deg) = calc(0 * 30deg) = 0deg 
     */
    transform: rotate(calc((1 - var(--i)) * 30deg));
} 
​
.box.rotate { 
    --i: 0; 
} 
```

整个效果如下图：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72c4bccd3b1747bd811d5adb8030818b~tplv-k3u1fbpfcp-zoom-1.image)

上面演示的是 `0` 和 `1` 之间的切换，其实还可以非零之间的切换，非零值之间的切换相对而言要更为复杂一些，这里就不做过多的阐述，如果感兴趣的话，可以阅读 @Ana 的两篇博文：

-   [DRY Switching with CSS Variables: The Difference of One Declaration](https://css-tricks.com/dry-switching-with-css-variables-the-difference-of-one-declaration/)
-   [DRY State Switching With CSS Variables: Fallbacks and Invalid Values](https://css-tricks.com/dry-state-switching-with-css-variables-fallbacks-and-invalid-values/)

### 有效使用 CSS 自定义属性的无效变量

CSS 自定义中有一个概念，被称为“无效变量”。[W3C 规范是这样描述 CSS 自定义属性的无效变量](https://w3.org/TR/css-variables-1/#invalid-variables)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f64a155ec1b040488700b1950cab1566~tplv-k3u1fbpfcp-zoom-1.image)

**当一个自定义属性的值是** **`initial`** **时，**`var()` **函数不能使用它进行替换。除非指定了一个有效的回退值，否则会使声明在计算值时无效** 。

也就是说，当一个自定义属性的值是一个保证无效的值时，`var()` 函数不能使用它进行替换。即一个声明包含一个引用了具有保证无效值的自定义属性的 `var()` 函数，或者它使用了一个有效的自定义属性，但在替换了它的 `var()` 函数之后，属性值是无效的，那么这个声明在计算值时可能是无效的。

当这种情况发生时，属性的计算值要么是属性的继承值，要么是它的初始值，分别取决于属性是否被继承，就像属性的值被指定为 `unset` 关键字一样。

其中原因是继承的标准属性将初始化处理为 `unset` ，除了行为是“从根开始未设置”。而且前面也说过：

> **级联值在计算值时间无效时就应该被扔掉** 。

比如下面这个示例：

```HTML
<div class="element">Element</div>
```

```CSS
.element { 
    --color: red; 
    background-color: var(--color, orange); 
 }
 
 .element:hover {
     --color: initial;
 }
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ca226bccce6497b8f3d10288cdd8690~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjeNbWO>

示例中 `.element` 在悬浮状态（`:hover`）设置了 `--color` 自定属性的值为 `initial` ，它是一个无效值，所以你看到悬浮状态会引用其备用值 `orange` 。我想，通过这个示例，你对 CSS 自定义属性中的无效值有更深的了解了吧。如果没有理解的话，可以记住这两点：

-   在同一作用域中，如果自定义属性的值是 `initial`，表示该自定义属性是一个保证无效值，那么它将会采用`var()` 回退值，如果 `var()` 未设置回退值，那么会根据属性的 `unset` 来设置值。
-   如果不在同一作用域中，当自定义属性值是保证无效值时，会类似 JavaScript 事件冒泡机制，向上寻找同名称的自定义属性，如果未找到，则会采用 `var()` 的回退值，要是未设置回退值，将会根据属性的 `unset` 取值；如果向上找到同名称的自定义属性，将会采用父（祖先）同名的自定义属性的值。

我们回过头来看 [@Lea Verou 提供的示例](https://lea.verou.me/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27d208a35de14d8ba0a8f75f6c343fe2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQdoJL>

关键代码：

```CSS
button { 
    --is-raised: ; /* off by default */ 
    border: 1px solid var(--is-raised, rgb(0 0 0 / 0.1)); 
    background: var( --is-raised, linear-gradient(hsl(0 0% 100% / 0.3), transparent) ) hsl(200 100% 50%); 
    box-shadow: var( --is-raised, 0 1px hsl(0 0% 100% / 0.8) inset, 0 0.1em 0.1em -0.1em rgb(0 0 0 / 0.2) ); 
    text-shadow: var(--is-raised, 0 -1px 1px rgb(0 0 0 / 0.3)); 
} 
​
button:hover { 
    --is-raised: initial; / turn on */ 
} 
```

根据前面介绍的，当 `--is-raised` 的值是个空字符串（` ` ）时，`--is-raised` 是个有效值，那么：

-   `border` 的值是 `1px solid ;`（`solid` 后面有一个空格符），`border-color` 的值为 `currentColor`；
-   `background` 的就是 `hsl(200 100% 50%);`（`hsl` 前面有一个空格符）；
-   `box-shadow` 和 `text-shadow` 的值是 ``（空格符），最终的值将是它们的初始值 `none` 。

`button` 在悬浮状态（ `:hover` ）时 `--is-raised` 的值是 `initial` ，这个时候 `--is-raised` 是一个保证无效值，对应的：

-   `border` 的值是 `1px solid rgb(0 0 0 / 0.1);` ，即 `--is-raised` 取了 `var()` 函数的回退值`rgb(0 0 0 / 0.1)` ；
-   `background` 的值是 `linear-gradient(hsl(0 0% 100% / 0.3), transparent) hsl(200 100% 50%)`，即 `--is-raised` 取了 `var()` 函数的回退值 `linear-gradient(hsl(0 0% 100% / 0.3), transparent)`；
-   `box-shadow` 的值是 `0 1px hsl(0 0% 100% / 0.8) inset, 0 0.1em 0.1em -0.1em rgb(0 0 0 / 0.2)`，即 `--is-raised` 取了 `var()` 函数的回退值 `0 1px hsl(0 0% 100% / 0.8) inset, 0 0.1em 0.1em -0.1em rgb(0 0 0 / 0.2)`；
-   `text-shadow` 的值是 `0 -1px 1px rgb(0 0 0 / 0.3)`，即 `--is-raised` 取了 `var()` 函数的回退值 `0 -1px 1px rgb(0 0 0 / 0.3)`。

实现了两种 UI 效果，在同一个属性上对两个值做了切换。虽然效果出来了，但 `--is-raised: ;` 和 `--is-raised: initial;` 不易于阅读和理解。而且 `--is-raised` 的值是从`` （空格符）到 `initial` 切换的状态（即开（`ON`)和关（`OFF`））切换，这样的话，可以将上面的 Demo 改成下面这样：

```CSS
:root { 
    --ON: initial; 
    --OFF: ; 
} 
​
button { 
    --is-raised: var(--OFF); 
    border: 1px solid var(--is-raised, rgb(0 0 0 / 0.1)); 
    background: var( --is-raised, linear-gradient(hsl(0 0% 100% / 0.3), transparent) ) hsl(200 100% 50%); 
    box-shadow: var( --is-raised, 0 1px hsl(0 0% 100% / 0.8) inset, 0 0.1em 0.1em -0.1em rgb(0 0 0 / 0.2) ); 
    text-shadow: var(--is-raised, 0 -1px 1px rgb(0 0 0 / 0.3)); } button:hover { --is-raised: var(--ON); 
} 
​
button:active { 
    box-shadow: var(--is-raised, 0 1px 0.2em black inset); 
} 
```

> Demo 地址：<https://codepen.io/airen/full/rNQmWmj>

使用这个功能特性，你可以在 CSS 中**只使用一个 CSS 声明做两种状态的切换，从而实现不同的效果，比如在宽屏幕上，奇数和偶数项不同的效果**：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e666bfd197541a580e22d3dd4548e54~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 集合：<https://codepen.io/collection/DjmdjQ/>（By [@Ana tudor](https://codepen.io/thebabydino)）

或者**收缩和扩展的动画效果**：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f269e782d2544ded87c5d968d081fb08~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQmWYm>

额外再提一点，CSS 自定义属性除了可以使 CSS 具备 `if ... else ...` 能力之外，还可以使 CSS 具备其他的一些逻辑运算能力，比如与（`and`）、或（`or`）、非（`not`）以及一些三角函数的能力，比如 `abs()`、`sign()`、`round()` 和 `mod()` 等。我们可以使用这些特性，构建一些超炫特酷的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e40175cea452421a88e0e28e73ad094a~tplv-k3u1fbpfcp-zoom-1.image)

这些知识已然超出本节课的范畴，如果你感兴趣的话，可以花一些时间阅读下面这些相关的教程：

-   [Logical Operations with CSS Variables](https://css-tricks.com/logical-operations-with-css-variables/)
-   [Using Absolute Value, Sign, Rounding and Modulo in CSS Today](https://css-tricks.com/using-absolute-value-sign-rounding-and-modulo-in-css-today/)
-   [条件 CSS 之 CSS 属性/值和 CSS 函数](https://juejin.cn/book/7199571709102391328/section/7217644982898720779)

### CSS 自定义属性有助于行为和样式的真正分离

CSS 和 JavaScript 同为 Web 的基石，其中 CSS 用来设计样式，JavaScript 来实现 Web 的交互行为。而 CSS 自定义属性的到来，更有助于行为和样式的真正分离。为了更易于大家理解，我们通过一个简单的示例来阐述，比如我们有一个径向渐变（`radial-gradient`）或圆锥渐变（`conic-gradient`），让渐变的中心点能跟着鼠标移动。在过去，我们需要在 JavaScript 中创建整个渐变，并在每次鼠标移动时创建渐变。而有了 CSS 自定义属性，JavaScript 只需要设置两个 CSS 自定义属性 `--mouse-x` 和 `--mouse-y`。

```CSS
:root { 
    --colors: red, yellow, lime, aqua, blue, magenta, red; 
    --mouse-x: 50%; 
    --mouse-y: 50%; 
} 
​
body { 
    width: 100vw; 
    height: 100vh; 
    background-image: conic-gradient( at var(--mouse-x) var(--mouse-y), var(--colors) ); 
}  
```

```JavaScript
const root = document.documentElement; 
​
document.addEventListener('mousemove', evt => { 
    let x = evt.clientX / innerWidth * 100 
    let y = evt.clientY / innerHeight * 100 
    
    root.style.setProperty('--mouse-x', `${x}%`) 
    root.style.setProperty('--mouse-y', `${y}%`) 
})
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/410fe4147671455d9edf1a7050830391~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYjozv>

### 与 !important 结合使用

你可以在变量之内或之外使用 `!important` 修饰符。

```CSS
.override-red {
    /* 这个有效 */
    --color: red !important;
    
    color: var(--color);
    
    /* 这也有效 */
    --border-color: red;
    
    border: 1px solid var(--border-color) !important;
}
```

将 `!important` 应用于 `--color` 自定义属性会使得难以覆盖 `--color` 自定义属性的值，但我们仍然可以通过更改 `color` 属性来忽略它。

在自定义属性值中使用 `!important` 的行为相当不寻常。[@Stefan Judis 进行了很好的文档记录](https://www.stefanjudis.com/today-i-learned/the-surprising-behavior-of-important-css-custom-properties/)，但主要思想是：

-   最终，将从自定义属性的值中去除 `!important`。
-   但是在确定哪个值在多个位置设置时获胜时会使用它。

```CSS
div {
    --color: red !important;
}
​
#id {
    --color: yellow;
}
```

如果这两个选择器都应用于一个元素，你可能会认为由于更高的权重，`#id` 的值将获胜，但实际上红色会获胜，因为有 `!important`，但最终应用时不包含 `!important`。这有点难以理解。

如果将 `!important` 应用于自定义属性之外，例如上面第二个示例中的代码块，我们的 `--border-color` 自定义属性保持低权重（容易被覆盖），但难以改变该值如何应用于边框本身，因为整个声明保留了 `!important`。

## 浏览器开发者工具中更好的使用 CSS 自定义属性

在未来我们可以使用浏览器开发者的一些技巧，让我们更容易地使用 CSS 自定义属性。

### 查看颜色值

当你使用 CSS 自定义属性时，看到颜色和背景颜色值的可视化指示器是不是很有用，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57db25bed84e4954a08ead55b33477e3~tplv-k3u1fbpfcp-zoom-1.image)

### 计算值

在一些浏览器开发者工具中，开发者将鼠标悬浮或点击 CSS 自定义属性时，可以查看 CSS 自定义属性计算值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fe955c4f0fc4650919dc112ea36a1ee~tplv-k3u1fbpfcp-zoom-1.image)

### CSS 自定义属性自动完成

在开发项目时，可能会在项目中同时注册很多个 CSS 自定义属性，开发者一时可能很难记住这些已注册的 CSS 自定义属性，这样会阻碍开发者在 `var()` 中引用已注册的 CSS 自定义属性，甚至还有可能会引用未定义或无效的 CSS 自定义属性。 我们同样可以借助浏览器开发者调试器，浏览器在输入 `--` 符号时，会自动弹出 CSS 自定义属性列表，开发者可以快速定位到自己需要使用的 CSS 自定义属性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baf251456da44679a192dc7b3f153704~tplv-k3u1fbpfcp-zoom-1.image)

### 禁用 CSS 自定义属性

当你需要禁用某个 CSS 自定义属性时，可以通过取消选中它所定义的元素来实现：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5186266a3a7c4522be6d8dcf8eec3118~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

CSS 自定义属性是 CSS 的一个强大特性，用于创建可重用的样式规则。它们允许我们定义自己的属性，并在整个样式表中使用它们。我们可以通过声明变量，使用 `var()` 函数来引用这些变量。

通过使用自定义属性，我们可以轻松地调整样式的值，从而实现可维护性和灵活性。我们可以为颜色、尺寸、间距等常见的值定义自定义属性，并在元素中使用它们。

自定义属性可以与其他 CSS 功能相结合，例如伪类、媒体查询和 `transform`，从而极大地增强了其灵活性和功能。

使用 `calc()` 函数，我们可以在自定义属性中进行数学计算，为样式提供更多动态性和复杂性。

另一个强大的特性是我们可以在自定义属性中使用 `!important` 来调整样式的特异性。例如，在自定义属性中应用 `!important`，可以保护样式不被覆盖。

通过延迟使用 `calc()` 函数或使用 `!important` 修饰符，我们可以提高代码的可读性，并使其更易于维护。

综上所述，CSS 自定义属性为我们提供了更加灵活和可维护的样式规则，使我们能够轻松地调整样式的值以及实现动态和复杂的样式效果。这是一个强大的工具，值得在 CSS 开发中广泛应用。