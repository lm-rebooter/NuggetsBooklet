## 前言
自动化测试是利用软件工具和脚本来执行测试用例和验证预期结果的过程，而无需人工干预。它是软件测试的一种方法，通过编写脚本和使用特定的测试工具来模拟用户行为和系统交互，以验证软件应用程序的功能、性能和稳定性。

对于前端熟悉的 Web 自动化测试而言，它通过使用特定的测试工具（比如：`Selenium`、`Puppeteer`...）和脚本来模拟用户在 Web 浏览器中的行为和交互，以验证网站或 Web 应用程序的功能、界面和性能。

对于 Electron 应用自动化测试而言，整体来说跟 Web 自动化测试差不多，最大区别就是要处理 Electron 驱动。

Electron 应用程序自动化测试有比较多的工具可以选择，常用的几种测试方式：

1. **WebdriverIO**：`WebdriverIO` 是一个基于 Node.js 的自动化测试框架，用于 Web 应用程序的自动化测试。它使用 `WebDriver` 协议来控制浏览器，并提供了强大的 API，能够让开发者执行各种测试任务，如单元测试、集成测试和端到端测试。
2. **Selenium**：`Selenium` 是一个用于自动化 Web 浏览器操作的工具集和库。它允许开发者模拟用户在不同的浏览器（如 Chrome、Firefox、Safari 等）中进行操作，执行诸如点击按钮、填写表单、导航到不同页面等任务。这对于自动化测试、网页抓取以及网站功能验证非常有用。
3. **Playwright**：`Playwright` 是一个用于自动化 Web 浏览器操作的工具，它类似于 `Selenium` 和 `Puppeteer`。由 Microsoft 开发并维护，它提供了跨浏览器（如 Chrome、Firefox、WebKit）、跨平台（Windows、MacOS、Linux）的自动化解决方案。
4. **自定义驱动**：相对于现有的测试框架，自定义驱动可以使用 Node.js 的内建 `IPC STDIO` 来编写自己的自定义驱动。自定义测试驱动程序需要写额外的应用代码，但是有较低的性能开销，也可以自定义很多操作方法。

接下来我们将分别介绍这几种测试方案如何在 Electron 应用程序中进行自动化测试。



## WebdriverIO
WebdriverIO 提供了一个集成服务，简化了与 Electron 应用程序的交互，并使测试变得非常简单。使用 WebdriverIO 测试 Electron 应用程序的优势包括：

* 自动下载正确的 `Chromedriver` 版本。
* 非常方便地访问 `Electron API`，比如：`app`、`BrowserWindow`、`Dialog` 和 `mainProcess`。
* 自定义模拟 `Electron API` 功能。
* 能够定义 `API` 处理程序，以修改测试中应用程序的行为。

### 1. 安装 WebdriverIO

在我们创建的 Electron 应用中，通过以下命令来安装 `WebdriverIO`：

```bash
# 安装 wdio
npm create wdio@latest ./
```
接下来会有一系列询问，默认情况下直接回车：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fa17bb34d61474d83f8e429ed1d7f3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=864&h=455&s=86872&e=png&b=fefefe" alt="image.png"  /></p>

完成之后，你会看到多了一个 `wdio.config.js` 文件，以及一个 `test` 文件夹，`wdio.config.js` 用于配置 `WebdriverIO` 的一些功能。`test` 文件夹主要是我们存放单测文件的目录。

然后再安装 `wdio-electron-service`，使用 `wdio-electron-service` 可以实现自动下载和管理正确版本的 ChromeDriver，访问 Electron API，自定义模拟 Electron API 功能，以及定义自定义 API 处理程序来修改测试中应用程序的行为等。

```bash
# 安装 wdio-electron-service
yarn add wdio-electron-service
```

### 2. 配置 WebdriverIO
为了支持 Electron 驱动，你需要在 `wdio.config.js` 中添加如下内容：
```js
export const config = {
  outputDir: 'logs',
  // 
  services: ['electron'],
  capabilities: [{
    browserName: 'electron',
    appBinaryPath: './path/to/bundled/electron/app.exe',  
    appArgs: ['foo', 'bar=baz'],
  }],
  // ...
};
```
其中 `services` 字段是一个数组，用于配置各种服务，这些服务可以增强测试的功能和设置。`services` 允许你扩展测试框架的功能，以便执行特定任务或增加额外的功能，而无需显式添加新的命令。

`capabilities` 中的 `browserName` 是指你想要运行的浏览器的名称或标识符。它指定了测试用例将在哪种类型的浏览器中执行，例如 Chrome、Firefox、Safari 等。

`appArgs`：这个选项允许你向 Electron 应用程序传递命令行参数。

