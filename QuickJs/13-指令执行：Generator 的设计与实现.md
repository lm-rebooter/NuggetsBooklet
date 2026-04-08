本节我们将一起了解 Generator 的底层实现，首先我们会回顾几个 Generator 的基本概念，然后对照这些概念涉及的功能点、探究它们的底层实现。

Iteration protocols
-------------------

[语言规范](https://tc39.es/ecma262/ "https://tc39.es/ecma262/") 好比造车的图纸，引擎实现则好比根据图纸造出的实车。因此在研究引擎内部的实现时，我们可以先查看图纸（语言规范）中的描述，然后再对照实车的实现。

语言规范中的描述内容很详细，不过阅读起来有时会让人抓不住重点，这时可以先参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript "https://developer.mozilla.org/en-US/docs/Web/JavaScript")，其中的内容对语言规范进行了通俗化地提炼。

MDN 中对 Generator 的描述是：

> The Generator object is returned by a generator function and it conforms to both the iterable protocol and the iterator protocol.

这段话包含这几点信息：

*   Generator 是一个对象
    
*   Generator 对象需通过 [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function* "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*") 来创建
    
*   Generator 对象实现了两个协议：[iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol") 和 [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol")
    

就上面的信息的进一步解释：

*   protocol 好比「接口 interface」，接口则是调用双方（调用发起方、被调用方）间的约定
    
*   iterable protocol 是 `for...of` 语句和其操作数之间的约定。比如希望能够被 `for...of` 语句迭代的对象，需要实现 iterable protocol
    
*   iterator protocol 是值序列（a sequence of values）的生产者和消费者之间的约定。生产者负责实现值序列的生成逻辑，消费者按协议中规定的方式和生产者进行交互以消费数据
    

我们可以结合下面的例子来体会一下：

    const gen = function* () {
      yield "a";
      yield "b";
      yield "c";
    };
    
    // iterable protocol
    const g1 = gen();
    for (const val of g1) {
      print(val);
    }
    
    // iterator protocol
    const g2 = gen();
    print(g2.next().value);
    print(g2.next().value);
    print(g2.next().value);
    

### iterable protocol

iterable protocol 中规定的规定为：

*   对象实现 `@@iterator` 方法
    
*   `@@iterator` 方法的返回值为一个实现了 iterator protocol 的对象
    

我们通过下面的例子体会一下：

    const gen = function* () {
      yield "a";
      yield "b";
      yield "c";
    };
    
    const obj = {
      // @@iterator 方法，对象有该方法即实现了 iterable protocol
      [Symbol.iterator]() {
        // 返回一个实现了 iterator protocol 的对象
        return gen();
      },
    };
    
    for (const val of obj) {
      print(val);
    }
    

上面代码的解释为：

*   直接在对象 `obj` 上通过添加 `Symbol.iterator` 实现了方法 `@@iterator`（当然也可以将该方法实现在对象的原型链上）
    
*   `obj` 的 `@@iterator` 方法返回了一个由生成器函数 `gen` 创建的一个 Generator。在开头已经提到 `Generator` 是实现 iterator protocol 的
    

通过上面的例子我们也可以理解 iterable protocol 与 iterator protocol 的关系：

*   通过 iterable protocol 来表示一个对象具有「可迭代」这一特质
    
*   对象「可迭代」换句话说，即对象需要能够产生一个值序列，而值序列的产生则由 iterator 负责，其行为通过 iterator protocol 规定
    

### iterator protocol

iterator protocol 中定义了 iterator 需要实现的 3 个方法：

*   `next` 必选
    
*   `return` 可选
    
*   `throw` 可选
    

这三个方法的返回值为 `IteratorResult` 接口定义的内容：

    interface IteratorResult {
      done?: boolean;
      value?: unknown;
    }
    

值序列的消费方通过调用上面的方法和 iterator 交互。

在看 iterator protocol 的例子之前，我们先看一个 `try...finally` 的例子：

    function f1() {
      try {
        return 1;
      } catch (e) {
      } finally {
        console.log("cleanup");
      }
    }
    
    function f2() {
      try {
        throw 1;
      } catch (e) {
      } finally {
        console.log("cleanup");
      }
    }
    
    f1(); // cleanup
    f2(); // cleanup
    

通过上面的例子可以发现，无论 `try` 子句中的逻辑是否被成功执行，`finally` 子句的内容都会被执行到。因此 `finally` 子句可以作为一个放置收尾逻辑的统一位置，比如释放占用的资源。

然后我们再看一下 Generator 的例子：

    function log(obj) {
      if (typeof obj === "string") return print(obj);
      print(JSON.stringify(obj));
    }
    
    const gen = function* () {
      // 1
      try {
        const valueFromCaller = yield "a"; // 2
        log({ valueFromCaller });
        yield "b";
        yield "c";
      } catch (e) {
        log(`Caught error: ${e.message}`);
      } finally {
        // 3
        log("cleanup");
      }
    };
    
    const g1 = gen();
    log(g1.next());
    log(g1.next("hi"));
    log(g1.throw(new Error("error from caller")));
    

对应的输出为：

    {"value":"a","done":false}
    {"valueFromCaller":"hi"}
    {"value":"b","done":false}
    Error: error from caller
    cleanup
    {"done":true}
    

为了理解上面的输出结果，我们需要了解下面的内容：

*   将 generator function 中的每个 `yield` 出现的位置看成是一个「暂停位置 suspended position」
    
*   generator function 创建的 Generator 如果尚未被调用，可认为其暂停于形参列表与函数体之间的一个暂停位置：`function () /* here */ {}`
    
*   每次调用 `next` 方法，可以看成是将 generator function 执行到下一个暂定位置
    
*   generator function 暂停后，可以通过 `next` 将其唤起继续执行，调用 `next` 时的传参则作为暂停位置的 `yield` 表达式的返回值
    
*   调用 `return` 方法可以看成是在 generator function 中的**暂停位置**执行 `return` 语句，调用 `return` 方法的参数，则作为 `return` 语句的操作数
    
*   调用 `throw` 方法可以看成是在 generator function 中的**暂停位置**执行 `throw` 语句，调用 `throw` 方法的参数，则作为 `throw` 语句的操作数
    

现在我们可以解释上面代码的内容和其输出结果：

*   调用方调用 `gen` 试图创建 `g1`，可以认为 `g1` 获得 CPU 控制权（下面简称控制权）
    
*   `g1` 被创建后，会在暂停在 `1` 的位置，并将控制权交出去
    
*   `g1` 的调用方重新获得控制权，调用 `g1.next` 可使其恢复运行并在下一个暂停位置再次进入暂停状态，也就是位置 `2`
    
    `yield` 表达式表示 Generator 主动释放控制权，其操作数为 Generator 向其 Caller 传递的信息
    
