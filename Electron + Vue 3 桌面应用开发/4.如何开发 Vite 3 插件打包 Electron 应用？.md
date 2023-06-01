在上一节中我们开发了一个 Vite 插件，有了这个 Vite 插件之后我们就可以自由地开发 Vue+Electron 桌面端应用了。

但不知道怎么把开发的应用`分发给用户`，我们心里总是会觉得没底，对吧？开发的应用要怎么才能让用户使用呢？如果不解决这个问题，相信大家开发应用时心里也不会踏实。

同样的，我们还是要基于 Vite 的技术体系完成这项工作，但单上一节讲的插件是没办法制作应用安装包，并把应用分发给用户的，所以本节课我们就再制作一个 Vite 插件。通过这个新的插件生成安装包（这样也就把开发环境脚手架和打包脚手架分离开了，让它们各司其职，互不干扰），有了安装包就可以把应用分发给用户了。

本节课我将按照如下几个步骤带领大家制作 Vite 打包 Electron 应用的插件：


![3.1.PNG](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4185ee34cfba43278a9f253b6340edcc~tplv-k3u1fbpfcp-watermark.image?)

## 编译结束钩子函数

首先我们为 vite.config.ts 增加一个新的配置节，如下代码所示：

```ts
//vite.config.ts
//import { buildPlugin } from "./plugins/buildPlugin";
build: {
    rollupOptions: {
        plugins: [buildPlugin()],
    },
},
```

其中，buildPlugin 方法的代码如下：

```ts
//plugins\buildPlugin.ts
export let buildPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    },
  };
};
```

这是一个**标准的 Rollup 插件**（Vite 底层就是 Rollup，所以 Vite 兼容 Rollup 的插件），我们在这个插件中注册了 `closeBundle 钩子`。

在 Vite 编译完代码之后（也就是我们执行 npm run build 指令，而且这个指令的工作完成之后），这个钩子会被调用。我们在这个钩子中完成了安装包的制作过程。

## 制作应用安装包

**Vite 编译完成之后，将在项目`dist`目录内会生成一系列的文件（如下图所示），此时`closeBundle`钩子被调用**，我们在这个钩子中把上述生成的文件打包成一个应用程序安装包。


![3.2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f7ad42567f24ff9b90aa2c6d730ea1f~tplv-k3u1fbpfcp-watermark.image?)

这些工作是通过一个名为`buildObj`的对象完成的，它的代码如下所示：

```ts
//plugins\buildPlugin.ts
import path from "path";
import fs from "fs";

class BuildObj {
  //编译主进程代码
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"],
      bundle: true,
      platform: "node",
      minify: true,
      outfile: "./dist/mainEntry.js",
      external: ["electron"],
    });
  }
  //为生产环境准备package.json
  preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
  }
  //使用electron-builder制成安装包
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
        },
        files: ["**"],
        extends: null,
        productName: "JueJin",
        appId: "com.juejin.desktop",
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "juejinDesktop",
        },
        publish: [{ provider: "generic", url: "http://localhost:5500/" }],
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }
}
```

这个对象通过三个方法提供了三个功能，按照这三个方法的执行顺序我们一一介绍它们的功能。

1. `buildMain`。由于 Vite 在编译之前会清空 dist 目录，所以我们在上一节中生成的 mainEntry.js 文件也被删除了，此处我们通过`buildMain`方法再次编译主进程的代码。不过由于此处是在为生产环境编译代码，所以我们增加了`minify: true` 配置，生成压缩后的代码。如果你希望与开发环境复用编译主进程的代码，也可以把这部分代码抽象成一个独立的方法。


2. `preparePackageJson`。用户安装我们的产品后，在**启动我们的应用程序时，实际上是通过 Electron 启动一个 Node.js 的项目**，所以我们要为这个项目准备一个 package.json 文件，这个文件是以当前项目的 package.json 文件为蓝本制作而成的。里面注明了主进程的入口文件，移除了一些对最终用户没用的配置节。

