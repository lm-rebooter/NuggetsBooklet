兼容性和跨平台是软件开发中老生常谈的事情了。一份代码可以在不同运行环境中运行是每个项目开发者追求的目标。那么，Node.js 开发的项目该如何实现跨平台和兼容性呢？

回顾前面课程中的模块，我们都是使用 ES-Modules 规范来管理模块，但是这个 Node.js 原生支持的 ES-Modules 规范有问题，主要是：

1. 它处于实验阶段，所以如果要在 Node.js 中使用原生的 ES-Modules ，要么必须强制使用 .mjs 作为文件扩展名，要么需要在 package.json 中配置`type:module`才能用；

2. ES-Modules 规范虽然向下兼容 CommonJS 规范，但是 CommonJS 规范的模块却不能直接使用 ES-Modules 规范的模块。而且，由于 ES-Modules 规范非常新，现在许多开发者还是采用 CommonJS 规范编写他们的模块，为了方便我们的使用，让 CommonJS 规范的模块也能够被我们开发的 ES-Modules 模块引用，我们就需要使用**Babel**，将最终的产物编译成 CommonJS。

## 安装 Babel.js

Babel 是 JavaScript 编译器，它能把新的 JavaScript 语言版本编译为旧版本。在前端工程化中，Babel 主要有两个作用：一是能够让我们开发者使用较新的语法进行开发，同时又能兼顾使用老版本浏览器环境的用户；二是 Babel 能够将 ES-Modules 模块编译为 CommonJS 模块。这样一来，我们可以使用 ES-Modules 规范管理模块，同时又能够兼容 CommonJS 规范的模块。而且 CommonJS 模块还可以进一步被打包器编译为 UMD 的方式给浏览器加载，这样就解决了跨平台的模块管理问题。

要使用 Babel，我们需要先安装它，一般来说需要安装三个模块。

- @babel/core：Babel 的核心库。
- @babel/cli：Babel 的命令行工具。
- @babel/preset-env：Babel 默认的预设环境。

在我们的 Node.js 项目目录下，可以通过以下命令来安装它们。

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

和 ESLint 一样，我们将 Babel 安装在开发依赖中。

```json
{
  "name": "isketch",
  "version": "0.0.1",
  "description": "A SVG doodle for sketching",
  "main": "lib/index.js",
  "module": "src/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "junyux",
  "license": "MIT"
  "devDependencies": {
    ...省略eslint配置
    "@babel/cli": "^7.19.3",
    "@babel/core": "^7.20.5",
    "@babel/preset-env": "^7.20.2"
  }
}
```

为了兼容老版本的浏览器，我们还要安装一个`core-js v3`模块，这个模块要安装在运行时依赖下，而不是开发依赖下。

```bash
npm install --save core-js@3
```


安装好了 Babel 后，我们在项目目录下创建一个配置文件`.babelrc`，这是一个 JSON 文件，我们配置如下：

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": "> 0.25%, not dead",
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

`@babel/env`表示预设支持当前版本所能支持的所有 JavaScript 的正式标准。

` "targets": "> 0.25%, not dead"`表示编译后的目标，这里设置为目前市场占有率高于`0.25%`且依然在维护中（not dead）的浏览器。这个选项包括了较多早期的浏览器，这些浏览器不支持 ES6 的语法。

`"useBuiltIns": "usage"`表示 Babel 会根据我们实际用到的 API 以及编译目标的浏览器兼容性，从`core-js`中按需添加需要的`polyfill`。

`"corejs": 3`表示使用`core-js`的`3.x`版本（默认是使用 2.x 版本）。

## 使用 Babel 进行模块化开发

安装配置完成后，我们可以使用 Babel 进行模块化开发。本课程最后一部分，我们会实现一个支持智能硬件的“涂鸦板”。这里，我们先封装一些绘图相关的工具库，这个库能在服务器和客户端绘制基本图形。

首先，我们在项目 src/math 目录里创建一个 vector2d.js 模块，内容如下：

```js
export class Vector2D extends Array {
  constructor (x = 0, y = 0) {
    super(x, y);
  }

  get x () {
    return this[0];
  }

  get y () {
    return this[1];
  }

  get len () {
    return Math.hypot(this.x, this.y);
  }

  get angle () {
    return Math.atan2(this.y, this.x);
  }
}

```

