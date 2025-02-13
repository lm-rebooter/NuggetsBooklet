## 前言
打包一个 Electron 应用程序简单来说就是通过构建工具创建一个桌面安装程序（.dmg、.exe、.deb 等）。在 Electron 早期作为 Atom 编辑器的一部分时，应用程序开发者通常通过手动编辑 Electron 二进制文件来为应用程序做分发准备。

随着时间的推移，Electron 社区构建了丰富的工具生态系统，用于处理 Electron 应用程序的各种分发任务，其中包括：

-   应用程序打包 [@electron/packager](https://github.com/electron/packager)
-   代码签名，例如 [@electron/osx-sign](https://github.com/electron/osx-sign)
-   创建特定平台的安装程序，例如 [windows-installer](https://github.com/electron/windows-installer) 或 [electron-installer-dmg](https://github.com/electron-userland/electron-installer-dmg)
-   本地 Node.js 原生扩展模块重新构建 [@electron/rebuild](https://github.com/electron/rebuild)
-   通用 macOS 构建 [@electron/universal](https://github.com/electron/universal)

这样，应用程序开发者在开发 Electron 应用时，为了构建出跨平台的桌面端应用，不得不去了解每个包的功能并需要将这些功能进行组合构建，这对新手而言过于复杂，无疑是劝退的。

所以，基于以上背景，产生出两套主流的一体化打包解决方案，一个是 Electron 官方出品的 [Electron Forge](https://github.com/electron/forge)，另一个是社区提供的 [Electron Builder](https://github.com/electron-userland/electron-builder)。

这两个包都有各自的优势。

- **Electron Forge** ：因为是官方维护的产品，所以当 `Electron` 支持新的应用程序构建功能时，它会立即集成这些新的能力。另外，`Electron Forge` 专注于将现有的工具组合成一个单一的构建流程，因此更易于跟踪代码的流程和扩展。

- **Electron Builder**：Electron Builder 针对大多数构建任务重新编写了自己的内部逻辑，提供了丰富的功能，包括代码签名、发布支持、文件配置、多种目标构建等。Electron Builder 不限制使用的框架和打包工具，使得可以更加灵活地进行配置和打包。

总而言之，就长期支持性而言，使用 `Electron Forge` 会更好，但是 `Electron Forge` 打包出来后的包体积会比 `Electron Builder` 大不少。而 `Electron Builder` 则是目前功能最丰富、使用最多的打包方案。比如：[Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/)、[electron-vite](https://cn.electron-vite.org/) 这些工具的打包默认情况下都是基于 `Electron Builder` 的。所以，接下来的内容，我们将基于 `Electron Builder` 介绍打包构建的过程。


## 打包前准备
### 1. 应用程序签名
Electron 代码签名是指对 Electron 应用程序进行数字签名，以验证应用程序的来源和完整性。这是一种安全措施，有助于确保应用程序未被篡改或恶意修改，并且可以追溯到可信任的开发者。默认情况下，Windows 和 macOS 都会禁止未签名的应用的下载或运行。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91b8c710eae9462aa5450009474a9096~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=520&h=552&s=90556&e=png&b=dee3e0" alt="image.png" width="50%" /></p>

#### 1.1 windows 签名
windows 下给 Electron 程序做签名需要一个签名证书，这个证书可以手动制作，手动制作需要：
1. 获取一个 Windows 身份验证码签名证书（需要年度费用）；
2. 安装 Visual Studio 以获取签名工具（免费[社区版](https://visualstudio.microsoft.com/vs/community/)已足够）。

> 详细制作教程可以参考这篇文章：[创建数字证书PFX](https://juejin.cn/post/6954289571131555871)。

也可以付费购买，常见的数字证书服务商有：[CheapSSLSecurity](https://cheapsslsecurity.com/)、[digicert](https://www.digicert.com/dc/code-signing/microsoft-authenticode.htm)，但是价格好像都挺贵的，比如 CheapSSLSecurity 购买一年需要 83 美元。详细的使用教程可以参考这篇文章：[Electron 在 Windows 下的代码签名](https://oldj.net/article/2022/07/15/code-signing-with-electron-on-windows/)。

不管是手动制作还是付费购买，最后都会生成一个 `.pfx` 格式的文件。然后再配置一下 `electron-builder` 进行签名：

```js
"build": {
  "appId": "XXXX",
  "productName": "XXX",
  "win": {
    // 以下是证书签名配置
    "verifyUpdateCodeSignature": false,
    "signingHashAlgorithms": [
      "sha256"
    ],
    "signDlls": false,
    "rfc3161TimeStampServer": "http://timestamp.comodoca.com/rfc3161",
    "certificateFile": "XXX.pfx",
    "certificatePassword": "XXXX"
  }
}
```
其中，`signingHashAlgorithms` 代表的是签名算法；`certificateFile` 表示的是要签名的 `*.pfx` 证书的路径；`certificatePassword` 是 `*.pfx` 的证书密码。

随后便是正常的打包过程。

#### 1.2 macOS 签名
首先，需要加入 [Apple Developer Program](https://developer.apple.com/cn/support/app-account/)，加入苹果开发者需要缴纳 `688 元`/年的年费，然后需要对应用做签名和公正。
-   **签名：** 是指使用开发者的数字证书对应用进行加密，以确保应用没有被篡改过。
-   **公证：** 是指将应用提交给苹果公司进行审核，并获得苹果公司的认证和授权，以证明应用是安全可信的。

**签名**

签名需要向 Apple 申请证书，大致步骤如下：
1. 在本地创建一个 csr 文件（Certificate Signing Request），作为获取密钥的凭证；
2. 通过 csr 文件从官网下载 cer 证书；
3. 双击将证书导入到钥匙串，然后导出成 p12 证书。

**公正**

2020 年 2 月 3 日起，Mac App Store 以外通过其他途径分发的 Mac 软件必须经过 Apple 公证，才能在 macOS Catalina 中运行，否则在 MacOS 10.14.5 之后，那么就会弹出“恶意软件”提示框。

这时就需要在应用签名之后，再进行公证（notarize app），公正的作用是将签名后的安装包上传到 Apple 审查，获得公证后，应用会被苹果公司加入到 “Gatekeeper” 应用白名单中，这意味着用户的 macOS 系统会默认信任这个应用的来源，并允许其运行。

`Electron` 官方提供了 [electron-notarize](https://github.com/electron/electron-notarize) 包来进行公正：

```js
import { notarize } from 'electron-notarize';

async function packageTask () {
  await notarize({
    appBundleId, // bundleId
    appPath, // 文件路径
    appleId, // apple公证账号
    appleIdPassword, // apple公证专用密钥
    ascProvider, // 证书提供者
  });
}
```
公正结束后，会生成数字签名凭证，需要用下面的命令把凭证放到 dmg 文件中：

```bash
xcrun stapler staple "electron-app.dmg"
# Processing: electron-app.dmg
# The staple and validate action worked!
```

更多细节内容，推荐参考阅读：[Electron-builder 构建MacOS应用小白教程（打包 & 签名 & 公证 & 上架）](https://juejin.cn/post/7009179524520738824)。

后续，如果你的应用程序需要上架到 Mac App Store，可以阅读官方的操作指南：[Mac App Store 应用程序提交指南](https://www.electronjs.org/zh/docs/latest/tutorial/mac-app-store-submission-guide)。


### 2. 图标制作

首先，需要准备 APP logo 图，尺寸是 1024 * 1024 的 png 图片。

在 windows 下，需要将 png 转成 `.ico` 格式图标，可以使用 [aconvert](https://www.aconvert.com/cn/icon/png-to-ico/) 网站进行操作，一般转成 256x256 的尺寸就可以了。

在 macOS 下，需要将 png 转成 `.icns` 格式图标。假设 1024 * 1024 的 png 图标名字为 `icon.png`，首先命令行通过 `mkdir icons.iconset` 命令创建一个临时目录存放不同大小的图片，然后把原图片转为不同大小的图片，并放入上面的临时目录：

```bash
# 全部拷贝到命令行回车执行，icons.iconset查看十张图片是否生成好
sips -z 16 16     icon.png --out icons.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icons.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icons.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icons.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icons.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icons.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icons.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icons.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icons.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icons.iconset/icon_512x512@2x.png
```
然后通过 `iconutil` 来生成 icns 文件：

```shell
iconutil -c icns icons.iconset -o icon.icns
```


## electron-builder 使用

前面我们简单介绍了 `electron-builder` 的基本概念，它是一个 Electron 应用程序打包构建工具，开发者只需要在 `package.json` 中添加 `build` 字段，然后增加一些配置就可以快速打包。

由于我们通常会使用 [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/)、[electron-vite](https://cn.electron-vite.org/) 作为我们桌面端开发脚手架工具，其中已经集成好了 `electron-builder`，我们不需要手动安装。但是配置文件的位置会有所不同，在 `Vue CLI Plugin Electron Builder` 中，配置文件是存放在 `vue.config.js` 中的 `pluginOptions.electronBuilder.builderOptions` 字段内。而 `electron-vite` 则是通过一个 `electron-builder.yml` 文件单独存放。但是不管是哪种工具，其实核心配置字段都是一致的，一份简单的配置示例：

```js
"build": {
  // 应用 id
  "appId": "com.muwoo.rubick",
  // 应用名
  "productName": "rubick",
  // 输入输出目录相关的配置项
  "directories": {
    // 打包的代码目录
    "app": "dist",
    // 构建包的资源目录
    "buildResources": "resource",
    // 存放产包的目录
    "output": "release"
  },
  // 是否使用asar加密
  "asar": true,
  // macOS 系统下的专属配置
  "mac": {},
  // Windows 系统下的专属配置
  "win": {},
  // Linux 系统下的专属配置
  "linux": {},
  // ... 
}
```
另外，我们上面为不同平台制作的图标，也需要在 `electron-builder` 中进行设置，比如 `Windows` 下的配置项：

```js
"win": {
  // 构建的应用图标地址
  "icon": "public/icons/icon.ico",
  // 构建后的产物名称
  "artifactName": "rubick-Setup-${version}-${arch}.exe",
  // 构建目标系统产物
  "target": [
    {
      "target": "nsis",
      "arch": ["x64", "ia32"]
    }
  ]
}
```
除此之外，`electron-builder` 也支持在构建的各个阶段插入一些钩子函数，比如我们需要在构建完成时，自定义一些操作动作：

```js
"build": {
  "afterPack": "./release.js",
}	
```
然后，`release.js` 就可以自定义操作函数：

```js
// release.js
exports.default = async function () {
  // ...
};
```
更多关于 `electron-builder` 的使用介绍，也可以阅读官方文档：https://www.electron.build

完成配置后，接下来只需要执行构建命令，就会根据当前的操作系统构建出不同的安装包：
```bash
# vue-cli-plugin-electron-builder
npm run electron:build

# electron-vite
npm run build:mac
# or
npm run build:win
```

## asar 文件
Electron 应用中的前端代码最终会打包成 [asar](https://github.com/electron/asar) 文件。`asar` 是一种文件归档方式，类似于 `tar` 包，把多个目录和文件合并在一起，但是并不进行压缩。因为一个包里容纳了多个文件，所以需要对各个文件做索引，加上这些索引信息后，`.asar` 文件大小实际上超过各个文件加起来的总和。

既然 `asar` 文件不进行压缩也不进行加密，那么为什么 Electron 要使用 `asar` 呢？官方也给了一些解释：
1. 如果我们的程序依赖的某些资源路径很深，而在 Windows 上对资源路径的长度是有限制的，路径过长就会加载失败，使用 asar 打包就能绕开这个问题。
2. 程序运行时加载一个 `.asar` 文件，相对于加载不同路径的文件而言，加快了 `require` 函数的加载文件的速度。
3. 避免向用户直接暴露代码文件。

好了，介绍完 `asar` 后，我们再来说一下 `asar` 存档的一些局限性：

1. asar 文件是只读的，所以 Node APIs 里那些会修改文件的方法在使用 asar 文件时都无法正常工作。
2. asar 中的目录不能被设置成工作目录（working directory），这是因为 asar 是一个并不存在虚拟目录。
3. 需要将 asar 中的文件解压出来才能运行 node.js 的部分 API。
4. fs.stat 返回的信息是不真实的。这个也是因为 asar 是一个虚拟目录。

1、2、4 三点大多数对我们的影响并不大，但是第三点需要特别注意，还记得我们在[《Electron 的原生能力》](https://juejin.cn/book/7302990019642261567/section/7304830272770408498)章节介绍过使用的 `child_process.execFile` 能力调用可执行文件的介绍。如果我们将这个可执行程序 `.exe` 一起打包进入 `.asar` 虚拟文件中，因为 node.js 的 `execFile` 不支持执行 `asar` 中的虚拟文件，所以 Electron 会将所需的 `.exe` 文件提取到临时文件中，并将临时文件的路径传递给这些 API，以使其正常工作，对于这类 API，会增加一些开销。

除了 `child_process.execFile` 这个 API 外，其他的还有：

-   `child_process.execFile`
-   `child_process.execFileSync`
-   `fs.open`
-   `fs.openSync`
-   `process.dlopen` - 用在 `require` 原生模块时

除此之外，有一些 Node API 不支持在 ASAR 存档中执行二进制文件，例如 `child_process.exec`、`child_process.spawn`。所以，我们尽量不要将一些 Node 原生模块（比如：`sqlite` ）、二进制文件（比如：`*.node`、`*.exe`）打包进 `asar` 文档中。

如果你使用的是 [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/)，那么你可以在 `vue.config.js` 中的 `pluginOptions.electronBuilder.externals` 中配置需要提取的模块：

```js
pluginOptions: {
  electronBuilder: {
    // ...
    externals: [
      'pouchdb',
      'extract-file-icon',
      'electron-screenshots',
    ],
  }
}
```
如果你使用的是 [electron-vite](https://cn.electron-vite.org/)，那么你可以在 `electron-builder.yml` 中添加如下配置：

```yaml
asarUnpack:
  - node_modules/sqlite3
  - out/main/chunks/*.node
  - resources/*
```

## 集成到 github Actions 跨平台构建
我们知道，Electron 是一个可以构建跨平台的桌面端工具，我们可以把 Electron 应用程序打包成不同平台的安装包。但是，需要注意的是打包成不同平台的安装包需要我们使用不同的操作系统进行打包。比如我们需要打包 `.dmg、.exe、.deb` 这三个安装包文件，那么我们就需要使用三套操作系统来分别打包。所以，你可能需要通过一些 `CI` 工具来帮助你完成多端打包能力。

这里，为了方便演示和讲解，我们以 `github Actions` 作为示例，演示如何将你的应用程序集成到自动化构建流程中。

### 什么是 github Actions?
GitHub Actions 是 GitHub 提供的一项功能，用于自动化软件开发工作流程。它允许在特定事件发生时执行自定义的自动化操作，例如代码提交、拉取请求、问题创建等。通过 Actions，开发者可以配置一系列步骤和任务，使得在特定事件触发时，自动运行这些任务。

gitHub Actions 有一些概念需要简单介绍下：

1. **workflow**（工作流程）：持续集成一次运行的过程，就是一个 workflow。
2. **job**（任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
3. **step**（步骤）：每个 job 由多个 step 构成，一步步完成。
4. **action**（动作）：每个 step 可以依次执行一个或多个命令（action）。

工作流程文件是使用 [YAML 格式](https://www.ruanyifeng.com/blog/2016/07/yaml.html)编写的，可以在仓库的 `.github/workflows` 目录下创建，文件名可以任意取，但是后缀名统一为 `.yml`，比如 `main.yml`。一个库可以有多个 workflow 文件。GitHub 只要发现`.github/workflows`目录里面有`.yml`文件，就会自动运行该文件。

### 如何编写 github Actions

拿 `rubick` 的 `github Actions` 配置文件举例：

```yml
# .github/workflows/main.yml
# Workflow 的名称
name: Build

# Workflow 的触发条件
on:
  push:
    branches:
      - master

# Workflow 的 jobs
jobs:
  release:
    # job 的 名称
    name: build and release electron app

    # 运行平台，取自 strategy 中的 matrix
    runs-on: ${{ matrix.os }}

    # create a build matrix for jobs
    strategy:
      fail-fast: false
      matrix:
        # 执行的操作系统
        os: [macos-11, windows-2019, ubuntu-latest]

    # 创建 steps 代码库
    steps:
      # 引用一些 actions
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      # step1: check out repository
      - name: Check out git repository
        uses: actions/checkout@v2

      # step2: 安装 nodejs 环境
      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16.x
      # step3: 安装特殊环境依赖项
      - name: Install system deps
        if: matrix.os == 'ubuntu-latest'
        run: |
          sudo apt-get install libxtst-dev libpng++-dev
          sudo apt-get install --no-install-recommends -y icnsutils graphicsmagick xz-utils
          sudo snap install snapcraft --classic
      # step4: yarn
      - name: Yarn install
        run: |
          yarn
          yarn global add xvfb-maybe
          yarn global add @vue/cli
      # step5: 构建发布  
      - name: Build  & release app
        run: |
          npm run release
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
```
以上 `yml` 文件描述了当我们把代码 `push` 到 `master` 分支时，会触发 `jobs` 执行。`jobs` 会分别在 `macos-11, windows-2019, ubuntu-latest` 三套环境中运行构建任务。完成构建后，会将我们构建完成的三个平台的可执行程序上传到 `github release` 中：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bfc5a26ee614d9496f86d07c02ccf2e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2426&h=1692&s=316412&e=png&b=ffffff" alt="image.png"  /></p>

> 需要注意的是，上传构建包到 github Actions 中需要在 yml 配置一下 GH_TOKEN 这个字段，你可以在你仓库的项目 `xxx/settings/secrets/actions` 路径下进行设置。
> ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/428c594ee97a4f3e8c5158328f3dddd8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1592&h=352&s=39557&e=png&b=ffffff)
>
>另外，workflow 文件的配置字段非常多，如果你有其他的诉求，可以详见[官方文档](https://help.github.com/en/articles/workflow-syntax-for-github-actions)。

## 总结
本小节，我们介绍了 Electron 应用程序打包过程中使用的两个主流工具：Electron Forge 和 Electron Builder。并介绍了它们各自的优势和劣势：对于长期支持性，Electron Forge 可能更适合，但打包出的包体积会比 Electron Builder 大。

同时，我们也介绍了打包前的准备工作，如应用程序签名和图标制作的方法。还详细讲解了 asar 文件、Electron Builder 的使用配置以及如何集成到 GitHub Actions 进行跨平台构建。

有了这些基础，接下来我们需要再学习另外一个重要部分，那就是 Electron 应用程序的更新。
