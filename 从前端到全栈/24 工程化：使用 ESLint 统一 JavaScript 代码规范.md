上一章节，我们介绍了工程化 Node.js 项目需要的配置文件 package.json。这一章节，我们开始介绍工程化所需的工具之一：ESLint。

JavaScript 语言的代码书写形式比较宽松，只要符合基本的语法，都可以正确运行。对于空白符、括号、缩进、以及分号的形式，JavaScript 并没有强制的要求。

许多前端程序员，都有自己的书写习惯。但是，在多人维护的项目，统一代码书写风格则很有必要，因为一致的书写风格，便于维护，可以提升模块质量。因此，前端工程化的一个环节是使用工具脚本来统一代码的书写风格，目前比较流行的工具是 [ESLint](https://eslint.org/)。

## 安装 ESLint

我们依然是使用 NPM 安装 ESLint。

```
npm install --save-dev eslint
```

上面的命令行中，参数`--save-dev`表示将它安装到开发依赖中（devDependencies)。

还记得 dependencies 字段吗？dependencies 字段表示运行时依赖，devDependencies 字段表示开发依赖。这两种依赖的区别在于，当其他开发人员通过`npm install isketch`安装我们的项目时，它只会下载 dependencies 里的依赖，忽略 devDependencies 中的依赖。只有通过 git clone isketch，将我们的 isketch 克隆到本地，并在本地的项目中运行 `npm install` 时，才会将两种依赖都安装到本地。

所以，安装完成后，我们的 package.json 文件多了一个 devDependiences 字段，现在完整的内容如下：

```
{
  "name": "isketch",
  "version": "0.0.1",
  "description": "A SVG doodle for sketching",
  "main": "lib/index.js",
  "module": "src/index.js",
  "scripts": {
    "start": "",
    "lint": "",
    "compile": "",
    "build": "",
    "deploy": "",
    "test": "echo "Error: no test specified" && exit 1",
    "prepublishOnly": ""
  },
  "keywords": [],
  "author": "junyux",
  "license": "MIT",
  "devDependencies": {
    "eslint": "^7.0.0"
  }
}
```

然后，我们需要在 scripts 字段中配置 eslint 的脚本命令，指定`eslint`检查哪些目录和文件：

```
{
  ...
  "scripts": {
    "start": "",
    "lint": "eslint './**/*.js'",
    "compile": "",
    "build": "",
    "test": "echo "Error: no test specified" && exit 1",
    "prepublishOnly": ""
  },
  ...
}
```

上面的代码中，`eslint './**/*.js'` 是 eslint 的命令行指令，表示检查项目内所有的 js 文件。`"lint": "eslint './**/*.js'"`是对 eslint 命令进行包装，这样我们可以通过`npm run lint` 执行 eslint 的命令行，对我们的 js 文件进行语法检查。

安装好 ESLint 后，我们还需要配置一下检查规则。

## 配置 ESLint 规则

在配置规则之前，如果我们直接执行`npm run lint`，会出现下面的结果：

```
> eslint './**/*.js'
​
​
Oops! Something went wrong! :(
​
ESLint: 7.0.0
​
No files matching the pattern "./**/*.js" were found.
Please check for typing mistakes in the pattern.
```

