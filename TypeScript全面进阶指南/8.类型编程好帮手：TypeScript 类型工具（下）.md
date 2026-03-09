上一节我们主要了解了类型别名、联合类型与交叉类型、索引类型与映射类型这几样类型工具。在大部分时候，这些类型工具的作用是**基于已有的类型去创建出新的类型**，即类型工具的重要作用之一。

而除了类型的创建以外，**类型的安全保**障同样属于类型工具的能力之一，我们本节要介绍的就是两个主要用于类型安全的类型工具：**类型查询操作符**与**类型守卫**。

> 本节代码见：[Internal Type Tools](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F05_2-internal-type-tools)

## 类型查询操作符：熟悉又陌生的 typeof

TypeScript 存在两种功能不同的 typeof 操作符。我们最常见的一种 typeof 操作符就是 JavaScript 中，用于检查变量类型的 typeof ，它会返回 `"string"` / `"number"` / `"object"` / `"undefined"` 等值。而除此以外， TypeScript 还新增了用于类型查询的 typeof ，即 **Type Query Operator**，这个 typeof 返回的是一个 TypeScript 类型：

```typescript
const str = "linbudu";

const obj = { name: "linbudu" };

const nullVar = null;
const undefinedVar = undefined;

const func = (input: string) => {
  return input.length > 10;
}

type Str = typeof str; // "linbudu"
type Obj = typeof obj; // { name: string; }
type Null = typeof nullVar; // null
type Undefined = typeof undefined; // undefined
type Func = typeof func; // (input: string) => boolean
```

你不仅可以直接在类型标注中使用 typeof，还能在工具类型中使用 typeof。

```typescript
const func = (input: string) => {
  return input.length > 10;
}

const func2: typeof func = (name: string) => {
  return name === 'linbudu'
}
```

这里我们暂时不用深入了解 ReturnType 这个工具类型，只需要知道它会返回一个函数类型中返回值位置的类型：

```typescript
const func = (input: string) => {
  return input.length > 10;
}

// boolean
type FuncReturnType = ReturnType<typeof func>;
```

绝大部分情况下，typeof 返回的类型就是当你把鼠标悬浮在变量名上时出现的推导后的类型，并且是**最窄的推导程度（即到字面量类型的级别）**。你也不必担心混用了这两种 typeof，在逻辑代码中使用的 typeof 一定会是 JavaScript 中的 typeof，而类型代码（如类型标注、类型别名中等）中的一定是类型查询的 typeof 。同时，为了更好地避免这种情况，也就是隔离类型层和逻辑层，类型查询操作符后是不允许使用表达式的：

```typescript
const isInputValid = (input: string) => {
  return input.length > 10;
}

// 不允许表达式
let isValid: typeof isInputValid("linbudu");
```

## 类型守卫

TypeScript 中提供了非常强大的类型推导能力，它会随着你的代码逻辑不断尝试收窄类型，这一能力称之为**类型的控制流分析**（也可以简单理解为类型推导）。

这么说有点抽象，我们可以想象有一条河流，它从上而下流过你的程序，随着代码的分支分出一条条支流，在最后重新合并为一条完整的河流。在河流流动的过程中，如果遇到了有特定条件才能进入的河道（比如 if else 语句、switch case 语句等），那河流流过这里就会收集对应的信息，等到最后合并时，它们就会嚷着交流：**“我刚刚流过了一个只有字符串类型才能进入的代码分支！”** **“我刚刚流过了一个只有函数类型才能进入的代码分支！”**……就这样，它会把整个程序的类型信息都收集完毕。

```typescript
function foo (input: string | number) {
  if(typeof input === 'string') {}
  if(typeof input === 'number') {}
  // ...
}
```

我们在 never 类型一节中学到的也是如此。在类型控制流分析下，每流过一个 if 分支，后续联合类型的分支就少了一个，因为这个类型已经在这个分支处理过了，不会进入下一个分支：

```typescript
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true;
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}
```

在这里，我们实际上通过 if 条件中的表达式进行了类型保护，即告知了流过这里的分析程序每个 if 语句代码块中变量会是何类型。这即是编程语言的类型能力中最重要的一部分：**与实际逻辑紧密关联的类型**。我们从逻辑中进行类型地推导，再反过来让类型为逻辑保驾护航。

