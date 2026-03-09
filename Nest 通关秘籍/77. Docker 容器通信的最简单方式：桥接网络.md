上节我们讲 Docker Compose 的时候，涉及到多个 docker 容器的通信，我们是通过指定宿主机 ip 和端口的方式。

因为 mysql、redis 的 Docker 容器都映射到了宿主机的端口，那 nest 的容器就可以通过宿主机来实现和其他容器的通信。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ec74df386ed40b288a6dfad49189207~tplv-k3u1fbpfcp-watermark.image?)

Docker 的实现原理那节我们讲过，Docker 通过 Namespace 的机制实现了容器的隔离，其中就包括 Network Namespace。

因为每个容器都有独立的 Network Namespace，所以不能直接通过端口访问其他容器的服务。

那如果这个 Network Namespace 不只包括一个 Docker 容器呢？？

可以创建一个 Network Namespace，然后设置到多个 Docker 容器，这样这些容器就在一个 Namespace 下了，不就可以直接访问对应端口了？

Docker 确实支持这种方式，叫做桥接网络。

通过 docker network 来创建：

```
docker network create common-network
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6b0581641e5434bb7d39f52bad1dcab~tplv-k3u1fbpfcp-watermark.image?)

然后把之前的 3 个容器停掉、删除，我们重新跑：

```
docker stop mysql-container redis-container nest-container
docker rm mysql-container redis-container nest-container
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83ed97967b064613a7580c3bfa4776b8~tplv-k3u1fbpfcp-watermark.image?)

这次跑的时候要指定 --network：

```
docker run -d --network common-network -v /Users/guang/mysql-data:/var/lib/mysql --name mysql-container mysql
```

通过 --network 指定桥接网络为我们刚创建的 common-network。

不需要指定和宿主机的端口映射。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76daaa4894f54a5babcc1c9eb0024716~tplv-k3u1fbpfcp-watermark.image?)

然后跑 redis 容器：

```
docker run -d --network common-network -v /Users/guang/aaa:/data --name redis-container redis
```

同样也不需要指定和宿主机的端口映射，只需要指定挂载的数据卷就行：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6a084dc7a1f451c94ef591530a1b1eb~tplv-k3u1fbpfcp-watermark.image?)

然后 nest 的部分我们要改下代码：

修改 AppModule 的代码，改成用容器名来访问：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfd1c28f8d8f467398fdaae85387dab0~tplv-k3u1fbpfcp-watermark.image?)

然后 docker build：

```
docker build -t mmm .
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfa5e880fcb7409194a0f7cefee04c5e~tplv-k3u1fbpfcp-watermark.image?)

之后 docker run：

```
docker run -d --network common-network -p 3000:3000 --name nest-container mmm
```
nest 容器是要指定和宿主机的端口映射的，因为宿主机要访问这个端口的网页。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e7c09eae574150910c0e1091f8cb00~tplv-k3u1fbpfcp-watermark.image?)

然后 docker logs 看下日志：

```
docker logs nest-container
```
可以看到打印了 sql 语句，说明 mysql 连接成功了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da2df480dfd543eb8e082d1e196c3c82~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问 http://localhost:3000

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9793e4d7c6fd4643b3daab58a2419b31~tplv-k3u1fbpfcp-watermark.image?)

然后再看下日志：

```
docker logs nest-container
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25f6c35c4f5a440da7eff023b5859651~tplv-k3u1fbpfcp-watermark.image?)

打印了 redis 的 key 说明 redis 服务也连接成功了。

这就是桥接网络。

之前我们是通过宿主机 ip 来互相访问的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0bde70cdfc84cc0bb5c34b315e720a6~tplv-k3u1fbpfcp-watermark.image?)

现在可以通过容器名直接互相访问了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abe510871bfe463e91d5bcf0c62bd10f~tplv-k3u1fbpfcp-watermark.image?)

原理前面讲过，就是 Namespace。

