本节我们将一起了解 Promise 以及 Async function 的底层实现。

我们将采用这样的顺序：先 Promise 再 Async function，先回顾基本概念、再探究底层实现。

异步操作
----

同步操作会阻塞线程，因为 Caller 会一直等待 Callee 返回其处理结果，期间其他的业务逻辑将无法被执行，如果 Callee 处理耗时比较长，很明显会影响整体业务效果。引入「异步操作 asynchronous operation」可以有效地解决上面的问题，比如下图中：

![async_flow](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b991e20e30b3463a83253257ec7ab7ec~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1302&h=962&e=png&b=fefefe)

*   左侧 `A` 对 `B` 的调用是同步调用，在 `B` 未返回之前，`C` 和 `D` 的逻辑则无法被处理
    
*   右侧 `B` 变为异步操作，这样 `A` 调用 `B` 之后，`A` 得到一个来自 `B` 返回的 `Promise` 对象，接着 `A` 随即返回，这样 `C` 和 `D` 的逻辑得以执行
    

再举一个饭店点餐的例子：

*   客户 `A` 点了一个菜 `B`，后者的制作时间比较长
    
*   引擎就好比点餐系统
    

对于同步调用来说：`A` 会一直在下单出等待 `B` 出参，很明显会导致排在 `A` 之后的 `C` 逐渐失去耐心。

对于异步操作则是：

1.  `A` 点了 `B` 之后，系统会给 `A` 一个回执单（好比 `Promise`）
    
2.  `A` 可以在回执单上填写一些它希望 `B` 完成时系统需要执行的操作（好比通过 `then` 指定回调），比如是堂食还是外带
    
3.  接着 `A` 就去一旁安心等待了，`C` 就可以上前和点餐系统交互
    
4.  未来的某一时刻，系统会在 `B` 出餐后，翻出回执单查看记录的内容，完成 `A` 预期的操作
    

States and Fates
----------------

文档 [States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md "https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md") 描述了 Promise 的内部机制，其中提出了两个名词：

*   States
    
*   Fates
    

大家可以先快速浏览一遍文档内容，尝试理解一下，然后我们在文档的基础上进行一些通俗的解释。

### Fates

我们知道 Promise 表示异步操作的结果，这个结果可能是一个立即数，也可能是未来计算出来的值。不管怎样，Promise 后续的变更应该是由异步操作的 Callee 来完成，而 Caller 只需要对变更进行消费即可。

Callee 操作 Promise 的方式有 2 中：

*   `resolve`
    
*   `reject`
    

这 2 种方式只能选其一，并只能操作 1 次，所以从 Callee 的角度来看，Promise 的 fates 只有 2 中可能：

*   _resolved_，即「操作过」
    
*   _unresolved_，即「未操作过」
    

我们可以使用下图进行示意：

![promise_fates](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9110dd1177c240369a5c06d0f61fe022~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1282&h=582&e=png&b=fefefe)

*   Callee 可以通过 `resolve|reject` 来对 Promise 进行变更
    
*   变更会将 Promise 从 unresolved 变为 resolved
    

上图的问号表示，并不是 Promise 变为 resolved 之后，Caller 就会即刻被处理，因为 Callee 可以 resolve 另一个没有立即结果的 Promise1：

    const p = new Promise((resolveOuter) => /* Callee */ {
      const p1 = new Promise((resolveInner) => {
        setTimeout(resolveInner, 1000);
      });
      resolveOuter(p1); // 1
    });
    
    // Caller
    const f = () => console.log(f);
    p.then(f);
    

比如上面的代码，在位置 `1` 处进行了 resolve 后，`p` 就变成了 `resolved`，但是 `f` 也不会被调用，需要等到 `p1` 也计算出结果。

### States

接着上面的代码例子，为了回答何时调用 `f` 的问题，引入了 States：

*   _fulfilled_，表示 Promise 得到了立即数结果
    
*   _rejected_，表示 Promise 求值遇到问题
    
*   _pending_，初始状态，会变为上面 2 个状态之一
    

简单地说，Callee 把 Promise 给 _resolve_ 掉之后，具体什么时候调用 Caller，都托管给引擎来完成。但是引擎的操作也得有的放矢，其依据就是这里的 States。

_fulfilled_ 和 _rejected_ 一起又可以一称为 _settled_，也就是说当 Promise 变为 settled 后，引擎会调用 Caller。

对照上面的例子：

*   我们在 Caller 处发起对 Callee 调用，Callee 的操作即注释 `/* Callee */` 函数体中的内容
    
*   我们的 Caller 发起异步调用后，能做的就是消费 `p` 的状态变更，即通过 `p.then` 指定了回调 `f`
    
*   Callee 在完成后异步操作后，会改变 `p` 的 fates，通过函数 `resolveOuter` 的调用，`p` 变为 _resolved_
    
*   `p` 变为 _resolve_ 后引擎也不一定会调用 `Caller`，因为引擎是根据 states 来决定是否调用 Caller，这么设计是因为 `Callee` 可能像例子中一样返回了另一个 Promise
    
*   最后当 `p` 的 states 变为 _settled_ 后，Caller 相应的回调会被引擎调用
    

### 回顾

上面的内容可以小结为：

*   Promise 表示异步操作的结果，同时也是异步操作 Caller 和 Callee 之前能够完成协同的纽带
    
*   Promise 的状态变更将由 Callee 进行，Callee 只能操作状态一次，因此有 Fates 的概念：_resolved_ 或 _unresolved_
    
*   Promise 的 fates 变为 _resolved_ 后，引擎也不一定会支持其 Caller 的回调，因为 Callee 可能会返回另一个 Promise 实例
    
*   为了解决何时调用 Caller 的问题，引入了 States：_fulfilled_，_rejected_ 和 _pending_，前 2 个统称 _settled_，当 Promise 变为 _settled_ 后，引擎会返回调用 Caller（注册的回调）
    

Callee 作为异步操作的执行方，决定了 Promise 的 Fates，但何时 Caller 的回调被调用，则托管给了引擎根据 Promise 的 States 来决定。

Promise 对象
----------

这一节我们将了解引擎内部是如何创建 Promise 对象的，我们可以通过查看 Promise 构造函数的实现方式为入口。

