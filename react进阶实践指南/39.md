## 一 前言

上一章介绍了 React v18 offScreen 新特性之后，了解到目前 offScreen 还是处于测试开发阶段，我们仍然不确定未来 offScreen 将以何种形式出现，但是至少在新特性还没出现之前，可以手动去实现一下类似 Vue 中的 keepalive 功能。

那么本章节，将要从零到一带领大家实现 React 中的 keepalive 功能，通过本章节的学习，希望能够学到以下知识点：

* 如何设计并实现缓存组件，对以后工作的启发是什么？
* React hooks 的合理使用。

**技术背景：**

为什么要做缓存功能呢，这个功能在实际开发中还是有具体的应用场景的。比如一些表单，富文本场景下，我们期望在切换路由的时候保存这些状态，在页面切换回来的时候，能够恢复之前编辑状态，而不是重新编辑。

可能对于上述功能用状态管理也能够解决，但是缓存组件会有更绝对的优势：

* 1 开发者无需选择性地把状态手动存起来，毕竟接入 redux 或者 mobx 等需要一定的开发和维护成本的。
* 2 状态管理工具虽然能够保存状态，但是一些 dom 的状态是无法保存起来的，比如一些 dom 元素的状态是通过元素 js 方式操纵的而非数据驱动的，这种场景下显然状态管理不是很受用。


