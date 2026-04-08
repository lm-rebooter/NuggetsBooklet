CSS 媒体查询存在于 CSS 中已经有很多年了，但它一直在不断的向前发展，以更好的方式提供给 Web 开发者使用。如今，除了查询浏览器视窗宽度之外，还有很多东西可以查询，比如屏幕的分辨率、设备的方向、操作系统偏好，甚至更多我们可以查询和使用的内容样式。在这节课中，我将与大家一起探讨 CSS 媒体查询中的一些新特性，比如新的语法规则，用户偏好设置等。

## 什么是CSS媒体查询

CSS 媒体查询是一种通过某些特征、特性和用户偏好来定位浏览器的方法，然后基于这些东西应用样式或运行其他代码。也许世界上最常见的媒体查询是那些针对特定视窗范围并应用自定义样式的查询，这产生了响应式设计的整个理念。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6859e4364fc491e93cc98b64e9bacce~tplv-k3u1fbpfcp-zoom-1.image)

对于 Web 开发者来说，就是针对不同的终端（例如，桌面端、平板端和智能手机等）使用相同的 HTML 内容（结构），利用 CSS 媒体查询应用不同的 CSS 样式规则，使 Web 页面的布局或 UI 在不同的终端上都能完美的呈现。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1adee4705458483b892f5edc6707229a~tplv-k3u1fbpfcp-zoom-1.image)

比如：

```CSS
/* Mobile 先行 */
body {
    background-color: #f09a9d;
}
​
/* Tablet */
@media only screen and (min-width: 401px) and (max-with: 960px) {
    body {
        background-color: #f5cf8e;
    }
}
​
/* Desktop */
@media only screen and (min-width: 961px) {
    body {
        background-color: #b2d6ff;
    }
}
```

在 CSS 中，媒体查询是一个独立的功能模块，到如今已有多个版本迭代，因此它的体系也是庞大的，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3072b2a35b77414eaca6ed19075e6aae~tplv-k3u1fbpfcp-zoom-1.image)

## 为什么要使用CSS媒体查询

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa745e2716b0417bbcb7cea8ad06596a~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，市场上终端设备是越来越丰富，对于 Web 开发者而言都是希望自己的应用在不同的终端设备上都能用户带来较好的体验，而且又不希望自己有更多额外的开发成本。

换句话说，无论在桌面设备上还是在移动设备上，用户都习惯上下滚动网站，而不是横向滚动，因此，如果用户必须横向滚动或缩小页面才能查看整个网页，那么这将给用户带来糟糕的体验。对于开发者而言，就需要为终端提供一个更好的适配方案。那么 CSS 媒体查询可以很好的满足这方面的需求。因为，CSS 媒体查询是条件 CSS 特性之一，它可以对 CSS 样式做相应的过滤，也就是说，可以根据 CSS 媒体查询的条件运用不同的 CSS 样式。有了这些过滤器，我们可以根据设备呈现内容的特点轻松更改样式，包括显示屏类型、宽度、高度、方向、分辨率，甚至是用户系统偏好设置。

## 使用媒体查询

媒体查询通常与 CSS 相关，但也可以在 HTML 和 JavaScript 中使用。

### 在 HTML 中使用媒体查询

在 HTML 中有几种不同场景会使用媒体查询。最为常见是在 `<head>` 中的 `<link>` 元素，通过它来引用不同的 CSS 样式文件，并且通过 `media` 属性来指定媒体查询的条件。比如下面这个例子，将会告诉浏览器，我们想在不同的视窗宽度上使用不同的样式表：

```HTML
<html>
    <head>
        <!-- 所有用户 -->
        <link rel="stylesheet" href="all.css" media="all" />
        
        <!-- 浏览器视窗宽度至少是20em，相当于 Mobile -->
        <link rel="stylesheet" href="small.css" media="(min-width: 20em)" />
        
        <!-- 浏览器视窗宽度至少是64em, 相当于 Tablet -->
        <link rel="stylesheet" href="medium.css" media="(min-width: 64em)" />
        
        <!-- 浏览器视窗宽度小于是90em，相当于 Desktop -->
        <link rel="stylesheet" href="large.css" media="(min-width: 90em)" />
        
        <!-- 浏览器视窗宽度至少是 120em，超大屏幕，比如 TV -->
        <link rel="stylesheet" href="extra-large.css" media="(min-width: 120em)" />
        
        <!-- 用于打印设备 -->
        <link rel="stylesheet" href="print.css" media="print" />
    </head>
    <body>
    </body>
</html>
```

这样做对于 Web 性能也是有一定好处的。将一个大的样式文件分拆成多个小文件，并且浏览器会根据媒体条件下载所需的样式文件。但要明确的是，这并不总是阻止不匹配这些媒体查询的样式表下载，它只是为它们分配了一个低加载优先级。

因此，如果像电话这样的小屏幕设备访问站点，它将只下载与其视口大小匹配的媒体查询中的样式表。但是，如果出现更大的桌面屏幕，它将下载整个集合，因为它匹配所有这些查询。

另外一个使用场景是 `<picture>` 的 `<source>` 上。如果你曾经或正在开发一个响应式 Web 应用，你就会知道，在开发响应式 Web 应用时，你可能会使用 HTML 5 的 `<picture>` 元素来加载图片。例如：

```HTML
<picture> 
    <source media="(max-width: 799px)" srcset="./elva-480w-close-portrait.jpeg"> 
    <source media="(min-width: 800px)" srcset="./elva-800w.jpeg"> 
    <img src="./elva-800w.jpeg" alt="Chris standing up holding his daughter Elva"> 
</picture>
```

浏览器会根据 CSS 媒体查询设置的断点切换图片，呈现给用户的图片会有两个阶段：

-   在大屏幕上，显示一张大的图片
-   在小屏幕上，显示一张小的图片（基于大图片裁剪过的）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18f2f60f22a54b42b04d22a67374832f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGQjwYv>

HTML 中使用媒体查询还有一个场景是在 `<style>` 元素上。众所周知，我们可以在 HTML 的 `<style></style>` 中编写所需的 CSS 代码。同样的，可以在 `<style>` 元素设置 `media` 属性的值，用来指定媒体查询所需要匹配的条件。它有点类似于前面 `<link>` ：

```HTML
<html>
    <head>
        <style>
            p {
                background-color: blue;
                color: white;
             }
        </style>
​
        <style media="all and (max-width: 500px)">
            p {
                background-color: yellow;
                color: blue;
            }
        </style>
    </head>
</html>
```

### 在 CSS 中使用媒体查询

事实上，使用媒体查询最常见的地方还是在 CSS 样式文件的 `@media` 规则中。例如：

```CSS
/* Mobile 先行 */
body {
    background-color: #f09a9d;
}
​
/* Tablet */
@media only screen and (min-width: 401px) and (max-with: 960px) {
    body {
        background-color: #f5cf8e;
    }
}
​
/* Desktop */
@media only screen and (min-width: 961px) {
    body {
        background-color: #b2d6ff;
    }
}
```

不过，除了上面这种方式之外，在 CSS 样式表中使用媒体查询还有另一种方式。那就是在样式表中使用 `@import` 引入 `.css` 文件时，可以在其后面紧跟媒体查询，比如：

```CSS
@import "print.css" print; 
@import "animation.css" (prefers-reduced-motion: no-preference); 
@import "retina-media.css" (prefers-reduced-data: no-preference); 
@import "dark.css" (prefers-color-scheme: dark); 
@import "mobile.css" (max-width: 320px); 
@import "hd-colors.css" (dynamic-range: high);
```

### 在 JavaScript 中使用媒体查询

可能大家最为熟悉的是在 CSS 中使用媒体查询，其实在 JavaScript 中也可以对媒体查询进行操作。我们可以通过 `window` 的 `matchMedia()` 方法来对媒体查询进行操作。

`matchMedia() 方法是 CSSOM 中的一个 API`，它将返回 `MediaQueryList`，而且返回的 `MediaQueryList` 可被用于判断 `Document` 是否匹配媒体查询，或者监控一个 `document` 来判定它匹配了或者停止匹配了此媒体查询。

其用法几乎与 CSS 媒体查询相同。我们将媒体查询字符串传递给 `matchMedia()`，然后检查 `.matches` 属性：

```JavaScript
const mediaQuery = window.matchMedia('(min-width: 320px)') 
```

正如上面所示，我们定义的媒体查询将返回 `MediaQueryList` 对象：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41fc0ea07cb143cba4081281702d2c12~tplv-k3u1fbpfcp-zoom-1.image)

它是一个存储有关媒体查询的信息的对象，我们需要的关键属性是 `.matches`。这是一个只读布尔值，如果文档与媒体查询匹配，则返回 `true`，否而返回的是 `false`。

只不过，`.matches` 只适合一次性瞬时检查，但不能连续检查，并根据检测做出相应的更改。也就是说，如果希望随着视窗宽度改变了，`.matches` 要得到相应的变化，那就需要其他的一些 API 的支持。好在 `MediaQueryList` 有一个 `addListener()` 和 `removeListener()` 方法，它们都可以接受一个回调函数（`.onchange` 事件），该函数在媒体查询状态更改时被调用。换句话说，当条件发生变化时，我们可以触发其他函数，从而允许我们响应更新后的条件。

```JavaScript
const mediaQuery = window.matchMedia('(min-width: 768px)') 
​
function handleTabletChange(e) { 
    if (e.matches) { 
        console.log('Media Query Matched!') 
    } 
} 
​
mediaQuery.addListener(handleTabletChange) 
handleTabletChange(mediaQuery) 
```

为了考虑老的浏览器兼容方式，还可以使用最常见的方法，即监听 `window` 的 `resize` ，并且通过 `window.innerWidth` 或 `window.innerHeight` 来做判断：

```JavaScript
function checkMediaQuery() { 
    if (window.innerWidth > 768) { 
        console.log('匹配媒体查询') 
    } 
} 
​
window.addEventListener('resize', checkMediaQuery);
```

我们来看一个简单的示例：

```JavaScript
const mobileMenuComponent = `
    <div class="menu" id="drop_menu">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon">
            <path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" class=""></path>
        </svg>
        <ul class="drop__menu">
            <li>CSS</li>
            <li>JavaScript</li>
            <li>React</li>
            <li>Vue</li>
            <li>SVG</li>
        </ul>
    </div>
