![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11a11ea1da25437197e10dc447f20e5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1859&h=980&s=82209&e=jpg&b=0d9aec)

  


在当今 Web 设计中，3D 效果已经成为无处不在的重要元素。从网站的视觉吸引力到用户体验的提升，3D 技术为我们开辟了全新的创作领域。SVG 作为一种强大的工具崭露头角，将可伸缩性和灵活性与三维形象的美学魅力完美融合。这节课，我们将探讨如何利用 SVG 技术实现令人惊叹的 3D 效果，让你的 Web 页面不再仅限于平面，而是展现出真正的深度和交互性。

  


## SVG 创建 3D 效果的技巧

  


在 Web 开发过程中，有多种不同的方式为 Web 元素添加 3D 视觉效果和交互效果。这些技术涵盖了 CSS、JavaScript、WebGL 以及 SVG 等不同领域：

  


-   CSS 提供了强大的 3D 变换和动画功能，可以用来创建 3D 效果
-   JavaScript 结合 WebGL 可以创建复杂的 3D 图形和动画
-   HTML5 的 `<canvas>` 元素与 JavaScript 结合，可以实现复杂的 3D 绘图和动画

  


当然，SVG 作为一种强大的工具，也能够帮助我们创建令人惊叹的 3D 效果。如果你能掌握 SVG 创建 3D 效果的一些技巧，将使你在开发过程中达到事半功倍的效果。以下是一些利用 SVG 创建 3D 效果的技巧。

  


### 拥抱 Z 轴：通往 3D 的大门

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/319a5483292d48a6962a4ecc3694c930~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1882&h=1441&s=234264&e=webp&b=fffefe)

传统上，SVG 局限于 `x` 轴和 `y` 轴，但当我们引入 `z` 轴时，SVG 将焕发新生命，为 SVG 图形增添了深度。要实现这一点，需要结合 SVG 属性和 CSS 变换，从而模拟三维空间。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/817caeaf19d049b48be865095869f741~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=788&s=2612997&e=gif&f=223&b=ffffff)

  


> Demo 地址：https://codepen.io/marianab/full/KKKYdxE （来源于 [@Mariana Beldi](https://codepen.io/marianab/full/KKKYdxE)）

  


我们可以应用 CSS 3D 变换和透视相关特性，将 SVG 图形放置三维空间中：

  


-   `rotate3d` ：围绕着 `x` 、`y` 或 `z` 轴旋转 SVG 元素，增加旋转和深度感
-   `translate3d` ：沿着 `z` 轴移动元素，使其靠近或远离观察者
-   `scale3d` ：在三维空间中调整元素大小，增强深度幻觉，图形放大或缩小
-   `perspective`：将透视属性（`perspective`）应用于 SVG 容器，影响深度的感知，使 3D 效果更加明显和真实

  


注意，到目前为止，SVG 元素只具备 2D 变换属性。庆幸的是，当 SVG 内联在 HTML 中时，CSS 变换属性（包括 2D 和 3D 变换）以及透视相关属性都可以应用于 SVG 元素上。这意味着，我们可以使用 CSS 变换属性使 SVG 具有 3D 效果。稍后，我们会与大家更深入的探讨这方面的知识。

  


### 光照和阴影：打造逼真效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32036fdd79464a739e9b0b3117c64902~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1792&h=1024&s=83756&e=webp&b=bfd5dd)

  


Web 上的 3D 效果大多依赖于光照和阴影，为大脑提供有关物体形状和深度的线索。它们同样适用于 SVG 中的 3D 效果。与 CSS 相比，在 SVG 中创建阴影和模拟光源要容易得多，而且效果更佳。

  


