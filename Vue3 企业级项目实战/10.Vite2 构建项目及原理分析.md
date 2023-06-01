## 前言

`Vite`（法语意思是 “快”，发音为 /vit/，类似 veet）是一种全新的前端构建工具。你可以把它理解为一个开箱即用的开发服务器 + 打包工具的组合，但是更轻更快。

`Vite` 利用浏览器原生的 `ES` 模块支持和用编译到原生的语言开发的工具（如 esbuild）来提供一个快速且现代的开发体验。在前面的章节我们已经学习过如何用 `Vite` 初始化一个项目。但是很多时候，我们不能只是会用，也要知道为什么要用它，它到底比起 `Webpack`，有什么优势。

带着这几个问题，我们开始本章节的学习。

[Vite 中文文档](https://cn.vitejs.dev)

## ES module

[ES module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules?spm=a2c6h.12873639.0.0.58f832acSuXjmc) 是 `Vite` 的核心，我们先来看看 `ES module` 的浏览器支持情况。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f14b656328843c59dac4e829056d2eb~tplv-k3u1fbpfcp-zoom-1.image)

> 上述图片出自网站：https://caniuse.com

可以看到主流浏览器 Edge、Firefox、Chrome、Safari、Opera 的较新版本都已经支持了 `ES module`，除了万恶的 IE 浏览器。

它最大的特点就是在浏览器端直接使用 `export` 和 `import` 的方式进行导入和导出模块，前提必须在 `script` 标签里设置 `type=module`。大致使用如下所示：

```html
<script type="module">
  import { name } from './foo.js'
</script>
```

上述代码运行时，浏览器会发起 http 请求，请求 http server 托管的 `foo.js`，在 `foo.js` 内，我们可以使用 `export` 导出模块：

```javascript
// foo.js
export const name = 'Nick'
```

#### Vite 如何利用 ES module

我们通过 `Vite` 初始化一个 `vue3-vite` 项目，在页面中打开控制台，点击 `Sources`，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be02e0d0ddad4125a06a26633cd7796e~tplv-k3u1fbpfcp-zoom-1.image)

红框内就是引入了 `type=module` 属性，并且 src 引入 `/src/main.js`，我们打开它如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fa243d555814b51877ab720b201f95a~tplv-k3u1fbpfcp-zoom-1.image)

script 标签内的内容如下：

```javascript
import { createApp } from '/node_modules/.vite/vue.js?v=5f7bc028'
import App from '/src/App.vue'

createApp(App).mount('#app')
```

从上述代码我们可以得到一些信息：

1. `createApp` 方法是从 `http://localhost:3001/node_modules/.vite/vue.js?v=5f7bc028` 中获取的。
2. 入口页面 `App.vue` 是从 `http://localhost:3001/src/App.vue` 中获取的。
3. 通过 `createApp` 方法，将应用挂在到了 `#app` 下。

`createApp` 是 `Vue 3` 新增的 `API`，它用于创建应用。`Vue 2` 时代的创建应用需要将代码通过 `webpack` 工具打包之后才能在浏览器运行，而 Vite 通过 `ES module` 的能力，省去了打包过程，直接在浏览器内通过 `/node_modules/.vite/vue.js?v=5f7bc028` 的形式引入代码。

通过 `webpack` 打包实现编译，很难做到按需加载，因为都是静态资源，不管模块代码是否被使用到，都会被打包到 `bundle` 文件里。随着业务量增大，打包后的 `bundle` 随之越来越大。后来为了减小 `bundle` 的体积，开发者们使用 `import()` 的方式实现按需加载的形式，但是被引入的模块依然需要提前打包，后来使用 `tree shaking` 等方式去掉未使用到的代码块。但是上述的努力均没能比 `Vite` 更加优雅，`Vite` 可以在需要某个模块的时候动态引入，并且不需要提前打包。要注意的是，目前 `Vite` 这种形式只能用于开发环境，但是就这样已经能大大的提升开发的效率了，这就足够了。

## vite.config.js 常用配置介绍

和 `Vue CLI` 初始化项目需要通过 `vue.config.js` 配置一样，`Vite` 也需要通过 `vite.config.js` 去配置。当然，你不一定非要配置，但是在需要某些特殊情况的适合，还是需要用到的，学习一下，以备不时之需。

我们用上面创建的 `vue3-vite` 作为实践例子，逐一介绍较常见的配置项。

#### plugins

插件配置，接收一个数组，在数组内执行需要的插件。插件能帮助我们完成很多事情，比如 `Vite 2` 默认通过 `@vitejs/plugin-vue` 支持 `vue`，书写形式如下所示：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]  
})
```

插件分为两个类型，一个是官方的，一个是社区的：

| 官方插件 | 社区插件 |
| --------- | ----- |
| [在线地址](https://cn.vitejs.dev/plugins/) | [在线地址](https://github.com/vitejs/awesome-vite) |

希望大家也能积极踊跃的参与社区插件的贡献，让 `Vite` 能火起来。

#### base
`base` 配置项在开发或生产环境服务的 公共基础路径，打完包后在 /dist/index.html 中体现。默认值是 `/`，我们不妨把值设置成 `./`，如下所示：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]  
  base: './'
})
```

尝试着运行 `npm run build`，得到打包后的文件如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11835eeaeed64ee795ebc086d56a3f38~tplv-k3u1fbpfcp-zoom-1.image)

静态资源的引入形式如上图所示，如果不加 `./` 路径，则在 `index.html` 内，引入的路径就会是绝对路径 `/xxx/xxx` 的形式。通过启动 `web` 服务的形式将 `index.html` 启动，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/236cb6fad1bd4e2f89b9de98e576499c~tplv-k3u1fbpfcp-zoom-1.image)

#### resolve.alias

此配置想必大家也不陌生，就是为了方便在组件内部引用文件时，方便书写。配置如下所示：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]  
  base: './',
  resolve: {
    // 别名设置
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  }
})
```

> Vite 1.0 是需要用 `/@/` ，加斜杠的形式，Vite 2 后，便优化了。

#### resolve.extensions

导入文件时，需要省略的扩展名列表，不过官方建议是尽量不要将 `.vue` 给省略了。配置如下：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]  
  base: './',
  resolve: {
    // 别名设置
    alias: {
      '@': path.resolve(__dirname, '/src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'] // 默认值
  }
})
```

#### server

该配置内置多种开发时常用的选项，我们通过代码来分析：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]  
  base: './',
  resolve: {
    // 别名设置
    alias: {
      '@': path.resolve(__dirname, '/src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'] // 默认值
  },
  server: {
    // 指定服务器主机名
    host: '0.0.0.0',
    // 开发环境启动的端口号
    port: 3008,
    // 是否在开发环境下自动打开应用程序
    open: true,
    // 代理
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

和 `webpack-dev-server` 的配置相差不大，同学们几乎可以无缝对接。

> 文档最近更新时间：2022 年 9 月 20 日。