这一节，我们继续讨论 Babel 插件机制，完善我们的向量运算插件。

## 测试先行

类似于 Babel 插件这类应用，有明确的输入和期望输出，我们可以以测试先行的方式来实现代码。也就是说，我们先写好测试用例，然后再实现代码。根据测试用例，可以知道代码应该怎么写，还能反过来通过测试用例来验证我们的代码是否正确。

我们的测试用例如下：

```
const { vec2 } = require('gl-matrix');
​
const a = vec2(1, 2);
const b = vec2(3, 4);
const c = vec2(a) + vec2(b);
​
const d = vec2(a) + 1.0;
const e = vec2(a) + vec2(b) + vec2(c);
const f = 2.0 + vec2(a);
const g = -vec2(a);
```

在上一节，我们已经实现了测试用例中 a、b、c 的转换，现在我们需要实现 d、e、f、g 的转换。

## 实现

首先是 d，我们要将`vec2(a) + 1.0`转换为`vec2.add(vec2.create(), a, vec2.fromValues(1.0, 0))`。

这个实现相对简单一些，我们只需要在`BinaryExpression`节点中，判断左右两边的节点类型，如果左边是`vec2`，右边是`NumberLiteral`，就进行转换。

```
  ...
      BinaryExpression: {
        exit(path) {
          const { left, right } = path.node;
          if (t.isCallExpression(left) && left.callee.name === 'vec2') {
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
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
            } else if (t.isNumericLiteral(right)) {
              const { operator } = path.node;
              if (operator === '+') {
                const node = t.callExpression(
                  t.identifier(`${left.callee.name}.add`),
                  [
                    t.callExpression(
                      t.identifier(`${left.callee.name}.create`),
                      [],
                    ),
                    left.arguments[0],
                    t.callExpression(
                      t.identifier(`${left.callee.name}.fromValues`),
                      [right, t.numericLiteral(0)],
                    )],
                );
                path.replaceWith(node);
              }
            }
          }
        },
      },
  ...
```

如上面代码所示，在`BinaryExpression`节点中，我们判断左边是`vec2`，右边是`NumberLiteral`，然后进行转换。

接着是 e，我们要将`vec2(a) + vec2(b) + vec2(c)`转换为`vec2.add(vec2.create(), vec2.add(vec2.create(), a, b), c)`。

这个实现相对复杂一些，我们需要在`BinaryExpression`节点中，判断左右两边的节点类型，如果左边是`vec2.add`，右边是`vec2`，就进行转换。

代码如下：

```
  ...
      BinaryExpression: {
        exit(path) {
          const { left, right } = path.node;
          if (t.isCallExpression(left) && left.callee.name === 'vec2') {
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
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
            } else if (t.isNumericLiteral(right)) {
              const { operator } = path.node;
              if (operator === '+') {
                const node = t.callExpression(
                  t.identifier(`${left.callee.name}.add`),
                  [
                    t.callExpression(
                      t.identifier(`${left.callee.name}.create`),
                      [],
                    ),
                    left.arguments[0],
                    t.callExpression(
                      t.identifier(`${left.callee.name}.fromValues`),
                      [right, t.numericLiteral(0)],
                    )],
                );
                path.replaceWith(node);
              }
            }
          } else if (t.isCallExpression(left) && left.callee.name === 'vec2.add') {
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
                const node = t.callExpression(
                  t.identifier(left.callee.name),
                  [
                    t.callExpression(
                      t.identifier(`${right.callee.name}.create`),
                      [],
                    ),
                    left,
                    right.arguments[0]],
                );
                path.replaceWith(node);
              }
            }
          }
        },
      },
    },
  ...
```

这样我们就实现了 e 的转换，那么同样的道理，f 的转换是判断 left 为`NumericLiteral`，right 为`vec2`，然后进行转换。

```
...
else if (t.isNumericLiteral(left) && t.isCallExpression(right) && right.callee.name === 'vec2') {
  const { operator } = path.node;
  if (operator === '+') {
    // https://babeljs.io/docs/en/babel-types
    const node = t.callExpression(
      t.identifier(`${right.callee.name}.add`),
      [
        t.callExpression(
          t.identifier(`${right.callee.name}.create`),
          [],
        ),
        t.callExpression(
          t.identifier(`${right.callee.name}.fromValues`),
          [left, t.numericLiteral(0)],
        ),
        right.arguments[0],
      ],
    );
    path.replaceWith(node);
  }
}
...
```

这样就实现了 f 的转换。最后一个规则是 g，g 是一个一元表达式，我们只需要判断节点类型为`UnaryExpression`，然后进行转换即可。

我们需要将 g 的转换为`vec2.negate(vec2.create(), a)`。

```
...
UnaryExpression: {
  exit(path) {
    const { operator, argument } = path.node;
    if (operator === '-') {
      if (t.isCallExpression(argument) && argument.callee.name === 'vec2') {
        const node = t.callExpression(
          t.identifier(`${argument.callee.name}.negate`),
          [
            t.callExpression(
              t.identifier(`${argument.callee.name}.create`),
              [],
            ),
            argument.arguments[0]],
        );
        path.replaceWith(node);
      }
    }
  },
},
...
```

