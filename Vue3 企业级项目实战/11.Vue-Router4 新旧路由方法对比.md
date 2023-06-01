## 前言

在平时的业务开发中，`Vue-Router` 是必不可少的插件，它的作用也很明确，就是通过路径匹配出响应的组件，单页面有了它，才算是如虎添翼，否则就是一只 `Hello Kitty`。

接下通过实例讲解和原理分析，把路由这块知识吃透。

## 初始化

通过 `Vite` 初始化一个空项目，运行指令：

```bash
npm init @vitejs/app vue3-vite --template vue
```

创建两个页面，用于路由切换，在 `src` 目录下新建 `views` 目录，添加 `Home.vue` 和 `About.vue` 文件，如下所示：

```html
<!--Home.vue-->
<template>
  Home
</template>

<script>
export default {
  name: 'Home'
}
</script>
```

```html
<!--About.vue-->
<template>
  About
</template>

<script>
export default {
  name: 'About'
}
</script>
```

然后通过 `npm install vue-router@next` 下载最新的路由插件。成功之后，在 `src` 目录下新建 `router/index.js`，添加如下代码：

```js
import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHashHistory(), // createWebHashHistory 为哈希模式的路由，如果需要选择 histiry 模式，可以用 createWebHistory 方法。
  routes: [ // routes 属性和 vue-router 3 的配置一样，通过数组对象的形式，配置路径对应展示的组件。
    {
      path: '/',
      name: '/',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

export default router
```

完成上述操作之后，我们来到 `main.js` 把上述通过 `export default router` 抛出的路由实例引入 `Vue` 生成的实例，代码如下所示：

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router'

// 生成 app 实例。
const app = createApp(App)
// 通过 use 引入 路由实例。
app.use(router)
// 将实例挂载到 #app 节点上。
app.mount('#app')
```

通过指令 `npm run dev` 运行项目，浏览器展示如下所示表示成功：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc82009e5b0b481188e02362107c74ef~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，`/` 匹配到了 `Home` 组件；`/about` 匹配到了 `About` 组件。

## 路由之间的跳转

组件之间必定需要通过跳转的形式关联起来，形成一个整体。

#### 组件形式跳转

我们可以使用 `vue-router` 为我们提供的全局组件 `router-link`。修改 `Home.vue` 如下所示：

```js
<template>
  <router-link to='/about'>Home</router-link>
</template>

<script>
export default {
  name: 'Home'
}
</script>
```

浏览器展示如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4edb36cf037b4fef9e6293a7cb6af986~tplv-k3u1fbpfcp-zoom-1.image)

注意上图，浏览器并没有因为点击跳转而刷新页面，这就是路由带来的单页面切换组件能力，在不刷新页面的情况下，改变可视区域的组件。

假如我们将 `router-link` 换成普通的 `a` 标签 `href` 跳转，也能实现页面组件之间的切换，但是这样就会导致浏览器页面的刷新，这并不是我们的初衷，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2ddd09b68064467ac1df632258b2838~tplv-k3u1fbpfcp-zoom-1.image)


#### 方法形式跳转

我们也可以通过调用方法的形式，实现路由的跳转，修改 `Home.vue` 如下所示：

```html
<template>
  <button @click="linkTo">Home</button>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const linkTo = () => {
      router.push({
        path: '/about'
      })
    }

    return {
      linkTo
    }
  }
}
</script>
```

通过 `useRouter` 生成路由实例 `router`，其内部都是路由相关的方法，如跳转方法、路由守卫、返回方法等等。可以通过打印 `router` 查看内部的一些属性方法。

上述代码通过 `push` 方法跳转路由，浏览器如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5caf84a49f8e4985908d483fc9966759~tplv-k3u1fbpfcp-zoom-1.image)

## 参数传递

路由参数传递有两种方式，一种是通过浏览器查询字符串的形式，另外一种是通过 `params` 形式传递，我们来逐一分析：

#### 浏览器查询字符串 query

**router-link**：

```html
<!--Home.vue-->
<template>
  <router-link :to="{ path: '/about', query: { id: 1 } }">Home</router-link>
