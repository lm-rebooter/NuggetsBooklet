假设 React 组件有这样一个状态：

```javascript
this.state = {
    a: {
        b: 1
    }
}
```

我们这样修改了它的状态：

```javascript
this.state.a.b = 2;
this.setState(this.state);
```

你觉得组件会重新渲染么？

我们先在 class 组件里试一下：

```javascript
import { Component } from 'react';

class Dong extends Component {
    constructor() {
        super();

        this.state = {
            a: {
                b: 1
            }
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.state.a.b = 2;
            this.setState(this.state);
        }, 2000);
    }
    render() {
        return <div>{this.state.a.b}</div>
    }
}

export default Dong;
```
渲染 state.a.b 的值，两秒以后修改 state。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f209d1a1b4245eeaa57b0f300cf8659~tplv-k3u1fbpfcp-watermark.image?)

你发现它重新渲染了，因为普通的 class 组件只要 setState 就会渲染。

但很多情况下我们需要做性能优化，只有 props 和 state 变了才需要渲染，这时候会继承 PureComponent，它和 memo 作用一样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cda77150f90a40feadf0cb3b3bd5e7ff~tplv-k3u1fbpfcp-watermark.image?)

但这时候你就会发现组件不再重新渲染了。

说明这种情况下不能这样写 setState：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3422fc64cc2c4c30a5bd4d28cfa86d6f~tplv-k3u1fbpfcp-watermark.image?)

先不着急探究原因，我们再在 function 组件里试一下：

```javascript
import { useEffect, useState } from 'react';

function Dong() {
    const [state, setState] = useState({
        a: {
            b: 1
        }
    });

    useEffect(() => {
        setTimeout(() => {
            state.a.b = 2;
            setState(state)
        }, 2000);
    }, [])
    return <div>{state.a.b}</div>
}

export default Dong;
```
这时候你觉得组件会重新渲染么？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e4528b0e5c143cd83ee5a7b43c0ecd8~tplv-k3u1fbpfcp-watermark.image?)

结果是不会重新渲染。

这说明 React 内部肯定对 function 组件还有继承 PureComponent 的 class 组件做了相应的处理。

那 React 都做了什么处理呢？

我们从源码看一下：

首先是继承 PureComponent 的 class 组件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46bbd01ee32a410fb8c68f6f2c31a9c2~tplv-k3u1fbpfcp-watermark.image?)

你会发现 React 在更新 class 组件的时候，会判断如果是 PureComponent，那么会浅比较 props 和 state，如果变了才会渲染。

怎么浅比较的呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b4133b5bd4a48ffa34d30ca116e3144~tplv-k3u1fbpfcp-watermark.image?)

 你会发现它先对比了两个值是否相等，如果不相等的话，再取出 key 来，对比每个 key 的值是否相等。
 
 所以说，我们 setState 的时候传入 this.state 就不行了，第一个判断都过不去。
 
 而且就算创建了新对象，如果每个 key 的值没有变，那依然也是不会渲染的。
 
 这就是 React 对 PureComponent 做的优化处理。
 
 再来看下 function 组件的，React 是怎么对它做的处理呢？
 
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/430d7df728ae4b8e9273eb248eaf0c31~tplv-k3u1fbpfcp-watermark.image?)

你会看到调用 useState 的 setXxx 时，React 会判断上次的 state 和这次的 state，如果一样，那就不会渲染，直接 return 了。

这是为什么 function 组件里 setState 上次的 state 不行的原因。

这两种情况还是有区别的，PureComponent 的处理里如果 state 变了，还会依次对比每个 key 的值，如果有某个值变了才会去渲染，但 function 组件里只对比了 state。

我们测试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79424f054c77445b8b86a7859c559007~tplv-k3u1fbpfcp-watermark.image?)

用上图的方式 setState，整个 state 变了，但是 key 对应的值没有变。

