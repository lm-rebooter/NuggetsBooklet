上一节课我们说过，Node.js 诞生的时候，模块管理采用`CommonJS`规范。`CommonJS`规范是一套和`ES Modules`不同的模块管理方式。因为 Node.js 的`ES Modules`还处在实验特性阶段，大部分 Node 模块还是用`CommonJS`规范实现的。

这一节课我们就来看一下，如果用`CommonJS`规范实现`ziyue`模块该怎么做。

我们还是先写一个`ziyue.js`文件，内容如下：

```js
const ziyue = (text) => `
                 __._                                   
                / ___)_                                 
               (_/Y ===\\                                __ 
               |||.==. =).                                | 
               |((| o |p|      |  ${text}
            _./| \\(  /=\\ )     |__                    
          /  |@\\ ||||||||.                             
         /    \\@\\ ||||||||\\                          
        /   \\  \\@\\ ||||||//\\                        
       (     Y  \\@\\|||| // _\\                        
       |    -\\   \\@\\ \\\\//    \\                    
       |     -\\__.-./ //\\.---.^__                        
       | \\    /  |@|__/\\_|@|  |  |                         
       \\__\\      |@||| |||@|     |                    
       <@@@|     |@||| |||@|    /                       
      / ---|     /@||| |||@|   /                                 
     |    /|    /@/ || |||@|  /|                        
     |   //|   /@/  ||_|||@| / |                        
     |  // \\ ||@|   /|=|||@| | |                       
     \\ //   \\||@|  / |/|||@| \\ |                     
     |//     ||@| /  ,/|||@|   |                        
     //      ||@|/  /|/||/@/   |                        
    //|   ,  ||//  /\\|/\\/@/  / /                      
   //\\   /   \\|/  /H\\|/H\\/  /_/                     
  // |\\_/     |__/|H\\|/H|\\_/                         
 |/  |\\        /  |H===H| |                            
     ||\\      /|  |H|||H| |                            
     ||______/ |  |H|||H| |                             
      \\_/ _/  _/  |L|||J| \\_                          
      _/  ___/   ___\\__/___ '-._                       
     /__________/===\\__/===\\---'                     
                                                        
`;

module.exports = ziyue;
```

然后写一个`index.js`文件：

```js
const ziyue = require('./ziyue');

const argv = process.argv;
console.log(ziyue(argv[2] || '有朋自远方来，不亦乐乎！'));
```

运行`node index.js`就可以得到我们要的输出了。可以看到，实际上`CommonJS`和`ES Modules`类似，和`ES Modules`不同的地方是，`CommonJS`采用`module.exports/require`而`ES Modules`则采用`export/import`。

同样，CommonJS 规范可以导出多个接口：

```js
// abc.js
const a = 1;
const b = 2;
const c = () => a + b;

module.exports = {
  a, b, c
};
```

```js
const {a, b, c} = require('./abc.js');
console.log(a, b, c()); // 1 2 3
```

与`ES Modules`不同的是，`module.exports`导出的是真正的对象，所以我们可以这样给 API 别名：

```js
// abc.js
const a = 1;
const b = 2;
const c = () => a + b;

module.exports = {
  d: a,
  e: b,
  f: c
};
```

```js
const {d, e, f} = require('./abc.js'); // 这里要用d、e、f了
console.log(d, e, f()); // 1 2 3
```

在 CommonJS 规范中，有两种导出模块 API 的方式：`module.exports`和`exports`。这两个变量默认情况下都指向同一个初始值`{}`。因此，除了使用`module.exports`我们也可以使用`exports`变量导出模块的 API：

```js
// abc.js
exports.a = 1;
exports.b = 2;
exports.c = () => a + b;
```

但是，这种用法**不能**和`module.exports`混用。因为`module.exports = 新对象`改写了`module.exports`的默认引用，而引擎默认返回的是`modeule.exports`，从而导致`exports`指向的初始空间无效了。这样一来，原先用`exports`导出的那些数据就不会被导出了。

```js
exports.a = 1;
exports.b = 2;
exports.c = () => a + b;
const d = 'foobar';
moudle.exports = {d};
```

上面的代码只导出了`d:foobar`而没有导出`a、b、c`，因为`module.exports = {d}`覆盖了默认的初始空间，这让之前 exports 变量上增加的属性（a、b、c）不会再被导出。

`CommonJS`规范有 1、2 两个版本，`exports.属性名 = ...`的用法属于早期，也就是 CommonJS 1 的用法。`module.exports`用法属于`CommonJS 2`的用法，我们应该尽量用`module.exports`，避免用`exports.属性名 = `的写法。

## `ES Modules`的向下兼容

在 Node.js 环境中，ES Modules 向下兼容 CommonJS，因此用`import`方式可以引入 CommonJS 方式导出的 API，但是会以 `default` 方式引入。

因此以下写法：

```js
// abc.js 这是一个 CommonJS 规范的模块
const a = 1;
const b = 2;
const c = () => a + b;

module.exports = {a, b, c};
```

它可以用`ES Modules`的`import`引入：

```js
import abc from './test.js';
console.log(abc.a, abc.b, abc.c()); // 1 2 3
```

但是不能用

```js
import {a, b, c} from './test.js';
```

因为 `module.exports = {a, b, c}` 相当于：

```js
const abc = {a, b, c};
export default abc;
```

## `ES Modules`与`CommonJS`的主要区别

`ES Modules`与`CommonJS`的主要有四个区别。第一个区别前面也提到过，**如果要在导出时使用别名**，`ES Modules`要写成：

```js
export {
  a as d,
  b as e,
  c as f,
}
```

而对应的`CommonJS`的写法是：

```js
module.exports = {
  d: a,
  e: b,
  f: c,
}
```

第二个区别是，**`CommonJS`在`require`文件的时候采用文件路径，并且可以忽略 .js 文件扩展名**。也就是说，`require('./ziyue.js')`也可以写成`require('./ziyue')`。但是，`ES Modules`在`import`的时候采用的是 URL 规范就不能省略文件的扩展名，而必须写成完整的文件名`import {ziyue} from './ziyue.mjs'`，`.mjs`的扩展名不能省略。

💡如果你使用 Babel 编译的方式将`ES Modules`编译成`CommonJS`，因为 Babel 自己做了处理，所以可以省略文件扩展名，但是根据规范还是应该保留文件扩展名。

第三个区别是，**`ES Modules`的`import`和`export`都只能写在最外层，不能放在块级作用域或函数作用域中**。比如：

```js
if(condition) {
  import {a} from './foo';
} else {
  import {a} from './bar';
}
```

这样的写法，在`ES Modules`中是不被允许的。但是，像下面这样写在`CommonJS`中是被允许的：

```js
let api;
if(condition) {
  api = require('./foo');
} else {
  api = require('./bar');
}
```

事实上，CommonJS 的 require 可以写在任何语句块中。

第四个区别是，**require 是一个函数调用，路径是参数字符串，它可以动态拼接**，比如：

```js
const libPath = ENV.supportES6 ? './es6/' : './';
const myLib = require(`${libPath}mylib.js`);
```

但是`ES Modules`的`import`语句是不允许用动态路径的。

## import() 动态加载

`ES Modules`不允许`import`语句用动态路径，也不允许在语句块中使用它。但是，它提供了一个异步动态加载模块的机制 —— 将`import`作为异步函数使用。

所以我们可以这样动态加载：

```js
(async function() {
  const {ziyue} = await import('./ziyue.mjs');
  
  const argv = process.argv;
  console.log(ziyue(argv[2] || '巧言令色，鮮矣仁！'));
}());
```

同样地，我们也可以向下兼容地加载 CommonJS 模块，`module.exports`导出的对象会被作为`default`对象加载进来。

一般来说，在写 Node.js 模块的时候，我们更多采用静态的方式引入模块。但是动态加载模块在一些复杂的库中比较有用，尤其是跨平台开发中，我们可能需要针对不同平台的环境加载不同的模块，这个时候采用动态加载就是必须的了。

到这里，我们基本上介绍完了 Node.js 模块管理的 ES Modules 和 CommonJS 的基本用法，在后续的课程中，我们将会经常用到它们。关于 CommonJS 还有更多的用法，如果你想了解，可以参考[Node.js 官方 API 文档](http://nodejs.cn/api/modules.html)。

## 总结

这一节课，我们介绍了 CommonJS 规范创建和引入模块的语法。与 ES Module 语法不同，CommonJS 规范采用 module.export/require 的方式引出和引入模块。由于 ES Module 的向下兼容，遵循 CommonJS 规范的模块可以被 ES Module 规范以 default 方式引入。

此外，我们还要注意，CommonJS 和 ES Module 规范两者有四个不同：

1. 重命名导出的公共 API 的方式不同；

2. CommonJS 在`require`文件的时候可以忽略 .js 文件扩展名，而 ES Module 在`import`文件的时候不能忽略 .mjs 的扩展名；

3. CommonJS 规范的`require`是可以放在块级作用域中的，而 ES Module 的`import`则不能放在任何语句块中；

4. CommonJS 的`require`是一个函数，可以动态拼接文件路径，而`ES Modules`的`import`语句是不允许用动态路径的。

虽然 ES Module 规范不允许`import`语句动态拼接路径，但是它允许`import`作为异步函数异步动态加载模块。
