在当今数字时代，Web 应用程序和网站的用户体验至关重要。CSS 是前端开发中不可或缺的技术之一，而 CSS 动画是提升用户体验、增添 Web 页面生动感的重要工具。通过巧妙运用 CSS 动画，我们能够为用户呈现更具吸引力、交互性和创意性的界面。

  


我们围绕着动画的理论基础、设计原则、CSS 基础到高级等方面展开了详细的阐述。通过这些课程的时间，我想你已经掌握了 CSS 动画的实际应用，从基础到高级。也可以运用 CSS 特性和技术来创建引人注目的动画效果。

  


今天，在这节课我们不再讲述 CSS 动画的理论知识。我们来看看如何运用前面所掌握的知识和技术，创建高效的 CSS 动画，为用户创造出色的视觉体验。让我们一同踏上这段充满创意和学习乐趣的CSS动画实战之旅。

  


## 创意的源泉

  


一直以来，我个人认为，对于 Web 动画而言，从不缺少创作动画的技术。在当下，我们可以使用 CSS、SVG、JavaScript 和各种工具来制作动画。对于 Web 开发者来说，缺的是创作动画的创意。

  


在这方面我深有感触。自从我加入手淘前端团队，大部分的工作内容都是围绕着 Web 动画。而且，我很庆幸，手淘 App 上第一个用 CSS 实现的动画就是我写的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff08c63c21334000bb19a4ac05c8c72f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=368&h=625&s=7093932&e=gif&f=263&b=f8f2f0)

  


而且多年以来，我和团队小伙伴都在致力于这方面的开发。甚至可以说，我们是 APP 应用（最起码电商类 APP）互动动效的先驱，不管是大促（例如，618、双11、双12、造物节和年货节）还是一些品牌运营活动，都可以看到 CSS 创作的互动动效：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e1cd745d45544a8af2b9d810ae30602~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=528&s=9081601&e=gif&f=90&b=fbf5f4)

  


这为我在动画研究方面积累了足够多的经验，也基于这个原因，我才写了《Web 动画之旅》！我希望通过小册，让更多 Web 开发者能掌握动画的开发和制作！

  


其实，创作动画的技术并不复杂，复杂的还是动画的创意。早期，我非常依赖于 Web 设计师或动画设计师，所有动画创意的来源我都是依赖于他们。但随着时间的推移和自我的成长，我有一些其他的创意来源。我会从 [Dribble](https://dribbble.com/) （设计师平台）、[CodePen](https://codepen.io/) （案例演示平台）和 [r/MotionDesign](https://reddit.com/r/MotionDesign) （Reddit 频道）获取动画相关的资源：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87013af5af1d400da70a3b701d21c151~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=695&s=137344&e=jpg&b=f6efed)

  


除此之外，我还会关注各种 APP 上的交互动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d624b1ed28144619a07bd89a77b356f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1242&h=640&s=7025327&e=gif&f=114&b=fcfbfb)

  


> App Motion：https://appmotion.design/

  


在这些网站上可以找到灵感，可以帮助我更好的创建 CSS 动画，也能更明确 CSS 技术用于创作动画的范围。更多的时候，我会将我的 CSS 想法变为现实，并在 [Codepen](https://codepen.io/airen) 上呈现。

  


接下来，在这节课中，我将会以真实的案例，带领大家如何使用 CSS 技术来创建 Web 动画。

  


## 案例一：产品展示

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba530802f8b74cb1890a7b7c22bdc5af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=672&s=7729522&e=gif&f=337&b=fdfdfd)

  


> Demo 地址：https://codepen.io/cobra_winfrey/full/OJXJeod

  


这是一个有关于自行车产品展示的动画效果，[该效果由 @Adam Kuhn 提供](https://codepen.io/cobra_winfrey/full/OJXJeod)。在这个示例中，没有使用任何一行 JavaScript 代码，以动画的形式向大家介绍自行车。我们一起来看看，应该如何应用所学的 CSS 技术来实现它。

  


### 分拆动画效果

  


虽然这个交互动画效果看上去很复杂，甚至令人止步不前；但它并没有想象中的那么恐怖。为什么这么说呢？请听我详细道来。

  


不管任何一个动画作品，欲要实现它，就必须先分析它，拆解它。只有这样，我们才能知道接下来要做些什么，以及如何做？通常情况下，我们可以按下面的方式来分析和拆解动画。

  


如果你面对的是一个全新作品，那么你可以和设计师一起交流，或者通过设计师提供的相当文档获得动画所有信息。获得相关信息之后，你可以在草稿纸上绘制一个时序图，将所有动画编排进去，并在相应的地方填充上动画相关的参数。有了这些信息之后，你就可以着手编码了，最后通过调试，逐步完成目标作品。

  


如果你是想依照一个作品，比如我们接下来要详细展开的案例（@Adam Kuhn 提供的自行车产品展示），那么你可以阅读源码。除此之外，你还可以借助浏览器开发者工具来分析整个作品。我们可以在[开发者工具中的“动画”面板中获得动画相关的信息](https://juejin.cn/book/7288940354408022074/section/7308623596276318271)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8df455bb89f1475cabc1537b7364025f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1428&h=656&s=16017873&e=gif&f=925&b=fcfcfc)

  


正如你所看到的，在这个案例中有很多过渡动画（`transition`）和关键帧动画（`animation`）。但仔细分析下来，也没有大家想象中的那么复杂。整个交互动画主要有三个场景，每个场景都有动画元素：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cffd63345e25464093e5f66075947b22~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2892&h=1165&s=969483&e=jpg&b=fefefe)

  


场景一相对而言比较简单，左上角的切换按钮有一个过渡动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/811983db17fd4a1ea752e9eb6951a76b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=666&s=1789162&e=gif&f=209&b=fcfcfc)

  