*   `g1` 的调用方重新获得控制权，可以继续调用 `g1.next` 恢复 `g1` 的执行，调用时传递的实参则作为 Caller 向 `g1` 传递的信息
    
    由于 `g1` 会在 `yield` 处恢复执行，所以 `g1` 的视角看来实参即为 `yield` 表达式的返回值
    
*   通过 `g1.return` 可以让 `g1` 在暂停位置恢复，若执行的是 `return` 语句，`return` 的操作数为 `g1.return` 被调用时传递的实参
    
*   通过 `g1.throw` 可以让 `g1` 在暂停位置恢复，若执行的是 `throw` 语句，`throw` 的操作数为 `g1.throw` 被调用时传递的实参
    
    如果暂停位置被 `try` 子句包裹，那么可以进入到对应的错误处理分支，如果存在对应的 `finally` 子句，那么其中的内容总是会被执行
    

可以通过下面的例子理解「被包裹」的含义：

    const g2 = gen();
    log(g2.throw(new Error("error from caller")));
    

执行项目的代码会发现 `finally` 子句的内容并未被执行，这是因为 `g2.throw` 执行时，`g2` 的暂停位置在形参列表与函数体之间的一个位置，未被 `try...finally` 包裹。

### 回顾

这一节作为深入了解 Generator 实现的预备小节，包含下面几点内容：

*   Generator、generator function 以及 Iteration protocols 三者之间的关系：
    
    *   Generator 需由 generator function 创建
        
    *   Generator 实现了 Iteration protocols
        
*   Iterable protocol 与 iterator protocol 两者之间的关系
    
    *   Iterable protocol 表示对象可迭代，在对象的 `Symbol.iterator` 方法中返回一个 iterator
        
    *   迭代所需的值序列由返回的 iterator 根据实现的 iterator protocol 来提供
        
*   Generator 和 Iterator protocol 的相关内容：
    
    *   `yield` 表示「暂停位置 suspended position」
        
    *   调用方通过 `next`、`return` 和 `throw` 可以与 Generator 交互：
        
        *   将 Generator 从暂定位置恢复，并传递参数作为 `yield` 表达式的返回值
            
        *   `return` 和 `throw` 的调用可以看是让 Generator 在恢复执行处执行 `return` 或 `throw` 语句
            
        *   调用得到的返回值符合 `IteratorResult` 接口的定义，返回值的装箱由引擎负责
            

Generator function
------------------

上文我们回顾了 Generator 需由 Generator function（下面简称 GF）创建，也就是使用 `function*` 定义的函数，并且 GF 与一般函数的区别在于：

*   一般的函数调用中，在 Caller 发起对 Callee 的调用后，Callee 就获得了 CPU 的控制权，只有 Callee 当执行完毕返回后，Caller 才能重获 CPU 的控制权
    
*   GF 则为 Caller 与 Callee 之间提供了协同机制，Callee 可以主动的释放对 CPU 的控制权，并保存释放前的执行状态，随后 Caller 可以继续调用 Callee，从之前保存的状态继续执行
    

因此我们也可以将 GF 看成是一个有状态且可暂停的函数，Caller 调用 GF 得到了一个实现了 iterator protocol 的对象，然后通过对象上的方法来变换 GF 内的执行状态。

我们来看看 GF 在引擎内的实现方式：

    function* f() {
      yield "a";
    }
    

对应的字节码为：

      opcodes:
        0  3F 3F 02 00 00 40          check_define_var f,64
        6  C0 00                      fclosure8 0: [bytecode f]
        8  40 3F 02 00 00 00          define_func f,0
    

可以发现 GF 的创建用到的指令序列与一般函数创建一致，都使用的是 `OP_fclosure` 指令，该指令对应的操作函数为：

    JSValue js_closure(JSContext *ctx, JSValue bfunc, JSVarRef **cur_var_refs,
                       JSStackFrame *sf) {
      // ...
      b = JS_VALUE_GET_PTR(bfunc);
      func_obj = JS_NewObjectClass(ctx, func_kind_to_class_id[b->func_kind]); // 1
      // ...
      func_obj = js_closure2(ctx, func_obj, b, cur_var_refs, sf);      // 2
      // ...
      if (b->func_kind & JS_FUNC_GENERATOR) {
        JSValue proto;
        int proto_class_id;
        /* generators have a prototype field which is used as
           prototype for the generator object */
        if (b->func_kind == JS_FUNC_ASYNC_GENERATOR)
          proto_class_id = JS_CLASS_ASYNC_GENERATOR;
        else
          proto_class_id = JS_CLASS_GENERATOR;                          // 3
        proto = JS_NewObjectProto(ctx, ctx->class_proto[proto_class_id]);
        if (JS_IsException(proto))
          goto fail;
        JS_DefinePropertyValue(ctx, func_obj, JS_ATOM_prototype, proto, // 4
                               JS_PROP_WRITABLE);
      }
      // ...
    }
    

*   位置 `1` 表示创建一个对象 `func_obj`，作为函数对象，该对象的 `__proto__` 属性为内置类 `JS_CLASS_GENERATOR_FUNCTION`(因为需要创建的即为 Generator function)
    
*   位置 `2` 表示使用 `b`（`JSFunctionBytecode`）中的信息对创建的函数对象做一些初始化操作。比如设置一些闭包相关的信息
    
*   位置 `3` 表示创建一个 `proto` 对象，该对象的 `__proto__` 属性为内置类 `JS_CLASS_GENERATOR`
    
*   位置 `4` 则表示将函数对象的 `prototype` 设置为上一步创建的 `proto`
    

可以用下面的代码演示上面的步骤所实现的语义：

    function typeName(obj) {
      return Object.prototype.toString.call(obj).split(" ")[1].slice(0, -1);
    }
    
    function* gen() {}
    console.assert(typeName(gen.__proto__) === "GeneratorFunction");
    console.assert(typeName(gen.prototype) === "Generator");
    

