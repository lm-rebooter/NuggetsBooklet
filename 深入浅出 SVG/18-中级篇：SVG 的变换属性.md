在当今的 Web 设计与开发领域中，SVG 凭借其矢量特性、无限缩放能力及丰富的动画功能，已经成为构建高性能、响应式图形界面不可或缺的一部分。而 SVG 变换属性（`transform`）堪称是赋予静态图形生命活力的关键要素，它不仅能够对 SVG 元素进行精准的空间定位与形态调整，更因其无限可缩放的特性，在响应式设计和高质量视觉呈现中占据无可替代的地位。

  


在 SVG 的广阔舞台上，变换属性扮演着导演的角色，指挥着每一个图形元素翩翩起舞。无论是基础的平移、旋转与缩放，还是进阶的斜切与变形，甚至通过 `<animateTransform>` 动画元素实现流畅连贯的动态变化，SVG 变换属性以其灵活多变且功能强大的特点，打开了通往无限创意的大门。

  


这节课将以专业易懂的方式引领你步入 SVG 的核心地带，从基础概念到实战应用，全方位解析变换属性的各项细节及其背后的数学逻辑。我们将一起挖掘 SVG 变换属性如何在不同场景下展现出卓越的表现力，以及如何与其他 SVG 功能模块紧密结合，构建出富有表现力和互动性的图形界面。

  


在此过程中，无论你是初涉 SVG 领域的新人，还是寻求深化理解的老手，都将收获关于 SVG 变换属性的全新洞见和实用技巧，让你的设计作品更加栩栩如生，更具吸引力。现在，就让我们携手开启这场关于 SVG 变换艺术的探索之旅吧！

  


## CSS 变换 vs. SVG 变换

  


在 Web 前端世界里，CSS 变换与 SVG 变换犹如一对孪生力量，共同构筑起丰富多彩的动态视觉效果。CSS 变换主要用于 HTML 元素，通过简洁直观的语法赋予元素位移、旋转、缩放和倾斜等功能；而 SVG 变换则专注于矢量图形领域，同样提供了强大的空间变换手段，确保 SVG 元素在任何分辨率下都能保持清晰无损的展现效果。

  


尽管两者服务于不同的载体，但它们在变换原理和技术上存在着紧密的联系。[学习和理解 CSS 变换](https://juejin.cn/book/7288940354408022074/section/7295240572736897064)可以帮助我们更好的过渡到 SVG 变换的运用，因为两者均采用相似的数学模型处理平移、旋转、缩放等基本变换操作。同时，SVG 的变换属性还具备独特之处，比如通过 `<animateTransform>` 元素实现动画，并能利用 `transform` 属性进行复杂的矩阵变换。

  


虽然说，SVG 的变换属性与 CSS 中的变换属性非常类似，但它们也有一些明显的差异：

  


| **特征**     | **CSS 变换**                                                                 | **SVG 变换**                                                                                                                                                                                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **语法**     | `transform` 属性及对应的函数，如 `rotate()` 、 `scale()` 、 `translate()` 、 `skew()` 等 | `transform` 属性及对应的函数，如 `rotate()` 、 `scale()` 、 `translate()` 、 `skewX()` 和 `skewY()` 等                                                                                                                                                                                                                                  |
| **应用范围**   | 应用于所有HTML元素，包括但不限于文本、图像、区块等                                                | 专门应用于 SVG 图形元素：`<a>`、`<circle>`、`<clipPath>`、`<defs>`、`<ellipse>`、`<foreignObject>`、`<g>`、`<image>`、`<line>`、`<path>`、`<polygon>`、`<polyline>`、`<rect>`、`<switch>`、`<text>` 和 `<use>` 等十六个元素；其中 `<linearGradient>` 和 `<radialGradient>` 的 `gradientTransform` 和 `<pattern>` 的 `patternTransform` 属性的行为与 `transform` 完全相同 |
| **3D 变换**  | 支持3D变换，如 `translate3d()`, `rotate3d()`, `perspective()`等                   | 主要针对 2D 变换，不直接支持 3D 变换，但可通过组合 2D 变换模拟部分 3D 效果                                                                                                                                                                                                                                                                            |
| **单个变换**   | 支持单个变换属性，如 `translate` 、`rotate` 和 `scale`                                 | 不支持单个变换属性                                                                                                                                                                                                                                                                                                                |
| **变换中心点**  | CSS 变换默认基于元素的中心点进行（可以通过 `transform-origin` 改变）                             | SVG 变换默认基于元素自身的左上角（即画布坐标系的原点），但可以通过 `transform-origin` 属性自定义                                                                                                                                                                                                                                                             |
| **用户坐标系**  | 不涉及用户坐标系的变换                                                                | 涉及用户坐标系的变换，可改变元素在 SVG 画布上的位置和方向                                                                                                                                                                                                                                                                                          |
| **动画和过渡**  | 非常适合制作过渡效果和动画，支持CSS Transition 和 Animation                                 | 无法直接使用 SVG 变换属性实现动画和过渡效果，需要使用 SMIL 或 JavaScript 实现，但随着 SMIL 的逐渐弃用，推荐使用 CSS 动画                                                                                                                                                                                                                                            |
| **局部变换**   | 可以根据元素自身进行局部变换                                                             | 可以根据用户坐标系进行局部变换，影响其他元素的位置                                                                                                                                                                                                                                                                                                |
| **结合使用**   | 可以与 HTML 和 SVG 元素一起使用                                                      | 可以与 SVG 元素一起使用，无法直接用于 HTML 元素                                                                                                                                                                                                                                                                                            |
| **样式应用方式** | 可以通过 CSS 样式表或内联样式应用变换                                                      | 变换既可以作为 SVG 元素的内联属性 `transform` 存在，也可以通过 CSS 样式表应用                                                                                                                                                                                                                                                                       |
| **变换影响范围** | 影响整个元素及其内容（包括子元素）                                                          | 影响目标SVG图形元素本身及其图形内容                                                                                                                                                                                                                                                                                                      |

  


有几个点单独拎出来聊一聊。首先，CSS 变换属性的可用函数要比 SVG 属性多：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a069d70bd09041c7903a8effd1311ff9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2278&h=1257&s=679731&e=jpg&b=ffffff)

  


上图展示的是 CSS 变换属性（`transform`）可用的函数，按功能分，它分为旋转、位移、缩放、倾斜和透视等。它还可以按空间分，分为 2D 和 3D：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d8567a3564049e7baad6056acfc76c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2278&h=949&s=571358&e=jpg&b=ffffff)

  


注意，CSS 变换中还包括 2D 矩阵（`matrix()`）和 3D 矩阵（`matrix3d()`），上图中所列函数，都可以使用 `matrix()` 和 `matrix3d()` 来描述。

  


而 SVG 变换属性 `transform` ，它也分为位移、旋转、缩放、倾斜等，但它还不具备 3D 变换，至少现在还不具备。就这一点而言，可用于 SVG 变换属性 `transform` 的函数要比 CSS 变换函数少得多：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8485197204184b809ecba6517da39a47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=6164&h=2248&s=697544&e=png&b=ffffff)

  


  


