通过前面两个章节，我们介绍了如何搭建 Vite 3 + Vue 3 + Electron 的开发环境和打包环境。但随着不断引入新的代码文件，我们的工程也开始变得复杂起来，而且接下去我们要引入更多的组件，比如 vue-router 组件、pinia 组件、模型代码文件等，工程势必会更加复杂，如果不在一开始就制定好工程的管控原则，那么势必会出现以下几个潜在的问题。

1. `没有规则的约束，工程师抽象模块或组件的方式就会不一样`，各有各的风格，最终导致协作出现问题。
2. 随着业务的不断增加，`工程会进入无序扩张的状态`，最终陷入混乱。
3. `增加开发人员维护工程的难度`，无论是新加入的开发人员，还是项目的老开发人员。

要想解决这些问题就要**控制好工程的结构**，为了达到这个目的，我们通过本节内容提供了一个**基本的工程管控策略**，（以后的章节我们还会进一步丰富这个管控策略），让你对我们将要完成的项目有一个宏观的认识。

除了介绍这个基本的工程管控策略外，我们还介绍了引入字体图标的知识，进一步举例这个管控策略的实施方式。

## 设计工程结构

在继续引入新的模块或组件之前，我们先调整一下工程的结构，如下图所示：


![4.1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b29a757b06f42c18a6d9706d0398e8c~tplv-k3u1fbpfcp-watermark.image?)

这个工程结构从上到下主要目录的含义如下。

- dist 目录是我们打包过程的临时产物放置目录。
- plugins 目录放置我们的开发环境 Vite 插件和打包 Vite 插件。
- release 目录放置最终生成的安装包。
- resource 目录放置一些外部资源，比如应用程序图标、第三方类库等。
- src/common 目录放置主进程和渲染进程都会用到的公共代码，比如日期格式化的工具类、数据库访问工具类等，主进程和渲染进程的代码都有可能使用这些类。
- src/main 目录放置主进程的代码。
- src/model 目录放置应用程序的模型文件，比如消息类、会话类、用户设置类等，主进程和渲染进程的代码都有可能使用这些类。
- src/renderer 目录放置渲染进程的代码。
- src/renderer/assets 放置字体图标、公共样式、图片等文件。
- src/renderer/Component 放置公共组件，比如标题栏组件、菜单组件等。
- src/renderer/store 目录存放 Vue 项目的数据状态组件，用于在不同的 Vue 组件中共享数据。
- src/renderer/Window 目录存放不同窗口的入口组件，这些组件是通过 vue-router 导航的，这个目录下的子目录存放对应窗口的子组件。
- src/renderer/App.vue 是渲染进程的入口组件，这个组件内只有一个<router-view />用于导航到不同的窗口。
- src/renderer/main.ts 是渲染进程的入口脚本。
- index.html 是渲染进程的入口页面。
- vite.config.ts 是 Vite 的配置文件。

这个目录结构还称不上完整，在将来的讲解中，我们还会为它增加更多的目录，届时会有详细说明。

调整好工程结构后，要修改一下 index.html 的代码才能让这些调整生效。实际上就是修改一下渲染进程入口脚本的引入路径，如下代码所示：

```html
<script type="module" src="/src/renderer/main.ts"></script>
```

现在这个工程的结构就体现出了我们对工程的管控策略，不过要想让这个策略生效，我们还要引入一个必备的组件：vue-router，接下来我们就介绍这个组件在我们工程中的重要作用。

## 使用 vue-router 支持工程管控策略

在让程序正常运行之前，需要先安装 vue-router 模块来控制应用程序加载组件的方式。通过如下指令安装 vue-router 模块：

```
npm install vue-router@4 -D
```

安装完成后，为 src/renderer/router.ts 添加如下代码逻辑：

