## JS Functor 中的“顶流”——Array

按照上一节我们对 Functor 的定义，Array 其实也属于是 Functor，它也是一种实现了 map 方法的数据结构。

常见的 Array.prototype.map 调用如下：

```js
const fruits = ['apple', 'orange', 'banana', 'papaya']   

const fruitsWithSugar = fruits.map((fruit)=> `Super Sweet ${fruit}`)
```

这里我定义了一个 fruits 数组，数组这个数据结构就可以被看作是一个盒子。

就这个盒子来说，它盛放的数据是一套水果名称的集合。与此同时，它还实现了 map 方法。整体的结构如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b77c699e8dd646ff9d0a592e22dc1aec~tplv-k3u1fbpfcp-zoom-1.image)

  


通过调用 map 方法，我们可以将盒子盛放的源数据映射为一套新的数据，并且新的数据也盛放在 Array 盒子里。

整个过程如下图，这同样是一个藉由 map 方法创造新“盒子”的过程。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58720708a08f494a8dbcfa647884b6cc~tplv-k3u1fbpfcp-zoom-1.image)

## “Box”又名 Identity Functor

在本册中，我们认识的第一个 Functor 其实是上一节中实现的 Box（代码如下），而不是 Array。

```js
const Box = x => ({
  map: f => Box(f(x)),
  valueOf: () => x
})
```

这个 Box 其实是一种最简单的 Functor 。在这个 Functor 的 map 里，除了“执行回调f”之外，没有任何其他逻辑。

它的存在有点像60年代登场的初代奥特曼，外形很朴素、招式很简单，但是具备了一个奥特曼应该有的所有要素。

后续出现的中生代。新生代奥特曼等等，都要以它为蓝本制作——它本身就可以被视作是一种“标准”。

也正因为如此，我把 Box 放在了这个系列的开篇——对于刚入门范畴论设计模式的同学来说，它是一个绝佳的起手式。

这个 Box 还有一个学名，叫做 “Identity Functor”。

```js
const Identity = x => ({
  map: f => Identity(f(x)),
  valueOf: () => x
})
```

为了标识 Functor 的类别，我们可以给它补充一个 inspect 函数：

```js
const Identity = x => ({
  map: f => Identity(f(x)),
  valueOf: () => x,
  inspect: () => `Identity {${x}}`
})
```

没错，Functor 世界里，也是有“类别”一说的。**同一类 Functor，往往具有相同的 map 行为**。

通过往 map 行为里“加料”，我们就可以制作出不同的 Functor。

在本节，除了 Identity Functor 以外，我们还将探讨 Maybe Functor。

  


## Maybe Functor：识别空数据

### Maybe Functor 如何编码

Maybe Functor 在 Identity Functor 的基础上，增加了对空数据的校验。

在细说 Maybe Functor 之前，我们先来看它的代码：

```js
const isEmpty = x => x === undefined || x === null  

const Maybe = x => ({
  map: f => isEmpty(x) ? Maybe(null) : Maybe(f(x)),  
  valueOf: () => x,  
  inspect: () => `Maybe {${x}}`
})
```

我们看到，Maybe Functor 在执行回调函数 f 之前，会先执行校验函数 isEmpty。

如果入参 x 为空（undefined 或者 null），那么 isEmpty 就会返回 true，接下来 map 方法就不会再执行 f 函数的，而是直接返回一个空的 Maybe 盒子。

对于这个空的 Maybe 盒子来说，既然它盛放的数据是 null，那么无论我以什么样的姿势调用它的 map 方法，也都只能得到一个新的 Maybe(null) 而已。

### Maybe Functor 是如何工作的

举个例子，大家看下面这个 Maybe 调用链：

```js
function add4(x) {
  return x + 4
}  

function add8(x) {
  x + 8
}

function toString(x) {
  return x.toString()
}  

function addX(x) {
  return x + 'X'
}  

function add10(x) {
  return x + '10'
}

const res = Maybe(10)
              .map(add4)
              .map(add8)
              .map(toString)
              .map(addX)  
              .inspect()

// 输出 Maybe {null}
console.log(res)
```

  


在这个调用链中，我分别组合了以下函数：

```js
[add4, add8, toString, addX]
```

其中 add8 这个函数是有问题的，我在定义它的时候，手滑了，没有写 return。

这就会导致 add8 在任何情况下都会输出 `undefined`。

也就是说，当执行到 map(add8) 这一行的时候，`Maybe(null)` 已经出现了。

而 `Maybe(null)`相当于是一个“终结者”，只要它一出现，就掐灭了后续所有 map 调用的可能性——这些 map 都只会返回 `Maybe(null)`而已。

  


