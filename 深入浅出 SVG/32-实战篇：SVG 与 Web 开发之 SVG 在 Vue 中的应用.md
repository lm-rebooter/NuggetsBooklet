在当今的 Web 开发领域，技术的进步与创新永无止境。SVG 作为一种灵活的图像格式，已经跻身于前端工程师们的得力工具之列。与此同时，Vue 作为当前备受瞩目的 Web 前端框架之一，以其简洁、灵活的特性在开发者中享有盛誉。这两者的结合不仅打开了全新的创作空间，更为我们带来了前所未有的实现方式和体验。

  


SVG 的特性使其成为了构建交互性、响应式用户界面的理想选择，而 Vue 的数据驱动和组件化开发理念为我们提供了无限的可能性。这对黄金搭档的结合，不仅让前端开发更具创造力和高效性，更为用户带来了无与伦比的视觉和交互体验。

  


这节课将与大家一起深入探讨 SVG 在 Vue 中的应用，为你呈现这个前端开发领域的巅峰组合所带来的魅力和潜力。让我们一起探索，揭开 SVG 与 Vue 结合的无限可能吧！

  


## SVG + Vue 简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80bd8094df064339aeed9e46490a6f53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1180&h=724&s=98968&e=webp&f=42&b=fbfafa)

  


SVG 是一种灵活的矢量图形格式，支持无损放大、动画和交互效果；而 Vue 是一款备受欢迎的 JavaScript 框架，以其简洁的语法、响应式数据绑定和组件化开发而著称。将这两者结合，为 Web 开发者提供了强大的创作工具和实现方式。

  


SVG 在 Vue 中的应用可以说是前端开发的一次革命性尝试。传统的 Web 开发往往依赖于静态图片和繁琐的 DOM 操作，而随着移动端应用的普及和用户对交互体验的不断提升，SVG 的出现为我们带来了全新的解决方案。与传统的图片格式相比，SVG 图像可以无损放大和缩小，并且可以[通过 CSS 和 JavaScript 进行动态控制](https://juejin.cn/book/7341630791099383835/section/7351339840161447945)，使其成为构建响应式和交互式界面的理想选择。

  


在 Vue 中，我们可以通过简单的数据绑定和组件化思想，轻松地将 SVG 图像集成到我们的应用中。无论是制作简单的图标还是复杂的数据可视化图表，SVG 都能够提供灵活、高效的解决方案。例如，我们可以将 SVG 图像封装成 Vue 组件，根据应用的状态动态地渲染不同的图形，实现可复用、可扩展的交互式组件。

  


除了静态图像之外，SVG 还可以结合 Vue 的动画和过渡效果，为用户带来更加生动、流畅的视觉体验。利用 Vue 的过渡组件和动画钩子函数，我们能够轻松实现 SVG 图像的平滑过渡和复杂动画，为用户提供更加丰富的交互效果，从而设计和开发出更具吸引力的用户界面。

  


然而，SVG 的使用可能会有一些挑战，尤其是在像 Vue 这样的现代 JavaScript 框架中。从如何最佳加载 SVG 文件到 Vue 模板中，到处理动画和可访问性，都需要我们注意一些陷阱。接下来，我们将通过实际应用，探讨如何最好地利用 SVG 和 Vue 的优势，为读者提供有价值的经验和启发。

  


## 准备工作

  


在开始使用 SVG 和 Vue 之前，我们需要一个高效的开发环境。[Vite](https://vitejs.dev/) 是一个现代化的前端构建工具，因其速度快且能与 Vue 无缝集成而备受推崇。接下来，我们所有案例的展示都将在 Vite 构建的 Vue 应用中完成。

  


首先，我们需要使用 Vite 构建一个 Vue 应用。对于广大的 Web 前端开发者来说，这个过程非常简单。只需在命令行终端执行以下命令，并根据提示操作，即可构建一个基本的 Vue 应用。

  


```
pnpm create vite svg-vue

cd svg-vue

pnpm install
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e9fde7e99414db59c981eb853badb1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2284&h=1556&s=396020&e=jpg&b=1e1e1e)

  


安装完依赖之后，在命令行执行 `pnpm run dev` ，并在浏览器访问 `http://localhost:5173` ，能看到下面这个界面，说明你已安装成功：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0632e08731d247b194d45480c58d3093~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3348&h=1704&s=228555&e=jpg&b=242424)

  


在初始化后的页面上，已经有了 SVG 的身影，页面中的 Vite 和 Vue 的 Logo 就是通过 SVG：

  


```JavaScript
// App.vue
<template>
    <div>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
</template>
```

  


上面代码所展示的是 Vue 应用中引入 SVG 最基础的方式，它与在 HTML 中引入 SVG 没有太大区别。我们知道，[HTML 默认提供了多种方式来将 SVG 引入到 Web 页面](https://juejin.cn/book/7341630791099383835/section/7344089098363076620)，而这些方式在 Vue 环境下同样适用。那么，首个疑问来了：在 Vue 应用中引入 SVG 与传统 HTML 有何不同，以及有哪些方式是传统开发方式所不具备的呢？

  


## 如何将 SVG 引入 Vue 应用

  


理论上，在 HTML 中使用 SVG 的方式方法都适用于 Vue 环境，但在这里，我们不再重复性的探讨这些相同的方法，以我个人经开发经验来看，我更倾向于使用以下三种方法将 SVG 引入到 Vue 应用。以下这三种方法涵盖了绝大多数的使用案例。

  


-   **以内联的方式引入 SVG**：指直接在 Vue 模板中嵌入 SVG 代码。这样，SVG 元素成为了模板的一部分，你可以直接操作它们。这种方式比较适合简单的、静态的 SVG 图像。
-   **通过构建工具引入 SVG**：指的是使用像 `vue-svg-loader` 、`vite-svg-loader` 和 `svg-sprite-loader` 等构建工具引入 SVG 文件。这种方式可以将 SVG 文件作为模板导入，并进行预处理，如生成 SVG 雪碧图或对 SVG 进行优化。这种方式比较适合需要大量使用和管理 SVG 图像，并需要优化性能的场景。
-   **以 Vue 组件方式引入 SVG**：将 SVG 文件封装为 Vue 组件，这样可以像使用普通 Vue 组件一样使用 SVG 文件。同时可以利用 Vue 的特性，如 `props` 和样式绑定，对 SVG 进行动态操作。这种方式比较适合需要动态操作和样式绑定的场景，灵活性高，适用于现代 Vue 项目。

  


首先来看第一种方式，即以内联的方式引入 SVG。

  


### 以内联的方式引入 SVG

  


在 Vue 开发环境中，同样可以像 SVG 内联到 HTML 中一样，将 SVG 代码直接内联到 Vue 的模板中。这是一种直接且简单的方式。这种方式将 SVG 代码嵌入到 Vue 组件的模板中，允许 Web 开发者在模板中直接操作和样式化 SVG 内容。如同，你使用 CSS 和 JavaScript 直接操作嵌入在 HTML 模板中的 SVG 代码一样。

  


刚才提到过，初始化的 `App.vue` 文件，以最普通的方式将 Vite 和 Vue 的 Logo 文件引入到 Vue 应用中。假设，你现在想将这两个 SVG 文件对应的代码直接嵌入到 `App.vue` 模板中。那么，你可以像下面这样做：

  


```JavaScript
// App.vue
<template>
    <div class="logos">
        <a href="https://vitejs.dev" target="_blank">
            <svg aria-hidden="true"  role="img"  class="icon icon--vue"  viewBox="0 0 256 198" >
                <path  fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"  />
                <path  fill="#41B883"  d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z" />
                <path fill="#35495E"  d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z" />
            </svg>
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <svg aria-hidden="true" role="img" class="icon icon--vite"  viewBox="0 0 256 257" >
                <defs>
                    <linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%" >
                        <stop offset="0%" stop-color="#41D1FF" />
                        <stop offset="100%" stop-color="#BD34FE" />
                    </linearGradient>
                    <linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%"  x2="50.316%" y1="2.242%" y2="89.03%" >
                        <stop offset="0%" stop-color="#FFEA83" />
                        <stop offset="8.333%" stop-color="#FFDD35" />
                        <stop offset="100%" stop-color="#FFA800" />
                    </linearGradient>
                </defs>
                <path d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z" />
                <path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z" />
            </svg>
        </a>
    </div>
</template>
```

  


与 SVG 内联到 HTML 中一样，你可以直接通过 CSS 来控制 SVG 图形的样式：

  


```JavaScript
// App.vue
<style scoped>
    .logos {
        display: flex;
        gap: 2rem;
        align-items: center;
    }
    .icon {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    
    .icon:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    
    .icon.icon--vue:hover {
        filter: drop-shadow(0 0 2em #42b883aa);
    }
</style>
```

  


你将在浏览器中看到的效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd834479ec88455b84b45c562d9e119c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1198&h=590&s=465347&e=gif&f=120&b=1f1f1f)

  


这种方式非常熟悉吧，它与在 HTML 中内联 SVG 以及通过 CSS 控制内联 SVG 元素样式几乎没有任何差异。既然如此，我们不妨来看一些有差异的地方，以充分展示 Vue 的强大之处。通过引入 Vue 的动态绑定和响应式特性，内联 SVG 在 Vue 项目中可以实现更加灵活和动态的效果。

  


接下来，以嵌入一个“辐射圈”图标为例。我们首先在 `src/components` 目录下创建了一个名为 `circleRadiationIcon.vue` 组件。在这个组件中，直接将“辐射圈”图标对应的 SVG 代码嵌入到模板中：

  


```JavaScript
// circleRadiationIcon.vue

<template>
    <div class="app">
        <h1>内联 SVG</h1>
        <svg class="icon icon-circle-radiation" viewBox="0 0 512 512">
          <path  d="M256 64a192 192 0 1 1 0 384 192 192 0 1 1 0-384zm0 448A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM200 256c0-20.7 11.3-38.8 28-48.5l-36-62.3c-8.8-15.3-28.7-20.8-42-9c-25.6 22.6-43.9 53.3-50.9 88.1C95.7 241.5 110.3 256 128 256l72 0zm28 48.5l-36 62.4c-8.8 15.3-3.6 35.2 13.1 40.8c16 5.4 33.1 8.3 50.9 8.3s34.9-2.9 50.9-8.3c16.7-5.6 21.9-25.5 13.1-40.8l-36-62.4c-8.2 4.8-17.8 7.5-28 7.5s-19.8-2.7-28-7.5zM312 256l72 0c17.7 0 32.3-14.5 28.8-31.8c-7-34.8-25.3-65.5-50.9-88.1c-13.2-11.7-33.1-6.3-42 9l-36 62.3c16.7 9.7 28 27.8 28 48.5zm-56 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
        </svg>
    </div>
</template>

<script setup>
    const name = "circleRadiationIcon";
</script>

<style scoped>
    .app {
        display: grid;
        place-content: center;
        gap: 2rem;
    }
    .icon {
        display: block;
        width: 5rem;
        aspect-ratio: 1;
        place-self: center;
    }
</style>
```

  


接着在 `App.vue` 中引入新创建的 `circleRadiationIcon` 组件：

  


```JavaScript
// App.vue

<script setup>
    import circleRadiationIcon from './components/circleRadiationIcon.vue'
</script>

<template>
    <circleRadiationIcon />
</template>
```

  


你现在在浏览器中看到的效果是像下面这样的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7cb2e486d8c43be8ae0304b82546b3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3352&h=1858&s=193206&e=jpg&b=242424)

  


接下来，我们利用 Vue 的数据绑定特性，来动态修改 SVG 的属性，例如 `<path>` 元素的 `fill` 属性：

  


```JavaScript
// circleRadiationIcon.vue

<template>
    <svg class="icon icon-circle-radiation" viewBox="0 0 512 512">
        <path :fill="fillColor" d="M256 64a192 192 0 1 1 0 384 192 192 0 1 1 0-384zm0 448A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM200 256c0-20.7 11.3-38.8 28-48.5l-36-62.3c-8.8-15.3-28.7-20.8-42-9c-25.6 22.6-43.9 53.3-50.9 88.1C95.7 241.5 110.3 256 128 256l72 0zm28 48.5l-36 62.4c-8.8 15.3-3.6 35.2 13.1 40.8c16 5.4 33.1 8.3 50.9 8.3s34.9-2.9 50.9-8.3c16.7-5.6 21.9-25.5 13.1-40.8l-36-62.4c-8.2 4.8-17.8 7.5-28 7.5s-19.8-2.7-28-7.5zM312 256l72 0c17.7 0 32.3-14.5 28.8-31.8c-7-34.8-25.3-65.5-50.9-88.1c-13.2-11.7-33.1-6.3-42 9l-36 62.3c16.7 9.7 28 27.8 28 48.5zm-56 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
    </svg>
</template>

<script setup>
    import { ref, watch, defineProps } from "vue";
    const name = "circleRadiationIcon";
    
    // 用于声明该组件接受一个名为 fillColor 的 prop
    const props = defineProps(["fillColor"]);
    
    // fillColor 是一个 ref，初始值为传入的 fillColor，如果没有传入，则默认为 "lime"。
    const fillColor = ref(props.fillColor || "lime");
    
    // 使用 watch 监听 props.fillColor 的变化，并在变化时更新 fillColor
    watch(
        () => props.fillColor,
        (newVal) => {
            fillColor.value = newVal;
        }
    );
</script>

<style scoped>
    .icon {
        display: block;
        width: 5rem;
        aspect-ratio: 1;
    }
</style>


// App.vue
<template>
    <div class="icons">
        <!-- 没有传入 fillColor，因此会使用默认的 "lime" -->
        <circleRadiationIcon />
        
        <!-- 传入了 customColor，fillColor 的值为 customColor -->
        <circleRadiationIcon :fillColor="customColor" />
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import circleRadiationIcon from "./components/circleRadiationIcon.vue";
    const customColor = ref("red");
</script>

<style scoped>
    .icons {
        display: flex;
        gap: 2rem;
        align-items: center;
    }
</style>
```

  


在 `circleRadiationIcon` 组件中，SVG 的 `<path>` 元素的 `fill` 属性绑定到 `fillColor`。通过使用 `ref` 和 `watch`，该组件能够管理和响应 `fillColor` 的变化。在其他地方引用 `circleRadiationIcon` 组件时，可以通过传入不同的 `fillColor` 动态改变 SVG 图形的填充颜色，从而使这个 SVG 图标在不同的上下文中重复使用，具备更高的灵活性和可复用性。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1514316478254d97b9ffe44803f62a1c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3344&h=1950&s=187526&e=jpg&b=ffffff)

