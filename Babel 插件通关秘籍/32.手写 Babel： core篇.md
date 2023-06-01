core 包的功能是串联整个编译流程，并且实现插件和 preset。

这节我们来实现一下 core 包。

## 思路分析

前面，我们实现了 parser、traverse、generator 包，使用方式是这样的：

分别调用 parse、traverse、generate，来完成源码的 parse、AST 的遍历和修改，以及目标代码和 sourcemap 的打印。

```javascript
const sourceCode = `
const c = 1;
const d = 2;
const e = 4;

function add(a, b) {
    const tmp = 1;
    return a + b;
}

add(c, d);
`;

const ast = parser.parse(sourceCode, {
    plugins: ['literal', 'guangKeyword']
});

traverse(ast, {
    Program(path) {
       Object.entries(path.scope.bindings).forEach(([id, binding]) => {
        if (!binding.referenced) {
            binding.path.remove();
        }
       });
    }
});

const { code, map} = generate(ast, sourceCode, 'foo.js');
console.log(code);
console.log(map);
```


而如果用了 core 包，使用方式是这样的：

```javascript
function plugin1(api, options) {
    return {
        visitor: {
            Program(path) {
               Object.entries(path.scope.bindings).forEach(([id, binding]) => {
                    if (!binding.referenced) {
                        binding.path.remove();
                    }
                });
            }
    }
}
const { code, map } = transformSync(sourceCode, {
    parserOpts: {
        plugins: ['literal']
    },
    fileName: 'foo.js',
    plugins: [
        [plugin1, {}]
    ],
    presets: []
});
```

可以看到，transformSync 封装了 parse、traverse、generate 的逻辑，并且还实现了插件和 preset 机制。

集成 parse、traverse、generate 比较简单，但插件和 preset 是怎么实现的呢？

插件是一个函数返回包含 visitor 的对象，我们只要把各种通过 options 传入的插件，在 transformSync 里面合并，之后把合并后的 visitors 传入  traverse 方法就可以了。

而 preset 是插件的集合，调用函数返回插件数组，之后再调用插件返回 visitor 等，然后 visitor，调用 traverse。

此外要注意的是 babel 插件的顺序是先 plugin 后 preset，plugin 从前往后、preset 从后往前。

## 代码实现

首先我们集成 parse、traverse、generate 3步：

```javascript
function transformSync(code, options) {
    const ast = parser.parse(code, options.parserOpts);

    const visitors = {};

    traverse(ast, visitors);
    return generate(ast, code, options.fileName);
}
```

这里的 visitor 就是插件里面 visitor 的合并，我们实现下插件机制：
```javascript
function transformSync(code, options) {
    const ast = parser.parse(code, options.parserOpts);

    const pluginApi = {
        template
    }
    const visitors = {};
    options.plugins && options.plugins.forEach(([plugin, options]) => {
        const res = plugin(pluginApi, options);
        Object.assign(visitors, res.visitor);
    });

    traverse(ast, visitors);
    return generate(ast, code, options.fileName);
}
```

其实比较简单，就是调用 options 里面的 plugin，传入 options、api，然后把返回的 visitor 合并，之后传入 traverse。

而 preset 是插件的集合，所以要多调用一层，并且因为顺序是从右往左，所以要 reverse 一下。

```javascript
options.presets && options.presets.reverse().forEach(([preset, options]) => {
    const plugins = preset(pluginApi, options);
    plugins.forEach(([plugin, options])=> {
        const res = plugin(pluginApi, options);
        Object.assign(visitors, res.visitor);
    })
})
```

完整代码如下：
```javascript
function transformSync(code, options) {
    const ast = parser.parse(code, options.parserOpts);

    const pluginApi = {
        template
    }
    const visitors = {};
    options.plugins && options.plugins.forEach(([plugin, options]) => {
        const res = plugin(pluginApi, options);
        Object.assign(visitors, res.visitor);
    });
    options.presets && options.presets.reverse().forEach(([preset, options]) => {
        const plugins = preset(pluginApi, options);
        plugins.forEach(([plugin, options])=> {
            const res = plugin(pluginApi, options);
            Object.assign(visitors, res.visitor);
        })
    })

    traverse(ast, visitors);
    return generate(ast, code, options.fileName);
}
```

## 总结

core 包集成了 parser、traverse、generator 等包，并且实现了 plugin、preset 机制。

我们会把插件返回的 visitor 做合并，然后作为 visitor 调用 traverse。

插件是一个函数，传入可用的 api 以及调用时传入的 options，返回 visitor 等，而 preset 是插件的集合，要调用 preset 之后拿到插件集合，之后再调用具体的插件，最后把所有 visitor 做合并。

babel 是微内核架构，就是因为核心只实现了编译流程，具体的转换功能都是通过插件来实现的，而 preset 则是为了简化用户使用 babel 的成本而引入的一种机制，是插件的集合，让用户不需要直接配置具体的插件，选择不同的 preset 即可。

（代码在[这里](https://github.com/QuarkGluonPlasma/babel-plugin-exercize)，建议 git clone 下来通过 node 跑一下）