> 生成完 package.json 文件之后，还创建了一个 node_modules 目录。此举是为了阻止 electron-builder 的一些默认行为（这一点我们后续章节还会介绍，目前来说它会阻止electron-builder为我们创建一些没用的目录或文件）。

> 这段脚本还明确指定了 Electron 的版本号，如果 Electron 的版本号前面有"^"符号的话，需把它删掉。这是 electron-builder 的一个 [Bug](https://github.com/electron-userland/electron-builder/issues/4157#issuecomment-596419610)，这个 bug 导致 electron-builder 无法识别带 ^ 或 ~ 符号的版本号。

3. `buildInstaller`。这个方法负责调用`electron-builder`提供的 API 以生成安装包。最终生成的安装包被放置在`release`目录下，这是通过`config.directories.output`指定的。静态文件所在目录是通过`config.directories.app`配置项指定。其他配置项，请自行查阅[官网文档](https://www.electron.build/)。

> 在真正创建安装包之前，你应该已经成功通过`npm install electron-builder -D`安装了 electron-builder 库。

做好这些配置之后，执行`npm run build`就可以制作安装包了，最终生成的安装文件会被放置到 release 目录下。

## electron-builder 原理

你如果不了解 electron-builder 原理的话，可能会觉得奇怪：为什么执行`require("electron-builder").build(options)`就会为我们生成应用程序的安装包呢？

所以，接下来我们得介绍一下 electron-builder 背后为我们做了什么工作。

首先 electron-builder 会**收集应用程序的配置信息**。比如应用图标、应用名称、应用 id、附加资源等信息。有些配置信息可能开发者并没有提供，这时 electron-builder 会使用默认的值，总之，这一步工作完成后，会生成一个全量的配置信息对象用于接下来的打包工作。

接着 electron-builder 会检查我们在输出目录下准备的 package.json 文件，查看其内部是否存在 dependencies 依赖，如果存在，electron-builder 会帮我们在输出目录下**安装这些依赖**。

然后 electron-builder 会根据用户配置信息：asar 的值为 true 或 false，来判断是否需要**把输出目录下的文件合并成一个 asar 文件**。

然后 electron-builder 会**把 Electron 可执行程序及其依赖的动态链接库及二进制资源拷贝到安装包生成目录下**的 win-ia32-unpacked 子目录内。

然后 electron-builder 还会检查用户是否在配置信息中指定了 **extraResources 配置项**，如果有，则把相应的文件按照配置的规则，拷贝到对应的目录中。

然后 electron-builder 会根据配置信息使用一个**二进制资源修改器修改 electron.exe 的文件名和属性信息**（版本号、版权信息、应用程序的图标等）。

如果开发者在配置信息中指定了签名信息，那么接下来 electron-builder 会使用一个应用程序签名工具来**为可执行文件签名**。

接着 electron-builder 会使用 7z 压缩工具，把子目录 win-ia32-unpacked 下的**内容压缩**成一个名为 yourProductName-1.3.6-ia32.nsis.7z 的压缩包。

接下来 electron-builder 会使用 NSIS 工具**生成卸载程序的可执行文件**，这个卸载程序记录了 win-ia32-unpacked 目录下所有文件的相对路径，当用户卸载我们的应用时，卸载程序会根据这些相对路径删除我们的文件，同时它也会记录一些安装时使用的注册表信息，在卸载时清除这些注册表信息。

最后 electron-builder 会使用 NSIS 工具**生成安装程序的可执行文件**，然后把压缩包和卸载程序当作资源写入这个安装程序的可执行文件中。当用户执行安装程序时，这个可执行文件会读取自身的资源，并把这些资源释放到用户指定的安装目录下。

> 如果开发者配置了签名逻辑，则 electron-builder 也会为安装程序的可执行文件和卸载程序的可执行文件进行签名。

至此，一个应用程序的安装包就制作完成了。这就是 electron-builder 在背后为我们做的工作。

## 主进程生产环境加载本地文件

虽然我们成功制作了安装包，而且这个安装包可以正确安装我们的应用程序，但是这个应用程序无法正常启动，这是因为应用程序的主进程还在通过 `process.argv[2]` 加载首页。显然用户通过安装包安装的应用程序没有这个参数。

所以，接下来**我们就要让应用程序在没有这个参数的时候，也能加载我们的静态页面**。

首先创建一个新的代码文件：`src\main\CustomScheme.ts`，为其创建如下代码：

```ts
//src\main\CustomScheme.ts
import { protocol } from "electron";
import fs from "fs";
import path from "path";

//为自定义的app协议提供特权
let schemeConfig = { standard: true, supportFetchAPI: true, bypassCSP: true, corsEnabled: true, stream: true };
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: schemeConfig }]);

export class CustomScheme {
  //根据文件扩展名获取mime-type
  private static getMimeType(extension: string) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }
  //注册自定义app协议
  static registerScheme() {
    protocol.registerStreamProtocol("app", (request, callback) => {
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if (extension == "") {
        pathName = "index.html";
        extension = ".html";
      }
      let tarFile = path.join(__dirname, pathName);
      callback({
        statusCode: 200,
        headers: { "content-type": this.getMimeType(extension) },
        data: fs.createReadStream(tarFile),
      });
    });
  }
}
```

**这段代码在主进程`app ready`前，通过 `protocol` 对象的 `registerSchemesAsPrivileged` 方法为名为 `app` 的 scheme 注册了特权（可以使用 FetchAPI、绕过内容安全策略等）。**

**在`app` `ready`之后，通过 `protocol` 对象的 `registerStreamProtocol` 方法为名为 `app` 的 scheme 注册了一个回调函数。当我们加载类似`app://index.html`这样的路径时，这个回调函数将被执行。**

这个函数有两个传入参数 `request` 和 `callback`，我们可以通过 request.url 获取到请求的文件路径，可以通过 callback 做出响应。

给出响应时，要指定响应的 `statusCode` 和 `content-type`，这个 content-type 是通过文件的扩展名得到的。这里我们通过 `getMimeType` 方法确定了少量文件的 content-type，如果你的应用要支持更多文件类型，那么可以扩展这个方法。

**响应的 data 属性为目标文件的可读数据流。这也是为什么我们用 `registerStreamProtocol` 方法注册自定义协议的原因。当你的静态文件比较大时，不必读出整个文件再给出响应。**

接下来在 src\main\mainEntry.ts 中使用这段代码，如下所示：

```ts
//src\main\mainEntry.ts
if (process.argv[2]) {
  mainWindow.loadURL(process.argv[2]);
} else {
  CustomScheme.registerScheme();
  mainWindow.loadURL(`app://index.html`);
}
```

这样当存在指定的命令行参数时，我们就认为是开发环境，使用命令行参数加载页面，当不存在命令行参数时，我们就认为是生产环境，通过`app://` scheme 加载页面。

再次打包、安装你的应用程序，看这次是不是可以正常运行了呢？

> 如果你不希望在开发环境中通过命令行参数的形式传递信息，那么你也可以在上一节介绍的代码中，为`electronProcess` 附加环境变量（使用`spawn`方法第三个参数的`env`属性附加环境变量）。

## 总结

本节我们通过 Vite 插件（实际上是 Rollup 插件）开发了制作应用程序安装包的功能，而且还粗略介绍了 electron-builder 的原理。

本节介绍的知识虽然有一些技巧性，但还称不上完美，我们将在后续的章节中进一步完善这部分的知识，但现在还不是时候，为了让大家尽快了解 Vue3+Electron 的开发乐趣，我们将在下一章介绍如何使用 vue-router 管控工程架构。

## 代码

本节示例代码请通过如下地址自行下载：

[源码仓储](https://gitee.com/horsejs_admin/electron-jue-jin/tree/release)
