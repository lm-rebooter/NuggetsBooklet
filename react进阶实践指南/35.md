## 一 前言

之前介绍了在 legacy 模式下的 state 更新流程，这种模式下的批量更新原理本质上是通过不同的更新上下文开关 Context ，比如 batch 或者 event 来让更新变成‘可控的’。那么在 v18 conCurrent 下 React 的更新又有哪些特点呢？这就是本章节探讨的问题，本章节涵盖的知识点如下：

* concurrent 模式下的 state 更新流程是什么 ？
* 在同步异步条件下，state 更新有什么区别 ？
* 主流框架中更新处理方式。


## 二 主流框架中更新处理方式

在正式讲解 v18 concurrent 之前，先来看一下主流框架中两种批量更新的原理。

### 1 第一种：微任务｜宏任务实现集中更新

第一种批量更新的实现，就是基于**宏任务** 和 **微任务** 来实现。

先来描述一下这种方式，比如每次更新，我们先并不去立即执行更新任务，而是先把每一个更新任务放入一个待更新队列 `updateQueue` 里面，然后 js 执行完毕，用一个微任务统一去批量更新队列里面的任务，如果微任务存在兼容性，那么降级成一个宏任务。这里**优先采用微任务**的原因就是微任务的执行时机要早于下一次宏任务的执行。

典型的案例就是 vue 更新原理，`vue.$nextTick`原理 ，还有接下来要介绍的 v18 中 `scheduleMicrotask` 的更新原理。

以 vue 为例子我们看一下 nextTick 的实现：

> runtime-core/src/scheduler.ts
```js
const p = Promise.resolve() 
/* nextTick 实现，用微任务实现的 */
export function nextTick(fn?: () => void): Promise<void> {
  return fn ? p.then(fn) : p
}
```

* 可以看到 nextTick 原理，本质就是 `Promise.resolve()` 创建的微任务。

大致实现流程图如下所示：

![4.jpeg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/820a397dc96e4b66a90ad74251bb02e6~tplv-k3u1fbpfcp-watermark.image?)

我们也可以来模拟一下整个流程的实现。

```js
class Scheduler {
    constructor(){
        this.callbacks = []
        /* 微任务批量处理 */
        queueMicrotask(()=>{
            this.runTask()
        })
    }
    /* 增加任务 */
    addTask(fn){
        this.callbacks.push(fn)
    }
    runTask(){
        console.log('------合并更新开始------')
        while(this.callbacks.length > 0){
            const cur = this.callbacks.shift()
            cur()
        }
        console.log('------合并更新结束------')
        console.log('------开始更新组件------')
    }
}
function nextTick(cb){
    const scheduler = new Scheduler()
    cb(scheduler.addTask.bind(scheduler))
}

/* 模拟一次更新 */
function mockOnclick(){
   nextTick((add)=>{
       add(function(){
           console.log('第一次更新')
       })
       console.log('----宏任务逻辑----')
       add(function(){
        console.log('第二次更新')
       })
   })
}

mockOnclick()
```

我们来模拟一下具体实现细节：
* 通过一个 Scheduler 调度器来完成整个流程。
* 通过 addTask 每次向队列中放入任务。
* 用 queueMicrotask 创建一个微任务，来统一处理这些任务。
* mockOnclick 模拟一次更新。我们用 nextTick 来模拟一下更新函数的处理逻辑。

看一下打印效果：


![3.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/115940d55be44d4797403c97b43b5f46~tplv-k3u1fbpfcp-watermark.image?)


### 2 第二种：可控任务实现批量更新

还有一种方式，通过拦截把任务变成**可控的**，典型的就是 React v17 之前的 batchEventUpdate 批量更新，这个方式接下来会讲到，这里也不赘述了。这种情况的更新来源于对事件进行拦截，比如 React 的事件系统。

以 React 的事件批量更新为例子，比如我们的 onClick ，onChange 事件都是被 React 的事件系统处理的。外层用一个统一的处理函数进行拦截。而我们绑定的事件都是在该函数的执行上下文内部被调用的。

