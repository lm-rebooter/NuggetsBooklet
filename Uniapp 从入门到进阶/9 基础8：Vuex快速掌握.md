# Vuex快速掌握

> Done is better than perfect. —— Facebook

本节主要介绍 Vuex 的基本概念，并一步步引导读者如何去运用 Vuex 在一个应用中，以浅显易懂的例子掌握 Vuex 的核心知识。

## 什么是 Vuex？

首先我们要弄清楚 Vuex 是做什么的？为什么使用 Vuex ?

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。uniapp集成了vuex的状态管理功能，可以在多端情况下使用。

Vuex 需要解决的问题：

1. 多个视图依赖于同一状态。比如当前音乐应用的账号页，我的页面保持登录状态以及用户信息。
2. 来自不同视图的行为需要变更同一状态。比如登录页更改登录状态，账号页面退出登录改成未登录状态。

这个状态自管理应用包含以下几个部分：

* state，驱动应用的数据源；
* view，以声明方式将 state 映射到视图；
* actions，响应在 view 上的用户输入导致的状态变化。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/18/170ecdfad7d01fc2~tplv-t2oaga2asx-image.image)

上面的概念比较模糊，我们先来点简单的。

在这引用了一位技术大拿关于管理状态（state）的讲解：

> 不管是 Vue ，还是 React，都需要管理状态（state），比如组件之间都有共享状态的需要。什么是共享状态？比如一个组件需要使用另一个组件的状态，或者一个组件需要改变另一个组件的状态，都是共享状态。

> 父子组件之间，兄弟组件之间共享状态，往往需要写很多没有必要的代码，比如把状态提升到父组件里，或者给兄弟组件写一个父组件，听听就觉得挺啰嗦。

> 如果不对状态进行有效的管理，状态在什么时候，由于什么原因，如何变化就会不受控制，就很难跟踪和测试了。如果没有经历过这方面的困扰，可以简单理解为会搞得很乱就对了。

> 在软件开发里，有些通用的思想，比如隔离变化，约定优于配置等，隔离变化就是说做好抽象，把一些容易变化的地方找到共性，隔离出来，不要去影响其他的代码。约定优于配置就是很多东西我们不一定要写一大堆的配置，比如我们几个人约定，view 文件夹里只能放视图，不能放过滤器，过滤器必须放到 filter 文件夹里，那这就是一种约定，约定好之后，我们就不用写一大堆配置文件了，我们要找所有的视图，直接从 view 文件夹里找就行。

> 根据这些思想，对于状态管理的解决思路就是：把组件之间需要共享的状态抽取出来，遵循特定的约定，统一来管理，让状态的变化可以预测。根据这个思路，产生了很多的模式和库。

Vuex 防止随意修改而不好跟踪状态，规定组件不允许直接修改 store 实例的 state，组件必须通过 action 来改变 state ，也就是说，组件里面应该执行 action 来分发 (dispatch) 事件通知 store 去改变。这样约定的好处是，我们能够记录所有 store 中发生的 state 改变，同时实现能做到记录变更 (mutation)、保存状态快照、历史回滚的先进的调试工具。

## Vuex 的基础使用（创建一个改变登录状态的应用）

我们一个简单的登录状态的应用开始。

第一步，创建 store ；

首先在根目录下新建文件夹 `store`，并创建 index.js ：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isLogin: false   // 是否登录的状态，默认为未登录 false
    },
    mutations: {
        // 定义一个操作isLogin状态的方法
        storeLogin (state) {
          state.isLogin = true
        }
    }
})

export default store
```

上面代码引入了 `vue`，`vuex` ，并使用 `Vue.use(Vuex)` 安装Vuex插件，在 `new Vuex.Store` 传参对象中定义 `state` ，`mutations` 。

我在上面定义了 `isLogin`，整个项目以这个变量作为登录标记，`storeLogin` 的方法来修改 `isLogin` 值，而且修改 `isLogin` 值只能通过 `storeLogin` 方法。

第二步，新建登录页login.vue；

在 `pages` 下新建一个页面 login.vue，鼠标悬浮在当前项目目录下选择【新建页面】，命名为 `login` 勾选【自动在 pages.json 中注册】:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/12/16e5d785d3999a06~tplv-t2oaga2asx-image.image)

上面新建了一个 `login` 路由页面，勾选【自动在 pages.json 中注册】是在 `pages.json` 文件中注册页面路由，在 HBuilder 上部操作 【运行】>>【运行到浏览器】>> 选择一个浏览器，这样客户端就能以 `http://localhost:8080/#/pages/login/login` 访问。



