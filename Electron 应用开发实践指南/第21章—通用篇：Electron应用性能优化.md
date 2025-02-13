## 前言
Electron 作为一种强大的桌面应用程序开发框架，提供了跨平台的能力，但在启动速度和内存占用方面一直是让人吐槽的点。接下来，我们将从这两个方面着手，一起聊聊我们能做哪些事情来优化 Electron 应用的性能。


## 启动速度优化

### 1. 资源加载优化
为什么 Electron 应用启动通常比较慢呢？在应用启动中最大的性能瓶颈其实是加载 `JavaScript` 的过程。比如，我们在渲染进程中加载一个 `download` 模块：

```js
// renderer.js
import download from 'download';
```

然后你可以在开发者工具的性能分析器中，按下 `Cmd-E` 或红色记录按钮开始捕获运行时性能，以我的最新款 `macOS` 为例：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b21d74df542a4ad3b865d0d62c5381fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1195&h=740&s=176358&e=png&b=f7eee8" alt="image.png"  /></p>

我们看到在我的机器上加载 `download` 库大概用了 `43ms`。这仅仅是引入一个模块的耗时，整体耗时需要多长时间取决于应用依赖了多少模块。（别忘了，`node_modules` 黑洞，你依赖的某模块可能会引用大量的依赖其他模块……）

所以，如何来优化资源加载呢？

#### 1.1 减少应用的依赖项

这个需要你自己认真检查是否每个资源库都是必须要依赖的，比如你依赖了一个 `lodash` 库，但是你整个项目仅仅需要用到一个 `lodash.get` 的功能，可以考虑自己手写一个功能函数。

#### 1.2 使用更加轻量的库

