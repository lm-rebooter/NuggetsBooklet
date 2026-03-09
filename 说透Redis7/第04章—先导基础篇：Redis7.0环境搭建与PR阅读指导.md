
介绍完 Redis 概述之后，本文我们就通过源码的方式，来**安装一下 Redis 7.0**。同时，也把阅读 Redis 的**源码环境**搭起来。



前面我们讲过 Redis 一般是部署在 Linux 系统上面，所以我们这里，就在 `Mac` 或者是在`  Linux ` 上进行搭建，Windows 的话，就不太建议你去浪费时间搞这个了。


如果你手里只有 Windows 机器的话，也可以安一个`虚拟机`，在上面装一个 Linux，然后再去搭建 Redis 环境。后面我们可以用 IDE 远程连到这个虚拟机上进行 Debug，非常不建议你浪费时间在 Windows 上做 Redis 的编译或者是安装，没有啥太大意义。


> 说明：本小节的内容整体还是比较简单的，如果小伙伴不知道如何搭建 Redis 7 源码环境或者不知道怎么查看一个 Redis 7 新特性实现的话，可以跟着本小节一步步操作，我也是希望能尽量照顾到各个基础水平的小伙伴，做好铺垫，打好基础，在刚开始学习时有个平滑的学习曲线，这样咱们后续学习就能减少在基础知识上的磕磕绊绊，这也是我们“先导基础篇”的设置初衷。
>
>
> 当然，肯定有小伙伴基础水平很不错，已经完全掌握些细碎的知识了，建议你跳过，直接学习下面的内容。


## Redis 7 环境搭建

下面我们先来搭建 Redis 7.0 的环境，这也是我们后面实践 Redis 命令以及分析 Redis 核心源码的基础，小伙伴们一定要跟着本小节的步骤，在自己机器上搭建出一套可以进行 Debug 运行的 Redis 7 源码环境。


### 1. 获取 Redis 源码

获取 Redis 源码还是比较简单的，可以有两种方式来实现。

**第一种方式，直接从官网下载 Redis 源码压缩包**。如下图，我们直接从官网上下载 7.0.4 这个版本的源码：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/121fd09e2dd04dcebe152444f58a563b~tplv-k3u1fbpfcp-watermark.image?)


下载之后，得到一个名为 `redis-7.0.4.tar.gz` 的压缩包，如下图所示：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/beaf4ff4ca8e460e88a3000edb0add6a~tplv-k3u1fbpfcp-watermark.image?)


然后解压 `redis-7.0.4.tar.gz`，得到下面展示的 redis-7.0.4 这个文件夹：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcbd8a0205884148ab69c95be99a8d06~tplv-k3u1fbpfcp-watermark.image?)

**第二种方式，通过 git clone 方式获取源码。**


要是你已经安装了 git 的话，就可以通过 git clone 的方式，从 GitHub 上直接 clone 一份 Redis 的源码下来，具体命令如下：

```shell
git clone https://github.com/redis/redis.git
```

git clone 命令执行完成之后，可以看到 `done` 这个字样。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac233c67182a4a798613b97827ec0b51~tplv-k3u1fbpfcp-watermark.image?)


下载完之后，来看 redis_source 这个目录下面，新增了一个 redis 目录，就是 clone 下来的**源码**。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7789367a6f0746c4aae1b9f26fd0e558~tplv-k3u1fbpfcp-watermark.image?)



然后命令行进入到这个 redis 目录里面，看到当前的分支是 unstable 分支，我们执行 `git checkout` 命令，切换到 `7.0.4` 这个 tag 上去：

```shell
git checkout tags/7.0.4 -b 7.0.4
```



### 2. 编译 Redis

在编译之前，我们先要**保证机器上有 C 和 C++ 的编译器，也就是 GCC**。


如果是在 Mac 电脑上的话，我们用的是 clang，clang 是兼容 gcc 的一个编译器。我们可以用 `clang --version` 这个命令看一下，当前是不是已经安装了 clang：



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b1926091fb4416a80f7d805831d57a9~tplv-k3u1fbpfcp-watermark.image?)



执行 `gcc -v` 命令也行：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ff11030e55c4bd5b60f6bb29bd04e10~tplv-k3u1fbpfcp-watermark.image?)



要是没有安装的话，可以通过下面这个命令安装一下：

