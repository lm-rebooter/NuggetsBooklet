## 前言
当我们聊到 Electron 安全性问题的时候，我们可以从两个方面来谈谈安全性问题，一个为 Electron 源码安全性的防护，一个是 Electron 应用安全性的防护。

接下来，我们一起来详细探讨一下这两个方面的安全性措施。


## Electron 的应用安全性

如果你构建的 Electron 应用目的主要显示本地内容，所有代码都是本地受信任的，即使有远程内容也是无 Node 的、受信任的、安全的内容，那么你可以不用太在意这部分的安全性内容。

但如果你需要加载三方不受信任的来源网站且为这些网站提供了可以访问、操作文件系统，用户 shell 等能力和权限那么可能会造成重大的安全风险。

### 1. 说明
Electron 的最大优势之一基于 `Node.js + Chromium` 可以快速构建跨平台的桌面端应用，但这也是它最大的安全风险所在。

首先，Electron 是基于 `Chromium`，那么就会面对基本的 `Web` 安全风险。常见的 web 攻击方式有 `XSS` 和 `CSRF` 两种，这里的内容就是作为前端的我们经常碰到和需要处理的地方，网上也有很多教程和防范方式，不在本节中做过多介绍。

其次，也是因为集成了 `Node.js` 的缘故，导致了一些安全性问题，在 Electron v5 版本之前，Electron 的应用程序是这样的一种架构模式：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f1daed020a49bf81a00d061c7aa382~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=910&h=599&s=26288&e=png&b=ffffff" alt="image.png"  /></p>

其中，渲染进程和主进程之间的主要沟通桥梁是 `remote` 模块和 `nodeIntegration`，集成 Node 是使 Electron 功能强大的原因之一，但也使其极易受到黑客攻击。在渲染进程中集成 Node 加载三方网站或者资源的时候，就会极易收到 `RCE`（remote command/code execute） 攻击。

> RCE（远程代码执行）攻击是一种恶意行为，指的是攻击者通过远程的方式成功在目标系统上执行自己的代码。这种攻击通常利用安全漏洞或弱点，使攻击者能够远程执行恶意代码，从而控制目标系统、窃取敏感信息或对系统造成损害。RCE 攻击对系统安全构成严重威胁，因为它允许攻击者在远程环境下实施任意代码，从而影响系统的功能和安全性。

举个例子，比如我们通过 Electron 的 `BrowserWindow` 模块加载了一个三方网站，然后这个网站中存在着这样的一段代码：
```html
<img onerror="require('child_process').exec('rm -rf *')" />
```
这种三方网站不受信任的代码就会造成对计算机的伤害。所以如何防止这样问题的发生，那就是不要授予这些网站直接操作 `node` 的能力，也就意味着遵循最小权限原则，只赋予应用程序所需的最低限度权限。

所以，从 Electron v5 开始，Electron 默认关闭这些不安全的选项，并默认选择更安全的选项。渲染器和主进程之间的通信被解耦，变得更加安全：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e02ca0f6115143cba8edce18baa0291a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=905&h=601&s=27525&e=png&b=ffffff" alt="image.png"  /></p>

IPC 可用于在主进程和渲染进程之间通信，而 preload 脚本可以扩展渲染进程的功能，提供必要的操作权限，这种责任分离使我们能够应用最小权限原则。


### 2. 常见措施
#### 2.1 使用 preload.js 扩展渲染进程能力
在 Electron 最新版本中，默认都是关闭了渲染进程对 `node` 的集成，如果你需要渲染进程调用和执行 `node` 脚本，那么可以通过 `preload.js` 的方式进行集成：

```js
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(app.getAppPath(), 'preload.js')
  }
})

mainWindow.loadURL('https://example.com')
```

