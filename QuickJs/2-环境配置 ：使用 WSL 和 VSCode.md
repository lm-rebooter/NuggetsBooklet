单纯学习源码的效率是很低的，编程的一大乐趣就是其交互性，所以首先我们需要将引擎跑起来。本节我们将完成环境的配置工作，配置引擎的编译、运行以及开发环境。

WSL
---

考虑到大家可以比较轻松地获得一台装有 Windows 系统的机器，为了减少大家花在配置环境上的时间，小册选择使用 WSL 作为开发环境。

WSL 全称是（Windows Subsystem for Linux）。顾名思义，是在 Windows 系统下提供了一个 Linux 子系统，可以一定程度上兼顾 Windows 系统的交互便利性以及 Linux 上开发的便捷性。

安装 WSL
------

下面我们开始安装 WSL，首先需要以管理员身份启动命令行工具：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dcb1229c2a043a3960f39356d7475fe~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1606&h=1476&s=146335&e=png&b=f6f6f6)

在点击了「Run as administrator」后，会出现一个确认框，我们选择确定即可：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab0ad8aa5272421eb624c519cdd47d46~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=968&h=798&s=80559&e=png&b=f5f5f5)

接着我们在命令行工具中输入 `wsl --install`：

![wsl_install.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/decd8f940377438baf4e9a331b1a0321~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1470&h=1022&s=91801&e=png&b=0c0c0c)

进度条走完后同样会出现一个确认框，我们选择确定：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2837c249fe724e2497b63e330e36b91e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=944&h=782&s=66925&e=png&b=f5f5f5)

接着会出现安装 WSL 运行所需的基础环境的进度条：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0b8a0c1d9664c18ada35092070ef130~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=976&h=124&s=12345&e=png&b=0c0c0c)

基础环境安装完毕后，会自动进入到 WSL 以及 Linux 发行版的安装（默认为 Ubuntu）：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12f25b82e4634c2da6aa42620def7340~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=984&h=182&s=17156&e=png&b=0c0c0c)

安装完毕后会提示我们变更将在重启后生效：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/624ad74a81284615906576ae8c7698ba~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1582&h=204&s=24726&e=png&b=0c0c0c)

重启之后我们打开 Ubuntu 程序：

![ubuntu.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2de7363745d14a0e8fb3ce8392a93100~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1596&h=1376&s=135120&e=png&b=f6f6f6)

打开程序后会继续剩余的 WSL 安装工作，耐心等待后会提示我们为子系统创建一个新用户：

![ubuntu_new_user.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/821eaa9e97c346848e9268097452ce29~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1618&h=1062&s=99285&e=png&b=0c0c0c)

输入用户名密码之后，会看到安装成功并进入子系统的界面：

![ubuntu_ok.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be509f12a5174fbabdb279b53873f90b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1620&h=1062&s=113972&e=png&b=0c0c0c)

首次进入子系统，我们可以运行命令 `sudo apt update` 来更新一下本地软件仓库中的软件版本信息：

![apt_update.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b03e48fadfe4f2fbefce3a8f9cb983e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1616&h=1060&s=159033&e=png&b=0c0c0c)

接着使用命令 `sudo apt upgrade` 升级一下系统中已经安装的软件的版本：

![apt_upgrade.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49c5c9149a9b41dd8a3a0585630c1228~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1614&h=1064&s=157686&e=png&b=0c0c0c)

这样我们的 WSL 就算是安装完毕了，最后我们可以将 Ubuntu 程序固定到任务栏：

![ubuntu_pin.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/828391c0c4d94cd7a62b05bedbf1d5f2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1614&h=1326&s=201400&e=png&b=0c0c0c)

后续我们就可以点击任务栏的图标快速地呼出 WSL 交互窗口了。

回顾一下：

*   WSL 中使用的 Linux 发行版是 Ubuntu，和我们直接使用 Ubuntu 作为宿主操作系统的区别不是很大
    