### 为什么我们需要 Maybe Functor

试想，如果我们选择的盒子不是 Maybe Functor，而是 Identity Functor，彼时的调用链将会是一个什么样的光景呢？

这里我以身试法，让控制台来告诉大家答案：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28d50bb3f7c14fbb874c88a1d83d40dc~tplv-k3u1fbpfcp-zoom-1.image)

没错，报错是必然的。因为 add8 返回的 undefined 畅通无阻地走进了 toString 的逻辑里，toString 将会尝试去调用 undefined 上的 toString 方法，这显然是违法的。

在 JS 里，一旦 throw Error，就意味着整个程序 crash 了。除了当前的函数调用链被终止外，程序后续的其它逻辑也无法再运行了。

而 Maybe Functor 则能够把这个错误控制在组合链的内部。

这就好像我们开车从杭州出发，走高速去上海团建。

赶上饭点，又不想下高速，就直接在车里吃点KFC疯狂星期四解决了。

如果我把吃剩下的汉堡、饮料罐子等东西直接丢出车窗，等待我的将是交警的罚单，相当于我把“异常”丢到外面（高速上）去了，这是对外部环境的污染，是一种副作用。

万一我的垃圾不小心砸中了哪个司机，可能就引发连环车祸了，这条高速也就瘫痪了。

更好的做法，是我把垃圾揣到怀里，等下了高速后，找个垃圾桶“输出”一下。

Maybe 就仿佛是交警叔叔那无形的手，它能够控制乘客们把垃圾保留在车厢内部，不到行车终点，绝不乱丢垃圾。

  


## 拓展：Functor 的“生存法则”

最后， 我想补充一些 Functor 的数学背景，也即“生存法则”。

一个合法的 Functor 需要满足以下条件：

1.  恒等性（Identity）
1.  可组合性（Composition）

  


### 恒等性

所谓“恒等性”，是说如果我们传递了一个恒等函数（Identity Function ）到盒子的 map 方法里，map 方法创建出的新盒子应该和原来的盒子等价。

“恒等函数”长这样：

```js
const identity = x => x
```

  


以 Array 为例，我们试着在 Array 的 map 方法里传入 identity：

```js
const originArr = [1, 2, 3]  

const identityArr = originArr.map(x=>x)  

// 输出 [1, 2, 3]  
console.log(identityArr)
```

可见，将恒等函数传入 map 后，最终的映射结果 identityArr 和源数据 originArr 是等价的。

感兴趣的同学也可以在 Identity Functor 上验证一下这个规则，结果也是没有悬念的，这里我就不多赘述了。我们继续解读这条规则本身。

这条规则的目的有二：

其一，是为了确保你的 map 方法具备“创造一个新的盒子（Functor）”的能力。

决定一个接口是否“配”做 map 的并不是它的名字，而是它的行为。

（否则，岂不是随便写个函数，只要给它命名叫 map，它所在的容器就叫 Functor 了？ ）

而 map 接口对应的行为，就应该是**映射**——把数据从一个盒子映射到另一个盒子里去。

其二，是为了确保你的 map 方法足够“干净”。

说到底，map 方法只是一个行为框架，尽管不同的 Functor 会往 map 方法里加不同的料，但这些“料”都不能改变其“行为框架”的本质。

所谓“行为框架”，就意味着 map 方法的主要作用是串联不同的行为（函数），而不是编辑这些行为。

恒等性可以确保 map 方法本身是没有“小动作”的。

### 可组合性

可组合性可以直接用一行代码来解释：

```js
Functor.map(x => f(g(x))) = Functor.map(g).map(f)
```

这个就比较直观了，它要求 Functor 能够将嵌套的函数拆解为平行的链式调用。

这一点我们其实已经验证麻了，要不咱怎么说“盒子模式”是函数组合的另一种解法呢？

## Functor，黑盒般强大的组合姿势

初识盒子模式的时候，咱就说过，这神秘兮兮的“范畴论”，无非也只是我们解决函数组合问题的一个工具而已。

当时，我还问过大家另一个问题：**这个 Functor 到底能干啥？难道只是 compose 的另一种姿势而已吗？**

眼见为实，通过本节的学习，相信大家都能切身感受到：“盒子模式”的存在，绝不仅仅是换个姿势实现 compose/pipe 这么简单。

通过往盒子里“加料”，我们可以在实现组合的同时，内化掉类似空态识别这样的逻辑。

从“面子”上看，Functor 为我们提供了更加强大的组合能力。

从“里子”上来说，**Functor 在实现函数组合的基础上，确保了副作用的可控**。

而这，也正是“盒子模式”的价值所在。

 （阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）