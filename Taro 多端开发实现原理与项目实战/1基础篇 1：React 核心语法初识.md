# React 核心语法初识

上篇文章提到 React 、 Angular 、 Vue 三大框架大行其道，前端开发也变得越来越规范化，工程化，我们常说的前端，也不仅仅局限于 H5 和网页端，而是延伸到了小程序、移动端、桌面端等。

在整个前端体系发展的过程中，React 语法体系起到了至关重要的作用，Taro 也正是基于 React 语法来进行开发。本章我们逐一介绍一下 React 语法体系。

> 注：目前 Taro 所支持的 React 语法版本是以 React15 为基础的，所以本篇文章说的生命周期， API 等都是基于 React15 的版本。而想了解更多关于 React16 版本的变更情况，可到[官网](https://reactjs.org/)查阅。



## JSX 语法

JSX 是 React 的核心组成部分，React 认为组件化才是正确的代码分离方式，它要比模板与组件逻辑分开的方式更好，所以就有了 JSX 语法。它把 HTML 模板直接嵌入到 JS 代码里面，这样就做到了模板和组件关联。JSX 允许在 JS 中直接使用 XML 标记的方式来声明界面，初次看起来，可能会有点糅杂的感觉，不太适应。但习惯了之后，也没有那么别扭，而且开发起来还蛮方便的。

举个 Taro 里的例子：

```javascript
// 只看 render 函数，绝大多数情况下 render 函数里都会有 XML 标记
render () {
  return (
    <View className='index'>
      <View className='title'>{this.state.title}</View>
      <View className='content'>
        {this.state.list.map(item => {
          return (
            <View className='item'>{item}</View>
          )
        })}
        <Button className='add' onClick={this.add}>添加</Button>
      </View>
    </View>
  )
}
```

可以见到，`render` 函数返回了一些用括号包住的 XML 结构的界面描述，这其实就是该组件的界面描述。里面的写法和 HTML 并没有多大的差别。不同的地方主要是可以在里面进行事件绑定，表达变量，实现简单 JS 逻辑等，**即在 JS 里写 HTML**。而变量、简单 JS 逻辑都是需要用 `{}` 包裹起来。另外 HTML 的 `class` 属性因为是 Javascript 的保留字，所以需要写成 `className`。

实际上，上述 JSX 代码，最终都会通过 JSX 编辑器（现在主要都是 [babel](https://www.babeljs.cn/)），转换为 JS 代码。例如：

``` javascript
// JSX 语法
const num = 1
const hello = <div className='test'>{num}</div>

// 编译后的 JS
const num = 1
const hello = React.createElement('div', {className:'test'}, num)
```

这里用的是 React 的例子（[React.createElement](https://reactjs.org/docs/react-api.html#createelement) 是 React 里的一个核心函数，用来生成虚拟 DOM )，Taro 中也会有类似的处理。简言之，JSX 其实是一种语法糖，最终会转化为生成虚拟 DOM 的 JS 代码。之所以有这种语法，我个人的理解是可以让你更自由，更开放，用 JS 的思维来处理界面与数据之间的关系，将界面抽象出来，不再受那些 HTML 的束缚。

然而，在 JSX 里使用 JS 是有限制的，只能使用一些表达式，不能定义变量，使用 `if/else` 等，你可以用提前定义变量；用三元表达式来达到同样的效果。

列表渲染，一般是用数组的 `map` 函数。正如上面的例子，把需要列表渲染的数据使用 `map` 函数，返回所需要的 JSX 代码。而在事件绑定上，使用 on + 事件名称，这点和我们理解的并无大异。

## React 组件

组件化，是 React 的另一大特点。顾名思义，组件化就是把整个页面分成大大小小的各个组件（component），然后像插入普通 HTML 标签一样，在页面中插入这个组件。组件之间可能互相关联，也可能互相独立，这取决于业务逻辑。这样做主要还是为了方便管理，把页面的维度降到组件的维度，维度越小，管理起来就越精确，同时，经过抽象之后，相同的组件还可以复用，提高了工作效率。

``` javascript
class Demo extends Component {
  // ...
  render () {
    return <View className='test'>{this.state.num}</View>
  }
}
```

这里需要注意，组件类的第一个字母必须大写，否则会报错，比如这里的 `Demo` 不能写成 `demo`。另外，组件类只能包含一个顶层标签，否则也会报错。

每个 React 组件都会有一个 `render` 函数，用于返回该组件的 JSX 片段，代表着该组件的界面结构。同时，也可以在 `render` 函数里返回另一个组件，即组件之间的相互嵌套，如下面所示，`Demo` 组件的 `render` 函数返回了一个 `Nav` 组件和一些 JSX 片段。

```javascript
import Nav from './nav.js'
class Demo extends React.Component {
  // ...
  render () {
    return (
      <div className='test'>
        <Nav />
        <div className='bar'>{this.state.num}</div>
      </div>
    )
  }
}
```

## Props 与 State

`props` 与 `state` 是 `React` 组件中最为重要的两个状态。

### props

父组件传给子组件的数据，会挂载在子组件的 `this.props` 上，如：

```javascript
// 子组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
// 父组件
class Demo extends React.Component {
  render () {
    return <Welcome name='aotu,taro!' />
  }
}
// 最终页面上会渲染出 <h1>Hello, aotu,taro!</h1>
```

可以见到，`Demo` 组件在调用 `Welcome` 组件时，传入了 `name='aotu,taro!'` 的 `props`，所以子组件里就能访问到 `this.props.name` 属性。比较重要的一点是，组件中如果收到了新的 `props`，就会**重新执行一次 `render` 函数，也就是重新渲染一遍**。

上述只是关于 `props` 的最基础的用法，除此之外，还有 `this.props.children`、高阶组件等比较高级的用法，在这里就不一一叙述了。

### state

`state` 与 `props` 不同，是属于组件自己内部的数据状态，一般在 `constructor` 构造函数里初始化定义 `state`，例如：

```javascript
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: 'aotu,taro!'};
  }
  render() {
    return <h1>Hello, {this.state.name}</h1>;
  }
}
```

可以见到，在构造函数里初始化一个 `state` 对象，然后在 `render` 函数里渲染出来。

值得注意的是，当 `state` 需要变化时，是不允许随便更改的，需要调用 `this.setState` 来进行更改，否则视图没法进行更新。

```javascript
// 错误
this.state.name = 'hey!hey!hey!'

// 正确
this.setState({name: 'hey!hey!hey!'})
```

这与 Vue 等一些可以在数据变更时自动响应视图变化的框架不同，React 的数据及视图变化是需要主动调用 `setState` 函数来触发的，具体原因与框架实现的原理有关，这里就不细说了。当调用 `setState` 函数时，最终组件会执行 `render` 函数，重新再渲染一遍。

所以一般来说，比较好的做法是**只把跟组件内部视图有关联的数据，变量放在 `state` 里面**，以此避免不必要的渲染。

## 组件的生命周期

组件的生命周期，指的是一个 `React` 组件从挂载，更新，销毁过程中会执行的生命钩子函数。

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentWillMount() {}
 
  componentDidMount() {}

  componentWillUpdate(nextProps, nextState) {}
    
  componentWillReceiveProps(nextProps) {}  
  
  componentDidUpdate(prevProps, prevState) {}

  shouldComponentUpdate(nextProps, nextState) {}

  componentWillUnmount() {}
  
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

上述组件中基本把所有生命周期都列出来了，下面简单一一叙述下

- **constructor**，顾名思义，组件的构造函数。一般会在这里进行 `state` 的初始化，事件的绑定等等
- **componentWillMount**，是当组件在进行挂载操作前，执行的函数，一般紧跟着 `constructor` 函数后执行
- **componentDidMount**，是当组件挂载在 dom 节点后执行。一般会在这里执行一些异步数据的拉取等动作

- **shouldComponentUpdate**，返回 `false` 时，组件将不会进行更新，可用于渲染优化
- **componentWillReceiveProps**，当组件收到新的 `props` 时会执行的函数，传入的参数就是 `nextProps` ，你可以在这里根据新的 `props` 来执行一些相关的操作，例如某些功能初始化等
- **componentWillUpdate**，当组件在进行更新之前，会执行的函数
- **componentDidUpdate**，当组件完成更新时，会执行的函数，传入两个参数是 `prevProps` 、`prevState`
- **componentWillUnmount**，当组件准备销毁时执行。在这里一般可以执行一些回收的工作，例如 `clearInterval(this.timer)` 这种对定时器的回收操作



## 小结

本文从 **JSX 语法**、**React 组件**、**Props 与 State**、**生命周期**这四个方面简单介绍了 [React](https://reactjs.org/) 语法体系的核心部分，整体而言都是一些比较基础的部分。而更详细，更多具体的开发技巧，随着小册的深入我们在后续涉及到的章节会继续介绍。

需要说明的是，由于微信小程序的限制，React 中某些写法和特性在 Taro 中还未能实现，后续将会逐渐完善。差异的部分可以在[《基础篇 4：Taro 开发说明与注意事项》](https://juejin.im/editor/book/5b73a131f265da28065fb1cd/section/5b74d725e51d45665e39eb98)章节里查看。



## 参考资料

- [Reactjs Docs](https://reactjs.org/)