最终，我们完整的插件代码如下：

```
module.exports = function ({ types: t }) {
  // plugin contents
​
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
      UnaryExpression: {
        exit(path) {
          const { operator, argument } = path.node;
          if (operator === '-') {
            if (t.isCallExpression(argument) && argument.callee.name === 'vec2') {
              const node = t.callExpression(
                t.identifier(`${argument.callee.name}.negate`),
                [
                  t.callExpression(
                    t.identifier(`${argument.callee.name}.create`),
                    [],
                  ),
                  argument.arguments[0]],
              );
              path.replaceWith(node);
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
            } else if (t.isNumericLiteral(right)) {
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
                    t.callExpression(
                      t.identifier(`${left.callee.name}.fromValues`),
                      [right, t.numericLiteral(0)],
                    )],
                );
                path.replaceWith(node);
              }
            } else {
              // console.log(right);
            }
          } else if (t.isCallExpression(left) && left.callee.name === 'vec2.add') {
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
                // https://babeljs.io/docs/en/babel-types
                const node = t.callExpression(
                  t.identifier(left.callee.name),
                  [
                    t.callExpression(
                      t.identifier(`${right.callee.name}.create`),
                      [],
                    ),
                    left,
                    right.arguments[0]],
                );
                path.replaceWith(node);
              }
            }
          } else if (t.isNumericLiteral(left) && t.isCallExpression(right) && right.callee.name === 'vec2') {
            const { operator } = path.node;
            if (operator === '+') {
              // https://babeljs.io/docs/en/babel-types
              const node = t.callExpression(
                t.identifier(`${right.callee.name}.add`),
                [
                  t.callExpression(
                    t.identifier(`${right.callee.name}.create`),
                    [],
                  ),
                  t.callExpression(
                    t.identifier(`${right.callee.name}.fromValues`),
                    [left, t.numericLiteral(0)],
                  ),
                  right.arguments[0],
                ],
              );
              path.replaceWith(node);
            }
          }
        },
      },
    },
  };
};
```

测试代码运行出来的转换结果如下：

```
"use strict";
​
var _require = require('gl-matrix'),
  vec2 = _require.vec2;
var a = vec2.fromValues(1, 2);
var b = vec2.fromValues(3, 4);
var c = vec2.add(vec2.create(), a, b);
var d = vec2.add(vec2.create(), a, vec2.fromValues(1.0, 0));
var e = vec2.add(vec2.create(), vec2.add(vec2.create(), a, b), c);
var e2 = vec2.add(vec2.create(), vec2.add(vec2.create(), vec2.add(vec2.create(), a, b), c), d);
var f = vec2.add(vec2.create(), vec2.fromValues(2.0, 0), a);
var g = vec2.negate(vec2.create(), a);
```

以上代码能符合我们的转换需求。不过，如果我们都是一条一条规则去写，就要实现 gl-matrix 库的所有规则，工作量会非常庞大，这肯定也不是最佳的办法，因为我们几乎未考虑代码复用。如果要考虑复用，我们应该整体考虑 gl-matrix 的数据类型，把 vec2、vec3、vec4、mat2、mat3、mat4、quat 等数据类型抽象出来，再去写规则，而不是像现在这样一条一条去写。

再则，可以考虑一下，我们确实需要`vec2(a) + vec2(b)`来指定标识符 a 和标识符 b 的变量类型吗？实际上并非如此，如果我们做的更加复杂一些，我们可以通过 path.scope 来跟踪变量，通过赋值表达式（`AssignmentExpress`）来推断变量的类型，这样就可以不用在代码中强制指定变量的类型了。

如此我们就可以实现类似下面的版本：

```
const a = vec2(1, 2);
const b = vec2(3, 4);
const c = a + b;
```

这样的超级简化版本，可以真正让我们的插件在几何计算的时候发挥更大的价值！

如果要把这个插件的实现原理展开来讲，可以作为单独一门课来学了，所以这里就不再继续展开了，我的目的只是通过简单的例子让大家直观了解基本的 Babel 插件开发原理和部分 API，如果想要深入了解，可以参考 Babel 官方文档。

这是我之前实现的 [babel-plugin-transform-gl-matrix](https://github.com/akira-cn/babel-plugin-transform-gl-matrix)，代码在 GitHub 仓库里，有兴趣的同学可以下载下来自行研究。我的图形库 [SpriteJS](https://spritejs.com/#/)依赖了这个插件，它在几何运算的时候表现良好。

## 总结

上一章节和这一章节，我们主要介绍了 Babel 插件的基本原理，以及如何通过 Babel 插件来实现一些代码转换的功能。Babel 插件的开发并不复杂，只要理解了 Babel 插件的基本原理，熟悉一下基础的 API，就可以很容易的开发出自己想要的插件了。

期待大家在实际项目中使用 Babel 插件，让我们的代码更加简洁、高效、易读。