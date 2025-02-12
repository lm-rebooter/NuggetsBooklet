## class 是什么

一句话概括，`class 就是构造函数的语法糖`，就像 `async/await` 是 Promise 的语法糖一样。

不信的话，我们可以这样证明：

```js
class Foo {
    baz = 1;
    constructor(a, b) {}
    bar() {}
}

typeof Foo // "function"
Foo.name // "Foo"
Foo.length // 2
```

我们最需要关注的是函数的 `prototype` 属性，它关系到 `instanceof` 是否能正常工作，在 Chrome 下打印出来是这样的：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d55f96a4b0624c499206401dfd3f2ae3~tplv-k3u1fbpfcp-watermark.image" width="50%"></p>

可以清晰地看到，除了本来就该有的 `constructor` 外，bar 函数也出现在了里面，但是非函数的 baz 却没有。这很容易理解，函数可以在不同的实例之间重用，但是数据却是实例独享的。

作为一种语法糖，class 能实现的所有能力，我们用普通函数几乎都能实现。虽然如此，class 支持的 super、static 块、static 属性、私有属性、extend 继承等等特性，涉及到原型链查找、闭包等诸多细节，模拟起来并非易事。我以一小段代码为例，大家可以从现有的工具转换结构上窥见一二。

原始代码：

```js
class Parent {
    constructor(a, b) {}
    say() {}
}

class Child extends Parent {
    #baz = 1;
    constructor(a, b) {
        super(a, b);
    }
    bar() {}
    static walk() {}
}
```

`TypeScript` 转换后：

```js
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _Child_baz;
var Parent = /** @class */ (function () {
    function Parent(a, b) {
    }
    Parent.prototype.say = function () { };
    return Parent;
}());
var Child = /** @class */ (function (_super) {
    __extends(Child, _super);
    function Child(a, b) {
        var _this = _super.call(this, a, b) || this;
        _Child_baz.set(_this, 1);
        return _this;
    }
    Child.prototype.bar = function () { };
    Child.walk = function () { };
    return Child;
}(Parent));
_Child_baz = new WeakMap();
```

`Babel` 转换后：

```js
// 省略大量辅助函数

var Parent = /*#__PURE__*/function () {
  "use strict";

  function Parent(a, b) {
    _classCallCheck(this, Parent);
  }
  _createClass(Parent, [{
    key: "say",
    value: function say() {}
  }]);
  return Parent;
}();
var _baz = /*#__PURE__*/new WeakMap();
var Child = /*#__PURE__*/function (_Parent) {
  "use strict";

  _inherits(Child, _Parent);
  var _super = _createSuper(Child);
  function Child(a, b) {
    var _this;
    _classCallCheck(this, Child);
    _this = _super.call(this, a, b);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _baz, {
      writable: true,
      value: 1
    });
    return _this;
  }
  _createClass(Child, [{
    key: "bar",
    value: function bar() {}
  }], [{
    key: "walk",
    value: function walk() {}
  }]);
  return Child;
}(Parent);
```

即便舍去辅助函数的部分，实现一个最简单的类继承，竟然需要如此复杂的调用，可见 class 确实减少了很多编码成本，背后隐藏了大量对象的操作细节。

在本小册的基础篇即将结束之前，我想借着这个机会，将 class 作为一个典型案例，通过模拟实现它，在掌握其原理的同时，能够帮助大家进一步消化对象操作的相关知识。

我们观察 class 的基本结构：

```js
class Parent {
    name = '';
    static home = 'beijing';
    constructor(name) {
        this.name = name;
    }
    
    say() {
        console.log(`I am ${this.name}.`);
    }
}

class Child extends Parent {
    age = 5;
    static type = 'kid';
    constructor(name) {
        super(name);
    }
    
    say() {
        super.say();
        console.log(`And I am ${this.age} years old.`);
    }
    
    jump() {
        console.log(`I like jumping.`);
    }
}
```

这不是 class 语法的全部能力，但已经能涵盖绝大部分场景，我们一步一步来讲。上面的代码体现了下列几个功能：
1. 构造函数；
2. 类成员；
3. 继承，包括成员属性、成员函数、super；
4. 类`静态`成员。

我们接下来就以上面的代码作为案例，尝试**翻译**成普通 function 语法。




## 构造函数

无论是 function 语法还是 class 语法，最终都是用 `new` 操作符来创建对象实例。那么 `new` 到底做了什么事情呢？我们来模拟一下，实现一个 `createInstance` 函数。

```js
function createInstance(Constructor, ...args) {}
```

首先你的构造函数 Constructor 必须确定满足构造函数的定义。我们在前面的函数一章中讲到过，函数对象可能存在一个叫做 `[[Construct]]` 的内部方法，存在则代表它可以作为构造函数。显然异步函数、生成器函数就没有`[[Construct]]`。

