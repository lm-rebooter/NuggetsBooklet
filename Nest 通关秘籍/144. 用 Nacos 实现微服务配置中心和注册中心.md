前面学了用 etcd 做配置中心和注册中心，这节来学习用 nacos 来做。

首先，通过 docker 把 nacos 服务跑起来：

搜索 nacos/nacos-server 的镜像：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1edaaff02e774aada7d4e752dd1d3905~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2070&h=1114&s=245257&e=png&b=f3f4f8)

填一下启动参数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a47ceb9bab644b39df64d526bd5067f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=1246&s=123839&e=png&b=ffffff)

指定环境变量 MODE 为 standalone，也就是单机启动。

启动后可以看到打印的一个网页地址：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88d5ece885894d52959420a566870fed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1670&h=1088&s=232652&e=png&b=ffffff)

把 ip 替换成 localhost 就可以访问了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76d686c6afe64fd887e616169b2f7103~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2810&h=1274&s=231703&e=png&b=fafafa)

我们创建个 node 服务来连接 nacos：

```
mkdir nacos-node-test
cd ./nacos-node-test
npm init -y
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a876aaf933b84cfbb2906a0c20b43e5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=868&h=668&s=87074&e=png&b=010101)

进入项目，安装 nacos 的包：

```
npm install --save nacos
```

创建 index.js

```javascript
import Nacos from 'nacos'

const client = new Nacos.NacosNamingClient({
    serverList: ['127.0.0.1:8848'],
    namespace: 'public',
    logger: console
})

await client.ready()

const aaaServiceName = 'aaaService'

const instance1 =  {
    ip: '127.0.0.1',
    port: 8080
}

client.registerInstance(aaaServiceName, instance1)

const instance2 =  {
    ip: '127.0.0.1',
    port: 8081
}

client.registerInstance(aaaServiceName, instance2)
```
这里创建了 NacosNamingClient，就是注册中心的客户端。

连接上之后，registerInstance 注册 aaa 服务的两个实例。

改下 package.json

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/686b5a1fbf1341408d4e71313684ce32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2034&h=518&s=131726&e=png&b=202020)

type 设置为 module，就是所有的 js 文件都是 es module 的。

这样就可以直接跑 es module 的代码了。

```
node ./index.js
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b74395830f14183b03bbfbb56a2ae3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1366&h=658&s=123492&e=png&b=1c1c1c)

然后我们去 nacos 的控制台页面看一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a85ba0cbf51f4e0598b5acf15afb3a43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2684&h=802&s=176918&e=png&b=fcfcfc)

在服务列表可以看到，aaaService 有两个实例。

点开详情看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2f00b9eebc1404e991ea4228a5998b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2912&h=1502&s=898785&e=gif&f=43&b=fdfdfd)

可以看到我们通过代码注册的两个实例。

可以注册，自然也可以取消注册

写下 index2.js

```javascript
import Nacos from 'nacos'

const client = new Nacos.NacosNamingClient({
    serverList: ['127.0.0.1:8848'],
    namespace: 'public',
    logger: console
})

await client.ready()

const aaaServiceName = 'aaaService'

const instance1 =  {
    ip: '127.0.0.1',
    port: 8080
}

client.deregisterInstance(aaaServiceName, instance1)

const instance2 =  {
    ip: '127.0.0.1',
    port: 8081
}

client.deregisterInstance(aaaServiceName, instance2)
```
只是把 registerInstance 换成 deregisterInstance

跑一下：
```
node ./index2.js
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e94248319c5d447088e6284dd6050034~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1382&h=1048&s=214237&e=png&b=1b1b1b)

现在 aaaService 就没有实例了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b1b1c7fd0eb4271b02ee553565ba8e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2764&h=772&s=175998&e=png&b=fcfafa)

除了新增、删除，当然也可以查询实例，以及监听实例变化：

创建 index3.js

```javascript
import Nacos from 'nacos'

const client = new Nacos.NacosNamingClient({
    serverList: ['127.0.0.1:8848'],
    namespace: 'public',
    logger: console
})

await client.ready()

const instances = await client.getAllInstances('aaaService');

console.log(instances);
```
getAllInstances 就是查询 service 实例的方法。

先跑下 index.js 注册下，然后再跑下 index3.js 查询：

```javascript
node ./index.js
node ./index3.js
```
可以看到，查到了 aaaService 的两个实例：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6060ac476f5457bb2608fadc20acb16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1290&h=872&s=143737&e=png&b=181818)

此外，还可以监听 service 实例的变化：

创建 index4.js

```javascript
import Nacos from 'nacos'

