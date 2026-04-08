对于 Web 开发者而言，在编写 CSS 代码时，必须仔细考虑如何编写和组织代码。尤其是在一个大型项目或多人协作开发的项目中，级联和选择器权重很容易引起样式冲突和被覆盖。例如，更改元素的 `display` 的值永远不会起作用，因为级联中的另一个选择器由于具有更高的权重而覆盖了它。

为了克服与级联和权重所产生的样式冲突，我们需要仔细考虑在哪里编写特定的 CSS。在小项目中，这样做是可以的，但对于大型项目，这样做的成本是昂贵的。因此，我们可以看到社区有很多 CSS 方法论，例如 BEM、SMACSS 、OOCSS 和 ITCSS 等，用来帮助 Web 开发者更好的组织 CSS ，从而减少级联和权重引起的样式冲突问题。

为了使 Web 开发者能更好的组织和管理 CSS 代码，[W3C 的 CSS 工作小组推出了一个新特性，即 CSS 的级联层 `@layer`](https://www.w3.org/TR/css-cascade-5/#cascading) 。这对于 Web 开发者来说，是一个非常激动人心的时刻。期待已久的功能以惊人的速度得到了主流浏览器的支持。这个新的 CSS 特性是一种帮助控制样式何时覆盖其他样式的新机制，它可以让我们对 CSS 文件进行更显式的控制，以防止样式因权重和顺序所产生的冲突。这对于大型代码库、设计系统以及管理应用程序中的第三样式尤其有用。

在这节课中，我们将探讨 CSS 级联层 `@layer` 是如何工作的，以及它们如何帮助我们更自信地编写和组织 CSS。

## CSS 级联和权重

虽然 CSS 级联和权重是 CSS 中最基础的部分，但在详细探讨 CSS 级联层 `@layer` 之前，我们有必要先花一点时间来回顾一下 CSS 中的级联和权重。先从 CSS 的级联开始聊起。

CSS 级联，也被称为 CSS 层叠，正好对应着 CSS（Cascade Style Sheets）中首字母，即 C，也就是 **Cascade**。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbda2cbb6735462a8c6e4f2a4540d062~tplv-k3u1fbpfcp-zoom-1.image)

级联是解决多个 CSS 规则应用于一个 HTML 元素所产生冲突的算法，即浏览器通过它来决定将哪些 CSS 样式规则应用到一个元素上。例如，我们有两种样式的按钮，如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2e3598437e44c7089a06a7f9a496796~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/MWzBdvY>

我们可以像下面这样编写代码：

```HTML
<button class="button">Download examples</button>
<button class="button button--outline">Download source code</button>
```

```CSS
.button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8125rem 2rem;
    border-radius: .5rem;
    border: 1px solid #712cf9;
    background-color: #712cf9;
    color: #fff;
    font-wegiht: 600;
    font-size: 1.25rem;
}
​
.button--outline {
    color: #6c757d;
    background-color: transparent;
    border-color: #6c757d;
}
```

在这种情况下，上述方法非常有效。但如果我们需要按钮的第三个变体，但不能在 `.button` 声明之后写呢？

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f10c8975b5d4ab6868ec21784ce434b~tplv-k3u1fbpfcp-zoom-1.image)

```HTML
<button class="button">Download examples</button>
<button class="button button--outline">Download source code</button>
<button class="button button--secondary">Open source</button>
```

```CSS
.button--secondary {
  background-color: #03A9F4;
  border-color: #03A9F4;
}
​
/* 中间还有其他 CSS 代码 */
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8125rem 2rem;
  border-radius: .5rem;
  border: 1px solid #712cf9;
  background-color: #712cf9;
  color: #fff;
  font-weight: 600;
  font-size: 1.25rem;
}
​
.button--outline {
  color: #6c757d;
  background-color: transparent;
  border-color: #6c757d;
}
```

`.button` 在 `.button--secondary` 之后，结果 `.button` 覆盖了 `.button--secondary` ，最终结果并没有达到我们期望的效果：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d9970836e9a4110876aab8e04e4422d~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQZmdo>

了解级联算法可以帮助你了解浏览器如何解决此类冲突。级联算法分为 4 个不同的阶段。

-   **①出现的位置和顺序**：CSS 规则出现的顺序
-   **②特异性**：一种确定哪个 CSS 选择器具有最强匹配的算法
-   **③来源**：CSS 出现的顺序及其来源，无论是浏览器样式、浏览器扩展中的 CSS 还是你创作的 CSS
-   **④重要性**：某些 CSS 规则的权重高于其他规则，尤其是具有 `!important` 规则类型的规则

就上面示例的冲突而言，我们可以通过调整代码顺序来解决冲突，比如将 `.button--secondary` 放在 `.button` 之后：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/860e50de764747a9a68f1efec48592f2~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/JjeBqBy>

如果你无法调整源代码的顺序，那么可以考虑增加选择器权重来解决上面的问题。比如通过增加父选择器或者组合选择器，例如：

```CSS
.button.button--secondary {
    background-color: #03A9F4;
    border-color: #03A9F4;
}
​
/* 假设中间还有很多其他的 CSS 代码 */
​
.button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8125rem 2rem;
    border-radius: .5rem;
    border: 1px solid #712cf9;
    background-color: #712cf9;
    color: #fff;
    font-weight: 600;
    font-size: 1.25rem;
}
​
.button--outline {
    color: #6c757d;
    background-color: transparent;
    border-color: #6c757d;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e17c82e594642c182766aae135b9642~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxQJNyL>

除此之外，你还可以使用现代 CSS 的 `:is()` 和 `:where()` 来改变选择器权重。比如，你可以把 `.button` 选择器放置在 `:where()` 选择器中，将其权重降至为 `0` ：

```CSS
.button--secondary {
    background-color: #03A9F4;
    border-color: #03A9F4;
}
​
:where(.button) { /* 选择器权重为 (0,0,0) */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8125rem 2rem;
    border-radius: .5rem;
    border: 1px solid #712cf9;
    background-color: #712cf9;
    color: #fff;
    font-weight: 600;
    font-size: 1.25rem;
}
​
.button--outline {
    color: #6c757d;
    background-color: transparent;
    border-color: #6c757d;
}
```

> Demo 地址：<https://codepen.io/airen/full/vYQawva>

还可以使用 `:is()` 与 `.button--secondary` 组合在一起，增加其权重：

```CSS
:is(.button--secondary,#increase#specificity) {/* 增加选择器权重，（2，0，0）*/
    background-color: #03A9F4;
    border-color: #03A9F4;
}
​
.button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8125rem 2rem;
    border-radius: .5rem;
    border: 1px solid #712cf9;
    background-color: #712cf9;
    color: #fff;
    font-weight: 600;
    font-size: 1.25rem;
}
​
.button--outline {
    color: #6c757d;
    background-color: transparent;
    border-color: #6c757d;
}
```

> Demo 地址： <https://codepen.io/airen/full/LYXBoqQ>

最后还可以使用杀手锏，在样式规则后添加 `!important` 来增加权重：

```CSS
.button--secondary {
    background-color: #03A9F4 !important;
    border-color: #03A9F4 !important;
}
​
.button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8125rem 2rem;
    border-radius: .5rem;
    border: 1px solid #712cf9;
    background-color: #712cf9;
    color: #fff;
    font-weight: 600;
    font-size: 1.25rem;
}
​
.button--outline {
    color: #6c757d;
    background-color: transparent;
    border-color: #6c757d;
}
```

> Demo 地址：<https://codepen.io/airen/full/abQjrMy>

正如上面所述，为了决定哪个声明（CSS 样式规则）会“获胜”（从而被应用到元素上），级联提供了相应的算法。了解级联算法有助于帮助我们理解浏览器是如何解决样式规则冲突，也就是浏览器决定哪个样式规则运用到元素上。但需要知道的是，级联算法在不同的规范中有不同的描述，在 Level 5 中提供了六个不同的级别。在不考虑级联层的情况下，其标准如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/547f01db867e469f980f9c00bc62a51d~tplv-k3u1fbpfcp-zoom-1.image)

这些标准的优先级从高到低排列，并且一个接一个地检查，直到确定一个获取的声明。如果在较高的标准上不能确定哪一个属性声明会获胜，级联将转到下一个标准。比如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1af3f1a7be6447f4933ab228037fb0e3~tplv-k3u1fbpfcp-zoom-1.image)

## 控制 CSS 的级联

你可能已经体会到了 CSS 级联的复杂性。不过也别太担心。因为我们在编写 CSS 代码时，主要是将我们的 CSS 放在一个相同的来源上，即 Author Origin（开发者编写的 CSS 样式）。因此，我们最终会使用选择器权重和顺序作为控制级联的方法。这样一来，时常会碰到：

-   使用较高权重的选择器来防止你的代码被后面的代码（或别人的代码）覆盖。但这也会引起另一个不良的现象，可能会在代码中新增很多带有 `!important` 的样式规则，这本身就会引起更多的问题，比如 `!important` 在 CSS 样式表中随处可见，需要覆盖的时候难以被覆盖
-   使用较低权重的选择器又很容易被后面的代码（或别人的代码）覆盖。比如你在引入第三方代码库或组件时，自己的代码可能被覆盖

这两个现象也是编写 CSS 代码，特别是在一个大型项目或多人协作的项目中常出现。也正因为如此，很多初学 CSS 的开发者，觉得 CSS 很烦人，很难维护。为了大家能更好的编写 CSS 和维护 CSS 代码，这些年来整个社区的开发者一直都在致力于提供各种方法来避免这些现象的出现。比如 BEM、ITCSS、OOCSS、CSS-in-JS、CSS Modules 和 CSS Scoped 等。这些方法论主要倚重于以下两个方面：

-   以这样的方式构建你的代码，创造某种逻辑顺序，使之适用于大多数情况
-   依靠类来保持选择器的权重尽可能的低

比如 [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)，他就分多个层来组织和管理 CSS 的级联：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b6ed5310621451ea9b452ccdfc2e540~tplv-k3u1fbpfcp-zoom-1.image)

虽然社区有很多方法来帮助我们编写 CSS 和掌握 CSS 的级联，但这些方法并不能百分之百的解决级联给我们带来的麻烦。主要还是：

-   由于源码顺序仍然起着决定性的作用，所以顺序带来的覆盖和冲突依旧未真正的解决（“所谓的顺序”并未真正的执行）
-   选择器权重仍然比层的顺序（源码顺序）更重要

也就是说，要真正的解决级联带来的这些问题，还是需要依靠 CSS 的级联层，也就是 CSS 的 `@layer` 规则。 例如上面按钮示例，我们可以这样编写 CSS ：

```CSS
@layer components, variations;
​
@layer variations {
    .button--secondary {
        background-color: #03a9f4;
        border-color: #03a9f4;
    }
    .button--outline {
        color: #6c757d;
        background-color: transparent;
        border-color: #6c757d;
    }
}
​
@layer components {
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.8125rem 2rem;
        border-radius: 0.5rem;
        border: 1px solid #712cf9;
        background-color: #712cf9;
        color: #fff;
        font-weight: 600;
        font-size: 1.25rem;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a53ff63a2b64ac3b5c8ae3d04cfac93~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGQjPbb>

## CSS 级联层简介

级联层是一个新的 CSS 特性，它将帮助 Web 开发人员在为大型项目编写 CSS 时获得更多的控制权。[级联层规范是这样描述的](https://www.w3.org/TR/css-cascade-5/#cascading)：

> Declarations within each origin and context can be explicitly assigned to a cascade layer. For the purpose of this step, any declaration not assigned to an explicit layer is added to an implicit final layer.Cascade layers (like declarations) are ordered by order of appearance. When comparing declarations that belong to different layers, then for normal rules the declaration whose cascade layer is last wins, and for important rules the declaration whose cascade layer is first wins. -- [CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/#cascading)

大致意思就是说，“每个来源（Origin）和上下文（Context）中的 CSS 规则都可以被明确的分配到指定的级联层（Layer）内，而没有显式被分配到级联层的 CSS 样式规则则会被添加到一个隐式的级联层中。级联层与我们写 CSS 的规则相似，是按照其在代码中出现的先后顺序排列的，排在越后面的级联层权重越大。当比较不在相同级联层的声明时（选择器权重，样式规则都一样），那么对于正常的规则（不带 `!important` 样式规则），级联层在最后的声明获胜，而对于重要的规则（带有 `!important` 的规则），级联层在前面的声明获胜”。

也就是说，开发者可以通过级联层（使用 `@layer` 规则），将你的 CSS 分成若干个层。这样一来，来源于用户（User Origin）和开发者（Author Origin）的 CSS 规则，开发者可以有权力来平衡他们。

简单地说： **级联层提供了一种结构化的方式来组织和平衡单一来源中的 CSS 规则，最终决定谁获胜**！。

由于 CSS 的级联层在 CSS 级联中有着独特的地位，使用它有一些好处，使开发者对级联有更多的控制。CSS 的级联层一般位于 “Style 属性”（Style Attribute）和 CSS 选择器权重（Specificity）之间，即：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93f7d7bdc8994d21b9acc32e5689926a~tplv-k3u1fbpfcp-zoom-1.image)

## CSS 级联层的使用

我们还是由浅入深，看看 CSS 级联层是如何使用的。先从创建级联层开始吧！

### 创建级联层

让我们将级联层应用到前面的示例中。

首先要做的是定义一个层。我们可以在 `@layer` 规则后紧跟一个名称来创建一个级联层：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f391e7cbf3cc473994d44c383454f7f5~tplv-k3u1fbpfcp-zoom-1.image)

我们定义了一个叫做 `components` 的级联层。在这个级联层中，我们需要添加默认的按钮样式：

```CSS
@layer components {
    .element {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.8125rem 2rem;
        border-radius: 0.5rem;
        border: 1px solid #712cf9;
        background-color: #712cf9;
        color: #fff;
        font-weight: 600;
        font-size: 1.25rem;
    }
}
```

接着，继续使用 `@layer` 为按钮变体创建一个级联层，并且命名为 `variations` ：

```CSS
@layer components {
    /* 默认按钮样式规则 */
}

@layer variations {
    .button--secondary {
        background-color: #03a9f4;
        border-color: #03a9f4;
    }
    .button--outline {
        color: #6c757d;
        background-color: transparent;
        border-color: #6c757d;
    }
}
```

这里定义两个级联层，如果使用图层来可视化级联层的话，那么它有点类似于 Photoshop 的图层，只不过需要知道的是，在 CSS 中最后定义的级联层将位于 Photoshop 图层列表中的最上面（图层列表中的第一个）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ddba1c564f44b558cbf58ab9df23374~tplv-k3u1fbpfcp-zoom-1.image)