在 PureComponent 的 class 组件里，按照我们的分析应该不会再渲染，只会打印一次 render：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3f6504f0eb41bcbc1871b2e41902db~tplv-k3u1fbpfcp-watermark.image?)

确实是这样，虽然 state 对象变了，但是 key 的值没变，不会重新渲染。

然后在 function 组件里试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abed99295fed4186b85ab09dfa3bad93~tplv-k3u1fbpfcp-watermark.image?)

你会发现它打印了两次 render：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47ff7a8a658e48ae81ee64ac4394b3e7~tplv-k3u1fbpfcp-watermark.image?)

综上，我们可以总结一下：

- **普通的 class 组件，setState 就会重新渲染**
- **继承 PureComponent 的 class 组件，setState 时会对比 props 和 state 本身变没变，还会对比 state 的每个 key 的值变没变，变了才会重新渲染**
- **function 组件在用 useState 的 setXxx 时，会对比 state 本身变没变，变了就会重新渲染**

为什么 function 组件里只对比了 state 没有对比每个 key 的值也很容易理解，因为本来每个 state就是用 useState 单独声明的了，不像 class 组件的 state 都在一起。

知道了这个结论，我们也就知道了 setState 该怎么写了：

class 组件要这么写：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67c19bff21fb49c78d632655199e8e78~tplv-k3u1fbpfcp-watermark.image?)

state 的每个要修改的 key 的值，如果是个对象，那要创建一个新的对象才行。

function 组件里也是，要这么写：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0accadf35484436d80e21ef309c8366b~tplv-k3u1fbpfcp-watermark.image?)

综上，**不管是 class 组件，还是 function 组件，setState 时都要创建新的 state，并且对应的 key 的值的时候，如果是对象，要创建新的对象（虽然普通 class 组件里可以不这么写，但还是建议统一用这种写法，不然容易引起困惑）。**

但这样又有了一个新的问题：

如果 state 的内容很多呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1499015730254d838d16ee9ae2c8da1f~tplv-k3u1fbpfcp-watermark.image?)

而你只想修改其中的一部分，要把整个对象复制一次：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/056cd89898074f9b91a804f3c712bf3d~tplv-k3u1fbpfcp-watermark.image?)

是不是很麻烦？

能不能我修改了对象的值，立马给我返回一个新的对象呢？

就是最开头的时候，我们的那种写法改造一下：

```javascript
const newState = this.state.set('a.b', 2);

this.setState(newState);
```

这么一个明显的痛点需求，自然就有相应的库了，也就是 immutable，这个是 facebook 官方出的，说是花了三年写的。

它有这么几个 api：fromJS、toJS、set、setIn、get、getIn。

我们试一下就知道了：

```javascript
const immutableObj = fromJS({
    a: {
        b: 1
    }
});
const newObj = immutableObj.get('a').set('b', 2);
```

用 fromJS 把 JS 对象转成 immutable 内部的数据结构，然后 get a，再 set b 的值。

这样返回的是 immutable 的数据结构，并且对 b 做了修改：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/024348c1ea964a97a64864c12ef3f05a~tplv-k3u1fbpfcp-watermark.image?)

你和之前的 a 属性的值对比下，发现也不一样了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd4438f6c4234c0ca6b78e0ccf2fe589~tplv-k3u1fbpfcp-watermark.image?)

这就是它的作用，修改值以后返回新的 immutable 数据结构。

那如果像修改一个层数比较深的值，但希望返回的值是整个对象的新的 immutable 结构呢？

可以用 setIn：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1191caca07a4c9c843c6a22068bab5a~tplv-k3u1fbpfcp-watermark.image?)

这样修改了任意属性之后，都能拿到最新的对象，这不就完美解决了我们的痛点问题么？

你还可以用 toJS 再把 immutable 数据结构转成 JS 对象：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25424dc88cc24724aebe147a0846982c~tplv-k3u1fbpfcp-watermark.image?)

再来回顾下 immutable 的 api： fromJS、toJS、set、get、setIn、getIn 这些都很容易理解。再就是 immutable 内部的数据结构 Map、Set 等。（注意这里的 Map、Set 不是 JS 里的那个，而是 immutable 实现的）

