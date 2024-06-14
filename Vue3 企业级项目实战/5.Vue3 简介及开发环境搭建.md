## 前言

之前一直有留意过 Vue 3 的相关事宜，但是等了很久正式版一直没有发布，2020 年 5 月份的时候说是 6 月份发布 release，2020 年 6 月份的时候说是 7 月份发布 release，2020 年 7 月份的时候说是 8 月份发布 release，把我的头都给忽悠掉了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dd5b794295a445f8b5969c6368ab468~tplv-k3u1fbpfcp-watermark.webp)

8 月份的时候说是 9 月份发布 release，然后就真的发布 release 版本了，2020 年 9 月 18 日，Vue3 正式开源！头都给我秀歪了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c6f09e22ac148e5a5fe4f5cb92a3829~tplv-k3u1fbpfcp-watermark.webp)

经历了两年多的开发与迭代，在 99 位贡献者的努力下 ，2600 次提交 628 次 PR，本章将从基础讲起，为大家介绍如何搭建 `Vue 3` 的开发环境。

## Vue 3 带来的变化

我已经关注 `Vue 3` 的动态有一年多的时间了，从 2020 年年初就开始说要发布正式版本，一月拖一月，直到今年 9 月 18 号，历时两年多的开发与迭代，2600 多次的提交，628 次 PR，`Vue 3` 终于发布正式版了。这意味着我们可以尝试着将其投入到生产环境中。当然，尤雨溪大大建议我们目前先保持观望学习状态，因为真正全面铺开来使用 `Vue 3` 还需一段时间。我保守估计要到 2021 年秋招的样子，`Vue 3` 周边插件才能完善。所以这个时候开始学习 `Vue 3` 是最好不过的时候，**机会总是留给有准备的人**。

[官方地址](https://cn.vuejs.org/) 在此，由于官方网站部署在国外服务器，所以国内的小伙伴打开可能会比较慢，影响学习体验，这里再提供一个 [国内CDN加速版](https://staging-cn.vuejs.org/)。

先来了解一下 `Vue 3` 带来了哪些新的变化。

- 性能的提升

  - 打包体积变小
  - 首次渲染更快
  - diff 算法更快
  - 内存使用减少

- Compositon API

  在使用 `Vue 2` 开发复杂组件的时候，业务逻辑多且复杂的情况下，难以复用。新推出的 `Composition API` 解决了这一问题，我们会在后续的文章教程中为大家逐一分析。

- 更好的 TypeScript 支持

  `Vue 3` 自身采用 `TS` 开发，更严谨的代码风格，以及更好的联想拓展。

## 初始化项目之 CDN 模式

想简单学习，或者制作简单页面的同学，可以采用引入静态资源 `CDN` 的形式，这样可以避免过重的项目搭建环节。如下所示：
```html
<script src="https://unpkg.com/vue@next"></script>
```

> https://unpkg.com/vue@next 可以拿到最新的 Vue 版本。

对于生产环境，推荐制定到一个明确的版本号，如 `vue@3.5`，以避免最新版本造成的不可预期的破坏。

下面新建一个 `vue3.html`：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Vue 3</title>
</head>
<style>
  [v-cloak]{
    display: none;
  }
</style>
<body>
  <div id="app" v-cloak>
    <p>姓名：{{ name }}</p>
    <p>职业：{{ state.work }}</p>
  </div>
  <script src="https://unpkg.com/vue@next"></script>
  <script>
  // Vue 现在存在于 window 全局变量下，所以直接通过 ES6 解构出 createApp、ref、reactive
  const { createApp, ref, reactive } = Vue;
  const App = {
    setup() {
      const name = ref("十三");
      const state = reactive({
        work: '软件工程师'
      })
      return {
        state,
        name
      };
    }
  };

  createApp(App).mount("#app");
</script>
</body>
</html>
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fea0c1a3e8724454ae750cadbf5acd78~tplv-k3u1fbpfcp-zoom-1.image)

> 用 VSCode 的小伙伴，推荐使用 Live Server 插件，可以直接在本地开启服务器调试 .html 文件。

静态资源 `CDN` 引入的开发形式，适用于一些简单的活动页、宣传页、官网等小项目，易于灵活的添加修改页面。但不利于项目的模块化开发，所以不适用一些中大型综合项目的开发。

通过打印 `Vue` 看看内部的 API 变化。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d0ba413a3f041408a4f0519bb6770b6~tplv-k3u1fbpfcp-zoom-1.image)

有兴趣的小伙伴，可以逐一查阅这些 `API` 都有什么能力。

## 初始化项目之 Vite 模式

`Vite` 是尤雨溪又一力作，号称下一代开发构建工具，由于其支持原生 `ES` 模块导入方法，所以它允许快速提供代码，使得开发效率大大提高。

#### 它有三个特点：

- 快速冷启动
- 即时的热模块更新
- 真正的按需编译

快速的冷启动，其实市面上也有类似的解决方案如 `Vue CLI`、`create-react-app`、`umi` 等等诸如此类快速启动工具。热更新也有相应的 `webpack-dev-server` 解决方案。但是按需编译需要我们自行在代码中使用 `import` 语法实现。

`Vite` 的按需编译按照尤雨溪的微博原话是这样解释的：

> Vite，一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 rollup 打。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。

接下来我们看看如何使用 `Vite` 启动一个项目：

打开命令行工具输入：

```bash
npm init @vitejs/app
```

> 兼容性注意，Vite 需要 Node.js 版本 >= 12.0.0。

