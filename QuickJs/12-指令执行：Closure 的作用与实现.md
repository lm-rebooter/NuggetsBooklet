闭包重要程度不言自明，它是使用 JS 时绕不开的语言功能，我们将其作为第一个介绍的高级语言特性。本节将分 3 部分讨论闭包的底层实现：

*   闭包的作用，为什么 JS 中需要引入闭包的功能
    
*   闭包的设计，作为一个高级语言特性，有哪些设计上的考虑
    
*   闭包的实现，引擎层面做了哪些工作以实现闭包的功能
    

闭包的作用
-----

相信大家在接触 JS 时经常遇到「闭包的作用是什么」这样的问题，这个问题站在不同的层面会有不同的答案：

*   在 JS 语言使用的层面，闭包的作用可以是诸如「模拟私有变量」之类
    
*   在 JS 语言设计和引擎实现的层面，闭包的作用则是「支持在词法作用域下将函数当做一等公民来使用」
    

为了解释闭包在语言设计层面的作用，我们需要先了解什么是作用域。

### 作用域

变量指代了一个内存位置应该很好理解，内存位置上保存的数据是有其生命周期的，作用域可以使得对内存数据的生命周期的描述规范化。

关于「内存数据是有生命周期的」可以这么理解：内存上保存的是应用程序的状态，就好比 React 组件的 State，它是会随着应用程序的运行而变化的，这样的变化当然就对应了底层内存数据的变化。

或者换一个角度，我们通过变量名来指代一块内存，由于内存是有限的，就需要考虑复用的问题，复用一块内存之前需要回答「这块内存是否已经失效」的问题，而作用域就是为了解答该问题。

作用域的另一个作用是可以有效地缓解变量命名时的词汇量焦虑。

常见的两种作用域为：

*   静态作用域
    
    也被称为「词法作用域」，表示变量的作用域在程序运行之前，即解析阶段就能确定。因为静态作用域直接体现在代码结构中，所以易于开发者理解，也便于引擎实现
    
*   动态作用域
    
    是指变量的作用范围需在运行阶段才能确定，相比静态作用域来说具有一些不确定性
    

我们来看一个静态作用域的例子：

    #include<stdio.h>
    
    int x = 10;
    
    int f() {
      return x;
    }
    
    int g() {
      int x = 20;
      return f();
    }
    
    int main() {
      printf("%d", g()); // 输出 10
      printf("\n");
      return 0;
    }
    

上面的代码中：

*   `f` 中的 `x` 就是全局作用域中的 `x`
    
*   `g` 中定义的 `x` 不会影响 `f` 中的 `x`
    

可见所有变量指代的内容在静态阶段都能得到解释，作为对比，我们再看一个动态作用域的例子：

    int x = 10;
    
    int f() {
      return x;
    }
    
    int g() {
      int x = 20;
      return f();
    }
    
    main() {
      printf(g()); // 输出 20
    }
    

_上述为伪代码_

上面的代码中：

*   如何确定变量的绑定关系取决于当前的调用栈
    
*   `g` 被调用后，其调用栈帧中定义了 `x`
    
*   `f` 被调用后，其中的 `x` 则来源于 `f` 当前所处的调用栈
    

可见动态作用域在理解和实现时相对静态作用域都略显烧脑。

### 函数是一等公民

在 JS 中，函数是一等公民，表示我们可以像创建普通变量一样、创建一个函数类型的变量，比如：

    var f = function () {
      return x;
    };
    

假设现在没有闭包，我们作为开发者就需要一个规范，这个规范可以向我们解释清楚 `x` 的活动范围。于是语言标准委员会出来进行了解释。

解释的方式当然就是制定一套作用域规范，考虑到词法作用域方便理解和实现的特质，标准委员会引入了闭包的设计。之所以是「引入」，是因为闭包是一个先于 JS 出现的概念。

上文演示静态作用域时使用了一段 C 程序，可能有读者会联想到：那么 C 语言中为什么没有闭包呢？

因为从严格意义上说，C 语言中的函数并不是一等公民，也就是说我们不能够像创建其他数据类型的实例一样、在运行阶段动态的创建一个函数、并将这个函数在程序中来回传递。

当然利用汇编或者非 POSIX 中的 JUMP 类指令或者一些系统调用，能够模拟出动态创建函数的功能，但是在语言层面上，是没有直接的支持的。

闭包的设计
-----

