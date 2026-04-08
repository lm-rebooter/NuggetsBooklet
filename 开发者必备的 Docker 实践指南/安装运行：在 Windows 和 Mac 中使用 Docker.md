# 在 Windows 和 Mac 中使用 Docker

对于开发来说，Windows 和 macOS 是更为常见和常用的系统，所以也很有必要了解在 Windows 和 macOS 中使用 Docker 的方法。很幸运的是，Docker 的官方对这两个系统提供了强有力的支持，我们可以很轻松的在这两个系统中运行 Docker。在这一小节中，我们就来了解一下 Docker 在 Windows 和 macOS 中安装的方式以及运行的原理。

## Docker Desktop

在大多数情况下，我们的开发工作是在 Windows 或 macOS 这两个操作系统中进行的，既然 Docker 是我们用来解决开发、测试到运维整条产品线的工具，自然支持这两个系统是不可或缺的功能。

如同封装 Docker 为我们提供了轻松的虚拟化运行环境一样，Docker 在 Windows 和 macOS 中的安装也是极易完成的。Docker 官方为 Windows 和 macOS 系统单独开辟了一条产品线，名为 Docker Desktop，其定位是快速为开发者提供在 Windows 和 macOS 中运行 Docker 环境的工具。

Docker Desktop 实现容器化与 Docker Engine 是一致的，这就保证了我们在 Windows 和 macOS 中开发所使用的环境可以很轻松的转移到其他的 Docker 实例中，不论这个 Docker 实例是运行在 Windows、macOS 亦或是 Linux。

Docker Desktop 产品线包含两个软件，也就是针对 Windows 系统的 Docker for Windows 和针对 macOS 的 Docker for Mac。

### 安装 Docker Desktop

在安装 Docker for Windows 和 Docker for Mac 之前，我们依然要了解一下两款软件对操作系统及软硬件的要求，只有达到了这些要求，我们才能顺利的安装上 Docker for Windows 和 Docker for Mac。

对于 Windows 系统来说，安装 Docker for Windows 需要符合以下条件：

*   必须使用 Windows 10 Pro ( 专业版 )
*   必须使用 64 bit 版本的 Windows

对于 macOS 系统来说，安装 Docker for Mac 需要符合以下条件：

*   Mac 硬件必须为 2010 年以后的型号
*   必须使用 macOS El Capitan 10.11 及以后的版本

另外，虚拟机软件 VirtualBox 与 Docker Desktop 兼容性不佳，建议在安装 Docker for Windows 和 Docker for Mac 之前先卸载 VirtualBox。

在确认系统能够支持 Docker Desktop 之后，我们就从 Docker 官方网站下载这两个软件的安装程序，这里直接附上 Docker Store 的下载链接，供大家直接下载：

