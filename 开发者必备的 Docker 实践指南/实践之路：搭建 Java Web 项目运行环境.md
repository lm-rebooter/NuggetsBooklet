# 搭建 Java Web 项目运行环境

Java Web 泛指以 Java 程序为基础向外提供 Web 服务的技术及相关工具，狭义上来说，我们也可以说 Java Web 是由 Servlet 程序提供的 Web 服务。 对我们而言，Tomcat 无疑是最常见的 Servlet 容器，所以在这个小节里，我们来搭建一个以 Tomcat 为核心的 Web 应用运行环境。 在这个环境中，我们还要组合进 MySQL 作为数据存储，Redis 作为 KV 存储。

## 定义项目结构

与之前我们提及的一样，要搭建这样的由多个程序所协作组成的开发环境，使用 Docker Compose 是最佳的选择。

建立 Docker Compose 项目之前，我们先来规划一下项目的目录结构。 在开发过程中，我们倾向于将与项目有关的内容集合到同一个文件夹下，这样的做有几点好处：

*   项目内容清晰明确，复制、迁移和与他人共享的过程中，不会发生遗漏的情况；
*   在定义 Docker Compose 项目时可以使用相对路径，让共享、迁移后整个项目可以不需要额外操作就能运行。

在这些的基础上，我给出一个建议性的目录结构，供大家参考。

```
└─ project
   ├─ app
   ├─ compose
   │  └─ docker-compose.yml
   ├─ mysql
   │  └─ my.cnf
   ├─ redis
   │  └─ redis.conf
   └─ tomcat
      ├─ server.xml
      └─ web.xml

```

设计这样一个目录结构的主要目的是将不同程序的配置进行区分，这与我们之后会通过多个程序所关联的镜像及容器来组合这套环境的脉络是相契合的。

在这个目录结构中，区分了 5 个顶层目录：

*   **app** ：用于存放程序工程，即代码、编译结果以及相关的库、工具等；
*   **compose** ：用于定义 Docker Compose 项目；
*   **mysql** ：与 MySQL 相关配置等内容；
*   **redis** ：与 Redis 相关配置等内容；
*   **tomcat** ：与 Tomcat 相关配置等内容。

## 准备程序配置

为了更方便在开发过程中对 MySQL、Redis、Tomcat 程序本身，所以我们会将它们的核心配置放置到项目里，再通过挂载的方式映射到容器中。 这样一来，我们就可以直接在我们宿主操作系统里直接修改这些配置，无须再进入到容器中了。

基于此，我们在完成目录的设计之后，首要解决的问题就是准备好这些程序中会经常变动的配置，并把它们放置在程序对应的目录之中。

我们常用下列几种方式来获得程序的配置文件：

*   借助配置文档直接编写
*   下载程序源代码中的配置样例
*   通过容器中的默认配置获得

下面我们来展示一下这几种获取配置的方式。

### 借助配置文档直接编写

这里我们利用 MySQL 文档中配置文件的介绍部分，来编写一个 MySQL 的配置文件。

我们先找到 MySQL 文档中关于配置文件的参考，也就是下面这个地址：

