书接上文，之前给大家大体介绍了一下 Node.js 下的 CJS 与 ESM，现在我们潜下水去看看吧。

其实网上关于 CJS 的讲解很多，大家多少也会有耳濡目染，知道 CJS 模块实际上是对原来的代码首尾各加上点代码，形成一个闭包，才有了 `__dirname`、`__filename` 这些内容。网上也有很多关于 CJS 模块在 `require` 时如何寻径的文章。

不过既然本小册里面有提到了 CJS 与 ESM，就有必要帮大家重温一下。

> 时光荏苒，拖稿严重。本章中代码以 Node.js v18.14.0 为例。

本章内容重点介绍 Node.js 中 CommonJS 的模块机制。CommonJS 模块加载（`require`）主要分为几步，如下图：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c95b65cdd5ee4abda3000af66de0f843~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=719&h=663&s=41840&e=png&a=1&b=ffffff)

事实上过程比这复杂得多。此处我做了很多“剪枝”，只留下最核心的骨干。流程很好理解，首先根据当前模块和目标模块标识（我们称其为 `specifier`）进行寻径。如当前模块地址是 `/foo/main.js`，而目标模块标识为 `./module.js`，那么文件路径就是 `/foo/module.js`；如果目标模块标识为 `fs`，那么文件路径就是 `fs`，是个内置模块。所以下面一步就是根据模块类型来走不同分支，究竟是加载内置模块还是对应文件的模块。加载完之后返回结束。

这里有几个点我们需要弄清楚。

1.  “CommonJS 模块”在 Node.js 中表现出的本质是什么？
    
2.  寻径规则是什么？
    
3.  内置模块和文件模块分别怎么加载？
    

搞清楚上面的三个点后，大家对 CommonJS 在 Node.js 中的本质约摸就了然了。

Node.js 中 CommonJS 模块的本质
------------------------

> 为了书写方便，下文中所有 CommonJS 都代表 “Node.js 中的 CommonJS”。

先说结论，上一章中我们提到一个 CommonJS 模块在 Node.js 中，本质是一个 `Module` 实例，实例中包含标识符（`id`）、`module`、`exports` 等。实际上，它是一个函数的执行结果。

我们先简单地说，CommonJS 模块就是一个 `module` 对象，内含 `exports`。那么 Node.js 在加载模块（`require()`）时，内部会预先声明这个对象，不严谨地说，类似这样：

    const module = {
      exports: {},
    };
    

然后，Node.js 在内部将目标模块的代码前后都加上一段代码，使之变成一个函数，这个函数大概长这样：

    (function (exports, require, module, __filename, __dirname) {
      // 实际模块代码
    });
    

也就是说，如果你有一个模块，其代码是：

    module.exports = {
      hello: 'world',
    };
    

那么其在 CommonJS 模块中，对应的函数代码是：

    (function (exports, require, module, __filename, __dirname) {
      module.exports = {
        hello: 'world',
      };
    });
    

我们可以看到，这个函数的参数分别为：

1.  `exports`；
2.  `require()`；
3.  `module`；
4.  `__filename`；
5.  `__dirname`。

下一步，就是 Node.js 在 `require()` 内部执行这个函数。我们姑且称这个函数为 `compiledWrapper()`，那么大概就是这么执行的：

    const module = {
      exports: {},
    };
    
    const result = compiledWrapper(module.exports,
                                   <针对新模块的 `require` 函数>,
                                   module,
                                   <解析出来的文件名>,
                                   <解析出来的目录名>);
    

> 这是我简化后的版本。实际在 Node.js 中，代码复杂得多，分叉也多。

上面的步骤执行下来之后，`module` 被传入之前准备好的函数，模块代码里面做了将其 `exports` 值赋为 `{ hello: 'world' }` 对象的操作。于是，一套操作下来之后，最先定义好的 `module` 对象就在用户模块代码中被赋值了。

一套流程行云流水，总结成粗糙的流程图如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebeb9d2824b546bda04e83ca208d77ae~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=883&h=733&s=78587&e=png&a=1&b=ffffff)

所以，CommonJS 模块本质就是一个 `exports` 对象传入被编译的模块函数中执行挂载操作得到的终态。

寻径规则是什么？
--------

