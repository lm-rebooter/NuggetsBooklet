在 Web 中设置文本范围的样式是一件非常有用的事情。比如给选中的文本高亮、给拼写和语法错误文本下方显示漂亮的小波浪线等。另一个非常常见的高亮文本的用例是搜索和高亮功能，它提供了一个文本输入框，让用户在输入文本后搜索匹配的结果并将它们高亮显示。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a51f69bb84144bf9bee2ff7de872e4b2~tplv-k3u1fbpfcp-zoom-1.image)

现在请尝试在你的 Web 浏览器中按下 `Ctrl/⌘+F` 键，然后键入本文中的一些文本。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9245719d4fc14943b5b343ea389bc99b~tplv-k3u1fbpfcp-zoom-1.image)

浏览器本身通常会自动处理这些样式情况。可编辑区域（比如 `<textarea>`）会自动获取拼写波浪线，而查找命令会自动高亮找到的文本。

但是如果我们想要自己实现这种样式，在 Web 中处理起来并不容易，可能要花费较多的时间。这不是一个简单的问题。我们不能仅仅在给高亮或有语法错误的文本上，用一个带有类名的元素包裹起来。事实上，这需要能够正确地突出显示跨越任意复杂 DOM 树中的多个文本范围，可能跨越 DOM 元素的边界。

以往主要通过“样式文本范围伪元素”或“创建自己的文本高亮系统”来解决该问题。值得庆幸的是，我们现在可以使用 CSS Custom Highlight API 来解决该问题，因为它代表了 Web 上设置文本范围高亮样式的未来。

## 用户代理定义的可样式化文本范围的伪元素

可能最为人所知的可样式化文本范围，是使用 `::selection` 伪元素为用户选择的文本设置高亮的样式。例如：

```CSS
::selection {
    background-color: #09f;
    color: #fff;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9fba5e41ef446609bc2b04e29d95f18~tplv-k3u1fbpfcp-zoom-1.image)

遗憾的是，在 `::selection` 中只能使用部分 CSS 属性：

*   文本颜色 `color`
*   背景颜色 `background-color`
*   文本修饰 `text-decoration`
*   文本阴影 `text-shadow`
*   文本描边 `-webkit-text-stroke`
*   文本填充 `-webkit-text-fill-color`
*   光标 `cursor`
*   强调标记的颜色 `text-emphasis-color`
*   轮廓 `outline`

注意，这里涉及 Web 中的另一个知识点，即 **Web 中的选区和光标**。例如，当你使用指针设备（比如鼠标）在 Web 中选择文本时，就会自动创建一个 `Selection` 对象。你可以尝试在本页面上选择文本，然后在浏览器开发者工具的控制台中运行 `document.getSelection()`。你应该会看到有关所选文本的位置信息。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6f3eb8bc9bf4c41b0fac1a4ba23791f~tplv-k3u1fbpfcp-zoom-1.image)

在 JavaScript 中，与 Web 选区和光标相关的 JavaScript API 还有很多，例如：

*   `window.getSelection()`: 返回当前页面中的选区
*   `document.getSelection()`: 返回当前页面中的选区。与 `window.getSelection()` 相同，只是可以直接在文档上调用，而不需要访问 `window` 对象
*   `Selection` 对象: 表示页面中的选区。可用于读取选区范围、设置选区、删除选区等操作
*   `Range` 对象: 表示文档中的一个区域，通常是一个选区的一部分。可用于获取、设置和操作文档中的文本、节点和元素
*   `window.getSelection().getRangeAt(index)`: 获取选区中指定索引位置的 `Range` 对象。多数情况下，选区只包含一个 `Range` 对象，因此 `index` 通常为 `0`
*   `window.getSelection().removeAllRanges()`: 从当前页面中删除所有选区
*   `window.getSelection().addRange(range)`: 添加一个新的选区，其中 `range` 是一个 `Range` 对象。
*   `Range.setStart(node, offset)` 和 `Range.setEnd(node, offset)`: 设置 `Range` 对象的起始和结束位置，其中 `node` 是文档中的一个节点，`offset` 是节点内部的偏移量
*   `Range.insertNode(node)`: 在 `Range` 对象的起始位置插入一个新节点
*   `Range.deleteContents()`: 删除 `Range` 对象中的所有内容
*   `Range.surroundContents(node)`: 将 `Range` 对象中的内容包裹在指定的节点 `node` 中
*   `Range.cloneRange()`: 创建 `Range` 对象的副本
*   `Range.extractContents()`: 从文档中提取 `Range` 对象中的所有内容，并返回一个文档片段节点
*   `Range.compareBoundaryPoints(how, sourceRange)`: 比较两个 `Range` 对象的边界点，其中 `how` 参数指定比较的方式，`sourceRange` 参数指定要比较的另一个 `Range` 对象
*   `Range.getBoundingClientRect()`: 返回 `Range` 对象所涉及的第一个矩形的 `DOMRect` 对象，该矩形包含 `Range` 的范围
*   `document.createRange()`: 创建一个新的 `Range` 对象

> 注意，与 Web 选区和光标相关的 JavaScript API 相关的介绍已超出这节课的范畴，在这里不做过多阐述。你要是感兴趣的话，可以在 Web 上搜索相关的关键词，获取更多的教程做进一步的学习。

在 CSS 中，除了 `::selection` 伪元素之外，还有许多其他伪元素可用于文本范围高亮样式的设置，例如：

*   `::target-text` 选择在支持滚动到文本功能的浏览器中[滚动到的文本](https://wicg.github.io/scroll-to-text-fragment/)
*   `::spelling-error` 选择被浏览器标记为包含拼写错误的文本
*   `::grammar-error` 选择被浏览器标记为包含语法错误的文本

```CSS
/* 高亮显示文本片段 */
::target-text {
    background-color: rebeccapurple;
    color: white;
    font-weight: bold;
}