在我们的示例中，`variations` 级联层是最后定义的层，因此它比 `components` 级联层具有更高的优先级。

在使用 `@layer` 规则定义级联层时，它可以是多行或单行。这个特性非常重要，因为它允许你在样式顶部的一个位置定义级联层的图层顺序。然后，他们可以通过引用相同的级联层名称：

```CSS
@layer components variations;

@layer components {
    /* 运用于组件的 CSS */
}

@layer variations {
    /* 运用于组件变体的 CSS */
}
```

你也可以将 `layer()` 函数添加到 `@import` 中，将引入的 CSS 样式表放置在指定的层中。这个特性对于将框架或第三方 CSS 样式表定义为一个级联层非常有用。

```CSS
@import url(bootstrap.css) layer(bootstrap);
```

另外，我们在创建级联层时，还可以将 `@layer` 与 `layer()` 一起使用，例如：

```CSS
@layer bootstrap, base, application;

@import url(bootstrap.css) layer(bootstrap); /* 将第三方样式 bootstrap.css 放置在 bootstrap 级联层中 */

@layer base {
      body {
          /* CSS */ 
      }
}
```

在这个例子中，我们实际上将第三方样式库 `bootstrap.css` 放在一个名为 `bootstrap` 级联层中，并且该级联层的优先级是最低的，然后是我们自己基本样式（`base` 级联层），最后是一个应用级联层（`application`）。

注意，规范对包含 `@import` 的顺序有特别的要求。一旦你在 `@import` 之后添加了一个 `@layer` ，那么在该级联层之后使用的任何 `@import` 都是无效的，并且不会被加载。因此，如果要添加多个 `@import` 时，则需要在创建更多级联层之前对它们进行分组。

除此之外，你可以只使用 `@layer` （后面不命名级联层名称）创建级联层，例如：

```CSS
@layer {
    body {
        background-color: red;
    }
}
```

或者在 `@import` 引入的 CSS 后面紧跟一个 `layer` 关键词，例如：

```CSS
@import url(bootstrap.css) layer;
```

这两种方式声明的级联层都被称为匿名级联层。

除了上述提到的方式之外，还有一种新的创建级联层的方式，只不过这种方式还在研究中，即通过 `<link>` 标签上的一个属性来创建级联层。它的方式可能会下面这样：

```HTML
 <link rel="stylesheet" href="reset.css" layer="reset">
```

也有可能使用 `<style>` 创建：

```HTML
<style layer="reset"> 
    *, *::before, *::after { 
        box-sizing: border-box; 
    } 
</style>
```