这是一个老生常谈的问题了，当在一个文件 A 中，进行 `require(<B>)`，那么最终对应到的文件或者模块是什么。其实这块规则一直有在做一些变化。如果用古早的方式说，大概就是：

1.  若是以 `./` 或 `../` 等相对路径前缀开头的标识，则认为是一个相对路径，直接以当前模块文件为始去寻径；
    
2.  否则，认为其是一个三方模块或内置模块；
    
    *   若是可被加载的内置模块，则使用该内置模块；
    *   否则，从当前文件目录的 `node_modules` 目录下寻找对应模块（包）；
    *   若无法找到，设当前目录为上级目录，重新执行 `b`；
    *   若一直到根目录还无法找到，那就是找不到了。

古早逻辑的确是这样，而且这也的确是现在 Node.js 版本的寻径主要骨干逻辑。只不过现在的 Node.js 中寻径逻辑会多出一些细枝末节来。

首先，在内置模块的判断上，多了一层判断，即是否以 `node:` 为前缀，且能在用户侧加载的内置模块，或者无 `node:` 前缀且 Node.js 可以通过无前缀方式加载内置模块，同样还需要是用户侧可加载的内置模块。

      if (
        (
          StringPrototypeStartsWith(request, 'node:') &&
          BuiltinModule.canBeRequiredByUsers(StringPrototypeSlice(request, 5))
        ) || (
          BuiltinModule.canBeRequiredByUsers(request) &&
          BuiltinModule.canBeRequiredWithoutScheme(request)
        )
      ) {
        return request;
      }
    

> 此处 `request` 即传入 `require()` 函数的标识。

然后是一段[自定义寻径基路径](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L969-L1003 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L969-L1003")的逻辑，这段逻辑是给 `require.resolve(id, options)` 用的，并不会在 `require()` 加载模块的时候被用到，就不详表了。寻径基路径是一个数组，表示接下去对于 `request` 的寻径会逐个从基路径数组中匹配，一旦匹配上就将其作为模块路径。默认情况下，基路径数组由 [Module.\_resolveLookupPaths() 生成](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L758-L804 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L758-L804")，其逻辑如下：

1.  若是内置模块，则不需要基路径，为 `null`；
    
