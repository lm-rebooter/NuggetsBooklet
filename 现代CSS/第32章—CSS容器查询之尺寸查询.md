CSS 容器查询的到来可以说是 Web 开发的一个巨大里程碑，它将改变 Web 开发组件的模式。通过容器查询，你可以查询父元素的样式信息，比如内联尺寸大小、样式和状态等，来调整 Web 组件。容器查询对于响应式设计和可重用组件特别方便。例如，一个卡片组件，它可以在侧边栏中以一种方式布局，而在产品列表中可以是另一种方式布局。在这节课中，我将解释容器查询是如何工作的，我们如何使用它们，并分享一些现实生活中的用例。

## CSS 容器查询解决了什么问题？

十多年前，[@Ethan Marcotte 提出了响应式 Web 设计（Responsive Web Design，简称 RWD）的概念](https://alistapart.com/article/responsive-web-design/)，其核心是 [CSS 媒体查询的特性](https://juejin.cn/book/7223230325122400288/section/7257368158451793935)，它允许 Web 开发者根据浏览器视窗的大小来设置各种 CSS 规则，使得 Web 应用或 Web 组件能根据浏览器视窗的大小做出响应。可以说，响应式 Web 设计和 CSS 媒体查询开启了更多的 Web 布局解决方案，以及多年来围绕响应视窗尺寸创建的最佳实践。此外，像 Bootstrap 这样的框架（CSS Frameworks）之所以受欢迎，很大程度上是因为它为 Web 开发人员提供了响应式网格系统。

近年来，设计系统和组件库越来越受欢迎。对于 Web 开发者而言，更大的期望是：**一次构建，随地部署** ！ 这意味着，Web 开发者构建的组件要能在任意环境下更加高效和一致。

在某种程度上，Web 应用或页面都是由这些组件组合出来的。在容器查询还没出现之前，Web 开发者通常只能使用媒体查询来调整组件在浏览器视窗变化中的变化。其中一种常见的解决方案是通过增加类在不同断点中调整样式规则，就好比是在 CSS 媒体查询中针对性的使用类给组件打补丁。因此，Web 开发人员可能添加许多断点和类，使代码变得臃肿，而且难以维护。即使如此，但仍然无法获得最理想的效果。

当然，[现代 Web 布局](https://s.juejin.cn/ds/iWvrUH4/)为 Web 开发者提供了一些方案，可以实现近似容器响应的效果，例如 CSS Flexbox 和 CSS Grid 布局。但[这些解决方案仅限于松散地定义从水平到垂直排列的布局调整](https://juejin.cn/book/7199571709102391328/section/7199571708838150155)，并且不解决修改其他属性的需求。

CSS 容器查询使我们不再仅仅考虑浏览器视窗大小，而是允许任何组件或元素响应已定义的容器尺寸、样式和状态等。因此，虽然你可能仍然使用响应式网格系统对整体页面布局，但该网格中的组件可以通过查询其容器来定义其自己的行为，并随时做出相应的响应。然后，它可以根据它所处环境，例如容器尺寸是大还是小来调整自身的样式。

换句话说，使用容器查询，Web 开发者可以非常精确和可预测的方式定义组件的全部样式。这也意味着，容器查询对于构建不同变体的组件非常便利，非常有用。

我们一起来看一个具体的例子：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71895f4be2934600821809a94dd5c527~tplv-k3u1fbpfcp-zoom-1.image)

以往我们构建上图所示的卡片组件，会给另一个卡片组件变体添加一个类名，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6bce94eed8148c9a1183b04ebb77200~tplv-k3u1fbpfcp-zoom-1.image)

```HTML
<!-- 默认卡片组件 -->
<div class="card">
    <img src="./thumbnail.jpg" alt="Card thumbnail" />
    <h3>Card Title</h3>
    <p>Card Description</p>
</div>
​
<!-- 卡片组件变体 -->
<div class="card card--horizontal">
    <img src="./thumbnail.jpg" alt="Card thumbnail" />
    <h3>Card Title</h3>
    <p>Card Description</p>
</div>
```

当浏览器视窗足够大时，卡片组件从垂直布局方式切换到水平布局方式。如果卡片仅出现在布局中的一个区域，即使是不新增类名 `.card--horizontal` 也是可以实现。我们只需要使用媒体查询调整组件布局即可：

