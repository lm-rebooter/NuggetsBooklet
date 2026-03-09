## 前言


在上一章中，我们安装了 `Docker` 和 `Jenkins`，并实现了将两者打通。在这一章中，我们则使用 `Jenkins` 集成 `Git` 来构建 `Docker` 镜像，为后面的部署准备镜像资源。


## 1. 安装 Nodejs 环境


在上一章，我们其实并没有在服务端安装 `Node` 环境。如果想要安装 `Node` 环境，有以下两个办法：


- 源码编译：这种方式是将 `Node`     源码拉下来后，在服务器端编译完成后才可以使用。时间比较长，流程也略复杂
- 使用 `Jenkins Plugin` 中 `NodeJS` 插件自动配置安装



在这里，我们可以选择第二种方式来安装，既方便又省力。


我们打开 `Jenkins` 首页，找到左侧的**系统配置 => 插件管理 => 可选插件**，搜索 `Node` 。选中 `NodeJS` 后，点击左下角的 `直接安装` 开始安装插件
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af15b14b65be4b38bf87af45e5d43355~tplv-k3u1fbpfcp-zoom-1.image)
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3a9417b4dd345e3af0e472c1dbc5382~tplv-k3u1fbpfcp-zoom-1.image)
等待安装完毕后，返回 `Jenkins` 首页。找到 **Global Tool Configuration => NodeJS => 新增NodeJS**


接着回到 `Jenkins` 首页，找到左侧的 `系统配置` ，选择 `全局工具配置` 
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4d011a030654fdcba23410206ceb96b~tplv-k3u1fbpfcp-zoom-1.image)


找到下面的 `NodeJS` ，点击 `NodeJS` 安装，选择相应的版本填写信息保存即可。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c88a0f1aca984f4e8d7a48c275444a13~tplv-k3u1fbpfcp-zoom-1.image)


### 如何使用


那我们在任务中如何使用呢？我们只需要在任务的**配置**中，找到**构建环境**，选中 `Provide Node & npm bin/ folder to PATH` ，选择刚才配置好的 `NodeJS` 即可。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18178ea08b724669b9138035e970b0cd~tplv-k3u1fbpfcp-zoom-1.image)


第一次执行会下载对应的 `Node` 版本，后续不会下载。


## 2. 使用 SSH 协议集成 Git 仓库源


这一步，我们使用 `Jenkins` 集成外部 Git 仓库，实现对真实代码的拉取和构建。在这里，我们选用 `Gitee`  作为我们的代码源 **（没有打广告，单纯觉得 Gitee 教学方便）。** 这里准备一个 `vue-cli` 项目来演示构建。


### 2.1 生成公钥私钥


首先，我们先来配置公钥和私钥。这是 `Jenkins` 访问 `Git` 私有库的常用认证方式。我们可以使用 `ssh-keygen` 命令即可生成公钥私钥。在本地机器执行生成即可。这里的邮箱可以换成你自己的邮箱：
```shell
ssh-keygen -t rsa -C "janlay884181317@gmail.com"
```


执行后，会遇到第一步步骤： `Enter file in which to save the key` 。


这一步是询问你要将公钥私钥文件放在哪里。默认是放在 `~/.ssh/id_rsa` 下，当然也可以选择输入你自己的路径。一路回车即可。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e18113ddac8546fd853909226c3e420c~tplv-k3u1fbpfcp-zoom-1.image)
结束后，你会得到两个文件。分别是 xxx 和 xxx.pub。


其中，xxx 是私钥文件，xxx.pub 是对应的公钥文件。**我们需要在 `Git` 端配置公钥，在 `Jenkins` 端使用私钥与 `Git` 进行身份校验。**


### 2.2 在 Gitee 配置公钥


在 `Gitee` 中，如果你要配置公钥有2种方式：仓库公钥 和 个人公钥。**其中，如果配置了仓库公钥，则该公钥只能对配置的仓库进行访问。如果配置了个人公钥，则账号下所有私有仓库都可以访问。**


这里我们就以配置个人公钥为例子。首先打开右上角的**设置** ，点击下面的 **安全设置 => SSH公钥**
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95182328abdf49aa939f064f32adcd48~tplv-k3u1fbpfcp-zoom-1.image)![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dae8c76538eb4ea982da0a8b728a2506~tplv-k3u1fbpfcp-zoom-1.image)
在下方有个添加公钥，填入信息即可。


其中的标题为公钥标题，这里可以自定义标题；公钥则为刚才生成的 xxx.pub 文件。使用 `cat` 命令查看下文件内容，将内容填入输入框并保存。接着去 `Jenkins`  端配置**私钥**
```shell
cat xxx.pub
```
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f1ea3af56074ddca2c63f6d96140f55~tplv-k3u1fbpfcp-zoom-1.image)


### 2.3 在 Jenkins 配置私钥


