## 一 前言

本章节，我们会从 0 到 1 实现一个 React 路由功能，这里可以称之为 `mini-Router`。实现的过程中会包含如下知识点：

* 路由更新流程与原理；
* 自定义 hooks 编写与使用；
* context 实践；
* hoc 编写与使用。

## 二 设计思路

整个 mini-Router 还是采用 `history` 库，也就是 mini-Router  需要完成的是 `React-Router` 和 `React-Router-DOM` 核心部分。今天编写的 mini-Router 是在 BrowserHistory 模式下。

### 1 建立目标

接下来要实现的具体功能如下：

* **组件层面：** 在组件层面，需要实现提供路由状态的 Router ，控制渲染的 Route ，匹配唯一路由的 Switch 。

* **api层面：** 提供获取 history 对象的 useHistory 方法，获取 location 对象的 useLocation 方法。

* **高阶组件层面：** 对于不是路由的页面，提供 withRouter，能够获取当前路由状态。

* **额外功能：** 之前有很多同学问过我，在 React 应用中，可不可以提供有方法监听路由改变，所以 mini-Router 需要做的是增加路由监听器，当路由改变，触发路由监听器。

### 2 设计功能图


![2.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a9ca32fec8e40819afeecc05d40cdb5~tplv-k3u1fbpfcp-watermark.image)

## 三 代码实现

### 1 组件层面

**提供路由更新派发——Router** 

```js
import React ,{ useCallback, useState , useEffect ,createContext, useMemo  } from 'react'
import { createBrowserHistory as createHistory  } from 'history'

export const RouterContext = createContext()
export let rootHistory = null

export default function Router(props){
     /* 缓存history属性 */
     const history = useMemo(() => {
          rootHistory = createHistory()
          return rootHistory
     },[])
     const [ location, setLocation ] = useState(history.location)
     useEffect(()=>{
          /* 监听location变化，通知更新 */
          const unlisten = history.listen((location)=>{
               setLocation(location)
          })
          return function () {
               unlisten && unlisten()
          }
     },[])
     return <RouterContext.Provider
         value={{
               location,
               history,
               match: { path: '/', url: '/', params: {}, isExact: location.pathname === '/' }
          }}
            >
          {props.children}
     </RouterContext.Provider>
}
```

Router 设计思路：
* 创建一个 React Context ，用于保存路由状态。用 Provider 传递 context 。
* 用一个 useMemo 来缓存 BrowserHistory 模式下的产生的路由对象 history ，这里有一个小细节，就是产生 history 的同时，把它赋值给了一个全局变量 rootHistory ，为什么这么做呢，答案一会将揭晓。
* 通过 useEffect 进行真正的路由监听，当路由改变，通过 useState ，改变 location 对象，会改变 Provider 里面 value 的内容，通知消费 context 的 Route ，Switch 等组件更新。 useEffect 的 destory 用于解绑路由监听器。

**控制更新——Route**

```js
import React , { useContext } from 'react'
import { matchPath } from 'react-router'
import { RouterContext } from './Router'

function  Route(props) {
    const context = useContext(RouterContext)
    /* 获取location对象 */
    const location = props.location || context.location
    /* 是否匹配当前路由，如果父级有switch，就会传入computedMatch来精确匹配渲染此路由 */
    const match = props.computedMatch ? props.computedMatch
                 : props.path ?  matchPath(location.pathname,props) : context.match
     /* 这个props用于传递给路由组件 */
    const newRouterProps = { ...context, location, match  }
    let { children, component, render  } = props
    if(Array.isArray(children) && children.length ===0 ) children = null
    let renderChildren = null
    if(newRouterProps.match){
        if(children){
            /* 当Router 是 props children 或者 render props 形式。*/
            renderChildren =  typeof children === 'function' ? children(newRouterProps) : children
        }else if(component){
            /*  Route有component属性 */
            renderChildren = React.createElement(component, newRouterProps)
        }else if(render){
            /*  Route有render属性 */
            renderChildren = render(newRouterProps)
        }
    }
    /* 逐层传递上下文 */
    return <RouterContext.Provider  value={newRouterProps}  >
        {renderChildren}
    </RouterContext.Provider>
}
export default Route
```

