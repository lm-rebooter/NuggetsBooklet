在现代 Web 开发中，[CSS 过渡动画（transition）和关键帧动画（animation）](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)已成为创作动画的关键技术之一。利用过渡和动画，我们仅用几行 CSS 代码就可以创建出复杂而又流畅的动画效果。通常情况下，仅使用样式表动画就足够了，但是在某些情况下，我们可能需要更多的控制。例如，当页面上的某个动画结束时触发另下的动画的运行，或者说，当页面上的某个动画结束时，更新元素的内容：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f53dfd77664d48aab897e89d4c2424c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1248&h=642&s=12984613&e=gif&f=230&b=13181a)

  


正如上图中第三个动画效果，招手动画结束之后，文字才淡入淡出，当文字动画效果结束之后，底部按钮才出现。就这个组合效果而言，CSS 关键帧动画可以通过动画编排完成，但对于过渡动画，仅使用 CSS 无法完成的。我们需要与 JavaScript 融合在一起，才可能完成。

  


尽管这并不是很频繁，但在复杂的场景中确实会发生。事实上，Web 上的一些富交互场景中，不管是 CSS 的关键帧动画还是过渡动画，我们都需要与 JavaScript 融合在一起，尤其是在处理动画事件时。例如，我们想要捕获动画的完成，我们需要一个基于事件的回调，以便在其中运行相关的代码。

  


虽然，在 Web 动画 API 出现之前，JavaScript 中并没有高级别的动画 API，但有一些 JavaScript API 可以帮助我们更好的控制 CSS 动画。这节课，我将与大家一起探讨 JavaScript 在处理 CSS 动画方面有哪些 API 可用，涵盖了CSS 动画的各种事件类型。通过详细的示例代码和实际应用场景，将学会如何精确监听过渡和动画的开始、结束、取消等事件，搞高你的动画交互水平。你将掌握如何利用这些事件构建交互性更强的 Web 界面。

  


## 先从问题说起

  


以最近很火爆的[元梦之星](https://ymzx.qq.com/web202312pc/index.html)首页的首屏动画为例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f5d4261c82447c9b3f25947665f53ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=578&s=11660568&e=gif&f=56&b=000000)

  


> URL：https://ymzx.qq.com/web202312pc/index.html

  


这是非常常见的封面动画效果。在封面上使用动画，使首幕栩栩如生，赋予其独特的外观，形成页面的第一印象。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f02339d071473e88d8923c7f33ac32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1156&h=658&s=10873076&e=gif&f=128&b=2b3033)

  


正如你所看到的，首屏上有多个动画元素，这些元素的动画效果大多都会是 `fadeIn` 、`fadeInDown` 、`fadeInRight` 、`fadeInUp` 、`fadeInLeft` 和 `zoomIn` 等，著名的 [Animation.css](https://animate.style/) 动画库就包含了这些常见的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9727e1ba5cd24240b0c2cf214a3983e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=472&s=1585185&e=gif&f=180&b=101010)

  


以元梦之星为例，[使用 CSS 关键帧动画，借助动画编排，主要控制动画元素出现时序、动画的持续时间和延迟时间](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)等，可以很轻易的实现：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0f93ffb00b34b24be6acbdf10c0f8e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2609&h=1180&s=1373958&e=jpg&b=340e37)

  


```HTML
<div class="game">
    <header>
        <h1 class="logo"></h1>
        <div class="off"></div>
        <div class="home"></div>
    </header>
    <main>
        <div class="playing"></div>
        <div class="slogan"></div>
        <div class="download"></div>
        <div class="down"></div>
    </main>
    <aside>
        <div class="qrcode"></div>
        <div class="notes"></div>
    </aside>
    <video class="absf" muted="" loop="" autoplay="true" preload="true" src="https://ymzx.lv.game.qq.com/dis_kt_051e943d711166e453474838a5ce5254_1702579567/0b53guaaoaaa2yaex4d37rs6onoda42qabya.f0.mp4" poster="https://game.gtimg.cn/images/ymzx/web202312pc/main-wdbU1neL.jpg"></video>
</div>
```

  


```CSS
@layer animation {
    @keyframes fadeInDown {
        from {
            translate: 0 10vh 0;
            opacity: 0;
        }
        to {
            translate: 0 0 0;
            opacity: 1;
        }
    }

    @keyframes fadeInUp {
        from {
            translate: 0 -10vh 0;
            opacity: 0;
        }
        to {
            translate: 0 0 0;
            opacity: 1;
        }
    }

    @keyframes fadeInRight {
        from {
            translate: 100% 0 0;
            opacity: 0;
        }
        to {
            translate: 0 0 0;
            opacity: 1;
        }
    }
    
    @keyframes swing {
        from,
        to {
            transform-origin: top center;
        }
        20% {
            rotate: 0 0 1 15deg;
        }
    
        40% {
            rotate3: 0 0 1 -10deg;
        }
    
        60% {
            rotate: 0 0 1 5deg;
        }
    
        80% {
            rotate: 0 0 1 -5deg;
        }
    
        to {
            rotate: 0 0 1 0deg;
        }
    }
    
    @keyframes bounce {
        from,
        to {
            transform-origin: center bottom;
        }
        from,
        20%,
        53%,
        to {
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            translate: 0 0 0;
        }
    
        40%,
        43% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            translate: 0 -15px 0;
            scale: 1 1.1;
        }
    
        70% {
            animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
            translate: 0 -8px 0;
            scale: 1 1.05;
        }
    
        80% {
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            translate: 0 0 0;
            scale: 1 0.95;
        }
    
        90% {
            translate: 0 -4px 0;
            scale: 1 1.02;
        }
    }

    .playing {
        animation: fadeInDown 0.5s cubic-bezier(0.19, 1, 0.22, 1) both;
    }
    
    .slogan {
        animation: fadeInDown 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0.1s both;
    }
    
    .download {
        animation: fadeInDown 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0.2s both;
        transition: scale 0.28s ease-in-out;
        &:hover {
            scale: 1.15;
        }
    }
    
    .down {
        animation: 
            fadeInDown 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0.3s both,
            bounce 1s cubic-bezier(0.19, 1, 0.22, 1) 0.8s both infinite;
    }
    
    .logo {
        animation: fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0.8s both;
    }
    
    .off {
        animation: 
            fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) 1.3s both,
            swing 0.5s cubic-bezier(0.19, 1, 0.22, 1) 1.8s both 8;
        transition: scale 0.28s ease-in-out;
        &:hover {
            scale: 1.15;
        }
    }
    
    .home {
        animation: fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) 1.8s both;
        transition: scale 0.28s ease-in-out;
        &:hover {
            scale: 1.15;
        }
    }

    .qrcode {
        animation: fadeInRight 0.5s cubic-bezier(0.19, 1, 0.22, 1) 2.3s both;
    }

    .notes {
        animation: fadeInRight 0.5s cubic-bezier(0.19, 1, 0.22, 1) 2.8s both;
        transition: scale 0.28s ease-in-out;
        &:hover {
            scale: 1.15;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24297a085ec44561a5176cf1209777a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=440&s=20159978&e=gif&f=125&b=ddcdb1)

  


> Demo 地址：https://codepen.io/airen/full/poGMaeZ

  


上面这个示例，大部分动画效果都可以使用过渡动画来实现，也可以通过过渡动画的持续时间和延迟时间来编排它们。只不过，相对而言过渡动画的触发时间要比关键帧动画麻烦一些，有时候不得不通过 JavaScript 相关的事件来触发。另外，像示例中 `.off` 和 `.down` 后面应用到的循环动画 `swing` 和 `bounce` ，仅仅通过过渡动画是无法实现的。因为，到目前为止，CSS 运渡动画还不能像关键帧动画一样，控制循环播放的次数，如果需要使用过渡动画实现循环播放的效果，就需要与 JavaScript 相融合，通过捕获过渡动的结束时机，然后再次触发过渡动画，从而达到循环播放的效果。

  


我想通过这个示例告诉大家的是，虽然 CSS 过渡动画和关键帧动画是制作 Web 动画的主流技术之一，使用它们也能创建出复杂而又流畅的动画效果，但在一些富交互场景，有些交互或效果不得不依赖于动画相关的事件来触发。在这样的情境之下，我们不得不将 CSS 过渡动画和关键动画与 JavaScript 事件相融合。这也是我们这节课存在的目的以及其重要性。

  


## 动画事件简介

  


接下来我们要聊的动画事件并不是 WAAPI 中的 JavaScript API ，这部分会留到专门的课程中讲解。这里所说的动画事件主要还是 CSS 过渡动画和关键帧动中 JavaScript API。我们可以从 W3C 的相关规范中获得 [CSS 过渡动画](https://www.w3.org/TR/css-transitions-1/#transition-events)和[关键帧动画](https://www.w3.org/TR/css-animations-1/#events)所涉及到的相关事件：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ece8241a98c9486eb81818a04d956675~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1820&h=1058&s=776710&e=jpg&b=fdfdfd)

  


简单地说，不管是 CSS 过渡动画（`transition`）还是关键帧动画（`animation`）都有自己的“生命周期”。

  


-   **动画开始状态：** 动画开始播放的状态，即元素在没有应用动画之前的状态
-   **动画运行状态**：当触发了动画，元素进入动画状态，属性逐渐发生变化，这个过程是根据动画的持续时间、缓动函数等参数进行的
-   **动画结束状态**：动画运行结束的状态，即元素在运行完动画之后的状态

  


当我们在运行一个 CSS 动画时，所看到的只是动画对元素视觉上的改变。事实上，在幕后，它们在它们的生命周期的关键点会触发相应的动画事件。这些事件使你能够在动画的不同阶段执行特定的操作。例如，在 `A` 动画结束时触发其他 `B` 动画的开始执行，或者在动画结束时打开一个对话框等。Web 开发者通过监听这些事件，可以更精确地控制和定制动画的行为。

  


JavaScript 分别为 CSS 过渡动画（`transition`）和关键帧动画（`animation`）提供了 `TransitionEvent` 和 `AnimationEvent` 两个对象，它们通常用于处理与 CSS 动渡动画和关键帧动画相关的事件：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1846e10280b44d65b2e3888239489f28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4916&h=3260&s=632219&e=png&b=ffffff)

先简单解释一下上图。

  


### CSS 过渡动画：TransitionEvent

  


`TransitionEvent` 是用于表示与CSS 过渡动画（`transition`）相关的事件的 JavaScript 对象。它通常用于处理与 CSS 过渡动画相关的事情，例如 `transitionrun`、`transitionstart`、`transitionend` 和 `transitioncancel`。

  


以下是一些关于 `TransitionEvent` 的关键信息：

  


-   构造函数： `TransitionEvent` 可以通过构造函数 `new TransitionEvent(type, options)` 创建对象，其中 `type` 表示事件类型，而 `options` 是一个可选对象，可以包含额外的属性。

-   常见事件类型： 与 CSS 过渡相关的常见事件类型包括：

    -   `transitionrun`: 过渡被创建时触发。
    -   `transitionstart`: 过渡的延迟阶段结束时触发。
    -   `transitionend`: 过渡完成时触发。
    -   `transitioncancel`: 过渡被取消时触发。

-   事件属性： `TransitionEvent` 对象包含一些常见的事件属性，例如：

    -   `propertyName`: 返回与过渡关联的 CSS 属性的名称。
    -   `elapsedTime`: 返回触发事件时过渡已经运行的时间（以秒为单位）。
    -   `pseudoElement`: 返回触发事件的伪元素的名称。
    -     


以下是一个简单的示例，演示如何使用 `TransitionEvent`：

  


```HTML
<div class="element"></div>
```

  


```CSS
.element {
    width: 50vh;
    aspect-ratio: 1;
    background: orange;
    transition: background .2s linear;
    
    &:hover {
        background: yellow;
    }
}
```

  


```JavaScript
const element = document.querySelector('.element');

