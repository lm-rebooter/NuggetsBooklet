我们知道 JavaScript 无论是在浏览器中运行、还是在 Node.js 中运行都是`单线程`运行的，这一特性导致 JavaScript 不适合处理 CPU 密集型业务，虽然 Node.js 对常见的一些 CPU 密集型的业务进行了封装，比如加密解密、文件读写等，但我们还是会碰到一些特殊的 CPU 密集型业务需求，比如编码解码、数据分析、科学计算等。

为此 Node.js 提供了一个支持方案，允许开发者使用 C、C++ 等语言开发原生模块。并且遵循此方案开发出的原生模块可以像普通的 Node.js 模块一样通过 require() 函数加载，并使用 JavaScript 访问模块提供的 API。

除此之外，还有一些其他的原因，使我们希望 Node.js 具备原生模块的能力，比如以下原因。

- **性能提升**：JavaScript 毕竟是解释型语言，相对于系统级语言来说性能上还是略有不足。
- **节约成本**：有很多现成的 C/C++ 项目，在 Node.js 项目中直接复用这些项目可以节约很多开发成本。
- **能力拓展**：Node.js 不是万能的，比如枚举桌面窗口句柄、访问系统驱动信息等需求，也需要 C/C++ 的能力来辅助完成。

我们知道 Electron 框架内置了 Node.js，所以 Node.js 面临的问题，Electron 也会面临；Node.js 具备的能力，Electron 同样也具备。接下来，我们就介绍一下如何在 Electron 应用中使用原生模块。

## 搭建原生模块开发环境

目前开发者**一般都是基于 Node-API 开发 Node.js 的原生模块**的，Node-API 专门用于构建原生模块，它独立于底层 JavaScript 运行时，并作为 Node.js 的一部分进行维护。它是跨 Node.js 版本的应用程序二进制接口（Application Binary Interface，ABI）。它旨在将原生模块与底层实现隔离开，并允许为某个 Node.js 版本编译的模块在更高版本的 Node.js 上运行而无需重新编译。也就是说**不同版本的 Node.js 使用同样的接口为原生模块提供服务，这些接口是 ABI 化的，只要 ABI 的版本号一致，编译好的原生模块就可以直接使用，而不需要重新编译**。

基于 Node-API 开发原生模块仍存在两种方式。一种方式就是使用 C 语言开发，由于 Node-API 就是用 C 语言封装的，所以这种方法更为直接，但由于 C 语言过于简单直接，语言特性较少，所以开发起来显得非常麻烦。

