开发新版本 Vue 项目推荐你使用 Vite 脚手架构建开发环境，然而 Vite 脚手架更倾向于构建纯 Web 页面，而不是桌面应用，因此`开发者要做很多额外的配置和开发工作才能把 Electron 引入到 Vue 项目中`，这也是很多开发者都基于开源工具来构建 Electron+Vue 的开发环境的原因。

但这样做有`两个问题`：第一个是这些开源工具封装了很多技术细节，导致开发者想要修改某项配置非常不方便；另一个是这些开源工具的实现方式我认为也并不是很好。

所以，我还是建议你尽量**自己写代码构建 Electron+Vue 的开发环境**，这样可以让自己更从容地控制整个项目。

具体应该怎么做呢？接下来我将带你按如下几个步骤构建一个 Vite+Electron 的开发环境：


![2.1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9532783679e2433cb9167d5469579b11~tplv-k3u1fbpfcp-watermark.image?)

## 创建项目

首先通过命令行创建一个 Vue 项目：

```
npm create vite@latest electron-jue-jin -- --template vue-ts
```

接着安装 Electron 开发依赖：

```
npm install electron -D
```

安装完成后，你的项目根目录下的 package.json 文件应该与下面大体类似：

```json
{
  "name": "electron-jue-jin",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {},
  "devDependencies": {
    "vue": "^3.2.37",
    "@vitejs/plugin-vue": "^3.0.0",
    "electron": "^19.0.8",
    "typescript": "^4.6.4",
    "vite": "^3.0.0",
    "vue-tsc": "^0.38.4"
  }
}
```

注意：这里我们**把 vue 从 dependencies 配置节移至了 devDependencies 配置节**。这是因为在 Vite 编译项目的时候，Vue 库会被编译到输出目录下，输出目录下的内容是完整的，没必要把 Vue 标记为生产依赖；而且在我们将来制作安装包的时候，还要用到这个 package.json 文件，它的生产依赖里不应该有没用的东西，所以我们在这里做了一些调整。

> 读者集中反馈的问题：如果你的package.json里有type:module的配置项，那么你应该把它删掉。  
package.json里的type定义了这个项目所有.js文件的处理方式。  如果type的值为module，那么所有.js文件将被当做ES Modules对待（我们不能让脚手架这么做）。如果type的值为commonjs，那么所有.js文件将被当做CommonJS模块对待  如果没有设置type，那么它的默认值为commonjs。不管type字段的值是什么，.mjs文件总是会被当做ES Modules对待，.cjs文件总是会当做CommonJS对待。

到这里，我们就创建了一个基本的 Vue+TypeScript 的项目，接下来我们就为这个项目引入 Electron 模块。

## 创建主进程代码

创建好项目之后，我们创建主进程的入口程序：`src\main\mainEntry.ts`。

这个入口程序的代码很简单，如下所示：

```ts
//src\main\mainEntry.ts
import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(process.argv[2]);
});
```

在这段代码里，我们在 app ready 之后创建了一个简单的 BrowserWindow 对象。app 是 Electron 的全局对象，用于控制整个应用程序的生命周期。在 Electron 初始化完成后，app 对象的 ready 事件被触发，这里我们使用 app.whenReady() 这个 Promise 方法来等待 ready 事件的发生。

**mainWindow 被设置成一个全局变量，这样可以避免主窗口被 JavaScript 的垃圾回收器回收掉**。另外，窗口的所有配置都使用了默认的配置。

这个窗口加载了一个 Url 路径，这个路径是以命令行参数的方式传递给应用程序的，而且是命令行的第三个参数。

app 和 BrowserWindow 都是 Electron 的内置模块，这些内置模块是通过 ES Module 的形式导入进来的，我们知道 Electron 的内置模块都是通过 CJS Module 的形式导出的，这里之所以可以用 ES Module 导入，是因为我们接下来做的主进程编译工作帮我们完成了相关的转化工作。

## 开发环境 Vite 插件

主进程的代码写好之后，只有编译过之后才能被 Electron 加载，我们是**通过 `Vite` 插件的形式来完成这个编译工作和加载工作**的，如下代码所示：

