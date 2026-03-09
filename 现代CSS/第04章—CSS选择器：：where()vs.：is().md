当人们在讨论 CSS 的复杂性时，编写有效的 CSS 选择器和选择器权重是避不开的话题。

你在编写 CSS 选择器时，添加的选器越多，它就越精准，但也就越具体，因此在以后需要覆盖样式时将变得更加困难。因此，这也是一把双刃剑，使得你编写好的 CSS 选择器变得尤其的困难：**你需要具体，但不要太具体**。这就是为什么 CSS 中有很多方法论的诞生，从 OOCSS 到 BEM，再到 Atomic CSS，它们的宗旨都是指导你如何编写一个好的 CSS 选择器。

近几年，CSS 选择器发展得很快，有很多新功能的 CSS 选择器诞生，比如前面所介绍的 `:has()` 和 `:not()` 选择器，以及 `:where()` 和 `:is()` 选择器。今天，我们就来介绍一下 CSS 的 `:where()` 和 `:is()` 选择器。

## :is()  和  :where() 是什么？

W3C 的 CSS 工作组，将 `:is()` 和 `:where()` 以及前面几节课所介绍的 `:has()` 和 `:not()` 选择器都被定义为**伪类函数**。`:where()` 和 `:is()` 选择器也可以像 `:has()` 与 `:not()` 选择器一样，用于选择多个简单选择器的集合，并将它们作为一个整体来进行选择，以简化和优化选择器的编写。

*   `:is()` 函数接受一个包含多个简单选择器的列表，它返回一个与其中任何一个简单选择器匹配的元素，类似于数组中的 `||`（逻辑或）。
*   `:where()` 函数也接受一个包含多个简单选择器的列表，但是它不会影响优先级，只是将选择器中的元素组合在一起，使其更易读、易用。

这两个伪类函数可以在选择器中互相嵌套，从而更容易选择包含某些选择器的元素，并减少选择器的复杂度。例如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d99124aaa1934925a1b65fe519aa66c5~tplv-k3u1fbpfcp-zoom-1.image)

任何 `:is()` 可以通过分组实现的事情，`:where()` 同样可以实现。这包括在选择器的任何位置使用、嵌套和层叠。这就是你所熟悉和喜爱的完整 CSS 灵活性。以下是一些示例：

```CSS
:where(h1,h2,h3,h4,h5,h6) > b {
    color: hotpink;
}

article :is(header,footer) > p {
    color: hotpink;
}

.dark--theme :where(button,a) {
    color: rebeccapurple;
}

:is(.dark--theme, .dim--theme) :where(button,a) {
    color: rebeccapurple;
}

:is(h1,h2):where(.hero,.subtitle) {
    text-transform: uppercase;
}

.hero:is(h1,h2,:is(.header,.boldest)) {
    font-weight: 700;
}
```

上述每个选择器示例都展示了这两个伪类函数的灵活性。

## 简单选择器 vs. 复合选择器

既然 `:is()` 和 `:where()` 两个伪类函数可以使你的选择器变得简单、易懂，那么我们来简单了解一下什么是简单选择器？

简单选择器是 CSS 选择器中最基本的选择器，指**只包含单个元素或元素属性的选择器**，如标签元素选择器（`p`）、类选择器（`.class`）、ID 选择器（`#id`）、属性选择器（`[data-range]`）或伪类（`:first-child`）等。例如：

```CSS
p.hover#22[chat~=active]:focus {
    outline: 2px solid hotpink;
}
```

简单选择器不包含任何复杂关系，可以独立使用或与其他简单选择器组合使用。简单选择器与 HTML 文档中的每个匹配元素一一对应，是选择器语法的基础。

既然有简单选择器，那么就会有复杂选择器（也称**复合选择器**）。在 CSS 中，复合选择器指的是 **由两个或多个简单选择器（包括伪类和伪元素）组合而成的选择器。** 简单地说，只要添加一个组合器，比如空格符（`a  b`）、`~` （`a ~ b`）或 `+` （`a + b`）或伪元素（如 `p::first-letter` 或 `div::before`），就会添加到另一个元素的关系中，它就变成了复合选择器。例如：

```CSS
div p {
    color: hotpink;
}
```