接着我们来测试一下这个模块，在项目的 examples 目录中，分别添加 www 和 node 子目录，在 node 子目录下新建 test-vector2d.js 文件，内容如下：

```js
const { Vector2D } = require('../../src/vector2d.js');

const v = new Vector2D(3, 4);
console.log(v.len);

```

如上代码所示，vector2d 采用的是 ES-Module 的规范，而在测试文件中，我们又是使用 CommonJS 的规范引入 vector2d 的模块，所以我们会看到系统报错了：

```bash
export class Vector2D extends Array {
^^^^^^

SyntaxError: Unexpected token 'export'
```

要解决这个问题，我们有两种方式。第一种方式，就是我们前面介绍过的在 package.json 文件中将 type 字段设置为 module 模式，这样就能够使用 ES Modules 的模块管理规范了。

但是，如果将 type 设置为 module 模式，那我们的项目就不能被采用 CommonJS 规范的第三方库使用了。所以，为了让我们的项目能够同时支持 ES Modules 和 CommonJS 规范，我们需要使用 Babel 工具，将遵循 ES-Modules 规范的模块编译成 CommonJS 规范的模块。

所以，我们在 scripts 字段中添加如下脚本命令：

```json
{
  ...

  "scripts": {
    ...省略eslint配置
    "compile": "babel src -d lib",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

  ...
}
```

我们添加了 compile 命令，命令为`babel src -d lib`。当我们在命令行下执行`npm run compile`后，Babel 就会将 src 中的 js 文件编译到 lib 中，我们看一下，现在 lib 目录下应该有 vector2d.js 文件，内容如下：

```js
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require("core-js/modules/es.array.index-of.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.reflect.construct.js");
...

var Vector2D = /*#__PURE__*/function (_Array) {
  _inherits(Vector2D, _Array);
  var _super = _createSuper(Vector2D);
  function Vector2D() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _classCallCheck(this, Vector2D);
    return _super.call(this, x, y);
  }
  _createClass(Vector2D, [{
    key: "x",
    get: function get() {
      return this[0];
    }
  }, {
    key: "y",
    get: function get() {
      return this[1];
    }
  }, {
    key: "len",
    get: function get() {
      return Math.hypot(this.x, this.y);
    }
  }, {
    key: "angle",
    get: function get() {
      return Math.atan2(this.y, this.x);
    }
  }]);
  return Vector2D;
}( /*#__PURE__*/_wrapNativeSuper(Array));
exports.Vector2D = Vector2D;
```

这是一个编译好的文件，我们看到它的内容非常多。之所以这样，是因为我们将`src/math`下的 JS 代码编译成`lib/math`下的老版本代码，新版代码中支持的特性需要在老版本中模拟实现，这里 Babel 使用了 core-js 来实现，所以代码中有很多 require core-js 的模块。

现在，我们将`examples/node/test-vector2d.js`文件中的 require 路径修改为`../../lib/vector2d.js`，这样就可以正常使用这个 vector2d 模块了。

## 修改 Babel 目标版本

我们看到，原始代码经过 Babel 编译后的代码较大，这是因为我们兼容了非常早期的浏览器。如果我们的项目是一个 Web 项目，考虑尽可能兼容更多的浏览器用户，这么做是非常必要的。

但是，我们的代码未来使用在智能涂鸦板项目，这个项目本身依赖非常新的浏览器环境，所以我们不需要把 JS 文件编译成太旧的兼容版本，可以修改`.babelrc`，如下：

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "chrome": 59
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

我们把配置的`targets`改成`chrome 59`，这样 Babel 就会编译成 chrome 59 版本以上的目标代码。我们重新运行`npm run compile`，看到现在`lib/math/vector2d.js`内容变成如下：

```js
"use strict";

require("core-js/modules/es.math.hypot");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2D = void 0;

class Vector2D extends Array {
  constructor(x = 0, y = 0) {
    super(x, y);
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get len() {
    return Math.hypot(this.x, this.y);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

}

exports.Vector2D = Vector2D;
```

