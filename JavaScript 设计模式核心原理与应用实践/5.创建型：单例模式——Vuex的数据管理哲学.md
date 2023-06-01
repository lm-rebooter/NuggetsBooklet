**保证一个类仅有一个实例，并提供一个访问它的全局访问点**，这样的模式就叫做单例模式。

单例模式是设计模式中相对较为容易理解、容易上手的一种模式，同时因为其具有广泛的应用场景，也是**面试题里的常客**。因此单例模式这块我们除了讲解单例模式的原理及其在 Vuex 中的应用实践(本节)，还会附上两道面试真题供大家练手(下节)。    

   
## 单例模式的实现思路

现在我们先不考虑单例模式的应用场景，单看它的实现，思考这样一个问题：如何才能保证一个类仅有一个实例？     
一般情况下，当我们创建了一个类（本质是构造函数）后，可以通过new关键字调用构造函数进而生成任意多的实例对象。像这样：   

```javascript
class SingleDog {
    show() {
        console.log('我是一个单例对象')
    }
}

const s1 = new SingleDog()
const s2 = new SingleDog()

// false
s1 === s2
```

楼上我们先 new 了一个 s1，又 new 了一个 s2，很明显 s1 和 s2 之间没有任何瓜葛，两者是相互独立的对象，各占一块内存空间。而单例模式想要做到的是，**不管我们尝试去创建多少次，它都只给你返回第一次所创建的那唯一的一个实例**。    