-   投射阴影：利用 [SVG 滤镜基元](https://juejin.cn/book/7341630791099383835/section/7368318391733452850#heading-4)添加投射阴影，营造物体脱离页面的效果
-   渐变阴影：应用渐变填充模拟环境光效果，柔化边缘并增加体积感。[径向渐变和线性渐变](https://juejin.cn/book/7341630791099383835/section/7354948936039137289)，代表着光源及其对物体的阴影，展示光线如何在表面上淡化
-   [高斯模糊](https://juejin.cn/book/7341630791099383835/section/7368318391733452850#heading-1)：柔化阴影和光效果，使其更加自然

  


除此之外，[还可以使用 `<feSpecularLighting>` 和（或）`<feDiffuseLighting>` 滤镜基元](https://juejin.cn/book/7341630791099383835/section/7368318391733452850#heading-6)来应用光照效果，使阴影和光照效果更自然。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85d96f942f4043958cfad51ee232c9e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=690&s=6209570&e=gif&f=347&b=c9bed3)

  


> Demo 地址：https://codepen.io/chrisgannon/full/RwWVJWd （来源于 [@Chris Gannon](https://codepen.io/chrisgannon/full/RwWVJWd) ）

  


### 渐变魔法：幻觉艺术之道

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af4033f9197846ae8ee79c05bed300bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1344&h=896&s=45574&e=webp&b=d8ade0)

  


渐变在 3D 效果中至关重要，提供了一种简单而有效的方法来暗示形态和光线方向。

  


-   线性和径向渐变：使用渐变来指示曲率和形态，颜色从浅到深过渡，模拟光线打击和包裹物体的效果；径向渐变可以暗示圆润的表面，增强 3D 效果
-   多段渐变：应用多段渐变来处理复杂表面，无缝融合多种颜色，模仿光影的细微变化

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62056a1e306241758fd4d921f25989ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044&h=526&s=1482053&e=gif&f=133&b=fcfaf6)

  


> Demo 地址：https://codepen.io/chrisgannon/full/ZaPmKp （来源于 [@Chris Gannon](https://codepen.io/chrisgannon/full/ZaPmKp) ）

  


### 结合元素创建复杂形状

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2616eab046754824b6a63c5e10583900~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540&h=790&s=62872&e=png&b=a97bf8)

  


创建复杂的3D形状涉及到策略性地组合简单的形状，层层叠加并进行变换，以构建所需的形态。例如，从矩形、圆形和多边形等基本形状开始，利用变换在 3D 空间中对齐和堆叠它们。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/519e15f7b25e445c86341479826892eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1172&h=694&s=6455419&e=gif&f=64&b=000000)

  


> Demo 地址：https://codepen.io/noahblon/full/mRvOzq （来源于 [@Noah Blon](https://codepen.io/noahblon/full/mRvOzq) ）

  


还可以使用[剪切](https://juejin.cn/book/7341630791099383835/section/7362748816769941540)（`<cipPath>`）和[遮罩](https://juejin.cn/book/7341630791099383835/section/7366549423813296165)（`<mask>`）来隐藏形状的部分，精细化边缘并创建复杂的细节，以增强整体的 3D 效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50c5dc6a93b147e2a93f909e61ecc3d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=584&s=367936&e=gif&f=43&b=fed344)

  


> Demo 地址：https://codepen.io/chrisgannon/full/dROyLa （来源于 [@Chris Gannon](https://codepen.io/chrisgannon/full/dROyLa) ）

  


### 动画：赋予 3D SVG 生命

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/055ae81a5d2f4763a1dbc7c99602695b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1080&s=282348&e=gif&f=32&b=fdeee6)

  