这些都还只是探究中，并未纳入到规范中，如果你对这方面的讨论感兴趣的话，可以点击《[Provide an attribute for assigning a to a cascade layer](https://github.com/w3c/csswg-drafts/issues/5853)》，查阅读相关讨论。当然，你自己也可以参与讨论。

到目前为止，创建级联层的方式主要有：

-   使用一个 `@layer` 块规则，将其子样式规则分配到该级联层
-   使用 `@layer` 语句规则，声明一个命名的级联层，但不分配任何样式规则
-   使用带有 `layer` 关键词或 `layer()` 函数的 `@import` 规则，将导入文件的内容分配到该级联层

### 匿名级联层

这里特意把匿名级联层拿出来单独说一下。

当一个 `@layer` 规则省略了它的级联层名称，或者一个 `@import` 规则使用了 `layer` 关键词并且没有提供级联层名称，这样创建的级联层，它的名称（Layer Name）获得了一个唯一的匿名参数（Anonymous Segment）；因此它不能从外部被引用。

因此，**匿名级联层声明的每一次出现都代表了一个独特的级联层**。

多个匿名级联层规则将其样式放入不同的级联层中，因为每一次出现都引用了一个不同的匿名级联层名称：

```CSS
@layer { 
    /* 匿名级联层 layer 1 */ 
} 

@layer { 
    /* 匿名级联层 layer 2 */ 
}
```

在一个单一的匿名级联层内，具有相同名称的子级联层指的是同一个级联层，因为它们共享同一个匿名的父级联层：

```CSS
@layer { 
    @layer foo { 
        /* 匿名级联层 layer 1 */ 
    } 
    @layer foo { 
        /* 也是匿名级联层 layer 1 */ 
    } 
} 
```

而在独立的匿名级联层中，具有相同名称的子级联层指的是不同的级联层，因为它们有不同的匿名级联层：

```CSS
@layer { 
    @layer foo { 
        /* 匿名级联层 layer 1 */ 
    } 
} 

@layer { 
    @layer foo { 
        /* 匿名级联层 layer 2 */ 
    } 
} 
```

一个没有名称的级联层不会提供任何外部钩子来重新排列或添加样式。 虽然这可能只是为了简洁方便，但它也可以被团队用作强制组织惯例的方式（该级联层的所有代码必须定义在同一个地方），或者被想要合并和隐藏一组内部“私有”级联层的库所使用，他们不希望暴露给开发者操作。

```CSS
/* bootstrap-base.css */ 
/* 围绕每个子文件的未命名的父级联层 */ 

@import url(base-forms.css) layer; 
@import url(base-links.css) layer; 
@import url(base-headings.css) layer; 
 
/* bootstrap.css */ 
/* 内部级联层名称被隐藏起来，不被访问，归入 base 级联层 */ 
@import url(bootstrap-base.css) layer(base); 

/* author.css */ 
/* 开发者可以访问bootstrap.base 级联层，但不能访问未命名的级联层 */ 
@import url(bootstrap.css) layer(bootstrap); 

/* 给bootstrap级联层添加额外的样式 */ 
@layer bootstrap { 
    /* CSS */ 
} 
```

就我个人而言，匿名级联层应该尽可能，甚至是不用。因为匿名级联层在操作上是很不灵活的，在改变匿名级联层顺序，给匿名级联层附加样式都是不易的。

### 管理级联层的顺序

> **级联层是按照它们第一次被声明的顺序来排序的**。

前面我们提到过，在还没有 CSS 级联层的时候，一般都是使用一些方法论来组织我们的CSS。拿 ITCSS 来说吧，把ITCSS 每个层用一个单独的 `.css` 文件来组织，并且会按下面这样的顺序一排序：

```CSS
@import 'setting.css'; 
@import 'tool.css'; 
@import 'generic.css'; 
@import 'element.css'; 
@import 'object.css'; 
@import 'component.css'; 
@import 'utilities.css';
```

换成 CSS 级联层的话，可以像下面这样创建七个级联层：`setting`、`tool`、`generic`、`element`、`object`、`component` 和 `utilities`：

```CSS
/* 创建第一层，并且命名为 setting */ 
@layer setting {
    :root{ 
        --base-font-size: 1rem; 
        --base-line-height: 1.5; 
        --base-text-color: #fff; 
        --base-background-color: #557; 
    } 
} 

/* 创建第二层，并且命名为 tool */
@layer tool {  
    /* 如果使用SCSS，一般是一些混合宏放置在这一层 */ 
    @mixin box-size($width:100%, $height:100%) { 
        width: $width; 
        height: $height; 
    } 
} 

/* 创建第三层，并且命名为 generic */
@layer generic {  
    *, *::before, *::after { 
        box-sizing: border-box; 
    } 
} 

/* 创建第四层，并且命名为 element */
@layer element {  
    body { 
        color: var(--base-text-color); 
        background-color: var(--base-background-color); 
    } 
    
    h1 { 
        font-size: clamp(var(--base-font-size), var(--base-font-size) + 8vw, var(--base-font-size)  4); 
    } 
} 

/* 创建第五层，并且命名为 object */
@layer object {  
    /* EMPTY */ 
} 

/* 创建第六层，并且命名为 component */
@layer component {  
    .title { 
        animation: bounce 2s ease infinite; 
        transform-origin: center bottom; 
        color: orange; 
    } 
 } 
 
/* 创建第七层，并且命名为 utilities */
@layer utilities {  
    @keyframes bounce { 
        from, 20%, 53%, to { 
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); 
            transform: translate3d(0, 0, 0); 
        } 
        
        40%, 43% { 
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06); 
            transform: translate3d(0, -30px, 0) scaleY(1.1); 
        } 
        
        70% { 
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06); 
            transform: translate3d(0, -15px, 0) scaleY(1.05); 
        } 
        
        80% { 
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); 
            transform: translate3d(0, 0, 0) scaleY(0.95); 
        } 
        
        90% { 
            transform: translate3d(0, -4px, 0) scaleY(1.02); 
        } 
    } 
} 
```

上面示例的级联层按照他们在代码中出现的顺序，层层递进：

-   ①：`setting`
-   ②：`tool`
-   ③：`generic`
-   ④：`element`
-   ⑤：`object`
-   ⑥：`component`
-   ⑦：`utilities`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57ef0eefdb9744c3ac2d81ae24da020c~tplv-k3u1fbpfcp-zoom-1.image)

级联层是按照他们第一次声明的顺序进行排序的，越排在后面的优先级越高。当你重新使用一个级联层名称时，指的是级联层名称相同，只是排在了后面。比如我们在上面的代码最后面又使用 `@layer` 创建了一个 `generics` 级联层：

```CSS
@layer setting { 
    /* 创建第一层，并且命名为 setting */ 
} 

@layer tool { 
    /* 创建第二层，并且命名为 tool */ 
} 

@layer generic { 
    /* 创建第三层，并且命名为 generic */ 
} 

@layer element { 
    /* 创建第四层，并且命名为 element */ 
} 

@layer object { 
    /* 创建第五层，并且命名为 object */ 
} 

@layer component { 
    /* 创建第六层，并且命名为 component */ 
} 

@layer utilities { 
    /* 创建第七层，并且命名为 utilities */ 
} 

@layer generics { 
    /* 重新创建了一个 generics 级联层，并放在最后面 */ 
    @media only screen and (width <= 760px) { 
        .title { 
            color: #f36; 
            text-shadow: 1px 1px 1px rgb(255 255 255 / .5); 
        } 
    } 
} 
```

这个重新创建的级联层 `generics` 中的样式会附加到已经存在的 `generics` 级联层中。级联层的顺序保持不变，因为第一次创建级联层时就已经决定了它们的顺序。

把上面示例简化一下，比如下面这个示例：

```HTML
<h1 class="title" id="title">Managing Layer Order</h1>
```

```CSS
@layer base { 
    h1 { /* 选择器权重是 (0, 0, 1) */ 
        color: orange; 
    } 
} 

@layer theme { 
    h1 { /* 选择器权重是 (0, 0, 1) */ 
        color: lime; 
    } 
} 

@layer base { 
    .title { /*选择器权重是 (0, 1, 0) */ 
        color: yellow; 
    } 
} 
```

这个示例使用 `@layer` 创建了 `base` 和 `theme` 两个级联层，由于 `theme` 排在 `base` 级联层的后面，`theme` 的优先级高于 `base`。同时，在 `theme` 后面又追加了 `base` 级联层，而且该级联层中的 `.title` 选择器的权重高于 `h1` 的选择器权重。按照选择器权重来决定样式的话，应该是 `.title` 的样式被运用，但因为新增的 `base` 级联层和最开始创建的 `base` 级联层会合并在一起，它相当于：

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
    
    .title { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
}
```

由于级联层 `theme` 优先级高于级联层 `base`，选择器 `.title` 和 `h1` 选中的都是同一个元素，即使 `.title` 选择器权重高于 `h1` 选择器权重也无济于事。浏览器最终会选择级联层 `theme` 中运用于 `h1` 的样式规则。你最后将看到的 `h1` 的文本颜色是 `lime`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8f9ce54e4b24021b19f7c82b0d1da53~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/VwVBoxj>

这就是 CSS 级联层的优势！

上面示例演示了，在 CSS 中重新使用一个相同的级联层名称时，级联层的顺序会保持不变，这样一来，我们可以使用 `@layer` 语句的规则先预设级联层的顺序，然后在后面将所需的样式规则附加到对应的级联层中。

```CSS
/* 预设级联层的顺序，并且相邻级联层之间有逗号分隔 */ 
@layer setting, tool, generic, element, object, component, utilities;
 
@layer setting { 
    /* 附加到级联层 setting 中的 CSS */ 
} 

@layer tool { 
    /* 附加到级联层 tool 中的 CSS */ 
} 

@layer generic { 
    /* 附加到级联层 generic 中的 CSS */ 
} 

@layer element { 
    /* 附加到级联层 element 中的 CSS */ 
} 

@layer object { 
    /* 附加到级联层 object 中的 CSS */ 
} 

@layer component { 
    /* 附加到级联层 component 中的 CSS */ 
} 

@layer utilities { 
    /* 附加到级联层 utilities 中的 CSS */ 
} 
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/825c74d9de7c45d18ac5dc8d0db31cb8~tplv-k3u1fbpfcp-zoom-1.image)

使用 `@layer` 语法规则（建议使用单行）预设好级联层顺序，然后在相应的级联层添加样式。在相应级联层添加样式时，他的顺序就变得不再重要了。

```CSS
@layer components, variations;

@layer components {
    .button {
        color: #fff;
        background-color: #d73a7c;
    }
}

@layer variations {
    .button--facebook {
        background-color: var(--brand-fb);
    }
}

/* 等同于 */
@layer components, variations;

@layer variations {
    .button--facebook {
        background-color: var(--brand-fb);
    }
}

@layer components {
    .button {
        color: #fff;
        background-color: #d73a7c;
    }
}
```

这两种不同的写法，最终结果是一样的，主要是因为 `@layer components, variations;` 已经决定了级联层的优先级。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca25afcad0c642b59fe26bc010b17abe~tplv-k3u1fbpfcp-zoom-1.image)

### CSS 中的级联层和级联

CSS 级联层的出现，改变了以前的级联算法。在原有的级联顺序（“来源与重要性” ⇝ “上下文” ⇝ “Style属性” ⇝ “权重” ⇝ “源码顺序”）的 “Style属性” 和 “权重” 之间插入了“级联层”（“来源与重要性” ⇝ “上下文” ⇝ “Style属性” ⇝ “级联层” ⇝ “权重” ⇝ “源码顺序”）。即**级联层位于权重和源码顺序之上**，因为，**在级联算法中，级联层比权重和源码顺序更具高优先级**。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/234cc0f0bbeb4d788719427e26018494~tplv-k3u1fbpfcp-zoom-1.image)

级联在评估级联层获胜的标准其实也参照了源码顺序的工作原理：**最后一个获胜**！也就是说，最后声明的级联层优先级要高于前面声明的级联层：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddf29cb841474e17948b81eeb367a8ab~tplv-k3u1fbpfcp-zoom-1.image)

**级联层（像声明的 CSS 规则）是按照源码顺序排列的。当比较属于不同层的声明时，那么对于正常的规则来说，级联层在最后的声明获胜**。 拿前面的示例解释这句话：

