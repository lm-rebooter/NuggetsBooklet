# 使用 Docker Compose 管理容器

通过之前的介绍，我们已经基本掌握了构建、运行容器的方法，但这还远远不够，由于 Docker 采用轻量级容器的设计，每个容器一般只运行一个软件，而目前绝大多数应用系统都绝不是一个软件所能组成的。虽然我们之前提到了容器间互相连接、交换数据的各种方法，通过这些方法足以搭建起完整的用于应用系统运行的容器群，但是这显然还不够，这个容器群的搭建需要执行太多命令，更重要的是需要考虑太多应用和容器间的依赖关系处理，是一波令人头大的操作。在这一节中，我们就来介绍如何解决这些问题。

## 解决容器管理问题

拿任何一个相对完整的应用系统来说，都不可能是由一个程序独立支撑的，而对于使用 Docker 来部署的分布式计算服务更是这样。随着时代的发展和技术演进，我们越来越推崇将大型服务拆分成较小的微服务，分别部署到独立的机器或容器中。也就是说，我们的应用系统往往由数十个甚至上百个应用程序或微服务组成。即使是一个小的微服务模块，通常都需要多个应用协作完成工作。

我们编写一个小型的微服务模块，虽然我们编写代码主要针对的是其中的应用部分，但如果我们要完整的进行开发、测试，与应用相关的周边软件必然是必不可少的。

虽然 Docker Engine 帮助我们完成了对应用运行环境的封装，我们可以不需要记录复杂的应用环境搭建过程，通过简单的配置便可以将应用运行起来了，但这只是针对单个容器或单个应用程序来说的。如果延伸到由多个应用组成的应用系统，那情况就稍显复杂了。

就拿最简单的例子来说吧，如果我们要为我们的应用容器准备一个 MySQL 容器和一个 Redis 容器，那么在每次启动时，我们先要将 MySQL 容器和 Redis 容器启动起来，再将应用容器运行起来。这其中还不要忘了在创建应用容器时将容器网络连接到 MySQL 容器和 Redis 容器上，以便应用连接上它们并进行数据交换。

这还不够，如果我们还对容器进行了各种配置，我们最好还得将容器创建和配置的命令保存下来，以便下次可以直接使用。

如果我们要想让这套体系像 `docker run` 和 `docker rm` 那样自如的进行无痕切换，那就更加麻烦了，我们可能需要编写一些脚本才能不至于被绕到命令的毛线球里。

说了这么多，其实核心还是缺少一个对容器组合进行管理的东西。

### Docker Compose

针对这种情况，我们就不得不引出在我们开发中最常使用的多容器定义和运行软件，也就是 Docker Compose 了。

如果说 Dockerfile 是将容器内运行环境的搭建固化下来，那么 Docker Compose 我们就可以理解为将多个容器运行的方式和配置固化下来。