当你点击这个切换按钮时，将会从场景一切换到场景二，切换按钮中的“自行车折叠”按钮会动画化移出，同时折叠的自行车会动画化展开：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38d6292d01af4ddbb6ad064b7927bb8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1382&h=624&s=19485374&e=gif&f=684&b=fcfcfc)

  


进入到场景二之后，“自行车轮胎”的切换按钮变得高亮显示，它们在悬浮状态有一些过渡动画效果。当你点击“自行车轮胎”切换按钮之后，自动车将以动画方式切换轮胎，即动画化切换产品：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de41a85f5f2848368249e91247163f7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1552&h=618&s=8161073&e=gif&f=415&b=222222)

  


在场景二中点击“Check Out”按钮，将会动画化进入场景三，卡片背景将会动画化切换（蓝色互换位置），并且自行车会向右移动：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9c0141a02bf49d8a810eee65b768fe9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1602&h=674&s=10394649&e=gif&f=436&b=262626)

  


当然，在些过程中还会涉及到其他元素的动画，例如按钮和标题的移动动画。

  


在场景三中，点击“Back”按钮，卡片上元素将动画化回到场景二：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee901345c296448bbed9068be2738e17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1654&h=656&s=7645437&e=gif&f=314&b=232323)

  


  


经过这么一拆分，你是不是也会觉得，该动画并没有最初想象的那么复杂。

  


事实上，在整个交互动画效果中，相对较难的是三个部分：

  


-   纯 CSS 实现的交互，例如，场景切换，产品图更换等
-   动画化展示自行车
-   动画化切换场景

  


其中，我个人认为“动画化切换场景”相对麻烦些，但你要是掌握前面课程中所阐述的动画编排（动画持续时间和延迟时间）和动画调度工具相关的知识，那也不会太难。

  


### 动手编码

  


> 特别声明，接下来的内容将会涉及到[复杂的 CSS 选择器](https://juejin.cn/book/7223230325122400288/section/7226251495276609569)以及[现代 CSS ](https://s.juejin.cn/ds/iLYMYmuu/)相关的特性，需要在这方面有一定的基础或了解！

  


实现该效果，你可能需要像下面这样的 HTML 结构：

  


```HTML
<div id='wrap' class="wrap">
    <input class='initial' type='checkbox'>

    <!--  轮胎切换  -->
    <h3>Wheels</h3>
    <input type="radio" name="wheel" id="wheel1" class="wheel1">
    <label for="wheel1" class="wheeltoggle"></label>
    <input type="radio" name="wheel" id="wheel2" class="wheel2">
    <label for="wheel2" class="wheeltoggle"></label>
    <input type="radio" name="wheel" id="wheel3" class="wheel3">
    <label for="wheel3" class="wheeltoggle"></label>
    <input type="radio" name="wheel" id="wheel4" class="wheel4">
    <label for="wheel4" class="wheeltoggle"></label>

    <h1>Configure the Bike</h1>
    <h2>Added to Cart</h2>

    <!--  购买按钮  -->
    <input class='buy' type='checkbox'>
    <div class='buy'></div>

    <!-- 自行车展示切换：折叠与展开   -->
    <div class='toggle expand'>
        <i class='fas fa-bicycle'></i> <!-- iconfont 你可以使用 svg 替代 -->
    </div>
    <div class='toggle'>
        <i class='fas fa-bicycle'></i> <!-- iconfont 你可以使用 svg 替代 -->
    </div>

    <!-- 卡片背景   -->
    <div class='background'></div>

    <!-- 自行车   -->
    <div class='frame'>
        <div class='rear'></div>
        <div class='stem'></div>
        <div class='shaft'></div>
        <div class='seat'></div>
        <div class='wheel one front'>
            <div class='inner'></div>
        </div>
        <div class='wheel one back'>
            <div class='inner'></div>
        </div>
    </div>
</div>
```

  


你会发现，整个 HTML 结构非常的扁平，没有太多的嵌套结构。其主要原因是便于 CSS 的通用兄弟选择器（`a ~ b`）选择需要的元素，还有一点就是因为 [CSS 网格的布局技术](https://juejin.cn/book/7161370789680250917/section/7161372229123440648)，使得我们使用扁平的 HTML 结构就可以构建出案例所需要的布局效果。

  


这个 HTML 结构主要分为三大块。第一块是 `.initial` 和 `.buy` 两个复选框的应用：

  


```HTML
<input class='initial' type='checkbox'>
<input class='buy' type='checkbox'>
```

  


它们主要用于场景切换。初始状态在场景一中，在该场景中，自行车外形处于折叠状态，并且自行车轮胎切换选项是处于禁用状态，不可选择。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26f9b161348a4e80928dfe7c68b75b36~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1915&h=1165&s=743053&e=jpg&b=fefefe)

  


其过程变化如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0219fe75885457c9ab623052ba11a29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=916&h=638&s=1824593&e=gif&f=169&b=fcfcfc)

  