除此之外，W3C 的 **[CSS 变换模块 Level 2](https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fcss-transforms-2%2F)** （CSS Transforms Module Level 2）为 CSS 的变换新增了一个特性，即 **[单个变换属性](https://juejin.cn/book/7223230325122400288/section/7259668493158023205)**。单个变换属性主要包括 `translate` 、`rotate` 和 `scale` 三个属性，分别映射 `transform` 属性的 `translate()` 、`rotate()` 和 `scale()` 三个函数。这个特性是 SVG 不具备的，到目前为止还没有任何 SVG 元素拥有 `translate` 、`rotate` 和 `scale` 属性。

  


其次，SVG 变换属性的所有函数的参数都必须是数字，这意味着我们无法再控制和组合单位了。例如，我们不能在 `translate()` 函数中使用百分比值，并且所有 `rotate()` 或 `skewX()` 或 `skewY()` 函数的角度值都必须用度数表示，我们无法使用 CSS 中提供的其他单位，比如 `grad` 、`turn` 等。

  


与 CSS 变换不同的是，SVG 的变换属性还涉及到用户坐标系的转换，这意味着你可以对元素的坐标系进行变换，从而改变元素在 SVG 画布上的位置和方向。这种坐标系的转换使得 SVG 变换属性在某些方面比 CSS 变换更加灵活和强大。

  


HTML 元素和 SVG 元素之间主要的不同之处在于元素自身的局部坐标系统。无论是 HTML 元素还是 SVG 元素，每个元素都有自己的坐标系统。对于 HTML 元素，该坐标系统的原点位于元素的中心位置 `(50% 50%)` ；而对于 SVG 元素，假设元素自身及其在元素内的所有祖先元素都没有应用任何变换，则原点默认位于 SVG 画布的左上角位置 `(0,0)` 。由于原点的不同，如果 SVG 元素的 `(50% 50%)` 位置与 SVG 画布的 `(0 0)` 点不重合，那么在执行 `roate` （旋转）、`scale` （缩放）或 `skew` （倾斜）变换后，将会产生不同的结果。

  


需要注意的是，尽管 SVG 主要关注 2D 图形，但它可以通过变换矩阵（`matrix()` ）实现复杂的 2D 变换，并且在特定场景下，SVG 也可以利用外部 CSS 样式表进行变换设置，与 HTML 元素的 CSS 变换语法保持一致。同时，在实际应用中，SVG 也可以通过组合不同的 2D 变换达到接近 3D 视觉效果的目的。

  


通常情况之下，将 SVG 变换与 CSS 变换结合使用，你可以创建出更加复杂和生动的图形效果。例如，你可以使用 CSS 变换来控制动画和过渡效果，同时使用 SVG 变换来实现更精细的变换操作，从而实现出更加华丽和引人注目的图形效果。

  


为了能更好的帮助大家理解 SVG 变换，接下来介绍 SVG 变换函数时，会将其与 CSS 变换进行对比，从可视化角度上向大家展示 CSS 变换与 SVG 变换的差异。

  


## 准备工作

  


接下来我们将使用以下模板展示SVG变换函数的效果：

  


```HTML
<div class="container">
    <!-- 1️⃣: 应用于 HTML 元素的 CSS变换 -->
    <div class="wrapper">
        <h3 style="color: #fff">CSS Transform (HTML)</h3>
        <div class="box html">
            <div class="element original"></div>
            <div class="element transform css"></div>
        </div>
    </div>
    
    <!-- 2️⃣：应用于 SVG 元素的 CSS 变换 -->
    <div class="wrapper">
        <h3>CSS Transform (SVG)</h3>
        <svg class="box">
            <rect class="element original" />
            <rect class="element transform css" />
        </svg>
    </div>
    
    <!-- 3️⃣: 应用于 SVG 元素的 SVG 变换 -->
    <div class="wrapper">
        <h3>SVG Transform</h3>
        <svg class="box">
            <rect class="element original" />
            <rect class="element transform" transform="translate(100, 50)" />
        </svg>
    </div>
    <!-- 4️⃣：SVG 元素同时应用 SVG 和 CSS 变换 -->
    <div class="wrapper">
        <h3>SVG & CSS Transform</h3>
        <svg class="box">
            <rect class="element original"  />
            <rect class="element transform css" transform="translate(100, 50)" />
        </svg>
    </div>
</div>
```

  


简要说明一下：

  


-   1️⃣：CSS 变换应用于 HTML 元素的效果
-   2️⃣：CSS 变换应用于 SVG 元素的效果
-   3️⃣：SVG 变换应用于 SVG 元素的效果
-   4️⃣：CSS 变换和 SVG 变换同时应用于同一个 SVG 元素的效果

  


命为 `.original` 的元素（带有 `50%` 透明度）表示 HTML 元素和 SVG 元素变换前的位置；命名为 `.transform` 的元素表示 HTML 元素和 SVG 元素应用变换后的位置。

  


```CSS
.css.transform {
    transform: translate(100px, 50px);
}

.element {
    width: 200px;
    height: 120px;
    background-color: oklch(0.6 0.21 276.66);
    fill: oklch(0.6 0.21 276.66);
    
    &.original {
        background-color: oklch(0.6 0.21 276.66 / .5);
        fill: oklch(0.6 0.21 276.66 / .5);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f098ffcfc6d4918a82fed1a3136dd6a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1744&s=623371&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/YzMLLro

  


关于变换，有一点我们必须理解，那就是它们在应用于嵌套元素时会产生累积效应。这意味着，对一个包含后代元素的元素进行变换时，不仅会影响到该元素本身，还会波及其所有的后代元素及其自身的坐标系统，以及对这些后代元素所做的任何变换效果。为了简化说明，在接下来的内容中，我们始终假设所讨论的元素都没有经过变换的祖先元素，同时也不包含任何后代元素。

  


## SVG 变换：平移（translate）

  


SVG 变推销中的平移（`translate`）是一种基本的几何变换，它允许你将 SVG 元素从当前位置移动到新的位置而不改变其形状或大小。平移操作通过沿着 `x` 轴和 `y` 轴移动元素的位置来实现。SVG 中有三种变换函数：

  


-   `translate(tx, ty)` ：将 SVG 元素沿着 `x` 轴移动 `tx` 的距离，并沿着 `y` 轴移动 `ty` 的距离。其中 `ty` 是可选值，如果未设置，它将默认为 `0`
-   `translateX(tx)` ：等同于 `translate(tx, 0)`
-   `translateY(ty)` ：等同于 `translate(0, ty)`

  


它们会根据以下公式改变对象的坐标：

  


```
/**
* (x,y)  👉 旧坐标
* (x′,y′) 👉 新坐标
*/

(x,y)⇒(x′,y′)=(x+tx,y+ty)
```

  


其工作原理是：

  


-   水平平移（`tx`）：指定正值将使元素沿着 `x` 轴向右移动，负值将使元素沿着 `x` 轴向左移动。
-   垂直平移（ty）：指定正值将使元素沿着 `y` 轴向下移动，负值将使元素沿着 `y` 轴向上移动。

  


例如：

  


```XML
<!-- 模板中的 3️⃣ -->
<svg>
    <rect class="element transform" transform="translate(170, 80)" />
</svg>
```

  


上面这个示例，矩形元素向右移动了 `170` 个单位，向下移动了 `80` 个单位。通常情况下，其中 `1` 个 SVG 用户单位等于 `1px` 。在语法规则上，SVG 变换的值也可以用空格分隔（`translate(170 80)` 与 `translate(170, 80)` 等效），而不仅仅是像 CSS 变换函数中用逗号分隔。

  


在这里，值也可以用空格分隔，而不仅仅是像类似的 CSS 变换函数中用逗号分隔。因此，在非常简单的情况下，其中 1 个 SVG 用户单位等于 1px，以下两种方式将等效地将一个 SVG 元素进行平移：

  


同样地，你也可以借助 CSS 变换中的 2D 平移函数：`translate(tx,ty)`、`translateX(tx)` 和 `translateY(ty)` —— 来对 SVG 元素执行平移操作。举例来说，你可在 CSS 样式中为 SVG 元素添加 `transform` 属性，如同下面所示，以达成与上面示例一致的平移效果：

  


```CSS
/* 模板中的 2️⃣ */
rect {
    transform: translate(170px, 80px);
}
```

  


值得留意的是，当 SVG 元素同时被赋予 SVG 变换属性和 CSS 变换属性进行平移时，CSS 变换中的平移指令将会覆盖原有的 SVG 变换平移设定。这意味着，如果你同时在 SVG 元素上使用 CSS 和 SVG 变换来平移元素，最终体现出来的平移效果将遵循 CSS 变换规则。

  


```XML
<!-- 模板中的 4️⃣ -->
<svg>
    <rect transform="translate(270, 180)" class="element transform css"  />
</svg>
```

  


```CSS
/* 模板中的 4️⃣ */
.css.transform {
    transform: translate(170px, 80px); /* 它将胜出 */
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9c3f9ece6814de29e08078f00d033a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1744&s=1014920&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/gOyzdKa

  


注意上图中 HTML 元素上应用的 CSS 变换（图中区块1️⃣）与其他 SVG 元素上应用的变换（不管是 CSS 变换还是 SVG 变换）最大区别在于坐标系的位置。对于 HTML 元素，坐标系原点位于元素中心 （`(50%,50%)`）位置；对于 SVG 元素，坐标系原点位于 SVG 画布的左上角（`(0,0)`）位置，如果元素没有通过 `x` 和 `y` 设置起点坐标，那么原点位于 SVG 画布的 `(0,0)` 点处。然而，在平移中，坐标系相对于元素的位置不影响元素的最终位置。

  


你可以尝试着调整下面示例中 `tx` 和 `ty` 的值，查看变换中的平移效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53c93f3eccff42efb7003cc5106635ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=880&s=3726641&e=gif&f=512&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/oNOdQVy

  


需要知道的是，CSS 的单个变换属性 `translate` 同样可以对 HTML 和 SVG 元素进行位移操作，但它并不会覆盖原有的 `transform` 属性，它将会有一个累积效应。例如：

  


```XML
<!-- 3️⃣:SVG Transform -->
<rect class="element transform" transform="translate(170, 80)" />

<!-- 4️⃣:SVG & CSS Transform -->
<rect class="element transform css" transform="translate(270, 180)" />
```

  


```CSS
@layer transform {
    .css {
        transform: translate(170px, 80px);
    }
    .transform {
        translate: -50px -30px;    
    }
}
```

  


应用变换的元素将会分两步执行：

  


-   首先会执行 `transform: translate(170px, 80px)` ，元素沿着 `x` 轴向右平移 `170px` ，沿着 `y` 轴向下平移 `80px`
-   然后会执行 `translate: -50px -30px` ，元素将从新位置（执行 `transform` 后的位置）沿着 `x` 轴向左平移 `50px` ，沿着 `y` 轴向上平移 `30px`

  


两次变换累积之后，元素相当于执行 `transform: translate(120px, 50px)` ，其等价于：

  


```CSS
.transform {
    transform: translate(170px, 80px) translate(-50px, -30px)；
    
    /* 等同于 
    * tx = tx1 + tx2 = 170px - 50px = 120px
    * ty = ty1 + ty2 = 80px - 30px = 50px
    */
    transform: translate(120px, 50px);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f2faf4b9a7c4551ad72939061c82343~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=886&s=5742635&e=gif&f=404&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/yLrjGPo

  


这也意味着，链式的 `translate()` 变换也是可以累积的，如 `translate(tx1, ty1) translate(tx2, ty2)` 等价于 `translate(tx1 + tx2, ty1 + ty2)` 。请注意，这仅在两个 `translate()` 是连续的情况下成立，没有其他类型的变换在两者之间链接。正如，示例中 `translate(-50px, -30px)` 所示，可以通过 `translate(-tx,-ty)` 对元素进行反向平移。

  


与 HTML 元素不同的是，SVG 有些元素是具有 `x` 、`y` 、`cx` 、`cy` 、`dx` 和 `dy` 属性的，它们都可以用于设置元素在 SVG 画布中的位置。通常情况下，这些属性所起作用与 `translate()` 是相似的。以 SVG 中的 `<rect>` 和 `<circle>` 元素为例：

  


```XML
<svg class="translate">
    <!-- 通过 x, y, cx, cy 模拟平移 -->
    <rect x="60" y="50" width="230" height="120" />
    <circle cx="205" cy="250" r="50" />
    
    <!-- x,y,cx,cy 为 0, 通过 translate 平移元素 -->
    <rect x="0" y="0" width="230" height="120" transform="translate(60, 50)" />
    <circle cx="0" cy="0" r="50" transform="translate(205, 250)" />
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/286dbe61b54348e8813727c7d496f112~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=620&s=1465502&e=gif&f=186&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/ZEZRYQK

  


## SVG 变换：旋转（rotate）

  


你可能已经发现了，CSS 变换应用于 HTML 或 SVG 元素上的平移，或者是 SVG 变换应用于 SVG 元素上的平移，在效果上似乎是一样的，看不出它们之间的差异。但是，变换中的旋转，你就开始能感受到它们之间会存在巨大的差异。

  


与 CSS 变换中的 `rotate()` 函数一样，我们可以在 SVG 中使用 `rotate()` 函数将一个元素及其可能的后代元素围绕着一个固定点（一个在变换后位置保持不变的点）进行旋转。最终结果取决于这个固定点位置。例如：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect class="element transform" transform="rotate(45)"  x="50" y="50"/>

<!-- 4️⃣: SVG & CSS Transform -->
<rect class="element transform css" x="50" y="50" transform="rotate(60)"/>
```

  


```CSS
/* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
@layer transform {
    .css {
        transform: rotate(45deg);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e58bf66a4bc045158afa972043cf5ff6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1744&s=1062955&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/YzMvXWy

  


正如上图所示，在 HTML 情况下（上图区块 1️⃣ ），元素坐标系的原点位于元素中心位置 `(50%, 50%)` ，因此元素将围绕这个点进行旋转。然而，在 SVG 情况下，原点位于 SVG 画布的左上角 `(0,0)` 位置，因此 SVG 元素将围绕这个点进旋转。

  


这样的结果与我们熟悉的 CSS 旋转效果是完全不一样的，SVG 的旋转 `rotate(a)` 有着自己的数学计算模式。例如，以指定的角度（`a`）绕原点 `(x,y)` 旋转：

  


```
/**
* (x,y)  👉 旧坐标
* (x′,y′) 👉 新坐标
* a 👉 旋转
*/

(x,y)⇒(x′,y′)=((cos(a)*x − sin(a)*y),(sin(a)*x + cos(a)*y))
```

  


这个公式是一个二维向量旋转变换的数学表达式，它描述了一个点在直角坐标系中绕原点逆时针旋转角度 `a` 后的坐标变换关系。具体来说：

  


-   `(x, y)` 是原坐标系中的点坐标。
-   `(x', y')` 是将原点 `(0, 0)` 为中心，将点 `(x, y)` 旋转角度 `a` 后得到的新坐标。

  


公式的每部分含义如下：

  


-   第一部分 `(cos(a)⋅x - sin(a)⋅y)` 表示新坐标系下的横坐标 `x'`。其中 `cos(a)` 是旋转角度 `a` 的余弦值，`sin(a)` 是旋转角度 `a` 的正弦值。原横坐标 `x` 乘以余弦值 `cos(a)` 反映了它在新坐标系下的水平投影，纵坐标 `y` 乘以负的正弦值 `-sin(a)` 反映了它在新坐标系下转化为水平方向的部分。
-   第二部分 `(sin(a)⋅x + cos(a)⋅y)` 表示新坐标系下的纵坐标 `y'`。原横坐标 `x` 乘以正弦值 `sin(a)` 反映了它在新坐标系下的竖直投影增加的部分，而原纵坐标 `y` 乘以余弦值 `cos(a)` 则反映了它在新坐标系下保留的竖直方向的部分。

  


因此，整个公式实际上是根据二维旋转变换的几何特性，将原来坐标 `(x, y)` 经过适当的线性运算转换到了旋转后的新坐标 `(x', y')` 上。在计算机图形学、物理学、工程学等领域中，这个公式是非常常见的，用于描述对象在二维空间中的旋转动作。

  


`rotate()` 函数的值可以是正负值，如果值是正值，元素围绕着固定点顺时针旋转，反之则逆时针旋转。你可以尝试着调整下面示例中的角度值，查看随角度变化的旋转效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/754db8e655f849df8e04ea62f1f533b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=868&s=3507772&e=gif&f=344&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/dyLKoQp

  


与 CSS 变换的旋转函数不同的是，SVG 变换的 `rotate()` 函数的值是不带单位的，默认为 `deg` 单位，而 CSS 的 `rotate()` 函数的角度值可以用 `deg` （度）、`rad` （弧度）、`trun` （圈）和 `grad` (梯度)表示。另外，CSS 的 `rotate()` 函数可以是 `calc()`数学表达到，例如 `calc(.25turn - 30deg)` ，还可以是[ CSS 比较函数表达式](https://juejin.cn/book/7223230325122400288/section/7241401565653762108)，例如 `clamp(30deg, .2turn + 45deg, 135deg)` 。这个在 SVG 变换的 `rotate()` 函数中是做不到的。

  


与前面所介绍的平移变换相似，CSS 的单个变换中也提供了 `rotate` 属性，它不会覆盖 `transform` 属性的 `rotate()` 函数，只会在这个基础上累积旋转效果。例如：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect class="element transform" transform="rotate(45)"  x="50" y="50"/>

<!-- 4️⃣: SVG & CSS Transform -->
<rect class="element transform css" x="50" y="50" transform="rotate(60)"/>
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: rotate(45deg);
    }
    
    /* CSS 变换应用于 1️⃣、2️⃣、3️⃣、 4️⃣*/
    .transorm {
        rotate: -60deg;
    }
}
```

  


应用变换的元素将会分两步执行：

  


-   首先会执行 `transform: rotate(45deg)` ，元素围绕着固定点顺时针旋转 `45deg`
-   然后会执行 `rotate: -60deg` ，元素将围绕着固定点逆时针旋转 `60deg`

  


两次变换累积之后，元素相当于执行 `transform: rotate(-15deg)` ，其等价于：

  


```CSS
.transform {
    transform: rotate(45deg) rotate(-15deg)；
    
    /* 等同于 
    * a = a1 + a2 = 45deg - 60deg = -15deg
    */
    transform: rotate(-15deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61b01d12b8ae438cbc67357655da4e4f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=876&s=5959981&e=gif&f=351&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/jORKbPJ

  


这也意味着，链式的 `rotate()` 变换围绕同一固定点是可以累积的，就像 `translate()` 函数一样。例如 `rotate(a1) rotate(a2)` 等同于 `rotate(a1 + a2)` 。其前提条件是，只有在两个旋转是连续的情况下，中间没有其他类型的变换，这种相加才是有效的。另外，`rotate(a) rotate(-a)` 将会使元素保持在原位，不会有任何角度的旋转。

  


SVG 变换的旋转函数还有一点与 CSS 旋转函数有所不同，SVG 的旋转函数除了可以设置旋转角度值之外，还可以设置元素旋转的坐标点，即 `rotate(a, [cx, cy])` ，使元素围绕着坐标点 `(cx,cy)` 旋转指定的角度（`a`）：

  


-   `a`：旋转的角度，以度为单位。正值表示顺时针旋转，负值表示逆时针旋转。
-   `cx`：旋转中心点的 `x` 坐标（可选）。如果未指定，默认为 `0`。
-   `cy`：旋转中心点的 `y` 坐标（可选）。如果未指定，默认为 `0`。

  


如果未指定坐标 `(cx,cy)`，则旋转将围绕初始坐标系统的点 `(0, 0)` 进行。围绕指定点 `(cx, cy)` 旋转的角度`a`；等同于 `translate(cx, cy) rotate(a) translate(-cx, -cy)` :

  


```
rotate(a, cx, cy) = translate(cx, cy) rotate(a) translate(-cx, -cy);
```

  


与 `translate()` 函数类似，参数可以用空格分隔或逗号分隔。

  


需要注意的是：仅指定角度和 `cx` 参数会使值无效，并且不会应用 SVG 旋转。请注意，`cx` 和 `cy` 参数的存在并不意味着坐标系的原点被移动到该点。坐标系，就像元素本身（及其可能的后代）一样，只是围绕 `(cx cy)` 点旋转。

  


对于 CSS 的 `rotate()` 函数，我们可以通过指定 `transform-origin` 属性的值为 `cx cy` 来模拟 SVG 的 `rotate(a, cx, cy)` 函数。需要知道的是，`transform-origin` 属性取长度值时，它是相对于元素坐标系的，但百分比值是相对于元素本身的。例如：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect class="element transform" transform="rotate(45, 50, 50)"  x="50" y="50"/>

<!-- 4️⃣: SVG & CSS Transform -->
<rect class="element transform css" x="50" y="50" transform="rotate(60, 50, 50)"/>
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: rotate(45deg);
        transform-origin: 50px 50px;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbc441042e8943b79a6ec181b25e0f66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=870&s=2717012&e=gif&f=267&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/eYoKpXB

  


看上去似乎符合我们的预期。但是，有一些事情，我们需要记得。

  


首先，CSS 的 `transform-origin: cx cy` 指定的原点和 `rotate(a, [cx, cy])` 函数内指定的固定点不是相同的。例如：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect class="element transform" transform="rotate(45, 150, 110)"  x="50" y="50" width="200" height="120" />

<!-- cx = 50 + 200 ÷ 2 = 150 -->
<!-- cy = 50 + 120 ÷ 2 = 110 -->
```

  


上面的代码，通过修正 `rotate(a, [cx, cy])` 函数中的 `cx` 和 `cy` 的值，使得 SVG 元素 `<rect>` 围绕自身的中心点旋转 `45deg` 。 HTML 元素（模板 1️⃣）和另外两个 SVG 元素（模板2️⃣ 和 4️⃣）则通过 `transorm-origin: 50% 50%` 来设置元素围绕着元素自身的中心点旋转 `45deg` ：

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: rotate(45deg);
        transform-origin: 50% 50%;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31cd7294d0874400b2e21126218e9fc4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1809&s=1135383&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/ExJRPKo

  


这显示了两者之间的差异。使用 CSS 变换时，元素坐标系首先从 SVG 画布的 `(0,0)` 点移动到元素的 `(50%,50%` 点，然后元素顺时针旋转 `45deg` （上图中的 2️⃣ 和 4️⃣）；使用 SVG 变换属性时，元素及其坐标系仅仅围绕 `rotate()` 函数的 `cx` 和 `cy` 参数指定的点旋转，示例中的 `cx` 和 `cy` 是根据元素 `<rect>` 的位置（`x,y`）和宽高计算得到的，使之位于元素的中心点。元素的坐标系原点仍然位于元素外部，这个原点会影响任何持续依赖它的变换。

  


为了更好地理解这一点，我们在上面的示例上稍微调整一下，在第一个旋转后面再添加另一个旋转，旋转的角度值为 `-45` （相反方向旋转）：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect class="element transform" transform="rotate(45, 150, 110) rotate(-45)"  x="50" y="50" width="200" height="120" />

<!-- cx = 50 + 200 ÷ 2 = 150 -->
<!-- cy = 50 + 120 ÷ 2 = 110 -->
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: rotate(45deg) rotate(-45deg);
        transform-origin: 50% 50%;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c819dd8de10f4618b73ab05769fcc058~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1753&s=926673&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/qBwKZwZ

  


不难发现，使用 CSS 变换并将 `transform-origin: 50% 50%` 的元素，两个旋转相互抵消，最终回到元素的初始位置；但是当使用 SVG 变换属性时，我们围绕的固定点从一个旋转到另一个旋转不同，第一个旋转围绕着元素的 `(50%,50%)` 点（在这个示例中是 `(150, 110)` ，这是计算出来的，相当于 `50% 50%` ），而第二个旋转围绕着坐标系原点 `(0,0)` 。因此，最终结果，旋转的角度是相互抵消了，但呈现的效果却有点类似于 `translate()` 。在这种情况下，我们需要使用 `rotate(-45, 150, 110)` 而不是直接使用 `rotate(-45)` 来反转旋转。

  


然而，这并不改变我们只有一个 `transform-origin` 的事实（虽然你可以在样式表不同位置为同一个元素的 `transform-origin` 属性设置不同的值，但根据 CSS 的级联规则，最终只会有一个 `transform-origin` 胜出，被用于元素上。这意味着，元素的坐标系只有一个原点），但是当使用 SVG 变换时，我们可以应用多个旋转，每个旋转都可以有自己的旋转原点。因此，如果我们想先将矩形围绕着其右下角旋转 `90` 度，然后再围绕着其右角上角旋转 `90` ，使用 SVG 的变换，可以很容易就实现，我们只需要为每个 `rotate()` 函数指定不同的 `cx` 和 `cy` 值：

  


```XML
<svg>
    <rect class="original"  width="200" height="100" x="0" y="200" />
    <rect transform="rotate(90, 200, 300) rotate(90,200, 100)" class="transform" width="200" height="100" x="0" y="200" />
    <!--
        第一个旋转的原点，矩形右下角：
        cx1 = x + width = 0 + 200 = 200
        cy1 = y + height = 200 + 100 = 300
        
        第二旋转的原点，矩形右上角
        cx2 = x + width = 0 + 200 = 200
        cy2 = y = 100
    -->
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/560045fd77ea48edabcd7e98ad7e5a3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1257&s=197586&e=jpg&b=050505)

  


> Demo地址：https://codepen.io/airen/full/KKYeMML

  


来看一个简单的案例。不知道大家是否还记得，我在《[初级篇：组织 SVG](https://juejin.cn/book/7341630791099383835/section/7348735226207535138)》一节课中介绍了制作五角星勋章的案例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7d45bebe77242afabab24def33e5962~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1074&s=226497&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/ZEZRpXX

  


制作这个五角星，就需要应用到变换中的旋转。制作的是同一个五角星，但在这里将应用一些新学到的知识，运用一些新方法来制作五角星。

  


-   首先使用一个 `<polygon>` 制作五角星中最基础单元，即其中一个角（前面课中应用了两个 <`polygon>`）
-   使用线性渐变 `<linearGradient>` 来填充 `<polygon>` ，使其看起来有立体感
-   使用 `<symbol>` 实例化 `<polygon>` ，随后使用 `<use>` 引用 `<symbole>` 实例化的角
-   在 `<use>` 使用 `transform` 旋转角，最终拼接成一个五角星

  


具体代码如下：

  


```XML
<svg class="star">
    <defs>
        <linearGradient x1="0" y1="0" x2="100%" id="linearGradient">
            <stop stop-color="oklch(0.51 0.21 25.91)" offset=".5" />
            <stop stop-color="oklch(0.64 0.21 39.08)" offset=".5" />
        </linearGradient>
        <symbol id="arm" viewBox="-100 -100 200 200">
            <polygon points="0,0 36.4,-50 0,-100 0,0 -36.4,-50 0,-100" fill="url(#linearGradient)"  />
        </symbol>
    </defs>
  
    <use href="#arm"/>
    <use href="#arm" transform="rotate(72)"/>
    <use href="#arm" transform="rotate(144)"/>
    <use href="#arm" transform="rotate(216)"/>
    <use href="#arm" transform="rotate(288)"/>
</svg>
```

  


请别忘了将 `<use>` 的 `transform-origin` 设置为 `50% 50%` ：

  


```CSS
.star {
    display: block;
    width: 80vh;
    aspect-ratio: 1;
    
    use {
        transform-origin: 50% 50%;
    }
}
```

  


就是这么简单，[你可以对比一下前面的示例](https://codepen.io/airen/full/YzMZKLV)。

  


```XML
<!-- 之前方案 -->
<svg viewBox="-100 -100 200 200" class="star">
    <defs>
        <g id="arm">
            <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
            <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
        </g>
    </defs>
    <g class="arms" transform="translate(0,10)">
        <use href="#arm"  />
        <use href="#arm" transform="rotate(72)" />
        <use href="#arm" transform="rotate(144)" />
        <use href="#arm" transform="rotate(216)" />
        <use href="#arm" transform="rotate(288)" />
    </g>
</svg>
```

  


感兴趣的小伙伴，不妨挑战一下自己，应用已掌握的 SVG 知识，实现下图中任一图 案：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9eda22a890e4d77b0ed11834475b3ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=938&s=665369&e=jpg&b=f9f8f8)

  


## SVG 变换：缩放（scale）

  


当使用 CSS 的 `transform` 时，针对 2D 空间，我们可以使用 `scale(sx [,sy])` 、`scaleX(sx)` 或 `scaleY(sy)` 中的任一函数控制元素的缩放：

  


-   `scale(sx [,sy])` 函数使元素沿着 `x` 轴按 `sx` 的比例缩放，沿着 `y` 轴按 `sy` 的比例缩放。其中 `sy` 是可选值，如果不指定，则默认为 `sx` 的值，表示 `x` 轴和 `y` 都按相同的比例缩放。
-   `scaleX(sx)` 函数等同于 `scale(sx, 1)` ，使元素仅沿着 `x` 轴按 `sx` 的比例缩放
-   `scaleY(sy)` 函数等同于 `scale(1, sy)` ，使元素仅沿着 `y` 轴按 `sy` 的比例缩放

  


`sx` 和 `sy` 始终是无单位数值，其中值大 `1` 将会放大元素，小于 `1` 则会缩小元素，值为 `0` 时，元素会被缩小到不可见。另外，它的值也可以是负值，当值为 `-1` 时，可以实现元素镜像翻转。

  


注意，如果在缩放之前应用了其他变换，那么 `x` 轴和 `y` 轴可能不再是水平和垂直方向。

  


与 CSS 变换中的缩放相比，SVG 的缩放函数只有 `scale(s)` 和 `scale(sx, sy)` 两种，其中 `sy` 是可选值。

  


```
scale(s) 👉 (x,y)⇒(x′,y′)=(s*x,s*y)

scale(sx, sy) 👉 (x,y)⇒(x′,y′)=(sx*x,sy*y)
```

  


这两个公式分别描述了在二维空间中对点坐标进行缩放变换的数学规则，即 SVG 中的缩放变换函数的工作原理：

  


-   对于 `scale(s)` 函数，它表示对元素进行等比例缩放，其中 `s` 是缩放因子。公式 `(x,y)⇒(x′,y′)=(s*x,s*y)` 表示了缩放前后元素坐标的变化关系，其中 `(x, y)` 是原始坐标，`(x', y')` 是缩放后的坐标。这个公式说明了，对一个点 `(x, y)` 进行等比例缩放的操作，缩放因子为 `s`。在二维空间中，这个操作会使得原点 `(x, y)` 沿着 `x` 轴和 `y` 轴分别按相同的比例 `s` 进行缩放。所以，缩放后的新坐标 `(x′, y′)` 就是原坐标的 `x` 和 `y` 分量分别乘以 `s` 。
-   对于 `scale(sx, sy)` 函数，它表示对元素进行非等比例缩放，也就是所谓的方向缩放。这里的缩放因子有两个，分别是 `sx` 和 `sy`，分别对应 `x` 轴和 `y` 轴方向上的缩放比例。公式 `(x,y)⇒(x′,y′)=(sx*x,sy*y)` 描述了缩放前后元素坐标的变化关系，其中 `(x, y)` 是原始坐标，`(x', y')` 是缩放后的坐标。这个公式说明了，在进行非等比例缩放时，对于点 `(x, y)`，在 `x` 轴方向上按 `sx` 倍进行缩放，在 `y` 轴方向上按 `sy` 倍进行缩放。因此，缩放后的新坐标 `(x′, y′)` 分别为原 `x` 坐标乘以 `sx`，原 `y` 坐标乘以 `sy`。

  


与 `translate()` 和 `rotate()` 函数相似，`scale()` 函数的值也可以用空格分隔，而不只是用逗号分隔。

  


  


```XML
<!-- 3️⃣: SVG Transform -->
<rect transform="scale(2, 1.5)" x="75" y="80" class="element transform" id="js-transform"  />

<!-- 4️⃣: SVG & CSS Transform -->
<rect transform="scale(1.2, 2)" x="75" y="80" class="element transform css"  />
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: scale(2, 1.5);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ff9c795476e461a9ade9728a60820ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1744&s=966291&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/KKYeadY

  


上图展示了 HTML 情况（区块1️⃣）与 SVG 情况（区块2️⃣、3️⃣、 4️⃣）的对比。在这两种情况下，我们都采用了 `(sx,sy)` 缩放因子（其中 `x` 轴的缩放因子 `sx=2` ，`y` 轴的缩放因子 `sy=1.5` ）来缩放元素。不同之处在于元素坐标系原点位置，在 HTML 中，原点位于元素的 `(50%,50%)` 点，而在 SVG 中，原点位于 SVG 画布的 `(0,0)` 点。

  


正如你所看到的，在 SVG 中，缩放变换（`scale()`）通过按照指定的比例因子改变元素的尺寸，同时也会影响到元素坐标系的原点以及可能存在的所有后代元素。除非在所有方向的缩放因子都相同（这种情况称为均匀缩放），否则元素的形状不会保持不变。

  


`scale()` 函数的缩放因子在 `(-1,1)` 范围内会使元素收缩，而在该范围之外的缩放因子则会让元素放大。负的缩放因子不仅改变元素尺寸，还会在元素的原点处进行点反射（镜像翻转）。如果只有一个方向的缩放因子不等于 `1` ，那么就会发生方向性缩放。尝试着拖动下面示例中的滑块，改变缩放因子，查看元素的相应变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6a95eb96d1547449df9a4f04d3f631f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=878&s=2673444&e=gif&f=363&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/PogaQzb

  


使用 CSS 变换，我们可以在 SVG 元素上设置适当的 `transform-origin` ：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect transform="scale(2, 1.5)" x="75" y="80" class="element transform" id="js-transform"  />

<!-- 4️⃣: SVG & CSS Transform -->
<rect transform="scale(1.2, 2)" x="75" y="80" class="element transform css"  />
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: scale(2, 1.5);
        transform-origin: 50% 50%;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61df82aea6c647d2926080b4a9fb992f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=874&s=2500062&e=gif&f=356&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/ZEZRryq

  


SVG 缩放变换（`scale()`）与旋转变换（`rotate()`）在坐标上都令人感到迥异，与 HTML 元素上应用 CSS 变换是两回事。但 SVG 旋转变换 `rotate()` 自带了 `cx` 和 `cy` 参数，至少可以通过计算来确定旋转点的位置，还可以得到我们想要的结果。但是，`scale()` 变换，就没那么容易了，它没有提供类似 `rotate()` 的 `cx` 和 `cy` 参数。如果我们要实现根据某个点（类似 CSS 变换中的 `transform-origin` 属性指定的点）进行缩放时，还需要使用 `translate` 进行手动偏移。例如，你希望下面这个 SVG 元素居中缩放：

  


```XML
<svg class="rotate">
    <rect class="original" x="200" y="100" width="200" height="100" fill="oklch(0.6 0.21 276.66 / .5)"/>
    <rect transform="translate(300, 150) scale(2, 1.5) translate(-300, -150)" class="transform" x="200" y="100" width="200" height="100" fill="oklch(0.6 0.21 276.66 / .5)"/>
  
    <!-- 
        计算 translate 位移坐标，将 SVG 原点移动到元素中心位置
        x' = x + width ÷ 2 = 200 +  200 ÷ 2 = 300
        y' = y + height ÷ 2 = 100 + 100 ÷ 2 = 150
    -->
</svg>
```

  


使用 `translate()` 将 SVG 坐标原点位置平移到元素的中心坐标位置，然后再使用 `scale()` 函数对元素进行缩放，之后再使用 `translate()` 函数再将 SVG 坐标原点反方向还原回去。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb7410782c78481f87fa2d4ee2f4f2be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1744&s=737121&e=jpg&b=050505)

  


[@Ana Tudor 在 Codepen 有一个案例](https://codepen.io/thebabydino/full/pvXyOW)，演示了链接方法的工作方式：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f81bcf66e1e4259b6a85b409ecb9ab1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1172&h=512&s=2262984&e=gif&f=328&b=ffffff)

  


> Demo 地址：https://codepen.io/thebabydino/full/pvXyOW （来源于 [@Ana Tudor](https://codepen.io/thebabydino/full/pvXyOW) ）

  


与平移和旋转变换类似，CSS 还提供了单个变换的 `scale` 属性，它也不会覆盖 `transform` 的 `scale()` ，要是同时设置了 `transform: scale()` 和 `scale` ，它们只会有一个累积效应：

  


  


```XML
<!-- 3️⃣: SVG Transform -->
<rect class="element transform" transform="scale(1.2)"  x="50" y="50"/>

<!-- 4️⃣: SVG & CSS Transform -->
<rect class="element transform css" x="50" y="50" transform="scale(1.5)"/>
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: scale(1.2);
    }
    
    /* CSS 变换应用于 1️⃣、2️⃣、3️⃣、 4️⃣*/
    .transorm {
        scale: 1.1;
    }
}
```

  


应用变换的元素将会分两步执行：

  


-   首先会执行 `transform: scale(1.2)` ，元素沿着 `x` 和 `y` 轴会放大 `1.2` 倍
-   然后会执行 `scale: 1.1` ，元素将在前一个变换基础上继续沿着 `x` 轴和 `y` 轴放大 `1.1` 倍

  


两次变换累积之后，元素相当于执行 `transform: scale(1.2) scale(1.1)` ，其等价于：

  


```CSS
.transform {
    transform: scale(1.2) scale(1.1)；
    
    /* 等同于 
    * s = s1 x s2 = 1.2 x 1.1 = 1.32
    */
    transform: scale(1.32);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e3a3621f8eb4ae48f843c62cbd81dc4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=886&s=3660436&e=gif&f=256&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/VwNdXOx

  


正如你所看到的，两个连续的 `scale()` 变换 `scale(sx1,sy1) scale(sx2, sy2)` 可以写成 `scale(sx1*sx2, sy1*sy2)` 。注意，`scale()` 的反转与 `translate()` 和 `rotate()` 都不一样，反转一个 `scale(sx1,sy1)` 变换是通过 `scale(1/sx1, 1/sy1)` 完成的。

  


## SVG 变换：倾斜（skew）

倾斜变换是一种对元素沿着特定轴进行倾斜的操作，它会导致元素上的每个点（除了位于倾斜轴上的点）在该方向上发生位移，而位移的量取决于倾斜的角度和该点与倾斜轴之间的距离。这意味着只有沿着倾斜轴的坐标会发生变化，而沿着另一轴的坐标则保持不变。

  


不同于平移（`translate()`）或旋转（`rotate()`）变换，倾斜变换会使元素发生扭曲，将正方形变为非等边的平行四边形，将圆变为椭圆。倾斜无法保持角度，例如，对于倾斜角度为 `α` 的矩形元素，其 `90°` 角会变为 `90°±α`，同时也无法保持与倾斜轴不平行的任何线段的长度。但是，元素的面积会保持不变。

  


SVG 中的倾斜变换主要有 `skewX(a)` 和 `skewY(a)` ，它们分别用于沿着 `x` 轴和 `y` 轴倾斜变换：

  


```
skewX(a) 👉 (x,y)⇒(x′,y′)=((x+tan(a)*y),y)
skewY(a) 👉 (x,y)⇒(x′,y′)=(x,(tan(a)*x+y))
```

  


这两个公式描述了倾斜变换函数 `skewX(a)` 和 `skewY(a)` 的作用：

  


-   对于 `skewX(a)` 函数，将元素沿 `x` 轴倾斜一个角度 `a` 。公式为 `(x,y)⇒(x′,y′)=((x+tan(a)*y),y)`。这意味着当倾斜角度为 `a` 时，元素中的每个点 `(x, y)` 在 `x` 轴方向上都会按照 `tan(a) * y` 的量发生位移，而 `y` 轴上的位置保持不变。
-   对于 `skewY(a)` 函数，将元素沿 `y` 轴倾斜一个角度 `a` 。公式为 `(x,y)⇒(x′,y′)=(x,(tan(a)*x+y))`。这意味着当斜切角度为 `a` 时，元素中的每个点 `(x, y)` 在 `y` 轴方向上都会按照 `tan(a) * x` 的量发生位移，而 `x` 轴上的位置保持不变。

  


这些公式描述了倾斜操作如何在元素中的每个点上产生位移，从而改变了元素的形状。倾斜操作会导致元素的形状发生变化，而不像平移或旋转那样保持形状不变。倾斜不会保持角度或线段的长度，但会保持元素的面积。

  


注意，SVG 倾斜变换中没有 `skew()` 函数，这是与 CSS 的倾斜变换最大差异之一。

  


下面的示例将展示倾斜如何运作的，先来看 `skewX(a)` 变换函数，观察倾斜是如何影响初始矩形元素的：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect transform="skewX(45)" x="75" y="80" class="element transform" id="js-transform"  />

<!-- 4️⃣: SVG & CSS Transform -->
<rect transform="skewX(60)" x="75" y="80" class="element transform css"  />
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: skewX(45);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99140250718c4488baf1d78a87c2e110~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=886&s=2165103&e=gif&f=186&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/gOyKzeY

  


正如你所看到的，`skewX(a)` 变换会使元素沿着 `x` 轴进行倾斜，对于元素上的任何点，其 `y` 坐标保持不变，而 `x` 坐标的变化量 `d` 取决于倾斜角度（`a`）和固定的 `y` 坐标。顶部和底部边缘（以及任何与 `x` 轴平行的线段）保持相同的长度，而随着倾斜角度的增大，左右两边边缘会变得更长，在 `±90°` 角度时趋于无限大。一旦超过这个值，它们又会开始变短，直到 `±180°` 角度时恢复到原来的长度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e14e2757ced94d9dbf73ece30069757f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1744&s=1003960&e=jpg&b=050505)

  


上图展示了 HTML 和 SVG 两种情况下元素沿着 `x` 轴倾斜的情况。在这两种情形中，我们采用了相同的倾斜角度（`a = 45deg`），但不同之处在于元素坐标系原点位置。在 HTML 中，元素的原点位于元素的中心位置 `(50%,50%)` ，而在 SVG 中，原点位于 SVG 画布的左上角 `(0,0)` 位置。

  


为了更好理解，请关注元素的右上角。在这两种情况下，`y` 坐标保持不变，即点不会在垂直方向上移动，只会在水平方向上移动。然而，可以观察到，在 HTML 中，这个角会向左（`x` 轴的负方向）移动，而在 SVG 中，这个角则向右（`x` 轴的正方向移动）。并且，在 HTML 和 SVG 中，右下角都会随着倾斜向右移动。

  


造成这种差异的原因在于右上角 `y` 坐标的符号（正负值）。在 HTML 中，元素坐标系原点位于元素的 `(50%,50%)` 点，此时元素右上角的 `y` 坐标因 `y` 轴朝下而为负值。而 SVG 中，元素坐标系原点位于 SVG 画布的 `(0,0)` 点，元素右上角的 `y` 坐标为正值。这意味着在 HTML 中，我们会向右上角的初始 `x` 坐标添加一个负值，导致它向左移动；而在 SVG 中，我们会向右上角的初始 `x` 坐标添加一个正值，导致它向右移动。

  


接着将上面示例中的 `skewX(a)` 变换函数更换为 `skewY(a)` 函数，观察倾斜是如何影响初始矩形元素的：

  


```XML
<!-- 3️⃣: SVG Transform -->
<rect transform="skewY(45)" x="75" y="80" class="element transform" id="js-transform"  />

<!-- 4️⃣: SVG & CSS Transform -->
<rect transform="skewY(60)" x="75" y="80" class="element transform css"  />
```

  


```CSS
@layer transform {
    /* CSS 变换应用于1️⃣、2️⃣、 4️⃣ */
    .css {
        transform: skewY(45);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edf1388519ac4b4f8a8ff427f24630f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=944&h=884&s=3534808&e=gif&f=340&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/abxKKGe

  


`skewY(a)` 变换会使元素沿着 `y` 轴倾斜，对于元素上的任何点，其 `x` 轴坐标保持不变，而 `y` 坐标的变化量 `d` 取决于倾斜角度和固定的 `x` 坐标。右侧和左侧边缘（以及任何与 `y` 轴平行的线段）保持相同的长度，随着倾斜角度的增大，上部和下部边缘会变得更长，在 `±90°` 角度时趋于无限大。一旦超过这个值，它们又会开始变短，直到 `±180°` 角度时恢复到原来的长度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/386ba66e39ee4f268aa96651694e7371~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1744&s=981952&e=jpg&b=050505)

  


需要知道的是，在 SVG 的倾斜变换中，倾斜角度是指应用变换后，变化轴的最终位置与初始位置之间的夹角，而不是我们进行倾斜的那个轴的角度。在 `[0°, 90°]` 范围内的正倾斜角会将与固定坐标轴同号的值添加到变化坐标轴的初始值上（即沿着倾斜轴的坐标），而 `[-90°, 0°]` 范围内的负值则会添加与固定坐标轴符号相反的值。

  


值得注意的是，使用角度 `α` 在 `[90°, 180°]` 区间进行倾斜的结果，等同于使用角度 `α - 180°`（落在 `[-90°, 0°]` 区间）进行倾斜的结果。同样地，使用角度 `α` 在 `[-180°, -90°]` 区间进行倾斜的结果，等同于使用角度 `α + 180°`（落在 `[0°, 90°]` 区间）进行倾斜的结果。

  


与平移或旋转不同，倾斜操作不具备可加性。即先沿某一轴以角度 `α1` 倾斜元素，再沿同一轴以角度 `α2` 再次倾斜，这并不等同于一次性沿该轴以角度 `α1 + α2` 进行倾斜。即 `skewX(α1) skewX(α2)` 的最终位置和`skewX(α1 + α2)` 是不一样的（位移和旋转不会这样子）。

  


另外一点，SVG 的 `skew()` 变换函数与 `scale()` 变换函数相似，如果希望元素按指点原点进行倾斜，需要像 `scale()` 函数一样，先使用 `translate()` 将坐标系原点为移动指定位置（例如元素中心点），然后再使用 `skewX()` 或 `skewY()` 对元素进行倾斜变换，最后再使用 `translate()` 将坐标系原点移回到初始位置。

  


```XML
<svg class="rotate">
    <rect transform="translate(300, 150) skewY(45) translate(-300, -150)" class="transform" x="200" y="100" width="200" height="100" fill="oklch(0.6 0.21 276.66 / .5)"/>
  
    <!-- 
        计算 translate 位移坐标，将 SVG 原点移动到元素中心位置
        x' = x + width ÷ 2 = 200 +  200 ÷ 2 = 300
        y' = y + height ÷ 2 = 100 + 100 ÷ 2 = 150
    -->
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/806e0dd4643345e1979fe27233e141a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=438&s=1730523&e=gif&f=258&b=ffffff)

  


> Demo 地址：https://codepen.io/thebabydino/full/VLwpgP （来源于 [@Ana Tudor](https://codepen.io/thebabydino) ）

  


## SVG 变换：矩阵（matrix）

  


与 CSS 变换一样，SVG 变换中也有矩阵变换，即 `matrix(a,b,c,d,e,f)` ，它是一种灵活的变换方法，用于对 SVG 图形进行平移、旋转、缩放和倾斜等变换。矩阵变换允许你以任意方式组合这些变换，从而实现更复杂的变换效果。

  


矩阵变换（`matrix(a,b,c,d,e,f)`）通过一个 `3x3` 的矩阵来描述变换操作。换句话说，它是一种通过矩阵乘法交一个矢量转换为另一个矢量的矩阵，因此它是应用于 SVG 变换（如平移、旋转、缩放和倾斜）的一种便捷工具。矩阵变换基于线性代数原理，这种数学方法优雅地表达了复杂的变换操作，使得具有数学背景的开发人员和设计师更容易处理 SVG 变换问题。

  


接下来，让我们更深入地探讨它是如何工作的！

  


矩阵变换是一个 `3x3` 的矩阵，它综合了平移、缩放、旋转和倾斜等多种变换。以下是各个元素所代表的意义：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/feee1214175b422bb5edbb8450b7a43e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=935&s=106438&e=jpg&b=050505)

  


