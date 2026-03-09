瀑布流布局有一个专业术语，即 **Masonry Layout**。它是一种典型的 Web 布局， [Pinterest](https://www.pinterest.co.uk/) 网站是最早使用瀑布流布局的，因此在业内也将瀑布流布局称为 Pinterest 布局。早期，还没有哪一种 CSS 特性可以实现瀑布流布局，因此， Web 开发者只能使用 JavaScript 来实现瀑布流布局，比如 [Masonry](https://masonry.desandro.com/index.html) 和 [Isotope](https://isotope.metafizzy.co/index.html) 等。

随着 CSS 的多列布局和 Flexbox 布局的出现，也有 Web 开发者使用这两种布局技术来实现瀑布流布局。不过，它们实现的瀑布流布局是一种伪瀑布流布局。庆幸的是，W3C 的 CSS 工作小组专门为瀑布流布局制定了一份规范，并且作为 CSS Grid （[CSS Grid Layout Module Level 3](https://drafts.csswg.org/css-grid-3/)）规范的一部分。也就是说，Web 开发者可以使用 CSS Grid 布局来实现瀑布流布局。在这节课中，我们一起来探讨 CSS Grid 是如何实现瀑布流布局的。

## 什么是瀑布流布局

瀑布流布局是一种很常见的 Web 布局设计。在布局容器中会有很多个项目（通常是图片或文章摘要），容器中的项目在行内方向一个接一个地布局。当它们移动到下一行时，项目将向上称动到第一行较短（高度较低）项目所留下的空隙中。有点类似于我们生活中“砌砖”的样子：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9396aa9b3b1e455dbd53f0ab4986133e~tplv-k3u1fbpfcp-zoom-1.image)

从布局角度来看，瀑布流布局更类似网格布局中自动放置网格项目的布局，但又没有严格遵循该布局模式。

最著名的瀑布流布当属 [Pinterest](https://www.pinterest.co.uk/)，比如他的搜索结果页面的布局效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1551afad198948aa9607dcbdb01f8540~tplv-k3u1fbpfcp-zoom-1.image)

## 背后的故事

[CSS 网格布局](https://juejin.cn/book/7161370789680250917/section/7161372229123440648)具有强大的布局能力，它使得 Web 开发者能很好的控制方框（元素盒子）及其内容的大小和位置。到目前为止，[Web 众多布局技术中](https://s.juejin.cn/ds/iJeW5aqF/)，只有 CSS 网格布局是二维布局：**在两个维度上都需要对齐内容的布局**。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25cd65b6096c495a9209377601a5ff8a~tplv-k3u1fbpfcp-zoom-1.image)

尽管许多布局可以使用 CSS 网格来实现，但是 Web 上的一些布局使用 CSS 网格也是有所限制的，比如瀑布流布局。

@Rachel Andrew 曾经也说过，网格布局和瀑布流布局的结构是有所不同的，对于网格布局而言，他有严格的行和列，但对于瀑布流布局来说，他并没有严格的行和列：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04410cca443543c78ee402fea39e5346~tplv-k3u1fbpfcp-zoom-1.image)

虽然瀑布流布局也会有行和列，但它的列更像是一个 Flexbox 布局或者多列布局。也因此，社区有同学通过这几种方式（CSS Flexbox 或 CSS 多列布局）来实现瀑布流布局。相比而言，实现瀑布流这种布局外观的最接近的方法是使用 CSS 的多列布局。比如下面这个例子：

```HTML
<div class="masonry--container">
    <div class="item">
        <img src="https://picsum.photos/1024/860?random=1" alt="">
        <h3>Blog Post</h3>
        <p>Lorem ipsum dolor si...</p>
    </div>
    <!-- 省略其他 item -->
</div>
```

```CSS
@layer layout {
    .masonry--container {
        column-count: 4;
        column-gap: 1rem;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7560ee499b44a9a809735820d512539~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQMbaj>

在上面的例子中，你会看到整个布局看起来像瀑布流布局。然而，项目（卡片）的顺序沿着列运行。也就是说，使用多列布局来实现瀑布流布局和真正的瀑布流布局之间有着关键性的区别：“**在多列布局中，项目（卡片）是按列显示的，通常在瀑布流布局中，希望项目（卡片）是按行显示**”。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa5765c884d45dba6ef1ad39d45c45e~tplv-k3u1fbpfcp-zoom-1.image)

因此，多列布局实现的“瀑布流布局”有可能无法满足我们实际的业务需求。例如，Pinterest 网站的搜索结果页，期望搜索出来的结果总是排列在前面，比如说页面最顶部就能看到搜索的结果，而不是像多列布局实现的效果那样，排在前面的都在第一列。

最初，我以为使用 [CSS 网格布局中自动放置网格项目的特性](https://juejin.cn/book/7161370789680250917/section/7161623932439625758)（即 `grid-auto-flow: dense`）就可以实现瀑布流布局：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5b60b4a820549cf91cf16469d3a02d2~tplv-k3u1fbpfcp-zoom-1.image)

```CSS
@layer layout {
    .masonry--container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100% - 2rem, 300px), 1fr));
        grid-auto-flow: dense;
        gap: 1rem;
        align-items: start;
    }
}
```

虽然这种方式（`grid-auto-flow: dense`）可以使网格项目（卡片）自动放置（填充所有的空白），但布局仍然是一个网格，因此没有办法使项目（卡片）上升到较短项目（卡片）留下的空白空间中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3f08e20b05849199e710ff719a2ad6f~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwVgLYO>

正如你所看到的，这离我们所需要的瀑布流布局还很远。

这也再次说明，瀑布流布局不是一个网格，它是一个相对专业的布局。基于这些原因，W3C 的 CSS 工作组才将瀑布流布局当作一个独立的规范。即使把他和 CSS 网格规范关联起来，也只能说 CSS 瀑布流布局规范（[CSS Grid Level 3](https://drafts.csswg.org/css-grid-3/)）是 CSS 网格布局的一个附本。

## 网格布局的瀑布流特性

网格布局的瀑布流特性是一个比较新的规范，到目前为止，我们可以在 Safari 17（TP版）和 Firefox Nightly 浏览器中开启相关实验属性来使用它。你可以在 Firefox Nightly 游览器的地址栏中输入 `about:config` ，并启用 `layout.css.grid-template-masonry-value.enabled` （将其设置为 `true`）。完成这些操作之后，你就可以在该浏览器中查看到 CSS 网格制作的瀑布流布局效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/585746154fb64539b93b44dc93358e7b~tplv-k3u1fbpfcp-zoom-1.image)

同样的，你可以在 Safari 17 （TP）中开启相应的实验属性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fe8ddc152d04955a32dc27ac2828383~tplv-k3u1fbpfcp-zoom-1.image)

接下来，我们就可以来看看 CSS 网格是如何实现瀑布流布局？

> 特别声明，接下来的内容，你需要具备一定的 CSS Grid 知识才能更易于理解，如果你从未接触过 CSS Grid 相关的知识，[建议你花一点时间了解一下这方面的知识](https://juejin.cn/book/7161370789680250917/section/7161372229123440648)。

在 CSS 中，我们可以在网格容器上使用 `grid-template-columns` 和 `grid-template-rows` 属性来显式指定网格的行和列。例如：

```CSS
.grid--container {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: repeat(2, auto);
}
```

上面的 CSS 创建了一个四列两行的网格：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/756718d27ba041afaefc9db1b5162777~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxVZpg>

[CSS Grid Layout Module Level 3](https://drafts.csswg.org/css-grid-3/#masonry-layout) 为 `grid-template-columns` 和 `grid-template-rows` 新增了一个 `masonry` 值，专门用来制作瀑布流布局。也就是说，你要使用网格制作瀑布流布局，`grid-template-columns` 和 `grid-template-rows` 两者必须有一个将值设置为 `masonry` 。例如，下面的 CSS 将 `grid-template-rows` 设置为 `masonry` ：

```CSS
.masonry--container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100% - 2rem, 300px), 1fr));
    gap: 1rem;
    align-items: start;
    grid-template-rows: masonry;
}
```

你将看到的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57107edb06be42a2b7f364a88d6435ca~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYQbLRb> （请使用 Safari 17 TP 查看）

也可以将 `grid-template-columns` 设置为 `masonry` 。例如：

```CSS
.masonry--container {
    display: grid;
    grid-template-columns: masonry;
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18af691f2b444d9d891853352eaaa857~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/wvQNMbM> （请使用 Safari 17 TP 查看）

正如你所看到的，`grid-template-rows` 和 `grid-template-columns` 属性值是 `masonry` 时，可以创建不同方向的瀑布流布局：

-   **纵向（垂直方向）的瀑布流布局**： `grid-template-rows: masonry` 将创建纵向瀑布流布局
-   **横向（水平方向）的瀑布流布局**：`grid-template-columns: masonry` 将创建横向瀑布流布局

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89ee5543e9884c128cb794432a1d61b0~tplv-k3u1fbpfcp-zoom-1.image)