这是因为，`eslint`并没有强制指定某种代码风格，需要我们进行配置。ESLint 的代码风格配置项比较复杂，大约有数百项，有兴趣一一配置的同学可以去看它的[官方文档](https://eslint.org/docs/rules/)。

ESLint 内置了默认的配置规则，所以我们可以方便地通过几行配置搞定。

首先我们创建一个 .eslintrc.js 文件，这个文件在上一章节我们的目录中有列出，它是 ESLint 规则文件。这个文件的内容如下：

```
module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: 'eslint:recommended',
};
```

eslint 配置项的 env 属性是 JavaScript 运行时环境，我们将 node 和 browser 都配置为 true，表示我们的代码既可以运行在 Node.js 也可以运行在浏览器上。这样一来，使用 Node.js 和浏览器内置的 API 对象就不会报未定义变量的错误了。

因为我们的代码要支持较新的 JavaScript 语法，所以也设置 env 中的 es6 属性为 true。

extends 表示继承的规则，ESLint 的配置规则是可以继承的，我们可以通过 NPM 安装某个规则，然后继承它，其中`eslint:recommanded`是 eslint 默认推荐的规则，不需要安装额外的依赖。

除了继承`eslint:recommanded`之外，也可以继承其他的规则，目前比较流行的规则有 [eslint-config-airbnb](https://github.com/doasync/eslint-config-airbnb-standard)、[eslint-config-google](https://github.com/google/eslint-config-google)等，稍后我们会看到如何继承它们。

接下来我们先看一下如何配置扩展到 lint 规则。我们先在 isketch 下创建 src/math/index.js 文件，随便写一点东西，比如：

```
var message = 'Hello world';
console.log(message);
```

然后执行`npm run lint`，会看到现在 eslint 命令运行完没有错误输出，因为我们现在写的代码风格符合`eslint:recommanded`的要求。

接着，我们添加一下规则，我们修改`.eslintrc.js`文件：

```
module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  rules: {
    "no-var": "error",
  },
};
```

`"no-var": "error"` 是一条 rules 规则，一般的配置为`规则名: 警告等级`。`"no-var"`表示不能使用 var 声明，否则违反该规则，就会报告错误。

所以，我们再次运行`npm run lint`命令，就会看到以下输出结果：

```
> eslint './**/*.js'
​
​
/.../isketch/src/math/index.js
  1:1  error  Unexpected var, use let or const instead  no-var
​
✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

输出结果中报告了一个错误，要求使用 let 或 const 替代 var 声明变量。

我们可以修改一下警告等级，比如改成`"no-var": "warn"`，这样的话，eslint 将不会报告错误，而是报告一条警告信息。

```
> eslint './**/*.js'


/.../isketch/src/math/index.js
  1:1  warning  Unexpected var, use let or const instead  no-var

✖ 1 problem (0 errors, 1 warning)
  0 errors and 1 warning potentially fixable with the `--fix` option.
```

ESLint 的警告等级有 3 种：`error`表示报告错误；`warn`表示不报错，只提示警告信息；`off`表示不检查该规则。

## 与编辑器联动

现在大部分主流的代码编辑器都支持 ESLint 插件，比如你使用 VisualStudio Code，那么你可以安装 ESLint 插件，就可以直接在代码中显示出 ESLint 规则的提示信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e1b66e6d6784ea1b399611276f91ec1~tplv-k3u1fbpfcp-zoom-1.image)

因为我们刚才把警告等级改为`warn`了，所以现在显示出的是黄色的波浪线。

我们将`no-var`规则的警告等级改回`error`，那么波浪线的颜色就变成红色的了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8aab4fb196f454ab7613415b5a28fea~tplv-k3u1fbpfcp-zoom-1.image)

使用 eslint 配合编辑器插件，可以帮助我们快速找到代码错误或者不规范的地方，有助于我们养成良好代码风格的书写习惯。

## --fix 自动修复

用 ESLint 发现代码的问题后，我们可以选择手工修复代码，或者依赖 eslint 自动修复。要依赖 eslint 自动修复，我们可以添加一个 NPM Scripts 叫做`lint:fix`，执行 eslint 命令的同时带上参数`--fix`，这样执行代码检查的时候就会自动修复问题了。

```
{
  ...
  "scripts": {
    "start": "",
    "lint": "eslint './**/*.js'",
    "lint:fix": "eslint './**/*.js' --fix",
    "compile": "",
    "build": "",
    "test": "echo "Error: no test specified" && exit 1",
    "prepublishOnly": ""
  },
  ...
}
```

我们执行`npm run lint:fix`，之后再打开`src/index.js`文件，你就会发现代码`var message = 'Hello world';`被自动替换成了`let message = 'Hello world';`。

## 自动配置 ESLint

前面我们通过手工配置`.eslintrc.js`文件，实际上 ESLint 还支持自动配置：

```
{
  ...
  "scripts": {
    ...
    "lint": "eslint './**/*.js'",
    "lint:fix": "eslint './**/*.js' --fix",
    "lint:init": "eslint --init",
    ...
  },
  ...
}
```

我们添加一个`lint:init`命令行脚本，然后运行它：

```
npm run lint:init
```

这样 ESLint 就会启动交互式配置的命令，帮助我们配置合适于我们项目的 ESLint 检查规则。

```
> eslint --init

? How would you like to use ESLint? To check syntax, find problems, and enforce 
code style
? What type of modules does your project use? JavaScript modules (import/export)


? Which framework does your project use? None of these
? Does your project use TypeScript? No
? Where does your code run? Browser, Node
? How would you like to define a style for your project? Use a popular style gui
de
? Which style guide do you want to follow? Standard: https://github.com/standard
/standard
? What format do you want your config file to be in? JavaScript
```

执行`eslint --init`会询问我们几个问题，根据我们的回答初始化配置文件，而且会让我们选择继承常用的代码风格，包括 [Airbnb](https://github.com/doasync/eslint-config-airbnb-standard) 风格、[Standard](https://github.com/standard/eslint-config-standard) 和 [Google](https://github.com/google/eslint-config-google) 风格，我们可以选择适合我们团队的风格。比如选择 Standard 风格，最终生成的`.eslintrc.js`配置文件如下：

```
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
  }
}
```

这里面有些是我们前面没有介绍过的属性，我们看一下，env 我们介绍过了不提，extends 从`eslint:recommended`换成`standard`风格。

-   globals 是内置全局变量，因为 ESLint 支持最新的 JavaScript 规范，在 ES2017 中有两个新的全局对象 Atomics 和 SharedArrayBuffer。
-   parserOptions 指定解析器版本，这里设置 ecmaVersion 值为 11，是目前最新的语言标准。ecmaVersion 这个属性目前可以设置`3、5、6、7、8、9、10、11`，3、5 表示 ES3 和 ES5，6、7、8、9、10、11 分别表示 ES2015、ES2016、ES2017、ES2018、ES2019 和 ES2020；sourceType 为`module`，表示支持 ES Modules 模块规范。
-   rules 字段是扩展规则，暂时为空，我们可以根据需要添加。

然后，我们再次运行`npm run lint`，发现这次多了几个错误信息：

```
> eslint './**/*.js'