-   `a` ：它可以是 `x` 方向上的缩放因子 `sx` ，或者表示旋转角度 `α` 的余弦值 `cos(α)`
-   `b` ：它可以是 `y` 方向上的倾斜因子 `tan(α)`，或者表示旋转角度 `α` 的正弦值 `sin(α)`
-   `c` ：它可以是 `x` 方向上的倾斜因子 `tan(α)` ，或者表示旋转角度 `α` 的负正弦值 `-sin(α)`
-   `d` ：它可以是 `y` 方向上的缩放因子 `sy` ，或者表示旋转角度 `α` 的余弦值 `cos(α)`
-   `e` ：沿着 `x` 方向的平移量 `tx`
-   `f` ：沿着 `y` 方向的平移量 `ty`

  


通过将矩阵变换与对象原有坐标点 `(x, y)` 相乘，可以得到变换后新坐标点 `(x', y')`：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4de93c81e934370ba9fc1996a4a05af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1361&s=684450&e=jpg&b=050505)

  


也就是说，我们原始的 `x` 转换后就变成 `a*x+c*y+e` ，原始的 `y` 转换后就变成 `b*x+d*y+f` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f86f0db30a841e3b54acd63cf9e320b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3232&h=1361&s=896135&e=jpg&b=050505)

在 SVG 中，可以通过 `transform` 属性中的 `matrix()` 函数更改对象，例如：`transform="matrix(a,b,c,d,e,f)"`。此处只能指定前六个值。因此，你向矩阵变换函数提供六个值来设置平移、缩放、旋转和斜切等操作。

  


