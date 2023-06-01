组件库一般都会配有周边产品，比如 Admin 、Template、CLI 工具等等。周边产品相当于有关联的多个项目，更准确的说法是多个软件包。这个时候就应该使用 Monorepo 方式组织代码，方便频繁在多个项目间同时交替开发，同时发布，保持版本间没有冲突。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ac5c7b7c94044489885ad7d27c30356~tplv-k3u1fbpfcp-zoom-1.image)

## 传统 Mutirepo 方式的不足

所谓传统方式，我们称之为 Multirepo 方式，或者可以称之为 MutiPackage-MultiRepo 方式。就是说遇到多个软件包的场景，使用多个 Repo 仓库的方式组织代码。

换句话说就是，一个软件包一个 Repo 仓库。其实我们常见的前端项目默认就是这样的模式。这种方式最大的问题就是在多个项目间切换开发会非常不方便。比如： 在开发 Admin 项目的时候，发现 UI 库需要增加了一个功能，那你需要以下步骤：

-   从 Git 库克隆 UI 库代码；
-   修改 UI 库代码；
-   推送 UI 库到 Git 库；
-   推送 UI 库到 Npm 库；
-   在 Admin 中更新最新的 UI 库。

这个过程假设一次修改不满意频繁更新，那么整个过程还会不断重复。

优化的方案，是使用 npm link 方式把几个项目的本地目录链接起来。但是这种方法依然有弊端，比如在团队开发的时候，你必须随时同步所有的代码仓库。另外如果你的代码不希望公开到 Npm 上，你还需要建立私有的 Npm 仓库。

## Monorepo 的优势

Monorepo 其实就是将多个项目 （pacakage 软件包）放到同一个仓库 （Repo） 中进行管理。这种代码组织形式可以更好地管理多 Package 项目。主要的优点有：

-   可见性 （Visibility）: 每个开发者都可以方便地查看多个包的代码，方便修改跨 Package 的 Bug。比如开发 Admin 的时候发现UI 有问题，随手就可以修改。

<!---->

-   更简单的包管理方式（Simpler dependency management）： 由于共享依赖简单，因此所有模块都托管在同一个存储库中，因此都不需要私有包管理器。

<!---->

-   唯一依赖源（Single source of truth）： 每个依赖只有一个版本，可以防止版本冲突，没有依赖地狱。

<!---->

-   原子提交： 方便大规模重构，开发者可以一次提交多个包（package）。

同样是上面的那个同时开发 Admin 和 UI 的场景。当你开发 Admin 时，发现UI 有要修改之处，只需要切换目录修改，这时候马上就可以验证修改后的效果了，无需提交软件包，无需担心软件冲突。

越复杂的场景，你会发现这种好处会更加明显。比如一个 UI 库对应两个Admin 。这时候你希望重构一下某个组件的属性。这种重构需要同时调整三个包中的代码。使用 Monorepo ，你可以不必有任何心智负担，调整后立刻验证两个 Admin 效果，同时发布就好。

## 用户故事(UserStory)

将组件库重构为 Monorepo 风格管理，方便后续组件库生态建设。

## 任务分解(Task)

-   Monorepo方案选型；
-   重构Monorepo；
-   测试Monorepo效果。

### 方案选型

目前 JS 中常见的 Monorepo 大概有两种选择：Lerna、Pnpm workspace。

其实在 Pnpm 横空出世前，基本上就是 lerna 一统天下的局面。连 Vue3 早期都是使用 lerna 做的 Monorepo 方案。

lernaJS 是由 Babel 团队编写的多包管理工具。因为 Babel 体系的规模庞大后有很多子包需要管理，放在多个仓库管理起来比较困难。

https://github.com/babel/babel/tree/main/packages

小伙伴们可以欣赏一下，一眼望不到边。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df9f7889594a4fcb8af9cf2e42923a05~tplv-k3u1fbpfcp-zoom-1.image)

无奈长江后浪推前浪，2021 年底 Pnpm 横空出世，闪电般的性能一下子征服了所有前端开发者。更重要的是它还附带 monorepo 方案。这个时候基本上没有任何开发者会抵挡这种诱惑，包括Vue3.0。

最终毫无疑问，我们选择 Pnpm 来搭建我们的技术方案。


### 修改软件包目录结构

```
├── packages
|   ├── smarty-ui-vite  // UI组件库
|   |   ├── package.json
|   ├── docs-ui-vite // docs文档
|   |   ├── package.json
├── package.json
```

首先将原有的组件库代码移动至 smarty-ui-vite目录。

### 初始化Monorepo软件包

在根目录重新初始化一个 npm。

```
pnpm init
```

然后需要在软件包中禁用 npm 和 yarn。这一步的目的是允许项目使用 pnpm 进行模块管理。不然的话会出现不兼容问题。

方法是添加 preinstall npm hook 钩子，这个钩子会在安装模块前触发，检查该代码是否是使用 pnpm 运行。如果不是的话会推出并提示错误。

package.json

```
"scripts": {
  "preinstall": "node ./scripts/preinstall.js"
}
```

实现当运行 npm install 或 yarn，就会发生错误并且不会继续安装。

