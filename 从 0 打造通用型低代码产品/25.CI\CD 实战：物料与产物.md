本章讲述了 **CICD** 的章节，这一块的内容会与服务端的某些功能打通，同时这些内容对于前端同学来说可能会有点上手的难度，但我们只关注于主流程的实现，具体的流程与细节需要根据不同的实际场景来进行微调。

本章的内容会涉及到 **Docker**，如果有对 **Docker** 不熟悉的同学可以参考以下两篇文章：

[前端全栈之路 - 玩转 Docker (基础)](https://juejin.cn/post/7147483669299462174)

[前端全栈之路 - 玩转 Docker (Dockerfile)](https://juejin.cn/post/7160972042757079077)

整体的内容将分为三块讲述：
1. **基础组件**
2. **基础模板**
3. **搭建产物**

## 基础组件

基础组件主要是是打包成 **NPM** 包或者发布 **UND** 产物到 **CDN**，所以本章我们结合之前的 **CICD CLI** 来进行项目级别的实战。

#### 构建基础镜像

承接之前的 **ig-base-cli**，我们需要将它打包成一个基础的 **Docker** 镜像，然后后期可以使用它来打包其他的产物。

```dockerfile
FROM node:alpine

RUN mkdir -p /home/app/

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm link
```

简单解释一下上述的脚本，将工程复制到 **docker** 镜像中，然后通过 `npm link` 挂载到全局给其他的项目使用，当然你也可以打包成 **npm** 包，然后提供通过全局安装 **npm** 包的方式提供服务。

预先使用 `COPY package*.json ./` 是借助于 **docker** 的层叠性质，增加缓存减少构建镜像的时间，在之前的文章中有更详细的解析，这里也不多阐述了。

```sh
docker build -f ./Dockerfile -t ig-base-cli:0.0.1 .
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4927c0e122e45388dbeafbc06602a47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=938&s=861412&e=png&b=fefefe)

构建完毕基础镜像之后，我们可以通过如下脚本进入容器查看是否正常挂载到了全局环境。

```sh
docker run -it ig-base-cli:0.0.1 /bin/sh
```

正常情况下，输入 **ig --hlep** 的结果如下图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9396ad2e2d054d5d8e444cee6e1096c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1346&h=754&s=342201&e=png&b=fdfdfd)

#### 构建打包镜像

这个步骤可以随便找个项目来测试，不一定用我后续的 **demo**，因为 **ig-base-cli** 有流程编排的功能，所以理论上是可以承接任意的项目，只要按照规则来进行操作即可。

我们使用的是一个简单的 **vite** 项目作为 **demo**，首先要在项目根目录下创建 `ig.config.ts`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84d905be3c124cc6bffa6d448802fa96~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2186&h=930&s=211604&e=png&b=1b1b1b)

然后修改 **flow** 的脚本命令:

```js
export default {
  flow: {
    preHook: 'npm i',
    stages: ["build", "publish"],
    build: {
      preHook: 'echo preHook build',
      script: 'npm run build'
    },
    publish: {
      script: 'echo publish',
      doneHook: 'echo upload to oss',
    },
    doneHook: 'echo doneHook all',
  }
}
```
> 上述是 **demo** 性质的脚本，**publish** 在实际生产中可以替换为证实上传 **oss** 或者静态服务器的脚本，如果是 **npm** 包的话，可以替换为 **npm publish**，这是由各个项目自身的性质决定。

构建打包镜像的 **dockerfile** 如下所示，其中引用的镜像为上一步骤构建的 **ig-base-cli:0.0.1** 基础镜像：

```dockerfile
FROM ig-base-cli:0.0.1

RUN mkdir -p /home/work/

WORKDIR /home/work/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENTRYPOINT ["ig"]

CMD ["buildFlow"]
```

接下来我们构建镜像：

```sh
docker build -f ./Dockerfile -t ig-build-space:0.0.1 .
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/604c416982ee429ba320cab5751e6a00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=742&s=454636&e=png&b=fdfdfd)

然后我们直接运行 **ig-build-space** 镜像： 

```sh
docker run ig-build-apace:0.0.1
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7d76c81232d40658b8c9ef7a2f93951~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1448&h=1498&s=801046&e=png&b=fefefe)

如上图所示，正如我们预料的情况一样，**ig-build-space** 按照我们的流程编排的顺序正确执行了每一个步骤。

但如果构建镜像都要跟服务强挂钩在通用性的角度来说也算很不合理的，而实际的构建流程已经完全由 **ig-flow** 接管，所以理论上我们是不需要额外的构建 **ig-build-space** 镜像。

我们只需要启动一个新的 **ig-base-cli** 的容器接下来将需要构建的工程复制进去，然后剩下的步骤都交给 **ig-flow** 执行即可：

```sh
docker run -it -v /Users/botycookie/test/hello-world:/home/work ig-base-cli:0.0.1 sh -c 'cd /home/work && ig buildFlow && exit'
```

> 实际的项目路径需要自行调整，这里只是示例。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6f4802bbfde4ae5b9f547833afc9065~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1588&h=994&s=594614&e=png&b=fefefe)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/717e20d548f14653a5967822aa702e23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1560&h=1358&s=860617&e=png&b=fefefe)

但这种也是有一定的缺憾，如图所示，我们并没有借助于 **docker** 的缓存来解决重复下载依赖更新的问题，所以每次的构建都会走一遍安装依赖的过程，如果想使得构建速度更快的话，则需要重写定制一下 **devops** 的流程，不过这也是一种空间换时间的路子，如果**项目过多**、**资源吃紧**的情况下，不必在意多这一两分钟安装依赖的时间。

## 基础模板 && 搭建产物

基础模板与搭建产物其实都是类似的结构，大部分场景都是一份 **JSON** 格式的数据，所以没有什么太多可以讨论的场景，但除此之外还有一种 **ProCode** 的产物需要构建，这里我们使用之前提到过的 **Nunjucks** 来实现。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/256c915c218c4fd6a3215733ba3e69c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3765&h=1897&s=511512&e=png&b=fefdfc)

正如之前的搭建服务所示，右边的是根据 **swagger** 提供的 **json schema** 生成的代码片段，但是这种代码片段如果不经过编译肯定是无法使用的，至少也要在 **Html** 中引入 **React** 跟 **AntD** 等依赖才能使用。

正式的场景比较复杂，我们后期会逐渐补充上去，下面是一个简单的示例。

首先，我们创建一个简单的可以直接加载 **AntD** 跟 **React** 的页面。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <title>Hello World</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script crossorigin="anonymous"  src="https://lib.baomitu.com/antd/4.24.2/antd.js"></script>
    <link crossorigin="anonymous"  href="https://lib.baomitu.com/antd/4.24.2/antd.css" rel="stylesheet">
    <!-- Don't use this in production: -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const onFinish = (values : any) => {
        console.log('Success:', values);
      };

      const onFinishFailed = (errorInfo : any) => {
        console.log('Failed:', errorInfo);
      };
      function MyApp() {
        var Form = antd.Form;
        var Input = antd.Input;
        var Checkbox = antd.Checkbox;
        var Button = antd.Button;
        return <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
          <Form.Item
                    label="Username"
                    name="username"
                    rules={
                [
                  {
                    required: true,
                    message: 'Please input your username!'
                  }
                ]
              }
                  >
            <Input/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
          </Form.Item>
        </Form>;
      }

      const container = document.getElementById('root');
      const root = ReactDOM.createRoot(container);
      root.render(<MyApp/>);
    </script>
  </body>
</html>
```


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/decaa29ba41c4d9bb2c9f62d75bfda63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1306&h=585&s=39280&e=png&b=ffffff)