之前笔者写了一个缓存路由的功能组件，[react-keepalive-router](https://github.com/GoodLuckAlien/react-keepalive-router) 但是这个组件库有这一些缺点：

* 这个库本身是在 router 维度的，没有颗粒化到组件维度。
* 一些 api 受到功能的限制，设计实现起来比较臃肿。


了解了技术背景之后，接下来，来看一下这个功能的设计与实现。

## 二 设计思想

### 2.1 如何使用

明白了 keepalive 功能的设计初衷和使用场景之后，我们来看一下该工具应该如何使用，我们理想中的使用方案，就类似于 vue 中的 `<keepalive>` 组件，通过该组件包裹的元素就获得了缓存的功能。

```js
<keepalive>
   <custom-component />
</keepalive>
```
所以我们期望在业务代码中这么写，来实现缓存组件功能：

```js
/* 注册一个缓存组件。 */
<KeepaliveItem cacheId="demo"  >
  <CustomComponent >
</KeepaliveItem>
```


通过 KeepaliveItem 注册一个缓存组件，在这里需要设置一个**缓存 id**，至于干什么用，马上会讲到。

但是在 vue 中的 keepalive 有一个问题就是**不能主动的清除 keepalive 状态**，比如通过一个按钮，来让某一个 keepalive 的组件取消缓存。为了让我们设计的这个工具使用更加灵活，在设计这个功能的时候，可以提供一个可以清除缓存的 api，使用的方法类似于 React Router 中的 useHistory 和 useLocation 一样。 这个 api 首选采用的是自定义 hooks 的方式。

```js
export default function (props){
  const destroy = useCacheDestroy()
  return <button onClick={() => destroy('demo)  } ></button>
}
```

如上通过 useCacheDestroy 来获取清除缓存的方法，这个时候缓存 id 就派上用场了，开发者可以用这个 id 来指向哪个组件需要清除缓存。代码块中清除的是 cacheId="demo" 的组件。

目前还有一个问题就是，我们需要把一些缓存的状态管理保存起来，比如上面通过自定义 hooks useCacheDestroy 获取的清除缓存函数 destroy，这些缓存状态是在整个 React 应用中每个节点上都能获取到的，这个时候就需要一个作用域‘Scope‘的概念，在作用域中的任何子节点，都可能去进行缓存，清除缓存，获取缓存状态。所以就类似于 react-redux 的 Provider，react-router 中的 Router 一样，需要在根组件中注册一个容器，如下所示：

```js
<Provider {...store}>
    <KeepaliveScope>
        <App />
    </KeepaliveScope>   
</Provider>
```

这个容器不仅仅提供一些全局的状态，至于还有什么用，接下来会揭晓。通过上面的使用介绍，我们设计的这个工具库至少有三个对外的 api。

* 1 一个缓存组件的容器 KeepaliveItem。
* 2 一个全局的管理作用域 KeepaliveScope。
* 3 一个可以清除缓存的自定义 hooks useCacheDestroy。

### 2.2 核心原理

说到缓存，我们到底需要缓存哪些东西呢？比如我们用一个状态控制组的挂载与卸载。

```js
{ isShow && <KeepaliveItem cacheId="demo"><Component /></KeepaliveItem> }
```
本质上在 isShow 切换的时候，Component 组件要处于‘存活’状态，Component 内部的真实 DOM 元素也要保存下来。两者缺一不可，如果只保存了 DOM ，但是没有保持组件‘存活’，那么此时的 keepalive 只是一个快照。所以实现的这个功能必须满足以下两个要素：

* 第一个问题：切换 isShow 的时候，并没有卸载真正的组件，组件还要保持‘存活’的状态。
* 第二个问题：组件没有被卸载，那么 fiber 就仍然存在的，包括上面的 DOM 元素也是存在的，但是不能够让元素显示。

    

**控制 DOM 元素显示与隐藏：**

先抛开第一个问题，我们看一下第二个问题，如何让元素不显示，通过第 37 章节我们了解到当 fiber 类型为 OffscreenComponent 的时候，就视为这个组件是可以 keepalive 的。那么 React 是如何处理元素的显示与隐藏的。

比如一个元素是 HostComponent（即 DOM 元素类型的 fiber）。

```js
if (isHidden) {
    /* 隐藏元素 */
    hideInstance(instance);
} else {
    /* 显示元素 */
    unhideInstance(node.stateNode, node.memoizedProps);
}
```

当隐藏元素的时候，调用的是 hideInstance 方法，显示元素的时候调用的是 unhideInstance 。接下来就看一下这两个函数如何实现的：

```js
function hideInstance(){
    instance = instance;
    var style = instance.style; /* 获取元素 style */
    /* 设置元素的 style 的 display 属性为 none */
    if (typeof style.setProperty === 'function') {
        style.setProperty('display', 'none', 'important');
    } else {
        style.display = 'none';
    }
}
```

* 可以看到当元素隐藏的时候，本质上设置元素的 style 的 display 属性为 none 。

```js
function unhideInstance(instance, props) {
  instance = instance;
  var styleProp = props[STYLE$1];
  var display = styleProp !== undefined && styleProp !== null && styleProp.hasOwnProperty('display') ? styleProp.display : null;
  instance.style.display = dangerousStyleValue('display', display);
}
```

* 当元素显示的时候，把 display 恢复到之前的属性上来。

React 这种实现方式给我们一个明确的思路，在第二个问题中，可以通过控制元素的 display 为 none 和 block，来控制元素的隐藏与显示。display:none 可以让元素消失在 css 和 html 合成的布局树中，给用户的直观感受，就是组件消失了。

**保持 React 组件状态存活：**

既然第二个问题解决了，那么回到第一个问题上，如果保持组件的存活呢？比如正常情况下结构是这样的：

```js
function Index(){
    const [ isShow, setShow ] = React.useState(true)
    return <div>
        <Head />
        <Nav />
        { isShow && <Content /> }
        <button onClick={() => setShow(true) } >显示</button>
        <button onClick={() => setShow(false)} >隐藏</button>
    </div>
}
```
    
![1.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ef88859f4534bc9a24432d560fdb632~tplv-k3u1fbpfcp-watermark.image?)

如上当点击按钮 `隐藏` 的时候，isShow 状态变成了 false ，那么 Content 组件会被正常的销毁。但是如果组件通过缓存组件缓存之后，变成了这样：

```js
{ isShow && <KeepaliveItem cacheId="demo"><Content /></KeepaliveItem> }
```
    

那么 KeepaliveItem 组件也会被卸载的，这个是在所难免的，如果 Content 是 KeepaliveItem 的子元素节点，那么 KeepaliveItem 的卸载，所有的子元素也会被卸载，这样的话保持 Content 的存活也就不可能实现了。
    
 ![2.jpeg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90ea7735eb9c44bbb0cbadc72424b926~tplv-k3u1fbpfcp-watermark.image?)

如何解决这个问题呢？答案实际很简单，就是让 Content 组件在 KeepaliveItem 之外渲染，那么在 KeepaliveItem 之外渲染，具体在哪里呢？上面提到在整个应用外层通过有一个缓存状态的作用域 KeepaliveScope ，把 context 交给 KeepaliveScope 去渲染挂载，就不会担心 KeepaliveItem 被卸载导致 context 也被卸载的情况。本质上的结构如下所示:

    

```js
<KeepaliveScope>
    <div>
        <Head />
        <Nav />
        { isShow && <KeepaliveItem cacheId="demo"><Content /></KeepaliveItem> }
        <button onClick={() => setShow(true) } >显示</button>
        <button onClick={() => setShow(false)} >隐藏</button>
    </div>
</KeepaliveScope>
```

当 KeepaliveItem 组件渲染的时候，Content 将会被 React.createElement 创建成 element 对象，能够在 KeepaliveItem 中通过 children 属性获取到。


这个时候关键的一步来了，**children 不要在 KeepaliveItem 中直接渲染，而是把 children（ Content 对应的 element 对象 ），交给 KeepaliveScope。**

  ![3.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ab54006aff04f469d8b45df9dcb99b5~tplv-k3u1fbpfcp-watermark.image?)

KeepaliveScope 得到了 Content 的 element 对象，这个时候直接渲染 element 对象就可以了，此时 Content 组件对应的 DOM 元素就会存在了。
    
![5.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed8f78ad83a84186bf65cd480769d7a9~tplv-k3u1fbpfcp-watermark.image?)
    
![6.jpeg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c26569ad824e4d36a8c39655b42ec58b~tplv-k3u1fbpfcp-watermark.image?)

**回传 DOM 元素：**

虽然有了真实的 DOM 元素了，那么接下来又来了一个问题，就是正常情况下 content 产生的 DOM 是在 KeepaliveItem 位置渲染的，但是我们却把它交给了 KeepaliveScope 去渲染，这样会让 DOM 元素脱离之前的位置，而且如果一些 css 属性是通过父级选择器添加的，那么样式也就无法加上去。
    

针对上面这个问题，这个时候我们就需要把在 KeepaliveScope 中渲染的 DOM 元素状态回传给 KeepaliveItem 就可以了。
    
    
![7.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef80d5979dd45dcae19076887e74718~tplv-k3u1fbpfcp-watermark.image?)

**卸载元素，控制元素隐藏：**

如果卸载 KeepaliveItem ，因为此时的 dom 还在 KeepaliveItem 中 ，所以首先我们需要把元素回到 KeepaliveScope 上，但是此时 dom 还是显示状态，重点来了此时我们需要隐藏元素。这个时候就需要设置 display 属性为 none 。

    
![8.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e69dd4b1a01149c4ab881110f5a22f86~tplv-k3u1fbpfcp-watermark.image?)

**再次挂载元素，重新激活组件：**

如果再次挂载组件，那么就会重复上面的流程，唯一不同的是此时 KeepaliveScope 不在需要初始化 content 组件，因为 content 组件一直存活并没有卸载，这个时候需要做的事，改变 display 状态，然后继续将 dom 传给重新挂载的 KeepaliveItem 组件就可以了。


### 2.3 架构设计

上述分别从初始化缓存组件挂载，组件卸载，组件再次激活三个方向介绍了缓存的实现思路。我们接着看这三个过程中核心的实现细节。

**缓存状态：**

用一个属性来记录每一个 item 处于什么样的状态，这样的好处有两点：

* 可以有效的管理好每一个缓存 item ，通过状态来判断 item 应该处于那种处理逻辑。
* 方便在每个状态上做一些额外的事情，比如给业务组件提供对应的生命周期。

既然说到了我们通过状态 status 来记录每一个缓存 item 此时处于一个什么状态下，首先具体介绍一下每一个状态的意义：

* created 缓存创建状态。
* active 缓存激活状态。
* actived 激活完成状态。
* unActive 缓存休眠状态。
* unActived 休眠完成状态。
* destroy 摧毁状态。
* destroyed 完成摧毁缓存。
    
比如一个缓存组件初次加载，那么就用 created 状态表示，如果当前组件处于缓存激活状态，那么就用 active 来表示，比如组件销毁，那么缓存组件应该处于休眠状态，这个时候就用 unActive 来表示。

这里总结了缓存状态和组件切换之间的关系图：
    
    
![12.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5c19e92e38c4fee9b1078c10765f9c9~tplv-k3u1fbpfcp-watermark.image?)

**初始化阶段：**

初始化的时候，首先在 KeepaliveScope 形成一个渲染列表，这个列表用于渲染我们真正需要缓存的组件，并给每一个缓存的 item 设置自己的状态，为什么要有自己的状态呢？因为我们的缓存组件有的是不需要展现的，也就是 unActive 状态，但是有的组件是处于 active 的状态，所以这里用一个属性 status 记录每一个 item 的状态。

每个 item 都需要一个‘插桩’父元素节点，为什么这么说呢？因为每一个 item 先渲染产生真实的 dom 元素，并且需要把 dom 元素回传给每一个 KeepaliveItem ，用这个插桩元素可以非常方便的，方便 dom 元素的传递，这个元素不需要渲染在整个 React 应用根节点内部，如果渲染在应用内部，可能造成一些样式上的问题，所以此时只需要通过 ReactDOM.createPortal 将元素渲染到 document.body 上就可以了。

架构流程图：
    

![1.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aeeeba0a42094dcaba554b7823c1f106~tplv-k3u1fbpfcp-watermark.image?)

**卸载组件阶段：**

如上一个 keepaliveItem 组件卸载，那么 keepaliveItem 组件本身是卸载的，但是 item 组件因为在 Scope 内部挂载， item 并不会销毁，但是因为此时组件不能再显示了，那么接下来做的事情是把 item 的状态设置为 unActive， 把 dom 回传到 body 上，但是此时需要把元素从布局树上隐藏，所以最终把 display 属性设置为 none 即可。

架构流程图：
    
    
![2.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee52aa5a12ce48d9bd4639720a0833e1~tplv-k3u1fbpfcp-watermark.image?)

**再次挂载组件，启动缓存：**

当再次挂载的时候，keepaliveItem 可以通过 cacheId 来向 Scope 查询组件是否缓存过，因为已经缓存过，所以直接使用 ScopeItem 的状态和 dom 元素就可以了。



![3.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e11f2b83984995a479ff691c575653~tplv-k3u1fbpfcp-watermark.image?)


## 三 具体实现

**最终呈现的 demo 效果：**

为了方便大家看到缓存效果，这里在 codesandbox 上做了一个 demo 演示效果：

[react-keepalive-component-demo](https://codesandbox.io/s/keepalive-component-demo-9gcdko)

**demo 代码片段：**

```js
import React from "react";
import {
  KeepaliveItem,
  KeepaliveScope,
  useCacheDestroy
} from "react-keepalive-component";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

function CompForm() {
  const [value, setValue] = React.useState("");
  return (
    <div>
      <p>this is a form component</p>
      input content：{" "}
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

function Atom({ propsNumber }) {
  const [number, setNumber] = React.useState(0);
  return (
    <div>
      propsNumber:{propsNumber} | current:{number}
      <button onClick={() => setNumber(number + 1)}>add++</button>
      <button onClick={() => setNumber(number - 1)}>del--</button>
    </div>
  );
}

function CompNumber() {
  const [number, setNumber] = React.useState(0);
  const [isShow, setShow] = React.useState(true);
  return (
    <div>
      <p>this is a number component</p>
      {isShow && <Atom propsNumber={number} />}
      {isShow && (
         // 缓存 Atom 组件 
        <KeepaliveItem cacheId="number_atom">
          <Atom propsNumber={number} />
        </KeepaliveItem>
      )}
      <button onClick={() => setShow(!isShow)}>
        atom {isShow ? "hidden" : "show"}
      </button>
      <br />
      <button onClick={() => setNumber(number + 1)}>add</button>
    </div>
  );
}

function CompText() {
  const destroy = useCacheDestroy();
  return (
    <div>
      component c
      {/* 销毁 cacheId = form 的组件 */}
      <button onClick={() => destroy("form")}>clean form cache</button>
    </div>
  );
}
/* 菜单栏组件 */
function Menus() {
  const navigate = useNavigate();
  return (
    <div>
      router:
      <button style={{ marginRight: "10px" }} onClick={() => navigate("/form")}>
        form
      </button>
      <button
        style={{ marginRight: "10px" }}
        onClick={() => navigate("/number")}
      >
        number
      </button>
      <button style={{ marginRight: "10px" }} onClick={() => navigate("/text")}>
        text
      </button>
    </div>
  );
}

export default function Index() {
  return (
    <Router>
      <Menus />
      <KeepaliveScope>
        <Routes>
          <Route
            element={
              // 缓存路由 /form
              <KeepaliveItem cacheId="form">
                <CompForm />
              </KeepaliveItem>
            }
            path="/form"
          />
          <Route element={<CompNumber />} path="/number" />
          <Route element={<CompText />} path="/text" />
        </Routes>
      </KeepaliveScope>
    </Router>
  );
}
```


* 如上介绍了缓存组件和路由页面的基本用法，接下来就到了具体实现的环节了。

### 3.1 KeepaliveScope  

KeepaliveScope 具体实现：

```js
const KeepaliveContext = React.createContext({})

function Scope({ children }) {
    /* 产生一个 keepalive 列表的管理器 */
    const keeper = useKeep()
    const { cacheDispatch, cacheList, hasAliveStatus } = keeper
    /* children 组合模式 */
    const renderChildren = children
    /* 处理防止 Scope 销毁带来的问题。 */
    useEffect(() => {
        return function () {
            try {
                for (let key in beforeScopeDestroy) {
                    beforeScopeDestroy[key]()
                }
            } catch (e) { }
        }
    }, [])
    const contextValue = useMemo(() => {
        return {
            /* 增加缓存 item | 改变 keepalive 状态 | 清除 keepalive  */
            cacheDispatch: cacheDispatch.bind(keeper),
            /* 判断 keepalive 状态 */
            hasAliveStatus: hasAliveStatus.bind(keeper),
            /* 提供给 */
            cacheDestroy: (payload) => cacheDispatch.call(keeper, { type: ACTION_DESTROY, payload })
        }
    }, [keeper])
    return <KeepaliveContext.Provider value={contextValue}>
        {renderChildren}
        { /* 用一个列表渲染  */ }
        {cacheList.map(item => <ScopeItem {...item} dispatch={cacheDispatch.bind(keeper)} key={item.cacheId} />)}
    </KeepaliveContext.Provider>
}
```

KeepaliveScope 选用的是组合模式，props 接收参数，首先会通过 useKeep 产生一个管理器，管理器管理着每一个缓存的 item 组件，至于 useKeep 内部做了什么，后续会讲到。因为 KeepaliveScope 需要传递并管理每一个 keepaliveItem 的状态，所以通过 React Context 方式传递状态，这里有一个问题，就是为了避免 KeepaliveScope 触发重新渲染而让 context 变化，造成订阅 context 的组件更新，这里用 useMemo 派生出 context 的 value 值。

接下来通过 cacheList 来渲染每一个缓存 ScopeItem ，业务中的组件本质上在 item 中渲染并产生真实的 dom 结构。

上面说到了 useKeep 是每一个 item 的管理器，我们来看一下 useKeep 是什么？


### 3.2 状态管理器 useKeep

```js

export const ACITON_CREATED    = 'created'       /* 缓存创建 */
export const ACTION_ACTIVE     = 'active'        /* 缓存激活 */
export const ACTION_ACTIVED    = 'actived'       /* 激活完成 */
export const ACITON_UNACTIVE   = 'unActive'      /* 缓存休眠 */
export const ACTION_UNACTIVED  = 'unActived'     /* 休眠完成 */
export const ACTION_DESTROY    = 'destroy'       /* 设置摧毁状态 */
export const ACTION_DESTROYED  = 'destroyed'     /* 摧毁缓存 */
export const ACTION_CLEAR      = 'clear'         /* 清除缓存 */
export const ACTION_UPDATE     = 'update'        /* 更新组件 */


class Keepalive {
    constructor(setState, maxLimit) {
        this.setState = setState
        this.maxLimit = maxLimit
        this.cacheList = []
        this.kid = -1
    }
    /* 暴露给外部使用的切换状态的接口 */
    cacheDispatch ({
        type,
        payload
    }) {
        this[type] && this[type](payload)
        type !== ACITON_CREATED && this.setState({})
    }
    /* 获取每一个 item 的状态 */
    hasAliveStatus (cacheId) {
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index >=0 ) return this.cacheList[index].status
        return null
    }
    /* 删掉缓存 item 组件 */
    destroyItem(payload){
        const index = this.cacheList.findIndex(item => item.cacheId === payload)
        if(index === -1 ) return
        if(this.cacheList[index].status === ACTION_UNACTIVED ){
             this.cacheList.splice(index,1)
        }
    }
    /* 更新 item 状态 */
    [ACTION_UPDATE](payload){
        const { cacheId, children } = payload
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index === -1 ) return
        this.cacheList[index].updater = {}
        this.cacheList[index].children = children
    }
    /* 初始化状态，创建一个item */
    [ACITON_CREATED](payload) {
        const {
            children,
            load,
            cacheId
        } = payload
        const cacheItem = {
            cacheId: cacheId || this.getKid(),
            load,
            status: ACITON_CREATED,
            children,
            updater:{}
        }
        this.cacheList.push(cacheItem)
    }
    /* 正在销毁状态 */
    [ACTION_DESTROY](payload) {
        if (Array.isArray(payload)) {
             payload.forEach(this.destroyItem.bind(this))
        } else {
             this.destroyItem(payload)
        }
    }
    /* 正在激活状态 */
    [ACTION_ACTIVE](payload){
        const { cacheId, load } = payload
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index === -1 ) return
        this.cacheList[index].status = ACTION_ACTIVE
        this.cacheList[index].load = load
    }
}
/* 激活完成状态，正在休眠状态，休眠完成状态 */
[ACITON_UNACTIVE, ACTION_ACTIVED, ACTION_UNACTIVED].forEach(status => {
    Keepalive.prototype[status] = function (payload) {
        for (let i = 0; i < this.cacheList.length; i++) {
            if (this.cacheList[i].cacheId === payload) {
                this.cacheList[i].status = status
                break
            }
        }
    }
})

export default function useKeep(CACHE_MAX_DEFAULT_LIMIT) {
    const keeper = React.useRef()
    const [, setKeepItems] = React.useState([])
    if (!keeper.current) {
        keeper.current = new Keepalive(setKeepItems, CACHE_MAX_DEFAULT_LIMIT)
    }
    return keeper.current
}
```
                                                  
useKeep 本身是一个自定义 hooks ，首先会通过 new Keepalive 创建一个状态管理器，并用 useRef 来保存状态管理器。通过 useState 创建一个 update 函数——setKeepItems，用于更新每一个 item 状态（增，删，改）。

new Keepalive 状态管理器中会通过 cacheDispatch 方法来改变 item 的状态，比如有激活状态到休眠状态。通过下发对应的 action 指令来让缓存组件切换状态。


### 3.3 ScopeItem 

KeepaliveScope 中管理着每一个 ScopeItem ，ScopeItem 负责挂载真正的组件，形成真实 dom ，回传 dom。

```js
const keepChange = (pre, next) => pre.status === next.status && pre.updater === next.updater
const beforeScopeDestroy = {}

const ScopeItem = memo(function ({ cacheId, updater, children, status, dispatch, load = () => { } }) {
    const currentDOM = useRef()
    const renderChildren = status === ACTION_ACTIVE || status === ACTION_ACTIVED || status === ACITON_UNACTIVE || status === ACTION_UNACTIVED ? children : () => null
    /* 通过 ReactDOM.createPortal 渲染组件，产生 dom 树结构 */
    const element = ReactDOM.createPortal(
        <div ref={currentDOM} style={{ display: status === ACTION_UNACTIVED ? 'none' : 'block' }} >
            {/* 当 updater 对象变化的时候，重新执行函数，更新组件。 */}
            {   useMemo(() => renderChildren(), [updater])  }
        </div>,
        document.body
    )
    /* 防止 Scope 销毁，找不到对应的 dom 而引发的报错 */
    useEffect(() => {
        beforeScopeDestroy[cacheId] = function () {
            if (currentDOM.current) document.body.appendChild(currentDOM.current)
        }
        return function () {
            delete beforeScopeDestroy[cacheId]
        }
    }, [])
    useEffect(() => {
        if (status === ACTION_ACTIVE) {
            /* 如果已经激活了，那么回传 dom  */
            load && load(currentDOM.current)
        } else if (status === ACITON_UNACTIVE) {
            /* 如果处于休眠状态，那么把 dom 元素重新挂载到 body 上 */
            document.body.appendChild(currentDOM.current)
            /* 然后下发指令，把状态变成休眠完成 */
            dispatch({
                type: ACTION_UNACTIVED,
                payload: cacheId
            })
        }
    }, [status])
    return element
}, keepChange)

```

ScopeItem 做的事情很简单。

* 首先通过 ReactDOM.createPortal 来渲染我们真正想要缓存的组件，这里有一个问题点，就是通过一个 updater 来更新业务组件，为什么这么样呢？

原因是这样的，因为正常情况下，我们的业务组件的父组件更新，那么会让业务组件更新。但是现在的业务组件，并不是在之前的位置渲染，而是在 ScopeItem 中渲染的，这样如果不处理的话，业务组件父级渲染的话，业务组件就不会渲染了，所以这里通过一个 updater 来模拟父组件的更新流效果。

* 接下来如果 ScopeItem 状态已经激活了，那么说明已经形成了新的 dom ，这个时候把 dom 交给  KeepaliveItem 就可以了，但是如果业务组件即将被卸载，那么将变成休眠状态，这个时候再把 dom 传递给 body 上就可以了。

接下来就是 keepaliveItem 了，来看一下 keepaliveItem 做了些什么？

### 3.4 keepaliveItem

KeepaliveItem 负责着组件缓存状态变更，还有就是与 Scope 的通信。

```js
const renderWithChildren = (children) => (mergeProps) => {
    return children ?
        isFuntion(children) ?
        children(mergeProps) :
        isValidElement(children) ?
        cloneElement(children, mergeProps) :
        null :
        null
}

function KeepaliveItem({
    children,
    cacheId,
    style
}) {
    /*  */
    const {
        cacheDispatch,
        hasAliveStatus
    } = useContext(keepaliveContext)
    const first = useRef(false)
    const parentNode = useRef(null)
    /* 提供给 ScopeItem 的方法  */
    const load = (currentNode) => {
        parentNode.current.appendChild(currentNode)
    }
    /* 如果是第一次，那么证明没有缓存，直接调用 created 指令，创建一个   */
    !first.current && !hasAliveStatus(cacheId) && cacheDispatch({
        type: ACITON_CREATED,
        payload: {
            load,
            cacheId,
            children: renderWithChildren(children)
        }
    })
    useLayoutEffect(() => {
        /* 触发更新逻辑，如果父组件重新渲染了，那么下发 update 指令，更新 updater  */
        hasAliveStatus(cacheId) !== ACTION_UNACTIVED && first.current && cacheDispatch({
            type: ACTION_UPDATE,
            payload: {
                cacheId,
                children: renderWithChildren(children)
            }
        })
    }, [children])
    useEffect(() => {
        first.current = true
        /* 触发指令 active */
        cacheDispatch({
            type: ACTION_ACTIVE,
            payload: {
                cacheId,
                load
            }
        })
        return function () {
            /* KeepaliveItem 被销毁，触发 unActive 指令，让组件处于休眠状态  */
            cacheDispatch({
                type: ACITON_UNACTIVE,
                payload: cacheId
            })
        }
    }, [])
    /* 通过 parentNode 接收回传过来的 dom 状态。 */
    return <div ref={parentNode} style={style}/>
}
```

KeepaliveItem 的核心逻辑是：

* 当 KeepaliveItem 第一次加载，所以应该没有缓存，直接调用 created 指令，创建一个 ScopeItem 。
* 如果 KeepaliveItem 父组件更新，那么触发 update 来更新 updater 对象，让缓存的组件重新渲染。
* 当组件挂载的时候，会下发 active 指令，激活组件，接下来 ScopeItem 会把 dom 元素回传给 KeepaliveItem。当卸载的时候会下发 unActive 指令，dom 元素会重新插入到 document body 中，借此整个流程都走通了。


### 3.5 完善其他功能

**清除缓存api——useCacheDestroy**

```js
export function useCacheDestroy() {
    return useContext(keepaliveContext).cacheDestroy
}
```
如果业务组件需要清除缓存，那么直接通过 useCacheDestroy 来获取 keepaliveContext 上面的 cacheDestroy 方法就可以了。

## 四 未来展望与总结

### 4.1 未来展望

目前这个功能已经更新到了 0.0.1-beta 版本，想要尝试的同学可以下载使用，如果遇到问题也可以提宝贵的 issue。

```js
npm install react-keepalive-component
```
感觉有帮助的同学欢迎在 Github 上赏个 star，也希望能有大佬一起维护。

[react-keepalive-component](https://github.com/GoodLuckAlien/react-keepalive-component)

后续这个库会维护一下缓存的生命周期， api 会采用自定 hooks 的形式。

### 4.2 总结

通过本章节学习，希望让大家明白的知识点如下：

* React 中的一种 keepalive 的实现方式以及原理。
* 从零到一实现了 React 缓存组件。
* React hooks 的合理使用。