### 平移矩阵

  


SVG 中 `translate(tx,ty)` 使元素沿着 `x` 轴和 `y` 轴称动 `tx` 和 `ty` 的距离。这种变换会移动元素坐标系的原点。我们可以使用 `matrix(1,0,0,1,tx,ty)` 来替代 `translate(tx,ty)` 转换为，平移矩阵结合 `tx` 和 `ty` 值，将元素沿 `x` 轴和 `y` 轴方向上移动。`matrix(1,0,0,1,tx,ty)` 的作用是根据以下公式改变对象的坐标轴：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d32c34604d2b4cba84c0f23dafe836a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4658&h=1821&s=1318766&e=jpg&b=050505)

  


```XML
<!-- 3️⃣ SVG: translate(tx,ty) -->
<rect transform="translate(170, 80)" class="element translate" id="js-translate"  />
<!-- 4️⃣ SVG: matrix(1,0,0,1,tx,ty) -->
<rect transform="matrix(1,0,0,1,170,80)" class="element matrix" id="js-matrix"  />
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b30d53f691e43ce9d1f3e2b0e9ff92c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=934&h=876&s=1583736&e=gif&f=195&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/VwNBwvP

  


### 缩放矩阵

  


`scale(s)` 或 `scale(sx[,sy])` 变换将使用缩放因子放大或缩小对象。缩放矩阵用于沿坐标轴均匀或非均匀地缩放对象。 如果缩放因子设置为不同的值，则对象的缩放不均匀，导致拉伸或收缩效果。缩放矩阵 `matrix(sx,0,0,sy,0,0)` ，其对应的公式如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b1a4103894d4ed884d4112d58c610bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4658&h=1821&s=1363136&e=jpg&b=050505)

  


```XML
<!-- 3️⃣ SVG: scale(sx,sy) -->
<rect transform="scale(2, 1.5)" class="element scale" id="js-scale"  />
<!-- 4️⃣ SVG: matrix(sx,0,0,sy,0,0) -->
<rect transform="matrix(2,0,0,1.5,0,0)" class="element matrix" id="js-matrix"  />
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e64a5d0b90c14b60911e162acffe79f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=878&s=2322472&e=gif&f=351&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/zYXLYwv

  