通过复杂的 SVG 动画，将动态运动融入 3D 效果中，显著增强真实感。例如，[通过动画变换来旋转、平移和缩放 SVG 元素](https://juejin.cn/book/7341630791099383835/section/7368318500093296667)，在三维空间中模拟运动。[还可以结合 @keyframes 实现复杂的多阶段动画](https://juejin.cn/book/7288940354408022074/section/7295617447058407474)。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f9dd62768744b469d236b1fd68e5105~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=830&s=2812404&e=gif&f=51&b=191919)

  


> Demo 地址：https://codepen.io/ponycorn/full/ExLMpoV （来源于 [@Ponycorn](https://codepen.io/ponycorn/full/ExLMpoV) ）

  


[你还可以利用 JavaScript 响应用户交互](https://juejin.cn/book/7341630791099383835/section/7368318583098572810)，如鼠标移动或点击，实时调整变换，以实现交互式的 3D 效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c207fa128a984768ab19d4bb51240a08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=642&s=1673915&e=gif&f=154&b=2c2c2c)

  


> Demo 地址：https://codepen.io/enxaneta/full/yNpoyw （来源于 [@Gabi](https://codepen.io/enxaneta/full/yNpoyw) ）

  


你也可以将 [SVG 的图形数据与 WebGL 结合](https://juejin.cn/book/7341630791099383835/section/7368317620015071282)在一起构建更复杂的 3D 效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/855f93bc748443a19abb1e930ec504c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1264&h=764&s=9638519&e=gif&f=257&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/NWVrVPR

  


这些技巧，特别是应用于创建交互式 SVG 时，打开了广阔的创作领域，使 Web 开发者能够打造不仅视觉上令人惊叹，而且富有吸引力的体验。

  


## SVG 中的 3D 变换

  


我曾在《[SVG 的变换属性](https://juejin.cn/book/7341630791099383835/section/7356918561740161036)》课程中提到过，到目前为止，SVG 自身的变换属性仅支持 2D 变换。庆幸的是，CSS 变换模块包含 3D 变换函数。它们允许你在三维空间中对 SVG 图形进行操作，例如在三维空间中移动 SVG 元素。接下来，我们来一起探讨 CSS 的 3D 变换与 SVG 结合能做些什么？

  


一个三维变换由两个步骤组成：

  


-   1️⃣ **变换函数**：这些函数用于在理论的三维空间中操作绘制图形的平面。具体来说，这些变换函数通过改变图形的位置、大小和旋转角度来实现三维空间中的各种变换。例如，`rotate3d` 可以围绕 `x` 、`y` 或 `z` 轴旋转图形，`translate3d` 可以沿着 `z` 轴称动图形，`scale3d` 可以在三维空间缩放图形
-   2️⃣ **透视效果**：这些效果将变换后的三维图形转换为一个可以绘制在计算机屏幕上的平面表示。透视效果通过模拟人眼的视觉感知来创建深度感。具体来说，当你为容器应用透视（`perspective`）属性时，离视点较近的对象看起来较大，而离视点较远的对象看起来较小。这种效果使二维的图形具有三维空间的深度感，使其看起来更加逼真

  


变换函数是基于 2D 变换的扩展，应用于 3D 坐标系。换句话说，2D 变换（如平移、旋转和缩放）通常只涉及 `x` 和 `y` 轴。这些变换在三维空间中得到了扩展，添加了 `z` 轴。例如，二维中的 `translate` 变换只移动 `x` 和 `y` 方向，而在三维中，`translate3d` 变换会在 `x` 、`y` 和 `z` 方向上移动。

  


三维空间中的 `z` 轴，最初指指向屏幕外的观察者。因此，正 `z` 坐标表示物体位于屏幕“前面”，即更接近观察者；负 `z` 坐标表示物体位于屏幕“后面”，即远离观察者：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0e82694eace4da6a71d1036c00fb895~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1053&s=240135&e=jpg&b=c0d8d2)

  


这种设置允许你在三维空间中操纵图形的位置和深度。

  


考虑到 SVG 中的 `x` 轴通常从左到右，`y` 轴从上到下。在添加 `z` 轴后，这形成了一个左手坐标系：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe1ea6e102d74d829b3294b5576846d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1053&s=148949&e=jpg&b=ffffff)

  


在左手坐标系中，如果你的左手握拳，大拇指指向 `z` 轴正方向（屏幕前），食指指向 `x` 轴正方向（右），中指指向 `y` 轴正方向（下），这就是左手坐标系的定义。

  


理解你在一个左手坐标系中工作可以帮助你在扭曲和旋转坐标直到 `x` 轴和 `y` 轴不再接近垂直和水平时保持方向感。通过理解和使用左手规则，你可以在复杂的三维空间变换中保持对坐标方向的准确把握，避免在旋转和扭曲后迷失方向。

  


通常情况下，你的图形最初都是在 `x` 轴和 `y` 轴构成的平面上绘制，`z` 坐标为 `0` 。然而，通过 CSS 3D 变换函数可以在 3D 坐标空间中移动该平面的位置：

  


-   `translate3d(tx, ty, tz)`：沿每个轴按给定长度平移它
-   `translateZ(tz)`：类似于 `translateX` 和 `translateY` 函数，这个简写允许你仅指定沿 `z` 轴的平移
-   `scale3d(sx, sy, sz)`：按指定因子改变所有维度的缩放比例
-   `scaleZ(sz)`：仅改变 `z` 轴缩放比例（类似于 `scaleX` 和 `scaleY` 函数）
-   `rotateX(a)`：使用 `x` 轴作为旋转轴，并按指定角度（`a`）旋转坐标系；`x` 坐标不会改变，但 `y` 和 `z` 坐标会改变
-   `rotateY(a)`：使用 `y` 轴作为旋转轴，并按指定角度（`a`）旋转坐标系；`y` 坐标不会改变，但 `x` 和 `z` 坐标会改变
-   `rotateZ(a)`：使用 `z` 轴作为旋转轴，并按指定角度（`a`）旋转坐标系；这对坐标的影响与2D旋转函数相同，但它强制使用3D绘图方法
-   `rotate3d(vx, vy, vz, a)`：使用从原点到点 `(vx, vy, vz)`的向量（直线）创建一个旋转轴，并围绕它按角度 `a` 旋转坐标系

  


注意，这些规则仅适用于 CSS 的变换属性 `transform` ，但不适用于 SVG 的 `transform` 属性。另外，角度和和长度必须包含单位。其中 `z` 轴的值不能是百分比值，这是因为所有 SVG 和 CSS 参考框都是 2D 的，所以没有参考值来定义 `z` 轴上的百分比值。

  


也就是说，通过 3D 变换函数你可以将图形从 2D 世界带入到 3D 世界，那么问题来了，3D 空间的图形在二维的屏幕上应该如何显示呢？毕竟，大多数人并未使用全息显示器（Holographic Display）！

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ac0f1d5da8845ffb87a70ade4ac7331~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1080&s=679026&e=jpg&b=bee8da)

  


浏览器使用附加的投影计算，根据从某个点（三维空间中的视角）看到的方式来变换不同部分。最终图像受用于此“视角”的点的影响很大。

  


你可以这样想，如果你把一个盒子举在你面前，让你正对着其中一面看，你完全看不到其他几面。如果你把视角移到一侧，上下移动，那么你可以看到多个面。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ec26df983db481fa93854b40430ca53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298&h=684&s=3827653&e=gif&f=451&b=fdfdfd)

  


