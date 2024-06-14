## 前言

假设我们的项目做完了，现在该部署上线了。你有两个方向可以选择：

1.  部署到 Vercel
2.  部署到自己的服务器

因为网络原因，国内无法直接访问 Vercel 。假如你要部署到自己的服务器，你有三种选择：

1.  使用 Node.js Server
2.  使用 Docker Image
3.  使用[静态导出](https://juejin.cn/book/7307859898316881957/section/7309078383263989786)

其中使用 Node.js Server，也就是我们目前开发的这种方式，主要步骤是将代码部署到服务器上，然后运行`npm run start` 启动 Node.js Server，适用于全栈项目。使用 Docker Image 的方式我们会在下篇文章讲到。静态导出适用于纯前端项目，在本地构建导出后，将构建的内容部署到服务器上。

本篇我们讲讲如何以 Node.js Server 的方式部署到自己的服务器上。我们先从买一个服务器开始说起。

## 服务器

### 买个服务器

现在我们买个服务器，这里我们以目前市场占有率第一的**阿里云服务器**为例，购买可以参考 [《一篇从购买服务器到部署博客代码的详细教程》](https://juejin.cn/post/7049692191110725645)。

假设我们已经买完了，得到了一个全新的服务器：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e35d54585ec64acb8af889c439d5ad31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3520\&h=458\&s=145669\&e=png\&b=fdfdfd)

注：当然你也可以重置一个服务器，此过程叫做“云服务器初始化”，是指将云服务器恢复到最初创建的状态，类似手机的恢复出厂设置。因为阿里云服务器数据是保存在云盘上的，所以这个过程也叫做**重新初始化云盘**，具体操作参考阿里云文档[《重新初始化系统盘》](https://www.alibabacloud.com/help/zh/ecs/user-guide/re-initialize-a-system-disk)。

### 获取登录密码

首先要做的应该是重置密码。根据阿里云文档的[《重置密码操作说明》](https://help.aliyun.com/zh/ecs/user-guide/reset-the-logon-password-of-an-instance)，重置一下密码，否则我们无法登陆服务器。

### 登陆服务器

获取密码后，我们尝试用命令行的方式登陆服务器：

```bash
# 语法：ssh 用户名@<实例的固定公网IP或EIP>

# 示例：
ssh root@39.100.83.124

# 输入实例登录密码
# 如果出现 Welcome to Alibaba Cloud Elastic Compute Service ! 表示成功连接到实例。
```

效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f956cbaa925499f88bb55c20c1a682a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136\&h=292\&s=473278\&e=png\&b=0e0e0f)

当重新登陆的时候，又要输入一次密码，为了能够免密码登陆，我们配置下公钥：

```bash
# 在本地起一个终端，获取本地公钥
cat ~/.ssh/id_rsa.pub

# 登陆服务器，将获取的公钥写入服务器的 authorized_keys
echo "这里修改为你的公钥内容" >> ~/.ssh/authorized_keys
```

这样我们再次登陆的时候就不需要输入密码了。注意，我们写入的是 `~` 目录里，这就意味着如果我们切换了用户，是需要再按照这个方式重新配置一遍的。

登陆后如果我们一段时间没有操作，再操作的时候就会断开连接。为了长时间保持 SSH 会话连接不断开，需要设置下心跳以保持连接，运行：

```bash
vim /etc/ssh/sshd_config
```

添加配置项：

```bash
ClientAliveInterval 600      
ClientAliveCountMax 10
TCPKeepAlive yes
```

`ClientAliveInterval 600` 表示 每 600 秒发送一次请求， 从而保持连接。`ClientAliveCountMax 10` 表示服务器发出请求后客户端没有响应的次数达到 10 次，就自动断开连接。所以无响应的 SSH 客户端将在大约 600 x 10 = 6000 秒后断开连接。

重启 sshd 服务，使配置生效：

```bash
systemctl restart sshd
```

### 装个宝塔

各种环境（Nginx、Redis、MySQL 等）慢慢装其实也可以，但这里为了简单起见，我们直接装个[宝塔](https://www.bt.cn/new/index.html)。宝塔是一款简单好用的 Linux/Windows 服务器运维管理面板。使用宝塔，我们可以快捷的安装环境、查看文件、修改配置等。

登录服务器后，运行脚本：

```javascript
if [ -f /usr/bin/curl ];then curl -sSO https://download.bt.cn/install/install_panel.sh;else wget -O install_panel.sh https://download.bt.cn/install/install_panel.sh;fi;bash install_panel.sh ed8484bec
```

这里我们用的是万能安装脚本，适用于不确定使用哪个 Linux 系统版本的情况。其他脚本内容请参考[宝塔的安装说明](https://www.bt.cn/new/download.html)。

安装的时候需要输入一个 `y`进行确认：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f29367c79054c21b22f352f4242f6cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1522\&h=582\&s=1295657\&e=png\&b=0e0d0f)

然后就是等待安装，大概 1 到 2 分钟左右会安装完。安装成功后，你会看到：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4103959480d14e57bcf43705e667fd50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956\&h=506\&s=764090\&e=png\&b=05121b)

**及时保存这些信息。** 出于安全考虑，宝塔使用的端口号是随机生成的端口号，从上图中可以看出，这次端口号开在了 14913，为了能够正常访问，需要在云服务器 ECS 的安全组中开启此端口号。

打开[服务器控制台](https://ecs.console.aliyun.com/securityGroup/region)：

![截屏2024-01-22 下午5.51.15.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f06288cba4543b0bdc64eda5dc31b1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3608\&h=1072\&s=242664\&e=png\&b=ffffff)

添加此端口号，我们顺便把后面会用到的 `3000`（项目开启在 3000 端口）、`80`（HTTP 默认端口）、`443`（HTTPS 默认端口）顺便也都开启了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8457fc67bfe448d6a027cf6e07e99783~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4378\&h=652\&s=210613\&e=png\&b=ffffff)

然后打开宝塔给出的外网面板地址，因默认启用自签证书 https 加密访问，浏览器将提示不安全，点击【高级】-【继续访问】或【接受风险并继续】访问。

然后输入命令行中给出的用户名和密码。第一次登录还需要勾选同意协议，并绑定宝塔账号。绑定后，会进入到宝塔的主界面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93fa7e5a69084858b1c19a32dad3842e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3354\&h=1188\&s=236606\&e=png\&b=fdfdfd)

### Nginx、MySQL 与 Node

首次登录宝塔的时候，宝塔会给出**推荐安装套件**提示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4c7b05bdae04f1ea1035fbed1eb2e51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2038\&h=1196\&s=237876\&e=png\&b=fefdfd)

