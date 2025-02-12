$\color{LightPink}{保姆式教学の}\color{Pink}{温情提示：}$    

徒手编码 compose/pipe，是当下前端面试考察函数式编程的最通用、最高频 code test 题目。

任何涉及到“函数”、“组合”、“串联”、“管道”等字眼的面试题，多少都需要大家往这方面联想一下。

相关的提问姿势包括但不限于：

“如何 pipe 一系列的指定函数？”

“函数组合（compose）是一个什么样的过程？”

“rambda（或者任何一个函数式编程库）中的 compose/pipe 是如何实现的？”

“Redux 中间件是如何串联的？”

等等等等.......

不夸张地说，这是一门背也要背下来的学问。

它至少可以帮你向面试官证明，你真的能够实战函数式编程，而不是只会记忆几个 lodash-fp 或 React Hook 的 API。

如果你的时间有限，不允许你细嚼慢咽整本小册覆盖的所有知识点，请你至少把握住这一节——在面试场景下，它将助你摆脱“函数式小白”的标签。

## 借助 reduce 推导函数组合

事已至此，让我们重新审视一遍 reduce 的工作流示意：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c2577e6fee64879b03dce5b053a3ddf~tplv-k3u1fbpfcp-zoom-1.image)

在[第12节](https://juejin.cn/book/7173591403639865377/section/7175422666629709884)的末尾，我曾经这样疯狂暗示了大家一波：

> 咱就是说，有没有可能，有没有可能咱们把 pipeline 里的每一个函数也弄成不一样的呢？

> 更直白地说，你`  reduce()  `既然都能组合参数了，你能不能帮我的 pipeline 组合一下函数呢？

> 毕竟，JS 的函数是可以作为参数传递的嘛！

  


一旦我们能做到这一点——一旦我们可以把 reduce pipeline 里的最小计算单元修改成任意不同的函数，那么这个工作流就会变成下面这样了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d0eed4a85a54046b0c8ee9e7ef679ed~tplv-k3u1fbpfcp-zoom-1.image)

这个流程，恰恰就是一个函数组合的 pipeline。

也就是说，只要我们能够想办法**让 reduce 工作流里的计算单元从一个函数转变为 N 个函数**，我们**就可以达到函数组合的目的**。

  


大家知道，在整个 reduce 的工作流中，callback 是锁死的，但每次调用 callback 时传入的参数是动态可变的（如下图）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad5509a0c9e04d8f8cc7a417ccb19ccc~tplv-k3u1fbpfcp-zoom-1.image)

这些动态可变的参数，来自 reduce 的宿主数组。

之前介绍 reduce 时，我们用了一个塞满数字的数组作为示例。

但其实，数组的元素可以是任何类型——包括**函数**类型。

我们把**待组合的函数放进一个数组里，然后调用这个函数数组的 reduce 方法**，就可以创建一个多个函数组成的工作流。

而这，正是市面上主流的函数式库实现 compose/pipe 函数的思路。

## 借助 reduce 推导 pipe

顺着这个思路，我们来考虑这样一个函数数组：

```js
const funcs = [func1, func2, func3]
```

我们假设三个 func 均是用于数学计算的函数，整个工作流的任务就是吃进一个数字 0 作为入参、吐出一个计算结果作为出参。

我想要逐步地组合调用 funcs 数组里的函数，得到一个这样的声明式数据流：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae9a8c25da8e44fcab4ab393e40a6a49~tplv-k3u1fbpfcp-zoom-1.image)

如果我借助了 reduce，我得到的数据流乍一看和楼上是有出入的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc6e25ab292b433389d99280058d169b~tplv-k3u1fbpfcp-zoom-1.image)

如何通过调整 reduce 的调用，使它的工作流和声明式数据流看齐呢？

首先是入参的对齐，这个比较简单，我们只需要把 initialValue 设定为 0 就可以了。

入参明确后，我的 reduce 调用长这样：

```js
const funcs = [func1, func2, func3]  

funs.reduce(callback, 0)
```

接下来重点在于 callback 怎么实现。其实我们只需要把楼上两张图放在一起做个对比，答案就呼之欲出了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71658f7803864aa999f8e33370b5e93f~tplv-k3u1fbpfcp-zoom-1.image)

图中我用红笔对 reduce 流程做了拆分，用蓝笔对目标数据流做了拆分。

想要让上下两个流程等价，我们只需要确保红蓝两个圈圈的工作内容总是等价就可以了。

从第一对红蓝圈圈开始看起，蓝色圈圈的工作内容是 func1(0)，红色圈圈的工作内容是 callback(0, func1)。

两者等价，意味着 callback(0, func1) = func1(0)。

同理，我们可以逐步推导出第二个、第三个红色圈圈的工作内容，分别应该满足：

callback(value1, func2) = func2(value1)

callback(value2, func3) = func3(value2)