```
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.log('不懂问然叔')
  console.warn(
    `\u001b[33mThis repository requires using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  )
  process.exit(1)
}
```

或者可以考虑使用 

```json
"scripts": {
    "preinstall": "npx only-allow pnpm"
}
```


### 初始化工作空间

在monorepo项目中，每个软件包会存放在工作空间，方便管理。

首先需要创建一个 pnpm-workspace.yaml，这个文件用于声明所有软件包全部存放在 packages 目录之中。其实目前 monorepo 风格的项目也普遍使用 packages 作为默认软件包目录位置。

```
packages:
  # all packages in subdirs of packages/ and components/
  - 'packages/**'
```

### 创建一个新的软件包

由于 smarty-ui-vite 这个组件库包已经放在 packages 目录之中了。无需其他过多的设置，它就可以当做 monorepo 工程中的一个项目了。

下面我们试试从零开始如何使用 pnpm 创建一个子软件包，并正确引用组件库。

比如：创建一个 docs-vite 用于文档化建设。在做文档化时需要引用 smarty-ui-vite 这个库，用于在网页上直接展示组件运行效果。

1.  初始化项目

```
# 在 packages 目录下
mkdir docs-vite
pnpm init 
```

2.  安装 Vite

这个时候就可以做一个选择了，假设我们认为 Vite 多个软件包都需要依赖，这个时候就可以选择将依赖安装到 workspace 中，这样每个包都可以使用 vite 而无需单独安装。

```
# 安装 workspace 中
pnpm i vite -w
```

如果只安装在子 package 里面，可以使用 -r ，比如：

```
# 子package安装
pnpm i vue -r --filter smarty-ui-vite

# 或者 直接在 docs-vite 目录下
pnpm i vue
```

下面需要做的是将 smarty-ui-vite 安装到 docs-vite 中。

```
# 内部依赖package安装
pnpm i  smarty-ui-vite -r --filter docs-vite
```

在安装后， docs-vite 中 smarty-ui-vite 的位置会指向到 workspace ，这也是 monorepo 的精髓所在。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb9d1d4bc23e411fa5ed7bbc43126c74~tplv-k3u1fbpfcp-zoom-1.image)

编辑一个页面测试一下, 直接加载 node_module 中的 smarty-ui-vite 的 module 和 css。

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <h1>🔨 SmartyUI Demo</h1>
    <div id="app"></div>
    <script type="module">
        import style from "smarty-ui-vite/dist/style.css"
        import { createApp } from "vue/dist/vue.esm-bundler.js";
        import SmartyUI, { SFCButton, JSXButton, SButton } from "smarty-ui-vite/dist/smarty-ui.es.js";

        createApp({
            template: `
        <div style="margin-bottom:20px;">
            <SButton color="blue">主要按钮</SButton>
            <SButton color="green">绿色按钮</SButton>
            <SButton color="gray">灰色按钮</SButton>
            <SButton color="yellow">黄色按钮</SButton>
            <SButton color="red">红色按钮</SButton>
        </div>
        <div style="margin-bottom:20px;"
        >
            <SButton color="blue" plain>朴素按钮</SButton>
            <SButton color="green" plain>绿色按钮</SButton>
            <SButton color="gray" plain>灰色按钮</SButton>
            <SButton color="yellow" plain>黄色按钮</SButton>
            <SButton color="red" plain>红色按钮</SButton>
        </div>
        <div style="margin-bottom:20px;">
            <SButton size="small" plain>小按钮</SButton>
            <SButton size="medium" plain>中按钮</SButton>
            <SButton size="large" plain>大按钮</SButton>
        </div>
        <div style="margin-bottom:20px;">
            <SButton color="blue" round plain icon="search">搜索按钮</SButton>
            <SButton color="green" round plain icon="edit">编辑按钮</SButton>
            <SButton color="gray" round plain icon="check">成功按钮</SButton>
            <SButton color="yellow" round plain icon="message">提示按钮</SButton>
            <SButton color="red" round plain icon="delete">删除按钮</SButton>
        </div>
        <div style="margin-bottom:20px;">
            <SButton color="blue" round plain icon="search"></SButton>
            <SButton color="green" round plain icon="edit"></SButton>
            <SButton color="gray" round plain icon="check"></SButton>
            <SButton color="yellow" round plain icon="message"></SButton>
            <SButton color="red" round plain icon="delete"></SButton>
        </div>
    `}).use(SmartyUI).mount('#app')

    </script>
</body>

</html>
```

运行 dev 测试一下。

```
pnpm dev
```

测试一下效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/430fff20c27440428a5c117223fd1982~tplv-k3u1fbpfcp-zoom-1.image)

## 复盘

这节课的主要内容是利用Monorepo方式管理组件库生态。组件库的周边可以包括 cli 工具、admin、插件等内容，使用 monorepo 风格非常符合这样的应用场景。

最后留一些思考题帮助大家复习，也欢迎在留言区讨论。

-   monorepo是什么
-   monorepo的应用场景和优点是什么 ？
-   如何使用 pnpm workspace 实现 monorepo 风格的项目 ？


下节课，我们将给大家讲解如何用对组件库实现按需加载，下节课见。

