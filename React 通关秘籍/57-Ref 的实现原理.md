ref 是 React 里常用的特性，我们会用它来拿到 dom 的引用，或者用来保存渲染过程中不变的数据。

我们创建个项目试一下：

```
npx create-vite
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d58e273d6ad448a199de38711e455ccf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=726&h=426&s=70808&e=png&b=000000)

去掉 index.css 和 StrictMode

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fe5e21334e34030a5babf56700f5c08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=412&s=77547&e=png&b=1f1f1f)

改下 App.tsx

```javascript
import { useRef, useEffect } from "react";

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=> {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" />
}
```
把开发服务跑起来：

```
npm run dev
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21a7fe64637943638b6a161243d9af13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=742&h=420&s=54791&e=png&b=181818)

创建个调试配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f55f52a80043446cbab81ac4d080e508~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=696&h=290&s=34840&e=png&b=181818)

```json
{
    "type": "chrome",
    "request": "launch",
    "name": "Launch Chrome against localhost",
    "url": "http://localhost:5173",
    "webRoot": "${workspaceFolder}"
}
```

可以看到，useRef 可以拿到 dom 的引用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f062c8bcb4e4136b2225ef24d5295ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=882&h=536&s=122579&e=png&b=212121)

此外，useRef 还可以保存渲染中不变的一些值：

```javascript
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [num, setNum] = useState(0);
  const timerRef = useRef<number>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setNum(num => num + 1);
    }, 100);
  }, []);

  return <div>
    {num}
    <button onClick={() => {
      clearInterval(timerRef.current!);
    }}>停止</button>
  </div>
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9096daba89b0449192d89a8d6d982ed2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=786&h=482&s=68959&e=gif&f=32&b=fdfdfd)

当传入 null 时，返回的是 RefObject 类型，用来保存 dom 引用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1d12475a7f54768a090b8ce1f4e3e3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=120&s=31098&e=png&b=212121)

传其他值返回的是 MutableRefObject，可以修改 current，保存其它值：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54828379cec5421eb68bfd56d309825e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=148&s=35415&e=png&b=212121)

而在 class 组件里用 createRef：
```javascript
import React from "react";

export default class App  extends React.Component{
  constructor() {
    super();
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    return <input ref={this.inputRef} type="text" />
  }
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec312f879548491084c54afebe7ed6ad~tplv-k3u1fbpfcp-watermark.image?)

如果想转发 ref 给父组件，可以用 forwardRef：

```javascript
import React, { useRef, forwardRef, useImperativeHandle, useEffect } from "react";

const ForwardRefMyInput = forwardRef<HTMLInputElement>((props, ref) => {
    return <input {...props} ref={ref} type="text" />
  }
)

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  return (
    <div className="App">
      <ForwardRefMyInput ref={inputRef} />
    </div>
  );
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e038d81555d2484484e3210b2eadb04b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=662&s=131242&e=png&b=212121)

而且还可以使用 useImperativeHandle 自定义传给父元素的 ref：

```javascript
import React, { useRef, forwardRef, useImperativeHandle, useEffect } from "react";

interface RefType {
  aaa: Function
}

const ForwardRefMyInput = forwardRef<RefType>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => {
      return {
        aaa() {
          inputRef.current?.focus();
        }
      }
    });
    return <input {...props} ref={inputRef} type="text" />
  }
)

export default function App() {
  const apiRef = useRef<RefType>(null);

  useEffect(() => {
    apiRef.current?.aaa();
  }, [])

  return (
    <div className="App">
      <ForwardRefMyInput ref={apiRef} />
    </div>
  );
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a51ccb446ad14ce9897b39ef39c41d47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=756&s=123805&e=png&b=202020)

这就是我们平时用到的所有的 ref api 了。

小结一下：

- **函数组件里用 useRef 保存 dom 引用或者自定义的值，而在类组件里用 createRef**
- **forwardRef 可以转发子组件的 ref 给父组件，还可以用 useImperativeHandle 来修改转发的 ref 的值**

相信开发 React 项目，大家或多或少会用到这些 api。

那这些 ref api 的实现原理是什么呢？

下面我们就从源码来探究下：

我们通过 jsx 写的代码，最终会编译成 React.createElement 等 render function，执行之后产生 vdom：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c78461cd0724d16b45eeeec31338717~tplv-k3u1fbpfcp-watermark.image?)

所谓的 vdom 就是这样的节点对象：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ce70b4b3e044a848a7633023a3d121f~tplv-k3u1fbpfcp-watermark.image?)

