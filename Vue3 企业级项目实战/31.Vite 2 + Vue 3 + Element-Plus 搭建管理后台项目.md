这一章节中讲解的知识点，我认为是前端开发工作中非常重要的一环，没有从 0 到 1 搭建前端项目经验的同学，跟着我把搭建项目架子的环节好好捋一捋，相信在日后的工作中会有很大的帮助。项目搭建采用全新的构建工具 `Vite 2`，虽然在生态上它没有 `Webpack` 那么丰富，但是从打包速度上你能切实的体验到快感。

之后的实战文章，都会在文末提供当前章节的源码。

> <span style="color: red">注意：当前作者的 Node 版本为 16.13.2，npm 为 8.1.2。如果下面的操作出现一些诡异的指令报错，请同步版本。<span>

## 初始化 Vite 项目

首先找一个自己习惯放置代码的目录，通过如下指令新建一个项目：

```bash
# npm 6.x
npm init @vitejs/app newbee-admin --template vue

# npm 7+, 需要额外的双横线：
npm init @vitejs/app newbee-admin -- --template vue

# yarn
yarn create @vitejs/app newbee-admin --template vue
```

> 注意，此章节搭建的项目将用于后续的实战环节。

成功之后项目目录如下所示：

![](https://s.yezgea02.com/1615355305787/WeChat3f43850f525f00b312c6562b18e85b87.png)

安装依赖包，并且启动项目：

```bash
npm install
npm run dev
```

浏览器打开如下所示代表初始化项目成功。

![](https://s.yezgea02.com/1615355451387/WeChat5084db8d2ea6ada0b48504bbc22db97b.png)

## 安装路由插件

打开命令行工具，在项目根目录安装 `vue-router`：

```bash
npm i vue-router@next
```

> 这里加一个 @next 代表的是安装最新的版本，目前最新版本是 4.0.13

安装成功之后，在 `src` 目录下新建 `router/index.js`，并添加路由配置项：

```js
// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  routes: [
    {
      path: '/',
      component: Index
    }
  ]
})

export default router
```

此时我们顺带着在 `src` 目录下新增 `views` 目录，用于放置页面组件。之后在该目录下添加 `Index.vue` 组件，在 `template` 模板下随意添加一些内容：

```html
<template>
  Index
</template>

<script>
export default {

}
</script>
```

我们注意到上述获取文件路径是通过 `@/` 的形式。这需要我们在 `vite.config.js` 下添加 `resolve.alias`，代码如下：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
  }
})
```

`@` 代表 `src` 目录下的别名；`~` 代表根目录下的别名，这样我们在项目中使用路径的时候，就不用写一长串。

配置完之后，我们需要在 `src/main.js` 中引入路由实例，如下所示：

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

const app = createApp(App) // 生成 Vue 实例 app

app.use(router) // 引用路由实例

app.mount('#app') // 挂载到 #app
```

别忘了将路由展示出来，修改 `src/App.vue` 如下所示：

