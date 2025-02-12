> 通过上一节的学习，我们已经清楚地知道：` concat() `**接口是对数学中的二元运算符的抽象。** `concat()`接口宛如一条【线】，它能够将链式调用中前后相邻的两个【点】（也就是“盒子”）串联起来，进行盒子间的二元运算。

## `concat()` 与 `reduce()` ：从二元运算到 n 元运算

这“连点成线”般的二元运算，可不是 `concat()`的专利。在遇到 `concat()`之前，我们其实已经和具备“二元运算符”特征的函数打过不少交道了。

没错，我说的就是 `Array.prototype.reduce(callback, initialValue)` 里的那个 `callback()`。

`callback()`和 `concat()`的工作流是极为相似的。

我们首先来看 `concat()`接口组织起来的二元运算工作流，考虑这样一个链式的 `concat()` 调用：

```js
// 定义一个类型为 Add 的 Monoid 盒子
const Add = (value) => ({
  value,  
  // concat 接收一个类型为 Add 的 Monoid 盒子作为入参
  concat: (box) => Add(value + box.value)
})   


// 这个 empty() 函数就是加法运算的单位元
Add.empty = () => Add(0)  

const res = Add(1)
              .concat(Add(2))
              .concat(Add(3))
              .concat(Add(4))

// 输出 10
console.log(res.value)
```

它拉起来的二元运算工作流如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecc54367df754726addbebc84c708e8a~tplv-k3u1fbpfcp-zoom-1.image)

接着我们考虑这样一个 reduce 调用：

```js
const callback = (x, y) =>  x + y   

const res = [1, 2, 3, 4].reduce(callback, 0) 

// 输出 10
console.log(res)
```

它拉起来的二元运算工作流如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d64b4bd8375473eb22e94311e84b9e0~tplv-k3u1fbpfcp-zoom-1.image)

这两张图不能说是一模一样吧，只能说是十分相似。

别的不说，就“**两两组合，循环往复**”这个流程特征来说，两者是高度一致的。

主要的区别在于，`concat()`方法的宿主可以是任意一个 `Semigroup/Monoid` 盒子，而 `callback()`和 `reduce()`一起，依附于数组数据结构而存在。

最重要的是，`reduce()`还能够通过反复地调用`callback()`，来**将有限的二元运算延伸至无限的 n 元运算**。    
`concat()` 和 `callback()` 这么相似，`concat()`是不是也能和 `reduce()`打配合呢？

到这里，图穷匕见，华点也呼之欲出： 在实践中，**Monoid 常常被放在** `reduce` **的** `callback` **中参与计算。**

以加法运算为例，我们重新审视一下 Monoid 做加法的姿势：

```js
// 定义一个类型为 Add 的 Monoid 盒子
const Add = (value) => ({
  value,  
  // concat 接收一个类型为 Add 的 Monoid 盒子作为入参
  concat: (box) => Add(value + box.value)
})   


// 这个 empty() 函数就是加法运算的单位元
Add.empty = () => Add(0)  

const res = Add(1)
              .concat(Add(2))
              .concat(Add(3))
              .concat(Add(4))

// 输出 10
console.log(res.value)
```

一个 `concat()`函数一次只能求和两个数字，一旦数字多起来，我们就不得不重复执行许多次“将数字放进 Add 盒子，再调用 Add 盒子上的 `concat()`方法”这个过程。

如果能把 `Add` 盒子放进 `reduce()` 的 `callback()`里，就可以省去这类重复的操作。顺着这个思路，我们可以将楼上的链式调用改造如下：

```js
// 定义一个类型为 Add 的 Monoid 盒子
const Add = (value) => ({
  value,  
  // concat 接收一个类型为 Add 的 Monoid 盒子作为入参
  concat: (box) => Add(value + box.value)
})   
Add.empty = () => Add(0)     


// 把 Add 盒子放进 reduce 的 callback 里去
const res = [1, 2, 3, 4].reduce((monoid, num) => monoid.concat(Add(num)), Add(0))
```

如此，我们便能够借助 `reduce()`方法，写出更加简洁的盒子代码。

## `empty()`函数解决了什么问题

