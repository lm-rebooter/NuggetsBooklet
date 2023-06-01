这个章节，让我没想到，被迫修改了题目。原来的题目是【编写 vue-cli 插件让用户找到你】。以前的组件库都会使用这样的方案，编写一个 vue-cli 插件，这样就可以使用 vue add 方便地加载组件库了。

https://github.com/hug-sun/vue-cli-plugin-element3

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82878e3548d14fc5bdc9de227755cb84~tplv-k3u1fbpfcp-zoom-1.image)

这个技巧，大家如果想学习可以参考我以前的文章。

[Element3开发内幕 - Vue CLI插件开发 - 掘金](https://juejin.cn/post/6899334776860180494)

随着时代的发展，脚手架也不断地变革。更多的脚手架会使用 npm init 或者 npm create 来创建项目。其实这两个命令没什么区别。

以我们常用到 vue-cli 工具。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/146afdd267e94b3ebaac212d285f3933~tplv-k3u1fbpfcp-zoom-1.image)

目前 vue 的脚手架已经进行版本分化。首先原来的 vue-cli 工具进入了维护状态。目前只支持使用 Webpack 项目的创建。新的脚手架工具全部转为 create-vue，使用 vite 构建。

- @vue/cli :  https://github.com/vuejs/vue-cli

- Create-vue：https://github.com/vuejs/create-vue

哪种构建工具好，不是我们讨论的话题。主要我们来通过这个案例分析一下脚手架工具的流行趋势。

从 vue-cli 到 create-vue 脚手架工具命令行界面的变革。

```Bash
# 用 @vue/cli 创建项目
sudo npm i @vue/cli
vue create my-app

# 用 create-vue 创建项目
npm create vue my-app
```

很显然你会发现后者更加的简单，只需要一条语句而且无需提前安装。这个体验真的是太棒了。

## 用户故事(UserStory)

让组件库脚手架可以通过 npm create 使用， 让用户使用更方便。

## 任务分解(Task)

- 支持 npm init 功能；

- 测试 npm init 功能。

### 支持 npm init

其实这个功能实现起来比较简单，不需要修改代码。这个属于一种约定。大家了解一下就可以了。

https://docs.npmjs.com/cli/v8/commands/npm-init

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3804025ff1314cb89063b6159a05cf8d~tplv-k3u1fbpfcp-zoom-1.image)

我们可以查阅 npm 的官方文档。里面对 npm init 功能有以下描述。

`npm init <initializer>` 可以被用于安装一个新的或已经存在的 npm 软件包。

Initializer 是一个被命名为 create-<initializer> 的软件包。它会通过 npm-exec 运行。

以 smarty-ui 的 cli 为例，你只需要将软件包名称命名为  create-smarty-app，这样就可以通过。

```Bash
npm init smarty-app

# 也可以使用 执行的两者的功能是一致的。
npm create smarty-app
```

我们的库正好是按照这样的命名规约命名，所以不需要修改。

下面测试一下。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94ea027b970e46148a8018abe157b1d2~tplv-k3u1fbpfcp-zoom-1.image)

果然这种方法是可以生效的。

### 参与 Vite 生态

根据 [Vite 官方文档 ](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)，Vite 的脚手架目前分为官方脚手架和第三方脚手架。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c62ea46983784d1d9f7d6646835809ed~tplv-k3u1fbpfcp-zoom-1.image)

第三方脚手架全部使用 degit 安装。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dec9fc92bc2a47589999a28c0a7eb26a~tplv-k3u1fbpfcp-zoom-1.image)

degit 是一个简洁版的脚手架工具。它的特点是可以只需要创建项目模版而无需自己编写脚手架 CLI。 只需要使用 degit 就可以克隆模版项目创建自己的项目了。

https://github.com/Rich-Harris/degit

首先全局安装 degit。

```Bash
sudo npm install -g degit
```

下面测试一下我们项目是否可以这样使用， 根据规则 degit 的后面参数应该是模版软件的 github 地址。所以我们按照描述运行。

```Bash
degit smarty-team/smarty-ui-app-js-template my-app
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/224cbae7e1db43158f5aee6a6895679a~tplv-k3u1fbpfcp-zoom-1.image)

经过测试，这个软件是可以创建的，只是没有自己 cli 的加持。连 package.json 中的软件包名字都没有改。不过假设你的模版比较简单，只是为了克隆项目也可以使用这个软件。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b9092c78703478689996f21459fbe25~tplv-k3u1fbpfcp-zoom-1.image)

第三方脚手架全部汇总在 awesome-vite 的网站上，如果后期希望推广你的组件库，可以考虑给这个项目 PR。

https://github.com/vitejs/awesome-vite#templates

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a20ea2f0a8c43e39b76470f8d6b2132~tplv-k3u1fbpfcp-zoom-1.image)

这样你的项目就可以得到更多的曝光机会。

## 复盘

这节课的主要内容是介绍如何实现 npm init 功能。

这个章节好像内容很少，甚至不需要修改代码。只是阅读了一个简短的英文文档遵循了某个约定就让 npm init 支持了 组件库的安装。其实这就是本章节的意义。 开源社区和 Npm 软件生态像一部庞大的机器，它需要的是你为他添加新的零件。**这个时候就需要不断地了解规则，遵循规则才能收到效果**。这就好像一个开发团队内部，作为一个开发者和团队的沟通甚至比开发能力更为重要。

最后留一些扩展任务。

- 思考如何更好的参与 Vite 生态。

下节课，使我们的基于部分，使我们的软技能非干货时间，下节课见。 