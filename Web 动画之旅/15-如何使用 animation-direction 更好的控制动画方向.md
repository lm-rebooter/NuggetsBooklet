任何物何的运动都是有方向的，在 CSS 动画中也是一样的，Web 开发者可以使用 `animation-direction` 属性来控制动画的方向。然而，对于许多 Web 设计师和开发者而言，如何精确地掌控动画的方向往往是一个挑战。在这个充满创意和竞争的数字时代，掌握 `animation-direction` 属性的使用技巧将成为设计师和开发者的一项重要技能。

  


随着 Web 技术不断演进，动画方向的控制变得愈发灵活。`animation-direction` 属性作为 CSS 动画中的关键一环，提供了多种选择，影响着动画的表现形式和视觉效果。通过深入了解 `animation-direction` ，我们能够更好地应对动画方向的需求，创建出更为出色和引人注目的用户界面。

  


这节课将全面介绍 `animation-direction` 属性，从其基础定义到实际应用，探讨了不同动画方向的视觉效果和使用场景。通过详细的示例代码和最佳实践建议，你将能更好地理解并运用 `animation-direction` 属性，提升其 Web 设计中动画效果的质量和吸引力。

  


## 动画因方向存在的问题

  


在详细介绍 `animation-direction` 之前，我们先来看几个案例，而且这几个真实的案例都会因动画方向给用户带来不好的体验，或者说因动画方向而变得不够精致。

  


首先看一个旋转动画。对于 Web 开发者而言，使用 CSS 制作一个旋转动效再容易不过了。即可以使用 CSS 的 `transition` 来制作，也可以使用 CSS 的 `animation` 来制作。例如：

  


```CSS
/* CSS Transition */
@layer transition {
    .sun {
        .transition & {
            transition: rotate 3s linear;
        }
        
        .transition:hover & {
            rotate: 360deg;
        }
    }
}

/* CSS Animation */
@layer animation {
    @keyframes rotate {
        to {
            rotate: 360deg;
        }
    }
  
    .animation:hover .sun {
        animation: rotate 3s linear;
    }
}
```

  


不管过渡动画还是关键帧动画，当用户鼠标悬停在“太阳”上时，太阳会以恒速的方式绕着自己中心位置顺时旋转 `360deg` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/178ddc9b67bd418c9181f3d6655791df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1192&h=474&s=2224082&e=gif&f=203&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/LYqXJwJ

  


你是否发现了，使用 CSS `transition` 制作的旋转动画，当用户鼠标移出“太阳”时，它会以相反旋转（逆时针旋转）到初始位置（`rotate: 0`），整个过程都具有平滑的动画效果；而 CSS `animation` 制作的旋转动画则不同，当用户鼠标移动“太阳”时，它会立即停止动画，并肯间回到初始位置。

  


相比下来，CSS 过渡动画效果给用户一种更好的体验，动画反转的效果很自然。当然，使用 `animation` 也能实现相似的反转动画效果，只不过要更费一些时间。

  


```HTML
<div class="sun--wrapper">
    <div class="sun"></div>
</div>
```

  


```CSS
@layer animation {
    @keyframes rotate {
        to {
            rotate: 360deg;
        }
    }
    
    .sun--wrapper {
        transform-origin: center;
        animation: rotate 3s linear infinite reverse running;
    }

    .animation:hover {
        .sun--wrapper {
            animation-play-state: paused;
        }
    
        .sun {
            animation: rotate 3s linear infinite;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6baa198cd01a4247ba43a0f976643be3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=408&s=1908473&e=gif&f=163&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/YzBRJVo

  


虽然反转动画效果很平滑了，但上面这个示例还是有一定的局限性，`.sun--wrapper` 元素上应用的动画默认是播放的。如果该元素上动画默认是暂停状态，那么上面的代码就无法达到你的需求。要改变这种现状，我们就需要借助 JavaScript 脚本以及多个关键帧动画：

  


```CSS
@layer animation {
    @keyframes rotateIn {
        to {
            rotate: 360deg;
        }
    }

    @keyframes rotateOut {
        to {
            rotate: -360deg;
        }
    }

    .sun {
        animation: var(--animn, none) 3s linear var(--animic, 1);
    }
}
```

  


```JavaScript
const animated = document.querySelector('.animation');
const sun = document.querySelector('.sun');

animated.addEventListener('mouseover',() => {
    sun.style.setProperty('--animn', 'rotateIn');
    sun.style.setProperty('--animic', 'infinite');
})

