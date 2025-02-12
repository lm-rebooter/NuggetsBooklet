在 ECMAScript 规范的定义中，`对象代表属性的集合`，可以理解为 `key-value` 结构的数据容器。

从这一点上来看，其实 JavaScript 中的所有数据，除了 **null** 和 **undefined** 之外，都是对象，即使像布尔、字符串、数字和符号这类 `Primitive` 类型，也能够直接进行属性成员读取和函数成员调用：

```js
true.toString() // "true"
"Hello".length // 5
5.03 .toFixed(1) // "5.0"
Symbol.matchAll.toString() // "Symbol(Symbol.matchAll)"
```

由此，关于对象结构的讨论大体上就演变成了对属性结构的讨论。





## 属性结构

属性成员是如何在对象中存储的呢？其实并非是简单的一个 key 和 一个 value 就够了。因为属性本身还有属性，比如是否只读，是否可删除，是否可遍历。

在 `ES3` 时代，规范规定，一个对象属性（`Property`）可以包含下列 3 个属性（`Attribute`）：

1.  ReadOnly
2.  DontEnum
3.  DontDelete

从 ES5 开始，重新定义了属性的结构，现在它可能包含下面这 6 种属性，为了避免歧义，后面我称之为`属性参数`：

1.  \[\[Value]]
2.  \[\[Writable]]
3.  \[\[Get]]
4.  \[\[Set]]
5.  \[\[Enumerable]]
6.  \[\[Configurable]]

这几种参数并非允许同时存在，其中 \[\[Enumerable]] 和 \[\[Configurable]] 可以一直在，而 \[\[Value]]+\[\[Writable]] 与 \[\[Get]]+ \[\[Set]] 这两对之间是互斥的。这里事实上代表了 ECMAScript 对属性成员的两种格式定义：`数据属性（Data Property）`和`存取器属性（Accessor Property）`。

它们的属性差异如下：

<table>
    <thead>
        <tr>
            <th>类型</th>
            <th width="100%">结构</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>数据属性</td>
            <td>
                1. [[Enumerable]]<br>
                2. [[Configurable]]<br>
                3. [[Value]] <br>
                4. [[Writable]]
            </td>
        </tr>
        <tr>
            <td>存取器属性</td>
            <td>
                1. [[Enumerable]]<br>
                2. [[Configurable]]<br>
                3. [[Get]]<br>
                4. [[Set]]
            </td>
        </tr>
    </tbody>
</table>

从功能上来讲，`存取器属性是数据属性的超集`，数据属性能实现的，存取器属性也都能实现，比如存取器属性中不定义 `[[Set]]` 就相当于数据属性中 `[[Writable]]` 设为 false，即只读。

那我们在编程过程中如何与这两种属性打交道呢？这里就涉及到属性结构的 API 表示，也就是`属性描述符（Property Descriptor）`。

在 TypeScript 中，属性描述符是这样定义的：

```ts
interface PropertyDescriptor {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
}
```

但这并不严格，因为 `value/writable` 与 `get/set` 之间的互斥关系并没有表现出来。将它们混淆在一起是不被允许的。现在我们尝试取出对象中的属性描述符。

定义一个简单 key-value 对象：`{ name: 'js' }`，但实际上对象存储的是 key-descriptor，我们可以用 `Object.getOwnPropertyDescriptor()` 来取出属性描述符：

```js
Object.getOwnPropertyDescriptor({ name: 'js' }, 'name')
```

在 Chrome 下打印出来的是：

<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2fded1a75474d3ea84ed34da7ceba45~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

说明这是一个`数据属性`。以大括号声明的对象，其属性都是数据形式的，如果想定义成`存取器属性`，那么就需要使用到 `Object.defineProperty()` 或者 `Object.defineProperties()` 了：

```js
var obj = {};

let _internal_name = null;

Object.defineProperty(obj, 'name', {
    set(n) {
        _internal_name = n;
    },
    get() {
        return _internal_name;
    },
    configurable: true,
    enumerable: true,
});
```

如果在 `class` 环境下，也可以使用 `setter/getter` 函数：

```js
class Foo {
    #name = null;
    get name() {
        return this.#name;
    }
    set name(n) {
        this.#name = n;
    }
}
```

我们知道了如何把属性定义成哪种类型，那么，日常开发中我们应该如何选择呢？另外属性描述符中的参数都应该如何取值呢？






## 如何使用属性描述符？

如果你的属性希望在被访问的时候，动态输出取值，那么毫无疑问，存取器属性是唯一选项。除此之外，两者几乎一致，包括在其余参数的定义上。

我们先来看看两者共用的参数 `enumerable` 和 `configurable` 都是做什么的吧。

`enumerable` 顾名思义，代表是否可枚举，也就是在 `for...in` 的时候能否被遍历到。在上一章节，我们讲过 **constructor** 在构造函数的 `prototype` 中就定义为 `enumerable=false`，因而不可遍历出来。

