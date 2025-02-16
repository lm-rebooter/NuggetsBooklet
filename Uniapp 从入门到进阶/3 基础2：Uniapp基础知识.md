# Uniapp基础知识

> 软件就像做爱。一次犯错，你需要用余下一生来维护支持。—— Michael Sinz

本章我们来学习 Vue 基础，认识 Vue 开发。

为什么是了解 Vue 基础呢？因为 Uniapp 设计的开发标准是：Vue的语法 + 小程序的API + 条件编译扩展平台个性化能力。了解完 Vue 基本开发原理就可使用 Uniapp 了。

## 什么是 MVC 与 MVVM ？

在开始之前，我们先来了解什么是 MVC 与 MVVM ？才能一步一步深入了解 Vue 框架的出现和 Vue 可以解决的问题。

MVC 的定义：MVC 是 Model-View-Controller 的简写。即模型-视图-控制器。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/18/170ec6e02ca8e1a4~tplv-t2oaga2asx-image.image)

* **模型**（Model）指的是后端传递的数据（比如数据库记录列表）。
* **视图**（View）指的是所看到的页面，显示数据（数据记录）。
* **控制器**（Controller）是应用程序中处理用户交互的部分，处理输入（写入数据库记录）。

在前端并不成熟的时期，很多业务逻辑是在后端实现的，MVC 允许在不改变视图的情况下改变视图对用户输入的响应方式，用户对视图的操作交给了 Controller 处理，在 Controller 中响应 View 的事件调用 Model 的接口对数据进行操作，一旦 Model 发生变化便通知相关视图进行更新。

这里只是简略的去说 MVC ，感兴趣的小伙伴可以去网上查一下关于这方面的知识。使用 MVC 的目的就是将 Model 和 View 的代码分离。MVC 是单向通信。也就是 View 跟 Model，必须通过 Controller 来承上启下。但是 MVC 中大量的 DOM 操作又加上视图的二次加载更新，用户看到的更新数据页面会慢一些，并且页面渲染性能降低，影响了用户体验。

为解决这样的问题，MVVM 就出现了。

在过去的10年中，我们已经把很多传统的服务端代码放到了浏览器中，这样就产生了成千上万行的 javascript 代码，它们连接了各式各样的 HTML 和 CSS 文件，但缺乏正规的组织形式，这也就是为什么越来越多的开发者使用 javascript 框架，比如：Angular、React、Vue。浏览器的兼容性问题已经不再是前端的阻碍。前端的项目越来越大，项目的可维护性和扩展性、安全性等成了主要问题。当年为了解决浏览器兼容性问题，出现了很多类库，其中最典型的就是 jQuery。但是这类库没有实现对业务和逻辑的分层，所以在后期项目越来越庞大时，维护性和扩展性并不理想。

综合上面原因，衍生出了 MVVM 模式一类框架的出现，通过数据的单向流动，维护性和扩展性得到极大的提高。Vue 就是基于 MVVM 模式实现的这样一套框架。

下面来看一下 MVVM。

MVVM 是 Model-View-ViewModel 的简写，即模型-视图-视图模型。MVVM 模式是通过以下三个核心组件组成：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/18/170ec6e39f709d44~tplv-t2oaga2asx-image.image)

* **模型**（Model）指的是后端传递的数据，包含了业务和验证逻辑的数据模型。
* **视图**（View）指的是所看到的页面，定义屏幕中 View 的结构，布局和外观。
* **视图模型**（ViewModel） 是 MVVM 模式的核心，它是连接 View 和 Model 的桥梁，帮忙处理 View 的全部业务逻辑。

ViewModel 的角色就是将**视图**与**模型**之间来回转化：

* **模型**转化为**视图**：将服务器发送的数据转化成我们看到的页面内容。这就是 `{{}}` 进行数据对应的作用。
* **视图**转化为**模型**：将页面内容及用户操作信息转化成服务器的数据。这部分是指令与 dom 事件对应的作用。

**视图**与**模型**这两者之间的来回转化，我们称之为数据的双向绑定。

## 双向绑定的使用

来看一个添加名单的应用页面的 index.vue 结构，用户可以在输入框输入名字，书写的内容可以即时反映显示在文本中，用户可以操作添加，把该名字插入列表数据中：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/16/16e71f120e22121a~tplv-t2oaga2asx-image.image)

在 Vue 中可以发现：

* Model：data 处存放的数据
* View：template 中 HTML 代码展示的视图
* ViewModel：是 methods 里的 JS 逻辑代码

如此一来，我们已经对 MVVM 有了初步的认识。

DOM 的数据通过 Vue 的 directives（指令）来改变，所以直接改变 model 的数据就可以直接将数据反映在 DOM 上面。前面的 `v-model` 指令就是用户在输入框操作时反映显示在视图中（你要添加的名字:  {{newName}} ），所以我们使用 Vue 这样的框架时，想要改变视图样式不是直接像 jQuery 操作 DOM 一样去操作，而是改变数据，让数据去驱动视图样式的改变。