以此类推，对于任意的入参 (input, func），callback 都应该满足：

callback(input, func) = func(input)

推导至此，我们就得到了 callback 的实现：

```js
function callback(input, func) {
  func(input)
}  

funcs.reduce(callback,0)
```

再稍微包装一下，给这坨逻辑起一个新名字：

```js
function pipe(funcs) {
  function callback(input, func) {
    return func(input)
  }  

  return function(param) {
    return funcs.reduce(callback,param)
  }
}
```

我们就得到了一个经典的 pipe 函数。

## 验证 pipe：串联数字计算逻辑

长得帅的同学想必都还记得这三个函数：

```js
function add4(num) {
  return num + 4
}  

function multiply3(num) {
  return num*3
}  

function divide2(num) {
  return num/2
}
```

问：如何基于这些独立函数，构建一个多个函数串行执行的工作流？

现在有了 pipe，我们可以轻松达到这个目的。只需要把这些函数放进一个数组里，再把数组放进 pipe 里：

```js
const compute = pipe([add4, multiply3, divide2])
```

如此，我们便能够得到一个 compute 的函数，该函数正是 add4, multiply3, divide2 这三个函数的“合体”版本。

接下来直接调用 compute() 函数，就可以开动“传送带”，得到目标的计算结果了：

```js
// 输出 21
console.log(compute(10))
```

美中不足的是手动构造数组有点麻烦，我们可以直接使用展开符来获取数组格式的 pipe 参数：

```js
// 使用展开符来获取数组格式的 pipe 参数
function pipe(...funcs) {
  function callback(input, func) {
    return func(input)
  }  

  return function(param) {
    return funcs.reduce(callback,param)
  }
}
```

由此我们就可以向 pipe 传入任意多的函数，组合任意长的函数工作流了：

```js
const funcFlow = pipe(method1, method2, method3, method4,...., methodN)
```

  


至此，我们便实现了一个通用的 pipe 函数。

## compose：倒序的 pipe

pipe 用于创建一个正序的函数传送带，而 compose 则用于创建一个倒序的函数传送带。

我们把 pipe 函数里的 reduce 替换为 reduceRight，就能够得到一个 compose：

```js
// 使用展开符来获取数组格式的 pipe 参数
function compose(...funcs) {
  function callback(input, func) {
    return func(input)
  }  

  return function(param) {
    return funcs.reduceRight(callback,param)
  }
}
```

使用 compose 创建同样的一个函数工作流，我们需要把入参倒序传递，如下：

```js
const compute = compose(divide2, multiply3, add4)
```

组合后的流水线顺序，和传参的顺序是相反的。也就是说执行 compute 时，函数的执行顺序是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/361ab5f915a446db8db433f60996bd92~tplv-k3u1fbpfcp-zoom-1.image)

**正序是 pipe，倒序是 compose。**

  


pipe 和 compose 的辨析，本身也是一个热门的考察点。在面试场景下，大家一定要听清楚面试官的要求，写代码前先确认需求是【**Pipe-->** 】一系列函数还是【**Compose<--**】一系列函数。

> 作者注：为什么 pipe 是正序，compose 是倒序？关于这个问题，我们在 [第17节](https://juejin.cn/book/7173591403639865377/section/7175422979646423098)还有更进一步的讨论，感兴趣的同学可以关注第17节的“复合运算：范畴论在编程中最核心的应用”这个section
  


## 知其所以然：Why Compose?

面向对象的核心在于继承，而**函数式编程的核心则在于组合**。

我们常说函数式编程就像一个乐高游戏：那一个个独立内聚的函数就像一堆乐高积木方块儿。它们看似渺小到无足轻重，却可以在**组合**后变幻出千百种形态、最终呈现出复杂而强大的功能。

组合这个动词，赋予了函数式编程无限的想象力和可能性。

在函数式编程的实践中，我们正是**借助 compose 来组合多个函数的功能**，它**是函数式编程中最有代表性的一个工具函数**，所以它才会成为面试题中的常客。

在编码层面，如果不喜欢 reduce，你还可以借助循环、递归等姿势来实现 compose。

这里我选取了 reduce，一方面是因为它足够主流（市面流行的函数式编程库 ramda 也采取了基于 reduce 的实现），另一方面也是因为它足够巧妙。

巧妙到什么程度呢？结合个人的经验来看，在实际的编码和面试中，基于 reduce 的 compose 几乎是理解成本最高、同时也是许多同学避之不及的一个版本。

许多能力是可以向下兼容的，包括 compose 的实现。

我相信对多数同学来说，读懂一段循环代码或者递归代码都不会是特别难的事情。

然而，如果你之前没有刻意练习过从 reduce 到 compose 的推导过程，那么第一次见到类似代码的时候，即便能够勉强理解代码的意图，也未必能够灵机一动把眼前的 reduce 调用和函数组合联系起来。

但经过了近几节的学习，相信大家早已对 reduce 刮目相看了。

当你再次在别人写的代码中见到 reduce 时，脑海中闪现的关键字除了“数组、斐波那契”等等之外，不要忘了还有“**函数组合**”。   
  
   （阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）