vdom 是一个 children 属性连接起来的树。

react 会先把它转成 fiber 链表：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7532cfe323f4ef59f75c3a7fb03d234~tplv-k3u1fbpfcp-watermark.image?)

vdom 树转 fiber 链表树的过程就叫做 reconcile，这个阶段叫 render。

render 阶段会从根组件开始 reconcile，根据不同的类型做不同的处理，拿到渲染的结果之后再进行 reconcileChildren，这个过程叫做 beginWork：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2f4cf79c8ce4addbcafd8acac11a621~tplv-k3u1fbpfcp-watermark.image?)

比如函数组件渲染完产生的 vom 会继续 renconcileChildren：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00ec50d2fd5d428799cba94495b69cdd~tplv-k3u1fbpfcp-watermark.image?)

beginWork 只负责渲染组件，然后继续渲染 children，一层层的递归。

全部渲染完之后，会递归回来，这个阶段会调用 completeWork：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3721c65e53dc42889373bd908d25cfce~tplv-k3u1fbpfcp-watermark.image?)

这个阶段会创建需要的 dom，然后记录增删改的 tag 等，同时也记录下需要执行的其他副作用到 fiber 上。

之后 commit 阶段才会遍历 fiber 链表根据 tag 来执行增删改 dom 等 effect。

commit 阶段也分了三个小阶段，beforeMutation、mutation、layout：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f9df8d9eee54d5d9daa069291c23514~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1484&h=1180&s=314713&e=png&b=1f1f1f)

它们都是消费的同一条 fiber 链表，但是每个阶段做的事情不同

mutation 阶段会根据标记增删改 dom，也就是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cdc5017447840388ce255416c0c593b~tplv-k3u1fbpfcp-watermark.image?)

所以这个阶段叫做 mutation，它之前的一个阶段叫做 beforeMutation，而它之后的阶段叫做 layout。

小结下 react 的流程：

**通过 jsx 写的代码会编译成 render function，执行产生 vdom，也就是 React Element 对象的树。**

**react 分为 render 和 commit 两个阶段:**

**render 阶段会递归做 vdom 转 fiber，beginWork 里递归进行 reconcile、reconcileChildren，completeWork 里创建 dom，记录增删改等 tag 和其他 effect**

**commit 阶段遍历 fiber 链表，做三轮处理，这三轮分别叫做 before mutation、mutation、layout，mutation 阶段会根据 tag 做 dom 增删改。**

ref 的实现同样是在这个流程里的。

首先，我们 ref 属性肯定是加在原生标签上的，比如 input、div、p 这些，所以只要看 HostComponent 的分支就可以了，HostComponent 就是原生标签。

可以看到处理原生标签的 fiber 节点时，beginWork 里会走到这个分支：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1aa6c6208f4247cea45941da8db21ad1~tplv-k3u1fbpfcp-watermark.image?)

里面调用 markRef 打了个标记：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37a11f6d1ac641aeb1061e6aa47b40b4~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2d287440c934220985a547a5e28d650~tplv-k3u1fbpfcp-watermark.image?)

前面说的 tag 就是指这个 flags。

然后就到了 commit 阶段，开始根据 flags 做不同处理：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ec561b65e82474dbf607b370bdfef80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=902&h=442&s=63704&e=png&b=1f1f1f)

在 layout 阶段，这时候已经操作完 dom 了，就会遍历 fiber 链表，给 HostComponent 设置新的 ref。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2ac4f713d5f47d59e64b633d54ffa26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=1120&s=159337&e=png&b=1f1f1f)
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9ae41c8eb14fe5a23ca047ed82c1d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=866&h=638&s=95094&e=png&b=202020)

ref 的元素就是在 fiber.stateNode 属性上保存的在 render 阶段就创建好了的 dom，：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac13d64aa47d411cae79c8ef2d6a788e~tplv-k3u1fbpfcp-watermark.image?)

这样，在代码里的 ref.current 就能拿到这个元素了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd042d1e45034a6ea9a2de6c3af739c9~tplv-k3u1fbpfcp-watermark.image?)

而且我们可以发现，他只是对 ref.current 做了赋值，并不管你是用 createRef 创建的、useRef 创建的，还是自己创建的一个普通对象。

我们试验一下：
 
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3aad0799478442b82de05b0601a4878~tplv-k3u1fbpfcp-watermark.image?)

我创建了一个普通对象，current 属性依然被赋值为 input 元素。

