## 一 前言

在 fiber 章节介绍过，当组件更新，本质上是从 fiberRoot 开始深度调和 fiber 树。那么本章节将继续围绕 React 调和流程。介绍一下调和流程，首先思考几个问题：

* 组件 A 触发 `setState` 或者 `useState` 更新视图，既然 `fiber` 是从 root 开始更新，那么如何找到对应的 A 并 rerender 的呢？
* 组件类型 fiber 进行 `beginWork` 就一定会进行 `render` 吗？


## 二  state 更新源泉

### 1 更新的最小单元

虽然在 ReactV18 引入订阅外部数据源的 `useMutableSource`。但在当前版本的 React 中，视图的更新基本都来源于内部 state 的改变。如果有一个组件 A ，如果想要它更新，那么场景有如下情况：

* 组件本身改变 `state` 。函数 `useState` | `useReducer` ，类组件 `setState` | `forceUpdate`。
* `props` 改变，由组件更新带来的子组件的更新。
* `context`更新，并且该组件消费了当前 `context` 。

无论是上面哪种方式，本质上都是 state 的变化。

* props 改变来源于父级组件的 state 变化。
* context 变化来源于 `Provider` 中 value 变化，而 value 一般情况下也是 state 或者是 state 衍生产物。

`state` 改变是在组件对应的 fiber 单位上的，之前的 fiber 章节讲到了在 React 的世界里会存在多种多样的 fiber 类型， 而开发者平时使用的组件 `function Component` 或者 `Class Component` 也是两种不同的 fiber 类型。而且 React 底层对它们的处理逻辑也不相同。

* 比如更新类组件用的是 `updateClassComponent`，它做的事情是初始化时候实例化类组件，更新的话那么直接调用 render 得到新的 `children` ；
* 更新函数组件用的是 `updateFunctionComponent`，里面调用 `renderWithHooks` 执行函数组件并依次调用 `hooks`。这里细节问题不需要拘泥。

那么在整个 `React` 系统中，能够更新 state 的基本都在组件层面上，换句话说只有组件才能出发更新，比如 `div` 元素  hostComponent 类型的 fiber，它是无法独立的自我更新的，只能依赖于父类的组件更新 state ，但是在调和阶段，它也会作为一个任务单元进入到 workLoop 中 ；综上所述，可以这么理解 

* **fiber是调和过程中的最小单元，每一个需要调和的 fiber 都会进入 workLoop 中。**

* **而组件是最小的更新单元，React 的更新源于数据层 state 的变化。**


### 2 beginWork 更新源泉

那么我们今天的主角就是组件类型的 fiber 。深入研究一下组件类型的 fiber 调和流程。类组件在 render 阶段的一个重要作用就是产生新的 children ，也就是我们常说的 `rerender`。只有产生新的 children ，接下来才能深度遍历 children ，改变视图。每一个需要调和的 fiber 都要经历一个过程叫做 **`beginWork`** ，在 beginWork 流程中将执行上述各种 fiber 的更新函数。

那么对于组件类型 fiber 说，进入到 workLoop 中，那么一定会 `rerender` 吗？ 答案是否定的，解析来看几种情况。

主要看一下如下 demo ：

```js

/* 子组件2 */
function Child2(){
    return <div>子组件 2</div>
}
/* 子组件1 */
function Child1(){
    const [ num , setNumber ] = React.useState(0)
    return <div>
        子组件 {num}
        <button onClick={() => setNumber(num+1)} >按钮1</button>
     </div>
}
/* 父组件 */
export default function Index(){
    const [ num , setNumber ] = React.useState(0)
    return <div>
        <p>父组件 {num} </p>
        <Child1 />
        <Child2 />
        <button onClick={()=> setNumber(num+1)} >按钮2</button>
    </div>
}
```

**场景一**：如上 demo 中，当点击 `Child1` 的 **按钮1** 的时候，Child1 会渲染，那么 Child1 自然会进入到 `beginWork` 流程中，那么疑问来了：

* 问题一：父组件 `Index` 没有更新，会 rerender 吗？那么有会进入 `beginWork` 流程吗 ？
* 问题二：`Child2` 会进入 `beginWork`流程吗 ？
* 问题三：如果 `Index` 会 `beginWork`，那么 React 从 Root fiber 开始调和的时候，是如何找到更新的事发点 Index 的呢？

**场景二**：在如上 demo 中，当点击 Index 中的 **按钮2** 的时候：

