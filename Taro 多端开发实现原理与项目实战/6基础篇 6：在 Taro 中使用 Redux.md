# 在 Taro 中使用 Redux

## 前言

读了上篇文章，相信大家已经掌握了初步的 Taro 开发技能了，本文将带领大家结合 Redux 完善一个 Todolist。
首先，我们得对 Redux 有个初步的了解。Redux 是 JavaScript 状态容器，提供可预测的状态管理。一般来说，规模比较大的小程序，其页面状态和数据缓存等都需要管理很多的东西，这时候引入 Redux 可以方便的管理这些状态，**同一数据，一次请求，应用全局共享**。

而 Taro 也非常友好地为开发者提供了可移植的 Redux 。  

## 依赖

为了更方便地使用 `Redux`，Taro 提供了与 `react-redux` API 几乎一致的包 `@tarojs/redux` 来让开发人员获得更加良好的开发体验。

开发前需要安装 `redux` 和 `@tarojs/redux` ，开发者可自行选择安装 Redux 中间件，本文以如下中间件为例：

``` bash
$ yarn add redux @tarojs/redux redux-logger
# 或者使用 npm
$ npm install --save redux @tarojs/redux redux-logger
```

## 示例

下面通过丰富上一篇文章的 Todolist 快速上手 Redux 。

### 目录结构

首先通过目录划分我们的`store`/`reducers`/`actions`。

![2018-06-12-15-37-12](https://user-gold-cdn.xitu.io/2018/10/8/16651819b8e74eef?w=348&h=360&f=png&s=27279)

分别在三个文件夹里创建`index.js`，作为三个模块的入口文件。首先来看看`store/index.js`里面的内容。`reducers`和`actions`里面的内容我们需要规划好功能之后再来处理。

``` JavaScript
// store/index.js

import { createStore, applyMiddleware } from 'redux'

// 引入需要的中间件
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

// 引入根reducers
import rootReducer from '../reducers'

const middlewares = [
  thunkMiddleware,
  createLogger()
]

// 创建 store
export default function configStore () {
  const store = createStore(rootReducer, applyMiddleware(...middlewares))
  return store
}

```

### 编写 Todos

首先，定义好`store`，然后在`app.js`中引入。使用`@tarojs/redux`中提供的`Provider`组件将前面写好的`store`接入应用中，这样一来，被`Provider`包裹的页面都能访问到应用的`store`。

> Provider 组件使组件层级中的 connect() 方法都能够获得 Redux store。

``` JavaScript
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import configStore from './store'
import Index from './pages/index'

import './app.scss'

const store = configStore()

class App extends Component {
  ...
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>  
    )
  }
}
```

接下来我们正式开始规划 Todos 应用的主要功能。

首先我们可以新建`constants`文件夹来定义一系列所需的`action type`常量。例如 Todos 我们可以先增加`ADD`和`DELETE`两个`action type`来区分新增和删除 Todo 指令。

``` JavaScript
// src/constants/todos.js

export const ADD = 'ADD'
export const DELETE = 'DELETE'
```

然后开始创建处理这两个指令的`reducer`。

``` JavaScript
// src/reducers/index.js

import { combineReducers } from 'redux'
import { ADD, DELETE } from '../constants/todos'

// 定义初始状态
const INITIAL_STATE = {
  todos: [
    {id: 0, text: '第一条todo'}
  ]
}

function todos (state = INITIAL_STATE, action) {
  // 获取当前todos条数，用以id自增
  const todoNum = state.todos.length
  
  switch (action.type) {  
    // 根据指令处理todos
    case ADD:      
      return {
        ...state,
        todos: state.todos.concat({
          id: todoNum,
          text: action.data
        })
      }
    case DELETE:
      let newTodos = state.todos.filter(item => {
        return item.id !== action.id
      })

      return {
        ...state,
        todos: newTodos
      }
    default:
      return state
  }
}

export default combineReducers({
  todos
})

```

接着在`action`中定义函数对应的指令。

``` JavaScript
// src/actions/index.js

import { ADD, DELETE } from '../constants/todos'

export const add = (data) => {
  return {
    data,
    type: ADD
  }
}

export const del = (id) => {
  return {
    id,
    type: DELETE
  }
}

```

完成上述三步之后，我们就可以在 Todos 应用的主页使用相应`action`修改并取得新的`store`数据了。来看一眼 Todos 的`index.js`。

``` JavaScript
// src/pages/index/index.js

import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'

import { add, del } from '../../actions/index'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor () {
    super ()

    this.state = {
      newTodo: ''
    }
  }

  saveNewTodo (e) {
    let { newTodo } = this.state
    if (!e.detail.value || e.detail.value === newTodo) return

    this.setState({
      newTodo: e.detail.value
    })
  }

  addTodo () {
    let { newTodo } = this.state
    let { add } = this.props

    if (!newTodo) return

    add(newTodo)
    this.setState({
      newTodo: ''
    })
  }

  delTodo (id) {
    let { del } = this.props
    del(id)
  }

  render () {
    // 获取未经处理的todos并展示
    let { newTodo } = this.state
    let { todos, add, del } = this.props  

    const todosJsx = todos.map(todo => {
      return (
        <View className='todos_item'><Text>{todo.text}</Text><View className='del' onClick={this.delTodo.bind(this, todo.id)}>-</View></View>
      )
    })

    return (
      <View className='index todos'>
        <View className='add_wrap'>
          <Input placeholder="填写新的todo" onBlur={this.saveNewTodo.bind(this)} value={newTodo} />
          <View className='add' onClick={this.addTodo.bind(this)}>+</View>
        </View>
        <View>{ todosJsx }</View>  
      </View>
    )
  }
}

export default connect (({ todos }) => ({
  todos: todos.todos
}), (dispatch) => ({
  add (data) {
    dispatch(add(data))
  },
  del (id) {
    dispatch(del(id))
  }
}))(Index)

```

最后来看一眼实现的效果：

![todos](https://user-gold-cdn.xitu.io/2018/10/8/16651819b8f1255c?w=316&h=560&f=gif&s=122620)

## 小结
本章我们结合 Redux 丰富了一个 Todolist，通过梳理文件目录结构，规划 Todolist 功能，再细化到每一个文件的具体代码，让读者们深入浅出地了解到如何在 Taro 内结合 Redux 开发应用。

诚然，该文只是提供一种选型建议，是否需要在应用中使用状态管理框架，是否选用 Redux 作为应用的状态管理框架，还需要具体问题具体分析。如果你是在搭建类似商城这样的大型应用，我们非常建议你采用 Redux 管理数据状态，而譬如开发单页应用这类小型的站点，使用 Redux 则有可能会增加你的工作量哦。
