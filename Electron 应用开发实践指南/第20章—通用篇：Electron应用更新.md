## 前言
作为一名前端开发者，我们会很轻松地将我们开发的网页部署到各类云 OSS 上。如果后续在需求迭代中，出现了一些 bug，我们可以对代码进行修复后再次发布，所有用户都会很容易更新到最新的代码。

然而，如果你正在使用 Electron 构建桌面应用程序，此时出现了一些 bug，你也尝试修复了这个问题，但是如何确保你的用户收到并更新呢？

这个小节，我们来一起探讨 Electron 更新的几种方式以及各种更新模式下的优劣问题。

## 1. 全量更新
手动全量更新核心原理是在启动 Electron 应用程序的时候获取服务器当前软件最新的版本号和本地软件中的 `package.json` 版本进行匹配，如果发现落后于服务器版本则进行更新提示，并引导用户进行手动下载安装，核心代码如下：

```js
import { dialog, shell } from 'electron';
import { lt } from 'semver';
import pkg from '../../../package.json';
import { getLatestVersion } from './getLatestVersion';

// 本地版本号，从 package.json 中获取
const version = pkg.version;
const downloadUrl = 'https://xxx/releases/latest';

const checkVersion = async () => {
  // 获取服务器软件的最新版本
  const res = await getLatestVersion();
  if (res !== '') {
    const latest = res;
    // 版本比对，确认是否落后于服务器版本
    const result = compareVersion2Update(version, latest);
    if (result) {
      // 如果落后，则提示更新信息
      dialog
        .showMessageBox({
          type: 'info',
          title: 'Rubick 更新提示',
          buttons: ['Yes', 'No'],
          message: `发现新版本 v${latest}，是否更新？`,
        })
        .then((res) => {
          if (res.response === 0) {
            // 跳转到更新地址，进行手动下载
            shell.openExternal(downloadUrl);
          }
        });
    }
  } else {
    return false;
  }
};

// if true -> update else return false
const compareVersion2Update = (current, latest) => {
  try {
    if (latest.includes('beta')) {
      return false;
    }
    return lt(current, latest);
  } catch (e) {
    return false;
  }
};
```
这种更新方式优点是实现方式简单，而且非常稳定。但过程繁琐、软件包大多在 100M 左右，更新速度特别慢，而且用户更新意愿也不是很强烈，更新率低，极大可能会出现下面这幅图的情况：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/974ea868abc4481593ffca9c4e5f1636~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=602&h=249&s=80900&e=png&b=fcfcfc" alt="image.png"  /></p>

## 2. 文件覆盖式更新
我们知道，Electron 在打包后会将我们的业务代码全部导入到 `app.asar` 文件中，`app.asar` 文件一般包含以下文件：

* `main` ：主进程的入口文件。
* `renderer`：渲染进程入口文件。
* `preload`：预加载脚本文件

所以，如果我们只修改了渲染进程里面的东西的话，并不需要进行完全的打包更新，只要对 `renderer` 文件中依赖的 `js、html、css` 进行替换，那我们的页面也会更新。要完成对 `renderer` 更新大多数想到办法是直接替换覆盖用户本地的 `app.asar` 文件即可。

在 `macOS` 上确实可以，在需要更新时，下载新的 `asar` 包覆盖旧的 `asar` 包并重启应用即可，而且在应用程序运行的过程中，依然可以操作覆盖，不影响正常使用。

但是在 `Windows` 上，并不能直接替换 `asar` 文件，主要是因为：

* 如果程序正在运行，是不可以覆盖 asar 文件的，否则会出现锁定提示，必须关闭当前应用。
* 即使应用已关闭，如果用户安装到 C 盘，还需要管理员权限才能覆盖 asar 文件。

