Web 开发者总是希望自己开发的 Web 应用或页面能在所有设备上正确显示。然而，尽管你已经很努力了，但仍然可能面临破碎的布局。当某些单词太长无法适应其容器时，就会出将 Web 布局打破。当你处理用户生成的内容，例如帖子的评论内容，可能会发生内容溢出，这些内容你无法控制。因此，你需要应用样式来防止内容溢出其容器。

内容溢出是前端开发人员经常遇到的问题。在 Web 上，当你的内容不能完全适应其包含元素（容器）时，就会发出溢出，并且会溢出到容器之外。在 CSS 中，你可能主要使用 `overflow` 、`word-wrap` 、`overflow-wrap` 和 `word-break` 等属性来管理内容溢出。虽然这些方法可以很好的帮助你管理内容溢出，但它们都无法使换行的文本平衡排列，比如使两行标题在每行字数上保持一致。

庆幸的是，CSS 工作组在 [CSS 文本模块 Level 4 （CSS Text Module Level 4）中引入了一个名为 `text-wrap` 的属性](https://www.w3.org/TR/css-text-4/#text-wrapping)，允许你以更细粒度的方式控制文本换行。

基本上，`text-wrap` 属性将使浏览器以看起来更平衡的方式换行文本，以获得更好的可读性并防止排版孤行。更具体地说，当 `text-wrap` 属性的值为 `balance` 时，浏览器将尝试以一种方式包装文本，使元素的最后一行与第一行一样长。正如可以预期的那样，这对于使标题看起来更好非常有用。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d57583e4c28445f7a7ae85779f1260a5~tplv-k3u1fbpfcp-zoom-1.image)

接下来，我们将一起来学习如何利用这一行 CSS 大幅改善文本布局。

## 换行所存在的缺陷

Web 设计师在处理长内容时，为了使文本换行在排版上得到一定的平衡，时常会手动调整每行文本显示的数量。比如在 Figma 设计软件上，设计师故意将最后一个词移到上一行，或者将其调整为两行。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f39650466954492b5e8acc1a74dbc02~tplv-k3u1fbpfcp-zoom-1.image)

上图中，第一个设计效果中，突出显示的单词是位于一行中的单个单词。从视觉的角度来看，这看起来很奇怪，它打破了原本的视觉设计效果。此时，Web 设计师为了避免这种不一致的问题，可能会手动调整将最后一个单词移入到第一行。事实上，上图中第二种效果也可能并非是最佳的，它在视觉上要比第三种设计效果显得更局促和拥挤。它会让你感觉 UI 效果更平衡一些。

Web 设计师在像 Figma 的软件中可以很轻易改变平衡的方式，但对于 Web 开发者而言，在没有 `text-wrap: balance` 之前是无法改变文本排版的平衡方式。当然，你可以选择改变 HTML 的结构来实现文本平衡的排版，比如通过使用 `<br />` 手动完成，或者用 `<span>` （类似这样的 HTML 标签）分隔内容的另一部分，或者通过使用 `<wbr>` 或 `­` 辅助文本布局，以更智能地决定断行和断词的位置：

