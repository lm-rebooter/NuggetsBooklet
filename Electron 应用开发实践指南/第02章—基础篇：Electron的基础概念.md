## 前言

`Electron` 由 `Node.js + Chromium + Native API` 构成。你可以理解成，它是**一个得到了 `Node.js` 和基于不同平台的 `Native API` 加强的 `Chromium` 浏览器**。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9aac01674f3749be8ab207edc991752c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1758&h=478&s=134974&e=png&b=fefefe" alt="image.png"  /></p>

为了让你对 `Electron` 有更加深刻的理解和认识，接下来我将详细地为你介绍学习 `Electron` 所必须要知道的基础概念。


## 主进程（main） 和 渲染进程（renderer）

Electron 继承了来自 Chromium 的多进程架构，Chromium 始于其主进程。从主进程可以派生出渲染进程。渲染进程与浏览器窗口是一个意思。主进程保存着对渲染进程的引用，并且可以根据需要创建/删除渲染器进程。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8628e6af9cb44f083b8bceac9028021~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=593&h=138&s=61979&e=png&a=1&b=beddee" alt="image.png"  /></p>

每个 Electron 的应用程序都有一个主入口文件，它所在的进程被称为 `主进程（Main Process）`。而主进程中创建的窗体都有自己运行的进程，称为 `渲染进程（ Renderer Process）`。**每个 Electron 的应用程序有且仅有一个主进程，但可以有多个渲染进程**。

简单理解下，主进程就相当于浏览器，而渲染进程就相当于在浏览器上打开的一个个网页。


### 主进程

主进程是 Electron 应用程序的核心，通常由一个主要的 JavaScript 文件（如 `main.js` ）定义，你可以在 `package.json` 中指定它：

```js
// package.json
{  
    "name": "my-electron-app",  
    "version": "1.0.0",
    "description": "Hello World!",  
    // 主进程入口文件
    "main": "main.js",   
    "author": "muwoo",  
    "devDependencies": {  
       // ...
    }  
}
```

它是应用程序的入口点，负责管理整个应用的生命周期、创建窗口、原生 API 调用等。主进程可以访问底层的系统资源，如文件系统、操作系统 API 等，这些功能通常是通过 Node.js 提供的模块实现的。它是 Electron 应用的主要控制中心。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b57da553919c4750a18841f21acbb21a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1818&h=726&s=262126&e=png&a=1&b=d4557f" alt="image.png"  /></p>


#### 1. 管理应用程序生命周期