那么比如在一次点击事件中触发了多次更新。本质上外层在 React 事件系统处理函数的上下文中，这样的情况下，就可以通过一个开关，证明当前更新是可控的，可以做批量处理。接下来 React 就用一次就可以了。

我们用一幅流程图来描述一下原理。


![5.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ea25cbafb4e4d6ebdfb0bf1531c3e82~tplv-k3u1fbpfcp-watermark.image?)


接下来我们模拟一下具体的实现：

```html
<body>  
    <button onclick="handleClick()" >点击</button>
</body>
<script>
  let  batchEventUpdate = false 
  let callbackQueue = []

  function flushSyncCallbackQueue(){
      console.log('-----执行批量更新-------')
      while(callbackQueue.length > 0 ){
          const cur = callbackQueue.shift()
          cur()
      }
      console.log('-----批量更新结束-------')
  }

  function wrapEvent(fn){
     return function (){
         /* 开启批量更新状态 */
        batchEventUpdate = true
        fn()
        /* 立即执行更新任务 */
        flushSyncCallbackQueue()
        /* 关闭批量更新状态 */
        batchEventUpdate = false
     }
  }

  function setState(fn){
      /* 如果在批量更新状态下，那么批量更新 */
      if(batchEventUpdate){
          callbackQueue.push(fn)
      }else{
          /* 如果没有在批量更新条件下，那么直接更新。 */
          fn()
      }
  }

  function handleClick(){
      setState(()=>{
          console.log('---更新1---')
      })
      console.log('上下文执行')
      setState(()=>{
          console.log('---更新2---')
      })
  }
  /* 让 handleClick 变成可控的  */
  handleClick = wrapEvent(handleClick)


</script>
```

打印结果：

![6.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c070f19898a84b0f8225c1b67f1db74d~tplv-k3u1fbpfcp-watermark.image?)

分析一下核心流程：

* 本方式的核心就是让 handleClick 通过 wrapEvent 变成可控的。首先 wrapEvent 类似于事件处理函数，在内部通过开关 batchEventUpdate 来判断是否开启批量更新状态，最后通过 flushSyncCallbackQueue 来清空待更新队列。

* 在批量更新条件下，事件会被放入到更新队列中，非批量更新条件下，那么立即执行更新任务。

## 三 与传统 legacy 模式的区别

言归正传，回到接下来要介绍的主题上来，首先对于传统的 legacy 模式，有可控任务批量处理的概念，也就是采用了上面第二种批量更新模式，原理第33章讲到主要有两个：

* 通过不同的更新上下文开关，在开关里的任务是可控的，可以进行批量处理。
* 在事件之行完毕后，通过 `flushSyncCallback` 来进行更新任务之行。 

那么在 conCurrent 下的更新采用了一个什么方式呢？首先在这种模式下，取消了批量更新的感念。我们以事件系统的更新例子，研究一下两种的区别。

在老版本事件系统中：

> react-dom/src/events/ReactDOMUpdateBatching.js
```js
export function batchedEventUpdates(fn,a){
    isBatchingEventUpdates = true; //打开批量更新开关
    try{
       fn(a)  // 事件在这里执行
    }finally{
        isBatchingEventUpdates = false //关闭批量更新开关
        if (executionContext === NoContext) {
            flushSyncCallbackQueue(); // TODO: 这个很重要，用来同步执行更新队列中的任务
        }
    }
}
```

* 通过开关 isBatchingEventUpdates 来让 fn 里面的更新变成可控的，所以可以进行批量更新。
* 重点就是 flushSyncCallbackQueue 用来同步执行更新队列中的任务。

在最新版本的 v18 alpha 系统中，事件变成了这样 （这个代码和代码仓库的有一些出入，我们这里只关心流程就好）：

```js
function batchedEventUpdates(){
    var prevExecutionContext = executionContext;
    executionContext |= EventContext;  // 运算赋值
    try {
        return fn(a);  // 执行函数
    }finally {
        executionContext = prevExecutionContext; // 重置之前的状态
        if (executionContext === NoContext) {
            flushSyncCallbacksOnlyInLegacyMode() // 同步执行更新队列中的任务
        }
    }
}
```