```html
<template>
  <!--路径匹配到的组件，将会展示在这里-->
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

运行 `npm run dev` 启动项目，如下所示：

![](https://s.yezgea02.com/1615357046989/WeChatfed17b7b021d71f213e540747316bee0.png)

如上图所示，`/` 路径下，展示的就是 `Index.vue` 组件的内容，你改变组件的内容，视图将会跟着变化，这便是 `Vite` 的热更新能力，并且速度非常快，提高开发体验。

## 环境变量配置

环境变量是当你打包或运行项目的时候，能告诉你当前处于哪一个环境。就目前而言，我们开发分项目几种环境，开发环境、测试环境、正式环境。不同的环境我们配置的资源可能都不同，如服务端接口、统计相关代码、日志的打印等等。

用 `Vue CLI` 启动的 `Vue` 项目，你可以在项目中使用 `process.env` 获取相关的环境变量。到了 `Vite` 这儿，就不能通过 `process.env` 来获取环境变量。

#### 打包时

打包时，指的是在运行打包过程的时候，`vite.config.js` 内如何获取环境变量，配置静态资源路径需要它。

首先我们将 `package.json` 的 `scripts` 属性做如下改动：

```json
"scripts": {
  "dev": "vite --mode development",
  "build:beta": "vite build --mode beta",
  "build:release": "vite build --mode release",
  "serve": "vite preview"
}
```

通过在 `--mode` 后面添加相应的环境变量值。然后我们在 `vite.config.js` 内通过如下代码获取变量：

```js
export default ({ mode }) => defineConfig({
  ...
})
```

当你打包代码的时候，`index.html` 文件内的静态资源引用路径是根据 `vite.config.js` 的 `base` 属性配置的。如果我在发布的时候，使用的是在线静态资源 `CDN` 的形式，则需要做如下改动：

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.vue', '.js', 'jsx', '.json']
  },
  base: mode == 'development' ? './' : (mode == 'beta' ? '//s.baidu.com/beta/xxx' : '//s.baidu.com/release/xxx') // 静态资源路径配置
})
```

尝试打包项目，运行指令：

```bash
npm run build:beta
```

查看 `dist` 目录下的文件，如下所示：