产品的功能设计需要尽量符合直觉，编程语言也不例外，我们看看闭包是如何设计的。

### 闭包和函数对象

[Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures") 中对闭包的解释可以简单地概括为：

> A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment)

函数对象 FFF 总是可以访问到它所处的词法环境下的变量 VVV，当 VVV 离开自己的作用域时，将只能被 FFF 访问到，看起来就好像是被关到了一个封闭空间 CCC 内一样：

    function f() {
      var i = 0;
      return function f1() {
        console.log(i);
      };
    }
    
    var ff = f();
    ff();
    

比如上面的代码，当 `f` 执行后，仅可以通过 `f1` 访问到 `i`。

换句话说，函数对象都会伴随一个封闭空间 CCC（闭包），用于存放那些被 FFF 使用的 VVV。不可以笼统地理解「函数就是闭包」。

### Open binding

为了规范化描述，可以称函数中使用的非局部变量为 _open binding_，并且 _open binding_ 会在某个时刻被「关闭」到闭包内。

比如下面的例子：

    function f() {
      var i = 0;
      return function f1() {
        console.log(i);
      };
    }
    
    var ff = f();
    ff();
    

在函数 `f1` 的角度看：

*   其中的 `i` 为 _open binding_，因为其并不是 `f1` 的局部变量
    
*   _open binding_ 对应的 _binding_ 需要在其所处的词法环境中寻找
    
    比如 `f1` 中 `i` 对应的 _binding_ 为 `var i`。
    

### Binding 在作用域内

当 _open binding_ 对应的 _binding_ 未超过自己所处的词法作用域时，可以操作相同的内容：

![open_bindings](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84f7c60272448ac9d9d0db8c777a3bd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=862&h=382&e=png&b=fdfdfd)

比如下面的代码：

    function f() {
      var i = 0;
      function f1() {
        i = 1;
      }
      f1();
      console.log(i);
    }
    
    f(); // 1
    

上面的代码操作了 _open binding_，对应的 _binding_ 内容也随之而变。反之，操作 _binding_，对应的 _open binding_ 内容也随之而变：

    function f() {
      var i = 0;
      function f1() {
        return i;
      }
      i = 2;
      console.log(f1());
    }
    
    f(); // 2
    

### Binding 离开作用域

当 _binding_ 离开自己的作用域时，需要被「关闭」到将其当做 _open binding_ 的闭包中。或者反过来看，闭包会捕获那些即将离开其作用域的 _binding_。

比如本节开头的例子：

    function f() {
      var i = 0;
      return function f1() /* c */ {
        console.log(i);
      };
    }
    
    var ff = f();
    ff();
    

当 `f` 执行完毕后，`i` 就离开其作用域了，那么对应的内存应该被释放。但由于其为闭包 `c` 中的 _open binding_，所以在其离开作用域之前，会被闭包 `c` 捕获。

### Binding 共享

_binding_ 会在多个闭包中共享，这也是一个为了符合直觉的设计。

想象一下，我们在代码中发现多个 _open binding_，然后我们在代码中往上层作用域寻找，发现它们对应同一个 _binding_，那么将这个 _binding_ 设计成在这些闭包中共享，会比较容易被理解。

比如下面的代码：：

    function fns() {
      const fns = [];
      for (var i = 0; i < 10; i++) {
        fns.push(function () /* 1 */ {
          console.log(i);
        });
      }
      return fns;
    }
    fns().forEach((f) => f());
    

上面的代码中创建的函数会都打印 `10`，因为：

*   `var i` 是函数作用域的
    
*   位置 `1` 处的 _open binding_ `i` 在词法环境中寻找 _binding_ 时都对应了这一个 `var i`：
    
    ![open_bindings_multi](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc0c9cf050d246eda2e5a8b12ed6abdd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=862&h=1002&e=png&b=fdfdfd)
*   `var i` 在循环中值被修改成了 `10`
    
*   由于 `i` 是函数级别的，所以只有在函数返回时，`i` 才会被「关闭」到闭包内
    

多个闭包的捕获同一个变量并不会产生多份拷贝：

    function fns() {
      const fns = [];
      for (var i = 0; i < 10; i++) {
        fns.push(function () /* 1 */ {
          console.log(i);
        });
      }
      return [fns, () => i++];
    }
    const [fnList, fn] = fns();
    fn();
    fnList.forEach((f) => f()); // 11
    

