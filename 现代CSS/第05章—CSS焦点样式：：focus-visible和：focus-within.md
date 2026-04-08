焦点样式是指 Web 开发者给**焦点指示器**（也称“焦点环”）设置 UI 样式。这个指示器对于 Web 可访问性（A11Y）非常重要的，尤其对于无法使用鼠标的用户，因为它代替了他们的鼠标指针。换句话说，无论鼠标、键盘还是各种辅助技术设备，你都可以使用它们来浏览 Web 页面。无论使用何种输入方法，清晰的交互元素指示对于良好的用户体验和可访问性至关重要。默认的浏览器样式表在这方面做得非常好：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f483694c1094ac5844a8e5dbb486d98~tplv-k3u1fbpfcp-zoom-1.image)

只不过，有时候浏览器默认的焦点指示器（“焦点环”样式）与你的设计不符，你可以使用 CSS 对其进行重新样式设置。只需记住要考虑到使用键盘的用户！这节课，我们就来一起探讨，在 CSS 中如何给焦点指示器设置一个更合理，又更符合设计需求的 UI 样式，以及在设置焦点样式过程中，需要注意哪些细节？

## 什么是焦点指示器？

在 HTML 中，有很多元素被称为 **[可聚焦元素](https://allyjs.io/data-tables/focusable.html)**，比如 `<a>` 、`<button>` 、`<input>` 等。当用户与一个可聚焦类型的元素进行交互时，浏览器通常会显示一个指示器来表示该元素具有“焦点”。有时也会称之为“**焦点环**”（Focus Ring），因为浏览器通常会在焦点元素周围设置一个实心或虚线的边框。

焦点环会向用户发出信号，表明哪个元素将接指针设备和非指针设备的事件。如果用户正在浏览一个表单，焦点环会指示他们可以在哪个输入框中输入，或者如果用户已经在一个提交按钮上获得焦点，用户可以直接按键盘的 “Enter” 或 “Space” 键盘激活该按钮。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b725e12f4d7643df8c937f73dbd94618~tplv-k3u1fbpfcp-zoom-1.image)

正如你所看到的，Facebook 的登录界面中 `<input>` 、`<button>` 和 `<a>` 等元素都是可聚焦元素，默认情况之下，客户端会给元素聚焦状态时添加一个额外的样式，通常会使用一个轮廓线来表示。因此，用户操作键盘上的 `Tab` 键或鼠标点击焦点元素时，它们带有一个焦点环效果。

> @Domenic 和 @Mu-An 一起整理了 [HTML 中可交互的元素列表](https://boom-bath.glitch.me/tabindex.html)，展示了它们对不同的聚焦方法的反应，并且可以从不同的浏览器中进行测试，看到它们之间的差异。

另外，HTML 可交互的元素根据客户端对焦点行为不同的反馈，可分为三类：

*   **[可编程聚焦（Programmatically Focusable）](https://html.spec.whatwg.org/multipage/interaction.html#focusable)**：如果一个元素是可编程聚焦（Programmatically Focusable），那么使用 JavaScript 脚本的 `focus()` 方法或在元素上显式设置 `autofocus` 属性，它会得到焦点。
*   **[可点击聚焦（Click Focusable）](https://html.spec.whatwg.org/multipage/interaction.html#click-focusable)** ：如果一个元素是可点击聚焦（Click focusable），那么当元素被点击时，这个元素就会被聚焦。这与大多数用户体验（UAs/平台中的）“可编程聚焦”具有相同的元素集。
*   **[可顺序聚焦（Sequentially Focusable）](https://html.spec.whatwg.org/multipage/interaction.html#sequentially-focusable)**：如果一个元素是可顺序聚焦（Sequentially Focusable），那么该元素可以通过键盘的 `Tab` 键来聚焦。这意味着按键盘的 `Tab` 键、`Tab+Shift`（在Safari中，也可以按 `Option + Tab`键）。

## 焦点问题

对于依赖键盘或其他辅助技术访问 Web 页面的用户来说，焦点环就像他们的鼠标指针（鼠标指示器）一样。这也是用户知道自己在与什么交互的方式。

不幸的是，许多 Web 开发者在开 Web 应用或页面时使用 CSS 将可聚焦元素的焦点环都隐藏了。比如：

```CSS
*:focus { 
    outline: none; 
}
```

开发者这样做的原因是因为焦点的底层行为可能很难理解，而对焦点进行样式设计可能会产生令人惊讶的后果。

这样做，虽然满足了设计上的需求（和设计稿效果相匹配），但同时也破坏了依赖键盘访问页面的用户的体验。如前所述，对于依赖键盘访问页面的用户来说，焦点环充当了他们的鼠标指针。因此，去掉焦点环的样式（不提供替代方案）就相当于隐藏了鼠标指针。 即，当用户使用键盘上的 `Tab` 键进行导航时，无法获得任何视觉上的反馈：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f46d294321b4dea9c6ecf6ceaff6337~tplv-k3u1fbpfcp-zoom-1.image)

为了改善这种情况，开发人员需要一种更好的方式来处理焦点元素的焦点样式，即一种符合他们对焦点应该如何工作，并且符合用户的期望，也不会有破坏用户体验的风险。同时，用户需要在体验中拥有最终发言权，并且应该能够选择何时以及如何看到焦点。这就是 `:focus-visible` 和“快速获得高亮”的使用所在。

注意，自 Chrome 86 开始，改善了用户和开发者的体验，Chrome 在使用焦点时，引入了两个新功能。其一，新增 `:focus-visible` 伪类选择器，它允许开发人员给可聚焦元素设置焦点样式，但只允许用户在使用键盘操作时才显示焦点的元素的焦点环样式。其二，新增了“快速聚焦高亮”的用户首选项，它可以使当前聚焦元素显示一个焦点指示器两秒钟。即使开发者使用 CSS 禁用了焦点样式，快速焦点高亮也会始终显示。不管用户与页面交互的输入设备是什么，它还会使所有 CSS 焦点样式相匹配。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fc16db06ec1404f818dcf25e9854322~tplv-k3u1fbpfcp-zoom-1.image)

## Web 开发者控制焦点环样式的方法

浏览器对于可聚焦元素的焦点环都会有一个默认样式，比如，我们熟悉的 `<a>`、`<button>` 和 `<input>` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58dcc5d687cc45ce8df3433a672081a8~tplv-k3u1fbpfcp-zoom-1.image)

例如 Chrome 浏览器，对于这三个元素的焦点环的默认样式如下所示：

```CSS
:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
}

a:-webkit-any-link:focus-visible {
    outline-offset: 1px;
}

input:focus-visible {
    outline-offset: 0px;
}
```

注意，不同客户端对焦点环的默认样式是有所差异的，所以会造成焦点环样式不一致：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acc82206cd254ee8b1c935d729cba1fe~tplv-k3u1fbpfcp-zoom-1.image)