不难发现，`.buy` 复选框在场景一是被隐藏状态，它位于卡片容器 `.wrap` 之外，只有 `.initial` 复选框被选中，进入场景二之后，它才显现。

  


`input.buy` 和 `div.buy` 是相互关联的：

  


```HTML
<input class='buy' type='checkbox' id="buy" />

<!--  购买按钮  -->
<div class='buy'></div>
```

  


其实更好的方式是，通过 `label` 标签的 `for` 属性与 `input.buy` 的 `id` 绑定在一起，这样交互起来会更方便一些：

  


```HTML
<input class='buy' type='checkbox' id="buy" />

<!--  购买按钮  -->
<label class='buy' for="buy"></label>
```

  


在我们这个示例，是通过布局的方式将 `input.buy` 定位在 `div.buy` 上面，才完成了交互功能，即点击按钮就类似于点击了复选框。

  


`input.buy` 所起功能与 `input.initial` 是相似的，当我们选中它的时候，会从场景二进入场景三，当它未选中时，又会从场景三切回到场景二中：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04b2b146c882496394c7ec82d99599e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=636&s=3449558&e=gif&f=193&b=fdfdfd)

  


第二个部分是，多个单选按钮（`input[type="radio]"`）与 `label` 标签的组合，它们是同一个组（`name` 都是 `wheel`），主要用于自行车轮胎的切换：

  


```HTML
<!--  轮胎切换  -->
<h3>Wheels</h3>
<input type="radio" name="wheel" id="wheel1" class="wheel1">
<label for="wheel1" class="wheeltoggle"></label>

<input type="radio" name="wheel" id="wheel2" class="wheel2">
<label for="wheel2" class="wheeltoggle"></label>

<input type="radio" name="wheel" id="wheel3" class="wheel3">
<label for="wheel3" class="wheeltoggle"></label>

<input type="radio" name="wheel" id="wheel4" class="wheel4">
<label for="wheel4" class="wheeltoggle"></label>
```

注意，原案例中采用的是 `input` （单选按钮）与 `div` 的组合，和 `input.initial` 以及 `input.buy` 相似，通过将单选按钮定位到 `div` 上，完成单击交互。我在示例中将它与 `label` 标签绑定，这样做的好处理，无需关注 `input` （单选按钮）的位置也可以完成单击选中的交互操作：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d031d540d864691b13475a1125d9ef2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=674&s=5206131&e=gif&f=247&b=fdfdfd)

  


第三个部分就是自行车：

  


```HTML
<!-- 自行车   -->
<div class='frame'>
    <div class='rear'><!-- 齿轮 --></div>
    <div class='stem'><!-- 手柄 --></div>
    <div class='shaft'><!-- 轴 --></div>
    <div class='seat'><!-- 坐垫 --></div>
    <div class='wheel one front'><!-- 前轮 -->
        <div class='inner'></div>
    </div>
    <div class='wheel one back'><!-- 后轮 -->
        <div class='inner'></div>
    </div>
</div>
```

  


将整辆自行车拆分为门个部分，主要目的是，自行车要动画化处理：

  


-   从折叠状态到展开状态
-   切换轮胎

  


接下来，我们来看看 CSS 部分的代码。在开始之前，先简单的向大家阐述一下，示例中的 `input` 是怎么实现交互与场景切换的。拿 Web 上最常见的 `switch` 组件为例，通常情况之下，都是通过 `input` 的 `:checked` 状态选择器来区分 `input` 选中和未选中两种状态，并结合 CSS 相邻兄弟选择器（`a + b`）或通用兄弟选择器（`a ~ b`）设置其他元素的样式。例如下面这个示例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70bd400eaf0949d8924e2135cf0d35cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1156&h=438&s=254257&e=gif&f=78&b=d6d6d6)

  


> Demo 地址：https://codepen.io/airen/full/dyqeEZx

  


基于该原理，可以制作一些复杂的交互效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74f9a9c3c572488388fe99567e4f3812~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=654&s=2988462&e=gif&f=147&b=cbcaca)

  


> Demo 地址：https://codepen.io/airen/details/GmzgQL

  


纯 CSS 实现的 `switch` 组件原理同样适用于我们这个案例。不过，它最为核心的是，`input` 元素需要置前，因为我们要使用相邻兄弟选择器或相邻通用选择器来选中元素：

  


```CSS
/* 未选中样式 */
.buy {
    background: #fff;
}

/* 选中样式 */
input[type="checkbox"]:checked + .buy {
    background: #09f;
}

input[type="checkbox"]:checked ~ .buy {
    background: #09f;
}
```

  


请注意 `a + b` 选择器与 `a ~ b` 选择器的差异，这里不展开阐述。

  


有了这个基础之后，我们开始进入样式的编写。首先，整个卡片布局是通过 CSS 网格技术来实现的。我在 `.wrap` 容器上创建了一个 `15 x 15` 的网格，并通过 `grid-area` 将元素放置到网格中的指定区域：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/033a5479562342cfb0561cc1f4c12819~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2436&h=1536&s=594877&e=jpg&b=fdf8f6)

  


