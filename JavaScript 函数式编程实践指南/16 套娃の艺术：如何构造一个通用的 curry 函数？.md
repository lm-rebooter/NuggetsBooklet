上回书说到，柯里化和偏函数一脉相承，两者解决的其实是同一类问题，也就是“调整函数的元”的问题。

我们同时提到了柯里化和偏函数都能够促进“逻辑的复用”，这是因为调整存量函数的元、生成新函数、减少重复传参的这整个过程，本身就是一个逻辑复用的过程，并且很多时候是以高阶函数的形式实现的。

我们在上一节围绕偏函数举了不少例子，本节，我们把重点放在柯里化上。

## 柯里化解决 multiply 函数的参数问题

既然偏函数和柯里化解决的都是函数的元的问题，那么 multiply 函数一元化为 multiply3，想必也能够用柯里化求解。

大家还记得我们上一节是如何构造一个名为 curry 的高阶函数的吗？这里我们简单回顾下：

```js
// 定义高阶函数 curry
function curry(addThreeNum) {
  // 返回一个嵌套了三层的函数
  return function addA(a) {
    // 第一层“记住”参数a
    return function addB(b) {
      // 第二层“记住”参数b
      return function addC(c) {
        // 第三层直接调用现有函数 addThreeNum
        return addThreeNum(a, b, c)
      }
    }
  }
}

// 借助 curry 函数将 add
const curriedAddThreeNum = curry(addThreeNum)
// 输出6，输出结果符合预期
curriedAddThreeNum(1)(2)(3)
```

本着“对拓展开放，对修改封闭”的原则，我们在存量函数 addThreeNum 的基础上进行了层层包装。

本着同样的原则，我们也可以在存量函数 multiply 的基础上做一层包装，实现 multiply3：

```js
// 一元函数，一个入参
function multiply(x, y) {
  return x*y
}

// 定义一个包装函数，专门用来处理偏函数逻辑
function curry(func) {
  // 逐层拆解传参步骤 - 第一层
  return function(x){
    // 逐层拆解传参步骤 - 第二层
    return function(y) {
      // 参数传递完毕，执行回调
      return func(x, y)
    }
  }
}
const multiply3 = curry(multiply)(3)

// 输出6
multiply3(2)
```

  


## 柯里化的“套路”

这里简单复习一道上一节做过的辨析题：**柯里化和偏函数的区别是什么？**