`;
​
const MenuComponent = `
    <ul class="nav">
        <li>CSS</li>
        <li>JavaScript</li>
        <li>React</li>
        <li>Vue</li>
        <li>SVG</li>
    </ul>
`;
​
const setNavInnerHTML = (html) => {
    const nav = document.querySelector("nav");
    nav.innerHTML = html;
};
​
​
const mql = window.matchMedia("(max-width: 600px)");
​
function isShowMobileMenu() {
    const dropMenu = document.getElementById("drop_menu");
​
    if (dropMenu) {
        console.log("has");
        dropMenu.addEventListener("click", function () {
            this.classList.toggle("show");
        });
    } else {
        console.log("no");
        return false;
    }
}
​
let mobileView = mql.matches;
if (mobileView) {
    setNavInnerHTML(mobileMenuComponent);
    isShowMobileMenu();
} else {
    setNavInnerHTML(MenuComponent);
}
​
mql.addEventListener("change", (e) => {
    let mobileView = e.matches;
    if (mobileView) {
        setNavInnerHTML(mobileMenuComponent);
        isShowMobileMenu();
    } else {
        setNavInnerHTML(MenuComponent);
    }
});
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/598817dc193c4f86b8137b5c5500db15~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxBGeE>

## 新的 CSS 媒体查询范围语法

CSS 媒体查询主要包括 CSS 的 `@` 规则、媒体类型、媒体逻辑运算符和媒体特性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbe72550efd44f05958968451e6564bc~tplv-k3u1fbpfcp-zoom-1.image)

上图所展示的是 CSS 媒体查询的语法规则。

正如前面所述，我们依靠 CSS 媒体查询根据媒体条件进行样式化元素。这个条件可以是各式各样的东西，但通常分为两个阵营：

-   正在使用的媒体类型，例如打印机（`print`）、屏幕（`screen`）和语音合成器（`speech`）等
-   浏览器、设备甚至用户环境的特定功能

假设，我们想要对打印 Web 页面应用某些 CSS 规则，可以这样使用：

```CSS
body {
    margin: 2em;
    color: #fff;
    background-color: #000;
}
​
/* 打印样式 */
@media print {
    body {
        margin: 0;
        color: #000;
        background-color: #fff;
    }
}
```

事实上，我们可以在一定的视窗宽度上应用样式，这使得 CSS 媒体查询成为响应式网页设计的核心成分。如果浏览器的视窗宽度匹配媒体查询条件指定的大小，那么应用一组样式规则。例如：

```CSS
body {
    background-color: red;
}
​
/* 当浏览器视窗宽度大于或等于 30em，body 的背景颜色变成蓝色 */
@media screen and (min-width: 30em) {
    body {
        background-color: blue;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21e701d093dd46efb858cb76d6a528a6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJBKYz>

注意到 `@media` 规则中的 `and` 关键词了吗？它是一个运算符，它允许我们组合媒体查询。在上面这个示例中，我`and` 关键词将媒体类型（`screen`）和一个媒体特性（浏览器视窗最小宽度是 `30em`）组合成一个查询条件。即只有当这两者都符合时，才会将 `body` 的背景色调整为蓝色（`blue`）。

在 CSS 媒体查询中，逻辑运算符除了 `and` 之外，还有 `not` 、`only` 以及逗号（`,`），使用它们可以联合构造复杂的媒体查询，其中通过“逗号”（`,`）分隔多个媒体查询，将它们组合为一个规则。 另外，这几个逻辑操作符有点类似于JavaScript中的 与(`&`)、 或（`||`） 和 非（`!`）。

-   **`and`**：运算符用于将多个媒体查询规则组合成单条媒体查询，当每个查询规则都为真时则该条媒体查询为真，它还用于将媒体功能与媒体类型结合在一起。
-   **`not`**：运算符用于否定媒体查询，如果不满足这个条件则返回 `true`，否则返回 `false`。 如果出现在以逗号分隔的查询列表中，它将仅否定应用了该查询的特定查询。如果使用 `not` 运算符，则还必须指定媒体类型。
-   **`only`**：运算符仅在整个查询匹配时才用于应用样式，并且对于防止较早的浏览器应用所选样式很有用。 当不使用 `only` 时，旧版本的浏览器会将 `screen and (max-width: 500px)` 简单地解释为 `screen`，忽略查询的其余部分，并将其样式应用于所有屏幕。 如果使用 `only` 运算符，则还必须指定媒体类型。
-   **`,`** **(逗号)** ：逗号用于将多个媒体查询合并为一个规则。 逗号分隔列表中的每个查询都与其他查询分开处理。 因此，如果列表中的任何查询为 `true`，则整个 `media` 语句均返回 `true`。 换句话说，列表的行为类似于逻辑或（`or`）运算符。

注意，**若使用了** **`not`** **或** **`only`** **操作符，必须明确指定一个媒体类型**！

通过运算符，我们可以针对不同的视窗大小调整元素样式规则，例如：

```CSS
/* 页面背景颜色默认为红色 */
body {
    background-color: red;
}
​
/* 浏览器视窗宽度在 30em ~ 80em 之间时，页面背景为蓝色 */
@media screen and (min-width: 30em) and (max-width: 80em) {
    body {
        background-color: blue;
    }
}
​
/* 浏览器视窗宽度大于 80em 时，页面背景为橙色 */
@media screen and (min-width: 60em) {
    body {
        background-color: orange;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3812c270ce764861bc621ee517670f6f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQJEoO>

现在这些样式应用于一个明确的视窗宽度范围，而不是单一的宽度!

你可能已经发现了，在这几个示例中，媒体特性中都是查询浏览器视窗的宽度，并且是通过 `min-width` 和 `max-width` 来设置视窗宽度范围。例如：

-   `min-width: 30em` 表示浏览器视窗宽度大于或等于 `30em`
-   `max-width: 80em` 表示浏览器视窗宽度小于或等于 `80em`

在媒体查询中，`min-width` （或 `min-height`）和 `max-width` （或 `max-height`）等称为查询范围。只是使用 `min-` 和 `max-` 时常令人感到困惑，至少我自己有这种困惑：“使用 `min-width` 和 `max-width` 很多时候傻傻分不清楚他们的范围”。为此，我总是喜欢使用下图来做判断：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5faed120bc9248839bd2468049f6e1e6~tplv-k3u1fbpfcp-zoom-1.image)

但是 [Media Queries Level 4 规范引入了一种新的语法](https://www.w3.org/TR/mediaqueries-4/)，它使用常见的数学比较运算符(如 `<`、`>` 和 `=` )来确定视窗宽度的范围，这在语法上更有意义，同时编写的代码更少，更易于理解代码。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a28acc9de7d24285820c97d21e8a84c5~tplv-k3u1fbpfcp-zoom-1.image)

上图中使用 `@media` 语法表达的话，像下面这样：

```CSS
/* 老方式的查询范围语法 */ 
@media (min-width: 375px) { 
    /* 视窗宽度大于或等于 375px */ 
}
​
@media (max-width: 768px) { 
    /* 视窗宽度小于或等于 768px */
}  
​
@media (min-width: 375px) and (max-width: 768px) { 
    /* 视窗宽度在 375px ~ 768px 之间 */ 
} 
​
/* 新式的查询范围语法 */ 
@media (width >= 375px) {
    /* 视窗宽度大于或等于 375px */ 
}
​
@media (width <= 768px) { 
    /* 视窗宽度小于或等于 768px */
}  
​
@media (375px <= width <= 768px) { 
    /* 视窗宽度在 375px ~ 768px 之间 */ 
} 
```

Media Queries Level 4 规范中最大的变化是我们有了比较值而不是组合值的新操作符：

-   **`<`** ：计算一个值是否小于另一个值
-   **`>`** ：计算一个值是否大于另一个值
-   **`=`** ：计算一个值是否等于另一个值
-   **`>=`** ：计算一个值是否大于或等于另一个值
-   **`<=`** ：计算一个值是否小于或等于另一个值

有了这些新的操作符之后，CSS 媒体查询的语法规则也相应的变成下图这样：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe97de44ecb14a02b44513831891391b~tplv-k3u1fbpfcp-zoom-1.image)

通常，当我们编写 CSS 媒体查询时，我们会创建一个所谓的断点，即一个设计“中断”的条件，并应用一组样式来修复它。一个设计可以有一堆断点！它们通常基于两个宽度之间的视窗：断点开始的地方和断点结束的地方。

下面是我们如何使用 `and` 操作符来组合两个断点值：

```CSS
/* 浏览器视窗宽度在 400px ~ 1000px 之间 */
@media (min-width: 400px) and (max-width: 1000px) {
    /* CSS 样式规则 */
}
```

当我们放弃布尔操作符，转而使用新的范围比较语法时，你会意识到编写 CSS 媒体查询是多么的简短和容易：

```CSS
@media (400px <= width <= 1000px) {
    /* CSS 样式规则 */
}
```

容易多了，对吧？

为什么新的语法更容易理解呢？主要是因为比较运算符（例如 `width >= 320px`）比使用 `min-width` 和 `max-width` 更容易理解。通过去除最小和最大之间的细微差别，我们只有一个宽度参数可以使用，而运算符告诉我们其余的内容。

新语法除了语法的视觉差异之外，它们的工作方式也略有不同。使用 `min-` 和 `max-` 相当于使用数学比较运算符：

-   `max-width` 相当于 `<=` 运算符，例如，`(max-width: 320px)` 与 `(width <= 320px)` 相同
-   `min-width` 相当于 `>=` 运算符，例如，`(min-width: 320px)` 与 `(width >= 320px)` 相同

注意，两者都不等同于 `>` 或 `<` 操作符。

让我们直接从 Media Queries Level 4 规范中提取一个例子，我们基于在视窗宽度中使用 `min-width` 和 `max-width` 的 `320px` 的断点定义不同的样式:

```CSS
@media (max-width: 320px) { 
    /* 浏览器视窗宽度 <= 320px 定义的样式 */ 
}
​
@media (min-width: 320px) { 
    /* 浏览器视窗宽度 >= 320px 定义的样式 */ 
}
```

当浏览器视窗宽度等于 `320px` 时，两个媒体查询都匹配一个条件。这不是我们想要的。我们需要其中任何一个条件，而不是同时需要两个条件。为了避免隐式更改，我们可以根据 `min-width` 为查询添加一个像素:

```CSS
@media (max-width: 320px){ 
    /* 浏览器视窗宽度 <= 320px 定义的样式*/ 
}
​
@media (min-width: 321px){ 
    /* 浏览器视窗宽度 >= 321px 定义的样式 */ 
}
```

虽然这可以确保当浏览器视窗宽度为 `320px` 时，两组样式不会同时应用，但任何介于 `320px` 和 `321px` 之间的视窗宽度都会导致一个超小的区域，其中两个查询中的任何样式都不会应用。这会造成一个奇怪现象，即“未样式内容的闪烁”。

一种解决方案是将第二个比较尺度值(小数点后的数字)增加到 `320.01px` ：

```CSS
@media (max-width: 320px) { 
    /* 浏览器视窗宽度 <= 320px 定义的样式 */ 
}
​
@media (min-width: 320.01px) { 
    /* 浏览器视窗宽度 >= 320.01px 定义的样式 */ 
}
```

但这太愚蠢了，太复杂了。这就是为什么新的媒体特性范围语法是一个更合适的方法：

```CSS
@media (width <= 320px) { 
    /* 浏览器视窗宽度 <= 320px 定义的样式 */ 
}
​
@media (width > 320px) { 
    /* 浏览器视窗宽度 > 320px 定义的样式*/ 
}
```

需要注意的是，在新语法规则中，同样可以使用 `and` 、`not` 和 `or` 等逻辑运算符。例如，假设我们有下面这个媒体查询，查询浏览器视窗宽度是否在 `500px ~ 800px` 之间，并设置 `body` 的背景颜色为 `lightpink` 。

```CSS
@media screen and ((max-width: 800px) and (min-width: 500px)) {
    body {
        background-color: lightpink;
    }
}
```

上面是老语法，换成新语法规则，它就变成下面这样：

```CSS
@media screen and (500px <= width <= 800px) {
    body {
        background-color: lightpink;
    }
}
```

如果希望使前面的示例更具可读性，也可以在新语法规则中使用 `and`、`not` 和 `or` 之类：

```CSS
@media screen and ((width >= 500px) and (width <= 800px)) {
    body {
        background-color: lightpink;
    }
}
```

接下来一起看一个真实案例。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95409f55f7ba49308e16bd9c4f67dd62~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYMLNoW>

这是一个很简单的响应式布局。在不同断点调整了网格的布局：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/152704896f524bb4a9d147a111225cc9~tplv-k3u1fbpfcp-zoom-1.image)

其核心代码如下：

```CSS
/* Mobile */
.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}
​
header {
    justify-content: center;
}
​
main > * {
    grid-column: 1 / -1;
    justify-self: center;
}
​
.title p {
    font-size: 3.75rem;
}
​
header ul {
    display: none;
}
​
/* Tablet */
@media screen and (width >= 768px) {
    header {
        justify-content: space-between;
    }
​
    header ul {
        display: flex;
        justify-content: space-between;
        gap: 3rem;
    }
​
    .title p {
        font-size: 5.75rem;
    }
}
​
/* Desktop */
@media screen and (width >= 1000px) {
    .grid {
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: auto 250px;
    }
​
    .title p {
        font-size: 7.75rem;
    }
​
    main .title {
        grid-row: 2;
    }
​
    main .images {
        grid-row: 1 / span 2;
        align-self: end;
        position: relative;
    }
}
```

## 媒体特性

媒体特性是CSS 媒体查询中最主要的部分，对你的设计有很大的影响。媒体特性可以做很多事情。 它描述了用户代理（User Agent）、输出设备或是浏览环境的具体特征。也可以说，媒体特性是 CSS 媒体查询中最为重要的一部分：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d01a355b565440c583073696d781b490~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，从 CSS 2.1，到 CSS Media Queries Level 4，再到 CSS Media Queries Level 5，媒体特性主要分为 视窗和页面媒体特性、显示媒体特性、颜色媒体特性、交互媒体特性、作用于视频媒体特性、脚本媒体特性、用户喜好媒体特性、双屏幕或可折叠屏幕媒体特性以及一些废弃的媒体特性。这几大类媒体特性中都含有已客户端支持的媒体特性，也有还未得到支持的媒体特性。

你也看到了，媒体特性有很多种类型，接下来的内容从我的角度挑选一些有意思的媒体特性，我们一起来看看这些特性在实际项目中能帮我们做些什么？

### width 和 height

`width` 和 `height` 是 CSS 媒体查询中最常见的一种媒体特性。我们可以使用 `width` 和 `height` 来查询终端设备上浏览器视窗的精确宽度或高度，但也可以是一个范围值。只不过，我们更有用（或更常用）的是宽度或高度的范围值。比如：

```CSS
body { 
    background-color: #0EAD69; 
} 
​
@media screen and (width <= 1600px) { 
    body { 
        background-color: #3BCEAC; 
    } 
} 
​
@media screen and (width <= 1280px) { 
    body { 
        background-color: #FFD23F; 
    } 
} 
​
@media screen and (width <= 960px) { 
    body { 
        background-color: #EE4266; 
    } 
} 
​
@media screen and (width <= 600px) { 
    body { 
        background-color: #540D6E; 
    } 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e10745b4c67463fbc7d5fd1daa81484~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abQjpMX>

### orientation

对于很多手持移动终端而言，他们有分横屏（Landscape）和 竖屏（Portrait）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/720ba6edee23430dbc390ba18e740abe~tplv-k3u1fbpfcp-zoom-1.image)

在 CSS 媒体特性中通过 `orientation` 可以直接用来区分它们：

-   **`portrait`**：竖屏，屏幕视窗高度大于宽度
-   **`landscape`**：横屏，屏幕视窗宽度大于高度

如果你希望在横竖屏有着不同的布局方式，可以像下面这样写 CSS：

```CSS
/* 竖屏 */
@media screen and (orientation: portrait) { 
    body { 
        background-color: #ffd23f; 
    } 
} 
​
/* 横屏 */
@media screen and (orientation: landscape) { 
    body { 
        background-color: #ee4266; 
    } 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/073c4406bab14979a0c598dd7126d0ac~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQZRXL>

正如上面示例所示，当浏览器视窗高度大宽度时，竖屏（`portrait`）就会触发；类似的，如果视宽宽度大于高度，那么横屏（`landscape`）就会被触发。

### resolution

使用 `resolution` 媒体特性可以测试显示像素密度。简单地说，我们可以根据终端设备屏幕的像素密度做为媒体查询的条件。因为自从苹果公司发布视网膜（Retina Display）之后，高像素密度的屏幕就越来越多，在 Web 开发中就有可能需要为不同像素密度的屏幕提供不同的样式或资源，特别是背景图片的使用。

在 CSS 媒体查询中，我们可以将 `resolution` 作为媒体特性，例如：

```CSS
@media (resolution: 150dpi) { 
    p { 
        color: red; 
    } 
}
```

同样的，在使用 `resolution` 时也可像 `width` 类似，添加 `min-` 和 `max-` 做前缀：

```CSS
@media (min-resolution: 72dpi) { 
    p { 
        text-decoration: underline; 
    } 
} 
​
@media (max-resolution: 300dpi) { 
    p { 
        background: yellow; 
    } 
} 
​
@media only screen and (min-resolution: 1.5dppx) { 
    p { 
        background: #f36; 
    } 
}
```

另外还可以使用 `x` 来替代 `dppx`，比如 `1` 倍的我们可使用 `1x`，两倍的我们可以使用 `2x`：

```CSS
@media (min-resolution: 1x) { 
    body { 
        background-color: #f36; 
    } 
} 
​
@media (min-resolution: 2x) { 
    body { 
        background-color: #09f 
    } 
} 
​
@media (min-resolution: 3x) { 
    body { 
        background-color: #fac; 
    } 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efd222080468414a8f41a1635933d50e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQjmpg>

不过 Safari 16 之前版本还不支持 `resolution` 媒体特性，但它有一个和该特性等同的私有特性，即 `-webkit-device-pixel-ratio`（也可以带 `min-` 或 `max-` 前缀，比如 `-webkit-min-device-pixel-ratio` 和 `-webkit-max-device-pixel-ratio`），它接受一个没有单位的数字：

```CSS
@media (-webkit-min-device-pixel-ratio: 1) { 
    body { 
        background-color: #f36; 
    } 
} 
​
@media (-webkit-min-device-pixel-ratio: 2) { 
    body { 
        background-color: #09f; 
    } 
} 
​
@media (-webkit-min-device-pixel-ratio: 3) { 
    body { 
        background-color: #fac; 
    } 
} 
```

还可以使用 `,` 分隔符将它们合并在一起，比如：

```CSS
@media (-webkit-min-device-pixel-ratio: 1), (min-resolution: 1x) { 
    body { 
        background-color: #f36; 
    } 
} 
​
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2x) { 
    body { 
        background-color: #09f; 
    } 
} 
​
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3x) { 
    body { 
        background-color: #fac; 
    } 
} 
```

### inverted-colors

在苹果公司推出 DarkMode 之前，有一些安卓设备就有类似的功能，只不过他们被称为反转模式或者说是夜间模式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4738387e1ad4d4f88696a72e26326aa~tplv-k3u1fbpfcp-zoom-1.image)

但有些安卓设备中 Dark Mode 的效果实际就是粗暴的颜色反转或滤镜的一个效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f7c1e1b3450430b8f4fcf307c25c80f~tplv-k3u1fbpfcp-zoom-1.image)

