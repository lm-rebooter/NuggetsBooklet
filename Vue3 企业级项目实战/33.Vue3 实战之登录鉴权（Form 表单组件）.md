## 前言

上一章节我们讲了有关布局的知识点，在这里再次叮嘱大家一句，大多数公司面试初中级前端开发，上来第一个大方向基本上是问布局。因为布局知识很考验一个前端工程师对一个项目的整体把控，你不仅要回答的好，而且还得给出多套方案，这样才能体现出你的能力。

回顾完上一章，我们来描述一下本章节需要完成的内容：在进行后续的列表需求之前，我们需要登录鉴权，没有权限是无法操作服务端的接口的，这个在之前的服务端章节也介绍过了。本章节除了登录，还会对 `Form` 表单组件进行分析，表单对于后台管理系统尤为重要，因为大多数后台管理系统都充斥着表单验证和提交。

下面就来预览一下本章要做的页面：

![](https://s.yezgea02.com/1617203710874/WeChatbeb9caa4cb4d1915886e2d8d9bf49ea7.png)

#### 本章节知识点

- 需要注册的组件：`ElForm`、`ElFormItem`、`ElInput`、`ElCheckbox`。

- `Form` 表单验证。

- `token` 鉴权。

- 公共变量的提取

## 新建登录页面

先创建一个空的登录组件页面，找到 `views`，在其下新建一个 `Login.vue` 组件，新增代码如下所示：

```html
<!--/src/views/Login.vue-->
<template>
  <div class="login-body">
    登录
  </div>
</template>

<script setup>
</script>

<style scoped>
  .login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
  }
</style>
```

在写代码时一定要声明好 `name` 属性，如上述登录组件，`name: 'Login'`。这样做的目的，首先你全局搜索某个组件的时候，可以直接搜这个名称，其次通过提供 `name` 选项，可以获得更有语义信息的组件树，如下图所示：

![](https://s.yezgea02.com/1617205030946/WeChat03a5bf9e99c0c5feb2516ca7da99017c.png)

上图是通过 [vue-devtools](https://github.com/vuejs/vue-devtools/releases/tag/v6.0.0-beta.7) 开发工具实现的语义化组件树。

创建完 `Login.vue` 之后，紧接着咱们就要去配置路由，打开 `/src/router/index.js`，代码如下所示：

```js
// router/index.js
...
routes: [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/add',
    name: 'add',
    component: AddGood
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
...
```

之后打开浏览器查看效果，进入 `/login` 路径，如下图所示：

![](https://s.yezgea02.com/1617205530472/WeChat81c03610d3af7d30c1a6a4bb3ef443d9.png)

登录组件被菜单包裹，这并不是我们想要的，在登录页面我们是不需要菜单的。此时我们需要在 `App.vue` 里做文章。

思路大致是这样，声明一个 `showMenu` 布尔变量，用于控制是否展示菜单栏。再声明一个 `noMenu` 数组变量，用于存放不需要展示菜单的路径，再通过监听路由变化来匹配是否需要展示路径，最后通过 `showMenu` 来展示和隐藏。

具体实现代码如下所示：

**template**

```diff
<template>
  <div class="layout">
+    <el-container v-if="state.showMenu" class="container">
      ...
    </el-container>
+    <el-container v-else class="container">
+      <router-view />
+    </el-container>
  </div>
</template>
```

通过 `v-if`、`v-else` 属性，显示隐藏是否需要菜单，在这里做统一处理。

**script**

```html
<script setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

// 不需要菜单的路径数组
const noMenu = ['/login']
const router = useRouter()
const state = reactive({
  showMenu: true, // 是否需要显示菜单
})
// 监听路由的变化
router.beforeEach((to) => {
  state.showMenu = !noMenu.includes(to.path)
})
</script>
```

修改完之后，刷新页面，浏览器展示如下图所示：

![](https://s.yezgea02.com/1617255893263/WeChat4e70c00df3aa5d0baef5022b0579f800.png)

该功能实现完成。

## 添加登录页样式 — 引入表单组件

上述逻辑整理清楚之后，我们来引入表单进行布局操作，代码如下所示：

**template**

```html
<template>
  <div class="login-body">
    <!--登录框div-->
    <div class="login-container">
      <!--登录框头部logo部分-->
      <div class="head">
        <img class="logo" src="https://s.weituibao.com/1582958061265/mlogo.png" />
        <div class="name">
          <div class="title">新蜂商城</div>
          <div class="tips">Vue3.0 后台管理系统</div>
        </div>
      </div>
    </div>
  </div>
</template>
```

```html
<style scoped>
  .login-container {
    width: 420px;
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
  }
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0 20px 0;
  }
  .head img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .head .title {
    font-size: 28px;
    color: #1BAEAE;
    font-weight: bold;
  }
  .head .tips {
    font-size: 12px;
    color: #999;
  }
</style>
```

代码中给 `login-container` 一个固定宽高，`width: 420px; height: 500px`，其次给 `box-shadow` 增加立体感，`head` 通过 `flex` 进行左右布局，`name` 通过 `flex` 进行上下布局，最终呈现出的效果如下图所示：

![](https://s.yezgea02.com/1617256830395/WeChate5fbd96046b4e0eccabe66ee68c8c8f0.png)

还需要为其添加账号密码输入框，这里我们使用 `Element-Plus` 为我们提供的 `el-form` 组件，代码如下：

**template**

```html
<template>
  <div class="login-body">
    <div class="login-container">
      ...
      <!--loginForm是从setup内返回得到的-->
      <el-form label-position="top" :rules="state.rules" :model="state.ruleForm" ref="loginForm" class="login-form">
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model.trim="state.ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="state.ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div>
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
          <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox>
        </el-form-item>
      </el-form>
    </div>    
  </div>
</template>
```

**script**

```html
<script setup>
import axios from '@/utils/axios'
// 安装 js-md5，密码需要 md5 加密，服务端是解密 md5 的形式
import md5 from 'js-md5'
import { reactive, ref, toRefs } from 'vue'
import { localSet } from '@/utils'

// el-form 组件接收一个 ref 属性，Vue3 需要这样声明
const loginForm = ref(null)
const state = reactive({
  ruleForm: {
    username: '', // 账号
    password: '', // 密码
  },
  checked: true,
  // 表单验证判断。
  rules: {
    username: [
      { required: 'true', message: '账户不能为空', trigger: 'blur' }
    ],
    password: [
      { required: 'true', message: '密码不能为空', trigger: 'blur' }
    ]
  }
})
// 表单提交方法
const submitForm = async () => {
  loginForm.value.validate((valid) => {
    // valid 是一个布尔值，表示表单是否通过了上面 rules 的规则。
    if (valid) {
      // /adminUser/login 登录接口路径
      axios.post('/adminUser/login', {
        userName: state.ruleForm.username || '',
        passwordMd5: md5(state.ruleForm.password), // 密码需要 md5 加密
      }).then(res => {
        // 返回的时候会有一个 token，这个令牌就是我们后续去请求别的接口时要带上的，否则会报错，非管理员。
        // 这里我们将其存储到 localStorage 里面。
        localSet('token', res)
        // 此处登录完成之后，需要刷新页面
        window.location.href = '/'
      })
    } else {
      console.log('error submit!!')
      return false;
    }
  })
}
// 重制方法
const resetForm = () => {
  // loginForm能拿到 el-form 的重制方法
  loginForm.value.resetFields();
}
</script>
```

**style**

```html
<style scoped>
  ...
  .login-form {
    width: 70%;
    margin: 0 auto;
  }
  .login-form >>> .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .login-form >>> .el-form-item {
    margin-bottom: 0;
  }
</style>
```

上述代码中已经给出注释，下面说几点要注意的事项。

首先需要安装一下 `js-md5`，执行命令为 `npm i js-md5 -S`。

其次，之所以设置完 `token` 之后需要刷新页面，是因为 `token` 存储完成之后，如果通过 `router.push` 路由实例方法跳转首页，页面不刷新的情况下，`utils/axios.js` 里的 `localGet('token')`，是不会被执行的，如下所示：

```js
// src/utils/axios.js
axios.defaults.headers['token'] = localGet('token') || ''
```

最后， `>>>` 深度作用选择器的使用，在加 `scoped` 的情况下，上述我们想修改组件内部样式，如果使用如下方式：

```css
.login-form  .el-form-item {}
```

> 在添加 rules 的情况下，不要给 el-form-item 组件添加 required 属性，否则错误验证会出现英文的情况。

样式显示如下图所示：

![](https://s.yezgea02.com/1617260038081/WeChat6e3b9fcb15fa2eaf68f28b45fa65bb7b.png)

添加后的样式显示如下图所示：

![](https://s.yezgea02.com/1617260063518/WeChatc329409507013c9837e9c7cc2590a87f.png)

刷新浏览器展示如下图所示：

![](https://s.yezgea02.com/1617261304401/WeChatecff11716d9f810af0f50248f26a0b38.png)

点击登录之后，打开控制台查看的 `Application`，如下图所示：

![](https://s.yezgea02.com/1617261399225/WeChatc52740673fa26eda1e956c302b9f028b.png)

## 优化

之前已经在二次封装 `axios`时做了登录鉴权，如果错误码为 419 的时候，我们就会通过 `router.push` 跳转到 `/login` 页面，具体代码如下所示：

```js
// src/utils/axios.js
if (res.data.resultCode == 419) {
  router.push({ path: '/login' })
}
```

在 `localStorage` 中没有 `token` 值的时候，我们可以明确的知道肯定是没有登录授权，此时我们可以直接不用通过请求接口后，根据错误码来判断是否跳转。

我们可以在 `App.vue` 下添加路由监听，打开 `App.vue`，添加如下代码：

```html
<script setup>
  ...
  import { localGet } from '@/utils'
  ...
  router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    // 如果路径是 /login 则正常执行
    next()
  } else {
    // 如果不是 /login，判断是否有 token
    if (!localGet('token')) {
      // 如果没有，则跳至登录页面
      next({ path: '/login' })
    } else {
      // 否则继续执行
      next()
    }
  }
  state.showMenu = !noMenu.includes(to.path)
})
</script>
```

页面展示效果如下所示：

![](https://s.yezgea02.com/1617265575245/Kapture%202021-04-01%20at%2016.26.08.gif)

这样做的目的，是不会让浏览器中先出现 vue3-admin 项目中的内部页面，之后再跳转的现象。

我们在路由监听函数内，添加一下 `title` 的修改，如下所示：

```html
<script setup>
  ...
  import { localGet, pathMap } from '@/utils'
  ...
  router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
      // 如果路径是 /login 则正常执行
      next()
    } else {
      // 如果不是 /login，判断是否有 token
      if (!localGet('token')) {
        // 如果没有，则跳至登录页面
        next({ path: '/login' })
      } else {
        // 否则继续执行
        next()
      }
    }
    state.showMenu = !noMenu.includes(to.path)
    document.title = pathMap[to.name]
  })
</script>
```

这里我将 `pathMap` 提取到了 `/src/utils/index.js` 内，通过抛出的形式进行公用，因为 `components/Header.vue` 也用到了它。

```js
// src/utils/index.js
export const pathMap = {
  index: '首页',
  login: '登录',
  add: '添加商品'
}
```

这里的键值对应着 `src/router/index.js` 下的配置属性的 `name`。如下：

```js
routes: [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/add',
    name: 'add',
    component: AddGood
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
```

## 总结

本章节带着大家一起完成了登录鉴权的工作，目前是采用的 `token` 令牌形式鉴权，常见的还有 `cookie`、`OAuth(开放授权)`、`HTTP Basic Authentication`等，不过最终目的就是限制用户调用权限接口，按需选择即可。

本章的主要目的就是让大家知道如何通过保存 `token` 的形式，完成后续的授权操作。

#### 本章源码地址

[点击下载](https://s.yezgea02.com/1663310560221/admin02.zip)

> 文档最近更新时间：2022 年 9 月 20 日。