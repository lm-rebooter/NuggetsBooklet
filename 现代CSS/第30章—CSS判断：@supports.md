我们这本小册主题是现代 CSS ，主要向大家介绍 CSS 中最新的特性和功能。可每当一个新特性出现在 Web 开发者眼前的时候，都会问同样一个问题：“浏览器支持这个新特性吗？”换句话说，当你想要使用 CSS 某个特性，却发现它并没有得到浏览器支持，或者在不同浏览器中表现不同时，这可能会令你感到沮丧，甚至是放弃使用。那么在这节课中，我们来一起探讨如何使用 CSS 的特性检测功能来检测 CSS 的新特性是否得到浏览器的支持。

## 为什么会有这些差异？

众所周知，并非 Web 上的每个人都在使用相同的操作系统、浏览器，甚至物理硬件。简单地说，我们永远无法让每个人都使用相同的浏览器和浏览版本访问我们的 Web。它们总是会存在一定差异的，CSS 的新特性也存在这方面的差异。

CSS 的新特性不是由 CSS 工作组设计的，而是由一套完整的规范传递给浏览器供应商来实现它。通常情况下，只有当实验实现发生时，规范的所有更精细的细节才能得到解决。因此，CSS 新特性开发是一个迭代过程，要求浏览器在开发中实现这些规范。虽然现在实现通常是在浏览器的标志后面，或者只在预览版本中可见，但一旦浏览器具有完整的功能，即使没有其他浏览器支持，它也可能为每个人打开它。

我们需要知道的是，浏览器供应商开始实验实现一个新的 CSS 特性时，都是从一个特定的浏览器版本开始，即使实验成功，也并不代表着该浏览器所有版本都支持该特性。例如，CSS 的 `aspect-ratio` 特性，它是从 Chrome 88 开始得到支持的，也就是说，低于 88 这个版本号的 Chrome 浏览器是不支持该特性的。如果你的项目中使用了 `aspect-ratio` ，但你的用户所用的 Chrome 浏览器版本低于 88 的话，那么浏览器遇到 `aspect-ratio` 就会完全跳过，而不会应用它或抛出错误。这在某些情况下，可能会让你和你的用户感到沮丧。

另外一个不争的事实就是，用户并不总是快速更新他们的浏览器，尽管近年来这种情况已经有所改善，大多数浏览器都在默默升级自己。

所有这一切都意味着，尽管我们可能很喜欢它（CSS 的新特性），但现实是我们永远不会生活在“所有的桌面和手机都神奇地同时提供该功能”的世界里。如果你是一名专业的 Web 开发人员，那么你的工作之一就是处理这个事实。换句话说，CSS 新特性总是会有兼容性的问题存在（哪怕这种兼容性问题的时间很短），Web 开发就得把处理它们兼容性当作工作的一部分。

## 渐进式增强和优雅降级

在 CSS 的世界中，给 CSS 新特性提供回退有两种主流策略：**渐进式增强**和**优雅降级**。

当然，在 CSS 中并不是所有特性都可以提供优雅的较好的回退方案，例如布局特性就不像简单的颜色、阴影或渐变属性那样容易提供优雅的回退。如果布局特性被浏览器忽略，你的整个设计可能会崩溃。

因此，你需要使用 CSS 特性查询（`@supports`）来检测浏览器是否支持这些布局特性，并根据结果选择性地应用不同的布局。

也就是说，你可以在 CSS 中使用特征查询来检测是否支持特定的属性和值组合。这是编写健壮的 CSS 的一种非常聪明的方式，可以满足使用各种浏览器和具有不同功能的设备的用户的需求，并且比[用户代理嗅探](https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent)要好得多。例如，我们可以检查浏览器是否支持 CSS 网格布局特性：

```CSS
@supports (display: grid) {
    .container {
        display: grid;
    }
}
```

如果浏览器理解 `display: grid` ，那么括号内的所有样式都将被应用。否则所有的样式都将被跳过。

### 渐进式增强

