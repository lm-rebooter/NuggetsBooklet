## 前言
当涉及到 `Electron` 的实际应用开发时，有时候可能会遇到一些疑难杂症，这些问题可能会让开发者感到困惑和挫败。从跨平台兼容性到性能优化，从安全性到调试技巧，`Electron` 开发中的疑难杂症是多种多样的。

在本章节中，我们将深入探讨一些常见的 `Electron` 疑难杂症，探讨解决方案和最佳实践，帮助开发者更好地应对这些挑战，提高 `Electron` 应用的质量和性能。


## 开发

### 1. Unable to load preload scripts xxx, Error: module not found: 'XXX'

这是在升级到 Electron V20 版本后，一个比较常见的错误。[Electron github issue](https://github.com/electron/electron/issues/35387) 上也有对这个错误的相关描述。这个是因为从 `Electron 20` 开始，预加载脚本、渲染进程默认沙盒化，不再拥有完整 `Node.js` 环境的访问权。

在沙盒中，渲染进程只能透过 `IPC` 通信的方式来委托主进程执行需权限的任务 (例如：文件系统交互，对系统进行更改或生成子进程) 。`preload` 预渲染脚本可使用一部分以 `Polyfill` 形式实现的 `Node.js API`。

所以，一方面你可以通过为特定的 `BrowserWindow` 设置 `sandbox: false` 熟悉来关闭沙盒模式，也可以移除掉特定的 `node` 调用，通过 `ipc` 的方式进行委托主进程来执行相关事件。

### 2. /bin/sh: node: command not found
相关 issue 讨论见：[Can't run command line tool using child_process after packaged.](https://github.com/electron/electron/issues/7688) ，根本原因是 `Electron` 打包应用内部的 `$PATH` 环境变量错误。

因为环境变量通常是从其父 `shell` 继承而来的。在 `macOS` 上的开发环境，路径是在你的 `.bashrc` 文件中加载的，所以当你从命令行启动开发中的应用程序时，环境变量会被继承。在生产环境中，则会将其作为一个应用程序启动，因此没有 `shell` 环境可供继承。

解决方案：使用 [fix-path](https://github.com/sindresorhus/fix-path) 这个库。

### 3. Uncaught Error: Module "XXX" has been externalized for browser compatibility.

对于使用 `vite` 构建 `Electron` 应用（比如 `electron-vite`）并开启了 `nodeIntegration` 的，很大概率上可能会碰到这个错。这是因为 `vite` 构建的 `Electron` 应用不支持 `nodeIntegration`，其中一个重要的原因是 `vite` 的 `HMR` 是基于原生 `ESM` 实现的。

推荐使用 `预加载脚本` 进行开发，避免将 `Node.js` 模块用于渲染器代码。另外，也可以使用 [vite-plugin-commonjs-externals](https://github.com/xiaoxiangmoe/vite-plugin-commonjs-externals) 这个库来对 `ESM` 的 `import` 做 `polyfills`。

### 4. 加载本地图片时报错：Not allowed to load local resource.
首先，请确保你已经从你的 `BrowserWindow` 设置中启用了 `webSecurity`。

```js
win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
    },
  });
```

然后注册一个文件协议来处理本地文件。`Electron `文档建议你将这个注册封装起来，以便只在应用程序准备就绪时注册。

```js
import { protocol } from 'electron';

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });
});
```




## 打包
### 1. Application entry file "xxx/background.js" in the "....app.asar" does not exist

这是因为在 [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/) 中，`background.js` 文件被编译为 `dist_electron/bundles/index.js`，所以只需在你的 `package.json` 中将 `"main"` 字段从 `"background.js"` 改为 `"index.js"` 即可。

### 2. Module parse failed: Unexpected character '�' You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file.

这是因为你的代码中可能引入了一些 `.node` 的二进制文件，这些文件是无法直接在打包后的 `.asar` 文件中运行和使用的，具体的原因和解决方案小册 [《通用篇：Electron 应用打包》](https://juejin.cn/book/7302990019642261567/section/7304842389166751754) 章节有介绍。

如果你使用的是 [Vue CLI Plugin Electron Builder](https://link.juejin.cn/?target=https%3A%2F%2Fnklayman.github.io%2Fvue-cli-plugin-electron-builder%2F "https://nklayman.github.io/vue-cli-plugin-electron-builder/")，那么你可以在 `vue.config.js` 中的 `pluginOptions.electronBuilder.externals` 中配置需要提取的模块：

```js
pluginOptions: {
  electronBuilder: {
    // ...
    externals: [
      'pouchdb',
      'extract-file-icon',
      'electron-screenshots',
    ],
  }
}
```

## 总结
这里只是抛砖引玉列举了一些常见的 `Electron` 的一些疑难杂症，我也希望本小节可以再积累一些其他类型的常见问题，所以如果阅读本小册的你也有一些常见问题想要咨询或者已经有答案了，非常欢迎在小册评论区留言或者小册群内留言。我将会将精选的问题更新到文章正文并标注贡献者，感谢！！
