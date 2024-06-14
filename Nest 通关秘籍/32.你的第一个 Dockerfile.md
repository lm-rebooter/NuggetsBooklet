上节我们通过 desktop 从 docker hub 拉取了 nginx 的镜像，并把它跑了起来。

跑这个镜像的时候指定了映射的端口、挂载的数据卷、环境变量等。

跑起来的容器就已经有可用的 nginx 服务了。

那如果我们要自己制作一个这样的镜像，怎么做呢？

docker 容器内就是一个独立的系统环境，想想如果在这样一个系统上，要安装 nginx 服务，怎么做呢？

需要执行一些命令、复制一些文件进来，然后启动服务。

制作镜像自然也要进行这样的过程，不过可以自动化。

只要在 dockerfile 里声明要做哪些事情，docker build 的时候就会根据这个 dockerfile 来自动化构建出一个镜像来。

比如这样：

    FROM node:latest

    WORKDIR /app

    COPY . .

    RUN npm config set registry https://registry.npmmirror.com/

    RUN npm install -g http-server

    EXPOSE 8080

    CMD ["http-server", "-p", "8080"]

这些指令的含义如下：

*   FROM：基于一个基础镜像来修改
*   WORKDIR：指定当前工作目录
*   COPY：把容器外的内容复制到容器内
*   EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
*   RUN：在容器内执行命令
*   CMD：容器启动的时候执行的命令

我们先通过 FROM 继承了 node 基础镜像，里面就有 npm、node 这些命令了。

通过 WORKDIR 指定当前目录。

然后通过 COPY 把 Dockerfile 同级目录下的内容复制到容器内，这里的 . 也就是 /app 目录

之后通过 RUN 执行 npm install，全局安装 http-server

通过 EXPOSE 指定要暴露的端口

CMD 指定容器跑起来之后执行的命令，这里就是执行 http-server 把服务跑起来。

把这个文件保存为 Dockerfile，然后在同级添加一个 index.html

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bb70bf7afb14bb7af6ca6cdf1b72b29~tplv-k3u1fbpfcp-watermark.image?)

然后通过 docker build 就可以根据这个 dockerfile 来生成镜像。

    docker build -t aaa:ccc .

aaa 是镜像名，ccc 是镜像的标签

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78b75cad62c14aa5bde5455b81fe817c~tplv-k3u1fbpfcp-watermark.image?)

FROM 是继承一个基础镜像，看输出也可以看出来，前面都是 node 镜像的内容，会一层层下载下来。

最后才是本地的我们添加的那些。

这时你在 desktop 的 images 列表里就可以看到这个镜像了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29f516c1f3874802b3822e2b61d071d7~tplv-k3u1fbpfcp-watermark.image?)

然后执行 docker run 把这个镜像跑起来，用 desktop 我们就直接点击 run 按钮了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78eaea612f654aae896f8760a0b860de~tplv-k3u1fbpfcp-watermark.image?)

会让你输入这些内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e791bc3f1bbb4dc8bf8698c556618cb7~tplv-k3u1fbpfcp-watermark.image?)

是不是上节用 nginx 镜像的感觉回来了？这次是我们自己 build 的镜像。

指定容器名、映射的端口、点击 run：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91c03c09b625413bbb3afde49c073572~tplv-k3u1fbpfcp-watermark.image?)

然后可以看到容器内的日志，服务启动成功了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ab0a16d25054400a07f53ac683d1c30~tplv-k3u1fbpfcp-watermark.image?)

当然，容器内打印的是 8080 端口，但在容器外要用映射的 8888 端口访问：

访问 <http://localhost:8888> 就可以看到我们在 html 写的内容了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90d4381f765f4980be3bc24f523fc96d~tplv-k3u1fbpfcp-watermark.image?)

在容器内页打印了一条访问日志：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2874fd653694bf1a3ca88edf058cce5~tplv-k3u1fbpfcp-watermark.image?)