这些 immutable 数据结构一般不大需要手动创建，直接用 fromJS 让 immutable 去创建就行。

然后我们在 React 组件里用一下试试：

先在 class 组件里用用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/282003f57c014c93bfeffeacf272b3bd~tplv-k3u1fbpfcp-watermark.image?)

a 的值是个对象，我们用 fromJS 转成 immutable 的数据结构，之后修改调用 set、setIn 来修改。

不过，渲染的时候也得用 get、getIn 的 api 来取了。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5bca1756ca64b27a3ab946b4dab1f07~tplv-k3u1fbpfcp-watermark.image?)

这样也解决了 setState 需要创建新对象的问题，而且更优雅。

有的同学可能会问，为什么要 sate.a 用 fromJS 转成 immutable，而不是整个 state 呢？

因为 react 内部也会用到这个 state 呀，就比如上面那个浅比较那里：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df7bfdf81ce540bb98df91d0008d404a~tplv-k3u1fbpfcp-watermark.image?)

react 需要把每个 key 的值取出来对比下变没变，而 immutable 对象只能用 get、getIn 来取，所以**class 组件里不能把整个 state 变为 immutable，只能把某个 key 值的对象变为 immutable**。

再在 function 组件里用下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61c83721fbc6459d85c6d878f999f713~tplv-k3u1fbpfcp-watermark.image?)

function 组件里就可以这样写了，把整个 state 用 fromJS 变为 immutable 的，然后后面修改用 setIn，获取用 getIn。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d7be4502c2b4745b75a83000f490a5c~tplv-k3u1fbpfcp-watermark.image?)

也同样解决了 setState 要创建新对象的问题。

为啥 function 组件里就可以把整个 state 变为 immutable 的了呢？

因为只有组件内部会用呀，我们自己写的代码是知道用 setIn、getIn 来操作的，但是 class 组件的话 react 还会对 PureComponent 做一些优化，会在组件外把 state 取出来处理，所以那个就只能把某些 key 变为 immutable 了。

immutable 介绍完了，大家觉得怎么样？

immutable 确实解决了创建新对象的复杂度的问题，而且性能也好，因为它创建了一套自己的数据结构。

但也相应的，导致使用的时候必须要用 getIn、setIn 的 api 才行，有一些心智负担。

这种心智负担是不可避免的吧？

还真可以，这几年又出了一个新的 immutable 库，叫做 immer（MobX 作者写的）。它就覆盖了 immutable 的功能的同时，还没有心智负担。

没有心智负担？怎么可能？

我们试一下就知道了：

```javascript
import { produce } from 'immer';

const obj = {
    a: {
        b: 1
    }
};

const obj2 = produce(obj, draft => {
    draft.a.b = 2 
});
```

obj 是原对象，调用 produce 传入该对象和要对它做的修改，返回值就是新对象：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1f66f648e2343499f3fc576acbe7efa~tplv-k3u1fbpfcp-watermark.image?)

后面就是普通 JS 对象的用法，也不用啥 getIn、setIn 啥的。

我们在 class 组件里用一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58adb16f95fc4bbf8cc08acd74c9eaec~tplv-k3u1fbpfcp-watermark.image?)

setState 的时候调用 produce，传入原来的 state 和修改函数，这样返回的就是新的 state。

用 state 的时候依然是普通 JS 对象的用法。是不是简单的一批，心智负担基本为 0？

我们再在 function 组件里用一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5cb3ffd39094a1b991bb674ee14ed15~tplv-k3u1fbpfcp-watermark.image?)

同样简单的一批，只要 setState 的时候调用下 produce 来产生新对象就行。

又学完了 immer，我们来对比下 immutable 和 immer：

直接看图吧：

class 组件里，immutable 这样写：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9efacddc0e8941438383f1e36acc91e9~tplv-k3u1fbpfcp-watermark.image?)