当然你也可以在**软件商店**中一一安装：

![截屏2024-01-22 下午9.28.34.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c81033641414cb68ea1a37d9003f334~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3434\&h=1768\&s=702044\&e=png\&b=fcfafa)

这里我们至少需要把 Nginx 和 MySQL 安装了，至于 FTP、PHP、phpMyAdmin 则视个人情况选择。（我是直接在推荐的时候把 LNMP 都极速安装了。虽说是极速，安装还是需要一会的……）

然后安装 Node 环境。点击宝塔左侧的网站选项，打开 Node 项目，安装 Node 版本管理器：

![截屏2024-01-22 下午7.03.04.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4976c2596327444d842a9384868aefc4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3548\&h=560\&s=163610\&e=png\&b=fafafa)

如果列表中给出的 Node.js 版本比较老，你可以点击右侧的“更新版本列表”，选择一个合适的版本进行安装，这里我选择的是最新的稳定版 v20.11.0，选择后等待安装成功（安装的时候也会自动安装 PM2 模块）：

![截屏2024-01-23 下午2.48.45.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2589c2d7dcb24064a5463744f42ad453~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1876\&h=1486\&s=364174\&e=png\&b=fefefe)

注意安装完成后，图中的 **“命令行版本”** 要选择上，如果不选择的话，我们登录服务器，不会有 node 命令，也就是运行 node 相关的命令会报错。

### FTP

