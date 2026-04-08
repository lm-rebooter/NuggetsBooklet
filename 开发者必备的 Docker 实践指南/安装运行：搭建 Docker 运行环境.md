# 搭建 Docker 运行环境

既然 Docker 是一款实用软件，我们就不得不先从它的安装说起，只有让 Docker 运行在我们的计算机上，才能更方便我们对 Docker 相关知识和使用方式的学习。得益于与商业性的优雅结合，Docker 背后拥有大量的优秀开发者为其提供技术支持，而这个优势所造就的结果之一，就是 Docker 拥有丰富且完善的安装体系，我们可以很轻松的通过多种方式安装和运行 Docker。

## 安装前的准备

由于 Docker 容器实现本身就采用了 Linux 内核中很多的特性，所以它自然与 Linux 系统亲密性很高，所以我们可以很轻松的将 Docker Engine 安装在 Linux 系统中。

不过，在安装之前，我还得不厌其烦的啰嗦一些基本概念，让大家在安装 Docker 时能够更好的进行选择。掌握这些概念，能够帮助大家理解一些安装流程中操作的目的，不至于总是一味的进行“下一步”式安装。

### Docker Engine 的版本

在安装 Docker 之前，我们先来了解一下 Docker 的版本定义，这有利于我们在之后的开发中选择和使用合适的 Docker 版本。

对于 Docker Engine 来说，其主要分为两个系列：

*   社区版 ( CE, Community Edition )
*   企业版 ( EE, Enterprise Edition )

社区版 ( Docker Engine CE ) 主要提供了 Docker 中的容器管理等基础功能，主要针对开发者和小型团队进行开发和试验。而企业版 ( Docker Engine EE ) 则在社区版的基础上增加了诸如容器管理、镜像管理、插件、安全等额外服务与功能，为容器的稳定运行提供了支持，适合于中大型项目的线上运行。

