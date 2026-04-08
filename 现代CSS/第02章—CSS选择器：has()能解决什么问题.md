[通过上一节课的学习](https://juejin.cn/book/7223230325122400288/section/7224404685615005728)，我想你已经知道了 `:has()` 选择器是什么以及它的一些高级用法。`:has()` 选择器的使用并不复杂，最为困难的部分在于我们要打开思维，看到它的可能性。在这节课中，我将通过一些真实的案例来告诉大家，`:has()` 选择器能解决什么问题？它能帮助你做哪些更有意思的事情？

## :has() 选择器能解决什么问题？

先来看案例一。我们平时在还原 UI 的时候，像下图这样的 UI 场景应该很常见：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea71faf1200746c0a180bea0c1f6ce77~tplv-k3u1fbpfcp-zoom-1.image)

就如上图中所展示的三组卡片，每组卡片之间输出的数据内容不同（DOM 也会不同），每组卡片会因为数据字段不同，UI 风格也会略有不同，甚至会有较大的 UI 风格差异。以往我们要实现这样的 UI 效果，需要在不同的元素上添加上不一样的类名。

就拿第一组来说吧，两张卡片相比，上面的卡片多了描述文本（它可能是一个 `<p>` 元素）和一组媒体信息（它可有是一个 `<ul>` ），但最终呈现给用户的 UI 风格来说，一张是竖排，另一张是横排。按以往开发模式，可能会在两个不同的卡片上添加不一样的类名：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f44f7a043d1941a39c2c461b9f465cc9~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，如果希望根据一个元素的存在与否来给一个特定的父级或元素设置不同的样式是不可能的。我们需要像上图那样添加额外的类名，并根据 UI 的需要来切换它们。就拿上图来说吧，它的 DOM 结构可能像下面这样：

```HTML
<!-- ①: 带有描述信息和媒体信息的卡片 --> 
<div class="card card—vertical"> 
    <div class="card__media"> 
        <div class="media__object"> 
            <img src="https://picsum.photos/400/400?random=2" alt="" class="media__thumb"> 
        </div> 
        <div class="media__content"> 
            <h3 class="media__title">Kenneth Erickson</h3> 
        </div> 
        <div class="media__action"> 
            <svg class="icon--more"></svg> 
        </div> 
     </div> 
     <div class="card__body"> 
         <p class="card__description">The word "coffee" entered the English language in 1582 via the Ddutch koffie</p> 
     </div> 
     <div class="card__footer"> 
         <ul class="card__social"> 
             <li> <svg class="icon--like"></svg> 783 Likes </li> 
             <li> <svg class="icon--comment"></svg> 67 Comments </li> 
         </ul> 
     </div> 
</div> 

<!-- ②: 带有子标题，没有描述和媒体信息  --> 
<div class="card card—horizontal"> 
    <div class="card__media"> 
        <div class="media__object"> 
            <img src="https://picsum.photos/400/400?random=2" alt="" class="media__thumb"> 
        </div> 
        <div class="media__content"> 
            <h3 class="media__title">Kenneth Erickson</h3> 
            <h5 class="media__subtitle">San Diego,CA</h5> 
        </div> 
        <div class="media__action"> 
            <svg class="icon--more"></svg> 
        </div> 
    </div> 
</div>
```

> 注意，[使用 CSS Grid 布局](https://juejin.cn/book/7161370789680250917?utm_source=profile_book)，示例所示的 HTML 结构可以更简洁些。

或许你会通过不同的类名来改变 Flexbox 的布局，比如：

```CSS
/* 默认水平排列，且垂直居中 */ 
.card { 
    display: flex; 
    align-items: center; 
} 

/* 在卡片 ① 上使用下面代码，将水平排列换成垂直排列 */ 
.card—vertical { 
    flex-direction: column; 
    align-items: flex-start; 
}
```

问题是，如果 CSS 自身已经具备条件判断，就不需要像上面那样额外添加类名了。那么，关系型伪类 `:has()` 在这样的场景之下就有用武之地了。

我们可以使用 `:has()` 来做一定的条件判断，如果 `.card` 元素中包含了 `p`元素或包含一个 `ul` 元素，我们就改变 Flexbox 的布局方式：

```CSS
.card { 
    display: flex; 
    align-items: center; 
} 

.card:has(p, ul) { 
    flex-direction: column; 
    align-items: flex-start; 
}
```

当然，你也可以使用相关的类选择器：

```CSS
.card:has(.card__description, .card__social) { 
    flex-direction: column; 
    align-items: flex-start; 
}
```

这个示例中，卡片 ② 中是没有任何元素命名类名为 `.card__description` 或 `.card__social`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db55ce6b43884531bddd8b9a01697f7d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNaoPqQ>

示例使用 `:has()` 的选择器的代码：

```CSS
.card:has(p, ul) { 
    flex-direction: column; 
    align-items: flex-start; 
} 

.card:has(p, ul) .media__object { 
    width: 32px; 
} 

.card__media:not(:has(.media__subtitle)) { 
    font-size: 12px; 
} 

.card__media:not(:has(.media__subtitle)) .icon--more { 
    font-size: 24px; 
} 

@supports not selector(:has(works)) { 
    .card { 
        flex-direction: column; 
        align-items: flex-start; 
    } 
} 
```

再来看一个有关于表单方面的示例。比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6e68878a0034827bf272b0a1b399dcc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/smashingmag/full/BaWPqqO>

为了能给用户一个更好的体验，在填写表单内容时，通过一个指示器或其他 UI 表达信息，来告诉用户完成度和正确度。比如上图的效果，只有用户填写完成，并且符合要求，表单按钮（“SIGN IN”)才高亮可点。以往仅用 CSS 是无法实现这样的 UI 效果（交互效果），需要借助 JavaScript 来处理。不过有了关系型选择器 `:has()` 之后，我们可以根据表单验证相关的伪类选择器，比如 `:valid` 、 `:invalid` 和 `:checked` 等实现上图的效果。

我想通过这两个简单示例告诉大家的是： **关系型伪类选择器** **`:has()`** **可以不再需要因为内容、状态、有效性等添加额外的类名**，**或借助 JavaScript 脚本来实现具有差异性的 UI 表达**。

换句话说，关系型伪类选择器 `:has()` 可以有条件地让 UI 具有差异化表达能力。比如说，根据动态的内容、状态的切换等调整 UI 效果，让你的 UI 更具扩展性和灵活性。

## :has() 选择器潜在用例

`:has()` 选择器允许你根据 UI 组件的子元素的内容、状态，或其在 DOM 树中的后续元素等有条件地应用样式。它也可以扩展现有选择器的范围，改善 CSS 的质量和健壮性，并减少使用 JavaScript 为这些用例应用样式和 CSS 类的需求。

简单地说，你现在或将来可以使用 `:has()` 实现很多以往需要依赖添加类和 JavaScript 脚本才能实现的 Web 效果，包括交互效果。

我们可以细分一下 `:has()` 的使用场景，大致可以分为：

*   基于内容的变化
*   基于状态的变化
*   基于验证的变化

### 基于内容的变化

很多时候，Web 组件会因为呈现不同的内容（数据字段）有很多种变体，即 Web 组件的 UI 风格会因内容有多种变化。比如下图中所展示的场景，我想你并不陌生：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3e20ee0861b4d17b1a958653e602523~tplv-k3u1fbpfcp-zoom-1.image)

很明显能够看到，上图中各组 UI 的效果或布局，都会因内容的不同而有所差异。

就以往而言（还没有 `:has()` 选择器），要实现这样的效果，通常会在不同的容器上创建多个类名来覆盖有可能的变化，并根据不同的方法和技术栈，手动或依赖 JavaScript 脚本来应用它们。比如前面所介绍的卡片组件，分别使用了两个不同的类名 `.card—vertical` 和 `.card—horizontal`  。有了关系型选择器 `:has()`，你就可以直接在 CSS 中对内容（其实就是 HTML 元素）进行检测，样式就会自动应用，比如上图中的第一组，购物列表页会因为有无清单，展示不同的效果。这将减少变化的 CSS 类的数量，减少人为造成错误的可能性，而且选择器将通过条件检测进行自我记录。

我们一起来使用 `:has()` 选择写几个真实的案例。先来实现上图中的第 ① 组，即**购物车列表页**：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59b2c4626fa0413a9693d9905e2c60aa~tplv-k3u1fbpfcp-zoom-1.image)

在电商类的 App 中，上图这样的页面效果非常常见。同是购物车列表页，因为内容不同而展示两种不同的效果。它有可能对应的两种 HTML 结构如下：

```HTML
<!-- 无购物清单，默认状态 -->
<div class="shopping--cart">
    <header>
        <img src="./pngwave.png" class="shopping__logo">
    </header>
    <h3 class="shopping__title">Your cart</h3>
    <main>
        <div class="shopping__nothing">
            <svg></svg>
        </div>
        <button class="shopping__button">Add to cart</button>
    </main>
</div>

<!-- 有购物清单 -->
<div class="shopping--cart">
    <header>
        <img src="./pngwave.png" class="shopping__logo">
    </header>
    <h3 class="shopping__title">Your cart</h3>
    <main>
        <ul class="shopping__lists">
            <li class="shopping__item">
                <div class="shopping__object">
                    <img src="./removebg-preview.png" class="image">
                </div>
                <div class="shopping__content">
                    <h4 class="shopping__name">Nike Air Zoom Pegasus 36</h4>
                    <p class="shopping__price">$108.97</p>
                    <div class="shopping__count">
                        <button class="button__decrease">
                            <svg></svg>
                        </button>
                        <span class="shopping__num">2</span>
                        <button class="button__increase">
                            <svg></svg>
                        </button>
                    </div>
                </div>
            </li>
            <!-- 省略其它 li -->
        </ul>
    </main>
</div>
```

