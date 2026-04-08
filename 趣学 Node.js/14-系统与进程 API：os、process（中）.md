（续）`process`
------------

说到做到，上一章 `process` 还剩俩货没讲。

1.  `process.env`；
2.  `uncaughtException`。

### `process.env`

这是很常用的内容——环境变量。首先，我能直接上结论，Node.js 的环境变量能力来自 libuv。libuv 有一系列 API 叫 `uv_os_getenv()`、`uv_os_setenv()`、`uv_os_unsetenv()`。明明系统直接有获取环境变量的 API，为什么 libuv 要自己包一层呢？因为它要跨平台。

在 UNIX 类的系统（包括 macOS）中，获取环境变量的 API 是 [getenv()](https://man7.org/linux/man-pages/man3/getenv.3.html "https://man7.org/linux/man-pages/man3/getenv.3.html")；在 Windows 下，该 API 则是 [GetEnvironmentVariableW()](https://learn.microsoft.com/en-us/windows/win32/api/processenv/nf-processenv-getenvironmentvariablew "https://learn.microsoft.com/en-us/windows/win32/api/processenv/nf-processenv-getenvironmentvariablew")。

#### `uv_os_getenv()`

在 libuv 中，获取环境变量的 API 分为成功和失败两种状态。如果是因为传进来的 Buffer 长度不足以盘下对应环境变量值，则返回“长度不够”的错误。这么设计是为了 Node.js 获取的时候，可以先“快速获取”，获取失败了再用慢速模式。

    int uv_os_getenv(const char* name, char* buffer, size_t* size) {
      char* var;
      size_t len;
    
      if (name == NULL || buffer == NULL || size == NULL || *size == 0)
        return UV_EINVAL;
    
      var = getenv(name);
    
      if (var == NULL)
        return UV_ENOENT;
    
      len = strlen(var);
    
      if (len >= *size) {
        *size = len + 1;
        return UV_ENOBUFS;
      }
    
      memcpy(buffer, var, len + 1);
      *size = len;
    
      return 0;
    }
    

很好理解，先判断各参数是否合法，即 `if (name == NULL ...)`，不合法则返回 `UV_EINVAL`。然后就是直接通过 `getenv(name)` 获取环境变量复制给 `var`。如果得到的是 `NULL`，则说明该环境变量不存在，返回 `UV_ENOENT`；然后判断对应环境变量值的长度是否能被 `buffer` 的长度吃下，不够长则返回 `UV_ENOBUFS`，且把应该的长度通过修改 `size` 指针对应的值传回外面；最后，将获取的环境变量的值拷贝到 `buffer` 中，返回 `0` 以代表成功。

#### `process.env` 获取环境变量的核心科技

我们看到，`uv_os_getenv()` 的返回值中分四种：

*   `UV_EINVAL`：参数不合法；
*   `UV_ENOENT`：没有该环境变量；
*   `UV_ENOBUFS`：Buffer 长度不够；
*   `0`：成功。

前面两种错误不用解释了，第三个错误 `UV_ENOBUFS` 在 Node.js 的获取变量中有妙用。在这里要给大家讲解一下堆内存与栈内存。

##### 堆内存与栈内存

在 C++ 中，堆内存和栈内存都是用来分配存储空间的。但是它们的分配和释放方式不同，因此它们的性能也有所不同。

栈内存分配和释放是由编译器自动完成的，开发者无需手动管理。栈是一段连续的内存空间，通常是在程序运行时就已经被分配好了，栈中的变量通常是以静态方式分配的，所以它们的分配和释放速度非常快，几乎是瞬间完成的。

相比之下，堆内存需要开发者手动管理。堆内存的分配和释放需要调用相应的函数，例如 `new` 和 `delete`。堆内存的分配和释放速度通常比栈内存慢，因为它们涉及到动态内存分配和释放，需要一定的时间来完成。

另外，堆内存的分配和释放还可能会导致内存碎片问题，因为堆内存中分配的空间通常是不连续的，这可能会导致分配失败或者降低分配速度。

综上所述，在分配和释放相同大小的内存块时，栈内存的分配和释放速度通常比堆内存快。但是，在处理大量或者动态大小的数据时，堆内存的动态分配和释放能够提供更好的灵活性和效率。

##### `MaybeStackBuffer`

这是个在 Node.js 中比较基本的类，直译过来就是“可能是栈上的 Buffer”。为什么是可能呢？我们前面介绍了堆内存和栈内存。栈内存的分配和释放是自动的，且高效，但缺点是长度固定，且不宜过长；而堆内存则相反，效率没那么高，但是可变长。

它的常用用法就是，先在栈上分配小而定长的 Buffer，高效。一旦发现长度不够了，就再分配一块够长的堆内存兜底。

给 `MaybeStackBuffer` 几种通俗的比喻就是：

1.  **可能没放大招的奥特曼：** 打怪兽的时候，赤手空拳打打就好了，省体力，能打死最好；如果打不死了，彩色计时器变红了，才放个大招兜个底；

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09503d64e15442528cb9a80ed38d29d6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=848&h=839&s=544803&e=png&b=6d7f9d)