你所看到的还取决于你离它有多远。把盒子靠近你的脸，离你眼睛最近的一端将占据你视野的较大部分，而较远的一端则会显得较小。将整个盒子移远一些，近端和远端的表观大小差异就会减小。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b2d618dbb9144c9923ab35beec07174~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=614&s=7639060&e=gif&f=415&b=4b4769)

  


> Demo 地址：https://codepen.io/airen/full/RwmERbo

  


需要知道的是，在二维 SVG 中使用的仿射变换是无法使形状的一端比另一端缩小。

  


> [仿射变换](https://en.wikipedia.org/wiki/Affine_transformation)（Affine Transformation）是一种线性变换，用于二维或三维空间中的图形操作。这种变换保留了图形的“平直性”和“平行性”，即直线仍然是直线，平行线仍然是平行线。常见的仿射变换包括平移、旋转、缩放和斜切。

  


在实现世界中，只有当你通过望远镜或高倍变焦相机观察时，才能获得没有深度透视的角度透视：在这种情况下，你距离物体非常远，以至于其深度无关紧要。

  


默认情况下，CSS 3D 变换的效果就类似于从无限远的地方看盒子，但放大了图像。然而，通过使 `perspective` 属性，可以控制计算平面图像的理论“视点”。

  


我们先来看一个简单的示例，使用 2D 变换来构建一个类似 3D 盒子的效果：

  


```HTML
<div class="container">
    <div class="box">
        <div class="face face--back" style="--color: hsl(90 50% 50% / .65);"></div>
        <div class="face face--left" style="--color: hsl(180 50% 50% / .65);"></div>
        <div class="face face--front" style="--color: hsl(270 50% 50% / .65);"></div>
        <div class="face face--right" style="--color: hsl(360 50% 50% / .65);"></div>
    </div>
</div>

<svg class="container">
    <g class="box">
        <rect class="face face--back" style="--color: hsl(90 50% 50% / .65);"></rect>
        <rect class="face face--left" style="--color: hsl(180 50% 50% / .65);"></rect>
        <rect class="face face--front" style="--color: hsl(270 50% 50% / .65);"></rect>
        <rect class="face face--right" style="--color: hsl(360 50% 50% / .65);"></rect>
    </g>
</svg>
```

  


```CSS
.face--back {
    transform: translate(50px, -25px);
}
rect.face--back {
    transform: translate(50px, -50px);
}

.face--left {
    transform: skewy(-45deg);
}

.face--front {
    transform: translate(0px, 25px);
}
rect.face--front {
    transform: translate(0px, 0px);
}

.face--right {
    transform: translate(250px, 0) skewY(-45deg);
}
```

  


上面代码中，盒子的各个页通过 CSS 2D 变换的斜切和位移变换进行定位，使整个图形看上去是一个长方体，一个没有顶部和底部的 3D 盒子：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bea26e19c0f4996a1c563aea9e5ad11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=988&s=193511&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/wvbZyJZ

  


这个结果并不意外，因为 SVG 元素与 HTML 元素一样，应用 2D 变换能很好的工作。

  


当然，在某些场景应用 2D 变换也能使你构建出类似 3D 的效果，而且在此基础上结合其他 SVG 的特性，例如 `<use>` ，我们可以重复利用 2D 变换构建的盒子，创建出更复杂的 3D 视觉效果。例如：

  


```XML
<svg viewBox="-130 -20 300 100">
    <g id="cube">
        <rect width="21" height="24" transform="skewY(30)"/>
        <rect width="21" height="24" transform="skewY(-30) translate(21 24.3)"/>
        <rect width="21" height="21"  transform="scale(1.41,.81) rotate(45) translate(0 -21)"/>
    </g>
</svg>
```

  


```CSS
rect {
    fill: #2196f3;
    stroke: #03a9f4;
    fill-opacity: 0.9;
    stroke-miterlimit: 0;
    stroke-width: 0.5;
}
```

  


使用上面的代码，我们可以构建出类似下图这样的 3D 盒子：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43ef7fd61c22410fa44a11a1e012d07f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=988&s=128868&e=jpg&b=050505)

  


