## 前言

假设我们的项目做完了，现在该部署上线了。因为项目用到了 MySQL 等技术，我需要在服务器上也安装一遍环境。这……好麻烦……

假如我把代码提交到 GitHub，其他同学为了查看效果，也要把环境安装一遍。这……好麻烦……

有没有更简单的解决方案？

这就要说到 Docker 了。Docker 应该是目前最流行的容器解决方案。Docker 会把项目和项目的依赖，包括运行环境等，都打包到一个文件中。运行这个文件，会生成一个虚拟容器，我们的项目就在这个虚拟容器里运行。

这样当在服务器或者其他电脑上运行的时候，不需要直接运行项目代码，而是运行包含环境的打包文件，这样就避免了再次安装环境的困扰。

## 理解 Docker

现在让我们开始学习 Docker 吧！

**Docker 有三个核心概念：镜像（Image）、容器（Container） 和仓库（Repository）。**

Docker 会把应用程序及其依赖，都打包在名为镜像（Image）的文件中。Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

而镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，**镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8399c2442b8452a96cf7aa85f7e11b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=652\&h=404\&s=43261\&e=png\&b=ffffff)

容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。

在本地制作好镜像后，我们可以将镜像推送到远程仓库（Repository）。仓库分为公开仓库和私有仓库，最大的公开仓库是 Docker 的官方仓库 [Docker Hub](https://hub.docker.com/)。这一点跟 Git 就很相似了，最大的 Git 公开仓库是 GitHub。

## 使用 Docker

安装 Docker 最快捷的方式就是使用 Docker 客户端了。下载 Docker：<https://docs.docker.com/get-docker/>

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ffa048dfed341ccaaaa1f56880812f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1440\&h=680\&s=204191\&e=png\&b=d9eaf9)

下载安装完成后，本地应该就有 `docker` 命令了，运行 `docker -v`试试。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/644fc92d1682472790e4a76fda52ee16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=574\&h=72\&s=46170\&e=png\&b=0b041a)

国内从 Docker Hub 拉取镜像有时会遇到困难，此时可以配置镜像加速器。国内很多云服务商都提供了国内加速器服务，可用的加速器可以参考：<https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6>。操作方式如下：

![截屏2024-01-30 16.06.39.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f1c1e8ea88f4286abc93b70aa16be32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2506\&h=1534\&s=433320\&e=png\&b=f8f8f9)

添加代码如下（这是我目前在用的，如果构建或者拉取的时候因为网络原因失败，就参考上面的文档更换新的加速器）：

```javascript
{
  // ...
  "max-concurrent-downloads": 2,
  "max-download-attempts": 10,
  "registry-mirrors": [
      "https://dockerproxy.com",
      "https://docker.mirrors.ustc.edu.cn",
      "https://docker.nju.edu.cn"
  ]
  // ...
}
```

## 入门 Docker

没有用过 Docker 的同学，让我们开始一个 30 分钟速度入门教程吧：

本地创建一个新的 Next.js 项目，运行：

```bash
npx create-next-app@latest
```

效果如下（这里怎么选都行，项目能正常运行就行）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/facae27227084f78a2d8260cf714139f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082\&h=400\&s=777895\&e=png\&b=17272d)

根目录新建 `.dockerignore`，写入：

```bash
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
docker
.git
```

作用类似于 `.gitignore`，排除不必要的文件和目录，以便在构建 Docker 镜像时，减小镜像大小并提高构建效率。

根目录新建 `Dockerfile`，写入：

```javascript
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --registry=https://registry.npmmirror.com && npm run build
CMD npm start
EXPOSE 3000
```

