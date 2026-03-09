据我所知，CSS 计数器在 Web 上并没有得到充分利用，尽管它们的支持非常好（IE8 +）！事实上，我们使用 CSS 计数器可以做很多事情，比如你可以更多地控制数字的外观。除此之外，你还可以根据元素在文档中的位置给内容自动生成数字。在这节课中，我将解释如何在项目中使用计数器，以及一些用例。

## 先从列表说起

在 HTML 中有两个列表元素，分别是无序列表（`<ul>`）和有序列表（`<ol>`），它们都有子元素 `<li>` ，它被称为列表项。无序列表和有序列表最大的区别是：

-   无序列表代表一个项目的列表，其中列表项的顺序并不重要，改变列表项目顺序不具有实质性的意义，也不会改变文档的语义
-   有序列表代表一个项目的列表，其中列表项被有意地排序，这样一来，改变顺序会改变文档的语义

例如：

```HTML
<div class="wrapper"> 
    <p>I have lived in the following countries:</p> 
    <ul> 
        <li>Switzerland</li> 
        <li>Norway</li> 
        <li>United Kingdom</li> 
        <li>United States</li> 
    </ul> 
</div> 
​
<div class="wrapper"> 
    <p>I have lived in the following countries (given in the order of when I first lived there):</p> 
    <ol> 
        <li>Switzerland</li> 
        <li>United Kingdom</li> 
        <li>United States</li> 
        <li>Norway</li> 
    </ol> 
</div>
```

在 HTML 中，除了语义化之外，`<ol>` 上有两个 `<ul>` 没有的属性，即 `reversed` 和 `start` ，其中 `reversed` 可以用来倒排列表项，而 `start` 可以设置列表项的起始序列号。例如：

