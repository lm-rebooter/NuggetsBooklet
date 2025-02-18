文件上传是常见需求，一般我们不会把文件直接上传到应用服务器，因为单台服务器存储空间是有限的，不好扩展。

我们会用单独的 OSS （Object Storage Service）对象存储服务来上传下载文件。

比如一般会买阿里云的 OSS 服务。

我们本地文件存储是目录-文件的组织方式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c42affeadb6d4d7885ba4223fe8b6b49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=656&s=50009&e=png&b=fefdfd)

而 OSS 服务的存储结构是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/883911af24c14b3ca1ca330c965c7f9a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=508&s=37017&e=png&b=ffffff)

一个桶里放一些文件。

阿里云 OSS 的控制台也提到了对象存储没有目录层级结构：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f74c4bc490e4bf684ba8eaac8cc1bf6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1718&h=616&s=115001&e=png&b=ffffff)

但下面明明是支持目录的呀：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/524c8d5b0e73481bb65bf5f6107ba273~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1556&h=626&s=109683&e=png&b=ffffff)

这其实只是模拟实现的。

Object 会存储 id、文件内容、元数据三部分信息：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20e190a20da341198e36f7e45060d1b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=742&h=356&s=19427&e=png&b=ffffff)

阿里云 OSS 只是用元信息部分模拟实现了目录。

就像打了个 tag 一样，并不是说文件存储在这个 tag 下，只是你可以用这个 tag 来检索文件。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5c7eb8c524c431faef737ff8da4547a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=214&s=54679&e=png&b=fefefe)

除了对象存储 OSS，阿里云也提供了文件存储和块存储的方式：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/379e9dde7dcf42a5821fc0e1a56bb0df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1954&h=972&s=141741&e=png&b=fcfcfc)

块存储就是把整块磁盘给你用，你需要自己格式化，存储容量有限。

文件存储就是有目录层次结构，你可以上传下载文件，存储容量有限。

对象存储就是 key-value 存储，分布式的方式实现的，存储容量无限。

这些简单了解就行，绝大多数情况下，我们都是用 OSS 对象存储。

我们买个[阿里云的 OSS 服务](https://www.aliyun.com/product/oss)来试试看：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed1886a29f4f4b73b79dce222248c8e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2136&h=1376&s=268874&e=png&b=fefefe)

我买了 40G 的 OSS 国内通用资源包，花了 5 块钱。

然后我们创建个 Bucket（桶）：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01cbf6715b734310b31d6a0c46541f48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1676&h=1336&s=283874&e=png&b=fefcfc)

在北京创建了一个 Bucket，文件就会存储在那里的服务器上。

设置公共读，也就是这些文件大家都可以直接访问。

不然私有的方式，你访问每个文件都要带上一些身份信息：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af5578d3c2b54a4dad990925895bbd75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1252&h=756&s=210593&e=png&b=fcfcfc)

有的同学说，不是静态文件要在全国各地都能访问到么？存在北京的服务器会不会访问速度慢？

这是 CDN 的活：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ab0dead050e4bf6a95649cb1fbe9f28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1222&h=1152&s=332121&e=png&b=fefefe)

接入 CDN 后，访问该域名会走到云服务的 DNS，然后返回一台最近的缓存服务器的地址，这台服务器会从源站拿文件来缓存，之后就不再访问源站。

这里的源站就可以是 OSS 服务。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/771a695efc8e4eec9cd4b7dcf94fd77c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=508&h=353&s=41323&e=png&b=ffffff)

创建 Bucket 之后，我们上传个文件试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4b60227dcaf43b4af792c1a57c3a1b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1790&h=1120&s=2063115&e=gif&f=57&b=fdfdfd)

上传完之后在文件列表就可以看到这个文件了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c238bdc367a4e7da769111eb8da549b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1838&h=1006&s=991862&e=png&b=8c8c8c)

点开可以看到文件详情，用这个 URL 就可以访问：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1847f935bb84d88bb5c0e972d0d8317~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1430&h=886&s=1013545&e=png&b=d2ddf0)