```CSS
@layer layout {
    body {
        display: grid;
        place-items: center;
    }

    .wrap {
        display: grid;
        grid-template-columns: repeat(15, minmax(0, 1fr));
        grid-template-rows: repeat(15, minmax(0, 1fr));
        gap: 0px;
        overflow: hidden;
    
        :is(h1, h2) {
            grid-area: 4/10/5/15;
            z-index: 9;
        }
    
        h2 {
            grid-area: 4/2/5/7;
        }
    
        h3 {
            z-index: 9;
            grid-area: 10/11/11/12;
        }
    }

    .toggle {
        grid-area: 4/2/5/3;
    }

    .buy {
        grid-area: 14/3/15/5;
    }

    .wheeltoggle {
        &:nth-of-type(1) {
            grid-area: 11/14/12/15;
        }
        &:nth-of-type(2) {
            grid-area: 11/13/12/14;
        }
    
        &:nth-of-type(3) {
            grid-area: 11/12/12/13;
        }
    
        &:nth-of-type(4) {
            grid-area: 11/11/12/12;
        }
    }

    .initial {
        grid-area: 4/2/5/3;
    }
}
```

  


> 如果你对 CSS 网格布局技术不是太了解的话，建议你移步阅读《[现代 Web 布局](https://s.juejin.cn/ds/iLYAT4L1/)》相关的课程！

  


接着我们来看案例中的过渡动画，在整个案例中，很多元素上都应用了 `transition` ：

  


```CSS
@layer transition {
    :root {
        --easing: cubic-bezier(0.75, 0.885, 0.32, 1);
    }
    
    .wrap {
        *,
        *::before,
        *::after {
            transition: all 0.3s var(--easing);
        }
    
        :is(h1, h2, h3) {
            transition: 0.4s var(--easing);
        }
    }

    .frame {
        transition: 
            translate 0.6s var(--easing), 
            rotate 0.6s var(--easing),
            scale 0.6s var(--easing), margin-left 0.4s var(--easing);
            transition-delay: 0.2s, 0.2s, 0.2s, 0.4s;

      .wheel {
          &.front {
              transition-delay: 0.5s, 0.8s;
          }
    
          .inner::before {
              transition: rotate 1.25s var(--easing), background-image 0s ease-in-out;
              transition-delay: 0.1s, 0.5s;
          }
    
          .stem {
              transition-delay: 0.5s, 0.8s;
          }
    
          .shaft {
              transition-delay: 0.8s;
          }
          .seat {
              transition: 0.4s ease-in-out;
              transition-delay: 0.65s;
          }
        }
    }

    .toggle {
        transition: 0.2s ease-in-out;
    }

    .background {
        &::after {
            transition: 1s ease-in-out;
        }
    }

    .wheeltoggle {
        transition: 0.3s ease-in-out;

        &::before {
            transition: 0.4s ease-in-out;
        }
    }

    .buy {
        transition: 0.2s ease-in-out;

        &:not(input)::after {
            transition: 0.6s ease-in-out;
        }
    }

    .initial ~ *:not(.two):not(i):not(.buy):not(h1):not(h2):not(h3):not(.toggle).background::before {
        transition: 0.5s cubic-bezier(0.75, 0.885, 0.32, 1);
    }

    .initial:checked {
        ~ .buy {
            transition-delay: 1s;
    
            &:not(div) {
                &:hover ~ .buy {
                  transition-delay: 0s;
                }
            }
    
            &:checked {
                ~ h2 {
                    transition-delay: 0.4s;
                }
        
                ~ h3 {
                    transition-delay: 0.1s;
                }
        
                ~ .buy::after {
                    transition-delay: 0.3s;
                }
        
                ~ .background {
                    &::before {
                        transition: rotate 0.4s var(--easing), left 0.4s var(--easing) !important;
                        transition-delay: 0.4s, 0.8s !important;
                    }
                    &::after {
                        transition-delay: 0.3s;
                    }
                }
        
                ~ .frame:not(.two):not(i):not(.buy) {
                    transition: 0.75s var(--easing);
                    transition-delay: 0.25s;
                }
                
                ~ .wheeltoggle {
                    &:nth-of-type(1) {
                        transition-delay: 0.05s;
                    }
                    &:nth-of-type(2) {
                        transition-delay: 0.1s;
                    }
                    &:nth-of-type(3) {
                        transition-delay: 0.15s;
                    }
                    &:nth-of-type(4) {
                        transition-delay: 0.2s;
                    }
                }
            }
        }
    }
}
```

  


看到这一坨 CSS 代码是不是有点晕。请不用急，我们一步一步来看。

  


在场景一中，过渡效果还是很简单的，只是在卡片左上角的切换按钮 `.toggle` 有一个背景颜色的过渡效果：

  


```CSS
@layer transition {
    .toggle {
        transition: 0.2s ease-in-out;
    }
}

@layer demo {
    .toggle {
        background: rgb(255 255 255 / 0.05);
    }

    .initial:hover ~ .toggle.expand {
        background: #ff6a5e;
    }
}
```

  


你可能会好奇，为什么不直接在 `.toggle` 的悬浮状态（`:hover`）改变背景颜色，而是在 `input.initial` 的悬浮状态再对 `.toggle` 样式化处理。这是因为 `input.initial` 覆盖在 `.toggle` 之上。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/772aa5d3ec574cd5ad6cfe9d5e8707a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1384&h=630&s=2190896&e=gif&f=282&b=fdfdfd)

  


