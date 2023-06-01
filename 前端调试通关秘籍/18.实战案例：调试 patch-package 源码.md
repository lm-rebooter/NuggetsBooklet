有时候我们需要修改 node_modules 下的一些代码，但是 node_modules 不会提交到 git 仓库，改动保存不下来，怎么办呢？

这时候可以用 [patch-package](https://github.com/ds300/patch-package#readme) 这个工具。

比如我对 node_modules 下的 acorn 代码做了一些修改：

加了一个 a.js 的文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5a7c5f396484729a73a1af8333ed527~tplv-k3u1fbpfcp-watermark.image?)

在项目目录下执行 npx patch-package acorn 之后，就会生成这样一个目录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4406bf14d07c4535ab2dacc8366e422f~tplv-k3u1fbpfcp-watermark.image?)

在 patches 目录下的 xx.patch 文件里记录着对这个包的改动。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6975d692f9ed4f6ab5583e5025c6f456~tplv-k3u1fbpfcp-watermark.image?)

这个 patches 目录是可以提交到 git 仓库的，然后再次把项目拉下来的时候，执行下 npx patch-package 就会应用这次改动。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b3c3dbe871840ea995445bbc7bec53c~tplv-k3u1fbpfcp-watermark.image?)

可以把它配到 postintsll 里，每次安装完依赖自动跑。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efcf768ea1ea40ccb0c4dd202e516da0~tplv-k3u1fbpfcp-watermark.image?)

这样能保证每次拉取下来的代码都包含了对 node_modules 的改动。

如何使用我们学会了，那它是怎么实现的呢？

这节我们就来调试下 patch-package 的源码。

## 调试 patch-package 源码

首先把代码下载下来：

```
git clone git@github.com:ds300/patch-package.git
```

安装依赖，然后执行 npm run build，你会在 dist 目录下看到编译产物。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eedecb9c4cbd47998ff4ecd5004b3721~tplv-k3u1fbpfcp-watermark.image?)

它默认就是有 sourcemap 的，只不过是 base64 的方式内联的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02e35568efa8494489bc0417837806cd~tplv-k3u1fbpfcp-watermark.image?)

因为它的编译配置是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c397080b3430417ebe38b4140b42d11e~tplv-k3u1fbpfcp-watermark.image?)

接下来开始调试：

在 package.json 中可以看到 patch-package 命令的入口是 index.js：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57040b3012e04ef3ac3078917283929b~tplv-k3u1fbpfcp-watermark.image?)

也就是 dist/index.js 就是要调试的入口文件。

探究它的实现原理要分为两各方面，一个是 patches 文件怎么生成的，一个是 patches 文件怎么被应用的。

我们分别来看一下：

### patches 文件怎么生成的

看 patches 文件的内容就能看出来这是 git 的 diff：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c3cbaeaba7044f9b67ed8f341d703b5~tplv-k3u1fbpfcp-watermark.image?)

确实，patch-package 就是依赖 git diff 实现的 patches 文件生成。

生成这样的 patch 文件执行的是 patch-package xxx 命令，这里就是 node ./dist/index xxx

你可以先对 node_modules 下的某个包做下改动，然后执行 node ./dist/index xxx 来生成 patches 文件。 

然后添加这样一个调试配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50cb257fe4304d7c96886f2f2dae5e28~tplv-k3u1fbpfcp-watermark.image?)

```json
{
  "name": "调试 patch-package",
  "program": "${workspaceFolder}/dist/index.js",
  "request": "launch",
  "skipFiles": [
    "<node_internals>/**"
  ],
  "console": "integratedTerminal",
  "args": [
    "acorn"
  ],
  "type": "node"
}
```

这里的 args 里填写你修改过的 node_modules 下的包名，我这里改的是 acorn 包下的代码。

看下这个命令的打印：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23c9afa7ba5f4fa89886727bf438d464~tplv-k3u1fbpfcp-watermark.image?)

我们可以通过这些打印信息搜索对应的源码来打断点，比如搜索 Created file

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a334dee40a494ba7b68469de17714973~tplv-k3u1fbpfcp-watermark.image?)

定位到了源码，打个断点，然后 Debug 启动：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21bea85a195e4182a1669f0a5ce71f8a~tplv-k3u1fbpfcp-watermark.image?)

没错，这就是打印那行信息的代码。

然后我们往上看一下，你会看到这些代码：

首先 patch-package 会创建一个临时目录：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8ced8c347d14eb590aba4e4180508cb~tplv-k3u1fbpfcp-watermark.image?)

然后在这个目录写入一个 package.json 文件，dependencies 就是命令行参数指定的包名：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb4cea8705d84c9ea81e6a585aafca48~tplv-k3u1fbpfcp-watermark.image?)

我们去这个目录看一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a2cf9ed28ec4f3cacab1f7bd58d0f6e~tplv-k3u1fbpfcp-watermark.image?)

确实，是有这样一个 package.json 的。

然后它会在这个目录下执行 yarn install 或者 npm install（patch-package 现在不支持 pnpm）：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a870186749348dbbf450246d8f98831~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a58cf551ca3e406ca3140204a718c0de~tplv-k3u1fbpfcp-watermark.image?)

之后就进行 git 的 init、add、commit，生成一个基础的 commit。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da817d476e2f47929bd518e0687354d7~tplv-k3u1fbpfcp-watermark.image?)

