Node.js 为什么能崛起？一方面自然是语言群体使然，JavaScript 群体本来就拥有巨量的人口，可以不换语言就能上手，自然就引来了一大波从业人员；另一方面，“生态”功不可没。

JavaScript 模块机制
---------------

为什么这里提到的是 JavaScript 模块机制，而不是 Node.js 的模块机制？因为模块机制不是 Node.js 特有的，这是一路发展下来的产物，只不过 Node.js 恰好用了其之一二。

最早的时候，JavaScript 只用来做简单的交互操作，非常简单。这个时候自然也没模块的概念，最多是一个 HTML 页面中，嵌入多个 JavaScript 标签，如：

    <html>
      <head>
         <script src="foo.js"></script>
         <script src="bar.js"></script>
         <script>
         alert('Hello world!');
         </script>
      </head>
      <body>
      </body>
    </html>
    

这里面就有三“段” JavaScript 代码，依次是 `foo.js`、`bar.js` 和之后一段嵌入页面的 JavaScript 代码。硬要说其是“模块”也不是不可以，只不过它们在未经特殊处理的前提下，是会互相污染的。比如，在 `foo.js` 中写 `window.alert = function() {}` 是会实实在在影响到后面的。

所谓模块就是为了解决这些问题的：

1.  模块必须是密闭空间，所有与外界沟通交互的事项都必须有明确意图；
2.  模块是为了将大型应用程序切割成独立维护的小块事物，可以更易被使用和维护。

> ### 人类是模块化的
> 
> 按照上述两个问题，人类各器官是“密闭”的，与其他模块交互都是通过各自的“接口”。如胰腺通过主胰管与十二指肠相连，分泌胰液以助消化。接口一旦出问题，则会引起模块故障，急性胰腺炎就是这么来的。其他器官也多多少少会通过各种管子相互连接，进行交互。
> 
> 人类各器官虽然各有关联，但都相对独立。比如胃出问题了，不会让你把整个人换掉，而是定点“修胃”即可，这样更好维护。脑子同理🤪。 ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7cf2e630b824a1da692093dede71e50~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1000&h=667&s=510374&e=png&b=fcf0ee)

JavaScript 后来逐渐发展，Gmail 出来了。Gmail 曾尝试了一些新的概念——AJAX，这个概念在当下早已习以为常，甚至已经开始了“下一代”的技术。Gmail 产品经理基斯·科尔曼（Keith Coleman）曾说：“在编写 Gmail 时，AJAX 这个术语还不存在。”Gmail 推出的时机很耐人寻味，是在大家对邮箱应用已经毫无兴趣的时候。不过所有人却都眼前一亮——原来邮箱还可以这么做。

除了 AJAX 之外，这也昭示着 JavaScript 应用越写越复杂。那自然，大家对“模块”的诉求就开始展露出来。古早时候，虽然在 JavaScript 尚未出现模块概念，但大家已经开始用一些奇技淫巧来做一些事情了。

### IIFE

![04插图1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b20915318a9c46c7ba4d4f04020d0896~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=820&h=488&s=54889&e=png&b=ffffff)

IIFE 就是所谓的古早方式。它全称 Immediately Invoked Function Expression，即[立即函数调用表达式](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE "https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE")。它是一个在定义时就会立即执行的 JavaScript 函数。就像这样：

    (function () {
      // statements
    })();
    

它通过一个闭包来做到内部变量的一些隔离，然后通过立即执行该闭包来得到相应的结果。这样就可以很方便地通过执行一些复杂逻辑来得到一个所谓的“模块”，而把逻辑变成内部私有形式给隔离开来，如：

    const pub = (function () {
      const priv = '你拿不到我';
      return priv.replace('不', '') + '了';
    })();
    

你拿不到 `priv` 的 `'你拿不到我'`，但你可以拿到 `pub` 的 `'你拿到我了'`。

### 四大模块体系

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b2079f002744a2483dbeb8414d84076~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=303&h=148&s=9201&e=png&a=1&b=ffffff)

在 IIFE 之后，业界内迸发出几类 JavaScript 的模块体系。其中最流行的四大体系分别为：

*   CommonJS；
*   AMD；
*   CMD；
*   UMD。