复合选择器通过组合多个简单选择器，可以更精确地选择 HTML 文档中的特定元素，从而更有效地调整样式和行为。复合选择器可以嵌套和组合，以增加选择器的准确度和复杂度。

因此，简单选择器和复合选择器之间的主要差异在于它们的构成和使用方法：简单选择器是最基本的选择器，只选择单个元素或元素属性，并且可以独立使用或与其他简单选择器组合使用；而复合选择器由多个简单选择器组合而成，可以根据需要嵌套和组合，以更精确地选择文档中的特定元素。

比如，以下是一些 `:is()` 伪类函数和简单和复合选择器相结合的例子，以帮助说明使用 `:is()` 的能力：

```CSS
article > :is(p,blockquote) {
    color: black;
}

:is(.dark--theme.hero > h1) {
    font-weight: bold;
}

article:is(.dark--theme:not(main .hero)) {
    font-size: 2rem;
}
```

## :is() 伪类函数的使用

> **特别声明， **`:where()`** 使用与** **`:is()`** **是完全相同的，接下来所介绍的** **`:is()`** **用法都可以用于** **`:where()`** **上**。

接下来，我们一起来看看，`:is()` 伪类函数是如何将复杂化的选择器变得简单易懂的。

首先， `:is()` 能使我们以更简单、简短的方式编写复合选择器。我们在编写 CSS 的时候，通常会使用一个列表选择器来选择具有相同样式的多个元素。例如：

```CSS
header a, 
main a, 
footer a {
    color: hotpink;
}

main p, 
main li, 
main a {
    font-size: 1rem;
}
```

可以使用 `:is()` 来简化上面代码中的选择器：

```CSS
:is(header, main, footer) a {
    color: hotpink;
}

main :is(p, li, a) {
    font-size: 1rem;
}
```

这将把更复杂的选择器简化为简单的选择器：

```CSS
header p, 
header a, 
header li, 
header blockquote,
main p, 
main a, 
main li, 
main blockquote,
section p, 
section a, 
section li, 
section blockquote,
footer p, 
footer a, 
footer li, 
footer blockquote {
    color: hotpink;
}

/* 使用 :is() 简化后 */

:is(header, main, section, footer) :is(p, a, li, blockquote) {
    color: hotpink;
}
```

我喜欢 `:is()` 选择器的另一个主要原因是，**它可以对选择器进行分组，让以前的组合选择器变得简约**。这也是我在应用非关键样式时不需要退步（备用）就能轻松使用的规则类型，比如：

```CSS
:is(h1, h2, h3) { 
    line-height: 1.2; 
} 

:is(h2, h3):not(:first-child) { 
    margin-top: 2em; 
} 
```

上面的代码相当于：

```CSS
h1, h2, h3 { 
    line-height: 1.2; 
} 

h2:not:(:first-child), 
h3:not:(:first-child) { 
    margin-top: 2em; 
} 
```

就上面的示例而言，对于不支持 `:is()` 的浏览器，从基本样式中继承更大的 `line-height` 或没有 `margin-top` 并不是一个很大的问题，仅仅是不理想。另一个不想使用 `:is()` 选择器的主要原因还是在一些关键样式的地方，比如布局中的 Grid 或 Flexbox，它们可以控制整个页面布局的样式，如果浏览器不支持，就很可能会造成页面的混乱。

抛开浏览器对 `:is()` 选择器的兼容性不说。就聊 `:is()` 的分组相关的事情。简单地说，**`:is()`** **可以做任何关于分组的事情**。这包括在任何地方、任何方式（比如，选择器的嵌套和堆叠），比如：

```CSS
article :is(header, footer) > p { 
    color: gray; 
} 

:is(.dark--theme, .dim--theme) :is(button, a) { 
    color: rebeccapurple; 
} 

:is(h1, h2):is(.hero, .subtitle) { 
    color: lime; 
} 

.hero:is(h1, h2, :is(.header, .boldest)) { 
    color: #09f; 
} 
```

一眼看上去，并不知道它们所代表的含义吧。事实上，如果不使用 `:is()` 选择器，上面的代码等同于下面这段代码：

