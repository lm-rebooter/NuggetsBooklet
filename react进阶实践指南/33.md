在 React 18 中，引进了一个新的 API —— `startTransition` 还有二个新的 hooks —— `useTransition` 和 `useDeferredValue`，本质上它们离不开一个概念 `transition` 。

通过本章节学习，你将收获以下内容：

* `Transition` 产生初衷，解决了什么问题。
* `startTransition` 的用法和原理。
* `useTranstion` 的用法和原理。
* `useDeferredValue` 的用法和原理。


什么叫做 `transition` 英文翻译为 **‘过渡’**，那么这里的过渡指的就是在一次更新中，数据展现从无到有的过渡效果。用 [ReactWg](https://github.com/reactwg/react-18/discussions/41) 中的一句话描述 startTransition 。

> 在大屏幕视图更新的时，startTransition 能够保持页面有响应，这个 api 能够把 React 更新标记成一个特殊的更新类型 `transitions` ，在这种特殊的更新下，React 能够保持视觉反馈和浏览器的正常响应。

单单从上述对 `startTransition` 的描述，我们很难理解这个新的 api 到底解决什么问题。不过不要紧，接下来让我逐步分析这个 api 到底做了什么，以及它的应用场景。


## 二 transition 使命

### 1 transition 的诞生

为什么会出现 Transition 呢？ Transition 本质上解决了渲染并发的问题，在 React 18 关于 startTransition 描述的时候，多次提到 ‘大屏幕’ 的情况，这里的大屏幕并不是单纯指的是尺寸，而是一种数据量大，DOM 元素节点多的场景，比如数据可视化大屏情况，在这一场景下，一次更新带来的变化可能是巨大的，所以频繁的更新，执行 js 事务频繁调用，浏览器要执行大量的渲染工作，所以给用户感觉就是卡顿。

Transition 本质上是用于一些不是很急迫的更新上，在 React 18 之前，所有的更新任务都被视为急迫的任务，在 React 18 诞生了 `concurrent Mode` 模式，在这个模式下，渲染是可以中断，低优先级任务，可以让高优先级的任务先更新渲染。可以说 React 18 更青睐于良好的用户体验。从  `concurrent Mode` 到 `susponse` 再到 `startTransition` 无疑都是围绕着更优质的用户体验展开。

startTransition 依赖于 `concurrent Mode` 渲染并发模式。也就是说在 React 18 中使用 `startTransition` ，那么要先开启并发模式，也就是需要通过 `createRoot` 创建 Root 。我们先来看一下两种模式下，创建 Root 区别。


**传统 legacy 模式**
```js
import ReactDOM from 'react-dom'
/* 通过 ReactDOM.render  */
ReactDOM.render(
    <App />,
    document.getElementById('app')
)
```

**v18 concurrent Mode并发模式**
```js
import ReactDOM from 'react-dom'
/* 通过 createRoot 创建 root */
const root =  ReactDOM.createRoot(document.getElementById('app'))
/* 调用 root 的 render 方法 */
root.render(<App/>)

```

上面说了 startTransition 使用条件，接下来探讨一下 startTransition 到底应用于什么场景。 前面说了 React 18 确定了不同优先级的更新任务，为什么会有不同优先级的任务。世界上本来没有路，走的人多了就成了路，优先级产生也是如此，React 世界里本来没有优先级，场景多了就出现了优先级。

如果一次更新中，都是同样的任务，那么也就无任务优先级可言，统一按批次处理任务就可以了，可现实恰好不是这样子。举一个很常见的场景：**就是有一个 `input` 表单。并且有一个大量数据的列表，通过表单输入内容，对列表数据进行搜索，过滤。那么在这种情况下，就存在了多个并发的更新任务。分别为**

* 第一种：input 表单要实时获取状态，所以是受控的，那么更新 input 的内容，就要触发更新任务。
* 第二种：input 内容改变，过滤列表，重新渲染列表也是一个任务。

第一种类型的更新，在输入的时候，希望是的视觉上马上呈现变化，如果输入的时候，输入的内容延时显示，会给用户一种极差的视觉体验。第二种类型的更新就是根据数据的内容，去过滤列表中的数据，渲染列表，这个种类的更新，和上一种比起来优先级就没有那么高。那么如果 input 搜索过程中用户更优先希望的是输入框的状态改变，那么正常情况下，在 input 中绑定 onChange 事件用来触发上述的两种类的更新。

```js
const handleChange=(e)=>{
   /* 改变搜索条件 */ 
   setInputValue(e.target.value)
   /* 改变搜索过滤后列表状态 */
   setSearchQuery(e.target.value)
}
```

上述这种写法，那么 `setInputValue` 和 `setSearchQuery` 带来的更新就是一个相同优先级的更新。而前面说道，**输入框状态改变更新优先级要大于列表的更新的优先级。** ，这个时候我们的主角就登场了。用 `startTransition` 把两种更新区别开。

```js
const handleChange=()=>{
    /* 高优先级任务 —— 改变搜索条件 */
    setInputValue(e.target.value)
    /* 低优先级任务 —— 改变搜索过滤后列表状态  */
    startTransition(()=>{
        setSearchQuery(e.target.value)
    })
}
```
* 如上通过 startTransition 把不是特别迫切的更新任务 setSearchQuery  隔离出来。这样在真实的情景效果如何呢？我们来测试一下。

### 2 模拟场景

接下来我们模拟一下上述场景。流程大致是这样的：

* 有一个搜索框和一个 10000 条数据的列表，列表中每一项有相同的文案。
* input 改变要实时改变 input 的内容（第一种更新），然后高亮列表里面的相同的搜索值（第二种更新）。
* 用一个按钮控制 常规模式 ｜ `transition` 模式。


```js
/*  模拟数据  */
const mockDataArray = new Array(10000).fill(1)
/* 高量显示内容 */
function ShowText({ query }){
   const text = 'asdfghjk'
   let children
   if(text.indexOf(query) > 0 ){
       /* 找到匹配的关键词 */
       const arr = text.split(query)
       children = <div>{arr[0]}<span style={{ color:'pink' }} >{query}</span>{arr[1]} </div>
   }else{
      children = <div>{text}</div>
   }
   return <div>{children}</div>
}
/* 列表数据 */
function List ({ query }){
    console.log('List渲染')
    return <div>
        {
           mockDataArray.map((item,index)=><div key={index} >
              <ShowText query={query} />
           </div>)
        }
    </div>
}
/* memo 做优化处理  */
const NewList = memo(List)
```
* `List` 组件渲染一万个 `ShowText` 组件。在 ShowText 组件中会通过传入的 query 实现动态高亮展示。
* 因为每一次改变 `query` 都会让 10000 个重新渲染更新，并且还要展示 query 的高亮内容，所以满足**并发渲染**的场景。

接下来就是 App 组件编写。

```js
export default function App(){
    const [ value ,setInputValue ] = React.useState('')
    const [ isTransition , setTransion ] = React.useState(false)
    const [ query ,setSearchQuery  ] = React.useState('')
    const handleChange = (e) => {
        /* 高优先级任务 —— 改变搜索条件 */
        setInputValue(e.target.value)
        if(isTransition){ /* transition 模式 */
            React.startTransition(()=>{
                /* 低优先级任务 —— 改变搜索过滤后列表状态  */
                setSearchQuery(e.target.value)
            })
        }else{ /* 不加优化，传统模式 */
            setSearchQuery(e.target.value)
        }
    }
    return <div>
        <button onClick={()=>setTransion(!isTransition)} >{isTransition ? 'transition' : 'normal'} </button>
        <input onChange={handleChange}
            placeholder="输入搜索内容"
            value={value}
        />
       <NewList  query={query} />
    </div>
}

```
我们看一下 App 做了哪些事情。
* 首先通过 handleChange 事件来处理 onchange 事件。
* `button`按钮用来切换 **transition** （设置优先级） 和 **normal** （正常模式）。接下来就是见证神奇的时刻。


**常规模式下效果：**

![1.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de9fe6361fe84fc189d058eb2aac871d~tplv-k3u1fbpfcp-watermark.image?)

* 可以清楚的看到在常规模式下，输入内容，内容呈现都变的异常卡顿，给人一种极差的用户体验。


**transtion 模式下效果：**


![2.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03ace3d59982418ea20a20a44257ae0d~tplv-k3u1fbpfcp-watermark.image?)

* 把大量并发任务通过 startTransition 处理之后，可以清楚看到，input 会正常的呈现，更新列表任务变得滞后，不过用户体验大幅度提升，

**整体效果：**

![3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fda3c374cc0e43c3bcbbdc42aafd5ba1~tplv-k3u1fbpfcp-watermark.image?)

* 来感受一些 startTransition 的魅力。


**总结：** 通过上面可以直观的看到 startTransition 在处理过渡任务，优化用户体验上起到了举足轻重的作用。

### 3 为什么不是 setTimeout

上述的问题能够把 `setSearchQuery` 的更新包装在 `setTimeout` 内部呢，像如下这样。

```js
const handleChange=()=>{
    /* 高优先级任务 —— 改变搜索条件 */
    setInputValue(e.target.value)
    /* 把 setSearchQuery 通过延时器包裹  */
    setTimeout(()=>{
        setSearchQuery(e.target.value)
    },0)
}
```
* 这里通过 setTimeout ，把更新放在 setTimeout 内部，那么我们都知道 setTimeout 是属于延时器任务，它不会阻塞浏览器的正常绘制，浏览器会在下次空闲时间之行 setTimeout 。那么效果如何呢？我们来看一下：


![4.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3dad3d51d40421cbec2aea31b00a2e4~tplv-k3u1fbpfcp-watermark.image?)

* 如上可以看到，通过 setTimeout 确实可以让输入状态好一些，但是由于 setTimeout 本身也是一个宏任务，而每一次触发 onchange 也是宏任务，所以 setTimeout 还会影响页面的交互体验。

综上所述，startTransition 相比 setTimeout 的优势和异同是：

* 一方面：startTransition 的处理逻辑和 setTimeout 有一个**很重要的区别**，setTimeout 是异步延时执行，而 startTransition 的回调函数是同步执行的。在 startTransition 之中任何更新，都会标记上 `transition`，React 将在更新的时候，判断这个标记来决定是否完成此次更新。所以 Transition 可以理解成比 setTimeout 更早的更新。但是同时要保证 ui 的正常响应，在性能好的设备上，transition 两次更新的延迟会很小，但是在慢的设备上，延时会很大，但是不会影响 UI 的响应。

* 另一方面，就是通过上面例子，可以看到，对于渲染并发的场景下，setTimeout 仍然会使页面卡顿。因为超时后，还会执行 setTimeout 的任务，它们与用户交互同样属于宏任务，所以仍然会阻止页面的交互。那么 `transition` 就不同了，在 conCurrent mode 下，`startTransition` 是可以中断渲染的 ，所以它不会让页面卡顿，React 让这些任务，在浏览器空闲时间执行，所以上述输入 input 内容时，startTransition 会优先处理 input 值的更新，而之后才是列表的渲染。

### 4 为什么不是节流防抖

那么我们再想一个问题，为什么不是节流和防抖。首先节流和防抖能够解决卡顿的问题吗？答案是一定的，在没有 transition 这样的 api 之前，就只能通过**防抖**和**节流**来处理这件事，接下来用防抖处理一下。

```js
const SetSearchQueryDebounce = useMemo(()=> debounce((value)=> setSearchQuery(value),1000)  ,[])
const handleChange = (e) => {
    setInputValue(e.target.value)
    /* 通过防抖处理后的 setSearchQuery 函数。  */
    SetSearchQueryDebounce(e.target.value)
}
```
* 如上将 setSearchQuery 防抖处理。然后我们看一下效果。


![5.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0db256f94a147f697bcb0c2f86b4fe5~tplv-k3u1fbpfcp-watermark.image?)

通过上面可以直观感受到通过防抖处理后，基本上已经不影响 input 输入了。但是面临一个问题就是 list 视图改变的延时时间变长了。那么 transition 和**节流防抖** 本质上的区别是：

* 一方面，节流防抖 本质上也是 setTimeout ，只不过控制了执行的频率，那么通过打印的内容就能发现，原理就是让 render 次数减少了。而 transitions 和它相比，并没有减少渲染的次数。

* 另一方面，节流和防抖需要有效掌握 `Delay Time` 延时时间，如果时间过长，那么给人一种渲染滞后的感觉，如果时间过短，那么就类似于 setTimeout(fn,0) 还会造成前面的问题。而 startTransition 就不需要考虑这么多。

### 5 受到计算机性能影响

transition 在处理慢的计算机上效果更加明显，我们来看一下 [Real world example](https://github.com/reactwg/react-18/discussions/65)

**注意看滑块速度**

* 处理性能高，更快速的设备上。不使用 startTransition 。


![12.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b68327a51b484e69b6ef000a2ae40207~tplv-k3u1fbpfcp-watermark.image?)

* 处理性能高，更快速的设备上。使用 startTransition。


![13.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/735dcc84cc0b49a78009bc3652778e49~tplv-k3u1fbpfcp-watermark.image?)

* 处理性能差，慢速的设备上，不使用 startTransition。


![14.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6008c22fed1d4f699867bffd6e2269b9~tplv-k3u1fbpfcp-watermark.image?)

* 处理性能差，慢速的设备上，使用 startTransition。


![15.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/438aaeec2f4148e5ae1319d6f290137d~tplv-k3u1fbpfcp-watermark.image?)

## 三 transition 特性

既然已经讲了 transition 的产生初衷，接下来看 transition 的功能介绍 。

### 1 什么是过渡任务。

一般会把状态更新分为两类：

* 第一类紧急更新任务。比如一些用户交互行为，按键，点击，输入等。
* 第二类就是过渡更新任务。比如 UI 从一个视图过渡到另外一个视图。

### 2 什么是 startTransition

上边已经用了 `startTransition` 开启过度任务，对于 startTransition 的用法，相信很多同学已经清楚了。

```js
startTransition(scope)
```
* scope 是一个回调函数，里面的更新任务都会被标记成**过渡更新任务**，过渡更新任务在渲染并发场景下，会被降级更新优先级，中断更新。

**使用**

```js
startTransition(()=>{
   /* 更新任务 */
   setSearchQuery(value)
})
```

### 3 什么是 useTranstion 

上面介绍了 startTransition ，又讲到了过渡任务，本质上过渡任务有一个过渡期，在这个期间当前任务本质上是被中断的，那么在过渡期间，应该如何处理呢，或者说告诉用户什么时候过渡任务处于 `pending` 状态，什么时候 `pending` 状态完毕。

为了解决这个问题，React 提供了一个带有 isPending 状态的 hooks —— useTransition 。useTransition 执行返回一个数组。数组有两个状态值：

* 第一个是，当处于过渡状态的标志——isPending。
* 第二个是一个方法，可以理解为上述的 startTransition。可以把里面的更新任务变成过渡任务。

```js
import { useTransition } from 'react' 

/* 使用 */
const  [ isPending , startTransition ] = useTransition ()
```

那么当任务处于悬停状态的时候，`isPending` 为 `true`，可以作为用户等待的 UI 呈现。比如：

```js
{ isPending  &&  < Spinner  / > }
```

#### useTranstion 实践
接下来我们做一个 useTranstion 的实践，还是复用上述 demo 。对上述 demo 改造。

```js
export default function App(){
    const [ value ,setInputValue ] = React.useState('')
    const [ query ,setSearchQuery  ] = React.useState('')
    const [ isPending , startTransition ] = React.useTransition()
    const handleChange = (e) => {
        setInputValue(e.target.value)
        startTransition(()=>{
            setSearchQuery(e.target.value)
        })
    }
    return  <div>
    {isPending && <span>isTransiton</span>}
    <input onChange={handleChange}
        placeholder="输入搜索内容"
        value={value}
    />
   <NewList  query={query} />
</div>
}
```
* 如上用 `useTransition` ， `isPending` 代表过渡状态，当处于过渡状态时候，显示 `isTransiton` 提示。

接下来看一下效果：


![6.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d256d72266974280adbaeba238d974cb~tplv-k3u1fbpfcp-watermark.image?)


可以看到能够准确捕获到过渡期间的状态。

### 4 什么是 useDeferredValue

如上场景我们发现，本质上 query 也是 value ，不过 query 的更新要滞后于 value 的更新。那么 React 18 提供了 `useDeferredValue` 可以让状态滞后派生。useDeferredValue 的实现效果也类似于 `transtion`，当迫切的任务执行后，再得到新的状态，而这个新的状态就称之为 DeferredValue 。

 useDeferredValue 和上述 useTransition 本质上有什么异同呢？

**相同点：**

* useDeferredValue 本质上和内部实现与 useTransition  一样都是标记成了过渡更新任务。

**不同点：**

* **useTransition 是把 startTransition 内部的更新任务变成了过渡任务`transtion`,而 useDeferredValue 是把原值通过过渡任务得到新的值，这个值作为延时状态。** 一个是处理一段逻辑，另一个是生产一个新的状态。
* useDeferredValue 还有一个不同点就是这个任务，本质上在 useEffect 内部执行，而 useEffect 内部逻辑是异步执行的 ，所以它一定程度上更滞后于 `useTransition`。 **`useDeferredValue` = `useEffect` + `transtion`**

那么回到 demo 上来，似乎 query 变成 DeferredValue 更适合现实情况，那么对 demo 进行修改。

```js
export default function App(){
    const [ value ,setInputValue ] = React.useState('')
    const query = React.useDeferredValue(value)
    const handleChange = (e) => {
        setInputValue(e.target.value)
    }
    return  <div>
     <button>useDeferredValue</button>
    <input onChange={handleChange}
        placeholder="输入搜索内容"
        value={value}
    />
   <NewList  query={query} />
   </div>
}
```
* 如上可以看到 query 是 value 通过 useDeferredValue 产生的。

效果：

![7.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/110f9db7ec21466398776a97c338a0b2~tplv-k3u1fbpfcp-watermark.image?)


## 四 原理

接下来又到了原理环节，从 startTransition 到 useTranstion 再到 useDeferredValue 原理本质上很简单，

### 1 startTransition

首先看一下最基础的 startTransition 是如何实现的。

> react/src/ReactStartTransition.js -> startTransition
```js
export function startTransition(scope) {
  const prevTransition = ReactCurrentBatchConfig.transition;
  /* 通过设置状态 */
  ReactCurrentBatchConfig.transition = 1;
  try {  
      /* 执行更新 */
    scope();
  } finally {
    /* 恢复状态 */  
    ReactCurrentBatchConfig.transition = prevTransition;
  }
}
```
* `startTransition` 原理特别简单，有点像 React v17 中 batchUpdate 的批量处理逻辑。就是通过设置开关的方式，而开关就是 `transition = 1` ，然后执行更新，里面的更新任务都会获得 `transtion` 标志。

* 接下来在 concurrent mode 模式下会单独处理 `transtion` 类型的更新。

其原理图如下所示。


![9.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6cddf1d2a3541e88fa6998da9201e64~tplv-k3u1fbpfcp-watermark.image?)

### 2 useTranstion

接下来看一下 `useTranstion` 的内部实现。

> react-reconciler/src/ReactFiberHooks.new.js -> useTranstion
```js
function mountTransition(){
    const [isPending, setPending] = mountState(false);
    const start = (callback)=>{
        setPending(true);
        const prevTransition = ReactCurrentBatchConfig.transition;
        ReactCurrentBatchConfig.transition = 1;
        try {
            setPending(false);
            callback();
        } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
        }
    }
     return [isPending, start];
}
```
这段代码不是源码，我把源码里面的内容进行组合，压缩。

* 从上面可以看到，useTranstion 本质上就是 **`useState`** +  **`startTransition`** 。
* 通过 useState 来改变 pending 状态。在 mountTransition 执行过程中，会触发两次 `setPending` ，一次在 `transition = 1` 之前，一次在之后。一次会正常更新 `setPending(true)` ，一次会作为 `transition` 过渡任务更新 `setPending(false);` ，所以能够精准捕获到过渡时间。

其原理图如下所示。


![10.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a97061df91ff45b690d3441e34a5f990~tplv-k3u1fbpfcp-watermark.image?)

### 3 useDeferredValue

最后，让我们看一下 `useDeferredValue` 的内部实现原理。

 > react-reconciler/src/ReactFiberHooks.new.js -> useTranstion
```js
function updateDeferredValue(value){
  const [prevValue, setValue] = updateState(value);
  updateEffect(() => {
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = 1;
    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}
```

useDeferredValue 处理流程是这样的。
* 从上面可以看到 useDeferredValue 本质上是 `useDeferredValue` = `useState` + `useEffect` + `transition` 
* 通过传入 useDeferredValue 的 value 值，useDeferredValue 通过 useState 保存状态。
* 然后在 useEffect 中通过 `transition` 模式来更新 value 。 这样保证了 DeferredValue 滞后于 state 的更新，并且满足 `transition`  过渡更新原则。

其原理图如下所示。


![11.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b09af2e1eb74577b50e4801f1befcaf~tplv-k3u1fbpfcp-watermark.image?)

## 四 总结

本章节讲到的知识点如下：

* `Transition` 产生初衷，解决了什么问题。
* `startTransition` 的用法和原理。
* `useTranstion` 的用法和原理。
* `useDeferredValue` 的用法和原理。


### 参考文档

* [New feature: startTransition](https://github.com/reactwg/react-18/discussions/41)

* [Real world example: adding startTransition for slow renders](https://github.com/reactwg/react-18/discussions/65)