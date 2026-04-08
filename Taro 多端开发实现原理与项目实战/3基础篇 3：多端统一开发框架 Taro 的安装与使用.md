# 多端统一开发框架 Taro 的安装与使用

## 安装

### Node 环境

Taro 是一个基于 [NodeJS](https://nodejs.org) 的多端统一开发框架，在安装使用 Taro 之前需要确保已安装好 Node 环境。

你可以直接从 NodeJS 官网下载 NodeJS 安装包来安装 Node 环境，但我们更推荐使用 Node 版本管理工具 [nvm](https://github.com/creationix/nvm) 来安装管理 Node，这样不仅可以在不同版本的 Node 之间自由切换，而且在全局安装的时候也不再需要加 `sudo` 了。

### NPM 与 Yarn

安装好 Node 之后你就可以直接使用 [NPM](https://www.npmjs.com/get-npm) 来安装 Taro 的开发工具了，当然你还有一个选择就是使用 [Yarn](https://yarnpkg.com)，Yarn 是由 Facebook、Google、Exponent 和 Tilde 联合推出了一个新  Node 包管理工具，相比于 NPM，它具有**速度更快**、**安装版本统一**、**更加清爽简洁**等特点。

你可以从 [Yarn](https://yarnpkg.com) 官网获得相关的安装信息。

查看版本号测试是否已经成功安装：

![测试看 NPM 和 Yarn 版本号](https://user-gold-cdn.xitu.io/2018/10/31/166c928fd18a4fcc?w=700&h=100&f=png&s=14334)

### taro-cli

安装好 NPM 或 Yarn 后，就可以全局安装 Taro 开发工具 `@tarojs/cli` 了。

如果你是使用 NPM 安装，使用如下命令：

``` bash
$ npm install -g @tarojs/cli
```

如果你是使用 Yarn 安装，使用如下命令：

``` bash
$ yarn global add @tarojs/cli
```

安装完毕，测试一下是否安装成功：

![查看 Taro 版本号](https://user-gold-cdn.xitu.io/2018/10/31/166c928fba768251?w=700&h=69&f=png&s=12324)

如你所见，版本号打印出来，说明已经安装好了。

## 使用

到目前我们已经完成了 Taro 的安装，下面我们看看怎么使用。我们将建一个叫做 **myApp** 的项目。

使用命令创建模板项目：

``` bash
$ taro init myApp
```

NPM 5.2+ 也可在不全局安装的情况下使用 `npx` 创建模板项目：

``` bash
$ npx @tarojs/cli init myApp
```

命令行上会提示 `Taro 即将创建一个新项目!`，接着 Taro 会提示你输入项目介绍，我们这里输入 `我的第一个 Taro 项目`；而后让你选择是否使用 TypeScript，笔者不使用 TypeScript ，输入 `n` ; 接着提供 CSS 预处理器选择，有 Sass、Less、Seyless，笔者选择了 Sass；然后是选择模板，笔者选择`默认模版`，完成后，Taro 开始创建项目，自动安装依赖，这里可能需要等待一会。

过程如下图：

![Taro安装过程图](https://user-gold-cdn.xitu.io/2018/9/2/1659a045be8713ca?w=711&h=635&f=png&s=130625)

看到提示 `请进入项目目录 myApp 开始工作吧` 后，进入项目目录开始开发，目前 Taro 已经支持微信/百度/支付宝小程序、H5 以及 ReactNative 等端的代码转换，针对不同端的启动以及预览、打包方式并不一致。

### 微信小程序

选择微信小程序模式，需要自行下载并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，然后选择项目根目录进行预览。具体安装的方法和使用请参考第 3 章《[微信小程序开发入门与技术选型](https://juejin.im/book/5b73a131f265da28065fb1cd/section/5b73e92ce51d456680600665)》里的 「微信小程序开发入门」。

微信小程序编译预览及打包：

```bash
# npm script
$ npm run dev:weapp
$ npm run build:weapp
# 仅限全局安装
$ taro build --type weapp --watch
$ taro build --type weapp
# npx 用户也可以使用
$ npx taro build --type weapp --watch
$ npx taro build --type weapp
```

### 百度小程序

选择百度小程序模式，需要自行下载并打开[百度开发者工具](https://smartprogram.baidu.com/docs/develop/devtools/show_sur/)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

百度小程序编译预览及打包：

```bash
# npm script
$ npm run dev:swan
$ npm run build:swan
# 仅限全局安装
$ taro build --type swan --watch
$ taro build --type swan
# npx 用户也可以使用
$ npx taro build --type swan --watch
$ npx taro build --type swan
```

### 支付宝小程序

选择支付宝小程序模式，需要自行下载并打开[支付宝小程序开发者工具](https://docs.alipay.com/mini/developer/getting-started/)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

支付宝小程序编译预览及打包：

```bash
# npm script
$ npm run dev:alipay
$ npm run build:alipay
# 仅限全局安装
$ taro build --type alipay --watch
$ taro build --type alipay
# npx 用户也可以使用
$ npx taro build --type alipay --watch
$ npx taro build --type alipay
```

### H5

H5 模式，无需特定的开发者工具，在执行完下述命令之后即可通过浏览器进行预览。

H5 编译预览及打包：

```bash
# npm script
$ npm run dev:h5
# 仅限全局安装
$ taro build --type h5 --watch
# npx 用户也可以使用
$ npx taro build --type h5 --watch
```

### React Native

React Native 端运行需执行如下命令，React Native 端相关的运行说明请参见 [React Native 教程](https://nervjs.github.io/taro/docs/react-native.html)。

```bash
# npm script
$ npm run dev:rn
# 仅限全局安装
$ taro build --type rn --watch
# npx 用户也可以使用
$ npx taro build --type rn --watch
```

## 更新 Taro

Taro 提供了更新命令来更新 CLI 工具自身和项目中 Taro 相关的依赖。

更新 taro-cli 工具：

``` bash
# taro
$ taro update self
# npm 
npm i -g @tarojs/cli@latest 
# yarn 
yarn global add @tarojs/cli@latest
```

更新项目中 Taro 相关的依赖，这个需要在你的项目下执行。
``` bash
$ taro update project
```
