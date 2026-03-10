## 一前言

本节是 React 进阶系列基础篇的最后一节，主要给大家讲解 React 高阶组件- HOC。最近调研了很多同学对高阶组件的使用与理解，大部分同学给我的回复是，知道高阶组件，也会用一些优秀的开源库中的高阶组件，但是自己遇到业务场景的时候，**想不到用高阶组件解决问题**或者**不知道怎么编写高阶组件**？

从小伙伴们的回答中，我找到了本章节重点的讨论方向，就是 **HOC 解决什么问题，什么时候用到 HOC，以及如何编写 HOC ?**

## 二高阶组件基本介绍-能解决什么问题？

### 1 高阶组件能解决什么问题

高级组件到底能够解决什么问题？举一个特别简单的例子，话说小明负责开发一个 web 应用，应用的结构如下所示，而且这个功能小明已经开发完了。

![hoc2.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4effb7bd6764e80ab0e7c25e177d56e~tplv-k3u1fbpfcp-watermark.image)

但是，有一天老板突然提出了一个权限隔离的需求，就是部分模块组件受到权限控制，后台的数据交互的结果权限控制着模块展示与否，而且没有权限会默认展示无权限提示页面。（如下图，黄色部分是受到权限控制的组件模块）


![hoc3.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79bc49c43520456182a88610b8eb3f1e~tplv-k3u1fbpfcp-watermark.image)


那么小明面临的问题是，如何给需要权限隔离的模块，绑定权限呢？那第一种思路是把所有的需要权限隔离的模块重新绑定权限，通过权限来判断组件是否展示。


![hoc4.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f02c232062048cb88f1c39e8afc7862~tplv-k3u1fbpfcp-watermark.image)

这样无疑会给小明带来很多的工作量，而且后续项目可能还有受权限控制的页面或者组件，都需要手动绑定权限。那么如何解决这个问题呢，思考一下，既然是判断权限，那么可以把逻辑都写在一个容器里，然后将每个需要权限的组件通过容器包装一层，这样不就不需要逐一手动绑定权限了吗？所以 HOC 可以合理的解决这个问题，通过 HOC 模式结构如下图所示：


![hoc5.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa0f9b5e798947c9aa563c7213ef7b87~tplv-k3u1fbpfcp-watermark.image)

综上所述，HOC的产生根本作用就是解决大量的代码复用，逻辑复用问题。既然说到了逻辑复用，那么具体复用了哪些逻辑呢？ 

* 首先第一种就是像上述的拦截问题，本质上是对渲染的控制，对渲染的控制可不仅仅指是否渲染组件，还可以像 dva 中 dynamic 那样懒加载/动态加载组件。

* 还有一种场景，比如项目中想让一个非 Route 组件，也能通过 props 获取路由实现跳转，但是不想通过父级路由组件层层绑定 props ，这个时候就需要一个 HOC 把改变路由的 history 对象混入 props 中，于是 withRoute 诞生了。所以 HOC 还有一个重要的作用就是让 props 中混入一些你需要的东西。

* 还有一种情况，如果不想改变组件，只是监控组件的内部状态，对组件做一些赋能，HOC 也是一个不错的选择，比如对组件内的点击事件做一些监控，或者加一次额外的生命周期，我之前写过一个开源项目 `react-keepalive-router`，可以缓存页面，项目中的 keepaliveLifeCycle 就是通过 HOC 方式，给业务组件增加了额外的生命周期。

### 高阶组件基础概念

高阶组件真的很好理解，都知道高阶函数就是一个将函数作为参数并且返回值也是函数的函数。高阶组件是以组件作为参数，返回组件的函数。返回的组件把传进去的组件进行功能强化。


![hoc6.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97a76447f740458f91982e4038e46d2e~tplv-k3u1fbpfcp-watermark.image)

### 两种不同的高阶组件

常用的高阶组件有**属性代理**和**反向继承**两种，两者之间有一些共性和区别。接下来分别介绍一下两种模式下的高阶组件。

**属性代理**