拖动滑块，你可以查看到均匀或非均匀地缩放元素的效果。

  


注意，SVG 缩放是相对于坐标系原点 `(0,0)` 进行的。如果 SVG 对象的点 `(cx,cy)` 不在原点，则应用缩放变换移动对象的位置，从视觉上给人移动的印象。为了围绕特点的中心点 `(cx,cy)` 进行缩放，你需要对缩放后的形状应用额外的移动，将其移动到中心点。组合了平移和缩放的完整矩阵 `matrix(sx,0,0,sy,cx*(1-sx),cy*(1-sy))` 。该矩阵将正确的围绕中心点 `(cx,cy)` 对对象进行缩放，而无需进行任何平移。`cx*(1-sx)` 和 `cy*(1-sy)` 系数处理了必要的平移，以确保对象在缩放后保持在原始位置。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a465b11651b4fefb98506c3ba64f781~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5170&h=1821&s=1696827&e=jpg&b=050505)

  


```XML
<!-- 
    围绕着 (cx,cy) => (100,50) 点进行缩放： matrix(sx,0,0,sy,cx*(1-sx),cy*(1-sy)) 
    cx = 100, cy = 50 
    sx = 2 , sy = 1.5 
    cx*(1-sx) = 100 x (1 - 2) = -100
    cy*(1-sy) = 50 x (1 - 1.5) = -25
-->
<rect transform="matrix(2,0,0,1.5,-200,-25)" class="element matrix" id="js-matrix"  />
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbf8ee59f83747f2945cc0cfa9590270~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=466&s=3011894&e=gif&f=668&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/MWRBWQW

  


### 旋转矩阵

  


在 SVG 中，我们可以通过 `rotate(α)` 和 `rotate(α,cx,cy)` 两个函数对元素进行旋转变换。同样的，我们可以将它们转换为相应的旋转矩阵。其中 `rotate(α)` 可以转换为 `matrix(cos(α),sin(α),-sin(α),cos(α),0,0)` ，其中 `α` 是围绕初始坐标系的点 `(0, 0)` 的角度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcaaa0243ce64e629d3f37193d4c2d36~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5464&h=1821&s=1812672&e=jpg&b=050505)

  


```XML
<!-- 3️⃣ SVG: rotate(α) -->
<rect transform="rotate(45)" class="element rotate" id="js-rotate"  />
<!-- 4️⃣ SVG: matrix(cos(α),sin(α),-sin(α),cos(α),0,0)  => α = 45
    α = 45
    α' =  α * Math.PI / 180
    a = cos(α') = cos(α * Math.PI / 180) = 0.7071
    b = sin(α') = sin(α * Math.PI / 180) = 0.7071
    c = -sin(α') = -sin(α * Math.PI / 180) = -0.7071
    d = cos(α') = cos(α * Math.PI / 180) =0.7071
    e = 0
    f = 0
-->
<rect transform="matrix(0.52532,0.85090,-0.85090,0.52532,0,0)" class="element matrix" id="js-matrix"  />
```

  


注意，`cos()` 和 `sin()` 函数来计算角度 `α` 的余弦值（`cos()`）和正弦值（`sin()`）。要将角度从度数转换为弧度（因为JavaScript中的三角函数接受弧度作为参数），可以使用以下公式：

  


```JavaScript
var alphaDegrees = 45;
var alphaRadians = alphaDegrees * Math.PI / 180;

var cosAlpha = Math.cos(alphaRadians);
var sinAlpha = Math.sin(alphaRadians);
```

  


这样，`cosAlpha` 将包含角度 α 的余弦值，`sinAlpha` 将包含角度 α 的正弦值。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5619c76bbefe4fd9ba6560730e8a4903~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=898&s=2537161&e=gif&f=225&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/WNWKbjv

  


我们还可以使用旋转矩阵 `matrix(cos(α), sin(α), -sin(α), cos(α), cx*(1-cos(α))+cy*sin(α), cy*(1-cos(α))-cx*sin(α))` 来替代 `rotate(α, cx, cy)` ，使元素围绕着 `(cx,cy)` 旋转 `α` 。其中 `cx*(1-cos(α))+cy*sin(α)` 和 `cy*(1-cos(α))-cx*sin(α)` 系数处理了必要的平移，以确保对象在旋转后保持在其原始位置。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb65fe16233a442fb78d11b577718908~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=6959&h=2266&s=2808206&e=jpg&b=050505)

  


```XML
<!-- 
    matrix(cos(α), sin(α), -sin(α), cos(α), cx*(1-cos(α))+cy*sin(α), cy*(1-cos(α))-cx*sin(α)) 
    α  = 45deg
    cx = 100
    cy = 50
    α' = α * Math.PI / 180 = 45 * Math.PI / 180 = 7.853981633974483
        
    a = cos(α) = Math.cos(α') = Math.cos(45 * Math.PI / 180) = 0.7071067811865476
    b = sin(α) = Math.sin(α') = Math.sin(45 * Math.PI / 180) = 0.7071067811865475
    c = -sin(α) = -0.7071067811865475
    d = cos(α) = 0.7071067811865475
    e = cx*(1-cos(α))+cy*sin(α) = 100 * (1 - 0.7071067811865475) + 50 * 0.7071067811865475 = 64.64466094067262
    f = cy*(1-cos(α))-cx*sin(α) = 50 * (1 - 0.7071067811865475) - 100 * 0.7071067811865475 = -56.06601717798212
-->
<rect transform="matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865475,64.64466094067262,-56.06601717798212)" class="element matrix" x="100" y="50" id="js-matrix"  fill-opacity=".8" />
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a577506cb0ac40aeb40ebc59098351ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=398&s=775326&e=gif&f=161&b=050505)

  


### 倾斜矩阵

  


SVG 中，可以使用倾斜矩阵 `matrix(1,0,tan(α),1,0,0)` 替代 `skewX(α)` ，指定元素沿着 `x` 轴方向倾斜 `α` 度：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11bc2c8e81014310a7390ed12c82d252~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5030&h=1821&s=1407777&e=jpg&b=050505)

  


可以使用倾斜矩阵 `matrix(1,tan(α),0,1,0,0)` 替代 `skewY(α)` ，指定元素沿着 `y` 轴方向倾斜 `α` 度：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e3377fe7e1543f5b85e662a6e0671a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5030&h=1821&s=1410662&e=jpg&b=050505)

  


```XML
<!-- 
    matrix(1,0,tan(α),1,0,0)
    α = 45deg
    α' = α * Math.PI / 180
    tan(α) = Math.tan(α') = Math.tan(α * Math.PI / 180) = Math.tan(45 * Math.PI / 180) = 0.9999999999999999
            
    a = 1
    b = 0
    c = tan(α) = 0.9999999999999999
    d = 1
    e = 0
    f = 0
-->
<rect transform="matrix(1,0,0.9999999999999999,1,0,0)" x="100" y="100" class="element skewX" id="js-skewX"  />
      
<!-- 
    matrix(1,tan(α),0,1,0,0)
    α = 45deg
    α' = α * Math.PI / 180
    tan(α) = Math.tan(α') = Math.tan(α * Math.PI / 180) = Math.tan(45 * Math.PI / 180) = 0.9999999999999999
            
    a = 1
    b = tan(α) = 0.9999999999999999
    c = 0
    d = 1
    e = 0
    f = 0
-->
<rect transform="matrix(1,0.9999999999999999,0,1,0,0)" class="element matrix" id="js-skewY" x="100" y="100"  />
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac176630e35d4f3da66607d4dfa0f56a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1238&h=592&s=2552735&e=gif&f=282&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/qBwydNw

  


### 链式变换转换为单一矩阵

  


SVG 变换和 CSS 变换一样，将多个变换以链式的方式组合在一起。例如：

  


```XML
<rect transform="translate(100,50) rotate(45) skewX(30) scale(1.1) skewY(-30)" x="100" y="100"  />
```

  


我们可以将其转换成一个矩阵变换。也就是说，SVG 中的 `transform` 属性所包含的一系列连续变换可以转换成相应的基础变换矩阵，然后将这些矩阵相乘得到一个单一的变换矩阵。不过，在实际计算过程中，需要注意变换的顺序，因为链式中的变换顺序不同，将直接影响最终结果，而且矩阵乘法不满足交换律。

  


比如，`transform="translate(100,50) rotate(45) skewX(30) scale(1.1) skewY(-30)"` 链式变换。首先，我们需要按照从左到右的顺序，分别计算每个基础变换对应的矩阵：

  


```
/* 1️⃣ 平移：translate(tx,ty) 👉 matrix(1,0,0,1,tx,ty) */
translate(100,50) 👉 matrix(1,0,0,1,100,50)

/* 2️⃣ 旋转：rotate(α)       👉 matrix(cos(α),sin(α),-sin(α),cos(α),0,0) */
/* 2️⃣ 围绕指定点 (cx,cy) 旋转：rotate(α,cx,cy) 👉 matrix(cos(α), sin(α), -sin(α), cos(α), cx*(1-cos(α))+cy*sin(α), cy*(1-cos(α))-cx*sin(α)) */
rotate(45) 👉 matrix(cos(45),sin(45),-sin(45),cos(45),0,0) 👉 matrix(0.7071067811865476,0.7071067811865475, -0.7071067811865475,0.7071067811865476, 0, 0)

/*3️⃣ 倾斜：skewX(α) 👉 matrix(1,0,tan(α),1,0,0)*/ 
skewX(30) 👉 matrix(1,0,tan(30),1,0,0) 👉 matrix(1,0,0.5773502691896257,1,0,0)

/* 4️⃣ 缩放：scale(sx, sy) 👉 matrix(sx,0,0,sy,0,0) */
/* 4️⃣ 围绕指定点 (cx,cy) 缩放：scale(sx, sy) 👉 matrix(sx,0,0,sy,cx*(1-sx),cy*(1-sy)) */
scale(1.1) 👉 matrix(1.1,0,0,1.1,0,0)

/* 5️⃣ 倾斜：skewY(α) 👉 matrix(1,tan(α),0,1,0,0)*/
skewY(-30) 👉 matrix(1,tan(-30),0,1,0,0) 👉 matrix(1,-0.5773502691896257,0,1,0,0)
```

  


将下面这五个矩阵按顺序相乘后，才能得到最终的复合矩阵 `matrix(a, b, c, d, e, f)` :

  


-   1️⃣：`translate(100,50)` 👉 `matrix(1,0,0,1,100,50)`
-   2️⃣：`rotate(45)` 👉 `matrix(0.7071067811865476,0.7071067811865475, -0.7071067811865475,0.7071067811865476, 0, 0)`
-   3️⃣：`skewX(30)` 👉 `matrix(1,0,0.5773502691896257,1,0,0)`
-   4️⃣：`scale(1.1)` 👉 `matrix(1.1,0,0,1.1,0,0)`
-   5️⃣ ：`skewY(-30)` 👉 `matrix(1,-0.5773502691896257,0,1,0,0)`

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67263945658f438e9a0fac1570472205~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5570&h=5212&s=3758017&e=jpg&b=050505)

  


最终将这五个矩阵相乘，得到转换后的单一矩阵 `matrix(0.97,0.07,-0.33, 1.23, 100, 50)` 。如果将链式的变换值和计算后的矩阵变换应用在 SVG 元素上，它们最终呈现的变换结果是一致的：

  


```XML
<!-- 链式变换 -->
<rect transform="translate(100,50) rotate(45) skewX(30) scale(1.1) skewY(-30)" x="100" y="100" />

<!-- 上面链式转换后的矩阵变换 -->
<rect transform="matrix(0.97, 0.07, -0.33, 1.23, 100, 50)"  x="100" y="100"  />
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85789d0ef06848ed9d324b773e63f5cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=917&s=444783&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/XWQBbBG

  


请注意，上述矩阵系数的计算依赖于正确的变换顺序以及对角度的处理方式（通常是将其转换为弧度进行计算），并且实际结果可能需要通过编程工具或计算器精确求解。[我使用的是在线矩阵乘法计算器](http://matrixmultiplication.xyz/)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b194d157e7a41d3a782822192631680~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=550&s=967934&e=gif&f=252&b=ffffff)

  


> URL：http://matrixmultiplication.xyz/

  


## 模拟 3D 变换

  


CSS 中的 3D 变换允许开发在 Web 页面上创建立体的视觉效果，通过模拟三维空间的变换操作来改变元素的布局和呈现方式。这项功能利用 CSS 的 `transform` 属性及其相关的 3D 变换函数，使得原本处于二维平面的 HTML 元素能够在虚拟的三维空间中进行移动、旋转和缩放。以下是 CSS 3D 变换的相关函数和功能：

  


-   透视：`perspective` 属性用于设置元素容器的透视效果，决定子元素的 3D 变换时的景深。景深越大，远处的元素看起来越小，反之则近处的元素显得更大，从而营造出三维立体的空间感。
-   位移：`translateZ()` 和 `translate3d(x, y, z)` 可以沿着 `z` 轴方向平移元素。
-   旋转：`rotateX()` 、`rotateY()` 和 `rotateZ()` 分别用于绕着 `x`、`y`、`z`轴旋转元素。`rotate3d(x, y, z, angle)` 可以根据指定的三维向量和角度进行旋转。
-   缩放：`scaleZ()` 对元素沿 `z` 轴进行缩放。`scale3d(x, y, z)` 对元素分别在`x`、`y`、`z`轴上进行缩放。
-   矩阵变换：`matrix3d()` 是一个更加通用的变换函数，它可以接受 `16` 个值组成的 `4x4` 矩阵，实现复杂的空间变换。
-   变换原点：通过 `transform-origin` 属性，可以指定元素进行 3D 变换时的基准点位置。
-   背面可见性：`backface-visibility` 属性控制元素在旋转时背面是否可见，这对于实现卡片翻转等效果非常重要。
-   坐标系统：在CSS 3D 变换中，使用的是左手坐标系，其中 `x` 轴向右，`y` 轴向下，`z` 轴垂直于屏幕向外，正值表示远离用户，负值表示靠近用户。

  


下面这个示例向大家展示了 [CSS 3D 变换](https://juejin.cn/book/7288940354408022074/section/7295240572736897064#heading-8)是如何使元素在虚拟三维空间变换将六个平面拼成一个立方体：

  


```HTML
<div class="cube">
    <div class="side front">
        <img src="https://picsum.photos/800/600?random=1" alt="" />
    </div>
    <div class="side left">
        <img src="https://picsum.photos/800/600?random=2" alt="" />
    </div>
    <div class="side right">
        <img src="https://picsum.photos/800/600?random=3" alt="" />
    </div>
    <div class="side back">
        <img src="https://picsum.photos/800/600?random=4" alt="" />
    </div>
    <div class="side top">
        <img src="https://picsum.photos/800/600?random=5" alt="" />
    </div>
    <div class="side bottom">
        <img src="https://picsum.photos/800/600?random=6" alt="" />
    </div>
</div>
```

  


```CSS
@layer animation {
    @keyframes cubeRotate {
        from {
            transform: rotateY(0deg) rotateX(720deg) rotateZ(0deg);
        }
        to {
            transform: rotateY(360deg) rotateX(0deg) rotateZ(360deg);
        }
    }

    .animated {
        animation: cubeRotate 10s linear infinite;
    }
}

@layer transform {
    .container {
        --perspective: 1000px;
        --originX: 0%;
        --originY: 100%;
        --transform-style: preserve-3d;
        perspective: var(--perspective);
        perspective-origin: var(--originX) var(--originY);
        transition: all 0.2s ease;
    }
    
    .cube {
        transform-style: var(--transform-style);
    
        .front {
            transform: translateZ(100px);
        }
    
        .back {
            transform: translateZ(-100px);
        }
    
        .left {
            transform: rotateY(90deg) translateZ(100px);
        }
    
        .right {
            transform: rotateY(-90deg) translateZ(100px);
        }
    
        .top {
            transform: rotateX(90deg) translateZ(100px);
        }
        
        .bottom {
            transform: rotateX(-90deg) translateZ(100px);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/093b78896bf441209a527c3c092ffd70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=626&s=5487541&e=gif&f=277&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/bGzpdPv

  


虽然 SVG 是一种矢量图格式，它本身并不直接支持 CSS 3D 变换属性所提供的完整 3D 变换功能，但 SVG 自身有一套强大的图形变换系统，可以通这组合 SVG 内置的 2D 变换矩阵来模拟 3D 效果。不过，要模拟 3D 变换，通常需要结合多个 2D 变换，并理解三维空间变换的基本原理。

  


接下来，我们通过一个简单的 3D 盒子来阐述 SVG 世界中的 3D 变换。例如下面这个示例：

  


```XML
<svg viewBox="0 0 40 30" class="transform--3d">
    <g class="box">
        <rect width="25" height="15" fill="oklch(0.83 0.28 138.96 / .5)" stroke="oklch(0.58 0.2 139.61)" /> 
        <rect width="10" height="15" fill="oklch(0.56 0.24 30.18 / .5)" stroke="oklch(0.48 0.21 30.17)" /> 
        <rect width="25" height="15" fill="oklch(0.56 0.15 240.68 / .5)" stroke="oklch(0.48 0.16 250.4)" />
        <rect width="10" height="15" fill="oklch(0.79 0.19 80.72 / .5)" stroke="oklch(0.74 0.17 101.91)" /> 
    </g>
</svg>
```

  


```CSS
.box {
    transform-style: preserve-3d;
    transform: translate(5px, 10px) rotate3d(1, 1, 0, -30deg);

    rect {
        stroke-width: 0.3;
        stroke-linejoin: round;

        &:nth-of-type(1) {
            transform: translateZ(-10px);
        }
        
        &:nth-of-type(2) {
            transform: rotateY(90deg);
        }
      
        &:nth-of-type(4) {
            transform: translate(25px, 0) rotateY(90deg);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5638d8c0416341f3bd913b6cc60d7073~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1306&s=220625&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/PogBmWz

  


实际上，你看到的并非所期待的 3D 盒子。为什么呢？我们来一步步解释。

  


你可能已经注意到，我们使用了与 CSS 3D 变换相关的函数。这是因为，到目前为止，SVG 的 `transform` 属性还不支持 3D 变换。

  


默认情况下，浏览器在处理SVG元素时，会将3D变换分解为一系列的 2D 投影操作，将各个图形元素逐一展平至二维视图上。每一块形状在叠加到主绘图平面前，都会预先独立完成这种转化。然而，在构造三维盒子的情形下，这种方法显然失效了：因为盒子的侧边与主平面呈直角，一旦被压平，便会消失不见；而背板则会被前面的面完全遮挡。即使尝试对整个变形后的集合进行旋转，得到的也只是倾斜的二维矩形，无法体现出应有的立体深度，这就是为何三维盒子未能显现，仅呈现出单一平面矩形的关键原因之一。

  


值得注意的是，尽管HTML元素可通过设置 `transform-style: preserve-3d` 使组元素维持三维空间特性，但在 SVG 环境中，即便采用同样的方式尝试保留三维性，现代 Web 浏览器仍无法完全支持 SVG 与 `preserve-3d` 属性的无缝协同工作，这意味着 SVG 元素尚不具备原生的三维空间表现能力。

  


这意味着，我们不能以熟悉的 CSS 3D 变换思维在 SVG 中应用 3D 变换。为此，你需要在不使用 `preserve-3d` 的情况下创建复杂的 3D 对象，即在每个元素上指定完整的 3D 变换序列。换句话说，删除 `<g>` 元素的 `transform` 属性，并将该函数列表复制到每个矩形元素（`<rect>`）的 `transform` 属性的开头：

  


```XML
<svg viewBox="0 0 40 30" class="transform--3d">
    <g class="box" transform="translate(5,10)">
        <rect transform="translate(5,-5)" width="25" height="15" fill="oklch(0.83 0.28 138.96 / .5)" stroke="oklch(0.58 0.2 139.61)" />
        <rect transform="skewY(-45) scale(0.5,1)" width="10" height="15" fill="oklch(0.56 0.24 30.18 / .5)" stroke="oklch(0.48 0.21 30.17)" />
        <rect width="25" height="15" fill="oklch(0.56 0.15 240.68 / .5)" stroke="oklch(0.48 0.16 250.4)" />
        <rect transform="translate(25,0) skewY(-45) scale(0.5,1)" width="10" height="15" fill="oklch(0.79 0.19 80.72 / .5)" stroke="oklch(0.74 0.17 101.91)" />
    </g>
</svg>
```

  


```CSS
.box {
    /* transform-style: preserve-3d; */
    transform: translate(5px, 10px) rotate3d(1, 1, 0, -30deg);

    rect {
        stroke-width: 0.3;
        stroke-linejoin: round;

        &:nth-of-type(1) {
            transform: rotate3d(1, 1, 0, -30deg) translateZ(-10px);
        }
      
        &:nth-of-type(2) {
            transform: rotate3d(1, 1, 0, -30deg) rotateY(90deg);
        }
      
        &:nth-of-type(3) {
            transform: rotate3d(1, 1, 0, -30deg);
        }
      
        &:nth-of-type(4) {
            transform: rotate3d(1, 1, 0, -30deg) translate(25px, 0) rotateY(90deg);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca8f74e521744a4a9d71dc8b7d06babc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1306&s=323327&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/WNWKjXZ

  


虽然这样调整之后，你可以在 SVG 画布上看到一个 3D 形状的盒子。但细看，这个盒子仍然不太正确。问题不仅在于矩形的描边导致盒子边缘的精确对齐有偏差。这也意味着透视仍然不正确。

  


为了使你能在 3D 空间中有更自然的透视效果，CSS 变换定义了透视（`perspective` ）和透视原点（`perspective-origin`）属性，用于设置三维空间中观察者的位置。这些属性定义在父元素上，为其子元素的 3D 变换创建上下文。

  


透视的不均匀缩放效果也可以通过变换函数列表中的 `perspective()` 函数来创建，它与 `perspective` 属性类似。父元素上的透视属性 `perspective` 等效于在子元素的变换列表中的 `perspective()` 函数。与 `perspective-origin` 属性没有等效的函数。相反，类似于 `transform-origin`，`perspective-origin` 等效于前后平移：这次，在透视函数之前和之后应用平移。

  


```XML
<svg viewBox="0 0 400 300" class="transform--3d">
    <g class="box" transform="translate(50,100)">
        <rect transform="translate(50,-50)" width="250" height="150" fill="oklch(0.83 0.28 138.96 / .5)" stroke="oklch(0.58 0.2 139.61)" />
        <rect transform="skewY(-45) scale(0.5,1)" width="100" height="150" fill="oklch(0.56 0.24 30.18 / .5)" stroke="oklch(0.48 0.21 30.17)" />
        <rect width="250" height="150" fill="oklch(0.56 0.15 240.68 / .5)" stroke="oklch(0.48 0.16 250.4)" />
        <rect transform="translate(250,0) skewY(-45) scale(0.5,1)" width="100" height="150" fill="oklch(0.79 0.19 80.72 / .5)" stroke="oklch(0.74 0.17 101.91)" />
    </g>
</svg>
```

  


```CSS
rect {
    stroke-width: 3;
    stroke-linejoin: round;

    &:nth-of-type(1) {
        transform: translate(800px, -400px) perspective(1000px) translate(-800px, 400px) translateZ(-100px);
    }
    
    &:nth-of-type(2) {
        transform: translate(800px, -400px) perspective(1000px) translate(-800px, 400px) rotateY(90deg);
    }
    
    &:nth-of-type(3) {
        transform: translate(800px, -400px) perspective(1000px) translate(-800px, 400px);
    }
    
    &:nth-of-type(4) {
        transform: translate(800px, -400px) perspective(1000px) translate(-800px, 400px) translate(250px, 0) rotateY(90deg);
    }
} 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbe9acbd737245f6b8f0d98dfd1665b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1326&s=281462&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/MWRBovM

  


应用透视效果到 3D 变换的图形需要复杂的数学计算，包括找到交点、裁剪超出“观察者”背后的形状，并确保每个点相对于透视距离和原点正确地缩放和定位。这些计算大部分在 CSS 中没有明确定义。在使用 SVG 的 3D 变换时，务必进行全面测试，并接受不同的浏览器之间的一些差异。

  


最后，你需知道的是，到目前为止，SVG 还没有 3D 变换。换句话说，你只能通过 CSS 变换函数让 SVG 看上去具有 3D 空间的概念，一种模拟的效果。

  


## 改变变换参考点：transform-box

  


每一个元素都有一个本地坐标系统，CSS 的 `transform-origin` 可以用来指定元素的坐标系统的原点。对于 HTML 元素，`transform-origin` 属性的默认值为元素参考框的 `50% 50%` （元素边框框 `border-box` 的正中心位置）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8e96628f11e4afea0c771c49aa9a565~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1326&s=547638&e=jpg&b=fff7f6)

  


SVG 元素则有所不同，它们的坐标系统的默认 `transform-origin` 是其参考框（SVG 的 `viewBox`）的 `(0,0)` 位置，通常是 SVG 画布的左上角。

  


注意，SVG 元素自身并没有 `transform-origin` 属性，只能通过 CSS `transform-origin` 属性来调整坐标系原点位置。

  


你可能已经注意到了，SVG 元素在应用变换属性 `transform` 或 CSS 变换 `transform` 、`translate` 、`rotate` 和 `scale` 时，都会围绕着 `transform-origin` 指定的参考点进行。不过，在某些情况下，SVG 中使用相对值（例如 `50% 50%` ）设置 `transform-origin` 时，其行为可能与预期不符。例如下面这个示例：

  


```XML
<svg class="transform" viewBox="-512 -512 1024 1024">
    <g stroke="lime" stroke-width="5" stroke-dasharray="30 10">
        <line x1="-512" y1="-2" x2="512" y2="-2" />
        <line y1="-512" x1="-2" y2="512" x2="-2" />
    </g>
    
    <circle cx="0" cy="0" r="424" fill="none" stroke="lime" stroke-width="2" stroke-dasharray="30 10" />
  
    <g>
        <rect class="rotate" x="-400" y="-400" width="200" height="200" stroke="orange" stroke-width="8" fill="none" />
        <circle cx="-300" cy="-300" r="10" fill="orange" />
    </g>

    <line x1="0" y1="0" x2="-300" y2="-300" stroke="orange" stroke-width="4" stroke-dasharray="30 10" class="rotate fill-box" />

    <circle cx="0" cy="0" r="20" fill="lime" />
</svg>
```

  


上面示例，通过改变 `viewBox` 的 `<min-x>` 和 `<min-y>` 将用户坐标系统 `viewBox` 移动到 SVG 画布（视口坐标系统）的中心位置（下图中绿色圆点位置）。在画布的左上角绘制了一个 `200 x 200` 的矩形（橙色矩形），并在这个矩形中正中心绘制了一个小圆点（模拟橙色矩形框的中心位置）。

  


```CSS
.rotate {
    transform-origin: 50% 50%;
    transform: rotate(var(--_a));
}
```

  


你会发现，即使 `transform-origin` 属性的值被设置为 `50% 50%` ，但矩形框在旋转时，并未围绕着矩形框自身中心旋转（橙色点）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb05372dfa7d4104ba56e148c9ace15f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=636&s=1745943&e=gif&f=259&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/GRLBvzV

  


对于 `rotate()` 变换，我们可以使用 `rotate(a, cx,cy)` 来指定参考点。比如，通过设置 `cx` 和 `cy` 的值为矩形框中心位置，使得橙色矩形围绕着自身中心（`cx` 和 `cy`）点旋转：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85866ca7c2c141ee94006f02e535da60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1070&h=568&s=908711&e=gif&f=134&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/jORpGGa

  


另外，在 SVG 领域，使用 CSS 进行动画处理时，`transform-origin` 一直是 Web 开发者的一个痛点，涉及到 CSS 变换时，总是会有很多怪异的现象出现。

  


例如下面这个示例，使用 CSS 变换对小熊眼睛和领结应用了动画：

  


```XML
<svg viewBox="0 0 300 300" class="bear">
    <!--身体-->
    <path fill="#B97D6D" d="M200.8,163.3c27.9,11.4,31.4,24.6,26.1,34.5c-8.9,16.6-27.3,2.3-27.3,2.3c-2.1,12-2.8,36.9,0,39.4 s7.5,5.1,7.5,10.7c0,5.6-26.9,11.6-45.7,7.7c-4.5-4-5.3-13.1-11.4-13.2c-6.1,0.1-6.9,9.2-11.4,13.2c-18.8,3.9-45.7-2.1-45.7-7.7 c0-5.6,4.7-8.2,7.5-10.7c2.8-2.5,2.1-27.4,0-39.4c0,0-18.4,14.3-27.3-2.3c-5.3-9.9-1.8-23.1,26.1-34.5 c-13.1-11.5-19.6-26.9-19.6-50c0-17,8.2-31.5,13.8-40c-8.1-2.8-14.6-15-5.5-24.1c9.1-9.1,21.7-1.6,24,5.5 c10.9-7.4,24-11.7,38.1-11.7h0c14.1,0,27.2,4.3,38.1,11.7c2.3-7,14.8-14.6,24-5.5c9.1,9.1,2.6,21.3-5.5,24.1 c5.6,8.5,13.8,22.9,13.8,40C220.4,136.4,213.9,151.8,200.8,163.3z">
        <animate attributeName="d" repeatCount="indefinite" begin="mouseover" end="mouseout" dur=".5s" values="M200.8,163.3c27.9,11.4,31.4,24.6,26.1,34.5c-8.9,16.6-27.3,2.3-27.3,2.3c-2.1,12-2.8,36.9,0,39.4 s7.5,5.1,7.5,10.7c0,5.6-26.9,11.6-45.7,7.7c-4.5-4-5.3-13.1-11.4-13.2c-6.1,0.1-6.9,9.2-11.4,13.2c-18.8,3.9-45.7-2.1-45.7-7.7 c0-5.6,4.7-8.2,7.5-10.7c2.8-2.5,2.1-27.4,0-39.4c0,0-18.4,14.3-27.3-2.3c-5.3-9.9-1.8-23.1,26.1-34.5 c-13.1-11.5-19.6-26.9-19.6-50c0-17,8.2-31.5,13.8-40c-8.1-2.8-14.6-15-5.5-24.1c9.1-9.1,21.7-1.6,24,5.5 c10.9-7.4,24-11.7,38.1-11.7h0c14.1,0,27.2,4.3,38.1,11.7c2.3-7,14.8-14.6,24-5.5c9.1,9.1,2.6,21.3-5.5,24.1 c5.6,8.5,13.8,22.9,13.8,40C220.4,136.4,213.9,151.8,200.8,163.3z; M227.4,167.7c-7.8-17.1-27-4-27-4l0.4-0.4c13-11.5,19.5-26.9,19.5-50c0-17-8.2-31.5-13.7-40 c8.1-2.8,14.5-15,5.5-24.1s-21.6-1.6-23.9,5.5C177.3,47.3,164.2,43,150.2,43l0,0c-14,0-27.2,4.3-37.9,11.7 c-2.3-7-14.7-14.6-23.9-5.5c-9.1,9.1-2.6,21.3,5.5,24.1c-5.6,8.5-13.7,22.9-13.7,40c0,23.1,6.5,38.5,19.5,50c-0.1,0-0.2,0.1-0.3,0.1 l0.3-0.1c-1.8-1.1-20.2-11.4-27.2,5c-4.4,10.2,0.2,23,28.4,31.8c2.1,12,2.8,36.8,0,39.3c-2.8,2.5-7.5,5.1-7.5,10.7 s26.8,11.6,45.5,7.7c4.5-4,5.3-13.1,11.4-13.2c6.1,0.1,6.8,9.2,11.4,13.2c18.7,3.9,45.5-2.1,45.5-7.7s-4.7-8.2-7.5-10.7 c-2.8-2.5-2.1-27,0-39.1C227.7,190.7,231.9,177.8,227.4,167.7z; M200.8,163.3c27.9,11.4,31.4,24.6,26.1,34.5c-8.9,16.6-27.3,2.3-27.3,2.3c-2.1,12-2.8,36.9,0,39.4 s7.5,5.1,7.5,10.7c0,5.6-26.9,11.6-45.7,7.7c-4.5-4-5.3-13.1-11.4-13.2c-6.1,0.1-6.9,9.2-11.4,13.2c-18.8,3.9-45.7-2.1-45.7-7.7 c0-5.6,4.7-8.2,7.5-10.7c2.8-2.5,2.1-27.4,0-39.4c0,0-18.4,14.3-27.3-2.3c-5.3-9.9-1.8-23.1,26.1-34.5 c-13.1-11.5-19.6-26.9-19.6-50c0-17,8.2-31.5,13.8-40c-8.1-2.8-14.6-15-5.5-24.1c9.1-9.1,21.7-1.6,24,5.5 c10.9-7.4,24-11.7,38.1-11.7h0c14.1,0,27.2,4.3,38.1,11.7c2.3-7,14.8-14.6,24-5.5c9.1,9.1,2.6,21.3-5.5,24.1 c5.6,8.5,13.8,22.9,13.8,40C220.4,136.4,213.9,151.8,200.8,163.3z;" />
    </path>
  
    <!--鼻子-->
    <path fill="#44373A" d="M150,137.3c4.7,0,11.2,1.6,10.5,6.4c-0.7,4.8-8.8,8.5-10.5,8.5h0c-1.7,0-9.7-3.7-10.5-8.5 C138.7,138.9,145.3,137.3,150,137.3L150,137.3z" />
  
    <!--肚子-->
    <path fill="#D7A798" d="M184.4,172.7c-5.7,2.1-12.2,3.5-19.7,4.3c-4.6,0.5-9.5,0.8-14.8,0.8h0c-5.3,0-10.2-0.3-14.8-0.8 c-7.4-0.8-14-2.3-19.7-4.3c-1,11.6-2.1,22.8-1.7,32.6c0.9,19.8,8.2,33.7,36.1,33.7c28,0,35.3-13.9,36.1-33.7 C186.5,195.5,185.4,184.3,184.4,172.7z" />
  
    <!-- 脸 -->
    <g>
        <g>
            <!--左眼-->
            <g>
                <path class="left-eye eyes" fill="#FFFFFF" d="M120.7,109c10.4,0,18.8,8.4,18.8,18.8c0,10.4-8.4,18.8-18.8,18.8c-10.4,0-18.8-8.4-18.8-18.8 C101.8,117.4,110.3,109,120.7,109z" />
                <!--左瞳孔-->
                <path class="left-pupil pupils" fill="#44373A" d="M115.5,135.5c2.8,0,5.1-2.3,5.1-5.1c0-2.8-2.3-5.1-5.1-5.1c-2.8,0-5.1,2.3-5.1,5.1 C110.4,133.2,112.7,135.5,115.5,135.5z" />
            </g>
          
            <!--右眼-->
            <g>
                <path class="right-eye eyes" fill="#FFFFFF" d="M183.5,109c10.4,0,18.8,8.4,18.8,18.8c0,10.4-8.4,18.8-18.8,18.8c-10.4,0-18.8-8.4-18.8-18.8 C164.7,117.4,173.1,109,183.5,109z" />
                <!--右瞳孔-->
                <path class="right-pupil pupils" fill="#44373A" d="M178.4,125.3c-2.8,0-5.1,2.3-5.1,5.1c0,2.8,2.3,5.1,5.1,5.1c2.8,0,5.1-2.3,5.1-5.1 C183.5,127.5,181.2,125.3,178.4,125.3z" />
            </g>
        </g>
        
        <!--口-->
        <path fill="none" stroke="#99685B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M174.9,148.9 c-2.4,11-23.8,15-36.9,9.6" />
    </g>
  
    <!--耳朵-->
    <path fill="none" stroke="#010101" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" d="M97.7,64.2 c-3.4,0-5.3-4.2-3.3-7.4c1.9-2.9,7.3-3.4,8.9,1.3 M202.3,64.2c3.4,0,5.3-4.2,3.3-7.4c-1.9-2.9-7.3-3.4-8.9,1.3" />
  
    <!-- 领结 -->
    <g class="bowtie">
        <!--领结（外）-->
        <path fill="#fd7dbd" d="M195.4,169.7c-0.5-0.5-1-0.9-1.7-1.3c-5.7-3.6-17-3.3-29,8.7c-4.6,0.5-9.5,0.8-14.8,0.8h0 c-5.3,0-10.2-0.3-14.8-0.8c-12-12-23.3-12.3-29-8.7c-0.6,0.4-1.2,0.9-1.7,1.3c-4.6,4.6-1.5,30.9,9.3,35.6c0.5,0.2,1.1,0.4,1.7,0.5 c9.4,1.9,18.6-9.4,22.3-14.5c2.3,3.6,6.1,6,12.1,6c6,0,9.9-2.4,12.1-6c3.7,5.2,12.9,16.5,22.3,14.5c0.6-0.1,1.1-0.3,1.7-0.5 C196.8,200.6,200,174.3,195.4,169.7z" />
        <!--领结（内）-->
        <path fill="#ff69b4" d="M162.1,191.3c-2.3,3.6-6.1,6-12.1,6c-6,0-9.9-2.4-12.1-6c-2.5-3.9-3.1-9.3-2.6-14.2l0,0 c4.6,0.5,9.5,0.8,14.8,0.8h0c5.3,0,10.2-0.3,14.8-0.8l0,0C165.2,182,164.6,187.3,162.1,191.3z" />
    </g>
</svg>
```

  


```CSS
.pupils {
    animation: eyes 2s linear infinite;
    transform-origin: bottom;
}

.bowtie {
    animation: bowspin 0.5s linear infinite;
    transform-origin: bottom center;
}

@keyframes eyes {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes bowspin {
    0% {
        transform: rotate(0deg);
        transform-origin: center;
    }
    100% {
        transform: rotate(360deg);
        transform-origin: center;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b326850bbf724a6687cd0eb516e60b87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=558&s=514779&e=gif&f=46&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/bGJjoQo

  


这并不是我们想要的结果。

  


我们可以通过 CSS 的 `transform-box` 属性来修复它。该属性允许我们改变特定元素的变换参考框。它有以下几个可选值：

  


-   `content-box`：将内容框设置为参考点。
-   `border-box`：采用边框框作为参考点。
-   `fill-box`：使用对象边界框作为参考点。
-   `stroke-box`：选择描边边界框作为参考点。
-   `view-box`：将最近的 SVG 视口作为参考点。如果 SVG 元素具有 `viewBox` 属性，则参考点将位于 `viewBox` 定义的坐标系统的原点处。参考点的尺寸与 `viewBox` 属性的宽度和高度值相匹配。

  


`transform-box` 属性对 SVG 元素进行了突出，因为它们具有复杂的变换功能，但要注意，`transform-box` 不仅适用于 SVG。它可以用于任何可变换的元素。

  


HTML 元素的默认变换参考框值（`transform-box`）是 `border-box`。我们可以关注 `fill-box` 和 `view-box` ，因为它们适用于 SVG 元素。 `fill-box` 使用对象边界框作为参考，而 `view-box` 使用最近的 SVG 视口。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d525be1cc8a4d63994f278e860c6d9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1164&h=614&s=1675504&e=gif&f=233&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/WNWKXGg

  


尽管 `transform-box` 可以应用于任何可变换的元素，但如果元素没有设置显式或隐式的变换，可能不会产生显著的效果。例如，如果没有任何旋转或缩放变换，`transform-box` 的影响可能不会可见。

  


`transform-box` 在 SVG 和 HTML 上下文中的行为可能不同。对于 HTML 元素，`fill-box` 和 `stroke-box` 的行为分别类似于 `content-box` 和 `border-box`，因为 HTML 不像 SVG 那样识别对象边界框或描边边界框的概念。

  


请记住，`transform-box` 与 `transform-origin` 属性配合使用。通过更改参考框，你也在调整变换的原点，这可能会显著影响变换的结果。

  


在对 SVG 元素进行动画时，将 `transform-box` 设置为 `fill-box` 或 `view-box` 可以提供更平滑、更可预测的动画效果，特别是与 `transform-origin` 结合使用时。例如，上面小熊的示例，在应用变换和动画的元素上，显式设置 `transform-box` 为 `fill-box` ，一切都将变得完美：

  


```CSS
:is(.pupils, .bowtie){
    transform-box: fill-box;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81227756759549b2ab4a522805afdfbd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=614&s=1974332&e=gif&f=138&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/oNOMowY

  


## 案例：汉堡菜单图标

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b008ba22ff5a41abaa8c115c462de1d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=720&s=1050515&e=gif&f=236&b=ffffff)

  


如下图所示，“汉堡菜单图标”在交互后转换成别的图标是一种非常常见的交互效果。类似的效果使用 SVG 和 CSS 来制作是非常不错的选择。只需要结合单独的变换属性和过渡延迟就可以为 SVG 图标添加动画效果。我们以 [@Jhey 在 Codepen 提供的效果为例](https://codepen.io/jh3y/full/poGJowE)（汉堡菜单图标转换成关闭图标）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d655b3343bb141e79919323cf055aace~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=516&s=382415&e=gif&f=174&b=101010)

  


> Demo 地址：https://codepen.io/jh3y/full/poGJowE （来源于 [@Jhey](https://codepen.io/jh3y/full/poGJowE) ）

  


完成图的交互效果，你可能需要像下面这样的 HTML 模板：

  


```HTML
<button class="button">
    <svg aria-hidden="true" viewBox="0 0 24 24" class="icon">
        <g fill="#fff">
            <rect width="18" height="1.5" ry="0.75" x="3" y="6.25" />
            <rect width="18" height="1.5" ry="0.75" x="3" y="11.25" />
            <rect width="18" height="1.5" ry="0.75" x="3" y="16.25" />
        </g>
    </svg>
</button>
```

  


我们使用三个 `<rect>` 元素来绘制“汉堡菜单图标”。给相关元素设置一些基本样式：

  


```CSS
@layer demo {
    button {
        width: 280px;
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        padding: 0;
        scale: 1;
        background: transparent;
        border: 0;
        border-radius: 50%;
        transition: background 0.2s;
        cursor: pointer;
    
        svg {
            width: 65%;
        }
    
        &:is(:hover, :focus-visible) {
            background: hsl(0 0% 16%);
        }
        
        &:is(:focus-visible) {
            outline-color: hsl(320 80% 50% / 0.5);
            outline-offset: 1rem;
            outline-width: 4px;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f94140b720964d57848a9b1b8936b7b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=654&s=454652&e=gif&f=117&b=030303)

  


正如你所看到的，现在它只是一个汉堡菜单图标。当用户点击该图标时，它将变成一个关闭图标，再次点击时，它又回到汉堡菜单图标。

  


要实现这个效果，需要借助一点 JavaScript 脚本。例如，用户点击按钮时，可以切换它的类名。不过，@Jhey 提供的案例不是切换类名，而是切换 `aria-pressed` 属性。即 `aria-pressed` 属性的值在 `true` 和 `false` 之间切换：

  


```JavaScript
const TOGGLE = document.querySelector('.button');

const HANDLE_TOGGLE = () => {
    TOGGLE.setAttribute('aria-pressed', TOGGLE.matches('[aria-pressed=true]') ? false : true);
}

TOGGLE.addEventListener('click', HANDLE_TOGGLE);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc15e4dc3cf74535b150cc967a070dba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=564&s=597094&e=gif&f=144&b=040404)

  


当按钮（`button`）的 `aria-pressed` 属性值为 `true` 时，需要调整SVG 的 `<rect>` 元素位置。即使用 CSS 变换来调整它们的位置：

  


```CSS
[aria-pressed="true"] rect {
    transform-origin: 50% 50%;
    
    &:nth-of-type(1) {
        translate: 0 333%;
        rotate: -45deg;
    }
    
    &:nth-of-type(2) {
        rotate: 45deg;
    }
    
    &:nth-of-type(3) {
        translate: 0 -333%;
        rotate: 45deg;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82ed2c9c6a7b427cb41ee45432e4dec2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1244&h=554&s=459618&e=gif&f=119&b=030303)

  


请别遗忘了 `transform-box` 属性。请记住，在 SVG 变换中，即使你将元素的 `transform-origin` 属性的值设置为 `50% 50%` （设置变换原点为元素中心位置），还是不够的。因为它的参考框默认是 `view-box` （即 SVG 的 `viewBox`）。我们需要将 `transform-box` 属性值设置为 `fill-box` ，将参考框指定为图形对象边框框：

  


```CSS
button rect {
    transform-box: fill-box;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a854dd86f2064fc2b02dfce2077820a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1090&h=532&s=396186&e=gif&f=109&b=040404)

  


正如你所看到的，用户点击按钮时，“汉堡菜单图标”和“关闭图标”可以正常来回切换了。只不过，效果看上去有点生硬。我们可以使用 CSS 的 `transition` 给它们添加过渡动画。其中的关键之处，要为两种状态定义过渡延迟：

  


-   当按钮的 `aria-pressed` 属性值为 `true` 时，先平移线条（`<rect>` ），然后旋转它们
-   当按钮的 `aria-pressed` 属性值为 `false` 时，先旋转线条（`<rect>`），然后将它们平移到原始位置

  


```CSS
rect {
    [aria-pressed="false"] & {
      transition: rotate 0.2s 0s, translate 0.2s 0.3s;
    }
    
    [aria-pressed="true"] & {
      transition: translate 0.2s 0s, rotate 0.2s 0.3s;
    }
}
```

  


与此同时，按钮 `aria-pressed` 为 `true` 时，也给 `<svg>` 元素添加一个旋转的过渡效果：

  


```CSS
[aria-pressed="true"] {
    svg {
        rotate: 90deg;
        transition: rotate 1s 0.4s;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db88836b0a5648ba9079e99137e59dae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1108&h=638&s=919500&e=gif&f=183&b=030303)

  


我们还可以使用其他的[缓动函数](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)，例如 `linear()` 给按钮设置类似弹性的缓动效果：

  


```CSS
[aria-pressed="true"] {
    svg {
        rotate: 90deg;
        transition: rotate 1s
            linear(
              0,
              0.2178 2.1%,
              1.1144 8.49%,
              1.2959 10.7%,
              1.3463 11.81%,
              1.3705 12.94%,
              1.3726,
              1.3643 14.48%,
              1.3151 16.2%,
              1.0317 21.81%,
              0.941 24.01%,
              0.8912 25.91%,
              0.8694 27.84%,
              0.8698 29.21%,
              0.8824 30.71%,
              1.0122 38.33%,
              1.0357,
              1.046 42.71%,
              1.0416 45.7%,
              0.9961 53.26%,
              0.9839 57.54%,
              0.9853 60.71%,
              1.0012 68.14%,
              1.0056 72.24%,
              0.9981 86.66%,
              1
            )
            0.4s;
    }
}
```

  


最终效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2006ad5e58b2486bb3d82e1432b74e1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=558&s=614720&e=gif&f=171&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/oNOModW

  


就是这样！不需要使用三个 `<div>` 创建汉堡菜单。使用 SVG 和 CSS，可以在任何大小下都很好地缩放!

  


## 小结

  


SVG 的变换属性和 CSS 变换都是用于在 Web 开发中对图形进行变换和动画的强大工具。它们提供了一系列功能，使开发者能够创建丰富、交互性强的图形效果，从而增强用户体验。

  


首先，SVG 的 `transform` 属性允许开发者对 SVG 元素进行平移、旋转、缩放和倾斜等基本变换。通过指定不同的变换函数，如 `translate(tx,ty)`、`rotate(a)` （或 `rotate(a,cx,cy)`）、`scale(sx, sy)`、`skewX(a)` 和 `skewY(a)`，可以实现各种各样的变换效果。例如，可以将图形沿着 `x` 轴和 `y` 轴平移、绕指定点旋转、按比例缩放等。此外，SVG 还支持矩阵变换，通过 `matrix(a,b,c,d,e,f)` 属性可以实现更复杂的变换操作。

  


与此同时，CSS 变换也可以应用于 SVG 元素，通过在 SVG 元素的样式表中使用 `transform` 属性，可以实现与在 HTML 元素上应用的相同的变换效果。这为开发者提供了一种统一的方式来处理图形和其他元素的变换，简化了开发流程。此外，CSS 变换还支持过渡效果和动画，可以通过 `transition` 和 `animation` 属性来实现平滑的过渡和动态的变换效果，为图形添加更多的交互性和视觉吸引力。

  


在实际应用中，开发者可以根据需要选择使用 SVG 的 `transform` 属性还是 CSS 变换，或者将两者结合起来使用。SVG 的 `transform` 属性适用于对单个 SVG 元素进行变换操作，特别适合对图形进行复杂的几何变换；而 CSS 变换则更适用于对整个 SVG 图像或多个 SVG 元素进行统一的变换，同时可以结合 CSS 动画和过渡实现更丰富的交互效果。

  


综上所述，SVG 的 `transform` 属性和 CSS 变换为开发者提供了强大的工具，可以实现各种各样的图形变换和动画效果，为 Web 开发带来了更多可能性。通过灵活运用这些属性，开发者可以创建出吸引人、交互性强的 SVG 图形，提升用户体验，丰富网页内容。