```HTML
<h1 class="title" id="title">CSS @layer</h1>
```

```CSS
@layer base, theme, component; 


@layer base { 
    #title { 
        color: red; 
    } 
} 

@layer theme { 
    .title { 
        color: blue; 
    } 
} 

@layer component { 
    h1 { 
        color: orange; 
    } 
}
```

我们创建了三个级联层，它们的顺序是：

-   ①：`base`
-   ②：`theme`
-   ③：`component`

这三个级联层中的 CSS 样式规则都是用来给 `<h1>` 元素设置文本颜色（`color`），他们不同之处是使用了不同的选择器：

-   在 `base` 级联层中使用了 ID 选择器（`#title`），选择器权重是 `(1, 0, 0)`
-   在 `theme` 级联层中使用了类选择器（`.title`），选择器权重是 `(0, 1, 0)`
-   在 `component` 级联层中使用了元素选择器（`h1`），选择器权重是 `(0, 0, 1)`

稍微对 CSS 级联有点了解的同学都知道，如果没有级联层的话，不管源码顺序如何，最终获胜的会是 `#title`，元素 `<h1>` 的文本颜色是`red`。但有了级联层之后，级联算法就不同了。就该示例来说，`component` 级联层最后被定义，根据 `@layer` 的单行语法规则，可以获知它优先级都要高于 `theme` 和 `base` 级联层（`theme` 级联层优先级高于 `base` 级联层），此时，虽然附加于 `component` 中的 `h1` 选择器权重最低，但最终胜出的还是它。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3df76aaeb9a44ab1947125435839243a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWyPrad>

这是因为，一旦通过级联按照出现在源码的顺序确定了获取的声明，级联是不会再检查 CSS 规则（附于级联层中的 CSS 规则）的选择器权重和出现在源码中的顺序。其中原理是级联层是级联的一个独立体，等级更高的标准。

注意，这并不意味着有了 CSS 级联层之后，就意味着 CSS 选择器权重和源码顺序就不再重要了。在同一个级联层中，这两个标准仍然重要。只不过在级联层之间比较 CSS 规则时，这两个标准可以被忽略！

### 简单地小结一下

如果你只想简单的了解一下 CSS 级联层（`@layer`）如何使用，那么你阅读到这里就可以了。你只需要知道：

-   通过级联层，可以把你的 CSS 划分成 `N` 个层（这个 `N` 是由你的喜好来决定的）
-   在使用 `@layer` 规则创建一个级联层时，你也要确定级联层的顺序，建议使用 `@layer` 单行语法规则来预设级联层的顺序
-   使用 `@layer` 可以创建带有名称的级联层，也可以创建匿名的级联层，它们不同的之处是，匿名级联层是在 `@layer` 规则和 `{}` 之间没有显式给级联层命名，即 `@layer {}`
-   使用 `@layer` 创建级联层时，后面不跟任何层名和样式块，该语句是正确的，但是一个无效的级联层，因为你无法给其附加任何样式规则
-   重新使用级联层的名称将会附加到已经创建的级联层上，且不会改变级联层的顺序
-   级联层的优先级也遵循源码顺序的标准，最后创建的级联层优先级最高，即最后的级联层获胜
-   级联在评估权重和源码顺序之前会先评估级联层。因为级联层是级联中的一个独立的，等级更高的标准。CSS 权重和源码顺序在级联层之间比较 CSS 规则时，可以被忽略；但在同一个级联层中，权重和源码顺序仍然很重要

你是否已经体会到了级联层给 CSS 带来的魅力了。如果你还想更深入的了解级联层，那请跟我继续往下。

## CSS 级联层中的一些细节

事实上，级联层中还有一些细节需要我们进一步的了解。我们先从无级联层样式开始吧！

### 无级联层样式的优先级

虽然 `@layer` 的出现，可以帮助我们对 CSS 进行分层，但也有可能在编写 CSS 的时候，有些 CSS 的规则不会附加到任何级联层中。比如：

```HTML
<h1 class="title" id="title">CSS @layer</h1>
```

```CSS
/* 案例一：https://codepen.io/airen/full/BaGOaKB => h1 的颜色是 orange */
h1 { 
    color: orange; 
} 

@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

/* 案例二：https://codepen.io/airen/full/vYQzYeM => h1 的颜色是 orange */ 
@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

h1 { 
    color: orange; 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

/* 案例三：https://codepen.io/airen/full/jOQvOZy => h1 的文本颜色是 orange */ 
@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

h1 { 
    color: orange; 
} 

/* 案例四：https://codepen.io/airen/full/abQabja => h1 的文本颜色是 orange */ 
h1 { 
    color: #f36; 
} 

@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

h1 { 
    color: #09f; 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

h1 { 
    color: orange; 
} 
```

正如上面代码所示，未附加到级联层中 CSS 规则，可能会在级联层前面、可能会在级联层之间，也有可能会在级联层之后。我们不管他们出现在哪，统一把这些 CSS 规则称为**无级联层样式**，也称**非分层样式**。

**没有在级联层中定义的样式将被收集到一个隐含级联层（Implicit Layer）** 。那么问题来了，这个隐含级联层的优先级是什么，是第一，还是最后？

注意，**隐含级联层（Implicit Layer）不同于匿名级联层（Anonymous Layer），匿名级联层是需要使用** **`@layer`** **规则创建一个不带有名称的级联层，而隐含级联层和** **`@layer`** **无任何关系，它只是没有在级联层中样式规则集合的一个统称**！

先来看第一种情况的结果：

```CSS
h1 { 
    color: orange; 
} 

@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
}
```

`h1` 最终的文本颜色是 `orange`，也就是在级联层 `base`，`theme` 之外的 `h1` 对应的样式规则获胜：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9797b158725b46afa3b40e48ad597e10~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/BaGOaKB>

接着看第二种情况，在上例基础上，把放置在级联层外的 `h1 {color: orange}` 规则移到 `base`和 `theme` 级联层之间：

```CSS
@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

h1 { 
    color: orange; 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 
```

结果和第一种情况是一样的，`h1` 文本颜色是 `orange`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2872f6a3854645d6b960eca1de08a147~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/vYQzYeM>

再来看第三种情况，把放置在级联层外的 `h1 {color: orange}` 规则移到所有级联层之后：

```CSS
@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
}

h1 { 
    color: orange; 
} 
```

你可能已经猜到结果了，是的，`h1` 的文本颜色依旧是 `orange`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f591babd88604d45b2b29d61a68f7e55~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOQvOZy>

最后一种情况，在级联层 `base` 和 `theme` 前后和中间都有设置 `h1` 元素的样式，比如：

```CSS
h1 { 
    color: #f36; 
} 

@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

h1 { 
    color: #09f; 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

h1 { 
    color: orange; 
} 
```

其实上面代码等同于：

```CSS
@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
}

/* 按源顺序，统一放在一个隐含级联层中 */ 

h1 { 
    color: #f36; 
} 

h1 { 
    color: #09f; 
} 

h1 { 
    color: orange; 
} 
```

在级联层 `base` 和 `theme` 之外不同位置有三个 `h1` 选择器设置了 `color` 值，最终出现在最后面的 `h1 {color: orange}` 获胜，文本颜色也是 `orange`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f41126c2f11a4018bc1be99953328426~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abQabja>

该示例将级联层 `base` 和 `theme` 之外的所有 `h1` 样式规则放置在一个隐含级联层中，并且它们将按照级联顺序来决定谁的权重更大。

我们对上面这个示例稍微调整一下，把三个选择器权重调整一下：

```CSS
#title { 
    color: #f36; 
} 

@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

.title { 
    color: #09f; 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

h1 { 
    color: orange; 
}
```

上面代码等同于：

```CSS
@layer base, theme; 

@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

#title { 
    color: #f36; 
} 

.title { 
    color: #09f; 
} 

h1 { 
    color: orange; 
}
```

此时，选择器 `#title` 获胜，`h1` 文本颜色相应调整为 `#f36`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26b0eb9ab55241f3b1d249a1af550bb8~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdQGdoy>

你可能已经发现了，隐含级联层（即由未分层的样式规则的集合）被放置在所有级联层的最后面。相当于：

```CSS
@layer base, theme, unlayered; 
 
@layer base { 
    h1 { 
        color: yellow; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

@layer unlayered { 
    #title { 
        color: #f36; 
    } 
    
    .title { 
        color: #09f; 
    } 
    
    h1 { 
        color: orange; 
    } 
}
```

注意，把这个 `unlayered` 级联层看作是一个隐含级联层（在这个示例中，`unlayered` 是一个显式的级联层），这里只是来模拟未分层的样式的优先级。在 `unlayered` 级联层中有分别有 `#title`、`.title` 和 `h1` 三个选择器，最终是 `#title` 获胜，因为他权重最高。这些是符合我们前面所介绍的级联优先级算法的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfa38c94a5a640999d0c9e0506272144~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXJyKe>

说这么多（用这么多个示例），只是想告诉大家，未分层的样式规则（不管样式规则在源码顺序）会统一分配到一个隐含级联层中，并且这个隐含级联层始终在最后面，其优先级也最高：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60e8b82b20b640cd9a659eac60a2362b~tplv-k3u1fbpfcp-zoom-1.image)

把上图中级联算法中的级联层单独拿出来对比：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09be8f8bcc604d24ad00a4fef661a93b~tplv-k3u1fbpfcp-zoom-1.image)

