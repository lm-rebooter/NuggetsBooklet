## 前言

> `reduce()`**是函数式语言的万金油；函数式语言不能失去** `reduce()`**，就像西方不能失去耶路撒冷。**             ——修·格拉底·鲁迅·言思妥耶夫斯基

有一类高阶函数，我们几乎天天都在用，但却不曾真正了解过它们。

没错，我说的就是数组方法，包括但不限于 `map()`、`reduce()`、`filter()` 等等等等.....

其中，最特别的一个是 `reduce()`。

几乎任何在范式上支持了函数式编程的语言，都原生支持了 `reduce()`。

这些语言包括但不限于Python、Scala、Clojure、Perl......（Haskell 语言其实也是支持 reduce 的，只是 Haskell 里的 reduce 改名叫 fold 了）。

**在 JS 中，基于 reduce()，我们不仅能够推导出其它数组方法，更能够推导出经典的函数组合过程。**

## 前置知识：Reduce 工作流分析

接下来我们先通过一个小🌰快速分析一波 reduce 的工作流特征。

```js
const arr = [1, 2, 3]

// 0 + 1 + 2 + 3 
const initialValue = 0  
const add = (previousValue, currentValue) => previousValue + currentValue
const sumArr = arr.reduce(
  add,
  initialValue
)

console.log(sumArr)
// expected output: 6
```

众所周知，`reduce()`是一个高阶函数，它的第一个入参是回调函数，第二个入参是初始值。

`Array.prototype.reduce()`调用发生后，它会逐步将数组中的每个元素作为回调函数的入参传入，并且将每一步的计算结果汇总到最终的单个返回值里去。

以楼上的 case 为例，它的工作流是这样的：

1.  执行回调函数 `add()`，入参为`(initialValue, arr[0])`。这一步的计算结果为记为 `sum0`，`sum0=intialValue + arr[0]`，此时剩余待遍历的数组内容为`[2, 3]`，待遍历元素2个。
1.  执行回调函数 `add()`，入参为 `(sum0, arr[1])`。这一步的计算结果记为 `sum1`，`sum1 = sum0 + arr[1]`，此时剩余待遍历的数组内容为 `[3]` ，待遍历元素1个。
1.  执行回调函数 `add()`，入参为`  (sum1, arr[2])`，这一步的计算结果记为 `sum2`，`sum2 = sum1 + arr[2]`，此时数组中剩余待遍历的元素是 `[]`，遍历结束。
1.  输出 `sum2` 作为 `reduce()` 的执行结果， sum2 是一个单一的值。

  


这个过程本质上是一个循环调用`add()`函数的过程，上一次 `add()`函数调用的输出，会成为下一次 `add()`函数调用的输入（如下图所示）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bdec6d68aa84d8c808fe99c4c18198e~tplv-k3u1fbpfcp-zoom-1.image)

这个调用链看上去好像有点东西，但暂时又看不出太多。为了能够挖掘出更多东西，咱们先去看看 `map()`。

## 小试牛刀：用 `reduce()` 推导 `map()`

### Map 工作流分析

没错，用 `reduce()`是可以推导 `map()`的。至于怎么推，我们先分析了 `map()` 的工作流再说。

众所周知， `map()` 长这样，它看上去和 `reduce()`没有一毛钱关系：

```js
const arr = [1,2,3]  

const add1 = (num)=> num+1
// newArr: [2, 3, 4]
const newArr = arr.map(add1)    
```

对比 `newArr` 和 `arr`，我们可以看到它们之间的不等关系：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/397d2d72192747ebacca4a1fa201e626~tplv-k3u1fbpfcp-zoom-1.image)

这说明 `newArr` 是一个新创建出来的数组——`map()` 方法不会改变原有的 `arr` 数组，而是会把结果放在一个新创建出来的数组里返回，这符合我们对不可变数据的预期。

（不可变数据是函数式编程里最基本的原则之一，我们前面强调过太多次了，这里不再反复吹它。）

我们重点要看的是 map 函数都做了啥：

> **map()** 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
—— MDN

就这个例子来说，`map()` 遍历了 `arr` 数组中的每一个元素，给每一个元素执行一遍 `add1()` 这个 callback 后，把执行结果放在一个新的数组里返回。

我把这个过程用代码表达出来，看上去会更清晰：

