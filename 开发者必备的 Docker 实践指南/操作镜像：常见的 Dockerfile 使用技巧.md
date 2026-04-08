# 常见 Dockerfile 使用技巧

在掌握 Dockerfile 的基本使用方法后，我们再来了解一些在开发中使用 Dockerfile 的技巧。这一小节的展现方式与之前的略有不同，其主要来自阅读收集和我自身在使用中的最佳实践。也许这里面介绍的不是最为标准或是合乎规范的方式，但一定是能够直接帮助大家在开发中使用 Docker 提升生产力的方式。下面就让我们来看看这些关于 Dockerfile 的使用技巧吧。

## 构建中使用变量

在实际编写 Dockerfile 时，与搭建环境相关的指令会是其中占有大部分比例的指令。在搭建程序所需运行环境时，难免涉及到一些可变量，例如依赖软件的版本，编译的参数等等。我们可以直接将这些数据写入到 Dockerfile 中完全没有问题，有问题的是这些可变量我们会经常调整，在调整时就需要我们到 Dockerfile 中找到它们并进行更改，如果只是简单的 Dockerfile 文件尚且好说，但如果是相对复杂或是存在多处变量的 Dockerfile 文件，这个工作就变得繁琐而让人烦躁了。

在 Dockerfile 里，我们可以用 ARG 指令来建立一个参数变量，我们可以在构建时通过构建指令传入这个参数变量，并且在 Dockerfile 里使用它。

例如，我们希望通过参数变量控制 Dockerfile 中某个程序的版本，在构建时安装我们指定版本的软件，我们可以通过 ARG 定义的参数作为占位符，替换版本定义的部分。

```
FROM debian:stretch-slim

## ......

ARG TOMCAT_MAJOR
ARG TOMCAT_VERSION

## ......

RUN wget -O tomcat.tar.gz "https://www.apache.org/dyn/closer.cgi?action=download&filename=tomcat/tomcat-$TOMCAT_MAJOR/v$TOMCAT_VERSION/bin/apache-tomcat-$TOMCAT_VERSION.tar.gz"

## ......


```

在这个例子里，我们将 Tomcat 的版本号通过 ARG 指令定义为参数变量，在调用下载 Tomcat 包时，使用变量替换掉下载地址中的版本号。通过这样的定义，就可以让我们在不对 Dockerfile 进行大幅修改的前提下，轻松实现对 Tomcat 版本的切换并重新构建镜像了。

如果我们需要通过这个 Dockerfile 文件构建 Tomcat 镜像，我们可以在构建时通过 `docker build` 的 `--build-arg` 选项来设置参数变量。

```
$ sudo docker build --build-arg TOMCAT_MAJOR=8 --build-arg TOMCAT_VERSION=8.0.53 -t tomcat:8.0 ./tomcat

```

### 环境变量

环境变量也是用来定义参数的东西，与 ARG 指令相类似，环境变量的定义是通过 ENV 这个指令来完成的。

```
FROM debian:stretch-slim

## ......

ENV TOMCAT_MAJOR 8
ENV TOMCAT_VERSION 8.0.53

## ......

RUN wget -O tomcat.tar.gz "https://www.apache.org/dyn/closer.cgi?action=download&filename=tomcat/tomcat-$TOMCAT_MAJOR/v$TOMCAT_VERSION/bin/apache-tomcat-$TOMCAT_VERSION.tar.gz"


```

环境变量的使用方法与参数变量一样，也都是能够直接替换指令参数中的内容。

与参数变量只能影响构建过程不同，环境变量不仅能够影响构建，还能够影响基于此镜像创建的容器。环境变量设置的实质，其实就是定义操作系统环境变量，所以在运行的容器里，一样拥有这些变量，而容器中运行的程序也能够得到这些变量的值。

另一个不同点是，环境变量的值不是在构建指令中传入的，而是在 Dockerfile 中编写的，所以如果我们要修改环境变量的值，我们需要到 Dockerfile 修改。不过即使这样，只要我们将 ENV 定义放在 Dockerfile 前部容易查找的地方，其依然可以很快的帮助我们切换镜像环境中的一些内容。

由于环境变量在容器运行时依然有效，所以运行容器时我们还可以对其进行覆盖，在创建容器时使用 `-e` 或是 `--env` 选项，可以对环境变量的值进行修改或定义新的环境变量。

```
$ sudo docker run -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5.7

```

事实上，这种用法在我们开发中是非常常见的。也正是因为这种允许运行时配置的方法存在，环境变量和定义它的 ENV 指令，是我们更常使用的指令，我们会优先选择它们来实现对变量的操作。

