> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/learn-notebook-basic.ipynb

工欲善其事，必先利其器。 LLM 的开发跟传统的项目开发区别在于，LLM 很多请求是耗时甚至是耗钱的，基础的如调用 OpenAI API，每次都会消费一定的 token。  

另外，我们可能会反复调试一段代码来测试最合适的参数和 prompt，如果我们像传统 nodejs 程序一样每次都从头重新跑一次，既耗时也花费比较多。所以我们需要使用适合机器学习和大模型领域的专用开发工具。


## Deno 和 Jupyter Notebook

在正式介绍 Jupyter Nodebook 之前，我们先介绍一下 Deno，我相信大家或多或少听说过 Deno，他是 Node.js 之父 Ryan Dahl 创建的新项目。更多的介绍可以看 Deno 的官网，一句话介绍，Deno 是把 nodejs 中分散的生态整合在一起，并提供更现代的框架支持。 例如 Deno 开箱支持 TypeScript、自带格式化工具、自带测试框架、高质量的标准库，并且有比较好的安全性，默认脚本不能访问文件、环境或者网络 等等好用的功能。

可以理解成一个更强的 Nodejs，当然 Deno 不是我们小册的重点，你会 nodejs 就会 deno，并且获得了很多 nodejs 需要配置才能使用的功能。

在了解完了 Deno 后，我们将学习在 AI 领域比较常用的工具 — Jupyter Notebook，我们少废话，先看演示。

```ts
const text = await Deno.readTextFile("./people.json");
```

![CleanShot 2024-03-18 at 21.46.36@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91e59b5d479c49c29770861e8088114e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2516\&h=460\&s=84745\&e=png\&b=f8f8f8)

Jupyter Notebook 的核心是代码块，每个代码块作为一个整体去执行，并且可以多次反复执行。在代码快的左侧，是执行顺序的标记，指这个代码块被执行的顺序。 

例如，如果你先执行第一个代码块，它会显示数字 1；接着执行第二个代码块，它会显示数字 2；然后你再执行代码块 1，它的左侧就会显示数字 3。

也就是这个数字显示的是当前块被执行的顺序，这个数字存在的目的是帮助你跟踪代码块的执行顺序，并且在执行过程中保持清晰的状态。

这个理解起来有点怪，我们用 code demo 测试一下，我们在第二块中显示变量 text

![CleanShot 2024-03-18 at 21.57.45@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/090c646b45dc4562b11b24002b7cf219~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2500\&h=520\&s=119190\&e=png\&b=f9f9f9)

在 Jupyter NoteBook 中，如果一个代码快只有一个变量，那就会自动把该变量显示出来，类似于 `console.log(单个变量)` 但又不一样，其中有些微妙的区别在使用中你会感受出来。

所以，当运行完两个代码块之后，在 js 的环境中有了 text 这个变量。我们可以把这里的从 txt 文件读内容理解成一个耗时又耗钱的任务（就像 OpenAI API 一样），在运行完这个任务后，就会把结果储存在 text 中，后续就可以对 text 做任何测试，而不需要重复的从文件中读取。

例如，我们可以对 text 进行切割

![CleanShot 2024-03-18 at 22.17.58@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15ff9a5118dd48b796deaaafba52b8fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1946\&h=1284\&s=399655\&e=png\&b=fafafa)

如果我们对切割的结果不满意，可以调整切割的方式，

![CleanShot 2024-03-18 at 22.18.36@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d99ef1b62c1c47f6864a3200c0349c4c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1932\&h=1164\&s=398671\&e=png\&b=fcfcfc)
可以看到，再次运行第三个单元格两次后，左侧的数字就变成了 4。

**注意**，如果上游数据发生了改变，下游并不会自动的更新或者重新运行，例如我们这里手动修改 text 的值改成一个字符串。

![CleanShot 2024-03-18 at 22.21.05@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bad03f3eae54f5e92a88771468696b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1298&h=482&s=53656&e=png&b=f8f8f8)

可以看到，后面依赖于 text 的代码格并没有自动更新，需要自己手动重新运行：

![CleanShot 2024-03-18 at 22.20.26@2x.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/546c3bfb6acc4c418b761fbbe555a5a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1978&h=1242&s=410234&e=png&b=fbfbfb)
之所以叫 Notebook 是因为天然支持 markdown，我们新建一个块，然后设置为 markdown 块：

![CleanShot 2024-03-19 at 11.37.55@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e83f072f11cb4eeab2bfb16d2589da60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2466\&h=1364\&s=442699\&e=png\&b=fafafa)

![CleanShot 2024-03-19 at 11.39.34@2x.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc1e5c15f06c4d6691effb1237a00dce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=348\&h=138\&s=6667\&e=png\&b=f6f6f6)

在运行之后，就会渲染出来：

![转存失败，建议直接上传图片文件](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96bcc389c60b4e09ab11d6865dc90b36~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=548&h=224&s=8486&e=png&b=f8f8f8)

有了 Jupyter NoteBook，我们就可以节约 费事/费钱 的请求，并且基于某个运行结果的输出，在后面的代码块中，不断尝试各种解析或者处理方式。同时，也非常方便结合 markdown 来做一些笔记，获得比在注释里记录更方便的学习体验。

## 配置

