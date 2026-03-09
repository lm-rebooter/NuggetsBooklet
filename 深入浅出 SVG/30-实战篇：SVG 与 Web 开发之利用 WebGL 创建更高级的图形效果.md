SVG 是一种独特的图像格式，其特殊之处在于它不是由像素构成，而是由数学函数定义的。一旦解释了这些数学函数，SVG 图像便可以在屏幕上精确呈现。这种矢量图形格式的特性使得 SVG 在 Web 开发中广泛应用，并且能够与其他 Web 技术如 CSS 和 JavaScript 无缝结合，以创建复杂的图形效果和交互动画。在此基础上，结合 WebGL 技术，我们可以进一步提升图形效果的复杂度和视觉吸引力。


利用 SVG 和 WebGL 技术，我们可以实现令人惊叹的图形效果和交互动画。本课程将重点介绍如何结合 SVG 和 WebGL，在 Web 开发中创建更高级的图形效果。我们将探索如何以 SVG 为基础，通过 WebGL 技术实现更复杂的图形渲染和动画效果，从而为用户带来更加丰富的视觉体验。

  


在本课程中，我们将学习如何利用 SVG 的可缩放性和数学函数表示来创建基本的图形结构，然后通过引入 WebGL 技术增强这些图形结构，实现更高级的图形效果，如光影效果、粒子动画、3D 变换等。我们还将学习如何利用 JavaScript 将 SVG 和 WebGL 技术结合，实现交互动画和用户控制。

  


通过本课程的学习，你将掌握结合 SVG 和 WebGL 技术创建高级图形效果的核心概念和技能。这些技能不仅能够提升你在 Web 开发项目中的创造力和魅力，还能帮助你应对复杂的工程化问题，为你的 Web 开发项目增添更多的创新和价值。

  


## 今天的小目标

SVG 和 WebGL 的结合为 Web 开发开辟了新的可能性，带来了许多经典和创建的图形效果。这些效果不仅提升了视觉吸引力，还增强了用户的互动和参与感。在实际应用中，Web 开发者可以根据具体需求选择合适的技术组合，创造出高效、动态且令人印象深刻的 Web 体验。无论是数据可视化、交互式地图、游戏开发、产品展示、电子商务、教育培训、互动艺术还是虚拟现实以及增强现实，SVG 和 WebGL 都为 Web 开发者提供了强大的工具和无限的创意空间。

  


通过掌握这些技术，Web 开发者可以为 Web 项目增添更多的创意和魅力，创造出令人难忘的用户体验。接下来，我们将利用 SVG 和 WebGL 技术，实现引人注目的 Web 效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/659a1f2bccf54bb9b3a1af81ec513d2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=758&s=12833040&e=gif&f=133&b=000000)

  


> Demo 地址：https://codepen.io/Mamboleoo/full/zYEJVWy （来源于 [@Louis Hoebregts](https://codepen.io/Mamboleoo)）

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a98be51660ae47c99270368b73a65c9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=712&s=7931361&e=gif&f=134&b=24504c)

  


> Demo 地址：https://codrops-svg.surge.sh/

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08cadcc6ea5d47759ba0bad5870b51c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=626&s=7945468&e=gif&f=227&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/NWVrVPR

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fa88c6c082f4e4b84ec0b606924a5a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=668&s=1168474&e=gif&f=110&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/wvbGXwg

  


以上仅展示了 SVG 与 WebGL 技术结合实现的部分案例，而在 Web 上类似的效果数不胜数，无法一一列举。我更期待的是，在接下来的内容中，大家能够发挥自己的创意，创造出更具吸引力的效果。

  


## WebGL 简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c3e49c549c04b6fa826314eb0723bff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2611&h=1366&s=188352&e=png&b=0f256e)

  


WebGL 是一项前沿技术，为我们带来了在 Web 上展示丰富多彩的 3D 和 2D 图形的可能。它就像是一台魔法画笔，让我们能够在网页上绘制出各种形状、色彩和动态。

  


将 WebGL 比作一种创意的“画笔”，它赋予了我们以代码为媒介创造出惊艳视觉效果的能力，就像在白纸上随心所欲地作画一样。只需简单的代码，我们就能在 Web 上呈现流动的水面、绚丽的星空、以及栩栩如生的生物形象。

  


不同于传统的绘图工具，WebGL 基于 Web 技术，这意味着无需额外的插件或软件，便能在任何支持 WebGL 的现代浏览器上运行。这一点使得 WebGL 极其便利，让用户能够轻松体验到 Web 上的绚丽图形和动态效果。

  


除了在 Web 上呈现静态图形外，WebGL 还能实现高度交互的体验。比如，你可以打造一个交互式的 3D 地图，让用户自由探索各个角落；或者制作一个动态的游戏场景，让玩家沉浸其中。

  