还有哪些耳熟能详的属性是不可遍历的呢？我举几个例子：

1.  数组的所有方法，比如 concat、filter、map、reduce，在 `for...in` 时都不可见，这个我们在数组那一章提到过；
2.  字符串的 length 属性，在 `for...in` 时也不可见；
3.  数字对象的所有方法，比如 toPrecision、toFixed、toExponential 等。

直接赋值定义给对象的属性，或者类的非函数成员，默认都是可枚举的，比如下面中的 foo、bar 和 baz：

```js
const obj = { foo: 1 };
obj.bar = 2;

class Foo {
    baz = 2
}
```

如果使用 `Object.defineProperty()` 或者 `Object.defineProperties()`，那么需要确保明确设置 `enumerable=true` 才能开启可枚举性，否则默认是 false：

```js
const obj = {};

Object.defineProperty(obj, 'name', {
    value: 'foo'
});

Object.getOwnPropertyDescriptor(obj, 'name').enumerable; // false
```

`configurable` 参数代表是否`可配置`，这背后代表的行为要更复杂，按照 ECMAScript 定义，如果其为 false，那么：

1.  不允许删除此属性；
2.  不允许在数据属性和存取器属性之间变换；
3.  不允许修改描述符的其他参数（但不包括修改 `value`，以及把 `writable` 设为 false）：
    *   不允许修改 enumerable 的值；
    *   不允许修改 set/get 的值；
    *   不允许将 writable 从 false 改为 true。

其他都还容易记得住，也能理解允许对 `value` 的修改，但为什么还能允许把 `writable` 从 true 改成 false 呢？很遗憾，我没有在 ECMAScript 的规范中找到对这个策略的解释。我们不妨粗浅地这样理解：**`configurable` 并不是为了完全锁定对象，要不然也不会允许对 `value` 的修改，它只是想保证对象结构和表达的稳定性，那么把一个对象从可写改成只读，似乎并不会影响这种稳定性**。

我们验证一下违反 `configurable` 规则的案例：

```js
const obj = {};

Object.defineProperties(obj, {
  // name 为数据属性
  name: {
    value: "foo",
    writable: false,
    enumerable: true,
    configurable: false,
  },
  // age 为存取器属性
  age: {
    get() {},
    set() {},
    enumerable: true,
    configurable: false,
  },
});

// 删除属性
delete obj.name; // ❌ Uncaught TypeError: Cannot delete property 'name' of #<Object>

// 变换属性结构
Object.defineProperty(obj, "name", { // ❌ Uncaught TypeError: Cannot redefine property: name
  get() {
    return "foo";
  },
  enumerable: true,
  configurable: false,
});

// 修改 enumerable
Object.defineProperty(obj, "name", { // ❌ Uncaught TypeError: Cannot redefine property: name
  enumerable: false,
});

// 修改 set/set
Object.defineProperty(obj, "age", { // ❌ Uncaught TypeError: Cannot redefine property: age
  set() {},
  get() {},
});

// 修改 writable=true
Object.defineProperty(obj, "name", { // ❌ Uncaught TypeError: Cannot redefine property: name
  writable: true,
});
```

以上这些错误，都会导致程序中断。因此严格来讲，我们如果想保证程序的绝对健壮，在操作陌生对象时，一是用 `try...catch` 来包裹代码块，二是在修改属性之前探测它的属性描述符，即便是 `obj.name = "bar"` 这样简单的赋值语句也是如此。

> 💡 大家应该能看到，修改一个现有的属性，`defineProperty/defineProperties` 并不需要列举属性描述符的全部参数，而只需要被修改的那几个就可以了。

定义新的属性时，如果不指定，`configurable` 默认也是 false。

以上我们熟悉了属性描述符的两个公共参数，也是最关键的两个，`enumerable` 和 `configurable`。对于两种不同的属性类型来说，它们都还各有两个额外的参数。

数据属性的 `writable` 会阻止对 `value` 的修改，注意，即便是修改前后值一样也不行，`writable` 阻止的是行为，而不管结果。但是 `value` 依然有可能通过 `defineProperty/defineProperties` 来改变取值，这超出了 `writable` 的控制范围：

```js
const obj = {};

Object.defineProperty(obj, 'name', {
    value: 'foo',
    writable: false,
    enumerable: true,
    configurable: true,
});

// 重新定义 value
Object.defineProperty(obj, 'name', {
    value: 'bar',
});
```

如果不声明，新属性的 `writable` 默认也是 false。

存取器属性中的 `set/get` 与 **Java Bean** 的思想是一致的。这个能力允许我们能拦截对属性的赋值和读取操作，熟悉的同学应该知道，Vue 2 正是利用这一特性来监视数据的变更，进而驱动视图的。