* 用 useContext 提取出路由上下文，当路由状态 location 改变，因为消费context 的组件都会重新渲染，当前Route会组件重新渲染，通过当前的 location 的 pathname 进行匹配，判断当前组件是否渲染，因为 Route 子组件有四种形式，所以会优先进行判断。
* 为了让 Route 的子组件访问到当前 Route 的信息，所以要选择通过 Provider 逐层传递的特点，再一次传递当前 Route 的信息，这样也能够让嵌套路由更简单的实现。
* 因为如果父级元素是 Switch ，就不需要匹配路由了，因为这些都是 Switch 该干的活，所以用 computedMatch 来识别是否上一层的 Switch 已经匹配完成了。

**匹配正确路由—— Switch**

```js

import React, { useContext } from 'react'
import { matchPath } from 'react-router'

import { RouterContext } from '../component/Router'

export default function Switch(props){
    const context = useContext(RouterContext)
    const location = props.location || context.location
    let children , match
    /* 遍历children Route 找到匹配的那一个 */
    React.Children.forEach(props.children,child=>{
        if(!match && React.isValidElement(child) ){ /* 路由匹配并为React.element元素的时候 */
           const path = child.props.path //获取Route上的path
           children = child /* 匹配的children */
           match = path ? matchPath(location.pathname,{ ...child.props }) : context.match /* 计算是否匹配 */
        }
    })
    /* 克隆一份Children，混入 computedMatch 并渲染。 */
    return  match ? React.cloneElement(children, { location, computedMatch: match }) : null
}
```
* Switch 也要订阅来自 context 的变化，然后对 children 元素，进行唯一性的路由匹配。
* 通过`React.Children.forEach`遍历子 Route，然后通过 matchPath 进行匹配，如果匹配到组件，将克隆组件，混入 computedMatch，location 等信息。

### 2 hooksAPI层面

为了让 mini-Router 每一个组件都能自由获取路由状态，这里编写了两个自定义 hooks。

**获取history对象**

```js
import { useContext } from 'react'
import { RouterContext  } from '../component/Router'
/* 用useContext获取上下文中的history对象 */
export default function useHistory() {
    return useContext(RouterContext).history
}
```

* 用 useContext 获取上下文中的 history 对象。

**获取 location 对象**

```js
import { useContext } from 'react'
import { RouterContext  } from '../component/Router'
/* 用useContext获取上下文中的location对象 */
export default function  useLocation() {
    return useContext(RouterContext).location
}
```
* 用 useContext 获取上下文中的 location 对象。

上述的两个 hooks 编写起来非常简单，但是也要注意一个问题，两个 hooks 本质上都是消费了 context ，所以用到上述两个 hook 的组件，当context 变化，都会重新渲染。接下来增加一个新的功能，监听路由改变。

**监听路由改变**，和上面两种情况不同，不想订阅 context 变化，而带来的更新作用，另外一点就是这种监听有可能在 Router 包裹的组件层级之外，那么如何达到目的呢？这个时候在 Router 中的 rootHistory 就派上了用场，这个 rootHistory 目的就是为了全局能够便捷的获取 history 对象。接下来具体实现一个监听路由变化的自定义 hooks 。

```js
import { useEffect } from 'react'
import { rootHistory } from '../component/Router'

/* 监听路由改变 */
function useListen(cb) {
    useEffect(()=>{
        if(!rootHistory) return ()=> {}
        /* 绑定路由事件监听器 */
        const unlisten = rootHistory.listen((location)=>{
             cb && cb(location)
        })
        return function () {
            unlisten && unlisten()
        }
    },[])
}
export default useListen
```

* 如果 rootHistory 不存在，那么这个 hooks 也就没有任何作用，直接返回空函数就可以了。
* 如果 rootHistory 存在，通过 useEffect ，绑定监听器，然后在销毁函数中，解绑监听器。

### 3 高阶组件层面

希望通过一个 HOC 能够自由获取路由的状态。所以要实现一个 react-router 中 withRouter 功能。

**获取路由状态——withRouter**