> 特别声明，最早隐藏级联层是放置在所有级联层最前面，优先级最低，只不过后来 CSS 工作组还是决定将隐含层放在所有级联层最后面，优先级最高，到目前为止，浏览器也是这样实现的（也就是上面示例所展示的效果）。有关于这方面的讨论可以阅读 Github上的《[Reconsider placement of unlayered styles, for better progressive enhancement?](https://github.com/w3c/csswg-drafts/issues/6284)》相关讨论！同时还有另一个 Issues:《[Allow authors to explicitly place unlayered styles in the cascade layer order](https://github.com/w3c/csswg-drafts/issues/6323)》在讨论：“**在未来，我们可能会获得控制隐含级联层位置的能力，即可以控制隐含层在级联层中的顺序**”！

### 级联层的嵌套

CSS 的级联层是可以被嵌套的，即 `@layer` 规则中嵌套 `@layer` 规则：

```CSS
@layer myLayer { 
    @layer mySubLayer {
        /* CSS */
    } 
}
```

比如下面这样的一个示例：

```CSS
/* 创建第一层，并且命名为 base */ 
@layer base { 
    h1 { 
        color: orange; 
    } 
} 

/* 创建第二层，并且命名为 framework */ 
@layer framework { 
    /* 第二层里的第一层，并且命名为 base */ 
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    /* 第二层里的第二层，并且命名为 theme */ 
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
} 
```

`h1` 的文本颜色是 `yellow`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9f5cca7391f420d9329c36a08a12d83~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/qBQMjBp>

在这个例子中，有两个外级联层：

-   ①：`base`
-   ②：`framework`

其中 `framework` 级联层又包含了两个子级联层：

-   ①：`base`
-   ②：`theme`

示例中有两个级联层命名为 `base`，但这两个级联层是不同的，即 `framework.base` 级联层（指的是级联层`framework` 的子级联层 `base`）和外部的级联层 `base` 是不同的。也就是说，这两个 `base` 级联层并不冲突，因为第二个 `base` 级联层只是 `framework` 级联层内部的一部分。即如果有外部级联层的话，级联层的名字范围是其外层的级联层。简单地说，嵌套在某个级联层中的级联层，他们的作用域是在其父级联层中。它们之间的隶属关系就有点像 DOM 树的样子：

-   ①：`base`
-   ②：`framework`
    -   ②~①：`base`
    -   ②~②：`theme`

或作为一个带有嵌套标识的扁平化列表：

-   ①：`base`
-   ②：`framework.base`
-   ③：`framework.theme`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b9a993cb90a45faab5bd969668e4393~tplv-k3u1fbpfcp-zoom-1.image)

我们再花点时间 CSS 级联算法是怎么处理级联层嵌套的。

首先，同一个嵌套层中的级联层也遵循前面所说的级联算法，最后面的级联层获胜：

```CSS
@layer framework { 
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
}
```

`h1` 的文本色是 `yellow`。

```CSS
@layer framework { 
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
    
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
} 
```

`h1` 的文本色是 `lime` 。

如果跳出父级联层的话，CSS 的级联算法先会比较最外层的级联层顺序，然后再比较内部的级联层顺序，比如：

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer framework { 
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
} 
```

`h1` 文本颜色为 `yellow`。

```CSS
@layer framework { 
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
} 

@layer base { 
    h1 { 
        color: orange; 
    } 
} 
```

`h1` 文本颜色为 `orange`。

CSS 级联算法先会根据最外层的级联层顺序做优先级评估，同样是最后一个级联层获胜。如果最后一个级联层里面还有嵌套的级联层，那么再比较嵌套的级联层顺序，同样是最后一个级联层获胜。

相当于把嵌套的级联层拍平，然后按照级联层顺序来做评估。比如上面两个示例，拍平嵌套的级联层，他们的顺序分别是：

-   ①：`base`
-   ②：`framework.base`
-   ③：`framework.theme`

即：

```CSS
@layer base, framework.base, framework.theme;

@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer framework { 
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
} 
```

嵌套在 `framework` 级联层中的 `theme`级联层获胜。

另一个示例只是将 `base` 级联层移到最后：

-   ①：`framework.base`
-   ②：`framework.theme`
-   ③：`base`

即：

```CSS
@layer framework.base, framework.theme, base;

@layer framework { 
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
} 

@layer base { 
    h1 { 
        color: orange; 
    } 
} 
```

外层的 `base` 级联层优先级更高，因此它获胜。

在介绍未分层样式时，我们知道未分层样式将会纳入到一个隐含级联层，具有最高优先权（因为会放在所有级联层的后面）。那么在嵌套级联层中，外面的级联层可有会有 CSS 样式规则不会附加到内嵌套的级联层中。比如：

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer framework { 
    h1 { 
        color: lime; 
    } 
    
    @layer base { 
        h1 { 
            color: yellow; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: #f36; 
        } 
    } 
} 
```

这个时候，CSS 级联算法也遵循前面所说的，隐含级联层优先级最高，在嵌套的级联层也是如此。因此，该示例你看到的 `h1` 文本颜色是 `lime`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d25d619325b42b28a108de35aea730a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/KKrxqWM>

如果我们用树形结构来描述上面示例级联层顺序，你就能知道为什么文本颜色是 `lime` 了：

-   ①：`base`
-   ②：`framework`
    -   ②~①：`base`
    -   ②~②：`theme`
    -   ②~③：unlayered

把它们拍平的话，像下面这样：

-   ①：`base`
-   ②：`framework.base`
-   ③：`framework.theme`
-   ④：`framework` 级联层中的隐含级联层，你可以看作是 `framework.unlayered`

相当于：

```CSS
@layer base, framework.base, fromework.theme, framework.unlayered;

@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer framework { 
    @layer base { 
        h1 { 
            color: yellow; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: #f36; 
        } 
    }
    
    @layer unlayered {
        h1 { 
            color: lime; 
        } 
    } 
} 
```

这样是不是好理解得多了。

在嵌套级联层中，也可以使用 `@layer` 单行语法规则对嵌套的级联层顺序做预设，然后在相应的级联层中附加 CSS规则：

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer framework { 
    @layer base, theme; 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
    
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
} 
```

就这个示例而言，`framework` 级联层中的嵌套级联层的顺序已经被 `@layer base, theme` 语句预设了，因此执着下来的 `@layer base {}` 和 `@layer theme{}` 谁前谁后已无济于事了。最终都是 `framework.theme` 最有更高的优先权。 因此，`h1` 的文本颜色是 `yellow` ：


![fig-33.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91f4ec3dae424b4c830b26e66cbb58ee~tplv-k3u1fbpfcp-watermark.image?)

> Demo 地址：<https://codepen.io/airen/full/qBQMjVy>

另外，我们同样可以在嵌套的级联层中使用相同的级联层名称，对应的样式规则也会合并到前面已有的级联层中，比如：

```CSS
@layer framework { 
    @layer base, theme; 
    
    @layer base { 
        h1 { 
            color: red; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: blue; 
        } 
    } 
    
    @layer base { 
        h1 { 
            color: orange; 
        } 
    } 
} 
```

不过我们还可以使用下面这种方式达到上面代码等同的效果：

```CSS
@layer framework { 
    @layer base, theme; 
    
    @layer base { 
        h1 { 
            color: red; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: blue; 
        } 
    } 
} 

/* 样式将被添加到framework级联层中的base级联层 */ 
@layer framework.base { 
    h1 { 
        color: orange; 
    } 
}
```

我们还可以在样式文件第一行就预定好级联层顺序，包括含有子级联层的顺序。例如：

```CSS
@layer base, theme, frameworks.base, frameworks.theme;

@layer base {

}

@layer theme {

}

@layer frameworks.base {

}

@layer frameworks.theme {

}
```

也就是说，如果你要在外层引用某个级联层嵌套的级联层时，可以用它的全名（`父级联层名称 + 嵌套的级联层`，只不过他们之间用点号`.`来连接），比如 `myLayer.mySubLayer` 。当然前面可以使用 `@layer` 或带有 `layer` 关键词或 `layer()` 函数的 `@import`，比如：

```CSS
@layer myLayer.mySubLayer {}; 
@import url(mysublayer.css) layer(myLayer.mySubLayer); 
@import url(mysublayer.css) myLayer.mySubLayer; 
@import(mysublayer.css) layer(myLayer.mySubLayer); 
```

最后再看一个示例。嵌套一个匿名的级联层，比如：

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer framework { 
    @layer base, theme; 
    
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer { 
        h1 { 
            color: #09f; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
} 
```

上面示例，在 `frameworkd` 级联层中使用 `@layer` 规则创建了一个匿名的级联层（`@layer` 后紧跟 `{}`，没有级联层名称）。这样的操作同样是有效的，可以看到效果的，也就是说，同样可以在级联层中嵌套匿名级联层，只不过后面无法在别的地方给他附加样式。

### 匿名级联层优先级如何计算

在介绍级联层顺序时，我们已知道结论： **位于最后的级联层优先级最高，如果有隐含级联层存在，那它的优先权高于所有声明的级联层**。 那么匿名级联层权重如何计算呢？。

在回答该问题之前，我们先来看一个带有匿名级联层的示例：

```HTML
<h1 class="title" id="title">Anonymity Layer</h1>
```

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
} 

/* 匿名级联层 */ 
@layer { 
    h1 { 
        color: lime; 
    } 
} 

@layer theme { 
    h1 { 
        color: yellow; 
    } 
}
```

就该示例而言，级联层的顺序将会按照 `@layer` 在源码代码出现顺序来评估级联层优先级：

-   ①：`base`
-   ②：Anonymous Layer (匿名级联层)
-   ③：`theme`

`theme` 级联层位于所有已定义的级联层最后，他优先级最高，所以你看到的 `h1` 文本颜色是 `yellow`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23db8af9c34541d692b46868d8b77beb~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/abQawaj>

假设我们在上面示例基础上新增一个匿名级联层：

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer { 
    h1 { 
        color: lime; 
    } 
} 

@layer theme { 
    h1 { 
        color: yellow; 
    } 
} 

@layer { 
    h1 { 
        color: #f36; 
    } 
} 
```

相应的级联层顺序是：

-   ①：`base`
-   ②：Anonymous Layer (匿名级联层)
-   ③：`theme`
-   ④：Anonymous Layer (匿名级联层)

最后附加的匿名级联层成了最后一个级联层，因此它的权重最高，最终 `h1` 文本的颜色是 `#f36`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/794f36eb6ca247f6920960bf4204c72a~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/ExOeXGp>