// 创建一个 transitionend 事件
var transitionEndEvent = new TransitionEvent("transitionend", {
    propertyName: "background",   // 过渡的 CSS 属性名称
    elapsedTime: 1.5,           // 已运行时间（单位：秒）
    pseudoElement: "::before"    // 伪元素（如果适用）
});

// 添加事件监听器
element.addEventListener("transitionend", (event) => {
    console.log("Transition ended:", event);
});

// 分发事件
element.dispatchEvent(transitionEndEvent);
```

  


在这个示例中，我们创建了一个 `TransitionEvent` 对象，事件类型（`type`）是 `transitionend` 事件，并通过 `dispatchEvent` 方法分发了该事件。然后，通过添加事件监听器，可以在过渡结束时执行相应的操作。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56b319a4ec184c9490d046f7c2085419~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=626&s=935050&e=gif&f=146&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/ExrqqYv

  


### CSS 关键帧动画：AnimationEvent

  


`AnimationEvent` 是用于表示与 CSS 关键帧动画（`animation`）相关的事件的 JavaScript 对象。它通常用于处理与 CSS 关键帧动画相关的事件，例如 `animationstart`、`animationend` 和 `animationiteration`。

  


以下是 `AnimationEvent` 的一些关键信息：

  


-   构造函数： `AnimationEvent` 可以通过构造函数 `new AnimationEvent(type, options)` 创建对象，其中 `type` 表示事件类型，而 `options` 是一个可选对象，可以包含额外的属性。

-   常见事件类型： 与 CSS 关键帧动画相关的常见事件类型包括：

    -   `animationstart`: 动画开始时触发。
    -   `animationend`: 动画结束时触发。
    -   `animationiteration`: 动画进入下一次迭代时触发。

-   事件属性： `AnimationEvent` 对象包含一些常见的事件属性，例如：

    -   `animationName`: 返回触发事件的动画的名称。
    -   `elapsedTime`: 返回自动画开始以来经过的时间（以秒为单位）。
    -   `pseudoElement`: 返回触发事件的伪元素的名称。
         


以下是一个简单的示例，演示如何使用 `AnimationEvent`：

  


```HTML
<div class="element"></div>
```

  


```CSS
@keyframes ani {
    50% {
        scale: 1.25;
    }
}

.element {
    width: 50vh;
    aspect-ratio: 1;
    background: orange;

    &:hover {
        animation: ani 1s linear both alternate;
    }
}
```

  


```JavaScript
const element = document.querySelector('.element');

// 创建一个 animationend 事件
var animationEndEvent = new AnimationEvent("animationend", {
    animationName: "slideIn",   // 过渡的 CSS 属性名称
    elapsedTime: 2.5,           // 已运行时间（单位：秒）
    pseudoElement: "::before"    // 伪元素（如果适用）
});

// 添加事件监听器
element.addEventListener("animationend", (event) => {
    console.log("Animation ended:", event);
});

// 分发事件
element.dispatchEvent(animationEndEvent);
```

  


在这个示例中，我们创建了一个 `AnimationEvent` 对象，事件类型（`type`）是 `animationend` 事件，并通过 `dispatchEvent` 方法分发了该事件。然后，通过添加事件监听器，可以在关键帧动画（`ani`）结束时执行相应的操作。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18ce8ed6e4df4617bcaa5ecf3b9870ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=566&s=3548339&e=gif&f=350&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/gOqVVay

  


上面所介绍的仅是 CSS 动画中的相关事件的科普介绍，接下来，我们更深入的来了解这些事件，以及它们能帮助我们做些什么。

  


## 深入探讨 CSS 过渡动画事件

  


简单的回忆一下 CSS 过渡动画：

  


```CSS
.element {
    scale: 1;
    transition: scale .2s linear;
    
    &:hover {
        scale: 2;
    }
}
```

  


上面示例所呈现的是一个最为普通的过渡动画。从中不难发现，一个过渡动画它具有三种状态：起始状态、过渡中和结束状态。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63f16c5709314a3bb787c32c5a75d042~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1130&s=499767&e=jpg&b=8e14f9)

  


正如你所见，过渡动画存在三个状态，但并不意味着每一个状态都有相对应的事件。就过渡动画而言，它主要有以下几个事件：

  


-   **`transitionstart`**：CSS 过渡动画开始运行时触发
-   **`transitionend`**：CSS 过渡动画完成时触发
-   **`transitionrun`**：创建 CSS 过渡动画时触发
-   **`transitioncancel`**：CSS 过渡动画被取消时触发

  


我们通过一些简单的案例来向大家解释这四个属性。

  


### transitionstart 事件

  


`transitionstart` 事件是在 CSS 过渡动画实际开始时被触发。请注意这里的“**实际**”一词。如果你对 CSS 过渡动画有所了解的话，你应该知道 CSS 过渡动画和关键帧动画有一个最明显的差异：“CSS 过渡动画必须由相应动作来触发，比如鼠标悬浮时、复选框选中时、类名切换时（由 JavaScript 控制）等；但 CSS 关键帧动画有所不同，文档加载完就可以触发。也就是说，即使你在样式表中创建了一个 CSS 过渡动画，但没有被“实际”触发执行的话，`transitionstart` 事件就永远不会被触发。例如下面这个示例：

  


```HTML
<div class="element">🦧</div>
<div class="alert"></div>
<button class="player">Play</button>
```

  


```CSS
.element {
    scale: 1;
    transition: scale .2s ease-in-out;
    
    &.animated {
        scale: 1.5 1;
    }
}
```

  


```JavaScript
const playHandler = document.querySelector('.play');
const element = document.querySelector('.element');
const alert = document.querySelector('.alert');

// 触发过渡动画开始执行（开始播放）
playHandler.addEventListener('click', () => {
    element.classList.add('animated');
})

