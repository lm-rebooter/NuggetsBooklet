在上一节中我们讲解了一个线上 Electron 应用应该具备哪些特征，这一节我们着重讲解如何分析调试线上 Electron 应用。

- 首先我们要知道一个按默认配置生成的 Electron 应用是不具备源码保护能力的，所以我们先讲解如何`解析`线上 Electron 应用的业务代码。
- 虽然我们可以解析出 Electron 应用的业务代码，但这些代码一般都是压缩过的，可读性比较差，所以接着我们会分析如何`调试`线上应用的业务代码。
- 最后我们再介绍如何分析 Electron 应用的`崩溃报告`，以应对一些难以调试的问题。

## 业务代码解析

默认情况下，`electron-builder` 会把开发者编写的 HTML、CSS 和 JavaScript 代码以及相关的资源打包成 asar 文件嵌入到安装包中（就是安装目录下的 app.asar 文件），再分发给用户。

前面我们介绍了 asar 是一种特殊的存档格式，它可以把大批的文件以一种无损、无压缩的方式连接在一起，并提供随机访问支持。

开发者可以通过如下命令全局安装 `asar` 工具（全局安装此工具是非常有必要的，以便你能随时分析生产环境下 Electron 应用的源码）：

```
> npm install asar -g
```

安装好 asar 工具后，打开你 Electron 应用的安装目录，在 resources 子目录下找到 app.asar 文件，通过如下命令列出该文件内部包含的文件信息：

```
> asar list app.asar
```

如果我们想看 app.asar 包中的某个文件的内容，我们可以通过如下命令把该文件释放出来：

```
> asar ef app.asar entry.js
```

这样 entry.js 就会出现在 app.asar 同级目录下了，如果释放文件失败，提示如下错误：

```
internal/fs/utils.js:307
throw err;
Error: EPERM: operation not permitted, open 'entry.js'
90m    at Object.openSync (fs.js:476:3)39m
90m    at Object.writeFileSync (fs.js:1467:35)39m
```

这往往是**因为你的应用程序正在运行，app.asar 文件被占用了导致的**，退出应用程序再次尝试，如果还是无法释放目标文件，可以考虑把 app.asar 拷贝到另一个目录下再释放。

如果你希望一次性把 app.asar 内的文件全部释放出来，可以使用如下指令：

```
> asar e app.asar
```

