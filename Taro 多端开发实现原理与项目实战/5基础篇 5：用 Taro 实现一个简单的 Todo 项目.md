# 用 Taro 实现一个简单的 Todo 项目

按前面章节的介绍操作，想必已经安装好了 Taro 了，现在我们来实现一个简单的 Todo 项目进行实战。

## 创建项目

Todo 项目包含两个简单的功能：

- 输入事项：点击「添加」按钮增加一个事项；
- 删除事项：点击事项列表里事项后面的「删除」按钮将删除该事项。

首先进入你想存放本项目的目录里，使用 Taro 创建一个 Todolist 项目，即输入命令`taro init todoList`（Todolist  为项目名称，你也可指定其他名称），过程如下图：

![taro init todoList](https://user-gold-cdn.xitu.io/2018/10/8/166510ea776019fa?w=1462&h=1754&f=png&s=606070)

创建项目成功后，我们先来看看当前的项目结构。

![2018-09-03-10-28-11](https://user-gold-cdn.xitu.io/2018/10/8/166510ea7926a413?w=1644&h=516&f=png&s=95654)

 `src` 文件夹存放我们开发时的文件，包括一个根目录的全局配置文件 `app.js`，全局样式 `app.scss`，入口 HTML 文件 `index.html`。`index.html` 里内置了 `rem` 转换代码（这个不需要关注）。而 `src` 目录 `pages` 下则对应的是项目的每一个页面，这里默认只有一个 `index` 页面，每一个页面下又包含 JS 文件和样式文件两个文件，这里即 `index.js` 和 `index.scss`。
 
 如果需要创建组件，我们可以在 `src` 创建 `component` 目录来统一存放组件。

了解了目录以后，接下来找到在 `src` 目录的 `pages` 下的 `index.js` （我们前面了解到这个就是默认的页面）。

``` JavaScript
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}


```
文件开始第 1 行默认引入 Taro 的 `Component` 组件，它主要用来做组件化，我们这里暂时不用了解它；接着第 2 行是引入要用到的 `View` 和 `Text`, 我们下文要用到的 `Input` 组件也会是在这里引入。接下来第 3 行是引入样式对应的样式文件。

在我们正式开始写代码前先看看默认页面的效果吧。可以选择小程序的方式在微信开发者工具里查看（第 3 章《[微信小程序开发入门与技术选型](https://juejin.im/book/5b73a131f265da28065fb1cd/section/5b7413a4e51d45662434b5ca)》里有相关的介绍）或 H5 的方式在浏览器里查看。在命令行进行项目构建：

``` bash
# 小程序构建
$ taro build --type weapp --watch
# H5构建
$ taro build --type h5 --watch
```
得到小程序的效果：


![](https://user-gold-cdn.xitu.io/2018/10/12/166666d8ac79a180?w=745&h=250&f=png&s=20722)

接下来我们就正式开始编写 Todolist 了，我们把事项列表存在 `state` 里且给它默认几个事项，最后把它渲染出来。

``` JavaScript
// ...
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor (props) {
    super (props)
    this.state = {
      // 创建一个初始的 Todolist
      list: [
        'get up',
        'coding',
        'sleep',
      ],
      inputVal: ''
    }
  }
  
  render () {
    let { list, inputVal } = this.state

    return (
      <View className='index'>
        <View className='list_wrap'>
          <Text>Todo list</Text>
          {
            list.map((item, index) => {
              return <View>
                <Text>{index + 1}.{item}</Text>
              </View>
            })
          }
        </View>
      </View>
    )
  }
}
``` 

要想实现添加事项的功能，我们需要引入 `Input` 组件来输入事项，当我们输入的时候触发 `onInput` 事件，把输入的值保存在 `this.inputVal`；同时使用 `Text` 组件把「添加」按钮展示出来，点击的时候触发 `onClick` 事件，当点击发生时，我们可以查看 `this.inputVal` 是否为空，如果不为空则可以添加到事项列表里，即在 `list` 列表里添加事项且更新 `state` 。具体的代码如下：

``` JavaScript
// 这里多引入了 Input 组件
import { View, Text, Input } from '@tarojs/components'

export default class Index extends Component {

  // ... 生命周期函数，暂时不需要关注
  // 添加按钮 onClick 时，添加事项，然后更新 list
  addItem () {
    let { list } = this.state
    const inputVal = this.inputVal
    // 如果输入框的值为空，则返回，否则添加到事项列表里
    if (inputVal == '') return
    else {
      list.push(inputVal)
    }
    this.setState({
      list,
      inputVal: ''
    })
  }

  // 输入框 onInput 的时候，它的值暂存起来
  inputHandler (e) {
    this.inputVal = e.target.value
  }

  render () {
    let { list, inputVal } = this.state

    return (
      <View className='index'>
        <Input className='input' type='text' value={inputVal} onInput={this.inputHandler.bind(this)} />
        <Text className='add' onClick={this.addItem.bind(this)}>添加</Text>
        <View className='list_wrap'>
          <Text>Todo list</Text>
          {
            list.map((item, index) => {
              return <View>
                <Text>{index + 1}.{item}</Text>
              </View>
            })
          }
        </View>
      </View>
    )
  }
}

```

上面我们完成了添加事项的功能，下面我们开发删除功能。删除功能就是点击事项后的「删除」按钮删除对应的事项，即从事项列表中移除该事项。首先是在展示事项的列表后添加「删除」按钮并且把该事项的索引传入点击事件里，发生点击的时候就可以根据索引删除对应的事件。

``` JavaScript
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  // ... 其他代码已略
  // 根据索引删除事项，然后更新 list
  delItem (index) {
    let { list } = this.state
    list.splice(index, 1)
    this.setState({
      list
    })
  }

  render () {
    let { list, inputVal } = this.state

    return (
      <View className='index'>
        <Input className='input' type='text' value={inputVal} onInput={this.inputHandler.bind(this)} />
        <Text className='add' onClick={this.addItem.bind(this)}>添加</Text>
        <View className='list_wrap'>
          <Text>Todo list</Text>
          {
            list.map((item, index) => {
              return <View>
                <Text>{index + 1}.{item}</Text>
                <Text className='del' onClick={this.delItem.bind(this, index)}>删除</Text>
              </View>
            })
          }
        </View>
      </View>
    )
  }
}


```

到这里我们实现了一个简单的可添加可删除的 Todolist，因为我们之前使用的是 Taro 的 `taro build --type weapp --watch` 或 `taro build --type h5 --watch` 命令，所以在编写代码的同时可以不停地查看我们编写的效果。我们再补充一些样式，样式写在 `index` 页面下的样式文件里，这里即 `index.scss`。

``` CSS
.input {
    display: inline-block;
    margin: 20rpx;
    border: 1rpx solid #666;
    width: 500rpx;
    vertical-align: middle;
}
.list_wrap {
    padding: 50rpx 20rpx;
}
.list {
    margin: 20rpx 0;
}
.add,
.del {
    display: inline-block;
    width: 120rpx;
    height: 60rpx;
    margin: 0 10px;
    padding: 0 10rpx;
    color: #333;
    font-size: 22rpx;
    line-height: 60rpx;
    text-align: center;
    border-radius: 10rpx;
    border: 1rpx solid #C5D9E8;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    justify-content: center;
    vertical-align: middle;
}
.add {
    background-color: #5c89e4;
    color: #fff;
    border: 1PX solid #5c89e4;
}
.del {
    background-color: #fff;
    color: #5c89e4;
    border: 1PX solid #5c89e4;
    margin-left: 100rpx;
}
```

为了方便大家实践，且篇幅不算长，这里把 `index.js` 全部代码展示一下：

``` JavaScript

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor (props) {
    super (props)
    this.state = {
      // 创建一个初始的 Todolist
      list: [
        'get up',
        'coding',
        'sleep',
      ],
      inputVal: ''
    }
  }

  // ... 生命周期函数，暂时不需要关注

  addItem () {
    let { list } = this.state
    const inputVal = this.inputVal
    if (inputVal == '') return
    else{
      list.push(inputVal)
    }
    this.setState({
      list,
      inputVal: ''
    })
  }

  delItem (index) {
    let { list } = this.state
    list.splice(index, 1)
    this.setState({
      list
    })
  }

  inputHandler (e) {
    // 不参与渲染的变量可不使用state储存，提高性能
    this.inputVal = e.target.value
  }

  render () {
    let { list, inputVal } = this.state

    return (
      <View className='index'>
        <Input className='input' type='text' value={inputVal} onInput={this.inputHandler.bind(this)} />
        <Text className='add' onClick={this.addItem.bind(this)}>添加</Text>
        <View className='list_wrap'>
          <Text>Todo list</Text>
          {
            list.map((item, index) => {
              return <View className='list'>
                <Text>{index + 1}.{item}</Text>
                <Text className='del' onClick={this.delItem.bind(this, index)}>删除</Text>
              </View>
            })
          }
        </View>
      </View>
    )
  }
}
```

## 实际效果

最后来看一眼实现的效果：

![todos](https://user-gold-cdn.xitu.io/2018/11/8/166f2f318075e579)

## 小结
本文主要介绍了如何使用 Taro 创建一个应用目录，并快速进行开发，以及目录中的一些配置内容。Taro 给前端同学们带来了全新的编码体验，想必熟悉 React 的同行们都能快速上手，（如果从未使用 React，则可以看本小册的第 2 章《[React 核心语法初识](https://juejin.im/book/5b73a131f265da28065fb1cd/section/5b73c67cf265da27df094055)》）这里就不再赘述了。

下一章将为大家讲解如何在应用中添加以及使用 Redux 来管理我们的数据。