```ts
//src/renderer/router.ts
import * as VueRouter from "vue-router";
//路由规则描述数组
const routes = [
  { path: "/", redirect: "/WindowMain/Chat" },
  {
    path: "/WindowMain",
    component: () => import("./Window/WindowMain.vue"),
    children: [
      { path: "Chat", component: () => import("./Window/WindowMain/Chat.vue") },
      { path: "Contact", component: () => import("./Window/WindowMain/Contact.vue") },
      { path: "Collection", component: () => import("./Window/WindowMain/Collection.vue") },
    ],
  },
  {
    path: "/WindowSetting",
    component: () => import("./Window/WindowSetting.vue"),
    children: [{ path: "AccountSetting", component: () => import("./Window/WindowSetting/AccountSetting.vue") }],
  },
  {
    path: "/WindowUserInfo",
    component: () => import("./Window/WindowUserInfo.vue"),
  },
];
//导出路由对象
export let router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
```

这段代码导出了一个 router 对象，这个 router 对象是基于 WebHistory 模式创建路由的，也就是说我们的页面路径看起来是这样的：`http://127.0.0.1:5173/WindowMain/PageChat`（开发环境），`app://index.html/WindowMain/PageChat`（生产环境）。使用 WebHistory 模式创建路由可以与我们前一节中讲解的 CustomScheme 兼容得很好。

上述代码中 routes 数组里的内容就是导航的具体配置了，我们在这些配置中使用 import 方法动态引入 Vue 组件，**Vite 在处理这种动态引入的组件时，会把对应的组件编译到独立的源码文件中**，类似 WindowUserInfo.689249b8.js 和 WindowSetting.6354f6d6.js，这种编译策略可以帮助我们很好控制最终编译产物的大小，避免应用启动时就加载一个庞大的 JavaScript 文件。

在应用启动时请求的路径是："/"，这个路径被重定向到"/WindowMain/Chat"，也就是说 WindowMain 组件和 Chat 组件是我们的首页组件（这是在第一个导航配置对象中设置的）。

上述代码完成后，需要在 main.ts 中使用它，代码如下：

```ts
import { router } from "./router";
createApp(App).use(router).mount("#app");
```

接下来把 App.vue 的代码修改成如下内容：

```html
<template>
  <router-view />
</template>
```

这样应用启动时，第一个窗口（主窗口）就会加载 src\renderer\Window\WindowMain.vue 组件的代码了。

当我们在主窗口内打开别的子窗口时（弹出一个子窗口），只要加载类似这样的路径/WindowUserInfo，就可以让子窗口加载 src\renderer\Window\WindowUserInfo.vue 这个组件了。

大家有没有发现，**无论工程将来增加什么业务，我们只要创建对应的业务组件，并添加对应的路由配置，就可以按照工程管控策略来管控我们的工程了**，这就是 vue-router 带给我们的好处。

创建了路由对象，我们还要使用这个路由对象，让用户也有权力控制应用内组件的加载逻辑，接下来我们就介绍这部分知识。

## 菜单组件及路由跳转

如果你仔细看了我们的的项目结构图，那么你会发现 src\renderer\Component 目录下有一个名为 BarLeft.vue 的组件，这是整个应用的侧边栏组件，里面放置应用程序的菜单。它的代码如下所示：

```ts
<script setup lang="ts">
//src\renderer\Component\BarLeft.vue
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
//菜单列表数组
let mainWindowRoutes = ref([
  { path: `/WindowMain/Chat`, isSelected: true, icon: `icon-chat`, iconSelected: `icon-chat` },
  { path: `/WindowMain/Contact`, isSelected: false, icon: `icon-tongxunlu1`, iconSelected: `icon-tongxunlu` },
  { path: `/WindowMain/Collection`, isSelected: false, icon: `icon-shoucang1`, iconSelected: `icon-shoucang` },
]);
let route = useRoute();
//注册路由变化监听器
watch(
  () => route,
  () => mainWindowRoutes.value.forEach((v) => (v.isSelected = v.path === route.fullPath)),
  {
    immediate: true,
    deep: true,
  }
);
</script>
```