#### AMD / CMD / UMD

这里三大模块体系中，只有首字母不一样，而后两个字母则都是 Module Definition 的缩写。AMD 是 Asynchronous Module Definition，即异步模块定义；CMD 是 Common Module Definition，即一般模块定义，虽然 Common 也含通用意思，但这里将其译为“一般”是为了不与后面 UMD 冲突；UMD 则是 Universal Module Definition，即通用模块定义。

AMD 最开始在 [require.js](https://requirejs.org/ "https://requirejs.org/") 中被使用，其首个提交是在 2009 年发出的。CMD 与 AMD 很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD 推崇依赖就近、延迟执行。CMD 是在推行 [Sea.js](https://seajs.github.io/seajs "https://seajs.github.io/seajs") 中产生的，而 Sea.js 则是玉伯大佬多年前的作品。UMD 是个“大一统”，在当时的野心是对 CommonJS、AMD 和 CMD 做兼容。

由于这三种模块方式与 Node.js 几乎没有关系，就不继续展开了。

#### CommonJS

![04插图2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91b7119891a6464e9f1671ea10a7414c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=642&h=222&s=62169&e=png&b=ffffff)

[CommonJS](https://www.commonjs.org/ "https://www.commonjs.org/") 模块规范发布于 2009 年，由 Mozilla 工程师 Kevin Dangoor 起草，他于当年 1 月发表了一篇文章《[What Server-side JavaScript Needs](https://www.blueskyonmars.com/2009/01/29/what-server-side-javascript-needs/ "https://www.blueskyonmars.com/2009/01/29/what-server-side-javascript-needs/")》。**注意这个时间，2009 年。嘿！这不巧了吗！** 其实 AMD 这类也基本上是在 2009、2010 时间点出现的。而本小册的主角 Node.js，以及其依赖的 V8 也都是相仿阶段出生的。**我们说 2010 年前后几年是泛前端体系开始觉醒的两年是丝毫不怵的。**

CommonJS 最初的主要目的是为除浏览器环境之外的 JavaScript 环境建立模块生态系统公约。继续注意这个词，“除浏览器之外的 JavaScript 环境”。答案是不是呼之欲出？其实 CommonJS 最初不叫 CommonJS，而是叫 ServerJS。后来觉得路走窄了没朋友，就把 Server 改成了 Common——把浏览器又给包括回来了。在 CommonJS 的官网，是这么一句口号：

> JavaScript: not just for browsers any more!

按其说法，在 CommonJS 规范之下，你可以写：

*   服务端 JavaScript 应用；
*   命令行工具；
*   桌面 GUI 应用；
*   混合应用（Titanium，Adobe AIR……）。

怎么看都是 Node.js 的覆盖范围呀。所以在 CommonJS 发布之后，它就一直被 Node.js 所使用，沿用至今。回到本章的标题上，**CommonJS 缩写就是 CJS**。所以，这个就是 Node.js 一直以来的模块规范。

CommonJS 中定义了其需包含三项必选项和一些可选项。

##### 必选项

在一个符合 CommonJS 的 JavaScript 模块中，需包含三个必选项。

**第一个，`require`**。`require` 是一个函数，这个函数有一个参数代表模块标识，它的返回值就是其所引用的外部模块所暴露的 API。

讲得直白一点，就是能通过代码 `const biu = require('boom_shakalaka')` 的形式引入 boom\_shakalaka 这个模块并赋给 biu。

**第二个，模块上下文**。在一个 CommonJS 的模块上下文中，需要有满足如下条件的一些事项存在：

1.  `require` 函数，即前面提到的那个“倒霉鬼”；
2.  `exports` 对象，这是一个用于导出模块内容的通道，对应前面胰腺的“主胰管”；
3.  `module` 对象，内含该模块元信息，比如一个制度的 `id` 字段；实际上，Node.js 中的 `module` 下还含了初始的 `exports` 对象。

**第三个，模块标识**。模块标识其实就是一个字符串，用于传给 `require` 函数。

##### 可选项

可选项中，有两个未指定的约定。在必选项符合 CommonJS 规范的情况下，下面两项无论是什么都可。

1.  模块的存储方案未指定，一个模块的内容可以存在于数据库、文件系统、工厂函数，甚至于一个链接库中；
2.  实现 CommonJS 规范的模块加载器可以支持 PATH 环境变量用以加载时的寻径，但是也可以不支持。

##### 看一眼

上面我只是用通俗的方式来讲述 CommonJS 的规范，并不严谨。若需要严谨的解释，大家可自行前往 CommonJS 的 Wiki 获取官方资料。

[wiki.commonjs.org/wiki/Module…](https://wiki.commonjs.org/wiki/Modules/1.1.1 "https://wiki.commonjs.org/wiki/Modules/1.1.1")

这里给出一个遵循 CommonJS 规范的简单样例代码，同样来自 CommonJS 的 Wiki。其是遵循 CommonJS 规范的模块，但并不代表它就是 Node.js 的模块。

    // math.js
    exports.add = function() {
        var sum = 0, i = 0, args = arguments, l = args.length;
        while (i < l) {
            sum += args[i++];
        }
        return sum;
    };
    
    // increment.js
    var add = require('math').add;
    exports.increment = function(val) {
        return add(val, 1);
    };
    
    // program.js
    var inc = require('increment').increment;
    var a = 1;
    inc(a); // 2
    
    module.id == "program";
    

我们可以看到，在 `increment.js` 模块中，其加载了 `math.js` 模块（类比胰腺），`math.js` 又通过 `exports`（主胰管）将 `add`（胰液）输送到了 `increment.js`（十二指肠）中。

同样，我们可以用类似的话来套用到 `program.js` 与 `increment.js` 中。

它看起来就像这样：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c50ae1ca5a5e4cdf9e5a4ca7141e51fd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=443&h=353&s=14970&e=png&a=1&b=fffefe)

### ECMAScript Modules

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b06dee850b940a9a3de2bb9144aecbf~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=394&h=151&s=10727&e=png&a=1&b=ffffff)

之前 JavaScript 一直没有一个模块机制，所谓的 IIFE、四大模块体系都是三方规范和实现，与 JavaScript 自身并无关系。Node.js 一直以来用的都是 CommonJS 模块机制，而非 “JavaScript 模块机制”或 “ECMAScript 模块机制”。

但 ECMAScript 规范自身一直在迭代。ECMAScript modules 就是 ECMAScript 的官方模块机制了。像 Sea.js、require.js，都是三方实现的，甚至 Node.js 中的 CommonJS 也是 Node.js 在自身代码里面实现的，并不是 V8 的能力。ECMAScript Modules 则不一样，其会被实现对应 ECMAScript 版本的引擎内置在语言特性中，而不用自己实现一套模块机制。比如你用了 V8 对应版本，那么只要通过 V8 的 API 适配一下模块加载，就直接拥有了导入模块的能力。

**ECMAScript Modules 又称 ES Modules，缩写 ESM**。因为其首次在 ECMAScript 6 中[被提出](https://262.ecma-international.org/6.0/#sec-modules "https://262.ecma-international.org/6.0/#sec-modules")，网上也有人称其为 ES6 Modules。这个弯弯绕绕就是在[第三章](https://juejin.cn/book/7196627546253819916/section/7196992628036993028 "https://juejin.cn/book/7196627546253819916/section/7196992628036993028")中提到的“「茴」字的四种写法”。但无论它叫什么，我们都说它是 ECMAScript 规范中定义的模块机制。

它的设计非常“精简”与“官方”，从语法层面就完成了对模块的定义。像 CommonJS 也好，AMD、CMD 等也罢，都是通过三方实现函数和对象来模拟模块，而 ESM 则直接通过 `import` 与 `export` 语法来导入和导出模块。只要宿主支持，那么该语法就直接能用。事实上，大多数现代浏览器都已经支持这种语法了，最新的几个大版本 Node.js 中也有了 ESM 的支持。

CommonJS 是运行时做的模块加载和运行，它可以在代码执行一半的时候以动态的方式加载，这种方法在一些静态分析的时候会造成阻碍。而 ESM 则是在模块顶部以语法的形式加载模块，完全可以做静态分析。

它的语法像这样：

    // export.js
    export default function () {
      console.log('foo');
    }
    
    // import.js
    import foo from 'export';
    foo(); // 'foo'
    

抛开语法、语义及运行时机不说，其实它的效果图还是跟 CommonJS 差不多：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5c933c3f7344daabfd4ee65054d717e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=403&h=353&s=14240&e=png&a=1&b=fefdfd)

这里点到为止，不会讲 ESM 导出导入的各种方式，是 `default` 还是什么 `*`。如果你想补这方面的课，建议可以看看网上文章，资料非常多。或者看看 ECMAScript 规范、Node.js 相关教程，或者阮一峰的《[ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/module "https://es6.ruanyifeng.com/#docs/module")》。

Node.js 的模块机制
-------------

其实在前文提到了，**Node.js 一直以来都是以 CommonJS 作为其模块的基座**，而在最新几个大版本中则加入了对 ESM 的支持。

Node.js 的 ESM 最开始是在 v8.5.0 中支持的，当时还是 Experimental 特性，需要加上 `--experimental-modules` 参数启动 Node.js 才行。Node.js 在 v12.17.0 中移除了 `--experimental-modules` 参数，并于 v12 后续版本中将 ESM 转正（Stable）。

### Node.js 中的 CJS

在 Node.js 中，一个文件被视为一个“模块”，它同样遵循 CommonJS 规范，在一个“模块”中，自带了：

*   `require` 函数；
*   `exports` 对象；
*   `module` 对象。

要导出模块，同样是将胰液输到 `exports` 中。

不过，它也做了一些额外的事情，比如 CommonJS 中定义了模块得是 `.`、`..` 或者小驼峰命名的标识，而 Node.js 则更宽泛，基本上等同于“文件名”。

以及，Node.js 的 `module` 对象下还挂载了个 `module.exports` 对象，其初始值指向 CommonJS 所定义的 `exports` 对象。而真正的“主胰管”是 `module.exports`，并不是 `exports`。当二者指向相同的时候，我们的确是可以 `exports.foo = bar`。但若我们重新指定了 `module.exports`，就相当于我们换了条“主胰管”，原来那条作废了。

    module.exports = {  // 换主胰管手术
      foo: 'bar',
    };
    
    exports.hello = 'world';  // 原主胰管作废
    

在一个模块的作用域中，除了上面提到的 CommonJS 规范的内容、Node.js 自己做的改变外，Node.js 还增加了一些内容。

*   `__dirname`：这个变量在每个 CJS 模块中都存在，它的值是模块所在的目录名。
*   `__filename`：同上，只不过其值为模块的文件名。
*   `require.cache`：`require` 本身是个函数，但它下面还挂了一个 `cache` 对象，缓存了所 `require` 的内容，通常不会用到，更多内容可以查看 Node.js 的[文档](https://nodejs.org/docs/latest-v18.x/api/modules.html#requirecache "https://nodejs.org/docs/latest-v18.x/api/modules.html#requirecache")。
*   `require.main`：入口文件的所映射的 `Module` 实例。

其实还有更多内容被列在文档中，有兴趣可自行查询。

在上面有提到，`require.main` 是入口文件所映射的 `Module` 对象。这里的 `Module` 对象之前没提过。在 Node.js 中，每一个 CJS 模块最终会被加载成一个 `Module` 类的实例，被放在 Node.js 内部的内存中，并在“必要”的时候传递给各模块。

各模块中大家所使用的 `module` 对象就是该模块对应的 `Module` 类实例。它除了包含 `exports` 对象之外，还包含：

*   `children`；
*   `filename`；
*   `id`；
*   `loaded`；
*   `path`；
*   `paths`；
*   `require()`。

我们来看看这么个例子：

    // test2.js
    console.log(module);
    console.log(require.main);
    
    // test.js
    require('./test2');
    console.log(module);
    process.nextTick(() => {
        console.log(module);
    });
    

在这两个文件代码中，执行 `node test.js` 后，会有四次关于 `Module` 实例的输出。

第一次是 `test2.js` 自身的 `module`。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96d3ea5f0ec84db7bf58ddf4f533525b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=623&h=203&s=23816&e=png&a=1&b=ffffff)

    Module {
      id: '/foo/test2.js',
      path: '/foo',
      exports: {},
      filename: '/foo/test2.js',
      loaded: false,
      children: [],
      paths: [
        '/foo/node_modules',
        '/node_modules'
      ]
    }
    

因为在做这一次 `console.log` 的时候，`test2.js` 模块自身代码还没执行完，也就是说仍在“加载”，所以 `loaded` 为 `false`。

第二次是 `test2.js` 输出 `require.main`，它对应的是入口模块的 `Module` 实例，即 `test.js` 这个模块。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/594aed0ef7154946a325fb155a95a7af~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=633&h=213&s=24161&e=png&a=1&b=ffffff)

    Module {
      id: '.',
      path: '/foo',
      exports: {},
      filename: '/foo/test.js',
      loaded: false,
      children: [
        Module {
          id: '/foo/test2.js',
          path: '/foo',
          exports: {},
          filename: '/foo/test2.js',
          loaded: false,
          children: [],
          paths: [Array]
        }
      ],
      paths: [
        '/foo/node_modules',
        '/node_modules'
      ]
    }
    

