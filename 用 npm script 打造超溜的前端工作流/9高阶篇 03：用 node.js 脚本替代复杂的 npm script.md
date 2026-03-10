# 3.3 用 node.js 脚本替代复杂的 npm script

[Node.js](https://nodejs.org/en/) 丰富的生态能赋予我们更强的能力，对于前端工程师来说，使用 Node.js 来编写复杂的 npm script 具有明显的 2 个优势：首先，编写简单的工具脚本对前端工程师来说额外的学习成本很低甚至可以忽略不计，其次，因为 Node.js 本身是跨平台的，用它编写的脚本出现跨平台兼容问题的概率很小。

下面我们就一起探索下，如何把上节中使用 shell 编写的 cover 脚本改写成 Node.js 脚本，在 Node.js 脚本中我们也能体味到 [shelljs](https://www.npmjs.com/package/shelljs) 这个工具包的强大。

### 1. 安装 shelljs 依赖

使用如下命令安装 shelljs 到项目依赖中：

```shell
npm i shelljs -D
# npm install shelljs --save-dev
# yarn add shelljs -D
```

此外，我们计划使用 [chalk](https://www.npmjs.com/package/chalk) 来给输出加点颜色，让脚本变的更有趣，同样安装到 devDependencies 里面：

```shell
npm i chalk -D
# npm install chalk --save-dev
# yarn add chalk -D
```

### 2. 创建 Node.js 脚本

```shell
touch scripts/cover.js
```

### 3. 用 Node.js 实现同等功能

shelljs 为我们提供了各种常见命令的跨平台支持，比如 cp、mkdir、rm、cd 等命令，此外，理论上你可以在 Node.js 脚本中使用任何 [npmjs.com](https://www.npmjs.com) 上能找到的包。清理归档目录、运行测试、归档并预览覆盖率报告的完整 Node.js 代码如下：

```javascript
const { rm, cp, mkdir, exec, echo } = require('shelljs');
const chalk = require('chalk');

console.log(chalk.green('1. remove old coverage reports...'));
rm('-rf', 'coverage');
rm('-rf', '.nyc_output');

console.log(chalk.green('2. run test and collect new coverage...'));
exec('nyc --reporter=html npm run test');

console.log(chalk.green('3. archive coverage report by version...'));
mkdir('-p', 'coverage_archive/$npm_package_version');
cp('-r', 'coverage/*', 'coverage_archive/$npm_package_version');

console.log(chalk.green('4. open coverage report for preview...'));
exec('npm-run-all --parallel cover:serve cover:open');
```

关于改动的几点说明：

* 简单的文件系统操作，建议直接使用 shelljs 提供的 cp、rm 等替换；
* 部分稍复杂的命令，比如 nyc 可以使用 exec 来执行，也可以使用 istanbul 包来完成；
* 在 exec 中也可以大胆的使用 npm script 运行时的环境变量，比如 `$npm_package_version`；

### 4. 让 package.json 指向新脚本

准备好 Node.js 脚本之后，我们需要修改 package.json 里面的命令，使其运行该脚本：

```patch
   "scripts": {
     "test": "cross-env NODE_ENV=test mocha tests/",
-    "cover": "scripty",
+    "cover": "node scripts/cover.js",
     "cover:open": "scripty"
   },
```

### 5. 测试 cover 命名

重新运行 npm run cover 命令，不出意外的话，基本功能是正常的，除了我们新加的绿色输出，如下图：

![](https://user-gold-cdn.xitu.io/2017/12/10/1603de95af9b2c41?w=1060&h=587&f=png&s=87226)

以上，本小节完，这里只是简单展示了如何组织 Node.js 脚本并且让其与 npm script 关联起来，至于具体在脚本中做什么事情，请你自由发挥吧。

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/08-using-nodejs-script-as-replacement)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `08-using-nodejs-script-as-replacement`。

----------------------------