如果你发现某一个库加载特别耗时，性能特别差，那么可以选择一个更加轻量的库来替代。比如，我们在解析 `macOS` 的 `plist` 文件时通常需要用到 [plist](https://www.npmjs.com/package/plist) 这个库，但是经过性能度量后发现 [simple-plist](https://www.npmjs.com/package/simple-plist) 更快，但需要的功能是一样的，那么就可以替换 `simple-plist`。

#### 1.3 延后加载依赖项

通常我们会在代码头部引入一些依赖性：
```js
import plist from 'simple-plist';
export function parsePlist(xml) {
  const result = plist.parse(xml);
  // ... 
}
```
但是 `parsePlist` 这个函数并不需要在应用启动时就执行，因此，我们可以将 `simple-plist` 这个库内置到 `parsePlist` 函数中进行延后加载：

```js
let plist = null;
function get_plist() {
  if (plist === null) {
    plist = require('simple-plist');
  }
  return plist;
}

export function parsePlist(xml) {
  const plist = get_plist();
  const result = plist.parse(xml);
  // ... 
}
```

### 2. 提升代码加载速度
#### 2.1 打包压缩代码
在 Electron 中，前端代码加载和解析是启动速度的一个关键因素。较大的前端代码包意味着更多的文件需要加载和解析，从而增加了应用启动所需的时间。所以，为了提升代码加载速度，我们通常会使用 `webpack` 或者 `rollup` 来对资源进行压缩处理。如果你使用的 `electron-vite` 或者 `vue-cli-plugin-electron-builder` 来构建的，默认也会进行代码压缩。

除此之外，因为 Electron 依赖的一般都是最新版的 `Chromium`，所以，绝大多数的 ES 新特性都可以直接使用，我们不用考虑兼容性使用 `babel pollyfill`，这样也会进一步减少打包后的代码体积。

#### 2.2 手动添加 Tree shaking
`Tree shaking` 是一种用于优化前端代码的技术，主要用于消除未使用的代码（dead code）以减小最终生成的代码体积。

在 `JavaScript` 应用中，通常会导入许多库或模块，但实际上可能只使用其中的一部分功能或方法。`Tree shaking` 通过静态分析代码，识别和移除未被使用的代码片段，以此来减少最终打包输出的文件大小。

在绝大多数的打包工具中，都支持 `Tree shaking`，我们使用的 `vue-cli-plugin-electron-builder` 在进行应用程序打包时，会自动进行 `Tree shaking` 的动作，但是，`Tree shaking` 有时候效果并不好。因为它只能对代码进行静态分析，以确认模块是否有用。而有的代码有副作用（副作用，一般是指函数除了返回值，还进行了其他导致程序变化的操作，比如修改外部变量、写入文件等），`Tree shaking` 无法判断是否可以消除，举个例子：

```js
foo()

function foo(obj) {
  obj?.a
}
```

上述代码中，`foo` 函数本身是没有任何意义的，仅仅是对对象 `obj` 进行了属性 `a` 的读取操作，但是 `Tree-Shaking` 是无法删除该函数的，因为上述的属性读取操作可能会产生副作用，因为 `obj` 可能是一个响应式对象，我们可能对 `obj` 定了一个 `getter` 在 `getter` 中触发了很多不可预期的操作。

这种情况下，如果你确认代码无副作用，可以通过 `/*#__PURE__*/` 来标记文件无副作用等方法来解决。

```js
foo()

function foo(obj) {
  /*#__PURE__*/ obj?.a
}
```

#### 2.3 减少 ipcRenderer.sendSync 调用
`ipcRenderer.sendSync` 发送同步消息将阻止整个渲染过程直到收到回复。因此，我们在写程序的过程中，应该尽量避免直接或间接使用这个方法进行进程间通信。

间接使用的形式比如通过 `@electron/remote` 模块进行属性读取：

```js
// 主进程
global.foo = {
  foo: 1,
  bar: {
    baz: 2
  }
}
```

渲染进程：

```js
// 渲染进程
import { remote } from '@electron/remote'

JSON.stringify(remote.getGlobal('foo'))
```

这里会触发 4 次同步 IPC：getGlobal、foo、bar、bar.baz，这是因为通过 `@electron/remote` 来获取主进程中的数据，`@electron/remote` 底层为了确保你可以取到最新的值，不会对数据进行缓存，每次都是发起一个同步 IPC 通信来进行动态读取。


#### 2.4 使用 requestIdleCallback 优化加载顺序

[requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) 允许开发者将函数排队为在进程进入空闲期后立刻执行。它使你能够在不影响用户体验的情况下执行低优先级或后台执行的工作。

程序刚启动的时候，CPU 占用会很高，因此有些不影响渲染的启动任务可以通过 `requestIdleCallback` 在浏览器空闲时间执行，让浏览器优先去渲染。

#### 2.5 减轻主进程负荷
前面我们介绍过 Electron 进程模型是由一个主进程和多个渲染进程构成，主进程控制着整个应用的生命周期、启动、事件管理等任务，但一个应用只有一个同步执行的**主进程**。如果主进程执行的任务过多，那么它将会被阻塞进而影响整个应用的渲染执行。

因此，对于需要长期占用 CPU 繁重任务，使用 [worker threads](https://nodejs.org/api/worker_threads.html)， 或者通过 `BrowserWindow` 将它们移动到渲染进程中执行，执行完成再通过 `ipc` 通信把执行后的结果回调给主进程。

其次，对于一些同步的 `nodejs API` 我们也尽量避免使用，比如 `fs.readFileSync`、`child_process.execSync`…… 


#### 2.6 使用 V8 compile cache
当 JavaScript 代码首次被 V8 引擎执行时，会经历编译阶段，将源代码转换为可执行的机器码。编译过程是相对耗时的，特别是对于大型 JavaScript 应用。`V8 compile cache` 通过将编译过的代码缓存起来，在下次相同代码被执行时，可以直接从缓存中获取已编译的结果，从而避免了重复的编译过程，提高了代码的执行速度。

使用 `V8 compile cache` 也很简单，只需要在需要缓存的代码中引入 [v8-compile-cache](https://github.com/zertosh/v8-compile-cach) 这个包就好了，举个例子：

```js
require('v8-compile-cache')
require('electron')
require('vue')
require('download')
require('axios')
require('electron-builder')

console.log(process.uptime() * 1000)
```
在我的电脑上测试使用 `V8 compile cache` 前后执行时间对比数据是：
* 未使用 `V8 compile cache` 执行时间是 `170.68ms`；
* 使用 `V8 compile cache` 执行时间是 `156.92ms`。

整体而言是有效果的。但是如果 `require` 的包较少，且总包体积不大的情况下，那做不做 `cache` 的意义就不大了。


#### 2.7 使用 V8 snapshots
当应用程序启动时，通常需要加载和解析大量 JavaScript 代码，这会导致较长的启动时间。`V8 snapshots` 技术允许将部分 JavaScript 代码编译成一种称为快照的二进制形式，其中包含了代码执行后留在内存中的数据结构。在下次启动应用时，不必重新解析和编译这些代码，而是直接加载快照，从而加速应用程序的启动过程。


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/958f06fdbc4e4882bc77deeb284d7ce2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1173&h=361&s=64654&e=png&b=fefefe" alt="image.png"  /></p>

##### 主流程
在 Electron 中，如果想要使用 `V8 snapshots` 主要分为以下几个步骤：

1. 安装 [electron-link](https://github.com/atom/electron-link) 和 [electron-mksnapshot](https://github.com/electron/mksnapshot) 模块。
2. 使用 `electron-link` 对需要进行快照的文件进行预处理。
3. 使用 `electron-mksnapshot` 模块对预处理完成的文件进行快照生成。
4. Electron 加载生成好的快照文件。

其中，`electron-link` 模块接收一个 JavaScript 文件作为输入，通常是应用程序的入口点，还接收一个需要延迟加载的模块列表。然后，它会从这个文件开始遍历整个模块依赖图，并将所有的 `require` 调用替换为在运行时将被调用的函数。最终输出一个包含从入口点可达的所有模块代码的单个脚本文件。

比如我们有一个 `snapshot.js` 文件，该文件依赖了一个 `test.js` 文件

```js
// snapshot.js
require('./test')
```
经过 `electron-link` 处理后，则会将 `snapshot.js` 作为入口文件，从这个文件开始遍历整个模块依赖图，发现我们引入了 `test.js` 就会将 `test.js` 内联到其中，最终会生成一个包含 `test.js` 代码的文件：

```js
// 通过 electron-link 处理后的 snapshot.js
// ...
customRequire.definitions = {
  "./snapshot.js": function (exports, module, __filename, __dirname, require, define) {
    require("./test.js")
  },
  "./test.js": function (exports, module, __filename, __dirname, require, define) {
    const a = 'hello world';
    module.exports = a;
  },
};
```

`electron-link` 处理后的代码就可以传递给 `electron-mksnapshot`，这个工具可以将 JavaScript 代码编译成 V8 引擎可直接执行的快照形式。

##### 示例
接下来，我们以 `vue-cli-plugin-electron-builder` 构建的应用程序为例，详细介绍一下如何在 Electron 中使用 `V8 snapshots` 加载依赖（electron-vite 类似）。

首先，在我们的项目中安装 `electron-link` 和 `electron-mksnapshot` 这两个模块：

```shell
$ yarn add electron-link electron-mksnapshot
```

然后，创建一个 `snapshot.js` 文件把需要进行 `snapshot` 的模块进行引入，举例：

```js
// ./snapshot.js
require('plist')
require('pinyin-match')
require('lodash')
```

> 注意：**不能对有副作用的代码做 `snapshot` ！** 因为 `snapshot` 只是覆写内存，而没有实际代码执行，因此如果有读写文件、操作 dom、console 等副作用，是不会生效的。所以，你的业务代码、部分含有副作用的三方库是没法进行快照的。

然后通过以下脚本来对 `snapshot.js` 进行快照：

```js
const childProcess = require('child_process')
const vm = require('vm')
const path = require('path')
const fs = require('fs')
const electronLink = require('electron-link')

const excludedModules = {}

async function main () {
  const baseDirPath = path.resolve(__dirname, '..')

  console.log('Creating a linked script..')
  // 通过 electron-link 对代码进行预处理。
  const result = await electronLink({
    baseDirPath: baseDirPath,
    mainPath: `${baseDirPath}/snapshot.js`,
    cachePath: `${baseDirPath}/cache`,
    shouldExcludeModule: (modulePath) => excludedModules.hasOwnProperty(modulePath)
  })
  // 将处理完成后的代码写到 cache/snapshot.js 文件中
  const snapshotScriptPath = `${baseDirPath}/cache/snapshot.js`
  fs.writeFileSync(snapshotScriptPath, result.snapshotScript)
 
  // 通过 vm 模块检验生成后的代码是否可以被快照
  vm.runInNewContext(result.snapshotScript, undefined, {filename: snapshotScriptPath, displayErrors: true})

  const outputBlobPath = baseDirPath
  console.log(`Generating startup blob in "${outputBlobPath}"`)
  // 通过 electron-mksnapshot 模块来构建预处理过的 js 文件生成快照文件
  childProcess.execFileSync(
    path.resolve(
      __dirname,
      '..',
      'node_modules',
      '.bin',
      'mksnapshot' + (process.platform === 'win32' ? '.cmd' : '')
    ),
    [snapshotScriptPath, '--output_dir', outputBlobPath]
  )
}

main().catch(err => console.error(err))
```
如果你的 `snapshot.js` 代码中没有引入包含副作用的依赖，那么正常情况下会生成一个 `snapshot_blob.bin` 和一个 `v8_context_snapshot.${操作系统内核}.bin` 两个文件。这两个文件都是为了优化 Electron 应用程序的性能而存在的。`snapshot_blob.bin` 存储了预编译的 JavaScript 代码片段，而 `v8_context_snapshot.bin` 则包含了 V8 引擎的上下文快照，用于初始化引擎的状态。

接下来，我们需要将这两个快照文件加载到 Electron 应用程序中。Electron 在其二进制文件中有默认的 `V8 snapshot` 文件，你必须用你的把它覆盖掉。Electron 的二进制快照文件路径如下：

```bash
# macOS
node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/

# Windows/Linux
node_modules/electron/dist/
```

接着，需要使用以下脚本来将生成好的 `snapshot_blob.bin` 和 `v8_context_snapshot.bin` 快照文件复写拷贝到 Electron 对应的目录：

```js
const path = require('path')
const fs = require('fs')

const snapshotFileName = 'snapshot_blob.bin'
// 根据操作系统获取生成的快照名称
const v8ContextFileName = getV8ContextFileName()
const pathToBlob = path.resolve(__dirname, '..', snapshotFileName)
const pathToBlobV8 = path.resolve(__dirname, '..', v8ContextFileName)

switch (process.platform) {
  // macOS 下进行拷贝
  case 'darwin': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules/electron/dist/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources'
    )
    console.log('Copying v8 snapshots from', pathToBlob, 'to', pathToElectron)
    fs.copyFileSync(pathToBlob, path.join(pathToElectron, snapshotFileName))
    fs.copyFileSync(pathToBlobV8, path.join(pathToElectron, v8ContextFileName))
    break
  }
  
  // windows 和 linux 进行拷贝
  case 'win32':
  case 'linux': {
    const pathToElectron = path.resolve(
      __dirname,
      '..',
      'node_modules',
      'electron',
      'dist'
    )
    console.log('Copying v8 snapshots from', pathToBlob, 'to', pathToElectron)
    fs.copyFileSync(pathToBlob, path.join(pathToElectron, snapshotFileName))
    fs.copyFileSync(pathToBlobV8, path.join(pathToElectron, v8ContextFileName))
    break
  }
}

function getV8ContextFileName() {
  if (process.platform === 'darwin') {
    return `v8_context_snapshot${
      process.arch.startsWith('arm') ? '.arm64' : '.x86_64'
    }.bin`
  } else {
    return `v8_context_snapshot.bin`
  }
}
```

到这里，我们就完成了对 `V8 snapshot` 生成的动作，接下来，需要对代码进行一点点改造，比如我们在业务代码里面引入了 `lodash` 模块：

```js
// main.js
import _ from 'lodash'
```

假如我们使用的是 `webpack` 打包工具，以上代码经过 `webpack` 等打包工具的处理，`import` 引入的包被转成的是 `webpack` 的 `__webpack_require__` 形式的函数加载，并没有加载到我们缓存的快照内容。所以，第一步就是改写打包工具的打包内容，将 `lodash` 改成正常的 `nodejs require` 的形式进行引入：

```js
// vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // ...
  configureWebpack: {
    externals: {
      lodash: 'require("./node_modules/lodash/lodash.js")',
    },
  }
})
```

然后，再重写一下 `nodejs require` 函数，让其先从我们的快照中加载依赖，如果快照中没有再正常加载依赖：

```js
// v8-snapshot-util.js
// snapshotResult 就是快照内容
if (typeof snapshotResult !== 'undefined') {
  const Module = __non_webpack_require__('module');
  // 缓存原始 require 的 _load 函数
  const originalLoad = Module._load;
  
  console.log('snapshot 加载。。。。', snapshotResult);
  // 重写 require 的 _load 功能
  Module._load = function _load(module, ...args) {
    // 从快照中读取模块
    let cachedModule = snapshotResult.customRequire.cache[module];
    // 如果没有缓存模块，使用原始 require 方式进行加载
    if (!cachedModule)  {
       cachedModule = {exports: originalLoad(module, ...args)};
    }
    // 返回模块内容
    return cachedModule.exports;
  };
  
  snapshotResult.setGlobals(global, process, window, document, console, global.require);
}
```

最后，在 Electron 应用程序入口中引入重写 `require` 的文件：

```js
// main.js
require('../../tools/v8-snapshot-util')
```

完整代码：https://github.com/muwoo/electron-demo/tree/feat/v8-snapshot


### 3. 窗口创建优化
Electron 因为集成了 Node.js 和 Chromium，在创建 `BrwoserWindow` 对象时需要对这些环境进行初始化，整体来看是比较耗时的操作。如果我们需要多窗口的操作，那么通常会通过以下手段进行优化窗口的打开性能。

#### 窗口预热
窗口预热和前端页面的预渲染有点类似，简单来说就是将用户即将用到的窗口提前进行隐藏加载，等到用户需要的时候直接显示，给用户的体感是秒开，但其实是我们已经预热加载了。

#### 窗口常驻
对于业务无关的、通用的窗口，也可以采用**常驻模式**，例如通知、图片查看器。这些窗口一旦创建就不会释放，打开效果会更好。

#### 窗口池
对于频繁开启/关闭的窗口，也可以使用**窗口池**来优化。

窗口池比较通用的方案是在应用创建的时候提前渲染 n 个空白的窗口并将其放入到一个集合中，当我们操作窗口时，从窗口池中获取一个空闲窗口（**取出窗口后再立即创建一个新的窗口，将其补充到窗口池子中**），当窗口关闭时，直接将其从窗口池中移除。

比如，我们可以构造一个窗口池数组：

```js
items = [];
```

然后初始化的时候来创建一些窗口：

```js
init() {
  // 初始创建 3 个窗口
  for (let i = 0; i < 3; i++) {
    this.items.push(new WindowPoolItem())
  }
  // 渲染进程发送消息告诉主进程需要从窗口池中获取一个窗口
  ipcMain.handle('open-window', (e, data) => {
    // 判断是否有正在使用的窗口
    if (this.isWindowInUse(data)) return
    // 从窗口池中选取一个窗口
    this.picAndUse(data)
  })
}
```

在这个方法内，我们给窗口池创建了 3 个备用窗口；并监听了一个名为 `open-window` 的消息，当渲染进程需要打开新窗口时，就会发送一条 `ipc` 给主进程进行窗口创建。其中，`WindowPoolItem` 是窗口池中的单一窗口创建类：

```js
class WindowPoolItem {
  // 初始化窗口
  constructor() {
    this.params = undefined;
    this.win = new BrowserWindow({
      autoHideMenuBar: true,
      show: false,
      enableLargerThanScreen: true,
      webPreferences: {
        webSecurity: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true,
      },
    });
  }
  // 使用窗口
  use(params, close) {
    this.params = params;
    this.win.setBounds({
      ...params,
    });
    this.win.loadURL(params.url);
    this.win.once('ready-to-show', () => {
      this.win.show();
    });
    this.win.on('close', () => {
      close();
    });
  }
  // 修改窗口参数
  effectParam(params) {
    this.win.setBounds({
      ...params,
    });
  }
}
```
`isWindowInUse` 函数通过窗口打开的 `url` 来判断即将打开的窗口是否已经在使用中，如果已经在使用中，那么就不需要从窗口池中再获取新的窗口，只需要通过 `effectParam` 调整一下参数即可：

```js
isWindowInUse(params) {
  // 根据 url 判断窗口是否已经打开过
  let item = this.items.find((v) => v.params?.url === params.url)
  if (!item) return false
  // 如果打开过了，对窗口位置、大小进行调整
  item.effectParam(params)
  return true
}
```
如果需要打开的窗口并没有被打开过，那么就需要通过 `picAndUse` 来从窗口池中拿一个窗口加载，并立即创建一个窗口还给窗口池：

```js
picAndUse(params) {
  // 没有params属性的，就是没用过的
  let item = this.items.find((v) => !v.params);
  // 使用窗口
  item.use(params, () => {
    // 窗口关闭后，从窗口池中移除
    this.items = this.items.filter(v => v.params?.url !== params.url);
  });
  // 取出一个窗口后，立刻再创建一个窗口
  this.items.push(new WindowPoolItem())
}
```
> 完整代码：https://github.com/muwoo/electron-demo/tree/feat/window

整体来看，不管是窗口预热，还是窗口常驻，又或是窗口池，都是**空间（内存）换时间**的策略，我们可以根据业务需要选择合理的窗口创建策略。


### 4. 预渲染
对于大多数基于 `Vue` 或者 `React` 的单页应用而言，页面的 DOM 会通过虚拟 DOM 进行渲染，这就意味着在虚拟 DOM 渲染为真实 DOM 之前，页面都是白屏的。

如果你的首页数据加载不是很依赖服务端数据，那么可以使用 [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) 这个 `webpack` 插件来对页面做预渲染：

```js
// vue.config.js
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        // 预渲染输出的目录
        staticDir: path.join(__dirname, 'dist'),
        // 需要进行预渲染的页面
        routes: [ '/' ],
      })
    ]
  }
}
```

如果应用首页加载比较依赖服务端提供的数据，那么我们可以在资源未加载完毕之前，先展示页面的骨架，通过骨架屏的方式来让页面整体加载得更加流畅，避免长时间白屏，减少用户等待的焦虑感，比如掘金首页：


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fd3cefedd6b49f288ec92f4989899cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1498&h=464&s=180827&e=png&b=ffffff" alt="image.png"  /></p>


以 Vue 为例，你可以通过 [vue-content-placeholders](https://github.com/michalsnik/vue-content-placeholders) 这个库来轻松实现一个骨架图。

如果你的内容比较动态，有很大的不确定性，骨架图渲染的占位可能和最终呈现的效果有很大的出入，那么也可以采用一些开机 `lodaing` 动画。

## 内存优化
在我们开发 Electron 应用时可以通过电脑的任务管理器（Windows）或者活动监视器（MacOS）来查看应用的内存占用情况。比如我们通过 `electron-vite` 初始化一个 `Electron` 应用，以 MacOS 举例，其内存占用情况大致如下：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/669fdcce0c7d4e9baff3219627f97dc0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1480&h=768&s=280265&e=png&b=faf8f7" alt="image.png"  /></p>

其中 `Electron Helper` 是 Electron 应用中的辅助进程。这些辅助进程是 Electron 框架的一部分，用于协助主进程执行各种任务，以提高应用程序的性能和安全性。Electron Helper 进程执行诸如渲染网页内容、处理图形和执行其他异步任务等工作。例如，可能会看到 `Electron Helper (Renderer)` 用于渲染应用程序的界面，以及 `Electron Helper (GPU)` 用于处理图形加速。

### 内存分析工具
Electron 内存分析工具通常是基于 `Chrome Devtools` 来进行的。Electron 内存占用主要分为主进程内存占用和渲染进程内存占用。

**在主进程中**，我们可以通过 [electron inspect](https://www.electronjs.org/zh/docs/latest/tutorial/debugging-main-process) 来对应用程序的内存进行分析，如果你使用的是 [electron-vite](https://cn.electron-vite.org/guide/debugging) 来构建开发应用程序，那么可以使用其内置脚本来开启主进程调试：

```bash
electron-vite --inspect --sourcemap
```
一旦 `electron-vite` 启动，你可以通过在浏览器上打开 `chrome://inspect` 并连接到 V8 inspector 来使用 `Chrome DevTools` 调试：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86d5d9d4efc94255b1ed87110d0504d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=802&h=455&s=55463&e=png&b=fefefe" alt="image.png"  /></p>

打开这个 `inspect` 后，进入到 `chrome DevTools` 后，点击 `memory` 标签进行内存堆快照查看：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cc9fc9ae90c4529962317273cc28141~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1856&h=1280&s=652464&e=png&b=fefefe" alt="image.png"  /></p>

通过 `Memory Heap Snapshots` 可以帮助你找出内存泄漏或者不必要的内存占用。

**在渲染进程中**，就可以通过 `window.webContents.openDevTools()` 的方式来打开渲染进程窗口的 `Chrome Devtools` 进行查看渲染进程的内存占用。



### 常用的优化手段
常用的内存优化手段其实我们已经有过部分介绍，比如减少代码体积不仅能加快启动速度，还可以降低应用的内存占用。除此之外，我们再介绍一些对降低内存有用的几种优化手段。

#### 1. 优化图片资源加载
在 Electron 中，加载不同大小的图片会影响内存占用。大尺寸的图片会占用更多的内存，因为它们需要更多的空间来存储像素数据。当你在应用程序中使用大量图片时，尤其要注意这一点，因为它们可能会显著增加内存的使用量。

通常情况下，合理优化图片大小和使用图片压缩技术能够有效地减少内存占用。这可能包括选择合适的图片格式（如 WebP、JPEG 或 PNG）以及压缩图片以降低文件大小。

另外，注意在使用图片时，及时释放不再需要的资源，比如将图片从内存中卸载或者销毁不再使用的图像对象，有助于降低内存的压力。


#### 2. 页面懒加载
DOM 的渲染和加载也会占用机器的大量内存，对于一些长列表的页面，我们可以做 DOM 的懒加载，只加载可视区域的内容来避免不必要的内存开销。

#### 3. 注意内存泄漏
V8 引擎有着自己的垃圾回收机制，虽然它在 GC（垃圾回收）方面有着其各种策略，并做了各种优化从而尽可能地确保垃圾得以回收，但我们仍应当避免任何可能导致无法回收的代码操作。常见的例子包括：

1.  **未及时移除事件监听器：** 当你添加了事件监听器，但在元素被移除之前未移除这些监听器时，会导致内存泄漏。这会导致对元素的引用仍然存在，即使元素自身已不再需要。
2.  **闭包（Closure）：** 在 JavaScript 中，闭包可以导致内存泄漏。当一个函数引用了另一个函数内的变量，并且这个函数被长期保留，即使它不再需要，闭包中引用的变量也会一直存在于内存中。
3.  **定时器未清理：** 使用 `setInterval` 或 `setTimeout` 创建的定时器，如果不及时清理或者取消，会一直存在于内存中，即使它们不再需要。
4.  **DOM 引用未释放：** 当你从 DOM 中移除一个元素时，如果你仍然保持对该元素的引用（例如，还有其他对象引用了它），那么这个元素将不会被垃圾回收。
5.  **大量未使用的缓存数据：** 如果你在前端存储了大量的数据，尤其是长时间不再使用的数据，会占用大量内存。

所以，我们编写代码时，要时刻注意可能存在内存泄露的场景，及时通过 `Chrome DevTools` 进行内存分析查看。

#### 4. 合理使用 BrowserWindow

通过 `new BrowserWindow` 创建窗口，每个窗口都是独立的进程，如果多个窗口都使用了同一个资源，比如同一张图片或者同一个脚本，那这些窗口都会独立加载这些资源，造成内存浪费。

相对的，我们可以通过 `window open` 的方式来创建新窗口，新窗口会在父窗口的渲染进程中创建，共用一个 `render process`，因此这些窗口是可以共享进程内存的。

> 参考文章：
> 
> [我是如何将窗口的内存从500M降低到132M的](https://juejin.cn/post/7201856537534939191)
>
> [腾讯 QQ 桌面版架构升级：内存优化探索与总结](https://zhuanlan.zhihu.com/p/650624899)

## 总结
以上，我们介绍了如何优化 Electron 的启动性能和内存占用。需要注意的是任何应用随着业务的迭代和演进，总体性能都是会呈现下降趋势的，性能优化不是一次性的工作，而是需要伴随着业务开发定期检查和优化。希望通过本小节的介绍，可以为你提供一些性能优化的手段和思路。


