需要注意的是，当 `grid-template-rows` 和 `grid-template-columns` 属性的值都是 `masonry` 时，浏览器会将 `grid-template-columns` 的值解析为 `none` 。

### 瀑布轴（Masonry Axis）

在 CSS Grid 中，网格容器具有内联轴（Inline Axis）和块轴（Block Axis）。注意，内联轴也称为行轴，块轴也称为列轴：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c98309098ac44c28f5c5e8d5028dfc4~tplv-k3u1fbpfcp-zoom-1.image)

要使用瀑布流布局，`grid-template-rows` 或 `grid-template-columns` 至少有一个是 `masonry` 。只是，值为 `masonry` 时，其所对应的轴就变成了瀑布流轴（Masonry Axis），另一个轴则是网格轴：

-   当 `grid-template-rows` 的值为 `masonry` 时，网格的内联轴（行轴）就变成了瀑布流轴，块轴（列轴）则保持不变
-   当 `grid-template-columns` 的值为 `masonry` 时，网格的块轴（列轴）就变成了瀑布流轴，内联轴（行轴）则保持不变

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e143e08713f4bc68ad08f2831667633~tplv-k3u1fbpfcp-zoom-1.image)

### 网格轴上的行为

虽然在外观上看，瀑布流布局与网格布局有所差异，但目前为止，依旧是基于网格容器来创建的瀑布流布局。从这一点来说，瀑布流布局在网格轴上的行为与常规网格是完全相同的。因此，你可以调整网格轨道的大小、给网格线命名、网格项目和网格轨道的对齐方式。