在 Vue 的开发环境之下，除了动态绑定属性之外，还可以使用 Vue 的指令和事件处理器对 SVG 进行更复杂的交互。例如，当用户点击 SVG 图标时，改变其颜色：

  


```JavaScript
// circleRadiationIcon.vue

<template>
    <!-- 绑定点击事件 -->
    <svg @click="toggleColor" class="icon icon-circle-radiation"  viewBox="0 0 512 512">
        <!-- 使用 :fill 动态绑定颜色 -->
        <path :fill="fillColor" d="M256 64a192 192 0 1 1 0 384 192 192 0 1 1 0-384zm0 448A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM200 256c0-20.7 11.3-38.8 28-48.5l-36-62.3c-8.8-15.3-28.7-20.8-42-9c-25.6 22.6-43.9 53.3-50.9 88.1C95.7 241.5 110.3 256 128 256l72 0zm28 48.5l-36 62.4c-8.8 15.3-3.6 35.2 13.1 40.8c16 5.4 33.1 8.3 50.9 8.3s34.9-2.9 50.9-8.3c16.7-5.6 21.9-25.5 13.1-40.8l-36-62.4c-8.2 4.8-17.8 7.5-28 7.5s-19.8-2.7-28-7.5zM312 256l72 0c17.7 0 32.3-14.5 28.8-31.8c-7-34.8-25.3-65.5-50.9-88.1c-13.2-11.7-33.1-6.3-42 9l-36 62.3c16.7 9.7 28 27.8 28 48.5zm-56 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
    </svg>
</template>

<script setup>
    import { ref, watch, defineProps } from "vue";
    const name = "circleRadiationIcon";
    // 定义组件接收的属性
    const props = defineProps({
        fillColor: {
            type: String,
            default: "lime", // 默认颜色
        },
        toggleColor: {
            type: String,
            default: "blue", // 点击后切换的颜色
        },
    });
    
    // 创建一个 ref 用于管理当前的填充颜色
    const fillColor = ref(props.fillColor || "lime");
    
    // 监听 props.fillColor 的变化，并在变化时更新 fillColor
    watch(
        () => props.fillColor,
        (newVal) => {
            fillColor.value = newVal;
        }
    );
    
    // 定义一个方法用于切换颜色
    const toggleColor = () => {
        // 如果当前颜色是初始颜色，则切换到点击颜色，否则切换回初始颜色
        fillColor.value = fillColor.value === props.fillColor ? props.toggleColor : props.fillColor;
    };
</script>

// App.vue
<template>
    <div class="icons">
        <!-- 没有传入 fillColor 和 toggleColor，因此会使用默认的 "lime" 和 "blue" -->
        <circleRadiationIcon />
    
        <!-- 传入了 customColor 和 toggleColor，点击时颜色将会在两者之间切换 -->
        <circleRadiationIcon :fillColor="customColor" :toggleColor="toggleColor" />
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import circleRadiationIcon from "./components/circleRadiationIcon.vue";
    
    // 定义 ref 用于管理自定义的初始颜色和点击后的颜色
    const customColor = ref("red");   // 初始颜色为红色
    const toggleColor = ref("green"); // 点击后的颜色为绿色
</script>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a9a2088e7c04da8a931797fc93d50ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=572&s=136454&e=gif&f=110&b=ffffff)

与传统方式相比（SVG 内联在 HTML 中），SVG 内联到 Vue 组件模板中有着明显的优势：

  


-   可以将 SVG 封装在单个 Vue 组件中，结合了 HTML、CSS 和 JavaScript ，使得代码模块化、组织清晰，易于复用和维护
-   通过 Vue 的响应系统，数据变化时，UI 自动更新，无需手动操作 DOM，提高了开发效率
-   使用 Vue 的指令和事件绑定，使得事件处理逻辑清晰明确，状态管理更加简洁，通过 `ref` 和 `wacth` 实现数据的响应式管理

  


这意味着，Vue 组件化开发模式下内联 SVG 更加灵活、高效，能够更好地管理数据、事件和状态，提升了开发效率和代码可维护性。

  


虽然 SVG 直接内联在 Vue 组件模板中，具备诸多优点，例如简单直接、完全可控制、动态绑定等，但并不意味着这种方式没有任何的缺点。

  


-   代码冗长：对于复杂或大量的 SVG 图像，内联代码会变得冗长，影响可读性
-   重复使用：不适合需要多次使用相同 SVG 的情况，重复代码较多
-   维护成本：直接在模板中嵌入大量 SVG 代码，维护起来可能较为麻烦

  


因此，根据这种方式的利弊，SVG 内联在 Vue 模板中的方式比较适应于嵌入简单的、少量的 SVG 图像，或者说适用于小型项目或不频繁重复使用的 SVG 图像。

  


### 通过构建工具引入 SVG

  


正如中级篇《[SVG 构建工具](https://juejin.cn/book/7341630791099383835/section/7366975819270324275)》所介绍的，Web 开发者在利用 SVG 进行开发时，可以借助一些构建工具来高效快速地使用 SVG。这些构建工具并非局限于特定的 Web 框架，它们的差异主要体现在配置和使用上，取决于所选用的 Web 框架和开发环境。

  


在 Vue 开发环境中，有一系列优秀的构建工具可供处理 SVG 文件，其中包括 `vue-svg-loader`、`vite-svg-loader`、`vue-inline-svg` 和 `vite-plugin-svg` 等。我们以这几个常见的 SVG 构建工具为例：

  


-   `vue-svg-loader` 和 `vite-svg-loader` 主要用于将 SVG 文件转换为 Vue 组件或 JavaScript 模板，以便在 Vue 项目中使用。它们能够处理 SVG 文件的加载和转换，并提供一些配置选项来满足不同的需求。值得注意的是，`vue-svg-loader` 适用于 Vue CLI 构建的 Vue 应用，而 `vite-svg-loader` 则适用于 Vite 构建的 Vue 应用。
-   `vue-inline-svg` 则专注于在 Vue 项目中以内联的方式引入 SVG，允许直接在 Vue 模板中使用 SVG 代码。作为一个 Vue 插件，它提供了额外的功能，比如缓存和优化。只需简单的安装和配置，就能够在 Vue CLI 或 Vite 构建的 Vue 项目中轻松应用。
-   而 `vite-plugin-svg` 则专为 Vite 构建的项目而设计，提供了一种简便的方式来处理 SVG 文件。它能够将 SVG 文件转换为 Vue 组件，并在 Vite 构建的 Vue 项目中进行动态加载。

  


这些工具在功能、特性和集成方式上各有不同，开发者可以根据项目需求和所选用的构建工具，选择最合适的 SVG 处理工具。此外，你也可以自定义一些 SVG 插件，以满足特定的功能需求。

  


由于我们的开发环境是基于 Vite 构建的 Vue 应用，接下来我们以 `vite-svg-loader 插件`为例，向大家展示如何通过构建工具将 SVG 引入到 Vue 应用中。

  


为了在 Vite Vue 应用中使用 `vite-svg-loader` 插件，你需要先安装 `vite-svg-loader` 包。你可以通过以下命令来进行安装：

  


```
pnpm i -D vite-svg-loader  
```

  


然后配置 `vite.config.js` ：

  


```JavaScript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
    plugins: [vue(),svgLoader()],
})
```

  


这样，你就可以在项目中使用 `vite-svg-loader` 插件的相关功能。该插件不仅简化了 SVG 的导入，还提供了灵活的定制行为和优化 SVG 的能力。它提供了几种不同的导入方式。

  


我们从最简单的方式开始，即通过 SVG 的 URL 的方式引入 SVG，如果你需要导入一个重量级的静态图像，请在导入的 SVG 文件后面添加 `?url` 后缀。该 SVG 图像将作为 URL 导入：

  


```JavaScript
// App.vue
<template>
    <img :src="vueLogo" alt="Vue Logo" class="logo"/>
