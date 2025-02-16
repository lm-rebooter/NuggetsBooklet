书接上回，我们已经知道，通过往 map 方法里“加料”，我们可以拓展 Functor 的能力，进而定制出不同类型的 Functor。

事实上，除了往 map 方法里“加料”以外，我们还有另一种拓展 Functor 的思路，那就是**在保有 map 方法的基础上，往盒子里添加新的方法**。

而 Monad，正是在这个思路上衍生出来的。

  


## 何为 Monad？

Monad 中文叫做“单子”，它是一种特殊的 Functor（函子）。

通过前面两节的学习，我们已经知道， Functor 是“一个实现了 map 方法的盒子”。

而 Monad，则是“一个实现了 flatMap 方法的 Functor”。

也就是说，**Monad 是一个同时实现了 map 方法和 flatMap 方法的盒子**。

这个 flatMap 又是何方神圣呢？

要理解 flatMap，我们首先要理解 Monad 的应用背景——“嵌套盒子”问题。

## “嵌套盒子”问题

嵌套的盒子，这里指的是在 Functor 内部嵌套 Functor 的情况。

会导致嵌套 Functor 的场景有很多，这里我举两个比较典型的 case：

-   线性计算场景下的嵌套 Functor —— Functor 作为另一个 Functor 的计算中间态出现
-   非线性计算场景下的嵌套 Functor —— 两个 Functor 共同作为计算入参出现

  


### 线性计算场景下的嵌套 Functor

考虑这样一个函数：它接收一个用户 id 作为入参，用于检查该用户是否在用户列表中。如果是，则取 id 的前三位作为用户的默认昵称，并将昵称和id一起返回；否则，视为异常。

这个函数实现如下：

```js
// 这里省略 isExisted 的实现，大家知道它是用来检查 id 存在性的即可
import isExisted from './utils'  

const getUser = id => {  
  if(isExisted(id)) {
    return {
      id,
      nickName: String(id).slice(0, 3)
    }
  } else {
    throw new Error("User not found")
  }
}
```

借助 Maybe Functor，我们可以简单包装一下这个查找过程：

```js
import isExisted from './utils'  

const getUserSafely = id => {  
  try {
    const userInfo = getUser(id)
    return Maybe(userInfo)
  } catch(e) {
    return Maybe(null)
  }
}
```

这里为了验证方便，我实现一个作弊版的 isExisted，这个函数将会在 id 为 3 的倍数时返回 true，在其他情况下返回 false：

```js
const isExisted = id => id % 3 === 0
```

将这个 isExisted 代入楼上的示例代码，我们就可以检验 getUserSafely 的执行效果了：

```
const res = getUserSafely(1110021)  

// 输出 'Maybe {[object Object]}'
res.inspect()

// 输出 {id: 1110021, nickName: '111'}
res.valueOf()
```

经过这样一番调整后，findUser 函数在任何情况下都会返回一个 Maybe Functor。

这时，如果我想要在一个 Maybe Functor 的 map 方法中，调用这个 findUser 方法，比如这样：

```js
const targetUser = {
  id: 1100013,  
  credits: 2000,  
  level: 20
}  

const userContainer = Maybe(targetUser)  

const extractUserId = user => user && user.id

const userInfo = userContainer.map(extractUserId)
                          .map(getUserSafely)
```

这一波操作下来，最终得到的 userInfo 就会是一个嵌套的 Maybe Functor：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/486b3aa49706488298dde948dc85103f~tplv-k3u1fbpfcp-zoom-1.image)

在这个例子中，我们看到的是一个线性的计算过程：

整个计算过程中，真正作为数据源存在的，有且仅有 targetUser，我们把 targetUser 放进 Maybe 盒子里，然后在这个盒子的基础上一次又一次地调用 map，对源数据 targetUser 做一次又一次的加工。

之所以会出现嵌套的 Functor，是因为在加工 targetUser 的过程中，出现了 getUserSafely() 这样一个返回 Functor 的函数。

这也就是所谓的“**Functor 以计算中间态的形式出现**”。

对于 map 接收的回调参数 f 来说，f 预期的入参往往是数据本身，而不是一个装着数据的盒子。

假设我在 findUser 之后还有一个 cryptoUser 的回调需要执行，也就是说要像下面这样延长原有的调用链：

```js
const crypteUser = (userInfo) => {
  // ..省略一些加密的具体逻辑
}   

const cryptedUserInfo = userContainer.map(extractUserId)
                                   .map(getUserSafely)
                                   .map(crypteUser)	
```

cryptoUser 预期中的输入是一个包含了 id 和 nickName 的 user 对象，但实际上它得到的输入却是一个装有 user 对象的 Maybe Functor 盒子。

这显然是要出问题的。

那么如何在不破坏链式结构的前提下，打开这个盒子、把数据拿出来用呢？