</template>

<script>
export default {
  name: 'Home'
}
</script>
```

**router.push**：

```html
<template>
  <button @click="linkTo">Home</button>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    console.log('router', router)
    const linkTo = () => {
      router.push({
        path: '/about',
        query: {
          id: 1
        }
      })
    }

    return {
      linkTo
    }
  }
}
</script>
```

接收参数的话，我们修改 `About.vue` 如下所示：

```html
<template>
  About
</template>

<script>
import { useRoute } from 'vue-router'
export default {
  name: 'Abput',
  setup() {
    const route = useRoute()
    const { id } = route.query
    console.log('id=', id)
  }
}
</script>
```

上述两种形式效果如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8b554b00b9b4ba6ae4ff91306106d53~tplv-k3u1fbpfcp-zoom-1.image)


#### params 形式

如果我们不想污染浏览器查询字符串，但又想通过路由传参，`params` 是最好的选择。

**router-link**：

```html
<!--Home.vue-->
<template>
  <router-link :to="{ name: 'about', params: { id: 1 } }">Home</router-link>
</template>

<script>
export default {
  name: 'Home'
}
</script>
```

**router.push**：

```html
<template>
  <button @click="linkTo">Home</button>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const linkTo = () => {
      router.push({
        name: 'about',
        params: {
          id: 1
        }
      })
    }

    return {
      linkTo
    }
  }
}
</script>
```

这里要注意，通过 `params` 穿插，跳转的属性要通过 `name` 来控制，否则是拿不到传递的变量的。

接收组件 `About.vue` 修改如下：

```html
<template>
  About
</template>

<script>
import { useRoute } from 'vue-router'
export default {
  name: 'About',
  setup() {
    const route = useRoute()
    const { id } = route.params
    console.log('id=', id)
  }
}
</script>
```

浏览器展示如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a010db368f6e40a692a6f1d92a552274~tplv-k3u1fbpfcp-zoom-1.image)

这里提醒大家，如果使用 `params` 的形式传参，在目标页面 `About.vue` 手动刷新的话，就拿不到 `params` 参数了，所以我个人使用 `query` 居多。

## 路由守卫

很多时候你需要监听路由的变化，从而来实现一个业务逻辑，那么在全新的 `Vue-Router 4` 中是如何实现路由守卫的呢？

#### beforeEach 和 afterEach

`beforeEach` 和 `afterEach` 方法接收一个回调函数，回调函数内可以通过 `router.currentRoute`拿到当前的路径参数，所以在这里可以监听到路由的变化，我们通过修改 `App.vue` 如下所示：

```html
<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'App',
  setup() {
    const router = useRouter()
    router.afterEach(() => {
      console.log('path::', router.currentRoute.value.path)
    })
  }
}
</script>
```

浏览器表现如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d76e9953d1e442e8cf16c1467521563~tplv-k3u1fbpfcp-zoom-1.image)

## 路由原理浅析

我们带着三个问题来阅读后续的文章。

- 为什么会出现前端路由？
- 前端路由解决了什么问题？
- 前端路由实现的原理是什么？

#### 传统页面

这里不纠结叫法，凡是整个项目都是 `DOM` 直出的页面，我们都称它为“传统页面”（`SSR` 属于首屏直出，这里我不认为是传统页面的范畴）。那么什么是 `DOM` 直出呢？简单说就是在浏览器输入网址后发起请求，返回来的 `HTML` 页面是最终呈现的效果，那就是 `DOM `直出。并且每次点击页面跳转，都会重新请求 `HTML` 资源。耳听为虚，眼见为实。我们以这个地址为例，验证一下上述说法。

> https://www.cnblogs.com/han-1034683568/p/14126727.html#4773138

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90c234badd9b412399615c1622fb78e2~tplv-k3u1fbpfcp-zoom-1.image)

腚眼一看，就能明白上图在描述什么。没错，博客园就是一个传统页面搭建而成的网站，每次加载页面，都会返回 `HTML` 资源以及里面的 `CSS` 等静态资源，组合成一个新的页面。

“瞎了”的同学，我再教一个方法，就是在浏览器页面右键，点击“显示网页源代码”，打开后如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c14b94fc22de47be8ae7bf7b1476b24b~tplv-k3u1fbpfcp-zoom-1.image)

网页上能看到什么图片或文字，你能在上述图片中找到相应的 `HTML` 结构，那也属于传统页面，也就是 `DOM` 直出。

#### 单页面

时代在进步，科技在发展，面对日益增长的网页需求，网页开始走向模块化、组件化的道路。随之而来的是代码的难以维护、不可控、迭代艰难等现象。面临这种情况，催生出不少优秀的现代前端框架，首当其冲的便是 `React` 、 `Vue` 、 `Angular` 等著名单页面应用框架。而这些框架有一个共同的特点，便是“通过 `JS` 渲染页面”。

举个例子，以前我们直出 `DOM` ，而现在运用这些单页面框架之后， `HTML` 页面基本上只有一个 `DOM` 入口，大致如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ffef8918b4a4b9cb4401cc7a6dc4eb4~tplv-k3u1fbpfcp-zoom-1.image)

所有的页面组件，都是通过运行上图底部的 `app.js` 脚本，挂载到 `<div id="root"></div>` 这个节点下面。用一个极其简单的 `JS` 展示挂载这一个步骤：

```html
<body>
  <div id="root"></div>
  <script>
    const root = document.getElementById('root') // 获取根节点
    const divNode = document.createElement('div') // 创建 div 节点
    divNode.innerText = '你妈贵姓？' // 插入内容
    root.appendChild(divNode) // 插入根节点
  </script>
