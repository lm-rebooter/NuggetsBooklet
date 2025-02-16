书接上回，本节我们将站在函数式编程的视角，探讨 React 从“Class组件+设计模式”到“函数组件+Hooks”的研发模式变革。

> 注：阅读本节内容，需要第 22 节、23 节的内容作为前置知识，建议跳读的同学往前回退两节，补齐上下文。

  


通过上一节的学习，我们已经知道，在 Class 组件占据统治地位的时期，为了更好地解决编码复杂度的问题，我们曾求助于一系列的 React 设计模式，这些设计模式包括但不限于：

-   高阶组件
-   render props
-   容器组件/展示组件
-   ...

其中，高阶组件和 render props 都是解决代码重用问题的经典模式。容器组件/展示组件虽然也是代码重用的一种思路，但它真正的威力其实并不在此，而在于“关注点分离”。

无论是代码重用，还是关注点分离，这些设计模式或多或少都以函数式思想作为底色。

接下来，我们就通过分析具体的设计模式，一起去把这个“底色”给挖出来。

## 函数式的 React 代码重用思路

### 高阶组件（HOC）的函数式本质

> 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。
具体而言，**高阶组件是参数为组件，返回值为新组件的函数。**
——React 官方文档

在这段描述里，有两个华点，是值得我们细细品味的：

-   高阶组件是**函数**
-   高阶组件是一种基于 React 的**组合特性**而形成的设计模式

#### 高阶组件是函数

【划重点1】：**高阶组件是函数，** 一种吃进组件、吐出新组件的函数。

