Docker 是一种容器技术，它可以在操作系统上创建多个相互隔离的容器。容器内独立安装软件、运行服务。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db580a5bbf2847d8a4fb9607e9a9775e~tplv-k3u1fbpfcp-watermark.image?)

但是，这个容器和宿主机还是有关联的，比如可以把宿主机的端口映射到容器内的端口、宿主机某个目录挂载到容器内的目录。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf13c72485e642a28a9aa6b2ecf2bc00~tplv-k3u1fbpfcp-watermark.image?)

比如映射了 3000 端口，那容器内 3000 端口的服务，就可以在宿主机的 3000 端口访问了。

比如挂载了 /aaa 到容器的 /bbb/ccc，那容器内读写 /bbb/ccc 目录的时候，改的就是宿主机的 /aaa 目录，反过来，改宿主机 /aaa 目录，容器内的 /bbb/ccc 也会改，这俩同一个。

这分别叫做端口映射、数据卷（volume）挂载。

这个容器是通过镜像起来的，通过 docker run image-name。

比如:

```
docker run -p 3000:3000 -v /aaa:/bbb/ccc --name xxx-container xxx-image
```
通过 xxx-image 镜像跑起来一个叫做 xxx-container 的容器。

-p 指定端口映射，映射宿主机的 3000 到容器的 3000 端口。

-v 指定数据卷挂载，挂载宿主机的 /aaa 到容器的 /bbb/ccc 目录。

这个镜像是通过 Dockerfile 经过 build 产生的。

也就是这样的流程：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27011d7643014cd9b50777a504448537~tplv-k3u1fbpfcp-watermark.image?)

一般在项目里维护 Dockerfile ，然后执行 docker build 构建出镜像、push 到镜像仓库，部署的时候 pull 下来用 docker run 跑起来。

基本 CI/CD 也是这样的流程：

CI 的时候 git clone 项目，根据 dockerfile 构建出镜像，打上 tag，push 到仓库。

CD 的时候把打 tag 的镜像下下来，docker run 跑起来。

这个 Dockerfile 是在项目里维护的，虽然 CI/CD 流程不用自己搞，但是 Dockefile 还是要开发者自己写的。

比如我创建一个 nest 项目：

```
npx nest new dockerfile-test -p npm
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1e748e934b649739ddff4183054202c~tplv-k3u1fbpfcp-watermark.image?)

然后执行 npm run build，之后把它跑起来：

```
npm run build
node ./dist/main.js
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bd4b983d31743ebb2bdb1e62aad1807~tplv-k3u1fbpfcp-watermark.image?)

这时候访问 http://localhost:3000 可以看到 hello world，说明服务跑成功了:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d9fe3c0161b4b6c8e5dd4432d08b314~tplv-k3u1fbpfcp-watermark.image?)

那如何通过 Docker 部署这个服务呢？

我们来写下 Dockerfile：

```docker
FROM node:18

WORKDIR /app

COPY package.json .

COPY *.lock .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/main.js" ]
```
FROM node:18 是继承 node:18 基础镜像。

WORKDIR /app 是指定当前目录为 /app

COPY 复制宿主机的 package.json 和 lock 文件到容器的当前目录，也就是 /app 下

RUN 是执行命令，这里执行了 npm install。

然后再复制其余的文件到容器内。

EXPOSE 指定容器需要暴露的端口是 3000。

CMD 指定容器跑起来时执行的命令是 node ./dist/main.js。

然后通过 docker build 把它构建成镜像：

```
docker build -t dockerfile-test:first .
```

-t 是指定名字和标签，这里镜像名为 dockerfile-test 标签为 first。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac919ad51f5b485c990d71cba714de7d~tplv-k3u1fbpfcp-watermark.image?)

然后在 docker desktop 的 images 里就可以看到这个镜像了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64797c3c1bea4d5186f616fe32fe0d8f~tplv-k3u1fbpfcp-watermark.image?)

