在前面的入门环节中，我们了解了日常开发中最常用的、基础的变量类型标注，包括原始类型、对象类型、字面量类型与枚举类型。而实际开发中还有一个重要的朋友：**函数**。函数能够帮助我们进一步抽离与封装代码逻辑，所以掌握函数类型必不可少。如果说函数代表着面向过程的编程，那么 Class 则代表着面向对象的编程，而它也是 ES6 新特性的重要一部分———我们终于可以和各种花式继承告别了。

这一节，我们会介绍函数与 Class 的类型标注，以及一些在 TypeScript 中独有或相比 JavaScript 更加完全的概念，如**重载**与**面向对象的编程**等。函数部分，我们主要关注其参数类型、返回值类型以及重载的应用。 Class部分，除了类型以外，我们还会学习访问性修饰符、继承、抽象类等来自于面向对象理念的实际使用。

这一节之后，我们就算正式入门 TypeScript 了。此时，你已经掌握了从 JavaScript 迁移到 TypeScript 后的主要技巧，可以开始大胆地在新项目中使用 TypeScript 了。

是不是很期待？让我们赶快开始今天的课程吧！

> 本节代码见：[Function and Class](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F03-function-and-class)

## 函数

### 函数的类型签名

如果说变量的类型是描述了这个变量的值类型，那么函数的类型就是描述了**函数入参类型与函数返回值类型**，它们同样使用`:`的语法进行类型标注。我们直接看最简单的例子：

```typescript
function foo(name: string): number {
  return name.length;
}
```

在函数类型中同样存在着类型推导。比如在这个例子中，你可以不写返回值处的类型，它也能被正确推导为 number 类型。

在 JavaScript 中，我们称 `function name () {}` 这一声明函数的方式为**函数声明（\*Function Declaration\*）**。除了函数声明以外，我们还可以通过**函数表达式（\*Function Expression\*）**，即 `const foo = function(){}` 的形式声明一个函数。在表达式中进行类型声明的方式是这样的：

```typescript
const foo = function (name: string): number {
  return name.length
}
```

我们也可以像对变量进行类型标注那样，对 `foo` 这个变量进行类型声明：

```typescript
const foo: (name: string) => number = function (name) {
  return name.length
}
```

这里的 `(name: string) => number` 看起来很眼熟，对吧？它是 ES6 的重要特性之一：箭头函数。但在这里，它其实是 TypeScript 中的**函数类型签名**。而实际的箭头函数，我们的类型标注也是类似的：

```typescript
// 方式一
const foo = (name: string): number => {
  return name.length
}

// 方式二
const foo: (name: string) => number = (name) => {
  return name.length
}
```

在方式二的声明方式中，你会发现函数类型声明混合箭头函数声明时，代码的可读性会非常差。因此，一般不推荐这么使用，要么**直接在函数中进行参数和返回值的类型声明**，要么**使用类型别名将函数声明抽离出来**：

```typescript
type FuncFoo = (name: string) => number

const foo: FuncFoo = (name) => {
  return name.length
}
```

如果只是为了描述这个函数的类型结构，我们甚至可以使用 interface 来进行函数声明：

```typescript
interface FuncFooStruct {
  (name: string): number
}
```

这时的 interface 被称为 **Callable Interface**，看起来可能很奇怪，但我们可以这么认为，interface 就是用来描述一个类型结构的，而函数类型本质上也是一个结构固定的类型罢了。

### void 类型

在 TypeScript 中，一个没有返回值（即没有调用 return 语句）的函数，其返回类型应当被标记为 void 而不是 undefined，即使它实际的值是 undefined。

```typescript
// 没有调用 return 语句
function foo(): void { }

// 调用了 return 语句，但没有返回值
function bar(): void {
  return;
}
```

原因和我们在原始类型与对象类型一节中讲到的：**在 TypeScript 中，undefined 类型是一个实际的、有意义的类型值，而 void 才代表着空的、没有意义的类型值。** 相比之下，void 类型就像是 JavaScript 中的 null 一样。因此在我们没有实际返回值时，使用 void 类型能更好地说明这个函数**没有进行返回操作**。但在上面的第二个例子中，其实更好的方式是使用 undefined ：

```typescript
function bar(): undefined {
  return;
}
```

此时我们想表达的则是，这个函数**进行了返回操作，但没有返回实际的值**。

### 可选参数与 rest 参数

在很多时候，我们会希望函数的参数可以更灵活，比如它不一定全都必传，当你不传入参数时函数会使用此参数的默认值。正如在对象类型中我们使用 `?` 描述一个可选属性一样，在函数类型中我们也使用 `?` 描述一个可选参数：

