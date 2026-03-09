JavaScript 是事件驱动的。不过在 ECMAScript 上并没有很好地体现出来，因为事件循环中的“事件”通常需要结合运行时才能发挥价值。比如浏览器中的各种 DOM 事件，或者 Node.js 中的各种 I/O 事件。

浏览器中的事件接口与 Node.js 中的事件接口是不一样的。

`events` 模块
-----------

Node.js 的 `events` 模块在 v0.1 的版本中就存在了，毕竟很多 API 离了它就不行。我们来看看有哪些直接面向开发者的类是继承自 `events.EventEmitter` 的，这里给出部分继承关系。大家凡是在 Node.js 文档中看到某个类的大纲中有 `Event:` 字样，那么它就是一个 `EventEmitter` 的子类。

![23流程图.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09eac9fc879a4447942f237e2cb3191e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2842&h=1402&s=271049&e=png&b=fefefe)

这里我们介绍一个事件对象的构造、新增与触发。篇幅问题就不介绍删除（或者说卸载）了。

### 构造函数

在 `EventEmitter` 中，最重要的就是 `_events` 对象了。它是一个二维 JSON，用 TypeScript 表示，`_events` 的类型为 `Record<string | symbol, (...args: any[]) => void | ((...args: any[]) => void)[]>`。键名是个字符串或 `Symbol`，键值是个函数或函数数组。这个 JSON 对象在 `EventEmitter` 构造函数的时候被初始化，而且为了该键值对中的各种 `key` 不与原生对象的 `key` 冲突，特意将 `__proto__` 设为了 `null`。

    function EventEmitter(opts) {
      EventEmitter.init.call(this, opts);
    }
    
    EventEmitter.init = function(opts) {
      if (this._events === undefined ||
          this._events === ObjectGetPrototypeOf(this)._events) {
        this._events = { __proto__: null };
        this._eventsCount = 0;
      }
    
      this._maxListeners = this._maxListeners || undefined;
    
    
      if (opts?.captureRejections) {
        validateBoolean(opts.captureRejections, 'options.captureRejections');
        this[kCapture] = Boolean(opts.captureRejections);
      } else {
        this[kCapture] = EventEmitter.prototype[kCapture];
      }
    };
    

首先是将 `_events` 设置为 `{ __proto__: null }`，然后将计数设为 `0`。然后是 `_maxListeners`。Node.js 中的 `_maxListeners` 并不会做硬限制卡点，而是在监听数超过后，打印一行“可能泄露”的警告。

然后是设置是否要捕获 `Promise` 中的 `rejection`。默认为 `false`。下面两个 `if` 的意思是，如果 `opts` 中设置了 `captureRejections`，那么直接将其 `this[kCapture]` 设为传进来的值；如果 `opts` 中未设置，那么将 `EventEmitter.prototype` 这原型链中的 `[kCapture]` 给赋值到 `this` 上。

这里有点奇怪，从原型链上赋不赋值过来，效果都一样啊，为什么要“多此一举”？主要因为后续去访问这个 `[kCapture]` 会比较频繁，在访问的时候可以减少一次原型链寻址的长度也是某种意义上的“性能优化”。

这里还有一个比较奇怪的点是，为什么这个初始化不直接在 `EventEmitter` 构造函数里面做，而是要放在 `EventEmitter.init()` 里呢？这是因为，有些模块在加载的时候要对 `EventEmitter` 构造函数做一个全局的 Hack。如果所有逻辑都放在 `EventEmitter` 构造函数本体，那么就无从 Hack；而如果把初始化逻辑放到 `EventEmitter.init()` 中，那么另外的模块只需要去 Hack 这个 `EventEmitter.init()` 函数，就能做到把之后所有的 `EventEmitter` 构造函数都进行改动。——`domain` 模块就是[这么做的](https://github.com/nodejs/node/blob/v18.16.0/lib/domain.js#L458-L475 "https://github.com/nodejs/node/blob/v18.16.0/lib/domain.js#L458-L475")。

### 新增监听

新增监听有好几个名字。`on`、`once`、`addListener`、`prependListener` 等。其中 `once` 是只监听一次，一旦触发就卸载监听。`addListener` 的核心代码是这样的：

    function _addListener(target, type, listener, prepend) {
      let m;
      let events;
      let existing;
      ...
    
      events = target._events;
      if (events === undefined) {
        events = target._events = { __proto__: null };
        target._eventsCount = 0;
      } else {
        if (events.newListener !== undefined) {
          target.emit('newListener', type,
                      listener.listener ?? listener);
          events = target._events;
        }
        existing = events[type];
      }
    
      if (existing === undefined) {
        events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          existing = events[type] =
            prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
    
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          const w = genericNodeError(
            `Possible EventEmitter memory leak detected. ${existing.length} ${String(type)} listeners ` +
            `added to ${inspect(target, { depth: -1 })}. Use emitter.setMaxListeners() to increase limit`,
            { name: 'MaxListenersExceededWarning', emitter: target, type: type, count: existing.length });
          process.emitWarning(w);
        }
      }
    
      return target;
    }
    

