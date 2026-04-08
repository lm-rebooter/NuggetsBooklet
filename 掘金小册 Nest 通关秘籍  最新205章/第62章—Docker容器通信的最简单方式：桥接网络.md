### 本资源由 itjc8.com 收集整理
﻿上节我们讲 Docker Compose 的时候，涉及到多个 docker 容器的通信，我们是通过指定宿主机 ip 和端口的方式。

因为 mysql、redis 的 Docker 容器都映射到了宿主机的端口，那 nest 的容器就可以通过宿主机来实现和其他容器的通信。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-1.png)

Docker 的实现原理那节我们讲过，Docker 通过 Namespace 的机制实现了容器的隔离，其中就包括 Network Namespace。

因为每个容器都有独立的 Network Namespace，所以不能直接通过端口访问其他容器的服务。

那如果这个 Network Namespace 不只包括一个 Docker 容器呢？？

可以创建一个 Network Namespace，然后设置到多个 Docker 容器，这样这些容器就在一个 Namespace 下了，不就可以直接访问对应端口了？

Docker 确实支持这种方式，叫做桥接网络。

通过 docker network 来创建：

```
docker network create common-network
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-2.png)

然后把之前的 3 个容器停掉、删除，我们重新跑：

```
docker stop mysql-container redis-container nest-container
docker rm mysql-container redis-container nest-container
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-3.png)

这次跑的时候要指定 --network：

```
docker run -d --network common-network -v /Users/guang/mysql-data:/var/lib/mysql --name mysql-container mysql
```

通过 --network 指定桥接网络为我们刚创建的 common-network。

不需要指定和宿主机的端口映射。

![image.png](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-4.png)

然后跑 redis 容器：

```
docker run -d --network common-network -v /Users/guang/aaa:/data --name redis-container redis
```

同样也不需要指定和宿主机的端口映射，只需要指定挂载的数据卷就行：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-5.png)

然后 nest 的部分我们要改下代码：

修改 AppModule 的代码，改成用容器名来访问：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-6.png)

然后 docker build：

```
docker build -t mmm .
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-7.png)

之后 docker run：

```
docker run -d --network common-network -p 3000:3000 --name nest-container mmm
```
nest 容器是要指定和宿主机的端口映射的，因为宿主机要访问这个端口的网页。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-8.png)

然后 docker logs 看下日志：

```
docker logs nest-container
```
可以看到打印了 sql 语句，说明 mysql 连接成功了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-9.png)

浏览器访问 http://localhost:3000

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-10.png)

然后再看下日志：

```
docker logs nest-container
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-11.png)

打印了 redis 的 key 说明 redis 服务也连接成功了。

这就是桥接网络。

之前我们是通过宿主机 ip 来互相访问的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-12.png)

现在可以通过容器名直接互相访问了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-13.png)

原理前面讲过，就是 Namespace。

本来是 3 个独立的 Network Namespace：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-14.png)

桥接之后就这样了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-15.png)

Namespace 下包含多个子 Namespace，互相能通过容器名访问。

比起端口映射到宿主机，再访问宿主机 ip 的方式，简便太多了。

那在 Docker Compose 里怎么使用这种方式呢？

之前我们是这样写的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-16.png)

现在改成这样：

```yml
version: '3.8'
services:
  nest-app:
    build:
      context: ./
      dockerfile: ./Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - '3000:3000'
    networks:
      - common-network
  mysql-container:
    image: mysql
    volumes:
      - /Users/guang/mysql-data:/var/lib/mysql
    networks:
      - common-network
  redis-container:
    image: redis
    volumes:
      - /Users/guang/aaa:/data
    networks:
      - common-network
networks:
  common-network:
    driver: bridge
```
version 是指定 docker-compose.yml 的版本，因为不同版本配置不同。

把 mysql-container、redis-container 的 ports 映射去掉，指定桥接网络为 common-network。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-17.png)

然后下面通过 networks 指定创建的 common-network 桥接网络，网络驱动程序指定为 bridge。

其实我们一直用的网络驱动程序都是 bridge，它的含义是容器的网络和宿主机网络是隔离开的，但是可以做端口映射。比如 -p 3000:3000、-p 3306:3306 这样。

然后执行：

```
docker-compose down --rmi all
```

就会删除 3 个容器和它们的镜像：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-18.png)

之后再 

```
docker-compose up
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-19.png)

可以看到，会先 build dockerfile 产生镜像，然后把 3 个镜像跑起来。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-20.png)

看到打印的 sql 说明 mysql 服务连接成功了。

（这个过程可能因为 mysql 容器没跑起来而连接失败几次，等一会就好了）

浏览器访问下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-21.png)

也拿到了 redis 的 key，说明 redis 服务跑成功了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-22.png)

这就是在 docker-compose 里使用桥接网络的方式。

不过，其实不指定 networks 也可以，docker-compose 会创建个默认的。

先把容器、镜像删掉：
```
docker-compose down --rmi all
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-23.png)

把 networks 部分注释掉，重新跑：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-24.png)

你会发现它创建了一个默认的 network：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-25.png)

mysql 和 redis 的访问都是正常的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第62章-26.png)

所以，不手动指定 networks，也是可以用桥接网络的。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/docker-compose-test)。

## 总结

上节我们是把 mysql、redis 的端口映射到宿主机，然后 nest 的容器里通过宿主机 ip 访问这两个服务的。

但其实有更方便的方式，就是桥接网络。

通过 docker network create 创建一个桥接网络，然后 docker run 的时候指定 --network，这样 3 个容器就可以通过容器名互相访问了。

在 docker-compose.yml 配置下 networks 创建桥接网络，然后添加到不同的 service 上即可。

或者不配置 networkds，docker-compose 会生成一个默认的。

实现原理就是对 Network Namespace 的处理，本来是 3个独立的 Namespace，当指定了 network 桥接网络，就可以在 Namespace 下访问别的 Namespace 了。

多个容器之间的通信方式，用桥接网络是最简便的。