我们把上面代码中的 `<g>` 放到 `<defs>` 中，并且通过 `<use>` 来重复引用 `#cube` ，并在每个 `<use>` 上调整其 `x` 和 `y` 的坐标：

  


```XML
<svg viewBox="-15 75 300 100" class="box">
    <defs>
        <g id="cube">
            <rect width="21" height="24" transform="skewY(30)"/>
            <rect width="21" height="24" transform="skewY(-30) translate(21 24.3)"/>
            <rect width="21" height="21"  transform="scale(1.41,.81) rotate(45) translate(0 -21)"/>
        </g>
    </defs>
    <use href="#cube" x="121" y="112"/>
    <use href="#cube" x="100" y="124"/>
    <use href="#cube" x="142" y="124"/>
    <use href="#cube" x="121" y="136"/>
    <use href="#cube" x="79" y="136"/>
    <use href="#cube" x="163" y="136"/>
    <use href="#cube" x="142" y="148"/>
    <use href="#cube" x="100" y="148"/>
    <use href="#cube" x="121" y="160"/>
    <use href="#cube" x="121" y="88"/>
    <use href="#cube" x="100" y="100"/>
    <use href="#cube" x="142" y="100"/>
    <use href="#cube" x="121" y="112"/>
    <use href="#cube" x="79" y="112"/>
    <use href="#cube" x="163" y="112"/>
    <use href="#cube" x="142" y="124"/>
    <use href="#cube" x="100" y="124"/>
    <use href="#cube" x="121" y="136"/>
    <use href="#cube" x="121" y="64"/>
    <use href="#cube" x="100" y="76"/>
    <use href="#cube" x="142" y="76"/>
    <use href="#cube" x="121" y="88"/>
    <use href="#cube" x="79" y="88"/>
    <use href="#cube" x="163" y="88"/>
    <use href="#cube" x="142" y="100"/>
    <use href="#cube" x="100" y="100"/>
    <use href="#cube" x="121" y="112"/>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8130fd4ea9ff4aa2afab4f4564ed9642~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=988&s=182891&e=jpg&b=050505)

  


在这一点上，它比 HTML 更具优势，你可以想象一下，上图这个效果，如果使用 HTML 元素来替换 SVG 元素，你需要额外增加多少个空元素。

  


我们还可以使用 `@keyframes` 给上面的 3D 盒子添加动画效果，使整个 3D 效果更生动：

  


```CSS
@keyframes moveX {
    to { 
        transform: translateX(var(--translate, 35px)); 
    }
}

