babel macro 是修改 AST 的一种新的方式，其实和 babel plugin 差别不大，会了 plugin，macro 也就会了。

这节我们来学习一下 babel macro。

## babel macro 介绍

babel macro 是通过在源码中引入 macro 模块，在要转换的地方调用相应的 api，macro 内部会拿到相应的 ast，然后进行转换的一种方式。

比如源码为：
```javascript
const files = require('../macros/files.macro');

console.log('src files:');
console.log(files('../src'));
console.log('macro files:');
console.log(files('../macros'));
```
编译后的代码为：
```javascript
console.log('src files:');
console.log(["index.js", "sourceCode.js"]);
console.log('macro files:');
console.log(["files.macro.js"]);
```

如果我们写插件，那么就是通过 visitor 找到 files 的函数调用，然后执行 fs.readdirSync 查询出文件列表，之后替换该处的 ast 为 StringLiteral 的数组。

那如果用 macro 怎么写呢？

也是一样的思路，只不过 macro 不需要 visitor，而是直接能找到调用 macro 的对应的 ast，之后进行修改。

下面我们来实现一下上面的 macro。

## babel macro 实例

babel macro 的功能是通过插件实现的，所以要启用 macro，要先引入 babel-plugin-macros 插件。

```javascript
const { transformFileSync } = require('@babel/core');
const path = require('path');

const sourceFilePath = path.resolve(__dirname, './sourceCode.js');

const { code } = transformFileSync(sourceFilePath, {
    plugins: [
        [
            'babel-plugin-macros'
        ]
    ]
});

console.log(code);
```
之后，我们在源码中引入了 macro，约定 .macro 结尾的就是 macro。

```javascript
const files = require('../macros/files.macro');

console.log('src files:');
console.log(files('../src'));
console.log('macro files:');
console.log(files('../macros'));
```
编译的时候就会调用到我们定义的 macro：
```javascript
const { createMacro } = require('babel-plugin-macros')
const path = require('path');
const fs = require('fs');

function logMacro({ references, state, babel}) {

}

module.exports = createMacro(logMacro);
```

macro 的形式是一个函数，之后调用 createMacro 的 api，来创建 macro。

当 babel 编译时，会执行 babel macro plugin 插件，而插件里实现了调用 macro 的逻辑，就会把相应的 ast 作为参数传入到 macro，也就是 references 参数。

references 参数是所有调用该 macro 的 ast 的 path 数组，有了 path 之后后面的我们就会了，就是通过 path 的 api 进行 ast 的增删改。

这里的修改 ast 的逻辑就是读取目录下的所有文件，然后用文件列表替换 macro 的 ast。

macro 第一个参数有三个属性：
- references： 所有引用 macro 的 path
- state： macro 之间传递数据的方式，能拿到 filename
- babel：各种 api，和 babel plugin 的第一个参数一样。

```javascript
const { createMacro } = require('babel-plugin-macros')
const path = require('path');
const fs = require('fs');

function logMacro({ references, state, babel}) {
  const { default: referredPaths = [] } = references;

  referredPaths.forEach(referredPath => {
    const dirPath =path.join(path.dirname(state.filename), referredPath.parentPath.get('arguments.0').node.value);
    
    const fileNames = fs.readdirSync(dirPath);

    const ast = babel.types.arrayExpression(fileNames.map(fileName => babel.types.stringLiteral(fileName)));

    referredPath.parentPath.replaceWith(ast);
  });
}

module.exports = createMacro(logMacro);
```

这样，我们就实现了一个 macro。

## 优缺点

babel macro 优点是不用再通过 visitor 查找 ast 了，只需要在需要转换的地方调用下 macro 的 api，就可以找到对应 ast。

但简化的代价就是查找其他 ast 就不是那么方便了，因为是从一个点的 ast 逐步向上查找的过程。

## 总结

babel macro 是基于 babel plugin 封装出来的，不再是通过 visitor 来查找 ast，而是在源码调用 macro 的 api，然后在 macro 的实现里就能拿到所有调用 macro 的 path，之后就可以对 ast 做修改了。

macro 的使用需要引入 babel-plugin-macros 来启用 macro 功能，在源码中引入 .macro结尾的模块，之后在 macro 实现里面调用 crateMacro 来创建 macro。

macro 会传入一个参数，包含 references、state、babel 3个属性，分别是 path 数组、macro 之间传递数据的 state，以及各种 api。

macro 只是一种封装出来的新的修改 ast 的方式，优点是不需要使用 visitor 查找，但缺点是查找其他 ast 不方便。

（代码在[这里](https://github.com/QuarkGluonPlasma/babel-plugin-exercize)，建议 git clone 下来通过 node 跑一下）
