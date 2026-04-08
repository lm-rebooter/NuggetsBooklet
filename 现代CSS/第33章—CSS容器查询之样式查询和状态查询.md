上一节课，我们主要介绍了 [CSS 容器查询中的尺寸查询](https://juejin.cn/book/7223230325122400288/section/7259668032165773368)。CSS 容器查询除了允许我们查询容器尺寸大小之外，还可以查询容器的样式和状态，这对于构建组件变体是非常有帮助的。在这节课中，我们一起来探讨一下 CSS 容器查询中的样式查询和状态查询。

## 简单的回忆一下尺寸查询

CSS 容器查询的尺寸查询允许你查询容器的大小（即 `inline-size` 和 `size`），查询容器的后代元素可以随着查询容器尺寸变化而调整样式。

换句话说，容器查询允许 Web 开发者查询与目标元素更相关、更特定的页面内元素（一个更精细的工具），从而将 UI 样式应用于目标元素，而不再是依赖于浏览器视窗进行样式输入。该功能提供了一个新的入口点来查询和注入响应式样式，并使用组件能够拥有自己的响应式样式逻辑。这使得组件更灵活，因为无论它出现在页面的哪个位置，样式逻辑都是固有地附加在组件上的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e372ec8d0b9a42fa9f077740d3ea32a6~tplv-k3u1fbpfcp-zoom-1.image)

你可以这样使用容器查询的尺寸查询。

首先，你需要使用一个容器将组件包裹起来，例如：

```HTML
<div class="component--container"><!-- 组件容器 -->
    <div class="component"><!-- 组件自身所需要的 HTML 结构 --></div>
</div>
```

其次使用 `container` 或其子属性 `container-type` 将组件容器 `.component--container` 定义为查询容器：

```CSS
.component--container {
    container-type: inline-size; /* 或者 size */
}
​
/* 或者 */
.component--container {
    container: container-name / inline-size; /* 其中 container-name 是给查询容器命名 */
}
```

最后可以使用 `@container` 规则（类似于 CSS 的 `@media` 规则）开始查询容器尺寸的变化，一旦满足查询条件，规则中的 CSS 样式将会应用于该容器中的组件。

```CSS
@container (width >= 768px) {
    /* 组件在 Tablet 中的 UI 变体 */
}
​
@container (width >= 1024px) {
    /* 组件在 Desktop 中的 UI 变体 */
}
```