// 监听过渡动画的 transitionstart 事件
element.addEventListener('transitionstart', (event) => {
    alert.textContent = 'CSS 过渡动画开始播放:🤾♀️'
    console.log("Transition Start:", event);
})
```

  


虽然我们在 `.element` 上设置了过渡动画，但如果不点击 “Play” 按钮的话，该过渡动画是不会执行的，对应的 `transitionstart` 事件也不会被触发：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f79413788e9446b978c7eb9ed198213~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2850&h=902&s=104085&e=jpg&b=340e37)

  


正如你所看到的，页面加载完之后，`transition` 动画并没有执行。如果这个时候你点击“Play”按钮，`transition` 动画会被触发，`.element` 元素水平方向会放大 `1.5` 倍。此时，过渡动画才是真正（“实际”）执行，相应的 `transitionstart` 事件也就被触发了，并且同时告诉浏览器 `.alert` 内容需要更改：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b38df09e39d497fa6f3954fed0e580b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=470&s=226465&e=gif&f=108&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/qBvWBgP

  


我们都知道，[CSS 过渡动画会因为延迟时间（transition-delay）推迟执行](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)：

  


```CSS
.element {
    scale: 1;
    transition: scale .2s ease-in-out 3s;
    
    &.animated {
        scale: 1.5 1;
    }
}
```

  


上面示例给过渡动画设置了延迟时间为 `3s` （`transition-delay: 3s`），意味着过渡动画从 `scale: 1` 过渡到 `scale: 1.5 1` 要推迟 `3s` 的时间才会执行。也就是说，过渡动画实际执行是 `3s` 之后，这也意味着 `transitionstart` 也要延迟 `3s` 之后才会被触发：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1e7d37550a44869a8eafd47a80e70e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1380&h=562&s=471563&e=gif&f=147&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/QWoLwJd

  


这个示例告诉我们，`transitionstart` 事件会在 CSS 过渡动画（`transition`）实际开始的时候触发，或者说在某个 `transition-delay` 已经结束之后触发。

  


有一个小细节需要注意，当我们显式给 `transition-delay` 设置的值为 `0` 时，必须带上单位 `s` 或 `ms` ，否则会造成过渡动画失效，同时也就会引起 `transitionstart` 不会被触发。也就是说，当过渡动画并没有延迟时间时，请不要显式设置，如果有必要重置 `transition-delay` 的值为 `0` 时，请记得带上单位 `s` 或 `ms` ，否则它会被视为无效。

  


### transitionrun 事件

  


`transitionrun` 事件是创建过渡时被触发，但在任何 `transition-delay` 开始之前触发。它与 `transitionstart` 不同，如果过渡动画应用了延迟 `transition-delay` ，那么 `transitionrun` 事件将在 `transitionstart` 事件之前触发，延迟时间时间结束之后 `transitionstart` 事件才被触发。如果过渡动画没有显式设置延迟时间 `transition-delay` ，那么 `transitionrun` 和 `transitoinstart` 事件同时被触发：

  


```CSS
@layer transition {
    .element {
        scale: 1;
        transition: scale 1s ease-in-out 2s;
    
        &.animated {
            scale: 1.5 1;
        }
    }
}
```

  


```JavaScript
element.addEventListener('transitionrun', (event) => {
    alert.textContent = 'transitionrun 被触发:🤾♀️'
    console.log("Transition Run:", event);
})

element.addEventListener('transitionstart', (event) => {
    alert.textContent = 'transitionstart 被触发:🤾♀️'
    console.log("Transition Start:", event);
})
```

  


过渡动画执行时，在延迟动画之前先触发了 `transitonrun` 事件，等延迟时间结束（`2s`）之后，再触发 `transitionstart` 事件：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/723b99a3fa4a48e08d8947228f8ed6cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=568&s=1513576&e=gif&f=250&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/GReKWva

  


如果 `transition-delay` 显式设置为 `0s` 或 `0ms` （记得带上单位）或者不显式设置（默认为 `0s`），那么过渡动画执行时，`transitionrun` 和 `transitionstart` 事件会同时被触发：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68cfdd4c17094ce4863591e7b97f6998~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1286&h=550&s=1115328&e=gif&f=130&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/ExMYWLE

  


这意味着，过渡动画在没有延迟的情况下运行，可以将 `transitionrun` 和 `transitionstart` 事件视为标记过渡动画实际开始的一种方式。

  


`transitionstart` 和 `transitionrun` 两个事件最大不同的地方是：

  


-   `transitionrun` 在 `transition` 创建的时候被触发，或者说在 `transition-delay` 开始的时候触发
-   `transitionstart` 在 `transition`动画实际开始的时候被触发，或者说在 `transition-delay` 结束的时候触发

  


### transitionend 事件

  


`transitionend` 事件是在 CSS 过渡动画（`transition`）完成时触发，包括在完成过渡动画和在恢复到初始状态时。例如下面这个示例：

  


  


```HTML
<div class="element">🦧</div>
<div class="alert">Hello CSS Transition</div>
<button class="player">Play</button>
<button class="reset">Reset</button>
```

  


```CSS
.element {
    scale: 1;
    transition: scale .2s ease-in-out;
    
    &.animated {
        scale: 1.5 1;
    }
}
```

  


```JavaScript
const playHandler = document.querySelector('.play');
const resetHandler = document.querySelector('.reset')
const element = document.querySelector('.element');
const alert = document.querySelector('.alert');

playHandler.addEventListener('click', () => {
    element.classList.add('animated');
})

