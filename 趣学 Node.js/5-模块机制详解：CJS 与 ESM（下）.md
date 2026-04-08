**我摊牌了，我对 ESM 不熟，对 `import` 不熟。本章大家就看个乐呵吧，我先去翻一遍源码。**

> 这让我想起了我的高中电脑老师。高中我爱去机房，有一次第二天是电脑课，好像是教一些基础的 Photoshop 操作。当天我去老师办公室，看见老师正捧着一本 Photoshop 的入门书在学呢。

作为对比的工具人：CommonJS
-----------------

在讲 ECMAScript modules 之前，作为对比，我还是再点一下 CommonJS。

我们在上一章中讲了，在 Node.js 中，CommonJS 的加载过程是由路径到源码，再到函数，最后通过执行函数注入灵魂，这某种意义上其实是返璞归真——IIFE。由“五步画马”可得：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24109713c0264813936d070673a0cf51~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=500&h=747&s=131840&e=png&b=fbfbfb)

从源码到函数这一步就是画马的灵魂了。上一章中没有细讲，也别指望本章细讲🤪，后面自然会讲到的。这里提一下，此处没有用 [eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval")，也没有用 [new Function()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function")。它用的是 [vm 模块](https://nodejs.org/dist/latest-v18.x/docs/api/vm.html "https://nodejs.org/dist/latest-v18.x/docs/api/vm.html")。

> 此处默认大家知道 `vm` 模块是做什么用的。若暂时还不知道，先去看一眼[文档](https://nodejs.org/dist/latest-v18.x/docs/api/vm.html "https://nodejs.org/dist/latest-v18.x/docs/api/vm.html")吧。

在用户模块代码加上前后缀后，早年间是通过 `vm` 中的 `Script` 类生成了脚本对象，然后通过执行它得到对应的函数。但这有个问题，会影响到错误堆栈，毕竟错误堆栈中展示的行号可能会多出一行，或者首行会变成前缀内容（详见[此 Issue](https://github.com/nodejs/node/issues/17396 "https://github.com/nodejs/node/issues/17396")）。聪明的人们学会了通过其他方式来编译这么个函数——不走 `Script`，而是用 C++ 侧的对应函数 `compileFunction()`（详见[此 PR](https://github.com/nodejs/node/commit/5f8ccecaa2e44c4a04db95ccd278a7078c14dd77 "https://github.com/nodejs/node/commit/5f8ccecaa2e44c4a04db95ccd278a7078c14dd77")），并在[编译的过程](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1149-L1162 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/cjs/loader.js#L1149-L1162")中，把 `importModuleDynamically()` 给注入进去，让 CommonJS 模块也拥有了 `await import()` 的能力。在 C++ 侧的 `CompileFunction()`，直接调用了 V8 的 `ScriptCompiler::CompileFunction()` 等能力去生成对应的函数，定义好参数就好，不会影响堆栈信息；而 `vm` 中的 `Script` 原理类似，只不过是调用 V8 的 `ScriptCompiler::CompileUnboundScript()`，前者直接编译成函数，后者需要编译成一段脚本，需要通过 IIFE 的方式再立马执行它。**上面这一段废话话看也可以，不看也不用细究，鉴于二者原理近似，只要记住** **Node.js** **的 CommonJS 模块是通过类似** **`vm`** **模块的方式编译的函数，再像泡芙一样被注入就好了。**

Node.js 中的 ECMAScript modules：`ModuleWrap`
------------------------------------------

知道了 CommonJS 模块本质是 `vm` 模块下对于用户代码的 IIFE 泡芙，接下去再看看 Node.js 中 ECMAScript modules 是什么吧。

CommonJS 下，一个模块是 `Module` 实例，在这里面发生了上面讲的化学变化。而 ECMAScript modules 本质是一个 C++ 侧实现的 JavaScript 对象 `ModuleWrap`，再往下翻一番，是 V8 中一个叫 `Module` 的概念。

> ### 小知识
> 
> 在 V8 中，每一种内置 JavaScript 类型，在 C++ 侧都有对应的类去承载。像数字类型，就是 `Number`；对象类型就是 `Object`……而又根据其生命周期（局部变量、全局变量），又被不同句柄所表示。比如一个局部变量的 `Number` 类型，就是 `Local<Number>`；一个全局变量的 `Object`，则是 `Global<Number>`。此全局非彼全局，篇幅所限，点到为止，大家意会一下即可，真想了解，自卖自夸《Node.js：来一打 C++ 扩展》，或者去网上翻阅关于 V8 的 `Local`、`Global`、`Persistent` 等句柄的文章。
> 
> 由于 ECMAScript modules 是 ECMAScript 规范中的概念，在 V8 中，也有对象去展示它，就是 `Module`。**此处指的是 V8 概念里的** **`Module`** **，不是** **Node.js** **中 CommonJS 对应的** **`Module`** **类。** `Local<Module>` 指的是在当前闭包作用域中有效的模块对象；`Global<Module>` 则指的是长生命周期的模块对象。

`ModuleWrap` 与 `Module` 的关系是，每个 `ModuleWrap` 对象中，都隐含了一个 `Module` 对象，供其操作。用大家比较好理解的 JavaScript 写伪代码，大概就像这样：

    class ModuleWrap {
      #module;
      ModuleWrap(<参数>) {
        this.#module = new Module(<参数>);
      }
      
      foo() {
        this.#module.bar();
      }
    }
    

这里面的 `#module`，就是 V8 的 `Module` 对象了，该对象有形如 `InstantiateModule()`、`Evaluate()` 等方法，它们会在 `ModuleWrap` 中被使用。如果大家对于 `Module` 感兴趣，可以看看它的 [API 文档](https://v8.github.io/api/head/classv8_1_1Module.html "https://v8.github.io/api/head/classv8_1_1Module.html")。

而一个 `ModuleWrap` 实例，则有如下一些方法：

*   `link`；
*   `instantiate`；
*   `evaluate`；
*   `setExport`；
*   `createCachedData`；
*   `getNamespace`；
*   `getStatus`；
*   `getError`；
*   `getStaticDependencySpecifiers`。

所以，ECMAScript modules 的本质就是一个套着 `Module` 的 `ModuleWrap`，里面封装了一些 V8 对 ECMAScript 模块的方法。

加载一个 ECMAScript module
----------------------

在加载 ECMAScript modules 之前，Node.js 会先初始化一个 [ESM Loader](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L181 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L181")。用官方注释来讲：

> An ESMLoader instance is used as the main entry point for loading ES modules. Currently, this is a singleton -- there is only one used for loading the main module and everything in its dependency graph.

它是用于加载主 ESM 及其鸡犬的，Node.js 会通过调用 `ESMLoader` 的 [import() 方法](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L509 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L509")来完成这一操作，里面会把主入口作为一个 [ModuleJob](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#LL525C30-L525C30 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#LL525C30-L525C30") 去执行加载任务。绕了半天，终于要回归正轨了——这个 `ModuleJob` 就是用来加载一个前面讲到的 `ModuleWrap`。篇幅有限，这里面关系错综复杂，我就不一步步溯源了。

### 模块加载任务

#### 任务构造函数

在 `ModuleJob` 构造函数中，会为其创建一个 `ModuleWrap` 对象。由于 `import` 的整体流程是异步的，所以这个创建过程也是异步的。构造函数触发“创建”操作后，会将其 `Promise` 保存起来，供后续使用。如果后续我需要使用 `ModuleWrap` 对象，就先 `await` 该 `Promise` 以确保创建完成。

#### 依赖树 → 需加载的模块集合

执行 `ModuleJob` 任务的时候，先会做一个初始化的操作。这个初始化操作看起来是一个 `ModuleJob`，实际上会拔出萝卜带出泥，递归将所有依赖的子模块都遍历一遍，去重后生成新的 `ModuleJob`。如下：

    const jobsInGraph = new SafeSet();
    const addJobsToDependencyGraph = async (moduleJob) => {
      if (jobsInGraph.has(moduleJob)) {
        return;
      }
      jobsInGraph.add(moduleJob);
      const dependencyJobs = await moduleJob.linked;
      return SafePromiseAllReturnVoid(dependencyJobs, addJobsToDependencyGraph);
    };
    await addJobsToDependencyGraph(this);
    

递归以 `await addJobsToDependencyGraph(this)` 为始，以重复（`jobsInGraph.has(moduleJob)`）作为递归边界，并在将任务加入去重集合（`jobsInGraph`）后，通过 `.linked` 这个 `Promise` 解析出其依赖造出新的 `moduleJob`。最终得到一个各自包含 `ModuleWrap` 的最终集合。相当于把树状依赖拍平，然后去重。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6628b9e0912e4fc1b743b40e1a2118d7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=803&h=463&s=39230&e=png&a=1&b=ffffff)

这一套操作下来，原来“**一整棵模块依赖树**”被变成了“**需要加载 A、B、C、D 四个模块的集合**”。而这一套操作的海克斯核心科技就是 `moduleJob.linked`。这个 `linked` 是在 `ModuleJob` 执行构造函数时候，通过调用 `link()` 函数得到的 `Promise`，其主要用途有两个：

1.  等待 `ModuleWrap` 创建完成；
2.  通过 `ModuleWrap.prototype.link()` 方法得到当前模块的依赖信息（有哪些 `import`），遍历所有依赖并生成新的 `ModuleJob` 对象，并通过 `await` 新任务对象的 `Promise` 等待新 `ModuleWrap` 创建完成。

    // 下方代码为了便于理解，一些 primordial 元素被我改成易于理解的不严谨方式
    const link = async () => {
      this.module = await this.modulePromise;
      assert(this.module instanceof ModuleWrap);
    
      // Explicitly keeping track of dependency jobs is needed in order
      // to flatten out the dependency graph below in `_instantiate()`,
      // so that circular dependencies can't cause a deadlock by two of
      // these `link` callbacks depending on each other.
      const dependencyJobs = [];
      const promises = this.module.link(async (specifier, assertions) => {
        const jobPromise = this.loader.getModuleJob(specifier, url, assertions);
        dependencyJobs.push(jobPromise);
        const job = await jobPromise;
        return job.modulePromise;
      });
    
      if (promises !== undefined)
        await Promise.all(promises);
    
      return Promise.all(dependencyJobs);
    };
    

##### `ModuleWrap.prototype.link()`

为什么我在介绍 `ModuleWrap` 的时候要列举它有哪些 API，以及 V8 的 `Module` 有什么？因为上面那块代码就用到了这个 `.link()` 方法。我们之前提到，它的作用是分析一个 `ModuleWrap` 的模块依赖并返回相关信息。

在 V8 中，`Module` 类有一个方法，叫 [GetModuleRequests()](https://v8.github.io/api/head/classv8_1_1Module.html "https://v8.github.io/api/head/classv8_1_1Module.html")，它的作用就是提取一个模块的依赖信息，返回 [ModuleRequest 对象](https://v8.github.io/api/head/classv8_1_1ModuleRequest.html "https://v8.github.io/api/head/classv8_1_1ModuleRequest.html")的数组，以 `Local` 句柄的形式。

[ModuleWrap.prototype.link()](https://github.com/nodejs/node/blob/v18.14.0/src/module_wrap.cc#L270-L332 "https://github.com/nodejs/node/blob/v18.14.0/src/module_wrap.cc#L270-L332") 就是通过调用 `GetModuleRequest()` 方法得到其依赖信息。`.link()` 的参数是一个 `async` 回调函数，它会在得到依赖信息后，逐一调用回调函数做一些事情，并等所有回调函数都被 `resolve` 之后，整个 `.link()` 才算被 `resolve` 了。Node.js 中，这段逻辑是用 C++ 写的，整个 `ModuleWrap` 都是用 C++ 写的。为了便于理解，我用不严谨的、简易的 JavaScript 伪代码说明一遍。

    ModuleWrap.prototype.link = async function link(callback) {
      if (this._linked) return;
      this._linked = true;
      
      const moduleRequests = GetModuleRequests();
      const promises = moduleRequests.map(moduleRequest => {
        const { specifier, ... } = moduleRequest;
        return callback(specifier, ...);
      });
      return Promise.all(promises);
    };
    

现在再回过头去看之前的 `this.module.link()`，应该就更好理解了。

##### 完成初始化

分析依赖并创建新的 `ModuleJob` 是其初始化的逻辑，意在去重。每个 `ModuleJob` 都有一个“已初始化（`instantiated`）”的 `Promise` 状态。

若是根模块，其初始化 `Promise` 状态会在做完整个依赖分析、创建新的 `ModuleJob` 并生成拍平的集合后被 `resolve`；剩下的在集合中的其他模块，由于不用单独解析其依赖树（在 `link()` 中已经做过了），所以无需单独初始化，只要在根模块初始化完成后，它们也就自然“初始化完成”了。事实上，根模块的初始化过程的最后，会手动直接将集合中的所有 `ModuleJob` 的初始化状态设为已完成。

    const resolvedPromise = Promise.resolve();
    
    ModuleJob.prototype._instantiate = async function _instantiate() {
      // 前面一坨“依赖树 → 需加载的模块集合”逻辑
      ...
    
      // 一些其他逻辑
      ...
      
      for (const dependencyJob of jobsInGraph) {
        // Calling `this.module.instantiate()` instantiates not only the
        // ModuleWrap in this module, but all modules in the graph.
        dependencyJob.instantiated = resolvedPromise;
      }
    };
    

### 模块类型映射

在 `ModuleJob` 中，Node.js 会根据不同的文件类型，去执行不同的代码逻辑。还记得在 CommonJS 中，这一块的逻辑是通过在 `Module._extensions` 对象的映射来的（可返回上一章，Ctrl+F，搜 `_extensions`）。而 ECMAScript modules 也类似，它有个 [translators 的 Map](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/translators.js#L114-L125 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/translators.js#L114-L125")，里面分别存了：

    translators.set('module', ...);
    translators.set('commonjs', ...);
    translators.set('builtin', ...);
    translators.set('json', ...);
    translators.set('wasm', ...);
    

根据目标模块类型不同，会走不同的逻辑，最终返回不同的 `ModuleWrap` 实例。这个判断同样是在 `ModuleJob` 的初始化函数中触发的。在创建 `ModuleWrap` 的时候，是通过一个叫 `moduleProvider` 的函数来做的。该[函数内部](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L452-L469 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L452-L469")会根据加载路径判断出其模块类型，然后从 `translators` 中获取对应类型的逻辑供其使用。而 `ModuleJob` 就是[调用 moduleProvider](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/module_job.js#L64 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/module_job.js#L64") 来拿到 `ModuleWrap` 的 `Promise`。

这里我们简单介绍一下 `module` 和 `commonjs` 的模块在 ECMAScript modules 里面是如何加载的。

#### module

`module` 的加载比较简单。拿着源码，尝试做一些 SourceMap 的逻辑之后，直接正儿八经实例化 `ModuleWrap` 就好了。

    const module = new ModuleWrap(url, undefined, source, 0, 0);
    

创建完之后，设置两个 `callback` 函数到一个 `Map` 中与该 `ModuleWrap` 关联起来：

1.  当 `import.meta` 好了之后会触发的回调，由 V8 控制时机；
2.  当在模块里面执行动态导入 `await import()` 时候会触发的回调。

    moduleWrap.callbackMap.set(module, {
      initializeImportMeta: (meta, wrap) => this.importMetaInitialize(meta, { url }),
      importModuleDynamically,
    });
    

Node.js 会设置这两类回调的整体回调函数到 V8 的 `Isolate` 对象中，V8 会在相应时机触发。而这两个整体回调中则又会通过 `Map` 的关联信息调用到对应的真实回调中。`import.meta` 那个就不细讲了，这个 `importModuleDynamically` 就是对于 `esmLoader.import()` 的透传。

    async function importModuleDynamically(specifier, { url }, assertions) {
      return asyncESM.esmLoader.import(specifier, url, assertions);
    }
    

> ##### CommonJS 中的动态加载 `await import()`
> 
> 还记得在模块机制详解（上）中所提到的吗？CommonJS 无法通过 `import` 语法加载 ESM 模块，但是可以通过 `import()` 语法来加载。
> 
> 在通过 `ScriptCompiler` 编译函数的时候，也是可以通过往里面传入动态加载模块的回调函数来让 CommonJS 模块支持 ESM 模块的。类似这样：
> 
>     const script = new Script(wrapper, {
>       filename,
>       lineOffset: 0,
>       importModuleDynamically: async (specifier, _, importAssertions) => {
>         const loader = asyncESM.esmLoader;
>         return loader.import(specifier, normalizeReferrerURL(filename),
>                              importAssertions);
>       },
>     });
>     
> 
> 此处的 `importModuleDynamically` 就是传回调的字段，里面的 `asyncESM.esmLoader.import()` 就是上面代码里面一样的函数。

做完这些事后，直接返回 `ModuleWrap` 实例就好了。**在** **`ModuleWrap`** **构造中，若是** **`module`** **模式，会通过** **`ScriptCompiler::CompileModule()`** **来编译得到一个** **V8** **的** **`Module`** **实例。**

#### commonjs

如果目标模块是个 CommonJS 模块（特定模式下的 `*.js` 文件等），那事情就变得不一样了。首先我们先删减掉跟模块缓存相关的逻辑。

在 `commonjs` 加载逻辑中，[第一步](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/translators.js#L193-L249 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/translators.js#L193-L249")是先通过文件名直接实例化一个 CommonJS 的 `Module` 对象，并分析出目标模块的导出名是什么。我对 `import` 真心不熟，看到 `export default`、`export xxx` 就头大。这里所谓的导出名（也许也根本不是这个术语）就是 `export` 后面的那货，一般默认情况下 ESM 的默认导出名是 `default`。在这个分析中，用到的是 [cjs-module-lexer](https://www.npmjs.com/package/cjs-module-lexer "https://www.npmjs.com/package/cjs-module-lexer") 包。这个“第一步”流程如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d09c765c106f4e479ba1fd92ab7cdcc9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=803&h=994&s=82647&e=png&a=1&b=ffffff)

> 图中我用红色来标记耗时操作，用紫色标记冗余操作。

若模块已加载，有缓存，那么流程图的第一步不用重新编译执行了，直接拿缓存即可。得到 `Module` 实例后，再读一次目标模块代码，供后续解析，这一步是冗余代码，但 `Module` 中并不存在模块源码，所以只能多读一次。接下去就是通过 cjs-module-lexer 进行语法分析，解析出 `module.exports` 了哪些内容。如果直接 `exports` 了另一个模块的内容，还得解析出 re-export 出了哪些模块。**这是一个重 CPU 计算的过程，并且至少目前还是用** **JavaScript** **写的。**

然后若至少存在一个 re-export 的情况，还需要递归目标模块，以同样的方式解析出它及其子模块的 `Module` 对象及 `exports` 内容。唧唧复唧唧。不过递归过程中，一样是会存在一些缓存的逻辑的。

最终，遍历完整棵依赖树之后，我们就得到了该 CommonJS 模块的导出名了。

这里就是 CommonJS 与 ECMAScript modules 的不同。原生 CommonJS 很随意，给我泡芙，给你注入。而 ECMAScript modules 则需要静态分析出它所有的导出内容，自然就需要涉及到模块树。哪怕是在 ECMAScript module 的模块加载中，也是存在解析模块树并拍平的逻辑。只不过 CommonJS 在这棵树遍历的过程中，多了一步静态分析。

这种 patch 式的兼容，是以性能为代价换取的。而且这种“兼容方式”也存在一定桎梏——毕竟 CommonJS 是无法被完全静态分析的。想想上面的这一整段逻辑，哪怕我们不知道 cjs-module-lexer 里面的具体逻辑，也能随意构造出一个它无法识别的场景。比如：

    // ./temp/foo.js
    module.exports = {
      foo: 'bar',
    };
    
    // ./cjs.js
    module.exports = {};
    
    const files = require('fs').readdirSync(__dirname + '/temp');
    for (const filename of files) {
      const name = './temp/' + filename;
      module.exports = {
        ...module.exports,
        ...require(name),
      };
    }
    
    // ./esm.mjs
    import { foo } from './cjs.js';
    

上面三个代码文件中，你去执行 `$ node esm.mjs` 就会挂掉。看吧，Node.js 在错误堆栈中认怂了。

    file:///esm.mjs:1
    import { foo } from './cjs.js';
             ^^^
    SyntaxError: Named export 'foo' not found. The requested module './cjs.js' is a CommonJS module, which may not support all module.exports as named exports.
    CommonJS modules can always be imported via the default export, for example using:
    
    import pkg from './cjs.js';
    const { foo } = pkg;
    
        at ModuleJob._instantiate (node:internal/modules/esm/module_job:123:21)
        at async ModuleJob.run (node:internal/modules/esm/module_job:189:5)
        at async Promise.all (index 0)
        at async ESMLoader.import (node:internal/modules/esm/loader:526:24)
        at async loadESM (node:internal/process/esm_loader:91:5)
        at async handleMainPromise (node:internal/modules/run_main:65:12)
    

它没法通过静态分析出 `cjs.js` 中有导出 `foo` 字段，毕竟它是动态扫目录搞到的。不过，它也给我们提供了个方案，使用 `default`。这个我没在流程图中展示出来，其实 `exports` 名里面默认都存在一个 `default`，然后再是去静态分析。

在得到导出名后，Node.js 会尝试走 CommonJS 的 `Module` 实例的加载模块操作，将其模块通过读取源码、编译、执行、注入等上一章说的步骤去拿到模块对应的 `module.exports`。若有缓存了另当别论。

构造出 ECMAScript modules 的 `ModuleWrap` 时，传入刚才解析出来的导出名，也传入为 `ModuleWrap` 赋值实际导出对象的回调函数。在 `import` 时会识别该导出名，对应的内容会在后面那个回调函数中赋值给 `ModuleWrap`。**这个情况下，** **Node.js** **调用的是** **V8** **的** **[Module::CreateSyntheticModule()](https://v8.github.io/api/head/classv8_1_1Module.html#ae0e40dbfc536ec53aca1a0135d788a52 "https://v8.github.io/api/head/classv8_1_1Module.html#ae0e40dbfc536ec53aca1a0135d788a52")** **来得到 V8 的** **`Module`** **对象。里面所需要的信息刚好就是** **`exports`** **名，以及一个映射的函数。**

> ##### JSON？
> 
> JSON 我就不细讲了，大家可以根据 commonjs 的加载过程推导出来 JSON 是如何加载的。最终也是通过 `Module::CreateSyntheticModule()`，以及类似的逻辑。大家自己思考一下吧，若想求证，也可自行翻阅[源码](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/translators.js#L266-L319 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/translators.js#L266-L319")。

### 执行模块

主模块是要执行的。在通过 ESMLoader 加载模块后，只是生成了 `ModuleWrap` 对象，执行它才会出效果。在 Node.js 中，执行一个 ESM 是通过 `ModuleWrap.prototype.evaluate()` 来完成的。它的第一个参数是 `timeout`，后面参数我们就不提了。主模块的执行 `timeout` 是 `-1`，即死循环了也没不会有问题。这个参数的主要作用是在 `vm.Module` 中来限制执行时间的。它的限时原理我们在事件循环的相关章节中有提——WatchDog 限时打骨折。

在 `evaluate()` 中，主要有三种逻辑：

1.  限时 WatchDog 相关逻辑，仅在 `vm.Module` 中被使用；
2.  通过 V8 的 `Module::Evaluate()` 去执行模块得到结果；
3.  若该模块的运行时上下文（`vm.Context`）非主环境上下文，则手动触发微任务——`microtask_queue->PerformCheckpoint(isolate)`。

其实如果没有 `vm` 那茬子事，整个 `evaluate()` 实际上就是透传调用 V8 的 `Module::Evaluate()` 执行模块得到结果。

ECMAScript modules 的寻径
----------------------

篇幅又超长了啊，模块机制详解我已经从一章拆成上中下了，不能再拆了，不然得涨价了🙄。明明是个自己不熟悉的东西，怎么还能写得跟裹脚布一样。反正寻径就是个规则，我这里就长话短说了，反正规则在 Node.js 文档里面有。

寻径源码在 [ESMLoader 中](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L789-L896 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/loader.js#L789-L896")。我们知道，Node.js 现在是可以自定义寻径规则和自定义加载器，这样就可以支持类似 URL 的方式了。所有的自定义寻径都以参数形式加载，以 Hook 函数的形式存在 Node.js 中。在寻径第一步，先过一遍自定义寻径 Hook 链，然后再走默认寻径逻辑（同理，自定义加载器也是在加载过程中会先过一遍自定义加载 Hook 链）。

默认的寻径 Hook 叫 [defaultResolve](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/resolve.js#L1063-L1190 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/modules/esm/resolve.js#L1063-L1190")，其规则在 Node.js 文档中[一步步有列举](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#resolver-algorithm "https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#resolver-algorithm")。我就不详解啦。

模块机制小结
------

Node.js 的模块分为两种：CommonJS 模块与 ECMAScript modules。前者是一个被封装得很好的 IIFE 伪装成 CommonJS 规范，通过 `vm` 模块执行得到，后者则用的 V8 中的 `Module` 概念。

除了它们自身的加载之外，CommonJS 与 ECMAScript modules 在 Node.js 中相爱相杀，相互兼容，你中有我、我中有你，甚至很多代码都没解耦，直接互调。CommonJS 模块通过在 V8 中的 `ScriptCompiler` 中传入动态 `import` 的 `callback` 来达到支持 `import()` 语法的目的；ECMAScript modules 则通过静态分析的方式，为 CommonJS 模块的命名导入提供兼容，这是以性能为代价换来的。

CommonJS 的内容比较随意，导出不管你是什么，加载是同步的（就连读代码用的都是 `fs.readFileSync()`）；而 ECMAScript modules 则更严谨，所有的导入导出都在语法层面限定死，可被静态分析，所以在 V8 加载它的时候就需要把整个模块树都分析出来，这样才能层层递进，每个导出项都能被定向列举，它的加载是异步的（读代码也是用的 `fs/promises` 中的 `readFile()`）。

无论是哪种模块机制，**其最本质都是闭包的体现**。就是这两种模块机制，作为 Node.js 中代码的执行单位，聚合成 npm 包，才有了今日 Node.js 庞大的生态。