> 柯里化说的是一个 n 元函数变成 n 个一元函数。
> 
> 偏函数说的是一个 n 元函数变成一个 m(m < n） 元函数。
> 
> 对于柯里化来说，不仅函数的元发生了变化，函数的数量也发生了变化（1个变成n个）。
> 
> 对于偏函数来说，仅有函数的元发生了变化（减少了），函数的数量是不变的。
> 
> ——引用自本册[第15节](https://juejin.cn/book/7173591403639865377/section/7175423003319074876)

也就是说，柯里化函数的特征，在于它是嵌套定义的多个函数，也就是“套娃”。

因此，**柯里化的实现思路，我愿称之为“套娃之路”，简称“套路”。**

这个“套路”有多深？截至目前来看，完全取决于原函数的参数个数。

比如我们的第一个柯里化示例，它是三元函数，就相应地需要套三层：

```js
function curry(addThreeNum) {
  // 返回一个嵌套了三层的函数
  return function addA(a) {
    // 第一层“记住”参数a
    return function addB(b) {
      // 第二层“记住”参数b
      return function addC(c) {
        // 第三层直接调用现有函数 addThreeNum
        return addThreeNum(a, b, c)
      }
    }
  }
}
```

而本节柯里化 multiply 函数，由于此函数是二元函数，curry 就只需要两层：

```js
function curry(func) {
  // 第一层“记住”参数x
  return function(x){
    // 第二层“记住”参数y
    return function(y) {
      // 参数传递完毕，执行回调
      return func(x, y)
    }
  }
}
```

这样看来，似乎 curry 函数怎么写，还得先看回调函数的入参有几个。

如果我的一个应用程序里，有二元函数、三元函数......甚至 n 元函数，它们都想被柯里化，那岂不是要写不计其数个 curry 函数来适配每一个元数了？

这属于是暴力枚举了，这很不函数式呀。

有没有可能， curry 函数内部可以结合入参的情况，自动判断套娃要套几层呢？

话都说到这儿了，咱也就引出了**本节的重点，同时也是面试的重点——通用柯里化函数的实现**。

## 通用柯里化函数：自动化的“套娃”

### 思路分析

通用的 curry 函数应该具备哪些能力？

最关键的一点，如小标题所言，它要能“自动套娃”。

也就是说，不管我传入的函数有多少个参数，curry 都应该能分析出参数的数量，并且动态地根据参数的数量自动做嵌套。

我们简单拆解一下这个函数的任务：

1.  获取函数参数的数量
1.  自动分层嵌套函数：有多少参数，就有多少层嵌套
1.  在嵌套的最后一层，调用回调函数，传入所有入参。

#### 获取函数参数的数量

首先第一步，获取函数参数的数量。

这个简单，在 JS 里，函数作为一等公民，它和对象一样有许多可访问的属性。其中 Function.length 属性刚好就是用来存放函数参数个数的。

通过访问函数的 length 属性，就可以拿到函数参数的数量，如下：

```js
function test(a, b, c, d) {
}

// 输出 4
console.log(test.length)
```

#### 自动化“套娃”

给定一个嵌套的上限，期望函数能够自动重复执行嵌套，直至达到上限。

而“**嵌套**”的逻辑，摊开来看的话无非是：

1.  判断当前层级是否已经达到了嵌套的上限
1.  若达到，则执行回调函数；否则，继续“**嵌套**”

在嵌套函数内部继续嵌套，相当于是“**我调用我自己**”。

而“我调用我自己”有个学名，叫做“递归”。

没错，这里，我们正是借助递归来实现所谓的“自动化套娃”。  


#### 递归边界的判定

curry 函数会在每次嵌套定义一个新的函数之前，先检查当前层级是否已经达到了嵌套的上限。

也就是说每一次递归，都会检查当前是否已经触碰到了递归边界。

一旦触碰到递归边界（嵌套上限），则执行递归边界逻辑（也就是回调函数）。

那么这个递归边界怎么认定呢？

柯里化的过程，是层层“记忆”每个参数的过程。每一层嵌套函数，都有它需要去“记住”的参数。如果我们递归到某一层，发现此时已经没有“待记忆”的参数了，那么就可以认为，当前已经触碰到了递归边界。

明确了这三个任务的解法，我们就可以开始写代码啦！

### 编码实现

（解析在注释里）

```js
// curry 函数借助 Function.length 读取函数元数
function curry(func, arity=func.length) {
  // 定义一个递归式 generateCurried
  function generateCurried(prevArgs) {
    // generateCurried 函数必定返回一层嵌套
    return function curried(nextArg) {
      // 统计目前“已记忆”+“未记忆”的参数
      const args = [...prevArgs, nextArg]  
      // 若 “已记忆”+“未记忆”的参数数量 >= 回调函数元数，则认为已经记忆了所有的参数
      if(args.length >= arity) {
        // 触碰递归边界，传入所有参数，调用回调函数
        return func(...args)
      } else {
        // 未触碰递归边界，则递归调用 generateCurried 自身，创造新一层的嵌套
        return generateCurried(args)
      }
    }
  }
  // 调用 generateCurried，起始传参为空数组，表示“目前还没有记住任何参数”
  return generateCurried([])
}
```

## 柯里化解决组合链的元数问题

接下来我们就借助一个函数元数五花八门的组合链，来验证一下通用 curry 函数的效果。

首先定义一系列元数不等、且不符合一元要求的算术函数：

```js
function add(a, b) {
  return a + b
}

function multiply(a, b, c) {
  return a*b*c
}

function addMore(a, b, c, d) {
  return a+b+c+d
}

function divide(a, b) {
  return a/b
}
```

此时若像下面这样直接把四个函数塞进 pipe 中去，必定是会倒沫子的：

```js
const compute = pipe(add, multiply, addMore, divide)
```

我们需要首先对四个函数分别作“一元化”处理。

这“一元化”处理的第一步，就是借助 curry 函数把它们各自的传参方式重构掉：

```js
const curriedAdd = curry(add)
const curriedMultiply = curry(multiply)
const curriedAddMore = curry(addMore)
const curriedDivide = curry(divide)
```

然后对这些函数逐个传参，传至每个函数只剩下一个待传参数为止。这样，我们就得到了一堆一元函数：

```js
const compute = pipe(
  curriedAdd(1), 
  curriedMultiply(2)(3), 
  curriedAddMore(1)(2)(3), 
  curriedDivide(300)
)
```

试着调用一下 compute，结果符合预期：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cc6a5cba2634fda9cf42b387e6dd520~tplv-k3u1fbpfcp-zoom-1.image)   
  
   （阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）