不过有些用户可能喜欢这样的效果。它看起来很整洁，黑白之间的对比度更明显：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b6b47ca213e4145a49ba2cdff6bf090~tplv-k3u1fbpfcp-zoom-1.image)

`inverted-colors` 媒体查询特性让用户适应这些怪癖。该媒体查询特性可以接受两个值：

-   `none`：颜色显示正常
-   `inverted`：显示区域内的所有像素都被倒置了

`inverted-colors` 是一个布尔值选项，但也可以直接跳过这个值，写成这样：

```CSS
.text { 
    font-size: 24px; 
} 
​
@media screen and (inverted-colors: inverted) { 
    .text { 
        font-size: 36px; 
    } 
} 
```


![fig-24.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4edc2c2a473407483931b2698f3c2cf~tplv-k3u1fbpfcp-watermark.image?)

如果你是使用苹果电脑的话，同样可以在系统级别做这方面设置：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8915e9e9bee943acb6aa0e51c0dacf2b~tplv-k3u1fbpfcp-zoom-1.image)

也可以说，`inverted-colors` 是根据用户喜好设置来做查询。

### color-gamut

通过《[11 | 新的 CSS 颜色空间：为 Web 设置高清颜色](https://juejin.cn/book/7223230325122400288/section/7233227753909125178)》一节课，我们已然知晓，有很多新的颜色空间用于 Web 中，比如像 `p3` 的颜色空间，可以为 Web 页面指定高清颜色。而 `color-gamut` 这个媒体特性就可以用来检测设备是否支持丰富的颜色空间。对于 `color-gamut` 有三个值可选：

-   `srgb`：sRGB 颜色空间是指由红、绿、蓝三组值表示，它们标识了 sRGB 颜色空间中的一个点，这也是我们熟悉的颜色空间
-   `p3`：它是现代 iPhone 所使用的，通常被称为“宽色域”（或“丰富色域”），指的是 `Display-p3`，`Display-P3` 颜色空间颜色要比 sRGB 颜色空间中的颜色更鲜艳，也可以说 `Display-p3` 是 sRGB 的一个超集，大约要大 `35%`
-   `rec2020`：这是目前可用的最大的色彩空间

也就是说，如果一个用户有一个更宽的色域显示，你可以在那个颜色空间使用，它们比 `sRGB` 更丰富，更生动：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66ed25e4a815407d89273ae5e2cd527c~tplv-k3u1fbpfcp-zoom-1.image)

