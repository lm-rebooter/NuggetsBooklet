# 1.1 初识 npm script

首先介绍创建 package.json 文件的科学方法，目标是掌握 npm init 命令。然后，通过在终端中运行自动生成的 test 命令，详细讲解 npm 脚本基本执行流程。 然后，动手给项目增加 eslint 命令，熟悉创建自定义命令的基本流程。

## 用 npm init 快速创建项目

开始探索 npm script 之前，我们先聊聊这些 scripts 所依赖的文件 package.json，以它为基础的 npm 则是 node.js 社区蓬勃发展的顶梁柱。

npm 为我们提供了快速创建 package.json 文件的命令 npm init，执行该命令会问几个基本问题，如包名称、版本号、作者信息、入口文件、仓库地址、许可协议等，多数问题已经提供了默认值，你可以在问题后敲回车接受默认值：

```text
package name: (hello-npm-script)
version: (0.1.0)
description: hello npm script
entry point: (index.js)
test command:
git repository:
keywords: npm, script
license: (MIT)
```

上面的例子指定了描述（description）和关键字（keywords）两个字段，基本问题问完之后 npm 会把 package.json 文件内容打出来供你确认：

```json
{
  "name": "hello-npm-script",
  "version": "0.1.0",
  "description": "hello npm script",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "npm",
    "script"
  ],
  "author": "wangshijun <wangshijun2010@gmail.com> (https://github.com/wangshijun)",
  "license": "MIT"
}
```

按回车确认就能把package.json 的内容写到文件系统，如果要修改 package.json，可以直接用编辑器编辑，或者再次运行 npm init，npm 默认不会覆盖修改里面已经存在的信息。

> **TIP#1**: 嫌上面的初始化方式太啰嗦？你可以使用 npm init -f（意指 --force，或者使用 --yes）告诉 npm 直接跳过参数问答环节，快速生成 package.json。

初始化 package.json 时的字段默认值是可以自己配置的，细心的同学可能已经发现，我上面的默认版本号是 0.1.0，而 npm 默认的版本号是 0.0.1，可以用下面的命令去修改默认配置：

```shell
npm config set init.author.email "wangshijun2010@gmail.com"
npm config set init.author.name "wangshijun"
npm config set init.author.url "http://github.com/wangshijun"
npm config set init.license "MIT"
npm config set init.version "0.1.0"
```

> **TIP#2**: 将默认配置和 -f 参数结合使用，能让你用最短的时间创建 package.json，快去自己试试吧。

严肃的工程师都会使用 Git 对源代码进行版本管理，在 npm init 的基础上，你可以使用 git init 来初始化 git 仓库，不再展开。

纸上得来终觉浅，想掌握 npm script，请打开终端，执行下列命令：

```shell
cd ~
mkdir hello-npm-script && cd $_
npm init
npm init -f
```

**执行上面第 3、4 行命令时结果是否符合预期？如果不符合预期，请在下面留言，或者在读者群里反馈。**

## 用 npm run 执行任意命令

使用 npm init 创建的 package.json 文件中包含了 scripts 字段：

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

在终端中运行 npm run test，能看到 Error: no test specified 的输出。npm run test 可以简写为 npm test，或更简单的 npm t，得到的结果是几乎相同的。npm test 顾名思义，就是运行项目测试，实际用法在实战环节会有介绍。

和 test 类似，start 也是 npm 内置支持的命令，但是需要先在 scripts 字段中声明该脚本的实际内容，如果没声明就执行 npm start，会直接报错。如下图所示：