```ts
//plugins\devPlugin.ts
import { ViteDevServer } from "vite";
export let devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });
      server.httpServer.once("listening", () => {
        let { spawn } = require("child_process");
        let addressInfo = server.httpServer.address();
        let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          cwd: process.cwd(),
          stdio: "inherit",
        });
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
```

这是一个简单的 Vite 插件，在这个插件中我们注册了一个名为 `configureServer` 的钩子，**当 Vite 为我们启动 Http 服务的时候，`configureServer`钩子会被执行**。

这个钩子的输入参数为一个类型为 `ViteDevServer` 的对象 `server`，这个对象持有一个 `http.Server` 类型的属性 `httpServer`，这个属性就代表着我们调试 Vue 页面的 http 服务，一般情况下地址为：`http://127.0.0.1:5173/`。

我们可以**通过监听 `server.httpServer` 的 `listening` 事件来判断 httpServer 是否已经成功启动**。如果已经成功启动了，那么就启动 Electron 应用，并给它传递两个命令行参数，第一个参数是主进程代码编译后的文件路径，第二个参数是 Vue 页面的 http 地址，这里就是 `http://127.0.0.1:5173/`。

为什么这里传递了两个命令行参数，而主进程的代码接收第三个参数（`process.argv[2]`）当作 http 页面的地址呢？因为**默认情况下 electron.exe 的文件路径将作为第一个参数**。也就是我们通过 `require("electron")` 获得的字符串。

> 这个路径一般是：`node_modules\electron\dist\electron.exe`，如果这个路径下没有对应的文件，说明你的 Electron 模块没有安装好。

我们是**通过 `Node.js` `child_process` 模块的 `spawn` 方法启动 `electron` 子进程的**，除了两个命令行参数外，还传递了一个配置对象。

这个对象的 `cwd` 属性用于设置当前的工作目录，`process.cwd()` 返回的值就是当前项目的根目录。`stdio` 用于设置 electron 进程的控制台输出，这里设置 `inherit` 可以让 electron 子进程的控制台输出数据同步到主进程的控制台。这样我们在主进程中 `console.log` 的内容就可以在 VSCode 的控制台上看到了。

当 electron 子进程退出的时候，我们要关闭 Vite 的 http 服务，并且控制父进程退出，准备下一次启动。

http 服务启动之前，我们**使用 `esbuild` 模块完成了主进程 TypeScript 代码的编译工作**，这个模块是 `Vite` 自带的，所以我们不需要额外安装，可以直接使用。

主进程的入口文件是通过 `entryPoints` 配置属性设置的，编译完成后的输出文件是通过 `outfile` 属性配置的。

编译平台 `platform` 设置为 `node`，排除的模块 `external` 设置为 `electron`，**正是这两个设置使我们在主进程代码中可以通过 `import` 的方式导入 electron 内置的模块**。非但如此，Node 的内置模块也可以通过 `import` 的方式引入。

这个 Vite 插件的代码编写好后，在 `vite.config.ts` 文件中引入一下就可以使用了，如下代码所示：

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { devPlugin } from "./plugins/devPlugin";

