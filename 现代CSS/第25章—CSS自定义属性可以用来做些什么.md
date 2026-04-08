当我第一次开始使用 CSS 自定义属性时，我并没有完全意识到它的潜力。如果使用得当，我们可以减少在 CSS 中做特定事情的时间和精力。一旦你习惯了，你就会更容易坚持下去。这节课的目标是重点关注 CSS 自定义属性的有用用例，这些用例不仅仅与 Web 应用或网站的皮肤有有关，它还和 Web 组件有关。整节课将会引导你了解 CSS 自定义属性发挥作用的用例。让我们开始吧!

## 简单用例

我们先从几个简单而且实用的用例开始！

### 拆分值

在 CSS 中，我们有很多函数可以用来描述一个颜色，比如我们熟悉的 `hsl()` 和 `rgb()` 函数，以及一些描述颜色的新函数，例如 `oklab()` 、`oklch()` 和 `color()` 等。以往我们都是在整个函数中传入描述颜色各通道的值，例如：

```CSS
.element {
    background-color: hsl(120 50% 50% / 1);
}
```

现在，使用 CSS 自定义属性，我们可以像下面这样来描述一个颜色：

```CSS
.element {
    background-color: hsl(
        var(--h, 120)
        var(--s, 50%)
        var(--l, 50%)
        /
        var(--a, 1);
    )
}
```

这样做的好处是，如果我们要在不同状态下调整颜色时，只需要改变其中一个值。例如，在 `dark` 模式下，将颜色的色相值调整到 `20` ，我们可以像下面这样做：

```CSS
@media (prefers-color-scheme: dark) {
    .element {
        --l: 20;
    }
}
```

### 简写属性

如果你正在使用诸如 `animation` 之类的简写属性，并且在不同状态下更改其中一个值，那么再次写出整个属性可能容易出错，并且会增加代码维护的成本。使用自定义属性，我们可以很容易地调整简写属性中的单个值：

```CSS
.element {
    animation: 
        var(--animationName, pulse) 
        var(--duration, 2000ms) 
        ease-in-out
        infinite;
}
​
.element.faster {
    --duration: 500ms;
}
​
.element.shaking {
    --animationName: shake;
}
```

### 重复的值

假设我们有一个元素，在浏览器屏幕宽度小于 `50em` 时，它的 `padding` 值为 `120px 20px 20px` ；但浏览器屏幕宽度大于 `50em` 时，它的 `padding` 值为 `120px 60px 60px` 。你可能会像下面这样来写 CSS 代码：

```CSS
.element {
    padding: 120px 20px 20px;
}
​
@media only screen and (width > 50em) {
    .element {
        padding: 120px 60px 60px;
    }
}
```

这样写 CSS 可能有点乏味，特别是要调整内距值的时候。

使用 CSS 自定义属性就要方便的多，我们只在一个地方就可以调整内距值。更好的是，如果它是整个站点使用的标准值，那么我们可以在变量部分、配置文件或站点的设计令牌（Design Token）中声明它。

```CSS
:root {
    --pad: 20px;
}
​
@media only screen and (width > 50em) {
    :root {
        --pad: 60px;
    }
}
​
.element {
  padding: 120px var(--pad) var(--pad);
}
```

### 复杂的计算

CSS 自定义属性对于存储计算值（来自 `calc()` 函数）非常方便，这些值本身甚至可以从其他自定义属性中计算出来。例如，我需要计算相对于另一个路径或相对于已知变量的路径，我经常在 `clip-path` 属性上使用 CSS 自定义属性。下面这个代码，演示了计算两个伪元素的 `clip-path` 的点，以显示被分割的元素外观。

