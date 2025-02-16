## 前言
在桌面端应用中，我们在操作文件进行鼠标右击的时候，经常会看到一些应用的快捷菜单，将应用添加到右击菜单可以让用户以自己非常熟悉的操作习惯来启动我们的应用，大幅提高软件的使用效率。比如在 macOS 上：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fd5570eabce4a76be982bca69f1d53f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=784&h=946&s=240658&e=png&b=e7e7e7" alt="image.png" width="50%" /></p>

在 `Windows` 系统中：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20e9f39202bb4bccb6751ef365cd6a35~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=456&h=623&s=202521&e=png&b=f6f6f6" alt="image.png" width="50%" /></p>

如果你对如何将你的 Electron 应用也注入到右击菜单中启动比较感兴趣，那么本小节将是一个非常契合你兴趣的章节。下面，我们一起来探索和实现将 Electron 应用添加到电脑的右击菜单当中启动的功能。



## 基础知识介绍

### 1. windows 的注册表
Windows 的注册表是一个重要的系统数据库，用于存储操作系统和安装的应用程序的配置信息、系统设置、用户偏好和硬件信息等。它以树状结构组织，类似于文件系统的目录结构，包含多个键（keys）和值（values）。

注册表包括多个主要分支：

-   `HKEY_CLASSES_ROOT`：包含文件关联和注册的程序类信息。
-   `HKEY_CURRENT_USER`：存储当前用户的配置信息，包括桌面设置、用户偏好等。
-   `HKEY_LOCAL_MACHINE`：存储计算机的硬件和操作系统配置信息。
-   `HKEY_USERS`：包含所有用户配置信息，每个用户拥有一个分支。
-   `HKEY_CURRENT_CONFIG`：存储当前计算机的硬件配置信息。

注册表中的键和值可以影响系统和应用程序的行为，包括启动项、文件关联、软件安装信息等。我们在使用 windows 的时候，可以通过 `Win + R` 然后输入 `regedit` 来打开注册表：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2044d5e487ee4dc685b50929d7ff58d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=770&h=350&s=59353&e=png&b=fefefe" alt="image.png"  /></p>

在注册表中，有两个比较重要的目录。

一个是 `HKEY_CLASSES_ROOT\*\shell` 目录：`HKEY_CLASSES_ROOT/*/shell` 这个路径下的键存储了在右键单击特定类型的文件时在上下文菜单（右键菜单）中显示的命令列表（`*` 是一个通配符，表示匹配任何文件类型或文件扩展名）。每个命令都有一个子键，并且这些子键的名称将显示为右键菜单中的命令项，比如 `picgo` 的配置项：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da64642ca23e4024b07b94fec15c0e5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=773&h=309&s=50167&e=png&b=fefefe" alt="image.png"  /></p>

右击文件时，其中 `Upload pictures w&ith PicGo` 就会出现在系统右击菜单上：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39bfe8f65773492599a3bdb00c40dad3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=292&h=148&s=11523&e=png&b=f4f4f4" alt="image.png"  /></p>

还有一类是 `HKEY_CLASSES_ROOT\Directory\shell` 目录，指定了只有右键单击文件夹类型的内容才会出现在右击菜单上，比如 `git gui`：

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79b4b6a5a0294c48b6f292c8d0a55263~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=743&h=352&s=51559&e=png&b=fefdfd" alt="image.png"  /></p>

当右击文件夹时，`Git &GUI Here` 就会出现在系统右击菜单上：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4168c9baf73b4e62847e6676d2d387d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=473&h=410&s=37997&e=png&b=f9f9f9" alt="image.png" width="50%" /></p>

上面两类目录下，都有一个 `command` 目录，这个目录的作用就是点击右击菜单中对应的项目后执行的脚本。在 `git gui` 的目录 `command` 下，我们看到如下数据：