```CSS
@layer components {
    .card {
        background-color: #fff;
        color: #333;
        border-radius: 10px;
        overflow: hidden;
        display: grid;
        gap: 1rem;
        grid-template-areas: 
          "thumbnail" 
          "title" 
          "description";
      
        box-shadow: 0 0 .125em .125em rgb(0 0 0 / .25);  
    }
  
    .card img {
        aspect-ratio: 21 / 9;
        grid-area: thumbnail;
    }
  
    .card > *:not(img) {
        padding-inline: 1rem;
    }
  
    .card h3 {
        font-size: 2rem;
        grid-area: title;
    }
  
    .card p {
        font-size: 85%;
        color: #999;
        grid-area: description;
        margin-bottom: 1rem;
    }
}
​
@layer layout {
​
    @media only screen and (width >= 640px) {
        .card {
            grid-template-columns: 220px minmax(0, 1fr);
            grid-template-areas: 
                "thumbnail title"
                "thumbnail description";
            row-gap: 1rem;
        }
    
        .card h3 {
            margin-top: 1rem;
        }
    
        .card img {
            aspect-ratio: 4 / 3;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a86000e078924ceab8120c71ac89d4dc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGQxPqb>

乍一看，这似乎看起来不错。然而，当你更深入地思考它时，它就有点复杂了。

如果我们想要在不同的地方使用相同的卡片，比如在侧边栏中空间很小，在主内容栏中我们有更多的空间。这个时候仅使用 CSS 媒体查询的话，它是无法满足整个布局需求的。这个时候就需要给组件变体添加额外的类名，比如 `card--horizontal` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23a991c44a014e36b4effe5f01cfda05~tplv-k3u1fbpfcp-zoom-1.image)

在媒体查询（`@media`）中调整具有 `card--horizontal`类名的样式。

```CSS
@layer components {
    .card {
        background-color: #fff;
        color: #333;
        border-radius: 10px;
        overflow: hidden;
        display: grid;
        gap: 1rem;
        grid-template-areas: 
          "thumbnail" 
          "title" 
          "description";
      
        box-shadow: 0 0 .125em .125em rgb(0 0 0 / .25);  
    }
  
    .card img {
        aspect-ratio: 21 / 9;
        grid-area: thumbnail;
    }
  
    .card > *:not(img) {
        padding-inline: 1rem;
    }
  
    .card h3 {
        font-size: 2rem;
        grid-area: title;
    }
  
    .card p {
        font-size: 85%;
        color: #999;
        grid-area: description;
        margin-bottom: 1rem;
    }
}
​
@layer layout {
​
    @media only screen and (width >= 640px) {
        .card--horizontal {
            grid-template-columns: 220px minmax(0, 1fr);
            grid-template-areas: 
                "thumbnail title"
                "thumbnail description";
            row-gap: 1rem;
        }
    
        .card--horizontal h3 {
            margin-top: 1rem;
        }
    
        .card--horizontal img {
            aspect-ratio: 4 / 3;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea2c5f256e474609b1a4d0fd5991b146~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKrxOPq>

注意，不这样做的话，主内容栏（`main`）中的卡片组件会很大：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66b4dbf7a08840b9b31531f11d5d5684~tplv-k3u1fbpfcp-zoom-1.image)

从 UI 的角度来看，这看起来并不太好。

正如你所看到的，在只有媒体查询的情况下，往往需要额外的一层来协调跨视窗大小变化的组件的突变。在这些情况下，你可能不得不在更多的断点下，使用更多的类名来设置不同的样式规则。甚至更惨的是，即使这样做，很多情况之下仍然也无法达到最理想的 UI 表面。

很多时候，响应式 Web 组件不应该是响应浏览器视窗尺寸，而是响应容器的尺寸大小，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f18aaab049f4401ea3d81876fc5407b4~tplv-k3u1fbpfcp-zoom-1.image)

庆幸的是，CSS 容器查询的出现，使我们超越了只考虑浏览器视窗尺寸的范围，并允许任何组件或元素对定义的容器尺寸做出响应。因此，虽然你可能仍然使用响应式来给 Web 页面布局，但 Web 页面的任何一个组件都可能通过容器查询来定义自己的样式变化。然后，它可以根据它是在一个窄的还是宽的容器中显示，来调整它的样式。

> **容器查询使我们不再只考虑浏览器视窗尺寸大小，而是允许任何组件或元素对定义的容器尺寸做出响应** ！

也就是说，有了 CSS 容器查询，你就能以一种非常精确和可预测的方式定义一个组件的全部样式。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c5002de221c4f76bd513e63e935b93e~tplv-k3u1fbpfcp-zoom-1.image)

简单地说，媒体查询，查询的是浏览器视窗宽度，而容器查询，查询的是组件容器的宽度。这个容器可以是组件的父元素，也可以是其祖先元素。也就是说，如果需要的话，可以在组件顶层容器上进行查询。用下图可以很清晰地阐述媒体查询和容器查询的差异：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a79c44ba01d444ea775639242377f11~tplv-k3u1fbpfcp-zoom-1.image)

容器查询特性的出现，我们可以不再局限于视窗断点来调整布局或 UI 样式，还可以基于容器断点来调整布局或 UI 。换句话说，**媒体查询是一种宏观的布局（Macro Layout），可以用于整体页面布局；而容器查询可以调整组件的每个元素，创建了一种微观的布局（Micro Layout）** 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf46792b5e20424a8be533762aecdfe2~tplv-k3u1fbpfcp-zoom-1.image)

比如上面的示例，如果使用容器查询的话，我们可以这样进行修改。首先需要在组件 `.card` 包裹一个容器，比如 `div.card--container` ：

```HTML
<div class="card--container">
    <div class="card">
        <img src="./thumbnail.jpg" alt="Card thumbnail" />
        <h3>Card Title</h3>
        <p>Card Description</p>
    </div>
</div> 
```

```CSS
@layer reset, base, components,variant, layout;
    ​
@layer components {
    .card {
        background-color: #fff;
        color: #333;
        border-radius: 10px;
        overflow: hidden;
        display: grid;
        gap: 1rem;
        grid-template-areas:
            "thumbnail"
            "title"
            "description";
        box-shadow: 0 0 0.125em 0.125em rgb(0 0 0 / 0.25);
    }
    ​
    .card img {
        aspect-ratio: 21 / 9;
        grid-area: thumbnail;
    }
    ​
    .card > *:not(img) {
        padding-inline: 1rem;
    }
    ​
    .card h3 {
        font-size: 2rem;
        grid-area: title;
    }
    ​
    .card p {
        font-size: 85%;
        color: #999;
        grid-area: description;
        margin-bottom: 1rem;
    }
}
    ​
@layer variant {
    .card--container {
        container-type: inline-size;
    }
    ​
    @container (width >= 414px) {
        .card {
            grid-template-columns: 220px minmax(0, 1fr);
            grid-template-areas:
                "thumbnail title"
                "thumbnail description";
            row-gap: 1rem;
        }
    ​
        .card h3 {
            margin-top: 1rem;
        }
    ​
        .card img {
            aspect-ratio: 4 / 3;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5c1090f5e9a4035b2c01811178be2ca~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXJwWK>

与媒体查询的效果相比，是不是效果好多了。

接下来，我们来解释一下！

## 容器查询是什么？

容器查询允许你根据元素容器的大小、计算样式和状态来应用样式。其最大的特点是： **容器查询允许开发者定义任何一个元素为包含上下文，查询容器的后代元素可以根据查询容器的大小或计算样式、状态的变化来改变风格** ！

换句话说，一个查询容器是通过使用容器类型属性（`container-type` 或 `container`）来指定其查询类型。同时，查询容器的后代元素的样式规则可以通过使用 `@container` 条件组规则进行独立设置。简单地说，**查询容器（也被称为 CSS 包容）提供了一种方法来隔离页面的各个部分，并向浏览器声明这些部分在样式和布局方面与页面的其他部分是独立的** 。

容器查询最早是只有尺寸查询，但随着时间的推移，容器查询新增了样式查询和状态查询。也就是说，容器查询包含三种类型：

*   **尺寸查询**：根据查询容器大小来调整其后代元素的样式
*   **样式查询**：根据查询容器样式或 CSS 变量来调整其后代元素的样式
*   **状态查询**：根据查询容状态来调整其后代元素的样式

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5067734ec5eb426cb9cb17b7e6ed1d5c~tplv-k3u1fbpfcp-zoom-1.image)

> 其中状态查询还仅是 Chromium 团队正在试验一种新的查询类型。

注意，在这节课我们主要向大家介绍容器查询中的尺寸查询，[将会在下一节课中向大家介绍容器查询中的样式查询和状态查询](https://juejin.cn/book/7223230325122400288/section/7259316003635462201)。

## 开始使用容器查询

关于 CSS 容器查询，首先要知道的是“容器”。HTML 中的很多元素都可以视为一个容器，例如 `div` 。

```HTML
<div class="card--container"><!-- 查询容器 -->
    <div class="card"><!-- Card 组件 --></div>