另一种方式是基于 [node-addon-api 项目](https://github.com/nodejs/node-addon-api)使用 C++ 语言开发，node-addon-api 项目是对 Node-API 的 C++ 再包装，这种方式可以`精简很多代码`，接下来我们就基于这个项目来开发一个 Electron 的原生模块。

首先，需要全局安装 node-gyp 工具，它是专门为构建开发、编译原生模块环境而生的跨平台命令行工具。

```
npm install -g node-gyp
```

接着，新建一个 Node.js 项目，并通过如下指令安装 node-addon-api 依赖：

```
npm install node-addon-api
```

然后，创建一个原生模块的配置文件 binding.gyp，如下代码所示：

```
//src\native\binding.gyp
{
  "targets": [
    {
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "target_name": "addon",
      "include_dirs": ["<!(node -p \"require('node-addon-api').include_dir\")"],
      "sources": ["export.cc"],
      "conditions": [
        [
          'OS=="mac"',
          {
            "sources": ["clipboard.mm"],
            "link_settings": {
              "libraries": ["-framework Cocoa", "-framework CoreFoundation"]
            },
            "xcode_settings": {
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
              "CLANG_ENABLE_OBJC_ARC": "YES",
              "OTHER_CFLAGS": ["-ObjC++", "-std=c++17"]
            }
          }
        ],
        [
          'OS=="win"',
          {
            "sources": ["clipboard.cc"],
            "libraries": ["Shlwapi.lib", "Shcore.lib"],
            "msvs_settings": {
              "VCCLCompilerTool": {
                "AdditionalOptions": ["/std:c++17"]
              }
            }
          }
        ]
      ]
    }
  ]
}
```

其中 `include_dirs` 配置 `node-addon-api` 项目提供的 C++ 头文件所在路径，`defines、cflags_cc!`和 `cflags!`起到禁用 C++ 异常的作用（注意，如果开发者选择禁用 C++ 异常，那么 node-addon-api 框架将不再为开发者处理异常，开发者就需要自己检查异常了），`sources` 指向这个原生模块的入口文件，`target_name` 为原生模块的名称。`conditions` 配置节的内容我们稍后再解释。

有了这个配置文件，接下去我们就可以编写原生模块的 C++ 代码了。

## 开发原生模块读取剪切板内的文件路径

我们知道 **Electron 公开的剪切板 API 是无法读取剪切板内多个文件的文件路径的**，现在我们就开发一个原生模块来补全 Electron 在这方面的不足。

我们先创建原生模块的入口文件，代码如下：

```c++
//src\native\export.cc
#include <napi.h>
#include <tuple>
#include "clipboard.h"

Napi::Array ReadFilePathsJs(const Napi::CallbackInfo &info)
{
    auto env = info.Env();
    const auto file_paths = ReadFilePaths();
    auto result = Napi::Array::New(env, file_paths.size());
    for (size_t i = 0; i != file_paths.size(); ++i)
    {
        result.Set(i, file_paths[i]);
    }
    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("readFilePaths", Napi::Function::New(env, ReadFilePathsJs));
    return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
```

`NODE_API_MODULE` 这个宏方法定义此原生模块的入口函数，一旦 Node.js 加载该模块时，将执行 Init 方法，`NODE_GYP_MODULE_NAME` 宏展开后为编译配置文件 binding.gyp 中的 target_name。

`Init` 方法是这个模块的入口函数，这个函数包含两个参数（Node.js 调用此函数时会输入这两个参数），第一个是 JavaScript 运行时环境对象，第二个是模块的导出对象（也就是 module.exports），**我们可以给这个对象设置属性，以导出我们想要暴露给外部的内容**，此处我们导出了 ReadFilePathsJs 方法，当外部调用此方法时，将执行 ReadFilePathsJs 函数。入口函数退出时应把 exports 对象返回给调用方。

ReadFilePathsJs 方法执行时调用方会传入一个 `CallbackInfo` 类型的参数，它是一个由 Node.js 传入的对象，该对象包含 JavaScript 调用此方法时的输入参数，**可以通过这个对象的 Env 方法获取 JavaScript 运行时环境对象**。

在 ReadFilePathsJs 方法内，我们调用了 ReadFilePaths 方法，这个方法是在 clipboard.h.h 中定义的，它返回一个字符串容器（`std::vector<std::string>类型`），这个容器中的内容就是剪切板内的文件路径。

我们把这个容器中的内容逐一复制到一个数组中（Napi::Array 类型，这个类型可以直接被 JavaScript 访问），最后把这个数组返回给了调用者。

接下来我们就看一下 clipboard.h 的代码：

```c++
//src\native\clipboard.h
#ifndef CLIPBOARD_H
#define CLIPBOARD_H

#include <vector>
#include <string>

std::vector<std::string> ReadFilePaths();

#endif
```

在这个头文件中我们只定义了一个方法：ReadFilePaths，**由于在不同平台下读取剪切板的实现逻辑是不同的，所以我们要为这个头文件完成两个实现逻辑**。clipboard.cc 是 Windows 平台上的实现。clipboard.mm 是 Mac 平台上的实现逻辑。

我们先来看 Windows 平台上的实现逻辑：

```c++
//src\native\clipboard.cc
#include <Windows.h>
#include <ShlObj.h>
#include <memory>
#include "clipboard.h"

// 宽字符串转UTF8字符串
std::string Utf16CStringToUtf8String(LPCWSTR input, UINT len)
{
    int target_len = WideCharToMultiByte(CP_UTF8, 0, input, len, NULL, 0, NULL, NULL);
    std::string result(target_len, '\0');
    WideCharToMultiByte(CP_UTF8, 0, input, len, result.data(), target_len, NULL, NULL);
    return result;
}

//  RAII（Resource Acquisition Is Initialization）类
class ClipboardScope
{

    bool valid;

public:
    ClipboardScope()
    {
        valid = static_cast<bool>(OpenClipboard(NULL));
    }
    ~ClipboardScope()
    {
        CloseClipboard();
    }

    bool IsValid()
    {
        return valid;
    }
};

//读取剪切板内的文件路径
std::vector<std::string> ReadFilePaths()
{
    auto result = std::vector<std::string>();
    ClipboardScope clipboard_scope;
    if (!clipboard_scope.IsValid())
    {
        return result;
    }
    HDROP drop_files_handle = (HDROP)GetClipboardData(CF_HDROP);
    if (!drop_files_handle)
    {
        return result;
    }
    UINT file_count = DragQueryFileW(drop_files_handle, 0xFFFFFFFF, NULL, 0);
    result.reserve(file_count);
    for (UINT i = 0; i < file_count; ++i)
    {
        UINT path_len = DragQueryFileW(drop_files_handle, i, NULL, 0);
        UINT buffer_len = path_len + 1;
        std::unique_ptr<WCHAR[]> buffer(new WCHAR[buffer_len]);
        path_len = DragQueryFileW(drop_files_handle, i, buffer.get(), buffer_len);
        result.emplace_back(Utf16CStringToUtf8String(buffer.get(), path_len));
    }
    return result;
}
```

在上面的代码中，我们使用 Widnwos 系统 API 读取了剪切板内的文件路径，上述代码有以下三点需要注意。

- OpenClipboard 之后要对应的关闭操作 CloseClipboard，我们把这两个操作封装到了一个对象中：clipboard_scope， **这个对象初始化时，执行 OpenClipboard 操作，对象释放时，执行 CloseClipboard 操作，这是使用 C++ 开发常见的 RAII（Resource Acquisition Is Initialization）开发技巧**。


- 通过 Windows API 获取到的文件路径是宽字节字符串，我们需要把这个字符串转化成 UTF8 格式的字符串才能被 JavaScript 使用，上述代码中 Utf16CStringToUtf8String 方法就是完成这个任务的。
- 如果剪切板内没有文件路径，那么我们就返回一个空容器，如果有文件路径，那么就把所有的文件路径都放置到容器中返回给调用者。

Mac 端的实现逻辑相对简单，如下代码所示：

```c++
//src\native\clipboard.mm
#import <Foundation/Foundation.h>
#import <Cocoa/Cocoa.h>
#include "clipboard.h"

std::vector<std::string> ReadFilePaths() {
    NSPasteboard *pasteboard = [NSPasteboard generalPasteboard];
    NSArray<NSURL *> *urls = [pasteboard readObjectsForClasses:@[NSURL.class] options:@{
            NSPasteboardURLReadingFileURLsOnlyKey: @YES,
    }];
    if (!urls) {
        return {};
    }
    auto result = std::vector<std::string>();
    result.reserve(urls.count);
    for (NSURL *url in urls) {
        result.emplace_back([url.path UTF8String]);
    }
    return result;
}
```

在上面代码中，我们使用 Mac 原生 API（实际上是 Cocoa 提供的 API）获取剪切板内的文件路径。

## 编译原生模块

现在还剩下一个问题，那就是我们要根据当前操作系统的环境来选择性地编译这些原生代码，也就是说再 Windows 环境下，编译 src\native\clipboard.cc 源码，在 Mac 环境下编译 src\native\clipboard.mm。

这就是编译配置文件：src\native\binding.gyp 最后一个配置节为我们提供配置能力。这个配置节的作用是在操作系统不同时（`'OS=="mac"'`），为我们指定不同的源码文件（`sources`）、依赖库（`libraries`）和编译工具（`msvs_settings`、`xcode_settings`）。

现在执行如下指令来生成构建工程：

```
node-gyp configure
```

如果你要构建 32 位的原生模块，那么你可以为上述命令增加`--arch=ia32`参数。

构建好工程之后，我们就可以尝试使用如下命令来编译这个原生模块了。

```
node-gyp build
```

如果你在命令行环境中看到彩色的`gyp info ok`这行信息，说明原生模块已经编译成功了，它被放置在 build\Release\addon.node 路径下。

接下来我们写一段 JavaScript 代码，测试一下这个原生模块。

```ts
//src\native\test.js
let native = require("./build/Release/bindings.node");
let paths = native.readFilePaths();
console.log(paths);
```

先复制几个文件，然后使用如下命令执行这个测试脚本：

```
node test.js
```

看看你复制的文件路径是不是已经打印到控制台上了呢？

然而上面编译出的原生模块不一定能在 Electron 应用中正常工作。 这是因为 **Electron 内置的 Node.js 的版本可能与你编译原生模块使用的 Node.js 的版本不同**。如果你在 Electron 工程内使用原生模块时，碰到如下错误：

```
Error: The module '/path/to/native/module.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION $XYZ. This version of Node.js requires
NODE_MODULE_VERSION $ABC. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

则说明你使用的原生模块与 Electron 的 ABI 不匹配，此时我们就要针对 Electron 内置的 ABI 来编译你的原生模块。

Electron 团队为开发者提供了 [electron-rebuild](https://github.com/electron/electron-rebuild) 工具来完成原生模块的编译工作，electron-rebuild 工具会帮我们确定 Electron 的版本号、Electron 内置的 Node.js 的版本号、以及 Node.js 使用的 ABI 的版本号，并根据这些版本号下载不同的头文件和类库。

使用方法与编译 SQLite 原生模块时相同，如下指令所示：

```
electron-rebuild -f -m ./src/native
```

现在编译出的原生模块就可以在 Electron 工程下正常使用了。

## 总结

本节我带领大家学习了原生模块的开发和编译相关的知识。掌握了这方面的知识使我们具备了更强大的能力，在 JavaScript 不擅长的业务领域（CPU 密集型任务）我们可以使用原生模块来完成工作。在 Electron 不具备某项能力时（比如枚举桌面上所有窗口的位置和大小），我们也可以使用原生模块来完成工作。

开发者为 Electron 开发一个原生模块并不难，难点在于要掌握 C/C++ 语言、操作系统 API 的使用等这些知识。我们并不会在这个系列课程中过多地介绍这方面的知识，希望你不要畏难，这些知识并没有网上传言的那么难学。

下一节我们将介绍如何升级 Electron 应用。

## 源码

本节示例代码请通过如下地址自行下载：

[源码仓储](https://gitee.com/horsejs_admin/electron-jue-jin/tree/native)
