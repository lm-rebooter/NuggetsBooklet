前面讲到的 String 类型可以作为对象的 key，今天我们来学习另一个可以作为 key 的类型，就是 `Symbol`。

`Symbol` 是一个看起来比较奇怪的 Primitive 类型，为什么这样说呢？试问如果有 JavaScript 代码满足以下等式：

```js
A !== A
```

A 是 Primitive 类型的变量或者构造表达式，那么它可以是什么呢？

**NaN** 肯定是一个答案，从 ES6 开始，我们有一个新的选项，即 `Symbol() !== Symbol()`。

**Symbol（符号）用来生成唯一的值，确保每次调用结果不会重复**。这个特性可以用在很多场景，有点类似于之前我们用 Math.random() 或者 md5 生成唯一 key，但这些基于字符串的方式都存在冲突的可能，每次实现起来也略有麻烦，`Symbol` 解决了这个问题。

Symbol 除了可以让你生成唯一值以外，还定义了许多内置常量值，影响到了对象、字符串、正则等等的很多行为，可以说是至关重要。

本章节，我们就先来了解 Symbol 变量本身的构造、比较、类型转换，再来了解部分内置常量值的作用，能够让大家在日后的开发过程中充分发挥 Symbol 的价值。




## Symbol 创建

Symbol 类型可以由 `Symbol()` 函数或者 `Symbol.for()` 函数构造出来。

`Symbol()` 每次构造出一个新的变量，可以传入一个 key 参数，这样在显式转换为字符串时更方便辨认：

```js
Symbol("foo").toString() // "Symbol(foo)"
```

由于每次调用都是返回新值，因此你一旦丢失了对其的引用，就不容易找回来了。比如像下面这样，就只能通过遍历来找了：

```js
const person = {};

person[Symbol("name")] = "Mike";
```

不过即便是 `for...in` 遍历，也找不到：

```js
for (let key in person) console.log(key) // 找不到
```

像 `Object.keys()`、`Object.entries()`、`Object.getOwnPropertyNames()`，也都遍历不到，只有 `Object.getOwnPropertySymbols()` 可以：

```js
console.log(Object.getOwnPropertySymbols(person)); // [Symbol(name)]
```

如果你希望可以轻易地找回已经创建过的值，可以使用 `Symbol.for(key)` 方法。**Symbol 在全局会有一个注册表，`Symbol.for(key)` 会先去注册表中查找有无已经创建过的相同 key 的 Symbol，如果有，则返回，没有则创建**。

所以，`Symbol.for(key)` 的行为是这样的：

```js
Symbol.for("foo") === Symbol.for("foo") // true
```

虽然取回更简单，但是这样创建的 Symbol 已经和字符串没有什么分别：key 冲突，则 Symbol 值也冲突。

对于 `Symbol.for(key)` 创建的值，可以通过 `Symbol.keyFor(symbol)` 来获取 key，但是注意 `Symbol(key)` 创建的却不可以：

```js
Symbol.keyFor(Symbol.for("foo")) // "foo"
Symbol.keyFor(Symbol("foo")) // undefined
```

**Symbol 的另一特殊之处在于它不允许隐式转换为 String 或 Number：**

```js
+Symbol() // ❌ Uncaught TypeError: Cannot convert a Symbol value to a number
'' + Symbol() // ❌ Uncaught TypeError: Cannot convert a Symbol value to a string
```

如果你还是想转成字符串的话，比如打印的场景，可以有两种办法：

```js
String(Symbol("foo")) // "Symbol(foo)"
Symbol("foo").toString() // "Symbol(foo)"
```

前者可能更通用一些，能兼容 null、undefined 等空值。

> 💡 Symbol 转换成 Number 是没有办法的，因此确保 Symbol 值不会进入数学计算中。




## 常见 Symbol 值

Symbol 作为一个函数，同样也是一个对象，它上面携带了好多静态常量，包括 `Symbol.hasInstance`、`Symbol.isConcatSpreadable`、`Symbol.iterator`、`Symbol.asyncIterator`、`Symbol.match`、`Symbol.matchAll`、`Symbol.replace`、`Symbol.search`、`Symbol.species`、`Symbol.split`、`Symbol.toPrimitive`、`Symbol.toStringTag`、`Symbol.unscopables`。

今天我们来了解其中的一部分，余下的在后续的章节中也都有涉及。


### Symbol.match/matchAll/replace/search/split

从名字上就能看出来，这些值肯定和字符串的正则操作有关。在前面章节中，我们学习了在不同的需求下如何选择最合适的 API。

先是搜索，判断有无匹配，除了 RegExp 的 test 外，还可以使用 String 的 `search`，传入一个正则。

事实上，除了正则以外，search 也可以传入自定义对象，只需要这个对象内置了 `[Symbol.search]` 函数，比如：

```js
var customReg = {
    name: "foo",
    [Symbol.search](str) {
        return str.indexOf(this.name);
    }
};

console.log("barfoo".search(customReg)); // 3
```

举一反三，其余的 Symbol 也是这个用法，但是大家需要注意：**ECMAScript 并没有约束这个成员函数的返回值类型**。也就是说，search 可以不返回数字，match 可以不返回数组，matchAll 也可以不返回迭代器。