如果你安装了 FTP，可以使用 [FileZilla](https://filezilla-project.org/download.php) 这个 FTP 软件查看、编辑、上传、下载文件。Finder 虽然也可以连接 FTP 服务器，但无法上传、编辑、删除文件，功能有限。使用 FTP，首先要做一番配置：

打开[服务器控制台-安全组](https://ecs.console.aliyun.com/securityGroup/region)：

![截屏2024-01-22 下午5.51.15.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/257d228592ce4b33972129b2c3d2ed00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3608\&h=1072\&s=242664\&e=png\&b=ffffff)

添加 `20`、`21` 和 `39000-40000` 范围端口：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfbd717b0bd74b789d660552d993a90b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4406\&h=576\&s=178865\&e=png\&b=ffffff)

在宝塔的 **“安全”** 面板里也把这些端口添加一遍：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94c3488328db4969ab55c77bf1407ae0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5090\&h=1178\&s=431318\&e=png\&b=fdfdfd)

注：阿里云服务器的端口范围写法为 `39000/40000`，宝塔里的端口范围写法为 `39000-40000`，略有不同。

然后在 **“软件商店”** 中修改 PureFTPd 的设置：

![截屏2024-01-24 下午4.19.05.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/003490728cea4ccebfeba3102da6f2b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=5104\&h=1448\&s=657220\&e=png\&b=fdfbfb)

在“配置修改”里，搜索 `ForcePassiveIP`，然后将其值更改为服务器的 IP：

![截屏2024-01-24 下午4.21.44.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b8e1eca0cc44e1292d42cb73b43c61d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1438\&h=1354\&s=205246\&e=png\&b=f9f9f9)

回到宝塔的“FTP”界面，点击“添加 FTP”，添加一个用户名和密码，根目录设置为 `/www/wwwroot`，这是宝塔的默认建站目录，我们也会把项目的代码放到这个目录下。

![截屏2024-01-24 下午4.24.10.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a025106c5d9457599e4af8b56efb6be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2542\&h=1164\&s=226791\&e=png\&b=7c7c7c)

添加用户后，点击查看快速连接，根据提示使用 FTP 工具连接即可：

![截屏2024-01-24 下午4.26.31.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/205aa66c7711497d8cc3a0ddfea861c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2632\&h=1460\&s=432004\&e=png\&b=7b7b7b)

成功连接后的效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac2e403a9b24a66a3bd328cbc0e5ec4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2384\&h=1844\&s=601806\&e=png\&b=f9f9f9)

## 域名

### 买个域名

现在我们买个域名，购买域名可以参考[《一篇域名从购买到备案到解析的详细教程》](https://juejin.cn/post/7052257775270756366)。

假设我们已经购买并备案好了。在[阿里云域名控制台](https://dc.console.aliyun.com/next/index#/domain-list/all)可以查到：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5eb1ddd96e354327876b864cbb4e4502~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2048\&h=120\&s=38405\&e=png\&b=ffffff)

### 解析域名

现在我们把域名解析到我们的服务器地址上。点击左边的“解析”按钮，然后点击“添加记录”：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b581842b3f94816ad08190607b2d8f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512\&h=1170\&s=140885\&e=png\&b=fefefe)

这里我们用的是二级域名 `notes.yayujs.com`，记录值填写我们购买的服务器地址。添加后，应该很快就会生效。

### SSL 证书

阿里云提供免费的 SSL 证书（很多网站都提供的），最近证书的有效期从之前的 1 年改为了目前的 3 个月，虽然有些麻烦，但也能凑合着用。

参考[《VuePress 博客优化之开启 HTTPS》](https://juejin.cn/post/7051902149826969608)，搞一份免费证书：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eec3e1e0b0d74cbaba60954d07783c5b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4658\&h=990\&s=313958\&e=png\&b=ffffff)

点击“下载”，服务器类型选择 nginx，点击“下载”，会下载证书文件，包含一个 `.pem`文件，一个 `.key` 文件。

这两个文件留着备用，后面开启 HTTPS 会用到。

## 部署 Next.js 项目

### 本地检查

现在我们尝试部署我们的项目，首先要保证自己的项目本身没有问题。所以我们在本地先 `npm run build`，然后 `npm run start`检查一下运行。为了简单起见，我们可以在脚本里再添加一个 `prod`命令，修改 `package.json`：

```javascript
{
  "name": "next-react-notes-demo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    // ...
    "prod": "next build && next start"
  },
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}

```

当运行 `npm run prod`的时候，就会先构建后运行，省的每次都要手动执行两个命令。

现在我们在本地运行生产版本，发现新建笔记的时候会报错：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbe19724f69d4214b5f5cf639b658c3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1846\&h=184\&s=77726\&e=png\&b=1f1f1f)

在生产版本中，`next-auth` 并不认为 `localhost:3000`是值得信任的 Host，使用 `next-auth` 正常部署网站时，需要将 `NEXTAUTH_URL` 环境变量设置为网站的规范 URL：

    NEXTAUTH_URL=https://example.com

如果开发的时候确实没有正式的地址，可以在 `auth.js`中强行设置 `trustHost`。修改 `auth.js`，添加 `trustHost: true`配置项：

```javascript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { addUser, getUser } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers:[// ... ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
  	// ...
  },
  trustHost: true
})
```

这样再运行 `npm run prod`的时候，就不会有 auth 报错了。不过我们既然已经有了域名，可以在根目录新建一个 `.env.production`文件，设置生产环境的 `NEXTAUTH_URL`：

```bash
AUTH_URL=https://notes.yayujs.com
```

这样部署线上的时候就不会报 untrustedHost 错误了。

注：next-auth v5 里，`AUTH_URL` 是 `NEXTAUTH_URL` 的别名。

### 创建 Git 项目

本地运行没啥问题，我们就可以把项目代码提交到服务器上。虽然可以连接服务器直接上传代码，但为了以后每次提交方便，我们在服务器上创建一个裸仓，这样每次更新代码，Git 提交到远程，服务器上的代码就会自动更新，这样使用起来更加方便。

登陆服务器，运行 `yum install git`，安装 Git，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1a0458b4515433692705fc2d15d72c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020\&h=720\&s=384739\&e=png\&b=4c4c4c)