```js
const map = (arr, callback) => {
  const len = arr.length  
  // 创建一个新数组用来承接计算结果
  const newArr = []
  // 遍历原有数组中的每一个元素
  for(let i=0; i<len; i++) {  
    // 逐个对每个元素做 callback 计算，
    newArr.push(callback(arr[i]))
  }
  return newArr
}
```

大家可以试着在控制台用这个手工 map 跑一遍楼上的 `add1()` 回调：

```
map([1,2,3], (num)=> num+1)
```

输出结果为`[2, 3, 4]`，这和原生 `map()`是一毛一样的。

PS：这里倒不需要大家去细抠 ` Array.prototype.map()  `的源码，因为：

1.  `Array.prototype.map()` 的源码实现跟楼上的人工 `map()`不一样，我抠过了
1.  我们的目的是理解 `map()` 做了哪些事情，理解它的工作流，而不是了解它每一行的代码实现细节
1.  对`map()` 工作流的分析仅仅是我们进一步认识 `reduce()`的一个小道具，接下来我们需要迅速带着对 ` map()  `的理解去看 `reduce()`  


### Map 其实是 MapReduce

在 `add1()` 这个 case 里，整个`map()` 的计算过程共有以下要素参加：

1.  `arr` 数组里的所有数字。
1.  `newArr`，它最初是一个空数组 `[]`，在循环体中被反复 `push()`。

我们把每次循环列出来看：

1.  初始化状态，`newArr = []`，剩余待遍历的数组内容为`  [1,2,3] `，待遍历元素3个。
1.  计算 `callback(arr[0])`，把计算结果推入 `newArr`。此时 `newArr = [2]`，剩余待遍历的数组内容为`  [2, 3] `，待遍历元素2个。
1.  计算 `callback(arr[1])`，把计算结果推入 `newArr`。此时 `newArr= [2, 3]`，剩余待遍历的数组内容为 [3] ，待遍历元素1个。
1.  计算 `callback[arr[2]]`，把计算结果推入 `newArr`，此时 `newArr= [2, 3, 4]`，剩余待遍历的数组内容为 `[]`，待遍历元素0个。
1.  输出 `newArr` 作为 `map()` 的执行结果， `newArr` 是一个单一的值（一个单一的数组）。

大家细品一下这个过程，你是不是开始隐约觉得它和楼上的 `reduce()`好像有点神似——它们都吃进【多个】入参、吐出【一个】出参。

（注意这个入参和出参之间的数量关系，这个很重要，在下文会有更进一步的分析）。

不同点仅仅在于出参的类型：reduce 编码示例中的出参是一个数字 `6`，而 map 编码示例中的出参是一个数组`[2, 3, 4]`。

但出参类型的不同，其实是由 callback 的不同导致的，而不是由流程上的差异导致的。

**有没有可能，我微调一下** `reduce()`**的 callback，它的输出就和** `map()`**一致了呢？**

### 用 `reduce()` 推导 `map()`

  


具体来说，我们可以把 `map()` 编码示例中的 `add1()`回调逻辑和 `newArr.push()` 这个动作看做是同一坨逻辑，给它起名叫 `add1AndPush()`。

```js
function add1AndPush(previousValue, currentValue) {
  // previousValue 是一个数组
  previousValue.push(currentValue + 1)
  return previousValue
}
```

然后我用 `reduce()` 去调用这个 `add1AndPush()`：

```js
const arr = [1,2,3]
const newArray = arr.reduce(add1AndPush, [])
```

你会发现，这段代码的工作内容和楼上我们刚分析过的 `map()` 是等价的。

把这段代码丢到控制台里运行一下，它的输出结果和楼上的 `map()` 也是等价的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46c25899056444d49b04eec7818a252d~tplv-k3u1fbpfcp-zoom-1.image)

看来我只要微调一下 `reduce()` 的 callback，它就能干`  map() ` 的活了！

大家可以试着在脑海中绘制一下，` reduce(add1AndPush, []) `这个过程对应的函数调用链，它长这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a5e308c75794c02941dfacebd0325cf~tplv-k3u1fbpfcp-zoom-1.image)如图，我们的 `map()`函数背后，是一个多么标准的`reduce()`工作流啊！

### Map 和 Reduce 之间的逻辑关系

破案了，`map()` 的过程本质上也是一个 `reduce()`的过程！

