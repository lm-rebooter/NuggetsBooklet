## 前言

本篇我们讲解如何用 Vercel 部署我们的 Next.js 项目。

## Vercel 公司

Vercel 既是一个产品也是一家公司。我们就先说说 Vercel 这家公司的故事。

Vercel 是由 Guillermo Rauch 创立的云服务公司，它的前身是 2015 年 Guillermo 创立的 Zeit，2020 年才更名为 Vercel。

Zeit 于 2016 年推出了核心产品 now，用于帮助开发者快速将应用部署到云端。因为在那个时候，云部署还并未像现在这样便利，now 将域名解析、证书、缓存等服务都做到产品内部，让用户能够一键部署，节省时间精力。

2016 年也正是前后端分离架构开始流行的时候，虽然前后端分离带来了前端的“繁荣”，但也带来了诸如 SEO 等问题。于是很多开发者开始设计 SSR 框架，Guillermo 也看到了这一问题（以及问题背后的机遇），创建了 Next.js，一个基于 React （当时正火）的 SSR 框架。在之后的这些年里，Next.js 持续深耕运营，如大家所见，Next.js 目前已成为 React 领域里的明星项目。

Next.js 的成功也带动了 Vercel 的发展，Vercel 也深度集成了 Next.js，这使得 Next.js 项目的开发者会更倾向于使用 Vercel 进行部署。2021 年，Vercel 完成了 1.5 亿美元的 D 轮融资。目前估值已经达到了 25 亿美金。

除此之外，Vercel 被人津津乐道的是它挖了不少业界大佬，如：

*   Sebastian Markbage：原 React 团队 Tech Lead
*   Rich Harries：sveltejs 作者 & rollup 核心贡献者
*   Donny：swc 作者
*   Tobias Koppers：webpack 作者
*   Alexander Akait：webpack 核心贡献者 & prettier 贡献者
*   Jared Palme：Turborepo 创始人
*   ……

目前 Next.js 依然由 Vercel 来维护，再加上全明星的开发团队，未来可期。

## Vercel 产品

