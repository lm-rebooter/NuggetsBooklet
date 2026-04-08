# 常用的 Docker Compose 配置项

与 Dockerfile 一样，编写 Docker Compose 的配置文件是掌握和使用好 Docker Compose 的前提。编写 Docker Compose 配置文件，其本质就是根据我们所设计的应用架构，对不同应用容器进行配置并加以组合。在这一节中，我们就来谈谈如何编写 Docker Compose 的配置文件，了解其中常见配置项的使用方法。

## 定义服务

为了理解在开发中常用的 Docker Compose 配置，我们通过一个在开发中使用的 Docker Compose 文件来进行下面的讲解。

```
version: "3"

services:

  redis:
    image: redis:3.2
    networks:
      - backend
    volumes:
      - ./redis/redis.conf:/etc/redis.conf:ro
    ports:
      - "6379:6379"
    command: ["redis-server", "/etc/redis.conf"]

  database:
    image: mysql:5.7
    networks:
      - backend
    volumes:
      - ./mysql/my.cnf:/etc/mysql/my.cnf:ro
      - mysql-data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=my-secret-pw
    ports:
      - "3306:3306"

  webapp:
    build: ./webapp
    networks:
      - frontend
      - backend
    volumes:
      - ./webapp:/webapp
    depends_on:
      - redis
      - database

  nginx:
    image: nginx:1.12
    networks:
      - frontend
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./webapp/html:/webapp/html
    depends_on:
      - webapp
    ports:
      - "80:80"
      - "443:443"

networks:
  frontend:
  backend:

volumes:
  mysql-data:

```

在这个 Docker Compose 的示例中，我们看到占有大量篇幅的就是 services 部分，也就是服务定义的部分了。在上一节里，我们已经说到了，Docker Compose 中的服务，是对一组相同容器集群统一配置的定义，所以可见，在 Docker Compose 里，主要的内容也是对容器配置的定义。

这里我们依然要声明一下，这本小册主要以开发中使用 Docker 的方法为主，所以在关于 Docker Compose 的内容里，依然以开发中的使用为主。由于我们开发中，鉴于本地机器性能和易管理性等的考虑，不会为服务进行集群配置，通常就是一个服务对应一个容器，所以这里均以这种方式来进行讲解。

在 Docker Compose 的配置文件里，对服务的定义与我们之前谈到的创建和启动容器中的选项非常相似，或者说 Docker Compose 就是从配置文件中读取出这些内容，代我们创建和管理这些容器的。

在使用时，我们首先要为每个服务定义一个名称，用以区别不同的服务。在这个例子里，redis、database、webapp、nginx 就是服务的名称。

### 指定镜像

容器最基础的就是镜像了，所以每个服务必须指定镜像。在 Docker Compose 里，我们可以通过两种方式为服务指定所采用的镜像。一种是通过 image 这个配置，这个相对简单，给出能在镜像仓库中找到镜像的名称即可。

另外一种指定镜像的方式就是直接采用 Dockerfile 来构建镜像，通过 build 这个配置我们能够定义构建的环境目录，这与 `docker build` 中的环境目录是同一个含义。如果我们通过这种方式指定镜像，那么 Docker Compose 先会帮助我们执行镜像的构建，之后再通过这个镜像启动容器。

当然，在 `docker build` 里我们还能通过选项定义许多内容，这些在 Docker Compose 里我们依然可以。

```
## ......
  webapp:
    build:
      context: ./webapp
      dockerfile: webapp-dockerfile
      args:
        - JAVA_VERSION=1.6
## ......

```

在配置文件里，我们还能用 Map 的形式来定义 build，在这种格式下，我们能够指定更多的镜像构建参数，例如 Dockerfile 的文件名，构建参数等等。

当然，对于一些可以不通过重新构建镜像的方式便能修改的内容，我们还是不建议重新构建镜像，而是使用原有的镜像做简单的修改。

例如上面的配置里，我们希望修改 Redis 的启动命令，加入配置文件以便对 Redis 服务进行配置，那么我们可以直接通过 command 配置来修改。而在 MySQL 的定义，我们通过 environment 配置为 MySQL 设置了初始密码。

这些对镜像的使用方法我们在之前都已经谈到过了，只不过我们之前用的是 Docker Engine 的命令以及其选项来控制的，而在 Docker Compose 里，我们直接通过配置文件来定义它们。

由于 Docker Compose 的配置已经固化下来，所以我们不需要担心忘记之前执行了哪些命令来启动容器，当每次需要开启或关闭环境时，只需要 `docker-compose up -d` 和 `docker-compose down` 命令，就能轻松完成操作。

### 依赖声明

虽然我们在 Docker Compose 的配置文件里定义服务，在书写上有由上至下的先后关系，但实际在容器启动中，由于各种因素的存在，其顺序还是无法保障的。

所以，如果我们的服务间有非常强的依赖关系，我们就必须告知 Docker Compose 容器的先后启动顺序。只有当被依赖的容器完全启动后，Docker Compose 才会创建和启动这个容器。

