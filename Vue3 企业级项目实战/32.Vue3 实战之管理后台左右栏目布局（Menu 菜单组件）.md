## 前言

我们终于进入了项目实战部分，首先我们先来把整个项目的布局搭建完善，以便后续的业务需求顺利展开。本项目采用左边栏固定宽度，右边栏上中下结构，自适应宽度的布局。

布局样式如下图所示：

![](https://s.yezgea02.com/1616858001419/31-1.png)

如上图所示，“头部”和“底部”的部分，是固定的，中间“内容”部分为可滚动块。这样的布局在生产环境中很常见，掌握这个布局的基础搭建和代码实现，之后融汇贯通、举一反三，可以大大提升你的布局能力。

#### 本章节知识点

- 需要注册的组件：`ElContainer`、`ElAside`、`ElMenu`、`ElSubMenu`、`ElMenuItemGroup`、`ElMenuItem`。
- Flex 布局的使用。
- 路由监听事件。

## 入口页布局

像上图这样的布局，左侧有公共导航栏部分，基本上是逃不开在 `App.vue` 内做文章。

之前在搭建环境章节中，我们已经讲过，`<router-view>` 标签是用于放置 `views` 文件夹下的页面组件，如果我们想实现公共侧边栏，就必须和 `<router-view>` 同级，否则你就得在每一个 `views` 下的页面级组件内都写上一套侧边栏。这样做的话，代码就非常累赘，且不易维护，一旦想修改侧边栏的样式或结构，你得在每一个页面组件内去修改。提取出来后，便可只修改一个地方，这便是提取公共组件的好处。

我们进入 `App.vue` 脚本，添加如下内容：

```html
<template>
  <div class="layout">
    <el-container class="container">
      <el-aside class="aside">
        <!--系统名称+logo-->
        <div class="head">
          <div>
            <img src="//s.weituibao.com/1582958061265/mlogo.png" alt="logo">
            <span>vue3 admin</span>
          </div>
        </div>
        <!--一条为了美观的线条-->
        <div class="line" />
        <el-menu
          background-color="#222832"
          text-color="#fff"
        >
          <!--一级栏目-->
          <el-sub-menu index="1">
            <template #title>
              <span>Dashboard</span>
            </template>
            <!--二级栏目-->
            <el-menu-item-group>
              <el-menu-item><el-icon><DataLine /></el-icon>系统介绍</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
    </el-container>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}
.container {
  height: 100vh;
}
.aside {
  width: 200px!important;
  background-color: #222832;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.head span {
  font-size: 20px;
  color: #ffffff;
}
.line {
  border-top: 1px solid hsla(0,0%,100%,.05);
  border-bottom: 1px solid rgba(0,0,0,.2);
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
```

上述代码已添加相应的注释，每段 `div` 的作用都已在代码中体现，接下来我们看看效果如何，如下图所示：

![](https://s.yezgea02.com/1616981269907/WeChat7c38e5bf951c229584770f3ddbe1a963.png)

左侧栏目的样式已经初步形成，除了完成了页面样式之外，点击左边栏需要触发路由的变化，比如点击“系统介绍”，地址栏变化的同时右侧视图也应该随之变化。

`el-menu` 组件有一个 `router` 属性，它的作用是：

> 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转

默认状态下，`router` 属性是 `false` 状态，所以我们先开启它，代码修改如下：

```diff
...
 <el-menu
  background-color="#222832"
  text-color="#fff"
+  :router="true"
 >
...
```

然后我们再添加 `el-menu-item` 的 `index` 属性，代码修改如下：

```diff
...
 <el-menu-item-group>
+  <el-menu-item index="/"><el-icon><DataLine /></el-icon>首页</el-menu-item>
 </el-menu-item-group>
...
```

重新启动项目，浏览器展示如下：

![](https://s.yezgea02.com/1616983381699/WeChat8306c8990781abf3b3fc38a793721809.png)

`Index.vue` 组件内容，变到页面下方去了，原因就是代码中还没有对右侧做布局。

继续在 `App.vue` 下添加代码，在 `el-aside` 同级下方，添加 `el-container` 组件，如下所示：

```html
<el-aside>
</el-aside>
<!--右边内容布局-->
<el-container class="content">
  <div class="main">
    <!--将 <router-view></router-view> 移到这里，并且用单标签-->
    <router-view />
  </div>
</el-container>

 <style scoped>
  ...
  .content {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    overflow: hidden;
  }
  .main {
    height: 100vh;
    overflow: auto;
    padding: 10px;
  }
 </style>
```

效果如下图所示：

![](https://s.yezgea02.com/1616984007294/WeChat8203216c6f9a770fb1de055e847346e1.png)

左右栏布局基本成型，这样的布局在大多数后台管理系统的场景下都非常适用。这里要注意灵活的使用 `Flex` 布局。可以这么说，有了它，你基本上可以抛弃 `float` 浮动布局。目前各大浏览器对 `Flex` 布局的兼容已经做得很好了。这里推荐给大家一个练习 `Flex` 布局的小游戏，过完一遍基本上就会了。

> http://flexboxfroggy.com/#zh-cn

## 右边栏上中下布局

回过头来看开头的原型图，在右侧的内容部分，页面中还缺少头部和底部的两个区域没有制作，这里就会涉及到公共组件的编写，我们在 `components` 文件夹新建一个 `Header.vue`，内容如下：

```html
<!--Header.vue-->
<template>
  <div class="header">
    <div class="left">左</div>
    <div class="right">右</div>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
  .header {
    height: 50px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
</style>
```

代码中给一个 `50px` 的高度，和左边栏的 logo 高度保持一致，这样更加协调一些，具体大小可自己控制。头部左右布局，上下居中，我们使用如下代码：

```css
display: flex;
justify-content: space-between;
align-items: center;
```

这样的布局在后续的开发中会大量用到，同学们注意一下，后续就不赘述了。

同样的，在 `components` 再新建一个底部组件 `Footer.vue`，内容如下：

```html
<!--Footer.vue-->
<template>
  <div class="footer">
    <div class="left">Copyright © 2019-2021 十三. All rights reserved.</div>
    <div class="right">
      <a target="_blank" href="https://github.com/newbee-ltd/vue3-admin">vue3-admin Version 3.0.0</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
  .footer {
    height: 50px;
    border-top: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
</style>
```

接下来在 `App.vue` 中引入 `Header.vue` 和 `Footer.vue` 组件，如下所示：

```diff

 <el-container class="content">
+  <Header />
  <div class="main">
    <router-view />
  </div>
+  <Footer />
 </el-container>

 <script>
+  import Header from '@/components/Header.vue'
+  import Footer from '@/components/Footer.vue'
 </script>

export default {
  name: 'App',
  components: {
+    Header,
+    Footer
  },
}
```

添加完后，页面如下所示：

![](https://s.yezgea02.com/1616989167452/WeChat7ec6b973094b5ac5b147f0b93cfc2fec.png)

如此，便基本上实现了页面右侧的上-中-下的布局。

我们还差一步，就是中间 `main` 的内容高度之前是 `100vh`，添加 `Header` 和 `Footer` 之后，`main` 的高度应该是 `100vh - 100px`，所以在 `App.vue` 的样式处做如下代码修改：

```diff
.main {
-  height: 100vh;
+  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
```

这样的话，页面中的内容撑开后不会有一部分被挡着，如下所示：

![](https://s.yezgea02.com/1616989810587/Kapture%202021-03-29%20at%2011.50.01.gif)

整个项目的布局部分就基本确定了，后续同学们可以根据自己的需要，在 `App.vue` 上进行结构上的微调。

## 左边栏切换，右侧头部信息联动 — 路由监听

现在，我想在 `Header.vue` 的内部，根据路径的变化，来展示相应的页面 `title`。

比如我点击左边栏的 `A` 菜单，`Header.vue` 就显示 `A` 作为 `title`，原型图如下：

![](https://s.yezgea02.com/1616997282855/ssss.png)

想要实现这样的需求，就要涉及到路由监听，在 `Header.vue` 下添加如下代码：

**template**：
```diff
 <template>
  <div class="header">
    <div class="left">
+      <span style="font-size: 20px">{{ state.name }}</span>
    </div>
    <div class="right">右</div>
  </div>
 </template>
```

**script**
```js
<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
// 获取路由实例
const router = useRouter()
// 声明路由和 title 对应的键值对
const pathMap = {
  index: '首页',
  add: '添加商品'
}
const state = reactive({
  name: '首页'
})
// 监听路由变化方法 afterEach
router.afterEach((to) => {
  console.log('to', to)
  // to 能获取到路由相关信息。
  const { id } = to.query
  state.name = pathMap[to.name]
})
</script>
```

我们来看看 `to` 里面到底有什么内容：

![](https://s.yezgea02.com/1617012472332/WeChatf26d7f5bbeddbeb9f6bba4474e8383dd.png)

所有路由相关大属性参数，都在里面，比较有用的参数如下：

- path：路径参数，`#` 号后面的路径参数，如首页 `/`，下面会出现的商品添加页 `/add`。
- name：这个在定义路由配置的时候，只要你写上，就会是对应的值，下面也会讲到。
- query：浏览器路径上带的查询参数如 `?id=1`，都会被构建到这里，路径传参的时候会用到它。
- meta：同样也是在路由配置项里设置，如 `keepalive` 会使用到它。
- params：另一种不在浏览器地址栏上显示的传参形式。

> 其他参数用到的比较少，等到具体使用到了在做解释。

之前已经在 `views` 下新建了 `Index.vue` 组件，我们再来新建一个 `AddGood.vue` 组件，用于后续的商品添加功能模块。

```html
<!--/src/views/AddGood.vue-->
<template>
  添加商品
</template>

<script setup>
</script>
```

紧接着我们需要去路由脚本声明一下刚刚添加的组件，打开 `/src/router/index.js`，如下所示：

```diff
+ import AddGood from '@/views/AddGood.vue'

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  routes: [
    {
      path: '/',
+      name: 'index',
      component: Index
    },
+    {
+      path: '/add',
+      name: 'add',
+      component: AddGood
+    }
  ]
})
```

> 注意，每次添加新的页面组件之后，千万不要忘记在 src/router/index.js 路由配置脚本里加上组件的路径配置。刚入行时，我经常会犯这样的低级错误，一头雾水，不知所措。

我们为上述的路由配置添加一个 `name` 属性，便于获取参数，可以直接进行操作，少写一个 `/`。这里为什么说少写一个 `/` 呢，我们从 `router.afterEach` 的回调函数中，获取的 `to` 变量，如果是获取 `path` 属性，会带上一个斜杠，如 `/add`，这样我们在写键值对的时候，也要写成如下：

```js
{
  '/add': '添加商品'
}
```

这里不要小看了多一个 `/`，哪怕少写一个单词，也是为最后的打包将少体积，在某种程度上，这也是项目优化的一种形式，合抱之木，生于毫末；九层之台，起于垒土。

比如 `CSS` 样式的提取，尽量减少重复样式，能公用的尽量公用。写循环的时候尽量使用 `ES6` 的语法，减少代码量，为最后的打包体积作出贡献。

组件和路径都配置好了，我们再进入 `App.vue` 页面，进行菜单的配置：

```diff
 <el-menu-item-group>
  <el-menu-item index="/"><el-icon><DataLine /></el-icon>首页</el-menu-item>
+  <el-menu-item index="/add"><el-icon><DataLine /></el-icon>添加商品</el-menu-item>
 </el-menu-item-group>
```

这里解释一下，路径的跳转不一定要通过 `el-menu-item` 的 `index` 属性，我们使用了 `Element Plus` 的菜单组件，顺便就用它内置的路径跳转方法。

我们也可以自己实现一个菜单列表，通过 `Vue-Router` 提供的 `router-link` 或者 `useRouter` 返回的实例，进行路由跳转操作。

我们打开浏览器查看效果如下：

![](https://s.yezgea02.com/1617000099767/Kapture%202021-03-29%20at%2014.41.28.gif)

## 总结

一个项目的布局，非常磨练开发者掌握大局的功底。就像一个房子的地基，房子牢不牢靠，地基是关键。本章节详细的为大家阐述了，如何从 0 开始一个项目布局的搭建，合理地利用组件库的能力，尽量减少模板和样式代码的编写，用尽量少的代码，搭建出一个灵活的布局。

#### 本章源码地址

[点击下载](https://s.yezgea02.com/1663210179470/admin01.zip)

> 文档最近更新时间：2022 年 9 月 20 日。