目前 `p3`（也就是 `Display-p3`）支持的终端设备不多，但我们可以使用 CSS 媒体查询来做判断：

```CSS
/* 支持sRGB颜色空间 */ 
p { 
    color: rgb(255 0 0); 
} 
​
/* 支持p3（Display-p3）颜色空间 */ 
@media (color-gamut: p3) { 
    p { 
        color: color(display-p3 1 0 0); 
    } 
} 
```

### hover

Web 上充满了很多互动，而我们选择展示与元素交互的方式往往是使用鼠标悬停。毕竟，当用户将鼠标悬浮在元素上时，稍微改变元素是交互或非交互的一个很好指示器。只是由于移动设备（如手机和平板电脑）没有像桌面电脑和笔记本电脑那样具备鼠标悬浮的交互操作，因此它们在你触摸元素时才会显示悬停状态。即使你不再触摸元素，它们仍然保持悬停状态。比如下面这个示例：

```HTML
<a href="/" class="button">Hove Me</a>
<button class="button">Hove Me</button>
<span class="button">Hove Me</span>
```

```CSS
.button {
    padding: 0.5em 1em;
    font-size: 1.125rem;
    border-radius: 0.6em;
    background-color: coral;
    font-weight: bold;
    border: 1px solid transparent;
    text-decoration: none;
    color: #fff;
    cursor: pointer;
    transition: background-color 200ms ease-in-out;
}
​
.button:hover {
    background-color: hotpink;
}
```

在桌面端电脑或平板电脑上，你将鼠标悬浮到按钮（`.button`）上时，它的背景颜色会从 `coral` 过渡到 `hotpink` ，符合我们所需要的一个交互效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/159baadd24d246e78ed615824c0b42bf~tplv-k3u1fbpfcp-zoom-1.image)

当你在移动终端，比如手机或平板电脑上，你触摸按钮元素（`.button`）时，它的背景颜色同样也会从 `coral` 过渡到 `hotpink` 。可是，在有些元素上，它始终会让按钮背景颜色保持 `hotpink` 颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9d22fc7ce8d41c8a57e910dd9c5b103~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqBpVK>

虽然看上去并无大碍，但会使用户的整体体验变得混乱，因为你的网站或 Web 应用程序没有提供正确的反馈。

上面这个示例仅仅是造成用户体验变得混乱，但有些场景会使应用变得不可用。比如下面这个卡片：

```HTML
<article class="card">
  <img
    class="card__background"
    src="https://picsum.photos/800/400/?random=11"
    alt="Photo of Cartagena's cathedral at the background and some colonial style houses"
  />
  <div class="card__content ">
    <div class="card__content--container">
      <h2 class="card__title">Colombia</h2>
      <p class="card__description">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum in
        labore laudantium deserunt fugiat numquam.
      </p>
    </div>
    <button class="card__button">Read more</button>
  </div>
</article>
```