更多 asar 工具的指令请参阅[该链接内容](https://github.com/electron/asar#usage) 。

## 生产环境调试

把 asar 文件中的业务代码解析出来之后，你会发现这些业务代码都是压缩过的，可读性比较差，要想通过这些代码文件分析线上应用的业务逻辑是非常困难的，所以最好还是能想办法调试这些业务代码才行。

Node.js 6.3 以前 IDE 开发者都使用 [node-inspector](https://github.com/node-inspector/node-inspector) 作为调试 Node.js 代码的支持库，然而自 6.3 版本发布以来，Node.js 就内置了基于谷歌浏览器开发者工具的调试器，这个内置的调试器是谷歌 V8 团队开发的，提供了很多 node-inspector 难以实现的能力，比如长堆栈跟踪和异步堆栈跟踪等。

我们可以通过如下命令启动一个线上 Electron 应用：

```
D:\\yourApp\\yourProductName.exe --inspect=7676 --remote-debugging-port=7878
```

**这个命令在启动 Electron 应用程序时，为目标程序指定了两个端口号，一个是通过--inspect 指令指定的，一个是通过--remote-debugging-port 指令指定的**，接下来要根据这两个端口号获取调试地址。

打开谷歌浏览器，访问如下两个地址：

```
http://127.0.0.1:7676/json
http://127.0.0.1:7878/json
```

这两个地址均会响应 JSON 字符串，这是因为在我们启动目标程序后，**Electron 在后台为我们创建了对应的用于调试的 HTTP 服务**，响应结果一个对应着主进程的调试信息，示例如下：

```json
{
  "description": "node.js instance",
  "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=127.0.0.1:7676/85ac5529-d1a5-49b3-8655-f71c7c198b71",
  "devtoolsFrontendUrlCompat": "devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:7676/85ac5529-d1a5-49b3-8655-f71c7c198b71",
  "faviconUrl": "https://nodejs.org/static/images/favicons/favicon.ico",
  "id": "85ac5529-d1a5-49b3-8655-f71c7c198b71",
  "title": "Node.js[25204]",
  "type": "node",
  "url": "file://",
  "webSocketDebuggerUrl": "ws://127.0.0.1:7676/85ac5529-d1a5-49b3-8655-f71c7c198b71"
}
```

另一个对应着渲染进程的调试信息，示例如下：

```json
{
  "description": "",
  "devtoolsFrontendUrl": "/devtools/inspector.html?ws=127.0.0.1:7878/devtools/page/AFCF98D56EE8462C3D8E52FA99C02F91",
  "id": "AFCF98D56EE8462C3D8E52FA99C02F91",
  "title": "Vite App",
  "type": "page",
  "url": "app://./index.html",
  "webSocketDebuggerUrl": "ws://127.0.0.1:7878/devtools/page/AFCF98D56EE8462C3D8E52FA99C02F91"
}
```

这两个响应中最重要的信息就是 `devtoolsFrontendUrl`，得到此信息后，要把它们转换为如下的格式：

```
devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=127.0.0.1:7676/e9c9b139-a606-4703-be3f-f4ffc496a6aa

devtools://devtools/bundled/inspector.html?ws=127.0.0.1:7878/devtools/page/33DFD3D347C1B575DC6361CC61ABAEDE
```

这个转换过程就是一个简单的字符串替换，如果你嫌麻烦也可以用如下代码进行替换：

```js
devtoolsFrontendUrl.replace(/^\/devtools/, "devtools://devtools/bundled");
```

把转换后的地址放入谷歌浏览器中，将得到如下图所示结果，你可以试着在对应的源文件中下一个断点试试看。


![15.1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95a5035d03a84c07a89dd537f0bb44cc~tplv-k3u1fbpfcp-watermark.image?)

如果目标应用的源码是压缩过的，可以尝试**点击调试器右下角的 {} 按钮美化代码**，查看美化后的代码，这样就可以更方便地下断点调试了，如下图所示：


![15.2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62f00e2b25aa4c93ad524f68a5522e51~tplv-k3u1fbpfcp-watermark.image?)

通过这种方法只能调试市面上一部分基于 Electron 开发的应用，并不是所有的基于 Electron 开发的应用都能使用这种方法调试。

这并不稀奇，应用的作者有很多手段来规避自己的应用程序被调试，比如：**在应用启动时先检查一下应用启动时的输入参数（可以通过 process.argv 获取），如果输入参数中包含--inspect 或--remote-debugging-port 等参数，则马上退出应用，不给恶意调试者可乘的时机**； 又或者把 JavaScript 代码编译成 V8 字节码再分发给用户，这样恶意调试者即使打开了调试器，也无法调试源码；类似这些攻防手段还有很多，此处我们不再多做介绍了。

## 分析崩溃报告

分析调试业务代码主要目的还是追踪业务代码的问题，但有些问题是不会给我们追踪的机会的，比如那些偶发的、一旦出现应用程序就立即 Crash 的问题。要解决这些问题我们就要掌握分析 Electron 应用崩溃报告的知识。

如果你希望你的应用程序崩溃时，自动保存崩溃报告文件，那么你就要在你的应用程序中使用如下代码收集崩溃报告：

```ts
import { crashReporter } from "electron";
crashReporter.start({ submitURL: "", uploadToServer: false });
```

**有了这段代码，当应用程序崩溃时，就会产生一个.dmp 扩展名结尾的文件**（存放于 `C:\Users\[yourOsUserName]\AppData\Roaming\[yourAppName]\Crashpad`），接下来我们就分析一下这个崩溃报告。

首先需要安装 WinDbg 调试工具，如果你在安装 Windows 10 SDK 时勾选了 Debugging Tools For Windows，那么 WinDbg 已经在如下目录内了，直接使用即可：

```
C:\Program Files (x86)\Windows Kits\10\Debuggers\x86
```

如果没有，那么你可以在如下地址下载安装：

```
https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools
```

安装完成后，通过菜单 File->Symbol File Path 打开符号路径设置窗口，输入如下信息：

```
SRV*d:\code\symbols\*https://msdl.microsoft.com/download/symbols;SRV*d:\code\symbols\*https://symbols.electronjs.org
```

这段配置中有三个关键信息，依次是符号文件的缓存路径、Windows 操作系统关键 dll 的符号服务器和 Electron 的符号服务器。

设置完符号服务器之后，通过菜单 File->Open Crash Dump 打开我们刚刚生成的崩溃报告，接着就等待 WinDbg 加载对应的符号（**WinDbg 会通过 Electron 符号服务器下载与崩溃报告对应的 Electron 版本的符号文件，并保存在缓存目录中以备下次使用**）。

接着再在命令窗口的底部输入`!analyze -v `指令开始分析崩溃报告（注意此时需要全程具备良好的网络环境）。

加载完成后 WinDbg 会在窗口中显示崩溃报告内部的信息，这里我们截取一段供小伙伴们分析：

```
EXCEPTION_RECORD:  (.exr -1)
ExceptionAddress: 00007ff725996fac (electron!node::AsyncResource::CallbackScope::~CallbackScope+0x000000000013227c)
   ExceptionCode: c0000005 (Access violation)
  ExceptionFlags: 00000000
NumberParameters: 2
   Parameter[0]: 0000000000000001
   Parameter[1]: 0000000000000000
Attempt to write to address 0000000000000000
PROCESS_NAME:  electron.exe
WRITE_ADDRESS:  0000000000000000
ERROR_CODE: (NTSTATUS) 0xc0000005 - 0x%p            0x%p                    %s
EXCEPTION_CODE_STR:  c0000005
EXCEPTION_PARAMETER1:  0000000000000001
EXCEPTION_PARAMETER2:  0000000000000000

STACK_TEXT:
00000053`0abf82f0 00007ff7`275a0513 : 00001c69`00000000 00000053`0abf84d8 00008d04`5e11c7b4 00001c69`00000000 : electron!node::AsyncResource::CallbackScope::~CallbackScope+0x13227c
00000053`0abf84a0 00007ff7`275a0121 : 00008d04`5e11c7a4 00000053`0abf8690 00007ff7`2b7e55c0 0000452c`0087b1bb : electron!v8::Object::SlowGetInternalField+0x7f3
00000053`0abf84d0 00007ff7`26cacd53 : 00000000`00000000 00007ff7`26c1f112 00000000`00000000 00000000`06b96722 : electron!v8::Object::SlowGetInternalField+0x401
00000053`0abfcfe0 00007ff7`26652c61 : 00000000`00000000 00001c69`08042229 00001c69`c0cdb000 00001c69`08282125 : electron!v8::V8::ToLocalEmpty+0x2193
00000053`0abfd010 00007ff7`27720c24 : 00000000`00000000 00000000`00000000 00000053`0abfd068 00000000`00000000 : electron!v8::Value::ToString+0x2eef1
00000053`0abfd050 00007ff7`251fa720 : 00000000`00000000 00000000`00000000 00000000`00000000 00001c69`a5e82115 : electron!v8::internal::TickSample::Init+0x11a24
00000053`0abfd0d0 00007ff7`25ae571c : 00000000`00000000 00000053`0abfd218 00001c69`a5e80000 00000000`00000002 : electron!v8::Isolate::CreateParams::~CreateParams+0xce60
00000053`0abfd130 00001c69`000c6308 : 00000000`0d72ce44 00001c69`08942dd9 00000000`06b96722 00001c69`08582e0d : electron!v8_inspector::protocol::Binary::operator=+0x6f12c
00000053`0abfd188 00000000`0d72ce44 : 00001c69`08942dd9 00000000`06b96722 00001c69`08582e0d 00000000`0d72ce44 : 0x00001c69`000c6308
00000053`0abfd190 00001c69`08942dd9 : 00000000`06b96722 00001c69`08582e0d 00000000`0d72ce44 00001c69`0946344d : 0xd72ce44
00000053`0abfd198 00000000`06b96722 : 00001c69`08582e0d 00000000`0d72ce44 00001c69`0946344d 00001c69`088c2349 : 0x00001c69`08942dd9
00000053`0abfd1a0 00001c69`08582e0d : 00000000`0d72ce44 00001c69`0946344d 00001c69`088c2349 00001c69`08582e0d : 0x6b96722
00000053`0abfd1a8 00000000`0d72ce44 : 00001c69`0946344d 00001c69`088c2349 00001c69`08582e0d 00001c69`083d6e61 : 0x00001c69`08582e0d
00000053`0abfd1b0 00001c69`0946344d : 00001c69`088c2349 00001c69`08582e0d 00001c69`083d6e61 00001c69`08584a49 : 0xd72ce44
00000053`0abfd1b8 00001c69`088c2349 : 00001c69`08582e0d 00001c69`083d6e61 00001c69`08584a49 00000000`0000069c : 0x00001c69`0946344d
00000053`0abfd1c0 00001c69`08582e0d : 00001c69`083d6e61 00001c69`08584a49 00000000`0000069c 00000000`0000645c : 0x00001c69`088c2349
00000053`0abfd1c8 00001c69`083d6e61 : 00001c69`08584a49 00000000`0000069c 00000000`0000645c 00001c69`08942dd9 : 0x00001c69`08582e0d
00000053`0abfd1d0 00001c69`08584a49 : 00000000`0000069c 00000000`0000645c 00001c69`08942dd9 00000000`000000e8 : 0x00001c69`083d6e61
00000053`0abfd1d8 00000000`0000069c : 00000000`0000645c 00001c69`08942dd9 00000000`000000e8 00001c69`08605fed : 0x00001c69`08584a49
00000053`0abfd1e0 00000000`0000645c : 00001c69`08942dd9 00000000`000000e8 00001c69`08605fed 00000000`00000000 : 0x69c
00000053`0abfd1e8 00001c69`08942dd9 : 00000000`000000e8 00001c69`08605fed 00000000`00000000 00001c69`08942de9 : 0x645c
00000053`0abfd1f0 00000000`000000e8 : 00001c69`08605fed 00000000`00000000 00001c69`08942de9 00001c69`088c2349 : 0x00001c69`08942dd9
00000053`0abfd1f8 00001c69`08605fed : 00000000`00000000 00001c69`08942de9 00001c69`088c2349 00000053`0abfd2c8 : 0xe8
00000053`0abfd200 00000000`00000000 : 00001c69`08942de9 00001c69`088c2349 00000053`0abfd2c8 00007ff7`25a7ed0f : 0x00001c69`08605fed


SYMBOL_NAME:  electron!node::AsyncResource::CallbackScope::~CallbackScope+13227c
MODULE_NAME: electron
IMAGE_NAME:  electron.exe
STACK_COMMAND:  ~0s ; .ecxr ; kb
FAILURE_BUCKET_ID:  NULL_POINTER_WRITE_c0000005_electron.exe!node::AsyncResource::CallbackScope::_CallbackScope
OSPLATFORM_TYPE:  x64
OSNAME:  Windows 10
FAILURE_ID_HASH:  {3f18c3a4-c6fc-f39e-d02b-f38f7b21394d}
Followup:     MachineOwner
```

上面这段错误信息分为两部分，一部分是 `EXCEPTION_RECORD` 节，其中 `ExceptionAddress` 是崩溃产生时的代码执行地址，这里面的信息为：错误发生在一个异步回调方法内（electron!node::AsyncResource::CallbackScope），`ExceptionCode` 是 Windows API 中 `GetLastError` 获取到的错误码（c0000005 Access violation，访问被禁止），Windows 定义了很多错误码，如果你在调试崩溃报告时，遇到了不一样的错误码，可以在这个页面查询错误码的具体含义：https://docs.microsoft.com/en-us/windows/win32/debug/system-error-codes 。

接下来还有一行错误：`Attempt to write to address 0000000000000000`，说明程序试图在某个内存地址写入信息时出错。

另一部分是 `STACK_TEXT` 节，这个节显示的是堆栈信息，也就是崩溃前 C++ 代码的执行情况，在这里我们可以看到更明确的错误现场，其中有 7 行是与 V8 引擎执行有关的信息，说明代码发生在 JavaScript 脚本执行期间。

这些就是这个崩溃报告中最有用的信息，如你所见，并没有定位到具体的代码，因为**我们的代码是由 V8 引擎解释执行的，而且在 V8 执行我们的代码前，还对我们的代码做了很多优化工作**，我们只能知道 V8 在执行我们代码时何时出了错，并不能准确地知道我们的代码哪一行出了错。

使用 WinDbg 分析崩溃报告设置比较烦琐，为此社区内有人（Electron 贡献者之一）专门开发了一个崩溃报告分析工具：[electron-minidump](https://github.com/nornagon/electron-minidump) 。

这个工具会自动帮开发者下载符号文件，执行分析指令。你如果感兴趣的话，可以安装尝试，这里就不再赘述了（注意安装此工具时亦应保持良好的网络状态，因为它会从谷歌源码服务器克隆一个项目）。

## 总结

本节我们介绍了如何分析调试线上 Electron 应用的一些知识，

首先我带领大家把 Electron 应用中的 app.asar 解析成业务代码文件。

接着我们讲解了如何通过命令行参数获取调试地址（包括渲染进程的调试地址和主进程的调试地址），以用于调试业务代码。

最后我们介绍了如何收集崩溃报告和使用 WinDbg 分析崩溃报告的知识。

这些知识非常重要，是让我们的产品变得强大、健壮、赢得用户口碑的必备知识。