```shell
xcode-select --install
```


如果是在 Linux 的机器上，我们也是通过 `gcc -v` 命令来查看当前 gcc 是否已经安装好了。要是没有安装好的话，就执行下面的 `yum` 命令进行安装：

```shell
yum install gcc
```

回车之后，一路输入 y 就行了。



准备好了 GCC 之后，我们就来到那个 Redis 的源码目录里面，然后直接执行 make 命令就可以了。这里你可以不用深入了解 make 命令，就把它当成 Java 里面的 mvn 命令就行，用来编译 C 语言代码的一个命令。

```shell
make CFLAGS="-g -O0" 
```



编译成功之后，会看到下面的这个 Hint 提示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83065d3a51d7430c826194953b065eeb~tplv-k3u1fbpfcp-watermark.image?)


这里的 make 命令带了一个“-O0”参数，正常编译的时候，编辑器会帮我们优化代码，这就会导致我们后面 Debug 的时候，IDE 里的 Redis 源码和实际运行的代码对不上，所以我们这里通过 “-O0” 参数告诉编译器，不要进行优化。


如果我们是要直接编译出一个线上运行的 Redis 的话，我们不用带这个参数，直接用 make 命令：

```shell
make
```


### 3. 启动 Redis

编译完成之后，我们在 Redis 的 src 源码目录下面，可以看到一个 redis-server 的可执行程序。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5689d36895c84b8cb3a435ce925fec18~tplv-k3u1fbpfcp-watermark.image?)


我们**可以直接执行 `redis-server`，Redis 就跑起来了**。

```shell
./redis-server
```


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46047d84d49c4d859138e1fb69a73a8d~tplv-k3u1fbpfcp-watermark.image?)


也可以给 redis-server 指定一个配置文件，在 redis 源码的根目录里面可以找到一个默认的 redis.conf 配置文件：

```shell
./redis-server ../redis.conf
```


## Redis 7 源码环境搭建

为了后面更方便地阅读 Redis 的源码，我们需要安装一个 CLion，**CLion 可以认为是用来写 C 和 C++ 的 IDEA**。官网是这个 <https://www.jetbrains.com/clion/> ，可以试用三十天，超过三十天，就需要你自己想办法了，你懂的。


安装完 CLion 之后，我们把 Redis 的源码导入进来。打开 CLion 之后，点 Open，找到 Redis 源码目录，然后点确定就行了。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67b6e9a66488437ca4eab5698666bf23~tplv-k3u1fbpfcp-watermark.image?)

导入的时候需要扫描全部的文件，建立文件索引，可能会比较慢。导入之后就是这样了：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a8e5e4d51e3489ba07d2d73a91d1b3b~tplv-k3u1fbpfcp-watermark.image?)

在右上角的这个运行框里面，要配置一下 redis-server 这个启动项。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b19dc24bc20b492bba4bd0c921bdd1a0~tplv-k3u1fbpfcp-watermark.image?)



这里把 Executtable 配置成编译出来的 redis-server 文件，然后 Program arguments 配置成 redis 源码自带的 redis.conf 文件的绝对路径。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a4595ce7f88463a94e93743117e206b~tplv-k3u1fbpfcp-watermark.image?)


然后，在 server.c 里面的 main() 方法加个断点，Debug 启动 redis-server，就能进行 Redis 源码的 Debug 了。


## 怎么看 Redis 7.0.0 的新特性

Redis 在我们准备欢度 2022 年五一假期的前两天，偷偷摸摸地发布了 7.0 的第一个 Release 版本，号称是进行了非常大的性能优化。


这里我先带你逛一下 Redis 7.0 版本的 Release Note，让你了解一下如何看 Redis 的 PR。在 [Redis 官网](https://redis.io/download/)，可以看到 “7.0 Release Notes” 这个链接，[点进去](https://raw.githubusercontent.com/redis/redis/7.0/00-RELEASENOTES)，就能看到 Redis 7.0 版本更新了哪些东西。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11c84084b75743d393a05f7b0f2b020c~tplv-k3u1fbpfcp-watermark.image?)


点开之后的情况如下截图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/502f776562b64fa69629a36322ae47ee~tplv-k3u1fbpfcp-watermark.image?)

