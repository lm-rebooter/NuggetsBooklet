我们学习了 Nest、Mysql、Redis，并且在 Nest 里远程连接 Mysql 和 Redis 来做数据存储、增删改查。

Mysql 和 Redis 都是跑在 Docker 容器里的。

部署 Nest 项目的时候也是跑的 dockerfile + docker build 产生的镜像。

这就涉及到了 3 个 Docker 容器：Nest、Mysql、Redis。

后面可能还会涉及到更多的 Docker 容器。

那么问题来了，每次想把项目跑起来都要 docker run 一堆镜像也太麻烦了，有没有什么简便方式呢？

而且，这么多的容器怎么保证启动顺序呢？

解决方式是有的，就是 Docker Compose。

我们先来看看不用 Docker Compose 的时候怎么部署：

```
nest new docker-compose-test -p npm
```

创建个 nest 项目：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/605cf4824e2e47b1bb6ff94efb0941d6~tplv-k3u1fbpfcp-watermark.image?)

安装 tyeporm、mysql2；

```
npm install --save @nestjs/typeorm typeorm mysql2
```
然后在 AppModule 引入 TypeOrmModule：

```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "aaa",
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```
这里的 database 我们在 mysql workbench 里创建下：

```sql
CREATE DATABASE `aaa` DEFAULT CHARACTER SET utf8mb4 ;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4432b2d708245a4bd0c7af9f5e80491~tplv-k3u1fbpfcp-watermark.image?)

添加一个 aaa.entity.ts

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Aaa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 30
    })
    aaa: string;

    @Column({
        length: 30
    })
    bbb: string;
}

```
在 entities 里注册下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffab8b23a32f4fd8979cb48490a7a66a~tplv-k3u1fbpfcp-watermark.image?)

然后把 nest 服务跑起来：

```
npm run start:dev
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f67676d48e3845c0904e3bb3ae349f57~tplv-k3u1fbpfcp-watermark.image?)

可以看到，执行了 create table 的 sql。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5379c95af8cc4817b937bdd986ecf66c~tplv-k3u1fbpfcp-watermark.image?)

说明 mysql 是连接成功了。

然后再引入 redis：

```
npm install redis 
```

添加一个 redis client 的 provider：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ce80e15241042b8ae8620ef7aa56838~tplv-k3u1fbpfcp-watermark.image?)

```javascript
{
  provide: 'REDIS_CLIENT',
  async useFactory() {
    const client = createClient({
        socket: {
            host: 'localhost',
            port: 6379
        }
    });
    await client.connect();
    return client;
  }
}
```

在 AppService 里注入下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebb1480197e14ddd8134828b7da1b05a~tplv-k3u1fbpfcp-watermark.image?)

```javascript
import { Controller, Get, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  @Get()
  async getHello() {
    const keys = await this.redisClient.keys('*');
    console.log(keys);

    return this.appService.getHello();
  }
}

```

这里用到的 mysql、redis 都是之前通过 docker 跑的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1924de5ae5a4a0caa02ede4850aa9da~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f9d8c2c694f436088bea0a027936824~tplv-k3u1fbpfcp-watermark.image?)

忘记怎么跑 msyql 和 redis 的 docker 容器的同学去翻一下这两个的入门章节。

然后访问下 http://localhost:3000

打印了 redis 里的 key：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d67ee74577644431aed5c8f931e1c5bd~tplv-k3u1fbpfcp-watermark.image?)

在 RedisInsight 里看到的也是这些：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b22ee301fd0a4004aef56cd20fff23eb~tplv-k3u1fbpfcp-watermark.image?)

这就说明 redis 服务连接成功了。

这里就不写具体的业务逻辑了。

假设我们 nest 服务开发完了，想部署，那就要写这样的 dockerfile：

```docker
FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18.0-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
```
用多阶段构建的方式，最后只保留生产阶段的镜像。

用 alpine 的基础镜像，体积会减小很多。

这些前面讲过。

在根目录添加这个 Dockerfile，然后 docker build 一下：

```
docker build -t eee .
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94a3329575324bc0a0c02011a7cac33a~tplv-k3u1fbpfcp-watermark.image?)