```typescript
// 在函数逻辑中注入可选参数默认值
function foo1(name: string, age?: number): number {
  const inputAge = age || 18; // 或使用 age ?? 18
  return name.length + inputAge
}

// 直接为可选参数声明默认值
function foo2(name: string, age: number = 18): number {
  const inputAge = age;
  return name.length + inputAge
}
```

需要注意的是，**可选参数必须位于必选参数之后**。毕竟在 JavaScript 中函数的入参是按照位置（形参），而不是按照参数名（名参）进行传递。当然，我们也可以直接将可选参数与默认值合并，但此时就不能够使用 `?` 了，因为既然都有默认值，那肯定是可选参数啦。

```typescript
function foo(name: string, age: number = 18): number {
  const inputAge = age || 18;
  return name.length + inputAge
}
```

在某些情况下，这里的可选参数类型也可以省略，如这里原始类型的情况可以直接从提供的默认值类型推导出来。但对于联合类型或对象类型的复杂情况，还是需要老老实实地进行标注。

对于 rest 参数的类型标注也比较简单，由于其实际上是一个数组，这里我们也应当使用数组类型进行标注：

> 对于 any 类型，你可以简单理解为它包含了一切可能的类型，我们会在下一节详细介绍。

```typescript
function foo(arg1: string, ...rest: any[]) { }
```

当然，你也可以使用我们前面学习的元祖类型进行标注：

```typescript
function foo(arg1: string, ...rest: [number, boolean]) { }

foo("linbudu", 18, true)
```

### 重载

在某些逻辑较复杂的情况下，函数可能有多组入参类型和返回值类型：

```typescript
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}
```

在这个实例中，函数的返回类型基于其入参 `bar` 的值，并且从其内部逻辑中我们知道，当 `bar` 为 true，返回值为 string 类型，否则为 number 类型。而这里的类型签名完全没有体现这一点，我们只知道它的返回值是这么个联合类型。

要想实现与入参关联的返回值类型，我们可以使用 TypeScript 提供的**函数重载签名（\*Overload Signature\*）**，将以上的例子使用重载改写：

```typescript
function func(foo: number, bar: true): string;
function func(foo: number, bar?: false): number;
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}

const res1 = func(599); // number
const res2 = func(599, true); // string
const res3 = func(599, false); // number
```

这里我们的三个 `function func` 其实具有不同的意义：

- `function func(foo: number, bar: true): string`，重载签名一，传入 bar 的值为 true 时，函数返回值为 string 类型。
- `function func(foo: number, bar?: false): number`，重载签名二，不传入 bar，或传入 bar 的值为 false 时，函数返回值为 number 类型。
- `function func(foo: number, bar?: boolean): string | number`，函数的实现签名，会包含重载签名的所有可能情况。

基于重载签名，我们就实现了将入参类型和返回值类型的可能情况进行关联，获得了更精确的类型标注能力。

这里有一个需要注意的地方，拥有多个重载声明的函数在被调用时，是按照重载的声明顺序往下查找的。因此在第一个重载声明中，为了与逻辑中保持一致，即在 bar 为 true 时返回 string 类型，这里我们需要将第一个重载声明的 bar 声明为必选的字面量类型。

> 你可以试着为第一个重载声明的 bar 参数也加上可选符号，然后就会发现第一个函数调用错误地匹配到了第一个重载声明。

实际上，TypeScript 中的重载更像是伪重载，**它只有一个具体实现，其重载体现在方法调用的签名上而非具体实现上**。而在如 C++ 等语言中，重载体现在多个**名称一致但入参不同的函数实现上**，这才是更广义上的函数重载。

### 异步函数、Generator 函数等类型签名

对于异步函数、Generator 函数、异步 Generator 函数的类型签名，其参数签名基本一致，而返回值类型则稍微有些区别：

```typescript
async function asyncFunc(): Promise<void> {}

function* genFunc(): Iterable<void> {}

async function* asyncGenFunc(): AsyncIterable<void> {}
```

其中，Generator 函数与异步 Generator 函数现在已经基本不再使用，这里仅做了解即可。而对于异步函数（即标记为 async 的函数），其返回值必定为一个 Promise 类型，而 Promise 内部包含的类型则通过泛型的形式书写，即 `Promise<T>`（关于泛型我们会在后面进行详细了解）。

在函数这一节中，我们主要关注函数的类型标注。因为 TypeScript 中的函数实际上相比 JavaScript 也只是多在重载这一点上，我们需要着重掌握的仍然是类型标注。但在 Class 中，我们的学习重点其实更侧重于其语法与面向对象的编程理念。