*   使用了两个 Ubuntu 系统中的包管理命令 `apt update` 和 `apt upgrade` 来进行系统更新
    
    > `sudo` 可以搭配其他命令，表示以管理员身份运行
    

安装 C 语言编译环境
-----------

quickjs 使用 C 语言编写，我们需要继续在 Ubuntu 中安装用于编译 C 语言的工具。

我们首先使用命令 `lsb_release -a` 查看我们 Ubuntu 系统的版本号：

![lsb_release.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b39897cf842437cb0a4ccbc62fe71e0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1826&h=1046&s=90414&e=png&b=0c0c0c)

> 如果软件安装失败，可将系统版本号与错误信息相结合，利用 Google 搜寻解决方式

接着我们运行命令 `sudo apt install clang lld ninja-build clangd`：

![install_clang.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ef214d7534b44278e6d9a2dce3a6be2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1830&h=1044&s=181311&e=png&b=0c0c0c)

上面的命令分别安装了：

*   `clang` - 编译器，对应前端编译工具链中的 babel
    
*   `lld` - 链接器，C 语言的编译是以文件为单位，其中的函数调用在编译后先转换为占位符，通过链接器可以将这些占位符替换为相应的内存地址
    
*   `ninja-build` - 构建工具，类似前端工具链中的 webpack
    