![](https://user-gold-cdn.xitu.io/2017/11/25/15ff0b3414194277?w=805&h=112&f=png&s=26451)

那么，npm 是如何管理和执行各种 scripts 的呢？作为 npm 内置的核心功能之一，npm run 实际上是 npm run-script 命令的简写。当我们运行 npm run xxx 时，基本步骤如下：

1. 从 package.json 文件中读取 scripts 对象里面的全部配置；
1. 以传给 npm run 的第一个参数作为键，本例中为 xxx，在 scripts 对象里面获取对应的值作为接下来要执行的命令，如果没找到直接报错；
1. 在系统默认的 shell 中执行上述命令，系统默认 shell 通常是 bash，windows 环境下可能略有不同，稍后再讲。

注意，上面这是简化的流程，更复杂的钩子机制后面章节单独介绍。

举例来说，如果 package.json 文件内容如下：

```json
{
  "name": "hello-npm-script",
  "devDependencies": {
    "eslint": "latest"
  },
  "scripts": {
    "eslint": "eslint **.js"
  }
}
```

如果不带任何参数执行 npm run，它会列出可执行的所有命令，比如下面这样：

```shell
Available scripts in the myproject package:
  eslint
    eslint **.js
```

如果运行 npm run eslint，npm 会在 shell 中运行 eslint **.js。

有没有好奇过上面的 eslint 命令是从哪里来的？其实，npm 在执行指定 script 之前会把 node_modules/.bin 加到环境变量 $PATH 的前面，这意味着任何内含可执行文件的 npm 依赖都可以在 npm script 中直接调用，换句话说，你不需要在 npm script 中加上可执行文件的完整路径，比如 `./node_modules/.bin/eslint **.js`。

## 创建自定义 npm script

知道如何运行 npm script 之后，接下来我们在 hello-npm-script 项目中添加有实际用途的 eslint 脚本，[eslint](https://eslint.org) 是社区中接受度比较高的 javascript 风格检查工具，有大把现成的规则集可供你选择，比如 [google](https://github.com/google/eslint-config-google)、 [airbnb](https://www.npmjs.com/package/eslint-config-airbnb)。

在新项目或者任何现有项目中添加 eslint 自定义脚本的步骤如下：

### 1. 准备被检查的代码

要做代码检查，我们必须有代码，创建 index.js 文件，输入如下内容：

```javascript
const str = 'some value';

function fn(){
    console.log('some log');
}
```

### 2. 添加 eslint 依赖

执行如下命令将 eslint 添加为 devDependencies：

```shell
npm install eslint -D
```

### 3. 初始化 eslint 配置

用 eslint 做检查需要配置规则集，存放规则集的文件就是配置文件，使用如下文件生成配置文件：

```shell
./node_modules/.bin/eslint --init
```

> **TIP#3**: 把 eslint 安装为项目依赖而非全局命令，项目可移植性更高。

在命令行提示中选择 Answer questions about your style，如下图回答几个问题，答案可以根据自己的偏好：

![](https://user-gold-cdn.xitu.io/2017/11/25/15ff0b3ab69913bd?w=998&h=264&f=png&s=75959)

回车后根目录下就有了 .eslintrc.js 配置文件：

```javascript
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 4],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
```

### 4. 添加 eslint 命令

在 package.json 的 scripts 字段中新增命令 eslint：

```json
{
  "scripts": {
    "eslint": "eslint *.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
}
```

**手动修改 package.json 时一定要注意语法正确。**

### 5. 运行 eslint 命令

执行 npm run eslint，可以看到，按照官方推荐规则代码里有 3 处不符合规范的地方：

![](https://user-gold-cdn.xitu.io/2017/11/25/15ff0b3dd4c03103?w=783&h=271&f=png&s=49211)

------------------------------------------

如果读到这里，相信你已经完成 npm script 上手，接下来我们去探索更高级的话题。

------------------------------------------

## 20171205 增补：eslint 完成 react、vue.js 代码的检查

如果需要结合 eslint 检查主流前端框架 react、vue.js，下面提供两条线索，因为官方仓库的 README 就可以作为入门文档，仔细读读相信绝大多数同学都能配置好。

使用 [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) 检查 react 代码，使用 [react-plugin-react-native](https://github.com/Intellicode/eslint-plugin-react-native) 检查 react-native 代码，如果你比较懒，可以直接使用 [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)，里面内置了 eslint-plugin-react，新人常遇到 peerDependencies 安装失败问题可参照 npmjs 主页上的如下方法解决：

```shell
(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
```

推荐使用 vue.js 官方的 eslint 插件：[eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) 来检查 vue.js 代码，具体的配置方法官方 README 写的清晰明了，这里就不赘述了。

上面的几种 eslint 规则集的官方仓库都列出了各自支持的规则，如果你需要关闭某些规则，可以直接在自己的 .eslintrc* 里面的 rules 中配置，比如我们仓库里面的：

```javascript
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
```

如果你配置过程中遇到什么问题，欢迎留言或者在读者群里面交流。