```CSS
article header > p, 
article footer > p { 
    color: gray; 
} 

.dark--theme button, 
.dark--theme a, 
.dim--theme button, 
.dim--theme a { 
    color: rebeccapurple; 
} 

h1.hero, 
h1.subtitle, 
h2.hero, 
h2.subtitle { 
    color: lime; 
} 

h1.hero, 
h2.hero, 
.hero.header, 
.hero.boldest { 
    color: #09f; 
} 
```

从这一点来说，使用 `:is()` 还是有一定成本的，至少理解成本蛮大的。如果你要使用 `:is()` 选择器，那得想清楚或者找到可以从 `:is()` 中受益的地方，并不是说，一律使用 `:is()` 就是有益的。

换句话说，简单和复杂选择器与 `:is()` 的结合是不一样的。比如下面这几个简单和复杂选择器的例子，它可以说明这一点：

```CSS
p:is(article > *) { 
    color: #f36; 
} 

article > :is(p,blockquote) { 
    color: black; 
} 

:is(.dark--theme.hero > h1) { 
    color: lime; 
} 
```

上面的代码相当于：

```CSS
article > p { 
    color: #f36; 
} 

article > p, 
article > blockquote { 
    color: black; 
} 

.dark--theme.hero > h1{ 
    color: lime; 
}
```

从我自己体验来讲，虽然 `:is()` 能让我们简化选择器的使用，但还是不建议使用过于复杂的选择器组，这会让使用和阅读你代码的同学难以理解，甚至时间久了，自己都有可能无法理解其真正意图和作用。

`:is()` 选择器还可以根据父元素来过滤元素。这是一个很有意思的功能。由于 `:is()` 可以使用复合选择器，你可以添加祖先列表，然后使用通配符选择器 `*` 选择你需要的元素。这意味着，这两个选择器都针对同一个元素：

```CSS
a:is(nav *) {
    color: hotpink;
}

/* 等同于 */
nav a {
    color: hotpink;
}
```

简单地解释一下，选择器 `a:is(nav *)` 会告诉浏览器将查找与 `a` 和与 `nav *` 匹配的所有元素。该选择器中的 `:is()` 表示或（`||`）关系，即选择器 `a` 或 `nav *` 匹配的元素都会被选中。另外，通配符选择器 `*` 表示任何元素。所以，组合在一起的选择器 `a:is(nav *)` 就表示任何与 `a` 或 `nav` 元素配对的元素。最终结果是你实际上选择了 `nav a` ，这个 `a` 元素匹配了 `a` 和 `*` 。

另外，`:is()` 伪类函数也可以嵌套伪类，例如：

```CSS
:is(div:not(.button) nav) {
    color: hotpink;
}

/* 等同于 */
div:not(.button) nav {
    color: hotpink;
}
```

这个选择器选择的是：“没有类名 `.button` 的 `div` 元素内的所有 `nav` 元素”：

```HTML
<!-- 相匹配的 HTML 结构 -->
<div>
    <nav>Nav</nav>
</div>

<div class="header">
    <nav>Nav</nav>
</div>

<div>
    <header>
        <nav>Nav</nav>
    </header>
</div>

<!-- 不相匹配的 HTML 结构 -->
<div class="button">
    <nav>Nav</nav>
</div>

<header>
    <nav>Nav</nav>
</header>

<div class="button">
    <header>
        <nav>Nav</nav>
    </header>
</div>
```

上面所有示例所演示的只是 `:is()` 选择器最基础的使用，但它有几个重要的事实，即 `:is()` 伪类函数中的列表参数有几个独特行为：

*   `:is()` 伪类函数的列表值中不能使用伪元素（至少到目前为止是这样）；
*   `:is()` 伪类函数的列表值是宽松的：如果列表中的选择器是无效的，规则将继续匹配有效的选择器；
*   `:is()` 选择器的权重是根据其列表来计算的。

## :is() 和 :where() 伪类函数的参数列表值不能是伪元素