在 `Electron` 的主进程中，你可以使用 [app](https://www.electronjs.org/zh/docs/latest/api/app) 模块来管理应用程序的生命周期，该模块提供了一整套的事件和方法，可以让你用来添加自定义的应用程序行为。

```js
const { app } = require('electron')
// 当 Electron 完成初始化时触发
app.on('ready', () => {  
  app.quit()  
})
```

app 的常用生命周期钩子如下：

-   `will-finish-launching` 在应用完成基本启动进程之后触发。
-   `ready` 当 electron 完成初始化后触发。
-   `window-all-closed` 所有窗口都关闭的时候触发，在 windows 和 linux 里，所有窗口都退出的时候**通常**是应用退出的时候。
-   `before-quit` 退出应用之前的时候触发。
-   `will-quit` 即将退出应用的时候触发。
-   `quit` 应用退出的时候触发。

而我们通常会在 `ready` 的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在 `will-quit` 或者 `quit` 的时候执行一些清空操作，比如解绑应用快捷键。

特别的，在非 `macOS` 的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以，可以配合 `window-all-closed` 这个钩子来实现：

```js
app.on('window-all-closed', () => {
  // 当操作系统不是darwin（macOS）的话
  if (process.platform !== 'darwin') { 
    // 退出应用
    app.quit()
  }
})
```

#### 2. 创建窗口

主进程的主要目的之一是使用 [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window) 模块创建和管理应用程序窗口。窗口管理是指创建、控制和管理应用程序中的窗口。

```js
const { BrowserWindow } = require('electron')  

// 创建窗口
const win = new BrowserWindow({ width: 800, height: 1500 })  
win.loadURL('https://juejin.cn')  
  
// 窗口事件管理
win.on('closed', () => {
  win = undefined;
});

win.once('ready-to-show', () => {
  win.show();
});

// 窗口的尺寸控制
win.minimize();
win.setSize({width: xxx, height: xxx});
```


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9b405c7ddae4a81ae0e16ebe9eaae3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1818&h=726&s=149079&e=png&b=f8f8f8" alt="image.png"  /></p>

跟`app`模块一样，`BrowserWindow`也有很多常用的事件钩子，比如：

-   `closed` 当窗口被关闭的时候。
-   `focus` 当窗口被激活的时候。
-   `show` 当窗口展示的时候。
-   `hide` 当窗口被隐藏的时候。
-   `maxmize` 当窗口最大化时。
-   `minimize` 当窗口最小化时。



#### 3. 调用原生 API

为了使 Electron 的功能不仅仅限于对网页内容的封装，主进程也添加了自定义的 API 来与用户的操作系统进行交互。比如，和 `客户端 GUI` 相关的 `右键菜单、窗⼝定制、系统托盘、Dock……`，和 `桌⾯环境集成` 相关的`系统通知、剪切板、系统快捷键、⽂件拖放……`，和 `设备` 相关的`电源监视、内存、CPU、屏幕` 等等。

```js
const { clipboard, globalShortcut, Menu } = require('electron')  

// 向剪切板中写入文本
clipboard.writeText('hello world', 'selection')  
console.log(clipboard.readText('selection'))

// 注册全局快捷键
globalShortcut.register('CommandOrControl+X', () => {  
  console.log('CommandOrControl+X is pressed')  
})

// Dock
const dockMenu = Menu.buildFromTemplate([  
  {  
    label: '菜单一',  
    click () { console.log('菜单一') }  
  }, {  
    label: '菜单二',  
    submenu: [  
      { label: '子菜单' },  
    ]  
  },  
  { label: '菜单三' }  
])
```


### 渲染进程

渲染进程是 Electron 应用程序中负责展示用户界面的部分。每个渲染进程对应一个窗口（BrowserWindow）或者一个网页。通常由 HTML、CSS 和 JavaScript 构建用户界面。

渲染进程与主进程是分开的，它们之间通过 IPC（进程间通信）来进行通信。渲染进程可以通过一些特定的 Electron API 来与主进程进行交互，以实现诸如向主进程发送消息、接收主进程的指令等功能。

其实在 `Electron` 中，因为安全性等问题的考量，提供给 `Renderer` 可用的 `API` 是比较少的，我们可以简单看一下主进程和渲染进程可使用的 API 图：


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/877089cda11f4cd5a866de40e2532e9a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2048&h=1208&s=257156&e=png&a=1&b=5e5e5e" alt="image.png"  /></p>


可以看到，能够在渲染进程中使用的 API 一共有 7 个。那么如果需要在渲染进程中使用主进程的 API 要怎么操作呢？`Electron` 本身额外提供了一个库 `@electron/remote`，使用这个库可以用来调用主进程的一些 API 能力：

```js
// 渲染进程
const { BrowserWindow } = require('@electron/remote')
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://juejin.cn')

// 主进程
require('@electron/remote/main').initialize()
```

更多关于 `@electron/remote` 的使用方式可以阅读它的文档：https://www.npmjs.com/package/@electron/remote

> electron v14 版本后开始去掉了内置的 `remote` 模块，`@electron/remote` 是 Electron 中内置 remote 模块的替代品。之所以移除 `remote` 模块，其主要考量是：
> 
> 1. **性能问题：** 通过 `remote` 模块可以访问主进程的对象、类型、方法，但这些操作都是跨进程的，跨进程操作性能上的损耗可能是进程内操作的几百倍甚至上千倍。假设你在渲染进程通过 `remote` 模块创建了一个 `BrowserWindow` 对象，不但你创建这个对象的过程很慢，后面你使用这个对象的过程也很慢。小到更新这个对象的属性，大到使用这个对象的方法，都是跨进程的。
> 2. **安全性问题：** 使用 `remote` 模块可以让渲染进程直接访问主进程的模块和对象，这可能导致一些潜在的安全风险。因为这种方式打破了主进程和渲染进程之间的隔离，可能存在恶意代码利用这一特性进行攻击或者不当操作。
> 3. **影子对象问题：** 我们在渲染进程中通过 `remote` 模块使用了主进程的某个对象，得到的是这个对象的影子（代理），是一个影子对象，它看起来像是真正的对象，但实际上不是。首先，这个对象原型链上的属性不会被映射到渲染进程的代理对象上。其次，类似 `NaN`、`Infinity` 这样的值不会被正确地映射给渲染进程，如果一个主进程方法返回一个 `NaN` 值，那么渲染进程通过 `remote` 模块访问这个方法将会得到 `undefined`。




## 预加载脚本 preload.js

预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码。 在 `preload.js` 中，我们不仅可以使用 Node API，还可以直接使用 Electron 渲染进程的 API 以及 DOM API，另外可以通过 `IPC` 和主进程进行通信达成调用主进程模块的目的。`preload.js` 脚本虽运行于渲染器的环境中，却因此而拥有了更多的权限。

<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29376de0e401431e814b50d782663ad8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1180&h=420&s=75839&e=png&a=1&b=fefefe" alt="image.png"  /></p>

预加载脚本可以在 `BrowserWindow` 构造方法中的 `webPreferences` 选项里被附加到主进程。

```js
const { BrowserWindow } = require('electron')  
// ...  
const win = new BrowserWindow({  
  webPreferences: {  
    preload: 'preload.js'  
  }  
})  
// ...
```
因为预加载脚本与浏览器共享同一个全局 [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) 接口，并且可以访问 Node.js API。

```js
// preload.js
const fs = require('fs')

window.myAPI = {  
  exists: fs.exists
}

console.log(window.myAPI)
```

注意：自从 `Electron v12` 版本以后，添加了 `webPreferences.contextIsolation = true` 的默认设置，这就意味着你通过 `preload` 修改 `window` 上的内容后，在渲染进程中并不能访问到。

```js
// renderer.js
console.log(window.myAPI)  // => undefined
````

### 关于 contextIsolation 的介绍

`contextIsolation` 是 Electron 中一个重要的安全特性，用于提高渲染进程的安全性。它的作用在于将渲染进程的 JavaScript 上下文（代码执行环境）与主进程隔离开来，以减少安全风险并加强安全性。

举个🌰：

假设有一个 `Electron` 应用程序，其中有一个渲染进程需要执行一些文件系统操作，比如读取本地文件并在界面中显示。在未启用 `contextIsolation` 的情况下，渲染进程可以直接访问 Node.js 的 `fs` 模块来进行文件操作。但这样会存在安全风险，因为渲染进程可以执行任意的文件系统操作，**比如文件删除**，可能导致安全漏洞或恶意代码执行。

现在，启用了 `contextIsolation`，渲染进程无法直接访问 Node.js 的 `fs` 模块。相反，你可以使用 `preload` 选项来为渲染进程加载一个预加载的脚本，在这个脚本中可以安全地访问 Node.js 的 `fs` 模块，并将需要的操作通过 [contextBridge](https://www.electronjs.org/zh/docs/latest/api/context-bridge) 模块封装成 API 提供给渲染进程。这样，渲染进程只能通过预加载的 API 来请求文件操作，而无法直接执行文件系统操作。

```js
// preload.js
const { contextBridge } = require('electron')  
const fs = require('fs')
  
contextBridge.exposeInMainWorld('myAPI', {  
  exists: fs.exists  
})
```

```js
// renderer.js
console.log(window.myAPI)  
// => { exists: Function }
```

> 更多关于 Electron 安全性的问题，我们将会在 [《通用篇：Electron 应用安全性指南》](https://juejin.cn/book/7302990019642261567/section/7304842580359905334) 章节详细介绍。


## 总结

本小节主要介绍了关于 `Electron` 的一些基础知识，包括 `主进程` 、`渲染进程`、`preload` 的一些用法和介绍。这些基础知识是我们后续开启实战篇的理论前提。

我们文中也提了一嘴关于渲染进程如何使用主进程的模块，其实除了使用 `@electron/remote` 模块外，我们还可以使用进程间的通信来解决，下面的章节将继续介绍如何实现 `electron` 进程间的通信。