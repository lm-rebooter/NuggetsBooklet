和 Functor（函子）、Monad（单子）一样，Semigroup（半群）和 Monoid（幺半群）也是正经八百的范畴论名词。

名字很恐怖，逻辑很经典，代码很简单。

其中，Semigroup（半群）可以通过我们最熟悉的加法乘法来推导，而 Monoid（幺半群）又可以基于 Semigroup 来推导。

也就是说，只要你学过小学数学，你就必然能理解啥是 Semigroup、啥是 Monoid。

话不多说，我们首先来推导一波 Semigroup。

## Semigroup（半群） 的数学背景

### 理解“结合律”与“闭合”

我们首先来看两个非常简单的小学算式：

加法算式：

```js
1 + 2 + 3 
```

乘法算式 ：

```js
1 * 2 * 3 
```

  


加法和乘法有两个关键的共性：

1.  它们都满足结合律。
1.  它们都是闭合的。

  


这两个共性，也正是 Semigroup 必须满足的性质。

#### 结合律

在数学中，结合律是指：只要运算数字的**位置**没有发生改变，运算顺序的调整不会改变运算的结果。

以加法运算为例：

> 三个数相加，先把前面两个数相加，再加第三个数，或者先把后面两个数相加，再和第一个数相加，它们的和不变。——引自人教版《小学数学》四年级课本

加法运算的结合律，用数学算式表达如下：
```js
(1 + 2) + 3 = 1 + (2 + 3) = 6
```

以乘法运算为例：

> 三个数相乘，先把前两个数相乘，或先把后两个数相乘，积不变。 ——引自人教版《小学数学》四年级课本

乘法运算的结合律，用数学算式表达如下：

```js
(1 * 2) * 3 = 1 * (2 * 3) = 6
```

**在加法和乘法运算中，在各个数字位置不变的情况下，重新排列表达式中的括号，并不会影响最终的计算结果。 这样的运算就是符合结合律的。**

#### 闭合

**在数学中，闭合意味着我们对某个集合的成员进行运算后，生成的仍然是这个集合的成员。**

以加法运算为例：

```js
1 + 2 + 3 = 6
```

在这个算式中，“集合”就是整数类型数据。

1、2、3 三个整数做完加法后，得到的计算结果 6 也是一个整数。这也就是所谓的“闭合”。

对于任意的整数来说，它们之间的加法运算总是能算出一个新的整数，所以我们就说，整数在加法下是闭合的。   


以乘法运算为例：

```js
1 * 2 * 3
```

1 * 2 * 3 三个整数做完乘法后，得到的计算结果 6 也是一个整数。

类似的，对于任意的整数来说，它们之间的乘法运算总是能算出一个新的整数。所以我们就说，整数在乘法下也是闭合的。

#### 理解数学中的 Semigroup

理解了“**结合律**”和“**闭合**”，其实也就理解了什么是数学中的 **Semigroup**：

> 在数学中，半群是闭合于结合性二元运算之下的集合 S 构成的代数结构。——wikipedia

【划重点】：**闭合、结合性、二元运算**

其中闭合和结合律我们楼上已经解释得透透的了，这里我想要强调的是“**二元运算**”。