</template>

<script setup>
    import vueLogo from "./assets/vue.svg?url";
</script>
<style scoped>
    .logo {
        display: block;
        width: 10rem;
    }
</style>
```

  


上面代码中的 `vueLogo` 变量将保存导入的 SVG 图像的 URL，通过 Vue 中的动态绑定语法（`:src`）将 `vueLogo` 变量的值绑定到 `<img>` 元素的 `src` 属性上。这样，`vueLogo` 的值将被解析为 SVG 图像的 URL。实现了在 Vue 项目中显示 SVG 图像的功能：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01e49400477b4816b866064f67b02ac1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3358&h=1958&s=375914&e=jpg&b=ffffff)

  


这种方式的好处是，你的 SVG 不会包含在你的 JavaScript 捆绑包中。

  


另一种导入 SVG 的方式是内联 SVG。如果你需要将一个 SVG 图标导入到 Vue 项目中，只需要在导入的 SVG 文件后面添加 `?raw` 后缀。在这种情况下，导入返回一个带有内联 SVG 的字符串：

  


```JavaScript
// App.vue

<template>
    <div class="app">
        <h2>内联 SVG</h2>
        <div class="icons">
            <span class="icon icon--facebook" v-html="facebook" />
            <span class="icon icon--x-twitter" v-html="xTwitter" />
        </div>
    </div>
</template>
<script setup>
    // 内联 SVG
    import facebook from "./assets/icons/facebook.svg?raw";
    import xTwitter from "./assets/icons/x-twitter.svg?raw";
</script>
```

  


上面代码通过将 SVG 图标文件导入到 `App` 组件中，并使用 `v-html` 指令将 SVG 图标的 HTML 内容渲染到对应的元素中（`<span>`），实现了在 Vue 中使用内联 SVG 的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86eff148fc5b4cba9846639f182ed5bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3346&h=1956&s=611325&e=jpg&b=ffffff)

  


与 URL 导入 SVG 方式相比，其好处是显而易见的，你拥有比 URL 导入更广泛的样式控制：

  


```JavaScript
// App.vue
<style scoped>
     .icon {
        display: block;
        width: 3rem;
        aspect-ratio: 1;
        cursor: pointer;
    }
    
    .icon >>> svg {
        display: block;
        width: 100%;
        height: 100%;
        fill: #000;
        transition: fill 0.2s linear;
    }
    
    .icon:hover >>> svg {
        fill: #f36;
    }
</style>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a81366e20d0844cd81367f61ab811e58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=514&s=134060&e=gif&f=109&b=ffffff)

  


除了前面两种方式之外，你还可以在导入的 SVG 文件后面添加 `?component` 后缀，SVG 将明确地作为 Vue 组件导入，具有其所有优势。

  


```JavaScript
// App.vue
<template>
    <div class="app">
        <h2>Vue 组件</h2>
        <div class="components">
            <Discord width="400" />
            <Linkedin fill="blue" />
            <Reddit :fill="redditFill" />
            <Mastodon @click="changeMastodonColor" :fill="mastodonFill" />
        </div>
    </div>
</template>

<script setup>
    // 导入 ref 函数
    import { ref } from "vue";

    // Vue 组件
    import Discord from "./assets/icons/discord.svg?component";
    import Linkedin from "./assets/icons/linkedin.svg?component";
    import Reddit from "./assets/icons/reddit.svg?component";
    import Mastodon from "./assets/icons/mastodon.svg?component";
    
    // Reddit 组件填充颜色数据
    const redditFill = ref("#FF4500"); // 初始为 Reddit 橙色
    
    // Mastodon 组件填充颜色数据
    const mastodonFill = ref("#663399"); // 初始为紫色
    
    // Mastodon 图标颜色切换状态
    const mastodonColorState = ref(true); // 初始为 true，表示初始状态为紫色
    
    // Mastodon 组件填充颜色点击事件处理函数
    const changeMastodonColor = () => {
        // 切换状态
        mastodonColorState.value = !mastodonColorState.value;
        // 根据状态改变颜色
        mastodonFill.value = mastodonColorState.value ? "#663399" : "#1E90FF";
    };
</script>

<style scoped>
    .components svg {
        transition: fill .2s ease-in-out;
    }
    
    .components svg:hover {
        fill: #09a;
    }
</style>
```

  


这段代码展示了如何在 Vue 中使用 SVG 图标组件，并通过 Vue 的响应式机制和事件绑定来实现动态改变 SVG 图标的填充颜色。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56da3160c71c4bc5bf1c17b1e3c360d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=674&s=623231&e=gif&f=188&b=ffffff)

  


现在，你可以将每个 SVG 作为组件（`?component`）、URL（`?url`）或内联 SVG（`?raw`）导入到 Vue 项目中。不过，单独导入每个 SVG 会在我们的项目中造成一定的混乱。为了避免这种现象，我们可以创建一个 `Icon` 组件，动态加载我们想要的 SVG：

  


