babel 最开始的名字叫 6to5，主要是做 es6 到 es5 语法的转换和 polyfill，后来在 4.0 时改名为了 babel。虽然从 6to5 改名到了 babel，但是做的事情并没有变，依然是从高版本语法和 api 转换成低版本的语法并自动 polyfill 缺少的 api。

babel 是怎么实现这些功能的呢？

## 从插件到 preset

要实现转换，第一步要明确转换什么： 划定一个集合放要转换的特性，再划定一个集合放转换到的目标特性，两者建立一一映射关系。就确定了我们要做哪些转换。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4595dd98016e4ffe9e23ad7b7e6cc838~tplv-k3u1fbpfcp-watermark.image)

#### exponentiation operator

比如乘方运算符，我们会用 Math.pow 来实现

```javascript
let x = 10 ** 2;

x **= 3;
```

转换为

```javascript
let x = Math.pow(10, 2);

x = Math.pow(x, 3);
```


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58f0c8a649e44b95aa37fce92bb83adc~tplv-k3u1fbpfcp-watermark.image)

#### class

再比如 class，我们会用 function、prototype 来实现

```javascript
class Test {
  constructor(name) {
    this.name = name;
  }

  logger() {
    console.log("Hello", this.name);
  }
}
```
转换为
```javascript
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Test = (function() {
  function Test(name) {
    _classCallCheck(this, Test);

    this.name = name;
  }

  Test.prototype.logger = function logger() {
    console.log("Hello", this.name);
  };

  return Test;
})();
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9f48760579f4defafbcb94dbcaea84e~tplv-k3u1fbpfcp-watermark.image)

每一个语法都可以这样转换为低版本的语法，那把所有的这种高版本语法写的代码转换为低版本的，那不就实现了编译了么。

但是只是转换并不能解决所有问题，涉及到某个对象的 api，比如 Array.prototype.find，这种 api 的兼容并不是需要转换语法，而是要在环境中注入我们实现的 api，也就是 polyfill （垫片）。

所以我们做的事情除了语法转换外，还有 api 的 polyfill。

先说语法转换。


我们要转换哪些语法呢？

babel 插件需要转换的语法包括 es 标准语法、proposal 阶段的语法，还有 react、flow、typescript 等特有语法。

#### es 标准语法

我们知道，[TC39](https://262.ecma-international.org/) 是制定 javascript 语言标准的组织，每年都会公布加入到语言标准的特性，[es2015](https://262.ecma-international.org/6.0)、es2016、es2017 等。这些是我们要转换的语言特性范围。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93c2bdc9c5b34079ad607989f6a24233~tplv-k3u1fbpfcp-watermark.image)

在 babel6 时，分别用 preset-es2015、 preset-es2016 等来维护相应的 transform plugin，但在 babel7 的时候就改为 preset env 了。

#### proposal 阶段的语法

babel 要转换的不只是加入标准的特性，语言特性从提出到标准会有一个过程，分为[几个阶段](https://tc39.es/process-document/)。

- 阶段 0 - Strawman: 只是一个想法，可能用 babel plugin 实现
- 阶段 1 - Proposal: 值得继续的建议
- 阶段 2 - Draft: 建立 spec
- 阶段 3 - Candidate: 完成 spec 并且在浏览器实现
- 阶段 4 - Finished: 会加入到下一年的 es20xx spec

这些还未加入到语言标准的特性也是要支持的。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81dc5ce433a849328527d430d23eda88~tplv-k3u1fbpfcp-watermark.image)

#### react、flow、typescript

只是转换 javascript 本身的 es spec 和 proposal 的特性特性并不够，现在我们开发的时候 jsx、typescript、flow 这些都是会用的，babel 肯定也得支持。

这些转换对应的 plugin 分别放在不同 preset 里： preset-jsx、preset-typescript、preset-flow。

我们要转换的范围又大了一些。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66cfad5e339648afbcfcf973119be0a8~tplv-k3u1fbpfcp-watermark.image)


上面是插件要转换的语言特性，babel7 内置的实现这些特性的插件分为 syntax、transform、proposal 3类。

#### syntax plugin

syntax plugin 是在 parserOptions 中放入一个 flag 让 parser 知道要 parse 什么语法，最终的 parse 逻辑还是 babel parser（babylon） 实现的。

一般 syntax plugin 都是这样的：

```javascript
import { declare } from "@babel/helper-plugin-utils";

