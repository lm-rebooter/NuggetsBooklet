在 Web 开发中，元素的精准定位对于 Web 开发者一直都是一个挑战。无论是为了创建交互式菜单、信息提示框、弹出式窗口还是实现复杂的 Web 布局效果，Web 开发人员通常需要借助 JavaScript 等技术手段来实现元素的位置控制。然而，随着 CSS 的不断发展和创新，一种全新的方法正在崭露头角，为 Web 开发者提供了更简单、更灵活的元素定位方式，那就是 **CSS 锚点定位**（**CSS Anchor Positioning**）。

  


传统的 [CSS 定位机制](https://www.w3.org/TR/css-position-3/#position-property)（`position`）为我们提供了绝对定位（`absolute`）的能力，使我们可以将元素精确放置在页面上的任何位置。这种灵活性为 Web 设计师和开发人员带来了巨大的便利，但与此同时，它也带来了挑战。特别是在创建[响应式 Web 布局](https://juejin.cn/book/7161370789680250917/section/7165845190614188062)或需要相对于其他元素进行定位的情况下，传统的 CSS 定位可能显得复杂和限制多多。

  


CSS 锚点定位（CSS Anchor Positioning）是一项创新性的功能，它为我们带来了元素定位的全新范式。通过 CSS 锚点定位，我们能够将元素与其他元素关联起来，实现相对于其他元素的精确定位，而无需繁琐的 JavaScript 计算或额外的 HTML 标记。这一功能的出现，为我们提供了更多灵活性、更简单的实现方式，以及更好的性能。

  


在这节课中，我们将深入探讨 CSS 锚点定位的概念、基本原理、用法和最佳实践。我们将探讨如何使用锚点定位将元素精确定位到其他元素附近，以及如何应对各种复杂的定位需求。无论你是初学者还是经验丰富的开发人员，这节课都将帮助你更好地理解和利用 CSS 锚点定位，以提升你的网页设计和开发技能。让我们一起探索这个令人兴奋的新特性，为 Web 布局和定位带来全新的可能性！

  


## 传统的 CSS 定位的挑战

  


菜单（`Menus`）、工具提示（`Tooltips`）、日期选择器（`DataPickers`）、对话框（`Dialog`）和弹出窗口（`Popover`）等在 Web 上随处可见。尽管这些组件如此常见，但大多数情况下都没有原生的 HTML 元素（对话框 `Dialog` 除外）。它们的实现通常需要复杂的 CSS 技巧或基于 JavaScript 的计算。

  


拿维基百科的工具提示（`Tooltips`）为例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55e5e6d6b4554706840edea3548f8d69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=734&s=6389868&e=gif&f=331&b=fefefe)

  


目前为止，你可能会考虑下面这种做法，将一个元素与另一个元素关联起来，并且会使用传统的 CSS 定位来追踪它们的位置：

  


```HTML
<div class="tooltips">
    <a href="#" class="anchor">Hove Me</a>
    <span class="anchored">Sample text for your tooltip!</span>
</div>
```

  


```CSS
.tooltips {
    position: relative;

    .anchored {
        position: absolute;
        left: 50%;
        translate: -50% calc(100% + 5vh);
        opacity: 0;
        transition: all .2s linear;
    }

    &:hover .anchored {
        translate: -50% -100%;
        opacity: 1;
        animation: shake 500ms ease-in-out forwards;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aa792110ac54b7e8b3f4f8e5bf020cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=482&s=284225&e=gif&f=140&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/mdaQwPN

  


事实上，该方案并不理想。因为，传统的 CSS 定位有一个最常见的困难，那就是实现复杂和精确的布局，尤其是在处理动态内容或响应式设计时。基于静态坐标定位元素可能导致在不同设备和屏幕尺寸上布局不一致。例如，如果你打开工具提示（`Tooltips`），并且它被视口裁剪，这可能不是一个很好的用户体验。你希望工具提示（`Tooltips`）能够自适应。另外，你还希望与页面进行交互时不会破坏工具提示（`Tooltips`），例如，如果用户滚动页面或调整视图大小，工具提示能自动调整位置。为了避免这些现象，你不得不使用更为复杂的 CSS 技巧或使用 JavaScript 来计算。

  


换句话说，根据元素关系定位元素对于传统的 CSS 定位是非常棘手的，甚至可能需要 JavaScript 进行干预。这也将引发一些问题，比如：

  


-   何时计算样式？
-   如何计算样式？
-   多久计算一次样式？
-   等等...

  


这样做，对于你的使用情况可能有效，但这种变通方法可能容易出错，耗时，并且根据你的使用方式可能会影响到 Web 页面的性能。此外，处理滚动和固定定位可能会很麻烦，特别是在复杂的布局中。

  


也就是说，如果你只想将一个元素锚定到另一个元素。在理想情况下，你的解决方案将会自动调整并对其周围环境作出反应。CSS 锚点定位特性可以使你轻易地解决上面提到的这些问题。

  


## CSS 锚点定位简介

  


CSS 锚点定位（CSS Anchor Positioning）是一种用于在 Web 页面上定位元素的新方法，它是 CSS 的一个新特性。[W3C 规范是这样描述](https://www.w3.org/TR/css-anchor-position-1/#intro)的：“通过锚点定位（通过锚定位函数 `anchor()` 和 `anchor-size()`）可以将一个绝对定位的元素与页面上的一个或多个其他元素锚定在一起，同时还允许他们尝试多种可能的位置，以找到避免重叠和溢出的最佳位置”。

  


简单地说，CSS 锚点定位提高了元素绝对定位的能力，Web 开发者可以使用一种更简单、更自然的方式来定位元素之间的关系，使得页面元素能够根据其包含块内的其他元素的位置和大小进行定位和调整。该功能的出现为 Web 开发人员提供了更多的控制权和灵活性，同时减少了对 JavaScript 依赖，使页面的性能更加优化。

  


CSS 锚点定位通过引入一组属性和值，使元素能够与彼此连接，为 Web 布局中的定位提供了一种全新的范式：

  


-   首先，使用 `anchor-name` 来定义一个锚点，经过标记的元素会作为绝对定位的基准目标
-   其次，将 `anchor()` 或 `anchor-size()` 函数用作被定位元素的内嵌属性（`top` 、`right` 、`bottom` 、`left` 或它们的逻辑等效属性）的值
-   最后，使用 `@position-fallback` 规则为锚点定位提供回退机制，即设置多套不同的锚点定位规则，以适应更为复杂的 Web 布局

  


除此之外，[CSS 锚点定位草案还引入了几个扩展了 Web 布局可能性的功能](https://drafts.csswg.org/css-anchor-position-1/)：

  


-   **锚定边缘（** **`anchor-edge`** **）** ：允许 Web 开发人员定义元素应该锚定到哪些确切边缘，从而提供了对位置的精确控制
-   **锚定外边距（** **`anchor-margin`** **）** ：允许 Web 开发人员指定在被定位元素周围的额外边距
-   **滚动锚定（** **`overflow-anchor`** **）** ：当元素动态添加或从文档中移除时，它有助于保持滚动位置不变。它防止页面跳跃，为用户提供更平滑的滚动体验

  


> 注意，这几个新扩展的特性可能会随着后续规范的完善有所改变，甚至是有可能被废弃！未来应该以正式规范为主！

  


如果从功能上来说，它主要包含以下几个方面：

  


-   **定位元素相对于锚点元素**：允许 Web 开发人员将一个元素相对于页面上的其他元素进行定位。这使得元素的位置可以根据锚点元素的位置来确定
-   **灵活的定位** ：允许尝试多种可能的位置来找到避免重叠和溢出的最佳位置。这增加了 Web 布局的灵活性
-   **无需依赖 JavaScript 脚本**：与传统的 JavaScript 相比，CSS 锚点定位不需要使用 JavaScript 来实现元素的定位
-   **自适应性**：可以自动适应不同屏幕尺寸和视窗大小，确保元素的位置始终合适，不会被遮挡。这在响应式 Web 设计中尤其有用
-   **降低依赖性**：减少了对 JavaScript 库和第三方依赖项的需求，使 Web 页面更轻量级，性能更佳
-   **适用于顶层元素**：可以与位于 Web 页面的顶层元素一起使用，不受其他元素的影响

  


总之，CSS 锚点定位是一项令人兴奋的新功能，它为 Web 布局和元素定位提供了一种更简单、更灵活的方式，使得 Web 开发人员能够更轻松地实现各种复杂的布局效果，而无需依赖复杂 JavaScript 计算。

  


## CSS 锚点定位的使用

  


由于 CSS 锚点定位是 CSS 新特性之一，它仍处于实验阶段，为了确保你在浏览器中能看到示例展示的效果，请使用 Chrome 或 Chrome Canary 浏览器，并且在地址栏中输入 `chrome://flags` ，然后启用"实验性Web平台功能"标志。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bb9cdeb6b3d42d9aba80337b951abc4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2880&h=762&s=169994&e=png&b=ffffff)

  


你也可以使用 [OddBird](https://www.oddbird.net/) 团队为 CSS 锚点定位提供的 Polyfill （[CSS Anchor Positioning Polyfill](https://anchor-polyfill.netlify.app/)）。当然，[还可以使用 @supports 对 CSS 锚点定位做检测](https://juejin.cn/book/7223230325122400288/section/7258822669154877480)，检测你使用的浏览器是否支持该特性：

  


```CSS
@supports (anchor-name: --foo) {
    /* CSS ... */
}
```

  


接下来，我们就可以开始进入 CSS 锚点定位的世界！

  


为了能让大家对 CSS 锚点定位有一个更形象的认识，我们先从传统的 CSS 绝对定位着手。例如：

  


```HTML
<div class="container">
    <div class="anchor"></div>
    <span class="anchored"></span>
    <span class="anchored"></span>
    <span class="anchored"></span>
    <span class="anchored"></span>
</div>
```

  


这是一段很简单的 HTML 的结构。接着使用 CSS 将 `.container` 变为一个相对容器，而 `.anchored` 则是需要被定位的元素，即应用了绝对定位的元素：

  


```CSS
.container {
    position: relative;
    
    .anchored {
        position: absolute;
        
        &:nth-child(1) {
            top: 0;
            left: 0;
        }
        
        &:nth-child(2) {
            top: 0;
            right: 0;
        }
        
        &:nth-child(3) {
            left: 0;
            bottom: 0;
        }
        
        &:nth-child(4) {
            right: 0;
            bottom: 0;
        }
    }
}
```

  


稍微对 CSS 的定位有所了解的开发者都知道，四个绝对定位元素（`.anchored`）相对于其父容器 `.container` 进行定位，它们分别位于 `.container` 容器的四个角落：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d85c90d23124b00b0524246978a815b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1994&s=1045851&e=jpg&b=ffffff)

  


