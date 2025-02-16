## 前言

我们在[《基础篇：Electron 的原生能力》](https://juejin.cn/book/7302990019642261567/section/7304830272770408498) 章节介绍了关于如何使用 `C++` 来开发 Electron 应用程序的 Node
扩展。其实除了 `C++` 以外，我们还可以使用 `Rust` 来开发 `Node` 扩展。

`Rust` 和 `C++` 虽然都可以用于开发 Node 的原生扩展，但它们有一些不同之处，其中 `Rust` 相对于 `C++` 有一些优势：

* **内存安全性**：`Rust` 在语言级别提供了内存安全性，通过借用检查器（Borrow Checker）可以避免常见的内存安全问题，如空指针引用、内存泄漏等。这意味着在编写 `Rust` 扩展时，更容易避免许多常见的安全漏洞。
* **性能**：`Rust` 以及其所提供的内存安全性和零成本抽象，可以带来出色的性能。它可以通过其强大的编译器优化产生高效的机器码，这在某些情况下可能比 `C++` 更高效。
* **生态系统**：虽然 `C++` 有着长期的历史和庞大的生态系统，但 `Rust` 作为一门新兴语言，拥有逐渐壮大的社区和生态系统。它的包管理器 `Cargo` 提供了便捷的依赖管理和构建工具。

为了使用 `Rust` 开发 `Nodejs Addon`，你需要使用到 [NAPI-RS](https://napi.rs/cn) 这个库。

> NAPI-RS 是一个用于 Node.js Addon API（N-API）的 Rust 绑定库。通过使用 NAPI-RS，开发者可以充分利用 Rust 强大的性能和安全性，并与 Node.js 生态系统无缝集成，为 Node.js 应用程序编写高性能、高质量的原生扩展。
> 
> N-API 是 Node.js 提供的一个稳定的原生 API，允许开发者用 C、C++ 或 Rust 等编程语言编写 Node.js 的原生插件，而不会受到 Node.js 版本变化的影响。NAPI-RS 充分利用了 Rust 的特性，并提供了一种在 Rust 中编写 Node.js 原生插件的简洁而强大的方式。

[NAPI-RS](https://napi.rs/cn) 目前支持（来自 [NAPI-RS](https://napi.rs/cn) 官网）：

||node12               | node14 | node16 | node18 | node20 |   
| --------------------- | ------ | ------ | ------ | ------ | - |
| Windows x64           | ✓      | ✓      | ✓      | ✓      | ✓ |
| Windows x86           | ✓      | ✓      | ✓      | ✓      | ✓ |
| Windows arm64         | ✓      | ✓      | ✓      | ✓      | ✓ |
| macOS x64             | ✓      | ✓      | ✓      | ✓      | ✓ |
| macOS aarch64         | ✓      | ✓      | ✓      | ✓      | ✓ |
| Linux x64 gnu         | ✓      | ✓      | ✓      | ✓      | ✓ |
| Linux x64 musl        | ✓      | ✓      | ✓      | ✓      | ✓ |
| Linux aarch64 gnu     | ✓      | ✓      | ✓      | ✓      | ✓ |
| Linux aarch64 musl    | ✓      | ✓      | ✓      | ✓      | ✓ |
| Linux arm gnueabihf   | ✓      | ✓      | ✓      | ✓      | ✓ |
| Linux riscv64 gnu     | N/A    | N/A    | ✓      | ✓      | ✓ |
| Linux aarch64 android | ✓      | ✓      | ✓      | ✓      | ✓ |
| Linux armv7 android   | ✓      | ✓      | ✓      | ✓      | ✓ |
| FreeBSD x64           | ✓      | ✓      | ✓      | ✓      | ✓|

以上看到其平台支持是很完备的，你编写的功能甚至能移植到 Android 设备上，此外还支持编译到 `WASM` ，在浏览器等环境中使用。

接下来，我们来一起了解一下如何通过 `Rust` 来开发一个可以在 `Electron` 中使用的 `Nodejs` 原生扩展程序。

>相信大多数人都一样，对于 `Rust` 并没有过多接触，但是请放心，本节不涉及 `Rust` 的任何高级特性，我会确保你读懂这里的每一段代码。
>
> 本小节的实例代码都源自 Rubick 的 Rust 原生扩展：[Rubick-Native](https://github.com/rubickCenter/rubick-native)


## 工具链安装


>这里已经默认你安装了 `Node.js` 和 `Electron` 。

1. 首先我们要安装 Rustup，使用 Rustup 官方的安装器即可：

> rustup 是 rust 的版本管理器，类似于 nodejs 下的 nvm。

[安装 Rust - 点击跳转官网](https://www.rust-lang.org/zh-CN/tools/install)

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71b4d75427bc4add82d836d481925fee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1483&h=562&s=163435&e=png&b=0b7261" alt="image.png"  /></p>

2. 安装 Rust。命令行输入以下命令即可：

```
rustup install nightly
```

自动下载安装后，命令行输入 cargo ，可以看到 Rust 开发工具链已经安装完毕。

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccc822ab6c904f1a838c16a9bed2a3a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=727&s=106134&e=png&b=282c34" alt="image.png"  /></p>

3. 安装 NAPI-RS：

```bash
pnpm add -g @napi-rs/cli
# 或者
npm install -g @napi-rs/cli
```


## 制作一个原生拓展

### 创建一个原生拓展

命令行输入：

```bash
napi new
```

输入你的拓展名称，并选择需要支持的平台：

<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe7595982e3e429eb40b8bf64be9ca77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1438&h=321&s=41253&e=png&b=0c0c0c" alt="image.png"  /></p>

完成导航后，NAPI-RS 会自动写入项目文件：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b5fa13014f2423d8ef11fd4c75e00d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300&h=365&s=45439&e=png&b=0c0c0c" alt="image.png"  /></p>

我们查看目录后发现，实际上这就是一个 NPM 包：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b92c1c823ce4123beeae01522ddc291~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=221&h=410&s=14334&e=png&b=181818" alt="image.png"  /></p>

唯一不同的是，`src` 目录下是 `.rs` 后辍的文件。

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/851d2928c9fd4373873e203aed4f54b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=227&h=422&s=15156&e=png&b=181818" alt="image.png"  /></p>

这里 `.rs` 后辍的文件，就是 rust 的源代码文件。

默认生成的代码我已为你简化了，这里所实现的是一个简单的加和功函数，用 `#[napi]` 进行标记，以暴露给 JS 调用：

```rs
// 导入依赖
use napi_derive::napi;

#[napi] // 标记该函数需要暴露给 JS 调用
pub fn sum(a: i32, b: i32) -> i32 {
  return a + b;
}
```

### 在 JavaScript 世界中使用原生拓展

以上我们已经在 Rust 世界里创建了一个“高效”的加和函数，那么如何在 JavaScript 世界中使用呢？

很简单，我们尝试运行编译命令：

```
pnpm build
```

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f345a875714573bda12f4f15d481d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=617&h=147&s=19939&e=png&b=181818" alt="image.png"  /></p>

我们发现项目目录下多了三个文件：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87001ac0c16540209f135ce93cf46a72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=265&h=82&s=3883&e=png&b=181818" alt="image.png"  /></p>

`.node` 结尾的文件名会因平台架构和操作系统而异，这是原生拓展的`“本体”`，一个二进制文件。

我们在项目目录下运行 Nodejs ，并尝试直接引入该原生拓展：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/818710b793614dc4a88a0146ba71df10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=502&h=142&s=12407&e=png&b=0c0c0c" alt="image.png"  /></p>

刚刚在 Rust 世界里创建的“高效”的加和函数，现在能在 JS 的世界里为我们所用了。

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e6a993907b64f7baea0a15c442135f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=637&h=56&s=4624&e=png&b=0c0c0c" alt="image.png"  /></p>

该二进制文件无法逆向出代码，也就是说你可以将需要保护的代码例如用户认证、数据加密等逻辑“**藏**”在原生模块中。

那另外两个文件呢？

- `index.js`：提供跨平台兼容性，识别系统架构并加载正确的二进制原生拓展。

- `index.d.ts`：这个文件是 NAPI-RS 基于 Rust 代码生成的 TS 类型定义文件。

```ts
export function sum(a: number, b: number): number
```

这样你在使用原生拓展时，体验就和使用 TypeScirpt 库一样舒畅，相关类型会在编译时自动映射并生成：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ecb6b58a9874eb090708bad11e86ea8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=603&h=174&s=18745&e=png&b=212121" alt="image.png"  /></p>

接下来，你就可以在任意 Node.js 项目或是 Electron 项目中以以上方式导入并使用该原生模块。


### 实战场

接下来，我们基于 [Rubick-Native](https://github.com/rubickCenter/rubick-native) 代码库进行实战操练，该代码库已发布于 NPM，你可以使用 `pnpm add rubick-native` 下载并使用。

我们以两个实用的功能为例：

 - 剪切板读取文件文本
 - 键鼠监听

#### 1. 为我们的原生拓展添加“剪切板读取文件文本”功能

Rust 生态中有以下两个涉及剪切板读取的包，且都是跨平台的：

 - [clipboard-files](https://github.com/betamos/clipboard-files) 读取剪切板文件
 - [copypasta](https://github.com/alacritty/copypasta) 读写剪切板文本

我们要做的，就是把以上两个包的功能整合，封装成统一的函数 `getClipboardContent()` ，并暴露在 JS 环境中，以下是我们预想的该函数的出参描述。

**出参 eg**：

```js
// type: file
{
  type: 'file',
  content: [
    'C:/Download/test.txt',
    'C:/Download/mywork',
  ]
}
// type: text
{
  type: 'text',
  content: 'hello world'
}
```

-   type: 'file' | 'text'
-   content: Array | string

我们希望在 Rust 端能判断剪切版中的数据类型，如果是文件则输出 `type` 为 `file`，`content` 为文件路径列表，文本则输出 `type` 为 `text`，`content` 为剪切板文本内容。

**第一步**，我们根据以上涉及定义数据对象类型，在 Rust 中被称为 “结构体”：

```rs
#[napi(object)] // 标记此类型为需要与 JS “互动”的对象
pub struct ClipBoardContentJson { // 定义公开的，名称1为 ClipBoardContentJson 的结构体
  #[napi(ts_type = "'file' | 'text'")] // 这里指定编译出的 TS 类型文件中 type 的类型为 'file' | 'text'
  pub r#type: String, // 由于 type 是关键字，前面加上 r# 标记为字段
  pub content: Vec<String>, // Vec<String> 会转换为 JS 中的 string[]
}
```

**第二步**，我们在 Rust 中实现该函数：

```rs
// 获取剪切板文件或者文本
#[napi]
// Option<ClipBoardContentJson> 的意思是 get_clipboard_content 输出 ClipBoardContentJson 类型的数据或是空值（毕竟有的时候剪切板是空的）
pub fn get_clipboard_content() -> Option<ClipBoardContentJson> { 
  // 读取剪切板文件
  let files = clipboard_files::read();
  // 创建剪切板对象
  let mut ctx = ClipboardContext::new().unwrap();
  // Rust 中的匹配语句，可以简单理解为 JS 中的 switch 语句
  match files {
    // 文件读取成功了，就返回文件类型的结果给 JS 端
    Ok(f) => Some(ClipBoardContentJson {
      r#type: "file".to_string(),
      // 这里是将 f 转换为 string[] 类型，实际编码中，代码分析器会提示你怎么写
      content: f
        .into_iter()
        .map(|c| c.to_str().unwrap().to_string())
        .collect::<Vec<String>>(),
    }),
    // 文件读取失败了，说明剪切板中是文本或是空值
    Err(_) => {
      // 读取剪切板中的内容
      let content = ctx.get_contents();
      match content {
        // 如果是文本，那么返回结果
        Ok(text) => Some(ClipBoardContentJson {
          r#type: "text".to_string(),
          content: vec![text],
        }),
        // 如果不是文本，返回空值
        Err(_) => None,
      }
    }
  }
}
```

最终完全的代码如下：

```rs
// 导入上面提到的两个依赖
use clipboard_files;
use copypasta::{ClipboardContext, ClipboardProvider};

#[napi(object)]
pub struct ClipBoardContentJson {
  #[napi(ts_type = "'file' | 'text'")]
  pub r#type: String,
  pub content: Vec<String>,
}

#[napi]
pub fn get_clipboard_content() -> Option<ClipBoardContentJson> {
  let files = clipboard_files::read();
  let mut ctx = ClipboardContext::new().unwrap();
  match files {
    Ok(f) => Some(ClipBoardContentJson {
      r#type: "file".to_string(),
      content: f
        .into_iter()
        .map(|c| c.to_str().unwrap().to_string())
        .collect::<Vec<String>>(),
    }),
    Err(_) => {
      let content = ctx.get_contents();
      match content {
        Ok(text) => Some(ClipBoardContentJson {
          r#type: "text".to_string(),
          content: vec![text],
        }),
        Err(_) => None,
      }
    }
  }
}
```

接下来，编译后，就可以在 JS 中使用该函数：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/038e3f09c0e14e03afb6be5aff1540a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=636&h=288&s=35765&e=png&b=222222" alt="image.png"  /></p>

#### 2. 为我们的原生拓展添加“键鼠监听”功能

键鼠监听，就是在 JS 中能够获取到鼠标或是键盘的“事件通知”，我们知道 Nodejs 的事件驱动模型中，事件是通过“回调函数”进行处理的，所以如果我们有一个键盘对象 `keyboard`，那么我们预想中监听键盘输入事件的代码应该是这样：

```ts
keyboard.onevent(event => {
    // 对键盘输入事件进行处理
})
```

其中，以下部分就是键盘被敲击时，在 Rust 端需要被调用的“回调函数”：

```ts
event => {
    // 对键盘输入事件进行处理
}
```

那么，我们如何在 Rust 世界中主动调用 JS 世界中的“函数”呢？

实现代码如下，完整代码见 [rubick-native/src/monitor/mod.rs](https://github.com/rubickCenter/rubick-native/blob/main/src/monitor/mod.rs#L12)，我们使用 NAPI-RS 对 [rdev](https://github.com/Narsil/rdev) 库进行了包装，便使 Node.js 获得了键鼠事件监听的功能。

```rs
#[napi(ts_args_type = "callback: (event: string) => void")] // 自定义回调函数类型
pub fn on_input_event(callback: JsFunction) -> Result<()> {
  // 将 JS 传入的函数转换为 Rust 中的函数
  let jsfn: ThreadsafeFunction<String, ErrorStrategy::Fatal> =
    callback.create_threadsafe_function(0, |ctx| Ok(vec![ctx.value]))?;

  // 在另一个线程中运行键鼠事件监听
  spawn(|| {
    if let Err(error) = listen(move |event| {
      // 将事件序列化为 JSON，并作为参数传递给 JS 中的回调函数
      jsfn.call(
        serde_json::to_string(&event).unwrap(),
        ThreadsafeFunctionCallMode::NonBlocking,
      );
    }) {
      // 如果有错误打印在控制台
      println!("Error: {:?}", error)
    }
  });
  Ok(())
}
```
其中，我们用到了 Rust 中 [rdev](https://github.com/Narsil/rdev) 库，该库可以在 Windows、Macos、Linux 下对键鼠事件进行监听。

之后，在 JS 中，我们可以这样对该函数进行调用：

```ts
onInputEvent((event => {
    // 处理键鼠输入事件
}))
```

## 总结

本小节我们介绍了如何开发原生拓展来打破 Node.js/Electron 世界的“次元壁”，让你的应用获得以下能力：

 - 操作系统底层指令
 - 用极致性能解决计算密集型任务
 - 保护关键代码的知识产权
 - 功能高可移植性