```HTML
<ol>
    <li>Switzerland</li>
    <li>United Kingdom</li>
    <li>United States</li>
    <li>Norway</li>
</ol>
​
<ol reversed>
    <li>Switzerland</li>
    <li>United Kingdom</li>
    <li>United States</li>
    <li>Norway</li>
</ol>
​
<ol start="5">
    <li>Switzerland</li>
    <li>United Kingdom</li>
    <li>United States</li>
    <li>Norway</li>
</ol>
​
<ol start="5" reversed>
    <li>Switzerland</li>
    <li>United Kingdom</li>
    <li>United States</li>
    <li>Norway</li>
</ol>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be6d1c66f4834ebd864c8acd1bbd39c9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzdKqge>

尽科我们在 HTML 中经常使用列表（`<ul>` 或 `<ol>`），但大部分 Web 开发者并不太关注它们。其实，在 Web 中有很多东西可以很有逻辑地被标记为一个列表。比如，我们在构建分步器、时间轴或排序元素时，可以自然地使用有序列表 `<ol>` 标记；但 Web 设计中的许多东西可以使用无序列表 `<ul>` 来标记，比如导航菜单。

默认情况之下，如果我们不使用 CSS 对其做任何样式上的设置，一般情况下，客户端（比如浏览器）对列表会有一些初始样式的设置。例如， `ol` 和 `ul` 的 `list-style-type` 属性：

-   `ol` 的 `list-style-type` 的值是 `decimal` （中文是阿拉伯数字）
-   `ul` 的 `list-style-type` 的值是 `disc` （一个实心圆点）

它们的子元素 `li` 的 `display` 属性的值为 `list-item` 。它将会创建一个块级的盒子，并有一个额外的标记框（Marker Box），这个标记框是用来放置标记符号（`ul`）或数字（`ol`）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9854f67ab67a4b43b545ac0c6c796818~tplv-k3u1fbpfcp-zoom-1.image)

也就是说：“**一个具有** **`display: list-item`** **的元素将会为该元素的内容生成一个块盒（Block Box），并且根据** **`list-style-type`** **或** **`list-style-image`** **的值，还可能生成一个标记框（Marker Box），作为该元素是一个列表项的视觉指示**”。

我们可以使用 CSS 为这两个框设置样式，也可以做很多有意思的事情，稍后我们会聊到这些。

## CSS 计数器的简介

简单地说，CSS 计数器允许你根据内容在文档中的位置调整其显示的外观。例如，你可以使用计数器自动为 Web 页面中的标题编号，或者更改有序列表的编号。

本质上 CSS 计数器是由 CSS 维护的变量，这些变量可能根据 CSS 规则跟踪使用次数以递增或递减。你可以自定义一个计数器，也可以修改 `list-item` 这一默认生成的应用于所有有序列表的计数器。

在 CSS 中，CSS 计数器的工作需要三个 `C` ，它们是：

-   `counter-reset`
-   `counter-increment`
-   `counter()` 或 `counters()`

也就是说，CSS 计数器将会涉及以下内容：

-   在 `::before` 、`::after` 和 `::marker` 伪元素上使用 `content` 可以生成内容
-   `content` 内容可以由 `counter()` 或 `counters()` 函数指定
-   `counter-reset` 和 `counter-increment` 可以自动编号
-   `@counter-style` 可以自定义计数器样式

上述这些内容，我们可以在 W3C 的 **[CSS 列表和计数器模块](https://www.w3.org/TR/css-lists-3/)**（CSS Lists and Counters Module Level 3）中获取：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02bf9b2c18244fc4a86b305334ac81a0~tplv-k3u1fbpfcp-zoom-1.image)

## 列表标记样式

CSS 对列表项（`li`）都有默认的标记符号，无序列表一般是实心圆点，有序列表一般是小写的阿拉伯数字。只不过，很多时候默认的标记符号无法满足 Web 设计的需求。在 CSS 中，我们可以使用 `list-style` 属性给列表项设置样式。该属性有三个子属性：

-   `list-style-type` ：设置标记符类型，其中有序列表标记符默认是 `decimal` （一般是阿拉伯数字），无序列表标记符默认是 `disc` （一般是实心圆点）
-   `list-style-image` ：设置标记符为图像，有点类似于 CSS 的 `background-image` ，其默认值为 `none`
-   `list-style-position` ：设置标记符位置，有点类似于 CSS 的 `background-position` ，不过它只有 `outside` 和 `inside` 两个值，其中 `outside` 是其默认值

这些都是 CSS 的基础知识，这里就不做过多的阐述，你可以尝试在下面的示例中调整相应的参数，查看其结果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/017f55afff3348e791a30147c0bed309~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLGBgeY>

## 计数器样式

CSS1 给 `ul` 和 `ol` 定义了少数的计数器样式，虽然在 CSS2.2 中略有扩展，但它并没有解决世界范围内的排版需求。

不过，在 [CSS Counter Styles Level 3](https://www.w3.org/TR/css-counter-styles-3) 定义了 `@counter-style` 规则，它允许 CSS 以一种开放的方式来解决这个问题，允许 Web 开发者定义自己的计数器样式 。然后，这些样式可以在 `list-style-type` 属性或 `counter()` 和 `counters()` 函数中使用。它还定义了一些额外的预定义的计数器样式，特别是那些常见的但用 `@counter-style` 表示起来很复杂的样式。

计数器样式定义了如何将一个计数值转换成一个字符串。计数器样式由以下部分组成：

-   **名称（Name）** ：一个名称，用于识别计数器样式
-   **算法（Algorithm）** ：一种算法，将整数的计数器值转换为基本的字符串表示法
-   **负号（Negative）** ：它被预置或附加到负的计数器值的表示上
-   **前缀（Prefix）** ：指定一个符号，被添加到标记表示中，它出现在任何负号（Negative）之前
-   **后缀（Suffix）** ：指定一个符号，被添加到标记表示中，它出现在任何负号（Negative）之后
-   **范围（Range）** ：它限制了一个计数器样式所处理的值
-   **语音（Spoken）** ：描述如何在语音合成器中读出计数器样式
-   **备用（Fallback）** ：当计数器值超出计数器样式的范围，或计数器样式无法渲染计数器值时，用它来渲染

当被要求对一个特定的计数器值使用一个特定的计数器样式来生成一个计数器样式时，需要遵循以下步骤：

-   ①：如果计数器样式未知，则退出此算法，转而使用十进制（`decimal`）样式和相同的计数器值生成一个计数器表示
-   ②：如果计数器值超出了计数器样式的范围，则退出此算法，转而使用计数器样式的备用样式和相同的计数器值生成一个计数器表示
-   ③：使用计数器的值和计数器样式的算法，为计数器的值生成一个初始表示。如果计数器的值是负的，并且计数器样式使用负号，则使用计数器值的绝对值生成一个初始表示
-   ④：按照填充（`pad`）描述符的规定，将实体符（`symbols`）预置到表示中
-   ⑤：如果计数器的值是负数，并且计数器样式使用负号，那么按照负号描述符中的规定，用计数器样式的负号包裹表示
-   ⑥：返回表示

注意 ：前缀（`prefix`）和后缀（`suffix`）在这个算法中不起作用。这是故意的，前缀和后缀并不是 `counter()` 或 `counters()` 函数返回的字符串的一部分。相反，前缀和后缀是由构建 `::marker` 伪元素的 `content` 属性的值的算法添加的。这也意味着前缀和后缀总是来自于指定的计数器样式，即使实际表示的由备用样式构造的。

系统的某些值（比如 `symbolic`、`additive`）和某些描述符（比如 `pad`）可以生成与开发者提供的数字大小成线性的表示。这有可能被滥用，产生过大的表示，消耗用户的内存，甚至把浏览整趴下。用户代理必须支持至少 `60`个 `Unicode` 代码点的表示，但他们可以选择使用备用样式来处理长于 `60` 个 `Unicode` 代码点的表示。

## 自定义计数器样式

在 CSS 中我们可以使用 `@counter-style` 规则来自定义一个计数器样式，它允许开发者定义一个自定义的计数器的样式。可以像下面这样定义一个自定义计数器样式：

```CSS
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "❤️" "✨" "🔥" "😊" "😂" "🥺" "❤️🔥" "👍" "🥰" "🐻" "🍔" "⚽" "💨"
        "🎨" " 🐶";
    suffix: ":  ";
    prefix: " ";
    fallback: disc;
}
​
ul {
    list-style-type: custom-counter-style;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b684896f30f14086a59326506f9c18e7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjwPEyp>

`@counter-style` 自定义计数器样式，一般的形式是：

```CSS
@counter-style <counter-style-name> { 
    system: <counter system> ;
    symbols: <counter symbols> ; 
    additive-symbols: <additive-symbols> ;
    negative: <negative symbol> ;
    prefix: <prefix> ;
    suffix: <suffix> ;
    range: <range> ;
    pad: <padding> ;
    speak-as: <speak-as> ;
    fallback: <counter-style-name> ;
}
```

其中 `<counter-style-name>` 是一个 `<custom-ident>` ，可以是任意你喜欢的字符串，但要注意的是，关键词 `none`、`decimal`、`disc`、`square`、`circle`、`disclosure-open` 和 `disclosure-closed` 不能用于 `<counter-style-name>`。

> 注意： `<custom-ident>` 自动排除了 CSS 范围内的关键词。当然，也有例外，比如 `inside` 就是有效的，但用 `inside` 作为 `<counter-style-name>` 会和 `list-style-position` 中的 `inside` 相冲突，所以不建议这样使用。

另外，`<counter-style-name>` 是区分大小写的，比如 `custom-counter-style` 和 `customCounterStyle` 是表示两个不同的自定义计数器样式名称。不过，建议大家在给自定义计数器样式命名的时候，全部使用小写字母。

每个 `@counter-style` 定义的计数器样式都由一组描述符来指定，而且每个计数器风格描述符指的值可以是隐式的，也可以是显式的。如果这些描述等没有显式指定值，将会采用规范中定义的初始值。

`@counter-style` 中描述符主要有：

-   `system`：指一个算法，用于将计数器的整数值转化为字符串表示，其初始值为 `symbolic`
-   `negative`：指定一个符号，当计数器表示的值为负的时候，把这个符号加在值的前面或后面，其初始值为 `\2D`（即连字符 `-`）
-   `prefix`： 指定一个符号，加在标记符的前面。前缀在最后阶段才会被加上，所以在计数器的最终表示中，它在 `negative` 前，其初始值为空字符串 `" "`
-   `suffix`： 类似于 `prefix`，`suffix` 指定一个符号，加在标记符的后面，其初始值为 `\2E20`（即实心的圆点 `.`）
-   `range`： 指定一个自定义计数器生效的范围，如果计数器的值不再这个范围内，那么自定义的计数器样式不会生效，这个时候会使用 `fallback`指定的值，其初始值为 `auto`
-   `pad`： 在你想要给标记符最小值时使用。比如说，你想要计数器从 `01` 开始，经过 `02`，`03`，`04`，那么这时可以使用 `pad`。对于大于 `pad` 指定值的表示符，标记会恢复为 `normal`，其初始值为 `0 " "`
-   `fallback`： 定义一个备用的系统，当自定义的系统不能使用或者计数器的值超过了定义的范围时使用。如果备用系统也不能表示计数器的值，那么备用系统的备用系统（如果有的话）将会启用。如果没有指定备用系统，或备用系统链不能够正确表示一个值，那么最终会降为十进制样式表示。其初始值为 `decimal`
-   `symbols`： 定义一个符号，用于标记符。符号可以包含字符串、图片或自定义的识别码。这个符号会根据`system` 描述符里所定义的算法来构建。其初始值为 `n/a`
-   `additive-symbols`： 尽管 `symbols` 属性中指定的符号可以被 `system` 中定义的大部分算法所使用，但是一些 `system` 属性的值，比如 `additive`，依赖于本描述符所描述的加性元组。每个加性元组包含一个可数的符号和一个非负证书的权重。其初始值为 `n/a`
-   `speak-as`： 定义如何在语音识别器中读出计数器样式，比如屏幕阅读器。例如基于该描述符的值，标记符的值可以作为有序列表的数字或者字幕作为无序列表的音频提示读出。其初始值为`auto`

在 CSS 中可以使用 `@counter-style` 同时定义多个计数器样式。如果多个 `@counter-style` 的规则被定义为同一个名称，那么放在后面的那个将生效。`@counter-style` 规则是原子式（Atomically）级联，如果一个规则取代了另一个同名的规则，它就完全取代了它，而不是仅仅取代它所指的特定描述符。

> 注意，即使是预定义的计数器样式也可以被覆盖；UA 样式表发生在任何其他样式表之前，所以预定义的样式表在级联中总是失败。

`@counter-style` 规则也符合 CSS 的向前兼容的解析要求，如果浏览器无法正常解析 `@counter-style`，那么该规则定义的计数器样式规则将被视为无效，会被浏览器忽略。这个时候将会采用预置的计数器样式。

### 计数器算法：system 描述符

`@counter-style` 中的 `system` 描述符是用来指定使用哪种算法来构建计数器的值。例如 `cyclic` （循环算法），计数器样式会重复循环它们的符号，而 `numeric`（数字计数算法）将计数器样式的符号解释为数字。 整个 `system` 描述符的值有 `cyclic`、 `numeric` 、 `alphabetic` 、 `symbolic` 、 `additive` 、 `[fixed <integer>?]` 和 `[ extends <counter-style-name> ]`，其默认值为 `symbolic`。

`system` 的每个值都与 `symbols` 或 `additive-symbols` 描述符相关联，并且有一个相应的描述符必须具备的最小长度。如果一个 `@counter-style` 的规则不能满足这个要求，它就不能定义一个计数器样式（该规则在语法上仍然有效，但没有效果）。

接下来，我们花点时间来看看 `system` 每个值对应的算法规则是什么。

#### 循环算法：cyclic

`cyclic` 是一个循环算法，其提供的符号会反复循环使用，当它到达列表末尾时，又从头开始。它可以只有一个符号，也可以使用多个符号。第一个计数器符号被用作值 `1` 的表示，第二个计数器符号（如果它存在）被用作值 `2` 表示，依此类推。

如果 `system` 是 `cyclic` ，`symbols` 描述符号必须至少包含一个计数器符号。这个 `system` 是在所有计数器值上定义的。

```CSS
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "❤️";
}
​
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "❤️" "✨" "🔥";
}
​
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "❤️" "✨" "🔥" "😊" "😂" "🥺";
}
​
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "❤️" "✨" "🔥" "😊" "😂" "🥺" "👍" "🥰" "🐻" "🍔" "⚽" "💨" "🎨" "🐶";
}
​
​
ul {
    list-style-type: custom-counter-style;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/523ee03b4c454af8b34cb7a8e0e68c37~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRPKrwb>

正如你所看到的，如果 `cyclic` 中的 `symbols` 只有一个计数器符号，那么所有列表项的标记符号都会是 `symbols` 指定的标记符；如果 `cyclic` 中的 `symbols` 有 `N` 个计数器符号，并且列表项的总数是 `V` ，则标记符会循环次数会取 `V / N` 整数，余下的从 `symbols` 中开始计。

比如上面示例中，列表项总数（`V`）等于 `19`（有 `19` 个 `li` ），当 `symbols` 的计数器符号 `N`的值是 `2` 时，`V ÷ N = 9.5` ，取 `9.5` 的整数值 `9` ，表示会循环 `9` 次，并余下 `1` 个，从 `symbols` 最开始的计：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cc5d9f138d744b8b08c750d8f8327ad~tplv-k3u1fbpfcp-zoom-1.image)

如果 `symbols` 的计数器符号 `N` 的值是 `3` 时， `V ÷ N = 6.3333` ，取 `6.3333` 的整数值 `6` ，并余下 `1` 个，那么 `symbols` 中的计数器符号将会循环 `6` 次，余下的一个会从 `symbols` 最开始计：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc6e31eb2e234896ac30c44fb31ea277~tplv-k3u1fbpfcp-zoom-1.image)

如果列表项总数变成 `20` 个，`symbols` 的计数器符号 `N` 还是等于 `3` ， `V ÷ N = 6.6667` ，取 `6.6667` 的整数 `6` ，并余下 `1` ，那么 `symbols` 中的计数器符号将会循环 `6` 次，余下的一个会从 `symbols` 最开始计。你会发现，相比前两个情景，`symbols` 循环 `6` 次之后还会剩下 `2` 个列表项（`20 - 3 × 6 = 2`），此时余下的列表项符依旧从 `symbols` 最开始计，即余下的第一个会是 `"❤️"` ，余下的第二个会是 `"✨"` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f3f63bcdb3f455a90ee3db5836ac26b~tplv-k3u1fbpfcp-zoom-1.image)

依此类推。

#### 固定算法：fixed

固定计数器 `fixed` 在其计数器符号列表中运行一次，然后采用回退值。在列表项数量有限情况下，这个计数器样式是很有用的。例如在 `symbols` 指定了有限数量的符号（Unicode）。

如果 `system` 是 `fixed`，`symbols` 描述符号必须至少包含一个计数器符号。这个 `system` 是在有限范围内的计数器值上定义的，从第一个符号值开始，其长度等于计数器符号列表的长度。

```CSS
@counter-style games {
    system: fixed;
    symbols: "♠" "♡" "♢" "♣" "♤" "♥" "♦" "♧";
}
​
ul {
    list-style-type: games;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7fecf6be0ff47429591d34f98551e67~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKbPxpW>

调整 `symbols` 的计数器数量，可以看到固定标记符的变化，余下的将会采用备用值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e94a8b1c48494551a6feb2c6e259760a~tplv-k3u1fbpfcp-zoom-1.image)

第一个计数器符号是 `symbols` 的第一个符号，随后的计数器值由随后的计数器符号表示。一旦计数器符号用完，进一步的值就不能用 `symbols` 中的符号表示（它不能循环使用），而必须用备用（`fallback`）的计数器样式，如果未设置 `fallback` 的值，将采用其初始值，即 `decimal`。

当这个 `system` 被指定为 `fixed` 时，还可以在它后面提供一个整数，用来设置第一个符号的起始值。如果省略它，第一个符号值是 `1`。

```CSS
@counter-style games { 
    system: fixed 5; 
    symbols: '♠' '♡' '♢' '♣' '♤' '♥' '♦' '♧'; 
}
​
ul {
    list-style-type: games;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6e92186f8a44bcfa97cee25bd15df33~tplv-k3u1fbpfcp-zoom-1.image)

正如上面示例所示，`symbols` 的第一个值从第五个列表项开始，随后的计数器值由随后的计数器符号表示。一旦计数器符号用完，进一步的值就会采用 `fallback` 的值。另外，在指定的第一个符号值之前也会采用 `fallback` 的值，比如示例中的第一个到第四个列表项，采用的就是 `fallback` 的值。因为示例在 `system` 指定了第一个符号的开始值是 `5`。

你可以尝试改变 `fixed` 后的值，查看相应的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91fb50fd03a94f3bb25cc64bd584cc7b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYbOLBM>

#### 重复算法：symbolic

`system` 指定 `symbolic` 算法时，计数器系统在其提供的符号中反复循环，这里的循环不是列表项顺序的循环，而在计数器符号自身的重复，将会以 `N` 的倍数重复。例如，`symbols` 指定的符号是 `♔` 和 `♕` （即 `symbols: "♔" "♕"`），那么：

-   第一个列表项的标记符号是 `♔`
-   第二个列表项的标记符号是 `♕`
-   第三个列表项的标记符号是 `♔♔`
-   第四个列表项的标记符号是 `♕♕`
-   以此类推

我们来看一个具体的示例：

```CSS
@counter-style chess { 
    system: symbolic; 
    symbols: "♔" "♕"; 
} 
​
ul { 
    list-style-type: chess; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/960c13bbfedb48b3b4c5f09e67afddc0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOXNvGL>

另外，**要是** **`system`** **是** **`symbolic`** **，那么** **`symbols`** **描述符必须至少包含一个计数器符号**。

#### 双射算法：alphabetic

`alphabetic` 将计数器符号列表解释为字母编号系统的数字，类似于默认的 `lower-alpha` 计数器样式，从 `a`、`b`、`c` 到 `aa`、`ab`、`ac`。`alphabetic` 系统不包含代表 `0` 的数字，因此当一个新的数字被添加时，第一个值只有第一个数字组成。`alphabetic` 通常用于列表，也出现在许多电子表格程序中，用于对列进行编号。列表中的第一个计数器符号被解释为数字 `1`，第二个被解释为数字 `2`，以此类推。

**如果** **`system`** **指定的值是** **`alphabetic`**，那么 **`symbols`** **必须至少包含两个计数器符号**。比如下面这个示例：

```CSS
@counter-style chess { 
    system: alphabetic; 
    symbols: "♔" "♕"; 
} 
​
ul { 
    list-style-type: chess; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be408371cd554199b23b02c5d1b7de2f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNoBZJZ>

#### 位值算法：numeric

`numeric` 计数器系统将计数器符号列表解释为 `place-value` （位值）编号系统的数字，类似于默认十进制（`decimal`）计数器样式。`symbols` 中的第一个计数符号被解释为数字 `0`，第二个被解释为数字 `1`，以此类推。

**如果** **`system`** **是** **`numeric`**，**`symbols`** **必须至少包含两个计数器符号**。。 比如下面这个“四进制”计数器样式：

```CSS
@counter-style quadratic { 
    system: numeric; 
    symbols: '0' '1' '2' '3'; 
} 
​
ul { 
    list-style-type: numeric; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e46beff43d842daa31a92f331669679~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYbOLjL>

#### 累积算法： additive

`additive` 计数器系统用于表示符号值（`sign-value`）的数字系统，它不是在不同的位置上重复使用数字来改变其值，而是定义具有更大值的额外数字，因此，数字的值可以通过将所有数字相加得到。这在罗马数字和世界各地的其他数字系统中使用。

**如果 `system` 是 `additive`，加法符号（`additive-symbols`）描述符必须至少包含一个加法元组**。比如：

```CSS
@counter-style dice { 
    system: additive; 
    additive-symbols: 6 ⚅, 5 ⚄, 4 ⚃, 3 ⚂, 2 ⚁, 1 ⚀; 
} 

ul { 
    list-style-type: dice; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25b58bd30dcd47ea978e7485eba8feb9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWeKLLv>

#### 从现有的计数器样式中扩展：extends

`extends` 系统允许开发者使用另一种计数器样式的算法，但改变其他方面，比如负号或后缀。如果一个计数器样式使用 `extends`，任何未指定的描述符必须取自指定的扩展计数器样式，而不是其初始值。

如果 `@counter-style` 使用了 `extends`，它必须不包含 `symbols` 或 `additive-symbols` 描述符，否则 `@counter-style` 将无效。

如果指定的 `<counter-style-name>` 是 ASCII 大小写不敏感的 `disc`、`circle`、`square`、`disclosure-open` 或 `disclosure-closed`（任何预定义符号计数器样式），使用 `extends` 从规范样式表提供的规则的“标准”定义中扩展。

如果指定的计数器样式名称不是任何已定义的计数器样式名称，它必须被当作是扩展十进制（`decimal`）计数器样式。如果一个或多个 `@counter-style` 规则与它们的扩展值形成一个循环，所有参与该循环的计数器样式必须当作是对十进制计数器样式的扩展。

```CSS
@counter-style decimal-paren { 
    system: extends decimal; 
    suffix: " » "; 
} 
​
ul { 
    list-style-type: decimal-paren; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dff96c3b34849f18d59b3b310fb319b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJrLoap>

### 负值的格式化：negative

描述符 `negative` 描述符定义了当计数器值为负数时如何改变表示方法。 当计数器值为负数时，值中的第一个`<symbol>` 将被预加到表示中。如果指定了第二个 `<symbol>`，那么当计数器值为负数时，第二个 `<symbol>` 将被附加到表示中。 例如，指定 `negative: "(" ")"` 将使负数值被包裹在圆括号中，这有时会在金融背景下使用，如 `(2) (1) 0 1 2 3 ...`。

不是所有的 `system` 值都使用负值。特别是，如果一个计数器样式的 `system` 值是 `symbolic`、 `alphabetic` 、 `numeric` 、 `additive` 或 `extends` 的计数器样式本身使用 `negative`，那么它就使用负号。如果一个计数器样式不使用负号，它在生成计数器表示时会忽略负号。

### 标记前的符号：prefix

描述符 `prefix` 描述符指定了一个 `<symbol>`，它被预置在标记符中，其默认值为空字符串（`" "`）。`prefix` 出现在任何负号（`negative`）之前。 例如：

```CSS
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "❤️";
    prefix: " 🎯 ";
    negative: "(" ")";
}

ul {
    list-style-type: custom-counter-style;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e643c12f6df04d588fdbbad56f4baef6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxmKaMo>

### 标记后的符号：suffix

描述符 `suffix` 描述符指定了一个 `<symbol>`，它被附加到标记符中，其默认值为实心圆点（`"\2E20"`，即`"."`）。`suffix` 被添加到表示中的 `negative` 之后。

```CSS
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "❤️";
    prefix: " ↢ ";
    suffix: " ↣ ";
    negative: "(" ")";
}
​
ul {
    list-style-type: custom-counter-style;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0688d4c887274095859550db654814a4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWorymj>

### 限制计数器范围：range

描述符 `range` 描述符定义了计数器样式所定义的范围。如果一个计数器样式被用来表示一个超出其范围的计数器值，该计数器样式反而会下降到其备用（`fallback`）的计数器样式。

`range` 可取的值有 `auto` 和 `[ [ <integer> | infinite ]{2} ]#`，其初始值为 `auto`。 当 `range`取值为 `auto` 时，这个范围取决于计数器的 `system` ：

-   对于 `cyclic`、`numeric` 和 `fixed` 算法，其范围是负无穷到正无穷（`-∞ ~ +∞`）
-   对于 `alphabetic` 和 `symbolic` 算法，其范围是 `1` 到正无穷大（`1 ~ +∞`）
-   对于 `additive` 算法，其范围是 `0` 到正无穷大（`0 ~ +∞`）
-   对于 `extends` 算法，范围是自动生成的扩展系统的任何内容；如果扩展一个复杂的预定义样式，范围是该样式的定义范围

当 `range` 取值 `[[<integer> | infinite]{2}] #` 时，它定义了一个用逗号（`,`）隔开的范围列表。对于每个单独的范围，第一个值是下限，第二个值是上限。这个范围是包容性的，它同时包含了上限和下限的数字。如果无穷值被用作一个范围的第一个值，它代表负无穷（`-∞`）；如果被用作第二个值，它代表正无穷（`+∞`）。计数器样式的范围是列表中定义的所有范围的联合。如果任何范围的下限高于（大于）上限，整个描述符是无效的，必须被忽略。

### 零填充和恒定宽度表示：pad

描述符 `pad` 描述符允许你指定一种“固定宽度”（Fixed-width）的计数器样式，在这种样式中，小于 `pad` 值的表示法将被填充一个特定的 `<symbol>`。大于指定的 `pad` 值的表示法将被正常构建。

`pad` 的值为 `<integer [0,∞]> &&<symbol>`，它的初始值为 `0 ""`。 其中 `<integer>` 指定了一个所有计数器表示必须达到的最小长度。让差值为所提供的 `<integer>` 减去计数器值的初始表示中的字母簇的数量。（注意，根据生成计数器表示法的算法，这发生在添加前缀（`prefix`）、后缀（`suffix`）或负数（`negative`）之前）。如果计数器的值是负的，并且计数器样式使用负号，那么就用计数器样式的负描述符的 `<symbol>`。如果差值大于零，则将指定的 `<symbol>` 的差值副本预置到表示中。

> 注意，负的 `<integer>` 值是不允许的。

最常见的“固定宽度”（Fixed-width）编号的例子是用 `0` 填充。例如，如果你知道所使用的数字将小于 `1000`，可以用一个 `pad: 3 "0"` 来垫宽，确保所有的表示法都是三位宽。例如，这将导致 `1` 被表示为 `001`，`20` 表示为 `020`，`300` 被表示为 `300`，`4000` 被表示为 `4000`，而 `-5` 被表示为 `-05`。

注意，`pad` 描述符计算 `<symbol>` 中的字母簇的数量，但用 `<symbols>` 进行填充。如果指定的 `pad` 的 `<symbol>` 是多字符，这很可能不会产生预期的效果。不幸的是，没有办法在不违反有用约束条件的情况下使用 `pad` 中 `<symbol>` 中的字母簇的数量。建议开发者在 `pad` 描述符中只指定单一字母簇的 `<symbol>`。

### 定义回退值：fallback

描述符 `fallback` 描述符指定了一个备用的（回退）的计数器样式，当当前的计数器样式不能为一个给定的计数器值创建表示时，将被使用。例如，如果一个以 `1 ~ 10` 为范围定义的计数器样式被要求表示一个 `11` 的计数器值，那么该计数器值的表示就会用 `fallback` 指定的样式。

如果 `fallback` 的值不是任何定义的计数器样式的名称，`fallback` 描述符的使用值就会被替换为 `decimal`。同样的，在 `fallback` 寻找可以渲染给定计数器值的计数器样式时，如果检测到指定回退中的循环，必须使用十进制样式来替代。

### 标记字符：symbols 和 additive-symbols

描述符 `symbols` 和 `additive-symbols` 指定系统描述符所指定的标记构建算法所使用的符号。

-   如果计数器的 `system` 是 `cyclic`、`numeric`、`alphabetic`、`symbolic` 或 `fixed`，`@counter-style` 规则必须有一个有效的符号（`symbols`）；
-   如果计数器的 `system` 是 `additive`，则必须有一个有效的 `additive-symbols` 描述符，否则 `@counter-style` 没有定义一个计数器样式（但仍然是一个有效的规则）。

有些计数器系统（`system`）指定符号描述符（`symbols`）必须至少有两个条目。如果计数器样式的系统是这样的，而符号描述符（`symbols`）只有一个条目，那么 `@counter-style` 规则就没有定义计数器样式。

符号（`symbols`）描述符的值中的每一个条目都定义了一个计数器符号，根据计数器样式的系统，它的解释是不同的。`additive-symbols`描述符的值中的每个条目都定义了个加法元组，它由一个计数器符号和一个整数权重组成。每个权重必须是一个非负的整数，加法无组必须按照严格的权重递减顺序来指定，否则，声明是无效的，必须被忽略。

计数器符号可以是字符串、图像和标识符，这三种类型可以混合在一个描述符中。计数器的表示方法将计数器符号串联起来构建的。标识符被渲染为包含相同字符的字符串。图像被渲染为内联替换的元素。图像计数器符号的默认对象大小是一个 `1em x 1em` 的正方形。

### 语音合成：speak-as

一种计数器样式可以被构建为具有明显的视觉意义，但不可能通过语音合成器或其他非视觉手段来有意义地表达，或者是可能的，但在朗读时是无意义的。`speak-as` 描述符描述了如何给定的计数器样式来合成计数器格式的口语形式。辅助技术在读出计数器样式时应该使用这种口语形式，并且可以使用 `speak-as` 值为通知转换为语音以外的输出。

`speak-as` 主要的值有 `auto`、`bullets`、`numbers`、`words`、`spell-out` 和 `<counter-style-name>`。

-   `auto`：如果计数器样式的 `system` 是 `alphabetic`，这个值与拼写的效果相同；如果 `system` 是 `cyclic`，这个值与 `bullets`效果相同；如果 `system` 是 `extends`，这个值的效果与自动对扩展样式的效果相同。否则，此值与数字具有相同的效果
-   `bullets`： UA 说一个 UA 定义的短语或音频提示，代表一个无序列表被读出
-   `numbers`：计数器的数字值被说成是内容语言中的数字
-   `words`：像平常一样为数值生成一个计数器表示法，然后在内容语言中作为普通文本朗读出来。如果计数器的表示法包含图像，则改用处理数字（`numbers`）的方式处理该值
-   `spell-out`：为该值生成一个正常的计数器表示，然后用内容语言逐个字母地拼出它。如果 UA 不知道如何读出这些符号（或计数器表示包含图像），它必须像处理数字（`numbers`）一样处理该值
-   `<counter-style-name>`：反之，计数器的值将以指定的样式读出（类似于为计数器值生成表示法时的回退描述符的行为）。如果指定的样式不存在，该值将被视为 `auto`；如果在跟随 `speak-as` 引用时检测到一个循环，对于参与该循环的计数器样式，该值被视为 `auto`

来看一个简单示例。当所使用的符号实际上不是字母时，将发音推到另一种计数器样式的能力会有所帮助。例如，这里有一个可能的定义，即使用一些特殊的 Unicode 字符的 `circulared-lower-latin` 计数器样式：

```CSS
@counter-style circled-lower-latin { 
    system: alphabetic; 
    speak-as: lower-latin; 
    symbols: ⓐ ⓑ ⓒ ⓓ ⓔ ⓕ ⓖ ⓗ ⓘ ⓙ ⓚ ⓛ ⓜ ⓝ ⓞ ⓟ ⓠ ⓡ ⓢ ⓣ ⓤ ⓥ ⓦ ⓧ ⓨ ⓩ; 
    suffix: " "; 
} 
```

将其系统（`system`）设置为 `alphabetic` ，通常会使 UA 尝试读出字符的名称，但在这种情况下，这可能是“环形字母A”这样的东西，这不太可能有意义。相反，明确的将 `speak-as` 设置为 `lower-latin`，可以确保它们被读出相应的拉丁文字母，正如预期的那样。

## 定义匿名计数器样式：symbols() 函数

`symbols()` 函数允许在一个属性值中定义一个计数器样式，当一个样式在一个样式表中只使用一次，而定义一个完整 `@counter-style` 规则将是多余的。它没有提供 `@counter-style` 规则的全部功能，但提供了一个足够的子集，仍然是有用的。

`symbols()` 函数定义了一个没有名字的匿名计数器样式：

-   前缀（`prefix`）为 `" "`（空字符串）
-   后缀（`suffix`）为 `" "`（`U+0020` 相当于键的 SPACE 键）
-   范围（`range`）为 `auto`
-   回退值（`fallback`）为 `decimal`
-   负值（`negative`）为 `"\2D"`（连字符 `-`）
-   填充（`pad`）为 `0 " "`
-   语音合成（`speak-as`）为 `auto`

计数器样式的算法是前面介绍的 `system` ：

-   如果 `system` 被省略，则使用 `symboic`，以及提供的 `<string>` 和 `<image>` 作为 `symbols` 的值来构建。
-   如果 `system` 是 `fixed` ，第一个符号（`symbol`）值是 `1`。
-   如果 `system` 是 `alphabetic` 或 `numeric`，必须至少有两个 `<string>` 或 `<image>`，否则该函数无效。

例如：

```CSS
ol { 
    list-style-type: symbols("*" "\2020" "\2021" "\A7"); 
} 
​
ol { 
    list-style-type: symbols(cyclic "*" "\2020" "\2021" "\A7"); 
} 
​
ul { 
    list-style-type: symbols(cyclic '○' '●'); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00c4f9341dfc40b881841ff6c14279a8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxmKQPP> （请使用 Firefox 浏览器查看）

## 预定义计数器样式和 @counter-style

在 CSS 的 `list-style-type` 中有一些预定义样式，比如我们熟悉的 `decimal`、`lower-alpha`、`disc` 和 `cjk-earthly-branch` 等。对于这些预定义的样式标记我们可以使用 `@counter-style` 规则来对他们重新定义。比如：

```CSS
@counter-style decimal { 
    system: numeric; 
    symbols: '0' '1' '2' '3' '4' '5' '6' '7' '8' '9'; 
} 
​
@counter-style lower-alpha { 
    system: alphabetic; 
    symbols: a b c d e f g h i j k l m n o p q r s t u v w x y z; 
} 
​
@counter-style disc { 
    system: cyclic; 
    symbols: "\2022"; /* • */ 
    suffix: " "; 
} 
​
@counter-style cjk-earthly-branch { 
    system: fixed; 
    symbols: "\5B50" "\4E11" "\5BC5" "\536F" "\8FB0" "\5DF3" "\5348" "\672A" "\7533" "\9149" "\620C" "\4EA5"; /* 子 丑 寅 卯 辰 巳 午 未 申 酉 戌 亥 */ 
    suffix: "、"; 
} 
```

在 [CSS Counter Styles Level 3 规范中罗列了使用 @counter-style 重新定义的所有预定义列表标记](https://www.w3.org/TR/css-counter-styles-3/#predefined-counters)。

除此之外，还有很多“现成的”计数器样式。这些现成的计数器样式是由国际化工作组在他们的“现成的计数器样式”文件中为各种世界语言提供的计数器样式。这些计数器样式也是使用 `@counter-style` 来定义的，比如阿拉伯语（Arabic）：

```CSS
@counter-style arabic-indic { 
    system: numeric; 
    symbols: '\660' '\661' '\662' '\663' '\664' '\665' '\666' '\667' '\668' '\669'; 
    /* symbols: '٠' '١' '٢' '٣' '٤' '٥' '٦' '٧' '٨' '٩'; */ 
} 
```

这些现成的计数器样式和客户端预置的计数器样式不同，因为这些计数器样式并不是客户端默认计数器样式，但我们可以通过 `@counter-style` 的方式来使用，比如，你可以根据自己的需要，从 [Ready-made Counter Styles](https://www.w3.org/TR/predefined-counter-styles/) 复制你所需要的 `@counter-style`：

```CSS
@counter-style cjk-decimal { 
    system: numeric; 
    range: 0 infinite; 
    symbols: '\3007' '\4E00' '\4E8C' '\4E09' '\56DB' '\4E94' '\516D' '\4E03' '\516B' '\4E5D'; 
    /* symbols: 〇 一 二 三 四 五 六 七 八 九; */ 
    suffix: '\3001'; /* suffix: "、" */ 
} 
```

然后可以在 `list-style-type`、`counter()`、`counters()` 中使用，比如：

```CSS
ul { 
    list-style-type: cjk-decima; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b458d7708248f1936ad3525ae328c9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYbOQrv>

## 生成内容：content

`content` 是 [CSS Generated Content Module Level 3 规范](https://www.w3.org/TR/css-content-3/#content-property)中的一部分。在 CSS 中，我们可以使用 `content` 让客户端（比如浏览器）渲染并非来自文档树的内容。比如说，在给外链的文本后面添加一个标记。

```CSS
a[href^="https://"]::after{ 
    content: "⇴"; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b34a5c1c87a04ab58a4ce26c187e9037~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNJvQyy>

除此之外，`content` 还可以像下面这样使用：

```CSS
h1::before { 
    content: counter(section) ": "; 
} 
​
.chapter { 
    counter-increment: chapter; 
} 
​
.chapter > .title::before { 
    content: "Chapter ";
    counter(chapter) "\A"; 
} 
​
.logo { 
    content: url(logo.mov), url(logo.mng), url(logo.png), none; 
} 
​
figure[alt] { 
    content: attr(href url), attr(alt); 
} 
​
figure:not([alt]) { 
    content: attr(href url), contents; 
} 
​
blockquote p::before { 
    content: open-quote 
} 
​
blockquote p::after { 
    content: no-close-quote 
} 
​
blockquote p:last-child::after { 
    content: close-quote 
} 
​
ol.toc a::after { 
    content: leader('.') target-counter(attr(href), page); 
} 
```

在 CSS 中，我们可以通过两种机制来生成内容：

-   `content` 属性与伪元素 `::before` 和 `::after` 一起使用
-   `content` 属性与伪元素 `::marker` 一起使用，`::marker` 来自于 `li` 元素或 `display` 为 `list-item` 的元素

也就是说，`content` 属性用在元素的 `::before`，`::after` 或 `::marker` 伪元素中插入内容。使用 `content` 属性插入的内容都是匿名的可替换元素。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6903559ca34c4d618e4e7b8b53ce2ac4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJrLaGJ>

## ::marker 伪元素

在 CSS 中，`li` 元素和使用 `display为list-item` 的元素都会有一个标记框（Marker Box），对应的就是 `::marker` 伪元素。简单地说，列表项的标记框（Marker Box）是由一个列表项的 `::marker` 伪元素生成的，而且作为该列表项的第一个子元素。列表项或 `display` 为 `list-item` 的元素标记符的特征（即标记符样式）是由这个标记框的样式决定的，它是一个符号或序列号。

在 CSS 布局模型中，列表项的标记由一个与每个列表项相关的标记框表示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2259e4f154664eccac487ba66aa6b74d~tplv-k3u1fbpfcp-zoom-1.image)

这个标记的内容可以通过列表项上的 `list-style-type` 和 `list-style-image` 属性以及 `::marker` 伪元素上的 `content` 来决定。虽然，使用 `list-style-image` 可以引用图片来调整标记符样式或使用 `list-style-type` 使用字符以及结合 `@counter-style` 自定义的标记符给列表标记符设置样式。但他们有一定的局限性，比如要控制他们的位置，个性化的样式等。但我们可以使用 `::marker` 伪元素 `content` 定义列表项标记符，并且可以很好的对其样式做个性化方面的处理。比如说，只改变列表项标记符的 颜色、大小、位置 等，甚至还可以构建个性化非常强的标记符效果。

### 列表项标记框的内容

W3C 规范中对于标记框的内容是什么，是有明确的规则。简单地说，标记框的内容是由下面这些条件中**第一个为真**的条件决定的：

-   ①：**`::marker`** **伪元素的** **`content`** **的值不是** **`normal`** ：标记框的内容由 `content` 属性决定，和伪元素 `::before` 和 `::after` 完全一样，但当 `content` 的值为 `none` 时，`::marker` 被移除，标记框中会没有任何内容
-   ②：**使用** **`list-style-image`** **属性给元素标记符设置为图像** ：标记框包含了一个匿名的内联替换元素（代表指定的标记图像），并且在标记图像后面紧跟了一个空格符（`U+0020`，即空格键符，相当于按了键盘上的 SPACE键）
-   ③：**使用** **`list-style-type`** **属性给元素设置了一个标记符** ：标记框包含一个由指定标记字符串组成的文本
-   否则，标记框会没有内容，并且 `::marker` 不会生成一个框，类似于 `display: none` 一样

我们通过示例来解释上面的规则。

```HTML
<!-- 无序列表 -->
<ul>
    <li class="list-item">Unordered list item</li>
</ul>

<!-- 有序列表 -->
<ol>
    <li class="list-item">Ordered list item</li>
</ol>  

<!-- display 为 list-item 的元素 --> 
<div class="list">
    <div class="list-item">display list item</div>
</div>     
```

默认情况下，即没有显式给列表项设置 `list-style-type` 和 `list-style-image` 属性值，这个时候：

-   无序列表（`<ul>`）的列表项（`li`）的 `list-style-type` 是 `disc`，`list-style-image` 为 `none`
-   有序列表（`<ol>`）的列表项（`li`）的 `list-style-type` 是 `decimal`，`list-style-image` 为 `none`
-   `display` 为 `list-item` 的元素，和无序列表项的表现相似，即 `list-style-type` 为 `disc`，`list-style-image` 为 `none`

相当于条件 ② 和 ③ 都成立（为真），因此你看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c79036ea6ab49ee86e2dfe9f79ea2a9~tplv-k3u1fbpfcp-zoom-1.image)

此时，如果你改变 `::marker` 伪元素的 `content` 属性的值不为 `normal` ：

```CSS
:root {
    --content: normal;
}
​
.list-item::marker {
    content: var(--content);
}
```

你会发现列表项的标记符将会以 `::marker` 伪元素的 `content` 为主：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c8e8864b8964316815a04a845608f05~tplv-k3u1fbpfcp-zoom-1.image)

此时：

-   当 `::marker` 的 `content` 的值为 `normal` 或 `inherit` 时，标记框的内容与 `list-style-type` 的默认值等同；
-   当 `::marker` 的 `content` 的值为 `none` 时，标记框会被移除，`::marker` 相当于设置了 `display: none` ；
-   当 `::marker` 的 `content` 的值不是 `normal` 、`inherit` 或 `none` 三者之一时，标记框的内容则由 `content` 的值决定

再来看第二种情况，假设在列表项上显式设置了 `list-style-type` 的值（非默认值 `normal`）：

```CSS
@counter-style dog {
    system: cyclic;
    symbols: "🐶";
    suffix: " : ";
}
​
:root {
    --list-style-type: unset;
}
​
.list-item {
    list-style-type: var(--list-style-type);
}
```

此时相当于条件 ③ 成立（为真），因此你看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b24b632ad3fa45feafd1580cc2b8886f~tplv-k3u1fbpfcp-zoom-1.image)

标记框（`::marker`）的内容为 `🐶:` （即 `symbols + suffix` ）。

此时，同样改变 `::marker` 伪元素的 `content` 属性的值，你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bfda5693abb462d943179a60439926a~tplv-k3u1fbpfcp-zoom-1.image)

不难发现：

-   当 `::marker` 的 `content` 的值为 `normal` 或 `inherit` 时，标记框的内容和 `list-style-type` 设置的内容相同；
-   当 `::marker` 的 `content` 的值为 `none` 时，标记框 `::marker` 会被移除；
-   当 `::marker` 的 `content` 的值不是 `normal` 、`inherit` 或 `none` 三者之一时，标记框的内容将会覆盖 `list-style-type` 设置的内容。

第三种情况就是在列表项上显式设置 `list-style-image` 的值为非 `normal` ：

```CSS
:root {
    --list-style-image: unset;
}
​
.list-item {
    list-style-image: var(--list-style-type);
}
```

此时相当于条件 ② 成立（为真），因此你看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50ebf3b3ad3147e2afa6ea6696f6acd1~tplv-k3u1fbpfcp-zoom-1.image)

标记框的内容是一张图片（`rocket.svg`）。这个时候，你改变 `::marker` 伪元素的 `content` 属性的值，你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c24919ecb5674e9085a1b9bee18b3e39~tplv-k3u1fbpfcp-zoom-1.image)

它的表现与显式设置 `list-style-type` 相似。

-   当 `::marker` 的 `content` 属性的值为 `normal` 或 `inherit` 时，标记框的内容就是 `list-style-image` 指定的图片；
-   当 `::marker` 的 `content` 属性的值为 `none` 时，标记框会被移除；
-   当 `::marker` 的 `content` 的值不是 `normal` 、`inherit` 或 `none` 三者之一时，标记框的内容将会覆盖 `list-style-image` 设置的内容（此例是 `rocket.svg`）。

最后一种情况，规则 ② 和规则 ③ 的值都改变，即 `list-style-type` 和 `list-style-image` 属性显式设置值。

```CSS
@counter-style dog {
    system: cyclic;
    symbols: "🐶";
    suffix: " : ";
}
​
:root {
    --list-style-type: unset;
    --list-style-image: unset;
}
​
.list-item {
    list-style-type: var(--list-style-type);
    list-style-image: var(--list-style-image);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d081cc135514b2b867233ab1844141b~tplv-k3u1fbpfcp-zoom-1.image)

不难发现，`list-style-image` 覆盖了 `list-style-type` ，最终标记框的内容是张图片（`rocket.svg`）。但需要知道的是，如果 `list-style-image` 引入的图片不存在或加载失败，那么标记框的内容则是 `list-style-type` 设置的内容（此例是 `🐶:`）。

在此条件下，同样改变 `::marker` 伪元素的 `content` 属性的值，你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d22772fa8962441db71afaa27c76ce94~tplv-k3u1fbpfcp-zoom-1.image)

你会发现：

-   当 `::marker` 伪元素的 `content` 取值为 `normal` 或 `inherit` 时，标记框的内容将由 `list-style-image` 属性指定，只有其加载的图片不存在或失败之时，才会由 `list-style-type` 属性决定；
-   当 `::marker` 伪元素的 `content` 的值为 `none` 时，标记框将会被移除；
-   当 `::marker` 伪元素的 `content` 的值不是 `normal` 、`inherit` 或 `none` 之一时，标记框的内容将会覆盖 `list-style-image` (或 `list-style-type`)的内容

注意，从小册的《[09 | CSS 显式默认值：inherit 、initial 、unset 和 revert ](https://juejin.cn/book/7223230325122400288/section/7232094160071688227)》课程中可以得知，除了关键词 `normal` 、`none` 和 `inherit` 之外，`::marker` 伪元素的 `content` 属性还可以取值为 `initial` 、`unset` 和 `revert` 等关键词，但它们最终呈现的结果与关键词 `inherit` 相似。

还有一点需要注意的是，`::marker` 伪元素的 `content` 取值为 `none` 和空字符串（`' '`）时，虽然呈现的视觉效果有点相似，标记符看上去没有任何东西；但它们有着本质的区别：

-   `content` 取值为 `none` 时，标记框会被移除，相当于 `::marker` 设置了 `display: none`
-   `content` 取值为空字符串（`' '`）时，标记框只是内容为空，但标记框并没有被移除

简单地总结一下：

-   当 `::marker` 的 `content` 属性值为 `none` 时，`::marker` 伪元素会从 DOM 中移除，相当于 `display: none`，此时标记框不会有任何内容，即使是 `list-style-type` 和 `list-style-image` 设置了值也是如此
-   当 `::marker` 的 `content` 属性值为 `normal` 时，且 `list-style-image` 和 `list-style-type` 未显式设置值时，此时标记框的内容将会是 `list-style-type` 的默认值
-   当 `::marker` 的 `content` 属性值为 `normal` 时，且 `list-style-image` 显式设置了值，但 `list-style-type` 并未显式设置值，此时标记框的内容将会是 `list-style-image` 的值，要是 `list-style-image` 的图像资源失效时，将会取 `list-style-type` 的默认值作为标记框的内容
-   当 `::marker` 的 `content` 属性值为 `normal` 时，且 `list-style-type` 显示设置了值，但 `list-style-image` 并未显式设置值，此时标记框的内容将会是 `list-style-type` 的值
-   当 `::marker` 的 `content` 属性值为 `normal` 时，且 `list-style-image` 和 `list-style-type` 都显式设置了值，此时标记框的内容将会是 `list-style-image` 的值，但当 `list-style-image` 引入的资源失效时，标记框的内容会是 `list-style-type` 的值
-   当 `::marker` 的 `content` 属性值为 `inherit` （或 `initial` 、`unset` 和 `revert` 等）时，标记框的内容和 `content` 属性值为 `normal` 相同
-   当 `::marker` 的 `content` 属性值是 `normal`、`none` 、`inherit` 、`initial` 、`unset` 和 `revert` 等关键词之外的其他值类型（数据类型），比如文本字符、表情符号、引号、图形等，即使是 `list-style-type` 和 `list-style-image` 显式设置了值，也将会被覆盖，此时标记框的内容会是 `content` 属性的值，即使是空字符串（`" "`）也将生效，只是此时标记框的内容是空字符串，标记符无任何样式形式

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e23e46954a0f42f18340c2d2193a8c5f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvRwRpg>

### 适用于 ::marker 的属性

`::marker` 伪元素允许你将列表项的标记符与内容分开。在没有 `::marker` 伪元素之前，要将列表项标记符与内容分开是不太可能的。

因此，你要是想在 `ul`（ `ol`）或 `li`上改变文本颜色（`color`）或字体大小（`font-size`），也会改变标记符（也就是标记框中的内容）的颜色和大小。但很多时候，只是希望调整标记框内容的颜色或大小。这样一件非常简单的事情，我们不得不去调整 HTML 的结构。比如说，把列表项的内容放在一个 `<span>` 内：

```HTML
<ul>
    <li><span>List item</span></li>
</ul>
```

```CSS
li {
    color: #00b7a8;
    
    & span {
        color: #09f;
    }
}
```

有了 `::marker` 伪元素之后，我们可以在不调整 HTML 结构，就可以单独为列表项标记符设置不同的颜色。这意味着，上面的示例，我们可以像下面这样来调整：

```HTML
<ul>
    <li>List item</li>
</ul>
```

```CSS
li {
    color: #09f;
    
    &::marker {
        color: #00b7a8;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9803c96e293540ec9992374d2416a63c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOZYEWZ>

虽然 `::marker` 伪元素可以使用 CSS 属性设置一些样式，弥补了 `list-style-type` 有限的样式设计可能性，但并不意味着你能在 `::marker` 上使用每一个 CSS 属性。换句话说，到目前为止，我们只能在 `::marker`上使用下面这几个 CSS 属性：

-   `animation-*`
-   `transition-*`
-   `color`
-   `direction`
-   `font-*`
-   `content`
-   `unicode-bidi`
-   `white-space`

像 `background`、`width`、`height` 等盒模型相关的属性用在 `::marker`上也是无效的。但 `::marker` 的`content` 生成的标记框内容，我们还可以使用 `text-*` 相关的属性。比如：

```CSS
:root { 
    --content: "»»»"; 
} 
​
.list-item::marker { 
    content: var(--content); 
    color: #f36; 
    font-size: 1.5rem; 
    text-shadow: 2px 2px 0px #09f; 
    text-transform: capitalize; 
    letter-spacing: 5px; 
    transition: all 0.2s ease-in; 
    animation: change 3s ease-in-out infinite;
    
    /* 不生效的 CSS */ 
    background: #909090; 
    transform: rotate(30deg); 
    opacity: 0.5; 
    filter: blur(10px); 
    width: 50px; 
    height: 50px; 
    margin-right: 40px; 
} 
​
.list-item:hover::marker { 
    font-size: 0.9em; 
    color: lime; 
    text-shadow: -2px -2px 1px #090909; 
} 
​
@keyframes change { 
    50% { 
        color: hotpink; 
        text-shadow: 1px 1px 1px green; 
        font-size: 2rem; 
    } 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e527b272c8d4ea6ae79f10ab9847379~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYMPamm>

也就是说，我们在 `::marker` 伪元素上可控样式还是有限，要实现下面这样的个性化效果是不可能的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83c927d9b1e44f688efe891420e853ac~tplv-k3u1fbpfcp-zoom-1.image)

庆幸的是，CSS 中除了 `::marker` 伪元素之外，还可以使用 `::before` 或 `::after` 来生成内容，然后通过 CSS 来实现更具个性化的列表标记样式。

### ::marker 和 ::before （::after）同时出现在列表项会发生什么？

现如今，伪元素 `::marker` 、`::before` 和 `::after` 都可以用于列表项（`li`）和 `display` 为 `list-item` 的元素上。那么问题来了，伪元素 `::marker` 、`::before` 和 `::after` 同时存在于列表项上，会是一个什么情况呢？例如：

```CSS
.list-item {
    &::marker { 
        content: "Marker"; 
        color: #f36; 
    }
    
    &::before { 
        content: "Before"; 
        color: #09f; 
    }
    
    &::after { 
        content: "After"; 
        color: #89f; 
    } 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5ad8706e48244b990fdbcb6104ef629~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWZWjPG>

可以看到 `::marker` 和 `::before` 生成的盒子框位于列表项内容框的前面，并且 `::marker` 在 `::` before前面，而 `::after` 生成的盒子框在列表项内容框的后面。

再来看另外一场景，如果伪元素 `::marker` 未指定生成的内容，即 `::marker` 伪元素的 `content` 未显式设置值（默认为 `normal`），但使用 `::before` 生成内容：

```CSS
.list-item{
    &::marker { 
        color: #f36; 
        font-size: 2rem; 
    }
    
    &::before { 
        content: "Before"; 
        color: #09f; 
    }
}
```

你将看到下图这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9417d1638af84be983730c946f2cc8b7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abPbBor>

虽然 `::marker` 伪元素的 `content` 属性并未显式指定内容，但其内容会是列表项的默认标记符。也就是说，如果你并不希望 `::marker` 伪元素（标记框）存在，可以将其 `content` 属性的值指定为 `none` 或者将列表项的 `list-style` 设置为 `none` 。

虽然 `::marker` 、`::before` 和 `::after` 都可以在列表项中生成内容，但可用于 `::marker` 伪元素的 CSS 属性是有限的，如果你要构建一个个性化较强的列表项标记符，那你不得不放弃使用 `::marker` 伪元素，只能使用伪元素 `::before` 或 `::after` 。因为，只要能用于元素的 CSS 属性，一般情况下都可以用于伪元素 `::before` 和 `::after` 上。

简单地说，如果你要为列表项制作一个简单（个性化不强）的标记符，那么可以选择使用 `::marker` 伪元素（它天生就是为列表项标记符服务的）；如果你要为列表项制作一个复杂（个性化较强）的标记符，那么请选择使用 `::before` 或 `::after` 伪元素。比如下图这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d6c730bec894480b2891769119cf990~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGOGBea>

关键的 CSS 代码：

```CSS
@layer demo {
    ul,
    ol,
    .list {
        filter: drop-shadow(0 1em 1em rgba(0, 0, 0, 0.2));
    }
​
    .list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        margin: 0.25em auto;
        border: solid 0.5em transparent;
        padding: 0.25em;
        width: 100%;
        height: 5em;
        border-radius: 2.5em;
        background: linear-gradient(#dbdbdb, #fff) content-box,
            linear-gradient(var(--slist)) padding-box,
            linear-gradient(#fff, #dcdcdc) border-box;
        font: 1.5em/1.375 trebuchet ms, verdana, sans-serif;
        text-align: center;
        text-indent: 1em;
        clip-path: inset(0 round 2.5em);
​
        &::before {
            position: absolute;
            right: -0.5em;
            width: 5em;
            height: 5em;
            border-radius: 0.5em;
            transform: rotate(45deg);
            box-shadow: 0 0 7px rgb(0 0 0 / 20%);
            background: linear-gradient(
                -45deg,
                #e4e4e4 calc(50% - 2.5em),
                #fff calc(50% + 2.5em)
            );
            content: "";
        }
          
        &::after {
            box-sizing: inherit;
            display: grid;
            place-content: center;
            position: relative;
            border: inherit;
            margin-right: -0.25em;
            width: 4em;
            height: 4em;
            border-radius: 50%;
            box-shadow: inset 0 0 1px 1px #efefef, inset 0 -0.5em rgb(0 0 0 / 10%);
            background: linear-gradient(var(--slist)) padding-box,
                linear-gradient(#d0d0d0, #e7e7e7) border-box;
            color: #fff;
            text-indent: 0;
            content: "❢";
        }
    }
}
```

`::marker` 、`::before` 和 `::after` 伪元素的 `content` 属性值除了可以设置关键词（例如 `normal`）、字符串、图片、表情符、`attr()` 之外，还可以是 `counter()` 或 `counters()` 函数：

```CSS
ul ::marker { 
    content: counter(list-item, decimal-leading-zero); 
    color: #09f; 
} 
​
ol ::marker { 
    content: none; 
} 
​
ol ::before { 
    content: counter(list-item, decimal-leading-zero); 
    color: #09f; 
} 
```

另外，在很多情况下，为了构建更具个性化的列表项标记符的样式风格，不得不把列表项的 `display` 设置为其他的值，比如 `flex` 或 `grid` 。这个时候，列表项元素就不是 `list-item` 的上下文格式，在 `content` 中使用 `counter(list-item)` 函数，就无法自动按照 DOM 的数量生成有序计数值：

```CSS
.list-item { 
    display: flex; 
    
    &::after { 
        content: counter(list-item, decimal-leading-zero); 
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8952ed6a57974f4d9cd5f98fc10f8300~tplv-k3u1fbpfcp-zoom-1.image)

当然，如果列表项不需要计数，也无需排序，类似一个无序列表，仅指定 `counter()` 函数第二个参数即可，效果也是不错的，至少能让人接受：

```CSS
@counter-style custom-counter-style {
    system: cyclic;
    symbols: "🐶";
}
​
li::after {
    content: counter(order, custom-counter-style);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73b4470548c24d0ab679619593bc362f~tplv-k3u1fbpfcp-zoom-1.image)

但要自动计数的话，除了使用 `counter()` 函数之外，还需要使用 `counter-reset` 和 `counter-increment` 属性。比如下面这个效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa5bdc5476aa4ad5bec921bfe191a1b2~tplv-k3u1fbpfcp-zoom-1.image)

接下来，我们就一起来聊聊 `counter()` 函数和 `counter-reset` 和 `counter-increment` 等属性。

## CSS 计数器

我们都知道，有序列表 `ol` 的列表项可以自动计数，它其实是通过 CSS 的计数器来实现的。

CSS 计数器是一种特殊的数字跟踪器。本质上 CSS 计数器是由 CSS 维护的变量，这些变量可能根据 CSS 规则跟踪使用次数以递增或递减。你可以自定义一个计数器，也可以修改 `list-item` 这一默认生成的应用于所有有序列表的计数器。

CSS 中的每个计数器都有一个名称或创建者，用来识别计数器，还有一个整数值。我们在使用计数器之前，必须使用 `counter-reset` 属性初始化计算器的值。然后计数器可以通过 `counter-increment` 属性指定其值为递增或递减。最后，当前计数器的值可以通过 `counter()` 或 `counters()` 函数显示出来，这通常会在伪元素（`::marker` 、`::before` 或 `::after`）的 `content` 属性中使用。

我们可以通过以下几个步骤来实现元素上的计数器的值：

- ①：现有的计数器是从以前的元素中继承的，即使用隐式的计数器 `list-item`
- ②：新的计数器被实例化（`counter-reset`），即使用 `counter-reset` 声明一个计数器名称（`<counter-name>`）
- ③：计数器的值被递增（`counter-increment`），即使用 `counter-increment` 指定计数器（`<counter-name>`）值是被递增或递减
- ④：计数器的值被明确地设置（`counter-set`），即使用 `counter-set` 指定计数器的值是一个确切的值
- ⑤：使用计数器的值（`counter()` 或 `counters()`），即使用 `counter()` 或 `counters()` 函数调用 `counter-reset` 已创建的计数器（`<counter-name>`） 。通常需要结合 `::marker` 、`::before` 或 `::after` 伪元素的 `content` 属性一起使用。

另外，CSS 的计数器按创建方式可分为**隐式计数器**和**显式计数器**（即自定义计数器）两种。我们先来看第一种。

### 隐式计数器

众所周知，列表项 `li` 的 `display` 属性的值是 `list-item` ，除此之外，可以给非 `li` 元素设置 `display` 属性的值为 `list-item` 。此时，这些元素（即 `display` 为 `list-item` 的元素）会自动创建一个名为 `list-item` 的计数器（即 `<counter-name>` 为 `list-item`），但我们仅在有序列表 `ol` 中才能看到计数的效果，那是因为 `list-style-type` 指定了列表项默认的标记符。

不过，我们可以在 `counter()` 函数中引用自动创建的 `list-item` 计数器，这样对于非有序列表也会有计数的作用。例如：

```CSS
.list-item::marker {
    content: counter(list-item) ":";
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cee151d474a4f60a0d90215d659e89f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwEwKwQ>

注意，如果你想实现嵌套列表计数器的功能，则需要使用 `counters()` 函数。例如：

```HTML
<ul>
    <li>list item</li>
    <li>
        list item
        <ul>
            <li>list item</li>
        </ul>
    </li>    
</ul>
```

```CSS
li::marker {
    content: counters(list-item, ".") ":";
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa71b8620bf94f5e9a3a7ff172265f55~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKbKaNP>

你可能已经发现了，`ul` 和 `ol` 相互嵌套，使用 `counters()` 使用隐式计数器 `list-item` 符合我们预期的效果，但 `display` 为 `list-item` 的元素则无法达到预期，所以大家在使用的时候，要谨慎！

你可能会感到好奇，如果仅是改变无序列表的计数，那么使用 `list-style-type` 就可以了。那为什么还需要使用计数器呢？其实回答这个问题很容易。假设你要实现一个大纲的排版，那么 `list-style-type` 和 `@counter-style` 是做不到。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aeb0f822c80243eb807e83e278471be3~tplv-k3u1fbpfcp-zoom-1.image)

使用 CSS 计数器能轻易实现上图的效果：

```HTML
<ul>
    <li>CSS 的父选择器</li>
    <!-- 省略其他 li -->
</ul>
```

```CSS
@layer demo {
    @counter-style cjk-decimal { 
        system: numeric; 
        range: 0 infinite; 
        symbols: '\3007' '\4E00' '\4E8C' '\4E09' '\56DB' '\4E94' '\516D' '\4E03' '\516B' '\4E5D'; 
    } 
    
    li::marker {
        content: "第" counter(list-item, cjk-decimal) "节：";
        font-weight: 900;
        color: #90a;
    }
}
```

> Demo 地址：<https://codepen.io/airen/full/yLGLgWV>

### 显式计数器

显式计数器也被称为自定义计数器，即使用：

-   `counter-reset` 显式创建一个计数器名称 `<counter-name>`，
-   `counter-increment` 指定计数器递增值或 `counter-set` 指定计数器确切值
-   `counter()` 或 `counters()` 函数引用已定义的计数器 `<counter-name>`

一般情况下，他对应的 HTML 结构如下：

```HTML
<counter-reset> 
    <counter-increment> 
        counter-increment::marker || counter-increment::before || counter-increment::after 
    </counter-increment> 
</counter-reset>
```

首先在 `<counter-reset>` 元素上使用 CSS 的 `counter-reset` 属性创建一个计数器名称：

```CSS
counter-reset {
    counter-reset: counter-name;
}
```

然后在 `<counter-increment>` 元素上使用 CSS 的 `counter-increment` 属性为已命名的计算器 `counter-name` 指定递增或递减：

```CSS
counter-increment {
    counter-increment: counter-name;
}
```

最后在伪元素 `::marker` 、 `::before` 或 `::after` 的 `content` 属性上使用 `counter()` 或 `counters()` 函数引用已命名的计数器 `counter-name` ：

```CSS
counter-increment::marker {
    content: counter(counter-name);
}
```

来看一个简单的示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/133e8245d6fb47468bafc3aaedb62f6a~tplv-k3u1fbpfcp-zoom-1.image)

假设我们有以下这样的 HTML 结构：

```HTML
<div class="container">
    <h1>The Polar Bear</h1>
    <p><em>From Wikipedia, the free encyclopedia</em></p>
    
    <h2>Pick a name for the counter</h2>
    <p>The polar bear (Ursus maritimus) ... </p> 
     
    <h2>Increment The Counter</h2>
    <figure>
        <img src="https://picsum.photos/1024/768?random=11" alt="">
    </figure>
    
    <h2>Assign The Counter</h2>
    <p>A boar (adult male) ...</p>
</div>
```

我们需要对代码中的 `h2` 进行计数，所以需要在他们的父元素上使用 `counter-reset` 创建一个计数器名称，比如 `section-title` ：

```CSS
@layer demo.pick-a-name {
    .container { /* .container = <counter-reset> */
        counter-reset: section-title; /* section-title = counter-name */
    }
}
```

接着增加计数器，这一步对计数器的工作非常重要。在 `<h2>` 元素上，使用 `counter-increment` 属性指定计数器 `section-title` 递增或递减。我们在这个示例中使用其默认方式，即按 `1` 往上递增：

```CSS
@layer demo.increment-counter {
  .container h2 { /* h2 = <increment-counter> */
    counter-increment: section-title; /* section-title = counter-name */
  }
}
```

最后一步是使用 `counter()` 函数作为 `content` 属性的值。在这里为了能更好的美化计数器（标记框）的样式，我采用了 `::before` 来承接 `content` ：

```
@layer demo.assign-counter {
    .container h2::before {
        content: counter(section-title);
    }
}
```

这个时候，`.container` 中的所有 `<h2>` 元素会根据它在 HTML 文档中出现的先后顺序，添加相应的计数值，从 `1` 开始，并且逐个按 `1` 往上递增：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91af008dccc44881a3869b4f7628912c~tplv-k3u1fbpfcp-zoom-1.image)

我们的目标不仅仅是为 `<h2>` 元素添加计数值，而且还需要额外的描述信息，比如在计数值前面添加字符串 `section` 。要实现它很容易，只需要在 `content` 属性上添加 `section` 字符串即可：

```CSS
@layer demo.assign-counter {
    .container h2::before {
        content: "section " counter(section-title);
    }
}
```

最后给伪元素 `::before` 添加样式，你将获得最终的效果：

```CSS
@layer demo.pick-a-name {
    .container {
        counter-reset: section-title;
    }
}
​
@layer demo.increment-counter {
    .container h2 {
        counter-increment: section-title;
    }
}
​
@layer demo.assign-counter {
    .container h2 {
        display: grid;
    
        &::before {
            content: "section " counter(section-title);
            background-color: #09f;
            display: inline-flex;
            margin-right: auto;
            padding-inline: 1rem;
            color: #fff;
            font-size: 1rem;
            border-radius: 99rem;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660eb880ef9b44b8829886b8d3ac6fa9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRPRWOg>

### 反向计数器

前面我们所看到的计数器都是用于递增的计数器，除此之外，我们还可以使用“反向计数器”实现递减的计数器。

也就是说，反向计数器是一种用于递减（而非递增）的计数器。反向计数器可以通过在 `counter-reset` 属性中将计数器的名称使用 `reversed()` 函数包裹来创建。例如：

```CSS
.conter-reset {
    counter-reset: reversed(section-title);
}
```

反向计数器的默认初始值与元素的数量相同（不同于常规的默认初始值为 `0` 的计数器）。这使得实现从元素数量为初始值倒数到 `1` 的计数器变得更加容易。

拿上面示例为例，如果我们使用 `reversed()` 函数创建一个反向计数器，你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d6e2f80ad69468e8c231d499ac24b4e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYMENaN> （请使用 Firefox Nightly 浏览器查看）

## CSS 计数器相关属性：3C

这里所说的 3C 分别指：

-   `counter()` 或 `counters()` 函数
-   `counter-reset` 属性
-   `counter-increment` 属性

我们先来看 `counter-reset` 属性。

### counter-reset

`counter-reset` 属性主要用来显式创建一个计数器名称，即在一个元素上实例化了新的计数器，并将它们设置为指定的整数值。其语法很简单：

```
counter-reset: [ <counter-name> <integer>? ]+ | none
```

该属性接受两个值。其中 `none` 是初始值，也将表示该元素不会创建任何新的计数器。它可用于重置隐式的计数器（或重置隐藏在不太具体的规则中定义的计数器）。另个值是 `[ <counter-name> <integer>? ]`，其中：

-   `<counter-name>` 是指计数器的名称，实例化一个给定名称的计数器，它可以是任意有效的 `<custom-ident>`，但一些关键词不能用于该名称中，比如 `none`、`unset`、`initial` 或 `inherit`
-   `<integer>` 指定计数器的起始值，它可以是正值，也可以是负值。如果未显式指定该值，则是 `0`

注意，如果 `<counter-name>` 和 `<integer>` 同时用于 `counter-reset` 属性时，它们之间需要用空格分隔开来。比如：

```CSS
.list { 
    counter-reset: section; /* 相当于 counter-reset: section 0; */ 
} 
​
h1 { 
    counter-reset: heading 1; 
} 
```

但如果没有显式使用 `counter-increment` 指定已创建的计数器，即使在伪元素 `::marker`（或 `::before` 或 `::after`）中的 `content` 使用 `counter()` 调用，计数不会有任何递增，将会是 `counter-reset` 中的 `<integer>` 值（如果未指定，即是 `0`）：

```CSS
@layer demo.pick-a-name {
    .container {
        counter-reset: section-title;
    }
}
​
/* 未使用 counter-increment 指定计数器递增（或递减）*/
​
@layer demo.assign-counter {
    .container h2::before {
        content: "section " counter(section-title);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61e9b00f258648bd87c1026dda359fc2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/abPzNgO>

如果 `counter-reset` 属性显式指定了 `<integer>` 的值，且未显式使用 `counter-increment` 属性指定计数器递增（或递减），那么指定的 `<integer>` 值将会替代默认值 `0` ，并且计数器不会有任何的递增或递减：

```CSS
@layer demo.pick-a-name {
    .container {
        counter-reset: section-title 2; /* <integer> 的值等于 2 */
    }
}
​
/* 未使用 counter-increment 指定计数器递增（或递减）*/
​
@layer demo.assign-counter {
    .container h2::before {
        content: "section " counter(section-title);
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/407adadd27644f43932ea3d687e1ab4b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLGyJBr>

也就是说，**要使计数器具有递增或递减的功能，**`counter-increment` **必不可少**。

另外，`counter-reset` 的第二个参数可以指定计数器的递增量，你可以尝试改变 `<integer>` 查看相应的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/812843018f9940ac90580f5126a6524b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBLENda>

我们在使用 `counter-reset` 创建计数器的时候，还可同时创建多个计数器。在创建多个计数器的时候，需要用空格符分隔开：

```CSS
@layer demo.pick-a-name {
    .container {
        counter-reset: title 1 paragraph 2;
    }
}
​
@layer demo.increment-counter {
    .container {
        & h2 {
            counter-increment: title;
        }
        & p {
            counter-increment: paragraph;
        }
    }
}
​
@layer demo.assign-counter {
    .container {
        & h2::before {
            content: "section " counter(title);
        }
        
        & p::after {
            content: "(" counter(paragraph) ")";
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7abff47ab2e042dfa600067a02916698~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYvEKLe>

### counter-increment 和 counter-set

`counter-increment` 和 `counter-set` 属性用来控制现有计数器的值（隐式计数器 `list-item` 或 `counter-reset` 创建的计数器），即用于将 CSS 计数器的值递增或递减。它们语法和 `counter-reset` 类似：

```
counter-increment: [ <counter-name> <integer>? ]+ | none 
counter-set: [ <counter-name> <integer>? ]+ | none
```

其中 `none` 为初始值，表示不改变任何计数器的值。 `[ <counter-name> <integer>? ]` 是一个以空格分隔的两个值：

-   `<counter-name>` 指的是递增的计数器的名称，一般是隐式计数器 `list-item` 或 `counter-reset` 定义的计数器名称。和 `counter-reset` 属性中的 `<counter-name>` 相同
-   `<integer>` 指的是计数器递增或递减的值。如果没有显式设置，`counter-increment` 则默认为 `1`（注意，`counter-reset` 中的 `<integer>` 默认的值为 `0`），`counter-set` 则默认为 `0`

`counter-increment` 和 `counter-set` 还是略有差异的：

-   `counter-increment` 设置计数器按 `<integer>` 指定的值递增（递减）
-   `counter-set` 将计数器设置为一个给定的值（`<integer>`）。它可以操作现有的计数器的值，并且只在该元素上还没有一个给定名称的计数器时才会创建新的计数器

我们先来看 `counter-increment` 的使用。假设我们有一个像下面这样的 HTML 结构：

```HTML
<div class="counter-reset"> 
    <h1 data-element="h1">Counter-increment</h1> 
    <p data-element="p">The counter-re...</p> 
    <aside data-element="aside">To change the value of...</aside> 
    <p data-element="p">The counter-reset C...</p> 
    <section data-element="section">To change the value ...</section> 
</div>
```

上面代码的 DOM 结构嵌套关系很简单：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eca7e04804814725a7f5bbf8adc0722c~tplv-k3u1fbpfcp-zoom-1.image)

创建一个计数器，并且使用 `counter-increment` 操作该计数器：

```CSS
@layer counter {
    .counter-reset {
        counter-reset: counter-name;
    
        > * {
            counter-increment: counter-name;
    
            &::before {
                content: counter(counter-name);
            }
        }
    }
}
```

示例中的 `counter-reset` 和 `counter-increment` 的 `<integer>` 使用的是其默认值：

-   `counter-reset` 的 `<integer>` 默认值为 `0` 。假设我们称它为 `n` ，那么 `n = 0`
-   `counter-increment` 的 `<integer>` 的默认值为 `1` 。假设我们称它为 `m` ，那么 `m = 1`

CSS 计数器的值将会按下面的公式进行计算：

```
n + m × p 
```

其中 `p` 是计数元素在 HTML 文档源索引值，它从 `1` 开始计算（`p = 1`）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d0e8d6912d54b2ab6995bab9b29c343~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dywPXvz>

你可以尝试在下面 Demo 中，调整 `counter-reset` 和 `counter-increment` 属性的 `<integer>` 值：

```CSS
@layer var {
    :root {
        --counter-reset: 0;
        --counter-increment: 1;
    }
}
​
@layer counter {
    .counter-reset {
        counter-reset: counter-name var(--counter-reset);
    
        > * {
            counter-increment: counter-name var(--counter-increment);
    
            &::before {
                content: counter(counter-name);
            }
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7a7ca09382c40529b7ef66e72019a1d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxmbEYJ>

正如你所看到的，你也可以将 `counter-increment` 属性指定一个负数，使得计数达到递减的效果。

我们所看到的示例都基于已有计数器名称开始的，不管是隐式计数器 `list-item` 还是使用 `counter-reset` 属性定义的计数器。其实，我们可以直接使用 `counter-increment` 给元素做递增或递减的操作，只不过它会实例化一个匿名的计数器名称。例如：

```CSS
@layer counter {
    .counter-reset {
        /* 并没有使用 counter-reset 定义一个计数器名称，也没有显式创建一个 list-item 计数器 */
        > * {
            counter-increment: counter-name; /* 创建一个匿名的计数器名称 counter-name */
    
            &::before {
                content: counter(counter-name);
            }
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7542c59ccfc4a40904e76253b68631f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BavyLqK>

有一个细节我们需要注意，当 `counter-increment` 指定多次，则会成倍数递增（或递减）：

```CSS
@layer counter {
    .counter-reset {
        counter-reset: counter-name;
        
        > * {
            counter-increment: counter-name;
    
            &::before {
                counter-increment: counter-name;
                content: counter(counter-name);
            }
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e27af0c72e7a455ba5ecf211f87a6e18~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKbwgEv>

为此，为了避开这些不确定的现象（多个实例化的计数器名称），即复合现象。我们在使用计数器时，尽可能的按这样的结构来使用：

```HTML
<counter-reset> 
    <counter-increment> 
        counter-increment::marker || counter-increment::before || counter-increment::after 
    </counter-increment> 
</counter-reset> 
​
<!-- 相当于 --> 
<div class="counter-reset"> 
    <div class="counter-increment"></div> 
    <!-- .... --> 
    <div class="counter-increment"></div> 
</div>
```

```CSS
.counter-reset { 
    /* 显式创建计数器名称 */ 
    counter-reset: counter-name; 
} 
​
.counter-increment { 
    /* 操作已定义的计数器 */ 
    counter-increment: counter-name; 
} 
​
.counter-increment::before { 
    /* 使用指定计数器生成内容 */ 
    content: counter(counter-name); 
} 
```

接着我们来看 `counter-set` 属性。

`counter-set` 和 `counter-increment` 最大不同之处是：“**`counter-set`** **指定的是一个固定值，计数器并不会做递增或递减**”：

```CSS
@layer var {
    :root {
        --counter-reset: 0;
        --counter-set: 1;
    }
}
​
@layer counter {
    .counter-reset {
        counter-reset: counter-name var(--counter-reset);
    
        > * {
            counter-set: counter-name var(--counter-set);
    
            &::before {
                content: counter(counter-name);
            }
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81a69d751dad4c2b999eb986a9054132~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxmbRxM>

### counter() 和 counters()

不管是 `counter-reset`、`counter-increment` 还是 `counter-set`，他们只是初始化计数器名称和指定计数器递增（或递减）值，但它们本身没有可见的效果。如果想要得到真的计数的值，是离不开 `counter()` 或 `counters()` 函数。正如前面所演示的示例，`counter()`或 `counters()` 和伪元素 `::marker` 、`::before` 或 `::after` 的 `content` 一起使用才能显示计数器的值。

这两个函数的定义如下：

```
counter()  =  counter( <counter-name>, <counter-style>? ) 
counters() = counters( <counter-name>, <string>, <counter-style>? )
```

-   `counter()` 函数有两种形式： `counter(<counter-name>)` 和 `counter(<counter-name>, <counter-style>)`。生成的文本是伪元素范围内指定名称的最内层计数器的值。
-   `counters()` 函数也同样有两种形式：`counters(<counter-name>, <separator>)` 和 `counters(<counter-name>, <separator>, <counter-style>)`。生成的文本由在伪元素范围内所有指定名称的计数器的值组成。这些值从最外层到最内层，使用指定的字符串（`<separator>`）分隔。

以上两个函数均可以使用指定的 `<counter-style>` 来渲染其值（默认值为 `decimal`）。也可以使用 `list-style-type` 属性其他可选的值，或者使用 `@counter-style` 构建的自定义样式。

就这两个函数而言，`counters()` 常用于嵌套的 CSS 计数器，而且我们在使用 `counters()` 函数时，一定需要显式指定分隔器（`<separator>`）名称，否则 `counters()` 会失效。

```CSS
@layer counter {
    ol {
        counter-reset: order;
    }
​
    li {
        counter-increment: order;
    }
​
    ol:nth-child(1) li::before {
        content: counter(order, var(--style, decimal));
    }
​
    ol:nth-child(2) li::before {
        content: counters(order, "_", var(--style, decimal));
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c7674c3972c4191882d8ea7b8a0866c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoXwbNb>

有了 `counter()` 和 `counters()` 以及 `counter-reset` 和 `counter-increment` 修复前面示例存在的问题了：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c9e8be704e244eda16f6152afa01047~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
@layer counter {
    ul {
        counter-reset: order;
    
        & li {
            counter-increment: order;
          
            &::after {
                content: counter(order, decimal-leading-zero);
            }
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f54e7b752884b7e8cdf6307b7d0ff8c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWzwGda>

## CSS 计数器能做什么？

CSS计数器使用场景还是蛮多的，比如排行榜的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9a6baf320b4cb7afe883c6303006db~tplv-k3u1fbpfcp-zoom-1.image)

也可以用于一些动效中，比如[模拟电影播放前倒计时的效果](https://codepen.io/levente-frks/full/mdOzLOe)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fca6de62d23d41b589288797dfa05b2d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwqYmWv>

还可以实现一些带有交互行为的效果，[比如使用 CSS 计数器显示当前步骤](https://codepen.io/chriscoyier/full/QWydxqP)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/697e5996887449cb8b30409edeac4be5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEVYByq>

你也可以使用 [CSS 计数器实现评分系统效果](https://codepen.io/elstgav/full/mJpvdG)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32d3620ec82b42e9a9fc08a823f58be9~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLGyVoq>

## 小结

学习完这节课之后，你可以使用 `@counter-style` 给列表项添加更具创意的标记符号，除此之外，你也可以使用 `counter-reset` 、`counter-increment` 和 `counter()` （或 `counters()`）函数实现一个计数器的功能。

换句话说，你可以对 HTML 文档的任何元素进行计数，并且构建出很有创意的效果，比如说排行榜，甚至你还可以使用它们来做一些小游戏，[比如一打靶的游戏](https://codepen.io/una/full/NxZaNr)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75932fe5316d4b339b8cebc0d9eea608~tplv-k3u1fbpfcp-zoom-1.image)