CSS 锚点定位还没出现之前，希望绝对定位元素（`.anchored`）相对于兄弟元素 `.anchor` 定位是需要 JavaScript 计算才能完成的。现在，Web 开发者可以使用 CSS 锚点定位按下面步骤来实现。

  


### 定义一个锚点

  


要使用 CSS 锚点定位，你首先需要定义一个锚点，以便用于定位其他元素。可以通过 CSS 或 HTML 两种方式来定义锚点。

  


你可以在 CSS 中定义锚点，方法是在锚点元素上设置 `anchor-name` 属性，例如：

  


```CSS
.anchor {
    anchor-name: --my-anchor;
}
```

  


`anchor-name` 属性接受类似 `--my-anchor` 的横杠标识符值（`<dashed-ident>`）。接下来，你可以使用 `anchor-default` 属性将另一个元素连接到你定义的锚点上。例如下面这个示例：

  


```HTML
<a href="#" class="anchor">Hove Me</a>
<span class="anchored">Sample text for your tooltip!</span>
```

  


使用 `anchor-name` 属性将 `.anchor` 元素定义为一个锚点，然后使用 `anchor-default` 属性将 `.anchored` 元素连接到 `.anchor` 锚点上：

  


```CSS
.anchor {
    anchor-name: --my-anchor;
}

.anchored {
    position: absolute;
    anchor-default: --my-anchor;
    left: anchor(--my-anchor 50%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d290969caf6410b8d59fbc33389ebe7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=424&s=316827&e=gif&f=123&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/ZEVmgGM

  


正如你所看到的，定位元素（`.anchored`）将会相对于已定义的锚点元素（`.anchor`）定位，不再是相对于离其最近的设置了非 `static` 值的 `position` 属性容器。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed4c45043a154ce09bd3e5f753e61f29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1994&s=1474716&e=jpg&b=ffffff)

  


这也是 CSS 锚点定位与传统 CSS 定位的主要区别之一：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bd981217cb84c3eb6caa8eeade5506e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=958&h=494&s=419258&e=gif&f=139&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/PoXxMZW

  


或者，你可以在 HTML 中使用 `anchor` 属性定义一个锚点，`anchor` 属性的值是锚点元素的 `ID` ，从而创建了一个隐式锚点。例如：

  


```HTML
<a href="#" class="anchor" id="my-anchor">Hove Me</a>
<span class="anchored" anchor="my-anchor">Sample text for your tooltip!</span>
```

上面的代码中，我们给 `.anchor` 元素分配了一个名为 `my-anchor` 的 `ID` 值，并且在 `anchored` 元素使用 `anchor` 属性来指定它应该被连接到 `my-anchor` 锚点上。这个有点类似于 HTML 的 `<label>` 元素的 `for` 属性与 `<input>` 元素的 `ID` 属性之间的关系。

  


如此一来，`.anchored` 元素也将相对于锚点元素 `.anchor` 进行定位：

  


```CSS
.anchored {
    position: absolute;
    left: anchor(50%);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17761b4ad8ca42a88819a6615fa9d428~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=330&s=305909&e=gif&f=135&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/YzdRmQW

  


在 HTML 中使用 `anchor` 属性定义的锚点与 CSS 中使用 `anchor-name` 属性定义的锚点是等效的。不同的是，HTML 定义的锚点是一个隐式锚点。

  


### 使用锚点函数定位元素

  


一旦定义了锚点，绝对定位的元素可以在其 `inset` 属性中使用锚点函数 `anchor()` 引用一个或多个锚点元素的位置。`anchor()` 函数可接受三个参数：

  


```
<anchor()> = anchor( <anchor-element>? <anchor-side>, <length-percentage>? ) 

<anchor-element> = <dashed-ident> | implicit 
<anchor-side> = auto | auto-same | top | left | right | bottom | start | end | self-start | self-end | <percentage> | center
```

  


`anchor()` 函数的三个参数值的具体含义是：

  


-   **锚点元素（** **`<anchor-element>`** **）** ：要使用的锚点的锚点名称，或者你可以省略该值以使用隐式锚点。它可以通过 HTML 关系（`anchor` 属性与 `id` 关连在一起）或带有锚点名称（`anchor-name`）值的 `anchor-default` 属性来定义，可以是 `<dashed-ident>` （比如 `--my-anchor`）或 `implicit` （隐式锚点）。该参数值指定了定位元素从哪个锚点元素获取定位信息。

-   **锚点位置（** **`<achor-side>`** **）** ：指的是目标锚点元素相应边缘的位置，即你要使用的位置的关键字。它的值可以是：

    -   `auto` 和 `auto-same` ：根据在哪个 `inset` 属性中使用它来解析为锚点元素的一侧，触发自动回退行为
    -   `top` 、`right` 、`bottom` 和 `left` ：引用锚点元素指定边缘。注意，这些只能在匹配轴上的 `inset` 属性中使用
    -   `start` 、`end` 、`self-start` 和 `self-end` ：通过将关键词与定位元素的书写模式（对于 `self-start` 和 `self-end`）或定位元素包含块（对于 `start` 和 `end` ）的书写模式相匹配，引用与 `inset` 属性相同轴上的锚点元素的一侧
    -   `<percentage>` 和 `center` ：引用与开始或结束边缘之间对应百分比之间的位置，其中 `0%` 等同于 `start` ，`100%` 等同于 `end` 。`center` 等同于 `50%`

-   **回退值（** **`<length-percentage>`** **）** ：指定如果它是无效的锚点函数，函数应该解析为什么。这是一个可选的回退值，接受长度或百分比。

  


也就是说，在传统的 CSS 定位中，只能给 `inset` 属性（即 `top` 、`right` 、`bottom` 、`left` 或它们的逻辑等效属性）设置长度或百分比值，它们是相对于定位容器盒子边缘定位。在 CSS 锚点定位中，是将锚点函数（`anchor()`）作为定位元素的 `inset` 属性的值，将会相对于锚点元素盒子边缘定位。例如前面示例中的代码所示：

  


```CSS
.anchored {
    left: anchor(--my-anchor 50%);
}

/* 使用 anchor-default 的替代方法 */
.anchored {
    anchor-default: --my-anchor;
    left: anchor(50%);
}
```

  


来看一个简单的案例。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f42b566b63464e619b0e557b3dd9c646~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=444&s=767349&e=gif&f=207&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/qBLLWEq

  


示例中每个 `Tooltips` 都是相对于锚点元素定位的。我在这里使用了单个 HTML 元素来实现的 `Tooltips` ：

  


```HTML
<p>Do you like <span data-tooltip="like this one" tabindex="0" style="--anchor: --tooltip-1;">tooltips</span>? Do want to use them <span data-tooltip="well do you?" tabindex="0" style="--anchor: --tooltip-2;">without a hassle</span>? <span data-tooltip="also known as smart CSS" tabindex="0" style="--anchor: --tooltip-3;">Effortless Style</span> is here to help you!</p>
```

  


使用了内联 CSS ，将每个 `span[data-tooltip]` 定义为锚点元素，例如 `--anchor: --tooltip-1` 。`Tooltips` 的 UI 是使用锚点元素的伪元素 `::before` 和 `::after` 实现的，并且其内容通过 `content` 属性的 `attr()` 函数获取元素的 `data-tooltip` 属性的值。

  


最为关键的是，每个 `Tooltips` 的定位是根据相应的锚点来定位的：

  


```CSS
@layer anchor {
    [data-tooltip] {
        anchor-name: var(--anchor);
    
        &::before,
        &::after {
            position: absolute;
            left: anchor(var(--anchor) center);
            bottom: anchor(var(--anchor) bottom);
        }
    
        :is(&:hover, &:focus-visible) {
            &::before,
            &::after {
                bottom: anchor(var(--anchor) top);
          }
        }
    }
}
```

  


你还可以在 `calc()` 函数中使用锚点函数。例如，把上面示例中的 `bottom` 属性的值调整为：

  


```CSS
@layer anchor {
    [data-tooltip] {
        anchor-name: var(--anchor);
    
        &::before,
        &::after {
            position: absolute;
            anchor-default: var(--anchor);
            left: anchor(center);
            bottom: calc(-5cqb - anchor(top));
        }
    
        :is(&:hover, &:focus-visible) {
            &::before,
            &::after {
                bottom: anchor(top);
            }
        }
    }
}

/* 等同于 */
@layer anchor {
    [data-tooltip] {
        anchor-name: var(--anchor);
    
        &::before,
        &::after {
            position: absolute;
            /* anchor-default: var(--anchor); */
            left: anchor(center);
            bottom: calc(-5cqb - anchor(var(--anchor) top));
        }
    
        :is(&:hover, &:focus-visible) {
            &::before,
            &::after {
                bottom: anchor(var(--anchor) top);
            }
        }
    }
}
```

  


这样做可以使得 `Tooltips` 组件的 `bottom` 属性的初始值与终点值相差较大，使得 `Tooltips` 组件明显的从下面往上移入，有点类似于 `slideInUp` 的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56e9327f50ff4c4587a390854bcab094~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=538&s=762482&e=gif&f=188&b=ffffff)

  


  


> Demo 地址：https://codepen.io/airen/full/GRPPRpa

  


  