接下来我们说说 Vercel 这个产品，根据[官网](https://vercel.com/)的介绍：

> **Vercel is the Frontend Cloud**. Build, scale, and secure a faster, personalized web.

简单来说，Vercel 是一个网站托管平台，部署体验好。

具体来说，有以下这些功能特点：

1.  **部署方便**：一键部署，可以快速将前端应用程序、静态网站、API 等部署到 CDN 上，支持自定义域名、HTTPS、数据监控等，与 Git 集成，支持自动化部署，当提交了新的代码时会自动构建并部署
2.  **性能与拓展性**：支持多个框架的部署，并利用缓存、路由、边缘网络提供最佳性能和高流量处理能力
3.  **Serverless 函数**：可以轻松构建和部署无服务器函数和 API，无需关心服务器的维护和扩展
4.  **团队协作**：支持团队协作功能，并与 GitHub、Gitlab 等平台无缝集成

不过国内因为一些原因，Vercel 部署的网站无法直接访问，使用 Vercel 部署的项目更适合用于出海。

## 使用 Vercel

使用 Vercel 部署自然需要一个账号，注册地址：<https://vercel.com/signup>，建议使用 GitHub 账号登陆，这样可以方便部署自己在 GitHub 上的项目。

### 部署纯前端项目

现在让我们部署一个纯前端项目来熟悉下基本流程吧！

#### 导入项目

Vercel 支持导入 Git 项目或者使用 Vercel 提供的[现成模板](https://vercel.com/templates/next.js)：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf35df3ed9c048a797a70bbe96cb0a5d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2542\&h=1462\&s=387890\&e=png\&b=fbfbfb)

点击上图左侧的 `Install` 按钮，会授权 Vercel 读取和写入 GitHub 的仓库和 Git 信息，可用于自动化部署。

这里我选择了自己账号下的 [next-app-demo](https://github.com/mqyqingfeng/next-app-demo/tree/Intercepting-Routes) 项目，这是我们小册基础篇的 Demo：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c9d0601d1ab4665a3dd9f0eb2f192c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1288\&h=436\&s=49428\&e=png\&b=ffffff)

如果你也想试着部署这个项目，可以选择 `Import Third-Party Git Repository`，然后输入地址：

```bash
https://github.com/mqyqingfeng/next-app-demo/tree/Intercepting-Routes
```

Vercel 会让你在 Git 平台创建一个对应仓库方便后续修改和部署，按照 Vercel 指示操作即可。

#### 部署项目

进入部署页面后，因为我们的代码比较简单，不需要额外的填写，直接点击 `Deploy`即可：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d882d4ff5e034aa488f64c3a1690fe7f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2570\&h=1234\&s=187517\&e=png\&b=fdfdfd)

当部署完成后会进入以下页面：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/264b623b5b7d4c0f9002f3dfaaac0a1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2542\&h=1312\&s=319764\&e=png\&b=fdfdfd)

在 `Dashboard` 页面点击 `Visit` 按钮即可访问部署后的效果：

![截屏2024-02-22 14.51.58.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c66d3c68c2547d0b68dae439f379f9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2526\&h=1214\&s=209845\&e=png\&b=fcfcfc)

像我这次的部署地址为：<https://next-app-demo-ebon.vercel.app/>，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/663c1dc3abe141e2891034916e62eb1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974\&h=778\&s=449225\&e=png\&b=fcfbfb)

此外，当你推送代码到这个分支的时候，Vercel 会自动进行部署。如果出现错误，你也可以选择右上角的 `Instant Rollback` 进行回滚。

#### 自定义域名

如果我们想要使用自定义的域名呢？首先你要有一个自己的域名，域名购买和备案可以参考[《一篇域名从购买到备案到解析的详细教程》](https://juejin.cn/post/7052257775270756366)。

假设你已经有了域名，比如我有了 `yayujs.com` 这个域名，我希望将 `nextdemo.yayujs.com`这个域名解析到 Vercel 部署的地址。打开[域名控制台](https://dc.console.aliyun.com/next/index?#/domain-list/all)（我是在万网买的域名，所以这里链接的地址是阿里云域名控制台），选择对应的域名，点击“解析”。

根据 [Vercel 官方文档域名添加](https://vercel.com/docs/getting-started-with-vercel/use-existing)的介绍：

> If the domain is in use by another Vercel account, you will need to verify access to the domain, with a TXT record
>
> If you're using an Apex domain (e.g. example.com), you will need to configure it with an A record
>
> If you're using a Subdomain (e.g. docs.example.com), you will need to configure it with a CNAME record

也就是说，如果是根域，就配置 A 记录，如果是子域，就配置 CNAME 记录。这里因为配置的是子域，所以选择的 `CNAME`，配置如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cee37d6923d843bc8102529c7e5be483~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1544\&h=1310\&s=154178\&e=png\&b=fefefe)

其中记录值填写我们项目部署的域名。

最后在 Vercel 的设置中添加设置的域名：

![截屏2024-02-22 15.58.59.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec577534bd874525a2c18c953cff53eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2648\&h=1604\&s=339531\&e=png\&b=fcfcfc)

效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/483aa9a44ecf47d8bdbdeb5bf79d5747~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1376\&h=788\&s=525860\&e=png\&b=f9f8f8)

#### 国内访问

Vercel 直接部署的域名是无法访问的，我们可以通过 <https://tool.chinaz.com/dnsce> 检测我们的域名：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/663cd28706d14cbca823661d9f8d2624~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2382\&h=1412\&s=479495\&e=png\&b=ffffff)

如何让国内用户也可以访问呢？可以修改我们的域名解析：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56d66933aa7742ad8d7d90c722ebf74d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1478\&h=912\&s=119377\&e=png\&b=fdfdfd)

如果用的 A 记录，记录值为 `76.223.126.88`

如果用的 CNAME，记录值为 `cname-china.vercel-dns.com`

过一小段时间后，再次检测：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/062aea92b711468aa2457fbc3ac8d3dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2388\&h=1414\&s=474913\&e=png\&b=ffffff)

注：不过有的时候还是会无法访问，国内还是建议用自己的服务器

### 部署 Next.js + Redis 项目

我们以 React Notes 的 day1 项目为例，此时我们代码中使用了 Next.js 和 Redis，我们看下如何部署。

#### 下载项目

下载我们的 day1 分支代码：

