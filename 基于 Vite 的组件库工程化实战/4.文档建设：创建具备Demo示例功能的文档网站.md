可能有人会非常奇怪，为什么会在第四节就讲如何搭建文档系统。在软件工程中有这样一个概念：**一个完整的软件是文档和代码的组合体**，一堆不知道如何使用的代码没有任何价值。项目文档的建设工作应该越早越好。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea17ede6574b4f93baea01f160f7ec08~tplv-k3u1fbpfcp-zoom-1.image)

本章代码：  https://github.com/smarty-team/smarty-admin/tree/chapter04/packages/smarty-ui-vite

## 用户故事(UserStory)

通过 Vitepress 创建一个文档网站，可以展示组件 Demo 示例、描述、模板代码。

## 功能分解(Task)

-   利用 Vitepress 搭建生成文档网站；
-   引用组件并展示到 Demo；
-   引用 Markdown 插件方便代码Demo示例编写。

## 功能实现

文档建设一般会是一个静态网站的形式 ，这次采用 Vitepress 完成文档建设工作。

Vitepress 是一款基于Vite 的静态站点生成工具。开发的初衷就是为了建设 Vue 的文档。Vitepress 的方便之处在于，可以使用流行的 Markdown 语法进行编写，也可以直接运行 Vue 的代码。也就是说，它能很方便地完成展示组件 Demo 的任务。

使用 Vitepress 作为文档建设工具还有另外一个好处。由于 Vitepress 是基于 Vite 的，所以它也很好的继承了 Bundless 特性，开发的代码能以“秒级”速度在文档中看到运行效果，完全可以充当调试工具来使用。所以通常情况下我开发组件时，就会直接选择在 Vitepress 上进行调试。这个开发方式大家也可以尝试一下。

下面开始搭建 Vitepress文档。

### 添加 VitePress 文档

首先需要引入 Vitepress 文档。

```
pnpm i vitepress@"0.22.4" -D
```

配置 Vitepress 的 vite.config.ts。

默认 Vitepress 是无需配置 vitepress.config.ts 的，但是组件库中需要支持 JSX 语法与 UnoCSS，所以就需要添加配置文件。

docs/vite.config.ts

```ts
import { defineConfig } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Unocss from "../config/unocss";
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    // 添加JSX插件
    vueJsx(),
    Unocss(),
  ],
});
```

创建首页文档文档。
在代码根目录下
```
echo '# SmartyUI' > docs/index.md
```

增加启动脚本。

```
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  }
}
```

启动后看一下效果。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dd68f5d56bd4e9585b160b70370e1e6~tplv-k3u1fbpfcp-zoom-1.image)

接着可以尝试用 Markdown 增加一点内容。 关于一个开源项目需要编写什么内容，后面的章节会给大家讲解。最后实现的效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa1e88ef3bfa44b4818ea4f1d3874792~tplv-k3u1fbpfcp-zoom-1.image)

### 配置菜单

对于组件库而言，需要将每一个组件的使用方法分一个页面呈现，所以需要配置一下菜单。

在 docs 文件夹中添加一个 config.ts 文件。config.ts 配置菜单项的基本信息：

-   配置菜单项；
-   子菜单所对应的 markdwon 文件路径(默认页面 index.md)。

docs/.vitepress/config.ts

```
const sidebar = {
  '/': [
    { text: '快速开始', link: '/' },
    {
      text: '通用',
      children: [
        { text: 'Button 按钮', link: '/components/button/' },
      ]
    },
    { text: '导航' },
    { text: '反馈' },
    { text: '数据录入' },
    { text: '数据展示' },
    { text: '布局' },
  ]
}
const config = {
  themeConfig: {
    sidebar,
  }
}
export default config
```

点击左侧菜单的 Button，看下效果：

[http://localhost:3000/components/button/](https://link.juejin.cn/?target=http://localhost:3000/components/button/)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbc5449be2c84a32a0a58fd5df0b4424~tplv-k3u1fbpfcp-zoom-1.image)

### 组件 Demo 展示

组件库文档一般都会有展示组件 Demo 的需求。组件的展示实际上就是将组件引用到 markdown 页面中。其实 markdown 是可以直接运行 html 代码的。而 Vitepress 中也含有 vue 实例，也就是说 vue 的代码也是可以直接运行的。唯一的问题就是如何将组件库加载。

通过编写一个主题 theme 就可以获取 vue 实例。只需要在 enhanceApp 方法中注册组件库插件就可以了。

docs/.vitepress/theme/index.ts

```
import Theme from 'vitepress/dist/client/theme-default'
import SmartyUI from '../../../src/entry'

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.use(SmartyUI)
  },
}
```

加载组件库后，尝试在 markdown 中引用组件的代码。

```
# Button 按钮

  <div style="margin-bottom:20px;">
    <SButton color="blue">主要按钮</SButton>
    <SButton color="green">绿色按钮</SButton>
    <SButton color="gray">灰色按钮</SButton>
    <SButton color="yellow">黄色按钮</SButton>
    <SButton color="red">红色按钮</SButton>
  </div>
```

最后看一下运行效果。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffde3441a2384eda9f710de6731b3112~tplv-k3u1fbpfcp-zoom-1.image)

## 引入 Demo 演示插件优化阅读体验