（我这里稍微有点久，用了 200 多秒）

在 docker desktop 里可以看到这个镜像：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3c1ce7e132d4982bc342844ce51d18a~tplv-k3u1fbpfcp-watermark.image?)

那假设在服务器上，要怎么部署这个 nest 应用呢？

我们先把 mysql、redis 的容器停掉。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2f6b24fc03b4839a5ea28e286517d71~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/671d1a8ee3f4414a8eba2596360273c0~tplv-k3u1fbpfcp-watermark.image?)

在服务器上，是没有 docker desktop 的，所以接下来我们通过命令行的方式：

先跑 mysql 的 docker 容器：

```
docker run -d -p 3306:3306 -v /Users/guang/mysql-data:/var/lib/mysql --name mysql-container mysql
```
-d 是 deamon，放到后台运行的意思。

-p 是端口映射

-v 是挂载数据卷，把宿主机目录映射到容器内的目录（这里要换成你自己的）

-name 是容器名

可能还需要指定环境变量：

-e MYSQL\_ROOT\_PASSWORD=xxx 设置 root 用户的密码

因为我之前跑过，在数据卷的那个目录有之前的设置，所以不用设置了。

跑起来可以看到容器 id：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cb7a522c2b54c21af4d20f6f2c43bca~tplv-k3u1fbpfcp-watermark.image?)

然后再跑下 redis 的 docker 容器：

```
docker run -d -p 6379:6379 -v /Users/guang/aaa:/data --name redis-container redis
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d3b54904a3546268e8a2ac4239d1f3d~tplv-k3u1fbpfcp-watermark.image?)

之后跑 nest 的：
```
docker run -d -p 3000:3000 --name nest-container eee
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7d176fbfecb4c7e9d1ef4a7d147f220~tplv-k3u1fbpfcp-watermark.image?)

看下 3个容器的日志

```
docker logs mysql-container
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1637f6b2408c4cf298bcd29c16bc34e0~tplv-k3u1fbpfcp-watermark.image?)
```
docker logs redis-container
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0a9bdd7e7f649c7be8a487384dbf74a~tplv-k3u1fbpfcp-watermark.image?)

```
docker logs nest-container
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f40f55af90a8457c9ab46a20d98571e6~tplv-k3u1fbpfcp-watermark.image?)

这时候你会发现报错了，说是 127.0.0.1 的 6379 端口连不上。

为什么呢？

因为这时候 127.0.0.1 就是容器内的端口了，不是宿主机的。

所以要把 ip 换成宿主机 ip 才行。

查一下本机的 ip 地址：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e9a55534fcf4378bcf3a937334e81ca~tplv-k3u1fbpfcp-watermark.image?)

然后把 AppModule 里的 redis 和 mysql 连接信息改一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e73db614ebfc41d9a3ad32206755446a~tplv-k3u1fbpfcp-watermark.image?)

之后重新 build 一个镜像：
```
docker build -t fff .
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6f2ae1846d84028828b6ee20309f750~tplv-k3u1fbpfcp-watermark.image?)

这次构建用了 120s，比上次快，因为本地有缓存了。

把之前的容器删掉：

```
docker rm nest-container
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8efc3eea23c14e2d8e3251c0125c571f~tplv-k3u1fbpfcp-watermark.image?)

然后在数据库里把 aaa这个表删掉：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/274afd50569d42cd87f63b9d95fd0925~tplv-k3u1fbpfcp-watermark.image?)

再跑 nest 容器：

```
docker run -d -p 3000:3000 --name nest-container fff
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cabd753e7f404c868ad883e2fa00dca0~tplv-k3u1fbpfcp-watermark.image?)


这时候再查看日志：