至此，我们写的第一个 dockerfile 和 build 出的第一个镜像就跑成功了！

我们在 files 里看看 /app 下是啥内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3301630ab724feabdde84a9cc1fcc21~tplv-k3u1fbpfcp-watermark.image?)

双击 index.html，可以看到这就是我们 build 镜像的时候 COPY 进去的文件。

但是我们想修改静态文件怎么办呢？

进入容器内改太麻烦，不如把这个 /app 目录设置为挂载点吧。

这样改下 Dockerfile：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/694c7d53c1f64ef4972cb1beda771ba8~tplv-k3u1fbpfcp-watermark.image?)

然后重新 build 出一个镜像来：

    docker build -t aaa:ddd -f 2.Dockerfile .

因为现在不是默认的 Dockerfile 了，需要用 -f 指定下 dockefile 的文件名。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b16cdc1821fe4f1e8d0f2d3827832c52~tplv-k3u1fbpfcp-watermark.image?)

构建完之后再 run 一下这个新镜像：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd9d4f456c7c4554a7cedf33a0ee15a7~tplv-k3u1fbpfcp-watermark.image?)

这次我把我的桌面目录作为数据卷挂载到 /app 目录了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10602e44e26f4e019c26276ac59947ca~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/432ed7adea09434a9055134b95899c5e~tplv-k3u1fbpfcp-watermark.image?)

容器跑起来后可以看到确实挂载上去了，也标识为了 mount：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd2ca0036d214d5c991da9d67ea08cd8~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/464690f71f7e46b79b300ba16416a725~tplv-k3u1fbpfcp-watermark.image?)

在 inspect 这里也可以看到挂载的目录：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f681b0ce058d48e4b9c0e374bdb03d18~tplv-k3u1fbpfcp-watermark.image?)

有同学说，就算不在 dockerfile 里指定 VOLUME，我还是可以 docker run 的时候通过 -v 挂载数据卷呀。

那我为啥还要指定 VOLUME？

在 dockerfile 里指定 VOLUME 之后，如果你 docker run 的时候没有带 -v，那会放在一个临时的目录里。

比如我直接点击 run，不设置参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45e670e6bf204940a427ad320fb1b404~tplv-k3u1fbpfcp-watermark.image?)

docker 会随机给他生成一个名字。

还会随机生成一个目录作为数据卷挂载上去：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e5e60a80cab49a595ae9aa7cc083881~tplv-k3u1fbpfcp-watermark.image?)

inspect 可以看到这时候的路径是一个临时的目录：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42c87675dbf64458a343c3f349eb736a~tplv-k3u1fbpfcp-watermark.image?)

这样就算你删了容器，数据也可以在这里找回。

设想下，如果你跑了个 mysql 容器，存了很多数据，但是跑容器的时候没指定数据卷。有一天，你把容器删了，所有数据都没了，可不可怕？

为了避免这种情况，mysql 的 dockerfile 里是必须声明 volume 的，这样就算你没通过 -v 指定数据卷，将来也可以找回数据。

在镜像详情可以看到 mysql 的 dockerfile，确实声明了 volume

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f8305a1fec941b58a29d40fe46ae6c0~tplv-k3u1fbpfcp-watermark.image?)

这样就能保证数据不丢失。

dockerfile 在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/docker-test)。

## 总结

docker 镜像是通过 dockerfile 构建出来的。

我们写了第一个 dockerfile，通过 FROM、WORKDIR、COPY、RUN、EXPOSE、CMD 等指令声明了一个 http-server 提供静态服务的镜像。

docker run 这个镜像就可以生成容器，指定映射的端口、挂载的数据卷、环境变量等。

VOLUME 指令看起来没啥用，但能保证你容器内某个目录下的数据一定会被持久化，能保证没挂载数据卷的时候，数据不丢失。

写完这个 dockerfile，相信你会对 docker 镜像、容器有更具体的理解了。