无论是名字还是内涵，“高阶组件”这玩意儿都很难让人不联想到[第11节](<https://juejin.cn/book/7173591403639865377/section/7175422748213116983>)我们聊过的 HOF（高阶函数）。

> **高阶函数，指的就是接收函数作为入参，或者将函数作为出参返回的函数。**
——[本册第11节](<https://juejin.cn/book/7173591403639865377/section/7175422748213116983>)

高阶函数的主要效用在于**代码重用**，高阶组件也是如此。

**当我们使用函数组件构建应用程序时，高阶组件就是高阶函数。**

#### 要组合，不要继承

**【划重点2】：** 高阶组件“是一种基于 React 的**组合特性**而形成的设计模式”。

看到没看到没？“**组合特性**”啊，家人们！ 上节咱们说什么来着——**即便是在 Class 组件占据统治地位的时期，React 官方在代码重用方面的建议也是“要组合，不要继承”。** 高阶组件就是一个活生生的例子。

更进一步地，当我们需要同时用到多个高阶组件时，甚至直接可以使用函数式编程中喜闻乐见的 `compose` 函数来组合这些高阶组件，像这样：

```jsx
// 定义一个 NetWorkComponent，组合多个高阶组件的能力
const NetWorkComponent = compose(
  // 高阶组件 withError，用来提示错误
  withError,
  // 高阶组件 withLoading，用来提示 loading 态
  withLoading,
  // 高阶组件 withFetch，用来调后端接口
  withFetch
)(Component)

const App = () => {
  ...

  return (
    <NetWorkComponent
      // params 入参交给 withFetch 消化
      url={url}
      // error 入参交给 withError 消化
      error={error}  
      // isLoading 入参交给 withLoading 消化
      isLoading={isLoading}
    />
  )
}
```

毕竟，高阶组件本质上也是函数，组合高阶组件，就是在组合函数——都组合函数了，不拉`compose`出来溜溜怎么行？

这又是 `HOF`、又是 `compose`的，不得不说，高阶组件身上确实叠了不少函数式的 buff。作为类组件时期的代表性设计模式，高阶组件的存在和流行足以向我们证明：**无论组件的载体是类还是函数，React 的代码重用思路总是函数式的。**

### 高阶组件（HOC）的局限性

让我们来看看下面这个高阶组件，它被用来进行条件渲染：

```jsx
import React from 'react'

const withError = (Component) => (props) => {
  if (props.error) {
    return <div>Here is an Error ...</div>
  }

  return <Component {...props} />
}

export default withError
```

如果有一个错误，它就渲染一个错误信息。如果没有错误，它将渲染给定的组件。

尽管今天的 Hooks 已经能够在许多场景下取代高阶组件，但在“条件渲染”这个场景下，使用高阶组件仍然不失为一个最恰当的选择——毕竟，Hooks 能够 return 数据，却不能够 return 组件。

因此，抛开前提去谈 `HOC`的局限性显然是不合适的。具体到本文来说，当我们探讨 `HOC`的局限性时，我们探讨的并不是类似“条件渲染”这种场景，而是对【**状态相关的逻辑】** 的重用。

比如下面这个高阶组件：

```jsx
import React from "react"

// 创建一个 HOC, 用于处理网络请求任务
const withFetch = (Component) => {
    
  // 注意，处理类组件时，HOC 每次都会返回一个新的类
  class WithFetch extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: {},
      }
    }

    componentDidMount() {
      // 根据指定的 url 获取接口内容
      fetch(this.props.url)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ data })
        })
    }

    render() {
      // 将目标数据【注入】给 Component 组件
      return (
        <>
          <Component {...this.props} data={this.state.data} />
        </>
      )
    } 
  }
  
  // 这行完全是 debug 用的，由于高阶组件每次都会返回新的类，我们需要 displayName 帮我们记住被包装的目标组件是谁
  WithFetch.displayName = `WithFetch(${Component.name})`
  
  // 返回一个被包装过的、全新的类组件
  return WithFetch
};

export default withFetch
```

这个组件主要做了这么几件事：

-   它根据 `this.props` 中指定的 url，请求一个后端接口
-   将获取到的数据(`data`)以 `state` 的形式维护在高阶组件的内部
-   将高阶组件内部的 `state.data` 以 `props` 的形式传递给目标组件 `Component`

用一句话来概括这个过程：**高阶组件把状态【注入】到了目标** `Component`**里。**

当任何一个组件 `Component` 需要应用同样的逻辑时，只需要像这样轻轻地在它外面包一层 `withFetch`，就可以【被注入】自己想要的数据：

```jsx
const FetchCommentComponent = withFetch(Component)
```

这 HOC 用起来确实比无脑复制粘贴高级的多，但它并不是完美的。随着应用复杂度的提升，HOC 的局限性也就跟着显现了。

#### 可读性问题

咱们上文说过，组合多个高阶组件，可以使用 `compose`。

随着应用的迭代，我们会发现，`Component`仅仅具备“获取数据”这一个能力是不够的，产品经理希望你为它增加以下功能：

1.  在请求发起前后，处理对应的 Loading 态（对应 HOC `withLoading`）
1.  在请求失败的情况下，处理对应的 Error 态（对应 HOC `withError`）

在 `compose`的加持下，我们可以快速写出如下代码：

```jsx
// 定义一个 NetWorkComponent，组合多个高阶组件的能力
const NetWorkComponent = compose(
  // 高阶组件 withError，用来提示错误
  withError,
  // 高阶组件 withLoading，用来提示 loading 态
  withLoading,
  // 高阶组件 withFetch，用来调后端接口
  withFetch
)(Component)

const App = () => {
  // 省略前置逻辑...

  return (
    <NetWorkComponent
      // url 入参交给 withFetch 消化
      url={url}
      // error 入参交给 withError 消化
      error={error}  
      // isLoading 入参交给 withLoading 消化
      isLoading={isLoading}
    />
  )
}
```

这个版本的代码是最理想的——参数名和 HOC 名严格对照，我们可以轻松地推导 `props`和`HOC`之间的关系。此时，整个组件的工作流和传参方式都是比较清晰的。

但很多时候，我们见到的代码是这样的：

```jsx
// 定义一个 NetWorkComponent，组合多个高阶组件的能力
const NetWorkComponent = compose(
  // 高阶组件 withError，用来提示错误
  withError,
  // 高阶组件 withLoading，用来提示 loading 态
  withLoading,
  // 高阶组件 withFetch，用来调后端接口
  withFetch
)(Component)

const App = () => {
  // 省略前置逻辑...

  return (
    <NetWorkComponent
      // url 入参交给 withFetch 消化
      url={url}
      // icon 入参是服务于谁的呢？
      icon={icon}
      // image 入参是服务于谁的呢？
      image={icon}
    />
  )
}
```

由于大家已经亲眼见过 `withFetch` 的实现，这里我们自然知道 `url`是供 `withFetch`消化的参数。但是 `icon`参数和 `image`参数又是为谁服务的呢？是为另外两个 HOC 服务的，还是为 `Component`组件本身服务的？

如果不去细看 `withLoading`和`withError`的具体实现逻辑，我们很难推测这些 `props`到底应该传什么样的值。

尽管这样的代码已经给我们构成一些研发阻力，但这还不是最糟的情况——至少，案例中`withFetch`的逻辑对我们来说仍然是透明的。   
更多的时候，我们见到的是下面这样的代码：

```jsx
// 定义一个 NetWorkComponent，组合多个高阶组件的能力
const NetWorkComponent = compose(
  // 高阶组件 withError，用来提示错误
  withError,
  // 高阶组件 withLoading，用来提示 loading 态
  withLoading,
  // 高阶组件 withNewFetch，用来调后端接口
  withNewFetch
)(Component)

const App = () => {
  ...

  return (
    <NetWorkComponent
      // params 入参是服务于谁的呢？
      params={params}
      // icon 入参是服务于谁的呢？
      icon={icon}
    />
  )
}
```

在这个 case 中，三个 `HOC`的内部实现我们都是不清楚的，`props`数量也从 3 个变成了 2 个。此时，理解代码的成本就更高了。

以上几种 case，我们讨论的都是 HOC 和 `props`之间的关系模糊问题。其实 HOC 模糊的地方不止这一处——HOC 和被包装组件`Component`之间的关系也是模糊的：由于 `HOC`对组件的包装是“不留痕迹”的（见`withFetch`示例中对“`displayName`”的注释解析），一个 `Component`被 `HOC`包装后，它会变成一个全新的组件，这就导致`HOC`层面的 bug 非常难以追溯。迫于此，我们不得不手动在每个 HOC 中标记`displayName`，但这相当于打了个补丁，治标不治本。

至于如何治“本”，这里先按下不表，咱们先顺着既有的思路，把“HOC 的局限性”这条线给讲完。

#### 命名冲突问题

这个问题就比较好理解了。假设我在同一个 `Component`里，想要复用两次 `withFetch`，代码该怎么写呢？

写成下面这样行不行呢：

```jsx
const FetchForTwice = compose(
  withFetch,
  withFetch,
)(Component)

const App = () => {
  ...

  const userId = '10086'

  return (
    <FetchForTwice
      // 这个 url 用于获取用户的个人信息
      url={`https://api.xxx/profile/${userId}`}
      // 这个 url 用于获取用户的钱包信息
      url={`https://api.xxx/wallet/${userId}`}
    />
  );
};
```

显然是不行的，众所周知，当出现两个同名的 `props`时，后面那个（钱包接口 url）会把前面那个（个人信息接口 url）覆盖掉。也就是说，`FetchForTwice`确实能够 `fetch`两次接口，但这两次`fetch`动作是重复的，每次都只会去`fetch`用户的钱包信息而已。

### render props 的正反两面

> 注：关于 render props 和 HOC 的对比与讨论，社区里已经有非常非常多详尽的文章。由于其中的不少细节和函数式编程的主题相去甚远，本文不作赘述，欢迎大家移步掘金社区探索。

render props 被认为是比 HOC 更加优雅的代码重用解法。这里提及 render props，并不是为了教大家怎么做“HOC vs render props”这道老八股面试题，而是为了给大家看下面这张图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a050795d41694bec96227122fc21ff8d~tplv-k3u1fbpfcp-zoom-1.image)

图中的代码是我基于楼上 HOC 的 `withFetch`简单改写出的 render props 版本。不熟悉 render props 的家人们可能会对 render 函数中的 `this.props.render()`感到困惑。这里简单介绍一下：`this.props.render()`可以是任意的一个函数组件，像这样：

```
<FetchComponent
  render={(data) => <div>{data.length}</div>}
  />