![](https://s.yezgea02.com/1616847128622/WeChat1ab1b5a0e7be5cae802371e70c99a2db.png)

静态资源前缀变成了我们配置好的 `//s.baidu.com/beta/xxx`，同理运行 `npm run build:release` 也会变成相应的前缀。

如果不需要配置的同学，直接修改 `base` 属性为 `./` 即可。打完包后如下所示：

![](https://s.yezgea02.com/1616847271693/WeChata4ad238f28eda54a3e90dbb2e4107fbe.png)

直接加载相对路径下 `assets` 文件夹。
#### 运行时

上述分析的是在打包时做的配置，我们的代码在运行时，如何获取环境变量呢？答案是 `import.meta.env`。

它是 `Vite` 专门为项目提供的环境变量参数，通过它能获取到我们在 `scripts` 设置的 `mode` 环境变量。我们不妨在 `src/views/Index.vue` 内打印一下这个变量：

```html
<template>
  <div>Index</div>
</template>

<script>
const ENV = import.meta.env
export default {
  name: 'Index',
  setup() {
    console.log('ENV', ENV)
  }
}
</script>
```

如下所示：

![](https://s.yezgea02.com/1615360277662/WeChatac603c5fc86939c2bca88998f1954103.png)

肉眼可见，`MODE` 属性便是我们需要的环境变量，我们可以通过它去做一些有趣的事情，比如二次封装 `axios`。

## 二次封装 axios

首先我们需要先安装 `axios`，通过 `npm i axios` 安装成功之后，我们在 `src` 目录下新建 `utils/axios.js`，添加如下代码：

```js
import axios from 'axios'
import router from '@/router/index'
import config from '~/config'


// 这边由于后端没有区分测试和正式，姑且都写成一个接口。
axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    alert('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.resultCode != 200) {
    if (res.data.message) alert(res.data.message)
    if (res.data.resultCode == 419) {
      router.push({ path: '/login' })
    }
    return Promise.reject(res.data)
  }

  return res.data.data
})

export default axios
```

此时我们需要在根目录下新增 `config/index.js`，代码如下：

```js
// config/index.js
export default {
  development: {
    baseUrl: '/api' // 开发代理地址
  },
  beta: {
    baseUrl: '//backend-api-02.newbee.ltd/manage-api/v1' // 测试接口域名
  },
  release: {
    baseUrl: '//backend-api-02.newbee.ltd/manage-api/v1' // 正式接口域名
  }
}
```

分别配置相应环境的域名地址。开发环境配置 `/api`，是为了后续配置 `proxy` 代理接口所用，下面我们就要讲解这块内容。

## 配置 proxy 代理接口

在开发前端项目的时候，经常会遇到跨域问题，此时我们可以在 `vite.config.js` 下作如下配置：

```js
// vite.config.js
...
server: {
  proxy: {
    '/api': {
      target: 'http://backend-api-02.newbee.ltd/manage-api/v1', // 凡是遇到 /api 路径的请求，都映射到 target 属性
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
    }
  }
}
...
```

跨域问题一直是个头疼的事情，但是就目前看来，我们可以通过上述方式解决掉它。

## 引入 UI 组件库 element-plus

`element-ui` 大家应该都不陌生，几乎做过 `Vue` 开发的同学都接触过这款组件库，不过它没有直接作 `Vue3` 的适配版本，而是重新推出一个组件库叫 `element-plus`，这款组件是适配了 `Vue3`，且使用习惯贴合 `element-ui`。咱们这套课程便是使用它来完成后台管理系统的制作。

话不多说我们先安装它：

```bash
npm i element-plus@2.2.16
```

> 这里要提醒大家，一定要看官方文档，遇到问题的话，就尝试去他们的 Github 仓库，看看 issue 里有没有人已经提出了类似的问题。

> 官方文档：https://element-plus.gitee.io/#/zh-CN

文档中告诉我们，全局引入的方式如下所示：

![](http://s.yezgea02.com/1617695148292/WeChatebbbb3f136452ec2022932dcf99c9c78.png)

我们便按照它的方式修改 `src/main.js`，如下所示：

```js
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from '@/router'

import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App)

app.use(router)

app.use(ElementPlus)

app.mount('#app')
```

打开 `src/views/Index.vue` 稍作修改：

```html
<template>
  <div><el-button type="primary">主要按钮</el-button></div>
</template>

<script>
export default {
  name: 'Index'
}
```

启动项目 `npm run dev`，如下所示：

![](https://s.yezgea02.com/1615362114163/WeChat225c785d832a070abc2b3cc40d68f00c.png)

恭喜你，组件引入已经成功了，你可以随便使用官方文档内给出的任意组件，进行页面的编排和制作。

但是我不希望全局引入，因为有些组件我并不需要，我只想引入我需要使用的组件，这时候向大家推荐一款插件 `vite-plugin-babel-import`，它能实现 `element-plus` 的按需引入，我们安装它：

```bash
npm i vite-plugin-babel-import -D
```

修改 `vite.config.js` 如下所示：

```js
...
import vitePluginImport from 'vite-plugin-babel-import'
... 
plugins: [
  vue(),
  vitePluginImport([
    {
      libraryName: 'element-plus',
      libraryDirectory: 'es',
      style(name) {
        return `element-plus/lib/theme-chalk/${name}.css`;
      },
    }
  ])
]
... 
```

然后我们修改 `main.js`，如下所示：

```js
import { createApp } from 'vue'
import App from './App.vue'
import { ElButton } from 'element-plus'
import router from '@/router'

import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App)

app.use(router)

app.use(ElButton)

app.mount('#app')
```

此时，你想要什么组件，只需通过 `ES6` 解构的形式，将其引入便可。

解决问题还是需要大家去网上查询，特别是现在你用了 `Vite` 的架子，遇到问题直接先去 `Vite` 的仓库看看 `issue` 里有没有类似的问题，已经提供解决方案了。

## element-plus 自定义主题色配置

`element-plus` 升级为正式版之后，官方在自定义主题上也增加了通过 sass 变量去控制主题样式，具体文档链接：https://element-plus.gitee.io/zh-CN/guide/theming.html。

回到本项目配置，首先需要先安装几个必要的插件，如下所示：

```bash
npm install sass unplugin-element-plus unplugin-vue-components -D
```
`sass` 的作用不言而喻，`element-plus` 基于 `sass` 编写样式，所以需要通过它去覆盖主题变量。

`unplugin-vue-components` 插件用于按需加载组件。

`unplugin-element-plus` 用于解决组件库内部方法调用时，丢掉样式的问题，比如 ElMessage 等。

安装完后，修改 `vite.config.js` 文件，如下所示：

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite' // 不加这个配置，ElMessage出不来

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [
    vue(),
    // 按需引入，主题色的配置，需要加上 importStyle: 'sass'
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
    }),
    // 用于内部方法调用，样式缺失的现象，如 ElMessage 等
    ElementPlus()
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
  },
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://backend-api-02.newbee.ltd/manage-api/v1', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
      }
    }
  },
  css: {
    preprocessorOptions: {
      // 覆盖掉element-plus包中的主题变量文件
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
})
```
上述代码中，通过 `additionalData` 属性值所对应的 `sass` 文件，可以覆盖掉 `element-plus` 包中的主题变量文件。

接下来，需要在 `src`下新建 `styles/element/index.scss` 文件，添加如下内容：

```css
// styles/element/index.scss
/* just override what you need */
@forward "element-plus/theme-chalk/src/common/var.scss" with (
  $colors: (
    "primary": (
      "base": #1baeae
    ),
  ),
);
```

 > 这里要注意，`element-plus/theme-chalk/src/common/var.scss` 这个文件路径需要你去查看当前安装的 `element-plus` 包内是否存在，如果路径名称有出入，请自行修改。

 重新启动项目之后，如下所示：

 ![](https://s.yezgea02.com/1663135868701/WeChatb456366777f88b17b8a76dc24403acda.png)

 ## 引入图标库

 `element-plus` 升级后，组件库内图标的使用需要单独下载工具包 `@element-plus/icons-vue`，执行如下指令安装：

 ```bash
 npm install @element-plus/icons-vue
 ```

 然后打开 `main.js`，全局注册图标组件：

 ```js
 // main.js
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
 ```

 完成上述操作之后，可以打开 `element-plus` 官方文档，直接点击就能复制 `icon` 组件，如下所示：

 ![](http://s.yezgea02.com/1663209232937/WeChat4193ac199bc0fa47f0423f9273b854d9.png)

 打开 `views/Index.vue` 添加如下代码：

 ```html
 <template>
  <div><el-button type="primary">主要按钮</el-button></div>
  <el-icon><Aim /></el-icon>
