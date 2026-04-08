## 一 前言

状态管理是单页面应用解决组件状态共享，复杂组件通信的技术方案。接下来的两个章节，我们将详细介绍 React 应用中常见的两种状态管理方式- **React-Redux** 和 **React-Mobx** 。

本章节主要讲 React-Redux，包括Redux 设计思想、中间件原理，以及 React-Redux 的用法和原理。

### 1 状态管理应用场景
状态管理工具为什么受到开发者的欢迎呢？我认为首先应该想想状态管理适用于什么场景。解决了什么问题。

**① 组件之间共用数据，如何处理?**

设想一种场景，就是一些通过 ajax 向服务器请求的重要数据，比如用户信息，权限列表，可能会被多个组件需要，那么如果每个组件初始化都请求一遍数据显然是不合理的。这时候常用的一种解决方案是，应用初始化时候，只请求一次数据，然后通过状态管理把数据存起来，需要数据的组件只需要从状态管理中‘拿’就可以了。

效果图：


![3.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c8cdb1e78cb458eb20cabc6d5cf8da4~tplv-k3u1fbpfcp-watermark.image)


**② 复杂组件之间如何通信？**

还有一种场景就是对于 spa 单页面应用一切皆组件，对于嵌套比较深的组件，组件通信成了一个棘手的问题。比如如下的场景， B 组件向 H 组件传递某些信息，那么常规的通信方式似乎难以实现。

这个时候状态管理就派上用场了，可以把 B 组件的信息传递给状态管理层，H 组件连接状态管理层，再由状态管理层通知 H 组件，这样就本质解决了组件通信问题。


![4.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21ad27c2f61c4fa1a78e9d1262824fc7~tplv-k3u1fbpfcp-watermark.image)


### 2 React-Redux,Redux,React三者关系
在深入研究 React-Redux 之前，应该先弄明白 React-Redux ，Redux ， React 三者到底是什么关系。

* `Redux`： 首先 Redux 是一个应用状态管理js库，它本身和 React 是没有关系的，换句话说，Redux 可以应用于其他框架构建的前端应用，甚至也可以应用于 Vue 中。

* `React-Redux`：React-Redux 是连接 React 应用和 Redux 状态管理的桥梁。React-redux 主要专注两件事，一是如何向 React 应用中注入 redux 中的 Store ，二是如何根据 Store 的改变，把消息派发给应用中需要状态的每一个组件。

* `React`：这个就不必多说了。

三者的关系图如下所示：



![3.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83eaf84d71b04b94b7b7e754a6778cd1~tplv-k3u1fbpfcp-watermark.image)

### 3 温习 Redux

彻底弄明白 React-Redux 之前，就必须要搞懂 Redux 在 React 中扮演的角色。Redux 的设计满足以下三个原则：

#### ①三大原则

* 1 单向数据流：整个 redux ，数据流向都是单向的，我用一张官网的图片描述整个数据流动的流程。 


![redux.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3775935f59d435fa6326dbcef90519e~tplv-k3u1fbpfcp-watermark.image)

* 2 state 只读：在 Redux 中不能通过直接改变 state ，来让状态发生变化，如果想要改变 state ，那就必须触发一次 action ，通过 action 执行每个 reducer 。 

* 3 纯函数执行：每一个 reducer 都是一个纯函数，里面不要执行任何副作用，返回的值作为新的 state ，state 改变会触发 store 中的 subscribe 。

#### ②发布订阅思想
redux 可以作为发布订阅模式的一个具体实现。redux 都会创建一个 store ，里面保存了状态信息，改变 store 的方法 dispatch ，以及订阅 store 变化的方法 subscribe 。

#### ③中间件思想

redux 应用了前端领域为数不多的中间件 `compose` ，那么 redux 的中间件是用来做什么的？ 答案只有一个： 那就是**强化 dispatch** ， Redux 提供了中间件机制，使用者可以根据需要来强化 dispatch 函数，传统的 dispatch 是不支持异步的，但是可以针对 Redux 做强化，于是有了 `redux-thunk`，`redux-actions` 等中间件，包括 dvajs 中，也写了一个 redux 支持 promise 的中间件。

一起来看一下 compose 是如何实现的：