resetHandler.addEventListener('click', () => {
    element.classList.remove('animated');
})
```

  


在这个示例中，当你点击“Play”按钮时，会给 `.element` 添加一个新类名 `.animated` ，这个时候会触发 `transition` 过渡动画，元素 `.element` 在水平方向会被放大（`scale: 1` 过渡到 `scale:1.5 1`）。当你点击“Reset”按钮时，将会删除刚才新增的 `.animated` 类名，此时 `.element` 会恢复到初始状态（`scale: 1.5 1` 回到 `scale:1`）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8666b35cd074761a7360eae7e22b01f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=454&s=750001&e=gif&f=165&b=340631)

如果你监听 `transitionend` 事件，你会发现点击“Play”按钮，过渡动画开始执行，待其结束时，`transitionend` 会被触发；再次点击“Reset”按钮时，过渡动画移动，恢复到默认状态时，`transitionend` 也会被触发：

  


```JavaScript
element.addEventListener('transitionend', (event) => {
    alert.textContent = `transitionend 被触发:🤾♀️ (${counter++})`
    console.log("Transition End:", event);
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12ed77f481f74151986a61e745de2abc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1240&h=542&s=941252&e=gif&f=148&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/XWGrMwq

  


如果你觉得上面这个示例不太易于理解 `transitionend` 事件被触发的时间（毕竟点击两次按钮），你可以将过渡动画的触发改为元素的 `:hover` ：

  


```CSS
.element {
    scale: 1;
    transition: scale .2s ease-in-out;
    
    &:hover {
        scale: 1.5 1;
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79bdce292a6d4ea0a7bb6546715b0a7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=514&s=695072&e=gif&f=139&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/ZEPzKbo

  


非常明显，`transitionend` 事件在两个方向上被触发：在过渡到被过渡状态结束时触发，以及在完全恢复到默认或非过渡状态时触发。

  


你可能已经想到了，使用 `transitionend` 事件，我们可以正确捕获过渡动画结束的时机，并在这个时候做一些有趣的事情，比如在过渡动画结束的时候删除类名。请注意，在事件触发后，我们需要删除 `transitionend` 事件侦听器，以便下一次不会重复触发（为此，你需要一个唯一的回调函数）。销毁不必要的事件侦听器总是一个良好的实践！

  


```HTML
<div class="element">🦧</div>
<div class="alert">Click Me ☝️</div>
```

  


```CSS
@layer transition {
    .element {
        scale: 1;
        transition: scale 1s ease-in-out;
    
        &.animated {
            scale: 1.25;
        }
    }
}
```

  


```JavaScript
const element = document.querySelector('.element');
const alert = document.querySelector('.alert');
let counter = 1;

element.addEventListener('click', (e) => {
    element.classList.toggle('animated');
    element.addEventListener('transitionend', transitionEndCallback);
});

transitionEndCallback = (e) => {
    element.removeEventListener('transitionend', transitionEndCallback);
    element.classList.remove('animated');
    alert.textContent = `Transitionend 事件被触发 (${counter}) 🎉 🎈`;
    counter++;
    console.log(e);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8923a02e16248999c6a265f38fa06db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1374&h=598&s=1446434&e=gif&f=179&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/oNVveeP

  


另外，`transitionend` 事件的事件处理程序中发生的情况是不太直观的。前面我们说过，`transitionend` 事件触发是两个方向的，即“在过渡到被过渡状态结束时触发，以及在完全恢复到默认或非过渡状态时触发”。除此之外，它为每个过渡影响的 CSS 属性触发一次。这意味着，如果你的过渡动画是对多个属性过渡处理，那么 `transitionend` 触发的次数就会更多。例如下面这个示例：

  


```CSS
@layer transition {
    .element {
        scale: 1;
        opacity: .5;
        transition: scale 1s ease-in-out, opacity 1s ease-in-out;
    
        &:hover {
            scale: 1.5;
            opacity: 1;
        }
    }
}
```

  


上面示例中，同时对 `scale` 和 `opacity` 两个属性过渡动画处理，当你监听 `transitionend` 事件时，你会发现过渡动画结束时该事件被触发两次，一次用于 `scale` 属性，另一次用于 `opacity` 属性；当过渡动画结束，`scale` 和 `opacity` 恢复到初始状态（过渡动画开前始的状态），会再次触发两次 `transitionend` 事件。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1abea9ad1a934780938a926a3a4bab91~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=546&s=1565594&e=gif&f=213&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/qBvWXMJ

  


正如你所看到的，`transitionend` 事件被触发多次，这也意味着事件处理程序也会被调用多次。很可能，你并不希望 `transitionend` 事件处理程序被调用多次，至少对于相同的过渡和相同的持续时间的情况。虽然你不能阻止事件处理程序被调用多次，但你可以确保事件处理程序内部的代码仅被调用你希望的次数。

  


注意，前面有一个案例，我们通过在 `transitionend` 事件触发后删除 `transitionend` 事件侦听器来避免事件处理程序被调用多次：

  


```JavaScript
const element = document.querySelector(".element");
const alert = document.querySelector(".alert");
let counter = 1;

element.addEventListener("mouseover", (e) => {
    element.addEventListener("transitionend", transitionEndCallback);
});

transitionEndCallback = (e) => {
    element.removeEventListener("transitionend", transitionEndCallback);
    alert.textContent = `Transitionend 事件被触发 (${counter}) 🎉 🎈`;
    counter++;
    console.log(e);
};
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/082e3dbb2fc74a798801d3430b451b8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1362&h=568&s=1723103&e=gif&f=244&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/dyrbzrr

  


除此之外，还可以通过检测事件参数的 `propertyName` 值，该值表示事件所代表的 CSS 属性。例如：

  


```JavaScript
const element = document.querySelector(".element");
const alert = document.querySelector(".alert");
let counter = 1;

const detectTheEnd = (e) => {
    if (e.propertyName == 'opacity') {
        e.target.removeEventListener('transitionend', detectTheEnd);
        alert.textContent = `opacity 过渡结束：${counter}`;
        counter++;
        console.log("Opacity Transition End:", e);
    }
}

element.addEventListener("transitionend", detectTheEnd);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e2d1f5cc3b3426db565dbe062a3c08c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1336&h=554&s=1288556&e=gif&f=228&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/mdobBpE

  


在这个示例中，只有对 `opacity` 属性进行过渡了，`if` 语句才会返回 `true` 值，它对应的代码块才会被执行。这也意味着，它仅在由于 `transitionend` 事件只有不透明度属性（`opacity`）触发过渡动画时，相应的事件处理程序才会被执行。

  


对于影响多个属性的单个过渡，例如：

  


```CSS
@layer transition {
    .element {
        scale: 1;
        opacity: .5;
        transition: scale 1s ease-in-out, opacity 1s ease-in-out;
    
        &:hover {
            scale: 1.5;
            opacity: 1;
        }
    }
}
```

  


在事件处理程序内部，事情相当简单。你不需要对 `scale` 等其他属性进行 `propertyName` 检查。因为 `transitionend` 事件几乎在同时相继被触发，因为 `scale` 和 `opacity` 两个属性过渡都在 `1s` 之后结束。在这种情境之下，将代码分拆并没有太大的意义。

  


反之，过渡动画中有多个属性过渡，并且持续时间不同，那么将代码分拆是有意义的。在这种情况下，你的 `transitionend` 事件将在不同的时间触发，你可能想要根据刚刚完成过渡的 CSS 属性来处理每次事件的触发。例如：

  


```CSS
@layer transition {
    .element {
        scale: 1;
        opacity: .5;
        transition: scale .5s ease-in-out, opacity 1s ease-in-out;
    
        &:hover {
            scale: 1.5;
            opacity: 1;
        }
    }
}
```

  


上面代码中 `scale` 和 `opacity` 两个过渡属性的持续时间是不同的。在这种情况下，`transitionend` 将在 `0.5s` 的时候（`scale` 属性过渡完成时）会被触发一次，并在 `1s` 的时候（`opacity` 属性过渡完成时）会被再次触发。如果你希望对每个 `transitonend` 事件实例做出不同的反应，你可以使用多个 `if` 条件来判断 `propertyName` 的值。

  


```JavaScript
const element = document.querySelector(".element");
const alert = document.querySelector(".alert");

const detectTheEnd = (e) => {
    if (e.propertyName == "opacity") {
        alert.textContent = `opacity 过渡结束：🪼 🎉`;
        console.log("Opacity Transition End:", e);
    } else if (e.propertyName == "scale") {
        alert.textContent = `scale 过渡结束：🐉 🎊`;
        console.log("Scale Transition End:", e);
    }
};

element.addEventListener("transitionend", detectTheEnd);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf55fcda41ec4e53b020b8e1ae66c4e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326&h=578&s=1526319&e=gif&f=194&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/poYzWGx

  


通过有意识地检查 `propertyName`，你确保根据触发的 `transitionend` 事件执行正确的代码。

  


不过，大家需要知道的是，`transitionend` 事件不会总时被触发，下面这几种场景，它是不会被触发的：

  


-   **删除了过渡属性**：如果一个过渡在完成之前被移除，比如移除了 `transition-property` ，那么 `transitionend` 事件将不会被生成
-   **没有过渡延迟或持续时间**：如果过渡动画 `transition` 没有过渡延迟或持续时间，即两者都是 `0s` 或两者都未显式声明，那么就没有过渡，也不会触发任何过渡事件，包括 `transitionend` 事件
-   在正过渡的元素从 DOM 中移除
-   在过渡期间某个时刻，将元素设置为 `display: none`
-   如果触发了 `transitioncancel` 事件，`transitionend` 事件将不会触发

  


这个事件对于执行在过渡结束时需要的任何操作非常有用。例如，你可以在 `transitionend` 事件中执行一些 JavaScript 操作，以便在过渡完成后更新页面状态或触发其他动作。稍后将会向你呈上这方面的具体案例，通过这些具体案例，你可以知道在实际生产中，我们可以用它来做哪些有意义的事情。

  


### transitioncancel 事件

  


`transitioncancel` 事件是 CSS 过渡动画的最后一个事件。当 CSS 过渡动画被取消时触发该事件。通常情况之下，以下情形过渡动画会被取消：

  


-   应用于元素的 `transition-property` 属性的值被更改
-   应用于元素的 `display` 属性被设置为 `none`
-   过渡动画在运行结束之前被叫停，例如用户鼠标移出悬浮过渡元素

  


通常情况之下，如果在 `transitionrun` （`transition-delay` 之前触发）和 `transitionend` （`transition-delay` 之后触发）之间取消了过渡动画，那么 `transitioncancel` 事件将被触发。例如下面这个示例，用户鼠标悬浮在元素 `.element` 上 `1s` （`transition-duration: 1s`）过渡动画才会结束。如果你悬浮在元素 `.element` 上 `.5s` 就将鼠标移出元素，那么这个时候就会触发 `transitioncancel` 事件：

  


```CSS
@layer transition {
    .element {
        scale: 1;
        transition: scale 1s ease-in-out;
    
        &:hover {
            scale: 1.25;
        }
    }
}
```

  


```JavaScript
const element = document.querySelector('.element');
const alert = document.querySelector('.alert');

element.addEventListener('transitioncancel', e => {
    alert.textContent = 'transitioncancel 事件被触发'
    console.log('Transition Cancel:', e);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6922e7532e794c18bd62dbfb6f4bbb70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1348&h=528&s=957680&e=gif&f=158&b=232323)

  


> Demo 地址：https://codepen.io/airen/full/dyrbJeQ

  


需要注意的是，如果取消了过渡，`transitionend` 事件将不会运行。另外，就 `transitioncancel` 事件而言，在不同浏览器之间还存在一定的差异性。在Chrome和Safari中，只能在 `transitionrun` 和 `transitionstart` 之间触发 `transitioncancel`。在Firefox中，它可以在 `transitionend` 运行之前取消。

  


最后，我们通过一个简单的示例来向大家展示 `transitionstart` 、`transitionrun` 、`transitionend` 和 `transitioncancel` 四个过渡动画事件。在向大家演示之前，对于 CSS 过渡动画 `transition` 有一点必须知道，只有显式的设置了 `transition-property` 和 `transition-duration` 两个属性的值，过渡动画才会生效。而要展示 `transitionrun` 和 `transitionstart` 两个事件的差异，必须要显式设置过渡动画的延迟时间 `transition-delay` 。为了使过渡动画这四个事件之间的差异更加明显，我在示例中设置了 `transition-delay` 。

  


```CSS
@layer transition {
    .element {
        scale: 1;
        transition: scale 1s ease-in-out 2s;
    
        &:hover {
            scale: 1.25;
        }
    }
}
```

  


这个过渡动画很简单，我们仅对 `scale` 属性做了过渡处理。当你将鼠标悬浮在元素上时，等待 `2s` （`transition-delay: 2s`）之后，`scale` 属性的值将从 `1` 过渡到 `1.25` ，而且这个过程持续了 `1s` 时间（`transition-duration: 1s`）；当你将鼠标移出元素时，该元素的 `scale` 属性值立即恢复到初始值 `1` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95b6edd59e9d4328a3caf28f14d176de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=488&s=569854&e=gif&f=300&b=340631)

  


现在，分别监听过渡动画的 `transitionrun`、`transitionstart`、`transitionend` 和 `transitioncancel` 的事件，这些事件所处理的事情很简单，就是改变元素 `.alert` 的文本内容，告诉你正在触发过渡动画的哪个事件。从可视化上向你呈现了它们之间的差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3445ddcf75be4c0699ed7392267553ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1344&h=516&s=1724694&e=gif&f=246&b=232323)

  


> Demo 地址：https://codepen.io/airen/full/zYbOpMW

  


通过这个简单的示例，你应该可以看到所有四个事件都在工作以及它们之间的差异！

  


## 深入探讨 CSS 关键帧动画事件

  


探完 CSS 过渡动画相关事件之后，我们再一起来看看 CSS 关键帧动画（`animation`）所对应的事件。当你播放一个 CSS 关键帧动画时，它会触发以下几个事件：

  


-   **`animationstart`**：在动画开始播放时触发
-   **`animationend`**：在动画结束时触发
-   **`animationiteration`** ：在每个动画迭代的开始触发，除了第一次
-   **`animationcancel`**：在动画中断（或者说取消）时触发

  


我们从这些事件的命名就能猜到它们在什么时候会被触发！`animationstart` 事件在动画开始时触发，`animationend` 事件在动画完成时触发，而 `animationiteration` 事件在每个动画迭代（除第一次）时触发，`animationcancel` 事件则在动画中断或取消。

  


例如下面这个很常见的脉搏动画 `pulse` ，元素 `.element` 应用了该动画，该动画循环播放三次：

  


```HTML
<div class="pulse"></div>
<button class="play">Play</button>
<button class="cancel">Cancel</button>
```

  


```CSS
@layer animation {
    @keyframes pulse {
        50% {
            scale: 1.5 1.5 1.5;
        }
    }

    .animated {
        animation: pulse 1s ease-in-out 3 both;
    }
}
```

  


```JavaScript
const playHandler = document.querySelector(".play");
const resetHandler = document.querySelector(".reset");
const pulse = document.querySelector(".pulse");

playHandler.addEventListener("click", () => {
    pulse.classList.add("animated");
});

resetHandler.addEventListener("click", () => {
    pulse.classList.remove("animated");
});
```

  


当你点击“Play”按钮之后，`.pulse` 开始执行 `pulse` 动画，每次持续时间为 `1s` ，并且循环播放三次之后停止。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c9690b9656646b792bfdea253d37a61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1008&h=484&s=897787&e=gif&f=301&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/QWoLQxQ

  


为了更直观地解释这个地方，我们用“时间位置”图来描述它：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3ba0d740fd545ed9f97dae1d7fcd6ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1142&s=587777&e=jpg&b=fefefe)

  


需要注意的是，这几个事件并非都会被触发。

  


-   `animationstart` 事件将在动画开始播放时被触发，它是唯一个始终会被触发的事件
-   `animationiteration` 事件将在动画的第二次迭代开始时才被触发，前提是你的动画设置了多次循环播放 `animation-iteration-count` ，如果你的动画只运行一次（取 `animation-iteration-count` 的默认值 `1`），那么 `animationiteration` 事件永远不会被触发
-   `animationend` 事件只有在动画结束时才会被触发。如果你的动画永远不会结束，例如 `animation-iteration-count` 的值为 `infinite` （无限循环播放），那么动画就不会结束，也就没有 `animationend` 事件可监听
-   `animationcancel` 事件只有动画在播放途中被中断或取消时才会被触发，如果你的动画永远都不会被中断或取消，那么也没有 `animationcancel` 事件可监听

  


接下来，我们来细说一下这几个动画事件。

  


### animationstart 事件

  


我们先从 `animationstart` 事件开始说起。这个事件的工作原理正如其名称所示，它会在动画开始时立即触发。如果你的动画是在文档加载完成（通过文档时间线驱动），那么文档加载完，动画就会开始播放（在没有设置动画延迟的前提下），对应的 `animationstart` 事件就会被触发。例如：

  


```CSS
@layer animation {
    @keyframes pulse {
        50% {
          scale: 1.5 1.5 1.5;
        }
    }

    .pulse {
        animation: pulse 1s ease-in-out infinite both;
    }
}
```

  


```JavaScript
pulse.addEventListener('animationstart', e => {
    alert.textContent = `animationstart 被触发：🎉`;
    console.log('Animation Start:', e)
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae306d15f9ec493c99fc3a5fadabbc59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1284&h=560&s=1803288&e=gif&f=242&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/VwRZgeJ

  


同样的，如果动画不是自动播放，需要人去触发它播放时，那么一旦动画开始播放，`animationstart` 事件就会被触发：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0948d27e3ef14a198107e4d9826b0718~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=570&s=1230059&e=gif&f=188&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/ExMYrgd

  


正如你所看到的，`animationstart` 事件会在 CSS 动画开始时触发。不过，它会受 `animation-delay` 所影响，如果你给动画显式设置了 `animation-delay` 属性的值，将意味着动画会延迟播放，那么 `animationstart` 事件也将会延迟触发，它会在延迟时效过后触发，即延迟时间之后触发。例如，你的动画设置的延迟时间为 `2s` ，这意味着动画要在 `2s` 之后才开始播放，相应的 `animationstart` 事件也需要在 `2s` 之后被触发：

  


```CSS
.animated {
    animation: pulse 1s ease-in-out 2s infinite both;
}
```

  


```JavaScript
pulse.addEventListener('animationstart', e => {
    alert.textContent = `2s 之后 animationstart 被触发：🎉`;
    console.log('Animation Start:', e)
})
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe4d0e6285f748ffa72519dad6dfb4a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=558&s=1701516&e=gif&f=310&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/XWGrOpP

  


[我们在介绍动画延迟时间时说过，动画的延迟时间可以设置为负值](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)。当动画的延迟时间设置为负值时，它不再表示延迟，而是成为一个偏移量。在这种情况下，关键帧动画会立即开始，但会在指定的时间偏移内自动进行，就好像动画在过去的某个时间点开始一样，因此看起来是在活跃的持续时间中间开始的。这个特性允许你更灵活地控制动画的启动时机。同时意味着，动画延迟时间要是设置了负值，动画播放就会触发 `animationstart` 事件：

  


```CSS
.animated {
    animation: pulse 1s ease-in-out -2s infinite both;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/337cb4d1258a45b9b87f25133dfdd36d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1318&h=544&s=1595778&e=gif&f=223&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/abMoXVM

  


负的延迟时间将导致事件在 `elapsedTime` 等于延迟的绝对值时触发。相应地，动画将在序列中的该时间索引处开始播放。这也就是前面所说的，负的延迟时间不再表示延迟，而是成为一个偏移量。

  


注意，`elapsedTime` 是 `AnimationEvent` 对象中的一个只读属性，表示动画在事件触发时已经运行的时间，不包括任何动画被暂停的时间。对于 `animationstart` 事件：

  


-   如果动画延迟时间 `animation-delay` 是一个非负值，那么 `elapsedTime` 的值为 `0`
-   如果动画延迟时间 `animation-delay` 是一个负值，那么 `elapsedTime` 的值为延迟时间的绝对值。此时事件将以 `elapsedTime` 包含 `(-1 * delay)` 的形式触发

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3b9c9d3a97c4451ba0bbf3b298ed293~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2876&h=1326&s=467540&e=jpg&b=fcfcfc)

  


### animationend 事件

  


接下来是 `animationend` 事件，它在动画结束时触发。不过，如果动画在完成之前中止，例如如果元素从 DOM 中删除或动画从元素中移除，以及动画中止播放，比如动画的 `animation-play-state` 属性值为 `paused` ，则 `animationend` 事件不会触发。例如下面这个示例：

  


```CSS
@layer animation {
    @keyframes pulse {
        50% {
            scale: 1.5 1.5 1.5;
        }
    }

    .pulse {
        animation: 
            var(--animn, none)        /* 动画名称 animation-name, 初始值为 none */
            var(--animdur, 2s)        /* 动画持续时间 animation-duration, 初始值为 1s */
            var(--animtf, linear)     /* 动画缓动函数 animation-timing-function, 初始值为 linear */
            var(--animdel, 0s)        /* 动画延迟时间 animation-delay, 初始值为 0s */
            var(--animdir, alternate) /* 动画方向 animation-direction, 初始值为 alternate */
            var(--animic, infinite)   /* 动画播放次数 animation-iteration-count, 初始值为 infinite */
            var(--animfm, none)       /* 动画填充查式 animation-fill-mode，初始值为 none */
            var(--animps, running);   /* 动画播放方式 animation-play-state，初始值为 running */
    
        &.animated {
            --animn: pulse;
            --animic: 1;
            --animfm: both;
            --animdur: 3s;
        }
    }
}
```

  


```JavaScript
const playHandler = document.querySelector(".play");
const resetHandler = document.querySelector(".reset");
const pausedHandler = document.querySelector(".paused");
const pulse = document.querySelector(".pulse");
const alert = document.querySelector(".alert");

// 暂停动画
const pausedAnimations = (aniEl) => {
    aniEl.style.setProperty(`--animps`, "paused");
};

// 恢复动画播放
const playAnimations = (aniEl) => {
    aniEl.classList.add("animated");
    aniEl.style.setProperty(`--animps`, "running");
};

// 重播动画
const restartAnimations = (aniEl, animn) => {
    aniEl.style.setProperty(`--animn`, "none");
    requestAnimationFrame(() => {
        setTimeout(() => {
            aniEl.style.setProperty(`--animn`, `${animn}`);
            aniEl.style.setProperty(`--animps`, "running");
        }, 0);
    });
};

resetHandler.addEventListener("click", () => {
    restartAnimations(pulse, "pulse");
});

pausedHandler.addEventListener("click", () => {
    pausedAnimations(pulse);
    console.log('动画暂停，--animps: paused')；
    pulse.addEventListener("animationend", (e) => {
        alert.textContent = `animationend 被触发：🎉`;
        console.log("Animation End:", e);
    });
});

playHandler.addEventListener("click", () => {
    playAnimations(pulse);
});

pulse.addEventListener("animationstart", (e) => {
    alert.textContent = `animationstart 被触发：🎉`;
    console.log("Animation Start:", e);
});

pulse.addEventListener("animationend", (e) => {
    alert.textContent = `animationend 被触发：🎉`;
    console.log("Animation End:", e);
});
```

  


上面示例我们通过三个不同的按钮来[控制动画的播放、暂停播放和重复播放](https://juejin.cn/book/7288940354408022074/section/7304648624272015372)，同时我们通过监听 `animationstart` 和 `animationend` 事件动画更改 `.alert` 的文本信息，同时在开发者调试工具中打印出相关的信息：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8d4ea8a18c049098ae9d9a4fe41e837~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1364&h=600&s=1081305&e=gif&f=172&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/MWxgLPq

  


正如你所看到的，当你点击“播放”按钮后，`pulse` 动画立即会播放（没有设置动画延迟时间），同时立即触发 `animationstart` 事件，当动画播放结束（`3s` 之后，动画持续时间 `animation-duration` 设置为 `3s`）会立即触发 `animationend` 事件。另外，当动画播放到中途，你点击“暂停”按钮时，动画的 `animation-play-state` 会设置为 `paused` ，动画暂停播放，这个时候并不会触发 `animationend` 事件。

  


上面这个示例，动画只播放一次，即 `--animic:1` ，相当于 `animation-iteration-count` 属性的值为 `1` ，表示动画只播放一次就结束了，不会再次重复播放。换句话说，如果将上面示例的 `--animic` 设置为 `infinite` ，即 `animation-iteration-count` 的值为 `infinite` ，那么动画会无限次循环播放。这意味着动画根本停不下来，除非你中途将 `animation-play-state` 会设置为 `paused` 暂停动画播放。不管与否，在这种情况下，`animationend` 事件就不存在，你永远无法触发 `animationend` 事件：

  


```CSS
.animated {
    --animn: pulse;
    /* --animic: 1; */ 
    --animfm: both;
    --animdur: 1s;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/199c338d14234eabb70c37035b716b3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1350&h=580&s=1553735&e=gif&f=273&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/zYbObgo

  


你可能已经发现了，不管你操作示例中哪个按钮，都不会触发 `animationend` 事件。另外，如果动画中途因 `animation-play-state` 属性设置为 `paused` ，并再次修改为 `running` 时，动画虽然恢复播放，但这个时间点并不会触发 `animationstart` 事件。但你点击“重播”按钮，动画会重新播放，这个时候是会触发 `animaitonstart` 事件的。

  


另外，如果动画的 `animaiton-name` 为 `none` 时，也不会触发 `animationend` 事件，因为一个关键帧动画是否有效，首要条件之一就是 `animation-name` 指定了一个由 `@keyframes` 定义的动画，例如上面示例中的 `pulse` 动画。

  


### animationcancel 事件

  


`animationcancel` 事件在动画被取消或中止时触发。换句话说，任何在不发送 `animtionend` 事件的情况下停止运行的时候都会触发该事件。这可能发生在更改 `animation-name` 以删除动画时，或者在使用 CSS 隐藏动画节点。

  


```JavaScript
pulse.addEventListener("animationcancel", (e) => {
    alert.textContent = `animationcancel 被触发：🎃`;
    console.log("Animation Cancel:", e);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b49e30ed4dd46cbb045f78c4d6c2985~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1354&h=568&s=1806446&e=gif&f=247&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/RwdNaWO

  


### animationiteration 事件

  


`animationiteration`事件在动画的一次迭代结束并另一次开始时触发，通过CSS属性`animation-iteration-count`控制。

  


```JavaScript
let counter = 1;

pulse.addEventListener("animationiteration", (e) => {
    alert.textContent = `animationiteration 被触发：(${counter})🤭`;
    counter++;
    console.log("Animation Iteration:", e);
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b609fc41ef04cbebfa343ecee955804~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1308&h=586&s=1666925&e=gif&f=176&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/LYaENxX

  


此事件不会与`animationend`事件同时发生，因此对于`animation-iteration-count`为`1` 的动画，不会触发该事件。

  


前在已经说过，CSS 关键帧动画事件并非都会被触发，另外，上面我们所展示的都是以文档时间轴为来驱动动画的，在现代 CSS 中还有另一种控制动画的方式，那就是[滚动驱动动画](https://juejin.cn/book/7288940354408022074/section/7307223031717724172)。滚动驱动动画是以滚动进度时间轴和视图进度时间轴进行的，动画播放进度由滚动容器的滚动轴位置来决定，当用户向前滚动容器时，动画向前播放，反之则向后播放。只不过，在滚动驱动动画中，只会触发 `animationstart` 事件，其他滚动事件则不会被触发。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d15ee59d04754123b237cfb5a0771c2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=464&s=884279&e=gif&f=224&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/oNVgxwm

  


## 事件对象

  


不管是过渡动画事件还是关键帧动画事件，它们都携带了一些额外的数据作为它们的事件参数。这些事件参数在我们的事件处理程序中通过巧妙的命名的变量 `e` 中获取，例如下面这个过渡动画，在你可以打印出 `transitionend` 事件所对应的参数：

  


```CSS
@layer transition {
    .element {
        scale: 1;
        opacity: .5;
        transition: scale .5s ease-in-out, opacity 1s ease-in-out;
    
        &:hover {
            scale: 1.5;
            opacity: 1;
        }
    }
}
```

  


```JavaScript
const element = document.querySelector(".element");
const alert = document.querySelector(".alert");

const detectTheEnd = (e) => {
    console.log('transitonend 事件对象：', e);
    
    if (e.propertyName == "opacity") {
        alert.textContent = `opacity 过渡结束：🪼 🎉`;
        console.log("Opacity Transition End:", e);
    } else if (e.propertyName == "scale") {
        alert.textContent = `scale 过渡结束：🐉 🎊`;
        console.log("Scale Transition End:", e);
    }
};

element.addEventListener("transitionend", detectTheEnd);
```

  


`.element` 元素的过渡动画结束之后，在开发者工具中会打印出 `transitonend` 事件参数 `e` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/876dce0df0f341bc9c4a4a7335a33d71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2858&h=1160&s=506526&e=jpg&b=ffffff)

  


作为过渡动画事件参数的两个有趣的属性是：

  


-   `propertyName`： 表示触发过渡的属性名称
-   `elapsedTime`： 显示了从调用相应事件函数到过渡动画实际开始或结束之间经过的总时间（以秒为单位）

  


例如，在过渡结束事件（`transitionend`）中，你可以这样使用事件对象：

  


```JavaScript
element.addEventListener("transitionend", transitionEndCallback, false);

function transitionEndCallback(e) {
    console.log('过渡动画结束属性：', e.propertyName);
    console.log('经过的时间：', e.elapsedTime + '秒');
}
```

  


这样的事件处理程序可以让你根据过渡动画的不同阶段执行相应的操作。

  


> 注意，其他过渡动画事件也有 `propertyName` 和 `elapsedTime` 参数，它们获取的方式都是相似的，只是事件触方式不同。

CSS 关键帧动画事件与过渡动画事件参数获取方式是相似的。在关键帧动事件参数也有两个有趣的属性：

  


-   `animationName`： 表示触发动画的名称
-   `elapsedTime`： 显示了从调用相应事件函数到动画实际开始或结束之间经过的总时间（以秒为单位）

  


以下是一个简单的例子，展示如何使用关键帧动画事件对象：

  


```JavaScript
element.addEventListener("animationend", animationEndCallback, false);

function animationEndCallback(e) {
    console.log('动画结束，动画名称：', e.animationName);
    console.log('经过的时间：', e.elapsedTime'秒');
}
```

  


通过这些事件，你可以更精细地控制动画，根据不同的事件阶段执行相应的操作。

  


> 注意，其他过关键帧动画事件也有 `animationName` 和 `elapsedTime` 参数，它们获取的方式都是相似的，只是事件触方式不同。

  


## 应用案例

  


我曾在《[帧动画与过渡动画：谁更适合你的业务场景](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)》深度的剖析了 CSS 关键动画与过渡动画的差异。相比之下，CSS 过渡动画的局限性比关键帧动画要多得多，最为常见的是，我们无法使用制作一个无限循环播放的过渡动画。那么，借助过渡动画事件，我们也可以实现一个无限播放的过渡动画。

  


除此之外，如果我告诉你，我们可以不使用 `setTimeout` 、`setInterval` 或 `requestAnimationFrame` 来创建一个计时器，你会怎么想？换句话说，我要是说，我们可通过 CSS 动画相关事件切换一些类名来创建计时器，你是不是会感到很神奇。

  


接下来，我们来看看如何通过动画事件来实现这些效果。首先来看无限循环的过渡动画。

  


### 无限循环的过渡动画

  


在 CSS 中使用关键帧动画要创造一个无限循环播放的动画很容易，但要使用 `transition` 创建一个无限循环的过渡动画几乎是不太可能。例如下面这个示例，我在其中展示了一个永远循环播放的过渡。只需要将鼠标悬停到白色框上，就可以看到过渡动画开始播放，前且永远不会停止：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f6d5b28a1a4410eba35c3c0e9e1d2a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=540&s=655052&e=gif&f=98&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/XWGJjxM

  


稍微了解 CSS 过渡动画的同学都知道，虽然鼠标悬停到白色框上会触发过渡动画，表情符从 `A` 状态（开始）会过渡到 `B` 状态（结束），鼠标移出白色框时，它又会从 `B` 状态恢复到 `A` 状态：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a59246acd203413fb10a0f97ed696f9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=420&s=695934&e=gif&f=210&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/eYXmBeV

  


接下来，我们来看看如何通过过渡动画事件是如何创建无限循环的播放。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b6b40c42f7a44bc82dc3767178566dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1130&s=499767&e=jpg&b=8e14f9)

  


正如上图所示，对于一个过渡动画，它总是从 `A` 状态（开始状态）过渡到 `B` 状态（结束状态）。就这个示例来说，表情符的开始状态（`A` 状态）和结束状态（`B`）如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7465377472c742c89e77d11635d575b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1820&h=708&s=276160&e=jpg&b=340e37)

  


假设你有一个像下面这样的 HTML 结构：

  


```HTML
<div class="container">
    <div id="emoji" class="state--start">🎉</div>
</div>
```

  


分别把表情符 `#emoji` 元素的初始状态和结束状态用两个类名来描述，初始状态的类名为 `.state--start` ，结束状态的类名为 `.state-end` ，它们对应着表情符过渡动画的两个状态：

  


```CSS
.state--start {
    --h: 190;
    opacity: 1;
    scale: 1;
}

.state--end {
    --h: -45;
    opacity: 0.5;
    scale: 2;
}
```

  


注意，示例中的 `--h` 是 CSS `@property` 定义的一个自定义属性。

  


到目前为止，看上去并不复杂，对吧。表情符现在从开始状态（`.state--start`）过渡到结束状态（`.state--end`），实际上是元素 `#emoji` 的类名在切换。因为，我定义了一个过渡，因此表示符从开始状态到结束状态有一个平滑的过渡效果，而不是瞬间的改变：

  


```CSS
#emoji {
    transition: 
        --h .28s ease-in-out,
        scale 0.2s ease-in-out, 
        opacity 0.2s ease-in-out;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cc953ec8e6d434283bb2e8df9f5f7f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1820&h=708&s=296330&e=jpg&b=340e37)

  


记住，`#emoji` 元素的 `.state--start` 和 `.state--end` 的类名是如何进行切换，并无关紧要，因为我们有很多种方式可以实现，例如可以通过使用一些 JavaScript 直接在 `#emoji` 元素上切换类名。无论你如何触发属性更改，只要你定义了一个过渡（`transition`），它监听的属性发生变化，比如示例中的 `opacity` 、`scale` 等，过渡就会开始运行。

  


到目前为止，你所看到的过渡依旧还不是循环播放的过渡。而我们希望的循环过渡效果如下图所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7bab28d7fc946afabd315b81ed33563~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1820&h=708&s=312026&e=jpg&b=340e37)

  


当 `.state-start` 过渡到 `.state--end` 时 ，希望它（`.state--end`）过渡到回 `.state--start` 。在到达 `.state--start` 之后，希望它再次过渡到 `.state--end` 。依此方式不断循环。

  


就 CSS 过渡 `transition` 而言，我们要实现这样的过渡效果是不可能的，因为它（`transition`）并没有一个像 CSS 关键帧动画 `animation-iteration-count` 属性，来指定循环播放的次数。因此，我们不得不借助 JavaScript 方面的能力，比如我们今天所学到的过渡动画属性。

  


也就是说，我们可以通过过渡事件来监听过渡动画的状态，例如，使用 `transitionend` 事件来监听过渡动画是否完成。就我们这个示例而言，当 `.state--start` 的过渡结束时，就会触发 `transitionend` 事件，就在该事件（`transitionend`）触发时，我们可以将 `#emoji` 元素的类名更改为 `.state--end` 。同样的，当 `.state--end` 的过渡结束时，也会触发 `transitionend` 事件，在此时将 `#emoji` 元素的类名又更改变 `.state--start` 。我们只需要按照这种方式，不断的更换 `#emoji` 元素的类名：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8f8c567d8854747b1aa12daee7e0052~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1820&h=708&s=463870&e=jpg&b=340e37)

  