Promise 构造函数的设置是在函数 [JS\_AddIntrinsicPromise](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L956 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L956") 中完成的：

      ctx->class_proto[JS_CLASS_PROMISE] = JS_NewObject(ctx);
      JS_SetPropertyFunctionList(ctx, ctx->class_proto[JS_CLASS_PROMISE], // 1
                                 js_promise_proto_funcs,
                                 countof(js_promise_proto_funcs));
      obj1 = JS_NewCFunction2(ctx, js_promise_constructor, "Promise", 1,  // 2
                              JS_CFUNC_constructor, 0);
      ctx->promise_ctor = JS_DupValue(ctx, obj1);
      JS_SetPropertyFunctionList(ctx, obj1, js_promise_funcs,             // 3
                                 countof(js_promise_funcs));
      JS_NewGlobalCConstructor2(ctx, obj1, "Promise",                     // 4
                                ctx->class_proto[JS_CLASS_PROMISE]);
    

上面代码分为 3 部分：

*   位置 `1` 处是设置 `Promise.prototype` 上的原型方法
    
*   位置 `2` 处是定义 `Promise` 构造函数
    
*   位置 `3` 处是设置 `Promise` 上的静态方法
    
*   位置 `4` 处是将构造函数挂在全局对象之上
    

构造函数的定义时使用的 `JS_CFUNC_constructor` 表示 Promise 需经由 `new` 关键字调用：

    Promise(); // TypeError: must be called with new
    

通过查看字节码序列可以知道 `new` 关键字对应的字节码指令为 `OP_call_constructor`，因此 `new Promise` 会经过下面的调用：

    C: JS_CallConstructorInternal
      C: js_call_c_function
        C: js_promise_constructor # 实际操作
    

继续查看函数 [js\_promise\_constructor](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L303 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L303") 的实现：

    static JSValue js_promise_constructor(JSContext *ctx, JSValueConst new_target,
                                          int argc, JSValueConst *argv) {
      // ...
      JSPromiseData *s;
      JSValue args[2], ret;
      int i;
    
      executor = argv[0];                                                  // 1
      if (check_function(ctx, executor)) 
        return JS_EXCEPTION;
      obj = js_create_from_ctor(ctx, new_target, JS_CLASS_PROMISE);        // 2
      if (JS_IsException(obj))
        return JS_EXCEPTION;
      s = js_mallocz(ctx, sizeof(*s));                                     // 3
      if (!s)
        goto fail;
      s->promise_state = JS_PROMISE_PENDING;                               // 4
      s->is_handled = FALSE;
      for (i = 0; i < 2; i++)
        init_list_head(&s->promise_reactions[i]);
      s->promise_result = JS_UNDEFINED;
      JS_SetOpaque(obj, s);                                                // 5
      if (js_create_resolving_functions(ctx, args, obj))                   // 6
        goto fail;
      ret = JS_Call(ctx, executor, JS_UNDEFINED, 2, (JSValueConst *)args); // 7
      // ...
      return obj;
      // ...
    }
    

上面的代码对应的解释为：

*   位置 `1` 处是校验我们调用 Promise 构造函数时，传入的参数是否为函数类型，我们称传入的函数为 executor
    
*   位置 `2` 处创建了 Promise 对象
    
*   位置 `3` 处实例化了一个 C 结构 `JSPromiseData`
    
*   位置 `4` 处设置了 `JSPromiseData::promise_state`，对应上了我们在上一个章节提到的 Promise 初始 State 为 _pending_
    
*   位置 `5` 将 `JSPromiseData` 挂在了 Promise 对象上。这么做即可以对 JS 隐藏该实现细节，也可以提高对其中字段的访问效率
    
*   位置 `6` 是创建用于调用 executor 的两个函数：`resolve` 和 `reject`
    
*   位置 `7` 使用上一步创建的两个函数调用 executor
    

继续查看函数 [js\_create\_resolving\_functions](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L149 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L149") 的实现：

    static int js_create_resolving_functions(JSContext *ctx,
                                             JSValue *resolving_funcs,
                                             JSValueConst promise)
    
    {
      JSValue obj;
      JSPromiseFunctionData *s;
      JSPromiseFunctionDataResolved *sr;
      int i, ret;
    
      sr = js_malloc(ctx, sizeof(*sr));                        // 1
      if (!sr)
        return -1;
      sr->ref_count = 1;
      sr->already_resolved = FALSE; /* must be shared between the two functions */
      ret = 0;
      for (i = 0; i < 2; i++) {
        obj = JS_NewObjectProtoClass(ctx, ctx->function_proto, // 2
                                     JS_CLASS_PROMISE_RESOLVE_FUNCTION + i);
        if (JS_IsException(obj))
          goto fail;
        s = js_malloc(ctx, sizeof(*s));                        // 3
        if (!s) {
          JS_FreeValue(ctx, obj);
        fail:
    
          if (i != 0)
            JS_FreeValue(ctx, resolving_funcs[0]);
          ret = -1;
          break;
        }
        sr->ref_count++;
        s->presolved = sr;                                     // 4
        s->promise = JS_DupValue(ctx, promise);                // 5
        JS_SetOpaque(obj, s);                                  // 6
        js_function_set_properties(ctx, obj, JS_ATOM_empty_string, 1);
        resolving_funcs[i] = obj;
      }
      js_promise_resolve_function_free_resolved(ctx->rt, sr);
      return ret;
    }
    

上面代码对应的解释为：

*   位置 `1` 处实例化了 `JSPromiseFunctionDataResolved`，即上一章节提到的 Fates。该实例会被 `resolve` 和 `reject` 函数共享
    
*   位置 `2` 处会分别创建 `resolve` 和 `reject` 函数，我们称之为 resolving functions
    
*   位置 `3` 处实例化了 `JSPromiseFunctionData`，用于 resolving functions 记录一些上下文信息
    
*   位置 `4` 和 `5` 使得 resolving functions 能够通过 `JSPromiseFunctionData` 再访问到记录了 Fates 的 `JSPromiseFunctionDataResolved` 以及 Promise 对象
    
*   位置 `6` 则是将 `JSPromiseFunctionData` 挂在 resolving functions 上，对 JS 屏蔽实现细节
    

关于 Promise 对象的创建有下面几个关键点：

*   Promise 对象上的 `JSPromiseData` 保存了 Sates
    
*   resolving functions 的 `JSPromiseFunctionData` 上保存了操作结果，并可以访问到保存了 Fates 的 `JSPromiseFunctionDataResolved`
    
*   resolving functions 的 `JSPromiseFunctionData` 还可以访问到它们关联的 Promise 对象
    
*   `JSPromiseData` 和 `JSPromiseFunctionData` 这些因为是内部实现，所以选用 C 结构体对 JS 屏蔽底层实现，也可以一定程度上提高内存访问效率
    
*   由于 Callee 需通过 resolving functions 变更 Promise 对象，所以才要记录上面的上下文信息
    

Then
----

异步操作的发起方可以通过 `Promise.prototype.then` 方法注册结果响应函数，我们先看看其内部实现。

`js_promise_proto_funcs` 中包含了 Promise 的原型方法定义：

    static const JSCFunctionListEntry js_promise_proto_funcs[] = {
        JS_CFUNC_DEF("then", 2, js_promise_then),
        JS_CFUNC_DEF("catch", 1, js_promise_catch),
        JS_CFUNC_DEF("finally", 1, js_promise_finally),
        JS_PROP_STRING_DEF("[Symbol.toStringTag]", "Promise", JS_PROP_CONFIGURABLE),
    };
    

可以看到 `then` 方法对应的函数为 `js_promise_then`：

    static JSValue js_promise_then(JSContext *ctx, JSValueConst this_val, int argc,
                                   JSValueConst *argv) {
      JSValue ctor, result_promise, resolving_funcs[2];
      JSPromiseData *s;
      int i, ret;
    
      s = JS_GetOpaque2(ctx, this_val, JS_CLASS_PROMISE);
      if (!s)
        return JS_EXCEPTION;
    
      ctor = JS_SpeciesConstructor(ctx, this_val, JS_UNDEFINED);              // 1
      if (JS_IsException(ctor))
        return ctor;
      result_promise = js_new_promise_capability(ctx, resolving_funcs, ctor); // 2
      JS_FreeValue(ctx, ctor);
      if (JS_IsException(result_promise))
        return result_promise;
      ret = perform_promise_then(ctx, this_val, argv,                         // 3
                                 (JSValueConst *)resolving_funcs);
      for (i = 0; i < 2; i++)
        JS_FreeValue(ctx, resolving_funcs[i]);
      if (ret) {
        JS_FreeValue(ctx, result_promise);
        return JS_EXCEPTION;
      }
      return result_promise;                                                  // 4
    }
    

上面的代码比较好理解的部分是：

*   位置 `2` 创建了一个新的 Promise 对象 promise′promise'promise′，并在位置 `4` 处将其作为返回值返回
    
*   位置 `3` 处调的 `perform_promise_then` 函数名看起来像是调用了当前 promisepromisepromise 对象上的 `then` 方法
    

余下的部分将在下文逐步展开。

### Promise\[@@species\]

`js_promise_then` 函数中位置 `1` 处调用了函数 [JS\_SpeciesConstructor](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/intrins/obj.c#L966 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/vm/intrins/obj.c#L966")，其作用是实现标准中定义的 [Promise\[@@species\]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/@@species "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/@@species")。

`Promise[@@species]` 的作用可以简单概括为：

*   首先 Promise 对象上的方法 `then`、`catch` 和 `finally` 调用后会返回一个新的 Promise 对象
    
*   显然，创建 Promise 对象就需要一个构造函数 CCC
    
*   `Promise[@@species]` 提供了让继承自 Promise 的派生类能够自定义 CCC 的机制
    

比如下面的代码：

    class SubPromise extends Promise {}
    
    const p = new SubPromise(() => {}).then();
    console.log(p instanceof SubPromise); // true
    console.log(p instanceof Promise); // true
    

将 `SubPromise` 的 `@@species` 方法修改后：

    class SubPromise extends Promise {
      static get [Symbol.species]() {
        return Promise;
      }
    }
    const p = new SubPromise(() => {}).then();
    console.log(p instanceof SubPromise);
    console.log(p instanceof Promise);
    

了解了 `Promise[@@species]` 的作用后，我们还需要简单整理下 `Promise[@@species]` 的内部执行方式：

*   如果调用 `then` 时的 `this.constructor` 或者 `this.constructor[@@species]` 为 `undefined` 或者 `null`，则使用默认的构造函数，即 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise")
    
*   否则将使用 `this.constructor[@@species]` 方法的返回值作为构造函数。如果该方法返回的内容不能作为构造函数，那么将抛出类似「非构造函数」的异常
    

### PromiseCapability

`js_promise_then` 函数中位置 `2` 处调用了函数 [js\_new\_promise\_capability](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L371 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L371")，其作用是实现标准中定义的 [PromiseCapability](https://tc39.es/ecma262/#sec-promisecapability-records "https://tc39.es/ecma262/#sec-promisecapability-records")。

根据标准中的定义，PromiseCapability（下面简称 PC） 包含 3 个字段：

*   `[[Promise]]`，表示 Promise 对象 ppp
    
*   `[[Resolve]]`，一个函数对象，可以 resolve 上面 ppp
    
*   `[[Reject]]`，一个函数对象，可以 reject 上面 ppp
    

于是 `js_new_promise_capability` 函数的作用就很明显：

*   根据 `ctor` 来创建一个 Promise 对象 ppp
    
*   参数 `resolving_funcs` 是出参，为函数数组，数组元素分别为 ppp 的 `[[Resolve]]` 和 `[[Reject]]`
    

引擎中没有 PC 实体结构，而是通过 `js_new_promise_capability` 的返回值包含了 PC 所规定的字段：

    // 由于 C 语言不支持多返回值，所以利用出参实现多返回值
    const resolving_funcs = [];
    function js_new_promise_capability(resolving_funcs, ctor) {
      return new ctor((resolve, reject) => {
        resolving_funcs[0] = resolve;
        resolving_funcs[1] = reject;
      });
    }
    

### PerformPromiseThen

假设我们有一个 Promise 对象 promisepromisepromise，那么调用其 `then` 方法的过程可以表示为：

then(promise,onFulfilled,\[onRejected\])→promise′then(promise, onFulfilled,\[onRejected\]) \\rightarrow promise'then(promise,onFulfilled,\[onRejected\])→promise′

产生 promise′promise'promise′ 是因为：

*   调用 promisepromisepromise 的 `then` 方法表示注册 promisepromisepromise 的结果操作函数，当 promisepromisepromise 的 state 变为 _settled_ 时，对应的结果操作函数将被调用
    
*   但 `then` 方法本身也属于一个异步操作，因为注册结果操作函数时可能 promisepromisepromise 尚未处于 _settled_ 状态，于是返回了 promise′promise'promise′ 表示此异步操作
    

对于引擎来说需要解决下面的问题：

*   当 promisepromisepromise 的 state 变为 _settled_ 时，调用注册的 onFulfilledonFulfilledonFulfilled 或者 onRejectedonRejectedonRejected
    
*   onFulfilledonFulfilledonFulfilled 或者 onRejectedonRejectedonRejected 调用结束后，能够变更 promise′promise'promise′ 的 state
    

标准中的 [PerformPromiseThen](https://tc39.es/ecma262/#sec-performpromisethen "https://tc39.es/ecma262/#sec-performpromisethen") 详细规定了上述问题的处理步骤。对应到引擎中的实现为 `js_promise_then` 函数中位置 `3` 处调用的函数 `perform_promise_then`：

    __exception int perform_promise_then(JSContext *ctx, JSValueConst promise,
                                         JSValueConst *resolve_reject,
                                         JSValueConst *cap_resolving_funcs) {
      JSPromiseData *s = JS_GetOpaque(promise, JS_CLASS_PROMISE);
      JSPromiseReactionData *rd_array[2], *rd;
      int i, j;
    
      rd_array[0] = NULL;
      rd_array[1] = NULL;
      for (i = 0; i < 2; i++) {
        // 1
      }
    
      if (s->promise_state == JS_PROMISE_PENDING) {
        // 2
      } else {
        // 3
      }
      s->is_handled = TRUE;
      return 0;
    }
    

标准中定义的 PerformPromiseThen 函数的签名为：

PerformPromiseThen(promise,onFulfilled,onRejected\[,resultCapability\])PerformPromiseThen ( promise, onFulfilled, onRejected \[ , resultCapability \] )PerformPromiseThen(promise,onFulfilled,onRejected\[,resultCapability\])

引擎实现的函数 `perform_promise_then` 签名中的参数与之对应的关系是：

*   `promise` 对应标准中的 promisepromisepromise
    
*   `resolve_reject` 对应标准中的 onFulfilledonFulfilledonFulfilled 和 onRejectedonRejectedonRejected
    
*   `cap_resolving_funcs` 对应标准中的 resultCapabilityresultCapabilityresultCapability
    

了解参数的对应关系可以方便我们对照标准查看引擎的实现。

回到函数 `perform_promise_then` 的实现，其操作可以分为 3 部分：

*   首先是位置 `1` 处构造了 2 个 `JSPromiseReactionData` 实例
    
*   其次是位置 `2` 处，表示如果当前 Promise 的 state 为 _pending_ 时的操作
    
*   然后是 `3` 处，表示当前 Promise 的 state 为 _settled_ 时的操作
    

### PromiseReaction

`JSPromiseReactionData` 对应标准中的 [PromiseReaction](https://tc39.es/ecma262/#sec-promisereaction-records "https://tc39.es/ecma262/#sec-promisereaction-records")，其作用可以看成是记录了 Promise 的 state 变为 settled 时回调所需的上下文，引擎中的定义为：

    typedef struct JSPromiseReactionData {
      struct list_head link; /* not used in promise_reaction_job */
      JSValue resolving_funcs[2];
      JSValue handler;
    } JSPromiseReactionData;
    

假设我们调用了 promisepromisepromise 的 `then` 方法产生了 promise′promise'promise′，那么上面的字段对应的解释为：

*   `resolving_funcs` 表示 promise′promise'promise′ 的 `resolve` 和 `reject` 方法
    
*   `handler` 表示调用 promisepromisepromise `then` 时传入的回调函数
    
*   `link` 则用于将该 PromiseReaction 记录添加到 promisepromisepromise 的 Reactions 列表中
    

promisepromisepromise 的 Reactions 列表定义在结构体 `JSPromiseData` 中：

    typedef struct JSPromiseData {
      JSPromiseStateEnum promise_state;
      /* 0=fulfill, 1=reject, list of JSPromiseReactionData.link */
      struct list_head promise_reactions[2];
      BOOL is_handled; /* Note: only useful to debug */
      JSValue promise_result;
    } JSPromiseData;
    

我们可以通过下图理解上面的关系：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4132ea7f3c6e4167a6afd6743adf2595~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1456&h=1594&e=png&b=ffffff)

promisepromisepromise 内部有 2 个 reactions 列表，分别用于存放 promisepromisepromise 的状态变为 _fulfilled_ 或 _rejected_ 时需要进行的操作。了解这个数据结构之后，就可以理解 `perform_promise_then` 中位置 `2` 和 `3` 的部分了：

*   如果当前 promisepromisepromise 对象的状态为 _pending_，那么就将 PromiseReaction 添加到两个 reactions 列表中。因为尚不知道该 promisepromisepromise 最终是 _fulfilled_ 还是 _rejected_
    
*   如果当前 promisepromisepromise 状态已经为 _settled_，那么根据其具体状态调用 PromiseReactiononFulfilledPromiseReaction\_{onFulfilled}PromiseReactiononFulfilled​ 或者 PromiseReactiononRejectedPromiseReaction\_{onRejected}PromiseReactiononRejected​
    

### HostEnqueuePromiseJob

标准中对 PromiseReaction 执行的方式可以简单概括为：

*   通过调用 [NewPromiseReactionJob](https://tc39.es/ecma262/#sec-newpromisereactionjob "https://tc39.es/ecma262/#sec-newpromisereactionjob") 构造一个 PromiseReactionJob
    
*   然后将 PromiseReactionJob 通过 [HostEnqueuePromiseJob](https://tc39.es/ecma262/#sec-hostenqueuepromisejob "https://tc39.es/ecma262/#sec-hostenqueuepromisejob") 函数压入待处理队列
    

因此 `perform_promise_then` 位置 `3` 处的执行分为 2 块：

*   构造 `args` 作为创建 PromiseReactionJob（对应引擎实现为 `JSJobEntry`） 所需的参数
    
*   `JS_EnqueueJob` 则是创建 `JSJobEntry` 实例并将其加入到任务列表 `JSRuntime::job_list` 中
    

任务添加到队列之后，将由另外的代码去处理队列中的内容，会在后面的章节中介绍。

### 回顾

本节的内容可以小结为：

*   调用 promisepromisepromise 的 `then` 方法，因为也是一个异步操作，所以会产生一个新的 Promise 对象 promise′promise'promise′
    
*   调用 `then` 方法会在引擎内部会创建 PromiseReaction 用于记录 promisepromisepromise 和 promise′promise'promise′ 的关联信息:
    
    *   promise′promise'promise′ 的 `resolve` 和 `reject` 方法
        
    *   以及调用 promisepromisepromise `then` 时传入的回调函数 `handler`
        
*   如果调用 `then` 时 promisepromisepromise 状态已经为 _settled_，那么会使用 PromiseReaction 信息构造 PromiseReactionJob 并加入到任务队列中
    
*   如果调用 `then` 时 promisepromisepromise 状态为 _pending_，那么会将 PromiseReaction 添加到 promisepromisepromise 的两个 reactions 列表中，等到 `promise` 状态变为 _settled_ 时再执行它们
    

Resolve
-------

上文我们多次提到，_resolved_ 后的 Promise 其 Caller 并不一定会被引擎执行，引擎执行看的是 Promise 的 states，我们来看一个具体的例子：

    const executor = (resolve, reject) => setTimeout(resolve, 1000);
    const p = new Promise(executor);
    console.log(p); // Promise {<pending>}
    setTimeout(() => console.log(p), 1500); // Promise {<fulfilled>: undefined}
    

在上面的例子中：

*   构造 Promise 对象 promisepromisepromise 时会执行 executor，在其中我们没有立即操作 `resolve` 和 `reject`，所以 promisepromisepromise 的 state 为 _pending_，即第一次打印 `p` 的状态为 `<pending>`
    
    因为 promisepromisepromise 的 state 为 _pending_，所以在 promisepromisepromise 的 reactions 列表中追加了新的 PromiseReaction 记录
    
*   在大约 1s 后我们调用了 promisepromisepromise 的 `resolve` 函数，并且 `resolve` 时传递的是一个立即数 `undefined`，所以 promisepromisepromise 的 state 变为了 _fulfilled_
    
*   在大约 1.5s 后我们打印 `p` 的状态，发现其已经变为 _fulfilled_
    

由于引擎层对 `resolve` 和 `reject` 方法的实现类似，接下来我们将主要看 `resolve` 方法的实现。

在函数 [JS\_AddIntrinsicPromise](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L956 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L956") 中可以找到 `resolve` 方法的绑定信息：

    rt->class_array[JS_CLASS_PROMISE_RESOLVE_FUNCTION].call =
            js_promise_resolve_function_call;
    

标准中对引擎应该如何实现 `resolve` 方法给出的定义是 [Promise Resolve Functions](https://tc39.es/ecma262/#sec-promise-resolve-functions "https://tc39.es/ecma262/#sec-promise-resolve-functions")，对应的引擎实现即为函数 [js\_promise\_resolve\_function\_call](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L212 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L212")：

    static JSValue js_promise_resolve_function_call(JSContext *ctx,
                                                    JSValueConst func_obj,
                                                    JSValueConst this_val, int argc,
                                                    JSValueConst *argv, int flags) {
      JSObject *p = JS_VALUE_GET_OBJ(func_obj);
      JSPromiseFunctionData *s;
      JSValueConst resolution, args[3];
      JSValue then;
      BOOL is_reject;
    
      s = p->u.promise_function_data;
      if (!s || s->presolved->already_resolved)                             // 1
        return JS_UNDEFINED;
      s->presolved->already_resolved = TRUE;                                // 2
      if (is_reject || !JS_IsObject(resolution)) {                          // 3
        goto done;
      } else if (js_same_value(ctx, resolution, s->promise)) {
        // ..
      }
      then = JS_GetProperty(ctx, resolution, JS_ATOM_then);                 // 4
      if (JS_IsException(then)) {
        // ...
      } else if (!JS_IsFunction(ctx, then)) {
        JS_FreeValue(ctx, then);
      done:
        fulfill_or_reject_promise(ctx, s->promise, resolution, is_reject);  // 5
      } else {
        args[0] = s->promise;
        args[1] = resolution;
        args[2] = then;
        JS_EnqueueJob(ctx, js_promise_resolve_thenable_job, 3, args);       // 6
        JS_FreeValue(ctx, then);
      }
      return JS_UNDEFINED;
    }
    

上面的代码可以理解为：

*   位置 `1` 处首先判断当前的 promisepromisepromise 是否已经为 `resolved` 状态（Fate），如果是的话，那么直接返回 `undefined`，否则进入位置 `2` 处将其状态设置为 `resolved`
    
*   位置 `3` 处判断调用 `resolve` 方法传入的参数 `resolution` 是否为对象类型，如果不是直接跳转到位置 `5` 处的处理
    
*   位置 `4` 和 `5` 先看对象是否实现了 `then` 方法，如果未实现，则进入位置 `5` 处的处理
    
*   如果 `resolution` 实现了 `then` 方法，那么会进入位置 `6` 处的处理
    

上面的步骤可以进一步简化为：

*   promisepromisepromise 的 Fates 经 `resolve` 方法调用后会变为 `resolved`
    
*   如果 `resolution` 为立即数，那么进入位置 `5` 的处理
    
*   如果 `resolution` 实现了 `then` 方法，即为 `thenable`，那么进入位置 `6` 的处理
    

### FulfillPromise

`resolution` 为立即数时表示异步操作已经得出结果，引擎接下来的工作就是修改 Promise 对象的状态（State），并根据不同的状态处理对应的 Reactions 列表。

标准中对这部分的描述在 [FulfillPromise](https://tc39.es/ecma262/#sec-fulfillpromise "https://tc39.es/ecma262/#sec-fulfillpromise") 一节中，对应引擎的实现即上面位置 `5` 处的函数 [fulfill\_or\_reject\_promise](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L69 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L69")：

    static void fulfill_or_reject_promise(JSContext *ctx, JSValueConst promise,
                                          JSValueConst value, BOOL is_reject) {
      // ...
      if (!s || s->promise_state != JS_PROMISE_PENDING)
        return; /* should never happen */
      set_value(ctx, &s->promise_result, JS_DupValue(ctx, value));       // 1
      s->promise_state = JS_PROMISE_FULFILLED + is_reject;
      // ...
      list_for_each_safe(el, el1, &s->promise_reactions[is_reject]) {    // 2
        rd = list_entry(el, JSPromiseReactionData, link);                // 3
        args[0] = rd->resolving_funcs[0];
        args[1] = rd->resolving_funcs[1];
        args[2] = rd->handler;
        args[3] = JS_NewBool(ctx, is_reject);
        args[4] = value;
        JS_EnqueueJob(ctx, promise_reaction_job, 5, args);
        list_del(&rd->link);
        promise_reaction_data_free(ctx->rt, rd);
      }
    
      list_for_each_safe(el, el1, &s->promise_reactions[1 - is_reject]) { // 4
        // ...
      }
    }
    

上面代码对应的解释为：

*   位置 `1` 处将 `resolution` 保存到 promisepromisepromise 对象内，并设置了 State
    
*   位置 `2` 处根据不同的 State 来处理对应的 Reactions 列表
    
*   位置 `3` 处的系列操作实现了标准中对如何处理 Reaction 的规定 [TriggerPromiseReactions](https://tc39.es/ecma262/#sec-triggerpromisereactions "https://tc39.es/ecma262/#sec-triggerpromisereactions")
    
*   位置 `4` 表示释放与当前 State 不匹配的另一个 Reactions 列表的内存
    

### PromiseReactionJob

通过上文的分析，可以发现对 Reaction 的执行并不是立即调用的，而是构造了一个 Promise reaction job 并压入任务队列。标准中关于 Jobs 和其任务队列的处理方式在 [Jobs and Host Operations to Enqueue Jobs](https://tc39.es/ecma262/#sec-jobs "https://tc39.es/ecma262/#sec-jobs") 一节中进行了描述。

这里我们先关注 Promise reaction job 的执行，通过查看函数 [promise\_reaction\_job](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L22 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L22") 的实现：

    static JSValue promise_reaction_job(JSContext *ctx, int argc,
                                        JSValueConst *argv) {
      // ...
      handler = argv[2];
      is_reject = JS_ToBool(ctx, argv[3]);
      arg = argv[4];
      // ...
      if (JS_IsUndefined(handler)) {                                      // 1
        if (is_reject) {
          res = JS_Throw(ctx, JS_DupValue(ctx, arg));
        } else {
          res = JS_DupValue(ctx, arg);
        }
      } else {
        res = JS_Call(ctx, handler, JS_UNDEFINED, 1, &arg);               // 2
      }
      is_reject = JS_IsException(res);
      if (is_reject)
        res = JS_GetException(ctx);
      func = argv[is_reject];                                             // 3
      /* as an extension, we support undefined as value to avoid
         creating a dummy promise in the 'await' implementation of async
         functions */
      if (!JS_IsUndefined(func)) {
        res2 = JS_Call(ctx, func, JS_UNDEFINED, 1, (JSValueConst *)&res); // 4
      } else {
        res2 = JS_UNDEFINED;
      }
      JS_FreeValue(ctx, res);
    
      return res2;
    }
    

上面代码对应的解释为：

*   位置 `1` 处用于处理未指定 `handler` 的情况，`handler` 即调用 `then` 时传入的回调函数
    
*   位置 `2` 处是，如果指定了 `handler` 那么就调用该回调函数，回调的结果 `res` 可能是立即数，也可能是另一个处于 _pending_ 的 Promise 对象
    
*   位置 `3` 处是根据当前的 promisepromisepromise 状态，选择 promise′promise'promise′ 的 `resolve` 或者 `reject` 方法 `func`
    
    前文已经提到 promise′promise'promise′ 为调用了 promisepromisepromise 的 `then` 方法后的返回值
    
*   位置 `4` 处即调用 promise′promise'promise′ 的 `resolve` 或者 `reject` 方法
    

根据上面的分析，我们可以得出下面的结论：

*   当 promisepromisepromise 状态变为 _settled_ 之后，其会调用 promise′promise'promise′ 的 `resolve` 或者 `reject` 方法，因此后者的 Fates 会变为 _resolved_，传入的参数为 promisepromisepromise 的 `handler` 执行结果 `res`
    
*   promise‘promise‘promise‘ 的 `resolve` 会根据 `res` 是否为立即数，而执行 FulfillPromise 或者 [NewPromiseResolveThenableJob](https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob "https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob")
    

### NewPromiseResolveThenableJob

回看上文 `js_promise_resolve_function_call` 函数体的位置 `6` 处：

    // ...
        args[0] = s->promise;
        args[1] = resolution;
        args[2] = then;
        JS_EnqueueJob(ctx, js_promise_resolve_thenable_job, 3, args);  // 6
        JS_FreeValue(ctx, then);
    // ...
    

表示的是当 `resolve` 被调用时传入的是一个 `thenable` 时对应的操作，比如下面的代码：

    /* p1 */ new Promise((r) => r(/* p2 */ Promise.resolve(1))).then(/* p3 */);
    

函数 `js_promise_resolve_function_call` 实现了标准中的定义 [NewPromiseResolveThenableJob](https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob "https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob")，对应的操作为：

    static JSValue js_promise_resolve_thenable_job(JSContext *ctx, int argc,
                                                   JSValueConst *argv) {
      // ...
      promise = argv[0];
      thenable = argv[1];
      then = argv[2];
      if (js_create_resolving_functions(ctx, args, promise) < 0)   // 1
        return JS_EXCEPTION;
      res = JS_Call(ctx, then, thenable, 2, (JSValueConst *)args); // 2
      // ...
    }
    

上面的代码对应的解释为：

*   位置 `1` 处为当前 promisepromisepromise 创建了新的 `resolve` 和 `reject` 实例
    
*   位置 `2` 使用上一步创建的 `resolve` 和 `reject` 方法调用 `thenable`
    

比如上面的例子中有三个 Promise 对象：

*   调用 `new Promise` 创建的 `p1`
    
*   调用 `Promise.resolve` 创建的 `p2`
    
*   调用 `p1.then` 创建的 `p3`
    

`p1` 的 Reactions 列表中有关联 `p3` 的信息，经过了上面的位置 `2` 处的操作后，`p2` 的 Reactions 列表中就包含了关联到 `p1` 的信息，因此 Promise chain 变为：

    p2 -> p1 -> p3
    

大家可能会有疑问，在调用 `p1` 的 `resolve` 方法时已经标记了 Fate 为 _resolved_：

    static JSValue js_promise_resolve_function_call(JSContext *ctx,
                                                    JSValueConst func_obj,
                                                    JSValueConst this_val, int argc,
                                                    JSValueConst *argv, int flags) {
    // ...
      s->presolved->already_resolved = TRUE;
    // ...
    }
    

为什么当 `resolution` 为 `p2` 的时候仍然可以将 `p1` 的 `resolve|reject` 方法继续添加到 `p2` 的 Reactions 列表中呢？

原因就在于 `js_promise_resolve_thenable_job` 中的 `js_create_resolving_functions` 调用创建了两个新的 `resolve|reject` 函数对象（与 Executor 中传递给 Callee 的不同），且 _resolved_ 标记是和函数对象关联的，也就是说同一个 `resolve` 函数对象只能被异步操作的 Callee 调用一次，与标准中描述一致：

> A promise is resolved if trying to resolve or reject it has no effect, i.e. the promise has been "locked in" to either follow another promise, or has been fulfilled or rejected

而引擎内再创建一对 `resolve|reject` 方法只要不使得执行结果和标准相悖就没有问题

### Promise.resolve

上面我们讨论的是 `Promise.prototype` 中的方法在引擎内部的实现方式，接下来我们看一看类静态方法 `Promise.resolve` 的内部处理方式。

`Promise.resolve` 对应的函数为 [js\_promise\_resolve](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L410 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L410")：

    JSValue js_promise_resolve(JSContext *ctx, JSValueConst this_val, int argc,
                               JSValueConst *argv, int magic) {
      JSValue result_promise, resolving_funcs[2], ret;
      BOOL is_reject = magic;                                      // 1
    
      if (!JS_IsObject(this_val))
        return JS_ThrowTypeErrorNotAnObject(ctx);
      if (!is_reject && JS_GetOpaque(argv[0], JS_CLASS_PROMISE)) { // 2
        JSValue ctor;
        BOOL is_same;
        ctor = JS_GetProperty(ctx, argv[0], JS_ATOM_constructor);
        if (JS_IsException(ctor))
          return ctor;
        is_same = js_same_value(ctx, ctor, this_val);              // 3
        JS_FreeValue(ctx, ctor);
        if (is_same)
          return JS_DupValue(ctx, argv[0]);                        // 4
      }
      result_promise = js_new_promise_capability(ctx, resolving_funcs, this_val); // 5
      if (JS_IsException(result_promise))
        return result_promise;
      ret = JS_Call(ctx, resolving_funcs[is_reject], JS_UNDEFINED, 1, argv);      // 6
      JS_FreeValue(ctx, resolving_funcs[0]);
      JS_FreeValue(ctx, resolving_funcs[1]);
      if (JS_IsException(ret)) {
        JS_FreeValue(ctx, result_promise);
        return ret;
      }
      JS_FreeValue(ctx, ret);
      return result_promise;
    }
    

上面代码对应的解释为：

*   `Promise.reject` 也是绑定的该函数，位置 `1` 表示根据绑定时设定的 `magic` 来区别两者的调用
    
*   位置 `2` 处表示，如果是 `resolve` 调用、且参数为 Promise 对象（位置 `3` 处），那么直接使用该对象作为返回值（位置 `4` 处）
    
*   否则的话创建一个新的 Promise 对象 `result_promise` 作为返回值，并通过调用 `result_promise` 的 `resolve` 或者 `reject` 方法、并传递当前的参数来构造 Promise chain
    

比如下面的代码：

    Promise.resolve(1).then((d) => console.log(d));
    console.log(2);
    

*   `Promise.resolve(1)` 返回了一个新的 Promise 对象 promisepromisepromise，并立即调用了 promisepromisepromise 内置的 `resolve` 方法
    
*   接着调用了 promisepromisepromise 的 `then` 方法注册了回调 `handler`，虽然此时 promisepromisepromise 的 State 已经为 _fulfilled_，但是 `handler` 不会立即执行，因为在 [Then](./9.3%20Then.md "./9.3%20Then.md") 一节中已经提到：
    
    > promisepromisepromise 状态已经为 _settled_，那么会使用 PromiseReaction 信息构造 PromiseReactionJob 并加入到任务队列中
    
*   接着执行 `console.log(2)` 在控制台打印了 `2`
    
*   本轮的 JS 执行结束，开始执行任务队列中的回调，于是 `handler` 得以执行，在控制台打印了 `1`
    

### Promise 回顾

我们可以将 Promise 的内部工作方式整理成下图：

![promise-resolve](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40da2e6ff90141f8b96eabf132cbc668~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2998&h=2444&e=png&b=ffffff)

上面中的内容可以分开来看：

*   首先 Promise 是为了解决「异步操作」中 Caller 和 Callee 如何协同的问题
    
*   图中的数值 `1` 对应的颜色的路线表示，Caller 通过实例化一个 Promise 对象 promisepromisepromise 作为和 Callee 协作的纽带，并在构造函数的 Executor 中执行了 Callee，同时向 Callee 传递了 promise.resolvepromise.resolvepromise.resolve
    
*   图中的数值 `3` 对应的颜色的路线表示，站在 Callee 的角度，它需要做的就是在操作完成后，调用 promise.resolvepromise.resolvepromise.resolve 并传递操作结果 resolutionresolutionresolution，剩下的工作交给引擎
    
*   图中的数值 `2` 对应的颜色的路线表示，站在 Caller 的角度，如果需要订阅异步操作的结果，还需要调用 promise.thenpromise.thenpromise.then 方法注册回调函数 handlerhandlerhandler
    
*   promise.thenpromise.thenpromise.then 调用形式可以表示为：
    
    then(promise,onFulfilled,\[onRejected\])→promise′then(promise, onFulfilled,\[onRejected\]) \\rightarrow promise'then(promise,onFulfilled,\[onRejected\])→promise′
    
    产生 promise′promise'promise′ 是因为要实现链式调用，引擎在执行这个操作时，会产生一条 ReactionReactionReaction 记录：
    
    Reaction\={handleronFulfilledresolvepromise′rejectpromise′Reaction = \\begin{cases} handler\_{onFulfilled} \\\\ resolve\_{promise'}\\\\ reject\_{promise'} \\end{cases}Reaction\=⎩⎨⎧​handleronFulfilled​resolvepromise′​rejectpromise′​​
    
*   如果 promisepromisepromise 的状态已经为 _settled_，那么会直接处理该 ReactionReactionReaction，否则会将 ReactionReactionReaction 先加入到内部的 Reactions 列表中，等到状态变为 _settled_ 时再处理
    
*   不管是直接处理的 ReactionReactionReaction，还是加入到 Reactions 列表中后续处理的 ReactionReactionReaction，它们都不是立即处理，而是构造一个 PromiseReactionJobPromiseReactionJobPromiseReactionJob 加入到任务队列中排队处理
    
*   Callee 调用 promise.resolvepromise.resolvepromise.resolve 时会传入其执行结果 resolutionresolutionresolution，引擎要做的工作为：
    
    *   如果 resolutionresolutionresolution 不为 `thenable`，那么会设置 promisepromisepromise 的状态，执行状态对应的 Reaction 列表中的记录 - 构造 PromiseReactionJobPromiseReactionJobPromiseReactionJob 压入任务队列
        
    *   如果 resolutionresolutionresolution 为 `thenable` 那么会再创建一个 PromiseResolveThenableJobPromiseResolveThenableJobPromiseResolveThenableJob 压入任务队列。PromiseResolveThenableJobPromiseResolveThenableJobPromiseResolveThenableJob 的执行则可以理解为等到该 `thenable` 处理完毕时再执行 promise.resolvepromise.resolvepromise.resolve
        
*   PromiseReactionJobPromiseReactionJobPromiseReactionJob 的执行方式是：
    
    *   调用 handlerhandlerhandler 并传入 resolutionresolutionresolution，产生结果 resolution′resolution'resolution′
        
    *   调用 handlerhandlerhandler 的过程中如果产生异常，则调用 rejectpromise′reject\_{promise'}rejectpromise′​
        
    *   否则调用 resolvepromise′resolve\_{promise'}resolvepromise′​ 并传入 resolution′resolution'resolution′
        

Async function
--------------

最初 JS 中处理异步操作都是通过回调函数，比如：

    import { unlink } from "node:fs";
    
    unlink("/tmp/hello", (err) => {
      if (err) throw err;
      console.log("successfully deleted /tmp/hello");
    });
    

通过回调函数的形式有 2 个明显的问题：

*   回调函数中需要同时编写正常和异常的处理逻辑
    
*   执行一组关联的异步操作会形成 [callback hell](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing#callbacks "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing#callbacks")
    

Promise 的出现很大程度上缓解了上面的问题：

*   首先通过 `then(onFulfilled, onRejected)` 中将正常和异常处理逻辑区分开
    
*   通过 Promise chains 取代了嵌套的回调函数
    

Promise 的另一个主要作用就是规范和抽象和异步操作中 Caller 和 Callee 的协同方式（回调函数是基于约定的松散的形式）。

在 Promise 的基础上，语言标准中定义了 Async function，以一种保持同步编程体验的形式，进一步简化 Promise 的操作。

我们可以将 [Async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function") 的作用简单地概括为：通过 `async` 和 `await` 关键字，提供了一种更加便捷的操作 Promise chains 的方式。

我们还需要了解 Async function 的这几个信息，以便我们分析引擎内部的实现：

*   Async function 总是会返回一个 Promise 对象，如果异步函数定义中没有显式地返回一个 Promise 的话，会有一个起到结果包装作用的 Promise 对象被隐式地构造并返回
    
*   `await` 表达式「看起来」就像是一个同步调用，它之后的代码只会在表达式触发的异步操作完成后才执行，但这个行为又不会阻塞引擎整体的执行
    

`async/await` 所表现的出的引擎执行行为类似将 [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators") 和 promises 结合到了一起，我们看看引擎内部实际的执行方式如何。

### 创建

异步函数的创建分 2 步：

*   首先是静态阶段，通过 `async` 关键字区别一般函数，将 `JSFunctionBytecode::func_kind` 设置为了 `JS_FUNC_ASYNC`
    
    这点与 Generator 类似，因为 `function*` 的标识作用，其 `func_kind` 被置为 `JS_FUNC_ASYNC_GENERATOR`
    
*   到了运行阶段，通过指令 `js_closure` 配合 `func_kind`，创建原型为内置类 `JS_CLASS_ASYNC_FUNCTION` 的函数对象
    

前面的章节中也提到过，每个 JS 函数调用都在引擎内部都对应一个 `JS_CallInternal` 调用，异步函数也不例外。

`JS_CallInternal` 会先尝试调用对象的自定义 `[[Call]]` 方法，而内置类 `JS_CLASS_ASYNC_FUNCTION` 的自定义 `[[Call]]` 方法为：

    void JS_AddIntrinsicPromise(JSContext *ctx)
    {
      // ...
      rt->class_array[JS_CLASS_ASYNC_FUNCTION].call = = js_async_function_call;
      // ...
    }
    

因此调用异步函数对象，在引擎内部会调用函数 `js_async_function_call`。

### 调用

函数 `js_async_function_call` 的实现为：

    JSValue js_async_function_call(JSContext *ctx, JSValueConst func_obj,
                                   JSValueConst this_obj, int argc,
                                   JSValueConst *argv, int flags) {
      JSValue promise;
      JSAsyncFunctionData *s;                                     // 1
    
      s = js_mallocz(ctx, sizeof(*s));
      if (!s)
        return JS_EXCEPTION;
      s->header.ref_count = 1;
      add_gc_object(ctx->rt, &s->header, JS_GC_OBJ_TYPE_ASYNC_FUNCTION);
      s->is_active = FALSE;
      s->resolving_funcs[0] = JS_UNDEFINED;
      s->resolving_funcs[1] = JS_UNDEFINED;
    
      promise = JS_NewPromiseCapability(ctx, s->resolving_funcs); // 2
      if (JS_IsException(promise))
        goto fail;
    
      // 3
      if (async_func_init(ctx, &s->func_state, func_obj, this_obj, argc, argv)) {
        // ...
      }
      s->is_active = TRUE;
    
      js_async_function_resume(ctx, s);                           // 4
    
      js_async_function_free(ctx->rt, s);
    
      return promise;                                             // 5
    }
    

上面的代码对应的解释为：

*   最容易理解的是位置 `5` 处的返回值，为一个 Promise 对象，和我们日常使用异步函数的认知相符合，为了方便我们称之为 promiseresultpromise\_{result}promiseresult​
    
*   位置 `1` 处的结构体为 `JSAsyncFunctionData`，看名字是记录了异步函数的一些上下文信息
    
*   位置 `2` 处创建了用于返回的 Promise 对象，并且将其 `resolve|reject` 方法存到了异步函数上下文中
    
*   位置 `3` 处看看函数名 `async_func_init` 是进行了一些初始化操作
    
*   位置 `4` 处看名字是恢复执行，应该和异步函数的执行相关
    

### 初始化

在 Generator 初始化中也 [使用了](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/gen.c#L144 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/gen.c#L144") 函数 [async\_func\_init](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L908 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L908")：

    __exception int async_func_init(JSContext *ctx, JSAsyncFunctionState *s,
                                    JSValueConst func_obj, JSValueConst this_obj,
                                    int argc, JSValueConst *argv) {
      JSObject *p;
      JSFunctionBytecode *b;
      JSStackFrame *sf;
      int local_count, i, arg_buf_len, n;
    
      sf = &s->frame;                        // 1
      init_list_head(&sf->var_ref_list);
      p = JS_VALUE_GET_OBJ(func_obj);
      b = p->u.func.function_bytecode;       // 2
      sf->js_mode = b->js_mode;
      sf->cur_pc = b->byte_code_buf;
      // ...
      return 0;
    }
    

简单地说 `async_func_init` 就是将调用栈帧分配到了堆上：

*   `JSAsyncFunctionState::frame` 为对应的异步函数的调用栈帧
    
*   初始化调用栈帧所需的信息记录在函数对象的 `function_bytecode` 字段中，比如形参数，局部变量数等
    

完成了上面的初始化工作后，我们看下 `JSAsyncFunctionData` 包含的内容：

    typedef struct JSAsyncFunctionData {
      JSGCObjectHeader header; /* must come first */
      JSValue resolving_funcs[2];
      BOOL is_active; /* true if the async function state is valid */
      JSAsyncFunctionState func_state;
    } JSAsyncFunctionData;
    

*   `header` 表示其也是通过 GC 进行内存管理的
    
*   `resolving_funcs` 是 promiseresultpromise\_{result}promiseresult​ 对象的 `resolve|reject` 方法
    
*   `is_active` 表示异步函数的状态是活跃的
    
*   `func_state` 在 [JSGeneratorData](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/intrins.h#L353 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/intrins.h#L353") 也使用到了，表示异步函数执行状态
    

### 初始执行

异步函数和 Generator 类似，在没有执行到内部的表示「结束执行」的指令时，是可以重复多次执行的，为了区别，我们将初始化完成后的执行，称为「初始执行」。

我们看看函数 [js\_async\_function\_resume](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L1054 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L1054") 的实现：

    void js_async_function_resume(JSContext *ctx, JSAsyncFunctionData *s) {
      JSValue func_ret, ret2;
    
      func_ret = async_func_resume(ctx, &s->func_state);            // 1
      if (JS_IsException(func_ret)) {
        JSValue error;
      fail:
        error = JS_GetException(ctx);
        ret2 = JS_Call(ctx, s->resolving_funcs[1], JS_UNDEFINED, 1, // 2
                       (JSValueConst *)&error);
        // ...
        js_async_function_terminate(ctx->rt, s);
        JS_FreeValue(ctx, ret2); /* XXX: what to do if exception ? */
      } else {
        JSValue value;
        value = s->func_state.frame.cur_sp[-1];
        s->func_state.frame.cur_sp[-1] = JS_UNDEFINED;              // 3
        if (JS_IsUndefined(func_ret)) {                             
          /* function returned */
          ret2 = JS_Call(ctx, s->resolving_funcs[0], JS_UNDEFINED, 1,
                         (JSValueConst *)&value);
          // ...
          js_async_function_terminate(ctx->rt, s);
        } else {
          JSValue promise, resolving_funcs[2], resolving_funcs1[2];
          int i, res;
    
          /* await */
          JS_FreeValue(ctx, func_ret); /* not used */
          promise = js_promise_resolve(ctx, ctx->promise_ctor, 1,   // 4
                                       (JSValueConst *)&value, 0);
          JS_FreeValue(ctx, value);
          if (JS_IsException(promise))
            goto fail;
          if (js_async_function_resolve_create(ctx, s, resolving_funcs)) {
            JS_FreeValue(ctx, promise);
            goto fail;
          }
    
          /* Note: no need to create 'thrownawayCapability' as in
             the spec */
          for (i = 0; i < 2; i++)
            resolving_funcs1[i] = JS_UNDEFINED;
          res = perform_promise_then(ctx, promise, (JSValueConst *)resolving_funcs,
                                     (JSValueConst *)resolving_funcs1); // 5
          // ...
        }
      }
    }
    

*   位置 `1` 处是开始（恢复）指令序列的执行，会执行到下一个 `await` 表达式或者 `return` 语句处返回，记录调用的返回值为 `func_ret`
    
*   如果执行发生异常，那么就在位置 `2` 处调用 promiseresultpromise\_{result}promiseresult​ 对象的 `reject` 方法
    
*   如果返回值为 `undefined`，则表示异步函数调用结束，使用栈顶的元素作为参数调用 promiseresultpromise\_{result}promiseresult​ 对象的 `resolve` 方法
    
*   否则操作数栈顶元素表示 `await` 表达式的操作数，先通过位置 `4` 处的代码先将该结果包装成一个 Promise 对象，再通过位置 `5` 处将其和当前的异步函数 promiseresultpromise\_{result}promiseresult​ 对象进行连接
    

`async_func_resume` 函数在 Generator 中也使用过：

    JSValue async_func_resume(JSContext *ctx, JSAsyncFunctionState *s) {
      JSValue func_obj;
    
      if (js_check_stack_overflow(ctx->rt, 0))
        return JS_ThrowStackOverflow(ctx);
    
      /* the tag does not matter provided it is not an object */
      func_obj = JS_MKPTR(JS_TAG_INT, s);
      return JS_CallInternal(ctx, func_obj, s->this_val, JS_UNDEFINED, s->argc,
                             s->frame.arg_buf, JS_CALL_FLAG_GENERATOR);
    }
    

标记 `JS_CALL_FLAG_GENERATOR` 使得 `JS_CallInternal` 函数在执行的时候从堆上恢复调用栈帧

### OP\_await 和 OP\_return\_async

`await` 表达式使用的指令为 `OP_await`，异步函数内的 `return` 语句对应的指令为 `OP_return_async`，它们对应的操作为：

    // ...
    CASE(OP_await):
          ret_val = JS_NewInt32(ctx, FUNC_RET_AWAIT);
          goto done_generator;
    // ...
    CASE(OP_return_async):
    CASE(OP_initial_yield):
      ret_val = JS_UNDEFINED;
      goto done_generator;
    

可以看到：

*   `OP_await` 会让 `js_async_function_resume` 函数中 `async_func_resume` 的调用结果为数值类型
    
*   `OP_return_async` 会让 `js_async_function_resume` 函数中 `async_func_resume` 的调用结果为 `undefined`
    

比如下面的代码：

    async function f() {
      await 3; // 1
      await fetch(); // 2
    }
    

会在执行完 `await` 语句后进入暂停状态，两次暂停时操作数栈顶的元素类型是不同的，位置 `1` 处是数值类型，位置 `2` 处则为表示 `fetch` 执行的 promise 对象。但经过 `js_async_function_resume` 中位置 `4` 处的包装后，都会成为一个 Promise 对象，我们可以称之为 promiseawaitpromise\_{await}promiseawait​

### 后续执行

引擎接下来要做的事情就是将表示当前异步函数执行的 promisepromisepromise 对象（同时也是该异步函数调用后的返回值），和其每次恢复执行时产生的 promiseawaitpromise\_{await}promiseawait​ 进行连接，也就是说在 promiseawaitpromise\_{await}promiseawait​ 完成后继续 promisepromisepromise 所表示的一部函数的执行。

我们通过下面的代码来理解上面的工作：

    async function f() {
      await fetch();
    }
    
    f();
    

*   `f()` 调用后的返回值为 promisepromisepromise，
    
*   因为 `await` 的存在，`f` 实际是进入了暂停状态。`fetch` 调用后产生的即 promiseawaitpromise\_{await}promiseawait​
    
*   引擎需要再 promiseawaitpromise\_{await}promiseawait​ 完成后，能够继续执行 `f`
    

能够完成上面工作的关键就在 `js_async_function_call` 中调用的函数 `js_async_function_resolve_create`：

    int js_async_function_resolve_create(JSContext *ctx, JSAsyncFunctionData *s,
                                         JSValue *resolving_funcs) {
      int i;
      JSObject *p;
    
      for (i = 0; i < 2; i++) {
        resolving_funcs[i] = JS_NewObjectProtoClass(
            ctx, ctx->function_proto, JS_CLASS_ASYNC_FUNCTION_RESOLVE + i); // 1
        if (JS_IsException(resolving_funcs[i])) {
          if (i == 1)
            JS_FreeValue(ctx, resolving_funcs[0]);
          return -1;
        }
        p = JS_VALUE_GET_OBJ(resolving_funcs[i]);
        s->header.ref_count++;
        p->u.async_function_data = s; // 2
      }
      return 0;
    }
    

上面的代码包含的信息为：

*   位置 `1` 处创建了两个函数对象，分别使用内置类 `JS_CLASS_ASYNC_FUNCTION_RESOLVE` 和 `JS_CLASS_ASYNC_FUNCTION_REJECT`
    
*   位置 `2` 处，函数对象通过字段 `async_function_data` 记录了关联的异步函数信息 `s`
    

在函数 [JS\_AddIntrinsicPromise](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L956 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/promise.c#L956") 中可以看出 `JS_CLASS_ASYNC_FUNCTION_RESOLVE` 和 `JS_CLASS_ASYNC_FUNCTION_REJECT` 都被绑定到了函数 `js_async_function_resolve_call`：

    JSValue js_async_function_resolve_call(JSContext *ctx, JSValueConst func_obj,
                                           JSValueConst this_obj, int argc,
                                           JSValueConst *argv, int flags) {
      JSObject *p = JS_VALUE_GET_OBJ(func_obj);
      JSAsyncFunctionData *s = p->u.async_function_data;
      BOOL is_reject = p->class_id - JS_CLASS_ASYNC_FUNCTION_RESOLVE;
      JSValueConst arg;
    
      if (argc > 0)
        arg = argv[0];
      else
        arg = JS_UNDEFINED;
      s->func_state.throw_flag = is_reject;
      if (is_reject) {
        JS_Throw(ctx, JS_DupValue(ctx, arg));                   // 1
      } else {
        /* return value of await */
        s->func_state.frame.cur_sp[-1] = JS_DupValue(ctx, arg); // 2
      }
      js_async_function_resume(ctx, s);
      return JS_UNDEFINED;
    }
    

如果 promiseawaitpromise\_{await}promiseawait​ 对应的异步操作执行发生了异常，那么会执行上面位置 `1` 处的逻辑，否则执行位置 `2` 处的逻辑

位置 `2` 处表示将 promiseawaitpromise\_{await}promiseawait​ 的 `resolution` 压入操作数栈顶，这样当前异步函数 `js_async_function_resume` 在恢复执行时，栈顶元素即为指令 `OP_await` 的操作结果

### 异常处理

异步函数中异常的产生有 2 中情况：

*   同步代码产生的异常
    
*   嵌套异步调用产生的异常
    

如果异步函数内的同步代码对应的指令序列执行产生了异常（比如直接执行了 `throw` 语句），那么异常对象会成为 `async_func_resume` 调用的返回值（即当次 resume 就返回异常）：

    void js_async_function_resume(JSContext *ctx, JSAsyncFunctionData *s) {
        JSValue func_ret, ret2;
    
      func_ret = async_func_resume(ctx, &s->func_state);
      if (JS_IsException(func_ret)) {
        JSValue error;
      fail:
        error = JS_GetException(ctx);
        ret2 = JS_Call(ctx, s->resolving_funcs[1], JS_UNDEFINED, 1,
                       (JSValueConst *)&error); // 1
        JS_FreeValue(ctx, error);
        js_async_function_terminate(ctx->rt, s);
        JS_FreeValue(ctx, ret2); /* XXX: what to do if exception ? */
      }
      // ...
    }
    

因为 `func_ret` 为异常对象，于是执行上面位置 `1` 处的内容，调用 promiseresultpromise\_{result}promiseresult​ 的 `reject` 方法传递异常对象。

如果是嵌套的异步调用产生的异常，则会通过 promiseawaitpromise\_{await}promiseawait​ 和 promiseresultpromise\_{result}promiseresult​ 连接而形成的 Promise chain 传递异常。

比如上面代码中 `fetch` 如果产生了异常，因为 `fetch` 对应的 promiseawaitpromise\_{await}promiseawait​ 已经和当前异步函数的 promiseresultpromise\_{result}promiseresult​ 进行了连接，所以 promiseawaitpromise\_{await}promiseawait​ 会调用 promiseresultpromise\_{result}promiseresult​ 的 `reject` 方法。

promiseresultpromise\_{result}promiseresult​ 的 `reject` 方法即上文的 `js_async_function_resolve_call` 函数，于是进入到其中位置 `1` 处的逻辑：

*   将异常对象记录到 `JSRuntime::current_exception` 上
    
*   通过设置标记 `throw_flag` 使得异步函数恢复执行后立即进入到 [异常处理段](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L2479 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L2479")
    

### 回顾

异步函数的执行可以小结为：

*   异步函数和 Generator 一样，都使用 `JSAsyncFunctionState` 来存放异步函数执行的状态，并通过调用函数 `async_func_init` 进行初始化
    
*   异步函数的首次执行会使用 `js_async_function_resume` 执行到第一个暂定点，并返回一个 promiseresultpromise\_{result}promiseresult​ 表示该异步函数的执行
    
*   异步函数内 `await` 表达式使当前异步函数进入暂定状态，并将 `await` 产生的 promiseawaitpromise\_{await}promiseawait​ 和 promiseresultpromise\_{result}promiseresult​ 进行连接
    
*   `await` 表达式的操作数为立即数或者另一个 promise′promise'promise′，都会被 `js_async_function_resume` 统一成 promiseawaitpromise\_{await}promiseawait​
    
*   promiseawaitpromise\_{await}promiseawait​ 和 promiseresultpromise\_{result}promiseresult​ 进行连接的方式是将后者的 `resolve` 和 `reject` 方法作为 `handler` 构成 promiseawaitpromise\_{await}promiseawait​ 的 Reaction 记录：
    
    *   如果 promiseawaitpromise\_{await}promiseawait​ 状态已经是 _settled_，那么构造 PromiseReactionJobPromiseReactionJobPromiseReactionJob 加入任务队列
        
    *   如果 promiseawaitpromise\_{await}promiseawait​ 还是 _pending_，那么加入其 Reactions 列表，等到其状态变为 _settled_ 再处理，处理方式也是弹出队列中的 Reaction 记录并构造 PromiseReactionJobPromiseReactionJobPromiseReactionJob 加入任务队列
        
*   负责执行异步函数中的指令序列的函数是 `async_func_resume`，与 Generator 相同，向 `JS_CallInternal` 传递的标记也是 `JS_CALL_FLAG_GENERATOR`
    
    *   使用利用 `JSAsyncFunctionState` 结构保存在堆上的信息恢复异步函数执行状态
        
    *   沿用和 Generator 实现时类似的方式来表示异步函数执行的多个中间状态：
        
        *   `async_func_resume` 返回异常对象，表示异步函数执行时，在当前恢复的同步执行执行过程中发生了异常
            
        *   `async_func_resume` 返回 `undefined`，表示异步函数执行结束
            
        *   否则操作数栈顶为 `await` 表达式的操作数
            

了解了异步函数在引擎内部的实现后，我们可以发现异步函数和 Generator 的异同。

相同点：

*   都可以暂停和恢复执行，通过将函数执行上下文保存在堆上来实现

不同点：

*   Generator 需要 Caller 和 Callee 手动地进行协同，Callee 通过 `yield` 主动暂停自身的执行，Caller 则需要不断调用 `next` 执行来推进 Callee
    
    看似很麻烦是因为大部分业务场景下，都希望 Callee 能自动地将内部的操作都完成再返回给 Caller。当然在一些业务场景下，这个特性也可能成为 Generator 相较于异步函数的优势
    
*   如果将 Generator 看作是命令式的协同方式，那么异步函数则可以看成是声明式的协同方式，Caller 和 Callee 通过 `await` 和 `async` 关键字来声明异步调用，引擎会自动的完成其中的衔接工作
    

小结
--

我们可以将本节的叙述内容概括为：

*   首先和大家一起回顾了异步操作的形式，为什么需要引入异步操作
    
*   然后向大家解释了语言规范中对异步操作的抽象化设计
    
*   接着结合引擎的源码和大家感受了引擎是如何对语言规范进行了实现：
    
    *   Promise 底层实现的主要环节
        
    *   Async function 语法糖是如何基于 Promise 进行工作的
        

在下一节中，我们将介绍 HostEnqueuePromiseJob 在引擎中的实现方式。