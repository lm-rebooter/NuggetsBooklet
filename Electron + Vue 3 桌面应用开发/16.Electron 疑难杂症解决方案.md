开发普通的桌面应用单凭我们前面介绍的 Electron 和 Vue 知识或许已经足够了，但我们应该知道桌面应用开发所涉及的知识浩如烟海，即使你掌握了所有 Electron 和 Vue 的知识也还是远远不够。本节我们就将介绍一些特殊的需求、问题的处理方案，让你知道这个领域有很多有趣的问题等待我们去解决。

本节中我们通过“四个课题”来打开开发者的眼界：首先我们讲解如何把窗口钉在桌面上，其次介绍如何重新上传文件，接着再分析如何监控内存消耗，最后是如何模拟弱网环境。

## 把窗口钉在桌面上

有一些特殊的应用，可以把窗口“钉”在桌面上，比如：桌面日历，当用户点击“显示桌面”时，所有的窗口都会隐藏，桌面会显示给用户，但桌面日历窗口，可以不被隐藏，依然显示在桌面上，就好像被“钉”在桌面上一样。

很显然 Electron 是没有类似的能力的，开发者要想实现这样的功能，可能最先想到的是使用原生模块来调用操作系统的 API 来完成这样的功能。

这确实是最直接的解决问题的办法，这里只简单介绍一下思路：

1. 得到当前窗口的句柄；
1. 找到桌面窗口的窗口句柄（没错，桌面也是一个窗口）；
1. 把当前窗口设置为桌面窗口的子窗口；
1. 把当前窗口设置为最底层窗口（zOrder）；
1. 不允许改变当前窗口的层级（zOrder）。