`empty()`函数能够解决 n 元运算中的计算起点（也即“初始值”）不存在的问题，这一点我们可以结合楼上的例子来看。请大家关注到 `reduce()`调用这一行：

```js
// 把 Add 盒子放进 reduce 的 callback 里去
const res = [1, 2, 3, 4].reduce((monoid, num) => monoid.concat(Add(num)), Add(0))
```

在编写小册之前，我在线下也组织过几次函数式编程的分享会。“如何把 Monoid 盒子放进 `reduce()`”这个问题，我曾经把它作为白板编程题给到过现场的同学。在没有控制台辅助 debug 的情况下，不少同学都会给出这样的答案：

```js
// 把 Add 盒子放进 reduce 的 callback 里去
const res = [1, 2, 3, 4].reduce((monoid, num) => monoid.concat(Add(num)))
```

这里大家在打开上帝视角的情况下，一眼就能看出这段代码的问题所在——`reduce()`接口缺少了初始值，会导致第一次的 `monoid.concat()`调用失败。

我在加法 Monoid 的代码里，使用 `Add(0)`作为计算起点，顺利地规避掉了这个问题。那么如果我们的 Monoid 从加法 `Add`变为了乘法 `Multi`，计算起点的值又该如何调整呢？

其实，无论是 Add 还是 Multi，无论是求和还是求积，我们对计算起点的预期总是一致的——**它得是一个 Monoid/Semigroup 盒子（能够提供** ` concat()  `**接口），并且它的值不应该对计算结果产生任何影响**。

也就是说，**计算起点和任何运算数结合的时候，都不应该改变那个运算数。** 细品一下，这说的不就是 Monoid 的单位元——`empty()`函数么？

循着这个思路，我们不难想到，乘法盒子的计算起点应该是 Multi(1)，也就是 `Multi.empty()` 的返回值：

```js
// 定义一个类型为 Multi 的 Monoid 盒子
const Multi = (value) => ({
  value,  
  // concat 接收一个类型为 Multi Monoid 盒子作为入参
  concat: (box) => Multi(value * box.value)
})     
Multi.empty = () => Multi(1)     


// n 元运算的计算起点是单位元函数 empty()
const res = [1, 2, 3, 4].reduce((monoid, num) => monoid.concat(Multi(num)), Multi.empty())
```

到这里，`empty()`在实践中的作用就非常清晰了——当二元运算被拓展为 n 元运算时，我们需要 `Monoid.empty()`作为计算起点，进而规避空值的问题。

## `concat()` + `reduce()` 推导 `foldMap()` 函数

这里我用 Monoid 来表示一个任意的 Monoid 盒子，用 arr 来表示一个任意的数组，`concat()`+`reduce()`的组合代码就可以抽象如下：

```js
arr.reduce((monoid, value) => monoid.concat(Monoid(value)), Monoid.empty())
```

在实践中，这段代码还有另一种写法，那就是先调用 `map()`，将数组中的所有元素都包装成 Monoid，然后再进行 `reduce()`调用，像这样：

```js
arr
  .map((value)=> Monoid(value))
  .reduce((monoid, currentMonoid) => monoid.concat(currentMonoid)), Monoid.empty())
```

这两段代码的功能是一猫一样的。这里我以 `Multi`盒子为例，分别尝试两种代码写法，得到的计算结果也是一致的：

```js
// 定义一个类型为 Multi 的 Monoid 盒子
const Multi = (value) => ({
  value,  
  // concat 接收一个类型为 Multi Monoid 盒子作为入参
  concat: (box) => Multi(value * box.value)
})     
Multi.empty = () => Multi(1)     

const arr = [1, 2, 3, 4]  


const resV1 = arr
              .reduce((monoid, value) => monoid.concat(Multi(value)), Multi.empty())  

const resV2 = arr
              .map((value)=> Multi(value))
              .reduce((prevMonoid, currentMonoid) => prevMonoid.concat(currentMonoid), Multi.empty())

// true
resV1.value === resV2.value
```

无论是直接 `reduce()`，还是先 `map()`再 `reduce()`，它们最终的目的都是“**实现 n 元的 Monoid 盒子运算**”。

