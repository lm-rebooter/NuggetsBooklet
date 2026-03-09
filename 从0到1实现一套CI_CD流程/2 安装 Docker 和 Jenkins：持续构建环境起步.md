# 前言

在第一章，我们已经大致了解过 `CI/CD` 的作用和历史。从这一章起，我们将正式开启搭建一套 `CI/CD` 流程。在开始之前，首先要学习下贯穿我们小册全程的一个技术：`Docker 和 Jenkins`


## 什么是 Docker

`Docker` 是一个开源的应用容器引擎。开发者可以将自己的应用打包在自己的镜像里面，然后迁移到其他平台的 `Docker` 中。镜像中可以存放你自己自定义的运行环境，文件，代码，设置等等内容，再也不用担心环境造成的运行问题。镜像共享运行机器的系统内核。

同样， `Docker` 也支持跨平台。你的镜像也可以加载在 `Windows` 和 `Linux`，实现快速运行和部署。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f582c982b59497fa8527d751ca2c2c7~tplv-k3u1fbpfcp-zoom-1.image)

`Docker` 的优势在于 快速，轻量，灵活。开发者可以制作一个自己自定义的镜像，也可以使用官方或者其他开发者的镜像来启动一个服务。通过将镜像创建为容器，容器之间相互隔离资源和进程不冲突。但硬件资源又是共享的。
创建的镜像也可以通过文件快速分享，也可以上传到镜像库进行存取和管理。同时 `Docker` 的镜像有 `分层策略` ，每次对镜像的更新操作，都会堆叠一个新层。当你拉取 / 推送新版本镜像时，只推送 / 拉取修改的部分。大大加快了镜像的传输效率


那么 `Docker` 在 `CI/CD` 中的作用是什么呢？


`Docker` 贯穿 `CI/CD` 中整个流程。作为应用服务的载体有着非常重要的地位。


我们可以使用 `Docker` 将应用打包成一个镜像，交给 `Kubernetes` 去部署在目标服务集群。并且可以将镜像上传到自己的镜像仓库，做好版本分类处理。 


## 安装 Docker


在了解了 `Docker` 的作用后，我们来开始安装 `Docker`。在开始安装之前，需要安装 `device-mapper-persistent-data` 和 `lvm2` 两个依赖。


`device-mapper-persistent-data` 是 `Linux` 下的一个存储驱动， `Linux` 上的高级存储技术。 `Lvm` 的作用则是创建逻辑磁盘分区。这里我们使用 `CentOS` 的 `Yum` 包管理器安装两个依赖：


```shell
yum install -y yum-utils device-mapper-persistent-data lvm2
```


依赖安装完毕后，我们将阿里云的 `Docker` 镜像源添加进去。可以加速 `Docker` 的安装。


```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
yum install docker-ce -y
```


安装完毕，我们就可以使用 `systemctl` 启动来启动 `Docker` 了。`systemctl` 是 `Linux` 的进程管理服务命令，他可以帮助我们启动 `docker` 


```shell
systemctl start docker
systemctl enable docker
```


接着执行一下 `docker -v` ，这条命令可以用来查看 `Docker` 安装的版本信息。当然也可以帮助我们查看 `docker` 安装状态。如果正常展示版本信息，代表 `Docker` 已经安装成功。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d98208c9e174be6b0d82acdaa1a2a28~tplv-k3u1fbpfcp-zoom-1.image)


### 配置阿里云镜像源


在 `Docker` 安装完毕后，之后我们去拉取 `docker` 镜像时，一般默认会去 `docker` 官方源拉取镜像。但是国内出海网速实在是太慢，所以选择我们更换为 `阿里云镜像仓库` 源进行镜像下载加速。