[从 W3C 规范中可以得知，到目前为止，:is() 中的参数中不能包含伪元素](https://www.w3.org/TR/selectors-4/#matches)：

> Pseudo-elements cannot be represented by the matches-any pseudo-class; they are not valid within :is().

就拿表单中的 `<input>` 元素来举例吧。给 `<input>` 的占位符文本设置颜色，即使设置同一个颜色值，也需要分开来写：

```CSS
/* Chrome/Opera/Safari */
::-webkit-input-placeholder {  
    color: pink; 
} 

/* Firefox 19+ */
::-moz-placeholder {  
    color: pink; 
} 

/* IE 10+ */ 
:-ms-input-placeholder { 
    color: pink; 
} 

/* Firefox 18- */
:-moz-placeholder { 
    color: pink; 
} 
```

但我们换成下面这样写的话，选择器将被客户端忽略：

```CSS
 ::-webkit-input-placeholder, 
 ::-moz-placeholder, 
 :-ms-input-placeholder, 
 :-moz-placeholder { 
     color: pink; 
 }
```

按理说 `:is()` 选择器可以将不符合的客户端的选择器忽略，应该可以像下面这样来写：

```CSS
:is(::-webkit-input-placeholder,::-moz-placeholder,:-ms-input-placeholder, :-moz-placeholder)  { 
     color: pink; 
}
```

由于 `:is()` 选择器中的参数不能包含伪元素，因此上面的选择器并未生效。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/506b843ba7254b4fbd85ff4624f5fc58~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYPRONQ>

同样的，像 `::before`、`::after` 和 `::marker` 在 `:is()` 也会被视为无效选择器。但并不代表永远是这样的，说不定未来的某一天，`:is()` 的参数也可以包含伪元素。事实上，在 GitHub 上能找到相关的讨论，详细的可以查阅 @yisibl 姐姐发起的 《[Why "Pseudo-elements cannot be represented by the matches-any pseudo-class"?](https://github.com/w3c/csswg-drafts/issues/2284)》话题。

## 空格符对于 :is() 和 :where() 伪类函数也是有意义的

在 CSS 中，空格符对于选择器也是有意义的，比如我们熟悉的后代选择器，就离不开空格符 `a b` 。同样的，在 `:is()` 和 `:where()` 选择器中，空格符也是很有意义的。例如：

```CSS
h1:is(:hover, :focus) {
    outline: 3px solid hotpink;
}

h1 :is(:hover, :focus) {
    color: hotpink;
}
```

上面代码中的选择器等同于：

```CSS
h1:hover,
h1:focus {
    outline: 3px solid hotpink;
}

h1 *:hover, h1 *:focus { 
    color: hotpink;
}
```

正如你所看到的，在 `h1` 和 `:is()` 之间添加一个空格符，将会在 `:is()` 选择器列表项中前隐式添加一个通配符 `*` 选择器。

## :is() 和 :where() 是一个宽容型选择器

熟悉 CSS 选择器的同学应该都知道，如果我们在选择器列表中编写了任何无效的 CSS 选择器，则整个 CSS 规则都将无效。即使是对于有效的选择器，相应的 CSS 规则也不会生效。例如：

```CSS
li, 
p, 
button:wrong-selector, 
input {
    font-size: 1.2rem;
    color: blue;
}
```

上面选择器列表中，`button:wrong-selector` 是一个无效的选择器（在 CSS 中并没有一个名为 `:wrong-selector` 的伪类选择器）。因此，整个 CSS 规则都会变得无效，即使 `li` 、`p` 和 `input` 是一个有效的选择器，但因为 `button:wrong-selector` 这个无效选择器，它们也不会起任何作用：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c875b58ef5944b7cb978f5003096316c~tplv-k3u1fbpfcp-zoom-1.image)

然而，在使用 `:is()` 的情况下是不同的。这里，无效的选择器被忽略了，CSS 将应用于所有正确的选择器。

```CSS
/* 无效选择器 */
li, p, button:wrong-selector, input {
    font-size: 1.2rem;
    color: blue;
}

/* 有效选择器，将忽略 button:wrong-select */
:is(li, p, button:wrong-selector, input) {
    font-size: 1.2rem;
    color: blue;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b23a08e22fdf4acf9f464af3122a0412~tplv-k3u1fbpfcp-zoom-1.image)

正如你所看到的，在这里，只有 `button:wrong-selector` 是无效的，但是 CSS 将应用于其他正确的选择器，如 `li`、`p` 和 `input`。

也就是说，使用 `:is()` 或 `:where()` 时，如果一个选择器无法解析，整个选择器列表不会被视为无效，而是会忽略不正确或不支持的选择器，并使用其他的选择器。

很多时候，这个功能对于 Web 开发者来说是非常有利的。比如，CSS 的 `:has()` 和 `:not()` 选择器，它们被定义为**严格型选择器**。如果你希望 `:has()` 或 `:not()` 选择器中的选择器列表也是一个宽容器的参数时，可以在 `:has()` 和 `:not()` 选择器中嵌套一个 `:is()` 或 `:where()` 选择器。比如：

```CSS
article:has(h2, ul, ::-scoobydoo) { 
    color: red;
}
```

`:has()` 选择器中的 `::-scoobydoo` 是个无效的伪类，所以整个 `:has()` 选择器也将是一个无效的选择器。但是，要是在 `:has()` 选择器中嵌套一个 `:is()` 或 `:where()` 选择器，那结果就完全不同了：

```CSS
article:has(:where(h2, ul, ::-scoobydoo)) { 
    color: red;
}

/* 或者 */
article:has(:is(h2, ul, ::-scoobydoo)) { 
    color: red;
}
```

因为 `:is()` 或 `:where()` 是一个宽容型选择器，即使 `::-scoobydoo` 是一个无效选择器，但它也会被忽略不计，从而不会让上面示例代码中的选择器变得无效。

## :is() 选择器权重是其根据其列表参数的权重来计算的

课程开头就提到过，Web 开发者觉得编写 CSS 困难复杂， 其中一个最为主要的原因就是 CSS 选择器的权重令人感到头痛。因为在 CSS 中，如果对于同一个选择器（不同的选择器选中的是同一个元素）存在多个样式规则，则具有更高权重选择器中对应的样式规则才有效。例如：

```HTML
<div class="card">
    <button id="button" class="btn">Submit</button>
</div>
```

```CSS
/* CSS 选择器权重是 (0,2,0) */
.card .btn {
    color: green;
}

/* 选择器权重是 (1,0,0) */
#button {
    color: blue;
}