从这两个示例的结果来看，我们可以得到第一个结论： 使用 `@layer` 代码块（即 `@layer layername {}` 或 `@layer {}`）创建的级联层（不管是具名还是匿名的级联层），CSS 级联在评估级联层的权重时遵循源码顺序标准，即最后一个 `@layer` 创建的级联层优先级最高！

我们在这个示例基础上加上隐含级联层：

```CSS
/* 隐藏级联层 */
h1 { 
    color: #09f; 
} 

@layer base { 
    h1 { 
        color: orange; 
    } 
} 

/* 匿名级联层 */
@layer { 
    h1 { 
        color: lime; 
    } 
} 

@layer theme { 
    h1 { 
        color: yellow; 
    } 
} 

@layer { 
    h1 { 
        color: #f36; 
    } 
} 
```

这个情况之下，`h1` 文本的颜色是 `#09f`。**隐含级联层优先级是最高的，该原则依旧成立** ：

-   ①：`base`
-   ②：Anonymous Layer (匿名级联层)
-   ③：`theme`
-   ④：Anonymous Layer (匿名级联层)
-   ⑤：Unlayer（隐含级联层）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1a48986918f4e0286148235e78db4b5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/RwqYgXw>

前面我们说过，可以使用 `@layer` 单行语法规则对级联层顺序做预设，比如：

```CSS
@layer base, theme; 
 
@layer theme { 
    h1 { 
        color: lime; 
    } 
} 

@layer base { 
    h1 { 
        color: orange; 
    } 
} 
```

这个示例，级联层的顺序是：

-   ①：`base`
-   ②：`theme`

即，`theme` 级联层优先级最高，`h1` 文本的颜色是 `lime`。

如果我们在 `base` 和 `theme` 之间使用 `@layer {}` 插入一个匿名级联层：

```CSS
@layer base, theme; 
 
@layer theme { 
    h1 { 
        color: lime; 
    } 
} 
​
@layer { 
    h1 { 
        color: yellow; 
    } 
}
​
@layer base { 
    h1 { 
        color: orange; 
    } 
} 
```

前面说过了，`@layer base, theme;` 语句对已命名的级联层的顺序做了预设，**在这种环境下，新创建的匿名级联层将会追加在已预设级联层的末尾**。此时，级联层的顺序则变成：

-   ①：`base`
-   ②：`theme`
-   ③：Anonymous Layer (匿名级联层)

也就是说，匿名级联层优先级最高，`h1` 的文本颜色则是 `yellow`。

再换一个情景，如果 `@layer` 创建的匿名级联层位于 `@layer` 单行语法规则预设的级联层前面呢？

```CSS
@layer { 
    h1 { 
        color: yellow; 
    } 
} 
​
@layer base, theme; 
​
@layer base { 
    h1 { 
        color: orange; 
    } 
} 
​
@layer theme { 
    h1 { 
        color: lime; 
    } 
}
```

你可能已经想到了，此时级联层的顺序变成了：

-   ①：Anonymous Layer (匿名级联层)
-   ②：`base`
-   ③：`theme`

这种场景之下，匿名级联层排在了最前面，优先级最低，而 `theme` 级联层排在了最后，其优先级成了最高。`h1` 的文本颜色则是 `lime`。

这个时候，即使你在后成继续使用 `@layer` 创建匿名级联层也不会改变级联层顺序，因为新增的匿名级联层会合到最开始创建的匿名级联层：

```CSS
@layer { 
    h1 { 
        color: yellow; 
    } 
} 
​
@layer base, theme; 
​
@layer base { 
    h1 { 
        color: orange; 
    } 
} 
​
@layer theme { 
    h1 { 
        color: lime; 
    } 
} 
​
@layer { 
    h1 { 
        color: #f36; 
    } 
}
```

级联层顺序没有改变：

-   ①：Anonymous Layer (匿名级联层)
-   ②：`base`
-   ③：`theme`
-   ④：Anonymous Layer (匿名级联层)

`h1` 的文本颜色来自于后面新增的匿名级联层的 `#f36`。

要是在这个基础有一个隐含级联层：

```CSS
/* 隐含级联层 */ 
h1 { 
    color: #09f; 
} 
​
/* 首个匿名级联层 */ 
@layer { 
    h1 { 
        color: yellow; 
    } 
} 
​
/* 预设级联层顺序 */ 
@layer base, theme; 
​
/* 给 base 级联层添加样式 */ 
@layer base { 
    h1 { 
        color: orange; 
    } 
} 
​
/* 给 theme 级联层添加样式 */ 
@layer theme { 
    h1 { 
        color: lime; 
    } 
} 
​
/* 新增匿名层，将会合进首个已创建的匿名级联层 */ 
@layer { 
    h1 { 
        color: #f36; 
    } 
} 
```

这个示例的级联层顺序是：

-   ①：Anonymous Layer (匿名级联层)
-   ②：`base`
-   ③：`theme`
-   ④：Anonymous Layer (匿名级联层)
-   ⑤：Unlayer（隐含级联层）

`h1` 的文本颜色来自于隐含级联层，即 `#09f`。

这样我们可以得到第二个结论： **如果** **`@layer {}`** **创建的匿名级联层出现在** **`@layer`** **单行语法预设级联层之前，则该匿名级联层会放置在已预设的级联层最前面，匿名级联层优先级最低；如果** **`@layer{}`** **创建的匿名级联层出现在** **`@layer`** **单行语法预设的级联层之后，则该匿名级联层会追加到已预设的级联层末尾（最后面），匿名级联层优先级最高；如果** **`@layer{}`** **同时出现在** **`@layer`** **单行语法预设的级联层前后，则会按照前面两种情况对匿名级联层排序，最终排在后面的匿名级联层获胜。对于隐含级联层而言，它始终会在所有级联层最后，具有最高的优先级**。

上面展示的示例都是平级的，没有嵌套的级联层。其实上面的两条结论同样适用于嵌套的级联层。比如下面这个示例：

```CSS
@layer base { 
    h1 { 
        color: orange; 
    } 
} 
​
@layer framework { 
    @layer base, theme; 
    
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer { 
        h1 { 
            color: #09f; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
} 
​
@layer { 
    h1 { 
        color: red; 
    } 
} 
```

根据前面介绍的，示例中的所有级联层的顺序则是：

-   ①：`base`
-   ②：`framework.base`
-   ③：`framework.theme`
-   ④：`framework` 级联层内部的匿名级联层，你可以看作是 `framework.anonymouslayer`
-   ⑤：Anonymous Layer (匿名级联层)

从上面的排序不难发现，排在最外面的匿名级联层优先级权重最高，因此 `h1` 文本颜色是 `red`。

注意，外部的匿名级联层（`@layer`）和嵌套在 `framework` 级联层的匿名级联层，并不是相同的匿名级联层！

我们再调整一下上面的示例，让它看上去更复杂一点点：

```CSS
@layer { 
    h1 { 
        color: red; 
    } 
} 

@layer base { 
    h1 { 
        color: orange; 
    } 
} 

@layer framework { 
    @layer { 
        h1 { 
            color: #2290ef; 
        } 
    } 
    
    @layer base, theme; 
    
    @layer base { 
        h1 { 
            color: lime; 
        } 
    } 
    
    @layer { 
        h1 { 
            color: #09f; 
        } 
    } 
    
    @layer theme { 
        h1 { 
            color: yellow; 
        } 
    } 
    
    @layer { 
        color: #909fff; 
    } 
} 

@layer { 
    h1 { 
        color: #900aef; 
    } 
} 
```

千万别被上面示例代码吥倒了，事实上没有你想的那么复杂。我们只需要按照前面的原则，把所有级联层按下面的方式，将其列出来，就可以很快知道最终哪个级联层优先级最高：

-   ①：Anonymous Layer (匿名级联层)
-   ②：`base`
-   ③：`framework` 级联层内部的匿名级联层，你可以看作是 `framework.anonymouslayer`
-   ④：`framework.base`
-   ⑤：`framework.theme`
-   ⑥：`framework` 级联层内部的匿名级联层，你可以看作是 `framework.anonymouslayer`
-   ⑦：Anonymous Layer (匿名级联层)

最后出现的匿名级联层获胜，`h1` 文本颜色为 `#900aef`。 是不是没有你想象的那么复杂，但实际使用的时候，还是建议不要这么使用，而且应该尽可能的避免匿名级联层的使用。

现在我们可以来回答标题所提的问题了： **CSS 级联对于匿名级联层的权重的评估始终遵循的是级联层在源码中的顺序，简而言之，出现在最后的级联层优先级最高，不管是具名（显式命名的级联层）还是匿名级联层，都是如此。除隐含级联层之外，因为隐含级联层始终是在所有级联层（包括具名和匿名级联层）最后**！

### 级联层和 !important 的使用

CSS 级联在评估来源（Origin）标准时，CSS 级联对几个来源的排序如下（从高到低排序）：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/275ce277630c409e8bda4c99e74e1869~tplv-k3u1fbpfcp-zoom-1.image)

你可能已经注意到带有 `!important` 的来源与正常（即不带 `!important` 的来源）的对应物的顺序正好相反，这其实就是 CSS 的工作方式！ **当一个声明被显式标记为** **`!important`** **时，它在级联中的权重就会增加并颠倒优先顺序**。

这个反转规则也适用于级联层中的声明：**带有** **`!important`** **声明将被放在“重要开发者”来源（Important Author Origin），但与“正常作者”来源（Normal Author Origin）相比，级联层将有相反的顺序**。

在级联层中，当比较属于不同级联层的声明时，那么对于正常的规则，级联层在最后的声明获胜，而对于重要的规则（带有 `!important` 的规则），级联层在前的声明获胜。

来看一个示例，使用 `@layer` 声明了四人级联层：

```CSS
@layer reset, base, theme, utilities; 
```