拿页面布局举例。在没有购物列表（`.shopping__lists`）时，页面主内容水平垂直居中：

```CSS
main { 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
}
```

当页面有购物清单时，即 `main` 元素中含有 `.shopping__lists` ，需要对 `main` 元素覆盖 Flexbox 的布局：

```CSS
main:has(.shopping__lists) { 
    align-items: flex-start; 
    flex-direction: row; 
    min-height: 0; 
} 
```

当然，你也可以反过来。`main` 默认布局是有购物清单：

```CSS
main {
    display: flex;
    min-height: 0;
    
    /* 下面两行可以不显式写，因为它们都是默认值 */
    flex-direction: row;
    align-items: flex-start;
}
```

反则，没有购物清单时，使用 `:has()` 选择器重置 `main` 的布局样式：

```CSS
main:has(.shopping__nothing + button) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
```

最终你看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8901ce41784f45799aabd169f4332990~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdzOZLy>

接着来看一个关于**标题栏和导航栏**的示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/052117eb9a6b4bf8978b893ac2232b34~tplv-k3u1fbpfcp-zoom-1.image)

就拿最为常见的 H5 页面的导航栏为例吧。上图中四种不同类型的导航栏，对应的 HTML 结构可能会像下面这样：

```HTML
<!-- 只带标题的导航栏 -->
<header>
    <h1 class="page__title">猜你喜欢</h1>
</header>

<!-- 带返回图标 + 标题的导航栏 -->
<header>
    <button class="button--back"><svg class="icon--back icon"></svg></button>
    <h1 class="page__title">精选主题</h1>
</header>

<!-- 带返回图标 + 标题 + 更多图标的导航栏 -->
<header>
    <button class="butto--back"><svg class="icon--back icon"></svg></button>
    <h1 class="page__title">天天特卖</h1>
    <button class="button--more"><svg class="icon--more icon"></svg></button>
</header>

<!-- 带返回按钮 + 标题 + 一组图标的导航栏 -->
<header>
    <button class="butto--back"><svg class="icon--back icon"></svg></button>
    <h1 class="page__title">聚划算百亿补贴</h1>
    <div class="header__buttons">
        <button class="button--service"><svg class="icon--service icon"></svg></button>
        <button class="button--more"><svg class="icon--more icon"></svg></button>
    </div>
</header>
```

使用 `:has()` 可以很容易实现四种差异化的导航栏效果：

```CSS
/* 默认：只带标题的导航栏 */
header { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: #d1c3af; 
    background-color: #141414; 
    padding: 0 24px; 
    gap: 14px; 
} 

/* 带返回图标 + 标题的导航栏 */
header:has(button + h1) { 
    justify-content: flex-start; 
    background-image: linear-gradient(90deg, #d39f96 0%, #dfaa9b 100%); 
    color: #454545; 
} 

/* 带返回图标 + 标题 + 更多图标的导航栏 */
header:has(h1 + button) { 
    justify-content: space-between; 
    background-color: #e20200; color: #fff; 
} 

/* 带返回按钮 + 标题 + 一组图标的导航栏 */
header:has(h1 + .header__buttons) {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    background-image: linear-gradient(90deg, #fe4529 0%, #ff4e0a 100%);
    color: #fff;
}

header:has(h1 + .header__buttons) > button {
    grid-column: 1;
}

header:has(h1 + .header__buttons) > h1 {
    grid-column: 2;
}

header:has(h1 + .header__buttons) > div {
    grid-column: 3;
    justify-self: end;
}
```

从上往下，在 `:has()` 选择器传入不同的参数（选择器）来改变其对齐方式、背景和文本颜色：

*   `header:has(button + h1)` 将匹配 `button` 后紧跟有 `h1` 元素的 `header`，刚好符合第二个导航的 UI 效果
*   `header:has(h1 + button)` 将匹配 `h1` 后紧跟有 `button` 元素的 `header`，刚好符合第三个导航的 UI 效果
*   `header:has(h1 + .header__buttons)` 将匹配 `h1` 后紧跟有 `.header__buttons` 元素的 `header`，刚好符合第四个导航 UI 效果

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/216bacbf19784da08871197e9674a581~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoyWeMQ>

再来看一个卡片组件：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/955909dd7d79475687919a73b9d73767~tplv-k3u1fbpfcp-zoom-1.image)

同为一个卡片组件（`Card`），却因为输出的内容不同，而有五种变体，比如图片尺寸、文本尺寸和网格布局分布等差异。

```HTML
<!-- Card ① -->
<article>
    <figure>
        <img src="https://picsum.photos/800/800?random=2" alt="">
    </figure>
    <div class="article__content">
        <h2 class="article__title">
            <small>Featured news</small>
            Big news of the day with a featured title
        </h2>
    </div>
</article>

<!-- Card ② -->
<article>
    <figure>
        <img src="https://picsum.photos/800/800?random=3" alt="">
    </figure>
    <div class="article__content">
        <h2 class="article__title">
            <small>Local news</small>
            Really serious article title
        </h2>
        <p>Lorem ipsum dolor sit amet, ...</p>
    </div>
</article>

<!-- Card ③ -->
<article>
    <figure>
        <img src="https://picsum.photos/800/800?random=4" alt="">
        <figcaption>Photo by: John Doe</figcaption>
    </figure>
    <div class="article__content">
        <h2 class="article__title">
            <small>Local news</small>
            Another serious article title
        </h2>
        <p>Lorem ipsum ...</p>
    </div>
</article>

<!-- Card ④ -->
<article>
    <aside>
        <figure>
            <img src="https://picsum.photos/800/800?random=5" alt="">
        </figure>
        <div class="aside__content">
            <h2 class="article__title">
                <small>Image gallery</small>
                Adorable doggos of the week
            </h2>
        </div>
    </aside>
    <main>
        <h2><small>Local news</small>Article title without image</h2>
        <p>Lorem ipsum dolor ...</p>
        <p>Etiam tincidunt...</p>
    </main>
</article>

<!-- Card ⑤ -->
<article>
    <div class="article__content">
        <h2 class="article__title">
            <small>Local news</small>
            Another article title without image
        </h2>
        <p>Lorem ipsum dolor...</p>
    </div>
</article>
```

我们把卡片 ① 当作是默认的样式：

```CSS
article { 
    display: grid; 
    grid-template-columns: 50% auto; 
    grid-template-areas: "figure content"; 
    align-items: stretch; 
} 
```

它和其他几张卡片在信息表达上有一定的差异，它没有描述内容，比如 `<p>` 元素（根据你自己的 HTML 结构来定），而且它的内容区域垂直居中，可以将 `:not()` 和 `:has()` 结合起来使用：

```CSS
article:not(:has(p)) .article__content { 
    align-self: center; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/837dfd4c386149b6bcfe332c50de5f31~tplv-k3u1fbpfcp-zoom-1.image)

对于包含 `p` 元素的 `article` 重新使用 `grid-template-columns` 定义网格列轨道的值：

```CSS
article:has(p) { 
    grid-template-columns: 30% auto; 
}
```

而卡片 ③ 和其他卡片也有一个较为显著的信息差异，图片上多有一个描述信息，比如多一个 `figcaption` 元素，这样我们就可以针对包含 `figcaption` 元素卡片定义样式的差异：

```CSS
article:has(figcaption) figure { 
    position: relative; 
} 

article:has(figcaption) figcaption { 
    position: absolute; 
    left: 0; 
    right: 0; 
    bottom: 0; 
    z-index: 2; 
    color: #f5f5f5; 
    background: rgba(0, 0, 0, 0.6); 
    font-size: 0.75em; 
    padding: 1em 2em; 
    border-radius: 0 0 0 12px; 
    white-space: nowrap; 
    text-overflow: ellipsis; 
    overflow: hidden; 
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26472306fff4451699564df2defbaf40~tplv-k3u1fbpfcp-zoom-1.image)

卡片 ④ 和 卡片 ⑤，UI 上的特色较为明显：

*   卡片 ④ 是一个两栏的布局
*   卡片 ⑤ 没有缩略图

针对卡片 ④ 和 卡片 ⑤ ，我们可以像下面这样写样式：

```CSS
article:has(aside, main) { 
    background: transparent; 
    border-radius: 0; 
    box-shadow: none; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.5em; 
} 

article:has(aside, main) > * { 
    background: #f5f5f5; 
    border-radius: 12px; 
    box-shadow: 0 0 0.25em rgb(0 0 0 / 25%); 
} 

article:has(aside, main) figure, article:has(aside, main) img { 
    border-radius: 12px 12px 0 0; 
} 

article:has(aside, main) main { 
    padding: 1.5em 2em 2em; 
} 

article:not(:has(figure)) { 
    grid-template-columns: auto; 
    grid-template-areas: none; 
}
```

最终的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e7b0d3b6eea4e3abde0397c1daf4f78~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/vYVgrmp>

再来看一个卡片组件：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fe5f359c2a54ab0bca0bb6c2cb36a51~tplv-k3u1fbpfcp-zoom-1.image)

