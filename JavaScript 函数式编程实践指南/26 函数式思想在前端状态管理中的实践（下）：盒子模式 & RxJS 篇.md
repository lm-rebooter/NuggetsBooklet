### RxJS 核心思想：响应式编程

#### RxJS 是个啥

RxJS 是一个在 JavaScript 中实现响应式编程的库，它利用可观察序列（**Observable**）来表达异步数据流，并通过一系列的操作符（**Operators**）来对这些数据流进行转换、筛选和组合，最终实现业务逻辑。

> 注：可观察序列（Observable）这个东西我们下文还会展开讲解，这里大家先记住这个名字就可以了。

下面是一个简单的 RxJS 示例代码（基于 RxJS6 编写），展示如何基于可观察序列来实现状态管理：

```js
import { fromEvent } from 'rxjs'
import { map, filter, debounceTime } from 'rxjs/operators'

// 获取输入框 DOM 
const searchInput = document.getElementById('search-input')

// fromEvent可以将一个 DOM 转换为一个可观察的对象（Observable）
const input$ = fromEvent(searchInput, 'input')
  .pipe(
    map(event => event.target.value),
    filter(value => value.length > 2),
    debounceTime(500)
  )

input$.subscribe(value => {
  console.log(`Performing search with query "${value}"...`)
  // 发起异步请求，并更新页面
})
```

> 注：在示例中，变量名以 $ 开头是为了表明这是一个流对象。这是 RxJS 的一种（可选的）命名约定，目的是为了帮开发者在代码中快速识别出这是一个流对象，而不是普通的变量或函数。

上面的代码使用 RxJS 监听了一个输入框的值变化，当输入框的值变化后，我们借助 `map` 操作符将事件对象转换为输入框的值，然后通过 `filter` 操作符过滤掉长度小于等于 2 的输入，最后通过 `debounceTime` 操作符确保用户停止输入一段时间后才会发出值。这样就可以避免在用户快速输入时频繁地执行搜索操作。

通过这个示例，我们可以看到 RxJS 中提供了强大的**操作符**和**工具函数**，使得我们能够非常方便地对数据流进行处理和转换，从而实现响应式的状态管理。

> 注：在 RxJS 中，操作符（**operators**）是用来组合 Observable 的纯函数，用于对 Observable 进行各种转换、过滤、合并等操作。RxJS 中提供了大量的操作符，例如 map、filter、mergeMap、switchMap 等等，楼上我们用到的操作符有 `map`和`filter`。  
而工具函数（**utility functions**）则是一些不依赖于 Observable 的纯函数，用于处理 Observable 发射出来的值。RxJS 中提供了大量的工具函数，例如 tap、delay、timeout 等等。在楼上的示例中，我们用到的工具函数是 `fromEvent`。

#### 从函数式编程到响应式编程

接下来我会试着讨论函数式编程和响应式编程的差异，然后你就会发现，它们~~真的没有什么特别的差异（笑死）~~ 真的是非常相似的两个范式。

尽管两者的共性非常之多（都属于**声明式编程**，都**遵循函数式编程的基本原则**），但差异还是有的，那就是关注点的不同：

函数式编程强调的是**函数的组合和变换**，通过将复杂的问题分解成小的函数，再将这些函数组合起来，达到解决问题的目的。函数式编程中，函数是“一等公民”。

响应式编程强调的是**数据流的变化和响应**，它将复杂的问题抽象成一个数据流，通过对数据流进行变换和响应，达到解决问题的目的。响应式编程中，函数仍然是“一等公民”，但它更强调对“数据流”的关注。

总之一句话：**函数式编程关注函数，响应式编程关注数据流**。

话是这么说没错，但是在我看来，个人实在是不习惯去做响应式编程和函数式编程的辨析——目前业内比较广为接受的一种观点是“**响应式编程是函数式编程的一种扩展和补充**”，这和我个人的观点也是一致的。因此，我们可以把响应式编程视作函数式编程的一个分支流派，**这个流派在函数式思想的基础上，更加强调对数据流的关注**。

### RxJS 对“盒子模式”的运用

作为一本函数式编程小册，这里我给大家介绍 RxJS，当然不全是为了做楼上这种老八股式的概念辨析题。我真正的目的，是为了给大家点出两件非常重要的事情：

1.  **“盒子模式”** 不是花拳绣腿，它真的**是可以用来写生产级别的代码的**
1.  **Monad** 除了可以实现数据转换、可以解决“嵌套盒子”问题，它还可以帮我们【**把副作用放进盒子**】

  


### “盒子模式”生产实践：RxJS 中的 Monad 与 Functor