那我们用 createRef、useRef 的意义是啥呢？

看下源码就知道了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e727f7a63c674c4f9ffb07ca22679a22~tplv-k3u1fbpfcp-watermark.image?)

createRef 也是创建了一个这样的对象，只不过 Object.seal 了，不能增删属性。

用自己创建的对象其实也没啥问题。

那 useRef 呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8b94b8cbea3457fb2e34d679c11e98c~tplv-k3u1fbpfcp-watermark.image?)

useRef 也是一样的，只不过是保存在了 fiber 节点 hook 链表元素的 memoizedState 属性上。

只是保存位置的不同，没啥很大的区别。

同样，用 forwardRef 转发的 ref 也很容易理解，只是保存的位置变了，变成了从父组件传过来的 ref：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d5e6c2358944eaace7b5ade80e4403~tplv-k3u1fbpfcp-watermark.image?)

那 forwardRef 是怎么实现这个 ref 转发的呢？

我们再看下源码：

forwarRef 函数其实就是创建了个专门的 React Element 类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db5b2d1f0e0649b98172788081d1c452~tplv-k3u1fbpfcp-watermark.image?)

然后 beginWork 处理到这个类型的节点会做专门的处理：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90f05216faa2423cbf1011183549a8fe~tplv-k3u1fbpfcp-watermark.image?)

也就是把它的 ref 传递给函数组件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2c4846bc6fc44dbbf41c0465058cca7~tplv-k3u1fbpfcp-watermark.image?)

渲染函数组件的时候专门留了个后门来传第二个参数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b2a9731042a44eba9e1f2aa531b4d5d~tplv-k3u1fbpfcp-watermark.image?)

所以函数组件里就可以拿到 ref 参数了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/217ee953ba334d2ba7eb049bb6271a7d~tplv-k3u1fbpfcp-watermark.image?)

这样就完成了 ref 从父组件到子组件的传递：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94bd90c4a3e345c097d8817b982fea83~tplv-k3u1fbpfcp-watermark.image?)

那 useImperativeHandle 是怎么实现的修改 ref 的值呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/871a01286b2b4545ad1ee5462f0808d4~tplv-k3u1fbpfcp-watermark.image?)

源码里可以看到 useImperativeHandle 底层就是 useEffect，只不过是回调函数是把传入的 ref 和 create 函数给 bind 到 imperativeHandleEffect 这个函数了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/160649ce59234d5a9185d8a008c67690~tplv-k3u1fbpfcp-watermark.image?)

而这个函数里就是更新 ref.current 的逻辑：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26574eefe35f4356966078f31607b5ab~tplv-k3u1fbpfcp-watermark.image?)

我们知道，useEffect 是在 commit 阶段异步调度的，在 layout 更新 dom 之后了，自然可以拿到新的 dom：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0150ee552a2a4dc79acc0fba554e8d70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1290&h=792&s=182072&e=png&b=1f1f1f)

更新了 ref 的值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41f805a1d98d423e8e9a89e6911b14f1~tplv-k3u1fbpfcp-watermark.image?)

这样，useImperativeHandle 就成功修改了 forwardRef 传过来的 ref。

## 总结

我们平时会用到 createRef、useRef、forwardRef、useImperativeHandle 这些 api，而理解它们的原理需要熟悉 react 的运行流程，也就是 render（beginWork、completeWork） + commit（before mutation、mutation、layout）的流程。

**render 阶段处理到原生标签的也就是 HostComponent 类型的时候，如果有 ref 属性会在 fiber.flags 里加一个标记。**

**commit 阶段会在 layout 操作完 dom 后遍历 fiber 链表更新 HostComponent 的 ref，也就是把 fiber.stateNode 赋值给 ref.current。**

**react 并不关心 ref 是哪里创建的，用 createRef、useRef 创建的，或者 forwardRef 传过来的都行，甚至普通对象也可以，createRef、useRef 只是把普通对象 Object.seal 了一下。**

**forwarRef 是创建了单独的 React Element 类型，在 beginWork 处理到它的时候做了特殊处理，也就是把它的 ref 作为第二个参数传递给了函数组件，这就是它 ref 转发的原理。**

**useImperativeHandle 的底层实现就是 useEffect，只不过执行的函数是它指定的，bind 了传入的 ref 和 create 函数，这样在 layout 阶段调用 hook 的 effect 函数的时候就可以更新 ref 了。**

理解了 react 渲染流程之后，很多特性只是其中多一个 switch case 的分支而已，就比如 ref。