```CSS
:root {
    --brand-color: hsl(46, 100%, 50%);
    --black: hsl(0, 0%, 0%);
    --white: hsl(0, 0%, 100%);
    --font-title: "Montserrat", sans-serif;
    --font-text: "Lato", sans-serif;
}
​
.card {
    display: grid;
    place-items: center;
    width: 80vw;
    max-width: 21.875rem;
    height: 31.25rem;
    overflow: hidden;
    border-radius: 0.625rem;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.25);
    cursor: pointer;
}
​
.card > * {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
}
​
.card__background {
    display: block;
    object-fit: cover;
    object-position: center;
    max-width: 100%;
    height: 100%;
}
​
.card__content {
    --flow-space: 0.9375rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-self: flex-end;
    height: 55%;
    padding: 12% 1.25rem 1.875rem;
    background: linear-gradient(
        180deg,
        hsla(0, 0%, 0%, 0) 0%,
        hsla(0, 0%, 0%, 0.3) 10%,
        hsl(0, 0%, 0%) 100%
    );
    row-gap: var(--flow-space, 1em);
}
​
.card__content--container {
    --flow-space: 1.25rem;
}
​
.card__title {
    position: relative;
    width: fit-content;
    font-size: 2.25rem;
    font-family: var(--font-title);
    color: var(--white);
    line-height: 1.1;
}
​
.card__title::after {
    content: "";
    position: absolute;
    height: 0.3125rem;
    width: calc(100% + 1.25rem);
    bottom: calc((1.25rem - 0.5rem) * -1);
    left: -1.25rem;
    background-color: var(--brand-color);
}
​
.card__description {
    font-family: var(--font-text);
    font-size: 1rem;
    line-height: 1.5;
    color: var(--white);
    margin-top: var(--flow-space, 1em);
}
​
.card__button {
    padding: 0.75em 1.6em;
    width: fit-content;
    font-variant: small-caps;
    font-weight: bold;
    border-radius: 0.45em;
    border: none;
    background-color: var(--brand-color);
    font-family: var(--font-title);
    font-size: 1.125rem;
    color: var(--black);
}
​
.card__button:focus {
    outline: 2px solid black;
    outline-offset: -5px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b65a635493e348cbb33e53dcb49b1f56~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNQMZwb>

你们发现，卡片在所有终端的效果都是一样的，用户体验也是一样的。但是，设计师突然跟你说，需要给卡片添加一些动效：

-   最初，只有标题（没有下划线）可见。
-   当用户悬停在卡片上时，它会向上移动，显示出其他的内容。
-   卡片也会略微增大，背景图像也会放大。
-   然后，下划线将出现在左侧，并扩展到标题的末尾。
-   当下划线动画结束后，文本和按钮将淡入淡出。


![86698e0c-b722-4a9e-8a15-43962e2d873a.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c08ba625323a479085c1e298b105cfa4~tplv-k3u1fbpfcp-watermark.image?)

> Demo 地址：<https://codepen.io/airen/full/jOQpBwp>

假设，你按照往常一样的方式给卡片添加设计所需要的动画效果，并期望着能在所有终端上有着相同的效果。

```CSS
.card__content {
    transform: translateY(62%);
    transition: transform 500ms ease-out;
    transition-delay: 500ms;
}
​
.card__title::after {
    opacity: 0;
    transform: scaleX(0);
    transition: opacity 1000ms ease-in, transform 500ms ease-out;
    transition-delay: 500ms;
    transform-origin: right;
}
​
.card__background {
    transition: transform 500ms ease-in;
}
​
.card__content--container > :not(.card__title),
.card__button {
    opacity: 0;
    transition: transform 500ms ease-out, opacity 500ms ease-out;
}
​
.card:hover,
.card:focus-within {
    transform: scale(1.05);
    transition: transform 500ms ease-in;
}
​
.card:hover .card__content,
.card:focus-within .card__content {
    transform: translateY(0);
    transition: transform 500ms ease-in;
}
​
.card:focus-within .card__content {
    transition-duration: 0ms;
}
​
.card:hover .card__background,
.card:focus-within .card__background {
    transform: scale(1.3);
}
​
.card:hover .card__content--container > :not(.card__title),
.card:hover .card__button,
.card:focus-within .card__content--container > :not(.card__title),
.card:focus-within .card__button {
    opacity: 1;
    transition: opacity 500ms ease-in;
    transition-delay: 1000ms;
}
​
.card:hover .card__title::after,
.card:focus-within .card__title::after {
    opacity: 1;
    transform: scaleX(1);
    transform-origin: left;
    transition: opacity 500ms ease-in, transform 500ms ease-in;
    transition-delay: 500ms;
}
```

实际效果却与你想象的并不一致：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a5b2e41734b41fc8c0a1a99b1763797~tplv-k3u1fbpfcp-zoom-1.image)

在支持鼠标悬浮的设备上，效果是你所期望的，但在不支持鼠标悬浮的设备上（比如移动手机和平板电脑），就事与愿违了：


![111200ae717-63e7-4e60-b393-323930edd7e1.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d25707d743c547219545aa22453cb6c2~tplv-k3u1fbpfcp-watermark.image?)

你可能发现了，在移动端上需要用户触摸卡片，才能触动相关的动效，以及看到相关的内容。正如示例所示，在没有任何信息提示之下，用户很有可能是不知道需要自己主动触摸卡片，才能浏览到隐藏的内容。甚至有的时候，用户无意之间触摸到卡片，触发了卡片上的动效，可能会给用户带来一些惊吓而不是惊喜。

也就是说，上面示例中的带有动效的卡片效果，在具有悬浮功能的设备上，这似乎完全没有问题，但是对于没有悬浮功能的设备，用户必须轻触才能查看卡片的信息，这可能对那种设备来说是尴尬和不直观的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe87f64c0d2240a7b72d5aa310a34f2e~tplv-k3u1fbpfcp-zoom-1.image)

为了避免在触摸设备上显示悬停样式，你可以采用以下策略之一：

```CSS
@media (hover: hover) {
    .button:hover {
        background-color: hotpink;
    }
}
```

或者：

```CSS
.button:hover {
    background-color: hotpink;
}
​
@media (hover: none) {
    .button:hover {
        background-color: coral;
    }
}
```

在支持悬停的设备上，你将看到相应的悬浮效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ba2b3a239104b11b09239bba5e14433~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEmjeJP>

在不支持悬停的设备上，也不会因为 `:hover` 的效果给用户的体验造成混乱：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32881974bf994a17926a8b7f1986dad2~tplv-k3u1fbpfcp-zoom-1.image)

这里我们使用了 CSS 媒体查询中的 `hover` 查询条件，它允许我们检测用户的主要输入机制是否能够悬停在元素上。它可以接受两个值：

-   `none` 检测主要输入机制不能悬停或不能方便地悬停，如大多数手机和平板电脑；
-   `hover` 检测主要输入机制能够悬停在元素上（例如，台式电脑、笔记本电脑和带有触控笔的智能手机）。

请记住，正如你前面所看到的一样，在移动端设备上，比如大多数手机和平板电脑，是没有可以悬停在元素上的输入机制的，但可以通过轻触来或长按来模拟此功能，这可能不太方便并且会引起一些可用性的问题，比如前面示例所展示的用户体验混乱的问题。

回到前面所展示的卡片组件的示例，我们解决这个问题的最佳方法是将所有动画相关的规则放在 `hover` 媒体查询中，如下所示：

```CSS
@media (hover: hover) {
    .card__content {
        transform: translateY(62%);
        transition: transform 500ms ease-out;
        transition-delay: 500ms;
    }
​
    .card__title::after {
        opacity: 0;
        transform: scaleX(0);
        transition: opacity 1000ms ease-in, transform 500ms ease-out;
        transition-delay: 500ms;
        transform-origin: right;
    }
​
    .card__background {
        transition: transform 500ms ease-in;
    }
​
    .card__content--container > :not(.card__title),
    .card__button {
        opacity: 0;
        transition: transform 500ms ease-out, opacity 500ms ease-out;
    }
​
    .card:hover,
    .card:focus-within {
        transform: scale(1.05);
        transition: transform 500ms ease-in;
    }
​
    .card:hover .card__content,
    .card:focus-within .card__content {
        transform: translateY(0);
        transition: transform 500ms ease-in;
    }
​
    .card:focus-within .card__content {
        transition-duration: 0ms;
    }
​
    .card:hover .card__background,
    .card:focus-within .card__background {
        transform: scale(1.3);
    }
​
    .card:hover .card__content--container > :not(.card__title),
    .card:hover .card__button,
    .card:focus-within .card__content--container > :not(.card__title),
    .card:focus-within .card__button {
        opacity: 1;
        transition: opacity 500ms ease-in;
        transition-delay: 1000ms;
    }
​
    .card:hover .card__title::after,
    .card:focus-within .card__title::after {
        opacity: 1;
        transform: scaleX(1);
        transform-origin: left;
        transition: opacity 500ms ease-in, transform 500ms ease-in;
        transition-delay: 500ms;
    }
}
```

如此一来，在支持悬停的设备上，卡片的效果如下所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d26035ee5184cbf964f63d7fda6fc21~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJBpqB>

在不支持悬停的设备上，卡片组件不会有任何动效，同时用户可以访问到卡片上的所有有信息：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9db39ef207c4b3bbf1ca5d01787cef4~tplv-k3u1fbpfcp-zoom-1.image)

这两个示例告诉我们，在构建响应式 Web 应用或网站时，如果你希望元素在桌面端电脑或笔记本电脑上悬浮（`:hover`）效果，或者基于悬浮制作一些动画效果，那么就需要考虑到这样做在移动手机或平板上给用户带来的相关困惑，甚至是应用的不可用性。其最简单的解决方法是，**将元素悬浮状态下的效果都放置在** **`@media (hover:hover) {}`** **媒体查询块中**。

除此之外，像 iPhone 这样的移动手持设备虽然不支持鼠标悬浮，但可以使用触控笔或其他精确定位设备。针对于这样的场景，我们可以设置 `hover:none`，并且 `pointer:fine`，比如：

```CSS
@media (hover: none) and (pointer: fine) { 
    .box { 
        border: 5px solid #9f9; 
    } 
}
```

你也可以在一个悬停的设备上（`hover: hover`），但是有一个粗糙的指针（`pointer: coarse`）为元素指定不同样式：

```CSS
@media (hover: hover) and (pointer: coarse) { 
    .box { 
        border-radius: 50%; 
     } 
} 
```

另外，像 Will 控制器和 Kinect 等设备允许鼠标悬停（`hover: hover`），但指针很粗（`pointer: coarse`）。它们可以让你指着东西，但没有很高的精确度。你会想要足够大的目标，你可以添加悬浮效果作为他们指向的指示。

另外，有些设备是带有鼠标、触控版的设备。比如 Mac 电脑，iPad 等：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a26c645a8bc447609246d74e11dae3ed~tplv-k3u1fbpfcp-zoom-1.image)

对于这样的设备，我们可以这样来给元素指定样式：

```
@media (hover: hover) and (pointer: fine) { 
    .box { 
        border-radius: 50%; 
        border: 5px solid #89f; 
        background-color: orange; 
    } 
}
```

除了 `pointer` 和 `hover` 还有 `any-hover` 和 `any-pointer`。其中 `pointer` 和 `hover` 媒体特性为你提供有关指针设备的信息。但是，如果你同时拥有一个粗点和一个细点设备，比如带有触控笔的触摸屏。用户在这种设备上，可能会有一支手写笔，主要的指向设备仍然是触摸屏。对于这些情况，你可以使用 `any-hover` 和 `any-pointer` 。这将测试是否存在任何匹配标准的指向设备。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc56fb29c1344f579c44dba2faeb67b6~tplv-k3u1fbpfcp-zoom-1.image)

除了上面所列的媒体特性之外，更为有意思的是用户偏好媒体特性。我们将花一些篇幅着重来阐述它。

## 用户偏好媒体特性

用户喜好（偏好）是指根据用户自己个人喜好在设备系统中做一些设置。比如在 Mac 电脑上，根据自己喜好做一些设置：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b81f5543e3d4fde8009fad27c9595a9~tplv-k3u1fbpfcp-zoom-1.image)

现在在很多手持智能终端都给用户提供了一些设置。

[CSS Media Queries Level 5 ](https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences)中提供了一些用户喜好的媒体特性，这些特性可以识别出用户的喜好设置，从而调整 Web 应用的样式风格。也可以说，这些媒体特性主要是用来优化用户体验的。

到目前为止，规范中提供了六个有关于用户喜好的媒体特性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a37931f78c0d4972a501fbe76f067c6f~tplv-k3u1fbpfcp-zoom-1.image)

### prefers-reduced-motion

Web 页面或应用难免少不了用一些动效来点缀，但有些用户不喜欢这些动画效果，甚至对于少数用户来说，这些动效会让他们身体不适。这就是为什么现在大多数设备都支持一种方法让用户根据自己的喜好来做设置。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6648d841a874c01a61bb5c7dca411b7~tplv-k3u1fbpfcp-zoom-1.image)

使用 `prefers-reduced-motion` 媒体查询用于检测用户的系统是否被开启了动画减弱功能。该媒体查询特性接受两个值：

-   **`no-preference`**：用户未修改系统动画相关特性
-   **`reduce`**：这个值意味着用户修改了系统设置，将动画效果最小化，最好所有的不必要的移动都能被移除

下面的例子将会展示一组令人心烦的动画，不过当你开启了系统的“减少运动”后就能看到动画减弱的效果了。

```CSS
.pulse { 
    animation: pulse 2s infinite; 
} 
​
@media screen and (prefers-reduced-motion: reduce) { 
    .pulse { 
        animation: none; 
    } 
} 
```

![fig-43.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38f4fd6d38274f4ea4f2c3104c44c454~tplv-k3u1fbpfcp-watermark.image?)

示例效果演示的是 `prefers-reduced-motion` 媒体特性如何让 `animation` 停止，其实 CSS 的 `transition` 也可以实现动画效果，加上并不是所有设备对动效都有一个很好的性能支持（毕竟动效是较耗性能的），因此，我们可以像下面这样来写 CSS：

```CSS
@media screen and (prefers-reduced-motion: reduce), (update: slow) { 
    * { 
        animation-duration: 0.001ms !important; 
        animation-iteration-count: 1 !important; 
        transition-duration: 0.001ms !important; 
    } 
} 
```

这段代码强制所有使用动画持续时间或过渡持续时间声明的动画以人眼无法察觉的速度结束。当用户要求减少动画体验，或者设备屏幕刷新率较低时，比如廉价智能手机，它就能工作。

另外，@Eric Bailey 在他的文章《[Revisiting prefers-reduced-motion, the reduced motion media query](https://css-tricks.com/revisiting-prefers-reduced-motion/)》中提出了一个观点： “**并不是每一个可以访问网络的设备都可以呈现动画，或者流畅地呈现动画**。”

对于刷新率低的设备来说，可能会导致动画出现问题，比如动画卡顿。这样的话，删除动画可能是更好的选择。我们可以将 `prefers-reduced-motion` 和 `update` 结合在一起使用：

```CSS
@media screen and (prefers-reduced-motion: reduce), (update: slow) { 
    * { 
        animation-duration: 0.001ms !important; 
        animation-iteration-count: 1 !important; 
        transition-duration: 0.001ms !important; 
    } 
} 
```

这段代码强制所有使用 `animation-duration` 或 `transition-duration` 声明的动画以人眼难以察觉的速度结束。当一个人要求减少动效体验，或者设备有一个刷新率较低的屏幕，比如电子墨水或廉价的智能手机，它就能发挥作用。

但需要注意的是，使用动态减弱并不意味着“没有动效”，因为动效在 Web 页面中传达信息能起到至关重要的作用。相反，你应该使用一个坚实的、去除非必须的动效基础体验去引导这些用户，同时逐步增强没有此项偏好设置的其他用户的体验。

上面的代码对于 CSS 的 `animation` 和 `transition` 制作的动效有很好的控制，只要用户在设置中将减少动画选项选中，那么动效就会停止。但 Web 上还有很多动画效果，比如 JavaScript 制作的动画，Canvas，SVG 中的动画，上面的代码就无法控制了。不过我们可以使用媒体查询的 JavaScript API，即 `window.matchMedia` 在 JavaScript 中对媒体查询进行操作。

```JavaScript
function getPrefersReducedMotion() { 
    const QUERY = '(prefers-reduced-motion: no-preference)'; 
    const mediaQueryList = window.matchMedia(QUERY); 
    const prefersReducedMotion = !mediaQueryList.matches; 
    
    return prefersReducedMotion; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db50a934e9345778c7474bdfb86c144~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，如果用户在设置中没有勾选“减少动态效果”复选框，那么 `mediaQueryList.matches` 返回 `true`。记住，我们在代码中检测的是 `prefers-reduced-motion` 的 `no-preference`。如果用户勾选“减少动态效果”复选框，那么 `no-preference` 将为 `false`。因此，为了确定用户是否勾选“减少动态效果”复选框，我们使用 `!mediaQueryList.matches` 来反转这个布尔值。

另外，也可以使用事件监听来处理：

```JavaScript
const QUERY = '(prefers-reduced-motion: no-preference)'; 
const mediaQueryList = window.matchMedia(QUERY); 
const listener = event => { 
    const getPrefersReducedMotion = getPrefersReducedMotion(); 
}; 
​
mediaQueryList.addListener(listener); 
mediaQueryList.removeListener(listener); 
```

当用户在操作系统中切换“减少动态效果”复选框时，该侦听器将触发。我们想要监听这个事件，因为我们想要在用户勾选“减少动态效果”复选框时立即终止动画，即使页面已经加载或动画正在进行中。 如果你希望在 React 中使用的话，可以自定义一个“减少动态效果”相关的钩子函数：

```JavaScript
const QUERY = '(prefers-reduced-motion: no-preference)'; 
const getInitialState = () => ( !window.matchMedia(QUERY).matches ); 
​
function usePrefersReducedMotion() { 
    const [ prefersReducedMotion, setPrefersReducedMotion ] = React.useState(getInitialState); 
    
    React.useEffect(() => { 
        const mediaQueryList = window.matchMedia(QUERY); 
        
        const listener = event => { 
            setPrefersReducedMotion(!event.matches); 
        }; 
        
        mediaQueryList.addListener(listener); return () => { 
            mediaQueryList.removeListener(listener); 
        }; 
    }, []); return prefersReducedMotion; 
} 
```

### prefers-contrast prefers-contrast

媒体查询主要用于检测用户是否要求系统增加或减少相邻颜色之间的对比度。比如一些喜欢阅读电子书的用户，在阅读与文本背景对比度相差不大的文本时会遇到困难，他们更喜欢较大的对比度，利于阅读。

该媒体查询接受三个属性值：

-   **`no-preference`**：用户未向系统显式设置任何首选项。此关键字值在布尔上下文中计算为 `false`
-   **`high`**：用户更喜欢对比度较高的界面
-   **`low`**：用户更喜欢对比度较低的界面

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c09d677548a451cba58eca4a7ae3f66~tplv-k3u1fbpfcp-zoom-1.image)

