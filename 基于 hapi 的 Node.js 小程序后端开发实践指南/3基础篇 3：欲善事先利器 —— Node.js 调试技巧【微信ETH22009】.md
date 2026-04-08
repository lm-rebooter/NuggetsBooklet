# 基础篇 3：欲善事先利器 —— Node.js 调试技巧

在技术选型基本明确之后，跃跃欲试的你，是否已迫不及待地撸起袖子想动手编码了呢？且稍安勿躁，任何一种语言的开发过程，都离不开代码调试的环节。是频繁地修改代码，加入打印日志？还是优雅地采用断点工具？代码修改后的重运行，是每次不厌其烦地机械地手动操作？还是将机械的重复机智地交给了程序机器？

借力于适当的调试工具与采用恰到好处的调试技巧，往往能在一个长线的开发周期里，帮助我们节省大量宝贵的时间。越早找到对应技术路线下的高效调试手法，越能长久受益。所以请沉住心，Node.js 的常用调试技巧了解一下，磨刀不误砍柴工，做好准备再出发也不迟。

## console.log

console.log 是从事 JavaScript 开发伙伴们最熟悉不过的控制台打印语句。在 JavaScript 代码的任意可执行位置加入 console.log，最终都会以代码被执行的先后顺序，在控制台打印输出结果。

```js
// app.js
console.log('hello nodejs')
```

``` bash
$ node app.js
# 输出 hello nodejs
```

## Supervisor / nodemon / PM2

许多服务脚本，当修改了文件内容时必须重新启动才能完成数据的更新操作，这会大大降低开发效率。 
Node.js 在更新操作时必须终止 Node.js 然后重新运行，这种模式不利于开发阶段。 

有不少 Node.js 小工具能帮助我们监视代码的改动然后自动重启 Node.js 服务，好用的工具有 Supervisor / nodemon / PM2，这里我们介绍一个轻量级的 Supervisor。

```bash
# 系统全局安装 supervisor
$ npm i -g supervisor
```

安装成功后，回到项目的根目录，将 node app.js 的启动命令，换成 supervisor app.js 。待服务启动后，尝试修改 node.js 项目代码，观察 terminal 终端里的输出变化。

##  node-inspector + Chrome

Node.js 原生 Debugger 模块使用的是 V8-Debug Protcol，而且 DevTools 使用 Chrome Debugging Protcol。所以 node-inspector 在其中起到了翻译和转达的作用。

V8 Inspector Integration 可以让 DevTools 直接连接 Node.js 的 Debugger 进行调试。

新版本的 Chrome 浏览器和新版本的 Node.js 支持通过一个新的调试协议能互相直接通讯了，就不再需要 node-inspector 了。

**支持最新调试模式的版本需求**：

- Node.js 6.3+
- Chrome 55+

**调试步骤**：

1. 运行 node -- inspect app.js。

``` bash
$ node --inspect app.js
```

2. 打开 Chrome 浏览器，在地址栏输入 chrome://inspect ，我们可以在 Remote Target 中找到我们所需要定位的 Node.js 服务目标，选择进入 chrome-devtools。

![](https://user-gold-cdn.xitu.io/2018/9/3/1659bc5e088ee71d?w=1408&h=824&f=jpeg&s=138540)

3. 在 Sources 页签下的 Filesystem ，通过 Add folder to workspace 来添加当前要断点调试的 JavaScript 源代码。

![](https://user-gold-cdn.xitu.io/2018/9/3/1659bc642183e9af?w=1446&h=806&f=jpeg&s=89165)

在首次添加源代码目录的时候，有可能因操作系统权限的缘故，被要求授权访问该目录，选择允许即可。

![](https://user-gold-cdn.xitu.io/2018/9/3/1659bc75a77d18b4?w=1568&h=660&f=jpeg&s=147536)

4. 选择需要增加断点的 JavaScript 代码，打上断点标记，执行 Node.js 服务，查看断点流程。

![](https://user-gold-cdn.xitu.io/2018/9/3/1659bc789b1b96a9?w=1562&h=904&f=jpeg&s=309182)

## VS Code

VS Code 是一个强大的轻量级开发工具，可以很方便地提供对 Node.js 的调试。

1. 进入左侧的调试模式。

![](https://user-gold-cdn.xitu.io/2018/9/3/1659bc93f9f69f9b?w=842&h=860&f=jpeg&s=44353)

2. 创建启动程序的配置，如果启动程序从未配置，选择 Node.js，系统会默认生成一个 .vscode/launch.json 的配置，其中的 program 属性，用于指向需要启动的 Node.js 文件。

![](https://user-gold-cdn.xitu.io/2018/9/3/1659bcb81265bad4?w=1558&h=350&f=jpeg&s=54885)
```json
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "program": "${workspaceFolder}/app.js"
    }
  ]
}
```

在 VS Code 官方的 FAQ 中，比较建议为 program 增加一个 ${workspaceFolder}  来动态地标记项目启动的目录配置。这样即使后续项目工程目录修改，或者与他人协同，都不需要更新启动项的目录配置信息。

在早先版本的 VS Code 中，开发者可以用相对路径的语法来配置路径，但在你使用  debugging session 的时候，依旧建议你使用 ${workspaceFolder} 来作为前缀。

3. 启动左上角的调试小按钮，就可以得到如下标记的断点调试常用功能：

- 断点变量
- 断点流程控制
- 控制台


![](https://user-gold-cdn.xitu.io/2018/9/3/1659bd3e6428fb63?w=2220&h=1494&f=jpeg&s=559871)

## 小结

关键词：控制台打印，自动重启，断点调试

本小节介绍的几种调试方式，总体而言，解决了三种开发场景的问题：
- 控制台快速打印输出信息，使用 console.log
- 文件修改自动重启服务，使用 Supervisor
- 断点调试，推荐使用 VS Code （Chrome 下的 devtool 作为第二选择）

在适当的开发场景下，选择适当的调试手法和工具，一定可以事半功倍。