</body>
```

既然单页面是这样渲染的，那如果我有十几个页面要互相跳转切换，咋整！！？？这时候 前端路由 应运而生，它的出现就是为了解决单页面网站，通过切换浏览器地址路径，来匹配相对应的页面组件。我们通过一张丑陋的图片来理解这个过程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ac50c7ba4cd4d85bbbdb3cd491b1e47~tplv-k3u1fbpfcp-zoom-1.image)

前端路由 会根据浏览器地址栏 `pathname` 的变化，去匹配相应的页面组件。然后将其通过创建 `DOM` 节点的形式，塞入根节点 `<div id="root"></div>` 。这就达到了无刷新页面切换的效果，从侧面也能说明正因为无刷新，所以 `React`、`Vue`、`Angular` 等现代框架在创建页面组件的时候，每个组件都有自己的 生命周期 。

#### 原理

前端路由 插件比较火的俩框架对应的就是 `Vue-Router` 和 `React-Router` ,但是它们的逻辑，归根结底还是一样的，用殊途同归四个字，再合适不过。

通过分析哈希模式和历史模式的实现原理，让大家对前端路由的原理有一个更深刻的理解。

**哈希模式**

`a` 标签锚点大家应该不陌生，而浏览器地址上 `#` 后面的变化，是可以被监听的，浏览器为我们提供了原生监听事件 `hashchange`，它可以监听到如下的变化：

- 点击 a 标签，改变了浏览器地址。
- 浏览器的前进后退行为。
- 通过 `window.location` 方法，改变浏览器地址。

