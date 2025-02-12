本节，我们来认识函数式编程的第二个关键特征：**函数是一等公民**


## “头等函数”与“一等公民”

开篇我想先对两个常见的概念进行辨析：“头等函数”与“一等公民”。

有的同学比起“函数是一等公民”，会更加熟悉“xx拥有头等函数”这样的说法。其实两者表达的是同个意思。

  


如果你在维基百科中搜索“头等函数”这一词条，你将找到这样一条描述：

> a programming language is said to have **first-class functions** if it treats functions as first-class citizens.  
 （笔者译：如果一门编程语言将函数当做一等公民对待，那么这门语言被称作“拥有头等函数“）    
                                                    ——wikipedia

这条定义将“头等函数”与“函数是一等公民”划上了等号——“头等函数”就是“被当做一等公民对待的函数”。

那么什么是程序世界的“一等公民”？“一等公民”又有哪些“特殊待遇”呢？

我们或许可以从 MDN 对“First-Class Function”的阐释中找到这个问题的答案：

> 当一门编程语言的函数可以被当作变量一样用时，则称这门语言拥有**头等函数**。例如，在这门语言中，函数可以被当作参数传递给其他函数，可以作为另一个函数的返回值，还可以被赋值给一个变量。
                                  ——MDN Web Docs

【划重点】：头等函数的核心特征是“**可以被当做变量一样用**”。

“可以被当做变量一样用”意味着什么？它意味着：

1.  可以被当作参数传递给其他函数
1.  可以作为另一个函数的返回值
1.  可以被赋值给一个变量

以上三条，就是“函数是一等公民”这句话的内涵。

## “一等公民”的 JS 函数

接下来我们首先趁热打铁，通过几个例子来验证一下“一等公民”的特征是如何在 JS 函数身上得到体现的。

### JS 函数可以被赋值给一个变量

```js
// 将一个匿名函数赋值给变量 callMe
let callMe = () => {
   console.log('Hello World！')
}

// 输出 callMe 的内容
console.log(callMe)
// 调用 callMe
callMe()

// 将一个新的匿名函数赋值给变量 callMe
callMe = () => {
  console.log('Hello 修言~')
}

// 输出 callMe 的内容
console.log(callMe)
// 调用 callMe
callMe()
```

在这个例子中，我们成功将两个匿名函数先后赋值给了变量 `callMe`。`callMe` 被赋值为一个函数后，我们不仅可以通过添加两个圆括号来调用它，也可以像访问普通变量一样查看它的内容。  


### JS 函数可以作为参数传递

咱要是说“JS 函数作为参数传递”，你可能还不太能转过这个弯儿来。但咱要是说“回调函数”，你肯定一下就来精神了——它可不就是在说回调函数么！

众所周知，回调函数是 JS 异步编程的基础。在前端，我们常用的事件监听、发布订阅等操作都需要借助回调函数来实现。比如这样：

```js
function consoleTrigger() {
    console.log('spEvent 被触发')
}   

jQuery.subscribe('spEvent', consoleTrigger)
```

在这个例子中，`consoleTrigger` 函数就作为 `subscribe` 函数的第 2 个入参被传递。

而在 Node 层，我们更是需要回调函数来帮我们完成与外部世界的一系列交互（也就是所谓的“副作用”）。

这里举一个异步读取文件的例子：

```js
function showData(err, data){
    if(err) {
      throw err
    }
    // 输出文件内容
    console.log(data);
})

// -- 异步读取文件
fs.readFile(filePath, 'utf8', showData)
```

在这个例子中， `showData` 函数作为 `readFile` 函数的第 3 个入参被传递。

### JS 函数可以作为另一个函数的返回值

函数作为返回值传递，基本上都是馋人家闭包的特性。比如下面这个例子：

```
function baseAdd(a) {
  return (b) => {
    return a + b
  };
};

const addWithOne = baseAdd(1)

// .... (也许在许多行业务逻辑执行完毕后）

const result = addWithOne(2)
```

显然，`add` 函数想要做一个加法，但是在只能够确认其中一个加数（`a`）的时候，它并不急于立刻做这个加法。

怎么办呢？先把这个已经确定的加数（`a`）以【闭包中的自由变量】的形式存起来，然后返回一个待执行的加法函数。等什么时候第二个加数也确定了，就可以立刻执行这段逻辑。  