不难发现，每个 `Tooltips` 组件在水平方向都是位于锚点元素的正中间（它与锚点元素水平居中对齐）。因为 `left` 的值为 `anchor(center)` ，并且使用 `translate` 属性沿着 `x` 轴向左拉回 `50%` ：

  


```CSS
[data-tooltip] {
    &::before,
    &::after {
        left: anchor(center); /* 相当于 left: 50%;*/
    }
    
    &::before {
        translate: -50% 10px;
    }
    
    &::after {
        translate: -50% 0;
    }
}
```

  


如果你知道或者说显式给 `Tooltips` 组件定义了宽度，那么还可以像下面这样编写 CSS ，使 `Tooltips` 组件依旧相对于锚点元素水平居中：

  


```CSS
@layer anchor {
    [data-tooltip] {
        --inline-size: 120px;
        anchor-name: var(--anchor);
        
        &::before,
        &::after {
            position: absolute;
            anchor-default: var(--anchor);
            width: var(--inline-size);
          
            /* left: anchor(center); */
            left: calc(anchor(center) - var(--inline-size) * .5);
            bottom: calc(-5cqb - anchor(top));
        }
        
        &::before {
            --inline-size: 10px;
            bottom: calc(-5cqb - anchor(top) - 10px);
        }
        
        :is(&:hover, &:focus-visible) {
            &::before {
                bottom: calc(anchor(top) - 10px);
            }
          
            &::after {
                bottom: anchor(top);
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60522297d9c840bda07b417cc0e3201f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=478&s=558243&e=gif&f=108&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/Jjwwjya

  


上面示例是显式定义定位元素的尺寸。但是，如果你希望根据锚点元素的大小来确定定位元素的大小，那么就可以使用 `anchor-size()` 函数，而不是自己计算。

  


`anchor-size()` 函数类似于 `anchor()`，并接受相同的参数，只是 `<anchor-side>` 关键字被 `<anchor-size>` 替换，它指的是两个相对边之间的距离：

  


```
anchor-size() = anchor( <anchor-element>? <anchor-size>, <length-percentage>? )