```JavaScript
// Icon.vue

<template>
    <!-- 使用动态组件显示图标 -->
    <component 
        :is="icon"             
        class="icon"           
        :style="{ fill: currentColor }"
        @mouseenter="handleMouseEnter"   
        @mouseleave="handleMouseLeave"   
        @click="toggleColor"             
    />
</template>

<script setup>
    // 导入 Vue 的组件定义和响应式函数
    import { defineAsyncComponent, defineProps, ref } from 'vue';
    
    // 定义组件的输入属性
    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        fillColor: {
            type: String,
            required: true,
        },
        hover: {
            type: String,
            default: '',
        },
    });
    
    // 创建一个响应式变量来存储悬停时的颜色
    const hoverColor = ref(props.hover);
    
    // 创建一个响应式变量来存储当前的颜色
    let currentColor = ref(props.fillColor);
    
    // 创建一个响应式变量来标记是否已经点击过图标
    let clicked = ref(false);
    
    // 异步加载图标组件
    const icon = defineAsyncComponent(() =>
        import(`../assets/icons/${props.name}.svg`)
    );
    
    // 定义一个函数，在点击图标时切换颜色
    const toggleColor = () => {
        clicked.value = !clicked.value;
        currentColor.value = clicked.value ? hoverColor.value : props.fillColor;
    };
    
    // 定义一个函数，当鼠标进入图标时改变颜色为悬停时的颜色
    const handleMouseEnter = () => {
        currentColor.value = hoverColor.value;
    };
    
    // 定义一个函数，当鼠标离开图标时根据点击状态切换颜色
    const handleMouseLeave = () => {
        if (!clicked.value) {
            currentColor.value = props.fillColor;
        }
    };
</script>
<style scoped>
    .icon {
        transition: fill ease-in-out;
    }
</style>
```

  


现在你可以在你的项目中需要时导入这个新组件（`Icon`）:

  


```JavaScript
// App.vue
<template>
    <div class="app">
        <h2>自定义 Icon 组件</h2>
        <Icon name="instagram" fillColor="#E1306C" hover="#405DE6"  width="240"/>
    </div>
</template>

<script setup>
    import Icon from './components/Icon.vue';
</script>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6005029ef8f14cf5af73820a8e145fd0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1288&h=704&s=362266&e=gif&f=155&b=ffffff)

  


上面所展示的是 `vite-svg-loader` 提供的几种 SVG 导入到 Vue 项目中的方式。正如你所见，每种方式都有其利弊，现在你可以选择最合适的方式将 SVG 导入到 Vue 项目中，来增强你的 Web 开发工作流，减少页面加载时间，并确保你的项目保持轻量级和高性能。

  


`vite-svg-loader` 插件还可以配置 `svgo` 对引入的 SVG 进行优化。需要安装 `svgo` :

  


```
pnpm i -D svgo      
```

  


然后在 `vite.config.js` 文件中配置 `vite-svg-loader` 并设置 `svgo` 插件选项：

  


```JavaScript
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

// 配置 svgo
const svgoOptions = {
  plugins: [
    { name: 'removeViewBox', active: false }, // 保留 viewBox 属性
    { name: 'removeDimensions', active: true }, // 移除宽度和高度属性
    { name: 'addAttributesToSVGElement', params: { attributes: [{ focusable: false }] } }, // 添加自定义属性
    {
      name: "removeViewBox",
      active: false,
    },
    {
      name: "addAttributesToSVGElement", 
      params: {
        attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
      },
    },
    {
      name: "removeDimensions", // 移除宽度和高度属性
      active: true,
    },
    {
      name: "convertColors", // 转换颜色为短格式
      params: {
        currentColor: true,
      },
    },
    {
      name: "removeDoctype",
      active: true,
    },
    {
      name: "removeMetadata",
      active: true,
    },
    {
      name: "removeDimensions",
      active: true,
    },
    {
      name: "removeComments",
      params: {
        preservePatterns: ["^!"]
      }
    },
    {
      name: "removeEditorsNSData",
      active: true,
    },

    {
      name: "removeRasterImages",
      active: true,
    },
    {
      name: "removeUselessDefs",
      active: true,
    },
    {
      name: "removeUnknownsAndDefaults",
      active: true,
    },
    {
      name: "removeUselessStrokeAndFill",
      active: true,
    },
    {
      name: "removeHiddenElems",
      active: true,
    },
    {
      name: "removeEmptyText",
      active: true,
    },
    {
      name: "removeEmptyAttrs",
      active: true,
    },
    {
      name: "removeEmptyContainers",
      active: true,
    },
    {
      name: "removeUnusedNS",
      active: true,
    },
    {
      name: "removeDesc",
      active: true,
    },
    {
      name: "prefixIds",
      active: true,
    },
    {
      name: "removeXlink",
      active: true,
    },
    {
      name: "removeXMLNS",
      active: true,
    },
    {
      name: "removeXMLProcInst",
      active: true,
    },
    {
      name: "minifyStyles",
      active: true,
    },
    {
      name: "sortAttrs",
      active: true,
    },
    {
      name: "sortDefsChildren",
      active: true,
    },

    {
      name: "preset-default",
      active: true,
    },
    {
      name: "removeUselessStrokeAndFill",
      active: true,
    },
    {
      name: "convertPathData",
      active: true,
    },
    {
      name: "convertStyleToAttrs",
      active: true,
    },
    {
      name: "cleanupAttrs",
      active: true,
    },
    {
      name: "cleanupEnableBackground",
      active: true,
    },
    {
      name: "collapseGroups",
      active: true,
    },
    {
      name: "convertShapeToPath",
      active: true,
    },
    {
      name: "convertStyleToAttrs",
      active: true,
    },
    {
      name: "mergePaths",
      active: true,
    },
    {
      name: "moveElemsAttrsToGroup",
      active: true,
    },
  ]
};

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: svgoOptions
    }),
  ],
});
```

  


配置完成后，你可以在 Vue 组件中使用优化过的 SVG 文件。

  


```
// App.vue
<template>
    <div class="app">
        <Woman />
    </div>
</template>

<script setup>
    import { defineAsyncComponent } from 'vue';

    const Woman = defineAsyncComponent(() => import('./assets/woman.svg?component'));
</script>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bc585f60f484a54a44a069715072832~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3356&h=1962&s=1340603&e=jpg&b=24272e)

  


如上图所示，优化前后的 SVG 代码有明显的差异。

  


通过这种方式，你可以在 Vite 项目中使用 `vite-svg-loader` 并利用 `svgo` 对 SVG 进行优化，从而提升项目的性能和代码质量。

  


注意，有关于 SVG 代码优化相关的内容，可以移步阅读小册的中级篇的《[优化 SVG](https://juejin.cn/book/7341630791099383835/section/7368114202180845605)》！这里就不做过多的阐述。

  


### 以 Vue 组件的方式引入 SVG

  


其实，在介绍如何通过 `vite-svg-loader` 引入 SVG 时，我们已经提到了以组件方式引入 SVG。不过，接下来我们将讨论在不依赖构建工具的前提下，Vue 组件如何将 SVG 引入项目。这种方法不仅让你在动画制作上拥有最大的灵活性，还能直接控制 SVG 元素。同时，这种方式允许轻松导入 SVG，不需要额外的依赖项或配置更改！

  


通过这种方法，你可以更自由地操作 SVG，创建更加丰富和动态的用户界面效果。这不仅提升了开发效率，还使项目更具可维护性和扩展性。

  


接下来，我们以点赞图标为例：

  


```XML
<svg viewBox="0 0 512 512">
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
</svg>
```

  


上面是 `heart.svg` 文件（点赞图标）对应的 SVG 代码。

  


假设我们的“点赞”图标会在多个不同的组件或页面中使用，为了方便重复使用，我们通常会将它封装成一个 Vue 组件，比如 `Heart`，这个组件专门用于 `heart.svg` 文件及其样式。这样，无论我们在项目的哪个地方需要使用这个“点赞”图标时，只需像使用其他 Vue 组件一样导入并使用它，非常方便。

  


```JavaScript
<template>
    <svg class="icon icon--heart" viewBox="0 0 512 512">
        <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
    </svg>
</template>

<script setup>
    // 使用 Vue 3 的 Composition API 编写
    // 如果需要引入其他功能，可以在这里进行引入和定义
</script>

<style scoped>
    .icon {
        display: block;
        width: 1em;
        aspect-ratio: 1;
        fill: currentColor;
        transition: all .2s ease-in-out;
    }
</style>
```

  


```JavaScript
// App.vue
<template>
    <div class="app">
        <Heart />
    </div>
</template>

<script setup>
    import Heart from './components/Heart.vue';
</script>

<style scoped>
    .app {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    
    .app svg {
        color: #000;
        font-size: 10vh;
    }
</style>
```

  


这种方法有几个显著的优点：

  


-   易于使用：它使 SVG 文件在任何地方都易于使用。你只需要像导入其他 Vue 组件一样导入并使用它即可，非常简单方便
-   内联渲染：SVG 文件内联渲染到页面，所以你可以对它的各个部分进行样式设置和动画处理，但并不会占用主模板文件和组件中的额外空间
-   充分利用 Vue 的特性：你可以利用 Vue 所有特性，例如动态绑定，指令和事件处理等。如果你有 SVG 的不同版本（例如，暗黑模式下反转 SVG 或不同样式的图标），可以轻松地在 Vue 组件中切换

  


当然，这种方法也有明显的缺点，你需要手动移动和可能编辑 SVG 文件的实际代码，这需要一些额外的工作。如果只是一个永远不会更改，不需要逻辑或不会经常更改的静态图像，把 SVG 文件转为 Vue 组件可能不值得这么做。

  


如果你希望能够使用 JavaScript 逻辑来更新图像的外观，或根据当前应用程序状态调整图像，那么将这种方法将是一个理想的选择！

  


以点赞按钮为例，假设你的应用中有一个“点赞”图标按钮。用户可以点击该按钮。最初，它只是一个轮廓（如下图左侧所示），但当用户点击它时，“点赞”图标（心形）会被填充成高亮颜色，以表示用户已点赞（如下图右侧所示）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/810fd975cc3140749b3e9eb0cb7a8b2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=816&s=470158&e=jpg&b=fbf9f9)

  