而且在 `input.initial` 被选中之后，`.toggle` （不带 `.expand`）将会平滑移出卡片容器：

  


```CSS
@layer demo {
    .initial:checked {
        ~ .toggle {
            box-shadow: -5px 0 0 #ff6a5e;
            
            &:not(.expand) {
                box-shadow: -5px 0 0 rgb(255 255 255 / 0.15);
                translate: -100px 0;
            }
        }
    }
}
```

  


注意，这里运用了一个 `:not()` 选择器，排除了带有 `.expand` 类名的 `.toggle` 。

  


但当 `input.initial` 复选框被选中之后，触发的过渡动画就多了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ec26ae2ca4541a2b560c5b9a39c6e39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1596&h=666&s=10281113&e=gif&f=362&b=fdfdfd)

  


以自行车从折叠到展开状态为例，自行车的每个部位将在“位移”、“旋转”和“缩放”等进行平滑过渡：

  


```CSS
@layer demo {
    .frame {
        transform-origin: 190px 210px;
        scale: 0.8;
        rotate: -62.5deg;
    
        .wheel {
            :is(&.two.front, &.three.front, &.four.front) {
                translate: 700px 0;
                margin-left: 0px;
            }
          
            :is(&.two.back, &.three.back, &.four.back) {
                translate: -700px 0;
            }
    
            &.front {
                transform-origin: 273px 190px;
                margin-left: -75px;
                rotate: 115deg;
            }
    
            &.back {
                z-index: -1;
        
                .inner {
                    left: -40px;
                }
            }
    
            .inner {
                &::before {
                    background-image: var(--wheel1);
                    background-size: contain;
                    rotate: 360deg;        
                }
            }
        }
    
        .rear {
            background-image: var(--rear);
        }
        .stem {
            background-image: var(--stem);
            transform-origin: 273px 190px;
            margin-left: -105px;
            rotate: 115deg;
        }
        .shaft {
            background-image: var(--shaft);
            transform-origin: 220px 200px;
            translate: -70px 40px;
        }
        .seat {
            background-image: var(--seat);
            translate: 40px 100px;
            z-index: -1;
        }
    }
}

@layer transition {
    .frame {
        transition: 
            translate 0.6s var(--easing), 
            rotate 0.6s var(--easing),
            scale 0.6s var(--easing), margin-left 0.4s var(--easing);
        transition-delay: 0.2s, 0.2s, 0.2s, 0.4s;
    
        .wheel {
            &.front {
                transition-delay: 0.5s, 0.8s;
            }
    
            .inner::before {
                transition: rotate 1.25s var(--easing), background-image 0s ease-in-out;
                transition-delay: 0.1s, 0.5s;
            }
    
            .stem {
                transition-delay: 0.5s, 0.8s;
            }
    
            .shaft {
                transition-delay: 0.8s;
            }
            .seat {
                transition: 0.4s ease-in-out;
                transition-delay: 0.65s;
            }
        }
    }
}
```

  


其他元素所应用的过渡动画就不一一展示了。

  


再来说一下关键帧动画（`.animation`）。在这个示例中，关键帧动画主要用于自行车的展示上。我们每切换一次自行车的轮胎，自行车就会动画化播放一次：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a3eb979bf3a4816b0390589860029ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1590&h=662&s=13979694&e=gif&f=578&b=fefefe)

  


这里分两个功能，第一个功能就是点击“Wheels”切换按钮，更换自行车轮胎：

  


```CSS
.wheel1:checked {
    ~ .wheeltoggle:nth-of-type(1) {
        box-shadow: 0 0 0 1px #ff6a5e, 0 10px 20px -30px #4e567d;
    }
    ~ .frame .inner::before {
        background-image: var(--wheel1);
    }
}

.wheel2:checked {
    ~ .wheeltoggle:nth-of-type(2) {
        box-shadow: 0 0 0 1px #ff6a5e, 0 10px 20px -30px #4e567d;
    }
    ~ .frame .inner::before {
        background-image: var(--wheel2);
    }
}

.wheel3:checked {
    ~ .wheeltoggle:nth-of-type(3) {
        box-shadow: 0 0 0 1px #ff6a5e, 0 10px 20px -30px #4e567d;
    }
    ~ .frame .inner::before {
        background-image: var(--wheel3);
    }
}

.wheel4:checked {
    ~ .wheeltoggle:nth-of-type(4) {
        box-shadow: 0 0 0 1px #ff6a5e, 0 10px 20px -30px #4e567d;
    }
    ~ .frame .inner::before {
        background-image: var(--wheel4);
    }
}
```

  


在这个过程中，自行车前后轮胎会做一个旋转加移动的动画，轮胎之外会有一个跳动动画：

  