set 和 get 可以不成对出现，如果缺失了 set，那么该属性就是只读的；如果缺失了 get，那么该属性就是只写的；如果都不存在，那么该属性会被当作一个 `value=undefined` 的数据属性。

> 💡 `set/get` 必须是函数类型，即便是异步函数、生成器函数也可以，否则会抛出错误。

两种属性结构我们就讨论到这。但是对于一个对象来说，除了这些后期定义的属性之外，还有很多内部属性发挥着至关重要的作用，比如前面我们在函数那一讲当中提到 `[[Call]]` 和 `[[Construct]]` 都属于对象内部可能存在的属性。除此之外， ECMAScript 还定义了如下这些内部属性：

<table>
            <thead>
                <tr>
                    <th width="20%">属性名</th>
                    <th width="80%">格式</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>[[GetPrototypeOf]]</td>
                    <td>() → Object | Null</td>
                </tr>
                <tr>
                    <td>[[SetPrototypeOf]]</td>
                    <td>(Object | Null) → Boolean</td>
                </tr>
                <tr>
                    <td>[[IsExtensible]]</td>
                    <td>() → Boolean</td>
                </tr>
                <tr>
                    <td>[[PreventExtensions]]</td>
                    <td>() → Boolean</td>
                </tr>
                <tr>
                    <td>[[GetOwnProperty]]</td>
                    <td>(propertyKey) → Undefined | PropertyDescriptor</td>
                </tr>
                <tr>
                    <td>[[DefineOwnProperty]]</td>
                    <td>(propertyKey, PropertyDescriptor) → Boolean</td>
                </tr>
                <tr>
                    <td>[[HasProperty]]</td>
                    <td>(propertyKey) → Boolean</td>
                </tr>
                <tr>
                    <td>[[Get]]</td>
                    <td>(propertyKey, Receiver) → any</td>
                </tr>
                <tr>
                    <td>[[Set]]</td>
                    <td>(propertyKey, value, Receiver) → Boolean</td>
                </tr>
                <tr>
                    <td>[[Delete]]</td>
                    <td>(propertyKey) → Boolean</td>
                </tr>
                <tr>
                    <td>[[OwnPropertyKeys]]</td>
                    <td>() → List of property keys</td>
                </tr>
                <tr>
                    <td><b>[[Prototype]]</b></td>
                    <td>Object | Null</td>
                </tr>
            </tbody>
        </table>

有经验的同学可能已经发现了，里面的函数都有对应的 API 可用，比如其中的 `[[DefineOwnProperty]]` 其实就对应着 `Object.defineProperty`。确实如此，当我们调用静态函数 `Object.defineProperty` 的时候，本质上是在对象身上调用其 `[[DefineOwnProperty]]` 内部函数，其他函数大体也是如此。

我们要特别关注的是最后那个叫做 `[[Prototype]]` 的属性，这不是一个函数，在规范上是叫做 `slot`，它是实现原型链、进而实现继承的根本。





## 原型链与对象继承

当我们在 Chrome 的控制台上打印一个空对象时，就能看到 `[[Prototype]]`，展开的话，可见很多现成的属性：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e959e6a50294bbb8edd8d5de20748af~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

因此，这个 `[[Prototype]]` 属性一定是指向某个对象的，那么是哪个对象呢？

是 `Object.prototype`。我们在前面函数那一讲中提到过，作为构造函数，都会有一个 `prototype` 属性。 `Object` 也是构造函数，那么它有一个 `prototype` 就合情合理了。这是一个由 JavaScript 引擎初始化的一个预置对象。

要获取 `[[Prototype]]` 属性，可以使用 `Object.getPrototypeOf()` 函数：

```js
Object.getPrototypeOf({}) === Object.prototype // true
```

上面这一行代码就能说明了这个属性的指向关系。除了 `Object.getPrototypeOf()` 外，还能看到一个遗留的属性 `__proto__` 也能达到同样的效果：

```js
({}).__proto__ === Object.prototype // true
```

不过不建议用在线上的生产代码中，日常用来测试/调试还是非常方便的。

言归正传，`[[Prototype]]` 有什么用呢？关键知识来了，**当我们在一个对象上访问属性的时候，如果本身没有这个属性，那么就会尝试在其 `[[Prototype]]` 对象上寻找，如果还是没找到，就继续向上查找 `[[Prototype]]`，一直会找到 `Object.prototype` 为止，因为它的 `[[Prototype]]` 等于 null**。

一个对象的 `[[Prototype]]` 属性称之为它的原型对象，因此，这种向上遍历查找关系就形成了原型链：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb48dfa152c1400f90f927490ed03fd0~tplv-k3u1fbpfcp-watermark.image?)

我们来验证一下，首先有一个对象 `{}`，没有定义任何属性，但是依然可以调用 `toString()` 函数：