```CSS
.element {
    --top: 20%;
    --bottom: 80%;
    --gap: 1rem;
    --offset: calc(var(--gap) / 2);
}
​
.element::before {
    clip-path: polygon(
        calc(var(--top) + var(--offset)) 0,
        100% 0,
        100% 100%,
        calc(var(--bottom) + var(--offset)) 100%
    );
}
​
.element::after {
    clip-path: polygon(
        calc(var(--top) - var(--offset)) 0,
        calc(var(--bottom) - var(--offset)) 100%,
        0 100%,
        0 0
    );
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/384377291013428fbb4ebad043f1b4b8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQGMKQ>

我们还可以使用相似的方法来调整元素尺寸大小。比如下面这个简单的示例，只需要调整 `--size` 的大小，就能看到用户头像也跟着变化：

```CSS
.avatar { 
    display: inline-flex; 
    justify-content: center; 
    align-items: center; 
    --size: 1; 
    width: calc(var(--size) * 30px); 
    height: calc(var(--size) * 30px); /* 或aspect-ratio: 1/1 */ 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3079117eaef645b79d4c218c5454ae29~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/pen/KKrXaGg>

将 CSS 自定义属性和 `calc()` 结合起来，我们还可以实现以前认为比较难的布局效果，比如下图演示的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a9506dd43764c4dab5c6fdc486615ff~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQPRQy>

实现上图效果仅仅几行代码即可：

```CSS
:root { 
    --margin: 20px; 
    --aspect-width: 4; 
    --aspect-height: 3; 
    --constant: calc( var(--margin) * var(--aspect-width) / (var(--aspect-height) * 3) ); 
} 
​
.thumbnails { 
    padding: var(--margin); 
} 
​
.thumbnails__aside { 
    margin-right: var(--margin); 
    width: calc(2 / 3 * (100% - var(--margin)) + var(--constant)); 
} 
​
.right { 
    width: calc(1 / 3 * (100% - var(--margin)) - var(--constant)); 
} 
​
.thumbnails__aside--bottom { 
    margin-top: var(--margin); 
} 
```

甚至还可以使用它们的结合来构建反转一个二次贝塞尔曲线函数 `cubic-bezier()`。为了反转动画的缓动曲线，我们需要在它的轴上旋转 `180` 度，找到一个全新的坐标。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebff1067405b4f239091d88a16311c02~tplv-k3u1fbpfcp-zoom-1.image)

如果缓动曲线的初始坐标为 `x1` 、 `y1` 、`x2` 、`y2`，那么反转之后的坐标即为 `(1-x2)` 、 `(1-y2)` 、 `(1-x1)` 、 `(1-y1)`。既然知道了基本原理之后，我们同样可以借助 CSS 自定义属性，用代码来表示：

```CSS
:root { 
    --x1: 0.45; 
    --y1: 0.25; 
    --x2: 0.6; 
    --y2: 0.95; 
    --originalCurve: cubic-bezier(var(--x1), var(--y1), var(--x2), var(--y2)); 
}
```

根据上面的公式，可以计算出反转后的缓动曲线：

```CSS
:root { 
    --reversedCurve: cubic-bezier(
        calc(1 - var(--x2)), 
        calc(1 - var(--y2)), 
        calc(1 - var(--x1)), 
        calc(1 - var(--y1))
    ); 
} 
```

为了更易于理解，把上面的代码稍作调整：