一般对象的 `[[Construct]]` 方法的实现大致如下：
1. 创建一个对象 P，原型链指向 Constructor.prototype；
2. 生成一个上下文，有两个变量绑定需要关注，第一是 `this`，指向刚创建的 P，第二是 `new.target`，指向 Constructor；
3. 执行 Constructor 的代码，如果返回一个对象（即非 `Primitive` 值），那么就作为构造函数的结果，否则将 P 作为构造函数的结果。

用代码的话，可以近似表述成：

```js
function createInstance(Constructor, ...args) {
    const p = Object.create(Constructor.prototype);
    const result = Constructor.apply(p, args);

    if (result && typeof result === 'object') {
        return result;
    }
    
    return p;
}
```

这里无法实现的是 `new.target`，应该有很多人对此感到陌生。乍一看，似乎很难理解这种写法，`new` 怎么会是一个对象呢？

其实这里并不能理解成一个对象的属性，它是一种新的语法，`只能在函数中使用`，用来判断当前函数是否是通过 `new` 来调用的。如果你强制要求一个函数必须是构造函数，那么可以这样写：

```js
function Foo() {
    if (!new.target) 
        throw Error("Foo 必须作为构造函数使用。");
}
```

另一个值得关注的是，普通函数作为构造函数的话，返回的不一定是这个函数的实例，取决于它里面 return 的值类型。通常来说，构造函数不需要有返回值，但如果你一定要这么做，就需要明白这里的差异化逻辑：

```js
function Foo() {
    return [1];
}

new Foo(); // [1]
```

> 💡 即便是 `class` 语法也不能避免，它的 constructor 也可以有 return 语句。

上面我用 `Object.create` 来创建了对象，并直接关联了原型，这一步可以拆成下面两步：

```js
const p = {};
const result = Object.setPrototypeOf(p, Constructor.prototype)
```

可见所谓的构造函数创建对象，本质上无非也是一个大括号字面量对象的声明，加上一个设置原型的操作而已，没有什么神秘的。

创建完对象，我们来看类的成员该怎么实现。




## 类成员

类成员是不是函数类型，关系到实现的原理上的不同，差异还是很大的。我们可以这样理解，函数通过 `this/super` 来和对象进行交流，属于实例之间可复用的过程；而非函数则属于对象自身的资产，不可以在实例之间共享。

这就造成了两种属性被储存位置的不同。函数应当定义在原型中，也就是 `Constructor.prototype` 上，非函数要定义在对象自身上。

根据这个原理，以上面的 Parent 为例，我们第一印象里其 say 函数可以这样定义：

```js
Parent.prototype.say = function () {
    console.log(`I am ${this.name}.`);
};
```

但是我必须提醒大家，这样的写法严格来说是**不正确的**。因为 say 会被 `for...in` 遍历出来：

```js
for (const key in parentInstance) {
    console.log(key); // say...
}
```

这是被规范所不允许的，所以要换一种写法：

```js
Object.defineProperty(Parent.prototype, 'say', {
    value: function () {
        console.log(`I am ${this.name}.`);
    },
    // 不可枚举
    enumerable: false,
    writable: true,
    configurable: true,
});
```

非函数属性也有同样的问题。虽然是在当前对象上存储属性，但是也分成 set 和 defineProperty 两种形式。在把代码编译成 ES5 时，TypeScript 和 Babel 都分别提供了 `useDefineForClassFields` 和 `setPublicClassFields` 参数，来控制这一行为。

按照 ECMAScript 的标准规范，`class` 语法中的属性声明应该就是 defineProperty 的方式。比如上面 Parent 中的 name：

```js
function Parent(name) {
    Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: ''
    });

    this.name = name;
}
```

> 💡 注意，不同于函数成员，非函数应该是可枚举的，毕竟它属于对象而非其原型。


如果 `useDefineForClassFields` 设置成了 false，或者 `setPublicClassFields` 设置成了 true，代码会变成：

```js
function Parent(name) {
    this.name = '';
    this.name = name; // ❌
}
```

对于独立的类没有什么问题，但是一旦这个类继承自另一个类，那么上面这种 set 操作就很有可能修改到原型中的数据，产生副作用。

下面我们就看继承应该怎样实现。




## 类继承

还是以前面的代码为例，在用 function 实现了 Parent 之后，我们现在实现 Child 继承 Parent。大家注意看，这里的逻辑可能会比较绕，可以多看几遍。

在 Child 的构造函数中，首先必须调用 `super` 并传参数。这里的 `super` 毫无疑问就是父类 Parent，于是第一步：

```js
function Child(name) {
    Parent.call(this, name);
}
```

注意，这里我们假设 Child 由 `new` 调用，并没有展开为 `createInstance`，因此 `this` 首先就被创建了，并且在 Parent 中被定义了一个 name 自有属性。

接下来，Child 自己还有一个 age 属性，依然由 `defineProperty` 定义：

```js
function Child(name) {
    Parent.call(this, name);
    
    Object.defineProperty(this, "age", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 5
    });
}
```

到这一部分， Child 构造函数的使命已经达成，下面要解决的，是实现继承 Parent 上的函数属性，也就是说必须满足：

```js
childInstance.__proto__.__proto__... === Parent.prototype // true
```