作为对比，我们看下面的例子：

    function fns() {
      const fns = [];
      for (let i = 0; i < 10; i++) {
        fns.push(function () /* 1 */ {
          console.log(i);
        });
      }
      return fns;
    }
    fns().forEach((f) => f());
    

上面的代码会打印 `0` 到 `9`，因为：

*   `let i` 是块级作用域的
    
*   位置 `1` 处的 _open binding_ `i` 在词法环境中寻找 _binding_ 时都对应的是每次迭代中的 `i`，它们是不同的
    
*   循环迭代结束时，当次的 `i` 会离开作用域，所以在当次迭代完成前，会将 `i` 「关闭」到对应的闭包内
    

### 隐式捕获

隐式捕获是一个在使用者角度不太容易被关注到的设计，比如下面的代码：

    function f(x) /* f1 */ {
      return function (y) /* f2 */ {
        return function (z) /* f3 */ {
          console.log(x + y + z);
        };
      };
    }
    
    const xy = f(1);
    const xyz = xy(2);
    xyz(3);
    

在 `f2` 中并没有显式地捕获 `x`，但是如果不对 `x` 进行捕获的话，`f3` 执行时，`x` 的来源将无从确定。

因此隐式捕获简单来说，就是内层的闭包捕获的变量需要被外层闭包逐级地捕获

闭包的实现
-----

和大部分编程语言中的功能实现类似，闭包的实现主要分为静态和动态 2 部分：

*   静态阶段，负责收集元信息。比如收集 _open bindings_ 信息
    
*   运行阶段，结合元信息完成功能设计阶段确定的运行时的行为
    

### Open binding 元信息

在之前介绍过的存放函数的元信息的结构体 `JSFunctionBytecode` 中，有字段 `closure_var` 用于存放闭包变量的元信息：

    typedef struct JSFunctionBytecode {
      // ...
      JSClosureVar *closure_var;
      // ...
      int closure_var_count;
      // ...
    } JSFunctionBytecode;
    

`closure_var` 是一个数组，长度为 `closure_var_count`，数组元素的类型为 `JSClosureVar`：

    typedef struct JSClosureVar {
      uint8_t is_local : 1;
      uint8_t is_arg : 1;
      uint8_t is_const : 1;
      uint8_t is_lexical : 1;
      uint8_t var_kind : 4; /* see JSVarKindEnum */
      /* 8 bits available */
      uint16_t var_idx; /* is_local = TRUE: index to a normal variable of the
                      parent function. otherwise: index to a closure
                      variable of the parent function */
      JSAtom var_name;
    } JSClosureVar;
    

闭包变量即上文提到的的 _open binding_，为了保持连贯，接下来还是保持这个称呼，并简称 OB。

`JSClosureVar` 中字段对应的解释为：

*   `var_name` 顾名思义表示 OB 的变量名
    
*   这些字段表示的是 OB 对应的 _binding_ 的元信息：
    
    *   `is_local` 是父级函数中的局部变量，还是父级函数更外层的函数中定义的变量
        
    *   `is_arg` 是否来自形参列表
        
    *   `is_const` 是否使用 `const` 定义
        
    *   `is_lexical` 是否使用 `let` 或 `const` 定义，区别于 `var`
        
*   `var_idx` 则需要和 `is_local` 字段配合，如果是 `is_local` 那么 `var_idx` 表示 _binding_ 存在于父级函数的变量列表中，否则存在于父级函数的闭包变量列表中
    

比如下面的例子：

    function f(x) /* f1 */ {
      return function (y) /* f2 */ {
        return function (z) /* f3 */ {
          console.log(x + y + z);
        };
      };
    }
    
    const xy = f(1);
    const xyz = xy(2);
    xyz(3);
    

*   `f3` 的 `JSFunctionBytecode::closure_var` 中记录了 `x` 和 `y` 两个 _open binding_ 的信息
    
*   open\_bindingxopen\\\_binding\_{x}open\_bindingx​ 的 `is_local` 为 `0`，因为它不是 `f3` 的父级函数 `f2` 中定义的变量
    
*   open\_bindingyopen\\\_binding\_{y}open\_bindingy​ 的 `is_local` 为 `1`，因为它是 `f3` 的父级函数 `f2` 中定义的变量
    

上面代码对应的字节码中也包含相关信息，比如 `f3` 的字节码信息：

    tmp_test.js:3: function: <null>
      args: z
      closure vars:
        0: x parent:arg0 var
        1: y local:arg0 var
      stack_size: 4
    