![](https://user-gold-cdn.xitu.io/2018/8/29/16586347c98cc591?w=2022&h=276&f=png&s=40439)

社区版和企业版的另一区别就是免费与收费了。对于我们开发者来说，社区版已经提供了 Docker 所有核心的功能，足够满足我们在开发、测试中的需求，所以我们直接选择使用社区版进行开发即可。在这本小册中，所有的内容也是围绕着社区版的 Docker Engine 展开的。

从另外一个角度，Docker Engine 的迭代版本又会分为稳定版 ( Stable release ) 和预览版 ( Edge release )。不论是稳定版还是预览版，它们都会以发布时的年月来命名版本号，例如如 17 年 3 月的版本，版本号就是 17.03。

![](https://user-gold-cdn.xitu.io/2018/8/29/165863f7df36e81f?w=914&h=200&f=png&s=43434)

Docker Engine 的稳定版固定为每三个月更新一次，而预览版则每月都会更新。在预览版中可以及时掌握到最新的功能特性，不过这对于我们仅是使用 Docker 的开发者来说，意义并不是特别重大的，所以我还是更推荐安装更有保障的稳定版本。

在主要版本之外，Docker 官方也以解决 Bug 为主要目的，不定期发布次要版本。次要版本的版本号由主要版本和发布序号组成，如：17.03.2 就是对 17.03 版本的第二次修正。

### Docker 的环境依赖

由于 Docker 的容器隔离依赖于 Linux 内核中的相关支持，所以使用 Docker 首先需要确保安装机器的 Linux kernel 中包含 Docker 所需要使用的特性。以目前 Docker 官方主要维护的版本为例，我们需要使用基于 Linux kernel 3.10 以上版本的 Linux 系统来安装 Docker。

也许 Linux kernel 的版本还不够直观，下面的表格就直接展示了 Docker 对主流几款 Linux 系统版本的要求。

操作系统

支持的系统版本

CentOS

CentOS 7

Debian

Debian Wheezy 7.7 (LTS)  
Debian Jessie 8 (LTS)  
Debian Stretch 9  
Debian Buster 10

Fedora

Fedora 26  
Fedora 27

Ubuntu

Ubuntu Trusty 14.04 (LTS)  
Ubuntu Xenial 16.04 (LTS)  
Ubuntu Artful 17.10

当然，在较低版本的 Linux 系统中也能安装 Docker，不过只能是版本较低的 Docker，其功能存在一些缺失，或者与最新版本有所区别。在这本小册里，我们主要以较新版本的 Docker 功能和操作作为介绍，所以如果条件允许，建议将系统升级到支持最新版本 Docker 的系统版本。

## 在 Linux 系统中安装 Docker

因为 Docker 本身就基于 Linux 的核心能力，同时目前主流的 Linux 系统中所拥有的软件包管理程序，已经可以很轻松的帮助我们处理各种依赖问题，所以在 Linux 中安装 Docker 并非什么难事。

更多的细节就不多说了，Docker 已经为我们准备了好了各系统的安装包，毕竟安装 Docker 并不是我们所要掌握的重点，所以这里我就直接给出安装的命令了。

### CentOS

```
$ sudo yum install yum-utils device-mapper-persistent-data lvm2
$
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
$ sudo yum install docker-ce
$
$ sudo systemctl enable docker
$ sudo systemctl start docker

```

### Debian

```
$ sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
$
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce
$
$ sudo systemctl enable docker
$ sudo systemctl start docker

```

### Fedora

```
$ sudo dnf -y install dnf-plugins-core
$
$ sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
$ sudo dnf install docker-ce
$
$ sudo systemctl enable docker
$ sudo systemctl start docker

```

### Ubuntu

```
$ sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
$
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce
$
$ sudo systemctl enable docker
$ sudo systemctl start docker

```

## 上手使用

在安装 Docker 完成之后，我们需要先启动 docker daemon 使其能够为我们提供 Docker 服务，这样我们才能正常使用 Docker。

在我们通过软件包的形式安装 Docker Engine 时，安装包已经为我们在 Linux 系统中注册了一个 Docker 服务，所以我们不需要直接启动 docker daemon 对应的 `dockerd` 这个程序，而是直接启动 Docker 服务即可。启动的 Docker 服务的命令其实我已经包含在了前面谈到的安装命令中，也就是：

```
$ sudo systemctl start docker

```

当然，为了实现 Docker 服务开机自启动，我们还可以运行这个命令：

```
$ sudo systemctl enable docker

```

### docker version

在 Docker 服务启动之后，我们先来尝试一个最简单的查看 Docker 版本的命令：`docker version`。

```
$ sudo docker version
Client:
 Version:           18.06.1-ce
 API version:       1.38
 Go version:        go1.10.3
 Git commit:        e68fc7a
 Built:             Tue Aug 21 17:23:03 2018
 OS/Arch:           linux/amd64
 Experimental:      false

Server:
 Engine:
  Version:          18.06.1-ce
  API version:      1.38 (minimum version 1.12)
  Go version:       go1.10.3
  Git commit:       e68fc7a
  Built:            Tue Aug 21 17:25:29 2018
  OS/Arch:          linux/amd64
  Experimental:     false

```

这个命令能够显示 Docker C/S 结构中的服务端 ( docker daemon ) 和客户端 ( docker CLI ) 相关的版本信息。在默认情况下，docker CLI 连接的是本机运行的 docker daemon ，由于 docker daemon 和 docker CLI 通过 RESTful 接口进行了解耦，所以我们也能修改配置用于操作其他机器上运行的 docker daemon 。

### docker info

如果想要了解 Docker Engine 更多相关的信息，我们还可以通过 `docker info` 这个命令。

```
$ sudo docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 0
Server Version: 18.06.0-ce
Storage Driver: overlay2
 Backing Filesystem: extfs
 Supports d_type: true
 Native Overlay Diff: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
## ......
Live Restore Enabled: false

```

在 `docker info` 这条命令的结果中，我们可以看到正在运行的 Docker Engine 实例中运行的容器数量，存储的引擎等等信息。由于命令结果比较多，这里我省略了大部分内容，大家可以自己操作来尝试获得完整的信息。在之后的章节里，较多结果的命令我也会省去一些与讲解内容无关的部分，节约大家阅读的时间并强化重点。

### 配置国内镜像源

在很多编程语言中，为了更好的向大家提供依赖包的管理，通常都会有一些组织研发相应的包管理工具，例如 Java 的 Maven，PHP 的 Composer，Node.js 的 NPM 等等。而这些管理工具背后，也对应着一个默认的依赖包仓库。

由于众所周知的原因，我们直接连接这些位于国外服务器上的仓库去获取依赖包速度是非常慢的，这时候我们通常会采用国内一些组织或开发者贡献的国内镜像仓库 ( 注意，这里的“镜像”是指复制于国外源的意思，而不是 Docker 里的镜像 )。

在 Docker 中也有一个由官方提供的中央镜像仓库，不过，它与之前我们所说的国外依赖包仓库一样，除了慢的可怜以外，还经常莫名其妙的完全无法访问。

为了解决这个问题，我们最佳的方式依旧是在国内找一个镜像仓库的镜像源进行替换。很感谢 DaoCloud、阿里云等企业的支持，在国内我们可以找到许多镜像源。这里我们给出一个由 Docker 官方提供的国内镜像源：

> [https://registry.docker-cn.com](https://registry.docker-cn.com)

_( 注：部分读者反映配置了这个镜像源无效，大家需要注意此地址的协议是 https，不要搞错哟 )_

那么有了地址，我们要如何将其配置到 Docker 中呢？

在 Linux 环境下，我们可以通过修改 `/etc/docker/daemon.json` ( 如果文件不存在，你可以直接创建它 ) 这个 Docker 服务的配置文件达到效果。

```
{
    "registry-mirrors": [
        "https://registry.docker-cn.com"
    ]
}

```

在修改之后，别忘了重新启动 docker daemon 来让配置生效哟：

```
$ sudo systemctl restart docker

```

要验证我们配置的镜像源是否生效，我们可以通过 `docker info` 来查阅当前注册的镜像源列表。

```
$ sudo docker info
## ......
Registry Mirrors:
 https://registry.docker-cn.com/
## ......

```

## 留言互动

在这节中，在这一小节中我们掌握了如何在 Linux 中安装上了 Docker Engine，也学习使用了几个简单的 docker 命令的使用。这里给大家留一道实践题：

> 尝试自己在 Linux 系统中安装和运行 Docker Engine。

欢迎大家通过留言的方式说出你的实践之路。我会选出有代表性的优质留言，推荐给大家。

同时，如果你对 Docker Engine 的安装以及启动运行还有什么疑问，或者在操作的过程中出现了无法处理的问题，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。