```bash
"C:\Program Files\Git\cmd\git-gui.exe" "--working-dir" "%1"
```
其中 `--working-dir` 是启动 `git-gui.exe` 程序的启动参数，`%1` 是作为当前文件夹路径参数传给 `git-gui.exe` 的。

### 2. NSIS
`NSIS` 是 Nullsoft Scriptable Install System 的缩写，是一个开源的脚本化安装系统，用于创建 Windows 平台上的安装程序。NSIS 提供了一种灵活、强大的方式来制作自定义的软件安装程序，使开发者能够通过编写脚本来创建 Windows 软件的安装和卸载程序。

NSIS 脚本文件的拓展名是 `.nsi`。`.nsh` 是 NSIS 中的脚本包含文件，用于组织和包含一组 NSIS 脚本命令，这些文件可以被引入到主 NSIS 脚本文件（`.nsi` 文件）中，允许在多个安装程序脚本中重用相同的命令和功能，提高代码的可重用性和可维护性。

如果你不理解上面的介绍也没关系，你只需要知道它是用来生成 `Windows` 安装界面的一门脚本语言，你可以通过它来控制安装（卸载）界面都有哪些元素。并且它可以接入安装的生命周期，做一些操作，比如写入注册表：

```bash
WriteRegStr <reg-path> <your-reg-path> <attr-name> <value>
```

### 3. Automator
`Automator` 是 macOS 操作系统中的一个强大的自动化工具，旨在帮助用户快速、简便地创建自定义的自动化工作流程。它允许用户通过简单的拖放操作来组装一系列的动作，从而创建自动化任务。

通过 `Automator` 创建的自动化任务可以被添加到 `MacOS` 的右击菜单 `快速操作` 项目中。


## 实现添加 Electron 应用到系统右击菜单
### 1. Windows
根据上面的一些基础知识，我们一起来捋一下在 Windows 中实现注册 Electron 应用到系统右击菜单步骤：
1. 注册命令行启动程序到注册表中；
2. 应用程序实现命令行启动功能。

接下来我们分别介绍每一步实现的细节。

#### 1.1 注册命令行启动程序到注册表中
因为我们使用的是 `electron-builder` 作为 Electron 应用程序的打包工具，在 `electron-builder` 中，为 `Windows` 平台提供了很多安装包打包方案，默认使用的就是 NSIS。

`electron-builder` 可以通过编写 `.nsh` 脚本文件的方式来实现自定义操作注册表的功能，给开发暴露的 `NSIS` 钩子主要有`customHeader`、`preInit`、 `customInit`、 `customInstall`、 `customUnInstall`，等等。

```bash
!macro customHeader
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
!macroend

!macro preInit
  ; This macro is inserted at the beginning of the NSIS .OnInit callback
  !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
!macroend

!macro customInit
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInit"
!macroend

!macro customInstall
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
!macroend

!macro customInstallMode
  # set $isForceMachineInstall or $isForceCurrentInstall
  # to enforce one or the other modes.
!macroend

!macro customWelcomePage
  # Welcome Page is not added by default for installer.
  !insertMacro MUI_PAGE_WELCOME
!macroend

!macro customUnWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "custom title for uninstaller welcome page"
  !define MUI_WELCOMEPAGE_TEXT "custom text for uninstaller welcome page $\r$\n more"
  !insertmacro MUI_UNPAGE_WELCOME
!macroend
```
对于 `Rubick` 而言，我们需要实现将 `Rubick` 添加到 Windows 系统菜单中识别右击文件的功能，那么我们需要编写这样的一个 `installer.nsh` 脚本：