登录阿里云官网，打开 [阿里云容器镜像服务](https://cr.console.aliyun.com)。点击左侧菜单最下面的 `镜像加速器` ，选择 `CentOS` （如下图）。按照官网的提示执行命令，即可更换 `docker` 镜像源地址。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea464ab9fe1941bba822a6131dd631c8~tplv-k3u1fbpfcp-zoom-1.image)


## 安装 Jenkins


在安装完 `Docker` 后，我们只是拥有了一个可以承载服务的载体。想实现自动化构建，还需要安装另一个构建工具 `Jenkins`。那什么是 `Jenkins` 呢？


`Jenkins` 是一个基于 `Java` 语言开发的持续构建工具平台，主要用于持续、自动的构建/测试你的软件和项目。它可以执行你预先设定好的设置和构建脚本，也可以和 Git 代码库做集成，实现自动触发和定时触发构建。


### 1. 安装 OpenJDK


因为 `Jenkins` 是 `Java` 编写的持续构建平台，所以安装 `Java` 必不可少。


在这里，我们选择安装开源的 `openjdk` 即可。 `openjdk` 是 `SunJDK` 一种**开源实现**。关于`openjdk` 是 `SunJDK` 的具体区别可以看下面的文章了解下。在这我们直接使用 `yum` 包管理器安装 `openjdk` 即可。
```shell
yum install -y java
```
> [https://www.zhihu.com/question/19646618](https://www.zhihu.com/question/19646618)



### 2. 使用 Yum 安装 Jenkins 


由于 `Yum` 源不自带 `Jenkins` 的安装源，于是我们需要自己导入一份 `Jenkins` 安装源进行安装。导入后，使用 `Yum` 命令安装即可。
```shell
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
yum install jenkins
```


### 3. 启动 Jenkins


`Jenkins` 安装后，会将启动命令注册到系统 `Service` 命令中。所以我们直接使用系统 `service` 命令启动 `Jenkins` 即可。在这里，有三个命令可以使用，分别对应 启动 / 重启 / 停止 三个命令。


在这里，我们直接调用 `service jenkins start` 启动 Jenkins 即可
```shell
service jenkins start
# service jenkins restart restart 重启 Jenkins
# service jenkins restart stop 停止 Jenkins
```


### 4. 给 Jenkins 放行端口


在启动 `Jenkins` 后，此时 `Jenkins` 会开启它的默认端口 `8080` 。但由于防火墙限制，我们需要手动让防火墙放行 `8080` 端口才能对外访问到界面。


这里我们在 `CentOS` 下的 `firewall-cmd` 防火墙添加端口放行规则，添加完后重启防火墙。
```shell
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --zone=public --add-port=50000/tcp --permanent

systemctl reload firewalld
```


服务启动后，访问 `IP:8080` 。如果能够看到以下界面，代表正在启动。 `Jenkins` 第一次的启动时间一般比较长（视服务器性能而看）
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/590e97ce582543dea52a5f90501f5cd1~tplv-k3u1fbpfcp-zoom-1.image)
### 5. 初始化 Jenkins 配置


#### 5.1 解锁 Jenkins


在 `Jenkins` 启动完成后，会自动跳转至这个界面（下方二图）。这是 `Jenkins` 的解锁界面，你需要输入存放在服务器的初始解锁密码才能进行下一步操作。


`Jenkins` 启动后，会生成一个**初始密码**。该密码在服务器的文件内存放，我们可以进入服务器查看密码内容，将密码填写在 `Jenkins` 的管理员密码输入框内：
```shell
cat /var/lib/jenkins/secrets/initialAdminPassword
```
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80991521841c4fbfbfc24330e820488c~tplv-k3u1fbpfcp-zoom-1.image)![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48924f5f22e444cf8b61da8466fb228b~tplv-k3u1fbpfcp-zoom-1.image)


点击 `继续` 按钮，解锁 Jenkins。


#### 5.2 下载插件


解锁后就来到了插件下载页面，这一步要下载一些 `Jenkins` 的功能插件。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78b36782863c4d1e9d7e06fad09d2dec~tplv-k3u1fbpfcp-zoom-1.image)
因为 `Jenkins` 插件服务器在国外，所以速度不太理想。我们需要更换为清华大学的 `Jenkins` 插件源后，再安装插件，**所以先不要点安装插件。**