> 正常打开的话页面如上所示，如果打不开，可以替换一下 **CND** 的链接。

如上所示，我们需要将他转为一个 **Nunjucks** 的模板，方便我们将之前生成好的 **AntD** 的数据插入进去。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/631253b2a9b248bf9cb8f0a589e0fb39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1953&h=921&s=160987&e=png&b=1f1f1f)

模板的数据会做一些简单的压缩，**Nunjucks** 的模板语法的变量替换为 `{{ pageInfo |safe }}`，所以其他的一些 `{{}}` 的需要自行做一些转移。

如下就是成功替换了模板之后的页面展示样式：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63245806731c40c3892429d6451f89f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1318&h=1120&s=100823&e=png&b=fefefe)

这样一个简单的单页面的出码功能即完成了，但仅仅只是一个 **demo** 级别的，后续还有很多微调的功能需要完善，这就需要老王的设计器配合在一起进行调试，所以这并非是完全体的样式。

对应的代码已经上传到 [ignition](https://github.com/Ignition-Space/ignition) 项目中，可以查看下。

同时产物保存在数据库之外还可以配合 **Redis** 进行缓存。

除了 **Redis** 之外还可以去了解下 **Nacos**，可能前端的同学们不太了解，配合 **Nacos** 的下发配置的能力，可以提前将生成的文件缓存在本地，提高加载速度。

想要了解更多的功能可以参考中文文档：[Nunjucks](https://nunjucks.bootcss.com/index.html) 。

## 写在最后

本文跟前端关系较大的是基础组件的构建，借助了 **ig-flow** 的能力，使得可以接入多种不同类型的项目，无论是 **Vue**、**React** 还是其他类型的项目都可以通过 **ig-flow** 进行构建。

但相对应的其实是把对应的流程编排下放到了各个项目中，除去**构建以及预构建**的流程之外，可以将发布的流程收拢到 **ig-base-cli** 中，**这样即能给与项目构建最大的自定义话也可以约束发布的权限与流程**。

完全体的项目还在开发中，进度会根据个人的工作强度来进行，如果有自己的想法进行二开的也欢迎一起讨论。

后面也会有专门的直播&录播模块，应该都会尽快上线。

如果你有什么疑问，欢迎在评论区提出或者加群沟通。 👏