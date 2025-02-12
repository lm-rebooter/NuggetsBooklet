上一章节，我们介绍了使用 Babel 来编译 JavaScript 代码适配不同版本的运行环境，一般的情况下这足以解决我们的问题。

但是，只让 Babel 做这样的工作未免有些“大材小用”了。Babel 真正强大之处在于它可以实现各种插件，用来解析和转换 JavaScript 代码。这些插件可以实现很多功能，甚至可以实现新的语法。

在这一章节，我们将实现一个简单的 Babel 插件，用来化简向量运算。这个插件的功能是让 JavaScript 用简单的数学语法来进行向量运算。

## 原始需求

有的同学可能知道，我曾经开发过一个图形渲染的基础库[SpriteJS](https://spritejs.com)，这个基础库中有许多需要进行实时向量运算的地方，例如图形和画布的 transform。而且，图形库为了保持高性能，对向量运算的性能也非常苛刻。

在开源社区中，有一款非常出色的高性能向量运算模块，叫做[gl-matrix](https://github.com/toji/gl-matrix)，它默认用 Float32Array 来存储计算数据，不使用对象构造，而是直接使用 TypedArray 结构，所以在性能上能达到极致，非常适合作为图形库的底层运算模块。

不过因为追求高性能，gl-matrix 的使用有一些不方便。它的 API 设计完全是为了性能，而不是使用方便。比如，做两个二维向量的加法，按照 gl-matrix 的写法是：

```
const a = vec2.fromValues(1, 2);
const b = vec2.fromValues(3, 4);
const c = vec2.create();
vec2.add(c, a, b);
```

这样的写法不仅不直观，还有很多冗余的代码。如果我们能够用更简单的语法来实现这个功能就好了，比如支持下面这种写法：

```
const a = vec2(1, 2);
const b = vec2(3, 4);
const c = vec2(a) + vec2(b);
```

当然，JavaScript 默认的加法运算是肯定不支持`c = vec2(a) + vec2(b)`这种写法的，因为它不知道`vec2`是什么。但是，如果我们能够实现一个 Babel 插件，让它识别`vec2`这个类型并进行转换处理，就可以实现我们的需求了。

## Babel 插件机制

首先，我们来简单了解一下 Babel 和它的插件机制。

Babel 是通用的多功能 JavaScript 编译器，准确的说，它是一个 JavaScript 代码转换器（transpiler）。它的核心功能是接收一段 JavaScript 代码，然后对这段代码进行转换，最后输出转换后的代码。

这个过程通常分为几个步骤：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5b01c68965c4151a7499fa6bd2b2c3c~tplv-k3u1fbpfcp-zoom-1.image)

首先是**解析**(parse)，在这个步骤里，Babel 接收代码，并将代码解析成抽象语法树（Abstract Syntex Tree）。

接着是**转换**(transpile)，在这个步骤里，Babel 会对抽象语法树进行遍历（traverse）和替换（replace）。

最后是**生成**(generate)，根据新的抽象语法树生成编译后的代码。

Babel 的插件机制主要就是在转换阶段对抽象语法树进行遍历和替换的过程。Babel插件的作用就是在这个过程中，对抽象语法树进行修改，从而达到转换的目的。

现在我们来动手试验一下，一起创造这个插件。

## 配置插件运行环境

首先我们创建一个项目`babel-plugin-transform-gl-matrix`，然后安装 Babel 的依赖：

```
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

为了更好地开发，顺便安装和配置一下 eslint：

```
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import
```

然后在项目根目录下创建`.eslintrc.js`文件，内容如下：

```
module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-console': 'off',
  },
};
```

创建 src 目录，然后在 src 目录下创建`index.js`文件，内容如下：

```
module.exports = function ({ types: t }) {
  // plugin contents
  return {};
};
```

上面的代码是一个 Babel 插件的骨架，它导出了一个函数，这个函数接收一个参数`babel`，然后返回一个对象，这个对象就是插件的内容。

接下来，我们来实现这个插件的功能。我们的目标是，对`vec2`这个类型进行加法运算时自动转换成`vec2.add`方法。

首先，我们先在项目创建一个环境让这个插件能正常跑起来。我们创建一个 test 目录，然后在 test 目录下创建`index.js`文件，内容如下：

```
const { vec2 } = require('gl-matrix');
​
const a = vec2(1, 2);
const b = vec2(3, 4);
const c = vec2(a) + vec2(b);
```

然后在项目根目录下创建`.babelrc`文件，内容如下：

```
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "./src"
  ]
}
```

然后我们在 package.json 文件中添加一个命令：

```
{
  "scripts": {
    "compile": "babel test/index.js"
  }
}
```

接下来运行`npm run compile`，看到输出的结果：

```
"use strict";

var _require = require('gl-matrix'),
  vec2 = _require.vec2;
var a = vec2(1, 2);
var b = vec2(3, 4);
var c = vec2(a) + vec2(b);
```

我们的插件什么都没做，所以现在的编译结果是 Babel 的 preset-env 的编译默认结果。接下来我们要实现具体的插件逻辑，希望把上面的代码编译成：

```
"use strict";

var _require = require('gl-matrix'),
  vec2 = _require.vec2;