就是现在镜像稍微大了点，有 1.45 G。

我们先跑起来看看：

```
docker run -d -p 2333:3000 --name first-container dockerfile-test:first
```
-d 是后台运行。

-p 指定端口映射，映射宿主机的 2333 端口到容器的 3000 端口。

--name 指定容器名

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d49b82111dc45abb0c1206a06f16a6f~tplv-k3u1fbpfcp-watermark.image?)

然后就可以看到容器部分有了这个容器了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e3919be67ab4685847772c6515b7ebb~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问 http://localhost:2333 就可以访问容器内跑的这个服务：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf1ce464be31409a928a509990431be8~tplv-k3u1fbpfcp-watermark.image?)

这就是 Dockerfile 构建成镜像，然后通过容器跑起来的流程。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c06a4afd1027473cb21e7cbd66254cb1~tplv-k3u1fbpfcp-watermark.image?)

但是刚才也发现了，现在镜像太大了，有 1.45G 呢，怎么优化一下呢？

这就涉及到了第一个技巧：

## 使用 alpine 镜像，而不是默认的 linux 镜像

docker 容器内跑的是 linux 系统，各种镜像的 dockerfile 都会继承 linux 镜像作为基础镜像。

比如我们刚刚创建的那个镜像，点开详情可以看到它的镜像继承关系：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7b4e66157f04e6db41c120223e1181c~tplv-k3u1fbpfcp-watermark.image?)

最终还是继承了 debian 的 Linux 镜像，这是一个 linux 发行版。

但其实这个 linux 镜像可以换成更小的版本，也就是 alpine。

它裁剪了很多不必要的 linux 功能，使得镜像体积大幅减小了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/786525d5a5fa49e492bb70a6fc22af5d~tplv-k3u1fbpfcp-watermark.image?)

alpine 是高山植物，就是很少的资源就能存活的意思。

我们改下 dockerfile，使用 alpine 的镜像：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e94bfb985f244cd8447778d28b938ec~tplv-k3u1fbpfcp-watermark.image?)

node:18-alpine3.14 是使用 18 版本的 node 镜像，它底层使用 alpine 3.14 的基础镜像。

然后 docker build

```
docker build -t dockerfile-test:second .
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fceb38d17b540e8a792eaa702b7fba8~tplv-k3u1fbpfcp-watermark.image?)

这次的 tag 为 second。

然后在 docker desktop 里看下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ad3b246c6f74294b0bcaf68811b8719~tplv-k3u1fbpfcp-watermark.image?)

好家伙，足足小了 900M。

我们点开看看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f64dcd18ace42b695220fd46b794f3d~tplv-k3u1fbpfcp-watermark.image?)

可以看到它的底层 linux 镜像是 alpine3.14。

体积小了这么多，功能还正常么？

我们跑跑看：

```
docker run -d -p 2334:3000 --name second-container dockerfile-test:second
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/296e3082a1fa427abacce2129f9aea06~tplv-k3u1fbpfcp-watermark.image?)

docker desktop 可以看到这个跑起来的容器：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a581340a62694ef7a81439ad900f1357~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问下，依然是正常的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ad33cfcc58e425b938620683d617bf2~tplv-k3u1fbpfcp-watermark.image?)

alpine 只是去掉了很多 linux 里用不到的功能，使得镜像体积更小。

这就是第一个技巧。

然后再来看第二个：

## 使用多阶段构建

看下这个 dockerfile，大家发现有啥问题没：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c5c7b72c0e74681a19d9a9627c9e7b2~tplv-k3u1fbpfcp-watermark.image?)

有的同学可能会说：为什么先复制 package.json 进去，安装依赖之后再复制其他文件，直接全部复制进去不就行了？

不是的，这两种写法的效果不同。

docker 是分层存储的，dockerfile 里的每一行指令是一层，会做缓存。

每次 docker build 的时候，只会从变化的层开始重新构建，没变的层会直接复用。