接下来我们利用这些特点，去实现一个 `hash` 模式的简易路由： [在线运行](https://codepen.io/nick930826/pen/BaLGprx)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hash 模式</title>
</head>
  <body>
    <div>
      <ul>
        <li><a href="#/page1">page1</a></li>
        <li><a href="#/page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  <script type="text/javascript">
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener('DOMContentLoaded', Load)
    window.addEventListener('hashchange', HashChange)
    // 展示页面组件的节点
    var routeView = null
    function Load() {
      routeView = document.getElementById('route-view')
      HashChange()
    }
    function HashChange() {
      // 每次触发 hashchange 事件，通过 location.hash 拿到当前浏览器地址的 hash 值
      // 根据不同的路径展示不同的内容
      switch(location.hash) {
      case '#/page1':
        routeView.innerHTML = 'page1'
        return
      case '#/page2':
        routeView.innerHTML = 'page2'
        return
      default:
        routeView.innerHTML = 'page1'
        return
      }
    }
  </script>
  </body>
</html>
```

> 当然，这是很简单的实现，真正的 hash 模式，还要考虑到很多复杂的情况，大家有兴趣就去看看源码。

浏览器展示效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c63aefb5291845bda877ec0a1d1a7fee~tplv-k3u1fbpfcp-zoom-1.image)

**历史模式**

`history` 模式会比 `hash` 模式稍麻烦一些，因为 `history` 模式依赖的是原生事件 `popstate` ，下面是来自 `MDN` 的解释：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e778ae17bb64effb55b03edad66f8df~tplv-k3u1fbpfcp-zoom-1.image)

> 小知识：pushState 和 replaceState 都是 HTML5 的新 API，他们的作用很强大，可以做到改变浏览器地址却不刷新页面。这是实现改变地址栏却不刷新页面的重要方法。

包括 `a` 标签的点击事件也是不会被 `popstate` 监听。我们需要想个办法解决这个问题，才能实现 `history` 模式。

解决思路：

我们可以通过遍历页面上的所有 `a` 标签，阻止 `a` 标签的默认事件的同时，加上点击事件的回调函数，在回调函数内获取 `a` 标签的 `href` 属性值，再通过 `pushState` 去改变浏览器的 `location.pathname` 属性值。然后手动执行 `popstate` 事件的回调函数，去匹配相应的路由。逻辑上可能有些饶，我们用代码来解释一下：[在线地址](https://codepen.io/nick930826/pen/BaLGprx)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>History 模式</title>
</head>
<body>
  <div>
    <ul>
      <li><a href="/page1">page1</a></li>
      <li><a href="/page2">page2</a></li>
    </ul>
    <div id="route-view"></div>
  </div>
  <script type="text/javascript">
    window.addEventListener('DOMContentLoaded', Load)
    window.addEventListener('popstate', PopChange)
    var routeView = null
    function Load() {
      routeView = document.getElementById('route-view')
      // 默认执行一次 popstate 的回调函数，匹配一次页面组件
      PopChange()
      // 获取所有带 href 属性的 a 标签节点
      var aList = document.querySelectorAll('a[href]')
      // 遍历 a 标签节点数组，阻止默认事件，添加点击事件回调函数
      aList.forEach(aNode => aNode.addEventListener('click', function(e) {
        e.preventDefault() //阻止a标签的默认事件
        var href = aNode.getAttribute('href')
        //  手动修改浏览器的地址栏
        history.pushState(null, '', href)
        // 通过 history.pushState 手动修改地址栏，
        // popstate 是监听不到地址栏的变化，所以此处需要手动执行回调函数 PopChange
        PopChange()
      }))
    }
    function PopChange() {
      console.log('location', location)
      switch(location.pathname) {
      case '/page1':
        routeView.innerHTML = 'page1'
        return
      case '/page2':
        routeView.innerHTML = 'page2'
        return
      default:
        routeView.innerHTML = 'page1'
        return
      }
    }
  </script>
</body>
</html>
```

> 这里注意，不能在浏览器直接打开静态文件，本地直接打开 html 文件用的是 file 协议，
 popstate 监听的是 HTTP 协议，需要通过 web 服务，启动端口去浏览网址。

 ## 总结

 本章节主要知识点集中在前端路由这块，能完全看完，并且把实现原理捋一遍，我想你应该对现代前端框架会有一个新的理解。包括对 `Vue-Router 4` 的使用也有了初步的了解。 
 
 > 文档最近更新时间：2022 年 9 月 20 日。