> 要解决上面的问题其实也有解决方案，可以参考这篇文章：[详解 Electron 应用升级](https://juejin.cn/post/7250288616533491749?searchId=20231222144125C40E2E68EAD7905996F0)。

### 2.1 使用 extraResources 字段

既然 `.asar` 文件不可以覆盖，那就把需要更新的资源不打包到 `.asar` 中，在 `electron-builder` 中，我们可以通过 [extraResources](https://www.electron.build/configuration/contents#extraresources) 字段，将一些不需要打包进 `.asar` 的文件提取到 `app.asar.unpacked` 文件夹中。比如，我们可以通过以下配置将渲染进程中的代码在打包的时候提取到 `app.asar.unpacked` 中：

```js
builderOptions: {
  // ...
  extraResources: [{
    from: "dist_electron/bundled",
    to: "app.asar.unpacked",
    filter: [
      "!**/icons",
      "!**/preload.js",
      "!**/node_modules",
      "!**/background.js"
    ]
  }],
  files: [
    "**/icons/*",
    "**/preload.js",
    "**/node_modules/**/*",
    "**/background.js"
  ]
},
```
其中，我们通过 `extraResources.filter` 字段指明了：**除了哪些内容外，需要构建到 `app.asar.unpacked` 中的资源**，通过 `files` 字段指明了：**需要构建到 `app.asar` 中的资源**。这段配置的意思就是除了 `icons、preload.js、node_modules、background.js` 外，其他渲染进程中的 `index.html、js、css` 资源全部打包进 `app.asar.unpacked` 中。

我们可以通过 `electron-builder` 打包试试看，最终的目录大致如下：

```bash
app.asar.unpacked
├── css
│   └── index.b2d625b8.css
├── index.html
├── js
│   ├── chunk-vendors.96b10160.js
│   ├── chunk-vendors.96b10160.js.map
│   ├── index.cfe3540f.js
│   └── index.cfe3540f.js.map
└── package.json
```
因为之前默认打包的是 `app.asar` 文件，主窗口也是从 `app.asar` 文件中加载 `html` 文件的，以 `vue-cli-plugin-electron-builder` 为例：

```js
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

// 开发环境
if (process.env.WEBPACK_DEV_SERVER_URL) {
  await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  if (!process.env.IS_TEST) win.webContents.openDevTools()
} else {
  // 生产环境
  createProtocol('app')
  win.loadURL('app://./index.html')
}
```

这里的 `app://` 是通过 `createProtocol('app')` 函数注册的请求协议，指向的是 `app.asar` 文件，一起来看看 `vue-cli-plugin-electron-builder` 中的 `createProtocol` 方法：

```js
// createProtocol.js
import { protocol } from 'electron'
import * as path from 'path'
import { readFile } from 'fs'
import { URL } from 'url'

export default (scheme, customProtocol) => {
  (customProtocol || protocol).registerBufferProtocol(
    scheme,
    (request, respond) => {
      let pathName = new URL(request.url).pathname
      pathName = decodeURI(pathName) 
      //  __dirname 在打包后指向的是 app.asar
      // dev 环境指向的是 dist_electron
      readFile(path.join(__dirname, pathName), (error, data) => {
        if (error) {
          console.error(
            `Failed to read ${pathName} on ${scheme} protocol`,
            error
          )
        }
        const extension = path.extname(pathName).toLowerCase()
        let mimeType = ''

        if (extension === '.js') {
          mimeType = 'text/javascript'
        } else if (extension === '.html') {
          mimeType = 'text/html'
        } else if (extension === '.css') {
          mimeType = 'text/css'
        } else if (extension === '.svg' || extension === '.svgz') {
          mimeType = 'image/svg+xml'
        } else if (extension === '.json') {
          mimeType = 'application/json'
        } else if (extension === '.wasm') {
          mimeType = 'application/wasm'
        }
        // 响应数据
        respond({ mimeType, data })
      })
    }
  )
}
```
所以，我们需要修改 `createProtocol` 函数，将从 `app.asar` 中读取文件修改成 `app.asar.unpacked` 中的资源：
```js
// process.resourcesPath 指向 Resource 目录
const serverPath = path.join(process.resourcesPath, './app.asar.unpacked')

export default (scheme) => {
  protocol.registerBufferProtocol(
    scheme,
    (request, respond) => {
      // ...
      // 这里改成 app.asar.unpacked 的路径
      readFile(path.join(serverPath, pathName), (error, data) => {
        // ...  
      })
    }
  )
}
```
这样，我们就可以实现正确的资源加载了。后面的操作就是通过检测版本号判断是否需要更新，如果需要更新可以通过 [download](https://github.com/kevva/download) 这个库来完成对资源的覆盖式下载更新：

```js
import download from 'download';
import path from 'path';

// 指定下载地址为 app.asar.unpacked
const target = path.join(process.resourcesPath, './app.asar.unpacked')

const update = async () => {
  try {
    // 下载打包后的 zip 包并解压到 app.asar.unpacked 中
    await download('github.com/muwoo/test-zip/releases/download/asd/dist.zip', target, {
      extract: true,
      strip: 1,
    });
  } catch (e) {
    console.log(e);
  }
}
```

### 2.2 使用 asar 字段
除了使用 `extraResources` 字段外，我们还可以通过 `electron-builder` 的 `asar` 字段来指明不打包成 `asar` 虚拟目录：

```js
asar: false
```
通过这种方式打包，我们可以直接得到一个无 `app.asar` 的 `app` 目录：

```bash
app
├── background.js
├── css
│   └── index.b2d625b8.css
├── index.html
├── js
│   ├── chunk-vendors.96b10160.js
│   ├── chunk-vendors.96b10160.js.map
│   ├── index.882b48ee.js
│   └── index.882b48ee.js.map
├── package.json
└── preload.js
```
这个 `app` 文件夹目录是直接可以进行替换的，那么接下来覆盖式更新和设置就和上面的使用 `extraResources` 字段打包后是一致的了，需要指明一下加载的文件资源路径。

## 3. 自动更新
如果你使用的 `electron-builder`，那么你可以直接使用 [electron-updater](https://www.electron.build/auto-update.html) 来进行软件的自动更新。接下来，我们将基于 `vue-cli-plugin-electron-builder` 来详细介绍一下如何使用 `electron-updater` 来完成应用的自动更新能力。

首先，需要配置一下 `electron-builder` 的 `publish` 和 `releaseInfo` 字段，来记录发布更新地址和发布日志：

```js
// 更新服务器信息
publish: [
  {
    provider: 'github',
    owner: 'rubickCenter',
    repo: 'rubick',
  },
],
// 更新日志
releaseInfo: {
  releaseName: 'normal', // normal 弹窗 / major 强制更新
  releaseNotesFile: './release/releaseNotes.md',
},
```

这里，`publish` 中使用的是基于 `github` 提供给 `release` 包。然后在我们执行打包构建，会在 `build` 目录下生成一个 `latest.yml` 文件，记录着此次更新的一些信息，大致如下：
```yml
# latest.yml
version: 版本号
path: 文件名路径
sha512: 文件的 sha512 值
releaseName: normal
releaseNotes: 发布日志
releaseDate: 发布时间
```
然后，在 Electron 主进程中引入 `electron-updater` 模块：

```js
const { autoUpdater } = require('electron-updater');
```
在创建完主窗口后，添加以下代码来检查主窗口准备就绪后是否有可用的更新。如果有的话，它们将会自动下载：

```js
mainWindow.once('ready-to-show', () => {
  autoUpdater.checkForUpdates();
});
```
其中 `checkForUpdates` 方法执行时，应用会先请求 github 上的 `latest.yml` 文件，得到文件里的内容后，再拿此文件中的版本号与当前版本号对比，如果此文件中的版本号比当前版本号新，则自动下载新版本。

然后再添加以下事件监听器来处理更新事件：

```js
let version;
let releaseNotes;
// 默认会自动下载新版本
// 如果不想自动下载，设置 autoUpdater.autoDownload = false
autoUpdater.on('update-available', (info) => {
  // 获取 版本号、发布日志
  { version, releaseNotes } = info;
  console.log('有新版本');
});

// 监听下载进度
autoUpdater.on('download-progress', ({ percent }) => {
  console.log('下载进度', percent);
});

// 下载完成
autoUpdater.on('update-downloaded', () => {
  console.log('下载完成');
   dialog
    .showMessageBox(mainWindow, {
      title: '版本更新',
      message: `发现新版本${version}，是否更新\n\n${releaseNotes}`,
      type: 'info',
      buttons: ['稍后提示', '立即更新'],
    })
    .then(({ response }) => {
      console.log(response);
      if (response === 1) {
        autoUpdater.quitAndInstall();
      }
    });
});
```

通过订阅 `download-progress` 事件，我们可以监听到下载的进度，一旦下载完成，我们将发送一个弹窗，告知用户发现新版本是否退出重新安装更新，用户手动进行确认更新，通过 `autoUpdater.quitAndInstall()` 方法进行退出更新。

关于自动更新的完整代码见：https://github.com/rubickCenter/rubick/blob/e2ea081d2553125790e4a05a746b583e27cc6ca5/src/main/common/versionHandler.ts

以上，便是使用 `electron-updater` 更新的全流程，但是需要注意的是如果你需要支持 macOS 上的自动更新，那么你还需要对应用程序进行代码签名和公正，然后再进行打包构建，这块内容参考 [《通用篇：Electron 应用打包》](https://juejin.cn/book/7302990019642261567/section/7304842389166751754)。

## 总结
本小节我们详细介绍了 Electron 常见的三种更新方式：手动更新、覆盖式更新、自动更新。

手动更新又称全量更新，是一种比较传统的更新方式，其优势是稳定、简单。缺点就是过程繁琐、慢、影响使用、更新率低。适用于低频更新、用户粘性高、作为各种升级技术的降级方案。

覆盖式更新（增量更新）其优势就是更新速度快，但是实现比较复杂、稳定性差、写文件容易失败，比较适合 `hotfix` 打补丁式的发布更新。

自动更新比较稳定、快、而且对用户的打扰少，但是整体实现稍微复杂，一般适用于高频更新软件、体验要求高的场景。