</div>
```

但要将“容器” `.card--container` 变成一个“查询容器”，我们就需要使用 CSS 的 `container-type` 或 `container` 属性显式声明该容器是一个查询容器。

```CSS
.card--container {
    container-type: inline-size;
}
```

然后通过 `@container` 规则对容器进行查询，有点类似于 CSS 的 `@media` 规则，当条件符合时，将调整查询容器后代元素的样式。

比如上面的示例，如果 `.card` 元素的容器（`.card--container`）的宽度大于或等于 `414px` ，给组件变体添加一个特定的样式：

```CSS
@container (width >= 414px) {
    .card {
        grid-template-columns: 220px minmax(0, 1fr);
        grid-template-areas:
            "thumbnail title"
            "thumbnail description";
        row-gap: 1rem;
    }
    ​
    .card h3 {
        margin-top: 1rem;
    }
    ​
    .card img {
        aspect-ratio: 4 / 3;
    }
}
```

这里所说的，`container` 和 `@container` 是 [CSS Containment Module Level 3](https://drafts.csswg.org/css-contain-3/#containment-types) 新增的两个属性，它们看上去非常相似，但有着本质的区别：

*   `container` 是 `container-type` 和 `container-name` 的简写属性，用来显式声明某个元素是一个查询容器，并且定义查询容器的类型（可以由 `container-type` 指定）和查询容器的名称（由 `container-name` 指定）。
*   `@container`（带有 `@` 规则），它类似于条件 CSS 中的 `@media` 或 `@supports` 规则，是一个条件组规则，其条件是一个容器查询，它是大小（`size`）和（或）样式（`style`）查询的布尔组合。只有当其条件为真（`true`），`@container` 规则块中的样式都会被用户代理运用，否则将被视为无效，被用户代理忽略。

### 定义一个包含性上下文

要使用 CSS 容器查询特性，**首先要定义一个包含性上下文（Containment Context）** 。这个有点类似于使用 Flexbox 和 Grid 布局（定义 Flexbox 或 Grid 上下文使用的是 `display` 属性），只不过，定义一个包含性的上下文使用的不是我们熟知的 `display` 属性，而是一个新的 CSS 属性，即 **`container`** 。

在一个元素上显式使用 `container` 可以告诉浏览器以后要针对这个容器进行查询，以及具体如何查询该指定的容器。比如，上面演示的示例中，我们在 `.card--container` 元素上（`.card` 的父容器）显式设置了 `container-type` 的值为 `inline-size`:

```CSS
.card--container { 
    container-type: inline-size;
} 
```

上面的代码告诉浏览器，可以基于 `.card--container` 容器的内联轴（Inline Axis）方向尺寸变化进行查询。也就是说，当 `.card--container` 容器宽度大小变化到指定的某个值时，其后代元素的样式就可以进行调整。

`container-type` 是 `container` 属性中的一个子属性，另外，还可以显式使用 `container-name` 来命名你的容器，即**给一个包含性上下文指定一个具体的名称** ：

```CSS
.card--container { 
    container-name: card; 
}
```

这种方式对于同一个上下文中有多个包含性上下文时非常有意义，可以更明确地知道哪些查询会影响元素。

你可以使用简写属性 `container`，只不过需要在 `container-type` 和 `container-name` 之间添加斜杠分割符 `/`：

```CSS
.card--container { 
    container-type: inline-size; 
    container-name: card; 
} 

/* 等同于 */ 
.card--container { 
    container: card / inline-size; 
} 
```

**在使用 `container` 简写方式时，`container-name` 要放在 `/` 前，`container-type` 要放在 `/` 后** 。

另外，如果一个容器查询被应用到一个没有定义为包含上下文的祖先元素上，查询将无法应用。也就是说，无论是 `body` 还是 `html` 元素，都没有默认的回退包含上下文。而且，定义包含上下文名称时不能是 CSS 的关键词，比如 `default`、`inherit`、`initial` 等。

> 注意：`container-name` 可以省略，如果省略将会使用其初始值 `none`，但 `container-type` 不可省略，如果省略的话则表示未显式声明包含性上下文！

### 定义一个容器查询

现在我们知道使用 `container`（或其子属性 `container-type` 和 `container-name`）对一个元素显式声明包含上下文（对一个元素应用包含性）。

CSS 包含性上下文提供了一种方法来隔离页面的各个部分，并向浏览器声明这些部分在样式和布局方面与页面的其他部分是独立的。也就是说，有了这个包含性上下文之后，就可以使用 CSS 的 `@` 规则 `@container` 来对应用了包含性元素进行查询，即**对容器进行查询** 。`@container` 规则的使用和 `@media` 以及 `@supports` 相似：

```CSS
@container (width > 45rem) { 
    /* 应用了包含性上下文后代元素的 CSS */ 
} 

@container card (width > 45rem) { 
    /* 应用了包含性上下文后代元素的 CSS */ 
} 
```

这两种方式都是正确的使用姿势，第二个示例中的 `card` 指的是 `container-name` 显式声明的包含性上下文的名称。如果在 `@container` 中没有指定查询的容器名称，那么这个查询将是针对离样式变化最近的声明了包含性上下文的元素进行查询。比如：

```CSS
@container (width > 30em) { 
    .card { 
        border-radius: 20px; 
    } 
} 
```

表示这个查询将是针对 `.card` 元素最近的显式声明了包含性上下文的元素进行查询。

上面展示的示例都是仅查询容器内联轴尺寸，即 `inline-size` 。事实上，除了查询容器的内联轴尺寸之外，还可以同时查询容器的内联轴和块轴尺寸，即 `size` ：

```CSS
@layer components {
    .container {
        container-type: size;
    }
    /* 组件其他样式 */
}