```
docker logs nest-container
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a446a7c7e1b147e6b4769188198c039d~tplv-k3u1fbpfcp-watermark.image?)

这时候就正常了。

可以看到 sql 打印是正确的。

表也创建成功了：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75e04bed2e7c4e82b7b94ffa473c83e5~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问下 http://localhost:3000

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a8c60731a694f61a6121ce61568c5cb~tplv-k3u1fbpfcp-watermark.image?)

再次 docker logs 看看：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b65399e20ab5413385bb1d83d784ef59~tplv-k3u1fbpfcp-watermark.image?)

可以看到 redis 服务也连接成功了。

这样我们就把 mysql、redis、nest 3个 docker 容器跑了起来。

可以发现我们跑了 3 次  docker build，而且还要注意顺序，不然 nest 服务跑起来了，但是 mysql 服务没跑起来，就会报错。

前面说，docker compose 可以解决这种问题。

怎么解决呢？

把 3 个容器停掉：

```
docker stop nest-container mysql-container redis-container
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e5ab3e72ccb47d9bd144fdf785ec4d2~tplv-k3u1fbpfcp-watermark.image?)

然后在根目录添加一个 docker-compose.yml

```yaml
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
  mysql-container:
    image: mysql
    ports:
      - '3306:3306'
    volumes:
      - /Users/guang/mysql-data:/var/lib/mysql
    environment:
      MYSQL_DATABASE: aaa
      MYSQL_ROOT_PASSWORD: guang
  redis-container:
    image: redis
    ports:
      - '6379:6379'
    volumes:
      - /Users/guang/aaa:/data
```
每个 services 都是一个 docker 容器，名字随便指定。

这里指定了 nest-app、mysql-container、reids-container 3 个service：

然后 nest-app 配置了 depends_on 其他两个 service。

这样 docker-compose 就会先启动另外两个，再启动这个，这样就能解决顺序问题。

然后 mysql-container、redis-container 的 service 指定了 image 和 ports、volumes 的映射，这些都很容易看懂。

mysql 容器跑的时候还要指定 MYSQL_DATABASE 和 MYSQL_ROOT_PASSWORD 环境变量。

MYSQL_ROOT_PASSWORD 是 root 用户的密码，MYSQL_DATABASE 是会自动创建的 database。

nest-app 指定了 context 下的 dockerfile 路径，端口映射。

然后我们通过 docker-compose 把它跑起来：

```
docker-compose up
```
docker-compose 和 docker 命令是一起的，docker 能用，docker-compose 就能用。


它会把所有容器的日志合并输出：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/263e9946b8584f129f59bb1b2c0ddc40~tplv-k3u1fbpfcp-watermark.image?)

可以看到是先跑的 mysql、redis，再跑的 nest。

只不过 mysql 服务启动有点慢，会连接失败几次。

最后是会成功的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/385d1bf97b8f4afa81e61d1d42cd9ba5~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问下 http://localhost:3000


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/110be8842ddf493489526791d351dd88~tplv-k3u1fbpfcp-watermark.image?)

可以看到 redis 也连接成功了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc2e7573a9b424aa10551ad3d6bdfe4~tplv-k3u1fbpfcp-watermark.image?)

这样，我们只需要定义 docker-compose.yaml 来声明容器的顺序和启动方式，之后执行 docker-compose up 一条命令就能按照顺序启动所有的容器。

启动流程就简便了很多。

这就是 docker-compose 的意义。

这时候如果你去 docker desktop 里看下，会发现它有专门的显示方式：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ed7de84c738426caf96b938b8a8018e~tplv-k3u1fbpfcp-watermark.image?)

多个容器可以一起管理。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/docker-compose-test)。

## 总结

这节我们通过 docker、docker-compose 两种方式来部署了 nest 项目。

docker 的方式需要手动 docker build 来构建 nest 应用的镜像。

然后按顺序使用 docker run 来跑 mysql、redis、nest 容器。

（要注意 nest 容器里需要使用宿主机 ip 来访问 mysql、redis 服务）

而 docker compose 就只需要写一个 docker-compose.yml 文件，配置多个 service 的启动方式和 depends_on 依赖顺序。

然后 docker-compose up 就可以批量按顺序启动一批容器。

基本上，我们跑 Nest 项目都会依赖别的服务，所以在单台机器跑的时候都是需要用 Docker Compose 的。