内置类 `JS_CLASS_GENERATOR_FUNCTION` 和 `JS_CLASS_GENERATOR` 的初始化是在函数 [JS\_AddIntrinsicBaseObjects](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/intrins.c#L178 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/intrins.c#L178") 中完成的：

    void JS_AddIntrinsicBaseObjects(JSContext *ctx) {
      // ...
    
      ctx->class_proto[JS_CLASS_GENERATOR] =
          JS_NewObjectProto(ctx, ctx->iterator_proto);
      JS_SetPropertyFunctionList(ctx, ctx->class_proto[JS_CLASS_GENERATOR],
                                 js_generator_proto_funcs,
                                 countof(js_generator_proto_funcs));
    
      ctx->class_proto[JS_CLASS_GENERATOR_FUNCTION] =
          JS_NewObjectProto(ctx, ctx->function_proto);
      obj1 = JS_NewCFunctionMagic(ctx, js_function_constructor, "GeneratorFunction",
                                  1, JS_CFUNC_constructor_or_func_magic,
                                  JS_FUNC_GENERATOR);
      JS_SetPropertyFunctionList(ctx, ctx->class_proto[JS_CLASS_GENERATOR_FUNCTION],
                                 js_generator_function_proto_funcs,
                                 countof(js_generator_function_proto_funcs));
      JS_SetConstructor2(ctx, ctx->class_proto[JS_CLASS_GENERATOR_FUNCTION], // 1
                         ctx->class_proto[JS_CLASS_GENERATOR], JS_PROP_CONFIGURABLE,
                         JS_PROP_CONFIGURABLE);
      JS_SetConstructor2(ctx, obj1, ctx->class_proto[JS_CLASS_GENERATOR_FUNCTION], // 2
                         0, JS_PROP_CONFIGURABLE);
      // ...
    }
    

*   位置 `1` 表示 Generator 是由 Generator function 创建的：
    
        function* gen() {}
        
        const g = gen();
        console.assert(g.constructor === gen.__proto__);
        
    
*   位置 `2` 表示 Generator function 是由引擎内部实现创建的：
    
        gen.__proto__.constructor.toString();
        // function GeneratorFunction() { [native code] }
        
    

我们可以将上面的内容小结为：

1.  `function*` 会使用引擎内部的实现创建一个 Generator function 对象
    
2.  GF 在引擎内部的创建与一般函数对象的创建差不多，但会加上一些额外的标识，比如 `class_id` 为 `JS_CLASS_GENERATOR_FUNCTION`
    
3.  GF 的 `prototype` 则为 `Generator`，因为使用 GF 创建的是 Generator 对象，后者需要使用前者的 `prototype` 作为其 `__proto__`
    
4.  GF 上包含了一些元信息，比如上面的 2 处 `JS_SetConstructor2` 设置的 `constructor` 表示对象是由「谁」创建的
    

### 创建 Generator

让我们继续看看 GF 是如何创建 Generator 的。

我们知道 JS 函数调用在引擎内对应的对应的操作函数为 [JS\_CallInternal](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L21 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L21")：

    JSValue JS_CallInternal(JSContext *caller_ctx, JSValueConst func_obj,
                     JSValueConst this_obj, JSValueConst new_target,
                     int argc, JSValue *argv, int flags)
    {
      // ...
      if (unlikely(JS_VALUE_GET_TAG(func_obj) != JS_TAG_OBJECT)) { // 1
        // ...
      }
      // ...
      p = JS_VALUE_GET_OBJ(func_obj);
      if (unlikely(p->class_id != JS_CLASS_BYTECODE_FUNCTION)) {   // 2
        JSClassCall *call_func;
        call_func = rt->class_array[p->class_id].call;             // 3
        if (!call_func) {
        not_a_function:
          return JS_ThrowTypeError(caller_ctx, "not a function");
        }
        return call_func(caller_ctx, func_obj, this_obj, argc,
                 (JSValueConst *)argv, flags);
      }
      // ...
    }
    

上面代码的解释为：

*   参数 `func_obj` 在当前语境下即 GF
    
*   因为 GF 的 `tag` 为 `JS_TAG_OBJECT`，所以不会进入位置 `1` 处的分支
    
*   加上 GF 的 `class_id` 为 `JS_CLASS_GENERATOR_FUNCTION`，所以会进入位置 `2` 处的分支
    
*   位置 `3` 处实现了语言规范中 [\[\[Call\]\]](https://tc39.es/ecma262/#sec-ecmascript-function-objects-call-thisargument-argumentslist "https://tc39.es/ecma262/#sec-ecmascript-function-objects-call-thisargument-argumentslist") 的逻辑，即调用对象上自定义的 `[[Call]]` 方法
    

GF 是有自定义 `[[Call]]` 方法的，注册方式为：

    JSRuntime *JS_NewRuntime2(const JSMallocFunctions *mf, void *opaque)
    {
      // ...
      rt->class_array[JS_CLASS_GENERATOR_FUNCTION].call = js_generator_function_call;
      // ...
    }
    

继续查看函数 [js\_generator\_function\_call](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/gen.c#L134 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/gen.c#L134") 的实现细节：

    JSValue js_generator_function_call(JSContext *ctx, JSValueConst func_obj,
                                       JSValueConst this_obj, int argc,
                                       JSValueConst *argv, int flags) {
      JSValue obj, func_ret;
      JSGeneratorData *s;
    
      s = js_mallocz(ctx, sizeof(*s));                              // 1
      if (!s)
        return JS_EXCEPTION;
      s->state = JS_GENERATOR_STATE_SUSPENDED_START;
      if (async_func_init(ctx, &s->func_state, func_obj, this_obj, argc, argv)) { // 2
        s->state = JS_GENERATOR_STATE_COMPLETED;
        goto fail;
      }
    
      /* execute the function up to 'OP_initial_yield' */
      func_ret = async_func_resume(ctx, &s->func_state);            // 3
      if (JS_IsException(func_ret))
        goto fail;
      JS_FreeValue(ctx, func_ret);
    
      obj = js_create_from_ctor(ctx, func_obj, JS_CLASS_GENERATOR); // 4
      if (JS_IsException(obj))
        goto fail;
      JS_SetOpaque(obj, s);                                         // 5
      return obj;
    fail:
      free_generator_stack_rt(ctx->rt, s);
      js_free(ctx, s);
      return JS_EXCEPTION;
    }
    

*   首先是 `1` 的位置申请了一块堆内存，内存布局采用了 `JSGeneratorData`：
    
        typedef struct JSGeneratorData {
          JSGeneratorStateEnum state; // generator 当前的状态枚举值
          JSAsyncFunctionState func_state; // generator function 的执行状态
        } JSGeneratorData;
        
    
*   由于 GF 的执行支持暂停和恢复，所以不能像一般的 JS 函数调用那样继续利用 C 语言的调用栈，而是需要将调用信息放置在堆上。位置 `2` 处即初始化 `func_state` 用于记录 JS 函数的调用信息
    
*   位置 `3` 目的是执行一次 GF 以初始化调用信息。相关的细节在函数 [async\_func\_resume](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L983 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L983") 内：
    
        JSValue async_func_resume(JSContext *ctx, JSAsyncFunctionState *s) {
          JSValue func_obj;
          // ...
          /* the tag does not matter provided it is not an object */
          func_obj = JS_MKPTR(JS_TAG_INT, s);
          return JS_CallInternal(ctx, func_obj, s->this_val, JS_UNDEFINED, s->argc,
                                s->frame.arg_buf, JS_CALL_FLAG_GENERATOR);
        }
        
    
    在调用 `JS_CallInternal` 之前将 `func_state` 的 `tag` 设置为 `JS_TAG_INT`，以此来触发后者中执行 generator 的逻辑：
    
        JSValue JS_CallInternal(JSContext *caller_ctx, JSValueConst func_obj,
                        JSValueConst this_obj, JSValueConst new_target,
                        int argc, JSValue *argv, int flags)
        {
          // ...
          if (unlikely(JS_VALUE_GET_TAG(func_obj) != JS_TAG_OBJECT)) {
            if (flags & JS_CALL_FLAG_GENERATOR) {
              // ...
              // 使用 `func_state` 上记录的状态，跳转到异常处理段
              if (s->throw_flag)
                goto exception;
              else
                // 跳转到指令执行部分
                goto restart;
            } else {
              goto not_a_function;
            }
          }
        }
        
    
*   位置 `4` 创建的对象即调用 GF 返回的 Generator，记为 GGG
    
*   位置 `5` 则将保存了 GF 执行状态的 `JSGeneratorData` 挂在了 GGG 的字段 `JSObject::u::opaque` 上，后续通过 GGG 的原型方法操作 GF 执行时就可以方便地获取其执行状态
    

### 回顾

这一小节的内容可以梳理为：

*   从引擎层面来看 GF 的创建与一般函数的创建、主要差别在于前者将状态信息保存在了堆上
    
*   GF 的执行分 2 步：
    
    1.  首次执行会进行自身的初始化，比如申请堆内存保证执行状态，处理参数列表等
        
    2.  后续才是执行函数体对应的指令序列
        
*   GF 和 Generator 之间的关系可以简单理解成：
    
    *   引擎提供了一种能够暂停和恢复的异步函数，GF 则是该功能的可编程接口，方便开发者编写这样的函数
        
    *   Generator 可以看成是 GF 的实例，它保存了后者的执行状态 SSS，并包含了一些方法可以操作 SSS
        

Generator 内部状态
--------------

Generator 内部的执行状态保存在字段 `JSGeneratorData::state` 之上，取值为：

    typedef enum JSGeneratorStateEnum {
      JS_GENERATOR_STATE_SUSPENDED_START,
      JS_GENERATOR_STATE_SUSPENDED_YIELD,
      JS_GENERATOR_STATE_SUSPENDED_YIELD_STAR,
      JS_GENERATOR_STATE_EXECUTING,
      JS_GENERATOR_STATE_COMPLETED,
    } JSGeneratorStateEnum;
    

下面我看看这些状态之间是如何变化的。

### OP\_initial\_yield

我们来看分析下面的代码：

    function* gen(a = 1) {
      yield a;
    }
    

对应的字节码序列为：

    ;; function* gen(a = 1) {
    
            set_loc_uninitialized 0: a
            get_arg0 0: a
            dup
            is_undefined
            if_false8 11
            drop
            push_1 1
            set_arg0 0: a
       11:  put_loc0 0: a
            initial_yield
    
    ;;   yield a;
    
            get_arg0 0: a
            yield
            if_false8 18
            return_async
       18:  drop
            undefined
            return_async
    
    ;; }
    

GF 的执行在引擎层面就是执行上面的指令序列，并且我们知道：

*   在 GF 首次运行时的 `js_generator_function_call` 调用中，会执行一次 `async_func_resume` 调用
    
*   `async_func_resume` 内部会调用 `JS_CallInternal` 执行 GF
    

首次执行 GF 时会在 [OP\_initial\_yield](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L2422 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L2422") 处暂停：

    // ...
      SWITCH(pc) {
      // ...
      CASE(OP_initial_yield):
        ret_val = JS_UNDEFINED;
        goto done_generator;                    // 1
      // ...
      }
    // ...
      if (b->func_kind != JS_FUNC_NORMAL) {
      done_generator:                           // 2
        sf->cur_pc = pc;
        sf->cur_sp = sp;
      } else {
      // ...
      }
      rt->current_stack_frame = sf->prev_frame; // 2
      return ret_val;
    

可以看到 `OP_initial_yield` 指令的操作步骤为：

*   位置 `1` 处会跳转到位置 `2`
    
*   位置 `2` 处将 `pc` 和 `sp` 进行保存
    
*   位置 `3` 处将当前 GF 的调用栈帧从调用栈中弹出
    

于是就达到这样的效果：

*   GF 的执行状态得以保存
    
*   控制权返回到了 GF 的调用处
    

通过观察 `OP_initial_yield` 在指令序列中所处的位置，也可以发现：

*   其位于参数初始化指令序列与函数体指令序列之间

选择这个位置也很好理解，因为参数列表的初始化是依赖当前调用栈的，所以其初始化的过程是需要和 Caller 同属一个同步调用的。

在分析了 `OP_initial_yield` 后，我们可以更容易的理解之前的一个例子：

    function log(obj) {
      if (typeof obj === "string") return console.log(obj);
      console.log(JSON.stringify(obj));
    }
    
    const gen = function* () /* OP_initial_yield */ {
      try {
        yield "a";                            // 4
      } catch (e) {
        log(`Caught error: ${e.message}`);    // 1
      } finally {
        log("Cleanup");
      }
    };
    
    const g1 = gen();
    // g1.next();                             // 2
    g1.throw(new Error("Error from caller")); // 3
    

运行上面的代码会发现：

*   位置 `3` 处抛出的异常并不会被位置 `1` 处捕获，因为此时暂定的位置在指令 `OP_initial_yield` 处，并没有被函数体中的 `try...catch` 包裹
    
*   如果我们取消位置 `2` 处的注释，会使得 `g1` 暂停在位置 `4` 处、被 `try...catch` 包裹，所以位置 `3` 处的异常可以被位置 `1` 捕获
    

### next 方法

GF 在创建 Generator 时完成了 2 个操作：

*   执行一次自身，并于 `OP_initial_yield` 指令处暂停，目的是完成一些初始化操作，比如处理参数列表
    
*   暂停时的状态为 `JS_GENERATOR_STATE_SUSPENDED_START`
    

可以简单地认为 Generator 代表了一个正在执行中的 GF，后续将无法直接操作 GF - 对 GF 的操作将通过 Generator 上实现的 iterator protocol 中的 3 个方法方法来完成。

我们先看 `next` 方法的实现，其定义在 `js_generator_proto_funcs` 上：

    const JSCFunctionListEntry js_generator_proto_funcs[] = {
        JS_ITERATOR_NEXT_DEF("next", 1, js_generator_next, GEN_MAGIC_NEXT),
        JS_ITERATOR_NEXT_DEF("return", 1, js_generator_next, GEN_MAGIC_RETURN),
        JS_ITERATOR_NEXT_DEF("throw", 1, js_generator_next, GEN_MAGIC_THROW),
        JS_PROP_STRING_DEF("[Symbol.toStringTag]", "Generator",
                           JS_PROP_CONFIGURABLE),
    };
    

`JS_ITERATOR_NEXT_DEF` 是一个宏定义：

    #define JS_ITERATOR_NEXT_DEF(name, length, func1, magic)                       \
      {                                                                            \
        name, JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE, JS_DEF_CFUNC, magic, .u = { \
          .func = {length, JS_CFUNC_iterator_next, {.iterator_next = func1}}       \
        }                                                                          \
      }
    

宏定义的参数对应的解释为：

*   `name` 为属性名称
    
*   `length` 为形参个数
    
*   `func1` 为 C 函数指针
    
*   `magic` 调用 C 函数时会将其作为标记传入，C 函数内则根据该标记做差异化处理
    

根据上面的分析我们发现，`next` 对应引擎内的操作函数为 [js\_generator\_next](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/gen.c#L48 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/gen.c#L48")。

### next 首次调用

下面我们结合 `js_generator_next` 函数的实现来看看首次调用 `next` 方法时引擎内部的操作：

    static JSValue js_generator_next(JSContext *ctx, JSValueConst this_val,
                                     int argc, JSValueConst *argv, BOOL *pdone,
                                     int magic) {
      JSGeneratorData *s = JS_GetOpaque(this_val, JS_CLASS_GENERATOR);
      JSStackFrame *sf;
      JSValue ret, func_ret;
    
      *pdone = TRUE;
      if (!s)
        return JS_ThrowTypeError(ctx, "not a generator");
      sf = &s->func_state.frame;
      switch (s->state) {
      default:
      case JS_GENERATOR_STATE_SUSPENDED_START:
        if (magic == GEN_MAGIC_NEXT) {
          goto exec_no_arg;                                // 1
        } else {
          free_generator_stack(ctx, s);
          goto done;
        }
        break;
      case JS_GENERATOR_STATE_SUSPENDED_YIELD_STAR:
      case JS_GENERATOR_STATE_SUSPENDED_YIELD:
        /* cur_sp[-1] was set to JS_UNDEFINED in the previous call */
        ret = JS_DupValue(ctx, argv[0]);
        if (magic == GEN_MAGIC_THROW &&
            s->state == JS_GENERATOR_STATE_SUSPENDED_YIELD) {
          // ...
        } else {
          // ...
        exec_no_arg:                                       // 2
          s->func_state.throw_flag = FALSE;
        }
        s->state = JS_GENERATOR_STATE_EXECUTING;           // 3
        func_ret = async_func_resume(ctx, &s->func_state); // 4
        s->state = JS_GENERATOR_STATE_SUSPENDED_YIELD;     // 5
        if (JS_IsException(func_ret)) {
          // ...
        }
        if (JS_VALUE_GET_TAG(func_ret) == JS_TAG_INT) {    // 6
          /* get the returned yield value at the top of the stack */
          ret = sf->cur_sp[-1];
          sf->cur_sp[-1] = JS_UNDEFINED;
          if (JS_VALUE_GET_INT(func_ret) == FUNC_RET_YIELD_STAR) {
            s->state = JS_GENERATOR_STATE_SUSPENDED_YIELD_STAR;
            /* return (value, done) object */
            *pdone = 2;
          } else {
            *pdone = FALSE;
          }
        } else {                                           // 7
          /* end of iterator */
          ret = sf->cur_sp[-1];
          sf->cur_sp[-1] = JS_UNDEFINED;
          JS_FreeValue(ctx, func_ret);
          free_generator_stack(ctx, s);
        }
        break;
      case JS_GENERATOR_STATE_COMPLETED:
        // ...
      }
      return ret;
    }
    

上面代码的解释为：

*   由于当前状态是 `JS_GENERATOR_STATE_SUSPENDED_START`，并且注册 `next` 方法时 `magic` 设置为 `GEN_MAGIC_NEXT`，所以会执行到位置 `1`
    
*   位置 `1` 又跳转到位置 `2` 继续执行。`throw` 方法对应的 C 函数也是 `js_generator_next`，因此位置 `2` 处的标记用于区分 `next` 还是 `throw`
    
*   位置 `3` 处将 Generator 的状态标记为 `JS_GENERATOR_STATE_EXECUTING`，因为紧接着将要开始恢复执行其关联的异步函数
    
*   位置 `4` 处将从 Generator 上取回异步函数的执行状态，然后恢复并执行该异步函数。`async_func_resume` 函数我们已经介绍过，其内部会调用 `JS_CallInternal` 来执行，并且返回值为后者的执行结果
    
*   同步 JS 函数的返回结果由 `return` 语句设置，而 GF 的返回结果则由 `OP_yield` 指令设置。因此上一步 `async_func_resume` 函数的返回值即执行过程中遇到的 `OP_yield` 指令设置的值
    
*   对于 GF 来说，`JS_CallInternal` 会在执行到指令 `OP_return` 或者 `OP_yield` 时返回，因此位置 `4` 处的返回值可以能来自：
    
    *   GF 内 `return` 语句
        
    *   `yield` 表达式的值
        
    *   GF 内置执行发生的异常
        
*   如果 GF 内执行发生异常，那么 `func_ret` 为相应的异常对象
    
*   如果 GF 由于 `yield` 表达式返回，那么 `func_ret` 为 `FUNC_RET_YIELD`：
    
        CASE(OP_yield):
          ret_val = JS_NewInt32(ctx, FUNC_RET_YIELD);
          goto done_generator;
        
    
    因此会进入位置 `6` 处的逻辑 - `js_generator_next` 会将操作数栈顶的元素、也就是 `yield` 表达式的值弹出，返回给其调用方
    
*   如果 GF 由于 `return` 语句返回，那么 `func_ret` 为 `JS_UNDEFINED`：
    
        CASE(OP_return_async):
        CASE(OP_initial_yield):
          ret_val = JS_UNDEFINED;
          goto done_generator;
        
    
    因此会进入位置 `7` 处的逻辑
    
*   `*pdone` 作为出参，用于告诉 `js_generator_next` 的调用方当前 Generator 是否执行完毕
    
    下面我们会看到 `*pdone` 用于方便 `js_generator_next` 的 Caller 构造 `IteratorResult`
    

### IteratorResult

为了知道 `js_generator_next` 的调用方是谁，我们可以梳理一下当 JS 中调用 `next` 方法时引擎内部的调用链：

    JS:next
      C:JS_CallInternal         # 1
        C:js_call_c_function    # 2
          C:js_generator_next
            C:async_func_resume
              C:JS_CallInternal # call the GF
    

上面调用链的解释为：

*   每个 JS 函数调用，都会对应一个 `JS_CallInternal` 调用
    
*   因为 `next` 其实是绑定的 C 函数 `JSCFunctionListEntry`，所以会通过 `js_call_c_function` 进行调用
    

使用 `js_call_c_function` 调用时，会同时传入绑定时定义的参数，并且可能会对实际操作的 C 函数的返回值进行进一步的处理：

    JSValue js_call_c_function(JSContext *ctx, JSValueConst func_obj,
                               JSValueConst this_obj, int argc, JSValueConst *argv,
                               int flags) {
      // ...
      switch (cproto) {
      // ...
      case JS_CFUNC_iterator_next: {
        int done;
        ret_val = func.iterator_next(ctx, this_obj, argc, arg_buf, &done,
                                     p->u.cfunc.magic);
        if (!JS_IsException(ret_val) && done != 2) {
          ret_val = js_create_iterator_result(ctx, ret_val, done);
        }
      } break;
      // ...
      }
      rt->current_stack_frame = sf->prev_frame; // 1
      return ret_val;
    }
    

可以看到 `js_call_c_function` 函数中会将 `js_generator_next` 函数的返回值包装成 `IteratorResult`

同时我们也发现一点，如果一个 JS 函数 FJFJFJ 绑定了内部的 C 函数 FCFCFC，那么在调用 FJFJFJ 时，都会经由 `js_call_c_function` 发起对 FCFCFC 的调用，这么做有几点作用：

*   在 FJFJFJ 绑定到 FCFCFC 时，会定义一些相关参数，通过 `js_call_c_function` 进行调用会传递那些参数
    
*   `js_call_c_function` 也会根据绑定的参数，对 FCFCFC 的返回值做进一步的处理
    
*   FCFCFC 只需要实现功能，不用关心 JS 调用栈的处理，比如上面位置 `1` 处的弹出调用栈帧
    

### next 后续调用

下图表示 Generator 内部状态变化：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4977f95b9cae4ebc8faffcc0c248c00c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1538&h=1178&e=png&b=ffffff)

结合目前我们了解到的信息：

*   Generator 创建时的状态是 `JS_GENERATOR_STATE_SUSPENDED_START`
    
*   GF 内的指令 `OP_yield` 和 `OP_return_async` 并不会修改 Generator 内部的执行状态，状态的修改是由外层发起对 `JS_CallInternal` 调用的函数 `js_generator_next` 完成的
    
*   首次调用 `next` 后，状态会由 `JS_GENERATOR_STATE_SUSPENDED_START` 变为 `JS_GENERATOR_STATE_SUSPENDED_YIELD`
    

因此后续调用 `next` 会从 `js_generator_next` 函数中的 `JS_GENERATOR_STATE_SUSPENDED_YIELD` 分支处（位置 `8`）执行：

    static JSValue js_generator_next(JSContext *ctx, JSValueConst this_val,
                                     int argc, JSValueConst *argv, BOOL *pdone,
                                     int magic) {
      JSGeneratorData *s = JS_GetOpaque(this_val, JS_CLASS_GENERATOR);
      JSStackFrame *sf;
      JSValue ret, func_ret;
    
      *pdone = TRUE;
      if (!s)
        return JS_ThrowTypeError(ctx, "not a generator");
      sf = &s->func_state.frame;
      switch (s->state) {
      default:
      case JS_GENERATOR_STATE_SUSPENDED_START:
        if (magic == GEN_MAGIC_NEXT) {
          goto exec_no_arg;                                // 1
        } else {
          free_generator_stack(ctx, s);
          goto done;
        }
        break;
      case JS_GENERATOR_STATE_SUSPENDED_YIELD_STAR:
      case JS_GENERATOR_STATE_SUSPENDED_YIELD:
        /* cur_sp[-1] was set to JS_UNDEFINED in the previous call */
        ret = JS_DupValue(ctx, argv[0]);
        if (magic == GEN_MAGIC_THROW &&                    // 9
            s->state == JS_GENERATOR_STATE_SUSPENDED_YIELD) {
          JS_Throw(ctx, ret);
          s->func_state.throw_flag = TRUE;
        } else {                                           // 8
          sf->cur_sp[-1] = ret;
          sf->cur_sp[0] = JS_NewInt32(ctx, magic);
          sf->cur_sp++;
        exec_no_arg:                                       // 2
          s->func_state.throw_flag = FALSE;
        }
        s->state = JS_GENERATOR_STATE_EXECUTING;           // 3
        func_ret = async_func_resume(ctx, &s->func_state); // 4
        s->state = JS_GENERATOR_STATE_SUSPENDED_YIELD;     // 5
        if (JS_IsException(func_ret)) {
          // ...
        }
        if (JS_VALUE_GET_TAG(func_ret) == JS_TAG_INT) {    // 6
          /* get the returned yield value at the top of the stack */
          ret = sf->cur_sp[-1];
          sf->cur_sp[-1] = JS_UNDEFINED;
          if (JS_VALUE_GET_INT(func_ret) == FUNC_RET_YIELD_STAR) {
            s->state = JS_GENERATOR_STATE_SUSPENDED_YIELD_STAR;
            /* return (value, done) object */
            *pdone = 2;
          } else {
            *pdone = FALSE;
          }
        } else {                                           // 7
          /* end of iterator */
          ret = sf->cur_sp[-1];
          sf->cur_sp[-1] = JS_UNDEFINED;
          JS_FreeValue(ctx, func_ret);
          free_generator_stack(ctx, s);
        }
        break;
      case JS_GENERATOR_STATE_COMPLETED:
        // ...
      }
      return ret;
    }
    

位置 `8` 修改了操作数栈，往其中压入了 2 个元素：

    ret, GEN_MAGIC_NEXT;
    

`ret` 比较好理解，即调用 `next` 时传入的参数，后续会作为 GF 中恢复执行处的 `yield` 表达式的值。栈顶的 `GEN_MAGIC_NEXT` 则需要进一步通过指令序列来分析：

    function* gen() {
      let a = yield 1;
    }
    

对应的指令序列为：

    ;; function* gen() {
    
            initial_yield
            set_loc_uninitialized 0: a
            push_1 1
            yield
            if_false8 9
            return_async
    
    ;;   let a = yield 1;
    
        9:  put_loc0 0: a
            undefined
            return_async
    
    ;; }
    

通过指令序列可以发现，当 GF 恢复执行时，执行的指令是之前暂停的 `OP_yield` 指令的下一个指令，也就是上面指令序列中的 `OP_if_false8`。

`OP_if_false8` 可以看成是 `jump if false`，该指令会弹出栈顶元素，判断其是否为 `false`，如果条件满足则跳转到为止 `9` 处继续执行，否则将执行指令 `OP_return_async` 结束 GF 的执行。

通过 `GEN_MAGIC_NEXT` 的定义可以发现栈顶元素的取值可能为：

    #define GEN_MAGIC_NEXT 0
    #define GEN_MAGIC_RETURN 1
    #define GEN_MAGIC_THROW 2
    

因为 `GEN_MAGIC_NEXT` 为 `0`，所以 GF 会继续执行，直到遇到下一个：

*   yield
    
*   return
    
*   执行异常
    

之后返回到 `js_generator_next` 中的位置 `5`

### return 方法

我们继续看一下调用 Generator 上的 `return` 方法提前结束 GF 执行时的内部操作。

调用 `return` 方法时 `Generator` 状态为 `JS_GENERATOR_STATE_SUSPENDED_YIELD`，并且 `return` 也是绑定的函数 `js_generator_next`，因此会和后续调用 `next` 方法一样进入到上面 `js_generator_next` 函数体中的位置 `8` 处继续执行。

位置 `8` 修改了操作数栈，往其中压入了 2 个元素：

    ret, GEN_MAGIC_RETURN;
    

因为 `GEN_MAGIC_RETURN` 的值为 `1`，所以会执行 `OP_if_false8` 之后的指令序列：

    ;; function* gen() {
    
            initial_yield
            set_loc_uninitialized 0: a
            push_1 1
            yield
            if_false8 9
            return_async
    
    ;;   let a = yield 1;
    
        9:  put_loc0 0: a
            undefined
            return_async
    
    ;; }
    

上面的例子中是执行的指令 `OP_return_async` 结束了 GF 的执行。

如果 `yield` 表达式被 `try...finally` 包裹，那么 `if_false8` 后面的指令序列将为跳转到 `finally` 子句对应的指令序列处，比如代码：

    function* gen() {
      try {
        let a = yield 1;
      } finally {
        print("finally");
      }
    }
    

对应的指令序列为：

    ;; function* gen() {
    
            initial_yield
            catch 31
            set_loc_uninitialized 0: a
            push_1 1
            yield
            if_false8 20
            nip
            gosub 37                        # 1
            return_async
    
    ;;   try {
    ;;     let a = yield 1;
    
       20:  put_loc0 0: a
            drop
            undefined
            gosub 37
            drop
            goto8 50
       31:  gosub 37
            throw
       37:  get_var print                   # 2
    
    ;;   } finally {
    
            push_atom_value finally
    
    ;;     print("finally");
    ;;   }
    ;; }
    
            call1 1
            drop
            ret
       50:  undefined
            return_async
    

可以看到位置 `1` 处的指令，会继续跳转到位置 `2` 处执行，后者即为 `finally` 子句的指令序列对应的首地址。

### throw 方法

与 `return` 方法类似，`throw` 执行时也是从 `js_generator_next` 函数体中的位置 `8` 处开始，往操作数栈中压入了 2 个元素：

    ret, GEN_MAGIC_THROW;
    

由于 `throw` 绑定 `js_generator_next` 时的 `magic` 定义为 `GEN_MAGIC_THROW`，所以会进入 `js_generator_next` 函数体内位置 `9` 处的条件分支：

*   `JS_Throw(ctx, ret)` 中的 `ret` 即为调用 `throw` 时传入的异常对象
    
*   `JS_Throw` 会将 `ret` 设置到 `JSRuntime::current_exception` 上
    
*   设置了 `throw_flag` 为 `true`
    

接着继续 `js_generator_next` 中位置 `3` 处的逻辑，然后调用 `async_func_resume`，进而调用 `JS_CallInternal`：

    static JSValue JS_CallInternal(JSContext *caller_ctx, JSValueConst func_obj,
                                   JSValueConst this_obj, JSValueConst new_target,
                                   int argc, JSValue *argv, int flags)
    {
      // ...
      if (unlikely(JS_VALUE_GET_TAG(func_obj) != JS_TAG_OBJECT)) {
          if (flags & JS_CALL_FLAG_GENERATOR) {
              // ...
              if (s->throw_flag)
                  goto exception;
              else
                  goto restart;
          } else {
              goto not_a_function;
          }
      }
      // ...
    }
    

可以发现由于设置了 `throw_flag`，所以会进入到 `JS_CallInternal` 函数体中 `exception` 段的内容。

### 回顾

上面的内容可以梳理为：

*   GF 的首次执行会在指令 `OP_initial_yield` 处进入暂定，目的是为了处理参数列表，该指令处于函数体指令序列之外，因此无法被函数体中的 `try...catch` 捕获
    
*   GF 初始化后产生的 Generator 对象其内部执行状态为 `JS_GENERATOR_STATE_SUSPENDED_START`，因此首次执行 `next` 会跳转到 `js_generator_next` 中的 `exec_no_arg` 处，忽略了首次调用 `next` 的传参
    
*   每次对 `next` 方法的调用都产生下面的调用链：
    
        JS:next
          C:JS_CallInternal         # 1
            C:js_call_c_function    # 2
              C:js_generator_next
                C:async_func_resume
                  C:JS_CallInternal # call the GF
        
    
*   `next` 绑定的内部实现为函数 `js_generator_next`，但中间需经过高阶函数 `js_call_c_function` 完成调用
    
    通过 `js_call_c_function` 调用 fff 有 2 个目的：
    
    *   会传入绑定 fff 时的参数
        
    *   可能对 fff 的返回值做些修饰（比如构造 `IteratorResult`）
        
*   `return` 在暂停处返回的功能是通过 2 处的配合完成：
    
    1.  指令生成时，在指令 `OP_yield` 之后加上条件跳转指令
        
    2.  条件跳转指令的参数则是 `js_generator_next` 根据绑定时的 `magic` 传入的 `GEN_MAGIC_RETURN`
        
*   `throw` 在暂停处抛出异常是通过 2 处配合完成：
    
    1.  `js_generator_next` 将 `throw` 调用时传入的异常对象压入 GF 的操作数栈顶
        
    2.  通过在 `js_generator_next` 中设置 GF 的标记 `throw_flag` 为 `true`，使得 GF 在执行时进入到 `exception` 段的处理逻辑
        

yield\*
-------

操作符 [yield\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield* "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*") 可以将 Generator 的值序列生成委托给另一个迭代器，比如下面的代码：

    function log(obj) {
      if (typeof obj === "string") return print(obj);
      print(JSON.stringify(obj));
    }
    
    function* g1() {
      yield 2;
      yield 3;
      yield 4;
    }
    
    function* g2() {
      yield 1;
      yield* g1();
      yield 5;
    }
    
    const gen = g2();
    
    log(gen.next()); // {value: 1, done: false}
    log(gen.next()); // {value: 2, done: false}
    log(gen.next()); // {value: 3, done: false}
    log(gen.next()); // {value: 4, done: false}
    log(gen.next()); // {value: 5, done: false}
    log(gen.next()); // {done: true}
    

不使用 `yield*` 我们也可以达到类似的效果：

    function* g2() {
      yield 1;
    
      const gen1 = g1();
      let gen1Arg;
      while (true) {
        let r = gen1.next(gen1Arg);
        if (r.done) break;
        gen1Arg = yield r.value;
      }
    
      yield 5;
    }
    

因此 `yield*` 可以看成是一个语法糖。

语法糖可以提高代码的可读性，引擎内部则还是会将其展开（比如展上面的 `while`），并生成展开后的指令序列。

为了排除干扰项，我们使用进一步简化的代码进行分析：

    function* g2() {
      yield* g1();
    }
    

相应的字节码序列为：

    ;; function* g2() {
    
            initial_yield
    
    ;;   yield* g1();
    
            get_var g1
            call0 0
            for_of_start
            drop
            undefined
            undefined
    
    ;; }
    
       11:  iterator_next             # gen1.next
            iterator_check_object
            get_field2 done
            if_true8 75
       20:  yield_star
            dup
            if_true8 27               # goto checking gen1.return or gen1.throw
            drop
            goto8 11                  # goto gen1.next
       27:  push_2 2                  # if gen1.throw
            strict_eq
            if_true8 52               # goto gen1.throw
       LA:  iterator_call 0           # call gen1.return if it is callable
            if_true8 48
            iterator_check_object
            get_field2 done
            if_false8 20              # operand always true
            get_field value
       48:  nip
            nip
            nip
       LB:  return_async              # both gen1 and gen2 are done
       52:  iterator_call 1           # call gen1.throw if it is callable
            if_true8 66               # gen1.throw not impl, goto gen1.throw_throw_not_impl
            iterator_check_object
            get_field2 done
       LE:  if_false8 20              # error in gen1 been caught
       LD:  goto8 75
       66:  iterator_call 2           # gen1.throw_throw_not_impl
            drop
       LC:  throw_error "<null>",4
       75:  get_field value           # gen1.done
            nip
            nip
            nip
            drop
            undefined
            return_async
    

上面的指令序列内容较多，我们可以先分 3 部分来看：

*   当调用 `gen2.next` 时，需调用 `gen1.next`，即 `L11 ~ L20`
    
*   当调用 `gen2.return` 时，需调用 `gen1.return`，即 `LA ~ LB`
    
*   当调用 `gen2.throw` 时，需调用 `gen1.throw`，即 `L52 ~ LC`
    

换句话说就是当 `gen1` 没迭代完成前，对 `gen2` 的操作都表示操作 `gen1`。

在这个基础之上，加上一些边界情况的处理：

*   当 `gen1.throw` 方法并未实现，即 `L66`
    
*   当 `gen1.throw` 为未被其内部捕获，需要 [向上抛出](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L1329 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L1329")
    
*   当 `gen1.throw` 被其内部捕获处理掉，则需进一步看其返回结果：
    
    *   返回 `{done: true}`，即 `LD`
        
            function log(obj) {
              if (typeof obj === "string") return console.log(obj);
              console.log(JSON.stringify(obj));
            }
            
            function* g1() {
              try {
                yield 2;
                yield 3;
                yield 4;
              } catch (error) {
                console.log("caught g1");
              }
            }
            
            function* g2() {
              yield 1;
              yield* g1();
              yield 5;
            }
            
            const gen = g2();
            
            log(gen.next()); // {value: 1, done: false}
            log(gen.next()); // {value: 2, done: false}
            // caught g1
            // {"value":5,"done":false}
            // 注意对比下发例子中相似位置的 throw 的输出结果
            log(gen.throw(3));
            log(gen.next()); // {done:true}
            log(gen.next()); // {done:true}
            log(gen.next()); // {done:true}
            log(gen.next()); // {done:true}
            
        
        这种情况一般为 `gen1` 为 Generator 且错误被 `try...catch` 捕获时自动返回 `{done: true}`
        
    *   返回 `{done: false}`，迭代器实现了 `throw` 方法，并返回 `{done: false}`，即 `LE`
        
            function log(obj) {
              if (typeof obj === "string") return console.log(obj);
              console.log(JSON.stringify(obj));
            }
            
            const gen1 = {
              [Symbol.iterator]: () => {
                return {
                  i: 0,
                  next() {
                    if (this.i === 0) {
                      this.i++;
                      return { value: 2, done: false };
                    }
                    return { done: true };
                  },
                  throw() {
                    return { done: false };
                  },
                };
              },
            };
            
            function* g2() {
              yield 1;
              yield* gen1;
              yield 5;
            }
            
            const gen = g2();
            
            log(gen.next()); // {value: 1, done: false}
            log(gen.next()); // {value: 2, done: false}
            // {"done":false}
            log(gen.throw(3));
            log(gen.next()); // {"value":5,"done":false}
            log(gen.next()); // {done:true}
            log(gen.next()); // {done:true}
            log(gen.next()); // {done:true}
            
        

可以结合下面的流程图来理解，篮色的字对应上面字节码：

![yield_star](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd1c11aca6a1474db83ba4906869524d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1742&h=2172&e=png&b=fffcfc)

图中的内容需要分层来看，有三种不同程度的黄色，表示处理逻辑的分层和递进：

*   最深的黄色，表示主要的处理逻辑，即调用来自 `gen2.next`、`gen2.return` 还是 `gen2.throw`
    
*   中间程度的黄色是在上一个黄色标识的逻辑基础上的细化，即对 `gen1.throw` 的处理：
    
    *   抛出为实现 `gen1.throw` 的异常
        
    *   执行 `gen1.throw`
        
*   颜色最浅的黄色则又是在上面的基础上进一步细化：
    
    *   执行 `gen1.throw` 时发生未捕获异常，则向上抛出
        
    *   异常被捕获，且 `gen1.throw` 返回 `{done: true}`
        
    *   异常被捕获，且 `gen1.throw` 返回 `{done: false}`
        

蓝色部分的条件判断，则对应了字节码序列中的跳转指令。

小结
--

本节我们一起了解了 Generator 的底层实现，现在大家可以感觉到 Generator 不过是引擎为了方便开发者产生 A sequence of values 提供的语法糖 - 在同步语法的基础上稍加修改，使得开发者可以较为方便的产出值序列。

我们也领会了函数暂停和恢复执行在引擎中的实现方式，这个引擎功能可以复用到下一节将要介绍的异步函数实现之中。