export default declare(api => {
  api.assertVersion(7);

  return {
    name: "syntax-function-bind",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("functionBind");
    },
  };
});

```

这些插件的目的就是让 parser 能够正确的解析对应的语法成 AST。

#### transform plugin

transform plugin 是对 AST 的转换，各种 es20xx 语言特性、typescript、jsx 等的转换都是在 transform plugin 里面实现的。

有的时候需要结合 syntax plugin 和 transform plugin， 比如 typescript 的语法解析要使用 @babel/plugin-syntax-typescript 在 parserOptions 放入解析 typescript 语法的选项，然后使用 @babel/plugin-transform-typescript 来转换解析出的 typescript 对应的 AST 的转换。

平时我们一般使用 @babel/preset-typescript，它对上面两个插件做了封装。

#### proposal plugin

未加入语言标准的特性的 AST 转换插件叫 proposal plugin，其实他也是 transform plugin，但是为了和标准特性区分，所以这样叫。

完成 proposal 特性的支持，有时同样需要 综合 syntax plugin 和 proposal plugin，比如 function bind （:: 操作符）就需要同时使用 @babel/plugin-syntax-function-bind 和 @babel/plugin-proposal-function-bind。

总之，babel 的内置的 plugin，就 @babel/plugin-syntax-xxx, @babel/plugin-transform-xxx、@babel/plugin-proposal-xxx 3种。

这样的 plugin 还是很多的，所以又设计了 preset。

### preset

用于不同的目的需要不同的 babel 插件，所以 babel 设计了 preset

- 不同版本的语言标准支持： preset-es2015、preset-es2016 等，babel7 后用 preset-env 代替
- 未加入标准的语言特性的支持： 用于 stage0、stage1、stage2 的特性，babel7 后单独引入 proposal plugin
- 用于 react、jsx、flow 的支持：分别封装相应的插件为 preset-react、preset-jsx、preset-flow，直接使用对应 preset 即可


preset 就是插件的集合，但是它可以动态确定包含的插件，比如 preset-env 就是根据 targets 来确定插件。

插件和插件之间自然有一些公共的代码，这部分放在 helper 里：

### helper

每个特性的实现用一个 babel 插件实现，当 babel 插件多了，自然会有一些共同的逻辑。这部分逻辑怎么共享呢？

babel 设计了插件之间共享逻辑的机制，就是 helper。

helper 分为两种：

- 一种是注入到 AST 的运行时用的全局函数
- 一种是操作 AST 的工具函数，比如变量提升这种通用逻辑

##### 注入到 AST 的全局函数

注入到 AST 的运行时用的全局函数，比如
```javascript
class Guang {}

```
会被转换成
```javascript
function _classCallCheck(instance, Constructor) {
  //...
}

var Guang = function Guang() {
  _classCallCheck(this, Guang);
};
```
这里的 _classCallCheck 就是 helper。

这类 helper 数量比较多，babel7 有 80 多个，都在 @babel/helpers 里面。在插件里使用的话，直接调用 this.addHelper，会在顶层作用域声明对应的 helper，然后返回对应的 identifier。


```javascript
var transformObjectSetPrototypeOfToAssign = declare(function (api) {
    api.assertVersion(7);
    return {
      name: "transform-object-set-prototype-of-to-assign",
      visitor: {
        CallExpression: function CallExpression(path) {
          if (path.get("callee").matchesPattern("Object.setPrototypeOf")) {
            path.node.callee = this.addHelper("defaults");
          }
        }
      }
    };
});
```

其实一般我们也用不到，主要是 babel 内部用的。

这种 helper 是用于用低版本特性实现高版本特性的，比如用 function 和 prototype 实现 class.

内部用 template 实现的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6142017e4f7740f0a41c12a50ca6881b~tplv-k3u1fbpfcp-watermark.image)


除了编译的时候注入 helper 以外，runtime 包里也要包含这些 helper。

因为我们可以把 helper 注入到 AST，也可以抽离成从 runtime 包引入的形式：

比如这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fcd40ca6013400797041e3006e7203d~tplv-k3u1fbpfcp-watermark.image)

除了用于注入同样的 AST 的 helper，还有一些公共逻辑的 helper：

##### 操作 AST 的工具函数

操作 AST 的工具函数，比如变量提升自己实现的话还是比较麻烦的，这种通用逻辑可以封装到 helper 里，然后插件里直接用：

```javascript
const hoistVariables = require('@babel/helper-hoist-variables').default;