<anchor-element> = <dashed-ident> | implicit 
<anchor-size> = width | height | block | inline | self-block | self-inline
```

  


`<anchor-size>` 分为物理和逻辑关键词：

  


-   物理关键词（`width` 和 `height`）分别指的是锚点元素的宽度（`width`）和高度（`height`）。与 `anchor()` 函数不同的是，它没有必须匹配轴的限制；例如， `width: anchor-size(--my-anchor height)` 是有效的
-   逻辑关键词（`block` 、`inline` 、`self-block` 和 `self-inline`）根据元素的书写模式（对于 `self-block` 和 `self-inline` ）或元素的包含块的书写模式（对于 `block` 和 `inline`）之一，映射到物理关键词之一

  


表示有效锚点大小函数的 `anchor-size()` 函数会解析为锚点元素的相关边缘（左和右，或顶部和底部，取决于指定的轴）之间的 `<length>` 。

  


需要注意的是，只有在满足以下所有条件的情况下，`anchor-size()` 函数才是有效的：

  


-   它在绝对定位元素的尺寸属性中使用
-   存在该元素的目标锚点元素，并指定了函数中的 `<anchor-element>` 值
-   如果上面两条件中任何一条件为假（`false`），则 `anchor-size()` 函数会解析为其指定的回退值（`<length-percentage>`）。如果未指定回退值，则 `anchor-size()` 函数会解析为 `0px`

  


继续拿上面的 `Tooltips` 组件为例，假设要使 `Tooltips` 组件的宽度是锚点元素宽度的两倍，那么可以像下面这样编写 CSS ：

  


```CSS
@layer anchor {
    [data-tooltip] {
        anchor-name: var(--anchor);
        
        &::before,
        &::after {
            position: absolute;
            anchor-default: var(--anchor);
            left: anchor(center);
            bottom: calc(-5cqb - anchor(var(--anchor) top));
            translate: -50% 0;
        }
        
        &::before {
            width: 10px;
            bottom: calc(-5cqb - anchor(top) - 10px);
        }
        
        &::after {
            /* 等于锚点元素宽度的两倍 */
            width: calc(anchor-size(var(--anchor) width) * 2);
        }
        
        :is(&:hover, &:focus-visible) {
            &::before {
                bottom: calc(anchor(top) - 10px);
            }
            
            &::after {
                bottom: anchor(top);
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43321d37adc94931ab216ddd8598c746~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=488&s=832753&e=gif&f=200&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/WNLLbvZ

  


前面示例中锚点元素都是静态元素（`position: static`）。接下来，我们来看一个定位元素锚定到具有绝对定位的元素上，即锚点元素元素应用了绝对定位。

  


```HTML
<div class="draggable anchor">
    <!-- 锚点元素应用了绝对定位 -->
</div>

<!-- 锚定元素，相对于锚点元素 anchor 绝对定位 -->
<span class="anchored">Please Drag Me Around The Screen!</span>
```

  


```CSS
@layer anchor {
    .anchor {
        position: absolute;
        anchor-name: --tooltips;
    }
  
    .anchored {
        position: absolute;
        anchor-default: --tooltips;
        bottom: calc(anchor(top) + 10px);
        left: anchor(center);
        translate: -50% 0;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5efc5e54ce745a1999518dbf51f1eca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=514&s=1695517&e=gif&f=339&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/xxmmGRR

  


拖动图标时，`Tooltips` 也会随着锚点元素移动，但它始终是相对于锚点元素 `.anchor` 定位。不过，在这种情况下，建议用一个元素将锚点元素 `.anchor` 包裹起来，并且将其 `position` 属性的值设置为 `relative` ：

  


```HTML
<div class="anchor--wrapper">
    <div class="draggable anchor">
        <!-- 锚点元素应用了绝对定位 -->
    </div>
    
    <!-- 锚定元素，相对于锚点元素 anchor 绝对定位 -->
    <span class="anchored">Please Drag Me Around The Screen!</span>
</div>
```

  


```CSS
.anchor--wrapper {
    position: relative;
}
```

  


### 跟踪滚动位置

  


在某些情况下，你的锚定元素（绝对定位的元素）可能位于滚动容器内。同时，你的锚定元素可能位于容器之外。例如：

  


```HTML
<div class="scroll--container">
    <h1>What is Lorem Ipsum?</h1>
    <p>Lorem Ipsum is <span class="tooltips anchor" style="--anchor-name: --tooltips-1">simply dummy<div class="tooltips__content anchored" style="--anchor:--tooltips-1">Wet slippery thing.</div></span> text of the printing and <span class="tooltips" style="--anchor-name: --tooltips-2">typesetting industry</span>. </p>
</div>
<div class="tooltips__content anchored" style="--anchor: --tooltips-2">Formal attire. 007?</div>
```

  


由于出于性能原因，布局通常在与滚动不同的线程中执行，但 `anchor()` 可能会导致定位更改（可以在滚动线程中处理）和布局更改（无法处理），因此 `anchor()` 被定义为锚点元素和锚定元素（绝对定位元素）的容器之间的所有滚动容器都处于初始滚动位置。这意味着如果滚动容器处于非初始位置，锚定元素将无法与其锚点元素对齐。

  


基于上述原因，你需要一种追踪滚动位置的方法。CSS 的 `anchor-scroll` 属性可以做到这一点，你可以在锚定的元素上设置它，并将其值设为你想要追踪的锚点。

  


```CSS
.anchored {
    anchor-scroll: var(--anchor);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f0b4ecef1ec44c09f7782790b779564~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1180&h=626&s=18730343&e=gif&f=509&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/ZEVVKMW

  


你可能注意到了 `Tooltips` 是如何跟踪其各自的锚点元素的。你可以调整滚动容器的大小，`Tooltips` 位置也会随着锚点元素位置改变而更新。

  


也就是说，`anchor-scroll` 属性允许 Web 开发者在不不丧独立滚动线程的性能优势情况下进行补偿，只要绝对定位元素（锚定元素）锚定到相应的锚点即可。该属性有三个不同的值：

  


```
anchor-scroll = none | default | <anchor-element>
```

  


-   `none` ：无效果，不会追踪滚动位置
-   `default` ：与 `<anchor-element>` 完全相同，但其值来自元素上的 `anchor-default`
-   `<anchor-element>` ：选择与 `anchor()` 相同的目标锚点元素，将在定位和回退中进行补偿

  


需要注意的是，当元素使用 `anchor-default` 或具有隐式锚点元素时，Web 开发者通常可以避免显式设置 `anchor-scroll` 属性值，因为该属性的初始值为 `default` 。

  


另外，你可能从上面的示例中发现了，绝对定位元素（锚定元素）无法检测到已跟踪的锚点元素是否超出滚动容器视口。但是，它仍然会跟踪锚点的位置。到目前为止，还没有一种方法可以在锚点元素超出滚动容器时将锚定的元素裁剪。

  


有的时候，我们可以利用这个特性（锚定元素溢出容器无法被裁剪）来解决一些溢出问题。比如，在《[防御式 CSS](https://s.juejin.cn/ds/idjSE3Nr/)》的《[溢出常见问题与排查](https://juejin.cn/book/7199571709102391328/section/7213705145954074679#heading-12)》中[有一个是定位元素超出容器被裁剪的案例](https://codepen.io/airen/full/ExeMRvJ)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1beeacce115242c885e719434b6b7f6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1394&h=350&s=4229549&e=gif&f=72&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/ExeMRvJ

  


除了传统的 CSS 解决方案（增加额外的 HTML 标签）之外，现在可以使用 CSS 的锚点定位来解决：

  


```CSS
@layer anchor {
    .anchor {
        --anchor-name: --tooltips;
    
        & [data-title] {
            anchor-name: var(--anchor-name);
    
            &::before,
            &::after {
                anchor-default: var(--anchor-name);
                anchor-scroll: var(--anchor-name);
                left: anchor(center);
            }
    
            &::before {
                bottom: calc(anchor(top) + 8px);
            }
    
            &::after {
                bottom: calc(anchor(top) + 4px);
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b64de5ec0ad4bdca1ff9e783b37dacd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1382&h=386&s=6027539&e=gif&f=120&b=e8e0da)

  


> Demo 地址：https://codepen.io/airen/full/xxmmdoP

  


### 位置回退和自动定位

  


尽管 CSS 锚点定位功能强大，但也可能是不可预测的。锚点元素可能位于页面的任何位置，因此以任何特定方式定位元素（例如在锚点上方或锚点右侧）可能导致定位元素溢出其包含块或部分定位在屏幕外。

  


为了改善这一点，绝对定位的元素可以使用 `position-fallback` 属性引用 `@position-fallback` 中规则。该规则提供了一系列要尝试的可能样式规则，每个样式规则依次应用于元素，第一个不会导致元素溢出其包含块的规则被视为获胜者。

  


`@position-fallback` 规则定义了一个具有给定名称的位置回退列表，它指定了一个或多个包含在 `@try` 块内的定位属性集，这些属性集将应用于一个元素，每个后续的属性集都作为前一个属性集在元素溢出其包含块的情况下的回退。

  


`@position-fallback` 规则的语法如下：

  


```CSS
@position-fallback <dashed-ident> {
    @try { 
        <declaration-list> 
    }
}
```

  


`@position-fallback` 规则仅接受 `@try` 规则。在前导部分中指定的 `<dashed-ident>` 是规则的名称。如果多个 `@position-fallback` 规则使用相同的名称声明，那么文档顺序中的最后一个规则将获胜。它有点类似于 [CSS 的 @property 规则命名](https://juejin.cn/book/7223230325122400288/section/7258870477462962236#heading-1)。

  


`@try` 规则仅接受以下属性：

  


-   `inset` 属性
-   尺寸属性，比如 `width` 、`height` 、`min-width` 、`min-height` 、`max-width` 、`max-height` 以及它们同等效果的逻辑属性
-   盒对齐属性，比如 `justify-content` 、`align-content` 、`justify-self` 、`align-self` 、`justify-items` 和 `align-items` 等

  


`@position-fallback` 内部的 `@try` 规则指定了一个位置回退列表，其中每个条目由每个 `@try` 规则中指定的属性组成，按顺序排列。

  


注意，如果多个使用不同锚点的元素想要使用相同的回退定位，只是相对于它们各自的锚点元素，可以在 `anchor()` 中省略 `<anchor-element>` 并将每个元素的锚点在 `anchor-default` 中指定。

  


CSS 的 `position-fallback` 和 `@position-fallback` 是 CSS 锚点定位的一个更高级别的功能。简单地说，`position-fallback` 可以基于你提供的 `@position-fallback` 规则集（回退集合）来定位你的锚定元素（要定位的元素）。你定义的这个回退集合将会引导浏览器自动计算出最适用的一个位置。

  


比如上面的 `Tooltips` 组件，要是它在锚点的上方或下方之间切换显示，将会给用户带来更好的体验。例如：

  


```CSS
@layer anchor {
    .anchor {
        anchor-name: var(--anchor-name);
    }
  
    .anchored {
        position: absolute;
        anchor-default: var(--anchor);
        anchor-scroll: var(--anchor);
        position-fallback: --fallback;    
        inset: auto;
    }
  
    @position-fallback --fallback {
        @try {
            bottom: anchor(top);
            left: calc(anchor(left) - (anchor(center) - anchor(left)));
        }
        
        @try {
            top: anchor(bottom);
            left: calc(anchor(left) - (anchor(center) - anchor(left)));
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9826007e305d4f6f8881df86cabe88b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=432&s=18668546&e=gif&f=254&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/wvRRqJq

  


如果你滚动了容器，你可能会注意到那些被锚定的工具提示（`Tooltips`）跳动了。这是因为它们的锚点接近视口边界时发生的。在那一刻，`Tooltips` 正在尝试调整以保持在视口中。

  


在创建显式的位置回退之前，锚定定位还提供了自动定位。你可以通过在锚定函数和相反的插入属性中都使用 `auto` 值来免费获得翻转效果。例如，如果你使用 `anchor()` 用于底部，将 `top` 设置为 `auto`。

  


```CSS
.tooltips {
    position: absolute;
    bottom: anchor(--my-anchor auto);
    top: auto;
}
```

  


注意，上面这种方式也是最常见的回退定位类型（通常将定位元素放在锚点元素的一侧，但如果需要翻转到相反的一侧）可以通过在 `anchor()` 函数中使用 `auto` 或 `auto-side` 。[你可以查阅 W3C 规范，更深入的了解有关于自动定位规则的详细信息](https://drafts.csswg.org/css-anchor-position-1/#automatic-anchor-positioning)。

  


与自动定位相反的选择是使用显式的位置回退。这需要你定义一个位置回退集合。浏览器将遍历这些回退选项，直到找到一个可以使用的选项，然后用于该定位。如果找不到可行的选项，它将默认使用第一个定义的选项。

  


继续拿 `Tooltips` 组件为例：

  


```CSS
@layer anchor {
    .anchor {
        anchor-name: var(--anchor-name);
    }

    .anchored {
        position: absolute;
        anchor-default: var(--anchor);
        anchor-scroll: var(--anchor);
        position-fallback: --fallback;
    }

    @position-fallback --fallback {
        @try {
          bottom: anchor(top);
          left: anchor(center);
        }
    
        @try {
          top: anchor(bottom);
          left: anchor(center);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f3483fbdf3948ba9c79cd7b0e694ebf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=958&h=628&s=13947750&e=gif&f=156&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/jOXXLoQ

  


使用 `anchor-default` 意味着你可以将位置回退用于其他元素。你还可以使用作用域定制属性来设置 `anchor-default`。

  


请注意，某些用户代理样式可能会为你设置 `inset` 属性。在这些情况下，你可能希望在定义位置回退之前取消这些设置。比如使用 `popover` 属性的元素，就应该先将 `inset` 属性的值重置为 `unset`。

  


### 锚点定位的其他特性

  


CSS 锚点定位除了上提到的特性之外，CSS 锚点定位的草案还引入了几个扩展 Web 布局可能性的功能。

  


首先，CSS 锚点定位规范引入了锚定边缘（`anchor-edge`）的概念，允许 Web 开发人员定义元素应该锚定到哪些精确的边缘。这提供了对位置精确控制。例如：

  


```CSS
.element {
    anchor-edge: left top;
}
```

  


上面的代码将会使 `.element` 元素锚定到其包含块的左上角。

  


引入的第二个概念是锚定边距（`anchor-margin`），允许 Web 开发人员指定锚定元素周围的附加边距。在处理重叠元素时，这个特别有用。例如：

  


```CSS
.element {
    anchor-margin: 20px;
}
```

在这里，`.element` 元素有额外的 `20px` 边距。

  


还有一个就是滚动锚定。滚动锚定是一项功能，帮助在文档中动态添加或删除元素时维护滚动位置。它防止页面跳跃，为用户提供更流畅的滚动体验。滚动锚定是默认开启的，如果你有需要，可以像下面这样禁用它：

  


```CSS
html {
    overflow-anchor: none;
}
```

上面代码禁用了整个 HTML 文档的滚动锚定行为。

  


> 注意，这里主要阐述了 CSS 锚点定位的主要特性，但目前有些特性还处于规范的草案阶段，它们有可能会因规范的变更而有所差异。最终将以 W3C 发布的规范为准！

  


## CSS 锚点定位用例

  


阅读到这里，我想你对 CSS 锚点定位有了一定的认识。接下来，我们一起来看一些有趣的案例。这些案例旨在激发你的创意，同时这些案例将告诉你可以如何使用 CSS 锚点定位，并且通过这些真实案例的学习，你将对 CSS 锚点定位的特性会有更进一步的了解。

  


### 熔岩灯菜单（Lava Lamp Menu）

  


我们先从熔岩灯菜单（Lava Lamp Menu）开始！

  


熔岩灯菜单是 Web 页面设计中的一种经典导航菜单效果，通常在菜单项之间添加流动的动画效果，使当前选定的菜单项看起来像熔岩灯一样流动或高亮显示，以表示当前活动页面或选项。如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f1e8ec294db49ea8b4f13bedf920c83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=346&s=8104983&e=gif&f=84&b=c881c8)

  


> Demo 地址：https://codepen.io/ghosh/details/KKxKqEw

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d183dea7baa74607bd94d03c1cff4b76~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=488&s=292031&e=gif&f=86&b=191919)

  


> Demo 地址：https://codepen.io/F12/full/DmvVWW

  


以往要实现熔岩灯菜单效果，我们不得不依赖 JavaScript 脚本来完成。现在，我们可以使用 CSS 锚点定位来实现它。例如：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85e8514ea07e4935b3eb398bd17793dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044&h=328&s=460975&e=gif&f=159&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/RwEpMxM

  


HTML 部分很简单，就是一个包含链接元素 `<a>` 的无序列表 `<ul>` ：

  


```HTML
<ul class="nav">
    <li><a href="">Home</a></li>
    <!-- 省略其他的导航菜单项 -->
    <li><a href="">Contact us</a></li>
</ul>
```

  


鼠标悬停在菜单项时有一个粉红色的圆环（类似焦点环效果）出现，我们把这个称为“熔岩灯”，它是列表（`ul`）的 `::before` 伪元素构建的（通常很多 Web 开发者喜欢添加一个名为 `.lava` 的元素）。我们可以利用 CSS 锚点定位的特性，将 `ul::before` 锚定到不同的菜单项（ `a` 元素）上。因此，我们需要先给每个菜单项（锚点元素）指定 `anchor-name` ：

  


```CSS
.nav {

    & li {
        &:nth-child(1) {
            --is: --item-1;
        }
        
        &:nth-child(2) {
            --is: --item-2;
        }
        
        &:nth-child(3) {
            --is: --item-3;
        }
        
        &:nth-child(4) {
            --is: --item-4;
        }
        
        &:nth-child(5) {
            --is: --item-5;
        }
    }
    
    & a {
        anchor-name: var(--is);
    }
}
```

  


你也可以考虑直接在 HTML 的 `<a>` 元素以内联的方式定义 `--is` 的值：

  


```HTML
<ul class="nav">
    <li><a href="" style="--is: item-1">Home</a></li>
    <!-- 省略其他的导航菜单项 -->
    <li><a href="" style="--is: item-5">Contact us</a></li>
</ul>
```

  


这两种方式都可以，看你自己喜好！

  


我们使用一个名为 `--target` 的 CSS 变量来控制伪元素 `::before` 的锚点。我们的锚定元素（`ul::before`）使用了 `anchor()` 函数定位：

  


```CSS
.nav {
    anchor-name: --nav-menu;
    --target: --nav-menu;

    &::before {
        position: absolute;
        top: anchor(var(--target) top);
        left: anchor(var(--target) left);
        right: anchor(var(--target) right);
        bottom: anchor(var(--target) bottom);
    }
}
```

  


默认情况下，将列表 `ul.nav` 作为目标，使初始过渡来自项目的“周围”。然后，对定位（实际上是对 `top`、`right`、`bottom`、`left` 属性的动画过渡）和其他可视效果使用了过渡效果。

  


接下来，鼠标悬浮在每个列表项（`li`）时，锚定元素 `ul::before` 需要滑到相应的锚点位置（鼠标悬浮对应的列表项）。我们可以通过 CSS 的 `:has()` 选择器来检测列表项中是否有被悬停或聚焦的链接，如果有，将此项目分配为 `--target` ：

  


```CSS
.nav {
    &:has(:nth-child(1) > a:is(:hover, :focus-visible)) {
        --target: --item-1;
    }
    
    &:has(:nth-child(2) > a:is(:hover, :focus-visible)) {
        --target: --item-2;
    }
    
    &:has(:nth-child(3) > a:is(:hover, :focus-visible)) {
        --target: --item-3;
    }
    
    &:has(:nth-child(4) > a:is(:hover, :focus-visible)) {
        --target: --item-4;
    }
    
    &:has(:nth-child(5) > a:is(:hover, :focus-visible)) {
        --target: --item-5;
    }
}
```

  


同样的，你可以使用 `:not()` 选择器来设置检测列表项中没有被悬停或聚焦的链接时，将锚定元素 `ul::before` 从视觉上隐藏起来：

  


```CSS
.nav {
    &:not(:has(a:is(:hover, :focus-visible)))::before {
        visibility: hidden;
        opacity: 0;
        filter: blur(2em);
    }
}
```

  


将所有代码结合起来，就能看到一个熔岩灯菜单效果，而且其过渡效果是那么的优雅（几乎能和 JavaScript 版本媲美）：

  


```CSS
@layer anchor {
    .nav {
        anchor-name: --nav-menu;
        --target: --nav-menu;
    
        &::before {
            position: absolute;
            top: anchor(var(--target) top);
            left: anchor(var(--target) left);
            right: anchor(var(--target) right);
            bottom: anchor(var(--target) bottom);

            transition: all 0.3s;
        }
    
        & li {
            &:nth-child(1) {
                --is: --item-1;
            }
            
            &:nth-child(2) {
                --is: --item-2;
            }
            
            &:nth-child(3) {
                --is: --item-3;
            }
            
            &:nth-child(4) {
                --is: --item-4;
            }
            
            &:nth-child(5) {
                --is: --item-5;
            }
        }
    
        & a {
            anchor-name: var(--is);
        }
    
        &:not(:has(a:is(:hover, :focus-visible)))::before {
            visibility: hidden;
            opacity: 0;
            filter: blur(2em);
        }
    
        &:has(:nth-child(1) > a:is(:hover, :focus-visible)) {
            --target: --item-1;
        }
        
        &:has(:nth-child(2) > a:is(:hover, :focus-visible)) {
            --target: --item-2;
        }
        
        &:has(:nth-child(3) > a:is(:hover, :focus-visible)) {
            --target: --item-3;
        }
        
        &:has(:nth-child(4) > a:is(:hover, :focus-visible)) {
            --target: --item-4;
        }
        
        &:has(:nth-child(5) > a:is(:hover, :focus-visible)) {
            --target: --item-5;
        }
    }
}
```

  


基于上面这个示例，你只需要调整锚定元素 `ul::before` 的 UI 效果，就可以得到很多不同风格的熔岩灯导航菜单：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e898c762c21d43bd9b175fae80a3bde4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=224&s=298159&e=gif&f=136&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/PoXpRxx

  


[@Jhey 在 CodePen 提供了一个案例](https://codepen.io/jh3y/full/ExOMvwW)，将 CSS 锚点定位和 [CSS 滚动驱动动效](https://juejin.cn/book/7223230325122400288/section/7259272255786450981) 结合在一起，使得熔岩灯菜单的动效可以由页面滚动来驱动，使得效果与交互更完美的结合在一起：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c23a44fd84644a12bbb9850cb3cba6d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=540&s=13343408&e=gif&f=167&b=010101)

  


> Demo 地址：https://codepen.io/jh3y/full/ExOMvwW

  


详细代码请查看 Demo 源码！

  


### 圆环菜单（Radial Menu）

  


在介绍 [CSS 三角函数的时候](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)，我就举过圆环菜单的例子：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa3453a466344c81b98e560689cc247c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=288&s=242188&e=gif&f=130&b=fcfbfc)

  


> Demo 地址：https://codepen.io/airen/pen/KKrpBrQ

  


这里将继续以圆环形菜单为例，向大家阐述如何使用 CSS 锚点定位来构建一个圆环形导航菜单。不过，接下来这个圆环形导航菜单将会使用到 CSS 锚点定位和 **[Popover API](https://html.spec.whatwg.org/dev/popover.html#the-popover-attribute)**。

  


> Popover API （弹出框 API）为 Web 开发人员提供了一种标准、一致、灵活的机制，用于在 Web 页面内容之上显示弹出框内容。弹出框内容可以通过 HTML 属性进行声明性控制，也可以通过 JavaScript 进行控制。

  


我们将在示例中使用 Popover API 相关的 HTML 属性进行声明性控制，比如 `popovertarget` 、`popover` 和 `popovertargetaction` 。另外通过 HTML 的 `anchor` 属性与锚点元素的 `ID` 来创建隐式的锚点。具体的 HTML 代码如下所示：

  


```HTML
<div class="menu">
    <!-- 锚点元素 -->
    <button tabindex=1 class="menu-toggle" id="menu-toggle" popovertarget="menu-items">
        <span aria-hidden="true">
            <svg class="icon icon--share" aria-hidden="true">
                <use xlink:href="#share" />
            </svg>
        </span>
        <span class="sr-only">Share</span>
    </button>
    
    <!-- 锚定元素 -->
    <ul class="menu-items" id="menu-items" popover anchor="menu-toggle" role="menu">
        <li class="item">
            <button role="menuitem">
                <span aria-hidden="true">
                    <svg class="icon icon--facebook" aria-hidden="true">
                        <use xlink:href="#facebook" />
                    </svg>
                </span>
                <span class="sr-only">Facebook</span>
            </button>
        </li>
        <!-- 省略圆形菜单中其他选项 -->
        
        <!-- 关闭按钮 -->
        <li class="item">
            <button popovertargetaction="hide" popovertarget="menu-items-1" class="hidden-close">
                <span aria-hidden="true"> </span>
                <span class="sr-only">close menu</span>
            </button>
        </li>
    </ul>
</div>
```

  


我们同样使用 CSS 的三角函数结合 CSS 的变换，使菜单项围绕着锚点元素 `.menu-toggle` 。

  


```CSS
.item {
    --radius: calc(var(--btn-size) + var(--extra-space));
    translate: 
        calc(cos(var(--angle)) * var(--radius))
        calc(sin(var(--angle) * -1) * var(--radius));
    rotate: 0deg;

    &:nth-child(1) {
      --angle: 0deg;
    }

    &:nth-child(2) {
      --angle: 45deg;
    }

    &:nth-child(3) {
      --angle: 90deg;
    }

    &:nth-child(4) {
      --angle: 135deg;
    }

    &:nth-child(5) {
      --angle: 180deg;
    }

    &:nth-child(6) {
      --angle: 225deg;
    }

    &:nth-child(7) {
      --angle: 270deg;
    }

    &:nth-child(8) {
      --angle: 315deg;
    }
}
```

  


接下来，使用 CSS 锚点定位，使菜单项相对于锚点元素进行定位：

  


```CSS
.menu-items {
    bottom: anchor(bottom);
    left: anchor(center);
    translate: -50% 0;
}
```

  


注意，我们在 HTML 中已经通过 `anchor` 属性和锚点元素的 `ID` 相互绑定，创建了一个隐式的锚点，因此我们可以使用 `anchor()` 函数使菜单相对于锚点定位。

  


最后，利用 Popover API 的特性，控制菜单项的展开与折叠：

  


```CSS
.menu-items:not(:popover-open) .item {
    --radius: 0;
    --angle: 0;
    rotate: 45deg;
}

:popover-open .item {
    opacity: 1;
}
```

  


你就制作出像下面这样的一个圆环导航菜单：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76dbaedef9564ad5b70a9a0aa67632b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=516&s=2273967&e=gif&f=168&b=d26435)

  


> Demo 地址：https://codepen.io/airen/full/Bavvmbz

  


如果你正在开发一个图片分享相关的 Web 应用，希望在每张图片上添加像上面这样的圆形分享菜单，那使用这种方法再好不过了。唯一需要注意的是，`anchor` 和 `popovertarget` 需要绑定不同的 `ID` 名称：

  


```HTML
<!-- 将弹出窗口链接到锚按钮 -->
<ul anchor="anchor-btn-01" id="menu-items-01" popover class="menu" role="menu">  
    <li>...</li>  
    <li>...</li>
</ul>

<!-- 给锚点一个 ID 名 -->
<button id="anchor-btn-01" popovertarget="menu-items-01" role="menuitem">  
    <span aria-hidden="true">
        <svg class="icon icon--share" aria-hidden="true">
            <use xlink:href="#share" />
        </svg>
    </span>  
    <span class="sr-only">Share</span>
</button>
```

  


具体效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a423de1e8cdc49fdb77d992d00d98d3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=536&s=14925265&e=gif&f=89&b=e4cbbd)

  


> Demo 地址：https://codepen.io/airen/full/xxmmQmy （详细代码请查看 Demo 源码）

  


再来看一个圆环形导航菜单，不过接下来的这个圆环形导航菜单在前面的示例基础上新增了另一个特性，即 `<selectmenu>` 。也就是说，接下来我们会基于 `<selectmenu>` 元素、CSS 的锚点定位和 Popover API 来构建接下来的这个圆形导航菜单：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/585b9d8021a84c688cc4faae7210d3bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=460&s=3564807&e=gif&f=284&b=1c1928)

  


> Demo 地址：https://codepen.io/smashingmag/full/XWxxPgN （该案例由 [@Brecht ](https://twitter.com/utilitybend)提供）

  


额外提一下，`<selectmenu> 是一个新的 HTML 元素`（现已更名为 `<selectlist>`），它将大大改善对这种类型的表单控件进行样式设置的方式。该元素是由 Open UI 社区推出的（[Open UI](https://open-ui.org/) 是一个 [W3C 社区小组](https://www.w3.org/community/open-ui/)，旨在为我们提供更多更好的样式和扩展原生 HTML 元素和表单控件的方法 ）。

  


对于 Web 开发者而言，要给 `<select>` 菜单设置样式一直以来是件棘手的事情，通常需要依赖 JavaScript 才能完成。在这个示例中，我们将以 `<selectmenu>` 元素来创建一个圆形选择菜单，它是使用 CSS 来完成的。在构建该选择菜单中还将使用 CSS 的锚点定位和 HTML 的 Popover API。

  


构建它需要一个像下面这样的 HTML 结构：

  


```HTML
<selectmenu class="potion-select" id="potion-select">
    <button class="potion-equipped" slot="button" behavior="button">
        <div class="potion-equipped-icon"></div>
        <span behavior="selected-value" class="selected-value"></span>
    </button>
    <div slot="listbox">
        <div popover behavior="listbox">
            <option value="health">
                <div class="potion-holder">
                    <svg class="icon icon-health" aria-hidden="true">
                        <use xlink:href="#potion" />
                    </svg>
                </div>
                <span>Health</span>
            </option>
            <option value="mana">
                <div class="potion-holder">
                    <svg class="icon icon-mana" aria-hidden="true">
                        <use xlink:href="#potion" />
                    </svg>
                </div>
                <span>Mana</span>
            </option>
            <!-- 省略其他的 option 选项 -->
        </div>
    </div>
</selectmenu>
```

  


首先使用 `anchor-name` 将 `.selected-button` 定义为一个锚点元素：

  


```CSS
.selected-button {
    anchor-name: --selectmenu;
}
```

  


接着使用 `anchor()` 函数使菜单列表相对于锚点元素 `.selected-button` 定位：

  


```CSS
[popover] {
    position: relative;
    top: anchor(--selectmenu center);
    left: anchor(--selectmenu center);
}
```

  


最后就是通过一些计算，将每个选项（`option`）围绕着中心排列，使它们形成一个圆形。在这个示例中，[@Brecht](https://twitter.com/utilitybend) 是根据可用选项的数量（`option` 的数量）来控制选项的位置。例如，如果选择菜单有六个选项，它们将以一种方式排列，如果选择菜单有三个选项，它们将以另一种方式排列，依此类推。

  


在弹出框打开时，我们可以按下面的公式给每个选项设置 `transform` 值：

  


```CSS
[popover]:popover-open option {
    /* 圆形尺寸一半，即圆的半径 * /
    --half-circle : calc ( var (--circle-size) / - 2 );  transform:
        rotate(var(--deg))
        translate(var(--half-circle))
        rotate(var(--negative-deg));
}
```

  


现在，当触发 `popover-open` 状态时，我们将旋转每个选项一定数量的度数，沿着两个轴平移它们半个圆的大小，并再次旋转它们负数度数的度数。注意，`transform` 属性值列表的顺序很重要！

  


让我们将这些内容添加到我们的 `popover` 样式规则中：

  


```CSS
[popover] {
    --rotation-divide: calc(180deg / 2);

    /* 省略其他 CSS 代码 */
}
```

  


这将是我们的默认旋转，对于仅有一个选项的情况是一个特殊情况，在其他情况下使用 `360deg`。

  


现在，我们可以选择第一个选项并在其上设置 `--rotation-divide` 变量：

  


```CSS
option:nth-child(1) {
    --deg: var(--rotation-divide);
}
```

  


接下来，对其他选项进行样式设置需要一些工作，因为我们必须：

  


-   将圆圈分成可用选项的数量；
-   为每个选项乘以该结果。

  


我们使用 CSS 中的 `calc()` 函数来帮助我们做到这一点：

  


```CSS
[popover]:has(option:nth-child(2)) {
    --rotation-divide: calc(360deg / 2);
}

[popover]:has(option:nth-child(3)) {
    --rotation-divide: calc(360deg / 3);
}

[popover]:has(option:nth-child(4)) {
    --rotation-divide: calc(360deg / 4);
}

[popover]:has(option:nth-child(5)) {
    --rotation-divide: calc(360deg / 5);
}

[popover]:has(option:nth-child(6)) {
    --rotation-divide: calc(360deg / 6);
}

option:nth-child(1) {
    --deg: var(--rotation-divide);
}

option:nth-child(2) {
    --deg: calc(var(--rotation-divide) * 2);
}

option:nth-child(3) {
    --deg: calc(var(--rotation-divide) * 3);
}

option:nth-child(4) {
    --deg: calc(var(--rotation-divide) * 4);
}

option:nth-child(5) {
    --deg: calc(var(--rotation-divide) * 5);
}

option:nth-child(6) {
    --deg: calc(var(--rotation-divide) * 6);
}

/* 你有足够的选择了 */
option:nth-child(1n + 7) {
    display: none;
}
```

  


其实，你也可以像前面那两个圆形导航菜单一样，使用 **[CSS 的三角函数](https://juejin.cn/book/7223230325122400288/section/7242216512176521277)**来设置每个菜单选项的位置。感兴趣的同学自己可以尝试一下。

  


另外，我们可以借助 CSS 特性和简单的几行 JavaScript 代码，根据菜单选项的数量来计算 `--rotation-divide` 和 `--negative` 自定义属性的值。例如，可以向具有 `popover` 属性的元素添加一个 `ID` ，并计算它包含的子元素（`option`）数量：

  


```JavaScript
const optionAmount = document.getElementById('popoverlistbox').childElementCount;
popoverlistbox.style.setProperty('--children', optionAmount);
```

  


这样，我们可以用更简洁的样式替代所有的 `:has()` 实例：

```CSS
option {
    --rotation-divide: calc(360deg / var(--children));
    --negative: calc(var(--deg) / -1);
}
```

  


如果你的菜单选项数量不确定时，这种方式要比 `:has()` 方便的多。

  


接着，通过JavaScript 脚本，我们可以选择 `<selectmenu>` 元素的 `innerHTML` 并将其传递给我 `.selected-value` 按钮：

  


```JavaScript
const selectMenus = document.querySelectorAll("selectmenu");
selectMenus.forEach((menu) => {
    const selectedvalue = menu.querySelector(".selected-value");
    selectedvalue.innerHTML = menu.selectedOption.innerHTML;
    menu.addEventListener("change", () => {
        selectedvalue.innerHTML = menu.selectedOption.innerHTML;
    });
});
```

  


这个脚本会在页面上找到所有的 `<selectmenu>` 元素，然后为每个元素找到 `.selected-value` 按钮，将其 `innerHTML` 设置为所选选项的 `innerHTML`。接着，它会监听 `<selectmenu>` 的 `change` 事件，以在选择不同选项时更新 `.selected-value` 按钮的内容。

  


注意，这是一个增强型功能，你可以根据需要来选择。

  


最后，你再给圆形菜单添加一点 CSS 动画，就能看到像下面这样的一个效果了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/241417b3c9df4f65aadbe4ae5abf1fed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=460&s=3564807&e=gif&f=284&b=1c1928)

  


> Demo 地址：https://codepen.io/airen/full/MWZZZpX （详细代码请查看 Demo 源码）

  


### 上下文菜单

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30e8e468262b4ef8b09654e1dabb6eb6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=632&s=3369683&e=gif&f=376&b=f3f5fa)

  


> Demo 地址：https://codepen.io/jh3y/details/qBMWLOK

  


[这个案例是由 @Jhey 提供的](https://codepen.io/jh3y/details/qBMWLOK)。使用 Popover API 创建的一个上下文菜单。单击带有箭头的按钮将显示上下文菜单。该菜单将有其自身的子菜单以展开选项。

  


与上一个 @Brecht 提供的圆形导航菜单相似，在 HTML 中有三个按钮都使用了 `popovertarget`。然后有三个元素使用了 `popover` 属性。这使你能够在没有任何 JavaScript 的情况下打开上下文菜单。可能如下所示：

  


```HTML
<button popovertarget="context">Toggle Menu</button>        
<div popover="auto" id="context">
    <ul>
        <li><button>Save to your Liked Songs</button></li>
        <li>
            <button popovertarget="playlist">Add to Playlist</button>
        </li>
        <li>
            <button popovertarget="share">Share</button>
        </li>
    </ul>
</div>
<div popover="auto" id="share">...</div>
<div popover="auto" id="playlist">...</div>
```

  


现在，你可以定义一个 `position-fallback` 并在上下文菜单之间共享它。我们确保取消设置任何弹出菜单的 `inset` 样式。

  


```CSS
[popovertarget="share"] {
    anchor-name: --share;
}

[popovertarget="playlist"] {
    anchor-name: --playlist;
}

[popovertarget="context"] {
    anchor-name: --context;
}

#share {
    anchor-default: --share;
    position-fallback: --aligned;
}

#playlist {
    anchor-default: --playlist;
    position-fallback: --aligned;
}

#context {
    anchor-default: --context;
    position-fallback: --flip;
}

@position-fallback --aligned {
    @try {
        top: anchor(top);
        left: anchor(right);
    }

    @try {
        top: anchor(bottom);
        left: anchor(right);
    }

    @try {
        top: anchor(top);
        right: anchor(left);
    }

    @try {
        bottom: anchor(bottom);
        left: anchor(right);
    }

    @try {
        right: anchor(left);
        bottom: anchor(bottom);
    }
}

@position-fallback --flip {
    @try {
        bottom: anchor(top);
        left: anchor(left);
    }

    @try {
        right: anchor(right);
        bottom: anchor(top);
    }

    @try {
        top: anchor(bottom);
        left: anchor(left);
    }

    @try {
        top: anchor(bottom);
        right: anchor(right);
    }
}
```

  


这为你提供了一个自适应的嵌套上下文菜单界面。尝试使用选择框更改内容位置。你选择的选项会更新网格对齐方式。这会影响到锚定定位如何定位弹出菜单。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fec0d0b3b4d4588b2fdf81db274def0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=632&s=3369683&e=gif&f=376&b=f3f5fa)

  


> Demo 地址：https://codepen.io/airen/full/poqqGdM

  


### 交叉引用

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58c9be19f2794612a2490115a0b26dd4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1198&h=412&s=444007&e=gif&f=123&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/jOXXdzj

  


正如你所看到的，这是将悬念或焦点状态从一个元素传递到另一个元素的能力，突出显示可能位于页面上不同位置的上下文。使用 CSS 锚点定位可以很容易实现。

  


```HTML
<p>Which <em tabindex="0" style="--for: --property">property</em> corresponds with which <em tabindex="0" style="--for: --value">value</em>?</p>
<div class="container">
    <ol style="--is: --property">
        <li style="--for: --none" tabindex="0">
            <code style="--is: --display">display</code>
        </li>
        <li style="--for: --hidden" tabindex="0">
            <code style="--is: --visibility">visibility</code>
        </li>
        <li style="--for: --zero" tabindex="0">
            <code style="--is: --opacity">opacity</code>
        </li>
    </ol>
    <ol style="--is: --value">
        <li style="--for: --visibility" tabindex="0">
            <code style="--is: --hidden">hidden</code>
        </li>
        <li style="--for: --opacity" tabindex="0">
            <code style="--is: --zero">0</code>
        </li>
        <li style="--for: --display" tabindex="0">
            <code style="--is: --none">none</code>
        </li>
    </ol>
</div>
```

  


注意 HTML 标记中的行内样式声明的 CSS 自定义属性，因为它们在 CSS 中将会使用到。

  


```CSS
@layer anchor {
    [style*="--is:"] {
        anchor-name: var(--is);
    }

    [style*="--for:"]:is(:hover, :focus-visible)::after {
        content: "";
    
        position: absolute;
        top: anchor(var(--for) top);
        right: anchor(var(--for) right);
        bottom: anchor(var(--for) bottom);
        left: anchor(var(--for) left);
    
        box-shadow: 0 0 0 4px hotpink;
    }
}
```

  


就是这么简单。

  


这种视觉技巧使得更容易发现项目之间的联系，而且经常在实际应用中使用，比如页面上的脚注就是一个很典型的案例。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a1df748134e4342b146bf39065fb163~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=656&s=1704370&e=gif&f=159&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/bGOOzyP

  


还可以实现类似 [CSS Day 网站的的效果，悬停在演讲者的名字和照片上看效果](https://cssday.nl/2023)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9aa48d813384d8c849f5cd89ea14ac6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1304&h=632&s=4468850&e=gif&f=192&b=fefefe)

  


现在我们会用 CSS 锚点定位来实现该效果。

  


你需要一个像下面这样的 HTML 结构：

  


```HTML
<div class="container">
    <!-- 演讲者头像 -->
    <ul class="avatars">
        <li style="--for:--manuel-name;">
            <img style="--is: --manuel-avatar;" src="https://cssday.nl/_img/2023/speakers/manuel.jpg" alt="manuel">
        </li>
        <li style="--for:--sophie-name;">
            <img style="--is: --sophie-avatar;" src="https://cssday.nl/_img/2023/speakers/sophie.jpg" alt="sophie">
        </li>
        <!-- 省略其他 li -->
    </ul>
    <!-- 演讲者信息 -->
    <ul class="links">
        <li style="--for: --manuel-avatar; --bg:url('https://cssday.nl/_img/2023/speakers/manuel.jpg')">
            <a href="#" style="--is:--manuel-name">Manuel Matuzović</a>: Structuring &amp; Restructuring
        </li>
        <li style="--for: --sophie-avatar; --bg:url('https://cssday.nl/_img/2023/speakers/sophie.jpg')">
            <a href="#" style="--is:--sophie-name">Sophie Koonin</a>: Personal Websites
        </li>
        <!-- 省略其他 li -->
    </ul>
</div>    
```

  


注意内联定义的 `--for` 和 `--is` 的值，两个列表的值刚好是相互交叉的，其次在演讲者列表项中，定义了 `--bg` 属性，它的值刚好是演讲者的用户头像。

  


利用 CSS 锚点定位的特性，分别处理列表项伪元素 `::after` 的样式以及定位：

  


```CSS
@layer anchor {
    [style*="--is:"] {
        anchor-name: var(--is);
    }

    [style*="--for:"]:is(:hover, :focus-visible)::after {
        content: "";
        
        /* 锚点定位 */
        position: absolute;
        top: anchor(var(--for) top);
        right: anchor(var(--for) right);
        bottom: anchor(var(--for) bottom);
        left: anchor(var(--for) left);
    }

    /* 演讲者头像悬停或焦点状态下，伪元素 ::after 的样式，相对于演讲者主题定位 */
    .avatars [style*="--for:"]:is(:hover, :focus-visible)::after {
        background: darkorchid;
        mix-blend-mode: difference;
        filter: hue-rotate(300deg);
        animation: lightSpeedInLeft 0.28s ease-out alternate both;
    }

    /* 演讲者主题悬停或焦点状态下，伪元素 ::after 的样式，相对于演讲者头像定位 */
    .links [style*="--for:"]:is(:hover, :focus-visible)::after {
        background: var(--bg) no-repeat center / cover;
        border-radius: 5px;
        animation: zoomIn 0.28s linear alternate both;
    }

    @keyframes zoomIn {
        from {
            scale: 0;
            opacity: 0;
        }
        to {
            scale: 2;
            opacity: 1;
        }
    }

    @keyframes lightSpeedInLeft {
        from {
            transform: translate3d(-100%, 0, 0) skewX(30deg);
            opacity: 0;
        }
    
        60% {
            transform: skewX(-20deg);
            opacity: 1;
        }
    
        80% {
            transform: skewX(5deg);
        }
    
        to {
            transform: translate3d(0, 0, 0);
        }
    }
}
```

  


最终效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b82eabb236740a3bad7f5e93e1da807~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=544&s=4765979&e=gif&f=220&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/QWzzoGj

  


### 模拟粒子碰撞的效果

  


前段时间 [@Chokcoco 老师使用 CSS 写了一个检测碰撞的动画效果](https://codepen.io/Chokcoco/full/WNYVmBo)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0879cf810f3e4a5daddf6cc946447376~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=558&s=1136429&e=gif&f=98&b=ffffff)

  


> Demo 地址：https://codepen.io/Chokcoco/full/WNYVmBo

  


接下来，我们使用这节课学到的知识，使用 CSS 锚点定位来实现一个相似的效果：

  


```HTML
<div class="container">
    <div class="target start"></div>
    <div class="target end"></div>
    <div class="connection"></div>
</div>
```

  


```CSS
@layer anchor {
    @keyframes horizontal {
        from {
            left: 0;
        }
        to {
            left: 100%;
            filter: hue-rotate(2185deg);
        }
    }
    
    @keyframes vertical {
        from {
            top: 0;
        }
        to {
            top: 100cqh;
            filter: hue-rotate(1769deg);
        }
    }

    .container {
        --height-times: 2.5;
        --width-times: 4.5;
        --seconds-per-100px: 0.5s;
    }

    .target {
        --delay: 0s;
        --width-variation: 0s;
        --height-variation: 0s;
        --height-duration: calc(var(--height-times) * var(--seconds-per-100px));
        --width-duration: calc(var(--width-times) * var(--seconds-per-100px));
        
        translate: -50% -50%;
        animation: linear infinite alternate;
        animation-name: horizontal, vertical;
        animation-delay: var(--delay);
        animation-duration: 
            calc(var(--width-duration) + var(--width-variation)),
            calc(var(--height-duration) + var(--height-variation));
    }

    .start {
        --is: --start;
        --width-variation: 0.14s;
        --height-variation: 0.12s;
        --delay: -19.6s;
    }
  
    .end {
        --is: --end;
        --width-variation: 0.37s;
        --height-variation: 1s;
        --delay: -24.1s;
    }
    
    .connection {
        --_from: var(--from, --start);
        --_to: var(--to, --end);
        position: absolute;
        translate: -0.5em -0.5em;
        top: anchor(var(--_from) center);
        left: anchor(var(--_from) center);
        right: anchor(var(--_to) center);
        bottom: anchor(var(--_to) center);
    }
}
```

  


你将看到一个像下面这样的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ee01209c9be483cb19d8ab52f4fe716~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=500&s=145998&e=gif&f=88&b=ffffff)

> Demo 地址：https://codepen.io/airen/full/wvRRZEP

  


还可以像下面这样做：

  


```HTML
<div class="container" tabindex="0">
    <div class="target start"></div>
    <div class="target end"></div>

    <div class="connection"></div>
    <div class="connection connection--flip-x"></div>
    <div class="connection connection--flip-y"></div>
    <div class="connection connection--flip-x connection--flip-y"></div>
</div>
```

  


```CSS
@layer anchor {
    @keyframes horizontal {
        from {
            left: 0;
        }
        to {
            left: 100%;
            filter: hue-rotate(2185deg);
        }
    }
    
    @keyframes vertical {
        from {
            top: 0;
        }
        to {
            top: 100cqh;
            filter: hue-rotate(1769deg);
        }
    }

    .container {
        --height-times: 2.5;
        --width-times: 4.5;
        --seconds-per-100px: 0.5s;
    }

    .target {
        --delay: 0s;
        --width-variation: 0s;
        --height-variation: 0s;
        --height-duration: calc(var(--height-times) * var(--seconds-per-100px));
        --width-duration: calc(var(--width-times) * var(--seconds-per-100px));
        
        translate: -50% -50%;
        animation: linear infinite alternate;
        animation-name: horizontal, vertical;
        animation-delay: var(--delay);
        animation-duration: 
            calc(var(--width-duration) + var(--width-variation)),
            calc(var(--height-duration) + var(--height-variation));
    }

    .start {
        --is: --start;
        --width-variation: 0.14s;
        --height-variation: 0.12s;
        --delay: -19.6s;
    }

    .end {
        --is: --end;
        --width-variation: 0.37s;
        --height-variation: 1s;
        --delay: -24.1s;
    }

    .connection {
        --_from: var(--from, --start);
        --_to: var(--to, --end);
        --min: 0px;
        --flip-x: 0;
        --flip-y: 0;
    
        position: absolute;
        top: calc(anchor(var(--_from) center) - var(--min));
        right: calc(anchor(var(--_to) center) - var(--min));
        bottom: calc(anchor(var(--_to) center) - var(--min));
        left: calc(anchor(var(--_from) center) - var(--min));
    
        translate: -0.5em -0.5em;
        scale: calc(1 - 2 * var(--flip-x)) calc(1 - 2 * var(--flip-y));
    
        &.connection--flip-x {
            --flip-x: 1;
            left: calc(anchor(var(--_to) center) - var(--min));
            right: calc(anchor(var(--_from) center) - var(--min));
        }
        
        &.connection--flip-y {
            --flip-y: 1;
            top: calc(anchor(var(--_to) center) - var(--min));
            bottom: calc(anchor(var(--_from) center) - var(--min));
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c68c59b2e88840fa802a1f9464848bf4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=586&s=128124&e=gif&f=71&b=ffffff)

> Demo 地址：https://codepen.io/airen/full/oNJJRBZ

  


利用这些连接器，我们还可以做很多有意思的东西。比如像下面这样的拓扑图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f267a669c54341378322c7a9e619611e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=648&s=772826&e=gif&f=171&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/oNJJrRV

  


在这个案例中，我们还利用了 [HTML 的 `<details>` 元素](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)和它的[子元素 `<summary>` ](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element)来控制树形展开与折叠：

  


```HTML
<ul class="tree">
    <li class="tree-item" style="--is: --node-1">
        <details role="group" class="tree-item-details" open="">
            <summary class="tree-item-label">CSS selectors</summary>
            <ul class="tree" style="--to: --node-1">
                <li class="tree-item" style="--is: --node-1-1">
                    <details role="group" class="tree-item-details" open="">
                        <summary class="tree-item-label">Basic selectors</summary>
                        <ul class="tree" style="--to: --node-1-1">
                            <li class="tree-item" style="--is: --node-1-1-1">
                                <p class="tree-item-label"><a  href="#">Universal</a></p>
                            </li>
                            <!-- 省略其他 li -->
                        </ul>
                    </details>
                </li>
                <!-- 省略其他 li -->
            </ul>
        </details>
    </li>
</ul>
```

  


内联定义的 `--is` 和 `--to` 主要用于锚点函数 `anchor()` ：

  


```CSS
@layer anchor {
    .tree-item-details {
        &:not([open])::before {
            position: absolute;
            left: anchor(var(--is) right);
        }
    }

    .tree-item-label {
        anchor-name: var(--is);
    
        &::before,
        &::after {
            position: absolute;
            left: anchor(var(--to) right);
            right: anchor(var(--is) left);
        }
    
        &::before {
            top: calc(anchor(var(--to) top) + 0.5 * var(--lh));
            bottom: anchor(var(--is) center);
        }
    
        &::after {
            bottom: calc(anchor(var(--to) top) - 0.5 * var(--lh));
            top: anchor(var(--is) center);
            transform: scaleY(-1);
        }
    }
}
```

  


你可能会对示例中的连接线感兴趣，这里是实现它的关键代码：

  


```CSS
.tree-item-label {
    --link-underline-position: bottom 12%;
    
    hyphens: none;
    line-height: var(--lh);
    cursor: pointer;
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    text-shadow: none;
    user-select: none;
    
    &::marker {
        content: "";
    }
    
    &::before,
    &::after {
        content: "";
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 0c25 0 50 50 50 50s25 50 50 50' stroke='currentColor' vector-effect='non-scaling-stroke' fill='none' /%3E%3C/svg%3E")
        no-repeat var(--offset) 0 / calc(100% - var(--offset) * 2) 100%;
        pointer-events: none;
    }
}
```

  


是不是很酷，更详细的代码请参阅 Demo 源码！

  


### 模拟 resize 效果

  


稍微对 CSS 有所了解的同学都知道，在元素上设置 `resize` 属性之后，元素盒子右下角会有一个拖动手柄，可以用来改变元素的尺寸（`width` 和 `height`）。现在，我想告诉你的是，我们现在可以使用 CSS 锚点定位来给它添加多个 `resize` 手柄。比如下面这个由 [@Jhey 在 CodePen 提供的案例](https://codepen.io/web-dot-dev/full/ZEMpBzP)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad89f437fe64e938215662518031a61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=508&s=17929632&e=gif&f=246&b=2c3237)

  


> Demo 地址：https://codepen.io/web-dot-dev/full/ZEMpBzP

  


这个案例和前面所看到的案例都有所不同。它展示了[一个元素上如何使用多个锚点](https://xiaochengh.github.io/Explainers/css-anchor-position/explainer.html#)。CSS 的 `anchor()` 和 `anchor-size()` 函数可以选择接受一个锚点名称参数，以便它们相对于提供的锚点进行解析，而不是默认锚点。这允许我们将元素锚定到多个元素并创建更复杂的布局：

  


```CSS
.max-indicator {
    position: absolute;
    left: anchor(--chart right);
    bottom: max(
        anchor(--anchor-1 top),
        anchor(--anchor-2 top),
        anchor(--anchor-3 top)
    );
}
```

  


@Jhey 提供的这个案例，就采用了该特性，可以用它来调整元素的大小。

  


它的 HTML 结构很简单：

  


```HTML
<div class="controls">
    <button class="resize-handle">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
        </svg>
    </button>
    <button class="resize-handle">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
        </svg>
    </button>
</div>

<div class="container">
    <img src="https://picsum.photos/1080/1080?random=12" alt="">
</div>
```

  


其中两个 `button` 是拖动手柄，拖动任何一个手柄都将调整容器 `.container` 的大小。关键的 CSS 代码如下：

  


```CSS
@layer demo {
    .container {
        position: absolute;
        inset: 
            anchor(--handle-1 top) 
            anchor(--handle-2 right)
            anchor(--handle-2 bottom) 
            anchor(--handle-1 left);
    }

    .resize-handle:first-of-type {
        anchor-name: --handle-1;
    }
     
    .resize-handle:last-of-type {
        anchor-name: --handle-2;
    }
}
```

  


使用该特性，你还可以实现下面这样的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/153866d733b24acab644a5eaa578b6fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=610&s=316745&e=gif&f=124&b=eef0f4)

  


> Demo 地址：https://codepen.io/web-dot-dev/full/PoeNKXJ （详细代码请参阅 Demo 源码）

  


除了上述所展示的效果之外，只要你发挥你的才智，利用好 HTML 和 CSS 的新特性，你还可以使用 CSS 锚点定位构建出更有创意，更复杂的交互动效。最后再向在大家展示一个由 [@Jehy 在 CodePen 上提供的案例](https://codepen.io/jh3y/full/PoxjQRX)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a001009ccb664af3ba94b94b157333c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=668&s=2339613&e=gif&f=335&b=0d0d0d)

  


> Demo 地址： https://codepen.io/jh3y/full/PoxjQRX

  


详细代码不在这里展示，如果你感兴趣的话可以阅读 Demo 源码。

  


在这个示例中，使用到了小册中很多节课的知识，比如：

  


-   [`:has()` 和 `:not()` 选择器的结合使用](https://juejin.cn/book/7223230325122400288/section/7226251495276609569)
-   [CSS 的 `:is()` 选择器](https://juejin.cn/book/7223230325122400288/section/7226251495069450278)
-   [CSS 容器查询中的尺寸查询](https://juejin.cn/book/7223230325122400288/section/7259668032165773368)
-   [CSS 的锥形渐变：`conic-gradient()`](https://juejin.cn/book/7223230325122400288/section/7259668771856941111)
-   [CSS 的遮罩：`mask`](https://juejin.cn/book/7223230325122400288/section/7259668885224456252)
-   [CSS 自定义属性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)
-   [CSS 的宽高比：`aspect-ratio`](https://juejin.cn/book/7223230325122400288/section/7259316040151236666)
-   等等...

  


## 小结

  


CSS 锚点定位为 Web 布局提供了一个令人兴奋的新范式，使 Web 开发人员能够更快速、高效地实现复杂布局。通过将元素相互连接，CSS 锚定消除了繁琐的解决方案和计算的需求，简化了响应式和动态 Web 设计的过程。

  


随着 CSS 锚点定位功能的不断演进，保持对最新规范和浏览器支持的了解至关重要。虽然它具有巨大的潜力，但也必须考虑它当前的局限性并进行相应的规划。CSS 锚点定位将重新定义我们处理 Web 布局的方式，为 Web 开发人员提供了更直观和强大的工具，以创建出色的用户体验。