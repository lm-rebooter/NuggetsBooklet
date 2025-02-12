第一次接触 Node.js 的同学可能会觉得，**Node.js 和浏览器的 JavaScript 最大的不同就在于 Node.js 是模块化**的。那真的是这样吗？模块化又是什么呢？让我们一起往下看。

所谓模块化，就是指代码具有模块结构，**整个应用可以自顶向下划分为若干个模块，每个模块彼此独立，代码不会相互影响**。模块化的目的是使代码可以更好地复用，从而支持更大规模的应用开发。

早期的浏览器 JavaScript 本身不是模块化的，表现为浏览器加载的多个 JS 文件内容没有彼此隔离，顶层的 var 变量声明和函数声明在不同的文件之间可以互相访问，在语言核心层面上也没有提供任何模块封装机制。

Node.js 诞生的时候，Web 已经发展到了一定的规模，而且 Node.js 本身也设计为要能够解决更大规模和更复杂的问题。因此，对于 Node.js 来说，模块化就成为必须要有的特性。

Node.js 诞生之初，JavaScript 还没有标准的模块机制，因此 Node.js 一开始采用了[CommonJS 规范](http://www.commonjs.org/)。随后，JavaScript 标准的模块机制`ES Modules`诞生，浏览器开始逐步支持`ES Modules`。Node.js 从`v13.2.0`之后也引入了规范的`ES Modules`机制，同时兼容早期的`CommonJS`。

早在 Node.js 支持`ES Modules`之前，像`Babel`这样的编译工具和`Webpack`这类打包器，已经能够将规范的`ES Modules`模块机制编译成`Node.js`的`CommonJS`模块机制了。而现在，Node.js 自身对`ES Modules`的支持也越发成熟。

所以，现在我们写 Node.js 模块的时候，可以有 3 种方式：

1. 直接采用最新的`ES Modules`，在`Node.js v13.2.0`以后的版本中可行，但是使用上有些条件，稍后我们会详细说明。
2. 采用`ES Modules`，通过 Babel 编译。在[《前端进阶十日谈》](https://juejin.cn/book/6891929939616989188/section/6891951392114606094)课程的最后一天中，我们介绍了前端工程化，其中就讨论了 Babel，感兴趣的同学可以去看一下那个课程。不看也没关系，本课程后续的章节中，也会有 Babel 更深入的介绍。
3. 仍然使用旧的`CommonJS`规范，预计未来 Node.js 在很长一段时间内依然会同时兼容`ES Modules`和`CommonJS`。

在这一节课里，我们先通过例子简单介绍一下`ES Modules`规范的语法，然后在下一节课我们介绍`CommonJS`规范的使用方法。在后续课程中，我们会经常用到它们。

## 第一个 ES-Modules 模块

接下来，我们先封装一个模块。还记得上一节课我们写的那个例子吗？我们重新回顾一下它的代码：

```js
const template = (text) => `
                 __._                                   
                / ___)_                                 
               (_/Y ===\\                            __ 
               |||.==. =).                            | 
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

const argv = process.argv;
console.log(template(argv[2] || '巧言令色，鮮矣仁！'));
```

在这里，我们定义了一个 template 方法，然后直接接受命令行输入，最后将内容输出。现在，我们要将这个 template 方法给封装成一个模块。

我们用`ES Modules`的方式对它进行封装，先在项目目录下创建一个`ziyue.mjs`文件（_注意，这里的文件后缀名是`.mjs`_），然后编辑它的内容：

```js
// ziyue.mjs
const ziyue = (text) => `
                 __._                                   
                / ___)_                                 
               (_/Y ===\\                            __ 
               |||.==. =).                            | 
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

export {ziyue}; //将ziyue函数对象导出
```

这里，我们将`template`变量名修改为`ziyue`，在代码的最后一行加上一行`export {ziyue}`，就把模块中的`ziyue`对象给导出了。这就是我们的 ES-Modues 规范的模块了。我们可以把`export { ... }`称为这个模块的**公共 API**。

创建好模块后，我们如何将这个模块的公共API导入到其它模块呢？可以创建一个`index.mjs`文件，通过`import`语法将`ziyue`导进来：

```js
import {ziyue} from './ziyue.mjs'; // 引入ziyue模块

const argv = process.argv;
console.log(ziyue(argv[2] || '有朋自远方来，不亦乐乎！'));
```

然后运行`node index.mjs`，可以得到和上一节课一样的输出：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff3f026cebf8494780cc9ef421c041ee~tplv-k3u1fbpfcp-watermark.image?)

通过例子，我们可以看出`ES Modules`的基本使用方法。

导出对象：

```js
export { 模块的公共API }
```

从模块中引入导出的API：

```js
import { API名字 } from 模块名
```