cosnt plugin = function () {
    visitor: {
        VariableDeclaration(path) {
            hoistVariables(path.parentPath, (id) => {
                path.scope.parent.push({
                    id: path.scope.generateUidIdentifier(id.name)
                });
                return id;
            }, 'const' );
        }
    }
}
```
当输入为
```javascript
function func(){
    const a = 1;
    const b = 2;
}
```
输出为
```javascript
var _a, _b;

function func() {
  a = 1;
  b = 2;
}
```

我们借助 @babel/helper-hoist-variables 轻松实现了变量提升的逻辑。

再举一个例子
```javascript
const importModule = require('@babel/helper-module-imports');

cosnt plugin = function ({ template }) {
    visitor: {
        Program(path) {
            const reactIdentifier = importModule.addDefault(path, 'lodash',{
                nameHint: '_'
            });
            path.node.body.push(template.ast(`const get = _.get`));
        }
    }
}                   
```
会在代码中加入模块引入和变量声明的代码
```javascript
var _ = _interopRequireDefault(require("lodash")).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const get = _.get;
```
我们借助 @babel/helper-module-imports 可以很轻松的引入一个模块，通过 named import、default import 或者 namespace import 的方式。

这类 helper 的特点是需要手动引入对应的包，调用 api，而不是直接 this.addHelper 就行。

说了这么多，其实 helper 一般我们也不会用到，知道它是做啥的就行。


babel helpers 是用于 babel plugin 逻辑复用的一些工具函数，分为用于注入 runtime 代码的 helper 和用于简化 AST 操作 的 helper两种。

第一种都在 @babel/helpers 包里，直接 this.addHelper(name) 就可以引入， 而第二种需要手动引入包和调用 api。

前面提到了有的 api 会运行时引入，那 runtime 包里具体有啥呢？

### babel runtime

babel runtime 里面放运行时加载的模块，会被打包工具打包到产物中，下面放着各种需要在 runtime 使用的函数，包括三部分：regenerator、corejs、helper。

- corejs 这就是新的 api 的 polyfill，分为 2 和 3 两个版本，3 才实现了实例方法的polyfill

- regenerator 是 facebook 实现的 aync 的 runtime 库，babel 使用 [regenerator-runtime](https://github.com/facebook/regenerator/tree/master/packages/runtime)来支持实现 async await 的支持。

- helper 是 babel 做语法转换时用到的函数，比如 _typeof、_extends 等

babel 做语法转换和 api 的 polyfill，需要自己实现一部分 runtime 的函数，就是 helper 部分。

有的也没有自己实现，用的第三方的，比如 regenerator 是用的 facebook 的。api 的 polyfill 也是用的 core-js 的，babel 对它们做了整合。

因为 async await 这种特性的实现还是比较复杂的，标准 api 的实现的跟进也需要花精力，所以 babel 直接用了社区的实现。

## 总结

我们知道了 babel 内置的 plugin 分为了 transform、proposal、syntax 三种，也知道了 preset 就是插件的集合。

插件之间的可复用的 AST 操作逻辑，需要注入的公共代码都在 helper 里。

除了注入到 AST 外，还有一部分是从 runtime 包引入的。runtime 包分为 helper、regenerator、core-js 3部分。后面两个都是社区的实现。

知道了 preset、helper、runtime 都是什么，那 babel 是怎么基于这些来实现语法转换和  api polyfill 的功能的呢？

下节我们继续聊。