通过[第 17 节](<https://juejin.cn/book/7173591403639865377/section/7175422979646423098>)-[第 19 节](<https://juejin.cn/book/7173591403639865377/section/7175422691443212348>)的学习，我们已经知道，Functor 是指实现了`map`函数的盒子，而 Monad 则是指实现了`map`和`flatMap`函数的盒子。

**在 RxJS 中，** `Observable` **既是一个 Functor，也是一个 Monad。**

请看下面这段代码（注意，下面代码基于 **RxJS5** 编写，在 RxJS6 中，`flatMap`和`map`仍然存在，但是写法没有 RxJS5 这么直观。为了降低大家的理解成本，这里我选择了使用 RxJS5 来写盒子模式的示例） ：

```js
import Rx from "rxjs"
import { Observable } from "rxjs/Observable"

// observable 是一个 Observable 类型的盒子，它既是 Functor 也是 Monad
const observable = Observable.from([1, 2, 3])

// observable 是一个 Functor，可以调用 Functor 的 map 方法
const mappedBox = observable.map((x) => x * 2)

// observable 是一个 Monad，可以调用 Monad 的 flatMap 方法，把嵌套的 Functor 拍平
const flattenObservable = observable.flatMap((x) => Observable.from([x, x * 2]))

// 可以通过订阅打印出盒子的内容
// 输出：1, 2, 3
observable.subscribe((val) => console.log(val))

// 输出：2, 4, 6
mappedBox.subscribe((val) => console.log(val))

// 输出：1, 2, 2, 4, 3, 6
flattenObservable.subscribe((val) => console.log(val))
```

在这个例子中，我们使用 RxJS 的`from`操作符将一个数组转换成了一个`Observable`类型的盒子：`observable`。由于`Observable`盒子实现了`map`函数，我们可以像使用数组的`map`函数一样，对`observable`进行变换得到一个新的`Observable`盒子。这个过程中，`Observable`充当了 **Functor** 的角色。

`flatMap`**函数则不同于**`map`**函数，它不仅可以进行变换，还可以将嵌套的**`Observable`**结构展平。**

> 还记得我们[第 19 节](<https://juejin.cn/book/7173591403639865377/section/7175422691443212348>)的标题中“嵌套盒子解决方案”这个描述吗？这里就用上啦！

我们通过在 `flatMap`的回调函数中调用 `from`方法，将`observable`中的每个元素从数字转换为了`Observable`盒子（对应示例中的第 11 行代码，如下）：

```js
// observable 是一个 Monad，可以调用 Monad 的 flatMap 方法，把嵌套的 Functor 拍平
const flattenObservable = observable.flatMap((x) => Observable.from([x, x * 2]))
```

由于`observable`本身是一个 `Observable`盒子，这波转换相当于是在盒子里面套了新的盒子。如果我们调用的是`map`而不是`flatMap`，那么映射出来的结果就会是一个嵌套的盒子。像这样：

```js
const nestedObservable = observable.map((x) => Observable.from([x, x * 2]))

console.log("nestedObservable", nestedObservable)
nestedObservable.subscribe((val) => console.log("val is:", val))
```

`nestedObservable` 本身是一个盒子，如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d3a88e2584e4cd4a402d55d10ba1e3b~tplv-k3u1fbpfcp-zoom-1.image)

`nestedObservable` 内部存储的 `val` 也是一系列的盒子，如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44e962408ffd49d487bd4f52590d236c~tplv-k3u1fbpfcp-zoom-1.image)

但我们知道，`flatMap`是可以处理嵌套盒子的场景的。这里使用`flatMap`，就可以将嵌套的双层 `Observable`盒子展开为一个单层的`Observable`对象：

```js
// observable 是一个 Monad，可以调用 Monad 的 flatMap 方法，把嵌套的 Functor 拍平
const flattenObservable = observable.flatMap((x) => Observable.from([x, x * 2]))  

// 输出一个 Observable 盒子
console.log("flattenObservable", flattenObservable)    

// 输出具体的 val 值：1、2、2、4、3、6
flattenObservable.subscribe((val) => console.log("val is:", val))
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74fb4d98fec74a9393de155853af1fe2~tplv-k3u1fbpfcp-zoom-1.image)

如大家所见，由于同时具备 `map`能力和`flatMap`能力，所以 **Observable 盒子既是一个 Functor，也是一个 Monad**。

### Monad 的另一面：把“副作用”放进盒子。

当使用 RxJS 时，我们经常会遇到需要在异步数据流中执行副作用的情况，这时 RxJS 就会使用 Monad 来处理这些副作用。这里也就引出了 Monad 的“另一面”：**把“副作用”放进盒子——我们可以将具有副作用的操作封装在 Monad 中，以便于隔离其它函数对副作用的关注。**

请大家看这样一个例子（仍然是基于 RxJS5 的）：

```js
import Rx from "rxjs"
import { Observable } from "rxjs/Observable"