这三个卡片也有着明显差异：

*   卡片 ② 与卡片 ① 相比，卡片底部有三个 `button` ，并且两端对齐（卡片 ① 底部按钮是居左对齐）；
*   卡片 ③ 与卡片 ① 相比，卡片底部同样有三个 `button` ，并且两端对齐，但它没有缩略图；
*   卡片 ③ 与卡片 ② 相比，卡片仅没有缩略图，卡片主内容区域有圆角都带有圆角。

假设你构建上图卡片组件的 HTML 结构如下：

```HTML
<!-- Card  ① -->
<div class="card">
    <figure class="card__thumbnail">
        <img src="thumbnail.jpg" alt="Card Thumbnail" />
    </figure>
    <div class="card__content">
        <h3 class="card__title">Card Title</h3>
        <p class="card__description">Card Description</p>
        <div class="card__actions">
            <!-- 只有一个 button -->
            <button>View Recipe <svg class="icon icon--arrow"></svg></button>
        </div>
    </div>
</div>

<!-- Card  ② -->
<div class="card">
    <figure class="card__thumbnail">
        <img src="thumbnail.jpg" alt="Card Thumbnail" />
    </figure>
    <div class="card__content">
        <h3 class="card__title">Card Title</h3>
        <p class="card__description">Card Description</p>
        <div class="card__actions">
            <!-- 有三个 button -->
            <button><svg class="icon icon--love"></svg></button>
            <button><svg class="icon icon--share"></svg></button>
            <button><svg class="icon icon--more"></svg></button>
        </div>
    </div>
</div>

<!-- Card  ③ -->
<div class="card">
    <!-- 无缩略图 -->
    <div class="card__content">
        <h3 class="card__title">Card Title</h3>
        <p class="card__description">Card Description</p>
        <div class="card__actions">
            <!-- 有三个 button -->
            <button><svg class="icon icon--love"></svg></button>
            <button><svg class="icon icon--share"></svg></button>
            <button><svg class="icon icon--more"></svg></button>
        </div>
    </div>
</div>
```

为了让卡片好看一点，先给所有卡片添加一点基本样式：

```CSS
.card {
    --radius: 10px;
    --padding: 16px;
    display: flex;
    flex-direction: column;
}

.card__content {
    background-color: #fff;
    border-radius: 0 0 var(--radius) var(--radius);
}

.card figure {
    border-radius: var(--radius) var(--radius) 0 0;
    aspect-ratio: 16 / 9;
    overflow: hidden;
}

.card img {
    border-radius: var(--radius) var(--radius) 0 0;
}

.card__content {
    padding: var(--padding);
    display: flex;
    flex-direction: column;
    gap: 10px;
}
```

现在三张卡片看上去如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24ec992c1a7d41e88fdde7b48378dd0b~tplv-k3u1fbpfcp-zoom-1.image)

如果使用 `:has()` 选择器来区别这三张卡片，卡片 ③ 最好判断，只需要结合 `:not()` 选择器即可，比如 `.card:not(:has(figure))` 。

```CSS
.card:not(:has(figure)) {
    outline: 4px solid #09f;
    outline-offset: -2px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11bf63398a46418fb6ffd8dbae42b2d4~tplv-k3u1fbpfcp-zoom-1.image)

这样一来，你只需要重置卡片 ③ 的 `.card__content` 圆角即可，因为它没有缩略图，`.card__content` 四个角都应该有圆角，且与卡片 `.card` 的圆角半径相等：

```CSS
.card:not(:has(figure)) .card__content {
    border-radius: var(--radius);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa7a8c6e4fca4e74a49c4858ff8d0d7d~tplv-k3u1fbpfcp-zoom-1.image)

对于卡片 ② 和卡片 ① 而言，它们最大的差异就是 `.card__actions` 所包含的 `button` 数量。卡片 ① 的 `.card__actions` 中只有一个 `button` ，你可以考虑使用 `button:only-of-type` 来判断，即 `.card:has(button:only-of-type)` 或者 `.card:has(.card__actions):has(button:only-of-type)` ：

```CSS
.card:has(button:only-of-type){
    outline: 4px solid #f36;
    outline-offset: -2px;
}

.card:has(.card__actions):has(button:only-of-type) {
    outline-color: #09f;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18d1d5412c594182bd6f7ec3abd1908c~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
.card:has(.card__actions):has(button:only-of-type) button{
    display: inline-flex;
    gap: 6px;
    font-size: 12px;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b97b2287a804b578f4c47777564b45f~tplv-k3u1fbpfcp-zoom-1.image)

就我们这个示例而言，如果你仅要选中卡片 ① 中的 `button` ，并对它应用 CSS 样式，你还可以使用[上一节课所介绍知识，即 :not() 和 :has() 选择器组合在一起来模拟 :only-of-selector 功能](https://juejin.cn/book/7223230325122400288/section/7224404685615005728)：

```CSS
button:not(:has(~ button)):not(button ~  *) {
    color: red;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a941f360e70468dbd6247f1248a6e61~tplv-k3u1fbpfcp-zoom-1.image)

需要注意的是，你希望使用 `button:not(:has(~ button)):not(button ~  *)` 选择器重新作为 `:has()` 选择器参数，用来选中卡片 ① 则是无效的：

```CSS
/* 无效 CSS */
.card:has(button:not(:has(~ button)):not(button ~  *)){
    outline: 3px solid red;
}
```

这是因为，**CSS 的** **`:has()`** **选择器中不能嵌套** **`:has()`** **选择器**。换句话说，如果你把卡片 ② 作为默认卡片，那么分别使用：

*   `.card:has(button:only-of-type)` 或 `.card:has(.card__actions):has(button:only-of-type)` 来选择卡片 ①
*   `.card:not(:has(figure))` 来选择卡片 ③

如此一来，只需要将卡片 ② 设置默认样式，然后卡片  ① 和卡片 ③ 分别调整样式即可：

```CSS
.card__actions {
    display: flex;
    align-items: center;
    gap: 6px;
}

.card__actions button {
    width: 32px;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    font-size: 18px;
    cursor: pointer;
}

.card__actions button:last-of-type {
    margin-left: auto;
}

/* Card  ① */
.card:has(.card__actions):has(button:only-of-type) button{
    display: inline-flex;
    gap: 6px;
    font-size: 12px;
    width: max-content;
    margin-left: unset;
    aspect-ratio: unset;
}

/* 等同于 .card:has(.card__actions):has(button:only-of-type) button */
button:not(:has(~ button)):not(button ~  *) {
    display: inline-flex;
    gap: 6px;
    font-size: 12px;
    width: max-content;
    margin-left: unset;
    aspect-ratio: unset;
}

/* 选中  Card  ③ */
.card:not(:has(figure)) .card__content {
    border-radius: var(--radius);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97ec1038bc424831905a59132acb5337~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abRpKaW>

事实上，我们还可以换过一种姿势来做。使用 `:has()` 根据父元素的子元素数量来匹配相关的元素，即对卡片的 `.card__actions` 中的 `.button` 数量进行判断，然后找到匹配的元素设置样式。比如，`.card__actions` 正好包含三个 `button` 元素：

```CSS
.card__actions:has(> :nth-child(3):last-child) {
    outline: 3px solid plum;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6640d1a793014f54be0569383b4c6521~tplv-k3u1fbpfcp-zoom-1.image)

也就是说，我们可以把 卡片  ① 作为默认卡片样式，然后再对 卡片  ② 和卡片 ③ 的 `.card__actions` 做额外的样式处理：

```CSS
.card__actions:has(> :nth-child(3):last-child) {
    display: flex;
    align-items: center;
    gap: 6px;
}

.card__actions:has(> :nth-child(3):last-child) button{
    width: 32px;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    font-size: 18px;
    cursor: pointer;
}

.card__actions:has(> :nth-child(3):last-child) button:last-of-type {
    margin-left: auto;
}

/* Card  ① */
button:not(:has(~ button)):not(button ~  *) {
    display: inline-flex;
    gap: 6px;
    font-size: 12px;
}

/* 选中  Card  ③ */
.card:not(:has(figure)) .card__content {
    border-radius: var(--radius);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a4cbe4029c74fe2ae692454d29feeaa~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOBgjXY>

上面这个示例，只想起一个抛砖引玉的作用。在一些社交媒体（比如微信朋友圈、微博等）分享图片，希望发布 `1 ~ 9` 张图片时，可以使其布局方式不一样，让具有不同数量图片的分享有一个更好的展现方式，比如：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/662b09ac6b1c4b64a95bb7c6799c4237~tplv-k3u1fbpfcp-zoom-1.image)

从设计效果中我们可以发现，我们把图片容器用 `12` 列网格的形式来描述，并且：

*   一张图片时，图片宽度等于容器宽度，跨 `12` 列网格；
*   两张图片时，每张图片宽度跨 `6` 列网格；
*   三张图片时，每张图片宽度跨 `4` 列网格；
*   四张图片时，第四张图片（最后一张图片）宽度跨 `12` 列网格，其他每张图片跨 `4` 列网格；
*   五张图片时，最后两张图片宽度跨 `6` 列网格，其他每张图片跨 `4` 列网格；
*   六张图片时，表现形式和三张图片相同，每张图片宽度跨 `4` 列网格；
*   七张图片时，表现形式和四张图片相同，最后一张图片宽度跨 `12` 列网格，其他图片跨 `4` 列网格；
*   八张图片时，表现形式和五张图片相同，最后两张图片宽度跨 `6` 列网格，其他图片跨 `4` 列网格；
*   九张图片时，表现表式和三张图片、六张图片相同，每张图片宽度跨 `4` 列网格。

只不过，很多类似微信这样的社交 App 在分享图片时，并没有进行优化（不像上面设计图这样的效果），你看到的效果可能像下图：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fbbcff7a3474770ac3ababb45c16cb6~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，上图摘取于微信朋友圈分享图片时的效果。

时至今日，我们完全可以对这样的设计效果进行优化，就如前面设计图所示效果那样。要是使用 CSS Grid 来构建布局效果会显得更容易，只需要创建一个  `12` 列网格布局：

```CSS
.figures { 
    display: grid; 
    grid-template-columns: repeat(12, 1fr); 
    gap: 10px; 
    grid-auto-flow: row; 
} 