* 问题四：`Index` 因为本身的 `state` 改变会更新，那么 `Child1` 和 `Child2` 为什么会跟着更新。

接下来我们开始以一次更新开始，分析调和过程中 beginWork 流程。

在正式流程分析之前，先来看一下 v17 引出的新的概念，在 v16 版本，任务的优先级用 expirationTime 表示，在 v17 版本被 lane 取缔。 

* **lane** ： 更新优先级。（在一次更新任务中，将赋予给更新的 fiber 的一个更新优先级 lane。）
* **childLanes**：`children` 中更新优先级。（如果当前 fiber 的 child 中有高优先级任务，那么当前 fiber 的 childLanes 等于当前优先级）。

记住这两个概念对于下面流程分析很有帮助。接下来带着上面的四个问题，开始往下分析。

## 三 起源: 从 state 改变到 scheduleUpdateOnFiber

下面以前面的点击按钮触发一次更新为例子🌰，深入探讨一下更新的始末源头。首先上述讲到过更新是以**组件**为粒度，那么调用 `useState` 或者是 `setState` 接下来会发生什么呢？

**类组件 setState 更新**
> react-reconciler/src/ReactFiberClassComponent.new.js  -> classComponentUpdater
```js
enqueueSetState(inst, payload, callback){
     const fiber = getInstance(inst);       
     const lane = requestUpdateLane(fiber);
     scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```

**函数组件 useState 更新**
> react-reconciler/src/ReactFiberHooks.new.js -> dispatchReducerAction
```js
function dispatchReducerAction(fiber,queue,action){
    const lane = requestUpdateLane(fiber);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```

如上代码都是精简后，保留的最核心的流程。可以明确看到，无论是组件更新的本质就是：

* 创建一个任务优先级 lane。
* 然后进行 **scheduleUpdateOnFiber**。 那么这个 scheduleUpdateOnFiber 应该就是整个 React 更新任务的开始。那么这个函数到底做了些什么呢 ？


### 1 scheduleUpdateOnFiber 开始更新 fiber 

> react-reconciler/src/ReactFiberWorkLoop.new.js  -> scheduleUpdateOnFiber
```js
function scheduleUpdateOnFiber(fiber,lane){
    /* 递归向上标记更新优先级 */
    const root = markUpdateLaneFromFiberToRoot(fiber, lane);
    if(root === null) return null
    /* 如果当前 root 确定更新，那么会执行 ensureRootIsScheduled */
    ensureRootIsScheduled(root, eventTime);
}
```

scheduleUpdateOnFiber 主要做了两件事：

* 第一个就是通过当前的更新优先级 lane ，把当前 fiber  到 rootFiber 的父级链表上的所有优先级都给更新了。
* 如果当前 fiber 确定更新，那么会调用 ensureRootIsScheduled ，

**那么 markUpdateLaneFromFiberToRoot 如何标记的优先级？ 这个很重要！**

> react-reconciler/src/ReactFiberWorkLoop.new.js  -> markUpdateLaneFromFiberToRoot
```js
/**
 * @param {*} sourceFiber 发生 state 变化的fiber ，比如组件 A 触发了 useState ，那么组件 A 对应的 fiber 就是 sourceFiber
 * @param {*} lane        产生的更新优先级
 */
function markUpdateLaneFromFiberToRoot(sourceFiber,lane){
    /* 更新当前 fiber 上 */
    sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
    /* 更新缓存树上的 lanes */
    let alternate = sourceFiber.alternate;
    if (alternate !== null) alternate.lanes = mergeLanes(alternate.lanes, lane);
    /* 当前更新的 fiber */
    let node = sourceFiber;
    /* 找到返回父级 */
    let parent = sourceFiber.return;
    while(parent !== null){
        /* TODO: 更新 childLanes 字段 */
        parent.childLanes = mergeLanes(parent.childLanes, lane);
        if (alternate !== null) {  alternate.childLanes = mergeLanes(alternate.childLanes, lane); }
        /* 递归遍历更新 */
        node = parent;
        parent = parent.return;
    }
}
```
markUpdateLaneFromFiberToRoot 做的事很重要。

* 首先会更新当前 fiber 上的更新优先级。在 fiber 章节我们讲过，fiber 架构采用 ‘连体婴’形式的双缓冲树，所有还要更新当前 fiber 的缓冲树 `alternate` 上的优先级。
* 然后会递归向上把父级连上的 childLanes 都更新，更新成当前的任务优先级。

