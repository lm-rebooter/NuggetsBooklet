前面我们学习了 Docker、Docker Compose，并在 Docker 容器里通过 pm2-runtime 来跑的 node 服务。

主要是用 pm2 可以在进程崩溃的时候重启进程的功能。

而其实这个功能 Docker 也是有的。

我们来试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79d19e3ae36b43db873c883bfed5e831~tplv-k3u1fbpfcp-watermark.image?)

```javascript
setTimeout(() => {
    throw new Error('xxx');
}, 1000);
```
1s 以后抛一个错误，进程会终止。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b01b5671e64c49d8bbac08b0351a6937~tplv-k3u1fbpfcp-watermark.image?)

然后我们把它放到 Docker 容器里跑。

写个 dockerfile：

```docker
FROM node:18-alpine3.14

WORKDIR /app

COPY ./index.js .

CMD ["node", "/app/index.js"]
```
然后构建成镜像：

```shell
docker build -t restart-test:first .
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30be5a3744f6419a835911a927f6e0d9~tplv-k3u1fbpfcp-watermark.image?)

在 docker desktop 里可以看到：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/442eb01bbb4f480199d473cf41d87c0e~tplv-k3u1fbpfcp-watermark.image?)

然后把它跑起来：

```
docker run --name=restart-test-container restart-test:first
```
可以看到，容器 1s 后就停掉了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b27ad9f647c84e7c8b52644a5831f0cd~tplv-k3u1fbpfcp-watermark.image?)

当进程退出的时候，容器也会停止。

docker run 的时候也可以指定重启策略：
```
docker run -d --restart=always --name=restart-test-container2 restart-test:first
```
这次加上 -d 把它放到后台跑。

--restart 指定总是重启。

然后你在 docker desktop 里就可以看到它一直在 restart：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3588c2f8a4964de09fb232ce2b1d172e~tplv-k3u1fbpfcp-watermark.image?)

打印了很多次错误日志：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d9da6312cb0441bbe32c69d0f787564~tplv-k3u1fbpfcp-watermark.image?)

你可以点击停止，就不会再重启了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4d553a0a8cf465ab25bc1b1eaa40f51~tplv-k3u1fbpfcp-watermark.image?)

这就是 docker 的自动重启功能。

前面说过，pm2 也可以自动重启。

我们试试：

新建个 222.Dockerfile:

```docker
FROM node:18-alpine3.14

WORKDIR /app

COPY ./index.js .

RUN npm install -g pm2

CMD ["pm2-runtime", "/app/index.js"]

```
然后 build 一下，生成镜像：

```
docker build -t restart-test:second -f 222.Dockerfile .
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eae0f072c6ce4622b6c46733dd27db78~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9fcfa27f56a4cb69ea935a28679b29b~tplv-k3u1fbpfcp-watermark.image?)

然后跑一下：
```
docker run -d --name=restart-test-container3 restart-test:second
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ad67906ce364991acbe830204e06aff~tplv-k3u1fbpfcp-watermark.image?)

这时候你会发现容器一直是运行状态，但是内部的进程一直在重启：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caf61e221d2c4f76a5efc38e0694f5e5~tplv-k3u1fbpfcp-watermark.image?)

也就是说，Docker 的自动重启功能和 PM2 的自动重启功能是重合的。

那还有必要用 PM2 么？

其实 PM2 诞生的时候是没有 Docker 这种容器技术的，那时候都是直接部署在机器上，这时候自然需要一个进程管理工具来做进程的重启、负载均衡等功能。这是 PM2 当年很流行的原因。

但后来有了 Docker，里面跑的进程崩溃之后，Docker 容器支持自动重启。

所以，大多数情况下，没必要再用 PM2 了。

而且如果你用了 K8S 这种容器编排工具，那更没必要用 PM2 了，直接让 K8S 去调度、重启容器就可以。

但也有另一种说法，Docker 重新跑容器的成本，是比容器内 PM2 重新跑进程的成本高的，所以用 PM2 来管理进程更好一点。

综上，有了 Docker 基本没大有必要用 PM2 了。但如果单独跑 Docker 容器，还是可以结合 pm2-runtime 来提高重启速度的。

然后我们继续来看 Docker 的重启策略：

默认是 no，也就是不自动重启。

我们测试了 always，是容器退出时总是重启。

其实还有 on-failure 和 unless-stopped 这两种：

on-failure 是只有在非正常退出的时候才重启，相比之下，always 不管是不是非正常退出都重启。

而且 on-failure 还可以指定最多重启几次，比如 on-failure:3 是最多重启三次。

我们试一下：

```
docker run -d --restart=on-failure:2 --name=restart-test-container4 restart-test:first
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2f20974e8414438baf8e031343884fd~tplv-k3u1fbpfcp-watermark.image?)