```bash
git clone -b day1 git@github.com:mqyqingfeng/next-react-notes-demo.git
```

大家还记得 day1 实现的效果吗？我们本地运行以下代码：

```bash
cd next-react-notes-demo && npm i && npm run dev
```

因为 day1 代码需要开启 redis 服务，所以另起一个命令行运行：

```bash
redis-server
```

等 Redis 服务成功开启，此时打开 <http://localhost:3000/>，页面正常访问：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aecafd1ac7af48b4a6d33d7055f77836~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800\&h=1188\&s=159776\&e=png\&b=f6f7fa)

左侧笔记列表的标题和时间取自于 Redis 数据库，说明代码运行正常。

#### Vercel Cli

Vercel 提供了 [Vercel Cli](https://vercel.com/docs/cli) 用于命令行部署 Next.js 项目，全局安装 `vercel` 命令：

```bash
npm i -g vercel
```

安装完成后，运行以下命令，检查是否成功安装：

```bash
vercel --version
```

效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d8e34ebb8c741bf906f6fc768ec60be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940\&h=250\&s=259613\&e=png\&b=100828)

进入我们的项目根目录，目前在 day1 分支，因为 day1 分支的代码不准备再改动，所以我们切换出一个新的分支用于部署：

```bash
git checkout -b vercel-redis
```

项目根目录运行：

```bash
vercel
```

首次在项目中运行 `vercel` 时，Vercel CLI 需要知道要将项目部署到哪里。所以会有一系列的操作提示，这些操作会让你验证身份、在 Vercel 上创建项目，进行构建部署等等。交互效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c5e20b9b20a405da4d51a7035e2915d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2512\&h=928\&s=2530776\&e=png\&b=150a2c)

此步会在项目构建部署的时候出错，因为我们的项目中用了 Redis，但此时并没有开启 Redis，所以运行 `npm run build` 会失败。

既然会失败，其实也没有必要部署这一次。如果你只是希望在 Vercel 上创建一个项目并进行关联，那就运行 `vercel git connect`，等需要部署的时候再运行 `vercel deploy`。交互效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f574b35404904a40a27226f7ff22d074~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1812\&h=688\&s=1407799\&e=png\&b=1a0826)

#### 创建数据库

通过刚才的步骤建立一个项目后，在 Vercel 平台进入创建的项目，选择 `Storage` 选项，这里展示了 Vercel 目前支持的四种数据库：

![截屏2024-02-22 21.06.15.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdec3506c5f048199d209a1dddf99b65~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2648\&h=1526\&s=281587\&e=png\&b=090909)

分别是：

*   Vercel KV：基于 Redis 的解决方案，适用于 Key/Value 和 JSON 数据，由 Upstash 提供支持
*   Vercel Postgres：基于 PostgreSQL 的解决方案，轻量关系型数据库，由 Neon 提供支持
*   Vercel Blob：提供文件存储解决方案，由 Cloudflare R2 提供支持
*   Edge Config：全局数据存储，能在 Edge Server 读取，适用于频繁读取但少有改动的配置

这里我们选择 `KV`，点击 `Create`，地区选择默认的即可（选择其他的还会提示你跟项目部署的地区不一致）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dee83de51e2491589d450c3109fd3d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1288\&h=1046\&s=122381\&e=png\&b=090909)

继续点击 Connect：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2697bbede7af4d0c8c1a7ae8c1dfd25c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230\&h=882\&s=95077\&e=png\&b=090909)

现在可以看到我们创建的 Redis 数据库的地址，Vercel 也贴心的提供了接下来要做的事情：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1431b7228aed4d7b966ab02603980da9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2568\&h=2166\&s=404114\&e=png\&b=040404)

我们解释下这些要做的事情：

1.  Connect to a project：将已有的 Vercel 项目与该数据库进行关联，刚才已经点击了 Connect ，所以不需要再点了。Connect 后，Vercel 会为项目自动添加数据库相关的环境变量：

![截屏2024-02-22 21.46.30.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e4f600a27ef4ec4abbe89563bd56b8a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2620\&h=1486\&s=322777\&e=png\&b=060606)

