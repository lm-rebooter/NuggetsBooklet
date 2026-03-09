在现代 Web 设计中，动画已成为吸引用户和增强用户体验的关键元素之一。CSS 路径动画（也称为 `offset-path` 动画）是一种独特而引人注目的技术，它使你可以在 Web 上创建令人印象深刻的动效。无论是为了引导用户的注意力，或者为了给 Web 添加一些创意和生动的元素，路径动画都能够为你提供强大的工具。

  


通过 CSS 路径动画，你可以让元素沿着指定的路径移动、旋转和变换，而无需编写复杂的 JavaScript 脚本。这为 Web 开发者提供了更多的自由度，使他们能够创建独特的、视觉上令人满意的动画效果。

  


在这节课中，我将向你介绍 CSS 路径动画的基础知识和实际应用。你将学会如何创建各种各样的动画效果，从简单的路径移动到复杂的曲线运动。无论你是初学者还是有经验的 Web 开发人员，都可以通过这节课的内容掌握 CSS 路径动画的精髓。

  


准备好了吗？让我们开始探索 CSS 路径动画的奇妙世界吧！

  


## 什么是 CSS 路径动画

  


在解释什么是 CSS 路径动之前，有必要先解释一下什么是**路径动画**？

  


路径动画是一种通过在图形或其他可视元素上定义路径，使元素沿着这些路径移动、变换或执行其他动作的动画技术。这些路径可以是直线、圆、椭圆、曲线或复杂的自定义路径，元素会按照这些路径的轨迹进行动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abcba904757c471e9f0a081477cfde45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=750&h=1334&s=1864527&e=gif&f=58&b=fbf7f7)

  


上图中的猫是沿着指定的路径行走的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63db9c1e3c8741fd8140b220144527a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=900&h=700&s=1628984&e=gif&f=38&b=eef4fa)

  


上图中收菜特效也有路径动画的身影。

  


在 Web 开发中，路径动画可以通过 CSS 、JavaScript 和 SVG 等技术来实现。我们接下来要探索的就些技术中的一种，即 CSS 路径动画。

  


简单地说，**CSS 路径动画是一种用于创建元素动画的技术，它允许你指定一个路径，然后使 Web 页面上的元素沿着这个路径进行移动、旋转或者发生其他变换，从而产生动画效果**。

  


在 CSS 中，我们主要使用 CSS 的 `offset` （它是 `offset-position` 、`offset-path` 、`offset-distance` 、`offset-rotate` 和 `offset-anchor` 等属性的简写）来实现路径动画。其中，最核心的是 `offset-path` 属性，它定义了动画元素将要淍着的路径。你可以将这个路径定义为一个基本形状（如圆形或椭圆形）、一个 SVG 路径或一个自定义路径。然后，使用 `offset-distance` 、`offset-rotate` 等属性，你可以进一步控制动画元素在路径上的行为，如其在路径上的位置、旋转角度和动画速度等。

  


## 路径动画的重要性

  


CSS 路径动画是 CSS 中制作动画效果的重要特性之一，它可以帮助 Web 开发人员创建各种各样的动画效果，比如元素的平滑滑动、曲线运动、飞行路径等。这种技术在 Web 开发中应用非常广泛，可以在网站的导航菜单、滚动页面、轮播图、动画图标等各种场景中找到。它可以增加 Web 应用、Web 网站或多媒体项目的交互性和吸引力，使用户对内容产生更多兴趣，同时也可以用于讲解和展示复杂的概念。

  


路径动画对于增强用户体验和提高 Web 页面吸引力至关重要，原因如下：

  


-   **引人入胜的交互性**： 路径动画可以为用户提供引人入胜的交互性体验。通过动态移动、旋转或缩放元素，用户可以更容易地与 Web 页面内容互动。这种互动性吸引用户的兴趣，使他们更倾向于与网站进行互动，而不仅仅是静态地浏览页面。
-   **吸引用户的注意力**： 动画往往能够引起用户的注意力，因为它们在页面中产生了运动和变化。路径动画可以用来突出显示特定的内容、导航菜单或页面元素，从而引导用户的注意力，提高信息的传达效果。
-   **让 Web 更生动**： 路径动画可以使 Web 内容更生动，增加 Web 页面的视觉吸引力。例如，通过路径动画可以创建流畅的过渡效果，使页面元素平滑地移动或渐变，从而使整个页面看起来更加流畅和令人愉悦。
-   **提高用户参与度**： 用户通常更倾向于与具有动画效果的 Web 应用或网站互动。路径动画可以使用户感到页面更具吸引力和趣味性，鼓励他们更深入地浏览内容、点击链接或执行其他操作。
-   **品牌形象和创意展示**： 对于企业和品牌网站来说，路径动画是展示创意和品牌形象的有力工具。它可以用来制作独特的标志动画、产品展示和品牌故事，从而让品牌更具识别度和吸引力。
-   **提高用户留存率**： 通过提供有趣的动画效果，网站可以吸引用户的兴趣，使他们更长时间地停留在网站上。这可以提高用户留存率，增加页面的浏览时间，从而有机会将更多信息传递给用户。

  


总之，CSS 路径动画是一种强大的工具，可以用来增强网页的交互性、吸引力和性能，而且它越来越受到 Web 前端开发者的青睐。它提供了一种简单而有效的方式来创建引人注目的动画效果，为用户提供更丰富的在线体验。

  


## 如何制作一个简单的路径动画

  


我们先从一个简单的路径动画效果开始，看看 `offset` 属性是如何实现路径动画的。你可以按照以下步骤进行。

  


首先，你需要一个动画元素，例如：

  


```HTML
<div class="animated-element"></div>
```

  


接着你需要一个路径，假设你有一条看起来像下面这样的一条曲线路径：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c8a1300ca994b19ac8310085e765096~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1092&s=124711&e=jpg&b=555577)

  


它是一条 SVG 的路径（`path`）：

  


```SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 515.8 168.1">
    <path stroke="#000" stroke-miterlimit="10" d="M.4 84.1s127.4 188 267.7 0 247.3 0 247.3 0" fill="transparent"/>
</svg>
```

  


你现在可以在 CSS 中给元素设置基本样式和使用 CSS 的 `offset` 属性来控制路径动画：

  


```CSS
@keyframes moveAlongPath {
    from {
        offset-distance: 0%;
    }
    to {
        offset-distance: 100%;
    }
}

.animated-element {
    width: 24px;
    aspect-ratio: 1;
    position: absolute;
    top: 0;
    left: 0;
    
    offset-path: path('M.4 84.1s127.4 188 267.7 0 247.3 0 247.3 0');
    offset-distance: 0%;
    animation: moveAlongPath 2000ms linear infinite alternate;
}
```

  


上面代码中，设置了动画元素（`.animated-element`）的基本样式，包括宽度、高度和位置等。我们使用了 `position: absolute` 将元素的定位设置为绝对定位，以便于在路径上自由移动。

  


使用 `animation` 属性来定义动画效果，包括动画名称（`moveAlongPath`）、动画持续时间（`2000ms`）、动画速度曲线（`linear`）和动画播放次数（无限循环播放 `infinite`）。

  


使用 `offset-path` 属性来定义路径，示例中使用了 `path()` 函数来描述路径（它是 SVG 中 `<path>` 元素的 `d` 属性的值）。在这个示例中，它是一条曲线 `path('M.4 84.1s127.4 188 267.7 0 247.3 0 247.3 0')` 。

  


最后，使用 `offset-distance` 属性来控制元素在路径上的位置。在这个示例中，我们在关键帧中逐渐改变 `offset-distance` 的值，以实现元素沿路径来回移动。

  


你看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9fab24be0c74b01a7745d67ae144060~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=454&s=189203&e=gif&f=79&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/XWozXwm

  


这就是 CSS 制作路径动画的基本步骤。你可以根据自己的创意和需求进行进一步的定制和改进。

  


## CSS 路径动画特性：offset

  


CSS 的 `offset` 属性是一个简写属性，它设置了沿着定义的路径动画元素所需的所有属性。`offset` 属性有助于定义偏移变换，这是一种将元素中的一个点（`offset-anchor`）与路径（`offset-path`）上的偏移位置（`offset-position`）在路径的各个点（`offset-distance`）上对齐，并且可以选择旋转元素（`offset-rotate`）以跟随路径方向的变换。

  


简单地说，CSS 的 `offset` 属性允许你指定一个框的位置，作为该框的锚点（`offset-anchor`）沿着几何路径（`offset-path`）的距离（`offset-distance`），该路径相对于其包含块的坐标（`offset-position`）来定义，而且该框的方向可以选择性地指定为相对于该点处路径方向的旋转（`offset-rotate`）。

  


说了这么多，**CSS 的** **`offset`** **属性就是用来控制动画元素在路径上的位置**。它主要包括以下几个子属性：

  


-   **`offset-path`**：用于指定动画元素沿着的路径，即动画路径。这个路径可以是简单的形状，如 `circle()`、`ellipse()`，也可以是复杂的贝塞尔曲线或 SVG 路径。你可以通过设置 `offset-path` 来定义动画元素要沿着哪条路径移动
-   **`offset-distance`**：指定动画元素在路径上的位置。可以将其看作是动画元素沿路径的偏移量。通过设置`offset-distance`，你可以控制动画元素在路径上的位置，从而实现动画元素沿路径移动的效果
-   **`offset-rotate`**：控制动画元素在路径上的旋转方向。它用于指定动画元素在路径上的旋转角度，使动画元素可以根据路径的方向自动旋转
-   **`offset-anchor`**：指定动画元素的锚点，即动画元素与路径的连接点。它可以用于调整动画元素与路径之间的对齐方式，从而影响动画元素在路径上的位置
-   **`offset-position`** ：指定动画元素在其包含块内的初始位置。它可以用于调整动画元素沿着路径移动的起始位置。

  


