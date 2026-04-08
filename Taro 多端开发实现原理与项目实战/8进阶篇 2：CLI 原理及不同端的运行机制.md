# CLI 原理及不同端的运行机制

taro-cli 负责 Taro 脚手架初始化和项目构建的的命令行工具，NPM 包的链接在这里：[@tarojs/cli](https://www.npmjs.com/package/@tarojs/cli) 。

## taro-cli 包

### Taro 命令

taro-cli 包位于 [Taro](https://github.com/NervJS/taro) 工程的 Packages 目录下，通过 `npm install -g @tarojs/cli` 全局安装后，将会生成一个 Taro 命令。主要负责项目初始化、编译、构建等。直接在命令行输入 Taro ，会看到如下提示：

``` bash
➜ taro
👽 Taro v0.0.63


  Usage: taro <command> [options]

  Options:

    -V, --version       output the version number
    -h, --help          output usage information

  Commands:

    init [projectName]  Init a project with default templete
    build               Build a project with options
    update              Update packages of taro
    help [cmd]          display help for [cmd]
```

里面包含了 Taro 所有命令用法及作用。

### 包管理与发布

首先，我们需要了解 taro-cli 包与 Taro 工程的关系。

将 Taro 工程 Clone 之后，可以看到工程的目录结构如下，整体结构还是比较清晰的：

``` bash
.
├── CHANGELOG.md
├── LICENSE
├── README.md
├── build
├── docs
├── lerna-debug.log
├── lerna.json        // Lerna 配置文件
├── package.json
├── packages
│   ├── eslint-config-taro
│   ├── eslint-plugin-taro
│   ├── postcss-plugin-constparse
│   ├── postcss-pxtransform
│   ├── taro
│   ├── taro-async-await
│   ├── taro-cli
│   ├── taro-components
│   ├── taro-components-rn
│   ├── taro-h5
│   ├── taro-plugin-babel
│   ├── taro-plugin-csso
│   ├── taro-plugin-sass
│   ├── taro-plugin-uglifyjs
│   ├── taro-redux
│   ├── taro-redux-h5
│   ├── taro-rn
│   ├── taro-rn-runner
│   ├── taro-router
│   ├── taro-transformer-wx
│   ├── taro-weapp
│   └── taro-webpack-runner
└── yarn.lock
```

[Taro](https://github.com/NervJS/taro) 项目主要是由一系列 NPM 包组成，位于工程的 Packages 目录下。它的包管理方式和 [Babel](https://github.com/babel/babel) 项目一样，将整个项目作为一个 monorepo 来进行管理，并且同样使用了包管理工具 [Lerna](https://github.com/lerna/lerna)。

> Lerna 是一个用来优化托管在 Git/NPM 上的多 package 代码库的工作流的一个管理工具，可以让你在主项目下管理多个子项目，从而解决了多个包互相依赖，且发布时需要手动维护多个包的问题。

> 关于 Lerna 的更多介绍可以看官方文档 [Lerna：A tool for managing JavaScript projects with multiple packages](https://lernajs.io/)。

Packages 目录下十几个包中，最常用的项目初始化与构建的命令行工具 [Taro CLI](https://github.com/NervJS/taro/tree/master/packages/taro-cli) 就是其中一个。在 Taro 工程根目录运行 `lerna publish` 命令之后，`lerna.json` 里面配置好的所有的包会被发布到 NPM 上。

### 目录结构

taro-cli 包的目录结构如下：

``` bash
./
├── bin        // 命令行
│   ├── taro              // taro 命令
│   ├── taro-build        // taro build 命令
│   ├── taro-update       // taro update 命令
│   └── taro-init         // taro init 命令
├── package.json
├── node_modules
├── src
│   ├── build.js        // taro build 命令调用，根据 type 类型调用不同的脚本
│   ├── config
│   │   ├── babel.js        // Babel 配置
│   │   ├── babylon.js      // JavaScript 解析器 babylon 配置
│   │   ├── browser_list.js // autoprefixer browsers 配置
│   │   ├── index.js        // 目录名及入口文件名相关配置
│   │   └── uglify.js
│   ├── creator.js
│   ├── h5.js       // 构建h5 平台代码
│   ├── project.js  // taro init 命令调用，初始化项目
│   ├── rn.js       // 构建React Native 平台代码
│   ├── util        // 一系列工具函数
│   │   ├── index.js
│   │   ├── npm.js
│   │   └── resolve_npm_files.js
│   └── weapp.js        // 构建小程序代码转换
├── templates           // 脚手架模版
│   └── default
│       ├── appjs
│       ├── config
│       │   ├── dev
│       │   ├── index
│       │   └── prod
│       ├── editorconfig
│       ├── eslintrc
│       ├── gitignore
│       ├── index.js    // 初始化文件及目录，copy模版等
│       ├── indexhtml
│       ├── npmrc
│       ├── pagejs
│       ├── pkg
│       └── scss
└── yarn-error.log
```

其中关键文件的作用已添加注释说明，大家可以先大概看看，有个初步印象。

通过上面的目录树可以发现，taro-cli 工程的文件并不算多，主要目录有：`/bin`、`/src`、`/template`，笔者已经在上面详细标注了主要的目录和文件的作用，至于具体的流程，咱们接下来再分析。

## 用到的核心库

- [tj/commander.js](https://github.com/tj/commander.js/) [Node.js](http://nodejs.org/) - 命令行接口全面的解决方案，灵感来自于 Ruby's [commander](https://github.com/commander-rb/commander)。可以自动的解析命令和参数，合并多选项，处理短参等等，功能强大，上手简单。
- [jprichardson/node-fs-extra](https://github.com/jprichardson/node-fs-extra) - 在 Node.js 的 fs 基础上增加了一些新的方法，更好用，还可以拷贝模板。
- [chalk/chalk](https://github.com/chalk/chalk) - 可以用于控制终端输出字符串的样式。
- [SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) - Node.js 命令行交互工具，通用的命令行用户界面集合，可以和用户进行交互。
- [sindresorhus/ora](https://github.com/sindresorhus/ora) - 实现加载中的状态是一个 Loading 加前面转起来的小圈圈，成功了是一个 Success 加前面一个小钩钩。
- [SBoudrias/mem-fs-editor](https://github.com/sboudrias/mem-fs-editor) - 提供一系列 API，方便操作模板文件。
- [shelljs/shelljs](https://github.com/shelljs/shelljs) - ShellJS 是 Node.js 扩展，用于实现 Unix shell 命令执行。
- [Node.js child_process](https://nodejs.org/api/child_process.html) - 模块用于新建子进程。子进程的运行结果储存在系统缓存之中（最大 200KB），等到子进程运行结束以后，主进程再用回调函数读取子进程的运行结果。

## Taro Init

Taro Init 命令主要的流程如下：

![image](https://user-gold-cdn.xitu.io/2018/10/8/16651547b6ddebe1?w=1354&h=466&f=png&s=51974)

### Taro 命令入口

当我们全局安装 taro-cli 包之后，我们的命令行里就有了 Taro 命令。

``` bash
$ npm install -g @tarojs/cli
```

那么 Taro 命令是怎样添加进去的呢？其原因在于 `package.json` 里面的 bin 字段：

```JavaScript
"bin": {
    "taro": "bin/taro"
  },
```

上面代码指定，Taro 命令对应的可执行文件为 bin/taro 。NPM 会寻找这个文件，在 `[prefix]/bin` 目录下建立符号链接。在上面的例子中，Taro 会建立符号链接 `[prefix]/bin/taro`。由于 `[prefix]/bin` 目录会在运行时加入系统的 PATH 变量，因此在运行 NPM 时，就可以不带路径，直接通过命令来调用这些脚本。

关于`prefix`，可以通过`npm config get prefix`获取。

``` bash
$ npm config get prefix
/usr/local
```

通过下列命令可以更加清晰的看到它们之间的符号链接：

``` bash
$ ls -al `which taro`
lrwxr-xr-x  1 chengshuai  admin  40  6 15 10:51 /usr/local/bin/taro -> ../lib/node_modules/@tarojs/cli/bin/taro
```

### Taro 子命令

上面我们已经知道 taro-cli 包安装之后，Taro 命令是怎么和 `/bin/taro` 文件相关联起来的， 那 Taro Init 和 Taro Build 又是怎样和对应的文件关联起来的呢？

#### 命令关联与参数解析

这里就不得不提到一个有用的包：[tj/commander.js](https://github.com/tj/commander.js/) ，[Node.js](http://nodejs.org/) 命令行接口全面的解决方案，灵感来自于 Ruby's [commander](https://github.com/commander-rb/commander)。可以自动的解析命令和参数，合并多选项，处理短参等等，功能强大，上手简单。具体的使用方法可以参见项目的 [README](https://github.com/SBoudrias/Inquirer.js)。

更主要的，commander 支持 Git 风格的子命令处理，可以根据子命令自动引导到以特定格式命名的命令执行文件，文件名的格式是 `[command]-[subcommand]`，例如：

``` bash
taro init => taro-init
taro build => taro-build
```

`/bin/taro` 文件内容不多，核心代码也就那几行 `.command()` 命令：

```JavaScript
#! /usr/bin/env node

const program = require('commander')
const {getPkgVersion} = require('../src/util')

program
  .version(getPkgVersion())
  .usage('<command> [options]')
  .command('init [projectName]', 'Init a project with default templete')
  .command('build', 'Build a project with options')
  .command('update', 'Update packages of taro')
  .parse(process.argv)

```
通过上面代码可以发现，`init`，`build`	，`update`等命令都是通过`.command(name, description)`方法定义的，然后通过 `.parse(arg)` 方法解析参数。具体可以查看 [Commander.js API 文档](http://tj.github.io/commander.js)。

> 注意第一行`#!/usr/bin/env node`，有个关键词叫 [Shebang](https://link.juejin.im/?target=http%3A%2F%2Fsmilejay.com%2F2012%2F03%2Flinux_shebang%2F)，不了解的可以去搜搜看。

### 参数解析及与用户交互

前面提到过，commander 包可以自动解析命令和参数，在配置好命令之后，还能够自动生成 help（帮助）命令和 version（版本查看） 命令。并且通过`program.args`便可以获取命令行的参数，然后再根据参数来调用不同的脚本。

但当我们运行 `taro init` 命令后，如下所示的命令行交互又是怎么实现的呢？

``` bash
$ taro init taroDemo
Taro 即将创建一个新项目!
Need help? Go and open issue: https://github.com/NervJS/taro/issues/new

Taro v0.0.50

? 请输入项目介绍！
? 请选择模板 默认模板
```

这里使用的是 [SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) 来处理命令行交互。

用法其实很简单：

```JavaScript
const inquirer = require('inquirer')  // npm i inquirer -D

if (typeof conf.description !== 'string') {
      prompts.push({
        type: 'input',
        name: 'description',
        message: '请输入项目介绍！'
      })
}
```

`prompt()`接受一个问题对象的数据，在用户与终端交互过程中，将用户的输入存放在一个答案对象中，然后返回一个`Promise`，通过`then()`获取到这个答案对象。

借此，新项目的名称、版本号、描述等信息可以直接通过终端交互插入到项目模板中，完善交互流程。

当然，交互的问题不仅限于此，可以根据自己项目的情况，添加更多的交互问题。`inquirer.js` 强大的地方在于，支持很多种交互类型，除了简单的`input`，还有`confirm`、`list`、`password`、`checkbox`等，具体可以参见项目的工程 [README](https://github.com/SBoudrias/Inquirer.js)。

此外，你在执行异步操作的过程中，还可以使用 [sindresorhus/ora](https://github.com/sindresorhus/ora) 来添加一下 Loading 效果。使用 [chalk/chalk](https://github.com/chalk/chalk)  给终端的输出添加各种样式。

### 模版文件操作

最后就是模版文件操作了，主要分为两大块：

- 将输入的内容插入到模板中
- 根据命令创建对应目录结构，copy 文件
- 更新已存在文件内容

这些操作基本都是在 `/template/index.js ` 文件里。

这里还用到了 [shelljs/shelljs](https://github.com/shelljs/shelljs)  执行 shell 脚本，如初始化 Git： `git init`，项目初始化之后安装依赖 `npm install`等。

#### 拷贝模板文件

拷贝模版文件主要是使用  [jprichardson/node-fs-extra](https://github.com/jprichardson/node-fs-extra) 的 `copyTpl()`方法，此方法使用 `ejs` 模板语法，可以将输入的内容插入到模版的对应位置：

```JavaScript
this.fs.copyTpl(
  project,
  path.join(projectPath, 'project.config.json'),
  {description, projectName}
);
```

#### 更新已经存在的文件内容

 更新已经存在的文件内容是很复杂的工作，最可靠的方法是把文件解析为`AST`，然后再编辑。一些流行的 `AST parser` 包括：

- `Cheerio`：解析`HTML`。
- `Babylon`：解析`JavaScript`。
- 对于`JSON`文件，使用原生的`JSON`对象方法。

使用 `Regex` 解析一个代码文件是「邪道」，不要这么干，不要心存侥幸。

## Taro Build

`taro build` 命令是整个 Taro 项目的灵魂和核心，主要负责**多端代码编译**（H5，小程序，React Native 等）。

Taro 命令的关联，参数解析等和 `taro init` 其实是一模一样的，那么最关键的代码转换部分是怎样实现的呢？

这一部分内容过于庞大，需要单独拉出来一篇讲。不过这里可以先简单提一下。

### 编译工作流与抽象语法树（AST）

Taro 的核心部分就是将代码编译成其他端（H5、小程序、React Native 等）代码。一般来说，将一种结构化语言的代码编译成另一种类似的结构化语言的代码包括以下几个步骤：

![image](https://user-gold-cdn.xitu.io/2018/10/8/166515483b7fa7c0?w=880&h=228&f=png&s=30011)

首先是 Parse，将代码解析（Parse）成抽象语法树（Abstract Syntex Tree），然后对 AST 进行遍历（traverse）和替换(replace)（这对于前端来说其实并不陌生，可以类比 DOM 树的操作），最后是生成（generate），根据新的 AST 生成编译后的代码。

### Babel 模块 

Babel 是一个通用的多功能的 `JavaScript `编译器，更确切地说是源码到源码的编译器，通常也叫做转换编译器（transpiler）。 意思是说你为 Babel 提供一些 JavaScript 代码，Babel 更改这些代码，然后返回给你新生成的代码。

 此外它还拥有众多模块可用于不同形式的静态分析。

> 静态分析是在不需要执行代码的前提下对代码进行分析的处理过程（执行代码的同时进行代码分析即是动态分析）。 静态分析的目的是多种多样的， 它可用于语法检查、编译、代码高亮、代码转换、优化和压缩等等场景。

 Babel 实际上是一组模块的集合，拥有庞大的生态。Taro 项目的代码编译部分就是基于 Babel 的以下模块实现的：

- [Babylon](https://github.com/babel/babylon) - Babel 的解析器。最初是从 Acorn 项目 fork 出来的。Acorn 非常快，易于使用，并且针对非标准特性(以及那些未来的标准特性) 设计了一个基于插件的架构。
- [Babel-traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse) - 负责维护整棵树的状态，并且负责替换、移除和添加节点。
- [Babel-types](https://github.com/babel/babel/tree/master/packages/babel-types) - 一个用于 AST 节点的 Lodash 式工具库， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理 AST 逻辑非常有用。
- [Babel-generator](https://github.com/babel/babel/tree/master/packages/babel-generator) - Babel 的代码生成器，它读取 AST 并将其转换为代码和源码映射（sourcemaps）。
- [Babel-template](https://github.com/babel/babel/tree/master/packages/babel-template) - 另一个虽然很小但却非常有用的模块。 它能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成大规模 AST 的时候。 在计算机科学中，这种能力被称为准引用（quasiquotes）。

### 解析页面 Config 配置

在业务代码编译成小程序的代码过程中，有一步是将页面入口 JS 的 Config 属性解析出来，并写入 `*.json ` 文件，供小程序使用。那么这一步是怎么实现的呢？这里将这部分功能的关键代码抽取出来：

``` JavaScript
// 1. babel-traverse方法， 遍历和更新节点
traverse(ast, {  
  ClassProperty(astPath) { // 遍历类的属性声明
    const node = astPath.node
    if (node.key.name === 'config') { // 类的属性名为 config
      configObj = traverseObjectNode(node)
      astPath.remove() // 将该方法移除掉
    }
  }
})

// 2. 遍历，解析为 JSON 对象
function traverseObjectNode(node, obj) {
  if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
    const properties = node.value.properties
      obj = {}
      properties.forEach((p, index) => {
        obj[p.key.name] = traverseObjectNode(p.value)
      })
      return obj
  }
  if (node.type === 'ObjectExpression') {
    const properties = node.properties
    obj = {}
    properties.forEach((p, index) => {
      // const t = require('babel-types')  AST 节点的 Lodash 式工具库
      const key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      obj[key] = traverseObjectNode(p.value)
    })
    return obj
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item))
  }
  if (node.type === 'NullLiteral') {
    return null
  }
  return node.value
}

// 3. 写入对应目录的 *.json 文件
fs.writeFileSync(outputPageJSONPath, JSON.stringify(configObj, null, 2))

```

从以上代码的注释中，可以清晰的看到，通过以上三步，就可以将工程里面的 Config 配置转换成小程序对应的 JSON 配置文件。

但是，哪怕仅仅是这一小块功能点，真正实现起来也没那么简单，你还需要考虑大量的真实业务场景和极端情况：

- 应用入口 app.js 和页面入口 index.js 的 Config 是否单独处理？
- TabBar 配置怎样转换且保证功能及交互一致？
- 用户的配置信息有误怎么处理？

想了解更多 Taro 编译的相关实现，可以查阅第 11-12 章《[Taro 实现 JSX 转换小程序模板](https://juejin.im/book/5b73a131f265da28065fb1cd/section/5b74ec276fb9a009b16d4933)》。

## Taro Update

`taro update` 命令主要是为了方便大家更新 taro-cli 及 Taro 相关的依赖包，在命令行直接输入`taro update` 的命令，便可以得到如下的提示：

``` bash
taro update
👽 Taro v0.0.70

命令错误:
taro update self 更新 Taro 开发工具 taro-cli 到最新版本
taro update project 更新项目所有 Taro 相关依赖到最新版本...
```

通过上面的提示可以看到，`taro update` 现在仅支持两个子命令，原理和 `taro init` 类似，第一个命令其实等同于如下命令：

 ``` bash
 npm i -g @tarojs/cli@latest
 或
 yarn global add @tarojs/cli@latest
 ```

第二个命令稍微复杂点，不过代码也十分易懂，无非就是如下三步：

1. 获取 Taro 的最新版本
2. 更新项目 package.json 里面的 Taro 依赖信息到最新版本
3. 运行 `npm install`

## 小结

到此，`taro-cli` 的主要目录结构、命令调用和项目初始化方式等基本都捋完了，有兴趣的同学可以结合着工程的源代码自己捋一遍，应该不会太费劲。