回到 `Jenkins`。在 `Jenkins` 中，`私钥/密码` 等认证信息都是以 `凭证` 的方式管理的，所以可以做到全局都通用。
我们可以在配置任务时，来添加一个自己的凭证。点击项目的 配置，依次找到 **源码管理 => Git => Repositories **
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbb0b11f177948399833587cf654f260~tplv-k3u1fbpfcp-zoom-1.image)
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c159aff675614ba2b23009ca1db7ee2d~tplv-k3u1fbpfcp-zoom-1.image)


这里的 `Repository URL` 则是我们的仓库地址， `SSH` 地址格式为 `git@gitee.com:xxx/xxx.git` 。可以从仓库首页中的 克隆/下载 => SSH 中看到
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b95a6aa8166d40978008dd0d2503c026~tplv-k3u1fbpfcp-zoom-1.image)


重点是 **Credentials** 这一项，这里则是我们选择认证凭证的地方。我们可以点击右侧 `添加 => Jenkins` 按钮添加一条新的凭证认证信息。


点击后会打开一个弹窗，这是 `Jenkins` 添加凭证的弹窗。选择类型中的 `SSH Username with private key` 这一项。接着填写信息即可：


- ID：这条认证凭证在 `Jenkins` 中的名称是什么
- 描述：描述信息
- Username：用户名（邮箱）
- Private Key：这里则是我们填写私钥的地方。点击 **Add** 按钮，**将 xxx 私钥文件内所有文件内容全部复制过去（包含开头的 BEGIN OPENSSH PRIVATE KEY 和结尾的 END OPENSSH PRIVATE KEY）**



接着点击添加按钮，保存凭证。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45dd2d9f71d3461a9dc3056fe8f3ece5~tplv-k3u1fbpfcp-zoom-1.image)


保存后，在 `Credentials` 下拉列表中选择你添加的凭证。


如果没有出现红色无权限提示，则代表身份校验成功，可以正常访问。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c2dd6fd36f84405bc21ae40e1753eb3~tplv-k3u1fbpfcp-zoom-1.image)


## 3. 构建镜像


在我们将环境准备就绪后，就可以开始构建镜像了。不过，我们需要先准备个 `DockerFile` 才可以构建镜像。那什么是 `DockerFile` 呢？


### 3.1 编写 Dockerfile


#### 什么是 Dockerfile


`Dockerfile`  是一个 `Docker` 镜像的基础描述文件，里面描述了**生成一个镜像所需要的执行步骤**。我们也可以自定义一份 `Dockerfile` 来创建一个自己的镜像。


例如下面的步骤，使用 `Dockerfile` 可描述为：

1. 基于 `nginx:1.15` 镜像做底座。
1. 拷贝本地 `html` 文件夹内的文件，到镜像内 `/etc/nginx/html` 文件夹。
1. 拷贝本地 `conf` 文件夹内的文件，到镜像内 `/etc/nginx/`  文件夹。
```dockerfile
FROM nginx:1.15-alpine
COPY html /etc/nginx/html
COPY conf /etc/nginx/
WORKDIR /etc/nginx/html
```


编写完成后，怎么生成镜像呢？我们只需要使用 `docker build` 命令就可以构建一个镜像了：
```dockerfile
docker build -t imagename:version .
```
> -t: 声明要打一个镜像的Tag标签，紧跟着的后面就是标签。标签格式为 镜像名:版本
> . ：声明要寻找dockerfile文件的路径，. 代表当前路径下寻找。默认文件名为 Dockerfile。
> 关于更多 DockerFile 的语法，详细可以看这里 [https://www.runoob.com/docker/docker-dockerfile.html](https://www.runoob.com/docker/docker-dockerfile.html)




---



因为我们的镜像只包含一个 `nginx`，所以 `dockerfile` 内容比较简单。我们只需要在代码根目录下新建一个名为 `Dockerfile` 的文件，输入以下内容，并将其提交到代码库即可。
```shell
vi Dockerfile
```
```dockerfile
FROM nginx:1.15-alpine
COPY html /etc/nginx/html
COPY conf /etc/nginx/
WORKDIR /etc/nginx/html
```
```shell
git add ./Dockerfile
git commit -m "chore: add dockerfile"
git push
```


### 3.2 Jenkins 端配置


在代码源和 `DockerFile` 准备就绪后，我们只需在 `Jenkins` 端配置下要执行的 `Shell` 脚本即可。找到项目的配置，依次找到** 构建 => Execute shell**。输入以下脚本：
```shell
#!/bin/sh -l

npm install --registry=https://registry.npm.taobao.org
npm run build
docker build -t jenkins-test .
```
这里脚本很简单，主要是**安装依赖 => 构建文件 => 构建镜像**。填写完毕后保存


## 4. 执行任务


保存后我们去手动触发执行下任务。当未抛出错误时，代表任务执行成功
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42601c020857402aab4d1e16bbafc6e2~tplv-k3u1fbpfcp-zoom-1.image)


## 本章总结


在这一章，我们学会了使用 `Jenkins` 构建了自己的前端镜像。下一章我们将安装自己的私有镜像库，将镜像上传在镜像库内。
