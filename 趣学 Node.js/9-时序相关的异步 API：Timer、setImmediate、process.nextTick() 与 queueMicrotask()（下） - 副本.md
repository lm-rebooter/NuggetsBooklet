前面两章，我们讲述了 Node.js 中 `setTimeout` 原理是什么。是由单个定时器不断地去定最近超时时间以达到效果。接下去，我们用一章的量讲完 `setImmediate()`、`process.nextTick()` 与 `queueMicrotask()` 吧。

`setImmediate()`
----------------

[setImmediate() 的源码](https://github.com/nodejs/node/blob/v18.14.1/lib/timers.js#LL279-L303C2 "https://github.com/nodejs/node/blob/v18.14.1/lib/timers.js#LL279-L303C2")与 `setTimeout()`、`setInterval()` 近似，只不过没有 `insert()` 操作，实例也不再是 `Timeout`，而是 `Immediate`。眼熟吧。

    function setImmediate(callback, arg1, arg2, arg3) {
      validateFunction(callback, 'callback');
    
      let i, args;
      switch (arguments.length) {
        case 1:
          break;
        case 2:
          args = [arg1];
          break;
        case 3:
          args = [arg1, arg2];
          break;
        default:
          args = [arg1, arg2, arg3];
          for (i = 4; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
          break;
      }
    
      return new Immediate(callback, args);
    }
    

`Immediate` 类也与 `Timeout` 类似，有着一堆元信息，也有着 `ref()` 与 `unref()`。不过，它会在自己构造函数内部将自己推入一个 [Immediate 的链表](https://github.com/nodejs/node/blob/v18.14.1/lib/internal/timers.js#L267-L304 "https://github.com/nodejs/node/blob/v18.14.1/lib/internal/timers.js#L267-L304")中。

    const immediateQueue = new ImmediateList();
    
    ...
    
    class Immediate {
      constructor(...) {
        ...
        immediateQueue.append(this);
      }
    }
    

这就是一条非常普通的链表，只有 `append()`（推入到最后元素）以及 `remove()`（移除某个元素）两个操作。还记得我们在[第八章](https://juejin.cn/book/7196627546253819916/section/7197301858296135684 "https://juejin.cn/book/7196627546253819916/section/7197301858296135684")中提到的，Node.js 会在启动的时候[注册两个时序相关的 Dispatcher 进去吗](https://github.com/nodejs/node/blob/v18.14.0/lib/internal/bootstrap/node.js#L349-L360 "https://github.com/nodejs/node/blob/v18.14.0/lib/internal/bootstrap/node.js#L349-L360")？

1.  `processTimers()`；
2.  `processImmediate()`。

`processTimers()` 这个函数我们在第八章的时候介绍过了，是在 libuv 侧关于 `Timer` 的定时器到期之后会执行的 Dispatcher 回调函数。而 [processImmediate()](https://github.com/nodejs/node/blob/v18.14.1/lib/internal/timers.js#L431-L494 "https://github.com/nodejs/node/blob/v18.14.1/lib/internal/timers.js#L431-L494") 就是用于处理 `setImmediate()` 的回调了。

它的流程可以用一句话概括，遍历这条 `Immediate` 链表，并逐个执行其回调函数。这里做了一个防重入的措施。在遍历前，将 `Immediate` 链表给到另一条链表，然后清空 `immediateQueue`。思考一下，这么做的意义在哪？

想象一下，如果有这么一段代码：

    function set() {
      console.log('hello');
      setImmediate(set);
    }
    set();
    

我要是在 `processImmediate()` 遍历过程中，始终用同一条链表会怎么样？我刚从链表内拿出一个 `Immediate`，紧接着在它的回调函数中又插入一个新的（`immediateQueue.append(this)`）。它就一直在遍历这个链表，其他事都不用做了。所以才需要另一条链表做防重入：

    const outstandingQueue = new ImmediateList();
    ...
    
    function processImmediate() {
      const queue = outstandingQueue.head !== null ?
        outstandingQueue : immediateQueue;
      let immediate = queue.head;
    
      if (queue !== outstandingQueue) {
        queue.head = queue.tail = null;
        immediateInfo[kHasOutstanding] = 1;
      }
      
      ...遍历
    }
    

这里另一条链表就是 `immediate`。在最开始的时候，先判断 `outstandingQueue` 是不是为空，若为空，则将 `queue` 赋值为 `immediateQueue`，否则赋值为 `outstandingQueue`，这个是后话。然后让 `immediate` 为这个 `queue` 的首元素，后面的遍历就是遍历这个 `immediate`。

下面这个 `if` 就是防重入的核心了。如果 `queue` 不等于 `outstandingQueue`，也就意味着它就是 `immediateQueue`。如果当前遍历的是 `immediateQueue`，那么我们就清空这个 `immediateQueue`，也就是将其首尾都赋空。这么一来，我遍历是遍历着已经拿过来的 `immediate`，在这之间新插入的 `Immediate` 是插入到已被赋空的 `immediateQueue` 链表了，两条链表毫无关系，不会再出现死循环。

这就像跟熊孩子排队一样。轮到熊孩子玩，玩好之后又马上跑队尾去排，再玩一轮，再继续排。假设游乐场只要有客就接，不休息，那么它永远也别打烊了，熊孩子会一直排下去玩下去。但如果一条队伍开始进场后，我们就决定这条队伍今天不接客了，玩完就关门，你要排可以，排明天去。那么游乐场就能正常打烊了。

那么，这个 `outstandingQueue` 又是什么呢？首先，执行 `Immediate.prototype._onImmediate()` 函数的时候，Node.js 用的是 `try-finally`，并没有 `catch`。也就是说，一旦 `setImmediate()` 中的回调函数抛错了，是会触发 `uncaughtException` 的。这个时候，如果用户监听了该错误事件并处理了，那么 Node.js 会继续执行，但是这个 `Immediate` 链表的遍历过程就被中断了，我们甚至接下去再执行的话，要从哪开始。

`outstandingQueue` 就起到了**保留现场**的作用。每次遍历执行一次 `Immediate.prototype._onImmediate()` 后的 `finally` 中，都记录一下 `outstandingQueue` 的首元素为当前执行完的 `Immediate` 的下一个元素。这样，哪怕抛错了，也记录下来了现场。所以我们在 `processImmediate()` 函数的头部逻辑中能看到，`queue` 的赋值时，`outstandingQueue` 是否为空。若不为空则说明是记录下现场后，有抛错，那么理应从现场继续开始——相当于去商场停车后，拍照记下来车位号，以便到时候事情太多，忘了的时候快速找到自己的车子在哪。

这块遍历逻辑讲完后，接下去就是 `setImmediate()` 回调函数的执行时机了。`setTimeout()` 时机为 libuv 里唯一 `Timer` 定时器在事件循环中最近一次超时事件。那 `setImmediate()` 呢？这里我脱口秀高级技巧——Callback 一下。请大家返回[第三章](https://juejin.cn/book/7196627546253819916/section/7196992628036993028 "https://juejin.cn/book/7196627546253819916/section/7196992628036993028")，里面有提到 libuv 的一个事件——空转事件。

我们再祭出 libuv 的事件循环内部顺序图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1051c1a7f472405382f36ae2afae98eb~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=522&h=740&s=69977&e=png&b=f3f3f3)

一次事件循环的逻辑顺序依次为：定时器事件、Pending 态 I/O 事件、空转事件、准备事件、Poll I/O 事件、复查事件及扫尾。

空转事件是在定时器事件后执行的。但这并不重要，`Immediate` 并不在该阶段执行。空转事件只是为了让 Poll for I/O 阶段不阻塞而已。它的事件回调是一个空的 Lambda 函数。当有至少一个 `Immediate` 被 `ref` 了，Node.js 就会激活这个空转句柄，让 I/O 不阻塞等待定时器事件；如果没有被 `ref` 了，则停止该句柄。

    void Environment::ToggleImmediateRef(bool ref) {
      if (started_cleanup_) return;
    
      if (ref) {
        uv_idle_start(immediate_idle_handle(), [](uv_idle_t*){ });
      } else {
        uv_idle_stop(immediate_idle_handle());
      }
    }
    

代码比较好理解，也是通过 `ref` 和 `unref` 来搞的。你如果理解了 `setTimeout()` 的话，应该会对这个逻辑感到亲切。 至于它是如何不阻塞事件循环的，大家可以回过头去精读一下第三章的空转事件。复习一下，其实原理很简单，就是 Poll for I/O 阶段的时候，最大等待时间为 `uv_backend_timeout()`。若无空转事件，则该值为下一个定时器的时间，若有，则直接是 `0`。

看一下 `setImmediate()` 官方文档：

> Schedules the "immediate" execution of the `callback` after I/O events' callbacks.

也就是说，它回调函数执行时机是在 Poll for I/O 阶段之后。实际上，Node.js 用[复查事件阶段](https://github.com/nodejs/node/blob/v18.14.1/src/env.cc#LL864C15-L864C71 "https://github.com/nodejs/node/blob/v18.14.1/src/env.cc#LL864C15-L864C71")来执行 `Immediate`——的确是在 Poll for I/O 阶段之后：

    uv_check_start(immediate_check_handle(), CheckImmediate);
    

这个 `CheckImmediate()` 回调就是执行的关键了，其作用类似于 `setTimeout()` 中的 `RunTimers()`。

    void Environment::CheckImmediate(uv_check_t* handle) {
      ...
      do {
        MakeCallback(env->isolate(),
                     env->process_object(),
                     env->immediate_callback_function(),
                     0,
                     nullptr,
                     {0, 0}).ToLocalChecked();
      } while (env->immediate_info()->has_outstanding() && env->can_call_into_js());
      ...
    }
    

这里我们看到，它会不断去执行之前注册好的回调函数 `processImmediate()`，直到现场（`outstandingQueue`）空了。

### 时机究竟如何？

按 Node.js 官方文档来看，`setImmediate()` 执行时机是在复查事件阶段，在定时器事件、Poll for I/O 事件之后。我们做了内部原理剖析和讲解后，发现也的确是这样的。但事实上呢？我们来看一段代码：

    setImmediate(() => {
      console.log('setImmediate');
    });
    
    setTimeout(() => {
      console.log('setTimeout');
    }, 0);
    

用 Node.js 跑几次看看？我们会发现结果是随机的，有时先 `setImmediate`，而有时则先执行 `setTimeout`。说好的定时器事件先执行呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4495c94859942789888893fcb68a5ea~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=120&h=113&s=39313&e=gif&f=20&b=f8f8f8)

这里其实被偷换概念了。libuv 设计的确是定时器先于复查的——但那仅限于同一个 Tick 呀。抛开一个 Tick 讲执行顺序的都是耍流氓。就 `setTimeout()` 原理那个不精确的劲儿，它指不定是哪个 Tick 执行呢，而 `setImmediate` 的执行顺序则恰恰在该 Tick 末尾。

在上面代码中，执行了这两句代码后，才进入事件循环。在第一个 Tick 中，先判断 `setTimeout()` 有没有到期。超时时间为 `0`，在 `Timeout` 构造函数中会被自动设为 `1`。通常情况下，第一个 Tick 还超不了时，所以略过定时器，走到了复查阶段；而有时候计算机稍微脑抽卡一下，第一个 Tick 的时候就已经超时了，这个时候自然是先执行这个 `Timeout`。如果已经在事件循环中，再跑这两行句代码，那肯定是先执行 `Immediate`，毕竟定时器阶段未检查到超时 `Timeout`。如下：

    setTimeout(() => {
      setImmediate(() => {
        console.log('setImmediate');
      });
    
      setTimeout(() => {
        console.log('setTimeout');
      }, 0);
    }, 0);
    

这就铁定先执行 `setImmediate` 再执行 `setTimeout` 了，因为跑完外层 `Timeout` 后，直接就到后续阶段了，一路过去肯定是先执行复查阶段，然后再是下个 Tick 才能执行后续的 `Timeout`。但如果这样呢：

    setImmediate(() => {
      setImmediate(() => {
        console.log('setImmediate');
      });
    
      setTimeout(() => {
        console.log('setTimeout');
      }, 0);
    }, 0);
    

这个时候，里面的两个 `setImmediate` 与 `setTimeout` 肯定都是要在下个 Tick 进行了，因为当前已经处于复查阶段，而且防重入机制让里面的 `Immediate` 肯定不会再在当前 Tick 进行。那这个时候还是要看电脑有没有脑抽，所以它的结果是跟最开始那两句代码一样，顺序是随机的。

那如果是 `setImmediate()` 与 `fs` 呢？比如：

    // temp.js
    setImmediate(() => {
      console.log('setImmediate');
    });
    require('fs').readFile('temp.js', () => {
      console.log('readFile');
    });
    

这个执行顺序又是怎么样的？首先，在这个 Tick 中的执行顺序肯定是先 Poll for I/O 然后再复查。但问题在于，Poll for I/O 阶段，它等待文件系统事件的时间为 `0`，`0` 时间内等不到事件，那么会继续执行后续逻辑。而对一个这种可读事件来说，通常不会在 `0` 的时间内完成触发，所以第一个 Tick 基本上都是直接在 Poll for I/O 阶段假模假式等你 `0` 毫秒，然后就直奔复查阶段去了。第一个 Tick 没读出来，那 `fs` 自然是在后续 Tick 中读出来了。所以如果没有一些特殊情况，上面的代码 `setImmediate` 总会先于 `readFile` 被输出。

改一下上面的代码：

    function imm() {
      setImmediate(() => {
        console.log('setImmediate');
        imm();
      });
    }
    imm();
    
    require('fs').readFile('temp.js', () => {
      console.log('readFile');
      process.exit(0);
    });
    

执行几次，会发现，输出了几行 `setImmediate` 后，终于读取成功了，然后输出 `readFile` 并退出了。这又是什么科学道理呢？虽然我们执行等待的时候等待时间为 `0`，但是整段 JavaScript 在每个 Tick 执行时间还是有纳秒、微妙、毫秒级别的耗时，所以到下几个 Tick 的时候，事件已经到了，不用等就能直接拿到。这个时候哪怕等待 `0` 也能直接拿到事件，于是终于等到了 `readFile()` 的回调函数出场了。

上面抛砖引玉一下。大家可以自己再想想各种情况下 `setImmediate()` 的时序问题。

`queueMicrotask()`
------------------

### 微任务的理论执行时机

在 Web API 中，有一个 `queueMicrotask()` 函数。这个就是大家经常听到的“微任务”。我们不说网上八股那些有的没的宏任务微任务，反正我没看懂。微任务在 [WHATWG 规范](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#microtask-queuing "https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#microtask-queuing")里是有定义的：

> The [queueMicrotask()](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask "https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask") method allows authors to schedule a callback on the [microtask queue](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue "https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue"). This allows their code to run once the [JavaScript execution context stack](https://tc39.es/ecma262/#execution-context-stack "https://tc39.es/ecma262/#execution-context-stack") is next empty, which happens once all currently executing synchronous JavaScript has run to completion.

什么意思呢？微任务是在“当前 JavaScript 执行上下文堆栈”完毕之后，要开始执行下一坨 JavaScript 之前，在这个空档之间执行的任务。这与事件循环可没有必然联系。在 libuv 里面事件循环同一个阶段，也会出现这种情况。

比如我们监听了很多文件系统 I/O 事件，并且在某一个事件循环中同时拿到事件并触发，它们处于同个阶段，但它们的 JavaScript 执行上下文堆栈则不同。我们拿之前的 `setImmediate()` 举例，理论上，在复查阶段执行 `CheckImmediate()` 函数，触发这个事件的时候，没有任何 V8 引擎介入的。在该函数内部，Node.js 为其创建了一个 `HandleScope` 和一个 `Context::Scope`，这才有了一个执行 JavaScript 的上下文环境：

    void Environment::CheckImmediate(uv_check_t* handle) {
      ...
    
      HandleScope scope(env->isolate());
      Context::Scope context_scope(env->context());
      
      ...
    }
    

这才是所谓的“一次 JavaScript 上下文堆栈”。所以理论上执行完这个 `CheckImmediate()` 的 JavaScript 侧代码后，就会执行一次微任务。定时器 `setTimeout()` 最终回调执行机制同理——理论上的确如此。

首先，内置的跑在微任务阶段的那些内容的确如网上说的，比如 `Promise` 的一些东西。我们也可通过 `queueMicroTask()` 往微任务队列里面插入我们自己所需要跑的微任务。这些任务**理论上**会在上面提到的这些时机去执行。

### Node.js 中的微任务执行时机

在 V8 中，微任务的执行时机是由策略决定的，该策略是 `MicrotasksPolicy` 的枚举值，通过 `v8::Isolate::SetMicrotasksPolicy` 设置给 V8 引擎的。该枚举值有：

*   `kExplicit`；
*   `kScoped`；
*   `kAuto`。

我们不管其他几种枚举值是何种策略，Node.js 自身的[策略用的是 kExplicit](https://github.com/nodejs/node/blob/v18.14.1/src/node.h#L447 "https://github.com/nodejs/node/blob/v18.14.1/src/node.h#L447")。该策略在 V8 文档中的解释是：微任务只会在显式调用 `Isolate::PerformMicrotaskCheckpoint()`（或 `MicrotaskQueue::PerformCheckpoint()`）时被执行。换句话说，我前面解释一大堆只是“理论”，**最终解释权归 Node.js 所有**。我们看看目前 Node.js v18.14.1 中哪里调用的 `PerformMicrotaskCheckpoint()` 吧。

1.  ECMAScript modules 的 `Evaluate()` 阶段；
2.  [vm 沙箱执行完一次之后](https://github.com/nodejs/node/blob/v18.14.1/src/node_contextify.cc#L1009-L1014 "https://github.com/nodejs/node/blob/v18.14.1/src/node_contextify.cc#L1009-L1014")，并且用的不是主 Context，而是通过 `vm.createContext()` 创建新的 Context；
3.  内部一些 `callback` 函数执行之后（具体在 [InternalMakeCallback](https://github.com/nodejs/node/blob/v18.14.1/src/api/callback.cc#L193 "https://github.com/nodejs/node/blob/v18.14.1/src/api/callback.cc#L193") 中的 [InternalCallbackScope](https://github.com/nodejs/node/blob/v18.14.1/src/api/callback.cc#L132-L136 "https://github.com/nodejs/node/blob/v18.14.1/src/api/callback.cc#L132-L136")）；
4.  前面讲的 `setTimeout()`、`setInterval()`、`setImmediate()` 等薅羊毛时，每次执行 `runNextTicks()` 的时候，以及其他与 `process.nextTick()` 回调函数触发的相同时机（稍后于它，这个在 `process.nextTick()` 会详解）；
5.  手动执行一个被遗弃的 API [process.\_tickCallback()](https://nodejs.org/dist/latest-v18.x/docs/api/deprecations.html#DEP0134 "https://nodejs.org/dist/latest-v18.x/docs/api/deprecations.html#DEP0134") 的时候——这个 `_tickCallback()` 其实就是前面的 `runNextTicks()`。

#### 五种执行时机埋点

在 ECMAScript modules 加载后，会手动去执行一次微任务：

    void ModuleWrap::Evaluate(...) {
      ...
      auto run = [&]() {
        MaybeLocal<Value> result = module->Evaluate(context);
        if (!result.IsEmpty() && microtask_queue)
          microtask_queue->PerformCheckpoint(isolate);
        return result;
      };
      
      ...
      result = run();
    }
    

而 `vm` 沙箱在非主 Context 执行的时候，一样也会有类似上面的逻辑：

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
    

> 上面的 `mtask_queue` 只有在非主 Context 的时候才会被设值。

至于 `InternalMakeCallback()`，它会在里面创建一个 `InternalCallbackScope` 实例，该实例在结束的时候，会手动执行微任务：

    void InternalCallbackScope::Close() {
      ...
      if (!tick_info->has_tick_scheduled()) {
        context->GetMicrotaskQueue()->PerformCheckpoint(isolate);
    
        perform_stopping_check();
      }
      ...
    }
    

而 `InternalMakeCallback()` 则通常用于唤起一些内置的回调函数，比如文件系统、网络 I/O 等等。

关于第四点，我们先看看 `runNextTicks()` 里面究竟是什么：

    function runNextTicks() {
      if (!hasTickScheduled() && !hasRejectionToWarn())
        runMicrotasks();
      if (!hasTickScheduled() && !hasRejectionToWarn())
        return;
    
      processTicksAndRejections();
    }
    

抛开不重要的内容不说，这里面调用了 `runMicrotasks()`，而其对应的是 C++ 侧的 `RunMicrotasks()`。

    static void RunMicrotasks(const FunctionCallbackInfo<Value>& args) {
      Environment* env = Environment::GetCurrent(args);
      env->context()->GetMicrotaskQueue()->PerformCheckpoint(env->isolate());
    }
    

最后一个，API 都未被公开过，直接就躺在了弃用列表，我们无需关心。其实上面这个 `runNextTicks()` 与 `process.nextTick()` 耦合挺深的，后面还会细讲。

我们老听宏任务微任务。看了 WHATWG 规范对其的定义，直到它会在什么时候执行了吧？而看了上面的解析，以前脑中不理解死记硬背的抽象概念是不是更具象化了？不过这仅代表 Node.js，不代表浏览器。每个浏览器的实现也不一样，甚至有些有可能直接用的 `kAuto` 策略。**Node.js 的微任务是自己一个个埋点找时机进去执行的**。

`process.nextTick()`
--------------------

`process.nextTick()` 并不属于事件循环内的概念。这里的 Tick 也与我们之前讲的事件循环的 Tick 不是一回事。它是 Node.js 中的 Tick 概念。在 `queueMicrotask()` 一节中，我们看见了像 `Timeout`、`Immediate` 这些时序相关 API 会在不同定时实例执行的间隔处模拟出一个 Tick，就是通过 `runNextTicks()` 来执行的。而 `process.nextTick()` 中的回调函数其中一种可能就是会在该处触发。

### `process.nextTick()` 做了什么？

我们先看看 [process.nextTick()](https://github.com/nodejs/node/blob/v18.14.1/lib/internal/process/task_queues.js#L103-L134 "https://github.com/nodejs/node/blob/v18.14.1/lib/internal/process/task_queues.js#L103-L134") 具体做了什么吧。

    const queue = new FixedQueue();
    ...
    
    function nextTick(callback) {
      validateFunction(callback, 'callback');
    
      if (process._exiting)
        return;
    
      let args;
      switch (arguments.length) {
        case 1: break;
        case 2: args = [arguments[1]]; break;
        case 3: args = [arguments[1], arguments[2]]; break;
        case 4: args = [arguments[1], arguments[2], arguments[3]]; break;
        default:
          args = new Array(arguments.length - 1);
          for (let i = 1; i < arguments.length; i++)
            args[i - 1] = arguments[i];
      }
    
      if (queue.isEmpty())
        setHasTickScheduled(true);
      ...
      const tickObject = {
        ...
        callback,
        args
      };
      ...
      queue.push(tickObject);
    }
    

前面参数相关逻辑与 `setTimeout()` 类似，不细讲了。这里用了一个 `queue` 去存储 Node.js 的当前 Tick 中需要执行的 `nextTick()` 回调们。`queue` 是一个由一个或多个环形队列拼接而成的链表，你就当它是一个大链表用就好了，或者当作是一个不定长的大环形队列。由于这不是一本《趣学算法、数据结构》，关于环形队列的内容可自行上网查找，或者关于 Node.js `FixedQueue` 的内容可自行翻看其[源码](https://github.com/nodejs/node/blob/v18.14.1/lib/internal/fixed_queue.js "https://github.com/nodejs/node/blob/v18.14.1/lib/internal/fixed_queue.js")。

总之就是用一个大链表存当前 Tick 的回调们。若该 `queue` 为空，则设置“Tick 中有回调”（`setHasTickScheduled(true)`）。该设置原理与之前的 `timeoutInfo[0]` 类似，都是一个可直通 JavaScript 侧与 C++ 侧的 `Int32Array`，然后此处以 `0` 作“无”，以 `1` 作有，也是存在 `Environment` 的对应成员变量中。

    const kHasTickScheduled = 0;
    
    function setHasTickScheduled(value) {
      tickInfo[kHasTickScheduled] = value ? 1 : 0;
    }
    

设置完该标识位后，构建一个 Tick 的回调函数相关对象，将其推入大链表即可。这么看来，虽然写法不同，不过这一段逻辑的流程与 `setImmediate()` 类似，只不过目标队列（链表）不同而已。

### 执行时机

那执行时机呢？其中一个就是刚才提到的 `runNextTicks()` 中，即各 `Timeout` 之类的执行间隙。回到这个 `runNextTicks()` 函数看一下：

    function runNextTicks() {
      if (!hasTickScheduled() && !hasRejectionToWarn())
        runMicrotasks();
      if (!hasTickScheduled() && !hasRejectionToWarn())
        return;
    
      processTicksAndRejections();
    }
    

如果大链表中没有 Tick 回调函数，那么直接只跑微任务。那难道如果有 Tick 回调函数，就不跑了吗？非也，`processTicksAndRejections()` 里面一样会去跑微任务，别急。

然后下一个 `if`，同样的条件再判断一遍，若符合则直接返回。既然条件相同，这个 `return` 可以并入上面那个条件语句吗？如：

    if (!hasTickScheduled() && !hasRejectionToWarn()) {
      runMicrotasks();
      return;
    }
    

也不行，因为可能微任务里面有执行 `process.nextTick()`，这个时候跑完微任务后，`hasTickScheduled()` 可不再是 `false` 了。

接下去我们就可以看看 `processTicksAndRejections()` 到底做了什么吧。

    function processTicksAndRejections() {
      let tock;
      do {
        while ((tock = queue.shift()) !== null) {
          ...
          try {
            const callback = tock.callback;
            if (tock.args === undefined) {
              callback();
            } else {
              const args = tock.args;
              switch (args.length) {
                case 1: callback(args[0]); break;
                case 2: callback(args[0], args[1]); break;
                case 3: callback(args[0], args[1], args[2]); break;
                case 4: callback(args[0], args[1], args[2], args[3]); break;
                default: callback(...args);
              }
            }
          } finally {
            ...
          }
    
          ...
        }
        runMicrotasks();
      } while (!queue.isEmpty() || processPromiseRejections());
      setHasTickScheduled(false);
      setHasRejectionToWarn(false);
    }
    

每个 Tick 里面，都逐个从大链表中拿 Tick 回调函数相关对象，直到拿完。每拿一个，都去跑一遍它的 `callback`，即 `process.nextTick()` 中传入的函数。**所以这个** **`callback`** **的执行时机就是在那些时序** **API** **触发的间隙逐个执行的**。

取完跑完后，就是执行微任务的时机了，`runMicrotasks()`。执行完后，可能 `queue` 中又被插入了，或者 `Promise` 有 Rejection，这个时候需要再过一遍 Tick 链表，然后再执行一遍微任务。所以这里是有可能出现死循环的。比如下面这段代码就永远跑不到 `setTimeout()` 的回调：

    function next() {
      process.nextTick(() => {
        queueMicrotask(next);
      });
    }
    
    next();
    setTimeout(() => {
      console.log('timeout');
      process.exit(0);
    }, 100);
    

至于原因，看明白上面的流程、`process.nextTick()` 与微任务的关系自然就明白了。

当外层大循环也结束后，开始扫尾，比如将 `hasTickScheduled` 等设为 `false`——毕竟 `queue` 真被榨干了。

那么，除了这个间隙时机会执行 Tick 回调，还有什么时机会呢？Node.js 会在启动的时候，将前面的 `processTicksAndRejections()` 函数[注册为 Tick Callback](https://github.com/nodejs/node/blob/v18.14.1/lib/internal/process/task_queues.js#L166 "https://github.com/nodejs/node/blob/v18.14.1/lib/internal/process/task_queues.js#L166")，该 Callback 同样被存在 `Environment` 中。这个 Callback 函数的执行时机与微任务在 [MakeCallback() 里面的时机一样](https://github.com/nodejs/node/blob/v18.14.1/src/api/callback.cc#L96-L164 "https://github.com/nodejs/node/blob/v18.14.1/src/api/callback.cc#L96-L164")，并且它们的执行条件也与上面的 `runNextTicks()` 类似——都是如果没有 Tick 任务，那就光执行微任务，否则就执行这个 `processTicksAndRejections()`。

    void InternalCallbackScope::Close() {
      ...
      if (!tick_info->has_tick_scheduled()) {
        context->GetMicrotaskQueue()->PerformCheckpoint(isolate);
    
        perform_stopping_check();
      }
      ...
      
      if (!tick_info->has_tick_scheduled() && !tick_info->has_rejection_to_warn()) {
        return;
      }
      
      ...
      
      Local<Function> tick_callback = env_->tick_callback_function();
    
      ...
    
      if (tick_callback->Call(context, process, 0, nullptr).IsEmpty()) {
        failed_ = true;
      }
      
      ...
    }
    

上面这段代码的逻辑翻译一下，基本上等同于 JavaScript 侧的 `runNextTicks()`。所以，`process.nextTick()` 回调执行时机究竟是什么呢？是 `queueMicrotask()` 那一节中提到的 3、4 两个时机：

1.  Node.js 内部一些 `callback` 执行完毕后；
2.  `Timeout`、`Immediate` 触发执行的间隙。

### `process.nextTick()` 与微任务的关系

而且它与微任务的关系是，上面两种情况发生后，若无 Tick 回调，也必定会执行微任务；若有 Tick 回调，则先执行 Tick 回调，然后执行微任务，若期间有新的 Tick 回调插入，那么就继续执行，循环往复，不会跳出该 Tick。

现在知道为什么我一开始说 `process.nextTick()` 跟事件循环无关吧，它更像是一批微任务，而 Node.js 在之前是没有微任务的概念的。

Node.js 自身也在文档中说过 `process.nextTick()` 以及 `queueMicrotask()` 的关系，以及在什么情况下选用哪个的说明。在小册中就不展开了，官方有的东西直接看官方就好了，经我嘴一说说不定词不达意了。

> [When to use queueMicrotask() vs. process.nextTick()](https://nodejs.org/dist/latest-v18.x/docs/api/process.html#when-to-use-queuemicrotask-vs-processnexttick "https://nodejs.org/dist/latest-v18.x/docs/api/process.html#when-to-use-queuemicrotask-vs-processnexttick")

而关于上面那个死循环的代码，我们可以出来几个变种，大家可以看看分别的运行结果是什么，再想想看为什么：

    // 1
    function next() {
      process.nextTick(() => {
        Promise.reject().catch(next);
      });
    }
    
    next();
    setTimeout(() => {
      console.log('timeout');
      process.exit(0);
    }, 100);
    
    // 2
    function next() {
      process.nextTick(next);
    }
    
    next();
    setTimeout(() => {
      console.log('timeout');
      process.exit(0);
    }, 100);
    
    // 3
    function next() {
      process.nextTick(() => {
        setImmediate(next);
      });
    }
    
    next();
    setTimeout(() => {
      console.log('timeout');
      process.exit(0);
    }, 100);
    
    // 4
    function next() {
      queueMicrotask(() => {
        process.nextTick(next);
      });
    }
    
    next();
    setTimeout(() => {
      console.log('timeout');
      process.exit(0);
    }, 100);
    

时序 API 小结
---------

时序类的 API 是 Node.js 中异步相关非常重要的组成部分。我们从上中下三章为大家剖析了 `setTimeout()`、`setInterval()`、`setImmediate()`、`process.nextTick()` 以及微任务在 Node.js 中是如何执行的。

这其中，前面三项是通过 libuv 事件循环的机制达成的时序目的。`setTimeout()` 与 `setInterval()` 可归为一类，其实体都是 `Timeout`，只是构造函数参数不同，而其执行顺序是根据**薅羊毛算法**进行的；`setImmediate()` 则是 `Immediate` 实体，并在事件循环中通过空转事件来保证其即时性，它的逻辑就平平无奇，要注意的是它的**防重入逻辑**。而微任务与 `process.nextTick()` 则是另一类，它们虽然是异步时序相关，但**并非事件循环里的内容，而是通过特定位置** **埋点** **的方式，将其执行时机一个个埋在对应的地方**。

微任务与 `process.nextTick()` 的执行阶段几乎一致，都是在一大段逻辑里面分别先后一次性执行 Tick 任务以及微任务。**`process.nextTick()`** **任务** **队列** **是由** **Node.js** **管理的，而微任务的任务队列则直接由** **V8** **提供**。

在这三章里面，还给大家提供了个小插曲，拓宽思路，看了看如何将**薅羊毛**的过程变成**反复横跳**的过程，以此来修复 `Timeout` 的时序问题。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b17d8db8b364ab5b1b6622e94640441~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=301&h=231&s=107936&e=png&b=586b33)

![9150e4e5gy1g63ilh1p83g203c03naa2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e20f89f407b04375aa2d16b9786e7a95~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=120&h=131&s=10526&e=gif&f=4&b=fcfafa)