也就说现在这种写法，如果 package.json 没变，那么就不会执行 npm install，直接复用之前的。

那如果一开始就把所有文件复制进去呢？

那不管 package.json 变没变，任何一个文件变了，都会重新 npm install，这样没法充分利用缓存，性能不好。

我们试试看就知道了：

现在重新跑 docker build，不管跑多少次，速度都很快，因为文件没变，直接用了镜像缓存：

```
docker build -t dockerfile-test:second .
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03cec6ad71964ff78d1c96398eae7584~tplv-k3u1fbpfcp-watermark.image?)

现在我们改下 README.md：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adb9d4044cc04dcaae887870b0466a05~tplv-k3u1fbpfcp-watermark.image?)

然后重新跑 build：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/337d91042adb49cd8d9160967db512ea~tplv-k3u1fbpfcp-watermark.image?)

现在花了 25s，其实是没有重新 npm install 的。

然后改下 package.json：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9607cdf0b15b444b9b70c77fad0e64e3~tplv-k3u1fbpfcp-watermark.image?)

再跑 docker build

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5a7bfbfd74640439fde65550d86033d~tplv-k3u1fbpfcp-watermark.image?)

时间明显多了很多，过程中你可以看到在 npm install 那层停留了很长时间。

这就是为什么要这样写：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a82acd8cbb784530a8aa03566a023440~tplv-k3u1fbpfcp-watermark.image?)

这里没问题，大家还能发现有没有什么别的问题么？

问题就是源码和很多构建的依赖是不需要的，但是现在都保存在了镜像里。

实际上我们只需要构建出来的 ./dist 目录下的文件还有运行时的依赖。

那怎么办呢？

这时可以用多阶段构建：

```docker
FROM node:18-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
```

FROM 后面添加一个 as 来指定当前构建阶段的名字。

通过 COPY --from=xxx 可以从上个阶段复制文件过来。

然后 npm install 的时候添加 --production，这样只会安装 dependencies 的依赖。

docker build 之后，只会留下最后一个阶段的镜像。

也就是说，最终构建出来的镜像里是没有源码的，有的只是 dist 的文件和运行时依赖。

这样镜像就会小很多。

我们来试试看：

```
docker build -t dockerfile-test:third -f 222.Dockerfile .
```
标签为 third。

-f 是指定 Dockerfile 的名字。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0614454fe6394bb1bdd6d7477c25f623~tplv-k3u1fbpfcp-watermark.image?)

然后 desktop 里看下构建出来的镜像：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a36847acfb7e4d9d8f23e27ebf8d5c1b~tplv-k3u1fbpfcp-watermark.image?)

镜像体积比没有用多阶段构建的时候小了 250 M。

然后跑起来试试看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8860c194ad40429b835883f0a9464718~tplv-k3u1fbpfcp-watermark.image?)

这次映射 2335 端口到容器内的 3000 端口。

依然能正常访问：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ab205faff4e4d33b6c0962aba48df5a~tplv-k3u1fbpfcp-watermark.image?)

这就是第二个技巧，多阶段构建。

## 使用 ARG 增加构建灵活性

我们写一个 test.js 

```javascript
console.log(process.env.aaa);
console.log(process.env.bbb);
```
打印了环境变量 aaa、bbb 

跑一下：
```
export aaa=1 bbb=2
node ./test.js
```

可以看到打印了这俩环境变量：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd86890fe8ab4ab394a0be5d708863c9~tplv-k3u1fbpfcp-watermark.image?)

然后我们写个 dockerfile，文件名是 333.Dockerfile：

```docker
FROM node:18-alpine3.14

ARG aaa
ARG bbb

WORKDIR /app

COPY ./test.js .

ENV aaa=${aaa} \
    bbb=${bbb}