属性代理，就是用组件包裹一层代理组件，在代理组件上，可以做一些，对源组件的强化操作。这里注意属性代理返回的是一个新组件，被包裹的原始组件，将在新的组件里被挂载。


```js
function HOC(WrapComponent){
    return class Advance extends React.Component{
       state={
           name:'alien'
       }
       render(){
           return <WrapComponent  { ...this.props } { ...this.state }  />
       }
    }
}
```
优点：
* ① 属性代理可以和业务组件低耦合，零耦合，对于条件渲染和 props 属性增强，只负责控制子组件渲染和传递额外的 props 就可以了，所以无须知道，业务组件做了些什么。所以正向属性代理，更适合做一些开源项目的 HOC ，目前开源的 HOC 基本都是通过这个模式实现的。
* ② 同样适用于类组件和函数组件。
* ③ 可以完全隔离业务组件的渲染，因为属性代理说白了是一个新的组件，相比反向继承，可以完全控制业务组件是否渲染。
* ④ 可以嵌套使用，多个 HOC 是可以嵌套使用的，而且一般不会限制包装 HOC 的先后顺序。

缺点：
* ① 一般无法直接获取原始组件的状态，如果想要获取，需要 ref 获取组件实例。
* ② 无法直接继承静态属性。如果需要继承需要手动处理，或者引入第三方库。
* ③ 因为本质上是产生了一个新组件，所以需要配合 forwardRef 来转发 ref。

**反向继承**

反向继承和属性代理有一定的区别，在于包装后的组件继承了原始组件本身，所以此时无须再去挂载业务组件。

```js
class Index extends React.Component{
  render(){
    return <div> hello,world  </div>
  }
}
function HOC(Component){
    return class wrapComponent extends Component{ /* 直接继承需要包装的组件 */
        
    }
}
export default HOC(Index) 
```
优点：
* ① 方便获取组件内部状态，比如 state ，props ，生命周期，绑定的事件函数等。
* ② es6继承可以良好继承静态属性。所以无须对静态属性和方法进行额外的处理。

缺点：
* ① 函数组件无法使用。
* ② 和被包装的组件耦合度高，需要知道被包装的原始组件的内部状态，具体做了些什么？
* ③ 如果多个反向继承 HOC 嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的，比如说有多个 componentDidMount ，当前 componentDidMount 会覆盖上一个 componentDidMount 。这样副作用串联起来，影响很大。

## 三 高阶组件功能说明-如何编写高阶组件？

### 1 强化props 

强化 props 就是在原始组件的 props 基础上，加入一些其他的 props ，强化原始组件功能。举个例子，为了让组件也可以获取到路由对象，进行路由跳转等操作，所以 React Router 提供了类似 withRouter 的 HOC 。

```js
function withRouter(Component) {
  const displayName = `withRouter(${Component.displayName || Component.name})`;
  const C = props => {
      /*  获取 */
    const { wrappedComponentRef, ...remainingProps } = props;
    return (
      <RouterContext.Consumer>
        {context => {
          return (
            <Component
              {...remainingProps} // 组件原始的props 
              {...context}        // 存在路由对象的上下文，history  location 等 
              ref={wrappedComponentRef}
            />
          );
        }}
      </RouterContext.Consumer>
    );
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;
  /* 继承静态属性 */
  return hoistStatics(C, Component);
}
export default withRouter
```
流程分析：

* 分离出 props 中 wrappedComponentRef 和 remainingProps ， remainingProps 是原始组件真正的 props， wrappedComponentRef 用于转发 ref。
* 用 Context.Consumer 上下文模式获取保存的路由信息。（ React Router 中路由状态是通过 context 上下文保存传递的）
* 将路由对象和原始 props 传递给原始组件，所以可以在原始组件中获取 history ，location 等信息。


### 2 控制渲染

#### 渲染劫持

HOC 反向继承模式，可以通过 super.render() 得到 render 之后的内容，利用这一点，可以做渲染劫持 ，更有甚者可以修改 render 之后的 React element 对象。