`Dockerfile` 是一个文本文件，用于定制镜像文件。其内的每一行都是一句指令（Instruction）。完整的指令和其含义可以参考 [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#dockerfile-reference)。这里简单说说用到的指令：

`FROM` 用于指定基础镜像。所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。而 FROM 就是指定 基础镜像，因此一个 Dockerfile 中 FROM 是必备的指令，并且必须是第一条指令。

在 [Docker Hub](https://hub.docker.com/search?q=\&type=image\&image_filter=official)上有非常多的高质量的官方镜像，有可以直接拿来使用的服务类的镜像，如 [nginx](https://hub.docker.com/_/nginx/)、[redis](https://hub.docker.com/_/redis/)、[mongo](https://hub.docker.com/_/mongo/)、[mysql](https://hub.docker.com/_/mysql/)、[httpd](https://hub.docker.com/_/httpd/)、[php](https://hub.docker.com/_/php/)、[tomcat](https://hub.docker.com/_/tomcat/)等；也有一些方便开发、构建、运行各种语言应用的镜像，如 [node](https://hub.docker.com/_/node)、[openjdk](https://hub.docker.com/_/openjdk/)、[python](https://hub.docker.com/_/python/)、[ruby](https://hub.docker.com/_/ruby/)、[golang](https://hub.docker.com/_/golang/)等。可以在其中寻找一个最符合我们最终目标的镜像为基础镜像进行定制。

这里我们选择了 `node:18-alpine` 这个镜像，node 完整的镜像版本和标签可以查看 [Docker Hub node](https://hub.docker.com/_/node)。这里之所以选择了 `18-alpine` 是参考了 [Next.js 的官方 Docker 示例代码](https://github.com/vercel/next.js/tree/canary/examples/with-docker)。

`WORKDIR`用于指定 Docker 的工作目录。如该目录不存在，WORKDIR 会帮你建立目录。

`COPY` 用于将文件拷贝到 Docker。第一个点表示源路径，第二个点表示目标路径。目标路径可以是容器内的绝对路径，也可以是相对于工作目录的相对路径，而工作目录可以用 `WORKDIR` 指令来指定。所以这个指令的意思就是简单粗暴的将当前目录的所有文件拷贝到 `/app`下。

`RUN` 用于执行命令行命令。这里我们安装了项目依赖。

`CMD` 用于指定容器启动命令。RUN 可以有多个，在镜像构建阶段执行。CMD 只能有一个，在容器启动后执行。前面说到，容器就是进程。既然是进程，那么在启动容器的时候，需要指定所运行的程序及参数。CMD 指令就是用于指定默认的容器主进程的启动命令的。

`EXPOSE` 用于声明容器运行时提供服务的端口。不过这只是一个声明，在容器运行时并不会因为这个声明应用就会开启这个端口的服务。但可以帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射。

进入项目根目录，运行命令，构建镜像文件：

```javascript
docker image build -t next-docker-learn-demo:0.0.1 .
```

`-t` 参数用来指定镜像文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是 `latest`。最后面还有一个 `.`，用于指定上下文路径。

多说一句：

1.  `docker build` 看似是在本地构建，其实是在服务端，也就是在 Docker 引擎中构建的，所以构建的时候需要加速器
2.  为了能够让服务端知道本地文件的位置，就需要指定上下文路径（也就是最后的 `.`），Docker 会将路径下的所有内容打包，然后上传给 Docker 引擎。这样 Docker 引擎收到这个上下文包后，展开就会获得构建镜像所需的一切文件

举个例子，如果在 Dockerfile 中这么写：`COPY ./package.json /app/`。这并不是要复制执行 `docker build `命令所在的目录下的 `package.json`，也不是复制 `Dockerfile` 所在目录下的 `package.json`，而是复制指定的上下文路径下的 `package.json`。

总结一下就是：构建不要浪。把 Dockerfile 写在项目根目录下，将所需的文件也都拷贝在根目录下，指定项目根目录为上下文路径。

构建效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/836cc4b8e4b54f888006d1412a92e8bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2548\&h=996\&s=2560425\&e=png\&b=120620)

构建了 2 分多钟吧。如果出现网络问题，关闭代理试试。构建完成后，可以在 Docker 客户端中查看：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60c4c3fae339406ea4ed765391aa0317~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2226\&h=1200\&s=315728\&e=png\&b=f8f8f9)

也可以在本地执行 `docker images` 查看镜像列表：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cdaaff86ad64e73a95fc879730230d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250\&h=108\&s=121056\&e=png\&b=060211)