显然不建议这样做，TypeScript 对此做出了类型约束，例如对于 search 函数：

```ts
search(regexp: string | RegExp): number;
//                                                   ⬇️⬇️ 必须返回 number
search(searcher: { [Symbol.search](string: string): number; }): number;
```

事实上，我认为这个定义并不能准确反映 ECMAScript 的标准规范，规范里 String 的 search、match、matchAll、replace、replaceAll、split 方法并没有刻意去判断它的参数对象是否是一个 RegExp，只是看它有无 `[Symbol.search]`、`[Symbol.match]` 等属性。RegExp 对象作为合法的传入参数，它上面自然也携带了对应 Symbol 属性的定义，只不过在原型上：

```js
RegExp.prototype[Symbol.search]
RegExp.prototype[Symbol.match]
RegExp.prototype[Symbol.matchAll]
RegExp.prototype[Symbol.replace]
RegExp.prototype[Symbol.split]
```


### Symbol.hasInstance

这个 Symbol 用于判断一个变量是否是一个构造函数的实例，目前用于 `instanceof` 操作符的逻辑中。

事实上，在任意一个函数的原型链上，都有默认的 `Symbol.hasInstance` 属性，下面的代码可以证明：

```js
function Animal() {}

Object.getOwnPropertySymbols(Object.getPrototypeOf(Animal)); // [Symbol(Symbol.hasInstance)]
```

如果想修改其行为，不可以直接在 Animal 上赋值，因为会写到原型链上，而原型链上的这个 `Symbol.hasInstance` 属性是只读的。只可以在 Animal 对象本身上定义：

```js
Object.defineProperty(Animal, Symbol.hasInstance, {
    value(instance) {
        return true;
    },
});

// 修改 instanceof 行为
console.log("ABC" instanceof Animal);
```

更简单的方法是直接用 `class` 语法：

```js
class Animal {
    static [Symbol.hasInstance](instance) {
        return true;
    }
}
```

无论如何，记得 **Symbol.hasInstance 应定义在构造函数上，而不是对象实例上**。

> 关于 instanceof 的完整逻辑，我们在后面的章节中还会详细讲到。


### Symbol.isConcatSpreadable

这个 Symbol 用于 Array 的 `concat` 函数中。它的行为比较特殊，过去我们在合并两个数组的时候：

```js
[1,2].concat([3,4]) // [1,2,3,4]
```

这样的结果是毫无争议的。现在 `Symbol.isConcatSpreadable` 的引入让上面的代码有了另一种可能，也就是不展开参数：

```js
const arr = [3,4];
arr[Symbol.isConcatSpreadable] = false;
[1,2].concat(arr) // [1,2,[3,4]]
```

`concat` 也可以传入**类数组**：

```js
const obj  = {
    0: "A",
    1: "B",
    length: 2,
    [Symbol.isConcatSpreadable]: false
}

console.log([].concat[obj]); // [["A","B"]]
```

区别是：**concat 传入数组的时候，默认展开；但是传入类数组的时候，默认不展开**。因此，Symbol.isConcatSpreadable 更多的时候是针对传入非数组时候的行为定义。


### Symbol.species

species 带有“物种”的含义。这个 Symbol 的用处有一些特殊，并不容易理解。这样说吧，假设你有一个类 A，它有一些方法，比如 clone()，正常来说也应该返回一个 A 类型的对象。但是呢，`Symbol.species` 可以声明你返回的这个对象是用 A 创建，还是用其他任意构造器来创建。

注意，`Symbol.species` 只是用来声明“应该”使用的构造器，具体 clone() 怎么执行，完全是另一回事了。因此可以说，`Symbol.species` 基本只会影响一些内置的类型，比如 Array、TypedArray、RegExp、Promise、Map、Set、ArrayBuffer 等等。但是原则上，如果你定义的对象，通过某些方法可以生成一个“派生（`derived`，代表源于当前对象类型的）”对象，那么就可以通过引入 `Symbol.species` 来决定该派生对象该如何创建。

先来看内置的 Array 类型，它的 concat、filter、flat、flatMap、map、slice、splice 方法默认均返回 Array 类型数据。我们可以改变这一行为，但首先我们需要定义一个 Array 的子类：

```js
class SizableArray extends Array {
    static get [Symbol.species]() {
        return Array;
    }

    get size() {
        return this.length;
    }
}
```

通过将 SizableArray 的静态属性 `[Symbol.species]` 指向 Array，那么调用上述任一方法，返回的对象将不再是 SizableArray 类型，而是 Array：

```js
const arr = new SizableArray();

const sliced = arr.slice();

console.log(sliced.constructor); // Array
```

注意，Array 上面并非所有返回 Array 的方法都具备此特性，比如 sort、reverse、copyWithin，这三个方法都返回调用数组本身，因此仍然返回当前类型的对象，也就是 SizableArray 调用它们依然返回 SizableArray。再比如 `ES2023` 最新引入的 toSorted、toSpliced、toReversed、with 方法，虽然都返回新的数组实例，但是也不支持 `[Symbol.species]`。