更换方法很简单。进入服务器，将 `/var/lib/jenkins/updates/default.json` 内的插件源地址替换成清华大学的源地址，将 google 替换为 baidu 即可。
```shell
sed -i 's/http:\/\/updates.jenkins-ci.org\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g' /var/lib/jenkins/updates/default.json && sed -i 's/http:\/\/www.google.com/https:\/\/www.baidu.com/g' /var/lib/jenkins/updates/default.json
```
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ec4d971326e4a938596e501dcc92cff~tplv-k3u1fbpfcp-zoom-1.image)


接着点击 `安装推荐的插件` 即可。稍等一会插件安装完毕
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a29085d29f31454d9f4bd0b323f8bc62~tplv-k3u1fbpfcp-zoom-1.image)
### 6. 完成安装


插件安装完毕后，接着是注册管理员账号。按照提示一路配置后，直到看到以下界面代表安装成功
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bd4415a6da34d05aad501bfd5d5029f~tplv-k3u1fbpfcp-zoom-1.image)


### 7. 测试安装


到这里，我们的 Jenkins 算是启动成功了。但是，我们还需要对 `Jenkins` 做一点点简单的配置，才可以让它可以构建 `docker` 镜像。


我们点击 `Jenkins` 首页 -> 左侧导航 -> 新建任务 -> **Freestyle project**
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4bae87d4a1c4494a0615e6f169d5423~tplv-k3u1fbpfcp-zoom-1.image)


新建完毕后，找到 `构建` 一项，选择 `增加构建步骤`，选择 `执行shell` ，输入以下命令：
```shell
docker -v
docker pull node:latest
```


该命令会去拉取一个 `nodejs` 稳定版的镜像，我们可以来测试 `Docker` 的可用性
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/198a7f5fbe0f41e8b663f2c2af425fb2~tplv-k3u1fbpfcp-zoom-1.image)


保存后，我们点击左侧菜单的**立即构建**， `Jenkins` 就会开始构建。选择左侧历史记录第一项（最新的一项），点击控制台输出，查看构建日志。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a633c410f75c4db8be48133a4a516830~tplv-k3u1fbpfcp-zoom-1.image)
执行后，我们发现提示无访问权限。这又是什么情况呢？这里就不得不提到 `Linux` 下的 `Unix Socket`权限问题了


### 8. Unix Socket 权限问题


`docker` 的架构是 `C/S` 架构。在我们使用 `docker` 命令时，其实是命令使用 `socket` 与 `docker` 的守护进程进行通信，才能正常执行 `docker` 命令。


而在 `Linux` 中， `Unix socket` 属于 `root` 用户，因此需要 `root` 权限才能访问。官方是这么解释的：
> Manage Docker as a non-root user
> The docker daemon binds to a Unix socket instead of a TCP port. By default that Unix socket is owned by the user root and other users can only access it using sudo. The docker daemon always runs as the root user.
> If you don’t want to use sudo when you use the docker command, create a Unix group called docker and add users to it. When the docker daemon starts, it makes the ownership of the Unix socket read/writable by the docker group.



但是在 `docker` 中， `docker` 提供了一个 `用户组` 的概念。我们可以将执行 `Shell` 的用户添加到名称为 `docker` 的用户组，则可以正常执行 `docker` 命令。


而在 `Jenkins` 中执行的终端用户做 `jenkins` ，所以我们只需要将 `jenkins` 加入到 `docker` 用户组即可：
```shell
sudo groupadd docker          #新增docker用户组
sudo gpasswd -a jenkins docker  #将当前用户添加至docker用户组
newgrp docker                 #更新docker用户组
```


加入后，重启 `Jenkins` ：
```shell
sudo service jenkins restart
```


重启 `Jenkins` 后，再次执行脚本。此时执行成功：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebb74deda4d04246922c556f74963413~tplv-k3u1fbpfcp-zoom-1.image)


## 结束语


到这里为止，我们的基础组件 —— `docker` 和 `Jenkins` 就安装完毕了。不过，这只是持续构建的第一步。在下一章，我们会在服务器上安装 `Node` 环境，并集成 `Git` 代码库实现对代码的镜像构建。


如果你有什么疑问，欢迎在评论区提出 👏