从上述代码中可以清晰的看到，v18 alpha 版本的流程大致是这样的：

* 也是通过类似开关状态来控制的，在刚开始的时候将赋值给 `EventContext` ，然后在事件执行之后，赋值给 `prevExecutionContext`。

* 之后同样会触发 flushSyncCallbacksOnlyInLegacyMode ，不过通过函数名称就可以大胆猜想，这个方法主要是针对 legacy 模式的更新，那么 concurrent mode 下也就不会走 flushSyncCallback 的逻辑了。

为了证明这个猜想，一起来看一下 `flushSyncCallbacksOnlyInLegacyMode` 做了些什么事：

> react-reconciler/src/ReactFiberSyncTaskQueue.js
```js
export function flushSyncCallbacksOnlyInLegacyMode(){
    if(includesLegacySyncCallbacks){ /* 只有在 legacy 模式下，才会走这里的流程。 */
        flushSyncCallbacks();
    }
}
```

* 验证了之前的猜测，**只有在 legacy 模式下，才会执行 flushSyncCallbacks 来同步执行任务。**

在之前的章节讲到过 flushSyncCallbacks 主要作用是，能够在一次更新中，直接同步更新任务，防止任务在下一次的宏任务中执行。那么对于 concurrent 下的更新流程是怎么样的呢？

###  一次更新 state 会发生什么？

接下来一起研究一下一次更新 state 会发生什么？首先编写一下如下 `demo` ：

```js
function Index(){
    const [ number , setNumber ] = React.useState(0)
    /* 同步条件下 */
    const handleClickSync = () => {
        setNumber(1)
        setNumber(2)
    }
    /* 异步条件下 */
    const handleClick = () => {
        setTimeout(()=>{
            setNumber(1)
            setNumber(2)
        },0)
    }
    console.log('----组件渲染----')
    return <div>
         {number}
         <button onClick={handleClickSync} >同步环境下</button>
         <button onClick={handleClick} >异步环境下</button>
     </div>
}
```

**在 v17 legacy 下更新：**

* 点击按钮 `同步环境下`，组件渲染一次。


![7.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce67eb14209a4fb8846ce4e50aa29fe0~tplv-k3u1fbpfcp-watermark.image?)

* 点击按钮 `异步环境下`，组件会渲染二次。相信读过之前章节的同学，都明白原理是什么，在异步条件下的更新任务，不在 React 可控的范围内，所以会触发两次流程。


![8.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f4d7fcc26b84a65a3d1b2a669b09639~tplv-k3u1fbpfcp-watermark.image?)

**重点来了，我们看一下 v18 concurrent 下更新：**

* 无论点击 **`同步环境下`** 还是 **`异步环境下`** ，组件都会执行一次。


![7.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35d739049bff4e7ab6f72c48b8a83d09~tplv-k3u1fbpfcp-watermark.image?)

首先想一下，在 concurrent 下，如何实现更新合并的呢？

## 四 v18 更新原理揭秘

按照上面的问题，来探究一下 `concurrent` 下的更新原理。我们还是按照**同步**和**异步**两个方向去探索。 无论是那种条件下，只要触发 React 的 `setState` 或者 `useState`，最终进入调度任务开始更新的入口函数都是 `ensureRootIsScheduled` ，所以可以从这个函数找到线索。