## 生命周期

Vue 实例有一个完整的生命周期，也就是说从开始创建、初始化数据、编译模板、挂在DOM、渲染-更新-渲染、卸载等一系列过程。Vue 实例的生命周期钩子就是在某个阶段给你一个做某些处理的机会。比如 Vue 整个渲染完 DOM 的时候，你才可以操作 DOM，如果在 DOM 未渲染完之前去操作 DOM，由于 DOM 不存在而操作失败。

由于 Uniapp 是集成多端的，因此完整的支持 Vue 实例的生命周期，同时还支持`应用生命周期`及`页面生命周期`，区别在于你是开发 h5，小程序员，app。

### 应用生命周期

函数名	             | 说明  
-|-
onLaunch            |  初始化完成时触发（全局只触发一次），例如：点击分享页面进入应用，可以捕获在分享链接的参数
onShow              |  启动，或从后台进入前台显示
onHide              |  从前台进入后台
onError	            |  报错时触发


### 页面生命周期

函数名	             | 说明  
-|-
onLoad              |  监听页面加载，每个页面触发一次，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
onShow              |  监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
onReady             |  监听页面初次渲染完成。如果渲染速度快，会在页面进入动画完成前触发
onHide	            |  监听页面隐藏
onUnload	        |  监听页面卸载
onResize	        |  监听窗口尺寸变化
onPullDownRefresh	|  监听下拉刷新
onReachBottom	    |  监听触底上拉加载
onShareAppMessage	|  监听点击右上角分享
onPageScroll	    |  监听页面滚动
onBackPress	        |  监听左上角返回按钮或 android 返回键

以上的生命周期在项目中会经常使用到。看着挺多的不好记住，不要急，我将在进阶中详细演示，并提供一个页面模板给你使用。

## 模板语法 

来一个简单的基于 HTML 的模板语法： 

```html
<template>
    <view class="content">
        <view :title="singer">喜欢的歌手是: {{singer}}</view>
        <button @click="changeName">更换名字</button>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                singer: '周杰伦',
            }
        },
        methods: {
            changeName () {
                this.singer = '张学友'
            }
        }
    }
</script>
```
Vue 数据绑定最常见的形式就是使用 `Mustache` 语法 (双大括号) 的文本插值，比如 `{{singer}}`，Mustache 标签将会被替代为对应数据对象上 singer 属性的值。无论何时，绑定的数据对象上 singer 属性发生了改变，插值处的内容都会更新，`{{singer}}` 会被渲染成 `周杰伦`。

Mustache 语法不能作用在 HTML 特性上，遇到这种情况应该使用 v-bind 指令：

```html
<view v-bind:title="singer">喜欢的歌手是: {{singer}}</view>

// 渲染成
<view title="周杰伦">喜欢的歌手是: 周杰伦</view>
```

也可使用简写 `v-bind` 指令，将 `v-bind:title="singer"` 写成 `:title="singer"`，直接用 `:` 代替。

当然模板语法提供了完全的 JavaScript 表达式支持，你可以写一些简单的表达式，下面这些表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析：

```js
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

## 事件

在上面的代码块中，有个 methods 对象，Vue 把所有的事件都放在 methods 属性中，对应具体的方法函数：

```html
<template>
    <view class="content">
        <view :title="singer">喜欢的歌手是: {{singer}}</view>
        <button @click="changeName">更换名字</button>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                singer: '周杰伦',
            }
        },
        methods: {
            changeName () {
                this.singer = '张学友'
            }
        }
    }
</script>
```

这样的方式可以统一集中处理事件，并且开发者可以直观知道事件绑定在哪个元素中，比如 `changeName` 方法绑定在 button 中，如果想要解除事件直接删除就可，而不用担心别的元素隐形绑定该事件而导致报错。

## 计算属性

模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护。例如：

```html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

如果你在处理一个比较复杂的变量，那么在 `{{}}` 书写就不合适了，看到长长的代码都能让你头大。对于任何复杂逻辑，你都应当使用计算属性。

```html
<template>
    <view class="content">
        <view>喜欢的歌手是: {{singer}}</view>
        <view>喜欢的歌手是: {{computedSinger}}</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                singer: '周杰伦',
            }
        },
        computed: {
            // 对singer二次加工处理
            computedSinger: function () {
              // `this` 指向 Vue 实例
              return this.singer.split('').reverse().join('')
            }
        },
        methods: {
            changeName () {
                this.singer = '张学友'
            }
        }
    }
</script>
```
结果：

```html
喜欢的歌手是: 周杰伦
喜欢的歌手是: 伦杰周
```

## 指令

在 Vue 中指令是带有 `v-` 前缀的特殊属性，通过属性来操作元素。

常见的指令有：