可以看到 Release Notes 开头是一个更新级别的说明：CRITICAL 级别的升级，一般是修复了一个非常严重的 Bug，这个 Bug 会影响非常多的用户；HIGH 级别的更新，也是表示修复严重了 Bug，但是这个 Bug 只会影响部分用户，但是也建议升级；LOW 级别的更新，可能只是增加了某些新特性，升不升级就看我们的需求了。再往下，就是下面各个版本的具体更新了，可以看到 **Redis 7.0.4 是一次 SECURITY 级别的升级，里面更新了一些安全漏洞**。


在某些版本的 Release Note 下面，会添加一些新特性，比如 7.0.0 GA 这个版本中，就有一个 New Feature 的说明：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/240bad57aafe4c9bbce221fc35001008~tplv-k3u1fbpfcp-watermark.image?)


这个 Feature 的大致功能是，添加一个 Key 到 Redis 里面的时候，会触发一个通知。这个后面的 `#10512` 是 GitHub 上的 PR 的编号，我们一起去看看这个 PR。先去 [Redis 的 PR 页面](https://github.com/redis/redis/pulls)，然后搜 10512，就得到了下图所示的界面：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55aa2384b09f47a984420ff4d3f7191d~tplv-k3u1fbpfcp-watermark.image?)


点进去就能看到这个 PR 下的讨论，然后 Commit 是提交了两次，改了 6 个文件，改的地方，我们都可以看到。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4db98206c7514f7c8f014a08629f7bff~tplv-k3u1fbpfcp-watermark.image?)


一个 PR 具体做了什么事情，相关的讨论是什么以及修改了哪些代码，就先带你看到这里。


我们回到 Release Note 继续看。一般一个 Release 版本前面，会有多个 RC 版本，这些 RC 版本的 Release Note 也会在这里，比如，这里看到的 RC3、RC2 的 Release Note。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f9f57bcbefe4404a9988f2f9e075ae6~tplv-k3u1fbpfcp-watermark.image?)


每个 Release Note 分成了 New Feature（新特性）、性能提升和资源优化（Performance and resource utilization improvements）、可能不兼容的修改（Potentially Breaking Changes）、新配置项（New configuration options）等，非常多门类的修改，每个修改后面对应的 PR 也都有，你可以挑几个感兴趣的去看看。


我个人可能会比较关注`性能提升`这部分的修改，比如说，Redis 7.0 RC1 里面，就有这么一行：Hash、List、ZSet 这些数据结构底层本来是依赖 ziplist 的，在这个版本里面，已经修改成了 listpack。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c16dd18810f248febc9b2aeb97625adf~tplv-k3u1fbpfcp-watermark.image?)

本课程后面还是会详细介绍 ziplist 这个结构的，毕竟现在线上跑的大部分还是 Redis 6 或者 Redis 5。升级到 Redis 7 的事情，可以先等等，等到 Redis7.2 之类的超级稳定版出来再升级也来得及，我们可以先做知识储备。


这么多的 Release Note 修改，是不是看得很痛苦，其实有人会帮我们总结和翻译，比如，[Redis 社区里面发的这种总结性博客](https://redis.com/blog/redis-7-generally-available/)：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7ba60e40bcb424d8df0bcf7843665e9~tplv-k3u1fbpfcp-watermark.image?)

大概就是说，Redis 7.0 里面新增了 Function、ACL v2、Shard PubSub 这些功能，新增了 50 多条命令。

当然，也有不少国内小伙伴主动翻译上面这些文档，你可以自行搜索和学习，不过，一定要注意下翻译的版本和发布时间，别搞错了就行。

总之，逛完之后，是不是发现 Redis 7.0 相较于 Redis 6 来说，变更还是挺大的呢？

## 总结

这篇文章比较简单，就是带你搭了一个 Redis 源码环境，你一定要自己动手搭建一下，后面分析 Redis 实现的时候，就可以事半功倍。然后就是和你一起去看了一下 Redis 7.0 的 Release Note，了解了一下 Redis 的新特性从哪里看，如何找到每个新新特性对应的 PR，以及这些新特性都有哪些相关的讨论和代码提交。


这整体比较简单哈，接下来我们就进入“Redis 的实战应用篇”，我会带你一起学习一下 Redis 中五大类结构的常用命令，以及这五类结构在实战场景中的使用。