/* 选择器权重是 (0,0,1) */
button, #info {
    color: black;
}
```

在这个示例中，最终按钮的文本颜色是 `blue` ，即选择器 `#button` 对应的样式规则胜出，因为它的权重（`100`）大于其他两个选择器的权重，即 `1` 和 `20`。

而 `:is()` 伪类函数，它的权重是根据其参数，即列表选择器的权重来决定的。比如下这个示例：

```CSS
p:is(.foo, #bar) { 
    color: hotpink; 
} 

p.foo { 
    color: lime; 
} 
```

最终是哪个选择器获胜呢？

我们借助 [Polypane 的 CSS 选择器权重计算工具](https://polypane.app/css-specificity-calculator/)来测算每个选择器的权重。`:is()` 中的参数是一个选择器列表，即 `.foo` 和 `#bar`，另外是在 `:is()` 选择器之外的 `p.foo`，它们的权重分别是：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b0bd8f5bac64bd4a1ebca5d2be8327b~tplv-k3u1fbpfcp-zoom-1.image)

很明显，`#bar` 选择器获胜，它是一个 ID 选择器。如果将 `p:is(.foo, #bar)` 和 `p.foo` 两个选择器来对比：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51eb27b8c24d441ca8731df2c064ce0e~tplv-k3u1fbpfcp-zoom-1.image)

从上图中不难发现，`p:is(.foo, #bar)` 获胜。对应的 `p` 元素的文本颜色是 `hotpink` 。

更为有意思的是，以往要使 ID 选择器生效，必须在 HTML 中给标签元素设置一个 `id` 值，否则在 CSS 中即使设置了 `#id` 样式规则，也无法找到相匹配的元素：

```HTML
<div id="foo"></div>
```

```CSS
#baz {
    color: lime; /* 在 HTML 中没有定义 id 名为 baz 的元素 */
}

#foo {
    color: lime;
}
```

但使用 `:is()` 增加权重时，其列表参数中的 `id` 名可以不在 HTML 中的标签元素上显式设置。例如：

```HTML
<p class="foo">Class name is foo</p>
<p id="bar">ID name is bar</p>
<p id="faz" class="foo">Class name is foo and Id name is faz</p>
<p>Not has class name and id name</p>
```