```html
<template>
  <div class="BarLeft">
    <div class="userIcon">
      <img src="../assets/avatar.jpg" alt="" />
    </div>
    <div class="menu">
      <router-link v-for="item in mainWindowRoutes" :to="item.path" :class="[`menuItem`, { selected: item.isSelected }]">
        <i :class="[`icon`, item.isSelected ? item.iconSelected : item.icon]"></i>
      </router-link>
    </div>
    <div class="setting">
      <div class="menuItem">
        <i class="icon icon-setting"></i>
      </div>
    </div>
  </div>
</template>
```

这段代码有以下几点需要注意。

- 样式为 menu 的 Div 用于存放主窗口的菜单，我们是通过 mainWindowRoutes 数组里的数据来渲染这里的菜单。
- router-link 组件会被渲染成 a 标签，当用户点击菜单时，主窗口的二级路由发生跳转（src\renderer\Window\WindowMain.vue）。下面是主窗口的 html 代码：

```html
<template>
  <BarLeft />
  <div class="pageBox">
    <router-view />
  </div>
</template>
```

- **我们通过 watch 方法监控了路由跳转的行为**，当路由跳转后，我们会遍历 mainWindowRoutes 数组内的对象，取消以前选中的菜单，选中新的菜单。
- 由于 mainWindowRoutes 是一个 Ref 对象，所以菜单被选中或取消选中之后，相应的菜单样式（和菜单内的字体图标）也会跟着变化。

## 引入字体图标及避免小文件编译

我们在菜单组件中使用了好几个字体图标，我是在 https://www.iconfont.cn/ 获得这些字体图标的。

这里有两点需要你格外注意。

**第一点，引入必要的字体图标文件。** iconfont 默认会为我们生成很多字体图标文件，但这些文件都是为了兼容不同的浏览器准备的，Electron 使用 Chromium 核心，所以没必要把所有这些文件都集成到应用中。一般情况下我只使用 iconfont.css 和 iconfont.ttf 这两个文件。把这两个文件放置到项目中后，在 main.ts 导入一下 iconfont.css 即可全局使用字体图标了。代码如下：

```ts
//src\renderer\main.ts
//全局导入字体图标
import "./assets/icon/iconfont.css";
```

```html
<!--使用字体图标-->
<i class="icon icon-chat"></i>
```

**第二点，关闭小文件编译的行为**。如果你的 iconfont.ttf 足够小，那么 Vite 会把它转义成 base64 编码的字符串，直接嵌入到我们的样式文件中。Vite 之所以这样做，主要是为了减少请求数量。但我们的应用是本地应用，每个请求都会在极短的时间内完成，所以**没必要为了减少请求数量而增加单个文件的解析开销**，开发者可以通过在 vite.config.ts 中增加 build.assetsInlineLimit 配置（值设置为 0 即可）来关闭 Vite 的这个行为。

现在运行我们的应用看看是不是符合预期呢？


![4.2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cafbc799362a42bc89b578836842a3ff~tplv-k3u1fbpfcp-watermark.image?)

## 总结

我们通过本节课的知识学习了如何控制一个工程的基本结构。

首先我们介绍了如何设计工程的结构，然后我们阐述了如何借助 vue-router 的力量来管控工程的结构，接着我们通过介绍菜单组件来讲解如何在工程管控策略下为工程增加组件。在介绍菜单组件时，我们还附带介绍了如何为工程引入字体图标资源的相关知识。

有了本节课的知识，我们就可以很从容地应对本节开篇时提到的几个问题，而且有了本节的基础，我们就可以为工程引入更多的逻辑，介绍更复杂的技术细节。

接下来我们将介绍如何管控应用程序的窗口，敬请期待。

## 源码

本节示例代码请通过如下地址自行下载：

[源码仓储](https://gitee.com/horsejs_admin/electron-jue-jin/tree/router)