`appBinaryPath`：这个选项表示 Electron 应用程序的可执行文件路径。它指定了要用于测试的已编译或构建的 Electron 应用程序的位置。以 `vue-cli-plugin-electron-builder` 为例，我们应用在 `MacOS` 上构建完成后，应用程序的路径目录为：

```bash
build/mac/${你的应用程序名}.app/Contents/MacOS/${你的应用程序名}
```

不同平台编译后的应用程序路径是不一样的，所以我们可以通过一下脚本来动态获取：

```js
// for each OS
let APP_PATH;
if (process.platform === 'linux') {
    APP_PATH = join(__dirname, 'build', 'linux-unpacked', 'electron')
} else if (process.platform === 'win32') {
    APP_PATH = join(__dirname, 'build', 'win-unpacked', 'electron.exe')
} else if (process.platform === 'darwin') {
    APP_PATH = join(__dirname, 'build', 'mac-arm64', 'electron.app', 'Contents', 'MacOS', 'electron')
} else {
    throw new Error(`Platform '${process.platform}' not implemented`)
}
```

完整配置：https://github.com/muwoo/electron-demo/blob/feat/test/wdio.conf.js

### 3. 使用 Electron API
完成步骤 1、2 后，你可以在 `test/specs/test.e2e.js` 中开始编写一个简单的测试用例：

```js
// test.e2e.js
import { browser } from '@wdio/globals';  
  
// 使用 Electron app 模块 api
const appName = await browser.electron.app('getName');
```

如果你希望在 `wdio` 中来 `Mock` Electron 的 API，那么你需要在你的应用中导入 `wdio-electron-service` 的 preload 和 main 脚本。

比如，在应用的 `preload.js` 中：

```js
// preload.js
const isTest = process.env.NODE_ENV === 'test'
if (isTest) {
  require('wdio-electron-service/preload');
}
```

在应用的 `main.js` 中：

```js
const isTest = process.env.NODE_ENV === 'test'
if (isTest) {
  require('wdio-electron-service/main');
}
```

之后便可以调用 Mock 函数并提供 API 名称、函数名称以及模拟的返回值来模拟 Electron API 的功能。例如，需要对 Electron 的 `showOpenDialog` 函数进行 `Mock`：

```js
const { expect } = require('@wdio/globals');
const { browser } = require('wdio-electron-service');

describe('App', () => {
  it('mock showOpenDialog', async () => {
    // 对 showOpenDialog 进行 mock
    await browser.electron.mock('dialog', 'showOpenDialog', 'dialog opened!');
    const result = await browser.electron.dialog('showOpenDialog');
    expect(result).toEqual('dialog opened!');
  });
});
```