@keyframes moveY {
    to { 
        transform: translateY(var(--translate, -35px)); 
    }
}

.m-left, .m-right { 
    animation: 2s moveX alternate infinite paused; 
}
.m-up, .m-down { 
    animation: 2s moveY alternate infinite paused; 
}
.m-left { 
    --translate: -50px; 
}
.m-right { 
    --translate: 50px; 
}
.m-up { 
    --translate: -35px; 
}  
.m-down { 
    --translate: 35px; 
}  

.box:hover * { 
    animation-play-state: running; 
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b11713268fd048e58559b63412f05e30~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=740&s=6632182&e=gif&f=173&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/YzbMeYj

  


我们再把焦点回到 3D 变换中来。这次我们将盒子的各个面通过 3D 变换来定位。盒子的背面（`.face--back`）将沿着 `z` 轴平移，以便将其定位在前面（`.face--front`）的后面，而侧面将围绕着 `y` 轴旋转 `90` 度：

  


```XML
<svg width="400" height="300" viewBox="0 0 40 30" class="container">
    <g class="box">
        <rect class="face face--back" width="25" height="15" fill="hsl(90 50% 50% / .65)" />
        <rect class="face face--left" width="10" height="15" fill="hsl(180 50% 50% / .65)" />
        <rect class="face face--front" width="25" height="15" fill="hsl(270 50% 50% / .65)" />
        <rect class="face face--right" width="10" height="15" fill="hsl(360 50% 50% / .65)" />
    </g>
</svg>
```

  


```CSS
.box {
    transform-style: preserve-3d; 
    transform: translate(5px,10px) rotate3d(1,1,0,-30deg)
}

.face--back {
    transform: translateZ(-10px);
}

.face--left {
    transform: rotateY(90deg);
}

.face--right {
    transform: translate(25px,0) rotateY(90deg);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bfa8b6ab963420fa4e0f931ee679621~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=988&s=142079&e=jpg&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/GRaLdwQ

  


正如你所看到的，我们只能看到前面（`.face--front`）。为了能看到盒子的侧面和背面，我们需要在 3D 空间中稍微旋转整个对象，将开口的顶部和一侧向观察者倾斜。逻辑上，我们对 `<g>` 元素进行旋转，就可以旋转整个对象，但实际上，即便我们这样做了，也未能达到预期的效果。

  


这是因为，在默认情况下，浏览器会分别计算每个经过 3D 变换的元素的二维表示，即逐个将它们“压平”。每个形状在其父元素的变换计算之前都会重新绘制在主平面上。对于构建盒子来说，这种方式行不通：由于盒子的侧面从主图形平面旋转了 `90` 度，在被压平时，它们会变得不可见。盒子的背面在压平时完全被前面遮挡。即使尝试对整个变形后的集合进行旋转，得到的也只是倾斜的二维矩形，无法体现出应有的立体深度，这就是为何三维盒子未能显现，仅呈现出单一平面矩形的关键原因之一。

  


值得注意的是，尽管我们在 `.box` 元素上显式设置了 `transform-style` 的值为 `preserve-3d` ，但在 SVG 环境中，并没有使元素保留三维性。主要原因是，现代 Web 浏览器仍无法完全支持 SVG 与 `preserve-3d` 属性的无缝协同工作，这意味着 SVG 元素尚不具备原生的三维空间表现能力。

  


也就是说，我们不能以熟悉的 CSS 3D 变换思维在 SVG 中应用 3D 变换。

  


如果需要，你可以通过变换 HTML 元素框而不是 SVG 元素来减少（但不能消除）浏览器支持问题。你可以在每个 `<svg>` 元素中绘制每个 SVG 形状，每个元素绝对定位以填充 `<div>` 容器，并变换 `<svg>` 元素而不是形状。例如下面这个示例：

  


```HTML
<div class="main">        
    <div class="cont">
        <div class="cube cube--front">
            <svg style="--fill: hsl(60 50% 50% / .65)">
                <use href="#logo" />
            </svg>
        </div>
        <div class="cube cube--back">
            <svg style="--fill: hsl(120 50% 50% / .85)">
                <use href="#logo" />
            </svg>
        </div>
        <div class="cube cube--top">
            <svg style="--fill: hsl(180 50% 50% / .85)">
                <use href="#logo" />
            </svg>
        </div>
         <div class="cube cube--bottom">
            <svg style="--fill: hsl(240 50% 50% / .65)">
                <use href="#logo" />
            </svg>
        </div>
        <div class="cube cube--left">
            <svg style="--fill: hsl(300 50% 50% / .85)">
                <use href="#logo" />
            </svg>
        </div>
        <div class="cube cube--right">
            <svg style="--fill: hsl(360 50% 50% / .85)">
                <use href="#logo" />
            </svg>
        </div>
    </div>
</div>
```

  


注意，上面示例中的每一面都应用了同一个 SVG图形：

  


```XML
<svg class="sr-only">
    <symbol id="logo" viewBox="0 0 500 500">
        <g>
            <polygon  points="214.3,500 0,500 0,285.7 71.4,285.7 71.4,428.6 142.9,428.6 142.9,285.7 214.3,285.7 "/>
            <polygon  points="214.3,214.3 142.9,214.3 142.9,71.4 71.4,71.4 71.4,214.3 0,214.3 0,0 214.3,0 "/>
            <rect x="285.7" y="428.6" width="214.3" height="71.4"/>
            <polygon  points="500,357.1 285.7,357.1 285.7,285.7 428.6,285.7 428.6,214.3 285.7,214.3 285.7,142.9 500,142.9 "/>
            <rect x="285.7"  width="214.3" height="71.4"/>
        </g>
    </symbol>
</svg>
```

  


然在每个面 `.cube` 应用 3D 变换：

  


```CSS
@layer demo {
    .main {
        perspective: 1000px;
        width: 250px;
        aspect-ratio: 1;
    }

    .cont {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transform: rotateX(-15deg) rotateY(15deg);
        animation: rotateCube 7s infinite linear;
    }

    .cube {
        position: absolute;
        opacity: 0.85;
        width: 250px;
        aspect-ratio: 1;
        background-color: #000;
        
        svg {
            display: block;
            width: 100%;
            height: 100%;
            fill: var(--fill);
        }
    }

    .cube--front {
        transform: translate3d(0, 0, 125px);
    }

    .cube--back {
        transform: rotateY(180deg) translate3d(0, 0, 125px);
    }

    .cube--top {
        transform: rotateX(90deg) translate3d(0, 0, 125px);
    }

    .cube--bottom {
        transform: rotateX(-90deg) translate3d(0, 0, 125px);
    }

    .cube--left {
        transform: rotateY(-90deg) translate3d(0, 0, 125px);
    }

    .cube--right {
        transform: rotateY(90deg) translate3d(0, 0, 125px);
    }

    @keyframes rotateCube {
        0% {
            transform: rotateY(0deg) rotateX(0deg);
        }
    
        100% {
            transform: rotateY(-360deg) rotateX(-360deg);
        }
    }
}
```

  


你最终看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54899f39cd3348e1a488b7a7633b6d6a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=638&s=1471882&e=gif&f=34&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/LYovrWO

  


或者，你可以在没有 `preserve-3d` 选项的情况下创建复杂的 3D 对象。即在每个元素上指定完整的 3D 变换序列。换句话说，删除 `<g>` 元素的 `transform` 属性，并将该函数列表复制到每个矩形元素（`<rect>`）的 `transform` 属性的开头：

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb640f19642b4aa4b68e3a4dbc16fa54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=988&s=191545&e=jpg&b=050505)

  


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

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc6da815288a46d3a17a1d370bdc1aca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=988&s=183193&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/MWRBovM

  


应用透视效果到 3D 变换的图形需要复杂的数学计算，包括找到交点、裁剪超出“观察者”背后的形状，并确保每个点相对于透视距离和原点正确地缩放和定位。这些计算大部分在 CSS 中没有明确定义。在使用 SVG 的 3D 变换时，务必进行全面测试，并接受不同的浏览器之间的一些差异。

  


上面所展示的案例都是通过 CSS 变换来模拟出 SVG 3D 效果。除此之外，我们在使用 SVG 元素绘制出图形时，只要控制好每个点的位置，在不使用任何变换的情况之下，也能模拟出 3D 的效果。例如下面这个，使用三个 `<path>` 元素绘制的 3D 盒子效果，就没有使用 CSS 变换：

  


```XML
<svg class="cube" viewBox="0 0 100 100">
    <defs>
        <filter id="gaussian">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0" stop-color="#8b09e8" stop-opacity="1" />
            <stop offset=".5" stop-color="#326be5" stop-opacity=".9" />
            <stop offset="1" stop-color="#44b9d6" stop-opacity=".6" />
        </linearGradient>
    </defs>
    <path class="shadow" d="M5,85 50,100 95,85 50,60" fill="rgb(0 0 0 /.4)" filter="url(#gaussian)" />
    <path d="M10,20 50,5 90,20 50,35" fill="url(#purpleGradient)" />
    <path d="M10,20 50,35 50,90 10,75" fill="url(#purpleGradient)" />
    <path d="M50,90 50,35 90,20 90,75" fill="url(#purpleGradient)" />
</svg>
```

  


```CSS
@layer demo {
    .cube {
        display: block;
        width: 50vmin;
        aspect-ratio: 1;
        overflow: visible;
    }
  
    .cube path:not(.shadow) {
        animation: float 1s infinite alternate ease-in-out;
    }
  
    .shadow {
        transform-origin: bottom;
        animation: shadow 1s infinite alternate ease-in-out;
    }

    @keyframes float {
        to {
            translate: 0 8px;
        }
    }

    @keyframes shadow {
        to {
            scale: 0.8;
            fill: rgb(0 0 0 / 0.6);
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/979493f19bd846cfa9e73104575a655a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=672&s=4204285&e=gif&f=78&b=65851b)

  


> Demo 地址：https://codepen.io/airen/full/LYovBVg

  


## 小结

  


首先需要明确的一点是，到目前为止，在 SVG 中并不具备原生 3D 变换特性，但我们可以通过使用 CSS 的 3D 变换模拟出 3D SVG 效果。除此之外，可以通过其他一些技巧使 SVG 具有 3D 效果。掌握这些技巧，可以极大地丰富 Web 的视觉效果和交互体验。通过正确应用这些技术，Web 开发者能够创造出具有深度和真实感的三维图形，提升 Web 设计的层次与吸引力。