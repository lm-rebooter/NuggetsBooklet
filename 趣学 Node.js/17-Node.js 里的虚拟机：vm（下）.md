![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33db43ba8cc84c77af3aa5be8eed1c97~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=225&h=225&s=37645&e=png&b=363a31)

下面，我们来讲讲 `vm` 里面的 `Script` 吧。

脚本——`Script`
------------

`vm` 两个重要的概念，一个是上下文，另一个就是 `Script` 了。在这里，有几个概念需要区分：

1.  V8 的 `Script`；
2.  Node.js 的 `ContextifyScript`；
3.  Node.js 的 `Script`。

### 三个概念

#### V8 的 `Script`

在 V8 中，`Script` 代表一段 JavaScript 代码。它包含了源代码以及相关的上下文（V8 `Context`），用于在特定的执行环境中运行。`Script` 的主要目的是解析、编译、执行 JavaScript 代码，并与其关联的 V8 `Context` 进行交互。

在 V8 中，`Script` 被实现为一个独立的对象，关于它，我们需要了解几个事情。

1.  **源代码：** `Script` 对象存储了与其关联的 JavaScript 源代码。这是一个字符串，可以在创建 `Script` 对象时提供；
    
2.  **上下文：** `Script` 对象关联了一个 V8 `Context`，这是它将在其中执行的执行环境。`Context` 包含了所有与该环境相关的全局对象、函数和变量；
    
3.  **编译和执行：** V8 引擎会在运行 `Script` 之前先对其进行解析和编译。这会将 JavaScript 代码转换为可执行的字节码，从而实现高效的代码执行。编译过程可能会涉及到内联缓存（Inline Caching）和即时编译（JIT）等优化技术。在编译完成后，V8 会执行 `Script`，将其与关联的 `Context` 进行交互，以获取或修改全局变量、调用函数等。
    
4.  **错误处理：** V8 提供了一系列错误处理机制，用于捕获和处理在 Script 执行过程中可能出现的异常。例如，可以使用 try-catch 语句捕获异常，或使用 Promise 进行异步错误处理。
    

总之，在 V8 引擎中，Script 代表一段 JavaScript 代码及其关联的执行环境。它负责管理代码的解析、编译、执行和错误处理等任务，以实现高效、安全的代码运行。但在 Node.js 的用法中，这还不够，我们还得额外介绍 V8 中的一种 `UnboundScript`。

`UnboundScript` 是一种特殊的脚本对象。顾名思义，它尚未与任何特定的上下文绑定。与普通的 `Script` 对象不同，`UnboundScript` 可以在多个上下文中复用，而无需重新编译。这可以提高效率，尤其是在需要在多个上下文中重复运行相同代码时，我们就不用重复创建 `Script` 了。