这种效果在 Web 应用中随处可见。过去，为了实现这种效果，你通常需要准备两个不同的图像，并在需要时即时替换它们。但有了 SVG，你可以通过 CSS 和 JavaScript 来轻松控制图像的显示。在 Vue 中，这变得更加简单。你只需创建一个接受 Props 的组件，根据状态动态渲染图标即可。

  


调整后的 `Heart` 组件如下：

  


```JavaScript
// Heart.vue
<template>
    <svg class="icon icon--heart"  viewBox="-20 -20 552 552" >
        <path
            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
            :fill="liked ? fillColor : 'none'"
            :stroke="liked ? 'none' : strokeColor"
            :stroke-width="strokeWidth"
        />
    </svg>
</template>
  
<script setup>
    import { defineProps, computed } from 'vue';
  
    // 使用 defineProps() 定义组件的 props 属性
    const props = defineProps({
        // liked 属性表示点赞状态，类型为 Boolean。
        liked: Boolean,
    
        // fillColor 属性表示心形图标的填充颜色，类型为 String，默认值为 'red'。
        fillColor: {
            type: String, // 属性类型为字符串
            default: 'red' // 默认值为红色
        },
    
        // strokeColor 属性表示心形图标的描边颜色，类型为 String，默认值为 'gray'。
        strokeColor: {
            type: String, // 属性类型为字符串
            default: 'gray' // 默认值为灰色
        },
    
        // strokeWidth 属性表示心形图标的描边宽度，类型可以是 Number 或 String，默认值为 2。
        strokeWidth: {
            type: [Number, String], // 属性类型可以是数字或字符串
            default: 2 // 默认值为 2
        }
    });
</script>
  
<style scoped>
    .icon {
        display: block;
        width: 1em;
        aspect-ratio: 1;
        transition: all 0.2s ease-in-out;
    }
</style>  
```

  


在 `Heart.vue` 中，我们定义了三个属性 `fillColor`、`strokeColor` 和 `strokeWidth`，这些属性允许我们在组件外部传递值。现在，你可以在项目中的任何地方引 `Heart` 组件，并传递 `liked`、`fillColor`、`strokeColor` 和 `strokeWidth` 的值。

  


```JavaScript
// App.vue

<template>
    <button @click="toggleLike">
        <Heart :liked="liked" fillColor="#E63C80" strokeColor="#57636D" strokeWidth="30" />
    </button>
</template>

<script setup>
    import { ref } from 'vue';
    import Heart from './components/Heart.vue';
    
    // 初始化 liked 变量
    const liked = ref(false);
    
    // 点击事件处理函数，切换 liked 变量的值
    const toggleLike = () => {
        liked.value = !liked.value;
    };
</script>

<style scoped>
    button {
        appearance: none;
        padding: 0;
        border: none;
        background: transparent;
        font-size: 64px;
        display: grid;
        place-content: center;
        cursor: pointer;
    }
</style>
```

  


与此同时，`App.vue` 中的按钮（`<button>`）绑定了 `click` 事件，每次点击，`liked` 的值会切换，从而动态改变心形图标的填充和描边效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f3a4d6736104fe7bcd322990c7d5084~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=488&s=336175&e=gif&f=233&b=ffffff)

  


将 SVG 以 Vue 组件的方式引入，另一个优势是能够更好地处理 Web 的可访问性问题。Web 可访问性（也称为“A11Y”）的一个核心原则是：**用户不应该依赖视觉来判断某个元素的状态或意义。页面的每一个重要部分都应该对非视觉用户同样友好和易于理解**。

  


上面示例中的“心形”图标具有明确的语义意义（它向用户传达他们是否点赞）。因此，我们需要确保依赖辅助技术（如屏幕阅读器）的用户也能非视觉地判断图标的状态——被按下表示“已点赞”，未按下表示“未点赞”。这样可以确保所有用户都能准确理解图标的功能和当前状态。

  


因此，为了使你的 Web 应用更具可访问性，我们需要处理两件关键事项。首先，要为“心形”按钮添加一个可访问的名称。小册的《[SVG 中的可访问性](https://juejin.cn/book/7341630791099383835/section/7366549423712632882)》一节课中提供了多种实现这一目标的方法。在这里，我将向大家展示两种不同的方法。第一种方式，则是在引用 `Heart` 组件的 `<button>` 按钮添加 `aria-label` 标签，并根据 `liked` 属性的值，为不同的状态提供不一样的描述文案：

  


-   当 `liked` 的值为 `true` 时，表示“已点赞”
-   当 `liked` 的值为 `false` 时，表示“未点赞”

  


在 Vue 中，我们可以通过一个简单的三元运算符来处理：

  


```JavaScript
// App.vue
<template>
    <button @click="toggleLike" :aria-label="liked ? '已点赞' : '未点赞'">
        <Heart :liked="liked" fillColor="#E63C80" strokeColor="#57636D" strokeWidth="30" />
    </button>
</template>

<script setup>
    import { ref } from 'vue';
    import Heart from './components/Heart.vue';
    
    // 初始化 liked 变量
    const liked = ref(false);
    
    // 点击事件处理函数，切换 liked 变量的值
    const toggleLike = () => {
        liked.value = !liked.value;
    };
</script>
```

  


与此同时，需要给 `Heart` 组件的 `<svg>` 元素设置 `aria-hidden="true"` ：

  


```JavaScript
// Heart.vue
<template>
    <svg
        class="icon icon--heart"
        viewBox="-20 -20 552 552"
        aria-hidden="true"
    >
        <path
            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
            :fill="liked ? fillColor : 'none'"
            :stroke="liked ? 'none' : strokeColor"
            :stroke-width="strokeWidth"
        />
    </svg>
</template>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2b02ad4f6ab46fdac4306ff0d839aa6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1646&h=582&s=1308791&e=gif&f=148&b=1c2224)

  


这个时候，初始状态之下，当按钮获得焦点时，屏幕阅读器会朗读“未点赞，按钮”；反之，当按钮点击之后，屏幕阅读器则会朗读“已点赞，按钮”。

  


上面的方式是依赖于 ARIA 相关特性来处理 Web 可访问。事实上，SVG 嵌入在 Vue 组件模板时，我们还可以直接通过 SVG 的 `<title>` 元素来优化 Web 可访问性。比如，在 `Header` 组件的 `<svg>` 元素中添加一个 `<title>` 元素，它的内容同样根据 `liked` 的值做相应的切换：

  


```JavaScript
// Heart.vue
<template>
    <svg
        class="icon icon--heart"
        viewBox="-20 -20 552 552"
        role="img"
    >
      <title>{{ liked ? '已点赞' : '未点赞' }}</title> 
      <path
          d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
          :fill="liked ? fillColor : 'none'"
          :stroke="liked ? 'none' : strokeColor"
          :stroke-width="strokeWidth"
      />
    </svg>
  </template>
  
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c12f7b8fa14a4c06a6ea4bf3fc279273~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1668&h=572&s=4295684&e=gif&f=374&b=1d2325)

  


注意，记得给 `<svg>` 元素设置 `role` 为 `img` ，在这个示例中，它的角色就是图像。

  


这样，使用辅助技术的用户可以轻松理解图标的当前状态。这个方法不仅简单而且非常有效，确保了我们的图标对于所有用户都是可访问的。

  


此外，由于包含 SVG 的按钮实际上是一个双向切换开关——按钮要么将其关联“已点赞”，要么关联“未点赞”——因此最好在按钮元素上使用动态的 `:aria-pressed="liked"`。

  


```JavaScript
// App.vue
<template>
    <button @click="toggleLike" :aria-pressed="liked">
        <Heart :liked="liked" fillColor="#E63C80" strokeColor="#57636D" strokeWidth="30" />
    </button>
</template>
```

  


这样一来，按钮可以明确传达其当前状态，并表明它是一个切换开关，有两种可能的状态：开或关，真或假。

  


如果没有这种明确性，使用辅助技术的用户可能会聚焦到按钮上，只听到他们的屏幕阅读器从 SVG 的 `title` 中朗读“已点赞”或“未点赞”，但由于缺乏上下文，他们可能会对按钮的功能感到困惑。

  