animated.addEventListener('mouseleave',() => {
    sun.style.setProperty('--animn', 'rotateOut');
    sun.style.setProperty('--animic', '1');
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4356471a91b443fa61e1e54f9903f4f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=424&s=1502759&e=gif&f=148&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/eYxQQJx

  


像上面示例这样的场景在 Web 上很常见。也就是说，大多数制作反转动画效果的时候都是通过多个关键帧动画来实现，即分离动画的`@keyframes`，这也是一种最佳的实践。例如下面这个示例，在“加号”按钮点击时显示菜单，然后在下一次点击时隐藏它。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d53d3076faff4c91bbe89b8da4a7e78f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=564&s=713711&e=gif&f=237&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/wvNQREV

  


```CSS
@layer animation {
    @keyframes handler {
        0% {
            rotate: 0deg;
            scale: 1;
        }
        20% {
            rotate: 60deg;
            scale: 0.93;
        }
        55% {
            rotate: 35deg;
            scale: 0.97;
        }
        80% {
            rotate: 48deg;
            scale: 0.94;
        }
        100% {
            rotate: 45deg;
            scale: 0.95;
        }
    }
     
    @keyframes handler-reverse {
        0% {
            rotate: 45deg;
            scale: 0.95;
        }
        20% {
            rotate: -15deg;
        }
        55% {
            rotate: 10deg;
        }
        80% {
            rotate: -3deg;
        }
        100% {
            rotate: 0;
            scale: 1;
        }
    }
 
    @keyframes bounceInUp {
        from,
        60%,
        75%,
        90%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
    
        0% {
            opacity: 0;
            translate: 0 3000px;
            scale: 1 1;
        }
    
        60% {
            opacity: 1;
            translate: 0 -25px;
            scale: 0.95 1.05;
        }
    
        75% {
            translate: 0 10px;
            scale: 1.05 0.95;
        }
    
        90% {
            translate: 0 -5px;
            scale: 1 0.985;
        }
    
        to {
            translate: 0 0;
            scale: 1 1;
            opacity: 1;
        }
    }

    @keyframes bounceOutDown {
        0% {
            translate: 0 0;
            scale: 1 1;
            opacity: 1;
        }
    
        60% {
            translate: 0 -5px;
            scale: 1 0.985;
        }
    
        75% {
            translate: 0 10px;
            scale: 1.05 0.95;
        }
    
        90% {
            opacity: 1;
            translate: 0 -25px;
            scale: 0.95 1.05;
        }
    
        to {
            opacity: 0;
            translate: 0 3000px;
            scale: 1 1;
        }
    }

    .menu {
        opacity: 0;
        animation: bounceOutDown 0.4s ease-out forwards;
    }

    .handler {
        animation: handler-reverse 0.4s ease-out forwards;
    }

    input[type="checkbox"]:checked ~ .handler {
        animation: handler 0.4s ease-out forwards;
    }

    input[type="checkbox"]:checked ~ .menu {
        animation: bounceInUp 0.4s ease-in both 0.1s;
    }
}
```

  


你可能会感到好奇，很明显，这几个动画是相互反转的，为什么不直接使用 CSS 的 `animation-direction` 来实现呢？这是一个很好的问题，请先保存这个疑问，我们后续再回过头来解释。

  


再来看一个有关于这方面的示例，这个示例更简单。假设你正在给一个元素动画化改变其背影颜色，例如从 `#cc0` 到 `#079` ：

  


```CSS
@layer animation {
    @keyframes color {
        from {
            background: #cc0;
        }
        to {
            background: #079;
        }
    }

    body {
        animation: color 3s infinite;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dbceaedf3d349ce91fd8c1192572bcb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=534&s=216707&e=gif&f=125&b=12707f)

  


> Demo 地址：https://codepen.io/airen/full/QWYJoQV

  


不难发现，从新迭代的结束状态到开始状态的变化相当突然。如果我们将该动画用线性渐为描述的话，随着时间的推移，进展大致如下（显示四次迭代）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4457d58a648e4059ae9241cdf698fd9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1146&s=697103&e=jpg&b=9ab726)

  


你可以通过更改关键帧来减轻这种情况，但更好的方式是使用 `animation-direction` 属性，在迭代时改变动画方向，以使其更加平滑。

  


## 动画方向是什么？

  


我曾多提出过这样的观点：“越接近现实生活物体运动特征的动画，其效果就越逼真”。同样的，CSS 动画也现实生活中物体运动是相似的，它也有方向特征。例如，我们去一家五星级酒店，进入酒店大堂的门一般都是自动滑门或者旋转的门。拿自动滑门为例，当有客人靠近时，门会自动打开，当客人离开时，门会自动关闭。

  


如果你想通过 CSS 动画添加一些效果，让门的打开和关闭过程更加平滑；那么就可以使用 CSS 的 `animation-direction` 属性来控制。该属性旨在设置动画应正向播放、反向播放还是在正向和反向之间交替播放。

  


`animation-direction` 提供了四个不同的值，允许我们给动画设置不同的方向：

  


-   `normal` ：默认值，动画应正向播放
-   `reverse` ：动画应反向播放
-   `alternate` ：动画应交替播放，重复从正向到反向
-   `alternate-reverse` ：动画应交替反向播放，重复从反向到正向

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b61867a2dd24f8a8fdef4f832df0033~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=524&s=658906&e=gif&f=118&b=30052f)

  


> Demo 地址：https://codepen.io/airen/full/QWYzNxv

  


继续以自动滑为为例。

  


```HTML
<div class="door">
    <div class="door--left" data-animation style="--animn: doorLeft; --animdir: normal"></div>
    <div class="door--right" data-animation style="--animn: doorRight; --animdir: normal"></div>
</div>
```

  


```CSS
@layer animation {
    @keyframes doorLeft {
        to {
            translate: -80%;
        }
    }
  
    @keyframes doorRight {
        to {
            translate: 80%;
        }
    }

    [data-animation] {
        animation: 
            var(--animn, none) 
            var(--animdur, 5s) 
            var(--animf, linear)
            var(--animic, infinite) 
            var(--animdir, normal);
    }
}
```

  


如果你希望在有人靠近大门时以正常的方向打开（左侧的门向左，右侧的门向右），然后在人离开时以相同的方向关闭；那么只需要将 `--animdir` 设置为 `normal` 即可（`animation-direction: normal`）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2532878c3944b788b5a2c10ea86b21a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=968&h=490&s=6919105&e=gif&f=131&b=6265bc)

  


> Demo 地址：https://codepen.io/airen/full/MWLZyzQ

  


你可能已经发现了，大门在打开时符合我们日常生活中的现象，即左侧门向左推，右侧门向右推。可是，门在关闭时，上面的示例效果并不符合日常生活中的关闭现象。上例中，两扇门会立即回到最初状态。这是因为动画的 `animation-direction` 设置为 `normal` 值，表示动画应该按照关键帧的正常顺序播放。事实上呢？人在离开大门，大门关闭时，左侧边应该向右推，右侧门应该向左推，这样才更符合实现生活中关门的特征。

  


也就是说，我们需要的动画效果是这样的：门在有人靠近时以正常的方向打开（左侧门向左，右侧门向右），但在人离开时以相反的方向关闭（左侧门向右，右侧门向左）。这个时候，我们需要将 `animation-direction` 属性的值设置为 `alternate` ，即 `--animdir: alternate` 。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad01b90d1d6b4b61a68134d263b0ffdb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=522&s=11869311&e=gif&f=236&b=6265bc)

  


> Demo 地址：https://codepen.io/airen/full/PoVXzqW

  


正如你所看到的，这才更符合现实生活中开门和关门的效果。

  


我想，通过这个实例，你对 CSS 动画方向有了一个初步的认识，仅仅这样是不够的。如果你想更好的掌控动画方向，那就有必要深入了解 CSS 的 `animaiton-direction` 属性。接下来，我将详细的向大家阐述 `animation-direction` 属性中每个值的作用以及它们对动画的影响。

  


## 如何撑控动画的方向

  


为了更好的向大家阐述，如何使用 `animation-direction` 属性来精准掌控 CSS 的动画的方向，我们首先要一个动画示例。为了减少从中不必要的麻烦和困惑，我们将基于一个动画元素从左向右移动的动画效果来展开。

  


```CSS
@keyframes move {
    from {
        translate: 0;
    }
    to {
        translate: 60vw;
    }
}

.animated {
    animation: move 4s linear infinite var(--animdir, normal);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68cd2d3b36054c5eb7e896e5c63ec473~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=344&s=161886&e=gif&f=111&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/OJdrXXm

  


### 正向播放：normal

  


`animation-direction` 属性的值为 `normal` 时，动画将根据关键帧中指定的内容进行播放。

  


```CSS
.animated {
    animation-direction: normal;
}
```

  


这也是 CSS 动画的正常播放方向，也称为“正向播放”：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43891278d7dc47078be7bc5088255032~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=266&s=308444&e=gif&f=142&b=32052f)

  


> Demo 地址：https://codepen.io/airen/full/eYxbdqW

  


动画在每个循环中正向播放。换句话说，每次动画循环时，动画将重置为起始善存并重新开始。即动画如果重复播放，每次播放都会返回到关键帧的 `0%` 位置：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f997a26447e4a30a425263bc1507167~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1625&s=619208&e=jpg&b=282b3e)

  


如上图所示，动画正向播放（`animation-direction: normal`）时，每次循环播放的开始都是在关键帧的 `0%` 位置；结束都在关键帧的 `100%` 位置。

  


通常情况之下，要是对动画播放方向没有明确的要求，都会使用默认方向，即正向播放。

  


### 反向播放：reverse

  


反向播放指的是动画在每个循环中以相反的方向播放。例如上面的示例，默认情况下，动画元素 `.animated` 将会从左往右移动，但如果你将 `animation-direction` 设置为 `reverse` 时，动画则会以相反的方向播放，即动画元素 `.animated` 会从右向左移动：

  


```CSS
.animated {
    animation-direction: reverse;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dbc50eb97bc497f90ecf08d64cae372~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=370&s=380759&e=gif&f=206&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/dyawORa

  


从效果上看，反向播放（`reverse`）刚好与正向播放（`normal`）相反：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87a77cee0448409fb776698e7b98db74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1084&h=456&s=494041&e=gif&f=94&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/OJdrbxy

  


当动画播放方向为反向播放时，每次动画循环时，动画将重置为结束状态并重新开始。换句话说，动画每次会从关键帧的 `100%` 开始，到 `0%` 结束。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0677dff303334cf1adad1c9d5cb99a77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2687&h=1625&s=908253&e=jpg&b=282b3e)

  


反向播放 `reverse` 非常适合于动画以相反方向播放的场景。它的优势是，可以基于同一个 `@keyframes` ，使动画具有不同方向的播放效果。比如下面这个示例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c0eddb6921745c6ac9aea44beb238d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1232&h=456&s=17526488&e=gif&f=60&b=d3d9e8)

  


> Demo 地址：https://codepen.io/airen/full/mdvaRMR

  


这是一个模拟无限滚动的照片墙效果，从果上不难发现，第二列的播放方向与其他两列是相反的。上面这个示例，我们只需要创建一个 `@keyframes` 即可，并且将第二列的动画播放方向设置为反向播放即可：

  


```HTML
<div class="gallery">
    <div class="gallery__column">
        <!-- 第一列，正向播放 -->
    </div>
    <div class="gallery__column galler--reverse">
        <!-- 第二列，反向播放 -->
    </div>
    <div class="gallery__column">
        <!-- 第三列，正向播放 -->
    </div>
</div>
```

  


```CSS
@layer animation {
    @keyframes slide {
        to {
            translate: 0 -50%;
        }
    }

    .gallery__column {
        animation: slide 30s linear infinite; /* 正向播放，animation-direction 默认为 normal */
    
        &:hover {
          animation-play-state: paused;
        }
    }

    /* 反向播放 */
    .gallery--reverse {
        animation-direction: reverse;
    }
}
```

  


它同样可以应用于水平方向无限滚动的动画效果中：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13f321cee4024340aba7c16b7773fdfc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=406&s=9514190&e=gif&f=124&b=1b2331)

  


> Demo 地址：https://codepen.io/airen/full/OJdrWwz

  


上面示例在同一个关键帧的动画基础上，仅改变动画播放方向，就实现了从右向左或从左往右无限滚动的动画效果：

  


```CSS
@layer animation {
    @keyframes scroll {
        to {
            translate: calc(-50% - 0.5rem);
        }
    }
    
    /* 默认正向播放，从右往左滚动 */
    [data-animation] {
        animation: scroll 20s linear infinite var(--animdir, normal);
    }
    
    /* 反向播放，从左往右滚动 */
    [data-direction="reverse"] {
        --animdir: reverse;
    }
}
```

  


反向播放有的时候也可以制作一些带有创意的交互效果。例如下面这个用户头像边框动画效果，默认它是顺时间旋转，改变圆锥渐变的角度。你可以在悬浮状态下使动画反向播放，这样一来，用户鼠标悬停在用户头像上时，头像边框的渐变会反向旋转：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c22a4882c9bf4d4f8aac2c45753d3e12~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=416&s=2977679&e=gif&f=183&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/mdvaWOL

  


```CSS
@layer animation {
    @keyframes a {
        to {
            --a: 1turn;
        }
    }
  
    .avatar {
        animation: a 2s linear infinite var(--animdir, normal);
    
        &:hover {
            --animdir: reverse; /* 反向播放 */
        }
    }
}
```

  


需要注意的是，有些场景下，直接将 `animation-direction` 设置 `reverse` 使动画反向播放，并不是我们期望的效果。例如下面这个示例，无法直接将 `animation-direction` 设置为 `reverse` 达到预期的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14ce99e887934175b59e34f347e3d8ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=704&s=7653753&e=gif&f=433&b=320631)

  


> Demo 地址：https://codepen.io/airen/full/wvNRemy

  


这种情境之下，要实现期望的反转动画效果，就需要使用多个 `@keyframes` 来创建动画：

  


```CSS
@layer animation {
    @keyframes lineScaleIn {
        from {
            scale: 0 1;
        }
        to {
            scale: 1 1;
        }
    }

    @keyframes lineScaleOut {
        from {
            scale: 1 1;
        }
        to {
            scale: 0 1;
        }
    }

    @keyframes buttonBounceIn {
        0% {
            scale: 0;
            opacity: 0;
        }
        50% {
            scale: 1.2;
            opacity: 0.3;
        }
        75% {
            scale: 0.9;
            opacity: 0.7;
        }
        100% {
            scale: 1;
            opacity: 1;
        }
    }

    @keyframes buttonBounceOut {
        0% {
            scale: 1;
            opacity: 1;
        }
        50% {
            scale: 0.9;
            opacity: 0.7;
        }
        75% {
            scale: 1.2;
            opacity: 0.3;
        }
        100% {
            scale: 0;
            opacity: 0;
        }
    }
    
    @keyframes a {
        to {
            --a: 1turn;
        }
    }
    
    .avatar {
        animation: a 2s linear infinite var(--animdir, normal);
    
        &:hover {
            --animdir: reverse;
        }
    }

    .running {
        .line {
            transform-origin: left center;
            animation: lineScaleIn 1s linear both;
            scale: 0 1;
        }
        & button {
            transform-origin: center;
            animation: buttonBounceIn 1s linear both 0.5s;
            scale: 0;
            opacity: 0;
        }
        & li:nth-child(2) {
            .line {
                animation-delay: 2s;
            }
            & button {
                animation-delay: 3s;
            }
        }
    
        & li:nth-child(3) {
            .line {
                animation-delay: 4s;
            }
            & button {
                animation-delay: 5s;
            }
        }
    
        & li:nth-child(4) {
            .line {
                animation-delay: 6s;
            }
            & button {
                animation-delay: 7s;
            }
        }
    
        & li:nth-child(5) {
            .line {
                animation-delay: 8s;
            }
            & button {
                animation-delay: 9s;
            }
        }
    }

    /* 动画反向播放 */
    .reverse {
        .line {
            transform-origin: left center;
            animation: lineScaleOut 1s linear both 1s;
        }
        & button {
            transform-origin: center;
            animation: buttonBounceOut 1s linear both;
        }
    
        & li:nth-child(2) {
            .line {
                animation-delay: 3s;
            }
            & button {
                animation-delay: 2s;
            }
        }
    
        & li:nth-child(3) {
            .line {
                animation-delay: 5s;
            }
            & button {
                animation-delay: 4s;
            }
        }
    
        & li:nth-child(4) {
            .line {
                animation-delay: 7s;
            }
            & button {
                animation-delay: 6s;
            }
        }
    
        & li:nth-child(5) {
            .line {
                animation-delay: 9s;
            }
            & button {
                animation-delay: 8s;
            }
        }
    }
}
```

  


上面示例中，蓝色线条展开和收缩分别使用的是 `lineScaleIn` 和 `lineScaleOut` 关键帧，每个按钮的展示与隐藏则使用的是 `buttonBounceIn` 和 `buttonBounceOut` 关键帧。

  


因此，将 `animation-direction` 属性设置为 `reverse` ，并不能直接实现所有反向播放的动画效果，我们在实际使用的时候，应该根据具体的情境来决定，并做出正确的选择。

  


另外，当 `animation-direction` 属性设置为 `reverse` 时，动画反转播放的同时，时间函数也将被反转。例如，`ease-in` 时间函数将变为 `ease-out` 。因此，如果你使用 `reverse` 反转动画播放时，时间函数如果不是 `linear` ，需要考虑对时间函数也进行反转，否则制作的动画效果会略有突兀。在 CSS 中，我们可以使用[三次贝塞尔曲线 cubic-bezier()](https://juejin.cn/book/7288940354408022074/section/7298995488580337714)与 [CSS 自定义属性](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)相结合，快速构建反向缓动函数（稍后将会展开介绍）。

  


### 交替播放：alternate

  


如果将 `animation-direction` 设置为 `alternate` ，动画在每个循环中正反交替播放，第一次是正向播放，第二次是反向播放。

  


```CSS
.animated {
    animation-direction: alternate;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64a3ca90d3dc44fda2cb43cb96ed4035~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=460&s=610068&e=gif&f=354&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/JjxweoV

  


看上去同时具备正向播放（`normal`）和反向播放（`reverse`）。也就是说，设置交替播放的动画，第一次播放行为类似于 `normal` ，第二次播放行为类似于 `reverse` ，此后依此类推：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b4c79e2a7a046b18a92e807b3408170~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=526&s=1370081&e=gif&f=223&b=31052e)

  


> Demo 地址：https://codepen.io/airen/full/gOqZQaM

  


这意味着，动画循环的奇数次迭代按正常方向播放（正向播放），而偶数次迭代按反方向播放（反正播放）。确定动画循环是奇数次还是偶数次的计数从 `1` 开始。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d36d892b18649e8867901250591b590~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2687&h=2824&s=1799591&e=jpg&b=282b3e)

  


