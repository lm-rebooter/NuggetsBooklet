上一节课，我们介绍了 Node.js 的模块管理。Node.js 遵循`ES Modules`和`CommonJS`规范来组织模块。那为什么还要有包管理工具 NPM 呢？NPM 又有什么作用呢？

## 什么是 NPM？

NPM 的全称是`Node Package Manager`，是一个将 Node.js 的模块以包的形式组织和管理的工具。

Node.js 的模块大体上分为内置模块和其他模块，内置模块是 Node.js 默认集成的模块，它们不需要引用 JS 外部文件，而是通过`import`或`require`模块名引入。

Node.js 提供了一个叫`module`的内置模块，该模块包含了 Node.js 模块管理的信息，我们可以通过它获得当前版本的 Node.js 中的所有内置模块。

我们创建一个`show_builtins.js`的文件，代码如下：

```js
// show_builtins.js
const {builtinModules} = require('module');
console.log(builtinModules);
```

然后我们运行`node show_builtins.js`，就能显示所有内置模块名的信息：

![](https://p2.ssl.qhimg.com/t018851f49e0a0d35d9.jpg)

我们看到，Node.js 有数十个内置模块，其中有一些常用的，比如 console、fs、http 等等，我们在后续的课程中会详细介绍。这里我们只需要知道，通过模块名，我们就能将它们引入我们自己的模块中。

比如 fs 模块是文件操作相关的模块，我们通过下面的代码就可以引入它，用它来操作文件。

```js
const fs = require('fs');
```

那么除了这些内置的模块外，其他的模块有两种方式可以引入，一种是通过文件路径引入。假设张三写的`foo.js`，放在项目的`a`子目录下，李四写的`bar.js`文件，放在`b`子目录下。如果李四要引入张三的`foo.js`，那就要在`bar.js`文件中用路径来加载：

```js
const bar = require('../a/foo.js');
```

如果一个项目要引入非常多的模块，人工维护这些模块的目录，是一件繁琐且容易出错的工作。另外，如果张三写的文件想提供给互联网上更多的人使用，这些人自己去下载并将文件拷贝到项目的目录下也很麻烦。**所以，Node.js 提供了一个包管理工具，能够让我们以包的形式发布某个或某些模块到网络上的共享仓库中。** 这样，其他的人只要知道包名，就可以用包管理工具的命令将这个模块安装到自己的项目中（默认安装到项目的 node_modules 目录），然后在自己的代码中用包名来引入模块。这样既方便，又不会出错。这个工具就是NPM。

接下来我们来看一下如何使用 NPM。

## 用 NPM 安装模块包

在 Node.js 安装的时候，其实就已经内置了 NPM。我们可以用 npm 命令来执行我们期望的操作。

```bash
$ npm -v
8.11.0
```

如上面代码，npm -v 可以显示 NPM 的版本号，比如当前版本是 8.11.0。

用`npm install 包名`，就可以安装我们希望安装的包。具体要安装哪个包，可以根据我们项目的需求，从`npmjs.org`网站或者 [GitHub](https://github.com) 上找到符合我们需要的包。

假如，我们要做一个处理日期时间的应用，我们可能需要安装`moment.js`，那我们就可以在项目的目录下安装它。不过在安装之前，我们最好先在项目下初始化一下配置。

```bash
$ npm init -y
```

我们可以用`npm init -y`命令快速生成一份配置。它会在项目目录下生成一个 pacakge.json 文件，内容如下：

```json
{
  "name": "examples",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

前面的课程里我们提到过 package.json 文件，我们通过将它的`type`属性设置为`moudle`来允许 Node.js 采用`ES Modules`规范处理 .js 文件。这里，我们先不解释生成的这个文件的字段名，继续安装我们想要安装的`moment.js`包：

```bash
npm install moment --save
```

`moment.js`库的包名就叫做`moment`，所以我们运行上面的`npm install`命令。

![](https://p4.ssl.qhimg.com/t01826a7ad21252cf89.jpg)

如果没有异常的话，很快就安装完成，并给出安装的模块的版本信息。这里我们安装的`moment.js`版本是`2.24.0`。你可能注意到了，我们执行`npm install`的时候加了一个`--save`参数，这个参数会在包安装成功后自动修改`pacakge.json`文件，在其中的`dependencies`属性中增加安装的包的名字和版本信息。

```json
{
  "name": "examples",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.24.0"
  }
}
```

如上所示，package.json 文件已经被修改了，多了`dependencies`内容。这样做的好处是，当我们将项目交给其他人维护或者迁移到新的机器，要重新安装项目依赖的包时就不需要一一输入要安装的包名了，只需要在项目目录下直接输入不带参数的命令`npm install`，NPM 会自动根据`package.json`中的`dependencies`内容安装对应的依赖包。如果我们将自己的模块发布到 NPM 上，其他用户安装我们的模块时，NPM 也自动根据`dependencies`中的内容自动安装依赖的包。

现在`moment.js`已经安装完成了，它被安装到我们项目目录下的`node_modules`子目录中，我们可以在`node_modules`中找到`moment`子目录，里面就是我们安装的模块。如果我们安装的模块还依赖其他模块，这些模块也会被同时安装到`node_modules`目录下。

接下来，我们在项目的目录或者**任意子目录**中，都可以通过包名`moment`来引入模块。

```js
const moment = require('moment');
console.log(moment().format());
// 2020-03-16T22:20:16+08:00
```

当我们通过包名引入模块时，`Node.js`会根据规则搜索模块所在的位置，它优先搜索当前目录下的`node_modules`目录，如果找不到，会递归向上搜索父级目录，直到找到或者到达操作系统的根目录为止。

## 全局安装带命令行的包

有一些 Node.js 的模块包提供了在终端执行的指令，允许用户在终端执行命令行脚本。比如，Webpack、ESLint、Babel 这些库都提供了 cli 脚本，安装了它们的用户可以使用 cli 脚本命令来执行对文件的处理。

如果在命令行终端要能够执行脚本命令，我们需要将它们安装到系统目录中，这样我们就可以用 npm 命令的参数`-g`，来指定将模块安装到系统目录中（一般是操作系统默认的 Node 安装目录）。这个时候，我们在命令行终端就可以直接执行这些库的命令。

例如，我们安装 eslint 模块，在《[前端工程师进阶 10 日谈](https://juejin.cn/book/6891929939616989188/section)》课程中，我们曾经介绍过这是一个对 JS 进行语法和书写规范检查的工具，它提供一个 eslint 命令。要在命令行终端能够执行 eslint 命令，我们可以将它安装到系统目录中：

```bash
npm -g install eslint
```

这样，我们就能在任何我们想要做 JS 代码检查的目录下执行 eslint 命令了。

比如我们对 ziyue.js 进行检查。可以先到项目目录下，执行`eslint --init`命令，初始化一份 .eslintrc.js 配置。

![](https://p2.ssl.qhimg.com/t019486c2e074fb71c3.jpg)

然后执行命令：

```bash
eslint ziyue.js
```

![](https://p0.ssl.qhimg.com/t0113421b8ad1c30735.jpg)

这时命令行终端就会输出检查结果。这个结果包括 4 个书写错误，因为我们默认配置了 Standard 规范来检查 JS，而 Standard 是采用让引擎自动补全分号的书写风格，而且文件最末尾要保留一个空行。

关于 eslint 的使用，我们会在本课程工程化的部分再进行深入讨论。

## NPM Scripts

如果我们不想将模块包安装在系统目录下，只想在当前项目目录下执行脚本命令，也可以不用`-g`参数全局安装，而是安装到当前`node_modules`目录。此时，我们直接在命令行下执行脚本命令是不行的，操作系统不能识别这个命令，但我们可以借助 NPM Scripts 来执行它。

NPM Scripts 是指在`package.json`文件中配置`scripts`属性，在其中指定脚本命令：

```json
// package.json
{
  ... //其他配置
  "scripts": {
    "eslint": "eslint ziyue.js"
  }
}
```

上面的代码表示，在 ziyue 项目目录下的`package.json`文件中的`script`下，添加`eslint`命令。这样我们就可以在 ziyue 目录下通过`npm run eslint`来执行对应的命令。这个时候，我们不必将 eslint 通过 `-g` 安装到系统目录，直接安装在当前项目的`node_modules`目录下即可。

NPM Scripts 能够执行对应的 Node 命令，是因为 NPM 在安装模块的时候，不仅将模块自身安装到`node_modules`目录下，还会在`node_modules`目录下创建一个`.bin`的子目录，将模块包中的命令行脚本安装到`.bin`目录下，并在 NPM Script 执行时设置系统的环境变量 PATH 包含`node_modules/.bin`目录，这样就能够正常执行脚本了。

也就是说，当我们执行：

```bash
npm run eslint
```

就相当于执行了：

```bash
node ./node_modules/.bin/eslint ziyue.js
```

那我们自己该如何编写可以用命令行执行的 Node.js 脚本呢？别着急，这个内容在工程化部分会讲到，在实现自己的工程化脚手架时我们会详细的讨论。

## NPM 特殊命令 start、test、publish

大多数 NPM Scripts 命令都需要使用`npm run 命令名`来执行，但是少部分特殊名字的命令，可以省略`run`，直接用`npm 命令名`来执行。**常见的是`start`和`test`命令**。`start`命令通常用来启动项目，比如我们开发 Web 项目的时候，通常配置`start`命令来启动开发环境下的 HTTP 服务器。`test`命令通常用来配置项目的单元测试，启动单元测试框架，运行测试案例（test case）。

另外一些不在`NPM Scripts`中的命令，可以用来执行 NPM 自身的指令，如`npm install`命令，这是用来安装模块的指令，还有`npm init`命令，用来创建默认的`package.json`配置。其他常用的命令还有`npm publish`，用来发布或更新我们自己的模块包到 NPM 服务器。

这里我们要注意，这些 NPM 自身的指令不带`run`，但如果我们在`scripts`属性中定义同名的指令也可以。比如我们可以定义一个叫做`install`的`NPM Scripts`:

```json
{
  ...
  "scripts": {
    "install": "do something"
  }
}
```

这个时候，我们运行`npm run install`就是运行这个 scripts 命令而不是默认的`npm install`命令。

## 总结

NPM 是 Node.js 提供的一个包管理工具，它允许我们以包的形式从共享仓中发布和下载模块。这一节课，我们介绍了 npm 安装包的几种命令形式：

- `npm install`表示 NPM 会根据`package.json`中的`dependencies`内容安装对应的依赖包；

- `npm install 包名 --save`表示将包安装到项目的 node_modules 目录下，同时在 package.json 的`dependencies`属性中增加安装的包的名字和版本信息；

- `npm -g install 带命令行的包` 表示需要将这个包安装到系统目录中，这样我们就能在命令行终端运行这个包中的命令。

如果我们不想将带命令行的包安装在系统目录中，我们必须将这包中的命令配置在 package.json 中的`script`中，然后我们才能在项目的目录下通过`npm run 指令名`运行这个包中的命令。

下一节课，我们将学习 Node.js 重要的内置模块：文件 I/O 模块，并用它来实际开发一个有趣的项目：文章生成器。