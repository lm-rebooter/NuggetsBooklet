文档网站需要发布到互联网上才能让更多的人知道。传统的发布方法需要做以下准备。

-   Linux服务器；
-   网页服务软件 Nginx；
-   购买域名 + 实名认证；
-   HTTPS 证书；
-   Sftp 上传工具；
-   Github Action CI 自动发布最新文档。

这里面租用服务器和域名需要一笔花费。安装 Linux、Nginx，配置域名与 HTTPS 证书需要相应的服务器端知识。注册 HTTPS 证书和实名认证都需要准备和寄送材料，传统的部署方式可以说是费时费力。假设你只想简单的发布一个静态网页，完全没有必要采用这个方案。

目前，最佳的解决方案是使用 Serverless 页面托管云服务。这些云服务只需简单配置就可以自动发布 Github 上面的页面；图形化界面操作省去了学习服务器端知识；分配二级 HTTPS 域名无需购买域名和实名认证，可以说是省时省力。

目前比较推荐的有 Github Pages、Vercel、Netlify。

## 方案选型

备选三款分别是 Github Pages、Vercel、Netlify。这三个托管服务其实大同小异。

1. **Github Pages**

首先，Github Pages 使用最为方便，因为是 Github 内置的。但是我不满意的有三点。

首先，每个 repo 只能发布一个网站。我们的项目是一个 monorepo 项目，后续还会把 admin 演示网页等其他网站放上去，所以这个就存在问题。

其次，只能发布根目录和 docs 文件夹，这个对于我来说，还需要进一步重构我的目录结构。虽然目前推出了自定义 Action 功能可以解决，但我还是希望找到更方便的解决方案。

最后就是访问速度较慢的问题。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aff453097c814e93949b4a4faccb2fc7~tplv-k3u1fbpfcp-zoom-1.image)

2. **Netlify**

Netlify 总部也是位于旧金山， 在 2021.11.17 日完成了 D 轮 1.05 亿美元的融资，估值达到 20 亿美金。Netlify 创建是为了解决 Github Page 的一些问题。你可以认为它是一个体验更好速度更快的 Github Pages。而且 Netlify 付费后可以承担企业级的 Web 访问业务。

3. **Vercel**

Vercel 总部也位于旧金山，在 2021.11.23 完成了D 轮 1.5 亿美金的融资，估值达到 25 亿美金，由 GGV Capital 领投。Vercel 的创始人 Guillermo Rauch 也是 Next.js、 [http://socket.io ](http://socket.io)等开源项目的发起人。

Next.js 和 <http://socket.io> 都是明星级别的开源项目。 这个非常重要，首先证明 Vercel 财大气粗，免费额度很够用。再者就是由于创始人和前端的亲缘关系，促使 Vercel 对前端工程师非常友好。比如： Vercel 可以自动识别项目的构建工具和框架并进行自动配置。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3adf74c252594a4e85a92e69177e3206~tplv-k3u1fbpfcp-zoom-1.image)

除此之外， Guillermo 根据自己过往丰富的 Web 应用开发经验。 它提供的 Vercel 云服务可以帮助前端开发者屏蔽掉那些烦人的非业务问题。比如域名、DNS、SSL 证书。Vercel 还支持了 Node 运行时环境。自带 CI/CD 功能，并且自带 CDN ，网页速度能够得到非常好的保证。

相比之下 Netlify 就差了一些。最终难以抵挡 Vercel 的诱惑，选择它。

其实这三个都可以完成简单的静态页面发布的功能，只是实现的成本和体验问题。如果选择 Github Pages，就不得不将原有代码进行重构。将 docs 的位置移动到根目录中。而且需要更新时手动 build 文档页面。或者花时间去学习 Github Action。

如果选择 Netlify ，虽然它内置了简单的 CI 工具，但是现阶段版本还不支持 pnpm。 如果要解决这个问题还需要自己编写第三方脚本。而 Vercel 完全没有以上的问题，基本上通过 UI 界面就可以搞定，设定参数符合前端工程师体验。这个大家看下文就可以体会。

当然这三个服务也会不断发展，也会互相取长补短。等到大家读到的时候也许情况已经不一样了。

## 用户故事(UserStory)

发布组件库文档网站，使用持续集成，随时同步最新版文档网站。

## 任务分解(Task)

-   部署文档网站；
-   实现 CD 自动更新；
-   添加 Github Home Page。

### 部署文档网站

首先需要登录 <https://vercel.com/> 网站，使用 Github 账号第三方登录。这个时候 Vercel 会要求你提供 Github 数据读取授权。你可以认为 Vercel 这个时候充当的是一个 CI 服务器，它需要随时调用 Github API 随时监听项目的变化，并且获取最新的代码。

选择 New Project 添加一个项目。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c4c0ff5f90749f9b06f519ad3954cc8~tplv-k3u1fbpfcp-zoom-1.image)