这个时候，可能会有人问， ElementUI 那种同时演示 Demo 和代码的酷炫效果是怎么做的呢？ 其实那个只是一个前端效果，相信大家都会自己实现。只不过 Element 把它封装为一个 Markdown 插槽，更加容易使用。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66d6c557711f48fbb4eb5af3eaf52348~tplv-k3u1fbpfcp-zoom-1.image)

什么是markdown插槽？简单讲解一下，下面这种语法就是。

```
::: slot name 
::: 
```

这相当于一种 Markdown 的功能扩展。如果有兴趣的可以参考这个文档：[VuePress 中文文档 | VuePress 中文网](https://www.vuepress.cn/guide/markdown-slot.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81-markdown-%E6%8F%92%E6%A7%BD)。

Element 实际上就是实现 Markdown 插槽，来实现同时显示 Demo 与代码的。有一个开源项目 vitepress-theme-demoblock ，它是模仿了 Element 的这个功能实现的，可以达到类似的效果。我们的组件库中也引用它来实现。

```
pnpm i vitepress-theme-demoblock@"1.4.2" -D
```

首先安装 vitepress-theme-demoblock。

docs/.vitepress/config.ts

```
module.exports = {
  markdown: {
    config: (md) => {
      // 添加DemoBlock插槽
      const { demoBlockPlugin } = require('vitepress-theme-demoblock')
      md.use(demoBlockPlugin)
    }
  }
}
```

接着在 docs/.vitepress/theme/index.ts 中注册 vitepress-theme-demoblock 插件所需的 demo 和 demo-block 组件，如下面这样：

```
// 主题样式
import 'vitepress-theme-demoblock/theme/styles/index.css'
// 插件的组件，主要是demo组件
import Demo from 'vitepress-theme-demoblock/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/components/DemoBlock.vue'

export default {
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
  }
}
```

最后在 markdown 文档中编写一段带有 Demo 插槽的 markdown。

docs/components/index.md

````
# Button 按钮
常用操作按钮

## 基础用法

基础的函数用法

:::demo 使用`size`、`color`、`pain`、`round`属性来定义 Button 的样式。

```vue
<template>
 <div style="margin-bottom:20px;">
  <SButton color="blue">主要按钮</SButton>
  <SButton color="green">绿色按钮</SButton>
  <SButton color="gray">灰色按钮</SButton>
  <SButton color="yellow">黄色按钮</SButton>
  <SButton color="red">红色按钮</SButton>
 </div>
 <div style="margin-bottom:20px;"
 >
  <SButton color="blue" plain>朴素按钮</SButton>
  <SButton color="green" plain>绿色按钮</SButton>
  <SButton color="gray" plain>灰色按钮</SButton>
  <SButton color="yellow" plain>黄色按钮</SButton>
  <SButton color="red" plain>红色按钮</SButton>
 </div>
 <div style="margin-bottom:20px;">
  <SButton size="small" plain>小按钮</SButton>
  <SButton size="medium" plain>中按钮</SButton>
  <SButton size="large" plain>大按钮</SButton>
 </div>
 <div style="margin-bottom:20px;">
  <SButton color="blue" round plain icon="search">搜索按钮</SButton>
  <SButton color="green" round plain icon="edit">编辑按钮</SButton>
  <SButton color="gray" round plain icon="check">成功按钮</SButton>
  <SButton color="yellow" round plain icon="message">提示按钮</SButton>
  <SButton color="red" round plain icon="delete">删除按钮</SButton>
 </div>
 <div style="margin-bottom:20px;">
  <SButton color="blue" round plain icon="search"></SButton>
  <SButton color="green" round plain icon="edit"></SButton>
  <SButton color="gray" round plain icon="check"></SButton>
  <SButton color="yellow" round plain icon="message"></SButton>
  <SButton color="red" round plain icon="delete"></SButton>
 </div>
</template>
```
:::

## 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置 icon 属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用 i 标签即可，可以使用自定义图标。

```vue
<template>
 <div class="flex flex-row">
  <SButton icon="edit" plain></SButton>
  <SButton icon="delete" plain></SButton>
  <SButton icon="share" plain></SButton>
  <SButton round plain icon="search">搜索</SButton>
 </div>
</template>
```
````

看看效果吧。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e7a042419c543c9b9e126ef16810832~tplv-k3u1fbpfcp-zoom-1.image)

本章代码：  https://github.com/smarty-team/smarty-admin/tree/chapter04/packages/smarty-ui-vite

## 复盘

这节我们主要介绍的是如何给组件库进行文档建设。主要使用 Vitepress 实现。

大概总结如下：

1.  Vitepress 作为静态文档生成器，提供将 markdown 生成静态网站的能力；
1.  通过配置主题获取 vue 实例，加载组件库，对组件库运行 Demo 进行展示；
1.  通过引用 DemoBlock Markdown 插槽，可以达到同时展示 Demo 和代码块的酷炫效果。

最后建议大家尝试一下，用 Vitepress 调试代码的开发方式。我认为这种方式非常理想。不但可以方便调试，并且可以同步编写文档。

大家可以将这种开发的使用感受在评论区分享。

最后留一些思考题帮助大家复习：

-   如何配置 Vitepress 完成文档建设 ？
-   如何在 vitepress 中引用 vue 组件？
-   什么是 markdown 插槽 ？

下节课，我们将给组件库添加单元测试，下节课见。