前面我们说到，类型控制流分析就像一条河流一样流过，那 if 条件中的表达式要是现在被提取出来了怎么办？

```typescript
function isString(input: unknown): boolean {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 类型“string | number”上不存在属性“replace”。
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```

奇怪的事情发生了，我们只是把逻辑提取到了外面而已，如果 isString 返回了 true，那 input 肯定也是 string 类型啊？

想象类型控制流分析这条河流，刚流进 `if (isString(input))` 就戛然而止了。因为 isString 这个函数在另外一个地方，内部的判断逻辑并不在函数 foo 中。这里的类型控制流分析做不到跨函数上下文来进行类型的信息收集（但别的类型语言中可能是支持的）。

实际上，将判断逻辑封装起来提取到函数外部进行复用非常常见。为了解决这一类型控制流分析的能力不足， TypeScript 引入了 **is 关键字**来显式地提供类型信息：

```typescript
function isString(input: unknown): input is string {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 正确了
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```

isString 函数称为类型守卫，在它的返回值中，我们不再使用 boolean 作为类型标注，而是使用 `input is string` 这么个奇怪的搭配，拆开来看它是这样的：

- input 函数的某个参数；
- `is string`，即 **is 关键字 + 预期类型**，即如果这个函数成功返回为 true，那么 is 关键字前这个入参的类型，就会**被这个类型守卫调用方后续的类型控制流分析收集到**。

需要注意的是，类型守卫函数中并不会对判断逻辑和实际类型的关联进行检查：

```typescript
function isString(input: unknown): input is number {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 报错，在这里变成了 number 类型
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
```

**从这个角度来看，其实类型守卫有些类似于类型断言，但类型守卫更宽容，也更信任你一些。你指定什么类型，它就是什么类型。** 除了使用简单的原始类型以外，我们还可以在类型守卫中使用对象类型、联合类型等，比如下面我开发时常用的两个守卫：

```typescript
export type Falsy = false | "" | 0 | null | undefined;

export const isFalsy = (val: unknown): val is Falsy => !val;

// 不包括不常用的 symbol 和 bigint
export type Primitive = string | number | boolean | undefined;

export const isPrimitive = (val: unknown): val is Primitive => ['string', 'number', 'boolean' , 'undefined'].includes(typeof val);
```

除了使用 typeof 以外，我们还可以使用许多类似的方式来进行类型保护，只要它能够在联合类型的类型成员中起到筛选作用。

### 基于 in 与 instanceof 的类型保护

[`in` 操作符](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FOperators%2Fin) 并不是 TypeScript 中新增的概念，而是 JavaScript 中已有的部分，它可以通过 `key in object` 的方式来判断 key 是否存在于 object 或其原型链上（返回 true 说明存在）。

既然能起到区分作用，那么 TypeScript 中自然也可以用它来保护类型：

```typescript
interface Foo {
  foo: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  bar: string;
  barOnly: boolean;
  shared: number;
}

function handle(input: Foo | Bar) {
  if ('foo' in input) {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```

这里的 foo / bar、fooOnly / barOnly、shared 属性们其实有着不同的意义。我们使用 foo 和 bar 来区分 input 联合类型，然后就可以在对应的分支代码块中正确访问到 Foo 和 Bar 独有的类型 fooOnly / barOnly。但是，如果用 shared 来区分，就会发现在分支代码块中 input 仍然是初始的联合类型：

```typescript
function handle(input: Foo | Bar) {
  if ('shared' in input) {
    // 类型“Foo | Bar”上不存在属性“fooOnly”。类型“Bar”上不存在属性“fooOnly”。
    input.fooOnly;
  } else {
    // 类型“never”上不存在属性“barOnly”。
    input.barOnly;
  }
}
```

这里需要注意的是，Foo 与 Bar 都满足 `'shared' in input` 这个条件。因此在 if 分支中， Foo 与 Bar 都会被保留，那在 else 分支中就只剩下 never 类型。