安装后，运行：

```bash
# 1. 进入目录，这是宝塔的默认建站目录
cd /www/wwwroot
# 2. 建个仓库文件夹
mkdir notes.git && cd notes.git
# 3. 创建裸仓库
git init --bare .
```

这个时候我们就获得了一个服务器上的仓库地址：

```javascript
root@39.100.83.124:/www/wwwroot/notes.git
```

这里我们使用 `git init --bare` 初始化仓库，它与我们常使用的 `git init` 初始化的仓库不一样，你可以理解为它专门用来创建远程仓库，这种仓库只包括 git 版本控制相关的文件，不含项目源文件，所以我们需要借助一个 hooks，在有代码提交到该仓库的时候，将提交的代码迁移到其他目录，这里我们在 `notes.git` 同级目录下创建了一个 `notes` 文件夹，用于存放提交的源代码文件：

```bash
# 1. 进入 hooks 目录
cd hooks

# 2. 创建并编辑 post-receive 文件
vim post-receive

# 3. 这里是 post-receive 写入的内容,注意根据自己的实际情况修改
#!/bin/bash
git --work-tree=/www/wwwroot/notes checkout -f

# 4. 赋予执行权限
chmod +x post-receive

# 5. 退出目录到 notes.git 同级目录并创建项目目录
cd ../../ && mkdir notes

```

如果顺利的话，现在在本地打开我们的 React Notes 项目， `commit` 提交代码后，运行：

```bash
git push -f root@39.100.83.124:/www/wwwroot/notes.git master
```

以后每次修改代码、提交代码后，运行这行，代码就会自动更新到服务器上。

此时服务端的 `notes` 文件夹应该有我们提交的代码了，我们可以通过宝塔的“文件”查看：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1939cca819444a6a49d62f6a3c8debf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3094\&h=1186\&s=336458\&e=png\&b=fcfcfc)

### MySQL 与 Prisma

目前服务器上的 MySQL 数据库还没有设置，我们直接在宝塔添加一个 MySQL 数据库：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92d52ef5d0b94e418edb21d86e409f11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2110\&h=1240\&s=326260\&e=png\&b=aaaaaa)

这里我们创建了一个名为 `notes` 的数据库，用户名自动设置为 `notes`，你不能更改为 `root`。设置后你可以以 `notes` 用户加密码的方式访问这个数据库。这样我们写在 `env`中 `DATABASE_URL` 就要修改为：

