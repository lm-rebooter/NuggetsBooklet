# 4.5 使用 npm script 进行服务运维

需要事先说明的是，本节部分内容涉及到非前端的话题，比如服务的部署、日志，但会从前端项目管理开始，比如依赖管理、版本管理等。即使对自己定位是纯粹前端开发的同学，也建议阅读下，因为技不压身，了解整个前端项目交付流程中需要考量的点能让我们更有大局观。

通常来说，项目构建完成之后，就成为待发布的版本，因此版本管理需要考虑，甚至做成自动化的，然后，最新的代码需要部署到线上机器才能让所有用户访问到，部署环节涉及到服务的启动、重启、日志管理等需要考虑。

下面我们介绍 npm script 在服务运维时的几个用途：

## 使用 npm script 进行版本管理

每次构建完的代码都应该有新的版本号，修改版本号直接使用 npm 内置的 version 自命令即可，如果是简单粗暴的版本管理，可以在 package.json 中添加如下 scripts：

```patch
+    "release:patch": "npm version patch && git push && git push --tags",
+    "release:minor": "npm version minor && git push && git push --tags",
+    "release:major": "npm version major && git push && git push --tags",
     "precommit": "lint-staged",
```

这 3 条命令遵循 [semver](https://semver.org) 的版本号规范来方便你管理版本，patch 是更新补丁版本，minor 是更新小版本，major 是更新大版本。在必要的时候，可以通过运行 npm run version:patch 来升补丁版本，运行输出如下：

![](https://user-gold-cdn.xitu.io/2017/12/18/16066e6e3d85b6cd?w=910&h=943&f=png&s=144886)

如果要求所有的版本号不超过 10，即 0.0.9 的下个版本是 0.1.0 而不是 0.0.10，可以编写简单的 shell 脚本来实现（**注意这样会破坏 semver 的约定**），具体步骤如下：

首先，在 scripts 目录下新增 bump.sh（**别忘了文件的可执行权限**：chmod a+x scripts/bump.sh）：

```bash
#!/usr/bin/env bash

# get major/minor/patch version to change
version=`cat package.json| grep version | grep -v release | awk -F\" '{print $4}'`
components=($(echo $version | tr '.' '\n'))
major=${components[0]}
minor=${components[1]}
patch=${components[2]}

release='patch';

# decide which version to increment
if [ $patch -ge 9 ]; then
    if [ $minor -ge 9 ]; then
        release='major'
    else
        release='minor'
    fi
else
    release='patch'
fi

echo "major=$major, minor=$minor, patch=$patch, release=$release"

# upgrade version
npm run release:$release
```

然后，在 package.json 中新增 bump 子命令：

```patch
     "release:major": "npm version major && git push && git push --tags",
+    "bump": "scripty",
     "precommit": "lint-staged",
```

在必要的时候执行 npm run bump，输出示例如下：

![](https://user-gold-cdn.xitu.io/2017/12/18/16066e70eb4a0193?w=1001&h=1143&f=png&s=165735)

## 使用 npm script 进行服务进程和日志管理

在生产环境的服务进程和日志管理领域，[pm2](http://pm2.keymetrics.io) 是当之无愧的首选，功能很强大，使用简单，开发环境常用的是 [nodemon](https://www.npmjs.com/package/nodemon)。

在我们的项目中使用 npm script 进行服务进程和日志管理的基本步骤如下：

### 1. 准备 http 服务

在使用 npm script 作为构建流水线的基础上，我们在项目中引入了 [express](https://www.npmjs.com/package/express) 和 [morgan](https://www.npmjs.com/package/morgan)，并使用如下脚本启动 http 服务器方便用户访问我们的网页（morgan 使用来记录用户的访问日志的）：

先安装依赖：

```bash
npm i express morgan -D
# npm install express morgan --save-dev
# yarn add express morgan -D
```

然后在根目录下创建文件 server.js，内容如下：

```javascript
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('./dist'));
app.use(morgan('combined'));

app.listen(port, err => {
  if (err) {
    console.error('server start error', err); // eslint-disable-line
    process.exit(1);
  }

  console.log(`server started at port ${port}`);  // eslint-disable-line
});
```

### 2. 准备日志目录

为简单起见，我们项目中创建日志存储目录 logs，有些公司可能不会把日志存在项目部署目录下：

```bash
mkdir logs
touch logs/.gitkeep
git add logs/.gitkeep
git commit -m 'add logs folder'
```

并且设置该目录为 git 忽略的，再改动 .gitignore：

```patch
 dist
+logs
```

> **TIP#21**：这里加 logs/.gitkeep 空文件的目的是为了能把 logs 目录提交到 git 里面，但是我们故意忽略 logs 目录里面的内容，这是在 git 中提交目录结构而忽略其中内容的常见做法。

### 3. 安装和配置 pm2

安装 pm2 作为依赖：

```bash
npm i pm2 -D
# npm install pm2 --save-dev
# yarn add pm2 -D
```

然后添加服务启动配置到项目根目录下 pm2.json，更多配置项可以参照[文档](http://pm2.keymetrics.io/docs/usage/application-declaration)：

```json
{
  "apps": [
    {
      "name": "npm-script-workflow",
      "script": "./server.js",
      "out_file": "./logs/stdout.log",
      "error_file": "./logs/stderr.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss",
      "instances": 0,
      "exec_mode": "cluster",
      "max_memory_restart": "800M",
      "merge_logs": true,
      "env": {
        "NODE_ENV": "production",
        "PORT": 8080,
      }
    }
  ]
}
```

上面的配置指定了服务脚本为 server.js，日志输出文件路径，日志时间格式，进程数量 = CPU 核数，启动方式为 cluster，以及两个环境变量。

### 4. 配置服务部署命令

在没有集成 CI 服务之前，我们的部署命令应该是下面这样的：

```patch
     "release:major": "npm version major && git push && git push --tags",
+    "predeploy": "yarn && npm run build",
+    "deploy": "pm2 restart pm2.json",
     "bump": "scripty",
```

即在部署前需要安装最新的依赖，重新构建，然后使用 pm2 重新启动服务即可，如果你有多台机器跑通1个服务，建议有个集中的 CI 服务器专门负责构建，而部署时就不需要运行 build 了。

每次需要部署服务时只需要运行 npm run deploy 就行了，运行成功输出如下：

![](https://user-gold-cdn.xitu.io/2017/12/18/16066e77ad30626c?w=1146&h=186&f=png&s=42916)

### 5. 配置日志查看命令

至于日志，虽然 pm2 提供了内置的 logs 管理命令，如果某台服务器上启动了多个不同的服务进程，那么 pm2 logs 会展示所有服务的日志，个人建议使用如下命令查看当前服务的日志：

```patch
+    "logs": "tail -f logs/*",
     "bump": "scripty",
```

需要查看日志时，直接运行 npm run logs，运行输入如下：

![](https://user-gold-cdn.xitu.io/2017/12/18/16066e7b80b6d828?w=1271&h=354&f=png&s=80687)

当然如果你有更复杂的日志查看需求，直接用 cat、grep 之类的命令好了。

> **到这里，小册的内容基本结束了，接下来的一周，我会准备好视频版教程，在圣诞节的时候放出来给大家。如果你对内容有任何疑问，欢迎留言或者在读者群里面交流**

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/13-use-npm-script-for-devops)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `13-use-npm-script-for-devops`。

----------------------------

> **视频版教程已经录制完毕，下载地址：链接: https://pan.baidu.com/s/1gfeZ619 密码: xx8j，请享用**

----------------------------

** 对于购买了小册，没有加到读者群里面的同学，可以加我微信：feweekly，备注：掘金小册，我会拉你入群。感谢支持！**