## Class

### 类与类成员的类型签名

一个函数的主要结构即是参数、逻辑和返回值，对于逻辑的类型标注其实就是对普通代码的标注，所以我们只介绍了对参数以及返回值地类型标注。而到了 Class 中其实也一样，它的主要结构只有**构造函数**、**属性**、**方法**和**访问符（\*Accessor\*）**，我们也只需要关注这三个部分即可。这里我要说明一点，有的同学可能认为装饰器也是 Class 的结构，但我个人认为它并不是 Class 携带的逻辑，不应该被归类在这里。

> 而对于这些结构的具体意义以及 Class 的入门语法，你可以阅读阮一峰老师的 ES6 标准入门。

属性的类型标注类似于变量，而构造函数、方法、存取器的类型编标注类似于函数：

```typescript
class Foo {
  prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  get propA(): string {
    return `${this.prop}+A`;
  }

  set propA(value: string) {
    this.prop = `${value}+A`
  }
}
```

唯一需要注意的是，setter 方法**不允许进行返回值的类型标注**，你可以理解为 setter 的返回值并不会被消费，它是一个只关注过程的函数。类的方法同样可以进行函数那样的重载，且语法基本一致，这里我们不再赘述。

就像函数可以通过**函数声明**与**函数表达式**创建一样，类也可以通过**类声明**和**类表达式**的方式创建。很明显上面的写法即是类声明，而使用类表达式的语法则是这样的：

```typescript
const Foo = class {
  prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }
  
  // ...
}
```

### 修饰符

在 TypeScript 中我们能够为 Class 成员添加这些修饰符：`public` / `private` / `protected` / `readonly`。除 readonly 以外，其他三位都属于访问性修饰符，而 readonly 属于操作性修饰符（就和 interface 中的 readonly 意义一致）。

这些修饰符应用的位置在成员命名前：

```typescript
class Foo {
  private prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  protected print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  public get propA(): string {
    return `${this.prop}+A`;
  }

  public set propA(value: string) {
    this.propA = `${value}+A`
  }
}
```

> 我们通常不会为构造函数添加修饰符，而是让它保持默认的 public。在扩展阅读中我们会讲到 private 修饰构造函数的场景。

如果没有其他语言学习经验，你可能不太理解 public / private / protected 的意义，我们简单做个解释。

- public：此类成员在**类、类的实例、子类**中都能被访问。
- private：此类成员仅能在**类的内部**被访问。
- protected：此类成员仅能在**类与子类中**被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即**不允许再访问受保护的成员**。

当你不显式使用访问性修饰符，成员的访问性默认会被标记为 public。实际上，在上面的例子中，我们通过构造函数为类成员赋值的方式还是略显麻烦，需要声明类属性以及在构造函数中进行赋值。简单起见，我们可以**在构造函数中对参数应用访问性修饰符**：

```typescript
class Foo {
  constructor(public arg1: string, private arg2: boolean) { }
}

new Foo("linbudu", true)
```

此时，参数会被直接作为类的成员（即实例的属性），免去后续的手动赋值。

### 静态成员

在 TypeScript 中，你可以使用 static 关键字来标识一个成员为静态成员：

```typescript
class Foo {
  static staticHandler() { }

  public instanceHandler() { }
}
```

不同于实例成员，在类的内部静态成员无法通过 this 来访问，需要通过 `Foo.staticHandler` 这种形式进行访问。我们可以查看编译到 ES5 及以下 target 的 JavaScript 代码（ES6 以上就原生支持静态成员了），来进一步了解它们的区别：

```javascript
var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo.staticHandler = function () { };
    Foo.prototype.instanceHandler = function () { };
    return Foo;
}());
```

从中我们可以看到，**静态成员直接被挂载在函数体上**，而**实例成员挂载在原型上**，这就是二者的最重要差异：**静态成员不会被实例继承，它始终只属于当前定义的这个类（以及其子类）**。而原型对象上的实例成员则会**沿着原型链进行传递**，也就是能够被继承。

而对于静态成员和实例成员的使用时机，其实并不需要非常刻意地划分。比如我会用**类 + 静态成员**来收敛变量与 utils 方法：

```typescript
class Utils {
  public static identifier = "linbudu";

  public static makeUHappy() {
    Utils.studyWithU();
    // ...
  }

  public static studyWithU() { }
}

Utils.makeUHappy();
```

### 继承、实现、抽象类

