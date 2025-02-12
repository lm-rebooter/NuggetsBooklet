#### $\color{lightPink}保姆式教学の温馨提示$

本节内容包含两部分，前半部分是对上一节的剖析和拓展（话题核心仍然是 Immer.js），后半部分则是对整个 Immutability 知识模块的总结。

其中，前半部分属于选学内容，跳过它，并不影响你理解函数式编程。

如果你时间有限，希望尽快地构建函数式编程的整体知识脉络，那么你可以直接跳到本节的“总结”部分。

如果你对 Immer.js 很感兴趣，又不小心跳读到了这里，那么你需要往回再跳一节，以此来获取阅读本节所需的知识上下文。

## Produce 工作原理：将拷贝操作精准化

结合上一节的源码提取+解析，我们不难看出，`produce` 可以像 Immutable.js 一样，精准打击那些需要执行写操作的数据。**将“变与不变”分离，确保只有变化的部分被处理，而不变的部分则将继续留在原地。**

但 `produce` 并没有像 Immutable.js 一样打数据结构的主意，而是将火力集中对准了“拷贝”这个动作。

它严格地控制了“拷贝”发生的时机：当且仅当写操作确实发生时，拷贝动作才会被执行。

具体到我们在上一节讨论过的用例来说，在我们调用 `produce` 执行读操作前后，`baseObj` 和 `doNothingObj` 是严格相等的：

```js
// 这是我的源对象
const baseObj = {
  a: 1,
  b: {
    name: "修言"
  }
}

// 这是一个执行写操作的 recipe
const changeA = (draft) => {
  draft.a = 2
}


// 这是一个不执行写操作、只执行读操作的 recipe
const doNothing = (draft) => {
  console.log("doNothing function is called, and draft is", draft)
}

// 借助 produce，对源对象应用写操作，修改源对象里的 a 属性
const changedObjA = produce(baseObj, changeA)

// 借助 produce，对源对象应用读操作
const doNothingObj = produce(baseObj, doNothing)

// 顺序输出3个对象，确认写操作确实生效了
console.log(baseObj)
console.log(changedObjA)
console.log(doNothingObj)

// 【源对象】 和 【借助 produce 对源对象执行过读操作后的对象】 还是同一个对象吗？
// 答案为 true
console.log(baseObj === doNothingObj)
// 【源对象】 和 【借助 produce 对源对象执行过写操作后的对象】 还是同一个对象吗？
// 答案为 false
console.log(baseObj === changedObjA)
// 源对象里没有被执行写操作的 b 属性，在 produce 执行前后是否会发生变化？
// 输出为 true，说明不会发生变化
console.log(baseObj.b === changedObjA.b)
```

**只要写操作没执行，拷贝动作就不会发生**。

只有当写操作确实执行，也就是当我们试图修改 `baseObj` 的 `a` 属性时，`produce` 才会去执行拷贝动作：先浅拷贝一个 `baseObj` 的副本对象（`changedObjA`）出来，然后再修改 `changedObjA` 里的 `a`。

这一步对应的是 `produce` 函数对 `setter` 的代理逻辑：

```
const baseHandler = {
  set(obj, key, value) {
    // 先检查 copy 是否存在，如果不存在，创建 copy
    if (!copy) {
      copy = { ...base }
    }
    // 如果 copy 存在，修改 copy，而不是 base
    copy[key] = value
    return true
  }
}
```

这样一来，`changedObjA` 和 `baseObj` 显然是两个不同的对象，**数据内容的变化和引用的变化同步发生了**，这**符合我们对 Immutability 的预期**。

与此同时，`changedObjA.b` 和 `baseObj.b` 是严格相等的，说明两个引用不同的对象，仍然**共享着那些没有实际被修改到的数据**。由此也就实现了数据共享，避免了暴力拷贝带来的各种问题。

`produce` 借助 Proxy，将拷贝动作发生的时机和 `setter` 函数的触发时机牢牢绑定，确保了拷贝动作的精确性。 而逐层的浅拷贝，则间接地实现了数据在新老对象间的共享。

## 拓展：“知其所止”的“逐层拷贝”

这里我想要给大家展开说明一下这个“逐层的”浅拷贝。

在我们的极简版 `produce` 里，着重突出了 `setter` 函数的写逻辑，也就是对“拷贝时机”的描述，淡化了其它执行层面的细节。

而在 Immer.js 中，完整版 `produce` 的浅拷贝其实是**可递归**的。

举例来说，在本文的案例中，`baseObj` 是一个嵌套对象，一共有两层（如下图红圈所示）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/184f1ff1dbb9442fa1b30170e245697c~tplv-k3u1fbpfcp-zoom-1.image)

