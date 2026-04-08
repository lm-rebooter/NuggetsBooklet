嵌套是 CSS 处理器（例如 Sass）的核心功能之一，每一位 Web 开发者都希望 CSS 中能有嵌套的功能。因为它可以节省 Web 开发人员一遍又一遍地编写相同选择器的时间。它可以使 CSS 代码更清晰，更容易理解和更易于维护。现在，你现在可以不再依赖 CSS 处理器，直接在 CSS 中使用嵌套的功能。

CSS 除了增加了嵌套的功能之外，还增加了 CSS 作用域的功能。可以说，CSS 作用域的功能就像 CSS 的嵌套功能一样，是 Web 开发者一直期待的功能之一。它可以允许你更好的操作 CSS 的级联，也可以根据 DOM 中的接近程度覆盖另一组样式。可以说，它的出现能更好的帮助你管理 CSS 级联，避免样式的冲突。

在这节课中，我们主要一起来探讨 CSS 的嵌套和作用域功能。

## CSS 的嵌套

我们先从 CSS 的嵌套开始吧！

还没有嵌套功能之间，Web 开发者不得一遍又一遍地编写相同的选择器。这就导致了代码的重复，样式表的臃肿和代码分散等。例如：

```CSS
.foo {
    color: hotpink;
}
​
.foo > .bar {
    color: rebeccapurple;
}
​
.foo .bar .baz {
    color: deeppink;
}
```

如果你正在使用像 Sass 这样的 CSS 处理器，你可能会使用它的嵌套功能，将上面代码改成下面这样：

```SCSS
/* 使用 Sass 的嵌套功能 */
.foo {
    color: hotpink;
    
    > .bar {
        color: rebeccapurple;
    }
    
    .bar {
        .baz {
            color: deeppink;
        }
    }
}
```

现在，你可以直接在 CSS 中像 Sass 那样使用嵌套的功能：

```CSS
/* CSS 的嵌套功能 */
.foo {
    color: hotpink;
    
    > .bar {
        color: rebeccapurple;
    }
    
    .bar {
        .baz {
            color: deeppink;
        }
    }
}
```

正如上面代码所示，嵌套可以帮助 Web 开发人员减少编写重复的选择器，同时还可以将与之相关的样式规则分组在其中。它还可以帮助样式匹配它们的目标 HTML。如果从项目中删除示例中的 `.foo` 代码块，则可以删除整个组，而不是在文件中搜索相关的选择器实例。

简单地说，CSS 嵌套可以帮助 Web 开发者：

-   更好组织 CSS 代码
-   减少 CSS 文件大小
-   更好重构 CSS

### 开始使用 CSS 的嵌套

接下来，我们通过具体的实例来向大家展示 CSS 嵌套的使用。基于下面这个 HTML 结构，通过选择各种形状、大小和颜色，你可以快速掌握 CSS 嵌套语法规则，并且视觉化展示嵌套所起的作用。

```HTML
<div class="demo">
    <div class="lg triangle pink"></div>
    <div class="sm triangle pink"></div>
    <div class="sm triangle purple"></div>
    <div class="sm triangle blue"></div>
    <div class="triangle blue"></div>
   
    
    <div class="sm square pink"></div>
    <div class="sm square blue"></div>
    <div class="sm square purple"></div>
    <div class="sm square pink"></div>
    <div class="sm square pink"></div>
    <div class="sm square purple"></div>
    <div class="sm square pink"></div>
    <div class="sm square purple"></div>
    <div class="square blue"></div>
    <div class="square purple"></div>
    <div class="square pink"></div>
    
  
    
    <div class="sm circle blue"></div>
    <div class="sm circle pink"></div>
    <div class="sm circle blue"></div>
    <div class="sm circle pink"></div>
    <div class="sm circle blue"></div>
    <div class="sm circle blue"></div> 
    <div class="circle pink"></div>
    <div class="lg circle purple"></div>
</div>
```

示例初始化样式：