export default defineConfig({
  plugins: [devPlugin(), vue()],
});
```

现在执行命令 `npm run dev`，你会看到 Electron 应用加载了 Vue 的首页，如下图所示：

关闭窗口，主进程和子进程也会跟着退出。修改一下 Vue 组件里的内容，窗口内显示的内容也会跟着变化，说明热更新机制在起作用。

![1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac28cadc3a7a4457a76da8b084c9f94e~tplv-k3u1fbpfcp-watermark.image?)

## 渲染进程集成内置模块

现在主进程内可以自由的使用 Electron 和 Node.js 的内置模块了，但渲染进程还不行，接下去我们就为渲染进程集成这些内置模块。

首先我们修改一下主进程的代码，打开渲染进程的一些开关，允许渲染进程使用 Node.js 的内置模块，如下代码所示：

```ts
// src\main\mainEntry.ts
import { app, BrowserWindow } from "electron";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);
  mainWindow.webContents.openDevTools({ mode: "undocked" });
  mainWindow.loadURL(process.argv[2]);
});
```

在这段代码中，有以下几点需要注意：

1. `ELECTRON_DISABLE_SECURITY_WARNINGS` 用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了。

> **如果渲染进程的代码可以访问 Node.js 的内置模块，而且渲染进程加载的页面（或脚本）是第三方开发的，那么恶意第三方就有可能使用 Node.js 的内置模块伤害最终用户** 。这就是为什么这里要有这些警告的原因。如果你的应用不会加载任何第三方的页面或脚本。那么就不用担心这些安全问题啦。

2. `nodeIntegration`配置项的作用是把 Node.js 环境集成到渲染进程中，`contextIsolation`配置项的作用是在同一个 JavaScript 上下文中使用 Electron API。其他配置项与本文主旨无关，大家感兴趣的话可以自己翻阅官方文档。

3. `webContents`的`openDevTools`方法用于打开开发者调试工具

完成这些工作后我们就可以在开发者调试工具中访问 Node.js 和 Electron 的内置模块了。

## 设置 Vite 模块别名与模块解析钩子

虽然我们可以在开发者调试工具中使用 Node.js 和 Electron 的内置模块，但现在还不能在 Vue 的页面内使用这些模块。

这是因为 Vite 主动屏蔽了这些内置的模块，如果开发者强行引入它们，那么大概率会得到如下报错：

```
Module "xxxx" has been externalized for browser compatibility and cannot be accessed in client code.
```

接下去我们就介绍如何让 Vite 加载 Electron 的内置模块和 Node.js 的内置模块。

首先我们为工程安装一个 Vite 组件：[vite-plugin-optimizer](https://github.com/vite-plugin/vite-plugin-optimizer)。

```
npm i vite-plugin-optimizer -D
```

然后修改 vite.config.ts 的代码，让 Vite 加载这个插件，如下代码所示：

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { devPlugin, getReplacer } from "./plugins/devPlugin";
import optimizer from "vite-plugin-optimizer";

export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
});
```

**vite-plugin-optimizer 插件会为你创建一个临时目录：node_modules\.vite-plugin-optimizer**。

然后把类似 `const fs = require('fs'); export { fs as default }` 这样的代码写入这个目录下的 fs.js 文件中。

渲染进程执行到：import fs from "fs" 时，就会请求这个目录下的 fs.js 文件，这样就达到了在渲染进程中引入 Node 内置模块的目的。

getReplacer 方法是我们为 vite-plugin-optimizer 插件提供的内置模块列表。代码如下所示：

```ts
// plugins\devPlugin.ts
export let getReplacer = () => {
  let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};
```

我们在这个方法中把一些常用的 Node 模块和 electron 的内置模块提供给了 vite-plugin-optimizer 插件，以后想要增加新的内置模块只要修改这个方法即可。而且 **vite-plugin-optimizer 插件不仅用于开发环境，编译 Vue 项目时，它也会参与工作** 。

再次运行你的应用，看看现在渲染进程是否可以正确加载内置模块了呢？你可以通过如下代码在 Vue 组件中做这项测试：

```ts
//src\App.vue
import fs from "fs";
import { ipcRenderer } from "electron";
import { onMounted } from "vue";
onMounted(() => {
  console.log(fs.writeFileSync);
  console.log(ipcRenderer);
});
```

不出意外的话，开发者调试工具将会输出如下内容：


![2.2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9824faa443e249acaba633248cb11ef5~tplv-k3u1fbpfcp-watermark.image?)

## 总结

现在我们迈出了万里长征的第一步，**构建好了 Vue3+Vite3+Electron 的开发环境** ，而且完成这项工作并`不依赖于市面上任何一个现成的构建工具`，这个开发环境是我们自己动手一点一点搭起来的，以后我们想增加或者修改一项功能，都可以很从容地自己动手处理。

非但如此，我们还通过本讲内容向你介绍了 Vite 插件的`开发技巧`和如何创建一个简单的 Electron 应用等知识。下一讲我们将在本节课的基础上，进一步介绍如何使用 Vite 插件制作 Electron 应用的安装包。

## 代码

本节示例代码请通过如下地址自行下载：

[源码仓储](https://gitee.com/horsejs_admin/electron-jue-jin/tree/dev)