而我们知道，`new` 有这样的效果：

```js
childInstance.__proto__ === Child.prototype // true
```

于是可推导出：

```js
Child.prototye.__proto__... === Parent.prototype // true

Child.prototye instanceof Parent === true
```

在声明 Child 函数的时候，它已经自带一个 Child.prototype 对象了，里面只有一个 constructor 不可枚举属性指向 Child。

那我们不妨实现一个该对象的超集，并满足上述推导式：

```js
Child.prototype = Object.create(Parent.prototype, {
    constructor: {
        value: Child,
        enumerable: false,
        writable: true,
        configurable: true,
    },
});
```

注意，Child 上还有一个自有的 jump 函数和一个调用了父类同名函数（通过 `super.<func>`）的 say 函数。作为函数，它们都应该出现在 Child.prototype 中，于是 Child.prototype 的最终定义可以写作：

```js
Child.prototype = Object.create(Parent.prototype, {
    constructor: {
        value: Child,
        enumerable: false,
        writable: true,
        configurable: true,
    },
    say: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            // 由 super.say() 翻译而来
            Parent.prototype.say.call(this);
            console.log(`And I am ${this.age} years old.`);
        }
    },
    jump: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log("I like jumping.");
        }
    },
});
```

> 注意 super.say()，可以等价写作 Parent.prototype.say.call(this)。

以上只是说明了用普通函数实现继承的大概原理，但是在生产环境中，还有很多细节需要考虑，比如：
1. 如果 Parent 是 null 怎么办？
2. 如果 Parent 有返回值怎们办？
3. Child 的 prototype 不应该被 `for...in` 遍历出来，怎么办？
4. 跨层级调用 super 怎么实现？
5. ……

大家可以顺着我上面的代码继续思考，看能不能把提到的这些问题一一解决。如果没有思路，建议大家去看一下 `Babel` 或者 `TypeScript` 的编译产出。不过它们的实现也并不一致，孰优孰劣，留给大家自己去判断了。

现在我们回过头来思考一下类的非函数成员，应该用 set 还是 defineProperty 的问题。通过刚刚对继承的实现，我们可以总结出：**本质上沿着原型链继承的只是函数，其他属性都是定义在当前对象上的，和原型链无关**。

`getter/setter` 本质上也是函数，也会定义在原型中，比如：

```js
class Parent {
    set alias() {}
    get alias() {}
}
```

等价于：

```js
Object.defineProperty(Parent.prototype, 'alias', {
    get(){},
    set(){},
    enumerable: false,
    configurable: true
});
```

那么如果 Child 也有一个同名的属性：

```js
class Child {
    alias = ""
}
```

如果以 set 的方式定义，那么就是：

```js
function Child() {
    this.alias = "";
}
```

显然，**set alias 会作用到原型链中，而不是当前对象**。我们在前面章节中提到过，赋值操作，也就是 `PutValue`，如果遇到原型链中有同名的存取器属性，就会写入到原型链上；如果没有，或者是数据属性，那么就会写入到当前对象上。这就是用 set 来定义函数成员的潜在风险。

如果你确定没有这样的风险，或者某些特殊的场景（比如 WebComponents），才可以把 `useDefineForClassFields` 设置成了 false、把 `setPublicClassFields` 设置成了 true。

继承还有最后一步：静态成员。




## 类静态成员

静态成员是属于类本身的，在实例之间共享，或者说它压根就是一个全局变量。Parent 的 home 直接定义在 Parent 上：

```js
Parent.home = "beijing";
```

Child 同样：

```js
Child.type = "kid";
```

按照继承的规则，在 Child 也应该可以访问到 home，于是我们用原型链的方式来解决：

```js
Object.setPrototypeOf(Child, Parent);
```

即 `Child.__proto__ === Parent`。这是函数本身的原型链操作，而非对象实例的。大家千万要区分 `Child.__proto__` 和 `Child.prototype`。前者等于 `Function.prototype`，而后者就是在定义函数时生成的一个普通对象，内部有一个 constructor 指向 Child 本身。

这样的话，上面示例代码中的所有特性，我们都已经实现了。





## 小结

本章节我用大量的代码来演示了如何把 class 语法改写成 function 语法。虽然在现代的前端开发环境中，这已经越来越没有实际的应用价值，但是却能有效地让我们充分理解 class 语法背后的原子逻辑，包括对象创建、属性定义、原型链等等。

然而本文也仅仅是实现了关键逻辑，还有很多细节受限于篇幅，没有详细讨论，大家如果感兴趣的话，可以尝试补上，当作是一个练习题，继续巩固相关知识。

经过几章的时间，我们关于 ECMAScript 中**对象**的学习就先告一段落了。高度抽象的话，核心原子操作无非是`属性`、`原型链`和`遍历`。本文的 `class` 只是语法糖，背后仍然是规范化的各种原子操作的组合。

熟悉了基本对象的各种操作和概念之后，我们就可以展开学习 JavaScript 的各种高级特性了，它们很大程度上都依赖于对象的这些操作。