*   [Docker for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows) ( [https://store.docker.com/editions/community/docker-ce-desktop-windows](https://store.docker.com/editions/community/docker-ce-desktop-windows) )
*   [Docker for Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac) ( [https://store.docker.com/editions/community/docker-ce-desktop-mac](https://store.docker.com/editions/community/docker-ce-desktop-mac) )

安装 Docker for Windows 和 Docker for Mac 的方法十分简单，按 Windows 或 macOS 常见的软件安装方式安装即可。

### 启动 Docker

像 Linux 中一样，我们要在 Windows 和 macOS 中使用 Docker 前，我们需要先将 Docker 服务启动起来。在这两个系统中，我们需要启动的就是刚才我们安装的 Docker for Windows 和 Docker for Mac 了。

启动两个软件的方式很简单，我们只需要通过操作系统的快捷访问功能查找到 Docker for Windows 或 Docker for Mac 并启动即可。

打开软件之后，我们会在 Windows 的任务栏或者 macOS 的状态栏中看到 Docker 的大鲸鱼图标。

![](https://user-gold-cdn.xitu.io/2018/9/10/165c1d1fb7030b63?w=1186&h=431&f=png&s=92607)

Docker for Windows 或 Docker for Mac 在启动时，这只大鲸鱼上的集装箱会一直闪动，这说明 Docker 程序正在部署 docker daemon 所需要的一些环境并执行 docker daemon 的启动。当集装箱不再闪动，就说明 Docker 服务已经准备就绪，我们就可以在 Windows 和 macOS 中使用 Docker 了。

Docker Desktop 为我们在 Windows 和 macOS 中使用 Docker 提供了与 Linux 中几乎一致的方法，我们只需要打开 Windows 中的 PowerShell 获得 macOS 中的 Terminal，亦或者 Git Bash、Cmder、iTerm 等控制台类软件，输入 `docker` 命令即可。

使用 `docker version` 能够看到 Docker 客户端的信息，我们可以在这里发现程序运行的平台：

```
λ docker version
Client:
## ......
 OS/Arch:  windows/amd64
## ......

```

## Docker Desktop 的实现原理

通过之前小节的介绍，我们知道 Docker 的核心功能，也就是容器实现，是基于 Linux 内核中 Namespaces、CGroups 等功能的。那么大体上可以说，Docker 是依赖于 Linux 而存在的。那么问题来了，Docker Desktop 是如何实现让我们在 Windows 和 macOS 中如此顺畅的使用 Docker 的呢？

其实 Docker Desktop 的实现逻辑很简单：既然 Windows 和 macOS 中没有 Docker 能够利用的 Linux 环境，那么我们生造一个 Linux 环境就行啦！Docker for Windows 和 Docker for Mac 正是这么实现的。

由于虚拟化在云计算时代的广泛使用，Windows 和 MacOS 也将虚拟化引入到了系统本身的实现中，这其中就包含了之前我们所提到的通过 Hypervisor 实现虚拟化的功能。在 Windows 中，我们可以通过 Hyper-V 实现虚拟化，而在 macOS 中，我们可以通过 HyperKit 实现虚拟化。

Docker for Windows 和 Docker for Mac 这里利用了这两个操作系统提供的功能来搭建一个虚拟 Linux 系统，并在其之上安装和运行 docker daemon。

![](https://user-gold-cdn.xitu.io/2018/9/12/165cb3b94b24b951?w=1374&h=517&f=png&s=51096)

除了搭建 Linux 系统并运行 docker daemon 之外，Docker Desktop 系列最突出的一项功能就是我们能够直接通过 PowerShell、Terminal 这类的控制台软件在 Windows 和 macOS 中直接操作虚拟 Linux 系统中运行的 docker daemon。

实现这个功能得益于 docker daemon 对外提供的操作过程并不是复杂且领域性强的 IPC 等方式，而是通用的 RESTful Api 的形式。也就是说，Docker Desktop 只要实现 Windows 和 macOS 中的客户端，就能够直接利用 Hypervisor 的网络支持与虚拟 Linux 系统中的 docker daemon 进行通讯，并对它进行控制。

这其实就是我们之前所提到 docker daemon 使用 RESTful Api 作为控制方式的优势体现了。

### 主机文件挂载

控制能够直接在主机操作系统中进行，给我们使用 Docker Desktop 系列软件提供了极大的方便。除此之外，文件的挂载也是 Docker Desktop 所提供的大幅简化我们工作效率且简化使用的功能之一。

之前我们谈到了，Docker 容器中能够通过数据卷的方式挂载宿主操作系统中的文件或目录，宿主操作系统在 Windows 和 macOS 环境下的 Docker Desktop 中，指的是虚拟的 Linux 系统。

当然，如果只能从虚拟的 Linux 系统中进行挂载，显然不足以达到我们的期望，因为最方便的方式必然是直接从 Windows 和 macOS 里挂载文件了。

要实现我们所期望的效果，也就是 Docker 容器直接挂载主机系统的目录，我们可以先将目录挂载到虚拟 Linux 系统上，再利用 Docker 挂载到容器之中。这个过程被集成在了 Docker Desktop 系列软件中，我们不需要人工进行任何操作，整个过程已经实现了自动化。

![](https://user-gold-cdn.xitu.io/2018/9/11/165c8400bf8f809e?w=1491&h=832&f=png&s=97059)

Docker Desktop 对 Windows 和 macOS 到虚拟 Linux 系统，再到 Docker 容器中的挂载进行了实现，我们只需要直接选择能够被挂载的主机目录 ( 这个过程更多也是为了安全所考虑 )，剩下的过程全部由 Docker Desktop 代替我们完成。这相比于普通虚拟机软件进行挂载的过程来说，完全不能用百倍效率来比较了。

## 配置 Docker Desktop

在我们使用 Docker Desktop 系列之前，我们还会简单修改其的一些配置，以便更好的合理搭配操作系统与 Docker Desktop 系列软件。

我们可以通过 Docker for Windows 或 Docker for Mac 的大鲸鱼图标打开配置页面：在大鲸鱼弹出的菜单中选择 Settings ( Windows ) 或 Preferences ( macOS )。

打开 Docker for Windows 和 Docker for Mac 的配置页面后，我们可以发现几个配置页面。这里我不逐一把每个页面进行截图了，大家可以自己动手查看页面每个页面的内容。

![](https://user-gold-cdn.xitu.io/2018/9/11/165c62cd575bb4e8?w=1559&h=614&f=png&s=339615)

Docker for Windows 和 Docker for Mac 的配置项目较 Docker Engine 来说要多上许多，这主要是因为 Docker Desktop 是 Docker Engine 的超集，所以其不仅包含了 Docker Engine 的配置内容，还要包含诸如虚拟机实现等其他配置。

我这里抽出几个与 Docker 相关的关键配置，分别简单说明它们的作用：

#### 文件系统挂载配置

在 Docker for Windows 的 Shared Drivers 面板，以及在 Docker for Mac 中的 File Sharing 面板中，包含了我们之前提到的将本机目录挂载到 Hypervisor 里 Linux 系统中的配置。

#### 资源控制配置

在 Advanced 面板中，我们可以调整 Docker 最大占用的本机资源。当然，更准确的说我们是在调整虚拟 Linux 环境所能占用的资源，是通过这个方式影响 Docker 所能占用的最大资源。

#### 网络配置

在 Docker for Windows 的 Network 面板，以及在 Docker for Mac 中的 Advanced 面板中，我们可以配置 Docker 内部默认网络的子网等内容。这个网络的作用以及更详细的内容，我们会在之第 9 节中进行讲解。

#### docker daemon 配置

在 Daemon 面板里，我们可以直接配置对 docker daemon 的运行配置进行调整。默认情况下，在 Daemon 面板里只有 Insecure registries 和 Registry mirrors 两个配置，分别用来定义未认证镜像仓库地址和镜像源地址。

我们可以点击切换按钮切换到 Advanced 模式，在这个模式下，我们可以直接编辑 docker daemon 的 daemon.json 配置文件，实现更具体、完整的配置 docker daemon 的目的。

## 低系统版本解决方案

Docker Desktop 系列为我们在 Windows 和 macOS 中使用 Docker 提供了巨大的便利，几乎让我们可以在数分钟内搭建 Windows 和 macOS 中 Docker 的运行环境，并得到像 Linux 中使用 Docker 一样的体验。但 Docker Desktop 依然存在一定的局限性，其中最大的莫过于其对 Windows 和 macOS 的苛刻要求。虽然我们提倡保持操作系统的更新换代，以得到最新的功能以及更好的安全保障，但依然有很多情况下我们不得不使用低版本的 Windows 和 macOS。对于这种情况，Docker 官方也提供了相应的解决方案。

首先，让我们来聊聊为什么 Docker for Windows 和 Docker for Mac 会对操作系统有如此严苛的要求。其实原因很简单，刚才我们谈到了，Docker for Windows 和 Docker for Mac 的实现分别依靠了 Windows 中的 Hyper-V 和 macOS 中的 HyperKit，而这两个虚拟化工具只在高版本的 Windows 和 macOS 系统中才提供出来。

既然知道了原因，解决方案自然也就有了，既然我们不能利用 Hyper-V 或 HyperKit 来创建虚拟的 Linux 系统，那就找一个能够替代它们的工具，用其创建虚拟 Linux 系统即可。

### Docker Toolbox

Docker 官方为我们找到了用于搭建虚拟 Linux 系统的软件，即 Oracle 的 VirtualBox，并以此封装了另一个集成的 Docker 运行环境软件：Docker Toolbox。

安装 Docker Toolbox 的过程也十分简单，下载安装包并按常规软件一样安装即可。这里直接我直接提供给大家 Docker Toolbox 安装包的连接，方便大家下载。

*   [Docker Toolbox for Windows](https://download.docker.com/win/stable/DockerToolbox.exe) ( [https://download.docker.com/win/stable/DockerToolbox.exe](https://download.docker.com/win/stable/DockerToolbox.exe) )
*   [Docker Toolbox for Mac](https://download.docker.com/mac/stable/DockerToolbox.pkg) ( [https://download.docker.com/mac/stable/DockerToolbox.pkg](https://download.docker.com/mac/stable/DockerToolbox.pkg) )

安装完 Docker Toolbox 后，我们有几项与 Docker for Windows 和 Docker for Mac 不同的使用方法需要注意。

由于不能很好的与系统以及 VirtualBox 互通结合，我们启动、关闭、重启 Docker 服务不能完全实现自动化，所以这里 Docker 为我们提供了 Docker QuickStart Terminal 这个工具来处理这些过程。换个方式说，我们必须通过它来启动和操作 Docker，而不能再直接使用 PowerShell、Terminal 这类软件了。

另外一个不便之处就是文件系统的挂载，由于 Docker Toolbox 无法直接操作 VirtualBox 实现挂载，所以这个过程需要我们人工来进行。整个挂载的方式与我们之前谈到的一样，区别只是需要我们手动操作。将本机目录挂载到虚拟 Linux 系统中的配置在 VirtualBox 的 Settings 中，我们将本机需要挂载的目录配置进去并保存即可。

## 留言互动

在这节中，在这一小节中我们掌握了如何在 Windows 和 macOS 安装 Docker Desktop 并进行配置，了解了 Docker Desktop 的实现原理。这里给大家留一道思考题：

> 除了在 Windows 或 macOS 中搭建虚拟的 Linux 系统来实现基于 Linux Container 运行 Docker 这种方式外，你是否还知道直接使用 Windows 或 macOS 本身的容器技术运行 Docker 的方法？尝试了解这些实现方式，说说它们背后的原理。

欢迎大家通过留言的方式说出你的看法。我会选出有代表性的优质留言，推荐给大家。

同时，如果你对 Docker Desktop 的安装、配置还有内部实现还有什么不解，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。