```CSS
.foo {
  color: lime;
}

#bar {
  color: hotpink;
}

p:is(#baz#boo, .foo) {
  color: yellow;
}

#faz {
  color: orange;
}
```

你会发现，`:is(#baz#boo,.foo)` 中的 `#baz#boo` 在 HTML 中并没有定义，但它还是生效了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de92cdae97da4465811aede33ddfa731~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEWwBd>

你也可能发现了，`p:is(#baz#boo, .foo)` 选择器并没有成功地匹配到 `p#bar` 和 `p` (没有任何 `id` 名和类名)。

其实，`:is()` 这一特性将成为 CSS 的一个小技巧，**在不选择任何元素的情况下增加选择器权重** 。比如，你想用 `.button` 类来选择，可以使用 `:is()` 来给其增加选择器权重：

```CSS
:is(.button, #increase#specificity) { 
    color: hotpink; 
} 
 
.button { 
    color: lime; 
} 
```

即使你的 HTML 文档中没有任何地方出现过 ID 名： `#increase` 和 `#specificity` 同样能增加 `.button` 选择器权重：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee72f04140d74af79fcb06ed63f8d78d~tplv-k3u1fbpfcp-zoom-1.image)

它看起来有点类似于在属性值后面加 `!important` 来增加权重。

```HTML
<button class="button" id="button">With ID's</button>
<button class="button important">With !important</button>
<button class="button">Button</button>
```

```CSS
:is(.button, #increase#specificity){
    --background-color: #E91E63;
    --border-color: #8d2649;
}

:is(.button, #increase#specificity):hover{
    --background-color: #8d143d;
    --border-color: #bc6280;
}

.button {
    --background-color: #42b72a;
    --border-color: transparent;
    background-color: var(--background-color);
    border-color: var(--border-color);
}

.button:hover {
    --background-color: #36a420;
    --border-color: #36a420;
}

#button {
    --background-color: #2196F3;
    --border-color: #257cc1;
}

#button:hover {
    --background-color: #1977c2;
    --border-color: #0e4877;
}

.important {
    --background-color: #FF9800 !important;
    --border-color: #df8a0c !important;
}

.important:hover {
    --background-color: #d08415 !important;
    --border-color: #c3862c !important;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a28bae6a267541e88bd53731da571758~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJQzJj>

`:where()` 刚好与 `:is()` 相反，它可以使选择器权重始终是 `0` 。比如：

```CSS
:where(.foo, #bar) { 
    /* CSS Code */ 
} 

:where(p.foo, #bar, p#bar, $css:rocks) { 
    /* CSS Code */ 
} 

:where(p.foo, .foo, p#bar, #bar, #foo#bar) { 
    /* CSS Code */ 
} 
```

不管 `:where()` 选择器中参数（一个列表选择器）的选择器权重是多大，最终 `:where()` 的权重都是 `0`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95fa8dfbed44d02bf8b25cdac4aca06~tplv-k3u1fbpfcp-zoom-1.image)

这对那些正在建立框架、主题和设计系统的人来说非常有益。使用 `:where()` 可以让选择器的权重为 `0`，而下游的开发者可以轻易地覆盖或扩展，不需再担心因选择器权重产生冲突。这一特性，我已经在 [@argyleink 的 open-props ](https://github.com/argyleink/open-props)看到了：

```CSS
:where(html) { 
    --ease-1: cubic-bezier(.25, 0, .5, 1); 
    --ease-2: cubic-bezier(.25, 0, .4, 1); 
    --ease-3: cubic-bezier(.25, 0, .3, 1); 
    --ease-4: cubic-bezier(.25, 0, .2, 1); 
 }
```

`:where(html)` 选择器比 `:root` 和 `html` 选择器权重都要低：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2d82fc0c24e4d9db92c9c0013550493~tplv-k3u1fbpfcp-zoom-1.image)

另外，`:where()` 用在重置的 CSS 中也非常有益：

```CSS
:where(:not(iframe, canvas, img, svg, video):not(svg *, symbol *)) { 
    all: unset; 
    display: revert; 
}
```

我们来看一个 `:where()` 的示例，比如下面这个运用于 `<img>` 的样式，你认为图片边框会是什么颜色：

```CSS
:where(article img:not(:first-child)) { 
    border: 5px solid red; 
} 