重点想一想为什么向上递归更新父级的 childLanes ？

* 首先通过 fiber 章节我们知道，所有的 fiber 是通过一颗 fiber 树关联到一起的，如果组件 A 发生一次更新，React 是从 root 开始深度遍历更新 fiber 树。 
* 那么更新过程中需要深度遍历整个 fiber 树吗？，当然也不是，那么只有一个组件更新，所有的 fiber 节点都调和无疑是性能上的浪费。
* 既然要从头更新，又不想调和整个 fiber 树，那么如何找到更新的组件 A 呢？这个时候 **`childLanes`** 就派上用场了，如果 A 发生了更新，那么先向上递归更新父级链的 `childLanes`，接下来从 Root Fiber 向下调和的时候，发现 childLanes 等于当前更新优先级，那么说明它的 child 链上有新的更新任务，则会继续向下调和，反之退出调和流程。

这样就解决了上面问题3 `如果 `Index` 会 `beginWork`，那么 React 从 Root fiber 开始调和的时候，是如何找到更新的事发点 Index 的呢？`，**Root Fiber 是通过 childLanes 逐渐向下调和找到需要更新的组件的。**

为了更清晰的了解流程这里画了一个流程图。如下：


![1.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2421bbf350134d438f1bdc12b2882974~tplv-k3u1fbpfcp-watermark.image?)
上面描述了整个 fiber 树调和流程。

* 第一阶段是发生更新，那么产生一个更新优先级 `lane` 。
* 第二阶段向上标记 childLanes 过程。
* 第三阶段是向下调和过程，有的同学会问，为什么 A 会被调和，原因是 A 和 B 是同级，如果父级元素调和，并且向下调和，那么父级的第一级子链上的 fiber 都会进入调和流程。从 fiber 关系上看，Root 先调和的是 child 指针上的 A ，然后 A 会退出向下调和，接下来才是 sibling B，接下来 B 会向下调和，通过 childLanes 找到当事人 F，然后 F 会触发 render 更新。这也就解决问题2，Child2 的调和问题。

通过上述我们知道了如何找到 F 并执行 render 的，那么还有一个问题，就是 B，E 会向下调和，如果它们是组件，那么会 render 么，答案是否定的，要记住的是**调和过程并非 render 过程**，调和过程有可能会触发 render 函数，也有可能只是继续向下调和，而本身不会执行 render 。这就解释了上述的问题1。

既然知道了如何去更新 childLanes ，以及更新 childLanes 的意义，我们接着向下分析流程。在 scheduleUpdateOnFiber 中，最后会调用 `ensureRootIsScheduled` ，那么它的作用又是什么呢？

由于 ensureRootIsScheduled 源码比较繁琐，这里就不占篇幅了，它的作用就是根据任务的类型，发起异步调度任务，在调度章节已经讲了调度流程。接下来会走调度的流程。

* 对于 `legacy sync` 模式最后的更新任务是 `performSyncWorkOnRoot` 。
* 对于 `Concurrent` 模式最后的更新任务是 `performConcurrentWorkOnRoot`。

我们今天主要讲的是组件 beginWork 更新流程，所以这里主要以 legacy 模式为主，所以跟着 performSyncWorkOnRoot 流程往下看：

> react-reconciler/src/ReactFiberWorkLoop.new.js  -> performSyncWorkOnRoot 
```js
function performSyncWorkOnRoot(root) {
    /* render 阶段 */
    let exitStatus = renderRootSync(root, lanes);
    /* commit 阶段 */
    commitRoot(root);
    /* 如果有其他的等待中的任务，那么继续更新 */
    ensureRootIsScheduled(root, now());
}
```
之前的章节中介绍了调和的两大阶段 `render` 和 `commit` 都在这个函数中执行。 
* `renderRootSync` 代表 render 阶段。
* `commitRoot` 代表 commit 阶段。
* 当 render 和 commit 阶段执行之后，如果有其他的等待中的任务，那么继续执行调度任务。

到此为止，一次更新调度任务的初始化工作完成。开始正式进入调和阶段。我对前戏阶段做一下总结，流程图如下：


![2.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8710f7ad77f44ecb97cd6200c4a5b76~tplv-k3u1fbpfcp-watermark.image?)

## 四 探索：从 workLoop 到 beginWork