上面我们导出的对象`ziyue`是一个函数对象。实际上，我们不止可以导出函数，还可以导出模块中任何类型的数据。

```js
// foo.mjs
const a = 10;
const b = 'hello';
const c = () => {
  return 'greeting';
};

export {a, b, c}; // 导出 a、b、c
```

然后在另一个模块中引用它们的全部或一部分。

```js
// bar.mjs
import {a, c} from './foo.mjs';
console.log(a); // 10
console.log(c()); // greeting
```

可能你觉得`export {a, b, c}`这样的形式是导出了一个对象，认为可以将export写成如下形式：

```js
export {foo: 'bar'}; // 错误的语法
```

但实际上这是不对的，我们只能写成：

```js
const foo = 'bar';
export {foo};
```

或者我们可以简写成：

```js
export const foo = 'bar';
```

但**不能**写成 `export {foo: 'bar'}`。

如果我们需要在 export 的时候重新命名导出的 API 名字，可以这么写：

```js
// foo.mjs
const a = 10;
const b = 'hello';
const c = () => {
  return 'greeting';
};

export {
  a as d,
  b as e,
  c as f
}; // 导出 a、b、c 三个数据，重新命名为 d、e、f
```

另外，ES Modules 还可以用`export default`导出一个默认模块，默认模块可以在`import`的时候用任意名字引入，比如我们把前面例子的`export {ziyue};`修改成`export default ziyue`：

```js
const ziyue = (text) => { ... };
export default ziyue;
```

那么我们就可以用如下语法引入：

```js
import ziyue /* 或其他名字 */ from './ziyue.mjs';
```

_注意：一个模块的 export default 只能导出一个默认 API。如果这个模块还有其他的 API 需要导出，那么只能使用 export了。_

```js 
// ziyue.mjs

const ziyue = (text) => { ... } ;
const a = 10;
const b = '君喻学堂';

export default ziyue;
export {a, b};
```

在使用 ziyue 模块的时候，我们可以这样引入它的 API：
```js
// index.j
import ziyue from './ziyue.mjs';
import {a, b} from './ziyue.mjs';
  ...
```

我们可以任意命名导出的 API 名字，同样，我们也可以在引入的时候给其它模块的 API 命名。比如：

```js
import {a as c, b as d} from './ziyue.mjs';
```

如果是用`export default`导出的`ziyue`API，我们可以这样命名：

```js
import foobar from `./ziyue.mjs`; // 将ziyue重新命名为foobar
```

我们也可以在导入的时候，将这些导出的 API 声明成一个任意名字的对象的属性：

```js
import * as foo from './ziyue.mjs';

console.log(foo.a); // 10
console.log(foo.b); // 君喻学堂
console.log(foo.default); // [Object Function]
```

💡这里需要注意的是第三行`foo.default`，为什么这里是`default`而不是`ziyue`呢？因为我们的`ziyue`API 是用`export default`方式导出的，所以当我们将`foo`打印出来的时候，结果是这样的：

```js
import * as foo from './ziyue.mjs';
console.log(foo) // {a, b, default}
```
`ziyue`在 foo 对象中对应的属性名是`default`。

以上基本就是 ESModule 的全部规则了。关于这一部分完整的语法，你可以查看[MDN文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)和[Node.js的API文档](https://nodejs.org/docs/latest/api/esm.html)。

这里还有一点需要注意，我们命名 js 模块文件不是用 .js 扩展名，而是用 .mjs 扩展名。这是因为 Node.js 目前默认用`CommonJS`规范定义 .js 文件的模块，用`ES Modules`定义 .mjs 文件的模块。如果我们直接将`index.mjs`文件改成`index.js`，然后运行`node index.js`，控制台上将报告错误信息。

![](https://p3.ssl.qhimg.com/t01cf26b0402615bcf0.jpg)

如果要用`ES Modules`定义 .js 文件的模块，可以在 Node.js 的配置文件`package.json`中设置参数`type: module`。

`package.json`可以手动创建，也可以通过命令行创建。如果你安装了 NPM 包管理工具，用 NPM 命令行`npm init -y`可以快速创建一个 package.json 文件；如果你还未安装，也没关系，我们先手工创建一个文件，在后续课程中，我们会介绍 NPM。

```json
{
  "type": "module"
}
```

我们创建了 package.json 文件，只添加一项配置：`"type": "module"`，然后我们将`ziyue.mjs`和`index.mjs`文件名修改为`ziyue.js`和`index.js`，运行`node index.js`，就可以得到正确的输出结果了。

## 总结

Node.js 运行时环境和浏览器运行时环境，除了提供的 API 存在差异外，另一个重要的区别在于 Node.js 为 JavaScript 提供了模块化的管理特性。

Node.js 的模块管理遵循两种规范：ES Module 和 CommonJS。本节课主要介绍了 ES Module 规范下模块的创建和引入的语法。