```

将这个 `props.render`代入楼上的 `FetchComponent`，我们看到的代码会更直观一些，如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c26e91d3173f42bc8d68fb4a20444747~tplv-k3u1fbpfcp-zoom-1.image)

这里我最想要大家关注的是我用红色方框圈出的这两个部分，这也是我认为 render props 最进步的一个点——它区分了两个不同的逻辑层次：上面的红色方框圈住的是“**数据的准备工作**”（充满副作用），下面的红色方框圈住的则是“**数据的渲染工作**”（纯函数）。

> 注意，这里的【渲染工作】指的是将数据映射为“对UI的描述”，而不是真实的 DOM渲染过程。这个【渲染工作】的载体是一个纯的函数组件，因此咱们说【渲染工作】是【纯函数】。

**也就是说，从 render props 这个模式开始，我们已经初步地在实践“pure/impure 分离”的函数式思想。**

然而，render props 也存在着这样那样的局限性，其中一个最经典的问题莫过于“嵌套地狱”问题了。比如我真的在一些存量项目中见过类似这样的代码（下图已脱敏）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5026aa00e90a414db62db7a898faa144~tplv-k3u1fbpfcp-zoom-1.image)

但整体来说，render props 的进步意义还是非常值得肯定的。

## 【函数组件 + Hooks】实现代码重用

铺垫完了 HOC 和 render props，终于要引出【函数组件 + Hooks】了。

首先再次声明，Hooks 是无法完全替代 HOC 和 render props 的。关于这个问题，React 官方的 Q&A 说得很清楚（传送门：[Hooks FAQ](<https://zh-hans.reactjs.org/docs/hooks-faq.html#do-hooks-replace-render-props-and-higher-order-components>)）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ec5742f11844748bb0d19cc7280ad9f~tplv-k3u1fbpfcp-zoom-1.image)

图上这个回答中提到的“大部分场景”就包括本文探讨的目标场景：对【**状态相关的逻辑】** 的重用 **。**

以 HOC 话题下的 `NetWorkComponent`组件为例，使用 Hooks，我们可以将它重构成这样：

```
const NewWorkComponent = () => {
  const {data, error, isLoading} = useFetch('xxx')  
  if(error) {
    // 处理错误态
  }
  if(isLoading) {
    // 处理 loading 态
  }
  return <Component data={data} />
}
```

由于不存在 `props`覆盖的问题，对于需要分别调用两次接口的场景，只需要像这样调用两次`useFetch`就可以了：

```
const NewWorkComponent = ({userId}) => {
  const {
    data: profileData, 
    error: profileError 
    isLoading: profileIsLoading
  } = useFetch('https://api.xxx/profile/${userId}')  
  const {
    data: walletData, 
    error: walletError 
    isLoading: walletIsLoading
  } = useFetch('https://api.xxx/wallet/${userId}')    

  // ...其它业务逻辑
    
  return <Component data={data} />
}
```

以 render props 话题下的“嵌套地狱”组件为例，使用 Hooks，我们可以将它的嵌套部分重构成这样：

```
const user = useUser()
const mouse = useMouse()
const scroll = useScroll()
const style = useMotion()
const size = useMeasure()