正因如此，设计师们会要求你删除默认的轮廓线（即 `outline` 样式），除此之外，可能还有另一个原因，要是使用 `outline` 给焦点环设置样式，在个别平台上（比如 Safari）会让轮廓线无法自动适应元素的 `border-radius`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d36f35130cd14f9db860dd368f662a45~tplv-k3u1fbpfcp-zoom-1.image)

基于这些原因，Web 开发者往往会重置客户端提供的默认焦点环样式。比如 Facebook 的登录页，开发者为焦点元素的焦点环重新定制了一个 UI 样式。如果你用浏览器的开发者检测器查看代码会发现，元素在得到焦点时可以使用 CSS 的 `:focus` 给焦点元素设置焦点状态下的样式风格（即，焦点环样式）：

```CSS
._8icy._9ahz ._6lux ._6luy:focus, 
._9aha ._6lux ._6luy:focus {
    border-color: #1b74e4;
    box-shadow: 0 0 0 2px #e7f3ff;
    caret-color: #1b74e4;
}
```

也就是说，Web 开发者可以显式地使用 `:focus` 给可聚焦元素设置焦点状态下的样式（焦点环样式），除此之外，还新增了 `:focus-visible` 和 `:focus-within` 。你在开发者工具中也可以发现这两个新增的伪类选择器：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1407979ebc4b14963775ae1dd89770~tplv-k3u1fbpfcp-zoom-1.image)

### 使用 :focus 设置焦点环样式

你可以使用 CSS 的 `:focus` 伪类给可聚焦元素设置焦点环样式。`:focus` 伪类应用于任何元素被聚焦，无论使用何种输入设备（鼠标、键盘、触控笔等）或方法来聚焦它。例如：

```CSS
button:focus { 
    outline: 2px dotted #959595; 
    outline-offset: 2px; 
    box-shadow: 0px 1px 1px #e4e4e4; 
} 
```

当用户点击、触摸元素或通过键盘的 `Tab` 键选择它时，按钮焦点样式如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/945c950743ea425dafb0e3f46f942f78~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNawybv>

很不幸，浏览器在应用焦点时可能存在不一致性。元素是否获得焦点可能取决于浏览器和操作系统。例如，上面示例的 `<button>` ，它虽然自定义的 `:focus` 状态样式，但你会发现，在 macOS 的 Chrome 浏览器中使用鼠标单击按钮或用户按键盘的 `Tab + Option` （或 `Tab`）键，可以看到按钮自定义焦点样式（如上图所示）。但是，在 macOS 的 Safari 中鼠标单击按钮，则看不到按钮自定义的焦点样式，即使你按 `Tab + Option` 键，按钮焦点样式也不是自定义的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73df78a5dff446e39ed4868875695157~tplv-k3u1fbpfcp-zoom-1.image)

注意，该现象不仅发生在按钮 `<button>` 元素上，还会发生在其他可聚焦元素上。比如下面这个示例：

```HTML
<div class="button" tabindex="0">Click Me!</div>
```

```CSS
.button:focus {
    outline: 2px dotted #959595;
    outline-offset: 2px;
    box-shadow: 0px 1px 1px #e4e4e4;
}
```

> Demo 地址：<https://codepen.io/airen/full/wvYeXOm>