.media__content figure {
    grid-column: span 4;
}
```

默认你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d2b22b56e31400a8b511d73b9db49fa~tplv-k3u1fbpfcp-zoom-1.image)

上图效果并不是我们预期的，在没有 `:has()` 选择器之前，需要使用添加额外的类名，比如 `.figures--1` 到 `.figures--9` 之类的类名，或者其他你自己喜欢的类名。不过，这里想借用该效果来进一步阐述 `:has()` 选择器的使用和作用。因此，该示例并不会添加额外的类名来实现，我们将会采用 `:has()` 选择器和 CSS 结构伪类选择器 `:nth-child` 和 `:last-child` 组合完成。

为什么要使用结构性伪类选择器呢？前面提到，我们可以使用下面这样的选择器对 DOM 的元素数量进行查询，比如：

*   `li:nth-child(1):last-child`，它的意思是，`li` 既是 `ul` 第一个子元素，又是 `ul` 的最后一个子元素，即表示 `ul` 只有一个li子元素
*   `li:nth-child(2):last-child`，它的意思和 `li:nth-child(1):last-child` 相似，表示的是 `li` 是`ul` 的第二个子元素，也是它的最后一个子元素，即表示 `ul` 包含了两个 `li`

按照类似方式，我们就可以查询出朋友圈中分享的时候，分享了几张图片。假设我们的 Demo 结构像下面这样：

```HTML
<!--     一张图     -->
<div class="media">
    <figure class="media__object">
        <img src="https://assets.codepen.io/1061/internal/avatars/users/default.png?format=auto&version=1&width=80&height=80" alt="">
    </figure>
    <div class="media__body">
        <h3>大漠</h3>
        <div class="media__content">
            <figure>
                <img src="https://picsum.photos/800/600?random=4" alt="">
            </figure>
         </div>
    </div>
</div>

<!--     两张图     -->
<div class="media">
    <figure class="media__object">
        <img src="https://assets.codepen.io/1061/internal/avatars/users/default.png?format=auto&version=1&width=80&height=80" alt="">
    </figure>
    <div class="media__body">
        <h3>大漠</h3>
        <div class="media__content">
            <figure>
                <img src="https://picsum.photos/800/600?random=4" alt="">
            </figure>
            <figure>
                <img src="https://picsum.photos/800/600?random=2" alt="">
            </figure>
        </div>
    </div>
</div>
        
<!--     三张图     -->
<div class="media">
    <figure class="media__object">
        <img src="https://assets.codepen.io/1061/internal/avatars/users/default.png?format=auto&version=1&width=80&height=80" alt="">
    </figure>
    <div class="media__body">
        <h3>大漠</h3>
        <div class="media__content">
            <figure>
                <img src="https://picsum.photos/800/600?random=4" alt="">
            </figure>
            <figure>
                <img src="https://picsum.photos/800/600?random=2" alt="">
            </figure>
            <figure>
                <img src="https://picsum.photos/800/600?random=3" alt="">
            </figure>
        </div>
    </div>
</div>
<!-- 依此类推 -->        
```

那么我们就可以使用 `.media__content figure:nth-child(1):last-child` 来查询出 `.media__content` 中有几个 `figure` 元素，也就可以查询出 `.media__content` 容器中呈现的图片数量。

更为有意思的是，我们这个示例较为特殊，从 `1` 张到 `9` 张，我们可以用更为简单的结构伪类选择器来表示，比如 `.media__content figure:nth-child(3n):last-child`、 `.media__content figure:nth-child(3n + 1):last-child` 和 `.media__content figure:nth-child(3n + 2):last-child`。示例中的图片数量始终等于 `3n`、 `3n + 1` 或 `3n + 2`：

*   容器中分别有三张、六张和九张图时，相当于 `3n` ；
*   容器中分别有一张、四张和七张图时，相当于 `3n + 1` ；
*   容器中分别有两张和八张图时，相当于 `3n + 2` 。

注意，在 CSS 结构伪类选择器 `:nth-child()` （或 `:nth-of-type()`） 中的 `n` 是从 `0` 开始索引。

在此基础上，结合 `:has()` 关系选择器，事情就简单多了：

*   `.media__content:has(figure:nth-child(3n):last-child)` 可以匹配到包含 `3`、`6` 和 `9` 个 `figure` 元素的 `.media__content`
*   `.media__content:has(figure:nth-child(3n + 1):last-child)` 可以匹配到包含 `1`、`4` 和 `7` 个 `figure` 元素的 `.media__content`
*   `.media__content:has(figure:nth-child(3n + 2):last-child)` 可以匹配到包含 `2` 、`5` 和 `8` 个 `figure` 元素的 `.media__content`

这样一来，`1 ~ 9` 都能匹配上了。选中了相应元素之后，只需要调整图片跨列的网格列数，在 CSS Grid 布局中，可以使用 `span` 关键词来实现：

```CSS
/* 创建12列网格，每列宽度是一个 fr 单位，间距是 5px */
.media__content {
    display: grid;
    grid-template-columns: repeat(12, 1fr); 
    gap: 5px; 
    grid-auto-flow: row; 
}

/* 默认图片宽度跨 4 列 */ 
.media__content figure { 
    grid-column-end: span 4; 
} 

/* 图片宽高比默认是 1:1 */ 
.media__content img { 
    aspect-ratio: 1; 
}

/* 图片容器中分别包含 3、 6 和 9 张图片时，图片宽度跨四列，和默认状态相同 */
.media__content:has(figure:nth-child(3n):last-child) figure {
    grid-column-end: span 4;
}

/* 图片容器中分别包含 3、 6 和 9 张图片时，图片宽高比是 1:1，和默认状态相同 */
.media__content:has(figure:nth-child(3n):last-child) img {
    aspect-ratio: 1;
}

/* 图片容器中分别包含 1、 4 和 7 张图片时，图片宽度跨四列，和默认状态相同 */
.media__content:has(figure:nth-child(3n + 1):last-child) figure {
    grid-column-end: span 4;
}

/* 图片容器中分别包含 1、 4 和 7 张图片时，图片宽度跨四列，和默认状态相同 */
.media__content:has(figure:nth-child(3n + 1):last-child) img {
    aspect-ratio: 1;
}

/* 图片容器中分别包含 1、 4 和 7 张图片时，最后一张图片宽度跨 12 列 */
.media__content:has(figure:nth-child(3n + 1):last-child) figure:last-child {
    grid-column-end: span 12;
}

/* 图片容器中分别包含 1、 4 和 7 张图片时，最后一张图片宽高比 16:9 */
.media__content:has(figure:nth-child(3n + 1):last-child) figure:last-child img {
    aspect-ratio: 16 / 9;
}

/* 图片容器中分别包含 2、 5 和 8 张图片时，图片宽度跨四列，和默认状态相同 */ 
.media__content:has(figure:nth-child(3n + 2):last-child) figure {
    grid-column-end: span 4;
}

/* 图片容器中分别包含 2、 5 和 8 张图片时，图片宽高比是 1:1 */ 
.media__content:has(figure:nth-child(3n + 2):last-child) img {
    aspect-ratio: 1;
}

/* 图片容器中分别包含 2、 5 和 8 张图片时，最后两张图片宽度跨6列 */ 
.media__content:has(figure:nth-child(3n + 2):last-child) figure:nth-last-child(1),
.media__content:has(figure:nth-child(3n + 2):last-child) figure:nth-last-child(2) {
    grid-column-end: span 6;
}

/* 图片容器中分别包含 2、 5 和 8 张图片时，最后两张图片宽高比是 4:3 */ 
.media__content:has(figure:nth-child(3n + 2):last-child) figure:nth-last-child(1) img,
.media__content:has(figure:nth-child(3n + 2):last-child) figure:nth-last-child(2) img {
    aspect-ratio: 4 / 3;
}
```

这样处理之后的效果，才是你所期望的一个效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7a9ba44c2ba4025a00081de5958e4e6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRgxaj>

上面的示例都是针对有内容的情景所做的，但我们在开发 Web 应用的时候，总有一些元素是没有内容的，或者说服务端由于某些原因未输出相应的数据（DOM 元素的内容为空）。以往为了避免空元素引起 UI 的不协调或者为了避免应用在空元素上的样式影响 Web UI 的美观，我们可以使用 `:empty` 或 `:blank` 将空元素进行隐藏：

```CSS
.alert:empty {
    display: none;
}
```

在这个例子中，使用 `:empty` 伪类来选择没有子元素（包括文本节点）的 `.alert` 元素，并使用 `display:none` 规则来隐藏它们。

```HTML
<!-- 可见 -->
<div class="alert">Alert Text</div>