关于环境变量是如何能够帮助我们更轻松的处理 Docker 镜像和容器使用等问题，我们会在下一节中进行实际展示，通过例子大家能够更容易理解它的原理。

另外需要说明一点，通过 ENV 指令和 ARG 指令所定义的参数，在使用时都是采用 $ + NAME 这种形式来占位的，所以它们之间的定义就存在冲突的可能性。对于这种场景，大家只需要记住，ENV 指令所定义的变量，永远会覆盖 ARG 所定义的变量，即使它们定时的顺序是相反的。

## 合并命令

在上一节我们展示的完整的官方 Redis 镜像的 Dockerfile 中，我们会发现 RUN 等指令里会聚合下大量的代码。

事实上，下面两种写法对于搭建的环境来说是没有太大区别的。

```
RUN apt-get update; \
    apt-get install -y --no-install-recommends $fetchDeps; \
    rm -rf /var/lib/apt/lists/*;

```

```
RUN apt-get update
RUN apt-get install -y --no-install-recommends $fetchDeps
RUN rm -rf /var/lib/apt/lists/*

```

那为什么我们更多见的是第一种形式而非第二种呢？这就要从镜像构建的过程说起了。

看似连续的镜像构建过程，其实是由多个小段组成。每当一条能够形成对文件系统改动的指令在被执行前，Docker 先会基于上条命令的结果启动一个容器，在容器中运行这条指令的内容，之后将结果打包成一个镜像层，如此反复，最终形成镜像。