当然，生产环境下我们不会直接用 OSS 的 URL 访问，而是会开启 CDN，用网站域名访问，最终回源到 OSS 服务：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14f0a1f4a50b4e3aa42b8430e14724f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1560&h=502&s=107054&e=png&b=fafafa)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69d6c8bf283d49edb00484603c3af90b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1564&h=386&s=130373&e=png&b=ffffff)

在控制台里上传很简单，那如果想在代码里上传呢？

官方文档里有示例代码，我们试试看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c11b37e8e564a79a5201e278d934531~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1844&h=1418&s=446776&e=png&b=ffffff)

```
mkdir oss-test
cd oss-test
npm init -y
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed8f43e33e044abba31b1d41eca7cdeb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=836&h=632&s=114551&e=png&b=010101)

安装用到的包：

```
npm install ali-oss
```

写下代码：

```javascript
const OSS = require('ali-oss')

const client = new OSS({
    region: 'oss-cn-beijing',
    bucket: 'guang-333',
    accessKeyId: '',
    accessKeySecret: '',
});

async function put () {
  try {
    const result = await client.put('cat.png', './mao.png');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

put();
```
region 在概览里可以看到：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e4a6ba711944197982eb2b59f7bd1bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1684&h=954&s=225030&e=png&b=ffffff)

这里的 accessKeyId 和 acessKeySecret 是什么呢？

本来我们身份认证都是通过用户名密码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a7d6a85fd1b41bebe0e89c6a97d2cea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=742&h=284&s=17801&e=png&b=ffffff)

但这样不够安全，所以我们创建了 accessKey 用来代表身份，用它来做身份认证，就算泄漏了，也不影响别的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83d2b960c3464d3bbadc964c269773cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=514&s=33672&e=png&b=ffffff)

我们创建个 accesKey：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2dfa90ffc41454f93a47ff06529f370~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=626&h=796&s=64559&e=png&b=fefefe)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9d11035ea3457ea12b499c38524878~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534&h=546&s=122069&e=png&b=ffffff)

创建完成后，拿到 accesKeyId 和 accessKeySecret 后运行代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46888772fc6a4cdd80281d51a1e687b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=830&s=154401&e=png&b=181818)

这里的 mao.png 是这样的：


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f74bb88195a476ab386719f243b9f8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=710&s=379430&e=png&b=202020)

在控制台可以看到上传成功了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63cb0a38082d42c7ab1547700c7c7e79~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2018&h=1134&s=536715&e=png&b=8b8a8a)

这就是 OSS 用 api 上传文件的用法。

只是我们刚刚用的 accessKey 不够安全。

打开 accessKey 管理页面的时候就提示了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7be95451e63343ffa32be751c673048d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=382&s=97125&e=png&b=fef4ef)

让我们不要直接用 accessKey，而是创建一个子用户再创建 accessKey。

那我们就创建个子用户：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8cd8632816e44fd902810a432999eb5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1338&h=634&s=124468&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fd4a9e8f3364f2ea9a0df89b94e807d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=664&s=71789&e=png&b=ffffff)

然后用这个 accessKey 的 id 和 secret 就好了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3904e4e4a73f4a25a6dfc72157c3f2b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1928&h=738&s=135573&e=png&b=fffaf9)

但你直接换上它还不行：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69a7a7dc3fe249beadd65d83f41b08a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1342&h=1276&s=271590&e=png&b=1c1c1c)

会提示你 403，没有权限。

需要你授权下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6de63b48653b489c87e11e3c302912a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=628&h=784&s=66326&e=png&b=fefefe)

新增一个授权：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26b94c98a61f4555b15f6d605f24892e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=798&s=102716&e=png&b=fefefe)

把 OSS 的管理和读取权限给这个子用户：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b35e139980c148dba0c33b5893e0c17c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1656&h=1352&s=552424&e=png&b=fdfdfd)

然后再试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30acc180379f43b1bae31bd4d2af210b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=1060&s=198897&e=png&b=1b1b1b)

这时候就上传成功了。

回过头来看下，不得不说阿里云在安全这一块设计的就很巧妙。

如果我们直接用用户名密码验证呢：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e45fb9b6fd394448a7643ad7e2223551~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=766&h=214&s=16602&e=png&b=ffffff)

那万一泄漏了不就完蛋了么？

但是如果创建个 accessKey 用它来做身份认证：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e52b9bfec8543378e3714044608f002~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=542&s=35006&e=png&b=ffffff)

就算泄漏了我也可以禁用啊：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d77ecadb1e14bd881fbec0e32c1ac00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1770&h=416&s=74111&e=png&b=fefefe)

再进一步，直接用这个 accessKey 它是有所有权限的。

我们先创建个 RAM 子用户，再分配给他某些权限，这样就算泄漏了，是不是能做的事情就更少了？

当然就更安全。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc0239504615408d9d0f1fcbb272b168~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1178&h=542&s=49523&e=png&b=ffffff)

所以说，阿里云这套 accessKey 和 RAM 子用户的身份认证方式，还是很不错的。

再说回 OSS，一般的文件直接上传就行，涉及到大文件就要分片上传了。

分片上传实现原理是前端常见面试题了，大家都能答上来，上节我们刚实现过。

就是把文件用 slice 方法分成一个个小的片，然后全部上传完之后请求一个接口合并分片。

[阿里云的大文件分片上传](https://help.aliyun.com/zh/oss/user-guide/multipart-upload)也是这样实现的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/896de2622dbf4b5a8f110388f91fee51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2028&h=1046&s=285258&e=png&b=fefefe)

具体怎么用直接看文档就好了，这里我们就不试了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cf86dfa4a904cfb9268562d6c5069a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1682&h=1120&s=284602&e=png&b=ffffff)

有了 OSS 服务之后，我们上传文件还需要经过应用服务器么？

可以经过也可以不经过。

如果经过应用服务器，那就要客户端上传文件之后，我们在服务里接受文件，上传 OSS：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b363bfe995714131b0f25dea6ad18822~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1302&h=302&s=29501&e=png&b=ffffff)

这样当然是可以的，还能保护 accessKey 不被人窃取。

只是会浪费应用服务器的流量。

那如果不经过呢？

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4a4d64a83884b6c8670c4ed09ccd716~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=514&s=38047&e=png&b=ffffff)

在客户端用 accessKey 把文件传到 OSS，之后把 URL 传给应用服务器就好了。

这样减少了应用服务器的流量消耗，但是增加了 accessKey 暴露的风险。

各有各的坏处。

那有没有啥两全其美的办法呢？

有。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4b44d3c76ae4c1ca38230fd09f5770e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1778&h=936&s=296704&e=png&b=fefefe)

[阿里云的文档](https://help.aliyun.com/zh/oss/user-guide/authorized-third-party-upload)里也提到了这个问题。

它给出的解决方案就是生成一个临时的签名来用。

代码是这样的：

```javascript
const OSS = require('ali-oss')

async function main() {

    const config = {
        region: 'oss-cn-beijing',
        bucket: 'guang-333',
        accessKeyId: 'LTAI5tDemEBPwQkTx65jZCdy',
        accessKeySecret: 'I0vHYOoqIC78lH7A5c5XB1H7Pev7bp',
    }

    const client = new OSS(config);
    
    const date = new Date();
    
    date.setDate(date.getDate() + 1);
    
    const res = client.calculatePostSignature({
        expiration: date.toISOString(),
        conditions: [
            ["content-length-range", 0, 1048576000], //设置上传文件的大小限制。      
        ]
    });
    
    console.log(res);
    
    const location = await client.getBucketLocation();
    
    const host = `http://${config.bucket}.${location.location}.aliyuncs.com`;

    console.log(host);
}

main();

```
上传 OSS 的地址，用的临时 signature 和 policy 都有了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c18ffbe373b74b1da1f08eb0e333efc3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1232&h=252&s=64402&e=png&b=181818)

这些代码不用记，文档里都有：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74c442a1f2de4861b78fe59fea1c77c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1774&h=1150&s=360253&e=png&b=ffffff)

这样就能在网页里用这些来上传文件到 OSS 了：

创建个 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/axios@1.6.5/dist/axios.min.js"></script>
</head>
<body>
    <input id="fileInput" type="file"/>
    
    <script>
        const fileInput = document.getElementById('fileInput');

        async function getOSSInfo() {
            await '请求应用服务器拿到临时凭证';
            return {
                OSSAccessKeyId: 'LTAI5tDemEBPwQkTx65jZCdy',
                Signature: 'NfXgq/qLIR2/v87j/XC9sjrASOA=',
                policy: 'eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0yMFQwMzoyNjowOC4xMDZaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==',
                host: 'http://guang-333.oss-cn-beijing.aliyuncs.com'
            }
        }

        fileInput.onchange = async () => {
            const file = fileInput.files[0];

            const ossInfo = await getOSSInfo();


            const formdata = new FormData()
 
            formdata.append('key', file.name);
            formdata.append('OSSAccessKeyId', ossInfo.OSSAccessKeyId)
            formdata.append('policy', ossInfo.policy)
            formdata.append('signature', ossInfo.Signature)
            formdata.append('success_action_status', '200')
            formdata.append('file', file)

            const res = await axios.post(ossInfo.host, formdata);
            if(res.status === 200) {
                
                const img = document.createElement('img');
                img.src = ossInfo.host + '/' + file.name
                document.body.append(img);

                alert('上传成功');
            }
        }
    </script>
</body>
</html>
```

这里 getOSSInfo 应该是请求服务端的接口，拿到刚才我们控制台输出的那些东西。

这里就简化下，直接写死在代码里了。

引入 axios，用这些信息来上传文件。

跑个静态服务器：

```
npx http-server .
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df383c8936814fcf93f8fa388534d143~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=710&h=582&s=93425&e=png&b=181818)

这时候你上传文件的时候会提示跨域错误：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4c1a25c88c0455ca25463753fd737ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1562&h=884&s=159518&e=png&b=fefcfc)

我们在控制台开启下跨域：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3b099abe3794369bafd9a412f8afc26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1942&h=1340&s=273036&e=png&b=8b8b8b)

然后再试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b0fa91fc6654687b2bd80c841f50477~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1790&h=1120&s=1037999&e=gif&f=40&b=fefefe)

上传成功了！


控制台文件列表也可以看到这个文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/663aaf15d52046ca9f1b438a254d43ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1878&h=1094&s=352599&e=png&b=f8f6f6)

这就是完美的 OSS 上传方案。

服务端用 RAM 子用户的 accessKey 来生成临时签名，然后返回给客户端，客户端用这个来直传文件到 OSS。

因为临时的签名过期时间很短，我们设置的是一天，所以暴露的风险也不大。

这样服务端就根本没有接受文件的压力，只要等客户端上传完之后，带上 URL 就好了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/oss-test)

## 总结

上传文件一般不会直接存在服务器目录下，这样不好扩展，一般我们会用阿里云的 OSS，它会自己做弹性扩展，所以存储空间是无限的。

OSS 对象存储是在一个 bucket 桶下，存放多个文件。

它是用 key-value 存储的，没有目录的概念，阿里云 OSS 的目录只是用元信息来模拟实现的。

我们在测试了在控制台的文件上传，也测试过了 node 里用 ali-oss 包来上传、在网页里直传 OSS 这三种上传方式。

不管在哪里上传，都需要 acessKeyId 和 acessKeySecret。

这个是阿里云的安全策略，因为直接用用户名密码，一旦泄漏就很麻烦，而 acessKey 泄漏了也可以禁用。而且建议用 RAM 子用户的方式生成 accessKey，这样可以最小化权限，进一步减少泄漏的风险。

客户端直传 OSS 的方式不需要消耗服务器的资源，但是会有泄漏 acessKey 的风险，所以一般都是用服务端生成临时的签名等信息，然后用这些信息来上传。

这种方案就是最完美的 OSS 上传方案了。

掌握了这些，就完全足够应对工作中的 OSS 使用了。