<!-- 不可见 -->
<div class="alert"></div>
```

> 注意，这里的空元素不能够有任何空格字符串。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f98df22efa034099b43fa6f6a815fd16~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxpxgX>

假设我们的 HTML 看起来像下面这样：

```HTML
<div class="container">
    <h4>Suggestions</h4>
    <div class="results"><!-- 需要动态往这里添加结果 --></div>
</div>
```

就像是一个 ToDoList，需要往 `.results` 中动态添加内容。而且我们希望在 `.results` 为空时隐藏整个 `.container`（因为容器本身永远不会为空）。对于这种情况，我们可以将 `:empty` 伪类与 `:has()` 结合使用，来隐藏任何具有空的 `.results` 的 `.container` ：

```HTML
<!-- 可见 -->
<div class="container">
    <h4>Suggestions</h4>
    <div class="results">
        <div>Result 1</div>
        <div>Result 2</div>
        <div>...</div>
    </div>
</div>

<!-- 不可见 -->
<div class="container">
    <h4>Suggestions</h4>
    <div class="results"></div>
</div>
.container:has(.results:empty) {
    display: none;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88b2e563f23d464fb5c068aaa45c9bd5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEPEXy>

同样地，您可以选择基于是否包含特定子元素（例如 `.result`）来隐藏一个容器。假设我们的标记看起来像这样：

```HTML
<div class="container">
    <h4>Suggestions</h4>
    <div class="result">...</div>
    <div class="result">...</div>
    <div class="result">...</div>
</div>
```

对于这种情况，我们可以将 `:not()` 与 `:has()`结合使用，以便在 `.container` 不包含任何 `.result` 元素时隐藏它：

```CSS
.container:not(.container:has(.result)) {
    display: none;
}
<!-- 可见 -->
<div class="container">
    <h4>Suggestions</h4>
    <div class="result">Result 1</div>
    <div class="result">Result 2</div>
    <div class="result">...</div>
</div>

<!-- 不可见 -->
<div class="container">
    <h4>Suggestions</h4>
</div>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c80efee50314f6385e43471f7f1b1d7~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvYgYEO>

在这里，我们首先选择所有的 `.container` 元素，然后使用 `:not()` 从该列表中排除元素，以及排除所有包含 `.result` 的 `.container` 元素。剩下的是任何不包含 `.result的.container` ，我们使用 `display:none` 来隐藏它。

最后再来看一个间距设置相关的示例。记得在[介绍防御式 CSS](https://juejin.cn/book/7199571709102391328?utm_source=profile_book) 的时候，曾经有过一个关于[元素之间间距设置](https://juejin.cn/book/7199571709102391328/section/7199845459563642913)相关的示例，就用到了 CSS 的 `:has()` 选择器：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15f31f8b21474342b3d5bacf41d9cca3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/oNaBaVE>

通过 `:has()` 选择器来做判断，当它有 Icon 图标时，通过 `:has(svg)` 选择器给 `.card__heading` 设置 `gap` 值，如果没有，则让 `gap` 的值为 `0` （即不设置间距）：

```CSS
/* CSS Flexbox Layout */
.card__heading {
    display: flex;
    align-items: center;
    gap: 0;
}

.card__heading:has(svg) {
    gap: 20px;
}

/* CSS Grid Layout */
.card__heading {
    display: grid;
    align-items: center;
    gap: 0;
}

.card__heading:has(svg) {
    gap: 20px;
}
```

很多时候，`:has()` 用于[多语言 Web 应用或网站的排版](https://juejin.cn/book/7161370789680250917/section/7161625525763440647)也是非常有用的。比如下面这个示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad7dbae4c97c40dfba5a0c28eddba50f~tplv-k3u1fbpfcp-zoom-1.image)

如今，CSS 有很多种技术可以实现上图的 UI 效果，比如在[防御式 CSS ](https://juejin.cn/book/7199571709102391328?utm_source=profile_book)中就曾介绍过，[使用 CSS 的样式查询](https://juejin.cn/book/7199571709102391328/section/7199845944760729632)可以很轻易的实现。

```CSS
.card__container[dir="rtl"] {
    --dir: rtl;
    direction: var(--dir);
}


@container style(--dir: rtl) {
    .card {
        --bg-angle: to left; /* 改变渐变方向 */
    }

    svg {
        transform: scaleX(-1); /* 水平镜像 */
    }
}
```

> Demo 地址：<https://codepen.io/airen/full/LYJwWGZ（请使用> Chrome Canary 查看 ）

在这里，我们将使用 CSS 的 `:has()` 和 `:lang()` 或 `:dir()` 的组合来实现上图的效果，你可能需要下面这样的 HTML 结构：

```HTML
<div class="card__container" dir="ltr" lang="zh-Hans">
    <div class="card">
        <h3>现代 Web 布局</h3>
        <p>现代 Web 布局中的最后一节课，下一代响应式 Web 设计中的容器响应，就是容器查询！</p>
        <span><svg t="1673340802729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2667" width="200" height="200"></svg></span>
    </div>
</div>

<div class="card__container" dir="rtl" lang="ar">
    <div class="card">
        <h3>تصميم Web الحديثة</h3>
        <p>الدرس الأخير في تصميم Web الحديثة، والجيل التالي من استجابة الحاويات في تصميم Web، هو البحث عن الحاويات!</p>
        <span><svg t="1673340802729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2667" width="200" height="200"></svg></span>
    </div>
 </div>
```

基础性的 CSS 代码如下：

```CSS
.card {
    --bg-angle: to right;
    --bg: linear-gradient(var(--bg-angle), #5521c3, #5893eb);
    background: var(--bg, lightgrey);
    border-radius: 12px;
}

.card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) max-content;
    grid-template-areas:
        "title       icon"
        "description icon";
    gap: .5rem;
    padding: 18px;
}

.card h3 {
    grid-area: title;
    font-size: clamp(1.25rem, 5cqw + 1.5rem, 1.875rem);
}

.card p {
    grid-area: description;
}

.card span {
    grid-area: icon;
    place-self: center;
    font-size: 3rem;
}

.card svg {
    display: block;
    width: 1em;
    height: 2em;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09cbf3ab2c1843ff82a28f4b0591263c~tplv-k3u1fbpfcp-zoom-1.image)

正如你所看到的，我们还需要针对 RTL 阅读模式下的 UI 进行调整，比如改变渐变和箭头 Icon 的方向。此时，我们就可以使用 `:has()` 和 `:lang()` 的组合或 `:has()` 和 `:dir()` 的组合选中目标元素，并相应地调整其样式规则：

```CSS
.card:has(:lang(ar)) {
    --dir: rtl;
    direction: var(--dir);
    --bg-angle: to left;
}

.card:has(:lang(ar)) svg{
    transform: scaleX(-1);
}
```

或者：

```CSS
.card:has(:dir(rtl)) {
    --dir: rtl;
    direction: var(--dir);
    --bg-angle: to left;
}

.card:has(:dir(rtl)) svg{
    transform: scaleX(-1);
}
```

注意，上面所列这两种方式都能实现我们所需要的 UI 效果，只不过 `:dir()` 和 `:has()` 组合时，由于 `:dir()` 的兼容性还不是很好，它只有在 Safari 或 Firefox 浏览器下才能看到所需要的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34446707bafe4239b04b2140bd47c624~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoypYRd>

### 基于状态的变化

在 CSS 选择器中有一种状态伪类选择器，比如早期：

*   用于 `<a>` 元素的 `:hover`、`:focus`、`:active` 和 `:visited` 等；
*   用于表单控件的 `:focus`、`:checked` 和 `:disabled` 等。

除了上述这些状态伪类选择器之外， CSS 还新增了用于焦点管理的状态伪类选择器，比如 `:focus-within`、`:focus-visible` 和锚点伪类选择器 `:target`。其中 `:focus-within` 可以利用焦点元素在获得焦点状态时改变其父元素（或祖先元素）的样式，看上去有点像关系型伪类选择器 `:has()`。

如果我们把关系型伪类选择器 `:has()` 和这些状态伪类选择器结合起来使用，会让你在 UI 的交互和展示上得到一些意想不到的效果。比如下面这些场景。

先来看一个表单控件联动的交互效果，让我们设置一个需要选中复选框才能提交表单的表单。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d113d8d5f8d445ee89cab97c817b5bd3~tplv-k3u1fbpfcp-zoom-1.image)

我们可以将 `:has()` 选择器和 `input:checked` 状态选择器组合在一起来使用，然后根据 `input` 的状态（选中或未选中）来设置按钮的样式和状态：