```bash
# 安装时写入
!macro customInstall
   # 64 位操作
   SetRegView 64
   WriteRegStr HKCR "*\shell\rubick" "" "open w&ith rubick"
   WriteRegStr HKCR "*\shell\rubick" "Icon" "$INSTDIR\rubick.exe"
   WriteRegStr HKCR "*\shell\rubick\command" "" '"$INSTDIR\rubick.exe" "search" "%1"'
   # 32 位操作
   SetRegView 32
   WriteRegStr HKCR "*\shell\rubick" "" "open w&ith rubick"
   WriteRegStr HKCR "*\shell\rubick" "Icon" "$INSTDIR\rubick.exe"
   WriteRegStr HKCR "*\shell\rubick\command" "" '"$INSTDIR\rubick.exe" "search" "%1"'
!macroend
# 卸载时删除
!macro customUninstall
   DeleteRegKey HKCR "*\shell\rubick"
!macroend
```

其中，`!macro customInstall` 和 `!macroend` 之间的部分定义了一个自定义的安装宏。这个宏包含了在安装时向注册表写入相关条目的指令。

-   `SetRegView` 用于设置注册表视图，`64` 和 `32` 分别表示 64 位和 32 位系统。
-   `WriteRegStr` 用于在注册表中写入字符串值。
-   `HKCR` 是 `HKEY_CLASSES_ROOT` 的缩写，是注册表中的根键，表示文件关联信息。
-   `*\shell\rubick` 是一个注册表路径，用于定义右键菜单中的 `open with rubick` 选项。
-   `Icon` 用于定义右键菜单中的图标，`$INSTDIR` 代表的是应用程序安装的路径。
-   `*\shell\rubick\command` 定义了右键菜单选项对应的执行命令。

在安装时，该脚本会在注册表中创建一个名为 `rubick` 的右键菜单选项，允许用户使用 `rubick.exe` 打开特定类型的文件。在卸载时，脚本会删除注册表中与 `rubick` 相关的条目，以清理注册表。

最后，为了让 `electron-builder` 在打包时可以引入这段脚本，以 `vue-cli-electron-builder` 举例，我们需要在构建配置中添加如下设置：

```js
// vue.config.js
nsis: {
  // ...
  include: 'public/installer.nsh',
}
```
最后，当我们安装完打包后的应用程序后，就会在注册表内出现如下内容：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2191c1d286d2498ea6106285f8f7200e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=746&h=304&s=30978&e=png&b=fdfbfb" alt="image.png"  /></p>

#### 1.2 应用程序实现命令行启动功能
我们知道，注册表中写入的 `command` 是一段命令行脚本程序，用于启动应用程序。命令行启动应用程序会涉及到一个问题：有的时候我们的应用是个「单例应用」，也就是不能「多开」。

这个时候，我们就需要用到 `Electron app` 模块下的一个非常重要的钩子：`second-instance`。这个钩子是一个应用尝试打开第二个实例时触发，因此，当我们应用程序启动后，右击菜单中点击应用程序选项就会触发这个钩子函数，所以我们可以在这个钩子函数中添加执行动作：

```js
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
  if (mainWindow) {
    // 显示窗口
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    mainWindow.show();
    // ...
    // 这里可以通过 commandLine 和 workingDirectory 自定义执行逻辑
  }
});
```

注意 `second-instance` 这个事件的回调函数里，有 `commandLine` 和`workingDeirectory`，它们分别对应命令行参数中的 `process.argv` 和对应的`cwd`（执行路径）。

以上我们就实现了点击系统右击菜单中的选项唤起应用程序特点功能的能力。

### 2. MacOS
在 MacOS 下要实现右击菜单，需要依赖的就是前面介绍的 `Automator` 工具，首先，找到 automator 工具并打开：

<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2978a09962394d56869783c14170b953~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=269&h=235&s=50372&e=png&b=c0a4b5" alt="image.png"  /></p>

然后新建一个快速操作：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87feb6999de54a7090cbabd2d46a1a9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=730&h=561&s=165619&e=png&b=f1f1f1" alt="image.png"  /></p>

其中，快速操作中的工作流程代表的是右击文件的类型，可以是图像文件、文件夹、PDF 等，可以根据需要选取，如果不限制品类，可以选择`没有输入`，并位于 `任何应用程序`。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c44c0618e1cf48dc8de62e09b325e808~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=900&s=752456&e=png&b=e9e9e9" alt="image.png"  /></p>