现在有了镜像，我们开启一个容器运行我们的项目：

```javascript
docker run -p 4000:3000 next-docker-learn-demo:0.0.1
```

`-p` 用于指定端口映射，这里的意思是将容器的 `3000` 端口映射到主机的 `4000` 端口，此时效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f381f7b10aea4180bb7cf3329d8e3a07~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1354\&h=342\&s=511507\&e=png\&b=210b2a)

容器里项目正常运行，开在了容器的 3000 端口，映射到本地的 4000 端口，所以我们在本地打开 <http://localhost:4000/>，此时正常访问项目：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57e1badcbd3f47ccb8681ae116392ff6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2298\&h=1492\&s=457684\&e=png\&b=050505)

查看 Docker 客户端：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8420d57ffbd547f180873e4ffcf7b618~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2376\&h=1200\&s=354186\&e=png\&b=13171b)

我们可以对启动的容器进行启动、停止、删除等操作：

```bash
# 容器列表
docker container ls
# 停止容器
docker container stop container-id
# 启动容器
docker container start container-id
# 重启容器
docker container restart container-id
# 删除容器
docker container rm container-id
```

当然也可以直接在客户端中操作。

现在你已经有了一个镜像。就像 npm 包发布到 npm 上，你也可以将镜像发布到 Docker Hub。

首先去 <https://hub.docker.com/> 注册一个账户，当然你也可以在使用客户端的时候注册登录账号。运行 `docker login`，因为我已经在 Docker 客户端登录，执行效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82c77e2b6eb34117b20d9c63c9177797~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=684\&h=110\&s=102922\&e=png\&b=200e2a)

使用 `dcoker image tag` 标记本地镜像，将其归入某一仓库，运行：

```bash
# 格式如下：
# docker image tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
# 其中 yayu007 是我的 Docker Hub 账户名
docker image tag next-docker-learn-demo:0.0.1 yayu007/next-docker-learn-demo:0.0.1
```