交替播放对于制作一些交替动画非常有用，最为典型的就是脉动动画效果（也称呼吸灯动画效果）。如果不使用交替播放，我们制作脉动动画效果，一般会将第一帧和最后一帧设置为初始状态，在第 `50%` 设置为结束状态。例如：

  


```CSS
@keyframes pulse {
    from, to {
        scale: 1;
        opacity: 1;
    }
    
    50% {
        scale: 1.15;
        opacity: .9;
    }
}

#follow {
    animation: pulse 4s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2aea1297fb84e6083a3e7c3096e3ea1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=978&h=500&s=2200996&e=gif&f=108&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/ExrGOMx

  


如你所见，应用在用户头像右下角的按钮动画效果就像是在呼吸一样，不断重复一大一小的效果。

  


事实上，我们使用交替播放（即 `animation-direction: alternate`）可以在关键帧中只有一个 `50%` 的帧来定义同样的动画效果：

  


```CSS
@keyframes pulse {
    50% {
        scale: 1.15;
        opacity: .9;
    }
}
```

  


这个技巧非常有用，可以提供与第一个或最后一个关键帧相同的回退效果，而无需在 `@keyframes` 规则中重复定义它们。当你希望它们与已应用于元素的样式相同时，你可以省略每个动画中的 `from` 和 `to` 关键帧。这样设计的动画效果看起来会更自然：

  


```CSS
@keyframes pulse {
    50% {
        scale: 1.15;
        opacity: .9;
    }
}