CMD ["node", "/app/test.js"]
```
使用 ARG 声明构建参数，使用 \${xxx} 来取

然后用 ENV 声明环境变量。

dockerfile 内换行使用 \

之后构建的时候传入构建参数：

```
docker build --build-arg aaa=3 --build-arg bbb=4 -t arg-test -f 333.Dockerfile .
```
通过 --build-arg xxx=yyy 传入 ARG 参数的值。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/052f8b4d301e4724984deffdf64da266~tplv-k3u1fbpfcp-watermark.image?)


点击查看镜像详情，可以看到 ARG 已经被替换为具体的值了：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e01565474f24d1ea4819a5492603aa9~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2443db3cf6394a96be7c9d88834fc0f0~tplv-k3u1fbpfcp-watermark.image?)

然后跑起来：

```
docker run  --name fourth-container arg-test
```

这次就不用 -d 后台运行了，直接看下日志：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3a15c10087044fda31bcc99b6ce7db1~tplv-k3u1fbpfcp-watermark.image?)

可以看到容器内拿到的环境变量就是 ENV 设置的。

也就是说 ARG 是构建时的参数，ENV 时运行时的变量。

灵活使用 ARG，可以增加 dockerfile 的灵活性。

这就是第三个技巧。

## CMD 结合 ENTRYPOINT

前面我们指定容器跑起来之后运行什么命令，用的是 CMD：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79d7f94069c34283a00cfd510cb4d1bc~tplv-k3u1fbpfcp-watermark.image?)

其实还可以写成 ENTRYPOINT：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e75546b3a464c80ae27b869291cd896~tplv-k3u1fbpfcp-watermark.image?)

这两种写法有什么区别么？

我们来试试：

写个 444.Dockerfile 

```docker
FROM node:18-alpine3.14

CMD ["echo", "光光", "到此一游"]
```

然后 build：

```
docker build -t cmd-test -f 444.Dockerfile .
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96b3f2a2e08548f5b138d958da8ee184~tplv-k3u1fbpfcp-watermark.image?)

然后 run 一下：
```
docker run cmd-test
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aa22b23766045fdb3111fffa0b3336c~tplv-k3u1fbpfcp-watermark.image?)

没有指定 --name 时，会生成一个随机容器名。

就是这种：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/938f50cebb2b409099d1bf6ea36a7943~tplv-k3u1fbpfcp-watermark.image?)

这不是重点。

重点是用 CMD 的时候，启动命令是可以重写的：

```
docker run cmd-test echo "东东"
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a34568fe40754411bc41212be232f7ff~tplv-k3u1fbpfcp-watermark.image?)

可以替换成任何命令。

而用 ENTRYPOINT 就不会：

```docker
FROM node:18-alpine3.14

ENTRYPOINT ["echo", "光光", "到此一游"]
```
docker build: 
```
docker build -t cmd-test -f 444.Dockerfile .
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53a67f44a9ef4ed0833b3ec2e561eca7~tplv-k3u1fbpfcp-watermark.image?)
docker run: 

```
docker run cmd-test echo "东东"
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d3c6d5fb8ad48f2be1f82bca0115c9a~tplv-k3u1fbpfcp-watermark.image?)

可以看到，现在 dockerfile 里 ENTRYPOINT 的命令依然执行了。

docker run 传入的参数作为了 echo 的额外参数。

这就是 ENTRYPOINT 和 CMD 的区别。

一般还是 CMD 用的多点，可以灵活修改启动命令。

其实 ENTRYPOINT 和 CMD 是可以结合使用的。

比如这样：

```docker
FROM node:18-alpine3.14

ENTRYPOINT ["echo", "光光"]

CMD ["到此一游"]
```
docker build：
```
docker build -t cmd-test -f 444.Dockerfile .
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2605356bd1824045a8c4f05fc3c0e063~tplv-k3u1fbpfcp-watermark.image?)

docker run:
```
docker run cmd-test
docker run cmd-test 66666
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/321f2a27cfca4fe093e73890e4866809~tplv-k3u1fbpfcp-watermark.image?)

