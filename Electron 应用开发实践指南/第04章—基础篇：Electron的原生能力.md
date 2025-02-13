
前面的章节，我们提到了 `Electron` 的原生能力中包含一些 Electron 所提供的原生 API，以及 Node.js 提供的一些底层能力，还可以通过 Node.js 调用一些原生模块以及通过 Node.js 调用一些操作系统的 OS 脚本。

这个小节，我们将详细介绍这几种原生能力的使用方式，帮助你更好地使用一些原生功能。



## Electron 的原生 GUI 能力

我们知道，Electron 通过集成浏览器内核，使用 Web 技术来实现不同平台下的渲染，并结合了 Chromium、Node.js 和用于调用系统本地功能的 API 三大板块。但是 Chromium 并不具备原生 GUI（图形用户界面，Graphical User Interface） 的操作能力，因此 Electron 内部集成一些原生 GUI 的 API，编写 UI 的同时也能够调用操作系统的底层 API。


在 Electron 中，涉及到原生 GUI 的 API 主要有以下几个：

- [BrowserWindow 应用窗口](https://www.electronjs.org/zh/docs/latest/api/browser-window)
- [Tray 托盘](https://www.electronjs.org/zh/docs/latest/api/tray)
- [Notification 通知](https://www.electronjs.org/zh/docs/latest/api/notification)
- [Menu 菜单](https://www.electronjs.org/zh/docs/latest/api/menu)
- [dialog 原生弹窗](https://www.electronjs.org/zh/docs/latest/api/dialog)
- ……

对于开发者而言，这些原生 GUI API 都是可以跨平台的，比如 `Notification` 模块，对于开发者的使用方式：

```js
// main process
const notify = new Notification({
  title: '标题',
  body: '这是内容',
});
notify.show();
```
Electron 底层会根据操作系统的不同，调用不同的原生 API，进而展示出不同的交互样式。

MacOS：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/057a9fb8d29d4c8288bf77d025fa3108~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=806&h=236&s=173223&e=png&b=e4e4e2" alt="image.png"  /></p>

Windows：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9828466b127f481bbf7fe29cc54cae64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=483&h=208&s=104412&e=png&b=e8e8e8" alt="image.png"  /></p>



## Electron 操作系统底层能力的 API

除了上面介绍的一些原生 `GUI` 能力外，Electron 还提供了一些对操作系统底层能力的封装 API。常用的有：

- [clipboard 剪贴板](https://www.electronjs.org/zh/docs/latest/api/clipboard)
- [globalShortcut 全局快捷键](https://www.electronjs.org/zh/docs/latest/api/global-shortcut)
- [screen 屏幕](https://www.electronjs.org/zh/docs/latest/api/screen)
- [desktopCapturer 音视频捕捉](https://www.electronjs.org/zh/docs/latest/api/desktop-capturer)
- ……

使用对应模块也是非常方便，比如需要跨平台的向系统剪贴板中读写文本：

```js
import { clipboard } from 'electron';
  
clipboard.writeText('Example string', 'selection');  
console.log(clipboard.readText('selection'));
```



## Node.js 的 API

前面的章节，我们提到了 `Electron` 架构中使用了 `Chromium` 的 `Renderer Process` 渲染界面，`Renderer Process` 可以有多个，并且 `Electron` 为其集成了 `Node` 运行时。但每个应用程序只能有一个主线程，主线程位于 `Node.js` 下运行。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f690e50b308440df902e917f8f38b1ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1986&h=1024&s=111571&e=png&a=1&b=73bff9" alt="image.png"  /></p>

因此，在 Electron 中，我们可以在渲染进程和主进程中使用 `Node.js`。既然我们可以使用 Node 能力，那么 [Node.js](https://nodejs.org/dist/latest-v20.x/docs/api/) 中所有的 `API` 我们都可以直接使用。

比如：我们使用 [fs](https://nodejs.org/dist/latest-v20.x/docs/api/fs.html) 模块进行文件的读写操作，使用 [OS](https://nodejs.org/dist/latest-v20.x/docs/api/os.html) 模块来提供操作系统相关的实用方法和属性。可以使用 Node npm 包进行一些额外的功能集成。

需要注意的是，不同 Electron 版本集成的 Node.js 版本不一样，所以在使用 Node.js API 的时候要注意版本问题，可以通过 [Electron release 记录](https://releases.electronjs.org/)查询到对应的 Node 版本。



## Node.js 调用原生能力

虽然 Electron 已经为我们提供了大量的跨平台的 Native APIs，但是依然不能涵盖到桌面端应用开发的方方面面，接下来的内容将会简要介绍 node 调用原生能力的几种方式和方法。


### 1. 使用 C++ 构建 node 原生模块

作为前端开发者而言，都或多或少依赖一些 native addon。在前端中比较常见的比如 `node-sass`、 `node-canvas`、 `sharp` 等。在介绍使用 C++ 构建原生模块前，我们需要先储备一些基础知识。

#### 1.1 原生模块的本质
在介绍使用 C++ 构建 node 原生模块之前，我们需要先了解一下原生模块本质。

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52c613d8ced148b5b3510c83e63d09ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1588&h=424&s=77274&e=png&a=1&b=c6fbd9" alt="image.png"  /></p>

当一个 Node.js 的 C++ 模块在 OSX 下编译会得到一个后缀是  ***.node** 的模块，本质上是  ***.dylib** 的动态链接库；而在 Windows 上本质上是  ***.dll** 的动态链接库。在 Linux 下则是 **.so** 的动态链接库。

#### 1.2 node-gyp
`node-gyp` 是一个 Node.js 包，它用于构建 Node.js C++ 扩展。这个工具允许你编译和构建需要 C++ 代码的 Node.js 模块。它是一个使用 Python 和 C++ 构建 Node.js 扩展的构建系统。

`node-gyp` 是基于 Google 的 gyp 构建系统实现的构建工具，它会识别包或者项目中的 **binding.gyp** 文件，然后根据该配置文件生成各系统下能进行编译的项目，如 `Windows` 下生成 `Visual Studio` 项目文件（ ***.sln** 等），`Unix` 下生成 `Makefile`。在生成这些项目文件之后，`node-gyp` 还能调用各系统的编译工具（如 GCC）来将项目进行编译，得到最后的动态链接库  ***.node** 文件。

> 从上面的描述，可以知道，在使用 node-gyp 前需要安装 **python** 环境和 **C++**  环境。Windows 下编译 C++ 原生模块是依赖 Visual Studio 的，但不是必须的，也可以只安装它的编译器 [Visual Studio Build Tools](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=BuildTools)。
> 
> 更多在 Windows 下安装 `node-gyp` 构建环境的教程可以参考这篇文章：[windows 下 node-gyp 的环境配置](https://juejin.cn/post/7118412140582535175)。

#### 1.3 编写 C++ 扩展的几种方式

**NAN（Native Abstractions for Node.js）** 

[NAN](https://github.com/nodejs/nan)（Node.js 的原生抽象）是一个库，提供了一组跨不同版本的 Node.js API 的抽象层。它的目标是帮助开发者编写跨版本兼容的 Node.js C++ 插件。由于 Node.js 的 API 在不同版本之间可能会变化，NAN 提供了一种方式来编写稳定的跨版本插件。

**N-API（Node-API）** 

[NAPI](https://github.com/nodejs/node-addon-api) 是 Node 在 8.x 版本提出的一个新特性，主要为开发者编写 Node.js 原生 C/C++ 插件提供了一个更为便捷和易于理解的方式。它提供了一个稳定的、应对 Node.js 版本变化的抽象层，允许开发者编写与 Node.js 引擎解耦的代码。这意味着，即使 Node.js 更新版本，使用 `N-API` 编写的插件也可以继续在新版本上运行。

**node-addon-api**

[Node-addon-api](https://github.com/nodejs/node-addon-api) 是 Node.js 提供的另一个 C++ 扩展 API。它是一个用于编写跨平台的 Node.js C++ 扩展的库。Node-addon-api 是构建在 NAPI 之上的，提供了更加简单的 API，使得扩展开发者可以更加容易地编写跨版本、跨平台的扩展。它还提供了一些方便的功能，如自动内存管理、V8 值的类型转换等。

这三个工具或 API 都是为了帮助开发者编写可移植、跨平台的 Node.js C++ 插件，但它们的定位和功能略有不同。N-API 是官方提供的稳定接口，而 NAN 则是它的前身，node-addon-api 则是基于 N-API 的高级封装。


#### 1.4 binding.gyp
`binding.gyp` 是一个用于描述 Node.js 插件构建过程的配置文件。这个文件使用 JSON 格式，但它实际上是为了描述构建系统（例如 Node-gyp）所需的构建配置和元数据。

下面是一个使用 node-addon-api 编写的模块的 `binding.gyp` 文件示例：

```js
// binding.gyp
{
  "targets": [
    {
      // 链接目标,链接之后，生成 "hello.node"
      "target_name": "hello",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      
      // C++ 源文件
      "sources": [
        "./src/hello.cpp",
        "./src/index.cpp"
      ],
      
      // C++ 头文件目录  
      "include_dirs": ["<!(node -p \"require('node-addon-api').include_dir\")"],
 
      // 预编译宏
      "defines": [ 
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
      // 静态库
      "libraries":[]
    }
  ]
}
```

#### 1.5 开发一个 C++ 扩展
有了上面的知识，我们来介绍一下如何开发一个简单的 C++ 扩展。先来看看目录结构：

```shell
.
├── binding.gyp
├── hello.cc
├── index.js
└── package.json
```
然后，创建一个原生模块的配置文件 binding.gyp，如下代码所示：

```json
{
  "targets": [
    {
      "target_name": "hello",
      "cflags!": [ "-fno-exceptions" ],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [ "hello.cc" ],
      "include_dirs": ["<!(node -p "require('node-addon-api').include_dir")"],
    }
  ]
}
```
接下来编写 `hello.cc` 文件：
```C++
#include <napi.h>

Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "hello"),
              Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
```
其中通过 `Napi::CallbackInfo&` 来获取函数参数，例如 `info[0]` 代表第一个参数。`info.Env()` 返回一个 `Napi::Env` 对象，代表了当前的 Node.js 环境。

`Napi::Env` 是对 napi_env 的封装，代表一个 JavaScript 上下文，大部分和 JavaScript 交互的场景都需要这个上下文，可以保存起来以供下次使用（但是不要跨线程使用）。

`Napi::String::New` 用来构建 JavaScript 值，比如 `
Napi::String::New(env, "hello")` 就是创建了一个字符串 `"hello"`。

`Napi::Object exports` 则是这个模块的 exports 对象，可以把想要给 JavaScript 暴露的值和函数通过 `exports.Set` 设置到这个上面。

`NODE_API_MODULE` 这个宏方法定义此原生模块的入口函数，一旦 Node.js 加载该模块时，将执行 Init 方法，`NODE_GYP_MODULE_NAME` 宏展开后为编译配置文件 `binding.gyp` 中的 `target_name`。

接着，使用 `node-gyp` 来构建项目：

```shell
$ node-gyp configure build
```

关于 `node-gyp` 常用的命令：

* `node-gyp configure`： 这个命令用于配置构建环境。它会检查你的系统环境并生成相应的构建文件，例如在 Windows 上会生成 Visual Studio 的项目文件或在 macOS 上生成 Xcode 的项目文件。
* `node-gyp build`： 使用这个命令来执行实际的构建过程。它会根据 `binding.gyp` 文件中的配置进行编译和构建，生成可加载的 Node.js 模块。
* `node-gyp clean`： 清理构建产生的中间文件和输出目录。这个命令会删除构建生成的文件，以便重新开始构建过程。
* `node-gyp rebuild`： 这个命令相当于执行了 `clean` 后再进行 `configure` 和 `build`。它会重新构建你的模块，无论是否已经构建过。
* `node-gyp install`： 用于安装 Node.js 模块的依赖。它会查找 `binding.gyp` 文件中列出的依赖，并尝试安装所需的组件。

最后，编写一个 `index.js` 来引用编译好的 `hello.node` 文件

```js
const addon = require('./build/Release/hello.node');

module.exports = addon;
```

#### 1.6 使用 node-bindings 包
在上面的例子中，我们在 `index.js` 文件中，直接通过相对路径的方式引用了编译好的 `.node` 文件。但是在大多数情况下，由于 Node.js Addon 存在各种不同的方案、构建配置，那 .node 文件产物的位置可能也会因此不同，所以我们需要借助一个 [node-bindings](https://github.com/TooTallNate/node-bindings) 包来自动为我们寻找 .node 文件的位置：

```js
const addon = require('bindings')('hello.node');

module.exports = addon;
```

#### 1.7 使用 node-pre-gyp
由于使用安装包的用户可能存在着不同的操作系统和 node ABI 版本，为了可以自动编译当前系统架构所对应的产物，我们大多数情况下不得不让用户在安装 C++ 扩展包时使用用户设备进行 Addon 的编译，那么这个时候就需要修改一下我们扩展包的 `package.json` 文件：

```json
{
  "scripts": {
    "install": "prebuild-install || node-gyp rebuild --release"
  }
}
```
这里我们添加了一个 `install` 钩子，来确保用户在执行 `npm install` 时执行 `node-gyp rebuild` 命令来进行本地编译。

但这对没有 C++ 编译环境的用户来说，使用这个扩展是个非常头疼的问题，因为会各种报错。因此，如果你希望让用户无需具备编译环境即可安装 Addon，那么你可以使用 [node-pre-gyp](https://github.com/mapbox/node-pre-gyp)。

`node-pre-gyp` 允许开发者将预编译的 Node.js 插件发布到各种平台（Windows、macOS、Linux 等）。这样，用户可以在安装时直接获取预编译的二进制文件，而不需要在他们的机器上进行编译。

这个时候，你的 `package.json` 需要指定对应编译好的 `.node` 文件下载地址，并添加一个 `install` 钩子，让用户在执行 `npm install` 的时候，通过 `node-pre-gyp install` 寻找预编译好的二进制 `.node` 文件。

`node-pre-gyp` 会先检查项目本地是否已经存在二进制构建文件，当不存在时进入用户本地查找，当用户本地也不存在时会执行 http 下载。

```json
"dependencies"  : {
  "@mapbox/node-pre-gyp": "1.x"
},
"devDependencies": {
  "aws-sdk": "2.x"
}
"scripts": {
  "install": "node-pre-gyp install --fallback-to-build"
},
"binary": {
  "module_name": "your_module",
  "module_path": "./lib/binding/",
  "host": "https://your_module.s3-us-west-1.amazonaws.com"
}
```

#### 1.8 Electron 上引入原生模块
如果你使用的 C++ 扩展是通过安装时编译而不是预编译的方式实现的，那么 Electron 在引入包进行本地编译时，编译出的原生模块不一定能在 Electron 应用中正常工作，有可能会报以下错误：

```bash
Error: The module '/path/to/native/hello.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 51. This version of Node.js requires
NODE_MODULE_VERSION 57. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

原因就是我们前面提到了，Electron 自己内部集成了一个 `Node.js` 环境，那么就有可能出现 **Electron 内置的 Node.js 的版本可能与你编译原生模块使用的 Node.js 的版本不同** 的情况。

遇到这种情况，建议开发者使用 Electron 团队提供的 [electron-rebuild](https://github.com/electron/rebuild) 工具来进行重新编译，因为 electron-rebuild 会帮我们确定 Electron 的版本号、Electron 内置的 Node.js 的版本号、以及 Node.js 使用的 ABI 的版本号，并根据这些版本号下载不同的头文件和类库：

```bash
npm install --save-dev electron-rebuild

# 当你需要安装原生 Native 时，运行下面这个命令
./node_modules/.bin/electron-rebuild --force --module-dir=xxx

# 在 windows 下如果上述命令遇到了问题，尝试这个：
.\node_modules.bin\electron-rebuild.cmd --force --module-dir=xxx
```

### 2. 使用 node-ffi-napi 调用动态链接库
[ node-ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi) 是一个用于使用纯 JavaScript 加载和调用动态库的 Node.js 插件。它可以用来在不编写任何 C++ 代码的情况下创建与本地 DLL 库的绑定。同时它负责处理跨 JavaScript 和 C 的类型转换。

但是，它的性能可能较低，并且不适用于需要较高性能或对 V8 引擎更深层次控制的情况。

`node-ffi-napi` 通过 `Buffer` 类，在 C 代码和 JS 代码之间实现了内存共享，类型转换则是通过 [ref-napi](https://github.com/node-ffi-napi/ref-napi)、[ref-array-napi](https://github.com/Janealter/ref-array-napi) 实现。由于 `node-ffi-napi` / `ref-napi` 包含 C 原生代码，所以安装需要配置 Node 原生插件编译环境。

#### 一个简单的示例
在 Windows 平台上，动态链接库指的是 `.dll` 文件，关于如何开发一个 `.dll` 文件，不在本小册的主题之内，有兴趣的可以阅读这篇文章：[Electron9.x +Vue +ffi-napi 调用DLL库](https://juejin.cn/post/6854573212341108749)。

接下来，我们来实现调用 Windows 系统 `user32.dll` 中的消息对话框 MessageBoxW。那么，我们就可以使用 `node-ffi-napi` 来进行调用：

```js
import ffi from 'ffi-napi';

function showText(text) {
  return new Buffer(text, 'ucs2').toString('binary');
};

// 通过ffi加载user32.dll
const myUser32 = new ffi.Library('user32', {
  // MessageBoxW 是 dll 中定义的函数，两者名称需要一致
  // [a, [b，c....]] a是函数出参类型，[b，c]是dll函数的入参类型
  MessageBoxW:
    [
      'int32', ['int32', 'string', 'string', 'int32'],
    ],
});

// 调用 user32.dll 中的MessageBoxW()函数, 弹出一个对话框
myUser32.MessageBoxW(0, showText('my windows DLL'), showText('DLL dialog'), 0);
```


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c278d073c2a4838a1b0e602f9236c7e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=173&h=187&s=11001&e=png&b=fafafa" alt="image.png"  /></p>


> 注意，如果你使用的 Electron 版本 > 20.3.8。那么你在使用 `ffi-napi` 或 `ref-napi` 时，可能会遇到报错：
> 
> ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6182b8f91ff40b1bb16c7a60e388d9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=856&h=236&s=40083&e=png&b=101010)
> 这是因为 Electron 21 及更高版本启用了 V8 内存隔离区(也称 V8 [沙箱](https://so.csdn.net/so/search?q=%E6%B2%99%E7%AE%B1&spm=1001.2101.3001.7020))。
> 相关的文档和 issue 可以参考这里：
> - https://github.com/electron/electron/issues/35801
> - https://www.electronjs.org/blog/v8-memory-cage
> 
> 一个解决方案是使用 fork 版本的 `ffi-napi` 和 `ref-napi`： 
> 
> - https://www.npmjs.com/package/@lwahonen/ffi-napi
> - https://www.npmjs.com/package/@lwahonen/ref-napi

### 3. 使用 Rust 构建 Node 原生模块
除了使用 C++ 构建 Node 原生模块以及 `node-ffi-napi` 调用动态链接库以外，我们还可以使用 `Rust` 来构建 Node 的原生扩展，关于这部分内容比较体系，因此我单独拎出来一个章节进行介绍：[《通用篇：使用 Rust 开发 Electron 原生扩展》](https://juejin.cn/book/7302990019642261567/section/7317079096541282341)。


## Node 调用 OS 脚本

我们也可以使用 Node.js 调用系统集成好的一些能力，接下来我们将分别介绍不同平台的一些 OS 脚本能力。


### 1. WinRT

`WinRT（Windows Runtime）` 是 Microsoft 开发的一种应用程序框架，用于创建 Windows 平台上的通用应用程序。它提供了一系列 API，允许开发者使用多种编程语言（如 C++、C#、JavaScript）编写适用于 Windows 8 及更新版本的应用程序。

WinRT 提供了许多功能，包括用户界面、文件访问、网络通信、设备访问等。它旨在支持不同类型的 Windows 应用程序开发。

在 Windows 中，我们可以使用 [NodeRT](https://github.com/NodeRT/NodeRT) 来调用 WinRT 的能力，比如使用 `Windows.Devices.Geolocation` 命名空间，在 Node.js 中定位用户的位置：

```js
const { Geolocator } = require('windows.devices.geolocation')
const locator = new Geolocator()

locator.getGeopositionAsync((error, result) => {
  if (error) {
    console.error(error)
    return
  }

  const { coordinate } = result
  const { longitude, latitude } = coordinate

  console.info(longitude, latitude)
})
```

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/445eab5801ef490ea4b12fe69992b552~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=677&h=499&s=30275&e=png&b=000000" alt="image.png"  /></p>


### 2. AppleScript

`AppleScript` 是 macOS 和 Mac OS Classic 中的脚本语言，用于自动化和控制 Mac 系统上的各种操作和应用程序。

`AppleScript` 允许用户编写脚本来执行诸如文件操作、应用程序控制、系统设置更改等操作。它与 macOS 紧密集成，可用于操作系统本身以及许多应用程序。

通常，我们可以使用 [node-applescript](https://github.com/TooTallNate/node-applescript) 来执行一些 `AppScript` 脚本：

```js
const applescript = require('applescript');

// 非常基本的 AppleScript 命令。以 'Array' 形式返回 iTunes 中当前选定音轨的歌曲名称。
const script = 'tell application "iTunes" to get name of selection';

applescript.execString(script, (err, rtn) => {
  if (err) {
    // Something went wrong!
  }
  if (Array.isArray(rtn)) {
    for (const songName of rtn) {
      console.log(songName);
    }
  }
});
```

### 3. Shell 脚本
Shell 提供了与操作系统交互的命令行界面，允许用户执行文件操作、进程管理、系统设置等。通常我们可以使用 node 的 `child_process` 模块来调用和执行一些命令行脚本。比如，我们想调用 windows 中的一个 `.exe` 可执行文件：

```js
const { execFile } = require('child_process');

const exeRes = execFile('C:\\xxx.exe');

exeRes.on('exit', () => {
  if (code) {
    //  todo
  }
});
```

## 总结

本小节，我们详细介绍了 `Electron` 中调用原生能力的几种方式，除了使用 `Electron Native APIs` 外，依托于 `Node` 的能力，我们还可以使用 `Node APIs` 以及 `Node addon` 和 `OS` 脚本的能力。

希望通过本小节的介绍，可以让你在遇到需要原生能力才能解决的问题的时候，选择适合自己的工具和方法。




