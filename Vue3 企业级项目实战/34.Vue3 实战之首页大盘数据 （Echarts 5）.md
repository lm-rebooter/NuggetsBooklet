## 前言

上一节，我们学习了登录注册鉴权这块知识，有个细节要注意，将 `token` 存入 `localStorage` 之后，要通过 `window.location.href` 方法刷新刷新页面，否则 `axios.js` 文件内，`axios.defaults.headers` 是拿不到最新的 `token` 信息的。

本小节为大家制作头部个人信息，及首页的大盘模拟数据。

页面显示效果如下图所示：

![](https://s.yezgea02.com/1618110741928/WeChate1a388f0824056fbc28d12566cc72da7.png)

#### 本章节知识点

- 需要注册的组件：`ElPopover`、`ElTag`、`ElCard`。

- `Echarts 5.0` 图表差插件的引入及使用。

- 个人信息弹窗显示。

## 个人信息页面制作

首先，打开 `components/Header.vue` 文件源码，在 `template` 部分做如下修改：

**template**
```html
...
<div class="right">
  <el-popover
    placement="bottom"
    :width="320"
    trigger="click"
    popper-class="popper-user-box"
  >
    <template #reference>
      <div class="author">
        <i class="icon el-icon-s-custom" />
        {{ state.userInfo && state.userInfo.nickName || '' }}
        <i class="el-icon-caret-bottom" />
      </div>
    </template>
    <div class="nickname">
      <p>登录名：{{ state.userInfo && state.userInfo.loginUserName || '' }}</p>
      <p>昵称：{{ state.userInfo && state.userInfo.nickName || '' }}</p>
      <el-tag size="small" effect="dark" class="logout" @click="logout">退出</el-tag>
    </div>
  </el-popover>
</div>
...
```

模板部分通过 `el-popover` 组件实现一个点击弹出弹窗组件，将个人信息放入弹窗内部。`el-popover` 提供了插槽 `reference`，这个是具名插槽，`Vue 2.0` 的具名插槽的书写形式为 `v-slot:reference`，而 `Vue3` 则变为 `#reference`，`#` 代替了之前的 `v-slot:`，这里的差异大家一定要注意。

`el-popover` 具体的使用文档在下面：

> https://element-plus.gitee.io/#/zh-CN/component/popover

使用组件时遇到问题，第一时间去看文档，而不是去搜索引擎去搜。因为搜出来的结果五花八门的，还有时效性的问题，所以建议大家一定要先看文档。如果文档没有解决，再去对应的组件库 `Github` 仓库内的 `issue` 搜是否有人遇到了同样的问题，如果有，肯定有人会进行解答。

在 `script` 下通过接口获取用户信息，代码如下：

**script**

```html
<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { localRemove, pathMap } from '@/utils'
const router = useRouter()
const state = reactive({
  name: 'dashboard',
  userInfo: null, // 用户信息变量
})
// 初始化执行方法
  onMounted(() => {
  const pathname = window.location.hash.split('/')[1] || ''
  if (!['login'].includes(pathname)) {
    getUserInfo()
  }
})
// 获取用户信息
const getUserInfo = async () => {
  const userInfo = await axios.get('/adminUser/profile')
  state.userInfo = userInfo
}
// 退出登录
const logout = () => {
  axios.delete('/logout').then(() => {
    // 退出之后，将本地保存的 token  清理掉
    localRemove('token')
    // 回到登录页
    router.push({ path: '/login' })
  })
}

router.afterEach((to) => {
  console.log('to', to)
  const { id } = to.query
  state.name = pathMap[to.name]
})
</script>
```

逻辑部分，在 `reactive` 内声明 `userInfo` 变量，用于存放用户个人信息。从 `vue` 中解构出 `onMounted`，用于项目初始化请求，与之对应的是 `Vue 2.0` 的 `mounted` 选项，每次加载组件，只运行一次。

声明 `logout()` 方法的时候要注意，先要将 `token` 在本地进行清理，否则执行 ` axios.delete('/logout')` 请求后，当前存在 `localStorage` 里的 `token` 字段就已经失效了，如果不进行清理，后续可能会出现一些问题。清除完之后，回到登录页面 `/login`。

样式部分如下所示：

**style**

```css
<style scoped>
  .right > div > .icon{
    font-size: 18px;
    margin-right: 6px;
  }
  .author {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
<style>
  .popper-user-box {
    background: url('https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png') 50% 50% no-repeat!important;
    background-size: cover!important;
    border-radius: 0!important;
  }
   .popper-user-box .nickname {
    position: relative;
    color: #ffffff;
  }
  .popper-user-box .nickname .logout {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
</style>
```

样式部分要注意一点，`el-popover` 的弹窗，被定义在了根节点的外面：

![](https://s.yezgea02.com/1618113675468/WeChat4f0a4e8529286543b7f92860d2a01ee4.png)

控制台如上图所示，红框部分 `app` 节点和 `el-popover` 节点是并排的，`el-popover` 节点并不在 `right` div 内部，所以不能在 `<style scoped></style>` 内定义 `popper-user-box` 样式，只能重新写一个 `<style></style>` 标签，在其内部定义 `popper-user-box`，这样写出来的样式，是作用在全局样式的，所以定义类名的时候一定要语义化一些，尽量避免后面类名重复。

后面要写的弹窗等组件，也都会出现这样的情况，大家要注意。

最后头部组件呈现的效果如下图所示：

![](https://s.yezgea02.com/1618115646216/Kapture%202021-04-11%20at%2012.33.52.gif)

## 首页大盘数据

一般情况下，后台管理系统都会在首页进行 C 端产品的数据展示。以当前这个 Vue3 的后台管理系统来举例，首页就需要展现数据，比如今日订单数、今日日活、订单转化率等，将一些数据用图形的方式进行可视化，下面我们就通过 `Echarts 5.0` 来将数据可视化操作。

接下来就要进入内页的组件编写了，也就是右边栏的 `content` 部分。首先明确一点，内页的布局，外框采用的是 `Element Plus` 的 `ElCard` 组件，该组件已经提前定义好了一些样式，这里就直接用它作为外框。

#### 订单信息 Flex 布局

接下来，打开 `views/Index.vue`，先来制作头部的三个数据，如下图所示：

![](https://s.yezgea02.com/1618116336095/WeChat883843d15ab5e072c6e93a651f21e870.png)

实现代码如下：

**template**

```html
<template>
  <el-card class="introduce">
    <div class="order">
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>今日订单数</span>
          </div>
        </template>
        <div class="item">1888</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>今日日活</span>
          </div>
        </template>
        <div class="item">36271</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>转化率</span>
          </div>
        </template>
        <div class="item">20%</div>
      </el-card>
    </div>
  </el-card>
</template>
```

**style**

```css
 .introduce .order {
    display: flex;
    margin-bottom: 50px;
  }
  .introduce .order .order-item {
    flex: 1;
    margin-right: 20px;
  }
  .introduce .order .order-item:last-child{
    margin-right: 0;
  }
```

如上述代码所示，这是一个经典的 `flex` 布局。`.order` 作为父级，内部有三个 `.order-item` 作为子级，当 `.order` 设置为 `display: flex` 时，下面三个子节点将会横向排布，再将 `.order-item` 设置为 `flex: 1`，则会让每一个子节点的宽度设置为父节点的 1/3。

#### 订单信息折线图布局

引入图表插件，一般情况下都会使用 `npm i echarts` ，通过安装 npm 包的的形式引入。本次我们采用的是静态资源引入的形式，如下所示：

```html
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://s.yezgea02.com/1609305532675/echarts.js"></script>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

之所以采用这种形式，是因为后续的构建打包，会将第三方资源打成一个 `vendor.js` 文件，我不希望在 `vendor.js` 内部加入 `echart` 的代码，这样会使得 `vendor.js` 变得很臃肿，毕竟 `echart` 文件很大，几百 KB 的大小，有些无法接受。

这里如果采用 `script` 的形式引入，`echart` 资源就会另行加载，还是会挂载到 `window` 全局变量下。

接下来编写模板，代码如下：

**template**

```html
<template>
  <el-card class="introduce">
    ...
    <div id='zoom'></div>
  </el-card>
</template>
```

**script**

```html
<script setup>
import { onMounted, onUnmounted } from 'vue'

let myChart = null

onMounted(() => {
  if (window.echarts) {
    // 基于准备好的dom，初始化echarts实例
    myChart = window.echarts.init(document.getElementById('zoom'))

    // 指定图表的配置项和数据
    const option = {
      title: {
        text: '系统折线图'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['新增注册', '付费用户', '活跃用户', '订单数', '当日总收入']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['2021-03-11', '2021-03-12', '2021-03-13', '2021-03-14', '2021-03-15', '2021-03-16', '2021-03-17']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '新增注册',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '付费用户',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '活跃用户',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '订单数',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '当日总收入',
          type: 'line',
          stack: '总量',
          label: {
            show: true,
            position: 'top'
          },
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  } 
})
onUnmounted(() => {
  myChart.dispose()
})
</script>
```

首先判断 `window.echarts` 是否存在，如果存在则通过 `myChart = window.echarts.init(document.getElementById('zoom'))` 初始化图标要渲染在哪个 `div` 下，拿到 `echarts.init` 返回的实例后，通过 `myChart.setOption(option)` 引入设置好的 `option` 配置项便可，`option` 配置项文档如下：

> https://echarts.apache.org/zh/option.html#title

你可以设置折线图、柱状图、饼图、散点图、雷达图、K线图等等等等。经常写可视化配置的同学，也难免遇到一些配置问题，碰到问题一定要查阅文档。

最后，在组件卸载的时候，通过 `onUnmounted` 方法将实例释放掉，否则后续加载会有问题。

刷新页面，你会发现没有出来图表，这是因为代码中少加了一个样式，需要为 `#zoom` 节点设置一个高度：

```css
#zoom {
   min-height: 300px;
}
```

刷新页面，如下所示：

![](https://s.yezgea02.com/1618119169709/WeChat2d8195b26e91dabb45cd335656e67cb9.png)

## 总结

本章节完善了公用头部的个人信息部分，将个人信息放在公用头部的右侧位置，这样做的目的是无论后续切换什么页面，都不会再次请求个人信息接口，因为 `Header.vue` 只会被加载一次。况且个人信息接口也不用频繁的去重新获取，一般情况下是不会做大变动。

简单阐述了 `Echarts` 的使用，大多数情况下，都需要开发者去文档中搜索需要的配置。建议大家去[官方示例](https://echarts.apache.org/examples/zh/index.html)部分先找一下适合的可视化图形，之后慢慢地在线调试，最后去配置项手册寻找对应的配置。一个需求的成型，何尝不是经过辛勤的汗水，一块一块的搬砖呢？

#### 本章源码地址

[点击下载](https://s.yezgea02.com/1663310969598/admin03.zip)

> 文档最近更新时间：2022 年 9 月 20 日。