当没传参数的时候，执行的是 ENTRYPOINT + CMD 组合的命令，而传入参数的时候，只有 CMD 部分会被覆盖。

这就起到了默认值的作用。

所以，用 ENTRYPOINT + CMD 的方式更加灵活。

这是第四个技巧。

## COPY vs ADD

其实不只是 ENTRYPOINT 和 CMD 相似，dockerfile 里还有一对指令也比较相似，就是 ADD 和 COPY。

这俩都可以把宿主机的文件复制到容器内。

但有一点区别，就是对于 tar.gz 这种压缩文件的处理上：

我们创建一个 aaa 目录，下面添加两个文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c66829888bf54dfa801d5876fe47c0cb~tplv-k3u1fbpfcp-watermark.image?)

使用 tar 命令打包：

```
tar -zcvf aaa.tar.gz ./aaa
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f69017d69794f64b7412964fbbd11a2~tplv-k3u1fbpfcp-watermark.image?)

然后写个 555.Dockerfile

```docker
FROM node:18-alpine3.14

ADD ./aaa.tar.gz /aaa

COPY ./aaa.tar.gz /bbb
```

docker build 生成镜像：

```
docker build -t add-test -f 555.Dockerfile .
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a40fdaed48df45bfb3d0b868c2cef58a~tplv-k3u1fbpfcp-watermark.image?)

docker run 跑起来：

```
docker run -d --name sixth-container add-test
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7e0e3abaeb7423e930d5b22c66f2f86~tplv-k3u1fbpfcp-watermark.image?)

可以看到，ADD 把 tar.gz 给解压然后复制到容器内了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbb052f1b7ef465dbc8fa8076736ee42~tplv-k3u1fbpfcp-watermark.image?)

而 COPY 没有解压，它把文件整个复制过去了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fc08dffaabc45d1845efcb3dc28eb3a~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7e0f945732b4a0cb9d506f60f9d370d~tplv-k3u1fbpfcp-watermark.image?)

也就是说，ADD、COPY 都可以用于把目录下的文件复制到容器内的目录下。

但是 ADD 还可以解压 tar.gz 文件。

一般情况下，还是用 COPY 居多。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/dockerfile-test)

## 总结

Docker 是流行的容器技术，它可以在操作系统上创建多个隔离的容器，在容器内跑各种服务。

它的流程是 Dockerfile 经过 docker build 生成 docker 镜像，然后 docker run 来跑容器。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/897c9f267bdc420887cd699f0e6f8e29~tplv-k3u1fbpfcp-watermark.image?)

docker run 的时候可以通过 -p 指定宿主机和容器的端口映射，通过 -v 挂载数据卷到容器内的某个目录。

CI/CD 基本也是这套流程，但是 Dockerfile 是要开发者自己维护的。

Dockerfile 有挺多技巧：

- 使用 alpine 的镜像，而不是默认的 linux 镜像，可以极大减小镜像体积，比如 node:18-alpine3.14 这种
- 使用多阶段构建，比如一个阶段来执行 build，一个阶段把文件复制过去，跑起服务来，最后只保留最后一个阶段的镜像。这样使镜像内只保留运行需要的文件以及 dependencies。
- 使用 ARG 增加构建灵活性，ARG 可以在 docker build 时通过 --build-arg xxx=yyy 传入，在 dockerfile 中生效，可以使构建过程更灵活。如果是想定义运行时可以访问的变量，可以通过 ENV 定义环境变量，值使用 ARG 传入。
- CMD 和 ENTRYPOINT 都可以指定容器跑起来之后运行的命令，CMD 可以被覆盖，而 ENTRYPOINT 不可以，两者结合使用可以实现参数默认值的功能。
- ADD 和 COPY 都可以复制文件到容器内，但是 ADD 处理 tar.gz 的时候，还会做一下解压。

灵活使用这些技巧，可以让你的 Dockerfile 更加灵活、性能更好。