有四个参数，`EventEmitter` 本体、监听名、监听函数，以及是 `prepend` 还是 `append`——这影响到调用顺序。

由于整个 `_events` 只是在变量名上加了个下划线，并不是真正的私有变量。外部开发者是可以篡改该对象的，自然也可以删除。纵然我们在构造函数里面初始化了这个 `_events`，但我们仍要在第一个 `if` 中，先判断它是否 `undefined`。

然后是判断一下有没有监听 `newListener` 事件。该事件会在一个 `EventEmitter` 实例被新增任意一个事件时被调用，告知其监听函数现在多了某个监听。接着判断一下该事件之前有没有被监听过（`_events` 对应字段上有没有挂东西）。

> 这个 `newListener` 我们在[第十四章](https://juejin.cn/book/7196627546253819916/section/7197302070905405451 "https://juejin.cn/book/7196627546253819916/section/7197302070905405451")中提到过，Node.js 中的 `process` 对于各种 signal 的监听就是通过 `newListener` 这个事件来做到的。具体可以返回地十四章复习一下。

如果 `_events` 对应字段上没有挂任何内容，则直接将 `_events[type]` 赋值为监听函数，对 `_eventsCount` 进行累加操作；若 `_events` 字段上挂了内容，则判断其类型。若类型是个函数，那么将该函数与传进来的函数一起组成一个数组，其顺序视第四个参数 `prepend` 或者 `append` 而定；若类型已然是个数组，则视第四个参数而定是要对数组进行 `unshift()` 还是 `push()`。

最后，判断一下当前监听的类型数 `_eventsCount` 是否超过最大值，若是则打印泄露警告。

#### `on` 与 `addListener`

这俩没什么说的，就是简单地调用。

        EventEmitter.prototype.addListener = function addListener(type, listener) {
          return _addListener(this, type, listener, false);
        };
    
        EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    

#### `once`

这个函数比 `on` 多了点东西。它传进去的 `listener` 是经过包装的。

        function onceWrapper() {
          if (!this.fired) {
            this.target.removeListener(this.type, this.wrapFn);
            this.fired = true;
            if (arguments.length === 0)
              return this.listener.call(this.target);
            return this.listener.apply(this.target, arguments);
          }
        }
    
        function _onceWrap(target, type, listener) {
          const state = { fired: false, wrapFn: undefined, target, type, listener };
          const wrapped = onceWrapper.bind(state);
          wrapped.listener = listener;
          state.wrapFn = wrapped;
          return wrapped;
        }
    
        EventEmitter.prototype.once = function once(type, listener) {
          checkListener(listener);
    
          this.on(type, _onceWrap(this, type, listener));
          return this;
        };
    

它把 `listener` 包装成了一个 `onceWrapper` 函数，并与元数据进行 `this` 绑定。一旦事件触发，响应的是这个 `onceWrapper` 函数，该函数会去 `this` 中 `EventEmitter` 中移除事件监听本身，然后调用原传进来的 `listener`。

### 事件触发

事件是由触发方调用 `EventEmitter.prototype.emit()` 来进行的。比如 `net` 中的 `Server`，就是给 C++ 侧传入一个 `onconnection` 函数，C++ 在建立连接后会调用这个函数，而这个 `onconnection` 函数中有一行就是调用 [self.emit('connection')](https://github.com/nodejs/node/blob/v18.16.0/lib/net.js#L2025 "https://github.com/nodejs/node/blob/v18.16.0/lib/net.js#L2025") 来触发事件的。

事件触发具体做了哪些事呢？如果简单来讲，就是两步：

1.  通过 `type` 拿到 `_events` 中的相关键值，若不存在则直接忽略；
    
2.  根据键值类型不同，做不同反应：
    
    *   若是函数，则直接调用；
        
    *   若是数组，则逐个调用里面的函数。
        

说起来简单，但是边边角角还是挺多内容的。比如，`error` 是个特殊事件，如果有人触发了 `error` 事件，但没有监听函数，则会抛出异常。下面就是 `emit` 触发事件的[代码](https://github.com/nodejs/node/blob/v18.16.0/lib/events.js#L453-L539 "https://github.com/nodejs/node/blob/v18.16.0/lib/events.js#L453-L539")。

先是判断是不是 `error` 事件，并标记一下：

        EventEmitter.prototype.emit = function emit(type, ...args) {
          let doError = (type === 'error');
    

然后看看 `_events` 是不是个 `undefined`。如果是 `undefined`，则说明肯定没有监听 `error` 事件，这个时候就看有没有监听 `kErrorMonitor` 事件。

这里的 `kErrorMonitor` 就是 `events.errorMonitor`。一个用于标识“监控错误事件”的 Symbol。因为如果我们直接监听了 `error` 事件，那么通常情况下触发错误时程序不会抛出异常。如果有一些“日志监控”等逻辑想要去“记录错误”，但不想阻止它抛出异常，就无法通过监听 `error` 事件做到了。

这个需求最初来自 OpenTelemetry 的 JavaScript SDK（[Issue 225](https://github.com/open-telemetry/opentelemetry-js/issues/225 "https://github.com/open-telemetry/opentelemetry-js/issues/225")）。它想以“旁观者”的身份去记录错误，但不想阻止程序原有的抛错行为。于是 Node.js 就为此新增了一个 `events.errorMonitor` 的事件。所以一旦有错误事件发生，那么无论如何都触发一下这个 `errorMonitor` 事件，以让“旁观者”记录一下。

记录完后，再重置一下 `doError` 的值，即看看 `events.error` 是不是存在——有没有监听过 `error` 事件。

          const events = this._events;
          if (events !== undefined) {
            if (doError && events[kErrorMonitor] !== undefined)
              this.emit(kErrorMonitor, ...args);
            doError = (doError && events.error === undefined);
          } else if (!doError)
            return false;
    

处理完“监控错误事件”之后，开始真正处理“错误事件”了。如果重置 `doError` 的值后仍然是 `true`，也就是说没有监听 `error` 事件，那就要着手抛出异常了。错误为 `args` 的第 `0` 个元素。

          if (doError) {
            let er;
            if (args.length > 0)
              er = args[0];
    

然后判断一下错误类型，如果它是个 `Error` 类型，那么在抛出异常前，为其装一个 `kEnhanceStackBeforeInspector` 字段的函数，这个函数会在 Node.js 进入 Fatal Error（未捕获异常导致的进程崩溃）时候被调用以输出经过美化后的错误堆栈。如果我们在这里不这么做，那么我们看到的“导致进程崩溃”的异常错误堆栈会是异常根因，即产生异常的地方。而这里增强堆栈后，我们不仅能看到根因，还能多看一层，是因为“没有监听 `error` 事件导致的抛错（Unhandled 'error' event）”。

代码中的具体逻辑可以不用纠结，里面就是一些错误堆栈字符串的处理等等。只要知道这段代码是增强 Fatal Error 错误堆栈即可。增强完后，仍旧抛出异常。

            if (er instanceof Error) {
              try {
                const capture = {};
                Error.captureStackTrace(capture, EventEmitter.prototype.emit);
                Object.defineProperty(er, kEnhanceStackBeforeInspector, {
                  __proto__: null,
                  value: enhanceStackTrace.bind(this, er, capture),
                  configurable: true,
                });
              } catch {
                // Continue regardless of error.
              }
    
              throw er; // Unhandled 'error' event
            }
    

Node.js，或者说 JavaScript 是很随意的。我们可以抛出任何类型的异常。上面的代码讲的是 `error` 事件中的内容是 `Error` 类型的处理。

非 `Error` 类型的时候，先通过 [util.inspect()](https://nodejs.org/dist/latest-v18.x/docs/api/util.html#utilinspectobject-options "https://nodejs.org/dist/latest-v18.x/docs/api/util.html#utilinspectobject-options") 对异常内容进行格式化。如果格式化失败，还是兜底回异常本身。然后再根据该格式化内容新建一个 Unhandle 错误，最终抛出。

            let stringifiedEr;
            try {
              stringifiedEr = inspect(er);
            } catch {
              stringifiedEr = er;
            }
    
            // At least give some kind of context to the user
            const err = new ERR_UNHANDLED_ERROR(stringifiedEr);
            err.context = er;
            throw err; // Unhandled 'error' event
          }
    

异常处理完之后，开始进入正题了。这个就是我在最开始讲的两步走。如果事件不存在，则忽略。

          const handler = events[type];
    
          if (handler === undefined)
            return false;
    

否则根据类型不同进行处理。如果是函数，直接通过 `apply` 进行调用。然后如果返回结果不是 `undefined` 和 `null`，就通过 `addCatch` 去处理可能的 `Promise` 的 `rejection`。

          if (typeof handler === 'function') {
            const result = handler.apply(this, args);
    
            // We check if result is undefined first because that
            // is the most common case so we do not pay any perf
            // penalty
            if (result !== undefined && result !== null) {
              addCatch(this, result, type, args);
            }
    

如果是数组，那么就逐个处理，逐个 `addCatch()`。

          } else {
            const len = handler.length;
            const listeners = arrayClone(handler);
            for (let i = 0; i < len; ++i) {
              const result = listeners[i].apply(this, args);
    
              // We check if result is undefined first because that
              // is the most common case so we do not pay any perf
              // penalty.
              // This code is duplicated because extracting it away
              // would make it non-inlineable.
              if (result !== undefined && result !== null) {
                addCatch(this, result, type, args);
              }
            }
          }
    

最终，返回 `true`。

          return true;
        };
    

`EventEmitter` 的构造函数中有一个 `captureRejections` 的配置，会被设置到 `kCapture` 中。若设为 `true`，那么在 `emit()` 时若对应监听函数是个 `async` 函数，或者它的返回值是个类 `Promise` 对象，那么会去捕获它的 `.catch()`，并将捕获的异常嫁接给 `error` 事件。

这个逻辑就是 `addCatch()` 里面做的事了。直接调用 `promise`（也就是外面传进来的 `result`）的 `.then()`。第一个参数是成功的回调，第二个参数相当于 `.catch()`。

        function addCatch(that, promise, type, args) {
          if (!that[kCapture]) {
            return;
          }
    
          try {
            const then = promise.then;
    
            if (typeof then === 'function') {
              then.call(promise, undefined, function(err) {
                process.nextTick(emitUnhandledRejectionOrErr, that, err, type, args);
              });
            }
          } catch (err) {
            that.emit('error', err);
          }
        }
    

在 `.catch()` 中，直接通过 `process.nextTick()` 来将错误提交到 `emitUnhandledRejectionOrErr()` 函数中。`kRejection` 就是 `Symbol.for('nodejs.rejection')`，就是 Node.js 官方文档中说的用于接收这类异常的函数，需要[开发者自行设置](https://nodejs.org/dist/latest-v18.x/docs/api/events.html#emittersymbolfornodejsrejectionerr-eventname-args "https://nodejs.org/dist/latest-v18.x/docs/api/events.html#emittersymbolfornodejsrejectionerr-eventname-args")。如果没有设置 `kRejection`，那么就需要触发 `error` 事件。这里触发时需要强行将 `kCapture` 设置为 `false`，否则如果里面触发的时候又是一个 `rejection`，那么子子孙孙无穷尽，会变成一个 `rejection` 的套娃，最后爆栈崩溃。

        function emitUnhandledRejectionOrErr(ee, err, type, args) {
          if (typeof ee[kRejection] === 'function') {
            ee[kRejection](err, type, ...args);
          } else {
            const prev = ee[kCapture];
            try {
              ee[kCapture] = false;
              ee.emit('error', err);
            } finally {
              ee[kCapture] = prev;
            }
          }
        }
    

触发完 `error` 事件之后，再把原来的 `kCapture` 恢复回去就好了。

`EventTarget`
-------------

`EventTarget` 是 Web API 中可以接受事件的 `interface`，并且我们可以为其创建监听器。在浏览器环境中，好多对象都实现了这个接口，比如 `Node`、`XMLHttpRequest`、`Window` 等。它提供了一些方法，如：

*   `addEventListener`；
    
*   `removeEventListener`；
    
*   `dispatchEvent`。
    

这三个方法分别用于注册、删除和触发事件。对比一下 Node.js 的 `events` 模块，是不是异曲同工？虽然 Node.js 实现了 `events` 这个异曲同工的模块，但为了符合 Web-interoperable Runtime 规范，还是实现了 `EventTarget` 类。毕竟在 Winter 中不止一个类是基于它的。如：

*   [BroadcastChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel "https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel")；
    
*   [Performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance "https://developer.mozilla.org/zh-CN/docs/Web/API/Performance")；
    
*   [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController "https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController")；
    
*   [MessagePort](https://developer.mozilla.org/zh-CN/docs/Web/API/MessagePort "https://developer.mozilla.org/zh-CN/docs/Web/API/MessagePort")。
    

在 `EventTarget` 触发事件的时候，得到的事件对象是一个 `Event` 的接口相关类。

### 构造函数

构造函数非常简单，主要就是初始化一些内部变量。

        function initEventTarget(self) {
          self[kEvents] = new Map();
          self[kMaxEventTargetListeners] = EventEmitter.defaultMaxListeners;
          self[kMaxEventTargetListenersWarned] = false;
        }
    
        class EventTarget {
          static [kIsEventTarget] = true;
    
          constructor() {
            initEventTarget(this);
          }
          
          ...
    

把 `initEventTarget()` 函数抽出来是因为有其它地方要用到这个函数。

### 新增监听——`addEventListener()`

这个写起来就比 `events` 模块的 `EventEmitter` 规矩多了——毕竟 Spec 也比较冗杂。最开始先按规范判断边界条件，调用的时候的 `this` 是不是对的。然后再判断参数数量。

        function isEventTarget(obj) {
          return obj?.constructor?.[kIsEventTarget];
        }
    
        class EventTarget {
          ...
          addEventListener(type, listener, options = kEmptyObject) {
            if (!isEventTarget(this))
              throw new ERR_INVALID_THIS('EventTarget');
            if (arguments.length < 2)
              throw new ERR_MISSING_ARGS('type', 'listener');
    

紧接着验证一下 `options` 参数，并把内部一些信息解构出来。具体[解构逻辑](https://github.com/nodejs/node/blob/v18.16.0/lib/internal/event_target.js#L968-L985 "https://github.com/nodejs/node/blob/v18.16.0/lib/internal/event_target.js#L968-L985")就不放出来了，大家可以自行研究。

            const {
              once,
              capture,
              passive,
              signal,
              isNodeStyleListener,
              weak,
            } = validateEventListenerOptions(options);
    

然后验证传进来的 `listener` 是否合法。合法的 `listener` 指的是下面任意内容：

*   `null`；
*   一个函数；
*   一个包含 `handleEvent()` 方法的对象。

具体的[验证逻辑](https://github.com/nodejs/node/blob/v18.16.0/lib/internal/event_target.js#L951-L966 "https://github.com/nodejs/node/blob/v18.16.0/lib/internal/event_target.js#L951-L966")也不放出来了，大家可以自行研究。这里如果是 `null`，就会返回 `false`，这个时候 Node.js 会打印出一条下面的 Warning 并退出这个函数；后两者的话会返回 `true`，会将 `type` 进行字符串化；如果是其它情况，则会在 `validateEventListener()` 内部就抛出异常给上层捕获。

            if (!validateEventListener(listener)) {
              const w = new Error(`addEventListener called with ${listener}` +
                                  ' which has no effect.');
              w.name = 'AddEventListenerArgumentTypeWarning';
              w.target = this;
              w.type = type;
              process.emitWarning(w);
              return;
            }
            type = String(type);
    

下面是对于 `options` 中 `signal` 这个参数的处理。如果刚监听这会儿已经 `aborted` 了，就直接返回。否则监听 `signal` 的 `abort` 事件，并且在回调函数中将本次 `EventTarget` 的监听函数给移除掉。

这里注意，`signal` 传进来得是一个 `AbortController`。我们在上面提过，`AbortController` 本身就是一个 `EventTarget` 的子类，可以监听。

            if (signal) {
              if (signal.aborted) {
                return;
              }
    
              signal.addEventListener('abort', () => {
                this.removeEventListener(type, listener, options);
              }, { once: true, [kWeakHandler]: this });
            }
    

后面就是从 `this[kEvents]` 这个 `Map` 中取出名为 `type` 的链表，看看曾经是否有添加过对应的监听。这个逻辑就跟 `EventEmitter` 类似了。

这里有一个概念，存某一类型监听的容器是一条链表，而不再是数组。所以从 `Map` 中取出的实际上是一个元信息对象，里面有链表长度，以及链表头两个信息。

如果没有添加过对应监听，及从 `Map` 中取出的是 `undefined`，那么新建一个链表元信息，并且新建一个链表节点（`Listener`），并将其塞入链表头（`Listener` 构造函数中做的逻辑）。

做完这些后，调用 `this[kNewListener]()` 方法来判断一下监听数有没有到达上限，若到达上限就打印一个警告。这个方法内部具体就不讲解了。

打印完警告后，再将该链表元信息对象塞回 `Map` 中，就算完成了，退出函数。

            let root = this[kEvents].get(type);
    
            if (root === undefined) {
              root = { size: 1, next: undefined };
              new Listener(root, listener, once, capture, passive,
                           isNodeStyleListener, weak);
              this[kNewListener](
                root.size,
                type,
                listener,
                once,
                capture,
                passive,
                weak);
              this[kEvents].set(type, root);
              return;
            }
    

如果之前有添加过同类监听，那么我们拿到的 `root` 就是一个链表元信息。这个时候我们从中取出链表头，并逐一遍历整条链表，看看存不存在同样的监听对象或者函数，也就是说该监听 `listener` 函数之前有没有已经添加过了——主要对比 `listener` 和 `capture`。

            let handler = root.next;
            let previous = root;
    
            while (handler !== undefined && !handler.same(listener, capture)) {
              previous = handler;
              handler = handler.next;
            }
    

如果一圈下来发现有添加过了，那么直接忽略这次添加，直接退出。

            if (handler !== undefined) { // Duplicate! Ignore
              return;
            }
    

如果没有，那么新建一个监听节点，并把它加入链表尾部（`Listener` 构造函数中的逻辑），链表元信息加一，打印可能得监听数上限警告。

            new Listener(previous, listener, once, capture, passive,
                         isNodeStyleListener, weak);
            root.size++;
            this[kNewListener](root.size, type, listener, once, capture, passive, weak);
          }
    

至此，整个新增监听逻辑结束。

其实整个逻辑与 `EventEmitter` 真的类似，只不过多了一个查重的逻辑，另外监听的函数数组变成了一条链表。

### 事件触发——`dispatchEvent()`

`EventTarget` 的事件触发是 `dispatchEvent()` 方法。最开始的逻辑仍然是判断 `this` 的合法性，以及参数的合法性，得是一个 `Event` 对象。

          dispatchEvent(event) {
            if (!isEventTarget(this))
              throw new ERR_INVALID_THIS('EventTarget');
            if (arguments.length < 1)
              throw new ERR_MISSING_ARGS('event');
    
            if (!(event instanceof Event))
              throw new ERR_INVALID_ARG_TYPE('event', 'Event', event);
    

然后看看这个 `event` 对象是否已经被触发过了。如果被触发过了，会留下 `kIsBeingDispatched` 的痕迹。

            if (event[kIsBeingDispatched])
              throw new ERR_EVENT_RECURSION(event.type);
    

再接下去，交给 `this[kHybridDispatch]()` 处理事件本身，这里面传进去之后，会改变 `event` 的一些相关内容。最终判断 `event` 是否 `defaultPrevented`，通过这个来决定方法最终返回值。

            this[kHybridDispatch](event, event.type, event);
    
            return event.defaultPrevented !== true;
          }
    

而 `this[kHybridDispatch]()` 才是核心逻辑。前面就是小打小闹。这里面逻辑比较冗杂，还夹杂了 Node.js 特有的 `NodeEventTarget` 逻辑。下面我就把这个方法分拆一下，删减、修改一些内容，便于理解。

这里面的 `nodeValue` 我们不用管，至少这条链路走下来的逻辑用不到。首先是先将 `kIsBeingDispatched` 置为 `true`，这个标识在前面逻辑中有用到。然后从 `kEvents` 的 `Map` 中取出链表，若链表不存在则说明没有任何监听，那么重置 `kIsBeingDispatched` 为 `false`。

          [kHybridDispatch](nodeValue, type, event) {
            event[kTarget] = this;
            event[kIsBeingDispatched] = true;
            
            const root = this[kEvents].get(type);
            if (root === undefined || root.next === undefined) {
              event[kIsBeingDispatched] = false;
              return true;
            }
    

接着开始遍历链表。`handler` 就是之前新建的 `Listener` 对象，里面的各字段在 MDN 上的 `addEventListener()` 文档中都能找到[对应含义](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options")。

            let handler = root.next;
            let next;
    
            while (handler !== undefined &&
                   (handler.passive || event?.[kStop] !== true)) {
              next = handler.next;
    

在每次遍历中，先看看这个监听是否已被移除，或者是只触发一次。由于每次遍历最后，会将 `handler` 变为 `next`，而如果当前正在处理的 `listener` 中的逻辑是删除之后的这个 `listener`，那么下次循环还是会拿到这个 `next`。所以“删除逻辑”中要给 `handler` 一个 `removed` 的标识，表示它被删除了。一旦发现它被删除了，就跳过当前的 `handler`，直接处理它的 `next`。

> 想象一下这个逻辑就明白了：
> 
>           const et = new EventTarget();
>           const listener = () => { throw new Error('这里不会被调用。'); };
>           et.addEventListener('foo', (e) => {
>             et.removeEventListener('foo', listener);
>           });
>           et.addEventListener('foo', listener);
>           et.dispatchEvent(new Event('foo'));
>     

              if (handler.removed) {
                handler = next;
                continue;
              }
              if (handler.once) {
                handler.remove();
                root.size--;
                const { listener, capture } = handler;
              }
    

处理完这些逻辑后，就开始调用 `listener` 本体了。调用完后，把 `kIsBeingDispatched` 给重新赋值为 `false`。然后同样对可能的 `Promise` 结果进行 `catch` 并触发 Uncaught Exception 处理（`addCatch`，不过这里的 `addCatch` 逻辑与 `EventEmitter` 不是完全相同的，但是类似）。如果在这一段逻辑中有任何异常，那么触发 Uncaught Exception。

              try {
                const arg = event;
                const callback = handler.weak ?
                  handler.callback.deref() : handler.callback;
                let result;
                if (callback) {
                  result = Function.prototype.call(callback, this, arg);
                  arg[kIsBeingDispatched] = false;
                }
                if (result !== undefined && result !== null)
                  addCatch(result);
              } catch (err) {
                emitUncaughtException(err);
              }
    

处理完后，把 `handler` 给改成我们之前讲的 `next`，开启下一轮循环。

              handler = next;
            }
    

最后，把 `event` 的 `kIsBeingDispatched` 也设置为 `false`，就完成了整段逻辑了。

            event[kIsBeingDispatched] = false;
          }
    

本章小结
----

本章为大家介绍了 Node.js 的重要机制之一 `events` 模块，以及其相关的 Web-interoperable Runtime 的类 `EventTarget`。二者在行为上类似，都是事件机制，都有新增监听、删除监听，以及触发事件的功能。`events` 自 Node.js 问世来，很早就有了这个能力，是 Node.js 各种其它内置模块和生态模块的重要支柱。而 `EventTarget` 主要是支持一些 Web API 而做的，因为有一些 Web API 就是 `EventTarget` 的子类。

本章为大家解析了事件模块的构造函数、新增监听函数以及触发函数的代码，里面还是可以多回味一下。