```CSS
@layer keyframes {
    @keyframes wheelroll1 {
        to {
            rotate: 720deg;
        }
    }
    @keyframes wheelroll2 {
        to {
            rotate: 720deg;
        }
    }
    @keyframes wheelroll3 {
        to {
            rotate: 720deg;
        }
    }
    @keyframes wheelroll4 {
        to {
            rotate: 720deg;
        }
    }
    
    @keyframes wheelroll6 {
        to {
            rotate: 360deg;
        }
    }

    @keyframes wheelback1 {
        50% {
            translate: -700px 0;
        }
    }
    @keyframes wheelback2 {
        50% {
            translate: -700px 0;
        }
    }
    @keyframes wheelback3 {
        50% {
            translate: -700px 0;
        }
    }
    @keyframes wheelback4 {
        50% {
            translate: -700px 0;
        }
    }

    @keyframes wheelout1 {
        50% {
            translate: 700px 0;
        }
    }
    @keyframes wheelout2 {
        50% {
            translate: 700px 0;
        }
    }
    @keyframes wheelout3 {
        50% {
            translate: 700px 0;
        }
    }
    @keyframes wheelout4 {
        50% {
            translate: 700px 0;
        }
    }

    @keyframes jump1 {
        50% {
            translate: 0 -75px;
            roate: -2.2deg;
        }
    }
    @keyframes jump2 {
        50% {
            translate: 0 -75px;
            roate: -2.2deg;
        }
    }
    @keyframes jump3 {
        50% {
            translate: 0 -75px;
            roate: -2.2deg;
        }
    }
    @keyframes jump4 {
        50% {
            translate: 0 -75px;
            roate: -2.2deg;
        }
    }
}

@layer animation {
    input[type="radio"]:checked {
        ~ .frame {
            > div:not(.wheel) {
                animation: var(--animn, none) 1s ease-in-out 1 forwards;
            }
            .wheel {
                animation: var(--animn, none) 0.75s ease-in-out 1 forwards 0.25s;
    
                .inner::before {
                    animation: var(--animn, none) 1s ease-in-out 1 forwards 0s;
                }
    
                &.back {
                    animation: var(--animn, none) 0.75s var(--easing) 1 forwards 0.25s;
                }
            }
        }
    }

    .wheel1:checked {
        ~ .frame {
            > div:not(.wheel) {
                --animn: jump1;
            }
            .wheel {
                --animn: wheelout1;
    
                .inner::before {
                    --animn: wheelroll1;
                }
    
                &.back {
                    --animn: wheelback1;
                }
            }
        }
    }

    .wheel2:checked {
        ~ .frame {
            > div:not(.wheel) {
                --animn: jump2;
            }
            .wheel {
                --animn: wheelout2;
        
                .inner::before {
                    --animn: wheelroll2;
                }
        
                &.back {
                    --animn: wheelback2;
                }
            }
        }
    }

    .wheel3:checked {
        ~ .frame {
            > div:not(.wheel) {
                --animn: jump3;
            }
    
            .wheel {
                --animn: wheelout3;
        
                .inner::before {
                    --animn: wheelroll3;
                }
        
                &.back {
                    --animn: wheelback3;
                }
            }
        }
    }

    .wheel4:checked {
        ~ .frame {
            > div:not(.wheel) {
                --animn: jump4;
            }
            .wheel {
                --animn: wheelout4;
        
                .inner::before {
                    --animn: wheelroll4;
                }
        
                &.back {
                    --animn: wheelback4;
                }
            }
        }
    }
}
```

  


你可能已经发现了，代码中好几个 `@keyframes` ，除了名称不一样，里面的规则是相同的。这是 CSS 关键帧动画的一个缺陷。我在《[CSS 动画的播放方式：暂停、恢复和重播](https://juejin.cn/book/7288940354408022074/section/7304648624272015372)》中介绍过，CSS 关键帧动画可以使用 `animation-play-state` 控制动画暂停，但无法控制动画重播。在这个示例中，用户点击轮胎标签时，就会触发一次动画播放，比如 `jump` 、`wheelout` 、`wheelroll` 和 `wheelback` 。要是将这些动画设置一个动画名称，点击其中一个标签，动画就播放了，那么再点击第二个标签时，就无法触发这些动画重播，因此我们需要为每一个标签设置独立的动画名，即使这些动画的动作是相同的。

  


除了这个关键技巧之外，你是否留意到，为什么“轮胎切换标签”在场景一是不可点击，在场景二就可以点击。前面没有向大家阐述这个关键之处。这里简单和大家说一下。在初始状态（也就是 `input.initial` 未选中状态），轮胎切换标签 `.wheeltoggle` 的 `pointer-events` 设置为 `none` ，即禁用了点击事件；当 `input.initial` 被选中（`.initial:checked`）之后，再将 `pointer-events` 重置为 `all` ，即可点击：

  


```CSS
@layer demo {
    .wheeltoggle {
        pointer-events: none;
    }
    
    .initial {
        &:checked ~ .wheeltoggle {
            pointer-events: all;
        }
    }
}
```

  


最后再说一点，那就是自行车从折叠到展开状态的变化。其实很简单，那就是在 `input.initial` 选中状态，将自行车每个部位的 `translate` 、`rotate` 和 `scale` 重置为最初状态：

  


```CSS
.initial:checked {
    ~ *:not(.two):not(i):not(.buy):not(h1):not(h2):not(h3):not(.toggle) {
        rotate: 0deg;
        translate: 0;
        margin-left: 0px;

        &::before,
        &::after {
            rotate: 0deg;
        }
       
        &.background {
            &::before {
                transition: 0.5s cubic-bezier(0.75, 0.885, 0.32, 1);
            }
            &::after {
                translate: 30px 0;
                scale: 1 1.25;
            }
        }
        &.frame {
            translate: 0 50px;
            rotate: 0deg;
            scale: 0.7;
            margin-left: -25px;
        }
     }
     
     ~ *:not(.two):not(i):not(.buy):not(h1):not(h2):not(h3):not(.toggle) *:not(.two):not(i):not(.buy):not(h1):not(h2):not(h3):not(.toggle) {
         rotate: 0deg;
         translate: 0;
         margin-left: 0px;
        
         &::before,
         &::after {
             rotate: 0deg;
         }
     }
}
```

  


上面向大家阐述了该案例最为核心之处的代码。更详细的代码请查看代码源码，你最终看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7fb342fc786457eb36ed870142eb0f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=712&s=7070826&e=gif&f=313&b=fdfdfd)

  