2.  **可能是主角成长路上的经验宝宝：** 通常反派打主角的时候，都是随便叫个阿猫阿狗来打，反派 Boss 也是很忙的，先叫个低成本的人来打打，能打死主角最好了；如果被主角反杀了，才派个更高级别的人来。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93c6aff0255646deba16bcb755e14bd2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=437&h=457&s=211937&e=png&b=242c15)

3.  **增程式绿牌车：** 日常时候先开电，便宜；在高速上没电，又来不及充电的时候，增程器顶上，就是油贵了点。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59b008019bb246fb86dfa10aed977cf5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=191&h=194&s=37967&e=png&b=fcf9f8)

这几种比喻，加上 `MaybeStackBuffer` 本身，都有一个共性，就是先用低成本的方案上；低成本方案行不通再用高成本方案。虽然这种做法在奥特曼和反派身上经常不奏效，但是 `MaybeStackBuffer` 却挺管用的。

篇幅原因，代码就不上了，有兴趣可自行[阅读源码](https://github.com/nodejs/node/blob/v18.15.0/src/util.h#L368-L494 "https://github.com/nodejs/node/blob/v18.15.0/src/util.h#L368-L494")。这是一个 C++ 模板类，实现原理是，成员变量中有一个指定长度的数组，它就是一个栈内存，以及一个指针，该指针默认情况下为栈内存首地址。当需要变更长度时，用 `realloc` 分配一块新长度的堆内存，赋值给指针。使用这个 `Buffer` 的时候，只要返回指针即可。

##### 赤手空拳打不过，上斯派修姆光线

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d5787456c4a407ea83d5c5e0596b2aa~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=640&h=447&s=235135&e=png&b=6f97bb)

讲了 `MaybeStackBuffer`，我们看看它在 `process.env` 中究竟怎么起作用吧。

    Maybe<std::string> RealEnvStore::Get(const char* key) const {
      Mutex::ScopedLock lock(per_process::env_var_mutex);
    
      size_t init_sz = 256;
      MaybeStackBuffer<char, 256> val;
      int ret = uv_os_getenv(key, *val, &init_sz);
    
      if (ret == UV_ENOBUFS) {
        // Buffer is not large enough, reallocate to the updated init_sz
        // and fetch env value again.
        val.AllocateSufficientStorage(init_sz);
        ret = uv_os_getenv(key, *val, &init_sz);
      }
    
      if (ret >= 0) {  // Env key value fetch success.
        return Just(std::string(*val, init_sz));
      }
    
      return Nothing<std::string>();
    }
    