具体代码如下：

  


```JavaScript
const container = document.querySelector('.container');
const emoji = document.querySelector('#emoji');

const setup = (e) => {
    container.addEventListener('mouseover', setInitialClass, false);
    emoji.addEventListener("transitionend", loopTransition, false);
}
 
const setInitialClass = (e) => {
    emoji.className = 'state--end'
}

const loopTransition = (e) => {
    console.log(e)
    if (e.propertyName == 'opacity') {
        if (emoji.className == 'state--end') {
            emoji.className = 'state--start';
        } else {
            emoji.className = 'state--end';
        }
    }
}

setup();
 
```

  


简单解释一下上面的代码。首先给 `.container` 元素添加一个 `mouseover` 事件，这个事件做了一件事情，那就是将 `#emoji` 元素的类名从 `.state--start` 切换为 `.state--end` 。也就是 `setInitialClass()` 函数做的事情。

  


另外再创建了一个 `loopTransition` 函数，每次调用 `loopTransition` 函数时，它都会检查 `#emoji` 元素上设置了什么类名。如果它的类名是 `.state--end` ，那么它就会将类名设置为 `.state--start` ，以再次触发我们的过渡，即可完成 `.state--end` 到 `.state--start` 的过渡。反之，在调用 `loopTransition` 函数时，要是 `#emoji` 元素的类名是 `.state--start` 的话，那么它会将该元素的类名重置为 `.state--end` ，以再次触发 `.state--start` 到 `.state--end` 的过渡。