在做出可访问性决策时，与真实用户进行测试始终是至关重要的。错误地使用那些本应提高可访问性的标签（特别是 ARIA 标签）反而可能会起到反效果。即使你达到了预期效果，也可能发现这并不是用户所喜欢的。因此，不要对你的可访问性选择对用户的影响做任何假设，而是从源头获取信息。

  


> 有关于 SVG 可访问性更详细的内容，请移步阅读《[SVG 中的可访问性](https://juejin.cn/book/7341630791099383835/section/7366549423712632882)》！

  


我们已经详细介绍了在Vue开发环境中使用 SVG 的三种常见方式：内联方式、通过构建工具引入，以及以 Vue 组件的方式引入。每种方式都有其优缺点和适用场景。

| **使用 SVG 方式**     | **优点**       | **缺点**         | **适用场景**  |
| ----------------- | ---------------- | ----------------- | -------- |
| **内联方式**          | 1：无需额外请求服务器，可以减少HTTP请求，加快页面加载速度。<br /> 2：可以直接在Vue模板中使用SVG代码，方便快捷。<br/>3:可以通过直接编辑SVG代码进行微调和定制。                                                         | 1：当SVG图标较多时，会增加模板文件的体积，导致维护困难和可读性下降。<br />2：可能会导致HTML文件过大，影响页面加载性能。<br />3：内联SVG的样式不易维护，难以实现样式的复用和管理。 | 1：适用于一些简单的、数量不多的SVG图标，且这些图标在整个应用中都会被使用到。<br />2：对于需要频繁更改和定制的SVG图标，以及需要与Vue组件的数据进行交互的场景。         |
| **通过构建工具引入**      | 1：可以使用构建工具（如Vite、Webpack、Rollup等）的 SVG 加载器，实现自动化处理 SVG 文件，包括优化、压缩、缓存等。<br />2：可以将 SVG 分离成单独的文件，方便管理和维护。<br />3：可以通过 URL 引入SVG，减少 HTML 文件的体积，提高页面加载速度。 | 1：需要额外配置构建工具，相对于内联方式稍显繁琐。<br />2：需要 HTTP 请求服务器获取 SVG 文件，可能会增加页面加载时间。                               | 1：适用于大型项目，包含大量 SVG，需要自动化处理和管理。<br />2：对于需要进行 SVG 的优化、压缩和缓存的场景。 |
| **以 Vue 组件的方式引入** | 1：可以将 SVG 封装成 Vue 组件，方便在 Vue 应用中重复使用，并且可以通过组件的 Props 进行参数配置。<br />2：可以通过构建工具进行优化和压缩，提高 SVG 的加载性能。<br />3：可以直接在 Vue 模板中使用 Vue 组件，提高代码的可读性和可维护性。        | 1：需要额外编写 Vue 组件代码，相对于内联方式和构建工具引入稍显复杂。<br />2：当 SVG 数量较多时，可能会增加项目的体积。| 1：适用于需要在 Vue 组件中频繁使用的 SVG，且需要与 Vue 组件的数据进行交互的场景。<br />2：对于需要将 SVG 封装成可复用、可配置的组件，并且需要进行优化和压缩的场景。 |

  


综上所述，选择合适的 SVG 引入方式取决于项目的规模、复杂度以及对性能和可维护性的要求。对于简单的应用或小型项目，可以选择内联方式引入 SVG ；对于大型项目或需要自动化处理和优化的场景，建议使用构建工具引入 SVG；对于需要重复使用、可配置的 SVG 图标，并且与 Vue 组件的数据进行交互的场景，可以选择以 Vue 组件的方式引入 SVG。

  


## 案例：在 Vue 中创建动态图标

  


在 Vue 组件中，我们可以充分利用 Vue 提供的强大逻辑和工具。不必局限于每个组件只使用一个 SVG 图标。我们可以根据需要使用 `v-if` 或 `v-show` 来根据条件渲染任意数量的元素，也可以使用 `v-for` 实现循环渲染，甚至可以为单个元素添加事件处理程序。

  


-   **动态渲染**：`v-if` 可以根据条件动态渲染 SVG 图标。这使得你可以根据特定的条件来决定是否显示某个图标或某个 SVG 元素，从而实现根据应用状态或用户操作来动态展示不同的图标。
-   **动态切换**：`v-show` 也可根据条件来动态显示或隐藏 SVG 图标，但是不会销毁或重建 DOM 元素，而是通过修改元素的 CSS 属性 `display` 来控制显示状态。这在需要频繁切换显示状态时可以提高性能。
-   **动态渲染列表**：`v-for` 可以根据数据源动态渲染多个 SVG 图标，例如渲染用户的头像列表、动态生成导航菜单中的图标等。

  


以“汉堡菜单”图标动态切换为“关闭”图标的效果为例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6dfb877fccf4912a87b8051c8f41d1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=550&s=184218&e=gif&f=156&b=ffffff)

  


我们可以通过 `v-if` 来实现，你可以为这个交互效果提供两个 SVG 图标，这样做的一个缺点是你需要提供两个不同的 SVG 图标，而且要实现上图这样的效果互动动画效果会比较困难。

  


在这个示例中，我们完全可以基于一个 SVG 图标来实现。这是因为“汉堡菜单”图标和“关闭”图标在外形上有相似之处，都是线条形状。在 SVG 中，我们可以通过 `<line>` 、`<rect>` 或 `<path>` 元素来实现。在这个示例中，我使用了 `<rect>` 元素来绘制线条：

  


```XML
<svg aria-hidden="true" viewBox="0 0 24 24" class="bars" fill="none">
    <rect class="bars__line bars__line--up" width="18"  height="1.5" fill="red" ry="0.75" x="3" y="6.25"/>
    <rect class="bars__line bars__line--middle" width="18" height="1.5"  fill="red" ry="0.75" x="3" y="11.25" />
    <rect  class="bars__line bars__line--down"  width="18"  height="1.5" fill="red" ry="0.75" x="3" y="16.25" />
</svg>
```

  


默认状态是“汉堡菜单”图标。

  


如果我们将上面代码中第二个 `rect` 元素（`.bars__line--middle`）不渲染出来，然后通过 CSS 对另外两个 `rect` 做一些变换处理，就可以得到“关闭”图标。这在 Vue 开发环境中，使用 `v-if` 可以很容易使其根据用户的交互状态来控制是否渲染。

  


```JavaScript
<template>
    <svg 
        aria-hidden="true"
        viewBox="0 0 24 24"
        class="bars"
        :class="{ active: isActive }"
        fill="none"
    >
        <rect
            class="bars__line bars__line--up"
            width="18"
            height="1.5"
            fill="red"
            ry="0.75"
            x="3"
            y="6.25"
        />
        <rect
            v-if="!isActive"
            class="bars__line bars__line--middle"
            width="18"
            height="1.5"
            fill="red"
            ry="0.75"
            x="3"
            y="11.25"
        />
        <rect
            class="bars__line bars__line--down"
            width="18"
            height="1.5"
            fill="red"
            ry="0.75"
            x="3"
            y="16.25"
        />
    </svg>
</template>

<script setup>
    import { defineProps, computed } from 'vue';
  
    // 使用 defineProps() 定义组件的 props 属性
    const props = defineProps({
        // isActive 属性表示点赞状态，类型为 Boolean。
        isActive: Boolean,
    })
</script>

<style scoped>
    .bars {
        width: 85%;
    }
    
    .bars rect {
        transform-box: fill-box;
        transform-origin: 50% 50%;
        fill: hsl(324, 71%, 4%);
        transition: rotate 0.2s 0s, translate 0.2s 0.2s;
    }
    
    .bars.active rect {
        transition: translate 0.2s, rotate 0.2s 0.3s;
    }
    
    .active .bars__line--up {
        translate: 0 333%;
        rotate: -45deg;
    }
    .active .bars__line--middle {
        rotate: 45deg;
    }
    .active .bars__line--down {
        translate: 0 -333%;
        rotate: 45deg;
    }
    .bars.active {
        rotate: 90deg;
        transition: rotate
            linear(
              0,
              0.2178 2.1%,
              1.1144 8.49%,
              1.2959 10.7%,
              1.3463 11.81%,
              1.3705 12.94%,
              1.3726,
              1.3643 14.48%,
              1.3151 16.2%,
              1.0317 21.81%,
              0.941 24.01%,
              0.8912 25.91%,
              0.8694 27.84%,
              0.8698 29.21%,
              0.8824 30.71%,
              1.0122 38.33%,
              1.0357,
              1.046 42.71%,
              1.0416 45.7%,
              0.9961 53.26%,
              0.9839 57.54%,
              0.9853 60.71%,
              1.0012 68.14%,
              1.0056 72.24%,
              0.9981 86.66%,
              1
            ) 1s 0.4s;
    }
</style>
```

  


上面的代码中，使用 `defineProps()` 方法定义了组件的 props 属性，其中 `isActive` 表示菜单按钮的激活状态。根据 `isActive` 的值来切换 根元素 `<svg>` 的 `active` 类存在与否。这样，当 `isActive` 为 `true` 时，SVG 将应用 `active` 类。其次，第二个 `rect` 元素设置了 `v-if="!isActive"`，使用了条件渲染，只有当 `isActive` 为 `false` 时才会渲染该矩形元素，即表示菜单按钮展开状态。

  