```javascript
DATABASE_URL="mysql://notes:WKNSjB3DeNB4xYje@localhost:3306/notes"
```

当然，我们也可以改 `root` 密码，把 `root` 密码改为 `admin`，这样连代码都不用改了……

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdb91fab55ac460bab38a716b0a967f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2352\&h=1028\&s=283549\&e=png\&b=ababab)

当然处于安全的角度考虑，最好还是使用 notes 用户。项目根目录新建一个 `.env.development`文件，代码如下：

```javascript
DATABASE_URL="mysql://root:admin@localhost:3306/notes"
```

`.env` 中设置线上的 DATABASE\_URL：

```javascript
// ...

DATABASE_URL="mysql://notes:i54f8znxfy2wh3w3@localhost:3306/notes"
```

还记得服务器代码修改的流程吗？本地代码修改后，正常运行 `git add`、`git commit` 命令后，运行：

```javascript
git push -f root@39.100.83.124:/www/wwwroot/notes.git master
```

服务器代码就会发生改变，你可以通过宝塔的“文件”面板或者 FTP 工具查看服务器上的文件。

因为我们代码中还使用了 Prisma，目前 MySQL 数据库只是新建了数据库，但没有同步数据模型，所以我们登录服务器进入项目目录：

```bash
# 1. 进入项目目录
cd /www/wwwroot/notes
# 2. 安装依赖
npm install
```

如果 `npm install` 有网络问题，可以设置 npm 镜像：

```javascript
# 设置成 npm 镜像
npm config set registry https://registry.npmmirror.com
# 改回来
npm config set registry https://registry.npmjs.org/
```

这个时候我们执行 prisma 相关的命令，我们先运行 `npx prisma -v` 试试，大概率会出现这个错：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83bbaf8c241a42da8e4d9e393ea80a60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320\&h=172\&s=58726\&e=png\&b=4c4c4c)

如果出现这个错误，运行：

```bash
# 1. 编辑环境变量
vim ~/.bashrc
# 2. 添加环境变量
export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
# 3. 保存退出后运行
source ~/.bashrc
```

然后再次运行 `npx prisma -v`试试：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e6d24ea75974232a37feaf0260acddb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330\&h=584\&s=134792\&e=png\&b=4d4d4d)

这说明 prisma 已经可以正常使用了。此时我们的数据模型要同步数据库。

如果你把迁移时生成的 `prisma/migrations`下的文件也都提交了，那你可以在服务器上运行：

```bash
npx prisma migrate deploy
```

正常部署效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16086df0746e4cce978ab3d0ea88f4a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918\&h=596\&s=961230\&e=png\&b=0d171f)

然后运行 `npx prisma generate`初始化 Prisma Client：

```javascript
npx prisma generate
```

如果你没有提交，反正也是初始化，你可以运行：

```bash
npx prisma migrate dev
```

此时通过 Prisma，MySQL 的数据表也设置完毕。

### 开启项目

现在我们运行 `npm run prod`试试，应该能顺利的运行在 3000 端口：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32347ba92c52447f9eb18aeafc9c5466~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=952\&h=954\&s=1594889\&e=png\&b=0e1820)

然后这个时候访问 `http://39.100.83.124:3000/`可能还打不开，因为 3000 端口还没有开启，先在宝塔的“安全”面板上开启：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a55688027b014edbab5326f2aed7dd66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3816\&h=958\&s=216602\&e=png\&b=fefefe)

我们之前只是在阿里云 ECS 的安全组中开启了 `3000`（项目开启在 3000 端口）、`80`（HTTP 默认端口）、`443`（HTTPS 默认端口），这里需要在宝塔里也开启一遍。

此时打开 `http://39.100.83.124:3000/` 应该能正常访问了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f72e8d7d82204a3e8bc10a2ebb28a7cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1688\&h=1196\&s=149929\&e=png\&b=f5f6f9)

不过点击 `Sign In` 的时候还会报错，不着急，我们慢慢解决，先学习点基础知识。

### Screen 命令

