parser 的功能是把源码转成 AST，支持各种语法的 parse。

babel 的 parser 并不是从零自己实现的，而是基于 acron 做了扩展。在 [《js parser 的历史》](https://juejin.cn/book/6946117847848321055/section/6947682728200372232)那一节大部分讲过 js parser 都是 estree 标准的，acorn 也是 estree 标准的实现，支持插件，

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08bfa0a1014d452a9b8d9940e106bf25~tplv-k3u1fbpfcp-watermark.image)

babel 就是基于 acorn，然后实现了 jsx、typescript、flow 等语法插件的扩展，并且修改了一些 AST，比如 Literal 扩展为了 StringLitreal、NumericLiteral 等。

所以，我们也不会从零实现 parser，也会采用基于 acron 扩下扩展的方式。

## 思路分析

acorn 插件的实现方式是继承之前的 Parser 返回新的 Parser，重写一些方法来做 AST 修改和扩充。

比如：

```javascript
module.exports = function(Parser) {
    return class extends Parser {
        parseLiteral (...args) {
            const node = super.parseLiteral(...args);
            switch(typeof node.value) {
                case 'number':
                    node.type = 'NumericLiteral';
                    break;
                case 'string':
                    node.type = 'StringLiteral';
                    break;
            }
            return  node;
        }
    }
}
```
这是我们之前实现过的，把 Literal 扩展为 StringLiteral、NumericLiteral 等的一个插件。

之前还实现过扩展一个 guang 的关键字的插件。

我们希望提供这种 api：

```javascript
const ast = parser.parse(sourceCode, {
    plugins: ['literal', 'guangKeyword']
});
```

也就是根据传入的 plugins 来确定使用什么插件，然后返回扩展以后的 parser。实现方式就是保存一个插件的 map，按照传入的插件名使用就行。

## 代码实现

我们把插件放到不同的模块中，然后通过 map 来维护：

```javascript
const syntaxPlugins = {
    'literal': require('./plugins/literal'),
    'guangKeyword': require('./plugins/guangKeyword')
}
```

之后实现 parse 的时候，先把 options 做合并，之后根据 plugin 来依此启用不同的插件。
```javascript
const defaultOptions = {
    plugins: []
}

function parse(code, options) {
    const resolvedOptions  = Object.assign({}, defaultOptions, options);

    const newParser = resolvedOptions.plugins.reduce((Parser, pluginName) => {
        let plugin = syntaxPlugins[pluginName]
        return plugin ? Parser.extend(plugin) : Parser; 
    }, acorn.Parser);

    return newParser.parse(code, {
        locations: true
    });
}
```

这里要指定 locations 为 true，也就是保留 AST 在源码中的位置信息，这个在生成 sourcemap 的时候会用的。

这样就实现了 parse 和语法插件功能。

## 总结

parser 负责把源码转成 AST，js parser 大多是符合 estree 的标准的，acorn 也是对它的实现。

acorn 支持插件，可以扩展语法，babel parser 就是 fork 了 acorn 做了扩展，我们也通过类似的方式，实现了两个语法插件，然后通过 options 启用。

当然，我们没有实现类似 jsx、typescript 这种复杂语法插件。我们的目的只是理清 babel 实现思路，而不是做一个完善的 babel。

（代码在[这里](https://github.com/QuarkGluonPlasma/babel-plugin-exercize)，建议 git clone 下来通过 node 跑一下）