[https://dev.mysql.com/doc/refman/5.7/en/server-options.html](https://dev.mysql.com/doc/refman/5.7/en/server-options.html)

我们根据这些内容，选取跟我们程序运行有影响的几项需要修改的参数，编写成 MySQL 的配置文件。

```
# ./mysql/my.cnf

[mysqld_safe]
pid-file = /var/run/mysqld/mysqld.pid
socket   = /var/run/mysqld/mysqld.sock
nice     = 0

[mysqld]
skip-host-cache
skip-name-resolve
explicit_defaults_for_timestamp

bind-address = 0.0.0.0
port         = 3306

user      = mysql
pid-file  = /var/run/mysqld/mysqld.pid
socket    = /var/run/mysqld/mysqld.sock
log-error = /var/log/mysql/error.log
basedir   = /usr
datadir   = /var/lib/mysql
tmpdir    = /tmp
sql_mode  = NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES

lc-messages-dir = /usr/share/mysql

symbolic-links = 0

```

使用软件的文档来编写配置文件，其优势在于在编写的过程实际上也是我们熟悉软件的过程，通过配置加文档形式的阅读，你一定会从中收获很多。 当然，这种方法也有很大的劣势，即需要仔细阅读文档，劳神劳力，对于常规开发中的使用来说，成效比很低。

### 下载程序源代码中的配置样例

除了通过配置文档来了解软件的配置外，大部分软件，特别是开源软件都会直接给出一份示例配置文件作为参考。 我们可以直接拿到这份配置，达到我们的目的。

这里我们以 Redis 为例，在 Redis 源代码中，就包含了一份默认的配置文件，我们可以直接拿来使用：

[https://github.com/antirez/redis/blob/3.2/redis.conf](https://github.com/antirez/redis/blob/3.2/redis.conf)

在拿到这是默认的配置后，我们还可以根据需要对其中的部分配置进行修改，以更好的满足我们的需求。

这里我们以修改 Redis 的密码为例。 打开配置文件，找到定义 Redis 授权授权的地方，将密码修改为我们需要的内容。

```
# ./redis/redis.conf
##...
################################## SECURITY ###################################

# Require clients to issue AUTH <PASSWORD> before processing any other
# commands.  This might be useful in environments in which you do not trust
# others with access to the host running redis-server.
#
# This should stay commented out for backward compatibility and because most
# people do not need auth (e.g. they run their own servers).
#
# Warning: since Redis is pretty fast an outside user can try up to
# 150k passwords per second against a good box. This means that you should
# use a very strong password otherwise it will be very easy to break.
#
requirepass my-secret-pw
##...

```

相对于通过配置文档获得配置，从配置示例里获得配置要来得更为简单容易。 但其也有一定的限制，既要对于的程序能够提供这样的示例配置，又要我们能够顺利找到这些配置文件。

### 通过容器中的默认配置获得

除了从官方手册或者配置示例中获得配置文件外，我们还有一种远在天边近在眼前的获取配置文件的方法。 大多数 Docker 镜像为了实现自身能够直接启动为容器并马上提供服务，会把默认配置直接打包到镜像中，以便让程序能够直接读取。 所以说，我们可以直接从镜像里拿到这份配置，拷贝到宿主机里备用。

那么我们就以最后一个尚未出场的 Tomcat 为例，说说如何从 Tomcat 镜像里拿到配置文件。

要拿到 Tomcat 中的配置文件，我们需要先创建一个临时的 Tomcat 容器。

```
# docker run --rm -d --name temp-tomcat tomcat:8.5 

```

这里我们将容器命名为 temp-tomcat 以便我们之后的操作。

对于 Tomcat 来说，在开发过程中我们可能会经常改动的配置主要是 server.xml 和 web.xml 这两个文件，所以接下来我们就把这两个文件从容器中复制到宿主机里。

这里我们会用到 `docker cp` 这个命令，`docker cp` 能够在容器与宿主机的文件系统间拷贝文件和目录。

```
# docker cp temp-tomcat:/usr/local/tomcat/conf/server.xml ./server.xml
# docker cp temp-tomcat:/usr/local/tomcat/conf/web.xml ./web.xml

```

在这个命令的使用中，几个参数的含义如下：

*   **temp-tomcat** : 操作的容器。这里我们使用刚才创建的临时容器的容器名来指定。
*   **/usr/local/tomcat/conf/server.xml** : 需要拷贝的路径。也就是容器中配置文件的路径，这个路径可以通过 `docker exec` 等命令进到容器里寻觅一下就能获得。
*   **./server.xml** : 是目标路径。即选择将文件拷贝到宿主机的什么位置上。

熟悉 Linux 中 cp 命令的朋友会非常容易看懂这个命令，这两者传参的方式是基本一致的。 主要的区别在于 `docker cp` 命令由于是在容器与宿主机间进行拷贝，所以来源目录或者目标目录中需要指定一下容器。

上述的命令是从容器中向宿主机里拷贝文件，我们还可以从宿主机中向容器里拷贝文件，只需要调换一下参数的位置即可。

```
# docker cp ./server.xml temp-tomcat:/usr/local/tomcat/conf/server.xml

```

回过头来看我们的配置，在执行了上述的命令之后，两个配置文件已经出现在我们系统的目录中了。

另外，别忘了在完成上面的操作后清理我们创建的临时容器。

```
# docker stop temp-tomcat

```

由于我们在创建临时容器的时候增加了 `--rm` 选项，所以我们在这里只需要使用 `docker stop` 停止容器，就可以在停止容器的同时直接删除容器，实现直接清理的目的。

## 编写 Docker Compose 定义文件

准备好了程序的配置，我们就可以来编写我们的 Docker Compose 项目定义文件了。

这里是我编写好的一份 Docker Compose 项目定义文件。

```
version: "3"

services:

  redis:
    image: redis:3.2
    volumes:
      - ../redis/redis.conf:/etc/redis/redis.conf:ro
      - ../redis/data:/data
    command:
      - redis-server
      - /etc/redis/redis.conf
    ports:
     - 6379:6379

  mysql:
    image: mysql:5.7
    volumes:
      - ../mysql/my.cnf:/etc/mysql/my.cnf:ro
      - ../mysql/data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: my-secret-pw
    ports:
      - 3306:3306

  tomcat:
    image: tomcat:8.5
    volumes:
      - ../app:/usr/local/tomcat/webapps/ROOT
    ports:
      - 80:8080

```

在这个项目里，我将 Redis 和 MySQL 的数据存储目录，也就是 Redis 容器中的 /data 目录和 MySQL 容器中的 /var/lib/mysql 目录通过挂载的方式绑定到了宿主机上的目录中。 这么做的目的是为了让 Redis 和 MySQL 的数据能够持久化存储，避免我们在创建和移除容器时造成数据的流失。

同时，这种将数据挂载出来的方法，可以直接方便我们打包数据并传送给其他开发者，方便开发过程中进行联调。

在 Tomcat 这个服务中，我们将程序直接挂载到 webapps/ROOT 目录下，这样我们就能够借助 Tomcat 访问我们的应用了。 如果大家有多个项目，也可以进行适当调整，将它们挂载到 webapps 下面的子目录中，实现同时访问多个应用的目的。

另外，这里我还把 Tomcat 默认的 8080 端口映射到了宿主机的 80 端口上，这样便于我们直接通过地址访问网站，不需要经常人工补充端口号了。

## 启动项目

一切就绪，我们就可以直接通过 Docker Compose 的命令来启动开发环境了。

```
# docker-compose -p javaweb -f ./compose/docker-compose.yml up -d

```

## 留言互动

在这节中，我们展示了通过 Docker 搭建一个 Java Web 开发环境的过程，下面就是大家自己动手进行实践的时候了。

本小节中的示例，已经更新到了：

[https://github.com/youmingdot/docker-book-for-developer-samples](https://github.com/youmingdot/docker-book-for-developer-samples)

大家可以在实践过程中的用其作为参考。

欢迎大家通过留言的方式说出你的实践之路。我会选出有代表性的优质留言，推荐给大家。

同时，如果大家在实践过程中遇到困难，或者有自己的实践心得要与大家分享，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。