这样，一个通过用户交互行为动态创建 SVG 图标的组件 `Bars` 就实现了。注意，上面示例中的 `rect` 元素中的一些属性可以提取出来，通过 CSS 来设置它们的默认样式。另外，SVG 图标变换的交互效果是通过 CSS 变换特性实现的。

  


```JavaScript
// Bars.vue
<template>
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        class="bars"
        :class="{ active: isActive }"
        fill="none"
    >
        <rect class="bars__line bars__line--up" y="6.25" />
        <rect v-if="!isActive" class="bars__line bars__line--middle" y="11.25" />
        <rect class="bars__line bars__line--down" y="16.25" />
    </svg>
</template>

<script setup>
    import { defineProps, computed } from "vue";
    
    // 使用 defineProps() 定义组件的 props 属性
    const props = defineProps({
        // isActive 属性表示点赞状态，类型为 Boolean。
        isActive: Boolean,
    });
</script>

<style scoped>
    .bars {
        width: 85%;
    }
    
    .bars rect {
        transform-box: fill-box;
        transform-origin: 50% 50%;
        fill: hsl(324, 71%, 4%);
        transition: rotate 0.2s 0s, translate 0.2s 0.2s;
        width: 18px;
        height: 1.5px;
        ry: 0.75;
        x: 3;
    }
    
    .bars.active rect {
        transition: translate 0.2s, rotate 0.2s 0.3s;
    }
    
    .active .bars__line--up {
        translate: 0 333%;
        rotate: -45deg;
    }
    
    .active .bars__line--middle {
        rotate: 45deg;
    }
    .active .bars__line--down {
        translate: 0 -333%;
        rotate: 45deg;
    }
    
    .bars.active {
        rotate: 90deg;
        transition: rotate
            linear(
              0,
              0.2178 2.1%,
              1.1144 8.49%,
              1.2959 10.7%,
              1.3463 11.81%,
              1.3705 12.94%,
              1.3726,
              1.3643 14.48%,
              1.3151 16.2%,
              1.0317 21.81%,
              0.941 24.01%,
              0.8912 25.91%,
              0.8694 27.84%,
              0.8698 29.21%,
              0.8824 30.71%,
              1.0122 38.33%,
              1.0357,
              1.046 42.71%,
              1.0416 45.7%,
              0.9961 53.26%,
              0.9839 57.54%,
              0.9853 60.71%,
              1.0012 68.14%,
              1.0056 72.24%,
              0.9981 86.66%,
              1
            ) 1s 0.4s;
    }
</style>
```

  


再来看一个注册表单的案例：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f472f02cf1354663beef298320961683~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1164&h=558&s=751804&e=gif&f=254&b=ffffff)

  


不难发现，表单中有三个不同形状的 SVG 图形：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cf2f62e0fbf41a293a66bc3881152b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=816&s=171966&e=jpg&b=ffffff)

  


就这个效果而言，大部分 Web 开发者可能会使用三个 `<svg>` 元素，然后通过 `v-if` 来控制图标显示和隐藏。在这里，我向大家演示的是，我们基于同一个 `<svg>` 元素中，根据状态对 `<svg>` 元素中的 `<path>` 进行动态渲染，从而得到不同的三个 SVG 图形：

  


```JavaScript
// SignUp.vue
<template>
    <!-- 表单 -->
    <form ref="formRef" :data-state="state" @submit="transitionForm">
        <!-- 输入框 -->
        <input ref="inputRef" type="email" required id="email" autoComplete="off" placeholder="Email address"
            @focus="state !== STATES.OPEN ? transitionForm : null" />
        <!-- 按钮 -->
        <button ref="buttonRef" type="button" @click="transitionForm">
            <!-- SVG 图标 -->
            <svg fill="none" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24">
                <!-- 渲染路径组，根据状态不同显示不同路径 -->
                <!-- 小铃铛图形 -->
                <g v-if="state === STATES.CLEAN">
                    <!-- 路径1 -->
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <!-- 路径2 -->
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                </g>
                <!-- 纸飞机图形 -->
                <g v-else-if="state === STATES.OPEN">
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    <path d="M22 2L11 13" />
                </g>
                <!-- 小勾图形 -->
                <g v-else-if="state === STATES.SUBMITTED">
                    <path
                        d="M8 11.857l2.5 2.5L15.857 9M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
                </g>
            </svg>
        </button>
    </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
import Flip from "flip";

// 定义引用和状态
const formRef = ref(null);
const inputRef = ref(null);
const buttonRef = ref(null);
const stateRef = ref(null);
const state = ref("clean");

// 定义状态常量
const STATES = {
    CLEAN: 'clean',
    OPEN: 'open',
    SUBMITTED: 'submitted',
}

// 表单过渡
const transitionForm = (event) => {
    event.preventDefault();
    // 根据状态执行不同的操作
    if (state.value === STATES.SUBMITTED) {
        state.value = STATES.CLEAN;
    } else if (state.value === STATES.CLEAN) {
        if (!document.startViewTransition) {
            // 获取当前状态
            stateRef.value = Flip.getState([formRef.value, inputRef.value, buttonRef.value], {
                scale: true,
                props: "opacity,padding",
            });
            // 打开表单
            state.value = STATES.OPEN;
            // 使用 gsap 动画
            gsap.from(stateRef.value, {
                duration: 0.4,
                nested: true,
                ease: "bounce.out",
                absolute: true,
                onComplete: () => console.info('gsap: completed this')
            });
        } else {
            // 使用文档的过渡函数
            document.startViewTransition(() => {
                state.value = STATES.OPEN;
            });
        }
    } else if (state.value === STATES.OPEN) {
        if (!document.startViewTransition) {
            // 获取当前状态
            stateRef.value = Flip.getState([formRef.value, inputRef.value, buttonRef.value], {
                scale: true,
                props: "opacity,padding",
            });
            // 提交表单
            state.value = STATES.SUBMITTED;
            // 使用 gsap 动画
            gsap.from(stateRef.value, {
                duration: 0.4,
                nested: true,
                ease: "bounce.out",
                absolute: true,
                onComplete: () => console.info('gsap: completed this')
            });
        } else {
            // 使用文档的过渡函数
            document.startViewTransition(() => {
                state.value = STATES.SUBMITTED;
            });
        }
    }
}

// 在挂载时设置焦点
onMounted(() => {
    if (state.value === STATES.OPEN) inputRef.value.focus();
});
</script>
<style scoped>
:root {
    --ease: linear(0, 0.0039, 0.0157, 0.0352, 0.0625 9.09%,
            0.1407, 0.25, 0.3908, 0.5625, 0.7654, 1,
            0.8907, 0.8125 45.45%, 0.7852, 0.7657,
            0.7539, 0.75, 0.7539, 0.7657, 0.7852,
            0.8125 63.64%, 0.8905, 1 72.73%, 0.9727,
            0.9532, 0.9414, 0.9375, 0.9414, 0.9531,
            0.9726, 1, 0.9883, 0.9844, 0.9883, 1);
    --ease: ease;
    --speed: 0.4s;
    view-transition-name: none;
}

form {
    background: black;
    background-repeat: no-repeat;
    view-transition-name: form;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1000px;
    margin: 0;
    gap: 0.5rem;
    place-self: center;

    box-shadow: 0 1px hsl(0 0% 100% / 0.35) inset,
        0 -1px hsl(0 0% 0% / 1) inset,
        0 10px 20px -5px hsl(0 0% 0% / 1);
}

input {
    view-transition-name: form-input;
    border: 0;
    padding: 1rem 2rem;
    font-weight: 40;
    background: transparent;
    outline: none;
    color: hsl(0 0% 80%);
    font-size: 2rem;
    font-family: "Geist Sans", sans-serif;
}

button:is(:focus-visible, :hover) {
    color: hsl(0 0% 90%);
}

input::placeholder {
    font-family: "Geist Sans", sans-serif;
    color: hsl(0 0% 80% / 0.5);
}

button {
    view-transition-name: form-action;
    height: 68px;
    width: 68px;
    border-radius: 1000px;
    display: grid;
    place-items: center;
    padding: 0;
    background: transparent;
    border: 0;
    color: hsl(0 0% 50%);
    cursor: pointer;
    outline: none;
}

button svg {
    width: 50%;
}

button svg path {
    stroke: currentColor;
    transition: all 0.25s;
}

/* State based styling */
[data-state=clean] button:is(:hover, :focus-visible) svg g {
    --deg: 5;
    transform-box: fill-box;
    transform-origin: 50% 20%;
    animation: ring 0.2s 2;
}

[data-state=clean] button:is(:hover, :focus-visible) svg g path:nth-of-type(2) {
    --deg: 10;
    transform-box: fill-box;
    transform-origin: 50% -1000%;
    animation: ring 0.2s 3 reverse;
}

@keyframes ring {

    0%,
    100% {
        rotate: 0;
    }

    25% {
        rotate: calc(var(--deg) * 1deg);
    }

    75% {
        rotate: calc(var(--deg) * -1deg);
    }
}

[data-state=open] button:is(:hover, :focus-visible) svg g {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    animation: float 1s infinite;
}

@keyframes float {
    50% {
        translate: 5% -5%;
        scale: 0.85;
        rotate: 5deg;
    }
}

[data-state=submitted] button:is(:hover, :focus-visible) {
    color: hsl(140 80% 60%);
}

[data-state=clean] input,
[data-state=submitted] input {
    width: 0;
    padding: 0;
    opacity: 0;
}

[data-state=clean],
[data-state=submitted] {
    gap: 0;
}

/* View Transition stuff */
::view-transition-group(form),
::view-transition-group(form-input),
::view-transition-group(form-action) {
    mix-blend-mode: normal;
    animation-timing-function: var(--ease);
    animation-duration: var(--speed);
}

::view-transition-old(form),
::view-transition-new(form) {
    border-radius: 1000px;
    background-color: black;
    height: 100%;
}

::view-transition-old(form-input),
::view-transition-new(form-input),
::view-transition-old(form-action),
::view-transition-new(form-action) {
    height: 100%;
    width: 100%;
    object-fit: none;
}

::view-transition-old(form-input),
::view-transition-new(form-input) {
    object-position: left center;
    overflow: hidden;
    opacity: 1;
}

::view-transition-old(form-action),
::view-transition-new(form-action) {
    object-position: right center;
}
</style>
```

  