第三步，引入 Vuex ；

在主入口 main.js 引入刚才新建的 store：

```js
import Vue from 'vue'
import App from './App'
import store from './store'

Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

```

使用 `Vue.prototype.$store = store` 把 `store` 挂在到 `Vue` 中，这样整个项目就可以共享这个 `$store` 状态，通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 `this.$store` 访问到。下面要在 login.vue 页面共享 `isLogin` 登录状态；

```html
<!-- login.vue -->
<template>
    <view>
       登录状态: {{$store.state.isLogin}}
    </view>
</template>

<script>
    export default {
        data() {
            return {
                
            };
        }
    }
</script>

<style lang="scss">

</style>
```
第四步：访问 Vuex 定义变量。

在应用启动情况下访问 `http://localhost:8080/#/pages/login/login` 可以看到 login.vue 页面上的 `{{$store.state.isLogin}}` 被渲染成了一个 `false`，这个 `false` 是第一步在文件 store/index.js 中添加的 `isLogin` 变量。

因为有 `Vue.prototype.$store = store` 这样我们就可以在页面组件中以 `$store` 访问 `state` 定义下的所有状态变量，也就是说你可以在页面B，页面C，甚至是页面Y都可以访问到这个变量。

那问题来了，如果我定义的变量很多或者很长呢，这种写法 `$store.state.isLogin` 有没有更加便捷的方法呢？请看下一步。

## Vuex 的 state 多种用法

Vuex 封装了一些辅助函数 `mapState` 方法，让你写的状态可以映射出来，减少查询。当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键。这样我们可以简化一下 login.vue 代码：

```html
<!-- login.vue -->
<template>
    <view>
        登录状态: {{isLogin}}
        登录状态: {{hasLogin}}
    </view>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                
            };
        },
        computed: mapState({
            // 箭头函数可使代码更简练
            isLogin: state => state.isLogin,
        
            // 传字符串参数 'isLogin' 等同于 `state => state.isLogin`
            hasLogin: 'isLogin',
        }),
        // computed: {
        //    ...mapState(['isLogin'])
        // },
    }
</script>
<style lang="scss">

</style>
```

在 `script` 中引入辅助函数 `import { mapState } from 'vuex'`，就可以在 `computed` 对象中使用 `mapState` 辅助函数了；

上面第一个写法中 由 `state.isLogin` 映射到状态 `isLogin`，第二个写法是直接以传字符串参数的形式将Vuex的储存状态 `isLogin` 直接映射到 `hasLogin` ，保存后可以在浏览器看到 `isLogin` ，`hasLogin` 渲染是一样的。好像还不够简便的样子，那来一个更简便的写法：

```js
computed: {
   ...mapState(['isLogin'])
},
```

这样的形式也可以访问 `isLogin` 状态，该写法运用了es6中的 `...` 对象扩展运算符号，意思是里面的数组值 `['isLogin']` 通过 `mapState` 辅助方法映射出来之后，再通过扩展运算符一个一个对应出来，这样就可以在视图直接访问了 `{{isLogin}}`，如果有多个状态值（比如还有 'stateA' , 'stateB' ）就显得便捷很多了，不用写多余的方法：

```js
computed: {
   ...mapState(['isLogin', 'stateA', 'stateB'])
},
```

上面的技术小点只是介绍如何获取 state 状态，那如果我想要改变状态呢？

## Vuex 的 Mutation 用法

还记得我们在 store/index.js 文件中定义一个操作 `isLogin` 状态的方法吗？

```js
// ...
mutations: {
    // 定义一个操作isLogin状态的方法
    storeLogin (state) {
      state.isLogin = true
    }
}
```

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation （在 mutations 中定义的方法），我们可以访问事件去触发 `storeLogin()` 更改登录状态，重新回到 login.vue 页面，添加一个按钮方法去触发 `storeLogin()`:

```html
<!-- login.vue -->
<template>
    <view>
        <view>
            登录状态: {{isLogin}}
        </view>
        <button @click="login">登录</button>
    </view>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                
            };
        },
        computed: {
           ...mapState(['isLogin'])
        },
        methods: {
            // 登录
            login () {
               this.$store.commit('storeLogin')
            }
        },
    }
</script>
<style lang="scss">

</style>
```