区别仅仅在于， `reduce()` 本体的回调函数入参可以是任何值，出参也可以是任何值；而 map 则是一个相对特殊的 ` reduce()  `,它锁定了一个数组作为每次回调的第一个入参，并且限定了 `reduce()` 的返回结果只能是数组。

`map()` 和`reduce()`，这两个工具函数的应用非常广泛，不仅仅在 JS 中有内置的实现，在许多函数式编程语言中，你都可以看到它们的身影。

在这些语言底层的源码中， 是否真的是直接借助 `reduce()` 调用来实现 `map()`，这个不好说，咱也不必太关注。

我们真正需要关注的，**是** ` map()`**和** ` reduce()`**之间的逻辑关系**。

通过楼上一系列的工作流拆解+逻辑分析，我们至少可以确定，`map()` 过程可以看作是 `reduce()` 过程的一种特殊的应用。

也就是说，在数组方法里，`reduce()` 处在逻辑链相对底层的位置，这一点毋庸置疑。

理解到这一层，大家也就能初步认识到 `reduce()` 函数的重要性了。

“初步认识”绝对是不够的，`reduce()` 方法真正的威力，远远不止于此。

` reduce()`**真正的威力，在于它对函数组合思想的映射。**

****

## 更进一步： `reduce()` 映射了函数组合思想

现在请大家重新审视一下 `reduce()` 的工作流：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd3b69f006824035ac674303fe2c0feb~tplv-k3u1fbpfcp-zoom-1.image)

通过观察这个工作流，我们可以发现这样两个特征：

-   `reduce()` 的回调函数在做参数组合
-   `reduce()` 过程构建了一个函数 pipeline

### `reduce()` 的回调函数在做参数组合

首先，就 reduce() 过程中的单个步骤来说，每一次回调执行，都会吃进 2 个参数，吐出 1 个结果。

我们可以把每一次的调用看做是把 2 个入参被【**组合**】进了 callback 函数里，最后转化出 1 个出参的过程。

我们把数组中的 n 个元素看做 n 个参数，那么 `reduce()` 的过程，就是一个把 n 个参数逐步【**组合**】到一起，最终吐出 1 个结果的过程。

上文讨论过的 `reduce(add)` 和 `reduce(add1AndPush)` 均能够体现这个特征：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccc3554f1f1245c5bdaa8d3647411b90~tplv-k3u1fbpfcp-zoom-1.image)

reduce，动词，意为减少。这个【减少】可以理解为是参数个数的减少。

如上图所示，reduce 方法把多个入参，reduce（减少）为一个出参 。

### `reduce()` 过程是一个函数 pipeline

`reduce()` 函数发起的工作流，可以看作是一个函数 pipeline。

尽管每次调用的都是同一个函数，但上一个函数的输出，总是会成为下一个函数的输入。

同时，`reduce()` pipeline 里的每一个任务都是一样的，仅仅是入参不同，这极大地约束了 pipeline 的能力。 如下图，整个 `reduce(add)` pipeline 中只有 `add()` 这一种行为。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7974874fe6f54566a6f42b29051d3801~tplv-k3u1fbpfcp-zoom-1.image)

这就好像你开了一家水果加工厂，厂里拉出来了一条流水线，这流水线里的每一道工序都是一样的，就只会做“水果切块”，不会整别的了。

难道哪天我想做果汁了，我还得拉个新的流水线出来，专门做水果榨汁吗？

这、这是不是有点浪费？

我们把 `reduce()` 的这两个特征放在一起来看：**参数组合+函数pipeline**。

咱就是说，有没有可能，有没有可能咱们把 pipeline 里的每一个函数也弄成不一样的呢？

更直白地说，你`reduce()`既然都能组合参数了，你能不能帮我的 pipeline 组合一下函数呢？

毕竟，**JS 的函数是可以作为参数传递**的嘛！

答案是肯定的——可能，可太能了！

`reduce()` 之所以能够作为函数式编程的“万金油”存在，本质上就是因为它映射了函数组合的思想。

而函数组合，恰恰是函数式编程中最特别、最关键的实践方法，是核心中的核心，堪称“核中核”。

那么函数组合到底是什么？它在实践中的形态是什么样的？我们又该如何借助`reduce()`来实现函数组合呢？

在展开讨论这些问题之前，咱首先得去到下一节，整明白“声明式的数据流”是啥。  
 
   （阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）