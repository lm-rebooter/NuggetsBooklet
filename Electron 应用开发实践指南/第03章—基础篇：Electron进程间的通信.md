## 前言

进程间通信（IPC）并非仅限于 Electron，而是源自甚至早于 Unix 诞生的概念。尽管“进程间通信”这个术语的确创造于何时并不清楚，但将数据传递给另一个程序或进程的理念可以追溯至 1964 年，当时 [Douglas McIlroy](https://www.cs.dartmouth.edu/~doug/) 在 Unix 的第三版（1973 年）中描述了 Unix 管道的概念。

>We should have some ways of coupling programs like garden hose--screw in another segment when it becomes when it becomes necessary to massage data in another way.

我们可以通过使用管道操作符（`|`）将一个程序的输出传递到另一个程序，比如：

```bash
# 列出当前目录下的所有.ts文件
ls | grep .ts
```
在 Unix 系统中，管道只是 IPC 的一种形式，还有许多其他形式，比如信号、消息队列、信号量和共享内存。在 Electron 中也有自己的 IPC 形式，接下来我们将会详细介绍。





## ipcMain 和 ipcRenderer
与 Chromium 相同，Electron 使用进程间通信（IPC）来在进程之间进行通信，在介绍 Electron 进程间通信前，我们必须先认识一下 Electron 的 2 个模块。

- [ipcMain](https://www.electronjs.org/zh/docs/latest/api/ipc-main) 是一个仅在主进程中以异步方式工作的模块，用于与渲染进程交换消息。

- [ipcRenderer](https://www.electronjs.org/zh/docs/latest/api/ipc-renderer) 是一个仅在渲染进程中以异步方式工作的模块，用于与主进程交换消息。

`ipcMain` 和 `ipcRenderer` 是 Electron 中负责通信的两个主要模块。它们继承自 NodeJS 的 [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 模块。在 `EventEmitter` 中允许我们向指定 `channel` 发送消息。`channel` 是一个字符串，在 Electron 中 `ipcMain` 和 `ipcRenderer` 使用它来发出和接收事件/数据。

```js
// 接受消息
// EventEmitter: ipcMain / ipcRenderer
EventEmitter.on("string", function callback(event, messsage) {});

// 发送消息
// EventEmitter: win.webContents / ipcRenderer
EventEmitter.send("string", "mydata");
```



## 渲染进程 -> 主进程

大多数情况下的通信都是从渲染进程到主进程，渲染进程依赖 `ipcRenderer` 模块给主进程发送消息，官方提供了三个方法：

1. `ipcRenderer.send(channel, ...args)`
2. `ipcRenderer.invoke(channel, ...args)`
3. `ipcRenderer.sendSync(channel, ...args)`

`channel` 表示的就是事件名(消息名称)， `args` 是参数。需要注意的是参数将使用结构化克隆算法进行序列化，就像浏览器的 `window.postMessage` 一样，因此不会包含原型链。发送函数、Promise、Symbol、WeakMap 或 WeakSet 将会抛出异常。


### 1. ipcRenderer.send

渲染进程通过 `ipcRenderer.send` 发送消息：

```js
// render.js
import { ipcRenderer } from 'electron';

function sendMessageToMain() {
  ipcRenderer.send('my_channel', 'my_data');
}
```

主进程通过 `ipcMain.on` 来接收消息：

```js
// main.js
import { ipcMain } from 'electron';

ipcMain.on('my_channel', (event, message) => {
  console.log(`receive message from render: ${message}`) 
})
```

请注意，如果使用 `send` 来发送数据，如果你的主进程需要回复消息，那么需要使用 `event.replay` 来进行回复：

```js
// main.js
import { ipcMain } from 'electron';

ipcMain.on('my_channel', (event, message) => {
  console.log(`receive message from render: ${message}`)
  event.reply('reply', 'main_data')
})
```

同时，渲染进程需要进行额外的监听：

```js
// renderer.js
ipcRenderer.on('reply', (event, message) => { 
  console.log('replyMessage', message);
})
```



### 2. ipcRenderer.invoke

渲染进程通过 `ipcRenderer.invoke` 发送消息：

```js
// render.js
import { ipcRenderer } from 'electron';

async function invokeMessageToMain() {
  const replyMessage = await ipcRenderer.invoke('my_channel', 'my_data');
  console.log('replyMessage', replyMessage);
}
```

主进程通过 `ipcMain.handle` 来接收消息：

```js
// main.js
import { ipcMain } from 'electron';
ipcMain.handle('my_channel', async (event, message) => {
  console.log(`receive message from render: ${message}`);
  return 'replay';
});
```

注意，渲染进程通过 `ipcRenderer.invoke` 发送消息后，`invoke` 的返回值是一个 `Promise<pending>` 。主进程回复消息需要通过 `return` 的方式进行回复，而 `ipcRenderer` 只需要等到 `Promise resolve` 即可获取到返回的值。



### 3. ipcRender.sendSync

渲染进程通过 `ipcRender.sendSync` 来发送消息：

```js
// render.js
import { ipcRenderer } from 'electron';

async function sendSyncMessageToMain() {
  const replyMessage = await ipcRenderer.sendSync('my_channel', 'my_data');
  console.log('replyMessage', replyMessage);
}
```

主进程通过 `ipcMain.on` 来接收消息：

```js
// main.js
import { ipcMain } from 'electron';
ipcMain.on('my_channel', async (event, message) => {
  console.log(`receive message from render: ${message}`);
  event.returnValue = 'replay';
});
```

注意，渲染进程通过 `ipcRenderer.sendSync` 发送消息后，主进程回复消息需要通过 `e.returnValue` 的方式进行回复，如果 `event.returnValue` 不为 `undefined` 的话，渲染进程会等待 `sendSync` 的返回值才执行后面的代码。

>发送同步消息将阻止整个渲染过程直到收到回复。这样使用此方法只能作为最后手段。使用异步版本更好 [`invoke()`](https://www.electronjs.org/zh/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args)。

### 4. 小节
**ipcRenderer.send：** 这个方法是异步的，用于从渲染进程向主进程发送消息。它发送消息后不会等待主进程的响应，而是立即返回，适合在不需要等待主进程响应的情况下发送消息。

**ipcRenderer.sendSync：** 与 `ipcRenderer.send` 不同，这个方法是同步的，也是用于从渲染进程向主进程发送消息，但是它会等待主进程返回响应。它会阻塞当前进程，直到收到主进程的返回值或者超时。

**ipcRenderer.invoke：** 这个方法也是用于从渲染进程向主进程发送消息，但是它是一个异步的方法，可以方便地在渲染进程中等待主进程返回 Promise 结果。相对于 `send` 和 `sendSync`，它更适合处理异步操作，例如主进程返回 Promise 的情况。



## 主进程 -> 渲染进程

主进程向渲染进程发送消息一种方式是当渲染进程通过 `ipcRenderer.send、ipcRenderer.sendSync、ipcRenderer.invoke` 向主进程发送消息时，主进程通过 `event.replay`、`event.returnValue`、`return ...` 的方式进行发送。这种方式是被动的，需要等待渲染进程先建立消息推送机制，主进程才能进行回复。

其实除了上面说的几种被动接收消息的模式进行推送外，还可以通过 **`webContents`** 模块进行消息通信。


### 1. ipcMain 和 webContents

主进程使用 ipcMain 模块来监听来自渲染进程的事件，通过 `event.sender.send()` 方法向渲染进程发送消息。

```js
// 主进程
import { ipcMain, BrowserWindow } from 'electron';

ipcMain.on('messageFromMain', (event, arg) => {
  event.sender.send('messageToRenderer', 'Hello from Main!');
});
```


### 2. BrowserWindow.webContents.send

`BrowserWindow.webContents.send` 可以在主进程中直接使用 `BrowserWindow` 对象的 `webContents.send()` 方法向渲染进程发送消息。

```js
// 主进程
import { BrowserWindow } from 'electron';

const mainWindow = new BrowserWindow();
mainWindow.loadFile('index.html');

// 在某个事件或条件下发送消息
mainWindow.webContents.send('messageToRenderer', 'Hello from Main!');
```

### 3. 小节
不管是通过 `event.sender.send()` 还是 `BrowserWindow.webContents.send` 的方式，如果你只是单窗口的数据通信，那么本质上是没什么差异的。

但是如果你想要发送一些数据到特定的窗口，那么你可以直接使用 `BrowserWindow.webContents.send` 这种方式。



## 渲染进程 -> 渲染进程

默认情况下，渲染进程和渲染进程之间是无法直接进行通信的：

<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d04e7422d6d4059b1b5585eaf970d63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=562&s=71649&e=png&b=ffffff" alt="image.png"  /></p>

既然说的是无法直接通信，那么肯定还有一些“曲线救国”的方式。


### 1. 利用主进程作为中间人

首先，需要在主进程注册一个事件监听程序，监听来自渲染进程的事件：

```js
// main.js

// window 1
function createWindow1 () {
  window1 = new BrowserWindow({width: 800,height: 600})
  window1.loadURL('window1.html')
  window1.on('closed', function () {
     window1 = null
  })
  return window1
}

// window 2
function createWindow2 () {
  window2 = new BrowserWindow({width: 800, height: 600})
  window2.loadURL('window2.html')
  window2.on('closed', function () {
    window2 = null
  })
  return window2
}

app.on('ready', () => {
  createWindow1();
  createWindow2();
  ipcMain.on('win1-msg', (event, arg) => {
    // 这条消息来自 window 1
    console.log("name inside main process is: ", arg); 
    // 发送给 window 2 的消息.
    window2.webContents.send( 'forWin2', arg );
  });
})
```

然后在 `window2` 窗口建立一个监听事件：

```js
ipcRenderer.on('forWin2', function (event, arg){
  console.log(arg);
});
```

这样，`window1` 发送的 `win1-msg` 事件，就可以传输到 `window2`：

```js
ipcRenderer.send('win1-msg', 'msg from win1');
```



### 2. 使用 MessagePort

上面的传输方式虽然可以实现渲染进程之间的通信，但是非常依赖主进程，写起来也比较麻烦，那有什么不依赖于主进程的方式嘛？那当然也是有的，那就是 [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)。

`MessagePort` 并不是 Electron 提供的能力，而是基于 MDN 的 Web 标准 API，这意味着它可以在渲染进程直接创建。同时 Electron 提供了 node.js 侧的实现，所以它也能在主进程创建。

接下来，我们将通过一个示例来描述如何通过 `MessagePort` 来实现渲染进程之间的通信。


#### 2.1 主进程中创建 `MessagePort`

```js
import { BrowserWindow, app, MessageChannelMain } from 'electron';

app.whenReady().then(async () => {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadMain.js'
    }
  })

  const secondaryWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadSecondary.js'
    }
  })

  // 建立通道
  const { port1, port2 } = new MessageChannelMain()

  // webContents准备就绪后，使用postMessage向每个webContents发送一个端口。
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })
})
```

实例化 `MessageChannel` 类之后，就产生了两个 `port`： `port1 和 port2`。接下来只要让 `渲染进程1` 拿到 `port1`、`渲染进程2` 拿到 `port2`，那么现在这两个进程就可以通过 `port.onmessage` 和 `port.postMessage` 来收发彼此间的消息了。如下：

```js
// mainWindow
port1.onmessage = (event) => {
  console.log('received result:', event.data)
};
port1.postMessage('我是渲染进程一发送的消息');

// secondaryWindow
port2.onmessage = (event) => {
  console.log('received result:', event.data)
};
port2.postMessage('我是渲染进程二发送的消息');
```


#### 2.2 渲染进程中获取 port

有了上面的知识，我们最重要的任务就是需要获取主进程中创建的 `port` 对象，要做的是在你的预加载脚本（preload.js）中通过 IPC 接收 `port`，并设置相应的监听器。

```js
// preloadMain.js
// preloadSecondary.js
const { ipcRenderer } = require('electron')

ipcRenderer.on('port', e => {
  // 接收到端口，使其全局可用。
  window.electronMessagePort = e.ports[0]

  window.electronMessagePort.onmessage = messageEvent => {
    // 处理消息
  }
})
```

#### 2.3 消息通信

通过上面的一些操作后，就可以在应用程序的任何地方调用 `postMessage` 方法向另一个渲染进程发送消息。

```js
// mainWindow renderer.js
// 在 renderer 的任何地方都可以调用 postMessage 向另一个进程发送消息
window.electronMessagePort.postMessage('ping')
```

## 总结

本小节，我们从 IPC 的历史开始逐步介绍了 Electron IPC 的基本概念，以及 Electron IPC 如何完成通信。希望能让你对 Electron IPC 通信的知识有更深刻的理解。

> 本小节的渲染进程和渲染进程通信其实还有另一种方式，那就是 `ipcRenderer.sendTo`，不过在 `Electron` 最新的版本中已经被废弃了，所以没有做介绍，有兴趣了解这块的，可以参考阅读这篇文章：https://juejin.cn/post/7078476722223448095 。