:where(article) img { 
    border: 5px solid green; 
} 

img { 
    border: 5px solid orange; 
}
```

第一条规则的选择器权重为 `(0,0,0)`，因为整个选择器都被包含在 `:where()` 中；第二条规则的选择器权重是 `(0,0,1)`，其中 `img` 不在 `:where()` 选择器中；第三条规则的选择器权重是 `(0,0,1)` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c872c9e12114349b40f71c079c73b4b~tplv-k3u1fbpfcp-zoom-1.image)

就这个示例而言，第二条规则和第三条规则的选择器权重是相等的，但第三条规则位于第二条规则之后，因此第三条规则的获胜，所以运用到 `img` 的边框颜色是 `orange`，而不是 `green`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53499e0fc5d640439c4718eef38a0521~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgLYMd>

这也是 `:is()` 和 `:where()` 选择器之间的唯一差别。即 `:where()` 选择器权重总是为 `0`，而 `:is()` 选择器的权重计数等同于选择器列表中最高权重的值。

## 一种更简单的级联层级的替代方案

正因为 `:where()` 和 `:is()` 选择器可以用来改变选择器权重，因此，可以使用它们来做为级联层的一种简单替代方案。

比如，你正在创建一个框架或者一个库，那么可以使用 `:where()` 伪类函数，将框架或库中的选择器权重降低至 `0` 。这样做的好处是，使用你的框架或库的 Web 开发者，无需处理选择器权重的问题，它可以很轻易的覆盖你框架或库中的样式规则。

尽管 CSS 的级联层 `@layer` 是解决 CSS 权重和 CSS 框架的相同问题的潜在解决方案，但我认为不应该低估 CSS 的 `:where()` 的特性。 `:where()` 可以应用于选择器级别，不需要你去改变整个 CSS 的架构，这一点与级联层 `@layer` 是有所不同的。

简单地说，`:is()` 和 `:where()` 可以帮助我们更好地管理 CSS 选择器权重。最为有效的使用方式是：

*   在构建 CSS 框架或库的时候，使用 `:where()` 来管理所有选择器的权重，将选择器权重降至为 `0`
*   在使用框或库的时候，可以使用 `:is()` 来提高选择器权重，在不改变 HTML 代码的情况之下，可以将选择器权重提高到最高级别

例如，我们可以像下面这样构建一个基础的 `Card` 组件：

```CSS
:where(.card) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #fff;
    border-radius: 6px;
    max-width: 30vw;
    padding-bottom: 1rem;
}

:where(figure) {
    border-radius: 6px 6px 0 0;
    overflow: hidden;
}

:where(figure img) {
    display: block;
    max-width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    object-position: center;
}

:where(.card h3) {
    font-size: clamp(1rem, 3vw + 1.25rem, 1.5rem);
}