同样的，在瀑布流布局中也可以像使用常规网格布局那样，基于网格线名称来放置瀑布流项目（网格项目）。比如下面这个示例，将第五个瀑布流项目放置在网格线名为 `box-start` 和 `box-end` 之间：

```CSS
@layer layout {
    .masonry--container {
        display: grid;
        grid-template-columns: 1fr [box-start] 1fr 1fr [box-end] 1fr;
        grid-template-rows: masonry;
        gap: 1rem;
        align-items: start;
    }
  
    .item:nth-child(5) {
        grid-column: box-start / box-end;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b45d215b85244d57a7cbb4d47711c0b3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQGLbQ> （请使用 Safari 17 TP 查看）

这里有一个小细节需要注意，通过网格线放置的网格项目将会在瀑布流项目（未通过网格线放置的网格项目）放置之前先放置。比如上面这个示例，你会发现瀑布流项目被放置在它（第五个网格项目，即使用网格线放置的网格项目）周围。

除此之外，你也可以像常规网格项目一样，使用 `span` 来跨越多个网格轨道（合并单元格）。比如下面这个示例，将具有 `.blog` 类的网格项目跨越两列网格轨道：

```CSS
@layer layout {
    .masonry--container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: masonry;
        gap: 1rem;
        align-items: start;
    }
  
    .blog {
        grid-column: span 2;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d81456977a7c4325a63b358412ae6657~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWEoMKm> （请使用 Safari 17 TP 查看）

### masonary-auto-flow

`masonry-auto-flow` 是专门为瀑布流布局定义的属性，它允许你控制瀑布流布局中的项目流。该属性的值主要有：

```
masonry-auto-flow:  [ pack | next ] || [definite-first | ordered ] 
```

每个值的意思是：

-   **`pack`** ：默认值，表示根据默认的瀑布流布局算法，瀑布流项目将被放置在空间最大的轨道上
-   **`next`** ：瀑布流项目一个接一个地放置在网格轨道上
-   **`definite-first`** ：按照默认的瀑布布局算法，在放置其他瀑布流项目之前，先放置有明确位置的瀑布流项目
-   **`ordered`** ：忽略任何有明确放置位置的瀑布流项目，并根据 `order` 修改文件顺序放置所有瀑布流项目；也就是说，除非使用 `order` 属性排序，否则按照它们在文档中的顺序排列瀑布流项目

`masonry-auto-flow` 属性的值有两种形式：

-   单一值：`pack` 、`next` 、`definite-first` 和 `ordered` 四个关键词之一
-   双值：`pack definite-first` 、`pack ordered` 、`next definite-first` 或 `next ordered`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffee3b410a314164aa2de6d9b1da0916~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/PoxVyWP> （请使用 Safari 17 TP 查看）

拿 `next` 和 `pack` 来做一个对比。其中 `masonry-auto-flow: next` 允许你把瀑布流项目（网格项目）放置在网格轴上的下一个位置，而不是像默认情况（`pack`）那样将瀑布流项目（网格项目）放置在具有最多空间的列中：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a464eca0655423cba1d18888b8ebb38~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/OJadogG> （请使用 Safari 17 TP 查看）

### justify-tracks 和 align-tracks

瀑布流布局新增了 `justify-tracks` 和 `align-tracks` 属性。当瀑布轴是在块轴（Column）方向时，`justify-tracks` 有效；当瀑布轴是在内联轴（Row）方向时，`align-tracks` 有效。

```
align-tracks: [normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>]# 
​
justify-tracks: [normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ] ]# 
​
<baseline-position> = [ first | last ]? && baseline 
<content-distribution> = space-between | space-around | space-evenly | stretch 
<overflow-position> = unsafe | safe 
<content-position> = center | start | end | flex-start | flex-end
```

`align-tracks` 和 `justify-tracks` 的默认值都是 `normal` ，而且都应该应用在是瀑布流布局的网格容器上。他们的属性值和 `align-content`、`justify-content` 相同，不同的是 `align-tracks` 和 `justtify-tracks` 可以接受以逗号（`,`）分隔的多个值。

先来回顾一下 `align-content` 和 `justify-content` 在网格布局中是如何控制网格轨道对齐方式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5df4f0f56bdf4429aa2ecb63696b1d9d~tplv-k3u1fbpfcp-zoom-1.image)