在实际的项目中，一旦我们用到了盒子模式，“实现 n 元的 Monoid 盒子运算”就总是会成为一个非常高频的操作。正因为如此，我们一般不会等到使用的时候再去手动实现这些代码，而是会把这坨逻辑提取到一个工具函数里，以备不时之需。这个工具函数的名字，就叫做`foldMap()`。

对于`foldMap()`来说，“实现 n 元的 Monoid 盒子运算”这个功能是固定的，而“运算符（也即 Monoid 盒子的类型）”以及“运算数（也即数组的内容）”则是动态的。动态信息总是以函数参数的形式传入。也就是说，`foldMap()`函数的入参，就是楼上模板代码中的 `Monoid` 和 `arr`。

分析至此，`foldMap()`的代码也就写完了：

```js
// 这里我以 map+reduce 的写法为例，抽象 foldMap() 函数
const foldMap = (Monoid, arr) => 
                  arr
                    .map(Monoid)
                    .reduce(
                      (prevMonoid, currentMonoid) => prevMonoid.concat(currentMonoid),
                      Monoid.empty()
                    )  

// 定义 Multi 盒子
const Multi = (value) => ({
  value,  
  concat: (box) => Multi(value * box.value)
})     
Multi.empty = () => Multi(1)   

// 使用 foldMap 实现 Multi 盒子求积功能   
const res = foldMap(Multi, [1, 2, 3, 4])   

// 输出 24， 求积成功
console.log(res.value)
```

## 从 Monoid 到函数组合

### compose 特征：两两组合、循环往复

compose 的过程，也是一个“**两两组合、循环往复**”的过程，是一个**由二元运算拓展至 n 元运算的过程**。

一个大的 compose，可以看作是无数个小的 compose 单元的组合。每个 compose 单元，都只会组合两个函数。这个最小的 compose 单元，用代码表示如下：

```js
const compose = (func1, func2) => arg => func1(func2(arg))
```

读到这里，一些同学可能会有这样的疑虑：这里修言敢说 `compose()` 是“两两组合、循环往复”的过程，是因为在[第14节](<https://juejin.cn/book/7173591403639865377/section/7175422922192846907>)实现 `compose()` 函数的时候，修言【故意】使用了具备二元运算回调的 `reduce()`来实现 `compose()`，这才使得两个章节的逻辑互洽了——哈，修勾果然鸡贼！

绝非如此啊，家人们！ “两两组合，循环往复”其实是对 `compose()`逻辑特征的描述，而不是对`compose()`编码实现的描述。 换言之，就算我们不用`reduce()`来实现`compose()`函数，这个特征也仍然成立。

为了深刻理解这一点，大家不妨回忆一下加法、乘法等运算符，这些运算符实现 n 元运算的思路，其实就是**反复去做二元运算**。以加法运算为例：

```
1 + 2 + 3 + 4  
```

4 个数字相加的过程，需要先把 1 和 2 相加，得到第一个求和结果 3，然后再把这个求和结果3和下一个数字3相加，得到第二个求和结果6；然后再把第二个求和结果6和下一个数字4相加，得到第三个求和结果10。（如下图所示）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93a8bc31891e4b84bc9191185a92106e~tplv-k3u1fbpfcp-zoom-1.image)

相似的，”compose(组合)“这个动作，其实也是一个运算符。在数学中，我们用 `f · g`来描述函数 `f` 和函数 `g` 之间的组合关系。考虑以下 4 个待组合的函数：

```js
[func1, func2, func3, func4]
```

把这 4 个函数组合成一个函数的过程，仍然是一个反复去做二元运算的过程（如下图所示）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d045ba285534effbabf1e1a9d18efaa~tplv-k3u1fbpfcp-zoom-1.image)

开篇我们就说过，“两两组合、循环往复”是`Monoid.concat()`的工作流特征。分析至此，我们又意识到，它同时也是 `compose()`的工作特征。

在意识到 `Monoid`和`compose()`之间的相似性的同时，大家不妨做一些更大胆的假设，比如——用 `Monoid`的规则去理解 `compose()`。

### compose 与 Monoid 的共性

这里我想要讨论的 compose，是“组合”这个动作本身，也就是“最小的 compose 单元”，也就是这个函数：

```js
const compose = (func1, func2) => arg => func1(func2(arg))
```

