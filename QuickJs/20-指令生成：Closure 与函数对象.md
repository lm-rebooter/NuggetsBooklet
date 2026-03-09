本节我们将一起了解 Closure 相关的解析工作是如何完成的。

Closure 与函数对象
-------------

首先回顾下 Closure 与函数对象之间的关系，以下面代码对应的字节码序列为线索：

    function f() {}
    

对应的字节码序列为：

      opcodes:
        0  3F 3E 02 00 00 40          check_define_var f,64
        6  C0 00                      fclosure8 0: [bytecode f]
        8  40 3E 02 00 00 00          define_func f,0
    

似乎 `fclosure8 0: [bytecode f]` 的作用就是创建闭包，我们查看对应的指令实现：

    CASE(OP_fclosure8):
      *sp++ = js_closure(ctx, JS_DupValue(ctx, b->cpool[*pc++]), var_refs, sf);
      if (unlikely(JS_IsException(sp[-1])))
      goto exception;
      BREAK;
    

可见指令主要依赖函数 `js_closure`，下面是其声明：

    JSValue js_closure(JSContext *ctx, JSValue bfunc, JSVarRef **cur_var_refs,
                       JSStackFrame *sf);
    

其中的参数解释为：

*   `ctx` 表示当前关联的上下文
    
*   `bfunc` 的类型为 `JSValue`，其字段 `u.ptr` 指向的类型为 `JSFunctionBytecode`，该结构保存了函数的元信息：
    
    *   字节码
    *   局部变量定义
    *   形参数量
    *   ...
*   `cur_var_refs` 表示被当前作用域捕获的变量
    
*   `sf` 表示当前的操作数栈
    

继续查看函数 `js_closure` 的实现：

    JSValue js_closure(JSContext *ctx, JSValue bfunc, JSVarRef **cur_var_refs,
                       JSStackFrame *sf) {
      JSFunctionBytecode *b;
      JSValue func_obj;
      JSAtom name_atom;
    
      b = JS_VALUE_GET_PTR(bfunc);
      // 1
      func_obj = JS_NewObjectClass(ctx, func_kind_to_class_id[b->func_kind]);
      if (JS_IsException(func_obj)) {
        JS_FreeValue(ctx, bfunc);
        return JS_EXCEPTION;
      }
      // 2
      func_obj = js_closure2(ctx, func_obj, b, cur_var_refs, sf);
      if (JS_IsException(func_obj)) {
        /* bfunc has been freed */
        goto fail;
      }
      // ...
    }
    

上面代码为函数实现的节选，其中的解释为：