> 作者注：“二元运算”这里的“元”，映射到程序里就是指函数参数的数量。这一点我们在[第15节](https://juejin.cn/book/7173591403639865377/section/7175423003319074876)有过详细的探讨。

我们前面学习过 Functor（函子）盒子，学习过 Monad（单子）盒子，这两个盒子有一个明显的共性——它们的计算单元都是**一元函数**：

```js
// Identity Functor
const Identity = x => ({
  // functor 盒子的 map 方法，预期计算单元是一元函数
  map: f => Identity(f(x)),
  valueOf: () => x
})   

// 上一节实现的 Monad 
const Monad = x => ({
  map: f => Monad(f(x)),
  // Monad 盒子的 flatMap 方法，预期计算单元是一元函数
  flatMap: f => f(x),

  valueOf: () => x,
  inspect: () => `Monad {${x}}`,
})
```

而 Semigroup 直接把“二元运算”打在了公屏上，明牌告诉咱们 Semigroup 盒子的“基本行为”函数应该是一个二元函数。

**小细节，大进步。**

具体进步在哪了，这里先按下不表（但其实标题中已经“表”过了，哈哈），我们一步一步来。

## Semigroup 在函数式编程中的形态

以加法/乘法运算为例，我们来重新捋一捋数学中形成 Semigroup 的逻辑：

在整数运算的加法/乘法中，+/* 是一个运算符，可以用来计算两个任意的整数以获得另一个整数。因此，加法运算/乘法运算在所有可能的整数集合上形成一个 Semigroup。

这个逻辑其实是可以直接往 JS 中做映射的——在 JS 中，我们同样有**运算符**、有包括整数在内的各种**数据类型**，同样可以实现各种各样的**计算过程**。

### JS 语言中的 Semigroup

因此，首先我们可以明确的是，整数的加法和乘法运算即便是到了 JS 里面，也是标准的 Semigroup。

除了整数的加法和乘法之外，常见的几个 JS 中的 Semigroup 还包括：

-   (boolean, &&)，布尔值的“与”运算
-   (boolean, ||)，布尔值的“或”运算
-   (string, +/concat) ，字符串的拼接（并集）运算。
-   (Array, concat)，数组的拼接（并集）运算

接下来我会分别对着四种运算进行举例，这其中，尤其需要引起大家关注的是**字符串和数组的拼接（并集）运算**。

#### 布尔值的“与”、“或”运算

示例3个布尔值如下：

```js
true 
false 
true
```

验证结合律&闭合原则代码如下：

```js
const a = true
const b = false
const c = true

// 与运算结果
const resOfAnd = a && b && c 

// 或运算结果
const resOfOr = a || b || c 


// 验证与运算是否符合结合律
const isAndAssociative = ((a && b) && c) === (a && (b && c))
// 验证或运算是否符合结合律
const isOrAssociative = ((a || b) || c) === (a || (b || c))

// 验证与运算是否符合闭合原则
const isAndClosed = (typeof resOfAnd) === 'boolean'  
// 验证或运算是否符合闭合原则
const isOrClosed = (typeof resOfOr) === 'boolean'  

// true true true true
console.log(
  isAndAssociative, 
  isOrAssociative,
  isAndClosed,
  isOrClosed
)  
```

  


#### 字符串的拼接（并集）运算

示例字符串拼接（取并集）运算如下：

```js
'xiuyan' + 'is' + 'handsome'
```

验证结合律&闭合原则代码如下：

```js
const a = 'xiuyan'  
const b = 'is'  
const c = 'handsome'    

const res = a + b + c 

// 验证是否符合结合律
const isAssociative = (a + b) + c === a + (b + c)       

// 验证是否符合闭合原则
const isClosed = (typeof res) === 'string'

// true true
console.log(isAssociative, isClosed)  
```

这个示例使用了 `+` 运算符来做字符串拼接，这其实也是许多同学在业务代码中最习惯使用的一种字符串拼接姿势。但是在这里，我更想要引出的其实是另一个东西： `String.prototype.concat()`。

上面的 + 运算符示例可以用 `String.prototype.concat()`改写如下：

```js
const a = 'xiuyan'  
const b = 'is'  
const c = 'handsome'    

// 等价于 a + b + c
const res = a.concat(b).concat(c)    


// 验证是否符合结合律
const isAssociative = a.concat(b).concat(c) === a.concat(b.concat(c))

// 验证是否符合闭合原则
const isClosed = (typeof res) === 'string'

// true true
console.log(isAssociative, isClosed)  
```

对于 JS 字符串来说，要想达到“取并集”的目的，使用 + 运算符和 `concat()`都是可行的。

> 作者注：字符串“取并集”本身也是一道经典的笔试题，它的解法并不止 + 和 concat() 这两种。考虑到其它解法和本文主题的关联度不高，此处不多赘述。

但是对于数组来说，`+` 运算符是走不通的。实现数组的“取并集”，我们可以借助 `...` 运算符，也可以借助 `Array.prototype.reduce()`。但是最为直接的解法，还得是 `Array.prototype.concat()` 。

#### 数组的拼接（并集）运算

考虑这样一个数组拼接（取并集）的算式：

```js
[1, 2] + [3, 4] + [5, 6]
```

验证结合律&闭合原则代码如下：

```js
const a = [1, 2]
const b = [3, 4]
const c = [5, 6]

// a + b + c
const res = a.concat(b).concat(c)    


// 验证是否符合结合律
// 注意，这里我们判断的是数组的内容是否相等，而不是引用是否相等
const isAssociative = a.concat(b).concat(c).toString() == a.concat(b.concat(c)).toString()

// 验证是否符合闭合原则
const isClosed = res instanceof Array

// true true
console.log(isAssociative, isClosed)  
```

也就是说呀，JS 中数组和字符串的”取并集“运算，都属于是 Semigroup。   

行文至此，我们不妨小小地总结一下数组和字符串表现出来的共性：

**数组取并集运算能够形成一个 Semigroup（半群），字符串取并集运算也能够形成一个 Semigroup（半群）。**

**数组取并集的方法是** `concat()`**，字符串取并集的方法也是** `concat()`**。**

这也太巧了吧！缘，妙不可言！

但与其说这是一种巧合，不如说这是一种**模式**。

因为在函数式编程的实践中，**Semigroup 盒子的接口方法（也就是我们常说的“基础行为”）正是这个 `concat()`！**

### 函数式编程中的 Semigroup 盒子

学到这里我们已经知道，Semigroup 中总是有以下两个要素：

-   **运算数**：参与运算的数据。比如加法运算中的 1、2、3，与运算中的 true、false 等。
-   **运算符**：执行运算的符号。比如 +、*、||、&& 等等等等......

映射到函数式编程来看的话，运算数可以理解为**函数的入参**，运算符则可以被抽象为**一个 concat() 函数**。

接下来我们就以加法运算为例，演示一下这个从数学映射到代码的过程：

```js
// 定义一个类型为 Add 的 Semigroup 盒子
const Add = (value) => ({
  value,  
  // concat 接收一个类型为 Add 的 Semigroup 盒子作为入参
  concat: (box) => Add(value + box.value)
})   

// 输出一个 value=6 的 Add 盒子
Add(1).concat(Add(2)).concat(Add(3))
```

在这段代码中，我们将运算符 `concat()` 和运算数 `value` 都包裹在了一个名为 `Add` 的盒子中。

`concat()` 接口能够同时拿到**当前盒子**的运算数 `value`和**下一个盒子**的运算数 `box.value`，它会基于这两个运算数执行**二元运算**，最后把**二元运算**的结果包裹在一个新的 `Add` 盒子中返回。

`concat()` 接口是 Semigroup 盒子的核心，它能够消化任何可能的 Semigroup 运算。本节标题中的“连点成线”描述的就是 `concat()`接口的特征：**`concat()`接口宛如一条【线】，它能够将链式调用中前后相邻的两个【点】（也就是“盒子”）串联起来，进行盒子间的二元运算。**     

我们可以用`Semigroup(x).concat(Semigroup(y))` 来表示一个最小的二元运算单元，一个 Semigroup 盒子的二元运算过程就如图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/347fdeeb805b47af9dc37a96cfe5f6e9~tplv-k3u1fbpfcp-zoom-1.image)

`concat()`函数能够消化任何可能的 Semigroup 运算。我们把加法盒子 `Add` 中的 `concat()` 函数稍作调整，把加号替换为乘号，就能够得到一个乘法运算的 Semigroup 盒子：

```js
// 定义一个类型为 Multi 的 Semigroup 盒子
const Multi = (value) => ({
  value,  
  // concat 接收一个类型为 Multi 的Semigroup 盒子作为入参
  concat: (box) => Multi(value * box.value)
})   

// 输出一个 value=60 的 Multi 盒子
Multi(3).concat(Multi(4)).concat(Multi(5))
```

形如 Add 盒子、Multi 盒子这样，实现了 `concat()`接口的盒子，就是 **Semigroup**（半群）盒子。



  


## 由 Semigroup 推导 Monoid

理解了 Semigroup（半群），也就理解了 Monoid（幺半群）。

> A *monoid* is an algebraic structure intermediate between *semigroups* and groups, and is a *semigroup* having an identity element. ——Wikipedia    
修言直译：Monoid 是一种介于 Semigroup 和 group 之间的代数结构，它是一个拥有了 identity element 的半群。

【划重点】：Monoid 是一个拥有了 identity element 的半群——**Monoid = Semigroup + identity element**

那么什么是 identity element 呢？

这个东西在数学上叫做“单位元”。 单位元的特点在于，**它和任何运算数相结合时，都不会改变那个运算数**。

在函数式编程中，单位元也是一个函数，我们一般把它记为“`empty()` 函数”。

**也就是说，Monoid = Semigroup + `empty()` 函数。**

`empty()` 函数的实现取决于运算符的特征。比如说，加法运算的单位元，就是一个恒定返回 Add(0) 的函数：

```js
// 定义一个类型为 Add 的 Semigroup 盒子
const Add = (value) => ({
  value,  
  // concat 接收一个类型为 Add 的 Semigroup 盒子作为入参
  concat: (box) => Add(value + box.value)
})   


// 这个 empty() 函数就是加法运算的单位元
Add.empty = () => Add(0)

// 输出一个 value=3 的 Add 盒子
Add.empty().concat(Add(1)).concat(Add(2))
```

`empty()` 是单位元的代码形态。单位元的特点在于，**它和任何运算数相结合时，都不会改变那个运算数**。 也就是说，`empty()`**函数的返回值和任何运算数相结合时，也都不会改变那个运算数。**

以加法运算为例，无论我是把 `empty()` 放在 `concat()`运算符的右边：

```js
const testValue = 1  
const testBox = Add(testValue)  

// 验证右侧的 identity（恒等性），rightIdentity 结果为 true
const rightIdentity = testBox.concat(Add.empty()).value === testValue
```

还是把 `empty()`放在 `concat()`运算符的左边：

```js
const testValue = 1  
const testBox = Add(testValue)    

// 验证左侧的 identity（恒等性），leftIdentity 结果为 true
const leftIdentity = Add.empty().concat(testBox).value === testValue
```

`empty()` 总是不会改变运算符另一侧的 `testBox` 盒子的值，这就是“单位元”特征的体现。   

**任意一个 Semigroup 盒子与** `empty()`**一起进行`concat()`二元运算时，其运算结果都一定恒等于那个 Semigroup 盒子本身的值。**

**形如这样的** `empty()`**函数，就是“单位元”思想在函数式编程中的实践。**

**而实现了** `empty()`**函数的 Semigroup 盒子，就是 Monoid 盒子。**

## 小结

本节，我们从最简单的小学数学算式开始，一步一步地从数学中的“群论”推导出了 Semigroup 盒子，接着又基于 Semigroup 推导出了 Monoid 这个更为强大的盒子。相信学到这里，你已经对“Semigroup 和 Monoid **是什么**”的问题了然于胸了。

不过，此时此刻，你脑海中一定还有许多新的问题。

比如：`concat()` 接口除了能做做加法乘法、求个并集之外，还有什么别的神通吗？

再比如：Monoid 盒子比起 Semigroup 仅仅是多了一个 `empty()` 函数，这个单薄的`empty()`函数真的有存在的必要吗？

以及，本文中首次提到了盒子模式下的“二元运算”，这“二元运算”背后又有着什么样的玄机呢？

要想理解到这个层面，我们还需要从实践的角度出发，对 Monoid 作更进一步的探讨。

  
（阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）