```CSS
/* 按钮禁用状态下 UI */
.button {
    --button-color: hsl(0, 0%, 90%);
    --button-text-color: hsl(0, 0%, 50%);
    cursor: not-allowed;
}

/* 按钮可用状态下 UI */
form:has(input[type="checkbox"]:checked) .button {
    --button-color: var(--color-primary);
    --button-text-color: rgb(0, 25, 80);
    cursor: pointer;
}

form:has(input[type="checkbox"]:checked) .button:hover {
    --button-text-color: rgb(0, 25, 80);
    --button-color: #2eec96e3;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28739577df3b4c08b1eed72011a99b43~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRMBde>

你可能已经发现了，示例中即使 `input` 输入框未输入有效数据，只需要复选框选中之后，按钮就呈可用状态。虽然在一定的程度上给了用户明显的信息反馈，但我们可以做得更好一些。比如，我们需要表单输入的信息有效，并且用户勾选了筛选框之后，按钮才变得可用，那不是很酷吗？具体如何实现，这里暂且不表，在接下来基于验证的变化中来向大家阐述。

上面我们所看到的是 `:has()` 选择器与 `:checked` 组合在一起使用的最简单的一个示例。我们来看一个更为复杂的示例，即 **Web 中的过滤组件**。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7be1e4b80e4e47ee89b4feddbb262386~tplv-k3u1fbpfcp-zoom-1.image)

上图是一个过滤组件的效果图，左侧是没有过滤项选中的 UI，右侧是有一个或多个过滤项选中的 UI。有选项选中时，顶部区域右侧有相应的变化，比如重置按钮显示出来、显示具体选中的数量和图标替换等。以往实现这些效果，一般都是依赖于 JavaScript 来实现的，不过，接下来我们来看 `:has()` 如何让纯 CSS 实现这样的组件交互效果。

这里向大家展示上图中第二组的效果，没有过滤项选中时，选中的数显示为 `0` ；有过滤项选中时，改变选中的数量。假设实现该效果，你使用了下面的 HTML 结构：

```HTML
<div class="card--filter">
    <div class="card__content">
        <input type="checkbox" name="filter" id="css" />
        <label for="css">CSS</label>
        <input type="checkbox" name="filter" id="html" />
        <label for="html">HTML</label>
        <input type="checkbox" name="filter" id="js" />
        <label for="js">JavaScript</label>
        <input type="checkbox" name="filter" id="vue" />
        <label for="vue">Vue</label>
        <input type="checkbox" name="filter" id="react" />
        <label for="react">React</label>
    </div>
    <header>
        <h3 class="card__title">Filter Content</h3>
        <samll class="total"></samll>
    </header>
</div>
```

我们的主要目标是“当 `input[type="checked"]` 被选中（`:checked`）时，改变 `.total` 的样式和计数值”：

```CSS
.card--filter {
    counter-reset: checked-num;
}


input[type="checkbox"]:checked {
    counter-increment: checked-num;
}

.total {
    color: #c5c5c5;
    font-size: 0.75em;
    font-weight: 300;
    transition: color 0.2s ease;
}

.card--filter:has(input[type="checkbox"]:checked) .total {
    color: #9739e8;
    font-weight: bold;
}

.total::after {
    content: "(" counter(checked-num) "/5)";
}
```

你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d55ce5052ec4b99baccbdae35e32812~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/yLRMLOJ>

注意，示例中的复选框按钮样式采用的是 `::before` 自定义的样式，根据复选框选中与否改变计数的值使用的是 CSS 的计数器特性（`counter-reset` 、`counter-increment` 和 `counter()`）。如果你从未接触过 CSS 计数器相关的知识，也不必过于紧张，小册后面有一节课专门会介绍 CSS 计数器相关的知识。

基于同样的原理，我们还可以把复选框（`<input type="checkbox">`）更换成单选按钮（`<input type="radio">`）来制作评分组件（StarRating）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09336e8014ba4376bb90128b04168852~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxeoeE>

制作上图这样的组件，你可能需要下面这样的 HTML 代码：

```HTML
<div class="feedback">
    <div class="stars">
        <label class="star"><input type="radio" name="rating" value="1"></label>
        <label class="star"><input type="radio" name="rating" value="2"></label>
        <label class="star"><input type="radio" name="rating" value="3"></label>
        <label class="star"><input type="radio" name="rating" value="4"></label>
        <label class="star"><input type="radio" name="rating" value="5"></label>
    <div class="emoji-wrapper">
        <div class="emoji">
            <svg class="rating-0"></svg>
            <svg class="rating-1"></svg>
            <svg class="rating-2"></svg>
            <svg class="rating-3"></svg>
            <svg class="rating-4"></svg>
            <svg class="rating-5"></svg>
         </div>
    </div>
    <div class="rating"></div>