```HTML
<h1>You’ll want to savor every <br/> last drop in our coffe.</h1>
​
<!-- 或者 -->
<h1>You’ll want to savor every <span>last drop in our coffe.</span></h1>
​
<!-- 或者 -->
​
<h1>You’ll want to savor every <wbr>last drop in our coffe.</h1>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18744556132a4d3f8ae351aeb725e94d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKrNJam>

作为开发者，你无法知道标题或段落的最终大小、字体大小甚至语言。所有需要有效、美观的文字换行处理的变量都在浏览器中。这就是为什么我们会看到像下图中的标题换行：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed8ee605d6c147fe8d2fabbfcf17e0db~tplv-k3u1fbpfcp-zoom-1.image)

CSS 的 `text-wrap: balance` ，可以要求浏览器为文本找到最佳平衡行包装方案。浏览器确实知道所有的因素，如字体大小、语言和分配的区域。结果看起来像这样：

```CSS
.balanced {
    max-inline-size: 30ch;
    text-wrap: balance;
}
​
.unbalanced {
    max-inline-size: 30ch;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a01ceecfcc0407796522787e87dbba7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExONrmp>

你的眼睛应该更喜欢平衡的文本块。它更容易吸引注意力，整体上更容易阅读。

另外，你现在已经知道了，在 CSS 中可以使用最新的特性 `text-wrap: balance` 使文本排版在换行时能更趋于平衡。但在深入介绍 `text-wrap` 之间，我还是想花点篇幅向大家介绍一些其他的换行方式。

## CSS 中的换行姿势

让我们来谈谈我们可以控制文本在 Web 上换行（或不换行）的各种方法。 CSS 为我们提供了很多用于控制文本换行的属性，比如 `word-wrap`、`overflow-wrap` 和 `word-break` 等，以确保我们的文本流动方式符合我们的意愿，但我们还将介绍一些使用 HTML 和特殊字符的技巧。

通常，文本在一个容器中都会在“软换行位置”处换行，指的是你希望文本自然换行的位置，例如单词之间或连字符后面。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51a8d218812a4d4f97909499b6b13e0a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLQVZzP>

但有时，你可能会发现长字符的文本没有软换行的位置，例如非常长的单词或 URL。这可能会引起各种布局问题。例如，文本可能会溢出其容器，或者它可能会强制容器变得过宽并使其他元素位置不正确。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59702f042bb141e6a092e7d6abb77d6e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQBxer>

Web 开发者在开发 Web 应用或页面时，预期文本未换行的问题是良好的[防御性编程](https://juejin.cn/book/7199571709102391328?utm_source=profile_book)。幸运的是，CSS 为我们提供了一些特性，允许你能更好的处理文本换行的问题，避免 [Web 布局](https://juejin.cn/book/7161370789680250917?utm_source=profile_book)的破碎。

### 使溢出的文本换行

在元素上设置 `overflow-wrap:break-word` 将允许文本在必要时中断单词。它将首先尝试通过将单词移到下一行来保持单词未经过分割，但如果仍然没有足够的空间，它会强制把单词中断。

```CSS
p {
    overflow-wrap: break-word;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/428769e5df9349a89531b39532e9a56b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEmBwvx>

还有 `overflow-wrap: anywhere`，以相同的方式中断单词。不同之处在于它如何影响其所在元素的 `min-content` 大小计算。当宽度设置为 `min-content` 时，很容易看到。

```CSS
.break-word {
    width: min-content;
    overflow-wrap: break-word;
}
​
.anywhere {
    width: min-content;
    overflow-wrap: anywhere;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dbbed19866b4a8e8223858cfb08e982~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxbVRN>

具有 `overflow-wrap: break-word` 的 `.break-word` 元素会计算 `min-content` 的宽度，就像没有单词被分割一样，因此其宽度变成了最长单词的宽度。而 `overflow-wrap: anywhere` 的 `.anywhere` 元素会计算它可以创建的所有断点的 `min-content`。由于断点可以出现在任何位置，因此 `min-content` 最终是单个字符的宽度。

请记住，只有在涉及 `min-content` 时才会出现此行为。如果我们将宽度设置为某个固定的值，我们会看到两者会产生相同的分词结果。

```CSS
.break-word {
    max-inline-size: 76ch;
    overflow-wrap: break-word;
}
​
.anywhere {
    max-inline-size: 76ch;
    overflow-wrap: anywhere;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1119e12385f64e069fca538388f1461b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzbLVV>

### 无情地断词

另一个分割单词的选项是 `word-break: break-all`。这个选项甚至不会尝试保持单词完整，它会立即将它们打破。看一下。

```CSS
p {
    word-break: break-all;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3e8e33766e049bc954caa8bcfe7785f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQRByV>

`word-break: break-all` 没有问题地打破单词，但还是会谨慎处理标点符号。例如，它会避免以句子末尾的句点开始一行。如果你想完全无情地分割单词，即使有标点符号，可以使用 `line-break: anywhere`。

```CSS
.word-break {
    word-break: break-all;
}
​
.line-break {
    line-break: anywhere;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f37277400784bf3a35f63eb4830776f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYomYY>

请注意，`word-break: break-all` 将 `k` 下移以避免以 `.` 开始第二行。与此同时，`line-break: anywhere` 不在乎。

### 过多的标点符号

让我们看看到目前为止我们涵盖的 CSS 属性如何处理过长的标点符号。

```CSS
.overflow-wrap {
    overflow-wrap: break-word;
}
​
.word-break {
    word-break: break-all;
}
​
.line-break {
  line-break: anywhere;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8e1b6ff5cc24b73967324935fadb22f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMobev>

`overflow-wrap: break-word` 和 `line-break: anywhere` 能够保持内容不超出容器范围，但是 `word-break: break-all` 再次对标点符号感到困惑，这一次导致文本溢出。

这是需要注意的问题。如果你绝对不希望文本溢出，请注意 `word-break: break-all` 无法阻止标点符号的溢出。

### 指定单词断行位置

为了更好的控制，你可以手动插入 `<wbr>` 到你的文本中控制单词的断行。你还可以使用和 HTML 实体符 `&ZeroWidthSpace;` 。

让我们通过将一条通常不会自动换行的长 URL 限制在段落之间的方式来看看它们的实际运用。

```HTML
<!-- normal -->
<p>https://subdomain.somewhere.co.uk</p>
​
<!-- <wbr> -->
<p>https://subdomain<wbr>.somewhere<wbr>.co<wbr>.uk</p>
​
<!-- &ZeroWidthSpace; -->
<p>https://subdomain&ZeroWidthSpace;.somewhere&ZeroWidthSpace;.co&ZeroWidthSpace;.uk</p>
  
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5074ec21dfe4cd58f2b93e2ae2a877a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQYVRW>

### 自动断字

你可以使用 `hyphens: auto` 告诉浏览器在适当的位置分隔和连字单词。连字规则由语言决定，因此你需要告诉浏览器使用哪种语言。可以在 HTML 中的元素上直接指定 `lang` 属性，也可以在 `<html>` 上指定。

```HTML
<p lang="en">This is just a bit of arbitrary text to show hyphenation in action.</p>
```

```CSS
p {
    hyphens: auto;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/050f7aeea87e459b9204e34bc4f0704d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzRpgor>

### 手动断字

你还可以亲自动手并使用 HTML 实体符手动插入“软连字符”（`&shy;`）。除非浏览器决定在此处换行（这时会出现连字符），否则它将不可见。请注意，在下面的示例中，我们使用两次，但只看到文本换行处出现了一次。

```HTML
<p lang="en">Magic? Abraca&shy;dabra? Abraca&shy;dabra!</p>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05155bde81604b4098be3842796b0ade~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQBoEd>

必须将 `hyphens` 设置为 `auto` 或 `manual`，才能正确显示。方便的是，`hyphens` 的默认值是 `manual`，因此你可以不需要任何额外的 CSS 就可以正常使用（除非某些原因声明了 `hyphens: none`）。

### 防止文本换行

我们来切换话题。有时你可能不希望文本自由换行，以便更好地控制内容呈现方式。以下是几种方式可以帮助你防止文本换行。

首先是 `white-space: nowrap`，以防止其文本自然换行。

```CSS
p {
    white-space: nowrap;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edca2c2f3f83421b9d38f1cdd702dc10~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 在址：<https://codepen.io/airen/full/RwqKrwx>

还有 `white-space: pre`，它将按照你在 HTML 中键入的格式换行文本。不过要注意，它也会保留 HTML 中的空格，因此请注意你的格式。你还可以使用 `<pre>` 元素来获得相同的结果（它默认使用 `white-space: pre`）。

```HTML
<!-- 这个 HTML 的格式会导致额外的空白空间! -->
<p>
  What's worse, ignorance or apathy?
  I don't know and I don't care.
</p>
​
<!-- 这个 HTML 的格式不会导致额外的空白空间  -->
<p>What's worse, ignorance or apathy?
I don't know and I don't care.</p>
​
<!-- 和上面的效果相同，但使用的是 <pre> 标签元素 -->
<pre>What's worse, ignorance or apathy?
I don't know and I don't care.</pre>
```

```CSS
p {
    white-space: pre;
}
​
pre {
    font-family: inherit;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81f95bfb36884e8f9dcbf535ece4bb27~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqKrPQ>

### 在哪里单词无法断开换行？

对于换行，你可以在具有 `white-space: nowrap` 或 `white-space: pre` 的元素中使用 `<br>` 标签，文本将自动换行。

但是如果你在这样的元素中使用 `<wbr>` 会发生什么呢？有点伪命题，因为浏览器对此没有统一的解决方案。Chrome 和 Edge 浏览器将识别 `<wbr>` 并可能换行，而 Firefox 和 Safari则不会。

但是，当涉及到零宽度空格（`&ZeroWidthSpace;`）时，浏览器是一致的。没有任何浏览器会在 `white-space: nowrap`或`white-space: pre` 中换行文本。

```HTML
<p>Darth Vader: Nooooooooooooo<br>oooo!</p>
​
<p>Darth Vader: Nooooooooooooo<wbr>oooo!</p>
​
<p>Darth Vader: Nooooooooooooo&ZeroWidthSpace;oooo!</p>
```

```CSS
p {
    white-space: pre;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eae742d7a459482d8d695b920dfab973~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWypXdd>

### 非断空格

有时你可能希望文本在某些地方自由换行，而在其他地方则不允许。好消息！有一些专门的 HTML 实体符可以让你做到这一点。

“非断空格”（`&nbsp;`）通常用于保持单词之间的间距，但不允许它们之间换行。

```
<p>Something I've noticed is designers don't seem to like orphans.</p>
​
<p>Something I've noticed is designers don't seem to like&nbsp;orphans.</p>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e0b18daf4144d8f857e22ae047bbf29~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzJKbw>

### 单词连接符和不换行连字符

即使没有空格，文本也可能自然地换行，例如在连字符后面。为了防止在不添加空格的情况下换行，你可以使用⁠ `&NoBreak;⁠`（区分大小写！）来获得“单词连接符”。特别针对连字符，可以使用 `&#8209` （即 `‑`）获得“不换行连字符”。

```
<p>Turn right here to get on I-85.</p>
​
<p>Turn right here to get on I-&NoBreak;85.</p>
​
<p>Turn right here to get on I&#8209;85.</p>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4c31879314d40c2aeeae9e12ea11a51~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGpjpv>

### CJK 文本和单词断行

在某些方面，CJK（指中文、日文和韩文）文本的行为与非 CJK 文本不同。特定的 CSS 属性和值可用于更精细地控制 CJK 文本的换行。

浏览器默认的行为允许在 CJK 文本中断词。这意味着 `word-break: normal`（默认值）和 `word-break: break-all` 将给你相同的结果。但是，你可以使用 `word-break: keep-all` 防止 CJK 文本在单词内换行（非CJK 文本不受影响）。

以下是一个韩文示例。请注意“**자랑스럽게**”这个词是否断行。

```HTML
<p>나는 나의 감자 컬렉션을 매우 자랑스럽게 생각합니다.</p>
```

```CSS
.break-all {
    word-break: break-all;
}
​
.keep-all {
    word-break: keep-all;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3688b6849c7c462f97e8a80d6e57d4d3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjeEGNJ>

不过要注意，中文和日文不像韩文一样在单词之间使用空格，因此 `word-break: keep-all` 如果没有其他方式处理，很容易导致文本溢出。

```HTML
<p>나는 나의 감자 컬렉션을 매우 자랑스럽게 생각합니다.</p>
​
<p>我非常骄傲地拥有自己的土豆收藏。</p>
​
<p>私は自分のジャガイモコレクションを非常に誇りに思っています。</p>
```

```CSS
:root {
    --word-break: keep-all;
}
​
p {
    word-break: var(--word-break);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d6265b13e014f08a220d852cddc5b58~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLQgeXN>

### CJK 文本和换行规则

我们之前在非 CJK 文本时提到了 `line-break: anywhere` 及其如何在标点处断行。对于 CJK 文本也是一样的。

```HTML
<p>我的梦想是在乡村安静地生活。我能够跳起脚尖舞。</p>
​
<p>私の夢は田舎で静かに暮らすことだ。私は爪先立ちで踊れる。</p>
​
<p>내 꿈은 시골에서 조용히 살고 싶다。 나는 발끝 춤을 출 수 있어。</p>
```

```CSS
p {
    line-break: anywhere;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf0a49aefe34482f8121dc78dab56134~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQgJyd>

请注意示例中日文中的 `。` 是否允许单独占一行。

`line-break` 属性还有其他值影响 CJK 文本的换行，例如 `loose`、`normal` 和 `strict`。这些属性值告诉浏览器在决定插入换行符的位置时使用哪些规则。[W3C 规范描述了几个规则](https://drafts.csswg.org/css-text-3/#line-break-property)，浏览器也可以添加自己的规则。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e68d419842c432cbec51ac1a2af4646~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwroYz>

### 伪元素换行

你可以通过伪元素的一些技巧，在保持它作为内联元素的同时，在内联元素之前和（或）之后强制换行。

首先，将 `::before` 或 `::after` 伪元素的 `content` 属性值设置为 `"\A"` ，这将使你获得新的行字符。然后设置 `white-space: pre` 以确保新行字符起作用。

```HTML
<p>Things that go <span>bump</span> in the night.</p>
```

```CSS
span {
    background-color: #000;
}
​
span::before, 
span::after {
    content: '\A';
    white-space: pre;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/055f4a799fb540a39490d50de5586704~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjeEGwp>

### overflow-wrap 和 word-wrap 的差异

`overflow-wrap` 和 `word-wrap` 这两个属性都可用于管理内容溢出，但它们处理方式略有不同。

-   使用 `overflow-wrap` 属性，整个溢出的单词可以在不溢出其容器的情况下换行。只有当无法在不溢出的情况下放置它时，浏览器才会将单词打破。
-   使用 `word-wrap: break-word` 则将溢出的单词换行到新行上，并在两个字符之间将其截断。不管在哪一行，只要溢出的单词无法在其当前行显示，都将在两个字符之间无情的截断。一些书写系统（比如 CJK 书写系统）在使用 `word-break` 截断文本换行时，浏览器会考虑到书写的严格分词规则

简单地说，如果要包裹文本或截断溢出的单词，请使用 `overflow-wrap` 属性。如果 `overflow-wrap` 属性无法满足你的需求时，请尝试使用 `word-break` 属性。但是，请注意上述 `overflow-wrap` 和 `word-break` 之间的区别。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de64661863ad45909fee802a396caa32~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQgWqp>

## CSS 中的文本平衡

正如上面所述，虽然在 CSS 中有很多种方式方法可以使文本换行，但它们都无法使换行的文本在容器中平衡排版。不过 `text-wrap` 属性的出现，改变了这一现象。我们只需要将 `text-wrap` 属性的值设置为 `balance` 即可：

```CSS
.balanced {
    max-inline-size: 50ch;
    text-wrap: balance;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79d270c3e7994ec88274753d29ee7bd6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjeERPb>

`text-wrap` 除了设置 `balance` 值之外，还可以接受 `wrap` 、`nowrap` 、`stable` 和 `pretty` 等值。其每个值的含义如下：

-   `wrap`：允许内联级内容在允许的软换行机会处换行，由正在生效的断行规则来决定，以最小化内联轴溢出。确切的算法由 UA 定义。算法在做断行决策时可以考虑多行。UA 可能会在速度优先于最佳布局的情况下进行偏向。UA 不得尝试像平衡一样使所有行（包括最后一行）变得平均。该值选择 UA 首选（或最兼容 Web）的换行算法。
-   `nowrap`：内联级内容不会跨多行换行；不适合块容器的内容将溢出。
-   `balance`：对于内联框来说与 `wrap` 相同。对于建立内联格式上下文的块容器，如果能够实现比 `wrap` 更好的平衡，则选择断行以平衡每个行框中剩余（空）空间。如果 `text-wrap` 被设置为 `wrap`，则这不会改变块将包含的行框的数量。要考虑的剩余空间是在放置浮动和内联内容之后，但在由于文本对齐而进行任何调整之前。当剩余空间的平均内联尺寸的标准偏差在块（包括以强制换行结束的行）上降低时，行框平衡。 确切的算法由 UA 定义。如果需要平衡的行多于十行，则 UA 可以将此值视为 `wrap`。
-   `stable`：当应用于建立内联格式上下文的块容器时，指定在做断行决策时后续文本行不应被考虑，这样当编辑文本时，光标之前的任何内容都保持稳定；否则相当于 `wrap`。
-   `pretty`：当应用于建立内联格式上下文的块容器时，指定 UA 应以更好的布局为优先，而非以速度为优先，并且预计会在做断行决策时考虑多行。否则相当于 `wrap`。

无论 `text-wrap` 的值如何，行总是在强制断行处分行：对于所有值，必须遵守 [UAX14 ](https://www.w3.org/TR/css-text-4/#biblio-uax14)中定义的 BK、CR、LF、CM、NL 和 SG 断行类别的行为。此外，如果允许换行（即 `text-wrap` 不是 `nowrap`），必须遵守 [UAX14](https://www.w3.org/TR/css-text-4/#biblio-uax14) 中定义的 WJ、ZW 和 GL 断行类别的行为。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3adf96f835041a991a08edaf62bfd47~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzRNGyE>

## 找到平衡点

在 Web 中，读者首先看到的是标题，它们应该在视觉上吸引人且易于阅读。这可以吸引用户的注意力并提供质量和保障的感觉。好的排版可以给读者信心，鼓励他们继续阅读。因此，我们在处理标题的排版时，就可以使用 `text-wrap: balance` 让标题在视觉上达到平衡：

```CSS
.headlines {
    text-wrap: balance;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a8fbc788b0c4f72aaf24ec0b16c20bd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjeERpr>

注意，在设置 `text-wrap` 的元素上需要显式设置一个宽度值，比如 `width` 或 `max-width` 之类，只有这样才能使文本换行。上面示例中，它的宽度根据其容器宽度来决定。

原则上说，Web 上标题之处都可以使用该特性（即 `text-wrap: balance`）使标题在容器中排版达到平衡，例如页面的标题、组件的标题等：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a29b5b60ce8a419ca81e0c722acabb5f~tplv-k3u1fbpfcp-zoom-1.image)

但这并不能说，`text-wrap: balance` 只能用于 Web 标题上，也可以用于一些提示性的文字之上，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27e7b28594554a11bee9bf890059fa8f~tplv-k3u1fbpfcp-zoom-1.image)

但在正文中平衡文本并不常见，因为它不需要突出或吸引读者的注意力。

## 平衡文本的缺陷

虽然 `text-wrap: balance` 以自动化的方式将平衡文本的艺术带到 Web 中，并借鉴了印刷行业设计师的工作和传统，但平衡文本的使用也是有一定缺陷存在的。比如下面所列的这几个点：

-   文本平衡不会影响元素的宽度
-   行数限制
-   考虑性能
-   与 `white-space` 属性的交互

### 文本平衡不会影响元素的宽度

在 CSS 中使用文本平衡（`text-wrap: balance`）不会影响元素的宽度，例如：

```CSS
.balance {
    max-width: 630px;
    text-wrap: balance;
}
```

标题的最大宽度为 `630px` ，并且会对齐每行字数，但其中 `max-width` 并不会受到任何的影响：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51399703743344b8968f39a1fba11e5b~tplv-k3u1fbpfcp-zoom-1.image)

同样的事情也会发生在容器很小的时候，比如将 `max-width` 从 `630px` 调小至 `330px` 时，它只会影响容器中的单词：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24b1be0f52ac46c785d52df4ce044845~tplv-k3u1fbpfcp-zoom-1.image)

这种现象看上去是蛮好的，但它同时也是一种缺陷。在某些设计中，它会留下很大的空间，它会让用户在感觉上并不美观，甚至不平衡。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20359f26d410426e9208d630d33a1358~tplv-k3u1fbpfcp-zoom-1.image)

注意，上图中粉红色轮廓中文本的宽度。应用文本平衡（`text-wrap: balance`）后，宽度将保持不变，只有文本会重新排序。这会让右侧留下一个很大的空白，会使设计效果不平衡。所以针对这类固定宽度的场景需要斟酌使用。

因此，有一些情况下，`text-wrap: balance` 并不是那么好，至少在我的看法中。例如前面所展示的卡片内的标题示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/557e23b8f5a849ce8a2fc209dca903cd~tplv-k3u1fbpfcp-zoom-1.image)

平衡文本而会给包含的元素创建不平衡。

### 行数限制

在使用 `text-wrap: balance` 实现平衡文本排版时，浏览器是自动完成的。浏览器在完成这个任务时，并不是免费的，它需要循环迭代来发现最佳的平衡换行解决方案。这对于 Web 性能来说是有极大影响的，因此为了降低它对 Web 性能带来较大的影响，浏览器是通过一个规则来缓解的，即四行行数的限制。

也就是说，当文本行数超过四行时，`text-wrap: balance` 是不起作用的，它无法实现平衡文本换行。例如下面这个示例，第二段的行数显然超过了四行，你是无法看到它平衡换行的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dae0345763847b6b05018ddf1192c4a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQRjLm>

### 考虑性能

正如上面示例所示，`text-wrap` 设置值为 `balance` 时，有一个四行行数的限制。这样做是为了降级其对 Web 性能的影响。因此，在你的 CSS 中千万不要像下面这样使用 `text-wrap` ，因为它是一种浪费请求，并可能影响页面渲染速度：

```CSS
* {
    text-wrap: balance;
}
```

相反，应该考虑这样做：

```CSS
h1, 
h2, 
h3, 
h4, 
h5, 
h6, 
blockquote {
    text-wrap: balance;
}
```

### 与 white-sapce 属性的交互

在介绍 `text-wrap` 时，不知道你是否有发现过，当 `text-wrap` 的值为 `nowrap` 时，它也会使文本在容器中不换行。它的效果与 `white-space` 取值为 `nowrap` 是等同的。

但有的时候很有可能在使用 `text-wrap` 实现平衡文本排版（`text-wrap` 取值为 `balance` 时）会与 `white-space` 属性共存，那么这样一来，两者就会发生一种竞争关系，它会使的浏览器无法操作了，是要不换行呢还是换行呢？因为这两个属性，一个要求不换行，另一个要求平衡换行。

为了避免该现象，可以将 `white-space` 的值设置为 `unset` 。这样一来，文本平衡换行排版可以再次应用：

```CSS
.balanced {
    white-space: unset;
    text-wrap: balance;
}
```

> 有关于 `unset` 所起的作用，可以移步阅读小册的《[09 | CSS 的显式默认值：inherit 、initial 、unset 和 revert](https://juejin.cn/book/7223230325122400288/section/7232094160071688227)》一节课。

## 小结

虽然这节课的标题是“经典排版技术：使用 `text-wrap: balance` 实现文本平衡换行”，但在介绍该特性的过程中，顺便把 CSS 中所有关于换行的知识都介绍过了。我想，通过这节课的学习，你能更好的掌握如何使用 CSS 的特性让文本换行，避免文本溢出打破 Web 布局。

这些换行的技术将使文本换行在视觉 UI 上有所不同，但能达到文本平衡换行的只有 `text-wrap: balance` 。这是一个很不错且实用的 CSS 特性，在很多场景中都可以使用它，尤其是在页面标题、组件标题、提示信息、引言等地方，使得文本平衡排版，使得这些文版本在视觉上吸引人且易于阅读。这可以吸引用户的注意力并提供质量和保障的感觉。另外，一个好的排版可以给读者信心，鼓励他们继续阅读。

当然，`text-wrap: balance` 也有其一定的缺陷存在，比如超过四行文本是无法达到文本平衡排版效果的。而且文本平衡排版并不会改变所在容器尺寸，这在某些场景之下，会使得容器有一大片空白区域存在，也有可能会影响到视觉上的美观。

所以，在使用 `text-wrap: balance` 实现文本平衡换行时，也需要根据具体的场景来决定，千万不要盲目的给所有文本排版采用该策略。