/* 标记语法错误文本片段 */
::grammar-error {
    text-decoration: underline red;
    color: red;
}

/* 标记拼写错误文本片段 */
::spelling-error {
    color: red;
}
```

不幸的是，浏览器对此的支持并不太好，尽管它们各自都很有用，但它们不能用于样式化自定义文本段落，只能用于浏览器预定义的文本段落。

因此，用户文本选择是不错的，因为相对简单，不会改变页面的DOM。

## CSS 自定义高亮 API 是什么？

[CSS 自定义高亮 API](https://www.w3.org/TR/css-highlight-api-1/) （Custom Highlight API） 是一个新的 W3C 规范，它使得从 JavaScript 中样式化任意文本范围成为可能！这里采用的方法与之前我们所介绍的用户文本选取技术非常相似。它为开发者提供了一种从 JavaScript 中创建任意范围，并使用 CSS 对其进行样式化的方式。

简单地说，**CSS 自定义高亮 API 提供了一种方法，可以通过使用 JavaScript 创建范围并使用 CSS 定义样式来设置文档中任意文本范围的样式**。

自定义高亮 API 扩展了高亮伪元素的概念，通过提供一种方式，让 Web 开发人员能够为任意 `Range` 对象的文本设置样式，而不仅仅局限于用户代理定义的 `::selection`、`::inactive-selection`、`::spelling-error` 和 `::grammar-error`。这在各种场景下都很有用，包括希望实现自己的选择的编辑框架、在虚拟文档上执行页面查找、用于代表在线协作的多个选择或拼写检查框架等。

自定义高亮 API 提供了一种编程方式添加和删除高亮，这不会影响基础 DOM 结构，而是基于范围对象（`Range` 对象），通过 `::highlight()` 伪元素应用文本样式。

下面的代码使用 `::highlight()` 伪元素将黄色背景和蓝色前景颜色应用于文本 “One two”。它通过将 `Highlight` 添加到 `HighlightRegistry` 来实现这一点（[这两个都是此规范引入的新概念](https://www.w3.org/TR/css-highlight-api-1/#highlights-set-up)）。`Highlight` 将包含一个 `Range`，其边界点将围绕文本 “One two”。

```HTML
<div class="range">
    <span>One</span>
    <span>two</span>
    <span>three…</span>
</div>
```

```CSS
::highlight(custom-highlight) {
    background-color: yellow;
    color: blue;
}
```

```JavaScript
let r = new Range();
let rangeContainer = document.querySelector('.range');

r.setStart(rangeContainer, 0);
r.setEnd(rangeContainer, 4);

CSS.highlights.set("custom-highlight", new Highlight(r));
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b8272bc95bf4ea69158178fe7a74bef~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvYpQLP>

## 自定义高亮伪元素：::highlight()

