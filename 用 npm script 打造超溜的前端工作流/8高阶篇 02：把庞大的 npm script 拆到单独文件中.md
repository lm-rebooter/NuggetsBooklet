# 3.2 把庞大的 npm script 拆到单独文件中

当 npm script 不断累积、膨胀的时候，全部放在 package.json 里面可能并不是个好主意，因为这样会导致 package.json 糟乱，可读性降低。

借助 [scripty](https://github.com/testdouble/scripty) 我们可以将 npm script 剥离到单独的文件中，从而把复杂性隔到单独的模块里面，让代码整体看起来更加清晰。

示例项目中的覆盖率相关的 npm script 占据了很大的篇幅，如下：

```json
  "scripts": {
    "cover": "nyc --reporter=html npm test",
    "cover:cleanup": "rimraf coverage && rimraf .nyc_output",
    "cover:archive": "cross-var \"make-dir coverage_archive/$npm_package_version && cpr coverage/* coverage_archive/$npm_package_version -o\"",
    "cover:serve": "cross-var http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
    "cover:open": "cross-var opn http://localhost:$npm_package_config_port",
    "precover": "npm run cover:cleanup",
    "postcover": "npm-run-all cover:archive --parallel cover:serve cover:open"
  },
```

如果要隔离复杂性，我们可以考虑从 cover 相关的 script 入手，具体操作步骤如下：

### 1. 安装依赖

```shell
npm i scripty -D
# npm install scripty --save-dev
# yarn add scripty -D
```

### 2. 准备目录和文件

```shell
mkdir -p scripts/cover
```

先创建两层的目录，因为我们计划把 cover 脚本写成多个，方便单独去执行，这里命名为 scripts 是 scripty 默认的，实际上是可以自定义的。

```shell
touch scripts/cover.sh
touch scripts/cover/serve.sh
touch scripts/cover/open.sh
```

然后创建空白的脚本文件，因为有了单独的脚本，我们可以把原来的 precover、cover、postcover、cover:archive、cover:cleanup 合并到一个文件中。

按照 scripty 的默认约定，npm script 命令和上面各文件的对应关系如下：

命令 | 文件 | 备注
--- | --- | ---
cover | scripts/cover.sh | 内含 precover、postcover 的逻辑
cover:serve | scripts/cover/serve.sh | 启动服务
cover:open | scripts/cover/open.sh | 打开预览

**特别注意的是，给所有脚本增加可执行权限是必须的，否则 scripty 执行时会报错**，我们可以给所有的脚本增加可执行权限：

```shell
chmod -R a+x scripts/**/*.sh
```

### 3. 修改 scripty 脚本

准备好目录和文件之后，接下来需要给脚本填充内容，脚本内容如下（因为脚本使用的是 bash，所以直接忽略了跨平台兼容的处理，跨平台兼容脚本最好使用 Node.js 编写，下节会介绍）：

`scripts/cover.sh` 内容如下（cleanup --> cover --> archive --> preview）：

```bash
#!/usr/bin/env bash

# remove old coverage reports
rimraf coverage && rimraf .nyc_output

# run test and collect new coverage
nyc --reporter=html npm run test

# achive coverage report by version
mkdir -p coverage_archive/$npm_package_version
cp -r coverage/* coverage_archive/$npm_package_version

# open coverage report for preview
npm-run-all --parallel cover:serve cover:open
```

`scripts/cover/serve.sh` 内容如下：

```bash
#!/usr/bin/env bash

http-server coverage_archive/$npm_package_version -p $npm_package_config_port
```

`scripts/cover/open.sh` 内容如下（这里有个 sleep，是为了确保文件系统写入完成）：

```bash
#!/usr/bin/env bash

sleep 1
opn http://localhost:$npm_package_config_port
```

细心的同学可能注意到了，在 shell 脚本里面是可以随意使用 npm 的内置变量和自定义变量的。

### 4. 修改 package.json

主要改动是清理 cover:* 命令，接入 scripty，具体的 diff 如下：

```patch
   "scripts": {
     "test": "cross-env NODE_ENV=test mocha tests/",
-    "cover": "nyc --reporter=html npm test",
-    "cover:cleanup": "rimraf coverage && rimraf .nyc_output",
-    "cover:archive": "cross-var \"make-dir coverage_archive/$npm_package_version && cpr coverage/* coverage_archive/$npm_package_version -o\"",
-    "cover:serve": "cross-var http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
-    "cover:open": "cross-var opn http://localhost:$npm_package_config_port",
-    "precover": "npm run cover:cleanup",
-    "postcover": "npm-run-all cover:archive --parallel cover:serve cover:open"
+    "cover": "scripty",
+    "cover:serve": "scripty",
+    "cover:open": "scripty"
   },
```

这里我们只保留了 cover、cover:serve、cover:open 等 3 个命令，让它们都指向 scripty，调用哪个脚本都由 scripty 来处理。

### 5. 实际测试

修改完毕之后，重新运行 npm run cover，不出意外的话，我们能得到和原来完全相同的结果，仔细观察运行的日志，会发现在代码执行前有段额外的输出，如下图中红色框中的内容，scripty 在实际执行的时候会把执行的命令内容打印出来，方便调试：

![](https://user-gold-cdn.xitu.io/2017/12/7/1602e70a1b4df91b?w=874&h=711&f=png&s=94680)

### 高级技巧

scripty 比上面演示的要更强大，也支持通配符运行、脚本并行等特性、静默模式，如果有需求可以阅读官方的 [README.md](https://github.com/testdouble/scripty#advanced-usage)，毕竟咱们已经入门了，不是么？

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/07-manage-complexity-using-scripty)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `07-manage-complexity-using-scripty`。

----------------------------