比如像下面这个示例：

```CSS
.contrast { 
    background-color: #0958d8; 
    color: #fff; 
} 
​
@media (prefers-contrast: high) { 
    .contrast { 
        background-color: #0a0db7; 
    } 
}
```

### prefers-reduced-transparency

`prefers-reduced-transparency` 媒体特性用于检测用户是否要求系统最小化它所使用的透明或半透明层效果。换句话说，一些操作系统提供了减少系统使用透明或半透明分层效果的选项。该媒体查询特性接受的值：

-   **`no-preference`**：用户未向系统显式设置任何首选项
-   **`reduce`**：用户更喜欢最小化透明或半透明层效果的界面

用户可以使用这个来表示他们更喜欢在纯色上看东西，这通常是由于视觉障碍导致难以阅读文本，例如背景图像。但是它了可以帮助那些有阅读障碍或者注意力不集中的人更容易地阅读你的内容。

> **注意，它并没有说不透明。**

在实际中，你可以像下面这样使用：

```CSS
.transparency { 
    opacity: 0.5; 
} 
​
@media (prefers-reduced-transparency: reduce) { 
    .transparency { 
        opacity: 1; 
    } 
} 
```

另外，想要更少的透明度和想要更多的对比是不一样的，不应该被混为一谈。`prefers-reduced-transparency` 是由于不同的原因而存在的，并且可以得到不同的补偿。

### prefers-color-scheme

你可能知道了，macOS 系统和 iOS13 之后，苹果设备具备 Dark Mode 效果，就是用户可以根据自己的喜好来选择系统提供的色系：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a261cc1b3f334963986586ddebf60aeb~tplv-k3u1fbpfcp-zoom-1.image)

使用 `prefers-color-scheme` 查询特性可以让你对用户是否打开了设备上 Dark Mode 来做出响应。换句话说，给 Web 页面或应用添加 Dark Mode 只需要几行代码即可。首先我们默认加载的主题是亮色系，我们可以在 :root 中声明亮色系所需要的颜色，比如：

```CSS
:root { 
    --text-color: #444; 
    --background-color: #f4f4f4; 
}
```

然后通过媒体查询 `prefers-color-scheme: dark` 为暗色系重置所需要的颜色：

```CSS
@media screen and (prefers-color-scheme: dark) { 
    :root { 
        --text-color: rgba(255,255,255,.8); 
        --background-color: #121212; 
    } 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8ae29d3453a42e2a5c1f2ccd8f24d04~tplv-k3u1fbpfcp-zoom-1.image)

使用 `prefers-color-scheme` 来定制不同外观主题时，还可以和 `theme-color 以及 color-scheme` 结合起来使用。这将能控制系统应用的（比如浏览器）主题颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4403aa6021e7402093a18881587059b6~tplv-k3u1fbpfcp-zoom-1.image)

而 `color-scheme` 这个 CSS 属性和 `<meta>` 的 `name` 为 `theme-color` 是相同的。它们都是让开发者更容易根据用户的喜好设置来控制 Web 应用或页面的主题，即 **允许开发者根据用户喜好设置添加特定的主题样式**。其实 `color-scheme` 属性和相应的 `<meta>` 标签与 `prefers-color-scheme` 相互作用，它们在一起可以发挥更好的作用。最重要的一点是， **`color-scheme`** **完全决定了默认的外观，而** **`prefers-color-scheme`** **则决定了可样式化的外观** 。

假设你有下面这样的一个简单页面：

```HTML
<html>
    <head> 
        <meta name="color-scheme" content="dark light"> 
        <style> 
            fieldset { 
                background-color: gainsboro; 
            } 
            
            @media (prefers-color-scheme: dark) { 
                fieldset { 
                    background-color: darkslategray; 
                } 
            } 
        </style> 
    </head> 
    <body> 
        <p> Lorem ipsum dolor sit amet, legere ancillae ne vis. </p> 
        <form> 
            <fieldset> 
                <legend>Lorem ipsum</legend> 
                <button type="button">Lorem ipsum</button> 
             </fieldset> 
         </form> 
    </body>
</html> 
```

页面上 `<style>` 中的 CSS 代码，把 `<fieldset>` 元素的背景颜色设置为 `gainsboro`，如果用户更喜欢暗色模式，则根据 `prefers-color-scheme` 媒体查询，将 `<fieldset>` 的背景颜色设置为 `darkslategray`。

通过 `<meta name="color-scheme" content="dark light">` 元数据的设置，页面告诉浏览器，它支持深色（`dark`）和亮色（`light`）主题，并且优先选择深色主题。

根据操作系统是设置为深色还是亮色模式，整个页面在深色上显示为浅色，反之亦然，基于用户代理样式表。开发者没有额外提供 CSS 来改变段落文本或页面的背景颜色。

请注意，`<fieldset>` 元素的背景颜色是如何根据是否启用了深色模式而改变的，它遵循了开发者在页面上提供的内联样式表的规则。它要么是 `gainsboro`，要么是 `darkslategray`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ddf110515d44b7b8002d44b97dbf509~tplv-k3u1fbpfcp-zoom-1.image)

上图是亮色模式（`light`）下，由开发者和用户代理指定的样式。根据用户代理的样式表，文本是黑色的，背景是白色的。`<fieldset>` 元素的背景颜色是 `gainsboro`，由开发者在内联的式表中指定的颜色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eda33bbad06a4bc18f122b8deedbee2c~tplv-k3u1fbpfcp-zoom-1.image)

上图是暗色模式（`dark`）下，由开发者和用户代理指定的样式。根据用户代理的样式表，文本是白色的，背景是黑色的。`<fieldset>`元素的背景色是 `darkslategray`，由开发者在内联样式表中指定的颜色。

按钮 `<button>` 元素的外观是由用户代理样式表控制的。它的颜色被设置为 `ButtonText` 系统颜色，其背景颜色和边框颜色被设置为 `ButtonFace` 系统颜色。

现在注意 `<button>` 元素的边框颜色是如何变化的。`border-top-color` 和 `border-bottom-color` 的计算值从 `rgba(0,0,0,.847)`（偏黑）切换到 `rgba(255, 255, 255, .847)`（偏白），因为用户代理根据颜色方案动态地更新 `ButtonFace`。同样适用于 `<button>` 元素的 `color` 属性，它被设置为相应的系统颜色`ButtonText`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecea78906edf494a9328501c920a3c7a~tplv-k3u1fbpfcp-zoom-1.image)

看上去不错，但这也引出另一个新的概念，[系统颜色。](https://drafts.csswg.org/css-color/#css-system-colors)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d491a6d02fb4e4499818055493214d4~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，系统颜色已超出这节课的范畴，所以不在这里做过多的阐述。

### forced-colors

`forced-colors` 特性用于检测用户代理是否启用了强制颜色模式，该模式强制在页面上使用用户选择的有限颜色调色板。该特性支持两个属性值：

-   **`none`**：强制色彩模式不活跃，页面的颜色没有被限制在一个有限的调色板中
-   **`active`**：强制色彩模式已开启。UA将通过CSS系统颜色关键字为作者提供调色板，并在适当的情况下触发 `prefers-color-scheme` 的值，以便作者可以调整页面

比如下面这个示例：

```CSS
.colors { 
    background-color: red; 
    color: grey; 
} 
​
@media (forced-colors: active) { 
    .colors { 
        background-color: white; 
        color: black; 
    } 
}
```

### prefers-reduced-data

> 不是每个人都能幸运地拥有快速、可靠或无限的数据（流量）套餐。

你可能有过出差旅行的经历，也可能碰到了手机数据不够用，那么访问一个重图片的网站是很糟糕的（虽然说现在流量对于大家来说不是很大的事情，花钱总是能摆平的）。不过，一旦 `prefers-reduced-data` 得到支持，那么这个头痛的事情就可以避免了，也可以帮用户省下一定的费用。因为，该特性可以让用户跳过大图或高分辨率的图像。

```CSS
.image { 
    background-image: url("images/heavy.jpg"); 
} 
​
@media (prefers-reduced-data: reduce) { 
    .image { 
        background-image: url("images/light.avif"); 
    } 
} 
```

当用户在设备上开启了“Low Data Mode”（低数据模式），会加载占流量更低的 `light.avif` 图像，可以帮助 iPhone 上的应用程序减少网络数据的使用：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6cf18a1843447e6a3634482f93ae1bb~tplv-k3u1fbpfcp-zoom-1.image)

插个题外话，上面提到的这三个媒体查询特性（`prefers-color-scheme` 、`prefers-reduced-motion` 和 `prefers-reduced-data` ）主要是运用于 CSS 中，但它们还可以和 HTML 的 `<picture>` 元素的 `<source>` 标签元素结合起来使用。可以根据用户对设备的偏好设置来选择不同的图片源：

```HTML
<!-- 根据 prefers-color-scheme 为不同模式选择不同图片 --> 
<picture> 
    <source srcset="dark.png" media="(prefers-color-scheme: dark)" /> 
    <source srcset="light.png" media="(prefers-color-scheme: light)" /> 
    <img src="light.png" alt="" /> 