根据提示输入项目名称和需要选择的模板（这里我们选择 vue 模板），并通过下列指令启动项目：

```bash
cd vue3-vite
npm install (or `yarn`)
npm run dev (or `yarn dev`)
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9870f8c2e633455290ad63033f3d9a1f~tplv-k3u1fbpfcp-zoom-1.image)

和 `Vue CLI` 启动项目有所区别的是，配置文件变成了 `vite.config.js`，可以通过[官方文档](https://cn.vitejs.dev/)查看相应的属性，如 port、base、plugins 等等。

## 项目初始化之 Vue CLI 模式

Vue 提供了一个[官方的 CLI](https://github.com/vuejs/vue-cli)，为单页应用（SPA）快速搭建基础功能齐全的项目脚手架。只需要几分钟的时间就可以运行起来，并且生成的项目带有热重载能力、保存时有 `eslint` 校验。

对于 `Vue 3`，`Vue CLI` 版本也有所升级，目前想要生成 `Vue 3` 项目，需要将其升级到 `4.5.x` 版本，具体操作如下：

```bash
yarn global add @vue/cli // 目前最高的版本为 5.0.8
# OR
npm install -g @vue/cli
```

> 在此之前，你需要先将本地的 @vue/cli 卸载，通过命令行 yarn remove global @vue/cli 或者 npm uninstall -g @vue/cli。

安装成功之后查看版本号，如下所示表示成功。

![](https://s.yezgea02.com/1661407737921/WeChat84a778ce8a02ac0b001e6dc189c95519.png)

初始化项目，输入如下指令：

```bash
vue create vue3-demo
```

![](https://s.yezgea02.com/1661410238477/WeChat7353b87f89b12d39f2884e74f7de2379.png)

第一个选项为创建 `Vue 3` 纯净版（不带路由、状态管理、样式预处理等）。
同理第二个选项为创建 `Vue 2.0` 纯净版。
第三个选项为组合搭配，可供选择的插件如下图所示：

![](https://s.yezgea02.com/1661410365497/WeChat31012605c450db0f0bf7ed92bb2a3a48.png)

上述默认回车后，会出现下图情况，系统会让你选择一个 `Vue` 的版本。

![](https://s.yezgea02.com/1661410475510/WeChat489d68b93bfc3b2bf03f451052792020.png)

之后的选择基本上和 Vue CLI 旧版本大同小异。

创建完成之后，目录结构如下所示：

![](https://s.yezgea02.com/1661411045795/WeChataa99051a7e028c59ae3a6b845c8e1501.png)

这里值得注意的是，早些时候`@vue/cli 4.5.x`版本，创建的下面中 `Vue` 的版本为 `3.x`，到了`@vue/cli 5.x`之后，创建的项目中 `Vue` 版本为 `3.2.x`，如下图所示。

![](https://s.yezgea02.com/1661412166778/WeChat138f03f5d494ff19b33ebdd491741e42.png)

这就意味着，我们可以在项目中使用最新的 `<script setup>` 语法，这将让代码显得更加简洁。

上述创建的项目启动之后，默认开启 8080 端口，可以自行通过 `vue.config.js` 配置项更改项目配置。

## Vue 3 周边相关插件文档

时至今日（2022 年 08 月 25日），很多周边插件已经开始有匹配 `Vue 3` 的版本出来了，在此罗列一下个插件的文档地址，以便大家查阅。

| 相关库名称 | 在线地址 🔗 |
| --------- | ----- |
| Vue3 官方文档 | [在线地址](https://cn.vuejs.org/guide/introduction.html) |
| Composition-API 手册 | [在线地址](https://vue3js.cn/vue-composition-api/) |
| Vue 3 源码学习 | [在线地址](https://vue3js.cn/start/) |
| Vue-Router 4.x 官方文档 | [在线地址](https://router.vuejs.org/zh/index.html) |
| Vuex 4.x| [Github](https://vuex.vuejs.org/) |
| vue-devtools | [Github](https://github.com/vuejs/vue-devtools/releases)(Vue3 需要使用最新版本) |
| Vite 中文文档 | [线上地址](https://cn.vitejs.dev/) |
| Vite 源码学习 | [线上地址](https://vite-design.surge.sh/guide/) |

🎨 更新 `Vue3` 版本的 UI 库：

| 相关库名称 | 文档地址 🔗 | 仓库地址 🏠 |
| --------- | ----- | ----- |
| Vant 3 | [在线地址](https://vant-contrib.gitee.io/vant/next/#/) | [在线地址](https://github.com/youzan/vant/tree/next) |
| Ant Design Vue 2.0 | [在线地址](https://2x.antdv.com/docs/vue/introduce-cn/) | [在线地址](https://github.com/vueComponent/ant-design-vue/) |
| Element-plus | [在线地址](https://element-plus.gitee.io/zh-CN/) | [在线地址](https://github.com/element-plus/element-plus/issues/171) |
| Taro(Vue3) | [在线地址](http://taro-docs.jd.com/taro/docs/vue3) | [在线地址](https://github.com/nervjs/taro) |

## 总结

本章节着重介绍了 `Vue 3` 初始化项目的几种形式，随着时间的推移，当前 `Vue 3` 的生态已经非常丰富，无论是 PC 还是 Mobile 的 UI 库，都已经对其进行适配和支持，相信不久的将来，`Vue 3` 将慢慢地取代 `Vue 2` 成为开发的主力。