现在我们先在服务器上关掉项目的 node 程序。如果 ssh 还在保持连接，会话还在，那直接 `control + c` 也就断开了。但如果 ssh 断开了连接，恢复之前的会话就有些麻烦了。搞不好还要先强行关闭 3000 端口：

```bash
# 1. 获取端口进程 PID
lsof -i:3000
# 2. 关闭 PID
kill -9 xxxx
```

这个时候就要说到 Screen 了。Screen 是 Linux 下的一个多重视窗管理程序。拥有多窗口、会话恢复、会话共享等功能。所谓会话恢复，对于远程登录的用户，即使连接中断，用户也不会失去对已经打开的命令行会话的控制。只用登录到服务器，运行 `screen -r`即可恢复会话。

登陆服务器，安装 Screen：

```bash
yum install screen
```

Screen 的命令并不多，简单介绍下常用到的：

Screen 的状态分为两种：Attached（前台运行） 和 Detached（后台运行）。

通过 `screen -S xxx`可以新建一个会话，并进入 Attached 状态。如果该程序要长期运行，但你要暂时离开该会话，`Control + A Control + D`，该会话就会进入 Detached 状态。当你再登陆进来的时候，可以通过 `screen -ls`查看有哪些会话，然后通过 `screen -r xxxx`恢复会话，将会话从 Detached 状态转为 Attached 状态。

如果你要进入 Attached 的会话，你需要先通过 `screen -d xxxx`，将其状态转为 `Detached`，才能通过 `screen -r xxxx` 进入会话。这个过程也可以合并成 `screen -d -r xxxx`一个命令。

如果你要删除某个 screen，运行 `screen -S xxxx -X quit`。

### PM2 命令

[PM2](https://pm2.keymetrics.io/) 是部署 node 项目常用的一个工具。正常我们要安装 pm2 这个模块，但我们在宝塔装 Node.js 版本管理器的时候，宝塔已经为我们安装了 PM2 模块，所以登陆服务器，直接就有 pm2 命令了，不信你运行 `pm2 -v`试试。

PM2 是一个 Node.js 进程管理器，使用 PM2，可以实现性能监控、自动重启、负载均衡等。让我们看下常用的命令吧：

```bash
# 启动
pm2 start app.js
# 声明一个名字
pm2 start app.js --name app_name
# 监听文件变化
pm2 start python-app.py --watch

# 列表
pm2 list
# 监控
pm2 monit

# 重载
pm2 reload app_name
# 重启
pm2 restart app_name
# 停止
pm2 stop app_name
# 删除
pm2 delete app_name
```

我们来看这样一个命令：

```javascript
pm2 start npm --watch --name notes -- run prod
```

这个命令的意思是以 pm2 开启 `npm run prod`脚本命令，此进程命名为 notes，并监听文件变化。

### 配置 Nginx 和 HTTPS

现在回到我们的项目上。在宝塔的“网站”面板中添加 Node 项目，相关配置如图：

![截屏2024-01-24 下午8.17.54.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/436a9d9f02fc428da2778dee409b957b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2804\&h=1922\&s=464654\&e=png\&b=a8a8a8)

添加成功后：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3faedbe5a26141b0924733f0f4ddcf31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4704\&h=412\&s=134405\&e=png\&b=fcfcfc)

此时宝塔已经为我们的项目做好了 Nginx 配置，可以在设置中查看：

![截屏2024-01-24 下午8.26.30.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d092c3d4c091444aa0f015170eef1b17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2814\&h=1778\&s=628252\&e=png\&b=e9e9e9)

宝塔做的 Nginx 配置为监听 `notes.yayujs.com` 的 `80`端口，然后代理到 `http://127.0.0.1:3000`。

我们在 Screen 中运行我们的 Next.js 项目吧：

```bash
# 1. 登陆服务器
screen -S notes
# 2. 进入程序目录
cd /www/wwwroot/notes
# 3. 运行脚本
pm2 start npm --watch --name notes -- run prod
```

稍等一会，等待编译构建完成，我们再访问 `http://notes.yayujs.com/`应该可以正常运行了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b979a9506ba641c99872f4524323d24e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2308\&h=866\&s=118073\&e=png\&b=f5f7fa)

