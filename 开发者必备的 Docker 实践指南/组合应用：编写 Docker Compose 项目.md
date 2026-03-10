# 编写 Docker Compose 项目

通过阅读之前的小节，相信大家对 Docker 在开发中的应用已经有了一定的了解。作为一款实用的软件，我们必须回归到实践中来，这样才能更好地理解 Docker 的实用逻辑和背后的原理。在这一小节里，我们就举一个完整的例子，让大家跟随这个项目的脉络，熟悉如何通过 Docker 和 Docker Compose 来搭建应用开发环境。

## 设计项目的目录结构

在这一小节里，我们以一个由 MySQL、Redis、PHP-FPM 和 Nginx 组成的小型 PHP 网站为例，介绍通过 Docker 搭建运行这套程序运行环境的方法。

既然我们说到这个小型网站是由 MySQL、Redis、PHP-FPM 和 Nginx 四款软件所组成的，那么自然在 Docker 里，我们要准备四个容器分别来运行它们。而为了更好地管理这四个容器所组成的环境，我们这里还会使用到 Docker Compose。

与搭建一个软件开发项目类似，我们提倡将 Docker Compose 项目的组成内容聚集到一个文件目录中，这样更利于我们进行管理和迁移。

这里我已经建立好了一个目录结构，虽然我们在实践的过程中不一定要按照这样的结构，但我相信这个结构一定对你有所启发。

