### 本资源由 itjc8.com 收集整理
# 2.1 使用 npm script 的钩子

为了方便开发者自定义，npm script 的设计者为命令的执行增加了类似生命周期的机制，具体来说就是 `pre` 和 `post` 钩子脚本。这种特性在某些操作前需要做检查、某些操作后需要做清理的情况下非常有用。

举例来说，运行 npm run test 的时候，分 3 个阶段：

1. 检查 scripts 对象中是否存在 pretest 命令，如果有，先执行该命令；
1. 检查是否有 test 命令，有的话运行 test 命令，没有的话报错；
1. 检查是否存在 posttest 命令，如果有，执行 posttest 命令；

到目前为止我们所覆盖的前端工作流包含了代码检查和测试自动化运行环节，**衡量测试效果的重要指标是测试覆盖率**，而收集覆盖率也非常的简单，**下面逐步讲解如何把代码检查、测试运行、覆盖率收集这些步骤串起来**。

## 改造 test 命令

首先，我们基于钩子机制对现有的 scripts 做以下 3 点重构，把代码检查和测试运行串起来：

* 增加简单的 lint 命令，并行运行所有的 lint 子命令；
* 增加 pretest 钩子，在其中运行 lint 命令；
* 把 test 替换为更简单的 `mocha tests/`；

代码 diff 如下：

```patch
diff --git a/package.json b/package.json
index 8f67810..d297f2e 100644
--- a/package.json
+++ b/package.json
@@ -4,13 +4,17 @@
+    "lint": "npm-run-all --parallel lint:*",
     "lint:js": "eslint *.js",
     "lint:js:fix": "npm run lint:js -- --fix",
     "lint:css": "stylelint *.less",
     "lint:json": "jsonlint --quiet *.json",
     "lint:markdown": "markdownlint --config .markdownlint.json *.md",
-    "mocha": "mocha tests/",
-    "test": "# 运行所有代码检查和单元测试 \n    npm-run-all --parallel lint:* mocha"
+    "pretest": "npm run lint",
+    "test": "mocha tests/",
```

当我们运行 npm test 的时候，会先自动执行 pretest 里面的 lint，实际输出如下：

![](https://user-gold-cdn.xitu.io/2017/11/29/160052621691a0b7?w=846&h=848&f=png&s=103472)

## 增加覆盖率收集

接下来，我们把运行测试和覆盖率收集串起来，具体做法是：增加覆盖率收集的命令，并且覆盖率收集完毕之后自动打开 html 版本的覆盖率报告。要实现目标，我们需要引入两个新工具：

1. 覆盖率收集工具 [nyc](https://github.com/istanbuljs/nyc)，是覆盖率收集工具 [istanbul](https://istanbul.js.org) 的命令行版本，istanbul 支持生成各种格式的覆盖率报告，我已经使用多年；
1. 打开 html 文件的工具 [opn-cli](https://github.com/sindresorhus/opn-cli)，是能够打开任意程序的工具 [opn](https://github.com/sindresorhus/opn) 的命令行版本，作者是前端社区非常高产的 [Sindre Sorhus](https://github.com/sindresorhus)，它在 npm 上发布了超过 1000 个包，并且质量都很不错。

使用如下命令安装依赖：

```shell
npm i nyc opn-cli -D
```

然后在 package.json 增加 nyc 的配置，告诉 nyc 该忽略哪些文件。最后是在 scripts 中新增 3 条命令：

1. precover，收集覆盖率之前把之前的覆盖率报告目录清理掉；
1. cover，直接调用 nyc，让其生成 html 格式的覆盖率报告；
1. postcover，清理掉临时文件，并且在浏览器中预览覆盖率报告；

具体 diff 如下：

```patch
diff --git a/package.json b/package.json
index 8f67810..d297f2e 100644
--- a/package.json
+++ b/package.json
@@ -4,13 +4,17 @@
   scripts: {
+    "precover": "rm -rf coverage",
+    "cover": "nyc --reporter=html npm test",
+    "postcover": "rm -rf .nyc_output && opn coverage/index.html"
   },
@@ -22,7 +26,15 @@
   "devDependencies": {
     "npm-run-all": "^4.1.2",
+    "nyc": "^11.3.0",
+    "opn-cli": "^3.1.0",
     "stylelint": "^8.2.0",
     "stylelint-config-standard": "^17.0.0"
+  },
+  "nyc": {
+    "exclude": [
+      "**/*.spec.js",
+      ".*.js"
+    ]
   }
 }
```

改完之后，我们可以直接运行 npm run cover，运行的详细截图如下：

![](https://user-gold-cdn.xitu.io/2017/11/29/16005264d5d3aef6?w=921&h=1112&f=png&s=147056)

> **TIP#7**：到目前为止，我们的工作流中已经包含代码检查、测试运行、覆盖率收集、覆盖率查看等功能，你是不是可以用来改进下自己的工作流呢？

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/04-pre-and-post-hooks)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `04-pre-and-post-hooks`。

----------------------------