```js
const HOC = (WrapComponent) =>
  class Index  extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render()
      } else {
        return <div>暂无数据</div>
      }
    }
  }

```
**修改渲染树**

```js
class Index extends React.Component{
  render(){
    return <div>
       <ul>
         <li>react</li>
         <li>vue</li>
         <li>Angular</li>
       </ul>
    </div>
  }
}
function HOC (Component){
  return class Advance extends Component {
    render() {
      const element = super.render()
      const otherProps = {
        name:'alien'
      }
      /* 替换 Angular 元素节点 */
      const appendElement = React.createElement('li' ,{} , `hello ,world , my name  is ${ otherProps.name }` )
      const newchild =  React.Children.map(element.props.children.props.children,(child,index)=>{
           if(index === 2) return appendElement
           return  child
      }) 
      return  React.cloneElement(element, element.props, newchild)
    }
  }
}
export  default HOC(Index)
```

**效果**

![40D6BF30-9B4C-4EC9-B089-1E757DAC15DF.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8768ee8201e949d8a7c2f7c0ec72b1e4~tplv-k3u1fbpfcp-watermark.image)

#### 动态加载

dva 中 dynamic 就是配合 import ，实现组件的动态加载的，而且每次切换路由，都会有 Loading 效果，接下来看看大致的实现思路。

**编写**
```js
export default function dynamicHoc(loadRouter) {
  return class Content extends React.Component {
    state = {Component: null}
    componentDidMount() {
      if (this.state.Component) return
      loadRouter()
        .then(module => module.default) // 动态加载 component 组件
        .then(Component => this.setState({Component},
         ))
    }
    render() {
      const {Component} = this.state
      return Component ? <Component {
      ...this.props
      }
      /> : <Loading />
    }
  }
}
```
**使用**
```js
const Index = AsyncRouter(()=>import('../pages/index'))
```
实现思路：

* Index 组件中，在 componentDidMount 生命周期动态加载上述的路由组件Component，如果在切换路由或者没有加载完毕时，显示的是 Loading 效果。

### 3 组件赋能

#### ref获取实例

对于属性代理虽然不能直接获取组件内的状态，但是可以通过 ref 获取组件实例，获取到组件实例，就可以获取组件的一些状态，或是手动触发一些事件，进一步强化组件，但是注意的是：类组件才存在实例，函数组件不存在实例。

```js
function Hoc(Component){
  return class WrapComponent extends React.Component{
      constructor(){
        super()
        this.node = null /* 获取实例，可以做一些其他的操作。 */
      }
      render(){
        return <Component {...this.props}  ref={(node) => this.node = node }  />
      }
  }
}
```

#### 事件监控

HOC 不一定非要对组件本身做些什么？也可以单纯增加一些事件监听，错误监控。接下来，接下来做一个 `HOC` ，只对组件内的点击事件做一个监听效果。

```js
function ClickHoc (Component){
  return  function Wrap(props){
    const dom = useRef(null)
    useEffect(()=>{
       const handerClick = () => console.log('发生点击事件') 
       dom.current.addEventListener('click',handerClick)
     return () => dom.current.removeEventListener('click',handerClick)
    },[])
    return  <div ref={dom}  ><Component  {...props} /></div>
  }
}

@ClickHoc
class Index extends React.Component{
   render(){
     return <div className='index'  >
       <p>hello，world</p>
       <button>组件内部点击</button>
    </div>
   }
}
export default ()=>{
  return <div className='box'  >
     <Index />
     <button>组件外部点击</button>
  </div>
}
```
**效果**

![click.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e80fb646d654536af836b7d038fd62b~tplv-k3u1fbpfcp-watermark.image)



### 4 总结

下面对 HOC 具体能实现那些功能，和如何编写做一下总结：

* 1 强化 props ，可以通过 HOC ，向原始组件混入一些状态。
* 2 渲染劫持，可以利用 HOC ，动态挂载原始组件，还可以先获取原始组件的渲染树，进行可控性修改。
* 3 可以配合 import 等 api ，实现动态加载组件，实现代码分割，加入 loading 效果。
* 4 可以通过 ref 来获取原始组件实例，操作实例下的属性和方法。
* 5 可以对原始组件做一些事件监听，错误监控等。