*   `clangd` - 类似 [TypeScript & JavaScript Language Server](https://github.com/typescript-language-server/typescript-language-server "https://github.com/typescript-language-server/typescript-language-server")，可以对代码进行分析，常用来对编辑器的功能进行增强，比如补全，跳转定义等
    

CMake
-----

CMake 是一个抽象了底层构建细节的构建工具，对用户提供统一的编程接口，内部自动适配不同的构建工具链。

我们知道 webpack 和 parcel 的配置是不一样的，那么 CMake 的作用是提供一个统一二者的配置方式，用户可以自由地切换底层使用的是 webpack 还是 parcel。

抽象 webpack 和 parcel 的配置这一功能可能在前端领域的作用并不是很大，但对于 C 语言来说却很有用。

C 语言是跨平台的，但 C 语言的编译方式不是跨平台的，不同的操作系统上需要使用不同的编译器、链接器、构建工具等，这些工具的配置格式及操作方式之间的差异是比较大的。

有了 CMake 后，用户仅需面对 CMake 的配置格式及操作方式，在不同的平台上由 CMake 自动地完成对底层工具链的调用，从而达到编译方式的的跨平台。

安装 CMake
--------

由于默认软件仓库中的 cmake 版本低于我们所需的版本，所以需要多一些步骤进行安装。

首先安装添加仓库秘钥所需的软件包：

    sudo apt install software-properties-common
    

接着安装第三方仓库所需的秘钥：

    wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | gpg --dearmor - | sudo tee /etc/apt/trusted.gpg.d/kitware.gpg >/dev/null
    

将第三方仓库加入到本地的仓库列表中：

    sudo apt-add-repository 'deb https://apt.kitware.com/ubuntu/ jammy main'
    

更新本地软件仓库并安装 cmake：

    sudo apt update && sudo apt install cmake
    

Hello QuickJS
-------------

接下来我们通过编译 QuickJS 来测试上一节中的编译工具是否成功安装。

首先将 QuickJS 源码克隆到本地：

    git clone https://github.com/hsiaosiyuan0/slowjs.git
    

> 这里并不是使用的 quickjs 仓库中的源码，而是经过笔者调整后的源码，其中的原因会在后面的章节中进行解释

在 Linux 平台上默认会使用 GCC 作为编译器，在这本小册中，我们将固定使用 clang 作为编译器，cmake 支持通过设置环境变量 `CC` 指定编译器。

我们可以运行下面的命令，省去重复设置环境变量 `CC` 的过程：

    # 将配置追加到 .bashrc 文件末尾，.bashrc 在每次进入到 Linux 子系统时会被自动执行
    echo 'export CC=clang' >> ~/.bashrc
    # 仅用于本次加载上一步的追加的配置
    source ~/.bashrc
    

接着我们进入源码目录，运行下面的命令让 cmake 生成构建信息，用于驱动底层的构建工具：

    cmake -S . --preset=default
    

可以看到类似下面的输出：

![cmake_preset.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42b710337bbf448f92a59f4cab8fb855~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1680&h=1062&s=140056&e=png&b=0c0c0c)

> 其中 `The C compiler identification is Clang 14.0.0` 表明我们已经成功将 C 编译器调整为了 clang

继续执行下面的命令进行编译：

    cmake --build --preset=qjs
    

编译完成后，会生成一个位于 `./build/qjs/qjs` 的可执行文件，这就是 quickjs 引擎了。我们可以打印它的帮助信息：

    ./build/qjs/qjs -h
    

会看到类似下面的输出：

![qjs_help.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e13fe4f7296a432bab62fe2ae84fc861~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1670&h=1058&s=132628&e=png&b=0c0c0c)

我们可以生成一段脚本来测试引擎的执行效果：

    echo 'print("hello from quickjs")' > tmp_test.js
    

然后使用命令 `./build/qjs/qjs ./tmp_test.js` 来执行测试脚本，即可收到来自 quickjs 的问候：

![hello_from_qjs.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a01e43a47b9846678c00b21ca35a7350~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1670&h=1056&s=86885&e=png&b=0c0c0c)

安装和配置 VSCode
------------

有了编译和运行环境后，我们继续配置一下开发环境。可以在 VSCode 官方的 [下载页面](https://code.visualstudio.com/Download "https://code.visualstudio.com/Download") 获得其安装包。

VSCode 安装完毕后，我们需要安装一个插件，使得 VSCode 能够连接到 WSL。切换到 VSCode 的插件管理界面，搜索 `WSL` 并安装:

![vscode_wsl.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f96ae382a4491fb8b882a6c389e12d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2040&h=1432&s=523298&e=png&b=222222)

我们使用 VSCode 打开之前克隆的源码所在目录：

1.  打开 Ubuntu，通过命令 `cd slowjs` 切换到之前克隆下来的源码所在目录
    
2.  输入 `code .` 尝试使用 VSCode 打开该目录：
    

![vscode_code](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dbecbcf3ca74bbbb2acb27fefdc06ca~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1564&h=1056&s=163828&e=png&b=0c0c0c)

VSCode 是运行在 Windows 中的，而这里的 `code .` 命令是在 Linux 子系统中运行的，由于两个系统是相互独立的，需要借助一些辅助工具。首次运行 `code .` 出现类似上面的界面，表示正在自动安装这些辅助工具

辅助工具安装完毕后，会自动启动 VSCode 并看到类似下面的界面：

![vscode_wsl_first.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/224ff81c7ab24a12b485bde2a38c6650~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2036&h=1438&s=279976&e=png&b=212121)

界面中包含了这几部分内容：

*   左下角的绿色图标，表示我们的 VSCode 已经成功连接到 Ubuntu 子系统
    
*   左上角示意的是在工程的 `.vscode/extensions.json` 文件中包含了一些工程推荐的 VSCode 插件，这些插件主要是增强 VSCode 对 C 语言项目的智能提示
    
*   当 VSCode 打开工程发现我们尚未安装工程推荐的插件时，会出现右下角的提示。我们点击右下角提示框中的 `Install` 即可安装工程推荐的插件
    

推荐插件安装完毕后，我们点开一个 C 文件，将鼠标移动到标识符之上，如果看到类型提示即表示插件已经安装成功：

![vscode_ok.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43ed13730a924d3eb3d098d85a7611f9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2050&h=1434&s=443770&e=png&b=23272c)

小结
--

本节我们配置了引擎编译、运行以及开发的环境，迈出了引擎学习的第一步。看来将引擎跑起来也并不难，下一节开始，我们将逐步介绍源码结构以及一些编译的细节。