这些属性一起构成了 [CSS Motion Path 规范的一部分](https://www.w3.org/TR/motion-1/#motion-paths-overview)，它们允许你创建复杂的动画效果，使元素沿着自定义路径移动、旋转和对齐。通过使用这些属性，你可以实现各种有趣的动画效果，提高 Web 页面的交互性和视觉吸引力。

  


接下来，我们分别来介绍这几个属性。我们先从 `offset-path` 开始。

  


### 定义路径：offset-path

  


在 CSS 中要制作一个路径动画，它有一个必要条件，那就是需要一条**路径**。这个路径可以是一个基本形状（比如圆 和椭圆），可以是一条曲线（比如贝塞尔曲线），也可以是 SVG 路径。CSS 的 `offset-path` 属性就允许你为动画元素指定一个不可见的路径。例如：

  


```CSS
.animation-element {
    offset-path: path('M0,0 C40,160 60,160 100,0');
}
```

  


`offset-path` 除了 `path()` 函数之外，它还可以使用 CSS 的 `clip-path` 和 `shape-outside` 属性相同的语法来定义动画元素的路径。

  


-   **`circle()`** ： 用于创建一个圆形。例如，`circle(50%)` 表示一个半径为容器宽度的 `50%` 的圆。
-   **`ellipse()`** ： 用于创建一个椭圆，可以在一个方向上挤压，另一个方向上拉伸。例如，`ellipse(100px 50px)`表示一个宽度为 `100px`，高度为 `50px` 的椭圆。
-   **`rect()`** ： 用于创建一个矩形。例如，`rect(0px 100px 50px 0px)` 表示一个左上角坐标为 `(0,0)`，右下角坐标为 `(100px,50px)` 的矩形。
-   **`inset()`** ： 用于创建一个内部矩形。例如，`inset(10px 20px 30px 40px)` 表示一个距离边框上、右、下、左各自 `10px`、`20px`、`30px`、`40px` 的内部矩形。
-   **`xywh()`** ： 用于通过指定左上角坐标 `(x, y)` 和宽度高度 `(width, height)` 来定义一个矩形。例如， `xywh(10px 20px 100px 50px)` 表示一个左上角坐标为 `(10px,20px)`，宽度为 `100px`，高度为 `50px` 的矩形。
-   **`polygon()`** ： 用于创建更复杂的多边形形状。你可以指定多个点坐标来定义多边形的形状。例如， `polygon(0 0, 100px 0, 50px 50px)` 表示一个由三个点组成的三角形。
-   **`ray()`** ： 用于创建一个射线，引入了极坐标。例如，`ray(45deg 100px)` 表示一个方向为 `45` 度的射线，长度为 `100px` 。
-   **`url()`** ： 用于引用 SVG 路径或 SVG 形状。你可以将 SVG 路径的 URL 作为值来定义形状。例如， `url(#my-svg-path)` 表示引用了 `ID` 为 `my-svg-path` 的 SVG 路径。
-   **`coord-box`**： 一种特殊的方式，用于在 `shape-outside` 属性中定义一个坐标框，该属性定义在浮动元素周围的形状。这是一种复杂的方法，通常用于更高级的文本流布局。

  


其中 `circle()` 、`ellipse()` 、`inset()` 、`polygon()` 、`url()` 、`xywh()` 和 `path()` 等函数使用方式与 `clip-path` 相似，只是在这里我们将其应用于 `offset-path` ，用来指定动画元素的路径：

  


```CSS
@layer path {
    .animated {
        position: absolute;
        offset-distance: var(--offset-distance);
        offset-rotate: auto;
        
        .circle &{
            offset-path: circle(50% at center);
        }
        
        .ellipse & {
            offset-path: ellipse(150px 100px at center);
        }
        
        .inset & {
            offset-path: inset(30px round 40px);
        }
        
        .xywh & {
            offset-path: xywh(-25px -25px 200px 200px);
        }
        
        .polygon & {
            offset-path: polygon(50% 0%, 100% 100%, 0% 100%);
        }
        
        .url & {
            offset-path: url('#squiggle');
        }
        
        .path & {
            offset-path: path("M8,56 C8,33.90861 25.90861,16 48,16 C70.09139,16 88,33.90861 88,56 C88,78.09139 105.90861,92 128,92 C150.09139,92 160,72 160,56 C160,40 148,24 128,24 C108,24 96,40 96,56 C96,72 105.90861,92 128,92 C154,93 168,78 168,56 C168,33.90861 185.90861,16 208,16 C230.09139,16 248,33.90861 248,56 C248,78.09139 230.09139,96 208,96 L48,96 C25.90861,96 8,78.09139 8,56 Z");
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7879c2ca7c04b61a51a326ca41b37b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=845&s=271023&e=jpg&b=fcfcfc)

  


注意，虽然 `offset-path` 使元素在指定的路径上了，但它并不会动起来，如果希望元素能沿着 `offset-path` 指定的路径动起来，还需要改变 `offset-distance` 属性的值（稍后会详细介绍该属性）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/152f86a5cde74b6fa68da390ea919076~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1156&h=650&s=1198243&e=gif&f=229&b=fdfdfd)

  


> Demo 地址：https://codepen.io/airen/full/GRPOXBM

  


`offset-path` 除了可以使用我们熟悉的函数之外，比如 `circle()` 、`path()` 等，还新增了 `ray()` 函数。

  


[W3C 规范中说](https://www.w3.org/TR/motion-1/#valdef-offsetpath-ray)：“**`ray()`** **函数定义了一个偏移路径，是从某一定义的角度出发的直线**”。

  


也就是说，`ray()` 函数指定了一个角度，这个角度创建了一条线（射线），通过极坐标从圆的中心定位。`ray()` 函数绘制的射线起始于一个 `offset-position` ，并沿着指定角度（`<angle>`）的方向延伸，它的长度可以通过指定一个大小（`<size>`）并使用 `contain` 关键词来限制。这个函数采用以下语法：

  


```
ray() = ray( [ <angle> && <size> && contain? ] )

<size> = [ closest-side | closest-corner | farthest-side | farthest-corner | sides ]
```

  


具体参数如下：

  


-   `<angle>`：表示射线的方向，以角度（`deg`）为单位。`0deg` 表示垂直向上（指向上的 `y` 轴上），正角度表示顺时针旋转。

-   `<size>`（可选）：用于定义偏移路径的长度（指定线段长度），即相对于包含框的 `offset-distance` 属性的 `0%` 和 `100%` 之间的距离。它可以是以下值之一：

    -   `closest-side`：表示路径长度等于元素的最近边界到起始点的距离，即射线起始点与元素包含块的最近边缘之间的距离。如果射线的起始点位于包含块的边缘上，则线段的长度为零。如果射线的起始点在包含块之外，则认为包含块的边缘延伸到无限远。
    -   `closest-corner`：表示路径长度等于元素的最近角落到起始点的距离，即射线起始点与元素包含块中最近角的距离。如果射线的起始点位于包含块的角上，则线段的长度为零。
    -   `farthest-side`：表示路径长度等于元素的最远边界到起始点的距离，即射线起始点与元素包含块的最远边缘之间的距离。如果射线的起始点位于包含块之外，则认为包含块的边缘延伸到无限远。
    -   `farthest-corner`：表示路径长度等于元素的最远角落到起始点的距离。
    -   `sides`：表示路径长度等于路径与元素的边界的交点到起始点的距离，即射线起始点与线段与包含块边界相交的点之间的距离。如果起始点位于或在包含块边界之外，则线段的长度为零。

-   `<contain>`（可选）：表示要调整偏移距离（`offset-distance`）的值，以确保元素完全包含在路径内。如果没有任何偏移距离可以使元素完全包含在路径内，那么路径的大小会被最小地增加。具体来说，线段的长度减小了元素边框框的宽度或高度的一半，取两者中的较大值，但不会小于零。这是一个可选参数。

  


我们通过下面这个示例，视觉化向大家展示 `ray()` 函数的使用。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be9f8de7bfd44e73b582d20e5884a8ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1434&s=630289&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/KKbZawz

  


动画元素最初的位置是通过元素的偏移锚点（`offset-anchor: center`）移到元素的偏移起始位置（`offset-position: 0 0`）来确定的。动画元素还旋转以使其向射线的 `0deg` 角。如上图中编号 ① 所示：

  


```CSS
/* 图中编号 ① */
.animated {
    offset-path: ray(0deg closest-side);
}
```

  


如果将锚点偏移 `offset-anchor` 属性改变左上角（`offset-anchor: 0 0`），结果，动画元素的偏移锚点（`offset-anchor`）与偏移起始位置（`offset-position`）重合。射线角度应用于此起始点。元素元素被旋转以匹配 `y` 轴的 `0deg` 角并指向上方。如上图中编号 ② 所示：

  


```CSS
/* 图中编号 ②  */
.animated {
    offset-anchor: 0 0;
    offset-path:ray(0deg closest-side);
}
```

  


在与上面等同条件之下，如果调整 `ray()` 函数的角度值，比如应用一个更大的正角度 `150deg` ，动画元素从左上角开始，按顺时间方向旋转达到指定的 `150deg` 。如上图中编号 ③ 所示：

  


```CSS
/* 图中编号 ③  */
.animated {
    offset-anchor: 0 0;
    offset-path:ray(150deg closest-side);
}
```

  


反之，如果 `ray()` 函数指定的是一个负角度，比如 `150deg` ，那么动画元素将从左上角开始，按逆时针方向旋转达到指定的 `150deg` 。如此图中编号 ④ 所示：

  


```CSS
/* 图中编号 ④ */
.animated {
    offset-anchor: 0 0;
    offset-path:ray(-150deg closest-side);
}
```

  


下面这个可视化 Demo ，演示了 `ray()` 函数角度值为正负值时的旋转方向的差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/664c3f429ed74f3287b21b41910d03c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=906&h=610&s=1141092&e=gif&f=317&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/gOZogdp

  


图中编号 ③ 和编号 ⑤ 的动画元素都具有相同的 `offset-anchor` 和 `offset-path` 属性的值：

  


```CSS
/* 图中编号 ③*/
.animated {
    offset-anchor: 0 0;
    offset-path:ray(150deg closest-side);
}

/* 图中编号 ⑤*/
.animated {
    offset-anchor: 0 0;
    offset-path:ray(150deg closest-side);
}
```

  


然而，图中编号 ⑤ 显式将动画元素的 `offset-rotate` 属性的值指定为 `0deg` 。

  


```CSS
/* 图中编号 ⑤*/
.animated {
    offset-anchor: 0 0;
    offset-path:ray(150deg closest-side);
    offset-rotate: 0deg;
}
```

  


因此，动画元素将一直在整个射线路径上以这个特定的角度保持旋转，不会根据路径的方向旋转。比如，你可以尝试调整 `offset-distance` 属性的值，查看动画元素在路径上运动时，是不是保持着这个角度（`offset-rotate`）不变。

  


```CSS
.container {
    --offset-rotate: 0deg;
}

@keyframes moveRayPath {
    from {
        offset-distance: 0px;
    }
    to {
        offset-distance: 150px;
    }
}

@keyframes plane {
    to {
        offset-path: ray(360deg closest-side);
    }
}

.animated:nth-child(2) {
    offset-rotate: var(--offset-rotate);
    offset-anchor: 0 0;
    offset-distance: 0px;
    offset-path: ray(0deg closest-side);
    animation: moveRayPath 4s linear infinite alternate, plane 5s infinite linear;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfe03b7f75c24fb9895b07cb36d122f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=646&s=1076641&e=gif&f=232&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/bGOagXq

  


请注意，我们在图中编号 ⑤ 的动画元素上显式设置了 `offset-position` 的值为 `20% 30%` ：

  


```CSS
/* 图中编号 ⑤*/
.animated {
    offset-anchor: 0 0;
    offset-path:ray(150deg closest-side);
    offset-rotate: 0deg;
    offset-position: 20% 30%;
}
```

  


动画元素在没有显式设置 `offset-position` 属性的值时，将表示没有给动画元素指定起始位置，因此射线的起始位置是从动画元素的 `offset-position` 中派生的。射线的默认偏移起始位置是 `offset-position: auto` 。如果明确将 `offset-position` 属性指定为 `auto` 或省略并允许默认值，则射线的起始位置是动画元素框的左上角（即 `(0,0)` 位置）。如果将 `offset-position` 设置为 `normal` ，射线的起始位置是动画元素包含块的 `50% 50%` ，即动画元素包含块的正中心。而我们示例中的图中编号 ⑤ 指定 `offset-position` 属性的值是 `20% 30%` ，则表示动画元素距离其包含块（`.wrapper`）的顶部边缘（`top`）`30%` ，左侧边缘 `20%` ，即 `left 20% top 30%` ：

  


```CSS
.container {
    --offset-positionX: 0%;
    --offset-positionY: 0%;
}
  
.animated:nth-child(2) {
    offset-position: var(--offset-positionX) var(--offset-positionY);
    offset-anchor: 0 0;
    offset-path:ray(150deg closest-side);
    offset-rotate: 0deg;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be7bff92d7c249de85eb42cac94be464~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=608&s=837099&e=gif&f=254&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/QWzapMm

  


另外，在图中编写 ⑥ 、⑦ 和 ⑧ 中，给动画元素的 `offset-path` 属性指定了 `at <position>` 值，将动画元素放置在其包含框的底部边缘和右侧边缘：

  


```CSS
/* 图中编号 ⑥ */
.animated {
    offset-rotate: 0deg;
    offset-anchor: 0 0;
    offset-path: ray(100deg closest-side at bottom right);
}

/* 图中编号 ⑦ */
.animated {
    offset-rotate: 60deg;
    offset-anchor: 0 0;
    offset-path: ray(100deg closest-side at bottom right);
}

/* 图中编号 ⑧ */
.animated {
    offset-anchor: 0 0;
    offset-path: ray(-145deg closest-side at bottom right);
}
```

  


你可以在下面这个 Demo 中尝试着调整 `at <position>` 中 `<position>` 值，它有点类似于 CSS 的 `background-position` 或 `clip-path` 属性中 `circle()` 和 `ellipse()` 函数中的 `at` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a505428650104d01a753255696c7e915~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=594&s=1871040&e=gif&f=174&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/xxmpqyb

  


上面示例中，`ray()` 函数的 `<size>` 参数的值都设置是 `closest-side` ，我们来看一下，在相同参数情况之下，`<size>` 取不同值时，对动画元素的影响：

  


```CSS
.animated {
    --ray-size: closest-side;
    offset-position: 0 30%;
    offset-distance: 20%;
    offset-path: ray(0deg var(--size));
} 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eefdcf561adf436b88fc4f6952841549~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=424&s=993876&e=gif&f=182&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/abPEJMz

  


最后来看 `ray()` 函数中包含和未包含 `contain` 关键词的差异。下面这个示例是来自 W3C 规范的：

  


```HTML
<body>
    <div class="box" id="redBox"></div>
    <div class="box" id="blueBox"></div>
</body>
```

  


```CSS
body {
    transform-style: preserve-3d;
    width: 200px;
    height: 200px;
}

.box {
    width: 50px;
    height: 50px;
    offset-position: 50% 50%;
    offset-distance: 100%;
    offset-rotate: 0deg;
}

#redBox {
    background-color: red;
}

#blueBox {
    background-color: blue;
}
```

  


`ray()` 未包含 `contain` 关键词：

  


```CSS
#redBox {
    offset-path: ray(45deg closest-side);
}

#blueBox {
    offset-path: ray(180deg closest-side);
}
```

  


`ray()` 包含 `contain` 关键词：

  


```CSS
#redBox {
    offset-path: ray(45deg closest-side contain);
}

#blueBox {
    offset-path: ray(180deg closest-side contain);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/353d3d2b205c4196ae2a51a7a26d9229~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1182&s=281968&e=jpg&b=ffffff)

  


你可以将 `ray()` 函数结合起来查看效果：

  


```CSS
@layer path {
    .container {
        --positionX: 0;
        --positionY: 0;
        --_offset-position: calc(var(--positionX) * 1%) calc(var(--positionY) * 1%);
        --offset-distance: 0;
        --offset-rotate: 0;
        --_offset-distance: calc(var(--offset-distance) * 1%);
        --_offset-rotate: calc(var(--offset-rotate) * 1deg);
        --ray-deg: 0;
        --_ray-deg: calc(var(--ray-deg) * 1deg);
        --_ray-size: closest-side;
        --ray: ray(var(--_ray-deg) var(--_ray-size));
    
        .animated {
            offset-path: var(--ray);
            offset-position: var(--_offset-position);
            offset-distance: var(--_offset-distance);
            offset-rotate: var(--_offset-rotate);
            offset-anchor:center;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00e2cabaa17340d68d6bbbffafb06cac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=642&s=2021710&e=gif&f=330&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/bGOYmoJ

  


注意，示例中我们还使用了 `offset` 属性的其他子属性，你现在不知道它们具体含义，不用过于担心，稍后会向大家一一介绍。

  


再回过头来看 `path()` 函数。

  


CSS 的 `offset-path` 属性使用 `path()` 函数来指定动画路径时，其难点在于其硬编码的特性。它不够灵活。我们被困在特定尺寸和视口大小硬编码路径的境地。例如，你有一个 `600px` 像素的 SVG 路径，但它可能存在于视窗口宽度为 `300px` 或 `3440px` 中，可不管是哪种情况之下，动画元素都会在这个 `600px` 像素的路径上运动。

  


```SVG
<!-- Path -->
<svg viewBox="0 0 425 225" class="path">
    <path d="M20,20 C20,200 400,0 400,200" stroke="#000" stroke-miterlimit="10" stroke-dasharray="10" fill="transparent"></path>
</svg>
```

  


```CSS
@keyframes moveAlongPath {
    from {
        offset-distance: 0%;
    }
    to {
        offset-distance: 100%;
    }
}

.animated {
    offset-path: path("M20,20 C20,200 400,0 400,200");
    offset-distance: 0%;
    animation: moveAlongPath 2000ms linear infinite alternate;
}

/* Layout */
.container {
    width: 50vmin;
    aspect-ratio: 21 / 9;
    
    & svg {
        display: block;
        width: 100%;
        height: 100%;
    }
}
```

  


尝试调整浏览器视窗大小时，你会看到：

  


-   SVG 会随着浏览器视窗大小进行缩放，其包含的路径也会如此
-   `offset-path` 属性 `path()` 引入的路径却不会随着浏览器视窗大小变化而缩放，动画元素会偏离 `path()` 指定的路径

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dc663cc25044c92894e595c2ea63fe5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=962&h=486&s=2123530&e=gif&f=384&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/LYMeLNr

  


这对于简单的路径可能还可以接受。但一旦我们的路径变得更加复杂，维护起来就会变得困难。特别是，我们使用了在图形设计软件中创建的路径，比如在 Figma 中绘制的路径。Web 开发人员需要打开图形设计软件，重新调整路径，导出路径，并将其与 CSS 集成。这可能不是最糟糕的解决方案，但它需要一定的维护工作，可能会让 Web 开发人员陷入麻烦。

  


到目前为止，CSS 还没有一个合理的方案能解决 `path()` 给我们带来的麻烦（适配性麻烦）。因此，要避免 `path()` 带来的麻烦，还是需要[通过 JavaScript 来解决](https://css-tricks.com/create-a-responsive-css-motion-path-sure-we-can/)。在这里推荐 [GreenSock 的 MotionPath 插件](https://greensock.com/motionpath/)，它可以对 SVG 的 `path()` 进行缩放。只不过，它用于路径动画，并不是件轻易的事情，[感兴趣的同学自己可以查看下面这个 Demo](https://codepen.io/GreenSock/full/LwzMKL)，或对它进入更深层次的学习，这里就不详细展开，因为它已超出这节课的范畴。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/880285d314dc49b8928aa66e888a02f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=566&s=3154779&e=gif&f=302&b=000000)

  


> Demo 地址：https://codepen.io/GreenSock/full/LwzMKL

  


CSS 的 `offset-path` 除了可以接受上面所提到的函数之外，还可以使用几何形状的盒子（`<geometry-box>`），例如 `content-box` 、`padding-box` 、`border-box` 、`fill-box` 、`stroke-box` 或 `view-box` 中的一个。这个值可以单独指定，也可以与绘制形状的函数一起使用。

  


```CSS
offset-path: padding-box;
offset-path: content-box;
offset-path: inset(5%) content-box;
offset-path: circle(40%) padding-box;
offset-path: polygon(0% 0%, 100% 0%, 100% 100%) border-box;
```

  


我们来看一个简单的示例：

  


```HTML
<button class="button">
    Submit
    <video muted playsinline autoplay loop class="sparkle" src="sparklestars.mp4"></video>
</button>
```

  


注意，按钮上有一个迷你视频。我将 `offset-path` 设置为 `border-box` ，以便视频沿着按钮边缘移动：

  


```CSS
@keyframes traverse {
    0% {
        offset-distance: 0%;
    }
    100% {
        offset-distance: 100%;
    }
}
  
.sparkle {
    offset-path: border-box;
    offset-rotate: 0deg;
    animation: traverse 3.5s infinite linear;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e97f8a79a5d04096abdc31d7903df093~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=378&s=56795&e=gif&f=115&b=010101)

  


> Demo 地址：https://codepen.io/airen/full/GRPyEap

  


你可以在下面这个示例中，给 `offset-path` 属性选择不同的几何形状（`<geometry-box>`），查看动画效果运动路径有何变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5bfbd7247c64612ae7e047b5be8fdcd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=526&s=4072571&e=gif&f=485&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/WNLdEwZ

  


### 定义距离：offset-distance

  


CSS 的 `offset-distance` 属性用于定义动画元素在路径（`offset-path` 属性指定路径）中的位置，即动画元素沿着路径的偏移位置，它表示的**动画元素沿着路径的相对位置**。这个属性的值可以是一个百分比值或一个长度值。不过，使用百分比值要比使用长度值更为灵活，因为 `offset-distance` 的值为 `0%` 时，动画元素正好位于路径的起始点；`offset-distance` 的值为 `100%` 时，动画元素正好位于路径的末尾。

  


```CSS
@layer distance {
    ul {
        position: relative;
        
        & li {
            position: absolute;
            offset-path: circle(50% at center);
          
            &:nth-child(1) {
                offset-distance: 0%;
            }
          
            &:nth-child(2) {
                offset-distance: 16.667%;
            }
          
            &:nth-child(3) {
                offset-distance: 33.333%;
            }
          
            &:nth-child(4) {
                offset-distance: 50%;
            }
          
            &:nth-child(5) {
                offset-distance: 66.667%;
            }
          
            &:nth-child(6) {
                offset-distance: 83.333%;
            }
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/910fea63b5bc4b61bcfad4e70d4f6024~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1246&s=252468&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/JjwMyed

  


将上面的示例稍微调整一下，只有一个元素，而且`offset-distance` 的值随着拖动的滑块动态变化，你将看元素在路径上会运动起来：

  


```CSS
.animated {
    --offset-distance: 0%;
    
    offset-path: circle(50% at center);
    
    offset-distance: var(--offset-distance);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85decb0aa9e64ba8b3611bfa793b94d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=720&s=631570&e=gif&f=164&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/PoXEJNe

  


因此，如果我们希望一个动画元素在指定的路径上运动起来，那么只需要在 `@keyframes` 中设置 `offset-distance` 属性，你就可以控制动画元素沿着指定的路径运动。

  


```CSS
@keyframes movePath {
    to {
        offset-distance: 100%;
    }
}

.animated {
    offset-distance: 0%;
    offset-path: circle(50% at center);
    animation: movePath 2s linear infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65e750144df8434a8877ccf759344b80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=958&h=620&s=317019&e=gif&f=70&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/zYypEdq

  


在这个示例中，在动画的关键帧（`@keyframes`）的 `100%` 状态下设置了 `offset-distance` 属性的值为 `100%`，因此动画元素在路径的起始点和终点之间来移动。这就是 `offset-distance` 在路径动画中的作用。它允许你控制动画元素沿着路径的位置，从而创建各种路径动画效果。

  


```HTML
<div class="container">
    <div class="animated" style="--index: 0">😮</div>
    <div class="animated" style="--index: 1">😳</div>
    <div class="animated" style="--index: 2">🤣</div>
    <div class="animated" style="--index: 3">😍</div>
    <div class="animated" style="--index: 4">😇</div>
    <div class="animated" style="--index: 5">😎</div>
    <div class="animated" style="--index: 6">🤢</div>
    <div class="animated" style="--index: 7">🙄</div>
</div>
```

  


```CSS
@layer animation {
    @keyframes spin {
        0% {
            offset-distance: 0;
        }
        100% {
            offset-distance: 100%;
        }
    }

    @keyframes expandCircle {
        0% {
            offset-path: circle(16px at center);
        }
        100% {
            offset-path: circle(200px at center);
        }
    }

    .animated {
        --num: 8;
        --offset-distance: calc(100% / var(--num));
        
        offset-path: circle(16px at center);
        offset-distance: calc(var(--offset-distance) * var(--index));
        animation: 
            spin 6s infinite linear,
            expandCircle 3s infinite alternate ease-out;
        animation-composition: accumulate, replace;
    }  
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44ef5de99c564440ab1e857cda18d6c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=570&s=1228863&e=gif&f=107&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYbyGjZ

  


注意，`offset-distance` 在计算动画元素在路径上的位置时，有自己一套计算方法。相关的计算方法在 [W3C 规范中有陈述](https://www.w3.org/TR/motion-1/#calculating-the-computed-distance-along-a-path)，这里就不再花时间复述。

  


### 定义元素面对的方向：offset-rotate

  


或许你已经发现了，上面示例中的表情符在圆形路径上都朝着路径的方向：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddbb27332d3c46198ca6f7c1e09f3552~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1131&s=186647&e=jpg&b=555674)

  


正如你所看到的一样，默认情况下，动画元素（例如上面的表情符号）将“面向”路径的方向，其右侧始终垂直于路径。这要归功于 `offset-rotate` 的 `auto` 值。如果我们希望动画效果背对路径的方向，可以使用 `reverse` 值。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d8d4a4c51204609b66a37bd702d1b7f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=576&s=759116&e=gif&f=215&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/rNopbRg

  


`offset-rotate` 属性还接受角度值（`<angle>`），如果要使动画元素保持在特定角度的固定方向而不跟随路径，可以使用它。简单地说，你可以使用 `offset-rotate` 控制动画元素的显示角度。通过应用 `offset-rotate: 0deg` ，动画元素将保持其原始的非路径固定方向，其中右侧始终朝右，而不考虑路径的方向，动画元素就好像不在路径上一样。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81eb36dfb3ea47f7ae0bd1c23bbf541b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=906&h=592&s=838456&e=gif&f=174&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/wvRpZVm

  


除此之外，`offset-rotate` 还可以接受两个值，即将 `auto` 或 `reverse` 关键词与角度值结合使用。例如：

  


```CSS
.animated {
    offset-rotate: auto 90deg;
}
```

  


动画元素将旋转以适应路径的方向，但它将增加 `90deg` 的偏移量。因此，通过旋转元素四分之一圈，现在是顶部面对路径的方向并保持垂直于它。

  


也就是说，下面这几种 `offset-rotate` 属性的使用都是有效的：

  


```CSS
.animated {
    offset-rotate: auto; /* offset-rotate 默认值 */
}

.animated {
    offset-rotate: reverse;
}

.animated {
    offset-rotate: 0deg;
}

.animated {
    offset-rotate: 45deg;
}

.animated {
    offset-rotate: auto 45deg;
}

.animated {
    offset-rotate: reverse 45deg;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c8c8976273147a4bf1a0ac4affc9879~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=712&s=1665678&e=gif&f=108&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/WNLdBvg

  


`offset-rotate` 属性可以接受关键词 `auto` 、`reverse` 和角度（`<angle>`）等不同值，这些值的含义如下：

  


-   **`auto`** ：表示动画元素会根据 `offset-path` 指定路径的方向相对于正 `x` 轴的角度进行自动旋转。如果与 `<angle>` 结合使用，计算出的 `<angle>` 值会添加到计算出的 `auto` 值上。注意，如果 `offset-path` 是通过 `ray()` 函数指定路径，那么 `auto` 隐含的旋转角度比射线的方位角小 `90deg`
-   **`reverse`** ：表示动画元素会根据 `offset-path` 指定路径的方向相对于正 `x` 轴的角度进行自动旋转，同时加上 `180deg` 。如果与 `<angle>` 结合使用，计算出的 `<angle>` 值会添加到计算出的 `reverse` 值上。注意，`reverse` 值与 `auto 180deg` 值效果等同
-   **`<angle>`** ：表示动画元素会根据指定的旋转角度进行常数顺时针旋转变换。如果与其中一个关键词 `auto` 或 `reverse` 结合使用，那么计算出的 `<angle>` 值添加到计算出的 `auto` 或 `reverse` 值上

  


需要注意的是，此处描述的旋转不会覆盖或替代由 `transform` 属性定义的任何旋转。

  


> W3C 规范对 `offset-rotate` 属性的角度计算有相应描述，想深入探究的同学，[可以阅读规范](https://www.w3.org/TR/motion-1/#calculating-path-transform)。

  


### 定义路径上的锚点：offset-anchor

  


默认情况下，沿着路径移动的是动画元素的中心，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2a484ef3ea04a01b8797f50778cce80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=482&s=487632&e=gif&f=159&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/WNLdBJW

  


正如你所看到的，动画元素将居中于路径上，但我们可以通过 `offset-anchor` 属性来更改这一点。它的使用与 CSS 的 `background-position` 或 `transform-origin` 相似，你可以设置动画元素在路径上的水平（`x` 轴）位置和垂直（`y` 轴）位置。例如，上面的示例，如果你希望让钢笔（动画元素）的笔尖（锚点）沿着路径运动，那么只需要将动画元素的 `offset-anchor` 设置为 `left top` 或 `0 0` ：

  


```CSS
.animated {
    offset-anchor: left top;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12783153f6d340768a9b3920287900ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=432&s=1134454&e=gif&f=262&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/ZEVvNNW

  


`offset-anchor` 属性的值可以是 `auto` 关键词（它的默认值），也可以是一个 `<position>` 值：

  


```
offset-anchor = auto | <position>

<position> = [ [ left | center | right ] || [ top | center | bottom ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]? | [ [ left | right ] <length-percentage> ] && [ [ top | bottom ] <length-percentage> ] ]
```

  


该属性的值有以下含义：

  


-   **`auto`**：如果 `offset-path` 是 `none` 并且 `offset-position` 不是 `auto`，则计算为 `offset-position` 的值。否则，计算为 `transform-origin` 的值。当 `offset-anchor` 设置为 `auto` 时，且 `offset-path` 为 `none`，`offset-position` 表现类似于 `background-position`。
-   `<position>`：一个位置值，用于指定锚点的水平和垂直偏移位置。它可以是 `top` 、`right` 、`bottom` 和 `left` 等关键词，可以是百分比值 `<percentage>` （比如 `0% 100%`），也可以是一个长度值 `<length>` （比如 `100px 200px`），还可以是关键词与百分比或长度值的组合（比如 `bottom 10px right 10px`）

  


下面这些使用方式都是有效的：

  


```CSS
/* 关键词 */
offset-anchor: top;
offset-anchor: bottom;
offset-anchor: left;
offset-anchor: right;
offset-anchor: center;
offset-anchor: auto;

/* 百分比值 */
offset-anchor: 25% 75%;

/* 长度值 */
offset-anchor: 0 0;
offset-anchor: 100px 200px;
offset-anchor: 10ch 8em;

/* 边缘领衔 */
offset-anchor: bottom 10px right 20px;
offset-anchor: right 3em bottom 10px;
```

  


它的使用方式，可以参考 CSS 的 `background-position` 或 `transform-origin` 等属性的使用。

  


注意，当 `<position>` 的值为百分比值时，水平偏移相对于内容区域的宽度，垂直偏移相对于内容区域的高度。例如，`offset-anchor` 的值为 `100% 0%` 时，锚点位于元素盒子的右上角。

  


还需要知道的是，`offset-anchor` 的默认值为 `auto` 时，锚点位于元素盒子的正中间，它与 `offset-anchor: 50% 50%` 或 `offset-anchor: center center` 是等同的。另外，`offset-anchor` 的值为百分比或长度值时，还可以是一个负值，锚点将位于元素盒子之外。例如下面这个示例，你可以拖动滑块，查看锚点位置的相关变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6bb58a6ff88441dae24eaaa1741c9fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=964&h=504&s=968006&e=gif&f=187&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/BavJgjg

  


### 定义偏移路径的起始位置：offset-position

  


`offset-position` 属性定义了偏移路径（`offset-path`）的初始位置。CSS 的 `offset-path` 会将动画元素附加到指定路径中的一个端点上。例如，下面这个示例，将每个动画元素（圆点）放在同一个路径上，并且使用 `offset-distance` 指定不同的距离：

  


```CSS
@layer path {
    .dot {
        --num: 20;
        offset-path: path("M173.852,219.021C332.821,402.868 316.77,77.919 464.477,231.289");
        position: absolute;
        top: 0;
        offset-distance: calc(100% / var(--num) * var(--index));
        
        &:nth-child(1) {
            --index: 0;
        }
        
        &:nth-child(2) {
            --index: 1;
        }
        
        &:nth-child(3) {
            --index: 2;
        }
        
        &:nth-child(4) {
            --index: 3;
        }
        
        &:nth-child(5) {
            --index: 4;
        }
        &:nth-child(6) {
            --index: 5;
        }
        &:nth-child(7) {
            --index: 6;
        }
        &:nth-child(8) {
            --index: 7;
        }
        &:nth-child(9) {
            --index: 8;
        }
        &:nth-child(10) {
            --index: 9;
        }
        &:nth-child(11) {
            --index: 10;
        }
        &:nth-child(12) {
            --index: 11;
        }
        &:nth-child(13) {
            --index: 12;
        }
        &:nth-child(14) {
            --index: 13;
        }
        &:nth-child(15) {
          --index: 14;
        }
        &:nth-child(16) {
          --index: 15;
        }
        &:nth-child(17) {
            --index: 16;
        }
        &:nth-child(18) {
            --index: 17;
        }
        &:nth-child(19) {
            --index: 18;
        }
        &:nth-child(20) {
            --index: 19;
        }
        &:nth-child(21) {
            --index: 20;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67731b1b87b041cfa27281e329607663~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1131&s=102222&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/LYMewzP

  


事实上，每个圆点（动画元素）的 `offset-position` 属性的值都是 `auto` （默认值），它的表现行为与 `position` 属性指定的盒子的位置。不同的是，`offset-position` 是相对于动画元素框中心位置（`offset-anchor`）定位，而定位元素（`position` 属性不是 `static` ）是相对于元素左上角位置定位。

  


或许上面这个示例不太好解释 `offset-position` ，我换成 W3C 规范中提供一个示例来向大家阐述 `offset-position` 属性在路径动画中所呈现的效果或者说作用：

  


```HTML
<div class="wrapper">
    <div class="animated"></div>
</div>
```

  


```CSS
.wrapper {
    position: relative;
    width: 300px;
    aspect-ratio: 1;
    
    .animated {
        width: 100px;
        aspect-ratio: 1;
        background-color: orange;
        position: absolute;
        top: 100px;
        left: 80px;
        
        offset-position: auto;
        offset-anchor: center;
        offset-path: ray(0deg);
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b3d827e14e64c4193ea4fd45a45c656~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1460&s=438894&e=jpg&b=555674)

  


> Demo 地址：https://codepen.io/airen/full/OJrzKdx

  


简单地说，`offset-position` 是用来定义动画元素在其包含框中的位置。你可以尝试调整下面示例中的滑块，改变 `x` 轴和 `y` 轴的值，但看 `offset-position` 使得动画元素在其包含框中是如何运行的：

  


```CSS
@layer position {
    .container {
        --positionX: 0%;
        --positionY: 0%;
    }
    
    .animated {
        offset-position: var(--positionX) var(--positionY);
        offset-anchor: center;
        offset-path: ray(0deg);
    }
  
    .position {
        top: var(--positionY) ;
        left: var(--positionX);
        translate: -50% -50%;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/339b7d6725d64de4af6ae4db91a2cc84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=626&s=1003324&e=gif&f=220&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/QWzQLvY

  


注意，如果动画元素的 `position` 属性的值为 `static` ，且 `offset-position` 属性的值为 `auto` ，则 `offset-position` 将被忽略。另外，CSS 的 `offset-anchor` 属性会影响 `offset-position` 的定位。

  


阅读到这里，我想你已经掌握了如何使用 `offset` 或者其子属性 `offset-*` 来制作路径动画了。事实上，CSS 的 `offset` 的所有子属性都可以动画化。比如下面这个示例，对 `offset-rotate` 和 `offset-distance` 进行动画化：

  


```CSS
@layer bee {
    .bee {
        offset-path: path(
            "M15.541,243.303C16.21,219.321 30.448,143.922 88.62,145.435C146.793,146.948 132.735,199.861 126.175,233.318C119.615,266.775 139.193,305.391 190.045,301.296C240.896,297.201 272.296,256.861 277.71,206.221C283.125,155.582 236.55,163.225 232.303,187.532C228.057,211.839 255.03,233.417 301.396,215.955C347.763,198.494 338.917,165.724 329.914,139.292C319.546,108.855 335.797,51.805 390.533,60.171C440.125,67.75 443.84,114.527 426.955,152.296C407.61,195.567 396.033,220.441 419.696,258.748C443.358,297.055 504.072,294.099 517.313,250.744C530.553,207.39 501.502,169.464 494.931,147.938C488.36,126.412 516.8,107.776 538.451,118.963C560.103,130.15 561.621,167.457 531.87,180.883"
        );

        offset-rotate: auto 90deg;
        animation: followpath 20s linear infinite, wiggle 0.4s linear infinite;
    }

    @keyframes followpath {
        to {
            offset-distance: 100%;
        }
    }
    
    @keyframes wiggle {
        0% {
            offset-rotate: auto 75deg;
        }
        50% {
            offset-rotate: auto 105deg;
        }
        100% {
            offset-rotate: auto 75deg;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0569173bc5749b1a16c42b4a84c138f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=532&s=324818&e=gif&f=128&b=3d3d3d)

  


> Demo 地址：https://codepen.io/airen/full/vYvdBbj

  


## 路径动画用例

  


接下来，我们来看看在实际生产中，路径动画可以用于哪些场景。

  


### 抛物线动效

  


有了 `offset` 属性之后，我们可以轻易的使一个物体沿着抛物线轨迹运动，例如下图这种抛球的动画效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94ac78253624dc2b6550d28a25117a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=522&s=1014277&e=gif&f=222&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/wvRyBog

  


示例中的抛物线路径可以通过设计软件来获取，然后将其运用于 `offset-path` 的 `path()` 函数。在此基础上，在 `@keyframes` 中改变 `offset-distance` 的值，就可以实现上图的效果。其核心代码如下：

  


```CSS
@layer parabola {
    @keyframes parabolicAnimation {
        100% {
            offset-distance: 100%;
        }
    }
    
    .ball {
        position: absolute;
        offset-path: path(
            "M0.476562 176.284C58.1569 49.8396 223.555 -32.5689 295.444 13.8944C433.254 102.965 500.477 366.415 500.477 366.415"
        );
        bottom: 400px;
        left: 120px;
        
        &.playing {
            animation: parabolicAnimation 3s linear both;
        }
    }
} 
```

  


使用同样的原理，我们就可以实现金币掉落，收菜，收金币等效果。我们以金币掉落为例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccac84f1f8ea4f3f8ba018ec84cf59f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=522&h=736&s=826067&e=gif&f=183&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/qBLxbqw

  


在这个示例中，我们有六个金币分别从一个地方掉落下来，所以我们需要六个 `.coin` 和六条不同的 `path` ：

  


```HTML
<div class="container">
    <div class="coin"></div>
    <div class="coin"></div>
    <div class="coin"></div>
    <div class="coin"></div>
    <div class="coin"></div>
    <div class="coin"></div>
  
    <!-- 这个 SVG 主要用于 Demo 上展示路径 -->  
    <svg width="375" height="579" viewBox="0 0 375 579" fill="none" xmlns="http://www.w3.org/2000/svg" class="path">
        <path d="M146.5 31.5C146.5 31.5 88.0267 171.837 68 266.5C48.4679 358.825 44.5 507 44.5 507" stroke="black" stroke-dasharray="14 4" />
        <path d="M148.004 32C148.004 32 130.497 184.5 130.504 281C130.51 375.368 115.5 404 115.5 404" stroke="black" stroke-dasharray="14 4" />
        <path d="M150.5 33C150.5 33 188.493 177.5 188.5 274C188.506 368.368 164.5 526 164.5 526" stroke="black" stroke-dasharray="14 4" />
        <path d="M152 32C152 32 222.199 127.88 243.5 222C265 317 265 497 265 497" stroke="black" stroke-dasharray="14 4" />
        <path d="M152.5 33.5C152.5 33.5 278.199 127.88 299.5 222C321 317 319.5 336.5 319.5 336.5" stroke="black" stroke-dasharray="14 4" />
        <path d="M152.5 33.5C152.5 33.5 316 97.5 345.5 178C379.015 269.455 345.5 551 345.5 551" stroke="black" stroke-dasharray="14 4" />
    </svg>
</div>
```

  


注意，这些路径是使用 Figma 软件绘制的。在 CSS 中给每个 `.coin` 的 `offset-path` 属性设置不同的路径值：

  


```CSS
.coin {
    --path: path(
        "M146.5 31.5C146.5 31.5 88.0267 171.837 68 266.5C48.4679 358.825 44.5 507 44.5 507"
    );
    offset-path: var(--path);

    &:nth-of-type(2) {
        --path: path(
            "M148.004 32C148.004 32 130.497 184.5 130.504 281C130.51 375.368 115.5 404 115.5 404"
        );
    }

    &:nth-of-type(3) {
        --path: path(
            "M150.5 33C150.5 33 188.493 177.5 188.5 274C188.506 368.368 164.5 526 164.5 526"
        );
    }

    &:nth-of-type(4) {
        --path: path(
            "M152 32C152 32 222.199 127.88 243.5 222C265 317 265 497 265 497"
        );
    }

    &:nth-of-type(5) {
        --path: path(
            "M152.5 33.5C152.5 33.5 278.199 127.88 299.5 222C321 317 319.5 336.5 319.5 336.5"
        );
    }

    &:nth-of-type(6) {
        --path: path(
            "M152.5 33.5C152.5 33.5 316 97.5 345.5 178C379.015 269.455 345.5 551 345.5 551"
        );
    }
}
```

  


在 `@keyframes` 中改变 `offset-distance` 的值为 `100%` 。你也可以在每个 `.coin` 上调整设置动画的参数，比如 `animation-delay` 和 `animation-duration` 等，甚至还可以使用 CSS 的 `transform` 属性给每个金币添加不同的变换效果：

  


```CSS
@layer coin {
    @keyframes coin {
        to {
            offset-distance: 100%;
        }
    }
    
    .coin {
        --path: path(
            "M146.5 31.5C146.5 31.5 88.0267 171.837 68 266.5C48.4679 358.825 44.5 507 44.5 507"
        );
        
        offset-path: var(--path);
        offset-rotate: 0deg;
    
        transform: none;
        transform-origin: center;
        transform-style: preserve-3d;
        backface-visibility: visible;
        transition: all 2s linear;
    
        &:nth-of-type(1) {
            .playing & {
                transform: rotateZ(-35deg) rotateX(-35deg) rotateY(140deg);
                animation-delay: 0.1s;
            }
        }
    
        &:nth-of-type(2) {
            --path: path(
                "M148.004 32C148.004 32 130.497 184.5 130.504 281C130.51 375.368 115.5 404 115.5 404"
            );
    
            .playing & {
                transform: rotateZ(55deg) rotateX(-55deg) rotateY(180deg);
                animation-delay: 0.15s;
            }
        }
    
        &:nth-of-type(3) {
            --path: path(
                "M150.5 33C150.5 33 188.493 177.5 188.5 274C188.506 368.368 164.5 526 164.5 526"
            );
    
            .playing & {
                transform: rotateZ(105deg) rotateX(-5deg) rotateY(240deg);
                animation-delay: 0.2s;
            }
        }
    
        &:nth-of-type(4) {
            --path: path(
                "M152 32C152 32 222.199 127.88 243.5 222C265 317 265 497 265 497"
            );
    
            .playing & {
                transform: rotateZ(35deg) rotateX(-45deg) rotateY(120deg);
                animation-delay: 0.25s;
            }
        }
    
        &:nth-of-type(5) {
            --path: path(
                "M152.5 33.5C152.5 33.5 278.199 127.88 299.5 222C321 317 319.5 336.5 319.5 336.5"
            );
    
            .playing & {
                transform: rotateZ(-165deg) rotateX(45deg) rotateY(200deg);
                animation-delay: 0.3s;
            }
        }
    
        &:nth-of-type(6) {
            --path: path(
                "M152.5 33.5C152.5 33.5 316 97.5 345.5 178C379.015 269.455 345.5 551 345.5 551"
            );
    
            .playing & {
                transform: rotateZ(-24deg) rotateX(35deg) rotateY(-70deg);
                animation-delay: 0.35s;
            }
        }
    
        .playing & {
            animation: coin 1.5s linear both;
        }
    }
} 
```

  


### Loading 动效

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac4c793709ba4bcd81804220d896a2c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=466&s=512302&e=gif&f=112&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/ZEVrWMG

  


以往在 CSS 要实现上面这样的 Loading 动效，对于 Web 开发者来说还是极其困难的。现在，我们使用这节课所学的知识，就要容易很多了。

  


```HTML
<div class='container'>
    <div class='circle'>🧜🏻♀️</div>
    <div class='circle'>🧚🏻♂️</div>
    <div class='circle'>🧜🏽♂️</div>
    <div class='circle'>🧚🏽♀️</div>
</div>
```

  


关键 CSS 代码如下：

  


```CSS
@layer loading {
    @keyframes load {
        to {
            offset-distance: 100%;
        }
    }
    
    .circle {
        --delay: 0.147s;
        --index: 1;
        offset-path: path("M0,0a72.5,72.5 0 1,0 145,0a72.5,72.5 0 1,0 -145,0");
        offset-rotate: 0deg;
        animation: load 1.8s cubic-bezier(0.86, 0, 0.07, 1) infinite;
        animation-delay: calc(var(--delay) * var(--index));
        animation-fill-mode: forwards;
        
        &:nth-child(2) {
            --index: 2;
        }
        
        &:nth-child(3) {
            --index: 3;
        }
        
        &:nth-child(4) {
            --index: 4;
        }
    }
}
```

  


四个动画元素 `.circle` 使用了相同的一条路径：

  


```CSS
.circle {
    offset-path: path("M0,0a72.5,72.5 0 1,0 145,0a72.5,72.5 0 1,0 -145,0");
}
```

  


并且将 `offset-rotate` 显式设置为 `0deg` ，使得动画元素不需要考虑路径方向。另外，每个动画元素的 `animation-delay` 有所差异。

  


使用相似的方法，还可以实现更为复杂的动效，比如下面这个，看上去有点像凤凰飞舞的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b373fdd105c449480b766d88beb446a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=434&s=618346&e=gif&f=79&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/ZEVrOoy

  


上面这个示例，我们使用六十多个 `div` ，为了便于在 CSS 中使用 CSS 自定义属性对动画元素进行样式化，每个 `div` 元素使用行内样式，使用 `--index` 自定义属性对每个 `div` 进行索引，索引编号从 `1` 开始：

  


```HTML
<body>
    <div class="o" style="--index: 1;">
        <div class="x"></div>
    </div>
    <!-- 中间省略 62 个 -->
    <div class="o" style="--index: 64;">
        <div class="x"></div>
    </div>
</body>
```

  


当然，你也可以考虑使用 JavaScript 脚本来对 DOM 结构进行创建，尤其是数量更多的情况之下。

  


动画中的每条线的颜色都采用了 `hsl()` 函数来定义，并且其色相 `H` 随着 DOM 结构顺序变化，即 `--index` 的值越大，颜色色相的值就越大。另外线条的宽度，动画的延迟时间，都是基于 `--index` 的值变化的：

  


```CSS
@layer layout {
    body {
        display: grid;
    }
    
    .o {
        grid-area: 1/1/-1/-1;
        width: 0.5px;
        aspect-ratio: 1;
        
        --h: 5.625;    /* 色相的基本值 */
        --d: 0.03125s; /* 动画延迟时间的基本值 */
        --s: 20px;     /* 线条宽度的常量值 */
        --st: 1.25px;  /* 线条宽度增加阈值 */
        --c0: hsl(calc(var(--h) * var(--index)) 50% 50% / 90%); /* 渐变颜色起始值 */
        --c1: transparent; /* 渐变颜色的终点值 */
        --delay: calc(var(--d) * var(--index)); /* 动画延迟时间 */
        --w: calc(var(--s) + var(--st) * var(--index)); /* 线条宽度 */
        
        .x {
            width: var(--w);
            height: 1px;
            background: linear-gradient(to right, var(--c0), var(--c1));
        }
    }
}
```

  


所有线条都使用了相同的路径（`path()` 函数的值相同），并且在 `@keyframes` 中改变 `offset-distance` 的值：

  


```CSS
@layer butterfly {
    @keyframes anInset {
        to {
            offset-distance: 100%;
        }
    }

    .x {
        offset-path: path(
            "M0 0 C0 -100 200 -100 100 0 C100 100 0 100 0 0 C0 -100 -200 -100 -100 0 C-100 100 0 100 0 0"
        );
        animation: anInset 4s infinite var(--delay) ease-in-out;
    }
}
```

  


注意，每个动画元素的动画延迟时间（`animation-delay`）的值是 `--delay` ，这一点也很重要，不然就看不到上图所呈现的动画效果。

  


除此之外，基于同样的制作方式，还可以构建出更多有意思的动画效果，比如下面这个跳动的心：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe4d3c9a80274abc8e41e5b088e192cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=616&s=997744&e=gif&f=62&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/xxmYLqM

  


其代码与上面的凤凰飞舞的效果是一样的，只是元素由直线改变在了点，路径改成了心形：

  


```CSS
.dot {
    offset-path: path(
        "M400 278.3216783216783C559.090909090909 -2.7972027972028 858.7412361198374 388.81118753073093 416.78320888706025 616.0839135230003 -58.74123611983737 388.81118753073093 240.909090909091 -2.7972027972028 400 278.3216783216783Z"
    );
}
```

  


你可以尝试着把心形路径调小，就可以用于一些点赞的按钮上了。比如 [@Chokcoco](https://codepen.io/Chokcoco) 老师使用相似的方法[制作一个按钮点击的动画效果](https://codepen.io/Chokcoco/full/xxgMPzJ)。当用户点击按钮时，按钮周边会有很多小圆点按照指定的路径运动，看上去就像一个简单的粒子动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42d52bebfcee431eb2e3720ae9b29595~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=944&h=512&s=641853&e=gif&f=115&b=ffffff)

  


> Demo 地址：https://codepen.io/Chokcoco/full/xxgMPzJ

  


### 飞行物

  


你要是正在制作一个与旅游相关的应用，我想你或多或许会需要制作一个飞行物相关的动画，比如从出发地飞往目的地的动画效果。类似这样的需求，动画路径就能起到关键性的作用。比如下面这个示例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9582330374eb465981d889502cd3dc30~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=646&s=601824&e=gif&f=95&b=0d0d0d)

  


> Demo 地址：https://codepen.io/airen/full/NWeyaPM

  


制作上面这个动画效果，首先你需要一张飞行地图，然后在地图上定义出飞行轨迹，如例中红色的虚线。然后在飞行物（比如一架飞机）上使用 `offset` ，使其沿着飞行轨迹运动：

  


```CSS
@layer flight {
    @keyframes move {
        to {
            offset-distance: 100%;
        }
    }
    
    .fly {
        offset-distance: 0%;
        offset-path: url("#move");
        position: absolute;
        animation: move 50s infinite linear;
    }
}
```

  


你可以将上面路径简化一下，在一些小组件上就可以使用类似的动画效果。比如机卡旅行卡上的位置跟踪示意图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ecec1cd4535444c85b5f2bc5c4c4063~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=662&s=11713062&e=gif&f=70&b=70854c)

  


> Demo 地址：https://codepen.io/airen/full/xxmYPxd

  


示例核心代码如下：

  


```CSS
@layer fly {
    @keyframes flying {
        to {
            offset-distance: 100%;
        }
    }
    
    .animated {
        offset-path: path(
            "M2 98C2 98 28.8945 47.6505 60 40C90.0041 32.6204 105.352 65.9245 136 62C159.5 58.9908 175 2.00082 215 2C262.027 1.99904 284.995 31.9527 332 30.5C357.574 29.7096 396.5 19 396.5 19"
        );
        offset-distance: 0%;
        offset-rotate: auto;
        top: 0;
        left: 24px;
        transition: all 0.2s linear;
        animation: flying 10s infinite linear;
    
        & svg {
            rotate: 45deg;
        }
    }
}
```

  


类似的效果，还可以在一些地图或运动轨迹的应用中使用，如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a87641f64e2b4f22a8352f4e4da3d3ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1106&s=877525&e=jpg&b=fbf9f9)

  


要是你感兴趣的话，可以尝试制作一个类似的效果。

  


### 文字环绕

  


通常情况之下，Web 开发者会使用 SVG 来制作文字环绕的效果。现在，你又将获得一个新技能，可以使用 `offset` 来实现文字环绕的效果。例如：

  


```HTML
<h1 data-splitting>CSS is Awesome! Modern CSS! </h1>
```

  


关键 CSS 代码如下：

  


```CSS
@layer chart {
    h1 {
        position: relative;
        width: min(50vmin, 400px);
        aspect-ratio: 1;
    }

    .char {
        --i: calc(100% / (var(--char-total) + 1));
        position: absolute;
    
        offset-path: circle(50% at center) border-box;
        offset-distance: calc(var(--i) * var(--char-index));
    }
}
```

  


使用 `offset-path` 属性的 `circle()` 函数绘制了一个圆形路径，然后 `offset-distance` 改变每个字母在路径上的偏移位置。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99156497c5ab4c0b8fd73e28dbc50a3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=584&s=10881941&e=gif&f=113&b=f26101)

  


> Demo 地址：https://codepen.io/airen/full/abPqEar

  


注意，示例中使用了 `Splitting.js` 库，对文本按字母符进行分隔。

  


你也可以稍加调整，发挥你的艺术细胞，创建更有新意的文字环绕的效果，比如 [@袁川老师](https://codepen.io/yuanchuan)在 [Codepen 上写的示例](https://codepen.io/yuanchuan/full/OJPvRRR)，看起来就很有范：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/043013025a334cc3bf015c21e36a35b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1274&s=324904&e=jpg&b=ffffff)

  


> Demo 地址：https://codepen.io/yuanchuan/full/OJPvRRR

  


### 路径动画与滚动驱动的完美结合

  


上面所展示的路径动画都是通过文档时间来控制动效的，即使用 `animation-duration` 和 `animation-delay` 来路径动画的播放时间和延迟时间。其实，为了驱动动画，我们还可以使用**[滚动驱动](https://juejin.cn/book/7223230325122400288/section/7259272255786450981)**来控制动画的播放。

  


假设你有一个像下面这样的路径动画：

  


```CSS
@keyframes move {
    to {
        offset-distance: 100%;
    }
}
.animated {
    position: absolute;
    
    offset-distance: 0%;
    offset-path: url(#my_path);
    animation: move 6s linear infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd93013071e44697874d335df359778b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=574&s=917115&e=gif&f=157&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/qBLxgLR

  


示例中的动画播放依旧是通过 `animation-duration` 来控制的。

  


现在，我们使用滚动驱动动画的特性来改造上面这个动画效果。使用滚动驱动动画的时间进度轴 `scroll` 函数，将滚动进度时间轴（`animation-timeline`）与动画（`move`）关联起来。该函数引用最近的祖先滚动容器的块轴（`block`）。然后，我们在动画元素（`.animated`）上设置动画：

  


```CSS
@keyframes move {
    to {
      offset-distance: 100%;
    }
}

.animated {
    position: absolute;
    
    offset-distance: 0%;
    offset-path: url(#my_path);
    animation: move auto linear;
    
    /* 滚动进度时间轴 */
    animation-timeline: scroll();
}
```

  


此时，路径动画的播放与滚动时间轴关联起来了。当用户向下滚动页面时，动画元素（`.animated` ，也就是小汽车）才会沿着 `offset-path` 指定的路径向前行进。反之，当用户向上滚动页面时，动画元素会沿着指定的路径向后退。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a051e76dc7664c4b89c06b00b06e313e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=450&s=2301834&e=gif&f=261&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/dywdaLz

  


你可能已经看到了，如果用户不滚动页面，小汽车（`.animated`）是不会沿着路径运动的。

  


除了使用滚动进度时间轴与路径动画关联起来之外，还可以使用视图进度时间轴与路径动画关联起来。只不过，它比滚动进度时间轴稍微复杂那么一点。这里简单的解释一下。

  


首先，需要确保滚动元素（`.animation`）和 SVG 路径的最近共同祖先上定义一个 `timeline-scope` 。这个属性可以是任何虚线标记符，比如 `--container` ，它的作用是将指定的时间轴名称范围限定在所选元素的子树中。

  


换句话说，`timeline-scope` 实际上并不在所选元素上定义一个视图时间线。相反，它将一个视图时间线附加推迟到一个后代，并使所选元素子树中的任何其他后代也能引用该时间线。这最终将允许路径元素（SVG 路径）的可见性控制兄弟动画元素（`.animated` ，即小汽车）的动画时间线。

  


```HTML
<!-- 动画元素和 SVG 路径都放在同一个容器中 -->
<div class="container">
    <!-- 动画元素，一辆小汽车 -->
    <div class="animated">
        <svg>
            <path d="M254.464 668.672c-60.928 0-110.592 49.664-110.592 110.592 0 60.928 49.664 110.592 110.592 110.592 60.928 0 110.592-49.664 110.592-110.592-0.512-61.44-49.664-110.592-110.592-110.592z" fill="currentColor" p-id="36023"></path>
            <path d="M850.944 487.936h-20.992l-194.56-206.336-0.512-0.512c-24.064-24.576-57.344-38.4-91.648-37.888h-245.76c-43.008 0-82.944 22.016-105.984 58.368l-1.024 1.536-84.48 184.832h-50.176c-28.16 0-50.688 22.528-50.688 50.688v135.168c0 60.416 48.128 110.08 108.032 112.64v-7.168c0-77.824 62.976-141.312 141.312-141.312s141.312 62.976 141.312 141.312v7.168h262.144v-7.168c1.536-77.824 66.048-139.776 144.384-138.24 75.776 1.536 136.704 62.464 138.24 138.24v7.168h34.304c23.552 0 43.008-19.456 43.008-43.008v-90.112c-0.512-91.648-75.264-165.376-166.912-165.376z m-677.376 0L244.736 332.8c11.776-17.408 31.744-28.16 52.736-28.16H404.48v183.296H173.568z m292.352 0V304.64h76.8c17.92 0 35.328 7.168 48.128 19.968l154.624 163.328H465.92z" fill="currentColor" p-id="36024"></path>
            <path d="M798.72 668.672c-60.928 0-110.592 49.664-110.592 110.592 0 60.928 49.664 110.592 110.592 110.592 60.928 0 110.592-49.664 110.592-110.592 0-61.44-49.664-110.592-110.592-110.592z" fill="currentColor" p-id="36025"></path>
        </svg>
    </div>

    <!-- SVG 路径 -->
    <svg width="175" height="1300" preserveAspectRatio="none" viewBox="0 0 175 1300" fill="none" xmlns="http://www.w3.org/2000/svg" class="path">
        <path id="my_path" d="M 28 0 C -72 200 188 300 88 500 C -32 700 88 1100 148 1000 C 208 900 148 600 68 1000 C 28 1200 128 1300 128 1300" stroke-width="1" stroke="#f8f8f8" stroke-dasharray="10 10" />
    </svg>
</div>
```

  


我们把动画元素 `.animated` 和 SVG 路径都放在 `.container` 容器中，并且在该容器上使用 `timeline-scoped` 定义了一个名为 `--container` 时间轴范围：

  


```CSS
.container {
    timeline-scope: --container;
}
```

  


现在，使用 `view-timeline-name` 在路径元素上定义一个视图时间轴，并使用相同的名称将其附加到声明的范围上，如下所示：

  


```CSS
#my_path {
    view-timeline-name: --container;
}
```

  


接下来，通过使用 `animation-timeline` 属性将时间线的进度绑定到动画元素的动画进度，再次引用时间线的名称。

  


```CSS
.animated {
    animation-timeline: --container;
}
```

  


之后，使用 `animation-range` 来确定动画时间线的范围。这个属性允许你使用预定义的段的偏移量来裁剪或扩展动画的活动时间线间隔：

  


```CSS
.animated {
    animation-timeline: --container;
    animation-range: 
        exit-crossing -5%    /* 在开始退出之前启动动画 */
        entry-crossing 105%; /* 完全进入后结束动画 */
}
```

  


全部代码如下：

  


```CSS
@layer car {
    @keyframes move {
        from {
            offset-distance: 0%;
        }
        to {
            offset-distance: 100%;
        }
    }
    
    .container {
        position: relative;
        timeline-scope: --container;
    }

    #my_path {
        view-timeline: --container;
    }

    .animated {
        width: 32px;
        aspect-ratio: 1;
        position: absolute;
        inset: 0;
    
        offset-path: url(#my_path);
        animation: move linear forwards;
        animation-timeline: --container;
        animation-range: exit-crossing -5% entry-crossing 105%;
    
        & svg {
          display: block;
          width: 100%;
          height: 100%;
          color: red;
        }
    }
}
```

  


你看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0478f419ac544419aa7b9f369ccedfde~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=450&s=1731531&e=gif&f=256&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/ZEVrPGQ

  


上面这个示例的效果和前面那个看起来似乎没太大的差异。那么下面，我们使用相同的技术方案来改造上节课（《[CSS 滚动驱动动效](https://juejin.cn/book/7223230325122400288/section/7259272255786450981)》）所展示的滚动范围的示例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33ef5bb62d8a414aa0b8b3a276cde9b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=910&h=504&s=1339961&e=gif&f=128&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/eYQqboo

  


把上面的示例中右侧旋转的动效换成上面示例中小汽车沿指定路径行走的动效：

  


```CSS
@layer animation {
    @keyframes move {
        from {
            offset-distance: 0%;
        }
        to {
            offset-distance: 100%;
        }
    }

    .parent {
        timeline-scope: --tl;
        position: relative;
    
        .scroller {
            scroll-timeline: --tl;
        }
    
        .animated {
            position: absolute;
            inset: 0;
    
            offset-path: url(#my_path);
            animation: move linear forwards;
            animation-timeline: --tl;
            animation-range: exit-crossing 5% entry-crossing 100%;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75efa630ea8048e7870cf40fc09d5f0c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=744&s=1097417&e=gif&f=144&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/ZEVrPLO

  


再来看一个更接近生产环境的案例。这个案例来源于 [@David Carr's Pens](https://codepen.io/daviddcarr) 在 [Codepen 上的案例](https://codepen.io/daviddcarr/full/vYWVwXq)，原案例是使用 JavaScript 来控制滚动驱动的。现在我们来使用 CSS 原生的滚动驱动动效来改造它，即使用 CSS 滚动驱动特性和 CSS 路径动画，完成最终的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/beb04f44eee84e4bbf29a0b7cfbb8c46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=532&s=6222041&e=gif&f=202&b=e6b258)

  


> Demo 地址：https://codepen.io/airen/full/PoXQLRv

  


完成上面这个 Demo ，我们需要一个像下面这样的 HTML 结构：

  


```HTML
<!-- 定义滚动视图范围 -->
<div class="parent">
    <!-- SVG 路径 -->
    <svg width="573px" height="319px" viewBox="0 0 573 319" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;" class="path">
        <g id="Artboard1" transform="matrix(1,0,0,0.973442,0,0)">
            <g transform="matrix(1,0,0,1.02728,0,0)">
                <path d="M17.654,134.538C38.507,145.324 55.705,164.821 54.198,193.803C52.691,222.784 58.022,232.442 73.154,252.342C88.286,272.242 76.897,294.91 60.824,299.309C44.75,303.708 36.132,286.92 43.243,276.231C50.354,265.543 64.208,248.975 102.275,257.527C134.386,264.741 151.032,317.307 239.342,274.21C327.651,231.113 368.233,251.516 406.539,276.284C444.845,301.052 500.526,312.655 536.755,285.003C573.815,256.717 552.254,213.184 523.103,220.62C499.98,226.518 490.739,242.748 490.708,256.252C490.662,275.913 521.182,291.918 543.438,265.171C565.302,238.894 560.71,201.242 546.112,179.199C526.896,150.183 519.687,120.608 537.67,114.694C555.654,108.78 561.548,128.229 559.892,146.726" style="fill:none;stroke:black;stroke-width:1px;"/>
            </g>
        </g>
    </svg>

    <!-- 动画元素(小蜜蜂) -->
    <div class="bee">
        <div class="wing one"></div>
        <div class="wing two"></div>
    </div>

    <!-- 滚动容器 -->
    <div class="scroll-container">
        <article>
            <h1>Scroll Me!</h2>
            <p>Lorem ipsum ...</p>
        </article>
    </div>
</div>
```

  


完成动效的核心 CSS 代码：

  


```CSS
@layer bee {
    @keyframes move {
        from {
            offset-distance: 0%;
        }
        to {
            offset-distance: 100%;
        }
    }

    .parent {
        position: relative;
        timeline-scope: --tl; /* 定义时间轴范围 */
    }

    .scroll-container {
        scroll-timeline: --tl;
    }

    .bee {
        position: absolute;
        top: 0px;
        left: 0px;
    
        /* 路径动画 */
        offset-path: path(
            "M17.654,134.538C38.507,145.324 55.705,164.821 54.198,193.803C52.691,222.784 58.022,232.442 73.154,252.342C88.286,272.242 76.897,294.91 60.824,299.309C44.75,303.708 36.132,286.92 43.243,276.231C50.354,265.543 64.208,248.975 102.275,257.527C134.386,264.741 151.032,317.307 239.342,274.21C327.651,231.113 368.233,251.516 406.539,276.284C444.845,301.052 500.526,312.655 536.755,285.003C573.815,256.717 552.254,213.184 523.103,220.62C499.98,226.518 490.739,242.748 490.708,256.252C490.662,275.913 521.182,291.918 543.438,265.171C565.302,238.894 560.71,201.242 546.112,179.199C526.896,150.183 519.687,120.608 537.67,114.694C555.654,108.78 561.548,128.229 559.892,146.726"
        );
        offset-rotate: auto 90deg;
        offset-distance: 0%;
    
        animation: move linear forwards;
        
        /* 滚动驱动动效 */
        animation-timeline: --tl;
        animation-range: exit-crossing 5% entry-crossing 100%;
    }
}
```

  


当然，你还可以发挥你的才智，将 CSS 路径动画和滚动驱动动效相关特性结合起来构建更为复杂的 CSS 动效。比如 [@Chokcoco](https://codepen.io/Chokcoco) 老师在 [Codepen 上写的一个示例](https://codepen.io/Chokcoco/full/bGOqVqO)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f4271ee8bb84e599553774ccfaed657~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=668&s=18919816&e=gif&f=249&b=140014)

  


> Demo 地址：https://codepen.io/Chokcoco/full/bGOqVqO

  


详细代码就不在这里展示了，感兴趣的同学可以查看 Demo 源码！

  


## 小结

  


CSS 路径动画是一种引人注目的交互性技术，可以为 Web 应用或网站增添生动和吸引人的元素。Web 开发者可以使用 CSS 的 `offset` 属性来构建路径动画，它包括 `offset-path` 、`offset-distance` 、`offset-rotate` 、`offset-anchor` 和 `offset-position` 等子属性。其中：

-   `offset-path` 定义了路径动画中的路径，
-   `offset-distance` 定义了动画元素在路径上的位置，
-   `offset-rotate` 定义了动画元素的旋转角度
-   `offset-anchor` 定义了动画元素与路径的关联点
-   `offset-position` 定义了动画元素在路径上的起始位置

  


Web 开发者除了使用 CSS 的 `transition` 或 `animation` 来控制路径动画之外，还可以使用 CSS 滚动驱动动画特性来控制路径动画，使路径动画更具交互性。

  


CSS 路径动画可以用于各种创造性的应用，如文本环绕、弧形导航菜单、SVG 路径动画等。它们可以提高用户体验，增强网站或应用的吸引力。

  


总之，CSS 路径动画是一个令人兴奋的前端技术，可以用来创建引人注目的动画效果，增强用户交互性，但需要小心使用以确保性能和可访问性。通过深入了解这些属性和技术，你可以在网站或应用中实现引人注目的路径动画效果。