#### 2.2 开启上下文隔离
上下文隔离是从安全角度考量的，即不允许 [`webcontent` (opens new window)](https://www.electronjs.org/zh/docs/latest/api/web-contents) 网页使用 Electron 内部组件与预加载脚本可访问的高等级权限的 API ， 默认情况下 electron 是开启上下文隔离的。

开启上下文隔离后，渲染进程和 `preload.js` 将不会共享 `window` 对象，比如：

```js
// preload.js
// 上下文隔离情况下使用预加载
window.myAPI = {
  doAThing: () => {}
}
```

```js
// renderer.js
// 在渲染器进程使用导出的 API 将会报错
window.myAPI.doAThing()
```

如果你可以确认加载的三方内容是可信的，你希望关闭上下文隔离，可以通过 `contextIsolation: false` 来设置：
```js
// main.js
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false
    }
  })
  win.loadURL('https://example.com')
})
```

#### 2.3 开启进程沙盒化
当 Electron 中的渲染进程被沙盒化后，它的功能就和普通 Chrome 浏览器一样了，同时也不会有 `Node` 环境。在沙盒中，渲染进程只能通过 `preload.js`（预加载脚本）中 IPC（进程间通信）的方式委派任务给主进程来执行需权限的任务（例如：文件系统交互，对系统进行更改或生成子进程）。

启用沙盒化后，为了让渲染进程能与主进程通信，附属于沙盒化的渲染进程的 `preload.js` 脚本中仍可使用一部分以 Polyfill 形式实现的 Node.js API。有一个与 Node 中类似的 `require` 函数提供了出来，但只能载入 Electron 和 Node 内置模块的一个子集，比如：

-   `electron` 中渲染进程可使用的模块
-   [events](https://nodejs.org/api/events.html)
-   [timers](https://nodejs.org/api/timers.html)
-   [url](https://nodejs.org/api/url.html)

比如，我们在沙盒化的渲染进程的 `preload.js` 文件中使用 `Node fs` 模块：
```js
// preload.js
import fs from 'fs';
```
那么不出意外就会报以下错误：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9922912fca14d7da93b970919ea1cd8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=292&s=88688&e=png&b=fcefef" alt="image.png"  /></p>

从 Electron 20 开始，渲染进程默认启用了沙盒，无需进一步配置，如果你可以确认加载的三方内容是可信的，你希望关闭沙盒，可以通过 `sandbox: false` 来设置：
```js
// main.js
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      sandbox: false
    }
  })
  win.loadURL('https://example.com')
})
```

#### 2.4 开启 `webSecurity`
开启 `webSecurity` 会启用浏览器的同源策略，比如一些跨域资源请求将会被拦截；除此之外，也会将 `allowRunningInsecureContent` 设置为 `true`，这就意味着 Electron 将允许网站在 `HTTPS` 中加载或执行非安全源(`HTTP`) 中的 js 代码、CSS 或插件。

如果你加载网站希望突破跨域请求限制，你可以通过如下设置来关闭 `webSecurity`：

```js
// main.js
const mainWindow = new BrowserWindow({
  webPreferences: {
    webSecurity: false
  }
})
```
但是，如果仅仅是为了突破跨域请求限制，在 Electron 中还有别的方法，我们知道请求**不同源跨域**的原因是：当我们使用浏览器来向一个服务网站发送请求，服务网站响应请求后，浏览器会检查我们的请求域名是否在 `Access-Control-Allow-Origin` 白名单中，如果不在，就会产生跨域限制：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aee1d3651980434ab4233c1f60fdc477~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1106&h=300&s=95008&e=png&b=fcf1f0" alt="image.png"  /></p>

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/160c57448100478c80fa40e41ef26d7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=720&h=311&s=72680&e=png&b=fefefe" alt="image.png"  /></p>

所以，如果在浏览器进行 `Access-Control-Allow-Origin` 检查之前，我们修改它，让浏览器误以为服务器已经同意了我们的请求，这样会起作用吗？答案是肯定的，在 Electron 中我们可以这样修改：

```js 
mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        // 通过请求源校验
        'Access-Control-Allow-Origin': ['*'],
        ...details.responseHeaders,
      },
    });
  });
}
```

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a022eec43f9a4da083a20e945346f351~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=720&h=311&s=85222&e=png&b=fefefe" alt="image.png"  /></p>

我们可以通过控制台看到，响应的 `Access-Control-Allow-Origin` 已经被修改：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cae82e6f01744ec9c84bdde7c32d2fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=688&s=121390&e=png&b=ffffff" alt="image.png" width="100%" /></p>

#### 2.5 限制网页跳转
若你的应用无需导航功能或只需前往已知页面，最好将导航严格限制在特定范围内，禁止其他任何类型的导航。一种常见的攻击模式是，攻击者通过链接、插件或其他用户生成的内容诱导你应用的用户与应用互动，并可能导航至攻击者构建的页面。

可以通过 `will-navigate` 钩子中调用 `event.preventDefault()` 函数来阻断导航跳转：

```js
// main.js
const { URL } = require('url')
const { app } = require('electron')

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (parsedUrl.origin !== 'https://example.com') {
      event.preventDefault()
    }
  })
})
```

### 3. 小结
Electron 安全性的原则是基于最小化权限的原则为前提的，我们需要为我们的应用保持最小化权限只为受信任的内容开启需要用到的能力。安全性防护措施部分，我们从 Electron 官网“[安全最佳实践](https://www.electronjs.org/zh/docs/latest/tutorial/security)”部分抽取了具有代表性的几个部分，更多内容也建议你翻阅官方文档进行查阅。


## Electron 的源码安全性
在 Electron 应用打包篇介绍了我们写的 Electron 业务代码在没有特殊声明的情况下都会被打包进入 `.asar` 文件中。

`asar` 是一种文件归档方式，做的仅仅是把多个目录和文件合并在一起，打包成 `asar` 文件只能避免一些简单的源码分析工具来分析你的代码，可以通过 [@electron/asar](https://github.com/electron/asar) 这个包来轻松对 `asar` 文件进行解压。解压后的文件目录和代码就是我们通过 `webpack` 打包后的东西。

为了避免黑客对我们的应用程序进行解包、修改逻辑破解商业化限制、重新打包，再重新分发破解版，我们需要对代码进行加固，避免解包、篡改、二次打包、二次分发。

接下来介绍几种常用的源码保护措施。

### 1. 保护 asar 不被解压
Electron 是将打包后的文件按照一定的规则和算法拼接成一个 `.asar` 文件：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e31ffbcf49ec4e9cb8ed945041f97c4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1322&h=278&s=61912&e=png&b=f7f7f7" alt="image.png"  /></p>


其中：

-   `header_size` 区域：表示 header 区域占用的字节数。
-   `header` 区域：用 JSON 记录了 asar 内所有文件的信息。
-   `file` 区域：保存了文件内容。

但是，对于 Electron 的 asar 而言，其读取和生成 `.asar` 文件的方式和内容都是公开透明的，业界有很多可以解压 `asar` 文件的方法，如果想要 `asar` 文件不被解压，那么只能对其进行加密：将 Electron `asar` 文件进行加密，并修改 Electron 源代码，在读取 `asar` 文件之前对其解密后再运行。

可是修改 Electron 源码的事情，也是成本非常高！

### 2. 保护业务代码
修改 Electron 对 `asar` 文件的解密还是比较复杂和困难的，如果无法完成对 `asar` 文件的解密，那么就只能对业务代码进行保护。

常见的手段有：

#### 2.1 对源码的压缩混淆
源码的压缩混淆是前端开发经常使用的对代码保护的方式之一。

源码压缩主要是通过消除不必要的空格、注释、换行以及缩短变量名等方式，减少代码文件的体积，加快文件加载速度。常用的压缩工具有 [terser](https://link.zhihu.com/?target=https%3A//github.com/terser/terser)。

比如这段代码：

```js
// example.js
var x = {
    baz_: 0,
    foo_: 1,
    calc: function() {
        return this.foo_ + this.baz_;
    }
};
x.bar_ = 2;
x["baz_"] = 3;
console.log(x.calc());
```

压缩后变成了：

```js
var x={o:3,t:1,i:function(){return this.t+this.o},s:2};console.log(x.i());
```

这仅仅在很小的程度上保护了源码，降低了可读性和调试性。


源码混淆则是通过重命名变量和函数名、替换常量为表达式等手段，使得代码难以阅读和理解。同时引入无意义的代码逻辑，增加代码的复杂度，使得恶意用户难以逆向工程或窃取关键信息。常用的混淆工具有 [obfuscator](https://obfuscator.io/)。

比如这段代码：

```js
function hi() {
  console.log("Hello World!");
}
hi();
```
在混淆后变成了：

```js
(function(_0xad372b,_0x3b4951){var _0x175d8f=_0x2960,_0x1de143=_0xad372b();while(!![]){try{var _0x16ee06=parseInt(_0x175d8f(0xde))/0x1*(-parseInt(_0x175d8f(0xd8))/0x2)+parseInt(_0x175d8f(0xdf))/0x3*(parseInt(_0x175d8f(0xda))/0x4)+parseInt(_0x175d8f(0xe2))/0x5+-parseInt(_0x175d8f(0xdb))/0x6+parseInt(_0x175d8f(0xd9))/0x7+-parseInt(_0x175d8f(0xe0))/0x8+parseInt(_0x175d8f(0xe1))/0x9*(-parseInt(_0x175d8f(0xdd))/0xa);if(_0x16ee06===_0x3b4951)break;else _0x1de143['push'](_0x1de143['shift']());}catch(_0x2505be){_0x1de143['push'](_0x1de143['shift']());}}}(_0x3e9a,0x763ae));function _0x2960(_0x2e2777,_0x3c8841){var _0x3e9aee=_0x3e9a();return _0x2960=function(_0x2960fb,_0x4ab4ac){_0x2960fb=_0x2960fb-0xd8;var _0x1b2a99=_0x3e9aee[_0x2960fb];return _0x1b2a99;},_0x2960(_0x2e2777,_0x3c8841);}function hi(){var _0x228f31=_0x2960;console[_0x228f31(0xe3)](_0x228f31(0xdc));}hi();function _0x3e9a(){var _0x4828cb=['74miVIYO','3085670pOvcLX','58244Owrwws','551034csRwNb','Hello\x20World!','10HmgHsf','9794nzEtTH','147mDhoCB','91560dSXtiz','3648915RpwQuz','1005340vxJhhO','log'];_0x3e9a=function(){return _0x4828cb;};return _0x3e9a();}
```
可以看到混淆后极大降低了源码的可读性和可调试性，但是代码体积增加了不少且额外带来了不同程度上的性能损耗。但依然可以为源码注入恶意程序，进行二次打包。


#### 2.2 使用 Native 加密

我们知道，Electron 可以调用和执行一些 `Node` 原生模块和 `Node` 扩展程序，因此，我们可以将一些业务核心代码（证书、秘钥、加解密）通过 `C++` 编写，然后通过 `node-gyp` 构建成 `.node` 的二进制文件再提供给应用程序使用。

这个方法确实能解决对核心业务的安全防护能力，但是需要一定的 `C++` 开发经验。

#### 2.3 V8 字节码
通过 Node 标准库里的 `vm` 模块，可以从 script 对象中生成其缓存数据（[参考 vm_script_createcacheddata](https://nodejs.org/api/vm.html#vm_script_createcacheddata)）。该缓存数据可以理解为 v8 的字节码，该方案通过分发字节码的形式来达到源代码保护的目的。

> V8 字节码是 V8 JavaScript 引擎的一种形式，它是用于优化和执行 JavaScript 代码的一种中间表示形式。当 JavaScript 代码在 V8 引擎中执行时，它首先经历了解析和编译阶段，然后被转换成字节码以供执行。
>
>字节码是一种介于高级源代码和底层机器代码之间的中间表示形式。它比源代码更接近底层机器代码，但仍具有某种程度的可移植性和可读性。V8 引擎将 JavaScript 代码编译成字节码，以便更高效地执行代码。字节码可以被即时编译器（JIT）进一步优化，转换为本地机器代码以加速执行过程。

所以，如果我们通过 V8 字节码运行代码，不仅能够起到代码保护作用，还对性能有一定的提升。

如果你用的是 [electron-vite](https://cn.electron-vite.org/guide/source-code-protection) 作为脚手架来构建你的应用程序，那么你可以通过 `bytecodePlugin` 插件来开启字节码保护：

```js
// electron.vite.config.js
import { defineConfig, bytecodePlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()]
  },
  preload: {
    plugins: [bytecodePlugin()]
  },
  renderer: {
    // ...
  }
})
```

但是开启 V8 字节码后也会有一些缺陷产生，比如：`Function.prototype.toString` 代码转字节码后会导致程序异常，所以尽量不要在项目中使用这个方法或依赖了使用这个方法的库，这通常有点难~

## 总结
盾和矛孰强孰劣，自古以来都有边界，没有绝对的安全可言，当恶意用户攻破你的系统所付出的成本远大于他们能获得的收益时，我们就认为这个系统是安全的。