这些级联层中的正常声明都在“正常作者”来源（Normal Author Origin）中，并将按此排序：

-   ①：正常 `reset` 级联层
-   ②：正常 `base` 级联层
-   ③：正常 `theme` 级联层
-   ④：正常 `utilities` 级联层

然而，这些级联层中的重要声明（带有 `!important` 声明）都将进入“重要用户”来源（Important User Origin），并将被反向排序：

-   ①：重要 `utilities` 级联层
-   ②：重要 `theme` 级联层
-   ③：重要 `base` 级联层
-   ④：重要 `reset` 级联层

因为“普通未分层样式”（普通隐含级联层，Normal Unlayered Styles）隐含在最后，这也意味着“重要未分层样式”（重要隐含级联层，Important Unlayered Styles）将被放置在第一位。所以，在级联层中的“重要声明”会赢过在隐含级联层中的“重要声明”。这个重要声明指的是带有 `!important` 标记的声明。

来看一个具体的示例：

```HTML
<h1 class="title">With !important</h1>
<p class="title">Without !important</p> 
```

```CSS
@layer base, theme, component; 
​
@layer base { 
    h1 { 
        color: orange !important; 
    } 
    
    p { 
        color: orange; 
    } 
} 
​
@layer theme { 
    h1 { 
        color: lime !important; 
    } 
    
    p { 
        color: lime; 
    } 
} 
​
@layer component { 
    h1 { 
        color: yellow !important; 
    } 
    
    p { 
        color: yellow; 
    } 
}
```

上面代码使用 `@layer` 声明了 `base`、`theme` 和 `component` 三个级联层，在相应的级联层中都给 `h1` 和 `p` 元素设置了 `color` 样式规则，不同的是，`h1` 的 `color` 值带有 `!important` 标识符。

先来看不带 `!important` 的 `p` 元素，相应的级联层顺序：

-   ①：`base`
-   ②：`theme`
-   ③：`component`

最终级联层 `component` 获胜，因此 `p` 元素文本的颜色是 `yellow`。

再来看带有 `!important` 的 `h1` 元素，相应的级联层却刚好与不带 `!important` 的 `p` 元素相反：

-   ①：`component`
-   ②：`theme`
-   ③：`base`

最终级联层 `base` 获胜，因此 `h1` 元素文本的颜色是 `orange`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b62e5e9490b24968b087a2d606ab9a93~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWyPaVG>

如果我们在同一个元素不同级联层中声明样式规则时，有的带有 `!important` 声明，有的则没有：

```CSS
@layer reset, base, theme, component; 

@layer reset { 
    h1 { 
        color: #f36; 
    } 
} 

@layer base { 
    h1 { 
        color: orange !important; 
    } 
} 

@layer theme { 
    h1 { 
        color: lime !important; 
    } 
} 

@layer component { 
    h1 { 
        color: yellow; 
    } 
}
```

`reset` 和 `component` 级联层样式规则没有带 `!important`，`base` 和 `theme` 级联层中样式规则带有 `!important`。虽然 `@layer` 规则预设了级联层顺序：

-   ①：`reset`
-   ②：`base`
-   ③：`theme`
-   ④：`component`

但带有 `!important` 标识符时，级联层顺序则变成了：

-   ①：`reset`
-   ②：`component`
-   ③：`theme`
-   ④：`base`

最终运用于 `h1` 元素的 `color` 值是来自于 `base` 级联层，即 `orange`：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/063ccf8ce80b465f8be7dbd5ba1e3b37~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYXJjrV>

是不是有点晕，感觉是玄学一样。如果不看代码在浏览器中的渲染效果，真的整不明白，最终 CSS 级联算法会评估哪个级联层，哪条规则获胜。幸运的是，我们一直提倡在编写 CSS 代码的时候，不需要使用 `!important`。

需要特别提出的是，`@layer` 规则后不能带有 `!important` 标识符：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8222fb68b14d43d09018e381fbcef56d~tplv-k3u1fbpfcp-zoom-1.image)

### 将值恢复到前一层

我们曾在小册的《[09 | CSS 显式默认值：inherit，initial，unset 和 revert](https://juejin.cn/book/7223230325122400288/section/7232094160071688227)》一节课中详细介绍了如何使用关键词 `inherit` 、`initial` 、`unset` 和 `revert` 来重置 CSS 属性的值。并且在该节课最后预留了一个关键词 `revert-layer` 没有介绍。这是因为 `revert-layer` 是在 CSS 级联层出现之后新增的一个关键词。在这里，我们来聊聊它。

在 CSS 中，我们可以使用几种方法将级联中的样式“恢复”到以前的值，该值由较低优先级的源或层定义。这包括许多现有的全局 CSS 值，即 `inherit` 、`initial` 、`unset` 和 `revert` ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26a5e11767a046879ccc8b1f2cbf9468~tplv-k3u1fbpfcp-zoom-1.image)

-   **`initial`** 会将属性设置为其初始值，即由浏览器定义的值。这个值通常在 CSS 规范中为该属性定义。
-   **`inherit`** 将属性设置为其父元素的值。如果没有继承值，则将使用该属性的初始值。
-   **`unset`** ，如果属性可以继承，则将属性设置为其继承值（等同于 `inherit`）。否则，将使用该属性的初始值（等同于 `initial` ）。这意味着 `unset` 允许继承，并且适用于将属性重置为其默认值，同时仍然允许从父元素继承。
-   **`revert`** 与 `unset` 类似，如果属性可以继承，则将属性设置为其继承值。否则，将使用该属性的初始值。不同之处在于，`revert` 还考虑了任何用户定义的样式或作者样式表可能应用于元素。如果没有用户定义或作者样式，则 `revert` 的行为与 `unset` 相同。

级联层添加了一个新的关键词，即 `revert-layer` 。它的工作原理与 `revert` 相同，但只删除我们在当前级联层中应用的值。我们可以使用它来回滚级联层，并使用在前一层中定义的任何值。例如：

```HTML
<h1>Without revert-layer In CSS Layer</h1>
<h1 class="title">With revert-layer In CSS Layer</h1>
```

```CSS
@layer base, theme;
​
@layer base {
    h1 {
        color: orange;
    }
}
​
@layer theme {
    h1 {
        color: green;
    }
    
    .title {
        color: revert-layer;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/445a954c2e574f98b9b33f9928b86583~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poQOrqx>

带有 `.title` 的 `h1` 元素的文本色（`color`）将回滚到上一个级联层，即 `base` 级联层。因此，带有 `.title` 的 `h1` 的文本颜色是 `orange` ，而没带 `.title` 的文本颜色依旧根据级联层优先级决定，所以你看到的是 `green` 。

需要知道的是，**当你在非分层样式中（隐含级联层）中使用** **`revert-layer`** **时，它的行为与** **`revert`** **相同**。

### 级联层和条件 CSS 规则的相互嵌套

在 CSS 中，我们可以使用 `@media` 和 `@supports` 根据相应的条件来设置不同的样式规则。在 CSS 中，`@layer` 和这些条件 CSS 的 `@` 规则可以相互嵌套，但所起的作用则有所差异。

我们先来看 `@layer` 和 `@media` 的嵌套。 CSS 媒体查询 `@media` 可以像其他 CSS 样式规则一样直接放在 `@layer` 代码块里面，比如：

```CSS
@layer base { 
    h1 { 
        color: red; 
    } 
    
    @media screen and (width <= 760px) { 
        h1 { 
            color: orange; 
        } 
    } 
} 
```

这个示例中的 `@media` 只被用于 `base` 级联层中。当媒体条件为真（`true`）时，`base` 级联层中的 `h1` 的`color` 为 `orange`，反之则会取 `color` 为 `red`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87d0f2fd51664c22adcac10a960d9c8e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYQLeje>

也就是说，如果在 `base` 级联层之外还有其他样式规则，比如其他级联层，而且优先级还高于 `base` 级联层时，那么位于 `base` 级联层里的媒体查询会看上去无效。比如在上面示例基础新增一个 `theme` 级联层：

```CSS
@layer base { 
    h1 { 
        color: red; 
    } 
    
    @media screen and (width <= 760px) { 
        h1 { 
            color: orange; 
        } 
    } 
} 