抛开客户端渲染 `:focus` 样式化可聚焦元素的焦点环差异性不谈。在 CSS 中，使用 `:focus` 给可聚焦元素设置了样式之后，会告诉浏览器忽略自己给可聚焦元素设置的默认样式，并始终显示你在 CSS 中 `:focus` 状态下的样式。对于某些情况来说，这可能会打破用户的预期，导致混乱的体验。

使用 `:focus` 给可聚焦元素设置焦点样式有一个副作用：很多人都不喜欢。这意味着当你使用鼠标点击一个可聚焦元素时，会看到焦点样式。但对于使用鼠标的用户来说，他们不太需要这种反馈（焦点样式），因为你只是把光标移到那里，然后点击一下。不管你怎么想，这些年来，它让很多人很恼火，以至于他们完全删除了焦点样式，这对于 Web 可访问性来说是一个巨大的损失。

我们是否可以只在使用键盘来聚焦某样东西的时候才应用焦点样式，而不用鼠标？这是不是能给用户带来更好的一种体验？

### 使用 :focus-visible 有选择地给可聚焦元素设置焦点环样式

按理说，每个可聚焦元素在元素获得焦点时，浏览器都会给可聚焦元素一个焦点样式。不知道你是否发现，如果我们未显式使用 `:focus` 给可聚焦元素设置样式时，我们使用鼠标点击可聚焦元素时，并不会有焦点样式，比如下面这个 `<button>`元素：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19f31c97912949c995397aeadf59bb7f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEWdJP>

但用户使用键盘的 `Tab` （或 `Tab + Option`）键，让 `<button>` 元素得到焦点时，会有对应的焦点样式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d71319c5781f44058306a498b1500c27~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEWdJP>

客户端给其一个焦点环一个默认的样式，比如 Chrome ：

```CSS
:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
}
```

但当你使用 `:focus` 显式设置焦点元素焦点样式，比如前面所展示的示例：

```CSS
button:focus { 
    outline: 2px dotted #f36; 
    outline-offset: 3px; 
}
```

这个时候，用户不管是使用鼠标点击按钮还是使用键盘的 `Tab` 键让 `<button>` 获得焦点时，都会有 `:focus` 中设置的焦点样式效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd9780de66824780925e05c5e5ea22d0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNawybv>

这样做，可聚焦元素在聚焦状态下就失去了浏览器默认提供的指示器。

为此，我们可以使用 CSS 的另一个伪类选择器 `:focus-visible`，它可以有效地根据用户的输入方式（键盘）展示不同形式的焦点样式。例如，用户通过键盘的 `Tab` 键导航页面，那么 `:focus-visible` 就会匹配。

下面示例中的按钮将有选择地显示焦点指示器。如果你使用鼠标点击它，结果与你首先使用键盘 `Tab` 键到达它时是不同的。

```CSS
button:focus { 
    outline: 2px dotted #09f; 
    outline-offset: 2px; 
    box-shadow: none;
} 

button:focus-visible { 
    outline: 2px solid #f36; 
    outline-offset: 2px; 
    box-shadow: none;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ea2b921f2924330aea20eb76010b865~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRwjvd>

不过，`:focus` 和 `:focus-visible` 也会涉及选择器权重的问题，就上面的示例来说，如果我们把 `:focus` 选择器对应的样式放置到 `:focus-visible` 之后：

```CSS
button:focus-visible { 
    outline: 2px solid #f36; 
    outline-offset: 2px; 
    box-shadow: none;
} 

button:focus { 
    outline: 2px dotted #09f; 
    outline-offset: 2px; 
    box-shadow: none;
} 
```

这个时候，你会发现不管用户使用键盘 `Tab` 键还是鼠标让 `<button>` 获得焦点时，焦点样式都会采用 `:focus` 对应的样式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8adc6ca47c2f4259b4cdb33f0b9c49de~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKGqBMY>

如果我们要让 `:focus` 和 `:focus-visible` 可以有独自的样式，可以借助 CSS 选择器中的 `:not()` 来处理：

```CSS
button:focus:not(:focus-visible) { 
    outline: 2px dotted #416dea; 
    outline-offset: 2px; 
    box-shadow: 0px 1px 1px #416dea; 
} 