要做到这一点，就需要构造函数**具备判断自己是否已经创建过一个实例**的能力。我们现在把这段判断逻辑写成一个静态方法(其实也可以直接写入构造函数的函数体里）：

```javascript
class SingleDog {
    show() {
        console.log('我是一个单例对象')
    }
    static getInstance() {
        // 判断是否已经new过1个实例
        if (!SingleDog.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            SingleDog.instance = new SingleDog()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return SingleDog.instance
    }
}

const s1 = SingleDog.getInstance()
const s2 = SingleDog.getInstance()

// true
s1 === s2
```    

除了楼上这种实现方式之外，getInstance的逻辑还可以用**闭包**来实现：   

```javascript
SingleDog.getInstance = (function() {
    // 定义自由变量instance，模拟私有变量
    let instance = null
    return function() {
        // 判断自由变量是否为null
        if(!instance) {
            // 如果为null则new出唯一实例
            instance = new SingleDog()
        }
        return instance
    }
})()
```

可以看出，在getInstance方法的判断和拦截下，我们不管调用多少次，SingleDog都只会给我们返回一个实例，s1和s2现在都指向这个唯一的实例。    

## 生产实践：Vuex中的单例模式

近年来，基于 Flux 架构的状态管理工具层出不穷，其中应用最广泛的要数 Redux 和 Vuex。无论是 Redux 和 Vuex，它们都实现了一个全局的 Store 用于存储应用的所有状态。这个 Store 的实现，正是单例模式的典型应用。这里我们以 Vuex 为例，研究一下单例模式是怎么发光发热的：     
  
### 理解 Vuex 中的 Store

> Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 (SSOT)”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。       ——Vuex官方文档

在Vue中，组件之间是独立的，组件间通信最常用的办法是 props（限于父组件和子组件之间的通信），稍微复杂一点的（比如兄弟组件间的通信）我们通过自己实现简单的事件监听函数也能解决掉。

但当组件非常多、组件间关系复杂、且嵌套层级很深的时候，这种原始的通信方式会使我们的逻辑变得复杂难以维护。这时最好的做法是将共享的数据抽出来、放在全局，供组件们按照一定的的规则去存取数据，保证状态以一种可预测的方式发生变化。于是便有了 Vuex，这个用来存放共享数据的唯一数据源，就是 Store。        

关于 Vuex 的细节，大家可以参考[Vuex的官方文档](https://vuex.vuejs.org/zh/)，此处提及 Vuex，除了为了拓宽大家的知识面，更重要的是为了说明单例模式在生产实践中广泛的应用和不可或缺的地位。如果对 Vuex 没有兴趣，那么大家只需关注“一个 Vue 应用只能对应一个 Store”这一点即可。
   
### Store 是一个“假单例”

首先，我们需要明确什么是假单例。在这里，假单例的意思是虽然**没有严格遵循单例模式的设计原则，但在实际应用中仍然能够保证实例的唯一性。**

**Vuex 中的 Store 就是这样一个”假单例“——** 尽管在实际应用中通常 `Store` 只有一个全局实例，但从实现上来看，它并不是一个严格意义上的单例模式。

接下来我们将结合 Vuex Store 的源码来说明这一点 。

下面是 Store 类的构造函数的部分源码，完整源码请狠狠地[戳这里](https://github.com/vuejs/vuex/blob/main/src/store.js)：

```js
class Store {
  constructor (options = {}) {
    // ...
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // 将 this 赋值给 store，这是为了在后续的函数中使用 Store 实例的上下文
    const store = this
    // 将 this 中的 dispatch 和 commit 方法解构出来，以便在后续的函数中使用
    const { dispatch, commit } = this
    // 分别为 dispatch 和 commit 方法绑定上下文
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }
    // ...
  }
}
```

在 Vuex 中，我们可以通过 `new Vuex.Store(options)`  调用构造函数来创建一个新的 `Store` 实例。而在楼上贴出的 `Store` 的 `constructor`  关键源码中，并**不存在任何和单例有关的识别/拦截逻辑**。

**这意味着开发者可以通过** `new` **关键字创建多个** `Store` **实例，这显然不符合我们对单例模式的预期。**

下面是一个创建多个 `Store` 实例的例子：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个 store 对象 1 号
const store1 = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// 创建一个 store 对象 2 号
const store2 = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// false，说明 store1 和 store2 是完全不同的两个 store
console.log(store1 === store2)
```

由此我们可以看出，虽然 `Store` 在实践中总是表现得【像个】单例一样，但它本身却并没有真地去实现单例相关的逻辑。

**没有实现单例的** `Store` **，究竟是如何表现出单例般的行为的呢？**

这就要从 `Vuex` 的整体设计上来分析了。

### **Vuex 如何确保 `Store` 的单例特征**

#### Vuex 工作原理分析

`Store` 并没有实现标准的单例模式，但是却能够表现出一种类似于单例的行为。这是因为 **Vuex 从整体设计的层面来保证了** `Store` **在同一个** `Vue` **应用中的唯一性。**

具体来说，我们首先需要关注的是 `Vue.use()` 方法，这个方法允许我们给 `Vue` 应用安装像 `Vuex` 这样的插件。Vuex 插件是一个对象，它在内部实现了一个 `install` 方法，这个方法会在插件安装时被调用，从而把 `Store` 注入到 `Vue` 应用里去。也就是说每 `install` 一次，`Vuex` 都会尝试给 `Vue` 应用注入一个 `Store`。

在 `install` 函数源码中，有一段和我们楼上的 `getInstance()` 非常相似的逻辑：

```js
let Vue // 这个Vue的作用和楼上的instance作用一样
...

export function install (_Vue) {
  // 判断传入的Vue实例对象是否已经被install过Vuex插件（是否有了唯一的 store）
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  // 若没有，则为这个Vue实例对象install一个唯一的Vuex
  Vue = _Vue
  // 将Vuex的初始化逻辑写进Vue的钩子函数里
  applyMixin(Vue)
}
```

**这段和** ` getInstance()  `**非常相似的逻辑，通过判断当前 Vue 应用是否已经安装过 Vuex 插件，保证了在同一个** `Vue` **应用中只存在一个** `Vuex` **实例。**

继续往下看，在 `install` 函数中，我们可以看到 `Vue` 实例被赋值为 `_Vue`，接着作为 `applyMixin(Vue)` 函数的参数触发一次 `applyMixin()` 的调用。`applyMixin()` 函数会在 Vue 实例的 `beforeCreate` 生命周期钩子中，将 `Store` 实例挂载到 `Vue` 实例上。这个“挂载”动作对应的是如下所示的 `vuexInit()` 函数：

```js
function vuexInit () {
  const options = this.$options
  // 将 store 实例挂载到 Vue 实例上
  if (options.store) {
    this.$store = typeof options.store === 'function'
      ? options.store()
      : options.store
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store
  }
}
```

这段代码中最值得我们注意的，是 `else if` 这一行的判断：如果当前组件实例的配置对象中不存在 `store`，但存在父组件实例（`options.parent`）且父组件实例具有 `$store` 属性，那么将父组件实例的 `$store` 赋值给当前组件实例的 `$store`。   
这段逻辑意味着，`$store`实例在 Vue 组件树中是被层层继承下来的——当子组件自身不具备 `$store` 时，会查找父组件的 `$store` 并继承。这样，整个 Vue 组件树中的所有组件都会访问到同一个 `Store` 实例——那就是根组件的`Store`实例。

也就是说，`vuexInit()`的主要作用是将根组件的`Store`实例注入到子组件中，这样所有子组件都可以通过`this.$store`访问到同一个 Store 实例。**这就确保了 Vuex `Store` 在整个 Vue 应用中的唯一性。**

总结一下：`install()`函数通过拦截 `Vue.use(Vuex)` 的多次调用，**保证了在同一个`Vue`应用只会安装唯一的一个`Vuex`实例**；而 `vuexInit()` 函数则**保证了同一个`Vue`应用只会被挂载唯一一个`Store`**。这样一来，从效果上来看，Vuex 确实是创造了两个”单例“出来。

#### “单例 Store”的局限性

注意，我们在楼上所探讨的“`Store` **的唯一性**“是有前提的——这种唯一性是针对同一个 Vue 应用来说的，而不是针对全局来说的。

在全局范围内，Vuex 中的 `Store` 并不一定是唯一的。**因为在同一个页面中，我们可以使用多个 Vue 应用，每个 Vue 应用都可以拥有自己的 Store 实例**。这也解释了为什么`Vuex`没有将单例逻辑放在`Store` 类中去实现，而是将其解构到了 `install` 函数里。

在同一个 Vue 应用中，只会存在一个 Store 实例，但在多个 Vue 应用中，可以存在多个 Store 实例。**在不同的 Vue 应用中，当我们想共享唯一的一个 Store 时，仍然需要通过在全局范围内使用单例模式来确保 Store 的唯一性。**

## 小结

Vuex 的设计遵循了单例模式的思想，通过 ` install()  `函数拦截 `Vue.use(Vuex)`的多次调用，确保了在同一个 Vue 应用中只会安装唯一一个 Vuex 实例；通过 `vuexInit()` 函数，确保了同一个 Vue 应用只会挂载唯一一个 `Store`。

这种设计使得在整个 Vue 应用中，所有组件都能方便地访问同一个 Store 实例。这有助于在整个应用范围内维护一致的状态管理，降低了程序的复杂性。

**尽管 Vuex 并不是严格意义上的单例模式，但它却很大程度上从单例模式的思想中受益，也为我们在实践中应用单例模式提供了全新的思路。**       

除了说在 Vuex 中大展身手，我们在 Redux、jQuery 等许多优秀的前端库里也都能看到单例模式的身影。重要的单例模式自然在面试中有了重要的地位，下一节，我们就来看两道面试真题~



（阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）