不过，要想更高效地利用 WebGL，我们通常会借助一些主流的 WebGL 框架，让开发变得更加简洁、快速和灵活。其中，[Three.js](https://threejs.org/) 是最受欢迎的 WebGL 框架之一。它是一个基于 JavaScript 的 3D 库，提供了丰富的功能和易用的 API，使得创建 3D 场景变得轻而易举。Three.js 支持渲染器、相机、灯光等元素，同时提供了丰富的几何体和材质，让开发者能够快速创建出令人惊艳的 3D 效果。

  


另一个重要的 WebGL 框架是 [Babylon.js](https://www.babylonjs.com/)。与 Three.js 类似，Babylon.js 同样提供了强大的功能和易用的 API，同时注重性能和可扩展性。Babylon.js 具有丰富的特性，包括物理引擎、粒子系统、后处理效果等，让开发者能够轻松创建出各种各样的 3D 场景和效果。

  


除了这两个主流框架外，还有一些其他的 WebGL 框架，如 [A-Frame](https://aframe.io/)、[PlayCanvas](https://playcanvas.com/) 和 [PixiJS](https://pixijs.com/) 等，它们针对特定的应用场景或需求提供了不同的解决方案。

  


例如下面这个示例，就是使用 WebGL 创建的一个粒子动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6b0f5f002924fd79a165849624a9f17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300&h=640&s=480988&e=gif&f=27&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/XWwdwGL

  


上面示例对应的代码如下：

  


```HTML
<canvas id="canvas" width="640" height="480"></canvas>
```

  


```JavaScript
// 获取 WebGL 上下文
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

// 检查浏览器是否支持 WebGL
if (!gl) {
    console.error("WebGL not supported");
}

const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                float radius = 0.1 + abs(sin(position.x * position.y * 50.0)); // randomize point size
                gl_PointSize = min(radius * 10.0, 2.0); // limit radius
                gl_Position = vec4(position * 2.0, 0.0, 1.0); // scale position to [-1, 1] range
            }
        `;

const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 color;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) {
                    discard; // discard pixels outside the circle
                }
                float alpha = 1.0 - dist * 2.0; // transparency based on distance from center
                alpha = max(alpha, 0.1); // make sure alpha is not too transparent
                gl_FragColor = vec4(color.rgb, color.a * alpha);
            }
        `;

// 创建顶点着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// 创建片元着色器
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// 创建着色器程序
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// 获取着色器中定义的变量位置
const positionAttributeLocation = gl.getAttribLocation(program, "position");
const colorUniformLocation = gl.getUniformLocation(program, "color");

const numParticles = 1000;
let vertices = [];
let velocities = [];
let colors = [];


function initializeParticles() {
    vertices = [];
    velocities = [];
    colors = [];

    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random(); // reduce radius
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        vertices.push(x, y);
        velocities.push((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
        colors.push(
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            0.2 + Math.random() * 0.6
        ); // randomize alpha
    }
}

// 初始化粒子属性
initializeParticles();

// 创建并绑定缓冲区
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttributeLocation);

// 渲染函数
function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < numParticles; i++) {
        vertices[i * 2] += velocities[i * 2];
        vertices[i * 2 + 1] += velocities[i * 2 + 1];
    
        if (Math.abs(vertices[i * 2]) >= 1 || Math.abs(vertices[i * 2 + 1]) >= 1) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random(); // reduce radius
            vertices[i * 2] = Math.cos(angle) * radius;
            vertices[i * 2 + 1] = Math.sin(angle) * radius;
            velocities[i * 2] = (Math.random() - 0.5) * 0.02;
            velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.02;
            colors[i * 4] = Math.random() * 0.5 + 0.5;
            colors[i * 4 + 1] = Math.random() * 0.5 + 0.5;
            colors[i * 4 + 2] = Math.random() * 0.5 + 0.5;
            colors[i * 4 + 3] = 0.2 + Math.random() * 0.6;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    for (let i = 0; i < colors.length; i += 4) {
        gl.uniform4fv(colorUniformLocation, colors.slice(i, i + 4));
        gl.drawArrays(gl.POINTS, i / 2, 1);
    }

    requestAnimationFrame(render);
}

render();
```

  


这个粒子系统在画布上绘制了一组随机移动的点，每个点的大小和颜色都是随机的，而且点的移动会在画布边界处产生反弹效果。


正如你所看到的，WebGL 是一项强大的技术，让我们能够在 Web 上创造出令人惊叹的视觉效果，为用户带来更加丰富和有趣的网络体验。但在这节课中，我们不会过多涉及 WebGL 的内容，而是将重点放在如何将 SVG 与 WebGL 结合起来创作，为自己的 Web 项目增添亮点。

  


## 使用 SVGLoader 将 SVG 引入 WebGL

  


正如之前提到的，本节课的重点不在于介绍 WebGL 的基本用法，而是探讨如何将 SVG 与 WebGL 技术相结合，以实现更加高级的图形效果。因此，我们将从最基础的部分开始，即如何将 SVG 整合到 WebGL 中。

  


我们以 SVGLoader 和 WebGL 的 Three.js 为例，向大家展示如何使用 [Three.js 的 SVGLoader ](https://threejs.org/docs/#examples/en/loaders/SVGLoader)将你的 SVG 引入到 WebGL 中，并借助 Three.js 相关特性实现一个 3D 效果。

  


在开始之前，首先简单的对 Three.js 和 SVGLoader 做一个简单的介绍。

  


-   **[Three.js](https://threejs.org/)**：它是最流行的 3D WebGL 库，为无数 3D 体验提供支持，如落地页、VR 房间、游戏，甚至整个 3D 编辑器！
-   **[SVGLoader](https://threejs.org/docs/#examples/en/loaders/SVGLoader)**：它是 Three.js 中的一个加载器，用于加载 SVG 文件并将其转换为 Three.js 中的对象。Three.js 的 SVGLoader 可以帮助 Web 开发者将 SVG 文件导入到 Three.js 场景中，使得可以利用 Three.js 的强大功能对 SVG 文件进行渲染、处理和交互。

  


我们以 Vite 构建工具为例。首先使用 Vite 构建一个原生的 JavaScript 项目：

  


```
pnpm create vite 
```

  


并根据 Vite 相关的提示，完成 项目的初始化工作：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/664a728fcf1b49409f7f99511a373b70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1910&h=1014&s=190981&e=jpg&b=fefdfd)

  


项目初始化完成之后，需要先安装 Three.js：

  


```
pnpm install -D three  
```

  


然后执行：

  


```
pnpm run dev
```

  


通过这几行代码，开发环境就设置好了。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f62bd85b6e7b436fbb8314545e7d4afc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3352&h=1806&s=199098&e=jpg&b=ffffff)

  


接下来，我们将对默认的 HTML 和 CSS 文件做一些调整：

  


```HTML
<!-- index.html -->
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SVG in WebGL</title>
    </head>
    <body>
        <div id="app"></div>
        <div class="controls">
          <label for="focus">Focus:</label>
          <input type="range" min="1" max="50" id="focus" name="focus" />
          </div>
        <script type="module" src="/main.js"></script>
    </body>
</html>
```

  


```CSS
/* style.css */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100vw;
    min-height: 100vh;
    display: grid;
    gap: 1rem;
    place-content: center;
}

body {
    grid-template-rows: minmax(0, 1fr) min-content;
    gap: 1rem;
    padding: 1rem;
}

#app {
    display: grid;
    place-content: center;
    width: 100vw;
}

.controls {
    position: fixed;
    bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 0.25em;
    padding: 1vh 3vh;
    color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: rgb(125 155 125 / 0.5);
    place-self: center;
}

input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    border-radius: 5px;
    background: rgb(0 0 0);
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
}

input[type="range"]::-webkit-slider-thumb:hover {
    background: #333;
    transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    transition: background 0.15s ease-in-out;
}

input[type="range"]::-moz-range-thumb:hover {
    background: #d4d4d4;
}

label {
    white-space: nowrap;
}
```

  


在 HTML 中，添加了一个 `type` 为 `range` 的 `<input>` 元素，用来控制 SVG 挤出的程度。然后，使用 CSS 美化控制件的样式，并且调整整个页面的布局。

  


这样做之后，就可以使用 JavaScript 开始构建 Three.js 场景。

  


首先从 `main.js` 着手，在项目的 `main.js` 文件中添加以下代码：

  


```JavaScript
// main.js
import './style.css'

import { setupScene } from "./scene";
import { renderSVG } from "./svg";
import { svg } from "./example";

const defaultExtrusion = 1;
const app = document.querySelector("#app");
const extrusionInput = document.querySelector("#focus");
const scene = setupScene(app);
const { object, update } = renderSVG(defaultExtrusion, svg);

scene.add(object);

extrusionInput.addEventListener("input", () => {
    update(Number(extrusionInput.value));
});
extrusionInput.value = defaultExtrusion;
```

  


这段代码展示了如何将 SVG 图形加载到 WebGL 场景中，并根据用户输入动态调整其挤出深度。以下是代码的详细解释：

  


```JavaScript
// main.js
import { setupScene } from "./scene";
import { renderSVG } from "./svg";
import { svg } from "./example";
```

  


从其他模块导入了 `setupScene`、`renderSVG` 和 `svg`。这些模块分别用于设置 WebGL 场景、渲染 SVG 图形和提供 SVG 数据。

  


紧接着初始化常量和变量：

  


```JavaScript
// 默认的挤出深度
const defaultExtrusion = 1;

// DOM 中的一个容器元素，用于显示 WebGL 场景
const app = document.querySelector("#app");

// input 元素，用户可以通过它调整挤出深度
const extrusionInput = document.querySelector("#focus");

// 通过 setupScene 函数设置的 WebGL 场景
const scene = setupScene(app);

// 通过 renderSVG 函数渲染的 SVG 对象和用于更新挤出深度的函数
const { object, update } = renderSVG(defaultExtrusion, svg);
```

  


然后再将渲染的 SVG 对象添加到 WebGL 场景中：

  


```JavaScript
scene.add(object);
```

  


最后给 `input` 添加一个 `input` 监听事件，当用户更改输入值时，调用 `update` 函数，传递新的挤出深度。并且初始化 `extrusionInput` 的值为 `defaultExtrusion`。

  


```JavaScript
extrusionInput.addEventListener("input", () => {
    update(Number(extrusionInput.value));
});
extrusionInput.value = defaultExtrusion;
```

  


此时，你在浏览器中将看不到任何效果，甚至在浏览器控制台上会有相关的报错信息。这是因为整个程序还没有完善。

在继续编码之前，请在项目中创建三个新的 JavaScript 文件：

  


-   `scene.js` ：创建一个 `setupScene` 函数，这个函数可能初始化一个 Three.js 场景，包括摄像机、渲染器和其他必要的设置。通过传入的 `app` 元素，将渲染器的输出附加到该元素中。
-   `svg.js` ：创建一个 `renderSVG` 函数，这个函数可能使用 `SVGLoader` 将 SVG 数据转换为 Three.js 对象，然后将这些对象挤出一定深度（由 `defaultExtrusion` 指定）。返回的 `object` 是一个包含 SVG 形状的 Three.js 对象，而 `update` 是一个函数，用于更新挤出深度。
-   `example.js` ：提供 SVG 数据。

  


我们从最简单的 `example.js` 开始。首先使用诸如 Figma 之类的图形设计软件，设计一个符合你需求的 SVG 矢量图，并导出相应的 SVG 代码：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cedd6486227f48aca0668999d72acbc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1678&h=900&s=1021670&e=gif&f=145&b=f7f7f7)

  


然后使用 [SVGOMG](https://jakearchibald.github.io/svgomg/) 对导出的 SVG 代码进行优化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86ac7493618a486d97d10f7ed2a4e3b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3358&h=1782&s=1466861&e=jpg&b=2f2e2e)

  


将优化后的 SVG 代码放在 `example.js` 文件中：

  


```JavaScript
// example.js
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="219" fill="none"><path fill="#050505" fill-rule="evenodd" d="M189.448 12.738 169.706 0l-19.743 12.738-24.179-9.007-13.961 15.602-26.969-4.663-7.227 17.402H49.706v18.016l-26.97 4.662 7.227 17.4L5.78 81.16l13.961 15.602L0 109.5l19.744 12.739-13.96 15.601 24.18 9.008-7.226 17.402 26.968 4.662v18.016h27.921l7.226 17.402 26.969-4.662 13.959 15.601 24.181-9.008L169.706 219l19.743-12.739 24.181 9.008 13.96-15.602 26.97 4.663 7.226-17.402h27.92v-18.015l26.97-4.663-7.227-17.402 24.178-9.008-13.959-15.601 19.743-12.739-19.742-12.738 13.961-15.603-24.18-9.008 7.226-17.401-26.97-4.663V32.072h-27.921l-7.226-17.401-26.97 4.663L213.627 3.73l-24.179 9.007Z" clip-rule="evenodd"/><path fill="#fff" d="M34.8 126.65c-1.633 0-3.15-.233-4.55-.7-1.367-.5-2.467-1.183-3.3-2.05-.833-.867-1.25-1.883-1.25-3.05 0-.767.183-1.433.55-2 .367-.6.867-.9 1.5-.9.4 0 .817.15 1.25.45.833.733 1.9 1.383 3.2 1.95 1.333.533 2.75.8 4.25.8 1.967 0 3.567-.383 4.8-1.15 1.267-.8 1.9-1.867 1.9-3.2 0-1.267-.583-2.183-1.75-2.75-1.167-.567-2.783-1.1-4.85-1.6a32.896 32.896 0 0 1-4.45-1.4c-1.4-.567-2.567-1.35-3.5-2.35-.9-1.033-1.35-2.4-1.35-4.1 0-1.3.283-2.583.85-3.85.567-1.3 1.4-2.483 2.5-3.55 1.1-1.067 2.433-1.917 4-2.55 1.567-.667 3.333-1 5.3-1 1.467 0 2.8.167 4 .5 1.233.333 2.2.8 2.9 1.4.733.6 1.1 1.333 1.1 2.2 0 .667-.183 1.25-.55 1.75-.367.5-.8.9-1.3 1.2-.5.267-.933.4-1.3.4-.333 0-.783-.15-1.35-.45-.933-.5-1.983-.883-3.15-1.15-1.133-.3-2.133-.45-3-.45-1.633 0-2.967.367-4 1.1-1 .7-1.5 1.533-1.5 2.5 0 1.067.633 1.967 1.9 2.7 1.3.7 3.617 1.45 6.95 2.25 2.267.6 4.033 1.433 5.3 2.5 1.267 1.033 1.9 2.683 1.9 4.95 0 2.033-.55 3.933-1.65 5.7-1.067 1.767-2.583 3.2-4.55 4.3-1.933 1.067-4.2 1.6-6.8 1.6Zm26.907.15c-1.133 0-2.017-.367-2.65-1.1-.6-.767-.95-2.083-1.05-3.95a56.847 56.847 0 0 0-.5-5.85 42.587 42.587 0 0 0-1-5.5c-.567-2.467-1.333-4.733-2.3-6.8-.933-2.1-2.233-3.817-3.9-5.15a5.955 5.955 0 0 1-.65-.65 1.424 1.424 0 0 1-.25-.85c0-.733.367-1.433 1.1-2.1.767-.667 1.65-1 2.65-1 1.167 0 2.167.483 3 1.45.833.967 1.583 2.317 2.25 4.05 1.133 2.733 1.95 5.8 2.45 9.2.533 3.367.833 6.617.9 9.75.033.933.167 1.567.4 1.9.233.3.633.45 1.2.45 1.2 0 2.367-.467 3.5-1.4 1.167-.933 2.217-2.2 3.15-3.8.967-1.6 1.733-3.417 2.3-5.45.567-2.033.85-4.167.85-6.4 0-1.367-.1-2.467-.3-3.3-.167-.867-.367-1.55-.6-2.05-.3-.667-.45-1.2-.45-1.6 0-.5.233-.967.7-1.4.467-.433 1-.783 1.6-1.05.633-.3 1.2-.45 1.7-.45.667 0 1.15.25 1.45.75.3.467.5 1.067.6 1.8.1.733.15 1.483.15 2.25 0 2.3-.267 4.733-.8 7.3s-1.3 5.1-2.3 7.6c-.967 2.467-2.133 4.717-3.5 6.75-1.333 2-2.817 3.6-4.45 4.8-1.633 1.2-3.383 1.8-5.25 1.8Zm32.332-.15c-2.3 0-4.367-.517-6.2-1.55-1.834-1.033-3.284-2.533-4.35-4.5-1.067-1.967-1.6-4.35-1.6-7.15 0-2.533.416-4.967 1.25-7.3a21.045 21.045 0 0 1 3.65-6.35c1.566-1.9 3.466-3.4 5.7-4.5 2.233-1.1 4.716-1.65 7.45-1.65 2 0 3.666.317 5 .95 1.333.633 2 1.567 2 2.8 0 .6-.167 1.2-.5 1.8-.3.567-.7 1.05-1.2 1.45-.5.4-1.017.6-1.55.6-.334 0-.6-.083-.8-.25-1.734-1.167-3.7-1.75-5.9-1.75-2.334 0-4.3.55-5.9 1.65-1.6 1.067-2.817 2.483-3.65 4.25-.8 1.767-1.2 3.683-1.2 5.75 0 3.1.866 5.567 2.6 7.4 1.766 1.833 4.116 2.75 7.05 2.75 1.266 0 2.45-.183 3.55-.55 1.1-.367 2-.9 2.7-1.6.7-.7 1.05-1.55 1.05-2.55 0-1-.3-1.767-.9-2.3-.6-.533-1.384-.917-2.35-1.15a15.189 15.189 0 0 0-3.15-.5c-.8-.067-1.4-.167-1.8-.3-.367-.133-.55-.533-.55-1.2 0-.8.25-1.467.75-2a2.805 2.805 0 0 1 1.85-.9c1-.1 2.2-.167 3.6-.2 1.4-.067 2.85-.1 4.35-.1 1.533-.033 2.966-.05 4.3-.05.433 0 .766.083 1 .25.233.133.35.433.35.9 0 .567-.134 1.183-.4 1.85a4.799 4.799 0 0 1-1 1.7c-.434.467-.934.7-1.5.7h-.8c.1.333.183.717.25 1.15.1.4.15.867.15 1.4 0 1.467-.35 2.867-1.05 4.2-.7 1.3-1.667 2.467-2.9 3.5-1.234 1.033-2.65 1.85-4.25 2.45-1.6.6-3.3.9-5.1.9Zm42.307 0c-2.9 0-5.25-.767-7.05-2.3-1.766-1.567-2.65-3.683-2.65-6.35 0-2.5.734-4.633 2.2-6.4 1.5-1.767 3.467-3.2 5.9-4.3-.366-1-.683-1.983-.95-2.95a12.338 12.338 0 0 1-.35-2.9c0-1.667.367-3.067 1.1-4.2.734-1.167 1.684-2.05 2.85-2.65 1.167-.6 2.4-.9 3.7-.9 1.234 0 2.35.25 3.35.75a6.253 6.253 0 0 1 2.5 2.15c.634.933.95 2.05.95 3.35 0 1.367-.366 2.6-1.1 3.7-.7 1.067-1.666 2.033-2.9 2.9-1.2.833-2.55 1.583-4.05 2.25.867 1.5 1.884 3.05 3.05 4.65 1.167 1.567 2.35 2.933 3.55 4.1.9-.8 1.634-1.633 2.2-2.5.567-.867.85-1.75.85-2.65 0-.667-.166-1.1-.5-1.3a2.9 2.9 0 0 0-.95-.5 5.442 5.442 0 0 1-.95-.4c-.2-.167-.3-.433-.3-.8 0-.6.2-1.233.6-1.9.4-.7.917-1.3 1.55-1.8.634-.5 1.317-.75 2.05-.75.667 0 1.267.317 1.8.95.534.6.8 1.75.8 3.45 0 1.7-.35 3.417-1.05 5.15-.666 1.733-1.75 3.45-3.25 5.15.867.567 1.7.85 2.5.85.6 0 1.05-.1 1.35-.3.3-.2.567-.417.8-.65.167-.167.334-.3.5-.4.167-.1.367-.15.6-.15.9 0 1.35.683 1.35 2.05 0 .767-.2 1.583-.6 2.45-.366.833-.95 1.533-1.75 2.1-.8.567-1.85.85-3.15.85-1.166 0-2.216-.25-3.15-.75-.9-.5-1.783-1.183-2.65-2.05a17.363 17.363 0 0 1-4.15 2.25c-1.4.5-2.933.75-4.6.75Zm2-20.8c1.4-.667 2.534-1.383 3.4-2.15.9-.767 1.35-1.6 1.35-2.5 0-.667-.233-1.217-.7-1.65-.466-.467-1.133-.7-2-.7-.9 0-1.616.3-2.15.9-.533.567-.8 1.35-.8 2.35 0 .467.067 1.033.2 1.7.167.667.4 1.35.7 2.05Zm-1.25 15.5c.767 0 1.584-.083 2.45-.25.9-.167 1.734-.417 2.5-.75a51.933 51.933 0 0 1-2.15-3.1 85.01 85.01 0 0 1-2.2-3.75 71.566 71.566 0 0 1-1.6-3.2c-1.566.733-2.8 1.65-3.7 2.75-.866 1.067-1.3 2.233-1.3 3.5 0 1.433.55 2.6 1.65 3.5 1.1.867 2.55 1.3 4.35 1.3Zm43.886 5.35c-1.133 0-2.016-.317-2.65-.95-.6-.667-.933-1.917-1-3.75a84.393 84.393 0 0 0-.3-5.85 45.24 45.24 0 0 0-.8-5.5c-.5-2.533-1.183-4.817-2.05-6.85-.866-2.033-2.083-3.783-3.65-5.25a6.183 6.183 0 0 1-.65-.75c-.166-.233-.25-.5-.25-.8 0-.7.367-1.367 1.1-2 .734-.667 1.6-1 2.6-1 1.167 0 2.167.5 3 1.5.834 1 1.55 2.4 2.15 4.2.7 1.833 1.25 3.833 1.65 6 .4 2.167.667 4.383.8 6.65.167 2.233.25 4.4.25 6.5 0 .733.1 1.217.3 1.45.2.233.55.35 1.05.35 1.1 0 2.184-.333 3.25-1 1.1-.667 2.084-1.567 2.95-2.7.9-1.167 1.617-2.45 2.15-3.85.534-1.4.817-2.817.85-4.25.034-1.5-.233-2.95-.8-4.35-.533-1.433-1.233-2.65-2.1-3.65a7.187 7.187 0 0 1-.55-.7c-.1-.233-.15-.467-.15-.7 0-.533.217-1.05.65-1.55.434-.5.934-.917 1.5-1.25.567-.333 1.05-.5 1.45-.5.834 0 1.534.617 2.1 1.85.6 1.2 1.1 2.667 1.5 4.4.567 2.2.967 4.667 1.2 7.4.234 2.733.35 5.617.35 8.65 0 .833.084 1.4.25 1.7.167.3.534.45 1.1.45 1.2 0 2.367-.433 3.5-1.3 1.134-.867 2.134-2.05 3-3.55.9-1.533 1.6-3.267 2.1-5.2.534-1.967.8-4.033.8-6.2 0-1.633-.133-2.95-.4-3.95-.233-1.033-.466-1.767-.7-2.2-.333-.633-.5-1.167-.5-1.6 0-.5.217-.967.65-1.4a5.862 5.862 0 0 1 1.65-1.15c.634-.3 1.184-.45 1.65-.45.734 0 1.25.317 1.55.95.334.6.534 1.35.6 2.25.1.9.15 1.75.15 2.55 0 2.3-.25 4.717-.75 7.25-.466 2.5-1.15 4.95-2.05 7.35-.9 2.367-1.983 4.517-3.25 6.45-1.233 1.9-2.633 3.433-4.2 4.6-1.566 1.133-3.25 1.7-5.05 1.7-1.2 0-2.083-.267-2.65-.8-.566-.533-.933-1.283-1.1-2.25-.166-.967-.25-2.1-.25-3.4v-2.15c.034-.7.05-1.333.05-1.9-1.533 3.433-3.383 6.05-5.55 7.85-2.166 1.767-4.333 2.65-6.5 2.65Zm40.145-.05c-2.533 0-4.517-.717-5.95-2.15-1.4-1.467-2.1-3.5-2.1-6.1 0-2.367.517-4.517 1.55-6.45 1.033-1.933 2.417-3.467 4.15-4.6 1.767-1.167 3.7-1.75 5.8-1.75 2 0 3.6.5 4.8 1.5 1.2.967 1.8 2.267 1.8 3.9 0 1.3-.4 2.5-1.2 3.6-.8 1.1-1.867 1.983-3.2 2.65-1.333.633-2.817.95-4.45.95-2 0-3.633-.45-4.9-1.35.033 1.533.55 2.767 1.55 3.7 1.033.933 2.35 1.4 3.95 1.4a9.3 9.3 0 0 0 2.95-.5c1.033-.367 1.917-.85 2.65-1.45.467-.4.9-.6 1.3-.6.333 0 .6.117.8.35.233.2.35.467.35.8 0 .733-.633 1.7-1.9 2.9-2.233 2.133-4.883 3.2-7.95 3.2Zm.75-11.75c1.2 0 2.2-.25 3-.75.8-.5 1.2-1.133 1.2-1.9 0-.633-.267-1.117-.8-1.45-.533-.367-1.267-.55-2.2-.55-1.233 0-2.317.333-3.25 1-.9.633-1.55 1.533-1.95 2.7.467.3 1.067.533 1.8.7a9.88 9.88 0 0 0 2.2.25Zm22.838 11.75c-1.233 0-2.3-.217-3.2-.65a8.765 8.765 0 0 1-2.3-1.65 7.693 7.693 0 0 1-1.2 1.55c-.433.433-.933.65-1.5.65-.367 0-.717-.117-1.05-.35-.333-.2-.467-.483-.4-.85.5-2.667.917-5.367 1.25-8.1.367-2.733.55-5.517.55-8.35 0-2.367-.083-4.583-.25-6.65-.167-2.067-.683-3.967-1.55-5.7-.167-.333-.317-.65-.45-.95-.1-.3-.15-.583-.15-.85 0-.633.367-1.25 1.1-1.85.733-.6 1.517-.9 2.35-.9 1.2 0 2.017.733 2.45 2.2.433 1.467.65 3.633.65 6.5 0 2.433-.117 4.667-.35 6.7-.2 2-.433 3.717-.7 5.15.933-1.967 2.2-3.617 3.8-4.95 1.633-1.367 3.467-2.05 5.5-2.05s3.617.683 4.75 2.05c1.167 1.333 1.75 3.15 1.75 5.45 0 1.7-.267 3.367-.8 5a15.374 15.374 0 0 1-2.25 4.35 11.094 11.094 0 0 1-3.5 3.1c-1.333.767-2.833 1.15-4.5 1.15Zm1.15-5.4c1.9 0 3.367-.6 4.4-1.8 1.033-1.2 1.55-2.583 1.55-4.15 0-1.367-.383-2.417-1.15-3.15-.733-.767-1.717-1.15-2.95-1.15a5.167 5.167 0 0 0-3.3 1.15c-.967.733-1.783 1.717-2.45 2.95a16.71 16.71 0 0 0-1.55 3.9 8.55 8.55 0 0 0 2.55 1.7 8.12 8.12 0 0 0 2.9.55Zm26.25 5.4c-2.3 0-4.367-.517-6.2-1.55-1.833-1.033-3.283-2.533-4.35-4.5-1.067-1.967-1.6-4.35-1.6-7.15 0-2.533.417-4.967 1.25-7.3.867-2.367 2.083-4.483 3.65-6.35a17.09 17.09 0 0 1 5.7-4.5c2.233-1.1 4.717-1.65 7.45-1.65 2 0 3.667.317 5 .95 1.333.633 2 1.567 2 2.8 0 .6-.167 1.2-.5 1.8-.3.567-.7 1.05-1.2 1.45-.5.4-1.017.6-1.55.6-.333 0-.6-.083-.8-.25-1.733-1.167-3.7-1.75-5.9-1.75-2.333 0-4.3.55-5.9 1.65a10.274 10.274 0 0 0-3.65 4.25c-.8 1.767-1.2 3.683-1.2 5.75 0 3.1.867 5.567 2.6 7.4 1.767 1.833 4.117 2.75 7.05 2.75 1.267 0 2.45-.183 3.55-.55 1.1-.367 2-.9 2.7-1.6.7-.7 1.05-1.55 1.05-2.55 0-1-.3-1.767-.9-2.3-.6-.533-1.383-.917-2.35-1.15a15.195 15.195 0 0 0-3.15-.5c-.8-.067-1.4-.167-1.8-.3-.367-.133-.55-.533-.55-1.2 0-.8.25-1.467.75-2a2.806 2.806 0 0 1 1.85-.9c1-.1 2.2-.167 3.6-.2 1.4-.067 2.85-.1 4.35-.1 1.533-.033 2.967-.05 4.3-.05.433 0 .767.083 1 .25.233.133.35.433.35.9 0 .567-.133 1.183-.4 1.85a4.784 4.784 0 0 1-1 1.7c-.433.467-.933.7-1.5.7h-.8c.1.333.183.717.25 1.15.1.4.15.867.15 1.4 0 1.467-.35 2.867-1.05 4.2-.7 1.3-1.667 2.467-2.9 3.5-1.233 1.033-2.65 1.85-4.25 2.45-1.6.6-3.3.9-5.1.9Zm29.231 0c-2.267 0-4.017-.25-5.25-.75-1.233-.5-2.083-1.2-2.55-2.1-.467-.9-.7-1.967-.7-3.2 0-.6.05-1.267.15-2 .1-.767.217-1.633.35-2.6.6-3.667.9-6.917.9-9.75 0-1.867-.083-3.45-.25-4.75-.133-1.333-.567-2.6-1.3-3.8-.133-.2-.25-.4-.35-.6-.1-.233-.15-.417-.15-.55 0-.4.233-.817.7-1.25a6.23 6.23 0 0 1 1.7-1.1c.667-.3 1.3-.45 1.9-.45 1.133 0 1.833.45 2.1 1.35.3.9.45 2.183.45 3.85 0 .633-.067 1.65-.2 3.05a199.211 199.211 0 0 1-.6 5.25c-.267 2.067-.467 3.85-.6 5.35-.133 1.5-.2 2.7-.2 3.6 0 1.333.15 2.35.45 3.05.333.667.867 1.133 1.6 1.4.733.267 1.767.4 3.1.4 1.433 0 2.8-.117 4.1-.35 1.3-.267 2.567-.667 3.8-1.2.167-.067.317-.117.45-.15.133-.033.25-.05.35-.05.3 0 .583.183.85.55.267.367.4.883.4 1.55 0 1.467-.8 2.617-2.4 3.45-2.133 1.2-5.067 1.8-8.8 1.8Z"/></svg>`;
export { svg };
```

  


这样，你就得到了 `svg` 模块。

  


在这之后，将重点放到 `svg.js` 上，使用 `SVGLoader` 将 SVG 数据解析为 WebGL 对象，并根据用户输入的挤出深度动态更新这些对象：

  


```JavaScript
// svg.js

// 导入模块
// 导入 Three.js 库的所有功能
import * as THREE from "three"; 
// 导入 SVG 加载器，用于解析 SVG 文件
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

// 材质定义
// 用于填充 SVG 图形的材质
const fillMaterial = new THREE.MeshBasicMaterial({ color: "#F3FBFB" });
// 用于绘制 SVG 图形边缘的材质
const stokeMaterial = new THREE.LineBasicMaterial({
    color: "#00A5E6",
});

// renderSVG 函数,用于解析 SVG 数据并创建相应的 Three.js 对象
const renderSVG = (extrusion, svg) => {
    // SVGLoader 实例，用于解析 SVG 数据
    const loader = new SVGLoader();
    
    // 解析后的 SVG 数据
    const svgData = loader.parse(svg);
    
    // 一个 Three.js 组对象，用于包含所有生成的 Three.js 对象
    const svgGroup = new THREE.Group();
    
    // 存储更新挤出深度时所需的对象信息
    const updateMap = [];

    // 解析 SVG 路径并创建对象
    // 将 SVG 组对象的 Y 轴缩放反转，适应 Three.js 坐标系
    svgGroup.scale.y *= -1;
    
    // 遍历每个 SVG 路径
    svgData.paths.forEach((path) => {
        // 将路径转换为形状数组
        const shapes = SVGLoader.createShapes(path);
    
        shapes.forEach((shape) => {
            // 使用挤出几何体创建形状
            const meshGeometry = new THREE.ExtrudeGeometry(shape, {
                depth: extrusion,
                bevelEnabled: false,
            });
            
            // 创建几何体边缘
            const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
            
            // 创建填充网格
            const mesh = new THREE.Mesh(meshGeometry, fillMaterial);
            
            // 创建边缘线段
            const lines = new THREE.LineSegments(linesGeometry, stokeMaterial);
    
            // 将形状、网格和线段信息添加到更新映射中
            updateMap.push({ shape, mesh, lines });
            
            // 将网格和线段添加到 SVG 组对象中
            svgGroup.add(mesh, lines);
        });
    });

    // 调整和居中对象
    // 计算 SVG 组对象的包围盒
    const box = new THREE.Box3().setFromObject(svgGroup);
    
    // 获取包围盒的尺寸
    const size = box.getSize(new THREE.Vector3());
    
    // 计算偏移量以居中对象
    const yOffset = size.y / -2;
    const xOffset = size.x / -2;

    // 调整组中每个对象的位置
    svgGroup.children.forEach((item) => {
        item.position.x = xOffset;
        item.position.y = yOffset;
    });
    
    // 将整个组对象绕 X 轴旋转，使其平铺在地面上
    svgGroup.rotateX(-Math.PI / 2);

    // 返回对象和更新函数
    return {
        // 返回一个包含 SVG 组对象
        object: svgGroup,
        
        // 更新挤出深度函数
        update(extrusion) {
            // 遍历 updateMap 数组，重新创建挤出几何体和边缘几何体
            updateMap.forEach((updateDetails) => {
                const meshGeometry = new THREE.ExtrudeGeometry(updateDetails.shape, {
                    depth: extrusion,
                    bevelEnabled: false,
                });
                const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
                
                // 释放旧的几何体资源 (dispose)，并将新的几何体赋值给网格和线段对象
                updateDetails.mesh.geometry.dispose();
                updateDetails.lines.geometry.dispose();
                updateDetails.mesh.geometry = meshGeometry;
                updateDetails.lines.geometry = linesGeometry;
            });
        },
    };
};

// 将 renderSVG 函数导出，以便在其他模块中使用
export { renderSVG };
```

  


这里简单解释一下 `SVGLoader` ，它是 Three.js 的一个 `Loader` 类实例，继承并扩展了其方法和属性，最显著的是 `load()` 、`loadAsync()` 和 `parse()` 。这三个方法负责 `SVGLoader` 的大部分功能。它们都以不同的方式产生 `ShapePath` 实例的数组。

  


-   使用回调函数同步加载 SVG。
-   使用 Promise 异步加载 SVG。
-   直接解析已有的 SVG 数据字符串。



```JavaScript
// 导入和初始化 SVGLoader,
// 创建一个 SVGLoader 实例，用于加载和解析 SVG 数据
const loader = new SVGLoader();
const svgUrl = "..."; //SVG URL
const svg = "..."; // SVG data

// 使用回调函数加载 SVG
loader.load(svgUrl, (data) => {
  const shapePaths = data.paths;
  // ...
});


// 使用 Promise 进行异步加载
loader.loadAsync(svgUrl).then((data) => {
  const shapePaths = data.paths;
  // ...
});

// 解析现有的 SVG 数据字符串
const data = loader.parse(svg);
const shapePaths = data.paths;
```

所有方法的最终结果是一个包含路径数组的 `data` 对象，这些路径可以进一步处理或转换为 Three.js 的几何体，以在 WebGL 场景中使用。要点在于，当使用 `SVGLoader` 时，你始终会使用这些方法中的至少一个，具体取决于你希望如何访问 SVG 数据。有关更详细的信息，[你可以参考官方文档](https://threejs.org/docs/#examples/en/loaders/SVGLoader)。

  


一旦获得了 `ShapePaths`，你就需要将它们转换为一组 `Shapes`。为此，你应该使用 `SVGLoader.createShapes()` 静态方法，如下所示：

  


```JavaScript
shapePaths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path);
    // ...
});
```

  


其他相关的就不在这里解释了，具体的可以参阅示例代码中的注释。

  


现在万事俱备，只需在 `scene.js` 中创建 Three.js 场景。在这里将定义了一个函数 `setupScene`，用于设置和初始化一个 Three.js 场景，并导出了该函数。它包括创建场景、渲染器、摄像机、光源、控制器以及一个动画循环。下面是对代码的详细解释：

  


```JavaScript
// scene.js 