return <ConsumingComponent 
         user={user}
         mouse={mouse} 
         scroll={scroll} 
         style={style} 
         size={size} 
           />
```

从以上的重构结果，我们可以看出：Hooks 能够帮我们在【**数据的准备工作**】和【**数据的渲染工作**】之间做一个更清晰的分离。  
具体来说，在 render props 示例中，我们并不想关心组件之间如何嵌套，我们只关心我们在 render props 函数中会拿到什么样的值；在 HOC 示例中，我们也并不想关心每个 HOC 是怎么实现的、每个组件参数和 HOC 的映射关系又是什么样的，我们只关心目标组件能不能拿到它想要的 `props` 。但在【函数组件+Hooks】这种模式出现之前，尽管开发者“并不想关心”，却“不得不关心”。**因为这些模式都没有解决根本上的问题，那就是心智模型的问题。**

  


## 为什么【函数组件+Hooks】是更优解？

前面我们说“HOC 虽然能够实现代码重用，但是不治本”。为什么不治本？因为 HOC **没有解决逻辑和视图耦合的问题**。

render props 是有进步意义的，因为它以 render 函数为界，将整个组件划分为了两部分：

-   **数据的准备工作——也就是“逻辑”**
-   **数据的渲染工作——也就是“视图”**

其中，“视图”表现为一个纯函数组件，这个纯函数组件是高度独立的。尽管”视图“是高度独立的，“逻辑”却仍然耦合在组件的上下文里。这种程度的解耦是暧昧的、不彻底的。

【函数组件+Hooks】模式的出现，恰好就打破了这种暧昧的状态：

在过去，组件状态附着在组件实例（this）上，形成一种强耦合的关系——我想维护一段和状态有关的逻辑，行不行？行的，但是我必须先创造一个组件实例作为它的容器。

而现在，**状态被视作函数的入参和出参**，它可以脱离于 this 而存在，状态管理逻辑可以从组件实例上剥离、被提升为公共层的一个函数，由此便彻底地实现逻辑和视图的解耦。

写到这里，我忍不住还想再 cue 一下上一节讲的心智模型：

**“Impure/Pure”的心智模型是“因”，“充分解耦逻辑与视图”是“果”**。

**函数式思想是“因”，更高效的代码重用是“果”**。

  


## 拓展：关注点分离——容器组件与展示组件

容器组件与展示组件也是非常经典的设计模式。这个模式有很多的别名，比如：

-   胖组件/瘦组件
-   有状态组件/无状态组件
-   聪明组件/傻瓜组件
-   ...   
> 注：（斜线前面的名字是容器组件的别名，斜线后面的名字是展示组件的别名）

名字叫啥不重要，这个模式的要义在于关注点分离，具体来说，先将组件逻辑分为两类：

-   **数据的准备工作——也就是“逻辑”**
-   **数据的渲染工作——也就是“视图”**

然后再把这两类逻辑分别塞进两类组件中：

-   容器组件：负责做**数据的准备和分发工作**
-   展示组件：负责做**数据的渲染工作**

这个模式强调的是容器组件和展示组件之间的父子关系：容器组件是父组件，它在完成数据的准备工作后，会通过 props 将数据分发给作为子组件的展示组件。

由此，我们就能够实现组件的关注点分离，使组件的功能更加**内聚**，实现**逻辑与视图的分离**......诶？又是逻辑与视图分离？哈哈，没错，就是这么无聊，就是这么万变不离其宗呀~

## 总结

本节，我们探讨了 React 类组件时代的三个极具代表性的设计模式，它们分别是：

-   HOC（高阶组件）
-   render props
-   容器组件/展示组件

这些设计模式并没有完全被 Hooks 所淘汰，直到今天，它们仍然有各自的用武之地。但 Hooks 的出现确实极大程度上削弱了设计模式的存在感。这背后的关键，在于 Hooks 独特的**函数式心智模型**，能够帮助我们更加自然、更加充分地实现**逻辑和视图的解耦**。

  


##