> [渐进式增强（Progressive Enhancement）](https://en.wikipedia.org/wiki/Progressive_enhancement)是 Web 设计中的一种策略，将重点放在 Web 内容上。基本的内容和功能应该可以被所有的浏览器访问。增强的行为是逐步提供的。——维基百科

在 CSS 中，渐进式增强可以应用于回退策略，从最基本的广泛支持的 CSS 特性开始，然后逐步添加新特性。

你提供了一个适用于所有用户的基本体验，无论支持与否，然后为更现代的浏览器增强用户体验。

这是一项有用的技术，允许 Web 开发人员专注于开发最好的网站，同时使这些网站在多个未知的用户代理上工作。拿 Web 页面上的圆角为例，在不支持 `border-radius` 的浏览器上不呈现圆角效果，它并不会影响用户的体验；而在支持 `border-radius` 的浏览器上呈现圆角效果，这样可以给用户一个更好的体验：

```CSS
@supports (border-radius: 1px) {
    .element {
        border-radius: .2em;
    }
}
```

需要知道的是，[并不是所有浏览器都支持 CSS 特性查询（@supports）](https://caniuse.com/mdn-css_at-rules_supports_selector)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c166f9e9092c40ac91bad5f9201213d9~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，不理解特性查询（`@supports`）的浏览器将跳过其中的所有代码块。这可能很糟糕。在构建代码时，你要知道不支持特性查询的最老的浏览器或你正在测试的特性。

有一件事可以使渐进式增强更容易，那就是设计不需要在任何地方看起来都完全一样，它可以在旧的浏览器中简化，在现代浏览器中更复杂和更花哨，以利用现代强大的 CSS 特性。比如前面举的圆角例子。

当你不确定你想要支持的旧浏览器的数量时，这种策略就不适用了，当你使用你可能根本不需要的旧技术编写大量的回退时，这种策略非常耗时。在这种情况下，请考虑使用优雅降级。

### 优雅降级

> [优雅降级（Graceful Degradation）](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation)是一种设计理念，其核心是试图构建一个可以在最新浏览器上运行的现代网站或应用程序，但在旧浏览器上提供的基本内容和功能却不如以前好。——MDN

在 CSS中，优雅降是 CSS 新特性回退另一策略，从最先进的 CSS 特性开始开发最好的网站，然后添加回退以优雅地支持旧的或未知的浏览器。

CSS 通过设计优雅地降级，使用未知的 CSS 属性可能不会破坏整个站点，但很有可能某些部分无法像预期的那样为某些用户工作。

一个可以优雅地降级的网站设计首先要考虑到现代浏览器。这个网站是为了利用这些现代网络浏览器的特性而创建的。

如果浏览器不理解 `display: grid`，那么括号内的所有样式都将被应用。否则所有的样式都将被跳过。

```CSS
@supports not (display: grid) {
    .container {
        display: flex;
    }
}
```

优雅降级可以更容易地用作现有产品的补订，它不是完美的，但需要较少的初始工作。

从理论上讲，当我们使用上述任何一种策略时，我们可能仍然会在完全相同的地方结束，但我们是从基本体验开始还是默认的增强体验被认为是我们优先考虑的同义词。

如果你优先考虑每个人，那么就应该进行渐进式增强。如果你优先考虑使用最新浏览器的少数特权用户，那么就选择适当的降级。

优雅降级和渐进式增强具有相同的目标，即创建健壮的、可访问的和广泛的解决方案，适用于每个人，无论他们选择哪种浏览器。

虽然渐进式增强和优雅降级是使用 CSS 新特性回退的两种不同策略，但它们有一个共性，都可以使用 CSS 的 `@supports` 来实现代码上的构建，从而使 Web 开发者达到最终的目的。

## CSS 特征检测

CSS 特征检测又被称为“CSS 支持测试”，简单地说，就是使用 `@supports` 来检测 CSS 特性是否得到浏览器的支持。

CSS 的 `@supports` 允许你对 CSS 的**属性** 、**值** 或 **选择器** 进行检测。

在 `@supports` 中，如果浏览器理解属性和值，测试条件将返回真（`true`），否则将返回假（`false`）。

```CSS
@supports (accent-color: red) {
    /* 当浏览器支持 accent-color, 样式将会被应用 */
}
```

你还可以测试选择器，如 `:is()`、`:where()`、`:focus-visible`等。通过在括号前加上 `selector` 关键词，我们就可以使用 `@supports` 来检测这些选择器是否得到浏览器的支持：

```CSS
@supports selector(:is(a)) {
    /* 当浏览器支持 :is() 选择器，样式将会被应用 */
}
```

有关于 `@supports` 用来检测选择器这方面的知识，稍后还会详细介绍。

你也可以像使用 [CSS 的媒体查询](https://juejin.cn/book/7223230325122400288/section/7257368158451793935)一样，可以将带有 `and` 和 `or` 的检测条件组合起来，还可以使用 `not` 来否定检测条件。

```CSS
@supports (leading-trim: both) or (text-box-trim: both) {
    /* 浏览器只要支持 leading-trim 或 text-box-trim，样式将会被应用 */
}
​
@supports (transform: scale(1)) and (scroll-timeline-name: a) {
    /* 浏览器要同时支持 transform 和 scroll-timeline-name，样式才会被应用 */
}
​
@supports not selector(:focus-visible) {
    /* 浏览器不支持 :focus-visible, 样式将会被应用 */
}
```

### not 操作符

将 `not` 操作符放在任何表达式之前就能否定一条表达式。如果浏览器不理解 `initial-letter: 4` ，则下面表达式会返回 `true` ，而从 `@supports` 块中的样式会被应用：

```CSS
@supports not (initial-letter: 4) {
    p:first-of-type::first-letter {
        font-family: Georgia, serif;
        float: left;
        font-size: 7.125em;
        font-weight: bold;
        line-height: 0.65;
        margin: 0;
        padding: 0.05em 0.1em 0 0;
    }
}
```

和其他操作符一样，`not` 操作符可以应用在任意复杂度的表达式上。下面的几个例子中都是合法的表达式：

```CSS
@supports not (not (transform-origin: 2px)) {
    /* CSS */
}
​
@supports (display: grid) and (not (display: inline-grid)) {
    /* CSS */
}
```

> 如果 `not` 操作符位于表达式的最外层，则没有必要使用圆括号将它括起来。但如果要将该表达式与其他表达式连接起来使用，比如 `and` 和 `or`，则需要外面的圆括号。

在 `@supports` 的时候，使用 `not` 操作符可以说是一种糟糕的做法，因为必须考虑浏览器对 `@supports` 本身的支持。这就是问题的症结所在。例如：

```CSS
@supports not (display: grid) {
   /* 不支持网格的隔离代码 */
}
@supports (display: grid) {
   /* 支持网格的独立代码 */
}
```

在逻辑上分开的 `@supports` 块中编写代码非常有吸引力，因为这样每次都是从头开始，不需要重写之前的值，也不需要处理那些逻辑上令人费解的问题。但是让我们回到 iOS 情境中，`@supports` 在 iOS 9 版本中出现（就在 iOS 7 中出现 Flexbox 和 iOS 10.2 中出现 Grid 之间）。这意味着在 `@supports` 中使用 `not` 操作符检测 `(display: grid)` 支持的任何回 Flexbox 的回退代码都无法在 iOS 7 或 iOS 8 中工作，这意味着回退现在需要在浏览器中进行回退。

使用 `@supports` 的主要原因是考虑到某些东西的不同实现，这取决于特性支持，如果代码块分开，就更容易推理和区分这些实现。

### and 操作符

`and` 操作符用来将两个原始的表达式做逻辑与后生成一个新的表达式，如果两个原始表达式的值都为真，则生成的表达式也为真。在下例中，当且仅当两个原始表达式同时为真时，整个表达式才为真：

```CSS
@supports (initial-letter: 4) and (transform: scale(2)) {
    p:first-of-type::first-letter {
        -webkit-initial-letter: 4;
        initial-letter: 4;
        font-size: inherit;
        line-height: inherit;
        margin: 0;
        padding: 0 0.25em 0 0;
    }
}
```

可以将多个合取词并置而不需要更多的括号。以下两者都是等效的：

```CSS
@supports (display: table-cell) and (display: list-item) and (display:run-in) {
    /* CSS */
}
​
@supports (display: table-cell) and ((display: list-item) and (display:run-in)) {
    /* CSS */
}
```

### or 操作符

`or` 操作符用来将两个原始的表达式做逻辑或后生成一个新的表达式，如果两个原始表达式的值有一个或者都为真，则生成的表达式也为真。在下例中，当两个原始表达式中至少有一个为真时，整个表达式才为真：

```CSS
@supports (initial-letter: 4) or (-webkit-initial-letter: 4) {
    p:first-of-type::first-letter {
        -webkit-initial-letter: 4;
        initial-letter: 4;
        font-size: inherit;
        line-height: inherit;
        margin: 0;
        padding: 0 0.25em 0 0;
    }
}
```

可以将多个析取词并置而不需要更多的括号。以下两者都是等效的：

```CSS
@supports (transform-style: preserve) 
    or (-moz-transform-style: preserve) 
    or (-o-transform-style: preserve) 
    or (-webkit-transform-style: preserve) {
    /* CSS */
}
​
@supports (transform-style: preserve-3d) 
    or ((-moz-transform-style: preserve-3d) or ((-o-transform-style: preserve-3d) or (-webkit-transform-style: preserve-3d))) {
    /* CSS */
}
```

> 在使用 `and` 和 `or` 操作符时，如果是为了定义多个表达式的执行顺序，则必须使用圆括号。如果不这样做的话，该条件就是无效的，会导致整个 at-rule 失效。

## @supports 的限制

`@supports` 的一个重要限制是它目前不能检测 CSS 的 `@` 规则，这意味着它不能检测 `@container` （容器查询）、`@layer` （级联层）和 `@media` （媒体查询）等。缺乏检测是有问题的，因这规则通常会极大地影响 CSS 的编写和结构。

此外，部分实现的测试可能会出现问题。例如，CSS 的 `:has()` 选择器。不幸的是，到目前为止，Firefox 112 中在使用 `:has()` 选择器（例如 `:has(+ )`）测试关系选择器可能会返回假阳性。这是假的，因为部分实现只支持更直接的选择器，如 `li:has(a)` 。

```CSS
@supports selector(li:has(+ *)) {
    /* 它可能不会失败，所以页面背景是红色 */
    body {
        background: red;
    }
​
    /* 这条规则确实不适用 */
    li:has(+ *) {
        background: green;
    }
}
```

当使用 `@supports` 时，一定要在多个浏览器中测试结果，以确保你的样式应用于你想要的结果。

还要注意，使用 `@supports` 测试条件需要支持 `@supports` 本身！换句话说，检查你正在测试的特性的支持和`@supports`，以确保你没有创建一个实际上没有机会失败的条件，因为 `@supports` 在不受支持时被忽略。

## 当 @supports 没有做任何有用的事情时

有的时候，我们在使用 `@supports` 的时候，其最终的结果与不使用它的情况完全相同。例如：

```CSS
@supports (transform: rotate(5deg)) {
    .avatar {
        transform: rotate(5deg);
    }
}
```

在某种程度上，这是完全符合逻辑的。如果浏览器支持 `transform` ，用户头像就会旋转 `5deg` 。但是，如果在非支持场景中没有发生任何不同，则没有必要这样做。在这种情况下，如果没有 `@supports` 块，`transform` 同样会失效，最终结果是一样的。

## 检测选择器支持

现代 CSS 为我们提供了很多新的选择器和伪元素。例如 `:focus-visible` 允许我们在元素被键盘聚焦时对其进行样式化。Chrome 和 Safari 浏览器也支持了 `:has()` 选择器，它就是我们一直期待的父选择器，允许我们通过子元素来选择父元素。

令人高兴的是，CSS 的 `@supports` 提供了相应的功能，通过在括号前加上 `selector` 关键词，就可以使用它来检测相应的选择器是否得到浏览器的支持。例如，当按钮从鼠标接收焦点时，我们可能想要更改按钮的焦点环样式，但是当使用键盘 `Tab` 获得焦点时，如果浏览器不支持 `:focus-visible` ，则保持默认的焦点环样式：

```CSS
@supports selector(:focus-visible) {
    button:focus:not(:focus-visible) {
        outline: 2px solid limegreen;
    }
}
```

> 由于某些原因，这个复杂的选择器在 Safari 中似乎不起作用，尽管 Safari 同时支持 `@supports selector()` 和 `:focus-visible`。

当使用更复杂的伪类（如 `:has()` ）时，浏览器之间的实现似乎略有差异：目前 Safari 要求 `:has()` 包含一些其他选择器，但Chrome没有。

```CSS
/* 这适用于Chrome，但不适用于Safari */
@supports selector(:has()) {
​
}
​
/* 这在任何地方都适用 */
@supports selector(:has(.some-element)) {
​
}
```

如果你要用 `@supports` 来检测 `:has()` 的特性，你必须向 `:has()` 传递一个选择器。这可以是 `*` ，但如果你的代码依赖于 `:has()` 内部使用的相对选择器，请使用 `@supports selector(:has(+ *))` 代替。这样做是为了过滤掉那些使用实验性的 `:has()` 支持的 Firefox 访问者，因为目前还不支持相对选择器。

```HTML
<div class="no-support" data-support="css-has-basic">
    <p>🚨 Your browser does not support CSS <code>:has()</code>, so this demo will not work correctly.</p>
</div>
​
<div class="no-support" data-support="css-has-relative">
    <p>🚨 Your browser does not support relative selectors in CSS <code>:has()</code>, so this demo will not work correctly.</p>
</div>
```

```CSS
.no-support,
.has-support {
    margin: 1em 0;
    padding: 1em;
    border: 1px solid #ccc;
}
​
.no-support {
    background-color: #ff00002b;
    display: block;
}
​
.has-support {
    background-color: #00ff002b;
    display: none;
}
​
@supports selector(:has(*)) {
    .no-support[data-support="css-has-basic"] {
        display: none;
    }
    
    .has-support[data-support="css-has-basic"] {
        display: block;
    }
}
​
@supports selector(:has(+ *)) {
    .no-support[data-support="css-has-relative"] {
        display: none;
    }
    
    .has-support[data-support="css-has-relative"] {
        display: block;
    }
} 
```

## @supports 对应的 JavaScript API

有的时候可能 CSS 的 `@supports` 无法满足你的需求，或者说需要使用 JavaScript 脚本对 CSS 新特性做检测，那么你就可以使用 JavaScript 的 API：

```JavaScript
if (window.CSS && window.CSS.supports) {
  
}
```

要使用它，请在一个参数中将属性传递给它，并在另一个参数中传递值：

```JavaScript
const supportsGrid = CSS.supports("display", "grid");
```

或者将所有内容都放在一个字符串中：

```JavaScript
const supportsGrid = CSS.supports("(display: grid)");
```

## CSS 特征检测的替代方法

前面提到过，CSS 的 `@supports` 无法检测到 CSS 的 `@` 规则，但有时你又希望对 CSS 的 `@` 规则进行检测。或者，你需要对部分实现进行更精确的检测。

庆幸的是，你可以使用 JavaScript 相关的 API 对 CSS 的 `@` 规则进行检测。例如，你可以使用以下命令对 CSS 的 `@layer` 进行检测：

```JavaScript
if (window.CSSLayerBlockRule) {
    // 支持级联层
}
```

还可以使用与 `@supports` 类似的 Web API 函数，即 `CSS.supports()`。 此函数接受与传递给相应 `@supports` 块的值相同的值，包括选择器测试以及组合或否定测试的能力。

```JavaScript
if (CSS.supports('width: 1cqi')) {
    // 支持容器查询单元
}
```

除此之外，你还可以使用 [SupportsCSS](https://supportscss.dev/) 库作为功能检测解决方案，用于测试对 `@`规则、选择器和其他功能的支持，并将结果应用于 `<html>`。 这个小脚本也是可定制的，因此它只测试你想要包含的功能。

但是，如果你有更挑剔的样式并且你确实希望大多数受众都会得到支持，请考虑在样式表中使用常规 `@supports` 块。 一旦样式表加载，样式就可用。

## 小结

在这节课中，简单的了解了如何使用 CSS 的条件属性 `@supports` 以及 `CSS.supports()` 方法怎么对 CSS 特性做查询，用来判断浏览器是否支持这些最新的属性。如果支持将返回的是一个 `true`，将会渲染对应的样式；如果不支持，则将返回 `false`，将不会渲染对应的样式。

在 CSS 中使用 `@supports` 可以对 CSS 新特性做渐进式增强或优雅降级相关的处理。为用户提供更好的体验。