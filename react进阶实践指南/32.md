## 一 前言



`useMutableSource` 最早的 [RFC](https://github.com/reactjs/rfcs/blob/main/text/0147-use-mutable-source.md) 提案在 2020年 2 月份就开始了。在 React 18 中它将作为新特性出现。用一段提案中的描述来概括 `useMutableSource`。

> useMutableSource 能够让 React 组件在 Concurrent Mode 模式下安全地有效地读取外接数据源，在组件渲染过程中能够检测到变化，并且在数据源发生变化的时候，能够调度更新。

说起外部数据源就要从 state 和更新说起 ，无论是 React 还是 Vue 这种传统 UI 框架中，虽然它们都采用虚拟 DOM 方式，但是还是不能够把更新单元委托到虚拟 DOM 身上来，所以更新的最小粒度还是在组件层面上，由组件统一管理数据 state，并参与调度更新。

回到我们的主角 React 上，既然由组件 component 管控着状态 state。那么在 v17 和之前的版本，React 想要视图上的更新，那么只能通过更改内部数据 state 。纵览 React 的几种更新方式，无一离不开自身 state 。先来看一下 React 的几种更新模式。

* 组件本身改变 state 。函数 `useState` | `useReducer` ，类组件 `setState` | `forceUpdate` 。
* `props` 改变，由组件更新带来的子组件的更新。
* `context` 更新，并且该组件消费了当前 `context` 。

无论是上面哪种方式，本质上都是 state 的变化。

* `props` 改变来源于父级组件的 `state` 变化。
* `context` 变化来源于 Provider 中 value 变化，而 value 一般情况下也是 state 或者是 state 衍生产物。

从上面可以概括出：state和视图更新的关系 `Model` => `View` 。但是 state 仅限于组件内部的数据，如果 state 来源于外部（脱离组件层面）。那么如何完成外部数据源转换成内部状态， 并且数据源变化，组件重新 render 呢？

常规模式下，先把外部数据 external Data 通过 selector 选择器把组件需要的数据映射到 state | props 上。这算是完成了一步，接下来还需要 subscribe 订阅外部数据源的变化，如果发生变化，那么还需要自身去强制更新 forceUpdate 。下面两幅图表示数据注入和数据订阅更新。


![1.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0734aca032e046d58d9c263b6d3d5cb3~tplv-k3u1fbpfcp-watermark.image?)


![2.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd8b70d275ad4f8aa84f18f4029960ea~tplv-k3u1fbpfcp-watermark.image?)

典型的外部数据源就是 redux 中的 store ，redux 是如何把 Store 中的 state ，安全的变成组件的 state 的。 

或许我可以用一段代码来表示从 react-redux 中 state 改变到视图更新的流程。

```js
const store = createStore(reducer,initState)

function App({ selector }){
    const [ state , setReduxState ] = React.useState({})
    const contextValue = useMemo(()=>{
        /* 订阅 store 变化 */
        store.subscribe(()=>{
             /* 用选择器选择订阅 state */
             const value = selector(data.getState())
             /* 如果发生变化  */
             if(ifHasChange(state,value)){
                 setReduxState(value)
             }
        })
    },[ store ])    
    return <div>...</div>
}
```
但是例子中代码，没有实际意义，也不是源代码，我这里就是让大家清晰地了解流程。redux 和 react 本质上是这样工作的。

* 通过 store.subscribe 来订阅 state 变化，但是本质上要比代码片段中复杂的多，通过 selector （选择器）找到组件需要的 state。 我在这里先解释一下**selector**，因为在业务组件往往不需要整个 store 中的 state 全部数据，而是仅仅需要下面的部分状态，这个时候就需要从 state 中选择‘有用的’，并且和 props 合并，细心的同学应该发现，选择器需要和 `react-redux` 中 connect 第一参数 mapStateToProps 联动。对于细节，无关紧要，因为今天重点是 `useMutableSource`。

如上是没有 `useMutableSource` 的情况，现在用 useMutableSource 不在需要把订阅到更新流程交给组件处理。如下：

```js
/* 创建 store */
const store = createStore(reducer,initState)
/* 创建外部数据源 */
const externalDataSource = createMutableSource( store ,store.getState() )
/* 订阅更新 */
const subscribe = (store, callback) => store.subscribe(callback);
function App({ selector }){
    /* 订阅的 state 发生变化，那么组件会更新 */
    const state = useMutableSource(externalDataSource,selector,subscribe)
}
```
* 通过 createMutableSource 创建外部数据源，通过 useMutableSource 来使用外部数据源。外部数据源变化，组件自动渲染。

如上是通过 useMutableSource 实现的订阅更新，这样减少了 APP 内部组件代码，代码健壮性提升，一定程度上也降低了耦合。接下来让我们全方面认识一下这个 V18 的新特性。

## 二 功能介绍

具体功能介绍流程还是参考最新的 RFC， createMutableSource 和 useMutableSource 在一定的程度上，有点像 `createContext` 和 `useContext` ，见名知意，就是**创建**与**使用**。不同的是 context 需要 `Provider` 去注入内部状态，而今天的主角是注入外部状态。那么首先应该看一下两者如何使用。

### 创建

createMutableSource 创建一个数据源。它有两个参数：

```js
const externalDataSource = createMutableSource( store ,store.getState() ) 
```
* 第一个参数：就是外部的数据源，比如 redux 中的 store,
* 第二个参数：一个函数，函数的返回值作为数据源的版本号，这里需要注意⚠️的是，要保持数据源和数据版本号的一致性，就是数据源变化了，那么数据版本号就要变化，一定程度上遵循 `immutable` 原则（不可变性）。可以理解为数据版本号是证明数据源唯一性的标示。


### api介绍

useMutableSource 可以使用非传统的数据源。它的功能和 Context API  还有 [useSubscription](https://www.npmjs.com/package/use-subscription) 类似。（没有使用过 useSubscription 的同学，可以了解一下 ）。

先来看一下 useMutableSource 的基本使用：

```js
const value = useMutableSource(source,getSnapShot,subscribe)
```
useMutableSource 是一个 hooks ，它有三个参数：

* `source：MutableSource < Source >` 可以理解为带记忆的数据源对象。
* `getSnapshot：( source : Source ) => Snapshot` ：一个函数，数据源作为函数的参数，获取快照信息，可以理解为 `selector` ，把外部的数据源的数据过滤，找出想要的数据源。
* `subscribe: (source: Source, callback: () => void) => () => void`：订阅函数，有两个参数，Source 可以理解为 useMutableSource 第一个参数，callback 可以理解为 useMutableSource 第二个参数，当数据源变化的时候，执行快照，获取新的数据。

**useMutableSource 特点**

useMutableSource 和 useSubscription 功能类似：
* 两者都需要带有记忆化的‘配置化对象’，从而从外部取值。
* 两者都需要一种订阅和取消订阅源的方法 `subscribe`。

除此之外 useMutableSource 还有一些特点：
* useMutableSource 需要源作为显式参数。也就是需要把数据源对象作为第一个参数传入。
* useMutableSource 用 getSnapshot 读取的数据，是不可变的。

**关于 MutableSource 版本号** <br/>
`useMutableSource` 会追踪 MutableSource 的版本号，然后读取数据，所以如果两者不一致，可能会造成读取异常的情况。useMutableSource 会检查版本号：

* 在第一次组件挂载的时候，读取版本号。
* 在组件 rerender 的时候，确保版本号一致，然后在读取数据。不然会造成错误发生。
* 确保数据源和版本号的一致性。

**设计规范**

当通过 getSnapshot 读取外部数据源的时候，返回的 value 应该是不可变的。
* ✅ 正确写法：getSnapshot: source => Array.from(source.friendIDs)
* ❌ 错误写法：getSnapshot: source => source.friendIDs

数据源必须有一个全局的版本号，这个版本号代表整个数据源：
* ✅ 正确写法：getVersion: () => source.version
* ❌ 错误写法：getVersion: () => source.user.version 

接下来参考 github 上的例子，我讲一下具体怎么使用：

### 例子一

**例子一：订阅 history 模式下路由变化**

比如有一个场景就是在非人为情况下，订阅路由变化，展示对应的 `location.pathname`，看一下是如何使用 useMutableSource 处理的。在这种场景下，外部数据源就是 location 信息。


```js
// 通过 createMutableSource 创建一个外部数据源。
// 数据源对象为 window。
// 用 location.href 作为数据源的版本号，href 发生变化，那么说明数据源发生变化。
const locationSource = createMutableSource(
  window,
  () => window.location.href
);

// 获取快照信息，这里获取的是 location.pathname 字段，这个是可以复用的，当路由发生变化的时候，那么会调用快照函数，来形成新的快照信息。
const getSnapshot = window => window.location.pathname

// 订阅函数。
const subscribe = (window, callback) => {
   //通过 popstate 监听 history 模式下的路由变化，路由变化的时候，执行快照函数，得到新的快照信息。
  window.addEventListener("popstate", callback);
   //取消监听
  return () => window.removeEventListener("popstate", callback);
};

function Example() {
  // 通过 useMutableSource，把数据源对象，快照函数，订阅函数传入，形成 pathName。  
  const pathName = useMutableSource(locationSource, getSnapshot, subscribe);

  // ...
}
```
来描绘一下流程：
* 首先通过 `createMutableSource` 创建一个数据源对象，该数据源对象为 window。 用 location.href 作为数据源的版本号，href 发生变化，那么说明数据源发生变化。 
* 获取快照信息，这里获取的是 location.pathname 字段，这个是可以复用的，当路由发生变化的时候，那么会调用快照函数，来形成新的快照信息。
* 通过 `popstate` 监听 `history` 模式下的路由变化，路由变化的时候，执行快照函数，得到新的快照信息。
* 通过 `useMutableSource` ，把数据源对象，快照函数，订阅函数传入，形成 `pathName` 。  
 
可能这个例子🌰，不足以让你清楚 useMutableSource 的作用，我们再举一个例子看一下 useMutableSource 如何和 redux 契合使用的。


### 例子二

**例子二：redux 中 `useMutableSource` 使用**

redux 可以通过 useMutableSource 编写自定义 hooks —— `useSelector`，useSelector 可以读取数据源的状态，当数据源改变的时候，重新执行快照获取状态，做到订阅更新。我们看一下 useSelector 是如何实现的。


```js
const mutableSource = createMutableSource(
  reduxStore, // 将 redux 的 store 作为数据源。
  // state 是不可变的，可以作为数据源的版本号
  () => reduxStore.getState()
);

// 通过创建 context 保存数据源 mutableSource。
const MutableSourceContext = createContext(mutableSource);

// 订阅 store 变化。store 变化，执行 getSnapshot
const subscribe = (store, callback) => store.subscribe(callback);

// 自定义 hooks useSelector 可以在每一个 connect 内部使用，通过 useContext 获取 数据源对象。 
function useSelector(selector) {
  const mutableSource = useContext(MutableSourceContext);
   // 用 useCallback 让 getSnapshot 变成有记忆的。 
  const getSnapshot = useCallback(store => selector(store.getState()), [
    selector
  ]);
   // 最后本质上用的是 useMutableSource 订阅 state 变化。  
  return useMutableSource(mutableSource, getSnapshot, subscribe);
}
```
大致流程是这样的：

*  将 redux 的 store 作为数据源对象 `mutableSource` 。 state 是不可变的，可以作为数据源的版本号。
* 通过创建 context 保存数据源对象 `mutableSource`。
* 声明订阅函数，订阅 store 变化。store 变化，执行 `getSnapshot` 。
* 自定义 hooks `useSelector` 可以在每一个 connect 内部使用，通过 useContext 获取 数据源对象。 用 `useCallback` 让 getSnapshot 变成有记忆的。 
* 最后本质上用的是 useMutableSource 订阅外部 state 变化。 

**注意问题** <br/>
* 在创建 getSnapshot 的时候，需要将 getSnapshot 记忆化处理，就像上述流程中的 useCallback 处理 getSnapshot 一样，如果不记忆处理，那么会让组件频繁渲染。
* 在最新的 react-redux 源码中，已经使用新的 api，订阅外部数据源，不过不是 `useMutableSource` 而是 `useSyncExternalStore`，具体因为 `useMutableSource` 没有提供内置的 selectorAPI，需要每一次当选择器变化时候重新订阅 store，如果没有 useCallback 等 api 记忆化处理，那么将重新订阅。具体内容请参考 [useMutableSource → useSyncExternalStore](https://github.com/reactwg/react-18/discussions/86)。

## 三 实践

接下来我用一个例子来具体实践一下 `createMutableSource`，让大家更清晰流程。

这里还是采用 redux 和 createMutableSource 实现外部数据源的引用。这里使用的是 `18.0.0-alpha` 版本的 `react` 和 `react-dom` 。

![3.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a000b3baac184fe9903700ad51e03be7~tplv-k3u1fbpfcp-watermark.image?)

```js
import  React , {
    unstable_useMutableSource as useMutableSource,
    unstable_createMutableSource as createMutableSource
} from 'react'

import { combineReducers , createStore  } from 'redux'

/* number Reducer */
function numberReducer(state=1,action){
    switch (action.type){
      case 'ADD':
        return state + 1
      case 'DEL':
        return state - 1
      default:
        return state
    }
}
/* 注册reducer */
const rootReducer = combineReducers({ number:numberReducer  })
/* 合成Store */
const Store = createStore(rootReducer,{ number: 1  })
/* 注册外部数据源 */
const dataSource = createMutableSource( Store ,() => 1 )

/* 订阅外部数据源 */
const subscribe = (dataSource,callback)=>{
    const unSubScribe = dataSource.subscribe(callback)
    return () => unSubScribe()
}

/* TODO: 情况一 */
export default function Index(){
    /* 获取数据快照 */
     const shotSnop = React.useCallback((data) => ({...data.getState()}),[])
    /*  hooks:使用 */
    const data = useMutableSource(dataSource,shotSnop,subscribe)
    return <div>
        <p> 拥抱 React 18 🎉🎉🎉 </p>
        赞：{data.number} <br/>
        <button onClick={()=>Store.dispatch({ type:'ADD' })} >点赞</button>
    </div>
}
```

第一部分用 `combineReducers` 和 `createStore` 创建 redux Store 的过程。<br/>
重点是第二部分：
* 首先通过 createMutableSource 创建数据源，Store 为数据源，`data.getState()` 作为版本号。
* 第二点就是快照信息，这里的快照就是 store 中的 state。所以在 `shotSnop` 还是通过 getState 获取状态，正常情况下 shotSnop 应该作为 `Selector`，这里把所有的 state 都映射出来了。
* 第三就是通过 `useMutableSource` 把数据源，快照，订阅函数传入，得到的 data 就是引用的外部数据源了。

接下来让我们看一下效果：


![4.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81ad31834d0941859cf767d22d685c6b~tplv-k3u1fbpfcp-watermark.image?)


## 四 原理分析

useMutableSource 已经在 React v18 的规划之中了，那么它的实现原理以及细节，在 V18 正式推出之前可以还会有调整，

### 1 createMutableSource

> react/src/ReactMutableSource.js -> createMutableSource
```js
function createMutableSource(source,getVersion){
    const mutableSource = {
        _getVersion: getVersion,
        _source: source,
        _workInProgressVersionPrimary: null,
        _workInProgressVersionSecondary: null,
    };
    return mutableSource
}
```

createMutableSource 的原理非常简单，和 `createContext` ， `createRef` 类似， 就是创建一个 `createMutableSource` 对象，

### 2 useMutableSource

对于 useMutableSource 原理也没有那么玄乎，原来是由开发者自己把外部数据源注入到 state 中，然后写订阅函数。 useMutableSource 的原理就是把开发者该做的事，自己做了😂😂😂，这样省着开发者去写相关的代码了。本质上就是 **useState + useEffect** ：
* useState 负责更新。
* useEffect 负责订阅。

然后来看一下原理。

> react-reconciler/src/ReactFiberHooks.new.js -> useMutableSource
```js
function useMutableSource(hook,source,getSnapshot){
    /* 获取版本号 */
    const getVersion = source._getVersion;
    const version = getVersion(source._source);
    /* 用 useState 保存当前 Snapshot，触发更新。 */
    let [currentSnapshot, setSnapshot] = dispatcher.useState(() =>
       readFromUnsubscribedMutableSource(root, source, getSnapshot),
    );
    dispatcher.useEffect(() => {
        /* 包装函数  */
        const handleChange = () => {
            /* 触发更新 */
            setSnapshot()
        }
        /* 订阅更新 */
        const unsubscribe = subscribe(source._source, handleChange);
        /* 取消订阅 */
        return unsubscribe;
    },[source, subscribe])
}
```
上述代码中保留了最核心的逻辑：

* 首先通过 `getVersion` 获取数据源版本号，用 **`useState`** 保存当前 Snapshot，setSnapshot 用于触发更新。
* 在 **`useEffect`** 中，进行订阅，绑定的是包装好的 handleChange 函数，里面调用 setSnapshot 真正的更新组件。
* 所以 useMutableSource 本质上还是 useState 。


## 五 总结

今天讲了 useMutableSource 的背景，用法，以及原理。希望阅读的同学可以克隆一下 React v18 的新版本，尝试一下新特性，将对理解 useMutableSource 很有帮助。下一章我们将继续围绕 React v18 展开。