可以看出，主模块正在执行 `require('./test2.js')` 这行代码，自身也并未加载完，`loaded` 自然也为 `false`。而它对比 `test2.js` 的 `Module` 实例又多了 `children` 元素，里面的 `Module` 实例就是 `test2.js` 的 `Module` 实例。这说明了它们的依赖关系。这个依赖关系是运行时生成的，也就是说如果你在未来某个时刻通过 `setTimeout` 之类的方式去加载某个模块，那么依赖关系会在那个时刻再多一个元素。

第三次输出是由 `test.js` 输出的自身 `module` 对象。这个对象指向等同于 `require.main`。所以输出与第二次基本一致，但有个不同，那就是此时 `test2.js` 代码已加载完毕，执行上下文回到了 `test.js`，所以里面关于 `test2.js` 的 `Module` 实例中的 `loaded` 变为 `true`。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f903b905c8fc43b688af5d2f329ce069~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=643&h=193&s=24395&e=png&a=1&b=ffffff)

然后下一步是执行 `process.nextTick()`，将回调函数进去，以供下一个 Tick 执行。至此，`test.js` 模块也加载完毕，后面就是正式进入事件循环了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a89aaa61a55046b991d35714a9fe3242~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=683&h=383&s=47037&e=png&a=1&b=ffffff)