![](https://user-gold-cdn.xitu.io/2018/10/3/166377aa670bb4a4?w=1516&h=482&f=png&s=49015)

所以说，我们之前谈到镜像是由多个镜像层叠加而得，而这些镜像层其实就是在我们 Dockerfile 中每条指令所生成的。

了解了这个原理，大家就很容易理解为什么绝大多数镜像会将命令合并到一条指令中，因为这种做法不但减少了镜像层的数量，也减少了镜像构建过程中反复创建容器的次数，提高了镜像构建的速度。

### 构建缓存

Docker 在镜像构建的过程中，还支持一种缓存策略来提高镜像的构建速度。

由于镜像是多个指令所创建的镜像层组合而得，那么如果我们判断新编译的镜像层与已经存在的镜像层未发生变化，那么我们完全可以直接利用之前构建的结果，而不需要再执行这条构建指令，这就是镜像构建缓存的原理。

那么 Docker 是如何判断镜像层与之前的镜像间不存在变化的呢？这主要参考两个维度，第一是所基于的镜像层是否一样，第二是用于生成镜像层的指令的内容是否一样。

基于这个原则，我们在条件允许的前提下，更建议将不容易发生变化的搭建过程放到 Dockerfile 的前部，充分利用构建缓存提高镜像构建的速度。另外，指令的合并也不宜过度，而是将易变和不易变的过程拆分，分别放到不同的指令里。

在另外一些时候，我们可能不希望 Docker 在构建镜像时使用构建缓存，这时我们可以通过 `--no-cache` 选项来禁用它。

```
$ sudo docker build --no-cache ./webapp

```

## 搭配 ENTRYPOINT 和 CMD

上一节我们谈到了 ENTRYPOINT 和 CMD 这两个命令，也解释了这两个命令的目的，即都是用来指定基于此镜像所创建容器里主进程的启动命令的。

两个指令的区别在于，ENTRYPOINT 指令的优先级高于 CMD 指令。当 ENTRYPOINT 和 CMD 同时在镜像中被指定时，CMD 里的内容会作为 ENTRYPOINT 的参数，两者拼接之后，才是最终执行的命令。

为了更好的让大家理解，这里索性列出所有的 ENTRYPOINT 与 CMD 的组合，供大家参考。

ENTRYPOINT

CMD

实际执行

ENTRYPOINT \["/bin/ep", "arge"\]

/bin/ep arge

ENTRYPOINT /bin/ep arge

/bin/sh -c /bin/ep arge

CMD \["/bin/exec", "args"\]

/bin/exec args

CMD /bin/exec args

/bin/sh -c /bin/exec args

ENTRYPOINT \["/bin/ep", "arge"\]

CMD \["/bin/exec", "argc"\]

/bin/ep arge /bin/exec argc

ENTRYPOINT \["/bin/ep", "arge"\]

CMD /bin/exec args

/bin/ep arge /bin/sh -c /bin/exec args

ENTRYPOINT /bin/ep arge

CMD \["/bin/exec", "argc"\]

/bin/sh -c /bin/ep arge /bin/exec argc

ENTRYPOINT /bin/ep arge

CMD /bin/exec args

/bin/sh -c /bin/ep arge /bin/sh -c /bin/exec args

有的读者会存在疑问，既然两者都是用来定义容器启动命令的，为什么还要分成两个，合并为一个指令岂不是更方便吗？

这其实在于 ENTRYPOINT 和 CMD 设计的目的是不同的。ENTRYPOINT 指令主要用于对容器进行一些初始化，而 CMD 指令则用于真正定义容器中主程序的启动命令。

另外，我们之前谈到创建容器时可以改写容器主程序的启动命令，而这个覆盖只会覆盖 CMD 中定义的内容，而不会影响 ENTRYPOINT 中的内容。

我们依然以之前的 Redis 镜像为例，这是 Redis 镜像中对 ENTRYPOINT 和 CMD 的定义。

```
## ......

COPY docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]

## ......

CMD ["redis-server"]

```

可以很清晰的看到，CMD 指令定义的正是启动 Redis 的服务程序，而 ENTRYPOINT 使用的是一个外部引入的脚本文件。

事实上，使用脚本文件来作为 ENTRYPOINT 的内容是常见的做法，因为对容器运行初始化的命令相对较多，全部直接放置在 ENTRYPOINT 后会特别复杂。

我们来看看 Redis 中的 ENTRYPOINT 脚本，可以看到其中会根据脚本参数进行一些处理，而脚本的参数，其实就是 CMD 中定义的内容。

```
#!/bin/sh
set -e

# first arg is `-f` or `--some-option`
# or first arg is `something.conf`
if [ "${1#-}" != "$1" ] || [ "${1%.conf}" != "$1" ]; then
	set -- redis-server "$@"
fi

# allow the container to be started with `--user`
if [ "$1" = 'redis-server' -a "$(id -u)" = '0' ]; then
	find . \! -user redis -exec chown redis '{}' +
	exec gosu redis "$0" "$@"
fi

exec "$@"

```

这里我们要关注脚本最后的一条命令，也就是 `exec "$@"`。在很多镜像的 ENTRYPOINT 脚本里，我们都会看到这条命令，其作用其实很简单，就是运行一个程序，而运行命令就是 ENTRYPOINT 脚本的参数。反过来，由于 ENTRYPOINT 脚本的参数就是 CMD 指令中的内容，所以实际执行的就是 CMD 里的命令。

所以说，虽然 Docker 对容器启动命令的结合机制为 CMD 作为 ENTRYPOINT 的参数，合并后执行 ENTRYPOINT 中的定义，但实际在我们使用中，我们还会在 ENTRYPOINT 的脚本里代理到 CMD 命令上。

相对来说，Redis 的 ENTRYPOINT 内容还是简单的，在掌握了 ENTRYPOINT 的相关作用后，大家可以尝试阅读和编写一些复杂的 ENTRYPOINT 脚本。

## 临摹案例

上面提及的几项只是几个比较常见的 Dockerfile 最佳实践，其实在编写 Dockerfile 时，还有很多不成文的小技巧。

想要学好 Dockerfile 的编写，阅读和思考前人的作品是必不可少的。

前面我们介绍了，Docker 官方提供的 Docker Hub 是 Docker 镜像的中央仓库，它除了镜像丰富之外，给我们带来的另一项好处就是其大部分镜像都是能够直接提供 Dockerfile 文件给我们参考的。

要得到镜像的 Dockerfile 文件，我们可以进入到镜像的详情页面，在介绍中，镜像作者们通常会直接把 Dockerfile 的连接放在那里。

![](https://user-gold-cdn.xitu.io/2018/10/3/16637944f4705632?w=709&h=583&f=png&s=41150)

除此之外，进入到 Dockerfile 这个栏目下，我们也能够直接看到镜像 Dockerfile 的内容。在页面的右侧，还有进入 Dockerfile 源文件的连接，如果在 Dockerfile 中有引入其他的文件，我们可以通过这个连接访问到。

![](https://user-gold-cdn.xitu.io/2018/10/3/166379581300d9e0?w=1264&h=675&f=png&s=62662)

另外，我自己也制作了一些软件的镜像，大家可以访问 GitHub 上的项目地址，查阅其中的 Dockerfile 内容：[https://github.com/cogset](https://github.com/cogset) 。

## 留言互动

在本节中，我们介绍了在开发中使用 Dockerfile 的一些技巧。这里给大家留一道思考题：

> 在常见的镜像构建中，我们如何合理组合 ENTRYPOINT 和 CMD 并分配它们的工作呢？

欢迎大家通过留言的方式说出你的看法。我会选出有代表性的优质留言，推荐给大家。

同时，如果你对上述我们提及的 Dockerfile 使用技巧还有不理解的地方，或者有其他的技巧想要与大家分享，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。