// 导入模块
// 从 three 包中导入所有的 Three.js 模块
import * as THREE from "three";

// 从 three/examples/jsm/controls/OrbitControls 导入 OrbitControls，用于控制摄像机的交互
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 定义一个名为 setupScene 的函数，接受一个 DOM 元素 container 作为参数，用于将 Three.js 渲染器附加到该元素上。
const setupScene = (container) => {
    // 创建一个新的 Three.js 场景对象
    const scene = new THREE.Scene();
    
    // 创建一个 WebGL 渲染器，启用抗锯齿（antialias: true）和透明背景（alpha: true）
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // 创建摄像机:创建一个透视摄像机
    const camera = new THREE.PerspectiveCamera(
        50, // 视角为 50 度
        window.innerWidth / window.innerHeight, // 纵横比为窗口的宽高比
        0.01, // 近剪裁面为 0.01
        1e5   // 远剪裁面为 100,000
    );
    
    // 添加光源
    // 创建一个环境光源，颜色为 #888888，用于为整个场景提供基本的全局照明
    const ambientLight = new THREE.AmbientLight("#888888");
    
    // 创建一个点光源，颜色为 #ffffff，强度为 2，距离为 800
    const pointLight = new THREE.PointLight("#ffffff", 2, 800);
    
    // 设置轨道控制器
    // 创建一个轨道控制器，允许用户通过鼠标交互来旋转、缩放和平移摄像机。控制器绑定到摄像机和渲染器的 DOM 元素
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // 定义一个动画函数 animate，在每一帧中渲染场景并更新控制器
    // 使用 requestAnimationFrame 实现循环动画
    const animate = () => {
        renderer.render(scene, camera);
        controls.update();
    
        requestAnimationFrame(animate);
    };

    // 初始化渲染器和摄像机位置
    // 设置渲染器的尺寸为窗口的宽度和高度
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // 将光源添加到场景中
    scene.add(ambientLight, pointLight);
    
    // 设置摄像机的位置，使其位于 (50, 50, 50)
    camera.position.z = 50;
    camera.position.x = 50;
    camera.position.y = 50;
    
    // 禁用平移控制（即摄像机只能旋转和缩放，不能平移）
    controls.enablePan = false;

    // 将渲染器附加到 DOM 并处理窗口调整
    // 将渲染器的 DOM 元素附加到传入的容器元素上
    container.append(renderer.domElement);
    
    // 添加一个事件监听器，在窗口调整大小时更新摄像机的纵横比和渲染器的尺寸
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // 启动动画循环
    animate();
    
    // 返回场景对象
    return scene;
};