[W3C 规范是这样定义高亮伪元素 ::highlight()](https://www.w3.org/TR/css-highlight-api-1/#custom-highlight-pseudo) ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56b810da9cae4c668f26c7c9ae334620~tplv-k3u1fbpfcp-zoom-1.image)

大概的意思是，`::highlight(<custom-highlight-name>)` 伪元素也被称为**自定义高亮伪元素**。它代表了文档中被所有使用名称为 `<custom-highlight-name>` 的已注册自定义高亮包含或部分包含（如果有的话）。其中，`<custom-highlight-name>` 是指自定义高亮所使用的名称，它必须是有效的 CSS  `<ident-token>`。

简单地说，`::highlight(<custom-highlight-name>)` 是一个 CSS 伪元素，也常称为**自定义高亮伪元素**，可以用于给自定义文本范围设置高亮样式。其中 `<custom-highlight-name>` 是自定义高亮的名称，它需要是一个有效的 CSS 标识符（`<ident-token>`）。这个伪元素的作用是表示文档中被所有注册了该名称的自定义高亮所包含或部分包含的文本内容。这样，就可以通过 JavaScript 注册一个自定义高亮，然后在 CSS 中使用 `::highlight(<custom-highlight-name>)` 来对这个自定义高亮的范围进行样式设置，从而实现自定义高亮的显示效果。

```CSS
::highlight(custom-highlight-name) {
    background-color: #09f;
    color: #fff;
}
```

需要注意的是，仅仅使用 `::highlight()` 伪元素是没用的，它还必须有一个有效的**参数**（比如上面示例中的 `custom-highlight-name`）。这个参数不是随意而来的，需要使用相关的 JavaScript API 注册。

也就是说，为了让自定义高亮生效（`custom-highlight-name` 名称有效），需要将其注册到“高亮注册表”（`HighlightRegistry`）中。注册表是一个类似于映射的数据结构，可以使用常规的映射方法添加、移除、更新自定义高亮。一旦自定义高亮被注册，它就可以通过 `::highlight()` 伪元素来选中对应的文本，并对它们应用相应的 CSS 样式。

另外，`::highlight()` 伪元素和 `::selection` 伪元素相似，只有部分 CSS 属性可用：

*   文本颜色 `color`
*   背景颜色 `background-color`
*   文本修饰 `text-decoration`
*   文本阴影 `text-shadow`
*   文本描边 `-webkit-text-stroke`
*   文本填充 `-webkit-text-fill-color`
*   光标 `cursor`
*   强调标记的颜色 `text-emphasis-color`
*   轮廓 `outline`

## 进入自定义高亮 API

正如上面所说，`::highlight()` 伪元素给文本范围设置高亮样式，还是需要借助 JavaScript 脚本的。即需要基于自定义高亮 API 编写一些 JavaScript 脚本，才能注册一个自定义高亮的名称提供给 `::highlight()` 伪元素使用。

在使用 CSS 自定义高亮 API 设置 Web上文本范围高亮的样式需要一些必备的步骤，主要有四个步骤：

*   第 ① 步：创建 `Range` 对象，即**创建选区**，这一步很重要
*   第 ② 步：为这些范围创建 `Highlight` 对象，即**创建高亮**
*   第 ③ 步：使用 `HighlightRegistry` 进行注册，即**注册高亮**
*   第 ④ 步：使用 `::highlight()` 伪元素定义高亮样式，即**样式化高亮文本**

### 第 ① 步：创建选区

创造选区指的是你想设置高亮样式的文本范围，\*\*就像用鼠标滑过选区一样。\*\*你可以使用 JavaScript 中的 `Range` 创建要高亮显示的文本范围。和设置当前选择时一样，需要执行以下步骤：

```JavaScript
const range = new Range();
range.setStart(parentNode, startOffset);
range.setEnd(parentNode, endOffset);
```

需要注意的是，如果作为第一个参数传递的节点是文本节点，则 `setStart` 和 `setEnd` 方法的工作方式会有所不同。对于文本节点，偏移量对应于节点内的字符数。对于其他节点，偏移量对应于父节点中的子节点数量。

还需要注意的是，`setStart` 和 `setEnd` 并不是描述范围起点和终点的唯一方法。[查看 Range 类中的其他可用方法](https://dom.spec.whatwg.org/#ranges)，以了解其他选项。

这一步是很重要的，相对而言，这也是最复杂的一部分，例如：

```HTML
<div id="foo">
    <p>我是一段文本....</p>
    <p>我是一段文本....</p>
    <p>我是一段文本....</p>
    <p>我是一段文本....</p>
    <p>我是一段文本....</p>
</div>
```

```JavaScript
const parentNode = document.getElementById("foo");

const range1 = new Range();
range1.setStart(parentNode, 2);
range1.setEnd(parentNode, 3);

const range2 = new Range();
range2.setStart(parentNode, 5);
range2.setEnd(parentNode, 10);
```

这样就要以获得高亮文本范围对象（选区）`range1` 和 `range2` 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2858ae4c1c014a6b8382e5f524cf5da1~tplv-k3u1fbpfcp-zoom-1.image)

### 第 ② 步：创建高亮

第二步是为在上一步创建的范围创建 `Highlight 对象`。 `Highlight` 对象可以接收一个或多个范围。因此，如果要以完全相同的方式突出显示一堆文本片段，则应该创建一个单独的 `Highlight` 对象，并使用所有对应于这些文本片段的范围进行初始化。

```JavaScript
const highlight = new Highlight(range1, range2, ..., rangeN);
```

但您也可以根据需要创建尽可能多的 `Highlight` 对象。例如，如果正在构建每个用户都有不同文本颜色的协作文本编辑器，则可以为每个用户创建一个 `Highlight` 对象。

```JavaScript
const highlight1 = new Highlight(user1Range1, user1Range2);
const highlight2 = new Highlight(user2Range1, user2Range2, user2Range3);
```

然后可以根据下一步的操作对每个对象进行不同的样式设置，即每个高亮可以设置不同的样式。

### 第 ③ 步：注册高亮

现在，单独的 `Highlight` 对象没有任何作用。首先需要使用 [CSS Highlights API](https://www.w3.org/TR/css-highlight-api-1/#highlight-registry) 将其注册到所谓的 `HighlightRegistry`中。该注册表类似于一个地图，您可以通过给它们命名来注册新的高亮显示，以及删除高亮显示（甚至清除整个注册表）。

以下是注册单个 `Highlight` 的方法：

```JavaScript
CSS.highlights.set('my-custom-highlight', highlight);
```

其中，`my-custom-highlight` 是你选择的名称（这个名称可以是任意你喜欢的名称，但只要是一个有效的 CSS `<ident-token>` 即可），`highlight` 是在上一步（第 ② 步）创建的 `Highlight` 对象。

### 第 ④ 步：样式化高亮文本

最后一步是实际上对已注册的亮点进行样式化。这是通过使用新的CSS `::highlight()` 伪元素完成的，使用你在注册 `Highlight` 对象时选择的名称（在上面的示例中为 `my-custom-highlight`）。

```CSS
::highlight(my-custom-highlight) {
    background-color: orange;
    color: black;
}
```

以上就是使用自定义高亮 API 样式化文本范围的全部过程。最终示例代码：

```JavaScript
const parentNode = document.getElementById("foo");

// 第 ① 步：创建选区
const range1 = new Range();
range1.setStart(parentNode, 4);
range1.setEnd(parentNode, 6);

const range2 = new Range();
range2.setStart(parentNode, 8);
range2.setEnd(parentNode, 10);


// 第 ② 步：创建高亮
const highlight1 = new Highlight(range1);
const highlight2 = new Highlight(range2);

// 第 ③ 步：注册高亮
CSS.highlights.set('my-custom-highlight', highlight1);
CSS.highlights.set('my-custom-highlight2', highlight2);
::highlight(my-custom-highlight) {
    background-color: orange;
    color: black;
}

::highlight(my-custom-highlight2) {
    background-color: #09f;
    color: #fff;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d68edbfeba946f19e8ef767399efd36~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKGZbRL>

以上就是全部过程了，稍显复杂，但还是比较好理解的，关键是第一步创建选区的过程最为复杂，下面用一张图总结一下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4957f54856704dc5b52d679338e9c741~tplv-k3u1fbpfcp-zoom-1.image)

## 更新高亮部分

有多种方法可以更新页面上的高亮文本。

例如，你可以使用 `CSS.highlights.clear()` 清除高亮注册表，然后从头重新开始。或者，你还可以更新基础范围，而无需重新创建任何对象。为此，请再次使用 `range.setStart` 和 `range.setEnd` 方法（或任何其他`Range`方法），浏览器将重新绘制高亮部分。

但是，`Highlight` 对象的工作方式类似于JavaScript 的 `Set`，这意味着你也可以使用 `highlight.add(newRange)` 向现有 `Highlight` 中添加新的 `Range` 对象或使用 `highlight.delete(existingRange)` 删除范围。

第三，你还可以从 `CSS.highlights` 注册表中添加或删除特定的 `Highlight` 对象。由于此 API 的工作方式类似于JavaScript 的 `Map`，因此可以设置和删除以更新当前注册的 `Highlights`。

## 高亮样式化范围文本的示例

有关于 CSS 自定义高亮 API 的原理就是这样，我们来看两个这方面的示例。首先来看一个**高亮显示搜索结果**的示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18d53fc81d8449f58593e752504c3e73~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNqpmjm>

这个示例展示了如何使用 CSS 自定义高亮 API 高亮显示搜索结果。

下面的 HTML 代码片段定义了一个搜索框和有几个标题与几段文字的 Web 页面：

```HTML
<form>
    <label for="search">搜索：</label>
    <input type="search" id="search" name="search" placeholder="请输入你需要搜索的关键词" />
</form>
<main>
    <h2>我的第一本小册：现代 Web 布局</h2>
    <p>随着众多 CSS 新特性出现， Web 布局迎来了质的飞跃，开发者可以快速构建出一个具有创造性的 Web 布局。本小册通过大量图文和示例，带大家了解 Web 布局技术的发展和演变，深入探讨可用于现代 Web 布局的技术细节，比如 Flexbox ，Grid 等。</p>
    <h2>我的第二本小册：防御式 CSS 精讲</h2>
    <p>如何使自己构建的 UI 或编写的 CSS 代码更具防御性（健壮性），确保还原的 UI 在不同的条件下都能工作，不打破 Web 布局或 Web UI，是每位专业的 Web 前端开发者必备的技能。这本小册从“防御式”角度出发，分析了布局、UI 效果、媒体对象、交互体验等多种场景下编写 CSS 的注意事项，你可以把它当作 CSS 技巧集合或 CSS 魔法集合！</p>
    <h2>关于我</h2>
    <p>常用昵称“大漠”，W3CPlus创始人，曾就职于淘宝。对HTML、CSS和A11Y等领域有一定的认识和丰富的实践经验。CSS和Drupal中国布道者。2014年出版《图解CSS3：核心技术与案例实战》。</p>
</main>
```

使用 JavaScript 监听搜索框上的 `input` 事件，当事件触发，这段代码将在文章的文本中为输入文本查找匹配项。然后它创建匹配的范围，并使用 CSS 自定义高亮 API 创建并注册一个 `search-result-highlight` 高亮对象:

```JavaScript
const search = document.querySelector("#search");
const main = document.querySelector("main");

// 创建 createTreeWalker 迭代器，用于遍历文本节点，保存到一个数组
const treeWalker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
const allTextNodes = [];
let currentNode = treeWalker.nextNode();
while (currentNode) {
    allTextNodes.push(currentNode);
    currentNode = treeWalker.nextNode();
}

// 监听inpu事件
search.addEventListener("input", () => {
    // 清除上个高亮
    CSS.highlights.clear();

    // 为空判断
    const str = search.value.trim().toLowerCase();
    if (!str) {
        return;
    }

    // 查找所有文本节点是否包含搜索词
    const ranges = allTextNodes
        .map((el) => {
            return { el, text: el.textContent.toLowerCase() };
        })
        .filter(({ text }) => text.includes(str))
        .map(({ text, el }) => {
      
            const indices = [];
            let startPos = 0;
            while (startPos < text.length) {
                const index = text.indexOf(str, startPos);
                if (index === -1) break;
                indices.push(index);
                startPos = index + str.length;
            }
    
            // 根据搜索词的位置创建选区
            return indices.map((index) => {
                const range = new Range();
                range.setStart(el, index);
                range.setEnd(el, index + str.length);
                return range;
            });
        });

    // 创建高亮对象
    const highlight = new Highlight(...ranges.flat());
    
    // 注册高亮
    CSS.highlights.set("search-result-highlight", highlight);
});
```

最后，在 CSS 中使用 `::highlight()` 伪元素来设置高亮样式。

```CSS
::highlight(search-result-highlight) {
    background-color: yellow;
    color: black;
}
```

这样就实现了一个**高亮显示搜索结果**:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca75d55044c64462a2fd2d759f26173c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNqpmjm>

它和浏览器提供的效果完全相似：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/832b51cf8f1a449eaa3beb4d6236737c~tplv-k3u1fbpfcp-zoom-1.image)

注意，到目前为止，**还无法自定义原生搜索高亮的黄色背景，而且不同的浏览器的效果也是有差异的**，比如 Chrome 浏览器的背景是黄色，文本是黑色，而 Firefox 浏览器的搜索高亮的背景是紫色，文本是白色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16ba98e50340458cb8179d4dc54c551b~tplv-k3u1fbpfcp-zoom-1.image)

再来看一个 CSS 自定义高亮 API 实现七彩文本填充的效果。文本将按红色（`#FF0000` ）、橙色（`#FFA500` ）、黄色（`#FFFF00` ）、绿色（`#008000` ）、青色（`#00FFFF` ）、蓝色（`#0000FF` ）和紫色（`#800080` ）七种颜色依次填充，而且不断循环：

```HTML
<p id="rainbow-text">🚀使用 CSS Custom Highlight API 创建七彩文本！🥰</p>
```

使用 JavaScript 创建七个高亮区：

```JavaScript
const textNode = document.getElementById("rainbow-text").firstChild;

if (CSS.highlights) {

    const highlights = [];
    for (let i = 0; i < 7; i++) {
        // 给每个颜色实例化一个Highlight对象
        const colorHighlight = new Highlight();
        highlights.push(colorHighlight);

        // 注册高亮
        CSS.highlights.set(`rainbow-color-${i + 1}`, colorHighlight);
    }

    // 遍历文本节点
    for (let i = 0; i < textNode.textContent.length; i++) {
        // 给每个字符创建一个选区
        const range = new Range();
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);

        // 添加到高亮
        highlights[i % 7].add(range);
    }
}
```

然后使用 `::highlight()` 为每个高亮区设置样式，分别对应红、橙、黄、绿、青、蓝和紫七色：

```CSS
::highlight(rainbow-color-1) {
    color: #FF0000; /* 红色 */
}
::highlight(rainbow-color-2) {
    color: #FFA500; /* 橙色 */
}
::highlight(rainbow-color-3) {
    color: #FFFF00; /* 黄色 */
}
::highlight(rainbow-color-4) {
    color: #008000; /* 绿色 */
}
::highlight(rainbow-color-5) {
    color: #00FFFF; /* 青色 */
}
::highlight(rainbow-color-6) {
    color: #0000FF; /* 蓝色 */
}
::highlight(rainbow-color-7) {
    color: #800080; /* 紫色 */
}
```

最终文本效果如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60568d1dacea4514981f200e1b88e95e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOXJXg>

## 小结

首先，即使 CSS 自定义高亮 API 一开始可能看起来有点复杂。即：

*   需要先使用 `new Range()` 创建选区
*   然后再使用 `new Highlight()` 创建高亮
*   接着使用 `CSS.highlights.set()` 注册高亮
*   最后再使用 CSS 的伪元素 `::highlight()` 来样式化高亮文本

但它仍然比新建 DOM 元素并将它们插入到正确位置要简单得多。更重要的是，浏览器引擎可以非常快速地样式化这些文本范围高亮。也就是说，自定义高亮 API 相比传统使用标签的方式有很多优点：

*   使用场景更广泛，不用去修改 DOM 结构
*   性能更好，避免了操作 DOM 带来的额外开销
*   几乎没有副作用，能有效减少 DOM 变化引起的其他影响，比如光标选区的处理

其实归根结底，都是 DOM 变化带来的，而 CSS 自定义高亮 API 恰好能有效避开这个问题。当然也有一些缺陷，只允许在 `::highlight()` 伪元素中使用 CSS 属性子集。其中的主要原因是，该子集仅包含可以由浏览器非常有效地应用，而无需重新创建页面布局的属性。通过在页面中插入新的 DOM 元素来突出显示文本范围需要引擎做更多的工作。

另外，CSS 自定义高亮 API 还是一个实验性的属性，随着时间往前推移，它的使用或许会有所改变。而且，目前主流浏览器对其兼容性还有所差异，如果你需要使用该特性，就需要权衡一下利弊。
