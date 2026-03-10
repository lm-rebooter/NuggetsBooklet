# 通过 Dockerfile 创建镜像

由于 Docker 镜像的结构优势，使它的占用空间远小于普通的虚拟机镜像，而这就大幅减少了 Docker 镜像在网络或者其他介质中转移所花费的时间，进而提高了我们进行迁移部署的效率。不过，你要是以为这就是 Docker 能够快速部署的终极大招那就大错特错了。在这一小节里，我们将谈到 Docker 特有的镜像构建定义文件，也就是 Dockerfile。通过了解它，你能真正体验一种进行秒级镜像迁移的乐趣。

## 关于 Dockerfile

Dockerfile 是 Docker 中用于定义镜像自动化构建流程的配置文件，在 Dockerfile 中，包含了构建镜像过程中需要执行的命令和其他操作。通过 Dockerfile 我们可以更加清晰、明确的给定 Docker 镜像的制作过程，而由于其仅是简单、小体积的文件，在网络等其他介质中传递的速度极快，能够更快的帮助我们实现容器迁移和集群部署。

![](https://user-gold-cdn.xitu.io/2018/10/1/1662ee4fdf802776?w=1047&h=332&f=png&s=55112)

通常来说，我们对 Dockerfile 的定义就是针对一个名为 Dockerfile 的文件，其虽然没有扩展名，但本质就是一个文本文件，所以我们可以通过常见的文本编辑器或者 IDE 创建和编辑它。

Dockerfile 的内容很简单，主要以两种形式呈现，一种是注释行，另一种是指令行。

```
# Comment
INSTRUCTION arguments

```

在 Dockerfile 中，拥有一套独立的指令语法，其用于给出镜像构建过程中所要执行的过程。Dockerfile 里的指令行，就是由指令与其相应的参数所组成。

### 环境搭建与镜像构建

如果具体来说 Dockerfile 的作用和其实际运转的机制，我们可以用一个我们开发中的常见流程来比较。

在一个完整的开发、测试、部署过程中，程序运行环境的定义通常是由开发人员来进行的，因为他们更加熟悉程序运转的各个细节，更适合搭建适合程序的运行环境。

在这样的前提下，为了方便测试和运维搭建相同的程序运行环境，常用的做法是由开发人员编写一套环境搭建手册，帮助测试人员和运维人员了解环境搭建的流程。

而 Dockerfile 就很像这样一个环境搭建手册，因为其中包含的就是一个构建容器的过程。

而比环境搭建手册更好的是，Dockerfile 在容器体系下能够完成自动构建，既不需要测试和运维人员深入理解环境中各个软件的具体细节，也不需要人工执行每一个搭建流程。

## 编写 Dockerfile

相对于之前我们介绍的提交容器修改，再进行镜像迁移的方式相比，使用 Dockerfile 进行这项工作有很多优势，我总结了几项尤为突出的。

*   Dockerfile 的体积远小于镜像包，更容易进行快速迁移和部署。
*   环境构建流程记录了 Dockerfile 中，能够直观的看到镜像构建的顺序和逻辑。
*   使用 Dockerfile 来构建镜像能够更轻松的实现自动部署等自动化流程。
*   在修改环境搭建细节时，修改 Dockerfile 文件要比从新提交镜像来的轻松、简单。

事实上，在实际使用中，我们也很少会选择容器提交这种方法来构建镜像，而是几乎都采用 Dockerfile 来制作镜像。所以说，学会 Dockerfile 的编写是所有熟练使用 Docker 的开发者必须掌握的能力。

纸上得来终觉浅，光说很多关于 Dockerfile 的概念其实对我们开发使用来说意义不大，这里我们直接学习如何编写一个用于构建镜像的 Dockerfile。

首先我们来看一个完整的 Dockerfile 的例子，这是用于构建 Docker 官方所提供的 Redis 镜像的 Dockerfile 文件。

```
FROM debian:stretch-slim

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN groupadd -r redis && useradd -r -g redis redis

# grab gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
ENV GOSU_VERSION 1.10
RUN set -ex; \
	\
	fetchDeps=" \
		ca-certificates \
		dirmngr \
		gnupg \
		wget \
	"; \
	apt-get update; \
	apt-get install -y --no-install-recommends $fetchDeps; \
	rm -rf /var/lib/apt/lists/*; \
	\
	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
	export GNUPGHOME="$(mktemp -d)"; \
	gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	gpgconf --kill all; \
	rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc; \
	chmod +x /usr/local/bin/gosu; \
	gosu nobody true; \
	\
	apt-get purge -y --auto-remove $fetchDeps

ENV REDIS_VERSION 3.2.12
ENV REDIS_DOWNLOAD_URL http://download.redis.io/releases/redis-3.2.12.tar.gz
ENV REDIS_DOWNLOAD_SHA 98c4254ae1be4e452aa7884245471501c9aa657993e0318d88f048093e7f88fd

# for redis-sentinel see: http://redis.io/topics/sentinel
RUN set -ex; \
	\
	buildDeps=' \
		wget \
		\
		gcc \
		libc6-dev \
		make \
	'; \
	apt-get update; \
	apt-get install -y $buildDeps --no-install-recommends; \
	rm -rf /var/lib/apt/lists/*; \
	\
	wget -O redis.tar.gz "$REDIS_DOWNLOAD_URL"; \
	echo "$REDIS_DOWNLOAD_SHA *redis.tar.gz" | sha256sum -c -; \
	mkdir -p /usr/src/redis; \
	tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1; \
	rm redis.tar.gz; \
	\
# disable Redis protected mode [1] as it is unnecessary in context of Docker
# (ports are not automatically exposed when running inside Docker, but rather explicitly by specifying -p / -P)
# [1]: https://github.com/antirez/redis/commit/edd4d555df57dc84265fdfb4ef59a4678832f6da
	grep -q '^#define CONFIG_DEFAULT_PROTECTED_MODE 1$' /usr/src/redis/src/server.h; \
	sed -ri 's!^(#define CONFIG_DEFAULT_PROTECTED_MODE) 1$!\1 0!' /usr/src/redis/src/server.h; \
	grep -q '^#define CONFIG_DEFAULT_PROTECTED_MODE 0$' /usr/src/redis/src/server.h; \
# for future reference, we modify this directly in the source instead of just supplying a default configuration flag because apparently "if you specify any argument to redis-server, [it assumes] you are going to specify everything"
# see also https://github.com/docker-library/redis/issues/4#issuecomment-50780840
# (more exactly, this makes sure the default behavior of "save on SIGTERM" stays functional by default)
	\
	make -C /usr/src/redis -j "$(nproc)"; \
	make -C /usr/src/redis install; \
	\
	rm -r /usr/src/redis; \
	\
	apt-get purge -y --auto-remove $buildDeps

RUN mkdir /data && chown redis:redis /data
VOLUME /data
WORKDIR /data

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 6379
CMD ["redis-server"]

```

其中可以很明确的见到我们之前说的 Dockerfile 文件的两种行结构，也就是指令行和注释行，接下来我们着重关注指令行，因为这是构建镜像的关键。

### Dockerfile 的结构

总体上来说，我们可以将 Dockerfile 理解为一个由上往下执行指令的脚本文件。当我们调用构建命令让 Docker 通过我们给出的 Dockerfile 构建镜像时，Docker 会逐一按顺序解析 Dockerfile 中的指令，并根据它们不同的含义执行不同的操作。

如果进行细分，我们可以将 Dockerfile 的指令简单分为五大类。

*   **基础指令**：用于定义新镜像的基础和性质。
*   **控制指令**：是指导镜像构建的核心部分，用于描述镜像在构建过程中需要执行的命令。
*   **引入指令**：用于将外部文件直接引入到构建镜像内部。
*   **执行指令**：能够为基于镜像所创建的容器，指定在启动时需要执行的脚本或命令。
*   **配置指令**：对镜像以及基于镜像所创建的容器，可以通过配置指令对其网络、用户等内容进行配置。

这五类命令并非都会出现在一个 Dockerfile 里，但却对基于这个 Dockerfile 所构建镜像形成不同的影响。

## 常见 Dockerfile 指令

熟悉 Dockerfile 的指令是编写 Dockerfile 的前提，这里我们先来介绍几个最常见的 Dockerfile 指令，它们基本上囊括了所有 Dockerfile 中 90% 以上的工作。

### FROM

通常来说，我们不会从零开始搭建一个镜像，而是会选择一个已经存在的镜像作为我们新镜像的基础，这种方式能够大幅减少我们的时间。

在 Dockerfile 里，我们可以通过 FROM 指令指定一个基础镜像，接下来所有的指令都是基于这个镜像所展开的。在镜像构建的过程中，Docker 也会先获取到这个给出的基础镜像，再从这个镜像上进行构建操作。

FROM 指令支持三种形式，不管是哪种形式，其核心逻辑就是指出能够被 Docker 识别的那个镜像，好让 Docker 从那个镜像之上开始构建工作。

```
FROM <image> [AS <name>]
FROM <image>[:<tag>] [AS <name>]
FROM <image>[@<digest>] [AS <name>]

```

既然选择一个基础镜像是构建新镜像的根本，那么 Dockerfile 中的第一条指令必须是 FROM 指令，因为没有了基础镜像，一切构建过程都无法开展。

当然，一个 Dockerfile 要以 FROM 指令作为开始并不意味着 FROM 只能是 Dockerfile 中的第一条指令。在 Dockerfile 中可以多次出现 FROM 指令，当 FROM 第二次或者之后出现时，表示在此刻构建时，要将当前指出镜像的内容合并到此刻构建镜像的内容里。这对于我们直接合并两个镜像的功能很有帮助。

### RUN

镜像的构建虽然是按照指令执行的，但指令只是引导，最终大部分内容还是控制台中对程序发出的命令，而 RUN 指令就是用于向控制台发送命令的指令。

在 RUN 指令之后，我们直接拼接上需要执行的命令，在构建时，Docker 就会执行这些命令，并将它们对文件系统的修改记录下来，形成镜像的变化。

```
RUN <command>
RUN ["executable", "param1", "param2"]

```

RUN 指令是支持 \\ 换行的，如果单行的长度过长，建议对内容进行切割，方便阅读。而事实上，我们会经常看到 \\ 分割的命令，例如在上面我们贴出的 Redis 镜像的 Dockerfile 里。

### ENTRYPOINT 和 CMD

基于镜像启动的容器，在容器启动时会根据镜像所定义的一条命令来启动容器中进程号为 1 的进程。而这个命令的定义，就是通过 Dockerfile 中的 ENTRYPOINT 和 CMD 实现的。

```
ENTRYPOINT ["executable", "param1", "param2"]
ENTRYPOINT command param1 param2

CMD ["executable","param1","param2"]
CMD ["param1","param2"]
CMD command param1 param2

```

ENTRYPOINT 指令和 CMD 指令的用法近似，都是给出需要执行的命令，并且它们都可以为空，或者说是不在 Dockerfile 里指出。

当 ENTRYPOINT 与 CMD 同时给出时，CMD 中的内容会作为 ENTRYPOINT 定义命令的参数，最终执行容器启动的还是 ENTRYPOINT 中给出的命令。

关于 ENTRYPOINT 和 CMD 的更详细对比，在后一节里我们会提到。

### EXPOSE

在[第 9 节：为容器配置网络](https://juejin.im/book/5b7ba116e51d4556f30b476c/section/5b8381a56fb9a019ba684035)中，在未做特殊定义的前提下，我们直接连接容器网络，只能访问容器明确暴露的端口。而我们之前介绍的是在容器创建时通过选项来暴露这些端口。

由于我们构建镜像时更了解镜像中应用程序的逻辑，也更加清楚它需要接收和处理来自哪些端口的请求，所以在镜像中定义端口暴露显然是更合理的做法。

通过 EXPOSE 指令就可以为镜像指定要暴露的端口。

```
EXPOSE <port> [<port>/<protocol>...]

```

当我们通过 EXPOSE 指令配置了镜像的端口暴露定义，那么基于这个镜像所创建的容器，在被其他容器通过 `--link` 选项连接时，就能够直接允许来自其他容器对这些端口的访问了。

### VOLUME

在一些程序里，我们需要持久化一些数据，比如数据库中存储数据的文件夹就需要单独处理。在之前的小节里，我们提到可以通过数据卷来处理这些问题。

但使用数据卷需要我们在创建容器时通过 `-v` 选项来定义，而有时候由于镜像的使用者对镜像了解程度不高，会漏掉数据卷的创建，从而引起不必要的麻烦。

还是那句话，制作镜像的人是最清楚镜像中程序工作的各项流程的，所以它来定义数据卷也是最合适的。所以在 Dockerfile 里，提供了 VOLUME 指令来定义基于此镜像的容器所自动建立的数据卷。

```
VOLUME ["/data"]

```

在 VOLUME 指令中定义的目录，在基于新镜像创建容器时，会自动建立为数据卷，不需要我们再单独使用 `-v` 选项来配置了。

### COPY 和 ADD

在制作新的镜像的时候，我们可能需要将一些软件配置、程序代码、执行脚本等直接导入到镜像内的文件系统里，使用 COPY 或 ADD 指令能够帮助我们直接从宿主机的文件系统里拷贝内容到镜像里的文件系统中。

```
COPY [--chown=<user>:<group>] <src>... <dest>
ADD [--chown=<user>:<group>] <src>... <dest>

COPY [--chown=<user>:<group>] ["<src>",... "<dest>"]
ADD [--chown=<user>:<group>] ["<src>",... "<dest>"]

```

COPY 与 ADD 指令的定义方式完全一样，需要注意的仅是当我们的目录中存在空格时，可以使用后两种格式避免空格产生歧义。

对比 COPY 与 ADD，两者的区别主要在于 ADD 能够支持使用网络端的 URL 地址作为 src 源，并且在源文件被识别为压缩包时，自动进行解压，而 COPY 没有这两个能力。

虽然看上去 COPY 能力稍弱，但对于那些不希望源文件被解压或没有网络请求的场景，COPY 指令是个不错的选择。

## 构建镜像

在编写好 Dockerfile 之后，我们就可以构建我们所定义的镜像了，构建镜像的命令为 `docker build`。

```
$ sudo docker build ./webapp

```

`docker build` 可以接收一个参数，需要特别注意的是，这个参数为一个目录路径 ( 本地路径或 URL 路径 )，而并非 Dockerfile 文件的路径。在 `docker build` 里，这个我们给出的目录会作为构建的环境目录，我们很多的操作都是基于这个目录进行的。

例如，在我们使用 COPY 或是 ADD 拷贝文件到构建的新镜像时，会以这个目录作为基础目录。

在默认情况下，`docker build` 也会从这个目录下寻找名为 Dockerfile 的文件，将它作为 Dockerfile 内容的来源。如果我们的 Dockerfile 文件路径不在这个目录下，或者有另外的文件名，我们可以通过 `-f` 选项单独给出 Dockerfile 文件的路径。

```
$ sudo docker build -t webapp:latest -f ./webapp/a.Dockerfile ./webapp

```

当然，在构建时我们最好总是携带上 `-t` 选项，用它来指定新生成镜像的名称。

```
$ sudo docker build -t webapp:latest ./webapp

```

## 留言互动

在本节中，我们介绍了关于 Dockerfile 以及关于它基本使用方面的内容。这里给大家留一道实践题：

> 编写一个你自己的程序的 Dockerfile，并将它共享给测试和运维人员。

欢迎大家通过留言的方式说出你的实践之路。我会选出有代表性的优质留言，推荐给大家。

同时，如果你对 Dockerfile 的基本使用还有疑问，或者有更好的实践角度，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。