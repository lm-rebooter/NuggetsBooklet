我们花了两节课（《[24 | CSS 自定义属性你知道多少](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)》和《[25 | CSS 自定义属性可以用来做些什么](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)》）的篇幅介绍了 CSS 自定义属性的特性和使用场景。从这两节课中可以体会到 CSS 自定义属性的强大之处，但原生的 CSS 自定义属性也存在一定的局限性，比如无法定义自定义属性的类型，比如在 `@keyframes` 中无法直接使用原生的自定义属性。庆幸的是，[CSS Houdini ](https://css-houdini.rocks/)所提供的 `@property` 规则补齐了这方面的短板，**它允许 Web 开发者显式地定义他们的 CSS 自定义属性，而且允许进行属性类型检查、设定默认值以及定义该自定义属性是否可以被继承**。

那么，`@property` 如何使用呢？它又将给 CSS 带来哪些变化呢？接下来，我将尝试着使用一些案例向大家介绍 CSS 的 `@property` 规则，希望大家能更好的掌握它，并且能将它运用于实际项目当中。

## 回顾 CSS 自定义属性

虽然小册已经花了两节课（《[24 | CSS 自定义属性你知道多少](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)》和《[25 | CSS 自定义属性可以用来做些什么](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)》）的篇幅介绍了 CSS 自定义属性的特性和使用场景，但这里还是花一点点时间，让大家回顾一下 CSS 自定义属性。

在 CSS 中，我们可以在任何代码块（`{}` 内）使用双折线（`--`）定义一个 CSS 自定义属性，然后使用 `var()` 函数来调用它。例如：

```CSS
:root {
    --color: #09f;
}
​
.element {
    color: var(--color);
}
```

这是原生 CSS 自定义属性最基础的部分。

如果你阅读了小册前面关于 CSS 自定义属性的相关课程，那么对于 CSS 的利弊会有所了解。拿下面这个示例为例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78078a2fe90f4810896387e5ec4998df~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYbmgLZ>

在这个示例中就有 CSS 自定义属性的身影：

```CSS
img {
    --a: 8deg; /* 控制旋转角度，越小效果越好 */
    transform: perspective(400px) rotate3d(var(--r,1,-1),0,calc(var(--i,1)*var(--a)));
    transition: .4s;
}
​
.alt {
    --r: 1,1;
}
​
img:hover {
    --i: -1;
}
```

就上面这个示例而言，CSS 自定义属性使得我们的 CSS 代码变得更为简洁。这仅是 CSS 自定义属性好处之一。但 CSS 自定义属性也有相应的不足之处。例如，CSS 自定义属性没有严格的值类型，例如：

```CSS
:root {
    --color: red;
}
```

在 CSS 中没有办法定义 `--color` 值类型，大多数仅依赖于 Web 开发者自身对其进行约束，这就存在一定的风险，它有可能被运用于非 `<color>` 值类型的属性上，例如：

```CSS
:root {
    --color: red; /* Web 开发者认为它是 <color> 值类型 */
}
​
.element {
    width: var(--color); /* 它可能被运用于非 <color> 值类型的属性上 */
}
```

上面代码中，`--color` 被运用于非 `<color>` 值类型的属性上，严格上来说，这样使用上没有任何意义的，因为 CSS 代码并不会生效，但它也不会报错，Web 开发者是无法感知到它的错误。

除此之外，CSS 原生自定义属性在一些场景中使用离你预期的效果会差很远很远，比如 `@keyframes` 中 CSS 自定义属性：

```CSS
.box {
    --offset: 0;
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

上面代码分别在不同的帧中调整了自定义属性 `--offset` 的值，期望改变元素 `.box` 在 `x` 轴的位移位置。这样做，元素 `.box` 是在 `x` 轴移动了，但它整个效果非常的生硬：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b64735265b634145a5de30553449e6a4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWoJpvM>

这样的效果不是你所期望的。

而 CSS 的 `@property` 可以很容易的做到这些，比如明确指定自定义属性的值类型，比如使得上面示例的动效变得更丝滑。

```CSS
@property --offset {
    syntax: "<length-percentage>"; /* 指定自定义属性 --offset 值类型 */
    inherits: true;
    initial-value: 0px;
}
​
.box {
    --offset: 0;
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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91fa61ccdb3241459365011294bff271~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdayWya>

我想你一定会对 `@property` 感到好奇，甚至想一探其究竟。接下来，我们一起来探讨它！

## CSS 的 @ 规则：@property

首先要说的是，`@property` 是 CSS 的 `@` 规则之一，但它隶属于 CSS Houdini，它是 [CSS Houdini 中的一个基础 API ](https://www.w3.org/TR/css-properties-values-api-1/)。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0b35ee9caf643cd9dbb45a36a060002~tplv-k3u1fbpfcp-zoom-1.image)

它允许 Web 开发者显式地自定义他们的 CSS 自定义属性，并且允许对自定义属性进行属性类型检查、设定默认值（初始值）以及定义该自定义属性是否可被继承。

> 为了能和 CSS 原生自定义属性有所区分，我更喜欢称之为 **CSS Houdini 变量**。在接下来的内容中，所提到的 CSS 自定义属性是指 CSS Houdini 定义的属性。

我们有两种方式可以用来声明（或者定义）一个 CSS 自定义属性：

-   在 [CSS 中使用 @property 规则来定义](https://www.w3.org/TR/css-properties-values-api-1/#at-property-rule)
-   在 [JavaScript 中使用 CSS.registerProperty() 来定义](https://www.w3.org/TR/css-properties-values-api-1/#registering-custom-properties)

例如：

```CSS
@property --custom-property-name {
    syntax: "<color>";
    inherits: false;
    initial-value: #c0ffee;
}
```

```JavaScript
CSS.registerProperty({
    name: "--custom-property-name",
    syntax: "<color>",
    inherits: false,
    initialValue: "#c0ffee"
});
```

简单地解释一下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c9c7892516e4881bf1b96043cb84e67~tplv-k3u1fbpfcp-zoom-1.image)

其中：

-   紧跟 `@property` 后的 `--custom-property-name` 或者 `CSS.registerProperty()` 中的 `name` 的值 `--custom-property-name` 就是自定义属性的名称，它的命名方式和原生 CSS 自定义属性命名方式相同，必须以双折线（`--`）为前缀。命名好的自定义属性就可以通过 CSS 的 `var()` 函数进行引用，即 `var(--custom-property-name)`
-   `syntax` 用来指定自定义属性的语法规则，即自定义属性的值类型，例如 `<color>` 、`<length>` 等。**它是定义自定义属性的必须描述符**
-   `inherits` 用来指定自定义属性是否允许被继承，即自定义属性是否为继承属性，如果值为 `true` 表示该自定义属性是可继承属性，如果值为 `false` 表示该自定义属性是非可继承属性。**它是定义自定义属性的必须描述符**
-   `initial-value` 或 `initialValue` 用来指定自定义属性的初始值，比如上面示例中的 `#c0ffee`

上面这些参数和 W3C 规范中的属性定义是非常相似的，例如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f5e78b081c146bca4538309ac254aac~tplv-k3u1fbpfcp-zoom-1.image)

在这几个参数中，`syntax` 可取的值比较多，基本上涵盖了 CSS 的值类型：

-   **`<length>`** ：任何有效的[长度值](https://www.w3.org/TR/css3-values/#length-value)，例如 `10px` ，`10vw` 等
-   **`<number>`** ：任何有效的[数字值](https://www.w3.org/TR/css3-values/#number-value)，例如 `1` 、`1000` 等
-   **`<percentage>`** ：任何有效的[百分比值](https://www.w3.org/TR/css3-values/#percentage-value)，例如 `10%`
-   **`<length-percentage>`** ：任何有效的长度值（`<length>`）或百分比值（`<percentage>`），例如 `10px` 或 `10%`
-   **`<color>`** ：任何有效的[颜色值](https://www.w3.org/TR/css-color-3/#valuea-def-color)，例如 `red` 、`#fff` 、`rgb(0 0 0)` 等
-   **`<image>`** ：任何有效的[图像值](https://www.w3.org/TR/css3-images/#image-type)，例如 `url()` 函数引入的图像，`<gradient>` （渐变）绘制的图像等
-   **`<url>`** ：任何有效的 `url 值`，例如 `url(star.png)`
-   **`<integer>`** ：任何有效的[整数值](https://www.w3.org/TR/css3-values/#integer-value)，例如 `1` 、`2` 等
-   **`<angle>`** ：任何有效的[角度值](https://www.w3.org/TR/css3-values/#angle-value)，例如 `360deg` 、`400grad` 、`1rad` 和 `1turn` 等
-   **`<time>`** ：任何有效的[时间值](https://www.w3.org/TR/css3-values/#time-value)，例如 `.2s` 、`200ms` 等
-   **`<resolution>`** ：任何有效的[分辨率值](https://www.w3.org/TR/css3-values/#resolution-value)，例如 `dpi`、`dpcm` 和 `dppx`等
-   **`<transform-list>`** ：任何有效的[变换函数](https://www.w3.org/TR/css-transforms-1/#typedef-transform-function)，例如 `rotate()` 、`translate()` 等
-   **`<custom-ident>`** ：任何有效的 `ident 值`，例如 `easing` 、`linear` 等

`syntax` 可以接受一些特殊的类型定义：

-   `+` （`U+002B`）：接受以空格分隔的列表，例如 `<length>+` ，表示接受以空格分隔的长度值（`<length>`）列表
-   `#` （`U+0023` ）：接受以逗号分隔的列表，例如 `<color>#` ，表示接受以逗号分隔的颜色值（`<color>`）列表
-   `|` （`U+007C` ）：接受以竖线分隔的列表，例如 `<length> | <lenthg>+` ，表示接受单个长度值（`<length>`）或者以空格分隔的长度值列表

像下面这些，都是有效 `syntax` 字符串：

```CSS
syntax: "<color>";                 /* 接收一个颜色值 */
syntax: "<length> | <percentage>"; /* 接收长度或百分比参数，但是二者之间不进行计算合并 */
syntax: "small | medium | large";  /* 接收这些参数值之一作为自定义标识符 */
syntax: "*";                       /* 任何有效字符 */
```

在定义自定义属性时，规则中 `syntax` 和 `inherits` 描述符是必需的；如果其中任何一项缺失，整条规则都将失效并且会被忽略。 `initial-value` （或 `initialValue`）描述符仅在 `syntax` 描述符为通用 `syntax` 定义（即 `syntax: *`）时是可选的，否则 `initial-value` （或 `initialValue`）也是必需的——如果此时该描述符缺失，整条规则都将失效且被忽略。

另外，我们在定义自定义属性时，`initial-value` （或 `initialValue`）描述符的值类型需要与 `syntax` 描述符中定义的类型相匹配。例如，`syntax` 的值为 `<length>` ，那么 `initail-value` （或 `initialValue`）的值就应该是一个有效的长度值，例如 `10px` ，但不能是别的类型值，例如 `10%` ，否则整条规则都将失效且被忽略，即自定义的属性不生效。

## CSS Houdini 自定义属性 vs. CSS 原生自定义属性

你可能会感到好奇，既然我们可以直接使用 CSS 原生自定义属性了，为什么 CSS Houdini 还要对自定义属性做扩展呢？其实他们之间有着明显的差异。

**CSS 原生自定义属性的值都是字符串**。比如：

```CSS
:root { 
    --stop: 50%; 
} 
```

```JavaScript
const customName = document.documentElement.style.getPropertyPriority( "--stop" ); 
console.log(typeof customName);  // => string 
```

但使用 `@property` 或 `CSS.registerProperty()` 注册的 CSS Houdini 自定义属性可以指定值类型：

```CSS
@property --stop { 
    syntax: "<percentage>"; 
    initial-value: 50%; 
    inherits: false; 
}
```

这个时候浏览器就知道 `--stop` 自定义属性是一个百分比值（`<percentage>`）而不是一个字符串。我们来看一个示例：

```CSS
/* 原生CSS定义属性 */ 
:root { 
    --stopPoint: 50px; 
} 
​
/* CSS Houdini 注册的CSS自定义属性 */ 
@property --stop { 
    syntax: "<percentage>"; /* 指定值的语法类型是百分比 */ 
    initial-value: 50%; 
    inherits: false; 
} 
```

我们在 `body` 上调用 `@property` 定义的自定义属性 `--stop` ，并且重新声明它的值为 `50px` ：

```CSS
body { 
    --stop: 50px; 
    background-image: linear-gradient( to right, red, red var(--stop), gold var(--stop), gold ); 
}
```

虽然在 `body` 中显式的重置了 `--stop: 50px`，但最终还是运用了 `@property` 中声明 `--stop` 的初始值 `50%`，那是因为在 `body` 中重置的 `--stop` 值并不是 `<percentage>` 值，而是 `<length>` 值。

接着在 `div` 中调用 `:root{}` 中声明的 `--stopPoint`，并且重新声明它的值为 `30%`:

```CSS
div { 
    --stopPoint: 30%; 
    background-image: linear-gradient( to right, gold, gold var(--stopPoint), red var(--stopPoint), red ); 
}
```

虽然在 `:root{}` 中声明了 `--stopPoint: 50px`，但在 `div` 中的 `--stopPont: 30%` 覆盖了 `:root{}` 中声明的 `--stopPoint`。 对比效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c065c524e44e4169b43f4cd2ad8cd290~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoXwxyy>

再来看继承方面的差异。

在《[24 | CSS 自定义属性你知道多少](https://juejin.cn/book/7223230325122400288/section/7249357815410589733)》这节课中着重介绍了 CSS 原生自定义属性继续方面的特性，从课程中我们可以得知“**CSS 原生自定义属性（像许多其他 CSS 属性一样）通过 HTML 结构进行继承**”。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a7cfca4b1f34f2e9b73d85c4d0b087b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQqyrY>

正如你所看到的，第二个 `.module` 运用的自定义属性 `--background` ，它离 `.sidebar` 中的 `--background` 更近，离 `body` 中的 `--background` 却更远，因此，`--background` 被解析为 `#fe890a` ，而在其他地方解析为 `#5500fe` 。

对于 CSS Houdini 自定义属性的继承特性显得要更清晰很多，因为我们在使用 `@property` 或 `CSS.registerProperty()` 注册自定义属性时，必须得在 `inherits` 描述上指定该属性是否可继承（`true` 表示可继承，`false` 表示不可继承）。比如下面这个示例：

```HTML
<body>
    <main>
        <div class="module">位于 main 中的 module</div>
    </main>
    
    <aside class="sidebar">
        <div class="module">位于 sidebar 中的 module</div>
    </aside>
</body>
```

```CSS
@layer property {
    @property --background {
        syntax: "<color>";
        initial-value: #5500fe;
        inherits: true;
    }
​
    body {
        --background: #fe890a;
    }
​
    .sidebar {
        --background: #900; 
    }
​
    .module {
        background-color: var(--background); 
    }
}
```

我们使用 `@property` 注册了一个名为 `--background` 的自定义属性，该自定义属性是一个可继承属性，并且其初始值为 `#5500fe` 。就该示例而言，位于 `<main>` 中的 `.module` 将会继承 `body` 元素的 `--background` ，因为离它最近且设置 `--background` 的父元素是 `body` ；位于 `<aside>` 中的 `.module` 将会继承他父元素 `.sidebar` 中的 `--background` 。你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1e040dd816f419c8f300e019a0dccdb~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoXwXWv>

如果我们在注册 `--background` 时，设置它是不可继承的属性：

```CSS
@layer property {
    @property --background {
        syntax: "<color>";
        initial-value: #5500fe;
        inherits: false;
    }
​
    body {
        --background: #fe890a;
    }
​
    .sidebar {
        --background: #900;
    }
​
    .module {
        background-color: var(--background);
    }
}
```

在此情况之下，两个 `.module` 都元素法继承其祖先元素的 `--background` 自定义属性的值，在当前元素（`.module`）未显式设置自定义属性 `--background` 的值时，将会使用 `@property` 规则中 `initial-value` 描述符所设置的值，此例是 `#5500fe` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83d7dfebdc6d4093b0e96e555a6e1f4c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYyxyXa>

可以将它们结合起来看，这样更易于理解 CSS Houdini 自定义属性的继承机制：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db67a9a569ae47b588e22926dc2b10ea~tplv-k3u1fbpfcp-zoom-1.image)

你有可能在样式表中使用 `@property` 规则在不同的地方定义两个相同名称的自定义属性，它也会遵守 CSS 级联的规则，后面的将会覆盖前面的，或者说权重更大的会覆盖权重更小的。例如：

```CSS
@property --colorPrimary { 
    syntax: "<color>"; 
    initial-value: magenta; 
    inherits: true; 
} 
​
@property --colorPrimary { 
    syntax: "<color>"; 
    initial-value: #09f; 
    inherits: false; 
} 
​
body { 
    --colorPrimary: #f36; 
    background-color: var(--colorPrimary); 
} 
​
div { 
    background-color: var(--colorPrimary); 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b94032d64323476ea1b314051795ed26~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWobKeJ>

如果使用 `CSS.registerProperty()` 同时注册相同名称的自定义属性时则会报错：

```CSS
CSS.registerProperty({ 
    name: "--stop", 
    syntax: "<length>", 
    initialValue: "100px", 
    inherits: false 
}); 
​
CSS.registerProperty({ 
    name: "--stop", 
    syntax: "<percentage>", 
    initialValue: "50%", 
    inherits: false 
});
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20b4aada2cb84831a5c266e7a1250da1~tplv-k3u1fbpfcp-zoom-1.image)

## CSS Houdini 自定义属性可以做什么？

上面我们花了一些篇幅介绍了CSS Houdini 自定义属性的基本使用，那么它能给我们真正带来什么样的变化呢？接下来，我们通过一些实例来向大家展示 CSS Houdini 自定义属性给我们带来的变化。

### 让颜色动起来

在现代 CSS 中，我们可以仅改变一个颜色的通道值就可以得到不同的颜色，例如 `hsl()` 颜色，在原始色的基础上仅调整 `L` 颜色通道的值。有了 CSS 自定义属性之后，改变颜色亮度得到不同的颜色变得更容易，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1e53d98b30a4ce68de356770ac3376a~tplv-k3u1fbpfcp-zoom-1.image)

来看一个简单的示例：

```CSS
.circle {
    --size: .5;
    --base-l: 10;
    --base-color: #09f;
    
    --shadow-color-1: hsl(from var(--base-color) h s calc(var(--base-l) * 1 * 1%));
    --shadow-color-2: hsl(from var(--base-color) h s calc(var(--base-l) * 2 * 1%));
    --shadow-color-3: hsl(from var(--base-color) h s calc(var(--base-l) * 3 * 1%));
    --shadow-color-4: hsl(from var(--base-color) h s calc(var(--base-l) * 4 * 1%));
    --shadow-color-5: hsl(from var(--base-color) h s calc(var(--base-l) * 5 * 1%));
    --shadow-color-6: hsl(from var(--base-color) h s calc(var(--base-l) * 6 * 1%));
    --shadow-color-7: hsl(from var(--base-color) h s calc(var(--base-l) * 7 * 1%));
    --shadow-color-8: hsl(from var(--base-color) h s calc(var(--base-l) * 8 * 1%));
    
    box-shadow: 
        0 0 0 calc(var(--size) * 1 * 1em) var(--shadow-color-1),
        0 0 0 calc(var(--size) * 2 * 1em) var(--shadow-color-2),
        0 0 0 calc(var(--size) * 3 * 1em) var(--shadow-color-3),
        0 0 0 calc(var(--size) * 4 * 1em) var(--shadow-color-4),
        0 0 0 calc(var(--size) * 5 * 1em) var(--shadow-color-5),
        0 0 0 calc(var(--size) * 6 * 1em) var(--shadow-color-6),
        0 0 0 calc(var(--size) * 7 * 1em) var(--shadow-color-7),
        0 0 0 calc(var(--size) * 8 * 1em) var(--shadow-color-8);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6de51f656917499ca73d31a9b1429726~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBLdNyr> （请使用 Safari 16.4+ 查看该 Demo）

上面这个示例，我们可以：

-   改变 `--base-color` 自定义属性的值来改变基础颜色
-   改变 `--base-l` 来改变 `hsl()` 颜色的 `L` 通道的值，而且这里采用了相对颜色语法规则，基于 `--base-color` 来调整 `L` 通道颜色值（即 `--base-l`），从而得到一个新的颜色
-   改变 `--size` 来调整阴影尺寸

注意，上面 Demo 使用的是 CSS 原生自定义属性。

接下来，基于上面示例做一点调整，将在 `@keyframes` 中来改变 `--base-l` 的值：

```CSS
@layer animation {
    @keyframes change-color {
        from {
            --base-l: 5%;
        }
        to {
            --base-l: 10%;
        }
    }
  
    .circle {
        animation: change-color 2s linear alternate infinite both;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11d008ffe3784ed2bb702580eb1a7197~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjwdRdy> （请使用 Safari 16.4+ 查看该 Demo）

示例中的 `--base-l` 也可以换成 `@property` 来定义：

```CSS
@layer animation {
    @property --base-l {
        syntax: "<percentage>";
        initial-value: "5%";
        inherits: false ;
    }
    
    @keyframes change-color {
        from {
            --base-l: 5%;
        }
        to {
            --base-l: 10%;
        }
    }
  
    .circle {
        animation: change-color 2s linear alternate infinite both;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3750732d414f4a21b9ae339038c57bea~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poqJEbj> （请使用 Safari 16.4+ 查看该 Demo）

两种自定义属性实现的效果似乎是相同的，并没有体现出 `@property` 的优势。但我想通过这个示例告诉大家，有了 `@property` 属性之后，在 CSS 中你可以对很多东西进行动画化，比如颜色、位置、大小等等。

除此之外，还有更多的想象空间，比如下面这个示例，按钮的边框（`border`）和阴影（`box-shadow`）会在鼠标悬浮的时候流转一整个色轮的颜色：

```CSS
@layer animation {
    @keyframes hueJump {
        to {
            --hue: 360;
        }
    }
    
    button {
        &:hover {
            animation: hueJump 0.75s infinite linear;
        }
        
        &:active {
            animation-play-state: paused;
        }
    }
}
​
@layer property {
    @property --hue {
        syntax: "<integer>";
        inherits: true;
        initial-value: 0;
    }
​
    button {
        --bg: #1a1a1a;
        --button-bg: #000;
        --border: hsl(var(--hue, 0) 0% 50%);
        --shadow: hsl(var(--hue, 0) 0% 80%);
        
        background: var(--button-bg);
        border-color: var(--border);
    
        &:hover {
            --border: hsl(var(--hue, 0) 80% 50%);
            --shadow: hsl(var(--hue, 0) 80% 50%);
        }
    }
}
​
@layer demo {
    body {
        transform-style: preserve-3d;
        perspective: 800px;
    }
​
    button {
        box-shadow: 0 1rem 2rem -1.5rem var(--shadow);
        transition: transform 0.2s, box-shadow 0.2s;
    
        &:hover {
            transform: rotateY(10deg) rotateX(10deg);
        }
        
        &:active {
            transform: rotateY(10deg) rotateX(10deg) translate3d(0, 0, -15px);
            box-shadow: 0 0rem 0rem 0rem var(--shadow);
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f090a7cc53464f67bf8dd8b5245b06a6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dywopzj>

### 使渐变动效更丝滑

在 CSS 中，给渐变添加动效往往是在 `@keyframes` 中调整 `background-position` 的值，例如：

```CSS
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    
    50% {
        background-position: 100% 50%;
    }
    
    100% {
        background-position: 0% 50%;
    }
}
```

现在我们可以使用 `@property` 定义的自定义属性，使其效果变得更丝滑。我们来看一个简单的渐变动画效果：

```CSS
@property --startColor {
    syntax: "<color>";
    initial-value: magenta;
    inherits: false;
}
​
@property --stopColor {
    syntax: "<color>";
    initial-value: magenta;
    inherits: false;
}
​
@property --stop {
    syntax: "<percentage>";
    initial-value: 50%;
    inherits: false;
}
​
.gradient__css__houdini {
    --startColor: #2196f3;
    --stopColor: #ff9800;
  
    transition: --stop 0.5s, --startColor 0.2s, --stopColor 0.2s;
    background: linear-gradient(
        to right,
        var(--startColor) var(--stop),
        var(--stopColor)
    );
}
​
.gradient__css__houdini:hover {
    --startColor: #ff9800;
    --stopColor: #2196f3;
    --stop: 80%;
}
```

你可以对比一下 CSS 原生自定义属性创建的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05a598bdd7e243faa702d87c94e3140a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEVGpMy>

还可以使用 `@property` 给渐变的颜色位置添加动效，比如下面这个效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff969c018ce94c868ddf5d52d610d815~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNLvGYw>

关键代码如下：

```CSS
@layer property {
    @keyframes load {
        0%,
        10% {
            --a: 0deg;
            --h: 0;
        }
        100% {
            --a: 360deg;
            --h: 100;
        }
    }
​
    @property --a {
        initial-value: 0deg;
        inherits: false;
        syntax: "<angle>";
    }
    
    @property --h {
        initial-value: 0;
        inherits: false;
        syntax: "<number>";
    }
​
    .loader {
        --charge: hsl(var(--h, 0) 80% 50%);
​
        border-image: 
            conic-gradient(var(--charge) var(--a),transparent calc(var(--a) + 0.5deg))
            30;
        animation: load 2s infinite ease-in-out;
    }
}
```

示例中使用 `@property` 定义了两个自定义属性，即 `--a` （渐变的角度）和 `--h` （渐变颜色的色相），这两个自定义属性都用在 `conic-gradient()` 函数，它将会绘制一个锥形渐变图像，最终用于 `border-image` 属性上。如此一来，元素 `.loader` 就具有一个渐变边框效果。

然后，在 `@keyframes` 中调整 `--a` 和 `--h` 值，从而使图片边框有一个动画效果：

```CSS
@keyframes load {
    0%,
    10% {
        --a: 0deg;
        --h: 0;
    }
    100% {
        --a: 360deg;
        --h: 100;
    }
}
```

使用同样的原理，你还可以给图片添加一个带有动效的花式边框：

```CSS
@layer demo {
    img {
        --t: 3px;
        --s: 40px;
        --g: 8px;
        --c: #755c3b;
    
        padding: calc(2 * var(--t) + var(--g));
        border: var(--t) solid #0000;
        background: 
            conic-gradient(at var(--s) calc(3 * var(--t)),#0000 75%,var(--c) 0) 0 0 / calc(100% - var(--s)) calc(100% - 3 * var(--t)) border-box,
            conic-gradient(at calc(3 * var(--t)) var(--s), #0000 75%, var(--c) 0) 0 0 / calc(100% - 3 * var(--t)) calc(100% - var(--s)) border-box,
            linear-gradient(0deg, var(--c) calc(2 * var(--t)), #0000 0) 50% var(--t) / calc(100% - 2 * (var(--s) + var(--g))) 100% repeat-y padding-box,
            linear-gradient(-90deg, var(--c) calc(2 * var(--t)), #0000 0) var(--t) 50%/100% calc(100% - 2 * (var(--s) + var(--g))) repeat-x padding-box;
        transition: --s 0.5s;
        cursor: pointer;
    }
    
    img:hover {
        --s: 80px;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ed231c565ca4eab911f19c6b8bdcb87~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWeqbmy>

### 动态计数

有了 `@property` 之后，我们可以借助 [CSS 的 counter-reset 、counter-increment 和 counter() 等特性](https://juejin.cn/book/7223230325122400288/section/7259668400379527205)实现动态计数的效果。

比如下面这个示例。我们使用 `counter()` 以及伪元素的 `content` 将数字转换成字符串，并使用这些字符串作为伪元素 `content` 的值：

```CSS
@property --milliseconds {
    inherits: false;
    initial-value: 0;
    syntax: '<integer>';
}
​
.counter {
    position: relative;
    counter-reset: ms var(--milliseconds);
    animation: count 100s steps(100) infinite;
}
​
.counter:after {
    content: counter(ms);
}
​
@keyframes count {
    to {
        --milliseconds: 100;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74638a9b7056448f9040f69134e3af7e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abPOpoo>

你也可以反过来，使用它们制作一个十秒倒计时的效果：

```CSS
@property --num {
    syntax: "<integer>";
    initial-value: 0;
    inherits: false;
}
​
div {
    counter-reset: num var(--num);
    animation: counter 10s steps(10) both;
}
​
div::after {
    content: counter(num);
}
​
@keyframes counter {
    from {
        --num: 10;
    }
    to {
        --num: 0;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3af0ce461ec040c5ac9a5ec749c6e57b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWZwJgZ>

也就是说，如果你不想要非常精准的秒表动效（一般秒表记数是使用 JavaScript 来实现，比如通过 `selInterval` 实现），那它和上面示例中的计数器效果是等同的。[@Jhey 在 Codepen 上就用这个原理实现了一个纯 CSS 的秒表记时器](https://codepen.io/jh3y/full/jOVmJBL)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25f8d60bcfe046a6ab3c544673a6f0a7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/jh3y/full/jOVmJBL>

### 让变换（transform）变得更酷

使用 CSS 开发 Web 动效的时候，很多情况之下都离不开 CSS 的 `transform` 特性，不管是 2D 的 Transform 还是 3D 的 Transform。但在使用它们在制作动效时，有的时候会显得非常的生硬（看起来不像它应有的效果）。比如下面这个抛物线效果，即从 `A` 点移到 `B` 点，并同时模仿带有重力的效果：

```CSS
@keyframes throw { 
    0% { 
        transform: translate(-500%, 0); 
    } 
    50% { 
        transform: translate(0, -250%); 
    } 
    100% { 
        transform: translate(500%, 0); 
    } 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d6d02e1d2434666b5f1a58a46d9a404~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWobpbL>

以前，我们主要是靠在动画元素上套个容器，然后分别在 `x` 和 `y` 两个方向添加动画来实现这个效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45955991fd024c09ab6bac654d5de0bb~tplv-k3u1fbpfcp-zoom-1.image)

有了 `@property` 之后，我们可以同时给变换中每个函数添加动画：

```CSS
@property --x { 
    inherits: false; 
    initial-value: 0%; 
    syntax: '<percentage>'; 
} 
​
@property --y { 
    inherits: false; 
    initial-value: 0%; 
    syntax: '<percentage>';
} 
​
@property --rotate { 
    inherits: false; 
    initial-value: 0deg; 
    syntax: '<angle>'; 
} 
​
.ball { 
    animation: throw 1s infinite alternate ease-in-out; 
    transform: translateX(var(--x)) translateY(var(--y)) rotate(var(--rotate)); 
} 
```

接着在 `@keyframes` 不同的帧中调整已注册的 `--x` 和 `--rotate` 的值：

```CSS
@keyframes throw { 
    0% { 
        --x: -500%; 
        --rotate: 0deg; 
    } 
    50% { 
        --y: -250%; 
    } 
    100% { 
        --x: 500%; 
        --rotate: 360deg; 
    }
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab7c2365269c4c498edf032becd26f1d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNJXBxL>

使用同样的技术，你还可以制作出更复杂的变换效果，例如下面这个 3D 图像效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfa15d52bd374e57b6d066948f483fc8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/t_afif/full/yLRRBKj>

### 制作饼图和圆形进度条

在 CSS 中，我们可以使用 `conic-gradient()` 或 `repeating-conic-gradient()` 两个属性绘制饼图效果：

```CSS
div {
    border-radius: 50%;
    background-image: conic-gradient(magenta 40%, aqua 0 70%, red 0);
​
    &:nth-of-type(2) {
        background-image: conic-gradient(
            red 20%,
            yellow 0 40%,
            lime 0 60%,
            aqua 0 80%,
            blue 0
        );
    }
​
    &:nth-of-type(3) {
        background-image: conic-gradient(
            red 10%,
            yellow 0 20%,
            lime 0 30%,
            aqua 0 40%,
            blue 0 50%,
            magenta 0 60%,
            red 0 70%,
            #09f 0 80%,
            #40f 0 90%,
            #aee 0
        );
    }
​
    &:nth-of-type(4) {
        background-image: conic-gradient(
            #09f 5%,
            #f36 0 10%,
            #09f 0 15%,
            #f36 0 20%,
            #09f 0 25%,
            #f36 0 30%,
            #09f 0 35%,
            #f36 0 40%,
            #09f 0 45%,
            #f36 0 50%,
            #09f 0 55%,
            #f36 0 60%,
            #09f 0 65%,
            #f36 0 70%,
            #09f 0 75%,
            #f36 0 80%,
            #09f 0 85%,
            #f36 0 90%,
            #09f 0 95%,
            #f36 0
        );
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8248e4877dae483f8ba9bc93c7eb1f2a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dywoNNO>

在这个基础上，把 `@property` 定义的自定义属性运用到 `conic-gradient()` 就可以创建带有动效的饼图：

```CSS
@layer pie {
    @property --p {
        inherits: true;
        initial-value: 0;
        syntax: "<integer>";
    }
​
    .pie {
        --stop-list: #ab3e5b calc(var(--p) * 1%), #ef746f 0%;   
        --a: calc(0.5 * var(--p) / 100 * 1turn - 90deg);
        --pos: rotate(var(--a)) translate(5rem) rotate(calc(-1 * var(--a)));
        
        background: conic-gradient(var(--stop-list));
    
        transition: --p 0.5s;
    
        &::after {
            transform: translate(-50%, -50%) var(--pos);
            counter-reset: p var(--p);
            content: counter(p) "%";
        }
    
        :is(#radio1:checked) ~ & {
            --p: 20;
        }
    
        :is(#radio2:checked) ~ & {
            --p: 30;
        }
        
        :is(#radio3:checked) ~ & {
            --p: 50;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff52879b1e79409096df875aeb32436c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdaJRmB>

还可以用来制作带有动效的进度条：

```HTML
<div class="progress" style='--c0: #ec6056; --c1: #ea2963'></div>
<div class="progress" style='--c0: #86dd54; --c1: #4ba75c'></div>
```

```CSS
@layer progress {
    @property --p {
        syntax: "<integer>";
        initial-value: 0;
        inherits: true;
    }
​
    @keyframes p {
        95%,
        100% {
            --p: 100;
        }
    }
​
    .progress {
        counter-reset: p var(--p);
        animation: p 8s linear infinite;
    
        &::before {
            content: counter(p) "%";
            --mask: 
                linear-gradient(red, red) text, 
                radial-gradient(closest-side,transparent calc(100% - 2 * 4px - 1px),red calc(100% - 2 * 4px)
            );
            background: 
                radial-gradient(circle at 50% 4px,var(--c0) 4px,transparent 0),
                conic-gradient(var(--c0), var(--c1) calc(var(--p) * 1%), transparent 0%);
          
            mask: var(--mask);
        }
        
        &::after {
            transform: 
                rotate(calc(4grad * var(--p)))
                translatey(calc(0.5 * 4px - 0.5 * 3.5em));
            box-shadow: 0 0 1px var(--c1);
            background: var(--c1);
        }
        
        &:nth-child(2) {
            animation-duration: 5s;
            animation-delay: -4s;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07db3613ce8b491a9db4be438763432e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNLvRKP>

上面这两个示例都使用了 CSS 的蒙板相关的特性，即 `mask` 。如果你对 `mask` 不了解，也不需过于担心，小册后面会有这方面的内容。

也正如你看到的，将 CSS 的 `mask` 和 `@property` 结合在一起，可以制作出很多酷炫的悬浮效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5c8ce2c35fe4ebda9318cd0773585e8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxmGgeq>

拿上图中第一个效果为例，它的关键代码如下：

```CSS
@property --segment-size {
    syntax: "<length>";
    inherits: false;
    initial-value: 0px;
}
​
.blinds {
    --initial-segment-size: 20px;
    --segment-size: var(--initial-segment-size);
    
    mask-image: repeating-linear-gradient(
        to bottom,
        #000000,
        #000000 var(--segment-size),
        transparent var(--segment-size),
        transparent var(--initial-segment-size)
    );
    transition: --segment-size 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    
    &:hover {
        --segment-size: 0px;
    }
}
```

### 不一样的时间轴

时间轴组件很常见，但这个时间轴效果和其他的有所不同，[它是使用 CSS 滚动驱动特性与 @property 一起构建的](https://codepen.io/utilitybend/full/dyQmQYy)：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/127ccf79f4404b1081ee2b9f93d6eb6f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/utilitybend/full/dyQmQYy>

其核心代码如下：

```CSS
@property --clip-vertical {
    syntax: "<percentage>";
    initial-value: 95%;
    inherits: false;
}
​
@property --clip-horizontal {
    syntax: "<percentage>";
    initial-value: 100%;
    inherits: false;
}
​
@property --intro-radial {
    syntax: "<percentage>";
    initial-value: 0%;
    inherits: false;
}
​
main {
    --timeline-width: 100%;
}
​
.stop {
    --clip-horizontal: 100%;
    --clip-vertical: 93%;
​
    width: calc(var(--timeline-width) / 2);
​
    &::before {
        animation: popIn linear both;
        
        /* 滚动驱动相关特性 */
        animation-timeline: view(block);
        animation-range: cover 5% contain 22%;
    }
    
    &::after {
        clip-path: inset(0 0 var(--clip-vertical) var(--clip-horizontal));
        animation: showLine linear both;
        
        /* 滚动驱动相关特性 */
        animation-timeline: view(block);
        animation-range: cover 10% contain 40%;
    }
​
    &:nth-child(even) {
        margin-left: calc(var(--timeline-width) / 2);
        
        &::after {
            clip-path: inset(0 var(--clip-horizontal) var(--clip-vertical) 0);
        }
    }
}
​
.text {
    animation: slideIn linear both;
    
    /* 滚动驱动相关特性 */
    animation-timeline: view(block);
    animation-range: cover 0% contain 12%;
}
​
/* 帧动画 */
@keyframes popIn {
    0% {
        scale: 0;
    }
    60% {
        scale: 1.2;
    }
}
​
@keyframes moveGradient {
    to {
        --intro-radial: 100%;
    }
}
​
@keyframes showLine {
    0% {
        --clip-horizontal: 100%;
        --clip-vertical: 95%;
    }
    60% {
        --clip-horizontal: 0%;
        --clip-vertical: 95%;
    }
    100% {
        --clip-horizontal: 0%;
        --clip-vertical: 0%;
    }
}
​
@keyframes slideIn {
    0% {
        opacity: 0;
        translate: 0 50%;
    }
    100% {
        opacity: 1;
        translate: 0 3%;
    }
}
```

> 有关于滚动驱动动效相关的特性，小册后面会有相关内容对其进行详细阐述，敬请期待！

## 小结

CSS 的 `@property` 的基础特性很简单，它最为出色的是，我们使用它的能力能实现很多复杂，具有创意的动效。课程中很多案例都是使用 `@property` 构建的。最后希望课程中不同动效案例能够激发你学习，然后制作你自己的超赞例子的兴趣！非常期待能在评论中看到你使用 `@property` 构建的各种有创意的案例。