button:focus-visible { 
    outline: 2px solid #f35; 
    outline-offset: 2px; 
    box-shadow: 0px 1px 1px #416dea; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb23f1acbd4f41608c7492438a0a9eb8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEqyjBE>

当然，你也可以借助前面课程《[04 | CSS 选择器：:where() vs. :is()](https://juejin.cn/book/7223230325122400288/section/7226251495069450278)》所介绍的 `:is()` 或 `:where()` 来改变 `:focus` 和 `:focus-visible` 选择器权重，避免因代码的书写顺序造成 `:focus-visible` 被 `:focus` 的样式所替代：

```CSS
button:focus-visible {
    outline: 2px solid #f35;
    outline-offset: 2px;
    box-shadow: 0px 1px 1px #416dea;
}

:where(button:focus) {
    outline: 2px dotted #416dea;
    outline-offset: 2px;
    box-shadow: none;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8c3f3d9fbe443cc993e9ff773c8d3b1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWPoBpg>

或者：

```CSS
:is(button:focus-visible, #increase#specificity) {
    outline: 2px solid #f35;
    outline-offset: 2px;
    box-shadow: 0px 1px 1px #416dea;
}

button:focus {
    outline: 2px dotted #416dea;
    outline-offset: 2px;
    box-shadow: none;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08ee4a07d64e4de1b809299b7c21c855~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaqZPRq>

事实上，`:focus-visible` 不是“仅对键盘用户显示焦点环”，而是“在浏览器认为适当的情况之下显示焦点环”。这一切都基于 `:focus-visible` 伪类的启动方式：

*   **用户是否表示喜欢总是看到焦点指示器**：如果用户表示他们总是希望看到焦点指示器，那么 `:focus-visible` 将总是在焦点元素上匹配，就像 `:focus` 一样。
*   **该元素是否需要输入文本**：当一个需要文本输入的元素（比如，`<input type="text">`）被聚焦时，`:focus-visible` 将始终匹配。了解一个元素是否可能需要文本输入的快速方法是问自己：“如果我使用移动设备点击这个元素，我是否希望看到一个虚拟键盘？”如果答案是“是”，那么该元素将匹配 `:focus-visible` 。
*   **使用的是什么输入设备**：如果用户使用键盘来浏览页面，那么 `:focus-visible` 将匹配任何成为焦点的交互式元素（包括任何带有 `tabindex` 的元素）；如果用户使用的是鼠标或触摸屏，那么只有当焦点元素需要输入文本时，它才会匹配。
*   **焦点是通过脚本移动的吗**：如果焦点是通过调用 JavaScript 的 `focus()` 事件来移动，那么新的焦点元素只有在之前的焦点元素与之匹配时才会匹配 `:focus-visible`。例如，如果用户按下一个物理键，事件处理程序（脚本）打开一个菜单，并将焦点移动到第一个菜单项，那么 `:focus-visible` 仍然会匹配，并且菜单项会有一个焦点样式。

如果不易于理解，我们可以写一个小 Demo 来体验。在HTML中，常见的可聚焦的元素主要有链接 `<a>`、按钮`<button>`、表单控件，比如 `<input>`、`<textarea>`、`<select>` 等，带有 `tabindex` 属性的非聚焦元素，比如 `div`。你会发现，在这些可聚焦元素上，你使用鼠标 `Tab` 键时，它们都可以得到焦点，默认都会有一个焦点环样式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cec19d5fe2af4aeda702635ddbe0bd35~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRwjXw>

就上面示例中，除了 `<a>` 链接、`<button>` 按钮和带 `tabindex="0"` 的 `<span>` 元素之外的其他元素，用户使用鼠标也可以让其有焦点样式，比如 `<input>`元素：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b5df6db39574cb4a6bac1a37ce3d48f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRwjXw>

尝试着在这些可聚焦元素上设置 `:focus` 和 `:focus-visible` 焦点样式：

```CSS
li *:focus:not(:focus-visible) {
    outline: 4px solid #90a9ea;
    outline-offset: 2px;
}

li *:focus-visible {
    outline: 4px solid #f35;
    outline-offset: 2px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ac3a44465af456bb8237f88f9482f31~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRXxBJ>

从上图的测试示例结果来看，表单中除 `type="checkbox"` 和 `type="radio"` 之外的 `<input>` 和 `<select>` 可聚焦元素在用户使用鼠标时，焦点元素样式会是 `:focus-visible` 指定的焦点样式。

这两个示例告诉我们浏览器认为“适当的情况”的意思是，`:focus-visible` 与浏览器何时决定显示其默认的轮廓（`outline`）有关。例如，大多数浏览器在你使用键盘按下按钮时会显示轮廓，但是当你使用鼠标单击按钮时不会显示轮廓。换句话说，浏览器中的焦点样式只有在特定的情况下才会显示。`:focus-visible` 伪类的作用是匹配这些情况。

这使得 `:focus-visible` 和 `:focus` 非常不同，`:focus` 匹配当前可聚焦的元素，而不管高亮它是否有意义。这就是为什么，你可能在用鼠标单击某个元素时也会看到设置的 `:focus` 样式。这种行为可能会让用户感到困惑，并导致一些开发人员关闭 `:focus` 状态下样式，请大家不要这样做。

而 `:focus-visible` 允许你更改焦点环的样式，但不能更改焦点环何时出现。因此，它允许你针对浏览器通常会应用焦点样式的情况，重点是排队浏览器不绘制默认轮廓的情况，例如当用户使用鼠标点击某个可聚焦元素时。

因此，浏览器将 `:focus-visible` 样式应用于更多非鼠标情况，而不仅仅是键盘用户。正如 [@Eric Bailey 在《Focusing on Focus Styles》中所解释的那样](https://css-tricks.com/focusing-on-focus-styles/)，有很多类似于键盘的设备，比如手柄、语音识别或眼动跟踪技术等，都可以在数字系统中产生输入，它们类似于你在键盘上按下 `Tab` 键。

#### 聚焦状态下的快速高亮

`:focus-visible` 让开发者更容易给焦点元素设置焦点样式，并避免了现有的 `:focus` 给焦点样式带来的缺陷。虽然这对于可聚焦元素设置焦点样式有一个很好的补充，但对于一部分用户来说，特别是那些有认知障碍的用户，总是看到焦点指示器是很有帮助的，而且他们可能会发现，当焦点指示器由于 `:focus-visible` 的选择性样式而减少出现的次数时，他们会感到很痛苦。

对于这些用户，Chrome 86 新增了一个名为“焦点快速高亮（Quick Focus Highlight）”的功能设置。开启了该设置，会快速突出显示当前聚焦元素的焦点样式，并使 `:focus-visible` 始终匹配。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53c87331d9ac4be2bee51dc749ce789e~tplv-k3u1fbpfcp-zoom-1.image)

高光是从焦点元素开始的，以避免干扰该元素现有的焦点样式或阴影。高光将在两秒后淡出，以避免遮挡页面内容，如文本。

如果想看到上图的效果，需要确保你的 Chrome 浏览器开启了这个功能。如果没有开启可以按下面的方式来开启。在 Chrome 浏览器的地址栏中输入 `chrome://settings`，并在“高级（Advanced）”中的“可访问性（Accessibility）”开启“短暂地突出显示焦点对象”：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccc919e07d2349b59db4cd4424df5e4a~tplv-k3u1fbpfcp-zoom-1.image)

### 使用 :focus-within 为可聚焦元素的父级元素设置样式

前面介绍的 `:focus` 和 `:focus-visible` 都是给可聚焦元素设置焦点状态下的样式，而 `:focus-within` 这个伪类和它们都有所不同。它表示一个元素获得焦点，或该元素的后代元素获得焦点。这也意味着，它或它的后代获得焦点，都可以触发 `:focus-within`。

`:focus-within` 有点类似于JavaScript 的事件冒泡，从可获得焦点元素开始一直冒泡到 HTML 的根元素 `<html>`，都可以接收触发 `:focus-within` 事件。比如：

```HTML
<html>
    <body>
        <div class="container">
            <div class="box">
                <button type="submit">Click Me!</button>
            </div>
        </div>
    </body>
</html>
```

```CSS
.box:focus-within, 
.container:focus-within { 
    box-shadow: 0 0 5px 3px rgba(255, 255, 255, 0.65); 
} 

body:focus-within { 
    background-color: #2a0f5bde; 
} 

html:focus-within { 
    outline: 5px solid #09f; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbe28beb7a6940a8b97031ec319ba1c1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjmJaMa>

`:focus-within` 伪类是最接近于 [CSS :has() 选择器](https://juejin.cn/book/7223230325122400288/section/7224404685615005728)的，有点类似于 CSS 的父选择器。利用 `:focus-within` 独有的特性，可以使用它实现很多有创意的交互效果。比如制作一个搜索表单收缩与展开的动画效果：

```HTML
<div class="search">
    <input type="text" placeholder="Search...">
    <button class="btn">
        <i class="fas fa-search"></i>
    </button>
</div>
```

```CSS
.search{
    position:relative;
    height:50px;
}

.search input{
    height:50px;
    width:50px;
    transition: width 0.3s ease;
}

.btn{
    position:absolute;
    transform:translate(-50%);
    top:0%;
    left:50%;
    height:80px;
    width:80px;
    transition:
        transform 0.3s ease, 
        width 0.3s  cubic-bezier(0.68, -0.55, 0.265, 1.55),
        height 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55),
        left 0.3s  ease;
}

:focus-visible {
    outline: none;
}

.search:focus-within input{
    width:300px;
}
.search:focus-within .btn{
    top:10%;
    left:88%;
    height:70px;
    width:70px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 0px, rgba(0, 0, 0, 0.3) 0px 0px 0px 0px, rgba(0, 0, 0, 0.2) 0px 0px 0px inset;
}
```

> Demo 地址：<https://codepen.io/airen/full/eYPRLry>

而且在制定一些特定的 UI 效果时，`:focus-within` 要比 `:focus` 和 `:focus-visible` 更具优势，比如下面这个卡片示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cad4da0f286446178f313c4351685f72~tplv-k3u1fbpfcp-zoom-1.image)

你可以使用 `:focus-within` 在产品链接（`<a>`）聚焦时突出显示整个卡片，卡片边框高亮并带有一个阴影：

```HTML
<div class="card">
    <img src="card-thumbnail.jpg" alt="card thumbnail" />
    <a href="">Product Or Product Group Name</a>
    <p>$99 - $199.99</p>
    <ul>
        <li><svg></svg></li>
        <!-- 其他星星 -->
    </ul>    
</div>
```

```CSS
.card a:focus-visible {
     transform: scale(1.1);
     color: #09D;
     transform-origin: left center;
}

.card a:focus:not(:focus-visible) {
    outline: none;
}

.card a:focus:not(:focus-visible),
.card a:hover {
    color: #f35;
}

.card:focus-within {
    outline: 2px solid red;
    box-shadow: 0 0 0.5em 0.25em rgb(255 45 9 / 88%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60422dd4fc8a406bb881f15930a3f0e6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwegebP>

注意，上面这个示例也可以使用 CSS 的 `:has()` 和 `:focus` 与 `:focus-visible` 结合起来实现，感兴趣的同学，自己可以动手一试。

#### :has(:focus) VS. :focus-within

[@Una 在 Twitter 上分享了一个 `:has(:focus)` 和 `:focus-within` 相关的话题](https://twitter.com/Una/status/1629334971771940865)，我觉得很有意思，特意在这里贴出来与大家一起共享：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb9e2b18e6504c94b2f71af5f0aaaa3b~tplv-k3u1fbpfcp-zoom-1.image)

> URL 地址：<https://twitter.com/Una/status/1629334971771940865>

`:has(:focus)` 与 `:focus-within` 的区别在于，前者仅匹配包含聚焦元素的祖先元素，而后者匹配具有聚焦元素的祖先元素及其自身。

例如，对于以下 HTML 代码：

```HTML
<div class="parent">
    <input type="text" class="child">
</div>
```

如果我们将其与以下 CSS 代码相匹配：

```CSS
.parent:has(:focus) {
    background-color: red;
}
```

那么，当我们聚焦 `input` 元素时，`.parent` 的背景色会变成 `red`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f509d6020294f80b3a6c30f69fdb144~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNqwQON>

如果我们将其与下面的 CSS 代码相匹配：

```CSS
.parent:focus-within {
    background-color: blue;
} 
```

此时，当 `<input>` 元素获得焦点时，`.parent` 背景颜色则变成蓝色 `blue` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a915e097fdf5485bb36854c8ea9a0028~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmzMNr>

上面这两个示例，从侧面验证在了 @Una 分享的内容之一，即 **对于 `div` 元素，`div:has(:focus) == div:focus-within`。但要注意的是，对于 `a` 元素，`a:has(:focus) != a:focus-within`**。[@Una 在 Codepen 上写个一个 Demo](https://codepen.io/una/full/OJoRxmv)，阐述了这两个观点：

```HTML
<div class="card">
    <h2>带有焦点元素（按钮元素）的卡片</h2>
    <p><code>:has(:focus)</code>匹配包含聚焦元素的祖先元素</p>
    <button>我是一个在卡片里的按钮</a>
</div>
  
<a href="#" class="card">
    <h2>卡片自身就是一个焦点元素（链接元素）</h2>
    <p><code>:focus-within</code> 匹配具有聚焦元素的祖先元素及其自身</p>
</a>

<a href="#" class="card">
    <h2>卡片自身就是一个焦点元素（链接元素），并且卡片里还有一个焦点元素（按钮）</h2>
    <p><code>:focus-within</code> 匹配具有聚焦元素的祖先元素及其自身</p>
    <button>我是一个在链接中的按钮(请不要这样做)</button>
</a>
```

```CSS
/* 与:has(:focus)的行为相同，因为我们只针对父元素的子元素 */
div:focus-within {
    background: red;
    outline: 2px solid red;
    outline-offset: 2px;
}

/* 行为与:focus-within相同，因为我们只针对父元素的子元素 */
div:has(:focus) {
    background: lightblue;
    outline: 2px solid lightblue;
    outline-offset: 2px;
}

/* 与:has(:focus)的行为不同，因为我们匹配的是父元素本身的状态 */
a:focus-within {
    background: pink;
    outline: 2px solid pink;
    outline-offset: 2px;
}

/* 与:focus-within的行为不同，当父元素链接本身聚焦时不匹配，但是当我们聚焦链接内的按钮时它会匹配 */
a:has(:focus) {
    background: lime;
    outline: 1px solid lime;
    outline-offset: 2px;
}

a:has(button) {
    border: 2px solid red;
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ac5a0293c2e45afa408c032d5709760~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgLXmj>

## 自定义焦点环样式

前面提到过了，各主流浏览器对焦点环的默认样式都不统一，而且大多时候都不能符合设计师的要求，因此，很多开发者为了避免默认焦点环的样式影响 Web UI 的美观，都会在 CSS 代码中设置一个全局的样式删除浏览器的默认焦点环的样式：

```CSS
* {
    outline: none;
}
```

其实不推荐这么做。这样做对于 Web 可访问性的伤害是致命的，对于那些强度依赖于键盘访问的用户来说更是不友好的，因为可聚焦元素失去焦点环样式，会造成用户不知道自己浏览 Web 的时候处在什么位置。

如果你希望满足设计师对于焦点环样式的要求，我们可以通过 CSS 来为自己的应用定制焦点环样式。 只是需要记得，自定义焦点环 UI 时，不能仅给 `:focus` 状态添加样式，还需要考虑 `:focus-visible` 状态下的样式。

在 CSS 中，我们有很多种方式可以用来帮助大家自定义焦点环样式，比如：

*   改变可聚焦元素的背景颜色
*   改变可聚焦元素的文本颜色
*   使用 `box-shadow` 来模拟 `outline`
*   改变可聚焦元素的大小
*   使用动效来增强可聚焦元素
*   复制可聚焦元素现有的悬浮状态效果

接下来，我们通过具体的示例来介绍这些定义焦点环样式的方法。

### 改变可聚焦元素的背景色

对于可填充的元素，比如按钮，在焦点状态给其添加对比度较高的背景颜色是比较好。比如 Codepen 上有些地方就采用这种方式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb02eaf23b3f4bad89d2ffb8d92d3b1f~tplv-k3u1fbpfcp-zoom-1.image)

我们可以像下面这样写：

```CSS
button:focus:not(:focus-visible) { 
    outline: none; 
    background-color: #3e4454; 
    color: #fff; 
} 

button:focus-visible { 
    outline: none; 
    background-color: #3d4352; 
    color: #fff; 
}
```

上面的代码区分了鼠标点击和按键盘 `Tab` 两种方式下，`button` 聚焦下焦点环样式，从代码上也能看出来，背景颜色略有差异。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b397b027eee4eb099d17a9308d6ec59~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJxwXj>

### 改变可聚焦元素的文本颜色

如果可聚焦元素有文本，可以考虑在聚焦状态下改变其文本颜色。改变文本颜色需要注意的是，文本颜色的对比度。

```CSS
a:focus:not(:focus-visible) { 
    outline: none; 
    color: #ffeb3b; 
} 

a:focus-visible { 
    outline: none; 
    color: #00bcd4; 
}
```

对于 `<a>` 链接，我们还可以使用 CSS 的 `text-decoration` 来改为文本下划线的效果：

```CSS
a:focus:not(:focus-visible) { 
    outline: none; 
    color: #ffeb3b; 
    text-decoration-line: underline; 
    text-underline-offset: 6px; 
    text-decoration-color: #00bcd4; 
} 

a:focus-visible { 
    outline: none; 
    color: #00bcd4; 
    text-decoration-style: wavy; 
    text-underline-offset: 6px; 
    text-decoration-color: #ffeb3b; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45b780fa72b54b6da7f599e5ba54631e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExdvPVv>

对于其他可聚焦元素，比如 `<button>` 不建议只修改文本颜色，为了让用户能更直观知道元素聚焦了，还可以结合其他样式规则来设置焦点环样式。

### 使用 box-shadow 来模拟 outline

`outline` 常用来给可聚焦元素设焦点环样式的属性，只不过它的功能有一定的局限性，因此灵活度不是太高。而 CSS 的 `box-shadow` 可以做与 `outline` 完全相同的事情，而且功能要更强，灵活性更大。比如说，使用 `box-shadow` 可以更好地控件轮廓的颜色、透明度、偏移、模糊等等，而且还不会影响盒子大小。

我们可以像下面这样使用 `box-shadow` 给 `<a>`、`<input>` 和 `<button>` 等可聚焦元素设置焦点环样式：

```CSS
:focus:not(:focus-visible) { 
    outline: none; 
    box-shadow: 0 0 0 3px #03a9f4d9; 
} 

:focus-visible { 
    outline: none; 
    box-shadow: 0 0 0 3px #03f4e0b8; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33749f7c7f4c4f559b5eb027e4b67642~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgjGGd>

同样的，使用 `box-shadow` 的多个值，还可以模拟出带有 `outline-offset` 的焦点环样式：

```CSS
:focus:not(:focus-visible) {
    outline: none;
    box-shadow: 0 0 0 3px rgb(255 255 255 / 0.8), 0 0 0 6px #03a9f4d9;
}

:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgb(255 255 255 / 0.8), 0 0 0 6px #03f4e0b8;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e92f0f9feac46b78affa781f3fa50fc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGmrEpb>

### 改变可聚焦元素的大小

当聚焦元素得到焦点时，使用 `transform` 轻微的改变可聚焦元素的尺寸大小。

```CSS
:focus:not(:focus-visible) { 
    outline: none; 
    transform: scale(1.05); 
} 

:focus-visible { 
    outline: none; 
    transform: scale(1.1); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99dfa1dd7b1f44e59a53953f46c43439~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dygzGMK>

这里的关键就是“轻微”的调整焦点元素尺寸，如果尺寸调整过大可能会导致页面的回重排，会影响 Web 的性能。另外，在 CSS 中的盒模型属性都可以用来调整元素的尺寸，但这些属性的调整会影响 Web 的布局。因此，我们在示例中使用 `trasform` 的 `scale()`函数。

### 使用动效来增强可聚焦元素

在 [Material 的表单组件](https://material.io/components/text-fields)中，当 `input` 获得焦点时，相应的 `label` 会有移动，其自身的边框也会有一个微妙的动效：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e8937ea250f4525969467e2bfc54a45~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，我们在给聚焦元素设置样式时，除了上面提到的还可以通过一些动效来完成。比如下面这个示例：

```HTML
<div class="control">
    <input class="effect-1" type="text" placeholder="Placeholder Text">
    <span class="focus-border"></span>
</div>
```

```CSS
.control {
    position: relative;
}

input[type="text"] {
    color: #fff;
    width: 100%;
    box-sizing: border-box;
    letter-spacing: 1px;
    padding: 0.5em 1em;
    outline: none;
}

.effect-1 {
    border: 0;
    padding: 7px 0;
    border-bottom: 1px solid pink;
    background-color: transparent;
}

.effect-1 ~ .focus-border {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #3399ff;
    transition: 0.4s;
}

.effect-1:focus:not(:focus-visible) ~ .focus-border {
    width: 100%;
    transition: 0.4s;
}

.effect-1:focus-visible ~ .focus-border {
    width: 100%;
    transition: 0.4s;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/732d494d88eb4ab1b7c7e92f7b3be142~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEqJQpL>

除此之外，@Maurice Mahan 创建了一个用于聚焦元素上焦点环的库 [FocusOverlay](https://github.com/mmahandev/FocusOverlay)。该库实现了焦点从一个元素到另一个元素时焦点环的动画效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04247a2410574ee29057a4410547a641~tplv-k3u1fbpfcp-zoom-1.image)

### 复制可聚焦元素现有的悬浮状态效果

如果元素已经具有对比度悬停样式，那么你可以简单地采用该样式并将其应用于聚焦状态。这是一种相当优雅的解决方案，因为你不必在界面中添加任何新的颜色或轮廓线。

以下是一个示例，其中聚焦状态和悬停状态都采用了与元素默认样式背景高对比度的效果：

```CSS
a:hover,
button:hover,
input:hover {
    color: #fff;
    background-color: #5a5f73;
}

:focus:not(:focus-visible) {
    outline: none;
    color: #fff;
    background-color: #5a5f73;
}

:focus-visible {
    outline: none;
    color: #fff;
    background-color: #5a5f73;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ac5ead5cc23474595ca10ded96b3c3b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWPvKop>

## 不要遗忘了 outline-offset 属性

在自定义焦点环样式中，我们所看到的都是假设我们想要完全移除焦点环的轮廓线，即：

```CSS
:focus {
    ouline: none;
}
```

但我们在给可聚焦元素设置焦点环样式时，就不应该如此。实际上，我们也可以使用 `outline` 来构建一个自定义的焦点环样式。例如：

```CSS
:focus:not(:focus-visible) {
    outline: 4px solid #09f;
}

:focus-visible {
    outline: thin double #f36;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5238ea462c249c7bcf96c17dfc1de56~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBJXbxy>

注意，CSS 的 `outline` 属性是 `outline-style` 、`outline-color` 和 `outline-width` 三个属性的简写。使用 `outline` 绘制的轮廓线位于盒子元素的 `border` 之外：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd98c2499da24b3eacf054b083cb36cb~tplv-k3u1fbpfcp-zoom-1.image)

它和 `box-shadow` 相似，虽然可以给元素添加轮廓线，但它并不会影响元素盒子的尺寸大小。

另外，使用 `outline` 定制轮廓线时，还可以使用 `outline-offset` 属性来改变焦点环的位置，只是具体使用的时候，两个属性要分开来单独使用：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2151f45092b64bc58e5d255f59b1f697~tplv-k3u1fbpfcp-zoom-1.image)

> 图片来源于：<https://twitter.com/csaba_kissi/status/1533702507574222848>

也就是说，你可以将 `outline` 、`outline-offset` 和 CSS 自定义属性组合在一起来定制可聚焦元素的焦点环（主要是指轮廓线）的效果：

```CSS
:root {
    --outline-color: #09f;
    --outline-style: solid;
    --outline-width: thin;
    --outline-offset: 0;
}

:focus:not(:focus-visible) {
    outline: var(--outline-width) var(--outline-style) var(--outline-color);
    outline-offset: var(--outline-offset);
}

:focus-visible {
    outline: var(--outline-width) var(--outline-style) var(--outline-color);
    outline-offset: var(--outline-offset);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5de98623e3244b09aa6a6b6eb1838ed~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzJxwJM>

## 小结

时至今日，你除了使用 `:focus` 之外，还可以使用 `:focus-visible` 或者 `:focus-within` 来给可聚焦元素设置焦点环样式。它们之间的差异是：

*   `:focus` 选中当前可聚焦的元素，通常用于为元素定义外观或行为，或者在该元素上实现键盘导航；
*   `:focus-visible` 与 `:focus` 十分相似，但它只考虑用户是否使用键盘导航。这个伪类会排除因鼠标点击或其他鼠标事件触发焦点的元素；
*   `:focus-within` 选中由其后代元素获得焦点的父元素，用于将某些样式应用于当前焦点所在区域的元素。

这些伪类选择器可以帮助我们通过样式的改变增强网站或应用程序的可访问性。例如，使用明确的焦点状态可以帮助使用键盘或其他辅助技术的用户更好地使用我们的界面。

值得重复的是，在采用自定义焦点状态时，不要忘记使用明显的颜色对比度和其他视觉提示。确保我们都可以获得与设计一致的体验，同时我们也可以遵循良好的可访问性实践。