我们重新回顾一下“什么是 Monoid”这个问题：Monoid = Semigroup + `empty()`函数。

我把 Semigroup 的特征代入这个公式，就能得到 Monoid 的特征：Monoid = 闭合 + 结合律 + 二元运算 + `empty()` 函数

Monoid 所具备的这些特征，compose 全中。   

#### compose 是闭合的二元运算

我们不妨把“组合（compose）”这个动作看作一个运算符，把参与组合的函数看作是运算数，那么总是有：

```js
func1 compose func2 = func3
```

一个函数 compose 另一个函数，总是能得到一个新的函数。运算符没有改变运算数的类型，因此 compose 运算是一个闭合的运算。

同时，compose 运算是一个“两两组合”的运算，也符合二元运算的特征。

#### compose 是符合结合律的

对于任意的三个函数 func1、func2、func3，总是有这样的规律：

```js
compose(
  compose(func1, func2),
  func3
)= compose(
  func1,
  compose(func2, func3)
)
```

这个规律不是我说的，是数学家说的，他们是这样说的：

> All properties of composition of relations are true of composition of functions, such as the property of associativity. ——wikipedia "Function Composition"词条    
修言直译：所有“关系组合”的属性都是适用于函数组合的，比如结合律。

他们也曾这样说过：

> The composition of functions is always associative—a property inherited from the composition of relations.That is, if *f*, *g*, and *h* are composable, then *f* ∘ (*g* ∘ *h*) = (*f* ∘ *g*) ∘ *h*. Since the parentheses do not change the result, they are generally omitted. ——mathresearch.utsa.edu/wiki     
修言直译：函数组合总是符合结合律的--这是从“关系组合”中继承下来的属性。具体来说，如果f、g和h是可以组合的，那么f∘（g∘h）=（f∘g）∘h。

函数组合符合结合律这回事儿，也就轮不到我来证明了。

### compose 的单位元如何实现

分析至此，`compose()`已经命中了 Semigroup 的全部特征：闭合、结合律、二元运算。它与 Monoid，只差一个 `empty()`单位元函数了。

其实，`compose()`的单位元函数，咱们早在[第18节](<https://juejin.cn/book/7173591403639865377/section/7175423056620290103>)就见过啦。没错，我说的就是 `Identity Function`（恒等函数）：

```js
const identity = x => x
```

恒等函数本身不包含任何的计算修改逻辑，它所做的仅仅是吃进一个入参，然后把它原封不动地吐出来，俗称“透传”。 一个“透传”函数和任何函数结合，都不会改变那个函数的运算结果。因此，恒等函数就是函数组合的“单位元”。

  


至此我们发现，当我们把 `compose()`的最小计算单元视作一个运算符、把函数组合视作一个代数运算后，我们竟能从中挖掘出 `Monoid`的所有特征。

这也使我忍不住联想起了前几年在社区听到过的一种声音——“函数组合是一种 Monoid”。那之后我查了很多的资料，始终也没能为这个观点找到什么强有力的学术理论支撑。因此，上文的推导，并不是为了佐证这个观点，而是为了凸显我们在[第17节](<https://juejin.cn/book/7173591403639865377/section/7175422979646423098>)就阐述过的一个思路——**范畴的本质是复合。**

## 范畴的本质是复合

**范畴的本质是复合。 从实践的角度看，范畴论在 JS 中的应用，本质上还是为了解决函数组合的问题。**

这里说“函数组合”其实还不是特别严谨，通过本节的学习，相信大家都能够感受到，“组合”是一个更加泛的概念。除了函数的组合，还有“盒子”的组合。

那么如果更进一步地问：组合（Composition）是一个什么样的过程？

截止目前，我们已经掌握了两个有代表性的 Composition 工具：`compose()`函数和 `foldMap()`函数。

`compose()`函数组合的是函数本身，而 `foldMap()`函数组合的则是不同的 Monoid 盒子。

这两种函数消化的入参类型不同，函数体的编码实现不同，但它们的逻辑特征却高度一致：**通过多次执行二元运算，将有限的二元运算拓展为无限的 n 元运算。**

两两结合，循环往复，聚沙成塔——这，就是“组合”过程。