然后把现在 node_modules 目录下的这个被修改过的包复制过去：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2871f5729d8a4b4988134f83c1dac579~tplv-k3u1fbpfcp-watermark.image?)

之后再 git add，然后执行 git diff，就能拿到改动的 diff：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d24a2efe57f4f30941062a02a774487~tplv-k3u1fbpfcp-watermark.image?)

这不就是 patches 文件的内容么：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5d79ea247e9446e9151ad815c8ef97c~tplv-k3u1fbpfcp-watermark.image?)

然后写到 patches 目录即可

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aecf1966610944f6889fabef4119a25b~tplv-k3u1fbpfcp-watermark.image?)

patches 文件的生成还是挺简单的，就是在临时目录下创建了一个基础 commit，然后把新的内容复制过去，通过 git diff 生成的 patches 内容。

上面这些都是通过单步、断点调试得出的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/587d8dfa3a594e89af608a579e4e6810~tplv-k3u1fbpfcp-watermark.image?)

那应用 patches 的内容是怎么实现的呢？

## patches 如何被应用的？

我又对 acorn 目录下的文件做了些修改，生成的 patches 文件是包含了增删改的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d093db1c776450cbc511edd8e6e9a12~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d4eda2fba164e19b0c579b1bcc12d35~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/041908d67eae4f82b4b5a214c20f035c~tplv-k3u1fbpfcp-watermark.image?)

patches 文件里记录了对哪几行做了新增，哪几行做了删除，哪几行做了修改。

如果人工应用这个 patches 文件的话，不就是找到对应文件的对应行数，做反向的操作就可以了么？

没错，patch-package 也是这样实现的，不过是自动进行的：

应用 patch 是执行 patch-package 命令，这里就是 node ./dist/index

所以添加一个这样的调试配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0aa0160bcabc4dd1ba11b65f9a425b1a~tplv-k3u1fbpfcp-watermark.image?)

```json
{
  "name": "调试 patch-package apply",
  "program": "${workspaceFolder}/dist/index.js",
  "request": "launch",
  "skipFiles": [
    "<node_internals>/**"
  ],
  "console": "integratedTerminal",
  "type": "node"
}
```

同样，搜索下这行打印信息：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67da954acb7c4a27b3c84340fc5afdf7~tplv-k3u1fbpfcp-watermark.image?)

打个断点：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c1bc8ac324444cea2b5177fc35d3d7e~tplv-k3u1fbpfcp-watermark.image?)

debug 跑起来，

然后 step into 这个函数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/168be4521f4240e28eb517c9159f7515~tplv-k3u1fbpfcp-watermark.image?)

单步执行到这行代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89687f5c0e6c4cb4b890ddfdec6212c0~tplv-k3u1fbpfcp-watermark.image?)

再 step into 进入函数内部：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6d706058df44455b17f84bff410cb30~tplv-k3u1fbpfcp-watermark.image?)

你会发现读取 patch 文件的代码，进入那个 readPatch 内部：

会发现它读取 patches 文件之后会进行 parse：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3199c89ccd34fed91dc751355be6d48~tplv-k3u1fbpfcp-watermark.image?)

这个 parse 的实现就是对每一行的字符串做判断，进行不同的处理：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2953808d0f2a4661a89b085845ba96af~tplv-k3u1fbpfcp-watermark.image?)

最终能得到一个包含 diff 信息的对象，包含了对什么文件的哪些行做了什么修改：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9da8e185631d4fbf85607daa54014226~tplv-k3u1fbpfcp-watermark.image?)

之后在 executeEffects 函数里对 patch 信息做了相应的处理：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf42eb0623404242a4186f5953ff3c90~tplv-k3u1fbpfcp-watermark.image?)

也就是根据不同的类型做了不同的操作：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/636f1b1a15c54329abdec349237b5002~tplv-k3u1fbpfcp-watermark.image?)

这样就把 patches 文件里的改动应用到了 node_modules 下的包里。

至此，我们通过调试 patch-package 源码理清了它的实现原理。

前面说 patch-pakckage 不支持 pnpm，其实 pnpm 内置 [patch](https://pnpm.io/cli/patch)、patch-commit 命令，作用和这个 patch-package 包一样。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90f58d7d35a5489c893029838f211208~tplv-k3u1fbpfcp-watermark.image?)

## 总结

当我们需要对 node_modules 下的代码做改动的时候，可以通过 patch-package xxx 生成 patches 文件，它可以被提交到 git 仓库，然后再拉下来的代码就可以通过 patch-package 来应用改动。

实现原理要分为两部分来看：

patches 文件的生成是在临时目录生成 package.json，下载依赖，生成一个 commit，然后把改动的代码复制过去，两者做 gif diff，就可以生成 patches 文件。

patches 文件的应用则是 patch-package 自己实现了它的 parse，拿到对什么文件的哪些行做什么修改的信息，之后根据不同做类型做不同的文件操作就可以了。

如果是 pnpm，那 patch-package 不支持，这时候用内置的 pnpm patch 命令就好了。

当然，更重要的是我们是通过自己调试源码来得出这些信息的，当你会调试源码之后，就可以自己去深入很多技术了。这也是为什么会调试源码是对工程师进阶很重要。
