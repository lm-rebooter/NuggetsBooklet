# 2.2 在 npm script 中使用变量

npm 为加高效的执行 npm script 做了大量的优化，[创建并运行 npm script 命令](https://juejin.im/book/5a1212bc51882531ea64df07/section/5a1213d4f265da4335625b4a) 里面讲到的环境变量特性能让我们在 npm script 中直接调用依赖包里的可执行文件，更强大的是，npm 还提供了 `$PATH` 之外的更多的变量，比如当前正在执行的命令、包的名称和版本号、日志输出的级别等。

DRY（Don't Repeat Yourself）是基本的编程原则，在 npm script 中使用预定义变量和自定义变量让我们更容易遵从 DRY 原则，因为使用这些变量之后，npm script 就具备了自适应的能力，我们可以直接把积累起来的 npm script 使用到其他项目里面，而不用做任何修改。

## 使用预定义变量

首先我们来看预定义变量，通过运行 `npm run env` 就能拿到完整的变量列表，这个列表非常长，这里我使用 `npm run env | grep npm_package | sort` 拿到部分排序后的预定义环境变量：

```shell
// 作者信息...
npm_package_author_email=wangshijun2010@gmail.com
npm_package_author_name=wangshijun
npm_package_author_url=http://github.com/wangshijun
// 依赖信息...
npm_package_devDependencies_markdownlint_cli=^0.5.0
npm_package_devDependencies_mocha=^4.0.1
npm_package_devDependencies_npm_run_all=^4.1.2
// 各种 npm script
npm_package_scripts_lint=npm-run-all --parallel lint:*
npm_package_scripts_lint_css=stylelint *.less
npm_package_scripts_lint_js=eslint *.js
npm_package_scripts_lint_js_fix=npm run lint:js -- --fix
npm_package_scripts_lint_json=jsonlint --quiet *.json
// 基本信息
npm_package_version=0.1.0
npm_package_gitHead=3796e548cfe406ec33ab837ac00bcbd6ee8a38a0
npm_package_license=MIT
npm_package_main=index.js
npm_package_name=hello-npm-script
npm_package_readmeFilename=README.md
// 依赖的配置
npm_package_nyc_exclude_0=**/*.spec.js
npm_package_nyc_exclude_1=.*.js
```

变量的使用方法遵循 shell 里面的语法，直接在 npm script 给想要引用的变量前面加上 `$` 符号即可。比如：

```shell
{
  "dummy": "echo $npm_package_name"
}
```

回到我们的项目，测试覆盖率归档是比较常见的需求，因为它方便我们追踪覆盖率的变化趋势，最彻底的做法是归档到 CI 系统里面，对于简单项目，则可以直接归档到文件系统中，即把收集到的覆盖率报告按版本号去存放。

比如，我们在根目录下新建 coverage_archive 目录存储覆盖率归档，并利用变量机制把归档和版本号关联起来。具体的 npm script 修改如下：

```patch
diff --git a/package.json b/package.json
index d297f2e..d86f65c 100644
--- a/package.json
+++ b/package.json
@@ -12,9 +12,10 @@
   "scripts": {
-    "precover": "rm -rf coverage",
     "cover": "nyc --reporter=html npm test",
-    "postcover": "rm -rf .nyc_output && opn coverage/index.html"
+    "cover:cleanup": "rm -rf coverage && rm -rf .nyc_output",
+    "cover:archive": "mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version",
+    "postcover": "npm run cover:archive && npm run cover:cleanup && opn coverage_archive/$npm_package_version/index.html"
   },
```

主要改动是：增加 cover:cleanup 和 cover:archive 命令，并且修改 postcover 命令。下面对使用了环境变量的 npm script 稍作解释：

cover:archive 做了 2 件事情：

1. `mkdir -p coverage_archive/$npm_package_version` 准备当前版本号的归档目录；
1. `cp -r coverage/* coverage_archive/$npm_package_version`，直接复制文件来归档；

而 postcover 做了 3 件事情：

1. `npm run cover:archive`，归档本次覆盖率报告；
1. `npm run cover:cleanup`，清理本次覆盖率报告；
1. `opn coverage_archive/$npm_package_version/index.html`，直接预览覆盖率报告；

配置好之后，我们直接运行 `npm run cover`，最后的目录结构如下：

![](https://user-gold-cdn.xitu.io/2017/12/1/1600f6b21ec7b5f9?w=1820&h=878&f=png&s=253518)

## 使用自定义变量

除了预定义变量外，我们还可以在 package.json 中添加自定义变量，并且在 npm script 中使用这些变量。

为把测试覆盖率报告分享给其他同事浏览，我们就不能使用 opn-cli 打开文件了，需要启动简单的 http 服务，把网址发给别人浏览，比如我们约定网址 `http://IP:3000`，这里的 IP 需要替换成自己的实际 IP。

[http-server](https://www.npmjs.com/package/http-server) 提供了非常轻量的 http 服务，我们先把它加到 devDependencies 中：

```shell
npm i http-server -D    # 等价命令 npm install http-server --save-dev
```

接下来，在 package.json 增加自定义端口配置和相应的 npm script 命令，完整的 diff 如下：

```patch
diff --git a/package.json b/package.json
index d86f65c..abc9d01 100644
--- a/package.json
+++ b/package.json
@@ -3,6 +3,9 @@
   "version": "0.1.0",
+  "config": {
+    "port": 3000
+  },
   "scripts": {
@@ -15,7 +18,9 @@
     "cover": "nyc --reporter=html npm test",
-    "postcover": "npm run cover:archive && npm run cover:cleanup && opn coverage_archive/$npm_package_version/index.html"
+    "cover:serve": "http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
+    "cover:open": "opn http://localhost:$npm_package_config_port",
+    "postcover": "npm-run-all cover:archive cover:cleanup --parallel cover:serve cover:open"
   },
@@ -23,6 +28,7 @@
   "devDependencies": {
     "chai": "^4.1.2",
+    "http-server": "^0.10.0",
     "mocha": "^4.0.1",
```

关于改动做以下几点解释：

* 新增的命令 `cover:serve` 中同时使用了预定义变量 `$npm_package_version` 和自定义变量 `$npm_package_config_port`；
* 预览覆盖率报告的方式从直接打开文件修改为打开网址： `http://localhost:$npm_package_config_port`；
* postcover 命令要做的事情比较多，我们直接使用 npm-run-all 来编排子命令。

> **TIP#8**：注意这里给 cover:serve 和 cover:open 增加了并行参数 `--parallel`，因为 cover:serve 不会自动退出。

> **TIP#9**：可能有同学会好奇，是否可以在自定义变量的声明中使用预定义变量，笔者也有这种好奇，并且做过尝试，结果是不支持。

修改完之后，我们再次运行 npm run cover，终端会在 cover:serve 之后进入等待状态：

![](https://user-gold-cdn.xitu.io/2017/12/1/1600f6b886e6e423?w=1280&h=968&f=png&s=228450)

同时浏览器会打开覆盖率报告，如下图：

![](https://user-gold-cdn.xitu.io/2017/12/1/1600f6bb0e572ee4?w=976&h=554&f=png&s=70116)

----------------------------

**好，关于 npm script 里面的变量使用就介绍到这里，留给你的问题是，在你的项目里面怎么用起来呢？如果想到了，什么时候落地？**

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/05-use-config-variables)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `05-use-config-variables`。

----------------------------