// 这里我用 setTimeout 模拟一个网络请求
function fetchData() {
  return Observable.create((observer) => {
    setTimeout(() => {
      observer.next("data")
      observer.complete()
    }, 1000)
  })
}

// 处理数据的纯函数
function processData(data) {
  return data.toUpperCase()
}

// 使用副作用放进盒子的方式处理网络请求
const boxedData = Observable.of(null).flatMap(() => fetchData())

// 订阅处理结果
boxedData.map(processData).subscribe((data) => {
  console.log(data) // 输出 "DATA"
})
```

在上面的例子中，我们将网络请求这个副作用包裹在一个 `Observable` 盒子中（上面已经分析过，`Observable` 盒子是一个 Monad），并将盒子的执行结果作为一个值“发射”出去，这个值可以被后续的`map()`操作消费和处理。**这个过程中，** `Observable` **就是一个专门用来消化副作用的盒子——它将异步操作封装在内部，防止了副作用的外泄。**

这样做有什么好处呢？我们可以注意到，`processData()` 是一个**纯函数**，它负责将传入的数据转换成大写字母，没有任何副作用。我们将 `processData()` 函数传递给 `map()` 方法，`map()`方法就会在原有的 Observable 盒子的每个值上调用这个纯函数，并将处理结果放到新的 Observable 盒子中——**这整个过程都是纯的**。

大家细品一下这个过程：在整个 `boxData`盒子的调用链中，`boxData`本身作为一个 Monad 盒子，它是不纯的；末尾的 `subscribe()`函数涉及到了在控制台输出数据，它也是不纯的。但**夹在这两者中间的所有** ` map()`**调用都是纯的**。

也就是说，这种模式能够帮助我们**把纯函数和副作用分离开来，保证盒子和** ` subscribe()`**回调之间的所有逻辑的纯度**。此外，使用 Monad 封装副作用，也可以使代码更加模块化，可维护性更高。

### 更进一步：【函数管道】将生产端-消费端分离

在 RxJS 中，`Observable` 负责生产数据，而 `Observer` 负责消费数据。

在楼上的例子中，`boxedData` 是一个生产数据的 `Observable`，而 `subscribe` 方法所传入的回调函数则是消费数据的 `Observer`。

`Observable`（生产端）和 `Observer`（消费端）都可能涉及副作用，例如异步请求、打印日志等等。因此它们都是**不纯**的。

但是，**那些夹在** `Observable` **和** `Observer` **之间的操作，例如** `map` **、** `filter` **、** `merge` **等等，这些操作专注于数据的计算，并不关心数据的来源和去处、不涉及外部环境**，因此它们总是纯的。

这也就是说，**RxJS 背靠函数式编程的思想，在** `Observable` **和** `Observer` **之间架起了一条“函数管道”** 。生产端 `Observable` 将数据“发射”出去后，数据首先会经过这条“**管道**”，在“**管道**”中完成所有的计算工作后，才会抵达消费端 `Observer`。

对于 RxJS 来说，想和外界发生交互，只能通过管道的首尾两端（也即生产端、消费端）。管道内部是由纯函数组成的，这就保证了整个计算过程的可靠性和可预测性。同时，通过这条“管道”，**生产端** `Observable` **和消费端** `Observer` **被有效地分离，实现了高度的解耦**。

  


## 小结

通过这两节的学习，相信大家不仅能够切身感受到 FP 思想对于前端状态管理这个细分领域的影响之深，也会对 FP 三大特征中“**拥抱纯函数，隔离副作用**”这一点有更深的感悟。

我们在小册[第 4 节](<https://juejin.cn/book/7173591403639865377/section/7175420951075504188>)曾经强调过，“**副作用不是毒药**”：

> 对于我们程序员来说，实践纯函数的目的并不是消灭副作用，而是将计算逻辑与副作用做合理的分层解耦，从而提升我们的编码质量和执行效率。   ——本册第 4 节

Monad 将副作用放进盒子这个模式，正是基于这一思想衍生出来的。RxJS 借助 Monad 将副作用放进 Observable 盒子中、将计算逻辑和副作用进行了分层，更是为我们做了一个绝佳的示范。

但这一模式并不是 RxJS 的专利——作为一个成熟的函数式模式，它在程序世界的应用是非常广泛的：比如 Haskell 中的 IO Monad、Scala 中的 Future Monad、Clojure 中的 Monadic I/O library 以及 Rust 中的 futures-rs 库等等......以这些语言和库为代表的生产级的 Monad 实现，也都会践行用 Monad 来隔离副作用的模式。