\`
推送到 Docker Hub：

```bash
# 格式如下：
# docker image push [OPTIONS] NAME[:TAG]
docker image push yayu007/next-docker-learn-demo:0.0.1
```

效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ee85bd9805e4e5996780784cda97d10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1524\&h=346\&s=596020\&e=png\&b=180725)

发布完毕后，你可以在 Docker 客户端的 Images 下的 Hub 选项栏中查到：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45e6c3f790be46c78091d7f3a830fdb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2744\&h=1200\&s=334441\&e=png\&b=14191d)

对应的链接为：<https://hub.docker.com/layers/yayu007/next-docker-learn-demo/0.0.1/images/sha256:50b1b7cf09b4147ef60c14cd2297bbad441c1be8b55cd10a0e06be1e87cc9bb6>

推送到 Docker Hub 后，其他人就可以直接拉取我的镜像文件：

```bash
docker image pull yayu007/next-docker-learn-demo:0.0.1
```

然后运行 `docker run` 开启项目：

```bash
docker run -p 4000:3000 next-docker-learn-demo:0.0.1
```

## 入门 Docker Compose

实际开发中，肯定不会只用到 Next.js，还会用到 Nginx、Redis、MySQL 等环境。这里我们以 React Notes 的 day1 代码为例，演示如何开启并使用多个容器。

### 本地运行

下载我们的 day1 分支代码：

```bash
git clone -b day1 git@github.com:mqyqingfeng/next-react-notes-demo.git
```

大家还记得 day1 实现的效果吗？我们本地运行以下代码：

```bash
cd next-react-notes-demo && npm i && npm run dev
```

因为 day1 代码需要开启 redis 服务，所以另起一个命令行运行：

```bash
redis-server
```

等 Redis 服务成功开启，此时打开 <http://localhost:3000/>，页面正常访问：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3dc782394f143489bcbcf4a5ddd9ae7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800\&h=1188\&s=159776\&e=png\&b=f6f7fa)

左侧笔记列表的标题和时间取自于 Redis 数据库，说明代码运行正常。

### Redis 容器化

现在我们把 Redis 改为容器运行。先在刚才开启 redis-server 的窗口按 `Ctrl + C` 退出 Redis 服务，然后拉取 [redis](https://hub.docker.com/_/redis/) 镜像：

```bash
docker pull redis
```

当我们不带标签的时候，默认拉取的是 `redis:latest`。

镜像拉取完毕后，开启容器：

```bash
docker run -p 6379:6379 redis redis-server
```

这里我们将 Redis 开启的 6379 端口映射到本地的 6379 端口，替换掉了刚才在本地开启的 redis-server，所以此时访问 <http://localhost:3000/>，页面依然正常运行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4a64bb905434da4864ab373a8f0cfa5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800\&h=1188\&s=160248\&e=png\&b=f6f7fa)

### Next 项目容器化

现在我们将 Next.js 项目改为容器运行。前面我们讲过：

> 容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。

所以 Next.js 容器与 Redis 容器是相互隔离的。为此，我们需要实现容器互联。Docker 推荐将容器加入自定义的 Docker 网络的方式来连接多个容器。

创建一个自定义的网络：

```bash
docker network create -d bridge react-notes
```

`-d` 参数指定 Docker 网络类型，有 `bridge`、`overlay`。其中 `overlay` 网络类型用于 [Swarm mode](https://yeasy.gitbook.io/docker_practice/swarm_mode)。`react-notes` 为我们的自定义网络的名字。运行效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8298da7ba3fc46f793886a0d57cf341d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936\&h=68\&s=90247\&e=png\&b=160723)

我们在 Docker 客户端暂停或者删除之前开启的 Redis 容器，然后命令行运行一个新的 Redis 容器并连接到新建的 `react-notes` 网络：

```bash
docker run -p 6379:6379 --network react-notes redis redis-server
```

然后运行 `docker network inspect`查找 redis 容器的 IP 地址：

```bash
docker network inspect react-notes
```

![截屏2024-01-31 18.14.21.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96b61d96c252405da826a935ed810daf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1550\&h=1332\&s=1978503\&e=png\&b=0f051d)

修改 `lib/redis.js`如下：

```bash
// ...
const redis = new Redis({
  host: '172.19.0.2'
})
// ...
```

项目根目录新建 `Dockerfile`，代码如下：

```bash
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --registry=https://registry.npmmirror.com
CMD  npm run build && npm start
EXPOSE 3000
```

创建项目镜像：

```bash
docker image build -t next-react-notes-demo:0.0.1 .
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd2b8c1d6b1f4285840e2df9d83bfcc0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298\&h=716\&s=791104\&e=png\&b=080316)

运行项目容器并添加到 react-notes 网络中：

```bash
docker run -p 4000:3000 --network react-notes next-react-notes-demo:0.0.1
```

等 Redis 服务成功开启，此时打开 <http://localhost:4000/>，页面正常访问：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dc213b7f08a420194f40efa926e9153~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2448\&h=1602\&s=207315\&e=png\&b=f5f7fa)

### Docker Compose

如果让我们像这样一个个管理容器，着实有点麻烦，Docker 提供了 [Docker Compose](https://github.com/docker/compose?tab=readme-ov-file#docker-compose-v2) 用于容器的管理。使用 Compose，你只需要通过一个单独的 `docker-compose.yml`文件就可以定义一组相关联的应用容器。

Docker Desktop for Mac/Windows 自带 docker-compose 二进制文件，安装 Docker 之后可以直接使用。本地运行 `docker-compose --version`试试：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b9f6bf964bb4ba0822c5045d0f75883~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=790\&h=68\&s=72461\&e=png\&b=110620)

现在我们使用 Docker Compose 重新运行这个项目。项目根目录新建 `docker-compose.yml`文件，代码如下：

```javascript
version: '3.8'
services:

  redis:
    image: redis
    ports:
      - '6379:6379'
    command: redis-server
    
  nextapp:
    build: .
    ports:
     - '4000:3000'
    depends_on:
      - redis
```