从 Github 列表中选择 smarty-admin。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2389f33dc77244288477d78102a3cb2b~tplv-k3u1fbpfcp-zoom-1.image)

添加 Build 配置，这个步骤相当于以前的 CI 过程的图形化。相当于在 Vercel 的 CI 服务器上执行一遍文档编译过程。这个步骤和我们学过的 Github Action 类似。只是那个时候是使用 Yaml 文件进行配置，而现在换成了图形界面。

首先先回忆一遍在开发机上的过程，然后根据这个过程填写相应的参数。

生成文档网站需要执行：

```
pnpm i 
cd packages/smarty-ui-vite
pnpm docs:build
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/152c859d4d4b4e59891145429f57534c~tplv-k3u1fbpfcp-zoom-1.image)

页面会生成在 packages/samrty-ui-vite/docs/.vitepress/dist 中。

这时候对号入座，就可以很容易地把下面的参数填出来了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0726e6dda4c14e4291081d007f3f12f7~tplv-k3u1fbpfcp-zoom-1.image)

-   BUILD COMMAND ： pnpm docs:build (vitepress 导出指令)；
-   OUTPUT DIRECTORY : docs/.vitepress/dist (vitepress 静态页面位置)；
-   INSTALL COMMAND： pnpm install 软件包安装。

点击 Deploy 开始构建，这相当于启动了CI 服务。这个时候， Vercel 的 CI 服务会提取 Github 代码执行安装和导出流程，并且会将页面发布上线。

在几分钟的等待后就，访问 <https://smarty-admin.vercel.app/> 网站就发布好了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a2912e4a0e64f0db4cbcbf91865e95b~tplv-k3u1fbpfcp-zoom-1.image)

### 实现 CI 自动更新

下面要考虑的就是，如果有文档更新如何自动实现推送。当然这个 Vercel 已经默认提供这个功能。但是作为工程化，这个是需要大家考虑的一个问题。我们可以在 Deployments 中看到每次 Vercel 更新的记录，这表明 CI 工作正常。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eb6ba90ac4640b18b02713ab7a3462a~tplv-k3u1fbpfcp-zoom-1.image)

### 添加 HomePage 配置

下面将发布后的地址填写到 package.json 中去，这一步的属性可以让 Github 页面中显示相应的主页链接。后续发布到 Npm 上也会有主页链接。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aece087370e49cea0e5e16833408340~tplv-k3u1fbpfcp-zoom-1.image)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a732936b60d469a8cd56d4a35b0a267~tplv-k3u1fbpfcp-zoom-1.image)

## 复盘

这节课的主要内容是为组件库部署文档网站，我们选用了 Serverless 网站托管服务完成。相比于传统部署形式，前端程序员无需了解过多的服务端知识和繁琐的搭建过程就可以部署上线。

另外，类似 Vercel 这种托管服务还内置了 CI/CD 工具可以实现自动更新功能。 文档网站部署属于一个 CD 持续交付，也正好趁这次机会体验了 Github Action 以外的另外一个 CI/CD 服务。 本次部署选择了 Vercel ，其实其他两个服务也各有特点，尤其是 Github Pages，这个非常常用，也请大家课下体验一下。

最后留一些思考题帮助大家复习，也欢迎在留言区讨论。

-   如何使用 Vercel 部署前端项目？
-   Github Page 与 Vercel 的区别 ？

下节课，我们将给大家讲解如何编写标准的README文档，下节课见。