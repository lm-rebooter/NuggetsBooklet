![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c84d81503d0435fb95f48a92d573aff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4096&h=2016&s=397264&e=png&b=ffffff)



在这个数字化的时代，Web 已经不再仅限于简单的文字和图片，而是成为了一个充满生机、充满互动的多媒体舞台。在这个舞台上，SVG 和 Canvas 好比两位主演，各自以独特的方式引领着一场在浏览器上绘制、动画化并交互复杂图形的革命。它们各有优势，但也存在明显的区别。

SVG，以矢量之名，保证了图像在任何尺寸下都能保持清晰，并具有无限的缩放潜力。因此，它通常用于创建可伸缩的矢量图形。而 Canvas 则擅长快速绘制大量动态图像，尤其是在游戏开发、实时图表和复杂的图形处理中展现着无与伦比的实力。Canvas 的魔力在于它的灵活性与性能，让开发者能够直接操作每一个像素点，创造出身临其境的视觉体验。


因此，在选择 SVG 和 Canvas 之间时，考虑图形的复杂性是至关重要的。对于简单的图形，如形状和标志，SVG 是最有效的选择。此外，在多个分辨率下保持可伸缩性的情况下，SVG 在性能和可伸缩性方面是最佳选择。另一方面，对于动态和交互式图形，Canvas 是最好的选择。这包括创建动画、显示视频和开发交互式游戏。Canvas 在处理复杂图形或大量对象时也更有效率。SVG 更适合简单的图形，而 Canvas 更适合复杂、动态和交互式的图形。

  


简而言之，在 Web 开发过程中，为了决定哪种（SVG 和 Canvas）最适合你的需求，我们需要看一下 SVG 和 Canvas 的各自优势与劣势，以及它们如何影响最终的结果。

在这节课中，我将带你深入了解 SVG 与 Canvas 之间的差异，并为你提供选择适合项目需求的最佳技术的指导。

  


## SVG 和 Canvas 是什么？


SVG 和 Canvas 是在 Web 页面上创建和显示图形最常用的两种技术。它们都是用于打造引人入胜的 Web 体验的重要工具。

然而，选择使用哪种技术来创建图形，往往是一个需要仔细权衡的过程。如果你不清楚每种技术的优点和缺点，可能会陷入两难境地。这是可以理解的，因为你最不想要的情况就是选择了一种特定的技术，后来因为各种原因意识到应该选择另一种选项。


因此，了解 SVG 和 Canvas 的区别至关重要。只有掌握了这两种技术的特点和适用场景，才能在项目中做出明智的决策。为了帮助大家更好地理解，我们首先需要明确 SVG 和 Canvas 各自的定义和作用。

  


### SVG 是什么？

