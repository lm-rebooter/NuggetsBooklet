# Go API 开发环境配置

## Go 命令安装

Go 有多种安装方式，比如 Go 源码安装、Go 标准包安装、第三方工具（yum、apt-get 等）安装。本小册 API 运行在 Linux 服务器上，选择通过标准包来安装 Go 编译环境。Go 提供了每个平台打好包的一键安装，这些包默认会安装到如下目录：`/usr/local/go`。当然你可以改变它们的安装位置，但是改变之后你必须在你的环境变量中设置如下两个环境变量：
+ GOROOT：GOROOT 就是 Go 的安装路径
+ GOPATH：GOPATH 是作为编译后二进制的存放目的地和 import 包时的搜索路径

假定你想要安装 Go 的目录为 `$GO_INSTALL_DIR`，后面替换为相应的目录路径，安装步骤如下。

1. 下载安装包

安装包下载地址为 [golang.org](https://golang.org/dl/)，如果打不开可以使用这个地址：[golang.google.cn](https://golang.google.cn/dl/)。

Linux 版本选择 goxxxxx.linux-amd64.tar.gz 格式的安装包，这里在 Linux 服务器上直接用 `wget` 命令下载：

```
$ wget https://dl.google.com/go/go1.10.2.linux-amd64.tar.gz
```

2. 设置安装目录 
```
$ export GO_INSTALL_DIR=$HOME
```
> 这里我们安装到用户主目录下。

3. 解压 Go 安装包

```
$ tar -xvzf go1.10.2.linux-amd64.tar.gz -C $GO_INSTALL_DIR
```

4. 设置环境变量

```
$ export GO_INSTALL_DIR=$HOME
$ export GOROOT=$GO_INSTALL_DIR/go
$ export GOPATH=$HOME/mygo
$ export PATH=$GOPATH/bin:$PATH:$GO_INSTALL_DIR/go/bin
```
如果不想每次登录系统都设置一次环境变量，可以将上面 4 行追加到 `$HOME/.bashrc` 文件中。

5. 执行 `go version` 检查 Go 是否成功安装

```
$ go version
go version go1.10.2 linux/amd64
```

看到 `go version` 命令输出 go 版本号 `go1.10.2 linux/amd64`，说明 go 命令安装成功。

6. 创建 `$GOPATH/src` 目录

`$GOPATH/src` 是 Go 源码存放的目录，所以在正式开始编码前要先确保 `$GOPATH/src` 目录存在，执行命令：

```
$ mkdir -p $GOPATH/src
```

## Vim 配置

因为 Vim 是 Linux 下开发的最基本工具，为了通用这里基于 Vim 来配置开发环境。如果要配置一个 Vim IDE 有很多步骤需要一步一步去做，笔者调研了很多 Go vim ide 的配置方法，编写了一个安装工具，这里直接用该工具来配置，具体配置步骤如下。
1. 下载 Vim 配置工具

```
$ git clone https://github.com/lexkong/lexVim
```

2. 进入 lexVim 目录，下载 go ide 需要的二进制文件：
```
$ cd lexVim
$ git clone https://github.com/lexkong/vim-go-ide-bin
```
> 都是二进制文件，大概有 141MB，请耐心等待 :-)

3. 启动安装脚本：
```
$ ./start_vim.sh
```

启动后，会进入一个交互环境，依次输入： `1 -> yourname -> youremail@qq.com`，脚本最后输出 `this vim config is success !`说明安装成功。很简单，只需 3 个选择即可安装成功，配置 IDE so easy。

## Vim IDE 常用功能

在 Go 项目开发中最常用的功能是：

+ `gd` 或者`ctrl + ]` 跳转到对应的函数定义处
+ `ctrl + t` 标签退栈
+ `ctrl + o` 跳转到前一个位置
+ `<F4>` 最近文件列表
+ `<F5>` 在 Vim 的上面打开文件查找窗口
+ `<F9>` 生成供函数跳转的 tag
+ `<F2>` 打开目录窗口，再按会关闭目录窗口
+ `<F6>` 添加函数注释

> 在代码间跳来跳去，将光标放在某个函数调用上，按 `ctl + ]` 就会跳到函数的定义处，按 `ctrl + o` 就会跳回来。
>
> 更多 Go vim ide 功能请参考 [Vim IDE 功能](https://github.com/lexkong/lexVim/blob/master/doc/ide.md)。

## 小结

“工欲善其事，必先利其器。”在开始 Go 开发之前，需要安装基本的 Go 编译工具，设置基本的环境变量。如果有一个顺手的开发工具就更好了。该小节向读者介绍了：
1. 如何安装 Go 编译环境
2. 如何配置 Vim IDE

开头的这 4 小节介绍了 API 开发的一些基本的知识，并做了开发前的准备工作，接下来开始 API 开发实战，一步一步教你构建一个账号管理的 API 服务，满满的干货等你来 Get。