const client = new Nacos.NacosNamingClient({
    serverList: ['127.0.0.1:8848'],
    namespace: 'public',
    logger: console
})

await client.ready()

client.subscribe('aaaService', content => {
    console.log(content);
});
```
跑一下：

```
node ./index4.js
```

然后另开一个 terminal 跑下 index.js 来注册实例：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0cabc9e62c647798ab28208ed5be0c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1586&h=1156&s=228216&e=png&b=1c1c1c)

之后再跑 index2.js 去掉一个实例。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c0bda23de5e4656ac818522ca8a2b1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1606&h=978&s=167368&e=png&b=1d1d1d)

这时候在 index4.js 就监听到了这个变化：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3fe3383ac974d53a9f0d157923ede6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=942&s=155926&e=png&b=181818)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a08e4bdf56a14c7fa86f66be13594fb3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=936&s=179343&e=png&b=191919)

当实例改变的时候，就会调用回调函数，传入现在可用的实例。

在控制台页面也可以看到，确实只有一个实例了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b687cdee90964bf9b6883e51975d06c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560&h=1404&s=149263&e=png&b=fefefe)

这样，服务注册、取消注册、服务发现、监听变化，我们就都过了一遍，平常用的也是这些功能。

接下来再看下 Nacos 作为配置中心的用法：

新建 index5.js

```javascript
import { NacosConfigClient } from 'nacos'

const client = new NacosConfigClient({
    serverAddr: 'localhost:8848',
})

const content = await client.publishSingle('config', 'DEFAULT_GROUP', '{"host":"127.0.0.1","port":8848}')

// await client.remove('config', 'DEFAULT_GROUP')

// const config = await client.getConfig('config', 'DEFAULT_GROUP')

// console.log(config)

// client.subscribe({ dataId: 'config', group: 'DEFAULT_GROUP', },
//     content => {
//         console.log(content)
//     }
// )
```
分别调用了新增、删除、查询、监听的 api。

我们把下面的注释掉，先看新增：

```
node index5.js
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51f42e0de0c845778d359fe316eb6149~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1882&h=950&s=185677&e=png&b=1e1e1e)

跑完之后可以在 nacos 控制台页面看到新增的这个配置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/761aca641e4349138d966540b6c1af8a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2622&h=1008&s=190428&e=png&b=fbfbfb)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aaa60497a0f14386a12f3bd447f39668~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1546&h=894&s=88186&e=png&b=ffffff)

然后试下查询：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3af71f8af5545238c9ef5d62a7178aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1720&h=984&s=187818&e=png&b=1f1f1f)

再试下删除：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c1a9b24504c431d9b119257cb4b71f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1292&h=916&s=158610&e=png&b=1e1e1e)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/536e957ee8a543f89d2d3aa96a31f343~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2616&h=704&s=133803&e=png&b=fdfdfd)

最后试下监听变化：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fef2ab98ab02493eb2eb67586fdcea38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2024&h=1032&s=216423&e=png&b=1e1e1e)

```javascript
import { NacosConfigClient } from 'nacos'

const client = new NacosConfigClient({
    serverAddr: 'localhost:8848',
})

const content = await client.publishSingle('config', 'DEFAULT_GROUP', '{"host":"127.0.0.1","port":8848}')

client.subscribe({ dataId: 'config', group: 'DEFAULT_GROUP' },
    content => {
        console.log(content)
    }
)

setTimeout(() => {
    client.publishSingle('config', 'DEFAULT_GROUP', '{"host":"127.0.0.1","port":5000}')
}, 3000)

// await client.remove('config', 'DEFAULT_GROUP')

// const config = await client.getConfig('config', 'DEFAULT_GROUP')

// console.log(config)
```
我们先 publishSingle  增加配置、然后 3s 后再 publishSingle 修改下这个配置。

可以看到 subscribe 监听到了配置变化，打印了最新配置。

这样，配置新增、删除、修改、查询、监听，我们就都过了一遍。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nacos-node-test)。

## 总结

这节我们学了 nacos 作为配置中心、注册中心的用法。

作为注册中心就是注册服务的实例，比如 aaaService 有多个服务实例的时候，可以分别用 registerService、deregisterInstance、getAllInstances、subscribe 实现新增、删除、查询、监听。

作为配置中心就是管理配置，可以分别用 publishSingle、remove、getConfig、subscribe 实现新增（修改）、删除、查询、监听。

nacos 相比 etcd，多了内置的控制台页面，比较方便。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2b768386dd2418cb5f2151192e5a4c3~tplv-k3u1fbpfcp-watermark.image?)

注册中心、配置中心用起来还是很简单的，但确是微服务架构必不可少的功能。