上述讲到了 performSyncWorkOnRoot 正式进入了 fiber 的调和流程。因为本章节主要讲 beginWork 和组件更新流程，这些主要都发生在 `render` 阶段，所以下面将围绕 `renderRootSync` 展开。首先看一下 renderRootSync 做了什么？

> react-reconciler/src/ReactFiberWorkLoop.new.js  -> renderRootSync
```js
function renderRootSync(root,lanes){
    workLoopSync();
    /* workLoop完毕后，证明所有节点都遍历完毕，那么重置状态，进入 commit 阶段 */
    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes;
}
```
renderRootSync 核心功能：
* 执行 `workLoopSync`。 
*  `workLoop` 完毕后，证明所有节点都遍历完毕，那么重置状态，进入 `commit` 阶段。

`workLoopSync` 在整个 render 流程中充当的角色非常重要，可以把 `workLoopSync` 当作一个循环运作的加工器，每一个需要调和的 fiber 可以当作一个零件，每一个零件都需要进入加工器，如果没有待加工的零件，那么加工器才停止运转。下面就是加工器的具体实现。

> react-reconciler/src/ReactFiberWorkLoop.new.js -> workLoopSync
```js
function workLoopSync() {
  /* 循环执行 performUnitOfWork ，一直到 workInProgress 为空 */
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```
* 如上只要 `workInProgress` 不为 `null`（还有需要调和的 fiber），那么 workLoopSync 会循环调用 performUnitOfWork。

在调度章节讲到过，当 Concurrent 模式下会通过 `shouldYield` ，来判断有没有过期的任务，有过期任务，会中断 workLoop ，那么也就是说明了**render阶段是可以被打断的。**

```js
while (workInProgress !== null && !shouldYield()) {
  performUnitOfWork(workInProgress);
}
```
回到 workLoopSync 流程上来，通过 fiber 章节，讲到 fiber 树是深度优先遍历得到的，在遍历完父节点，那么接下来就会遍历子节点。在这其中，每一个调和的 fiber 都将作为 `workInProgress` 进行调和更新。

无论什么模式，workLoop 的执行单元都是 fiber 。而且更新单元的函数叫做 performUnitOfWork 。

> react-reconciler/src/ReactFiberWorkLoop.new.js -> performUnitOfWork
```js
function performUnitOfWork(unitOfWork){
    const current = unitOfWork.alternate;
    let  next = beginWork(current, unitOfWork, subtreeRenderLanes);
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    if (next === null) {
       completeUnitOfWork(unitOfWork);
    } else {
      workInProgress = next;
    }
}
```
在 fiber 章节讲到过, beginWork 是向下调和流程，completeUnitOfWork 是向上归并的流程。那么以组件更新流程为目的，我们接下来重点研究 beginWork 流程。

在介绍 beginWork 之前先来看几个场景：

假设有一个组件 fiber 链。我们在这个 fiber 链上暂且无视其他类型的 fiber，只保留组件类型的 fiber。结构如下：

root Fiber --child--> A组件 --child--> B组件 --child--> C组件。


![4.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46a8441e883f4d70a39e5e56b58d6ff9~tplv-k3u1fbpfcp-watermark.image?)

而主角就是**组件B**，以组件B 为参考。来看一下 React 如何调和的。那么一次更新就有可能有三种场景：

* 场景一：**更新 A 组件 state**，那么 A 触发更新，那么如果 B,C 没有做渲染控制处理（比如 memo PureComponent），那么更新会波动到 B ， C，那么 A，B，C 都会 rerender。


![5.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37a14aa23434495aba1b9dfb985ff219~tplv-k3u1fbpfcp-watermark.image?)

* 场景二：**当更新 B 组件**，那么组件 A fiber 会被标记，然后 A 会调和，但是不会 rerender；组件 B 是当事人，既会进入调和，也会 rerender；组件 C 受到父组件 B 的影响，会 rerender。


![6.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e21e929037b04614897e20338752f324~tplv-k3u1fbpfcp-watermark.image?)

* 场景三；**当更新 C组件**，那么 A，B 会进入调和流程，但是不会 rerender，C 是当事人，会调和并 rerender。


![7.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3691b87d164a427b8c7a180e53b6d84d~tplv-k3u1fbpfcp-watermark.image?)

那么如上的场景本质上都在 **`beginWork`** 中进行的，这个 beginWork 是如何处理这些逻辑的。


## 五 揭秘：从 beginWork 到组件更新全流程

接下来从 beginWork 开始，重点研究一下流程。

### 1 beginWork 更新的调度站