更方便的做法是使用这个开源库：[electget](https://github.com/lowfront/electget) 。

为你的项目引入这个库，然后在主进程中执行如下代码：

```ts
// import electget from "electget";
electget.preventFromAeroPeek(win);
electget.preventFromShowDesktop(win);
electget.moveToBottom(win);
```

这时你的窗口就可以“钉”在桌面上了。为了更完美地满足需求，我们最好监控一下窗口聚焦事件，当用户聚焦窗口时，把窗口移至最底层，如下代码所示：

```ts
app.on("browser-window-focus", (e, win: BrowserWindow) => {
  if (win.id != mainWindow.id) return;
  electget.moveToBottom(mainWindow);
});
```

这样做可以避免在用户与窗口交互后，被钉住的窗口浮到其他窗口之上。

> 这个窗口虽然被钉在桌面上了，但它还是显示在桌面图标之上的，如果你想要把窗口放置在桌面图标之下（桌面背景之上），那么你需要使用更复杂的技术。可以参考这个开源项目 [electron-as-wallpaper](https://github.com/meslzy/electron-as-wallpaper) 和我写的[这篇文章](https://zhuanlan.zhihu.com/p/580281260)，此技术常用于开发动态桌面类产品。（此技术用到了操作系统未公开的 API，兼容性并不是很好。）

我们之所以介绍这个库，主要目的并不是介绍它的能力，而是介绍它的实现方式，它并不能算一个真正的原生模块，它是基于 [ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi) 开发的。开发者可以基于这个库使用纯 JavaScript 加载和调用动态库。也就是说，开发者可以使用 JavaScript 访问操作系统动态链接库，有了它开发者就不需要编写任何 C++ 代码完成原生功能了。

```ts
import ffi from "ffi-napi";
const user32 = new ffi.Library("user32", { GetDesktopWindow: ["ulong", []] });
const desktopHWnd = user32.GetDesktopWindow();
```

上面的代码就是使用`ffi-napi`模块获取桌面窗口的窗口句柄的示例代码。

本示例的代码请通过如下地址自行下载：

- [源码仓储](https://github.com/xland/51richeng)

## 文件重新上传

如果你的桌面应用涉及到文件上传的功能，而且上传的文件有可能会很大的话，那么大概率你需要开发文件重新上传的功能。

当网络环境不好或者用户不小心退出了应用，上传过程就会中断，当上传环境恢复后，产品应该可以重新上传之前没上传成功的文件。

我们先来介绍有问题的方案，开发者在上传文件之前，把文件路径记录下来，重新上传文件时，直接用文件路径构造一个 File 对象，然后再上传到服务端。

使用文件路径构造 File 对象的代码如下所示：

```ts
let extname = path.extname(filePath);
let buffer = await fs.promises.readFile(filePath);
let file = new window.File([Uint8Array.from(buffer)], path.basename(filePath), {
  type: this.ext2type[extname], //mimetype类似"image/png"
});
```

这种方法要把整个文件的内容都读出来放到 buffer 里，小文件还好，**遇到大文件就极其消耗用户的内存了，而且 V8 并不会及时释放这块内存**。

所以，更好的方案是一块一块读文件的内容，然后再附加到 POST 请求内。显然这样的 POST 请求要自行构建，可以参考 [W3C 的文档](https://xhr.spec.whatwg.org/#the-formdata-interface) 。

有一个开源库—— [form-data](https://github.com/form-data/form-data)，可以帮我们大大简化这方面的工作。

把 form-data 引入工程内后，可以使用如下代码构造上传表单，用这种方法上传文件就是分片上传的。

```js
var FormData = require("form-data");
var fs = require("fs");
var form = new FormData();
form.append("yourFile", fs.createReadStream("/your/file/path.7z"));
form.submit("http://yourFileService.com/upload");
```

如果你要开发取消上传、显示文件上传进度等功能，可以参考如下代码：

```ts
new Promise((resolve, reject) => {
  let req = formData.submit(params, (err, res) => {
    const body = [];
    res.on("data", (chunk) => {
      body.push(chunk);
    });
    res.on("end", () => {
      let resString = Buffer.concat(body).toString();
      let resObj = JSON.parse(resString);
      eventer.off("setXhrAbort", abort);
      resolve(res);
    });
  });
  req.on("socket", () =>
    req.socket.on("drain", () => {
      let percent = parseInt((req.socket.bytesWritten / file.size) * 100);
      //此处显示文件上传进度的逻辑
    })
  );
  let abort = () => {
    req.destroy();
    //调用此方法结束文件上传
  };
});
```

formData.submit 方法内部执行的其实是 Node.js 的 http.request 方法，返回的是 http.ClientRequest 对象，关于这个对象的详细介绍，请参考[该官方文档](https://nodejs.org/dist/latest-v16.x/docs/api/http.html#class-httpclientrequest) 。

## 内存消耗监控

就像我们前面说的，如果应用突然内存消耗暴涨又没有及时释放的话，我们该如何及时发现这种问题呢？Chromium 为开发者提供了内存监控工具，Electron 也因此具备此能力，打开 Electron 的开发者调试工具，切换到 Memory 面板，如下图所示：


![neicun.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1d5374d05c44bbf9d25edffb57c36a3~tplv-k3u1fbpfcp-watermark.image?)

面板中提供了三种监控内存的方式。

- **Heap snapshot**：用于打印内存堆快照，堆快照用于分析页面 JavaScript 对象和相关 dom 节点之间的内存分布情况。
- **Allocation instrumentation on timeline**：用于从时间维度观察内存的变化情况。
- **Allocation sampling**：用于采样内存分配信息，由于其开销较小，可以用于长时间记录内存的变化情况。

选择 Heap snapshot，并点击 Take snapshot 按钮，截取当前应用内存堆栈的快照信息，生成的快照信息可以通过三个维度查看。

- **Summary**：以构造函数分类显示堆栈使用情况。
- **Containment**：以 GC 路径（深度）分类显示堆栈使用情况（较少使用）。
- **Statistics**：以饼状图显示内存占用信息。

把界面切换到 Summary 模式，如下图所示：


![neicun2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/290027cb66184818b00b00f65cf25032~tplv-k3u1fbpfcp-watermark.image?)

此界面包含以下四列内容。

- **Constructor**：构造函数名，例如 Object、Module、Socket、Array、string 等，构造函数名后 `x21210` 代表着此行信息存在着 21210 个该类型的实例。
- **Distance**：指当前对象到根对象的距离，对于 Electron 应用来说，根对象有可能是 window 对象，也有可能是 global 对象。此值越大，说明引用层次越深。
- **Shallow Size**：指对象自身的大小，不包括它所引用的对象，也就是该对象自有的布尔类型、数字类型和字符串类型所占内存之和。
- **Retained Size**：指对象的总大小，包括它所引用的对象的大小，同样也是该对象被 GC 之后所能回收的内存的大小。

一般情况下，开发者会依据 Retained Size 降序展示以分析内存消耗情况。

选中一行内存消耗较高的记录后，视图的下方将会出现与这行内存占用有关的业务逻辑信息，开发者可以通过此视图内的链接切换到业务代码中观察哪行代码导致此处内存消耗增加了。

需要注意的是 Constructor 列中，值为（closure）的项，这里记录着因闭包函数引用而未被释放的内存，这类内存泄漏问题是开发时最容易忽略、调优时最难发现的问题。开发者应尤为注意。

## 模拟弱网环境

对于一些需要在极端环境下运行的应用程序来说，网络环境状况是否会影响应用程序的正常运行是测试过程中的一项重要工作。Chromium 具备模拟弱网的能力，打开开发者工具，切换到 Network 标签页。

![ruowang.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/234d1ec1a67b45d4bde302d09556b022~tplv-k3u1fbpfcp-watermark.image?)

在 Network throttling 处选择 Slow 3G，可以使 Chromium 模拟较慢的 3G 移动网络，建议做此设置前先把 Caching 项禁用，避免 Chromium 加载缓存的内容，而不去请求网络。

如果你需要更精准地控制应用的上行、下行速率，可以使用 session 对象提供的 API，代码如下所示：

```ts
window.webContents.session.enableNetworkEmulation({
  latency: 500,
  downloadThroughput: 6400,
  uploadThroughput: 6400,
});
```

这段代码通过 session 对象的 enableNetworkEmulation 方法模拟 50kbps 的弱网环境。

开发者还可以使用 WebContents.debugger 对象提供的 API 来完成这项工作，代码如下所示：

```ts
const dbg = win.webContents.debugger;
dbg.attach();
await dbg.sendCommand("Network.enable");
await dbg.sendCommand("Network.emulateNetworkConditions", {
  latency: 500,
  downloadThroughput: 6400,
  uploadThroughput: 6400,
});
```

这种方案是使用 Chromium 为调试器定义的协议（Chrome DevTools Protocol）来完成弱网模拟的，Chrome DevTools Protocol 协议还有很多其他的 API，功能非常强大，详情请参考：[Chrome DevTools Protocol 官方文档](https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-emulateNetworkConditions) 。

## 总结

本节的主要目的不是带领大家解决几个疑难杂症，而是教会大家`用更开阔的视野看待桌面应用开发`。

首先我们介绍了如何把窗口钉在桌面上，这里我们介绍了 electget 库，以及 electget 库使用的 ffi-napi 库，教会大家如何不用 C++ 也可以调用操作系统的 API。

接着我们介绍了如何实现文件重新上传的功能，这个看似简单的功能其实隐藏着一个“重要”的陷阱：内存暴增且无法及时释放，此处我们讲解了如何使用 form-data 库以避免误入陷阱。