2.  Pull your latest environment variables：Vercel 提示让你在本地运行 `vercel env pull .env.development.local`，它的作用是在本地创建一个名为 `.env.development.local`的文件，自动写入上图中的这些环境变量的值，方便你在本地直接使用

3.  Install our package：为方便用户操作数据库，Vercel 提供了自己的库 `@vercel/kv`，具体 API 参考 <https://vercel.com/docs/storage/vercel-kv/kv-reference>

如果一开始就确定用 Vercel 部署，那最好使用 `@vercel-kv`，不过我们用到的 redis API 也比较简单，使用 `ioredis` 也是可以的。现在已经有了 redis 数据库的地址，我们修改下 `/lib/redis.js`：

```javascript
const redis = new Redis(process.env.REDIS_URL)
```

修改 `.env.development.local`，添加如下代码：

```bash
REDIS_URL="rediss://default:xxxxxxxxxxxxxx@xxxxxxxxxxx:33605"
```

我们做的修改就是复制原本的 `KV_URL` 将 `redis://xxxx`改为 `rediss://xxxx`，加个 `s` 表示建立 SSL 连接。

此时本地已经可以成功运行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5731fb10adb34fb4ad4384ce9d929c6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2152\&h=870\&s=149285\&e=png\&b=f3f5f8)

现在我们将代码进行提交（注意 `.env.development.local` 顾名思义，不用提交）：

```bash
git status
git add .
git commit -m "update redis.js"
git push origin vercel-redis
```

提交到 GitHub 后，Vercel 会自动进行部署。但此时部署会失败：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5190ff4c06848b4885f190f966a435b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2488\&h=212\&s=48370\&e=png\&b=fcfcfc)

因为服务端的环境变量还没有建立，我们在该 Vercel 项目上添加一个新的环境变量 `REDIS_URL`：

![截屏2024-02-23 16.50.54.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4164e588c26f461b8b196cfb0a701087~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2610\&h=1106\&s=238575\&e=png\&b=fafafa)

然后重新部署，点击 Redeploy：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e928b9a6f2524bbcbb8e4a9a930866b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2512\&h=490\&s=98355\&e=png\&b=fafafa)

此次应该会成功部署：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05a7358894cc4e89ab581cec5d1dc9a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2488\&h=876\&s=179613\&e=png\&b=fcfcfc)

#### Preview 与 Production

此时我们已经成功的部署了一个 Next.js + Redis 的项目。在后续的发布中，有一点要注意，那就是 Preview 与 Production 环境的区别。

现在我们用的是 `vercel-redis` 分支，当第一次推送的时候，Vercel 会将其内容部署到生产环境，但是比如你修改了一些内容，然后再次推送到 `vercel-redis` 分支，Vercel 会进行自动化部署，但会放在 Preview 环境中：

![截屏2024-02-23 17.11.29.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45f4c3301d1f4780af4c03913e3e3793~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2486\&h=516\&s=123483\&e=png\&b=fefefe)

这是因为 Vercel 默认将 main / master 分支用于生产环境，只有当你推送代码到 main/master 分支的时候，才会进行生产部署，推送到其他分支就是 Preview 环境。这很好，可以进行多个版本的开发预览。但如果你就是想要指定如 `vercel-redis` 分支作为生产环境部署，可以在 Settings 中修改：

![截屏2024-02-23 17.16.03.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffdc1f4578ec4993b1230e15f36a2bec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2500\&h=904\&s=221569\&e=png\&b=fdfdfd)

此时再推送到 `vercel-redis` 分支就会进行生产部署。

### 部署 Next.js + 关系型数据库 + Prisma 项目

通过前面的示例，想必你已经对 Vercel 平台的使用有所了解，那就来正式部署我们的项目吧。

#### 下载项目

依然选用我们的 day11 分支代码。此时我们的技术选型是 Next.js + MySQL + Prisma。

下载我们的 day11 分支代码：

```bash
git clone -b day11 git@github.com:mqyqingfeng/next-react-notes-demo.git
```

老规矩，先本地运行一下，验证代码无问题：

```bash
# 注意要在本地开启 MySQL 后运行：
npm i && npm run dev
```