过了一个 Tick 之后，Node.js 代码执行 `process.nextTick()` 回调，此时执行第四次输出。这次输出对象仍旧是 `test.js` 的 `module`，所以内容与第三次输出基本一致。只不过这个时刻，`test.js` 也已加载完毕，`loaded` 也变为 `true` 了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1c40ff562e3439fbffcfdd4a6b0c4f7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=623&h=223&s=24195&e=png&a=1&b=ffffff)

### Node.js 中的 ESM

ESM 是 ECMAScript 官方的模块机制，从语法层面直接支持。虽然语法上面支持了，但是当 Node.js 拿到一个 `import ... 'foo'` 的时候，还是得决定从哪怎么加载一个模块。V8 只是实现了语法上面的解析，具体加载代码等操作还是需要各运行时自行适配。毕竟不同运行时对于标识解析、代码加载的规则不一样，比如 Deno 支持从 HTTP 进行远端加载，而 Node.js 至少在 v18 还没有这层内置默认打开，需要用户自行实现或开启。甚至有些私有运行时会从数据库、内存等等地方加载，这些都是需要自行适配的。

Node.js 自然也有了这层最基本的从文件系统加载的适配。以及，为了给未来留口子，Node.js 还支持让用户自定义加载。即当 Node.js 收到了 `import ... 'foo'` 语法之后，可以将 `foo` 等信息传给用户自定义加载器，由其来决定如何加载模块。只需要你在执行 Node.js 的时候，通过命令行参数指定加载器即可，如：

    $ node --experimental-loader ./https-loader.mjs main.mjs
    