例如下面这个用户信息卡片组件：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57b9757a10954a56b9f6006c19e67788~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
@layer reset, base, components, variants;
​
@layer components {
    .card {
        display: grid;
        grid-template-columns: 80px minmax(0, 1fr);
        grid-template-rows: auto;
        grid-template-areas:
            "figure  title"
            "figure  description";
        gap: 0.25rem 1rem;
        background-color: #fff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 0 0.5em 0.5em rgb(0 0 0 / 0.125);
        color: #ce0063;
        align-items: center;
        align-content: center;
    }
​
    figure {
        grid-area: figure;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid currentColor;
        aspect-ratio: 1;
        padding: 4px;
    }
​
    .card h3 {
        grid-area: title;
        line-height: 1;
        font-size: 1.25rem;
        align-self: end;
    }
​
    .card p {
        grid-area: description;
        margin: 0;
        font-size: 90%;
        color: #797e8a;
        align-self: start;
    }
​
    .card ul {
        display: none;
        width: 100%;
        padding-top: 1rem;
        border-top: 3px solid;
    }
​
    .card svg {
        color: #ce0063;
        font-size: 48px;
    }
}
​
@layer variants {
    .card__container {
        container-type: inline-size;
    }
​
    @container (width > 20rem) {
        .card {
            grid-template-columns: auto;
            grid-template-areas:
                "figure"
                "title"
                "description"
                "media";
            place-items: center;
            text-align: center;
            row-gap: 0.75rem;
        }
    
        figure {
            max-width: 160px;
        }
    
        .card ul {
            display: flex;
            grid-area: media;
            justify-content: space-evenly;
        }
    
        .card h3 {
            font-size: clamp(1.25rem, 2vw + 1.5rem, 1.75rem);
        }
    }
​
    @container (width > 35rem) {
        .card {
            grid-template-columns: 120px minmax(0, 1fr);
            grid-template-areas:
                "figure   title"
                "figure   description"
                "media    media";
            text-align: left;
            justify-items: start;
        }
    }
​
    @container (width > 45rem) {
        .card {
            grid-template-columns: 180px minmax(0, 1fr);
            grid-template-areas:
                "figure  title"
                "figure  description"
                "figure  media";
        }
    
        .card ul {
            justify-content: start;
            align-self: start;
            gap: 1rem;
        }
​
        .card svg {
            font-size: 24px;
        }
    }
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/023ed2e1f1ce498a84960af0354f575a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzzgBd>

## 样式查询

样式查询与尺寸查询是非常相似的，你可以使用样式查询查询容器的计算样式，但通过 `style()` 函数来区分尺寸查询，`style()` 函数接受任何有效的样式声明：

```CSS
@container style(font-style: italic) {
    em {
        background: var(--highlight);
        color: var(--highlight-text);
    }
}
​
@container style(--button: pill) {
    button {
        border-radius: 50%;
        padding-inline: 1em;
    }
}
​
@container colors style(background-color: black) {
    a:any-link {
        color: var(--link-on-dark);
    }
}
```

注意，样式查询的条件（即 `style()` 函数中的声明）比较的是计算值。例如：

```CSS
.container {
    container: card / inline-size;
}
​
@container card (min-width: 420px) { /* 相当于 @container (width >= 420px) */
    .card {
        background-color: #09f;
    }
}
​
@container card style(min-width: 420px) {
    .card {
        background-color: #09f;
    }
}
```

上面代码中是两种不同类型的容器查询，前者是尺寸查询，当查询容器的内联轴宽度（`inline-size`）大于或等于 `420px` 时，卡片组件（`.card`）背景颜色（`background-color`）是 `#09f` 。而后者是样式查询，它的意思是你正在寻找一个计算值 `min-width` 等于 `420px` ，只有查询容器的 `min-width` 值等于 `420px` 时，卡片组件（`.card`）的背景颜色才是 `#09f` 。

也就是说，**样式查询查看计算的样式值，而不是元素在页面上呈现时的值**。

### 定义样式容器

[通过上一节课的学习](https://juejin.cn/book/7223230325122400288/section/7259668032165773368)，我们知道可以使用 `container-type` 来定义尺寸查询容器：

```CSS
.container {
    container-type: inline-size; /* 或者 size*/
}
​
/* 或者 */
.container {
    container: card / inline-size;
    
    /* 等同于 */
    container-type: inline-size;
    container-name: card;
}
```

这是因为，查询容易是一种侵入性的东西，为了防止布局循环（一种昂贵操作），因此 Web 开发者必须仔细控制哪些元素是尺寸查询容器。所以，必须在容器元素上使用 `container-type` 来显式声明该元素是尺寸查询容器。

不过，样式查询没有尺寸查询这样的限制。在 CSS 中，后代样式没有办法对祖先的计算样式产生影响。因此不需要包含，并且将元素定义为样式查询容器时不会产生侵入性或意外的副作用。

换句话说，使用样式查询的时候不需要像尺寸查询那样显式声明查询容器就可以使用样式查询。例如，我们可以直接像下面这样使用样式查询：

```CSS
@container style(color: red) {
    .card {
        background-color: #fff;
    }
}
```

当然，使用 `container-type` 或 `container-name` 任何一个属性显式声明容器查询，同样也是可以的：

```CSS
.container  {
    container-type: inline-size;
}
​
/* 或者 */
.container {
    container-name: card;
}
```

就我个人而言，我还是建议显式声明容器查询，并且使用 `container-name` 更为妥当，这样我们就知道组件是相对于哪个容器查询进行样式查询：

```CSS
.card--container {
    container-name: card;
}
​
@container card style(color: red) {
    .card {
        background-color: #fff;
    }
}
```

然而，在查询样式时，有两个重要的(并且有些不同的)用例需要考虑：

-   对于继承的属性，最相关的容器总是直接的父元素
-   对于非继承的属性，直接父属性通常是不可靠的，因此明确要查询的容器是很重要的

在确定容器类型（`container-type`）的初始值时，[已经详细讨论了这一点](https://css.oddbird.net/rwd/style/explainer/#default-container-types)。

#### 继承属性的默认容器

当查询继承属性时，最相关的“容器”上下文通常是查询元素的直接父元素。

例如，如果我们想根据周围的上下文更改 `em` 样式。对于大多数 `em` 元素，我们会添加斜体（`font-style:italic` ），但当上下文已经是斜体时，为了增强 `em` 元素的可读性，我们可以给 `em` 元素运用一个背景颜色：

```CSS
.container {
    font-style: italic;
}
​
@container style(font-style: italic) {
    em {
        background-color: var(--highlight-bg);
        color: var(--highlight-text);
    }
}
```

为了使直接父元素上下文始终可用，我们将其定义为默认值：无论在容器类型（`container-type`）是什么值，所有元素都是样式查询容器。由于建立样式容器没有负面的副作用，我们认为这是 Web 开发者可用性的最佳途径。

如果我们需要一种方法让 Web 开发者在某些情况下关闭它，我们可以考虑添加一个 `container-type: normal` ，告诉浏览器该元素不是查询容器。然而，到目前为止，我们还没有在用例中看到对它的任何需求。

#### 非继承属性的命名容器

使用尺寸容器查询，我们通过在元素上设置 `container-type` 的值为 `inline-size` 或 `size` 来告诉浏览器，该元素是一个查询容器。对于样式查询，如果查询的是可继承属性，那么我们可以假设直接父类具有要查询的相关属性和值。但是我们不可能可靠地假设任何容器都具有非继承属性的相关值。

也就是说，如果我们查询的样属性是个非继承属性时，我们可以通过给元素显式设置 `container-name` 来告诉浏览器，该元素是一个样式查询容器。

通过建立查询容器的名称，Web 开发者可以确保样式查询始终针对适应的容器。例如，要查询卡片组件（`.card`）的内距（`padding` ，它是一个非继承属性），请始使用 `container-name` 将卡片组件（`.card`）的容器（例如，`.card--container`）定义为一个查询容器。例如：

```CSS
.container {
    container-name: card;
    padding-top: 1rem;
}
​
@container card style(padding-top: 1rem) {
    .card {
        border: 1px solid red;
    }
}
```

### 样式查询的使用

简单地说，对于可继承属性，你不需要显示声明查询容器就可以使用，但对于非继承属性，建议还是使用 `container-name` 显式定义样式查询容器。为了避免失误，就我个人而言，不管是查询可继承还是非继承属性，我都建议使用 `container-name` 来声明样式查询容器，这样你就可以知道元素样式是相对于谁进行查询。

例如，我们可以检查容器是否具有 `color: hotpink` ，并基于此设置卡片组件 `.card` 的背景颜色和边框颜色：

```CSS
.card--container {
    container-name: card;
    color: hotpink;
}
​
@container card style(color: hotpink) {
    .card {
        background-color: #fff;
        border-color: hotpink;
    }
}
```

理想情况下，上面的代码是可以正常工作的，但目前的样式查询还仅限于 CSS 自定义属性。现在，我们可以查询 CSS 自定义属性 `--color: true` 是否被添加到容器中，如果是，我们可以在此基础上更改样式查询容器后代元素的样式：

```HTML
<div class="card--container">
    <div class="card">Card Component</div>
</div> 
```

```CSS
@layer reset, base, components, variants;
​
@layer components {
    .card {
        padding: 1rem;
        border: 1px solid #09f;
    }
}
​
@layer variants {
    .card--container {
        --color: true;
        container-name: card;
    }
    
    @container card style(--color: true) {
        .card {
            background-color: #f36;
            border: 4px solid yellow;
            border-radius: 6px;
            text-align: center;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8389a82c2b9f4bbd9505bcf46cb25e3c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLQQNzZ>

### 样式查询可以解决什么问题？

你可能会问，既然有了尺寸查询，为什么还需要样式查询呢？这是一个好问题。在尺寸查询中，我们可以根据组件容器（查询容器）的宽度来控制组件的样式，这非常有用。可是，在某些情况下，我们可能不需要查询尺寸。相反，我们希望查询容器的计算样式。

为了让你更好的理解，让我们看一下下图。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13607772f5b04c5cb0193fd64bc2d48f~tplv-k3u1fbpfcp-zoom-1.image)

假设我们有一个默认的图片样式和另一个看起来很有特色的样式。它的 HTML 结构如下：

```HTML
<figure>
    <img src="cheesecake.jpg" alt="" />
    <figcaption>
        <p>Description</p>
    </figcaption>
</figure>
```

```CSS
figcaption {
    font-size: 13px;
    padding: 4px 8px;
    background: lightgrey;
}
```

当我们开始设计特色的样式时，我们需要添加一个类来覆盖上面的样式：

```CSS
.featured-figure {
    display: flex;
    flex-wrap: wrap;
}
​
.featured-figure figcaption {
    font-size: 16px;
    padding: 16px;
    border-left: 3px solid;
    margin-left: -6rem;
    align-self: center;
}
```

这看起来没有任何问题。但使用 CSS 样式查询，我们可以做得更好。我们可以通过查询父元素（`figure`）的 `display: flex` 或 CSS 自定义属性 `--featured: true` ，并基于此设置样式：

```CSS
figure {
    container-name: figure;
    --featured: true;
}
​
/* 特色图片样式 */
@container figure style(--featured: true) {
    figcaption {
        font-size: 16px;
        padding: 16px;
        border-left: 3px solid;
        margin-left: -6rem;
        align-self: center;
    }
}
```

如果 `--featured: true` 不存在，我们将默认为基本图片样式设计。当 `figure` 没有 `display: flex` 时，我们可以使用 `not` 关键字来检查：

```CSS
/* 默认图片样式 */
@container figure not style(--featured: true) {
    figcaption {
        font-size: 13px;
        padding: 4px 8px;
        background: lightgrey;
    }
}
```

### 样式查询用例

我们来看几个有关于样式查询的示例。

#### 基于上下文的样式

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ad2cb0f1f394e31bd88b16deb20782a~tplv-k3u1fbpfcp-zoom-1.image)

这是一个常见的用例，我们在相同的容器中使用了视觉上有差异的相同组件。例如侧边栏中的两个列表，一个包含了列表项数字，另一个则没有。

目前，我们可能会使用一个新的 CSS 类来处理样式，或者在列表组件自身上使用一个变体类。

```CSS
.most-popular {
    counter-reset: list;
}
​
.most-popular article {
    /* 自定义样式 */
}
```

或者，我们可以在 HTML 中使用 `data` 属性：

```CSS
.most-popular[data-counter="true"] {
    counter-reset: list;
}
​
.most-popular[data-counter="true"] .article {
    /* 自定义样式 */
}
```

使用 CSS 样式查询，我们可以向父元素添加一个 CSS 自定义属性，并相应地设置列表项组件的样式。

```HTML
<aside>
    <!-- 不带列表项符号的 列表组件 -->
    <div class="lists--container">
        <h3 class="section__title">Most Popular</h3>
        <ol class="articles__list">
            <li>Article title in here</li>
            <!-- 其他列表项 -->
        </ol>
    </div>
​
    <!-- 带列表项符号的 列表组件 -->
    <div class="lists--container" style="--has-marks: true">
        <h3 class="section__title">Related Articles</h3>
        <ol class="articles__list">
            <li>Article title in here</li>
            <!-- 其他列表项 -->
        </ol>
    </div>
</aside>
```

```CSS
@layer reset, base, components, variants;
​
@layer components {
    .lists--container {
        padding: 1rem;
        background-color: #fff;
        border: 1px solid #ccc;
        color: #333;
        border-radius: 8px;
        box-shadow: 0 0 0.125em 0.125em rgb(0 0 0 / 0.125);
    }
​
    .section__title {
        padding-bottom: 1rem;
        border-bottom: 3px double #ccc;
        margin-bottom: 1.5rem;
        font-size: clamp(1.25rem, 3cqi + 1.5rem, 1.625rem);
    }
​
    .articles__list {
        padding: 0;
        max-width: 300px;
    }
​
    .articles__list li {
        display: flex;
        align-items: center;
        padding: 12px 0;
        box-sizing: border-box;
    }
​
    .articles__list li + li {
        border-top: 1px dashed rgb(0 0 0 / 0.2);
    }
}
​
@layer variants {
    .lists--container {
        container-name: lists;
        --has-marks: true
    }
​
    @container lists style(--has-marks: true) {
        .articles__list {
            counter-reset: index;
        }
    
        .articles__list li {
            counter-increment: index;
        }
    
        .articles__list li::before {
            content: counters(index, ".", decimal-leading-zero);
            font-size: 1.5rem;
            text-align: right;
            font-weight: bold;
            min-width: 50px;
            padding-right: 12px;
            font-variant-numeric: tabular-nums;
            align-self: flex-start;
            background-image: linear-gradient(to bottom, aquamarine, orangered);
            background-attachment: fixed;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bec9a53920d4ea09bbcb772db0a941f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqqWgB>

#### 组件级主题切换

我们构建的一些组件需要基于特定条件应用不同的主题。在下面的示例中，我们有一个带有不同统计组件的仪表盘。基于包裹容器，我们需要切换组件的主题。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35e7a17975d3444c8f6cae26dc4f422b~tplv-k3u1fbpfcp-zoom-1.image)

Web 开发者往往都是使用一个特殊的类来改变组件的主题，例如给黑色主题组件的增加一个容器，并且为该容器指定一个类名 `.special--wrapper` ：

```CSS
.special--wrapper .stat {
    background-color: #122c46;
}
​
.special--wrapper .stat__icon {
    background-color: #2e547a;
}
​
.special--wrapper .stat__title {
    background-color: #b3cde7;
 }
```

上面的代码并没有错或不好，但它增加 CSS 选择器权重。让我们探索一下如何用样式查询实现上述功能。

首先，我们需要一个查询容器，并且在这个容器上使用 CSS 自定义属性定义一个开关，比如 `--theme: dark` 。然后，我们可以检查该开关是否存在，并相应地设置 `Stat` 组件的样式。当然，你还可以将自定义属性的值设置为 `true` 或 `false` 来做区别。例如：

-   `--theme-dark: false` 表示亮色主题
-   `--theme-dark: true` 表示暗色主题

我们可以在查询容器上使用 `style` 属性来设置这个开关：

```HTML
<div class="stat--container" style="--theme-dark: false"><!-- 亮色主题 -->
    <div class="stat">
        <h3 class="stat__title">Total deals</h3>
        <p class="stat__number">139</p>
        <div class="stat__icon"></div>
    </div>
</div>
​
<div class="stat--container" style="--theme-dark: true"><!-- 暗色主题 -->
    <div class="stat">
        <h3 class="stat__title">Total deals</h3>
        <p class="stat__number">139</p>
        <div class="stat__icon"></div>
    </div>
</div>
```

我们可以在 `--theme-dark: true` 下，将 `Stat` 组件的主题色从亮色系切换到暗色系：

```CSS
@layer reset, base, components,variants, layout,form;
​
@layer components {
    .stat {
        /* Stat 组件默认为亮色系 */
        --bg: #fff;
        --title-color: #333;
        --number-color: #1976D2;
        --icon-color: #E1EDF9;
        
        display: grid;
        grid-template-columns: minmax(0, 1fr) 64px;
        gap: 10px;
        grid-template-areas: 
            "title  icon"
            "number icon";
        background-color: var(--bg);
        border-radius: 4px;
        box-shadow: 0 0 0 rgb(0 0 0 / .25);
        padding: 1rem;  
        transition: all .2s linear;
    }
  
    .stat__title {
        color: var(--title-color);
        grid-area: title;
        font-size: 14px;
        font-weight: 300;
        align-self: end;
    }
  
    .stat__number {
        color: var(--number-color);
        font-size: clamp(1.25rem, 3cqi + 1.5rem, 2rem);
        grid-area: number;
        align-self: start;
    }
  
    .stat__icon {
        width: 64px;
        aspect-ratio: 1;
        border-radius: 50%;
        grid-area: icon;
        background-color: var(--icon-color);
        place-self: center;
    }
}
​
@layer variants {
    .stat--container {
        container-name: stat;
    }
  
    /** 
     * 使用样式查询，查询 Stat 组件容器 .stat--container 的 --theme-dark 的值是否为 true
     * 如果是 true, Stat 组件从亮色系切换到暗色系
    */
    @container stat style(--theme-dark: true) {
        .stat {
            /* Stat 组件暗色系 */
            --bg: #122C46;
            --title-color:#EDF0F3;
            --number-color: #B3CDE7;
            --icon-color: #2E547A;
        }
    }
}
​
@layer layout {
    .stat--container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100% - 2rem, 200px), 1fr));
        gap: 1rem;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5af4f710617d488f89634bc316487fe3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNYYYvL>

注意，这里显式设置 `--theme-dark` 为 `false` 和 `true` ，只是更便于理解：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb652e17e146437a9da6aecaeaffd88a~tplv-k3u1fbpfcp-zoom-1.image)

实际使用的时候，可以不需要这样，你只需要将 `--theme` 自定义属性（或者任何你喜欢的自定义属性）定义为 `light` 或 `dark` 即可。

```HTML
<main>
    <div class="stat--container" style="--theme: light"><!-- 亮色主题 -->
        <div class="stat">
            <h3 class="stat__title">Total deals</h3>
            <p class="stat__number">139</p>
            <div class="stat__icon"></div>
        </div>
    </div>
    
    <div class="stat--container" style="--theme: dark"><!-- 暗色主题 -->
        <div class="stat">
            <h3 class="stat__title">Total deals</h3>
            <p class="stat__number">139</p>
            <div class="stat__icon"></div>
        </div>
    </div>
</main>
```

```CSS
/* 默认亮色主题 */
.stat {
    /* 默认样式 */
}
​
.stat--container {
    container-name: stat;
}
​
@container stat style(--theme: dark) {
    /* 暗色主题样式 */
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d02fb565faca45138ced6e5df28f068d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOOOgy>

#### 卡片组件

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b04ffd90cd044f47b1c1dbda2e164ce1~tplv-k3u1fbpfcp-zoom-1.image)

上图这个卡片组件（`Card`），我们使用 CSS 容器查询的尺寸查询很容易就可以实现。

```HTML
<div class="card__container">
    <div class="card">
        <figure>
            <img src="" alt="" />
        </figure>
        <h3>Card Ttitle </h3>
        <p>Card Description</p>
    </div>
</div>
```

关键 CSS 代码：

```CSS
@layer reset, base, components,variants, layout;
​
@layer components {
    .card {
        background-color: #fff;
        color: #333;
        border-radius: 6px;
        height: 100%;
    }
​
    .card {
        display: grid;
        grid-template-rows: 300px min-content minmax(0, 1fr);
        grid-template-areas:
            "thumbnail"
            "title"
            "description";
        gap: 2cqh;
    }
​
    .card figure {
        grid-area: thumbnail;
    }
​
    .card h3 {
        grid-area: title;
    }
​
    .card p {
        grid-area: description;
    }
​
    .card figure {
        border-radius: 6px 6px 0 0;
        overflow: hidden;
    }
​
    .card > *:not(figure) {
        padding: 0 1rem;
    }
​
    .card h3 {
        font-size: clamp(1.25rem, 3cqw + 1.25rem, 1.5rem);
        font-weight: 900;
    }
​
    .card p {
        font-size: 95%;
        color: #999;
        padding-bottom: 1rem;
    }
}
​
@layer variants {
    .card__container {
        container-type: inline-size;
    }
​
    @container (width > 400px) {
        .card {
            grid-template-columns: 0.4fr minmax(0, 1fr) 1rem;
            grid-template-rows: 1rem min-content minmax(0, 1fr) 1rem;
            grid-template-areas:
                "thumbnail    .            ."
                "thumbnail    title        ."
                "thumbnail    description  ."
                "thumbnail    .            .";
             gap: 0.25rem 1rem;
        }
    
        .card figure {
            border-radius: 6px 0 0 6px;
        }
    
        .card > *:not(figure) {
            padding: 0;
        }
    }
​
    @container (width > 768px) {
        .card {
            grid-template-columns: auto;
            grid-template-rows: min-content auto auto min-content;
            grid-template-areas:
                "."
                "title"
                "description"
                ".";
        }
    
        .card figure {
            grid-area: 1 / 1 / -1 / -1;
            max-height: 380px;
            border-radius: 0;
            position: relative;
        }
    
        .card figure::after {
            content: "";
            background: darkorchid;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
            mix-blend-mode: screen;
        }
    
        .card > *:not(figure) {
            place-self: center;
            z-index: 2;
            text-shadow: 1px 0px 1px rgb(0 0 0 / 25%);
            text-align: center;
        }
    }
}
​
@layer layout {
    .featured {
        display: grid;
        padding: 1rem;
    }
​
    .featured .card__container {
        grid-area: 1 / 1 / -1 / -1;
    }
​
    .card--lists {
        display: grid;
        gap: 4cqw;
        padding: 1rem;
    }
​
    @media only screen and (min-width: 768px) {
        .card--lists {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 3cqw;
        }
    }
​
    @media only screen and (min-width: 1024px) {
        .card--lists {
            grid-template-columns: repeat(
                auto-fit,
                minmax(min(100% - 2rem, 420px), 1fr)
            );
        }
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da6f8daa5eaa41eb8afbfa9a4d4bdc0c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQQQvp>

我们在上面的示例基础上加入样式查询，比如：

```CSS
.card__container{
    container-type: inline-size;
    --horizontal: true;
    --featured: true;
}
​
@container (width > 400px) and style(--horizontal:true) {
    /* Horizontal Style */
}
​
@container (width > 768px) and style(--featured: true) {
    /* Featured Style */
}
```

卡片组件同时查询了容器尺寸大小和容器样式：

-   容器宽度大于 `400px` ，并且容器中的 `--horizontal` 为 `true` 时，卡片组件会有水平排列的样式；
-   容器宽度大于 `768px` ，并且容器中的 `--featured` 为 `true` 时，卡片组件会有 Featured 样式网格。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a313cbebeaa447bebc78537bf121bbb0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOOGxb>

如果你在 `.card__container` 中将 `--featured` 设置为 `false` ，你会发现卡片组件的 Featured 效果永远不会呈现，即使容器宽度大于 `768px` 也是如此：

```CSS
.card__container{
    container-type: inline-size;
    --horizontal: true;
    --featured: false;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0eb32f840a99437e9fcaf62b310846bb~tplv-k3u1fbpfcp-zoom-1.image)

#### 用户头像组

假设我们有一组用户头像，我们需要根据父元素上设置的 CSS 自定义属性对它们进行不同的布局。例如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2205d99ced7d44e8b6defa6fd6bc239b~tplv-k3u1fbpfcp-zoom-1.image)

```HTML
<div class="avatars__container">
    <ul class="avatars">
        <li class="avatar"><img src="" alt="" /></li>
        <!-- 省略其他 li -->
    </ul>
</div>
```

```CSS
.avatars__container {
  container-name: avatar;
}
​
.avatars {
    display: flex;
    flex-wrap: wrap;
}
​
/* Default Style */
@container avatar style(--appearance: default) {
    .avatars {
        gap: 1cqw;
        justify-content: space-evenly;
    }
  
    .avatar {
        --size: 3.5rem;
    }
}
​
/* Stack Style */
@container avatar style(--appearance: stack) {
    .avatar {
        --size: 4.25rem;
        border: 4px solid #fff;
        padding: .2rem;
    }
  
    .avatar + .avatar {
        margin-inline-start: -1rem;
    }
}
​
/* Grid Style */
@container avatar style(--appearance: grid) {
    .avatars {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
        gap: 5cqw;
    }
  
     .avatar {
         --size: 100%;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68a9ef090ec94ef88156d7be48cb9f34~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGGvNB>

#### RTL 布局：卡片组件

CSS 样式查询用于多语言 Web 应用或网站也是很适用的。比如下面这个卡片组件：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17a75975ec424246a2b87550bd4eee62~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwwPJL>

我们在 **[现代 Web 布局](https://s.juejin.cn/ds/iEFDtDh/)** 的《[22 | Web 中的向左向右：Flexbox 和 Grid 布局中的 LTR 与 RTL](https://juejin.cn/book/7161370789680250917/section/7161625525763440647)》和《[23 | Web 中的向左向右：Web 布局中 LTR 切换到 RTL 常见错误](https://juejin.cn/book/7161370789680250917/section/7161625415935590436)》有详细介绍过如何实现上图这样的多语言 Web 组件，所以这里就不再重复阐述。我们直接来看，有了样式查询之后，它是如何实现的？

先上 HTML 结构：

```HTML
<div class="card__container" dir="ltr" lang="zh-Hans">
    <div class="card">
        <h3>现代 Web 布局</h3>
        <p>现代 Web 布局中的最后一节课，下一代响应式 Web 设计中的容器响应，就是容器查询！</p>
        <span><svg t="1673340802729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2667" width="200" height="200"></svg></span>
    </div>
</div>
​
<div class="card__container" dir="rtl" lang="ar">
    <div class="card">
        <h3>تصميم Web الحديثة</h3>
        <p>الدرس الأخير في تصميم Web الحديثة، والجيل التالي من استجابة الحاويات في تصميم Web، هو البحث عن الحاويات!</p>
        <span><svg t="1673340802729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2667" width="200" height="200"></svg></span>
    </div>
 </div>
```

对于 LTR 的布局，我们可以这样写：

```CSS
.card {
    --bg-angle: to right;
    --bg: linear-gradient(var(--bg-angle), #5521c3, #5893eb);
    background: var(--bg, lightgrey);
    border-radius: 12px;
}
​
.card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) max-content;
    grid-template-areas:
        "title       icon"
        "description icon";
    gap: .5rem;
    padding: 18px;
}
​
.card h3 {
    grid-area: title;
    font-size: clamp(1.25rem, 5cqw + 1.5rem, 1.875rem);
}
​
.card p {
    grid-area: description;
}
​
.card span {
    grid-area: icon;
    place-self: center;
    font-size: 3rem;
}
​
.card svg {
    display: block;
    width: 1em;
    height: 2em;
}
```

RTL 和 LTR 不同之处是，渐变背景颜色刚好相反，另外 ICON 图标是带有方向性的，因此在 RTL 布局下，需要对其做一个水平镜像处理。我们使用样式查询来完成它：

```CSS
.card__container[dir="rtl"] {
    --dir: rtl;
    direction: var(--dir);
}
​
​
@container style(--dir: rtl) {
    .card {
        --bg-angle: to left; /* 改变渐变方向 */
    }
​
    svg {
        transform: scaleX(-1); /* 水平镜像 */
    }
}
```

就这样搞定。你可以想想，如果没有样式查询，会是如何实现？它们有什么样的差异？这两个问题的答案就留给大家自己去寻找和思考了！

## 状态查询

@Una Kravets 在 2023 年的 **[CSS Day](https://cssday.nl/2023)** 中分享了一个“[CSS 社区现状](https://cssday.nl/2023/speakers#una)”相关的话题，主题内容中就有 CSS 容器查询的状态查询相关的话题。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d00a1877e74048e9a6bfb9a054180319~tplv-k3u1fbpfcp-zoom-1.image)

事实上，CSS 的状态查询和 CSS 样式查询有点类似，我们主要使用 `state()` 函数来区分 CSS 容器查询中的尺寸查询和样式查询。例如：

```CSS
@container state(dir: rtl) {
    /* RTL 布局 */
}
```

不过大家需要知道的是，到目前为止，CSS 的状态查询还仅是 Chromium 团队正在试验的一种新的查询类型。

同样拿多语言 Web 布局为例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6181cb9578f44428abd4385adf762637~tplv-k3u1fbpfcp-zoom-1.image)

上图中的按钮带有一个箭头，但在多语言 Web 布局中， `ltr` 和 `rtl` 阅读模式下，该箭头需要做一个镜像处理。要是使用状态查询的话，我们可以这样写 CSS：

```CSS
@container state(dir: rtl) {
    .icon--arrow {
        transform: scaleX(-1);
    }
}
```

## 小结

结合[上一节所介绍的尺寸查询](https://juejin.cn/book/7223230325122400288/section/7259668032165773368)，我们现在知道了，CSS 容器查询有尺寸查询、样式查询和状态查询三种类型。它们可以帮助 Web 开发者更好的构建组件变体，真正使 Web 开发者开发的 Web 组件做到：**一次性构建，随地布署**。