# 4.2 在 Git Hooks 中执行 npm script

严肃的研发团队都会使用 Git 之类的版本管理系统来管理代码，随着 GitHub 的广受欢迎，相信大家对 Git 并不陌生。Git 在代码版本管理之外，也提供了类似 npm script 里 `pre`、`post` 的钩子机制，叫做 [Git Hooks](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks)，钩子机制能让我们在代码 commit、push 之前（后）做自己想做的事情。

Git Hooks 能给我们的开发工作流带来哪些可能呢？我带的团队中，大部分项目通过 npm script 为本地仓库配置了 pre-commit、pre-push 钩子检查，且正计划为远程仓库（[Remotes](https://git-scm.com/book/en/v1/Git-Basics-Working-with-Remotes)）配置 pre-receive 钩子检查。两种钩子的检查目的各不相同，本地检查是为了尽早给提交代码的同学反馈，哪些地方不符合规范，哪些地方需要注意；而远程检查是为了确保远程仓库收到的代码是符合团队约定的规范的，因为如果没有远程检查环节，熟悉 Git 的同学使用 `--no-verify`（简写为 `-n`） 参数跳过本地检查时，本地检查就形同虚设。

可能有同学会嘀咕，在 IDE 里面配置各种检查难道还不够么？对个人开发者来说足够了，但对于团队，如果对代码里面的坏味道听之任之，久而久之整个团队的代码质量标准都会被拉低，到最后坑的还是团队的每个成员，不是么？之前没想到这层的同学建议去看看破窗理论。

那么增加 Git Hooks 的必要性聊清楚了，我们应该在 Git Hooks 里面做哪些事情呢？通常来说：检查编码规范，把低级错误趁早挖出来修好；运行测试，用自动化的方法做功能回归，测试本身就包含很多话题，且按下不表。

前端社区里有多种结合 npm script 和 git-hooks 的方案，比如 [pre-commit](https://github.com/observing/pre-commit)、[husky](https://github.com/typicode/husky)，相比较而言 husky 更好用，它支持更多的 Git Hooks 种类，再结合 [lint-staged](https://github.com/okonet/lint-staged) 试用就更溜。

接下来我们逐步给示例项目配置本地的 Git Hooks，而在钩子中运行的是已有的 npm script，比如 lint、test：

### 1. 安装项目依赖

使用如下命令安装 husky、lint-staged 到项目依赖中：

```shell
npm i husky lint-staged -D
# npm install husky lint-staged --save-dev
# yarn add husky lint-staged -D
```

husky 的基本工作原理可以稍作解释下，翻看 husky 的 [package.json](https://github.com/typicode/husky/blob/master/package.json)，注意其中的 scripts 声明：

```json
  "scripts": {
    "test": "jest",
    "format": "prettier --single-quote --no-semi --write **/*.js",
    "install": "node ./bin/install.js",
    "uninstall": "node ./bin/uninstall.js"
  },
```

这里面的 install 就是你在项目中安装 husky 时执行的脚本（所有的魔法都藏在在这里了，哈哈）。

然后再检查我们仓库的 `.git/hooks` 目录，会发现里面的钩子都被 husky 替换掉了，注意下图中三个红色框中的内容：

![](https://user-gold-cdn.xitu.io/2017/12/14/16052956cce1a5c3?w=905&h=519&f=png&s=93983)

### 2. 添加 npm script

接下来需要在 scripts 对象中增加 husky 能识别的 Git Hooks 脚本：

```patch
   "scripts": {
+    "precommit": "npm run lint",
+    "prepush": "npm run test",
     "lint": "npm-run-all --parallel lint:*",
     "lint:js": "eslint *.js",
```

这两个命令的作用是在代码提交前运行所有的代码检查 npm run lint；在代码 push 到远程之前，运行 lint 和自动化测试（**言外之意，如果测试失败，push 就不会成功**），虽然运行的是 npm run test，但是 lint 也配置在了 pretest 里面。

然后尝试提交代码：`git commit -am 'add husky hooks'`，能看到 pre-commit 钩子已经生效：

![](https://user-gold-cdn.xitu.io/2017/12/14/16052959456b87ca?w=586&h=110&f=png&s=22843)

### 3. 用 lint-staged 改进 pre-commit

如上的配置乍看起来没有任何问题，但是在大型项目、遗留项目中接入过 lint 工作流的同学可能深有体会，每次提交代码会检查所有的代码，可能比较慢就不说了，接入初期 lint 工具可能会报告几百上千个错误，这时候估计大多数人内心是崩溃的，尤其是当你是新规范的推进者，遇到的阻力会增大好几倍，毕竟大多数人不愿意背别人的锅，坏笑。

好在，我们有 lint-staged 来环节这个问题，每个团队成员提交的时候，只检查当次改动的文件，具体改动如下：

```patch
   "scripts": {
-    "precommit": "npm run lint",
+    "precommit": "lint-staged",
     "prepush": "npm run test",
     "lint": "npm-run-all --parallel lint:*",
   },
+  "lint-staged": {
+    "*.js": "eslint",
+    "*.less": "stylelint",
+    "*.css": "stylelint",
+    "*.json": "jsonlint --quiet",
+    "*.md": "markdownlint --config .markdownlint.json"
+  },
   "keywords": [],
```

接下来我们故意在 index.js 中引入错误：

```patch
-  return NaN;
+  return NaN
```

然后尝试提交这个文件：`git commit -m 'try to add eslint error' index.js`，结果如下图：

![](https://user-gold-cdn.xitu.io/2017/12/14/1605295bb21f26aa?w=733&h=503&f=png&s=90551)

上图中带有 `Running Tasks` 字样的列表就是 lint-staged 根据当前要提交的文件和 package.json 中配置的检查命令去执行的动态输出。红色框里面提示 husky 的 pre-commit 钩子执行失败，提交也就没有成功。

关于 lint-staged 还有些高级的用法，比如对单个文件执行多条命令，对单个文件动态自动修复，自动格式化等等，留待大家自己去探索好了。

撤销掉有错误的修改，提交之后，我们往远程 push 新分支，结果如下图：

![](https://user-gold-cdn.xitu.io/2017/12/14/16052e6c6cba85ff?w=867&h=460&f=png&s=160857)

> 读过我其他文章的同学可能已经想到，本小节的内容部分和我早期的文章[《用 husky 和 lint-staged 构建超溜的代码检查工作流》](https://juejin.im/post/592615580ce463006bf19aa0)有部分内容是重叠的。

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/11-run-npm-script-in-git-hooks)，想边看边动手练习的同学可以拉下来自己改（**记得安装 npm 依赖之后再运行脚本**），注意切换到正确的分支 `11-run-npm-script-in-git-hooks`。

----------------------------