> react-reconciler/src/ReactFiberBeginWork.new.js  -> beginWork
```js
/**
 * @param {*} current         current 树 fiber 
 * @param {*} workInProgress  workInProgress 树 fiber 
 * @param {*} renderLanes     当前的 render 优先级
 * @returns 
 */
function beginWork(current,workInProgress,renderLanes){
    /* -------------------第一部分-------------------- */
    if(current !== null){ 
        /* 更新流程 */
        /* current 树上上一次渲染后的 props */
        const oldProps = current.memoizedProps;
        /* workInProgress 树上这一次更新的 props  */
        const newProps = workInProgress.pendingProps;
        
        if(oldProps !== newProps ||  hasLegacyContextChanged()){
          didReceiveUpdate = true;
        }else{
          /* props 和 context 没有发生变化，检查是否更新来自自身或者 context 改变 */
          const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(current,renderLanes)
          if(!hasScheduledUpdateOrContext){
              didReceiveUpdate = false;
              return  attemptEarlyBailoutIfNoScheduledUpdate(current,workInProgress,renderLanes)
          }
          /* 这里省略了一些判断逻辑 */
          didReceiveUpdate = false;
        }

    }else{
      didReceiveUpdate = false
    }
    /* -------------------第二部分-------------------- */
    /* TODO: 走到这里流程会被调和 | 更新，比如函数执行会执行，类组件会执行 render 。 */
    switch(workInProgress.tag){
        /* 函数组件的情况 */
        case FunctionComponent: {
           return updateFunctionComponent( current, workInProgress, Component, resolvedProps, renderLanes )
        }
        /* 类组件的情况 */
        case ClassComponent:{
          return updateClassComponent(current,workInProgress,Component,resolvedProps,renderLanes)
        }
        /* 元素类型 fiber <div>, <span>  */
        case HostComponent:{
          return updateHostComponent(current, workInProgress, renderLanes)
        }
        /* 其他 fiber 情况 */ 
    }
}
```

如上就是 `beginWork` 的全流程，我们可以看到整个流程分为两个阶段。

### 2 第一阶段

第一部分，这部分非常重要就是判断更新情况的，上面的三种场景都可以在第一阶段进行判断处理。先来分析一下第一阶段做了哪些事。正式讲解之前先来看一个变量的意义，那就是 `didReceiveUpdate` 。

* didReceiveUpdate ：这个变量主要证明当前更新是否来源于父级的更新，那么自身并没有更新。比如更新 B 组件，那么 C组件也会跟着更新，这个情况下 `didReceiveUpdate = true`。

* 首先通过 `current!== null` 来判断当前 fiber 是否创建过，如果第一次 mounted ， 那么 current 为 null，而第一阶段主要针对更新的情况。如果初始化，那么直接跳过第一阶段，**到第二阶段。**

* 如果是更新流程。那么判断 oldProps === newProps（源码中还判断了老版本 context 是否变化），那么两者相等。一般会有以下几种情况：

**情况一**：还是回到上面场景上来，如果 C 组件更新，那么 B 组件被标记 ChildLanes 会进入到 beginWork 调和阶段，但是 B 组件本身 props 不会发生变化。  

**情况二**：通过 useMemo 等方式缓存了 React element 元素，在渲染控制章节讲到过。  

**情况三**：就是更新发生在当前组件本身，比如 B 组件发生更新，但是 B 组件的 props 并没有发生变化，所以也会走到这个流程上来。

反之如果两者不想等，证明父级 fiber 重新 rerender 导致了 props 改变，此时 didReceiveUpdate = true ，那么第一阶段完成，**进入到第二阶段。**

刚才讲到如果**新老 props 相等**，会有一些处理逻辑。那么如果处理的呢？第一个就是调用 `checkScheduledUpdateOrContext`

**checkScheduledUpdateOrContext**
> react-reconciler/src/ReactFiberBeginWork.new.js  -> checkScheduledUpdateOrContext
```js
function checkScheduledUpdateOrContext(current,renderLanes){
    const updateLanes = current.lanes;
    /* 这种情况说明当前更新 */
    if (includesSomeLane(updateLanes, renderLanes)) {
      return true;
    }
     /* 如果该 fiber 消费了 context ，并且 context 发生了改变。 */
    if (enableLazyContextPropagation) {
      const dependencies = current.dependencies;
      if (dependencies !== null && checkIfContextChanged(dependencies)) {
        return true;
      }
    }
  return false;
}
```