var a = vec2.fromValues(1, 2);
var b = vec2.fromValues(3, 4);
var c = vec2.add(vec2.create(), a, b);
```

## 实现插件逻辑

接下来，我们修改`src/index.js`文件，内容如下：

```
module.exports = function ({ types: t }) {
  // plugin contents

  return {
    visitor: {
      CallExpression: {
        exit(path) {
          const funcName = path.node.callee.name;
          if (funcName === 'vec2') {
            path.node.callee.name = 'vec2.fromValues';
          }
        },
      },
    },
  };
};
```

我们已经知道，在 Babel 的解析阶段代码被解析成 AST。在插件中，我们可以遍历这个 AST，对它进行修改，最后再把 AST 转换成代码。

要遍历 AST，我们可以返回对象，这个对象的 visitor 属性描述要遍历的节点类型。上面的代码中，我们要遍历`CallExpression`类型的节点，然后对这类节点进行修改。

在`CallExpression`类型的节点中，`callee`属性表示函数调用的函数名，`arguments`属性表示函数调用的参数。我们要修改的是`callee`属性，所以我们要对`callee`属性进行了修改。

接着我们保存这个文件，然后运行`npm run compile`，看到输出的结果：

```
"use strict";

var _require = require('gl-matrix'),
  vec2 = _require.vec2;
var a = vec2.fromValues(1, 2);
var b = vec2.fromValues(3, 4);
var c = vec2.fromValues(a) + vec2.fromValues(b);
```

我们看到插件效果生效了，现在`vec2`函数被替换成了`vec2.fromValues`。不过这个结果和我们预想的不一样，因为我们只想替换`vec2`作为构造器的情况，而不是替换所有的`vec2`函数调用。这个我们可以通过判断`arguments`属性来实现。

我们继续修改插件代码：

```
module.exports = function ({ types: t }) {
  // plugin contents

  return {
    visitor: {
      CallExpression: {
        exit(path) {
          const funcName = path.node.callee.name;
          if (funcName === 'vec2') {
            const args = path.node.arguments;
            if (args.length === 2) {
              path.node.callee.name = 'vec2.fromValues';
            }
          }
        },
      },
    },
  };
};
```

上面的代码里，我们判断一下`vec2`函数调用的参数个数。如果是 2 个，它就是一个构造器，我们就把它替换成`vec2.fromValues`。否则，我们暂时不进行修改。

接着我们保存这个文件，然后运行`npm run compile`，看到输出的结果：

```
"use strict";

var _require = require('gl-matrix'),
  vec2 = _require.vec2;
var a = vec2.fromValues(1, 2);
var b = vec2.fromValues(3, 4);
var c = vec2(a) + vec2(b);
```

接着我们要处理`vec2(a) + vec2(b)`，这是一个二元表达式，我们要把它替换成`vec2.add(vec2.create(), a, b)`。我们继续修改插件代码：

```
module.exports = function ({ types: t }) {
  // plugin contents

  return {
    visitor: {
      CallExpression: {
        exit(path) {
          const funcName = path.node.callee.name;
          if (funcName === 'vec2') {
            const args = path.node.arguments;
            if (args.length === 2) {
              path.node.callee.name = 'vec2.fromValues';
            }
          }
        },
      },
      BinaryExpression: {
        exit(path) {
          const { left, right } = path.node;
          if (t.isCallExpression(left) && left.callee.name === 'vec2') {
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
                // https://babeljs.io/docs/en/babel-types
                const node = t.callExpression(
                  t.identifier(`${left.callee.name}.add`),
                  [
                    t.callExpression(
                      t.identifier(`${left.callee.name}.create`),
                      [],
                    ),
                    left.arguments[0],
                    right.arguments[0]],
                );
                path.replaceWith(node);
              }
            }
          }
        },
      },
    },
  };
};
```

如上面代码所示，我们判断一下`BinaryExpression`类型的节点，如果它的左右两个操作数都是`vec2`函数调用，那么我们就把它替换成`vec2.add(vec2.create(), a, b)`。

我们通过`@babel/types`模块来实现替换，它提供了一系列的方法，可以用来创建 AST 节点。比如，`t.callExpression`方法可以用来创建函数调用节点，`t.identifier`方法可以用来创建标识符节点，`t.isCallExpression`方法可以用来判断一个节点是否是函数调用节点，`t.isIdentifier`方法可以用来判断一个节点是否是标识符节点，等等。

Babel 已经帮我们自动引入了`@babel/types`模块（通过`@babel/core`)了。在插件骨架中，导出的函数参数中有一个`types`属性，它就是`@babel/types`对象，我们可以直接使用。

接着我们保存这个文件，然后运行`npm run compile`，看到输出的结果：

```
"use strict";

var _require = require('gl-matrix'),
  vec2 = _require.vec2;
var a = vec2.fromValues(1, 2);
var b = vec2.fromValues(3, 4);
var c = vec2.add(vec2.create(), a, b);
```

我们可以看到，`vec2(a) + vec2(b)`已经被替换成`vec2.add(vec2.create(), a, b)`了，这和我们的期望一致。

## 总结

我们实现了一个简单的 Babel 插件，它可以把`gl-matrix`库中的`vec2`函数调用替换成`gl-matrix`库中的其他函数调用。这个插件的功能非常简单，但是它的原理是通用的，我们可以用它来实现更复杂的功能。

在下一章节中，我们将基于这个插件扩展功能，用来转换`gl-matrix`中的其他函数，比如`mat4`函数。同时，我们也要扩展 vec2 函数的功能，让它支持更多的操作符，比如`-`、`*`、`/`等，以及支持更多的操作数，比如：

```
vec2(a) + 1.0; // 向量加实数
vec2(a) + vec2(b) + vec2(c); // 多个向量相加
2.0 + vec2(a); // 实数加向量
-vec2(a); // 向量取负
```

这样，我们就可以实现一个真正完整可用的框架，来大大简化我们的向量操作，从而兼得高性能与使用上的便利性。这正是 Babel 带给我们的最大好处。

最后，给大家布置一个小作业，如果我们要支持`vec2(a) + number`这样的操作，我们应该怎么做呢？如果你有思路，可以在评论区留言，我会在下一章节中给出答案。