#follow {
    animation: pulse 2s ease-in-out infinite;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/910336e7c4ad4846844f606eab3555a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=524&s=1700946&e=gif&f=78&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/GRzPwaM

  


它只是翻转了每个偶数次迭代，而不是在动画中同时具有两种状态（缩小和放大）。之所以这样做，动画看起来更自然，那是因为 `animation-direction: alternate` 也会反转反向迭代的时间（缓动）函数。

  


### 交替反向播放：alternate-reverse

  


交替反向播放 `alternate-reverse` 正好与交替播放 `alternate` 相反，它反转了 `alternate` 的播放方向：

  


```CSS
.animated {
    animation-direction: alternate-reverse;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60ad4ffe48f04ddb938522c27f453495~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=462&s=1077020&e=gif&f=243&b=32052f)

  


> Demo 地址：https://codepen.io/airen/full/wvNRNJB

  


正如你所看到的，交替播放从“第一次：向前”开始，而交替反向播放从“第一次：反向（向后）”开始。此后，正向重复播放偶数次，反向播放奇数次。这意味着，动画在每个循环中正反交替播放，奇数次是反向播放，偶数是正向播放。确定循环是奇数还是偶数的计数从 `1` 开始。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8351afee8324f99ad9173d27a977ec3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2687&h=4182&s=2737041&e=jpg&b=282b3e)

  


从上图中不难发现，`animation-direction` 属性的四个值中，我们可以总结出以下几点：

  


-   `normal` 和 `reverse` 两者表现行为恰好相反
-   `alternate` 和 `alternate-reverse` 两者表现行为恰好相反
-   `alternate` 同时具备 `normal` 和 `reverse` 两者表现特征

  


我们在制作动画的过程中，如果需要制作一个反向动画，则使用 `reverse` 较为方便；如果需要制作一个交替动画，则使用 `alternate` 较为方便。

  


## 动画方向会影响动画哪些特性

  


虽然说 CSS 的 `animation-direction` 只是用来设置动画播放方向的，但它还会影响到动画缓动函数和填充模式的相应的表现。例如，如果你将 `animation-direction` 设置为 `reverse` 时，它除了会使动画反向播放之外，也会反转缓动函数，例如 `ease-in` 会反转成 `ease-out` 。

  


另外，`animation-direction` 取不同值时，对于关键帧的第一帧和最后一帧有着决定性的影响，这也将会影响到 `animation-fill-mode` 的最终结果，尤其是 `animation-fill-mode` 取值为 `forwards` 和 `backwards` 的结果。

  


虽然我曾在介绍[三次贝塞尔曲线 cubic-bezier() 函数](https://juejin.cn/book/7288940354408022074/section/7298995488580337714)和[动画填充模式 animation-fill-mode](https://juejin.cn/book/7288940354408022074/section/7307284837554585638) 时有提到过相关方面的内容，但我还是想再次向大家复述一下这两个方面的内容，主要是为了加强大家的记忆。同时，希望大家在实际开发动画时，要是碰到类似问题，可以立即修复或者尽可能的开发的过程中就避免。

  


### 使用自定义属性反转缓动函数

  


通常情况下，我们在开发动画的时候，要是缓动函数使用的是 `linear` 缓动函数，即使动画设置了反向播放 `animation-direction` 的值为 `reverse` ，也不会对动画效果有任何影响，因为 `linear` 缓动函数是一种恒速运动，不管是从动画开始到结束，还是动画结束到开始，动画元素运动的速度都是相等的。

  


除此之外，我们在开发动画时，尤其在涉及到反向播放的动画效果时，就需要考虑缓动函数被反转时给动画效果带来的相关影响。例如下面这个幻灯片播放效果，它是 Web 中很常见的一种效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95fda51a13e94a2fb50fd2f197ebe148~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=546&s=1202612&e=gif&f=139&b=4b5363)

  


像上面这种轮播图可以在两个方向运动：

  


-   如果你点击左箭头，当前项目将向右滑出视图或容器，下一个项目将从左边滑入视图或容器
-   如果你点击右箭头，当前项目将向左滑出视图或容器，下一个项目将从右边滑入视图或容器

  


在构建这个轮播图时，大多数 Web 开发者可能会忽略一个细节，不管项目是从左向右滑入，还是从右向左滑入，都会使用相同的一个自定义的缓动函数。事实上，这样制作的轮播图滑动的效果并不是最好的一个效果。如果你想给用户一个体验更好的滑入滑出的动画效果，不仅需要一个自定义缓动函数，而且还需要将其反转以获得正确的效果。这就需要反转三次贝塞尔曲线。这意味着，你需要创建自定义缓动函数，并且反转它。听上去很复杂，但实际上相当简单。

  


在详细介绍如何反转三次贝塞尔曲线之前，我还是想花一点时间来向大家阐述一下反转三次贝塞尔曲线的用途和作用。继续拿轮播图为例。

  


通常情况之下，用户会点击轮播图组件中的“上一个”或“下一个”按钮来使项目滑入滑出视图。大部分开发者会通过 `animation-direction` 来反转滑出的项目：

  


```CSS
.slider--reversed {
    animation: slide 3s cubic-bezier(0.45, 0.25, 0.60, 0.95) reverse;
    
    /* 或者 */
    animation-direction: reverse;
}
```

  


但有一个问题：反转动画的同时也反转了缓动曲线！因此，动画在一个方向上（比如从左往右滑入）看起来很棒，但在另一个方向（比如从右向左滑入）就完全不对了。

  


我们通过下面这个简单的示例来模拟。紫色框模拟从左往右滑入，蓝色框模拟从右往左滑入。这两个元素使用相同的动画参数，比如帧动画、缓动函数、持续时间等，唯一不同的是，蓝色框动画被反转了（设置了 `animation-direction: reverse`）：

  


```CSS
@layer animation {
    @keyframes slide {
        from {
            translate: 0;
        }
        to {
            translate: calc(60vw - 100% - 2rem);
        }
    }
    
    .box {
        animation: slide 3000ms cubic-bezier(0.42, 0.15, 0.22, 0.96) forwards;
    
        &:last-child {
            translate: calc(60vw - 100% - 2rem);
          
            animation: slide 3000ms cubic-bezier(0.45, 0.25, 0.60, 0.95) reverse forwards;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be547ba4666540b5a4e4f76a21d8e492~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=440&s=3151402&e=gif&f=386&b=000000)

  


  


> Demo 地址：https://codepen.io/airen/full/ZEwyEzb

  


这两个动画给你的感觉完全不同。紫色框在早期加速，随着进展逐渐减速；而蓝色框一开始就相当缓慢，然后在突减速之前迅速加速。这对于轮播图来说感觉完全不对。

  


我们可以通过以下两种方式来使轮播图滑动效果变得更优雅：

  


-   可以创建一个新的关键帧动画用于滑出的项目，然后应用与之前相同的缓动函数。只不过这种方式对于一个更复杂的动画，要在相反的方向创建相同的动画则需要更多的工作量，还很容易出错
-   可以使用相同的关键帧动画（带有 `animation-direction: reverse`），并反转缓动曲线，以便在两个方向上都获得相同的缓动。这个方案相对而言更简单一点，也不容易出错

  


也就是说，两种方案相比，第二种方案更适合我们。就该方案而言，最为关键的是我们要掌握如何反转缓动函数。

  


简单地说，反转缓动函数意味着改变其方向或流动。如果你有一个 `cubic-bezier()` 函数，反转它将涉及到交换控制点。这意味着我们需要将曲线围绕其轴旋转 `180` 度，并找到新的坐标。

  


我们都知道 `cubic-bezier()` 函数定义的方式是 `cubic-bezier(P1x, P1y, P2x, P2y)` 。假设你初设的 `cubic-bezier()` 函数是 `cubic-bezier(0.42, 0, 0.58, 1)` ，那么它的反转函数则是 `cubic-bezier(0.58, 1, 0.42, 0)` 。这种反转会将缓动效果从缓入变为缓出，反之亦然。实质上，它在水平方向上翻转了曲线。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afe5e31f96564009bc2df6975af0294b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=855&s=61503&e=jpg&b=000000)

  


你可能已经发现了，我们可以通过一些简单的数学运算实现三次贝塞尔曲线的反转，即通过交换坐标对并从 `1` 中减去每个值。假设 `cubic-bezier()` 的初始值是 `(x1, y1, x2, y2)` ，那么它反转之后的值将是 `((1 - x2), (1 - y2), (1 - x1), (1 - y1))` 。

  


在上面的示例中，再添加一个动画元素 `.box` ，它朝着相反的方向滑动，但缓动函数被反转了，最终给了和第一个 `.box` 相同的动画感觉，不同的只是移动方向相反：

  


```CSS
@layer animation {
    @keyframes slide {
        from {
            translate: 0;
        }
        to {
            translate: calc(60vw - 100% - 2rem);
        }
    }
    
    .box {
        --c1: 0.420;
        --c2: 0.150;
        --c3: 0.220;
        --c4: 1.015;
        
        --c1-r: calc(1 - var(--c3));
        --c2-r: calc(1 - var(--c4));
        --c3-r: calc(1 - var(--c1));
        --c4-r: calc(1 - var(--c2));
        
        --normal: cubic-bezier(var(--c1), var(--c2), var(--c3), var(--c4));
        --reverse: cubic-bezier(var(--c1-r), var(--c2-r), var(--c3-r), var(--c4-r));
    
        animation: slide 3000ms var(--normal) forwards;

        &:nth-child(2) {
            translate: calc(60vw - 100% - 2rem);
            animation: slide 3000ms var(--normal) reverse forwards;
        }
        
        &:nth-child(3) {
            translate: calc(60vw - 100% - 2rem);
            animation: slide 3000ms var(--reverse) reverse forwards;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61c085b4b082481e967d5fc34c933b45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=540&s=2700901&e=gif&f=251&b=000000)

  


  


> Demo 地址： https://codepen.io/airen/full/WNPONmw

  


正如示例中代码所示，你可以使用 [CSS 自定义属性来计算新的缓动函数](https://juejin.cn/book/7223230325122400288/section/7252964839705247755)。

  


首先，你可以给初始的三次贝塞尔曲线 `cubic-bezier()` 的每个参数值分配一个变量，例如：

  


```CSS
:root {
    --x1: .45;
    --y1: .25;
    --x2: .6;
    --y2: .95;
    
    --originalCurve: cubic-bezier(var(--x1), var(--y1), var(--x2), var(--y2));
}
```

  


然后，我们可以使用这些变量来计算新的值：

  


```CSS
:root {
    --x1: .45;
    --y1: .25;
    --x2: .6;
    --y2: .95;
    
    --originalCurve: cubic-bezier(var(--x1), var(--y1), var(--x2), var(--y2));
    --reversedCurve: cubic-bezier(calc(1 - var(--x2)), calc(1 - var(--y2)), calc(1 - var(--x1)), calc(1 - var(--y1)));
}
```

  


现在，如果我们对第一组变量进行任何更改，反转的曲线将自动计算。为了在检查和调试代码时更容易查看，我喜欢将这些新值拆分为它们自己的变量：

  


```CSS
:root {
    /* 原始值 */
    --x1: .45;
    --y1: .25;
    --x2: .6;
    --y2: .95;
    --originalCurve: cubic-bezier(var(--x1), var(--y1), var(--x2), var(--y2));
    
    /* 反转值 */
    --x1-r: calc(1 - var(--x2));
    --y1-r: calc(1 - var(--y2));
    --x2-r: calc(1 - var(--x1));
    --y2-r: calc(1 - var(--y1));
    --reversedCurve: cubic-bezier(var(--x1-r), var(--y1-r), var(--x2-r), var(--y2-r));
}
```

  


现在，唯一剩下的是将新的曲线应用于我们的反转动画：

  


```CSS
.animation {
    animation: slide 3s var(--originalCurve);
}
.animation--reversed {
    animation-timing-function: var(--reversedCurve);
    animation-direction: reverse;
}
```

  


为了帮助可视化，我构建了一个小工具来计算 `cubic-bezier` 的反转值。输入原始坐标值以获取反转曲线：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06aa45171e54477da3e87ec790996520~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=546&s=1135557&e=gif&f=191&b=4d4a6c)

  


> Demo 地址：https://codepen.io/airen/full/QWYgwbd

  


我们来看一个反转三次贝塞尔曲线的实际用例，用于构建轮播组件的滑动动画。该案例由 [@Michelle Barker](https://codepen.io/michellebarker/full/OaYpWp) 提供，实际效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ea58d8ae11c492086bed6d06ca9c40c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1408&h=452&s=4003722&e=gif&f=184&b=131215)

  


  


> Demo 地址：https://codepen.io/airen/full/JjxJoEw （来源于 [@Michelle Barker](https://codepen.io/michellebarker/full/OaYpWp) ）

  


```HTML
<div data-carousel>
    <ul class="slide__list Wallop-list">
        <li class="slide__item Wallop-item Wallop-item--current"></li>
        <li class="slide__item Wallop-item"></li>
        <!-- ... -->
        <li class="slide__item Wallop-item"></li>
    </ul>
</div>    
```

  


涉及到动画方面的代码如下：

  


```CSS
.Wallop-item {
    /* 初始三次贝塞尔曲线*/
    --x1: 0.1;
    --y1: 0.67;
    --x2: 0.29;
    --y2: 0.98;
    --originalCurve: cubic-bezier(var(--x1), var(--y1), var(--x2), var(--y2));
    
    /* 反转后的三次贝塞尔曲线 */
    --reversedCurve: cubic-bezier(calc(1 - var(--x2)), calc(1 - var(--y2)), calc(1 - var(--x1)), calc(1 - var(--y1)));
    --length: 1300ms;
    visibility: hidden;
}

.Wallop-item--current {
    visibility: visible;
    position: relative;
}

.Wallop-item--current .slide__heading,
.Wallop-item--current .slide__quote,
.Wallop-item--current .slide__cite {
    animation: slideIn var(--length) forwards var(--originalCurve);
}

.Wallop-item--showPrevious .slide__heading,
.Wallop-item--showPrevious .slide__quote,
.Wallop-item--showPrevious .slide__cite {
    animation: slideOut var(--length) var(--delay) forwards reverse var(--reversedCurve);
}

.Wallop-item--showNext .slide__heading,
.Wallop-item--showNext .slide__quote,
.Wallop-item--showNext .slide__cite {
    animation: slideIn var(--length) var(--delay) forwards var(--originalCurve);
}

.Wallop-item--hidePrevious,
.Wallop-item--hideNext {
    --length: 500ms;
    visibility: visible;
}

.Wallop-item--hidePrevious .slide__heading,
.Wallop-item--hidePrevious .slide__quote,
.Wallop-item--hidePrevious .slide__cite {
    animation: slideOut var(--length) forwards var(--originalCurve);
}

.Wallop-item--hideNext .slide__heading,
.Wallop-item--hideNext .slide__quote,
.Wallop-item--hideNext .slide__cite {
    animation: slideIn var(--length) forwards reverse var(--reversedCurve);
}

@keyframes slideIn {
    0% {
        transform: translate3d(50%, 0, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}
@keyframes slideOut {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(-50%, 0, 0);
        opacity: 0;
    }
}
```

  


你可以使用相似方法去优化你的轮播图组件的动画效果了！

  


### 动画播放方向对动画填充模式的影响

  


通常情况下，动画填充模式中的“向前”模式（`forwards`）总是使用 `100%` 关键帧，“向后”模式（`backwards`）总是使用 `0%` 关键帧，但实际上，情况并如总是如此。因为关键帧的 `0%` 和 `100%` 会受到 CSS 的 `animation-direction` 和 `animation-iteration-count` 属性值的影响，动画的第一个关键帧实际上可能不是 `0%` ，而最后一个关键帧可能不是 `100%` 。

  


让我们看一个使用 `backwards` 但 `animation-direction` 设置为 `reverse` 的简单示例。

  


```CSS
@layer animation {
    @keyframes ani {
        0% {
            background: lime;
            translate: -300px;
        }
        100% {
            background: yellow;
            translate: 300px;
        }
    }

    .animated {
        animation: ani 5s linear backwards reverse;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b21254bd4034972b66f64d5d09dbea6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=488&s=1223460&e=gif&f=388&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/rNPqpPp

  


动画的方向被反转了（`animation-direction: reverse`），动画的第一个关键帧是 `100%` ，这意味着在动画开始之前元素使用了 `100%` 关键帧的样式。这就是为什么动画元素一开始就向右移了 `300px` （即 `translate: 300px`），并且背景色为 `yellow` （即 `background:yellow`），然后慢慢向左移动，并且背景色慢慢变成 `lime` 色，最后跳到 `0` 位置（`translate: 0`），且背景色跳到红色（`red`）的原因。

  


也就是说，当 `animation-direction` 为 `normal` 或 `alternate` 时，关键帧第一帧为 `0%` 或 `from` ；反之，当 `animation-direction` 属性的值为 `reverse` 或 `alternate-reverse` 时，关键帧的第一帧为 `100%` 或 `to` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3195857f0ce648eabb604105eb6c8ae6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=478&s=3015476&e=gif&f=849&b=32052f)

  


> Demo 地址：https://codepen.io/airen/full/abXRqoa

在使用反向动画时，使用 `forwards` 填充模式也会出现类似的问题，但使用多次迭代的交替动画也可能导致结束关键帧不是 `100%`。在以下示例中，我们的 `animation-direction` 设置为 `alternate`，`animation-iteration-count` 设置为 `2`。

  


```CSS
@layer animation {
    @keyframes ani {
        0% {
            background: lime;; 
            translate: -300px;
        }
        100% {
            background: yellow;
            translate: 300px;
        }
    }

    .animated {
        animation: 
            var(--animn, ani) 5s linear var(--animdel, 0s) 
            var(--animfm, forwards) var(--animps, paused) 
            var(--animic, 2) var(--animdir, alternate);  
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f96398758b74f298cfaa52381e7567e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=466&s=2137520&e=gif&f=586&b=330630)

  


  


> Demo 地址：https://codepen.io/airen/full/BaMqYjL

  


在这个示例子，完成整个动画之后，动画元素一直保持着这个样式，向左移了 `300px` （`translate: -300px`），并且背景色为 `lime` 。这是因为我们动画的最后一个关键帧是 `0%` ，因为动画运行了两次，第一次迭代是从 `0%` 到 `100%` ，第二次迭代从 `100%` 到 `0%` 。

  


在动画结束时，`forwards` 指定动画元素应用关键帧最后一帧的样式规则，但关键帧最后一帧会受到 `animation-direction` （动画运动方向）和 `animation-iteration-count` （播放次数）的影响。

  


| **`animation-direction`** | **`animation-iteration-count`** | **关键帧最后一帧**   |
| ------------------------- | ------------------------------- | ------------- |
| `normal`                  | 偶数或奇数                           | `100%` 或 `to` |
| `reverse`                 | 偶数或奇数                           | `0%` 或 `from` |
| `alternate`               | 偶数                              | `0%` 或 `from` |
| `alternate`               | 奇数                              | `100%` 或 `to` |
| `alternate-reverse`       | 偶数                              | `100%` 或 `to` |
| `alternate-reverse`       | 奇数                              | `0%` 或 `from` |

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ecd2bc3f1084fc4b88baae6d122e0f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=490&s=3505828&e=gif&f=912&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/OJdBQQp

  


重要的是要注意你动画的方向（`animation-direction`）和迭代次数（`animation-iteration-count`），以便确切知道动画第一个和最后一个关键帧是哪个，从而才能准确判断出动画填充模式最终会将哪个状态的样式应用到动画元素上：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d72fb830a724219b2d585e1869f3b94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=494&s=2501759&e=gif&f=607&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/RwveQEo

  


注意，这两点都是 `animation-direction` 容易给初学者在制作动画时带来困惑之处，也容易造成动画效果不符合预期的关键因素。因此，大家在开发动画时，如果需要应用 `animation-direction` 控制动画方向时，就要时刻知道它对动画缓动函数和填充模式两者的影响。只有这样，才能避免因 `animation-direction` 应用不对而产生不好的动画效果。

  


## 小结

  


`animation-direction` 属性是CSS动画中一个关键的控制属性，它允许我们更精确地定义动画的播放方向，为设计师和开发者提供了更多的控制能力。

  


-   `normal`：正向播放，即从动画的起始状态到结束状态。
-   `reverse`：反向播放，即从动画的结束状态到起始状态。
-   `alternate`：交替播放，奇数次迭代正向播放，偶数次迭代反向播放。
-   `alternate-reverse`：交替反向播放，与`alternate` 相反，奇数次迭代反向播放，偶数次迭代正向播放。

  


精确控制动画方向不仅仅是技术层面的考虑，更是为了提升用户体验。动画能够吸引用户的注意力，交替的动画方向可以增加页面的动态感，使用户感觉页面更加生动有趣。例如，在一个按钮点击后颜色交替变化的动画中，用户可以更直观地感知到按钮的交互反馈，提高了用户与页面的互动性。

  


总而言之，使用`animation-direction`属性，我们可以更灵活地控制动画的方向，为网页设计和用户体验提供更多可能性。通过结合不同的属性值和其他动画属性，我们能够创造出更富有创意和吸引力的交互元素。在实际项目中，合理运用`animation-direction`将有助于优化页面交互，提升用户体验，使网页更具吸引力和互动性。