前面的代码不重要，我们从第五行开始看。它声明了一个 `MaybeStackBuffer<char, 256>`，意为初始 Buffer 的栈内存大小为 `256` 个字符。我们之前说奥特曼的赤手空拳通常不管用，但是这里的 `256` 基本上可以满足大部分环境变量长度需求了。有了这个 Buffer 后，我们将其传入 `uv_os_getenv()` 去获取对应环境变量的值。

然后第八行代码，如果取值失败且错误码为 `UV_ENOBUFS`，则说明刚才的赤手空拳不管用了。此时 `init_sz` 被 `uv_os_getenv()` 函数内部改成了真正够长的长度——比如 `4000` 厘米。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f4e74362e134001abe2f4d96868d4bc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1076&h=726&s=311945&e=png&b=fcfcfc)

这个时候就需要这个 `MaybeStackBuffer` 变量通过 `AllocateSufficientStorage()` 来重新申请一块 `4000` 长度的堆内存，性能稍微慢了点。内存申请好了之后，通过 `uv_os_getenv()` 再来一遍。这里的 `AllocateSufficientStorage()` 就相当于开始释放斯派修姆光线了。

最后，该返回什么返回什么。

#### `process.env` 这个对象

说到 `process.env`，不得不说 V8 里面的一个概念——拦截器（Interceptor），它会为一整个对象的任意字段访问进行拦截。V8 里面有两类拦截器：

1.  **映射型拦截器（Named Property Interceptor）** ：当对于一个对象内成员的访问方式是字符串型的属性名时，映射型拦截器就会生效。举个例子，在 Chrome 浏览器中，文档中的一些访问就是映射型拦截器，如：`document.theFormName.elementName`；
2.  **索引型拦截器（Inedexed Property Interceptor）** ：与映射型拦截器不同，索引型拦截器的访问与数组类似，通过整型下标来对内容进行访问。还是例子，在 Chrome 浏览器中，`document.forms.elements[0]` 这种形式的访问就是索引型拦截器的一种体现。