```CSS
:root { 
    /* 原始坐标值 */ 
    --x1: 0.45; 
    --y1: 0.25; 
    --x2: 0.6; 
    --y2: 0.95; 
    
    --originalCurve: cubic-bezier(var(--x1), var(--y1), var(--x2), var(--y2)); 
    
    /* 反转后的坐标值 */ 
    --x1-r: calc(1 - var(--x2)); 
    --y1-r: calc(1 - var(--y2)); 
    --x2-r: calc(1 - var(--x1)); 
    --y2-r: calc(1 - var(--y1)); 
    
    --reversedCurve: cubic-bezier(var(--x1-r), var(--y1-r), var(--x2-r), var(--y2-r)); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0713f948d8064f44b74ab490ea058120~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/QWJqdoE>

### 使用 CSS 自定义属性来存储值

我们平时在编写 CSS 代码的时候，有些属性的值过于偏长，比如像 CSS 的渐变：

```CSS
.linear-gradent { 
    background-image: linear-gradent(to right, #09f, #f90); 
} 
​
.repeating-conic-gradient{ 
    background-image: repeating-conic-gradient(to right,#ff8a00 10%,#e52e71 20%); 
} 
​
.radial-gradient { 
    background-image: radial-gradient(#ff8a00, #e52e71); 
 } 
 
.repeating-radial-gradient { 
     background-image: repeating-radial-gradient(circle, #ff8a00 10%, #e52e71 20%); 
 } 
 
.conic-gradient { 
     background-image: conic-gradient(#ff8a00, #e52e71); 
} 
​
.repeating-conic-gradient { 
    background-image: repeating-conic-gradient(#ff8a00 10%, #e52e71 20%); 
} 
```

如果你有一个在整个系统中使用的渐变，那将它存储到一个 CSS 自定义属性中，可以让你在多次使用时变得更容易，比如：

```CSS
:root { 
    --linear-gradient: linear-gradent(to right, #09f, #f90); 
} 
​
.linear-gradient { 
    background-image: var(--linear-gradient); 
}
```

甚至还可以把其中的参数用 CSS 自定义属性来描述，比如：

```CSS
.element { 
    --angle: 150deg; 
    --gradient-color: #235ad1, #23d1a8; 
    --linear-gradient: linear-gradient(var(--angle), var(--gradient-color)); 
    
    background-image: var(--linear-gradient); 
} 
​
.element.inverted { 
    --angle: -150deg; 
} 
​
.element.change-color { 
    --gradient-color: red, yellow, lime, aqua, blue, magenta, red; 
}
```

这样一来，只需要改变渐变中的某个参数就可以得到新的渐变效果，而且不需要重新写整个渐变的样式代码。

## 复杂用例

接下来，我们来看一些更复杂的用例。

### Web 组件优化

Web 组件（或者说 UI 组件）在 Web 中是最可见之一，使用 CSS 自定义属性可以让组件的代码变得更简单。拿[Bootstrap 的 Button 举例](https://getbootstrap.com/docs/5.0/components/buttons/)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58392cf64def402a8fb2d7b40f842a1d~tplv-k3u1fbpfcp-zoom-1.image)

以 Primary 按钮为例，它对应的 CSS 代码如下：

```CSS
.btn { 
    color: #212529; 
    background-color: transparent; 
    border-color: transparent; 
} 
​
.btn:hover { 
    color: #212529; 
} 
​
.btn:focus { 
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / .25); 
} 
​
.btn-primary { 
    color: #fff; 
    background-color: #0d6efd; 
    border-color: #0d6efd; 
} 
​
.btn-primary:hover { 
    color: #fff; 
    background-color: #0b5ed7; 
    border-color: #0a58ca; 
} 
​
.btn-primary:focus { 
    color: #fff; 
    background-color: #0b5ed7; 
    border-color: #0a58ca; 
    box-shadow: 0 0 0 0.25rem rgb(49 132 253 / .5); 
} 
​
.btn-primary:active { 
    color: #fff; 
    background-color: #0a58ca; 
    border-color: #0a53be; 
}
```

不难发现，`button` 在默认状态、 `:active`、`:focus` 和 `:hover` 状态，变化的只是 `color`、`background-color`、`border-color` 和 `box-shadow` 等属性。如果我们换作 CSS 自定义属性来构建的话，代码会变得更简洁：

```CSS
:root {
    --btn-color: #212529;
    --btn-hover-color: #212529;
    --btn-bgcolor: transparent;
    --btn-hover-bgcolor: transparent;
    --btn-hover-border-color: transparent;
    --btn-border-color: transparent;
    --btn-box-shadow: rgb(13 110 253 / 0.25);
    --btn-active-bgcolor: transparent;
    --btn-active-border-color: transparent;
}
​
.btn {
    color: var(--btn-color);
    background-color: var(--btn-bgcolor);
    border: 1px solid var(--btn-border-color);
}
​
.btn:hover {
    color: var(--btn-hover-color);
    border-color: var(--btn-hover-border-color);
    background-color: var(--btn-hover-bgcolor);
}
​
.btn:focus {
    box-shadow: 0 0 0 0.25rem var(--btn-box-shadow);
}
.btn:active {
    border-color: var(--btn-active-border-color);
    background-color: var(--btn-active-bgcolor);
}
```

在不同状态，比如 `.btn-primary`、`.btn-secondary` 下只需要调整相应的自定义属性的值即可：

```CSS
.btn-primary {
    --btn-color: #fff;
    --btn-bgcolor: #0a58ca;
    --btn-border-color: #0a58ca;
    --btn-box-shadow: rgb(49 132 253 / 0.5);
    --btn-active-bgcolor: #0a58ca;
    --btn-active-border-color: #0a53be;
    --btn-hover-color: #fff;
    --btn-hover-bgcolor: #0b5ed7;
    --btn-hover-border-color: #0a58ca;
}
​
.btn-secondary {
    --btn-color: #fff;
    --btn-bgcolor: #6c757d;
    --btn-border-color: #6c757d;
    --btn-box-shadow: rgb(130 138 145 / 0.5);
    --btn-active-bgcolor: #565e64;
    --btn-active-border-color: #51585e;
    --btn-hover-color: #fff;
    --btn-hover-bgcolor: #5c636a;
    --btn-hover-border-color: #565e64;
}
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1c724437e1f48ed9bb33d4004fe8819~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwMjzN>

使用 CSS 自定义属性，是不是比以前省事多了。这样做并不是说 CSS 自定义属性帮助开发者节约了多少代码或更易于维护，其真正的价值是：**自定义属性让我们能够共享代码，让其他开发者可以重用或定制**。比如说，我们可将一个 `button` 可变参数提取出来，并将这些参数设置为 CSS 自定义属性，那么就可以很好的调整（自定义地构建个性化）按钮的 UI 效果。

### 控制组件大小

在 CSS Frameworks 中很多组件都提供了相应的类名来控制组件大小，比如我们熟悉的 [Bootstrap 中的按钮组件](https://getbootstrap.com/docs/5.0/components/buttons/)，有`btn-lg`、`btn-sm` 类来调整组件的 `padding` 值，CSS Frameworks 新起之秀 [Tailwindcss](https://tailwindcss.com/docs/padding) 提供了更多类名来调整组件大小：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f49d393ef6fd4f368fe055c0e54ad203~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，通过调整组件的 `padding` 可以非常容易调整组件内距从而改变组件大小：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4133802edd04042b31bf87bc62ea4b1~tplv-k3u1fbpfcp-zoom-1.image)

但往往影响组件大小并不仅仅是因为其尺寸属性 （比如 `padding`、`width`、`height` 和 `font-size` 等）的设置，还和属性取值的单位也有紧密关系。比如，使用 `em` 单位，可以很好的调整组件组件大小。

而有了 CSS 自定义属性之后，我们可以更灵活的控制组件的大小：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/846c650f81b143a295a16af04ea9264f~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，我们可以基于 CSS 自定义属性来调整 `font-size` 的值来改变组件大小，不过该方式有一个前提条件，那就是涉及到控制组件大小的属性（具有 `<length>` 的属性，比如 `width`、`padding`等）应该使用 `em` 来做单位（`rem` 勉强也行）。我们使用这些方法来构建上图这样的卡片组件。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02b7ca1df90143d88764a8021e70c5d1~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQGLYW>

实现该效果最为关键的是在 `html` 中设置了 `font-size` 值为 `%` 值，它相对于 `16px` 做计算，同时我们在 `.card` 上设置的 `font-size` 值是 `rem` 值，它相对于 `html` 的 `font-size` 计算，另外在侧边栏 `aside` 调整自定义属性 `--fs` 的值，从而影响其 `font-size` 值的大小：

```CSS
:root { 
    --fs: 1rem; 
    --root-fs: 100%; 
} 
​
html { 
    font-size: var(--root-fs); 
} 
​
.card { 
    font-size: var(--fs); 
} 
​
aside { 
    --fs: 0.65rem; 
}
```

另一个要点是，组件上的元素属性的值单位采用的都是 `em` 为单位，而 `em` 又是相对于自己 `font-size` 值计算，如果元素自已并未显式设置 `font-size`，则会继承其父元素（祖先元素）的 `font-size`：

```CSS
.card { 
    max-width: 25em; 
    box-shadow: 0 0 0.25em -0.15em rgb(255 255 255 / 0.65); 
    border-radius: 0.25em; 
    border: 0.025em solid rgb(255 255 255 / 0.65); 
} 
​
.card__thumbnail { 
    border-radius: 0.275em 0.275em 0 0; 
    overflow: hidden; 
} 
​
.card__thumbnail img { 
    border-radius: 0.275em 0.275em 0 0;
} 
​
.card__body { 
    font-size: 1.125em; 
    padding: 1em 1.25em; 
} 
​
.card__title { 
    font-size: 1.5em; 
    margin: 0 0 0.5em; 
} 
​
.card__content { 
    font-size: 1.025em; 
} 
​
.card__footer { 
    padding: 0.6em 1.25em 1.2em; 
}
```

### CSS 自定义属性给颜色使用带来的变化

在 Web 应用中，很多时候希望能很好的实现换肤效果。比如下面这个效果，用户调整颜色时对应的插画颜色也会有所调整：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbc49d68b75942c9a4b4d3050c60c2f7~tplv-k3u1fbpfcp-zoom-1.image)

CSS 自定义属性结合 JavaScript 可以很好的实现这样的效果。[复制 unDraw 中的一个插画](https://undraw.co/illustrations)，查看代码，我们可以发现 SVG 中图形中使用 `fill` 来填充图形颜色：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/413929d6be6c497c97bbcabad8aa0bf1~tplv-k3u1fbpfcp-zoom-1.image)

在 SVG 的元素上稍作调整，比如添加类名：

```SVG
<path d="M980.94772,659.04355h-743a1,1,0,0,1,0-2h743a1,1,0,0,1,0,2Z" transform="translate(-218.05228 -135.88181)" fill="#3f3d56" class="seat__fill"></path> 
```

并添加所需的 CSS 代码：

```CSS
:root { 
    --primary-fill-color: #6c63ff; 
    --secondary-fill-color: #2f2e41; 
    --leaf-fill-color: #f2f2f2; 
    --leaf-fill-color-2: #e6e6e6; 
    --seat-fill-color: #3f3d56; 
} 
​
.primary__fill { 
    fill: var(--primary-fill-color); 
} 
​
.secondary__fill { 
    fill: var(--secondary-fill-color); 
} 
​
.leaf__fill { 
    fill: var(--leaf-fill-color); 
} 
​
.leaf__fill--secondary { 
    fill: var(--leaf-fill-color-2); 
} 
​
.seat__fill { 
    fill: var(--seat-fill-color); 
} 
```

调整对应的 CSS 自定义属性的值就可以调整 SVG 图形的颜色。为此，我们使用 JavaScript 操作 CSS 自定义属性相关的 API 可以让用户操作颜色控制面板来调整插画的颜色：

```JavaScript
const svgEle = document.querySelector("svg"); 
const inputColors = document.querySelectorAll('input[type="color"]'); 
​
inputColors.forEach((element) => element.addEventListener("input", (evt) => { 
    svgEle.style.setProperty(`--${evt.target.id}`, evt.target.value);
})); 
```

请尝试调整示例中颜色，你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7cceea1fceb4ea9a087acfd6df183d4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKrXNVG>

这种方式用于更换 SVG 图标颜色也是非常实用。其中还需借助 CSS 的 `currentColor` 特性和 SVG 的 `fill` 的值相结合：

```SVG
<svg fill="currentColor"> 
    <path fill="currentColor" /> 
</svg>
```

此时，`color` 的值将会影响 SVG 元素的 `fill` 值。将 CSS 自定义属性的和 `color` 结合起来：

```CSS
:root { 
    --h: 180; 
    --s: 50; 
    --l: 50; 
} 
​
.icon__container { 
    color: hsl(var(--h), calc(var(--s) * 1%), calc(var(--l) * 1%)); 
} 
​
.icon__container:nth-child(1) { 
    --h: 232; 
} 
​
.icon__container:nth-child(2) { 
    --s: 22; 
} 
​
.icon__container:nth-child(3) { 
    --l: 60; 
} 
```

效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7de5e61165fc4c649db7b38bd4ad5f41~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/YzRrpWN>

该原理也常用于 Web 换肤中，比如 [@Jonathan Harrell 使用CSS自定义属性实现的一个简单的皮肤编辑器](https://codepen.io/jonathanharrell/full/EdawEq)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87acd842131246b08b2ead060ba24b0b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxJbGO>

基于这个特性，结合 CSS 新的媒体查询特性的 `prefers-color-scheme` 可以轻易实现 iOS 的暗黑模式的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27bda0780b7d4935b67d556cc3facb07~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzEbjx>

CSS 自定义属性在颜色上的使用，除了上面提到的这几个常用场景之外，还可以用来构建颜色面板：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53bcbc80a093433facbd5e310af14903~tplv-k3u1fbpfcp-zoom-1.image)

将 CSS 自定义属性特性引入进来，构建系统化的颜色表会变得更为容易。比如下面示例中左侧的颜色列表，亮度 `L` 是 `50%`，饱和度 `S` 按 `10%` 递增；右侧的颜色列表，亮度 `L` 是按 `10%` 递增，饱和度 `S` 是 `100%`；用户拖动示例中的滑块，可以改变色相 `H` 的值：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a798003a58ff4308800048cfe5aaacef~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzEbbR>

在实际案例中，可以像下面这样使用：

```CSS
:root { 
    --primary-h: 221; 
    --primary-s: 71%; 
    --primary-b: 48%; 
} 
​
.button { 
    background-color: hsl(var(--primary-h) var(--primary-s) var(--primary-b)); 
    transition: background-color 0.3s ease-out; 
} 
​
.button:hover { 
    --primary-b: 33%; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/312bed0636ad474d9e285ce0ad912ab1~tplv-k3u1fbpfcp-zoom-1.image)

在颜色中使用色相选色有很多好处，这也是 `hsl` 的主要优势之一。在使用颜色的时候，CSS 自定义属性来定义 HSL 中的每个值的优势从上面的示例中可以体现出来。除此之外，还可以快速构建补色位。补色位于色轮上的对面。因此，如果你从一个颜色开始，你想得到它的补色，只需要在色相的值上增加 `180°`。

```CSS
:root { 
    --h: 257; 
    --complementary-h: calc(var(--h) + 180); /* calc(var(--h) - 180)*/ 
    --s: 26%; 
    --l: 42%; 
    --primary-color: hsl(var(--h) var(--s) var(--l)); 
    --complementary-color: hsl(var(--complementary-h) var(--s) var(--l)); 
}
```

除此之外，还可以像下图所示，通过加（或减）`120°` 来创建三元色方案，也可以用 `30°` 分隔色调来创建类似的色彩组合：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9037113f6504518ad8677a5befdba17~tplv-k3u1fbpfcp-zoom-1.image)

可以像下面这样使用 CSS 自定义属性来操作颜色：

```CSS
:root { 
    /* 初始化颜色的hsl值 */ 
    --h: 180; --s: 50%; 
    --l: 50%; 
    
    /* 设置互补色的分割粒度 */ 
    --splitter: 30; 
    
    /* 改变深色和亮色变体的亮度和饱和度 */ 
    --shader: 15%; 
    
    /* 计算每个颜色操作的色调值 */ 
    --hueNext: calc(var(--h) + 30); 
    --huePrev: calc(var(--h) - 30); 
    --hueComp: calc(var(--h) + 180); 
    --hueTriad1: calc(var(--h) + 120); 
    --hueTriad2: calc(var(--h) + 120 + 120); 
    --hueTet1: calc(var(--h) + 90); 
    --hueTet2: calc(var(--h) + 90 + 90); 
    --hueTet3: calc(var(--h) + 90 + 90 + 90); 
    --hueSplitComp1: calc(var(--hueComp) + var(--splitter)); 
    --hueSplitComp2: calc(var(--hueComp) - var(--splitter)); 
    
    /* 计算每个颜色操作的色调值 */ 
    --satDarker: calc(var(--s) + var(--shader)); 
    --satLighter: calc(var(--s) - var(--shader)); 
    
    /* 计算深色和亮色变体的亮度值 */ 
    --lightDarker: calc(var(--l) - var(--shader)); 
    --lightLighter: calc(var(--l) + var(--shader)); 
    
    /* 计算主色及其深色和亮度的变体 */ 
    --mainColor: hsl(var(--h) var(--s) var(--l)); 
    --mainColorDarker: hsl(var(--h) var(--satDarker) var(--lightDarker)); 
    --mainColorLighter: hsl(var(--h) var(--satLighter) var(--lightLighter)); 
    
    /* 计算相邻的颜色及其深色和亮色的变体 */ 
    --nextColor: hsl(var(--hueNext) var(--s) var(--l)); 
    --nextColorDarker: hsl(var(--hueNext) var(--satDarker) var(--lightDarker)); 
    --nextColorLighter: hsl(var(--hueNext) var(--satLighter) var(--lightLighter)); 
    --prevColor: hsl(var(--huePrev) var(--s) var(--l)); 
    --prevColorDarker: hsl(var(--huePrev) var(--satDarker) var(--lightDarker)); 
    --prevColorLighter: hsl(var(--huePrev) var(--satLighter) var(--lightLighter)); 
    
    /* 计算补色及其深色和亮色的变体 */ 
    --compColor: hsl(var(--hueComp) var(--s) var(--l)); 
    --compColorDarker: hsl(var(--hueComp) var(--satDarker) var(--lightDarker)); 
    --compColorLighter: hsl(var(--hueComp) var(--satLighter) var(--lightLighter)); 
    
    /* 计算相似的颜色（1 & 2）和它们的深色和亮色的变体 */ 
    --analgColor1: var(--nextColor); 
    --analgColor1Darker: var(--nextColorDarker); 
    --analgColor1Lighter: var(--nextColorLighter); 
    --analgColor2: var(--prevColor); 
    --analgColor2Darker: var(--prevColorDarker); 
    --analgColor2Lighter: var(--prevColorLighter); 
    
    /* 计算三和色（1 & 2）和它们的深色和亮色的变体 */ 
    --triadColor1: hsl(var(--hueTriad1) var(--s) var(--l)); 
    --triadColor1Darker: hsl(var(--hueTriad1) var(--satDarker) var(--lightDarker)); 
    --triadColor1Lighter: hsl(var(--hueTriad1) var(--satLighter) var(--lightLighter)); 
    --triadColor2: hsl(var(--hueTriad2) var(--s) var(--l)); 
    --triadColor2Darker: hsl(var(--hueTriad2) var(--satDarker) var(--lightDarker)); 
    --triadColor2Lighter: hsl(var(--hueTriad2) var(--satLighter) var(--lightLighter)); 
    
    /* 计算四次元颜色（1-3）和它们的深色和亮色的变体 */ 
    --tetColor1: hsl(var(--hueTet1) var(--s) var(--l)); 
    --tetColor1Darker: hsl(var(--hueTet1) var(--satDarker) var(--lightDarker)); 
    --tetColor1Lighter: hsl(var(--hueTet1) var(--satLighter) var(--lightLighter)); 
    --tetColor2: hsl(var(--hueTet2) var(--s) var(--l)); 
    --tetColor2Darker: hsl(var(--hueTet2) var(--satDarker) var(--lightDarker)); 
    --tetColor2Lighter: hsl(var(--hueTet2) var(--satLighter) var(--lightLighter)); 
    --tetColor3: hsl(var(--hueTet3) var(--s) var(--l)); 
    --tetColor3Darker: hsl(var(--hueTet3) var(--satDarker) var(--lightDarker)); 
    --tetColor3Lighter: hsl(var(--hueTet3) var(--satLighter) var(--lightLighter)); 
    
    /* 计算分色补色（1 & 2）和它们的深色和亮色的变体 */ 
    --splitCompColor1: hsl(var(--hueSplitComp1) var(--s) var(--l)); 
    --splitCompColor1Darker: hsl(var(--hueSplitComp1) var(--satDarker) var(--lightDarker)); 
    --splitCompColor1Lighter: hsl(var(--hueSplitComp1) var(--satLighter) var(--lightLighter)); 
    --splitCompColor2: hsl(var(--hueSplitComp2) var(--s) var(--l)); 
    --splitCompColor2Darker: hsl(var(--hueSplitComp2) var(--satDarker) var(--lightDarker)); 
    --splitCompColor2Lighter: hsl(var(--hueSplitComp2) var(--satLighter) var(--lightLighter)); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/944ea342beec4b6da9c0bfaaad8b14e7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOwNXj>

### 按比例调整元素尺寸大小

熟悉设计软件的同学都应该知道，我们在绘制图形的时候，按住 `shift` 键拖动图形的角标可以让图形按宽高比进行缩放（调整元素尺寸大小），或者像 Figma 的设计软件中，点击 `W` 和 `H` 之间的锁锁住宽高比，然后随意调整 `W` 或 `H` 都可以让元素按宽高比调整尺寸大小。

而在 CSS 中，`aspect-ratio` 属性可以让我们轻易地实现元素尺寸大小按宽高比来调整。比如下面这个示例：

```CSS
:root { 
    --ratio-w: 1; 
    --ratio-h: 1; 
    --ratio: calc(var(--ratio-w) / var(--ratio-h)); 
    --width: 10rem; 
    --height: 10rem; 
} 
​
.box { 
    width: var(--width); 
    aspect-ratio: var(--ratio); 
} 
​
.box2 { 
    heght: var(--height); 
    aspect-ratio: var(--ratio); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3af8c4d6ae5347fc9ca48a6effcec2a8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOwNvj>

`aspect-ratio` 是众多 CSS 新特性之一。不过，我们可以使用 CSS 自定义属性来实现相似的功能。比如说我们希望元素的尺寸按照 `4:3`（即 `.75`）进行缩放，只需要知道元素的 `width`，我们就可以根据该比率计算出元素的 `height`：

```CSS
.rect { 
    --width: 400px; 
    --aspect-ratio: .75; 
    width: var(--width); 
    height: calc(var(--width) * var(--aspect-ratio)); /* 300px */ 
} 
```

如果是一个动态比例：

```CSS
.rect { 
    --ratio-w: 4; 
    --ratio-h: 3; 
    --aspect-ratio: calc(var(--ratio-w) / var(--ratio-h)); 
    --width: 400; 
    width: calc(var(--width) * 1px); 
    height: calc(var(--width) * 1px / var(--aspect-ratio)); 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c686c46facb0465ea7e531e6f904d0fc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQGgVv>

### Grid布局 + 响应式布局

在一些布局场景中，使用 CSS Grid 的 `minmax()` 函数、`repeat()` 函数、`fr` 单位和 `auto-fit` 以及 `auto-fill` 的结合可以不再依赖媒体查询就可以很好的实现响应式布局。

```CSS
.container { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 10px; 
} 
```

CSS 自定义属性在该场景中也非常有用。想象一下，你想让一个网格容器根据定义的首选宽度来显示它的网格项目（比如上面示例中的 `300px`）。在未使用 CSS 自定义属性时，你可能需要为每个变化创建一个类和重复使用上面的代码：

```CSS
.container { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 10px; 
} 
​
.container.container__2 { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); 
    gap: 10px; 
} 
```

我们可以使用 CSS 自定义属性来替代定义首选宽度，这样会让代码变得更简洁，也更易于维护。比如：

```CSS
:root { 
    --grid-item: 300px; 
} 
​
.container { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(var(--grid-item), 1fr)); 
    gap: 10px; 
} 
​
.contaner__card { 
    --grid-item: 500px; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60bc1d5ef0874e29a3ef0e961855db85~tplv-k3u1fbpfcp-zoom-1.image)

同样的，还可以把自定义属性用于 `gap` 属性上：

```CSS
:root { 
    --grid-item: 300px; 
    --gap: 10px;
} 
​
.container { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(var(--grid-item), 1fr)); 
    gap: var(--gap); 
} 
​
.contaner__card { 
    --grid-item: 500px; 
    --gap: 20px; 
}
```

你可以尝试着调整下面 Demo 中的卡片宽度（网格定义的首选宽度）和卡片间距的值，查看布局的变化：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d82d261e36c417d9f489486ca59edee~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOQGgzJ>

### CSS 自定义属性给动效带来的变化

先来看一个有关于 CSS 动效的简单示例：

```CSS
@keyframes breath { 
    from { 
        transform: scale(0.5); 
    } 
    
    to { 
        transform: scale(1.5); 
    } 
} 
​
.walk { 
    animation: breath 2s alternate; 
} 
​
.run { 
    animation: breath 0.5s alternate; 
} 
```

使用 `@keyframes` 创建了一个 `breath` 动效（呼吸灯效果），并且在 `.walk` 和 `.run` 上都使用了这个 `breath` 动效，只不过是在时间上做了一些调整，`.walk` 的持续时间比 `.run` 的长。事实上，`.walk` 执行 `breath` 的速度较慢，但它更需要一个更深的呼吸灯效果，为此需要重新创建一个新动效：

```CSS
@keyframes breath { 
    from { 
        transform: scale(0.5); 
    } 
    to { 
        transform: scale(1.5); 
    } 
} 
​
@keyframes breathDeep { 
    from { 
        transform: scale(0.3); 
    } 
    to { 
        transform: scale(1.7); 
    } 
} 
​
.walk { 
    animation: breathDeep 2s alternate; 
} 
​
.run { 
    animation: breath 0.5s alternate; 
} 
```

但将 CSS 自定义属性引入进来，会有一个更好的解决方案：

```CSS
@keyframes breath { 
    from { 
        transform: scale(var(--scaleStart)); 
    } 
    to { 
        transform: scale(var(--scaleEnd)); 
    } 
} 

.walk { 
    --scaleStart: 0.3; 
    --scaleEnd: 1.7; 
    animation: breath 2s alternate; 
} 

.run { 
    --scaleStart: 0.8; 
    --scaleEnd: 1.2; 
    animation: breath 0.5s alternate; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7410b587278e4665af9787b90c88b540~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYQegMM>

还可以使用 CSS 自定义属性来改变控制动效的其他参数，比如改变 `animation-delay`。比如下面这个错开的动效：

```CSS
div { 
    background-color: #09f; 
    opacity: 0; 
} 
​
.ani { 
    --delay: calc(var(--i, 1) * 100ms); 
    
    animation: fadeIn 1000ms var(--delay) forwards; 
} 
​
@keyframes fadeIn { 
    100% { 
        opacity: 1; 
    } 
} 
```

```JavaScript
const buttonHander = document.querySelector("button"); 
const rects = document.querySelectorAll("div"); 
​
rects.forEach((element, index) => { 
    element.style.setProperty("--i", index + 1); 
}); 
​
buttonHander.addEventListener("click", () => { 
    rects.forEach((element) => { 
        element.classList.toggle("ani"); 
    }); 
}); 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8a0a61473a14728a7f4beaf2fb82aac~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJaxWeP>

上面演示的都是些简单地示例，其实 CSS 自定义属性，可以帮助我们实现很多复杂的动效，比如 [@Jhey 的 Demo](https://codepen.io/jh3y/full/poEarLX)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97a45ee0e5044cb09be2e743ec3cf1fb~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwMrVK>

虽然 CSS 自定义属性给 CSS 带来很多优势，但也有一定的缺陷，比如说，CSS 自定义属性在 `@keyframes` 规则中使用时并不能被动画化：

> If you have read the spec for CSS variables, you might read the term animation-tainted. The idea is that when using a CSS variable inside a `@keyframes` rule, it can’t be animated.

比如下面这个示例：

```CSS
.box { 
    width: 50px; 
    height: 50px; 
    
    --offset: 0; 
    border-radius: 5px; 
    background-color: #09f; 
    transform: translateX(var(--offset)); 
    animation: moveBox 2s linear infinite; 
} 
​
@keyframes moveBox { 
    0% { 
        --offset: 0; 
    } 
    50% { 
        --offset: 300px; 
    } 
    100% { 
        --offset: 600px; 
    } 
} 
```

虽然蓝色盒子在移动，但并没有过渡的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af232b1dbcea49eda838fb4ef9cb9728~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQrJwM>

不过 CSS Houdini 的 `@property` 可以改变这种现象：

```CSS
@property --offset {
    syntax: "<length-percentage>";
    inherits: true;
    initial-value: 0px;
}
​
.box {
    width: 50px;
    height: 50px;
    --offset: 0;
    transform: translateX(var(--offset));
    border-radius: 5px;
    background-color: #09f;
    animation: moveBox 2s linear infinite;
}
​
@keyframes moveBox {
    0% {
        --offset: 0;
    }
    50% {
        --offset: 300px;
    }
    100% {
        --offset: 600px;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9823987c8f9240a4985b92b4bb014a67~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzEpWv>

### CSS 伪元素

使用 CSS 自定义属性，可以更改伪元素属性，因为它是从父元素继承的。考虑下面的例子:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa92b9ba5af8400b8f26c317f069d58e~tplv-k3u1fbpfcp-zoom-1.image)

章节标题有一条装饰性的紫色线，它是一个伪元素。我们可以向标题传递一个 CSS 自定义属性，伪元素将继承它。

```CSS
.section--title {
    --dot-color: #829be9;
}
​
.section--title::before {
    content: "";
    background-color: var(--dot-color);
}
```

不仅如此，我们还可以通过 Javascript 模拟改变伪元素的颜色。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b00d5272919a472c83d7b70d60138b8e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGwWpz>

## 小结

这节课主要向大家演示了一些 CSS 自定义属性在实际项目中可以使用的场景，并且通过这些示例能更好的向大家阐述 CSS 自定义属性的使用以及她自身的魅力。其实 CSS 自定义属性还有很多好玩的，这里没有一一展示，如果你那有更好的玩的示例，欢迎在下面的评论中与我们一起共享。