在上面的代码中，Babel 基本上只需要引入一个`hypot`函数即可，因为 chrome59 不支持`hypot`函数。如果我们更激进一点，还可以把代码编译成更新的版本，例如我们要做的智能涂鸦板要支持蓝牙设备，而蓝牙设备必须是`chrome 104`以上版本才能支持，所以我们可以直接将`targets`改成`chrome 104`。如果这么做，那么编译出来的代码如下：

```js
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2D = void 0;
class Vector2D extends Array {
  constructor(x = 0, y = 0) {
    super(x, y);
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get len() {
    return Math.hypot(this.x, this.y);
  }
  get angle() {
    return Math.atan2(this.y, this.x);
  }
}
exports.Vector2D = Vector2D;
```

我们看到上面的代码基本上除了转换 ESModule 之外，就是原封不动的了，因为`chrome 104`版本的代码已经很新，该支持的特性都支持了。

Babel 除了以上生成兼容不同版本的代码之外，还可以通过插件来支持特殊的语法，正好我们的项目也需要这个能力，我们可以通过 Babel 给向量运算提供简便的语法支持，下一章里，我们来尝试写一个 Babel 插件，来实现我们想要的运算语法。

在本章的最后，我们再看一下如何在浏览器中直接引入我们的代码。

## 在 Web 中使用 vector2d.js 模块

我们也可以在 Web 中使用 vector2d.js 模块，因为 vector2d.js 是一个 ES-Modules 模块，我们不能在本地用 file 协议引入它，必须用 Web，通过 URL 的方式引入。

我们可以使用前面几节课实现的静态资源服务器来运行一个 Web 服务，当然，更简单的方式是我们直接使用 NPM 安装`http-server`模块。

```bash
npm i http-server --save-dev
```

然后我们修改 package.json 文件，添加 scripts：

```json
{
  ...
  "scripts": {
    "start": "http-server -c-1 -p9090",
    "compile": "babel src -d lib",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
}
```

接着我们创建一个 test-vector2d.html 文件，内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>test vetor2d</title>
</head>
<body>
  <script type="module">
    import {Vector2D} from '../../src/vector2d.js';
    const v = new Vector2D(3, 4);
    console.log(v.len); // 5
  </script>
</body>
</html>
```

`<script type="module">`表示这个脚本是 ES-Modules 规范的模块。

这样我们运行`npm start`，访问`http://localhost:9090/examples/www/test-vector2d.html`，就可以访问 HTML 页面，正常执行 JavaScript 代码，在浏览器控制台上看到输出的结果了。

## 小结

这一章节，我们安装并配置了 Babel，Babel 是一个 JavaScript 编译工具，它能将 JS 文件从新的版本编译成旧的版本，能够将 ES-Module 模块编译成 CommonJS 模块，对于跨平台开发和处理兼容性，Babel 会非常有用。另外，Babel 还有一些高级的功能，比如编写插件和扩展，在后续课程中我们会详细介绍。

在前面的例子中，我们实现了一个简单的二维向量类：vector2d.js，并且在 Node.js 环境和浏览器环境中都测试了它。在 Node 环境中，我们通过 Babel 编译为 CommonJS 模块来使用，而在浏览器环境中，我们通过浏览器原生支持的 ES-Modules 规范来使用。

安装和使用 Babel 工具的步骤如下：

1. 安装 Babel 工具，它包含了三个模块：
    - @babel/core：Babel的核心库
    - @babel/cli：Babel的命令行工具
    - @babel/preset-env：Babel默认的预设环境

1. 创建 Babel 的配置文件 —— .babelrc。这个配置文件可以预设当前版本所支持的所有 JavaScript 的正式标准；规定项目运行的目标客户端等。

1. 在 package.json 中配置 script 脚本命令 —— `"compile": "babel src -d lib"`。

1. 在命令行下执行`npm run compile`命令，让 src 目录下的源文件编译成旧版本的代码规范，实现兼容和跨平台。


对于 CommonJS 规范来说，不管新旧版本的浏览器都不支持，而 ES-Module 规范也只有最新的浏览器才支持。所以，为了在更早版本的浏览器中能够运行我们的代码，我们需要引入其他的工程化工具，比较常用的是引入像 webpack这样的打包器。在后续的章节中，我们先来聊聊 Babel 的高级功能，然后再来学习如何使用这个打包工具。