正如大家在上节看到，Vercel 是没有提供 MySQL 数据库的，关系型数据库只有 Vercel Postgres。如果确定用 MySQL 数据库，那可以使用搭配使用 [PlanetScale](https://planetscale.com/)，它是一个 MySQL 云数据库。如果用 Mongodb，则通常会搭配 [MongoDB Atlas](https://www.mongodb.com/zh-cn/cloud/atlas/lp/try4) 云数据库。所以对于我们的项目，部署有两种选择：

1.  改用 Vercel 提供的 Vercel Postgres，也就是改用 PostgreSQL 数据库
2.  使用 PlanetScale 云 MySQL 数据库

从技术选型的角度来讲，如果我知道最终用 Vercel 进行部署，我可能一开始就会选择用 PostgreSQL 数据库。

从钱的角度来讲，Vercel 的免费版只支持一个 PostgreSQL 数据库，且有 256MB 和每月 60h 计算时间的限制。PlanetScale 的免费版则是 5 GB 存储空间，10 亿行读取次数每月，1000 万行写入每月。更推荐用 PlanetScale。

从学习的角度来讲，就让我们顺便学习一下 Prisma 和 PostgreSQL 如何搭配使用吧！

所以我们改用 PostgreSQL 数据库（其实两种方式操作差不多）。所幸我们的项目用了 Prisma，切换的成本并不高。让我们看看如何实现吧！

#### 切换数据库

进入项目目录，运行 `vercel git connect`在 Vercel 平台上建立关联项目：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/074d143c410041d5938db059fab77d95~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1742\&h=654\&s=905671\&e=png\&b=210c3b)

建立项目后，选择 `Storage`选项，建立一个 Vercel Postgres 数据库，最终获得该数据库地址为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38f7c208f1034cd399971130020c920b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2518\&h=534\&s=123013\&e=png\&b=050505)

拷贝上图 `.env.local` 选项中的环境变量，将其写入 `.env`文件：

![截屏2024-02-26 17.50.19.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/312398e56ea44f9ba905d038579a4b45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2508\&h=812\&s=171128\&e=png\&b=fefefe)
注：为什么不运行 `vercel env pull .env`呢？因为这会强行覆盖 `.env` 文件。为什么不写入其他文件如 `.env.local`呢？因为 prisma 默认读取的是 `.env` 文件中的环境变量。为了简单起见选择手动拷贝的方式。

修改 `prisma/schema.prisma`文件：

```javascript
datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL")
}
```

运行 `npx prisma db push`，将数据模型同步数据库。

现在，让我们在本地再次运行 `npm run dev`校验数据库切换是否有问题：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d6eb327e186495da24a4546643aa71c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2308\&h=962\&s=174814\&e=png\&b=f4f5f9)

#### 部署线上

修改 `package.json`，代码如下：

```javascript
{
  "scripts": {
    "dev": "npx prisma generate && next dev",
    "build": "npx prisma generate && npx prisma db push && next build"
  }
}

```

修改 `.env.production`：

```bash
# 注释掉 AUTH_URL，v5 之后默认不需要了，但比如用了代理的时候依然需要
# AUTH_URL=https://notes.yayujs.com
```

因为使用了 next-auth，在 Vercel 项目的环境变量中需要添加 `AUTH_SECRET`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/386071fb2bbf49c78a496a685bc578dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3294\&h=498\&s=114358\&e=png\&b=060606)

目前我们还在 day11 分支，切换为新的 `vercel-postgres`分支，然后将代码提交到远程的 `vercel-postgres`分支，因为是首次部署，所以会部署到生产版本，交互效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7950eac2d0e4e7e9a2e602b49745e71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1362\&h=720\&s=863478\&e=png\&b=1c0b3a)

Vercel 自动部署后，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91e7606056aa464585d892e44b571f64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2490\&h=1142\&s=174342\&e=png\&b=f6f7fa)

部署后的项目源码：<https://github.com/mqyqingfeng/next-react-notes-demo/tree/vercel-postgres>

## 参考链接

1.  <https://juejin.cn/post/7057333396359348255>
2.  <https://www.zhihu.com/question/506210785/answer/2347889174>
3.  <https://vercel.com/>
4.  <https://lastrev.com/blog/introduction-to-vercel-a-beginners-guide>
5.  <https://github.com/vercel/examples/tree/main/storage/postgres-prisma>

>