```js
const compose = (...funcs) => {
  return funcs.reduce((f, g) => (x) => f(g(x)));
}
```
* funcs 为中间件组成的数组，compose 通过数组的 reduce 方法，实现执行每一个中间件，强化 dispatch 。

#### ④核心api
对于内部原理，我这里就不多说了，毕竟这节主要讲的是 React-Redux ，主要先来看一下 redux 几个比较核心的 api:

**createStore**

`createStore` redux中通过 createStore 可以创建一个 Store ，使用者可以将这个 Store 保存传递给 React 应用，具体怎么传递那就是 React-Redux 做的事了。首先看一下 createStore 的使用：

```js
const Store = createStore(rootReducer,initialState,middleware)
```
* 参数一 reducers ： redux 的 reducer ，如果有多个那么可以调用 combineReducers 合并。
* 参数二 initialState ：初始化的 state 。
* 参数三 middleware ：如果有中间件，那么存放 redux 中间件。

**combineReducers**
```js
/* 将 number 和 PersonalInfo 两个reducer合并   */
const rootReducer = combineReducers({ number:numberReducer,info:InfoReducer })
```
* 正常状态可以会有多个 reducer ，combineReducers 可以合并多个reducer。

**applyMiddleware**

```js
const middleware = applyMiddleware(logMiddleware)
```
* applyMiddleware 用于注册中间件，支持多个参数，每一个参数都是一个中间件。每次触发 action ，中间件依次执行。

#### ⑤ 实战-redux基本用法

**第一步：编写reducer**
```js
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
/* 用户信息reducer */
function InfoReducer(state={},action){
  const { payload = {} } = action
   switch (action.type){
     case 'SET':
       return {
         ...state,
         ...payload
       }
     default:
       return state
   }
}
```
* 编写了两个 reducer ，一个管理变量 number ，一个保存信息 info 。

**第二步：注册中间件**
```js
/* 打印中间件 */
/* 第一层在 compose 中被执行 */
function logMiddleware(){
    /* 第二层在reduce中被执行 */ 
    return (next) => {
      /* 返回增强后的dispatch */
      return (action)=>{
        const { type } = action
        console.log('发生一次action:', type )
        return next(action)
      }
    }
}
```
* 在重点看一下 redux 的中间件的编写方式，本质上应用了函数柯里化。

**第三步：生成Store**
```js
/* 注册中间件  */
const rootMiddleware = applyMiddleware(logMiddleware)
/* 注册reducer */
const rootReducer = combineReducers({ number:numberReducer,info:InfoReducer  })
/* 合成Store */
const Store = createStore(rootReducer,{ number:1 , info:{ name:null } } ,rootMiddleware) 
```
* 这一步没什么好说的，直接注册就可以了。

**第四步：试用redux**
```js
function Index(){
  const [ state , changeState  ] = useState(Store.getState())
  useEffect(()=>{
    /* 订阅state */
    const unSubscribe = Store.subscribe(()=>{
         changeState(Store.getState())
     })
    /* 解除订阅 */
     return () => unSubscribe()
  },[])
  return <div > 
          <p>  { state.info.name ? `hello, my name is ${ state.info.name}` : 'what is your name' } ,
           { state.info.mes ? state.info.mes  : ' what do you say? '  } </p>
         《React进阶实践指南》 { state.number } 👍 <br/>
        <button onClick={()=>{ Store.dispatch({ type:'ADD' })  }} >点赞</button>
        <button onClick={()=>{ Store.dispatch({ type:'SET',payload:{ name:'alien' , mes:'let us learn React!'  } }) }} >修改标题</button>
     </div>
}
```
* 为了让大家直观看到效果，可以直接把 redux 和 react 直接结合起来使用，在 useEffect 中进行订阅和解除订阅，通过 useState 改变视图层。
* store.getState 可以获取 redux 最新的 state 。

**效果**


![1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edbce9a094cd49fb9732753cc708d731~tplv-k3u1fbpfcp-watermark.image)

**总结：**

上述demo中，没有用到 react-redux ，但是明显暴露了很多问题。我来做一下总结：
* 1 首先想要的状态是共用的，上述 demo 无法满足状态共用的情况。
* 2 正常情况不可能将每一个需要状态的组件都用 subscribe / unSubscribe 来进行订阅
* 3 比如 A 组件需要状态 a，B 组件需要状态 b ，那么改变 a，只希望 A 组件更新，不希望 B 组件更新，显然上述是不能满足的。
* 4 ...