## 四 高价组件注意事项

### 1 谨慎修改原型链

```js
function HOC (Component){
  const proDidMount = Component.prototype.componentDidMount 
  Component.prototype.componentDidMount = function(){
     console.log('劫持生命周期：componentDidMount')
     proDidMount.call(this)
  }
  return  Component
}
```
如上 HOC 作用仅仅是修改了原来组件原型链上的 componentDidMount 生命周期。但是这样有一个弊端就是如果再用另外一个 HOC 修改原型链上的 componentDidMount ，那么这个HOC的功能即将失效。

### 2 不要在函数组件内部或类组件render函数中使用HOC

类组件中🙅错误写法：
```js
class Index extends React.Component{
  render(){
     const WrapHome = HOC(Home)
     return <WrapHome />
  }
}
```
函数组件中🙅错误写法：

```js
function Index(){
     const WrapHome = HOC(Home)
     return  <WrapHome />
}
```
这么写的话每一次类组件触发 render 或者函数组件执行都会产生一个新的WrapHome，`react diff` 会判定两次不是同一个组件，那么就会卸载老组件，重新挂载新组件，老组件内部的真实 DOM 节点，都不会合理的复用，从而造成了性能的浪费，而且原始组件会被初始化多次。


### 3 ref的处理

高阶组件的约定是将所有 props 传递给被包装组件，但这对于 ref 并不适用。那是因为 ref 实际上并不是一个 prop ， 就像 key 一样，对于 ref 属性它是由 React 专门处理的。那么如何通过 ref 正常获取到原始组件的实例呢？在 ref 章节已经讲到，可以用 `forwardRef`做 ref 的转发处理。

### 4 注意多个HOC嵌套顺序问题

多个HOC嵌套，应该留意一下HOC的顺序，还要分析出要各个 HOC 之间是否有依赖关系。

对于 class 声明的类组件，可以用装饰器模式，对类组件进行包装：

```js
@HOC1(styles)
@HOC2
@HOC3
class Index extends React.Componen{
    /* ... */
}
```
对于函数组件：

```js
function Index(){
    /* .... */
}
export default HOC1(styles)(HOC2( HOC3(Index) )) 
```
HOC1 -> HOC2 -> HOC3 -> Index


![hoc1.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553a203098134c5abf734f4104ab4d14~tplv-k3u1fbpfcp-watermark.image)

**要注意一下包装顺序，越靠近 `Index` 组件的，就是越内层的 HOC ,离组件 `Index` 也就越近。**

还有一些其他的小细节：

* 1 如果2个 HOC 相互之间有依赖。比如 HOC1 依赖 HOC2 ，那么 HOC1 应该在 HOC2 内部。 

* 2 如果想通过 HOC 方式给原始组件添加一些额外生命周期，因为涉及到获取原始组件的实例 instance ，那么当前的 HOC 要离原始组件最近。

### 5 继承静态属性

上述讲到在属性代理 HOC 本质上返回了一个新的 component ，那么如果给原来的 component 绑定一些静态属性方法，如果不处理，新的 component 上就会丢失这些静态属性方法。那么如何解决这个问题呢。

**手动继承**

当然可以手动将原始组件的静态方法 copy 到 HOC 组件上来，但前提是必须准确知道应该拷贝哪些方法。

```js
function HOC(Component) {
  class WrappedComponent extends React.Component {
      /*...*/
  }
  // 必须准确知道应该拷贝哪些方法 
  WrappedComponent.staticMethod = Component.staticMethod
  return WrappedComponent
}
```

**引入第三方库**

每个静态属性方法都手动绑定会很累，尤其对于开源的 HOC ，对原生组件的静态方法是未知 ，为了解决这个问题可以使用 `hoist-non-react-statics` 自动拷贝所有的静态方法:

```js
import hoistNonReactStatic from 'hoist-non-react-statics'
function HOC(Component) {
  class WrappedComponent extends React.Component {
      /*...*/
  }
  hoistNonReactStatic(WrappedComponent,Component)
  return WrappedComponent
}
```
 
## 五 进阶实践-权限拦截

下面解决刚开始小明遇到的权限拦截问题。具体可以参考如下 demo ，没有绑定效果如下：


![hoc6.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d07a81733e1344d4b4773934cd0f19d4~tplv-k3u1fbpfcp-watermark.image)

假设期望的效果是：
* 1 将文档管理和标签管理模块，配置成权限拦截的页面。
* 2 模拟数据交互，返回模拟数据拦截文档录入和标签录入两个页面。（因为这节主要讲 HOC ，所以不必过多在意其他细节）

思路： 

* 1 需要权限的页面或者组件，用 HOC 包裹，并输入唯一的权限签名。 
* 2 用 Context 上下文保存全局的权限菜单列表，用 Provider 注入异步获取到的权限菜单。
* 3 HOC 中用 Consumer 获取权限列表，并且和签名做匹配，如果有权限，就展示，如果没有权限，展示默认没有权限组件。

**第一步，在根部注入权限。** 
```js
export const Permission = React.createContext([]) 

export default function Index(){
    const [ rootPermission , setRootPermission ] = React.useState([])
    React.useEffect(()=>{
        /* 获取权限列表 */
        getRootPermission().then(res=>{
            const { code , data } = res as any
            code === 200 && setRootPermission(data) //  [ 'docList'  , 'tagList' ]
        }) 
    },[])
    return <Permission.Provider value={rootPermission} >
         <RootRouter/>
    </Permission.Provider>
}

```
* useState 用于动态注入获取的权限列表。
* 根组件通过 Context.Provider 包裹。权限列表改变，所有消费权限列表的组件重新更新。
（假设一下数据交互返回的权限列表`[ 'docList'  , 'tagList' ]`）

**第二步：重点编写HOC**

```js
/* 没有权限 */
function NoPermission (){
    return <div>您暂时没有权限，请联系管理员开通权限！</div>
}
/* 编写HOC */
export function PermissionHoc(authorization){
    return function(Component){ 
        return function Home (props){
            const matchPermission =(value,list)=> list.indexOf(value) /* 匹配权限 */
            return <Permission.Consumer>
                {
                    (permissionList) => matchPermission(authorization,permissionList) >= 0 ? <Component  {...props} /> : <NoPermission />
                }
            </Permission.Consumer>
        }
    }
}
```
HOC 编写：
* 1 用两层包装函数的 HOC，第一层用于获取 HOC 绑定的当前组件的权限签名，因为要用这个权限签名和权限列表做匹配。第二层接受的原始组件。
* 2 在 HOC 中用 Context.Consumer 接收权限列表，做权限匹配。组件有权限展示，没有权限展示无权限组件。

**第三部：绑定权限**

```js
@PermissionHoc('writeDoc')  // 绑定文档录入页面
export default class Index extends React.Component{}
```
```js
export default PermissionHoc('writeTag')(index) //绑定标签录入页面
```
```js
export default PermissionHoc('tagList')(index) //绑定标签列表页面
```
```js
export default PermissionHoc('docList')(Index) // 绑定文档列表页面
```

* 对于业务组件进行权限 HOC 的包裹。

因为上述模拟数据返回的是`[ 'docList'  , 'tagList' ]`，所以最终只能看到 标签列表 和 文档列表 页面。

**第四部：验证效果**


![hoc7.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/469ab81641774cf0943445f801522c9f~tplv-k3u1fbpfcp-watermark.image)

完美实现效果，正常开发可能考虑的因素要比 demo 中的多，demo 实践给大家提供一个思路，具体实现还要看具体的业务需求。

## 六总结

这节主要学习了：
* 1 HOC 解决什么问题，诞生的初衷，两种不同的 HOC 。
* 2 如何编写 HOC 。
* 3 编写 HOC 的注意事项。
* 4 HOC 实现权限隔离的实践。

下一节，将一起进入React优化篇.