## Selenium
[Selenium](https://www.selenium.dev/) 是一个 Web 自动化框架，以多种语言公开与 WebDriver API 的绑定方式。 Node.js 环境下，可以通过 NPM 安装 `selenium-webdriver` 包来使用此框架。

### 1. 安装 Selenium 环境
为了与 Electron 一起使用 Selenium ，你需要下载 `electron-chromedriver` 和 `selenium-webdriver`：

```bash
# 安装 electron-chromedriver
yarn add --dev electron-chromedriver

# 安装 selenium-webdriver
yarn add --dev selenium-webdriver
```

然后在你的项目目录下启动一个 `ChromeDriver` 服务：

```bash
./node_modules/.bin/chromedriver

# Starting ChromeDriver (v2.10.291558) on port 9515  
# Only local connections are allowed.
```
启动成功后，默认端口是 `9515`。

### 2. 编写测试用例
接下来，我们在项目目录中，新建一个 `selenium/test.js` 目录，写入以下内容：

```js
const webdriver = require('selenium-webdriver')
const {join} = require("path");

// for each OS
let APP_PATH;
if (process.platform === 'linux') {
  APP_PATH = join(__dirname, '../build', 'linux-unpacked', 'electron-vue')
} else if (process.platform === 'win32') {
  APP_PATH = join(__dirname, '../build', 'win-unpacked', 'electron-vue.exe')
} else if (process.platform === 'darwin') {
  APP_PATH = join(__dirname, '../build', 'mac-arm64', 'electron-vue.app', 'Contents', 'MacOS', 'electron-vue')
} else {
  throw new Error(`Platform '${process.platform}' not implemented`)
}

const driver = new webdriver.Builder()
  // 端口号 "9515" 是被 ChromeDriver 开启的.
  .usingServer('http://localhost:9515')
  .withCapabilities({
    'goog:chromeOptions': {
      // 这里填您的Electron二进制文件路径。
      binary: APP_PATH
    }
  })
  .forBrowser('chrome') // note: use .forBrowser('electron') for selenium-webdriver <= 3.6.0
  .build()

driver.wait(() => {
  return driver.getTitle().then((title) => {
    return title === 'electron-vue'
  })
}, 1000)
driver.quit()
```
这里，我们通过 `webdriver.Builder()` 来创建了一个 `WebDriver` 实例，其中 `9515` 端口就是我们之前启动的 `ChromeDriver` 服务地址，`binary` 字段指明了启动 Electron 应用程序的地址路径。

然后运行脚本：

```bash
node selenium/test.js
```
如果遇到了这个报错：

```bash
SessionNotCreatedError: session not created: This version of ChromeDriver only supports Chrome version 116
Current browser version is 118.0.5993.159 
```

因为 Electron 不同版本本身内置了一个特定版本的 `Chromium`， 这个错误表明你使用的 `ChromeDriver` 版本与当前 Electron 版本内置的 `Chromium` 不兼容。

解决方案一个是通过 [ChromeDriver - WebDriver for Chrome - Downloads](https://chromedriver.chromium.org/downloads) 这里找到匹配 Electron 内置 `Chromium` 版本的 `ChromeDriver`。

另一种就是安装指定版本的 `Electron`，让应用程序内置的 `Chromium` 版本匹配上 `ChromeDriver`。关于 `Electron` 版本具体使用了什么版本的 `Chromium`，可以在这里查看到：https://releases.electronjs.org/releases/stable 。

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e717f584fc194c8cb65f9a13e6f7bc7f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1308&h=618&s=84024&e=png&b=e8eaee" alt="image.png"  /></p>



## Playwright
[Microsoft Playwright](https://playwright.dev/) 是一个端到端的测试框架，使用浏览器特定的远程调试协议架构，类似于 [Puppeteer](https://github.com/puppeteer/puppeteer) 的无头 Node.js API，但面向端到端测试。 Playwright 通过 Electron 支持 `Chrome DevTools` 协议（CDP）获得[实验性的 Electron 支持](https://playwright.dev/docs/api/class-electron)。

### 1. 安装 Playwright 环境

```bash
# Playwright 推荐使用 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD
# 环境变量来避免在测试 Electron 软件时进行不必要的浏览器下载。
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 yarn add --dev playwright

# 安装 Playwright 的测试工具，你也可以使用 Jest 或 Mocha
yarn add --dev @playwright/test
```

### 2. 编写测试用例
安装完成后，可以在当前应用目录下新建一个测试目录：`playwright/test.spec.js`，然后写入我们的第一个测试用例：

```js
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

test('example test', async () => {
  // args 中填写 Electron 主进程启动的地址
  const electronApp = await electron.launch({ args: ['../out/main/index.js'] })

  // Electron 上下午执行表达式
  const appPath = await electronApp.evaluate(async ({ app }) => {
    // 这在 Electron 的主进程中运行，这里的参数始终是主应用脚本中 require('electron') 的结果。
    return app.getAppPath();
  });
  console.log(appPath);

  // 获取应用程序打开的第一个窗口.
  const window = await electronApp.firstWindow();
  // 获取窗口的标题.
  const title = await window.title()
  // 创建窗口截图.
  await window.screenshot({ path: 'intro.png' });
  // 打印窗口的 console 到 控制台.
  window.on('console', console.log);
  // Exit app.
  await electronApp.close();
  expect(title).toBe('标题');
})
```

`Playwright` 通过 `electron.launch` API 可以在开发模式下启动应用程序。 因此，要将此 API 的 `args` 参数指向 Electron 应用，可以将路径传递到主进程入口点（此处为 `../out/main/index.js`）。

再次之后，你可以通过 `electronApp.evaluate` 中的回调来访问到 Electron App 的主进程模块。

然后调用脚本来运行测试用例：

```bash
npx playwright test

# Running 1 test using 1 worker

#  ✓  1 test.spec.js:4:1 › launch app (17.3s)

#  Slow test file: test.spec.js (17.3s)
#  Consider splitting slow test files to speed up parallel execution
#  1 passed (17.6s)
```

## 自定义驱动
我们知道，通过 Node 的 `child_process.spwan` 可以打开并运行一个应用程序，并通过 `process.on()` 和 `process.send()` 来和应用程序进行消息通信。因为了有了这些能力，可以让自定义驱动变得可行。

自定义启动的实现原理是将需要获取应用信息的功能通过 `process.send()` 向 Electron 主进程发送通信消息，主进程通过 `process.on()` 收到操作指令获取到数据后再通过 `process.send()` 返回给测试程序。

### 测试 demo
首先，我们可以编写一个自定义测试驱动类，来实现启动测试和与测试应用的消息通信的功能：

```js
// driver.js
const childProcess = require('child_process')

class TestDriver {
  constructor ({ path, args, env }) {
    this.rpcCalls = []
    
    // 定义测试环境变量，让测试应用可以区分环境
    env.APP_TEST_DRIVER = 1 
    // 启动子进程
    this.process = childProcess.spawn(path, args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], env })
    
    // 处理RPC回复
    this.process.on('message', (message) => {
      // 弹出处理器
      const rpcCall = this.rpcCalls[message.msgId]
      if (!rpcCall) return
      this.rpcCalls[message.msgId] = null
      // 拒绝/接受（reject/resolve）
      if (message.reject) rpcCall.reject(message.reject)
      else rpcCall.resolve(message.resolve)
    })
    
    // 等待准备完毕
    this.isReady = this.rpc('isReady').catch((err) => {
      console.error('Application failed to start', err)
      this.stop()
      process.exit(1)
    })
  }
  
  // 简单 RPC 回调
  // 可以使用：driver.rpc('method', 1, 2, 3).then(...)
  async rpc (cmd, ...args) {
    // send rpc request
    const msgId = this.rpcCalls.length
    this.process.send({ msgId, cmd, args })
    return new Promise((resolve, reject) => this.rpcCalls.push({ resolve, reject }))
  }
  
  stop () {
    this.process.kill()
  }
}

module.exports = { TestDriver }
```

接着，我们需要给主进程增加事件处理功能：

```js
// main.js
// 在这里定义可做 RPC 调用的方法
const METHODS = {
  isReady () {
    // 进行任何需要的初始化
    return true
  },
  getAppName () {
    return app.getName();
  }
}

// 收到消息后的处理函数
const onMessage = async ({ msgId, cmd, args }) => {
  // 获取函数
  let method = METHODS[cmd]
  if (!method) method = () => new Error('Invalid method: ' + cmd)
  try {
    // 执行函数
    const resolve = await method(...args)
    process.send({ msgId, resolve })
  } catch (err) {
    const reject = {
      message: err.message,
      stack: err.stack,
      name: err.name
    }
    process.send({ msgId, reject })
  }
}
// 如果是测试环境才进行监听
if (process.env.APP_TEST_DRIVER) {
  process.on('message', onMessage)
}
```
接下来，我们尝试使用 [Mocha](https://mochajs.org/) 和 [assert](https://www.npmjs.com/package/assert) 来编写测试用例，在此之前，你需要先安装这两个测试工具：

```bash
yarn add mocha assert
```

然后，我们就可以基于 `Mocha` 和 `assert` 开始编写测试用例：
```js
// app.test.js
const assert = require('assert')
const {join} = require('path')
const { TestDriver } = require('./driver')


// 获取应用的启动路径
let APP_PATH;
if (process.platform === 'linux') {
  APP_PATH = join(__dirname, '../build', 'linux-unpacked', 'electron-vue')
} else if (process.platform === 'win32') {
  APP_PATH = join(__dirname, '../build', 'win-unpacked', 'electron-vue.exe')
} else if (process.platform === 'darwin') {
  APP_PATH = join(__dirname, '../build', 'mac-arm64', 'electron-vue.app', 'Contents', 'MacOS', 'electron-vue')
} else {
  throw new Error(`Platform '${process.platform}' not implemented`)
}

// 初始化测试应用
const app = new TestDriver({
  path: APP_PATH,
  args: ['./app'],
  env: {
    NODE_ENV: 'test'
  }
})

describe('测试启动', () => {
  before(async () => {
    await app.isReady
  });
  it('获取 app name', async () => {
    const name = await app.rpc('getAppName');
    assert(name, 'electron-app')
  })
  after(async () => {
    await app.stop()
  });
})
```

最后添加测试脚本：

```json
// package.json
"scripts": {
  "mocha": "mocha auto-test/*.test.js"
}
```

## 总结

> 本小节所有测试 demo 已上传 github：https://github.com/muwoo/electron-demo/tree/feat/test

`WebdriverIO`、`Selenium` 二者都是基于 `WebDriver` 协议的测试框架。`Selenium` 提供了多种语言来编写测试用例的能力，`WebdriverIO` 则是一个相对工程化的测试解决方案，内置了各种插件。`Playwright` 是一个相对较新的自动化测试工具，其基于的是类似于 [Puppeteer](https://github.com/puppeteer/puppeteer) 的无头 Node.js API 来完成自动化测试。

与上面三者不同的是，我们还可以通过 Node 的 `child_process` 来自定义测试驱动，这种方案会有更小的测试内存占用，更加灵活的测试功能，但与此同时，我们也需要编写更多的代码。

这几种测试工具和方法都可以应用到你的应用当中，具体使用哪种测试工具取决于团队的偏好、项目需求以及对于性能和功能的要求。