所以为了解决上述诸多问题，react-redux 就应运而生了。

## 二 React-Redux用法
上述讲到 React-Redux 是沟通 React 和 Redux 的桥梁，它主要功能体现在如下两个方面：

* 1 接受 Redux 的 Store，并把它合理分配到所需要的组件中。
* 2 订阅 Store 中 state 的改变，促使消费对应的 state 的组件更新。

### 1 用法简介

#### Provider

由于 redux 数据层，可能被很多组件消费，所以 react-redux 中提供了一个 Provider 组件，可以全局注入 redux 中的 store ，所以使用者需要把 Provider 注册到根部组件中。

* Provider 作用就是保存 redux 中的 store ，分配给所有需要 state 的子孙组件。

例子🌰：

```js
export default function Root(){
  return <Provider store={Store} >
      <Index />
  </Provider>
}
```

#### connect

既然已经全局注入了 Store ，那么需要 Store 中的状态或者想要改变Store的状态，那么如何处理呢，React-Redux 提供了一个高阶组件connect，被 connect 包装后组件将获得如下功能：

* 1 能够从 props 中获取改变 state 的方法 Store.dispatch 。
* 2 如果 connect 有第一个参数，那么会将 redux state 中的数据，映射到当前组件的 props 中，子组件可以使用消费。
* 3 当需要的 state ，有变化的时候，会通知当前组件更新，重新渲染视图。

开发者可以利用 connect 提供的功能，做数据获取，数据通信，状态派发等操作。首先来看看 connect 用法。

```js
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```

**①mapStateToProps**
```js
const mapStateToProps = state => ({ number: state.number })
```
* 组件依赖 redux 的 state，映射到业务组件的 props 中，state 改变触发，业务组件 props 改变，触发业务组件更新视图。当这个参数没有的时候，当前组件不会订阅 store 的改变。

**②mapDispatchToProps**

```js
const mapDispatchToProps = dispatch => {
  return {
    numberAdd: () => dispatch({ type: 'ADD' }),
    setInfo: () => dispatch({ type: 'SET' }),
  }
}
```
* 将 redux 中的 dispatch 方法，映射到业务组件的 props 中。比如将如上 demo 中的两个方法映射到 props ，变成了 numberAdd ， setInfo 方法。

**③mergeProps**

```js
/*
* stateProps , state 映射到 props 中的内容
* dispatchProps， dispatch 映射到 props 中的内容。
* ownProps 组件本身的 props
*/
(stateProps, dispatchProps, ownProps) => Object
```
正常情况下，如果没有这个参数，会按照如下方式进行合并，返回的对象可以是，可以自定义的合并规则，还可以附加一些属性。

```js
{ ...ownProps, ...stateProps, ...dispatchProps }
```

**④options**

```js
{
  context?: Object,   // 自定义上下文
  pure?: boolean, // 默认为 true , 当为 true 的时候 ，除了 mapStateToProps 和 props ,其他输入或者state 改变，均不会更新组件。
  areStatesEqual?: Function, // 当pure true , 比较引进store 中state值 是否和之前相等。 (next: Object, prev: Object) => boolean
  areOwnPropsEqual?: Function, // 当pure true , 比较 props 值, 是否和之前相等。 (next: Object, prev: Object) => boolean
  areStatePropsEqual?: Function, // 当pure true , 比较 mapStateToProps 后的值 是否和之前相等。  (next: Object, prev: Object) => boolean
  areMergedPropsEqual?: Function, // 当 pure 为 true 时， 比较 经过 mergeProps 合并后的值 ， 是否与之前等  (next: Object, prev: Object) => boolean
  forwardRef?: boolean, //当为true 时候,可以通过ref 获取被connect包裹的组件实例。
}
```
如上标注了 options 属性每一个的含义。并且讲解了 react-redux 的基本用法，接下来简单实现 react-redux 的两个功能。

### 2 实践一：React-Redux实现状态共享