</picture> 
​
<!-- 根据 prefers-reduced-motion 为用户呈现动图或静态图 --> 
<picture> 
    <source srcset="animation.jpg" media="(prefers-reduced-motion: reduce)"> </source> 
    <img srcset="animation.gif" alt="" /> 
</picture> 
​
<!-- 根据 prefers-reduced-data 为用户选择不同的图片 --> 
<picture> 
    <source srcset="light.jpg" media="(prefers-reduced-data: reduce)" /> 
    <img src="heavy.jpg" alt="" srcset="heavy@2x.jpg 2x" /> 
</picture>
```

### light-level

`light-level` 媒体查询特性可以根据用户是在白天还是晚上来调整 Web 页面或应用的样式。该特性接受三个值：

-   **`dim`**：该设备是在昏暗的环境中使用的。在这种环境中，过高的对比度和亮度会分散读者的注意力或让用户阅读时眼睛不舒服
-   **`normal`**：该设备是在一个环境中使用的光水平在理想的范围内，这并不需要任何特定的调整
-   **`washed`**：该设备是在非常明亮的环境下使用的，导致屏幕被洗掉，难以阅读

我们到时可以像下面这样使用：

```CSS
@media (light-level: normal) { 
    p { 
        background: url("texture.jpg"); 
        color: #333; 
    } 
} 
​
@media (light-level: dim) { 
    p { 
        background: #222; 
        color: #ccc; 
    } 
} 
​
@media (light-level: washed) { 
    p { 
        background: white; 
        color: black; 
        font-size: 2em; 
    } 
} 
```

## 双屏幕和可折叠媒体查询特性

随着技术不断的发展，我们所面对的终端个性化越来越强，比如现在市场上已有或将有的双屏幕和可折叠屏幕设备：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac3143550d084ea786d0f8361b4a9447~tplv-k3u1fbpfcp-zoom-1.image)

大致主要分为两种类型，双屏可折叠设备（如 Microsoft Surface Duo）和单屏可折叠设备（如 Huawei Mate XS）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00cd5711485a4592a0b6a9893332d65f~tplv-k3u1fbpfcp-zoom-1.image)

在多屏幕或可折叠设备上，Web 应用或 Web 页面在这些设备上的打开姿势也将会有所不同，应用可以单屏显示，也可以跨屏显示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e17e71bdfbdc4724bc8aa6590fc5996c~tplv-k3u1fbpfcp-zoom-1.image)

换句话说，我们的应用或页面要具备这种跨越屏幕的能力，也要具备响应这种跨越的能力，以及还可能需要具备逻辑分隔内容的能力等。

可以说，多屏幕或折叠屏设备开启了更广阔的屏幕空间以及用独特的姿势将用户带入到另一个世界。针对于这种设备，除了用户之外，对于 Web 设计师，用户体验师和 Web 开发人员都需要重新面临解锁前所未有的 Web 体验。这也将是近十年来，Web 开发带来最大的变化之一，以及开发人员所要面临的最大挑战之一。

在这里我们针对多屏幕和折叠屏设备的响应，就称之为响应外形的需求。这也是响应式 Web 设计的一部分。

由于可折叠设备相对来说是新型设备，面对这些新型设备时很多开发者并没有做好相应的知识储备，甚至是不知道从何入手。

事实上呢？有些 Web 开发者已经开始在为我们制定这方面的 API ，除了 [三星（Samsung）](https://developer.samsung.com/internet) 的 [@Diego González](https://twitter.com/diekus)， [英特尔（Intel Corporation）](https://intel.com/) 的 [@Kenneth Rohde Christiansen](https://github.com/kenchris) 之外，还有[微软（Microsoft）](https://blogs.windows.com/msedgedev/)的 [@Bogdan Brinza](https://github.com/boggydigital)、[@Daniel Libby](https://github.com/dlibby-) 和 [@Zouhir Chahoud](https://github.com/Zouhir)。只不过对于 Web 开发者来说，现在这些制定的规范（CSS 相关的特性）和Web API（JavaScript API）还很新，不确定因素过多，甚至差异性也比较大。

到目前为止主要分为两个部分。其中一个部分是由微软（Microsoft）的 @Bogdan Brinza、@Daniel Libby 和 @Zouhir Chahoud 一起制定的，更适用于“有缝”的折叠处设备；另一部分是目前处于 [W3C 规范 ED 阶段的屏幕折叠 API ](https://w3c.github.io/screen-fold/)，它更适用于“无缝”的折叠设备。

[@argyleink](https://github.com/argyleink) 在 Github 上发起了一个[使用 CSS 媒体特性来检测折叠屏的讨论](https://github.com/w3c/csswg-drafts/issues/4141)。也就是说，Web 开发者可以使用 `@media` 相关的特性来识别折叠屏，为折叠屏的类型（比如“有缝”和“无缝”）提供相应的媒体查询。

比如，我们可以使用 `screen-spanning` 这个特性可以用来帮助 Web 开发人员检测“根视图”是否跨越多个相邻显示区域，并提供有关这些相邻显示区域配置的详细信息。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e7e41d4b2564cf78dbfff2ed89808ed~tplv-k3u1fbpfcp-zoom-1.image)

也可以使用 `screen-fold-posture` 和 `screen-fold-angle` 两个媒体查询来对无缝设备进行查询：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a4794703ad84a729b7639612e705ac5~tplv-k3u1fbpfcp-zoom-1.image)

还可以使用 `horizontal-viewport-segments` 和 `vertical-viewport-segments` 查询视口的数量：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16841a727c39442c8a7da080a2644f7e~tplv-k3u1fbpfcp-zoom-1.image)

`horizontal-viewport-segments` 和 `vertical-viewport-segments` 是最新的两个查询特性，它们将替代最初的 `screen-spanning` 这个媒体查询特性！

除此之外，还可以通过一些折叠姿势来进行查询：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38ce9e72d1d7421c8192908b8d8e0288~tplv-k3u1fbpfcp-zoom-1.image)

除了 CSS 媒体查询之外，还引入了六个新的 CSS 环境变量，以帮助开发者计算显示区域的几何形状，计算铰链区域被物理特征遮挡的几何形状：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/422130d014ab4b759222909b137c62d1~tplv-k3u1fbpfcp-zoom-1.image)

上图中展示的这六个 CSS 环境变量将替代以前的 `env(fold-top)`、`env(fold-left)`、`env(fold-width)` 和 `env(fold-height)`。

对于 Web 开发者来说，我们可以像下面这样来使用：

```CSS
/* 有缝折叠 */  
@media (spanning: single-fold-vertical) { 
    /* CSS Code... */  
} 
​
/* 无缝折叠 */  
@media (screen-fold-posture: laptop){ 
    /* CSS Code... */ 
} 
​
/* 折叠角度查询 */  
@media (max-screen-fold-angle: 120deg) { 
    /* CSS Code... */  
} 
​
/* 视口数量查询 */  
@media (horizontal-viewport-segments: 2) { 
    /* CSS Code... */  
} 
​
@media (vertical-viewport-segments: 2) { 
    /* CSS Code... */  
} 
```

在现代布局中，将这些媒体查询特性、CSS 环境变量和 CSS Grid 布局结合在一起，就可以很轻易地满足外形响应的需求变化。比如：

```CSS
:root { 
    --sidebar-width: 5rem; 
} 
​
@media (spanning: single-fold-vertical) { 
    :root { 
        --sidebar-width: env(viewport-segment-left 0 0); 
    } 
} 
​
main { 
    display: grid; 
    grid-template-columns: var(--sidebar-width) 1fr; 
} 
```


![014c267f-2d8c-4fda-b3f1-379c7d410b31.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/694b807b283c4aeba3773b7caee0c951~tplv-k3u1fbpfcp-watermark.image?)

@Stephanie 在她的最新博文《[Building Web Layouts For Dual-Screen And Foldable Devices](https://www.smashingmagazine.com/2022/03/building-web-layouts-dual-screen-foldable-devices/)》中也向大家提供了[一个示例](https://www.stephaniestimac.com/demos/smashing-ds-demo)，演示了按屏幕数量（`horizontal-viewport-segments: 2`）查询的示例：

```CSS
.recipe { 
    display: grid; 
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: minmax(175px, max-content); 
    grid-gap: 1rem; 
} 
​
.recipe-meta { 
    grid-column: 1 / 4; 
} 
​
img { 
    grid-column: 1 / 4; 
} 
​
.recipe-details__ingredients { 
    grid-row: 3; 
} 
​
.recipe-details__preparation { 
    grid-column: 2 / 4; 
    grid-row: 3;
} 
​
@media (horizontal-viewport-segments: 2) { 
    .recipe { 
        grid-template-columns: env(viewport-segment-width 0 0) 1fr 1fr; 
        grid-template-rows: repeat(2, 175px) minmax(175px, max-content); 
    } 
    
    .recipe-meta { 
        grid-column: 1 / 2; 
    } 
    
    img { 
        grid-column: 2 / 4; 
        grid-row: 1 / 3; 
    } 
    
    .recipe-details__ingredients { 
        grid-row: 2; 
    } 
    
    .recipe-details__preparation { 
        grid-column: 2 / 4; 
        grid-row: 3; 
    } 
} 
```

上面是从示例中截取的有关于布局的关键代码。最终效果如下：


![4751a64d-1894-41f3-bc9f-03d4a5b1209b.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b097636bd4d0402bbcb5050bd9b95661~tplv-k3u1fbpfcp-watermark.image?)

> Demo 地址：<https://stephaniestimac.com/demos/smashing-ds-demo/>

你可能会好奇，折叠屏的布局是如何完成的吧。如果上面的示例只是一个展示效果的话，接下来的这两个示例，我想能让你有更深入的体会。

先来看一个简单的示例，在 `body`上设置一个背景颜色：

```CSS
body { 
    background: orange;
}
```

在不同的终端上看到的效果如下（比如 PC 机显示器上，移动设备上和折叠设备）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e40a8397b8402e9c33fd5ae8543217~tplv-k3u1fbpfcp-zoom-1.image)

使用 `@media` 可以在手机上设置一个 `green` 背景色：

```CSS
@media (max-width: 540px) { 
    body { 
        background: green; 
    } 
}
```

这个时候，手机上的背景颜色变成了绿色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/545141d7f8304c1dba8a0ccc97a1056a~tplv-k3u1fbpfcp-zoom-1.image)

如果把 `screen-spanning` 媒体查询加进来，可以给折叠设备设置另一个背景颜色：

```CSS
@media (screen-spanning: single-fold-vertical) and (min-width: 541px) { 
    body { 
        background: yellow;
    } 
} 
```

这个时候，三种不同类型设备`body` 背景颜色将分别是 `orange`，`green` 和 `yellow`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c65cbcf48264898b77cf75e10015788~tplv-k3u1fbpfcp-zoom-1.image)

按类似的方式，我们可以使用 CSS 的 Grid、`env()` 和 `screen-spanning` 构建一个更复杂的布局。比如：

```HTML
<!-- HTML --> 
<head> 
    <script src="./sfold-polyfill.js"></script> 
    <script src="./spanning-css-polyfill.js"></script> 