*   位置 `1` 处创建了函数对象，其中 [func\_kind\_to\_class\_id](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L809 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L809") 对应了 4 中不同的函数对象类型：
    
    *   `JS_CLASS_BYTECODE_FUNCTION`
        
    *   `JS_CLASS_GENERATOR_FUNCTION`
        
    *   `JS_CLASS_ASYNC_FUNCTION`
        
    *   `JS_CLASS_ASYNC_GENERATOR_FUNCTION`
        
*   创建了函数对象 `func_obj` 后，以其为参数继续调用了 `js_closure2`
    

可见引擎会先根据编译期间收集的、存放在 `JSFunctionBytecode` 的函数元信息创建一个函数对象，然后使用该函数对象创建闭包。

继续查看 `js_closure2` 的实现：

    JSValue js_closure2(JSContext *ctx, JSValue func_obj, JSFunctionBytecode *b,
                        JSVarRef **cur_var_refs, JSStackFrame *sf) {
      JSObject *p;
      JSVarRef **var_refs;
      int i;
    
      p = JS_VALUE_GET_OBJ(func_obj);
      p->u.func.function_bytecode = b;               // 1
      p->u.func.home_object = NULL;
      p->u.func.var_refs = NULL;
      if (b->closure_var_count) {
        var_refs = js_mallocz(ctx, sizeof(var_refs[0]) * b->closure_var_count);
        if (!var_refs)
          goto fail;
        p->u.func.var_refs = var_refs;
        for (i = 0; i < b->closure_var_count; i++) { // 2
          JSClosureVar *cv = &b->closure_var[i];
          JSVarRef *var_ref;
          if (cv->is_local) {                        // 3
            /* reuse the existing variable reference if it already exists */
            var_ref = get_var_ref(ctx, sf, cv->var_idx, cv->is_arg);
            if (!var_ref)
              goto fail;
          } else {                                   // 4
            var_ref = cur_var_refs[cv->var_idx];
            var_ref->header.ref_count++;
          }
          var_refs[i] = var_ref;
        }
      }
      return func_obj;
    fail:
      /* bfunc is freed when func_obj is freed */
      JS_FreeValue(ctx, func_obj);
      return JS_EXCEPTION;
    }
    

> 引擎中的闭包实现方式和 Lua 很相似，感兴趣可以了解 [Closures in Lua](https://www.cs.tufts.edu/~nr/cs257/archive/roberto-ierusalimschy/closures-draft.pdf "https://www.cs.tufts.edu/~nr/cs257/archive/roberto-ierusalimschy/closures-draft.pdf")

上述代码中的关键步骤解释为：

*   位置 `1` 设置函数对象的属性 `function_bytecode`，包含了函数体对应的字节码序列
    
*   位置 `2` 处的循环根据 `JSFunctionBytecode` 中的信息设置 `var_refs`，该数组记录了闭包捕获的变量
    
    被捕获变量的信息包括：
    
    1.  捕获变量的个数 `closure_var_count`
        
    2.  捕获变量的元信息 `closure_var`：
        
        1.  变量是否为当前活动的调用栈上的局部变量数组（vars）上，通过 `is_local` 标识
            
        2.  变量是否为当前活动的调用栈上的实参数组（args）上，通过 `is_arg`
            
        3.  变量在 vars 或者 args 或者在父级闭包捕获的变量数组上的索引 `var_idx`
            
*   位置 `3` 处的 `is_local` 表示捕获的变量处于当前活动的调用栈上
    
    比如：
    
        function f() {
          var a = 1;
        
          // 1
          return function f1() {
            return a;
          };
        }
        
        f();
        
    
    `a` 在当前活动的调用栈上是因为：
    
    *   执行到位置 `1` 处的 `return` 语句，当前活动的调用栈为 `f` 被调用产生的调用栈帧 `callFrame_f`
    *   而 `a` 正处于调用栈帧 `callFrame_f` 上
*   位置 `4` 处表示捕获的变量不在当前活动的调用栈上，需要上线查找
    
    比如：
    
        function f() {
          var a = 1;
        
          return function f1() {
            a = a + 1;
        
            return function f2() {
              return a;
            };
          };
        }
        
        const f1 = f();
        const f2 = f1(); // 1
        
    
    *   当 `f` 被调用创建 `f1` 时，`f1` 中捕获的变量 `a` 还在活动的操作数栈 `callFrame_f` 中
        
    *   当 `f` 调用完毕后，调用栈 `callFrame_f` 将会被释放，为了后续 `f2` 能继续访问到 `a`，会将 `a` 从 `callFrame_f` 拷贝到 `f1` 对象的 `var_refs` 中
        
    *   这样，未来调用 `f1` 创建 `f2` 时，`f2` 需要捕获的变量 `a` 就可以在 `f1` 的 `var_refs` 中找到了
        
    
    上面的例子是显式捕获，隐式捕获的例子为：
    
        function f() {
          var a = 1;
        
          return function f1() {
            // implicitly capture `a`
        
            return function f2() {
              return a;
            };
          };
        }
        
        const f1 = f();
        const f2 = f1(); // 1
        
    

经过上面的分析，引擎中对闭包的创建过程为：

    JSFunctionBytecode -> fnObj_with_captured_vars
    

我们知道闭包包括函数和它捕获的对象，有趣的是引擎实现中并没有额外再实现一个闭包对象：

> Operationally, a closure is a record storing a function\[a\] together with an environment.
> 
> [Closure (computer programming)](https://en.wikipedia.org/wiki/Closure_(computer_programming) "https://en.wikipedia.org/wiki/Closure_(computer_programming)")

引擎选择直接利用函数对象来存储捕获的变量，大概是出于对性能的考虑 - 结合闭包在应用程序创建的对象中的占比，多出一层包装对象，在内存利用率和调用效率上都将产生损耗。

虽然引擎选择直接利用函数对象来存储捕获的变量，但这属于引擎实现的细节，我们在描述闭包和函数之间的关系时，从严谨的出发不应将它们画等号。

变量捕获
----

闭包的核心功能就是捕获变量，那么在静态阶段如何分析出哪些变量是需要被捕获的就成了关键，下面我们一起看看引擎的实现方式。

### Phase 1

由于 JS 中的 [Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting") 特性，变量可以在其定义之前被使用：

    var a = 1;
    function f() {
      console.log(a); // undefined
      var a = 2;
    }
    
    f();
    

上述例子运行会打印 `undefined` 而不是 `1`，因为它等价于下面的形式：

    var a = 1;
    function f() {
      var a;
      console.log(a); // undefined
      a = 2;
    }
    
    f();
    

穿插一点，这一设计的出发点可能是好的，使得开发者不用太关心变量的声明，看起来是语言设计者帮开发者减负了。但是考虑下面几点：

*   首先，变量使用之前需要先定义，对于开发者而言不管是理解还是使用其实并没有难度
    
*   其次，主流语言也是采用的变量需要先定义
    
*   最后，并不能做到让开发者完全不用关心，否则 MDN 上也不必花篇幅解释 Hoisting 了
    

所以这样的设计反而增加了开发者的心智负担，并且也让引擎实现也变得冗余。

言归正传，在上面的例子中，当解析到 `console.log(a)` 中的 `a` 时，由于 `a` 在函数内的定义尚未被解析到，所以暂时无法确定 `a` 是否被定义在函数内部。为了确定 `a` 的作用域，至少要等到函数 `f` 被解析完毕。

引擎的实现方式是通过 2 次解析来完成，我们先看 phase 1 阶段：

1.  解析到标识符时会 [生成](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/expr.c#L737 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/expr.c#L737") 指令 `OP_scope_get_var`，其参数为：
    
    *   变量名
        
    *   变量引用发生时的作用域索引
        
2.  如果标识符是作为左值，则继续通过函数 [get\_lvalue](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/parse/lval.c#L107 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/parse/lval.c#L107") 将指令 `OP_scope_get_var` 移除，替换成指令 `OP_scope_make_ref`，其参数为：
    
    *   变量名
        
    *   变量引用发生时的作用域索引
        
    *   赋值指令序列起始位置的 label
        
    
    `get_lvalue` 调用时如果 `keep`，则输出指令 `OP_get_ref_value`，此时指令序列类似：
    
        -> TOP
        OP_scope_make_ref, OP_get_ref_value?, OP_label
        
    
    由于解析是从左往右，会继续解析右值的表达式，指令序列继续变为：
    
        -> TOP
        OP_scope_make_ref, OP_get_ref_value?, OP_label, RHS_OPS
        
    
3.  右值表达式解析完毕后，会进入函数 [put\_lvalue](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/parse/lval.c#L5 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/parse/lval.c#L5") ：
    
    *   更新 `OP_scope_make_ref` 中的 label，使之指向赋值指令序列的起始地址
        
    *   接着开始根据 `get_lvalue` 返回的读取功能的 OP 生成其对的写入 OP，由 [put\_lvalue](https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/parse/lval.c#L5 "https://github.com/hsiaosiyuan0/quickjs/blob/3d4b0ef8273738db3d86031fa0c791a58f635784/src/parse/lval.c#L5") 完成：
        
    
        -> TOP
        OP_scope_make_ref, OP_get_ref_value?, OP_label, RHS_OPS, （OP_nop |OP_insert3|OP_perm4)?, OP_scope_put_var
        
    

可见在 Phase 1 阶段主要是完成基本信息的收集，比如变量名，变量访问发生时的作用域等，并没有直接记录闭包变量信息的操作。

### Phase 2

解析工作都已经在 Phase 1 中完成了，结果会存放在 `JSFunctionDef` 中。Phase 2 可以被认为是一个发生在运行时的前置阶段，在其中需根据函数的元信息 `JSFunctionDef` 来创建函数对象。

引擎中用于创建 JS 函数对象的函数为 [js\_create\_function](https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/func.c#L1288 "https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/func.c#L1288")：

    JSValue js_create_function(JSContext *ctx, JSFunctionDef *fd) {
      // ...
      /* recompute scope linkage */
      // 1
      for (scope = 0; scope < fd->scope_count; scope++) {
        fd->scopes[scope].first = -1;
      }
      // 2
      if (fd->has_parameter_expressions) {
        /* special end of variable list marker for the argument scope */
        fd->scopes[ARG_SCOPE_INDEX].first = ARG_SCOPE_END;
      }
      // 3
      for (idx = 0; idx < fd->var_count; idx++) {
        JSVarDef *vd = &fd->vars[idx];
        vd->scope_next = fd->scopes[vd->scope_level].first;
        fd->scopes[vd->scope_level].first = idx;
      }
      // 4
      for (scope = 2; scope < fd->scope_count; scope++) {
        JSVarScope *sd = &fd->scopes[scope];
        if (sd->first < 0)
          sd->first = fd->scopes[sd->parent].first;
      }
      // 5
      for (idx = 0; idx < fd->var_count; idx++) {
        JSVarDef *vd = &fd->vars[idx];
        if (vd->scope_next < 0 && vd->scope_level > 1) {
          scope = fd->scopes[vd->scope_level].parent;
          vd->scope_next = fd->scopes[scope].first;
        }
      }
      // ...
      // phase 2
      if (resolve_variables(ctx, fd))
        goto fail;
    }
    

可以看到在进入 phase 2 之前有一段处理 scope 的逻辑，因为闭包与作用域是相关的，所以我们需要了解这些操作的含义：

1.  在位置 `1` 中将 `JSVarScope::first` 都设置为了 -1。原本这个字段指向的是该作用域下最后一个定义的变量信息在 `JSFunctionDef::vars` 中的索引
    
2.  如果函数的形参中包含了表达式，那么 S1（索引为 1 的作用域）将为其提供隔离性，其中将无法访问 S0 中定义的变量。位置 `2` 通过 `ARG_SCOPE_END` 标记这是形参引入的作用域
    
3.  位置 `3` 遍历 `JSFunctionDef::vars` 上的变量定义，将它们在各自的作用域内连接起来，变量的词法位置与它们在数组中的顺序相同，因此该操作是将词法位置偏后的变量定义的 `scope_next` 指向它之前的变量定义。
    
    作用域中最先定义的变量其 `scope_next` 为 -1，形参的作用域中最先定义的变量 `scope_next` 为 `ARG_SCOPE_END`
    
4.  S1 是形参表达式子的作用域或者函数体的作用域，两者都不会连接到 S0，所以位置 `4` 处的循环从 `2` 开始。如果某个作用域中未定义变量，那么其 `first` 为 -1 小于 0，经过这一步操作后，将指向上父级作用域中最后一个定义的变量
    
5.  上一步是将 scopes 进行了连接，但由于 scope 和其中的变量定义是分开存放的，所以位置 `5` 处将变量也进行了连接 - 作用域中最先定义的变量，连接到其父级作用域中的最后一个变量
    

我们通过一个例子来演示上面的逻辑，假设形参中包含了表达式，那么 S1 会用作形参中表达式的作用域，剩余作用域和它们中的变量关系如下：

![scope_link_before.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2707cc3334d41759498a96b6875d13e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=860&h=442&s=54441&e=png&b=fefdfd)

*   S3 的 `first` 为 -1，因为它其中没有定义变量
    
*   S4 的 `first` 为 `d`
    

可以发现 `d` 到了 `c` 之后就无法继续连接上级作用域的变量了。

有了上面的第 4、5 步后：

![scope_after.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c60e5e59303436f993250d35ca2fcc8~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=850&h=442&s=56674&e=png&b=fefdfd)

*   经过第 4 步，S3 的 `first` 指向了其父级的 `first`
    
*   经过在第 5 步，`c` 的 `scope_next` 执行了其父级作用域的 `first` 即 `b`
    

### resolve\_variables

接着通过调用函数 [resolve\_variables](https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/func.c#L1368 "https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/func.c#L1368") 正式进入 phase 2。

进入 `resolve_variables` 后会进入下面的逻辑：

    case OP_scope_get_var_undef:
    case OP_scope_get_var:
    case OP_scope_put_var:
    case OP_scope_delete_var:
    case OP_scope_get_ref:
    case OP_scope_put_var_init:
      var_name = get_u32(bc_buf + pos + 1);
      scope = get_u16(bc_buf + pos + 5);
      pos_next = resolve_scope_var(ctx, s, var_name, scope, op, &bc_out, NULL,
                                    NULL, pos_next);
      JS_FreeAtom(ctx, var_name);
      break;
    

可见会继续调用 [resolve\_scope\_var](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/optim.c#L373 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/optim.c#L373")：

    static int resolve_scope_var(JSContext *ctx, JSFunctionDef *s, JSAtom var_name,
                                 int scope_level, int op, DynBuf *bc,
                                 uint8_t *bc_buf, LabelSlot *ls, int pos_next) {
      // ...
      /* 1. resolve local scoped variables */
      var_idx = -1;
      for (idx = s->scopes[scope_level].first; idx >= 0;) {
        vd = &s->vars[idx];
        if (vd->var_name == var_name) {
          if (op == OP_scope_put_var || op == OP_scope_make_ref) {
            // ...
          }
          var_idx = idx;
          break;
        } else if (vd->var_name == JS_ATOM__with_ && !is_pseudo_var) {
          // ...
        }
        idx = vd->scope_next;
      }
      // 1.1
      is_arg_scope = (idx == ARG_SCOPE_END);
      if (var_idx < 0) {
        /* argument scope: variables are not visible but pseudo
           variables are visible */
        if (!is_arg_scope) {
          // 1.2
          var_idx = find_var(ctx, s, var_name);
        }
    
        // ...
      }
    
      // 2
      if (var_idx >= 0) {
        // ...
        goto done;
      }
    
      // ...
    
      // 3
      /* check parent scopes */
      for (fd = s; fd->parent;) {
        scope_level = fd->parent_scope_level;
        fd = fd->parent;
        for (idx = fd->scopes[scope_level].first; idx >= 0;) {
          vd = &fd->vars[idx];
          if (vd->var_name == var_name) {
            if (op == OP_scope_put_var || op == OP_scope_make_ref) {
              // ...
            }
            var_idx = idx;
            break;
          } else if (vd->var_name == JS_ATOM__with_ && !is_pseudo_var) {
            // ...
          }
          idx = vd->scope_next;
        }
        is_arg_scope = (idx == ARG_SCOPE_END);
        if (var_idx >= 0)
          break;
    
        if (!is_arg_scope) {
          var_idx = find_var(ctx, fd, var_name);
          if (var_idx >= 0)
            break;
        }
        // ...
      }
    
      // ...
    
      // 4
      if (var_idx >= 0) {
        /* find the corresponding closure variable */
        if (var_idx & ARGUMENT_VAR_OFFSET) {
          fd->args[var_idx - ARGUMENT_VAR_OFFSET].is_captured = 1;
          idx = get_closure_var(ctx, s, fd, TRUE, var_idx - ARGUMENT_VAR_OFFSET,
                                var_name, FALSE, FALSE, JS_VAR_NORMAL);
        } else {
          fd->vars[var_idx].is_captured = 1;
          idx = get_closure_var(
              ctx, s, fd, FALSE, var_idx, var_name, fd->vars[var_idx].is_const,
              fd->vars[var_idx].is_lexical, fd->vars[var_idx].var_kind);
        }
        if (idx >= 0) {
        has_idx:
          // ...
          goto done;
        }
      }
    
      // 5
      /* global variable access */
    }
    

函数内容还是比较多的，我们将主线以外的部分进行了缩减，上面代码中的内容为：

1.  首先看变量是否属于函数本地变量，传入的 `scope_level` 至少是从 1 开始的，也就是 `let|const` 或者形参表达式引入的变量。
    
    1.  如果没有找到，则判断 `scope_level` 是否为形参表达式作用域，由于该作用域的隔离性需要，将无法访问 S0 的变量
        
    2.  `scope_level` 不为形参表达式作用域，则可以访问 S0 变量
        
2.  经过上一步，如果变量定义找到了（`var_idx >= 0`），则变量属于函数本地变量，在生成对应的访问本地变量的字节码序列后，跳转到 `done` 结束
    
3.  如果变量不属于函数本地变量，则需要在其父函数中继续查找定义
    
4.  如果上一步找到了，则说明变量是需要被捕获的，将通过函数 `get_closure_var` 记录被捕获变量的信息，以便后续运行时操作
    
    捕获变量信息记录完毕后，会在 `has_idx` 中生成访问闭包变量对应的指令序列，完毕后也会跳转到 `done` 结束
    
5.  如果变量还未找到，则需要生成访问全局变量所需的指令序列
    

继续查看函数 `get_closure_var` 是如何记录捕获变量信息的，该函数内部直接调用了函数 [get\_closure\_var2](https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/func.c#L875 "https://github.com/hsiaosiyuan0/slowjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/func.c#L875")，传入的参数 `is_local` 为 `TRUE`：

    int get_closure_var(JSContext *ctx, JSFunctionDef *s, JSFunctionDef *fd,
                        BOOL is_arg, int var_idx, JSAtom var_name, BOOL is_const,
                        BOOL is_lexical, JSVarKindEnum var_kind) {
      return get_closure_var2(ctx, s, fd, TRUE, is_arg, var_idx, var_name, is_const,
                              is_lexical, var_kind);
    }
    
    /* 'fd' must be a parent of 's'. Create in 's' a closure referencing a
       local variable (is_local = TRUE) or a closure (is_local = FALSE) in
       'fd' */
    int get_closure_var2(JSContext *ctx, JSFunctionDef *s, JSFunctionDef *fd,
                         BOOL is_local, BOOL is_arg, int var_idx, JSAtom var_name,
                         BOOL is_const, BOOL is_lexical, JSVarKindEnum var_kind) {
      int i;
    
      // 1
      if (fd != s->parent) {
        var_idx = get_closure_var2(ctx, s->parent, fd, is_local, is_arg, var_idx,
                                   var_name, is_const, is_lexical, var_kind);
        if (var_idx < 0)
          return -1;
        is_local = FALSE;
      }
      // 2
      for (i = 0; i < s->closure_var_count; i++) {
        JSClosureVar *cv = &s->closure_var[i];
        if (cv->var_idx == var_idx && cv->is_arg == is_arg &&
            cv->is_local == is_local)
          return i;
      }
      // 3
      return add_closure_var(ctx, s, is_local, is_arg, var_idx, var_name, is_const,
                             is_lexical, var_kind);
    }
    

上面 `get_closure_var2` 函数的参数 `s` 表示当前作用域，`fd` 表示 `s` 的直接父级或者祖先作用域。

函数中有个递归调用，我们先看一个简单的情况，即 `fd` 为 `s` 的直接父级：

1.  步骤 1 会被跳过，`is_local` 为 `TRUE`
    
2.  步骤 2 是检查闭包变量是否已经记录过，如果记录过就直接返回对应的索引
    
3.  通过调用函数 `add_closure_var` 在 `s` 的 `closure_var` 上记录闭包变量信息 `is_local` 为 `TRUE`
    

再看 `fd` 为 `s` 祖先的情况：

1.  在位置 1 中将 `s` 替换为 `s->parent` 并继续调用 `get_closure_var2` 并设置 `is_local = FALSE;`
    
2.  步骤 2 是检查闭包变量是否已经记录过，如果记录过就直接返回对应的索引
    
3.  通过调用函数 `add_closure_var` 在 `s` 的 `closure_var` 上记录闭包变量信息 `is_local` 为 `FALSE`
    

我们可以结合一个例子来理解，假设函数定义的嵌套情况如下：

    f1 <- f2 <- f3 ... <- f_n-2 <- f_n-1 <- fn
    
    `<-` 可以读作「被定义于」
    

如果 `f1` 中使用了某个变量 `a`，而 `a` 是 `f2` 的本地变量，则:

*   `f1` 的 `closure_var` 上会记录 `a` 的捕获信息，并且 `is_local` 为 `TRUE`

如果 `f1` 中使用了某个变量 `a` 但 `a` 并不属于 `f_n-1` 中任何一个的本地变量，而是属于 `f_n` 的本地变量，那么：

*   在 `[f1, f_n-2]` 上都记录 `a` 的捕获信息，并且 `is_local` 为 `FALSE`
    
*   在 `f_n-1` 上记录 `a` 的捕获信息，并且 `is_local` 为 `TRUE`
    

结合例子我们也可以反推出来 `is_local` 标记的是被捕获变量是否属于父级函数的本地变量，换句话说，该变量在运行时处于活动调用栈帧的操作数栈中。

很明显，由于该变量被内层函数捕获了，所以在结束该函数的调用时，需要对该变量进行特殊处理（通过 `is_local` 进行标记），而不是简单的释放。

捕获变量的信息记录之后，指令生成的逻辑就相对简单，以上面提到的 `has_idx:` 为例：

        has_idx:
          // ...
          switch (op) {
          // ...
          case OP_scope_get_var_undef:
          case OP_scope_get_var:
          case OP_scope_put_var:
          case OP_scope_put_var_init:
            is_put = (op == OP_scope_put_var || op == OP_scope_put_var_init);
            // 1
            if (is_put) {
              if (s->closure_var[idx].is_lexical) {
                // ...
              } else {
                dbuf_putc(bc, OP_put_var_ref);
              }
            } else {
              if (s->closure_var[idx].is_lexical) {
                dbuf_putc(bc, OP_get_var_ref_check);
              } else {
                dbuf_putc(bc, OP_get_var_ref);
              }
            }
            // 2
            dbuf_put_u16(bc, idx);
            break;
          }
    

*   首先在位置 `1` 处根据变量操作的读写类型，生成对应的操作闭包变量的指令
    
*   闭包变量的操作指令参数为闭包变量的索引，会在位置 `2` 写到代码段中。`idx` 即为上文记录的闭包变量的索引
    

小结
--

本节我们介绍了闭包指令的生成方式，值得留意的内容为：

*   函数和闭包并不等价，闭包是函数对象与被其捕获的变量的结合体，引擎出于性能角度考虑，在内存结构上将被捕获的变量直接存放在了函数对象上
    
*   由于引擎从左往右、从上往下的解析特点，遇到变量引用时，无法通过一次解析确定变量的作用域，当然也就是无法确定变量是否需要被捕获，通过两次解析解决该问题：
    
    *   首先在 Phase 1 中的解析，分析 JS 源码，在输出的指令序列中，使用诸如 `OP_scope_get_var` 的占位指令，其指令参数中包含了对变量的引用信息：变量名，引用发生的作用域等
        
    *   其次在 Phase 1 也生成了符号表，记录了变量的定义信息
        
    *   到了 Phase 2 中，再次处理诸如 `OP_scope_get_var` 的占位指令，结合指令参数与符号表中的变量定义信息，生成实际的运行时对变量进行操作的指令