```html
<template>
    <!-- v-text：在元素当中插入值 -->
    <view v-text='singer'></view>
    <!-- v-for：根据变量的值来循环渲染元素 -->
    <view v-for="(item, index) in list">
        {{item}}--{{index}}
    </view>
    <!-- v-if和v-else：根据表达式的真假值来动态插入和移除元素 -->
    <view v-if="isShow">我会显示</view>
    <view v-else>我不会显示，但是我要跟有 v-if 指令的元素并齐</view>
    <!-- v-model：把input的值和变量绑定了，实现了数据和视图的双向绑定 -->
    <input type="text" v-model="singer">
    <!-- v-bind：绑定元素的属性并执行相应的操作 -->
    <view v-bind:class="{t1: isBig}">isBig 为 true 时，该元素class类名会变为 t1</view>
    <!-- 上面v-bind可以简写 : -->
    <view :class="{t1: isBig}">isBig 为 true 时，该元素class类名会变为 t1</view>
    <!-- v-on：监听元素事件，并执行相应的操作 -->
    <view v-on:click="change">该元素绑定了点击事件</view>
    <!-- 上面 v-on：可以简写 @ -->
    <view @click="change">该元素绑定了点击事件</view>
</template>

<script>
    export default {
        data() {
            return {
                singer: '周杰伦',
                list:[1, 2, 3, 4],
                isShow: true,
                isBig: true

            }
        },
        methods: {
            change () {
                // ...
            }
        }
    }
</script>
```

### `<template/>` 和 `<block/>`

Uniapp 支持在 template 模板中嵌套 `<template/>` 和 `<block/>`，用来进行 列表渲染 和 条件渲染。

`<template/>` 和 `<block/>` 并不是一个组件，它们仅仅是一个包装元素，不会在页面中做任何渲染，只接受控制属性。

代码示例:

```html
<template>
    <view>
        <template v-if="test">
            <view>test 为 true 时显示</view>
        </template>
        <template v-else>
            <view>test 为 false 时显示</view>
        </template>
    </view>
    
    <!-- 列表渲染 -->
    <block v-for="(item,index) in list" :key="index">
        <view>{{item}} - {{index}}</view>
    </block>
</template>
```

## 全局变量(状态管理)

在 Vue（Uniapp）中有多种处理全局变量，全局方法的做法：

### 1. 挂载 Vue.prototype

将一些使用频率较高的常量或者方法，直接扩展到 Vue.prototype 上，每个 Vue 对象都会“继承”下来。

注意这种方式只支持多个 Vue 页面或多个 nVue 页面之间公用，Vue 和 nVue 之间不公用。

示例如下： 

在 main.js 中挂载属性/方法

```js
Vue.prototype.websiteUrl = 'http://localhost:3000';  
```

然后在 pages/index/index.Vue 中调用

```js
<script>  
    export default {  
        methods: {  
            getBanner() {
                uni.request({
                    url: this.websiteUrl + '/banner',
                    method: 'GET',
                    data: {},
                    success: res => {},
                    fail: () => {},
                    complete: () => {}
                });
            }
        }  
    }  
</script>
```

这种方式，只需要在 main.js 中定义好即可在每个页面中直接调用。但要注意的是，当前的this指向的是当前模块，稍微不注意就可能出现重复命名的情况。

建议在 Vue.prototype 上挂载的属性或方法，可以加一个统一的前缀`$`。比如`$url` 、`$global_url`这样，在阅读代码时也容易与当前页面的内容区分开。

```js
// main.js
Vue.prototype.$websiteUrl = 'http://localhost:3000';  
```

```
// 访问
const url = this.$websiteUrl
```

使用 `this.$websiteUrl` 的时候，与你协作的开发人员一看 `$` 开头就知道是全局扩展的属性。

那如果只是简单的变量呢？

### 2. globalData

如果你了解开发小程序的话，恭喜你，这个就是基于小程序延伸过来的。如果你还不熟悉，可以往下看

但从字面上来看 globalData 单词，可以翻译为全局变量。Uniapp 也把 globalData 作为一种比较简单的全局变量使用方式，但是有一点要清楚，globalData 走内存，storage 走缓存，即小程序退出 globalData 会清空，storage 则不会。

在 App.vue 可以定义 globalData ，也可以使用 API 读写这个值。

```js
<script>  
    export default {  
        globalData: {  
           websiteUrl: 'http://localhost:3000'  
        },  
        onLaunch: function() {  
           console.log('App Launch')  
        } 
    }  
</script> 
```

js 中操作 globalData 的方式如下：

```js
赋值：getApp().globalData.websiteUrl = 'http://localhost:3000'  

取值：console.log(getApp().globalData.websiteUrl) // 'http://localhost:3000'  
```

### 3. Vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/18/170ec6f33375f853~tplv-t2oaga2asx-image.image)

关于`Vuex`东西不少，我打算开一章来详细讲解。

## 小结

1. MVVM 是解决 MVC 的一些问题而出现的。  
2. Vue 是以数据驱动来改变视图的，所有的元素属性，文字节点，事件都可以进行管理；  
3. 全局变量可以让你在项目中管理整个状态，类似使用"全局变量"。