```js
import React , { useContext } from 'react'
import hoistStatics from 'hoist-non-react-statics'

import { RouterContext  } from '../component/Router'

export default function withRouter(Component){
    const WrapComponent = (props) =>{
        const { wrappedComponentRef, ...remainingProps } = props
        const context = useContext(RouterContext)
        return  <Component {...remainingProps}
            ref={wrappedComponentRef}
            {...context}
                />
    }
    return hoistStatics(WrapComponent,Component)
```
* 在高阶组件的包装组件中，用useContext获取路由状态，并传递给原始组件。
* 通过`hoist-non-react-statics`继承原始组件的静态属性。

### 4 入口文件

完成了核心 api 和组件，接下来需要出口文件，把这些方法暴露出去。

```js
//component
import Router ,{ RouterContext } from './component/Router'
import Route from './component/Route'
import Switch from './component/Switch'
//hooks
import useHistory from './hooks/useHistory'
import useListen from './hooks/useListen'
import useLocation from './hooks/useLocation'
//hoc
import withRouter from './hoc/withRouter'

export {
    Router,
    Switch,
    Route,
    RouterContext,
    useHistory,
    useListen,
    useLocation,
    withRouter
}
```

## 四 验证效果

一个简单的路由库就实现了，接下来验证一下`mini-Router`的效果：

### 配置路由

```js
import React from 'react'
import { Router, Route, useHistory, useListen, Switch } from './router'

/* 引用业务组件 */
import Detail from './testPage/detail'  /* 详情页 */
import Home  from './testPage/home'     /* 首页 */
import List from './testPage/list'      /* 列表页 */
import './index.scss'

const menusList = [
    {
        name:'首页',
        path:'/home'
    },
    {
        name:'列表',
        path:'/list'
    },
    {
        name:'详情',
        path:'/detail'
    }
]
/**/
function Nav() {
    const history  = useHistory()
    /* 路由跳转 */
    const RouterGo = (url) =>  history.push(url)
    const path = history.location.pathname
    return <div>
        {
            menusList.map((item=><span className={`nav ${ item.path===path ? 'active'  : '' }`} key={item.path}
                onClick={()=>RouterGo(item.path)} >{item.name}</span>))
        }
    </div>
}

function  Top() {
    /* 路由监听 */
    useListen((location)=>{
        console.log( '当前路由是：', location.pathname)
    })
    console.log(111)
    return <div>--------top------</div>
}
function Index() {
    console.log('根组件渲染')
    return <Router>
        <Top/>
        <Nav />
        <Switch>
            <Route component={Home} path="/home"></Route>
            <Route  component={Detail} path="/detail" />
            <Route path="/list" render={(props)=> <List {...props} />} />
        </Switch>
        <div>--------bottom------</div>
    </Router>
}

export default Index
```
* 通过 Router，Route，Switch 给首页，列表，详情三个页面配置路由。
* Top 里面进行路由监听，路由变化，组件不渲染。
* Nav 里改变路由，切换页面。

### 业务页面

**首页**

```js
export default function Home(){
    return <div>
        hello,world。
        let us learn React!
        <HomeOne />
    </div>
}
```

**高阶组件包裹的 HomeOne**

```js
@withRouter
class HomeOne extends React.Component{
    RouteGo=()=>{
        const { history } = this.props
        history.push('/detail')
    }
    render(){
        return <div>
            <p>测试HOC——withRouter</p>
            <button onClick={this.RouteGo} >跳转到详情页</button>
        </div>
    }
}
```

**列表页面**

```js
export default function List(){
    return <div>
        <li>React.js</li>
        <li>Vue.js</li>
        <li>nodejs</li>
    </div>
}
```

**详情页面**

```js
export default function  Index() {
    return <div>
        <p>小册名称：《React进阶实践指南》</p>
        <p>作者：我不是外星人</p>
    </div>
}
```

### 效果


![1.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94ae8c66f5164ecda6c0b363202adcc3~tplv-k3u1fbpfcp-watermark.image)

## 五 总结

本章节通过实现一个 mini-router，来贯穿前面的章节中的内容。接下来对这节的收获做一个总结：

* 强化 React-Router 的核心原理，Router，Route 等组件。
* 渲染控制，操作 children 。
* 高阶组件混入路由状态。
* hooks 的使用指南，所有组件都是用 hooks 编写的。
* 自定义 hooks 的编写。