@layer theme {
    h1 {
        color: blue;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6999bb861b2e45a3b56a1744b11a6c5c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/bGQxYQe>

在这个示例中，即使媒体查询条件为真，`base` 级联层运用了媒体查询中的样式规则，但 `theme` 级联层优先级高于 `base` 级联层。因此，不管视窗宽度如何改变，最终 `h1` 都取自 `theme` 级联层中的样式规则，即 `color` 为 `blue` 。

除了将媒体查询放在级联层里这种使用方式之外，还可以将级联层放在媒体查询里面。比如：

```CSS
@media screen and (width <= 760px) { 
    @layer base { 
        h1 { 
            color: orange; 
        } 
    } 
} 
```

当一个 `@layer` 被嵌套在一个 `@media` 中时，只有媒体查询条件为真时，级联层才会被使用。比如下面这个示例：

```CSS
@layer reset { 
    h1 { 
        color: yellow; 
    } 
} 
​
@media screen and (width >= 760px) { 
    @layer base { 
        h1 { 
            color: orange; 
        } 
    } 
} 
​
@media (prefers-color-scheme: dark) { 
    @layer theme { 
        h1 { 
            color: lime; 
        } 
    } 
} 
```

该示例中级联层的使用和媒体查询条件真假有着紧密的关系：

-   如果两个媒体查询条件都为假（`false`）时，只有 `reset` 级联层中的样式规则被运用，此时，`h1` 的文本颜色为 `yellow`
-   如果第一个媒体查询条件成立（`true`），第二个媒体查询条件不成立（`false`），这个时候级联层相当于 `@layer reset, base;`，`base` 级联层优于 `reset` 级联层，此时，`h1` 的文本颜色为 `orange`
-   如果第一个媒体查询条件不成立（`false`），第二个媒体查询条件成立（`true`），这个时候级联层相当于 `@layer reset, theme;`，`theme` 级联层优于 `reset` 级联层，此时，`h1` 的文本颜色为 `lime`
-   如果两个媒体查询条件都成立（`true`），这个时候级联层相当于 `@layer reset, base, theme;`，`theme` 级联层优先级最高，此时，`h1` 的文本颜色为 `lime`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef4073eb447411089ca83a7bc1ac764~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYjdyVm>

如果想避免这种行为的话，建议事先使用 `@layer` 对级联层顺序做预设，并且应该尽可能避免在媒体查询规则中定义新的级联层。

在 CSS 中，`@supports` 和 `@media` 类似，可以根据相应的条件结果返回相应的结果。同样的，`@supports` 也以和 `@layer` 相互嵌套：

```CSS
/* base 级联层始终生效 */ 
@layer base { 
    /* 支持 display: grid 的浏览器生效 */ 
    @supports (display: grid) { 
        .container { 
            display: grid; 
        } 
    } 
} 
​
/* 只有支持grid 的浏览器，grid级联层才会被创建 */ 
@supports (display: grid) { 
    @layer grid { 
        .container { 
            display: grid; 
        } 
    } 
} 
```

### 级联层和定义名称的规则

CSS 中有很多带有 `@` 前缀的规则，比如上面介绍的 `@media` 和 `@supports` 有条件判断的能力。除此之外，还有一些 `@` 规则称为“定义名称的规则”，比如我们熟悉的 `@keyframes` 和 `@font-face`，以及新出的 `@scroll-timeline` 规则。但它们和 `@layer` 规则的嵌套和 `@media` 有所不同。就拿 `@keyframes` 来说吧，它能放在 `@layer` 中，但 `@layer` 一般不嵌套在 `@keyframes` 中。

```CSS
@layer framework, override; 

@layer framework { 
    @keyframes slide-left { 
        from { 
            margin-left: 0; 
        } 
        to { 
            margin-left: -100%; 
        } 
    } 
} 

@layer override { 
    @keyframes slide-left { 
        from { 
            translate: 0; 
        } 
        to { 
            translate: -100% 0; 
        } 
    } 
} 

.sidebar { 
    animation: slide-left 300ms linear; 
}
```

在代码的第一行使用 `@layer` 对 `framework` 和 `override` 级联层的顺序做了预设，即 `override` 级联层优先级高于 `framework`，因此，用于 `.sidebar` 的 `animation-name` 是来自于 `override` 级联层的 `slide-left`，使用的是 `translate`。

## CSS 级联层的用例

阅读到这里，我想你对 CSS 级联层有了较深的认识了。接下来，我们来看一些用例，看看 CSS 级联层是如何帮助我们解决样式冲突的。

### UI 主题切换

使用级联层实现 UI 主题切换将会是一个完美的解决方案。它允许 Web 开发人员在 UI 主题之间切换时，不需要更改 CSS 或以某种方式重新排序。

```CSS
@layer reset, default, themes, patterns, layouts, components, utilities;
```

我们使用 `@layer`定义了不同的级联层，其中 `themes` 是一个主题方面的级联层。`themes` 级联层可以包含多个子级联层。

注意，我们在 `themes` 的顶部使用 `@layer` 预设了主题的顺序，比如 `@layer custom, default` ，其中 `default` 主题将覆盖 `custom` 主题：

```CSS
@layer reset, default, themes, patterns, layouts, components, utilities;

@layer themes {
    @layer custom, default;
    
    @layer default {
        :root {
            --color-primary: #1877f2;
        }
    }
    
    @layer custom {
        :root {
            --color-primary: #d73a7c;
        }
    }
}
```

如果你想切换主题，你可以在 `@layer themes` 中重新预设子级联层顺序：

```CSS
@layer reset, default, themes, patterns, layouts, components, utilities;
​
@layer themes {
    @layer default, custom;
    
    @layer default {
        :root {
            --color-primary: #1877f2;
        }
    }
    
    @layer custom {
        :root {
            --color-primary: #d73a7c;
        }
    }
}
```

### 使用第三方工具和框架

在项目中集成第三方 CSS 是最容易遇到级联问题的地方之一。无论我们使用的是 `normalizer.css` 或 `reset.css` 的重置 CSS 库，Material Design 这样的通用设计系统，Bootstrap 这样的 CSS 框架（Frameworks），还是 Tailwind 这样的实用工具，我们都无法控制网站上使用的所有 CSS 选择器的权重或重要性（`!important`）。有时，这甚至扩展到一些内部库、设计系统和工具。

因此，我们经常不是不围绕第三方代码构建我们的内部 CSS，或者在冲突出现时人为的提高选择器权重或使用 `!important` 标识符。并且不断使用这些 Hack 手段来适应上游的变化。

庆幸的是，CSS 级联层为我们提供了一种方法，可以将第三方代码插入到项目的任何级联层中。根据我们使用的库的类型，可以用不同的方法来实现。例如：

```CSS
@layer reset, type, theme, components, utilities;
```

然后我们可以结合一些工具。

如果我们使用像 [CSS Remedy](https://css-tricks.com/css-remedy/) 这样的工具，我们可能也有一些我们自己想要的重置样式。我们可以将 CSS Remedy 导入到 `reset` 的子级联层中：

```
@import url('remedy.css') layer(reset.remedy);
```

现在我们可以添加我们自己的重置样式到 `reset` 级联层。因为在 `reset` 中的样式会覆盖任何子级联层的样式，这是我们可以确定的。如此一来，即使存在冲突，我们的样式将始终优先于 `reset.remedy` ：

```CSS
@layer reset, type, theme, components, utilities;

@import url('remedy.css') layer(reset.remedy);

@layer reset {
    :is(ol, ul)[role='list'] {
        list-style:none;
        padding-inline-start: 0;
    ｝
｝
```

由于我们在 `reset` 级联层中写的重置样式位置隐含级联层，因此它的优先级将高于 `remedy` 级联层，我们写的重置 CSS 样式将覆盖 `remedy` 中样式。

如果你想将 Tailwind （“实用程序类”）工具引用到项目中，可以像引用 `remedy.css` 一样，将 `tailwind.css` 引入到 `utilities` 级联层中：

```CSS
@layer reset, type, theme, components, utilities;

@import url('tailwind.css') layer(utilities.tailwind);

@layer utilities {
    .sr-only {
        border: 0;
        clip: rect(1px, 1px, 1px, 1px);
        -webkit-clip-path: inset(50%);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        margin: -1px;
        padding: 0;
        position: absolute;
        width: 1px;
        white-space: nowrap;
    }
}
```

### 设计一个 CSS 工具或框架

对于任何维护 CSS 库的开发人员来说，级联层可以帮助进行内部组织，甚至可以成为开发人员 API 的一部分。通过命名库的内部级联层，我们可以允许框架的用户在定制或重写我们提供的样式时挂钩到这些层。

例如，Bootstrap 可以为它们的 `reset` 、`grid` 和 `utilities` 公开层。现在，用户可以决定是否要将这些 Bootstrap 级联层加载到不同的级联层中：

```CSS
@import url(bootstrap/reboot.css) layer(reset);   /* reboot » reset.reboot */
@import url(bootstrap/grid.css) layer(layout);    /* grid   » layout.grid */
@import url(bootstrap/utils.css) layer(override); /* utils  » override.utils */
```

或者用户可以将它们加载到 Bootstrap 级联层中，嵌套级联层穿插在一起:

```CSS
@layer bs.reboot, bs.grid, bs.grid-overrides, bs.utils, bs.util-overrides;

@import url('bootstrap-all.css') layer(bs);
```

如果需要，还可以通过将任何私有、内部级联层分组到一个匿名级联层中，对用户隐藏内部级联层。匿名级联层将被添加到它们遇到的级联层顺序中，但不会暴露级用户重新安排或附加样式。

### 元素状态

级联层的一个优秀用例就是处理元素不同状态时的样式，例如 `:disabled` 或 `:focus`

在过去，我们要通过一个更为复杂的选择器来添加按钮样式

在过去，如果要给除禁用状态按钮编写样式，我写了一个更复杂的选择器：

```CSS
.button:not(:disabled) {
    cursor: pointer;
}
```

该选择器以某种方式来增加选择器权重，下游 Web 开发者想要更改该规则定义的 CSS时，必须要有相同或更高的选择器权重才可以做到。相反，级联层将允许定义特定的组件样式，更简单的状态选择器也可以覆盖这些样式。

下面这个示例，说明我们将来如何为 `:focus-visible` 和 `disabled` 状态更新按钮样式。这些状态规则在技术上适用于任何交互元素，包括链接（`a`）、按钮（`button`）和表单元素。

```CSS
@layer components, states;
​
@layer components {
    .button {
        --focus-color: rebeccapurple;
    
        background-color: rebeccapurple;
        color: #fff;
    }
}
​
@layer states {
    :disabled {
        background-color: #ddd;
        color: #999;
    }
  
    :focus-visible {
        outline: 2px solid var(--focus-color, currentColor);
        outline-offset: 2px;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a85951c9c7234af8b90f2136277bc5b5~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/GRwXQKv>

## 小结

随着 CSS 级联层的到来，Web 开发者有了更多控制 CSS 级联的能力。CSS 级联层的真正威力来自于它在级联中的独特位置：在选择器的权重和源码顺序之前。正因为如此，我们不需要担心在其他层中的 CSS 的选择器权重，也不需要担心我们将 CSS 加载到这些层中的顺序。这对于开发一个大型项目，或者在一个大型团队多人协作或加载第三方 CSS 时非常有利。

CSS 级联层将来可能还会改变我们编码的方式，并给我们带来新的功能，使项目的封装变得非常容易。最终，像级联层这样的新功能将推动一整套新的后期处理和前端 Web 技术，这将改变我们今后的 Web 网站建设方式。