```js
export default function Root(){
  React.useEffect(()=>{
    Store.dispatch({ type:'ADD'})
    Store.dispatch({ type:'SET',payload:{ name:'alien' , mes:'let us learn React!'  } })
  },[])
  return <Provider store={Store} >
      <Index />
  </Provider>
}
```
* 通过在根组件中注入 store ，并在 useEffect 中改变 state 内容。

然后在整个应用中在想要获取数据的组件里，获取 state 中的内容。

```js
import { connect } from 'react-redux'


class Index extends React.Component {
    componentDidMount() { }
    render() {
         const { info , number }:any = this.props  
        return <div >
            <p>  {info.name ? `hello, my name is ${info.name}` : 'what is your name'} ,
          {info.mes ? info.mes : ' what do you say? '} </p>
        《React进阶实践指南》 {number} 👍 <br />
        </div>
    }
}

const mapStateToProps = state => ({ number: state.number, info: state.info })

export default connect(mapStateToProps)(Index)
```
* 通过 mapStateToProps 获取指定 state 中的内容，然后渲染视图。

效果：


![5.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2765c6dee4e3486a9982dcfcb2b03470~tplv-k3u1fbpfcp-watermark.image)

### 3 实践二：React-Redux实现组件通信

接下来可以用 React-Redux 模拟一个，组件通信的场景。

**组件A**
```js
function ComponentA({ toCompB, compBsay }) { /* 组件A */
  const [CompAsay, setCompAsay] = useState('')
  return <div className="box" >
    <p>我是组件A</p>
    <div> B组件对我说：{compBsay} </div>
        我对B组件说：<input placeholder="CompAsay" onChange={(e) => setCompAsay(e.target.value)} />
    <button onClick={() => toCompB(CompAsay)} >确定</button>
  </div>
}
/* 映射state中CompBsay  */
const CompAMapStateToProps = state => ({ compBsay: state.info.compBsay })
/* 映射toCompB方法到props中 */
const CompAmapDispatchToProps = dispatch => ({ toCompB: (mes) => dispatch({ type: 'SET', payload: { compAsay: mes } }) })
/* connect包装组件A */
export const CompA = connect(CompAMapStateToProps, CompAmapDispatchToProps)(ComponentA)
```
* 组件 A 通过 mapStateToProps，mapDispatchToProps，分别将state 中的 compBsay 属性，和改变 state 的 compAsay 方法，映射到 props 中。

**组件B**

```js
class ComponentB extends React.Component { /* B组件 */
  state={ compBsay:'' }
  handleToA=()=>{
     this.props.dispatch({ type: 'SET', payload: { compBsay: this.state.compBsay } })
  }
  render() {
    return <div className="box" >
      <p>我是组件B</p>
      <div> A组件对我说：{ this.props.compAsay } </div>
       我对A组件说：<input placeholder="CompBsay" onChange={(e)=> this.setState({ compBsay: e.target.value  }) }  />
      <button  onClick={ this.handleToA } >确定</button>
    </div>
  }
}
/* 映射state中 CompAsay  */
const CompBMapStateToProps = state => ({ compAsay: state.info.compAsay })
export const CompB =  connect(CompBMapStateToProps)(ComponentB)
```

*  B 组件和 A 组件差不多，通过触发 dispatch 向组件 A 传递信息，同时接受 B 组件的信息。

**效果：**


![2.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d32665608ce42eab09a60ccc11bb2ef~tplv-k3u1fbpfcp-watermark.image)

## 三 React-Redux原理

对于 React-Redux 原理，我按照功能组成，大致分为三部分，接下来将按照这三部分逐一击破：

### 第一部分： Provider注入Store