</div>
```

你将要运用到上一节课中所介绍的 `:has()` 选择器高级用法：

```CSS
.star::before {
    content: "";
    cursor: pointer;
    display: block;
    width: 40px;
    aspect-ratio: 1;

    /*   未选中色  */
    background-image: var(--unchecked-bg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 76% 50%;
    transition: 0.3s;
}

.star:hover::before,
/* 悬停星星前面的所有兄弟元素 */
.star:has(~ .star:hover)::before,
/* 选中的星星 */
.star:has(:checked)::before,
/* 选中星星前面的所有兄弟元素 */
.star:has(~ .star :checked)::before {
    background-image: var(--checked-bg);
}

/* 悬浮星星与选中星星之间的所有兄弟元素 */
.star:hover ~ .star:has(~ .star :checked)::before,
/* 选中星星跟随一个悬浮星星 */
.star:hover ~ .star:has(:checked)::before {
    background-image: var(--hover-bg);
}

.star:not(:has(checked)) ~ .rating::before {
    content: "0分";
    color: #e3e3e3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    min-height: 40px;
    transition: all .2s linear;
}

.star:has(:checked)  ~ .rating::before { 
    color: #83701a;
    text-shadow: 1px 1px 1px rgb(0 0 0 / .125);
}

.star:nth-of-type(1):has(:checked) ~ .emoji-wrapper > .emoji {
    transform: translateY(-100px);
}
.star:nth-of-type(2):has(:checked) ~ .emoji-wrapper > .emoji {
    transform: translateY(-200px);
}
.star:nth-of-type(3):has(:checked) ~ .emoji-wrapper > .emoji {
    transform: translateY(-300px);
}
.star:nth-of-type(4):has(:checked) ~ .emoji-wrapper > .emoji {
    transform: translateY(-400px);
}
.star:nth-of-type(5):has(:checked) ~ .emoji-wrapper > .emoji {
    transform: translateY(-500px);
}

.star:nth-of-type(1):has(:checked) ~ .rating::before {
    content: "1.0分";
}
.star:nth-of-type(2):has(:checked) ~ .rating::before {
    content: "2.0分";
}
.star:nth-of-type(3):has(:checked) ~ .rating::before {
    content: "3.0分";
}
.star:nth-of-type(4):has(:checked) ~ .rating::before {
    content: "4.0分";
}
.star:nth-of-type(5):has(:checked) ~ .rating::before {
    content: "5.0分";
}
```

你甚至还可以基于 `<input type="radio">` 来控制呈现给用户的内容。比如下面这个示例：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1f1c62e1b56454cab5ce4f91b645506~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/dygvPLX>

简单来说，就是使用 `:has()` 和 `:checked` 显示和隐藏 DOM 的不同部分。

```HTML
<form action="">
    <fieldset>
        <legend>Choose the pictures you like</legend>
        <div class="control">
            <input id="shyamanta" type="radio" name="figure" value="Shyamanta Baruah" checked/>
            <label for="shyamanta">Shyamanta Baruah</label>
        </div>
        <div class="control">
            <input id="aleks" type="radio" name="figure" value="Aleks Dorohovich" />
            <label for="aleks">Aleks Dorohovich</label>
        </div>
        <div class="control">
            <input id="ryan" type="radio" name="figure" value="Aleks Dorohovich" />
            <label for="ryan">Ryan Mcguire</label>
        </div>
        <div class="control">
            <input id="tyler" type="radio" name="figure" value="Tyler Wanlassh" />
            <label for="tyler">Tyler Wanlass</label>
        </div>
        <div class="figure figure--shyamanta">
            <img src="https://picsum.photos/id/30/367/267" alt="">
        </div>
            
        <div class="figure figure--aleks">
            <img src="https://picsum.photos/id/34/367/267" alt="">
        </div>
            
        <div class="figure figure--ryan">
            <img src="https://picsum.photos/id/43/367/267" alt="">
        </div>
            
        <div class="figure figure--tyler">
           <img src="https://picsum.photos/id/50/367/267" alt="">
        </div>
    </fieldset>
</form>
```

我们可以默认隐藏这些元素（`.figure`），然后使用 `:has()` 找到已选中（`input[type="radio"]:checked`）的特定输入，并在表单的其他位置显示其相应的元素。

```CSS
.figure {
    display: none;
}

form:has(#shyamanta:checked) .figure--shyamanta,
form:has(#aleks:checked) .figure--aleks,
form:has(#ryan:checked) .figure--ryan,
form:has(#tyler:checked) .figure--tyler{
    display: block;
}
```

当然，这种模式也可以使用 `<select>` 或复选框（`<input type="checkbox">`）来实现，但我们前面好多个实例都是基于 `<input type="checkbox">` 来实现的。

接下来，我们来看看 `:has()` 选择器基于 `<select>` 的基础上又是如何显示和隐藏 DOM 元素的。较为经典的就是问卷调查页面。

我们在设计“问卷调查”相关的表单时，有的时候会提供一个“其他”选项让用户选择，当用户选择其他选项时，将会显示一个输出框出来。也应该是说，我们可能需要根据之前的回答或选择来显示一个特定的表单字段。当你选择下拉框中的“Other”选项时，会显示一个输出框，供用户输入想要的内容。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb82c045c1db41d08131399a03503d9d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOpqRO>

通过 `:has()` 选择器，我们可以检查 `<select>` 中的 `<option>` 或 `input[type="radio"]` 中的其他项是否选中（`:checked`），如果选中，就把输入框显示出来：

```CSS
.control--other { 
    display: none; 
} 

form:has(option[value="Other"]:checked) .control--other, 
form:has(input[type="radio"][id="other"]:checked) .control--other { 
    display: block; 
} 
```

这种模式同样可用来给网站换肤。例如，如果我们有多个使用 CSS 变量构建的主题，我们可以通过 `<select>` 菜单来更改它们。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bcf5d02b0554fbfbe23645039843129~tplv-k3u1fbpfcp-zoom-1.image)

当我们从列表中选择另一个选项时，CSS 会发生以下变化。根据所选选项，CSS 变量将被更改：

```CSS
/* 默认皮肤色 */
html {
    --bg-color: #FFC107;
    --border-color: #cd9f15;
    --color: #000;
    --title-color: #FFC107;
}

html:has(option[value="blueish"]:checked) {
    --bg-color: #9e7ec8;
    --border-color: #a76494;
    --title-color:#9e7ec8;
    --color: #2283ff;
}

html:has(option[value="green"]:checked) {
    --bg-color: #55801b;
    --border-color: #81bdaa;
    --title-color: #7ec8c8;
    --color: #bfcc87;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6a59d66f4374c47ab3e9c5768dccb96~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址： <https://codepen.io/airen/full/dygvYWq>

上面所展示的几个示例，大多数是通过 `:has()` 来判断元素是否选中 `:checked`，从而改变 UI 效果或交互效果。我们再来看两个关于 `:hover` 效果的示例。例如，用户鼠标悬浮在图片上时（当前图片具有 `:hover` 状态），其他非悬浮状态的图片（非 `:hover`）具有与鼠标当前所处的图片效果不一样，比如说置灰，模糊等。 以往我们可以使用 `:not()` 和 `:hover` 来实现：

```CSS
.figures:hover figure:not(:hover) { 
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.15); 
    z-index: 1; 
    position: relative; 
    background: inherit; 
    transition: all 0.2s ease; 
 } 
 
.figures:hover figure:not(:hover)::before { 
     content: ""; 
     position: absolute; 
     background: rgba(255, 255, 255, 0.25); 
     box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); 
     backdrop-filter: blur(4px); 
     border-radius: 10px; 
     border: 1px solid rgba(255, 255, 255, 0.18); 
     z-index: 2; inset: 0; 
     transition: all 0.2s ease; 
} 
```

如果将上面代码中的选择器换成 `:has()`，可以像下面这样的写：

```CSS
.figures:has(figure:hover) figure:not(:hover) {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.15);
    z-index: 1;
    position: relative;
    background: inherit;
    transition: all 0.2s ease;
}

.figures:has(figure:hover) figure:not(:hover)::before {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    z-index: 2;
    inset: 0;
    transition: all 0.2s ease;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddbac83d73f64a1da3bda074b89629fe~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmZvyj>

这种方式也可以运用于导航菜单栏上：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c8842f2aff3480598685e78e5b910b3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/WNapQmo>

关键代码：

```CSS
/* 当 a 链接被悬停时，改变列表 ul 边框样式 */ 
ul:has(a:hover) { 
    border: 2px solid whitesmoke; 
} 

/* 当一个 a 链接被悬停时，改变其他 a 链接的样式 */ 
ul:has(a:hover) a:not(:hover) { 
    opacity: 0.5; 
} 
```

在上面这个示例基础上，你还可以调给带有下拉菜单项右侧添加向下或向右指示箭头：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16a26e32e486405181a37d9d6222cf26~tplv-k3u1fbpfcp-zoom-1.image)

比如上图中左侧的导航，使用下面代码即可实现：

```CSS
.menu:has(button:hover) { 
    border: 2px solid #d32c2c; 
} 

.menu-list:has(button:hover) button:not(:hover){ 
    filter: opacity(0.5) blur(1px); 
} 

.menu-item:has(button + ul) > button::after { 
    content: "➤"; 
    display: flex; 
    align-items: center; 
    margin-left: auto; 
    padding-right: 32px; 
    height: 100%; 
    top: 0; 
    position: absolute; 
    right: -22px; 
 }
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6eb481e0f337403b86e8a9084acb4455~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExdWVzp>

更为复杂的是，我们可以使用 `:has()` 和 `:hover` 做一些联动的交互效果。比如下面这个示例，当鼠标悬浮在列表项时，可以动态的改变右侧网格轨道的尺寸，即给网格添加动画效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/852c3aa938fa42c7bed1dae1ae5aa4ab~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/Rweprww>

实现上图的效果，你需要的 HTML 结构如下：

```HTML
<div class="wrapper">
    <nav>
        <ul>
            <li><a href="">Reference Pure</a></li>
            <!-- 侧边导航其他列表项 -->
        </ul>
    </nav>
    <div class="grid">
        <div class="item">
            <img src="https://picsum.photos/800/600?random=2" alt="" />
            <div class="caption">
                <h3>Reference Pure</h3>
                <svg></svg>
             </div>
         </div>
         <!-- 其他 Item，需要与侧边栏菜单项数量等同 -->
    </div>
</div>
```

Demo 所需的关键 CSS 代码：

```CSS
.grid {
    display: grid;
    grid-template: 1fr / repeat(3, 1fr);
    gap: 5%;
    transition: grid-template 300ms 150ms;
}

.grid:has(:hover) {
    transition: grid-template 300ms;
}

/* 根据侧边栏导航的调整右侧网格轨道尺寸 */
.grid:has(> :nth-child(3n):hover),
.wrapper:has(nav li:nth-child(3n) a:hover) .grid {
    grid-template: 1fr / 1fr 1fr 2fr;
}

.grid:has(> :nth-child(2n):hover),
.wrapper:has(nav li:nth-child(2n) a:hover) .grid {
    grid-template: 1fr / 1fr 2fr 1fr;
}

.grid:has(> :first-child:hover),
.wrapper:has(nav li:first-child a:hover) .grid {
    grid-template: 1fr / 2fr 1fr 1fr;
}

.item:hover .caption,
.wrapper:has(nav li:first-child a:hover) .item:first-child .caption,
.wrapper:has(nav li:nth-child(2n) a:hover) .item:nth-child(2n) .caption,
.wrapper:has(nav li:nth-child(3n) a:hover) .item:nth-child(3n) .caption {
    opacity: 1;
    transition: opacity 200ms 300ms;
}

.item:hover svg {
    transition: transform 200ms ease-out 300ms;
    transform: translate3d(0, 0, 0);
}
```

现代 CSS 的功能已经强大到让你无法想像。记得我在介绍[条件化 CSS](https://juejin.cn/book/7199571709102391328/section/7199845944760729632) 的时候，举了一个 `:target` 实现模态框的例子：

```HTML
<a href="#target-content" id="button">Open CSS Modal via <code>:target</code></a>
<div id="target-content">
    <a href="#" class="close"></a>
    <div id="target-inner">
        <h2>CSS Modal</h2>
    </div>
</div>
#target-content {
    pointer-events: none;
    opacity: 0;
    transition: opacity 200ms;
}
#target-content:target {
    pointer-events: all;
    opacity: 1;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01fe415f8f6b44bb9249ee013ed986fc~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGmqERR>

同样的，我们可以使用 `:has()` 和 `:target` 结合在一起，来构建模态框组件：

```CSS
.modal {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 200ms;
}

body:has(div:target) .modal{
    pointer-events: all;
    opacity: 1;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e3e1171a4bf4beb8f5b86f405966439~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ZEqeQJM>

同样的，使用 `:has()` 和 `:target` 的结合，还可以使用纯 CSS 构建出 Lightbox 组件的效果，而且不需要依赖任何的 JavaScript 脚本。只不过，使用它们构建 Lightbox 组件时，对 HTML 有一定的要求：

```HTML
<div class="thumbs">
    <a href="#target1"><img src='https://picsum.photos/id/13/367/267' alt=''></a>
    <a href="#target2"><img src='https://picsum.photos/id/14/367/267' alt=''></a>
    <a href="#target3"><img src='https://picsum.photos/id/15/367/267' alt=''></a>
    <a href="#target4"><img src='https://picsum.photos/id/16/367/267' alt=''></a>
    <a href="#target5"><img src='https://picsum.photos/id/17/367/267' alt=''></a>
    <a href="#target6"><img src='https://picsum.photos/id/18/367/267' alt=''></a>
    <a href="#target7"><img src='https://picsum.photos/id/19/367/267' alt=''></a>
    <a href="#target8"><img src='https://picsum.photos/id/20/367/267' alt=''></a>
    <a href="#target9"><img src='https://picsum.photos/id/21/367/267' alt=''></a>
</div>

<div class="lightbox">
    <div class="target" id="target1">
        <span><!-- 使内容在 Flexbox 容器中保持居中的间隔符 --></span>
        <div class="content">
            <img src='https://picsum.photos/id/13/1024/640' alt=''>
        </div>
        <a href="#target2" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target2">
        <a href="#target1" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/14/1024/640' alt=''>
        </div>
        <a href="#target3" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target3">
        <a href="#target2" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/15/1024/640' alt=''>
        </div>
        <a href="#target4" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target4">
        <a href="#target3" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/16/1024/640' alt=''>
        </div>
        <a href="#target5" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target5">
        <a href="#target4" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/17/1024/640' alt=''>
        </div>
        <a href="#target6" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target6">
        <a href="#target5" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/18/1024/640' alt=''>
        </div>
        <a href="#target7" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target7">
        <a href="#target6" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/19/1024/640' alt=''>
        </div>
        <a href="#target8" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target8">
        <a href="#target7" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/20/1024/640' alt=''>
        </div>
        <a href="#target9" class="nav" title="next"><svg></svg></a>
    </div>
    <div class="target" id="target9">
        <a href="#target8" class="nav" title="previous"><svg></svg></a>
        <div class="content">
            <img src='https://picsum.photos/id/21/1024/640' alt=''>
        </div>
        <span><!-- 使内容在 Flexbox 容器中保持居中的间隔符 --></span>
    </div>
    <a href="#!" class="close nav"><svg></svg></a>
</div>
```

运用了 `:has()` 和 `:target` 选择器的 CSS 代码：

```CSS
.lightbox {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    transform: translateY(-100%);
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.lightbox:has(div:target) {
    transform: translateY(0%);
    opacity: 1;
}

.lightbox .target {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    transform: scale(0);
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2rem;
}

.lightbox .target .content {
    transform: scale(0.9);
    opacity: 0;
    flex: 1 1 auto;
    align-self: center;
    max-height: 100%;
    min-height: 0;
    min-width: 0;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 0 3px white, 0 5px 8px 3px rgba(0, 0, 0, 0.6);
    transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;
}

.lightbox .target:target {
    transform: scale(1);
}
.lightbox .target:target .content {
    transform: scale(1);
    opacity: 1;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9d8c19d7a8447f38a515a2f04ba7d4d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/zYmZrLQ>

再来看一个比较有意思的用例，即**一个用于高亮可点击元素的 CSS 选择器**。假设，你正在使用 HTML 和 CSS 构建一个网站的线框图。由于这只是一个原型，不是所有操作都是有效的。当用户查看原型时，尝试点击未连接的元素，希望能告诉用户可以进行交互的元素是哪些。这也允许用户单击页面上的任何地方以突出显示他们可以单击的内容。

以往要实现这样的一个需求，是需要使用 JavaScript 脚本的。现在，你可以使用 `:has()` 和 `:is()` 选择器实现该功能：

```CSS
html:active:not(:has(a:active, button:active, label:active)) :is(a, button, label) {
    outline: 2px solid blue;
}
```

它的工作方式是：

*   当你在页面上按住鼠标时，`html:active` 会被匹配；
*   `:not(:has(a:active, button:active, label:active))` 会在你按住鼠标时，不匹配 `a`、`button` 或 `label` 元素，以避免用户单击某些具有功能性的元素时出现轮廓线；
*   `:is(a, button, label)` 匹配页面上的所有 `a`、`button` 和 `label` 元素。

```HTML
<ul>
    <li><a href="#">Clickable link</a></li>
    <li><button>Clickable button</button></li>
    <li><label>Clickable label</label></li>
    <li><span>Not clickable</span></li>
</ul>
```

```CSS
html:active:not(:has(a:active, button:active, label:active)) :is(a, button, label) {
    outline: 2px solid blue;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/707dd303fc5b45f59058cfd7f8bda146~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgeyYe>

### 基于验证的变化

在 CSS 中有一种伪类选择器被称为表单伪类选择器，比如前面提到的 `:checked`、`:disabled`，除此之外还有：

*   `:enabled` 和 `:disabled`
*   `:read-only` 和 `:read-write`
*   `:placeholder-shown`
*   `:default`
*   `:indeterminate`
*   `:valid` 和 `:invalid`
*   `:required` 和 `:optional`
*   `:in-range` 和 `:out-of-range`

我们可以使用这些伪类，结合 CSS 的 `:not()` 选择器，相邻兄弟选择器 `+`  和通用兄弟选择器（`~`）来设计一个带有不同验证样式的表单。比如：

```CSS
input:required + .help-text::before { 
    content: '*Required'; 
} 

input:optional + .help-text::before { 
    content: '*Optional'; 
} 

input:read-only { 
    border-color: var(--gray-lighter) !important; 
    color: var(--gray); 
    cursor: not-allowed; 
} 

input:valid { 
    border-color: var(--color-primary); 
    background-image: url("right.svg"); 
} 

input:invalid { 
    border-color: var(--color-error); 
    background-image: url("error.svg"); 
} 

input:invalid:focus { 
    border-color: var(--color-error); 
} 

input:invalid + .help-text { 
    color: var(--color-error);
} 

input[type='email']:invalid + .help-text::before { 
    content: 'You must enter a valid email.' 
} 

input:out-of-range + .help-text::before { 
    content: 'Out of range'; 
} 

input[type='checkbox'] + label { 
    user-select: none; 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4891736c1b74996bb60fa33f05bed41~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOeBrey>

看上去很完美，但它们组合起来使用有一个缺陷：我们无法使用它们选中元素的前面元素或其祖先元素。比如，我们要实现下面这样的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/625a4705b5044f57a498ab6b7fc79f7a~tplv-k3u1fbpfcp-zoom-1.image)

你可能想到了。如果想通过其他选择器来选中排在前面的元素或其祖先元素，就需要用到 `:has()` 关系选择器。也就是说，将 `:has()`、`:not()`、表单伪类选择器以及相邻兄弟（`+`）和相邻兄弟通用选择器（`~`）结合在一起，我们可做的事情会更多，灵活性也会更大。

比如下面这个示例:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1223d47156d04676ae1d4d8094571ad0~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwEpjRN>

使用了 `:has()` 选择器的关键代码：

```CSS
/* 选中”其他“选项时，对应的输入框显式 */ 
form:has(option[value="other"]:checked) .control--other-job, 
form:has(input[type="checkbox"][value="other"]:checked) .control--other-interests { 
     display: block; 
} 

/* 带有 required 属性的input 对应的 lable 前添加 "❋" 提示符及样式设置 */ 
.control:has(input:required) label::before { 
    content: "❋"; 
    font-size: 1em; 
    font-weight: bolder; 
    color: #ff0092; 
} 

/* 未含 required 属性的input 对应的 lable 前添加 "⇟" 提示符及样式设置 */ 
.control:has(input:optional, select:optional) > label:not(input + label)::before, 
.control:has(input:optional, select:optional) > span::before { 
    content: "⇟"; 
    font-size: 1em; 
    font-weight: bold; 
    color: #93ff00; 
} 

/* 输入无效值，改变输入框前标签元素文样颜色 */ 
.control:has(input:invalid) label:not(input + label) { 
    color: #ff3e46; 
} 

/* 输入无效值，改变输入框样式 */ 
.control:has(input:invalid) input { 
    border-color: #ff3e46; 
    box-shadow: inset 0 -5px 45px rgb(207 47 127 / 20%), 0 1px 1px rgb(216 20 111 / 20%); 
    border-color: #ff008e; 
    color: #ff008e; 
} 

/* 输入无效值时，提示信息显示 */ 
.control:has(input:invalid) .error { 
    display: block; 
} 

/* 输入有效值，改变输入框前面标签元素的文本颜色 */ 
.control:has(input:valid) label:not(input + label) { 
    color: #0be498; 
} 

/* 输入无效值，警告提示信息显示，输入框输入有效值，警告提示信息框隐藏 */ 
.form:has(input:invalid) .alert__error { 
    display: flex; 
} 
```

回过头来，我们在介绍基于状态变化的时候留了一个小尾巴：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/444e9abd3f8b4549948f0744aaf8f323~tplv-k3u1fbpfcp-zoom-1.image)

复选框选中，按钮就有由禁用状态变成可用状态。其实我们可以做得更好一些，那就是所有 `input` 输出的数据都是有效数据时，按钮才是可用状态。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cccdb4f192fe4bf6b1717b6c761cb3ce~tplv-k3u1fbpfcp-zoom-1.image)

要实现上图的效果，其实很简单，只需要加上表单验证相关的伪类即可：

```CSS
form .button {
    --button-color: hsl(0, 0%, 90%);
    --button-text-color: hsl(0, 0%, 50%);
    cursor: not-allowed;
}

form:has(input[type="email"]:valid):has(input[type="checkbox"]:checked) .button {
    --button-color: var(--color-primary);
    --button-text-color: rgb(0, 25, 80);
    cursor: pointer;
}

form:has(input[type="email"]):has(input[type="checkbox"]:checked) .button:hover {
    --button-text-color: rgb(0, 25, 80);
    --button-color: #2eec96e3;
}
```

> Demo 地址：<https://codepen.io/airen/full/VwEpjOO>

## 小结

在这节课中，主要和大家一起探讨了 `:has()` 选择器能帮助我们解决什么问题，并且给大家提供了一些使用 `:has()` 选择器的案例和场景。

其实，关系型选择器 `:has()` 和 CSS 容器查询特性很相似，它能在 CSS 中带来一定的逻辑关系。它的到来，将允许开发者编写强大的，多功能的选择器，而这些选择器目前在 CSS 中是无法实现的，也是开发者期待已久的功能。

今天，关系型选择器 `:has()` 允许开发者编写强大的选择器，从而减少 CSS 的类名的使用以及减少 JavaScript 的依赖（比如示例中的动态改变样式）。

另外，课程中提到的案例仅是 `:has()` 关系型选择器部分运用场景，也只是 `:has()` 选择器使用的开始。你可以把日常碰到的需要使用关系型选择器（或者说父选择器）的场景罗列出来，尝试着使用它。或者发挥你的才智，使用 `:has()` 创造更多的案例。我相信这样创作的过程中，你肯定能发现 `:has()` 有很多用途和作用。