同时，我们会监听 `#emoji` 元素的 `transitionend` 事件，该事件触发时，就会调用创建好的 `loopTransition` 函数，从而实现了一个无限循环过渡的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660f4f1d9dfe4e1faf095b646748a4cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=540&s=655052&e=gif&f=98&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/XWGJjxM

  


### 时间计时器

  


通常情况之下，一说到计时器，大家首先会想到的是 JavaScript 的 `setTimeout`、`setInterval` 或 `requestAnimationFrame` 的计时器。但我要是说，我们可以通过切换元素的类名来创建一个计时器，你是不是会觉得有点神奇。随着你往后面阅读，你会发现，原来并没有想象的那么神奇，也没有你想象的那么复杂。

  


通过切换元素类名来创建一个计时器，它的原理很简单。简单地说，它通过监听动画事件来切换元素类名，这是因为一个 CSS 关键帧动画有点类似于一个计时器。它们有 `animationstart` 和 `animationend` 事件，还有暂停的能力。除此之外，还有无限循环的能力。

  


既然是通过切换元素类名来创建一个计时器，那么就有必要定义一些类。是的，为了创建一个计时器，我们需要四个不同的 CSS 类名：

  


-   **初始状态**：`.timer` 初始样式
-   **运行状态**：`.timer--running` 启动动画
-   **暂停状态**：`.timer--paused` 暂停动画，它只能与 `.timer--running` 结合使用
-   **结束状态**：`.timer--done` 动画的最终状态

  


