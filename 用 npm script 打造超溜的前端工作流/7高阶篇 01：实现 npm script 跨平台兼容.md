# 3.1 实现 npm script 跨平台兼容

到目前为止，如果你在 Linux、Mac 平台做开发，所有的 npm script 都会顺利运行，但是 Windows 下面的同学可能就比较痛苦了，因为不是所有的 shell 命令都是跨平台兼容的，甚至各种常见的文件系统操作也是不兼容的。

可能有部分同学处理过 npm script 跨平台兼容的问题，比如粗暴的为两种平台各写一份 npm script，像下面这样：

```json
{
  "name": "hello-npm-script",
  "scripts": {
    "bash-script": "echo Hello $npm_package_name",
    "win-script": "echo Hello %npm_package_name%"
  }
}
```

有技术追求的工程师肯定不会满足上面的解决方案，实际上社区中已经有非常多的小工具可以帮我们优雅的实现跨平台的 npm script，下面我们探索下如何实现跨平台的文件系统操作、变量引用、环境变量设置。

**特别说明，windows 环境的同学建议使用 git bash 来运行 npm script，使用 windows 自带的 cmd 可能会遇到比较多的问题**

## 文件系统操作的跨平台兼容

npm script 中涉及到的文件系统操作包括文件和目录的创建、删除、移动、复制等操作，而社区为这些基本操作也提供了跨平台兼容的包，列举如下：

* [rimraf](https://github.com/isaacs/rimraf) 或 [del-cli](https://www.npmjs.com/package/del-cli)，用来删除文件和目录，实现类似于 `rm -rf` 的功能；
* [cpr](https://www.npmjs.com/package/cpr)，用于拷贝、复制文件和目录，实现类似于 `cp -r` 的功能；
* [make-dir-cli](https://www.npmjs.com/package/make-dir-cli)，用于创建目录，实现类似于 `mkdir -p` 的功能；

使用上面这几个小工具改造 npm script 的具体步骤如下：

第 1 步，添加开发依赖：

```shell
npm i rimraf cpr make-dir-cli -D
# npm install rimraf cpr make-dir-cli --save-dev
# yarn add rimraf cpr make-dir-cli -D
```

第 2 步，改造涉及文件系统操作的 npm script：

```patch
  "scripts": {
-    "cover:cleanup": "rm -rf coverage && rm -rf .nyc_output",
-    "cover:archive": "cross-var \"mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version\"",
+    "cover:cleanup": "rimraf coverage && rimraf .nyc_output",
+    "cover:archive": "cross-var \"make-dir coverage_archive/$npm_package_version && cpr coverage/* coverage_archive/$npm_package_version -o\"",
     "cover:serve": "cross-var http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
     "cover:open": "cross-var opn http://localhost:$npm_package_config_port",
-    "postcover": "npm-run-all cover:archive cover:cleanup --parallel cover:serve cover:open"
+    "precover": "npm run cover:cleanup",
+    "postcover": "npm-run-all cover:archive --parallel cover:serve cover:open"
  },
```

对改动的几点说明：

* `rm -rf` 直接替换成 `rimraf`；
* `mkdir -p` 直接替换成 `make-dir`；
* `cp -r` 的替换需特别说明下，`cpr` 默认是不覆盖的，需要显示传入 `-o` 配置项，并且参数必须严格是 `cpr <source> <destination> [options]` 的格式，即配置项放在最后面；
* 把 `cover:cleanup` 从 `postcover` 挪到 `precover` 里面去执行，规避 `cpr` 没归档完毕覆盖率报告就被清空的问题；

> **TIP#13**：任何改动之后记得重新运行 npm run cover，确保所有的 npm script 还是按预期工作的

## 用 cross-var 引用变量

[2.2 在 npm script 中使用变量](https://juejin.im/book/5a1212bc51882531ea64df07/section/5a12146951882531bb6c68fe) 介绍了如何使用内置和预定义变量减少代码重复的技巧，如本节开头的例子，Linux 和 Windows 下引用变量的方式是不同的，Linux 下直接可以用 `$npm_package_name`，而 Windows 下必须使用 `%npm_package_name%`，我们可以使用 [cross-var](https://www.npmjs.com/package/cross-var) 实现跨平台的变量引用，具体步骤如下：

第 1 步，安装 cross-var 为开发依赖：

```shell
npm i cross-var -D
# npm install cross-var --save-dev
# yarn add cross-var -D
```

第 2 步，改写引用变量 npm script，具体 diff 如下：

```patch
  "scripts": {
     "cover:cleanup": "rm -rf coverage && rm -rf .nyc_output",
-    "cover:archive": "mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version",
-    "cover:serve": "http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
-    "cover:open": "opn http://localhost:$npm_package_config_port",
+    "cover:archive": "cross-var \"mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version\"",
+    "cover:serve": "cross-var http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
+    "cover:open": "cross-var opn http://localhost:$npm_package_config_port",
     "postcover": "npm-run-all cover:archive cover:cleanup --parallel cover:serve cover:open"
   },
```

因为 cover:serve 和 cover:open 命令都比较简单，直接在原始命令前增加 cross-var 命令即可，而 cover:archive 内含了两条子命令，我们需要用引号把整个命令包起来（注意这里是用的双引号，且必须转义），然后在前面加上 cross-var。

此外，细心的同学可能发现引入 cross-var 之后，它竟然给我们安装了 babel，如果想保持依赖更轻量的话，可以考虑使用 [cross-var-no-babel](https://www.npmjs.com/package/cross-var-no-babel)。

## 用 cross-env 设置环境变量

在 node.js 脚本和 npm script 使用环境变量也是比较常见的，比如我们在运行测试时，需要加上 `NODE_ENV=test`，或者在启动静态资源服务器时自定义端口号。因为不同平台的环境变量语法不同，我们可以使用 [cross-env](https://www.npmjs.com/package/cross-env) 来实现 npm script 的跨平台兼容，具体步骤如下：

第 1 步，添加 cross-env 到开发依赖：

```shell
npm i cross-env -D
# npm install cross-env --save-dev
# yarn add cross-env -D
```

第 2 步，改写使用了环境变量的 npm script：

```patch
  "scripts": {
-    "test": "NODE_ENV=test mocha tests/",
+    "test": "cross-env NODE_ENV=test mocha tests/",
  },
```

上面的改动更简单，直接在设置了环境变量的命令前面加上 cross-env 即可。

## 再多说几句

关于 npm script 的跨平台兼容，还有几点需要大家注意：

* 所有使用引号的地方，建议使用双引号，并且加上转义；
* 没做特殊处理的命令比如 eslint、stylelint、mocha、opn 等工具本身都是跨平台兼容的；
* 还是强烈建议有能力的同学能使用 Linux 做开发，只要你入门并且熟练了，效率提升会惊人；
* 短时间内继续拥抱 Windows 的同学，可以考虑看看 Windows 10 里面引入的 [Subsystem](https://msdn.microsoft.com/en-us/commandline/wsl/about)，让你不用虚拟机即可在 Windows 下使用大多数 Linux 命令。

> **TIP#14**：如果你在编写 npm script 过程中有更多的跨平台兼容需求，基本思路是去 [npmjs.com](https://www.npmjs.com/search?q=cross%20platform) 上找对应的包，关键词自然少不了 `cross platform`，你遇到的问题，肯定很多其他人遇到过，相信我，你并不孤独！

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/06-add-cross-platform-support)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `06-add-cross-platform-support`。

----------------------------