// 导出 setupScene 函数，以便在其他模块中使用
export { setupScene };
```

  


这个时候，你在浏览器中能看到一个类似下图的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b704b1dbbd2e47ef81551a9954ba7aad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1446&h=848&s=7344848&e=gif&f=301&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/GRaqKyN

当然，如果你对 WebGL 熟悉的话，那么可以通过增加额外的功能来增强其效果。例如，我们可以在 `scene.js` 中增加一个名为 `fitCameraToObject` 的函数，用于调整 Three.js 场景中的摄像机，使其适合查看给定的 3D 对象。该函数接受三个参数：`camera`（Three.js 摄像机对象）、`object`（要适应的 3D 对象）和 `controls`（轨道控制器对象）。

具体代码如下：

  


```JavaScript
// scene.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const setupScene = (container) => {
    // 查看前面的 scene.js
    
    // camera:场景中的摄像机
    // controls: 用于在 Three.js 场景中平移、缩放和旋转摄像机，使用户可以通过鼠标交互查看场景中的对象
    // scene: Three.js 场景
    return { camera, controls, scene };
}

// 用于调整 Three.js 场景中的摄像机，使其适合查看给定的 3D 对象
// camera（Three.js 摄像机对象）
// object（要适应的 3D 对象） 
// controls（轨道控制器对象）
const fitCameraToObject = (camera, object, controls) => {
    // 获取对象的边界框
    const boundingBox = new THREE.Box3().setFromObject(object);
    
    // 计算边界框的中心和大小
    // 获取边界框的中心点，并存储在 center 向量中
    const center = boundingBox.getCenter(new THREE.Vector3());
    
    // 取边界框的尺寸（宽、高、深），并存储在 size 向量中
    const size = boundingBox.getSize(new THREE.Vector3());
    
    // 计算摄像机的位置和距离
    // 定义一个偏移量 offset，用于在对象边缘外添加一些空间
    const offset = 1.25;
    
    // 计算对象的最大尺寸 maxDim，即对象的宽、高、深中的最大值
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // 计算摄像机的视场角 fov（从度转换为弧度）
    const fov = camera.fov * (Math.PI / 180);
    
    // 根据最大尺寸和视场角计算摄像机的 Z 轴位置 cameraZ，使用偏移量来增加一些额外的空间
    const cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2)) * offset;
    
    // 获取边界框的最小 Z 值 minZ
    const minZ = boundingBox.min.z;
    
    // 计算摄像机到对象最远边缘的距离 cameraToFarEdge，如果最小 Z 值小于 0，需要调整距离以确保对象完全在视野内
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;
  
    // 调整轨道控制器
    // 将轨道控制器的目标设置为对象的中心点 center
    controls.target = center;
    
    // 设置控制器的最大和最小距离，确保用户在缩放时不会把摄像机移动得离对象太远或太近
    controls.maxDistance = cameraToFarEdge * 2;
    controls.minDistance = cameraToFarEdge * 0.5;
    
    // 调用 saveState 方法保存当前的控制器状态
    controls.saveState();
    
    // 调整摄像机参数
    // 设置摄像机的 Z 轴位置，使其适合查看对象
    camera.position.z = cameraZ; 
    // 设置摄像机的远剪裁面 camera.far，确保摄像机能够渲染到对象的最远边缘
    camera.far = cameraToFarEdge * 3;
    // 调用 updateProjectionMatrix 方法更新摄像机的投影矩阵，以应用新的参数
    camera.updateProjectionMatrix();
};

// 导出 fitCameraToObject 和 setupScene 函数，以便在其他模块中使用
export { fitCameraToObject, setupScene };
```

  


新增的 `fitCameraToObject` 函数，通过计算 3D 对象的边界框，然后调整摄像机的位置、视距和轨道控制器的参数，确保摄像机能够适当地看到整个对象。这样，摄像机将位于适当的位置，并且用户可以通过轨道控制器平滑地缩放和旋转查看对象。

  


注意，`setupScene()` 函数也需要进行调整，以便轻松访问相机和控件实例。然后只需在 `index.html` 调整HTML 结构，即添加一个 `#focusButton` 按钮：

  


```HTML
<!-- index.html -->
<div id="app"></div>
<div class="forms">
    <button id="focusButton" class="button">Focus</button>
    <div class="controls">
        <input type="range" min="1" max="50" id="focus" name="focus" />
    </div>
</div>
```

  


重新调整布局相关的 CSS，使其符合你需要的效果。这里就不展示 CSS 代码了。

  


最后，还需要调整 `main.js` ，将新增的 `fitCameraToObject` 功能绑定到 `#focusButton` 按钮之上：

  


```JavaScript
import {fitCameraToObject, setupScene } from "./scene";
import { renderSVG } from "./svg";
import { svg } from "./example";

const defaultExtrusion = 1;
const app = document.querySelector("#app");
const extrusionInput = document.querySelector("#focus");
const focusButton = document.querySelector("#focusButton");
const { scene, camera, controls } = setupScene(app);
const { object, update } = renderSVG(defaultExtrusion, svg);

scene.add(object);

extrusionInput.addEventListener("input", () => {
    update(Number(extrusionInput.value));
});

focusButton.addEventListener("click", () => {
    fitCameraToObject(camera, object, controls);
});

extrusionInput.value = defaultExtrusion;
```

  


这就是我们如何向我们的 3D 应用程序添加焦点功能！

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5be4ae5d13bc4c3c91d10ff56a4f91f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1670&h=882&s=1552749&e=gif&f=146&b=f0f9fb)

  


> Demo 地址：https://codepen.io/airen/full/QWREWWZ

  


## 使用 React-three-fiber 拆分 SVG 并重用 WebGL 组件

  


接着，我们来看一个 SVG 和 WebGL 在 React 应用中的案例。在这个案例中，我们将学习如何使用 Three.js 和 React 将 SVG 在 3D 空间中拆分，并使用抽像方法将场景图分解为可复用的组件。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8573dcda87c4c58b8af560931133103~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1750&h=500&s=68550&e=jpg&b=e1d0cc)

  


在这个案例中，我们会依赖 `recat-three-fiber` 库，它是一个基于 React 的库，用于在 React 应用中使用 Three.js 创建和管理 3D 场景。它将 Three.js 的 API 映射到 React 组件，使得在 React 应用中可以更直观和组件化地处理 3D 图形。其主要特点是：

  


-   **组件化**：将 3D 对象、灯光、相机等封装成 React 组件，使得代码更易于管理和重用。
-   **声明式**：通过 JSX 语法声明 3D 场景和对象，而不是通过 Imperative（命令式）代码创建和修改场景。
-   **与 React 生态系统集成**：可以利用 React 的状态管理、生命周期方法、上下文等特性来控制和管理 3D 场景。

不过，在我们这个示例中，将向大家演示如何使用 `react-three-fiber` 提供的 `declarative` 方式来管理 Three.js 场景和对象，使得代码更具可读性和可维护性。通过创建可复用的组件，我们可以更加灵活地构建复杂的 3D 应用。

  


和前面的示例一样，我们通过 Vite 来初始化一个 React 应用，并且安装相关的依赖项：

  


```
pnpm create vite
pnpm three @react-three/fiber @react-three/drei -D
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93f21e37719740eca2c52e5175e5c433~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1904&h=1484&s=379072&e=jpg&b=fefdfd)

  


安装完成相关依赖，执行 `pnpm run dev` ，你在浏览器会看到像下图这样的一个界面：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/427481dbbf514057a63021da6350c226~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3344&h=1914&s=228898&e=jpg&b=ffffff)

  


这表示 React 项目初始化已完成。项目初始化完成之后，需要安装相关的依赖项：

  


```
pnpm install -D three @react-three/fiber @react-three/drei @react-three/fiber @react-three/flex @types/three
```

  


现在，我们就可以在 Vite React 应用上开始使用 `react-three-fiber` 。首先，我们调整项目的 `App.tsx` 文件，删除默认的内容：

  


```JavaScript
import "./App.css";

export default function App() {
    return (
        <div className="app">
            
        </div>
    );
}
```

  


```CSS
.app {
    width: 100vw;
    height: 100vh;
}
```

  


现在，页面一片空白，什么都没有！

  


接下来，我们从创建一个简单的 Three.js 场景开始，并设置基础的照明和相机。整个场景是通过 `react-three-fiber` 创建的，并且将创建 Three.js 场景所需要的代码放置在一个名为 `Scene.tsx` 文件中：

  


```JavaScript
// Scene.tsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export default function Scene() {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <OrbitControls />
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
            />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <directionalLight position={[10, 10, 10]} />
          
        </Canvas>
    );
}
```

  


我们从导入模块开始，简单解释一下上面的代码：

  


```JavaScript
// 从 react-three-fiber 中导入 Canvas 组件，用于在 React 中创建 Three.js 场景
import { Canvas } from "@react-three/fiber";

// OrbitControls 用于添加轨道控制（例如，旋转、缩放和平移）
// PerspectiveCamera 用于设置透视摄像机
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
```

  


整个 3D 场景功能都放置在 `Scene` 组件中，它包含了不同类型的灯光源。`PerspectiveCamera` 和 `OrbitControls` 用于控制视角和摄像机移动。所有的灯光设置和摄像机配置使得场景中的物体（如 SVG 图形）可以被清晰地看到和交互。

  


```JavaScript
export default function Scene() {
    return (
        // 创建 Three.js 场景的根组件
        <Canvas>
            //  设置一个默认的透视摄像机，位置为 (0, 0, 10)
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            
            // 为摄像机添加轨道控制 
            <OrbitControls />
            
            // 添加一个环境光源，强度为 Math.PI / 2
            <ambientLight intensity={Math.PI / 2} />
            
            // 添加一个聚光灯，设置了位置、角度、半影、衰减和强度
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
            />
            
            // 添加一个点光源，设置了位置、衰减和强度
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            
            // 添加一个方向光，设置了位置
            <directionalLight position={[10, 10, 10]} />
        </Canvas>
    );
}
```

  


然后，可以在 `App.tsx` 中引入这个新创建的 3D 场景，即 `Scene` 组件：

  


```JavaScript
// App.tsx
import "./App.css";
import Scene from "./Scene";