更多关于拦截器的概念，可以阅读 [V8 的文档](https://v8.dev/docs/embed#interceptors "https://v8.dev/docs/embed#interceptors")，也可以买一本《Node.js：来一打 C++ 扩展》支持下小可怜。

拦截器就像是一个 JavaScript 的 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy")。在 V8 中对一个拦截器来说，我们需要实现它的：

1.  Getter：获取，类似 `foo.bar`；
    
2.  Setter：设置，类似 `foo.bar = baz`；
    
3.  Query：得到某字段是否只读、不可删除；
    
4.  Deleter：删除，类似 `delete foo.bar`；
    
5.  Enumerator：迭代时得到的 `key` 数组，类似 `for...in`；
    
6.  Definer：定义，类似 `Object.defineProperty()`；
    
7.  Descriptor：获取 descriptor，类似 `Object.etOwnPropertyDescriptor()`。
    

后面几项是可选的。而 Node.js 的 `process.env` 中，则实现了 1-6。举个例子，它的 Getter 是这么写的：

    static void EnvGetter(Local<Name> property,
                          const PropertyCallbackInfo<Value>& info) {
      Environment* env = Environment::GetCurrent(info);
      CHECK(env->has_run_bootstrapping_code());
      if (property->IsSymbol()) {
        return info.GetReturnValue().SetUndefined();
      }
      CHECK(property->IsString());
      MaybeLocal<String> value_string =
          env->env_vars()->Get(env->isolate(), property.As<String>());
      if (!value_string.IsEmpty()) {
        info.GetReturnValue().Set(value_string.ToLocalChecked());
      }
    }
    

前面的代码不重要，主要就是 `MaybeLocal<String> value_string` 被赋的值。它是从 `env->env_vars()->Get()` 赋值的，最终流转到前面讲的 `RealEnvStore::Get()`。所以 `process.env` 拦截器的 Getter 做的事就是，拿到对应的 `name`，并通过 `RealEnvStore::Get()` 获取对应 `name` 的环境变量值，返回。

Setter 最终则是通过 `uv_os_setenv()` 来达到 `process.env.foo = bar` 设置环境变量的效果。Deleter 通过 `uv_os_unsetenv()` 来达到 `delete process.env.foo` 删除环境变量的效果；Enumerator 则是通过 [uv\_os\_environ()](https://docs.libuv.org/en/v1.x/misc.html#c.uv_os_environ "https://docs.libuv.org/en/v1.x/misc.html#c.uv_os_environ") 获取每个环境变量的键名；Definer 则通过前面这几个函数来做一些描述符定义操作。具体代码就补贴了，有兴趣可自行阅读一下 [node\_env\_var.cc](https://github.com/nodejs/node/blob/v18.15.0/src/node_env_var.cc "https://github.com/nodejs/node/blob/v18.15.0/src/node_env_var.cc")。

最后，Node.js 将这些实现好的拦截相关函数一并给到这个 `process.env` “对象”的映射型拦截器中。

### `uncaughtException`

这是 Node.js 中很重要的两个错误处理事件。虽然我经常不大建议大家使用，但毕竟万事无绝对嘛。

> 业界有一种“let it crash”思想，很多编程语言中，都会将其奉行为设计哲学，其源于 Erlang/Elixir。 Let it crash 是指工程师不必过分担心未知的错误，而去进行面面俱到的防御性编码。
> 
> 在未知状态下，通过这个事件捕获 `uncaughtException`，从而让进程继续执行，很有可能让进程跑在一个不可预估的状态中。还不如直接让它挂掉，让守护进程重启一个。
> 
> 不过这仅代表我个人观点。就跟诡秘一样，虽然刀了一点，但是受污染的超凡者只能是被毁灭，否则它处于一个失控状态，可能带来更严重的后果。——“原来,原来我已经变成了怪物……”“我们既是守护者，也是一群时刻对抗着疯狂与失控的可怜虫。”

\> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c40d67bce2ca4bb2beb3a51601c14cbd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1024&h=1024&s=43940&e=jpg&b=010101)

#### `v8::Isolate::AddMessageListenerWithErrorLevel()`

虽然不建议大家在生产环境使用，但原理还是可以说一下的。这一切都源自于 V8 里 `Isolate` 的一个方法——`AddMessageListenerWithErrorLevel()`。

> 在 Node.js v16.x 的时候，用的还是 `AddMessageListener()`，但作用差不多。

我们可以通过这个函数往 `Isolate` 中添加回调函数，用于在 JavaScript 代码中捕获和处理错误消息。Node.js 在初始化的时候，为[其添加了回调函数](https://github.com/nodejs/node/blob/v18.15.0/src/api/environment.cc#L238-L241 "https://github.com/nodejs/node/blob/v18.15.0/src/api/environment.cc#L238-L241")。而这个回调函数最终会调用一个[叫 TriggerUncaughtException() 的函数](https://github.com/nodejs/node/blob/v18.15.0/src/node_errors.cc#L1060-L1152 "https://github.com/nodejs/node/blob/v18.15.0/src/node_errors.cc#L1060-L1152")，这里就会触发对应事件了。

当 V8 捕获到一个没有被处理的错误时（如当前作用域下没有 `try-catch`），就会触发上面的 `TriggerUncaughtException` 回调。所以这个语义上就是一个 Node.js 中的 Uncaught Exception。

**下面代码不重要，扫一眼就好。** 重要的是注释，放代码是为了让大家更有体感，没必要本末倒置。不放么，可能大家又会觉得太抽象。

    void TriggerUncaughtException(Isolate* isolate,
                                  Local<Value> error,
                                  Local<Message> message,
                                  bool from_promise) {
      // 代码看不懂不重要，看注释。
      ...
    
      // 下面几行意思是拿到 `process._fatalException` 函数。
      Local<Object> process_object = env->process_object();
      Local<String> fatal_exception_string = env->fatal_exception_string();
      Local<Value> fatal_exception_function =
          process_object->Get(env->context(),
                              fatal_exception_string).ToLocalChecked();
    
      // 如果 `process._fatalException` 不是个函数，直接崩溃。
      if (!fatal_exception_function->IsFunction()) {
        ReportFatalException(
            env, error, message, EnhanceFatalException::kDontEnhance);
        env->Exit(6);
        return;
      }
    
      MaybeLocal<Value> maybe_handled;
      if (env->can_call_into_js()) {
        // 为下面几行代码进行 `try-catch`，模式为 `kFatal`，也就是说，如果有错误被 `catch` 了，
        // 则在 `catch` 代码块里直接崩溃。类似：
        //
        // ```
        //  try {
        //    // ...
        //  } catch (e) {
        //    报错;
        //    崩溃;
        //  }
        errors::TryCatchScope try_catch(env,
                                        errors::TryCatchScope::CatchMode::kFatal);
        // 在 `try` 中执行 `process._fatalException(error, <错误是否来自 Promise>)`.
        try_catch.SetVerbose(false);
        Local<Value> argv[2] = { error,
                                 Boolean::New(env->isolate(), from_promise) };
    
        maybe_handled = fatal_exception_function.As<Function>()->Call(
            env->context(), process_object, arraysize(argv), argv);
      }
    
      Local<Value> handled;
      if (!maybe_handled.ToLocal(&handled)) {
        return;
      }
    
      // 如果 `process._fatalException()` 返回结果为非 `false`，则不做任何处理。
      if (!handled->IsFalse()) {
        return;
      }
    
      // 否则，报告错误，并崩溃。
      ReportFatalException(env, error, message, EnhanceFatalException::kEnhance);
      RunAtExit(env);
    
      Local<String> exit_code = env->exit_code_string();
      Local<Value> code;
      if (process_object->Get(env->context(), exit_code).ToLocal(&code) &&
          code->IsInt32()) {
        env->Exit(code.As<Int32>()->Value());
      } else {
        env->Exit(1);
      }
    }
    

把注释提取出来，翻译成 JavaScript 伪代码，大概就是：

    function triggerUncaughtException(error, fromPromise) {
      const fatalExceptionFunction = process._fatalException;
      if (typeof fatalExceptionFunction !== 'function') {
        reportFatalException(error);
        process.exit(6);
      }
    
      let handled;
      try {
        handled = fatalExceptionFunction(error, fromPromise);
      } catch (e) {
        reportFatalException(e);
        process.exit(7);
      }
      
      if (handled !== false) return;
      
      reportFatalException(error);
      runAtExit();
      process.exit(process.exitCode);
    }
    

这里面分三种情况：

1.  “异常”崩溃；
2.  “正常”崩溃；
3.  正常执行。

其中，`process._fatalException` 被恶作剧替换成非函数了，或者 `process._fatalException` 自身出问题了，就是“异常崩溃”；若是 `process._fatalException()` 函数执行结果告知要崩溃，即该函数返回 `false` 值，就是“正常崩溃”；剩下的就是正常执行了。

![15流程图1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a916e61fb5e4da7a683835614168de5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1090&h=1256&s=167283&e=png&b=ffffff)

至于“输出异常”所对应的 [ReportFatalException()](https://github.com/nodejs/node/blob/v18.15.0/src/node_errors.cc#L319-L468 "https://github.com/nodejs/node/blob/v18.15.0/src/node_errors.cc#L319-L468")，篇幅不够，我就不拉出来讲了。它大概得作用就是，从 V8 给的信息中把错误对象的错误对象产生的文件地址、行号、列号拿出来，并输出文件地址和错误行所在的代码，根据列号算出上箭头的位置，并输出这几行，就像这样：

    /foo/bar.js:2
      throw new Error('123');
      ^
    

接着输出错误信息，就像这样：

    Error: 123
    

最后，输出错误堆栈：

        at Object.<anonymous> (/foo/bar.js:2:9)
        at Module._compile (node:internal/modules/cjs/loader:1155:14)
        at Object.Module._extensions..js (node:internal/modules/cjs/loader:1209:10)
        at Module.load (node:internal/modules/cjs/loader:1033:32)
        at Function.Module._load (node:internal/modules/cjs/loader:868:12)
        at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    

#### `process._fatalException`

从上一节中，我们能看到，最终处理 Uncaught Exception 的是 `process._fatalException` 函数。

> 这个函数本该是一个私有函数的，但由于早期 Node.js 版本未做充分设计和考虑，仅将其以下划线为开头命名挂在了 `process` 下。虽然文档中未提及这个“私有变量”，但总有调皮的开发者拿它做一些 Hack 的事情。如果后续版本的 Node.js 中将它藏起来，那么，可能很多业务就没法正常跑了——考虑到向下兼容性。所以，`process._fatalException` 便一直保留下来了。

`process._fatalException` 是在 Node.js 的 [Bootstrap 阶段](https://github.com/nodejs/node/blob/v18.15.0/lib/internal/bootstrap/node.js#L315-L333 "https://github.com/nodejs/node/blob/v18.15.0/lib/internal/bootstrap/node.js#L315-L333")设置的。

    process._fatalException = onGlobalUncaughtException;
    

而这个 `onGlobalUncaughtException` 是被 `createOnGlobalUncaughtException` 创建出来的。看看这里面是什么吧。

    function createOnGlobalUncaughtException() {
      return (er, fromPromise) => {
        ...
    
        const type = fromPromise ? 'unhandledRejection' : 'uncaughtException';
        ...
        if (exceptionHandlerState.captureFn !== null) {
          exceptionHandlerState.captureFn(er);
        } else if (!process.emit('uncaughtException', er, type)) {
          // If someone handled it, then great. Otherwise, die in C++ land
          // since that means that we'll exit the process, emit the 'exit' event.
          try {
            if (!process._exiting) {
              process._exiting = true;
              process.exitCode = 1;
              process.emit('exit', 1);
            }
          } catch {
            // Nothing to be done about it at this point.
          }
          return false;
        }
    
        ...
    
        return true;
      };
    }
    

看！参数对上了！第一个是 `er`，第二个就是 `fromPromise` 了。这个函数里面，错误类型根据 `fromPromise` 而定，若是从 `Promise` 而来，则触发 `unhandledRejection`，否则触发 `uncaughtException`。

![15流程图2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd3495ec678f49e995a8095d854066b0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1046&h=740&s=162198&e=png&b=ffffff)

当你没有手动监听 `unhandledrejection` 时，若触发了对应的 rejection，那么 V8 一样会触发这个函数。这个时候 `fromPomise` 就为 `true` 了。

>     process.on('unhandledRejection', (reason, p) => {
>       console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
>     });
>     
>     process.on('uncaughtException', (err, type) => {
>       console.log('Uncaught Exception thrown');
>       console.log(err.stack, type);
>     });
>     
>     Promise.reject(new Error('Explosion!'));
>     
> 
> 比如上面这段代码，我们执行的时候，会走到 `unhandledRejection` 事件。但当我们删掉这三行代码，再执行的时候，Node.js 就会走进 `uncaughtException` 事件，并且对应的 `type` 是 `unhandledRejection`。至于上面三行的 `unhandledRejection` 事件是怎么触发的，篇幅原因就不讲了，通过 V8 的 `Isolate::SetPromiseRejectCallback`，反正大同小异。

然后就是判断 `exceptionHandlerState.captureFn`。这是会在 `process.setUncaughtExceptionCaptureCallback()` 中被设置的内容。这个 API 不是很常用，我也是第一次看到🤣。

总之多看[文档](https://nodejs.org/dist/latest-v18.x/docs/api/process.html#processsetuncaughtexceptioncapturecallbackfn "https://nodejs.org/dist/latest-v18.x/docs/api/process.html#processsetuncaughtexceptioncapturecallbackfn")没坏处：If such a function is set, the `'uncaughtException'` event will not be emitted. If `--abort-on-uncaught-exception` was passed from the command line or set through `v8.setFlagsFromString()`, the process will not abort. Actions configured to take place on exceptions such as report generations will be affected too.

如果没有这玩意儿作祟，那就进入正题：

    if (!process.emit('uncaughtException', er, type)) {
      try {
        if (!process._exiting) {
          process._exiting = true;
          process.exitCode = 1;
          process.emit('exit', 1);
        }
      } catch {
        // Nothing to be done about it at this point.
      }
      return false;
    }
    

通过 `process.emit` 触发 `uncaughtException`，将 `er` 和刚才得到的 `type` 传进去。我们来看看，`EventEmitter.prototype.emit` 的返回值吧：Returns `true` if the event had listeners, `false` otherwise.

也就是说，当我们有监听 `uncaughtException` 事件时，返回 `true`，否则返回 `false`。是不是跟上一节的 `handled` 值是否非 `false` 对上了？如果我们有监听处理，就返回 `true`，则后面不做任何事了；如果我们没有监听，那么这里会返回 `false`，后面就会输出异常，然后“正常”崩溃。

这里值得一提的是，`process.emit()` 是裸执行的，并没有在这一句上进行 `try-catch`，也就是用户监听的回调有抛错，那么会直接反映到上层函数去。这又跟之前对上了，如果在这个函数里面有任何抛错，则直接进入“异常”崩溃逻辑。

最后，`process._fatalException` 都执行完走到最后一步逻辑时，就返回 `true` 了，说明我们正常处理了 `uncaughtException` 事件，并且未产生新的异常。这个时候在上层函数表现就是——继续执行。

本章小结
----

本节为大家介绍了 `process.env` 与 `uncaughtException` 的实现。

`process.env` 对象实际上是一个类似于 `Proxy` 的劫持对象，每次获取字段时都通过 libuv 从系统中获取一遍，每次设置的时候，实际上都是通过 libuv 把为当前 Node.js 进程设置上对应环境变量。而获取环境变量值的时候，顺带着讲了一遍 `MaybeStackBuffer` 这个精神小伙，帮大家浅浅复习了一下堆内存和栈内存。`MaybeStackBuffer` 就跟奥特曼一样，不到被打惨的时候不放射线。但有时候这种方法还真挺有效的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ff3378235864f1bbfb3d30f5c41638b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=240&h=240&s=30123&e=png&b=fdfdfd)

`uncaughtException` 则是通过 V8 的 `Isolate::AddMessageListenerWithErrorLevel()` 来做的。它将真正处理 Uncaught Exception 的函数通过 `AddMessageListenerWithErrorLevel` 加到 V8 获得对应错误的回调中。当有相关错误触发时，自动会触发该回调，然后逐步最终调用到 `process.emit('uncaughtException', ...)` 上。

> 留一个实操题，大家可以写一个 JavaScript 文件，在里面可以：
> 
> 1.  把 `process._fatalException` 赋值成任意内容，然后尝试触发一个 Uncaught Exception 看看 Node.js 的退出码是多少；
> 2.  把 `process._fatalException` 替换成一个抛错的函数，再尝试触发一个 Uncaught Exception 看看 Node.js 退出码是多少；
> 3.  把 `process._fatalException` 替换成一个恒为 `true` 或 `false` 的函数，看看 Node.js 行为是什么。

下一章在 `process` 里，我会尝试向大家解释一下 Node.js 错误对象的堆栈样式是怎么来的，它为什么跟 Chrome 长得不大一样。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc5fb199c83846c483b734219c1393dc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=658&h=370&s=54312&e=png&b=faf8f8)