本来是 3 个独立的 Network Namespace：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfd1e150584e474abded84fc4d723f36~tplv-k3u1fbpfcp-watermark.image?)

桥接之后就这样了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5399801f540f4ec685bbe4826f1ecb4d~tplv-k3u1fbpfcp-watermark.image?)

Namespace 下包含多个子 Namespace，互相能通过容器名访问。

比起端口映射到宿主机，再访问宿主机 ip 的方式，简便太多了。

那在 Docker Compose 里怎么使用这种方式呢？

之前我们是这样写的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34ef19cd837f4ea384455edb1d5be88e~tplv-k3u1fbpfcp-watermark.image?)

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
    environment:
      MYSQL_DATABASE: aaa
      MYSQL_ROOT_PASSWORD: guang
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

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/595343b3d0d8486c89956efacebcc0bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=1092&s=139769&e=png&b=1f1f1f)

然后下面通过 networks 指定创建的 common-network 桥接网络，网络驱动程序指定为 bridge。

其实我们一直用的网络驱动程序都是 bridge，它的含义是容器的网络和宿主机网络是隔离开的，但是可以做端口映射。比如 -p 3000:3000、-p 3306:3306 这样。

然后执行：

```
docker-compose down --rmi all
```

就会删除 3 个容器和它们的镜像：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e414c34add64f10a3409775e9028143~tplv-k3u1fbpfcp-watermark.image?)

之后再 

```
docker-compose up
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/047d3b091aff45d0bf09ae7e01a1ed06~tplv-k3u1fbpfcp-watermark.image?)

可以看到，会先 build dockerfile 产生镜像，然后把 3 个镜像跑起来。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d8b98c4077f44f0ad7886d184d11a27~tplv-k3u1fbpfcp-watermark.image?)

看到打印的 sql 说明 mysql 服务连接成功了。

（这个过程可能因为 mysql 容器没跑起来而连接失败几次，等一会就好了）

浏览器访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b7e105654dd489aa5b3cecc915d1b4e~tplv-k3u1fbpfcp-watermark.image?)

也拿到了 redis 的 key，说明 redis 服务跑成功了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1018ec77ff224a438bcb09f6d7744b58~tplv-k3u1fbpfcp-watermark.image?)

这就是在 docker-compose 里使用桥接网络的方式。

不过，其实不指定 networks 也可以，docker-compose 会创建个默认的。

先把容器、镜像删掉：
```
docker-compose down --rmi all
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/809e549f3c4c45bfa53b8f5b39402348~tplv-k3u1fbpfcp-watermark.image?)

把 networks 部分注释掉，重新跑：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eef9726f71e347be8cb8ae6cd94a10f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=738&h=1094&s=135173&e=png&b=1f1f1f)

你会发现它创建了一个默认的 network：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb214c9e8ab24a01ba79eac6f4b09148~tplv-k3u1fbpfcp-watermark.image?)

mysql 和 redis 的访问都是正常的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/263868b2d76b4c5ba842a82dc140e0b9~tplv-k3u1fbpfcp-watermark.image?)

所以，不手动指定 networks，也是可以用桥接网络的。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/docker-compose-test)。

## 总结

上节我们是把 mysql、redis 的端口映射到宿主机，然后 nest 的容器里通过宿主机 ip 访问这两个服务的。

但其实有更方便的方式，就是桥接网络。

通过 docker network create 创建一个桥接网络，然后 docker run 的时候指定 --network，这样 3 个容器就可以通过容器名互相访问了。

在 docker-compose.yml 配置下 networks 创建桥接网络，然后添加到不同的 service 上即可。

或者不配置 networks，docker-compose 会生成一个默认的。

实现原理就是对 Network Namespace 的处理，本来是 3个独立的 Namespace，当指定了 network 桥接网络，就可以在 Namespace 下访问别的 Namespace 了。

多个容器之间的通信方式，用桥接网络是最简便的。