这个时候肯定有人想问，为什么 shared 不能用来区分？答案很明显，因为它同时存在两个类型中不具有辨识度。而 foo / bar 和 fooOnly / barOnly 是各个类型独有的属性，因此可以作为**可辨识属性（Discriminant Property 或 Tagged Property）**。Foo 与 Bar 又因为存在这样具有区分能力的辨识属性，可以称为**可辨识联合类型（Discriminated Unions 或 Tagged Union）**。虽然它们是一堆类型的联合体，但其中每一个类型都具有一个独一无二的，能让它鹤立鸡群的属性。

这个可辨识属性可以是结构层面的，比如结构 A 的属性 prop 是数组，而结构 B 的属性 prop 是对象，或者结构 A 中存在属性 prop 而结构 B 中不存在。

它甚至可以是共同属性的字面量类型差异：

```typescript
function ensureArray(input: number | number[]): number[] {
  if (Array.isArray(input)) {
    return input;
  } else {
    return [input];
  }
}

interface Foo {
  kind: 'foo';
  diffType: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  kind: 'bar';
  diffType: number;
  barOnly: boolean;
  shared: number;
}

function handle1(input: Foo | Bar) {
  if (input.kind === 'foo') {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```

如上例所示，对于同名但不同类型的属性，我们需要使用字面量类型的区分，并不能使用简单的 typeof：

```typescript
function handle2(input: Foo | Bar) {
  // 报错，并没有起到区分的作用，在两个代码块中都是 Foo | Bar
  if (typeof input.diffType === 'string') {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```

除此之外，JavaScript 中还存在一个功能类似于 typeof 与 in 的操作符：[instanceof](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FOperators%2Finstanceof)，它判断的是原型级别的关系，如 `foo instanceof Base` 会沿着 foo 的原型链查找 `Base.prototype` 是否存在其上。当然，在 ES6 已经无处不在的今天，我们也可以简单地认为这是判断 foo 是否是 Base 类的实例。同样的，instanceof 也可以用来进行类型保护：

```typescript
class FooBase {}

class BarBase {}

class Foo extends FooBase {
  fooOnly() {}
}
class Bar extends BarBase {
  barOnly() {}
}

function handle(input: Foo | Bar) {
  if (input instanceof FooBase) {
    input.fooOnly();
  } else {
    input.barOnly();
  }
}
```

除了使用 is 关键字的类型守卫以外，其实还存在使用 asserts 关键字的类型断言守卫。

### 类型断言守卫

如果你写过测试用例或者使用过 NodeJs 的 assert 模块，那对断言这个概念应该不陌生：

```typescript
import assert from 'assert';

let name: any = 'linbudu';

assert(typeof name === 'number');

// number 类型
name.toFixed();
```

上面这段代码在运行时会抛出一个错误，因为 assert 接收到的表达式执行结果为 false。这其实也类似类型守卫的场景：如果断言**不成立**，比如在这里意味着值的类型不为 number，那么在断言下方的代码就执行不到（相当于 Dead Code）。如果断言通过了，不管你最开始是什么类型，断言后的代码中就**一定是符合断言的类型**，比如在这里就是 number。

**但断言守卫和类型守卫最大的不同点在于，在判断条件不通过时，断言守卫需要抛出一个错误，类型守卫只需要剔除掉预期的类型。** 这里的抛出错误可能让你想到了 never 类型，但实际情况要更复杂一些，断言守卫并不会始终都抛出错误，所以它的返回值类型并不能简单地使用 never 类型。为此，TypeScript 3.7 版本专门引入了 asserts 关键字来进行断言场景下的类型守卫，比如前面 assert 方法的签名可以是这样的：

```typescript
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
```

这里使用的是 `asserts condition` ，而 condition 来自于实际逻辑！这也意味着，我们**将 condition 这一逻辑层面的代码，作为了类型层面的判断依据**，相当于在返回值类型中使用一个逻辑表达式进行了类型标注。

举例来说，对于 `assert(typeof name === 'number');` 这么一个断言，如果函数成功返回，就说明其后续的代码中 condition 均成立，也就是 name 神奇地变成了一个 number 类型。

这里的 condition 甚至还可以结合使用 is 关键字来提供进一步的类型守卫能力：