接着将 `shell` 选择成 `/bin/bash`，传递输入选成 `作为自变量`：

<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/069dbfe80c81438d840acdd7f2f0ffeb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1242&h=638&s=98233&e=png&b=fafafa" alt="image.png"  /></p>

然后，将输入内容改成：

```bash
/Applications/rubick.app/Contents/MacOS/rubick search "$@" > /dev/null 2>&1 &
```
其中，`/Applications/rubick.app/Contents/MacOS/rubick` 表示以命令行的方式启动 rubick 应用程序，`"$@"` 用于传递所有的参数给 `rubick` 应用程序。

然后，保存这个快速操作到 `~/Library/Services` 这个目录，可以看到一个 `rubick.workflow` 的应用程序，然后通过右击菜单中的“自定”功能将快捷方式添加到右击菜单面板中：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb1b0063f3904f04a4a9f3eba24f8812~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=676&h=246&s=132286&e=png&b=e2cbb7" alt="image.png"  /></p>

但是，作为一个应用程序，总不能每次让用户自己制作一个 `.workflow` 文件，然后手动把该文件添加到 `~/Library/Services` 吧。所以我们提前将制作好的 `rubick.workflow` 文件打包进入应用程序，然后再写一个脚本文件，在 Electron 应用程序启时检测 `~/Library/Services` 目录中是否包含 `rubick.workflow` 文件，如果没有，则拷贝这个文件到 `~/Library/Services` 目录下：

```js
import os from 'os';

const copyFileOutsideOfElectronAsar = function (
  sourceInAsarArchive,
  destOutsideAsarArchive
) {
  if (fs.existsSync(sourceInAsarArchive)) {
    // file will be copied
    if (fs.statSync(sourceInAsarArchive).isFile()) {
      const file = destOutsideAsarArchive;
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(file, fs.readFileSync(sourceInAsarArchive));
    }

    // dir is browsed
    else if (fs.statSync(sourceInAsarArchive).isDirectory()) {
      fs.readdirSync(sourceInAsarArchive).forEach(function (fileOrFolderName) {
        copyFileOutsideOfElectronAsar(
          sourceInAsarArchive + '/' + fileOrFolderName,
          destOutsideAsarArchive + '/' + fileOrFolderName
        );
      });
    }
  }
};

const dest = `${os.homedir}/Library/Services/rubick.workflow`;
if (fs.existsSync(dest)) {
  // 判断是否存在
  return true;
} else {
  // 如果不存在就复制过去
  try {
    copyFileOutsideOfElectronAsar(
      path.join(__static, 'rubick.workflow'),
      dest
    );
  } catch (e) {
    console.log(e);
  }
}
```

其中， `copyFileOutsideOfElectronAsar` 函数的作用是将打包到 `.asar` 文件中的 `rubick.workflow` 文件复制到 `dest` 目录，之所以不直接使用 `fs.copy()` 函数，主要是因为打包后的 `.asar` 是一个并不存在虚拟目录。关于这块的问题也有一个 [issue: fs.copyFile (and possibly other operations) Fails Once Built With ASAR](https://github.com/electron/electron/issues/14320) 说明。

后续通过右击菜单点击应用程序选项触发命令行唤起应用程序的操作就和 Windows 的处理方式一模一样了，就不再赘述。


## 总结

本小节，我们完成了将应用程序添加到系统右击菜单中的功能，这样便可以通过识别用户右击的文件唤起我们的应用程序特点功能的目的。但是在系统右击菜单中，如果每个应用程序都加入到了右击菜单，那么菜单栏目将会变得非常冗余，很难一眼就找到需要使用的应用程序，而且系统菜单的样式也没法自定义。

所以，你如果有打算自己实现一个系统级别的菜单栏，我们接着阅读下一小节来实现一个超级面板。