## “一等公民”的本质：JS 函数是可执行的对象

吃了这么多栗子🌰，想必大家现在已经深刻地理解了“函数是 JavaScript 的一等公民”这句话的内涵。

那么为什么 JS 中的函数这么牛x，可以为所欲为呢？

本质上是因为**它不仅仅是个函数，它还是个对象**。

如下图所示，JS 函数确实是一个对象，它的类型是 Function，它具备 Function 原型上的一切属性和方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a749b992a86847c89df2c2718e997e7c~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37fbeac64cbd48258dee60e9a0d2590e~tplv-k3u1fbpfcp-zoom-1.image)

这里需要强调的是，根据最新版的红宝书（《JavaScript 高级程序设计》第4版）定义，JavaScript 有且仅有以下 7 种数据类型：

-   Undefined 类型
-   Null 类型
-   Boolean 类型
-   Number 类型
-   String 类型
-   Symbol 类型
-   Object 类型

（作者注：结合最新的 ES 标准，还有一个新的类型 BigInt）

尽管在早期 ES 规范还不太清晰的时候，有一些 JS 著作中曾经将 Function 单独拿出来作为和 Object 并列的一种数据类型。但事实上，**并没有一种数据类型叫 Function**，Function 和 Array、Date 这些 built-in Class 一样，都属于对象类型。

既然函数也是对象，那么对象能干的事，函数也能干。

对象能干啥？别的不说，咱对照“一等公民”的特征来一个一个看一下：

1.  能不能赋值给变量？能！
1.  能不能作为函数参数传递？能！
1.  能不能作为返回值返回？能！

到这里我们不难看出，"First-Class Function（头等函数）" 的本质，其实是"First-Class Object（头等对象）”。JS 函数的本质，就是**可执行的对象**。

  


## 拓展：“一等公民的函数”意味着什么

### “一等公民”的学术背景

"一等公民“这一词条最早可以追溯到 1960 年，彼时计算机科学家[克里斯托弗·斯特雷奇](https://zh.wikipedia.org/wiki/%E5%85%8B%E9%87%8C%E6%96%AF%E6%89%98%E5%BC%97%C2%B7%E6%96%AF%E7%89%B9%E9%9B%B7%E5%A5%87)仅仅是引入了这一概念，但并没有给出严格的术语定义，只是给出了[ALGOL](https://zh.wikipedia.org/wiki/ALGOL)语言中实数和过程的对比。

时下当我们谈及“一等公民”的时候，更多的是在讨论 [拉斐尔·芬克尔](https://zh.wikipedia.org/w/index.php?title=%E6%8B%89%E6%96%90%E5%B0%94%C2%B7%E8%8A%AC%E5%85%8B%E5%B0%94&action=edit&redlink=1) 在 《*Advanced Programming language Design*》一书中所描述的”一等值“：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbdbb6f7cfc642dbbc9b91eb580eee01~tplv-k3u1fbpfcp-zoom-1.image)  


如图中的表格所示，老爷子根据以下三个条件的满足情况，将值划分为了三种类型：

1.  pass value as a parameter (能否当做参数传递）
1.  return value from a procedure（能否作为返回值返回）
1.  assign value into a variable（能否赋值给变量）

按照表格的示意，三个条件全部满足的，就认为它是“一等值”，也就是“一等公民”。只满足第一条的，则是“二等值”，一条也不满足的，属于”三等值”。

事实上，除了“一等值”的定义被广泛使用至今外，“二等值”、“三等值”这些定义在行业里的接受度并不高。大家知道有这种说法即可。

### “一等公民”的现实意义

“一等公民的函数”，并不仅仅意味着函数符合了这样那样的特征，还意味着函数在 JS 世界中，具有最高的自由度。

这“最高的自由度”，是从能力的角度来说的。它意味着函数是 JS 世界里技能树最满的家伙，别人能干的活，它能干，别人干不了的活，它还能干。

这直接决定了函数可以在 JS 世界里横着走，可以帮我们做任何我们想要做的事情，这也使“以函数为基本单位构建应用程序”成为可能。

由此我们可以断言，任何语言如果想要实现对函数式编程范式的支持，就必须支持“函数是一等公民”这一特性。