@layer variant {
    @container (width >= 300px) and (height >= 300px) {
        .t-shirt__container {
            --scale: 1.5;
            --size: "M";
            --hue: 210;
        }
    }
      
    @container ( width >= 400px) and (height >= 400px) {
        .t-shirt__container {
            --scale: 2;
            --size: "L";
            --hue: 104;
        }
    }
      
    @container (width >= 500px) and (height >= 500px) {
        .t-shirt__container {
            --scale: 2.5;
            --size: "XL";
            --hue: 280;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/648eb06c58fa42bf9a0e15766fe44934~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWvBMJb>

## CSS 容器查询用例

接下来，我们来看看现实生活中使用容器查询的几个示例，希望这些示例能帮助大家更好理解和掌握 CSS 容器查询特性。

### 卡片组件

正如你看到的，文章从头到尾都在用卡片组件为例，向大家阐述容器查询的特性。而且卡片组件也是 Web 中常用组件之一。我们使用容器特性构建的卡片组件，可以根据其容器中的可用空间从垂直设计切换到水平设计。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3c82648adb74c4c8a9392dca8891c7c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwVEYGv>

卡片组件所需的 HTML 结构如下：

```HTML
<div class="card--container">
    <div class="card">
        <img src="https://source.unsplash.com/V7SKRhXskv8/400x300" alt="">
        <h3>Container Queries Rule</h3>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis magni eveniet natus nulla distinctio eaque?</p>
    </div>
</div>
```

首先设置卡片默认样式：

```CSS
@layer reset, base, components, variants;

@layer components {
    .card {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0.25rem 0.5rem -0.15rem hsl(0 0% 0% / 55%);
        background-color: hsl(185 100% 98%);
        color: hsl(220 70% 35%);
    }

    .card > * {
        margin: 0;
    }

    .card img {
        aspect-ratio: 4/3;
        border-radius: inherit;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57099629faf14fbb98d6f84a96fea57e~tplv-k3u1fbpfcp-zoom-1.image)

如果你在一个更大的视窗上查看，这可能看起来有点奇怪，因为我们在 `.card` 上并没有对宽度进行限制。

我们可以基于 CSS 的容器查询，来调整网格模板区域（`grid-template-areas`），从而调整卡片组件的布局。

```CSS
@layer variants {
    .card--container {
        container: card / inline-size;
    }

    @container card (width >= 30ch) {
        .card {
            grid-template-areas: "thumbnail title" "content content";
            grid-auto-columns: 33% minmax(0, 1fr);
            align-items: center;
        }
        
        .card p {
            grid-area: content;
        }

        .card img {
            aspect-ratio: 1;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6060df9589d4ef39b03b0ac690a5c29~tplv-k3u1fbpfcp-zoom-1.image)

我们可以进一步改进卡片组件的布局，以适应更大的宽度。

```CSS
@layer variants {
    .card--container {
        container: card / inline-size;
    }

    @container card (width >= 30ch) {
        /* Card 组件样式 */
    }
        
    @container (width >= 60ch) {
        .card {
            grid-template-areas: "thumbnail title" "thumbnail content";
        }

        .card img {
            grid-area: thumbnail;
        }

        .card h3 {
            align-self: end;
        }

        .card p {
           align-self: start;
        }
    } 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/977017da0ebd4bd282926b9d6e3669bf~tplv-k3u1fbpfcp-zoom-1.image)

除此之外，我们还可以使用 [CSS 比较函数 clamp() ](https://juejin.cn/book/7223230325122400288/section/7241401565653762108)和[容器查询单位](https://juejin.cn/book/7223230325122400288/section/7249357892611440700)（比如 `cqi`）创建流体排版，即根据容器尺寸变化动态调整卡片标题和描述文本的字号（`font-size`）：

```CSS
.card h3 {
    font-size: clamp(1.25rem, 3cqi + 1rem, 2.5rem);
}

.card p {
    font-size: clamp(0.9rem, 0.5cqi + 1rem, 1.5rem);
}
```

现在，作为一张独立的卡片，你可能认为它的变化一般，和媒体查询构建的响应式组件没两样，甚至还会认为容器查询没有增加多少价值。

为此，让我们添加更多的卡片，并且使用 Flexbox 来完成页面级布局：

```CSS
@layer layout {
    body {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
    }
      
    .card--container {
        flex: 1 1 25ch;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7383b7beb9e49288153d9bc89195423~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwVELmP>

### 时间轴组件

在此示例中，时间轴根据容器宽度从迷你设计（适合移动端，位于窄容器中）更改变全宽度设计（适合桌面端，位于大容器中）。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9f017fbc483421db733763b711a30e7~tplv-k3u1fbpfcp-zoom-1.image)

这是一个非常普通的时间轴（Timeline）组件，它所需要的 HTML 结构如下：

```HTML
<div class="timeline--container">
    <div class="timeline--wrapper">
        <ol class="timeline">
            <li>
                <time>24/12/1994</time>
                <img src="https://picsum.photos/120/120/?random=2" alt="">
                <h3>Creative Director Miami, FL</h3>
                <p>Creative Direction, User Experience, Visual Design, Project Management, Team Leading</p>
            </li>
            <!-- 时间轴上的其他列表项 -->
        </ol>
    </div>
</div>
```

时间轴组件有三个变体，它们分别用于移动端的 `mobile` 、平板端的 `tablet` 和桌面端的 `desktop` ，我们使用 CSS 的 `@layer` 来管理它们的级联及样式。

```CSS
@layer reset, base, components.mobile, components.tablet, components.desktop, layout;
```

我们主要关注其中的 `components.mobile` 、`components.tablet` 和 `components.desktop` 的样式。

```CSS
@layer components.mobile {
    .timeline--wrapper {
        display: grid;
        row-gap: 2rem;
        grid-template-columns: 30px minmax(0, 1fr);
        grid-template-areas: "line lists";
    }

    .timeline--wrapper::before {
        content: "";
        width: 2px;
        grid-area: line;
        background-color: #fff;
        justify-self: center;
    }

    .timeline {
        grid-area: lists;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .timeline li {
        display: grid;
        align-items: start;
        align-content: start;
        grid-template-columns: 64px minmax(0, 1fr);
        gap: 0.5rem 1.5rem;
        grid-template-areas:
            "avatar time"
            "... title"
            "... description";
        margin-left: 1.5rem;
        position: relative;
    }

    .timeline li::before {
        content: "";
        position: absolute;
        height: 2px;
        top: 31px;
        background-color: #fff;
        width: calc(64px + 1.5rem + 1.5rem + 15px);
        right: calc(100% - 1.5rem - 64px);
   }

    .timeline img {
        grid-area: avatar;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 2px solid rgb(255 210 0);
        z-index: 2;
    }

    .timeline time {
        grid-area: time;
        color: rgb(255 210 0);
        align-self: center;
        font-size: clamp(1rem, 3cqi + 1.25rem, 1.5rem);
        display: flex;
        gap: 1rem;
        align-items: center;
        position: relative;
    }

    .timeline time::before,
    .timeline time::after {
        content: "";
        display: block;
        background-color: rgb(255 210 0);
        width: 24px;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 2px solid #000;
    }

    .timeline time::after {
        right: calc(100% + 64px + 1.5rem + 1.5rem + 2px);
        position: absolute;
    }

    .timeline h3 {
        grid-area: title;
        font-size: clamp(1.25rem, 4cqi + 1.5rem, 2rem);
    }
        
    .timeline p {
        grid-area: description;
        font-size: 85%;
        color: rgb(255 255 255 / 0.8);
    }
}
```

这个时候，你在窄容器中看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7224806f8f8043e6806062f4acce50a4~tplv-k3u1fbpfcp-zoom-1.image)

接下来编写 `components.tablet` （平板端变体）。在编写该变体样式之间，需要将组件容器 `.timeline--container` 显式声明为一个查询容器：

```CSS
.timeline--container {
    container-type: inline-size;
}
```

这样我们就可以在 `@container` 中编写平板端的组件样式：

```CSS
@layer components.tablet {
    .timeline--container {
        container-type: inline-size;
    }

    @container (width >= 768px) {
        .timeline--wrapper {
            grid-template-columns: auto;
        }
            
        .timeline--wrapper::before {
            content: none;
        }
            
        .timeline {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 30px minmax(0, 1fr);
            justify-content: center;
            column-gap: 0;
        }

        .timeline::before {
            content: "";
            width: 2px;
            grid-area: line;
            background-color: #fff;
            justify-self: center;
            grid-row: 1 / span 12;
            grid-column: 2;
        }

        .timeline li:nth-of-type(2n + 1) {
            grid-column-start: 3;
        }

        .timeline li:nth-of-type(2n) {
            grid-column-start: 1;
            grid-template-columns: minmax(0, 1fr) 64px;

            grid-template-areas:
                "time  avatar"
                "title ..."
                "description ...";
            margin-right: 1.5rem;
            margin-left: 0;
            justify-content: end;
            text-align: end;
        }

        .timeline li:nth-of-type(2n) time {
            flex-direction: row-reverse;
        }

        .timeline li:nth-of-type(2n) time::after {
            left: calc(100% + 64px + 1.5rem + 1.5rem + 2px);
            right: auto;
        }

        .timeline li:nth-of-type(2n)::before {
            left: calc(100% - 1.5rem - 64px);
            right: auto;
        }

        .timeline li:nth-of-type(3) {
            grid-row-start: 3;
        }

        .timeline li:nth-of-type(3) {
            grid-row-start: 5;
        }

        .timeline li:nth-of-type(4) {
            grid-row-start: 7;
        }

       .timeline li:nth-of-type(5) {
            grid-row-start: 9;
        }

        .timeline li:nth-of-type(6) {
            grid-row-start: 11;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95fbc1a5b22749d486e3e7445b855306~tplv-k3u1fbpfcp-zoom-1.image)

最后一步是处理 `components.desktop` 的样式：

```CSS
@layer components.desktop {
    @container (width >= 1024px) {
        .timeline--wrapper {
            overflow-x: auto;
        }
            
        .timeline {
            grid-template-columns: repeat(6, minmax(360px, 1fr));
            grid-template-rows: auto 30px auto;
        }

        .timeline::before {
            grid-column: 1 / span 6;
            grid-row: 2;
            width: 100%;
            height: 2px;
            justify-self: unset;
            align-self: center;
        }
            
        .timeline li {
            margin-left: 0;
            grid-template-areas:
                "avatar time"
                "avatar title"
                "avatar description";
            grid-template-columns: 64px minmax(0, 1fr);
            grid-template-rows: auto auto minmax(0, 1fr);
            grid-row-start: 1;
            grid-column-start: 1;
        }

        .timeline li:nth-of-type(2n) {
            grid-row-start: 3;
            text-align: start;
            justify-content: start;
            margin-right: 0;
        }

        .timeline li:nth-of-type(2n)::before {
            bottom: 10px;
            top: calc(0% - 2rem - 12px);
        }

        .timeline li:nth-of-type(2n)::after {
            top: calc(0% - 2rem - 30px);
            bottom: 0;
        }

        .timeline li:nth-of-type(2n) time {
            flex-direction: row;
        }

        .timeline li:nth-of-type(2) {
            grid-column-start: 2;
        }

        .timeline li:nth-of-type(3) {
            grid-column-start: 3;
        }

        .timeline li:nth-of-type(4) {
            grid-column-start: 4;
        }

        .timeline li:nth-of-type(5) {
            grid-column-start: 5;
        }

        .timeline li:nth-of-type(6) {
            grid-column-start: 6;
        }
            
        .timeline li::before {
            right: auto;
            bottom: calc(0% - 2rem - 3px);
            top: 12px;
            width: 2px;
            grid-area: avatar;
            justify-self: center;
            height: unset;
            left: auto;
        }

        .timeline li::after {
            content: "";
            display: block;
            background-color: rgb(255 210 0);
            width: 24px;
            aspect-ratio: 1;
            border-radius: 50%;
            border: 2px solid #000;
            grid-area: avatar;
            justify-self: center;
            align-self: end;
            z-index: 2;
            position: absolute;
            bottom: calc(0% - 2rem - 30px);
        }

        .timeline time::before {
            position: absolute;
            right: calc(100% + 32px + 10px);
        }

        .timeline time::after {
            content: none;
        }

        .timeline img {
            place-self: center;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32191b589a2740d1bacee5b837a6853d~tplv-k3u1fbpfcp-zoom-1.image)

最终效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a88fd12cb7044517b1079a63fc674283~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQqGRO>

它看起来和使用 CSS 媒体查询构建出来的响应式组件效果一样，但事实上还是有很大差异的，比如，我们将时间轴组件放置在不同的位置，我们可以在不调整视窗就能看到时间轴组件随容器尺寸的变化：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/934bd617686d4368b592c185c9cb62be~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dyQgmbZ>

### 导航栏

Web 页面导航栏是常见的一个组件，在宽屏和窄屏的时候，它会向用户呈现不同的 UI 效果，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0dabed7e1c34c56ac63542ee12b6f8b~tplv-k3u1fbpfcp-zoom-1.image)

就拿我自己的博客（[www.w3cplus.com](www.w3cplus.com)）航栏为例吧。它也有类似的效果，只不过是使用 CSS 媒体查询实现的，现在我们使用 CSS 容器查询来实现：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25a1a7f2ce594419a72ef212d394b5ca~tplv-k3u1fbpfcp-zoom-1.image)

构建上面导航所需的 HTML 结构如下：

```HTML
<div class="header">
     <h1 class="logo"><a href="https://www.w3cplus.com"><img src="https://www.w3cplus.com/sites/all/themes/w3cplusV2/images/logo.png" alt="W3cplus"></a></h1>
     <nav class="menu">
        <ul>
            <li><a href="https://www.w3cplus.com/blog/tags/686.html">会员专栏</a></li>
            <!-- 其他导航列表项 -->
        </ul>
    </nav>
    <div class="menu__icon">
        <span>menu</span>
        <svg t="1638455499563" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6454" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
            <path d="M170.666667 213.333333m64 0l554.666666 0q64 0 64 64l0 0q0 64-64 64l-554.666666 0q-64 0-64-64l0 0q0-64 64-64Z" fill="currentColor" p-id="6455"></path>
            <path d="M234.666667 640h554.666666a64 64 0 0 1 0 128h-554.666666a64 64 0 0 1 0-128z m0-213.333333h554.666666a64 64 0 0 1 0 128h-554.666666a64 64 0 0 1 0-128z" fill="currentColor" p-id="6456"></path>
        </svg>
    </div>
</div>
 ```
 
 ```CSS
@layer components {
    .header {
        min-height: 80px;
        background-color: #333;
        padding: 0 20px;
        display: grid;
        gap: 10px;
        grid-template-columns: min-content auto min-content;
        color: #fff;
        align-items: center;
    }
    ​
    .logo {
        width: 68px;
        aspect-ratio: 1 / 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #00a3cf;
    }
    ​
    .logo img {
        max-width: 100%;
        height: auto;
        display: block;
    }
    ​
    .menu ul {
        list-style: none outside none;
        display: flex;
        align-items: center;
        gap: 20px;
    }
    ​
    .menu a {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        color: #9e9e9e;
        text-decoration: none;
        transition: all 0.2s ease-in-out;
        font-size: 24px;
        white-space: nowrap;
    }
    ​
    .menu a:hover {
        color: #fff;
    }
    ​
    .menu__icon {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 24px;
    }
    ​
    .menu__icon span {
        display: block;
        font-weight: 700;
        text-transform: uppercase;
        line-height: 1;
    }
    ​
    .icon {
        width: 1.2em;
        height: 1.2em;
    }
    ​
    .menu {
        display: none;
    }
}
    ​
@layer variants {
    .browser {
        container-type: inline-size;
    }
    ​
    @container (width > 768px) {
        .menu {
            display: block;
        }
        .menu__icon {
            display: none;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48d42c0ff56f483ca354332dd11c2dc3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYazxV>

### 侧边栏

在一些 Web 应用的侧边栏（比如 Gitlab 的侧边栏、Facebook 聊天界面，其实 Web 版本的微信群也有点类似于 Facebook 聊天室）像下图这样的模式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e914967535f94921855ba30b44e780d3~tplv-k3u1fbpfcp-zoom-1.image)

像上图这样的效果，我们可以使用 CSS 容器查询来实现。当有足够的空间时，侧边栏的列表会展开，如果没有足够空间时，侧边栏只会展示 Icon 图标（或用户头像）。我们来实现一个像下图的布局效果。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e281c19a0974482e9456e88a8b830bac~tplv-k3u1fbpfcp-zoom-1.image)

```HTML
<div class="wrapper">
    <aside>
        <h1 class="logo">
            <svg width="36px" height="36px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="tanuki-logo"></svg>
            <span>GitLab</span>
        </h1>
        <nav class="menu">
            <ul>
                <li>
                    <a href="#">
                        <svg t="1638543010000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2303" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"></svg>
                        <span>Home</span>
                    </a>
                </li>
                <!-- 省略其他 li -->
            </ul>
        </nav>
        <div class="profile">
            <img src="https://www.w3cplus.com/sites/all/themes/w3cplusV2/images/logo.png" alt="">
             <span>w3cplus</span>
        </div>
    </aside>
    <main>
        <div class="card">
            <img src="https://picsum.photos/2568/600?random=1" width="2568" height="600" alt="" class="card__thumbnail" />
            <div class="card__badge">Must Try</div>
            <h3 class="card__title">Best Brownies in Town</h3>
            <p class="card__describe">High quality ingredients and best in-class chef. Light, tender, and easy to make~</p>
            <button class="card__button">Order now</button>
       </div>
       <!-- 省略其他 card -->
    </main>
</div>
```

关键的 CSS 代码：

```CSS
@layer reset, base, components, variants;
    ​
@layer components {
    .wrapper {
        display: grid;
        grid-template-columns: 0.3fr 1fr;
        width: 100vw;
    }
        
    aside {
        display: grid;
        grid-template-rows: min-content auto min-content;
        background-color: #777;
        padding-bottom: 20px;
    }
    ​
    .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 1.25rem;
        gap: 10px;
        width: 100%;
        margin: 0;
        padding: 20px 0;
        border-bottom: 1px solid #352a2a;
        box-shadow: 0 1px 0 0 #d8d8d8;
    }
    ​
    .diver {
        border-bottom: 1px solid #352a2a;
        box-shadow: 0 1px 0 0 #d8d8d8;
        width: 100%;
        height: 0;
    }
    ​
    .menu a {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #d8d8d8;
        padding: 0 24px;
        min-height: 44px;
        text-decoration: none;
    }
    ​
    .menu .active,
    .menu a:hover {
        background-color: #666;
        color: #fff;
    }
    ​
    .profile {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        color: #fff;
    }
    ​
    .profile img {
        width: 48px;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
    }
    ​
    main {
        display: grid;
        gap: 20px;
        padding: 20px;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        align-items: start;
        align-content: start;
    }
    ​
    .card {
        display: grid;
        border-radius: 24px;
        background-color: #fff;
        color: #454545;
        gap: 10px;
        box-shadow: 0 0 0.35em 0 rgb(0 0 0 / 0.5);
    }
    ​
    .card__thumbnail {
        aspect-ratio: 16 / 9;
        object-fit: cover;
        object-position: center;
        border-radius: 24px 24px 0 0;
        grid-area: 1 / 1 / 2 / 2;
        z-index: 1;
    }
    ​
    .card__badge {
        grid-area: 1 / 1 / 2 / 2;
        z-index: 2;
        background-color: #2196f3;
        border-radius: 0 10rem 10rem 0;
        align-self: start;
        justify-self: start;
        margin-top: 2rem;
        color: #fff;
        padding: 5px 12px 5px 8px;
        text-shadow: 0 0 1px rgb(0 0 0 / 0.5);
        filter: drop-shadow(0px 0px 2px rgb(0 0 0 / 0.5));
    }
    ​
    .card__title {
        font-weight: 700;
        font-size: clamp(1.2rem, 1.2rem + 3vw, 1.5rem);
        padding: 0 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    ​
    .card__describe {
        color: #666;
        line-height: 1.4;
        padding: 0 20px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
    ​
    .card__button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 10rem;
        background-color: #feca53;
        padding: 10px 20px;
        color: #000;
        text-decoration: none;
        box-shadow: 0 3px 8px rgb(0 0 0 / 7%);
        transition: all 0.2s linear;
        font-weight: 700;
        justify-self: end;
        margin: 0 20px 20px 0;
        cursor: pointer;
    }
    ​
    .card__button:hover {
        background-color: #ff9800;
    }
    ​
    aside {
        container-type: inline-size;
        min-width: 100px;
    }
}
    ​
@layer variants {
    .wrapper {
        container-type: inline-size;
    }
    ​
    @container (width =< 200px) {
        .logo span,
        .menu span,
        .profile span {
            display: none;
        }
        
        .menu a {
            gap: 0;
            justify-content: center;
        }
    }
    ​
    @container (width >= 760px) and (width =< 1024px) {
        main {
            grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
        }
            
        .card {
            grid-template-columns: 240px auto;
            grid-template-rows: min-content min-content auto;
            grid-template-areas:
                "thumbnail title"
                "thumbnail describe"
                "thumbnail button";
            gap: 0;
        }
        
        .card__thumbnail {
            grid-area: thumbnail;
            aspect-ratio: 1 / 1;
            border-radius: 12px 0 0 12px;
            z-index: 1;
        }
        
        .card__badge {
            grid-area: thumbnail;
            z-index: 2;
            display: flex;
        }
        .card__describe {
            grid-area: describe;
            align-self: start;
            display: flex;
            margin-top: -24px;
        }
        
        .card__title {
            grid-area: title;
            margin-top: 20px;
            align-self: start;
        }
        
        .card__button {
            grid-area: button;
            align-self: end;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/523f02bd71f944da9750611704fc709c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJaBvpq>

### 项目卡片

根据父容器宽度更改项目卡片的布局：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3f78c814fde47c0a64888c657260fdd~tplv-k3u1fbpfcp-zoom-1.image)

关键的 CSS ：

```CSS
@layer reset, base, components, variants;
    ​
@layer components {
    .project-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: #fff;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #eaeaea;
        box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.06);
    }
        
    .project-card button {
        flex: 0 0 32px;
        width: 32px;
        height: 32px;
        appearance: none;
        border: 0;
        background: transparent;
        border-radius: 0;
        cursor: pointer;
        opacity: 0.25;
    }
      
    .project-card svg {
        width: 100%;
        height: 100%;
    }
        
    .project-card h3 {
        color: #222;
    }
    ​
    .project-card__header {
        display: flex;
        align-items: center;
    }
        
    .project-card__header time {
        font-size: 14px;
        color: #645c5c;
    }
        
    .project-card__header button {
        margin-left: auto;
    }
    ​
    .progress-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
    }
      
    .progress-wrapper p {
        font-size: 14px;
    }
    ​
    .progress {
        flex: 1;
        display: flex;
        height: 4px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
    }
    ​
    .progress__current {
        height: 4px;
        width: 50%;
        background-color: #528ef8;
    }
    ​
    .project-card__body > * + * {
        margin-top: 0.25rem;
    }
        
    .project-card__body > p {
        color: #585858;
        font-size: 14px;
    }
    ​
    .remaining {
        display: inline-flex;
        font-size: 14px;
        padding: 6px 12px;
        border-radius: 100px;
        background-color: rgba(239, 71, 111, 0.1019607843);
    }
    ​
    .project-card__footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }
    ​
    .users-list {
        display: flex;
    }
    ​
    .user {
        --size: 24px;
        width: var(--size);
        aspect-ratio: 1;
        background-color: #c7bbe2;
        border-radius: 50%;
        border: 2px solid #fff;
        opacity: 0.8;
    }
        
    .user:not(:first-child) {
        margin-left: -4px;
    }
        
    .user:nth-child(2) {
        background-color: #bbe2c0;
    }
        
    .user:nth-child(3) {
        background-color: #b7c2ff;
    }
}
    ​
@layer variants {
    .progress-wrapper {
        container: progress / inline-size;
    }
        
    .wrapper {
        container: card / inline-size;
    }
    ​
    @container progress (width <= 200px) {
        .progress-wrapper p:first-child {
            display: none;
        }
    }
        
    @container card (width <= 449px) {
        .progress-wrapper {
            border-top: 1px solid rgba(0, 0, 0, 0.25);
            padding-top: 1rem;
            margin-top: 1rem;
        }
    }
        
    @container card (width >= 450px) {
        .project-card {
            display: grid;
            grid-template-columns: 1fr 120px;
        }
        
        .project-card__header {
           display: contents;
        }
            
        .project-card__header button {
            justify-self: end;
        }
        
        .project-card__body {
            grid-template-columns: 1fr 2fr;
            gap: 0 1rem;
        }
        
        h3,
        p {
            grid-column: 1/2;
        }
        
        .project-card__footer {
            text-align: end;
        }
        
        .progress-wrapper {
            max-width: initial;
            grid-column: 2/3;
            grid-row: 1;
        }
    }
        
    @container card (width >= 750px) {
        .project-card {
           grid-template-columns: 1fr 170px;
        }
        
        .project-card__body {
            display: grid;
        }
        
        .project-card__footer {
            align-items: start;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5843c8cb2be642d3930ffbb7b85062e6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQqddm>

### 搜索表单

搜索表单在一些业务场景很常见，它会根据容器的宽度有不同的状态，这样的搜索组件就非常适用于 CSS 容器查询：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e393f0089b0e4c8db005cae21bdbc036~tplv-k3u1fbpfcp-zoom-1.image)

构建这个搜索表单，可能需要一个这样的 HTML 结构：

```HTML
<div class="form__container">
    <form class="form">
        <svg t="1638370815485" class="icon--search" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3749" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
            <path d="M874.798784 719.859059a456.211411 456.211411 0 1 0-152.8584 136.311873V659.976387l-8.667229 10.243088a293.897852 293.897852 0 1 1 48.063724-66.186111v228.499671l191.466965 191.466965V800.227909z" p-id="3750"></path>
        </svg>
        <input type="search" placeholder="皮裤女短裤真皮" name="search" class="search" />
        <svg t="1638370901048" class="icon--camera" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6029" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
            <path d="M846.933333 238.933333h-140.8L646.4 149.333333c-6.4-10.666667-17.066667-17.066667-29.866667-17.066666h-209.066666c-12.8 0-23.466667 6.4-29.866667 17.066666l-59.733333 89.6H177.066667c-57.6 0-106.666667 46.933333-106.666667 106.666667v426.666667c0 57.6 46.933333 106.666667 106.666667 106.666666h672c57.6 0 106.666667-46.933333 106.666666-106.666666v-426.666667c-2.133333-59.733333-49.066667-106.666667-108.8-106.666667z m34.133334 533.333334c0 19.2-14.933333 34.133333-34.133334 34.133333H177.066667c-19.2 0-34.133333-14.933333-34.133334-34.133333v-426.666667c0-19.2 14.933333-34.133333 34.133334-34.133333h160c12.8 0 23.466667-6.4 29.866666-17.066667L426.666667 206.933333h170.666666l59.733334 89.6c6.4 10.666667 17.066667 17.066667 29.866666 17.066667h160c19.2 0 34.133333 14.933333 34.133334 34.133333v424.533334z" p-id="6030"></path>
            <path d="M512 364.8c-96 0-174.933333 78.933333-174.933333 174.933333 0 96 78.933333 174.933333 174.933333 174.933334 96 0 174.933333-78.933333 174.933333-174.933334 0-96-78.933333-174.933333-174.933333-174.933333z m0 279.466667c-57.6 0-104.533333-46.933333-104.533333-104.533334s46.933333-104.533333 104.533333-104.533333 104.533333 46.933333 104.533333 104.533333-46.933333 104.533333-104.533333 104.533334z" p-id="6031"></path>
        </svg>
        <button class="button">搜索</button>
    </form>
</div>
```

使用 CSS 容器查询来完成所需要的搜索表单功能：

```CSS
@layer reset, base, components, variants;
    ​
@layer components {
    .form__container {
        container-type: inline-size;
        overflow: hidden;
        resize: horizontal;
        min-inline-size: 200px;
        max-inline-size: 80vw;
    }
    ​
    .form {
        display: grid;
        font-size: 46px;
        border: 4px solid #ff5b0a;
        background-color: #fff;
        border-radius: 10rem;
        padding: 10px;
        align-items: center;
    }
    ​
    .icon--search,
    .icon--camera {
        width: 1em;
        height: 1em;
        display: none;
    }
    ​
    .search {
        display: none;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 100%;
        padding: 0 5px;
        border: none;
   }
    ​
    .button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-height: 88px;
        border: none 0;
        background-image: linear-gradient(90deg, #ff9602 0%, #ff5b0a 100%);
        border-radius: 10rem;
        color: #fff;
        font-size: 46px;
        font-weight: 700;
    }
}
    ​
@layer variants {
    @container (width > 480px) {
        ::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */
            color: #000;
        }
            
        ::-moz-placeholder {
            /* Firefox 19+ */
            color: #000;
        }
            
        ::-ms-input-placeholder {
            /* IE 10+ */
            color: #000;
        }
            
        ::-moz-placeholder {
            /* Firefox 18- */
            color: #000;
        }
            
        .form {
            grid-template-columns: min-content 1fr 200px;
            grid-template-areas: "searchIcon searchInput button";
            grid-template-rows: 88px;
            gap: 10px;
        }
        
        .icon--search {
            display: block;
            grid-area: searchIcon;
        }
        
        .search {
            grid-area: searchInput;
            display: flex;
            font-weight: 700;
        }
        
        .button {
            grid-area: button;
        }
    }
    ​
    @container (width > 768px) {
        ::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */
            color: #b4b4b4;
        }
            
        ::-moz-placeholder {
            /* Firefox 19+ */
            color: #b4b4b4;
        }
            
        ::-ms-input-placeholder {
            /* IE 10+ */
            color: #b4b4b4;
        }
            
        ::-moz-placeholder {
            /* Firefox 18- */
            color: #b4b4b4;
        }
            
        .form {
            grid-template-columns: min-content 1fr min-content 200px;
            grid-template-areas: "searchIcon searchInput cameraIcon button";
            grid-template-rows: 88px;
            gap: 10px;
        }
            
        .icon--search {
            fill: #b4b4b4;
        }
            
        .search {
            color: #b4b4b4;
            font-weight: 400;
        }
            
        .icon--camera {
            display: block;
            grid-area: cameraIcon;
            fill: #b4b4b4;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a2d41f9893f4ddc8f1db1ef6b4369af~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEOYVx>

### 情人节的礼物

[@Una Kravets 为了庆祝 CSS 容器查询的到来，在 Codepen 写了一个 Demo](https://codepen.io/web-dot-dev/full/rNrbPQw)，为所有人做了一个情人节的礼物。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23956198b0be44118b8b66cf6e0be1df~tplv-k3u1fbpfcp-zoom-1.image)![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/049d099967514ff3b60db52ee0222dc0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/rNQqvxJ>

## 小结

CSS 容器查询和媒体查询对于构建响应网站至关重要。其中媒体查询主要用于页面级响应式布局，也称为宏观布局；而容器查询主要用于组件级响应式布局，也称为微观布局。因此，我建议在我们构建网站中使用它们来增强用户体验。

在这节课中，我们主要探讨容器查询中尺寸查询，在下一节课中，我们将一起探讨 CSS 容器查询中的样式查询和状态查询。