</head> 
<body> 
    <div class="App"> 
        <div class="header">Header</div> 
        <div class="stories">Story Data</div> 
        <div class="content">Content</div> 
        <div class="related">Related</div> 
    </div> 
</body> 
```

添加相应的 CSS：

```CSS
body { 
    margin: 0; 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; 
    -webkit-font-smoothing: antialiased; 
    -moz-osx-font-smoothing: grayscale; 
} 
​
.App { 
    display: grid; 
    grid-template-columns: 10vw 67vw 20vw; 
    grid-template-rows: 5vh 60vh 33vh; 
    grid-template-areas: 
        "header    header    header" 
        "stories   content   related" 
        "stories   content   ."; 
    column-gap: 1vw; 
    row-gap: 1vh; 
} 
​
.header { 
    grid-area: header; 
    background-color: lime; 
} 
​
.stories { 
    grid-area: stories; 
    background-color: maroon; 
} 
​
.content { 
    grid-area: content; 
    background-color: mediumorchid; 
    overflow-y: auto; 
    min-height: 50vh; 
} 
​
.related { 
    grid-area: related; 
    background-color: mediumslateblue; 
}
```

在浏览器中打开这个页面，看到的效果会像下图这样：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19b771a5e6c24f8d8edb076c0919ee19~tplv-k3u1fbpfcp-zoom-1.image)

在上面基础上使用 `@media` 给 iPhone 和 iPad 中改变布局：

```CSS
/* phone layout portrait */ 
@media screen and (max-device-width: 480px) and (orientation: portrait) { 
    .App { 
        display: grid; 
        grid-template-columns: 100vw; 
        grid-template-rows: 10vh 10vh auto 10vh; 
        grid-template-areas: 
            "header" 
            "stories" 
            "content" 
            "related"; 
        column-gap: 1vw; 
        row-gap: 1vh; 
    } 
} 
​
/* tablet layout portrait */ 
@media screen and (min-device-width: 480px) and (max-device-width: 1200px) and (orientation: portrait) { 
    .App { 
        display: grid; 
        grid-template-columns: 25vw auto; 
        grid-template-rows: 10vh 80vh 8vh; 
        grid-template-areas: 
            "header   header" 
            "stories  content" 
            "stories  related"; 
        column-gap: 1vw; 
        row-gap: 1vh; 
        font-size: 2.4vh; 
     } 
}         
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a474bda27d449b1b2afe2e09501d3fd~tplv-k3u1fbpfcp-zoom-1.image)

使用 `screen-spanning`、`env()` 和 `calc()` 给像微软 Surface Due 这样的折叠设备添加样式：

```CSS
 /* 横向双屏布局 */ 
 @media (screen-spanning: single-fold-vertical) { 
     .App { 
         display: grid; 
         grid-template-columns: calc(env(fold-left) - 1vw) env(fold-width) calc( 100vw - env(fold-left) - env(fold-width) - 1vw ); 
         grid-template-rows: 5vh 60vh 33vh; 
         grid-template-areas: 
             "header   header  header" 
             "stories  .       content" 
             "related  .       content"; 
         column-gap: 1vw; 
         row-gap: 1vh;
     } 
} 
​
/* 纵向双屏 */ 
@media (screen-spanning: single-fold-horizontal) { 
    .App { 
        display: grid; 
        grid-template-columns: 60vw 39vw; 
        grid-template-rows: 9vh calc(env(fold-top) - 10vh - 2vh) env(fold-height) calc(99vh - env(fold-top) - env(fold-height) - 2vh); 
        grid-template-areas: 
            "header    header" 
            "stories   related" 
            ".         ." 
            "content   content"; 
        column-gap: 1vw; 
        row-gap: 1vh; 
    } 
} 
```

你可以在模拟器上看到像下图这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2c24bfbef7f4f44a8ea97ad1fced178~tplv-k3u1fbpfcp-zoom-1.image)

如果你感兴趣的话，可以使用折叠屏API中提供的 `screen-fold-posture` 或 `screen-fold-angle` 给像三星Galaxy Fold、三星 Galaxy Flip Z 折叠设备提供不同的布局效果。要是你有华为 Mate x 设备，也可以尝试着改写上面的 Demo，查看效果。

技术的变革是永无止境的，我们将来要面对的用户终端也绝不会仅现于目前能看到的终端设备和媒介，就好比现在运用于游戏行业的 VR（虚拟现实）和 AR（增强现实）设备。

虽然现在 VR 和 AR 用于其他行业的场景还很少见，但我们可以预见，在 VR 和 AR 设备越来越成熟和更多的设备发布之后，我们看到 VR 和 AR，就像我们已经看到几十年前的触摸屏设备一样。或许有一天，你设计（或开发）的 Web 页面或应用就能在 VR 和 AR 设备上有一个较好的呈现。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/822a50e4752e4a6a8a113ced610e22db~tplv-k3u1fbpfcp-zoom-1.image)

> 上图来自于《[UX Case Study: Metaverse Banking VR / AR Design Concept of the Future](https://www.theuxda.com/blog/how-online-banking-design-should-work-ux-case-study)》一文。UXDA的专业金融用户体验架构师和设计师团队向您介绍第一个混合现实银行概念，包括 VR 和 AR 银行设计、平板电脑、可穿戴设备、桌面和移动银行 UI / UX。

在这里，我想表达的是，未来的响应式 Web 设计要响应的外形需求可能会更丰富，更复杂。

## 自定义媒体查询特性

我们可能会在同一个文档中多个地方使用相同的媒体查询，多次重复使用相同的媒体查询会造成编辑风险。为了让Web 开发者避免这种风险的存在，CSS 媒体查询提供了另一种媒体特性，即**自定义媒体查询**。特别是对于更长的，更复杂的媒体查询，自定义媒体查询可以简单为媒体查询命名别名。通过这种方式，可以将在多个地方使用的媒体查询分配给可在任何地方使用的自定义媒体查询，同时 Web 开发者在编辑媒体查询时只需要修改一行代码。

对于自定义的媒体查询，我们一般使用 `@custom-media` 做为前缀来定义：

```CSS
 @custom-media = @custom-media <extension-name> [ <media-query-list> | true | false ] ;
```

比如：

```CSS
@custom-media --small-viewport (max-width: 30em); 
​
@media (--small-viewport) { 
    body { 
        color: #90f 
    } 
}
```

## 小结

在这节课中，我们主要探讨了 CSS 媒体查询的查询范围的新语法、媒体特性、用户偏好媒体特性、设备外形媒体特性和自定义媒体特性等。事实上，CSS 媒体查询涵盖的知识体系是庞大的，这节课主要选择了较新的、而且更有意义的部分。从课程中的内容中我们可以发现，掌握好 CSS 媒体查询相关的知识之后，除了能快速、更好构建了同一个响应式 Web 应用或网站之外，我们还可以使用 CSS 媒体查询为用户提供更好的体验，比如使用用户偏好媒体特性，为用户提供喜好性的应用。