但是当我们点击 `Sign In`的时候，依然会报错。服务器上的报错为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b4f4a29901645eea47d82ce474e3e69~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1724\&h=118\&s=295724\&e=png\&b=03070c)

之所以会有这个报错，是因为我们的 Nginx 配置中 `x-forwarded-host`标头带了端口号，在宝塔上修改 Nginx 配置，把下图中标示的 `$server_port` 去除即可。

![截屏2024-01-24 下午8.37.31.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85a332d95da34e10adca1c85ea043ef5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1702\&h=1558\&s=407041\&e=png\&b=fcfcfc)

`Ctrl+S` 保存后，Nginx 配置就会自动生效。此时再访问 `http://notes.yayujs.com/`，点击 `Sign In`，虽然还是报错，但至少不报刚才那个错了……哈哈哈哈

现在让我么来解决 HTTPS 的问题吧。点击 Node 项目的“未部署”按钮：

![截屏2024-01-24 下午8.42.08.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca948408de724a838431a421d4550f85~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2968\&h=1910\&s=499021\&e=png\&b=a9a9a9)
还记得之前在阿里云服务器上下载的 `.key` 和 `.pem`文件吗？用编辑器打开这两个文件，将这两个文件中的内容复制到这两个输入框中，然后点击“保存并启用证书”。宝塔会自动更新 Nginx 配置：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96c7092f89b24612ae5ed10e76c634b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1790\&h=630\&s=173760\&e=png\&b=fbfbfb)

可以看到，Nginx 配置更新，监听 HTTPS 的 443 端口，代理到 3000 端口。

此时访问 `https://notes.yayujs.com/`，依然可以正常访问，不仅如此，点击 `"Sign In"` 也能正常登录了，项目运行正常：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad8ccb48f17e49fabb629da9ffed322c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2594\&h=858\&s=143887\&e=png\&b=ffffff)

此外，因为我们使用的是 pm2 运行的项目，并设置了监听文件变化，所以当你通过 `git push -f root@39.100.83.124:/www/wwwroot/notes.git master`推送代码到服务器的时候，因为文件变化，pm2 会自动重启该应用。

### 宝塔 Nginx

关于宝塔的 Nginx，我们多说一点，了解就行，以防万一用到。

正常我们登陆服务器直接安装 Nginx，比如参考[《一篇从购买服务器到部署博客代码的详细教程》](https://juejin.cn/post/7049692191110725645)中的方式，Nginx 的配置文件是放在 `/etc/nginx`目录下的。但是宝塔装的 Nginx 并没有放在该目录下。

此外，因为宝塔面板内有些包是未托管到服务器 systemd 包管理内的，所以 systemctl 是无法正常使用的。也就是说，使用 `systemctl status nginx.service`这种命令是无法准确判断 nginx 状态的，当然也无法重启重载等。

宝塔的 Nginx 安装在了 `/www/server/nginx`，配置文件在 `/www/server/nginx/conf/nginx.conf`，其内容可以通过目录直接查找，也可以在 Nginx 的设置中查看：

![截屏2024-01-24 下午9.05.10.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ab8ddb8e5914ca8a3487bc9d6373fb5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2960\&h=1834\&s=662986\&e=png\&b=d0cfcf)

这是 nginx 的主配置文件，在这个文件中底部有一句：

```bash
 include /www/server/panel/vhost/nginx/*.conf;
```

打开此目录：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dfaa4edc53e4cc68b06b9d99194ecc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2628\&h=706\&s=161436\&e=png\&b=fbfbfb)

这其实就是我们具体项目的 Nginx 配置，可以在具体项目的设置里查看：

![截屏2024-01-24 下午8.26.30.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed87ea0b25e340f79668b030ba92f179~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2814\&h=1778\&s=628252\&e=png\&b=e9e9e9)

如果你要操作宝塔的 Nginx 配置，可以在命令行中运行：

```bash
# 启动
/etc/init.d/nginx start

# 停止
/etc/init.d/nginx stop

# 重启
/etc/init.d/nginx restart

# 重载
/etc/init.d/nginx reload
```

## 参考链接

1.  <https://juejin.cn/post/7049692191110725645>
2.  <https://authjs.dev/getting-started/providers/oauth-tutorial#setting-up-nextauth_url>