当我们点击登录按钮的时候执行 `this.$store.commit('storeLogin')` 就可以把登录状态修改为 `true` 了。

我们不能直接调用一个 mutation 方法事件，我们要调用 store.commit 方法去触发，相当于中间搭了一个桥来衔接这些方法。现在想想好像是那么回事了 :).

在程序设定开发中我们肯定会改变很多状态，不仅仅是把未登录改为登录，还会退出登录改为未登录，这样我们可以不用写一个退出登录的方法，我们直接传递一个参数过去就可以搞定了，回到 store/index.js 文件中 `storeLogin()` 这个方法会接受 `state` 作为第一个参数，自定义参数作为余后的参数，通常把这叫做 **载荷** `payload`：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = ``({
    state: {
        isLogin: false   // 是否登录的状态，默认为未登录 false
    },
    mutations: {
        // 定义一个操作isLogin状态的方法
        storeLogin (state, payload) {
          state.isLogin = payload
        }
    }
})

export default store
```

这样我们在 login.vue 页中就可以传参数了。

```html
<!-- login.vue -->
<template>
    <view>
        <view>
            登录状态: {{isLogin}}
        </view>
        <button @click="login">登录</button>
        <button @click="logout">退出</button>
    </view>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                
            };
        },
        computed: {
           ...mapState(['isLogin'])
        },
        methods: {
            // 登录
            login () {
               this.$store.commit('storeLogin', true)
            },
            // 退出
            logout () {
               this.$store.commit('storeLogin', false)
            }
        },
    }
</script>
<style lang="scss">

</style>
```

我们再添加一个退出按钮，同样调用触发 `storeLogin()` 修改登录状态，这样只是更改参数就可以改变登录状态了，是不是很简单 :)，再优化一下代码：

```html
<!-- login.vue -->
<template>
    <view>
        <view>
            登录状态: {{isLogin}}
        </view>
        <button @click="login(true)">登录</button>
        <button @click="login(false)">退出登录</button>
        
        <navigator url="../index/index">去首页</navigator>
    </view>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                
            };
        },
        computed: {
           ...mapState(['isLogin'])
        },
        methods: {
            // 改变登录状态
            login (bool) {
               this.$store.commit('storeLogin', bool)
            },
        },
    }
</script>
<style lang="scss">

</style>
```

并修改下首页，让首页也可以访问登录状态 `isLogin` ：

```html
<!-- 首页 index.vue -->
<template>
    <view class="content">
        <view class="text-area">
            <text class="title">当前是首页</text>
            <view>
                登录状态: {{isLogin}}
            </view>
        </view>
    </view>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
                
            };
        },
        computed: {
           ...mapState(['isLogin'])
        },
        methods: {
            
        },
    }
</script>
<style>
    
</style>
```

在浏览器运行一下，你就可以尝试改变登录状态的时候去首页查看，发现首页也是登录的。如果你做到了，恭喜你，你已经掌握了 Vuex 了。

Vuex 还有 Action 概念，可以包含任意异步操作，如果你使用了异步操作，直接调用 mutation 里面的方法可能并不会成功，因为 mutation 必须同步执行。

如果你的应用模块足够多的话，可以以模块的方式管理这些，比如客户模块，商品模块，这样这些状态就可以轻松管理了。整个项目，无论是页面还是组件都可以用上面提到的方式访问到 state 和修改 state。

然后再回顾一下这篇文章的第一个图，你就能轻松了解 Vuex 的机制了。

想要查看更多的理论知识可以查看[官网 vuex](https://vuex.vuejs.org/zh/)。

## 小结：

1. Vuex 是一个专为应用程序开发的状态管理模式。

2. 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。我们不能直接调用一个 mutation 方法事件，我们要调用 store.commit 方法去触发，相当于中间搭了一个桥来衔接这些方法。

3. 合理的使用 Vuex 可以让我们友好便捷的管理状态，不仅是登录状态，可以是用户信息，可以是一个修改标记，如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。我们不能为了技术而技术。

4. 本章代码 [uni-course-vuex](https://github.com/front-end-class/uniapp-music-code/blob/master/uni-course-vuex.zip)