> Demo 地址：https://codepen.io/airen/full/WNmxMwJ

  


## 案例二：模仿 B 站电磁力页面交互效果

  


我要向大家介绍的第二个案例是模仿 B 站电磁力页面的交互效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2212bc2ae25469d9812c6c94f2df409~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=400&h=574&s=7501384&e=gif&f=135&b=d169ce)

  


当我在浏览 B 站电磁力页面时，看到上图的交互效果，我就想起了[ @Jhey 写的轮播图指示器的动画效果](https://codepen.io/jh3y/full/GReZEwK)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65c78338061d4a0aad72a70c60ba36d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1458&h=454&s=3901093&e=gif&f=182&b=1f1f1f)

  


> Demo 地址：https://codepen.io/jh3y/full/GReZEwK

  


滚动换肤的效果让我想起了[ @Adam Argyle 在 Codepen 使用滚动驱动实现的卡片换肤的动画效果](https://codepen.io/argyleink/full/vYQQEmo)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9234e7359d1a48548972e21e7bcac163~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=564&s=14920128&e=gif&f=191&b=556202)

  


> Demo 地址：https://codepen.io/argyleink/full/vYQQEmo

  


这些效果都有一个共同的特性，[都使用了滚动驱动动效特性](https://juejin.cn/book/7288940354408022074/section/7307223031717724172)。

  


我想你可能已经猜到了。是的，我尝试着使用 [CSS 的滚动捕捉](https://juejin.cn/book/7199571709102391328/section/7199846103007625227)和[滚动驱动动画](https://juejin.cn/book/7288940354408022074/section/7307223031717724172)等特性模仿了 B 站电磁力页面换肤的交互效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dd297f207e14a1485675a68315e3155~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=620&s=15001564&e=gif&f=218&b=04b7e4)

  


> Demo 地址：https://codepen.io/airen/full/ZEPOKwY

  


虽然效果不是一模一样，但我个觉得还是蛮有意思。如果你想一探其中的奥秘，那就接着往下阅读。

  


构建上面这个效果，我们需要一个像下面这样的 HTML 结构：

  


```HTML
<body>
    <!-- 卡片 -->
    <section id="section-1">
        <div class="card"></div>
    </section>
    <!-- 省略其他卡片 -->
    <section id="section-8">
        <div class="card"></div>
    </section>
    
    <!-- 轮播图指示器 -->
    <div class="pagination">
        <a href="#section-1"></a>
        <!-- 省略其他的 a -->
        <a href="#section-8"></a>
    </div>
</body>
```

  


这里应用了锚点链接功能，指示器中的 `<a>` 元素的 `href` 属性的值与卡片 `section` 中的 `id` 值是相互绑定的。每当用户点击 `a` 链接时，就会锚定到相应的卡片上。

  


我们需要的效果是，每次滚动之后，卡片都会居中停止，相应的指示器也会变更，还有就是页面背景颜色会动画化调整。前面也提到过，实现这些效果将会应用到 CSS 的滚动捕捉和滚动驱动动画等特性。

  


首先，使用 CSS 滚动捕捉来实现类似 Swiper 轮播图滑动的效果，这个很简单，我们只需要在滚动容器上指定 `scroll-snap-type` 的值为 `x mandatory` ，并且指定每张卡片在滚动容器中停止方式和对齐方式：

  


```CSS
html {
    scroll-snap-type: x mandatory;
}

section {
    scroll-snap-align: center;
    scroll-snap-stop: always;
}
```

  


接下来的核心是滚动驱动动画，你需要对滚动驱动动画有一定的了解，尤其是它的动画时间轴范围的概念。只有了解了这些基础知识之后，才知道在滚动的时候，如何控制指定器和背景颜色的替换：

  


```CSS
@layer effect.scroll-driven-animation {
    html {
        scroll-snap-type: x mandatory;
        overscroll-behavior: contain;
        animation: hue-cycle linear both;
        animation-timeline: scroll(inline root);
        scroll-padding-inline: 50vw;
    }

    section {
        scroll-snap-align: center;
        scroll-snap-stop: always;
    }

    @keyframes pagination {
        50% {
            translate: 0;
            opacity: 0.85;
        }
    }

    body {
        timeline-scope: 
            --section-1, 
            --section-2, 
            --section-3, 
            --section-4,
            --section-5, 
            --section-6, 
            --section-7, 
            --section-8;
    }

    section {
        view-timeline-axis: inline;
        perspective: 80vw;
    }

    #section-1 {
        view-timeline-name: --section-1;
    }
    
    #section-2 {
        view-timeline-name: --section-2;
    }
  
    #section-3 {
        view-timeline-name: --section-3;
    }
    
    #section-4 {
        view-timeline-name: --section-4;
    }
  
    #section-5 {
        view-timeline-name: --section-5;
    }
    
    #section-6 {
        view-timeline-name: --section-6;
    }
    
    #section-7 {
        view-timeline-name: --section-7;
    }
    
    #section-8 {
        view-timeline-name: --section-8;
    }

    .pagination > a {
        animation: pagination linear both;
    
        &:nth-child(1) {
            animation-timeline: --section-1;
        }
        &:nth-child(2) {
            animation-timeline: --section-2;
        }
        &:nth-child(3) {
            animation-timeline: --section-3;
        }
        &:nth-child(4) {
            animation-timeline: --section-4;
        }
        &:nth-child(5) {
            animation-timeline: --section-5;
        }
        &:nth-child(6) {
            animation-timeline: --section-6;
        }
        &:nth-child(7) {
            animation-timeline: --section-7;
        }
        &:nth-child(8) {
            animation-timeline: --section-8;
        }
    }

    @keyframes fancy-in {
        0% {
            transform: rotateY(0.5turn) translateX(15px) rotateX(0.035turn) scale(0.95)  ;
        }
        20%,
        80% {
            transform: none;
        }
        100% {
            transform: rotateY(-0.5turn) translateX(-15px) rotateX(-0.035turn) scale(0.95) ;
        }
    }

    .card {
        view-timeline-axis: inline;
        view-timeline-name: --card;
        animation-timeline: --card;
        animation-range: cover;
        animation: hue-cycle linear both;
        figure {
            animation: fancy-in linear both;
            animation-timeline: --card;
            animation-range: cover;
        }
    }
}
```

  


如果你觉得阅读上面代码比较吃力，那请移步回过头阅读小册的《[CSS 滚动驱动动效的艺术](https://juejin.cn/book/7288940354408022074/section/7307223031717724172)》。

  


对于背景换肤，我们是通过动画化改变自定义属性 `--hue` 的值，从而改变了背景的渐变颜色，而 `--hue` 是通过滚动驱动来改变的：

  


```CSS
@layer effect.color {
    @property --hue {
        syntax: "<angle>";
        initial-value: 0.5turn;
        inherits: false;
    }

    :root {
        --hue: 0.6turn;
        --surface-1: oklch(0.76 0.18 var(--hue));
        --surface-2: oklch(0.72 0.1 var(--hue));
        --surface-3: oklch(0.94 0.06 var(--hue));
        --surface-4: oklch(0.87 0.12 var(--hue));
        --color: oklch(0.47 0.13 var(--hue));
    }

    @keyframes hue-cycle {
        to {
            --hue: 1.85turn;
        }
    }

    html {
        animation: hue-cycle linear both;
        animation-timeline: scroll(inline root);
        background: linear-gradient(to bottom, var(--surface-1), var(--surface-2));
    }

    .card {
        color: var(--color);
        background: repeating-linear-gradient(
              -35deg,
              transparent 0 4px,
              rgb(255 255 255 / 0.065) 4px 8px
            )
            no-repeat right bottom / 40% 100%,
          linear-gradient(45deg, var(--surface-3), var(--surface-4));
        animation: hue-cycle linear both;
    }
}
```

  


另外，在这个效果中我还给卡片添加了视差效果，你是否有发现，卡片滑动之后，卡片的人物会有一个翻转效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72de2b52cbc04889ac55fd036eb6b63a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=430&s=9545442&e=gif&f=227&b=02bceb)

  


其核心代码如下：

  


```CSS
section {
    perspective: 80vw;
}

@keyframes fancy-in {
    0% {
        transform: rotateY(0.5turn) translateX(15px) rotateX(0.035turn) scale(0.95)  ;
    }
    20%,
    80% {
        transform: none;
    }
    100% {
        transform: rotateY(-0.5turn) translateX(-15px) rotateX(-0.035turn) scale(0.95) ;
    }
}

.card {
    view-timeline-axis: inline;
    view-timeline-name: --card;
    animation-timeline: --card;
    animation-range: cover;
    animation: hue-cycle linear both;
    
    figure {
        animation: fancy-in linear both;
        animation-timeline: --card;
        animation-range: cover;
    }
}
```

  


使用同样的原理，你还可以实现更复杂的视差滚动动效：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/310d3ef17d6e4a11b8299620d5faeb02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=468&s=13120049&e=gif&f=101&b=f7f1ef)

  


> Demo 地址：https://codepen.io/airen/full/YzBMgQB

  


现在在 Web 上，类似的交互效果是越来越多。如果你想验证一下自己是否已掌握了相关技术，可以尝试一下完成下面这个交互效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d71ff1ae2d1a442e8281847ec8635724~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=888&h=408&s=4986079&e=gif&f=242&b=f1f9fa)

  


## 小结

  


在这节课中，以两个不同的案例向大家展示了如何通过 CSS 技术来创建 Web 动画。那么到这节课为止，有关于 CSS 制作 Web 动画的相关课程就结束了。接下来，我们将开启 Web Animations API 动画！