外面的圈圈表示第一层，里面的圈圈表示第二层（也就是 `b` 属性指向的对象）。

**无论对象嵌套了多少层，每一层对于写操作的反应是一致的，都会表现为“修改时拷贝”。**

我继续用 `baseObj` 举个例子，这次我们来看 `b` 属性（它是一个对象）。

如果我对 `b` 属性执行了写操作，结果会是怎样的呢？

请看下面这段代码（注意看解析）：

```js
import produce from "immer";

// 这是一个执行引用类型写操作的 recipe
const changeB = (draft) => {
  draft.b.name = " 修个锤子"
}

// 借助 produce 调用 changeB
const changedObjB = produce(baseObj, changeB)
// 【源对象】 和 【借助 produce 对源对象执行过写操作后的对象】 还是同一个对象吗？
// 答案为 false
console.log(baseObj === changedObjB)
// 【b 属性】 和 【借助 produce 修改过的 b 属性】 还是同一个对象吗？
// 答案为 false
console.log(baseObj.b === changedObjB.b)
```

从结果上来看， 即便对于嵌套的对象来说，**数据内容的变化和引用的变化也能同步发生**。

这是因为 `produce` **不仅会拦截** `setter` **，也会拦截** `getter`。

通过对 `getter` 的拦截，`produce` 能够按需地对被访问到的属性进行“懒代理”：你访问得有多深，代理逻辑就能走多深；而所有被代理的属性，都会具备新的 `setter` 方法。

当写操作发生时，`setter` 方法就会被逐层触发，呈现“逐层浅拷贝”的效果。

**“逐层浅拷贝”是 Immer 实现数据共享的关键。**

假设我的对象嵌套层级为 10 层，而我对它的属性修改只会触达第 2 层，“逐层的浅拷贝”就能够帮我们确保拷贝只会进行到第 2 层。

“逐层的浅拷贝”如果递归到最后一层，就会变成深拷贝。

对于引用类型数据来说，“暴力拷贝”指的也就是深拷贝。

“暴力拷贝”之所以会带来大量的时间空间上的浪费，本质上是因为它在拷贝的过程中不能够“**知其所止**”。

而“逐层的浅拷贝”之所以能够实现数据共享，正是因为它借助 Proxy 做到了“**知其所止**”。

（注：实际 produce 源码中递归的实现会复杂得多，Immer.js 在性能方面的各种处理也复杂得多。本文扣题函数式思想，仅提取 produce 中与不可变数据强相关的逻辑进行了选讲，对完整源码感兴趣的同学请狠狠地点击[这里](https://github.com/immerjs/immer)）

## 思考：“知其所止”的软件设计表达

无论是“精准拷贝”、“修改时拷贝”，还是“逐层拷贝”，其背后体现的都是同一个思想——“按需”。

“知其所止”的软件设计表达，就是“按需”。

对于 Immutable.js 来说，它通过构建一套原生 JS 无法支持的 Trie 数据结构，最终实现了树节点的按需创建。

对于 Immer.js 来说，它借助 Proxy 的 getter 函数实现了按需代理，借助 Proxy 的 setter 函数实现了对象属性的按需拷贝。

可见，想要实现高效的 Immutability，“按需变化”是一个不错的切入点。

## 总结： Immutability 的实践演进

至此，关于 Immutability ，我们已经讨论了 5 节。

现在请大家回顾一下：对于 JS 来说，Immutability 实践的直接目的是什么？

简单来说，是为了解决**数据内容变化与数据引用变化不同步的问题**。

我拿到一个引用类型数据（`A`)，修改了其中的一个 `a` 属性，然后所有依赖 `A.a` 进行计算的函数逻辑全炸了，牵一发而动全身，这不是我们想要的结局。

我们希望一旦引用类型数据（`A`）的内容改变了，我们就能获取到一个新的引用，这个引用指向一套已经发生改变的数据（`A'`)， `A` 和 `A'` 应该是泾渭分明的。

暴力拷贝，可以做到“泾渭分明”，但是对于规模较大的数据来说，它太低效了。

于是，社区的 Immutability 解决方案百花齐放，Immer.js 和 Immutable.js 就是其中的佼佼者。

Immutable.js 底层是持久化数据结构，而 Immer.js 的底层是 Proxy 代理模式。

两者虽然在具体的工作原理上大相径庭，但最终指向的目的却是一致的：使数据的引用与数据内容的变化同步发生；并且在这个过程中，按需处理具体的变化点，提升不可变数据的执行效率。   
 
（阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）