在《[初级篇：SVG 简介](https://juejin.cn/book/7341630791099383835/section/7342031804691382298)》中，我已经详细介绍了什么是 SVG，这里我们快速回顾一下。

[根据 W3C 的定义](https://www.w3.org/TR/SVG2/intro.html#AboutSVG)：


> SVG 是一种使用 XML 描述二维图形的语言。它可以作为独立格式使用，也可以与其他 XML 或 HTML5 混合使用。在与 HTML5 混合时，它采用 HTML5 语法。


简单来说，SVG 是一种基于 XML 标准的二维矢量图像格式，代表“可缩放矢量图形”。它使用一系列标准来声明性地定义图像属性，例如形状元素、填充颜色、描边颜色等。以下是一个基本示例：

  


```XML
<svg viewbox="0 0 200 200">
    <rect x="10" y="10" width="100" height="100" fill="#c00"  />  
</svg>
```

  


上面的代码使用 SVG 的 `<rect>` 元素绘制了一个 `100 x 100` 的红色矩形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/773ff7468b044352b87a4ce272ea7dce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=952&s=141744&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/wvbMxLv

  


SVG 图像可以通过在 HTML 文档中添加 `<svg>` 元素来内联创建，也可以在单独的文件（带有 `.svg` 扩展名）中定义，并在 HTML 或 CSS 中引用：

  


```HTML
<img src="example.svg" alt="example" />
```

  


```CSS
.element {
    background-image: url(example.svg);
}
```

  


此外，JavaScript 可以用于创建带有交互性的 SVG 图形，CSS 可以用于设置 SVG 图形的样式。

  


SVG 经常用于 Web 设计和开发，特别适合创建和管理矢量图形，如徽标、图表和图标。与传统的栅格图像（如 JPEG、PNG 和 GIF）相比，SVG 图像可以在不损失质量的情况下进行缩放，使其成为在不同分辨率的网站和设备上显示图像的更好选择。

  


### Canvas 是什么？

Canvas 是 HTML5 的一个特性，[WHATWG 规范](https://html.spec.whatwg.org/multipage/scripting.html#the-canvas-element)是这样定义它的：


> `<canvas>` 元素提供了一个分辨率相关的位图画布，可以用于实时渲染图表、游戏图形、艺术品或其他视觉图像。

  


换句话说，`<canvas>` 元素提供了一个画布，你可以使用 JavaScript API 逐像素创建和操作光栅化图像。例如：


```HTML
<canvas id="myCanvas" width="200" height="200"></canvas>
```

  


```JavaScript
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
context.fillStyle = '#c00';
context.fillRect(10, 10, 100, 100);
```

  


上面的代码使用 [HTML5 Canvas API](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element) 绘制了一个红色的正方形，类似于之前使用 SVG 创建的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee622248c1e14a1eac70f5b0e00278d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=952&s=141744&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/OJYMoNP

  


绘制简单的形状只是 Canvas 能力的冰山一角。HTML5 Canvas API 还允许你绘制弧线、路径、文本、渐变等。你可以逐像素地操作图像，甚至可以在画布上绘制视频并改变其外观。这意味着你可以在特定区域替换颜色，为绘图添加动画，或实现其他复杂的视觉效果。


与 SVG 不同的是，Canvas 不依赖于 DOM，因此能够高效地处理数千个对象。而 SVG 在管理大量对象状态时可能会变慢。这使得 Canvas 非常适合制作复杂的可视化效果和动画，如数据可视化。


此外，Canvas 是一种基于位图的方法，因此在放大时可能会出现像素化。它为动态显示图形提供了一个分辨率相关的位图画布，用于显示图形、游戏图形和其他视觉效果。使用 JavaScript 可以直接在网站上绘制图形。`<canvas>` 元素实际上只是图形的一个容器。


总结来说，Canvas 是在像素级别操作的，通过操作像素来绘制图形。一旦在 Canvas 画布上绘制了一个形状，系统就会“忘记”它的位置。如果需要改变形状的位置，整个场景需要重新绘制，包括可能改变位置的任何对象。

  


## 使用 SVG 和 Canvas 的限制

SVG 和 Canvas 是创建交互式图形的强大工具，在 Web 开发中各有其独特的优势和应用场景，但它们也存在一些限制。因此，在决定使用哪种工具时，需要考虑这些限制。

  


SVG 在处理复杂形状和交互时存在一些限制，因为它是基于 DOM 的，每个图形元素都是一个独立的 DOM 节点。对于非常复杂的图形（如详细的地图或高分辨率的插图），SVG 文件可能会变得非常大，导致加载时间过长且渲染效率低下。因此，SVG 不适合处理大量数据，也不适合创建涉及大量元素频繁变化的动画。

  


Canvas 则有所不同，它不依赖 DOM 来渲染图像，更适合复杂形状和动画，渲染速度比 SVG 快。然而，在处理图形时，Canvas 的某些方面不如 SVG 有效。具体来说，Canvas 缺乏 SVG 的一些优点，如可编辑性、样式化图形、事件处理、可访问性和 SEO 等（这些将在稍后详细介绍）。

  


总之，选择使用 SVG 还是 Canvas 取决于具体的项目需求和图形的复杂性。理解这两者的限制，可以帮助开发者在项目中做出更明智的选择。

  


-   **选择 SVG**：如果你的应用需要高质量的矢量图形、复杂的交互和动画，并且图形数量相对较少，SVG 是最佳选择。
-   **选择 Canvas**：如果你需要处理大量的图形元素、实现复杂的动画和实时数据渲染，Canvas 将更适合。



在实际开发中，有时也可以将两者结合使用，以充分发挥它们各自的优势。



## 比较：SVG vs. Canvas


前面我们多次提到，在 Web 开发过程中，选择使用 SVG 还是 Canvas 来创建交互式图形，需要了解它们各自的优势和局限。在这一部分，我们将深入比较 SVG 和 Canvas，将为你提供更详尽的信息。我们将从多个方面、多个角度对 SVG 和 Canvas 进行比较，例如 API 、模式、可伸缩性、互动性、性能、可访问性、测试、调试和学习曲线度等，帮助你在选择技术方案时拥有更多的参考依据和指导价值。

  


### API 的差异

  


由于 Canvas 是比 SVG 更低级别的 API，因此它在灵活性方面比 SVG 更具优势，但代价是更复杂。在 Canvas 上可以绘制的内容仅受到 Web 开发者意愿的限制。也就是说，只要 Web 开发者愿意，就可以使用 Canvas API 绘制任何 SVG 图形。

  


相反，由于 SVG 比 Canvas 更高级，它可以创建复杂的图形，而且 Web 开发者不需要编写复杂的代码。例如，下面这个示例，Web 开发者只需要使用几行简单的代码，就可以给图形添加光照效果：

  


```XML
<svg class="filter">
    <defs>
        <filter id="light">
            <!-- 将源图像模糊处理，以使凹凸贴图不那么锐利 -->
            <feGaussianBlur stdDeviation="3" result="blurred" />
          
            <!-- 根据Alpha通道创建凹凸贴图 -->
            <feColorMatrix in="blurred" type="luminanceToAlpha" result="bumpMap" />
          
            <!-- 使用凹凸贴图进行光照滤镜处理 -->
            <feDiffuseLighting in="bumpMap" surfaceScale="3" result="light">
                <fePointLight x="225" y="150" z="30"></fePointLight>
            </feDiffuseLighting>
            
            <!-- 将光照结果与源图像通过乘法进行合成 -->
            <feComposite in="light" in2="SourceGraphic" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
        </filter>
        <pattern id="pattern1" width="450" height="300" patternUnits="userSpaceOnUse">
          <image xlink:href="https://res.cloudinary.com/alvov/image/upload/v1484667915/codepen-lighting-experiment_jxj0pq.jpg" width="450" height="300" />
        </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#pattern1)" filter="url(#light)" />
</svg>
```

  


简单地解释一下上面的示例代码：

  


-   `<feGaussianBlur>`：对源图像进行高斯模糊处理，模糊程度由 `stdDeviation` 参数决定，这里设置为 `3`。结果保存在 `blurred` 中。
-   `<feColorMatrix>`：将模糊后的图像转换为灰度图（亮度通道转换为 Alpha 通道），结果保存在 `bumpMap` 中。
-   `<feDiffuseLighting>`：基于 `bumpMap` 创建光照效果，`surfaceScale` 决定表面高度的变化，`fePointLight` 定义了光源的位置（`x=225`, `y=150`, `z=30`）。
-   `<feComposite>`：将光照效果与源图像进行合成，`operator="arithmetic"` 和 `k1="1" k2="0" k3="0" k4="0"` 定义了合成的算法，这里只是直接使用光照结果。
-   `<pattern>`：定义一个模式，ID 为 `"pattern1"`，宽度为 `450`，高度为 `300`。
-   `<image>`：在模式内嵌入一张图片，图片的链接为指定的 URL，宽度和高度同样设置为 `450` 和 `300`。
-   `<rect>`：绘制一个矩形，宽度和高度设置为 `100%`（填满整个 `<svg>` 容器），并使用之前定义的图像模式填充矩形（`fill="url(#pattern1)"`），然将之前定义的光照滤镜（`filter="url(#light)"`）应用于该矩形。

  


即，使用 SVG 绘制了一个矩形，并使用了图像模式和光照滤镜为其添加了光照效果。结果就创建了一个带有光照效果的图像。

  


接着，使用几行简单的 JavaScript 代码，动态改变光源位置：

  


```JavaScript
const svgEle = document.querySelector('.filter');
const fePointLightNode = svgEle.querySelector('fePointLight');

const handleMove = (etv) => {
    fePointLightNode.setAttribute('x', event.clientX);
    fePointLightNode.setAttribute('y', event.clientY);
}

svgEle.addEventListener('mousemove', handleMove);
svgEle.addEventListener('touchmove', handleMove);
```

  


你将看到的效果如下：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c71c2a2e28c3408484e8b3a9dbbb9e27~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=446&s=8875229&e=gif&f=56&b=181616)


> Demo 地址：https://codepen.io/airen/full/WNBrVaj （来源于 [@Artem Lvov](https://codepen.io/alvov/full/vgLevP)）



然而要使用 Canvas 实现同样的效果，则要复杂得多。


然而，由于 Canvas 提供了更多的灵活性，不是每个可以在 Canvas 上绘制的图像都可以使用 SVG 来实现（除非使用成千上万个微小的 SVG `<rect>` 元素来作为“像素”）。

例如，下面这个带有噪音的渐变效果： 


```HTML
<canvas></canvas>
```

  


```JavaScript
const canvas = document.querySelector("canvas");

const mix = (channel1, channel2, proportion, variability) => {
    const scaledVariability = variability * 0xff;
    return (
        channel1 * (1 - proportion) +
        channel2 * proportion -
        scaledVariability / 2 +
        scaledVariability * Math.random()
    );
};

const draw = (etv) => {
    const ctx = canvas.getContext("2d");

    const color1 = {
        r: 0xaa,
        g: 0x44,
        b: 0x65
    };
    
    const color2 = {
        r: 0x86,
        g: 0x16,
        b: 0x57
    };
    
    const variability = 0.32;
  
    for (x = 0; x < canvas.width; x++) {
        for (y = 0; y < canvas.height; y++) {
            const proportion = x / (canvas.width - 1) + y / (canvas.height - 1) / 2;
            const color = {
                r: mix(color1.r, color2.r, proportion, variability),
                g: mix(color1.g, color2.g, proportion, variability),
                b: mix(color1.b, color2.b, proportion, variability),
                a: (0.9 + Math.random() / 10).toFixed(2)
            };
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
};

draw();
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48bd9fa8407847cfbdae7c2bd73b5add~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=885&s=1295623&e=jpg&b=801853)

  


> Demo 地址：https://codepen.io/airen/full/WNBwewd

  


虽然说，使用 SVG 滤镜可以实现一些相似的噪音渐变效果，但要实现类似上面示例的效果，是相当的困难。


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7263ea19d93a475388b95263087c5e1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=990&s=1450239&e=png&b=64a9e6)

  


上图是借助 [gggrain 工具](https://www.fffuel.co/gggrain/)，使用 SVG 实现的一个噪音渐变效果：


```XML
<svg width="700" height="700">
    <defs>
        <linearGradient id="b" x1="50%" x2="50%" y1="0%" y2="100%" gradientTransform="rotate(-150 .5 .5)">
            <stop offset="0%" stop-color="hsl(194, 83%, 49%)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0)" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%" gradientTransform="rotate(150 .5 .5)">
            <stop stop-color="hsl(227, 100%, 50%)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0)" stop-opacity="0"/>
        </linearGradient>
        
        <filter id="c" width="140%" height="140%" x="-20%" y="-20%" color-interpolation-filters="sRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feTurbulence width="100%" height="100%" x="0%" y="0%" baseFrequency=".55" numOctaves="2" result="turbulence" seed="2" stitchTiles="stitch" type="fractalNoise"/>
            <feColorMatrix width="100%" height="100%" x="0%" y="0%" in="turbulence" result="colormatrix" type="saturate" values="0"/>
            <feComponentTransfer width="100%" height="100%" x="0%" y="0%" in="colormatrix" result="componentTransfer">
                <feFuncR slope="3" type="linear"/>
                <feFuncG slope="3" type="linear"/>
                <feFuncB slope="3" type="linear"/>
            </feComponentTransfer>
            <feColorMatrix width="100%" height="100%" x="0%" y="0%" in="componentTransfer" result="colormatrix2" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -11"/>
        </filter>
    </defs>
    <rect width="100%" height="100%" fill="hsl(0, 100%, 60%)"/>
    <rect width="100%" height="100%" fill="url(#a)"/>
    <rect width="100%" height="100%" fill="url(#b)"/>
    <rect width="100%" height="100%" fill="transparent" filter="url(#c)" style="mix-blend-mode:soft-light"/>
 </svg>
```

  


### 即时模式和保留模式

在 Web 开发中，了解[即时模式](https://en.wikipedia.org/wiki/Immediate_mode_%28computer_graphics%29)（Immediate Mode）和[保留模式](https://en.wikipedia.org/wiki/Retained_mode)（Retained Mode）的区别对于选择合适的图形技术至关重要。Canvas 和 SVG 分别是这两种模式的典型代表，其中 Canvas 是即时模式，SVG 是保留模式。


Canvas 是 HTML5 的一个特性，采用即时模式来绘制图形。这意味着绘图命令直接在 Canvas 画布上执行，一旦绘图完成，画布就不再保留这些图形的信息。

在 Canvas 中，所有绘图操作都是通过 JavaScript 进行的，你需要手动计算每个绘图步骤，Canvas 只负责执行这些命令。例如：

  


```HTML
<canvas id="myCanvas" width="200" height="200"></canvas>
```

  


```JavaScript
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
context.fillStyle = '#c00';
context.fillRect(10, 10, 100, 100);
```

  


上述代码在 Canvas 画布上绘制了一个红色矩形，但 Canvas 并不保留这个矩形的信息。如果需要移动矩形或改变其颜色，就必须重新绘制整个画布。也就是说，在 Canvas 中，一旦你绘制了像素，系统就会忘记它们，从而减少了维护绘图内部模型所需的额外内存。

  


因此，Canvas 擅长处理复杂的动画和大量图形，因为它不需要保留每个对象的状态。它非常适合用于游戏开发、实时数据可视化等需要频繁更新图形的场景。不过，由于 Canvas 不保留绘图对象的信息，Web 开发者需要自行管理绘图的状态和更新，增加了复杂性。


与 Canvas 不同，SVG 采用保留模式来绘制图形。这意味着每个图形元素都是独立的 DOM 节点，并且浏览器会保留这些元素的信息，这使得 Web 开发者能更好地控制 SVG。例如，在 SVG 中，Web 开发者可以通过 JavaScript 和 CSS 对 SVG 图形元素进行操作和样式调整：

  


```XML
<svg width="200" height="200">
    <rect x="10" y="10" width="100" height="100" fill="#c00"></rect>
</svg>
```

  


上述代码创建了一个红色矩形，并保存在 DOM 中。你可以随时通过 JavaScript 或 CSS 修改这个矩形的属性，而不需要重新绘制整个图形：

  


```CSS
rect {
    fill: lime;
}
```

  


此时，CSS 中的 `fill` 属性将覆盖 `<rect>` 元素的 `fill` 属性，使矩形呈现绿色。

  


SVG 在处理交互性和复杂图形时非常强大，因为每个图形对象都是一个独立的 DOM 节点。但这也带来了性能成本，因为浏览器需要管理这些节点的状态和渲染。因此，SVG 在处理大量对象时性能可能会下降。

  


基于即时模式和保留模式的区别，以及 Canvas 和 SVG 各自的特点，我们可以勾画出一些适用场景：

-   **即时模式（Canvas）** ：适合需要频繁更新和处理大量图形的场景，如游戏开发和实时数据可视化。优点是性能好，但需要手动管理绘图状态和更新，且放大时可能出现像素化。
-   **保留模式（SVG）** ：适合需要高质量图形和交互性的场景，如图标、徽标和简单动画。优点是操作和更新方便，且不会出现像素化问题，但处理大量对象时性能可能较差。

  


通过了解这两种模式的差异，开发者可以根据具体需求选择最合适的图形技术，以实现最佳的 Web 体验。

  


### 可伸缩性

当下，SVG 和 Canvas 是两种最流行的绘图标准，广泛用于 Web 创建视觉内容，但它们的方法上有根本的不同。SVG 是一种基于 XML 的标记语言，用于描述 2D 矢量图形；而 Canvas 则允许用户通过 JavaScript API 在 HTML5 的 `<canvas>` 元素上绘制图形。


从一开始，SVG 就由 W3C 作为开放标准开发，这意味着它能很好地配合其他 Web 标准。例如，你可以将 SVG 内嵌到 HTML 文档中，可以使用 JavaScript 动态修改 SVG 元素或属性，还可以使用 CSS 调整 SVG 元素样式。


Canvas 在这方面与 SVG 有所不同。它的历史有些曲折，最初由苹果公司引入，后来由 WHATWG 标准化。由于 Canvas 最初是苹果公司作为专有元素创建的，其遵循 Web 标准的程度曾引起质疑，至今在某些重要领域仍然存在不足。


两种技术最相关的区别在于它们如何呈现内容。Canvas 基于栅格（像素），即在 Web 上排列的像素数组，而 SVG 基于矢量，用数学数据来描述图形。SVG 的优势在于，当缩放时，它能够保持图形的完整性，在不同大小的设备和分辨率上都能保持清晰和干净。而 Canvas 的内容，包括文本，在调整大小时可能会失去清晰度。


因此，SVG 常被认为更适用于创建矢量图形，特别是需要在不同设备上保持一致的图像质量时。此外，SVG 还支持交互和动画。另一方面，Canvas 更适合处理复杂的动画和大量的图形，因为它不需要保留每个对象的状态。但由于 Canvas 是一种与分辨率相关的栅格图形格式，其可伸缩性不如 SVG，图形被放大时质量会受到影响。


总的来说，SVG 和 Canvas 各有优劣，选择使用哪种技术应根据具体需求来决定。SVG 适用于需要高质量、可伸缩的图形和较少交互的场景，而 Canvas 则更适合需要频繁更新和处理大量图形的场景，如游戏开发和实时数据可视化。

  


### 互动性


尽管 SVG 和 Canvas 都用于创建二维图形，但它们在互动性方面存在显著差异。


正如之前提到的，SVG 是一种声明性语言（采用保留模式），这意味着 SVG 元素及其对应的行为可以直接在代码中定义。这使得 Web 开发人员可以轻松地将交互元素纳入矢量图形中。例如，开发人员可以将各种事件绑定到 SVG 元素上，如鼠标点击、按键和其他用户交互。此外，SVG 支持各种动画效果，可以用于创建动态和吸引人的用户体验。


以下是一个示例：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bab87a827cc4ef68ef06a7b227ccb1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=504&s=737285&e=gif&f=217&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/QWRNjrL

  


示例中的右侧“眼睛”图标是使用 SVG 图形绘制，当用户击时，“眼睛”会在“关闭”（眼睛紧闭）和“打开”（眼睛睁开）之间来回切换。在这里，通过点击事件，切换元素类名，同时使用 CSS 控制图形元素样式来实现：

  


```HTML
<div class="form">
    <svg class="icon icon--lock" viewBox="0 0 27.9 38.1">
        <path d="M25.9 18.5V9.7A9.7 9.7 0 0 0 16.2 0H11.8a9.7 9.7 0 0 0-9.7 9.7v8.8A2.8 2.8 0 0 0 0 21.2V38.1H27.9V21.2A2.8 2.8 0 0 0 25.9 18.5ZM11.8 4h4.4a5.7 5.7 0 0 1 5.7 5.7v8.7H6.1V9.7A5.7 5.7 0 0 1 11.8 4Z" />
    </svg>
    <input type="password" value='MhHva7kL:tC' id="password" name="password" class="input" />
    <label for="password" class="action">
        <!-- 眼睛图标 -->
        <svg class='icon icon--close icon--action' viewbox="0 0 37.9 33.7">
            <g class="eye--down">
                <circle cx='18.9' cy='21' r='5.5' />
                <path d='M19 33.7C8.5 33.7 0.5 21.5 0.1 21l3.4-2.2c0.1 0.1 7.2 10.9 15.4 10.9 8.3 0 15.4-10.8 15.4-10.9l3.4 2.2C37.4 21.5 29.4 33.7 19 33.7z' />
            </g>
          <g class="eye--up">
                <rect height='9.2' width='4' x='17' />
                <rect height='4' transform='matrix(0.7071 -0.7071 0.7071 0.7071 3.0628 26.0282)' width='10' x='27.9' y='7.3' />
                <rect height='10' transform='matrix(0.7071 -0.7072 0.7072 0.7071 -5.1384 6.2299)' width='4' x='3' y='4.3' />
                <path d='M34.4 23.1C34.3 23 27.2 12.2 19 12.2 10.7 12.2 3.6 23 3.5 23.1l-3.4-2.2C0.5 20.4 8.5 8.2 19 8.2c0 0 0 0 0 0 10.4 0 18.5 12.2 18.8 12.8L34.4 23.1z' />
          </g>
        </svg>
    </label>
</div>
```

  


关键部分的 CSS 代码：

  


```CSS
.form {
    g {
      transform-origin: center;
      transform-box: fill-box;
      transition: all .2s linear;
    }
    
    .eye--down {
      opacity: 0;
    }
    
    .eye--up {
      translate: 0 calc(-50% + 20px);
      scale: 1 -1;
    }
}

.form--reveal {
    .eye--down {
        opacity: 1;
    }
    .eye--up {
        translate: 0;
        scale: 1;
    }
}
```

  


给 SVG 图标（“眼睛”）绑定一个 `click` 事件，并且切换 `.form--reveal` 类名：

  


```JavaScript
const action = document.querySelector('.action');
const form = document.querySelector('.form');

action.addEventListener('click', etv => {
    form.classList.toggle('form--reveal');
})
```

  


如果你仔细观察上面的示例，你会发现我们使用 SVG 绘制了一个“睁开的眼睛”。但实际上，“闭合的眼睛”只是“睁开的眼睛”的一部分形状。因此，我们通过 CSS 控制 SVG 元素的透明度和位置，使其在用户点击时实现两种外形的切换。

  


众所周知，CSS 是现代 Web 开发的三大基石之一，而它与 SVG 的结合堪称完美。这意味着，所有 CSS 的优点都可以延伸到 SVG 中，从而实现更模块化的代码。

  


CSS 和 SVG 的结合非常顺畅，以至于许多 Web 开发者经常忽视使用 CSS 伪类（例如 `:hover`）来更新 SVG 样式的简便性。此外，CSS 还能让开发者轻松实现复杂的动画效果，通常比使用 JavaScript 实现的效果更好。这些动画技术可以应用于所有 DOM 元素，包括 SVG。

例如，下面的几个示例通过纯 CSS 实现了动画效果，微妙而细腻，非常吸引人：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dc0eeb180be49878c76eab8bd160cbe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=518&s=118654&e=gif&f=139&b=ff4a1d)

  


> Demo 地址：https://codepen.io/kowshikkuri/full/vPebdy（来源于 [@Kowshik Kuri](https://codepen.io/kowshikkuri)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e254777aa3d940359e51ff4df93efb34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=552&s=1609138&e=gif&f=149&b=1e1f24)

  


> Demo 地址：https://codepen.io/jkantner/full/MWzqMrp （来源于 [@Jon Kantner](https://codepen.io/jkantner)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24bf7d11ced64d50a649cab38070d02f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=528&s=676156&e=gif&f=155&b=18171f)

  


> Demo 地址：https://codepen.io/milanraring/full/KKwRBQp （来源于 [@Milan Raring](https://codepen.io/milanraring)）

  


可以说，这种带有微动效的案例在 Web 上数不胜数。我们以 [@Kowshik Kuri](https://codepen.io/kowshikkuri) 创建的汉堡图标与关闭图标切换按钮为例。这两个图标都是基于三个 `<path>` 绘制的：

  


```HTML
<div class="trigger">
    <input type="checkbox" id="trigger" name="trigger" class="sr-only" />
    <label for="trigger">
        <svg class="bars" viewBox="0 0 100 100" onclick="this.classList.toggle('active')">
            <path class="bars__line bars__line--up" d="m 30,33 h 40 c 13.100415,0 14.380204,31.80258 6.899646,33.421777 -24.612039,5.327373 9.016154,-52.337577 -12.75751,-30.563913 l -28.284272,28.284272" />
            <path class="bars__line bars__line--middle" d="m 70,50 c 0,0 -32.213436,0 -40,0 -7.786564,0 -6.428571,-4.640244 -6.428571,-8.571429 0,-5.895471 6.073743,-11.783399 12.286435,-5.570707 6.212692,6.212692 28.284272,28.284272 28.284272,28.284272" />
            <path class="bars__line bars__line--down" d="m 69.575405,67.073826 h -40 c -13.100415,0 -14.380204,-31.80258 -6.899646,-33.421777 24.612039,-5.327373 -9.016154,52.337577 12.75751,30.563913 l 28.284272,-28.284272" />
        </svg>
    </label>
</div>
```

  


注意，[我在原 Demo 上进行了改造](https://codepen.io/kowshikkuri/full/vPebdy)（通过切换类名来切换图标），图标切换的动画效果是使用纯 CSS 实现的，具体代码如下：

  


```CSS
.trigger {
    border: 2px solid #fff;
    border-radius: 10px;
    display: grid;
    place-content: center;
}

.bars {
    display: block;
    width: 88px;
    aspect-ratio: 1;
    cursor: pointer;

    .bars__line {
        stroke-linejoin: round;
        stroke-linecap: round;
        fill: none;
        stroke: #fff;
        stroke-width: 6;
        transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
      
        &.bars__line--up {
            stroke-dasharray: 40 172;
        }
      
        &.bars__line--middle {
            stroke-dasharray: 40 111;
        }
      
        &.bars__line--down {
            stroke-dasharray: 40 172;
        }
    }
}
  
#trigger:checked ~ label {
    .bars__line--up {
        stroke-dashoffset: -132px;
    }
    
    .bars__line--middle {
        stroke-dashoffset: -71px;
    }
    
    .bars__line--down {
        stroke-dashoffset: -132px;
    }
}
```

  


上面代码中，通过复选框（`#trigger`）是否处于选中状态（`:checked`）来改变 `<path>` 元素的 `stroke-dashoffset` 的值，并且通过 `transition` 属性给它设置了一个过渡效果。就仅仅这几行样式代码，你的 SVG 按钮就有“生命”了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3394b8de22241b9a21f6cd7acd991c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1090&h=534&s=230771&e=gif&f=104&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/oNRxWwX

  


在 SVG 中，Web 开发者不仅可以使用 CSS 和 JavaScript 与其互动，还可以通过 `<foreignObject>` 与 HTML 深度结合。`<foreignObject>` 本质上允许在 SVG 元素中嵌入 HTML 元素。

以 `Tooltips` 组件为例，假设该组件是一个不规则的图形，你可能会考虑使用 SVG 来构建，但 SVG 中的 `<text>` 元素并不像 HTML 中的文本那样会自动换行。虽然使用 `<tspan>` 元素适合用于分隔标题中的行，但对于 `Tooltips` 中的内容文本来说却过于局限。你可能希望组件足够灵活，文本能够自然流动和换行。在这种情况下，结合使用 SVG 的 `<foreignObject>` 和 HTML 元素将是一个不错的选择：

  


```XML
<svg xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <use xlink:href="#principles-bubble"></use>
    <text x="20" y="50">WE BELIEVE…</text>
    <foreignObject x="20" y="65" width="210" height="100">
        <p>in long-term creative partnerships…</p>
    </foreignObject>
</svg>
```

  


更为有趣的是，在 `<foreignObject>` 中，你可以做与 HTML 相似的事情，比如在 `<style></style>` 给元素设置样式，可以是任何你想要添加的样式。

  


```XML
<foreignObject x="20" y="65" width="470" height="80%">
    <style>
      @property --rot {
        syntax: '<angle>';
        inherits: false;
        initial-value: 0deg;
      }

      @keyframes rotation {
        from {
          --rot: 0deg;
        }

        to {
          --rot: 360deg;
        }
      }

      p {
        line-height: 2;
        background: conic-gradient(from var(--rot) at 40% 34.8%, #F1B541 0deg, #8D69F4 133.12deg, #F1B541 360deg);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-box-decoration-break: clone;
        color: transparent;
        font-size: 1.125rem;
        font-family: inherit;
        animation: rotation 2s cubic-bezier(0.4, 0, 1, 1) infinite alternate;
      }
    </style>
    <p>Gradients have been a part of the CSS spectrum for quite some time now. We see a lot of radial and linear gradients in a lot of projects, but there is one type of gradient that seems to be a bit lonely: the conic gradient. We’re going to make a watch face using this type of gradient. </p>
</foreignObject>
```

  


如果你对 CSS 熟悉的话，你猜到上面代码意味着什么。是的，它给 `<foreignObject>` 中的 `<p>` 元素添加动化渐变文本效果。你可以发挥你的创意，可以实现更多有趣的 UI 效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fde107d5333342c5acdd84be8a837f13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=624&s=4342260&e=gif&f=99&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/mdYPwrX

  


正如你所看到的，利用 SVG 中的 `<foreignObject>` 可以让你创建包含 HTML 的元素，同时避免了其他方法的一些困难。如果你想在 Canvas 上使用 HTML，就必须采用更为复杂的方法，例如，在基础元素上方叠加 HTML。

  


另一方面，Canvas 是一种过程性语言（采用的是即时模式），这意味着它需要开发人员的指令来执行所需的行为。因此，在处理交互任务时，Canvas 变得更加复杂，因为开发人员必须为每个元素手动编写相应的行为。然而，Canvas 也有其独特的优势，例如能够绘制位图图像和创建 3D 效果。

下面是一个由 [@Julian Laval 创建的粒子动画效果](https://codepen.io/JulianLaval/full/KpLXOO)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17f57a0213da4d1a8d2e5a7ccb657d62~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1290&h=586&s=8399788&e=gif&f=52&b=1e2228)

  


> Demo 地址：https://codepen.io/JulianLaval/full/KpLXOO （来源于 [@Julian Laval](https://codepen.io/JulianLaval)）

  


### 性能

通常情况下，Canvas 在性能方面被认为优于 SVG，但这种观点并不总是正确的。在一些讨论中，你可能会遇到一个错误的断言，即 Canvas 总是比 SVG 性能更好。然而，事实是，在处理少量对象或大面积绘图时，SVG 实际上更高效。如果你处理的是小面积或大量对象，那么 Canvas 更具优势。


在比较 SVG 和 Canvas 的性能时，需要考虑许多不同的因素。SVG 是基于 XML 的矢量图像格式，在简单形状的绘制方面，通常比 Canvas 性能更好。此外，SVG 文件体积较小，非常适合具有大量图形内容的网页。由于 SVG 基于文本并由浏览器处理，因此加载速度快，并且可以缓存在浏览器的内存中，进一步减少加载时间。

  


相对而言，Canvas 文件通常比 SVG 文件大得多，因此加载时间更长，可能会降低 Web 性能。尽管存在体积劣势，但 Canvas 在处理复杂绘图和动画时表现更好。使用 Canvas 可以快速绘制图像，而且不会损失质量。此外，JavaScript API 对 Canvas 操作进行了优化，可以实现更快的动画效果。因此，具体选择哪种技术取决于使用场景。如果涉及到简单形状的绘制，SVG 是更好的选择；对于复杂绘图和动画，Canvas 则更为合适。

  


在选择技术时，还需要考虑内容类型以及用户与应用程序的交互方式。例如，[考虑一个包含成千上万个数据点的散点图](https://echarts.apache.org/examples/zh/editor.html?c=scatter-stream-visual)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb607cd8516a47d395824a241b9ee883~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1310&h=722&s=3681274&e=gif&f=104&b=fefcfc)

  


> 来源于：https://echarts.apache.org/examples/zh/editor.html?c=scatter-stream-visual

  


一般来说，这种类型的图表通过绘制两个变量来展示数据集的概况，并暗示它们之间的相关性。重要信息是通过查看点的整体分布而不是每个点的细节来获得的。在用户界面方面，可以假设用户不需要放大查看每个点，也不需要每个点都包含如文本或图像等子元素。如果你希望通过时间轴动画显示每个点，Canvas 是一个理想的选择。

  


你需要可视化的信息类型往往决定了显示方式。如果每个数据点都需要成为一个交互式卡片，包含文本、图像和操作按钮，那么用户将如何与这些内容交互？

  


在这种情况下，每个独立元素的细节可能是用户最感兴趣的，同时用户也不可能一次性查看成千上万个这样的元素。对于这种情境，SVG 可能更适合，因为它能够更好地处理交互元素。

  


是否有策略可以用来提高性能呢？即使需要将成千上万个信息丰富的元素作为一个整体查看，是否可以只呈现每个元素的简化视图？毕竟，元素的细节无论如何也无法辨认。可以只在给定时间内呈现部分元素吗？在“延迟加载”的时代，一个常见的做法是只呈现视口内可见的元素，从而节省宝贵的加载时间。

  


关于这些策略的详细讨论已超出本节的范围，但它们确实是提升性能的有效手段。

  


### 可访问性


即使网站速度快得惊人，内容令人难以置信，如果对用户不可访问，那么一切也就毫无意义。同样的理念也适用于创建信息丰富的视觉图形。选择哪种技术来创建这些图形，对于确定它们的可访问性至关重要。


[根据世界卫生组织的数据](https://www.who.int/news-room/fact-sheets/detail/disability-and-health#:~:text=An%20estimated%201.3%20billion%20people%20%E2%80%93%20or%2016%25%20of%20the%20global,diseases%20and%20people%20living%20longer.)，全球约有 16% 的人口患有不同程度的疾病，如痴呆、失明或脊髓损伤。虽然并不是所有这些人都使用辅助技术来浏览 Web，但如果你是一位希望扩大用户群的企业所有者，或者你担心因 Web 不可访问而被诉讼，这个数字就不能被忽视。可访问性不仅是良好的商业实践，也是为了为每个人创造最佳体验而必须做的正确事情。

  


鉴于此，SVG 和 Canvas 在可访问性方面如何比较呢？

正如之前提到的，Canvas 在 DOM 中是一个单一元素。这对可访问性有着巨大的影响。Canvas 不提供有关绘制内容的任何信息，也不向可访问性工具公开任何信息。[MDN 直言不讳地表达了这一点](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#alternative_content_2)：“**通常情况下，你应避免在可访问的网站或应用中使用 Canvas**。”

  


相比之下，由于 SVG 及其所有内容都在 DOM 中，它自然地传达了语义含义，辅助技术可以访问子元素、文本和链接。由于 SVG 是根据 Web 标准设计的，因此可以通过可访问性标准（例如 ARIA）进一步增强。这意味着在图形中可视表示的内容也可以在标记中传达，使辅助软件能够访问这些信息。

  


是否可以将 HTML Canvas 的内容传达为标记？从 Canvas 和可访问性的角度来看，这实际上是一个重要问题。简短的答案是……这取决于情况。你的 Canvas 显示的是一些简单的静态形状，还是包含复杂的交互式图表？[主要的 Web 标准组织 W3C 说](https://www.w3.org/html/wg/spec/the-canvas-element.html)：

  


> “当开发者使用 `<canvas>` 元素时，他们还必须提供内容，该内容在呈现给用户时传达与画布位图本质上相同的功能或目的。此内容可以放置为 `<canvas>` 元素的内容。`<canvas>` 元素的内容（如果有）是元素的替代内容。”

  


以文本描述形式的替代内容确实可以传达简单静态形状的特征。但是，当涉及到动态图表时，提供传达相同功能的替代内容变得更加棘手。

  


事实上，[HTML 规范说](https://html.spec.whatwg.org/multipage/canvas.html#best-practices)最佳实践是为 Canvas 的每个可聚焦部分提供可聚焦元素作为替代内容。此时，你可能会问自己，为什么不一开始就使用 SVG 呢？

  


Canvas 通常被称为“不需要处理 DOM 的开销”。就可访问性而言，这种“开销”其实就是你的用户。

  


### 测试与调试

  


确保你的应用程序按预期表现是开发过程中的一个重要环节。为了确保图形功能的正常运行，调试问题和测试功能必须纳入你的工作流程中。

  


再次比较 Canvas 和 SVG 时，我们必须提到 Canvas 在 DOM 中是一个独立的 HTML 元素的事实。这有许多实际意义，可能会影响到软件的交付速度和可靠性。

  


通常，开发人员在遇到视觉错误时会使用开发者工具检查 DOM 中的元素。这是一个熟悉的过程，可以快速揭示关键信息，比如元素是否存在于 DOM 中，或者它是否具有预期的属性等。这有助于快速识别并解决问题。

  


然而，由于 Canvas 元素遵循“所见即所得”的原则，开发人员无法像操作其他 DOM 元素那样直接检查 Canvas 的内容。开发人员必须仔细研究长篇的 Canvas 代码以找到问题，这在此过程中浪费了宝贵的时间。

  


为了尽量减少调试的工作量，你可能希望在工作流程中引入测试。由于 SVG 和 Canvas 都用于创建图形，因此通常需要测试应用程序的用户界面（UI）。一些流行的用于自动化此过程的端到端（E2E）测试框架包括[Cypress](https://www.cypress.io/)、[Playwright](https://playwright.dev/) 和 [Selenium](https://www.selenium.dev/)。

  


这些框架的一个共同特点是它们基于 DOM 元素的可访问性工作。通过选择器（包括 CSS 选择器、可访问性角色甚至文本）来定位元素。但在使用 Canvas 时，这些信息并不容易获取，这应引起我们的重视。

  


如果尝试对 Canvas 进行 E2E 测试，你可能需要编写大量自定义代码来定位 Canvas “元素”，然后捕获 Canvas 元素上的事件，或使用某些解决方案来模拟与元素的交互而不实际生成任何 DOM 事件。

  


E2E 测试的目标是从真实用户的角度测试应用程序。为了模拟这个过程而实施的任何临时解决方案都永远不会是令人信服的替代品。最重要的是，如果你想要对 UI 进行真正的端到端测试，那么 SVG 是更好的选择。

  


### SVG 和 Canvas 的主要区别

  


我们已经从多个角度详细比较了 SVG 和 Canvas，以下是对两者差异的简要总结：

  


-   **分辨率独立性**：SVG 图像是基于矢量的，因此在任意缩放级别或显示尺寸下都能保持清晰的视觉效果，不会出现像素化。而 Canvas 图形在缩放时可能会导致像素化。
-   **DOM 交互性**：SVG 允许对图形中的每个元素进行交互和动画，因为每个元素都在 DOM 中表示。相比之下，Canvas 没有内置的交互性，必须手动编程，可能会更复杂。
-   **性能**：由于 SVG 中的每个对象都需要更多内存来保存其状态和方法，因此在处理大量对象时，SVG 可能会有延迟。Canvas 是基于像素的，可以更高效地处理数千个对象，因此在处理复杂图形场景、实时图形或游戏时表现更好。
-   **可访问性**：SVG 图像包含有关其形状的信息，屏幕阅读器可以读取这些信息，使其更易访问。Canvas 图形则较难实现可访问性，因为它们是纯粹的栅格图形，不包含固有的绘制元素信息。
-   **易用性**：对于一些开发人员来说，SVG 可能更容易使用和理解，因为它在 HTML 中使用类似 XML 的语法，每个图形元素都可以像其他 HTML 元素一样进行样式化和操作。

  


SVG 的优缺点：

  


-   **优点**：非常适合用于用户界面和用户体验动画；图像是分辨率无关的，适用于需要高质量缩放的场景；调试过程相对简单。
-   **缺点**：在处理大量对象时，性能可能会显著下降；动画需要精心设计和实现；容易在处理过程中遇到问题，导致崩溃。

  


Canvas 的优缺点：

  


-   **优点**：非常适合创建令人印象深刻的 3D 或沉浸式效果；能够高效处理大量对象的移动。
-   **缺点**：实现可访问性较为困难；默认情况下，Canvas 不是分辨率无关的。

  


总而言之，SVG 和 Canvas 是用于在网站上创建图形的两种不同技术。SVG 是分辨率无关的，由官方标记语言组成，适用于需要高质量缩放、良好可访问性和复杂图形效果的场景。而 Canvas 则由像素组成，需要了解 JavaScript，更适用于需要高性能动画和像素级别操作的应用程序。每种工具都有其优点和缺点，选择取决于项目的具体目标。

  


## SVG 和 Canvas 的应用场景


SVG 和 Canvas 是用于呈现矢量和光栅图形的 HTML5 API。SVG 用于创建基于矢量的图形，而 Canvas 可以渲染矢量和光栅图形。Canvas 更适用于快速渲染图形和动画，但对于控制较少。SVG 的一个应用场景可以是创建用于网站的交互式地图系统。由于 SVG 是矢量格式，用户可以在地图上进行缩放而不会出现像素化或失真。SVG 还支持平滑的动画，可用于描述地图上的运动。


Canvas 可以用于渲染游戏，因为它为你提供了很多控制和灵活性。例如，Canvas 可以用于渲染游戏的环境、角色和动画。它还可以用于物理模拟和人工智能计算。

  


SVG 和 Canvas 还可以用于创建网站的数据可视化，其中 SVG 更适用于创建详细的图表，而 Canvas 更适用于以更少的控制快速创建图表。

  


总的来说，当处理数百甚至数千个对象时，DOM 渲染的开销更为明显；在这种情况下，Canvas 显然是赢家。然而，无论是画布还是 SVG，都不受对象大小的影响。综合考虑，Canvas 在性能上表现出明显的优势。

  


根据我们对 Canvas 的了解，特别是其在绘制大量对象时的出色性能，以下是一些可能适合使用 Canvas 的情景，甚至可能比 SVG 更合适的情况。

  


-   **游戏和生成艺术**：对于图形密集型、高度交互式的游戏，以及生成艺术，通常可以使用 Canvas。
-   **光线追踪**：光线追踪是一种创建 3D 图形的技术。光线追踪可用于通过跟踪光线在图像平面中的像素上的路径，并模拟其与虚拟对象相遇的效果来提升图像。然而，尽管 Canvas 绝对比 SVG 更适合此任务，但并不一定意味着光线追踪最好在 `<canvas>` 元素上执行。事实上，对 CPU 的压力可能相当大，以至于你的浏览器可能会停止响应。
-   **在小面积绘制大量对象**：应用程序需要在相对较小的表面上绘制大量对象的情景，例如非交互式实时数据可视化，如天气模式的图形表示。
-   **视频中的像素替换**：将视频背景颜色替换为不同的颜色、另一个场景或图像。

  


另一方面，在很多情况下，Canvas 可能不如 SVG 更适合。

  


-   **可扩展性**：大多数情况下，如果可扩展性是一个加分项，使用 SVG 会比 Canvas 更好。高保真度、复杂的图形，如建筑和工程图、组织图表、生物学图等，就是这样的例子。当使用 SVG 绘制时，放大图像或打印图像会保留所有细节，质量非常高。你还可以从数据库生成这些文档，这使得 SVG 的 XML 格式非常适合这项任务。

-   **可访问性**：尽管你可以采取一些措施使 Canvas 图形更具可访问性，但是当涉及到可访问性时，Canvas 并不突出。你在 Canvas 表面绘制的内容只是一堆像素，这无法被辅助技术或搜索引擎机器人读取或解释。这是 SVG 更为可取的另一个方面：SVG 只是 XML，这使得它可以被人类和机器读取。
-   **不依赖 JavaScript**：如果你不想在应用程序中使用 JavaScript，那么 Canvas 不是你的最佳选择。事实上，你唯一能够使用 `<canvas>` 元素的方式就是使用 JavaScript。相反，你可以使用像 Adobe Illustrator、Inkscape、Sketch 和 Figma 等标准矢量编辑程序绘制 SVG 图形，并且可以使用纯 CSS 来控制它们的外观，并执行引人注目的、微妙的动画和微交互。

当然，有些情况下，通过结合 Canvas 和 SVG，你的应用程序可以兼得两者的优点。例如，基于 Canvas 的游戏可以使用矢量编辑程序生成的 SVG 图像实现精灵，以利用与 PNG 图像相比的可扩展性和减小的下载大小。或者，绘画程序可以使用 SVG 设计其用户界面，并嵌入一个 `<canvas>` 元素，用于绘图。

  


## SVG 和 Canvas 的使用建议

  


SVG 和 Canvas 是两种在互联网上创建和绘制图形的常用技术。Canvas 通常用于创建图形、动画和游戏，而 SVG 则常用于创建可缩放的矢量图形。

在选择这两种技术时，考虑图形的复杂性至关重要。

对于简单的图形，如形状和标志，SVG 是最有效的选择。它在多个分辨率下都能保持高质量和性能。另一方面，Canvas 更适用于动态和交互式图形，比如动画、视频和互动游戏。Canvas 在处理复杂图形或大量对象时也更高效。

总的来说，SVG 适用于简单的图形，而 Canvas 更适合复杂、动态和交互式的图形。

  


### 选择 SVG 的情况


当你处理少量对象，并且每个对象都需要交互性或复杂动画时。由于其可伸缩性，对于响应式设计，SVG 也是最佳选择。

-   **交互式信息图表**：需要对单个元素进行交互（如点击或悬停）的图表。SVG 允许通过 DOM 操作每个元素，非常适合这种需求。
-   **图标和标志**：需要在各种尺寸下保持清晰度的图形。作为矢量格式，SVG 在从小图标到大广告牌的所有尺寸下都能保持高质量。
-   **数据可视化**：对于简单的、交互式的数据可视化，如条形图、饼图和折线图，SVG 是最佳选择，因其可缩放性和对单个元素附加事件处理程序的能力。
-   **地图**：如果你需要创建包含少量元素的交互式地图（如建筑平面图或小型城镇地图），SVG 是理想的选择，因为它允许与每个地图元素轻松交互。

  


### 选择 Canvas 的情况

  


当你需要处理数千或数百万个对象，特别是在动画或游戏场景中，其中对象不需要个别交互时。


-   **在线游戏**：需要快速变化的大量对象的情景，如游戏。Canvas 能高效处理大量对象的快速渲染，不需要维护 DOM 的开销。
-   **图像编辑应用程序**：允许用户操作图像的应用程序（如添加滤镜、绘图等）。Canvas 允许直接像素操作，非常适合此类应用。
-   **复杂动画**：需要创建复杂的、动态的动画，尤其是具有大量元素或精细运动路径的动画。Canvas 提供更低的开销和更多的灵活性。
-   **实时视频或数据流**：需要呈现视频帧或可视化实时数据（如股市数据）的情景。Canvas 的快速重绘和更新能力使其成为更合适的选择。

  


SVG 和 Canvas 各有优缺点，选择哪种技术取决于项目的具体需求。SVG 更适合需要高质量缩放、良好可访问性和复杂图形效果的场景，而 Canvas 则更适用于需要高性能动画和像素级别操作的应用程序。综合考虑这两种技术的特点，可以在不同的项目中合理选择和应用。

  


## 小结

  


在 SVG 和 Canvas 之间并没有明确的胜负，因为它们各有优点和缺点，最佳选择将取决于你的编程背景以及项目的目标和规范。如果你习惯使用 SVG 创建简单的图形，但想尝试高级图形或构建 2D 游戏，那么可以考虑尝试 Canvas。

  


我个人认为，SVG 在实用性和伦理方面远远超过 Canvas 所提供的内容。即使 Canvas 的性能优势可以通过虚拟渲染等技术来缓解，但你是否愿意放弃 SVG 所提供的所有优势，这仍然是一个需要权衡的问题。最后，如果几毫秒的性能差异决定了你的应用程序的成败，那么花点时间了解 WebGL/WebGPU API 可能比使用 Canvas API 更有价值。