> react-reconciler/src/ReactFiberWorkLoop.js -> ensureRootIsScheduled
```js
function ensureRootIsScheduled(root,currentTime){
    var existingCallbackNode = root.callbackNode;

    var newCallbackPriority = getHighestPriorityLane(nextLanes);
     var existingCallbackPriority = root.callbackPriority;

    if (existingCallbackPriority === newCallbackPriority && 
    !( ReactCurrentActQueue.current !== null && existingCallbackNode !== fakeActCallbackNode)) {
        /* 批量更新退出* */  
        return;
    }
    
    /* 同步更新条件下，会走这里的逻辑 */
    if (newCallbackPriority === SyncLane) {
        scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
        /* 用微任务去立即执行更新  */
        scheduleMicrotask(flushSyncCallbacks);

    }else{
        newCallbackNode = scheduleCallback(
            schedulerPriorityLevel,
            performConcurrentWorkOnRoot.bind(null, root),
        );
    }
    /* 这里很重要就是给当前 root 赋予 callbackPriority 和 callbackNode 状态 */
    root.callbackPriority = newCallbackPriority;
    root.callbackNode = newCallbackNode;
}
```


### 1 同步条件下的逻辑

首先我们来看一下，同步更新的逻辑，上面讲到在 concurrent 中已经没有可控任务那一套逻辑。所以核心更新流程如下：

当同步状态下触发多次 useState 的时候。

* 首先第一次进入到 ensureRootIsScheduled ，会计算出 `newCallbackPriority` 可以理解成执行新的更新任务的优先级。那么和之前的 `callbackPriority` 进行对比，如果相等那么退出流程，那么第一次两者肯定是不想等的。

* 同步状态下常规的更新 newCallbackPriority 是等于 `SyncLane` 的，那么会执行两个函数，`scheduleSyncCallback` 和 `scheduleMicrotask`。

`scheduleSyncCallback` 会把任务 `syncQueue` 同步更新队列中。来看一下这个函数：

> react-reconciler/src/ReactFiberSyncTaskQueue.js -> scheduleSyncCallback
```js
export function scheduleSyncCallback(callback: SchedulerCallback) {
  if (syncQueue === null) {
    syncQueue = [callback];
  } else {
    syncQueue.push(callback);
  }
}
```

* **注意：接下来就是 concurrent 下更新的区别了。在老版本的 React 是基于事件处理函数执行的 flushSyncCallbacks ，而新版本 React 是通过 scheduleMicrotask 执行的。**

我们看一下 scheduleMicrotask 到底是什么？

> react-reconciler/src/ReactFiberHostConfig.js -> scheduleMicrotask
```js
var scheduleMicrotask = typeof queueMicrotask === 'function' ? queueMicrotask : typeof Promise !== 'undefined' ? function (callback) {
  return Promise.resolve(null).then(callback).catch(handleErrorInNextTick);
} : scheduleTimeout; 
```

scheduleMicrotask 本质上就是 `Promise.resolve` ，还有一个 setTimeout 向下兼容的情况。通过 scheduleMicrotask 去进行调度更新。

* 那么如果发生第二次 useState ，则会出现 ` existingCallbackPriority === newCallbackPriority` 的情况，接下来就会 return 退出更新流程了。


### 2 异步条件下的逻辑

在异步情况下，比如在 `setTimeout` 或者是 `Promise.resolve` 条件下的更新，会走哪些逻辑呢？

* 第一步也会判断 existingCallbackPriority === newCallbackPriority 是否相等，相等则退出。
* 第二步则就有点区别了。会直接执行 `scheduleCallback` ，然后得到最新的 newCallbackNode，并赋值给 root 。
* 接下来第二次 useState ，同样会 return 跳出 `ensureRootIsScheduled` 。

看一下 scheduleCallback 做了哪些事。

> react-reconciler/src/ReactFiberWorkLoop.js -> scheduleCallback 

```js
function scheduleCallback(priorityLevel, callback) {
    var actQueue = ReactCurrentActQueue.current;
    if (actQueue !== null) {
      actQueue.push(callback);
      return fakeActCallbackNode;
    } else {
      return scheduleCallback(priorityLevel, callback);
    }
}
```

最后用一幅流程图描述一下流程：


![9.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b05ae38731f4104a84b70b6ca5d49a9~tplv-k3u1fbpfcp-watermark.image?)


## 五 总结

通过本章节我们掌握的知识点有一下内容：

* 主流框架中更新处理方式。
* concurrent 模式下的 state 更新流程。
* 在同步异步条件下，state 更新的区别。