大家可以先自己思考一下这个问题，这里我们对于解法先按下不表，继续来看嵌套盒子的另一种 case：非线性计算。

### 非线性计算场景下的嵌套 Functor

考虑这样一个函数：它用于计算一个学生的期末成绩，接收两个入参：学生的文化课分数（generalScore)，以及学生的体育课分数（healthScore）。将这两个分数分别乘以各自的权重（文化课对应权重High，体育课对应权重Low），最后得到一个总分。

函数实现如下：

```js
// 该函数将对给定 score 作权重为 high 的计算处理
const highWeights = score => score*0.8

// 该函数将对给定 score 作权重为 low 的计算处理
const lowWeights = (score) => score*0.5

const computeFinalScore = (generalScore, healthScore) => {
  const finalGeneralScore = highWeights(generalScore)  
  const finalHealthScore = lowWeights(healthScore)  
  return finalGeneralScore + finalHealthScore
}
```

我们借助 Identity Functor 对这个计算流程进行改造如下：

```js
const computeFinalScore = (generalScore, healthScore) => 
                        Identity(highWeights(generalScore))
                              .map(
                                  finalGeneralScore => 
                                    Identity(lowWeights(healthScore))
                                      .map(
                                        finalhealthScore => 
                                            finalGeneralScore + finalhealthScore
                                      )
                                )
```

在这个例子中，我们看到的是一个非线性的计算过程：

generalScore 和 healthScore 同时作为数据源存在，都是 computeFinalScore 函数的入参。从逻辑上来说，它们应该是平行的关系。

尽管盒子模式也能够支持逻辑上的平行关系，甚至能够支持异步。但盒子模式的调用总是链式的、线性的。

因此，当我们用盒子模式去实现非线性的计算过程的时候，就不得不像示例这样，把另一个数据源 healthScore 也包装成一个盒子，放进 generalScore 的 map 里面去。

这种情况下，也会导致嵌套 Functor 的产生。

  


### 嵌套 Functor 的解法思考

创建 Functor，是一个把数据放进盒子的过程。而消除嵌套，则是一个“打开盒子”的过程。

以线性计算示例中的 userInfo 为例，要打开这个盒子，我们需要执行两次 valueOf：

```js
userInfo.valueOf().valueOf()
```

这个写法，不优雅倒还是其次，关键是这多出来的 valueOf() 调用放在哪里合适呢？

放在下一个 map 的回调里吗？

假设我在 findUser() 之后还有一个 cryptoUser() 回调需要执行，是不是 cryptoUser() 就需要承担起“打开盒子”这个任务了？

但我的 cryptoUser 原本只是一个负责加密用户信息的函数，它没有义务去理解自己所在的执行上下文是什么样的，更没有必要为 findUser() 造成的问题买单。

硬要把“打开盒子”的任务交给 cryptoUser，反而会污染 cryptoUser 本身的逻辑。

咋办呢？

我们知道，在盒子模式中，盒子的【行为】大体上可以分为两类：

-   回调函数的行为，也就是 map 方法中传入的那个 f。这个 f 是灵活可变的，我们可以通过 map 来组合各种各样不同的 f。我们把 f 记为“**自定义行为**”。
-   盒子本身预设的行为，比如 Functor 盒子中的 map。这个 map 的行为是确定的、不可变的，我们把这样的行为记作“**基础行为**”。

既然“自定义行为”没法干这个“打开盒子”的活，我们就只能往“基础行为”上使使劲儿啦。

## flatMap：打开盒子，取出数据

目前看来，我们需要的是这样一个“基础行为”：预期 map(f) 会返回一个嵌套的盒子，并且能够主动把套在里面那个盒子取出来。

说白了，不就是在 map 结束之后，再调一次 valueOf()么：

```js
const Monad = x => ({
  map: f => Monad(f(x)),
  valueOf: () => x,
  inspect: () => `Monad {${x}}`,

  // 新增一个主动打开盒子的方法 flatMap 
  flatMap: f => map(f).valueOf()
})

const monad = Monad(1) 
const nestedMonad = Monad(monad)  

// 试试会发生什么？
nestedMonad.flatMap()
```

PS：截止目前，我们一直把“打开盒子”的函数叫做 valueOf()。其实这个函数在具体的实现中有很多名字，比如 join()、extract() 等等。大家平时读代码的时候能够意会就可以哈。

如果直接把这段代码丢进控制台运行，你将会得到这样一个报错：



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39bd6458506a4c6b8fc6eec881e6c29f~tplv-k3u1fbpfcp-watermark.image?)
   
   
这是因为我们试图在 flatMap 中试图去调用另一个与它平级的对象方法 map，由于两个方法实际上并不在同一个上下文里，调用 map 的动作是注定要失败的。

这里就引出了盒子模式中的另一个重要的方法：of()。

## 拓展：of 方法，OOP？FP？

如何把一个盒子中的两个方法，放进同一个上下文里？

