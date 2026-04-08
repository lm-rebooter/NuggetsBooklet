文件上传是常见需求，一般我们不会直接把文件保存在服务器的某个目录下，因为服务器的存储容量是有限的，这样不好扩展。

我们会用 OSS （Object Storage Service）对象存储服务来存文件，它是支持分布式扩展的，不用担心存储容量问题，而且也好管理。

比如阿里云的 OSS 服务。

但是有一些业务场景下，数据需要保密，要求私有部署，也就是要在自己的机房里部署一套 OSS 服务。

这时候怎么办呢？

这种需求一般我们会用 minio 来做。

它可以实现和阿里云 OSS 一样的功能。

首先，我们用一下阿里云的 OSS 服务。

OSS 里的文件是放在一个个 Bucekt（桶）里的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e160417af6d64029bf13473977bfbf36~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=508&s=102325&e=png&b=fffefe)

我们创建个 Bucket：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f1fa488ca024ca18f1a23e0e52702a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1708&h=1236&s=278242&e=png&b=fefcfc)

然后进入文件列表，就可以上传文件了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70d09ee8647e4988b73880df71eea219~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1848&h=698&s=149099&e=png&b=fefefe)

因为创建的 Bucket 设置了公共读，所以可以直接访问：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3996562ab54441ab8f40a790e3e8b8c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2310&h=1254&s=758784&e=png&b=8c8c8c)

此外，阿里云 OSS 还可以通过 SDK 来上传文件。

创建个项目：

```
mkdir minio-test
cd minio-test
npm init -y
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d96eb2559ac46fbb02e017835018567~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=614&s=116276&e=png&b=010101)

进入项目，安装 ali-oss：

```
npm install ali-oss
```

创建 index.js

```javascript
const OSS = require('ali-oss')

const client = new OSS({
    region: 'oss-cn-beijing',
    bucket: 'guang-666',
    accessKeyId: '',
    accessKeySecret: '',
});

async function put () {
  try {
    const result = await client.put('smile.png', './smile.png');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

put();
```
填入 region、bucket 和 accessKeyId、accessKeySecret

这里的 region 可以从概览里看到：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd75de8c0c574468b00a9ea7877944b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686&h=928&s=225918&e=png&b=fefefe)

acessKey 是在这里看：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41cd70bb22d7421a95cc00ccc7bfcac2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=708&h=686&s=67637&e=png&b=fefefe)

具体创建 accessKey 的流程看[之前 OSS 那节](https://juejin.cn/book/7226988578700525605/section/7324620995183968293)

然后跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c05b7e4930049d2b0fca2201acba67a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=962&s=176487&e=png&b=1b1b1b)

上传成功之后就可以通过 OSS 服务访问这个图片了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc4f029f4e8d4d9db4c4dd3650f28065~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2344&h=1270&s=797467&e=png&b=8c8c8c)

也可以通过 sdk 下载图片：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03d670392ddb403abd3534360658520c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=424&s=44036&e=png&b=1f1f1f)

执行后可以看到，图片被下载下来了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a3a7cd455974839b431c4793c58cd41~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124&h=612&s=95408&e=png&b=1c1c1c)

这就是阿里云 OSS 的用法。

那我们用 minio 自己搭呢？

首先，我们需要安装 [docker 桌面端](https://www.docker.com/)：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/260fc42611fd4f6aa84a0356286d79f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2040&h=1270&s=210506&e=png&b=ffffff)

打开后可以看到本地的所有镜像和容器：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4edf8c78c292448db124d132ca79d76f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2096&h=968&s=266517&e=png&b=f7f7f8)

搜索下 minio（这步需要科学上网）：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1451e7ef59b7432892ccefa417b67500~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1998&h=1274&s=258702&e=png&b=f2f3f7)

填入一些信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87eb9a405bae4470834b2bb29899053d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518&h=1470&s=230560&e=png&b=ffffff)

name 是容器名。

port 是映射本地 9000 和 9001 端口到容器内的端口。

volume 是挂载本地目录到容器内的目录

这里挂载了一个本地一个目录到容器内的数据目录 /bitnami/minio/data，这样容器里的各种数据都保存在本地了。

还要指定两个环境变量，MINIO_ROOT_USER 和 MINIO_ROOT_PASSWORD，是用来登录的。

点击 run，跑起来之后可以看到数据目录被标记为 mounted，端口也映射成功了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94439277d9149869b9d343214538fe0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=1022&s=107797&e=png&b=f8f8f9)

访问下 http://localhost:9001

输入刚才环境变量填的用户名密码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baef7edbd8174f53a508dec6ec4a1c2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2578&h=1022&s=779261&e=png&b=ffffff)

进入管理界面：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/590cd0c074844e329ca296ed890e3252~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1930&h=1332&s=653275&e=png&b=fefefe)

这个 bucket 就是管理桶的地方，而 object browser 就是管理文件列表的地方。

和阿里云 OSS 用法一样。

我们创建个 bucket：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d485eaf6eaa14d3aa225ea84d3463be7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1520&h=1016&s=94712&e=png&b=ffffff)

然后在这个 bucket 下上传一个文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7a8f077b04d4b8b98bc85067b50b737~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2338&h=1116&s=596635&e=png&b=fdfdfd)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6363048236144ab691f4ff2d9c3e3203~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1988&h=900&s=145669&e=png&b=fdfdfd)

点击 share 就可以看到这个文件的 url：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/427ac302512a4d7aa94aeba2188c70fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1854&h=808&s=119246&e=png&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9573aaa5a6914711b600ff66c0447fdd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1766&h=1032&s=242268&e=png&b=ececec)

现在倒是能在浏览器访问，只不过需要带后面的一长串东西：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c42a7bc7b89e47308fb5b21725943b70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2158&h=1206&s=669084&e=png&b=0202f3)

不带的话会提示拒绝访问：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4378e11261914c19afe147791c2f9b66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1472&h=288&s=47877&e=png&b=ffffff)

因为现在文件访问权限不是公开的。

我们设置下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc0f1990162d401dafa60444b84f38a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2258&h=966&s=483874&e=png&b=fdfdfd)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76ffdce9aa904d4fac72b01abdf36392~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1750&h=766&s=172612&e=png&b=e9e9e9)

添加一个 / 的匿名的访问规则。

然后就可以直接访问了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b76d7716ddb45ffa10a94d4fbb4ef53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1950&h=980&s=468443&e=png&b=0202f3)

是不是感觉用起来和阿里云的 OSS 差不多？

我们再来试试 sdk 的方式：

```
npm install minio
```
安装 minio 包。

然后创建 index2.js

```javascript
var Minio = require('minio')

var minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: '',
  secretKey: '',
})