Jupyter Notebook 项目开始以 python 为主，后续 deno 提供了 js/ts Kernel 的支持，所以我们需要分别安装这两个。这里以 Mac 环境演示，如果是 win/linux 可以参考后附的链接进行安装。

首先我们需要本地有 python 环境，最好是 3.9 及以上的 python 环境。在配置好 python 环境后，然后安装 Jupyter Notebook：

```bash
pip install notebook
```
如果你本地 python3 的 pip 别名是 pip3，那就需要：
```bash
pip3 install notebook
```

然后在本地安装 Deno 环境：

```bash
curl -fsSL https://deno.land/install.sh | sh
```

安装完毕 Deno 环境后，使用 deno 为 Jupyter Notebook 配置 kernel：

```bash
deno jupyter --unstable --install
```

然后通过运行以下命令，验证 kernel 是否配置完成：

```bash
deno jupyter --unstable
```

显示以下即为配置成功：

![CleanShot 2024-03-19 at 11.27.05@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dce9d4a5aadb4ebab65bee32fe37dcef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=76&s=21117&e=png&b=282a35)

然后我们运行以下命令启动 notebook：

```bash
jupyter notebook
```

然后就会自动打开一个网页，然后我们就可以正常使用 notebook 了。

目前 deno kernel 的 Jupyter Notebook 不支持代码提示，所以写代码会难受一点，大家可以安装 vscode 插件，使用 vscode 去编辑和运行 notebook。

![CleanShot 2024-03-19 at 11.43.55@2x.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3baab1c70c640859a1f5a59d4db0b15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1622&h=474&s=80529&e=png&b=ffffff)

<https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter>

![CleanShot 2024-03-19 at 11.45.39@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ef268044b274a44a80292f8408afe74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1906&h=966&s=236841&e=png&b=23262c)
记得在右上角切换 Kernel 为 Deno, 如果切换 Kernel 遇到问题，可以参考文档: https://code.visualstudio.com/docs/datascience/jupyter-kernel-management

目前在 VSCode 里的体验也有问题，会因为识别不了 Deno 的引用在代码上显示出错的样式（这个在之后的代码中也会遇到），但不影响正常运行，可以忽略代码里的飘红即可。

具体用什么编辑方式书写 notebook 可以根据自己的喜好。

安装参考链接：

1.  <https://www.python.org/downloads/>

2.  <https://docs.deno.com/runtime/manual/>

3.  <https://docs.deno.com/runtime/manual/tools/jupyter>

4.  <https://jupyter.org/install>

5.  <https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter>


## Deno 依赖管理

Deno 直接从远程拉取依赖，自带缓存机制，而不需要本地安装，例如我们如果需要 lodash 库，我们不需要像 nodejs 一样使用 npm/yarn 等来安装依赖，而是可以直接从远程引入：

```js
import _ from "npm:/lodash
```
如果我们需要锁定版本，则可以：

```js
import _ from "npm:/lodash@4.17.21"
```

这个命令，就会让 deno 从 npm 找到对应的 lodash 包，然后引入，我们就可以在另一个代码块中使用引入后的`_`，比如：

```js
const a = _.random(0, 5);
a
```
![CleanShot 2024-03-19 at 21.58.38@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/986a47dc02934611990cbcb4f3e350b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=728&h=286&s=27002&e=png&b=fafafa)


当然，我们每次都这样使用完整的链接引入就会比较麻烦，所以我们可以在顶层创建一个文件 `deno.json` 来给设置别名

在跟 notebook 文件同级创建一个 `deno.json` 文件：
```
- 1-test-notebook.ipynb
- deno.json
```

然后填写其中的内容为：

```js
{
  "imports": {
    "lodash": "npm:/lodash@4.17.21"
  },
  "deno.enable": true
}
```

这里内容比较好理解，就是将 ` "npm:/lodash@4.17.21"` 的别名设置为 `lodash`，其中`"deno.enable": true` 是如果你用了 deno 的 vscode 插件，可以让它识别到，并对 deno 在 vscode 体验的一些优化。

设置完毕后，我们就可以使用别名在 deno 中引入 lodash 了：

```js
import _ from "lodash"

const a = _.random(0, 5);
a
```

注意，如果你更新了 `deno.json` 需要重启 notebook 的内核才能让 deno 拿到最新的别名：

![CleanShot 2024-03-19 at 22.05.50@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dc5ad42d5a34358a260d297499c0107~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=220&s=50240&e=png&b=fafafa)

这里，我们只介绍了足够本教程使用 Deno 依赖管理，[更多信息可以参考](https://docs.deno.com/runtime/manual/basics/modules/)。


## 小结

这一节，我们学习了 在机器学习领域中常用的工具 Jupyter Notebook，这也是我们迈向专业 AI 的一步。你可以看到在 github 中，很多知名的 AI 论文开源的 demo 入口都是一个 Jupyter Notebook，其在 AI 这场景中有不可替代的优势。

当然，Deno + Jupyter Notebook 这一套工具只是**可选**的，即使不配置也可以正常学习后续的课程，只需要将后续教程中**部分 Deno 专有的 API 替换成 Node.js 对应的 API 即可**。   

我个人建议是尝试一下 Deno，这可能是未来 js 在后端的风向，目前后端的各种 js 运行时在打架，可以都把玩看看，跟 nodejs 对比一下。而且，使用 Jupyter Notebook 在学习 AI 相关技术时确实十分方便，也是专业 AI 开发时会使用的工具。
