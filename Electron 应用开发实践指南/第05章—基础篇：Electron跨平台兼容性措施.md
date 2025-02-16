## 前言
尽管 Electron 在跨平台方面表现出色，但不同平台间细微差异依然存在。仅仅通过单一平台下的测试无法充分证明应用的健壮性（当然，若只为特定平台开发则另当别论）。因此，在针对不同发布平台时，我们需要采取兼容性措施。

据我个人感受，macOS 支持的特性相对更丰富，其中许多是独有的。因此，某些能够在 macOS 上实现的功能并不一定能在 Windows 上完全呈现。针对 Windows 用户，在确保整体应用可用性的前提下，可能需要做出一些妥协和调整。不过，Windows 平台上的操作习惯也可以反过来服务 macOS 平台。

因此，有必要花一小节的篇幅，为大家说明一下 `Electron` 在不同平台下，一些常见的兼容性问题以及如何做好一些兼容性措施。


## Electron Native API 的平台限制

在开发 Electron 应用时，我们常常只专注于查找 API 的名称，而忽略了该 API 可用的平台限制。在官方文档中，针对一些独占的 API，通常会有标识来指明它们的适用平台，比如 macOS 下，[Electron app 模块](https://www.electronjs.org/zh/docs/latest/api/app)独有的一些钩子函数：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19521b16a8cf433092f196ba0056e6f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=846&s=115855&e=png&b=ffffff" alt="image.png"  /></p>

这些钩子函数因为和操作系统底层相关，所以有些只有特殊的平台才会有。也有些是特殊平台才具有的功能性 API：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daf56534db044720999b728e9e7a7f81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=804&h=824&s=133387&e=png&b=ffffff" alt="image.png"  /></p>

在这些特殊平台才具有的功能 API 或钩子函数中，Electron 官方都会通过 `tag` 标签为我们标注清楚，我们只需要注意使用即可。不过需要注意的是，还有一些未有平台 `tag` 标识的 API 里的配置项、或者通用的配置项，不同平台的值和具体表现可能也有差异：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/643ae4be8ff9442c8ddf64807c77a7d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=719&h=316&s=99346&e=png&b=fefefe" alt="image.png"  /></p>

所以，当你在使用这些 API 和钩子函数的时候，需要多多留意这些差异，避免出现不符合预期的 bug。



## 操作系统天然的差异性
虽然 `Electron` 的 `API` 帮助我们解决了跨平台的绝大多数场景的问题，但是因为操作系统本身存在着天然的差异性，所以在面对一些 `Electron` 不提供的原生 `API` 时，我们就不得不考虑不同平台的差异性问题。

比如，当我们使用 `C++` 编写原生 `node addon` 开发的时候，为了实现不同平台的能力，需要编写兼容性代码：

```js
// binding.gyp
{
  "targets": [
    {
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "target_name": "addon",
      "include_dirs": ["<!(node -p \"require('node-addon-api').include_dir\")"],
      "sources": ["export.cc"],
      "conditions": [
        [
          'OS=="mac"',
          {
            // ...
          }
        ],
        [
          'OS=="win"',
          {
            // ...
          }
        ]
      ]
    }
  ]
}
```
就算我们可能用不到底层原生模块来编写跨平台的扩展，而当我们用 js 来调用不同系统的能力时，也需要编写一些兼容性代码来进行适配：

```js
let action;
// 判断当前平台
const platform = {
  linux() {
    return process.platform === 'linux';
  },
  macOS() {
    return process.platform === 'darwin';
  },
  windows() {
    return process.platform === 'win32';
  },
};
// 平台判断
if (platform.macOS()) {
  action = require("./darwin");
} else if (platform.windows()) {
  action = require("./win");
} else if (platform.linux()) {
  action = require("./linux");
}

export default action;
```


## 用户习惯的差异性
我们知道在桌面端，`macOS` 和 `Windows` 有着特别多的操作差异性，比如在窗口管理上，Windows 用户习惯使用最大化、最小化和关闭窗口的按钮，而 macOS 用户则通常使用红、黄、绿色的按钮分别表示关闭、最小化和全屏。

除此之外，在 `macOS` 中，即使所有窗口关闭了，应用仍然在底部的菜单栏中保持活动状态。因此，通常需要特殊处理以确保用户主动退出应用程序。而在其他平台（如 Windows 或 Linux）中，通常情况下关闭最后一个窗口也意味着退出应用程序是合理的行为。所以为了实现这个操作习惯，我们也可以增加一个情况判断：

```js
// 当窗口都被关闭了
app.on('window-all-closed', () => { 
  // 如果不是macOS
  if (process.platform !== 'darwin') {
    // 应用退出
    app.quit();
  }
});
```
除此之外，我们还知道，不同操作系统对于一些常用功能的键盘快捷键可能有所不同，比如复制、粘贴、撤销等，Windows 中使用的 `Ctrl` 作为修饰键，而 `macOS` 中是使用的 `Command` 作为修饰键。所以，当我们需要注册此类快捷键的时候，需要注意使用 `CommandOrControl+xx` 关键词：

```js
globalShortcut.register('CommandOrControl+X', () => {
    // todo
});
```

## 文件路径的差异
需要留意的是在 Electron 的通用 [app.getPath](https://www.electronjs.org/zh/docs/latest/api/app#appgetpathname) API 中，获取的返回路径是有差异性的，比如：

```js
import { app } from 'electron';
// 获取用户的应用程序数据目录
app.getPath('appData');

// MacOS: ~/Library/Application Support/<Your App Name>
// Windows: C:\Users\<you>\AppData\Local\<Your App Name>
// Linux: ~/.config/<Your App Name>
```

此外，在 Windows 下，文件路径的分隔符为 `\`、`\\`，而在 macOS 和 Linux 下，文件路径的分隔符为 `/`。

所以，如果我们在 MacOS 系统上编写了操作路径的应用程序，放到 Windows 上去运行，就有可能因为路径而出现问题。正确的做法是使用 `path` 模块，帮助处理路径，比如使用 `path.join` 方法来拼接路径：

```js
const path = require('path')

// windows __dirname = D:\my\folder
const relativePath = './image/a.png';
console.log(path.join(__dirname, relativePath)); // D:\my\folder\image\a.png

// macOS __dirname = /my/folder
const relativePath = './image/a.png';
console.log(path.join(__dirname, relativePath)); // /my/folder/image/a.png
```

## 托盘图标的差异
在 Electron 中，应用程序可以通过 `Tray` 类来创建托盘图标。

```js
let icon;
if (commonConst.macOS()) {
  icon = './icons/iconTemplate@2x.png';
} else if (commonConst.windows()) {
  icon =
    parseInt(os.release()) < 10
      ? './icons/icon@2x.png'
      : './icons/icon.ico';
} else {
  icon = './icons/icon@2x.png';
}
const appIcon = new Tray(path.join(__static, icon));
```

在代码中，有三种图标：`iconTemplate@2x.png`、`icon.ico` 和 `icon@2x.png`。其中`iconTemplate@2x.png` 用于在 macOS 中显示模板图标，而 `icon@2x.png` 用于在 `Windows < 10` 以及 `Linux` 操作系统中显示图标。`icon.ico` 用于在 `Windows >= 10` 的操作系统中展示。

在 macOS 使用 Template 时：

- 传给托盘构造函数的图标必须是[图片模板](https://www.electronjs.org/zh/docs/latest/api/native-image#template-image) 。
- 为了确保你的图标在视网膜监视器不模糊，请确认你的 `@2x` 图片是 144dpi 。
- 如果你正在打包你的应用程序（例如，使用 webpack 开发），请确保文件名没有被破坏或哈希。文件名需要以 Template 单词结尾，同时 `@2x` 图片需要与标准图片文件名相同，否则 MacOS 不会神奇地反转图片的颜色或使用高分图片。
- 16x16 (72dpi) 和 32x32@2x (144dpi) 适合大多数图标。

在 Windows 上使用 icon 时注意：

- 建议使用 `ICO` 图标获取最佳视觉效果。


## 应用程序上的差异
在 macOS 中，未签名的应用可能会面临一些安全提示和限制。其中一个问题是在安装前需要用户确认并授权运行该应用。这是 macOS 的安全特性，用以确保用户知晓并授权运行未签名的应用程序，关于如何对 Electron 应用程序签名和公正可以在 [《通用篇：Electron 应用打包》](https://juejin.cn/book/7302990019642261567/section/7304842389166751754) 章节详细阅读。

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4406d6d770444b62867eff8dd2c2508a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1249&h=1046&s=198241&e=png&b=e1e1e1" alt="image.png"  /></p>

另一种处理方式是，在终端运行以下指令：

```shell
sudo spctl --master-disable // 关闭限制，安装前运行一次即可
```
另一个则是在 Mac M1、M2 系统架构中，安装后打开会提示文件已损坏。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0507e4e22b684821aa8a00c861408afd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=520&h=440&s=48636&e=png&b=e6e6e6" alt="image.png" width="50%" /></p>

该问题的处理方案并不麻烦。

```shell
sudo xattr -r -d com.apple.quarantine /Applications/[your app name].app
```


## 申请管理员权限

在 Windows 中，如果软件需要管理员权限运行，只需要在打包时声明`requestedExecutionLevel` 为 `requireAdministrator`。这将弹出一个 UAC 提示框，请求用户授予管理员权限运行软件。

```js
// 打包配置
electronBuilder: {
  win: {
    requestedExecutionLevel: 'requireAdministrator',
  }
}
```

而在 macOS 和 Linux 下，如果需要软件以 root 权限运行，需要使用 sudo 命令来获取权限。具体来说，可以使用以下命令运行软件，并输入 sudo 密码：

```shell
sudo /path/to/your/app/executable
```

当然这种方式不是很好，推荐在需要输入指令时再调用 sudo 密码确认框。当然，如果你需要单独申请 `Mac` 上的特定权限，比如 `文件夹访问`、`屏幕录制` 权限等等，也可以试试这个库：[node-mac-permissions](https://github.com/codebytere/node-mac-permissions)。


<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd72d5b3aef24df791ec3d35372b573a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=562&h=526&s=72519&e=png&b=ffffff" alt="image.png"  /></p>

## 总结
本小节，我们可以通过管中窥豹的形式了解了 `Electron` 在开发跨平台应用时需要注意到的一些兼容性问题，文中列举的都是一些较为常见的兼容性问题和解决方案，如果你也遇到了类似的问题，希望可以对你有启发和帮助！

在接下来的章节内容，你也会发现在实现很多功能的时候，都需要进行跨平台兼容性处理，我们也会针对用户使用最多的 `Windows` 和 `MacOS` 分别进行详细的跨平台兼容性处理方案介绍，相信你会有更加深刻的认知。