function put() {
    minioClient.fPutObject('aaa', 'hello.png', './smile.png', function (err, etag) {
        if (err) return console.log(err)
        console.log('上传成功');
    });
}

put();
```

创建用到的 accessKey：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7912ac2bae84a7c8e185b0c2876195f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2178&h=998&s=528632&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa7c4a1e52f5470da5d7978595f954b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1734&h=890&s=338812&e=png&b=f4f4f4)

跑一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfb07408e94b4f7fb61515f7a103928a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=702&h=110&s=18112&e=png&b=191919)

可以看到，文件上传成功了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9695e5104db45248e2c4f72cafcdf88~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1482&h=708&s=347394&e=png&b=fefefe)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98299e5024b64886a9790926e98e8d39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1568&h=948&s=364737&e=png&b=0202f3)

同样，也可以下载文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d42133eba37248b18f79b4977600f0bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=486&s=86475&e=png&b=1f1f1f)

```javascript
const fs = require('fs');

function get() {
    minioClient.getObject('aaa', 'hello.png', (err, stream) => {
        if (err) return console.log(err)
        stream.pipe(fs.createWriteStream('./xxx.png'));
    });
}

get();
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d12088c76edd4e6fafcf5bf26e658e85~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1408&h=720&s=126200&e=png&b=1d1d1d)

用起来和阿里云 OSS 几乎一毛一样。

更多的 api 用法可以看 [minio 文档](https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html)。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5fb69960a0a4e9c96777068737c08b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1652&h=1194&s=331748&e=png&b=e7eaec)

最后，还记得我们跑 docker 容器的时候指定了挂载目录么：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad955a69ff846fb8e351c5b2a90ffe0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=1022&s=100335&e=png&b=f8f8f9)

这样，数据就会保存在本地的那个目录下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3477dab0c0194f57b7eeedf7f2700030~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1386&h=252&s=60541&e=png&b=fbf9f9)

那为什么 OSS 服务都这么相似呢？

因为它们都是遵循 AWS 的 Simple Storage Service（S3）规范的，简称 S3 规范。

所以不管哪家的 OSS，用起来都是差不多的。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/minio-test)。

## 总结

文件上传一般我们都是用 OSS 服务来存储，比如阿里云的 OSS。

但是 OSS 是收费的，而且有些敏感数据不能传到云上，需要私有部署，这种就可以自己搭一个 OSS 服务。

我们用 docker 跑了一个 minio 的容器，然后分别在管理界面和用 npm 包的方式做了文件上传和下载。

用法和阿里云 OSS 差不多，因为他们都是亚马逊 S3 规范的实现。

你公司内部有没有自己用 minio 搭 OSS 服务呢？