模板文件的各种指令含义可以参考 [《Compose 模板文件》](https://yeasy.gitbook.io/docker_practice/compose/compose_file)。

上节创建的 `Dockerfile` 代码保持不变。修改 `lib/redis.js`：

```javascript
// ...
const redis = new Redis({
  host: 'redis'
})
// ...
```

最后根目录运行：

```bash
docker-compose up
```

运行这个命令，它会尝试自动完成包括构建镜像、（重新）创建服务、启动服务，并关联服务相关容器的一系列操作。大部分时候都可以直接通过该命令来启动一个项目。此时应该可以正常运行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d00e54ef1734251bb487a7cc8371e95~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2448\&h=1602\&s=207315\&e=png\&b=f5f7fa)

## 数据持久化

### Redis

现在我们已经用 Docker Compose 开启了一个 Redis 容器，但其中 Redis 的数据并不是持久的，一旦容器删除，数据也就丢失了。因为 day1 分支的代码还没有实现增删查改功能，所以我们使用 `docker exec` 进入容器进行操作：

```bash
# 查看 redis 容器的 container id
docker container ls
# 进入 redis 容器
docker exec -it b0a18 bash
```

其中 `-it`是 `-i` 和 `-t` 一起使用，用于开启一个交互模式的终端。如果出现这样的报错：

> OCI runtime exec failed: exec failed: unable to start container process: exec: "bash": executable file not found in \$PATH: unknown

可以改为使用 `docker exec -it b0a18 sh`试试。

当然最简单的方式还是使用客户端：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85928ea7bf3749fcb5e9a846e01dcccb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2236\&h=1512\&s=307557\&e=png\&b=000000)

使用哪种方式都行，现在我们进入容器删除一条数据：

```bash
# 开启 cli
redis-cli
# 查看 keys
keys *
# 查看 notes 数据
hgetAll notes
# 删除一条数据
hdel notes 1702459181837
# 再次查看数据
hgetAll notes
```

操作效果如下：

![截屏2024-02-01 23.14.56.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/223e0f10aa96453f83d84c13670900d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2588\&h=802\&s=1725016\&e=png\&b=220d3b)

现在我们已经删除了一条数据，不过打开 `http://localhost:4000/`，你会发现左侧的笔记列表数据不会有任何变化，这是 Next.js 编译的缘故，在 Next.js 编译页面的时候数据库有三条，所以我们重新编译一下 Next.js 项目试试。

先按 Ctrl + C 退出 Cli 界面，然后 Ctrl + A Ctrl + D 退出交互终端。运行：

```bash
# 查看 Next.js 项目的 container id
docker container ls
# 重启容器
docker container restart 74776b12c032
```

交互效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/981d4a9f54d04e328d9c7469147d2cb6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2298\&h=212\&s=377368\&e=png\&b=200c3d)

现在重新打开 <http://localhost:4000/>，数据确实少了一条：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b692c94901d642508f99bb3d88365b81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2024\&h=1194\&s=160003\&e=png\&b=f6f7fa)

然后我们删了所有容器，再重新开一个：

```bash
# 停止并删除所有容器
docker-compose down
# 运行容器
docker-compose up
```

交互效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85402ed4aae6432daad5de6a9ed1bfeb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1656\&h=722\&s=1081845\&e=png\&b=1f0c3b)

现在重新打开 <http://localhost:4000/>，页面又恢复到了初始生成的三条，也就是说，操作的数据全丢了，一切又从头开始了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ee1b30ea2b74ce4bcef61a6de6cac21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2022\&h=1192\&s=165176\&e=png\&b=f6f7fa)

所以我们需要数据持久化。那么怎么实现数据持久化呢？

我们将容器里的数据库数据同步到主机的文件中不就可以了吗？Docker 提供了名为数据卷（volumes）的功能，它会将数据存在主机文件系统的某个区域，该区域由 Docker 来进行管理，其他非 Docker 程序不要乱动其中的数据。

现在我们在项目的根目录下建立一个名为 `redis`的文件夹，在其中再建立一个名为 `data`的文件夹存放数据。修改 `docker-compose.yml`如下：