:where(.card p) {
    color: #888;
    line-height: 1.6;
    font-size: 85%;
}
:where(.card > *:not(figure)) {
    margin-inline: 1rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/173adc3bf8bf453c8e6fb0197ffa7ab9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxwvNe>

正如前面所述，构建该 `Card` 组件所使用到所有选择器权重都为 `0` ，你可以随时随地覆盖基础卡片中的样式规则：

```CSS
/* 覆盖卡片基础样式 */
.card {
    background-color: #09f;
    color: #fff;
}

figure img {
    aspect-ratio: 21 / 9;
}

.card p {
    color: #f5f5f5;
}

/* 卡片基础样式 */
:where(.card) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #fff;
    border-radius: 6px;
    max-width: 30vw;
    padding-bottom: 1rem;
}

:where(figure) {
    border-radius: 6px 6px 0 0;
    overflow: hidden;
}

:where(figure img) {
    display: block;
    max-width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    object-position: center;
}

:where(.card h3) {
    font-size: clamp(1rem, 3vw + 1.25rem, 1.5rem);
}

:where(.card p) {
    color: #888;
    line-height: 1.6;
    font-size: 85%;
}
:where(.card > *:not(figure)) {
    margin-inline: 1rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b8f06de7d1643a59a13671991c1e954~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNaObOG>

## 选择 :is() 还是 :where()

你可能会纠结，何时使用 `:is()` 会比 `:where()` 更好呢？

我们已经知道了，`:is()` 和 `:where()` 之间存在重要的区别。**`:where()`** **的权重始终为** **`0`** **，而** **`:is()`** **则采用其参数中****最具体****选择器的权重**。

考虑到 `:is()` 和 `:where()` 之间的差异，使用哪个选择器，最终还是取决于你的具体需求。

如果你知道选择器列表中最具体选择器的权重，并且希望将它应用于整个选择器组，则 `:is()` 可能更适合你。咖一方面，如果你希望按照选择器列表的顺序应用所有选择器，并且不想改变每个选择器权重的计算，则可能更适合使用 `:where()` 。

总之，这取决于你的具体需求，取决于你对选择器列表中每个选择器权重计算的处理方式。比如下面这个示例。我定义按钮的背景色为绿色（`#42b72a`），并且按钮在悬浮和获得焦点状态时，背景色变成蓝色（`#2196F3`）。

```CSS
button:hover,
button:focus-visible{
    --background-color: #2196F3;
    --border-color: #257cc1;
    outline: 3px solid #257cc1;
}

button {
    --background-color: #42b72a;
    --border-color: transparent;
}
```

你可能已经发现了，按钮 `button` 默认状态的声明出现在文档后面（比如在 `button:hover` 后面），但它（`button`）不会覆盖按钮悬停（`button:hover`）和聚集状态（`button:focus-visible`）的样式。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8310c04ba2c74a8cacb6849c50d35077~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxwJMm>

这是因为 `button` 选择器权重（`0,0,1` ）比 `button:hover` 和 `button:focus-visible` 选择器权重（`0,1,1`）都低。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9d9ef0c9fa044229e0ea8711b6a4af1~tplv-k3u1fbpfcp-zoom-1.image)

事实上，更为合理的方式是：

```CSS
button {
    --background-color: #42b72a;
    --border-color: transparent;
}

button:hover,
button:focus-visible{
    --background-color: #2196F3;
    --border-color: #257cc1;
    outline: 3px solid #257cc1;
}
```

但好在该选择器仍然有效，`:hover` 和 `:focus-visible` 伪类使选择器更具体，因为它们的任务是为特定情况定义样式。

如果我们使用 `:where()` 来做同样的事情：

```CSS
:where(button:hover),
:where(button:focus-visible){
    --background-color: #2196F3;
    --border-color: #257cc1;
    outline: 3px solid #257cc1;
}

button {
    --background-color: #42b72a;
    --border-color: transparent;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29d116a275cc44d990aac096d94460f2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEqybYE>

正如你所看到的，现在按钮的背景颜色始终是绿色。这是因为 `:where()` 选择器使相应选择器权重变为 `0` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec32fe84788848f5861697277ac7b9c6~tplv-k3u1fbpfcp-zoom-1.image)

如果你希望获得与前面示例等同的效果，即按钮悬浮或获得焦点状态时，背景色变成蓝色，则使用 `:is()` 比 `:where()` 更合适：

```CSS
:is(button:hover),
:is(button:focus-visible){
    --background-color: #2196F3;
    --border-color: #257cc1;
    outline: 3px solid #257cc1;
}

button {
    --background-color: #42b72a;
    --border-color: transparent;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8565fa2218b14002ba7d3521c54bf768~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNaOQrm>

## 小结

正如你所看到的，`:is()` 和 `:where()` 两个选择器的使用是极度相似的，唯一不同的是选择器的权重计算。`:is()` 选择器中权重是由传递给他的参数中选择器权重最高的一个决定，而 `:where()` 选择器权重始终是`0`。从这一点来说，`:is()` 可以用来增加选择器权重，`:where()` 可以将选择器权重置为最低。

另外，这两个选择器都可以将冗长、复杂的选择器变得简单化。 正如文章中的示例所示，这些选择器都是用来帮助开发者解决问题。让开发者能更好、更快速地完成需求。最后，希望这节课能帮助你较好的理解最新的 `:is()`和 `:where()` 选择器以及它们的差异。