答案是创建一个 Class，像这样：

```js
class Monad { 
  constructor(x) {
    this.val = x
  }

  
  map(f) { 
    return Monad.of(f(this.val)) 
  } 
  
  flatMap(f) { 
    return this.map(f).valueOf()
  }

  valueOf() {
    return this.val
  }
}

Monad.of = function(val) {
  return new Monad(val);
}  

const monad = Monad.of(1)  
const nestedMonad = Monad.of(monad)  

// 输出 Monad {val: 1}，符合“不嵌套”的预期
console.log(nestedMonad.flatMap(x => x))
```

此情此景，你可能忍不住在心中默默祭出一声卧槽：

没想到啊，学了快 20 节函数式编程了，最后竟然又被 this 带回面向对象了？

其实，对于 JS 来说，FP 和 OOP 之间并没有想象中的那么泾渭分明。

有一些语言是天然有“人设”的，比如：当你写 Java 的时候，你就只想 OOP；当你写 Haskell 的时候，你就只想 FP。

相比之下，JS 就中庸得多了。

从语言实现的层面来说，它的 Function 就是 Object，Object 也是 Function......FP 和 OOP 之间俨然是一种“你中有我，我中有你”的暧昧关系。

从范式本身来看，我们写 FP 确实是要和 OOP 不一样的，这一点至少要在编码风格上体现出来。

也正是出于这个动机，FP 借助 Class 实现 Functor 和 Monad 这类盒子的时候，并不会把“我是一个 Class”这件事摆在明面上。

一个最典型的小细节，就是如上面这个示例一样，把构造函数的调用包装成一个 of 方法，以此来摆脱 `new XXX()` 这样高度不和谐的 OOP 代码。

## flatMap 的极简实现

书归正传，其实在我们这个案例中，根本用不到 of 来创建上下文。

map 方法做了什么事情？map 方法执行了 f 回调，然后把执行结果 f(x) 放进了盒子里。

flatMap 想要做什么事情？flatMap 方法想要把这个执行结果 f(x) 从盒子里拿出来。

既然 flatMap 想要的是 f(x)，那它一开始直接不把 f(x) 往盒子里放不就行啦？

所以咱的 flatMap 也可以这样实现：

```js
const Monad = x => ({
  map: f => Monad(f(x)),
  // flatMap 直接返回 f(x) 的执行结果
  flatMap: f => f(x),

  valueOf: () => x,
  inspect: () => `Monad {${x}}`,
})
```

整体的结构看上去很简单，实际上它也就是这么简单。

我们把非线性计算案例中 Identity Functor 替换成 Monad，map 替换成 flatMap，嵌套盒子的问题瞬间得解：

```js
const computeFinalScore = (generalScore, healthScore) => 
                        Monad(highWeights(generalScore))
                          .flatMap(
                            finalGeneralScore => 
                              Monad(lowWeights(healthScore))
                                .flatMap(
                                  finalhealthScore => 
                                    finalGeneralScore + finalhealthScore
                                )
                            )

// 输出计算结果： 210
const finalScore = computeFinalScore(200, 100)  
```

这种感觉，就好像高中的时候做数学题。有时候苦思冥想大半天也只能憋出个“解”字，结果翻开标准答案一看，好家伙，也就两三行不等式就能做出来，不过如此嘛。

但我们都知道，答案本身并没有那么重要，重要的是我们如何去去解读它、吸收它，并且在下一次遇到类似题目时，还能想到它。

  


## 总结：map VS flatMap

写了这么多代码，我们最后来总结一下 flatMap 的特征。

flatMap 和 map 其实很像，区别在于他们对回调函数 `f(x)` 的预期：

map 预期 `f(x)` 会输出一个具体的值。这个值会作为下一个“基础行为”的回调入参传递下去。

而 flatMap 预期 `f(x)` 会输出一个 Functor，它会像剥洋葱一样，把 Functor 里包裹的值给“剥”出来。确保最终传递给下一个“基础行为”的回调入参，仍然是一个具体的值。

符合这个特征的方法不一定总是叫 flatMap，它有许多别名：chain、fold、flatten......等等等等。

不管这个方法叫啥，只要它在 Functor 的基础上，实现了楼上描述的这个“剥洋葱”般的逻辑，它都足以将一个 Functor 拓展为 Monad。

毕竟，盒子的本质，是一套“**行为框架**”。

决定一个盒子能否成为 Functor 或 Monad 的，并不是方法的命名，而是方法的**行为**。  

> 注：本节我们介绍了 Monad 最直观的作用：数据转换/解决嵌套盒子问题。其实，在软件生产实践中，Monad 还有一个更加广泛、更加实用的实践，那就是”**把副作用放进盒子**“。关于这点，我们在[第26节](https://juejin.cn/book/7173591403639865377/section/7207809625310117927)会结合 RxJS 作详细的探讨。
 
  （阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）