既然说到 Class，那就一定离不开继承。与 JavaScript 一样，TypeScript 中也使用 extends 关键字来实现继承：

```typescript
class Base { }

class Derived extends Base { }
```

对于这里的两个类，比较严谨的称呼是 **基类（\*Base\*）** 与 **派生类（\*Derived\*）**。当然，如果你觉得叫父类与子类更容易理解也没问题。关于基类与派生类，我们需要了解的主要是**派生类对基类成员的访问与覆盖操作**。

基类中的哪些成员能够被派生类访问，完全是由其访问性修饰符决定的。我们在上面其实已经介绍过，派生类中可以访问到使用 `public` 或 `protected` 修饰符的基类成员。除了访问以外，基类中的方法也可以在派生类中被覆盖，但我们仍然可以通过 super 访问到基类中的方法：

```typescript
class Base {
  print() { }
}

class Derived extends Base {
  print() {
    super.print()
    // ...
  }
}
```

在派生类中覆盖基类方法时，我们并不能确保派生类的这一方法能覆盖基类方法，万一基类中不存在这个方法呢？所以，TypeScript 4.3 新增了 `override` 关键字，来确保派生类尝试覆盖的方法一定在基类中存在定义：

```typescript
class Base {
  printWithLove() { }
}

class Derived extends Base {
  override print() {
    // ...
  }
}
```

在这里 TS 将会给出错误，因为**尝试覆盖的方法并未在基类中声明**。通过这一关键字我们就能确保首先这个方法在基类中存在，同时标识这个方法在派生类中被覆盖了。

除了基类与派生类以外，还有一个比较重要的概念：**抽象类**。抽象类是对类结构与方法的抽象，简单来说，**一个抽象类描述了一个类中应当有哪些成员（属性、方法等）**，**一个抽象方法描述了这一方法在实际实现中的结构**。我们知道类的方法和函数非常相似，包括结构，因此抽象方法其实描述的就是这个方法的**入参类型**与**返回值类型**。

抽象类使用 abstract 关键字声明：

```typescript
abstract class AbsFoo {
  abstract absProp: string;
  abstract get absGetter(): string;
  abstract absMethod(name: string): string
}
```

注意，抽象类中的成员也需要使用 abstract 关键字才能被视为抽象类成员，如这里的抽象方法。我们可以实现（implements）一个抽象类：

```typescript
class Foo implements AbsFoo {
  absProp: string = "linbudu"

  get absGetter() {
    return "linbudu"
  }

  absMethod(name: string) {
    return name
  }
}
```

此时，我们必须完全实现这个抽象类的每一个抽象成员。需要注意的是，在 TypeScript 中**无法声明静态的抽象成员**。

对于抽象类，它的本质就是描述类的结构。看到结构，你是否又想到了 interface？是的。interface 不仅可以声明函数结构，也可以声明类的结构：

```typescript
interface FooStruct {
  absProp: string;
  get absGetter(): string;
  absMethod(input: string): string
}

class Foo implements FooStruct {
  absProp: string = "linbudu"

  get absGetter() {
    return "linbudu"
  }

  absMethod(name: string) {
    return name
  }
}
```

在这里，我们让类去实现了一个接口。这里接口的作用和抽象类一样，都是**描述这个类的结构**。除此以外，我们还可以使用 **Newable Interface** 来描述一个类的结构（类似于描述函数结构的 **Callable Interface**）：

```typescript
class Foo { }

interface FooStruct {
  new(): Foo
}

declare const NewableFoo: FooStruct;

const foo = new NewableFoo();

// 上面有问题，参考这个
// https://stackoverflow.com/questions/13407036/how-does-interfaces-with-construct-signatures-work
interface Foo {
    name: string;
}

interface FooStruct {
    new(n: string): Foo;
}

class FooFromString implements Foo {
    constructor (public name: string) {
        console.log('ctor invoked');
    }
}

function FooObj(n: FooStruct) {
    return new n('hello!');
}

console.log(FooObj(FooFromString).name);
```

## 总结与预告

在这一节，我们了解了 TypeScript 中的函数与类，它们分别代表了面向过程与面向对象的编程理念。对于函数，我们着重了解其结构体的类型，即参数类型（可选参数与剩余参数）与返回值类型的标注。而对于类，实际上我们了解的更多是新的语法，如访问性修饰符 `public` / `private` / `protected` ，操作修饰符 `readonly` ，静态成员 static ，抽象类 abstract ，以及 override 等在 JavaScript（ECMAScript）中不存在或实现并不完全的能力。