> react-redux/src/components/Provider.js
```js
const ReactReduxContext =  React.createContext(null)
function Provider({ store, context, children }) {
   /* 利用useMemo，跟据store变化创建出一个contextValue 包含一个根元素订阅器和当前store  */ 
  const contextValue = useMemo(() => {
      /* 创建了一个根级 Subscription 订阅器 */
    const subscription = new Subscription(store)
    return {
      store,
      subscription
    } /* store 改变创建新的contextValue */
  }, [store])
  useEffect(() => {
    const { subscription } = contextValue
    /* 触发trySubscribe方法执行，创建listens */
    subscription.trySubscribe() // 发起订阅
    return () => {
      subscription.tryUnsubscribe()  // 卸载订阅
    } 
  }, [contextValue])  /*  contextValue state 改变出发新的 effect */
  const Context = ReactReduxContext
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

这里保留了核心的代码。从这段代码，从中可以分析出 Provider 做了哪些事。
* 1 首先知道 React-Redux 是通过 context 上下文来保存传递 Store 的，但是上下文 value 保存的除了 Store 还有 subscription 。
* 2 subscription 可以理解为订阅器，在 React-redux 中一方面用来订阅来自 state 变化，另一方面通知对应的组件更新。在 Provider 中的订阅器 subscription 为根订阅器，
* 3 在 Provider 的 useEffect 中，进行真正的绑定订阅功能，其原理内部调用了 store.subscribe ，只有根订阅器才会触发store.subscribe，至于为什么，马上就会讲到。



### 第二部分： Subscription订阅器

> react-redux/src/utils/Subscription.js
```js
/* 发布订阅者模式 */
export default class Subscription {
  constructor(store, parentSub) {
  //....
  }
  /* 负责检测是否该组件订阅，然后添加订阅者也就是listener */
  addNestedSub(listener) {
    this.trySubscribe()
    return this.listeners.subscribe(listener)
  }
  /* 向listeners发布通知 */
  notifyNestedSubs() {
    this.listeners.notify()
  }
  /* 开启订阅模式 首先判断当前订阅器有没有父级订阅器 ， 如果有父级订阅器(就是父级Subscription)，把自己的handleChangeWrapper放入到监听者链表中 */
  trySubscribe() {
    /*
    parentSub  即是provide value 里面的 Subscription 这里可以理解为 父级元素的 Subscription
    */
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub
        ? this.parentSub.addNestedSub(this.handleChangeWrapper)
        /* provider的Subscription是不存在parentSub，所以此时trySubscribe 就会调用 store.subscribe   */
        : this.store.subscribe(this.handleChangeWrapper)
      this.listeners = createListenerCollection()
    }
  }
  /* 取消订阅 */
  tryUnsubscribe() {
     //....
  }
}
```
整个订阅器的核心，我浓缩提炼成8个字：**层层订阅，上订下发**。

**层层订阅**：React-Redux 采用了层层订阅的思想，上述内容讲到 Provider 里面有一个 Subscription ，提前透露一下，每一个用 connect 包装的组件，内部也有一个 Subscription ，而且这些订阅器一层层建立起关联，Provider中的订阅器是最根部的订阅器，可以通过 trySubscribe 和 addNestedSub 方法可以看到。还有一个注意的点就是，如果父组件是一个 connect ，子孙组件也有 connect ，那么父子 connect 的 Subscription 也会建立起父子关系。

**上订下发**：在调用 trySubscribe 的时候，能够看到订阅器会和上一级的订阅器通过 addNestedSub 建立起关联，当 store 中 state 发生改变，会触发 store.subscribe ，但是只会通知给 Provider 中的根Subscription，根 Subscription 也不会直接派发更新，而是会下发给子代订阅器（ connect 中的 Subscription ），再由子代订阅器，决定是否更新组件，层层下发。


**｜--------问与答--------｜**<br/>
问：为什么 React-Redux 会采用 subscription 订阅器进行订阅，而不是直接采用 store.subscribe 呢 ？

* 1 首先 state 的改变，Provider 是不能直接下发更新的，如果下发更新，那么这个更新是整个应用层级上的，还有一点，如果需要 state 的组件，做一些性能优化的策略，那么该更新的组件不会被更新，不该更新的组件反而会更新了。

* 2 父 Subscription -> 子 Subscription 这种模式，可以逐层管理 connect 的状态派发，不会因为 state 的改变而导致更新的混乱。

**｜--------END--------｜**<br/>


**层层订阅模型：**


![6.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91741c58bbf84ce7ba0dbb2cea510135~tplv-k3u1fbpfcp-watermark.image)

### 第三部分： connect控制更新

由于connect中的代码过于复杂，我这里只保留核心的流程，而且对代码进行简化处理。

> react-redux/src/components/connectAdvanced.js
```js
function connect(mapStateToProps,mapDispatchToProps){
    const Context = ReactReduxContext
    /* WrappedComponent 为connect 包裹的组件本身  */   
    return function wrapWithConnect(WrappedComponent){
        function createChildSelector(store) {
          /* 选择器  合并函数 mergeprops */
          return selectorFactory(store.dispatch, { mapStateToProps,mapDispatchToProps })
        }
        /* 负责更新组件的容器 */
        function ConnectFunction(props){
          /* 获取 context内容 里面含有 redux中store 和父级subscription */
          const contextValue = useContext(ContextToUse)
          /* 创建子选择器,用于提取state中的状态和dispatch映射，合并到props中 */
          const childPropsSelector = createChildSelector(contextValue.store)
          const [subscription, notifyNestedSubs] = useMemo(() => {
            /* 创建一个子代Subscription，并和父级subscription建立起关系 */
            const subscription = new Subscription(
              store,
              didStoreComeFromProps ? null : contextValue.subscription // 父级subscription，通过这个和父级订阅器建立起关联。
            )
             return [subscription, subscription.notifyNestedSubs]
            }, [store, didStoreComeFromProps, contextValue])
            
            /* 合成的真正的props */
            const actualChildProps = childPropsSelector(store.getState(), wrapperProps)
            const lastChildProps = useRef()
            /* 更新函数 */
            const [ forceUpdate, ] = useState(0)
            useEffect(()=>{
                const checkForUpdates =()=>{
                   newChildProps = childPropsSelector()
                  if (newChildProps === lastChildProps.current) { 
                      /* 订阅的state没有发生变化，那么该组件不需要更新，通知子代订阅器 */
                      notifyNestedSubs() 
                  }else{
                     /* 这个才是真正的触发组件更新的函数 */
                     forceUpdate(state=>state+1)
                     lastChildProps.current = newChildProps /* 保存上一次的props */
                  }
                }
                subscription.onStateChange = checkForUpdates
                //开启订阅者 ，当前是被connect 包转的情况 会把 当前的 checkForceUpdate 放在存入 父元素的addNestedSub中 ，一点点向上级传递 最后传到 provide 
                subscription.trySubscribe()
                /* 先检查一遍，反正初始化state就变了 */
                checkForUpdates()
            },[store, subscription, childPropsSelector])

             /* 利用 Provider 特性逐层传递新的 subscription */
            return  <ContextToUse.Provider value={{  ...contextValue, subscription}}>
                 <WrappedComponent  {...actualChildProps}  />
            </ContextToUse.Provider>  
          }
          /* memo 优化处理 */
          const Connect = React.memo(ConnectFunction) 
        return hoistStatics(Connect, WrappedComponent)  /* 继承静态属性 */
    }
}
```
connect 的逻辑还是比较复杂的，我总结一下核心流程。

* 1  connect 中有一个 selector 的概念，selector 有什么用？就是通过 mapStateToProps ，mapDispatchToProps ，把 redux 中 state 状态合并到 props 中，得到最新的 props 。
* 2 上述讲到过，每一个 connect 都会产生一个新的 Subscription ，和父级订阅器建立起关联，这样父级会触发子代的 Subscription 来实现逐层的状态派发。
* 3 有一点很重要，就是 Subscription 通知的是 checkForUpdates 函数，checkForUpdates 会形成新的 props ，与之前缓存的 props 进行浅比较，如果不想等，那么说明 state 已经变化了，直接触发一个useReducer 来更新组件，上述代码片段中，我用 useState 代替 useReducer 了，如果相等，那么当前组件不需要更新，直接通知子代 Subscription ，检查子代 Subscription 是否更新，完成整个流程。


## 四 实现异步

基于 redux 异步的库有很多，最简单的 `redux-thunk` ，代码量少，只有几行，其中大量的逻辑需要开发者实现，还有比较复杂的 `redux-saga` ，基于 `generator` 实现，用起来稍微繁琐。

对于完整的状态管理生态，大家可以尝试一下 `dvajs` ，它是基于 redux-saga 基础上，实现的异步的状态管理工具。dvajs 处理 reducers 也比较精妙，感兴趣的同学可以研究一下。

## 五 总结

通过本章节的学习，应该已经掌握一下内容：

* 1 Redux 的基本概念和常用 API 。
* 2 react-redux 基本用法，以及两种常用场景的实践 demo 。
* 3 react-redux 原理实现。

下一节将学习 React 状态管理的另外一种方式 Mobx 。