</template>
...
 ```

 重启项目，浏览器展示如下图所示：

![](https://s.yezgea02.com/1663209536769/WeChat82e82af09f0ecdcf1e9cb9e5efe5719d.png)


## 公用方法封装

首先我们要在 `src/utils` 目录下新建 `index.js` 文件，内容如下：

```js
export function localGet (key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    return value
  }
}

export function localSet (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove (key) {
  window.localStorage.removeItem(key)
}
```

先设置一个本地数据获取的封装，我们修改 `src/axios.js` 的 `token` 获取，顺便把错误提示的组件也加上，代码如下：

```js
import { ElMessage } from 'element-plus'
import { localGet } from './index'
...

axios.defaults.headers['token'] = localGet('token') || ''
...
ElMessage.error('服务端异常！')
...
ElMessage.error(res.data.message)
```

#### vue-devtools

最新的插件已经支持 `Vue 3` 和 `Vite 2` 的开发模式，这边大家可以前往 `Github` 官网下载插件。

> https://github.com/vuejs/vue-devtools/releases/tag/v6.0.0-beta.7

这里就不赘述安装的过程了。

安装完之后，开发模式下，才能看到组件的结构，如下所示：

![](https://s.yezgea02.com/1616984353618/WeChat2280a87a27f1f0863b6fd9773d43993a.png)

## 总结

到此，我们已经基本上完成了一个项目的搭建工作，当然你可以给项目配置 `TS`、`css moduls`，我认为这些都是锦上添花，上述文章中提到的都是一个项目必须的内容，同学们可以自由拓展，把架子搭建好了，后面的编码步骤才会如鱼得水。

本章源码地址：[点击下载](https://s.yezgea02.com/1663209581507/admin00.zip)

> 文档最近更新时间：2022 年 9 月 20 日。