需要知道的是，`align-content` 和 `justify-content` 也可以运用到瀑布流容器上，但不同的是，对于瀑布流轴，这两个属性是不生效的，在瀑布流轴上，分别被 `align-tracks` 和 `justify-tracks` 替代。比如下面这个示例：

```CSS
.container {
    display: grid; 
    grid-template-columns: repeat(4, 160px); 
    gap: 10px; 
    
    justify-content: var(--justify-content); 
    align-content: var(--align-content); /* 被 align-tracks 替代 */
    
    grid-template-rows: masonry; 
    align-tracks: var(--align-tracks);
}
```

上面的代码中，将 `grid-template-rows` 设置值为 `masonry` 时，内联轴（行轴）是对应的瀑布流轴，块轴（列轴）是网格轴。在这种情况之下，`align-content` 在瀑布轴上是不生效的，同时被 `align-tracks` 替代（这个时候 `align-tracks` 相当于 `align-content`）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9f3d23d2214478d879f46665e0a4c9c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQGxap> （请使用 Firefox Nightly 查看）

再来看另外一个场景，就是 `grid-template-columns` 设置为 `masonry`，这个时候内联轴（行轴）是网格轴，块轴（列轴）是瀑布轴。在这种情况之下，`justify-content` 在瀑布轴上不生效，同时被 `justify-tracks` 替代：

```CSS
:root {
    --justify-content: normal;
    --align-content: normal;
    --justify-tracks: normal;
}
​
.container {
    display: grid;
    grid-template-rows: repeat(4, 160px);
    gap: 10px;
​
    justify-content: var(--justify-content); /* 被 justify-tracks 替代 */
    align-content: var(--align-content);
    
    grid-template-columns: masonry;
    justify-tracks: var(--justify-tracks);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4afad096deb4921ad182418b9050c88~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXqgMP> （请使用 Firefox Nightly 查看）

前面我们提到过，`align-tracks` 和 `justify-tracks` 可以同时取多个值。比如下面这个示例，我们有四列的瀑布流布局，给 `align-tracks` 设置多个值：

```CSS
body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
​
    grid-template-rows: masonry;
    align-tracks: start, center, end, space-between;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2e2198276eb4f318f2bb6eb9e145338~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQgJzW> （请使用 Firefox Nightly 查看）

## 小结

我们是幸福的，这几年 CSS 在高速发展，有很多新的 CSS 特性提出，并且得到浏览器的支持。正如今天我们所聊的瀑布流布局，它是一个新特性，而且是个实验性特性。虽然说还没得到众多主流浏览器支持，但并不用过于担心，我想在不久的将来，这个特性就会得到更多的浏览器支持。当然，如果你在构建一个新的内部项目，那么可以尝试着使用这个新特性。

另外，你也可以尝试着使用用该布局特性，如果遇到问题，或者无法完成在以前的实现中能够完成的任务，[可以向CSSWG 提出你的问题](https://github.com/w3c/csswg-drafts/issues/)。这样，我们才能更快的用上这个新特性。