```typescript
let name: any = 'linbudu';

function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error('Not a number!');
  }
}

assertIsNumber(name);

// number 类型！
name.toFixed();
```

在这种情况下，你无需再为断言守卫传入一个表达式，而是可以将这个判断用的表达式放进断言守卫的内部，来获得更独立地代码逻辑。

## 总结与预告

在这一节，我们学习了一批新的类型工具，包括操作符 keyof、typeof，属于类型语法的交叉类型、索引类型（的三个部分）、映射类型、类型守卫等等。对这些工具的学习能够更好的帮助你更好的理解“类型编程”这个概念，即，原来对类型也是有这么多花样的！**原来类型编程真是对类型进行编程**！

在类型守卫部分，我们初次了解到了类型控制流分析的存在，以及使用类型保护、类型守卫来进行类型控制流的分析纠正等。同时，我们还学习了可辨识联合类型与可辨识属性的概念，想必以后你对如何处理联合类型会更有思路。

在下一节，我们就将开始学习泛型，它在许多语言中都是相当重要的类型能力。我们会了解泛型和类型别名的结合，以及它在接口、函数与 Class 中的作用，再到泛型约束、泛型默认值等概念，让你从此不再看到泛型就脑壳痛。

## 扩展阅读

### 接口的合并

在交叉类型一节中，你可能会注意到，接口和类型别名都能直接使用交叉类型。但除此以外，接口还能够使用继承进行合并，在继承时子接口可以声明同名属性，但并不能覆盖掉父接口中的此属性。**子接口中的属性类型需要能够兼容（extends）父接口中的属性类型**：

```typescript
interface Struct1 {
  primitiveProp: string;
  objectProp: {
    name: string;
  };
  unionProp: string | number;
}

// 接口“Struct2”错误扩展接口“Struct1”。
interface Struct2 extends Struct1 {
  // “primitiveProp”的类型不兼容。不能将类型“number”分配给类型“string”。
  primitiveProp: number;
  // 属性“objectProp”的类型不兼容。
  objectProp: {
    age: number;
  };
  // 属性“unionProp”的类型不兼容。
  // 不能将类型“boolean”分配给类型“string | number”。
  unionProp: boolean;
}
```

类似的，如果你直接声明多个同名接口，虽然接口会进行合并，但这些同名属性的类型仍然需要兼容，此时的表现其实和显式扩展接口基本一致：

```typescript
interface Struct1 {
  primitiveProp: string;
}

interface Struct1 {
// 后续属性声明必须属于同一类型。
// 属性“primitiveProp”的类型必须为“string”，但此处却为类型“number”。
  primitiveProp: number;
}
```

这也是接口和类型别名的重要差异之一。

那么接口和类型别名之间的合并呢？其实规则一致，如接口**继承**类型别名，和类型别名使用交叉类型**合并**接口：

```typescript
type Base = {
  name: string;
};

interface IDerived extends Base {
  // 报错！就像继承接口一样需要类型兼容
  name: number;
  age: number;
}

interface IBase {
  name: string;
}

// 合并后的 name 同样是 never 类型
type Derived = IBase & {
  name: number;
};
```

### 更强大的可辨识联合类型分析

类型控制流分析其实是一直在不断增强的，在 4.5、4.6、4.7 版本中都有或多或少的场景增强。而这里说的增强，其实就包括了**对可辨识联合类型的分析能力**。比如下面这个例子在此前（4.6 版本以前）的 TypeScript 代码中会报错：

```typescript
type Args = ['a', number] | ['b', string];

type Func = (...args: ["a", number] | ["b", string]) => void;

const f1: Func = (kind, payload) => {
  if (kind === "a") {
    // 仍然是 string | number
    payload.toFixed();
  }
  if (kind === "b") {
    // 仍然是 string | number
    payload.toUpperCase();
  }
};
```

而在 4.6 版本中则对这一情况下的 **联合类型辨识（即元组）** 做了支持。

如果你有兴趣了解 TypeScript 中的类型控制流分析以及更多可辨识联合类型的场景，可以阅读：[TypeScript 中的类型控制流分析演进](https://link.juejin.cn/?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F461842201)。