```CSS
@layer reset, base, demo, nesting;
​
@layer nesting {
    /* CSS 嵌套示例 */
}
​
@layer demo {
    .demo {
        --size: 5rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
        grid-auto-rows: 5rem;
        place-items: center;
        gap: 1rem;
        max-inline-size: 60ch;
    }
  
    .demo > * {
        transition: all .5s cubic-bezier(.25,0,.2,1);
    }
}
​
@layer demo.shapes {
    .square {
        background: var(--color);
        aspect-ratio: 1;
        inline-size: var(--size);
    } 
  
    .circle {
        background: var(--color);
        aspect-ratio: 1;
        border-radius: 50%;
        inline-size: var(--size);
    } 
  
    .triangle {
        aspect-ratio: 1; 
        border-inline: calc(var(--size) / 2) solid transparent;
        border-block-end: calc(var(--size) / 1.25) solid var(--color);
    } 
}
​
@layer demo.sizes {
    .sm { 
        --size: 1.75rem 
    }
  
    .lg { 
        --size: 20rem; 
        z-index: -1; 
    }
}
​
@layer demo.colors {
    .blue { 
        --color: cyan; 
    } 
  
    .pink { 
        --color: magenta; 
    } 
    
    .purple { 
        --color: rebeccapurple; 
    } 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1ca19c3cdc448daab50cd7102d8dc78~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQRBqK>

接下来，我们基于上面这个示例，开始使用 CSS 的嵌套来改变图形样式规则。

#### 选择所有圆形

在还没有 CSS 嵌套之前，我们可以像下面这样来选中所有圆形：

```CSS
.demo .circle {
    border: 2px solid #000;
    opacity: .25;
    filter: blur(2px);
}
```

要是使用 CSS 嵌套，我们可以这样编写 CSS，同样可以选中所有圆形：

```CSS
.demo {
    .circle {
        border: 2px solid #000;
        opacity: .25;
        filter: blur(2px);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b64ba56a4b9413391fbfe54ebb1aa4c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQJgdm>

除此之外，还可以使用第二种方式：

```CSS
.demo {
    & .circle {
        border: 2px solid #000;
        opacity: .25;
        filter: blur(2px);
    }
}
```

代码中的 `&` 符号被称为“**嵌套选择器**”，表示你可以从父规则中引用选择器。

`&` 符号在 CSS 的嵌套中非常有用。假设你有一段未嵌套的 CSS 代码：

```CSS
ul {
    padding-left: 1em;
}
.component ul {
    padding-left: 0;
}
```

示例中的 `.component ul` 选择器表示的是选中 `.component` 中的所有 `ul` 。就该示例而言，如果我们使用 CSS 的嵌套，可以这样写：

```CSS
ul {
    padding-left: 1em;
    
    .component & {
        padding-left: 0;
    }
} 
```

再一次， `&` 给了你一种方式来说明“这就是我想要嵌套选择器的位置”。

当你不希望选择器之间有空格时，`&` 也很方便。例如：

```CSS
a {
    color: blue;
    
    &::before {
        content:"👈🏻"；
    }
    
    &::after {
        content:"👉🏻";
    }
    
    &:hover {
        color: lightblue;
    }
}
```

上在代码等同于：

```CSS
a {
    color: blue;
}
​
a::before {
    content:"👈🏻"；
}
​
a::after {
    content:"👉🏻";
}
​
a:hover {
    color: lightblue;
}
```

但要是没有 `&` 符号，`a` 和 `:hover` 、`::before` 和 `::after` 之间会有一个空格：

```CSS
/* 无效 CSS */
a :hover { /* 注意 a 和 :hover 之间有一个空格 */
    color: lightblue;
}
​
a ::before { /* 注意 a 和 ::before 之间有一个空格 */
    content:"👈🏻"；
}
​
a ::after { /* 注意 a 和 ::after 之间有一个空格 */
    content:"👉🏻";
}
```

另外，在以下样式规则中：

```CSS
.foo,
.foo::before,
.foo::after {
    color: red;
    
    &:hover {
        color: blue;
    }
}
```

代码中的 `&` 符号只会与 `.foo` 选择器匹配。换句话说，上面的代码相当于：

```CSS
.foo,
.foo::before,
.foo::after {
    color: red;
}

.foo:hover {
    color: blue;
}
```

但是，如果有这些未嵌套的 CSS 代码呢？

```CSS
ul {
    padding-left: 1em;
}

article ul {
    padding-left: 0;
}
```

你不希望像这样编写 CSS 嵌套代码：

```CSS
ul {
    padding-left: 1em;
    
    & article & {
        padding-left: 0;
    }
}
```

为什么不呢？因为它等同于：

```CSS
ul {
    padding-left: 1em;
}
​
ul article ul {
    padding-left: 0;
}
```

这并不是我们想要的。

`&` 符号在 CSS 中还可以单独使用。在单独使用的时候，相当于将样式合并到一个选择器中。例如：

```CSS
.foo {
    color: red;
    
    & {
        border: 1px solid green;
    }
}
```

上面的代码等同于：

```CSS
.foo {
    color: red;
}
​
.foo {
    border: 1px solid green;
}
```

也相当于：

```CSS
.foo {
    color: red;
    border: 1px solid green;
}
```

我们还可以在嵌套中使用双 `&` 符（即 `&&`），例如：

```CSS
.foo {
    color: red;
    
    && {
        border: 1px solid red;
    }
}
```

它等同于：

```CSS
.foo {
    color: red;
}
​
.foo.foo {
    border: 1px solid red;
}
```

只不过这样做有点愚蠢，甚至说它毫无意义。因为我们很少会在同一个元素上设置相同的类名，即：

```HTML
<div class="foo foo">Foo</div>
```

连字符 `&` 同样也可以运用于 CSS 处理器（例如 Sass）中的嵌套，它允许 Web 开发者构建一个简单的选择器。比如，使用 `&` 与 BEM 命名模式一起使用，来减少文件中的重复使用。例如：

```SCSS
// SCSS 与 BEM 一起使用 
.card {
    color: red;
    
    &__title {
        color: green;
    }
}
​
// 等同于
.card {
    color: red;
}
​
.card__title {
    color: green;
}
```

不幸的是，要是你在 CSS 嵌套中这样使用，它的结果和你预期的有所不同。例如：

```CSS
/* CSS 嵌套*/
.card {
    color: red;
    
    &__title {
        color: green;
    }
}
```

它等同于：

```CSS
.card {
    color: red;
}
__title.card {
    color: green;
}
```

其中 `__title.card` 是一个无效的 CSS 选择器。

#### 同时选择所有正方形和三角形

我们暂时搁置 `&` 连字符在嵌套中的使用，回到最初的图形示例中来。假设我们同时要选择所有正方形和三角形。就该任务而言，如果不使用 CSS 嵌套，我们可以使用组合选择器来达到目的：

```CSS
.demo .square,
.demo .triangle {
    opacity: .25;
    filter: blur(2px);
}
```

或者[使用 :is() 选择器](https://juejin.cn/book/7223230325122400288/section/7226251495069450278)来优化上面的代码：

```CSS
.demo :is(.square, .triangle) {
    opacity: .25;
    filter: blur(2px);
}
```

我们可以使用不同的嵌套方式来改造上面的代码：

```CSS
.demo {
    & .triangle,
    & .square {
        opacity: .25;
        filter: blur(2px);
    }
}
```

或者：

```CSS
.demo {
    .triangle, .square {
        opacity: .25;
        filter: blur(2px);
    }
}
```

或者：

```CSS
.demo {
    :is(.triangle,.square) {
        opacity: .25;
        filter: blur(2px);
    } 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/958efca338b94b82997c5e5631fc6df5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQJjVE>

在 CSS 中，任何选择器都可以使用 `:is()` 伪类选择器来包裹，并保持相同的权重（当它是括号内唯一的选择器时）。在 `:is()` 选择器中放入一个元素选择器，就会得到一个以 CSS 嵌套的符号开头的选择器。

前面我们有一个示例，使用 `&` 符号并不能达到我们所预期的效果。例如，我们期望的是下面这样的效果：

```CSS
ul {
    padding-left: 1em;
}
​
article ul {
    padding-left: 0;
}
```

如果我们像下面这样使用 `&` 连字符，它是一个无效的嵌套规则：

```CSS
/* 无效的嵌套规则 */
ul {
    padding-left: 1em;
    
    article & {
        padding-left: 0;
    }
}
```

这是 CSS 嵌套规则所决定的，具本原因稍后阐述。

就该示例而言，我们在 `article` 选择器使用 `&` 符也将不能达到预期：

```CSS
ul {
    padding-left: 1em;
    
    & article & {
        padding-left: 0;
    }
}
​
/* 等同于 */
ul {
    padding-left: 1em;
}
​
ul article ul {
    padding-left: 0;
}
```

这个时候，我们使用 `:is()` 选择器来包裹 `article` 选择器就可以达到预期的效果：

```CSS
ul {
    padding-left: 1em;
    
    :is(article) & {
        padding-left: 0; 
    }
}
​
/* 等同于 */
ul {
    padding-left: 1em;
}
​
article ul {
    padding-left: 0;
}
```

#### 选择大的三角形和圆形

我们可以使用 CSS 的复合选择器来选择大的三角形和圆形：

```CSS
.demo .lg.triangle,
.demo .lg.square {
    opacity: .25;
    filter: blur(2px);
}
​
/* 或者 */
.demo .lg:is(.triangle, .circle) {
    opacity: .25;
    filter: blur(2px);
}
```

要使该选择器生效，那么元素必须同时具有两个类才能被选择，例如：

```HTML
<div class="demo">
    <div class="triangle"><!-- 未选中，缺少 lg 类名 -->
    <div class="lg"><!-- 未选中，缺少 triangle 类名 -->
    <div class="lg triangle"><!-- 选中，同时具有 lg 和 triangle 两个类名 --></div>
</div>
```

我们可以使用 CSS 嵌套，将上面代码改成下面这样：

```CSS
.demo {
    .lg.triangle,
    .lg.circle {
        opacity: .25;
        filter: blur(25px);
    }
}
​
/* 或者 */
.demo {
    .lg {
        &.triangle,
        &.circle {
            opacity: .25;
            filter: blur(25px);
        }
    }
}
​
/* 或者 */
.demo {
    .lg {
        :is(&.triangle, &.circle) {
            opacity: .25;
            filter: blur(2px);
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe33bfb632d543c7af1d7b09bdfb0302~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQbJqK>

在这个示例中，`&` 符号很重要，如果没有 `&` 符号，CSS 的嵌套也是有效的，但最终的结果并不是你所预期的。这一点在前面有介绍过，在没有 `&` 符号时，它们对应的就不是复合选择器，而是后代选择器。例如：

```CSS
.demo {
    .lg {
        .triangle,
        .circle {
            opacity: .25;
            filter: blur(2px);
        }
    }
}
​
/* 等同于 */
.demo .lg .triangle,
.demo .lg .circle {
    opacity: .25;
    filter: blur(2px);
}
```

正如你所看到的，**没有** **`&`** **符号的嵌套类，总是会产生后代选择器**。

#### 选择除粉红色之外的所有图形

我们可以使用 [CSS 的 :not() 选择器](https://juejin.cn/book/7223230325122400288/section/7226251495276609569)来选中除 `.pink` 类之外的所有元素，这样就达到了我们的诉求，即除粉红色之外的所有图形：

```CSS
.demo :not(.pink) {
    opacity: .25;
    filter: blur(2px);
}
```

我们可以使用 CSS 的嵌套来修改上面的代码：

```CSS
.demo {
    :not(.pink) {
        opacity: .25;
        filter: blur(2px);
    }
}
​
/* 或者 */
.demo {
    & :not(.pink) {
        opacity: .25;
        filter: blur(2px);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2b0e18697e04745becf7676cd3ac1a7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYQvGyL>

注意，示例代码中 `&` 和 `:not()` 之间有一个空格，如果没有空格（即 `&:not()`），那么将会和 `.demo` 合成在一起，即 `.demo:not(.pink)` ：

```CSS
.demo {
    &:not(.pink) { /* & 和 :not() 之间没有任何空格 */
        opacity: .25;
        filter: blur(2px);
    }
}
​
/* 等同于 */
.demo:not(.pink) {
    opacity: .25;
    filter: blur(2px);
}
```

这对于嵌套伪类选择器和伪元素非常有用。例如：

```CSS
a {
    &:hover {
    
    }
    
    &:focus-visible {
    
    }
    
    &::before {
    
    }
    
    &::after {
    
    }
}
```

另外，`&` 还可以当作 `:not()` 选择器的参数，会将父选择器当作 `:not()` 选择器的参数，例如：

```CSS
.foo {
    color: red;
    
    :not(&) {
        color: blue;
    }
}
​
/* 等同于 */
.foo {
    color: red;
}
​
:not(.foo) {
    color: blue;
}
```

### CSS 的条件嵌套

CSS 的条件嵌套指的是 CSS 嵌套与 CSS 的 `@` 规则（例如 `@media` 、`@container` 、`@supports` 、`@layer` 和 `@scope` 等）组合。

我们构建响应式 Web 布局时，会使用 `@media` 根据视窗尺寸来调整页面布局，会使用 `@container` 根据查询容器尺寸来调整 Web 组件的布局或 UI。在还没有 CSS 嵌套功能之前，构建响应式 Web 布局的样式代码会因媒体查询或容器查询条件变得非常分散。这种干扰随着将条件嵌套在上下文中的能力而消失。

拿媒体查询为例，为了语法方便，如果嵌套的媒体查询只修改当前选择器上下文的样式，那么可以这样编写 CSS 的嵌套：

```CSS
.card {
    color: red;
    
    @media only screen and (width > 1024px) {
        color: blue;
    }
}
```

当然，你也可以显式地使用 `&` 符号：

```CSS
.card {
    color: red;
    
    @media only screen and (width > 1024px) {
        & {
            color: blue;
        }
    }
}
```

上面的代码等同于：

```CSS
.card {
    color: red;
}
​
@media only screen and (width > 1024px) {
    .card {
        color: blue;
    }
}
```

其他 `@` 规则的嵌套与 `@media` 是相似的，例如 [W3C 规范上所提供的一些示例](https://www.w3.org/TR/css-nesting-1/#conditionals)：

```CSS
/* 级联层的嵌套 */
@layer base {
    html {
        block-size: 100%;
​
        & body {
            min-block-size: 100%;
        }
    }
}
​
/* 等同于 */
@layer base {
    html {
        block-size: 100%;
    }
    
    html body {
        min-block-size: 100%;
    }
}
​
/* 作用域的嵌套 */
.card {
    inline-size: 40ch;
    aspect-ratio: 3/4;
    
    @scope (&) {
        :scope {
            border: 1px solid white;
        }
    }
}
​
/* 等同于 */
.card { 
    inline-size: 40ch; 
    aspect-ratio: 3/4; 
}  
​
@scope (.card) {    
    :scope { 
        border-block-end: 1px solid white; 
    }  
}
​
.parent {
    color: blue;
    
    @scope (& > .scope) to (& .limit) {
        & .content {
            color: red;
        }
    }
}
​
/* 等同于 */
.parent { 
    color: blue; 
}
​
@scope (.parent > .scope) to (.parent > .scope .limit) {
    .parent > .scope .content {
        color: red;
    }
}
```

除此之外，条件还可以进一步的嵌套，就是 `@` 规则中再嵌套 `@` 规则，例如：

```CSS
.foo {
    display: grid;
    
    @media (orientation: landscape) {
        grid-auto-flow: column;
        
        @media (min-width > 1024px) {
            max-inline-size: 1024px;
        }
    }
}
​
/* 等同于 */  
.foo { 
    display: grid; 
}  
​
@media (orientation: landscape) {    
    .foo {      
        grid-auto-flow: column;    
    }  
}  
​
@media (orientation: landscape) and (min-width > 1024px) {    
    .foo {      
        max-inline-size: 1024px;    
    }  
}
​
html {
    @layer base {
        block-size: 100%;
        
        @layer support {
            & body {
                min-block-size: 100%;
            }
        }
    }
}
​
/* 等同于 */  
@layer base {    
    html { 
        block-size: 100%; 
    }  
}  
​
@layer base.support {    
    html body { 
        min-block-size: 100%; 
    }  
}
```

### 理解 CSS 嵌套的解析器

接下来，我们来简单地了解一下 CSS 嵌套的解析器，这样我们就可以知道 CSS 解析器是如何处理嵌套的。有了这些知识，你就可以自信地使用 CSS 的嵌套，而不必经常查询相关的规则。

在介绍 CSS 嵌套的解析器之前，我们来看一个无效的 CSS 嵌套：

```CSS
main {
    color: red;
    
    article {
        color: blue;
    }
}
```

注意，上面示例中的 `article` 并没有生效。

造成这种现象，是 CSS 的嵌套规则决定的：“**CSS 的任何选择器都可以嵌套到另一个选择器中，但它必须以 `&` 、`.`（类名）、`#`（ID）、`@`（`@`规则）、`:`、`::`、`*`、`+`、`~`、`>` 或 `[`符号开头。** ” 这些符号是一些识别符号，它会向解析器发出信号，表示它正在使用嵌套样式。

换句话说，如果解析器找到的嵌套选择器并且没有以这些符号之一开始（比如，直接嵌套一个 HTML 元素选择器），那么嵌套就将失败，并错误地使用你的样式。

根据嵌套的规则，我们可以在元素选择器 `article` 前添加一个 `&` 符号来使嵌套生效：

```CSS
main {
    color: red;
    
    & article {
        color: blue;
    }
}
```

除此之外，我们还可以将元素选择器 `article` 当作 `:is()` 或 `:where()` 选择器的参数，使嵌套生效：

```CSS
main {
    color: red;
    
    :is(article) {
        color: blue;
    }
}
​
/* 或者 */
main {
    color: red;
    
    :where(article) {
        color: blue;
    }
}
```

## CSS 作用域：@scope

曾经 HTML 有一个 `scoped` 属性，但它被弃用了。它在 CSS 中被 `@scope` 所取代。这也是 Web 开发者一直期待的 CSS 功能之一，即 **CSS 作用域**。

CSS 作用域 `@scope` 主要有两个卖点：**基于接近度的样式**和**为选择器设置下限**。换句话说，作用域给 CSS 带来了两个关键的东西：

-   一组样式可以根据在 DOM 中的接近程度覆盖另一组样式
-   更多地控制选择器针对哪些元素（即更好地操作 CSS 的级联）

### 如何使用 CSS 的作用域

我们将围绕着 CSS 作用域的两个卖点来展开，告诉大家如何使用 CSS 的作用域，从而使得大家明白它的工作原理。先从“基于接近度的样式”开始。

#### 基于接近度的样式

熟悉 CSS 的同学都应该知道，在 CSS 中一直以来都是依赖于源的顺序和选择器权重来覆盖样式。现在，CSS 有了作用域的功能，我们还可以根据接近程度来覆盖样式，而不是仅仅依赖于源的顺序和选择器权重来覆盖样式。例如，我们现在有两段不同的 HTML 结构：

```HTML
<!-- 案例一 -->
<div class="red">    
    <div class="green">        
        <div class="blue">            
            <button>Click</button>        
        </div>    
    </div>
</div>
​
<!-- 案例二 -->
<div class="blue">    
    <div class="green">        
        <div class="red">            
            <button>Click</button>        
        </div>    
    </div>
</div>
```

案例一中的 `button` 离 `.blue` 更近，离 `.red` 更远；而案例二中的 `button` 却离 `.red` 更近，离 `.blue` 更远。

现在，假设你使用 `@scope` 写了下面这样的 CSS 代码：

```CSS
@scope (.blue) {    
    button {        
        background-color: blue;    
    }
}    
​
@scope (.green) {    
    button {      
        background-color: green;    
    }
}    
​
@scope (.red) {    
    button {      
        background-color: red;    
    }
}
```

你猜，案例一和案例二中的按钮（`button`）背景颜色分别是什么？只要看看按钮（`button`）离得最近的祖先元素就知道了。案例一中的 `button` 离 `.blue` 更近，离 `.red` 更远，所以按钮的背景颜色是蓝色（`blue`）；而案例二中的 `button` 却离 `.red` 更近，离 `.blue` 更远，所以按钮的背景颜色是红色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a67c38d076d1466a8fb5b92c54a2448a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dyQwdZo>（请使用 Chrome Canary 查看）

把上面示例的 HTML 结构稍微调整一下，例如，在每个 `div` 中都嵌套一个 `button` 元素：

```HTML
<!-- 案例一 -->
<div class="red">  
    <button>Button(外)</button>  
    <div class="green">  
        <button>Button(中)</button>      
        <div class="blue">            
            <button>Button(内)</button>        
        </div>    
    </div>
</div>
​
<!-- 案例二 -->
<div class="blue">   
    <button>Button(外)</button> 
    <div class="green">
        <button>Button(中)</button>        
        <div class="red">            
            <button>Button(内)</button>        
        </div>    
    </div>
</div>
```

在使用相同 CSS 样式代码情况之下，你能猜到示例中的每个按钮背景颜色？

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ed7a86e37424e55b0237fe19dbf1b00~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/Jjewpzd> （请使用 Chrome Canary 查看）

正如你所看到的，**距离优先，来自内部作用域的样式将覆盖来自外部作用域的样式**。这个示例所呈现的都是没有内部作用域限制，所有 `button` 选择器都针对内部的 `<button>` 元素。在这种情况下，内部作用域总是优先。

上面两个示例所呈现的是，多个作用域针对同一个元素时，你可以控制哪个优先。当然，你也可以调整选择器权重，让具有更高权重的选择器优先，而不管它属于哪个作用域。例如：

```CSS
@scope (.blue) {
    button {
        background-color: blue;
    }
}
​
@scope (.green) {
    /* 使用 :is() 选择器增加了选择器权重 */
    :is(button,#increase#specificity) {
        background-color: green;
    }
}
​
@scope (.red) {
    button {
        background-color: red;
    }
}
```

上面代码中，使用 `:is()` 选择器增加了 `button` 选择器权重。就该示例而言，最里面作用域是的 `button` 将会受到中间作用域中选择器权重的影响。最终，除了最外的 `button` 之外，其他的 `button` 背景颜色都变成了绿色（`green`）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c101a2892fc940139f2419f0dd48d3fc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMyWZv> （请使用 Chrome Canary 查看）

当你不想要这种行为时，你有一些方法可以用来防止它。你可以使用 [CSS 的级联层](https://juejin.cn/book/7223230325122400288/section/7259563116462080037)（`@layer`）来赋予一个组件优先于另一个组件。或者，你可以将内部作用域绑定到外部作用域，以防止这种情况发生。

我们来看一个真实的用例，即主题的切换。注意，这里主题切换不是根据用户偏好改变的亮色和暗色主题（Dark Mode），而是用特定的配色方案为页面提供不同的主题风格。这也是 Web 中常见的设计方式。例如，为了确保足够的颜色对比，便于用户阅读，链接（`<a>`）文本在浅色背景上的颜色为深蓝色，反之在深色背景上链接的颜色为浅蓝色。以往，Web 开发者会在页面最外部的容器上（例如 `<html>` 元素）添加类名来区分主题之间的差异。例如：

-   浅色主题时，`html` 元素添加一个 `theme-light` 的类名
-   深色主题时，`html` 元素添加一个 `theme-dark` 的类名

如此一来，我们就可以像下面这样编写 CSS：

```CSS
/* 浅色主题 */
@layer theme.light {
    .theme--light {  
        background-color: white;  
        color: black;  
     }
 
    .theme--light a {  
        color: #00528a;
    }
}
​
/* 暗色主题 */
@layer theme.dark {
    .theme--dark {  
        background-color: black;  
        color: white;
    }
​
    .theme--dark a {  
        color: #35adce;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a12bc19663e424da226df22b15648ca~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/Jjewvgw>

看上去是符合我们的预期，但有一个问题：DOM 结构的嵌套。CSS 不会去查看最近 HTML 祖先来应用哪一个样式，CSS 只会根据 CSS 样式表（CSS 文件）中的源顺序（出现的先后顺序）来决定应用哪一个样式。假设类名 `.theme--light` 和 `.theme--dark` 不是在 `html` 元素上设置，而是出现相互嵌套的现象，例如，`.theme--light` 中嵌套了 `.theme--dark` ，或者 `.theme--dark` 中嵌套了 `.theme--light` ，此时，链接的文本颜色就有可能不符合预期：

```HTML
<div class="theme--light">
    <a href="">链接颜色是深蓝色（符合预期）</a>
</div>
​
<div class="theme--dark">
    <a href="">链接颜色是浅蓝色（符合预期）</a>
    
    <div class="theme--light">
        <a href="">链接颜色是浅蓝色（不符合预期）</a>
    </div>
</div>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c3bac9333fd4920b6362e789a50f08b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjewZWq>

就上例这种现象而言，在 `@scope` 出现之前，确实没有解决这个问题的好方法。

也就是说，现在我们可以使用 `@scope` 来解决上面这个问题：

```CSS
@layer reset, base, theme, scope;
​
@layer scope {
    @scope (.theme--light) {
        a {
            color: #00528a;
        }
    }
​
    @scope (.theme--dark) {
        a {
            color: #35adce;
        }
    }
}
​
@layer theme.light {
    /* 浅色主题 */
    .theme--light {
        background-color: white;
        color: black;
    }
}
​
@layer theme.dark {
    /* 暗色主题 */
    .theme--dark {
        background-color: black;
        color: white;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ace5cb408ccf4d79a36451da73c9807f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYQvrzX> （请使用 Chrome Canary 查看）

现在，当链接在白色背景上时，它就会变成深蓝色（`#00528a`）；当它在黑色背景上时，它就会变成浅的蓝色（`#35adce`）。

在 CSS 中，我们还可以使用 `:scope` 伪类来引用当前作用域的根。比如，我们使用 `:scope` 来重写前面的 CSS：

```CSS
@layer scope {
    @scope (.theme--light) {
        :scope {/* 将选择任何具有 .theme--light 类的元素 */
            background-color: white;
            color: black;
        }
        
        a {
            color: #00528a;
        }
    }
​
    @scope (.theme--dark) {
        :scope {/* 将选择任何具有 .theme--dark 类的元素 */
            background-color: black;
            color: white;
        }
        
        a {
            color: #35adce;
        }
    }
}
```

注意，`:scope` 不是一个新的伪类选择器，它在浏览器中已经存在很多年了，但是以前在样式表中使用它毫无意义，因为在 `@scope` 规则之外，它的含义等同于 `:root` （选择文档的根元素，例如 `html` 元素）。

#### 为选择器设置下限

有时，你只是希望对组件进行样式设计，而不想对嵌套在组件中的某些东西进行样式设计。例如，有一个 `Accordion` 组件（手风琴组件） 放在 `Card` 组件（卡片组件）中，并且这两个组件都有一个命名为 `.title` 的类名。它的 HTML 结构看起来可能像这样：

```HTML
<div class="card">
    <h3 class="title">Card Title</h3>
    <div class="slot">
        <div class="accordion">
            <h3 class="title">Accordion Title</h3>
            <div class="slot">
                <!-- Accordion 组件内容 -->
            </div>
        </div>
    </div>
</div> 
```

在没有 CSS 作用域之前，直接使用 `.title` 选择器的话，将会同时修改卡片组件和手风琴组件的标题，这并不是我们想要的结果（我们只想修改卡片组件自身标题的样式）。

现在，使用 CSS 作用域可以很容易做到。简单地说，你可以在作用域上为选择器设置一个下限，或者说在作用域上设置一个内边界。例如：

```CSS
@scope (.card) to (.slot) {
    /* 作用域样式只针对 .card 内，但不在 .slot 内 */
    :scope {
        padding: 1rem;
        background-color: white;
    }
    
    .title {
        font-size: 1.2rem;
        font-family: Georgia, serif;
    }
}
```

把这里的 **`to`** 关键词想象成“直到”：这个作用域定义为从 `.card` 到 `.slot` 。现在，在这个作用域的任何选择器不会对卡片组件的 `.slot` 内元素中的任何内容起作用。

把上面的示例简化一下，例如：

```HTML
<div class="component">
    <p>在作用域内</p>
    <div class="content">
        <p>在作用域外</p>
    </div>
</div>
```

```CSS
@scope (.component) to (.content) {
    :scope {
        border: 1px dashed #fff;
        padding: 1rem;
    }
    
    p {
        color: #09f;
        padding-bottom: .2em;
        border-bottom: 3px double;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81e9d96a765a49f2a5e2cf8f6b77b874~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjewBvW> （请使用 Chrome Canary 查看）

正如你所看到的，该作用域中的 `p` 选择器并没有选中位于 `.content` 中的 `p` 元素。你也可以把示例中的 `.content` 想象成前面示例中的 `.slot` 。或者说，在一个组件中，可以有很多个插槽，用来嵌套其他的组件，例如：

```HTML
<div class="component">
    <p>Component</p>
    <div class="slot--1"><!-- 插槽一 --></div>
    <div class="slot--2"><!-- 插槽二 --></div>
    <!-- 其他插槽 -->
</div>
```

如果你想作用域的选择器同时对 `.slot--1` 和 `.slot--2` 不起作用的话，可以像下面这样使用 `@scope` ：

```CSS
@scope (.component) to (.slot--1, .slot--2) {
    p {
        color: red;
    }
}
```

这种方式的意思是 `@scope` 可以有任意多的“插槽”。

回到 `Card` 组件嵌套 `Accordion` 组件的示例中来：

```HTML
<div class="card">
    <h3 class="title">Card Title</h3>
    <div class="slot">
        <div class="accordion">
            <h3 class="title">Accordion Title</h3>
            <div class="slot">
                <!-- Accordion 组件内容 -->
            </div>
        </div>
    </div>
</div> 
```

假设你要给两个组件的标题运用不同的样式，那么你就可以嵌套两个作用域，并且每个作用域都可以使用相同的类名 `.title` 对标题样式化，还不会发生任何冲突。

```CSS
@scope (.card) to (.slot) {
    .title {
        font-size: 1.2rem;
        font-family: Georgia, serif;
    }
}
​
@scope (.accordion) to (.slot) {
    .title {
        font-family: Helvetica, sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.01em;
    }
}
```

事实上，你甚至可能不再需要类名了，可以直接使用标签元素，比如示例中的 `h3` ：

```CSS
@scope (.card) to (.slot) {
    h3 {
        font-size: 1.2rem;
        font-family: Georgia, serif;
    }
}
​
@scope (.accordion) to (.slot) {
    h3 {
        font-family: Helvetica, sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.01em;
    }
}
```

## 综合案例

最后，将以下面这个案例来结合这节课。在下面这个示例中，使用了 CSS 的级联层、嵌套和作用域三个主要功能来编写和管理 CSS 的代码。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bc702e132bb4ccb82bb11f026379f0f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQZdOZ> （请使用 Chrome Canary 查看）

先上 HTML 代码：

```HTML
<div class="card">
    <header>
        <h2>Epic title</h2>
        <p>Lorem ipsum dolor sit amet</p>
    </header>
    
    <figure class="responsive-image">
        <img height="640" width="640" src="https://assets.codepen.io/2585/uszetlo5l6591.webp" alt="cyberpunk raining day in tokyo with purple and cyan lights">
        <figcaption>
            <a href="#">Source</a>
        </figcaption>
    </figure>
    
    <article>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio asperiores voluptates officiis totam, est sequi iure libero rem nobis veniam consectetur commodi voluptatibus maxime labore cumque, dolore, quam eveniet magnam.</p>
    </article>
    
    <footer>
        <button>Like</button>
        <button>Share</button>
    </footer>
</div>
```

首先使用 [CSS 的 `@layer` 来管理 CSS 的级联层](https://juejin.cn/book/7223230325122400288/section/7259563116462080037)。

```CSS
@layer demo, images, cards;
​
@layer cards {
    /* CSS */
}
​
@layer images {
    /* CSS */
}
​
@layer demo {
    /* CSS */
}
```

其中 `@layer images` 主要是用来样式化卡片中图片的：

```CSS
@layer images {
    .responsive-image {
        max-inline-size: 50ch;
        aspect-ratio: 16/9;
    
        & img {
            max-inline-size: 100%;
            block-size: 100%;
            object-fit: cover;
            object-position: bottom;
        }
    
        & figcaption {
            text-align: center;
            padding-block: 1ch;
        }
    }
}
```

你可能已经发现了，上面的代码使用了嵌套来编写和管理 CSS 代码。

就我们这个示例而言，更多的样式是放在 `@layer cards` 级联层：

```CSS
@layer cards {
    @scope (.card) to (> header > *, > figure > *, > footer > *) {
        :scope {
            display: grid;
            background: oklch(50% none none / 20%);
            border-radius: 10px;
            border: 1px solid oklch(50% none none / 20%);
    
            @media (prefers-color-scheme: light) {
                background: white;
                box-shadow: 0 30px 10px -20px oklch(0% none none / 25%);
            }
    
            & header {
                display: grid;
                gap: 0.5ch;
                padding: 2ch;
            }
    
            & article {
                max-inline-size: 50ch;
                line-height: 1.5;
                padding: 2ch 2ch 1ch;
            }
    
            & footer {
                display: flex;
                justify-content: flex-end;
                padding: 1ch 2ch;
                gap: 1ch;
            }
        }
    }
​
    @scope (footer) {
        button {
            min-width: 110px;
            background-color: #e5e5e5;
            padding: 1rem 2rem;
            color: #c71e7e;
            display: flex;
            transition: all 0.2s ease-in-out;
            border: none;
            border-radius: 4px;
            box-shadow: 0 0 0.125em 0.0125em rgb(0 0 0 / 0.25);
            cursor: pointer;
          
            &:hover {
                color: #fff;
                background-color: #c71e7e;
            }
          
            &:focus-visible {
                box-shadow: 0 0 0.125em 0.0125em currentColor;
            }
          
            &:last-of-type {
                color: #286ED6;
            }
          
            &:last-of-type:hover {
                background-color:  #286ED6;
                color: #fff;
            }
        }
    }
}
```

在 `@layer cards` 级联层中，除了使用了 CSS 的嵌套之外，还使用了 CSS 作用域。在这里就不对代码做过多的阐述了。

## 小结

在这节课中，我们主要介绍了 CSS 的两个最新特性，而且这两个最新特性都是大家一直期待的。就 CSS 的嵌套来说，Web 开发者不会感到陌生，毕竟它和 CSS 处理器中的嵌套基本相似，唯一不同的是，CSS 的嵌套，**它必须以`&`、`.`（类名）、`#`（ID）、`@`（`@`规则）、`:`、`::`、`*`、`+`、`~`、`>`或`[`符号开头。** 否则，CSS 解析器将会视其无效。另外，在使用 CSS 的嵌套时，也和 CSS 处理器嵌套一样，最好不要超过三层。

CSS 的作用 `@scope` 可以更好让我们管理 CSS 的级联层，也能更好的帮助我们覆盖样式。

也就是说，到目前为止，现代 CSS 中，你至少可以使用级联层（`@layer` ）、嵌套和作用域（`@scope`）来编写和管理 CSS 代码。这些功能解决了 CSS 中最为头痛的两个问题，一个是权重，另一个是作用域。它们的组合除增强了 CSS 功能之外，还将改变 Web 开发者编写、管理和维护代码的方式。