> 和 Array 非常类似的还有 `TypedArray`，指那些 Int8Array、Uint8Array、Int32Array、BigInt64Array 这类对象。

ECMAScript 还在如下这些对象类型上也定义了 `[Symbol.species]`：

1.  `Promise`，它的 then、catch、finally 方法都会参考 `[Symbol.species]` 来决定生成的新 Promise 的构造函数；
2.  `ArrayBuffer`/`SharedArrayBuffer` 的 slice 方法，与 Array 类似；
3.  `RegExp` 原型链的 **Symbol.matchAll/split** 方法，用于在 String 调用 matchAll/split 时，构造指定的正则对象，举例来说：

```js
class MyReg extends RegExp {
    constructor(...args) {
        console.log('create MyReg', ...args);
        super(...args);
    }

    static get [Symbol.species]() {
        return RegExp;
    }
}

"AB56CD78".split(new MyReg("[A-Z]+",'g'));
```

matchAll 和 split 的特殊之处在于，**传入 String 对象的这两个方法的正则参数并没有被真正使用到，而是在内部又创建了一个新的正则对象**，那么这时候就会参考到 `[Symbol.species]` 来构造了。

> 大家不妨试一试上面的代码中，`[Symbol.species]` 返回 RegExp 或者 MyReg，console.log 都会打印几次。

`Map` 和 `Set` 也都定义了 `[Symbol.species]`，不过 ECMAScript 内部并没有使用到，如果你继承它们创建新的类，那么就可以考虑使用它。


### Symbol.unscopables

这个 Symbol 是为了 `with` 而设计的。它是一个**黑名单**，被标记的 key 不会从 with 的参数对象中获取，以 MDN 的例子来说明它的作用：

```js
var obj = {
  foo: 1,
  bar: 2
};

obj[Symbol.unscopables] = {
  foo: false,
  bar: true
};

with(obj) {
  console.log(foo); // 1
  console.log(bar); // ReferenceError: bar is not defined
}
```

除了极少数特殊场景之外，我们很难会使用到它，况且在 strict 模式下也不允许使用 `with`，因此我们就不用过多篇幅讲它了。





## 发挥 Symbol 的价值

上面我们学习了一部分 ECMAScript 内置的 Symbol 常量。在定义了这些值的变量或者类上，总会有不一样的行为出现。

仔细思考的话，Symbol 常量在这里面发挥的作用，是不是类似于 `Hook` 函数呢？如果进一步封装的话，更有类似于面向对象语言中的 `interface` 的意味，即任何对象（类）只要实现了对应的 Symbol 属性，就可以被功能模块所消费，而不管这个对象（类）到底是什么以及怎么创建的。

上面提到的 String 的 match/replace/split 等方法就是此场景的典型案例，它可以传入正则，也可以传入实现了制定 Symbol 属性的自定义对象。依照此思路，我们也可以设计自己的基于 Symbol 的功能拓展方式。

假设我们实现了一个 HTTP 服务器，接收到一个请求（request）后，指派给任意个处理器（handler）。处理器的逻辑通常由开发者来拓展实现。按照以往的思路，我们定义一个 Handler 类，开发者继承它实现派生类，实例化之后再传递给 HTTPServer：

```ts
abstract class Handler {
    abstract handle(req: Request): void;
}

class HTTPServer {
    handleRequest(handler: Handler) {
        handler.handle(new Request());
    }
}
```

现在我们多了一种设计模式，使用 Symbol 来代替抽象类：

```ts
const handlerSymbol = Symbol("HttpHandler");

class HTTPServer {
    handleRequest(handler: { [handlerSymbol](req: Request): void; }) {
        handler[handlerSymbol](new Request());
    }
}
```

这样的话，开发者在实现 handler 方面会更灵活，虽然依然需要引用 HTTPServer 提供的 Symbol 值，但是消除了类的继承，可以以任意方式创建对象，也不必受到单继承的限制。

这个设计利用的就是 Symbol **唯一值**的特性，也就是说，你的自定义对象的属性再怎样，也不会和这个预设值冲突。

这个特性也常常用在唯一性数据的存储上，比如 Map、Set 等数据结构，都支持储存 Symbol 或以 Symbol 为 key。

> `WeakSet`、`WeakMap` 对 Symbol 的支持存在浏览器上的差异性，不建议使用。



## 小结

Symbol 在**值唯一**这个特性上的作用能够支撑我们写出更加健壮的代码，不过也要注意它默认无法参与字符串和数字转换的的特征，作为对象的 key 也很难遍历得到，避免犯下低级错误。

Symbol 定义了很多**静态常量**，能够默默影响到许多策略，比如字符串搜索匹配、instanceof、with 等等。这种模式更像是一种钩子（Hooks）范式，能够实现不依赖类继承的能力拓展。

希望大家能善于使用 Symbol，充分利用其唯一性和静态常量来优化所编写代码的健壮性和灵活性。

当然 Symbol 的故事还没有完，有几个静态常量如 Symbol.toStringTag、Symbol.toPrimitive、Symbol.iterator、Symbol.asyncIterator，还有更重要的任务。

下一章，我们来聊聊数组。