export default function App() {
    return (
        <div className="app">
            <Scene />
        </div>
    );
}
```

  


到目前为止，整个 3D 场景只有不同类型的灯光源和摄像机，页面依然还是空白。我们需要往场景中添加实物，这个实物就是 SVG 图形。因此，我们创建一个 `SVGMesh.tsx` 文件，主要用于处理 `SVGMesh` 组件相关的事情。

  


假设，在你的项目的 `public` 文件夹下有一个名为 `lvup_icon.svg` 的 SVG 文件，它是一只老虎的图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0721b297810c4c15b52fa6176ee32faa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=885&s=281022&e=jpg&b=000000)

  


在用于项目时，请记得使用[ SVGOMG 工具](https://jakearchibald.github.io/svgomg/)做一些优化，使 SVG 变得干净一些：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9d6126742d464093ff1595ae4c9f65~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3358&h=1786&s=1697687&e=jpg&b=2f2e2e)

  


> SVGOMG：https://jakearchibald.github.io/svgomg/

  


为了能体验 3D 场景的灯光效果，请尽可能使用一张颜色多样的 SVG 文件。

  


我们这节课的目标是将 SVG 图形融入到 WebGL 中，通过 WebGL 创建更高级的图形。与上一个示例一样，我们需要使用 SVGLoader 来提取 SVG 路径，因为有了这些路径，就可以以各种有趣的方式显示它们。

  


在这里，我们将使用 Three.js 的 SVGLoader 和 `@react-three/fiber` 库来加载和显示一个 SVG 图像，并将其转换为 3D 形状。

  


在 `SVGMesh.tsx` 中导入所需要的功能模块：

  


```JavaScript
// SVGMesh.tsx

// 这是一个将 Three.js 集成到 React 中的库。useLoader 是一个钩子，用于加载资源
import { useLoader } from "@react-three/fiber";

// React 的一个钩子，用于性能优化，通过记住计算结果来避免不必要的重新计算
import { useMemo } from "react";

// Three.js 的核心库，用于创建和显示 3D 图形
import * as T from "three";

// Three.js 的一个加载器，用于加载和解析 SVG 文件
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
```

  


接着在 `SVGMesh` 组件中使用 SVGLoader 加载 SVG 文件，并提取其路径：

  


```JavaScript
// SVGMesh.tsx

// 创建 SVGMesh 组件
const SVGMesh = (props) => {
    // 使用 SVGLoader 加载指定路径的 SVG 文件，返回 svgData
    const svgData = useLoader(SVGLoader, "/lvup_icon.svg");
    
    // 将 svgData.paths 转换为形状数组，并记住这些形状，避免每次渲染时都重新计算
    const shapes = useMemo(() => {
        return svgData.paths.map((p) => p.toShapes(true));
    }, [svgData]);
    
    reture(
        {/* ... */}
    )
}    
```

  


然后，使用 Three.js 来渲染从 SVG 文件的路径中提取到的数据，将其转换为 3D 形状：

  


```JavaScript
// SVGMesh.tsx 
 
 const SVGMesh = (props) => {
     // 加载 SVG 和提取路径数据
    return (
        // Three.js 的网格对象，用于包含和渲染几何体和材料
        <mesh
            // 将网格缩小到原始尺寸的 1%
            scale={0.01} 
            
            // 随机旋转网格的 y 轴，使每个实例的旋转角度不同
            rotation={[Math.PI, Math.random() * Math.PI, 0]}
            
            // 随机设置网格的位置
            position={[Math.random() * 2 - 1.7, 2.5, Math.random() * 2 - 1]}
            
            // 将接收到的 props 传递给 mesh，允许自定义属性
            {...props}
        >
            // 遍历形状数组，为每个形状创建一个 mesh 
            {shapes.map((s, i) => (
                // key={i}：为每个 mesh 组件设置唯一的键
                // position={[0, 0, 0]}：将子网格的位置设置为原点
                <mesh key={i} position={[0, 0, 0]} {...props}>
                    // 用于将 2D 形状转换为 3D 几何体 
                    <extrudeGeometry
                        // 配置参数，定义挤出的深度和其他属性
                        args={[
                            s,
                            {
                                depth: 0.1,
                                bevelEnabled: false,
                                steps: 30,
                            },
                        ]}
                    />
                    // 使用 Phong 材质渲染网格，设置材质颜色和双面渲染
                    <meshPhongMaterial
                        attach="material"
                        color={svgData.paths[i].color}
                        side={T.DoubleSide}
                    />
                </mesh>
            ))}
        </mesh>
    );
};

// 导出组件
export default SVGMesh;
```

  


所有代码如下所示：

  


```JavaScript
// SVGMesh.tsx
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as T from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const SVGMesh = (props) => {
    const svgData = useLoader(SVGLoader, "/lvup_icon.svg");
    const shapes = useMemo(() => {
        return svgData.paths.map((p) => p.toShapes(true));
    }, [svgData]);

    return (
        <mesh
            scale={0.01}
            rotation={[Math.PI, Math.random() * Math.PI, 0]}
            position={[Math.random() * 2 - 1.7, 2.5, Math.random() * 2 - 1]}
            {...props}
        >
            {shapes.map((s, i) => (
                <mesh key={i} position={[0, 0, 0]} {...props}>
                    <extrudeGeometry
                        args={[
                            s,
                            {
                                depth: 0.1,
                                bevelEnabled: false,
                                steps: 30,
                            },
                        ]}
                    />
                    <meshPhongMaterial
                        attach="material"
                        color={svgData.paths[i].color}
                        side={T.DoubleSide}
                    />
                </mesh>
            ))}
        </mesh>
    );
};

export default SVGMesh;
```

  


现在，可以将上面创建的 `SVGMesh` 组件添加到我们的场景中。

  


```JavaScript
// Scene.tsx
// React 的 Suspense 组件，用于处理异步加载的组件
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
// 导入 SVGMesh 组件
import SVGMesh from "./SVGMesh";

export default function Scene() {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <OrbitControls />
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                decay={0}
                intensity={Math.PI}
            />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <directionalLight position={[10, 10, 10]} />
            
            // 使用 Suspense 组件来异步加载 SVGMesh 组件。在 SVGMesh 加载完成之前不会渲染任何东西 
            <Suspense fallback={null}>
                // 自定义组件，用于加载和渲染 SVG 图形
                <SVGMesh />
            </Suspense>
        </Canvas>
    );
}
```

  


我们使用 React 的 `Suspense` 组件，用于处理异步加载的组件。即使用 `Suspense` 组件来异步加载 `SVGMesh` 组件。在 `SVGMesh` 加载完成之前不会渲染任何东西。

  


这个时候，你在浏览器中能看到像下面这样的一个效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1363e4f26820454bab2fbabf87d1ddbd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=646&s=5924430&e=gif&f=169&b=fcfbfb)

  


  


在这个示例中，每个形状都会被随机分配一个位置和旋转，使得 SVG 被分解到 3D 空间中。

  


我们再来看一个更复杂一点的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edda8ed3fb924046ab38ba16ff7e5147~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=712&s=7931361&e=gif&f=134&b=24504c)

  


> 特别声明，这个效果是复制 [@Paul Henschel 写的一个效果](https://x.com/0xca0a)：https://codrops-svg.surge.sh/

  


这个效果的原理和上面的“老虎”示例是一样的。通过 React 和 `react-three-fiber` 库来获取 SVG 文件的 `<path>` 数据，并将其重新分解，放入 Three.js 中，使其具有一个 3D 场景。

  


关于项目初始化依旧是基于 Vite 和 React 的，这里就不做重复性的阐述了。我们直接进入创建这个效果所需要的代码中。

  


首先在项目中创建一个名为 `helpers.jsx` 文件，它的主要任务是使用 SVGLoader 将 SVG 中引入到 WebGL 中，并将它们转换为可以在 Three.js 场景中的形状数组，以便在 Three.js 中进行渲染：

  


```JavaScript
// helpers.jsx

// 导入 Three.js 库
import * as THREE from "three";

// 导入 SVGLoader 类
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

// 存储了 Three.js 中的双面材质常量，用于指定渲染的材质是双面的
const doubleSide = THREE.DoubleSide;

// 存储了一组颜色值，用于给每个加载的 SVG 设置不同的颜色
const colors = [
    "#21242d",
    "#ea5158",
    "#0d4663",
    "#ffbcb7",
    "#2d4a3e",
    "#8bd8d2",
];

// 存储了需要加载的 SVG 文件的路径，通过 map() 方法生成
const svgUrls = ["night", "city", "morning", "tubes", "woods", "beach"].map((name) => `/${name}.svg`);

// 定义异步函数 loadSvgs
const loadSvgs = async () => {
    // 创建 SVGLoader 实例
    const loader = new SVGLoader();
  
    // 创建用于存储加载的 SVG 数据的 Promise 数组
    const svgPromises = svgUrls.map(
        (url) =>
            new Promise((resolve, reject) => {
                // 使用 SVGLoader 加载 SVG 文件
                loader.load(url, (data) => {
                    try {
                        // 将 SVG 数据处理为形状数组，并使用 resolve 返回
                        const shapesArray = data.paths.flatMap((group, index) =>
                            group
                                .toShapes(true)
                                .map((shape) => ({ shape, color: group.color, index }))
                        );
                        resolve(shapesArray);
                    } catch (error) {
                        // 处理加载或处理过程中的错误，并使用 reject 或 throw 抛出
                        reject(error);
                    }
                });
            })
    );

    try {
        // 使用 Promise.all() 并行加载所有 SVG 文件
        const svgs = await Promise.all(svgPromises);
        return svgs;
    } catch (error) {
        // 处理加载过程中的错误
        console.error("Error loading SVGs:", error);
        throw error;
    }
};

// 将 loadSvgs 函数、颜色数组和双面材质常量导出，以便其他模块可以使用它们
export { loadSvgs, colors, doubleSide };
```

  


接下来，我们定义一个 `Shape` 组件，它的作用是将传递给它的形状数据渲染成一个带有动画效果的 Three.js 元素，并且可以控制其旋转、位置、颜色和透明度等属性。

  


```JavaScript
// Shape.jsx

// animated 是从 @react-spring/three 库中导入的一个高阶组件，用于创建动画效果的 Three.js 元素
import { animated } from "@react-spring/three";

// 从 ./helpers 模块中导入的双面材质常量，用于指定渲染的材质是双面的。
import { doubleSide } from "./helpers";

// 定义 Shape 组件
// shape: 形状
// rotation: 旋转
// position: 位置
// color: 颜色
// opacity: 不透明度
// index: 索引
const Shape = ({ shape, rotation, position, color, opacity, index }) => {
    // 返回了一个带有动画效果的 Three.js <mesh> 元素，用于渲染形状  
    return (
        // 创建一个动画的网格模型，其中 rotation 和 position 属性被传递给动画组件，以便可以通过动画进行更改
        <animated.mesh
            rotation={rotation}
            position={position.to((x, y, z) => [x, y, z + -index * 50])}
        >
            // 定义材质
            <animated.meshPhongMaterial
                attach="material"  // 将材质附加到 Three.js 中的网格元素上，以便在渲染时使用该材质来呈现网格
                color={color}      // 指定材质的颜色
                opacity={opacity}  // 指定材质的透明度
                side={doubleSide}  // 指定材质为双面
                depthWrite={false} // 材质为深度写入
                transparent        // 材质是否透明
            />
            // 用于定义几何形状
            <animated.extrudeGeometry 
                attach="geometry" 
                args={[shape]} 
            />
        </animated.mesh>
    );
};

export default Shape;
```

  


然后，我们需要创建 `Scene` 组件负责渲染整个场景，其中涉及到了使用 [React Spring](https://www.react-spring.dev/) 库的动画组件来实现形状的过渡效果。通过 `useEffect` 钩子来实现页面切换和加载 SVG 数据，通过 `useSpring` 创建背景颜色的动画，通过 `useTransition` 创建形状的过渡动画。最后通过 `transitions` 函数将过渡动画应用到形状组件中进行渲染。

  


```JavaScript
// Scene.jsx
import { useState, useEffect } from "react";

// 引入 React Spring 库中的动画组件
import { useTransition, useSpring, animated } from "@react-spring/three";

// 从 helpers 文件中导入加载 SVG 和颜色数据的函数
import { loadSvgs, colors } from "./helpers";

// 导入自定义的 Shape 组件，用于渲染形状
import Shape from './Shape'