![](https://user-gold-cdn.xitu.io/2018/10/22/1669c139cbb5b1d8?w=804&h=928&f=png&s=110156)

简单说明一下这个结构中主要目录和文件的功能和作用。在这个结构里，我们可以将根目录下的几个目录分为四类：

*   第一类是 Docker 定义目录，也就是 compose 这个目录。在这个目录里，包含了 docker-compose.yml 这个用于定义 Docker Compose 项目的配置文件。此外，还包含了我们用于构建自定义镜像的内容。
    
*   第二类是程序文件目录，在这个项目里是 mysql、nginx、phpfpm、redis 这四个目录。这些目录分别对应着 Docker Compose 中定义的服务，在其中主要存放对应程序的配置，产生的数据或日志等内容。
    
*   第三类是代码目录，在这个项目中就是存放 Web 程序的 website 目录。我们将代码统一放在这个目录中，方便在容器中挂载。
    
*   第四类是工具命令目录，这里指 bin 这个目录。我们在这里存放一些自己编写的命令脚本，我们通过这些脚本可以更简洁地操作整个项目。
    

## 编写 Docker Compose 配置文件

接下来我们就要编写 docker-compose.yml 文件来定义组成这个环境的所有 Docker 容器以及与它们相关的内容了。docker-compose.yml 规则和编写的方法在前两小节中已经谈到，这里我们就不再展开，直接来看看编写好的 docker-compose.yml 配置文件。

```
version: "3"

networks:
  frontend:
  backend:

services:

  redis:
    image: redis:3.2
    networks:
      - backend
    volumes:
      - ../redis/redis.conf:/etc/redis/redis.conf:ro
      - ../redis/data:/data
    command: ["redis-server", "/etc/redis/redis.conf"]
    ports:
      - "6379:6379"

  mysql:
    image: mysql:5.7
    networks:
      - backend
    volumes:
      - ../mysql/my.cnf:/etc/mysql/my.cnf:ro
      - ../mysql/data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: my-secret-pw
    ports:
      - "3306:3306"

  phpfpm:
    build: ./phpfpm
    networks:
      - frontend
      - backend
    volumes:
      - ../phpfpm/php.ini:/usr/local/etc/php/php.ini:ro
      - ../phpfpm/php-fpm.conf:/usr/local/etc/php-fpm.conf:ro
      - ../phpfpm/php-fpm.d:/usr/local/etc/php-fpm.d:ro
      - ../phpfpm/crontab:/etc/crontab:ro
      - ../website:/website
    depends_on:
      - redis
      - mysql
  
  nginx:
    image: nginx:1.12
    networks:
      - frontend
    volumes:
      - ../nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ../nginx/conf.d:/etc/nginx/conf.d:ro
      - ../website:/website
    depends_on:
      - phpfpm
    ports:
      - "80:80"

```

使用合适的镜像是提高工作效率的途径之一，这里讲解一下我们在这个项目中选择镜像的原由。

在这个项目里，我们直接采用了 MySQL、Redis 和 Nginx 三个官方镜像，而对于 PHP-FPM 的镜像，我们需要增加一些功能，所以我们通过 Dockerfile 构建的方式来生成。

对于 MySQL 来说，我们需要为它们设置密码，所以原则上我们是需要对它们进行改造并生成新的镜像来使用的。而由于 MySQL 镜像可以通过我们之前在镜像使用方法一节所提到的环境变量配置的方式，来直接指定 MySQL 的密码及其他一些关键性内容，所以我们就无须单独构建镜像，可以直接采用官方镜像并配合使用环境变量来达到目的。

对于 Redis 来说，出于安全考虑，我们一样需要设置密码。Redis 设置密码的方法是通过配置文件来完成的，所以我们需要修改 Redis 的配置文件并挂载到 Redis 容器中。这个过程也相对简单，不过需要注意的是，在官方提供的 Redis 镜像里，默认的启动命令是 redis-server，其并没有指定加载配置文件。所以在我们定义 Redis 容器时，要使用 command 配置修改容器的启动命令，使其读取我们挂载到容器的配置文件。

### 自定义镜像

相比较于 MySQL、Redis 这样可以通过简单配置即可直接使用的镜像不同，PHP 的镜像中缺乏了一些我们程序中必要的元素，而这些部分我们推荐使用自定义镜像的方式将它们加入其中。

在这个例子里，因为需要让 PHP 连接到 MySQL 数据库中，所以我们要为镜像中的 PHP 程序安装和开启 pdo\_mysql 这个扩展。

了解如何安装扩展，这就要考验我们之前在 Docker Hub 镜像使用一节中学到的知识了。我们通过阅读 PHP 镜像的介绍页面，可以找到 PHP 镜像中已经为我们准备好了扩展的安装和启用命令，这让我们可以很轻松地在镜像中加入扩展。

![](https://user-gold-cdn.xitu.io/2018/10/23/166a08aa844baae9?w=733&h=561&f=png&s=60471)

在准备好这些使用方法之后，我们就可以开始编写构建 PHP 镜像的 Dockerfile 文件了。这里我已经编写好了一份，供大家参考。

```
FROM php:7.2-fpm

MAINTAINER You Ming <youming@funcuter.org>

RUN apt-get update \
 && apt-get install -y --no-install-recommends cron

RUN docker-php-ext-install pdo_mysql

COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["php-fpm"]

```

由于 Docker 官方所提供的镜像比较精简，所以在这个 Dockerfile 里，我们还执行了 cron 的安装命令，来确保我们可以使用定时任务。

大家注意到，这里除了我们进行功能安装外，还将一个脚本拷入了镜像中，并将其作为 ENTRYPOINT 启动入口。这个文件的作用主要是为了启动 cron 服务，以便我们在容器中可以正常使用它。

```
#!/bin/bash

service cron start

exec "$@"

```

在 [docker-entrypoint.sh](http://docker-entrypoint.sh) 里，除了启动 cron 服务的命令外，我们在脚本的最后看到的是 `exec "$@"` 这行命令。`$@` 是 shell 脚本获取参数的符号，这里获得的是所有传入脚本的参数，而 exec 是执行命令，直接执行这些参数。

如果直接看这条命令大家会有些疑惑，参数怎么拿来执行，这不是有问题么？

请大家回顾一下，我们之前提到的，如果在镜像里同时定义了 ENTRYPOINT 和 CMD 两个指令，CMD 指令的内容会以参数的形式传递给 ENTRYPOINT 指令。所以，这里脚本最终执行的，是 CMD 中所定义的命令。

### 目录挂载

在这个例子里，我们会把项目中的一些目录或文件挂载到容器里，这样的挂载主要有三种目的：

*   将程序的配置通过挂载的方式覆盖容器中对应的文件，这让我们可以直接在容器外修改程序的配置，并通过直接重启容器就能应用这些配置；
    
*   把目录挂载到容器中应用数据的输出目录，就可以让容器中的程序直接将数据输出到容器外，对于 MySQL、Redis 中的数据，程序的日志等内容，我们可以使用这种方法来持久保存它们；
    
*   把代码或者编译后的程序挂载到容器中，让它们在容器中可以直接运行，这就避免了我们在开发中反复构建镜像带来的麻烦，节省出大量宝贵的开发时间。
    

上述的几种方法，对于线上部署来说都是不适用的，但在我们的开发过程中，却可以为我们免去大量不必要的工作，因此建议在开发中使用这些挂载结构。

## 编写辅助脚本

我们知道，虽然 Docker Compose 简化了许多操作流程，但我们还是需要使用 docker-compose 命令来管理项目。对于这个例子来说，我们要启动它就必须使用这样的 docker-compose 命令来管理项目。对于这个例子来说，我们要启动它就必须使用这样的：

```
$ sudo docker-compose -p website up -d

```

而执行的目录必须是 docker-compose.yml 文件所在的目录，这样才能正确地读取 Docker Compose 项目的配置内容。

我编写了一个 compose 脚本，用来简化 docker-compose 的操作命令。

```
#!/bin/bash

root=$(cd `dirname $0`; dirname `pwd`)

docker-compose -p website -f ${root}/compose/docker-compose.yml "$@"

```

在这个脚本里，我把一些共性的东西包含进去，这样我们就不必每次传入这些参数或选项了。同时，这个脚本还能自适应调用的目录，准确找到 docker-compose.yml 文件，更方便我们直接调用。

通过这个脚本来操作项目，我们的命令就可以简化为：

```
$ sudo ./bin/compose up -d

$ sudo ./bin/compose logs nginx

$ sudo ./bin/compose down

```

当然，我们还可以编写像代码部署、服务重启等脚本，来提高我们的开发效率。

## 留言互动

在本节中，我们展示了编写一个用于开发的完整 Docker Compose 项目的方法。这里给大家留一道实践题：

> 尝试自己编写适用于自己应用的 Docker Compose 项目，并将它提供给测试同事，进行测试环境的部署。

欢迎大家通过留言的方式说出你的实践之路。我会选出有代表性的优质留言，推荐给大家。

同时，如果你对编写 Docker Compose 项目还有疑问，或者有编写的心得要与大家分享，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。

本小节中的示例，已经更新到了：

[https://github.com/youmingdot/docker-book-for-developer-samples](https://github.com/youmingdot/docker-book-for-developer-samples)