immer 这样写：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59f83e6e6c8b4f269c35ec48e8b00922~tplv-k3u1fbpfcp-watermark.image?)

function 组件里，immutable 这样写：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aadfb6a986442b88aa4c12de8bbd6a8~tplv-k3u1fbpfcp-watermark.image?)

immer 这样写：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aca013e00f344561bf0f3a2492d2a764~tplv-k3u1fbpfcp-watermark.image?)

没有对比就没有伤害，从使用体验上，immer 完胜。

这么说，我们只用 immer 不就行了？

也不全是，90% 的场景下用 immer 就行，但 immutable 也有它独特的优点：

immutable 有自己的数据结构，修改数据的时候会创建新的节点连接之前的节点组成新的数据结构。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fc3367521d64ab992b61793fc10747a~tplv-k3u1fbpfcp-watermark.image?)

而 immer 没有自己的数据结构，它只是通过 Proxy 实现了代理，内部自动创建新的对象：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1c45bdae60c46aaaee8e27cf4ef2336~tplv-k3u1fbpfcp-watermark.image?)

只不过是把手动创建新对象的过程通过代理给自动化了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660e5c0474d947879f2288ee2d296c7d~tplv-k3u1fbpfcp-watermark.image?)

所以从性能上来说，如果有特别大的 state 的话，immutable 会好一些，因为他用的是专用数据结构，做了专门的优化，除此以外，immer 更好一些。

综上，90% 的 React 应用，用 immer 比 immutable 更好一些，代码写起来简单，也更容易维护。有大 state 的，可以考虑 immutable。

此外，immutable 在 redux 里也很有用的：

用 immutable 的话是这样写：

```javascript
const initialState = fromJS({})

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_NAME:
      return state.set('name', 'guang')
    default:
      return state
  }
}
```
取 store 的 state 要用 getIn 或 get：
```javascript
function mapStateToProps(state) {
    return {
      xxxx: state.getIn(['guangguang', 'guang']),
      yyyy: state.getIn(['dongdong', 'dong'])
    }
  }
```

而 immer 是这样写：
```javascript
const reducer = produce((state = initialState, action) => {
  switch (action.type) {
    case SET_NAME:
      state.name = 'guang';
      break;
    default:
      return state
  }
})
```
用 store 的 state 是普通对象的用法：

```javascript
function mapStateToProps(state) {
    return {
      xxxx: state.guangguang,
      yyyy: state.dongdong
    }
}
```
从结合 redux 的角度来看，也是 immer 在体验上完胜。

## 总结

在 React 组件里 setState 是要创建新的 state 对象的，在继承 PureComponent 的 class 组件、function 组件都是这样。

继承 PureComponent 的 class 组件会浅对比 props 和 state，如果 state 变了，并且 state 的 key 的某个值变了，才会渲染。

function 组件的 state 对象变了就会重新渲染。

虽然在普通 class 组件里，不需要创建新的 state，但我们还是建议统一，所有的组件里的 setState 都创建新的对象。

但是创建对象是件比较麻烦的事情，要一层层 ...，所以我们会结合 immutable 的库。

主流的 immutable 库有两个， facebook 的 immutable 和 MobX 作者写的 immer。

immutable 有自己的数据结构，Map、Set 等，有 fromJS、toJS 的 api 用来转换 immutable 数据结构和普通 JS 对象，操作数据需要用 set、setIn、get、getIn。

immer 只有一个 produce api，传入原对象和修改函数，返回的就是新对象，使用新对象就是普通 JS 对象的用法。

要注意在 class 组件里，只能 state 的某个 key 的值变为 immutable，而不能整体变为 immtable，因为 React 内部会用到。

从使用体验上来说，不管是和 react 的 setState 结合还是和 redux 的 reducer 结合，都是 immer 完胜，但是 immutable 因为有专用数据结构的原因，在有大 state 对象的时候，性能会好一些。

90% 的情况下，immer 能完胜 immutable。