可以看到容器重启了 2 次，一共打印了 3 次错误就不再重启了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aecb683f615e4df5817857492d662dcd~tplv-k3u1fbpfcp-watermark.image?)

再来试试 unless-stopped：

unless-stopped 是除非手动停止，否则总是会重启。

```
docker run -d --restart=unless-stopped --name=restart-test-container5 restart-test:first
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44c481d7b3a14646afeeca1869242df1~tplv-k3u1fbpfcp-watermark.image?)

可以看到容器一直在重启：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ee727df0f3c4255b288997a0bacd872~tplv-k3u1fbpfcp-watermark.image?)

除非点击停止按钮，也就是执行 docker stop 才会停止：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23e73caafe1f4b8d9da4fa258043fa37~tplv-k3u1fbpfcp-watermark.image?)

```
docker stop restart-test-container5
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37f82a673df44b2dba54dad27b47406c~tplv-k3u1fbpfcp-watermark.image?)


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cb0ae15b4864ca2bc211e985e86522e~tplv-k3u1fbpfcp-watermark.image?)

那看起来和 always 也没啥区别呀，都是只有手动 stop 才能停止，否则一直重启。

还是有区别的，就是在 Docker Deamon 重启的时候。

现在 docker-test-container2 是用的 always 的重启策略，docker-test-container5 是用的 unless-stopped 的重启策略:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c10f4ad725ac4f949ca99d498df45cfe~tplv-k3u1fbpfcp-watermark.image?)

这俩容器都停掉了。

现在我们重启 Docker：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c795fc3e9b67418eb32ccc804f7148d5~tplv-k3u1fbpfcp-watermark.image?)

他会重启跑 Docker Engine ，也就是 Docker Deamon 的后台进程。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86d55f34b6e5426f87d014a701f97578~tplv-k3u1fbpfcp-watermark.image?)

这时候你会发现，always 重启策略的容器又跑起来了，而 unless-stopped 的容器没有重启。这就是这俩的区别：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/daf46a72601f43af877f5b6eee7dff41~tplv-k3u1fbpfcp-watermark.image?)

Docker Compose 是用于同时跑多个 Docker 容器的，它自然也支持 restart 的配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c171bb5150949c5b1657523e6b96799~tplv-k3u1fbpfcp-watermark.image?)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/docker-restart-test)。

## 总结

Docker 是支持自动重启的，可以在 docker run 的时候通过 --restart 指定重启策略，或者 Docker Compose 配置文件里配置 restart。

有 4 种重启策略：

- no: 容器退出不自动重启（默认值）
- always：容器退出总是自动重启，除非 docker stop。
- on-failure：容器非正常退出才自动重启，还可以指定重启次数，如 on-failure:5
- unless-stopped：容器退出总是自动重启，除非 docker stop

重启策略为 always 的容器在 Docker Deamon 重启的时候容器也会重启，而 unless-stopped 的不会。

其实我们用 PM2 也是主要用它进程崩溃的时候重启的功能，而在有了 Docker 之后，用它的必要性就不大了。

当然，进程重启的速度肯定是比容器重启的速度快一些的，如果只是 Docker 部署，可以结合 pm2-runtime 来做进程的重启。

绝大多数情况下，直接用 Docker 跑 node 脚本就行，不需要 PM2。