上面的代码使用了 Vue 组件、组件状态管理、动态样式绑定、动画效果等功能，实现了一个包含表单输入框和按钮的交互式表单组件。具体实现效果如下：

  


-   **动态样式绑定**：使用`[data-state]`属性根据组件状态设置不同的样式；通过`:hover`和`:focus-visible`伪类设置按钮悬停时的样式变化；使用动画效果`ring`和`float`分别实现按钮悬停时的环形旋转效果和浮动效果。
-   **视图过渡**：使用`::view-transition-group`为表单组件和按钮组件设置过渡效果；在过渡过程中，旧视图和新视图通过动画效果平滑过渡，从而实现整体组件的流畅切换。
-   **交互效果**：根据表单状态的变化，动态地切换输入框和按钮的样式和行为。当表单处于不同的状态（清除、打开、已提交）时，按钮和输入框的样式和行为会发生变化，增加了交互性和用户体验。

  


总的来说，这段代码实现了一个动态交互式表单组件，通过动态样式绑定和[视图过渡](https://juejin.cn/book/7223230325122400288/section/7259669097242329145)等技术，使用户能够在不同的状态下交互，并通过动画效果增强了用户体验。

  


## 案例：创建 SVG 精灵组件

  


为了避免在页面中反复编写相同的 SVG 代码，我们需要创建一个SVG “精灵”。如果你之前没有听说过 SVG 精灵，可以把它想象成一个隐藏的 SVG，里面包含了其他 SVG。在我们需要展示图标的地方，我们可以通过在 `<use>` 标签中引用图标的 ID 来从精灵中调用它，就像这样：

  


```XML
<svg>
    <use xlink:href="#rocket" />
</svg>
```

  


上面这段代码实际上就是我们的 `<SvgIcon>` 组件将要如何工作的方式，但是我们首先需要创建一个 `<SvgSprite>` 组件。以下是 `SvgSprite` 组件对应的代码：

  


```JavaScript
// SvgSprite.vue
<template>
    <svg width="0" height="0" class="sr-only" v-html="svgSprite" />
</template>

<script setup>
  import { ref } from "vue";

  // 动态导入所有 SVG 文件
  const svgFiles = import.meta.glob("../assets/icons/*.svg", {
      eager: true,
      as: "raw",
  });

  // 处理 SVG 文件内容
  const symbols = Object.entries(svgFiles).map(([path, content]) => {
  // 从文件路径中提取图标的 ID，并赋值给变量 id
  const id = path.replace(/^.*[\/](.*).svg$/, "$1");
      // 替换 SVG 内容中的 <svg> 标签为 <symbol> 标签，并添加图标的唯一 ID
      // 同时，将 </svg> 标签替换为 </symbol>，以确保 SVG 符号的完整性
      return content
        .replace("<svg", `<symbol id="${id}"`)
        .replace("</svg>", "</symbol>");
  });
  
  // 将处理后的内容存储在一个 ref 中
  const svgSprite = ref(symbols.join("\n"));
</script>

<style scoped>
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
</style>
```

  


在这里，我们是通过 `vite-svg-loader` 来获取 `src/assets/icons` 目录下的所有 `.svg` 文件。然后通过下面这段代码为每个 SVG 图标创建一个 `<symbol>` ，即实例化 SVG 图标：

  


```
// 创建一个数组 symbols，其中包含将 SVG 文件转换为符号的操作结果
const symbols = Object.entries(svgFiles).map(([path, content]) => {
    // 从文件路径中提取图标的 ID，并赋值给变量 id
    const id = path.replace(/^.*[\/](.*).svg$/, "$1");
    // 替换 SVG 内容中的 <svg> 标签为 <symbol> 标签，并添加图标的唯一 ID
    // 同时，将 </svg> 标签替换为 </symbol>，以确保 SVG 符号的完整性
    return content
        .replace("<svg", `<symbol id="${id}"`)
        .replace("</svg>", "</symbol>");
});
```

  


我们创建了一个名为 `symbols` 的数组，它包含了将 SVG 文件转换为 SVG 符号的操作结果。在 `map` 方法中，对每个 SVG 文件执行以下操作：

  


-   使用正则表达式从文件路径中提取图标的 ID，并将其赋值给变量 `id`
-   将 SVG 内容中的 `<svg>` 标签替换为 `<symbol>` 标签，并添加图标的唯一 ID
-   同时，将 `</svg>` 标签替换为 `</symbol>`，以确保 SVG 符号的完整性

  


最终，`symbols` 数组中包含了转换后的 SVG 符号字符串，每个字符串都代表一个图标，并且带有唯一的 ID。

  


将这个组件添加到 `App.vue` 中，我建议放在顶部：

  


```JavaScript
<template>
    <SvgSprite />
</template>  
<script setup>
    import SvgSprite from './components/SvgSprite.vue'
</script>
```

  


这样，`SvgSprite` 组件就会将 `src/assets/icons` 目录下的所有 `.svg` 文件使用 `<symbol>` 实例化。SVG 精灵就创建完成，使我们能够在需要图标时可用，并且不会重复整个 SVG 代码：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c9371807bf049be93a06dfd9ed6e285~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3346&h=1650&s=998737&e=jpg&b=f2f8f9)

  


现在让我们构建 `SvgIcon` 组件。

  


```JavaScript
// SvgIcon.vue
<template>
    <svg class="icon" :style="{ width: size, height: size, color: finalColor }">
        <use :href="`#${icon}`" />
    </svg>
</template>

<script setup>
    import { defineProps, ref, watch } from "vue";

    const props = defineProps({
        icon: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            default: '1em', // 默认尺寸为 1em
        },
        color: {
            type: String,
            default: "currentColor",
        },
    });
    
    // 最终应用的颜色
    const finalColor = ref(props.color);
    
    // 监听 color 属性的变化
    watch(
        () => props.color,
        (newValue) => {
            finalColor.value = newValue;
        }
    );
</script>

<style>
    svg.icon {
        display: block;
        fill: currentColor;
    }
</style>
```

  


这个组件简单得多。它实现了一个可配置的 SVG 图标组件，具体功能如下：

  


-   **图标展示：** 通过 `<use>` 标签引用传递的 `icon` 属性，实现了动态展示不同的 SVG 图标
-   **尺寸控制：** 使用 `size` 属性控制图标的宽度和高度，可以根据需要进行调整
-   **颜色定制：** 使用 `color` 属性，可以通过传递不同的颜色值来改变图标的填充颜色，允许用户根据需要定制图标的颜色
-   **动态响应：** 使用 `watch` 监听 `color` 属性的变化，实现了图标颜色的动态响应，确保在颜色属性变化时图标能及时更新显示

  


现在，你可以像下面这样使用 SVG 精灵组件：

  


```JavaScript
// App.vue
<template>
    <SvgSprite />
    <SvgIcon icon="linkedin"  />
    <SvgIcon icon="facebook" color="red" />
    <SvgIcon icon="discord" size="2em" />
    <SvgIcon icon="reddit" size="4rem" color="lime" class="flip" />  
</template>

<script setup>
    import SvgIcon from './components/SvgIcon.vue'
    import SvgSprite from './components/SvgSprite.vue'
</script>

<style scoped>
    @keyframes flip {
        0% {
            transform: translateY(0) rotateX(0);
            transform-origin: 50% 0%;
        }
        100% {
            transform: translateY(-100%) rotateX(-180deg);
            transform-origin: 50% 100%;
        }
    }
    
    .flip {
        animation: flip 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
    }
</style>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75a9e56c57e0401d86a5b698af8fe394~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=506&s=69886&e=gif&f=88&b=ffffff)

  


## 小结

  


这节课我们主要探讨了在 Vite Vue 应用中引入 SVG 的各种方式，每种方式都有其优缺点，现在你可以根据你自己的项目需求，选择最合适的方法。提升你的 Web 开发工作流程，减少页面加载时间，并确保您的项目保持轻量级和高性能。