定义依赖的方式很简单，在上面的例子里我们已经看到了，也就是 depends\_on 这个配置项，我们只需要通过它列出这个服务所有依赖的其他服务即可。在 Docker Compose 为我们启动项目的时候，会检查所有依赖，形成正确的启动顺序并按这个顺序来依次启动容器。

## 文件挂载

在 Docker Compose 里定义文件挂载的方式与 Docker Engine 里也并没有太多的区别，使用 volumes 配置可以像 docker CLI 里的 `-v` 选项一样来指定外部挂载和数据卷挂载。

在上面的例子里，我们看到了定义几种常用挂载的方式。我们能够直接挂载宿主机文件系统中的目录，也可以通过数据卷的形式挂载内容。

在使用外部文件挂载的时候，我们可以直接指定相对目录进行挂载，这里的相对目录是指相对于 docker-compose.yml 文件的目录。

由于有相对目录这样的机制，我们可以将 docker-compose.yml 和所有相关的挂载文件放置到同一个文件夹下，形成一个完整的项目文件夹。这样既可以很好的整理项目文件，也利于完整的进行项目迁移。

虽然 Docker 提倡将代码或编译好的程序通过构建镜像的方式打包到镜像里，随整个 CI 流部署到服务器中，但对于开发者来说，每次修改程序进行简单测试都要重新构建镜像简直是浪费生命的操作。所以在开发时，我们推荐直接将代码挂载到容器里，而不是通过镜像构建的方式打包成镜像。

同时，在开发过程中，对于程序的配置等内容，我们也建议直接使用文件挂载的形式挂载到容器里，避免经常修改所带来的麻烦。

### 使用数据卷

如果我们要在项目中使用数据卷来存放特殊的数据，我们也可以让 Docker Compose 自动完成对数据卷的创建，而不需要我们单独进行操作。

在上面的例子里，独立于 services 的 volumes 配置就是用来声明数据卷的。定义数据卷最简单的方式仅需要提供数据卷的名称，对于我们在 Docker Engine 中创建数据卷时能够使用的其他定义，也能够放入 Docker Compose 的数据卷定义中。

如果我们想把属于 Docker Compose 项目以外的数据卷引入进来直接使用，我们可以将数据卷定义为外部引入，通过 external 这个配置就能完成这个定义。

```
## ......
volumes:
  mysql-data:
    external: true
## ......

```

在加入 external 定义后，Docker Compose 在创建项目时不会直接创建数据卷，而是优先从 Docker Engine 中已有的数据卷里寻找并直接采用。

## 配置网络

网络也是容器间互相访问的桥梁，所以网络的配置对于多个容器组成的应用系统来说也是非常重要的。在 Docker Compose 里，我们可以为整个应用系统设置一个或多个网络。

要使用网络，我们必须先声明网络。声明网络的配置同样独立于 services 存在，是位于根配置下的 networks 配置。在上面的例子里，我们已经看到了声明 frontend 和 backend 这两个网络最简单的方式。

除了简单的声明网络名称，让 Docker Compose 自动按默认形式完成网络配置外，我们还可以显式的指定网络的参数。

```
networks:
  frontend:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 10.10.1.0/24
## ......

```

在这里，我们为网络定义了网络驱动的类型，并指定了子网的网段。

### 使用网络别名

直接使用容器名或服务名来作为连接其他服务的网络地址，因为缺乏灵活性，常常还不能满足我们的需要。这时候我们可以为服务单独设置网络别名，在其他容器里，我们将这个别名作为网络地址进行访问。

网络别名的定义方式很简单，这里需要将之前简单的网络 List 定义结构修改成 Map 结构，以便在网络中加入更多的定义。

```
## ......
  database:
    networks:
      backend:
        aliases:
          - backend.database
## ......
  webapp:
    networks:
      backend:
        aliases:
          - backend.webapp
      frontend:
        aliases:
          - frontend.webapp
## ......

```

在我们进行这样的配置后，我们便可以使用这里我们所设置的网络别名对其他容器进行访问了。

### 端口映射

在 Docker Compose 的每个服务配置里，我们还看到了 ports 这个配置项，它是用来定义端口映射的。

我们可以利用它进行宿主机与容器端口的映射，这个配置与 docker CLI 中 `-p` 选项的使用方法是近似的。

需要注意的是，由于 YAML 格式对 xx:yy 这种格式的解析有特殊性，在设置小于 60 的值时，会被当成时间而不是字符串来处理，所以我们最好使用引号将端口映射的定义包裹起来，避免歧义。

## 留言互动

在本节中，我们展示了 Docker Compose 中常见定义和配置的方法。这里给大家留一道实践题：

> 尝试利用 Docker Compose 以及之前所学习的 Docker 知识，为自己正在开发的应用搭建一个 Docker 运行环境。

欢迎大家通过留言的方式说出你的实践之路。我会选出有代表性的优质留言，推荐给大家。

同时，如果你对 Docker Compose 的配置方法还有疑问，或者有自己的使用技巧要与大家分享，可以加入到这本小册的官方微信群中，参与对相关问题的讨论。