/.../isketch/math/src/index.js
  1:5   error  'message' is never reassigned. Use 'const' instead  prefer-const
  1:28  error  Extra semicolon                                     semi
  2:21  error  Extra semicolon                                     semi
  2:22  error  Newline required at end of file but not found       eol-last
```

因为 Standard 风格比默认的`eslint:recommended`更严格，这次 ESLint 报的错误如下：

-   `message`变量没有被再次赋值，应当使用`const`声明；
-   两条语句多余分号（Standard 采用 semiless 风格，不主动写分号）；
-   文件最后保留一个空行。
Standard 是 semiless 风格，不主动写分号，如果你不喜欢不写分号，可以扩展 rules，添加如下：

```
module.exports = {
  ...
  rules: {
    semi: ['error', 'always']
  }
}
```

`semi`是分号书写规则，`['error', 'always']`表示警告级别是`error`，需要总是(always)书写分号。这样，错误信息就只剩下两条。然后，我们执行`npm run lint:fix`自动修复错误。最终`src/index.js`代码被修改为如下：

```
const message = 'Hello world';
console.log(message);
// 这里是空行
```

## 小结

ESLint 是工程化中的一个重要的规范代码书写的工具。在多人协作开发项目中，它能够统一每个开发者的代码书写风格，提高项目的可维护性。

那么，安装和使用 ESLint 工具的步骤如下。

1.  通过`npm install --save-dev eslint`将 eslint 安装到项目的开发依赖中。

2.  创建 eslint 规则文件 —— .eslintrc.js。

3.  在 package.json 中设置 eslint 的命令行配置：

    -   `"lint": "eslint './**/*.js'"` 表示运行 eslint 命令行脚本，检查项目下所有 js 文件的代码规范；
    -   `"lint:fix": "eslint './**/*.js' --fix"` 表示自动修复代码书写错误；
    -   `"lint:init": "eslint --init"` 表示自动创建 eslint 规则文件

最后，我们通过`npm run xxx`来运行这些 script。

下一章节，我们将介绍工程化的兼容性和跨平台工具：Babel。