在 V8 中，`Script` 与 `UnboundScript` 是可相互获取的。`UnboundScript` 可通过 [BindToCurrentContext()](https://v8.github.io/api/head/classv8_1_1UnboundScript.html#aeb86867c13854e1baf0756a46958eca0 "https://v8.github.io/api/head/classv8_1_1UnboundScript.html#aeb86867c13854e1baf0756a46958eca0") 来获取其与某个上下文绑定的 `Script`；而 `Script` 同样可通过 [GetUnboundScript()](https://v8.github.io/api/head/classv8_1_1Script.html#a7f34b85c7687d933284e93e6e2593c14 "https://v8.github.io/api/head/classv8_1_1Script.html#a7f34b85c7687d933284e93e6e2593c14") 来获取摆脱上下文的 `UnboundScript` 对象。

我们可简单粗暴地这么理解：

![18流程图1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9da25f6aece047bb88c91968e5d8b828~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1072&h=682&s=102841&e=png&b=fbf9f9)

> 只是“简单粗暴”的理解。事实上在 V8 中，`UnboundScript` 与 `Script` 在表层都是独立的类，并不存在任何包含或者继承的关系。它们的关系主要表现在：`Script` 对象是由 `UnboundScript` 对象通过绑定到特定上下文而生成的。从某种程度上说，我们可以认为 `UnboundScript` 在逻辑上位于 `Script` 对象之上。

如果要形象比喻一下，`UnboundScript` 就是没有认主的宠物，而 `Script` 则认了主。

#### Node.js 的 `ContextifyScript`

我们[上一章](https://juejin.cn/book/7196627546253819916/section/7197302022918864907 "https://juejin.cn/book/7196627546253819916/section/7197302022918864907")提到了，Node.js 的 `ContextifyContext` 是对于 V8 `Context` 的封装。V8 `Context`、`ContextifyContext` 与 Node.js 的上下文附魔对象的关系如下：

![18流程图2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a43708cc2ad453fb89f826811f9be77~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1086&h=456&s=133883&e=png&b=fffdfd)

`ContextifyContext` 中包含了 V8 `Context` 及可能存在的微任务队列，微任务队列 `MicrotaskQueueWrap` 则包含了 V8 的 `MicrotaskQueue`；附魔对象通过内部的隐藏字段与 `ContextifyContext` 关联起来，外部开发者是无法获取和操作这个 `ContextifyContext` 的，另外 V8 `Context` 中的 `globalThis` 通过拦截器与附魔对象进行生命绑定。最后，附魔后的对象的一个私有标识会被设置为 `true`，`vm.isContext()` 就是通过这个私有标准来判断对象是否被附魔。

除去这个 `ContextifyContext` 之外，Node.js 中还有一个 `ContextifyScript`。通过 Node.js 中 `vm` 的相关用法，我们很容易能想到，它其实是一个对于 V8 `UnboundScript` 的封装——因为它在执行的时候才需要指定上下文。

`ContextifyScript` 与 V8 `UnboundScript` 的关系就简单很多。

![18流程图3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eabc7d04156420880d1a935c0b30bb0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1066&h=378&s=88975&e=png&b=fdf1ec)

`ContextifyScript` 中有个成员变量是已编译好的 `UnboundScript`，以及一个 `runInContext()` 方法。当执行 `runInContext()` 方法时，会在方法作用域内将 `UnboundScript` 与传进来的上下文进行绑定，生成新的 `Script`，然后再开始执行脚本。

#### Node.js 的 `Script`

`ContextifyScript` 是 Node.js 在 C++ 侧实现的 JavaScript 类，它的原型链上只有两个方法：

1.  `createCachedData`；
2.  `runInContext`。

而 `Script` 则是在 JavaScript 侧对 `ContextifyScript` 进行了继承的类，补全了 `Script` 类的各种方法，并重载了 `ContextifyScript` 的 `runInContext`。要说他的实现，实际上就是一个简单的 `class` 与 `extends` 语法：

    class Script extends ContextifyScript {
      constructor(...) {
        super(...);
        ...
      }
      
      runInThisContext(...) {
        ...
        super.runInContext(...);
      }
      
      runInContext(...) {
        ...
        super.runInContext(...);
      }
      
      runInNewContext(...) {
        ...
        this.runInContext(...);
      }
    }
    

对上面的 `ContextifyScript` 图进行修改，就成了：

![18流程图4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2e2ea2da2da43b49e87642ebdef9349~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1910&h=454&s=228842&e=png&b=fdf2ef)

### 解析 `ContextifyScript`

`ContextifyScript` 是对于 V8 `UnboundScript` 的一个封装，里面最主要的方法是 `runInContext()`。`runInContext()` 里面拿到参数经过一番处理后，就跑到了一个叫 `EvalMachine()` 的函数。

改造一下上图，得到：

![18流程图5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a6beb01acbd44daa2c090a85ca82843~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1884&h=600&s=266682&e=png&b=fef4f1)

`ContextifyScript` 中的 `runInContext()` 方法接收几个参数：

1.  `contextifiedObject`：被附魔的上下文对象；
2.  `timeout`：执行超时时间；
3.  `displayErrors`：是否展示错误；
4.  `breakOnSigint`；
5.  `breakOnFirstLine`：是否在首行断点，这个参数仅在 Node.js 内部使用，与执行 Node.js 时的 `--inspect-brk` 有关。

#### `EvalMachine()`

而图中的这个 `EvalMachine()` 就是整个 `ContextifyScript` 中的精髓了。去掉不重要的参数，它主要接收：

1.  `context`：需要指定的 V8 `Context`；
2.  `timeout`：超时时间；
3.  `display_errors`：是否展示错误；
4.  `break_on_sigint`；
5.  `break_on_first_line`；
6.  `microtask_queue`：微任务队列（如果有）。

能看出来，大部分参数是可以一一对照进行透传的。这里有不一样的是 `EvalMachine()` 中的 `context` 与 `microtask_queue`。这两个参数都是从被附魔的 `contextifiedObject` 中析出的非凡特性。

让我们回到之前的那张图看看。

![18流程图6.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a948d55652164282aedec8b0754378e1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1884&h=744&s=335188&e=png&b=fefcfc)

当我们拿到了附魔对象后，就可以通过“内部隐藏字段”拿到对应的 `ContextifyContext`，于是就可以拿到它所包含的 V8 `Context`；同理，拿到 `ContextifyContext` 后，也可以取到微任务队列了。

如果附魔对象是个 `null`（`runInThisContext()`），则使用整个 Node.js 的主 V8 `Context`。如果这个 `ContextifyContext` 中没有对应的微任务队列，那取到的值则是 `null`。

在 `EvalMachine()` 中，第一步是声明一个传进来的 `Context` 的作用域，作用域生命周期是这个函数的生命周期。如此一来，在该函数中的 Current Context 就是传进来的 V8 `Context` 了。然后是声明一个 `try-catch` 作用域块，即这个函数后续的操作异常都会在 JavaScript 侧被 `try-catch` 到。

接下去，从 `this`（当前就是 `ContextifyScript`）中取出对应的 `UnboundScript`，并通过 `UnboundScript::BindToCurrentContext()` 将脚本绑定至当前 V8 `Context` 得到一个最终的 V8 `Script`。

> 此时的“当前 V8 `Context`”已被刚才第一步的作用域给弄到了传进来的 `Context` 上，即我们将要跑在的 `Context`。

然后就是通过 `run()` 去执行这个 `Script` 了。这个代码我在[第十章](https://juejin.cn/book/7196627546253819916/section/7197301896355250215 "https://juejin.cn/book/7196627546253819916/section/7197301896355250215")贴过，在[上一章](https://juejin.cn/book/7196627546253819916/section/7197302022918864907 "https://juejin.cn/book/7196627546253819916/section/7197302022918864907")也贴过。

    bool ContextifyScript::EvalMachine(...) {
      ...
      auto run = [&]() {
        MaybeLocal<Value> result = script->Run(context);
        if (!result.IsEmpty() && mtask_queue)
          mtask_queue->PerformCheckpoint(env->isolate());
        return result;
      };
      ...
    }
    

里面做的事情很简单，第一步就是 `script->Run(context)` 执行脚本，并得到脚本执行结果。如果脚本执行成功（`!result.IsEmpty()`），且有微任务队列（`mtask_queue`，前文我们讲过哪些情况下微任务队列为 `null` 了），则手动去消耗该微任务队列。我们[上一章](https://juejin.cn/book/7196627546253819916/section/7197302022918864907 "https://juejin.cn/book/7196627546253819916/section/7197302022918864907")中的那个 `afterEvaluate` 执行顺序就是这里搞的鬼。

#### 执行超时

当你使用 V8 引擎的时候，没进入它执行脚本的逻辑，你可以任意做你的事。一旦当你进入 JavaScript 执行阶段，除非是脚本执行完毕，你是无法在不借助外力的情况下停止执行的。比如你在 Node.js 中执行一个死循环，你是无法终止它的，除非你杀死进程。这个时候 Node.js 的主事件循环线程会被 V8 的脚本执行逻辑占用，它不执行完，是回不到 libuv 去执行下一个事件的。

    setTimeout(() => console.log('hello'), 1000);  // 永远不会触发
    // 死循环
    while (1) {}
    

再用我们[第二章](https://juejin.cn/book/7196627546253819916/section/7197074908004745254 "https://juejin.cn/book/7196627546253819916/section/7197074908004745254")中的公交路线来说，我们在一个站点耗时太长，会将后续所有站点时间都延后。如果在一个站点永远也上下不完客，公交车就会在这个站点停下，永远到不了后续的逻辑。

即使它不是个死循环，也会破坏所谓的定时器。这个我们在[第九章](https://juejin.cn/book/7196627546253819916/section/7199830775016423464 "https://juejin.cn/book/7196627546253819916/section/7199830775016423464")中的时序问题中也有所提及。通常 `vm` 在现实项目中的用法是运行一段用户代码，我们当然不希望有这种长时间阻塞的代码来阻塞我们的事件循环。这个时候就是 `vm` 里面的 `timeout` 参数的作用了。

只不过还是那句话，一旦进入 JavaScript 执行阶段，除非是脚本执行完毕，我们是无法在不借助外力的情况下停止执行的。有一个外力是直接杀死进程，还有一个外力是 V8 的 `TerminateExecution()` 函数强制结束当前 V8 正在执行的 JavaScript。

##### 看门狗

方法我们找到了，但是什么时候执行呢？主事件循环已经被占了，我们肯定无法在其中做任何事情。让我们翻回第二章，我在那提到了看门狗的概念。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9a4be2c2aa04701a3cdfa158ed9c528~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1338&h=690&s=1455132&e=png&b=212927)

~~拿错图了~~

![18流程图7.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f5f3809ecd4a57b84f7a0ea4a01640~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1890&h=982&s=441535&e=png&b=eceae5)

是这张

不知道重新放出这张图，大家有没有什么新的感悟。在 Node.js 中，`Watchdog` 就是为了 `vm` 中 `ContextifyScript` 执行超时而设立的看门狗。

它会在执行脚本前被声明，然后开辟一条新的线程，在新的线程中初始化一条新的事件循环。看门狗的线程事件循环中，会创建一个定时器，其定时时长就是外面传过来的 `timeout`。在看门狗事件循环定时器到期时，会通过刚才说的 `TerminateExecution()` 函数强行终止 V8 正在执行的 JavaScript 脚本。

> 在 V8 的 Doxygen 文档中是这么描述 `TerminateExecution()` 的：
> 
> Forcefully terminate the current thread of JavaScript execution in the given isolate.
> 
> This method can be used by any thread even if that thread has not acquired the **[V8](https://v8.github.io/api/head/classv8_1_1V8.html "https://v8.github.io/api/head/classv8_1_1V8.html")** lock with a **[Locker](https://v8.github.io/api/head/classv8_1_1Locker.html "https://v8.github.io/api/head/classv8_1_1Locker.html")** object.
> 
> 即我们可以在任意线程中通过 `TerminateExecution()` 来强制终止正在执行的 JavaScript 脚本以闲置出它原本所占的线程。

另外，看门狗是通过 C++ 中的 RAII（Resource Acquisition Is Initialization，资源获取即初始化）思想来实现的。RAII 的核心思想是将资源或者状态与对象的生命周期绑定。我们知道 C++ 中的栈内存生命周期是随着它的作用域的，一旦出了作用域，对应的对象会被自动析构、内存会被自动回收。

在 `Watchdog` 的构造函数中，主要做的就是新建线程、事件循环、定时器的事情。而在 `Watchdog` 的析构函数中，则是去停止看门狗事件循环、线程，并释放对应资源。

`Watchdog` 的构造函数中为新事件循环搞了一个 `uv_async_t` 的静电棒，当事件吸附到该新事件循环的时候，会停止该事件循环。

    Watchdog::Watchdog(v8::Isolate* isolate, uint64_t ms, bool* timed_out) {
      uv_loop_init(&loop_);  // 初始化新事件循环
      uv_async_init(&loop_, &async_, [](uv_async_t* signal) {  // 静电棒事件
        Watchdog* w = <获取到该 Watchdog 对象指针>;
        uv_stop(&w->loop_);  // 停止该 Watchdog 的事件循环
      });
      uv_timer_init(&loop_, &timer_);  // 初始化定时器
      uv_timer_start(&timer_, &Watchdog::Timer, ms, 0);  // 设置定时器事件及回调函数
      uv_thread_create(&thread_, &Watchdog::Run, this);  // 启动新线程
    }
    

在新线程中，做的事情就是执行上面这个带有定时器的事件循环。

    void Watchdog::Run(void* arg) {
      Watchdog* wd = <获取指定的 Watchdog>;
      uv_run(&wd->loop_, UV_RUN_DEFAULT);  // 开始进入这个带有定时器的事件循环（在新线程）
      
      // uv_run 执行完毕代表事件循环结束
      
      uv_close(reinterpret_cast<uv_handle_t*>(&wd->timer_), nullptr);  // 释放定时器
    }
    

而定时器的回调函数 `Timer` 逻辑则如下：

    void Watchdog::Timer(uv_timer_t* timer) {
      Watchdog* w = <获取指定的 Watchdog>;
      *w->timed_out_ = true;
      w->isolate()->TerminateExecution();  // 强行终止 JavaScript 执行
      uv_stop(&w->loop_);  // 停止看门狗事件循环
    }
    

最后，在析构函数中的逻辑就是发送静电棒事件，以及做一些资源的释放了。

    Watchdog::~Watchdog() {
      uv_async_send(&async_);  // 发送静电棒
      uv_thread_join(&thread_);  // 等待看门狗线程（看门狗事件循环）结束
    
      // 关闭静电棒资源
      uv_close(reinterpret_cast<uv_handle_t*>(&async_), nullptr);
    
      // 最终再跑一次新事件循环，以让 libuv 可做一些扫尾工作
      uv_run(&loop_, UV_RUN_DEFAULT);
    
      ...
    }
    

为什么上面的代码逻辑分这么几个阶段我们稍后阶段，接下去我们跳到 `EvalMachine()` 看看。在 Node.js 中，`EvalMachine()` 的超时逻辑是这么写的：

    bool ContextifyScript::EvalMachine(...) {
      ...
      auto run = [&]() {
        MaybeLocal<Value> result = script->Run(context);
        if (!result.IsEmpty() && mtask_queue)
          mtask_queue->PerformCheckpoint(env->isolate());
        return result;
      };
    
      ...
      bool timed_out = false;
      
      ...
      if (timeout != -1) {
        Watchdog wd(env->isolate(), timeout, &timed_out);
        result = run();
      } else {
        result = run();
      }
      
      if (timed_out || ...) {
        ...
        env->isolate()->CancelTerminateExecution();
        ...
        node::THROW_ERR_SCRIPT_EXECUTION_TIMEOUT(env, timeout);
      }
    }
    

如果 `timeout` 不为 `-1`，即设了超时值，则在 `if` 下的作用域中，声明这个 `Watchdog` 的对象，并开始 `run()`。此时 `Watchdog` 经构造函数开始了跳出三界之外新线程中的事件循环，并设置了定时器，等到超时的时候会强行终止 JavaScript 执行。此时若：

1.  执行完脚本并未超时：`run()` 执行完后，`if` 的作用域也结束了，触发 `Watchdog` 的析构函数，此时它会发送静电棒事件、等待新线程结束，并扫尾等；由于最终析构了，定时器也会被最终抛弃、释放；
    
2.  超时：`run()` 并未执行完，定时器并未被抛弃、释放，所以新线程会在超时时刻触发定时器回调函数，强行终止 JavaScript 脚本执行，然后停止看门狗事件循环；此时 `run()` 被终止了，则它相当于“执行完了”，`if` 作用域也就到期了，会进入 `Watchdog` 的析构函数，开始发送静电棒事件、等待新线程结束，并扫尾等。
    

我们一项项看这个事情。

首先是执行完脚本未超时，相当于是在主事件循环（主线程）中做 `Watchdog` 的析构，此时看门狗事件循环依旧在新线程中跑得很欢快。这个时候如果我在主线程中直接关闭看门狗事件循环，会有现成安全问题，进程很有可能因此崩溃。所以此处不能直接关闭，而是通过静电棒事件通知给看门狗事件循环，当在新线程中的看门狗事件循环收到这个静电棒事件时，会在它所处的线程执行事件回调，即在构造函数中写的“停止事件循环”。此时的“停止”操作是在看门狗事件循环内发起的，所以是线程安全的。

    uv_async_init(&loop_, &async_, [](uv_async_t* signal) {  // 静电棒事件
      Watchdog* w = <获取到该 Watchdog 对象指针>;
      uv_stop(&w->loop_);  // 停止该 Watchdog 的事件循环
    });
    

由于在析构函数中是通过静电棒事件发送给新线程的，新线程必须得等事件循环的新一轮中收到事件后才能开始做对应的操作。所以在析构函数中恰恰发送完 `uv_async_send(&async_)` 时，新事件循环、新线程大概率尚未结束。只有新线程最终执行到上面的 `uv_stop()` 时才会结束，才会执行 `Run()` 的下一行代码释放定时器，然后线程结束。所以析构函数在发送完这个事件后，首先是通过 `uv_thread_join()` 等待新线程执行结束。新线程执行结束后说明看门狗事件循环现在已经停止执行了，此时再做后面的操作才是线程安全的。如果我们不等新线程结束，而是直接去后面做关闭、释放等操作，很有可能新线程的事件循环还在跑，突然资源被释放，它接下去跑就直接挂了。 再祭出刚才那张图，可能大家的感悟就又不一样了。

![18流程图8.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/738e692ea53e4f9fb3a0734ecc6446d8~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1892&h=986&s=441794&e=png&b=eceae5)

另一条分支，定时器尚未超时，脚本就执行完了。此时，直接进入 `Watchdog` 析构函数。然而此时的看门狗事件循环中，定时器尚未触发，线程也还在跑。这个时候仍旧是析构函数发送一个静电棒通知给看门狗的事件循环，在看门狗的事件循环中收到这个通知仍旧是停止这条事件循环，进入 `Run()` 的下一行代码释放定时器，最终线程结束。仍旧是 `Watchdog` 的析构函数中等待新线程的结束，最终再做后续的扫尾工作。改一下上面那张图，只是少了“定时器到期”和“终止”两步：

![18流程图9.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e8b9903199645ce8bd1bc3f0500e6c3~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1888&h=986&s=408890&e=png&b=eceae5)

#### 后续逻辑

当看门狗走完后，就走到后续的逻辑了，上面的代码里面也贴了，大约是：

      if (timed_out || ...) {
        ...
        env->isolate()->CancelTerminateExecution();
        ...
        node::THROW_ERR_SCRIPT_EXECUTION_TIMEOUT(env, timeout);
      }
    

看门狗会在执行超时的时候，把传进去的 `timed_out` 设为 `true`。所以在这里判断如果超时，就进入这段逻辑。首先是恢复现场，让 V8 的 `Isolate` 恢复成“非强行终止”状态，从而可正常执行后续的 JavaScript 脚本。然后就是抛出一个超时异常。

所以我们在 Node.js 的 `vm` 中，`Script` 执行超时才能收到一个异常，这个异常就是上面这段代码抛出的。然后在这段代码之后，就是最终的逻辑了，处理 V8 `Script` 执行得到的异常，并设置 JavaScript 函数的返回值。

    bool ContextifyScript::EvalMachine(...) {
      ...
    
      <超时逻辑>
    
      if (try_catch.HasCaught()) {
        ...
        try_catch.ReThrow();
    
        return false;
      }
    
      args.GetReturnValue().Set(result.ToLocalChecked());
      return true;
    

前面提到，`EvalMachine()` 函数最开始做的两件事，一个是声明一个 `Context` 作用域，另一个是声明 `try-catch` 作用域块。上面这段代码中的 `try_catch` 就是最开始声明的那个作用域块。在最开始到这一行代码之间，若 JavaScript 侧有任何的未捕获异常，都会被这个 `try_catch` 所捕获（`HasCaught()`），被捕获之后，我们重新向上级作用域重新抛出异常，并给 `runInContext()` 返回 `false`。

若无事发生，那么我们将执行脚本得到的返回值 `result` 作为 `runInContext()` 的返回值（`args.GetReturnValue().Set(...)`），并给 `runInContext()` 返回 `true`。

这一整块逻辑，我们再用之前的那张图做修改，就会变成这样：

![18流程图10.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c570bc1eab8f4e92878e9108bedcb69b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1896&h=774&s=304098&e=png&b=fef6f4)

上面那个面条人一样的存在就是 `Watchdog` 了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23dc8b4efbb1466eb11b093d676cef19~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=453&h=288&s=1577889&e=gif&f=73&b=93d9fc)

#### 构造函数

`ContextifyScript` 的构造函数其实主要就是对传进来的代码字符串进行编译，使其成为 `UnboundScript` 的过程。最核心代码就下面几行：

      ScriptOrigin origin(isolate,
                          filename,
                          line_offset,                          // line offset
                          column_offset,                        // column offset
                          true,                                 // is cross origin
                          -1,                                   // script id
                          Local<Value>(),                       // source map URL
                          false,                                // is opaque (?)
                          false,                                // is WASM
                          false,                                // is ES Module
                          host_defined_options);
      ScriptCompiler::Source source(code, origin, cached_data);
      ScriptCompiler::CompileOptions compile_options =
          ScriptCompiler::kNoCompileOptions;
    
      ...
    
      MaybeLocal<UnboundScript> maybe_v8_script =
          ScriptCompiler::CompileUnboundScript(isolate, &source, compile_options);
    

也不用把它看明白了，把上面我说的那句话看明白就好了。这个代码只是为了“佐证”我写的这句话。

#### `CreateCachedData()`

这个没什么好讲的，直接通过 V8 的 `ScriptCompiler::CreateCodeCache()` 函数就能为一个 `UnboundScript` 创建 Cached Data。

### 解析 `Script`

前面讲了，`Script` 是对于 `ContextifyScript` 的一个继承。代码我们在前面也给出了，就是一个很简单的 `class ... extends ...`。如果想在 Node.js 内进行验证也很简单。

    const vm = require('vm');
    const { Script } = vm;
    
    const ScriptParent = Object.getPrototypeOf(Script);
    console.log(ScriptParent);
    

你就能看到它输出了 `[Function: ContextifyScript]`。这就是 C++ 侧实现的 JavaScript 类——`ContextifyScript`。由于 C++ 侧的类不直接面向开发者，所以在参数的各种校验上都是交给它的子类 `Script` 做的。也就是说，我们如果传点脏东西给它，是会直接让 Node.js 进程崩溃的——不是 JavaScript 侧的崩溃，而是直接 C++ 侧的断言崩溃。比如：

    const ScriptParent = Object.getPrototypeOf(Script);
    new ScriptParent(123);
    

你就会收到类似下面的崩溃：

    ./node[82268]: ../../src/node_contextify.cc:773:static void node::contextify::ContextifyScript::New(const FunctionCallbackInfo<v8::Value> &): Assertion `(argc) >= (2)' failed.
     1: 0x104cd33b8 node::Abort() [/foo/node]
     2: 0x104cd30f8 node::PrintCaughtException(v8::Isolate*, v8::Local<v8::Context>, v8::TryCatch const&) [/foo/node]
     ...
     28: 0x1a5717e50 start [/usr/lib/dyld]
    [1]    82268 abort      ./node temp.js
    

回到之前那张图：

![18流程图11.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b252d51dd7f43d18411a39f35e0305a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1896&h=794&s=306011&e=png&b=fef7f5)

我们看到 `Script` 的 `runInContext()` 与 `runInThisContext()` 都是最终调用 `super.runInContext()` 来执行脚本的，而 `runInNewContext()` 则是通过调用 `Script` 自己的 `runInContext()` 来达到目的的。

#### `runInContext()`

代码就几行：

    runInContext(contextifiedObject, options) {
      validateContext(contextifiedObject);
      const { <...>, args } = getRunInContextArgs(
        contextifiedObject,
        options,
      );
      <...>
      return ReflectApply(super.runInContext, this, args);
    }
    

先判断一下 `contextifiedObject` 有无被附魔。然后根据 `contextifiedObject` 与 `options` 为后续调用 `super.runInContext()` 生成参数。该参数被拆解后，会被拍平成一个参数数组。这个我们前面讲过，依次为：

1.  `contextifiedObject`；
2.  `timeout`；
3.  `displayErrors`；
4.  `breakOnSigint`；
5.  `breakOnFirstLine`。

最后一行 `Reflect.apply` 可简单粗暴理解为：`super.runInContext(contextifiedObject, timeout, displayErrors, breakOnSigint, breakOnFirstLine)`。

#### `runInThisContext()`

也是几行代码，而且几乎一样。

    runInThisContext(options) {
      const { <...>, args } = getRunInContextArgs(null, options);
      <...>
      return ReflectApply(super.runInContext, this, args);
    }
    

因不存在 `contextifiedObject`，所以第一步验证都省了。在生成参数的时候，直接用 `null` 来代替附魔对象了。我们之前还说过，如果附魔对象是个 `null`（`runInThisContext()`），则使用整个 Node.js 的主 V8 `Context`。

#### `runInNewContext()`

这一步实际上是跟 `vm.createContext()` 以及 `script.runInContext()` 合并起来了。

    runInNewContext(contextObject, options) {
      const context = createContext(contextObject, getContextOptions(options));
      return this.runInContext(context, options);
    }
    

`vm.compileFunction()`
----------------------

除了 `Script` 和 `ContextifyContext`，`vm` 还有一个单独的 `compileFunction()` 方法。这个方法内部就一行：

    function compileFunction(code, params, options = kEmptyObject) {
      return internalCompileFunction(code, params, options).function;
    }
    

即，调用 `internalCompileFunction`，并返回其返回结果的 `function`。等一下！`internalCompileFunction()`，眼熟不？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ace5ca2e690d4b9f844a96cef3be64d6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=225&h=225&s=33105&e=png&b=fcfcfc)

回到[上一章](https://juejin.cn/book/7196627546253819916/section/7197302022918864907 "https://juejin.cn/book/7196627546253819916/section/7197302022918864907")，你能找到 `internalCompileFunction()` 字样；再往前倒到[第六章](https://juejin.cn/book/7196627546253819916/section/7197301586174869537 "https://juejin.cn/book/7196627546253819916/section/7197301586174869537")，它最终是调的 V8 的 `ScriptCompiler::CompileFunction()` 函数达到效果的。

### `internalCompileFunction()`

这个函数除了被 `vm.compileFunction()` 用到之外，还有就是被现在版本中的 CJS 模块所使用。我们讲过，古早的时候，Node.js 编译 CJS 模块代码的时候，是前后加上 Wrapper：

    (function (exports, require, module, __filename, __dirname) { // 前 Wrapper
    module.exports = {};
    });  // 后 Wrapper
    

> 实际上 `module.exports = {}` 与上一行代码同处一行，此处为了便于展示，新起一行。

然后再通过 `vm.Script()` 编译而成，并 `.runInThisContext()` 得到的这个匿名函数。这么做的缺点就是第一行的错误堆栈展示会有问题，因为最开始的代码并不是用户代码，而是前 Wrapper。后来，为了解决这个问题，Node.js 采用了 `internalCompileFunction()` 来编译出上面的这个函数。简单粗暴地用 JavaScript 代码**类比**，就是：

    new Function(
      'exports',
      'require',
      'module',
      '__filename',
      '__dirname',
      'module.exports = {};');
    

真实代码是 `module.exports = {}`，以及一堆的参数，省略了声明函数的前摇后摇。

> 不过这种情况生成的函数堆栈依旧是以第二行作为用户逻辑代码开始。只是在用户声明的时候看起来只写了一行代码。

而前者则**像是**一个 `eval()`，需要把声明什么的都写进去。

    eval(`
    function xxx(exports, require, module, __filename, __dirname) {
    module.exports = {};
    }
    `);
    

虽然 `new Function()` 在写法上满足了，但它在隔离性、错误堆栈上还是不满足。这只是用于我们这里的类比。那么如何在 `vm` 的机制下，把错误堆栈搞对呢？就是靠这个 `internalCompileFunction()` 了。

我把一堆旁路逻辑和校验逻辑拔掉，`internalCompileFunction()` 就长这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84fb1f7a1644d89b31ead9637b3a56e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1000&h=1000&s=293730&e=png&b=fafafa)

拿错了，是长这样：

    function internalCompileFunction(code, params, options) {
      ...
    
      const {
        filename = '',
        columnOffset = 0,
        lineOffset = 0,
        cachedData = undefined,
        produceCachedData = false,
        parsingContext = undefined,
        contextExtensions = [],
        importModuleDynamically,
      } = options;
    
      ...
    
      const result = compileFunction(
        code,
        filename,
        lineOffset,
        columnOffset,
        cachedData,
        produceCachedData,
        parsingContext,
        contextExtensions,
        params,
      );
      
      ...
    
      return result;
    }
    

其实就俩事：

1.  抽取各 `options`；
2.  将各参数传给 `compileFunction()` 得到结果。

最后，返回 `result` 即可。所以精华都被浓缩在了 C++ 侧实现的 `compileFunction` 中。

### C++ 侧的 `compileFunction()`

这个函数与前面的 `ContextifyScript` 编译逻辑近似。只不过一个是 V8 的 `Script`，一个是直接编译成函数。最核心代码就下面几行：

      ScriptOrigin origin(isolate,
                          filename,
                          line_offset,       // line offset
                          column_offset,     // column offset
                          true,              // is cross origin
                          -1,                // script id
                          Local<Value>(),    // source map URL
                          false,             // is opaque (?)
                          false,             // is WASM
                          false,             // is ES Module
                          host_defined_options);
      ScriptCompiler::Source source(code, origin, cached_data);
      ScriptCompiler::CompileOptions options;
    
      ...
    
      MaybeLocal<Function> maybe_fn = ScriptCompiler::CompileFunction(
          parsing_context,
          &source,
          params.size(),
          params.data(),
          context_extensions.size(),
          context_extensions.data(),
          options,
          v8::ScriptCompiler::NoCacheReason::kNoCacheNoReason);
    

看吧，核心代码就最后这段与 `ContextifyScript` 那块不同。这里用的是 `ScriptCompiler::CompileFunction()`，而 `ContextifyScript` 用的则是 `ScriptCompiler::CompileUnboundScript`。

再把上面的图扩大一点，就成了：

![18流程图12.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31d42584a8024d4cac494b2403c8677e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1894&h=826&s=373937&e=png&b=fdf7e5)

至此 `vm` 里面的内容讲完了。

`vm` 小结
-------

`vm` 相关的两章为大家揭开了该模块的核心原理。从上下文附魔对象到 `ContextifyContext` 再到 V8 `Context` 一条链子下来；从 Node.js 的 `Script` 到 `ContextifyScript` 再到 V8 `Script`、`UnboundScript` 又是一条链子下来。

一个附魔对象并不是真的 `ContextifyContext` 实例，只是在背后与其进行绑定，并将命运进行连结，一荣俱荣，一损俱损。改了附魔对象即改了新上下文的 `globalThis`，反之亦然。而 `ContextifyContext` 底下真正起作用的是 V8 的 `Context` 对象，以及一个设置了拦截器至附魔对象的 `globalThis`。在这里面的概念还有一个微任务队列小可爱，在上一章我们还介绍了关于它时序的内容。

一个 Node.js 的 `Script` 继承自 `ContextifyScript`，内含 V8 的 `UnboundScript`，只有在 `.runIn<*>Context()` 的时候才会与对应的 `Context` 进行绑定，成为有主的宠物。

`vm` 的 `compileFunction()` 是一个特殊的存在，也是一条链子连到 `internalCompileFunction()` 再到 C++ 侧的 `compileFunction()`。它不会存在错误堆栈的行列被额外代码污染的情况。

以及，这两章还为大家复习了：

1.  CommonJS 的编译逻辑，古早的 `Script` 派和当前的 `internalCompileFunction()` 派，二者的不同是后者解决了错误堆栈行列被污染的问题；
2.  事件循环中提到的 `Watchdog` 逻辑，它在 Node.js 中是用于监视 `vm` 执行超时并强行终止的。