这个特性一直到 Node.js v18.13 还是 Experimental 状态。未来应该会并入 Stable 状态的。

通过上面的这个特性，用户可以自己实现一个 HTTP 的模块加载器。当接收到类似 `import * from 'https://exmple.com'` 的时候，通过 HTTP 模块加载器来加载对应远端代码，并编译成 ECMAScript 模块。大家有兴趣可自行查阅 Node.js 官方文档中的[自定义 HTTP 加载器示例](https://nodejs.org/docs/latest-v18.x/api/esm.html#https-loader "https://nodejs.org/docs/latest-v18.x/api/esm.html#https-loader")。另外，现版本的 Node.js 中，也内置了 HTTP 加载器，只不过并没有默认启动。

    $ node --experimental-network-imports main.mjs
    

除了协议上可以自定义之外，自定义加载器还可以用于在加载模块时期编译非 JavaScript 代码等操作。比如 CoffeeScript 的加载，就可以通过自定义加载器将源码转译成 JavaScript 再加载，大家有兴趣可自行查阅 Node.js 官方文档中的[自定义转译加载器示例](https://nodejs.org/docs/latest-v18.x/api/esm.html#transpiler-loader "https://nodejs.org/docs/latest-v18.x/api/esm.html#transpiler-loader")。

关于 Experimental 的内容点到为止，这里只是讲一个未来的趋势，具体大家都可以直接看 Node.js 文档，该有的内容都很详尽。

### CJS 与 ESM 的识别与启用

Node.js 支持两套模块机制，但其又各自独立。不同的场景下，Node.js 会将一个模块判断为是 CJS 模块，还是 ESM 模块。

虽然这个判断在 Node.js 文档中原原本本写着了，我在这里还是稍微提一下。

通常一个 `*.mjs` 会被认为是 ECMAScript module，而一个 `*.cjs` 则会被认为是 CommonJS 模块。

如果是 `*.js` 文件，则需要看离它最近的父 `package.json` 文件。这个就涉及到 Node.js 的包机制了，后续章节中会提。Node.js 在 v12.0.0 中，为 `package.json` 增加了 `type` 字段，用于判别其麾下的 `*.js` 文件是 ECMAScript module 还是 CommonJS 模块。若 `type` 值为 `module`，则其 `*.js` 为 ECMAScript module；若其值为 `commonjs` 或者不存在该值，则其 `*.js` 为 CommonJS 模块。

另外，还有一种情况，就是当通过 `--eval` 参数启动 Node.js，或者直接通过字符串 pipe 给 Node.js 时，其源码对应的模块类型要看另一个 `--input-type` 参数是 `module` 还是 `commonjs`，若没有这个 `--input-type` 参数，则默认认为其是 CommonJS 模块。

上面的“不存在 `type` 字段”或“不存在 `--input-type` 参数”都是为了向下兼容。当下 Node.js 既支持 CommonJS 和 ECMAScript modules，所以官方还是建议在需要这个字段的时候都填上，哪怕你的模块是 CommonJS，也不要留空。

#### CommonJS 下的 `import`

一个 CommonJS 的模块中是无法使用 `import` 语法的。例如还是上面的 `test2.js`，如果我们把 `test.js` 改成：

    import * as a from './test2.js';
    

并且没有 `package.json` 文件去指定 `test.js` 是一个 ESM，这是会报错的：

    (node:*****) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
    (Use `node --trace-warnings ...` to show where the warning was created)
    /foo/test.js:1
    import * as a from './test2.js';
    ^^^^^^
    
    SyntaxError: Cannot use import statement outside a module
        at Object.compileFunction (node:vm:360:18)
        at wrapSafe (node:internal/modules/cjs/loader:1084:15)
        at Module._compile (node:internal/modules/cjs/loader:1119:27)
        at Object.Module._extensions..js (node:internal/modules/cjs/loader:1209:10)
        at Module.load (node:internal/modules/cjs/loader:1033:32)
        at Function.Module._load (node:internal/modules/cjs/loader:868:12)
        at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
        at node:internal/main/run_main_module:22:47
    

#### ECMAScript module 下 `import` CommonJS

如果把 `test.js` 重命名为 `test.mjs` 则可正常运行。在 ESM 下，对 CommonJS 模块进行 `import` 是可以的。不过这么一来，由于入口文件是 ESM 的，所以 `require.main` 就不存在了。这么执行下来的结果就是两个输出，第一个输出是 `test2.js` 这个 CommonJS 模块自身，就跟上面输出 `test2.js` 这个 `Module` 实例一致；第二个输出是输出 `require.main`，此时输出是 `undefined`。

#### ECMAScript module 下的 `require`

在 ESM 的作用域下，不再存在 CommonJS 对应的上下文，如 `require()`、`module`、`exports` 这些统统不存在。也就说，把 `test.mjs` 源码改成：

    require('test2');
    

是会执行失败的。

    require('test2');
    ^
    
    ReferenceError: require is not defined in ES module scope, you can use import instead
        at file:///foo/test.mjs:1:1
        at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
        at async Promise.all (index 0)
        at async ESMLoader.import (node:internal/modules/esm/loader:526:24)
        at async loadESM (node:internal/process/esm_loader:91:5)
        at async handleMainPromise (node:internal/modules/run_main:65:12)
    

#### CommonJS 下加载 ECMAScript module

ECMAScript module 可以通过 `import` 加载 CommonJS 模块，而反过来 CommonJS 模块是无法通过 `require()` 来加载 ECMAScript module 的。这里涉及到一个本质问题，那就是**模块加载的异同步**。CommonJS 的 `require()` 机制是完全同步的，而 ECMAScript module 的 `import` 机制则是异步的。具体的分析在后话，这里大家要记住它们加载的异同步问题。

`import` 是异步的，那么在内部通过同步的方式模拟一个 `require` 流程是没问题的，所以 ECMAScript module 下可以通过 `import` 去加载 CommonJS 模块；反过来不行，一个同步的东西是无法加载异步内容的，至少无法通过比较正统的方式解决。

CommonJS 虽然无法通过 `require` 去加载一个 ECMAScript module，但不意味着它无法加载 ECMAScript module。实际上，Node.js 的 CommonJS 模块虽然不支持 `import` 语法，但它却支持 `import()` 函数。我们仍可以在 CommonJS 中通过 `import()` 函数来加载一个 ECMAScript module。

这里将 `import()` 称为函数其实也不严谨。**具体来讲，`import()` 也是一个语法，叫动态载入（dynamic import）。只不过长得像函数，我这里姑且这么称呼，大家背八股的时候别学我。**

上文中，我们提到，ECMAScript module 加载机制是异步的。虽然在 `import * as mod from 'xxx'` 的语法中我们看起来是同步的，但其实在引擎内部帮你吃掉了异步的部分。然而在 `import()` 中，该异步需要自己处理，它的返回值是一个 `Promise`。如：

    import('xxx').then(mod => {
      // 这里的 mod 就是加载的 ECMAScript module
    });
    

#### CommonJS 与 ECMAScript module 互通小结

通过上面的四节小标题，我们大概明白了，**CommonJS 与 ECMAScript module 虽然是两套模块机制，但在 Node.js 中一定程度上是可以互通的**。

1.  CommonJS 下无法使用 `import` 语法，ECMAScript module 中没有 `require()`；
2.  ECMAScript module 可以 `import` CommonJS 模块；
3.  CommonJS 模块无法 `require()` ECMAScript module，但可以通过 `import()` 语法动态加载它。

小结
--

本章为大家讲解了 JavaScript 模块机制的发展史，从最开始无模块机制，到后面 IIFE，再到四大模块体系打架的阶段，到最后官方下场搞 ECMAScript modules。

其中 CommonJS 是由 Mozilla 工程师 Kevin Dangoor 起草，他本来想搞一套 ServerJS 的模块体系。后来觉得路走窄了没朋友，又改成了 CommonJS。

Node.js 是在四大模块体系打架的阶段诞生的。从诞生之初就与 CommonJS 绑定在一起，一直使用该机制作为它的模块机制，也算是呼应了它的原名 ServerJS。

官方下场后，Node.js 也开始了与官方绑定之路，脚踏两条船，齐头并进，对齐标准。发展至今，Node.js 同时支持 CommonJS 与 ECMAScript module，并且两种方式可在一定程度上互通，从而继续享受庞大的存量的 Node.js 生态。

我个人一直更倾向于使用 CommonJS 规范，但历史车轮滚滚，很多时候并不由我一个小人物的看法。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ae65b06b38845e09727a2743b1470e7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=658&h=370&s=54312&e=png&b=faf8f8)