假设你有一个 `.timer` 元素：

  


```HTML
<div class="timer">Timer</div>
```

  


并在这个元素应用了一个简单的关键帧动画：

  


```CSS
@keyframes progress {
    from {
        scale: 0 1;
    }
    to {
        scale: 1 1;
    }
}

.timer {
    animation-duration: 3000ms;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    transform-origin: center left;
    scale:0 1;
}
```

  


上面的代码中，我们给 `.timer` 设置了动画持续时间为 `3000ms` （即 `3s`），而且缓动函数是 `linear` ，表示物体以恒速的方式运行。

  


到目前为止，`.timer` 并不会有任何动画效果，因为我们没有显式设置 `animation-name` 。你可以把这个想象成是一个初始状态，动画还没有启动。

  


我们将通过添加 `.timer--running` 类来启动计时器。在重新启动它的情况下，我们还需要从 `.timer` 上移除 `.timer--done` 类。我们在上面的代码基础上，添加一个按钮，然后给这个按钮绑定一个 `click` 事件，再使用 JavaScript 来给 `.timer` 添加类名 `.timer--running` ，同时移除 `.timer--done` 类名：

  


```JavaScript
const timer = document.querySelector(".timer");
const toggle = document.querySelector(".timer--toggle");

const classNames = {
    RUNNING: "timer--running",
    PAUSED: "timer--paused",
    DONE: "timer--done"
};

toggle.addEventListener("click", () => {
    timer.classList.add(classNames.RUNNING);
    timer.classList.remove(classNames.DONE);
});
```

  


这个时候，当你点击 `.timer--toggle` 按钮时，`.timer` 会新增一个 `.timer--running` 类名：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f9e51994ee34fc8813a797832935f34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=552&s=887854&e=gif&f=204&b=330630)

  


仅这样还不够，还需要在 CSS 中给 `.timer--running` 设置 `animation-name` 属性的值，指定一个由 `@keyframes` 定义的动画名称，比如示例中的 `progress` ：

  


```CSS
.timer--running {
    animation-name: progress;
} 
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e755265b83ff429396ed1cb5ad784e84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1258&h=586&s=526978&e=gif&f=120&b=330630)

  


要暂停它，需要在 `.timer` 上添加 `.timer--paused` 类。通过移除类来恢复它。这个事件同样在 `.timer--toggle` 按钮上进行：

  


```JavaScript
toggle.addEventListener("click", () => {
    if (timer.classList.contains(classNames.RUNNING)) {
        // 已处于运行状态，请切换暂停类
        timer.classList.toggle(classNames.PAUSED);
    } else {
        // 开启计时器
        timer.classList.add(classNames.RUNNING);
        timer.classList.remove(classNames.DONE);
    }
});
```

  


同时，在 CSS 中给 `.timer--paused` 添加以下样式：

  


```CSS
.timer--paused {
    animation-play-state: paused;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c7c54483ce14289b0c5b03dc36430af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1222&h=532&s=975375&e=gif&f=181&b=32062f)

  