对于函数与类，你需要更多地实际使用才能掌握得更好。不妨继续对你手上的 JavaScript 进行改造，让函数与类都能披上类型的铠甲，获得完整的类型能力。

在下一节，我们将要接触的就是 JavaScript 中完全没有类似概念的新朋友了，它们是 TypeScript 类型编程最基础的一部分，包括了 any 、 unknown 、never 内置类型，以及类型断言等概念，这些类型工具会是你以后玩转类型编程时最常打交道的一部分。

## 扩展阅读

### 私有构造函数

上面说到，我们通常不会对类的构造函数进行访问性修饰，如果我们一定要试试呢？

```typescript
class Foo {
  private constructor() { }
}
```

看起来好像没什么问题，但是当你想要实例化这个类时，一行美丽的操作就会出现：**类的构造函数被标记为私有，且只允许在类内部访问**。

那这就很奇怪了，我们要一个不能实例化的类有啥用？摆设吗？

还真不是，有些场景下私有构造函数确实有奇妙的用法，比如像我一样把类作为 utils 方法时，此时 Utils 类内部全部都是静态成员，我们也并不希望真的有人去实例化这个类。此时就可以使用私有构造函数来阻止它被错误地实例化：

```typescript
class Utils {
  public static identifier = "linbudu";
  
  private constructor(){}

  public static makeUHappy() {
  }
}
```

或者在一个类希望把实例化逻辑通过方法来实现，而不是通过 new 的形式时，也可以使用私有构造函数来达成目的。

你可能会想到，既然有私有构造函数，那没道理没有受保护的构造函数（`protected`）啊？还真有。但这里我想留给你自己去探寻，你可以先查找下这么做的意义，再想想，什么场景下我们非用它不可？

### SOLID 原则

SOLID 原则是面向对象编程中的基本原则，它包括以下这些五项基本原则。

S，**单一功能原则**，**一个类应该仅具有一种职责**，这也意味着只存在一种原因使得需要修改类的代码。如对于一个数据实体的操作，其读操作和写操作也应当被视为两种不同的职责，并被分配到两个类中。更进一步，对实体的业务逻辑和对实体的入库逻辑也都应该被拆分开来。

O，**开放封闭原则**，**一个类应该是可扩展但不可修改的**。即假设我们的业务中支持通过微信、支付宝登录，原本在一个 login 方法中进行 if else 判断，假设后面又新增了抖音登录、美团登录，难道要再加 else if 分支（或 switch case）吗？

```typescript
enum LoginType {
  WeChat,
  TaoBao,
  TikTok,
  // ...
}

class Login {
  public static handler(type: LoginType) {
    if (type === LoginType.WeChat) { }
    else if (type === LoginType.TikTok) { }
    else if (type === LoginType.TaoBao) { }
    else {
      throw new Error("Invalid Login Type!")
    }
  }
}
```

当然不，基于开放封闭原则，我们应当将登录的基础逻辑抽离出来，不同的登录方式通过扩展这个基础类来实现自己的特殊逻辑。

```typescript
abstract class LoginHandler {
  abstract handler(): void
}

class WeChatLoginHandler implements LoginHandler {
  handler() { }
}

class TaoBaoLoginHandler implements LoginHandler {
  handler() { }
}

class TikTokLoginHandler implements LoginHandler {
  handler() { }
}

class Login {
  public static handlerMap: Record<LoginType, LoginHandler> = {
    [LoginType.TaoBao]: new TaoBaoLoginHandler(),
    [LoginType.TikTok]: new TikTokLoginHandler(),
    [LoginType.WeChat]: new WeChatLoginHandler(),

  }
  public static handler(type: LoginType) {
    Login.handlerMap[type].handler()
  }
}
```

L，**里式替换原则**，**一个派生类可以在程序的任何一处对其基类进行替换**。这也就意味着，子类完全继承了父类的一切，对父类进行了功能地扩展（而非收窄）。

I，**接口分离原则**，**类的实现方应当只需要实现自己需要的那部分接口**。比如微信登录支持指纹识别，支付宝支持指纹识别和人脸识别，这个时候微信登录的实现类应该不需要实现人脸识别方法才对。这也就意味着我们提供的抽象类应当按照功能维度拆分成粒度更小的组成才对。

D，**依赖倒置原则**，这是实现开闭原则的基础，它的核心思想即是**对功能的实现应该依赖于抽象层**，即不同的逻辑通过实现不同的抽象类。还是登录的例子，我们的登录提供方法应该基于共同的登录抽象类实现（LoginHandler），最终调用方法也基于这个抽象类，而不是在一个高阶登录方法中去依赖多个低阶登录提供方。