2.  若不是以相对路径标识开头（`./`、`../`），则：
    
    *   基路径为从当前目录开始往前的每一级目录，并为每一级目录都加上 `node_modules` 一层（参考[源码](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L720-L756 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L720-L756")）；
    *   除了上述的基路径之外，还包括 `HOME` 环境变量下诸如 `.node_modules`、`.node_libraries` 等目录，包括 Global 包所安装的目录等（参考[文档](https://nodejs.org/dist/latest-v18.x/docs/api/modules.html#loading-from-the-global-folders "https://nodejs.org/dist/latest-v18.x/docs/api/modules.html#loading-from-the-global-folders")和[源码](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1354-L1382 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1354-L1382")）；
3.  若是以相对路径标识开头，则基路径为当前模块的目录地址。
    

> 此外，还有一些诸如 REPL 的基路径逻辑。

有了基路径数组后，开始正式的寻径逻辑。

跟古早时期不一样的是，现在的 Node.js 支持以 `#` 开头的模块标识了。其逻辑是先读取最近的上层作用域中的 `package.json` 文件，并从中获取 `import` 字段中的映射关系，从而根据映射关系进行寻径，若寻径失败则直接抛错。由于 Node.js 中该逻辑使用的是 ESM 模块加载相关代码中的函数，就不在本章详表了。

接下去，还是尝试读对应 `package.json`，看看包名是否与当前的 `request` 相等——我加载我自己。比如当前包名（`package.json` 中的 `name`）为 `example`，那么这其中文件去 `require('example/hello')` 的时候，会尝试在当前包的根目录下找 `hello.js`。这个操作在 Node.js 中叫 resolve self，毕竟[相关代码](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1024 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1024")是 `const selfResolved = trySelf(...);`。

然后就是正儿八经地遍历之前拿到的基路径数组，开始寻径。规则为：

1.  若 `request` 是个绝对路径，则忽略原来所有基路径，并仅以一个空字符串作为基路径；
    
2.  从数组中拿到下一个基路径；
    
3.  用基路径加上 `request` 变成一个新路径；
    
4.  在新路径中找是否存在最近的上层 `package.json`，并判断是否有 `exports` 字段做映射，若有映射，直接计算映射相关内容，最终若计算成功则直接返回，这是为了兼容 ESM 的 [exports 语法糖](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#package-entry-points "https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#package-entry-points")，而且这段逻辑也是直接复用了 ECMAScript module 的相关逻辑；
    
5.  判断新路径状态，若新路径不以目录符号 `/` 结尾，则：
    
    *   若是一个文件，则寻径成功；
    *   否则，尝试加上各种后缀名再看看文件存不存在，若任一存在，则寻径成功；
    *   否则，继续后续逻辑；
6.  若新路径是个目录，则：
    
    *   若当前目录有 `package.json`，则尝试使用 `main`，若一切安好，则寻径成功；
    *   否则尝试 `index` 加上各种后缀看看文件存不存在，若存在，则寻径成功，否则继续后续逻辑；
7.  最后，若还没寻径成功，则失败。
    

这是我用大白话解释 CommonJS 的寻径规则，实际上 Node.js 文档中有更严谨的说明，不过读着头大。想要更严谨的说法，可自行翻阅[文档](https://nodejs.org/dist/latest-v18.x/docs/api/modules.html#all-together "https://nodejs.org/dist/latest-v18.x/docs/api/modules.html#all-together")。

另外，CommonJS 与 ESM 水乳交融。在 CommonJS 中，`#` 的逻辑与 `package.json` 中 `exports` 的逻辑都是直接复用了 ESM 相关代码的。

内置模块和文件模块分别怎么加载？
----------------

### 文件模块的加载

在前文中，我们总提到 `Module` 实例（又称 `module` 对象），包括上面流程图中也绕不开它。它究竟是个什么东西？首先我们看它的[构造函数](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L206-L215 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L206-L215")：

    function Module(id = '', parent) {
      this.id = id;
      this.path = path.dirname(id);
      setOwnProperty(this, 'exports', {});
      moduleParentCache.set(this, parent);
      updateChildren(parent, this, false);
      this.filename = null;
      this.loaded = false;
      this.children = [];
    }
    

在构造之初，就把 `id`、`parent`、`path`、`filename` 等的初始化好了。这个类我们在上一章中有提到，它对象内部就是有这些成员变量。除了上面这些成员变量之外，还通过 `setOwnProperty()` 把 `exports` 挂载到 `module` 对象中。这里的 `setOwnProperty` 是对下面代码的封装：

    ObjectDefineProperty(obj, key, {
      __proto__: null,
      configurable: true,
      enumerable: true,
      value,
      writable: true,
    });
    

而在 `require()` 一个模块的时候，当前序逻辑都执行完了后（如不使用缓存、是一个内置模块等），会实例化一个 `Module` 对象。[就像这样](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L914 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L914")：

    const module = new Module(filename, parent);
    

此处的 `filename` 即寻径后得到的文件名，用于加载模块源码。`parent` 即当前发起 `require()` 函数的模块所属的 `Module` 实例。然后调用 `module` 对象中的 `load` 函数进行内里的逻辑，如读取模块代码、编译模块并执行等等。这些都是 `Module` 的成员方法，所以我们在流程图中可以看见，直接用 `this` 来代替 `module` 对象了。

> #### `module.exports` 与 `exports`
> 
> 上一章中，我们提到了 `module.exports` 与 `exports` 的关系，为什么 `module.exports` 被覆盖后，原 `exports` 就不生效了。内在逻辑在上面的内容中就已经明晰了。
> 
> CommonJS 模块本质中有一个编译好的函数，其参数有 `module`、`exports`。而传进去的 `module` 即 `this`，也就是 `Module` 实例；`exports` 则是 `this.exports`。传进去后，这两个对象均可以被目标模块内部随意更改。
> 
> 只不过，我如果改了 `module.exports` 整体后，`this.exports` 的引用就指向新的 `exports` 了。而模块最终导出的是 `Module` 实例的 `this.exports`，所以原来的 `exports` 再怎么改也没用了。
> 
> 另外，还有一个**冷知识**，我们是可以通过 `console` 输出形如 `module._compile()` 等函数的，因为它就是 `Module` 类的方法，而 `module` 又是 `Module` 实例。

在 CommonJS 中，若无用户自定义类型的话，Node.js 支持三种类型的模块：

1.  `*.js`；
2.  `*.json`；
3.  `*.node`。

在 `require()` 过程中，会根据不同文件后缀使用不同的逻辑来加载。如果是 `*.js` 文件，就是上面讲的流程；如果是 `*.json` 文件，则是同步读取对应文件后，对其进行 `JSON.parse(content)` 得到内容，然后挂载到 `module.exports` 中供其他模块使用（此处的 `content` 是经过特殊处理的）；若是 `*.node`，则以 C++ 扩展的机制进行加载，篇幅过长，就不细介绍了，有兴趣可以阅读一下《Node.js：来一打 C++ 扩展》。

这三种逻辑被放置在 `Module` 静态对象中，形式如下：

    Module._extensions['.js'] = function(module, filename) { ... }
    Module._extensions['.json'] = function(...) { ... }
    Module._extensions['.node'] = function(...) { ... }
    

这个逻辑是可被用户自定义修改的。如果你想让 Node.js 在运行时过程中可以加载编译 TypeScript 模块并执行，只需要新增一个 `.ts` 后缀的逻辑即可，如：

    const Module = require('module');
    
    Module._extensions['.ts'] = function(module, filename) {
      // 读取 TypeScript 源文件，加上函数前后缀，编译 TypeScript 函数并执行，传入 `module` 得到结果
    };
    
    // 或者
    require.extensions['.ts'] = ...; // 此处等同 `Module._extensions`
    

事实上，[ts-node](https://github.com/TypeStrong/ts-node/blob/v10.9.1/src/index.ts#L1607-L1622 "https://github.com/TypeStrong/ts-node/blob/v10.9.1/src/index.ts#L1607-L1622") 就是这么做的。在 Node.js [默认的 \_extension\['.js'\] 中](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1235 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1235")，会先判断一些缓存逻辑，通过文件名看之前是否加载过该模块。然后就是流程图中的读取文件内容。

    content = fs.readFileSync(filename, 'utf8');
    

上面这行代码就是为什么上一章我们说 CommonJS 的模块加载是纯同步的，因为唯一一个可以异步编写的地方也用了同步的 API。接下去判断一下这个模块是不是合法 CommonJS 模块，如按上一章中提到的 `package.json` 中的 `type` 等，若不合法则抛错，同样像上一章中提到的一样。可以[简化成](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1245-L1279 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1245-L1279")（当然，这其中还是有很多分支条件）：

    const pkg = readPackageScope(filename);  // 读取对应的 `package.json`
    if (pkg?.data?.type === 'module') {
      ...
      throw err;
    }
    

文件也读完了，合法性也判断了，接下去就是调用 `module._compile()` 去编译并执行模块函数，得到最终结果了。这其中首先就是为得到的代码内容加上前后缀，[得到模块函数源码](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1127 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1127")：

    let wrap = function(script) {
      return Module.wrapper[0] + script + Module.wrapper[1];
    };
    
    ...
    const wrapper = [
      '(function (exports, require, module, __filename, __dirname) { ',
      '\n});',
    ];
    
    ...
    const wrapper = Module.wrap(content);
    

然后是通过 `vm` 中的 `Script` 类去加载并执行，得到函数对象。`vm` 在本章不详说，后续章节会再涉及。

等这些都做完后，就是传入 `this` 并调用函数，挂载最终 `module.exports` 了：

    Module.prototype._compile = function(content, filename) {
      ...
      
      // 此处的 `wrapSafe` 就是上面代码块的相关逻辑
      const compiledWrapper = wrapSafe(filename, content, this);
      
      ...
      
      const dirname = path.dirname(filename);
      const require = makeRequireFunction(this, redirects);
      let result;
      const exports = this.exports;
      const thisValue = exports;
      const module = this;
      
      ...
      
      result = Reflect.apply(compiledWrapper, thisValue,
                             [exports, require, module, filename, dirname]);
                            
      ...
    }
    

如此一来，一个文件模块基本上就完成了。这里面还有一点，就是每个新的模块中，`require()` 函数都是现做的，通过 `makeRequireFunction()`，里面主要涉及一些安全策略相关的逻辑，然后才是 `require()` 函数本体；若无策略相关逻辑，那么 `makeRequireFunction()` 返回的 `require()` 函数就是对 `Module.prototype.require()` 的透传。除此之外，`makeRequireFunction()` 还为返回的 `require()` 中注入了诸如 `require.resolve()` 等函数，供大家使用。

下面是 `Module.prototype.require()` 的代码，非常简单：

    Module.prototype.require = function(id) {
      ...
      
      try {
        return Module._load(id, this, /* isMain */ false);
      } finally {
        ...
      }
    };
    

而这个 `Module._load()` 就是本章第一个流程图所写的流程了。内容比较长，就不展开了，毕竟本小册不是正儿八经的 Node.js 源码剖析，有兴趣大家可[自行阅读源码](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L859-L954 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L859-L954")。

### 内置模块的加载

Node.js 中内置模块加载与文件模块加载逻辑不一样。我们不讲解 Node.js 中的内置模块是如何 `require()` 另一个内置模块的，讲来讲去讲不完了，这里我们只讲用户侧代码是如何加载内置模块的。

内置模块与文件模块加载逻辑的区别是在前文中提到的 `Module._load()` 中体现的：

    Module._load = function(request, parent, isMain) {
      ...
      
      if (String.prototype.startsWith(request, 'node:')) {
        const id = String.prototype.slice(request, 5);  // 去掉 node: 前缀
        const module = loadBuiltinModule(id, request);
        if (!module?.canBeRequiredByUsers) {
          throw new ERR_UNKNOWN_BUILTIN_MODULE(request);
        }
        return module.exports;
      }
      
      ...寻径及缓存等逻辑...
      
      const mod = loadBuiltinModule(filename, request);
      if (mod?.canBeRequiredByUsers &&
          BuiltinModule.canBeRequiredWithoutScheme(filename)) {
        return mod.exports;
      }
      
      ...
      
      文件模块加载逻辑
    }
    

可以看出来，实际上加载文件模块和内置模块的逻辑是杂糅在一起的，并不像最开始那张流程图那样泾渭分明。大概逻辑就是，先判断是否有 `node:` 前缀，这是在 Node.js v14.18.0 中首次提出来的，大家可以显式地[通过 node: 前缀来说明此次加载的是一个内置模块](https://nodejs.org/dist/latest-v18.x/docs/api/modules.html#core-modules "https://nodejs.org/dist/latest-v18.x/docs/api/modules.html#core-modules")，毕竟如果你的 `node_modules` 目录下有同名包的情况下，不显式声明会找到犄角旮旯里去。若有 `node:` 前缀，则直接通过 `loadBuiltinModule()` 去加载对应模块并返回。然后是一系列的寻径逻辑，得到 `filename`，这个 `filename` 有可能是个文件路径，也有可能没找到对应文件，直接是个标识符（如 `fs` 等）。这个时候，再拿着 `filename` 去尝试通过 `loadBuiltinModule()` 加载对应内置模块。如果存在对应内置模块，则判断一下当前启动策略是否允许通过无 `node:` 前缀方式加载内置模块，若都合法，则也返回 `mod.exports`。`loadBuiltModule()` 函数在未找到对应内置模块的情况下，是无返回（即 `undefined`）的，所以自然会走到后面文件模块加载逻辑。

这点代码归结为流程图，就是这样的：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/128d6525780c4bdda9e92cbced89f4e2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=923&h=753&s=66939&e=png&a=1&b=ffffff)

而 `loadBuiltinModule()` 函数逻辑也非常简单，这是因为我们的讲解点到为止，不继续深入内置函数具体怎么加载。

    function loadBuiltinModule(filename, request) {
      const mod = BuiltinModule.map.get(filename);
      if (mod?.canBeRequiredByUsers) {
        debug('load built-in module %s', request);
        // compileForPublicLoader() throws if mod.canBeRequiredByUsers is false:
        mod.compileForPublicLoader();
        return mod;
      }
    }
    

直接从 `BuiltinModule` 的 `map` 中获取对应标识（如 `fs`、`path` 等）的内置模块，然后看是不是存在且能被用户所 `require()`。若可以，那就将其编译为用户侧可用的模块，否则直接不返回。这个 `BuiltinModule` 是另一种模块实例，与文件模块的 `Module` 相对应。在 Node.js 初始化的时候，会通过 C++ 侧代码把所有的内置模块名放到 `map` 中，并为其实例化一个对应的 `BuiltinModule`：

    const {
      builtinIds,
    } = internalBinding('builtins');  // 从 C++ 侧代码中获取内置模块 ID 数组
    
    class BuiltinModule {
      ...
      
      static map = new SafeMap(
        ArrayPrototypeMap(builtinIds, (id) => [id, new BuiltinModule(id)])
      );
      
      ...
    }
    

而所谓的 `canBeRequiredByUser` 成员变量则是在 `BuiltinModule` 构造函数时通过判断标识中是否以 `internal/` 开头来决定的。用户侧不能加载 `internal/*` 模块。

`mod.compileForPublicLoader()` 则是将内置模块编译好并返回结果，具体就不分析了，反正最终是在 C++ 侧通过标识拿到对应内置模块的源码字符串，然后再进行类似的编译，内置模块对应函数的参数与文件模块不同，其为：

1.  `exports`：最终导出对象，即 `module.exports`；
2.  `require()`：内置模块特有的 `require()` 函数，API 接口层与文件模块中的看起来一样，实际逻辑不同；
3.  `module`：当前 `BuiltinModule` 对象；
4.  `process`：`process` 对象；
5.  `internalBinding`：用于加载内置 C++ binding 的函数，比如上面的代码块中就用到了；
6.  `primordals`：ECMAScript 原初对象、函数等的集合。

> #### `primordals` 原初对象
> 
> `primordals` 的作用是，为防止用户侧通过篡改一些 ECMAScript 原初对象、函数，来篡改 Node.js 的实际执行意图的行为。例如，上面代码块中的 `ArrayPrototypeMap` 就对应 `Array.prototype.map()`。包括在之前各种代码块中，我其实有手动将这些大驼峰的命名改为原来所代表的含义，在之前供大家理解。
> 
> 实际上，若无 `primordals` 机制，如果用户篡改了 `Array.prototype.map()`，如 `Array.prototype.map = function() { throw new Error(...); }`，或者做一些不安全的事情，那么 Node.js 就会从内部被瓦解。
> 
> 所以，Node.js 将这些 ECMAScript 原初对象、函数等都在用户能执行代码的时间节点之前就预先存到 `primordals` 下。后续所有的内置模块逻辑中都使用 `primordals.<xxx>` 来代替原逻辑。比如上面代码块中就是 `const { ArrayPrototypeMap } = primordals`。这个 `primordals` 对用户侧代码不可见，只会在内置模块中被传递，所以不会被外界所篡改。

至此，内置模块的加载逻辑就清晰了。除了隐藏地更深的内置模块实际是如何编译、执行的，这块逻辑大家有兴趣可自行阅读源码。我们只需要知道，所有的内置模块源码都在 Node.js 自身可执行文件构建编译的时候，通过 `js2c.py` 脚本将所有源码都写死生成到了一个叫 `node_javascript.cc` 中，编译的时候直接就放到了 Node.js 二进制文件中，执行的时候直接就存在了内存里。当需要用到对应模块源码时，直接从内存拿就好了。关于这块的信息，网上有很多相关文章。

小结
--

本章中为大家揭示了 CommonJS 模块在 Node.js 中的本质。它实际上是一个 `Module` 实例，内含 `exports` 对象，当我们 `require()` 某个模块的时候，拿到的是其 `exports` 对象里的内容。而 `Module` 实例在加载模块的时候，是先将模块源码前后包了额外代码将其变成一个函数样式，并编译该函数执行得到的 `exports`。

它就像一个泡芙加工过程。它并不是工作人员从 0 开始做面包，做奶油，然后返回给你。工作人员做的事只是往递过去的面包（事先准备好的 `module` 和 `module.exports`）里面注入奶油，这个奶油就是你要的模块了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44499f85a9724e1183845205fea9e2c4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=560&h=315&s=1402349&e=gif&f=22&b=d6bab0)

CommonJS 模块加工过程（误）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb800f9840634acf82faffa60670107c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=658&h=370&s=54312&e=png&b=faf8f8)