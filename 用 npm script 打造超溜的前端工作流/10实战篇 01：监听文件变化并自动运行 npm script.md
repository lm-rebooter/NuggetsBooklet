# 4.1 文件变化时自动运行 npm script

软件工程师做的事情基本都是在实现自动化，比如各种业务系统是为了业务运转的自动化，部署系统是为了运维的自动化，对于开发者本身，自动化也是提升效率的关键环节，在实际开发过程中也有不少事情是可以自动化的。

拥抱现代前端工作流的同学都会有代码风格检查、单元测试等环节，这样就很需要在代码变更之后立即得到反馈，如代码改动导致了那个 Case 失败，哪块不符合团队的编码规范等。

使用 gulp、grunt 的同学，可能对这种功能非常熟悉，不就是 watch 么？确实是，使用 npm script 我们也可以实现类似的功能。下面详细介绍如何改造我们的项目实现单测、代码检查的自动化。

## 单元测试自动化

幸运的是，mocha 本身支持 `--watch` 参数，即在代码变化时自动重跑所有的测试，我们只需要在 scripts 对象中新增一条命令即可：

```patch
     "test": "cross-env NODE_ENV=test mocha tests/",
+    "watch:test": "npm t -- --watch",
     "cover": "node scripts/cover.js",
```

尝试运行 npm run watch:test，我们会发现进程并没有退出，接下来尝试去修改测试代码，测试是不是自动重跑了呢？自己试试看。

## 代码检查自动化

我们使用的代码检查工具 [stylelint](https://stylelint.io)、[eslint](https://eslint.org)、[jsonlint](https://github.com/zaach/jsonlint) 不全支持 watch 模式，这里我们需要借助 [onchange](https://github.com/Qard/onchange) 工具包来实现，onchange 可以方便的让我们在文件被修改、添加、删除时运行需要的命令。

### 1. 安装项目依赖

使用如下命令安装 onchange 到项目依赖中：

```shell
npm i onchange -D
# npm install onchange --save-dev
# yarn add onchange -D
```

### 2. 添加 npm script

按照如下提示添加 watch:lint 和 watch 两个子命令：

```patch
+    "watch": "npm-run-all --parallel watch:*",
+    "watch:lint": "onchange -i \"**/*.js\" \"**/*.less\" -- npm run lint",
     "watch:test": "npm t -- --watch",
```

关于改动的几点说明：

* `watch:lint` 里面的文件匹配模式可以使用通配符，但是模式两边使用了转义的双引号，这样是跨平台兼容的；
* `watch:lint` 里面的 `-i` 参数是让 onchange 在启动时就运行一次 `--` 之后的命令，即代码没变化的时候，变化前后的对比大多数时候还是有价值的；
* watch 命令实际上是使用了 npm-run-all 来运行所有的 watch 子命令；

> **TIP#15**：有没有好奇过 onchange 是怎么实现文件系统监听的？所有的魔法都藏在它的源代码里面，实际上它使用了跨平台的文件系统监听包 [chokidar](https://github.com/paulmillr/chokidar)，基于它，你能做点什么有意思的事情呢？

onchange 有个不太醒目的特性是，文件系统发生变化之后，他在运行指定命令之前输出哪个文件发生了哪些变化，如下图红框中的内容：

![](https://user-gold-cdn.xitu.io/2017/12/12/160481d04f4e2aa5?w=951&h=533&f=png&s=77037)

读到这里，有没有觉得 onchange 可以和 gulp、grunt 的 watch 一样强大。

> 除了上面的单测重跑和代码检查之外，你还有什么需求需要放在 onchange 里面？欢迎留言讨论。

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/09-run-npm-script-with-onchange)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `09-run-npm-script-with-onchange`。

----------------------------