```yaml
version: '3.8'
services:

  redis:
    image: redis
    ports:
      - '6379:6379'
    command: redis-server
    volumes:
      - ./redis/data:/data
    
  nextapp:
    build: .
    ports:
     - '4000:3000'
    depends_on:
      - redis
```

其中`./redis/data:/data`表示将一个地址为 `./redis/data`的 volume 挂载到 Redis 容器的 `/data`目录。这个目录正是 Redis 存放数据的地方。镜像中的被指定为挂载点的目录中的文件会复制到数据卷中。

现在我们删除掉之前的镜像，再重新构建的镜像，因为数据做了持久化，再重复一遍刚才的操作再次打开地址的时候，数据还会是之前的两条。

`/redis/data`会在运行 `docker-compose down` 的时候产生一个 `dump.rdb`文件。这个文件是二进制文件，正是 Redis 数据的全量备份。运行 `docker-compose up` 的时候，redis 又会读取加载这个文件，由此实现了数据持久化。

注：为什么是 `dump.rdb` 这个文件就要说到 Redis 的持久化机制了。Redis 的持久化机制有两种，一种是 RDB（Redis Database），一种是 AOF（Append Only File）。简单的理解：RDB 是一次快照，AOF 是连续增量备份。默认是 RDB，开启 Redis 容器时的 `--appendonly` 参数开启的正是 AOF。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18f0a49cc00547f087e496ecb1a57def~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1236\&h=386\&s=73936\&e=png\&a=1\&b=2c242f)

### 数据卷

目前我们是随便指定了一个目录作为数据卷，其实 Docker 本身就提供了创建数据卷的方法：

```bash
docker volume create my-vol
```

查看数据卷：

```bash
docker volume ls
```

该数据卷其实也对应了主机的一个位置，运行：

```bash
docker volume inspect my-vol
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4de46ceda7a4a10ba60ccb1e96dda98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942\&h=416\&s=302499\&e=png\&b=260d3f)

可以看出，创建的数据卷的地址为 `/var/lib/docker/volumes/my-vol/_data`。

我们先看下如何在 `docker-compose.yml` 文件中使用：

```bash
version: '3.8'

volumes:
  redis-data:

services:

  redis:
    image: redis
    ports:
      - '6379:6379'
    command: redis-server
    volumes:
      - redis-data:/data
    
  nextapp:
    build: .
    ports:
     - '4000:3000'
    depends_on:
      - redis
```

其中：

```bash
volumes:
  redis-data:
```

用来创建名为 `redis-data` 的数据卷，使用 `- redis-data:/data`挂载到容器。

我们删除掉之前的镜像，重新构建镜像文件。其实也不用像刚才那样删除容器再开启容器，之前只是为了帮助大家学习一些操作命令，其实把 redis 容器重启一下就会产生备份数据。

那这次数据卷对应的本机的位置在哪里呢？

刚才演示创建的 `my-vol`的地址在 `/var/lib/docker/volumes/my-vol/_data`，那 `redis-data` 的地址应该在 `/var/lib/docker/volumes/redis-data/_data`，我们试着 inspect 一下。

你会发现，发现找不到 `redis-data` 这个卷，其实是因为名字写错了，完整的名字应该是 `next-react-notes-demo_redis-data`，中间用下划线连接：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ddb46f339e04d4c92d601939b1cc42e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1348\&h=654\&s=760592\&e=png\&b=30103d)

但 MacOS 下打开这个地址，你会发现并没有这个目录。这是因为 Docker 放在了虚拟机（VM）里，我们运行：

```bash
# 开启容器
docker run -it --privileged --pid=host debian nsenter -t 1 -m -u -n -i sh
# 进入目录
cd /var/lib/docker/volumes
# 查看文件
ls
# 再进入相关的目录
cd next-react-notes-demo_redis-data/_data
# ls
```

交互效果如下：

![截屏2024-02-02 11.00.33.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e893391babc47488005859ee6670444~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360\&h=1026\&s=1439957\&e=png\&b=2b0f3d)

### Redis 配置

Docker 中使用 Redis 都已经介绍了这么多，来都来了，我们再介绍一下 redis 容器如何使用 redis 配置文件。

首先搞一个配置文件，有两种方式：

1.  打开 <https://redis.io/docs/management/config/> 保存一个对应版本的 `redis.conf`文件

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ecf9df3696945cdb1c9ee66ba0d0f48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2688\&h=1322\&s=683964\&e=png\&b=ffffff)

注：不知道你的 Redis 版本？就是你拉取 Redis 镜像的那个版本，默认是 `latest`，目前是 `7.2.4`，可以在 [Docker Hub Redis](https://hub.docker.com/_/redis) 中查看。此外容器启动的时候也会显示版本：

![截屏2024-02-02 11.34.37.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6286dbd13ab7431eae82d25b72d9fe71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2266\&h=632\&s=209589\&e=png\&b=f6f6f7)

进入容器使用 `redis-cli`输入 `info`命令也行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/911c4d32deac4193a008b77650a8bfe0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732\&h=676\&s=186078\&e=png\&b=f7f7f8)

2.  下载 redis 压缩包，地址为：<http://www.redis.cn/download.html>  或者 <https://download.redis.io/releases/>，下载后解压会在项目根目录看到一个 `redis.conf`文件

将这个配置文件放到项目根目录 `/redis`下（放其他位置也行）。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/239fce35598a4aa791b2e194af033d9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234\&h=376\&s=66974\&e=png\&a=1\&b=fefefe)

修改 `redis.confg`，因为下载的文件是默认配置项，用在容器时，需要修改一些：

```bash
# 这句要注释掉，127.0.0.1 是本机 IP，只能容器内部使用 redis，因为需要外部连接，所以注释掉
# bind 127.0.0.1 ::1

# 默认情况下，Redis 不作为守护进程运行
daemonize no

# 关闭保护模式，会阻止外部连接
# protected-mode yes
```

还有些其他的（视情况选择）：

```bash
# 开启 AOF 持久化
appendonly yes
# 开启密码，注释表示不需要密码
# requirepass foobared

# 指定 redis 最大内存
maxmemory 500mb
# 当内存到达上限，使用 LRU 算法删除部分 key，释放空间
maxmemory-policy volatile-lru
```

修改 `docker-compose.yml`：

```bash
version: '3.8'

volumes:
  redis-data:

services:

  redis:
    image: redis
    ports:
      - '6379:6379'
    command: redis-server /etc/redis/redis.conf
    volumes:
      - redis-data:/data
      - ./redis:/etc/redis
    
  nextapp:
    build: .
    ports:
     - '4000:3000'
    depends_on:
      - redis
```

删除之前的容器，重新构建镜像运行，查看 Redis 容器日志：

之前是：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95a6303bb39b4b97aa1d22b5d0591960~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2156\&h=306\&s=141346\&e=png\&b=ffffff)

会变成：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9412538163c240f4a431eb765277c768~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2004\&h=120\&s=57922\&e=png\&b=ffffff)

此外容器启动的时候如果有这个 warning：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6a98346d4f64f2ea41b7b30298b4cb3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2192\&h=162\&s=78455\&e=png\&b=ffffff)

可以参考 <https://github.com/docker-library/redis/issues/346> 和 <https://github.com/nextcloud/all-in-one/discussions/1731> 修复这个 warning。

## 总结

那么今天的内容就结束了，本篇以 Docker 部署一个简单的带 redis 数据库的 Next.js 项目为例，带大家熟悉 Docker 和 Docker Compose 的常用命令，以及如何做数据持久化。熟悉 Docker 的同学就请直接进入下篇实战篇吧！

## 参考链接

1.  <https://yeasy.gitbook.io/docker_practice/>
2.  <https://dunwu.github.io/linux-tutorial/docker/>
3.  <https://github.com/docker-library/redis/issues/45>
4.  <https://redis.io/docs/management/persistence/>
5.  <https://hub.docker.com/_/redis>