![](https://user-gold-cdn.xitu.io/2018/10/4/1663e6a38cd88368?w=1600&h=704&f=png&s=781358)

在 Docker Compose 里，我们通过一个配置文件，将所有与应用系统相关的软件及它们对应的容器进行配置，之后使用 Docker Compose 提供的命令进行启动，就能让 Docker Compose 将刚才我们所提到的那些复杂问题解决掉。

## 安装 Docker Compose

虽然 Docker Compose 目前也是由 Docker 官方主要维护，但其却不属于 Docker Engine 的一部分，而是一个独立的软件。所以如果我们要在 Linux 中使用它，还必须要单独下载使用。

Docker Compose 是一个由 Python 编写的软件，在拥有 Python 运行环境的机器上，我们可以直接运行它，不需要其它的操作。

我们可以通过下面的命令下载 Docker Compose 到应用执行目录，并附上运行权限，这样 Docker Compose 就可以在机器中使用了。

```
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
$
$ sudo docker-compose version
docker-compose version 1.21.2, build a133471
docker-py version: 3.3.0
CPython version: 3.6.5
OpenSSL version: OpenSSL 1.0.1t  3 May 2016

```

我们也能够通过 Python 的包管理工具 pip 来安装 Docker Compose。

```
$ sudo pip install docker-compose

```

### 在 Windows 和 macOS 中的 Docker Compose

在我们更常用于开发的 Windows 和 macOS 中，使用 Docker Compose 会来得更加方便。不论你是使用 Docker for Win 还是 Docker for Mac，亦或是 Docker Toolbox 来搭建 Docker 运行环境，你都可以直接使用 `docker-compose` 这个命令。这三款软件都已经将 Docker Compose 内置在其中，供我们使用。

## Docker Compose 的基本使用逻辑

如果将使用 Docker Compose 的步骤简化来说，可以分成三步。

1.  如果需要的话，编写容器所需镜像的 Dockerfile；( 也可以使用现有的镜像 )
2.  编写用于配置容器的 docker-compose.yml；
3.  使用 docker-compose 命令启动应用。

准备镜像这一过程我们之前已经掌握了，这里我们就简单来看看后面两个步骤。

### 编写 Docker Compose 配置

配置文件是 Docker Compose 的核心部分，我们正是通过它去定义组成应用服务容器群的各项配置，而编写配置文件，则是使用 Docker Compose 过程中最核心的一个步骤。

Docker Compose 的配置文件是一个基于 [YAML](http://yaml.org/) 格式的文件。关于 YAML 的语法大家可以在网上找到，这里不再细说，总的来说，YAML 是一种清晰、简单的标记语言，你甚至都可以在看过几个例子后摸索出它的语法。

与 Dockerfile 采用 Dockerfile 这个名字作为镜像构建定义的默认文件名一样，Docker Compose 的配置文件也有一个缺省的文件名，也就是 docker-compose.yml，如非必要，我建议大家直接使用这个文件名来做 Docker Compose 项目的定义。

这里我们来看一个简单的 Docker Compose 配置文件内容。

```
version: '3'

services:

  webapp:
    build: ./image/webapp
    ports:
      - "5000:5000"
    volumes:
      - ./code:/code
      - logvolume:/var/log
    links:
      - mysql
      - redis

  redis:
    image: redis:3.2
  
  mysql:
    image: mysql:5.7
    environment:
      - MYSQL_ROOT_PASSWORD=my-secret-pw

volumes:
  logvolume: {}

```

Docker Compose 配置文件里可以包含许多内容，从每个容器的各个细节控制，到网络、数据卷等的定义。

这里我们看几个主要的细节。首先是 version 这个配置，这代表我们定义的 docker-compose.yml 文件内容所采用的版本，目前 Docker Compose 的配置文件已经迭代至了第三版，其所支持的功能也越来越丰富，所以我们建议使用最新的版本来定义。

接下来我们来看 services 这块，这是整个 docker-compose.yml 的核心部分，其定义了容器的各项细节。

在 Docker Compose 里不直接体现容器这个概念，这是把 service 作为配置的最小单元。虽然我们看上去每个 service 里的配置内容就像是在配置容器，但其实 service 代表的是一个应用集群的配置。每个 service 定义的内容，可以通过特定的配置进行水平扩充，将同样的容器复制数份形成一个容器集群。而 Docker Compose 能够对这个集群做到黑盒效果，让其他的应用和容器无法感知它们的具体结构。

对于 docker-compose.yml 配置的具体细节，我们在下一节中还会专门讲解。

### 启动和停止

对于开发来说，最常使用的 Docker Compose 命令就是 `docker-compose up` 和 `docker-compose down` 了。

`docker-compose up` 命令类似于 Docker Engine 中的 `docker run`，它会根据 docker-compose.yml 中配置的内容，创建所有的容器、网络、数据卷等等内容，并将它们启动。与 `docker run` 一样，默认情况下 `docker-compose up` 会在“前台”运行，我们可以用 `-d` 选项使其“后台”运行。事实上，我们大多数情况都会加上 `-d` 选项。

```
$ sudo docker-compose up -d

```

需要注意的是，`docker-compose` 命令默认会识别当前控制台所在目录内的 docker-compose.yml 文件，而会以这个目录的名字作为组装的应用项目的名称。如果我们需要改变它们，可以通过选项 `-f` 来修改识别的 Docker Compose 配置文件，通过 `-p` 选项来定义项目名。

```
$ sudo docker-compose -f ./compose/docker-compose.yml -p myapp up -d

```

与 `docker-compose up` 相反，`docker-compose down` 命令用于停止所有的容器，并将它们删除，同时消除网络等配置内容，也就是几乎将这个 Docker Compose 项目的所有影响从 Docker 中清除。

```
$ sudo docker-compose down

```

如果条件允许，我更建议大家像容器使用一样对待 Docker Compose 项目，做到随用随启，随停随删。也就是使用的时候通过 `docker-compose up` 进行，而短时间内不再需要时，通过 `docker-compose down` 清理它。

借助 Docker 容器的秒级启动和停止特性，我们在使用 `docker-compose up` 和 `docker-compose down` 时可以非常快的完成操作。这就意味着，我们可以在不到半分钟的时间内停止一套环境，切换到另外一套环境，这对于经常进行多个项目开发的朋友来说，绝对是福音。

通过 Docker 让我们能够在开发过程中搭建一套不受干扰的独立环境，让开发过程能够基于稳定的环境下进行。而 Docker Compose 则让我们更近一步，同时让我们处理好多套开发环境，并进行快速切换。

### 容器命令

除了启动和停止命令外，Docker Compose 还为我们提供了很多直接操作服务的命令。之前我们说了，服务可以看成是一组相同容器的集合，所以操作服务就有点像操作容器一样。

这些命令看上去都和 Docker Engine 中对单个容器进行操作的命令类似，我们来看几个常见的。

在 Docker Engine 中，如果我们想要查看容器中主进程的输出内容，可以使用 `docker logs` 命令。而由于在 Docker Compose 下运行的服务，其命名都是由 Docker Compose 自动完成的，如果我们直接使用 `docker logs` 就需要先找到容器的名字，这显然有些麻烦了。我们可以直接使用 `docker-compose logs` 命令来完成这项工作。

```
$ sudo docker-compose logs nginx

```

在 `docker-compose logs` 衔接的是 Docker Compose 中所定义的服务的名称。

同理，在 Docker Compose 还有几个类似的命令可以单独控制某个或某些服务。

通过 `docker-compose create`，`docker-compose start` 和 `docker-compose stop` 我们可以实现与 `docker create`，`docker start` 和 `docker stop` 相似的效果，只不过操作的对象由 Docker Engine 中的容器变为了 Docker Compose 中的服务。

```
$ sudo docker-compose create webapp
$ sudo docker-compose start webapp
$ sudo docker-compose stop webapp

```

## 留言互动

在本节中，我们展示了 Docker Compose 这个用于管理容器的工具。这里给大家留一道思考题：

> 在我们的开发中，我们应该如何的合理利用 Docker Compose 进行容器管理呢？

欢迎大家通过留言的方式说出你的看法。我会选出有代表性的优质留言，推荐给大家。

同时，如果你对 Docker Compose 和容器管理还有什么疑惑，或者有自己的想法要与大家分享，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。