时下流行的前端状态管理解决方案有很多，这里我想和大家探讨的是几个最具代表性的**函数式状态管理解法**，它们分别是：  

-   **React** 状态管理中的“不可变数据”
-   **Redux** 设计&实践中的函数式要素
    -   纯函数
    -   不可变值
    -   高阶函数&柯里化
    -   函数组合


-   **RxJS** 对响应式编程与“盒子模式”的实践

    -   如何理解“响应式编程”
    -   如何把副作用放进“盒子”

## React 状态管理中的“不可变数据”

众所周知，“不可变值/不可变数据”是 React 强烈推荐开发者遵循的一个原则。这个原则在 React 中被应用于 React 组件的状态（state）和属性（props），这些数据一旦被创建，就不能被修改，只能通过创建新的数据来实现更新。

> “不可变数据”的内涵我们在[第 6 节](<https://juejin.cn/book/7173591403639865377/section/7175421412025303100>)-[第 10 节](<https://juejin.cn/book/7173591403639865377/section/7175422876495904827>)已经有过非常深入的探讨，此处不再赘述。

### 表象：“不可变数据”确保 React 视图能够正常更新

在 React 中，如果不遵循不可变数据的原则，可能会导致组件无法正常更新或出现一些不可预期的问题。下面是一个使用可变数据的 React 组件示例：

```jsx
import React, { useState } from 'react'

function MutableComponent() {
  const [items, setItems] = useState(['apple', 'banana', 'orange'])

  const handleRemove = (index) => {
    // 直接修改了原数组，违背了不可变原则
    items.splice(index, 1) 
    setItems(items)
  }

  return (
    <ul>
      {items.map((item, index) => (
      <li key={index}>
        {item}
        <button onClick={() => handleRemove(index)}>remove</button>
      </li>
    ))}
    </ul>
  )
}
```

在这段代码中，`handleRemove` 函数直接修改了原始数组 `items`，然后又针对这个原始数组进行了一次新的`setState`操作（代码中对应 `setItems`函数）。这就违背了不可变数据的原则——在不可变原则下，React 预期我们针对新的状态创建一个全新的数组，以此来确保新老数据的不可变性。

这段实践了“可变数据”的代码会导致组件无法正常更新——我们的初衷是通过点击 remove 按钮来实现列表项的删除，但楼上这段代码呈现出的效果则是：无论我们点击多少次 remove 按钮，整个列表都不会发生任何的改变。

**为了避免这类问题出现，我们应该始终使用不可变数据。**

实现不可变数据的思路有很多，对于这个例子来说，最直接的一个思路就是在执行 `Array.prototype.splice()`方法之前，先对原始数组做一次拷贝，如代码所示：

```jsx
import React, { useState } from 'react'

function ImmutableComponent() {
  const [items, setItems] = useState(['apple', 'banana', 'cherry'])

  const handleRemove = (index) => {
    // 基于原始数组，创建一个新数组
    const newItems = [...items]  
    newItems.splice(index, 1) 
    setItems(newItems)
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item}
          <button onClick={() => handleRemove(index)}>remove</button>
        </li>
      ))}
    </ul>
  )
}
```

在上面的代码中，`handleRemove` 函数基于不可变数据的原则，创建了一个新的数组 `newItems`，确保了新老状态的不可变性。**在**`setState`**前后，新老状态相互独立、各有各的引用，这就是 React 所期待的“状态不可变”** 。

> 注：除了会导致视图更新失败之外，不遵循不可变数据原则还可能导致一些性能问题——因为 React 的性能优化依赖于对数据的比较，如果使用可变数据，React 就需要对每个可变数据进行深度比较，这样会消耗更多的时间和内存。因此，在[ React 官方的性能优化建议](https://zh-hans.reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data)中，也给不可变数据记下了浓墨重彩的一笔。

表象咱们看到了，那深层的原因又是什么呢？具体来说，**为什么 React 就认准了不可变数据不撒手呢**？

### 内核：“数据-视图”间高度确定的函数式映射关系

通过[第 23 节](<https://juejin.cn/book/7173591403639865377/section/7175423125817917495>)的学习，我们已经知道，**React 组件是一个吃进数据、吐出 UI 的【纯函数】。**

**纯函数**意味着**确定性**，意味着严格的一对一映射关系，意味着**对于相同的数据输入，必须有相同的视图输出**。

在这个映射关系的支撑下，对于同一个函数（React 组件）、同一套入参（React 状态）来说，组件所计算出的视图内容必定是一致的。也就是说，**在数据没有发生变化的情况下，React 是有权不去做【重计算】的**。这也是我们可以借助`Pure Component` 和 `React.memo()` 等技术缓存 React 组件的根本原因。

React 之所以以“不可变数据”作为状态更新的核心原则，根源就在于它的**函数式内核**，在于它追求的是**数据（输入）和视图（输出）之间的高度确定的映射关系**——如果数据可变（注意，“可变”指的是引用不变，但数据内容变了），就会导致数据和 UI 之间的映射关系不确定，从而使得 React 无法确定“有没有必要进行重计算”，最终导致渲染层面的异常。

也就是说，**React 组件的纯函数特性和不可变数据原则是相互支持、相互依赖的**，它们的本质目的都是为了确保 React 的渲染过程高度确定、高度可预测，从而提高应用的性能和可维护性。

## Redux

和 React 一样，Redux 在前端社区中也扮演了一个推广函数式编程的重要角色。从设计、实现到实践原则，Redux 由内而外地堆满了函数式编程的各种 buff，接下来我们要探讨的就是其中最核心的 5 个 buff：**纯函数、不可变数据、高阶函数、柯里化和函数组合**。

### 纯函数

在 Redux 中，所有的状态变化都是由纯函数（称为 `reducer`）来处理的，这些函数接收当前的状态（`state`）和一个 `action` 对象，返回一个新的状态。

下面是一个简单的示例，展示了 Redux 如何使用纯函数来更新状态：

```jsx
// 定义初始状态
const initialState = {
  count: 0,
};

// 定义 reducer 函数，接收当前状态和动作对象，返回新状态
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 }
    case "decrement":
      return { ...state, count: state.count - 1 }
    default:
      return state;
  }
}

// 创建 store，将 reducer 函数传入
const store = Redux.createStore(counterReducer)


// 分发动作对象，触发状态变化
store.dispatch({ type: "increment" })
store.dispatch({ type: "decrement" })
```

在上面的示例中，`counterReducer` 函数就是一个 `reducer`，它接收当前 `state`和一个 `action`对象作为入参，返回一个新的 `state`作为计算结果——Redux 的设计原则要求整个`reducer`的函数体**除了计算、啥也不干**，因此 `reducer`是标准的纯函数。

由于纯函数要求我们保持外部数据的不可变性，这里我们在更新 `count` 属性时，使用了扩展运算符来拷贝当前状态。这就又引出了我们喜闻乐见的“不可变数据”原则。

> 注：由此可见，纯函数和不可变数据真的是一对好基友，它们总是相互支持、相互成就的。

### 不可变数据

Redux 的不可变数据原则体现在它的 `state` 数据结构上。

Redux 要求我们在修改 `state` 时使用不可变数据——也就是创建一个新的 `state` 对象，而不是在原有的 state 上进行修改。这一点在楼上的示例中已经充分体现，此处不多赘述。

### 高阶函数&柯里化

在 Redux 中，高阶函数的应用非常广泛。在这里，我想重点展开来讲的是“Redux 中间件”这个东西，它不仅应用了高阶函数和柯里化的思想，同时和函数组合也有密不可分的关系。

在 Redux 中，中间件是一个函数，它【**嵌套地**】接收三个入参：`store`、`next`和`action`。其中，`store`是 Redux 唯一的状态树，`next`是一个函数，用于将当前 `action`传递给下一个中间件或者传递给 `reducer`，而 `action`则是当前需要处理的行为信息对象。

下面我实现了一个简单的 Redux 中间件，用来在状态更新的前后输出两行 log：

```js
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('dispatching the action:', action)
  const result = next(action)
  console.log('dispatched and new state is', store.getState())
  return result
}

const store = createStore(reducer, applyMiddleware(loggerMiddleware))
```

在这个例子中，我们定义了一个名为 `loggerMiddleware` 的中间件。它接收一个`store`对象，返回一个结果函数 A，A 函数接收一个 `next`函数，返回一个新的结果函数 B。这个结果函数 B 会接收一个 action 对象，最终执行完整个中间件逻辑，并返回执行结果。

通过观察 `loggerMiddleware`，我们注意到，它是 3 个相互嵌套的一元函数所构成的**高阶函数**，是一个被**柯里化**过的函数。

> 注：柯里化是把 **1 个 n 元函数**改造为 **n 个相互嵌套的一元函数**的过程，它是高阶函数的一种应用，详见小册[ 15 节](<https://juejin.cn/book/7173591403639865377/section/7175423003319074876>)。

通过柯里化，Redux 中间件可以将参数相同的多次调用转化为单次调用，提高了代码复用性和可维护性，也为“延迟执行”（即在当前上下文先传递部分参数，等到后面确实需要执行的时候再传递剩余参数）提供了可能性。

### 函数组合

当我们需要组合多个中间件的能力时，就用上函数组合了。

以下是 Redux 中组合不同中间件的示例代码：

```js
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const middleware = [thunk, logger, errorReport]

const store = createStore(
  reducer,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)
```

上述代码中，我们将`thunk`、`logger`和`errorReport`这三个中间件函数通过 `compose` 函数组合起来，并使用`applyMiddleware`函数将这些中间件函数应用到Redux的`store`中。

值得注意的是，这段代码中的 `compose`是从 `redux`内部引入的，也就是说，`redux`没有借助外部的函数式编程库，而是自己写了一个 `compose`函数来用。这就让人很难不好奇它自有的这个 `compose`长啥样：

```js
export default function compose(...funcs) {
  // 对函数个数为0的情况特判
  if (funcs.length === 0) {
    return arg => arg
  }
  // 对函数个数为1的情况特判
  if (funcs.length === 1) {
    return funcs[0]
  }

  // 最后这行和我们 22 节实现的 pipe 是一样的
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

我们来看最关键的一行，也就是最后一行，这行代码和我们 [第 14 节](<https://juejin.cn/book/7173591403639865377/section/7175422922192846907>) 实现的版本不同，但和我们[第 22 节](<https://juejin.cn/book/7173591403639865377/section/7175423078837518396>)实现的 `pipe`函数可是亲兄弟呀：

```js
// 第 22 节实现的 pipe 函数
const pipe  = (...funcs) => funcs.reduce(
  // 和 14 节的 pipe 一样是基于 reduce 实现，主要的区别在于对组合链入参的处理不同
  (f, g) => (...args) => g(f(...args))
);
```

这种写法的 `pipe/compose` 最大的特点在于对组合链入参的处理——`...args`中扩展运算符的存在，使得这类 `pipe/compose`组合出的函数能够消化多个入参，像这样：

```js
pipe(
  likeLessons,
  registerLessons,
  emptyUserLiked,
  isVIP,
  // 这两个参数都会被传递给组合链中的第一个函数
)(user, myLessons)
```

> 注：楼上这段代码，在[ 22 节](<https://juejin.cn/book/7173591403639865377/section/7175423078837518396>) 有完整的示例，跳读至此的同学可以狠狠[点这里](<https://juejin.cn/book/7173591403639865377/section/7175423078837518396>)补全阅读上下文。）

  


## 小结

本节我们通过分析大家相对熟悉的 React & Redux 技术点，对前面学过的纯函数、不可变数据、高阶函数、柯里化、函数组合等关键知识点进行了整合和串联。通过本节的学习，相信大家能够对已经学过的知识有更深刻的理解和认同。

其实，除了这些“典中典”的函数式编程特性在前端领域有广泛的实践以外，还有像“盒子模式”这样相对冷门的编程方法，它也是可以在生产级别的项目中大放异彩的。下一节，我们就将以 RxJS 为例，探讨盒子模式在前端状态管理中的实践。