我们还需要监听 `.timer` 的 `animationend` 事件，一旦触发了该事件，我们就知道动画已经完成，所以需要给 `.timer` 添加 `.timer--done` 类，并同时移除 `.timer--running` 类：

  


```JavaScript
timer.addEventListener("animationend", (e) => {
    timer.classList.add(classNames.DONE);
    timer.classList.remove(classNames.RUNNING);
});
```

  


并在 `.timer--done` 中设置动画结束状态时样式：

  


```CSS
.timer--done {
    scale: 1;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/583f43d7646c4a41b5ea31b16174923f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1240&h=550&s=698072&e=gif&f=135&b=330630)

  


在上面的基础上，我们在监听动画结束的时候，在页面上打印出动画结束的时间：

  


```JavaScript
const log = document.querySelector(".log");

timer.addEventListener("animationend", (e) => {
    timer.classList.add(classNames.DONE);
    timer.classList.remove(classNames.RUNNING);

    log.innerHTML += `🎉动画结束(Timer Finished): ${new Date().toLocaleTimeString()}<br/>`;
});
```

  


最终代码如下：

  


```HTML
<div class="progress">
    <div class="timer"></div>
</div>
<div class="log"></div>
<button class="timer--toggle">Start / Stop</button>
```

  


```CSS
@layer animation {
    @keyframes progress {
        from {
            scale: 0 1;
        }
        to {
            scale: 1 1;
        }
    }

    .timer {
        animation-duration: 3000ms;
        animation-iteration-count: 1;
        animation-timing-function: linear;
        transform-origin: center left;
        scale: 0 1;
    }
    
    .timer--running {
        animation-name: progress;
    }
    
    .timer--paused {
        animation-play-state: paused;
    }
    
    .timer--done {
        scale: 1;
    }
}
```

  


```JavaScript
const timer = document.querySelector(".timer");
const toggle = document.querySelector(".timer--toggle");
const log = document.querySelector(".log");

const classNames = {
    RUNNING: "timer--running",
    PAUSED: "timer--paused",
    DONE: "timer--done"
};

toggle.addEventListener("click", () => {
    if (timer.classList.contains(classNames.RUNNING)) {
        // 已处于运行状态，请切换暂停类
        timer.classList.toggle(classNames.PAUSED);
    } else {
        // 开启计时器
        timer.classList.add(classNames.RUNNING);
        timer.classList.remove(classNames.DONE);
    }
});

timer.addEventListener("animationend", (e) => {
    timer.classList.add(classNames.DONE);
    timer.classList.remove(classNames.RUNNING);

    log.innerHTML += `🎉动画结束(Timer Finished): ${new Date().toLocaleTimeString()}<br/>`;
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/093fc826cbbc458fbe464eb53e2438b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=620&s=798815&e=gif&f=572&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/NWJPaWq

  


上面这个示例（计时器）的工作方式有点类似于 JavaScript 的 `setTimeout`，但它带有自己的动画循环，并且有一种简单的方法来暂停它。

  


我们可以基于上面的示例基础上，将监听的 `animationend` 事件换成 `animationiteration` ，并把动画设置为无限次循环播放：

  


```CSS
.timer {
    animation-iteration-count: infinite;
}
```

  


```JavaScript
let count = 0;
timer.addEventListener("animationiteration", () => {
    count++;
    log.innerHTML += `🎉Timer iteration ${count}: ${new Date().toLocaleTimeString()}<br/>`;
});
```

  


我们就可以获得类似于 JavaScript 的 `setInterval` 的行为：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2087784f81234f3d87802455a29a6081~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=590&s=995822&e=gif&f=467&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/gOEbGRO

  


我们还可以将多个计时器链接在一起。当一个计时器结束时，可以触发下一个计时器：

  


```HTML
<div class="timers">
    <div class="progress">
        <div class="timer"></div>
    </div>
    <!-- 省略其他 progress -->
</div>

<div class="log"></div>
<button class="timer--toggle">Start / Stop</button>
```

  


```CSS
@layer animation {
    @keyframes progress {
        from {
            scale: 0 1;
        }
        to {
            scale: 1 1;
        }
    }

    .timer {
        animation-duration: 1000ms;
        animation-iteration-count: 1;
        animation-timing-function: linear;
        transform-origin: center left;
        scale: 0 1;
    }
    
    .timer--running {
        animation-name: progress;
    }
    
    .timer--paused {
        animation-play-state: paused;
    }
    
    .timer--done {
        scale: 1;
    }
}
```

  


```JavaScript
const classNames = {
    RUNNING: "timer--running",
    PAUSED: "timer--paused",
    DONE: "timer--done"
};

const timers = [...document.querySelectorAll(".timer")];
const toggle = document.querySelector(".timer--toggle");
const log = document.querySelector(".log");

let activeIndex = 0;

const playPause = () => {
    const timer = timers[activeIndex];

    if (timer.classList.contains(classNames.RUNNING)) {
        // 已处于运行状态，请切换暂停类
        timer.classList.toggle(classNames.PAUSED);
    } else {
        // 计时器开始
        timer.classList.add(classNames.RUNNING);
        timer.classList.remove(classNames.DONE);
    
        // 确保将下次计时器设置为初始状态
        timers.slice(activeIndex + 1).forEach((sibling) => {
            sibling.classList.remove(classNames.DONE);
        });
    }
};

toggle.addEventListener("click", playPause);

timers.forEach((timer) => {
    timer.addEventListener("animationend", () => {
        const current = timers[activeIndex];
        current.classList.add(classNames.DONE);
        current.classList.remove(classNames.RUNNING);
    
        log.innerHTML += `🎉 Timer ${
          activeIndex + 1
        } Finished(动画结束): ${new Date().toLocaleTimeString()}<br/>`;
    
        if (activeIndex < timers.length - 1) {
            activeIndex++;
            playPause();
        } else {
            // 重置
            activeIndex = 0;
        }
    });
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61d40f2f6cef4ac4a9eb51292e63d130~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1312&h=684&s=1789593&e=gif&f=367&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/XWGJzKO

  


上面的示例看起来像是一个自动播放轮播图的分页指示器，对吧。你可能已经猜到了，我们可以使用类似的方式来制作一个自动播放轮播图的效果。在制作这个效果过程中，我们需要确保分页中的所有先前的计时器都设置为最终状态，而下一个计时器则设置为初始状态。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e46a307731ce4918b769fb63a1c8fc3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1284&h=512&s=1260141&e=gif&f=295&b=69aefe)

  


> Demo 地址：https://codepen.io/airen/full/BabymZw （来源于 [@Stanko](https://codepen.io/stanko/full/dyQrOeB) ）

  


上面向大家演示的是，如何通过监听动画事件来切换元素的类名，从而达到类似于JavaScript 的 `setTimeout`、`setInterval` 或 `requestAnimationFrame` 等 API 构建的计时器。虽然在形式上看上去非常相似，但使用这种方案制作的计时器，有一个明显的缺陷，那就是**无法精确追踪计时器的进度**。如果需要追踪计时器进度，还是要使用像 Web Animations API 来进行跟踪。这个 API 允许我们在 JavaScript 中创建和控制动画，它具有用于跟踪动画进度的 `currentTime` 属性。前关于这方面的，你们将在小册后面的课程中会有详细介绍。

  


另外，在此需要强调的是，CSS 动画并不是为这种情况（构建计时器）而设计的，但这里所介绍的可以当作一个小技巧，对于某些问题，它们提供了一个非常优雅的解决方案。其次，就是想通过这个示例，向大家展示我们可以使用动画事件来做哪些事情？

  


除此之外，我们还可以利用相似的技术来实现 F.L.I.P 动画效果，例如 [@Taha Shashtari 提供的这个案例](https://codepen.io/tahazsh/full/MWPMEyB)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a0202ed6cd5480baaf04783e54eb86f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=702&s=13133664&e=gif&f=197&b=1f1f1f)

  


> Demo 地址：https://codepen.io/tahazsh/full/MWPMEyB （来源于 [@Taha Shashtari](https://codepen.io/tahazsh/full/MWPMEyB) ）

  


## 小结

  


CSS 过渡动画和关键帧动画的事件是在 Web 开发中实现交互和动态效果的关键部分。其中 CSS过渡动画提供了在元素属性变化时平滑过渡的能力，相对应的事件包括 `transitionstart` 、`transitionend` 和 `transitioncancel` ；CSS关键帧动画提供了更灵活的控制，可以定义关键帧和多个状态，其相关事件包括 `animationstart` 、`animationiteration` 、`animationend` 和 `animationcancel` 。

  


理解这些事件的时机和触发条件对于实现流畅、优雅的用户体验至关重要。在设计动画时，考虑动画的开始、结束以及可能的取消场景，以确保用户界面的一致性和可预测性。总体而言，了解和利用这些JavaScript事件可以让我们更好地管理和交互动画，为用户提供更丰富的体验。