```js
({}).toString() // "[object Object]"
```

这个 `toString()` 哪里来的呢？虽然对象本身没有，但是它的原型，也就是 `Object.prototype` 却有，因此几乎任意对象都可以调用 `toString()`，而不必单独定义它。

我们再尝试一个更复杂的例子：

```js
var a = { name: "a", age: 10, gender: "female" };
var b = {
  name: "b",
  age: 15,
  gender: "male",
  getGender() {
    return this.gender;
  },
};
var c = {
  name: "c",
  age: 20,
  getAge() {
    return this.age;
  },
};
var d = {
  getName() {
    return this.name;
  },
};

// a => b => c => d => null
a.__proto__ = b;
b.__proto__ = c;
c.__proto__ = d;
d.__proto__ = null;

console.log(a.getName(), a.getAge(), a.getGender()); // a 10 female
console.log(b.getName(), b.getAge(), b.getGender()); // b 15 male
console.log(c.getName(), c.getAge()); // c 20
```

我们手动实现了一个原型链，a 的原型是 b， b 的原型是 c， c 的原型是 d，而 d 的原型是 null。根据原型链的原理，上游的属性可以被下游访问得到，因此在 d 中定义的 **getName** 可以被 a、b、c 访问到，c 中定义的 **getAge** 可以被 a、b 访问到，b 中定义的 **getGender** 可以被 a 访问到。而由于 d 的原型是 null，没有链接到 `Object.prototype`，因此所有对象都访问不到 `toString()`，原理图示如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d25bf775755f4d56bb115c6d268a6da2~tplv-k3u1fbpfcp-watermark.image?)

> 💡 上面代码中的 `__proto__` 仅为测试代码方便之用，你应该用 `Object.setPrototypeOf`，它映射了内部属性中的 `[[SetPrototypeOf]]`。

一般来说，当我们用构造函数来创建对象的时候，对象的原型就会自动指向构造函数的 `prototype` 属性，即：

```js
function Dog() {}

new Dog().__proto__ === Dog.prototype // true
```

这个类比较具象，大家应该容易理解，我换一个绕一点的：

```js
function foo() {}
foo.__proto__ // ?
```

foo 的原型是谁呢？我们知道，函数也是对象，它是由 `Function` 隐式构造的，因此 *foo.\_\_proto\_\_* 自然等于 `Function.prototype`。这也是预定义的一个对象，如果我们把它打印出来，发现它也是一个函数：

```js
typeof Function.prototype // "function"
```

根据 ECMAScript 的定义，这个特殊函数不能作为构造函数（因此没有 `prototype` 属性），始终返回 undefined，并且其原型是 `Object.prototype`：

```js
Function.prototype.__proto__ === Object.prototype // true
```

现在再来看这张业界比较有名的图，是不是就会更容易理解了呢？

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a53ff325b48248ea9bcc9642b0762f1e~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

对象除了用构造函数创建以外，还可以用大括号以字面量的方式创建，并且能同时设置原型、定义属性，这需要用到 `Object.create()` 函数：

```js
var proto = {
    getName() {
        return this.name;
    }
};

var k = Object.create(proto, {
    name: {
        value: 'foo',
        writable: true,
        configurable: true,
        enumerable: true,
    }
});

k.getName(); // 'foo'
k.__proto__ === proto; // true
```

如果只传入 null，那么就是在创建一个真正的空对象，连原型都不存在，这时候用 `for...in` 遍历的话， 什么都遍历不到，比较适合用于对遍历敏感的场合：

```js
for (let key in Object.create(null)) {
    console.log(key);
}
```




## 小结

对象的结构看着比较复杂，但实际上说起来也比较简单，它可以分成两个部分。

1.  一部分是自定义的属性，这部分属性以`属性描述符`的形式存在，可以是`数据属性`也可以是`存取器属性`。无论哪种，最终行为都会受到公共参数 `enumerable` 和 `configurable` 的控制。
2.  另一部分是内部的属性，特别需要关注是 `[[Prototype]]`，通过它，不同对象可以组成了一个单向的`原型链`，属性的访问顺着原型链向上查找，一直到 `Object.prototype` 为止。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10b8247f8d2e40338e8d450c3c686780~tplv-k3u1fbpfcp-watermark.image?)

创建指定的原型链关系，测试/调试环境可以用 `__proto__`，生产环境应该用 `Object.setPrototypeOf` 和 `Object.create`。但注意`原型链不可以形成一个环`。

建议大家配合着我们之前学习过的函数知识，把 `Object`、`Function` 和自定义构造函数以及它的实例之间的原型关系搞清楚，谁的原型是谁，谁的 `constructor` 又是谁。

最后留一个小作业给大家：试想，不使用 class 语法，如何定义一个`类数组`对象，可以共享所有数组的函数？