const Scene = () => {
    // 定义状态：当前页数和形状数据
    const [page, setPage] = useState(0);
    const [shapes, setShapes] = useState([]);

    // 每隔 3 秒切换页面
    useEffect(() => {
        const interval = setInterval(() => {
            setPage((i) => (i + 1) % 6); // 假设有 6 页
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // 加载 SVG 并设置形状数据
    useEffect(() => {
        const fetchSvgs = async () => {
            try {
                const allSvgs = await loadSvgs(); // 调用 loadSvgs 函数加载 SVG 数据
                setShapes(allSvgs[page]);         // 根据当前页面设置形状数据
            } catch (error) {
                console.error("Error loading shapes:", error);
            }
        };
        fetchSvgs();
    }, [page]);

    // 创建 Spring 动画，控制背景颜色的变化
    const { color } = useSpring({ color: colors[page] });

    // 使用过渡动画来处理形状的进入和离开效果
    const transitions = useTransition(shapes, {
        // 初始状态
        from: { 
            rotation: [-0.2, 0.9, 0], 
            position: [0, 50, -200], opacity: 0 
        }, 
        // 进入状态
        enter: { 
            rotation: [0, 0, 0], 
            position: [0, 0, 0], opacity: 1 
        },
        // 离开状态
        leave: {
            rotation: [0.2, -0.9, 0],
            position: [0, -400, 200],
            opacity: 0,
        },
        // 动画配置
        config: { 
            mass: 30, 
            tension: 800, 
            friction: 190, 
            precision: 0.0001 
        },
        ...{
            order: ["leave", "enter", "update"], // 动画执行顺序
            trail: 15,                           // 动画延迟
            lazy: true,                          // 延迟加载
            unique: true,                        // 唯一标识
            reset: true,                         // 重置 
        },
    });

    // 渲染场景组件
    return (
        <>
            <mesh scale={[20000, 20000, 1]} rotation={[0, (-20 * Math.PI) / 180, 0]}>
                {/* 定义平面几何 */}
                <planeGeometry attach="geometry" args={[1, 1]} />
                {/* 应用动画材质 */}
                <animated.meshPhongMaterial
                    attach="material"
                    color={color}
                    depthTest={false}
                />
            </mesh>
            {/* 形状组 */}
            <group
                position={[1600, -700, page]}
                rotation={[0, (180 * Math.PI) / 180, 0]}
            >
                {/* 形状组 */}
                {transitions((...item) => {
                    const props = {
                        ...item[0], // 过渡动画属性
                        ...item[1], // 动画配置
                    };
                  return <Shape {...props} />; // 返回 Shape 组件，并传入属性
                })}
            </group>
        </>
    );
};

export default Scene;
```

  


最后，我们在 `App` 组件（`App.jsx`）中，导入已经创建好的场景（`Scene`），并将其放置在 `<Canvas>` 组件中。`<Canvas>` 组件主要用于创建 WebGL 渲染环境，并在其中渲染已定义好的场景（`Scene`）。在 `<Canvas>` 组件中，设置了相机的参数，包括视场角度、位置、旋转角度等。除了渲染 3D 场景外，还添加了环境和聚光灯以提供光照效果。

  


```JavaScript
// App.jsx
import "./App.css";

// 导入 React Three Fiber 库中的 Canvas 组件，用于创建 WebGL 渲染环境
import { Canvas } from "@react-three/fiber";

// 导入自定义的 Scene 组件，用于渲染场景
import Scene from "./Scene";

const App = () => {
    return (
        <div className="app">
            {/*  创建 WebGL 渲染环境 */}
            <Canvas
                // 设置为 true，使渲染循环受到 React 更新的影响 
                invalidateframeloop="true"  
                // 相机参数设置
                camera={{
                    // 视场角度
                    fov: 90,
                    // 相机位置
                    position: [0, 0, 1800],
                    // 相机旋转角度
                    rotation: [0, (-20 * Math.PI) / 180, (180 * Math.PI) / 180],
                    // 近截面
                    near: 0.1,
                    // 远截面
                    far: 20000,
                }}
            >
                {/* 添加环境光 */}
                <ambientLight intensity={0.5} />
                {/* 添加聚光灯 */}
                <spotLight intensity={0.5} position={[300, 300, 4000]} />
                {/* 渲染 Scene 组件 */}
                <Scene />
            </Canvas>
            <span className="header">REACT THREE FIBER</span>
        </div>
    );
}

export default App;
```

  


上面就是实现整个效果的全部代码。感兴趣的同学可以挑战一下。

  


## SVG 与 WebGL：创作无限可能

  


前文展示了如何通过 SVG 构建工具，在 Vite 构建的 React 应用中，将 SVG 引入 WebGL，从而创建更加高级和复杂的图形效果。接下来，我们将一步步探讨如何在不依赖任何构建工具的情况下，将 SVG 引入 WebGL，并为其增添动画效果。

  


SVG 的一个显著特性是其图形由数学函数构成，可以通过 JavaScript 获取和解析这些图形数据，从而进行动画处理，使图形更加生动。这意味着，在许多场景中，我们不仅可以将 SVG 用于视觉展示，还可以将其作为数据源来利用。接下来，我将通过一个实际案例来详细解释这一点。

  


通过学习小册子中的《[初级篇：SVG 描边和填充](https://juejin.cn/book/7341630791099383835/section/7349188496181887017#heading-5)》一节课，我们了解到可以使用 CSS 控制 `<path>` 元素的 `stroke-dasharray` 属性，为 SVG 路径添加线条动画。例如：

  


```XML
<svg viewBox="-2 -2 524 524" class="codepen">
    <path d="m502.3 159.7-234-156c-8-4.9-16.5-5-24.6 0l-234 156c-6 4-9.7 11.1-9.7 18.3v156c0 7.1 3.7 14.3 9.7 18.3l234 156c8 4.9 16.5 5 24.6 0l234-156c6-4 9.7-11.1 9.7-18.3V178c0-7.1-3.7-14.3-9.7-18.3zM278 63.1 450.3 178l-76.9 51.4-95.4-63.7V63.1zm-44 0v102.6l-95.4 63.7L61.7 178 234 63.1zm-190 156L99.1 256 44 292.8v-73.7zm190 229.7L61.7 334l76.9-51.4 95.4 63.7v102.6zm22-140.9-77.7-52 77.7-52 77.7 52-77.7 52zm22 140.9V346.3l95.4-63.7 76.9 51.4L278 448.8zm190-156-55.1-36.9 55.1-36.8v73.7z" />
</svg>
```

  


```CSS
@layer demo {
    .codepen {
        display: block;
        width: 80vh;
        aspect-ratio: 1;
        fill: none;
        stroke-width: 4;
        stroke: #fff;
        stroke-linecap: round;
        stroke-linejoin: round;
        
        path {
            stroke-dashoffset: 40 20;
            animation: strokedasharray 2s ease-in-out infinite alternate;
        }
    }

    @keyframes strokedasharray {
        from {
            stroke-dasharray: 0 4429;
        }
        to {
            stroke-dasharray: 4429 4429;
        }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe9f7862a95d416d877fef067f8d46c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1108&h=604&s=461578&e=gif&f=78&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/JjqKVav

  


你可能会好奇，为什么 `stroke-dasharray` 的值是 `4429` 呢？其实很简单，这个数值表示示例中 `<path>` 元素总长度的计算值。这个值我们可以通过 `SVGPathElement.getTotalLength()` 来获取，与此同时，它还有一个 `SVGGeometryElement.getPointAtLength()` 方法。这是两个非常有用的 SVG DOM API，它允许 Web 开发者操作和计算 SVG 路径（`<path>`）的几何特性：

  


-   `SVGPathElement.getTotalLength()` 方法返回一个浮点数，表示路径的总长度（以用户单位为单位）；
-   `SVGGeometryElement.getPointAtLength()` 方法返回一个 `DOMPoint` 对象，表示路径上距离起点为指定长度的点的坐标。

  


> 注意， `SVGGeometryElement` 变量指的是 SVG 的几何图形元素，如 `path`、`circle`、`ellipse`、`line`、`polygon` 和 `polyline` 元素，因此不包括 `image`、`filter`、`clip-path` 等元素。

  


假设我们有一个简单的 SVG 路径：

  


```XML
<svg width="100" height="100">
    <path id="myPath" d="M10 10 H 90 V 90 H 10 Z" stroke="black" fill="transparent"/>
</svg>
```

  


我们可以用 JavaScript 获取该路径的总长度：

  


```JavaScript
const pathElement = document.getElementById('myPath');
const pathLength = pathElement.getTotalLength();
console.log(`Path length: ${pathLength}`);
```

  


使用之前的示例路径，我们可以获取路径上某一特定长度的点的坐标：

  


```JavaScript
const pathElement = document.getElementById('myPath');
const point = pathElement.getPointAtLength(50);
console.log(`Point at length 50: (${point.x}, ${point.y})`);
```

  


结合使用 `SVGPathElement.getTotalLength()` 和 `SVGGeometryElement.getPointAtLength()` 方法，为 Web 开发者提供了强大的工具，使他们能够在 SVG 动画和交互设计中进行富有创造性的工作：

  


-   **路径动画**：通过获取路径的总长度并计算路径上各点的位置，开发者可以精确控制动画对象的运动轨迹。这使得创建沿着路径移动的动画，如图标或文字沿着预定路径运动，变得非常容易，从而实现复杂的视觉效果。
-   **交互式绘图应用**：这些方法允许开发者获取路径的总长度和特定位置的点，从而支持用户通过拖拽或点击来编辑路径。在交互式绘图工具中，这非常有用。用户可以在路径上绘制或选择特定点进行编辑，例如在地图应用中沿着路线绘制或移动标记点。
-   **数据可视化**：开发者可以利用路径的总长度和路径上特定点的数据，在路径上动态显示数据点或信息。这在数据可视化应用中尤为重要，可以用来展示趋势或分布图，例如股票走势或路径图。
-   **动态绘图和涂鸦应用**：通过获取路径的总长度和路径上特定位置的点，开发者可以允许用户实时绘制和编辑图形。用户可以在路径上动态绘图或添加涂鸦效果，适用于创意应用和艺术创作。

  


总之，这些方法为 SVG 提供了强大的几何计算能力，使得在 Web 上实现复杂的图形效果变得更加容易和高效。

  


接下来，我们通过实际的案例向大家展示这两个函数的强大之处。我们使用 [GreenSock 库](https://gsap.com/)为 SVG 图形添加随机的粒子动画效果。

  


以 Codpen 的 Logo 图标为例，该图标对应的 SVG 代码如下：

  


```XML
<svg viewBox="-2 -2 524 524" class="codepen">
    <path d="m502.3 159.7-234-156c-8-4.9-16.5-5-24.6 0l-234 156c-6 4-9.7 11.1-9.7 18.3v156c0 7.1 3.7 14.3 9.7 18.3l234 156c8 4.9 16.5 5 24.6 0l234-156c6-4 9.7-11.1 9.7-18.3V178c0-7.1-3.7-14.3-9.7-18.3zM278 63.1 450.3 178l-76.9 51.4-95.4-63.7V63.1zm-44 0v102.6l-95.4 63.7L61.7 178 234 63.1zm-190 156L99.1 256 44 292.8v-73.7zm190 229.7L61.7 334l76.9-51.4 95.4 63.7v102.6zm22-140.9-77.7-52 77.7-52 77.7 52-77.7 52zm22 140.9V346.3l95.4-63.7 76.9 51.4L278 448.8zm190-156-55.1-36.9 55.1-36.8v73.7z" />
    <!-- 用来放置圆形粒子的容器 -->
    <g id="group"></g>
</svg>
```

  


使用 JavaScript 和 GASP 来对上面示例中的 `<path>` 做一些有趣的操作：

  


```JavaScript
// 获取类名为 "codepen" 的元素下的 path 元素
const path = document.querySelector(".codepen path");

// 获取 id 为 "group" 的元素，用于容纳生成的圆形元素
const group = document.querySelector("#group");

// 定义颜色比例尺数组
const colours = [
    chroma.scale([
        "#FF7900",
        "#F94E5D",
        "#CA4B8C",
        "#835698",
        "#445582",
        "#2F4858"
    ]),
    chroma.scale([
        "#845EC2",
        "#D65DB1",
        "#FF6F91",
        "#FF9671",
        "#FFC75F",
        "#F9F871"
    ]),
    chroma.scale([
        "#F24B8E",
        "#F6ACC2",
        "#FFE3F1",
        "#59BAB7",
        "#BA59B7",
        "#F3596A"
    ]),
    chroma.scale([
        "#1FAAFE",
        "#00C6FF",
        "#00DCE4",
        "#10ECB8",
        "#A0F68B",
        "#F9F871"
    ])
];

// 初始化当前使用的颜色比例尺索引
let currentGradient = 1;

// 创建 gsap 时间轴动画：使用 gsap 库创建时间线对象，用于管理动画序列
const tl = gsap.timeline({
    // 当动画反向播放完成时的回调函数
    onReverseComplete: () => {
        // 当动画反向播放完成后，将动画的时间比例设置为 1，以确保时间流逝正常
        tl.timeScale(1);
        // 立即开始播放动画
        tl.play(0);
    },
    // 当动画播放完成时的回调函数
    onComplete: () => {
        // 当动画播放完成后，将动画的时间比例设置为 1.5，加快动画播放速度
        tl.timeScale(1.5);
        // 反向播放动画，即将动画倒放回到起始状态
        tl.reverse(0);
    }
});

// 生成动画效果的函数
const generatePoints = () => {
    // 清除时间轴动画和元素容器的内容
    tl.clear();
    group.innerHTML = "";

    // 初始化延迟值
    let delay = 0;

    // 获取路径的总长度
    const length = path.getTotalLength();

    // 循环生成圆形元素
    for (let i = 0; i < length; i += 1) {
        // 随机获取路径上的点的位置
        const pointLength = Math.random() * length;
        const point = path.getPointAtLength(pointLength);
    
        // 创建圆形元素
        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        // 设置圆形粒子的中心点的 x 坐标为路径上随机点的 x 坐标
        circle.setAttribute("cx", point.x);
    
        // 设置圆形粒子的中心点的 y 坐标为路径上随机点的 y 坐标
        circle.setAttribute("cy", point.y);
    
        // 设置圆形粒子的半径为一个随机值，范围在 1 到 4 之间
        circle.setAttribute("r", Math.random() * 3 + 1);
    
        // 将创建的圆形粒子添加到指定的容器中
        group.appendChild(circle);
    
        // 计算颜色值
        const coloursX = point.x / 476.5 + (Math.random() - 0.5) * 0.2;
    
        // 使用 gsap 库的 to() 方法对圆形粒子进行动画处理：添加到时间轴动画中
        tl.to(
            circle, // 要应用动画的对象，这里是圆形粒子
            {
                autoRound: false, // 指定是否应该将属性值四舍五入为整数
                fill: colours[currentGradient % colours.length](coloursX).hex(), // 设置圆形粒子的填充颜色
                cx: point.x + (Math.random() - 0.5) * 60, // 设置圆形粒子在 x 轴上的动画终点位置
                cy: point.y + (Math.random() - 0.5) * 60, // 设置圆形粒子在 y 轴上的动画终点位置
                duration: "random(0.5, 2)", // 设置动画的持续时间范围为随机值，范围在 0.5 到 2 之间
                delay: (delay + pointLength) * 0.002, // 设置动画延迟的时间，根据路径长度进行计算
                ease: "power2.out" // 设置动画的缓动函数，这里使用 power2.out
            },
            0 // 设置动画的起始时间，这里是立即开始
        );
    }
    // 更新延迟值
    delay += length;

    // 播放时间轴动画
    tl.reversed(false).play(0);

    // 更新颜色比例尺索引
    currentGradient++;
};

// 调用生成动画效果的函数
generatePoints();
```

  


上面的代码主要完成了以下几件事情：

  


-   **获取 SVG 路径信息**：通过 `document.querySelector(".codepen path")` 获取了 `.codepen` 的路径元素，这些路径元素定义了要绘制的形状。
-   **创建圆形粒子**：通过 `path.getPointAtLength()` 方法获取路径上的随机点，并将其作为圆形粒子的位置。然后创建圆形粒子元素，并将其添加到指定的容器中。
-   **应用动画效果**：通过 GSAP 库创建了时间轴动画 `tl`，在动画中为每个圆形粒子设置了位置、填充颜色等属性，并且设置了延迟时间，以实现粒子的动态效果。
-   **循环播放动画**：通过 `tl.reversed(false).play(0)` 循环播放动画，不断生成圆形粒子，从而实现动态的视觉效果。

  


你将在浏览器看到像下图这样的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0b9eed9f7ea4f25815b12d074f8117a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=626&s=7945468&e=gif&f=227&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/NWVrVPR

  


在上面的示例基础上，我们只需要稍微调整，就可以将粒子动画效果用于 Web UI 上，例如下面这个按钮效果：

  


```HTML
<button class="button">
    <span>Click Me!</span>
    <svg width="100%" height="100%"  fill="none" >
        <rect x="0" y="0" width="100%" height="100%" rx="10" stroke="black"/>
        <g id="group"></g>
    </svg>
</button>
```

  


使用 CSS 给按钮设置基本样式：

  


```CSS
@layer demo {
    .button {
        position: relative;
        display: grid;
        min-width: 240px;
        height: 66px;
        cursor: pointer;
        text-decoration: none;
        white-space: nowrap;
        background-image: linear-gradient(to right, #f05a28, #ec008c, #f05a28);
        background-size: 300% 100%;
        transition: all 0.5s ease-in-out;
        border: none;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 700;
        
        &:hover {
            background-position: -50% 0;
        }
    
        svg {
            display: block;
            width: 100%;
            height: 100%;
            overflow: visible; /* 这个很重要 */
            position: absolute;
            inset: 0;
        }
    
        rect {
            rx: 10;
            stroke: transparent;
            stroke-width: 1;
        }
    
        > * {
            grid-area: 1 / 1 / -1 / -1;
        }
    
        span {
            display: block;
            place-self: center;
        }
    }
}
```

  


通过 JavaScript 获取 SVG 的 `<rect>` 的数据，并转换为相关的粒子，然后使用 GSAP 给粒子设置动画效果：

  


```JavaScript
const buttonHandler = document.querySelector(".button");
// 选择 SVG 中的矩形元素，作为路径动画的参考
const rectPath = document.querySelector(".button rect");
// 选择 SVG 中的特定元素，用于添加创建的粒子
const particleContainer = document.querySelector("#group");

// 标志变量，用于跟踪动画状态
let isAnimating = false;

const animateParticles = (aniPath) => {
    if (!isAnimating) {
        isAnimating = true;
        // 创建一个对象，以便 gsap 可以对其属性进行动画
        const val = { distance: 0 };
        // 创建一个 tween 动画，控制粒子沿着路径运动
        gsap.to(val, {
            // 从 distance 0 到总路径长度的动画
            distance: aniPath.getTotalLength(),
            // 动画持续时间为 5 秒
            duration: 5,
            // 每帧动画更新时调用的函数
            onUpdate: () => {
                // 根据新的 distance 值获取路径上的点
                const point = aniPath.getPointAtLength(val.distance);
                // 创建粒子
                createParticle(point, particleContainer);
            },
            // 动画完成时执行的回调
            onComplete: () => {
                isAnimating = false; // 标志动画已经完成
            }
        });
    
        /* 控制路径描绘动画 */
        // 设置路径的 stroke-dasharray 属性为总路径长度
        aniPath.setAttribute("stroke-dasharray", aniPath.getTotalLength());
        // 设置路径的 stroke-dashoffset 属性为两倍总路径长度
        aniPath.setAttribute("stroke-dashoffset", aniPath.getTotalLength() * 2);
        // 创建路径描绘动画
        gsap.to(aniPath, {
            // 从两倍总路径长度到 0 的动画
            strokeDashoffset: aniPath.getTotalLength(),
            // 动画持续时间为 5 秒
            duration: 5
        });
    }
};

// 创建粒子的函数
const createParticle = (point, container) => {
    // 定义颜色比例尺数组
    const colours = [
        chroma.scale([
            "#FF7900",
            "#F94E5D",
            "#CA4B8C",
            "#835698",
            "#445582",
            "#2F4858"
        ]),
        chroma.scale([
            "#845EC2",
            "#D65DB1",
            "#FF6F91",
            "#FF9671",
            "#FFC75F",
            "#F9F871"
        ]),
        chroma.scale([
            "#F24B8E",
            "#F6ACC2",
            "#FFE3F1",
            "#59BAB7",
            "#BA59B7",
            "#F3596A"
        ]),
        chroma.scale([
            "#1FAAFE",
            "#00C6FF",
            "#00DCE4",
            "#10ECB8",
            "#A0F68B",
            "#F9F871"
        ])
    ];
    // 初始化当前使用的颜色比例尺索引
    let currentGradient = 1;
    // 创建一个新的圆圈元素
    const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );
    // 将元素添加到 SVG 中
    container.appendChild(circle);
    // 设置圆圈的坐标
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    // 为每个圆圈定义随机半径
    circle.setAttribute("r", Math.random() * 4 + 0.2);
    // 为每个圆圈定义随机颜色
    // 计算颜色值
    const coloursX = point.x / 476.5 + (Math.random() - 0.5) * 0.25;
    circle.setAttribute(
        "fill",
        colours[currentGradient % colours.length](coloursX).hex()
    );

    // 对圆圈进行动画
    gsap.to(circle, {
        // 根据当前位置随机调整 cx 值
        cx: "+=random(-50,50)",
        // 根据当前位置随机调整 cy 值
        cy: "+=random(-50,50)",
        // 逐渐消失
        opacity: 0,
        // 随机持续时间
        duration: "random(.5, 1)",
        // 不要对 cx 和 cy 值进行四舍五入
        autoRound: false,
        // 动画完成后执行
        onComplete: () => {
            // 从父元素中移除圆圈元素
            container.removeChild(circle);
        }
    });
};

buttonHandler.addEventListener("click", () => animateParticles(rectPath));
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5553f46e97ee4ecd977ab198e2f64c28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=526&s=1730512&e=gif&f=322&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/yLWJWjj

  


到目前为止，我们只是在路径旁边动画化了 SVG 元素，即使用 JavaScript 动态创建了很多个 `<circle>` 元素，而且动态改变这些圆的圆心位置、大小和颜色。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc73288a8a8d4c98805e1a8be9ed5c71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1668&h=792&s=15082119&e=gif&f=115&b=f0f8fb)

  


[在讨论 SVG 和 Canvas 两种技术时](https://juejin.cn/book/7341630791099383835/section/7368317759962218534#heading-9)，我曾提出，SVG 其实并不太适合动画化处理很多小的图形元素，例如上面示例中的 `<circle>` ，这对于 Web 性能来说，可能会是致命的。这意味着，在这种情景之下，使用 Canvas 会更适合一些。

  


还有，在很多时候，我们只需要 SVG 路径的数据（原始坐标），例如，我们想在 2D 画布或 WebGL 中要一个像下面这样的粒子动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83a52cadea9447b4a89f6187e606ac9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=616&s=11857781&e=gif&f=234&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/xxNOoRG

  


我们来看一个简单的示例，以“心”形为例：

  


```XML
<svg viewBox="0 0 600 552" class="sr-only" >
    <path id="heart" d="M300,107.77C284.68,55.67,239.76,0,162.31,0,64.83,0,0,82.08,0,171.71c0,.48,0,.95,0,1.43-.52,19.5,0,217.94,299.87,379.69v0l0,0,.05,0,0,0,0,0v0C600,391.08,600.48,192.64,600,173.14c0-.48,0-.95,0-1.43C600,82.08,535.17,0,437.69,0,360.24,0,315.32,55.67,300,107.77" fill="#ee5282"/>
</svg>
```

  


然后使用 Three.js 创建一个 3D 场景，并使用 GSAP 为场景中的粒子添加动画效果：

  


```JavaScript
// 创建一个场景，这里是Three.js的核心场景对象
const scene = new THREE.Scene();

// 创建一个透视相机，用于场景的视图
const camera = new THREE.PerspectiveCamera(
    75, // 视角广度
    window.innerWidth / window.innerHeight, // 纵横比
    0.1, // 近截面
    5000 // 远截面
);

// 设置相机位置，使其稍微远离场景
camera.position.z = 600;

// 创建一个WebGL渲染器
const renderer = new THREE.WebGLRenderer();

// 设置渲染器的像素比率以适应不同的设备
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// 设置渲染器的尺寸为窗口的宽和高
renderer.setSize(window.innerWidth, window.innerHeight);

// 将渲染器的DOM元素（画布）添加到文档中
document.body.appendChild(renderer.domElement);

// 创建轨道控制器，使得可以用鼠标控制相机
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);

/* 根据 SVG 路径元素提供的数据创建粒子 */

// 选择SVG路径元素
const path = document.querySelector("#heart");

// 获取路径的总长度
const length = path.getTotalLength();

// 初始化存储顶点的数组
const vertices = [];

// 遍历路径的每个点，间隔为0.2
for (let i = 0; i < length; i += 0.2) {
    // 获取路径上每个点的坐标
    const point = path.getPointAtLength(i);

    // 创建一个Three.js的向量对象表示这个点
    const vector = new THREE.Vector3(point.x, -point.y, 0);

    // 随机扰动这个点的位置，使得点看起来更分散
    vector.x += (Math.random() - 0.5) * 30;
    vector.y += (Math.random() - 0.5) * 30;
    vector.z += (Math.random() - 0.5) * 70;

    // 将这个点添加到顶点数组中
    vertices.push(vector);
}

// 使用顶点数组创建一个BufferGeometry对象
const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

// 创建一个粒子材质对象，设置颜色和大小
const material = new THREE.PointsMaterial({ color: 0xee5282, blending: THREE.AdditiveBlending, size: 3 });

// 使用几何体和材质创建一个点云对象
const particles = new THREE.Points(geometry, material);

// 调整点的位置，使其居中
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;

// 将点添加到场景中
scene.add(particles);

/* 给粒子添加动画效果 */

// 动画持续时间
const duration = 5;

// 动画延迟时间
const delay = 2;

// 遍历每个粒子
for (let i = 0; i < particles.geometry.attributes.position.count; i++) {
    // 获取粒子的初始位置
    const startPosition = new THREE.Vector3().copy(particles.geometry.attributes.position.array.slice(i * 3, i * 3 + 3));

    // 获取粒子的结束位置
    const endPosition = new THREE.Vector3().copy(vertices[i]);

    // 使用GSAP创建从初始位置到结束位置的动画
    gsap.fromTo(
        startPosition, 
        { 
            x: startPosition.x, 
            y: startPosition.y, 
            z: startPosition.z }, 
        {
            x: endPosition.x,
            y: endPosition.y,
            z: endPosition.z,
            duration: duration,
            delay: delay * i / particles.geometry.attributes.position.count,
            onUpdate: function () {
                // 在每一帧更新时，更新粒子的实际位置
                particles.geometry.attributes.position.setXYZ(i, startPosition.x, startPosition.y, startPosition.z);
                particles.geometry.attributes.position.needsUpdate = true;
            },
            onComplete: function () {
                // 动画完成后，反向播放回到初始位置的动画
                gsap.to(startPosition, { x: startPosition.x, y: startPosition.y, z: startPosition.z, duration: duration, delay: duration, onUpdate: function () {
                    particles.geometry.attributes.position.setXYZ(i, startPosition.x, startPosition.y, startPosition.z);
                    particles.geometry.attributes.position.needsUpdate = true;
                } 
            });
        }
    });
}

// 为场景添加旋转动画，使整个场景旋转
gsap.fromTo(scene.rotation, { y: -0.3 }, {
    y: 0.3,
    repeat: -1, // 无限重复
    yoyo: true, // 在每次重复时反向播放
    ease: 'power2.inOut', // 缓动函数
    duration: 3 // 持续时间
});

/* 渲染效果 */

// 渲染函数
function render() {
    // 请求下一帧
    requestAnimationFrame(render);

    // 渲染场景
    renderer.render(scene, camera);
}

// 当窗口大小改变时调整相机和渲染器的尺寸
function onWindowResize() {
    // 更新相机的纵横比
    camera.aspect = window.innerWidth / window.innerHeight;

    // 更新相机的投影矩阵
    camera.updateProjectionMatrix();

    // 更新渲染器的尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 监听窗口大小改变事件
window.addEventListener("resize", onWindowResize, false);

// 开始渲染
requestAnimationFrame(render);
```

  


整个效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1530a2ca16e2450f899a564582589a17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=740&s=17337197&e=gif&f=354&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/oNRLrpB

  


上面这个示例展示了如何从一个 SVG 路径创建粒子动画的过程。以下是关键步骤的解释：

  


### Step01：**获取路径及其总长度**

  


首先，通过 JavaScript API （例如 `document.querySelector`）从 HTML 文档中选择你要使用的 SVG 路径元素；接着使用 SVG DOM API 的 `path.getTotalLength()` 方法获取路径的总长度，这个长度表示路径从起点到终点的距离总和。

  


```JavaScript
const path = document.querySelector("#heart");
const length = path.getTotalLength();
```

  


### Step02：**沿着路径循环直到达到其总长度**

  


接下来，使用一个 `for` 循环，从路径的起点到终点，按固定间隔遍历路径上的每个点。每次迭代的间隔可以根据需要调整。在这段代码中，间隔设为 `0.2`。

  


```JavaScript
for (let i = 0; i < length; i += 0.2) {
    // 在每个迭代中执行代码
}
```

  


### Step03：**获取路径上每个点的坐标**

  


在每次迭代中，使用 `path.getPointAtLength(i)` 方法获取路径上距离起点 `i` 距离处的点的坐标。

  


```JavaScript
const point = path.getPointAtLength(i);
```

  


### Step04：**在每次迭代中，创建一个在该点坐标处的 Vector3 对象**

  


使用 Three.js 的 `THREE.Vector3` 类创建一个向量对象，表示该点的坐标。注意需要将 SVG 坐标转换为 Three.js 坐标系（例如，`Y` 轴翻转）。

  


```JavaScript
const vector = new THREE.Vector3(point.x, -point.y, 0);
```

  


### Step05：**将向量推入顶点数组**

  


将创建的向量添加到顶点数组中，以便稍后用于创建几何体。

  


```JavaScript
vertices.push(vector);
```

  


### Step06：**从顶点数组创建几何体**

  


使用顶点数组创建一个 Three.js 的 `BufferGeometry` 对象。这可以通过 `new THREE.BufferGeometry().setFromPoints(vertices)` 方法完成，其中 `vertices` 是前面生成的顶点数组。

  


```JavaScript
const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
```

  


### Step07：**创建一个点云对象并将其添加到场景中**

  


使用创建的几何体和一个粒子材质对象创建一个`THREE.Points`对象（点云对象）。粒子材质设置了粒子的颜色和大小。然后，将点云对象添加到 Three.js 场景中，以便它能够被渲染。

  


```JavaScript
const material = new THREE.PointsMaterial({ color: 0xee5282, blending: THREE.AdditiveBlending, size: 3 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);
```

  


通过上述步骤，你将 SVG 路径转换为一个三维空间中的粒子效果。这个时候，整个效果具备 3D 场景的效果，具有摄像机、不同类型灯光源等。

  


### Step08：使用 GSAP 给粒子添加动画效果

  


如果希望给粒子添加动画效果，还需要做一些额外的事情。例如，使用 GSAP 库给粒子添加动画效果。

  


```JavaScript
// 使用GSAP创建从初始位置到结束位置的动画
gsap.fromTo(
    startPosition, 
    { 
        x: startPosition.x, 
        y: startPosition.y, 
        z: startPosition.z }, 
    {
        x: endPosition.x,
        y: endPosition.y,
        z: endPosition.z,
        duration: duration,
        delay: delay * i / particles.geometry.attributes.position.count,
        onUpdate: function () {
            // 在每一帧更新时，更新粒子的实际位置
            particles.geometry.attributes.position.setXYZ(i, startPosition.x, startPosition.y, startPosition.z);
            particles.geometry.attributes.position.needsUpdate = true;
        },
        onComplete: function () {
            // 动画完成后，反向播放回到初始位置的动画
            gsap.to(startPosition, { x: startPosition.x, y: startPosition.y, z: startPosition.z, duration: duration, delay: duration, onUpdate: function () {
                particles.geometry.attributes.position.setXYZ(i, startPosition.x, startPosition.y, startPosition.z);
                particles.geometry.attributes.position.needsUpdate = true;
            } 
        });
    }
});
```

  


上面是粒子出现时的动画效果，除此之外，还有个场景的旋转动效：

  


```JavaScript
// 为场景添加旋转动画，使整个场景旋转
gsap.fromTo(scene.rotation, { y: -0.3 }, {
    y: 0.3,
    repeat: -1, // 无限重复
    yoyo: true, // 在每次重复时反向播放
    ease: 'power2.inOut', // 缓动函数
    duration: 3 // 持续时间
});
```

  


当然，要是你对 GSAP 和 WebGL 熟悉的话，你还可以给粒子添加更复杂的动画效果：

  


```JavaScript
/* 初始化和设置场景 */
function initScene() {
    // 创建一个新的Three.js场景
    const scene = new THREE.Scene();

    // 创建一个透视相机，设置视角、纵横比、近截面和远截面
    const camera = new THREE.PerspectiveCamera(
        75, // 视角广度
        window.innerWidth / window.innerHeight, // 纵横比
        0.1, // 近截面
        5000 // 远截面
    );
    // 设置相机的位置，使其远离场景中心
    camera.position.z = 500;

    // 创建一个WebGL渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染器的像素比率以适应不同的设备
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    // 设置渲染器的尺寸为窗口的宽和高
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 将渲染器的DOM元素（画布）添加到文档中
    document.body.appendChild(renderer.domElement);

    // 创建轨道控制器，使得可以用鼠标控制相机
    const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);

    // 返回场景、相机和渲染器对象
    return { scene, camera, renderer };
}

/* 基于 SVG 路径创建粒子 */
function createParticles(scene, pathSelector) {
    // 选择SVG路径元素
    const path = document.querySelector(pathSelector);
    // 获取路径的总长度
    const length = path.getTotalLength();
    // 初始化存储顶点的数组
    const vertices = [];
    // 创建一个全局的GSAP时间轴，用于包含所有动画
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // 遍历路径的每个点，间隔为0.1
    for (let i = 0; i < length; i += 0.1) {
        // 获取路径上每个点的坐标
        const point = path.getPointAtLength(i);
        // 创建一个Three.js的向量对象表示这个点
        const vector = new THREE.Vector3(point.x, -point.y, 0);
        // 随机扰动这个点的位置，使得点看起来更分散
        vector.x += (Math.random() - 0.5) * 30;
        vector.y += (Math.random() - 0.5) * 30;
        vector.z += (Math.random() - 0.5) * 70;
        // 将这个点添加到顶点数组中
        vertices.push(vector);
    
        // 为这个点创建一个动画
        tl.from(vector, {
          x: 600 / 2, // 心形的中心X坐标
          y: -552 / 2, // 心形的中心Y坐标
          z: 0, // 场景的中心
          ease: "power2.inOut", // 缓动函数
          duration: "random(.5, 1)" // 随机持续时间
        }, i * 0.002); // 根据路径长度计算延迟
    }

    // 使用顶点数组创建一个BufferGeometry对象
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    // 创建一个粒子材质对象，设置颜色和大小
    const material = new THREE.PointsMaterial({ color: 0xee5282, blending: THREE.AdditiveBlending, size: 3 });
    // 使用几何体和材质创建一个点云对象
    const particles = new THREE.Points(geometry, material);

    // 调整点云的位置，使其居中
    particles.position.x -= 600 / 2;
    particles.position.y += 552 / 2;
    // 将点云添加到场景中
    scene.add(particles);

    // 返回点云对象、顶点数组、几何体和GSAP时间轴
    return { particles, vertices, geometry, tl };
}

/* 为场景添加旋转动画 */
function addSceneRotation(scene) {
    // 使用GSAP为整个场景添加旋转动画
    gsap.fromTo(scene.rotation, { y: -0.2 }, {
        y: 0.2,
        repeat: -1, // 无限重复
        yoyo: true, // 在每次重复时反向播放
        ease: 'power2.inOut', // 缓动函数
        duration: 3 // 持续时间
    });
}

/* Render the scene */
function render(renderer, scene, camera, geometry, vertices) {
    // 定义一个渲染循环函数
    function animate() {
        requestAnimationFrame(animate);
        // 更新几何体中的顶点
        geometry.setFromPoints(vertices);
        // 渲染场景
        renderer.render(scene, camera);
    }
    // 启动渲染循环
    animate();
}

/* Handle window resize events */
function onWindowResize(camera, renderer) {
    // 定义一个窗口大小改变的处理函数
    function handleResize() {
        // 更新相机的纵横比
        camera.aspect = window.innerWidth / window.innerHeight;
        // 更新相机的投影矩阵
        camera.updateProjectionMatrix();
        // 更新渲染器的尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // 监听窗口大小改变事件
    window.addEventListener("resize", handleResize, false);
}

/* 初始化并运行动画 */
function runAnimation() {
    // 初始化场景、相机和渲染器
    const { scene, camera, renderer } = initScene();
    // 创建粒子并添加到场景中
    const { particles, vertices, geometry } = createParticles(scene, "#heart");
    // 为场景添加旋转动画
    addSceneRotation(scene);
    // 启动渲染循环
    render(renderer, scene, camera, geometry, vertices);
    // 处理窗口大小改变事件
    onWindowResize(camera, renderer);
}

/* 开始播放动画 */
runAnimation();
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1df85fffc540408abc713607c1ccd8d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1172&h=756&s=15945709&e=gif&f=187&b=000000)

  


> Demo 地址：https://codepen.io/airen/full/OJYXKwK

  


现在你已经可以提取沿着 SVG 路径的点的坐标了，请尝试着将这些数据应用到其他地方。我相信你能创作出更具吸引力的交互动画效果。

  


## 小结

  


来到这里，表示我们这节课已经接近尾声。最后再稍微对今天课程的内容做一个小结。

  


正如你所看到的，SVG 提供数据给 WebGL，然后 WebGL 凭借其直接访问硬件加速图形的能力，以及其 3D 空间的能力，使 SVG 具备了更强的能力。换句话说，两者的结合，开拓了 Web 三维视觉表达的新天地，并且开创了一系列前所未有的创新效果，极大的丰富了 Web 内容的表面力。

  


除了课程中展示的效果之外，它们的结合，还可以创建更多的效果，并且这些效果是可以用于实际应用场景中。例如：

  


-   **高清不失真的信息图表技术融合**：SVG 确保图标和文字无论放大多少倍都能保持清晰，WebGL 则通过光影处理为这些图形添加深度，使信息图表更加吸引眼球。
-   **沉浸式的 3D 交互体验技术融合**：将 SVG 的二维图形作为纹理贴图应用于 WebGL 创建的 3D 模型上，再配以流畅的动画效果，打造出既细腻又立体的视觉景观。例如，在线博物馆和数字展览馆，参观者仿佛置身其间，能够 360 度旋转展品，近距离观察每一个细节。
-   **动态响应的用户界面技术融合**：SVG 和 WebGL 通过 JavaScript 紧密协作，响应用户的每一次点击、滑动，实现即时的图形变化和动画反馈。例如，交互式新闻报道中，读者可以通过拖动时间轴来观看事件的发展，感受信息的流动和时间的变迁。
-   **真实感光照的视觉强化技术融合**：WebGL 的着色器语言为 SVG 图形添加光照模型，模拟自然界的光影效果，提升视觉逼真度。例如，汽车官网展示，车身在不同的光线环境下展现出真实的金属光泽和色彩渐变，提升潜在买家的购买欲望。
-   **粒子系统带来的震撼视觉技术融合**：WebGL 驱动的粒子系统在 SVG 背景上创造出火焰、爆炸、雨雪等动态效果，增强视觉冲击力。例如，电影预告网站，使用粒子效果模拟爆炸场景，吸引观众的眼球，营造紧张刺激的氛围。
-   **超现实的材质贴图体验技术融合**：通过 WebGL 的纹理映射技术，SVG 图形可被赋予木纹、金属质感等材质，提升虚拟物品的真实性。例如，家具电商平台上，顾客可以旋转并近距离观察家具表面的纹理，如同亲临实体店一般。
-   **互动式 3D 地图导航技术融合**：SVG 定义地图的基本结构，WebGL 则负责地形的 3D 渲染和实时阴影，用户可自由缩放和平移。例如，户外探险应用中，用户能够在三维地图上规划路线，预览沿途风景，享受沉浸式的探索体验。
-   **教育领域的互动模型技术融合**：SVG 和 WebGL 联手打造可交互的生物解剖模型、机械构造演示，使抽象知识具象化。例如，在线医学课程，学生可以通过旋转、拆解 3D 人体模型，深入了解人体结构，提高学习效率。

  


SVG 与 WebGL 的结合，不仅限于上述列举的场景，其潜力随着技术的演进和创意的碰撞不断被挖掘。未来，我们可以期待更多结合了这两项技术的创新应用，如 AR/VR 内容的无缝集成、实时数据驱动的动态场景、以及更加智能化的用户界面设计。开发者和设计师们正站在一个充满无限可能的交叉路口，他们手中的 SVG 与 WebGL，将是塑造下一代互联网体验的关键画笔。随着技术的成熟和工具链的完善，这一技术组合无疑将引领 Web 开发进入一个更为绚丽多彩的新纪元。