*   在 `closure vars` 下的缩进表示了有 2 个 OB
    
*   `x` 不是 `is_local` 所以展示的是 `parent:`
    
*   `y` 是 `is_local` 所以展示的是 `local:`
    

类似的 `f2` 的字节码信息为：

    tmp_test.js:2: function: <null>
      args: y
      closure vars:
        0: x local:arg0 var
      stack_size: 1
    

可以看到 `f2` 中的 open\_bindingxopen\\\_binding\_{x}open\_bindingx​ 的 `is_local` 为 `1`，因为 `x` 是其父级函数 `f1` 中定义的变量。

目前只需关注静态解析时收集了哪些闭包元信息，至于如何解析将会在另外的章节中介绍。下面我看下引擎如何使用这些元信息。

### 闭包的实例化

由于闭包和函数对象是关联的，所以在创建函数对象的过程中就一并对其闭包进行了实例化，这也是函数对象实例化的指令取名 `OP_fclosure` 的原因。

指令 `OP_fclosure` 对应的操作函数为 [js\_closure](https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L816 "https://github.com/hsiaosiyuan0/slowjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L816")，其中函数对象的初始化工作又是调用的函数 [js\_closure2](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L772 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L772")：

    JSValue js_closure2(JSContext *ctx, JSValue func_obj, JSFunctionBytecode *b,
                        JSVarRef **cur_var_refs, JSStackFrame *sf) {
      JSObject *p;
      JSVarRef **var_refs;
      int i;
    
      p = JS_VALUE_GET_OBJ(func_obj);
      p->u.func.function_bytecode = b;
      p->u.func.home_object = NULL;
      p->u.func.var_refs = NULL;
      if (b->closure_var_count) { // 1
        var_refs = js_mallocz(ctx, sizeof(var_refs[0]) * b->closure_var_count);
        if (!var_refs)
          goto fail;
        p->u.func.var_refs = var_refs;
        for (i = 0; i < b->closure_var_count; i++) {
          JSClosureVar *cv = &b->closure_var[i];
          JSVarRef *var_ref;
          if (cv->is_local) {    // 2
            /* reuse the existing variable reference if it already exists */
            var_ref = get_var_ref(ctx, sf, cv->var_idx, cv->is_arg);
            if (!var_ref)
              goto fail;
          } else {               // 3
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
    

上面代码对应的解释为：

*   在位置 `1` 处，通过判断函数元信息中的闭包变量数，来决定是否需要初始化闭包，并且我们注意到内存使用的 `js_mallocz` 分配到了堆上，这不会在 `JS_CallInternal` 调用结束后自动释放
    
*   在位置 `2` 处，通过闭包变量元信息中的 `is_local` 来决定其来源是父级函数中定义的变量，还是父级函数的闭包变量
    
*   需要明确的是，调用 `js_closure2` 是在父级函数中发起的调用，所以位置 `3` 处的 `cur_var_refs` 是父级函数的闭包变量信息
    

在继续查看函数 [get\_var\_ref](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L743 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L743") 的实现之前，我们需要先了解 [JSVarRef](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L236 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/def.h#L236")：

    typedef struct JSVarRef {
      union {
        JSGCObjectHeader header; /* must come first */
        struct {
          int __gc_ref_count; /* corresponds to header.ref_count */
          uint8_t __gc_mark;  /* corresponds to header.mark/gc_obj_type */
    
          /* 0 : the JSVarRef is on the stack. header.link is an element
             of JSStackFrame.var_ref_list.
             1 : the JSVarRef is detached. header.link has the normal meaning
          */
          uint8_t is_detached : 1;
          uint8_t is_arg : 1;
          uint16_t var_idx; /* index of the corresponding function variable on
                               the stack */
        };
      };
      JSValue *pvalue; /* pointer to the value, either on the stack or
                          to 'value' */
      JSValue value;   /* used when the variable is no longer on the stack */
    } JSVarRef;
    

`JSVarRef` 表示的是 _open binding_ 对 _binding_ 的引用，其中字段 `pvalue` 即 _binding_ 表示的变量：

*   如果变量在其作用域内，即活动的，那么 `pvalue` 指向调用栈帧上的元素
    
*   如果变量离开了作用域，那么变量会被拷贝到 `JSVarRef::value` 上，并使 `pvalue` 会指向该字段
    

接着我们查看函数 `get_var_ref` 的实现：

    JSVarRef *get_var_ref(JSContext *ctx, JSStackFrame *sf, int var_idx,
                          BOOL is_arg) {
      JSVarRef *var_ref;
      struct list_head *el;
    
      // 1
      list_for_each(el, &sf->var_ref_list) {
        var_ref = list_entry(el, JSVarRef, header.link);
        if (var_ref->var_idx == var_idx && var_ref->is_arg == is_arg) {
          var_ref->header.ref_count++;
          return var_ref;
        }
      }
      /* create a new one */
      var_ref = js_malloc(ctx, sizeof(JSVarRef));
      if (!var_ref)
        return NULL;
      var_ref->header.ref_count = 1;
      var_ref->is_detached = FALSE;
      var_ref->is_arg = is_arg;
      var_ref->var_idx = var_idx;
      list_add_tail(&var_ref->header.link, &sf->var_ref_list);
      // 2
      if (is_arg)
        var_ref->pvalue = &sf->arg_buf[var_idx];
      else
        var_ref->pvalue = &sf->var_buf[var_idx];
      var_ref->value = JS_UNDEFINED;
      return var_ref;
    }
    

上面的代码可以通过下图来演示：

![var_ref](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8985b45ea9524f3bb4aafed1889c2200~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1262&h=1552&e=png&b=fbf9f9)

对应的解释为：

*   `args` 的虚线表示，当实参个数少于形参数，或者调用时指定了 [flags](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L23 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L23") 为`JS_CALL_FLAG_COPY_ARGV` 时，会将实参拷贝到调用栈中，放置在 `local_buf` 最前面
    
*   参数 `sf` 是当前父级函数的调用栈帧。子函数的 _open binding_ 对应的 _binding_ 如果是父级函数中定义的变量，那么这样的引用关系就会存在父级函数的 `JSStackFrame::var_ref_list`
    
    如果多个子函数的 _open binding_ 如果对应相同的 _binding_，那么它们应该使用相同的引用关系（前一章中的「Binding 共享」）。因此位置 `1` 处会先尝试复用已经创建的引用关系。
    
*   位置 `2` 处则是将 `JSVarRef::pvalue` 指向了当前调用栈帧上的元素，这是因为这些 _binding_ 还在其作用域内，需要让父级函数对象和子函数对象都可以操作该变量
    

关闭闭包变量
------

前一章节中我们提到，当 _binding_ 离开作用时，它需要被那些将其作为 _open binding_ 的闭包所捕获，对应到引擎中的实现可以分为 2 步：

*   将 `JSVarRef::pvalue` 指向的内容拷贝到 `JSVarRef::value`
    
*   将 `JSVarRef::pvalue` 指向 `JSVarRef::value`
    

我们看看上面的动作发生的时机是怎样的。

### var

首先是对于使用 `var` 定义的变量，由于其属于函数作用域，它离开作用域的时机在函数调用结束时：

    JSValue JS_CallInternal(JSContext *caller_ctx, JSValueConst func_obj,
                     JSValueConst this_obj, JSValueConst new_target,
                     int argc, JSValue *argv, int flags) {
    // ...
      done:
        if (unlikely(!list_empty(&sf->var_ref_list))) {
          /* variable references reference the stack: must close them */
          close_var_refs(rt, sf);
    // ...
    }
    

函数 [close\_var\_refs](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L867 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L867") 看名字像是执行了「关闭」操作，我们看看其实现：

    void close_var_refs(JSRuntime *rt, JSStackFrame *sf) {
      struct list_head *el, *el1;
      JSVarRef *var_ref;
      int var_idx;
    
      list_for_each_safe(el, el1, &sf->var_ref_list) {
        var_ref = list_entry(el, JSVarRef, header.link);
        var_idx = var_ref->var_idx;
        // 1
        if (var_ref->is_arg)
          var_ref->value = JS_DupValueRT(rt, sf->arg_buf[var_idx]);
        else
          var_ref->value = JS_DupValueRT(rt, sf->var_buf[var_idx]);
        // 2
        var_ref->pvalue = &var_ref->value;
        /* the reference is no longer to a local variable */
        var_ref->is_detached = TRUE;
        // 3
        add_gc_object(rt, &var_ref->header, JS_GC_OBJ_TYPE_VAR_REF);
      }
    }
    

上面的代码对应的解释为：

*   首先在位置 `1` 处将引用的调用栈上的变量拷贝到了 `JSVarRef::value` 上
    
*   然后再位置 `2` 处将 `JSVarRef::pvalue` 指向 `JSVarRef::value`，这样使得变量的「关闭」操作对 `pvalue` 使用方来说是透明的
    
*   最后在位置 `3` 处将 `JSVarRef` 实例加入到 GC 对象列表中。这些变量被「关闭」是因为被内层的函数对象所使用，换句话说它们的生命周期被延长了，加入到 GC 对象列表中让 GC 自动管理这部分内存 - 等到不再被任何内层函数对象所使用时再进行释放
    

### let、const

`let` 和 `const` 定义的变量是块级作用域的，为了理解引擎如何「关闭」这些变量，我们看看下面代码对应的字节码：

    function f() {
      const fns = [];
      for (let i = 0; i < 10; i++) {
        fns.push(() => console.log(i));
      }
    }
    

对应的字节码序列为：

    get_field2 push
    fclosure8 0: [bytecode <null>]
    call_method 1
    drop
    close_loc 1: i
    

可以发现指令 `OP_close_loc` 似乎是完成了「关闭」操作，其对应的操作函数为 [close\_lexical\_var](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L886 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L886")：

    void close_lexical_var(JSContext *ctx, JSStackFrame *sf, int idx, int is_arg) {
      struct list_head *el, *el1;
      JSVarRef *var_ref;
      int var_idx = idx;
    
      list_for_each_safe(el, el1, &sf->var_ref_list) {
        var_ref = list_entry(el, JSVarRef, header.link);
        if (var_idx == var_ref->var_idx && var_ref->is_arg == is_arg) {
          var_ref->value = JS_DupValue(ctx, sf->var_buf[var_idx]);
          var_ref->pvalue = &var_ref->value;
          list_del(&var_ref->header.link);
          /* the reference is no longer to a local variable */
          var_ref->is_detached = TRUE;
          add_gc_object(ctx->rt, &var_ref->header, JS_GC_OBJ_TYPE_VAR_REF);
        }
      }
    }
    

目前的引擎实现中，`is_arg` 传参恒为 `FALSE`。可以发现函数内容和 `close_var_refs` 基本一致。

指令 `OP_close_loc` 的位置依赖静态阶段的分析，会在块级作用域的变量离开作用域时插入该指令。

小结
--

*   站在语言设计和引擎实现的角度，闭包的作用是支持在词法作用域下将函数当做一等公民来使用
    
*   `JSFunctionBytecode::closure_var` 中记录了当前函数中 _open binding_ 对外层的 _binding_ 的引用信息：
    
    *   `JSClosureVar::is_local` 为 `TRUE`，存在于外层函数的调用栈中
        
    *   `JSClosureVar::is_local` 为 `FALSE`，存在于外层函数对象的 `JSObject::u::func::var_refs` 中
        
*   在实例化内层函数对象时，会一并初始化其关联的闭包的信息。该操作发生时，当前调用栈为父级函数调用栈，当前函数对象为父级函数对象：
    
    *   `JSClosureVar::is_local` 为 `TRUE`，则从当前调用栈的 `JSStackFrame::var_ref_list` 获取或者创建（堆内存）引用关系 `JSVarRef`，添加到 `JSObject::u::func::var_refs` 中
        
    *   `JSClosureVar::is_local` 为 `FALSE`，则从当前函数对象的闭包变量列表 `JSObject::u::func::var_refs` 获取引用关系 `JSVarRef`，添加到 `JSObject::u::func::var_refs` 中（引用计数加 1）
        
*   对于函数级别的变量来说，会在调用结束前通过调用 `close_var_refs` 函数完成变量的「关闭」操作
    
*   对于块级作用域的变量来说，则需要通过解析期间的分析，插入指令 `OP_close_loc` 完成变量的「关闭」操作
    
*   对于存在于父级函数的 `JSObject::u::func::var_refs` 中的闭包变量来说，「关闭」无需额外的操作
    
*   对于存在于父级函数调用栈中的变量，其「关闭」操作可以分 3 步：
    
    *   将引用的调用栈上的变量拷贝到 `JSVarRef::value` 上
        
    *   将 `JSVarRef::pvalue` 指向 `JSVarRef::value`
        
    *   将 `JSVarRef` 加入到 GC 对象列表中
        

现在我们理解了闭包作为一个高级语言特性的底层实现方式，相信这样由内向外的视角会让大家对闭包的理解更进一步。