* 当新老 props 相等情况，首先会检查当前 fiber 的 `lane` 是否等于当前的更新优先级，如果相等，那么证明更新来源当前 fiber，比如 B 组件发生更新，那么会走这里（情况三）。当然期间也会判断是否有消费 `context` 并发生了变化。最后返回状态 hasScheduledUpdateOrContext 。

如果 `hasScheduledUpdateOrContext` 为 false，证明当前组件没有更新，也没有 context 上的变化，那么还有一种情况就是 child 可能有更新，但是当前 fiber 不需要更新（情况一）。那么会直接返回 `attemptEarlyBailoutIfNoScheduledUpdate` ，**退出第二阶段**。

attemptEarlyBailoutIfNoScheduledUpdate 这个函数会处理部分 Context 逻辑，但是最重要的是调用了 **`bailoutOnAlreadyFinishedWork`** 。

> react-reconciler/src/ReactFiberBeginWork.new.js -> bailoutOnAlreadyFinishedWork
```js
function bailoutOnAlreadyFinishedWork(current,workInProgress,renderLanes){
     /* 如果 children 没有高优先级的任务，说明所有的 child 都没有更新，那么直接 返回，child 也不会被调和  */
    if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
      /* 这里做了流程简化 */
      return null 
    }
    /* 当前fiber没有更新。但是它的children 需要更新。  */
    cloneChildFibers(current, workInProgress);
    return workInProgress.child;
}
```
bailoutOnAlreadyFinishedWork 流程非常重要。它主要做了两件事。

* 首先通过 includesSomeLane 判断 childLanes 是否是高优先级任务，如果不是，那么所有子孙 fiber 都不需要调和 ，那么直接返回 null，child 也不会被调和。

* 如果 childLanes 优先级高，那么证明 child 需要被调和，但是当前组件不需要，所以会克隆一下 children，返回 children ，那么本身不会 `rerender`。

到这里第一阶段完成了，完成了组件更新流程的所有情况。第一阶段完成会进入到更新的第二阶段。

### 3 第二阶段

从 beginWork 的源码中可以看到，第二阶段就是更新 fiber，比如是函数组件，就会调用 `updateFunctionComponent`，类组件就调用 `updateClassComponent`，然后进行 rerender 了。

### 4 流程总结 

接下来以上述中的**组件B**为例子，在强化一下更新流程。

**场景一**：当更新 A 时候，那么 A 组件的 fiber 会进入调和流程，会执行 render 形成新的组件 B 对应的 element 元素，接下来调和 B ，因为 B 的 newProps 不等于 oldProps，所以会 didReceiveUpdate = true ，然后更新组件，也会触发 render。（这里都是默认没有渲染控制的场景，比如 memo PureComponent 等 ），这样也就解决了文章开头的问题四。 


![8.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8a6957eadb24a92992c33aae021815c~tplv-k3u1fbpfcp-watermark.image?)


**场景二**：当更新 B 时候，那么 A 组件会标记 childLanes，所以 A 会被调和，但是不会 render，然后到了主角 B ，B 由于新老 props 相等，所以会 `checkScheduledUpdateOrContext` 流程，判断 lane 等于 renderLanes ，检查到 lane 等于 renderLane，所以会执行更新，触发 render。 C 组件也就跟着更新。


![9.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d8b4c1d668d47778b52e3c2c5bc843f~tplv-k3u1fbpfcp-watermark.image?)

**场景三**：当更新 C 时候，那么 A 和 B 组件会标记 childLanes，所以 A 和 B 会被调和，但是不会更新，然后到 C ，C 会走正常流程。


![10.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d1bfffd917d4e458c6544ee9aa1ff55~tplv-k3u1fbpfcp-watermark.image?)

**场景四**：还有一种情况，什么时候 B 会跳出调和流程呢。


![11.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaf97e258da4462c8b5ddf85a284e2ca~tplv-k3u1fbpfcp-watermark.image?)

到此为止完成了整个更新流程。

### 5 beginWork 流程图


![3.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99afa68f8ab94c93be41df70db0ae488~tplv-k3u1fbpfcp-watermark.image?)

## 总结

通过本章节的学习，我们应该掌握的知识点如下：

* 组件更新和调和过程。rerender 一定会调和，但是调和并不一定 rerender，也有可能找到待更新的子元素。
* 组件类型的更新的几种情况。
* 从出发更新到 beginWork 全流程。


